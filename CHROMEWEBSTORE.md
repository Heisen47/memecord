# Chrome Web Store Listing — MemeMeet

**Last Updated:** October 4, 2026  
**Extension Name:** MemeMeet - Google Meet Gesture Memes  
**Version:** 1.0.0  
**Target Category:** Fun / Productivity  

---

## 1. Store Listing Copy

### Short Description (max 132 chars)
Trigger fun meme overlays on your Google Meet screen using hand gestures like thumbs up, victory, and open palm.

### Detailed Description
Bring humor and fun into your Google Meet calls with hands-free gesture-triggered memes!

MemeMeet detects your natural hand gestures in real time and displays brief, non-intrusive meme overlays on your screen.

FEATURES:
- 👍 Thumbs Up → Chuck Norris Thumbs Up meme
- ✌️ Victory / Peace → Victory Dance meme
- 🖐 Open Palm → "Stop It, Get Some Help" meme
- ⌨️ Hotkey Triggers: Press 1, 2, or 3 to test or trigger memes manually
- ⏱️ Customizable Duration & Cooldown: Prevent spamming with configurable anti-spam cooldowns (default: 3s cooldown, 2s display)
- 🧪 Dedicated Gesture Test Lab: Test gestures and view hand skeleton tracking in a local sandbox outside Google Meet
- 🔒 100% Private & Local: Video frames are processed entirely on your device via MediaPipe. Zero video or audio is ever uploaded or recorded.

HOW TO USE:
1. Join any Google Meet call (https://meet.google.com).
2. Click the MemeMeet extension icon in your toolbar and toggle "Enable Meme Mode".
3. Show a gesture (👍, ✌️, or 🖐) to your webcam for ~400ms.
4. Watch the meme appear on your screen and disappear smoothly after 2 seconds.

---

## 2. Permissions Justification

| Permission | Justification |
| :--- | :--- |
| `storage` | Saves user preferences locally, including meme duration, anti-spam cooldown time, active toggle state, and debug HUD display settings. |
| `https://meet.google.com/*` (host_permission) | Required to inject the visual meme overlay onto the Google Meet webpage and detect hand gestures locally while in an active meeting. |

---

## 3. Privacy & Data Use Disclosure

- **Camera / Video Access:** Used solely for local client-side hand tracking with MediaPipe Tasks Vision. Video frames never leave the user's browser, are never transmitted to any external server, and are discarded immediately after landmark classification.
- **Audio / Meeting Data:** No audio is accessed or captured. No meeting links, attendee identities, chat contents, or credentials are read or stored.
- **Analytics / Tracking:** None. No third-party trackers or telemetry services are included.

---

## 4. Version History

- **v1.0.0** (2026-10-04)
  - Initial MVP release.
  - MediaPipe Hand Landmarker integration with geometric pose classifier.
  - Three gestures: Thumbs Up, Victory, and Open Palm.
  - Anti-spam state machine (IDLE -> DETECTING -> CONFIRMED -> TRIGGERED -> COOLDOWN).
  - React Popup settings UI with real-time status.
  - Standalone Gesture Test Lab sandbox page.
