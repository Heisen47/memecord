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
   Ultra-Sleek Floating Island Dock
   ========================================= */
.memecord-dock {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 15, 29, 0.78);
  backdrop-filter: blur(32px) saturate(220%);
  -webkit-backdrop-filter: blur(32px) saturate(220%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.75), 0 0 25px rgba(99, 102, 241, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.35);
  border-radius: 9999px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  pointer-events: auto !important;
  color: #f8fafc;
  font-size: 13px;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease, background-color 0.2s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  z-index: 2147483646;
  max-width: 95vw;
  box-sizing: border-box;
  user-select: none;
}

.memecord-dock:hover {
  background: rgba(15, 23, 42, 0.88);
  border-color: rgba(99, 102, 241, 0.55);
  box-shadow: 0 24px 60px -8px rgba(0, 0, 0, 0.85), 0 0 35px rgba(99, 102, 241, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.5);
}

.memecord-dock.hiding {
  opacity: 0;
  transform: translateX(-50%) scale(0.85);
  pointer-events: none !important;
}

.memecord-dock.entering {
  animation: memecord-spring-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes memecord-spring-in {
  0% { opacity: 0; transform: translateX(-50%) scale(0.85); }
  70% { transform: translateX(-50%) scale(1.03); }
  100% { opacity: 1; transform: translateX(-50%) scale(1); }
}

.memecord-dock-drag-handle {
  cursor: grab;
  color: #64748b;
  display: flex;
  align-items: center;
  padding: 4px 6px;
  user-select: none;
  font-size: 13px;
  letter-spacing: 1px;
  transition: color 0.15s ease, transform 0.15s ease;
}
.memecord-dock-drag-handle:hover {
  color: #a5b4fc;
  transform: scale(1.1);
}
.memecord-dock-drag-handle:active {
  cursor: grabbing;
  color: #818cf8;
  transform: scale(0.95);
}

.memecord-dock-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 700;
  letter-spacing: -0.2px;
  cursor: pointer;
  padding: 5px 12px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 12px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.memecord-dock-badge:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(165, 180, 252, 0.5);
  transform: scale(1.04);
}
.memecord-dock-badge:active {
  transform: scale(0.95);
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

.memecord-dock-buttons {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  max-width: 78vw;
  padding: 2px 4px;
}
.memecord-dock-buttons::-webkit-scrollbar {
  display: none;
}

/* Individual Meme Squircle Button */
.memecord-dock-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #f8fafc;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  font-size: 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.2s ease;
  user-select: none;
  position: relative;
  flex-shrink: 0;
}

.memecord-dock-btn:hover {
  background: rgba(99, 102, 241, 0.45);
  border-color: rgba(165, 180, 252, 0.85);
  transform: translateY(-8px) scale(1.22);
  box-shadow: 0 12px 28px rgba(99, 102, 241, 0.55), 0 0 15px rgba(165, 180, 252, 0.4);
  z-index: 10;
}

.memecord-dock-btn:active {
  transform: translateY(-2px) scale(0.92);
}

.memecord-click-ripple {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid #818cf8;
  pointer-events: none;
  animation: memecord-ripple-anim 0.38s ease-out forwards;
}

@keyframes memecord-ripple-anim {
  0% { transform: scale(0.8); opacity: 1; border-color: #a5b4fc; }
  100% { transform: scale(1.6); opacity: 0; border-color: #6366f1; }
}

/* Hotkey Badge */
.memecord-hotkey-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  font-size: 8.5px;
  font-weight: 800;
  color: #c7d2fe;
  background: rgba(10, 15, 29, 0.96);
  border: 1px solid rgba(129, 140, 248, 0.6);
  border-radius: 9999px;
  padding: 1px 4px;
  line-height: 1;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  transition: all 0.15s ease;
}
.memecord-dock-btn:hover .memecord-hotkey-badge {
  background: #6366f1;
  color: #ffffff;
  border-color: #ffffff;
  transform: scale(1.1);
}

/* Delete badge in edit mode */
.memecord-delete-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 17px;
  height: 17px;
  background: #ef4444;
  border: 1.5px solid #ffffff;
  color: #ffffff;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.6);
  cursor: pointer;
  transition: transform 0.15s ease;
  z-index: 20;
}
.memecord-delete-badge:hover {
  transform: scale(1.25);
  background: #dc2626;
}

/* Wiggle animation during delete mode */
.memecord-dock.edit-mode .memecord-dock-btn:not(.action-btn) {
  animation: memecord-wiggle 0.28s infinite alternate ease-in-out;
}
.memecord-dock.edit-mode .memecord-dock-btn:nth-child(even):not(.action-btn) {
  animation-duration: 0.32s;
  animation-delay: 0.05s;
}

@keyframes memecord-wiggle {
  0% { transform: rotate(-3deg); }
  100% { transform: rotate(3deg); }
}

.memecord-dock-divider {
  width: 1px;
  height: 22px;
  background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  margin: 0 3px;
  flex-shrink: 0;
}

/* Action Buttons (Edit mode / Add / Close) */
.memecord-dock-btn.action-btn {
  border-radius: 50%;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #94a3b8;
}
.memecord-dock-btn.action-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.4);
}

.memecord-dock-btn.edit-toggle.active {
  background: rgba(239, 68, 68, 0.35);
  border-color: #ef4444;
  color: #fca5a5;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
}

.memecord-dock-btn.add-btn {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(168, 85, 247, 0.4));
  border: 1px solid rgba(165, 180, 252, 0.6);
  color: #e0e7ff;
  font-size: 17px;
  font-weight: 700;
}
.memecord-dock-btn.add-btn:hover {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-color: #c7d2fe;
  color: #fff;
  transform: translateY(-5px) rotate(90deg) scale(1.18);
  box-shadow: 0 10px 26px rgba(99, 102, 241, 0.6);
}

.memecord-dock-btn.close-btn {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 700;
}
.memecord-dock-btn.close-btn:hover {
  background: rgba(239, 68, 68, 0.35);
  border-color: #f87171;
  color: #fecaca;
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.45);
}

/* Minimized Raycast/Dynamic Island Pebble */
.memecord-summon-bubble {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 15, 29, 0.82);
  backdrop-filter: blur(28px) saturate(210%);
  -webkit-backdrop-filter: blur(28px) saturate(210%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), 0 0 20px rgba(99, 102, 241, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3);
  border-radius: 9999px;
  padding: 7px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  pointer-events: auto !important;
  color: #f8fafc;
  font-size: 12px;
  font-weight: 700;
  z-index: 2147483646;
  user-select: none;
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
  animation: memecord-summon-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.memecord-summon-bubble:hover {
  background: rgba(15, 23, 42, 0.94);
  border-color: rgba(129, 140, 248, 0.65);
  transform: translateX(-50%) translateY(-4px) scale(1.06);
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.75), 0 0 30px rgba(99, 102, 241, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.45);
}

.memecord-summon-bubble:active {
  transform: translateX(-50%) scale(0.96);
}

@keyframes memecord-summon-in {
  0% { opacity: 0; transform: translateX(-50%) scale(0.7); }
  100% { opacity: 1; transform: translateX(-50%) scale(1); }
}

.memecord-summon-icon {
  font-size: 15px;
}

.memecord-summon-label {
  font-size: 12px;
  letter-spacing: -0.2px;
}

.memecord-summon-key {
  font-size: 9px;
  font-weight: 800;
  color: #a5b4fc;
  background: rgba(99, 102, 241, 0.25);
  border: 1px solid rgba(129, 140, 248, 0.4);
  border-radius: 6px;
  padding: 2px 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
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
