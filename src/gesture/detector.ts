import { HandLandmarker } from '@mediapipe/tasks-vision';
import visionModuleFactory from './vision_wasm_internal.mjs';
import { classifyHands } from './classifier';
import { GestureStateMachine } from './state-machine';
import { GestureDetectionResult, GestureType, CameraStatusInfo, AppSettings } from '../shared/types';
import { HudDiagnostics } from '../overlay/debug-hud';

export interface GestureDetectorCallbacks {
  onGestureTriggered: (gesture: Exclude<GestureType, 'none'>, confidence: number) => void;
  onDetectionUpdate?: (result: GestureDetectionResult, diagnostics?: HudDiagnostics) => void;
  onCameraStatusChange?: (status: CameraStatusInfo) => void;
}

export class GestureDetector {
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private handLandmarker: HandLandmarker | null = null;
  private stateMachine: GestureStateMachine;
  private animationFrameId: number | null = null;
  private lastProcessTime: number = 0;
  private lastProcessedTimestamp: number = 0;
  private targetFps: number = 15;
  private isRunning: boolean = false;
  private isInitializing: boolean = false;
  private isCustomVideo: boolean = false;

  private frameCount: number = 0;
  private lastFpsTime: number = performance.now();
  private lastFpsFrameCount: number = 0;
  private currentFps: number = 0;
  private _lastErrorLogTime: number = 0;

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
        // Handled via onDetectionUpdate
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

      // 2. Request user webcam stream or attach to Google Meet video feed
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

    if (this.video && this.isCustomVideo) {
      this.video.pause();
      this.video.srcObject = null;
      if (this.video.parentElement) {
        this.video.parentElement.removeChild(this.video);
      }
    }
    this.video = null;

    this.stateMachine.reset();
    this.updateCameraStatus({ active: false, permissionGranted: this.cameraStatus.permissionGranted });
  }

  private async initMediaPipe() {
    this.reportCameraDiag('LOADING ML MODEL...');

    try {
      const wasmBinaryUrl =
        typeof chrome !== 'undefined' && chrome.runtime?.getURL
          ? chrome.runtime.getURL('mediapipe/wasm/vision_wasm_internal.wasm')
          : '/mediapipe/wasm/vision_wasm_internal.wasm';

      const modelUrl =
        typeof chrome !== 'undefined' && chrome.runtime?.getURL
          ? chrome.runtime.getURL('models/hand_landmarker.task')
          : '/models/hand_landmarker.task';

      console.log('[MemeMeet] Pre-fetching WASM binary & HandLandmarker model...');

      // 1. Fetch WASM binary and model in parallel using extension origin
      const [wasmResponse, modelResponse] = await Promise.all([
        fetch(wasmBinaryUrl),
        fetch(modelUrl)
      ]);

      if (!wasmResponse.ok) {
        throw new Error(`Failed to load WASM binary: ${wasmResponse.status}`);
      }
      if (!modelResponse.ok) {
        throw new Error(`Failed to load HandLandmarker model: ${modelResponse.status}`);
      }

      const [wasmBuffer, modelBuffer] = await Promise.all([
        wasmResponse.arrayBuffer(),
        modelResponse.arrayBuffer()
      ]);

      const modelUint8Array = new Uint8Array(modelBuffer);
      console.log(`[MemeMeet] Assets loaded: WASM (${wasmBuffer.byteLength} B), Model (${modelUint8Array.byteLength} B)`);

      // 2. Pre-supply Module.wasmBinary and global ModuleFactory
      // This completely bypasses MediaPipe's dynamic script injection ($h) and avoids Meet CSP violations!
      const supplyGlobalModule = () => {
        const mod = { wasmBinary: wasmBuffer };
        (globalThis as any).Module = mod;
        (globalThis as any).ModuleFactory = visionModuleFactory;
        if (typeof self !== 'undefined') {
          (self as any).Module = mod;
          (self as any).ModuleFactory = visionModuleFactory;
        }
        if (typeof window !== 'undefined') {
          (window as any).Module = mod;
          (window as any).ModuleFactory = visionModuleFactory;
        }
      };

      supplyGlobalModule();

      // Empty wasmLoaderPath prevents MediaPipe from trying to append <script> to document.body
      const fileset = {
        wasmLoaderPath: '',
        wasmBinaryPath: wasmBinaryUrl
      };

      // 3. Initialize HandLandmarker (try GPU first, fallback to CPU)
      try {
        this.handLandmarker = await HandLandmarker.createFromOptions(fileset as any, {
          baseOptions: {
            modelAssetBuffer: modelUint8Array,
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        console.log('[MemeMeet] HandLandmarker initialized successfully with GPU');
      } catch (gpuError) {
        console.warn('[MemeMeet] GPU delegate failed, falling back to CPU:', gpuError);
        // MediaPipe clears self.Module and self.ModuleFactory, re-supply for CPU retry
        supplyGlobalModule();
        this.handLandmarker = await HandLandmarker.createFromOptions(fileset as any, {
          baseOptions: {
            modelAssetBuffer: modelUint8Array,
            delegate: 'CPU'
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        console.log('[MemeMeet] HandLandmarker initialized successfully with CPU');
      }

      this.reportCameraDiag('ML MODEL READY');
    } catch (err: any) {
      console.error('[MemeMeet] CRITICAL: initMediaPipe failed:', err);
      this.reportCameraDiag(`ERR: ML INIT FAILED - ${err?.message || err}`);
      throw err;
    }
  }

  private reportCameraDiag(text: string) {
    if (this.callbacks.onDetectionUpdate) {
      this.callbacks.onDetectionUpdate(
        { gesture: 'none', confidence: 0 },
        { cameraText: text, handsCount: 0, fps: 0 }
      );
    }
  }

  private async initCamera() {
    this.reportCameraDiag('STARTING CAMERA...');

    // Priority 1: Check if an active Google Meet video feed is already present on the page
    const existingVideo = this.findMeetVideoElement();
    if (existingVideo && existingVideo.videoWidth > 0 && !existingVideo.paused) {
      console.log('[MemeMeet] Reusing existing Google Meet video feed directly');
      this.video = existingVideo;
      this.isCustomVideo = false;
      this.reportCameraDiag(`ONLINE (${existingVideo.videoWidth}x${existingVideo.videoHeight})`);
      return;
    }

    // Priority 2: Request dedicated webcam stream
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam mediaDevices API not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: this.targetFps, max: 24 }
        },
        audio: false
      });

      this.stream = stream;

      // Video element MUST be in DOM with playsinline and muted attributes
      const video = document.createElement('video');
      video.id = 'mememeet-camera-feed';
      video.playsInline = true;
      video.muted = true;
      video.autoplay = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.setAttribute('autoplay', '');
      video.style.cssText =
        'position: fixed; top: 0; left: 0; width: 320px; height: 240px; opacity: 0.001; pointer-events: none; z-index: -99999;';

      const container =
        document.getElementById('mememeet-overlay-root') || document.body || document.documentElement;
      container.appendChild(video);

      video.srcObject = stream;

      // Wait until metadata is loaded before calling play()
      await new Promise<void>((resolve) => {
        let settled = false;
        const timer = setTimeout(() => {
          if (!settled) {
            settled = true;
            resolve();
          }
        }, 1500);

        video.onloadedmetadata = () => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve();
          }
        };
        video.onerror = () => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve();
          }
        };
      });

      await video.play().catch((err) => {
        console.warn('[MemeMeet] video.play() warned:', err);
      });

      this.video = video;
      this.isCustomVideo = true;
      console.log('[MemeMeet] Dedicated webcam stream initialized successfully');
      this.reportCameraDiag(`ONLINE (${video.videoWidth || 640}x${video.videoHeight || 480})`);
      return;
    } catch (err: any) {
      console.warn('[MemeMeet] getUserMedia direct capture failed, checking for active Meet video:', err);

      // Emergency fallback: Check if Google Meet video element appeared
      const meetVideo = this.findMeetVideoElement();
      if (meetVideo && meetVideo.videoWidth > 0 && !meetVideo.paused) {
        console.log('[MemeMeet] Fallback: Reusing existing Google Meet video feed');
        this.video = meetVideo;
        this.isCustomVideo = false;
        this.reportCameraDiag(`ONLINE (${meetVideo.videoWidth}x${meetVideo.videoHeight})`);
        return;
      }

      throw err;
    }
  }

  private findMeetVideoElement(): HTMLVideoElement | null {
    try {
      const videos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
      const candidates = videos.filter(
        (v) => v.videoWidth > 0 && !v.paused && v.id !== 'mememeet-camera-feed'
      );
      if (candidates.length === 0) return null;

      // Prefer mirrored self-view video (Google Meet always mirrors self-view with scaleX(-1))
      const mirrored = candidates.find((v) => {
        const style = window.getComputedStyle(v);
        return style.transform.includes('matrix(-1') || style.transform.includes('scaleX(-1)');
      });
      return mirrored || candidates[0];
    } catch {
      return null;
    }
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

    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsTime >= 1000) {
      this.currentFps = this.frameCount - this.lastFpsFrameCount;
      this.lastFpsFrameCount = this.frameCount;
      this.lastFpsTime = now;
    }

    try {
      // MediaPipe requires strictly monotonically increasing timestamps
      const frameTimestamp = Math.max(Math.round(timestamp), this.lastProcessedTimestamp + 1);
      this.lastProcessedTimestamp = frameTimestamp;

      const results = this.handLandmarker.detectForVideo(this.video, frameTimestamp);
      let detection: GestureDetectionResult = { gesture: 'none', confidence: 0 };
      const handsCount = results.landmarks ? results.landmarks.length : 0;

      // Log first detection for debugging
      if (handsCount > 0 && this.frameCount <= 10) {
        console.log(`[MemeMeet] Frame ${this.frameCount}: Tracking ${handsCount} hand(s)`);
      }

      if (handsCount > 0) {
        const handednessList = results.handedness?.map(
          (h) => h[0]?.categoryName as 'Left' | 'Right'
        );
        detection = classifyHands(results.landmarks, handednessList);

        if (detection.gesture !== 'none') {
          console.log(`[MemeMeet] Hand sign detected: ${detection.gesture} (conf: ${detection.confidence.toFixed(2)})`);
        }
      }

      // Update state machine
      this.stateMachine.update(detection);

      // Report detection & diagnostics to controller and overlay
      if (this.callbacks.onDetectionUpdate) {
        this.callbacks.onDetectionUpdate(detection, {
          cameraText: `ONLINE (${this.video.videoWidth}x${this.video.videoHeight})`,
          handsCount,
          fps: this.currentFps
        });
      }
    } catch (err: any) {
      // Rate-limit error logging to once per 5 seconds
      if (!this._lastErrorLogTime || now - this._lastErrorLogTime > 5000) {
        console.error('[MemeMeet] processFrame error:', err?.message || err);
        this._lastErrorLogTime = now;
      }
    }
  }

  private updateCameraStatus(status: Partial<CameraStatusInfo>) {
    this.cameraStatus = { ...this.cameraStatus, ...status };
    if (this.callbacks.onCameraStatusChange) {
      this.callbacks.onCameraStatusChange(this.cameraStatus);
    }
  }
}

