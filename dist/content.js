(function(){var e=new Map;function t(e){if(e<9)return String(e+1);if(e===9)return`0`;let t=[`Q`,`W`,`E`,`R`,`T`,`Y`,`U`,`I`,`O`,`P`,`A`,`S`,`D`,`F`],n=e-10;return n<t.length?t[n]:``}function n(e){let n=new Set(e.map((e,n)=>(e.hotkey||t(n)).trim().toUpperCase()).filter(Boolean));for(let e of`1234567890QWERTYUIOPASDFGHJKLZXCVBNM`.split(``))if(!n.has(e))return e;return``}async function r(e){let t=e.trim();if(!t)throw Error(`URL cannot be empty`);if(t.startsWith(`data:`))return{url:t,isVideo:t.startsWith(`data:video/`)};if(t.startsWith(`memes/`)||t.startsWith(`/memes/`))return{url:t,isVideo:!1};if(t.includes(`tenor.com`)){if(t.includes(`media.tenor.com`)&&(t.endsWith(`.gif`)||t.endsWith(`.mp4`)||t.endsWith(`.webp`)))return{url:t,isVideo:t.endsWith(`.mp4`)||t.endsWith(`.webm`)};try{let e=await chrome.runtime.sendMessage({type:`RESOLVE_TENOR_URL`,url:t});if(e&&e.success&&e.resolvedUrl)return{url:e.resolvedUrl,name:e.name,emoji:`✨`,isVideo:e.isVideo}}catch(e){console.warn(`[Memecord] Background Tenor resolve failed, trying fallback slug:`,e)}let e=t.match(/\/view\/([a-zA-Z0-9_-]+)/),n=`Tenor Meme`;return e&&e[1]&&(n=e[1].replace(/-gif-\d+$/,``).replace(/-gif$/,``).replace(/-/g,` `).replace(/\b\w/g,e=>e.toUpperCase())),{url:t,name:n,isVideo:!1}}if(t.includes(`giphy.com/gifs/`)){let e=t.match(/-([a-zA-Z0-9]+)$/);if(e&&e[1])return{url:`https://media.giphy.com/media/${e[1]}/giphy.gif`,isVideo:!1}}return{url:t,isVideo:t.endsWith(`.mp4`)||t.endsWith(`.webm`)}}async function i(t){if(t.startsWith(`data:`))return t;if(e.has(t))return e.get(t);let n=t;if((t.startsWith(`memes/`)||t.startsWith(`/memes/`))&&typeof chrome<`u`&&chrome.runtime?.getURL&&(n=chrome.runtime.getURL(t.replace(/^\//,``))),n.startsWith(`chrome-extension://`))try{let r=await(await fetch(n)).blob();return new Promise(n=>{let i=new FileReader;i.onloadend=()=>{let r=i.result;e.set(t,r),n(r)},i.readAsDataURL(r)})}catch(e){console.warn(`[Memecord] Failed to read local asset as data URL:`,e)}try{let r=await chrome.runtime.sendMessage({type:`FETCH_MEDIA_AS_DATA_URL`,url:n});if(r&&r.success&&r.dataUrl)return e.set(t,r.dataUrl),r.dataUrl}catch(e){console.warn(`[Memecord] Failed to convert to data URL via background:`,e)}return t}var a=typeof navigator<`u`&&(/Mac|iPhone|iPod|iPad/i.test(navigator.platform||``)||/Macintosh|Mac OS X/i.test(navigator.userAgent||``)),o=()=>a?`⌥⇧M`:`Alt+M`,s=()=>a?`⌥⇧M (Option+Shift+M)`:`Alt+M`,c=e=>{if(e.code!==`KeyM`&&e.key.toLowerCase()!==`m`&&e.key!==`µ`)return!1;if(a){let t=e.altKey&&e.shiftKey,n=e.altKey&&!e.metaKey&&!e.ctrlKey,r=e.ctrlKey&&e.shiftKey,i=e.metaKey&&e.shiftKey;return!!(t||n||r||i)}return!!(e.altKey||e.ctrlKey&&e.shiftKey)},l={plus:`<path d="M12 5v14M5 12h14"/>`,pencil:`<path d="M21.17 6.81a2.83 2.83 0 0 0-4-4L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/>`,minus:`<path d="M5 12h14"/>`,x:`<path d="M18 6 6 18M6 6l12 12"/>`,search:`<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>`,play:`<path d="M6 4v16a1 1 0 0 0 1.5.86l13-8a1 1 0 0 0 0-1.72l-13-8A1 1 0 0 0 6 4z"/>`,keyboard:`<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M10 13h4"/>`,trash:`<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>`,upload:`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>`,image:`<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>`};function u(e,t=16){return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${l[e]}</svg>`}function d(e,t,n){let r=document.createElement(e);return t&&(r.className=t),n!==void 0&&(r.textContent=n),r}function f(e){if(!e)return``;if(e.startsWith(`http://`)||e.startsWith(`https://`)||e.startsWith(`data:`))return e;if(typeof chrome<`u`&&chrome.runtime?.id&&chrome.runtime.getURL)try{return chrome.runtime.getURL(e.replace(/^\//,``))}catch{}return e.startsWith(`/`)?e:`/${e}`}function p(e){return e.startsWith(`data:video/`)||/\.(mp4|webm)(\?|#|$)/i.test(e)}var m=`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7180' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21'/%3E%3C/svg%3E`;function h(e,t,n){let r=f(e);if(p(r)){let e=d(`video`,n);return e.src=r,e.muted=!0,e.loop=!0,e.autoplay=!0,e.playsInline=!0,e}let a=d(`img`,n);a.alt=t,a.decoding=`async`,a.referrerPolicy=`no-referrer`;let o=!1;return a.onerror=async()=>{if(!o&&r.startsWith(`http`)){o=!0;let e=await i(r);if(e.startsWith(`data:`)){a.src=e;return}}a.onerror=null,a.src=m},a.src=r,a}function g(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(r.result),r.onerror=()=>n(r.error||Error(`Could not read file`)),r.readAsDataURL(e)})}function _(e){return e.replace(/\.[a-z0-9]+$/i,``).replace(/[-_]+/g,` `).replace(/\s+/g,` `).trim().replace(/\b\w/g,e=>e.toUpperCase())}var v=`memecord_dock_anchor`,y=8,b=[{key:`top-center`,label:`Top`},{key:`top-right`,label:`Top right`},{key:`center`,label:`Center`},{key:`bottom-right`,label:`Bottom right`}],x=`1234567890QWERTYUIOPASDFGZXCVB`.split(``),S=null;function C(e=`pop`){try{let t=window.AudioContext||window.webkitAudioContext;if(!t)return;S||=new t;let n=S,r=n.createOscillator(),i=n.createGain();r.connect(i),i.connect(n.destination),r.type=`sine`;let[a,o,s,c]={pop:[440,880,.06,.08],minimize:[600,320,.05,.1],expand:[360,720,.05,.1],delete:[300,150,.07,.12]}[e],l=n.currentTime;r.frequency.setValueAtTime(a,l),r.frequency.exponentialRampToValueAtTime(o,l+c),i.gain.setValueAtTime(s,l),i.gain.exponentialRampToValueAtTime(.001,l+c),r.start(l),r.stop(l+c+.01)}catch{}}function w(e,n){return(e.hotkey||t(n)).toUpperCase()}var T=class{parent;element=null;pebble=null;gridContainer=null;statusEl=null;editBtn=null;editBanner=null;contextMenu=null;activeModal=null;modalCleanup=null;isMinimized=!1;isEditMode=!1;isVisible=!1;searchQuery=``;callMode=`local`;currentPosition=`top-center`;memes=[];callbacks;firingTimers=new Map;anchor={right:20,bottom:104};docClickHandler=()=>this.closeContextMenu();resizeHandler=()=>this.applyAnchor();constructor(e,t,n,r=`top-center`,i=!1){this.parent=e,this.memes=t,this.callbacks=n,this.currentPosition=r,this.isMinimized=i,this.loadAnchor(),this.createDom(),this.render(),document.addEventListener(`click`,this.docClickHandler),window.addEventListener(`resize`,this.resizeHandler)}createDom(){let e=d(`div`,`memecord-deck`);e.setAttribute(`role`,`dialog`),e.setAttribute(`aria-label`,`Memecord meme deck`);let t=d(`div`,`memecord-deck-header`);t.title=`Drag to move`;let n=d(`img`,`memecord-deck-logo`);n.src=f(`icons/logo.png`),n.alt=``;let r=d(`div`,`memecord-deck-heading`);r.appendChild(d(`span`,`memecord-deck-title`,`Memecord`)),this.statusEl=d(`span`,`memecord-status`),r.appendChild(this.statusEl);let i=this.iconButton(`pencil`,`Edit keys & remove memes`);i.addEventListener(`click`,e=>{e.stopPropagation(),C(`pop`),this.setEditMode(!this.isEditMode)}),this.editBtn=i;let a=this.iconButton(`minus`,`Minimize (${o()})`);a.addEventListener(`click`,e=>{e.stopPropagation(),this.setMinimized(!0)}),t.append(n,r,i,a);let c=d(`div`,`memecord-toolbar`),l=d(`label`,`memecord-search`);l.innerHTML=u(`search`,14);let p=d(`input`);p.type=`search`,p.placeholder=`Search memes`,p.setAttribute(`aria-label`,`Search memes`),p.addEventListener(`input`,()=>{this.searchQuery=p.value.trim().toLowerCase(),this.renderCards()}),p.addEventListener(`keydown`,e=>{e.key===`Escape`&&(p.value=``,this.searchQuery=``,this.renderCards(),p.blur())}),l.appendChild(p);let m=d(`button`,`memecord-btn primary`);m.type=`button`,m.innerHTML=`${u(`plus`,15)}<span>Add</span>`,m.title=`Add a GIF, image or video`,m.addEventListener(`click`,e=>{e.stopPropagation(),C(`pop`),this.setEditMode(!1),this.callbacks.onAddMeme()}),c.append(l,m);let h=d(`div`,`memecord-edit-banner`);h.appendChild(d(`span`,``,`Click a meme to change its key`));let g=d(`button`,`memecord-btn primary`,`Done`);g.type=`button`,g.addEventListener(`click`,e=>{e.stopPropagation(),this.setEditMode(!1)}),h.appendChild(g),h.style.display=`none`,this.editBanner=h;let _=d(`div`,`memecord-grid`);this.gridContainer=_;let v=d(`div`,`memecord-deck-footer`),y=d(`div`,`memecord-pos-group`);y.appendChild(d(`span`,`memecord-pos-label`,`Position`));let x=d(`div`,`memecord-pos-screen`);x.setAttribute(`role`,`radiogroup`),x.setAttribute(`aria-label`,`Where memes appear on your video`),b.forEach(e=>{let t=d(`button`,`memecord-pos-spot`);t.type=`button`,t.dataset.pos=e.key,t.title=`Show memes: ${e.label}`,t.setAttribute(`role`,`radio`),t.setAttribute(`aria-label`,e.label),t.addEventListener(`click`,t=>{t.stopPropagation(),this.setPosition(e.key),this.callbacks.onPositionChange?.(e.key)}),x.appendChild(t)}),y.appendChild(x);let S=d(`span`,`memecord-shortcut-hint`);S.title=s(),S.appendChild(d(`span`,`memecord-kbd`,o())),S.appendChild(d(`span`,``,`hide`)),v.append(y,S),e.append(t,c,h,_,v),this.bindDropTarget(e),this.bindDrag(e,t),this.parent.appendChild(e),this.element=e;let w=d(`button`,`memecord-pebble`);w.type=`button`,w.title=`Open Memecord (${s()})`;let T=d(`span`,`memecord-pebble-logo`),E=d(`img`);E.src=f(`icons/logo.png`),E.alt=``,T.append(E,d(`span`,`memecord-dot`)),w.append(T,d(`span`,``,`Memes`),d(`span`,`memecord-kbd`,o())),w.addEventListener(`click`,e=>{if(e.stopPropagation(),w.dataset.dragged===`1`){w.dataset.dragged=``;return}this.setMinimized(!1)}),this.bindDrag(w,w),this.parent.appendChild(w),this.pebble=w,this.setPosition(this.currentPosition),this.setCallMode(this.callMode),this.renderCards(),this.applyAnchor()}iconButton(e,t){let n=d(`button`,`memecord-icon-btn`);return n.type=`button`,n.title=t,n.setAttribute(`aria-label`,t),n.innerHTML=u(e,16),n}updateMemes(e){this.memes=e,this.renderCards()}setPosition(e){this.currentPosition=e,this.element?.querySelectorAll(`.memecord-pos-spot`).forEach(t=>{let n=t.dataset.pos===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-checked`,String(n))})}setCallMode(e){this.callMode=e,this.statusEl&&(this.statusEl.className=`memecord-status ${e}`,this.statusEl.innerHTML=``,this.statusEl.appendChild(d(`span`,`memecord-dot`)),this.statusEl.appendChild(d(`span`,``,e===`live`?`Live on your camera`:`Camera off · only you see memes`))),this.pebble&&(this.pebble.classList.toggle(`live`,e===`live`),this.pebble.classList.toggle(`local`,e===`local`))}markFiring(e,t){let n=this.gridContainer?.querySelector(`.memecord-card[data-meme-id="${CSS.escape(e)}"]`);this.firingTimers.forEach((e,t)=>{clearTimeout(e),this.gridContainer?.querySelector(`.memecord-card[data-meme-id="${CSS.escape(t)}"]`)?.classList.remove(`firing`)}),this.firingTimers.clear(),n&&(n.style.setProperty(`--mc-dur`,`${t}ms`),n.classList.remove(`firing`),n.offsetWidth,n.classList.add(`firing`),this.firingTimers.set(e,setTimeout(()=>{n.classList.remove(`firing`),this.firingTimers.delete(e)},t)))}isModalOpen(){return!!this.activeModal}setVisible(e){this.isVisible=e,e||(this.closeActiveModal(),this.closeContextMenu()),this.render()}setMinimized(e,t=!0){this.isMinimized!==e&&(this.isMinimized=e,e&&(this.closeActiveModal(),this.closeContextMenu(),this.setEditMode(!1)),t&&(C(e?`minimize`:`expand`),this.callbacks.onMinimizedChange?.(e)),!e&&this.element&&this.isVisible&&(this.element.classList.remove(`entering`),this.element.offsetWidth,this.element.classList.add(`entering`),setTimeout(()=>this.element?.classList.remove(`entering`),260)),this.render())}toggleMinimize(){this.setMinimized(!this.isMinimized)}render(){this.element&&(this.element.style.display=this.isVisible&&!this.isMinimized?`flex`:`none`),this.pebble&&(this.pebble.style.display=this.isVisible&&this.isMinimized?`flex`:`none`),this.applyAnchor()}renderCards(){if(!this.gridContainer)return;this.gridContainer.innerHTML=``;let e=this.memes.map((e,t)=>({meme:e,key:w(e,t)})).filter(({meme:e,key:t})=>!this.searchQuery||e.name.toLowerCase().includes(this.searchQuery)||t.toLowerCase()===this.searchQuery);if(e.length===0&&this.searchQuery){let e=d(`div`,`memecord-empty`);e.appendChild(d(`strong`,``,`No matches`)),e.appendChild(d(`span`,``,`Nothing called "${this.searchQuery}" yet.`)),this.gridContainer.appendChild(e);return}if(e.forEach(({meme:e,key:t})=>{let n=d(`button`,`memecord-card`);n.type=`button`,n.dataset.memeId=e.id,n.title=this.isEditMode?`Change key for "${e.name}"`:`Show "${e.name}" (press ${t||`no key`})`,n.setAttribute(`aria-label`,this.isEditMode?`Change key for ${e.name}`:`Show ${e.name}`);let r=d(`span`,`memecord-card-thumb`);if(r.appendChild(h(e.assetUrl,e.name)),t&&r.appendChild(d(`span`,`memecord-keycap`,t)),r.appendChild(d(`span`,`memecord-card-progress`)),n.appendChild(r),n.appendChild(d(`span`,`memecord-card-name`,e.name)),this.isEditMode){let t=d(`span`,`memecord-card-remove`);t.setAttribute(`role`,`button`),t.setAttribute(`aria-label`,`Remove ${e.name}`),t.title=`Remove "${e.name}"`,t.innerHTML=u(`x`,13),t.addEventListener(`click`,t=>{t.stopPropagation(),C(`delete`),this.callbacks.onDeleteMeme(e.id)}),n.appendChild(t)}n.addEventListener(`click`,t=>{t.stopPropagation(),C(`pop`),this.isEditMode?this.openKeybindingModal(e):this.callbacks.onTriggerMeme(e)}),n.addEventListener(`contextmenu`,n=>{n.preventDefault(),n.stopPropagation(),this.openContextMenu(n.clientX,n.clientY,e,t)}),this.gridContainer.appendChild(n)}),!this.searchQuery){let e=d(`button`,`memecord-card add-tile`);e.type=`button`,e.title=`Add a GIF, image or video — or drop one on the deck`;let t=d(`span`,`memecord-card-thumb`);t.innerHTML=`${u(`plus`,20)}<span>Add meme</span>`,e.appendChild(t),e.appendChild(d(`span`,`memecord-card-name`,`Drop a GIF here`)),e.addEventListener(`click`,e=>{e.stopPropagation(),C(`pop`),this.setEditMode(!1),this.callbacks.onAddMeme()}),this.gridContainer.appendChild(e)}}setEditMode(e){this.isEditMode!==e&&(this.isEditMode=e,this.element?.classList.toggle(`edit-mode`,e),this.editBtn?.classList.toggle(`active`,e),this.editBtn?.setAttribute(`aria-pressed`,String(e)),this.editBanner&&(this.editBanner.style.display=e?`flex`:`none`),this.renderCards())}openKeybindingModal(e){this.closeActiveModal(),this.closeContextMenu();let t=this.memes.findIndex(t=>t.id===e.id),n=w(e,Math.max(0,t)),r=n,i=t=>this.memes.find((n,r)=>n.id!==e.id&&w(n,r)===t),a=d(`div`,`memecord-modal-backdrop`);a.dataset.memecordModal=`rebind`;let o=d(`div`,`memecord-modal`);o.setAttribute(`role`,`dialog`),o.setAttribute(`aria-modal`,`true`),o.setAttribute(`aria-label`,`Change key for ${e.name}`);let s=d(`div`,`memecord-modal-head`),c=d(`div`,`memecord-rebind-target`);c.appendChild(h(e.assetUrl,e.name,`memecord-preview-media`));let l=d(`div`);l.appendChild(d(`h2`,``,`Change key`)),l.appendChild(d(`p`,``,e.name)),c.appendChild(l);let u=this.iconButton(`x`,`Close`);s.append(c,u);let f=d(`div`,`memecord-key-capture`),p=d(`span`,`memecord-key-capture-key`,r||`–`);f.append(p,d(`span`,`memecord-key-capture-hint`,`Press any letter or number key`));let m=d(`div`,`memecord-hint`),g=d(`div`,`memecord-key-grid`);x.forEach(e=>{let t=i(e),n=d(`button`,`memecord-key-option${t?` taken`:``}`,e);n.type=`button`,n.dataset.key=e,n.title=t?`Used by "${t.name}"`:`Available`,g.appendChild(n)});let _=d(`div`,`memecord-modal-actions`),v=d(`button`,`memecord-btn`,`Cancel`);v.type=`button`;let y=d(`button`,`memecord-btn primary`,`Save`);y.type=`button`,_.append(v,y),o.append(s,f,m,g,_),a.appendChild(o);let b=e=>{r=e.toUpperCase(),p.textContent=r,g.querySelectorAll(`.memecord-key-option`).forEach(e=>{e.classList.toggle(`active`,e.dataset.key===r)});let t=i(r);f.classList.toggle(`clash`,!!t),y.disabled=!!t,t?(m.textContent=`${r} is already used by "${t.name}".`,m.className=`memecord-hint error`):(m.textContent=r===n?`This is the current key.`:`${r} is free.`,m.className=`memecord-hint success`)};b(r);let S=()=>{if(!r||i(r)){C(`delete`);return}r!==n&&this.callbacks.onUpdateHotkey?.(e.id,r),C(`pop`),this.closeActiveModal()};g.addEventListener(`click`,e=>{let t=e.target.closest(`.memecord-key-option`);t?.dataset.key&&(e.stopPropagation(),b(t.dataset.key))});let T=e=>{if(e.key===`Escape`){e.preventDefault(),e.stopPropagation(),this.closeActiveModal();return}if(e.key===`Enter`){e.preventDefault(),e.stopPropagation(),S();return}e.ctrlKey||e.metaKey||e.altKey||e.key.length===1&&/[a-z0-9]/i.test(e.key)&&(e.preventDefault(),e.stopPropagation(),b(e.key))};u.addEventListener(`click`,()=>this.closeActiveModal()),v.addEventListener(`click`,()=>this.closeActiveModal()),y.addEventListener(`click`,S),a.addEventListener(`mousedown`,e=>{e.target===a&&this.closeActiveModal()}),window.addEventListener(`keydown`,T,!0),this.parent.appendChild(a),this.activeModal=a,this.modalCleanup=()=>window.removeEventListener(`keydown`,T,!0),y.focus()}closeActiveModal(){this.modalCleanup?.(),this.modalCleanup=null,this.activeModal?.remove(),this.activeModal=null}openContextMenu(e,t,n,r){this.closeContextMenu();let i=d(`div`,`memecord-context-menu`);i.setAttribute(`role`,`menu`);let a=(e,t,n,r={})=>{let a=d(`button`,`memecord-menu-item${r.danger?` danger`:``}`);a.type=`button`,a.setAttribute(`role`,`menuitem`),a.innerHTML=u(e,15),a.appendChild(d(`span`,``,t)),r.kbd&&a.appendChild(d(`span`,`memecord-kbd`,r.kbd)),a.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),n()}),i.appendChild(a)};a(`play`,`Show now`,()=>this.callbacks.onTriggerMeme(n),{kbd:r||void 0}),a(`keyboard`,`Change key`,()=>this.openKeybindingModal(n)),a(`trash`,`Remove`,()=>{C(`delete`),this.callbacks.onDeleteMeme(n.id)},{danger:!0}),this.parent.appendChild(i);let o=i.getBoundingClientRect();i.style.left=`${Math.min(e,window.innerWidth-o.width-y)}px`,i.style.top=`${Math.min(t,window.innerHeight-o.height-y)}px`,this.contextMenu=i}closeContextMenu(){this.contextMenu?.remove(),this.contextMenu=null}bindDropTarget(e){let t=0,n=e=>{let t=Array.from(e.dataTransfer?.types||[]);return t.includes(`Files`)||t.includes(`text/uri-list`)};e.addEventListener(`dragenter`,r=>{n(r)&&(r.preventDefault(),t++,e.classList.add(`drop-target`))}),e.addEventListener(`dragover`,e=>{n(e)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`copy`))}),e.addEventListener(`dragleave`,()=>{t=Math.max(0,t-1),t===0&&e.classList.remove(`drop-target`)}),e.addEventListener(`drop`,r=>{if(!n(r))return;r.preventDefault(),t=0,e.classList.remove(`drop-target`);let i=Array.from(r.dataTransfer?.files||[]).find(e=>/^(image|video)\//.test(e.type)),a=(r.dataTransfer?.getData(`text/uri-list`)||``).split(`
`).find(e=>e&&!e.startsWith(`#`));(i||a)&&(this.setEditMode(!1),this.callbacks.onAddMeme(i?{file:i}:{url:a.trim()}))})}bindDrag(e,t){t.addEventListener(`mousedown`,n=>{if(n.button!==0)return;let r=n.target;if(t!==e&&r.closest(`button, input`))return;let i=n.clientX,a=n.clientY,o={...this.anchor},s=!1,c=t=>{let n=t.clientX-i,r=t.clientY-a;!s&&Math.abs(n)+Math.abs(r)<4||(s=!0,this.anchor={right:o.right-n,bottom:o.bottom-r},this.applyAnchor(e))},l=()=>{document.removeEventListener(`mousemove`,c),document.removeEventListener(`mouseup`,l),s&&(e===this.pebble&&(e.dataset.dragged=`1`),this.anchor=this.applyAnchor(e),this.saveAnchor())};document.addEventListener(`mousemove`,c),document.addEventListener(`mouseup`,l),t!==e&&n.preventDefault()})}applyAnchor(e){let t=e||(this.isMinimized?this.pebble:this.element),n=t?.offsetWidth||0,r=t?.offsetHeight||0,i=Math.max(y,window.innerWidth-n-y),a=Math.max(y,window.innerHeight-r-y),o=Math.round(Math.min(i,Math.max(y,this.anchor.right))),s=Math.round(Math.min(a,Math.max(y,this.anchor.bottom)));return[this.element,this.pebble].forEach(e=>{e&&(e.style.right=`${o}px`,e.style.bottom=`${s}px`)}),{right:o,bottom:s}}loadAnchor(){try{let e=JSON.parse(localStorage.getItem(v)||`null`);e&&typeof e.right==`number`&&typeof e.bottom==`number`&&(this.anchor={right:e.right,bottom:e.bottom})}catch{}}saveAnchor(){try{localStorage.setItem(v,JSON.stringify(this.anchor))}catch{}}destroy(){this.closeContextMenu(),this.closeActiveModal(),this.firingTimers.forEach(e=>clearTimeout(e)),this.firingTimers.clear(),document.removeEventListener(`click`,this.docClickHandler),window.removeEventListener(`resize`,this.resizeHandler),this.element?.remove(),this.element=null,this.pebble?.remove(),this.pebble=null}},E=`/* Memecord HUD — single source of truth, injected at runtime via ?raw import */
#memecord-overlay-root {
  --mc-bg: rgba(18, 20, 28, 0.94);
  --mc-bg-solid: #12141c;
  --mc-surface: rgba(255, 255, 255, 0.05);
  --mc-surface-hover: rgba(255, 255, 255, 0.1);
  --mc-border: rgba(255, 255, 255, 0.1);
  --mc-border-strong: rgba(255, 255, 255, 0.18);
  --mc-text: #f3f4f7;
  --mc-muted: #9ba1ae;
  --mc-faint: #6b7180;
  --mc-accent: #8b7bff;
  --mc-accent-strong: #7262f5;
  --mc-accent-soft: rgba(139, 123, 255, 0.18);
  --mc-live: #34d399;
  --mc-live-soft: rgba(52, 211, 153, 0.15);
  --mc-warn: #fbbf24;
  --mc-warn-soft: rgba(251, 191, 36, 0.14);
  --mc-danger: #f87171;
  --mc-danger-soft: rgba(248, 113, 113, 0.16);
  --mc-radius: 16px;
  --mc-radius-sm: 10px;
  --mc-shadow: 0 18px 48px -12px rgba(0, 0, 0, 0.7), 0 2px 6px rgba(0, 0, 0, 0.3);
  --mc-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif;
  --mc-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none !important;
  z-index: 2147483647 !important;
  overflow: hidden;
  font-family: var(--mc-font);
  font-size: 13px;
  line-height: 1.35;
  color: var(--mc-text);
  user-select: none;
  -webkit-font-smoothing: antialiased;
}

#memecord-overlay-root *,
#memecord-overlay-root *::before,
#memecord-overlay-root *::after {
  box-sizing: border-box;
}

#memecord-overlay-root button {
  font-family: inherit;
  color: inherit;
  margin: 0;
}

#memecord-overlay-root svg {
  display: block;
  flex-shrink: 0;
}

/* ======================================================
   Local meme preview (what you see on your own screen)
   ====================================================== */
.memecord-meme-box {
  position: absolute;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  filter: drop-shadow(0 22px 40px rgba(0, 0, 0, 0.65));
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.22s ease-out;
}

.memecord-meme-box.pos-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.7);
}
.memecord-meme-box.pos-center.visible { opacity: 1; transform: translate(-50%, -50%) scale(1); }
.memecord-meme-box.pos-center.hiding { opacity: 0; transform: translate(-50%, -50%) scale(0.88); }

.memecord-meme-box.pos-top-center {
  top: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px) scale(0.85);
}
.memecord-meme-box.pos-top-center.visible { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
.memecord-meme-box.pos-top-center.hiding { opacity: 0; transform: translateX(-50%) translateY(-16px) scale(0.85); }

.memecord-meme-box.pos-top-right {
  top: 24px;
  right: 28px;
  transform: translateY(-20px) scale(0.85);
}
.memecord-meme-box.pos-top-right.visible { opacity: 1; transform: translateY(0) scale(1); }
.memecord-meme-box.pos-top-right.hiding { opacity: 0; transform: translateY(-16px) scale(0.85); }

.memecord-meme-box.pos-bottom-right {
  bottom: 110px;
  right: 380px;
  transform: translateY(20px) scale(0.85);
}
.memecord-meme-box.pos-bottom-right.visible { opacity: 1; transform: translateY(0) scale(1); }
.memecord-meme-box.pos-bottom-right.hiding { opacity: 0; transform: translateY(16px) scale(0.85); }

.memecord-meme-image {
  display: block;
  max-width: min(80vw, 420px);
  max-height: min(55vh, 360px);
  border-radius: 18px;
  border: 3px solid rgba(255, 255, 255, 0.95);
  object-fit: contain;
  background: #0b0d12;
}

.memecord-meme-box.compact .memecord-meme-image {
  max-width: min(40vw, 220px);
  max-height: min(30vh, 180px);
  border-width: 2px;
  border-radius: 14px;
}

.memecord-meme-title {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--mc-bg);
  color: var(--mc-text);
  padding: 6px 14px 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid var(--mc-border-strong);
  white-space: nowrap;
}

.memecord-meme-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 999px;
}
.memecord-meme-badge.live { background: var(--mc-live-soft); color: var(--mc-live); }
.memecord-meme-badge.local { background: var(--mc-warn-soft); color: var(--mc-warn); }
.memecord-meme-badge .memecord-dot { width: 6px; height: 6px; }

.memecord-meme-caption {
  margin-top: 6px;
  font-size: 11.5px;
  font-weight: 500;
  color: #e5e7eb;
  background: rgba(0, 0, 0, 0.55);
  padding: 3px 10px;
  border-radius: 999px;
}

/* ======================================================
   Deck (the HUD panel)
   ====================================================== */
.memecord-deck {
  position: fixed;
  right: 20px;
  bottom: 104px;
  width: 336px;
  max-width: calc(100vw - 24px);
  max-height: calc(100vh - 24px);
  background: var(--mc-bg);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid var(--mc-border);
  border-radius: var(--mc-radius);
  box-shadow: var(--mc-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto !important;
  color: var(--mc-text);
  transform-origin: bottom right;
  transition: opacity 0.18s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease;
}

.memecord-deck.hiding {
  opacity: 0;
  transform: scale(0.92);
  pointer-events: none !important;
}

.memecord-deck.entering {
  animation: memecord-pop-in 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.memecord-deck.drop-target {
  border-color: var(--mc-accent);
  box-shadow: var(--mc-shadow), 0 0 0 3px var(--mc-accent-soft);
}

@keyframes memecord-pop-in {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

/* Header */
.memecord-deck-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px 10px 12px;
  cursor: grab;
}
.memecord-deck-header:active { cursor: grabbing; }

.memecord-deck-logo {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  object-fit: cover;
  background: var(--mc-surface);
  pointer-events: none;
}

.memecord-deck-heading {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.memecord-deck-title {
  font-size: 13.5px;
  font-weight: 750;
  letter-spacing: -0.01em;
}

.memecord-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--mc-muted);
  margin-top: 1px;
  white-space: nowrap;
}
.memecord-status.live { color: var(--mc-live); }
.memecord-status.local { color: var(--mc-warn); }

.memecord-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}
.live .memecord-dot { animation: memecord-pulse 1.8s ease-in-out infinite; }

@keyframes memecord-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.55); }
  50% { box-shadow: 0 0 0 4px rgba(52, 211, 153, 0); }
}

.memecord-icon-btn {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--mc-muted) !important;
  cursor: pointer;
  padding: 0;
  transition: background 0.15s ease, color 0.15s ease;
}
.memecord-icon-btn:hover { background: var(--mc-surface-hover); color: var(--mc-text) !important; }
.memecord-icon-btn:focus-visible { outline: 2px solid var(--mc-accent); outline-offset: 1px; }
.memecord-icon-btn.active { background: var(--mc-accent-soft); color: var(--mc-accent) !important; }

/* Toolbar: search + add */
.memecord-toolbar {
  display: flex;
  gap: 8px;
  padding: 0 12px 10px;
}

.memecord-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 10px;
  background: var(--mc-surface);
  border: 1px solid var(--mc-border);
  border-radius: var(--mc-radius-sm);
  color: var(--mc-faint);
  transition: border-color 0.15s ease;
}
.memecord-search:focus-within { border-color: var(--mc-accent); color: var(--mc-muted); }

.memecord-search input {
  flex: 1;
  min-width: 0;
  background: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  color: var(--mc-text) !important;
  font: inherit;
  font-size: 12.5px;
  padding: 0;
  margin: 0;
  height: auto;
}
.memecord-search input::placeholder { color: var(--mc-faint); }

.memecord-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border-radius: var(--mc-radius-sm);
  font-size: 12.5px;
  font-weight: 650;
  cursor: pointer;
  border: 1px solid var(--mc-border);
  background: var(--mc-surface);
  color: var(--mc-text) !important;
  white-space: nowrap;
  transition: background 0.15s ease, filter 0.15s ease, opacity 0.15s ease;
}
.memecord-btn:hover { background: var(--mc-surface-hover); }
.memecord-btn:focus-visible { outline: 2px solid var(--mc-accent); outline-offset: 1px; }
.memecord-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.memecord-btn.primary {
  background: var(--mc-accent-strong);
  border-color: transparent;
  color: #fff !important;
}
.memecord-btn.primary:hover:not(:disabled) { filter: brightness(1.12); }

.memecord-btn.danger { color: var(--mc-danger) !important; }

/* Edit banner */
.memecord-edit-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 0 12px 10px;
  padding: 8px 8px 8px 12px;
  border-radius: var(--mc-radius-sm);
  background: var(--mc-accent-soft);
  color: #d9d4ff;
  font-size: 11.5px;
  font-weight: 550;
}
.memecord-edit-banner .memecord-btn { height: 28px; padding: 0 12px; font-size: 12px; }

/* Grid */
.memecord-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 2px 12px 12px;
  max-height: 336px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.16) transparent;
}

.memecord-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 24px 12px;
  color: var(--mc-muted);
  text-align: center;
  font-size: 12px;
}
.memecord-empty strong { color: var(--mc-text); font-size: 13px; }

/* Card */
.memecord-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  min-width: 0;
  border-radius: 12px;
}
.memecord-card:focus-visible { outline: 2px solid var(--mc-accent); outline-offset: 2px; }

.memecord-card-thumb {
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #0b0d12;
  border: 1px solid var(--mc-border);
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.15s ease;
}

.memecord-card-thumb img,
.memecord-card-thumb video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}

.memecord-card:hover .memecord-card-thumb {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.35);
}
.memecord-card:active .memecord-card-thumb { transform: scale(0.96); }

.memecord-keycap {
  position: absolute;
  left: 6px;
  bottom: 6px;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(10, 11, 16, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-bottom-width: 2px;
  color: #fff;
  font: 700 11px/1 var(--mc-mono);
}

.memecord-card-name {
  font-size: 11.5px;
  font-weight: 600;
  color: #d5d8df;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 2px;
}

.memecord-card-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  background: var(--mc-accent);
  transform-origin: left center;
  transform: scaleX(0);
  opacity: 0;
}

.memecord-card.firing .memecord-card-thumb {
  border-color: var(--mc-accent);
  box-shadow: 0 0 0 2px var(--mc-accent-soft);
}
.memecord-card.firing .memecord-card-progress {
  opacity: 1;
  animation: memecord-progress var(--mc-dur, 2500ms) linear forwards;
}

@keyframes memecord-progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

/* Edit-mode affordances */
.memecord-card-remove {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background: rgba(10, 11, 16, 0.86);
  color: #fff !important;
  cursor: pointer;
  padding: 0;
  z-index: 2;
}
.memecord-card-remove:hover { background: #dc2626; }

.memecord-deck.edit-mode .memecord-keycap {
  background: var(--mc-accent-strong);
  border-color: rgba(255, 255, 255, 0.4);
}
.memecord-deck.edit-mode .memecord-card-thumb { border-style: dashed; border-color: rgba(255, 255, 255, 0.3); }

/* Add tile */
.memecord-card.add-tile .memecord-card-thumb {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: transparent;
  border: 1.5px dashed rgba(255, 255, 255, 0.2);
  color: var(--mc-muted);
  font-size: 11px;
  font-weight: 600;
}
.memecord-card.add-tile:hover .memecord-card-thumb { border-color: var(--mc-accent); color: var(--mc-accent); }

/* Footer */
.memecord-deck-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-top: 1px solid var(--mc-border);
  background: rgba(0, 0, 0, 0.16);
}

.memecord-pos-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.memecord-pos-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--mc-muted);
}

/* A tiny "screen" with clickable spots for meme placement */
.memecord-pos-screen {
  position: relative;
  width: 64px;
  height: 40px;
  border-radius: 6px;
  border: 1.5px solid var(--mc-border-strong);
  background: rgba(255, 255, 255, 0.03);
}

.memecord-pos-spot {
  position: absolute;
  width: 14px;
  height: 8px;
  padding: 0;
  border-radius: 2.5px;
  border: none;
  background: rgba(255, 255, 255, 0.18);
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
}
.memecord-pos-spot:hover { background: rgba(255, 255, 255, 0.45); transform: scale(1.12); }
.memecord-pos-spot.active { background: var(--mc-accent); }
.memecord-pos-spot:focus-visible { outline: 2px solid var(--mc-accent); outline-offset: 1px; }
.memecord-pos-spot[data-pos="top-center"] { top: 3px; left: 50%; translate: -50% 0; }
.memecord-pos-spot[data-pos="top-right"] { top: 3px; right: 4px; }
.memecord-pos-spot[data-pos="center"] { top: 50%; left: 50%; translate: -50% -50%; }
.memecord-pos-spot[data-pos="bottom-right"] { bottom: 3px; right: 4px; }

.memecord-shortcut-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--mc-faint);
}

.memecord-kbd {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 6px;
  border-radius: 5px;
  border: 1px solid var(--mc-border-strong);
  border-bottom-width: 2px;
  color: var(--mc-muted);
  font: 650 10.5px/1 var(--mc-mono);
}

/* ======================================================
   Minimized pebble
   ====================================================== */
.memecord-pebble {
  position: fixed;
  right: 20px;
  bottom: 104px;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 14px 0 5px;
  border-radius: 999px;
  background: var(--mc-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--mc-border-strong);
  box-shadow: var(--mc-shadow);
  pointer-events: auto !important;
  cursor: pointer;
  color: var(--mc-text) !important;
  font-size: 12.5px;
  font-weight: 650;
  animation: memecord-pop-in 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.memecord-pebble:hover { border-color: var(--mc-accent); transform: translateY(-1px); }
.memecord-pebble:focus-visible { outline: 2px solid var(--mc-accent); outline-offset: 2px; }

.memecord-pebble-logo {
  position: relative;
  width: 34px;
  height: 34px;
}
.memecord-pebble-logo img {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  pointer-events: none;
}
.memecord-pebble-logo .memecord-dot {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 11px;
  height: 11px;
  border: 2px solid var(--mc-bg-solid);
  color: var(--mc-faint);
}
.memecord-pebble.live .memecord-pebble-logo .memecord-dot { color: var(--mc-live); }
.memecord-pebble.local .memecord-pebble-logo .memecord-dot { color: var(--mc-warn); }

/* ======================================================
   Toast
   ====================================================== */
.memecord-toast {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%, -12px);
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: min(90vw, 460px);
  padding: 9px 16px;
  border-radius: 999px;
  background: var(--mc-bg);
  border: 1px solid var(--mc-border-strong);
  box-shadow: var(--mc-shadow);
  font-size: 12.5px;
  font-weight: 600;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.memecord-toast.visible { opacity: 1; transform: translate(-50%, 0); }
.memecord-toast.hiding { opacity: 0; transform: translate(-50%, -8px); }

/* ======================================================
   Context menu
   ====================================================== */
.memecord-context-menu {
  position: fixed;
  min-width: 200px;
  padding: 5px;
  border-radius: 12px;
  background: var(--mc-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--mc-border-strong);
  box-shadow: var(--mc-shadow);
  pointer-events: auto !important;
  animation: memecord-pop-in 0.14s ease-out;
}

.memecord-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--mc-text) !important;
  font-size: 12.5px;
  font-weight: 550;
  text-align: left;
  cursor: pointer;
}
.memecord-menu-item:hover { background: var(--mc-surface-hover); }
.memecord-menu-item svg { color: var(--mc-muted); }
.memecord-menu-item.danger,
.memecord-menu-item.danger svg { color: var(--mc-danger) !important; }
.memecord-menu-item .memecord-kbd { margin-left: auto; }

/* ======================================================
   Modals (add meme, rebind key)
   ====================================================== */
.memecord-modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(5, 6, 10, 0.5);
  pointer-events: auto !important;
  animation: memecord-fade 0.15s ease-out;
}

@keyframes memecord-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.memecord-modal {
  width: 100%;
  max-width: 400px;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 18px;
  background: var(--mc-bg-solid);
  border: 1px solid var(--mc-border-strong);
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.8);
  user-select: text;
  animation: memecord-pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.memecord-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.memecord-modal-head h2 {
  margin: 0;
  font-size: 15px;
  font-weight: 750;
  color: var(--mc-text);
  letter-spacing: -0.01em;
}
.memecord-modal-head p {
  margin: 3px 0 0;
  font-size: 12px;
  color: var(--mc-muted);
}

.memecord-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.memecord-label {
  font-size: 11.5px;
  font-weight: 650;
  color: var(--mc-muted);
}

.memecord-input {
  width: 100%;
  height: 38px;
  padding: 0 12px !important;
  margin: 0;
  background: var(--mc-surface) !important;
  border: 1px solid var(--mc-border-strong) !important;
  border-radius: var(--mc-radius-sm) !important;
  color: var(--mc-text) !important;
  font: inherit;
  font-size: 13px;
  outline: none !important;
  box-shadow: none !important;
}
.memecord-input:focus { border-color: var(--mc-accent) !important; }
.memecord-input.invalid { border-color: var(--mc-danger) !important; }
.memecord-input::placeholder { color: var(--mc-faint); }

.memecord-row {
  display: flex;
  gap: 10px;
}
.memecord-row > .memecord-field { flex: 1; min-width: 0; }
.memecord-row > .memecord-field.key-field { flex: 0 0 76px; }

.memecord-key-input {
  text-align: center;
  font: 700 15px var(--mc-mono) !important;
  text-transform: uppercase;
  caret-color: transparent;
  cursor: pointer;
}

.memecord-hint {
  font-size: 11.5px;
  color: var(--mc-muted);
  min-height: 15px;
}
.memecord-hint.error { color: var(--mc-danger); }
.memecord-hint.success { color: var(--mc-live); }

.memecord-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 18px 12px;
  border-radius: 14px;
  border: 1.5px dashed rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.02);
  color: var(--mc-muted);
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.memecord-dropzone:hover,
.memecord-dropzone.over {
  border-color: var(--mc-accent);
  background: var(--mc-accent-soft);
  color: var(--mc-text);
}
.memecord-dropzone strong { color: var(--mc-text); font-size: 12.5px; }

.memecord-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--mc-faint);
  font-size: 11px;
  font-weight: 600;
}
.memecord-divider::before,
.memecord-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--mc-border);
}

.memecord-picks {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 6px;
}

.memecord-pick {
  aspect-ratio: 1 / 1;
  padding: 0;
  border-radius: 9px;
  overflow: hidden;
  border: 1.5px solid var(--mc-border);
  background: #0b0d12;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.memecord-pick:hover { transform: translateY(-1px); border-color: rgba(255, 255, 255, 0.4); }
.memecord-pick.selected { border-color: var(--mc-accent); box-shadow: 0 0 0 2px var(--mc-accent-soft); }
.memecord-pick img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }

.memecord-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 12px;
  background: var(--mc-surface);
  border: 1px solid var(--mc-border);
}
.memecord-preview-media {
  width: 56px;
  height: 56px;
  border-radius: 9px;
  object-fit: cover;
  background: #0b0d12;
  flex-shrink: 0;
}
.memecord-preview-text { min-width: 0; flex: 1; }
.memecord-preview-text strong {
  display: block;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.memecord-preview-text span { font-size: 11.5px; color: var(--mc-muted); }

.memecord-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 2px;
}

/* Rebind modal */
.memecord-rebind-target {
  display: flex;
  align-items: center;
  gap: 12px;
}

.memecord-key-capture {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  border-radius: 14px;
  border: 1.5px solid var(--mc-accent);
  background: var(--mc-accent-soft);
}
.memecord-key-capture.clash { border-color: var(--mc-danger); background: var(--mc-danger-soft); }
.memecord-key-capture-key {
  min-width: 56px;
  height: 56px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: var(--mc-bg-solid);
  border: 1px solid var(--mc-border-strong);
  border-bottom-width: 3px;
  font: 800 24px/1 var(--mc-mono);
  color: #fff;
}
.memecord-key-capture-hint {
  font-size: 11.5px;
  color: var(--mc-muted);
  animation: memecord-blink 1.6s ease-in-out infinite;
}

@keyframes memecord-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

.memecord-key-grid {
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 5px;
}

.memecord-key-option {
  height: 30px;
  padding: 0;
  border-radius: 7px;
  border: 1px solid var(--mc-border-strong);
  background: var(--mc-surface);
  color: var(--mc-text) !important;
  font: 700 12px var(--mc-mono);
  cursor: pointer;
}
.memecord-key-option:hover { background: var(--mc-surface-hover); }
.memecord-key-option.active { background: var(--mc-accent-strong); border-color: transparent; color: #fff !important; }
.memecord-key-option.taken { opacity: 0.35; border-style: dashed; }

@media (prefers-reduced-motion: reduce) {
  #memecord-overlay-root *,
  #memecord-overlay-root *::before,
  #memecord-overlay-root *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .memecord-card.firing .memecord-card-progress {
    animation-duration: var(--mc-dur, 2500ms) !important;
  }
}
`,D=[{id:`thumbs_up`,name:`Thumbs Up`,emoji:`👍`,assetUrl:`memes/thumbs-up.gif`,hotkey:`1`,durationMs:2500},{id:`victory`,name:`Peace / Victory`,emoji:`✌️`,assetUrl:`memes/victory.gif`,hotkey:`2`,durationMs:2500},{id:`stop`,name:`Wait / Hold Up`,emoji:`🖐`,assetUrl:`memes/stop.gif`,hotkey:`3`,durationMs:2500},{id:`cinema`,name:`Absolute Cinema`,emoji:`🙌`,assetUrl:`memes/absolute-cinema.gif`,hotkey:`4`,durationMs:3e3},{id:`rock_on`,name:`Rock On / Headbang`,emoji:`🤘`,assetUrl:`memes/rock-on.gif`,hotkey:`5`,durationMs:2500},{id:`pointing`,name:`Big Brain / Roll Safe`,emoji:`☝️`,assetUrl:`memes/pointing.gif`,hotkey:`6`,durationMs:2500},{id:`noice`,name:`Noice (Michael Rosen)`,emoji:`👌`,assetUrl:`memes/noice.gif`,hotkey:`7`,durationMs:2200},{id:`fist`,name:`Arthur Fist`,emoji:`✊`,assetUrl:`memes/fist.gif`,hotkey:`8`,durationMs:2500},{id:`perfection`,name:`Chef Kiss / Perfection`,emoji:`✨`,assetUrl:`memes/perfection.gif`,hotkey:`9`,durationMs:2500}],O=[...D,{id:`this_is_fine`,name:`This Is Fine`,emoji:`🔥`,assetUrl:`https://media.giphy.com/media/9M5jK4GXmD5o1irGrF/giphy.gif`},{id:`confused_travolta`,name:`Confused Travolta`,emoji:`🤷`,assetUrl:`https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif`},{id:`drake_yes`,name:`Drake Approves`,emoji:`😎`,assetUrl:`https://media.giphy.com/media/wWue0rCDOphOE/giphy.gif`},{id:`leonardo_cheers`,name:`Gatsby Toast`,emoji:`🥂`,assetUrl:`https://media.giphy.com/media/GCLlQnV7dXZ2E/giphy.gif`}],k={enabled:!0,dockVisible:!0,defaultDurationMs:2500,position:`top-center`,soundEnabled:!0,memes:D},A=`memecord_settings`,j=`mememeet_settings`;function M(){return typeof indexedDB>`u`?Promise.resolve(null):new Promise(e=>{try{let t=indexedDB.open(`memecord_db`,1);t.onupgradeneeded=()=>{let e=t.result;e.objectStoreNames.contains(`settings`)||e.createObjectStore(`settings`)},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null)}catch{e(null)}})}async function N(e){let t=await M();return t?new Promise(n=>{try{let r=t.transaction(`settings`,`readonly`).objectStore(`settings`).get(e);r.onsuccess=()=>n(r.result??null),r.onerror=()=>n(null)}catch{n(null)}}):null}async function P(e,t){let n=await M();return n?new Promise(r=>{try{let i=n.transaction(`settings`,`readwrite`).objectStore(`settings`).put(t,e);i.onsuccess=()=>r(!0),i.onerror=()=>r(!1)}catch{r(!1)}}):!1}async function F(){try{if(typeof chrome<`u`&&chrome.storage&&chrome.storage.local){let e=await chrome.storage.local.get([A,j]),t=e?e[A]:void 0;if(!t&&e&&e[j]){t=e[j];try{await chrome.storage.local.set({[A]:t}),await chrome.storage.local.remove(j)}catch{}}if(t)return{...k,...t,memes:Array.isArray(t.memes)&&t.memes.length>0?t.memes:k.memes}}let e=await N(A);if(e)return{...k,...e,memes:Array.isArray(e.memes)&&e.memes.length>0?e.memes:k.memes};if(typeof localStorage<`u`){let e=localStorage.getItem(A);if(e||(e=localStorage.getItem(j),e&&(localStorage.setItem(A,e),localStorage.removeItem(j))),e){let t=JSON.parse(e);return{...k,...t,memes:Array.isArray(t.memes)&&t.memes.length>0?t.memes:k.memes}}}}catch(e){console.warn(`[Memecord] Failed to read settings, using defaults:`,e)}return k}async function I(e){let t={...await F(),...e};try{if(typeof chrome<`u`&&chrome.storage&&chrome.storage.local&&await chrome.storage.local.set({[A]:t}),await P(A,t),typeof localStorage<`u`)try{localStorage.setItem(A,JSON.stringify(t))}catch(e){console.warn(`[Memecord] LocalStorage quota exceeded, persisted via IndexedDB:`,e)}}catch(e){console.error(`[Memecord] Failed to save settings:`,e)}return t}function L(e,n,r){let i=n.trim().toUpperCase();if(i)return e.find((e,n)=>e.id!==r&&(e.hotkey||t(n)).trim().toUpperCase()===i)}async function R(e){let t=await F(),n=(e.hotkey||``).trim().toUpperCase();if(n){let r=L(t.memes,n,e.id);if(r)throw Error(`Key [${n}] is already assigned to "${r.name}". Change old one first.`)}let r=t.memes.findIndex(t=>t.id===e.id),i;return r>=0?(i=[...t.memes],i[r]={...e,hotkey:n}):i=[...t.memes,{...e,hotkey:n}],I({memes:i})}async function z(e){return I({memes:(await F()).memes.filter(t=>t.id!==e)})}async function B(e,t){let n=await F(),r=t.trim().toUpperCase();if(!r)throw Error(`Key cannot be empty`);let i=L(n.memes,r,e);if(i)throw Error(`Key [${r}] is already assigned to "${i.name}". Change old one first.`);return I({memes:n.memes.map(t=>t.id===e?{...t,hotkey:r}:t)})}var V=8388608,H=class{root=null;currentMemeBox=null;currentToast=null;currentModal=null;modalCleanup=null;hideTimeoutId=null;removeTimeoutId=null;toastTimeoutId=null;floatingDock=null;settings;callbacks;callMode=`local`;audioCtx=null;constructor(e,t={}){this.settings=e,this.callbacks=t,this.initRoot(),this.root&&(this.floatingDock=new T(this.root,this.settings.memes,{onTriggerMeme:e=>{this.callbacks.onTriggerMeme?this.callbacks.onTriggerMeme(e):this.showMeme(e)},onAddMeme:e=>{this.openQuickAddModal(e)},onDeleteMeme:e=>{let t=this.settings.memes.find(t=>t.id===e);this.callbacks.onDeleteMeme?.(e),this.showToast(`Removed "${t?.name||`meme`}"`)},onUpdateHotkey:async(e,t)=>{let n=this.settings.memes.find(t=>t.id===e);try{let r=await B(e,t);this.updateSettings(r),this.callbacks.onUpdateHotkey?.(e,t),this.showToast(`"${n?.name||`Meme`}" is now on key ${t}`)}catch(e){this.showToast(e?.message||`Could not change key`)}},onMinimizedChange:e=>{this.callbacks.onDockMinimizedChange?.(e)},onPositionChange:e=>{this.settings.position=e,I({position:e}),this.showPositionPreview(e)}},this.settings.position,!this.settings.dockVisible))}updateSettings(e){this.settings=e,this.floatingDock?.updateMemes(e.memes),this.floatingDock?.setPosition(e.position),this.floatingDock?.setMinimized(!e.dockVisible,!1)}setDockVisible(e){this.floatingDock?.setVisible(e)}setDockMinimized(e){this.floatingDock?.setMinimized(e,!1)}setCameraLive(e){this.callMode=e?`live`:`local`,this.floatingDock?.setCallMode(this.callMode)}isCapturingKeyboard(){return!!this.currentModal||!!this.floatingDock?.isModalOpen()}showToast(e,t=2500){if(!this.root)return;this.currentToast?.remove(),this.currentToast=null,this.toastTimeoutId&&=(clearTimeout(this.toastTimeoutId),null);let n=d(`div`,`memecord-toast`,e);n.setAttribute(`role`,`status`),this.root.appendChild(n),this.currentToast=n,requestAnimationFrame(()=>n.classList.add(`visible`)),this.toastTimeoutId=setTimeout(()=>{n.classList.remove(`visible`),n.classList.add(`hiding`),setTimeout(()=>{n.remove(),this.currentToast===n&&(this.currentToast=null)},300)},t)}showMeme(e){if(!this.root||!this.settings.enabled)return;this.settings.soundEnabled&&this.playTriggerSound(),this.hideTimeoutId&&clearTimeout(this.hideTimeoutId),this.removeTimeoutId&&clearTimeout(this.removeTimeoutId),this.hideTimeoutId=null,this.removeTimeoutId=null,this.currentMemeBox?.remove(),this.currentMemeBox=null;let t=e.durationMs||this.settings.defaultDurationMs||2500,n=this.callMode===`live`;this.floatingDock?.markFiring(e.id,t);let r=d(`div`,`memecord-meme-box ${this.getPositionClass(this.settings.position||`top-center`)}${n?` compact`:``}`);r.setAttribute(`aria-live`,`polite`);let i=h(e.assetUrl,e.name,`memecord-meme-image`),a=d(`div`,`memecord-meme-title`),o=d(`span`,`memecord-meme-badge ${n?`live`:`local`}`);o.appendChild(d(`span`,`memecord-dot`)),o.appendChild(d(`span`,``,n?`On camera`:`Only you`)),a.append(o,d(`span`,``,e.name)),r.append(i,a),n||r.appendChild(d(`div`,`memecord-meme-caption`,`Turn your camera on so others see it`)),this.root.appendChild(r),this.currentMemeBox=r,requestAnimationFrame(()=>r.classList.add(`visible`)),this.hideTimeoutId=setTimeout(()=>{r.classList.remove(`visible`),r.classList.add(`hiding`),this.removeTimeoutId=setTimeout(()=>{r.remove(),this.currentMemeBox===r&&(this.currentMemeBox=null)},300)},t)}showPositionPreview(e){this.showToast(`Memes will appear ${{"top-center":`top`,"top-right":`top right`,center:`center`,"bottom-right":`bottom right`}[e]} on your video`,1800)}openQuickAddModal(e={}){if(!this.root)return;this.closeModal();let t=n(this.settings.memes),i=new Set(this.settings.memes.map(e=>e.id)),a=new Set(this.settings.memes.map(e=>e.assetUrl)),o=O.filter(e=>!i.has(e.id)&&!a.has(e.assetUrl)),s=null,c=null,l=0,f=d(`div`,`memecord-modal-backdrop`);f.dataset.memecordModal=`add`;let p=d(`div`,`memecord-modal`);p.setAttribute(`role`,`dialog`),p.setAttribute(`aria-modal`,`true`),p.setAttribute(`aria-label`,`Add a meme`);let m=d(`div`,`memecord-modal-head`),v=d(`div`);v.appendChild(d(`h2`,``,`Add a meme`)),v.appendChild(d(`p`,``,`GIF, image or short video. Give it a key to fire it mid-call.`));let y=d(`button`,`memecord-icon-btn`);y.type=`button`,y.setAttribute(`aria-label`,`Close`),y.innerHTML=u(`x`,16),m.append(v,y);let b=d(`input`);b.type=`file`,b.accept=`image/gif,image/webp,image/png,image/jpeg,video/mp4,video/webm`,b.style.display=`none`;let x=d(`div`,`memecord-dropzone`);x.setAttribute(`role`,`button`),x.tabIndex=0,x.innerHTML=u(`upload`,20),x.appendChild(d(`strong`,``,`Upload or drop a file`)),x.appendChild(d(`span`,``,`GIF, WebP, PNG, JPG, MP4 · up to 8 MB`));let S=d(`div`,`memecord-field`),C=d(`label`,`memecord-label`,`Paste a link`);C.htmlFor=`memecord-add-url`;let w=d(`input`,`memecord-input`);w.id=`memecord-add-url`,w.type=`url`,w.placeholder=`Tenor, Giphy or direct .gif / .mp4 link`,w.autocomplete=`off`,S.append(C,w);let T=null;if(o.length>0){T=d(`div`,`memecord-field`),T.appendChild(d(`span`,`memecord-label`,`Or pick a classic`));let e=d(`div`,`memecord-picks`);o.slice(0,12).forEach(t=>{let n=d(`button`,`memecord-pick`);n.type=`button`,n.title=t.name,n.setAttribute(`aria-label`,t.name),n.appendChild(h(t.assetUrl,t.name)),n.addEventListener(`click`,()=>{e.querySelectorAll(`.memecord-pick`).forEach(e=>e.classList.remove(`selected`)),n.classList.add(`selected`),w.value=``,j||(A.value=t.name),G({url:t.assetUrl,name:t.name},`Ready to add`)}),e.appendChild(n)}),T.appendChild(e)}let E=d(`div`,`memecord-row`),D=d(`div`,`memecord-field`),k=d(`label`,`memecord-label`,`Name`);k.htmlFor=`memecord-add-name`;let A=d(`input`,`memecord-input`);A.id=`memecord-add-name`,A.type=`text`,A.placeholder=`e.g. Happy Cat`,A.maxLength=40,D.append(k,A);let j=!1;A.addEventListener(`input`,()=>{j=A.value.trim().length>0,W()});let M=d(`div`,`memecord-field key-field`),N=d(`label`,`memecord-label`,`Key`);N.htmlFor=`memecord-add-key`;let P=d(`input`,`memecord-input memecord-key-input`);P.id=`memecord-add-key`,P.type=`text`,P.readOnly=!0,P.value=t,P.title=`Click, then press a key`,M.append(N,P),E.append(D,M);let F=d(`div`,`memecord-hint`),I=d(`div`,`memecord-preview`);I.style.display=`none`;let R=d(`div`,`memecord-modal-actions`),z=d(`button`,`memecord-btn`,`Cancel`);z.type=`button`;let B=d(`button`,`memecord-btn primary`,`Add to deck`);B.type=`button`,B.disabled=!0,R.append(z,B),p.append(m,x,b,d(`div`,`memecord-divider`,`or`),S),T&&p.appendChild(T),p.append(E,F,I,R),f.appendChild(p);let H=(e,t=``)=>{F.textContent=e,F.className=`memecord-hint${t?` ${t}`:``}`},U=()=>{let e=P.value.trim().toUpperCase(),t=e?L(this.settings.memes,e):void 0;return P.classList.toggle(`invalid`,!e||!!t),e?!t||(H(`${e} is already used by "${t.name}".`,`error`),!1):(H(`Pick a key for this meme.`,`error`),!1)},W=()=>{if(I.innerHTML=``,!s){I.style.display=`none`,B.disabled=!0;return}I.style.display=`flex`,I.appendChild(h(s.url,`Preview`,`memecord-preview-media`));let e=d(`div`,`memecord-preview-text`);e.appendChild(d(`strong`,``,A.value.trim()||s.name||`Untitled meme`)),e.appendChild(d(`span`,``,`Fires with key ${P.value||`—`}`)),I.appendChild(e),B.disabled=!U()},G=(e,t=``)=>{s=e,e?.name&&!j&&(A.value=e.name),t&&H(t,`success`),W(),e&&U()&&t&&H(t,`success`)},K=()=>{p.querySelectorAll(`.memecord-pick`).forEach(e=>e.classList.remove(`selected`))},q=async e=>{if(!/^(image|video)\//.test(e.type)){H(`That file isn't an image or video.`,`error`);return}if(e.size>V){H(`That file is ${(e.size/1024/1024).toFixed(1)} MB — keep it under 8 MB.`,`error`);return}K(),w.value=``,H(`Reading file…`);try{let t=await g(e);G({url:t,name:_(e.name)},`Loaded ${e.name}`)}catch(e){H(e?.message||`Could not read that file.`,`error`)}},J=e=>{K(),c&&clearTimeout(c);let t=e.trim();if(w.classList.remove(`invalid`),!t){G(null),H(``);return}H(`Checking link…`);let n=++l;c=setTimeout(async()=>{try{let e=await r(t);if(n!==l)return;G({url:e.url,name:e.name},`Link looks good`)}catch(e){if(n!==l)return;w.classList.add(`invalid`),G(null),H(e?.message||`That link doesn't look like a GIF or video.`,`error`)}},300)};x.addEventListener(`click`,()=>b.click()),x.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),b.click())}),b.addEventListener(`change`,()=>{let e=b.files?.[0];e&&q(e),b.value=``}),[`dragenter`,`dragover`].forEach(e=>x.addEventListener(e,e=>{e.preventDefault(),x.classList.add(`over`)})),x.addEventListener(`dragleave`,()=>x.classList.remove(`over`)),x.addEventListener(`drop`,e=>{e.preventDefault(),x.classList.remove(`over`);let t=e.dataTransfer?.files?.[0],n=e.dataTransfer?.getData(`text/uri-list`);t?q(t):n&&(w.value=n.split(`
`)[0].trim(),J(w.value))}),w.addEventListener(`input`,()=>J(w.value)),P.addEventListener(`keydown`,e=>{e.key!==`Tab`&&e.key!==`Escape`&&e.key!==`Enter`&&(e.preventDefault(),e.stopPropagation(),!(e.ctrlKey||e.metaKey||e.altKey)&&e.key.length===1&&/[a-z0-9]/i.test(e.key)&&(P.value=e.key.toUpperCase(),H(``),W(),U()&&H(`${P.value} is free.`,`success`)))});let Y=async()=>{if(s&&U()){B.disabled=!0,B.textContent=`Adding…`;try{let e=P.value.trim().toUpperCase(),t=A.value.trim()||s.name||`Custom meme`,n={id:`meme_${Date.now()}`,name:t,emoji:``,assetUrl:s.url,hotkey:e,durationMs:this.settings.defaultDurationMs||2500};await this.callbacks.onAddMeme?.(n),this.closeModal(),this.showToast(`Added "${t}" — press ${e} to fire it`)}catch(e){H(e?.message||`Could not save this meme.`,`error`),B.disabled=!1,B.textContent=`Add to deck`}}};B.addEventListener(`click`,Y),y.addEventListener(`click`,()=>this.closeModal()),z.addEventListener(`click`,()=>this.closeModal()),f.addEventListener(`mousedown`,e=>{e.target===f&&this.closeModal()}),p.addEventListener(`keydown`,e=>{e.key===`Escape`?(e.preventDefault(),this.closeModal()):e.key===`Enter`&&!B.disabled&&e.target?.tagName!==`BUTTON`&&(e.preventDefault(),Y()),e.stopPropagation()});let X=e=>e.stopPropagation();p.addEventListener(`keyup`,X),p.addEventListener(`keypress`,X),this.root.appendChild(f),this.currentModal=f,this.modalCleanup=()=>{c&&clearTimeout(c),l++},e.file?q(e.file):e.url&&(w.value=e.url,J(e.url)),w.focus()}closeModal(){this.modalCleanup?.(),this.modalCleanup=null,this.currentModal?.remove(),this.currentModal=null}playTriggerSound(){try{let e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.audioCtx=this.audioCtx||new e;let t=this.audioCtx,n=t.createOscillator(),r=t.createGain();n.type=`sine`,n.frequency.setValueAtTime(480,t.currentTime),n.frequency.exponentialRampToValueAtTime(960,t.currentTime+.1),r.gain.setValueAtTime(.12,t.currentTime),r.gain.exponentialRampToValueAtTime(.001,t.currentTime+.1),n.connect(r),r.connect(t.destination),n.start(),n.stop(t.currentTime+.11)}catch{}}getPositionClass(e){switch(e){case`center`:return`pos-center`;case`top-right`:return`pos-top-right`;case`bottom-right`:return`pos-bottom-right`;default:return`pos-top-center`}}initRoot(){if(!document.getElementById(`memecord-injected-styles`)){let e=document.createElement(`style`);e.id=`memecord-injected-styles`,e.textContent=E,(document.head||document.documentElement).appendChild(e)}let e=document.getElementById(`memecord-overlay-root`);e||(e=document.createElement(`div`),e.id=`memecord-overlay-root`,(document.body||document.documentElement).appendChild(e)),this.root=e}destroy(){this.hideTimeoutId&&clearTimeout(this.hideTimeoutId),this.removeTimeoutId&&clearTimeout(this.removeTimeoutId),this.toastTimeoutId&&clearTimeout(this.toastTimeoutId),this.floatingDock?.destroy(),this.floatingDock=null,this.closeModal(),this.audioCtx?.close().catch(()=>{}),this.audioCtx=null,this.root?.remove(),this.root=null}},U=class{overlay=null;settings=null;keydownHandler=null;isDestroyed=!1;isInCall=!1;isCameraStreaming=!1;isAudioStreaming=!1;isWebRtcConnected=!1;callCheckIntervalId=null;spaObserver=null;async init(){this.settings=await F(),this.ensureInjectedScript(),this.overlay=new H(this.settings,{onTriggerMeme:e=>{this.triggerMeme(e)},onAddMeme:async e=>{let t=await R(e);this.settings=t,this.overlay?.updateSettings(t)},onDeleteMeme:async e=>{let t=await z(e);this.settings=t,this.overlay?.updateSettings(t)},onUpdateHotkey:(e,t)=>{this.settings&&(this.settings.memes=this.settings.memes.map(n=>n.id===e?{...n,hotkey:t}:n))},onDockMinimizedChange:e=>{this.settings&&(this.settings.dockVisible=!e,I({dockVisible:!e}))}}),this.overlay.setDockVisible(!1),this.registerKeyboardShortcuts(),this.setupListeners(),this.setupCallStateMonitoring(),this.checkCallState(),console.log(`[Memecord] Call-sensitive Overlay Controller initialized (supports cam & no-cam calls).`)}async triggerMeme(e){if(!this.settings||!this.settings.enabled)return;this.overlay?.showMeme(e);let t=await i(e.assetUrl),n={source:`MEMECORD_CONTENT`,type:`TRIGGER_CAMERA_MEME`,meme:{...e,assetUrl:t},position:this.settings.position||`center`};window.postMessage(n,`*`);try{document.querySelectorAll(`iframe`).forEach(e=>{try{e.contentWindow?.postMessage(n,`*`)}catch{}})}catch{}if(window.parent&&window.parent!==window)try{window.parent.postMessage(n,`*`)}catch{}}isTestLab(){let e=window.location.href;return window.location.pathname.includes(`/test/`)||e.includes(`test/index.html`)||e.includes(`:4182`)||e.includes(`localhost:5173`)}isOngoingCall(){if(this.isTestLab()||this.isCameraStreaming||this.isAudioStreaming||this.isWebRtcConnected)return!0;let e=window.location.hostname,t=window.location.pathname;if(e.includes(`meet.google.com`)){if(!(/^\/[a-z]{3}-[a-z]{4}-[a-z]{3}/i.test(t)||t.includes(`/_meet/`)))return!1;let e=!!document.querySelector(`button[jsname="Qx7uuf"], button[aria-label*="Join" i], button[aria-label*="Ask to join" i], button[aria-label*="Unirse" i], button[aria-label*="Participer" i]`);return e||document.querySelector(`div[data-call-ended="true"], button[aria-label*="Rejoin" i]`)?!1:!!document.querySelector(`button[jsname="CQylAd"], button[jsname="B1qRre"], button[jsname="A17eec"], button[jsname="E90pfb"], button[aria-label*="Leave call" i], button[data-tooltip*="Leave call" i], button[aria-label*="End call" i], button[aria-label*="camera" i], button[aria-label*="cámara" i], button[aria-label*="kamera" i], button[aria-label*="microphone" i], button[aria-label*="micrófono" i], button[aria-label*="mikrofon" i], button[aria-label*="Raise hand" i], div[data-meeting-title], div[data-allocation-index], div[data-participant-id]`)||!e}return e.includes(`discord.com`)?!!document.querySelector(`div[class*="rtcConnectionStatus"], div[aria-label*="Voice Connected" i], div[class*="voiceUsers"], div[class*="connection_"], section[aria-label*="Voice" i], button[aria-label*="Disconnect" i], button[aria-label*="Leave Call" i], div[class*="videoGrid"], div[class*="callContainer"], div[class*="wrapperInCall"]`):e.includes(`zoom.us`)?!t.includes(`/wc/`)&&!t.includes(`/j/`)?!1:!!document.querySelector(`#foot-bar, .footer-button-container, button[aria-label*="Leave" i], button[aria-label*="End" i], button[aria-label*="audio" i], button[aria-label*="mute" i], button[aria-label*="video" i], #meeting-app, .meeting-app`):e.includes(`teams.microsoft.com`)||e.includes(`teams.live.com`)?!!document.querySelector(`button#hangup-button, button[id*="hangup"], button[aria-label*="Leave" i], button[aria-label*="Hang up" i], div[data-tid="call-controls"], div[id*="calling-bar"], div[class*="calling-unified-bar"]`):e.includes(`slack.com`)?!!document.querySelector(`button[data-qa*="leave" i], button[aria-label*="Leave call" i], div[data-qa*="huddle"], div[data-qa*="call_container"], div[class*="c-huddle"]`):e.includes(`facetime.apple.com`)?!!document.querySelector(`button[aria-label*="Leave" i], button[aria-label*="End" i], button[aria-label*="Camera" i], button[aria-label*="Microphone" i]`):e.includes(`web.whatsapp.com`)?!!document.querySelector(`div[data-testid="call-container"], button[aria-label*="End call" i], div[data-testid*="call"]`):!1}checkCallState(){let e=this.isOngoingCall();e&&!this.isInCall?(this.isInCall=!0,console.log(`[Memecord] Ongoing call detected (cam or no-cam) -> showing HUD & enabling hotkeys`),this.overlay?.setDockVisible(!!this.settings?.enabled),this.overlay?.showToast(`Memecord is ready — press 1–9 to send a meme`)):!e&&this.isInCall&&(this.isInCall=!1,console.log(`[Memecord] Call ended / outside call -> hiding HUD`),this.overlay?.setDockVisible(!1))}setupCallStateMonitoring(){window.addEventListener(`message`,e=>{e.data?.source===`MEMECORD_CAMERA`&&(e.data.type===`CALL_STREAM_STATE`?(this.isCameraStreaming=!!e.data.hasVideo,this.isAudioStreaming=!!e.data.hasAudio,this.overlay?.setCameraLive(this.isCameraStreaming),this.checkCallState()):e.data.type===`CAMERA_CALL_STATE`?(this.isCameraStreaming=!!e.data.active,this.overlay?.setCameraLive(this.isCameraStreaming),this.checkCallState()):e.data.type===`WEBRTC_CALL_STATE`&&(this.isWebRtcConnected=!!e.data.active,this.checkCallState()))}),this.callCheckIntervalId=setInterval(()=>{this.checkCallState()},1e3),this.spaObserver=new MutationObserver(()=>{this.checkCallState()});let e=document.body||document.documentElement;e&&this.spaObserver.observe(e,{childList:!0,subtree:!0})}ensureInjectedScript(){try{if(typeof chrome<`u`&&chrome.runtime?.getURL){let e=document.createElement(`script`);e.src=chrome.runtime.getURL(`inject.js`),e.onload=()=>e.remove(),(document.head||document.documentElement).appendChild(e)}}catch{}}registerKeyboardShortcuts(){this.keydownHandler=e=>{if(!this.settings||!this.settings.enabled||!this.isInCall||this.overlay?.isCapturingKeyboard())return;let n=document.activeElement;if(n&&(n.tagName===`INPUT`||n.tagName===`TEXTAREA`||n.isContentEditable||n.getAttribute(`role`)===`textbox`))return;if(c(e)){e.preventDefault();let t=!this.settings.dockVisible;I({dockVisible:t}),this.settings.dockVisible=t,this.overlay?.setDockMinimized(!t),this.overlay?.setDockVisible(!0),t||this.overlay?.showToast(`Memecord minimized — ${o()} to reopen`);return}if(e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;let r=e.key,i=this.settings.memes.find((e,n)=>{let i=e.hotkey||t(n);return i&&i.toLowerCase()===r.toLowerCase()});i&&(e.preventDefault(),console.log(`[Memecord] Hotkey [${r}] triggered: ${i.name}`),this.triggerMeme(i))},window.addEventListener(`keydown`,this.keydownHandler,!0)}setupListeners(){typeof chrome<`u`&&chrome.storage?.onChanged&&chrome.storage.onChanged.addListener((e,t)=>{let n=e.memecord_settings||e.mememeet_settings;if(t===`local`&&n){let e=n.newValue;e&&(this.settings=e,this.overlay?.updateSettings(e),this.overlay?.setDockVisible(this.isInCall&&e.enabled),window.postMessage({source:`MEMECORD_CONTENT`,type:`UPDATE_CAMERA_SETTINGS`,position:e.position||`center`},`*`))}}),typeof chrome<`u`&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener((e,t,n)=>{if(e.type===`TRIGGER_MEME`){let t=this.settings?.memes.find(t=>t.id===e.memeId);return t&&(this.triggerMeme(t),n({success:!0})),!0}if(e.type===`TRIGGER_MEME_ITEM`)return this.triggerMeme(e.meme),n({success:!0}),!0;if(e.type===`TOGGLE_DOCK`){if(this.settings){let e=!this.settings.dockVisible;this.settings.dockVisible=e,I({dockVisible:e}),this.overlay?.setDockMinimized(!e),this.overlay?.setDockVisible(this.isInCall&&this.settings.enabled),n({dockVisible:e})}return!0}return!1})}destroy(){this.isDestroyed||(this.isDestroyed=!0,this.callCheckIntervalId&&=(clearInterval(this.callCheckIntervalId),null),this.spaObserver&&=(this.spaObserver.disconnect(),null),this.keydownHandler&&=(window.removeEventListener(`keydown`,this.keydownHandler,!0),null),this.overlay&&=(this.overlay.destroy(),null))}};function W(){if(window.__MEMECORD_INITIALIZED__)return;window.__MEMECORD_INITIALIZED__=!0;let e=new U;window.__MEMECORD_CONTROLLER__=e,document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>{e.init()}):e.init()}W()})();