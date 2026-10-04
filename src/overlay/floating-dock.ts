import { MemeItem, MemeOverlayPosition } from '../shared/types';
import { assignDefaultHotkey } from '../shared/media-resolver';

export interface FloatingDockCallbacks {
  onTriggerMeme: (meme: MemeItem) => void;
  onAddMeme: () => void;
  onDeleteMeme: (memeId: string) => void;
  onUpdateHotkey?: (memeId: string, newHotkey: string) => void;
  onToggleDock?: () => void;
  onCloseDock?: () => void;
  onPositionChange?: (position: MemeOverlayPosition) => void;
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

function resolveThumbUrl(assetUrl: string): string {
  if (!assetUrl) return '';
  if (assetUrl.startsWith('http://') || assetUrl.startsWith('https://') || assetUrl.startsWith('data:')) {
    return assetUrl;
  }
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
    return chrome.runtime.getURL(assetUrl.replace(/^\//, ''));
  }
  return assetUrl.startsWith('/') ? assetUrl : `/${assetUrl}`;
}

export class FloatingDock {
  private element: HTMLElement | null = null;
  private summonBubble: HTMLElement | null = null;
  private gridContainer: HTMLElement | null = null;
  private countBadge: HTMLElement | null = null;
  private contextMenu: HTMLElement | null = null;
  private activeModal: HTMLElement | null = null;
  private isMinimized: boolean = false;
  private isEditMode: boolean = false;
  private isVisible: boolean = true;
  private searchQuery: string = '';
  private currentPosition: MemeOverlayPosition = 'center';
  private memes: MemeItem[] = [];
  private callbacks: FloatingDockCallbacks;

  // Dragging state
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private initialLeft = 0;
  private initialTop = 0;
  private activeDragTarget: HTMLElement | null = null;

  constructor(
    parent: HTMLElement,
    memes: MemeItem[],
    callbacks: FloatingDockCallbacks,
    initialPosition: MemeOverlayPosition = 'center'
  ) {
    this.memes = memes;
    this.callbacks = callbacks;
    this.currentPosition = initialPosition;
    this.createDom(parent);
    this.setupDraggable();
    this.setupOutsideClickListener();
  }

  private createDom(parent: HTMLElement) {
    // 1. Spacious Floating Meme Deck
    const deck = document.createElement('div');
    deck.className = 'memecord-deck';

    // Header Bar
    const header = document.createElement('div');
    header.className = 'memecord-deck-header';

    // Brand and Drag
    const brand = document.createElement('div');
    brand.className = 'memecord-deck-brand';

    const dragGrip = document.createElement('span');
    dragGrip.className = 'memecord-drag-grip';
    dragGrip.textContent = '⠿';
    dragGrip.title = 'Drag Deck anywhere on screen';

    const dot = document.createElement('span');
    dot.className = 'memecord-status-dot';

    const title = document.createElement('span');
    title.className = 'memecord-deck-title';
    title.textContent = 'Memecord Deck';

    const countBadge = document.createElement('span');
    countBadge.className = 'memecord-count-badge';
    countBadge.textContent = `${this.memes.length}`;
    this.countBadge = countBadge;

    brand.appendChild(dragGrip);
    brand.appendChild(dot);
    brand.appendChild(title);
    brand.appendChild(countBadge);
    header.appendChild(brand);

    // Search Box
    const searchBox = document.createElement('div');
    searchBox.className = 'memecord-search-box';

    const searchIcon = document.createElement('span');
    searchIcon.className = 'memecord-search-icon';
    searchIcon.textContent = '🔍';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'memecord-search-input';
    searchInput.placeholder = 'Filter memes or key...';
    searchInput.addEventListener('input', () => {
      this.searchQuery = searchInput.value.trim().toLowerCase();
      this.renderCards();
    });

    searchBox.appendChild(searchIcon);
    searchBox.appendChild(searchInput);
    header.appendChild(searchBox);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'memecord-deck-actions';

    // Edit Toggle
    const editBtn = document.createElement('button');
    editBtn.className = 'memecord-deck-action-btn edit-btn';
    editBtn.title = 'Edit keybindings or remove memes';
    editBtn.textContent = '✏️ Edit';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playHapticSound('pop');
      this.toggleEditMode();
      editBtn.classList.toggle('active', this.isEditMode);
      editBtn.textContent = this.isEditMode ? '✓ Done' : '✏️ Edit';
    });
    actions.appendChild(editBtn);

    // Add Meme Button
    const addBtn = document.createElement('button');
    addBtn.className = 'memecord-deck-action-btn add-btn';
    addBtn.title = 'Add new meme (URL, GIF, Tenor)';
    addBtn.innerHTML = `<span>+ Add</span>`;
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playHapticSound('pop');
      if (this.isEditMode) {
        this.toggleEditMode();
        editBtn.classList.remove('active');
        editBtn.textContent = '✏️ Edit';
      }
      this.callbacks.onAddMeme();
    });
    actions.appendChild(addBtn);

    // Close / Minimize Button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'memecord-deck-action-btn close-btn';
    closeBtn.title = 'Minimize Deck (Press Alt+M to reopen)';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setMinimized(true);
    });
    actions.appendChild(closeBtn);

    header.appendChild(actions);
    deck.appendChild(header);

    // Meme Grid Body
    const gridContainer = document.createElement('div');
    gridContainer.className = 'memecord-deck-grid';
    this.gridContainer = gridContainer;
    this.renderCards();
    deck.appendChild(gridContainer);

    // Footer Bar
    const footer = document.createElement('div');
    footer.className = 'memecord-deck-footer';

    const hint = document.createElement('div');
    hint.className = 'memecord-deck-hint';
    hint.innerHTML = `<span>⌨️ Press hotkey <strong>[1–9, 0, Q...]</strong> during call</span>`;

    const posWrap = document.createElement('div');
    posWrap.className = 'memecord-deck-pos-wrap';

    const posLabel = document.createElement('span');
    posLabel.style.fontSize = '10px';
    posLabel.style.color = '#94a3b8';
    posLabel.textContent = 'Pos:';
    posWrap.appendChild(posLabel);

    const positions: { key: MemeOverlayPosition; label: string }[] = [
      { key: 'center', label: 'Center' },
      { key: 'top-right', label: 'Top-R' },
      { key: 'bottom-right', label: 'Bot-R' }
    ];

    positions.forEach((p) => {
      const btn = document.createElement('button');
      btn.className = `memecord-pos-pill ${this.currentPosition === p.key ? 'active' : ''}`;
      btn.textContent = p.label;
      btn.dataset.pos = p.key;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        posWrap.querySelectorAll('.memecord-pos-pill').forEach((el) => el.classList.remove('active'));
        btn.classList.add('active');
        this.currentPosition = p.key;
        this.callbacks.onPositionChange?.(p.key);
      });
      posWrap.appendChild(btn);
    });

    footer.appendChild(hint);
    footer.appendChild(posWrap);
    deck.appendChild(footer);

    parent.appendChild(deck);
    this.element = deck;

    // 2. Minimized Summon Pebble (Dynamic Island style)
    const bubble = document.createElement('div');
    bubble.className = 'memecord-summon-bubble';
    bubble.title = 'Open Memecord Deck (Alt+M)';
    bubble.innerHTML = `
      <span class="memecord-status-dot"></span>
      <span class="memecord-summon-icon">🎭</span>
      <span class="memecord-summon-label">Memecord Deck</span>
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
    if (this.countBadge) {
      this.countBadge.textContent = `${memes.length}`;
    }
    this.renderCards();
  }

  public setPosition(pos: MemeOverlayPosition) {
    this.currentPosition = pos;
    if (this.element) {
      this.element.querySelectorAll('.memecord-pos-pill').forEach((el) => {
        const btn = el as HTMLElement;
        btn.classList.toggle('active', btn.dataset.pos === pos);
      });
    }
  }

  private renderCards() {
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = '';

    const filtered = this.memes.filter((m, idx) => {
      if (!this.searchQuery) return true;
      const key = (m.hotkey || assignDefaultHotkey(idx)).toLowerCase();
      return (
        m.name.toLowerCase().includes(this.searchQuery) ||
        (m.emoji && m.emoji.includes(this.searchQuery)) ||
        key.includes(this.searchQuery)
      );
    });

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'memecord-deck-empty';
      empty.innerHTML = `
        <span style="font-size: 26px;">🔍</span>
        <div style="font-weight: 600; margin-top: 6px;">No memes matching "${this.searchQuery}"</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Try another search or add a new meme</div>
      `;
      this.gridContainer.appendChild(empty);
      return;
    }

    // Render Meme Cards
    filtered.forEach((meme, i) => {
      const originalIdx = this.memes.findIndex((m) => m.id === meme.id);
      const keyLabel = meme.hotkey || assignDefaultHotkey(originalIdx >= 0 ? originalIdx : i);

      const card = document.createElement('div');
      card.className = `memecord-card ${this.isEditMode ? 'wiggling edit-mode' : ''}`;
      card.dataset.memeId = meme.id;
      card.title = this.isEditMode
        ? `Click to change keybinding [${keyLabel}]`
        : `Click or press [${keyLabel}] to trigger`;

      // Hotkey badge
      if (keyLabel) {
        const hotkeyBadge = document.createElement('button');
        hotkeyBadge.className = `memecord-card-hotkey ${this.isEditMode ? 'editable' : ''}`;
        hotkeyBadge.textContent = this.isEditMode ? `${keyLabel} ✎` : keyLabel;
        hotkeyBadge.title = this.isEditMode ? 'Click to change keybinding' : `Hotkey [${keyLabel}]`;

        if (this.isEditMode) {
          hotkeyBadge.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openKeybindingModal(meme);
          });
        }
        card.appendChild(hotkeyBadge);
      }

      // Thumbnail / Visual Preview
      const thumbWrap = document.createElement('div');
      thumbWrap.className = 'memecord-card-thumb-wrap';

      const thumbUrl = resolveThumbUrl(meme.assetUrl);
      const img = document.createElement('img');
      img.className = 'memecord-card-img';
      img.alt = meme.name;
      img.loading = 'lazy';
      img.src = thumbUrl;

      const emojiFallback = document.createElement('span');
      emojiFallback.className = 'memecord-card-emoji-fallback';
      emojiFallback.textContent = meme.emoji || '✨';

      img.onerror = () => {
        img.style.display = 'none';
        emojiFallback.style.display = 'flex';
      };

      thumbWrap.appendChild(img);
      thumbWrap.appendChild(emojiFallback);
      card.appendChild(thumbWrap);

      // Meme Name
      const nameEl = document.createElement('div');
      nameEl.className = 'memecord-card-name';
      nameEl.textContent = meme.name;
      card.appendChild(nameEl);

      // Edit Mode Delete Badge
      if (this.isEditMode) {
        const delBadge = document.createElement('button');
        delBadge.className = 'memecord-card-delete-badge';
        delBadge.textContent = '✕';
        delBadge.title = `Delete ${meme.name}`;
        delBadge.addEventListener('click', (e) => {
          e.stopPropagation();
          playHapticSound('delete');
          this.callbacks.onDeleteMeme(meme.id);
        });
        card.appendChild(delBadge);
      }

      // Click Handler
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isEditMode) {
          // In edit mode: clicking card opens keybinding editor!
          playHapticSound('pop');
          this.openKeybindingModal(meme);
        } else {
          playHapticSound('pop');
          this.createClickRipple(card);
          this.callbacks.onTriggerMeme(meme);
        }
      });

      // Right-Click Context Menu
      card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openContextMenu(e.clientX, e.clientY, meme);
      });

      this.gridContainer!.appendChild(card);
    });

    // Add Meme Tile at end of grid
    const addCard = document.createElement('div');
    addCard.className = 'memecord-card add-card';
    addCard.title = 'Add new meme to deck';
    addCard.innerHTML = `
      <div class="memecord-add-card-icon">+</div>
      <div class="memecord-card-name" style="color: #a5b4fc;">Add Meme</div>
    `;
    addCard.addEventListener('click', (e) => {
      e.stopPropagation();
      playHapticSound('pop');
      if (this.isEditMode) this.toggleEditMode();
      this.callbacks.onAddMeme();
    });
    this.gridContainer.appendChild(addCard);
  }

  public openKeybindingModal(meme: MemeItem) {
    this.closeActiveModal();

    let selectedKey = (meme.hotkey || assignDefaultHotkey(0)).toUpperCase();

    const modal = document.createElement('div');
    modal.className = 'memecord-keybind-modal';
    modal.innerHTML = `
      <div class="memecord-modal-title">
        <span>⌨️ Change Keybinding</span>
        <button class="memecord-modal-close" id="memecord-keybind-close-btn">&times;</button>
      </div>

      <div style="text-align: center; margin: 12px 0 14px 0;">
        <div style="font-size: 32px; line-height: 1;">${meme.emoji || '✨'}</div>
        <div style="font-size: 14px; font-weight: 800; color: #f8fafc; margin-top: 6px;">${meme.name}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Press any key on keyboard or select below</div>

        <div class="memecord-keybind-display-box" id="memecord-keybind-box">
          <span style="font-size: 10px; font-weight: 700; color: #a5b4fc; display: block; margin-bottom: 2px;">ACTIVE KEY</span>
          <span class="memecord-keybind-large-key" id="memecord-keybind-val">${selectedKey}</span>
          <span class="memecord-keybind-press-hint">⌨️ Press any key now...</span>
        </div>
      </div>

      <div style="font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 6px;">Quick Presets:</div>
      <div class="memecord-keybind-quick-grid" id="memecord-quick-grid">
        ${['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'W', 'E', 'R', 'T', 'Y', 'A', 'S', 'D', 'F', 'G', 'Z', 'X', 'C', 'V', 'B']
          .map((k) => `<button class="memecord-quick-key-btn ${k === selectedKey ? 'active' : ''}" data-key="${k}">${k}</button>`)
          .join('')}
      </div>

      <div class="memecord-modal-btn-row" style="margin-top: 16px;">
        <button class="memecord-btn-secondary" id="memecord-keybind-cancel">Cancel</button>
        <button class="memecord-btn-primary" id="memecord-keybind-save">Save Keybinding</button>
      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    const valEl = modal.querySelector('#memecord-keybind-val') as HTMLElement;
    const quickGrid = modal.querySelector('#memecord-quick-grid') as HTMLElement;

    const selectKey = (k: string) => {
      selectedKey = k.trim().toUpperCase();
      valEl.textContent = selectedKey;
      quickGrid.querySelectorAll('.memecord-quick-key-btn').forEach((el) => {
        const btn = el as HTMLElement;
        btn.classList.toggle('active', btn.dataset.key === selectedKey);
      });
      playHapticSound('pop');
    };

    // Quick keys click handler
    quickGrid.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.memecord-quick-key-btn') as HTMLElement;
      if (btn && btn.dataset.key) {
        e.stopPropagation();
        selectKey(btn.dataset.key);
      }
    });

    // Keyboard listener on window while modal is open
    const onKeyDown = (e: KeyboardEvent) => {
      if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;
      if (e.key === 'Escape') {
        cleanup();
        return;
      }
      if (e.key === 'Enter') {
        saveAndClose();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      selectKey(e.key);
    };

    window.addEventListener('keydown', onKeyDown, true);

    const cleanup = () => {
      window.removeEventListener('keydown', onKeyDown, true);
      this.closeActiveModal();
    };

    const saveAndClose = () => {
      if (selectedKey) {
        this.callbacks.onUpdateHotkey?.(meme.id, selectedKey);
        playHapticSound('pop');
      }
      cleanup();
    };

    modal.querySelector('#memecord-keybind-close-btn')?.addEventListener('click', cleanup);
    modal.querySelector('#memecord-keybind-cancel')?.addEventListener('click', cleanup);
    modal.querySelector('#memecord-keybind-save')?.addEventListener('click', saveAndClose);
  }

  private closeActiveModal() {
    if (this.activeModal && this.activeModal.parentElement) {
      this.activeModal.parentElement.removeChild(this.activeModal);
      this.activeModal = null;
    }
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
      this.closeActiveModal();
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
      this.summonBubble.style.left = `${Math.min(window.innerWidth - 180, rect.left)}px`;
      this.summonBubble.style.top = `${Math.min(window.innerHeight - 50, rect.top)}px`;
      this.summonBubble.style.bottom = 'auto';
      this.summonBubble.style.transform = 'none';
    }
  }

  private toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.element) {
      this.element.classList.toggle('edit-mode', this.isEditMode);
    }
    this.renderCards();
  }

  private openContextMenu(x: number, y: number, meme: MemeItem) {
    this.closeContextMenu();

    const menu = document.createElement('div');
    menu.className = 'memecord-context-menu';

    const left = Math.min(x, window.innerWidth - 200);
    const top = Math.max(10, y - 110);
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

    // 2. Change Keybinding action
    const keyItem = document.createElement('button');
    keyItem.className = 'memecord-menu-item';
    keyItem.innerHTML = `<span>⌨️</span><span>Change Key [${meme.hotkey || 'None'}]</span>`;
    keyItem.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeContextMenu();
      this.openKeybindingModal(meme);
    });
    menu.appendChild(keyItem);

    // 3. Delete action
    const deleteItem = document.createElement('button');
    deleteItem.className = 'memecord-menu-item danger';
    deleteItem.innerHTML = `<span>🗑️</span><span>Remove from Deck</span>`;
    deleteItem.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeContextMenu();
      playHapticSound('delete');
      this.callbacks.onDeleteMeme(meme.id);
    });
    menu.appendChild(deleteItem);

    // 4. Minimize action
    const closeItem = document.createElement('button');
    closeItem.className = 'memecord-menu-item';
    closeItem.innerHTML = `<span>✕</span><span>Minimize Deck (Alt+M)</span>`;
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
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'BUTTON' ||
          target.tagName === 'INPUT' ||
          target.closest('button') ||
          target.closest('input') ||
          target.closest('.memecord-card') ||
          target.closest('.memecord-keybind-modal')
        ) {
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
          const maxLeft = window.innerWidth - 180;
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
      this.closeActiveModal();
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
    this.closeActiveModal();
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
