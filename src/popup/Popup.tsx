import React, { useEffect, useState } from 'react';
import { getSettings, saveSettings, addMeme, removeMeme, updateMemeHotkey, findClashingMeme } from '../shared/storage';
import { AppSettings, MemeItem, MemeOverlayPosition } from '../shared/types';
import { DEFAULT_SETTINGS, PRESET_LIBRARY } from '../shared/config';
import { getGiphyUsage, describeGiphyUsage, UsageInfo } from '../shared/usage';
import { resolveMediaUrl, fetchAsDataUrl, assignDefaultHotkey, findFirstAvailableHotkey } from '../shared/media-resolver';
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
  Loader2,
  Edit2,
  Check,
  X,
  Flame
} from 'lucide-react';
import { MemeApiModal } from './MemeApiModal';

export const Popup: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [testedMemeId, setTestedMemeId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // 'unknown' until the active tab answers; 'unsupported' = no Memecord there (not a call site)
  const [callState, setCallState] = useState<'unknown' | 'in-call' | 'idle' | 'unsupported'>('unknown');

  // New meme form state
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newHotkey, setNewHotkey] = useState('');
  const [urlStatus, setUrlStatus] = useState<string | null>(null);

  // Hotkey editing state
  const [editingMemeId, setEditingMemeId] = useState<string | null>(null);
  const [editKeyVal, setEditKeyVal] = useState<string>('');
  const [editKeyError, setEditKeyError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.tabs) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) return;
        const res = await chrome.tabs.sendMessage(tab.id, { type: 'GET_CALL_STATE' });
        if (!cancelled) setCallState(res?.inCall ? 'in-call' : 'idle');
      } catch (_) {
        if (!cancelled) setCallState('unsupported');
      }
    };
    poll();
    const id = setInterval(poll, 1500);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // GIPHY key is kept as a draft until blur so we don't write storage on every keystroke
  const [giphyKeyDraft, setGiphyKeyDraft] = useState('');
  const [giphyUsage, setGiphyUsage] = useState<UsageInfo | null>(null);

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      setGiphyKeyDraft(s.giphyApiKey || '');
    });
  }, []);

  useEffect(() => {
    const load = () => getGiphyUsage().then(setGiphyUsage).catch(() => {});
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const handleSaveGiphyKey = async () => {
    const giphyApiKey = giphyKeyDraft.trim();
    if (giphyApiKey === (settings.giphyApiKey || '')) return;
    const updated = await saveSettings({ giphyApiKey });
    setSettings(updated);
    // Drop the cached feed so the next refresh includes (or excludes) GIPHY
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.remove('memecord_trending_cache');
    }
  };

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
        chrome.tabs
          .sendMessage(tab.id, {
            type: 'TRIGGER_MEME_ITEM',
            meme
          })
          .catch(() => {});
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

    const hotkey = (newHotkey.trim() || findFirstAvailableHotkey(settings.memes)).toUpperCase();
    const clash = findClashingMeme(settings.memes, hotkey);
    if (clash) {
      setUrlStatus(`⚠️ Key [${hotkey}] is already assigned to "${clash.name}". Change old one first.`);
      return;
    }

    setIsSaving(true);
    setUrlStatus('Saving & optimizing GIF...');

    try {
      const resolved = await resolveMediaUrl(raw);
      const assetUrl = resolved.url;

      const meme: MemeItem = {
        id: `meme_${Date.now()}`,
        name: newName.trim() || resolved.name || 'Custom Meme',
        emoji: '',
        assetUrl,
        hotkey,
        durationMs: settings.defaultDurationMs
      };

      const updated = await addMeme(meme);
      setSettings(updated);
      setNewName('');
      setNewUrl('');
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
    const hotkey = findFirstAvailableHotkey(settings.memes);
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
    const hotkey = findFirstAvailableHotkey(settings.memes);
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
          <div className="brand-logo" style={{ overflow: 'hidden', padding: 0 }}>
            <img src="/icons/logo.png" alt="Memecord Logo" style={{ width: '100%', height: '100%', borderRadius: 8, objectFit: 'cover' }} />
          </div>
          <div>
            <h1 className="brand-title">Memecord</h1>
            <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Chrome Extension
            </span>
          </div>
        </div>
        <div className={`status-badge ${settings.enabled ? 'active' : 'inactive'}`}>
          <span className={`status-dot ${settings.enabled ? 'pulse' : ''}`} />
          {settings.enabled ? 'Active' : 'Paused'}
        </div>
      </header>

      {/* Call status: Memecord stays idle unless this tab is in a call */}
      {callState !== 'unknown' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
            padding: '6px 10px',
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 600,
            background: callState === 'in-call' ? 'rgba(52, 211, 153, 0.12)' : 'rgba(148, 163, 184, 0.1)',
            border: `1px solid ${callState === 'in-call' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(148, 163, 184, 0.2)'}`,
            color: callState === 'in-call' ? '#6ee7b7' : '#94a3b8'
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: callState === 'in-call' ? '#34d399' : '#64748b'
            }}
          />
          {callState === 'in-call' && 'In a call — memes are live in this tab'}
          {callState === 'idle' && 'Not in a call — Memecord is idle until you join one'}
          {callState === 'unsupported' && 'Open a video call tab (Meet, Discord, Zoom…) to use Memecord'}
        </div>
      )}

      {/* Chrome Extension Scope Pill */}
      <div style={{
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(129, 140, 248, 0.25)',
        borderRadius: 8,
        padding: '6px 10px',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 11,
        color: '#cbd5e1'
      }}>
        <span>🌐</span>
        <span><strong>Chrome Extension</strong> • Google Meet, Discord Web, Zoom, Teams</span>
      </div>

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

      {/* Trending feed source */}
      <div className="setting-card" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Flame size={12} /> Trending GIFs (optional GIPHY key)
        </label>
        <input
          type="password"
          value={giphyKeyDraft}
          placeholder="Paste a free GIPHY API key"
          onChange={(e) => setGiphyKeyDraft(e.target.value)}
          onBlur={handleSaveGiphyKey}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
          autoComplete="off"
          spellCheck={false}
          style={{ width: '100%', padding: '6px 10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#fff', fontSize: 12 }}
        />
        {settings.giphyApiKey && giphyUsage && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: giphyUsage.remaining === 0 ? '#f87171' : giphyUsage.remaining <= 20 ? '#fbbf24' : '#94a3b8'
            }}
          >
            {describeGiphyUsage(giphyUsage)}
          </span>
        )}
        <span style={{ fontSize: 10.5, color: '#94a3b8', lineHeight: 1.4 }}>
          The HUD's Trending tab always shows what's hot on Reddit. Add a key from{' '}
          <a href="https://developers.giphy.com/dashboard/" target="_blank" rel="noreferrer" style={{ color: '#a5b4fc' }}>
            developers.giphy.com
          </a>{' '}
          to also get trending GIFs (the same feed behind X's GIF picker) and GIF search.
        </span>
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
                const nextOpen = !showAddForm;
                setShowAddForm(nextOpen);
                if (nextOpen) {
                  setNewHotkey(findFirstAvailableHotkey(settings.memes));
                  setUrlStatus(null);
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
                placeholder="Key"
                value={newHotkey}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setNewHotkey(val);
                  const clash = findClashingMeme(settings.memes, val);
                  if (clash) {
                    setUrlStatus(`⚠️ Key [${val}] is assigned to "${clash.name}". Change old one first.`);
                  } else if (urlStatus?.startsWith('⚠️ Key')) {
                    setUrlStatus(null);
                  }
                }}
                maxLength={2}
                title="Hotkey number or letter (e.g. 1-9, 0, Q)"
                style={{
                  width: 50,
                  textAlign: 'center',
                  padding: '6px 4px',
                  background: newHotkey && findClashingMeme(settings.memes, newHotkey) ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0,0,0,0.3)',
                  border: newHotkey && findClashingMeme(settings.memes, newHotkey) ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 6,
                  color: newHotkey && findClashingMeme(settings.memes, newHotkey) ? '#ef4444' : '#fff',
                  fontSize: 12,
                  fontWeight: newHotkey && findClashingMeme(settings.memes, newHotkey) ? 700 : 400
                }}
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
              <span style={{ fontSize: 11, color: urlStatus.startsWith('✓') ? '#4ade80' : '#ef4444' }}>
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
                disabled={isSaving || Boolean(newHotkey && findClashingMeme(settings.memes, newHotkey))}
                style={{
                  padding: '5px 12px',
                  background: newHotkey && findClashingMeme(settings.memes, newHotkey) ? '#475569' : '#6366f1',
                  border: 'none',
                  borderRadius: 6,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: newHotkey && findClashingMeme(settings.memes, newHotkey) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}
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
                      style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover', background: '#1e293b' }}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div style={{ maxWidth: 170 }}>
                      <div className="mapping-name" style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {meme.name}
                      </div>
                      {editingMemeId === meme.id ? (
                        <div style={{ marginTop: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: 10, color: '#a5b4fc' }}>Key:</span>
                            <input
                              type="text"
                              value={editKeyVal}
                              onChange={(e) => {
                                const val = e.target.value.toUpperCase();
                                setEditKeyVal(val);
                                const clash = findClashingMeme(settings.memes, val, meme.id);
                                if (clash) {
                                  setEditKeyError(`Key [${val}] is assigned to "${clash.name}". Change old one first.`);
                                } else {
                                  setEditKeyError(null);
                                }
                              }}
                              maxLength={2}
                              style={{
                                width: 32,
                                height: 20,
                                textAlign: 'center',
                                padding: '2px 4px',
                                background: editKeyError ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0,0,0,0.4)',
                                border: editKeyError ? '1px solid #ef4444' : '1px solid rgba(99,102,241,0.5)',
                                borderRadius: 4,
                                color: '#fff',
                                fontSize: 11,
                                fontWeight: 700
                              }}
                              autoFocus
                            />
                            <button
                              type="button"
                              className="test-btn"
                              disabled={Boolean(editKeyError) || !editKeyVal.trim()}
                              onClick={async () => {
                                if (editKeyError || !editKeyVal.trim()) return;
                                try {
                                  const updated = await updateMemeHotkey(meme.id, editKeyVal.trim());
                                  setSettings(updated);
                                  setEditingMemeId(null);
                                  setEditKeyError(null);
                                } catch (err: any) {
                                  setEditKeyError(err?.message || 'Error updating key');
                                }
                              }}
                              style={{ padding: '2px 5px', fontSize: 10, background: editKeyError ? 'rgba(255,255,255,0.05)' : '#6366f1', color: '#fff' }}
                              title="Save key"
                            >
                              <Check size={10} />
                            </button>
                            <button
                              type="button"
                              className="test-btn"
                              onClick={() => {
                                setEditingMemeId(null);
                                setEditKeyError(null);
                              }}
                              style={{ padding: '2px 5px', fontSize: 10 }}
                              title="Cancel"
                            >
                              <X size={10} />
                            </button>
                          </div>
                          {editKeyError && (
                            <div style={{ fontSize: 9, color: '#ef4444', marginTop: 2 }}>{editKeyError}</div>
                          )}
                        </div>
                      ) : (
                        <div className="mapping-desc" style={{ fontSize: 10, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 4 }}>
                          Hotkey: <strong style={{ color: '#fff' }}>[{hotkeyLabel}]</strong>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMemeId(meme.id);
                              setEditKeyVal(meme.hotkey || assignDefaultHotkey(idx));
                              setEditKeyError(null);
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#818cf8',
                              cursor: 'pointer',
                              padding: '0 2px',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                            title="Change keybinding"
                          >
                            <Edit2 size={10} />
                          </button>
                        </div>
                      )}
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
