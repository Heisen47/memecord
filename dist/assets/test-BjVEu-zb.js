import{a as e,c as t,d as n,f as r,i,l as a,n as o,o as s,r as c,s as l,t as u,u as d}from"./jsx-runtime-DcEGRkAo.js";import{t as f}from"./config-BkiPBuqK.js";var p=r(n(),1),m=r(d(),1);function h(e=`pop`){try{let t=window.AudioContext||window.webkitAudioContext;if(!t)return;let n=new t,r=n.createOscillator(),i=n.createGain();r.type=`sine`;let a=n.currentTime;e===`pop`?(r.frequency.setValueAtTime(440,a),r.frequency.exponentialRampToValueAtTime(880,a+.08),i.gain.setValueAtTime(.09,a),i.gain.exponentialRampToValueAtTime(.001,a+.08),r.start(a),r.stop(a+.09)):e===`minimize`?(r.frequency.setValueAtTime(600,a),r.frequency.exponentialRampToValueAtTime(320,a+.1),i.gain.setValueAtTime(.08,a),i.gain.exponentialRampToValueAtTime(.001,a+.1),r.start(a),r.stop(a+.11)):e===`expand`?(r.frequency.setValueAtTime(360,a),r.frequency.exponentialRampToValueAtTime(720,a+.1),i.gain.setValueAtTime(.08,a),i.gain.exponentialRampToValueAtTime(.001,a+.1),r.start(a),r.stop(a+.11)):e===`delete`&&(r.frequency.setValueAtTime(300,a),r.frequency.exponentialRampToValueAtTime(150,a+.12),i.gain.setValueAtTime(.1,a),i.gain.exponentialRampToValueAtTime(.001,a+.12),r.start(a),r.stop(a+.13))}catch{}}function g(e){return e?e.startsWith(`http://`)||e.startsWith(`https://`)||e.startsWith(`data:`)?e:typeof chrome<`u`&&chrome.runtime&&chrome.runtime.getURL?chrome.runtime.getURL(e.replace(/^\//,``)):e.startsWith(`/`)?e:`/${e}`:``}var _=class{element=null;summonBubble=null;gridContainer=null;countBadge=null;contextMenu=null;activeModal=null;isMinimized=!1;isEditMode=!1;isVisible=!0;searchQuery=``;currentPosition=`center`;memes=[];callbacks;isDragging=!1;dragStartX=0;dragStartY=0;initialLeft=0;initialTop=0;activeDragTarget=null;constructor(e,t,n,r=`center`){this.memes=t,this.callbacks=n,this.currentPosition=r,this.createDom(e),this.setupDraggable(),this.setupOutsideClickListener()}createDom(e){let t=document.createElement(`div`);t.className=`memecord-deck`;let n=document.createElement(`div`);n.className=`memecord-deck-header`;let r=document.createElement(`div`);r.className=`memecord-deck-brand`;let i=document.createElement(`span`);i.className=`memecord-drag-grip`,i.textContent=`⠿`,i.title=`Drag Deck anywhere on screen`;let a=document.createElement(`span`);a.className=`memecord-status-dot`;let o=document.createElement(`span`);o.className=`memecord-deck-title`,o.textContent=`Memecord Deck`;let s=document.createElement(`span`);s.className=`memecord-count-badge`,s.textContent=`${this.memes.length}`,this.countBadge=s,r.appendChild(i),r.appendChild(a),r.appendChild(o),r.appendChild(s),n.appendChild(r);let c=document.createElement(`div`);c.className=`memecord-search-box`;let l=document.createElement(`span`);l.className=`memecord-search-icon`,l.textContent=`🔍`;let u=document.createElement(`input`);u.type=`text`,u.className=`memecord-search-input`,u.placeholder=`Filter memes or key...`,u.addEventListener(`input`,()=>{this.searchQuery=u.value.trim().toLowerCase(),this.renderCards()}),c.appendChild(l),c.appendChild(u),n.appendChild(c);let d=document.createElement(`div`);d.className=`memecord-deck-actions`;let f=document.createElement(`button`);f.className=`memecord-deck-action-btn edit-btn`,f.title=`Edit keybindings or remove memes`,f.textContent=`✏️ Edit`,f.addEventListener(`click`,e=>{e.stopPropagation(),h(`pop`),this.toggleEditMode(),f.classList.toggle(`active`,this.isEditMode),f.textContent=this.isEditMode?`✓ Done`:`✏️ Edit`}),d.appendChild(f);let p=document.createElement(`button`);p.className=`memecord-deck-action-btn add-btn`,p.title=`Add new meme (URL, GIF, Tenor)`,p.innerHTML=`<span>+ Add</span>`,p.addEventListener(`click`,e=>{e.stopPropagation(),h(`pop`),this.isEditMode&&(this.toggleEditMode(),f.classList.remove(`active`),f.textContent=`✏️ Edit`),this.callbacks.onAddMeme()}),d.appendChild(p);let m=document.createElement(`button`);m.className=`memecord-deck-action-btn close-btn`,m.title=`Minimize Deck (Press Alt+M to reopen)`,m.textContent=`✕`,m.addEventListener(`click`,e=>{e.stopPropagation(),this.setMinimized(!0)}),d.appendChild(m),n.appendChild(d),t.appendChild(n);let g=document.createElement(`div`);g.className=`memecord-deck-grid`,this.gridContainer=g,this.renderCards(),t.appendChild(g);let _=document.createElement(`div`);_.className=`memecord-deck-footer`;let v=document.createElement(`div`);v.className=`memecord-deck-hint`,v.innerHTML=`<span>⌨️ Press hotkey <strong>[1–9, 0, Q...]</strong> during call</span>`;let y=document.createElement(`div`);y.className=`memecord-deck-pos-wrap`;let b=document.createElement(`span`);b.style.fontSize=`10px`,b.style.color=`#94a3b8`,b.textContent=`Pos:`,y.appendChild(b),[{key:`center`,label:`Center`},{key:`top-right`,label:`Top-R`},{key:`bottom-right`,label:`Bot-R`}].forEach(e=>{let t=document.createElement(`button`);t.className=`memecord-pos-pill ${this.currentPosition===e.key?`active`:``}`,t.textContent=e.label,t.dataset.pos=e.key,t.addEventListener(`click`,n=>{n.stopPropagation(),y.querySelectorAll(`.memecord-pos-pill`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),this.currentPosition=e.key,this.callbacks.onPositionChange?.(e.key)}),y.appendChild(t)}),_.appendChild(v),_.appendChild(y),t.appendChild(_),e.appendChild(t),this.element=t;let x=document.createElement(`div`);x.className=`memecord-summon-bubble`,x.title=`Open Memecord Deck (Alt+M)`,x.innerHTML=`
      <span class="memecord-status-dot"></span>
      <span class="memecord-summon-icon">🎭</span>
      <span class="memecord-summon-label">Memecord Deck</span>
      <span class="memecord-summon-key">Alt+M</span>
    `,x.style.display=`none`,x.addEventListener(`click`,e=>{e.stopPropagation(),this.setMinimized(!1)}),e.appendChild(x),this.summonBubble=x,this.restorePosition()}updateMemes(e){this.memes=e,this.countBadge&&(this.countBadge.textContent=`${e.length}`),this.renderCards()}setPosition(e){this.currentPosition=e,this.element&&this.element.querySelectorAll(`.memecord-pos-pill`).forEach(t=>{let n=t;n.classList.toggle(`active`,n.dataset.pos===e)})}renderCards(){if(!this.gridContainer)return;this.gridContainer.innerHTML=``;let e=this.memes.filter((e,t)=>{if(!this.searchQuery)return!0;let n=(e.hotkey||o(t)).toLowerCase();return e.name.toLowerCase().includes(this.searchQuery)||e.emoji&&e.emoji.includes(this.searchQuery)||n.includes(this.searchQuery)});if(e.length===0){let e=document.createElement(`div`);e.className=`memecord-deck-empty`,e.innerHTML=`
        <span style="font-size: 26px;">🔍</span>
        <div style="font-weight: 600; margin-top: 6px;">No memes matching "${this.searchQuery}"</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Try another search or add a new meme</div>
      `,this.gridContainer.appendChild(e);return}e.forEach((e,t)=>{let n=this.memes.findIndex(t=>t.id===e.id),r=e.hotkey||o(n>=0?n:t),i=document.createElement(`div`);if(i.className=`memecord-card ${this.isEditMode?`wiggling edit-mode`:``}`,i.dataset.memeId=e.id,i.title=this.isEditMode?`Click to change keybinding [${r}]`:`Click or press [${r}] to trigger`,r){let t=document.createElement(`button`);t.className=`memecord-card-hotkey ${this.isEditMode?`editable`:``}`,t.textContent=this.isEditMode?`${r} ✎`:r,t.title=this.isEditMode?`Click to change keybinding`:`Hotkey [${r}]`,this.isEditMode&&t.addEventListener(`click`,t=>{t.stopPropagation(),this.openKeybindingModal(e)}),i.appendChild(t)}let a=document.createElement(`div`);a.className=`memecord-card-thumb-wrap`;let s=g(e.assetUrl),c=document.createElement(`img`);c.className=`memecord-card-img`,c.alt=e.name,c.loading=`lazy`,c.src=s;let l=document.createElement(`span`);l.className=`memecord-card-emoji-fallback`,l.textContent=e.emoji||`✨`,c.onerror=()=>{c.style.display=`none`,l.style.display=`flex`},a.appendChild(c),a.appendChild(l),i.appendChild(a);let u=document.createElement(`div`);if(u.className=`memecord-card-name`,u.textContent=e.name,i.appendChild(u),this.isEditMode){let t=document.createElement(`button`);t.className=`memecord-card-delete-badge`,t.textContent=`✕`,t.title=`Delete ${e.name}`,t.addEventListener(`click`,t=>{t.stopPropagation(),h(`delete`),this.callbacks.onDeleteMeme(e.id)}),i.appendChild(t)}i.addEventListener(`click`,t=>{t.stopPropagation(),this.isEditMode?(h(`pop`),this.openKeybindingModal(e)):(h(`pop`),this.createClickRipple(i),this.callbacks.onTriggerMeme(e))}),i.addEventListener(`contextmenu`,t=>{t.preventDefault(),t.stopPropagation(),this.openContextMenu(t.clientX,t.clientY,e)}),this.gridContainer.appendChild(i)});let t=document.createElement(`div`);t.className=`memecord-card add-card`,t.title=`Add new meme to deck`,t.innerHTML=`
      <div class="memecord-add-card-icon">+</div>
      <div class="memecord-card-name" style="color: #a5b4fc;">Add Meme</div>
    `,t.addEventListener(`click`,e=>{e.stopPropagation(),h(`pop`),this.isEditMode&&this.toggleEditMode(),this.callbacks.onAddMeme()}),this.gridContainer.appendChild(t)}openKeybindingModal(e){this.closeActiveModal();let t=(e.hotkey||o(0)).toUpperCase(),n=document.createElement(`div`);n.className=`memecord-keybind-modal`,n.innerHTML=`
      <div class="memecord-modal-title">
        <span>⌨️ Change Keybinding</span>
        <button class="memecord-modal-close" id="memecord-keybind-close-btn">&times;</button>
      </div>

      <div style="text-align: center; margin: 12px 0 14px 0;">
        <div style="font-size: 32px; line-height: 1;">${e.emoji||`✨`}</div>
        <div style="font-size: 14px; font-weight: 800; color: #f8fafc; margin-top: 6px;">${e.name}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Press any key on keyboard or select below</div>

        <div class="memecord-keybind-display-box" id="memecord-keybind-box">
          <span style="font-size: 10px; font-weight: 700; color: #a5b4fc; display: block; margin-bottom: 2px;">ACTIVE KEY</span>
          <span class="memecord-keybind-large-key" id="memecord-keybind-val">${t}</span>
          <span class="memecord-keybind-press-hint">⌨️ Press any key now...</span>
        </div>
      </div>

      <div style="font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 6px;">Quick Presets:</div>
      <div class="memecord-keybind-quick-grid" id="memecord-quick-grid">
        ${`1234567890QWERTYASDFGZXCVB`.split(``).map(e=>`<button class="memecord-quick-key-btn ${e===t?`active`:``}" data-key="${e}">${e}</button>`).join(``)}
      </div>

      <div class="memecord-modal-btn-row" style="margin-top: 16px;">
        <button class="memecord-btn-secondary" id="memecord-keybind-cancel">Cancel</button>
        <button class="memecord-btn-primary" id="memecord-keybind-save">Save Keybinding</button>
      </div>
    `,document.body.appendChild(n),this.activeModal=n;let r=n.querySelector(`#memecord-keybind-val`),i=n.querySelector(`#memecord-quick-grid`),a=e=>{t=e.trim().toUpperCase(),r.textContent=t,i.querySelectorAll(`.memecord-quick-key-btn`).forEach(e=>{let n=e;n.classList.toggle(`active`,n.dataset.key===t)}),h(`pop`)};i.addEventListener(`click`,e=>{let t=e.target.closest(`.memecord-quick-key-btn`);t&&t.dataset.key&&(e.stopPropagation(),a(t.dataset.key))});let s=e=>{if(![`Control`,`Alt`,`Shift`,`Meta`].includes(e.key)){if(e.key===`Escape`){c();return}if(e.key===`Enter`){l();return}e.preventDefault(),e.stopPropagation(),a(e.key)}};window.addEventListener(`keydown`,s,!0);let c=()=>{window.removeEventListener(`keydown`,s,!0),this.closeActiveModal()},l=()=>{t&&(this.callbacks.onUpdateHotkey?.(e.id,t),h(`pop`)),c()};n.querySelector(`#memecord-keybind-close-btn`)?.addEventListener(`click`,c),n.querySelector(`#memecord-keybind-cancel`)?.addEventListener(`click`,c),n.querySelector(`#memecord-keybind-save`)?.addEventListener(`click`,l)}closeActiveModal(){this.activeModal&&this.activeModal.parentElement&&(this.activeModal.parentElement.removeChild(this.activeModal),this.activeModal=null)}createClickRipple(e){let t=document.createElement(`div`);t.className=`memecord-click-ripple`,e.appendChild(t),setTimeout(()=>t.remove(),400)}setMinimized(e){this.isMinimized=e,h(e?`minimize`:`expand`),e?(this.closeActiveModal(),this.element&&(this.element.classList.add(`hiding`),setTimeout(()=>{this.isMinimized&&this.element&&(this.element.style.display=`none`,this.element.classList.remove(`hiding`))},220)),this.summonBubble&&this.isVisible&&(this.summonBubble.style.display=`flex`,this.summonBubble.classList.add(`visible`),this.syncBubblePosition()),this.callbacks.onCloseDock?.()):(this.summonBubble&&(this.summonBubble.style.display=`none`,this.summonBubble.classList.remove(`visible`)),this.element&&this.isVisible&&(this.element.style.display=`flex`,this.element.classList.add(`entering`),setTimeout(()=>{this.element?.classList.remove(`entering`)},250)))}toggleMinimize(){this.setMinimized(!this.isMinimized)}syncBubblePosition(){if(!this.summonBubble||!this.element)return;let e=this.element.getBoundingClientRect();e.left>0&&e.top>0&&(this.summonBubble.style.left=`${Math.min(window.innerWidth-180,e.left)}px`,this.summonBubble.style.top=`${Math.min(window.innerHeight-50,e.top)}px`,this.summonBubble.style.bottom=`auto`,this.summonBubble.style.transform=`none`)}toggleEditMode(){this.isEditMode=!this.isEditMode,this.element&&this.element.classList.toggle(`edit-mode`,this.isEditMode),this.renderCards()}openContextMenu(e,t,n){this.closeContextMenu();let r=document.createElement(`div`);r.className=`memecord-context-menu`;let i=Math.min(e,window.innerWidth-200),a=Math.max(10,t-110);r.style.left=`${i}px`,r.style.top=`${a}px`;let o=document.createElement(`button`);o.className=`memecord-menu-item`,o.innerHTML=`<span>▶️</span><span>Trigger "${n.name}"</span>`,o.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),h(`pop`),this.callbacks.onTriggerMeme(n)}),r.appendChild(o);let s=document.createElement(`button`);s.className=`memecord-menu-item`,s.innerHTML=`<span>⌨️</span><span>Change Key [${n.hotkey||`None`}]</span>`,s.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),this.openKeybindingModal(n)}),r.appendChild(s);let c=document.createElement(`button`);c.className=`memecord-menu-item danger`,c.innerHTML=`<span>🗑️</span><span>Remove from Deck</span>`,c.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),h(`delete`),this.callbacks.onDeleteMeme(n.id)}),r.appendChild(c);let l=document.createElement(`button`);l.className=`memecord-menu-item`,l.innerHTML=`<span>✕</span><span>Minimize Deck (Alt+M)</span>`,l.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),this.setMinimized(!0)}),r.appendChild(l),document.body.appendChild(r),this.contextMenu=r}closeContextMenu(){this.contextMenu&&this.contextMenu.parentElement&&(this.contextMenu.remove(),this.contextMenu=null)}setupOutsideClickListener(){document.addEventListener(`click`,()=>{this.closeContextMenu()})}setupDraggable(){let e=e=>{let t=t=>{let i=t.target;if(i.tagName===`BUTTON`||i.tagName===`INPUT`||i.closest(`button`)||i.closest(`input`)||i.closest(`.memecord-card`)||i.closest(`.memecord-keybind-modal`))return;this.isDragging=!0,this.activeDragTarget=e,this.dragStartX=t.clientX,this.dragStartY=t.clientY;let a=e.getBoundingClientRect();this.initialLeft=a.left,this.initialTop=a.top,document.addEventListener(`mousemove`,n),document.addEventListener(`mouseup`,r),t.preventDefault()},n=e=>{if(!this.isDragging||!this.activeDragTarget)return;let t=e.clientX-this.dragStartX,n=e.clientY-this.dragStartY,r=this.initialLeft+t,i=this.initialTop+n,a=window.innerWidth-this.activeDragTarget.offsetWidth-10,o=window.innerHeight-this.activeDragTarget.offsetHeight-10;r=Math.max(10,Math.min(a,r)),i=Math.max(10,Math.min(o,i)),this.activeDragTarget.style.left=`${r}px`,this.activeDragTarget.style.top=`${i}px`,this.activeDragTarget.style.bottom=`auto`,this.activeDragTarget.style.transform=`none`,this.activeDragTarget===this.element&&this.summonBubble&&(this.summonBubble.style.left=`${r}px`,this.summonBubble.style.top=`${i}px`,this.summonBubble.style.bottom=`auto`,this.summonBubble.style.transform=`none`)},r=()=>{if(this.isDragging){if(this.isDragging=!1,document.removeEventListener(`mousemove`,n),document.removeEventListener(`mouseup`,r),this.activeDragTarget){let e=this.activeDragTarget.getBoundingClientRect();try{localStorage.setItem(`memecord_dock_pos`,JSON.stringify({left:e.left,top:e.top}))}catch{}}this.activeDragTarget=null}};e.addEventListener(`mousedown`,t)};this.element&&e(this.element),this.summonBubble&&e(this.summonBubble)}restorePosition(){try{let e=localStorage.getItem(`memecord_dock_pos`);if(e){let{left:t,top:n}=JSON.parse(e);if(typeof t==`number`&&typeof n==`number`){let e=window.innerWidth-180,r=window.innerHeight-50,i=Math.max(10,Math.min(e,t)),a=Math.max(10,Math.min(r,n));this.element&&(this.element.style.left=`${i}px`,this.element.style.top=`${a}px`,this.element.style.bottom=`auto`,this.element.style.transform=`none`),this.summonBubble&&(this.summonBubble.style.left=`${i}px`,this.summonBubble.style.top=`${a}px`,this.summonBubble.style.bottom=`auto`,this.summonBubble.style.transform=`none`)}}}catch{}}setVisible(e){this.isVisible=e,e?this.isMinimized?this.summonBubble&&(this.summonBubble.style.display=`flex`):this.element&&(this.element.style.display=`flex`):(this.closeActiveModal(),this.element&&(this.element.style.display=`none`),this.summonBubble&&(this.summonBubble.style.display=`none`))}destroy(){this.closeContextMenu(),this.closeActiveModal(),this.element&&this.element.parentElement&&(this.element.parentElement.removeChild(this.element),this.element=null),this.summonBubble&&this.summonBubble.parentElement&&(this.summonBubble.parentElement.removeChild(this.summonBubble),this.summonBubble=null)}},v=`
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

.memecord-deck.hiding {
  opacity: 0;
  transform: translateX(-50%) scale(0.88);
  pointer-events: none !important;
}

.memecord-deck.entering {
  animation: memecord-spring-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes memecord-spring-in {
  0% { opacity: 0; transform: translateX(-50%) scale(0.88); }
  70% { transform: translateX(-50%) scale(1.02); }
  100% { opacity: 1; transform: translateX(-50%) scale(1); }
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
  cursor: grab;
}
.memecord-deck-brand:active {
  cursor: grabbing;
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
.memecord-keybind-display-box:focus-within,
.memecord-keybind-display-box:hover {
  border-color: #818cf8;
  background: rgba(99, 102, 241, 0.15);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
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

.memecord-card-thumb-wrap {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.28);
  margin-top: 4px;
}

.memecord-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.memecord-card-emoji-fallback {
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
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
`,y=class{root=null;currentMemeBox=null;currentToast=null;currentModal=null;hideTimeoutId=null;removeTimeoutId=null;toastTimeoutId=null;floatingDock=null;settings;callbacks;constructor(e,n={}){this.settings=e,this.callbacks=n,this.initRoot(),this.root&&(this.floatingDock=new _(this.root,this.settings.memes,{onTriggerMeme:e=>{this.callbacks.onTriggerMeme?.(e),this.showMeme(e)},onAddMeme:()=>{this.openQuickAddModal()},onDeleteMeme:e=>{let t=this.settings.memes.find(t=>t.id===e);this.callbacks.onDeleteMeme?.(e),this.showToast(`🗑️ Removed "${t?.name||`Meme`}" from deck`)},onUpdateHotkey:async(e,t)=>{let n=this.settings.memes.find(t=>t.id===e),r=await a(e,t);this.settings=r,this.updateSettings(r),this.callbacks.onUpdateHotkey?.(e,t),this.showToast(`⌨️ Rebound "${n?.name||`Meme`}" to Key [${t}]`)},onCloseDock:()=>{this.callbacks.onCloseDock?.(),this.showToast(`🎭 Deck Minimized • Press Alt+M or click pebble to reopen`)},onPositionChange:e=>{this.settings.position=e,t({position:e}),this.showToast(`Overlay position: ${e}`)}},this.settings.position),this.floatingDock.setVisible(this.settings.dockVisible&&this.settings.enabled))}updateSettings(e){this.settings=e,this.floatingDock?.updateMemes(e.memes),this.floatingDock?.setPosition(e.position),this.floatingDock?.setVisible(e.dockVisible&&e.enabled)}setDockVisible(e){this.floatingDock?.setVisible(e)}setDockMinimized(e){this.floatingDock?.setMinimized(e)}showToast(e,t=2500){if(!this.root)return;this.currentToast&&=(this.currentToast.remove(),null),this.toastTimeoutId&&=(clearTimeout(this.toastTimeoutId),null);let n=document.createElement(`div`);n.className=`memecord-toast`,n.innerHTML=`<span>✨</span><span>${e}</span>`,this.root.appendChild(n),this.currentToast=n,requestAnimationFrame(()=>{n.classList.add(`visible`)}),this.toastTimeoutId=setTimeout(()=>{n.classList.remove(`visible`),n.classList.add(`hiding`),setTimeout(()=>{n.parentElement&&n.remove(),this.currentToast===n&&(this.currentToast=null)},300)},t)}showMeme(e){if(!this.root||!this.settings.enabled)return;this.settings.soundEnabled&&this.playTriggerSound(),this.hideTimeoutId&&=(clearTimeout(this.hideTimeoutId),null),this.removeTimeoutId&&=(clearTimeout(this.removeTimeoutId),null),this.currentMemeBox&&=(this.currentMemeBox.remove(),null);let t=e.assetUrl;if(t.startsWith(`http://`)||t.startsWith(`https://`)||t.startsWith(`data:`))t=e.assetUrl;else if(typeof chrome<`u`&&chrome.runtime?.id&&chrome.runtime?.getURL)try{t=chrome.runtime.getURL(e.assetUrl.replace(/^\//,``))}catch{t=e.assetUrl.startsWith(`/`)?e.assetUrl:`/${e.assetUrl}`}else t=e.assetUrl.startsWith(`/`)?e.assetUrl:`/${e.assetUrl}`;let n=this.getPositionClass(this.settings.position||`top-center`),r=document.createElement(`div`);r.className=`memecord-meme-box ${n}`;let i=t.startsWith(`data:video/`)||t.endsWith(`.mp4`)||t.endsWith(`.webm`),a;if(i){let e=document.createElement(`video`);e.className=`memecord-meme-image`,e.src=t,e.autoplay=!0,e.loop=!0,e.muted=!0,e.playsInline=!0,a=e}else{let n=document.createElement(`img`);n.className=`memecord-meme-image`,n.referrerPolicy=`no-referrer`,n.src=t,n.alt=e.name,n.onerror=async()=>{if(t.startsWith(`http`)&&!t.startsWith(`data:`)){console.warn(`[Memecord] Direct image blocked by page CSP, converting via background proxy...`);let e=await c(t);e&&e.startsWith(`data:`)&&(n.src=e)}},a=n}let o=document.createElement(`div`);o.className=`memecord-meme-title`,o.textContent=`${e.emoji||`✨`} ${e.name}`,r.appendChild(a),r.appendChild(o),this.root.appendChild(r),this.currentMemeBox=r,requestAnimationFrame(()=>{r.classList.add(`visible`)});let s=e.durationMs||this.settings.defaultDurationMs||2500;this.hideTimeoutId=setTimeout(()=>{r.classList.remove(`visible`),r.classList.add(`hiding`),this.removeTimeoutId=setTimeout(()=>{r.parentElement&&r.remove(),this.currentMemeBox===r&&(this.currentMemeBox=null)},300)},s)}openQuickAddModal(){if(!this.root)return;this.currentModal&&=(this.currentModal.remove(),null);let e=o(this.settings.memes.length),t=document.createElement(`div`);t.className=`memecord-quick-add-modal`,t.innerHTML=`
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
    `,this.root.appendChild(t),this.currentModal=t;let n=()=>{this.currentModal&&=(this.currentModal.remove(),null)};t.querySelector(`#memecord-modal-close-btn`)?.addEventListener(`click`,n),t.querySelector(`#memecord-add-cancel`)?.addEventListener(`click`,n);let r=t.querySelector(`#memecord-add-url`),a=t.querySelector(`#memecord-add-name`),s=t.querySelector(`#memecord-add-emoji`),c=t.querySelector(`#memecord-add-key`),l=t.querySelector(`#memecord-url-status`),u=t.querySelector(`#memecord-preview-wrap`),d=t.querySelector(`#memecord-preview-thumb`),f=t.querySelector(`#memecord-preview-name`),p=null,m=``,h=()=>{let e=r.value.trim();if(!e){u.style.display=`none`,l.textContent=``;return}l.textContent=`Resolving media link...`,p&&clearTimeout(p),p=setTimeout(async()=>{try{let t=await i(e);m=t.url,t.name&&!a.value&&(a.value=t.name),t.emoji&&s.value===`✨`&&(s.value=t.emoji),l.textContent=`✓ Ready to add`,l.style.color=`#10b981`,d.src=m,f.textContent=`${s.value} ${a.value||`Meme`}`,u.style.display=`flex`}catch(e){l.textContent=e?.message||`Invalid URL`,l.style.color=`#ef4444`}},250)};r.addEventListener(`input`,h),r.addEventListener(`paste`,()=>setTimeout(h,10)),t.querySelector(`#memecord-add-submit`)?.addEventListener(`click`,async()=>{let o=r.value.trim();if(!o){r.focus(),r.style.borderColor=`#ef4444`;return}let u=t.querySelector(`#memecord-add-submit`);u.disabled=!0,u.textContent=`Saving...`;try{let t=await i(o),r=t.url,l=a.value.trim()||t.name||`Custom Meme`,u=s.value.trim()||`✨`,d=c.value.trim()||e,f={id:`meme_${Date.now()}`,name:l,emoji:u,assetUrl:r,hotkey:d,durationMs:this.settings.defaultDurationMs||2500};n(),this.callbacks.onAddMeme?.(f),this.showToast(`Added "${l}" [Key ${d}]!`)}catch(e){l.textContent=`Error: ${e?.message||`Failed to save`}`,l.style.color=`#ef4444`,u.disabled=!1,u.textContent=`Add to Dock`}})}playTriggerSound(){try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createGain();t.type=`sine`,t.frequency.setValueAtTime(480,e.currentTime),t.frequency.exponentialRampToValueAtTime(960,e.currentTime+.1),n.gain.setValueAtTime(.12,e.currentTime),n.gain.exponentialRampToValueAtTime(.001,e.currentTime+.1),t.connect(n),n.connect(e.destination),t.start(),t.stop(e.currentTime+.11)}catch{}}getPositionClass(e){switch(e){case`center`:return`pos-center`;case`top-right`:return`pos-top-right`;case`bottom-right`:return`pos-bottom-right`;default:return`pos-top-center`}}initRoot(){if(!document.getElementById(`memecord-injected-styles`)){let e=document.createElement(`style`);e.id=`memecord-injected-styles`,e.textContent=v,(document.head||document.documentElement).appendChild(e)}let e=document.getElementById(`memecord-overlay-root`);e||(e=document.createElement(`div`),e.id=`memecord-overlay-root`,(document.body||document.documentElement).appendChild(e)),this.root=e}destroy(){this.hideTimeoutId&&clearTimeout(this.hideTimeoutId),this.removeTimeoutId&&clearTimeout(this.removeTimeoutId),this.toastTimeoutId&&clearTimeout(this.toastTimeoutId),this.floatingDock&&=(this.floatingDock.destroy(),null),this.currentModal&&=(this.currentModal.remove(),null),this.root&&this.root.parentElement&&(this.root.parentElement.removeChild(this.root),this.root=null)}},b=u(),x=()=>{let n=(0,p.useRef)(null),[r,i]=(0,p.useState)(f),[a,u]=(0,p.useState)([]),[d,m]=(0,p.useState)(null),[h,g]=(0,p.useState)(!1),_=(0,p.useRef)(null),v=(0,p.useRef)(null),x=e=>{let t=new Date().toLocaleTimeString();u(n=>[`[${t}] ${e}`,...n.slice(0,49)])},S=async e=>{m(e.name),x(`Triggered: ${e.name}`),n.current?.showMeme(e);try{let t=await c(e.assetUrl);window.postMessage({source:`MEMECORD_CONTENT`,type:`TRIGGER_CAMERA_MEME`,meme:{...e,assetUrl:t},position:r.position||`center`},`*`)}catch(e){console.warn(`Failed to post camera meme:`,e)}},C=async()=>{if(h)v.current&&=(v.current.getTracks().forEach(e=>e.stop()),null),_.current&&(_.current.srcObject=null),g(!1),x(`Virtual Camera Preview stopped.`);else try{x(`Requesting webcam feed (hooked by Memecord compositor)...`);let e=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1});v.current=e,_.current&&(_.current.srcObject=e),g(!0),x(`Webcam feed active! This preview shows what remote callers see.`)}catch(e){x(`Camera error: ${e?.message||e}`)}};(0,p.useEffect)(()=>{s().then(t=>{i(t),n.current=new y(t,{onTriggerMeme:e=>{S(e)},onAddMeme:async t=>{let n=await e(t);i(n),x(`Added new meme: ${t.name}`)},onDeleteMeme:async e=>{let t=await l(e);i(t),x(`Deleted meme: ${e}`)},onUpdateHotkey:(e,t)=>{i(n=>({...n,memes:n.memes.map(n=>n.id===e?{...n,hotkey:t}:n)})),x(`Rebound meme ${e} to [${t}]`)},onCloseDock:()=>{x(`HUD closed/minimized via close button. Click floating bubble or press Alt+M.`)}}),x(`Memecord Test Lab initialized. Press 1–9, 0, Q... or click dock buttons.`)});let r=e=>{let r=document.activeElement;if(r&&(r.tagName===`INPUT`||r.tagName===`TEXTAREA`))return;if(e.altKey&&(e.key===`m`||e.key===`M`)){e.preventDefault(),i(e=>{let r=!e.dockVisible;return t({dockVisible:r}),n.current?.setDockMinimized(!r),n.current?.setDockVisible(!0),x(r?`HUD expanded via Alt+M`:`HUD minimized via Alt+M`),{...e,dockVisible:r}});return}let a=e.key;s().then(t=>{let n=t.memes.find((e,t)=>{let n=e.hotkey||o(t);return n&&n.toLowerCase()===a.toLowerCase()});n&&(e.preventDefault(),S(n))})};return window.addEventListener(`keydown`,r),()=>{window.removeEventListener(`keydown`,r),n.current?.destroy(),n.current=null,v.current&&v.current.getTracks().forEach(e=>e.stop())}},[]);let w=async e=>{let r=await t({position:e});i(r),n.current?.updateSettings(r),x(`Changed overlay position to ${e}`),window.postMessage({source:`MEMECORD_CONTENT`,type:`UPDATE_CAMERA_SETTINGS`,position:e},`*`)};return(0,b.jsxs)(`div`,{className:`testlab-container`,children:[(0,b.jsx)(`header`,{className:`testlab-header`,children:(0,b.jsxs)(`div`,{className:`testlab-brand`,children:[(0,b.jsx)(`span`,{className:`testlab-logo`,children:`🎭`}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`h1`,{children:`Memecord Test Lab`}),(0,b.jsx)(`p`,{children:`Interactive Sandbox & Meme Trigger Simulator`})]})]})}),(0,b.jsxs)(`div`,{className:`testlab-grid`,children:[(0,b.jsxs)(`div`,{className:`testlab-panel`,children:[(0,b.jsxs)(`h2`,{children:[`Meme Triggers (`,r.memes.length,`)`]}),(0,b.jsx)(`p`,{className:`testlab-sub`,children:`Click any button or press the corresponding hotkey on your keyboard:`}),(0,b.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(140px, 1fr))`,gap:10,margin:`16px 0`},children:r.memes.map((e,t)=>{let n=e.hotkey||(t<9?String(t+1):`-`);return(0,b.jsxs)(`button`,{onClick:()=>S(e),style:{background:d===e.name?`rgba(99, 102, 241, 0.4)`:`rgba(255, 255, 255, 0.06)`,border:`1px solid rgba(255, 255, 255, 0.15)`,borderRadius:12,padding:`12px 10px`,color:`#fff`,cursor:`pointer`,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6,transition:`all 0.15s ease`},children:[(0,b.jsx)(`span`,{style:{fontSize:24},children:e.emoji}),(0,b.jsx)(`span`,{style:{fontSize:12,fontWeight:600,textAlign:`center`},children:e.name}),(0,b.jsxs)(`span`,{style:{fontSize:10,color:`#a5b4fc`,background:`rgba(0,0,0,0.3)`,padding:`2px 6px`,borderRadius:4},children:[`Key [`,n,`]`]})]},e.id)})}),(0,b.jsx)(`h3`,{style:{marginTop:20},children:`Position Preview`}),(0,b.jsx)(`div`,{style:{display:`flex`,gap:8,marginTop:8},children:[`top-center`,`center`,`top-right`,`bottom-right`].map(e=>(0,b.jsx)(`button`,{onClick:()=>w(e),style:{background:r.position===e?`#6366f1`:`rgba(255, 255, 255, 0.08)`,border:`1px solid rgba(255, 255, 255, 0.15)`,color:`#fff`,borderRadius:8,padding:`6px 12px`,fontSize:12,cursor:`pointer`},children:e},e))})]}),(0,b.jsxs)(`div`,{className:`testlab-panel`,children:[(0,b.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:12},children:[(0,b.jsx)(`h2`,{children:`Remote Caller Camera Stream`}),(0,b.jsx)(`button`,{onClick:C,style:{background:h?`#ef4444`:`#10b981`,border:`none`,color:`#fff`,padding:`6px 14px`,borderRadius:8,fontWeight:600,fontSize:12,cursor:`pointer`},children:h?`Stop Camera`:`Start Camera Stream`})]}),(0,b.jsxs)(`div`,{style:{position:`relative`,width:`100%`,height:220,background:`#090d16`,borderRadius:12,border:`1px solid rgba(255, 255, 255, 0.12)`,overflow:`hidden`,display:`flex`,alignItems:`center`,justifyContent:`center`,marginBottom:16},children:[(0,b.jsx)(`video`,{ref:_,autoPlay:!0,playsInline:!0,muted:!0,style:{width:`100%`,height:`100%`,objectFit:`cover`,display:h?`block`:`none`}}),!h&&(0,b.jsxs)(`div`,{style:{textAlign:`center`,color:`#64748b`,padding:20},children:[(0,b.jsx)(`p`,{style:{margin:0,fontSize:13,fontWeight:500},children:`Click “Start Camera Stream” to preview what remote callers see in Google Meet & Discord.`}),(0,b.jsx)(`p`,{style:{margin:`6px 0 0 0`,fontSize:11,color:`#475569`},children:`The virtual compositor will stamp active memes with smooth GIF animation.`})]})]}),(0,b.jsx)(`h2`,{children:`Real-time Event Log`}),(0,b.jsx)(`div`,{style:{background:`rgba(0,0,0,0.4)`,borderRadius:10,padding:12,height:180,overflowY:`auto`,fontFamily:`monospace`,fontSize:12},children:a.map((e,t)=>(0,b.jsx)(`div`,{style:{color:`#38bdf8`,marginBottom:4},children:e},t))})]})]})]})},S=document.getElementById(`root`);S&&m.createRoot(S).render((0,b.jsx)(p.StrictMode,{children:(0,b.jsx)(x,{})}));