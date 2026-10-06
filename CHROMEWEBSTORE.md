# Chrome Web Store Publishing Guide & Listing — Memecord

**Extension Name:** Memecord - Chrome Extension for Video Call Memes  
**Version:** 1.2.0  
**Target Category:** Fun / Productivity  

---

## 1. Store Listing Copy

### Short Description (max 132 chars)
Chrome extension to trigger meme overlays on your live camera feed & screen across video call websites in Chrome (Meet, Discord, Zoom).

### Detailed Description
Bring humor and energy into your video calls with Memecord!

Memecord is a Google Chrome extension that lets you trigger on-screen memes, animated GIFs, and sound effects during browser-based video calls. Because Memecord composites directly onto your outgoing camera stream, other call participants see your memes in real-time with ZERO extension installed on their side!

COMPATIBLE WEBSITES IN GOOGLE CHROME:
- Google Meet (meet.google.com)
- Discord Web (discord.com/app or discord.com/channels) — Use Discord in Chrome!
- Zoom Web Client (zoom.us/wc/*)
- Microsoft Teams Web (teams.microsoft.com)
- Slack Calls & Huddles (slack.com)
- FaceTime Web (facetime.apple.com)
- WhatsApp Web (web.whatsapp.com)

*Note: Memecord is a Chrome Extension designed exclusively for web video calls inside Google Chrome. It does not run inside standalone desktop applications.*

KEY FEATURES:
- Remote Participants See It: Stamped cleanly onto your outgoing camera stream via in-page canvas compositing.
- Works With or Without Camera: Detects calls even when camera is off or muted; triggers on-screen visuals and audio.
- Instant Keyboard Hotkeys: Press 1–9, 0, or custom keys to trigger memes immediately.
- Minimizable Floating Deck: Minimize to a subtle circular logo pebble or expand with Alt+M.
- Persistent Library: Add your favorite GIFs/videos with custom hotkeys; saved automatically across sessions.
- Built-in Online Meme Explorer: Search and pick from top templates (Imgflip & Meme-API) directly inside the popup.
- 100% Private & Local: Video frames are composited client-side in memory. Zero video or audio is ever uploaded to any cloud server.

HOW TO USE:
1. Join any supported video call in Google Chrome.
2. Press 1 to 9 on your keyboard or click any meme icon in the on-screen Memecord toolbar.
3. The meme appears over your camera and screen, auto-hiding after your set duration.
4. Press Alt + M anytime to toggle the floating dock on or off.

---

## 2. Permissions Justification (For CWS Review)

| Permission | Justification |
| :--- | :--- |
| `storage` | Saves user-configured memes, custom hotkey bindings, sound preferences, and HUD display state locally. |
| Host permissions (`meet.google.com`, `discord.com`, etc.) | Required to inject the visual meme overlay onto supported web video calling platforms and composite outgoing webcam streams. |

---

## 3. Privacy & Data Use Disclosure

- **Camera / Video Access:** Video streams are composited strictly inside browser memory using HTML5 Canvas (`captureStream`). Frames never leave the user's device and are never recorded or transmitted to any remote server.
- **Meeting & Audio Data:** No audio, meeting URLs, participant names, chat logs, or credentials are accessed or stored.
- **Analytics & Tracking:** None. No third-party trackers, telemetry, or analytics scripts are included.

---

## 4. Step-by-Step Guide to Publish on Chrome Web Store

### Step 1: Build the Production Zip
Run the packaging command:
```bash
bun run package
```
This compiles the extension into `dist/` and creates `memecord-extension.zip` in your project root.

### Step 2: Register for a Chrome Web Store Developer Account
1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Sign in with your Google account.
3. Pay the one-time $5 developer registration fee if you haven't already.

### Step 3: Create a New Item
1. In the Developer Dashboard, click **Add new item** (top-right).
2. Upload `memecord-extension.zip`.
3. Wait for the zip to validate (manifest V3, icons, and permissions).

### Step 4: Fill in Store Listing Details
1. **Store Listing Tab:**
   - **Name:** `Memecord - Chrome Extension for Video Call Memes`
   - **Summary:** Copy from Section 1 (Short Description).
   - **Description:** Copy from Section 1 (Detailed Description).
   - **Category:** Select `Fun` or `Productivity`.
   - **Language:** English.
2. **Graphic Assets:**
   - **Store Icon:** Upload `public/icons/icon-128.png` (128x128 PNG).
   - **Screenshots:** Upload at least 1 screenshot (1280x800 px or 640x400 px) showing the extension in action.

### Step 5: Fill in the Privacy Tab
1. **Single Purpose:** State: *"Injects user-selected meme overlays into web camera feeds and meeting windows on supported video platforms."*
2. **Permission Justification:** Copy justifications from Section 2.
3. **Data Usage:** Select that your extension **does not collect or transmit user data**.
4. **Privacy Policy:** Link to a public privacy policy page (e.g. GitHub Gist or repository page).

### Step 6: Submit for Review
1. Click **Submit for review**.
2. Reviews typically take between 24 and 72 hours.
