export const OVERLAY_CSS = `
/* Memecord Overlay Root */
#memecord-overlay-root {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none !important;
  z-index: 2147483647 !important;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif;
  user-select: none;
}

/* Meme Container Positions */
.memecord-meme-box {
  position: absolute;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  filter: drop-shadow(0 25px 45px rgba(0, 0, 0, 0.75));
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.24s ease-out;
  z-index: 2147483647;
}

.memecord-meme-box.pos-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.65);
}
.memecord-meme-box.pos-center.visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.memecord-meme-box.pos-center.hiding {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.85);
}

.memecord-meme-box.pos-top-center {
  top: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(-25px) scale(0.8);
}
.memecord-meme-box.pos-top-center.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}
.memecord-meme-box.pos-top-center.hiding {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px) scale(0.8);
}

.memecord-meme-box.pos-top-right {
  top: 24px;
  right: 28px;
  transform: translateY(-20px) scale(0.8);
}
.memecord-meme-box.pos-top-right.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.memecord-meme-box.pos-top-right.hiding {
  opacity: 0;
  transform: translateY(-20px) scale(0.8);
}

.memecord-meme-box.pos-bottom-right {
  bottom: 90px;
  right: 28px;
  transform: translateY(20px) scale(0.8);
}
.memecord-meme-box.pos-bottom-right.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.memecord-meme-box.pos-bottom-right.hiding {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.memecord-meme-image {
  max-width: min(85vw, 460px);
  max-height: min(65vh, 400px);
  border-radius: 20px;
  border: 3.5px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(99, 102, 241, 0.4);
  object-fit: contain;
  background: #090d16;
}

video.memecord-meme-image {
  outline: none;
}

.memecord-meme-title {
  margin-top: 10px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: #f8fafc;
  padding: 6px 20px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.4px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

/* =========================================
   Memecord Floating Deck (2D Grid Control Center)
   ========================================= */
.memecord-deck {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: min(620px, 94vw);
  background: rgba(10, 15, 30, 0.88);
  backdrop-filter: blur(36px) saturate(210%);
  -webkit-backdrop-filter: blur(36px) saturate(210%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 24px;
  box-shadow: 0 24px 60px -10px rgba(0, 0, 0, 0.85), 0 0 35px rgba(99, 102, 241, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto !important;
  color: #f8fafc;
  font-size: 13px;
  z-index: 2147483646;
  box-sizing: border-box;
  user-select: none;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease, border-color 0.2s ease, box-shadow 0.25s ease;
}

.memecord-deck:hover {
  border-color: rgba(99, 102, 241, 0.55);
  box-shadow: 0 28px 70px -8px rgba(0, 0, 0, 0.9), 0 0 40px rgba(99, 102, 241, 0.32), inset 0 1px 1px rgba(255, 255, 255, 0.45);
}

.memecord-deck.hiding,
.memecord-deck.shrinking {
  opacity: 0;
  transform: scale(0.18) translateY(24px) !important;
  pointer-events: none !important;
  transition: transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}

.memecord-deck.entering {
  animation: memecord-spring-in 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes memecord-spring-in {
  0% { opacity: 0; transform: scale(0.24); }
  72% { transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}

/* Header Bar */
.memecord-deck-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.memecord-deck-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 8px;
  transition: background 0.15s ease, transform 0.15s ease;
  user-select: none;
}
.memecord-deck-brand:hover {
  background: rgba(99, 102, 241, 0.16);
}
.memecord-deck-brand:hover .memecord-deck-title {
  color: #c7d2fe;
  text-shadow: 0 0 10px rgba(129, 140, 248, 0.5);
}
.memecord-deck-brand:hover .memecord-deck-logo-img {
  transform: scale(1.12);
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.7);
}
.memecord-deck-brand:active {
  transform: scale(0.96);
}

.memecord-drag-grip {
  color: #64748b;
  font-size: 14px;
  cursor: grab;
  padding: 2px 4px;
  letter-spacing: 1px;
  transition: color 0.15s ease;
}
.memecord-drag-grip:hover {
  color: #a5b4fc;
}

.memecord-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981, 0 0 4px #34d399;
  animation: memecord-pulse 2.2s infinite;
}

@keyframes memecord-pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.75; }
  100% { transform: scale(1); opacity: 1; }
}

.memecord-deck-title {
  font-size: 13px;
  font-weight: 800;
  color: #f8fafc;
  letter-spacing: -0.2px;
}

.memecord-count-badge {
  font-size: 10px;
  font-weight: 800;
  color: #a5b4fc;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(129, 140, 248, 0.35);
  padding: 1px 6px;
  border-radius: 9999px;
}

/* Search Box */
.memecord-search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 4px 9px;
  flex: 1;
  max-width: 200px;
  transition: border-color 0.15s ease;
}
.memecord-search-box:focus-within {
  border-color: #818cf8;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
}

.memecord-search-icon {
  font-size: 11px;
  opacity: 0.7;
}

.memecord-search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #f8fafc;
  font-size: 11px;
  width: 100%;
}
.memecord-search-input::placeholder {
  color: #64748b;
}

/* Actions in Header */
.memecord-deck-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.memecord-deck-action-btn {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #cbd5e1;
  border-radius: 8px;
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}
.memecord-deck-action-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.28);
  transform: translateY(-1px);
}
.memecord-deck-action-btn:active {
  transform: scale(0.96);
}

.memecord-deck-action-btn.edit-btn.active {
  background: rgba(239, 68, 68, 0.32);
  border-color: #ef4444;
  color: #fca5a5;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
}

.memecord-deck-action-btn.add-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: rgba(199, 210, 254, 0.4);
  color: #ffffff;
}
.memecord-deck-action-btn.add-btn:hover {
  filter: brightness(1.15);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.45);
}

.memecord-deck-action-btn.minimize-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: 50%;
  color: #94a3b8;
  font-size: 11px;
}
.memecord-deck-action-btn.minimize-btn:hover {
  background: rgba(99, 102, 241, 0.35);
  border-color: #818cf8;
  color: #fff;
}

.memecord-deck-action-btn.close-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: 50%;
  color: #94a3b8;
  font-size: 11px;
}
.memecord-deck-action-btn.close-btn:hover {
  background: rgba(239, 68, 68, 0.35);
  border-color: #f87171;
  color: #fecaca;
}

/* Main Meme Grid */
.memecord-deck-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
  gap: 10px;
  padding: 14px 16px;
  max-height: 290px;
  overflow-y: auto;
  box-sizing: border-box;
}

.memecord-deck-grid::-webkit-scrollbar {
  width: 6px;
}
.memecord-deck-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 9999px;
}
.memecord-deck-grid::-webkit-scrollbar-thumb {
  background: rgba(129, 140, 248, 0.3);
  border-radius: 9999px;
}
.memecord-deck-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(129, 140, 248, 0.55);
}

.memecord-deck-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 12px;
  color: #94a3b8;
  text-align: center;
}

/* Individual Meme Card */
.memecord-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
  user-select: none;
  min-height: 96px;
  box-sizing: border-box;
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.16s ease, border-color 0.18s ease, box-shadow 0.2s ease;
}

.memecord-card:hover {
  transform: translateY(-4px) scale(1.04);
  background: rgba(99, 102, 241, 0.16);
  border-color: rgba(165, 180, 252, 0.6);
  box-shadow: 0 14px 28px -4px rgba(0, 0, 0, 0.65), 0 0 18px rgba(99, 102, 241, 0.35);
  z-index: 5;
}

.memecord-card:active {
  transform: translateY(-1px) scale(0.97);
}

.memecord-card-hotkey {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 8.5px;
  font-weight: 800;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #c7d2fe;
  background: rgba(10, 15, 29, 0.94);
  border: 1px solid rgba(129, 140, 248, 0.55);
  border-radius: 6px;
  padding: 1px 5px;
  line-height: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  z-index: 2;
  cursor: default;
}

.memecord-card-hotkey.editable {
  cursor: pointer;
  border-color: #f59e0b;
  color: #fef3c7;
  background: rgba(245, 158, 11, 0.25);
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
  transition: all 0.18s ease;
}
.memecord-card-hotkey.editable:hover {
  transform: scale(1.15);
  background: #f59e0b;
  color: #1e1b4b;
}

/* Keybinding Modal & Quick Keys */
.memecord-keybind-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(15, 23, 42, 0.96);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 22px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.85), 0 0 35px rgba(99, 102, 241, 0.35);
  padding: 22px 24px;
  width: min(92vw, 420px);
  z-index: 2147483647;
  pointer-events: auto !important;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  animation: memecord-menu-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.memecord-keybind-display-box {
  background: rgba(0, 0, 0, 0.45);
  border: 2px dashed rgba(129, 140, 248, 0.6);
  border-radius: 14px;
  padding: 12px;
  margin: 10px auto 0 auto;
  width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.memecord-keybind-display-box.clash {
  border-color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.15) !important;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.45) !important;
}

.memecord-keybind-status {
  font-size: 11px;
  font-weight: 700;
  margin-top: 8px;
  padding: 5px 10px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.2s ease;
}
.memecord-keybind-status.error {
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.22);
  border: 1px solid rgba(239, 68, 68, 0.4);
  animation: memecord-shake 0.25s ease-in-out;
}
.memecord-keybind-status.success {
  color: #6ee7b7;
  background: rgba(16, 185, 129, 0.18);
  border: 1px solid rgba(16, 185, 129, 0.35);
}

@keyframes memecord-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.memecord-keybind-large-key {
  font-size: 32px;
  font-weight: 900;
  color: #ffffff;
  font-family: ui-monospace, SFMono-Regular, monospace;
  text-shadow: 0 0 14px rgba(129, 140, 248, 0.8);
  line-height: 1.2;
}

.memecord-keybind-press-hint {
  font-size: 10px;
  color: #34d399;
  font-weight: 700;
  margin-top: 4px;
  animation: memecord-pulse 1.8s infinite;
}

.memecord-keybind-quick-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 5px;
  margin-top: 4px;
}

.memecord-quick-key-btn {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  border-radius: 6px;
  padding: 6px 0;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  font-family: ui-monospace, SFMono-Regular, monospace;
  transition: all 0.15s ease;
}
.memecord-quick-key-btn:hover {
  background: rgba(99, 102, 241, 0.35);
  border-color: #818cf8;
  color: #fff;
  transform: translateY(-1px);
}
.memecord-quick-key-btn.active {
  background: #6366f1;
  border-color: #a5b4fc;
  color: #fff;
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.6);
}

.memecord-quick-key-btn.taken {
  opacity: 0.4;
  border-style: dashed;
  color: #94a3b8;
}
.memecord-quick-key-btn.taken:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: #ef4444;
  color: #fca5a5;
  opacity: 0.85;
}

.memecord-card-thumb-wrap {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.35);
  margin-top: 3px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.memecord-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 9px;
  display: block;
}

.memecord-card-emoji-fallback {
  display: none !important;
}

.memecord-card-name {
  font-size: 11px;
  font-weight: 700;
  color: #f1f5f9;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px;
  margin-top: 5px;
}

/* Add Meme Card in Grid */
.memecord-card.add-card {
  border: 1.5px dashed rgba(165, 180, 252, 0.35);
  background: rgba(99, 102, 241, 0.05);
  justify-content: center;
  gap: 4px;
}
.memecord-card.add-card:hover {
  border-color: #818cf8;
  background: rgba(99, 102, 241, 0.2);
  transform: translateY(-3px) scale(1.04);
}
.memecord-add-card-icon {
  font-size: 24px;
  font-weight: 700;
  color: #818cf8;
}

/* Wiggle animation during edit mode */
.memecord-card.wiggling {
  animation: memecord-wiggle 0.28s infinite alternate ease-in-out;
}
.memecord-card.wiggling:nth-child(even) {
  animation-duration: 0.32s;
  animation-delay: 0.04s;
}

@keyframes memecord-wiggle {
  0% { transform: rotate(-2.5deg); }
  100% { transform: rotate(2.5deg); }
}

.memecord-card-delete-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #ef4444;
  border: 1.5px solid #ffffff;
  color: #ffffff;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.7);
  cursor: pointer;
  z-index: 10;
  transition: transform 0.15s ease;
}
.memecord-card-delete-badge:hover {
  transform: scale(1.22);
  background: #dc2626;
}

.memecord-click-ripple {
  position: absolute;
  inset: -4px;
  border-radius: 14px;
  border: 2px solid #818cf8;
  pointer-events: none;
  animation: memecord-ripple-anim 0.38s ease-out forwards;
}

@keyframes memecord-ripple-anim {
  0% { transform: scale(0.9); opacity: 1; border-color: #a5b4fc; }
  100% { transform: scale(1.15); opacity: 0; border-color: #6366f1; }
}

/* Footer Bar */
.memecord-deck-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.28);
  font-size: 11px;
  color: #94a3b8;
}

.memecord-deck-hint strong {
  color: #c7d2fe;
}

.memecord-deck-pos-wrap {
  display: flex;
  align-items: center;
  gap: 5px;
}

.memecord-pos-pill {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.memecord-pos-pill:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.memecord-pos-pill.active {
  background: rgba(99, 102, 241, 0.4);
  border-color: #818cf8;
  color: #e0e7ff;
}

/* Minimized Mode Pebble with Logo */
/* Facebook Messenger-style Floating Bubble */
.memecord-summon-bubble {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.98));
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 2px solid rgba(129, 140, 248, 0.6);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.75), 0 0 24px rgba(99, 102, 241, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto !important;
  z-index: 2147483646;
  user-select: none;
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease, border-color 0.2s ease;
  animation: memecord-bubble-bounce-in 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.memecord-summon-bubble:hover {
  transform: scale(1.12);
  border-color: rgba(165, 180, 252, 0.95);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.85), 0 0 32px rgba(99, 102, 241, 0.65), inset 0 1px 2px rgba(255, 255, 255, 0.5);
}

.memecord-summon-bubble:active {
  transform: scale(0.92);
}

.memecord-summon-bubble.popping-out {
  animation: memecord-bubble-pop-out 0.18s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.memecord-summon-bubble-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  pointer-events: none;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5));
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.memecord-summon-bubble:hover .memecord-summon-bubble-logo {
  transform: scale(1.08);
}

.memecord-summon-bubble-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 19px;
  height: 19px;
  padding: 0 4px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: 2px solid #0f172a;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.memecord-summon-bubble-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10b981;
  border: 1.5px solid #0f172a;
  box-shadow: 0 0 8px #10b981;
}

@keyframes memecord-bubble-bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  65% {
    transform: scale(1.16);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes memecord-bubble-pop-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.2);
  }
}

/* Floating Rich Tooltip */
.memecord-tooltip {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: rgba(10, 15, 29, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 5px 11px;
  color: #f8fafc;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(99, 102, 241, 0.2);
  z-index: 2147483647;
  display: flex;
  align-items: center;
  gap: 6px;
}
.memecord-dock-btn:hover .memecord-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.memecord-dock-btn:hover .memecord-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Glassmorphic Context Menu */
.memecord-context-menu {
  position: fixed;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 5px;
  z-index: 2147483647;
  pointer-events: auto !important;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 150px;
  animation: memecord-menu-pop 0.15s ease-out;
}
@keyframes memecord-menu-pop {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

.memecord-menu-item {
  padding: 7px 12px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: #f8fafc;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s ease;
}
.memecord-menu-item:hover {
  background: rgba(99, 102, 241, 0.3);
  color: #fff;
}
.memecord-menu-item.danger:hover {
  background: rgba(239, 68, 68, 0.25);
  color: #fca5a5;
}

/* Quick Add Glass Modal */
.memecord-quick-add-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 22px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.85), 0 0 35px rgba(99, 102, 241, 0.35);
  padding: 22px 24px;
  width: min(92vw, 420px);
  z-index: 2147483647;
  pointer-events: auto !important;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: memecord-menu-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.memecord-modal-title {
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: space-between;
  letter-spacing: -0.2px;
}

.memecord-modal-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 20px;
  padding: 2px 6px;
  border-radius: 6px;
  transition: all 0.12s ease;
}
.memecord-modal-close:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.memecord-input-field {
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  padding: 9px 12px;
  color: #fff;
  font-size: 13px;
  box-sizing: border-box;
  transition: border-color 0.15s ease;
}
.memecord-input-field:focus {
  outline: none;
  border-color: #818cf8;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
}

.memecord-preview-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.memecord-preview-thumb {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  background: #1e293b;
}

.memecord-modal-btn-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
}

.memecord-btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  color: #fff;
  border-radius: 10px;
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
}
.memecord-btn-primary:hover {
  filter: brightness(1.12);
  transform: translateY(-1px);
}
.memecord-btn-primary:active {
  transform: translateY(0);
}

.memecord-btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #cbd5e1;
  border-radius: 10px;
  padding: 9px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.memecord-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

/* Floating Toast */
.memecord-toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  background: rgba(15, 23, 42, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(99, 102, 241, 0.45);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6), 0 0 24px rgba(99, 102, 241, 0.3);
  color: #f8fafc;
  padding: 8px 22px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2147483647;
}

.memecord-toast.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.memecord-toast.hiding {
  opacity: 0;
  transform: translateX(-50%) translateY(-15px);
}
`;
