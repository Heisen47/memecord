import { AppSettings, MemeItem } from './types';

export const DEFAULT_MEMES: MemeItem[] = [
  { id: 'thumbs_up', name: 'Thumbs Up', emoji: '👍', assetUrl: 'memes/thumbs-up.gif', hotkey: '1', durationMs: 2500 },
  { id: 'victory', name: 'Peace / Victory', emoji: '✌️', assetUrl: 'memes/victory.gif', hotkey: '2', durationMs: 2500 },
  { id: 'stop', name: 'Wait / Hold Up', emoji: '🖐', assetUrl: 'memes/stop.gif', hotkey: '3', durationMs: 2500 },
  { id: 'cinema', name: 'Absolute Cinema', emoji: '🙌', assetUrl: 'memes/absolute-cinema.gif', hotkey: '4', durationMs: 3000 },
  { id: 'rock_on', name: 'Rock On / Headbang', emoji: '🤘', assetUrl: 'memes/rock-on.gif', hotkey: '5', durationMs: 2500 },
  { id: 'pointing', name: 'Big Brain / Roll Safe', emoji: '☝️', assetUrl: 'memes/pointing.gif', hotkey: '6', durationMs: 2500 },
  { id: 'noice', name: 'Noice (Michael Rosen)', emoji: '👌', assetUrl: 'memes/noice.gif', hotkey: '7', durationMs: 2200 },
  { id: 'fist', name: 'Arthur Fist', emoji: '✊', assetUrl: 'memes/fist.gif', hotkey: '8', durationMs: 2500 },
  { id: 'perfection', name: 'Chef Kiss / Perfection', emoji: '✨', assetUrl: 'memes/perfection.gif', hotkey: '9', durationMs: 2500 }
];

export const PRESET_LIBRARY: MemeItem[] = [
  ...DEFAULT_MEMES,
  { id: 'cat_vibing', name: 'Cat Vibing', emoji: '🐱', assetUrl: 'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif' },
  { id: 'popcat', name: 'Pop Cat', emoji: '😺', assetUrl: 'https://media.giphy.com/media/S604D5NhkhvHT8Rwja/giphy.gif' },
  { id: 'this_is_fine', name: 'This Is Fine', emoji: '🔥', assetUrl: 'https://media.giphy.com/media/9M5jK4GXmD5o1irGrF/giphy.gif' },
  { id: 'confused_travolta', name: 'Confused Travolta', emoji: '🤷', assetUrl: 'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif' },
  { id: 'drake_yes', name: 'Drake Approves', emoji: '😎', assetUrl: 'https://media.giphy.com/media/wWue0rCDOphOE/giphy.gif' },
  { id: 'leonardo_cheers', name: 'Gatsby Toast', emoji: '🥂', assetUrl: 'https://media.giphy.com/media/GCLlQnV7dXZ2E/giphy.gif' }
];

export const DEFAULT_SETTINGS: AppSettings = {
  enabled: true,
  dockVisible: true,
  defaultDurationMs: 2500,
  position: 'top-center',
  soundEnabled: true,
  memes: DEFAULT_MEMES
};
