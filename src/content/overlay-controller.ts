import { MemeOverlayManager } from '../overlay/meme-overlay';
import { getSettings, saveSettings, addMeme, removeMeme } from '../shared/storage';
import { AppSettings, ExtensionMessage, MemeItem } from '../shared/types';
import { assignDefaultHotkey } from '../shared/media-resolver';
import '../overlay/overlay.css';

export class OverlayController {
  private overlay: MemeOverlayManager | null = null;
  private settings: AppSettings | null = null;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private isDestroyed: boolean = false;

  public async init() {
    this.settings = await getSettings();

    // 1. Ensure camera stream compositor script is in page
    this.ensureInjectedScript();

    // 2. Initialize Overlay Manager & Floating Dock
    this.overlay = new MemeOverlayManager(this.settings, {
      onTriggerMeme: (meme) => {
        this.triggerMeme(meme);
      },
      onAddMeme: async (newMeme) => {
        const updated = await addMeme(newMeme);
        this.settings = updated;
        this.overlay?.updateSettings(updated);
      },
      onDeleteMeme: async (memeId) => {
        const updated = await removeMeme(memeId);
        this.settings = updated;
        this.overlay?.updateSettings(updated);
      }
    });

    // 3. Register Keyboard Shortcuts (1-9, 0, Q, W, E...)
    this.registerKeyboardShortcuts();

    // 4. Setup Storage and Message Listeners
    this.setupListeners();

    // 5. Welcome indicator for meeting platforms
    this.showPlatformWelcome();

    console.log('[Memecord] Universal Overlay & Virtual Camera Controller initialized.');
  }

  public triggerMeme(meme: MemeItem) {
    if (!this.settings || !this.settings.enabled) return;

    // 1. Show local DOM overlay for immediate visual feedback
    this.overlay?.showMeme(meme);

    // 2. Broadcast to Virtual Camera Compositor so other callers see meme on camera stream
    let assetUrl = meme.assetUrl;
    if (!assetUrl.startsWith('http') && !assetUrl.startsWith('data:')) {
      if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
        assetUrl = chrome.runtime.getURL(assetUrl.replace(/^\//, ''));
      }
    }

    window.postMessage(
      {
        source: 'MEMECORD_CONTENT',
        type: 'TRIGGER_CAMERA_MEME',
        meme: {
          ...meme,
          assetUrl
        },
        position: this.settings.position || 'center'
      },
      '*'
    );
  }

  private ensureInjectedScript() {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('inject.js');
        script.onload = () => script.remove();
        (document.head || document.documentElement).appendChild(script);
      }
    } catch (_) {}
  }

  private showPlatformWelcome() {
    const host = window.location.hostname;
    let platform = '';
    if (host.includes('meet.google.com')) platform = 'Google Meet';
    else if (host.includes('discord.com')) platform = 'Discord';
    else if (host.includes('zoom.us')) platform = 'Zoom';
    else if (host.includes('teams.microsoft.com') || host.includes('teams.live.com')) platform = 'Microsoft Teams';
    else if (host.includes('slack.com')) platform = 'Slack';
    else if (host.includes('facetime.apple.com')) platform = 'FaceTime';

    if (platform && this.settings?.enabled) {
      setTimeout(() => {
        this.overlay?.showToast(`Memecord Camera active on ${platform}! Press 1–9 or click dock 🎭`);
      }, 1000);
    }
  }

  private registerKeyboardShortcuts() {
    this.keydownHandler = (e: KeyboardEvent) => {
      if (!this.settings || !this.settings.enabled) return;

      // Don't trigger if user is typing in chat / input / textarea
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.isContentEditable ||
          activeEl.getAttribute('role') === 'textbox')
      ) {
        return;
      }

      // Check Alt+M hotkey to toggle dock visibility
      if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        const next = !this.settings.dockVisible;
        saveSettings({ dockVisible: next });
        this.overlay?.setDockVisible(next);
        this.overlay?.showToast(next ? 'Dock visible' : 'Dock hidden');
        return;
      }

      // Check if pressed key matches any meme hotkey (e.g. "1", "2", "3", "0", "Q")
      const key = e.key;
      const targetMeme = this.settings.memes.find((m, idx) => {
        const expectedKey = m.hotkey || assignDefaultHotkey(idx);
        return expectedKey && expectedKey.toLowerCase() === key.toLowerCase();
      });

      if (targetMeme) {
        e.preventDefault();
        console.log(`[Memecord] Hotkey [${key}] triggered: ${targetMeme.name}`);
        this.triggerMeme(targetMeme);
      }
    };

    window.addEventListener('keydown', this.keydownHandler, true);
  }

  private setupListeners() {
    // Storage updates from popup
    if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes.mememeet_settings) {
          const newSettings = changes.mememeet_settings.newValue as AppSettings;
          if (newSettings) {
            this.settings = newSettings;
            this.overlay?.updateSettings(newSettings);

            window.postMessage(
              {
                source: 'MEMECORD_CONTENT',
                type: 'UPDATE_CAMERA_SETTINGS',
                position: newSettings.position || 'center'
              },
              '*'
            );
          }
        }
      });
    }

    // Direct runtime messages
    if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener(
        (message: ExtensionMessage, _sender, sendResponse: (res?: any) => void) => {
          if (message.type === 'TRIGGER_MEME') {
            const meme = this.settings?.memes.find((m) => m.id === message.memeId);
            if (meme) {
              this.triggerMeme(meme);
              sendResponse({ success: true });
            }
            return true;
          }

          if (message.type === 'TRIGGER_MEME_ITEM') {
            this.triggerMeme(message.meme);
            sendResponse({ success: true });
            return true;
          }

          if (message.type === 'TOGGLE_DOCK') {
            if (this.settings) {
              const next = !this.settings.dockVisible;
              saveSettings({ dockVisible: next });
              this.overlay?.setDockVisible(next);
              sendResponse({ dockVisible: next });
            }
            return true;
          }

          return false;
        }
      );
    }
  }

  public destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler, true);
      this.keydownHandler = null;
    }

    if (this.overlay) {
      this.overlay.destroy();
      this.overlay = null;
    }
  }
}
