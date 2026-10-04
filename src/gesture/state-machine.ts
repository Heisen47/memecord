import { GestureType, GestureState, GestureDetectionResult, StateMachineStatus } from '../shared/types';

export interface GestureStateMachineOptions {
  stabilityThresholdMs: number;
  cooldownDurationMs: number;
  minConfidence?: number;
  onTrigger: (gesture: Exclude<GestureType, 'none'>, confidence: number) => void;
  onStatusChange?: (status: StateMachineStatus) => void;
}

export class GestureStateMachine {
  private state: GestureState = 'IDLE';
  private candidateGesture: GestureType = 'none';
  private detectingStartTime: number = 0;
  private cooldownStartTime: number = 0;
  private lastConfidence: number = 0;

  private stabilityThresholdMs: number;
  private cooldownDurationMs: number;
  private minConfidence: number;
  private onTrigger: (gesture: Exclude<GestureType, 'none'>, confidence: number) => void;
  private onStatusChange?: (status: StateMachineStatus) => void;

  constructor(options: GestureStateMachineOptions) {
    this.stabilityThresholdMs = options.stabilityThresholdMs;
    this.cooldownDurationMs = options.cooldownDurationMs;
    this.minConfidence = options.minConfidence ?? 0.65;
    this.onTrigger = options.onTrigger;
    this.onStatusChange = options.onStatusChange;
  }

  public updateConfig(stabilityThresholdMs: number, cooldownDurationMs: number) {
    this.stabilityThresholdMs = stabilityThresholdMs;
    this.cooldownDurationMs = cooldownDurationMs;
  }

  public update(detection: GestureDetectionResult): StateMachineStatus {
    const now = performance.now();
    const { gesture, confidence } = detection;
    this.lastConfidence = confidence;

    switch (this.state) {
      case 'COOLDOWN': {
        const elapsed = now - this.cooldownStartTime;
        if (elapsed >= this.cooldownDurationMs) {
          this.state = 'IDLE';
          this.candidateGesture = 'none';
        }
        break;
      }

      case 'IDLE': {
        if (gesture !== 'none' && confidence >= this.minConfidence) {
          this.state = 'DETECTING';
          this.candidateGesture = gesture;
          this.detectingStartTime = now;
        }
        break;
      }

      case 'DETECTING': {
        if (gesture === this.candidateGesture && confidence >= this.minConfidence) {
          const heldDuration = now - this.detectingStartTime;
          if (heldDuration >= this.stabilityThresholdMs) {
            // CONFIRMED & TRIGGERED
            this.state = 'CONFIRMED';
            const confirmedGesture = this.candidateGesture as Exclude<GestureType, 'none'>;
            
            // Trigger callback
            this.state = 'TRIGGERED';
            try {
              this.onTrigger(confirmedGesture, confidence);
            } catch (err) {
              console.error('[MemeMeet] Error executing onTrigger:', err);
            }

            // Immediately enter COOLDOWN
            this.state = 'COOLDOWN';
            this.cooldownStartTime = now;
          }
        } else {
          // Gesture was lost or changed before reaching threshold
          this.state = 'IDLE';
          this.candidateGesture = 'none';
          this.detectingStartTime = 0;
        }
        break;
      }

      case 'CONFIRMED':
      case 'TRIGGERED': {
        this.state = 'COOLDOWN';
        this.cooldownStartTime = now;
        break;
      }
    }

    const status = this.getStatus(now);
    if (this.onStatusChange) {
      this.onStatusChange(status);
    }
    return status;
  }

  public triggerManual(gesture: Exclude<GestureType, 'none'>) {
    const now = performance.now();
    this.candidateGesture = gesture;
    this.state = 'TRIGGERED';
    this.lastConfidence = 1.0;
    
    try {
      this.onTrigger(gesture, 1.0);
    } catch (err) {
      console.error('[MemeMeet] Error during manual trigger:', err);
    }

    this.state = 'COOLDOWN';
    this.cooldownStartTime = now;

    const status = this.getStatus(now);
    if (this.onStatusChange) {
      this.onStatusChange(status);
    }
  }

  public reset() {
    this.state = 'IDLE';
    this.candidateGesture = 'none';
    this.detectingStartTime = 0;
    this.cooldownStartTime = 0;
    this.lastConfidence = 0;
  }

  public getStatus(now = performance.now()): StateMachineStatus {
    let stabilityElapsedMs = 0;
    if (this.state === 'DETECTING') {
      stabilityElapsedMs = Math.min(this.stabilityThresholdMs, now - this.detectingStartTime);
    }

    let cooldownRemainingMs = 0;
    if (this.state === 'COOLDOWN') {
      const elapsed = now - this.cooldownStartTime;
      cooldownRemainingMs = Math.max(0, this.cooldownDurationMs - elapsed);
    }

    return {
      state: this.state,
      detectedGesture: this.candidateGesture,
      confidence: this.lastConfidence,
      stabilityElapsedMs,
      stabilityThresholdMs: this.stabilityThresholdMs,
      cooldownRemainingMs,
      cooldownDurationMs: this.cooldownDurationMs
    };
  }
}
