import { MemeOverlayManager } from '../overlay/meme-overlay';
import { getSettings, saveSettings, addMeme, removeMeme } from '../shared/storage';
import { AppSettings, ExtensionMessage, MemeItem } from '../shared/types';
import { assignDefaultHotkey, fetchAsDataUrl } from '../shared/media-resolver';
import '../overlay/overlay.css';

export class OverlayController {
  private overlay: MemeOverlayManager | null = null;
  private settings: AppSettings | null = null;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private isDestroyed: boolean = false;
  private isInCall: boolean = false;
  private isCameraStreaming: boolean = false;
  private isAudioStreaming: boolean = false;
  private isWebRtcConnected: boolean = false;
  private callCheckIntervalId: any = null;
  private spaObserver: MutationObserver | null = null;

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
      },
      onUpdateHotkey: (memeId, newHotkey) => {
        if (this.settings) {
          this.settings.memes = this.settings.memes.map((m) =>
            m.id === memeId ? { ...m, hotkey: newHotkey } : m
          );
        }
      },
      onCloseDock: () => {
        if (this.settings) {
          saveSettings({ dockVisible: false });
          this.settings.dockVisible = false;
        }
      }
    });

    // Start with dock hidden unless already in call or in test lab
    this.overlay.setDockVisible(false);

    // 3. Register Keyboard Shortcuts (1-9, 0, Q, W, E...)
    this.registerKeyboardShortcuts();

    // 4. Setup Storage and Message Listeners
    this.setupListeners();

    // 5. Monitor Call State (detects ongoing calls with or without camera)
    this.setupCallStateMonitoring();

    // Check immediately
    this.checkCallState();

    console.log('[Memecord] Call-sensitive Overlay Controller initialized (supports cam & no-cam calls).');
  }

  public async triggerMeme(meme: MemeItem) {
    if (!this.settings || !this.settings.enabled) return;

    // 1. Show local DOM overlay for immediate visual feedback
    this.overlay?.showMeme(meme);

    // 2. Convert to base64 Data URL to guarantee 0 CORS issues and 0 canvas tainting
    const dataUrl = await fetchAsDataUrl(meme.assetUrl);

    const message = {
      source: 'MEMECORD_CONTENT',
      type: 'TRIGGER_CAMERA_MEME',
      meme: {
        ...meme,
        assetUrl: dataUrl
      },
      position: this.settings.position || 'center'
    };

    // Broadcast to current window, child frames, and parent
    window.postMessage(message, '*');

    try {
      document.querySelectorAll('iframe').forEach((f) => {
        try {
          f.contentWindow?.postMessage(message, '*');
        } catch (_) {}
      });
    } catch (_) {}

    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage(message, '*');
      } catch (_) {}
    }
  }

  private isTestLab(): boolean {
    const href = window.location.href;
    const path = window.location.pathname;
    return (
      path.includes('/test/') ||
      href.includes('test/index.html') ||
      href.includes(':4182') ||
      href.includes('localhost:5173')
    );
  }

  private isOngoingCall(): boolean {
    // 1. Always active in test sandbox
    if (this.isTestLab()) {
      return true;
    }

    // 2. Active if webcam or microphone stream is running in page
    if (this.isCameraStreaming || this.isAudioStreaming) {
      return true;
    }

    // 3. Active if WebRTC peer connection is actively connected
    if (this.isWebRtcConnected) {
      return true;
    }

    const host = window.location.hostname;
    const path = window.location.pathname;

    // 4. Google Meet (detects calls even with camera turned off / mic muted)
    if (host.includes('meet.google.com')) {
      const isMeetingUrl = /^\/[a-z]{3}-[a-z]{4}-[a-z]{3}/i.test(path) || path.includes('/_meet/');
      if (!isMeetingUrl) return false;

      // In lobby/green room if join button exists
      const inLobby = Boolean(
        document.querySelector(
          'button[jsname="Qx7uuf"], button[aria-label*="Join" i], button[aria-label*="Ask to join" i], button[aria-label*="Unirse" i], button[aria-label*="Participer" i]'
        )
      );
      if (inLobby) return false;

      // Call ended screen
      const callEnded = Boolean(
        document.querySelector('div[data-call-ended="true"], button[aria-label*="Rejoin" i]')
      );
      if (callEnded) return false;

      // In call if leave button or call controls exist (language-independent jsname + multi-lingual aria labels)
      const hasMeetControls = Boolean(
        document.querySelector(
          'button[jsname="CQylAd"], button[jsname="B1qRre"], button[jsname="A17eec"], button[jsname="E90pfb"], ' +
          'button[aria-label*="Leave call" i], button[data-tooltip*="Leave call" i], button[aria-label*="End call" i], ' +
          'button[aria-label*="camera" i], button[aria-label*="cámara" i], button[aria-label*="kamera" i], ' +
          'button[aria-label*="microphone" i], button[aria-label*="micrófono" i], button[aria-label*="mikrofon" i], ' +
          'button[aria-label*="Raise hand" i], div[data-meeting-title], div[data-allocation-index], div[data-participant-id]'
        )
      );
      return hasMeetControls || !inLobby;
    }

    // 5. Discord Web (voice channels, voice calls, or video calls)
    if (host.includes('discord.com')) {
      const inVoiceOrCall = Boolean(
        document.querySelector(
          'div[class*="rtcConnectionStatus"], div[aria-label*="Voice Connected" i], ' +
          'div[class*="voiceUsers"], div[class*="connection_"], section[aria-label*="Voice" i], ' +
          'button[aria-label*="Disconnect" i], button[aria-label*="Leave Call" i], ' +
          'div[class*="videoGrid"], div[class*="callContainer"], div[class*="wrapperInCall"]'
        )
      );
      return inVoiceOrCall;
    }

    // 6. Zoom Web Client
    if (host.includes('zoom.us')) {
      if (!path.includes('/wc/') && !path.includes('/j/')) return false;
      const inCall = Boolean(
        document.querySelector(
          '#foot-bar, .footer-button-container, button[aria-label*="Leave" i], button[aria-label*="End" i], ' +
          'button[aria-label*="audio" i], button[aria-label*="mute" i], button[aria-label*="video" i], #meeting-app, .meeting-app'
        )
      );
      return inCall;
    }

    // 7. Microsoft Teams
    if (host.includes('teams.microsoft.com') || host.includes('teams.live.com')) {
      const inCall = Boolean(
        document.querySelector(
          'button#hangup-button, button[id*="hangup"], button[aria-label*="Leave" i], button[aria-label*="Hang up" i], ' +
          'div[data-tid="call-controls"], div[id*="calling-bar"], div[class*="calling-unified-bar"]'
        )
      );
      return inCall;
    }

    // 8. Slack Calls / Huddles
    if (host.includes('slack.com')) {
      const inCall = Boolean(
        document.querySelector(
          'button[data-qa*="leave" i], button[aria-label*="Leave call" i], div[data-qa*="huddle"], div[data-qa*="call_container"], div[class*="c-huddle"]'
        )
      );
      return inCall;
    }

    // 9. FaceTime Web
    if (host.includes('facetime.apple.com')) {
      const inCall = Boolean(
        document.querySelector(
          'button[aria-label*="Leave" i], button[aria-label*="End" i], button[aria-label*="Camera" i], button[aria-label*="Microphone" i]'
        )
      );
      return inCall;
    }

    // 10. WhatsApp Web
    if (host.includes('web.whatsapp.com')) {
      const inCall = Boolean(
        document.querySelector(
          'div[data-testid="call-container"], button[aria-label*="End call" i], div[data-testid*="call"]'
        )
      );
      return inCall;
    }

    // Not in an active call on any supported platform
    return false;
  }

  private checkCallState() {
    const inCall = this.isOngoingCall();

    if (inCall && !this.isInCall) {
      this.isInCall = true;
      console.log('[Memecord] Ongoing call detected (cam or no-cam) -> showing HUD & enabling hotkeys');
      if (this.settings?.dockVisible && this.settings.enabled) {
        this.overlay?.setDockVisible(true);
      }
      this.overlay?.showToast('🎭 Memecord Active! Press 1–9 or click dock');
    } else if (!inCall && this.isInCall) {
      this.isInCall = false;
      console.log('[Memecord] Call ended / outside call -> hiding HUD');
      this.overlay?.setDockVisible(false);
    }
  }

  private setupCallStateMonitoring() {
    // 1. Listen for stream and connection changes from inject.ts
    window.addEventListener('message', (event) => {
      if (event.data?.source === 'MEMECORD_CAMERA') {
        if (event.data.type === 'CALL_STREAM_STATE') {
          this.isCameraStreaming = Boolean(event.data.hasVideo);
          this.isAudioStreaming = Boolean(event.data.hasAudio);
          this.checkCallState();
        } else if (event.data.type === 'CAMERA_CALL_STATE') {
          this.isCameraStreaming = Boolean(event.data.active);
          this.checkCallState();
        } else if (event.data.type === 'WEBRTC_CALL_STATE') {
          this.isWebRtcConnected = Boolean(event.data.active);
          this.checkCallState();
        }
      }
    });

    // 2. Periodic poll check (1s)
    this.callCheckIntervalId = setInterval(() => {
      this.checkCallState();
    }, 1000);

    // 3. DOM mutation observer for SPA navigation & call UI updates
    this.spaObserver = new MutationObserver(() => {
      this.checkCallState();
    });

    const target = document.body || document.documentElement;
    if (target) {
      this.spaObserver.observe(target, {
        childList: true,
        subtree: true
      });
    }
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

  private registerKeyboardShortcuts() {
    this.keydownHandler = (e: KeyboardEvent) => {
      // ONLY trigger hotkeys when inside an active video call!
      if (!this.settings || !this.settings.enabled || !this.isInCall) return;

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
        this.settings.dockVisible = next;
        this.overlay?.setDockMinimized(!next);
        this.overlay?.setDockVisible(true);
        this.overlay?.showToast(next ? '🎭 Memecord HUD Expanded' : '🎭 Memecord HUD Minimized (Alt+M)');
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
        const change = changes.memecord_settings || changes.mememeet_settings;
        if (areaName === 'local' && change) {
          const newSettings = change.newValue as AppSettings;
          if (newSettings) {
            this.settings = newSettings;
            this.overlay?.updateSettings(newSettings);

            // Re-apply dock visibility scoped to in-call state
            this.overlay?.setDockVisible(this.isInCall && newSettings.dockVisible && newSettings.enabled);

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
              this.overlay?.setDockVisible(this.isInCall && next);
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

    if (this.callCheckIntervalId) {
      clearInterval(this.callCheckIntervalId);
      this.callCheckIntervalId = null;
    }

    if (this.spaObserver) {
      this.spaObserver.disconnect();
      this.spaObserver = null;
    }

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
