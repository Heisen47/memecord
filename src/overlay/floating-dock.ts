import { MemeItem, MemeOverlayPosition } from '../shared/types';
import { assignDefaultHotkey } from '../shared/media-resolver';
import { getToggleShortcutText, getToggleShortcutFullLabel } from '../shared/platform';
import { el, icon, createMediaThumb, resolveAssetUrl } from './dom-utils';
import { TrendingFeed, TrendingMeme, GiphySearchResult } from '../shared/trending';
import { UsageInfo, describeGiphyUsage } from '../shared/usage';

export interface AddMemePrefill {
  file?: File;
  url?: string;
  name?: string;
}

type DeckView = 'mine' | 'trending';

/** 'live' = camera is on and memes are stamped onto it; 'local' = only you see them */
export type CallMode = 'live' | 'local';

export interface FloatingDockCallbacks {
  onTriggerMeme: (meme: MemeItem) => void;
  onAddMeme: (prefill?: AddMemePrefill) => void;
  onDeleteMeme: (memeId: string) => void;
  onUpdateHotkey?: (memeId: string, newHotkey: string) => void;
  onMinimizedChange?: (minimized: boolean) => void;
  onPositionChange?: (position: MemeOverlayPosition) => void;
  onTriggerTrending?: (meme: TrendingMeme) => void;
  onLoadTrending?: (force: boolean) => Promise<TrendingFeed>;
  onSearchTrending?: (query: string) => Promise<GiphySearchResult | null>;
}

const ANCHOR_STORAGE_KEY = 'memecord_dock_anchor';
const EDGE_GAP = 8;

const POSITIONS: { key: MemeOverlayPosition; label: string }[] = [
  { key: 'top-center', label: 'Top' },
  { key: 'top-right', label: 'Top right' },
  { key: 'center', label: 'Center' },
  { key: 'bottom-right', label: 'Bottom right' }
];

const KEY_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'Z', 'X', 'C', 'V', 'B'];

let sharedAudioCtx: AudioContext | null = null;

function playHapticSound(type: 'pop' | 'minimize' | 'expand' | 'delete' = 'pop') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    sharedAudioCtx = sharedAudioCtx || new AudioContextClass();
    const ctx = sharedAudioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';

    const sweeps = {
      pop: [440, 880, 0.06, 0.08],
      minimize: [600, 320, 0.05, 0.1],
      expand: [360, 720, 0.05, 0.1],
      delete: [300, 150, 0.07, 0.12]
    } as const;
    const [from, to, volume, length] = sweeps[type];
    const t = ctx.currentTime;
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + length);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + length);
    osc.start(t);
    osc.stop(t + length + 0.01);
  } catch (_) {}
}

export function hotkeyFor(meme: MemeItem, index: number): string {
  return (meme.hotkey || assignDefaultHotkey(index)).toUpperCase();
}

export class FloatingDock {
  private parent: HTMLElement;
  private element: HTMLElement | null = null;
  private pebble: HTMLButtonElement | null = null;
  private gridContainer: HTMLElement | null = null;
  private addBtn: HTMLButtonElement | null = null;
  private refreshBtn: HTMLButtonElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private trendingMeta: HTMLElement | null = null;
  private tabButtons = new Map<DeckView, HTMLButtonElement>();
  private view: DeckView = 'mine';
  private trendingFeed: TrendingFeed | null = null;
  private trendingLoading = false;
  private trendingError = '';
  private searchResults: TrendingMeme[] = [];
  private usage: UsageInfo | undefined;
  private searchError = '';
  private searchTimer: any = null;
  private searchToken = 0;
  private editBtn: HTMLButtonElement | null = null;
  private editBanner: HTMLElement | null = null;
  private contextMenu: HTMLElement | null = null;
  private activeModal: HTMLElement | null = null;
  private modalCleanup: (() => void) | null = null;
  private isMinimized = false;
  private isEditMode = false;
  private isVisible = false;
  private searchQuery = '';
  private currentPosition: MemeOverlayPosition = 'top-center';
  private memes: MemeItem[] = [];
  private callbacks: FloatingDockCallbacks;
  private firingTimers = new Map<string, any>();
  private anchor = { right: 20, bottom: 104 };
  private docClickHandler = () => this.closeContextMenu();
  private resizeHandler = () => this.applyAnchor();

  constructor(
    parent: HTMLElement,
    memes: MemeItem[],
    callbacks: FloatingDockCallbacks,
    initialPosition: MemeOverlayPosition = 'top-center',
    startMinimized = false
  ) {
    this.parent = parent;
    this.memes = memes;
    this.callbacks = callbacks;
    this.currentPosition = initialPosition;
    this.isMinimized = startMinimized;
    this.loadAnchor();
    this.createDom();
    this.render();
    document.addEventListener('click', this.docClickHandler);
    window.addEventListener('resize', this.resizeHandler);
  }

  // ---------- DOM construction ----------

  private createDom() {
    const deck = el('div', 'memecord-deck');
    deck.setAttribute('role', 'dialog');
    deck.setAttribute('aria-label', 'Memecord meme deck');

    // Header: brand, live status, edit + minimize
    const header = el('div', 'memecord-deck-header');
    header.title = 'Drag to move';

    const logo = el('img', 'memecord-deck-logo');
    logo.src = resolveAssetUrl('icons/logo.png');
    logo.alt = '';

    const heading = el('div', 'memecord-deck-heading');
    heading.appendChild(el('span', 'memecord-deck-title', 'Memecord'));

    const editBtn = this.iconButton('pencil', 'Edit keys & remove memes');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playHapticSound('pop');
      this.setEditMode(!this.isEditMode);
    });
    this.editBtn = editBtn;

    const minBtn = this.iconButton('minus', `Minimize (${getToggleShortcutText()})`);
    minBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setMinimized(true);
    });

    header.append(logo, heading, editBtn, minBtn);

    // View switch: your saved deck vs. the live trending feed
    const tabs = el('div', 'memecord-tabs');
    tabs.setAttribute('role', 'tablist');
    ([['mine', 'My memes'], ['trending', 'Trending']] as [DeckView, string][]).forEach(([view, label]) => {
      const tab = el('button', 'memecord-tab');
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
      if (view === 'trending') tab.innerHTML = icon('flame', 14);
      tab.appendChild(el('span', '', label));
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setView(view);
      });
      this.tabButtons.set(view, tab);
      tabs.appendChild(tab);
    });

    // Toolbar: search + add
    const toolbar = el('div', 'memecord-toolbar');
    const search = el('label', 'memecord-search');
    search.innerHTML = icon('search', 14);
    const searchInput = el('input');
    searchInput.type = 'search';
    searchInput.placeholder = 'Search memes';
    searchInput.setAttribute('aria-label', 'Search memes');
    searchInput.addEventListener('input', () => {
      this.searchQuery = searchInput.value.trim().toLowerCase();
      this.renderCards();
      if (this.view === 'trending') this.scheduleTrendingSearch();
    });
    this.searchInput = searchInput;
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        this.searchQuery = '';
        this.searchResults = [];
        this.renderCards();
        searchInput.blur();
      }
    });
    search.appendChild(searchInput);

    const addBtn = el('button', 'memecord-btn primary');
    addBtn.type = 'button';
    addBtn.innerHTML = `${icon('plus', 15)}<span>Add</span>`;
    addBtn.title = 'Add a GIF, image or video';
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playHapticSound('pop');
      this.setEditMode(false);
      this.callbacks.onAddMeme();
    });
    this.addBtn = addBtn;

    const refreshBtn = el('button', 'memecord-btn');
    refreshBtn.type = 'button';
    refreshBtn.innerHTML = icon('refresh', 15);
    refreshBtn.title = 'Refresh trending memes';
    refreshBtn.setAttribute('aria-label', 'Refresh trending memes');
    refreshBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.loadTrending(true);
    });
    this.refreshBtn = refreshBtn;
    toolbar.append(search, addBtn, refreshBtn);

    const trendingMeta = el('div', 'memecord-trending-meta');
    this.trendingMeta = trendingMeta;

    // Edit-mode banner
    const banner = el('div', 'memecord-edit-banner');
    banner.appendChild(el('span', '', 'Click a meme to change its key'));
    const doneBtn = el('button', 'memecord-btn primary', 'Done');
    doneBtn.type = 'button';
    doneBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setEditMode(false);
    });
    banner.appendChild(doneBtn);
    banner.style.display = 'none';
    this.editBanner = banner;

    // Grid
    const grid = el('div', 'memecord-grid');
    this.gridContainer = grid;

    // Footer: on-camera position + shortcut hint
    const footer = el('div', 'memecord-deck-footer');
    const posGroup = el('div', 'memecord-pos-group');
    posGroup.appendChild(el('span', 'memecord-pos-label', 'Position'));
    const screen = el('div', 'memecord-pos-screen');
    screen.setAttribute('role', 'radiogroup');
    screen.setAttribute('aria-label', 'Where memes appear on your video');
    POSITIONS.forEach((p) => {
      const spot = el('button', 'memecord-pos-spot');
      spot.type = 'button';
      spot.dataset.pos = p.key;
      spot.title = `Show memes: ${p.label}`;
      spot.setAttribute('role', 'radio');
      spot.setAttribute('aria-label', p.label);
      spot.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setPosition(p.key);
        this.callbacks.onPositionChange?.(p.key);
      });
      screen.appendChild(spot);
    });
    posGroup.appendChild(screen);

    const hint = el('span', 'memecord-shortcut-hint');
    hint.title = getToggleShortcutFullLabel();
    hint.appendChild(el('span', 'memecord-kbd', getToggleShortcutText()));
    hint.appendChild(el('span', '', 'hide'));
    footer.append(posGroup, hint);

    deck.append(header, tabs, toolbar, banner, trendingMeta, grid, footer);
    this.bindDropTarget(deck);
    this.bindDrag(deck, header);
    this.parent.appendChild(deck);
    this.element = deck;

    // Minimized pebble
    const pebble = el('button', 'memecord-pebble');
    pebble.type = 'button';
    pebble.title = `Open Memecord (${getToggleShortcutFullLabel()})`;
    const pebbleLogo = el('span', 'memecord-pebble-logo');
    const pebbleImg = el('img');
    pebbleImg.src = resolveAssetUrl('icons/logo.png');
    pebbleImg.alt = '';
    pebbleLogo.append(pebbleImg, el('span', 'memecord-dot'));
    pebble.append(pebbleLogo, el('span', '', 'Memes'), el('span', 'memecord-kbd', getToggleShortcutText()));
    pebble.addEventListener('click', (e) => {
      e.stopPropagation();
      if (pebble.dataset.dragged === '1') {
        pebble.dataset.dragged = '';
        return;
      }
      this.setMinimized(false);
    });
    this.bindDrag(pebble, pebble);
    this.parent.appendChild(pebble);
    this.pebble = pebble;

    this.setPosition(this.currentPosition);
    this.setView('mine');
    this.applyAnchor();
  }

  private iconButton(name: Parameters<typeof icon>[0], label: string): HTMLButtonElement {
    const btn = el('button', 'memecord-icon-btn');
    btn.type = 'button';
    btn.title = label;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = icon(name, 16);
    return btn;
  }

  // ---------- Public API ----------

  public updateMemes(memes: MemeItem[]) {
    this.memes = memes;
    this.renderCards();
  }

  public setPosition(pos: MemeOverlayPosition) {
    this.currentPosition = pos;
    this.element?.querySelectorAll<HTMLElement>('.memecord-pos-spot').forEach((spot) => {
      const active = spot.dataset.pos === pos;
      spot.classList.toggle('active', active);
      spot.setAttribute('aria-checked', String(active));
    });
  }

  /** Kept for callers; the HUD no longer shows camera state (memes reach the call with the camera off too) */
  public setCallMode(_mode: CallMode) {}

  /** Highlights a card with a countdown bar while its meme is on screen */
  public markFiring(memeId: string, durationMs: number) {
    const card = this.gridContainer?.querySelector<HTMLElement>(`.memecord-card[data-meme-id="${CSS.escape(memeId)}"]`);
    this.firingTimers.forEach((timer, id) => {
      clearTimeout(timer);
      this.gridContainer
        ?.querySelector(`.memecord-card[data-meme-id="${CSS.escape(id)}"]`)
        ?.classList.remove('firing');
    });
    this.firingTimers.clear();
    if (!card) return;

    card.style.setProperty('--mc-dur', `${durationMs}ms`);
    card.classList.remove('firing');
    void card.offsetWidth; // restart the countdown animation
    card.classList.add('firing');
    this.firingTimers.set(
      memeId,
      setTimeout(() => {
        card.classList.remove('firing');
        this.firingTimers.delete(memeId);
      }, durationMs)
    );
  }

  public isModalOpen(): boolean {
    return Boolean(this.activeModal);
  }

  public setVisible(visible: boolean) {
    this.isVisible = visible;
    if (!visible) {
      this.closeActiveModal();
      this.closeContextMenu();
    }
    this.render();
  }

  public setMinimized(minimized: boolean, userInitiated = true) {
    if (this.isMinimized === minimized) return;
    this.isMinimized = minimized;

    if (minimized) {
      this.closeActiveModal();
      this.closeContextMenu();
      this.setEditMode(false);
    }
    if (userInitiated) {
      playHapticSound(minimized ? 'minimize' : 'expand');
      this.callbacks.onMinimizedChange?.(minimized);
    }

    if (!minimized && this.element && this.isVisible) {
      this.element.classList.remove('entering');
      void this.element.offsetWidth;
      this.element.classList.add('entering');
      setTimeout(() => this.element?.classList.remove('entering'), 260);
    }
    this.render();
  }

  public toggleMinimize() {
    this.setMinimized(!this.isMinimized);
  }

  private render() {
    if (this.element) {
      this.element.style.display = this.isVisible && !this.isMinimized ? 'flex' : 'none';
    }
    if (this.pebble) {
      this.pebble.style.display = this.isVisible && this.isMinimized ? 'flex' : 'none';
    }
    this.applyAnchor();
  }

  // ---------- Views ----------

  private setView(view: DeckView) {
    this.view = view;
    if (view === 'trending') this.setEditMode(false);
    this.tabButtons.forEach((btn, v) => {
      btn.classList.toggle('active', v === view);
      btn.setAttribute('aria-selected', String(v === view));
    });
    if (this.addBtn) this.addBtn.style.display = view === 'mine' ? '' : 'none';
    if (this.refreshBtn) this.refreshBtn.style.display = view === 'trending' ? '' : 'none';
    if (this.editBtn) this.editBtn.style.visibility = view === 'mine' ? 'visible' : 'hidden';
    if (this.searchInput) {
      this.searchInput.placeholder = view === 'trending' ? 'Search trending & GIFs' : 'Search memes';
    }
    this.searchResults = [];
    if (view === 'trending' && this.searchQuery) this.scheduleTrendingSearch();
    if (view === 'trending' && !this.trendingFeed && !this.trendingLoading) {
      this.loadTrending(false);
    }
    this.renderTrendingMeta();
    this.renderCards();
    if (this.gridContainer) this.gridContainer.scrollTop = 0;
  }

  private async loadTrending(force: boolean) {
    if (!this.callbacks.onLoadTrending || this.trendingLoading) return;
    this.trendingLoading = true;
    this.trendingError = '';
    this.refreshBtn?.classList.add('spinning');
    this.renderTrendingMeta();
    if (this.view === 'trending') this.renderCards();
    try {
      this.trendingFeed = await this.callbacks.onLoadTrending(force);
      this.usage = this.trendingFeed.usage;
      if (!this.trendingFeed.memes.length) {
        this.trendingError = this.trendingFeed.errors.join('\n') || 'The sources returned no usable memes right now.';
      }
    } catch (err: any) {
      this.trendingError = err?.message || 'Could not load trending memes.';
    } finally {
      this.trendingLoading = false;
      this.refreshBtn?.classList.remove('spinning');
      this.renderTrendingMeta();
      if (this.view === 'trending') this.renderCards();
    }
  }

  private scheduleTrendingSearch() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    const query = this.searchQuery;
    const token = ++this.searchToken;
    this.searchError = '';
    if (query.length < 2 || !this.callbacks.onSearchTrending) {
      this.searchResults = [];
      this.renderTrendingMeta();
      return;
    }
    this.searchTimer = setTimeout(async () => {
      try {
        const result = await this.callbacks.onSearchTrending!(query);
        if (token !== this.searchToken || this.view !== 'trending') return;
        this.searchResults = result?.memes || [];
        if (result?.usage) this.usage = result.usage;
      } catch (err: any) {
        if (token !== this.searchToken) return;
        this.searchResults = [];
        this.searchError = err?.message || 'GIPHY search failed';
      }
      this.renderTrendingMeta();
      this.renderCards();
    }, 400);
  }

  private renderTrendingMeta() {
    const meta = this.trendingMeta;
    if (!meta) return;
    meta.style.display = this.view === 'trending' ? 'flex' : 'none';
    meta.innerHTML = '';
    if (this.view !== 'trending') return;

    const feed = this.trendingFeed;
    if (this.trendingLoading && !feed) {
      meta.appendChild(el('span', '', 'Loading what\'s hot…'));
      return;
    }
    if (!feed) return;
    const labels = feed.sources.map((s) => (s === 'giphy' ? 'GIPHY' : 'Reddit'));
    if (labels.length) meta.appendChild(el('span', '', `Hot on ${labels.join(' + ')} · ${timeAgo(feed.fetchedAt)}`));

    // Free-key allowance: always visible so a hit limit never comes as a surprise
    if (this.usage) {
      const level = this.usage.remaining === 0 ? 'out' : this.usage.remaining <= 20 ? 'low' : '';
      meta.appendChild(el('span', `memecord-usage ${level}`, describeGiphyUsage(this.usage)));
    } else {
      meta.appendChild(el('span', 'memecord-trending-tip', 'Add a GIPHY key in settings for trending GIFs'));
    }
    meta.appendChild(el('span', 'memecord-trending-tip', 'Reddit feed (meme-api.com): no published limit'));

    // With an empty grid the errors are already spelled out below, so only list them for partial feeds
    const shownErrors = feed.memes.length ? feed.errors : [];
    [...shownErrors, ...(this.searchError ? [this.searchError] : [])].forEach((message) => {
      const line = el('span', 'memecord-trending-error', message);
      line.setAttribute('role', 'alert');
      meta.appendChild(line);
    });
  }

  // ---------- Cards ----------

  private renderCards() {
    if (!this.gridContainer) return;
    if (this.view === 'trending') {
      this.renderTrendingCards();
      return;
    }
    this.gridContainer.innerHTML = '';

    const indexed = this.memes.map((meme, index) => ({ meme, key: hotkeyFor(meme, index) }));
    const filtered = indexed.filter(({ meme, key }) => {
      if (!this.searchQuery) return true;
      return meme.name.toLowerCase().includes(this.searchQuery) || key.toLowerCase() === this.searchQuery;
    });

    if (filtered.length === 0 && this.searchQuery) {
      const empty = el('div', 'memecord-empty');
      empty.appendChild(el('strong', '', 'No matches'));
      empty.appendChild(el('span', '', `Nothing called "${this.searchQuery}" yet.`));
      this.gridContainer.appendChild(empty);
      return;
    }

    filtered.forEach(({ meme, key }) => {
      const card = el('button', 'memecord-card');
      card.type = 'button';
      card.dataset.memeId = meme.id;
      card.title = this.isEditMode ? `Change key for "${meme.name}"` : `Show "${meme.name}" (press ${key || 'no key'})`;
      card.setAttribute('aria-label', this.isEditMode ? `Change key for ${meme.name}` : `Show ${meme.name}`);

      const thumb = el('span', 'memecord-card-thumb');
      thumb.appendChild(createMediaThumb(meme.assetUrl, meme.name));
      if (key) thumb.appendChild(el('span', 'memecord-keycap', key));
      thumb.appendChild(el('span', 'memecord-card-progress'));
      card.appendChild(thumb);
      card.appendChild(el('span', 'memecord-card-name', meme.name));

      if (this.isEditMode) {
        const remove = el('span', 'memecord-card-remove');
        remove.setAttribute('role', 'button');
        remove.setAttribute('aria-label', `Remove ${meme.name}`);
        remove.title = `Remove "${meme.name}"`;
        remove.innerHTML = icon('x', 13);
        remove.addEventListener('click', (e) => {
          e.stopPropagation();
          playHapticSound('delete');
          this.callbacks.onDeleteMeme(meme.id);
        });
        card.appendChild(remove);
      }

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        playHapticSound('pop');
        if (this.isEditMode) {
          this.openKeybindingModal(meme);
        } else {
          this.callbacks.onTriggerMeme(meme);
        }
      });

      card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openContextMenu(e.clientX, e.clientY, meme, key);
      });

      this.gridContainer!.appendChild(card);
    });

    if (!this.searchQuery) {
      const addTile = el('button', 'memecord-card add-tile');
      addTile.type = 'button';
      addTile.title = 'Add a GIF, image or video — or drop one on the deck';
      const tileThumb = el('span', 'memecord-card-thumb');
      tileThumb.innerHTML = `${icon('plus', 20)}<span>Add meme</span>`;
      addTile.appendChild(tileThumb);
      addTile.appendChild(el('span', 'memecord-card-name', 'Drop a GIF here'));
      addTile.addEventListener('click', (e) => {
        e.stopPropagation();
        playHapticSound('pop');
        this.setEditMode(false);
        this.callbacks.onAddMeme();
      });
      this.gridContainer.appendChild(addTile);
    }
  }

  private renderTrendingCards() {
    const grid = this.gridContainer!;
    grid.innerHTML = '';

    const feedMemes = this.trendingFeed?.memes || [];
    const q = this.searchQuery;
    const local = q ? feedMemes.filter((m) => m.name.toLowerCase().includes(q)) : feedMemes;
    const seen = new Set(local.map((m) => m.id));
    const memes = [...local, ...this.searchResults.filter((m) => !seen.has(m.id))];

    if (memes.length === 0) {
      const empty = el('div', 'memecord-empty');
      if (this.trendingLoading) {
        for (let i = 0; i < 6; i++) grid.appendChild(el('div', 'memecord-skeleton'));
        return;
      }
      if (q) {
        empty.appendChild(el('strong', '', this.searchError ? 'GIPHY search failed' : 'No matches'));
        empty.appendChild(el('span', this.searchError ? 'memecord-trending-error' : '', this.searchError || `Nothing trending for "${q}".`));
      } else {
        empty.appendChild(el('strong', '', 'Couldn\'t load trending memes'));
        (this.trendingError || 'Check your connection and try again.').split('\n').forEach((line) => {
          const err = el('span', 'memecord-trending-error', line);
          err.setAttribute('role', 'alert');
          empty.appendChild(err);
        });
        const retry = el('button', 'memecord-btn', 'Try again');
        retry.type = 'button';
        retry.addEventListener('click', (e) => {
          e.stopPropagation();
          this.loadTrending(true);
        });
        empty.appendChild(retry);
      }
      grid.appendChild(empty);
      return;
    }

    memes.forEach((meme) => {
      const card = el('button', 'memecord-card trending');
      card.type = 'button';
      card.dataset.memeId = meme.id;
      card.title = `Show "${meme.name}" now`;
      card.setAttribute('aria-label', `Show ${meme.name}`);

      const thumb = el('span', 'memecord-card-thumb');
      thumb.appendChild(createMediaThumb(meme.thumbUrl || meme.assetUrl, meme.name));
      thumb.appendChild(el('span', `memecord-source-tag ${meme.source}`, meme.source === 'giphy' ? 'GIF' : 'Reddit'));
      thumb.appendChild(el('span', 'memecord-card-progress'));

      const save = el('span', 'memecord-card-save');
      save.setAttribute('role', 'button');
      save.setAttribute('aria-label', `Save ${meme.name} to my memes`);
      save.title = 'Save to my memes with a key';
      save.innerHTML = icon('plus', 14);
      save.addEventListener('click', (e) => {
        e.stopPropagation();
        playHapticSound('pop');
        this.callbacks.onAddMeme({ url: meme.assetUrl, name: meme.name });
      });
      thumb.appendChild(save);

      card.appendChild(thumb);
      card.appendChild(el('span', 'memecord-card-name', meme.name));
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        playHapticSound('pop');
        this.callbacks.onTriggerTrending?.(meme);
      });
      grid.appendChild(card);
    });

    if (this.trendingFeed?.sources.includes('giphy') || this.searchResults.length) {
      grid.appendChild(el('div', 'memecord-attribution', 'Powered by GIPHY'));
    }
  }

  private setEditMode(on: boolean) {
    if (this.isEditMode === on) return;
    this.isEditMode = on;
    this.element?.classList.toggle('edit-mode', on);
    this.editBtn?.classList.toggle('active', on);
    this.editBtn?.setAttribute('aria-pressed', String(on));
    if (this.editBanner) this.editBanner.style.display = on ? 'flex' : 'none';
    this.renderCards();
  }

  // ---------- Keybinding modal ----------

  public openKeybindingModal(meme: MemeItem) {
    this.closeActiveModal();
    this.closeContextMenu();

    const memeIndex = this.memes.findIndex((m) => m.id === meme.id);
    const currentKey = hotkeyFor(meme, Math.max(0, memeIndex));
    let selectedKey = currentKey;
    const owner = (k: string) =>
      this.memes.find((m, idx) => m.id !== meme.id && hotkeyFor(m, idx) === k);

    const backdrop = el('div', 'memecord-modal-backdrop');
    backdrop.dataset.memecordModal = 'rebind';
    const modal = el('div', 'memecord-modal');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', `Change key for ${meme.name}`);

    const head = el('div', 'memecord-modal-head');
    const target = el('div', 'memecord-rebind-target');
    target.appendChild(createMediaThumb(meme.assetUrl, meme.name, 'memecord-preview-media'));
    const titleWrap = el('div');
    titleWrap.appendChild(el('h2', '', 'Change key'));
    titleWrap.appendChild(el('p', '', meme.name));
    target.appendChild(titleWrap);
    const closeBtn = this.iconButton('x', 'Close');
    head.append(target, closeBtn);

    const capture = el('div', 'memecord-key-capture');
    const keyEl = el('span', 'memecord-key-capture-key', selectedKey || '–');
    capture.append(keyEl, el('span', 'memecord-key-capture-hint', 'Press any letter or number key'));

    const status = el('div', 'memecord-hint');

    const grid = el('div', 'memecord-key-grid');
    KEY_OPTIONS.forEach((k) => {
      const takenBy = owner(k);
      const btn = el('button', `memecord-key-option${takenBy ? ' taken' : ''}`, k);
      btn.type = 'button';
      btn.dataset.key = k;
      btn.title = takenBy ? `Used by "${takenBy.name}"` : 'Available';
      grid.appendChild(btn);
    });

    const actions = el('div', 'memecord-modal-actions');
    const cancelBtn = el('button', 'memecord-btn', 'Cancel');
    cancelBtn.type = 'button';
    const saveBtn = el('button', 'memecord-btn primary', 'Save');
    saveBtn.type = 'button';
    actions.append(cancelBtn, saveBtn);

    modal.append(head, capture, status, grid, actions);
    backdrop.appendChild(modal);

    const selectKey = (k: string) => {
      selectedKey = k.toUpperCase();
      keyEl.textContent = selectedKey;
      grid.querySelectorAll<HTMLElement>('.memecord-key-option').forEach((b) => {
        b.classList.toggle('active', b.dataset.key === selectedKey);
      });
      const clash = owner(selectedKey);
      capture.classList.toggle('clash', Boolean(clash));
      saveBtn.disabled = Boolean(clash);
      if (clash) {
        status.textContent = `${selectedKey} is already used by "${clash.name}".`;
        status.className = 'memecord-hint error';
      } else {
        status.textContent = selectedKey === currentKey ? 'This is the current key.' : `${selectedKey} is free.`;
        status.className = 'memecord-hint success';
      }
    };
    selectKey(selectedKey);

    const save = () => {
      if (!selectedKey || owner(selectedKey)) {
        playHapticSound('delete');
        return;
      }
      if (selectedKey !== currentKey) {
        this.callbacks.onUpdateHotkey?.(meme.id, selectedKey);
      }
      playHapticSound('pop');
      this.closeActiveModal();
    };

    grid.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('.memecord-key-option');
      if (btn?.dataset.key) {
        e.stopPropagation();
        selectKey(btn.dataset.key);
      }
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this.closeActiveModal();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        save();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length === 1 && /[a-z0-9]/i.test(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        selectKey(e.key);
      }
    };

    closeBtn.addEventListener('click', () => this.closeActiveModal());
    cancelBtn.addEventListener('click', () => this.closeActiveModal());
    saveBtn.addEventListener('click', save);
    backdrop.addEventListener('mousedown', (e) => {
      if (e.target === backdrop) this.closeActiveModal();
    });

    window.addEventListener('keydown', onKeyDown, true);
    this.parent.appendChild(backdrop);
    this.activeModal = backdrop;
    this.modalCleanup = () => window.removeEventListener('keydown', onKeyDown, true);
    saveBtn.focus();
  }

  private closeActiveModal() {
    this.modalCleanup?.();
    this.modalCleanup = null;
    this.activeModal?.remove();
    this.activeModal = null;
  }

  // ---------- Context menu ----------

  private openContextMenu(x: number, y: number, meme: MemeItem, key: string) {
    this.closeContextMenu();
    const menu = el('div', 'memecord-context-menu');
    menu.setAttribute('role', 'menu');

    const addItem = (iconName: Parameters<typeof icon>[0], label: string, onClick: () => void, opts: { danger?: boolean; kbd?: string } = {}) => {
      const item = el('button', `memecord-menu-item${opts.danger ? ' danger' : ''}`);
      item.type = 'button';
      item.setAttribute('role', 'menuitem');
      item.innerHTML = icon(iconName, 15);
      item.appendChild(el('span', '', label));
      if (opts.kbd) item.appendChild(el('span', 'memecord-kbd', opts.kbd));
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeContextMenu();
        onClick();
      });
      menu.appendChild(item);
    };

    addItem('play', 'Show now', () => this.callbacks.onTriggerMeme(meme), { kbd: key || undefined });
    addItem('keyboard', 'Change key', () => this.openKeybindingModal(meme));
    addItem('trash', 'Remove', () => {
      playHapticSound('delete');
      this.callbacks.onDeleteMeme(meme.id);
    }, { danger: true });

    this.parent.appendChild(menu);
    const rect = menu.getBoundingClientRect();
    menu.style.left = `${Math.min(x, window.innerWidth - rect.width - EDGE_GAP)}px`;
    menu.style.top = `${Math.min(y, window.innerHeight - rect.height - EDGE_GAP)}px`;
    this.contextMenu = menu;
  }

  private closeContextMenu() {
    this.contextMenu?.remove();
    this.contextMenu = null;
  }

  // ---------- Drop GIFs / links onto the deck ----------

  private bindDropTarget(deck: HTMLElement) {
    let depth = 0;
    const hasPayload = (e: DragEvent) => {
      const types = Array.from(e.dataTransfer?.types || []);
      return types.includes('Files') || types.includes('text/uri-list');
    };

    deck.addEventListener('dragenter', (e) => {
      if (!hasPayload(e)) return;
      e.preventDefault();
      depth++;
      deck.classList.add('drop-target');
    });
    deck.addEventListener('dragover', (e) => {
      if (!hasPayload(e)) return;
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    });
    deck.addEventListener('dragleave', () => {
      depth = Math.max(0, depth - 1);
      if (depth === 0) deck.classList.remove('drop-target');
    });
    deck.addEventListener('drop', (e) => {
      if (!hasPayload(e)) return;
      e.preventDefault();
      depth = 0;
      deck.classList.remove('drop-target');
      const file = Array.from(e.dataTransfer?.files || []).find((f) => /^(image|video)\//.test(f.type));
      const url = (e.dataTransfer?.getData('text/uri-list') || '').split('\n').find((l) => l && !l.startsWith('#'));
      if (file || url) {
        this.setEditMode(false);
        this.callbacks.onAddMeme(file ? { file } : { url: url!.trim() });
      }
    });
  }

  // ---------- Dragging & anchoring (anchored by bottom-right corner) ----------

  private bindDrag(target: HTMLElement, handle: HTMLElement) {
    handle.addEventListener('mousedown', (e: MouseEvent) => {
      if (e.button !== 0) return;
      const hit = e.target as HTMLElement;
      if (handle !== target && hit.closest('button, input')) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const start = { ...this.anchor };
      let moved = false;

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (!moved && Math.abs(dx) + Math.abs(dy) < 4) return;
        moved = true;
        this.anchor = { right: start.right - dx, bottom: start.bottom - dy };
        this.applyAnchor(target);
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if (moved) {
          if (target === this.pebble) target.dataset.dragged = '1';
          this.anchor = this.applyAnchor(target);
          this.saveAnchor();
        }
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      if (handle !== target) e.preventDefault();
    });
  }

  /** Clamps the shared anchor so the visible element stays fully on screen */
  private applyAnchor(measureEl?: HTMLElement): { right: number; bottom: number } {
    const visibleEl =
      measureEl || (this.isMinimized ? this.pebble : this.element);
    const w = visibleEl?.offsetWidth || 0;
    const h = visibleEl?.offsetHeight || 0;
    const maxRight = Math.max(EDGE_GAP, window.innerWidth - w - EDGE_GAP);
    const maxBottom = Math.max(EDGE_GAP, window.innerHeight - h - EDGE_GAP);
    const right = Math.round(Math.min(maxRight, Math.max(EDGE_GAP, this.anchor.right)));
    const bottom = Math.round(Math.min(maxBottom, Math.max(EDGE_GAP, this.anchor.bottom)));

    [this.element, this.pebble].forEach((node) => {
      if (!node) return;
      node.style.right = `${right}px`;
      node.style.bottom = `${bottom}px`;
    });
    return { right, bottom };
  }

  private loadAnchor() {
    try {
      const saved = JSON.parse(localStorage.getItem(ANCHOR_STORAGE_KEY) || 'null');
      if (saved && typeof saved.right === 'number' && typeof saved.bottom === 'number') {
        this.anchor = { right: saved.right, bottom: saved.bottom };
      }
    } catch (_) {}
  }

  private saveAnchor() {
    try {
      localStorage.setItem(ANCHOR_STORAGE_KEY, JSON.stringify(this.anchor));
    } catch (_) {}
  }

  public destroy() {
    this.closeContextMenu();
    this.closeActiveModal();
    this.firingTimers.forEach((t) => clearTimeout(t));
    this.firingTimers.clear();
    if (this.searchTimer) clearTimeout(this.searchTimer);
    document.removeEventListener('click', this.docClickHandler);
    window.removeEventListener('resize', this.resizeHandler);
    this.element?.remove();
    this.element = null;
    this.pebble?.remove();
    this.pebble = null;
  }
}

function timeAgo(ts: number): string {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.round(mins / 60)}h ago`;
}
