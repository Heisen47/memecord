import { AppSettings, GestureType } from './types';

export interface PresetMeme {
  id: string;
  name: string;
  emoji: string;
  asset: string;
}

export const PRESET_MEMES: PresetMeme[] = [
  { id: 'cinema', name: 'Absolute Cinema', emoji: '🙌', asset: 'memes/absolute-cinema.gif' },
  { id: 'noice', name: 'Noice (Michael Rosen)', emoji: '👌', asset: 'memes/noice.gif' },
  { id: 'fist', name: 'Arthur Fist', emoji: '✊', asset: 'memes/fist.gif' },
  { id: 'rock_on', name: 'Rock On / Headbang', emoji: '🤘', asset: 'memes/rock-on.gif' },
  { id: 'pointing', name: 'Roll Safe / Big Brain', emoji: '☝️', asset: 'memes/pointing.gif' },
  { id: 'perfection', name: 'Chef Kiss / Perfection', emoji: '✨', asset: 'memes/perfection.gif' },
  { id: 'thumbs_up', name: 'Thumbs Up', emoji: '👍', asset: 'memes/thumbs-up.gif' },
  { id: 'victory', name: 'Victory / Peace', emoji: '✌️', asset: 'memes/victory.gif' },
  { id: 'stop', name: 'Open Palm Stop', emoji: '🖐', asset: 'memes/stop.gif' }
];

export const GESTURE_DEFINITIONS: Array<{
  key: Exclude<GestureType, 'none'>;
  emoji: string;
  name: string;
  description: string;
}> = [
  { key: 'thumbs_up', emoji: '👍', name: 'Thumbs Up', description: 'Thumb up, 4 fingers curled' },
  { key: 'victory', emoji: '✌️', name: 'Victory', description: 'Index & middle extended in V' },
  { key: 'open_palm', emoji: '🖐', name: 'Open Palm', description: 'All 5 fingers extended & spread' },
  { key: 'both_hands_up', emoji: '🙌', name: 'Both Hands Up', description: 'Both hands raised open' },
  { key: 'rock_on', emoji: '🤘', name: 'Rock On', description: 'Index & pinky up, middle & ring curled' },
  { key: 'pointing_up', emoji: '☝️', name: 'Pointing Up', description: 'Index pointing up, rest curled' },
  { key: 'ok_sign', emoji: '👌', name: 'OK Sign', description: 'Thumb & index pinch, 3 fingers up' },
  { key: 'fist', emoji: '✊', name: 'Fist', description: 'All fingers curled into fist' }
];

export const DEFAULT_SETTINGS: AppSettings = {
  enabled: true,
  debugMode: false,
  memeDurationMs: 2000,
  cooldownMs: 3000,
  stabilityThresholdMs: 400,
  fps: 15,
  memes: {
    thumbs_up: {
      asset: 'memes/thumbs-up.gif',
      duration: 2000,
      title: 'Thumbs Up',
      emoji: '👍'
    },
    victory: {
      asset: 'memes/victory.gif',
      duration: 2000,
      title: 'Victory / Peace',
      emoji: '✌️'
    },
    open_palm: {
      asset: 'memes/stop.gif',
      duration: 2000,
      title: 'Open Palm Stop',
      emoji: '🖐'
    },
    both_hands_up: {
      asset: 'memes/absolute-cinema.gif',
      duration: 2000,
      title: 'Absolute Cinema',
      emoji: '🙌'
    },
    rock_on: {
      asset: 'memes/rock-on.gif',
      duration: 2000,
      title: 'Rock On Hype',
      emoji: '🤘'
    },
    pointing_up: {
      asset: 'memes/pointing.gif',
      duration: 2000,
      title: 'Big Brain',
      emoji: '☝️'
    },
    ok_sign: {
      asset: 'memes/noice.gif',
      duration: 2000,
      title: 'Noice!',
      emoji: '👌'
    },
    fist: {
      asset: 'memes/fist.gif',
      duration: 2000,
      title: 'Arthur Fist',
      emoji: '✊'
    }
  }
};

export const KEYBOARD_GESTURE_MAP: Record<string, Exclude<GestureType, 'none'>> = {
  '1': 'thumbs_up',
  '2': 'victory',
  '3': 'open_palm',
  '4': 'both_hands_up',
  '5': 'rock_on',
  '6': 'pointing_up',
  '7': 'ok_sign',
  '8': 'fist'
};
