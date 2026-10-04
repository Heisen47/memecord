import { AppSettings, MemeItem, MemeOverlayPosition } from '../shared/types';
import { FloatingDock } from './floating-dock';
import { OVERLAY_CSS } from './overlay-styles';
import { resolveMediaUrl, fetchAsDataUrl, assignDefaultHotkey } from '../shared/media-resolver';
import { saveSettings, updateMemeHotkey } from '../shared/storage';

export interface MemeOverlayCallbacks {
  onTriggerMeme?: (meme: MemeItem) => void;
  onAddMeme?: (meme: MemeItem) => void;
  onDeleteMeme?: (memeId: string) => void;
  onUpdateHotkey?: (memeId: string, newHotkey: string) => void;
  onCloseDock?: () => void;
}

export class MemeOverlayManager {
  private root: HTMLElement | null = null;
  private currentMemeBox: HTMLElement | null = null;
  private currentToast: HTMLElement | null = null;
  private currentModal: HTMLElement | null = null;
  private hideTimeoutId: any = null;
  private removeTimeoutId: any = null;
  private toastTimeoutId: any = null;
  private floatingDock: FloatingDock | null = null;
  private settings: AppSettings;
  private callbacks: MemeOverlayCallbacks;

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
            this.callbacks.onTriggerMeme?.(meme);
            this.showMeme(meme);
          },
          onAddMeme: () => {
            this.openQuickAddModal();
          },
          onDeleteMeme: (memeId) => {
            const meme = this.settings.memes.find((m) => m.id === memeId);
            this.callbacks.onDeleteMeme?.(memeId);
            this.showToast(`🗑️ Removed "${meme?.name || 'Meme'}" from deck`);
          },
          onUpdateHotkey: async (memeId, newHotkey) => {
            const meme = this.settings.memes.find((m) => m.id === memeId);
            const updated = await updateMemeHotkey(memeId, newHotkey);
            this.settings = updated;
            this.updateSettings(updated);
            this.callbacks.onUpdateHotkey?.(memeId, newHotkey);
            this.showToast(`⌨️ Rebound "${meme?.name || 'Meme'}" to Key [${newHotkey}]`);
          },
          onCloseDock: () => {
            this.callbacks.onCloseDock?.();
            this.showToast('🎭 Deck Minimized • Press Alt+M or click pebble to reopen');
          },
          onPositionChange: (pos) => {
            this.settings.position = pos;
            saveSettings({ position: pos });
            this.showToast(`Overlay position: ${pos}`);
          }
        },
        this.settings.position
      );

      this.floatingDock.setVisible(this.settings.dockVisible && this.settings.enabled);
    }
  }

  public updateSettings(settings: AppSettings) {
    this.settings = settings;
    this.floatingDock?.updateMemes(settings.memes);
    this.floatingDock?.setPosition(settings.position);
    this.floatingDock?.setVisible(settings.dockVisible && settings.enabled);
  }

  public setDockVisible(visible: boolean) {
    this.floatingDock?.setVisible(visible);
  }

  public setDockMinimized(minimized: boolean) {
    this.floatingDock?.setMinimized(minimized);
  }

  public showToast(message: string, durationMs: number = 2500) {
    if (!this.root) return;

    if (this.currentToast) {
      this.currentToast.remove();
      this.currentToast = null;
    }
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
      this.toastTimeoutId = null;
    }

    const toast = document.createElement('div');
    toast.className = 'memecord-toast';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    this.root.appendChild(toast);
    this.currentToast = toast;

    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    this.toastTimeoutId = setTimeout(() => {
      toast.classList.remove('visible');
      toast.classList.add('hiding');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
        if (this.currentToast === toast) this.currentToast = null;
      }, 300);
    }, durationMs);
  }

  public showMeme(meme: MemeItem) {
    if (!this.root || !this.settings.enabled) return;

    if (this.settings.soundEnabled) {
      this.playTriggerSound();
    }

    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
    if (this.removeTimeoutId) {
      clearTimeout(this.removeTimeoutId);
      this.removeTimeoutId = null;
    }

    if (this.currentMemeBox) {
      this.currentMemeBox.remove();
      this.currentMemeBox = null;
    }

    // Resolve asset URL (local extension web-accessible vs remote URL)
    let assetUrl = meme.assetUrl;
    if (assetUrl.startsWith('http://') || assetUrl.startsWith('https://') || assetUrl.startsWith('data:')) {
      assetUrl = meme.assetUrl;
    } else if (typeof chrome !== 'undefined' && chrome.runtime?.id && chrome.runtime?.getURL) {
      try {
        assetUrl = chrome.runtime.getURL(meme.assetUrl.replace(/^\//, ''));
      } catch (err) {
        assetUrl = meme.assetUrl.startsWith('/') ? meme.assetUrl : `/${meme.assetUrl}`;
      }
    } else {
      assetUrl = meme.assetUrl.startsWith('/') ? meme.assetUrl : `/${meme.assetUrl}`;
    }

    const positionClass = this.getPositionClass(this.settings.position || 'top-center');
    const box = document.createElement('div');
    box.className = `memecord-meme-box ${positionClass}`;

    const isVideo = assetUrl.startsWith('data:video/') || assetUrl.endsWith('.mp4') || assetUrl.endsWith('.webm');

    let mediaEl: HTMLElement;
    if (isVideo) {
      const video = document.createElement('video');
      video.className = 'memecord-meme-image';
      video.src = assetUrl;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      (video as any).playsInline = true;
      mediaEl = video;
    } else {
      const img = document.createElement('img');
      img.className = 'memecord-meme-image';
      (img as any).referrerPolicy = 'no-referrer';
      img.src = assetUrl;
      img.alt = meme.name;

      // CSP or CORS fallback: If external image fails to load in page DOM, fetch via background proxy
      img.onerror = async () => {
        if (assetUrl.startsWith('http') && !assetUrl.startsWith('data:')) {
          console.warn(`[Memecord] Direct image blocked by page CSP, converting via background proxy...`);
          const dataUrl = await fetchAsDataUrl(assetUrl);
          if (dataUrl && dataUrl.startsWith('data:')) {
            img.src = dataUrl;
          }
        }
      };
      mediaEl = img;
    }

    const title = document.createElement('div');
    title.className = 'memecord-meme-title';
    title.textContent = `${meme.emoji || '✨'} ${meme.name}`;

    box.appendChild(mediaEl);
    box.appendChild(title);
    this.root.appendChild(box);
    this.currentMemeBox = box;

    requestAnimationFrame(() => {
      box.classList.add('visible');
    });

    const duration = meme.durationMs || this.settings.defaultDurationMs || 2500;

    this.hideTimeoutId = setTimeout(() => {
      box.classList.remove('visible');
      box.classList.add('hiding');

      this.removeTimeoutId = setTimeout(() => {
        if (box.parentElement) {
          box.remove();
        }
        if (this.currentMemeBox === box) {
          this.currentMemeBox = null;
        }
      }, 300);
    }, duration);
  }

  public openQuickAddModal() {
    if (!this.root) return;

    if (this.currentModal) {
      this.currentModal.remove();
      this.currentModal = null;
    }

    const nextKey = assignDefaultHotkey(this.settings.memes.length);

    const modal = document.createElement('div');
    modal.className = 'memecord-quick-add-modal';
    modal.innerHTML = `
      <div class="memecord-modal-title">
        <span>➕ Add Meme to Dock</span>
        <button class="memecord-modal-close" id="memecord-modal-close-btn">&times;</button>
      </div>

      <div>
        <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 5px;">
          GIF / Image / Tenor / Giphy URL
        </label>
        <input type="url" class="memecord-input-field" id="memecord-add-url" placeholder="Paste Tenor, Giphy, or any GIF link..." autofocus />
        <span id="memecord-url-status" style="font-size: 10px; color: #818cf8; margin-top: 3px; display: block;"></span>
      </div>

      <div style="display: flex; gap: 8px;">
        <div style="flex: 1;">
          <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 5px;">Meme Name</label>
          <input type="text" class="memecord-input-field" id="memecord-add-name" placeholder="e.g. Happy Cat" />
        </div>
        <div style="width: 65px;">
          <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 5px;">Emoji</label>
          <input type="text" class="memecord-input-field" id="memecord-add-emoji" value="✨" maxlength="3" style="text-align: center;" />
        </div>
        <div style="width: 55px;">
          <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 5px;">Key</label>
          <input type="text" class="memecord-input-field" id="memecord-add-key" value="${nextKey}" maxlength="2" style="text-align: center;" />
        </div>
      </div>

      <!-- Live Preview -->
      <div class="memecord-preview-wrap" id="memecord-preview-wrap" style="display: none;">
        <img class="memecord-preview-thumb" id="memecord-preview-thumb" src="" alt="preview" />
        <div style="flex: 1; overflow: hidden;">
          <div id="memecord-preview-name" style="font-weight: 700; font-size: 12px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">Preview</div>
          <div style="font-size: 10px; color: #94a3b8;">Ready to bind to key [${nextKey}]</div>
        </div>
      </div>

      <div class="memecord-modal-btn-row">
        <button class="memecord-btn-secondary" id="memecord-add-cancel">Cancel</button>
        <button class="memecord-btn-primary" id="memecord-add-submit">Add to Dock</button>
      </div>
    `;

    this.root.appendChild(modal);
    this.currentModal = modal;

    const close = () => {
      if (this.currentModal) {
        this.currentModal.remove();
        this.currentModal = null;
      }
    };

    modal.querySelector('#memecord-modal-close-btn')?.addEventListener('click', close);
    modal.querySelector('#memecord-add-cancel')?.addEventListener('click', close);

    const urlInput = modal.querySelector('#memecord-add-url') as HTMLInputElement;
    const nameInput = modal.querySelector('#memecord-add-name') as HTMLInputElement;
    const emojiInput = modal.querySelector('#memecord-add-emoji') as HTMLInputElement;
    const keyInput = modal.querySelector('#memecord-add-key') as HTMLInputElement;
    const statusSpan = modal.querySelector('#memecord-url-status') as HTMLSpanElement;
    const previewWrap = modal.querySelector('#memecord-preview-wrap') as HTMLElement;
    const previewThumb = modal.querySelector('#memecord-preview-thumb') as HTMLImageElement;
    const previewName = modal.querySelector('#memecord-preview-name') as HTMLElement;

    // Auto resolve Tenor / Giphy on input or paste
    let resolveTimeout: any = null;
    let resolvedUrl: string = '';

    const handleUrlChange = () => {
      const raw = urlInput.value.trim();
      if (!raw) {
        previewWrap.style.display = 'none';
        statusSpan.textContent = '';
        return;
      }

      statusSpan.textContent = 'Resolving media link...';

      if (resolveTimeout) clearTimeout(resolveTimeout);
      resolveTimeout = setTimeout(async () => {
        try {
          const res = await resolveMediaUrl(raw);
          resolvedUrl = res.url;

          if (res.name && !nameInput.value) {
            nameInput.value = res.name;
          }
          if (res.emoji && emojiInput.value === '✨') {
            emojiInput.value = res.emoji;
          }

          statusSpan.textContent = '✓ Ready to add';
          statusSpan.style.color = '#10b981';

          previewThumb.src = resolvedUrl;
          previewName.textContent = `${emojiInput.value} ${nameInput.value || 'Meme'}`;
          previewWrap.style.display = 'flex';
        } catch (err: any) {
          statusSpan.textContent = err?.message || 'Invalid URL';
          statusSpan.style.color = '#ef4444';
        }
      }, 250);
    };

    urlInput.addEventListener('input', handleUrlChange);
    urlInput.addEventListener('paste', () => setTimeout(handleUrlChange, 10));

    modal.querySelector('#memecord-add-submit')?.addEventListener('click', async () => {
      const rawUrl = urlInput.value.trim();
      if (!rawUrl) {
        urlInput.focus();
        urlInput.style.borderColor = '#ef4444';
        return;
      }

      const submitBtn = modal.querySelector('#memecord-add-submit') as HTMLButtonElement;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      try {
        // Resolve media
        const resolved = await resolveMediaUrl(rawUrl);
        // Store clean resolved URL (or data URL if local upload).
        // Compositor & overlay convert to base64 on-the-fly at trigger time.
        const assetUrl = resolved.url;

        const name = nameInput.value.trim() || resolved.name || 'Custom Meme';
        const emoji = emojiInput.value.trim() || '✨';
        const hotkey = keyInput.value.trim() || nextKey;

        const newMeme: MemeItem = {
          id: `meme_${Date.now()}`,
          name,
          emoji,
          assetUrl,
          hotkey,
          durationMs: this.settings.defaultDurationMs || 2500
        };

        close();
        this.callbacks.onAddMeme?.(newMeme);
        this.showToast(`Added "${name}" [Key ${hotkey}]!`);
      } catch (err: any) {
        statusSpan.textContent = `Error: ${err?.message || 'Failed to save'}`;
        statusSpan.style.color = '#ef4444';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add to Dock';
      }
    });
  }

  private playTriggerSound() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
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

    if (this.floatingDock) {
      this.floatingDock.destroy();
      this.floatingDock = null;
    }

    if (this.currentModal) {
      this.currentModal.remove();
      this.currentModal = null;
    }

    if (this.root && this.root.parentElement) {
      this.root.parentElement.removeChild(this.root);
      this.root = null;
    }
  }
}
