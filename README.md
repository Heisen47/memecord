# MemeMeet 🎭

> **Chrome Extension (Manifest V3)** adding a fun, gesture-controlled meme overlay to Google Meet calls using local on-device machine learning (MediaPipe Hand Landmarker).

---

## 1. Project Structure

```text
meemcord/
├── dist/                         # Compiled production extension (load this in Chrome)
│   ├── manifest.json             # MV3 manifest
│   ├── background.js             # Service worker
│   ├── content.js                # Standalone IIFE content script for Google Meet
│   ├── popup/index.html          # Extension React popup UI
│   ├── test/index.html           # Standalone Gesture Test Lab / Sandbox
│   ├── memes/                    # Meme GIFs (thumbs-up, victory, stop)
│   ├── models/                   # MediaPipe hand_landmarker.task model
│   ├── mediapipe/wasm/           # Local WebAssembly binaries
│   └── icons/                    # Extension icons (16px, 48px, 128px)
├── public/                       # Static assets copied into dist
│   ├── memes/                    # Bundled animated meme GIFs
│   ├── models/                   # MediaPipe tasks vision model
│   ├── mediapipe/wasm/           # Bundled WASM files
│   ├── icons/                    # Generated PNG icons
│   └── manifest.json
├── scripts/
│   ├── build.js                  # Multi-target build script (IIFE content script + React pages)
│   └── make-icons.sh             # SVG to PNG icon generator
├── src/
│   ├── background/
│   │   └── index.ts              # Service worker & storage initialization
│   ├── content/
│   │   ├── index.ts              # Content script bootstrap (singleton guard)
│   │   └── meet-controller.ts    # Google Meet lifecycle, SPA observer, hotkeys
│   ├── gesture/
│   │   ├── classifier.ts         # 21-landmark geometric pose classifier
│   │   ├── detector.ts           # MediaPipe Tasks Vision + webcam processing loop
│   │   ├── state-machine.ts      # IDLE -> DETECTING -> CONFIRMED -> TRIGGERED -> COOLDOWN
│   │   └── types.ts              # Internal gesture types
│   ├── overlay/
│   │   ├── meme-overlay.ts       # DOM overlay injector with pointer-events:none
│   │   ├── debug-hud.ts          # Real-time state machine HUD badge
│   │   └── overlay.css           # Smooth scale/fade CSS animations
│   ├── popup/
│   │   ├── Popup.tsx             # React popup settings & mapping dashboard
│   │   ├── index.tsx             # React popup mounting
│   │   └── popup.css             # Glassmorphic dark theme styles
│   ├── shared/
│   │   ├── config.ts             # Default timings, memes, and keyboard maps
│   │   ├── storage.ts            # chrome.storage.local with localStorage fallback
│   │   └── types.ts              # Global TypeScript interfaces
│   └── test/
│       ├── TestLab.tsx           # Standalone gesture sandbox with skeleton drawing
│       ├── index.tsx             # Test lab mount
│       └── test.css              # Test lab layout styles
├── CHROMEWEBSTORE.md             # Chrome Web Store listing & permissions justification
├── manifest.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 2. How to Install the Extension Locally

1. Open Google Chrome.
2. In the address bar, navigate to: `chrome://extensions/`
3. Toggle on **Developer mode** in the top-right corner.
4. Click **Load unpacked** in the top-left corner.
5. Select the `dist` directory inside this repository (`/Users/heisenberg/Documents/projects/meemcord/dist`).
6. The **MemeMeet - Google Meet Gesture Memes** extension will appear in your extensions list.

---

## 3. How to Run / Build

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Commands

```bash
# Install dependencies
npm install

# Build production extension (compiles TypeScript, bundles IIFE content script, copies assets to dist/)
npm run build

# Start local dev server (for fast iteration on Popup and TestLab in browser)
npm run dev
```

---

## 4. How to Test

### Option A: Standalone Test Lab (No Google Meet Needed!)
1. Click the **MemeMeet** icon in your Chrome toolbar.
2. Click **"Open Gesture Test Lab / Sandbox"** (or open `chrome-extension://<EXTENSION_ID>/test/index.html` directly).
3. Grant camera permission.
4. You will see:
   - Your live mirrored camera feed with real-time hand skeleton tracking drawn over your fingers.
   - Real-time gesture state, confidence score, and cooldown timer.
   - Try showing 👍 **Thumbs Up**, ✌️ **Victory**, or 🖐 **Open Palm**.
   - Watch the meme overlay pop onto the screen for 2 seconds and smoothly fade out!
   - Test hotkeys: Press `1`, `2`, or `3` to manually trigger memes.

### Option B: In a Real Google Meet Call
1. Navigate to [Google Meet](https://meet.google.com).
2. Start or join an instant meeting.
3. Ensure **Meme Mode** is enabled in the MemeMeet popup (toggle is ON by default).
4. Show a gesture to your webcam (hold stable for ~400ms):
   - 👍 **Thumbs Up** &rarr; Chuck Norris Thumbs Up meme
   - ✌️ **Victory** &rarr; Victory Dance meme
   - 🖐 **Open Palm** &rarr; Michael Jordan "Stop It, Get Some Help" meme
5. The meme appears over the call, stays for 2 seconds, and disappears smoothly.
6. The anti-spam cooldown (~3 seconds) prevents multiple accidental triggers.
7. Test hotkeys inside Meet: Press `1`, `2`, or `3` while not typing in chat to verify instant overlay display.
8. Toggle on **"Show Debug HUD on Meet"** in the popup to see the real-time gesture telemetry badge in the top-right corner of Google Meet!

---

## 5. Architectural Highlights & Guardrails

- **Zero Camera Stream Conflict:** The extension does not intercept or overwrite Google Meet's WebRTC tracks. It opens a lightweight secondary capture stream (320x240 @ 15fps) specifically for hand landmark processing, consuming minimal CPU.
- **100% Client-Side Privacy:** Video frames are processed entirely in browser memory using local MediaPipe WebAssembly. No frames or audio are ever uploaded to any server.
- **Safe DOM Injection:** The overlay container `#mememeet-overlay-root` uses `pointer-events: none !important` and `z-index: 2147483647`. It will never intercept clicks or block microphone, camera, chat, screen share, or participant controls.
- **SPA Lifecycle Handling:** Google Meet dynamically changes routes between lobby, pre-join, and meeting rooms. The extension observes SPA DOM mutations, prevents duplicate instances with a singleton guard, and stops camera tracks immediately when disabled.

---

## 6. Known Limitations of the MVP

1. **Local Overlay Only:** In this MVP, the meme displays as an overlay on the user's local screen. Other participants in the call do not see the meme unless the user shares their screen or a virtual camera pipeline is added.
2. **Webcam Sharing on Unsupported Platforms:** On Chrome for macOS/Windows, multiple consumers can share the webcam stream simultaneously. On certain strict virtual machines or unusual Linux setups where camera sharing is locked by the OS driver, the extension provides manual hotkeys (`1`, `2`, `3`) as a seamless fallback.
3. **Lighting & Extreme Occlusion:** Gestures require hand landmarks to be reasonably visible in frame. Extreme backlighting or hands held right against the lens can lower classification confidence.

---

## 7. What Should Be Built Next (Post-MVP)

1. **Virtual Camera / Canvas Stream Injection:** Inject memes directly into the user's video feed using a canvas-based `captureStream()`, allowing everyone in the meeting to see the meme through your camera feed.
2. **Custom Meme Uploader:** Allow users to upload their own custom GIFs/images and bind them to specific gestures in the popup UI.
3. **Audio Sound Effects:** Optional classic sound effects (e.g. "Bruh", airhorn, ta-da) accompanying the meme overlay with volume control.
4. **Additional Hand Gestures:** Expand classifier to support gestures like 🤘 Rock On, 🤙 Hang Loose, 🫰 Finger Heart, and 👏 Clapping.
5. **Multi-Hand & Peer-to-Peer Sync:** WebRTC data channel or lightweight sync for teams where everyone with MemeMeet installed sees each other's gestures in real time.
