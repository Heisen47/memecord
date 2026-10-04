import React, { useEffect, useState } from 'react';
import { getSettings, saveSettings } from '../shared/storage';
import { AppSettings, CameraStatusInfo, GestureType } from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/config';
import { ShieldCheck, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

export const Popup: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [cameraStatus, setCameraStatus] = useState<CameraStatusInfo>({
    active: false,
    permissionGranted: false
  });
  const [testedGesture, setTestedGesture] = useState<string | null>(null);

  useEffect(() => {
    // Load initial settings
    getSettings().then(setSettings);

    // Query active Google Meet tab for camera status
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }).then((tabs: chrome.tabs.Tab[]) => {
        const tab = tabs[0];
        if (tab?.id && tab.url?.includes('meet.google.com')) {
          chrome.tabs.sendMessage(tab.id, { type: 'GET_CAMERA_STATUS' }, (res: any) => {
            if (chrome.runtime.lastError) return;
            if (res && res.status) {
              setCameraStatus(res.status);
            }
          });
        }
      });
    }
  }, []);

  const handleToggleEnabled = async () => {
    const updated = await saveSettings({ enabled: !settings.enabled });
    setSettings(updated);
  };

  const handleToggleDebug = async () => {
    const updated = await saveSettings({ debugMode: !settings.debugMode });
    setSettings(updated);
  };

  const handleDurationChange = async (durationMs: number) => {
    const updated = await saveSettings({ memeDurationMs: durationMs });
    setSettings(updated);
  };

  const handleCooldownChange = async (cooldownMs: number) => {
    const updated = await saveSettings({ cooldownMs });
    setSettings(updated);
  };

  const handleTriggerTest = async (gesture: Exclude<GestureType, 'none'>) => {
    setTestedGesture(gesture);
    setTimeout(() => setTestedGesture(null), 1200);

    if (typeof chrome !== 'undefined' && chrome.tabs) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'TRIGGER_MANUAL_MEME',
          gesture
        });
      }
    }
  };

  const handleOpenSandbox = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: chrome.runtime.getURL('test/index.html') });
    } else {
      window.open('/test/index.html', '_blank');
    }
  };

  const gestures: Array<{ key: Exclude<GestureType, 'none'>; emoji: string; name: string }> = [
    { key: 'thumbs_up', emoji: '👍', name: 'Thumbs Up' },
    { key: 'victory', emoji: '✌️', name: 'Victory / Peace' },
    { key: 'open_palm', emoji: '🖐', name: 'Open Palm' }
  ];

  return (
    <div className="popup-container">
      {/* Header */}
      <header className="popup-header">
        <div className="brand-wrapper">
          <div className="brand-logo">M</div>
          <div>
            <h1 className="brand-title">MemeMeet</h1>
          </div>
        </div>
        <div className={`status-badge ${settings.enabled ? 'active' : 'inactive'}`}>
          <span className={`status-dot ${settings.enabled ? 'pulse' : ''}`} />
          {settings.enabled ? (cameraStatus.active ? 'Camera On' : 'Active') : 'Paused'}
        </div>
      </header>

      {/* Master Toggle Card */}
      <div className="master-card">
        <div className="toggle-label-group">
          <span className="toggle-title">Enable Meme Mode</span>
          <span className="toggle-sub">Detect hand gestures & overlay memes</span>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={handleToggleEnabled}
          />
          <span className="slider" />
        </label>
      </div>

      {/* Gesture Mappings */}
      <section>
        <div className="section-title">Gesture Mappings</div>
        <div className="mappings-list">
          {gestures.map((item) => {
            const config = settings.memes[item.key];
            const isJustTested = testedGesture === item.key;
            return (
              <div key={item.key} className="mapping-item">
                <div className="mapping-info">
                  <div className="mapping-emoji">{item.emoji}</div>
                  <div>
                    <div className="mapping-name">{item.name}</div>
                    <div className="mapping-target">
                      <span className="mapping-arrow">&rarr; </span>
                      {config?.title || item.key}
                    </div>
                  </div>
                </div>
                <button
                  className="test-btn"
                  onClick={() => handleTriggerTest(item.key)}
                  title="Test trigger in active Google Meet tab"
                >
                  {isJustTested ? <CheckCircle2 size={13} color="#4ade80" /> : 'Test'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Settings Grid */}
      <section>
        <div className="section-title">Settings</div>
        <div className="settings-grid">
          <div className="setting-card">
            <label htmlFor="duration-select">Meme Duration</label>
            <select
              id="duration-select"
              value={settings.memeDurationMs}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
            >
              <option value={1500}>1.5 seconds</option>
              <option value={2000}>2.0 seconds</option>
              <option value={3000}>3.0 seconds</option>
              <option value={4000}>4.0 seconds</option>
            </select>
          </div>
          <div className="setting-card">
            <label htmlFor="cooldown-select">Anti-Spam Cooldown</label>
            <select
              id="cooldown-select"
              value={settings.cooldownMs}
              onChange={(e) => handleCooldownChange(Number(e.target.value))}
            >
              <option value={1500}>1.5 seconds</option>
              <option value={2000}>2.0 seconds</option>
              <option value={3000}>3.0 seconds</option>
              <option value={5000}>5.0 seconds</option>
            </select>
          </div>
        </div>
      </section>

      {/* Debug HUD Toggle */}
      <div className="checkbox-row" onClick={handleToggleDebug}>
        <span>Show Debug HUD on Meet</span>
        <label className="switch" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={settings.debugMode}
            onChange={handleToggleDebug}
          />
          <span className="slider" />
        </label>
      </div>

      {/* Privacy Notice */}
      <div className="privacy-box">
        <ShieldCheck className="privacy-icon" size={16} />
        <div>
          <strong>Privacy First:</strong> Your camera is processed 100% locally in your browser for gesture detection. Video frames are never uploaded or saved.
        </div>
      </div>

      {/* Standalone Sandbox Button */}
      <button className="test-link-btn" onClick={handleOpenSandbox}>
        <Sparkles size={14} />
        Open Gesture Test Lab / Sandbox
        <ExternalLink size={12} />
      </button>
    </div>
  );
};
