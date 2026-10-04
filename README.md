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
- **Discord Web** ([`discord.com/app`](https://discord.com/app) or [`discord.com/channels`](https://discord.com/channels)) — *Use Discord in Chrome to use Memecord!*
- **Zoom Web Client** (`zoom.us/wc/*`)
- **Microsoft Teams Web** (`teams.microsoft.com`)
- **Slack Calls & Huddles** (`slack.com`)
- **FaceTime Web** (`facetime.apple.com`)
- **WhatsApp Web** (`web.whatsapp.com`)
- Any standard WebRTC video call website opened in Google Chrome

---

## 🌟 Key Features

1. **Other Callers See the Memes (Zero Extension Needed for Them)**:
   - Uses an in-page canvas stream compositor (`inject.js`) to intercept `getUserMedia`.
   - Stamps animated GIFs/videos with smooth WebCodecs frame playback directly onto your outgoing camera stream.
   - Remote participants see your memes directly through your camera feed in Google Meet, Discord, Zoom, etc.

2. **Works With OR Without Camera Active**:
   - Detects active calls and voice channels via audio stream hooks (`getUserMedia` mic tracks), WebRTC connection state, and meeting DOM controls.
   - Even if your camera is turned off or muted, the Memecord HUD displays on screen, and hotkeys (`1–9`, `0`, `Q...`, `Alt+M`) trigger local visual overlays and sound effects.
   - If you turn on your camera at any point during the call, the compositor immediately begins stamping memes onto your outgoing video.

3. **Modern Floating HUD (Memecord Deck)**:
   - **Hotkey Binds**: Press `1–9`, `0`, or `Q...` to fire memes instantly during calls.
   - **Key Conflict Prevention**: Rebinding hotkeys automatically prevents and resolves key clashes.
   - **Minimizable**: Click the minimize (`—`) button or press `Alt+M` to collapse the HUD into a clean circular logo pebble. Click the pebble to expand.
   - **Persistent Storage**: Saved memes and custom hotkeys persist across calls and browser sessions.
   - **Quick Add & Custom URLs**: Add custom GIF or video URLs directly from the HUD.

---

## 🚀 How to Install in Google Chrome

1. **Build the extension**:
   ```bash
   npm install
   npm run build
   ```
   *(Compiled extension files are output to the `dist/` directory).*

2. **Load into Google Chrome**:
   - Open Google Chrome and go to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top-right corner).
   - Click **Load unpacked** (top-left button).
   - Select the `dist/` directory inside this project:
     `/Users/heisenberg/Documents/projects/memecord/dist`
   - **Memecord** is now installed and active!

---

## 🧪 How to Test

### Option 1: Standalone Test Lab (No Meeting Needed)
1. Click the **Memecord** icon in your Chrome extensions toolbar and click **"Open Test Lab / Simulator"**, or open:
   `http://localhost:5173/test/index.html` (when running `npm run dev`) or `dist/test/index.html`.
2. Test both modes:
   - **Camera Disabled Mode**: The HUD is visible, click memes or press `1`, `2`, `3` to test overlay and sound.
   - **Camera Stream Mode**: Click "Start Camera Stream" to see what remote callers see in Google Meet and Discord.

### Option 2: Live in Discord Web
1. Open [`https://discord.com/app`](https://discord.com/app) in Google Chrome.
2. Join any server voice channel or start a DM call.
3. The Memecord HUD appears in the bottom corner of your Discord tab!
4. Press `1` or click a meme card to trigger.

### Option 3: Live in Google Meet
1. Open [`https://meet.google.com`](https://meet.google.com) and start an instant meeting.
2. The Memecord HUD appears once you are inside the call (with cam on or off).
3. Press `1–9` to display memes to yourself and remote participants.

---

## 📁 Repository Structure

```text
memecord/
├── dist/                      # Compiled production extension for Chrome
├── public/                    # Static assets & icons
│   ├── icons/                 # Logo and extension icons (16, 48, 128)
│   ├── memes/                 # Bundled meme GIFs and sounds
│   └── manifest.json
├── src/
│   ├── background/            # MV3 background service worker & proxy
│   ├── content/
│   │   ├── index.ts           # Content script entry point
│   │   ├── inject.ts          # MAIN world WebRTC & canvas camera compositor
│   │   └── overlay-controller.ts # Call detection (Meet, Discord, Zoom, Teams)
│   ├── overlay/
│   │   ├── floating-dock.ts   # Interactive floating HUD & summon pebble
│   │   └── meme-overlay.ts    # Local DOM visual overlay & sound effects
│   ├── popup/                 # React settings dashboard (chrome action popup)
│   ├── shared/                # Storage, hotkey resolvers, and TypeScript types
│   └── test/                  # TestLab sandbox simulator
├── manifest.json              # Chrome Extension MV3 Manifest
└── package.json
```

---

## 🔒 Privacy & Permissions

- **100% Client-Side**: All video frame compositing and hotkey monitoring take place locally in your browser tab.
- **Zero Cloud Recording**: No audio, video, or meeting contents are ever recorded, collected, or uploaded to external servers.
