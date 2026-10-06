# Memecord 🎭

> **Chrome Extension (Manifest V3)** adding a meme camera overlay and interactive floating dock to live meetings (Google Meet, Discord, Zoom, Microsoft Teams, Slack, and Apple FaceTime).

---

## 1. Project Structure

```text
memecord/
├── dist/                         # Compiled production extension (load unpacked in Chrome)
│   ├── manifest.json             # Manifest V3 configuration
│   ├── background.js             # Service worker & external media resolver
│   ├── content.js                # Standalone IIFE content script
│   ├── inject.js                 # MAIN-world camera stream compositor
│   ├── popup/index.html          # Extension React popup UI
│   ├── memes/                    # Bundled animated meme GIFs
│   ├── icons/                    # Extension icons (16px, 48px, 128px)
│   └── assets/                   # Compiled scripts and CSS
├── public/                       # Static assets copied into dist
│   ├── icons/                    # App icons
│   ├── memes/                    # Default meme GIFs
│   └── manifest.json             # Source Manifest V3
├── scripts/
│   ├── build.js                  # Multi-target build script
│   └── package.js                # Packages dist into memecord.zip for CWS
├── src/
│   ├── background/
│   │   └── index.ts              # Service worker, CSP media proxy, storage seeding
│   ├── content/
│   │   ├── index.ts              # Content script bootstrap
│   │   ├── inject.ts             # Virtual camera getUserMedia canvas interceptor
│   │   └── overlay-controller.ts # Platform detection, dock integration, hotkey listeners
│   ├── overlay/
│   │   ├── floating-dock.ts      # Draggable, minimizable meeting toolbar
│   │   ├── meme-overlay.ts       # Overlay DOM manager and modal controller
│   │   └── overlay-styles.ts     # Injected CSS styles
│   ├── popup/
│   │   ├── Popup.tsx             # React popup settings dashboard
│   │   ├── MemeApiModal.tsx      # Online meme explorer (Imgflip & Meme-API)
│   │   ├── index.tsx             # React entry point
│   │   └── popup.css             # Glassmorphism dark theme styles
│   └── shared/
│       ├── config.ts             # Default settings and preset library
│       ├── media-resolver.ts     # Tenor/Giphy parser & data-URL converter
│       ├── storage.ts            # Chrome storage API helpers
│       └── types.ts              # Shared TypeScript interfaces
├── CHROMEWEBSTORE.md             # Complete Chrome Web Store listing & publish guide
├── package.json
└── vite.config.ts
```

---

## 2. Quick Start

### Build Extension
```bash
bun run build
```

### Package for Chrome Web Store
```bash
bun run package
```
Generates `memecord.zip` ready for upload to the Chrome Web Store Developer Dashboard.

### Local Development
```bash
bun run dev
```

---

## 3. How to Install Locally in Chrome

1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** (top-left).
5. Select the `dist` folder in this repository.
