import { GestureType } from '../shared/types';
import { GESTURE_DEFINITIONS } from '../shared/config';

export interface FloatingDockCallbacks {
  onTriggerMeme: (gesture: Exclude<GestureType, 'none'>) => void;
  onToggleHUD: () => void;
  onRetryCamera: () => void;
}

export class FloatingDock {
  private element: HTMLElement | null = null;
  private statusDot: HTMLElement | null = null;
  private hudBtn: HTMLElement | null = null;
  private isCollapsed: boolean = false;
  private callbacks: FloatingDockCallbacks;

  constructor(parent: HTMLElement, callbacks: FloatingDockCallbacks) {
    this.callbacks = callbacks;
    this.createDom(parent);
  }

  private createDom(parent: HTMLElement) {
    const dock = document.createElement('div');
    dock.className = 'mememeet-dock';

    // Badge / Title
    const badge = document.createElement('div');
    badge.className = 'mememeet-dock-badge';
    badge.title = 'Click to collapse/expand MemeMeet toolbar';

    const dot = document.createElement('span');
    dot.className = 'mememeet-status-dot active';
    this.statusDot = dot;

    const label = document.createElement('span');
    label.textContent = '🎭 MemeMeet';
    label.style.fontWeight = '700';

    badge.appendChild(dot);
    badge.appendChild(label);

    badge.addEventListener('click', () => {
      this.toggleCollapse();
    });

    dock.appendChild(badge);

    // Button Container
    const btnContainer = document.createElement('div');
    btnContainer.className = 'mememeet-dock-buttons';

    // 8 Quick Meme Buttons
    GESTURE_DEFINITIONS.forEach((def, index) => {
      const btn = document.createElement('button');
      btn.className = 'mememeet-dock-btn';
      btn.textContent = def.emoji;
      btn.title = `[${index + 1}] ${def.name}`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.callbacks.onTriggerMeme(def.key);
      });
      btnContainer.appendChild(btn);
    });

    // HUD toggle button
    const hudBtn = document.createElement('button');
    hudBtn.className = 'mememeet-dock-btn hud-btn';
    hudBtn.textContent = 'HUD';
    hudBtn.title = 'Toggle Gesture Debug HUD';
    hudBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.callbacks.onToggleHUD();
    });
    this.hudBtn = hudBtn;
    btnContainer.appendChild(hudBtn);

    dock.appendChild(btnContainer);
    parent.appendChild(dock);
    this.element = dock;
  }

  public setStatus(status: 'active' | 'pending' | 'error', text?: string) {
    if (this.statusDot) {
      this.statusDot.className = `mememeet-status-dot ${status}`;
      if (text) {
        this.statusDot.title = text;
      }
    }
  }

  public setVisible(visible: boolean) {
    if (this.element) {
      this.element.style.display = visible ? 'flex' : 'none';
    }
  }

  public setHUDActive(active: boolean) {
    if (this.hudBtn) {
      if (active) {
        this.hudBtn.classList.add('active');
      } else {
        this.hudBtn.classList.remove('active');
      }
    }
  }

  private toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    const btns = this.element?.querySelector('.mememeet-dock-buttons') as HTMLElement | null;
    if (btns) {
      btns.style.display = this.isCollapsed ? 'none' : 'flex';
    }
  }

  public destroy() {
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
      this.element = null;
    }
  }
}
