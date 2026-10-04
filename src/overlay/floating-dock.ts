import { MemeItem } from '../shared/types';
import { assignDefaultHotkey } from '../shared/media-resolver';

export interface FloatingDockCallbacks {
  onTriggerMeme: (meme: MemeItem) => void;
  onAddMeme: () => void;
  onDeleteMeme: (memeId: string) => void;
  onToggleDock?: () => void;
  onCloseDock?: () => void;
}

function playHapticSound(type: 'pop' | 'minimize' | 'expand' | 'delete' = 'pop') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const t = ctx.currentTime;

    if (type === 'pop') {
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.start(t);
      osc.stop(t + 0.09);
    } else if (type === 'minimize') {
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.1);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.11);
    } else if (type === 'expand') {
      osc.frequency.setValueAtTime(360, t);
      osc.frequency.exponentialRampToValueAtTime(720, t + 0.1);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.11);
    } else if (type === 'delete') {
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.12);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.start(t);
      osc.stop(t + 0.13);
    }
  } catch (_) {}
}

export class FloatingDock {
  private element: HTMLElement | null = null;
  private summonBubble: HTMLElement | null = null;
  private btnContainer: HTMLElement | null = null;
  private contextMenu: HTMLElement | null = null;
  private isMinimized: boolean = false;
  private isEditMode: boolean = false;
  private isVisible: boolean = true;
  private memes: MemeItem[] = [];
  private callbacks: FloatingDockCallbacks;

  // Dragging state
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private initialLeft = 0;
  private initialTop = 0;
  private activeDragTarget: HTMLElement | null = null;

  constructor(parent: HTMLElement, memes: MemeItem[], callbacks: FloatingDockCallbacks) {
    this.memes = memes;
    this.callbacks = callbacks;
    this.createDom(parent);
    this.setupDraggable();
    this.setupOutsideClickListener();
  }

  private createDom(parent: HTMLElement) {
    // 1. Full Floating HUD Dock
    const dock = document.createElement('div');
    dock.className = 'memecord-dock';

    // Drag Handle
    const dragHandle = document.createElement('div');
    dragHandle.className = 'memecord-dock-drag-handle';
    dragHandle.title = 'Drag toolbar anywhere';
    dragHandle.textContent = '⋮⋮';
    dock.appendChild(dragHandle);

    // Brand Badge / Collapse Toggle
    const badge = document.createElement('div');
    badge.className = 'memecord-dock-badge';
    badge.title = 'Click to minimize HUD (Alt+M)';

    const dot = document.createElement('span');
    dot.className = 'memecord-status-dot';

    const label = document.createElement('span');
    label.id = 'memecord-dock-title';
    label.textContent = '🎭 Memecord';

    badge.appendChild(dot);
    badge.appendChild(label);
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setMinimized(true);
    });
    dock.appendChild(badge);

    // Buttons Container
    const btnContainer = document.createElement('div');
    btnContainer.className = 'memecord-dock-buttons';
    this.btnContainer = btnContainer;

    this.renderButtons();
    dock.appendChild(btnContainer);

    parent.appendChild(dock);
    this.element = dock;

    // 2. Minimized Summon Pebble (Dynamic Island style micro-pill)
    const bubble = document.createElement('div');
    bubble.className = 'memecord-summon-bubble';
    bubble.title = 'Open Memecord HUD (Alt+M)';
    bubble.innerHTML = `
      <span class="memecord-status-dot"></span>
      <span class="memecord-summon-icon">🎭</span>
      <span class="memecord-summon-label">Memecord</span>
      <span class="memecord-summon-key">Alt+M</span>
    `;
    bubble.style.display = 'none';
    bubble.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setMinimized(false);
    });
    parent.appendChild(bubble);
    this.summonBubble = bubble;

    // Restore saved position
    this.restorePosition();
  }

  public updateMemes(memes: MemeItem[]) {
    this.memes = memes;
    this.renderButtons();
  }

  private renderButtons() {
    if (!this.btnContainer) return;
    this.btnContainer.innerHTML = '';

    // Render meme buttons
    this.memes.forEach((meme, index) => {
      const btn = document.createElement('button');
      btn.className = 'memecord-dock-btn';
      btn.dataset.memeId = meme.id;

      // Meme emoji
      const emojiSpan = document.createElement('span');
      emojiSpan.textContent = meme.emoji || '✨';
      btn.appendChild(emojiSpan);

      // Hotkey badge (properly sequential: 1-9, 0, Q, W, E...)
      const keyLabel = meme.hotkey || assignDefaultHotkey(index);
      if (keyLabel) {
        const keyBadge = document.createElement('span');
        keyBadge.className = 'memecord-hotkey-badge';
        keyBadge.textContent = keyLabel;
        btn.appendChild(keyBadge);
      }

      // Hover Tooltip with meme title & hotkey
      const tooltip = document.createElement('div');
      tooltip.className = 'memecord-tooltip';
      tooltip.innerHTML = `<span>${meme.name}</span>${keyLabel ? `<span style="color:#818cf8; font-weight:800;">[${keyLabel}]</span>` : ''}`;
      btn.appendChild(tooltip);

      // Red delete '✕' badge shown during Edit Mode
      if (this.isEditMode) {
        const delBadge = document.createElement('span');
        delBadge.className = 'memecord-delete-badge';
        delBadge.textContent = '✕';
        delBadge.title = `Delete ${meme.name}`;
        delBadge.addEventListener('click', (e) => {
          e.stopPropagation();
          playHapticSound('delete');
          this.callbacks.onDeleteMeme(meme.id);
        });
        btn.appendChild(delBadge);
      }

      // Left click handler
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isEditMode) {
          playHapticSound('delete');
          this.callbacks.onDeleteMeme(meme.id);
        } else {
          playHapticSound('pop');
          this.createClickRipple(btn);
          this.callbacks.onTriggerMeme(meme);
        }
      });

      // Right click context menu (Instant remove or trigger)
      btn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openContextMenu(e.clientX, e.clientY, meme);
      });

      this.btnContainer!.appendChild(btn);
    });

    // Divider
    const divider = document.createElement('div');
    divider.className = 'memecord-dock-divider';
    this.btnContainer.appendChild(divider);

    // Edit / Manage Mode Toggle Button (✏️ / ✓)
    const editBtn = document.createElement('button');
    editBtn.className = `memecord-dock-btn action-btn edit-toggle ${this.isEditMode ? 'active' : ''}`;
    editBtn.title = this.isEditMode ? 'Done managing memes' : 'Manage / Remove memes';
    editBtn.textContent = this.isEditMode ? '✓' : '✏️';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playHapticSound('pop');
      this.toggleEditMode();
    });
    this.btnContainer.appendChild(editBtn);

    // Add Meme (+) Button
    const addBtn = document.createElement('button');
    addBtn.className = 'memecord-dock-btn action-btn add-btn';
    addBtn.title = 'Add new meme (Paste Tenor, Giphy, or image URL)';
    addBtn.textContent = '+';
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playHapticSound('pop');
      if (this.isEditMode) this.toggleEditMode();
      this.callbacks.onAddMeme();
    });
    this.btnContainer.appendChild(addBtn);

    // Dedicated Close (✕) Button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'memecord-dock-btn action-btn close-btn';
    closeBtn.title = 'Close HUD (Press Alt+M to reopen)';
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setMinimized(true);
    });
    this.btnContainer.appendChild(closeBtn);
  }

  private createClickRipple(target: HTMLElement) {
    const ripple = document.createElement('div');
    ripple.className = 'memecord-click-ripple';
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 400);
  }

  public setMinimized(minimized: boolean) {
    this.isMinimized = minimized;
    playHapticSound(minimized ? 'minimize' : 'expand');

    if (minimized) {
      if (this.element) {
        this.element.classList.add('hiding');
        setTimeout(() => {
          if (this.isMinimized && this.element) {
            this.element.style.display = 'none';
            this.element.classList.remove('hiding');
          }
        }, 220);
      }
      if (this.summonBubble && this.isVisible) {
        this.summonBubble.style.display = 'flex';
        this.summonBubble.classList.add('visible');
        this.syncBubblePosition();
      }
      this.callbacks.onCloseDock?.();
    } else {
      if (this.summonBubble) {
        this.summonBubble.style.display = 'none';
        this.summonBubble.classList.remove('visible');
      }
      if (this.element && this.isVisible) {
        this.element.style.display = 'flex';
        this.element.classList.add('entering');
        setTimeout(() => {
          this.element?.classList.remove('entering');
        }, 250);
      }
    }
  }

  public toggleMinimize() {
    this.setMinimized(!this.isMinimized);
  }

  private syncBubblePosition() {
    if (!this.summonBubble || !this.element) return;
    const rect = this.element.getBoundingClientRect();
    if (rect.left > 0 && rect.top > 0) {
      this.summonBubble.style.left = `${Math.min(window.innerWidth - 120, rect.left)}px`;
      this.summonBubble.style.top = `${Math.min(window.innerHeight - 50, rect.top)}px`;
      this.summonBubble.style.bottom = 'auto';
      this.summonBubble.style.transform = 'none';
    }
  }

  private toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.element) {
      if (this.isEditMode) {
        this.element.classList.add('edit-mode');
      } else {
        this.element.classList.remove('edit-mode');
      }
    }
    this.renderButtons();
  }

  private openContextMenu(x: number, y: number, meme: MemeItem) {
    this.closeContextMenu();

    const menu = document.createElement('div');
    menu.className = 'memecord-context-menu';

    // Menu bounds positioning
    const left = Math.min(x, window.innerWidth - 180);
    const top = Math.max(10, y - 90);
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;

    // 1. Trigger action
    const triggerItem = document.createElement('button');
    triggerItem.className = 'memecord-menu-item';
    triggerItem.innerHTML = `<span>▶️</span><span>Trigger "${meme.name}"</span>`;
    triggerItem.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeContextMenu();
      playHapticSound('pop');
      this.callbacks.onTriggerMeme(meme);
    });
    menu.appendChild(triggerItem);

    // 2. Delete action
    const deleteItem = document.createElement('button');
    deleteItem.className = 'memecord-menu-item danger';
    deleteItem.innerHTML = `<span>🗑️</span><span>Remove from Dock</span>`;
    deleteItem.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeContextMenu();
      playHapticSound('delete');
      this.callbacks.onDeleteMeme(meme.id);
    });
    menu.appendChild(deleteItem);

    // 3. Close HUD
    const closeItem = document.createElement('button');
    closeItem.className = 'memecord-menu-item';
    closeItem.innerHTML = `<span>✕</span><span>Hide HUD (Alt+M)</span>`;
    closeItem.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeContextMenu();
      this.setMinimized(true);
    });
    menu.appendChild(closeItem);

    document.body.appendChild(menu);
    this.contextMenu = menu;
  }

  private closeContextMenu() {
    if (this.contextMenu && this.contextMenu.parentElement) {
      this.contextMenu.remove();
      this.contextMenu = null;
    }
  }

  private setupOutsideClickListener() {
    document.addEventListener('click', () => {
      this.closeContextMenu();
    });
  }

  private setupDraggable() {
    const bindDrag = (targetEl: HTMLElement) => {
      const onMouseDown = (e: MouseEvent) => {
        if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'INPUT') {
          return;
        }
        this.isDragging = true;
        this.activeDragTarget = targetEl;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;

        const rect = targetEl.getBoundingClientRect();
        this.initialLeft = rect.left;
        this.initialTop = rect.top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!this.isDragging || !this.activeDragTarget) return;
        const deltaX = e.clientX - this.dragStartX;
        const deltaY = e.clientY - this.dragStartY;

        let newLeft = this.initialLeft + deltaX;
        let newTop = this.initialTop + deltaY;

        const maxLeft = window.innerWidth - this.activeDragTarget.offsetWidth - 10;
        const maxTop = window.innerHeight - this.activeDragTarget.offsetHeight - 10;

        newLeft = Math.max(10, Math.min(maxLeft, newLeft));
        newTop = Math.max(10, Math.min(maxTop, newTop));

        this.activeDragTarget.style.left = `${newLeft}px`;
        this.activeDragTarget.style.top = `${newTop}px`;
        this.activeDragTarget.style.bottom = 'auto';
        this.activeDragTarget.style.transform = 'none';

        if (this.activeDragTarget === this.element && this.summonBubble) {
          this.summonBubble.style.left = `${newLeft}px`;
          this.summonBubble.style.top = `${newTop}px`;
          this.summonBubble.style.bottom = 'auto';
          this.summonBubble.style.transform = 'none';
        }
      };

      const onMouseUp = () => {
        if (!this.isDragging) return;
        this.isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (this.activeDragTarget) {
          const rect = this.activeDragTarget.getBoundingClientRect();
          try {
            localStorage.setItem('memecord_dock_pos', JSON.stringify({ left: rect.left, top: rect.top }));
          } catch (_) {}
        }
        this.activeDragTarget = null;
      };

      targetEl.addEventListener('mousedown', onMouseDown);
    };

    if (this.element) bindDrag(this.element);
    if (this.summonBubble) bindDrag(this.summonBubble);
  }

  private restorePosition() {
    try {
      const saved = localStorage.getItem('memecord_dock_pos');
      if (saved) {
        const { left, top } = JSON.parse(saved);
        if (typeof left === 'number' && typeof top === 'number') {
          const maxLeft = window.innerWidth - 120;
          const maxTop = window.innerHeight - 50;
          const safeLeft = Math.max(10, Math.min(maxLeft, left));
          const safeTop = Math.max(10, Math.min(maxTop, top));

          if (this.element) {
            this.element.style.left = `${safeLeft}px`;
            this.element.style.top = `${safeTop}px`;
            this.element.style.bottom = 'auto';
            this.element.style.transform = 'none';
          }
          if (this.summonBubble) {
            this.summonBubble.style.left = `${safeLeft}px`;
            this.summonBubble.style.top = `${safeTop}px`;
            this.summonBubble.style.bottom = 'auto';
            this.summonBubble.style.transform = 'none';
          }
        }
      }
    } catch (_) {}
  }

  public setVisible(visible: boolean) {
    this.isVisible = visible;
    if (!visible) {
      if (this.element) this.element.style.display = 'none';
      if (this.summonBubble) this.summonBubble.style.display = 'none';
    } else {
      if (this.isMinimized) {
        if (this.summonBubble) this.summonBubble.style.display = 'flex';
      } else {
        if (this.element) this.element.style.display = 'flex';
      }
    }
  }

  public destroy() {
    this.closeContextMenu();
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
      this.element = null;
    }
    if (this.summonBubble && this.summonBubble.parentElement) {
      this.summonBubble.parentElement.removeChild(this.summonBubble);
      this.summonBubble = null;
    }
  }
}
