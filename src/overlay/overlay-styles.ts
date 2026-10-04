export const OVERLAY_CSS = `
/* MemeMeet Overlay Root */
#mememeet-overlay-root {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none !important;
  z-index: 2147483647 !important;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  user-select: none;
}

/* Meme Container */
.mememeet-meme-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.6);
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.24s ease-out;
  filter: drop-shadow(0 20px 35px rgba(0, 0, 0, 0.65));
}

.mememeet-meme-box.visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.mememeet-meme-box.hiding {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.85);
  transition: transform 0.25s ease-in, opacity 0.25s ease-in;
}

.mememeet-meme-image {
  max-width: min(85vw, 480px);
  max-height: min(65vh, 420px);
  border-radius: 18px;
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  object-fit: contain;
  background: #0f172a;
}

.mememeet-meme-title {
  margin-top: 12px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #f8fafc;
  padding: 6px 18px;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Debug HUD */
.mememeet-debug-hud {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
  border-radius: 14px;
  padding: 14px 18px;
  color: #f8fafc;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
  min-width: 240px;
  pointer-events: none;
  opacity: 0.95;
  transition: opacity 0.2s ease;
}

.mememeet-hud-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 800;
  letter-spacing: 0.8px;
  font-size: 11px;
  color: #a78bfa;
}

.mememeet-hud-row {
  display: flex;
  justify-content: space-between;
  margin: 3px 0;
}

.mememeet-hud-label {
  color: #94a3b8;
}

.mememeet-hud-value {
  font-weight: 700;
  color: #38bdf8;
}

.mememeet-hud-value.active {
  color: #4ade80;
}

.mememeet-hud-value.cooldown {
  color: #fb923c;
}

.mememeet-hud-bar-container {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 6px;
  overflow: hidden;
}

.mememeet-hud-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #818cf8, #38bdf8);
  width: 0%;
  transition: width 0.08s ease;
}

.mememeet-hud-footer {
  margin-top: 10px;
  padding-top: 6px;
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
  font-size: 10px;
  color: #94a3b8;
  text-align: center;
}

/* Welcome Toast Notification */
.mememeet-toast {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(99, 102, 241, 0.4);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.55), 0 0 20px rgba(99, 102, 241, 0.25);
  color: #f8fafc;
  padding: 10px 22px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2147483647;
}

.mememeet-toast.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.mememeet-toast.hiding {
  opacity: 0;
  transform: translateX(-50%) translateY(-15px);
}

/* Floating Dock for Google Meet */
.mememeet-dock {
  position: absolute;
  bottom: 80px;
  left: 20px;
  background: rgba(15, 23, 42, 0.90);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto !important;
  color: #f8fafc;
  font-size: 12px;
  transition: all 0.25s ease;
  z-index: 2147483646;
}

.mememeet-dock:hover {
  border-color: rgba(99, 102, 241, 0.45);
  box-shadow: 0 20px 42px rgba(0, 0, 0, 0.6), 0 0 24px rgba(99, 102, 241, 0.2);
}

.mememeet-dock-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  letter-spacing: 0.3px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.mememeet-dock-badge:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mememeet-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #94a3b8;
}

.mememeet-status-dot.active {
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e;
}

.mememeet-status-dot.pending {
  background: #eab308;
  box-shadow: 0 0 8px #eab308;
}

.mememeet-status-dot.error {
  background: #ef4444;
}

.mememeet-dock-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mememeet-dock-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  user-select: none;
}

.mememeet-dock-btn:hover {
  background: rgba(99, 102, 241, 0.4);
  border-color: rgba(99, 102, 241, 0.6);
  transform: translateY(-2px);
}

.mememeet-dock-btn:active {
  transform: translateY(0);
}

.mememeet-dock-btn.hud-btn {
  font-size: 11px;
  font-weight: 700;
  padding: 5px 9px;
  color: #a78bfa;
}

.mememeet-dock-btn.hud-btn.active {
  background: rgba(139, 92, 246, 0.35);
  border-color: #8b5cf6;
  color: #c4b5fd;
}
`;
