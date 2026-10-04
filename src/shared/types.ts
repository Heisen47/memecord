export type GestureType =
  | 'thumbs_up'
  | 'victory'
  | 'open_palm'
  | 'both_hands_up'
  | 'rock_on'
  | 'pointing_up'
  | 'ok_sign'
  | 'fist'
  | 'none';

export type GestureState = 'IDLE' | 'DETECTING' | 'CONFIRMED' | 'TRIGGERED' | 'COOLDOWN';

export interface MemeItemConfig {
  asset: string;
  duration: number; // in milliseconds
  title?: string;
  emoji?: string;
}

export type MemeMapping = Record<Exclude<GestureType, 'none'>, MemeItemConfig>;

export interface AppSettings {
  enabled: boolean;
  debugMode: boolean;
  memeDurationMs: number;
  cooldownMs: number;
  stabilityThresholdMs: number;
  fps: number;
  memes: MemeMapping;
}

export interface GestureDetectionResult {
  gesture: GestureType;
  confidence: number;
  landmarks?: Array<{ x: number; y: number; z: number }>;
  handedness?: 'Left' | 'Right';
}

export interface StateMachineStatus {
  state: GestureState;
  detectedGesture: GestureType;
  confidence: number;
  stabilityElapsedMs: number;
  stabilityThresholdMs: number;
  cooldownRemainingMs: number;
  cooldownDurationMs: number;
}

export interface CameraStatusInfo {
  active: boolean;
  permissionGranted: boolean;
  error?: string;
  currentFps?: number;
}

export type ExtensionMessage =
  | { type: 'GET_SETTINGS' }
  | { type: 'SETTINGS_RESPONSE'; payload: AppSettings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'TRIGGER_MANUAL_MEME'; gesture: Exclude<GestureType, 'none'> }
  | { type: 'GET_CAMERA_STATUS' }
  | { type: 'CAMERA_STATUS_RESPONSE'; payload: CameraStatusInfo }
  | { type: 'STATUS_UPDATE'; payload: StateMachineStatus };
