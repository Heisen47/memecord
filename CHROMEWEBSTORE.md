# Chrome Web Store Publishing Guide & Listing — Memecord

**Extension Name:** Memecord - Live Meeting Meme Camera Overlay  
**Version:** 1.2.0  
**Target Category:** Fun / Productivity  

---

## 1. Store Listing Copy

### Short Description (max 132 chars)
Trigger fun meme overlays on your live camera stream and screen in Google Meet, Discord, Zoom, Teams, Slack & FaceTime.

### Detailed Description
Elevate your online meetings and calls with hands-free, instant meme overlays visible directly on your webcam feed and screen!

Memecord integrates with Google Meet, Discord, Zoom, Microsoft Teams, Slack, and Apple FaceTime (web), injecting visual meme overlays onto your live camera stream so other participants in your meeting see the memes in real time.

KEY FEATURES:
- 🎬 Live Camera Compositor: Injects meme GIFs/videos directly onto your webcam output so all call participants see them.
- ⌨️ Instant Keyboard Hotkeys: Press 1–9, 0, or custom keys to trigger memes immediately without clicking away.
- 🎛️ Interactive Floating Dock: On-screen toolbar to trigger, preview, minimize, and organize memes on any video platform.
- 🖼️ Custom Meme Uploader: Add any Tenor, Giphy, Imgur, or direct GIF link with automatic CSP optimization.
- 🔍 Built-in Online Meme Explorer: Search and pick from the top 100 meme templates (via Imgflip) or fresh trending memes directly inside the popup.
- 🔊 Optional Sound FX: Play subtle audio pops on trigger.
- 📐 Customizable Placement & Timing: Choose Top-Center, Center, Top-Right, or Bottom-Right with 1.5s to 5.0s durations.
- 🔒 100% Private & Client-Side: Zero meeting data, audio, video frames, or user identities are collected or uploaded.

HOW TO USE:
1. Join any supported video call (Google Meet, Discord, Zoom, Teams, Slack, FaceTime).
2. Press 1 to 9 on your keyboard or click any meme icon in the on-screen Memecord toolbar.
3. The meme appears over your camera and screen, auto-hiding after your set duration.
4. Press Alt + M anytime to toggle the floating dock on or off.

---

## 2. Permissions Justification (For CWS Review)

| Permission | Justification |
| :--- | :--- |
| `storage` | Saves user preferences locally, including active meme bindings, hotkeys, overlay position, and sound FX toggle. |
| `<all_urls>` (host_permission) | Required by the background service worker to fetch user-provided custom meme image/video URLs (from Tenor, Giphy, Imgur, etc.) and convert them to local Base64 Data URLs to avoid Content Security Policy (CSP) blocking inside meeting pages. |

---

## 3. Privacy & Data Use Disclosure

- **Camera / Video Access:** Video streams are composited strictly inside browser memory using HTML5 Canvas (`captureStream`). Frames never leave the user's device and are never recorded or transmitted to any remote server.
- **Meeting & Audio Data:** No audio, meeting URLs, participant names, chat logs, or credentials are accessed or stored.
- **Analytics & Tracking:** None. No third-party trackers, telemetry, or analytics scripts are included.

---

## 4. Step-by-Step Guide to Publish on Chrome Web Store

### Step 1: Build the Production Zip
Run the following command in your terminal:
```bash
bun run package
```
This builds the production bundle and generates `memecord.zip` in your project root.

### Step 2: Register for a Chrome Web Store Developer Account
1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Sign in with your Google account.
3. Pay the one-time $5 developer registration fee if you haven't already.

### Step 3: Create a New Item
1. In the Developer Dashboard, click **Add new item** (top-right).
2. Drag and drop `memecord.zip` or click **Upload** to select it.
3. Wait for the zip to validate (manifest V3, icons, and permissions).

### Step 4: Fill in Store Listing Details
1. **Store Listing Tab:**
   - **Name:** `Memecord - Live Meeting Meme Camera Overlay`
   - **Summary:** Copy from Section 1 (Short Description).
   - **Description:** Copy from Section 1 (Detailed Description).
   - **Category:** Select `Fun` or `Productivity`.
   - **Language:** English.
2. **Graphic Assets:**
   - **Store Icon:** Upload `public/icons/icon-128.png` (128x128 PNG).
   - **Screenshots:** Upload at least 1 screenshot (1280x800 px or 640x400 px) showing the extension popup and the meme overlay in action.
   - **Small Promo Tile (Optional):** 440x280 px.

### Step 5: Fill in the Privacy Tab
1. **Single Purpose:** State that the extension's sole purpose is to overlay user-triggered meme graphics onto web camera feeds and meeting pages.
2. **Permission Justification:** Copy justifications from Section 2 for `storage` and `<all_urls>`.
3. **Data Usage:** Select that your extension **does NOT collect or transmit user data**.
4. **Privacy Policy:** Link to a public privacy policy page (can be hosted on GitHub Pages or a public gist using the disclosure from Section 3).

### Step 6: Submit for Review
1. Click **Submit for review**.
2. Select whether to publish automatically upon approval or manually.
3. Standard Chrome Web Store review takes between **24 to 72 hours**.
