import { GestureDetector } from '../gesture/detector';
import { MemeOverlayManager } from '../overlay/meme-overlay';
import { getSettings } from '../shared/storage';
import { AppSettings, ExtensionMessage, GestureType } from '../shared/types';
import { KEYBOARD_GESTURE_MAP } from '../shared/config';
import '../overlay/overlay.css';

export class MeetController {
  private detector: GestureDetector | null = null;
  private overlay: MemeOverlayManager | null = null;
  private settings: AppSettings | null = null;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private isDestroyed: boolean = false;
  private spaObserver: MutationObserver | null = null;
  private lastUrl: string = '';
  private isInCall: boolean = false;
  private callCheckIntervalId: any = null;

  constructor() {
    this.lastUrl = window.location.href;
  }

  public async init() {
    this.settings = await getSettings();

    // 1. Initialize Overlay Manager with Floating Dock
    this.overlay = new MemeOverlayManager(this.settings.memes, this.settings.debugMode, {
      onTriggerMeme: (gesture) => {
        if (this.detector) {
          this.detector.getStateMachine().triggerManual(gesture);
        }
        this.overlay?.showMeme(gesture);
      },
      onRetryCamera: () => {
        this.startDetector();
      }
    });

    // Start with HUD/dock hidden until user is confirmed inside a video call
    this.overlay.setInCall(false);

    // 2. Initialize Gesture Detector
    this.detector = new GestureDetector(this.settings, {
      onGestureTriggered: (gesture, confidence) => {
        console.log(`[MemeMeet] Gesture triggered: ${gesture} (conf: ${confidence.toFixed(2)})`);
        this.overlay?.showMeme(gesture);
      },
      onDetectionUpdate: (detection, diagnostics) => {
        if (this.detector && this.overlay) {
          const status = this.detector.getStateMachine().getStatus();
          this.overlay.updateDebugHUD(status, diagnostics);
          if (diagnostics?.handsCount && diagnostics.handsCount > 0) {
            this.overlay.setDockStatus('active', `Tracking ${diagnostics.handsCount} hand(s) - Gesture: ${detection.gesture}`);
          }
        }
      }
    });

    // 3. Register Keyboard Shortcuts (1-8)
    this.registerKeyboardShortcuts();

    // 4. Setup Storage and Message Listeners
    this.setupListeners();

    // 5. Setup auto-retry on user interaction
    this.setupAutoRetry();

    // 6. Monitor SPA navigation in Google Meet
    this.setupSpaMonitoring();

    // 7. Periodically check if user has joined/left active video call
    this.callCheckIntervalId = setInterval(() => {
      this.checkCallState();
    }, 1000);

    // Check immediately
    this.checkCallState();

    console.log('[MemeMeet] Controller initialized on Google Meet');
  }

  private isInVideoCall(): boolean {
    const path = window.location.pathname;

    // 1. Must be on a meeting URL (e.g. /abc-defg-hij or /_meet/...)
    const isMeetingUrl =
      /^\/[a-z]{3}-[a-z]{4}-[a-z]{3}/i.test(path) ||
      path.startsWith('/_meet/') ||
      path.includes('/new');

    if (!isMeetingUrl) {
      return false;
    }

    // 2. If "Join now" or "Ask to join" button exists, user is still in the lobby/green room
    const joinButton = document.querySelector(
      'button[aria-label*="Join now" i], button[aria-label*="Ask to join" i]'
    );
    if (joinButton) {
      return false;
    }

    // 3. Check for "Leave call" button (present only inside active meetings)
    const leaveButton = document.querySelector(
      'button[aria-label*="Leave call" i], button[aria-label*="Leave meeting" i], button[data-tooltip*="Leave call" i], button[aria-label*="End call" i]'
    );
    if (leaveButton) {
      return true;
    }

    // 4. Check for in-call bottom controls (microphone, camera, raise hand, reaction)
    const inCallControls = document.querySelector(
      'button[aria-label*="Turn off microphone" i], button[aria-label*="Turn on microphone" i], button[aria-label*="Raise hand" i], button[aria-label*="Send a reaction" i]'
    );
    return Boolean(inCallControls);
  }

  private checkCallState() {
    const inCall = this.isInVideoCall();

    if (inCall && !this.isInCall) {
      this.isInCall = true;
      console.log('[MemeMeet] Entered active video call -> showing HUD and starting detector');
      this.overlay?.setInCall(true);
      this.overlay?.showToast('MemeMeet Active! Gestures ready or press 1–8');

      if (this.settings?.enabled) {
        this.startDetector();
      }
    } else if (!inCall && this.isInCall) {
      this.isInCall = false;
      console.log('[MemeMeet] Exited video call -> hiding HUD and stopping detector');
      this.overlay?.setInCall(false);
      this.stopDetector();
    }
  }

  private async startDetector() {
    if (!this.detector || !this.settings?.enabled || !this.isInCall) return;
    this.overlay?.setDockStatus('pending', 'Connecting camera / gestures...');
    try {
      const ok = await this.detector.start();
      if (ok) {
        this.overlay?.setDockStatus('active', 'Gestures & Camera active');
      } else {
        const error = this.detector.getCameraStatus().error || 'Camera busy';
        this.overlay?.setDockStatus('error', `${error} — Hotkeys 1-8 active`);
        if (this.detector && this.overlay) {
          this.overlay.updateDebugHUD(this.detector.getStateMachine().getStatus(), {
            cameraText: `ERR: ${error.toUpperCase()}`
          });
        }
      }
    } catch (err: any) {
      console.warn('[MemeMeet] Failed to start detector:', err);
      const errMsg = err?.message || 'Camera error';
      this.overlay?.setDockStatus('error', `${errMsg} — Hotkeys 1-8 active`);
      if (this.detector && this.overlay) {
        this.overlay.updateDebugHUD(this.detector.getStateMachine().getStatus(), {
          cameraText: `ERR: ${errMsg.toUpperCase()}`
        });
      }
    }
  }

  private stopDetector() {
    if (this.detector) {
      this.detector.stop();
      this.overlay?.setDockStatus('error', 'Detector stopped');
    }
  }

  private setupAutoRetry() {
    const retryOnce = () => {
      if (this.settings?.enabled && this.isInCall && !this.detector?.getCameraStatus().active) {
        console.log('[MemeMeet] User interaction detected inside call, retrying gesture detector');
        this.startDetector();
      }
    };
    window.addEventListener('click', retryOnce, { once: true });
    window.addEventListener('focus', retryOnce, { once: true });
  }

  private registerKeyboardShortcuts() {
    this.keydownHandler = (e: KeyboardEvent) => {
      // Only process hotkeys when inside an active video call
      if (!this.isInCall) return;

      // Do not intercept if user is typing in chat, inputs, or contentEditables
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

      const key = e.key;
      const gesture = KEYBOARD_GESTURE_MAP[key];
      if (gesture && this.settings) {
        e.preventDefault();
        console.log(`[MemeMeet] Manual hotkey triggered: ${gesture}`);

        // Trigger via state machine or direct overlay
        if (this.detector) {
          this.detector.getStateMachine().triggerManual(gesture);
        }
        this.overlay?.showMeme(gesture);
      }
    };

    window.addEventListener('keydown', this.keydownHandler, true);
  }

  private setupListeners() {
    // Listen for storage updates (e.g. from Popup UI)
    if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes.mememeet_settings) {
          const newSettings = changes.mememeet_settings.newValue as AppSettings;
          if (newSettings) {
            this.handleSettingsChange(newSettings);
          }
        }
      });
    }

    // Listen for runtime messages (e.g. direct triggers from popup or background)
    if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener(
        (message: ExtensionMessage, _sender, sendResponse: (response?: any) => void) => {
          if (message.type === 'TRIGGER_MANUAL_MEME') {
            const gesture = message.gesture as Exclude<GestureType, 'none'>;
            if (this.detector) {
              this.detector.getStateMachine().triggerManual(gesture);
            }
            this.overlay?.showMeme(gesture);
            sendResponse({ success: true });
            return true;
          }

          if (message.type === 'GET_CAMERA_STATUS') {
            const status = this.detector?.getCameraStatus() || { active: false, permissionGranted: false };
            sendResponse({ status });
            return true;
          }

          return false;
        }
      );
    }
  }

  private handleSettingsChange(newSettings: AppSettings) {
    const wasEnabled = this.settings?.enabled;
    this.settings = newSettings;

    // Update overlay config
    this.overlay?.updateConfig(newSettings.memes, newSettings.debugMode);

    // Update detector settings
    if (this.detector) {
      this.detector.updateSettings(newSettings);

      if (!wasEnabled && newSettings.enabled && this.isInCall) {
        this.startDetector();
      } else if (wasEnabled && !newSettings.enabled) {
        this.stopDetector();
      }
    }
  }

  private setupSpaMonitoring() {
    // Check URL changes periodically and on DOM mutations
    this.spaObserver = new MutationObserver(() => {
      if (window.location.href !== this.lastUrl) {
        this.lastUrl = window.location.href;
        this.handleSpaNavigation();
      }
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

  private handleSpaNavigation() {
    console.log('[MemeMeet] Detected SPA navigation to:', this.lastUrl);
    // Ensure overlay root still exists in DOM
    if (this.overlay) {
      const root = document.getElementById('mememeet-overlay-root');
      if (!root) {
        this.overlay = new MemeOverlayManager(this.settings!.memes, this.settings!.debugMode, {
          onTriggerMeme: (gesture) => {
            this.overlay?.showMeme(gesture);
          },
          onRetryCamera: () => {
            this.startDetector();
          }
        });
        this.overlay.setInCall(this.isInCall);
      }
    }

    this.checkCallState();
  }

  public destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (this.callCheckIntervalId) {
      clearInterval(this.callCheckIntervalId);
      this.callCheckIntervalId = null;
    }

    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler, true);
      this.keydownHandler = null;
    }

    if (this.spaObserver) {
      this.spaObserver.disconnect();
      this.spaObserver = null;
    }

    this.stopDetector();
    this.detector = null;

    if (this.overlay) {
      this.overlay.destroy();
      this.overlay = null;
    }
  }
}
