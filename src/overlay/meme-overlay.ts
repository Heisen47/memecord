import { GestureType, MemeMapping, StateMachineStatus } from '../shared/types';
import { DebugHUD } from './debug-hud';
import { FloatingDock } from './floating-dock';
import { OVERLAY_CSS } from './overlay-styles';

export class MemeOverlayManager {
  private root: HTMLElement | null = null;
  private currentMemeBox: HTMLElement | null = null;
  private currentToast: HTMLElement | null = null;
  private hideTimeoutId: any = null;
  private removeTimeoutId: any = null;
  private toastTimeoutId: any = null;
  private debugHud: DebugHUD | null = null;
  private floatingDock: FloatingDock | null = null;
  private memeConfig: MemeMapping;
  private isDebugMode: boolean = false;
  private onTriggerCallback?: (gesture: Exclude<GestureType, 'none'>) => void;
  private onRetryCameraCallback?: () => void;

  constructor(
    memeConfig: MemeMapping,
    debugMode: boolean = false,
    options?: {
      onTriggerMeme?: (gesture: Exclude<GestureType, 'none'>) => void;
      onRetryCamera?: () => void;
    }
  ) {
    this.memeConfig = memeConfig;
    this.isDebugMode = debugMode;
    this.onTriggerCallback = options?.onTriggerMeme;
    this.onRetryCameraCallback = options?.onRetryCamera;

    this.initRoot();

    if (this.root) {
      this.debugHud = new DebugHUD(this.root);
      this.debugHud.setVisible(debugMode);

      this.floatingDock = new FloatingDock(this.root, {
        onTriggerMeme: (gesture) => {
          if (this.onTriggerCallback) {
            this.onTriggerCallback(gesture);
          } else {
            this.showMeme(gesture);
          }
        },
        onToggleHUD: () => {
          this.isDebugMode = !this.isDebugMode;
          this.debugHud?.setVisible(this.isDebugMode);
          this.floatingDock?.setHUDActive(this.isDebugMode);
        },
        onRetryCamera: () => {
          this.onRetryCameraCallback?.();
        }
      });
      this.floatingDock.setHUDActive(debugMode);
    }
  }

  public updateConfig(memeConfig: MemeMapping, debugMode: boolean) {
    this.memeConfig = memeConfig;
    this.isDebugMode = debugMode;
    if (this.debugHud) {
      this.debugHud.setVisible(debugMode);
    }
    if (this.floatingDock) {
      this.floatingDock.setHUDActive(debugMode);
    }
  }

  public setDockStatus(status: 'active' | 'pending' | 'error', text?: string) {
    this.floatingDock?.setStatus(status, text);
  }

  public setInCall(inCall: boolean) {
    this.floatingDock?.setVisible(inCall);
    if (!inCall) {
      this.debugHud?.setVisible(false);
      if (this.currentToast) {
        this.currentToast.remove();
        this.currentToast = null;
      }
    } else if (this.isDebugMode) {
      this.debugHud?.setVisible(true);
    }
  }

  public updateDebugHUD(status: StateMachineStatus, diagnostics?: { cameraText?: string; handsCount?: number; fps?: number }) {
    if (this.debugHud) {
      this.debugHud.update(status, diagnostics);
    }
  }

  public showToast(message: string, durationMs: number = 3500) {
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
    toast.className = 'mememeet-toast';
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
        if (toast.parentElement) {
          toast.remove();
        }
        if (this.currentToast === toast) {
          this.currentToast = null;
        }
      }, 400);
    }, durationMs);
  }

  public showMeme(gesture: Exclude<GestureType, 'none'>) {
    const config = this.memeConfig[gesture];
    if (!config || !this.root) {
      console.warn(`[MemeMeet] No meme configuration found for gesture: ${gesture}`);
      return;
    }

    // Cancel any pending hide animations
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
    if (this.removeTimeoutId) {
      clearTimeout(this.removeTimeoutId);
      this.removeTimeoutId = null;
    }

    // Remove existing meme if currently visible
    if (this.currentMemeBox) {
      this.currentMemeBox.remove();
      this.currentMemeBox = null;
    }

    // Resolve URL for asset
    let assetUrl = config.asset;
    if (config.asset.startsWith('http://') || config.asset.startsWith('https://') || config.asset.startsWith('data:')) {
      assetUrl = config.asset;
    } else if (typeof chrome !== 'undefined' && chrome.runtime?.id && chrome.runtime?.getURL) {
      try {
        assetUrl = chrome.runtime.getURL(config.asset.replace(/^\//, ''));
      } catch (err) {
        console.warn('[MemeMeet] chrome.runtime.getURL failed, fallback to root path:', err);
        assetUrl = config.asset.startsWith('/') ? config.asset : `/${config.asset}`;
      }
    } else {
      assetUrl = config.asset.startsWith('/') ? config.asset : `/${config.asset}`;
    }

    const box = document.createElement('div');
    box.className = 'mememeet-meme-box';

    const img = document.createElement('img');
    img.className = 'mememeet-meme-image';
    img.src = assetUrl;
    img.alt = config.title || gesture;
    img.onerror = () => {
      console.error(`[MemeMeet] Failed to load meme asset: ${assetUrl}`);
    };

    const title = document.createElement('div');
    title.className = 'mememeet-meme-title';
    title.textContent = `${config.emoji || '✨'} ${config.title || gesture.replace('_', ' ').toUpperCase()}`;

    box.appendChild(img);
    box.appendChild(title);
    this.root.appendChild(box);
    this.currentMemeBox = box;

    // Trigger appearance on next frame for smooth animation
    requestAnimationFrame(() => {
      box.classList.add('visible');
    });

    const duration = config.duration || 2000;

    // Schedule dismissal
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

  private initRoot() {
    // Inject styles directly into document if not present
    if (!document.getElementById('mememeet-injected-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'mememeet-injected-styles';
      styleEl.textContent = OVERLAY_CSS;
      (document.head || document.documentElement).appendChild(styleEl);
    }

    let existing = document.getElementById('mememeet-overlay-root');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'mememeet-overlay-root';
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

    if (this.debugHud) {
      this.debugHud.destroy();
      this.debugHud = null;
    }

    if (this.root && this.root.parentElement) {
      this.root.parentElement.removeChild(this.root);
      this.root = null;
    }
  }
}
