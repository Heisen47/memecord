# Memecord 🎭

> **Google Chrome Extension (Manifest V3)** for live meeting meme overlays and soundboard triggers across browser-based video calls.

---

## ⚠️ Important Scope & Compatibility

> [!IMPORTANT]
> **Memecord is a Google Chrome Extension.**  
> It works exclusively inside **Google Chrome browser tabs** where video calls are conducted.  
> It does **NOT** run inside standalone desktop applications (like Discord Desktop, Zoom Desktop, or Teams Desktop).

### Supported Websites in Google Chrome:
- **Google Meet** (`meet.google.com`)
- **Discord Web** ([`discord.com/app`](https://discord.com/app) or [`discord.com/channels`](https://discord.com/channels))
- **Zoom Web Client** (`zoom.us/wc/*`)
- **Microsoft Teams Web** (`teams.microsoft.com`)
- **Slack Calls & Huddles** (`slack.com`)
- **FaceTime Web** (`facetime.apple.com`)
- **WhatsApp Web** (`web.whatsapp.com`)
- Any standard WebRTC video call website opened in Google Chrome

---

## 🌟 Key Features

1. **Remote Callers See the Memes (Zero Extension Needed for Them)**:
   - In-page canvas stream compositor (`inject.js`) stamps animated GIFs/videos directly onto your outgoing camera stream.
   - Remote participants see your memes directly through your camera feed.

2. **Works With OR Without Camera Active**:
   - Detects active calls and voice channels via audio stream hooks and WebRTC connection state.
   - Even if camera is off or muted, hotkeys trigger local visual overlays and sound effects.

3. **Modern Floating HUD (Memecord Deck)**:
   - **Hotkey Binds**: Press `1–9`, `0`, or `Q...` to fire memes instantly during calls.
   - **Minimizable**: Click minimize or press `Alt+M` to collapse into a clean logo pebble.
   - **Persistent Storage**: Saved memes and custom hotkeys persist across calls.

---

## 🚀 Quick Start

### Build Extension
```bash
bun run build
```

### Package for Chrome Web Store
```bash
bun run package
```
Generates `memecord-extension.zip` ready for upload to the Chrome Web Store Developer Dashboard.

### Local Development
```bash
bun run dev
```

---

## 💻 How to Install Locally in Chrome

1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** (top-left).
5. Select the `dist` folder in this repository.

---

## 🔒 Privacy & Permissions

- **100% Client-Side**: All video frame compositing and hotkey monitoring take place locally in your browser tab.
- **Zero Cloud Recording**: No audio, video, or meeting contents are ever recorded, collected, or uploaded to external servers.
