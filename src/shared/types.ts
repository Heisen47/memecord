export interface MemeItem {
  id: string;
  name: string;
  emoji: string;
  assetUrl: string;
  hotkey?: string; // e.g. "1", "2", "3", etc.
  durationMs?: number;
}

export type MemeOverlayPosition = 'top-center' | 'center' | 'bottom-right' | 'top-right';

export interface AppSettings {
  enabled: boolean;
  dockVisible: boolean;
  defaultDurationMs: number;
  position: MemeOverlayPosition;
  soundEnabled: boolean;
  memes: MemeItem[];
}

export type ExtensionMessage =
  | { type: 'GET_SETTINGS' }
  | { type: 'SETTINGS_RESPONSE'; payload: AppSettings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'TRIGGER_MEME'; memeId: string }
  | { type: 'TRIGGER_MEME_ITEM'; meme: MemeItem }
  | { type: 'TOGGLE_DOCK' };
