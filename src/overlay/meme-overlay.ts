import { GestureType, MemeMapping, StateMachineStatus } from '../shared/types';
import { DebugHUD } from './debug-hud';

export class MemeOverlayManager {
  private root: HTMLElement | null = null;
  private currentMemeBox: HTMLElement | null = null;
  private hideTimeoutId: any = null;
  private removeTimeoutId: any = null;
  private debugHud: DebugHUD | null = null;
  private memeConfig: MemeMapping;

  constructor(memeConfig: MemeMapping, debugMode: boolean = false) {
    this.memeConfig = memeConfig;
    this.initRoot();
    if (this.root) {
      this.debugHud = new DebugHUD(this.root);
      this.debugHud.setVisible(debugMode);
    }
  }

  public updateConfig(memeConfig: MemeMapping, debugMode: boolean) {
    this.memeConfig = memeConfig;
    if (this.debugHud) {
      this.debugHud.setVisible(debugMode);
    }
  }

  public updateDebugHUD(status: StateMachineStatus) {
    if (this.debugHud) {
      this.debugHud.update(status);
    }
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
    if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
      assetUrl = chrome.runtime.getURL(config.asset);
    }

    const box = document.createElement('div');
    box.className = 'mememeet-meme-box';

    const img = document.createElement('img');
    img.className = 'mememeet-meme-image';
    img.src = assetUrl;
    img.alt = config.title || gesture;

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
    let existing = document.getElementById('mememeet-overlay-root');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'mememeet-overlay-root';
      document.body.appendChild(existing);
    }
    this.root = existing;
  }

  public destroy() {
    if (this.hideTimeoutId) clearTimeout(this.hideTimeoutId);
    if (this.removeTimeoutId) clearTimeout(this.removeTimeoutId);

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
