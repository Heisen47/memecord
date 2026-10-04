import React, { useEffect, useRef, useState } from 'react';
import { MemeOverlayManager } from '../overlay/meme-overlay';
import { getSettings, saveSettings, addMeme, removeMeme } from '../shared/storage';
import { AppSettings, MemeItem, MemeOverlayPosition } from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/config';
import { assignDefaultHotkey } from '../shared/media-resolver';
import '../overlay/overlay.css';
import './test.css';

export const TestLab: React.FC = () => {
  const overlayRef = useRef<MemeOverlayManager | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [logs, setLogs] = useState<string[]>([]);
  const [lastTriggered, setLastTriggered] = useState<string | null>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      overlayRef.current = new MemeOverlayManager(s, {
        onTriggerMeme: (meme) => {
          setLastTriggered(meme.name);
          addLog(`Triggered via dock: ${meme.name}`);
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
        }
      });
      addLog('Memecord Test Lab initialized. Press 1–9, 0, Q... or click dock buttons.');
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;

      const key = e.key;
      getSettings().then((curr) => {
        const match = curr.memes.find((m, idx) => {
          const expectedKey = m.hotkey || assignDefaultHotkey(idx);
          return expectedKey && expectedKey.toLowerCase() === key.toLowerCase();
        });

        if (match) {
          e.preventDefault();
          setLastTriggered(match.name);
          addLog(`Hotkey [${key}] -> ${match.name}`);
          overlayRef.current?.showMeme(match);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      overlayRef.current?.destroy();
      overlayRef.current = null;
    };
  }, []);

  const handleTrigger = (meme: MemeItem) => {
    setLastTriggered(meme.name);
    addLog(`Clicked test button: ${meme.name}`);
    overlayRef.current?.showMeme(meme);
  };

  const handlePositionChange = async (pos: MemeOverlayPosition) => {
    const updated = await saveSettings({ position: pos });
    setSettings(updated);
    overlayRef.current?.updateSettings(updated);
    addLog(`Changed overlay position to ${pos}`);
  };

  return (
    <div className="testlab-container">
      <header className="testlab-header">
        <div className="testlab-brand">
          <span className="testlab-logo">🎭</span>
          <div>
            <h1>Memecord Test Lab</h1>
            <p>Interactive Sandbox & Meme Trigger Simulator</p>
          </div>
        </div>
      </header>

      <div className="testlab-grid">
        {/* Left Column: Interactive Controls */}
        <div className="testlab-panel">
          <h2>Meme Triggers ({settings.memes.length})</h2>
          <p className="testlab-sub">Click any button or press the corresponding hotkey on your keyboard:</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, margin: '16px 0' }}>
            {settings.memes.map((meme, idx) => {
              const hotkey = meme.hotkey || (idx < 9 ? String(idx + 1) : '-');
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
                  <span style={{ fontSize: 24 }}>{meme.emoji}</span>
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

        {/* Right Column: Event Log */}
        <div className="testlab-panel">
          <h2>Real-time Event Log</h2>
          <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 12, height: 350, overflowY: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
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
