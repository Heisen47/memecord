import { AppSettings, MemeItem } from './types';
import { DEFAULT_SETTINGS } from './config';

const STORAGE_KEY = 'mememeet_settings';

export async function getSettings(): Promise<AppSettings> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      const data = result ? (result[STORAGE_KEY] as Partial<AppSettings> | undefined) : undefined;
      if (data) {
        return {
          ...DEFAULT_SETTINGS,
          ...data,
          memes: Array.isArray(data.memes) && data.memes.length > 0 ? data.memes : DEFAULT_SETTINGS.memes
        };
      }
    } else if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
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
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [STORAGE_KEY]: updated });
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.error('[Memecord] Failed to save settings:', err);
  }

  return updated;
}

export async function addMeme(meme: MemeItem): Promise<AppSettings> {
  const current = await getSettings();
  const existingIndex = current.memes.findIndex((m) => m.id === meme.id);
  let updatedMemes: MemeItem[];
  if (existingIndex >= 0) {
    updatedMemes = [...current.memes];
    updatedMemes[existingIndex] = meme;
  } else {
    updatedMemes = [...current.memes, meme];
  }
  return saveSettings({ memes: updatedMemes });
}

export async function removeMeme(memeId: string): Promise<AppSettings> {
  const current = await getSettings();
  const updatedMemes = current.memes.filter((m) => m.id !== memeId);
  return saveSettings({ memes: updatedMemes });
}
