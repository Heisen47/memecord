# Chrome Web Store Listing — Memecord

**Last Updated:** October 4, 2026  
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
- 🎥 Remote Participants See It: Stamped cleanly onto your outgoing camera stream via in-page canvas compositing.
- 🎙️ Works With or Without Camera: Detects calls even when camera is off or muted; triggers on-screen visuals and audio.
- ⌨️ Instant Keyboard Hotkeys: Press 1–9, 0, or Q... to trigger memes immediately.
- 🎭 Minimizable Floating Deck: Minimize to a subtle circular logo pebble or expand with Alt+M.
- 💾 Persistent Library: Add your favorite GIFs/videos with custom hotkeys; saved automatically across sessions.
- 🚫 Intelligent Key Clash Prevention: Avoid duplicate keybindings with automatic conflict resolution.
- 🔒 100% Private & Local: Video frames are composited client-side in memory. Zero video or audio is ever uploaded to any cloud server.

---

## 2. Permissions Justification

| Permission | Justification |
| :--- | :--- |
| `storage` | Saves user-configured memes, custom hotkey bindings, sound preferences, and HUD display state locally. |
| `unlimitedStorage` | Allows saving offline base64 data URLs for user-uploaded custom meme GIFs without quota errors. |
| `<all_urls>` (host_permissions) | Required to inject the floating HUD and camera compositor into web-based video calling platforms in Google Chrome. |

---

## 3. Privacy & Data Use Disclosure

- **Camera / Video Access:** Used solely for local client-side frame compositing on the user's active camera feed. Frames never leave browser memory.
- **Audio / Meeting Data:** No audio is recorded or stored. No meeting links, attendee identities, chat contents, or credentials are read.
- **Analytics / Tracking:** None. No third-party trackers or telemetry services are included.
