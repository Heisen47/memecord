import React, { useEffect, useState } from 'react';
import { getSettings, saveSettings } from '../shared/storage';
import { AppSettings, CameraStatusInfo, GestureType, MemeItemConfig } from '../shared/types';
import { DEFAULT_SETTINGS, GESTURE_DEFINITIONS, PRESET_MEMES } from '../shared/config';
import {
  ShieldCheck,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  Play,
  Globe
} from 'lucide-react';
import { MemeApiModal } from './MemeApiModal';

export const Popup: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [cameraStatus, setCameraStatus] = useState<CameraStatusInfo>({
    active: false,
    permissionGranted: false
  });
  const [testedGesture, setTestedGesture] = useState<string | null>(null);
  const [expandedGesture, setExpandedGesture] = useState<string | null>(null);
  const [apiModalGesture, setApiModalGesture] = useState<{
    key: Exclude<GestureType, 'none'>;
    name: string;
  } | null>(null);

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

  const handleSelectPreset = async (gestureKey: Exclude<GestureType, 'none'>, presetId: string) => {
    if (presetId === 'custom') {
      setExpandedGesture(gestureKey);
      return;
    }

    const preset = PRESET_MEMES.find((p) => p.id === presetId);
    if (!preset) return;

    const currentConfig = settings.memes[gestureKey] || DEFAULT_SETTINGS.memes[gestureKey];
    const updatedMeme: MemeItemConfig = {
      ...currentConfig,
      asset: preset.asset,
      title: preset.name,
      emoji: preset.emoji
    };

    const updated = await saveSettings({
      memes: {
        ...settings.memes,
        [gestureKey]: updatedMeme
      }
    });
    setSettings(updated);
  };

  const handleUpdateCustomMeme = async (
    gestureKey: Exclude<GestureType, 'none'>,
    updates: Partial<MemeItemConfig>
  ) => {
    const currentConfig = settings.memes[gestureKey] || DEFAULT_SETTINGS.memes[gestureKey];
    const updatedMeme: MemeItemConfig = {
      ...currentConfig,
      ...updates
    };

    const updated = await saveSettings({
      memes: {
        ...settings.memes,
        [gestureKey]: updatedMeme
      }
    });
    setSettings(updated);
  };

  const handleSelectFromApi = async (url: string, title: string) => {
    if (!apiModalGesture) return;
    const key = apiModalGesture.key;
    const currentConfig = settings.memes[key] || DEFAULT_SETTINGS.memes[key];
    const updatedMeme: MemeItemConfig = {
      ...currentConfig,
      asset: url,
      title: title,
      emoji: '✨'
    };

    const updated = await saveSettings({
      memes: {
        ...settings.memes,
        [key]: updatedMeme
      }
    });
    setSettings(updated);
    setApiModalGesture(null);
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

  const resolveThumbUrl = (asset: string) => {
    if (asset.startsWith('http') || asset.startsWith('data:')) return asset;
    if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
      return chrome.runtime.getURL(asset.replace(/^\//, ''));
    }
    return asset.startsWith('/') ? asset : `/${asset}`;
  };

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

      {/* Gesture Mappings Customizer */}
      <section>
        <div className="section-header-row">
          <div className="section-title">Custom Gesture Mappings ({GESTURE_DEFINITIONS.length})</div>
        </div>
        <div className="mappings-list">
          {GESTURE_DEFINITIONS.map((def) => {
            const currentMeme = settings.memes[def.key] || DEFAULT_SETTINGS.memes[def.key];
            const isJustTested = testedGesture === def.key;
            const isExpanded = expandedGesture === def.key;

            // Determine if current asset matches a preset
            const matchingPreset = PRESET_MEMES.find((p) => p.asset === currentMeme.asset);
            const selectValue = matchingPreset ? matchingPreset.id : 'custom';

            return (
              <div key={def.key} className={`mapping-item ${isExpanded ? 'expanded' : ''}`}>
                <div className="mapping-item-main">
                  <div className="mapping-info">
                    <div className="mapping-emoji">{def.emoji}</div>
                    <div>
                      <div className="mapping-name">{def.name}</div>
                      <div className="mapping-desc">{def.description}</div>
                    </div>
                  </div>

                  <div className="mapping-actions">
                    <button
                      className="test-btn"
                      onClick={() => handleTriggerTest(def.key)}
                      title="Test trigger in Google Meet"
                    >
                      {isJustTested ? (
                        <CheckCircle2 size={12} color="#4ade80" />
                      ) : (
                        <Play size={11} />
                      )}
                    </button>
                    <button
                      className="expand-btn"
                      onClick={() => setExpandedGesture(isExpanded ? null : def.key)}
                      title="Customize Meme"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Preset Selector Row */}
                <div className="mapping-selector-row">
                  <span className="target-label">Meme:</span>
                  <select
                    className="meme-select"
                    value={selectValue}
                    onChange={(e) => handleSelectPreset(def.key, e.target.value)}
                  >
                    {PRESET_MEMES.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.emoji} {preset.name}
                      </option>
                    ))}
                    <option value="custom">🌐 Custom URL / GIF...</option>
                  </select>
                </div>

                {/* Collapsible Custom Editor */}
                {isExpanded && (
                  <div className="custom-editor">
                    <div className="editor-group">
                      <label>GIF / Image URL or Local Path</label>
                      <div className="input-with-icon">
                        <LinkIcon size={12} className="input-icon" />
                        <input
                          type="text"
                          placeholder="https://... or memes/custom.gif"
                          value={currentMeme.asset}
                          onChange={(e) =>
                            handleUpdateCustomMeme(def.key, { asset: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="editor-row-dual">
                      <div className="editor-group">
                        <label>Overlay Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Awesome!"
                          value={currentMeme.title || ''}
                          onChange={(e) =>
                            handleUpdateCustomMeme(def.key, { title: e.target.value })
                          }
                        />
                      </div>
                      <div className="editor-group emoji-group">
                        <label>Emoji</label>
                        <input
                          type="text"
                          maxLength={3}
                          value={currentMeme.emoji || '✨'}
                          onChange={(e) =>
                            handleUpdateCustomMeme(def.key, { emoji: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Preview Thumbnail */}
                    <div className="preview-container">
                      <span className="preview-label">Live Preview:</span>
                      <div className="preview-bubble">
                        <img
                          src={resolveThumbUrl(currentMeme.asset)}
                          alt="preview"
                          className="preview-img"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                          onLoad={(e) => {
                            (e.target as HTMLElement).style.display = 'block';
                          }}
                        />
                        <span className="preview-text">
                          {currentMeme.emoji || '✨'} {currentMeme.title || def.name}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="api-browse-btn"
                      onClick={() => setApiModalGesture({ key: def.key, name: def.name })}
                    >
                      <Globe size={13} />
                      Browse Online Memes (API)
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Settings Grid */}
      <section>
        <div className="section-title">Behavior Settings</div>
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
          <strong>Privacy First:</strong> Camera processed 100% locally on device. No video frames or images are ever uploaded.
        </div>
      </div>

      {/* Standalone Sandbox Button */}
      <button className="test-link-btn" onClick={handleOpenSandbox}>
        <Sparkles size={14} />
        Open Gesture Test Lab / Sandbox
        <ExternalLink size={12} />
      </button>

      {/* Online Meme API Modal */}
      {apiModalGesture && (
        <MemeApiModal
          gestureKey={apiModalGesture.key}
          gestureName={apiModalGesture.name}
          onSelect={handleSelectFromApi}
          onClose={() => setApiModalGesture(null)}
        />
      )}
    </div>
  );
};
