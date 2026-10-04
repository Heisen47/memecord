import { MemeItem } from '../shared/types';
import { assignDefaultHotkey } from '../shared/media-resolver';

export interface FloatingDockCallbacks {
  onTriggerMeme: (meme: MemeItem) => void;
  onAddMeme: () => void;
  onDeleteMeme: (memeId: string) => void;
  onToggleDock?: () => void;
}

export class FloatingDock {
  private element: HTMLElement | null = null;
  private btnContainer: HTMLElement | null = null;
  private contextMenu: HTMLElement | null = null;
  private isCollapsed: boolean = false;
  private isEditMode: boolean = false;
  private memes: MemeItem[] = [];
  private callbacks: FloatingDockCallbacks;

  // Dragging state
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private initialLeft = 0;
  private initialTop = 0;

  constructor(parent: HTMLElement, memes: MemeItem[], callbacks: FloatingDockCallbacks) {
    this.memes = memes;
    this.callbacks = callbacks;
    this.createDom(parent);
    this.setupDraggable();
    this.setupOutsideClickListener();
  }

  private createDom(parent: HTMLElement) {
    const dock = document.createElement('div');
    dock.className = 'memecord-dock';

    // Drag Handle
    const dragHandle = document.createElement('div');
    dragHandle.className = 'memecord-dock-drag-handle';
    dragHandle.title = 'Drag toolbar anywhere';
    dragHandle.textContent = '⋮⋮';
    dock.appendChild(dragHandle);

    // Brand / Minimize Toggle
    const badge = document.createElement('div');
    badge.className = 'memecord-dock-badge';
    badge.title = 'Click to collapse/expand toolbar';

    const dot = document.createElement('span');
    dot.className = 'memecord-status-dot';

    const label = document.createElement('span');
    label.id = 'memecord-dock-title';
    label.textContent = '🎭 Memecord';

    badge.appendChild(dot);
    badge.appendChild(label);
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleCollapse();
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
          this.callbacks.onDeleteMeme(meme.id);
        });
        btn.appendChild(delBadge);
      }

      // Left click handler
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isEditMode) {
          // In edit mode, clicking deletes the meme
          this.callbacks.onDeleteMeme(meme.id);
        } else {
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

    // Edit / Manage Mode Toggle Button (✏️ / ✓)
    const editBtn = document.createElement('button');
    editBtn.className = `memecord-dock-btn action-btn edit-toggle ${this.isEditMode ? 'active' : ''}`;
    editBtn.title = this.isEditMode ? 'Done managing memes' : 'Manage / Remove memes';
    editBtn.textContent = this.isEditMode ? '✓' : '✏️';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
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
      if (this.isEditMode) this.toggleEditMode();
      this.callbacks.onAddMeme();
    });
    this.btnContainer.appendChild(addBtn);
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

  private toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    const titleEl = this.element?.querySelector('#memecord-dock-title');

    if (this.btnContainer) {
      this.btnContainer.style.display = this.isCollapsed ? 'none' : 'flex';
    }

    if (titleEl) {
      titleEl.textContent = this.isCollapsed ? `🎭 ${this.memes.length}` : '🎭 Memecord';
    }
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
      this.callbacks.onDeleteMeme(meme.id);
    });
    menu.appendChild(deleteItem);

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
    if (!this.element) return;

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).tagName === 'INPUT') {
        return;
      }
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;

      const rect = this.element!.getBoundingClientRect();
      this.initialLeft = rect.left;
      this.initialTop = rect.top;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isDragging || !this.element) return;
      const deltaX = e.clientX - this.dragStartX;
      const deltaY = e.clientY - this.dragStartY;

      let newLeft = this.initialLeft + deltaX;
      let newTop = this.initialTop + deltaY;

      const maxLeft = window.innerWidth - this.element.offsetWidth - 10;
      const maxTop = window.innerHeight - this.element.offsetHeight - 10;

      newLeft = Math.max(10, Math.min(maxLeft, newLeft));
      newTop = Math.max(10, Math.min(maxTop, newTop));

      this.element.style.left = `${newLeft}px`;
      this.element.style.top = `${newTop}px`;
      this.element.style.bottom = 'auto';
      this.element.style.transform = 'none';
    };

    const onMouseUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (this.element) {
        const rect = this.element.getBoundingClientRect();
        try {
          localStorage.setItem('memecord_dock_pos', JSON.stringify({ left: rect.left, top: rect.top }));
        } catch (_) {}
      }
    };

    this.element.addEventListener('mousedown', onMouseDown);
  }

  private restorePosition() {
    try {
      const saved = localStorage.getItem('memecord_dock_pos');
      if (saved && this.element) {
        const { left, top } = JSON.parse(saved);
        if (typeof left === 'number' && typeof top === 'number') {
          const maxLeft = window.innerWidth - 120;
          const maxTop = window.innerHeight - 50;
          this.element.style.left = `${Math.max(10, Math.min(maxLeft, left))}px`;
          this.element.style.top = `${Math.max(10, Math.min(maxTop, top))}px`;
          this.element.style.bottom = 'auto';
          this.element.style.transform = 'none';
        }
      }
    } catch (_) {}
  }

  public setVisible(visible: boolean) {
    if (this.element) {
      this.element.style.display = visible ? 'flex' : 'none';
    }
  }

  public destroy() {
    this.closeContextMenu();
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
      this.element = null;
    }
  }
}
