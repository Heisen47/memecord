import { GestureDetectionResult } from '../shared/types';

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

function distance(p1: Landmark, p2: Landmark): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y, (p1.z || 0) - (p2.z || 0));
}

export function classifyHandPose(landmarks: Landmark[], handedness?: 'Left' | 'Right'): GestureDetectionResult {
  if (!landmarks || landmarks.length < 21) {
    return { gesture: 'none', confidence: 0 };
  }

  const wrist = landmarks[0];

  // Thumb
  const thumbMcp = landmarks[2];
  const thumbIp = landmarks[3];
  const thumbTip = landmarks[4];

  // Index
  const indexPip = landmarks[6];
  const indexTip = landmarks[8];

  // Middle
  const middlePip = landmarks[10];
  const middleTip = landmarks[12];

  // Ring
  const ringPip = landmarks[14];
  const ringTip = landmarks[16];

  // Pinky
  const pinkyPip = landmarks[18];
  const pinkyTip = landmarks[20];

  // Check finger extension: distance from wrist to tip vs wrist to PIP
  const isExtended = (tip: Landmark, pip: Landmark): boolean => {
    return distance(tip, wrist) > distance(pip, wrist) * 1.15;
  };

  const isCurled = (tip: Landmark, pip: Landmark): boolean => {
    return distance(tip, wrist) < distance(pip, wrist) * 1.05;
  };

  const indexExt = isExtended(indexTip, indexPip);
  const middleExt = isExtended(middleTip, middlePip);
  const ringExt = isExtended(ringTip, ringPip);
  const pinkyExt = isExtended(pinkyTip, pinkyPip);

  const indexCurl = isCurled(indexTip, indexPip);
  const middleCurl = isCurled(middleTip, middlePip);
  const ringCurl = isCurled(ringTip, ringPip);
  const pinkyCurl = isCurled(pinkyTip, pinkyPip);

  // Thumb extension
  const thumbDistTip = distance(thumbTip, wrist);
  const thumbDistMcp = distance(thumbMcp, wrist);
  const thumbExt = thumbDistTip > thumbDistMcp * 1.2;

  // 1. THUMBS UP CHECK (👍)
  // Thumb pointing up: thumbTip.y is noticeably above thumbIp.y and thumbMcp.y
  // All other 4 fingers are curled
  const thumbPointingUp = (thumbTip.y < thumbIp.y - 0.03) && (thumbIp.y < thumbMcp.y);
  const thumbHighest = thumbTip.y < indexTip.y && thumbTip.y < middleTip.y;
  const fourFingersCurled = indexCurl && middleCurl && ringCurl && pinkyCurl;

  if (thumbPointingUp && fourFingersCurled && thumbHighest) {
    const verticalDelta = Math.max(0, indexTip.y - thumbTip.y);
    const confidence = Math.min(0.98, 0.75 + verticalDelta * 0.8);
    return {
      gesture: 'thumbs_up',
      confidence,
      landmarks,
      handedness
    };
  }

  // 2. VICTORY / PEACE CHECK (✌️)
  // Index and middle are extended
  // Ring and pinky are curled
  // Index and middle tips are separated
  const indexAndMiddleExtended = indexExt && middleExt;
  const ringAndPinkyCurled = ringCurl && pinkyCurl;
  const fingerSpread = distance(indexTip, middleTip) > 0.035;

  if (indexAndMiddleExtended && ringAndPinkyCurled && fingerSpread) {
    const separation = distance(indexTip, middleTip);
    const confidence = Math.min(0.98, 0.78 + Math.min(separation * 1.5, 0.2));
    return {
      gesture: 'victory',
      confidence,
      landmarks,
      handedness
    };
  }

  // 3. OPEN PALM CHECK (🖐)
  // All 5 fingers extended and spread out
  const allFingersExtended = thumbExt && indexExt && middleExt && ringExt && pinkyExt;
  const palmSpread =
    distance(thumbTip, indexTip) > 0.05 &&
    distance(indexTip, middleTip) > 0.025 &&
    distance(middleTip, ringTip) > 0.025 &&
    distance(ringTip, pinkyTip) > 0.025;

  if (allFingersExtended && palmSpread) {
    const confidence = 0.92;
    return {
      gesture: 'open_palm',
      confidence,
      landmarks,
      handedness
    };
  }

  return {
    gesture: 'none',
    confidence: 0,
    landmarks,
    handedness
  };
}
