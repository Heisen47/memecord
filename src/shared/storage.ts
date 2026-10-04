import { AppSettings } from './types';
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
          memes: {
            ...DEFAULT_SETTINGS.memes,
            ...(data.memes || {})
          }
        };
      }
    } else if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return {
          ...DEFAULT_SETTINGS,
          ...JSON.parse(raw)
        };
      }
    }
  } catch (err) {
    console.warn('[MemeMeet] Failed to read settings, using defaults:', err);
  }
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const updated: AppSettings = {
    ...current,
    ...settings,
    memes: {
      ...current.memes,
      ...(settings.memes || {})
    }
  };

  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [STORAGE_KEY]: updated });
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.error('[MemeMeet] Failed to save settings:', err);
  }

  return updated;
}
