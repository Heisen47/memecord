import { AppSettings, MemeItem, MemeOverlayPosition } from '../shared/types';
import { FloatingDock, AddMemePrefill, CallMode } from './floating-dock';
import { OVERLAY_CSS } from './overlay-styles';
import { resolveMediaUrl, findFirstAvailableHotkey } from '../shared/media-resolver';
import { saveSettings, updateMemeHotkey, findClashingMeme } from '../shared/storage';
import { PRESET_LIBRARY } from '../shared/config';
import { el, icon, createMediaThumb, readFileAsDataUrl, nameFromFilename } from './dom-utils';

export interface MemeOverlayCallbacks {
  onTriggerMeme?: (meme: MemeItem) => void;
  onAddMeme?: (meme: MemeItem) => void | Promise<void>;
  onDeleteMeme?: (memeId: string) => void;
  onUpdateHotkey?: (memeId: string, newHotkey: string) => void;
  onDockMinimizedChange?: (minimized: boolean) => void;
}

// chrome.storage.local quota is generous with unlimitedStorage, but keep uploads call-friendly
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export class MemeOverlayManager {
  private root: HTMLElement | null = null;
  private currentMemeBox: HTMLElement | null = null;
  private currentToast: HTMLElement | null = null;
  private currentModal: HTMLElement | null = null;
  private modalCleanup: (() => void) | null = null;
  private hideTimeoutId: any = null;
  private removeTimeoutId: any = null;
  private toastTimeoutId: any = null;
  private floatingDock: FloatingDock | null = null;
  private settings: AppSettings;
  private callbacks: MemeOverlayCallbacks;
  private callMode: CallMode = 'local';
  private audioCtx: AudioContext | null = null;

  constructor(settings: AppSettings, callbacks: MemeOverlayCallbacks = {}) {
    this.settings = settings;
    this.callbacks = callbacks;

    this.initRoot();

    if (this.root) {
      this.floatingDock = new FloatingDock(
        this.root,
        this.settings.memes,
        {
          onTriggerMeme: (meme) => {
            if (this.callbacks.onTriggerMeme) {
              this.callbacks.onTriggerMeme(meme);
            } else {
              this.showMeme(meme);
            }
          },
          onAddMeme: (prefill) => {
            this.openQuickAddModal(prefill);
          },
          onDeleteMeme: (memeId) => {
            const meme = this.settings.memes.find((m) => m.id === memeId);
            this.callbacks.onDeleteMeme?.(memeId);
            this.showToast(`Removed "${meme?.name || 'meme'}"`);
          },
          onUpdateHotkey: async (memeId, newHotkey) => {
            const meme = this.settings.memes.find((m) => m.id === memeId);
            try {
              const updated = await updateMemeHotkey(memeId, newHotkey);
              this.updateSettings(updated);
              this.callbacks.onUpdateHotkey?.(memeId, newHotkey);
              this.showToast(`"${meme?.name || 'Meme'}" is now on key ${newHotkey}`);
            } catch (err: any) {
              this.showToast(err?.message || 'Could not change key');
            }
          },
          onMinimizedChange: (minimized) => {
            this.callbacks.onDockMinimizedChange?.(minimized);
          },
          onPositionChange: (pos) => {
            this.settings.position = pos;
            saveSettings({ position: pos });
            this.showPositionPreview(pos);
          }
        },
        this.settings.position,
        !this.settings.dockVisible
      );
    }
  }

  public updateSettings(settings: AppSettings) {
    this.settings = settings;
    this.floatingDock?.updateMemes(settings.memes);
    this.floatingDock?.setPosition(settings.position);
    this.floatingDock?.setMinimized(!settings.dockVisible, false);
  }

  /** Whether the HUD (deck or minimized pebble) is on screen at all */
  public setDockVisible(visible: boolean) {
    this.floatingDock?.setVisible(visible);
  }

  public setDockMinimized(minimized: boolean) {
    this.floatingDock?.setMinimized(minimized, false);
  }

  /** Tells the HUD whether memes are currently being stamped onto an outgoing camera */
  public setCameraLive(live: boolean) {
    this.callMode = live ? 'live' : 'local';
    this.floatingDock?.setCallMode(this.callMode);
  }

  /** True while a Memecord dialog wants the keyboard (hotkeys should pause) */
  public isCapturingKeyboard(): boolean {
    return Boolean(this.currentModal) || Boolean(this.floatingDock?.isModalOpen());
  }

  public showToast(message: string, durationMs: number = 2500) {
    if (!this.root) return;

    this.currentToast?.remove();
    this.currentToast = null;
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
      this.toastTimeoutId = null;
    }

    const toast = el('div', 'memecord-toast', message);
    toast.setAttribute('role', 'status');
    this.root.appendChild(toast);
    this.currentToast = toast;

    requestAnimationFrame(() => toast.classList.add('visible'));

    this.toastTimeoutId = setTimeout(() => {
      toast.classList.remove('visible');
      toast.classList.add('hiding');
      setTimeout(() => {
        toast.remove();
        if (this.currentToast === toast) this.currentToast = null;
      }, 300);
    }, durationMs);
  }

  /**
   * Shows the meme on your own screen. When your camera is live the remote side
   * already gets it stamped on video (and your self-view shows it), so the local
   * copy is a small confirmation; otherwise it's the full-size preview with a nudge.
   */
  public showMeme(meme: MemeItem) {
    if (!this.root || !this.settings.enabled) return;

    if (this.settings.soundEnabled) {
      this.playTriggerSound();
    }

    if (this.hideTimeoutId) clearTimeout(this.hideTimeoutId);
    if (this.removeTimeoutId) clearTimeout(this.removeTimeoutId);
    this.hideTimeoutId = null;
    this.removeTimeoutId = null;
    this.currentMemeBox?.remove();
    this.currentMemeBox = null;

    const duration = meme.durationMs || this.settings.defaultDurationMs || 2500;
    const live = this.callMode === 'live';
    this.floatingDock?.markFiring(meme.id, duration);

    const box = el('div', `memecord-meme-box ${this.getPositionClass(this.settings.position || 'top-center')}${live ? ' compact' : ''}`);
    box.setAttribute('aria-live', 'polite');

    const media = createMediaThumb(meme.assetUrl, meme.name, 'memecord-meme-image');

    const title = el('div', 'memecord-meme-title');
    const badge = el('span', `memecord-meme-badge ${live ? 'live' : 'local'}`);
    badge.appendChild(el('span', 'memecord-dot'));
    badge.appendChild(el('span', '', live ? 'On camera' : 'Only you'));
    title.append(badge, el('span', '', meme.name));

    box.append(media, title);
    if (!live) {
      box.appendChild(el('div', 'memecord-meme-caption', 'Turn your camera on so others see it'));
    }

    this.root.appendChild(box);
    this.currentMemeBox = box;
    requestAnimationFrame(() => box.classList.add('visible'));

    this.hideTimeoutId = setTimeout(() => {
      box.classList.remove('visible');
      box.classList.add('hiding');
      this.removeTimeoutId = setTimeout(() => {
        box.remove();
        if (this.currentMemeBox === box) this.currentMemeBox = null;
      }, 300);
    }, duration);
  }

  /** Brief outline in the chosen spot so the position picker gives visible feedback */
  private showPositionPreview(pos: MemeOverlayPosition) {
    const labels: Record<MemeOverlayPosition, string> = {
      'top-center': 'top',
      'top-right': 'top right',
      center: 'center',
      'bottom-right': 'bottom right'
    };
    this.showToast(`Memes will appear ${labels[pos]} on your video`, 1800);
  }

  // ---------- Add meme modal ----------

  public openQuickAddModal(prefill: AddMemePrefill = {}) {
    if (!this.root) return;
    this.closeModal();

    const nextKey = findFirstAvailableHotkey(this.settings.memes);
    const existingIds = new Set(this.settings.memes.map((m) => m.id));
    const existingUrls = new Set(this.settings.memes.map((m) => m.assetUrl));
    const picks = PRESET_LIBRARY.filter((p) => !existingIds.has(p.id) && !existingUrls.has(p.assetUrl));

    // Selected source: either an uploaded/dropped data URL or a pasted link
    let source: { url: string; name?: string } | null = null;
    let resolveTimer: any = null;
    let resolveToken = 0;

    const backdrop = el('div', 'memecord-modal-backdrop');
    backdrop.dataset.memecordModal = 'add';
    const modal = el('div', 'memecord-modal');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Add a meme');

    // Head
    const head = el('div', 'memecord-modal-head');
    const headText = el('div');
    headText.appendChild(el('h2', '', 'Add a meme'));
    headText.appendChild(el('p', '', 'GIF, image or short video. Give it a key to fire it mid-call.'));
    const closeBtn = el('button', 'memecord-icon-btn');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = icon('x', 16);
    head.append(headText, closeBtn);

    // Upload / drop zone
    const fileInput = el('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/gif,image/webp,image/png,image/jpeg,video/mp4,video/webm';
    fileInput.style.display = 'none';

    const dropzone = el('div', 'memecord-dropzone');
    dropzone.setAttribute('role', 'button');
    dropzone.tabIndex = 0;
    dropzone.innerHTML = icon('upload', 20);
    dropzone.appendChild(el('strong', '', 'Upload or drop a file'));
    dropzone.appendChild(el('span', '', 'GIF, WebP, PNG, JPG, MP4 · up to 8 MB'));

    // URL field
    const urlField = el('div', 'memecord-field');
    const urlLabel = el('label', 'memecord-label', 'Paste a link');
    urlLabel.htmlFor = 'memecord-add-url';
    const urlInput = el('input', 'memecord-input');
    urlInput.id = 'memecord-add-url';
    urlInput.type = 'url';
    urlInput.placeholder = 'Tenor, Giphy or direct .gif / .mp4 link';
    urlInput.autocomplete = 'off';
    urlField.append(urlLabel, urlInput);

    // Quick picks
    let picksWrap: HTMLElement | null = null;
    if (picks.length > 0) {
      picksWrap = el('div', 'memecord-field');
      picksWrap.appendChild(el('span', 'memecord-label', 'Or pick a classic'));
      const pickGrid = el('div', 'memecord-picks');
      picks.slice(0, 12).forEach((p) => {
        const btn = el('button', 'memecord-pick');
        btn.type = 'button';
        btn.title = p.name;
        btn.setAttribute('aria-label', p.name);
        btn.appendChild(createMediaThumb(p.assetUrl, p.name));
        btn.addEventListener('click', () => {
          pickGrid.querySelectorAll('.memecord-pick').forEach((b) => b.classList.remove('selected'));
          btn.classList.add('selected');
          urlInput.value = '';
          if (!nameTouched) nameInput.value = p.name;
          setSource({ url: p.assetUrl, name: p.name }, 'Ready to add');
        });
        pickGrid.appendChild(btn);
      });
      picksWrap.appendChild(pickGrid);
    }

    // Name + key
    const row = el('div', 'memecord-row');
    const nameField = el('div', 'memecord-field');
    const nameLabel = el('label', 'memecord-label', 'Name');
    nameLabel.htmlFor = 'memecord-add-name';
    const nameInput = el('input', 'memecord-input');
    nameInput.id = 'memecord-add-name';
    nameInput.type = 'text';
    nameInput.placeholder = 'e.g. Happy Cat';
    nameInput.maxLength = 40;
    nameField.append(nameLabel, nameInput);
    let nameTouched = false;
    nameInput.addEventListener('input', () => {
      nameTouched = nameInput.value.trim().length > 0;
      updatePreview();
    });

    const keyField = el('div', 'memecord-field key-field');
    const keyLabel = el('label', 'memecord-label', 'Key');
    keyLabel.htmlFor = 'memecord-add-key';
    const keyInput = el('input', 'memecord-input memecord-key-input');
    keyInput.id = 'memecord-add-key';
    keyInput.type = 'text';
    keyInput.readOnly = true;
    keyInput.value = nextKey;
    keyInput.title = 'Click, then press a key';
    keyField.append(keyLabel, keyInput);
    row.append(nameField, keyField);

    const hint = el('div', 'memecord-hint');

    // Preview
    const preview = el('div', 'memecord-preview');
    preview.style.display = 'none';

    // Actions
    const actions = el('div', 'memecord-modal-actions');
    const cancelBtn = el('button', 'memecord-btn', 'Cancel');
    cancelBtn.type = 'button';
    const submitBtn = el('button', 'memecord-btn primary', 'Add to deck');
    submitBtn.type = 'button';
    submitBtn.disabled = true;
    actions.append(cancelBtn, submitBtn);

    modal.append(head, dropzone, fileInput, el('div', 'memecord-divider', 'or'), urlField);
    if (picksWrap) modal.appendChild(picksWrap);
    modal.append(row, hint, preview, actions);
    backdrop.appendChild(modal);

    const setHint = (text: string, tone: '' | 'error' | 'success' = '') => {
      hint.textContent = text;
      hint.className = `memecord-hint${tone ? ` ${tone}` : ''}`;
    };

    const keyIsValid = (): boolean => {
      const key = keyInput.value.trim().toUpperCase();
      const clash = key ? findClashingMeme(this.settings.memes, key) : undefined;
      keyInput.classList.toggle('invalid', !key || Boolean(clash));
      if (!key) {
        setHint('Pick a key for this meme.', 'error');
        return false;
      }
      if (clash) {
        setHint(`${key} is already used by "${clash.name}".`, 'error');
        return false;
      }
      return true;
    };

    const updatePreview = () => {
      preview.innerHTML = '';
      if (!source) {
        preview.style.display = 'none';
        submitBtn.disabled = true;
        return;
      }
      preview.style.display = 'flex';
      preview.appendChild(createMediaThumb(source.url, 'Preview', 'memecord-preview-media'));
      const text = el('div', 'memecord-preview-text');
      text.appendChild(el('strong', '', nameInput.value.trim() || source.name || 'Untitled meme'));
      text.appendChild(el('span', '', `Fires with key ${keyInput.value || '—'}`));
      preview.appendChild(text);
      submitBtn.disabled = !keyIsValid();
    };

    const setSource = (next: { url: string; name?: string } | null, message = '') => {
      source = next;
      if (next?.name && !nameTouched) nameInput.value = next.name;
      if (message) setHint(message, 'success');
      updatePreview();
      if (next && keyIsValid() && message) setHint(message, 'success');
    };

    const clearPickSelection = () => {
      modal.querySelectorAll('.memecord-pick').forEach((b) => b.classList.remove('selected'));
    };

    const useFile = async (file: File) => {
      if (!/^(image|video)\//.test(file.type)) {
        setHint('That file isn\'t an image or video.', 'error');
        return;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        setHint(`That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — keep it under 8 MB.`, 'error');
        return;
      }
      clearPickSelection();
      urlInput.value = '';
      setHint('Reading file…');
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setSource({ url: dataUrl, name: nameFromFilename(file.name) }, `Loaded ${file.name}`);
      } catch (err: any) {
        setHint(err?.message || 'Could not read that file.', 'error');
      }
    };

    const useUrl = (raw: string) => {
      clearPickSelection();
      if (resolveTimer) clearTimeout(resolveTimer);
      const trimmed = raw.trim();
      urlInput.classList.remove('invalid');
      if (!trimmed) {
        setSource(null);
        setHint('');
        return;
      }
      setHint('Checking link…');
      const token = ++resolveToken;
      resolveTimer = setTimeout(async () => {
        try {
          const res = await resolveMediaUrl(trimmed);
          if (token !== resolveToken) return;
          setSource({ url: res.url, name: res.name }, 'Link looks good');
        } catch (err: any) {
          if (token !== resolveToken) return;
          urlInput.classList.add('invalid');
          setSource(null);
          setHint(err?.message || 'That link doesn\'t look like a GIF or video.', 'error');
        }
      }, 300);
    };

    // Wiring
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (file) useFile(file);
      fileInput.value = '';
    });
    ['dragenter', 'dragover'].forEach((type) =>
      dropzone.addEventListener(type, (e) => {
        e.preventDefault();
        dropzone.classList.add('over');
      })
    );
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('over'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('over');
      const file = e.dataTransfer?.files?.[0];
      const link = e.dataTransfer?.getData('text/uri-list');
      if (file) useFile(file);
      else if (link) {
        urlInput.value = link.split('\n')[0].trim();
        useUrl(urlInput.value);
      }
    });

    urlInput.addEventListener('input', () => useUrl(urlInput.value));

    keyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' || e.key === 'Escape' || e.key === 'Enter') return;
      e.preventDefault();
      e.stopPropagation();
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length === 1 && /[a-z0-9]/i.test(e.key)) {
        keyInput.value = e.key.toUpperCase();
        setHint('');
        updatePreview();
        if (keyIsValid()) setHint(`${keyInput.value} is free.`, 'success');
      }
    });

    const submit = async () => {
      if (!source || !keyIsValid()) return;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Adding…';
      try {
        const hotkey = keyInput.value.trim().toUpperCase();
        const name = nameInput.value.trim() || source.name || 'Custom meme';
        const newMeme: MemeItem = {
          id: `meme_${Date.now()}`,
          name,
          emoji: '',
          assetUrl: source.url,
          hotkey,
          durationMs: this.settings.defaultDurationMs || 2500
        };
        await this.callbacks.onAddMeme?.(newMeme);
        this.closeModal();
        this.showToast(`Added "${name}" — press ${hotkey} to fire it`);
      } catch (err: any) {
        setHint(err?.message || 'Could not save this meme.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add to deck';
      }
    };

    submitBtn.addEventListener('click', submit);
    closeBtn.addEventListener('click', () => this.closeModal());
    cancelBtn.addEventListener('click', () => this.closeModal());
    backdrop.addEventListener('mousedown', (e) => {
      if (e.target === backdrop) this.closeModal();
    });

    // Keep the call's own shortcuts from firing while typing here
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeModal();
      } else if (e.key === 'Enter' && !submitBtn.disabled && (e.target as HTMLElement)?.tagName !== 'BUTTON') {
        e.preventDefault();
        submit();
      }
      e.stopPropagation();
    };
    modal.addEventListener('keydown', onKeyDown);
    const stop = (e: Event) => e.stopPropagation();
    modal.addEventListener('keyup', stop);
    modal.addEventListener('keypress', stop);

    this.root.appendChild(backdrop);
    this.currentModal = backdrop;
    this.modalCleanup = () => {
      if (resolveTimer) clearTimeout(resolveTimer);
      resolveToken++;
    };

    if (prefill.file) {
      useFile(prefill.file);
    } else if (prefill.url) {
      urlInput.value = prefill.url;
      useUrl(prefill.url);
    }
    urlInput.focus();
  }

  private closeModal() {
    this.modalCleanup?.();
    this.modalCleanup = null;
    this.currentModal?.remove();
    this.currentModal = null;
  }

  private playTriggerSound() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.audioCtx = this.audioCtx || new AudioContextClass();
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(960, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch (_) {}
  }

  private getPositionClass(position: MemeOverlayPosition): string {
    switch (position) {
      case 'center':
        return 'pos-center';
      case 'top-right':
        return 'pos-top-right';
      case 'bottom-right':
        return 'pos-bottom-right';
      case 'top-center':
      default:
        return 'pos-top-center';
    }
  }

  private initRoot() {
    if (!document.getElementById('memecord-injected-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'memecord-injected-styles';
      styleEl.textContent = OVERLAY_CSS;
      (document.head || document.documentElement).appendChild(styleEl);
    }

    let existing = document.getElementById('memecord-overlay-root');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'memecord-overlay-root';
      (document.body || document.documentElement).appendChild(existing);
    }
    this.root = existing;
  }

  public destroy() {
    if (this.hideTimeoutId) clearTimeout(this.hideTimeoutId);
    if (this.removeTimeoutId) clearTimeout(this.removeTimeoutId);
    if (this.toastTimeoutId) clearTimeout(this.toastTimeoutId);

    this.floatingDock?.destroy();
    this.floatingDock = null;
    this.closeModal();
    this.audioCtx?.close().catch(() => {});
    this.audioCtx = null;

    this.root?.remove();
    this.root = null;
  }
}
