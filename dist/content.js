(function(){var e=document.createElement(`style`);e.textContent=`#memecord-overlay-root{-webkit-user-select:none;user-select:none;width:100vw;height:100vh;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Helvetica,Arial,sans-serif;position:fixed;inset:0;overflow:hidden;pointer-events:none!important;z-index:2147483647!important}.memecord-meme-box{pointer-events:none;opacity:0;filter:drop-shadow(0 25px 45px #000000bf);z-index:2147483647;flex-direction:column;justify-content:center;align-items:center;transition:transform .3s cubic-bezier(.175,.885,.32,1.275),opacity .24s ease-out;display:flex;position:absolute}.memecord-meme-box.pos-center{top:50%;left:50%;transform:translate(-50%,-50%)scale(.65)}.memecord-meme-box.pos-center.visible{opacity:1;transform:translate(-50%,-50%)scale(1)}.memecord-meme-box.pos-center.hiding{opacity:0;transform:translate(-50%,-50%)scale(.85)}.memecord-meme-box.pos-top-center{top:24px;left:50%;transform:translate(-50%)translateY(-25px)scale(.8)}.memecord-meme-box.pos-top-center.visible{opacity:1;transform:translate(-50%)translateY(0)scale(1)}.memecord-meme-box.pos-top-center.hiding{opacity:0;transform:translate(-50%)translateY(-20px)scale(.8)}.memecord-meme-box.pos-top-right{top:24px;right:28px;transform:translateY(-20px)scale(.8)}.memecord-meme-box.pos-top-right.visible{opacity:1;transform:translateY(0)scale(1)}.memecord-meme-box.pos-top-right.hiding{opacity:0;transform:translateY(-20px)scale(.8)}.memecord-meme-box.pos-bottom-right{bottom:90px;right:28px;transform:translateY(20px)scale(.8)}.memecord-meme-box.pos-bottom-right.visible{opacity:1;transform:translateY(0)scale(1)}.memecord-meme-box.pos-bottom-right.hiding{opacity:0;transform:translateY(20px)scale(.8)}.memecord-meme-image{object-fit:contain;background:#090d16;border:3.5px solid #fffffff2;border-radius:20px;max-width:min(85vw,460px);max-height:min(65vh,400px);box-shadow:0 20px 50px #0009,0 0 35px #6366f166}video.memecord-meme-image{outline:none}.memecord-meme-title{-webkit-backdrop-filter:blur(14px);color:#f8fafc;letter-spacing:.4px;background:#0f172ae0;border:1px solid #ffffff2e;border-radius:9999px;margin-top:10px;padding:6px 20px;font-size:14px;font-weight:700;box-shadow:0 6px 18px #0006}.memecord-dock{-webkit-backdrop-filter:blur(32px)saturate(220%);color:#f8fafc;z-index:2147483646;box-sizing:border-box;-webkit-user-select:none;user-select:none;background:#0a0f1dc7;border:1px solid #ffffff29;border-radius:9999px;align-items:center;gap:7px;max-width:95vw;padding:6px 10px;font-size:13px;transition:transform .28s cubic-bezier(.16,1,.3,1),opacity .22s,background-color .2s,box-shadow .25s,border-color .25s;display:flex;position:fixed;bottom:24px;left:50%;transform:translate(-50%);box-shadow:0 20px 50px -10px #000000bf,0 0 25px #6366f133,inset 0 1px 1px #ffffff59;pointer-events:auto!important}.memecord-dock:hover{background:#0f172ae0;border-color:#6366f18c;box-shadow:0 24px 60px -8px #000000d9,0 0 35px #6366f14d,inset 0 1px 1px #ffffff80}.memecord-dock.hiding{opacity:0;transform:translate(-50%)scale(.85);pointer-events:none!important}.memecord-dock.entering{animation:.28s cubic-bezier(.16,1,.3,1) forwards memecord-spring-in}@keyframes memecord-spring-in{0%{opacity:0;transform:translate(-50%)scale(.85)}70%{transform:translate(-50%)scale(1.03)}to{opacity:1;transform:translate(-50%)scale(1)}}.memecord-dock-drag-handle{cursor:grab;color:#64748b;-webkit-user-select:none;user-select:none;letter-spacing:1px;align-items:center;padding:4px 6px;font-size:13px;transition:color .15s,transform .15s;display:flex}.memecord-dock-drag-handle:hover{color:#a5b4fc;transform:scale(1.1)}.memecord-dock-drag-handle:active{cursor:grabbing;color:#818cf8;transform:scale(.95)}.memecord-dock-badge{letter-spacing:-.2px;cursor:pointer;background:#ffffff14;border:1px solid #ffffff1f;border-radius:9999px;align-items:center;gap:7px;padding:5px 12px;font-size:12px;font-weight:700;transition:all .2s cubic-bezier(.16,1,.3,1);display:flex}.memecord-dock-badge:hover{background:#ffffff29;border-color:#a5b4fc80;transform:scale(1.04)}.memecord-dock-badge:active{transform:scale(.95)}.memecord-status-dot{background:#10b981;border-radius:50%;width:7px;height:7px;animation:2.2s infinite memecord-pulse;box-shadow:0 0 10px #10b981,0 0 4px #34d399}@keyframes memecord-pulse{0%{opacity:1;transform:scale(1)}50%{opacity:.75;transform:scale(1.3)}to{opacity:1;transform:scale(1)}}.memecord-dock-buttons{align-items:center;gap:6px;max-width:78vw;padding:2px 4px;display:flex;overflow-x:auto}.memecord-dock-buttons::-webkit-scrollbar{display:none}.memecord-dock-btn{color:#f8fafc;cursor:pointer;-webkit-user-select:none;user-select:none;background:#ffffff14;border:1px solid #ffffff24;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;width:38px;height:38px;font-size:17px;transition:transform .22s cubic-bezier(.34,1.56,.64,1),background-color .15s,border-color .15s,box-shadow .2s;display:flex;position:relative}.memecord-dock-btn:hover{z-index:10;background:#6366f173;border-color:#a5b4fcd9;transform:translateY(-8px)scale(1.22);box-shadow:0 12px 28px #6366f18c,0 0 15px #a5b4fc66}.memecord-dock-btn:active{transform:translateY(-2px)scale(.92)}.memecord-click-ripple{pointer-events:none;border:2px solid #818cf8;border-radius:50%;animation:.38s ease-out forwards memecord-ripple-anim;position:absolute;inset:-4px}@keyframes memecord-ripple-anim{0%{opacity:1;border-color:#a5b4fc;transform:scale(.8)}to{opacity:0;border-color:#6366f1;transform:scale(1.6)}}.memecord-hotkey-badge{color:#c7d2fe;background:#0a0f1df5;border:1px solid #818cf899;border-radius:9999px;padding:1px 4px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:8.5px;font-weight:800;line-height:1;transition:all .15s;position:absolute;bottom:-2px;right:-2px;box-shadow:0 2px 6px #0009}.memecord-dock-btn:hover .memecord-hotkey-badge{color:#fff;background:#6366f1;border-color:#fff;transform:scale(1.1)}.memecord-delete-badge{color:#fff;cursor:pointer;z-index:20;background:#ef4444;border:1.5px solid #fff;border-radius:50%;justify-content:center;align-items:center;width:17px;height:17px;font-size:10px;font-weight:900;transition:transform .15s;display:flex;position:absolute;top:-4px;right:-4px;box-shadow:0 2px 8px #ef444499}.memecord-delete-badge:hover{background:#dc2626;transform:scale(1.25)}.memecord-dock.edit-mode .memecord-dock-btn:not(.action-btn){animation:.28s ease-in-out infinite alternate memecord-wiggle}.memecord-dock.edit-mode .memecord-dock-btn:nth-child(2n):not(.action-btn){animation-duration:.32s;animation-delay:50ms}@keyframes memecord-wiggle{0%{transform:rotate(-3deg)}to{transform:rotate(3deg)}}.memecord-dock-divider{background:linear-gradient(#0000,#ffffff40,#0000);flex-shrink:0;width:1px;height:22px;margin:0 3px}.memecord-dock-btn.action-btn{color:#94a3b8;background:#ffffff12;border:1px solid #ffffff24;border-radius:50%;font-size:13px}.memecord-dock-btn.action-btn:hover{color:#fff;background:#ffffff2e;border-color:#ffffff4d;transform:translateY(-4px)scale(1.1);box-shadow:0 8px 18px #0006}.memecord-dock-btn.edit-toggle.active{color:#fca5a5;background:#ef444459;border-color:#ef4444;box-shadow:0 0 12px #ef444466}.memecord-dock-btn.add-btn{color:#e0e7ff;background:linear-gradient(135deg,#6366f166,#a855f766);border:1px solid #a5b4fc99;font-size:17px;font-weight:700}.memecord-dock-btn.add-btn:hover{color:#fff;background:linear-gradient(135deg,#6366f1,#a855f7);border-color:#c7d2fe;transform:translateY(-5px)rotate(90deg)scale(1.18);box-shadow:0 10px 26px #6366f199}.memecord-dock-btn.close-btn{color:#94a3b8;font-size:13px;font-weight:700}.memecord-dock-btn.close-btn:hover{color:#fecaca;background:#ef444459;border-color:#f87171;transform:translateY(-4px)scale(1.1);box-shadow:0 8px 20px #ef444473}.memecord-summon-bubble{-webkit-backdrop-filter:blur(28px)saturate(210%);cursor:pointer;color:#f8fafc;z-index:2147483646;-webkit-user-select:none;user-select:none;background:#0a0f1dd1;border:1px solid #ffffff2e;border-radius:9999px;align-items:center;gap:8px;padding:7px 14px;font-size:12px;font-weight:700;transition:all .24s cubic-bezier(.16,1,.3,1);animation:.25s cubic-bezier(.16,1,.3,1) memecord-summon-in;display:flex;position:fixed;bottom:24px;left:50%;transform:translate(-50%);box-shadow:0 16px 40px #000000a6,0 0 20px #6366f140,inset 0 1px 1px #ffffff4d;pointer-events:auto!important}.memecord-summon-bubble:hover{background:#0f172af0;border-color:#818cf8a6;transform:translate(-50%)translateY(-4px)scale(1.06);box-shadow:0 22px 50px #000000bf,0 0 30px #6366f173,inset 0 1px 1px #ffffff73}.memecord-summon-bubble:active{transform:translate(-50%)scale(.96)}@keyframes memecord-summon-in{0%{opacity:0;transform:translate(-50%)scale(.7)}to{opacity:1;transform:translate(-50%)scale(1)}}.memecord-summon-icon{font-size:15px}.memecord-summon-label{letter-spacing:-.2px;font-size:12px}.memecord-summon-key{color:#a5b4fc;background:#6366f140;border:1px solid #818cf866;border-radius:6px;padding:2px 6px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:9px;font-weight:800}.memecord-tooltip{-webkit-backdrop-filter:blur(20px);color:#f8fafc;white-space:nowrap;pointer-events:none;opacity:0;z-index:2147483647;background:#0a0f1df2;border:1px solid #fff3;border-radius:10px;align-items:center;gap:6px;padding:5px 11px;font-size:11px;font-weight:600;transition:all .16s cubic-bezier(.16,1,.3,1);display:flex;position:absolute;bottom:50px;left:50%;transform:translate(-50%)translateY(4px);box-shadow:0 10px 25px #0009,0 0 15px #6366f133}.memecord-dock-btn:hover .memecord-tooltip{opacity:1;opacity:1;transform:translate(-50%)translateY(0)}.memecord-context-menu{-webkit-backdrop-filter:blur(20px);z-index:2147483647;background:#0f172af2;border:1px solid #ffffff26;border-radius:14px;flex-direction:column;gap:2px;min-width:150px;padding:5px;animation:.15s ease-out memecord-menu-pop;display:flex;position:fixed;box-shadow:0 16px 40px #000000a6,0 0 0 1px #ffffff0d;pointer-events:auto!important}@keyframes memecord-menu-pop{0%{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}.memecord-menu-item{color:#f8fafc;cursor:pointer;text-align:left;background:0 0;border:none;border-radius:8px;align-items:center;gap:8px;padding:7px 12px;font-size:12px;font-weight:500;transition:background .12s;display:flex}.memecord-menu-item:hover{color:#fff;background:#6366f14d}.memecord-menu-item.danger:hover{color:#fca5a5;background:#ef444440}.memecord-quick-add-modal{-webkit-backdrop-filter:blur(28px);z-index:2147483647;color:#f8fafc;background:#0f172af2;border:1px solid #ffffff2e;border-radius:22px;flex-direction:column;gap:14px;width:min(92vw,420px);padding:22px 24px;animation:.2s cubic-bezier(.16,1,.3,1) memecord-menu-pop;display:flex;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 30px 70px #000000d9,0 0 35px #6366f159;pointer-events:auto!important}.memecord-modal-title{letter-spacing:-.2px;justify-content:space-between;align-items:center;font-size:16px;font-weight:800;display:flex}.memecord-modal-close{color:#94a3b8;cursor:pointer;background:0 0;border:none;border-radius:6px;padding:2px 6px;font-size:20px;transition:all .12s}.memecord-modal-close:hover{color:#fff;background:#ffffff1a}.memecord-input-field{color:#fff;box-sizing:border-box;background:#ffffff0f;border:1px solid #ffffff24;border-radius:10px;width:100%;padding:9px 12px;font-size:13px;transition:border-color .15s}.memecord-input-field:focus{border-color:#818cf8;outline:none;box-shadow:0 0 0 2px #6366f14d}.memecord-preview-wrap{background:#0000004d;border:1px solid #ffffff14;border-radius:12px;align-items:center;gap:12px;padding:10px;display:flex}.memecord-preview-thumb{object-fit:cover;background:#1e293b;border-radius:8px;width:50px;height:50px}.memecord-modal-btn-row{justify-content:flex-end;gap:8px;margin-top:6px;display:flex}.memecord-btn-primary{color:#fff;cursor:pointer;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:10px;padding:9px 18px;font-size:13px;font-weight:700;transition:all .15s;box-shadow:0 4px 14px #6366f166}.memecord-btn-primary:hover{filter:brightness(1.12);transform:translateY(-1px)}.memecord-btn-primary:active{transform:translateY(0)}.memecord-btn-secondary{color:#cbd5e1;cursor:pointer;background:#ffffff14;border:1px solid #ffffff24;border-radius:10px;padding:9px 16px;font-size:13px;transition:all .15s}.memecord-btn-secondary:hover{color:#fff;background:#ffffff24}.memecord-toast{-webkit-backdrop-filter:blur(16px);color:#f8fafc;opacity:0;pointer-events:none;z-index:2147483647;background:#0f172af0;border:1px solid #6366f173;border-radius:9999px;align-items:center;gap:8px;padding:8px 22px;font-size:13px;font-weight:600;transition:all .3s cubic-bezier(.16,1,.3,1);display:flex;position:fixed;top:24px;left:50%;transform:translate(-50%)translateY(-20px);box-shadow:0 16px 36px #0009,0 0 24px #6366f14d}.memecord-toast.visible{opacity:1;transform:translate(-50%)translateY(0)}.memecord-toast.hiding{opacity:0;transform:translate(-50%)translateY(-15px)}
/*$vite$:1*/`,document.head.appendChild(e);var t=new Map;function n(e){if(e<9)return String(e+1);if(e===9)return`0`;let t=[`Q`,`W`,`E`,`R`,`T`,`Y`,`U`,`I`,`O`,`P`,`A`,`S`,`D`,`F`],n=e-10;return n<t.length?t[n]:``}async function r(e){let t=e.trim();if(!t)throw Error(`URL cannot be empty`);if(t.startsWith(`data:`))return{url:t,isVideo:t.startsWith(`data:video/`)};if(t.startsWith(`memes/`)||t.startsWith(`/memes/`))return{url:t,isVideo:!1};if(t.includes(`tenor.com`)){if(t.includes(`media.tenor.com`)&&(t.endsWith(`.gif`)||t.endsWith(`.mp4`)||t.endsWith(`.webp`)))return{url:t,isVideo:t.endsWith(`.mp4`)||t.endsWith(`.webm`)};try{let e=await chrome.runtime.sendMessage({type:`RESOLVE_TENOR_URL`,url:t});if(e&&e.success&&e.resolvedUrl)return{url:e.resolvedUrl,name:e.name,emoji:`✨`,isVideo:e.isVideo}}catch(e){console.warn(`[Memecord] Background Tenor resolve failed, trying fallback slug:`,e)}let e=t.match(/\/view\/([a-zA-Z0-9_-]+)/),n=`Tenor Meme`;return e&&e[1]&&(n=e[1].replace(/-gif-\d+$/,``).replace(/-gif$/,``).replace(/-/g,` `).replace(/\b\w/g,e=>e.toUpperCase())),{url:t,name:n,isVideo:!1}}if(t.includes(`giphy.com/gifs/`)){let e=t.match(/-([a-zA-Z0-9]+)$/);if(e&&e[1])return{url:`https://media.giphy.com/media/${e[1]}/giphy.gif`,isVideo:!1}}return{url:t,isVideo:t.endsWith(`.mp4`)||t.endsWith(`.webm`)}}async function i(e){if(e.startsWith(`data:`))return e;if(t.has(e))return t.get(e);let n=e;if((e.startsWith(`memes/`)||e.startsWith(`/memes/`))&&typeof chrome<`u`&&chrome.runtime?.getURL&&(n=chrome.runtime.getURL(e.replace(/^\//,``))),n.startsWith(`chrome-extension://`))try{let r=await(await fetch(n)).blob();return new Promise(n=>{let i=new FileReader;i.onloadend=()=>{let r=i.result;t.set(e,r),n(r)},i.readAsDataURL(r)})}catch(e){console.warn(`[Memecord] Failed to read local asset as data URL:`,e)}try{let r=await chrome.runtime.sendMessage({type:`FETCH_MEDIA_AS_DATA_URL`,url:n});if(r&&r.success&&r.dataUrl)return t.set(e,r.dataUrl),r.dataUrl}catch(e){console.warn(`[Memecord] Failed to convert to data URL via background:`,e)}return e}function a(e=`pop`){try{let t=window.AudioContext||window.webkitAudioContext;if(!t)return;let n=new t,r=n.createOscillator(),i=n.createGain();r.type=`sine`;let a=n.currentTime;e===`pop`?(r.frequency.setValueAtTime(440,a),r.frequency.exponentialRampToValueAtTime(880,a+.08),i.gain.setValueAtTime(.09,a),i.gain.exponentialRampToValueAtTime(.001,a+.08),r.start(a),r.stop(a+.09)):e===`minimize`?(r.frequency.setValueAtTime(600,a),r.frequency.exponentialRampToValueAtTime(320,a+.1),i.gain.setValueAtTime(.08,a),i.gain.exponentialRampToValueAtTime(.001,a+.1),r.start(a),r.stop(a+.11)):e===`expand`?(r.frequency.setValueAtTime(360,a),r.frequency.exponentialRampToValueAtTime(720,a+.1),i.gain.setValueAtTime(.08,a),i.gain.exponentialRampToValueAtTime(.001,a+.1),r.start(a),r.stop(a+.11)):e===`delete`&&(r.frequency.setValueAtTime(300,a),r.frequency.exponentialRampToValueAtTime(150,a+.12),i.gain.setValueAtTime(.1,a),i.gain.exponentialRampToValueAtTime(.001,a+.12),r.start(a),r.stop(a+.13))}catch{}}var o=class{element=null;summonBubble=null;btnContainer=null;contextMenu=null;isMinimized=!1;isEditMode=!1;isVisible=!0;memes=[];callbacks;isDragging=!1;dragStartX=0;dragStartY=0;initialLeft=0;initialTop=0;activeDragTarget=null;constructor(e,t,n){this.memes=t,this.callbacks=n,this.createDom(e),this.setupDraggable(),this.setupOutsideClickListener()}createDom(e){let t=document.createElement(`div`);t.className=`memecord-dock`;let n=document.createElement(`div`);n.className=`memecord-dock-drag-handle`,n.title=`Drag toolbar anywhere`,n.textContent=`⋮⋮`,t.appendChild(n);let r=document.createElement(`div`);r.className=`memecord-dock-badge`,r.title=`Click to minimize HUD (Alt+M)`;let i=document.createElement(`span`);i.className=`memecord-status-dot`;let a=document.createElement(`span`);a.id=`memecord-dock-title`,a.textContent=`🎭 Memecord`,r.appendChild(i),r.appendChild(a),r.addEventListener(`click`,e=>{e.stopPropagation(),this.setMinimized(!0)}),t.appendChild(r);let o=document.createElement(`div`);o.className=`memecord-dock-buttons`,this.btnContainer=o,this.renderButtons(),t.appendChild(o),e.appendChild(t),this.element=t;let s=document.createElement(`div`);s.className=`memecord-summon-bubble`,s.title=`Open Memecord HUD (Alt+M)`,s.innerHTML=`
      <span class="memecord-status-dot"></span>
      <span class="memecord-summon-icon">🎭</span>
      <span class="memecord-summon-label">Memecord</span>
      <span class="memecord-summon-key">Alt+M</span>
    `,s.style.display=`none`,s.addEventListener(`click`,e=>{e.stopPropagation(),this.setMinimized(!1)}),e.appendChild(s),this.summonBubble=s,this.restorePosition()}updateMemes(e){this.memes=e,this.renderButtons()}renderButtons(){if(!this.btnContainer)return;this.btnContainer.innerHTML=``,this.memes.forEach((e,t)=>{let r=document.createElement(`button`);r.className=`memecord-dock-btn`,r.dataset.memeId=e.id;let i=document.createElement(`span`);i.textContent=e.emoji||`✨`,r.appendChild(i);let o=e.hotkey||n(t);if(o){let e=document.createElement(`span`);e.className=`memecord-hotkey-badge`,e.textContent=o,r.appendChild(e)}let s=document.createElement(`div`);if(s.className=`memecord-tooltip`,s.innerHTML=`<span>${e.name}</span>${o?`<span style="color:#818cf8; font-weight:800;">[${o}]</span>`:``}`,r.appendChild(s),this.isEditMode){let t=document.createElement(`span`);t.className=`memecord-delete-badge`,t.textContent=`✕`,t.title=`Delete ${e.name}`,t.addEventListener(`click`,t=>{t.stopPropagation(),a(`delete`),this.callbacks.onDeleteMeme(e.id)}),r.appendChild(t)}r.addEventListener(`click`,t=>{t.stopPropagation(),this.isEditMode?(a(`delete`),this.callbacks.onDeleteMeme(e.id)):(a(`pop`),this.createClickRipple(r),this.callbacks.onTriggerMeme(e))}),r.addEventListener(`contextmenu`,t=>{t.preventDefault(),t.stopPropagation(),this.openContextMenu(t.clientX,t.clientY,e)}),this.btnContainer.appendChild(r)});let e=document.createElement(`div`);e.className=`memecord-dock-divider`,this.btnContainer.appendChild(e);let t=document.createElement(`button`);t.className=`memecord-dock-btn action-btn edit-toggle ${this.isEditMode?`active`:``}`,t.title=this.isEditMode?`Done managing memes`:`Manage / Remove memes`,t.textContent=this.isEditMode?`✓`:`✏️`,t.addEventListener(`click`,e=>{e.stopPropagation(),a(`pop`),this.toggleEditMode()}),this.btnContainer.appendChild(t);let r=document.createElement(`button`);r.className=`memecord-dock-btn action-btn add-btn`,r.title=`Add new meme (Paste Tenor, Giphy, or image URL)`,r.textContent=`+`,r.addEventListener(`click`,e=>{e.stopPropagation(),a(`pop`),this.isEditMode&&this.toggleEditMode(),this.callbacks.onAddMeme()}),this.btnContainer.appendChild(r);let i=document.createElement(`button`);i.className=`memecord-dock-btn action-btn close-btn`,i.title=`Close HUD (Press Alt+M to reopen)`,i.innerHTML=`✕`,i.addEventListener(`click`,e=>{e.stopPropagation(),this.setMinimized(!0)}),this.btnContainer.appendChild(i)}createClickRipple(e){let t=document.createElement(`div`);t.className=`memecord-click-ripple`,e.appendChild(t),setTimeout(()=>t.remove(),400)}setMinimized(e){this.isMinimized=e,a(e?`minimize`:`expand`),e?(this.element&&(this.element.classList.add(`hiding`),setTimeout(()=>{this.isMinimized&&this.element&&(this.element.style.display=`none`,this.element.classList.remove(`hiding`))},220)),this.summonBubble&&this.isVisible&&(this.summonBubble.style.display=`flex`,this.summonBubble.classList.add(`visible`),this.syncBubblePosition()),this.callbacks.onCloseDock?.()):(this.summonBubble&&(this.summonBubble.style.display=`none`,this.summonBubble.classList.remove(`visible`)),this.element&&this.isVisible&&(this.element.style.display=`flex`,this.element.classList.add(`entering`),setTimeout(()=>{this.element?.classList.remove(`entering`)},250)))}toggleMinimize(){this.setMinimized(!this.isMinimized)}syncBubblePosition(){if(!this.summonBubble||!this.element)return;let e=this.element.getBoundingClientRect();e.left>0&&e.top>0&&(this.summonBubble.style.left=`${Math.min(window.innerWidth-120,e.left)}px`,this.summonBubble.style.top=`${Math.min(window.innerHeight-50,e.top)}px`,this.summonBubble.style.bottom=`auto`,this.summonBubble.style.transform=`none`)}toggleEditMode(){this.isEditMode=!this.isEditMode,this.element&&(this.isEditMode?this.element.classList.add(`edit-mode`):this.element.classList.remove(`edit-mode`)),this.renderButtons()}openContextMenu(e,t,n){this.closeContextMenu();let r=document.createElement(`div`);r.className=`memecord-context-menu`;let i=Math.min(e,window.innerWidth-180),o=Math.max(10,t-90);r.style.left=`${i}px`,r.style.top=`${o}px`;let s=document.createElement(`button`);s.className=`memecord-menu-item`,s.innerHTML=`<span>▶️</span><span>Trigger "${n.name}"</span>`,s.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),a(`pop`),this.callbacks.onTriggerMeme(n)}),r.appendChild(s);let c=document.createElement(`button`);c.className=`memecord-menu-item danger`,c.innerHTML=`<span>🗑️</span><span>Remove from Dock</span>`,c.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),a(`delete`),this.callbacks.onDeleteMeme(n.id)}),r.appendChild(c);let l=document.createElement(`button`);l.className=`memecord-menu-item`,l.innerHTML=`<span>✕</span><span>Hide HUD (Alt+M)</span>`,l.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),this.setMinimized(!0)}),r.appendChild(l),document.body.appendChild(r),this.contextMenu=r}closeContextMenu(){this.contextMenu&&this.contextMenu.parentElement&&(this.contextMenu.remove(),this.contextMenu=null)}setupOutsideClickListener(){document.addEventListener(`click`,()=>{this.closeContextMenu()})}setupDraggable(){let e=e=>{let t=t=>{if(t.target.tagName===`BUTTON`||t.target.tagName===`INPUT`)return;this.isDragging=!0,this.activeDragTarget=e,this.dragStartX=t.clientX,this.dragStartY=t.clientY;let i=e.getBoundingClientRect();this.initialLeft=i.left,this.initialTop=i.top,document.addEventListener(`mousemove`,n),document.addEventListener(`mouseup`,r),t.preventDefault()},n=e=>{if(!this.isDragging||!this.activeDragTarget)return;let t=e.clientX-this.dragStartX,n=e.clientY-this.dragStartY,r=this.initialLeft+t,i=this.initialTop+n,a=window.innerWidth-this.activeDragTarget.offsetWidth-10,o=window.innerHeight-this.activeDragTarget.offsetHeight-10;r=Math.max(10,Math.min(a,r)),i=Math.max(10,Math.min(o,i)),this.activeDragTarget.style.left=`${r}px`,this.activeDragTarget.style.top=`${i}px`,this.activeDragTarget.style.bottom=`auto`,this.activeDragTarget.style.transform=`none`,this.activeDragTarget===this.element&&this.summonBubble&&(this.summonBubble.style.left=`${r}px`,this.summonBubble.style.top=`${i}px`,this.summonBubble.style.bottom=`auto`,this.summonBubble.style.transform=`none`)},r=()=>{if(this.isDragging){if(this.isDragging=!1,document.removeEventListener(`mousemove`,n),document.removeEventListener(`mouseup`,r),this.activeDragTarget){let e=this.activeDragTarget.getBoundingClientRect();try{localStorage.setItem(`memecord_dock_pos`,JSON.stringify({left:e.left,top:e.top}))}catch{}}this.activeDragTarget=null}};e.addEventListener(`mousedown`,t)};this.element&&e(this.element),this.summonBubble&&e(this.summonBubble)}restorePosition(){try{let e=localStorage.getItem(`memecord_dock_pos`);if(e){let{left:t,top:n}=JSON.parse(e);if(typeof t==`number`&&typeof n==`number`){let e=window.innerWidth-120,r=window.innerHeight-50,i=Math.max(10,Math.min(e,t)),a=Math.max(10,Math.min(r,n));this.element&&(this.element.style.left=`${i}px`,this.element.style.top=`${a}px`,this.element.style.bottom=`auto`,this.element.style.transform=`none`),this.summonBubble&&(this.summonBubble.style.left=`${i}px`,this.summonBubble.style.top=`${a}px`,this.summonBubble.style.bottom=`auto`,this.summonBubble.style.transform=`none`)}}}catch{}}setVisible(e){this.isVisible=e,e?this.isMinimized?this.summonBubble&&(this.summonBubble.style.display=`flex`):this.element&&(this.element.style.display=`flex`):(this.element&&(this.element.style.display=`none`),this.summonBubble&&(this.summonBubble.style.display=`none`))}destroy(){this.closeContextMenu(),this.element&&this.element.parentElement&&(this.element.parentElement.removeChild(this.element),this.element=null),this.summonBubble&&this.summonBubble.parentElement&&(this.summonBubble.parentElement.removeChild(this.summonBubble),this.summonBubble=null)}},s=`
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
`,c=class{root=null;currentMemeBox=null;currentToast=null;currentModal=null;hideTimeoutId=null;removeTimeoutId=null;toastTimeoutId=null;floatingDock=null;settings;callbacks;constructor(e,t={}){this.settings=e,this.callbacks=t,this.initRoot(),this.root&&(this.floatingDock=new o(this.root,this.settings.memes,{onTriggerMeme:e=>{this.callbacks.onTriggerMeme?.(e),this.showMeme(e)},onAddMeme:()=>{this.openQuickAddModal()},onDeleteMeme:e=>{let t=this.settings.memes.find(t=>t.id===e);this.callbacks.onDeleteMeme?.(e),this.showToast(`🗑️ Removed "${t?.name||`Meme`}" from dock`)},onCloseDock:()=>{this.callbacks.onCloseDock?.(),this.showToast(`🎭 HUD Minimized • Press Alt+M or click bubble to reopen`)}}),this.floatingDock.setVisible(this.settings.dockVisible&&this.settings.enabled))}updateSettings(e){this.settings=e,this.floatingDock?.updateMemes(e.memes),this.floatingDock?.setVisible(e.dockVisible&&e.enabled)}setDockVisible(e){this.floatingDock?.setVisible(e)}setDockMinimized(e){this.floatingDock?.setMinimized(e)}showToast(e,t=2500){if(!this.root)return;this.currentToast&&=(this.currentToast.remove(),null),this.toastTimeoutId&&=(clearTimeout(this.toastTimeoutId),null);let n=document.createElement(`div`);n.className=`memecord-toast`,n.innerHTML=`<span>✨</span><span>${e}</span>`,this.root.appendChild(n),this.currentToast=n,requestAnimationFrame(()=>{n.classList.add(`visible`)}),this.toastTimeoutId=setTimeout(()=>{n.classList.remove(`visible`),n.classList.add(`hiding`),setTimeout(()=>{n.parentElement&&n.remove(),this.currentToast===n&&(this.currentToast=null)},300)},t)}showMeme(e){if(!this.root||!this.settings.enabled)return;this.settings.soundEnabled&&this.playTriggerSound(),this.hideTimeoutId&&=(clearTimeout(this.hideTimeoutId),null),this.removeTimeoutId&&=(clearTimeout(this.removeTimeoutId),null),this.currentMemeBox&&=(this.currentMemeBox.remove(),null);let t=e.assetUrl;if(t.startsWith(`http://`)||t.startsWith(`https://`)||t.startsWith(`data:`))t=e.assetUrl;else if(typeof chrome<`u`&&chrome.runtime?.id&&chrome.runtime?.getURL)try{t=chrome.runtime.getURL(e.assetUrl.replace(/^\//,``))}catch{t=e.assetUrl.startsWith(`/`)?e.assetUrl:`/${e.assetUrl}`}else t=e.assetUrl.startsWith(`/`)?e.assetUrl:`/${e.assetUrl}`;let n=this.getPositionClass(this.settings.position||`top-center`),r=document.createElement(`div`);r.className=`memecord-meme-box ${n}`;let a=t.startsWith(`data:video/`)||t.endsWith(`.mp4`)||t.endsWith(`.webm`),o;if(a){let e=document.createElement(`video`);e.className=`memecord-meme-image`,e.src=t,e.autoplay=!0,e.loop=!0,e.muted=!0,e.playsInline=!0,o=e}else{let n=document.createElement(`img`);n.className=`memecord-meme-image`,n.referrerPolicy=`no-referrer`,n.src=t,n.alt=e.name,n.onerror=async()=>{if(t.startsWith(`http`)&&!t.startsWith(`data:`)){console.warn(`[Memecord] Direct image blocked by page CSP, converting via background proxy...`);let e=await i(t);e&&e.startsWith(`data:`)&&(n.src=e)}},o=n}let s=document.createElement(`div`);s.className=`memecord-meme-title`,s.textContent=`${e.emoji||`✨`} ${e.name}`,r.appendChild(o),r.appendChild(s),this.root.appendChild(r),this.currentMemeBox=r,requestAnimationFrame(()=>{r.classList.add(`visible`)});let c=e.durationMs||this.settings.defaultDurationMs||2500;this.hideTimeoutId=setTimeout(()=>{r.classList.remove(`visible`),r.classList.add(`hiding`),this.removeTimeoutId=setTimeout(()=>{r.parentElement&&r.remove(),this.currentMemeBox===r&&(this.currentMemeBox=null)},300)},c)}openQuickAddModal(){if(!this.root)return;this.currentModal&&=(this.currentModal.remove(),null);let e=n(this.settings.memes.length),t=document.createElement(`div`);t.className=`memecord-quick-add-modal`,t.innerHTML=`
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
    `,this.root.appendChild(t),this.currentModal=t;let a=()=>{this.currentModal&&=(this.currentModal.remove(),null)};t.querySelector(`#memecord-modal-close-btn`)?.addEventListener(`click`,a),t.querySelector(`#memecord-add-cancel`)?.addEventListener(`click`,a);let o=t.querySelector(`#memecord-add-url`),s=t.querySelector(`#memecord-add-name`),c=t.querySelector(`#memecord-add-emoji`),l=t.querySelector(`#memecord-add-key`),u=t.querySelector(`#memecord-url-status`),d=t.querySelector(`#memecord-preview-wrap`),f=t.querySelector(`#memecord-preview-thumb`),p=t.querySelector(`#memecord-preview-name`),m=null,h=``,g=()=>{let e=o.value.trim();if(!e){d.style.display=`none`,u.textContent=``;return}u.textContent=`Resolving media link...`,m&&clearTimeout(m),m=setTimeout(async()=>{try{let t=await r(e);h=t.url,t.name&&!s.value&&(s.value=t.name),t.emoji&&c.value===`✨`&&(c.value=t.emoji),u.textContent=`✓ Ready to add`,u.style.color=`#10b981`,f.src=h,p.textContent=`${c.value} ${s.value||`Meme`}`,d.style.display=`flex`}catch(e){u.textContent=e?.message||`Invalid URL`,u.style.color=`#ef4444`}},250)};o.addEventListener(`input`,g),o.addEventListener(`paste`,()=>setTimeout(g,10)),t.querySelector(`#memecord-add-submit`)?.addEventListener(`click`,async()=>{let n=o.value.trim();if(!n){o.focus(),o.style.borderColor=`#ef4444`;return}let d=t.querySelector(`#memecord-add-submit`);d.disabled=!0,d.textContent=`Saving...`;try{let t=await r(n),o=await i(t.url),u=s.value.trim()||t.name||`Custom Meme`,d=c.value.trim()||`✨`,f=l.value.trim()||e,p={id:`meme_${Date.now()}`,name:u,emoji:d,assetUrl:o,hotkey:f,durationMs:this.settings.defaultDurationMs||2500};a(),this.callbacks.onAddMeme?.(p),this.showToast(`Added "${u}" [Key ${f}]!`)}catch(e){u.textContent=`Error: ${e?.message||`Failed to save`}`,u.style.color=`#ef4444`,d.disabled=!1,d.textContent=`Add to Dock`}})}playTriggerSound(){try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createGain();t.type=`sine`,t.frequency.setValueAtTime(480,e.currentTime),t.frequency.exponentialRampToValueAtTime(960,e.currentTime+.1),n.gain.setValueAtTime(.12,e.currentTime),n.gain.exponentialRampToValueAtTime(.001,e.currentTime+.1),t.connect(n),n.connect(e.destination),t.start(),t.stop(e.currentTime+.11)}catch{}}getPositionClass(e){switch(e){case`center`:return`pos-center`;case`top-right`:return`pos-top-right`;case`bottom-right`:return`pos-bottom-right`;default:return`pos-top-center`}}initRoot(){if(!document.getElementById(`memecord-injected-styles`)){let e=document.createElement(`style`);e.id=`memecord-injected-styles`,e.textContent=s,(document.head||document.documentElement).appendChild(e)}let e=document.getElementById(`memecord-overlay-root`);e||(e=document.createElement(`div`),e.id=`memecord-overlay-root`,(document.body||document.documentElement).appendChild(e)),this.root=e}destroy(){this.hideTimeoutId&&clearTimeout(this.hideTimeoutId),this.removeTimeoutId&&clearTimeout(this.removeTimeoutId),this.toastTimeoutId&&clearTimeout(this.toastTimeoutId),this.floatingDock&&=(this.floatingDock.destroy(),null),this.currentModal&&=(this.currentModal.remove(),null),this.root&&this.root.parentElement&&(this.root.parentElement.removeChild(this.root),this.root=null)}},l=[{id:`thumbs_up`,name:`Thumbs Up`,emoji:`👍`,assetUrl:`memes/thumbs-up.gif`,hotkey:`1`,durationMs:2500},{id:`victory`,name:`Peace / Victory`,emoji:`✌️`,assetUrl:`memes/victory.gif`,hotkey:`2`,durationMs:2500},{id:`stop`,name:`Wait / Hold Up`,emoji:`🖐`,assetUrl:`memes/stop.gif`,hotkey:`3`,durationMs:2500},{id:`cinema`,name:`Absolute Cinema`,emoji:`🙌`,assetUrl:`memes/absolute-cinema.gif`,hotkey:`4`,durationMs:3e3},{id:`rock_on`,name:`Rock On / Headbang`,emoji:`🤘`,assetUrl:`memes/rock-on.gif`,hotkey:`5`,durationMs:2500},{id:`pointing`,name:`Big Brain / Roll Safe`,emoji:`☝️`,assetUrl:`memes/pointing.gif`,hotkey:`6`,durationMs:2500},{id:`noice`,name:`Noice (Michael Rosen)`,emoji:`👌`,assetUrl:`memes/noice.gif`,hotkey:`7`,durationMs:2200},{id:`fist`,name:`Arthur Fist`,emoji:`✊`,assetUrl:`memes/fist.gif`,hotkey:`8`,durationMs:2500},{id:`perfection`,name:`Chef Kiss / Perfection`,emoji:`✨`,assetUrl:`memes/perfection.gif`,hotkey:`9`,durationMs:2500}];[...l];var u={enabled:!0,dockVisible:!0,defaultDurationMs:2500,position:`top-center`,soundEnabled:!0,memes:l},d=`mememeet_settings`;async function f(){try{if(typeof chrome<`u`&&chrome.storage&&chrome.storage.local){let e=await chrome.storage.local.get(d),t=e?e[d]:void 0;if(t)return{...u,...t,memes:Array.isArray(t.memes)&&t.memes.length>0?t.memes:u.memes}}else if(typeof localStorage<`u`){let e=localStorage.getItem(d);if(e){let t=JSON.parse(e);return{...u,...t,memes:Array.isArray(t.memes)&&t.memes.length>0?t.memes:u.memes}}}}catch(e){console.warn(`[MemeMeet] Failed to read settings, using defaults:`,e)}return u}async function p(e){let t={...await f(),...e};try{typeof chrome<`u`&&chrome.storage&&chrome.storage.local?await chrome.storage.local.set({[d]:t}):typeof localStorage<`u`&&localStorage.setItem(d,JSON.stringify(t))}catch(e){console.error(`[MemeMeet] Failed to save settings:`,e)}return t}async function m(e){let t=await f(),n=t.memes.findIndex(t=>t.id===e.id),r;return n>=0?(r=[...t.memes],r[n]=e):r=[...t.memes,e],p({memes:r})}async function h(e){return p({memes:(await f()).memes.filter(t=>t.id!==e)})}var g=class{overlay=null;settings=null;keydownHandler=null;isDestroyed=!1;isInCall=!1;isCameraStreaming=!1;callCheckIntervalId=null;spaObserver=null;async init(){this.settings=await f(),this.ensureInjectedScript(),this.overlay=new c(this.settings,{onTriggerMeme:e=>{this.triggerMeme(e)},onAddMeme:async e=>{let t=await m(e);this.settings=t,this.overlay?.updateSettings(t)},onDeleteMeme:async e=>{let t=await h(e);this.settings=t,this.overlay?.updateSettings(t)},onCloseDock:()=>{this.settings&&(p({dockVisible:!1}),this.settings.dockVisible=!1)}}),this.overlay.setDockVisible(!1),this.registerKeyboardShortcuts(),this.setupListeners(),this.setupCallStateMonitoring(),this.checkCallState(),console.log(`[Memecord] Call-sensitive Overlay Controller initialized.`)}async triggerMeme(e){if(!this.settings||!this.settings.enabled)return;this.overlay?.showMeme(e);let t=await i(e.assetUrl),n={source:`MEMECORD_CONTENT`,type:`TRIGGER_CAMERA_MEME`,meme:{...e,assetUrl:t},position:this.settings.position||`center`};window.postMessage(n,`*`);try{document.querySelectorAll(`iframe`).forEach(e=>{try{e.contentWindow?.postMessage(n,`*`)}catch{}})}catch{}if(window.parent&&window.parent!==window)try{window.parent.postMessage(n,`*`)}catch{}}isTestLab(){let e=window.location.href;return window.location.pathname.includes(`/test/`)||e.includes(`test/index.html`)||e.includes(`:4182`)||e.includes(`localhost:5173`)}isOngoingVideoCall(){if(this.isTestLab()||this.isCameraStreaming)return!0;let e=window.location.hostname,t=window.location.pathname;if(e.includes(`meet.google.com`)){if(!(/^\/[a-z]{3}-[a-z]{4}-[a-z]{3}/i.test(t)||t.includes(`/_meet/`))||document.querySelector(`button[aria-label*="Join now" i], button[aria-label*="Ask to join" i]`))return!1;let e=!!document.querySelector(`button[aria-label*="Leave call" i], button[data-tooltip*="Leave call" i], button[aria-label*="End call" i]`),n=!!document.querySelector(`button[aria-label*="Turn off microphone" i], button[aria-label*="Turn on microphone" i], button[aria-label*="Turn off camera" i], button[aria-label*="Raise hand" i]`);return e||n}if(e.includes(`discord.com`)){let e=!!document.querySelector(`button[aria-label*="Disconnect" i], button[aria-label*="Leave Call" i]`),t=!!document.querySelector(`div[class*="videoGrid"], div[class*="callContainer"], div[class*="wrapperInCall"]`);return e||t}return e.includes(`zoom.us`)?t.includes(`/wc/`)?!!document.querySelector(`button[aria-label*="Leave" i], button[aria-label*="End" i], .footer-button__button--leave`):!1:e.includes(`teams.microsoft.com`)||e.includes(`teams.live.com`)?!!document.querySelector(`button[aria-label*="Leave" i], button#hangup-button, button[id*="hangup"]`):e.includes(`slack.com`)?!!document.querySelector(`button[data-qa*="leave" i], button[aria-label*="Leave call" i], div[data-qa*="huddle"]`):e.includes(`facetime.apple.com`)?!!document.querySelector(`button[aria-label*="Leave" i], button[aria-label*="End" i]`):!1}checkCallState(){let e=this.isOngoingVideoCall();e&&!this.isInCall?(this.isInCall=!0,console.log(`[Memecord] Ongoing video call detected -> showing HUD & enabling hotkeys`),this.settings?.dockVisible&&this.settings.enabled&&this.overlay?.setDockVisible(!0),this.overlay?.showToast(`🎭 Memecord Active! Press 1–9 or click dock`)):!e&&this.isInCall&&(this.isInCall=!1,console.log(`[Memecord] Call ended / outside video call -> hiding HUD`),this.overlay?.setDockVisible(!1))}setupCallStateMonitoring(){window.addEventListener(`message`,e=>{e.data?.source===`MEMECORD_CAMERA`&&e.data?.type===`CAMERA_CALL_STATE`&&(this.isCameraStreaming=!!e.data.active,this.checkCallState())}),this.callCheckIntervalId=setInterval(()=>{this.checkCallState()},1e3),this.spaObserver=new MutationObserver(()=>{this.checkCallState()});let e=document.body||document.documentElement;e&&this.spaObserver.observe(e,{childList:!0,subtree:!0})}ensureInjectedScript(){try{if(typeof chrome<`u`&&chrome.runtime?.getURL){let e=document.createElement(`script`);e.src=chrome.runtime.getURL(`inject.js`),e.onload=()=>e.remove(),(document.head||document.documentElement).appendChild(e)}}catch{}}registerKeyboardShortcuts(){this.keydownHandler=e=>{if(!this.settings||!this.settings.enabled||!this.isInCall)return;let t=document.activeElement;if(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable||t.getAttribute(`role`)===`textbox`))return;if(e.altKey&&(e.key===`m`||e.key===`M`)){e.preventDefault();let t=!this.settings.dockVisible;p({dockVisible:t}),this.settings.dockVisible=t,this.overlay?.setDockMinimized(!t),this.overlay?.setDockVisible(!0),this.overlay?.showToast(t?`🎭 Memecord HUD Expanded`:`🎭 Memecord HUD Minimized (Alt+M)`);return}let r=e.key,i=this.settings.memes.find((e,t)=>{let i=e.hotkey||n(t);return i&&i.toLowerCase()===r.toLowerCase()});i&&(e.preventDefault(),console.log(`[Memecord] Hotkey [${r}] triggered: ${i.name}`),this.triggerMeme(i))},window.addEventListener(`keydown`,this.keydownHandler,!0)}setupListeners(){typeof chrome<`u`&&chrome.storage?.onChanged&&chrome.storage.onChanged.addListener((e,t)=>{if(t===`local`&&e.mememeet_settings){let t=e.mememeet_settings.newValue;t&&(this.settings=t,this.overlay?.updateSettings(t),this.overlay?.setDockVisible(this.isInCall&&t.dockVisible&&t.enabled),window.postMessage({source:`MEMECORD_CONTENT`,type:`UPDATE_CAMERA_SETTINGS`,position:t.position||`center`},`*`))}}),typeof chrome<`u`&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener((e,t,n)=>{if(e.type===`TRIGGER_MEME`){let t=this.settings?.memes.find(t=>t.id===e.memeId);return t&&(this.triggerMeme(t),n({success:!0})),!0}if(e.type===`TRIGGER_MEME_ITEM`)return this.triggerMeme(e.meme),n({success:!0}),!0;if(e.type===`TOGGLE_DOCK`){if(this.settings){let e=!this.settings.dockVisible;p({dockVisible:e}),this.overlay?.setDockVisible(this.isInCall&&e),n({dockVisible:e})}return!0}return!1})}destroy(){this.isDestroyed||(this.isDestroyed=!0,this.callCheckIntervalId&&=(clearInterval(this.callCheckIntervalId),null),this.spaObserver&&=(this.spaObserver.disconnect(),null),this.keydownHandler&&=(window.removeEventListener(`keydown`,this.keydownHandler,!0),null),this.overlay&&=(this.overlay.destroy(),null))}};function _(){if(window.__MEMECORD_INITIALIZED__)return;window.__MEMECORD_INITIALIZED__=!0;let e=new g;window.__MEMECORD_CONTROLLER__=e,document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>{e.init()}):e.init()}_()})();