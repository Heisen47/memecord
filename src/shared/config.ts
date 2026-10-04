import { AppSettings } from './types';

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
      title: 'Both Hands Up',
      emoji: '🙌'
    }
  }
};

import { GestureType } from './types';

export const KEYBOARD_GESTURE_MAP: Record<string, Exclude<GestureType, 'none'>> = {
  '1': 'thumbs_up',
  '2': 'victory',
  '3': 'open_palm',
  '4': 'both_hands_up'
};
