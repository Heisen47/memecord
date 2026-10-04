import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import { classifyHandPose, classifyHands } from '../gesture/classifier';
import { GestureStateMachine } from '../gesture/state-machine';
import { MemeOverlayManager } from '../overlay/meme-overlay';
import { DEFAULT_SETTINGS, KEYBOARD_GESTURE_MAP } from '../shared/config';
import { GestureType, StateMachineStatus } from '../shared/types';
import '../overlay/overlay.css';
import './test.css';

export const TestLab: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<MemeOverlayManager | null>(null);
  const stateMachineRef = useRef<GestureStateMachine | null>(null);
  const animIdRef = useRef<number | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [stabilityMs, setStabilityMs] = useState<number>(DEFAULT_SETTINGS.stabilityThresholdMs);
  const [cooldownMs, setCooldownMs] = useState<number>(DEFAULT_SETTINGS.cooldownMs);
  const [status, setStatus] = useState<StateMachineStatus>({
    state: 'IDLE',
    detectedGesture: 'none',
    confidence: 0,
    stabilityElapsedMs: 0,
    stabilityThresholdMs: DEFAULT_SETTINGS.stabilityThresholdMs,
    cooldownRemainingMs: 0,
    cooldownDurationMs: DEFAULT_SETTINGS.cooldownMs
  });

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    let isMounted = true;

    // 1. Initialize Overlay Manager
    overlayRef.current = new MemeOverlayManager(DEFAULT_SETTINGS.memes, true);

    // 2. Initialize State Machine
    const sm = new GestureStateMachine({
      stabilityThresholdMs: stabilityMs,
      cooldownDurationMs: cooldownMs,
      onTrigger: (gesture, confidence) => {
        addLog(`🎯 TRIGGERED: ${gesture.toUpperCase()} (${(confidence * 100).toFixed(0)}%)`);
        overlayRef.current?.showMeme(gesture);
      },
      onStatusChange: (newStatus) => {
        setStatus(newStatus);
        overlayRef.current?.updateDebugHUD(newStatus);
      }
    });
    stateMachineRef.current = sm;

    // 3. Register Hotkeys (1, 2, 3)
    const handleKeydown = (e: KeyboardEvent) => {
      const gesture = KEYBOARD_GESTURE_MAP[e.key];
      if (gesture) {
        addLog(`⌨️ HOTKEY: ${gesture}`);
        sm.triggerManual(gesture);
        overlayRef.current?.showMeme(gesture);
      }
    };
    window.addEventListener('keydown', handleKeydown);

    // 4. Start Camera & MediaPipe
    startMediaPipe(() => isMounted);

    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeydown);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
      overlayRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    stateMachineRef.current?.updateConfig(stabilityMs, cooldownMs);
  }, [stabilityMs, cooldownMs]);

  const startMediaPipe = async (getIsMounted?: () => boolean) => {
    try {
      setLoading(true);
      setError(null);

      const wasmPath =
        typeof chrome !== 'undefined' && chrome.runtime?.getURL
          ? chrome.runtime.getURL('mediapipe/wasm')
          : '/mediapipe/wasm';

      const modelPath =
        typeof chrome !== 'undefined' && chrome.runtime?.getURL
          ? chrome.runtime.getURL('models/hand_landmarker.task')
          : '/models/hand_landmarker.task';

      const vision = await FilesetResolver.forVisionTasks(wasmPath);

      if (getIsMounted && !getIsMounted()) return;

      let landmarker: HandLandmarker;
      try {
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: modelPath, delegate: 'GPU' },
          runningMode: 'VIDEO',
          numHands: 2
        });
      } catch (e) {
        console.warn('Fallback to CPU delegate', e);
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: modelPath, delegate: 'CPU' },
          runningMode: 'VIDEO',
          numHands: 2
        });
      }

      if (getIsMounted && !getIsMounted()) return;

      // Camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, frameRate: { ideal: 20 } }
      });

      if (getIsMounted && !getIsMounted()) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;

      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      video.srcObject = stream;
      try {
        await video.play();
      } catch (playErr: any) {
        if (playErr.name === 'AbortError') return;
        throw playErr;
      }

      setIsRunning(true);
      setLoading(false);
      addLog('Camera and MediaPipe Hand Landmarker ready');

      // Processing Loop
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      const drawingUtils = new DrawingUtils(ctx);

      const render = (time: number) => {
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw raw camera feed
          ctx.save();
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const results = landmarker.detectForVideo(video, time);
          if (results.landmarks && results.landmarks.length > 0) {
            for (const landmarks of results.landmarks) {
              drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
                color: '#6366f1',
                lineWidth: 3
              });
              drawingUtils.drawLandmarks(landmarks, {
                color: '#38bdf8',
                lineWidth: 2,
                radius: 4
              });
            }

            const detection = classifyHands(results.landmarks);
            stateMachineRef.current?.update(detection);
          } else {
            stateMachineRef.current?.update({ gesture: 'none', confidence: 0 });
          }

          ctx.restore();
        }
        animIdRef.current = requestAnimationFrame(render);
      };

      animIdRef.current = requestAnimationFrame(render);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to initialize camera or MediaPipe');
      addLog(`Error: ${err.message}`);
    }
  };

  const triggerManual = (gesture: Exclude<GestureType, 'none'>) => {
    addLog(`👆 BUTTON TRIGGER: ${gesture}`);
    stateMachineRef.current?.triggerManual(gesture);
    overlayRef.current?.showMeme(gesture);
  };

  return (
    <div className="lab-container">
      <header className="lab-header">
        <div className="lab-title-group">
          <h1>MemeMeet Gesture Test Lab</h1>
          <span className="lab-badge">{isRunning ? '● Live Sandbox' : 'Sandbox'}</span>
        </div>
        <div style={{ color: '#9ca3af', fontSize: 13 }}>
          Local-only testing outside Google Meet
        </div>
      </header>

      <div className="lab-grid">
        {/* Main View */}
        <div className="lab-main-view">
          <div className="canvas-wrapper">
            <video ref={videoRef} playsInline muted />
            <canvas ref={canvasRef} />

            <div className="hud-overlay">
              <div>
                <strong>STATE:</strong>{' '}
                <span style={{ color: status.state === 'COOLDOWN' ? '#fb923c' : '#4ade80' }}>
                  {status.state}
                </span>
              </div>
              <div>
                <strong>GESTURE:</strong> {status.detectedGesture.toUpperCase()}
              </div>
              <div>
                <strong>CONFIDENCE:</strong> {status.confidence.toFixed(2)}
              </div>
              <div>
                <strong>COOLDOWN:</strong> {(status.cooldownRemainingMs / 1000).toFixed(1)}s
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: '#7f1d1d', color: '#fecaca', padding: 12, borderRadius: 8 }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {loading && !error && (
            <div style={{ color: '#a5b4fc', fontSize: 14 }}>
              Loading MediaPipe models and starting camera...
            </div>
          )}
        </div>

        {/* Sidebar Controls */}
        <div className="sidebar">
          {/* Manual Trigger Buttons */}
          <div className="card">
            <div className="card-title">Manual Trigger Hotkeys</div>
            <div className="hotkey-btn-group">
              <button className="hotkey-btn" onClick={() => triggerManual('thumbs_up')}>
                <span>👍 Thumbs Up</span>
                <span className="key-badge">1</span>
              </button>
              <button className="hotkey-btn" onClick={() => triggerManual('victory')}>
                <span>✌️ Victory / Peace</span>
                <span className="key-badge">2</span>
              </button>
              <button className="hotkey-btn" onClick={() => triggerManual('open_palm')}>
                <span>🖐 Open Palm Stop</span>
                <span className="key-badge">3</span>
              </button>
              <button className="hotkey-btn" onClick={() => triggerManual('both_hands_up')}>
                <span>🙌 Both Hands Up</span>
                <span className="key-badge">4</span>
              </button>
              <button className="hotkey-btn" onClick={() => triggerManual('rock_on')}>
                <span>🤘 Rock On</span>
                <span className="key-badge">5</span>
              </button>
              <button className="hotkey-btn" onClick={() => triggerManual('pointing_up')}>
                <span>☝️ Pointing Up</span>
                <span className="key-badge">6</span>
              </button>
              <button className="hotkey-btn" onClick={() => triggerManual('ok_sign')}>
                <span>👌 OK Sign</span>
                <span className="key-badge">7</span>
              </button>
            </div>
          </div>

          {/* Threshold Tuning */}
          <div className="card">
            <div className="card-title">Threshold Tuning</div>
            <div className="controls-form">
              <div className="slider-group">
                <div className="slider-label">
                  <span>Stability Duration</span>
                  <strong>{stabilityMs}ms</strong>
                </div>
                <input
                  type="range"
                  min={150}
                  max={800}
                  step={50}
                  value={stabilityMs}
                  onChange={(e) => setStabilityMs(Number(e.target.value))}
                />
              </div>

              <div className="slider-group">
                <div className="slider-label">
                  <span>Anti-Spam Cooldown</span>
                  <strong>{cooldownMs}ms</strong>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={5000}
                  step={250}
                  value={cooldownMs}
                  onChange={(e) => setCooldownMs(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Event Telemetry Log */}
          <div className="card">
            <div className="card-title">Event Telemetry Log</div>
            <div className="log-box">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
