import { StateMachineStatus } from '../shared/types';

export class DebugHUD {
  private element: HTMLElement | null = null;
  private isVisible: boolean = false;

  private gestureEl: HTMLElement | null = null;
  private stateEl: HTMLElement | null = null;
  private confidenceEl: HTMLElement | null = null;
  private cooldownEl: HTMLElement | null = null;
  private barFillEl: HTMLElement | null = null;

  constructor(parent: HTMLElement) {
    this.createDom(parent);
  }

  private createDom(parent: HTMLElement) {
    const hud = document.createElement('div');
    hud.className = 'mememeet-debug-hud';
    hud.style.display = 'none';

    hud.innerHTML = `
      <div class="mememeet-hud-header">
        <span>MEMEMEET DEBUG</span>
        <span style="font-size: 9px; opacity: 0.7;">v1.0.0</span>
      </div>
      <div class="mememeet-hud-row">
        <span class="mememeet-hud-label">State:</span>
        <span class="mememeet-hud-value" data-hud="state">IDLE</span>
      </div>
      <div class="mememeet-hud-row">
        <span class="mememeet-hud-label">Gesture:</span>
        <span class="mememeet-hud-value" data-hud="gesture">NONE</span>
      </div>
      <div class="mememeet-hud-row">
        <span class="mememeet-hud-label">Confidence:</span>
        <span class="mememeet-hud-value" data-hud="confidence">0.00</span>
      </div>
      <div class="mememeet-hud-row">
        <span class="mememeet-hud-label">Cooldown:</span>
        <span class="mememeet-hud-value" data-hud="cooldown">0.0s</span>
      </div>
      <div class="mememeet-hud-bar-container">
        <div class="mememeet-hud-bar-fill" data-hud="bar"></div>
      </div>
      <div class="mememeet-hud-footer">
        Keys: [1] Thumbs Up &bull; [2] Victory &bull; [3] Palm
      </div>
    `;

    parent.appendChild(hud);
    this.element = hud;

    this.stateEl = hud.querySelector('[data-hud="state"]');
    this.gestureEl = hud.querySelector('[data-hud="gesture"]');
    this.confidenceEl = hud.querySelector('[data-hud="confidence"]');
    this.cooldownEl = hud.querySelector('[data-hud="cooldown"]');
    this.barFillEl = hud.querySelector('[data-hud="bar"]');
  }

  public setVisible(visible: boolean) {
    this.isVisible = visible;
    if (this.element) {
      this.element.style.display = visible ? 'block' : 'none';
    }
  }

  public update(status: StateMachineStatus) {
    if (!this.isVisible || !this.element) return;

    if (this.stateEl) {
      this.stateEl.textContent = status.state;
      this.stateEl.className = 'mememeet-hud-value';
      if (status.state === 'CONFIRMED' || status.state === 'TRIGGERED') {
        this.stateEl.classList.add('active');
      } else if (status.state === 'COOLDOWN') {
        this.stateEl.classList.add('cooldown');
      }
    }

    if (this.gestureEl) {
      this.gestureEl.textContent = status.detectedGesture.toUpperCase();
    }

    if (this.confidenceEl) {
      this.confidenceEl.textContent = status.confidence.toFixed(2);
    }

    if (this.cooldownEl) {
      const cooldownSec = (status.cooldownRemainingMs / 1000).toFixed(1);
      this.cooldownEl.textContent = `${cooldownSec}s`;
    }

    if (this.barFillEl) {
      let percent = 0;
      if (status.state === 'DETECTING' && status.stabilityThresholdMs > 0) {
        percent = Math.min(100, (status.stabilityElapsedMs / status.stabilityThresholdMs) * 100);
      } else if (status.state === 'COOLDOWN' && status.cooldownDurationMs > 0) {
        percent = Math.max(0, 100 - (status.cooldownRemainingMs / status.cooldownDurationMs) * 100);
      }
      this.barFillEl.style.width = `${percent}%`;
    }
  }

  public destroy() {
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
      this.element = null;
    }
  }
}
