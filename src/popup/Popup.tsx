import React, { useEffect, useState } from 'react';
import { getSettings, saveSettings, addMeme, removeMeme } from '../shared/storage';
import { AppSettings, MemeItem, MemeOverlayPosition } from '../shared/types';
import { DEFAULT_SETTINGS, PRESET_LIBRARY } from '../shared/config';
import { resolveMediaUrl, fetchAsDataUrl, assignDefaultHotkey } from '../shared/media-resolver';
import {
  Play,
  Trash2,
  Plus,
  Globe,
  CheckCircle2,
  Volume2,
  VolumeX,
  Layout,
  Clock,
  Layers,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { MemeApiModal } from './MemeApiModal';

export const Popup: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [testedMemeId, setTestedMemeId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New meme form state
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('✨');
  const [newUrl, setNewUrl] = useState('');
  const [newHotkey, setNewHotkey] = useState('');
  const [urlStatus, setUrlStatus] = useState<string | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleToggleEnabled = async () => {
    const updated = await saveSettings({ enabled: !settings.enabled });
    setSettings(updated);
  };

  const handleToggleDock = async () => {
    const updated = await saveSettings({ dockVisible: !settings.dockVisible });
    setSettings(updated);
  };

  const handleToggleSound = async () => {
    const updated = await saveSettings({ soundEnabled: !settings.soundEnabled });
    setSettings(updated);
  };

  const handlePositionChange = async (position: MemeOverlayPosition) => {
    const updated = await saveSettings({ position });
    setSettings(updated);
  };

  const handleDurationChange = async (defaultDurationMs: number) => {
    const updated = await saveSettings({ defaultDurationMs });
    setSettings(updated);
  };

  const handleTriggerTest = async (meme: MemeItem) => {
    setTestedMemeId(meme.id);
    setTimeout(() => setTestedMemeId(null), 1200);

    if (typeof chrome !== 'undefined' && chrome.tabs) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'TRIGGER_MEME_ITEM',
          meme
        });
      }
    }
  };

  const handleDeleteMeme = async (memeId: string) => {
    const updated = await removeMeme(memeId);
    setSettings(updated);
  };

  const handleUrlInputChange = async (val: string) => {
    setNewUrl(val);
    const trimmed = val.trim();
    if (!trimmed) {
      setUrlStatus(null);
      return;
    }

    if (trimmed.includes('tenor.com') || trimmed.includes('giphy.com')) {
      setUrlStatus('Resolving media link...');
      try {
        const resolved = await resolveMediaUrl(trimmed);
        if (resolved.name && !newName) {
          setNewName(resolved.name);
        }
        setUrlStatus('✓ Media link detected');
      } catch (err: any) {
        setUrlStatus(err?.message || 'Error resolving URL');
      }
    }
  };

  const handleAddCustomMeme = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = newUrl.trim();
    if (!raw) return;

    setIsSaving(true);
    setUrlStatus('Saving & optimizing GIF...');

    try {
      const resolved = await resolveMediaUrl(raw);
      const dataUrl = await fetchAsDataUrl(resolved.url);

      const hotkey = newHotkey.trim() || assignDefaultHotkey(settings.memes.length);
      const meme: MemeItem = {
        id: `meme_${Date.now()}`,
        name: newName.trim() || resolved.name || 'Custom Meme',
        emoji: newEmoji.trim() || '✨',
        assetUrl: dataUrl,
        hotkey,
        durationMs: settings.defaultDurationMs
      };

      const updated = await addMeme(meme);
      setSettings(updated);
      setNewName('');
      setNewUrl('');
      setNewEmoji('✨');
      setNewHotkey('');
      setUrlStatus(null);
      setShowAddForm(false);
    } catch (err: any) {
      setUrlStatus(`Failed: ${err?.message || 'Error saving meme'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectPreset = async (preset: MemeItem) => {
    const hotkey = assignDefaultHotkey(settings.memes.length);
    // Convert to dataUrl for guaranteed CSP safety
    const dataUrl = await fetchAsDataUrl(preset.assetUrl);
    const meme: MemeItem = {
      ...preset,
      id: `meme_${Date.now()}`,
      assetUrl: dataUrl,
      hotkey
    };
    const updated = await addMeme(meme);
    setSettings(updated);
  };

  const handleSelectFromApi = async (url: string, title: string) => {
    const hotkey = assignDefaultHotkey(settings.memes.length);
    const dataUrl = await fetchAsDataUrl(url);
    const meme: MemeItem = {
      id: `meme_${Date.now()}`,
      name: title,
      emoji: '🔥',
      assetUrl: dataUrl,
      hotkey,
      durationMs: settings.defaultDurationMs
    };
    const updated = await addMeme(meme);
    setSettings(updated);
    setShowApiModal(false);
  };

  const resolveThumbUrl = (assetUrl: string) => {
    if (assetUrl.startsWith('http') || assetUrl.startsWith('data:')) return assetUrl;
    if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
      return chrome.runtime.getURL(assetUrl.replace(/^\//, ''));
    }
    return assetUrl.startsWith('/') ? assetUrl : `/${assetUrl}`;
  };

  return (
    <div className="popup-container">
      {/* Header */}
      <header className="popup-header">
        <div className="brand-wrapper">
          <div className="brand-logo">🎭</div>
          <div>
            <h1 className="brand-title">Memecord</h1>
          </div>
        </div>
        <div className={`status-badge ${settings.enabled ? 'active' : 'inactive'}`}>
          <span className={`status-dot ${settings.enabled ? 'pulse' : ''}`} />
          {settings.enabled ? 'Active' : 'Paused'}
        </div>
      </header>

      {/* Master Toggle */}
      <div className="master-card">
        <div className="toggle-label-group">
          <span className="toggle-title">Enable Memecord</span>
          <span className="toggle-sub">Hotkeys & on-screen overlay toolbar</span>
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

      {/* Quick Settings Bar */}
      <div className="settings-grid">
        <div className="setting-card">
          <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Layout size={12} /> Position
          </label>
          <select
            value={settings.position}
            onChange={(e) => handlePositionChange(e.target.value as MemeOverlayPosition)}
          >
            <option value="top-center">Top Center</option>
            <option value="center">Center</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </div>

        <div className="setting-card">
          <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={12} /> Duration
          </label>
          <select
            value={settings.defaultDurationMs}
            onChange={(e) => handleDurationChange(Number(e.target.value))}
          >
            <option value={1500}>1.5s</option>
            <option value={2000}>2.0s</option>
            <option value={2500}>2.5s</option>
            <option value={3500}>3.5s</option>
            <option value={5000}>5.0s</option>
          </select>
        </div>
      </div>

      {/* Toggles Row */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className={`test-link-btn ${settings.dockVisible ? 'active' : ''}`}
          style={{ flex: 1, padding: '7px 10px', fontSize: 11 }}
          onClick={handleToggleDock}
        >
          <Layers size={13} />
          {settings.dockVisible ? 'Dock: Visible' : 'Dock: Hidden'}
        </button>

        <button
          className="test-link-btn"
          style={{ width: 'auto', padding: '7px 12px', fontSize: 11 }}
          onClick={handleToggleSound}
          title="Toggle Pop Sound FX"
        >
          {settings.soundEnabled ? <Volume2 size={13} color="#4ade80" /> : <VolumeX size={13} color="#94a3b8" />}
        </button>
      </div>

      {/* Memes & Hotkeys List */}
      <section>
        <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="section-title" style={{ margin: 0 }}>
            Memes & Hotkeys ({settings.memes.length})
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="test-btn"
              style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={() => setShowApiModal(true)}
              title="Search online memes"
            >
              <Globe size={11} /> Browse
            </button>
            <button
              className="test-btn"
              style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, background: '#6366f1', borderColor: '#818cf8', color: '#fff' }}
              onClick={() => {
                setShowAddForm(!showAddForm);
                if (!showAddForm) {
                  setNewHotkey(assignDefaultHotkey(settings.memes.length));
                }
              }}
              title="Add custom meme"
            >
              <Plus size={11} /> Add
            </button>
          </div>
        </div>

        {/* Add Meme Form */}
        {showAddForm && (
          <form onSubmit={handleAddCustomMeme} style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 10, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid rgba(99,102,241,0.3)' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                placeholder="Name (e.g. Pop Cat)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{ flex: 1, padding: '6px 10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', fontSize: 12 }}
                required
              />
              <input
                type="text"
                placeholder="Emoji"
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value)}
                maxLength={3}
                style={{ width: 44, textAlign: 'center', padding: '6px 4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', fontSize: 12 }}
              />
              <input
                type="text"
                placeholder="Key"
                value={newHotkey}
                onChange={(e) => setNewHotkey(e.target.value)}
                maxLength={2}
                title="Hotkey number or letter (e.g. 1-9, 0, Q)"
                style={{ width: 44, textAlign: 'center', padding: '6px 4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', fontSize: 12 }}
              />
            </div>
            <input
              type="url"
              placeholder="Paste Tenor, Giphy, or image link..."
              value={newUrl}
              onChange={(e) => handleUrlInputChange(e.target.value)}
              style={{ width: '100%', padding: '6px 10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', fontSize: 12 }}
              required
            />
            {urlStatus && (
              <span style={{ fontSize: 11, color: urlStatus.startsWith('✓') ? '#4ade80' : '#818cf8' }}>
                {urlStatus}
              </span>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                disabled={isSaving}
                style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                style={{ padding: '5px 12px', background: '#6366f1', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 600, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
              >
                {isSaving && <Loader2 size={12} className="spin" />}
                {isSaving ? 'Saving...' : 'Save Meme'}
              </button>
            </div>
          </form>
        )}

        {/* Memes List */}
        <div className="mappings-list" style={{ maxHeight: 220, overflowY: 'auto' }}>
          {settings.memes.map((meme, idx) => {
            const isJustTested = testedMemeId === meme.id;
            const hotkeyLabel = meme.hotkey || assignDefaultHotkey(idx);

            return (
              <div key={meme.id} className="mapping-item" style={{ padding: '8px 10px' }}>
                <div className="mapping-item-main">
                  <div className="mapping-info" style={{ gap: 8 }}>
                    <img
                      src={resolveThumbUrl(meme.assetUrl)}
                      alt={meme.name}
                      style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', background: '#1e293b' }}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="mapping-emoji" style={{ width: 28, height: 28, fontSize: 15 }}>
                      {meme.emoji || '✨'}
                    </div>
                    <div style={{ maxWidth: 160 }}>
                      <div className="mapping-name" style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {meme.name}
                      </div>
                      <div className="mapping-desc" style={{ fontSize: 10, color: '#a5b4fc' }}>
                        Hotkey: <strong style={{ color: '#fff' }}>[{hotkeyLabel}]</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mapping-actions" style={{ gap: 4 }}>
                    <button
                      className="test-btn"
                      onClick={() => handleTriggerTest(meme)}
                      title={`Trigger ${meme.name} on current tab`}
                    >
                      {isJustTested ? <CheckCircle2 size={12} color="#4ade80" /> : <Play size={11} />}
                    </button>
                    {settings.memes.length > 1 && (
                      <button
                        className="test-btn"
                        style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                        onClick={() => handleDeleteMeme(meme.id)}
                        title="Delete meme"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Preset Library */}
      <section>
        <div className="section-title" style={{ marginBottom: 6 }}>Popular Presets</div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {PRESET_LIBRARY.slice(9).map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                padding: '4px 8px',
                color: '#f8fafc',
                fontSize: 11,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
              title={`Add ${preset.name}`}
            >
              <span>{preset.emoji}</span>
              <span>{preset.name}</span>
              <Plus size={10} style={{ marginLeft: 2, opacity: 0.7 }} />
            </button>
          ))}
        </div>
      </section>

      {/* Universal Meeting Guide */}
      <div className="privacy-box" style={{ borderColor: 'rgba(99, 102, 241, 0.25)', background: 'rgba(15, 23, 42, 0.6)' }}>
        <HelpCircle className="privacy-icon" size={16} color="#818cf8" />
        <div style={{ fontSize: 11 }}>
          <strong>Global Meetings:</strong> Works on Google Meet, Discord, Zoom, Teams, Slack & FaceTime in Chrome.
          Press <strong>1–9</strong> or click dock icons. Right-click or click <strong>✏️</strong> on dock to delete memes.
        </div>
      </div>

      {/* Online Meme API Modal */}
      {showApiModal && (
        <MemeApiModal
          onSelect={handleSelectFromApi}
          onClose={() => setShowApiModal(false)}
        />
      )}
    </div>
  );
};
