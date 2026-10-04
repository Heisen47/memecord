import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { classifyHandPose } from './classifier';
import { GestureStateMachine } from './state-machine';
import { GestureDetectionResult, GestureType, CameraStatusInfo, AppSettings } from '../shared/types';

export interface GestureDetectorCallbacks {
  onGestureTriggered: (gesture: Exclude<GestureType, 'none'>, confidence: number) => void;
  onDetectionUpdate?: (result: GestureDetectionResult) => void;
  onCameraStatusChange?: (status: CameraStatusInfo) => void;
}

export class GestureDetector {
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private handLandmarker: HandLandmarker | null = null;
  private stateMachine: GestureStateMachine;
  private animationFrameId: number | null = null;
  private lastProcessTime: number = 0;
  private targetFps: number = 15;
  private isRunning: boolean = false;
  private isInitializing: boolean = false;

  private cameraStatus: CameraStatusInfo = {
    active: false,
    permissionGranted: false
  };

  private callbacks: GestureDetectorCallbacks;

  constructor(settings: AppSettings, callbacks: GestureDetectorCallbacks) {
    this.callbacks = callbacks;
    this.targetFps = settings.fps || 15;

    this.stateMachine = new GestureStateMachine({
      stabilityThresholdMs: settings.stabilityThresholdMs,
      cooldownDurationMs: settings.cooldownMs,
      onTrigger: (gesture, confidence) => {
        this.callbacks.onGestureTriggered(gesture, confidence);
      },
      onStatusChange: (_status) => {
        // Broadcast or pass status if needed
      }
    });
  }

  public getStateMachine(): GestureStateMachine {
    return this.stateMachine;
  }

  public getCameraStatus(): CameraStatusInfo {
    return { ...this.cameraStatus };
  }

  public updateSettings(settings: AppSettings) {
    this.targetFps = settings.fps || 15;
    this.stateMachine.updateConfig(settings.stabilityThresholdMs, settings.cooldownMs);
  }

  public async start(): Promise<boolean> {
    if (this.isRunning || this.isInitializing) {
      return true;
    }

    this.isInitializing = true;
    try {
      // 1. Initialize MediaPipe HandLandmarker if not already created
      if (!this.handLandmarker) {
        await this.initMediaPipe();
      }

      // 2. Request user webcam stream with lightweight dimensions
      await this.initCamera();

      this.isRunning = true;
      this.isInitializing = false;
      this.updateCameraStatus({ active: true, permissionGranted: true, error: undefined });

      // 3. Start processing loop
      this.startLoop();
      return true;
    } catch (err: any) {
      this.isInitializing = false;
      this.isRunning = false;
      console.warn('[MemeMeet] Failed to start gesture detector:', err);

      let errorMessage = 'Camera access failed';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found on device';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera already in use by another app';
      } else if (err.message) {
        errorMessage = err.message;
      }

      this.updateCameraStatus({
        active: false,
        permissionGranted: false,
        error: errorMessage
      });

      this.stop();
      return false;
    }
  }

  public stop() {
    this.isRunning = false;
    this.isInitializing = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          // ignore
        }
      });
      this.stream = null;
    }

    if (this.video) {
      this.video.pause();
      this.video.srcObject = null;
      this.video = null;
    }

    this.stateMachine.reset();
    this.updateCameraStatus({ active: false, permissionGranted: this.cameraStatus.permissionGranted });
  }

  private async initMediaPipe() {
    const wasmBase =
      typeof chrome !== 'undefined' && chrome.runtime?.getURL
        ? chrome.runtime.getURL('mediapipe/wasm')
        : '/mediapipe/wasm';

    const modelPath =
      typeof chrome !== 'undefined' && chrome.runtime?.getURL
        ? chrome.runtime.getURL('models/hand_landmarker.task')
        : '/models/hand_landmarker.task';

    const vision = await FilesetResolver.forVisionTasks(wasmBase);

    try {
      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: modelPath,
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
    } catch (gpuError) {
      console.warn('[MemeMeet] WebGL/GPU delegate failed, falling back to CPU:', gpuError);
      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: modelPath,
          delegate: 'CPU'
        },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
    }
  }

  private async initCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Webcam mediaDevices API not supported in this context');
    }

    // Low resolution for minimal CPU overhead (320x240 @ 15fps)
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 320 },
        height: { ideal: 240 },
        frameRate: { ideal: this.targetFps, max: 20 }
      },
      audio: false
    });

    this.stream = stream;

    const video = document.createElement('video');
    video.playsInline = true;
    video.muted = true;
    video.autoplay = true;
    video.srcObject = stream;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => {
        video.play().then(() => resolve()).catch(reject);
      };
      video.onerror = () => reject(new Error('Video element failed to play stream'));
    });

    this.video = video;
  }

  private startLoop() {
    const frameIntervalMs = 1000 / this.targetFps;

    const tick = (now: number) => {
      if (!this.isRunning) return;

      const elapsed = now - this.lastProcessTime;
      if (elapsed >= frameIntervalMs) {
        this.lastProcessTime = now;
        this.processFrame(now);
      }

      this.animationFrameId = requestAnimationFrame(tick);
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  private processFrame(timestamp: number) {
    if (!this.handLandmarker || !this.video || this.video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return;
    }

    try {
      const results = this.handLandmarker.detectForVideo(this.video, timestamp);
      let detection: GestureDetectionResult = { gesture: 'none', confidence: 0 };

      if (results.landmarks && results.landmarks.length > 0) {
        const handLandmarks = results.landmarks[0];
        const handedness =
          results.handedness && results.handedness.length > 0
            ? (results.handedness[0][0]?.categoryName as 'Left' | 'Right')
            : undefined;

        detection = classifyHandPose(handLandmarks, handedness);
      }

      // Update state machine
      this.stateMachine.update(detection);

      // Report detection for debug overlays or test page
      if (this.callbacks.onDetectionUpdate) {
        this.callbacks.onDetectionUpdate(detection);
      }
    } catch (err) {
      // Individual frame error should not crash extension
      console.warn('[MemeMeet] Frame processing error:', err);
    }
  }

  private updateCameraStatus(status: Partial<CameraStatusInfo>) {
    this.cameraStatus = { ...this.cameraStatus, ...status };
    if (this.callbacks.onCameraStatusChange) {
      this.callbacks.onCameraStatusChange(this.cameraStatus);
    }
  }
}
