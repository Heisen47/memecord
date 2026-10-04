import{a as e,c as t,d as n,i as r,l as i,n as a,o,r as s,s as c,t as l,u}from"./jsx-runtime-CnNIXZDt.js";import{t as d}from"./config-BkiPBuqK.js";var f=n(u(),1),p=n(i(),1),m=class{element=null;btnContainer=null;contextMenu=null;isCollapsed=!1;isEditMode=!1;memes=[];callbacks;isDragging=!1;dragStartX=0;dragStartY=0;initialLeft=0;initialTop=0;constructor(e,t,n){this.memes=t,this.callbacks=n,this.createDom(e),this.setupDraggable(),this.setupOutsideClickListener()}createDom(e){let t=document.createElement(`div`);t.className=`memecord-dock`;let n=document.createElement(`div`);n.className=`memecord-dock-drag-handle`,n.title=`Drag toolbar anywhere`,n.textContent=`⋮⋮`,t.appendChild(n);let r=document.createElement(`div`);r.className=`memecord-dock-badge`,r.title=`Click to collapse/expand toolbar`;let i=document.createElement(`span`);i.className=`memecord-status-dot`;let a=document.createElement(`span`);a.id=`memecord-dock-title`,a.textContent=`🎭 Memecord`,r.appendChild(i),r.appendChild(a),r.addEventListener(`click`,e=>{e.stopPropagation(),this.toggleCollapse()}),t.appendChild(r);let o=document.createElement(`div`);o.className=`memecord-dock-buttons`,this.btnContainer=o,this.renderButtons(),t.appendChild(o),e.appendChild(t),this.element=t,this.restorePosition()}updateMemes(e){this.memes=e,this.renderButtons()}renderButtons(){if(!this.btnContainer)return;this.btnContainer.innerHTML=``,this.memes.forEach((e,t)=>{let n=document.createElement(`button`);n.className=`memecord-dock-btn`,n.dataset.memeId=e.id;let r=document.createElement(`span`);r.textContent=e.emoji||`✨`,n.appendChild(r);let i=e.hotkey||a(t);if(i){let e=document.createElement(`span`);e.className=`memecord-hotkey-badge`,e.textContent=i,n.appendChild(e)}let o=document.createElement(`div`);if(o.className=`memecord-tooltip`,o.innerHTML=`<span>${e.name}</span>${i?`<span style="color:#818cf8; font-weight:800;">[${i}]</span>`:``}`,n.appendChild(o),this.isEditMode){let t=document.createElement(`span`);t.className=`memecord-delete-badge`,t.textContent=`✕`,t.title=`Delete ${e.name}`,t.addEventListener(`click`,t=>{t.stopPropagation(),this.callbacks.onDeleteMeme(e.id)}),n.appendChild(t)}n.addEventListener(`click`,t=>{t.stopPropagation(),this.isEditMode?this.callbacks.onDeleteMeme(e.id):this.callbacks.onTriggerMeme(e)}),n.addEventListener(`contextmenu`,t=>{t.preventDefault(),t.stopPropagation(),this.openContextMenu(t.clientX,t.clientY,e)}),this.btnContainer.appendChild(n)});let e=document.createElement(`button`);e.className=`memecord-dock-btn action-btn edit-toggle ${this.isEditMode?`active`:``}`,e.title=this.isEditMode?`Done managing memes`:`Manage / Remove memes`,e.textContent=this.isEditMode?`✓`:`✏️`,e.addEventListener(`click`,e=>{e.stopPropagation(),this.toggleEditMode()}),this.btnContainer.appendChild(e);let t=document.createElement(`button`);t.className=`memecord-dock-btn action-btn add-btn`,t.title=`Add new meme (Paste Tenor, Giphy, or image URL)`,t.textContent=`+`,t.addEventListener(`click`,e=>{e.stopPropagation(),this.isEditMode&&this.toggleEditMode(),this.callbacks.onAddMeme()}),this.btnContainer.appendChild(t)}toggleEditMode(){this.isEditMode=!this.isEditMode,this.element&&(this.isEditMode?this.element.classList.add(`edit-mode`):this.element.classList.remove(`edit-mode`)),this.renderButtons()}toggleCollapse(){this.isCollapsed=!this.isCollapsed;let e=this.element?.querySelector(`#memecord-dock-title`);this.btnContainer&&(this.btnContainer.style.display=this.isCollapsed?`none`:`flex`),e&&(e.textContent=this.isCollapsed?`🎭 ${this.memes.length}`:`🎭 Memecord`)}openContextMenu(e,t,n){this.closeContextMenu();let r=document.createElement(`div`);r.className=`memecord-context-menu`;let i=Math.min(e,window.innerWidth-180),a=Math.max(10,t-90);r.style.left=`${i}px`,r.style.top=`${a}px`;let o=document.createElement(`button`);o.className=`memecord-menu-item`,o.innerHTML=`<span>▶️</span><span>Trigger "${n.name}"</span>`,o.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),this.callbacks.onTriggerMeme(n)}),r.appendChild(o);let s=document.createElement(`button`);s.className=`memecord-menu-item danger`,s.innerHTML=`<span>🗑️</span><span>Remove from Dock</span>`,s.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),this.callbacks.onDeleteMeme(n.id)}),r.appendChild(s),document.body.appendChild(r),this.contextMenu=r}closeContextMenu(){this.contextMenu&&this.contextMenu.parentElement&&(this.contextMenu.remove(),this.contextMenu=null)}setupOutsideClickListener(){document.addEventListener(`click`,()=>{this.closeContextMenu()})}setupDraggable(){if(!this.element)return;let e=e=>{if(e.target.tagName===`BUTTON`||e.target.tagName===`INPUT`)return;this.isDragging=!0,this.dragStartX=e.clientX,this.dragStartY=e.clientY;let r=this.element.getBoundingClientRect();this.initialLeft=r.left,this.initialTop=r.top,document.addEventListener(`mousemove`,t),document.addEventListener(`mouseup`,n),e.preventDefault()},t=e=>{if(!this.isDragging||!this.element)return;let t=e.clientX-this.dragStartX,n=e.clientY-this.dragStartY,r=this.initialLeft+t,i=this.initialTop+n,a=window.innerWidth-this.element.offsetWidth-10,o=window.innerHeight-this.element.offsetHeight-10;r=Math.max(10,Math.min(a,r)),i=Math.max(10,Math.min(o,i)),this.element.style.left=`${r}px`,this.element.style.top=`${i}px`,this.element.style.bottom=`auto`,this.element.style.transform=`none`},n=()=>{if(this.isDragging&&(this.isDragging=!1,document.removeEventListener(`mousemove`,t),document.removeEventListener(`mouseup`,n),this.element)){let e=this.element.getBoundingClientRect();try{localStorage.setItem(`memecord_dock_pos`,JSON.stringify({left:e.left,top:e.top}))}catch{}}};this.element.addEventListener(`mousedown`,e)}restorePosition(){try{let e=localStorage.getItem(`memecord_dock_pos`);if(e&&this.element){let{left:t,top:n}=JSON.parse(e);if(typeof t==`number`&&typeof n==`number`){let e=window.innerWidth-120,r=window.innerHeight-50;this.element.style.left=`${Math.max(10,Math.min(e,t))}px`,this.element.style.top=`${Math.max(10,Math.min(r,n))}px`,this.element.style.bottom=`auto`,this.element.style.transform=`none`}}}catch{}}setVisible(e){this.element&&(this.element.style.display=e?`flex`:`none`)}destroy(){this.closeContextMenu(),this.element&&this.element.parentElement&&(this.element.parentElement.removeChild(this.element),this.element=null)}},h=`
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
  background: rgba(15, 23, 42, 0.76);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 48px -8px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.22);
  border-radius: 9999px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  pointer-events: auto !important;
  color: #f8fafc;
  font-size: 13px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2147483646;
  max-width: 95vw;
  box-sizing: border-box;
}

.memecord-dock:hover {
  background: rgba(15, 23, 42, 0.86);
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 24px 56px -6px rgba(0, 0, 0, 0.75), 0 0 24px rgba(99, 102, 241, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.memecord-dock-drag-handle {
  cursor: grab;
  color: #64748b;
  display: flex;
  align-items: center;
  padding: 4px 5px;
  user-select: none;
  font-size: 13px;
  letter-spacing: 1px;
  transition: color 0.15s ease;
}
.memecord-dock-drag-handle:hover {
  color: #a5b4fc;
}
.memecord-dock-drag-handle:active {
  cursor: grabbing;
  color: #818cf8;
}

.memecord-dock-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  letter-spacing: -0.2px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 12px;
  transition: all 0.18s ease;
}
.memecord-dock-badge:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.2);
}

.memecord-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: memecord-pulse 2.2s infinite;
}

@keyframes memecord-pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.25); opacity: 0.75; }
  100% { transform: scale(1); opacity: 1; }
}

.memecord-dock-buttons {
  display: flex;
  align-items: center;
  gap: 5px;
  overflow-x: auto;
  max-width: 78vw;
  padding: 2px 4px;
}
.memecord-dock-buttons::-webkit-scrollbar {
  display: none;
}

/* Individual Meme Squircle Button */
.memecord-dock-btn {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f8fafc;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 16px;
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
  background: rgba(99, 102, 241, 0.4);
  border-color: rgba(165, 180, 252, 0.7);
  transform: translateY(-5px) scale(1.15);
  box-shadow: 0 10px 22px rgba(99, 102, 241, 0.45);
  z-index: 10;
}

.memecord-dock-btn:active {
  transform: scale(0.92);
}

/* Hotkey Badge */
.memecord-hotkey-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  font-size: 8px;
  font-weight: 800;
  color: #c7d2fe;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(129, 140, 248, 0.5);
  border-radius: 9999px;
  padding: 1px 4px;
  line-height: 1;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

/* Delete badge in edit mode */
.memecord-delete-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
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
  0% { transform: rotate(-2.5deg); }
  100% { transform: rotate(2.5deg); }
}

/* Action Buttons (Edit mode / Add) */
.memecord-dock-btn.action-btn {
  border-radius: 50%;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
}
.memecord-dock-btn.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.memecord-dock-btn.edit-toggle.active {
  background: rgba(239, 68, 68, 0.3);
  border-color: #ef4444;
  color: #fca5a5;
}

.memecord-dock-btn.add-btn {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3));
  border: 1px solid rgba(129, 140, 248, 0.5);
  color: #e0e7ff;
  font-size: 16px;
  font-weight: 700;
}
.memecord-dock-btn.add-btn:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(139, 92, 246, 0.6));
  border-color: #818cf8;
  color: #fff;
  transform: translateY(-4px) scale(1.15);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.5);
}

/* Floating Rich Tooltip */
.memecord-tooltip {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  padding: 5px 10px;
  color: #f8fafc;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: all 0.16s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  z-index: 2147483647;
  display: flex;
  align-items: center;
  gap: 6px;
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
`,g=class{root=null;currentMemeBox=null;currentToast=null;currentModal=null;hideTimeoutId=null;removeTimeoutId=null;toastTimeoutId=null;floatingDock=null;settings;callbacks;constructor(e,t={}){this.settings=e,this.callbacks=t,this.initRoot(),this.root&&(this.floatingDock=new m(this.root,this.settings.memes,{onTriggerMeme:e=>{this.callbacks.onTriggerMeme?.(e),this.showMeme(e)},onAddMeme:()=>{this.openQuickAddModal()},onDeleteMeme:e=>{let t=this.settings.memes.find(t=>t.id===e);this.callbacks.onDeleteMeme?.(e),this.showToast(`🗑️ Removed "${t?.name||`Meme`}" from dock`)}}),this.floatingDock.setVisible(this.settings.dockVisible&&this.settings.enabled))}updateSettings(e){this.settings=e,this.floatingDock?.updateMemes(e.memes),this.floatingDock?.setVisible(e.dockVisible&&e.enabled)}setDockVisible(e){this.floatingDock?.setVisible(e)}showToast(e,t=2500){if(!this.root)return;this.currentToast&&=(this.currentToast.remove(),null),this.toastTimeoutId&&=(clearTimeout(this.toastTimeoutId),null);let n=document.createElement(`div`);n.className=`memecord-toast`,n.innerHTML=`<span>✨</span><span>${e}</span>`,this.root.appendChild(n),this.currentToast=n,requestAnimationFrame(()=>{n.classList.add(`visible`)}),this.toastTimeoutId=setTimeout(()=>{n.classList.remove(`visible`),n.classList.add(`hiding`),setTimeout(()=>{n.parentElement&&n.remove(),this.currentToast===n&&(this.currentToast=null)},300)},t)}showMeme(e){if(!this.root||!this.settings.enabled)return;this.settings.soundEnabled&&this.playTriggerSound(),this.hideTimeoutId&&=(clearTimeout(this.hideTimeoutId),null),this.removeTimeoutId&&=(clearTimeout(this.removeTimeoutId),null),this.currentMemeBox&&=(this.currentMemeBox.remove(),null);let t=e.assetUrl;if(t.startsWith(`http://`)||t.startsWith(`https://`)||t.startsWith(`data:`))t=e.assetUrl;else if(typeof chrome<`u`&&chrome.runtime?.id&&chrome.runtime?.getURL)try{t=chrome.runtime.getURL(e.assetUrl.replace(/^\//,``))}catch{t=e.assetUrl.startsWith(`/`)?e.assetUrl:`/${e.assetUrl}`}else t=e.assetUrl.startsWith(`/`)?e.assetUrl:`/${e.assetUrl}`;let n=this.getPositionClass(this.settings.position||`top-center`),r=document.createElement(`div`);r.className=`memecord-meme-box ${n}`;let i=t.startsWith(`data:video/`)||t.endsWith(`.mp4`)||t.endsWith(`.webm`),a;if(i){let e=document.createElement(`video`);e.className=`memecord-meme-image`,e.src=t,e.autoplay=!0,e.loop=!0,e.muted=!0,e.playsInline=!0,a=e}else{let n=document.createElement(`img`);n.className=`memecord-meme-image`,n.referrerPolicy=`no-referrer`,n.src=t,n.alt=e.name,n.onerror=async()=>{if(t.startsWith(`http`)&&!t.startsWith(`data:`)){console.warn(`[Memecord] Direct image blocked by page CSP, converting via background proxy...`);let e=await s(t);e&&e.startsWith(`data:`)&&(n.src=e)}},a=n}let o=document.createElement(`div`);o.className=`memecord-meme-title`,o.textContent=`${e.emoji||`✨`} ${e.name}`,r.appendChild(a),r.appendChild(o),this.root.appendChild(r),this.currentMemeBox=r,requestAnimationFrame(()=>{r.classList.add(`visible`)});let c=e.durationMs||this.settings.defaultDurationMs||2500;this.hideTimeoutId=setTimeout(()=>{r.classList.remove(`visible`),r.classList.add(`hiding`),this.removeTimeoutId=setTimeout(()=>{r.parentElement&&r.remove(),this.currentMemeBox===r&&(this.currentMemeBox=null)},300)},c)}openQuickAddModal(){if(!this.root)return;this.currentModal&&=(this.currentModal.remove(),null);let e=a(this.settings.memes.length),t=document.createElement(`div`);t.className=`memecord-quick-add-modal`,t.innerHTML=`
      <div class="memecord-modal-title">
        <span>➕ Add Meme to Dock</span>
        <button class="memecord-modal-close" id="memecord-modal-close-btn">&times;</button>
      </div>

      <div>
        <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 5px;">
          GIF / Image / Tenor / Giphy URL
        </label>
        <input type="url" class="memecord-input-field" id="memecord-add-url" placeholder="Paste Tenor, Giphy, or any GIF link..." autofocus />
        <span id="memecord-url-status" style="font-size: 10px; color: #818cf8; margin-top: 3px; display: block;"></span>
      </div>

      <div style="display: flex; gap: 8px;">
        <div style="flex: 1;">
          <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 5px;">Meme Name</label>
          <input type="text" class="memecord-input-field" id="memecord-add-name" placeholder="e.g. Happy Cat" />
        </div>
        <div style="width: 65px;">
          <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 5px;">Emoji</label>
          <input type="text" class="memecord-input-field" id="memecord-add-emoji" value="✨" maxlength="3" style="text-align: center;" />
        </div>
        <div style="width: 55px;">
          <label style="font-size: 11px; color: #94a3b8; display: block; margin-bottom: 5px;">Key</label>
          <input type="text" class="memecord-input-field" id="memecord-add-key" value="${e}" maxlength="2" style="text-align: center;" />
        </div>
      </div>

      <!-- Live Preview -->
      <div class="memecord-preview-wrap" id="memecord-preview-wrap" style="display: none;">
        <img class="memecord-preview-thumb" id="memecord-preview-thumb" src="" alt="preview" />
        <div style="flex: 1; overflow: hidden;">
          <div id="memecord-preview-name" style="font-weight: 700; font-size: 12px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">Preview</div>
          <div style="font-size: 10px; color: #94a3b8;">Ready to bind to key [${e}]</div>
        </div>
      </div>

      <div class="memecord-modal-btn-row">
        <button class="memecord-btn-secondary" id="memecord-add-cancel">Cancel</button>
        <button class="memecord-btn-primary" id="memecord-add-submit">Add to Dock</button>
      </div>
    `,this.root.appendChild(t),this.currentModal=t;let n=()=>{this.currentModal&&=(this.currentModal.remove(),null)};t.querySelector(`#memecord-modal-close-btn`)?.addEventListener(`click`,n),t.querySelector(`#memecord-add-cancel`)?.addEventListener(`click`,n);let i=t.querySelector(`#memecord-add-url`),o=t.querySelector(`#memecord-add-name`),c=t.querySelector(`#memecord-add-emoji`),l=t.querySelector(`#memecord-add-key`),u=t.querySelector(`#memecord-url-status`),d=t.querySelector(`#memecord-preview-wrap`),f=t.querySelector(`#memecord-preview-thumb`),p=t.querySelector(`#memecord-preview-name`),m=null,h=``,g=()=>{let e=i.value.trim();if(!e){d.style.display=`none`,u.textContent=``;return}u.textContent=`Resolving media link...`,m&&clearTimeout(m),m=setTimeout(async()=>{try{let t=await r(e);h=t.url,t.name&&!o.value&&(o.value=t.name),t.emoji&&c.value===`✨`&&(c.value=t.emoji),u.textContent=`✓ Ready to add`,u.style.color=`#10b981`,f.src=h,p.textContent=`${c.value} ${o.value||`Meme`}`,d.style.display=`flex`}catch(e){u.textContent=e?.message||`Invalid URL`,u.style.color=`#ef4444`}},250)};i.addEventListener(`input`,g),i.addEventListener(`paste`,()=>setTimeout(g,10)),t.querySelector(`#memecord-add-submit`)?.addEventListener(`click`,async()=>{let a=i.value.trim();if(!a){i.focus(),i.style.borderColor=`#ef4444`;return}let d=t.querySelector(`#memecord-add-submit`);d.disabled=!0,d.textContent=`Saving...`;try{let t=await r(a),i=await s(t.url),u=o.value.trim()||t.name||`Custom Meme`,d=c.value.trim()||`✨`,f=l.value.trim()||e,p={id:`meme_${Date.now()}`,name:u,emoji:d,assetUrl:i,hotkey:f,durationMs:this.settings.defaultDurationMs||2500};n(),this.callbacks.onAddMeme?.(p),this.showToast(`Added "${u}" [Key ${f}]!`)}catch(e){u.textContent=`Error: ${e?.message||`Failed to save`}`,u.style.color=`#ef4444`,d.disabled=!1,d.textContent=`Add to Dock`}})}playTriggerSound(){try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createGain();t.type=`sine`,t.frequency.setValueAtTime(480,e.currentTime),t.frequency.exponentialRampToValueAtTime(960,e.currentTime+.1),n.gain.setValueAtTime(.12,e.currentTime),n.gain.exponentialRampToValueAtTime(.001,e.currentTime+.1),t.connect(n),n.connect(e.destination),t.start(),t.stop(e.currentTime+.11)}catch{}}getPositionClass(e){switch(e){case`center`:return`pos-center`;case`top-right`:return`pos-top-right`;case`bottom-right`:return`pos-bottom-right`;default:return`pos-top-center`}}initRoot(){if(!document.getElementById(`memecord-injected-styles`)){let e=document.createElement(`style`);e.id=`memecord-injected-styles`,e.textContent=h,(document.head||document.documentElement).appendChild(e)}let e=document.getElementById(`memecord-overlay-root`);e||(e=document.createElement(`div`),e.id=`memecord-overlay-root`,(document.body||document.documentElement).appendChild(e)),this.root=e}destroy(){this.hideTimeoutId&&clearTimeout(this.hideTimeoutId),this.removeTimeoutId&&clearTimeout(this.removeTimeoutId),this.toastTimeoutId&&clearTimeout(this.toastTimeoutId),this.floatingDock&&=(this.floatingDock.destroy(),null),this.currentModal&&=(this.currentModal.remove(),null),this.root&&this.root.parentElement&&(this.root.parentElement.removeChild(this.root),this.root=null)}},_=l(),v=()=>{let n=(0,f.useRef)(null),[r,i]=(0,f.useState)(d),[s,l]=(0,f.useState)([]),[u,p]=(0,f.useState)(null),m=e=>{let t=new Date().toLocaleTimeString();l(n=>[`[${t}] ${e}`,...n.slice(0,49)])};(0,f.useEffect)(()=>{o().then(t=>{i(t),n.current=new g(t,{onTriggerMeme:e=>{p(e.name),m(`Triggered via dock: ${e.name}`)},onAddMeme:async t=>{let n=await e(t);i(n),m(`Added new meme: ${t.name}`)},onDeleteMeme:async e=>{let t=await c(e);i(t),m(`Deleted meme: ${e}`)}}),m(`Memecord Test Lab initialized. Press 1–9, 0, Q... or click dock buttons.`)});let t=e=>{let t=document.activeElement;if(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`))return;let r=e.key;o().then(t=>{let i=t.memes.find((e,t)=>{let n=e.hotkey||a(t);return n&&n.toLowerCase()===r.toLowerCase()});i&&(e.preventDefault(),p(i.name),m(`Hotkey [${r}] -> ${i.name}`),n.current?.showMeme(i))})};return window.addEventListener(`keydown`,t),()=>{window.removeEventListener(`keydown`,t),n.current?.destroy(),n.current=null}},[]);let h=e=>{p(e.name),m(`Clicked test button: ${e.name}`),n.current?.showMeme(e)},v=async e=>{let r=await t({position:e});i(r),n.current?.updateSettings(r),m(`Changed overlay position to ${e}`)};return(0,_.jsxs)(`div`,{className:`testlab-container`,children:[(0,_.jsx)(`header`,{className:`testlab-header`,children:(0,_.jsxs)(`div`,{className:`testlab-brand`,children:[(0,_.jsx)(`span`,{className:`testlab-logo`,children:`🎭`}),(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`h1`,{children:`Memecord Test Lab`}),(0,_.jsx)(`p`,{children:`Interactive Sandbox & Meme Trigger Simulator`})]})]})}),(0,_.jsxs)(`div`,{className:`testlab-grid`,children:[(0,_.jsxs)(`div`,{className:`testlab-panel`,children:[(0,_.jsxs)(`h2`,{children:[`Meme Triggers (`,r.memes.length,`)`]}),(0,_.jsx)(`p`,{className:`testlab-sub`,children:`Click any button or press the corresponding hotkey on your keyboard:`}),(0,_.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(140px, 1fr))`,gap:10,margin:`16px 0`},children:r.memes.map((e,t)=>{let n=e.hotkey||(t<9?String(t+1):`-`);return(0,_.jsxs)(`button`,{onClick:()=>h(e),style:{background:u===e.name?`rgba(99, 102, 241, 0.4)`:`rgba(255, 255, 255, 0.06)`,border:`1px solid rgba(255, 255, 255, 0.15)`,borderRadius:12,padding:`12px 10px`,color:`#fff`,cursor:`pointer`,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6,transition:`all 0.15s ease`},children:[(0,_.jsx)(`span`,{style:{fontSize:24},children:e.emoji}),(0,_.jsx)(`span`,{style:{fontSize:12,fontWeight:600,textAlign:`center`},children:e.name}),(0,_.jsxs)(`span`,{style:{fontSize:10,color:`#a5b4fc`,background:`rgba(0,0,0,0.3)`,padding:`2px 6px`,borderRadius:4},children:[`Key [`,n,`]`]})]},e.id)})}),(0,_.jsx)(`h3`,{style:{marginTop:20},children:`Position Preview`}),(0,_.jsx)(`div`,{style:{display:`flex`,gap:8,marginTop:8},children:[`top-center`,`center`,`top-right`,`bottom-right`].map(e=>(0,_.jsx)(`button`,{onClick:()=>v(e),style:{background:r.position===e?`#6366f1`:`rgba(255, 255, 255, 0.08)`,border:`1px solid rgba(255, 255, 255, 0.15)`,color:`#fff`,borderRadius:8,padding:`6px 12px`,fontSize:12,cursor:`pointer`},children:e},e))})]}),(0,_.jsxs)(`div`,{className:`testlab-panel`,children:[(0,_.jsx)(`h2`,{children:`Real-time Event Log`}),(0,_.jsx)(`div`,{style:{background:`rgba(0,0,0,0.4)`,borderRadius:10,padding:12,height:350,overflowY:`auto`,fontFamily:`monospace`,fontSize:12},children:s.map((e,t)=>(0,_.jsx)(`div`,{style:{color:`#38bdf8`,marginBottom:4},children:e},t))})]})]})]})},y=document.getElementById(`root`);y&&p.createRoot(y).render((0,_.jsx)(f.StrictMode,{children:(0,_.jsx)(v,{})}));