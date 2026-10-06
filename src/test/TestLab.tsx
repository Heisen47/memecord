import React, { useEffect, useRef, useState } from 'react';
import { MemeOverlayManager } from '../overlay/meme-overlay';
import { getSettings, saveSettings, addMeme, removeMeme } from '../shared/storage';
import { AppSettings, MemeItem, MemeOverlayPosition } from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/config';
import { assignDefaultHotkey, fetchAsDataUrl } from '../shared/media-resolver';
import { isToggleShortcutPressed, getToggleShortcutText, getToggleShortcutFullLabel } from '../shared/platform';
import '../overlay/overlay.css';
import './test.css';

export const TestLab: React.FC = () => {
  const overlayRef = useRef<MemeOverlayManager | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [logs, setLogs] = useState<string[]>([]);
  const [lastTriggered, setLastTriggered] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const handleTrigger = async (meme: MemeItem) => {
    setLastTriggered(meme.name);
    addLog(`Triggered: ${meme.name}`);
    overlayRef.current?.showMeme(meme);

    try {
      const dataUrl = await fetchAsDataUrl(meme.assetUrl);
      window.postMessage(
        {
          source: 'MEMECORD_CONTENT',
          type: 'TRIGGER_CAMERA_MEME',
          meme: { ...meme, assetUrl: dataUrl },
          position: settings.position || 'center'
        },
        '*'
      );
    } catch (err) {
      console.warn('Failed to post camera meme:', err);
    }
  };

  const toggleCamera = async () => {
    if (cameraActive) {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop());
        cameraStreamRef.current = null;
      }
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = null;
      }
      setCameraActive(false);
      addLog('Virtual Camera Preview stopped.');
    } else {
      try {
        addLog('Requesting webcam feed (hooked by Memecord compositor)...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        cameraStreamRef.current = stream;
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
        setCameraActive(true);
        addLog('Webcam feed active! This preview shows what remote callers see.');
      } catch (err: any) {
        addLog(`Camera error: ${err?.message || err}`);
      }
    }
  };

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      overlayRef.current = new MemeOverlayManager(s, {
        onTriggerMeme: (meme) => {
          handleTrigger(meme);
        },
        onAddMeme: async (meme) => {
          const updated = await addMeme(meme);
          setSettings(updated);
          addLog(`Added new meme: ${meme.name}`);
        },
        onDeleteMeme: async (memeId) => {
          const updated = await removeMeme(memeId);
          setSettings(updated);
          addLog(`Deleted meme: ${memeId}`);
        },
        onUpdateHotkey: (memeId, newHotkey) => {
          setSettings((prev) => ({
            ...prev,
            memes: prev.memes.map((m) => (m.id === memeId ? { ...m, hotkey: newHotkey } : m))
          }));
          addLog(`Rebound meme ${memeId} to [${newHotkey}]`);
        },
        onCloseDock: () => {
          addLog(`HUD minimized. Click floating bubble or press ${getToggleShortcutText()}.`);
        }
      });
      overlayRef.current.setDockVisible(true);
      addLog('Memecord Test Lab initialized. Press 1–9, 0, Q... or click dock buttons (works with or without cam).');
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;

      if (isToggleShortcutPressed(e)) {
        e.preventDefault();
        setSettings((prev) => {
          const next = !prev.dockVisible;
          saveSettings({ dockVisible: next });
          overlayRef.current?.setDockMinimized(!next);
          overlayRef.current?.setDockVisible(true);
          addLog(next ? `HUD expanded via ${getToggleShortcutText()}` : `HUD minimized via ${getToggleShortcutText()}`);
          return { ...prev, dockVisible: next };
        });
        return;
      }

      const key = e.key;
      getSettings().then((curr) => {
        const match = curr.memes.find((m, idx) => {
          const expectedKey = m.hotkey || assignDefaultHotkey(idx);
          return expectedKey && expectedKey.toLowerCase() === key.toLowerCase();
        });

        if (match) {
          e.preventDefault();
          handleTrigger(match);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      overlayRef.current?.destroy();
      overlayRef.current = null;
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handlePositionChange = async (pos: MemeOverlayPosition) => {
    const updated = await saveSettings({ position: pos });
    setSettings(updated);
    overlayRef.current?.updateSettings(updated);
    addLog(`Changed overlay position to ${pos}`);
    window.postMessage(
      {
        source: 'MEMECORD_CONTENT',
        type: 'UPDATE_CAMERA_SETTINGS',
        position: pos
      },
      '*'
    );
  };

  return (
    <div className="testlab-container">
      <header className="testlab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="testlab-brand">
          <img src="/icons/logo.png" style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid rgba(129, 140, 248, 0.4)' }} alt="Memecord Logo" />
          <div>
            <h1>Memecord Test Lab</h1>
            <p>Interactive Sandbox &amp; Meme Trigger Simulator (Cam &amp; No-Cam Calls)</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 11, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 20, padding: '4px 10px', fontWeight: 600 }}>
            ● Active Call Simulated
          </span>
          <button
            onClick={() => {
              setSettings((prev) => {
                const next = !prev.dockVisible;
                saveSettings({ dockVisible: next });
                overlayRef.current?.setDockMinimized(!next);
                overlayRef.current?.setDockVisible(true);
                addLog(next ? `HUD expanded via button` : `HUD minimized via button`);
                return { ...prev, dockVisible: next };
              });
            }}
            title={getToggleShortcutFullLabel()}
            style={{
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              color: '#a5b4fc',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Toggle HUD ({getToggleShortcutText()})
          </button>
        </div>
      </header>

      {/* Explicit Chrome Extension Scope Callout Banner */}
      <div
        style={{
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(129, 140, 248, 0.3)',
          borderRadius: 12,
          padding: '12px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 14
        }}
      >
        <span style={{ fontSize: 24 }}>🧩</span>
        <div>
          <strong style={{ color: '#fff', fontSize: 13, display: 'block', marginBottom: 2 }}>
            Memecord is a Google Chrome Extension
          </strong>
          <span style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.5 }}>
            It runs inside <strong>Google Chrome browser tabs</strong> where video calls are made (such as <strong>Google Meet</strong>, <strong>Discord Web</strong> at <code style={{ color: '#a5b4fc', background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>discord.com</code>, <strong>Zoom Web</strong>, <strong>Teams Web</strong>, <strong>Slack Huddles</strong>, and <strong>FaceTime Web</strong>). It operates exclusively in the browser and does <em>not</em> run inside standalone desktop applications like Discord Desktop.
          </span>
        </div>
      </div>

      <div className="testlab-grid">
        {/* Left Column: Interactive Controls */}
        <div className="testlab-panel">
          <h2>Meme Triggers ({settings.memes.length})</h2>
          <p className="testlab-sub">Click any button or press the corresponding hotkey on your keyboard:</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, margin: '16px 0' }}>
            {settings.memes.map((meme, idx) => {
              const hotkey = meme.hotkey || (idx < 9 ? String(idx + 1) : '-');
              const thumb = meme.assetUrl.startsWith('http') || meme.assetUrl.startsWith('data:') ? meme.assetUrl : `/${meme.assetUrl.replace(/^\//, '')}`;
              return (
                <button
                  key={meme.id}
                  onClick={() => handleTrigger(meme)}
                  style={{
                    background: lastTriggered === meme.name ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 12,
                    padding: '12px 10px',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <img src={thumb} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: '#1e293b' }} alt={meme.name} />
                  <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center' }}>{meme.name}</span>
                  <span style={{ fontSize: 10, color: '#a5b4fc', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4 }}>
                    Key [{hotkey}]
                  </span>
                </button>
              );
            })}
          </div>

          <h3 style={{ marginTop: 20 }}>Position Preview</h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {(['top-center', 'center', 'top-right', 'bottom-right'] as MemeOverlayPosition[]).map((pos) => (
              <button
                key={pos}
                onClick={() => handlePositionChange(pos)}
                style={{
                  background: settings.position === pos ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Live Camera Stream & Event Log */}
        <div className="testlab-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2>Remote Caller Camera Stream</h2>
            <button
              onClick={toggleCamera}
              style={{
                background: cameraActive ? '#ef4444' : '#10b981',
                border: 'none',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              {cameraActive ? 'Stop Camera' : 'Start Camera Stream'}
            </button>
          </div>

          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 220,
              background: '#090d16',
              borderRadius: 12,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}
          >
            <video
              ref={videoPreviewRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: cameraActive ? 'block' : 'none'
              }}
            />
            {!cameraActive && (
              <div style={{ textAlign: 'center', color: '#64748b', padding: 20 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                  📷 Camera Disabled (No-Cam Mode)
                </div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>
                  HUD &amp; Hotkeys work even without camera enabled!
                </p>
                <p style={{ margin: '6px 0 0 0', fontSize: 11, color: '#94a3b8' }}>
                  Memes play in your screen overlay with sound. Click &ldquo;Start Camera Stream&rdquo; whenever you want to test stamping onto the remote video feed.
                </p>
              </div>
            )}
          </div>

          <h2>Real-time Event Log</h2>
          <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 12, height: 180, overflowY: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
            {logs.map((log, i) => (
              <div key={i} style={{ color: '#38bdf8', marginBottom: 4 }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

