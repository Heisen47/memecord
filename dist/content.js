(function(){var e=document.createElement(`style`);e.textContent=`#memecord-overlay-root{-webkit-user-select:none;user-select:none;width:100vw;height:100vh;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Helvetica,Arial,sans-serif;position:fixed;inset:0;overflow:hidden;pointer-events:none!important;z-index:2147483647!important}.memecord-meme-box{pointer-events:none;opacity:0;filter:drop-shadow(0 25px 45px #000000bf);z-index:2147483647;flex-direction:column;justify-content:center;align-items:center;transition:transform .3s cubic-bezier(.175,.885,.32,1.275),opacity .24s ease-out;display:flex;position:absolute}.memecord-meme-box.pos-center{top:50%;left:50%;transform:translate(-50%,-50%)scale(.65)}.memecord-meme-box.pos-center.visible{opacity:1;transform:translate(-50%,-50%)scale(1)}.memecord-meme-box.pos-center.hiding{opacity:0;transform:translate(-50%,-50%)scale(.85)}.memecord-meme-box.pos-top-center{top:24px;left:50%;transform:translate(-50%)translateY(-25px)scale(.8)}.memecord-meme-box.pos-top-center.visible{opacity:1;transform:translate(-50%)translateY(0)scale(1)}.memecord-meme-box.pos-top-center.hiding{opacity:0;transform:translate(-50%)translateY(-20px)scale(.8)}.memecord-meme-box.pos-top-right{top:24px;right:28px;transform:translateY(-20px)scale(.8)}.memecord-meme-box.pos-top-right.visible{opacity:1;transform:translateY(0)scale(1)}.memecord-meme-box.pos-top-right.hiding{opacity:0;transform:translateY(-20px)scale(.8)}.memecord-meme-box.pos-bottom-right{bottom:90px;right:28px;transform:translateY(20px)scale(.8)}.memecord-meme-box.pos-bottom-right.visible{opacity:1;transform:translateY(0)scale(1)}.memecord-meme-box.pos-bottom-right.hiding{opacity:0;transform:translateY(20px)scale(.8)}.memecord-meme-image{object-fit:contain;background:#090d16;border:3.5px solid #fffffff2;border-radius:20px;max-width:min(85vw,460px);max-height:min(65vh,400px);box-shadow:0 20px 50px #0009,0 0 35px #6366f166}video.memecord-meme-image{outline:none}.memecord-meme-title{-webkit-backdrop-filter:blur(14px);color:#f8fafc;letter-spacing:.4px;background:#0f172ae0;border:1px solid #ffffff2e;border-radius:9999px;margin-top:10px;padding:6px 20px;font-size:14px;font-weight:700;box-shadow:0 6px 18px #0006}.memecord-deck{-webkit-backdrop-filter:blur(36px)saturate(210%);color:#f8fafc;z-index:2147483646;box-sizing:border-box;-webkit-user-select:none;user-select:none;background:#0a0f1ee0;border:1px solid #ffffff29;border-radius:24px;flex-direction:column;width:min(620px,94vw);font-size:13px;transition:transform .28s cubic-bezier(.16,1,.3,1),opacity .22s,border-color .2s,box-shadow .25s;display:flex;position:fixed;bottom:24px;left:50%;overflow:hidden;transform:translate(-50%);box-shadow:0 24px 60px -10px #000000d9,0 0 35px #6366f138,inset 0 1px 1px #ffffff59;pointer-events:auto!important}.memecord-deck:hover{border-color:#6366f18c;box-shadow:0 28px 70px -8px #000000e6,0 0 40px #6366f152,inset 0 1px 1px #ffffff73}.memecord-deck.hiding{opacity:0;transform:translate(-50%)scale(.88);pointer-events:none!important}.memecord-deck.entering{animation:.28s cubic-bezier(.16,1,.3,1) forwards memecord-spring-in}@keyframes memecord-spring-in{0%{opacity:0;transform:translate(-50%)scale(.88)}70%{transform:translate(-50%)scale(1.02)}to{opacity:1;transform:translate(-50%)scale(1)}}.memecord-deck-header{background:#ffffff08;border-bottom:1px solid #ffffff14;justify-content:space-between;align-items:center;gap:10px;padding:10px 16px;display:flex}.memecord-deck-brand{cursor:grab;align-items:center;gap:8px;display:flex}.memecord-deck-brand:active{cursor:grabbing}.memecord-drag-grip{color:#64748b;cursor:grab;letter-spacing:1px;padding:2px 4px;font-size:14px;transition:color .15s}.memecord-drag-grip:hover{color:#a5b4fc}.memecord-status-dot{background:#10b981;border-radius:50%;width:7px;height:7px;animation:2.2s infinite memecord-pulse;box-shadow:0 0 10px #10b981,0 0 4px #34d399}@keyframes memecord-pulse{0%{opacity:1;transform:scale(1)}50%{opacity:.75;transform:scale(1.3)}to{opacity:1;transform:scale(1)}}.memecord-deck-title{color:#f8fafc;letter-spacing:-.2px;font-size:13px;font-weight:800}.memecord-count-badge{color:#a5b4fc;background:#6366f133;border:1px solid #818cf859;border-radius:9999px;padding:1px 6px;font-size:10px;font-weight:800}.memecord-search-box{background:#0f172aa6;border:1px solid #ffffff1f;border-radius:10px;flex:1;align-items:center;gap:6px;max-width:200px;padding:4px 9px;transition:border-color .15s;display:flex}.memecord-search-box:focus-within{border-color:#818cf8;box-shadow:0 0 0 2px #6366f140}.memecord-search-icon{opacity:.7;font-size:11px}.memecord-search-input{color:#f8fafc;background:0 0;border:none;outline:none;width:100%;font-size:11px}.memecord-search-input::placeholder{color:#64748b}.memecord-deck-actions{align-items:center;gap:6px;display:flex}.memecord-deck-action-btn{color:#cbd5e1;cursor:pointer;background:#ffffff12;border:1px solid #ffffff24;border-radius:8px;justify-content:center;align-items:center;padding:4px 9px;font-size:11px;font-weight:700;transition:all .18s cubic-bezier(.16,1,.3,1);display:flex}.memecord-deck-action-btn:hover{color:#fff;background:#ffffff29;border-color:#ffffff47;transform:translateY(-1px)}.memecord-deck-action-btn:active{transform:scale(.96)}.memecord-deck-action-btn.edit-btn.active{color:#fca5a5;background:#ef444452;border-color:#ef4444;box-shadow:0 0 10px #ef444466}.memecord-deck-action-btn.add-btn{color:#fff;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-color:#c7d2fe66}.memecord-deck-action-btn.add-btn:hover{filter:brightness(1.15);box-shadow:0 4px 14px #6366f173}.memecord-deck-action-btn.close-btn{color:#94a3b8;border-radius:50%;width:24px;height:24px;padding:0;font-size:11px}.memecord-deck-action-btn.close-btn:hover{color:#fecaca;background:#ef444459;border-color:#f87171}.memecord-deck-grid{box-sizing:border-box;grid-template-columns:repeat(auto-fill,minmax(105px,1fr));gap:10px;max-height:290px;padding:14px 16px;display:grid;overflow-y:auto}.memecord-deck-grid::-webkit-scrollbar{width:6px}.memecord-deck-grid::-webkit-scrollbar-track{background:#ffffff08;border-radius:9999px}.memecord-deck-grid::-webkit-scrollbar-thumb{background:#818cf84d;border-radius:9999px}.memecord-deck-grid::-webkit-scrollbar-thumb:hover{background:#818cf88c}.memecord-deck-empty{color:#94a3b8;text-align:center;flex-direction:column;grid-column:1/-1;justify-content:center;align-items:center;padding:28px 12px;display:flex}.memecord-card{cursor:pointer;-webkit-user-select:none;user-select:none;box-sizing:border-box;background:#ffffff0d;border:1px solid #ffffff1a;border-radius:14px;flex-direction:column;justify-content:space-between;align-items:center;min-height:96px;padding:8px 6px;transition:transform .22s cubic-bezier(.34,1.56,.64,1),background-color .16s,border-color .18s,box-shadow .2s;display:flex;position:relative}.memecord-card:hover{z-index:5;background:#6366f129;border-color:#a5b4fc99;transform:translateY(-4px)scale(1.04);box-shadow:0 14px 28px -4px #000000a6,0 0 18px #6366f159}.memecord-card:active{transform:translateY(-1px)scale(.97)}.memecord-card-hotkey{color:#c7d2fe;z-index:2;cursor:default;background:#0a0f1df0;border:1px solid #818cf88c;border-radius:6px;padding:1px 5px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:8.5px;font-weight:800;line-height:1;position:absolute;top:5px;right:5px;box-shadow:0 2px 6px #0009}.memecord-card-hotkey.editable{cursor:pointer;color:#fef3c7;background:#f59e0b40;border-color:#f59e0b;transition:all .18s;box-shadow:0 0 10px #f59e0b66}.memecord-card-hotkey.editable:hover{color:#1e1b4b;background:#f59e0b;transform:scale(1.15)}.memecord-keybind-modal{-webkit-backdrop-filter:blur(28px);z-index:2147483647;color:#f8fafc;background:#0f172af5;border:1px solid #ffffff2e;border-radius:22px;flex-direction:column;width:min(92vw,420px);padding:22px 24px;animation:.2s cubic-bezier(.16,1,.3,1) memecord-menu-pop;display:flex;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 30px 70px #000000d9,0 0 35px #6366f159;pointer-events:auto!important}.memecord-keybind-display-box{background:#00000073;border:2px dashed #818cf899;border-radius:14px;flex-direction:column;justify-content:center;align-items:center;width:140px;margin:10px auto 0;padding:12px;transition:all .2s;display:flex}.memecord-keybind-display-box:focus-within,.memecord-keybind-display-box:hover{background:#6366f126;border-color:#818cf8;box-shadow:0 0 20px #6366f166}.memecord-keybind-large-key{color:#fff;text-shadow:0 0 14px #818cf8cc;font-family:ui-monospace,SFMono-Regular,monospace;font-size:32px;font-weight:900;line-height:1.2}.memecord-keybind-press-hint{color:#34d399;margin-top:4px;font-size:10px;font-weight:700;animation:1.8s infinite memecord-pulse}.memecord-keybind-quick-grid{grid-template-columns:repeat(9,1fr);gap:5px;margin-top:4px;display:grid}.memecord-quick-key-btn{color:#cbd5e1;cursor:pointer;background:#ffffff12;border:1px solid #ffffff1f;border-radius:6px;padding:6px 0;font-family:ui-monospace,SFMono-Regular,monospace;font-size:11px;font-weight:800;transition:all .15s}.memecord-quick-key-btn:hover{color:#fff;background:#6366f159;border-color:#818cf8;transform:translateY(-1px)}.memecord-quick-key-btn.active{color:#fff;background:#6366f1;border-color:#a5b4fc;box-shadow:0 0 10px #6366f199}.memecord-card-thumb-wrap{background:#00000047;border-radius:10px;justify-content:center;align-items:center;width:46px;height:46px;margin-top:4px;display:flex;overflow:hidden}.memecord-card-img{object-fit:cover;border-radius:10px;width:100%;height:100%}.memecord-card-emoji-fallback{justify-content:center;align-items:center;font-size:26px;display:flex}.memecord-card-name{color:#f1f5f9;text-align:center;white-space:nowrap;text-overflow:ellipsis;max-width:90px;margin-top:5px;font-size:11px;font-weight:700;overflow:hidden}.memecord-card.add-card{background:#6366f10d;border:1.5px dashed #a5b4fc59;justify-content:center;gap:4px}.memecord-card.add-card:hover{background:#6366f133;border-color:#818cf8;transform:translateY(-3px)scale(1.04)}.memecord-add-card-icon{color:#818cf8;font-size:24px;font-weight:700}.memecord-card.wiggling{animation:.28s ease-in-out infinite alternate memecord-wiggle}.memecord-card.wiggling:nth-child(2n){animation-duration:.32s;animation-delay:40ms}@keyframes memecord-wiggle{0%{transform:rotate(-2.5deg)}to{transform:rotate(2.5deg)}}.memecord-card-delete-badge{color:#fff;cursor:pointer;z-index:10;background:#ef4444;border:1.5px solid #fff;border-radius:50%;justify-content:center;align-items:center;width:20px;height:20px;font-size:10px;font-weight:900;transition:transform .15s;display:flex;position:absolute;top:-6px;right:-6px;box-shadow:0 2px 8px #ef4444b3}.memecord-card-delete-badge:hover{background:#dc2626;transform:scale(1.22)}.memecord-click-ripple{pointer-events:none;border:2px solid #818cf8;border-radius:14px;animation:.38s ease-out forwards memecord-ripple-anim;position:absolute;inset:-4px}@keyframes memecord-ripple-anim{0%{opacity:1;border-color:#a5b4fc;transform:scale(.9)}to{opacity:0;border-color:#6366f1;transform:scale(1.15)}}.memecord-deck-footer{color:#94a3b8;background:#00000047;border-top:1px solid #ffffff14;justify-content:space-between;align-items:center;gap:8px;padding:8px 16px;font-size:11px;display:flex}.memecord-deck-hint strong{color:#c7d2fe}.memecord-deck-pos-wrap{align-items:center;gap:5px;display:flex}.memecord-pos-pill{color:#94a3b8;cursor:pointer;background:#ffffff0f;border:1px solid #ffffff1f;border-radius:6px;padding:2px 7px;font-size:10px;font-weight:700;transition:all .15s}.memecord-pos-pill:hover{color:#fff;background:#ffffff1f}.memecord-pos-pill.active{color:#e0e7ff;background:#6366f166;border-color:#818cf8}.memecord-summon-bubble{-webkit-backdrop-filter:blur(28px)saturate(210%);cursor:pointer;color:#f8fafc;z-index:2147483646;-webkit-user-select:none;user-select:none;background:#0a0f1dd1;border:1px solid #ffffff2e;border-radius:9999px;align-items:center;gap:8px;padding:7px 14px;font-size:12px;font-weight:700;transition:all .24s cubic-bezier(.16,1,.3,1);animation:.25s cubic-bezier(.16,1,.3,1) memecord-summon-in;display:flex;position:fixed;bottom:24px;left:50%;transform:translate(-50%);box-shadow:0 16px 40px #000000a6,0 0 20px #6366f140,inset 0 1px 1px #ffffff4d;pointer-events:auto!important}.memecord-summon-bubble:hover{background:#0f172af0;border-color:#818cf8a6;transform:translate(-50%)translateY(-4px)scale(1.06);box-shadow:0 22px 50px #000000bf,0 0 30px #6366f173,inset 0 1px 1px #ffffff73}.memecord-summon-bubble:active{transform:translate(-50%)scale(.96)}@keyframes memecord-summon-in{0%{opacity:0;transform:translate(-50%)scale(.7)}to{opacity:1;transform:translate(-50%)scale(1)}}.memecord-summon-icon{font-size:15px}.memecord-summon-label{letter-spacing:-.2px;font-size:12px}.memecord-summon-key{color:#a5b4fc;background:#6366f140;border:1px solid #818cf866;border-radius:6px;padding:2px 6px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:9px;font-weight:800}.memecord-tooltip{-webkit-backdrop-filter:blur(20px);color:#f8fafc;white-space:nowrap;pointer-events:none;opacity:0;z-index:2147483647;background:#0a0f1df2;border:1px solid #fff3;border-radius:10px;align-items:center;gap:6px;padding:5px 11px;font-size:11px;font-weight:600;transition:all .16s cubic-bezier(.16,1,.3,1);display:flex;position:absolute;bottom:50px;left:50%;transform:translate(-50%)translateY(4px);box-shadow:0 10px 25px #0009,0 0 15px #6366f133}.memecord-dock-btn:hover .memecord-tooltip{opacity:1;opacity:1;transform:translate(-50%)translateY(0)}.memecord-context-menu{-webkit-backdrop-filter:blur(20px);z-index:2147483647;background:#0f172af2;border:1px solid #ffffff26;border-radius:14px;flex-direction:column;gap:2px;min-width:150px;padding:5px;animation:.15s ease-out memecord-menu-pop;display:flex;position:fixed;box-shadow:0 16px 40px #000000a6,0 0 0 1px #ffffff0d;pointer-events:auto!important}@keyframes memecord-menu-pop{0%{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}.memecord-menu-item{color:#f8fafc;cursor:pointer;text-align:left;background:0 0;border:none;border-radius:8px;align-items:center;gap:8px;padding:7px 12px;font-size:12px;font-weight:500;transition:background .12s;display:flex}.memecord-menu-item:hover{color:#fff;background:#6366f14d}.memecord-menu-item.danger:hover{color:#fca5a5;background:#ef444440}.memecord-quick-add-modal{-webkit-backdrop-filter:blur(28px);z-index:2147483647;color:#f8fafc;background:#0f172af2;border:1px solid #ffffff2e;border-radius:22px;flex-direction:column;gap:14px;width:min(92vw,420px);padding:22px 24px;animation:.2s cubic-bezier(.16,1,.3,1) memecord-menu-pop;display:flex;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 30px 70px #000000d9,0 0 35px #6366f159;pointer-events:auto!important}.memecord-modal-title{letter-spacing:-.2px;justify-content:space-between;align-items:center;font-size:16px;font-weight:800;display:flex}.memecord-modal-close{color:#94a3b8;cursor:pointer;background:0 0;border:none;border-radius:6px;padding:2px 6px;font-size:20px;transition:all .12s}.memecord-modal-close:hover{color:#fff;background:#ffffff1a}.memecord-input-field{color:#fff;box-sizing:border-box;background:#ffffff0f;border:1px solid #ffffff24;border-radius:10px;width:100%;padding:9px 12px;font-size:13px;transition:border-color .15s}.memecord-input-field:focus{border-color:#818cf8;outline:none;box-shadow:0 0 0 2px #6366f14d}.memecord-preview-wrap{background:#0000004d;border:1px solid #ffffff14;border-radius:12px;align-items:center;gap:12px;padding:10px;display:flex}.memecord-preview-thumb{object-fit:cover;background:#1e293b;border-radius:8px;width:50px;height:50px}.memecord-modal-btn-row{justify-content:flex-end;gap:8px;margin-top:6px;display:flex}.memecord-btn-primary{color:#fff;cursor:pointer;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:10px;padding:9px 18px;font-size:13px;font-weight:700;transition:all .15s;box-shadow:0 4px 14px #6366f166}.memecord-btn-primary:hover{filter:brightness(1.12);transform:translateY(-1px)}.memecord-btn-primary:active{transform:translateY(0)}.memecord-btn-secondary{color:#cbd5e1;cursor:pointer;background:#ffffff14;border:1px solid #ffffff24;border-radius:10px;padding:9px 16px;font-size:13px;transition:all .15s}.memecord-btn-secondary:hover{color:#fff;background:#ffffff24}.memecord-toast{-webkit-backdrop-filter:blur(16px);color:#f8fafc;opacity:0;pointer-events:none;z-index:2147483647;background:#0f172af0;border:1px solid #6366f173;border-radius:9999px;align-items:center;gap:8px;padding:8px 22px;font-size:13px;font-weight:600;transition:all .3s cubic-bezier(.16,1,.3,1);display:flex;position:fixed;top:24px;left:50%;transform:translate(-50%)translateY(-20px);box-shadow:0 16px 36px #0009,0 0 24px #6366f14d}.memecord-toast.visible{opacity:1;transform:translate(-50%)translateY(0)}.memecord-toast.hiding{opacity:0;transform:translate(-50%)translateY(-15px)}
/*$vite$:1*/`,document.head.appendChild(e);var t=new Map;function n(e){if(e<9)return String(e+1);if(e===9)return`0`;let t=[`Q`,`W`,`E`,`R`,`T`,`Y`,`U`,`I`,`O`,`P`,`A`,`S`,`D`,`F`],n=e-10;return n<t.length?t[n]:``}async function r(e){let t=e.trim();if(!t)throw Error(`URL cannot be empty`);if(t.startsWith(`data:`))return{url:t,isVideo:t.startsWith(`data:video/`)};if(t.startsWith(`memes/`)||t.startsWith(`/memes/`))return{url:t,isVideo:!1};if(t.includes(`tenor.com`)){if(t.includes(`media.tenor.com`)&&(t.endsWith(`.gif`)||t.endsWith(`.mp4`)||t.endsWith(`.webp`)))return{url:t,isVideo:t.endsWith(`.mp4`)||t.endsWith(`.webm`)};try{let e=await chrome.runtime.sendMessage({type:`RESOLVE_TENOR_URL`,url:t});if(e&&e.success&&e.resolvedUrl)return{url:e.resolvedUrl,name:e.name,emoji:`✨`,isVideo:e.isVideo}}catch(e){console.warn(`[Memecord] Background Tenor resolve failed, trying fallback slug:`,e)}let e=t.match(/\/view\/([a-zA-Z0-9_-]+)/),n=`Tenor Meme`;return e&&e[1]&&(n=e[1].replace(/-gif-\d+$/,``).replace(/-gif$/,``).replace(/-/g,` `).replace(/\b\w/g,e=>e.toUpperCase())),{url:t,name:n,isVideo:!1}}if(t.includes(`giphy.com/gifs/`)){let e=t.match(/-([a-zA-Z0-9]+)$/);if(e&&e[1])return{url:`https://media.giphy.com/media/${e[1]}/giphy.gif`,isVideo:!1}}return{url:t,isVideo:t.endsWith(`.mp4`)||t.endsWith(`.webm`)}}async function i(e){if(e.startsWith(`data:`))return e;if(t.has(e))return t.get(e);let n=e;if((e.startsWith(`memes/`)||e.startsWith(`/memes/`))&&typeof chrome<`u`&&chrome.runtime?.getURL&&(n=chrome.runtime.getURL(e.replace(/^\//,``))),n.startsWith(`chrome-extension://`))try{let r=await(await fetch(n)).blob();return new Promise(n=>{let i=new FileReader;i.onloadend=()=>{let r=i.result;t.set(e,r),n(r)},i.readAsDataURL(r)})}catch(e){console.warn(`[Memecord] Failed to read local asset as data URL:`,e)}try{let r=await chrome.runtime.sendMessage({type:`FETCH_MEDIA_AS_DATA_URL`,url:n});if(r&&r.success&&r.dataUrl)return t.set(e,r.dataUrl),r.dataUrl}catch(e){console.warn(`[Memecord] Failed to convert to data URL via background:`,e)}return e}function a(e=`pop`){try{let t=window.AudioContext||window.webkitAudioContext;if(!t)return;let n=new t,r=n.createOscillator(),i=n.createGain();r.type=`sine`;let a=n.currentTime;e===`pop`?(r.frequency.setValueAtTime(440,a),r.frequency.exponentialRampToValueAtTime(880,a+.08),i.gain.setValueAtTime(.09,a),i.gain.exponentialRampToValueAtTime(.001,a+.08),r.start(a),r.stop(a+.09)):e===`minimize`?(r.frequency.setValueAtTime(600,a),r.frequency.exponentialRampToValueAtTime(320,a+.1),i.gain.setValueAtTime(.08,a),i.gain.exponentialRampToValueAtTime(.001,a+.1),r.start(a),r.stop(a+.11)):e===`expand`?(r.frequency.setValueAtTime(360,a),r.frequency.exponentialRampToValueAtTime(720,a+.1),i.gain.setValueAtTime(.08,a),i.gain.exponentialRampToValueAtTime(.001,a+.1),r.start(a),r.stop(a+.11)):e===`delete`&&(r.frequency.setValueAtTime(300,a),r.frequency.exponentialRampToValueAtTime(150,a+.12),i.gain.setValueAtTime(.1,a),i.gain.exponentialRampToValueAtTime(.001,a+.12),r.start(a),r.stop(a+.13))}catch{}}function o(e){return e?e.startsWith(`http://`)||e.startsWith(`https://`)||e.startsWith(`data:`)?e:typeof chrome<`u`&&chrome.runtime&&chrome.runtime.getURL?chrome.runtime.getURL(e.replace(/^\//,``)):e.startsWith(`/`)?e:`/${e}`:``}var s=class{element=null;summonBubble=null;gridContainer=null;countBadge=null;contextMenu=null;activeModal=null;isMinimized=!1;isEditMode=!1;isVisible=!0;searchQuery=``;currentPosition=`center`;memes=[];callbacks;isDragging=!1;dragStartX=0;dragStartY=0;initialLeft=0;initialTop=0;activeDragTarget=null;constructor(e,t,n,r=`center`){this.memes=t,this.callbacks=n,this.currentPosition=r,this.createDom(e),this.setupDraggable(),this.setupOutsideClickListener()}createDom(e){let t=document.createElement(`div`);t.className=`memecord-deck`;let n=document.createElement(`div`);n.className=`memecord-deck-header`;let r=document.createElement(`div`);r.className=`memecord-deck-brand`;let i=document.createElement(`span`);i.className=`memecord-drag-grip`,i.textContent=`⠿`,i.title=`Drag Deck anywhere on screen`;let o=document.createElement(`span`);o.className=`memecord-status-dot`;let s=document.createElement(`span`);s.className=`memecord-deck-title`,s.textContent=`Memecord Deck`;let c=document.createElement(`span`);c.className=`memecord-count-badge`,c.textContent=`${this.memes.length}`,this.countBadge=c,r.appendChild(i),r.appendChild(o),r.appendChild(s),r.appendChild(c),n.appendChild(r);let l=document.createElement(`div`);l.className=`memecord-search-box`;let u=document.createElement(`span`);u.className=`memecord-search-icon`,u.textContent=`🔍`;let d=document.createElement(`input`);d.type=`text`,d.className=`memecord-search-input`,d.placeholder=`Filter memes or key...`,d.addEventListener(`input`,()=>{this.searchQuery=d.value.trim().toLowerCase(),this.renderCards()}),l.appendChild(u),l.appendChild(d),n.appendChild(l);let f=document.createElement(`div`);f.className=`memecord-deck-actions`;let p=document.createElement(`button`);p.className=`memecord-deck-action-btn edit-btn`,p.title=`Edit keybindings or remove memes`,p.textContent=`✏️ Edit`,p.addEventListener(`click`,e=>{e.stopPropagation(),a(`pop`),this.toggleEditMode(),p.classList.toggle(`active`,this.isEditMode),p.textContent=this.isEditMode?`✓ Done`:`✏️ Edit`}),f.appendChild(p);let m=document.createElement(`button`);m.className=`memecord-deck-action-btn add-btn`,m.title=`Add new meme (URL, GIF, Tenor)`,m.innerHTML=`<span>+ Add</span>`,m.addEventListener(`click`,e=>{e.stopPropagation(),a(`pop`),this.isEditMode&&(this.toggleEditMode(),p.classList.remove(`active`),p.textContent=`✏️ Edit`),this.callbacks.onAddMeme()}),f.appendChild(m);let h=document.createElement(`button`);h.className=`memecord-deck-action-btn close-btn`,h.title=`Minimize Deck (Press Alt+M to reopen)`,h.textContent=`✕`,h.addEventListener(`click`,e=>{e.stopPropagation(),this.setMinimized(!0)}),f.appendChild(h),n.appendChild(f),t.appendChild(n);let g=document.createElement(`div`);g.className=`memecord-deck-grid`,this.gridContainer=g,this.renderCards(),t.appendChild(g);let _=document.createElement(`div`);_.className=`memecord-deck-footer`;let v=document.createElement(`div`);v.className=`memecord-deck-hint`,v.innerHTML=`<span>⌨️ Press hotkey <strong>[1–9, 0, Q...]</strong> during call</span>`;let y=document.createElement(`div`);y.className=`memecord-deck-pos-wrap`;let b=document.createElement(`span`);b.style.fontSize=`10px`,b.style.color=`#94a3b8`,b.textContent=`Pos:`,y.appendChild(b),[{key:`center`,label:`Center`},{key:`top-right`,label:`Top-R`},{key:`bottom-right`,label:`Bot-R`}].forEach(e=>{let t=document.createElement(`button`);t.className=`memecord-pos-pill ${this.currentPosition===e.key?`active`:``}`,t.textContent=e.label,t.dataset.pos=e.key,t.addEventListener(`click`,n=>{n.stopPropagation(),y.querySelectorAll(`.memecord-pos-pill`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),this.currentPosition=e.key,this.callbacks.onPositionChange?.(e.key)}),y.appendChild(t)}),_.appendChild(v),_.appendChild(y),t.appendChild(_),e.appendChild(t),this.element=t;let x=document.createElement(`div`);x.className=`memecord-summon-bubble`,x.title=`Open Memecord Deck (Alt+M)`,x.innerHTML=`
      <span class="memecord-status-dot"></span>
      <span class="memecord-summon-icon">🎭</span>
      <span class="memecord-summon-label">Memecord Deck</span>
      <span class="memecord-summon-key">Alt+M</span>
    `,x.style.display=`none`,x.addEventListener(`click`,e=>{e.stopPropagation(),this.setMinimized(!1)}),e.appendChild(x),this.summonBubble=x,this.restorePosition()}updateMemes(e){this.memes=e,this.countBadge&&(this.countBadge.textContent=`${e.length}`),this.renderCards()}setPosition(e){this.currentPosition=e,this.element&&this.element.querySelectorAll(`.memecord-pos-pill`).forEach(t=>{let n=t;n.classList.toggle(`active`,n.dataset.pos===e)})}renderCards(){if(!this.gridContainer)return;this.gridContainer.innerHTML=``;let e=this.memes.filter((e,t)=>{if(!this.searchQuery)return!0;let r=(e.hotkey||n(t)).toLowerCase();return e.name.toLowerCase().includes(this.searchQuery)||e.emoji&&e.emoji.includes(this.searchQuery)||r.includes(this.searchQuery)});if(e.length===0){let e=document.createElement(`div`);e.className=`memecord-deck-empty`,e.innerHTML=`
        <span style="font-size: 26px;">🔍</span>
        <div style="font-weight: 600; margin-top: 6px;">No memes matching "${this.searchQuery}"</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Try another search or add a new meme</div>
      `,this.gridContainer.appendChild(e);return}e.forEach((e,t)=>{let r=this.memes.findIndex(t=>t.id===e.id),i=e.hotkey||n(r>=0?r:t),s=document.createElement(`div`);if(s.className=`memecord-card ${this.isEditMode?`wiggling edit-mode`:``}`,s.dataset.memeId=e.id,s.title=this.isEditMode?`Click to change keybinding [${i}]`:`Click or press [${i}] to trigger`,i){let t=document.createElement(`button`);t.className=`memecord-card-hotkey ${this.isEditMode?`editable`:``}`,t.textContent=this.isEditMode?`${i} ✎`:i,t.title=this.isEditMode?`Click to change keybinding`:`Hotkey [${i}]`,this.isEditMode&&t.addEventListener(`click`,t=>{t.stopPropagation(),this.openKeybindingModal(e)}),s.appendChild(t)}let c=document.createElement(`div`);c.className=`memecord-card-thumb-wrap`;let l=o(e.assetUrl),u=document.createElement(`img`);u.className=`memecord-card-img`,u.alt=e.name,u.loading=`lazy`,u.src=l;let d=document.createElement(`span`);d.className=`memecord-card-emoji-fallback`,d.textContent=e.emoji||`✨`,u.onerror=()=>{u.style.display=`none`,d.style.display=`flex`},c.appendChild(u),c.appendChild(d),s.appendChild(c);let f=document.createElement(`div`);if(f.className=`memecord-card-name`,f.textContent=e.name,s.appendChild(f),this.isEditMode){let t=document.createElement(`button`);t.className=`memecord-card-delete-badge`,t.textContent=`✕`,t.title=`Delete ${e.name}`,t.addEventListener(`click`,t=>{t.stopPropagation(),a(`delete`),this.callbacks.onDeleteMeme(e.id)}),s.appendChild(t)}s.addEventListener(`click`,t=>{t.stopPropagation(),this.isEditMode?(a(`pop`),this.openKeybindingModal(e)):(a(`pop`),this.createClickRipple(s),this.callbacks.onTriggerMeme(e))}),s.addEventListener(`contextmenu`,t=>{t.preventDefault(),t.stopPropagation(),this.openContextMenu(t.clientX,t.clientY,e)}),this.gridContainer.appendChild(s)});let t=document.createElement(`div`);t.className=`memecord-card add-card`,t.title=`Add new meme to deck`,t.innerHTML=`
      <div class="memecord-add-card-icon">+</div>
      <div class="memecord-card-name" style="color: #a5b4fc;">Add Meme</div>
    `,t.addEventListener(`click`,e=>{e.stopPropagation(),a(`pop`),this.isEditMode&&this.toggleEditMode(),this.callbacks.onAddMeme()}),this.gridContainer.appendChild(t)}openKeybindingModal(e){this.closeActiveModal();let t=(e.hotkey||n(0)).toUpperCase(),r=document.createElement(`div`);r.className=`memecord-keybind-modal`,r.innerHTML=`
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
    `,document.body.appendChild(r),this.activeModal=r;let i=r.querySelector(`#memecord-keybind-val`),o=r.querySelector(`#memecord-quick-grid`),s=e=>{t=e.trim().toUpperCase(),i.textContent=t,o.querySelectorAll(`.memecord-quick-key-btn`).forEach(e=>{let n=e;n.classList.toggle(`active`,n.dataset.key===t)}),a(`pop`)};o.addEventListener(`click`,e=>{let t=e.target.closest(`.memecord-quick-key-btn`);t&&t.dataset.key&&(e.stopPropagation(),s(t.dataset.key))});let c=e=>{if(![`Control`,`Alt`,`Shift`,`Meta`].includes(e.key)){if(e.key===`Escape`){l();return}if(e.key===`Enter`){u();return}e.preventDefault(),e.stopPropagation(),s(e.key)}};window.addEventListener(`keydown`,c,!0);let l=()=>{window.removeEventListener(`keydown`,c,!0),this.closeActiveModal()},u=()=>{t&&(this.callbacks.onUpdateHotkey?.(e.id,t),a(`pop`)),l()};r.querySelector(`#memecord-keybind-close-btn`)?.addEventListener(`click`,l),r.querySelector(`#memecord-keybind-cancel`)?.addEventListener(`click`,l),r.querySelector(`#memecord-keybind-save`)?.addEventListener(`click`,u)}closeActiveModal(){this.activeModal&&this.activeModal.parentElement&&(this.activeModal.parentElement.removeChild(this.activeModal),this.activeModal=null)}createClickRipple(e){let t=document.createElement(`div`);t.className=`memecord-click-ripple`,e.appendChild(t),setTimeout(()=>t.remove(),400)}setMinimized(e){this.isMinimized=e,a(e?`minimize`:`expand`),e?(this.closeActiveModal(),this.element&&(this.element.classList.add(`hiding`),setTimeout(()=>{this.isMinimized&&this.element&&(this.element.style.display=`none`,this.element.classList.remove(`hiding`))},220)),this.summonBubble&&this.isVisible&&(this.summonBubble.style.display=`flex`,this.summonBubble.classList.add(`visible`),this.syncBubblePosition()),this.callbacks.onCloseDock?.()):(this.summonBubble&&(this.summonBubble.style.display=`none`,this.summonBubble.classList.remove(`visible`)),this.element&&this.isVisible&&(this.element.style.display=`flex`,this.element.classList.add(`entering`),setTimeout(()=>{this.element?.classList.remove(`entering`)},250)))}toggleMinimize(){this.setMinimized(!this.isMinimized)}syncBubblePosition(){if(!this.summonBubble||!this.element)return;let e=this.element.getBoundingClientRect();e.left>0&&e.top>0&&(this.summonBubble.style.left=`${Math.min(window.innerWidth-180,e.left)}px`,this.summonBubble.style.top=`${Math.min(window.innerHeight-50,e.top)}px`,this.summonBubble.style.bottom=`auto`,this.summonBubble.style.transform=`none`)}toggleEditMode(){this.isEditMode=!this.isEditMode,this.element&&this.element.classList.toggle(`edit-mode`,this.isEditMode),this.renderCards()}openContextMenu(e,t,n){this.closeContextMenu();let r=document.createElement(`div`);r.className=`memecord-context-menu`;let i=Math.min(e,window.innerWidth-200),o=Math.max(10,t-110);r.style.left=`${i}px`,r.style.top=`${o}px`;let s=document.createElement(`button`);s.className=`memecord-menu-item`,s.innerHTML=`<span>▶️</span><span>Trigger "${n.name}"</span>`,s.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),a(`pop`),this.callbacks.onTriggerMeme(n)}),r.appendChild(s);let c=document.createElement(`button`);c.className=`memecord-menu-item`,c.innerHTML=`<span>⌨️</span><span>Change Key [${n.hotkey||`None`}]</span>`,c.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),this.openKeybindingModal(n)}),r.appendChild(c);let l=document.createElement(`button`);l.className=`memecord-menu-item danger`,l.innerHTML=`<span>🗑️</span><span>Remove from Deck</span>`,l.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),a(`delete`),this.callbacks.onDeleteMeme(n.id)}),r.appendChild(l);let u=document.createElement(`button`);u.className=`memecord-menu-item`,u.innerHTML=`<span>✕</span><span>Minimize Deck (Alt+M)</span>`,u.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),this.setMinimized(!0)}),r.appendChild(u),document.body.appendChild(r),this.contextMenu=r}closeContextMenu(){this.contextMenu&&this.contextMenu.parentElement&&(this.contextMenu.remove(),this.contextMenu=null)}setupOutsideClickListener(){document.addEventListener(`click`,()=>{this.closeContextMenu()})}setupDraggable(){let e=e=>{let t=t=>{let i=t.target;if(i.tagName===`BUTTON`||i.tagName===`INPUT`||i.closest(`button`)||i.closest(`input`)||i.closest(`.memecord-card`)||i.closest(`.memecord-keybind-modal`))return;this.isDragging=!0,this.activeDragTarget=e,this.dragStartX=t.clientX,this.dragStartY=t.clientY;let a=e.getBoundingClientRect();this.initialLeft=a.left,this.initialTop=a.top,document.addEventListener(`mousemove`,n),document.addEventListener(`mouseup`,r),t.preventDefault()},n=e=>{if(!this.isDragging||!this.activeDragTarget)return;let t=e.clientX-this.dragStartX,n=e.clientY-this.dragStartY,r=this.initialLeft+t,i=this.initialTop+n,a=window.innerWidth-this.activeDragTarget.offsetWidth-10,o=window.innerHeight-this.activeDragTarget.offsetHeight-10;r=Math.max(10,Math.min(a,r)),i=Math.max(10,Math.min(o,i)),this.activeDragTarget.style.left=`${r}px`,this.activeDragTarget.style.top=`${i}px`,this.activeDragTarget.style.bottom=`auto`,this.activeDragTarget.style.transform=`none`,this.activeDragTarget===this.element&&this.summonBubble&&(this.summonBubble.style.left=`${r}px`,this.summonBubble.style.top=`${i}px`,this.summonBubble.style.bottom=`auto`,this.summonBubble.style.transform=`none`)},r=()=>{if(this.isDragging){if(this.isDragging=!1,document.removeEventListener(`mousemove`,n),document.removeEventListener(`mouseup`,r),this.activeDragTarget){let e=this.activeDragTarget.getBoundingClientRect();try{localStorage.setItem(`memecord_dock_pos`,JSON.stringify({left:e.left,top:e.top}))}catch{}}this.activeDragTarget=null}};e.addEventListener(`mousedown`,t)};this.element&&e(this.element),this.summonBubble&&e(this.summonBubble)}restorePosition(){try{let e=localStorage.getItem(`memecord_dock_pos`);if(e){let{left:t,top:n}=JSON.parse(e);if(typeof t==`number`&&typeof n==`number`){let e=window.innerWidth-180,r=window.innerHeight-50,i=Math.max(10,Math.min(e,t)),a=Math.max(10,Math.min(r,n));this.element&&(this.element.style.left=`${i}px`,this.element.style.top=`${a}px`,this.element.style.bottom=`auto`,this.element.style.transform=`none`),this.summonBubble&&(this.summonBubble.style.left=`${i}px`,this.summonBubble.style.top=`${a}px`,this.summonBubble.style.bottom=`auto`,this.summonBubble.style.transform=`none`)}}}catch{}}setVisible(e){this.isVisible=e,e?this.isMinimized?this.summonBubble&&(this.summonBubble.style.display=`flex`):this.element&&(this.element.style.display=`flex`):(this.closeActiveModal(),this.element&&(this.element.style.display=`none`),this.summonBubble&&(this.summonBubble.style.display=`none`))}destroy(){this.closeContextMenu(),this.closeActiveModal(),this.element&&this.element.parentElement&&(this.element.parentElement.removeChild(this.element),this.element=null),this.summonBubble&&this.summonBubble.parentElement&&(this.summonBubble.parentElement.removeChild(this.summonBubble),this.summonBubble=null)}},c=`
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
`,l=[{id:`thumbs_up`,name:`Thumbs Up`,emoji:`👍`,assetUrl:`memes/thumbs-up.gif`,hotkey:`1`,durationMs:2500},{id:`victory`,name:`Peace / Victory`,emoji:`✌️`,assetUrl:`memes/victory.gif`,hotkey:`2`,durationMs:2500},{id:`stop`,name:`Wait / Hold Up`,emoji:`🖐`,assetUrl:`memes/stop.gif`,hotkey:`3`,durationMs:2500},{id:`cinema`,name:`Absolute Cinema`,emoji:`🙌`,assetUrl:`memes/absolute-cinema.gif`,hotkey:`4`,durationMs:3e3},{id:`rock_on`,name:`Rock On / Headbang`,emoji:`🤘`,assetUrl:`memes/rock-on.gif`,hotkey:`5`,durationMs:2500},{id:`pointing`,name:`Big Brain / Roll Safe`,emoji:`☝️`,assetUrl:`memes/pointing.gif`,hotkey:`6`,durationMs:2500},{id:`noice`,name:`Noice (Michael Rosen)`,emoji:`👌`,assetUrl:`memes/noice.gif`,hotkey:`7`,durationMs:2200},{id:`fist`,name:`Arthur Fist`,emoji:`✊`,assetUrl:`memes/fist.gif`,hotkey:`8`,durationMs:2500},{id:`perfection`,name:`Chef Kiss / Perfection`,emoji:`✨`,assetUrl:`memes/perfection.gif`,hotkey:`9`,durationMs:2500}];[...l];var u={enabled:!0,dockVisible:!0,defaultDurationMs:2500,position:`top-center`,soundEnabled:!0,memes:l},d=`memecord_settings`,f=`mememeet_settings`;function p(){return typeof indexedDB>`u`?Promise.resolve(null):new Promise(e=>{try{let t=indexedDB.open(`memecord_db`,1);t.onupgradeneeded=()=>{let e=t.result;e.objectStoreNames.contains(`settings`)||e.createObjectStore(`settings`)},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null)}catch{e(null)}})}async function m(e){let t=await p();return t?new Promise(n=>{try{let r=t.transaction(`settings`,`readonly`).objectStore(`settings`).get(e);r.onsuccess=()=>n(r.result??null),r.onerror=()=>n(null)}catch{n(null)}}):null}async function h(e,t){let n=await p();return n?new Promise(r=>{try{let i=n.transaction(`settings`,`readwrite`).objectStore(`settings`).put(t,e);i.onsuccess=()=>r(!0),i.onerror=()=>r(!1)}catch{r(!1)}}):!1}async function g(){try{if(typeof chrome<`u`&&chrome.storage&&chrome.storage.local){let e=await chrome.storage.local.get([d,f]),t=e?e[d]:void 0;if(!t&&e&&e[f]){t=e[f];try{await chrome.storage.local.set({[d]:t}),await chrome.storage.local.remove(f)}catch{}}if(t)return{...u,...t,memes:Array.isArray(t.memes)&&t.memes.length>0?t.memes:u.memes}}let e=await m(d);if(e)return{...u,...e,memes:Array.isArray(e.memes)&&e.memes.length>0?e.memes:u.memes};if(typeof localStorage<`u`){let e=localStorage.getItem(d);if(e||(e=localStorage.getItem(f),e&&(localStorage.setItem(d,e),localStorage.removeItem(f))),e){let t=JSON.parse(e);return{...u,...t,memes:Array.isArray(t.memes)&&t.memes.length>0?t.memes:u.memes}}}}catch(e){console.warn(`[Memecord] Failed to read settings, using defaults:`,e)}return u}async function _(e){let t={...await g(),...e};try{if(typeof chrome<`u`&&chrome.storage&&chrome.storage.local&&await chrome.storage.local.set({[d]:t}),await h(d,t),typeof localStorage<`u`)try{localStorage.setItem(d,JSON.stringify(t))}catch(e){console.warn(`[Memecord] LocalStorage quota exceeded, persisted via IndexedDB:`,e)}}catch(e){console.error(`[Memecord] Failed to save settings:`,e)}return t}async function v(e){let t=await g(),n=t.memes.findIndex(t=>t.id===e.id),r;return n>=0?(r=[...t.memes],r[n]=e):r=[...t.memes,e],_({memes:r})}async function y(e){return _({memes:(await g()).memes.filter(t=>t.id!==e)})}async function b(e,t){let n=await g(),r=t.trim().toUpperCase();return _({memes:n.memes.map(t=>t.id===e?{...t,hotkey:r}:t)})}var x=class{root=null;currentMemeBox=null;currentToast=null;currentModal=null;hideTimeoutId=null;removeTimeoutId=null;toastTimeoutId=null;floatingDock=null;settings;callbacks;constructor(e,t={}){this.settings=e,this.callbacks=t,this.initRoot(),this.root&&(this.floatingDock=new s(this.root,this.settings.memes,{onTriggerMeme:e=>{this.callbacks.onTriggerMeme?.(e),this.showMeme(e)},onAddMeme:()=>{this.openQuickAddModal()},onDeleteMeme:e=>{let t=this.settings.memes.find(t=>t.id===e);this.callbacks.onDeleteMeme?.(e),this.showToast(`🗑️ Removed "${t?.name||`Meme`}" from deck`)},onUpdateHotkey:async(e,t)=>{let n=this.settings.memes.find(t=>t.id===e),r=await b(e,t);this.settings=r,this.updateSettings(r),this.callbacks.onUpdateHotkey?.(e,t),this.showToast(`⌨️ Rebound "${n?.name||`Meme`}" to Key [${t}]`)},onCloseDock:()=>{this.callbacks.onCloseDock?.(),this.showToast(`🎭 Deck Minimized • Press Alt+M or click pebble to reopen`)},onPositionChange:e=>{this.settings.position=e,_({position:e}),this.showToast(`Overlay position: ${e}`)}},this.settings.position),this.floatingDock.setVisible(this.settings.dockVisible&&this.settings.enabled))}updateSettings(e){this.settings=e,this.floatingDock?.updateMemes(e.memes),this.floatingDock?.setPosition(e.position),this.floatingDock?.setVisible(e.dockVisible&&e.enabled)}setDockVisible(e){this.floatingDock?.setVisible(e)}setDockMinimized(e){this.floatingDock?.setMinimized(e)}showToast(e,t=2500){if(!this.root)return;this.currentToast&&=(this.currentToast.remove(),null),this.toastTimeoutId&&=(clearTimeout(this.toastTimeoutId),null);let n=document.createElement(`div`);n.className=`memecord-toast`,n.innerHTML=`<span>✨</span><span>${e}</span>`,this.root.appendChild(n),this.currentToast=n,requestAnimationFrame(()=>{n.classList.add(`visible`)}),this.toastTimeoutId=setTimeout(()=>{n.classList.remove(`visible`),n.classList.add(`hiding`),setTimeout(()=>{n.parentElement&&n.remove(),this.currentToast===n&&(this.currentToast=null)},300)},t)}showMeme(e){if(!this.root||!this.settings.enabled)return;this.settings.soundEnabled&&this.playTriggerSound(),this.hideTimeoutId&&=(clearTimeout(this.hideTimeoutId),null),this.removeTimeoutId&&=(clearTimeout(this.removeTimeoutId),null),this.currentMemeBox&&=(this.currentMemeBox.remove(),null);let t=e.assetUrl;if(t.startsWith(`http://`)||t.startsWith(`https://`)||t.startsWith(`data:`))t=e.assetUrl;else if(typeof chrome<`u`&&chrome.runtime?.id&&chrome.runtime?.getURL)try{t=chrome.runtime.getURL(e.assetUrl.replace(/^\//,``))}catch{t=e.assetUrl.startsWith(`/`)?e.assetUrl:`/${e.assetUrl}`}else t=e.assetUrl.startsWith(`/`)?e.assetUrl:`/${e.assetUrl}`;let n=this.getPositionClass(this.settings.position||`top-center`),r=document.createElement(`div`);r.className=`memecord-meme-box ${n}`;let a=t.startsWith(`data:video/`)||t.endsWith(`.mp4`)||t.endsWith(`.webm`),o;if(a){let e=document.createElement(`video`);e.className=`memecord-meme-image`,e.src=t,e.autoplay=!0,e.loop=!0,e.muted=!0,e.playsInline=!0,o=e}else{let n=document.createElement(`img`);n.className=`memecord-meme-image`,n.referrerPolicy=`no-referrer`,n.src=t,n.alt=e.name,n.onerror=async()=>{if(t.startsWith(`http`)&&!t.startsWith(`data:`)){console.warn(`[Memecord] Direct image blocked by page CSP, converting via background proxy...`);let e=await i(t);e&&e.startsWith(`data:`)&&(n.src=e)}},o=n}let s=document.createElement(`div`);s.className=`memecord-meme-title`,s.textContent=`${e.emoji||`✨`} ${e.name}`,r.appendChild(o),r.appendChild(s),this.root.appendChild(r),this.currentMemeBox=r,requestAnimationFrame(()=>{r.classList.add(`visible`)});let c=e.durationMs||this.settings.defaultDurationMs||2500;this.hideTimeoutId=setTimeout(()=>{r.classList.remove(`visible`),r.classList.add(`hiding`),this.removeTimeoutId=setTimeout(()=>{r.parentElement&&r.remove(),this.currentMemeBox===r&&(this.currentMemeBox=null)},300)},c)}openQuickAddModal(){if(!this.root)return;this.currentModal&&=(this.currentModal.remove(),null);let e=n(this.settings.memes.length),t=document.createElement(`div`);t.className=`memecord-quick-add-modal`,t.innerHTML=`
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
    `,this.root.appendChild(t),this.currentModal=t;let i=()=>{this.currentModal&&=(this.currentModal.remove(),null)};t.querySelector(`#memecord-modal-close-btn`)?.addEventListener(`click`,i),t.querySelector(`#memecord-add-cancel`)?.addEventListener(`click`,i);let a=t.querySelector(`#memecord-add-url`),o=t.querySelector(`#memecord-add-name`),s=t.querySelector(`#memecord-add-emoji`),c=t.querySelector(`#memecord-add-key`),l=t.querySelector(`#memecord-url-status`),u=t.querySelector(`#memecord-preview-wrap`),d=t.querySelector(`#memecord-preview-thumb`),f=t.querySelector(`#memecord-preview-name`),p=null,m=``,h=()=>{let e=a.value.trim();if(!e){u.style.display=`none`,l.textContent=``;return}l.textContent=`Resolving media link...`,p&&clearTimeout(p),p=setTimeout(async()=>{try{let t=await r(e);m=t.url,t.name&&!o.value&&(o.value=t.name),t.emoji&&s.value===`✨`&&(s.value=t.emoji),l.textContent=`✓ Ready to add`,l.style.color=`#10b981`,d.src=m,f.textContent=`${s.value} ${o.value||`Meme`}`,u.style.display=`flex`}catch(e){l.textContent=e?.message||`Invalid URL`,l.style.color=`#ef4444`}},250)};a.addEventListener(`input`,h),a.addEventListener(`paste`,()=>setTimeout(h,10)),t.querySelector(`#memecord-add-submit`)?.addEventListener(`click`,async()=>{let n=a.value.trim();if(!n){a.focus(),a.style.borderColor=`#ef4444`;return}let u=t.querySelector(`#memecord-add-submit`);u.disabled=!0,u.textContent=`Saving...`;try{let t=await r(n),a=t.url,l=o.value.trim()||t.name||`Custom Meme`,u=s.value.trim()||`✨`,d=c.value.trim()||e,f={id:`meme_${Date.now()}`,name:l,emoji:u,assetUrl:a,hotkey:d,durationMs:this.settings.defaultDurationMs||2500};i(),this.callbacks.onAddMeme?.(f),this.showToast(`Added "${l}" [Key ${d}]!`)}catch(e){l.textContent=`Error: ${e?.message||`Failed to save`}`,l.style.color=`#ef4444`,u.disabled=!1,u.textContent=`Add to Dock`}})}playTriggerSound(){try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createGain();t.type=`sine`,t.frequency.setValueAtTime(480,e.currentTime),t.frequency.exponentialRampToValueAtTime(960,e.currentTime+.1),n.gain.setValueAtTime(.12,e.currentTime),n.gain.exponentialRampToValueAtTime(.001,e.currentTime+.1),t.connect(n),n.connect(e.destination),t.start(),t.stop(e.currentTime+.11)}catch{}}getPositionClass(e){switch(e){case`center`:return`pos-center`;case`top-right`:return`pos-top-right`;case`bottom-right`:return`pos-bottom-right`;default:return`pos-top-center`}}initRoot(){if(!document.getElementById(`memecord-injected-styles`)){let e=document.createElement(`style`);e.id=`memecord-injected-styles`,e.textContent=c,(document.head||document.documentElement).appendChild(e)}let e=document.getElementById(`memecord-overlay-root`);e||(e=document.createElement(`div`),e.id=`memecord-overlay-root`,(document.body||document.documentElement).appendChild(e)),this.root=e}destroy(){this.hideTimeoutId&&clearTimeout(this.hideTimeoutId),this.removeTimeoutId&&clearTimeout(this.removeTimeoutId),this.toastTimeoutId&&clearTimeout(this.toastTimeoutId),this.floatingDock&&=(this.floatingDock.destroy(),null),this.currentModal&&=(this.currentModal.remove(),null),this.root&&this.root.parentElement&&(this.root.parentElement.removeChild(this.root),this.root=null)}},S=class{overlay=null;settings=null;keydownHandler=null;isDestroyed=!1;isInCall=!1;isCameraStreaming=!1;callCheckIntervalId=null;spaObserver=null;async init(){this.settings=await g(),this.ensureInjectedScript(),this.overlay=new x(this.settings,{onTriggerMeme:e=>{this.triggerMeme(e)},onAddMeme:async e=>{let t=await v(e);this.settings=t,this.overlay?.updateSettings(t)},onDeleteMeme:async e=>{let t=await y(e);this.settings=t,this.overlay?.updateSettings(t)},onUpdateHotkey:(e,t)=>{this.settings&&(this.settings.memes=this.settings.memes.map(n=>n.id===e?{...n,hotkey:t}:n))},onCloseDock:()=>{this.settings&&(_({dockVisible:!1}),this.settings.dockVisible=!1)}}),this.overlay.setDockVisible(!1),this.registerKeyboardShortcuts(),this.setupListeners(),this.setupCallStateMonitoring(),this.checkCallState(),console.log(`[Memecord] Call-sensitive Overlay Controller initialized.`)}async triggerMeme(e){if(!this.settings||!this.settings.enabled)return;this.overlay?.showMeme(e);let t=await i(e.assetUrl),n={source:`MEMECORD_CONTENT`,type:`TRIGGER_CAMERA_MEME`,meme:{...e,assetUrl:t},position:this.settings.position||`center`};window.postMessage(n,`*`);try{document.querySelectorAll(`iframe`).forEach(e=>{try{e.contentWindow?.postMessage(n,`*`)}catch{}})}catch{}if(window.parent&&window.parent!==window)try{window.parent.postMessage(n,`*`)}catch{}}isTestLab(){let e=window.location.href;return window.location.pathname.includes(`/test/`)||e.includes(`test/index.html`)||e.includes(`:4182`)||e.includes(`localhost:5173`)}isOngoingVideoCall(){if(this.isTestLab()||this.isCameraStreaming)return!0;let e=window.location.hostname,t=window.location.pathname;if(e.includes(`meet.google.com`)){if(!(/^\/[a-z]{3}-[a-z]{4}-[a-z]{3}/i.test(t)||t.includes(`/_meet/`))||document.querySelector(`button[aria-label*="Join now" i], button[aria-label*="Ask to join" i]`))return!1;let e=!!document.querySelector(`button[aria-label*="Leave call" i], button[data-tooltip*="Leave call" i], button[aria-label*="End call" i]`),n=!!document.querySelector(`button[aria-label*="Turn off microphone" i], button[aria-label*="Turn on microphone" i], button[aria-label*="Turn off camera" i], button[aria-label*="Raise hand" i]`);return e||n}if(e.includes(`discord.com`)){let e=!!document.querySelector(`button[aria-label*="Disconnect" i], button[aria-label*="Leave Call" i]`),t=!!document.querySelector(`div[class*="videoGrid"], div[class*="callContainer"], div[class*="wrapperInCall"]`);return e||t}return e.includes(`zoom.us`)?t.includes(`/wc/`)?!!document.querySelector(`button[aria-label*="Leave" i], button[aria-label*="End" i], .footer-button__button--leave`):!1:e.includes(`teams.microsoft.com`)||e.includes(`teams.live.com`)?!!document.querySelector(`button[aria-label*="Leave" i], button#hangup-button, button[id*="hangup"]`):e.includes(`slack.com`)?!!document.querySelector(`button[data-qa*="leave" i], button[aria-label*="Leave call" i], div[data-qa*="huddle"]`):e.includes(`facetime.apple.com`)?!!document.querySelector(`button[aria-label*="Leave" i], button[aria-label*="End" i]`):!1}checkCallState(){let e=this.isOngoingVideoCall();e&&!this.isInCall?(this.isInCall=!0,console.log(`[Memecord] Ongoing video call detected -> showing HUD & enabling hotkeys`),this.settings?.dockVisible&&this.settings.enabled&&this.overlay?.setDockVisible(!0),this.overlay?.showToast(`🎭 Memecord Active! Press 1–9 or click dock`)):!e&&this.isInCall&&(this.isInCall=!1,console.log(`[Memecord] Call ended / outside video call -> hiding HUD`),this.overlay?.setDockVisible(!1))}setupCallStateMonitoring(){window.addEventListener(`message`,e=>{e.data?.source===`MEMECORD_CAMERA`&&e.data?.type===`CAMERA_CALL_STATE`&&(this.isCameraStreaming=!!e.data.active,this.checkCallState())}),this.callCheckIntervalId=setInterval(()=>{this.checkCallState()},1e3),this.spaObserver=new MutationObserver(()=>{this.checkCallState()});let e=document.body||document.documentElement;e&&this.spaObserver.observe(e,{childList:!0,subtree:!0})}ensureInjectedScript(){try{if(typeof chrome<`u`&&chrome.runtime?.getURL){let e=document.createElement(`script`);e.src=chrome.runtime.getURL(`inject.js`),e.onload=()=>e.remove(),(document.head||document.documentElement).appendChild(e)}}catch{}}registerKeyboardShortcuts(){this.keydownHandler=e=>{if(!this.settings||!this.settings.enabled||!this.isInCall)return;let t=document.activeElement;if(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable||t.getAttribute(`role`)===`textbox`))return;if(e.altKey&&(e.key===`m`||e.key===`M`)){e.preventDefault();let t=!this.settings.dockVisible;_({dockVisible:t}),this.settings.dockVisible=t,this.overlay?.setDockMinimized(!t),this.overlay?.setDockVisible(!0),this.overlay?.showToast(t?`🎭 Memecord HUD Expanded`:`🎭 Memecord HUD Minimized (Alt+M)`);return}let r=e.key,i=this.settings.memes.find((e,t)=>{let i=e.hotkey||n(t);return i&&i.toLowerCase()===r.toLowerCase()});i&&(e.preventDefault(),console.log(`[Memecord] Hotkey [${r}] triggered: ${i.name}`),this.triggerMeme(i))},window.addEventListener(`keydown`,this.keydownHandler,!0)}setupListeners(){typeof chrome<`u`&&chrome.storage?.onChanged&&chrome.storage.onChanged.addListener((e,t)=>{let n=e.memecord_settings||e.mememeet_settings;if(t===`local`&&n){let e=n.newValue;e&&(this.settings=e,this.overlay?.updateSettings(e),this.overlay?.setDockVisible(this.isInCall&&e.dockVisible&&e.enabled),window.postMessage({source:`MEMECORD_CONTENT`,type:`UPDATE_CAMERA_SETTINGS`,position:e.position||`center`},`*`))}}),typeof chrome<`u`&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener((e,t,n)=>{if(e.type===`TRIGGER_MEME`){let t=this.settings?.memes.find(t=>t.id===e.memeId);return t&&(this.triggerMeme(t),n({success:!0})),!0}if(e.type===`TRIGGER_MEME_ITEM`)return this.triggerMeme(e.meme),n({success:!0}),!0;if(e.type===`TOGGLE_DOCK`){if(this.settings){let e=!this.settings.dockVisible;_({dockVisible:e}),this.overlay?.setDockVisible(this.isInCall&&e),n({dockVisible:e})}return!0}return!1})}destroy(){this.isDestroyed||(this.isDestroyed=!0,this.callCheckIntervalId&&=(clearInterval(this.callCheckIntervalId),null),this.spaObserver&&=(this.spaObserver.disconnect(),null),this.keydownHandler&&=(window.removeEventListener(`keydown`,this.keydownHandler,!0),null),this.overlay&&=(this.overlay.destroy(),null))}};function C(){if(window.__MEMECORD_INITIALIZED__)return;window.__MEMECORD_INITIALIZED__=!0;let e=new S;window.__MEMECORD_CONTROLLER__=e,document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>{e.init()}):e.init()}C()})();