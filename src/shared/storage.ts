import { AppSettings, MemeItem } from './types';
import { DEFAULT_SETTINGS } from './config';
import { assignDefaultHotkey } from './media-resolver';

const STORAGE_KEY = 'memecord_settings';
const LEGACY_KEY = 'mememeet_settings';

// Lightweight IndexedDB helper for unlimited web/fallback persistence
function openIDB(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open('memecord_db', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (_) {
      resolve(null);
    }
  });
}

async function idbGet<T>(key: string): Promise<T | null> {
  const db = await openIDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction('settings', 'readonly');
      const store = tx.objectStore('settings');
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => resolve(null);
    } catch (_) {
      resolve(null);
    }
  });
}

async function idbSet<T>(key: string, val: T): Promise<boolean> {
  const db = await openIDB();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const req = store.put(val, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch (_) {
      resolve(false);
    }
  });
}

export async function getSettings(): Promise<AppSettings> {
  try {
    // 1. Chrome Extension Storage
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const result = await chrome.storage.local.get([STORAGE_KEY, LEGACY_KEY]);
      let data = result ? (result[STORAGE_KEY] as Partial<AppSettings> | undefined) : undefined;
      
      // Migrate legacy mememeet data if needed
      if (!data && result && result[LEGACY_KEY]) {
        data = result[LEGACY_KEY] as Partial<AppSettings>;
        try {
          await chrome.storage.local.set({ [STORAGE_KEY]: data });
          await chrome.storage.local.remove(LEGACY_KEY);
        } catch (_) {}
      }

      if (data) {
        return {
          ...DEFAULT_SETTINGS,
          ...data,
          memes: Array.isArray(data.memes) && data.memes.length > 0 ? data.memes : DEFAULT_SETTINGS.memes
        };
      }
    }

    // 2. IndexedDB (Web / TestLab / Sandbox)
    const idbData = await idbGet<Partial<AppSettings>>(STORAGE_KEY);
    if (idbData) {
      return {
        ...DEFAULT_SETTINGS,
        ...idbData,
        memes: Array.isArray(idbData.memes) && idbData.memes.length > 0 ? idbData.memes : DEFAULT_SETTINGS.memes
      };
    }

    // 3. LocalStorage Fallback (with legacy migration)
    if (typeof localStorage !== 'undefined') {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        raw = localStorage.getItem(LEGACY_KEY);
        if (raw) {
          localStorage.setItem(STORAGE_KEY, raw);
          localStorage.removeItem(LEGACY_KEY);
        }
      }
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          memes: Array.isArray(parsed.memes) && parsed.memes.length > 0 ? parsed.memes : DEFAULT_SETTINGS.memes
        };
      }
    }
  } catch (err) {
    console.warn('[Memecord] Failed to read settings, using defaults:', err);
  }
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const updated: AppSettings = {
    ...current,
    ...settings
  };

  try {
    // 1. Chrome Extension Storage
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [STORAGE_KEY]: updated });
    }

    // 2. Always persist to IndexedDB for safety
    await idbSet(STORAGE_KEY, updated);

    // 3. LocalStorage as tertiary fallback
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (storageErr) {
        // Quota exceeded in localStorage is fine since IndexedDB has it saved safely
        console.warn('[Memecord] LocalStorage quota exceeded, persisted via IndexedDB:', storageErr);
      }
    }
  } catch (err) {
    console.error('[Memecord] Failed to save settings:', err);
  }

  return updated;
}

export function findClashingMeme(
  memes: MemeItem[],
  hotkey: string,
  currentMemeId?: string
): MemeItem | undefined {
  const cleanKey = hotkey.trim().toUpperCase();
  if (!cleanKey) return undefined;
  return memes.find((m, idx) => {
    if (m.id === currentMemeId) return false;
    const existingKey = (m.hotkey || assignDefaultHotkey(idx)).trim().toUpperCase();
    return existingKey === cleanKey;
  });
}

export async function addMeme(meme: MemeItem): Promise<AppSettings> {
  const current = await getSettings();
  const cleanKey = (meme.hotkey || '').trim().toUpperCase();
  if (cleanKey) {
    const clashing = findClashingMeme(current.memes, cleanKey, meme.id);
    if (clashing) {
      throw new Error(`Key [${cleanKey}] is already assigned to "${clashing.name}". Change old one first.`);
    }
  }
  const existingIndex = current.memes.findIndex((m) => m.id === meme.id);
  let updatedMemes: MemeItem[];
  if (existingIndex >= 0) {
    updatedMemes = [...current.memes];
    updatedMemes[existingIndex] = { ...meme, hotkey: cleanKey };
  } else {
    updatedMemes = [...current.memes, { ...meme, hotkey: cleanKey }];
  }
  return saveSettings({ memes: updatedMemes });
}

export async function removeMeme(memeId: string): Promise<AppSettings> {
  const current = await getSettings();
  const updatedMemes = current.memes.filter((m) => m.id !== memeId);
  return saveSettings({ memes: updatedMemes });
}

export async function updateMemeHotkey(memeId: string, newHotkey: string): Promise<AppSettings> {
  const current = await getSettings();
  const cleanKey = newHotkey.trim().toUpperCase();
  if (!cleanKey) {
    throw new Error('Key cannot be empty');
  }
  const clashing = findClashingMeme(current.memes, cleanKey, memeId);
  if (clashing) {
    throw new Error(`Key [${cleanKey}] is already assigned to "${clashing.name}". Change old one first.`);
  }
  const updatedMemes = current.memes.map((m) => {
    if (m.id === memeId) {
      return { ...m, hotkey: cleanKey };
    }
    return m;
  });
  return saveSettings({ memes: updatedMemes });
}


