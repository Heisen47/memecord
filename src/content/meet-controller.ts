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

  constructor() {
    this.lastUrl = window.location.href;
  }

  public async init() {
    this.settings = await getSettings();

    // 1. Initialize Overlay Manager
    this.overlay = new MemeOverlayManager(this.settings.memes, this.settings.debugMode);

    // 2. Initialize Gesture Detector
    this.detector = new GestureDetector(this.settings, {
      onGestureTriggered: (gesture, confidence) => {
        console.log(`[MemeMeet] Gesture triggered: ${gesture} (conf: ${confidence.toFixed(2)})`);
        this.overlay?.showMeme(gesture);
      },
      onDetectionUpdate: () => {
        if (this.detector && this.overlay) {
          const status = this.detector.getStateMachine().getStatus();
          this.overlay.updateDebugHUD(status);
        }
      }
    });

    // 3. Start detector if enabled
    if (this.settings.enabled) {
      this.startDetector();
    }

    // 4. Register Keyboard Shortcuts (1, 2, 3)
    this.registerKeyboardShortcuts();

    // 5. Setup Storage and Message Listeners
    this.setupListeners();

    // 6. Monitor SPA navigation
    this.setupSpaMonitoring();

    console.log('[MemeMeet] Controller initialized on Google Meet');
  }

  private async startDetector() {
    if (!this.detector || !this.settings?.enabled) return;
    try {
      await this.detector.start();
    } catch (err) {
      console.warn('[MemeMeet] Failed to start detector:', err);
    }
  }

  private stopDetector() {
    if (this.detector) {
      this.detector.stop();
    }
  }

  private registerKeyboardShortcuts() {
    this.keydownHandler = (e: KeyboardEvent) => {
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

      if (!wasEnabled && newSettings.enabled) {
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
    });

    this.spaObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private handleSpaNavigation() {
    console.log('[MemeMeet] Detected SPA navigation to:', this.lastUrl);
    // Ensure overlay root still exists in DOM
    if (this.overlay) {
      const root = document.getElementById('mememeet-overlay-root');
      if (!root) {
        this.overlay = new MemeOverlayManager(this.settings!.memes, this.settings!.debugMode);
      }
    }

    // If active and inside a meeting, make sure detector is running
    if (this.settings?.enabled && !this.detector?.getCameraStatus().active) {
      this.startDetector();
    }
  }

  public destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

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
