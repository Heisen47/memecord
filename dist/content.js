(function(){var e=new Map;function t(e){if(e<9)return String(e+1);if(e===9)return`0`;let t=[`Q`,`W`,`E`,`R`,`T`,`Y`,`U`,`I`,`O`,`P`,`A`,`S`,`D`,`F`],n=e-10;return n<t.length?t[n]:``}function n(e){let n=new Set(e.map((e,n)=>(e.hotkey||t(n)).trim().toUpperCase()).filter(Boolean));for(let e of`1234567890QWERTYUIOPASDFGHJKLZXCVBNM`.split(``))if(!n.has(e))return e;return``}async function r(e){let t=e.trim();if(!t)throw Error(`URL cannot be empty`);if(t.startsWith(`data:`))return{url:t,isVideo:t.startsWith(`data:video/`)};if(t.startsWith(`memes/`)||t.startsWith(`/memes/`))return{url:t,isVideo:!1};if(t.includes(`tenor.com`)){if(t.includes(`media.tenor.com`)&&(t.endsWith(`.gif`)||t.endsWith(`.mp4`)||t.endsWith(`.webp`)))return{url:t,isVideo:t.endsWith(`.mp4`)||t.endsWith(`.webm`)};try{let e=await chrome.runtime.sendMessage({type:`RESOLVE_TENOR_URL`,url:t});if(e&&e.success&&e.resolvedUrl)return{url:e.resolvedUrl,name:e.name,emoji:`✨`,isVideo:e.isVideo}}catch(e){console.warn(`[Memecord] Background Tenor resolve failed, trying fallback slug:`,e)}let e=t.match(/\/view\/([a-zA-Z0-9_-]+)/),n=`Tenor Meme`;return e&&e[1]&&(n=e[1].replace(/-gif-\d+$/,``).replace(/-gif$/,``).replace(/-/g,` `).replace(/\b\w/g,e=>e.toUpperCase())),{url:t,name:n,isVideo:!1}}if(t.includes(`giphy.com/gifs/`)){let e=t.match(/-([a-zA-Z0-9]+)$/);if(e&&e[1])return{url:`https://media.giphy.com/media/${e[1]}/giphy.gif`,isVideo:!1}}return{url:t,isVideo:t.endsWith(`.mp4`)||t.endsWith(`.webm`)}}function i(e){return new Promise((t,n)=>{let r=new FileReader;r.onloadend=()=>t(r.result),r.onerror=()=>n(r.error||Error(`could not read the file`)),r.readAsDataURL(e)})}async function a(t){if(t.startsWith(`data:`))return{dataUrl:t};let n=e.get(t);if(n)return{dataUrl:n};let r=t.startsWith(`memes/`)||t.startsWith(`/memes/`),a=typeof chrome<`u`&&!!chrome.runtime?.id;if(r){let n=t.replace(/^\//,``),r=a&&chrome.runtime.getURL?chrome.runtime.getURL(n):`/${n}`;try{let a=await fetch(r);if(!a.ok)return{error:`bundled file ${n} is missing (HTTP ${a.status})`};let o=await i(await a.blob());return e.set(t,o),{dataUrl:o}}catch(e){return{error:`couldn't read bundled file ${n}: ${e?.message||e}`}}}if(!a)return{error:`remote memes can only be loaded inside the installed extension`};try{let n=await chrome.runtime.sendMessage({type:`FETCH_MEDIA_AS_DATA_URL`,url:t});return n?.success&&n.dataUrl?(e.set(t,n.dataUrl),{dataUrl:n.dataUrl}):{error:n?.error||`the extension returned no data`}}catch(e){let t=e?.message||String(e);return/context invalidated|receiving end does not exist/i.test(t)?{error:`the extension was reloaded or updated — refresh this tab and try again`}:{error:`couldn't reach the extension background (${t})`}}}var o=typeof navigator<`u`&&(/Mac|iPhone|iPod|iPad/i.test(navigator.platform||``)||/Macintosh|Mac OS X/i.test(navigator.userAgent||``)),s=()=>o?`⌥⇧M`:`Alt+M`,c=()=>o?`⌥⇧M (Option+Shift+M)`:`Alt+M`,l=e=>{if(e.code!==`KeyM`&&e.key.toLowerCase()!==`m`&&e.key!==`µ`)return!1;if(o){let t=e.altKey&&e.shiftKey,n=e.altKey&&!e.metaKey&&!e.ctrlKey,r=e.ctrlKey&&e.shiftKey,i=e.metaKey&&e.shiftKey;return!!(t||n||r||i)}return!!(e.altKey||e.ctrlKey&&e.shiftKey)},u={plus:`<path d="M12 5v14M5 12h14"/>`,pencil:`<path d="M21.17 6.81a2.83 2.83 0 0 0-4-4L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/>`,minus:`<path d="M5 12h14"/>`,x:`<path d="M18 6 6 18M6 6l12 12"/>`,search:`<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>`,play:`<path d="M6 4v16a1 1 0 0 0 1.5.86l13-8a1 1 0 0 0 0-1.72l-13-8A1 1 0 0 0 6 4z"/>`,keyboard:`<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M10 13h4"/>`,trash:`<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>`,upload:`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>`,flame:`<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`,refresh:`<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>`,image:`<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>`};function d(e,t=16){return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${u[e]}</svg>`}function f(e,t,n){let r=document.createElement(e);return t&&(r.className=t),n!==void 0&&(r.textContent=n),r}function p(e){if(!e)return``;if(e.startsWith(`http://`)||e.startsWith(`https://`)||e.startsWith(`data:`))return e;if(typeof chrome<`u`&&chrome.runtime?.id&&chrome.runtime.getURL)try{return chrome.runtime.getURL(e.replace(/^\//,``))}catch{}return e.startsWith(`/`)?e:`/${e}`}function m(e){return e.startsWith(`data:video/`)||/\.(mp4|webm)(\?|#|$)/i.test(e)}var h=`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7180' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21'/%3E%3C/svg%3E`;function g(e,t,n,r){let i=p(e);if(m(i)){let e=f(`video`,n);return e.src=i,e.muted=!0,e.loop=!0,e.autoplay=!0,e.playsInline=!0,r&&(e.onerror=()=>r(`the video can't be played (${e.error?.message||`unsupported format`})`)),e}let o=f(`img`,n);o.alt=t,o.decoding=`async`,o.referrerPolicy=`no-referrer`;let s=!1,c=``;return o.onerror=async()=>{if(!s&&i.startsWith(`http`)){s=!0;let e=await a(i);if(e.dataUrl){o.src=e.dataUrl;return}c=e.error||``}if(o.onerror=null,r){r(c||(i.startsWith(`data:`)?`the file is corrupted or isn't a supported image format`:`the page blocked the image and it could not be loaded another way`));return}o.src=h},o.src=i,o}function _(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(r.result),r.onerror=()=>n(r.error||Error(`Could not read file`)),r.readAsDataURL(e)})}function v(e){return e.replace(/\.[a-z0-9]+$/i,``).replace(/[-_]+/g,` `).replace(/\s+/g,` `).trim().replace(/\b\w/g,e=>e.toUpperCase())}var y=36e5,b=`memecord_giphy_usage`;async function x(){let e;try{e=typeof chrome<`u`&&chrome.storage?.local?(await chrome.storage.local.get(b))[b]:JSON.parse(localStorage.getItem(b)||`[]`)}catch{}let t=Date.now()-y;return Array.isArray(e)?e.filter(e=>typeof e==`number`&&e>t):[]}async function S(e){try{typeof chrome<`u`&&chrome.storage?.local?await chrome.storage.local.set({[b]:e}):localStorage.setItem(b,JSON.stringify(e))}catch{}}function C(e){let t=e.length,n=e.length?Math.min(...e):0;return{used:t,limit:100,remaining:Math.max(0,100-t),resetsInMs:n?Math.max(0,n+y-Date.now()):0}}async function w(){return C(await x())}async function T(){let e=await x();return e.push(Date.now()),await S(e),C(e)}async function E(){let e=await x(),t=Date.now();for(;e.length<100;)e.push(t);return await S(e),C(e)}function D(e){let t=Math.max(1,Math.ceil(e/6e4));return t<60?`${t} min`:`${Math.floor(t/60)}h ${t%60}m`}function O(e){let t=`${e.used} of ${e.limit} GIPHY calls used this hour`;return e.used===0?`${t} · ${e.limit} left`:e.remaining===0?`${t} · limit reached, resets in ${D(e.resetsInMs)}`:`${t} · ${e.remaining} left, oldest frees up in ${D(e.resetsInMs)}`}var k=`memecord_dock_anchor`,A=8,j=[{key:`top-center`,label:`Top`},{key:`top-right`,label:`Top right`},{key:`center`,label:`Center`},{key:`bottom-right`,label:`Bottom right`}],M=`1234567890QWERTYUIOPASDFGZXCVB`.split(``),N=null;function P(e=`pop`){try{let t=window.AudioContext||window.webkitAudioContext;if(!t)return;N||=new t;let n=N,r=n.createOscillator(),i=n.createGain();r.connect(i),i.connect(n.destination),r.type=`sine`;let[a,o,s,c]={pop:[440,880,.06,.08],minimize:[600,320,.05,.1],expand:[360,720,.05,.1],delete:[300,150,.07,.12]}[e],l=n.currentTime;r.frequency.setValueAtTime(a,l),r.frequency.exponentialRampToValueAtTime(o,l+c),i.gain.setValueAtTime(s,l),i.gain.exponentialRampToValueAtTime(.001,l+c),r.start(l),r.stop(l+c+.01)}catch{}}function F(e,n){return(e.hotkey||t(n)).toUpperCase()}var I=class{parent;element=null;pebble=null;gridContainer=null;addBtn=null;refreshBtn=null;searchInput=null;trendingMeta=null;tabButtons=new Map;view=`mine`;trendingFeed=null;trendingLoading=!1;trendingError=``;searchResults=[];usage;searchError=``;searchTimer=null;searchToken=0;editBtn=null;editBanner=null;contextMenu=null;activeModal=null;modalCleanup=null;isMinimized=!1;isEditMode=!1;isVisible=!1;searchQuery=``;currentPosition=`top-center`;memes=[];callbacks;firingTimers=new Map;anchor={right:20,bottom:104};docClickHandler=()=>this.closeContextMenu();resizeHandler=()=>this.applyAnchor();constructor(e,t,n,r=`top-center`,i=!1){this.parent=e,this.memes=t,this.callbacks=n,this.currentPosition=r,this.isMinimized=i,this.loadAnchor(),this.createDom(),this.render(),document.addEventListener(`click`,this.docClickHandler),window.addEventListener(`resize`,this.resizeHandler)}createDom(){let e=f(`div`,`memecord-deck`);e.setAttribute(`role`,`dialog`),e.setAttribute(`aria-label`,`Memecord meme deck`);let t=f(`div`,`memecord-deck-header`);t.title=`Drag to move`;let n=f(`img`,`memecord-deck-logo`);n.src=p(`icons/logo.png`),n.alt=``;let r=f(`div`,`memecord-deck-heading`);r.appendChild(f(`span`,`memecord-deck-title`,`Memecord`));let i=this.iconButton(`pencil`,`Edit keys & remove memes`);i.addEventListener(`click`,e=>{e.stopPropagation(),P(`pop`),this.setEditMode(!this.isEditMode)}),this.editBtn=i;let a=this.iconButton(`minus`,`Minimize (${s()})`);a.addEventListener(`click`,e=>{e.stopPropagation(),this.setMinimized(!0)}),t.append(n,r,i,a);let o=f(`div`,`memecord-tabs`);o.setAttribute(`role`,`tablist`),[[`mine`,`My memes`],[`trending`,`Trending`]].forEach(([e,t])=>{let n=f(`button`,`memecord-tab`);n.type=`button`,n.setAttribute(`role`,`tab`),e===`trending`&&(n.innerHTML=d(`flame`,14)),n.appendChild(f(`span`,``,t)),n.addEventListener(`click`,t=>{t.stopPropagation(),this.setView(e)}),this.tabButtons.set(e,n),o.appendChild(n)});let l=f(`div`,`memecord-toolbar`),u=f(`label`,`memecord-search`);u.innerHTML=d(`search`,14);let m=f(`input`);m.type=`search`,m.placeholder=`Search memes`,m.setAttribute(`aria-label`,`Search memes`),m.addEventListener(`input`,()=>{this.searchQuery=m.value.trim().toLowerCase(),this.renderCards(),this.view===`trending`&&this.scheduleTrendingSearch()}),this.searchInput=m,m.addEventListener(`keydown`,e=>{e.key===`Escape`&&(m.value=``,this.searchQuery=``,this.searchResults=[],this.renderCards(),m.blur())}),u.appendChild(m);let h=f(`button`,`memecord-btn primary`);h.type=`button`,h.innerHTML=`${d(`plus`,15)}<span>Add</span>`,h.title=`Add a GIF, image or video`,h.addEventListener(`click`,e=>{e.stopPropagation(),P(`pop`),this.setEditMode(!1),this.callbacks.onAddMeme()}),this.addBtn=h;let g=f(`button`,`memecord-btn`);g.type=`button`,g.innerHTML=d(`refresh`,15),g.title=`Refresh trending memes`,g.setAttribute(`aria-label`,`Refresh trending memes`),g.addEventListener(`click`,e=>{e.stopPropagation(),this.loadTrending(!0)}),this.refreshBtn=g,l.append(u,h,g);let _=f(`div`,`memecord-trending-meta`);this.trendingMeta=_;let v=f(`div`,`memecord-edit-banner`);v.appendChild(f(`span`,``,`Click a meme to change its key`));let y=f(`button`,`memecord-btn primary`,`Done`);y.type=`button`,y.addEventListener(`click`,e=>{e.stopPropagation(),this.setEditMode(!1)}),v.appendChild(y),v.style.display=`none`,this.editBanner=v;let b=f(`div`,`memecord-grid`);this.gridContainer=b;let x=f(`div`,`memecord-deck-footer`),S=f(`div`,`memecord-pos-group`);S.appendChild(f(`span`,`memecord-pos-label`,`Position`));let C=f(`div`,`memecord-pos-screen`);C.setAttribute(`role`,`radiogroup`),C.setAttribute(`aria-label`,`Where memes appear on your video`),j.forEach(e=>{let t=f(`button`,`memecord-pos-spot`);t.type=`button`,t.dataset.pos=e.key,t.title=`Show memes: ${e.label}`,t.setAttribute(`role`,`radio`),t.setAttribute(`aria-label`,e.label),t.addEventListener(`click`,t=>{t.stopPropagation(),this.setPosition(e.key),this.callbacks.onPositionChange?.(e.key)}),C.appendChild(t)}),S.appendChild(C);let w=f(`span`,`memecord-shortcut-hint`);w.title=c(),w.appendChild(f(`span`,`memecord-kbd`,s())),w.appendChild(f(`span`,``,`hide`)),x.append(S,w),e.append(t,o,l,v,_,b,x),this.bindDropTarget(e),this.bindDrag(e,t),this.parent.appendChild(e),this.element=e;let T=f(`button`,`memecord-pebble`);T.type=`button`,T.title=`Open Memecord (${c()})`;let E=f(`span`,`memecord-pebble-logo`),D=f(`img`);D.src=p(`icons/logo.png`),D.alt=``,E.append(D,f(`span`,`memecord-dot`)),T.append(E,f(`span`,``,`Memes`),f(`span`,`memecord-kbd`,s())),T.addEventListener(`click`,e=>{if(e.stopPropagation(),T.dataset.dragged===`1`){T.dataset.dragged=``;return}this.setMinimized(!1)}),this.bindDrag(T,T),this.parent.appendChild(T),this.pebble=T,this.setPosition(this.currentPosition),this.setView(`mine`),this.applyAnchor()}iconButton(e,t){let n=f(`button`,`memecord-icon-btn`);return n.type=`button`,n.title=t,n.setAttribute(`aria-label`,t),n.innerHTML=d(e,16),n}updateMemes(e){this.memes=e,this.renderCards()}setPosition(e){this.currentPosition=e,this.element?.querySelectorAll(`.memecord-pos-spot`).forEach(t=>{let n=t.dataset.pos===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-checked`,String(n))})}setCallMode(e){}markFiring(e,t){let n=this.gridContainer?.querySelector(`.memecord-card[data-meme-id="${CSS.escape(e)}"]`);this.firingTimers.forEach((e,t)=>{clearTimeout(e),this.gridContainer?.querySelector(`.memecord-card[data-meme-id="${CSS.escape(t)}"]`)?.classList.remove(`firing`)}),this.firingTimers.clear(),n&&(n.style.setProperty(`--mc-dur`,`${t}ms`),n.classList.remove(`firing`),n.offsetWidth,n.classList.add(`firing`),this.firingTimers.set(e,setTimeout(()=>{n.classList.remove(`firing`),this.firingTimers.delete(e)},t)))}isModalOpen(){return!!this.activeModal}setVisible(e){this.isVisible=e,e||(this.closeActiveModal(),this.closeContextMenu()),this.render()}setMinimized(e,t=!0){this.isMinimized!==e&&(this.isMinimized=e,e&&(this.closeActiveModal(),this.closeContextMenu(),this.setEditMode(!1)),t&&(P(e?`minimize`:`expand`),this.callbacks.onMinimizedChange?.(e)),!e&&this.element&&this.isVisible&&(this.element.classList.remove(`entering`),this.element.offsetWidth,this.element.classList.add(`entering`),setTimeout(()=>this.element?.classList.remove(`entering`),260)),this.render())}toggleMinimize(){this.setMinimized(!this.isMinimized)}render(){this.element&&(this.element.style.display=this.isVisible&&!this.isMinimized?`flex`:`none`),this.pebble&&(this.pebble.style.display=this.isVisible&&this.isMinimized?`flex`:`none`),this.applyAnchor()}setView(e){this.view=e,e===`trending`&&this.setEditMode(!1),this.tabButtons.forEach((t,n)=>{t.classList.toggle(`active`,n===e),t.setAttribute(`aria-selected`,String(n===e))}),this.addBtn&&(this.addBtn.style.display=e===`mine`?``:`none`),this.refreshBtn&&(this.refreshBtn.style.display=e===`trending`?``:`none`),this.editBtn&&(this.editBtn.style.visibility=e===`mine`?`visible`:`hidden`),this.searchInput&&(this.searchInput.placeholder=e===`trending`?`Search trending & GIFs`:`Search memes`),this.searchResults=[],e===`trending`&&this.searchQuery&&this.scheduleTrendingSearch(),e===`trending`&&!this.trendingFeed&&!this.trendingLoading&&this.loadTrending(!1),this.renderTrendingMeta(),this.renderCards(),this.gridContainer&&(this.gridContainer.scrollTop=0)}async loadTrending(e){if(this.callbacks.onLoadTrending&&!this.trendingLoading){this.trendingLoading=!0,this.trendingError=``,this.refreshBtn?.classList.add(`spinning`),this.renderTrendingMeta(),this.view===`trending`&&this.renderCards();try{this.trendingFeed=await this.callbacks.onLoadTrending(e),this.usage=this.trendingFeed.usage,this.trendingFeed.memes.length||(this.trendingError=this.trendingFeed.errors.join(`
`)||`The sources returned no usable memes right now.`)}catch(e){this.trendingError=e?.message||`Could not load trending memes.`}finally{this.trendingLoading=!1,this.refreshBtn?.classList.remove(`spinning`),this.renderTrendingMeta(),this.view===`trending`&&this.renderCards()}}}scheduleTrendingSearch(){this.searchTimer&&clearTimeout(this.searchTimer);let e=this.searchQuery,t=++this.searchToken;if(this.searchError=``,e.length<2||!this.callbacks.onSearchTrending){this.searchResults=[],this.renderTrendingMeta();return}this.searchTimer=setTimeout(async()=>{try{let n=await this.callbacks.onSearchTrending(e);if(t!==this.searchToken||this.view!==`trending`)return;this.searchResults=n?.memes||[],n?.usage&&(this.usage=n.usage)}catch(e){if(t!==this.searchToken)return;this.searchResults=[],this.searchError=e?.message||`GIPHY search failed`}this.renderTrendingMeta(),this.renderCards()},400)}renderTrendingMeta(){let e=this.trendingMeta;if(!e||(e.style.display=this.view===`trending`?`flex`:`none`,e.innerHTML=``,this.view!==`trending`))return;let t=this.trendingFeed;if(this.trendingLoading&&!t){e.appendChild(f(`span`,``,`Loading what's hot…`));return}if(!t)return;let n=t.sources.map(e=>e===`giphy`?`GIPHY`:`Reddit`);if(n.length&&e.appendChild(f(`span`,``,`Hot on ${n.join(` + `)} · ${L(t.fetchedAt)}`)),this.usage){let t=this.usage.remaining===0?`out`:this.usage.remaining<=20?`low`:``;e.appendChild(f(`span`,`memecord-usage ${t}`,O(this.usage)))}else e.appendChild(f(`span`,`memecord-trending-tip`,`Add a GIPHY key in settings for trending GIFs`));e.appendChild(f(`span`,`memecord-trending-tip`,`Reddit feed (meme-api.com): no published limit`)),[...t.memes.length?t.errors:[],...this.searchError?[this.searchError]:[]].forEach(t=>{let n=f(`span`,`memecord-trending-error`,t);n.setAttribute(`role`,`alert`),e.appendChild(n)})}renderCards(){if(!this.gridContainer)return;if(this.view===`trending`){this.renderTrendingCards();return}this.gridContainer.innerHTML=``;let e=this.memes.map((e,t)=>({meme:e,key:F(e,t)})).filter(({meme:e,key:t})=>!this.searchQuery||e.name.toLowerCase().includes(this.searchQuery)||t.toLowerCase()===this.searchQuery);if(e.length===0&&this.searchQuery){let e=f(`div`,`memecord-empty`);e.appendChild(f(`strong`,``,`No matches`)),e.appendChild(f(`span`,``,`Nothing called "${this.searchQuery}" yet.`)),this.gridContainer.appendChild(e);return}if(e.forEach(({meme:e,key:t})=>{let n=f(`button`,`memecord-card`);n.type=`button`,n.dataset.memeId=e.id,n.title=this.isEditMode?`Change key for "${e.name}"`:`Show "${e.name}" (press ${t||`no key`})`,n.setAttribute(`aria-label`,this.isEditMode?`Change key for ${e.name}`:`Show ${e.name}`);let r=f(`span`,`memecord-card-thumb`);if(r.appendChild(g(e.assetUrl,e.name)),t&&r.appendChild(f(`span`,`memecord-keycap`,t)),r.appendChild(f(`span`,`memecord-card-progress`)),n.appendChild(r),n.appendChild(f(`span`,`memecord-card-name`,e.name)),this.isEditMode){let t=f(`span`,`memecord-card-remove`);t.setAttribute(`role`,`button`),t.setAttribute(`aria-label`,`Remove ${e.name}`),t.title=`Remove "${e.name}"`,t.innerHTML=d(`x`,13),t.addEventListener(`click`,t=>{t.stopPropagation(),P(`delete`),this.callbacks.onDeleteMeme(e.id)}),n.appendChild(t)}n.addEventListener(`click`,t=>{t.stopPropagation(),P(`pop`),this.isEditMode?this.openKeybindingModal(e):this.callbacks.onTriggerMeme(e)}),n.addEventListener(`contextmenu`,n=>{n.preventDefault(),n.stopPropagation(),this.openContextMenu(n.clientX,n.clientY,e,t)}),this.gridContainer.appendChild(n)}),!this.searchQuery){let e=f(`button`,`memecord-card add-tile`);e.type=`button`,e.title=`Add a GIF, image or video — or drop one on the deck`;let t=f(`span`,`memecord-card-thumb`);t.innerHTML=`${d(`plus`,20)}<span>Add meme</span>`,e.appendChild(t),e.appendChild(f(`span`,`memecord-card-name`,`Drop a GIF here`)),e.addEventListener(`click`,e=>{e.stopPropagation(),P(`pop`),this.setEditMode(!1),this.callbacks.onAddMeme()}),this.gridContainer.appendChild(e)}}renderTrendingCards(){let e=this.gridContainer;e.innerHTML=``;let t=this.trendingFeed?.memes||[],n=this.searchQuery,r=n?t.filter(e=>e.name.toLowerCase().includes(n)):t,i=new Set(r.map(e=>e.id)),a=[...r,...this.searchResults.filter(e=>!i.has(e.id))];if(a.length===0){let t=f(`div`,`memecord-empty`);if(this.trendingLoading){for(let t=0;t<6;t++)e.appendChild(f(`div`,`memecord-skeleton`));return}if(n)t.appendChild(f(`strong`,``,this.searchError?`GIPHY search failed`:`No matches`)),t.appendChild(f(`span`,this.searchError?`memecord-trending-error`:``,this.searchError||`Nothing trending for "${n}".`));else{t.appendChild(f(`strong`,``,`Couldn't load trending memes`)),(this.trendingError||`Check your connection and try again.`).split(`
`).forEach(e=>{let n=f(`span`,`memecord-trending-error`,e);n.setAttribute(`role`,`alert`),t.appendChild(n)});let e=f(`button`,`memecord-btn`,`Try again`);e.type=`button`,e.addEventListener(`click`,e=>{e.stopPropagation(),this.loadTrending(!0)}),t.appendChild(e)}e.appendChild(t);return}a.forEach(t=>{let n=f(`button`,`memecord-card trending`);n.type=`button`,n.dataset.memeId=t.id,n.title=`Show "${t.name}" now`,n.setAttribute(`aria-label`,`Show ${t.name}`);let r=f(`span`,`memecord-card-thumb`);r.appendChild(g(t.thumbUrl||t.assetUrl,t.name)),r.appendChild(f(`span`,`memecord-source-tag ${t.source}`,t.source===`giphy`?`GIF`:`Reddit`)),r.appendChild(f(`span`,`memecord-card-progress`));let i=f(`span`,`memecord-card-save`);i.setAttribute(`role`,`button`),i.setAttribute(`aria-label`,`Save ${t.name} to my memes`),i.title=`Save to my memes with a key`,i.innerHTML=d(`plus`,14),i.addEventListener(`click`,e=>{e.stopPropagation(),P(`pop`),this.callbacks.onAddMeme({url:t.assetUrl,name:t.name})}),r.appendChild(i),n.appendChild(r),n.appendChild(f(`span`,`memecord-card-name`,t.name)),n.addEventListener(`click`,e=>{e.stopPropagation(),P(`pop`),this.callbacks.onTriggerTrending?.(t)}),e.appendChild(n)}),(this.trendingFeed?.sources.includes(`giphy`)||this.searchResults.length)&&e.appendChild(f(`div`,`memecord-attribution`,`Powered by GIPHY`))}setEditMode(e){this.isEditMode!==e&&(this.isEditMode=e,this.element?.classList.toggle(`edit-mode`,e),this.editBtn?.classList.toggle(`active`,e),this.editBtn?.setAttribute(`aria-pressed`,String(e)),this.editBanner&&(this.editBanner.style.display=e?`flex`:`none`),this.renderCards())}openKeybindingModal(e){this.closeActiveModal(),this.closeContextMenu();let t=this.memes.findIndex(t=>t.id===e.id),n=F(e,Math.max(0,t)),r=n,i=t=>this.memes.find((n,r)=>n.id!==e.id&&F(n,r)===t),a=f(`div`,`memecord-modal-backdrop`);a.dataset.memecordModal=`rebind`;let o=f(`div`,`memecord-modal`);o.setAttribute(`role`,`dialog`),o.setAttribute(`aria-modal`,`true`),o.setAttribute(`aria-label`,`Change key for ${e.name}`);let s=f(`div`,`memecord-modal-head`),c=f(`div`,`memecord-rebind-target`);c.appendChild(g(e.assetUrl,e.name,`memecord-preview-media`));let l=f(`div`);l.appendChild(f(`h2`,``,`Change key`)),l.appendChild(f(`p`,``,e.name)),c.appendChild(l);let u=this.iconButton(`x`,`Close`);s.append(c,u);let d=f(`div`,`memecord-key-capture`),p=f(`span`,`memecord-key-capture-key`,r||`–`);d.append(p,f(`span`,`memecord-key-capture-hint`,`Press any letter or number key`));let m=f(`div`,`memecord-hint`),h=f(`div`,`memecord-key-grid`);M.forEach(e=>{let t=i(e),n=f(`button`,`memecord-key-option${t?` taken`:``}`,e);n.type=`button`,n.dataset.key=e,n.title=t?`Used by "${t.name}"`:`Available`,h.appendChild(n)});let _=f(`div`,`memecord-modal-actions`),v=f(`button`,`memecord-btn`,`Cancel`);v.type=`button`;let y=f(`button`,`memecord-btn primary`,`Save`);y.type=`button`,_.append(v,y),o.append(s,d,m,h,_),a.appendChild(o);let b=e=>{r=e.toUpperCase(),p.textContent=r,h.querySelectorAll(`.memecord-key-option`).forEach(e=>{e.classList.toggle(`active`,e.dataset.key===r)});let t=i(r);d.classList.toggle(`clash`,!!t),y.disabled=!!t,t?(m.textContent=`${r} is already used by "${t.name}".`,m.className=`memecord-hint error`):(m.textContent=r===n?`This is the current key.`:`${r} is free.`,m.className=`memecord-hint success`)};b(r);let x=()=>{if(!r||i(r)){P(`delete`);return}r!==n&&this.callbacks.onUpdateHotkey?.(e.id,r),P(`pop`),this.closeActiveModal()};h.addEventListener(`click`,e=>{let t=e.target.closest(`.memecord-key-option`);t?.dataset.key&&(e.stopPropagation(),b(t.dataset.key))});let S=e=>{if(e.key===`Escape`){e.preventDefault(),e.stopPropagation(),this.closeActiveModal();return}if(e.key===`Enter`){e.preventDefault(),e.stopPropagation(),x();return}e.ctrlKey||e.metaKey||e.altKey||e.key.length===1&&/[a-z0-9]/i.test(e.key)&&(e.preventDefault(),e.stopPropagation(),b(e.key))};u.addEventListener(`click`,()=>this.closeActiveModal()),v.addEventListener(`click`,()=>this.closeActiveModal()),y.addEventListener(`click`,x),a.addEventListener(`mousedown`,e=>{e.target===a&&this.closeActiveModal()}),window.addEventListener(`keydown`,S,!0),this.parent.appendChild(a),this.activeModal=a,this.modalCleanup=()=>window.removeEventListener(`keydown`,S,!0),y.focus()}closeActiveModal(){this.modalCleanup?.(),this.modalCleanup=null,this.activeModal?.remove(),this.activeModal=null}openContextMenu(e,t,n,r){this.closeContextMenu();let i=f(`div`,`memecord-context-menu`);i.setAttribute(`role`,`menu`);let a=(e,t,n,r={})=>{let a=f(`button`,`memecord-menu-item${r.danger?` danger`:``}`);a.type=`button`,a.setAttribute(`role`,`menuitem`),a.innerHTML=d(e,15),a.appendChild(f(`span`,``,t)),r.kbd&&a.appendChild(f(`span`,`memecord-kbd`,r.kbd)),a.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),n()}),i.appendChild(a)};a(`play`,`Show now`,()=>this.callbacks.onTriggerMeme(n),{kbd:r||void 0}),a(`keyboard`,`Change key`,()=>this.openKeybindingModal(n)),a(`trash`,`Remove`,()=>{P(`delete`),this.callbacks.onDeleteMeme(n.id)},{danger:!0}),this.parent.appendChild(i);let o=i.getBoundingClientRect();i.style.left=`${Math.min(e,window.innerWidth-o.width-A)}px`,i.style.top=`${Math.min(t,window.innerHeight-o.height-A)}px`,this.contextMenu=i}closeContextMenu(){this.contextMenu?.remove(),this.contextMenu=null}bindDropTarget(e){let t=0,n=e=>{let t=Array.from(e.dataTransfer?.types||[]);return t.includes(`Files`)||t.includes(`text/uri-list`)};e.addEventListener(`dragenter`,r=>{n(r)&&(r.preventDefault(),t++,e.classList.add(`drop-target`))}),e.addEventListener(`dragover`,e=>{n(e)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`copy`))}),e.addEventListener(`dragleave`,()=>{t=Math.max(0,t-1),t===0&&e.classList.remove(`drop-target`)}),e.addEventListener(`drop`,r=>{if(!n(r))return;r.preventDefault(),t=0,e.classList.remove(`drop-target`);let i=Array.from(r.dataTransfer?.files||[]).find(e=>/^(image|video)\//.test(e.type)),a=(r.dataTransfer?.getData(`text/uri-list`)||``).split(`
`).find(e=>e&&!e.startsWith(`#`));(i||a)&&(this.setEditMode(!1),this.callbacks.onAddMeme(i?{file:i}:{url:a.trim()}))})}bindDrag(e,t){t.addEventListener(`mousedown`,n=>{if(n.button!==0)return;let r=n.target;if(t!==e&&r.closest(`button, input`))return;let i=n.clientX,a=n.clientY,o={...this.anchor},s=!1,c=t=>{let n=t.clientX-i,r=t.clientY-a;!s&&Math.abs(n)+Math.abs(r)<4||(s=!0,this.anchor={right:o.right-n,bottom:o.bottom-r},this.applyAnchor(e))},l=()=>{document.removeEventListener(`mousemove`,c),document.removeEventListener(`mouseup`,l),s&&(e===this.pebble&&(e.dataset.dragged=`1`),this.anchor=this.applyAnchor(e),this.saveAnchor())};document.addEventListener(`mousemove`,c),document.addEventListener(`mouseup`,l),t!==e&&n.preventDefault()})}applyAnchor(e){let t=e||(this.isMinimized?this.pebble:this.element),n=t?.offsetWidth||0,r=t?.offsetHeight||0,i=Math.max(A,window.innerWidth-n-A),a=Math.max(A,window.innerHeight-r-A),o=Math.round(Math.min(i,Math.max(A,this.anchor.right))),s=Math.round(Math.min(a,Math.max(A,this.anchor.bottom)));return[this.element,this.pebble].forEach(e=>{e&&(e.style.right=`${o}px`,e.style.bottom=`${s}px`)}),{right:o,bottom:s}}loadAnchor(){try{let e=JSON.parse(localStorage.getItem(k)||`null`);e&&typeof e.right==`number`&&typeof e.bottom==`number`&&(this.anchor={right:e.right,bottom:e.bottom})}catch{}}saveAnchor(){try{localStorage.setItem(k,JSON.stringify(this.anchor))}catch{}}destroy(){this.closeContextMenu(),this.closeActiveModal(),this.firingTimers.forEach(e=>clearTimeout(e)),this.firingTimers.clear(),this.searchTimer&&clearTimeout(this.searchTimer),document.removeEventListener(`click`,this.docClickHandler),window.removeEventListener(`resize`,this.resizeHandler),this.element?.remove(),this.element=null,this.pebble?.remove(),this.pebble=null}};function L(e){let t=Math.round((Date.now()-e)/6e4);return t<1?`just now`:t<60?`${t}m ago`:`${Math.round(t/60)}h ago`}var R=`/* Memecord HUD — single source of truth, injected at runtime via ?raw import */
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
  max-width: min(86vw, 560px);
  max-height: min(64vh, 460px);
  border-radius: 18px;
  border: 3px solid rgba(255, 255, 255, 0.95);
  object-fit: contain;
  background: #0b0d12;
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

.memecord-meme-caption {
  margin-top: 6px;
  max-width: min(86vw, 440px);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
  color: #fecaca;
  background: rgba(40, 16, 20, 0.92);
  border: 1px solid rgba(248, 113, 113, 0.45);
  padding: 6px 12px;
  border-radius: 12px;
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

/* View tabs */
.memecord-tabs {
  display: flex;
  gap: 4px;
  margin: 0 12px 10px;
  padding: 3px;
  border-radius: var(--mc-radius-sm);
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--mc-border);
}

.memecord-tab {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--mc-muted) !important;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.memecord-tab:hover { color: var(--mc-text) !important; }
.memecord-tab.active { background: var(--mc-surface-hover); color: var(--mc-text) !important; }
.memecord-tab.active svg { color: #fb923c; }
.memecord-tab:focus-visible { outline: 2px solid var(--mc-accent); outline-offset: 1px; }

/* Trending feed */
.memecord-trending-meta {
  flex-direction: column;
  gap: 2px;
  margin: -2px 14px 8px;
  font-size: 11px;
  color: var(--mc-muted);
}
.memecord-trending-tip { color: var(--mc-faint); }
.memecord-usage { color: var(--mc-muted); font-weight: 600; }
.memecord-usage.low { color: var(--mc-warn); }
.memecord-usage.out { color: var(--mc-danger); }
.memecord-trending-error {
  margin-top: 2px;
  padding: 6px 8px;
  border-radius: 8px;
  background: var(--mc-danger-soft);
  color: #fecaca;
  font-size: 11px;
  line-height: 1.4;
  user-select: text;
  text-align: left;
  white-space: normal;
  word-break: break-word;
}

.memecord-source-tag {
  position: absolute;
  left: 6px;
  bottom: 6px;
  padding: 2px 6px;
  border-radius: 5px;
  background: rgba(10, 11, 16, 0.86);
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fff;
}
.memecord-source-tag.reddit { color: #ff8b60; }
.memecord-source-tag.giphy { color: #a78bfa; }

.memecord-card-save {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--mc-accent-strong);
  color: #fff;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.memecord-card:hover .memecord-card-save,
.memecord-card:focus-visible .memecord-card-save { opacity: 1; transform: scale(1); }
.memecord-card-save:hover { filter: brightness(1.15); }
@media (hover: none) {
  .memecord-card-save { opacity: 1; transform: none; }
}

.memecord-skeleton {
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  background: linear-gradient(100deg, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 70%);
  background-size: 200% 100%;
  animation: memecord-shimmer 1.2s linear infinite;
}

@keyframes memecord-shimmer {
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}

.memecord-attribution {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4px 0 2px;
  font-size: 10.5px;
  font-weight: 650;
  color: var(--mc-faint);
}

.memecord-empty .memecord-btn { margin-top: 8px; height: 30px; }

.memecord-btn.spinning svg { animation: memecord-spin 0.8s linear infinite; }

@keyframes memecord-spin {
  to { transform: rotate(360deg); }
}

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
.memecord-pebble .memecord-pebble-logo .memecord-dot { color: var(--mc-live); }

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
.memecord-toast.error {
  align-items: flex-start;
  max-width: min(92vw, 520px);
  border-radius: 14px;
  border-color: rgba(248, 113, 113, 0.55);
  background: rgba(40, 16, 20, 0.96);
  color: #fecaca;
  white-space: normal;
  line-height: 1.4;
  user-select: text;
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
`,z=[{id:`thumbs_up`,name:`Thumbs Up`,emoji:`👍`,assetUrl:`memes/thumbs-up.gif`,hotkey:`1`,durationMs:2500},{id:`victory`,name:`Peace / Victory`,emoji:`✌️`,assetUrl:`memes/victory.gif`,hotkey:`2`,durationMs:2500},{id:`stop`,name:`Wait / Hold Up`,emoji:`🖐`,assetUrl:`memes/stop.gif`,hotkey:`3`,durationMs:2500},{id:`cinema`,name:`Absolute Cinema`,emoji:`🙌`,assetUrl:`memes/absolute-cinema.gif`,hotkey:`4`,durationMs:3e3},{id:`rock_on`,name:`Rock On / Headbang`,emoji:`🤘`,assetUrl:`memes/rock-on.gif`,hotkey:`5`,durationMs:2500},{id:`pointing`,name:`Big Brain / Roll Safe`,emoji:`☝️`,assetUrl:`memes/pointing.gif`,hotkey:`6`,durationMs:2500},{id:`noice`,name:`Noice (Michael Rosen)`,emoji:`👌`,assetUrl:`memes/noice.gif`,hotkey:`7`,durationMs:2200},{id:`fist`,name:`Arthur Fist`,emoji:`✊`,assetUrl:`memes/fist.gif`,hotkey:`8`,durationMs:2500},{id:`perfection`,name:`Chef Kiss / Perfection`,emoji:`✨`,assetUrl:`memes/perfection.gif`,hotkey:`9`,durationMs:2500}],ee=[...z,{id:`this_is_fine`,name:`This Is Fine`,emoji:`🔥`,assetUrl:`https://media.giphy.com/media/9M5jK4GXmD5o1irGrF/giphy.gif`},{id:`confused_travolta`,name:`Confused Travolta`,emoji:`🤷`,assetUrl:`https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif`},{id:`drake_yes`,name:`Drake Approves`,emoji:`😎`,assetUrl:`https://media.giphy.com/media/wWue0rCDOphOE/giphy.gif`},{id:`leonardo_cheers`,name:`Gatsby Toast`,emoji:`🥂`,assetUrl:`https://media.giphy.com/media/GCLlQnV7dXZ2E/giphy.gif`}],B={enabled:!0,dockVisible:!0,defaultDurationMs:2500,position:`top-center`,soundEnabled:!0,memes:z},V=`memecord_settings`,H=`mememeet_settings`;function U(){return typeof indexedDB>`u`?Promise.resolve(null):new Promise(e=>{try{let t=indexedDB.open(`memecord_db`,1);t.onupgradeneeded=()=>{let e=t.result;e.objectStoreNames.contains(`settings`)||e.createObjectStore(`settings`)},t.onsuccess=()=>e(t.result),t.onerror=()=>e(null)}catch{e(null)}})}async function W(e){let t=await U();return t?new Promise(n=>{try{let r=t.transaction(`settings`,`readonly`).objectStore(`settings`).get(e);r.onsuccess=()=>n(r.result??null),r.onerror=()=>n(null)}catch{n(null)}}):null}async function G(e,t){let n=await U();return n?new Promise(r=>{try{let i=n.transaction(`settings`,`readwrite`).objectStore(`settings`).put(t,e);i.onsuccess=()=>r(!0),i.onerror=()=>r(!1)}catch{r(!1)}}):!1}async function K(){try{if(typeof chrome<`u`&&chrome.storage&&chrome.storage.local){let e=await chrome.storage.local.get([V,H]),t=e?e[V]:void 0;if(!t&&e&&e[H]){t=e[H];try{await chrome.storage.local.set({[V]:t}),await chrome.storage.local.remove(H)}catch{}}if(t)return{...B,...t,memes:Array.isArray(t.memes)&&t.memes.length>0?t.memes:B.memes}}let e=await W(V);if(e)return{...B,...e,memes:Array.isArray(e.memes)&&e.memes.length>0?e.memes:B.memes};if(typeof localStorage<`u`){let e=localStorage.getItem(V);if(e||(e=localStorage.getItem(H),e&&(localStorage.setItem(V,e),localStorage.removeItem(H))),e){let t=JSON.parse(e);return{...B,...t,memes:Array.isArray(t.memes)&&t.memes.length>0?t.memes:B.memes}}}}catch(e){console.warn(`[Memecord] Failed to read settings, using defaults:`,e)}return B}async function q(e){let t={...await K(),...e};try{if(typeof chrome<`u`&&chrome.storage&&chrome.storage.local&&await chrome.storage.local.set({[V]:t}),await G(V,t),typeof localStorage<`u`)try{localStorage.setItem(V,JSON.stringify(t))}catch(e){console.warn(`[Memecord] LocalStorage quota exceeded, persisted via IndexedDB:`,e)}}catch(e){console.error(`[Memecord] Failed to save settings:`,e)}return t}function J(e,n,r){let i=n.trim().toUpperCase();if(i)return e.find((e,n)=>e.id!==r&&(e.hotkey||t(n)).trim().toUpperCase()===i)}async function Y(e){let t=await K(),n=(e.hotkey||``).trim().toUpperCase();if(n){let r=J(t.memes,n,e.id);if(r)throw Error(`Key [${n}] is already assigned to "${r.name}". Change old one first.`)}let r=t.memes.findIndex(t=>t.id===e.id),i;return r>=0?(i=[...t.memes],i[r]={...e,hotkey:n}):i=[...t.memes,{...e,hotkey:n}],q({memes:i})}async function X(e){return q({memes:(await K()).memes.filter(t=>t.id!==e)})}async function Z(e,t){let n=await K(),r=t.trim().toUpperCase();if(!r)throw Error(`Key cannot be empty`);let i=J(n.memes,r,e);if(i)throw Error(`Key [${r}] is already assigned to "${i.name}". Change old one first.`);return q({memes:n.memes.map(t=>t.id===e?{...t,hotkey:r}:t)})}var Q=[`memes`,`dankmemes`,`wholesomememes`],te=8388608,ne=/\.(gif|png|jpe?g|webp|mp4)(\?|$)/i;function re(e){return e.replace(/\s+GIF(\s+by\s+.*)?$/i,``).replace(/\s+/g,` `).trim().slice(0,60)}function ie(e){let t=e?.message||String(e);return e?.name===`AbortError`?`request timed out`:e instanceof TypeError?`network error (${t}) — check your connection, VPN or an ad blocker`:t}function ae(e,t){return`${e}: ${ie(t)}`}async function oe(){let e=await Promise.allSettled(Q.map(async e=>{let t;try{t=await fetch(`https://meme-api.com/gimme/${e}/50`)}catch(t){throw Object.assign(Error(ie(t)),{sub:e})}if(!t.ok){let n=t.status===429?` — meme-api.com is rate limiting you, try again in a few minutes`:``;throw Object.assign(Error(`HTTP ${t.status} ${t.statusText}`.trim()+n),{sub:e})}let n;try{n=await t.json()}catch{throw Object.assign(Error(`response wasn't valid JSON`),{sub:e})}return n.memes||[]})),t=new Map;e.forEach((e,n)=>{if(e.status!==`rejected`)return;let r=e.reason?.message||`request failed`;t.set(r,[...t.get(r)||[],`r/${Q[n]}`])});let n=[...t].map(([e,t])=>`${t.join(`, `)} via meme-api.com: ${e}`),r=new Set,i=[];if(e.forEach(e=>{e.status===`fulfilled`&&e.value.forEach(e=>{if(!e?.url||e.nsfw||e.spoiler||!ne.test(e.url)||r.has(e.url))return;r.add(e.url);let t=Array.isArray(e.preview)?e.preview:[];i.push({id:`reddit_${(e.postLink||e.url).split(`/`).pop()}`,name:re(e.title||`Reddit meme`)||`Reddit meme`,assetUrl:e.url,thumbUrl:t[Math.min(1,t.length-1)]||e.url,source:`reddit`,sourceUrl:e.postLink,score:Number(e.ups)||0})})}),i.length===0&&n.length>0)throw Error(n.join(` · `));return{memes:(await se(i.sort((e,t)=>t.score-e.score).slice(0,60))).slice(0,45),errors:n}}async function se(e){let t=await Promise.all(e.map(async e=>{let t=new AbortController,n=setTimeout(()=>t.abort(),4e3);try{let n=await fetch(e.assetUrl,{method:`HEAD`,signal:t.signal});return n.ok?!(Number(n.headers.get(`content-length`)||0)>te):!1}catch{return!0}finally{clearTimeout(n)}}));return e.filter((e,n)=>t[n])}async function ce(e,t){let n=await w();if(n.remaining===0)throw Error(`GIPHY free limit reached: ${n.used} of 100 calls used this hour. Resets in ${D(n.resetsInMs)}.`);let r=new URLSearchParams({api_key:e,limit:`45`,rating:`pg-13`,bundle:`messaging_non_clips`}),i=t?`search`:`trending`;t&&r.set(`q`,t);let a;try{a=await fetch(`https://api.giphy.com/v1/gifs/${i}?${r}`)}catch(e){throw Error(ae(`GIPHY`,e))}if(await T(),a.status===429){let e=await E();throw Error(`GIPHY HTTP 429: too many requests. A free key allows 100 calls per hour. Resets in about ${D(e.resetsInMs)}.`)}if(a.status===401||a.status===403)throw Error(`GIPHY rejected the API key (HTTP ${a.status}) — check the key in Memecord settings`);if(!a.ok)throw Error(`GIPHY HTTP ${a.status} ${a.statusText}`.trim());return((await a.json().catch(()=>{throw Error(`GIPHY response wasn't valid JSON`)})).data||[]).map((e,t)=>{let n=e.images||{};return{id:`giphy_${e.id}`,name:re(e.title||``)||`Trending GIF`,assetUrl:n.downsized?.url||n.original?.url,thumbUrl:n.fixed_width?.webp||n.fixed_width?.url||n.downsized?.url,source:`giphy`,sourceUrl:e.url,score:1e3-t}}).filter(e=>e.assetUrl)}function le(e){let t=[],n=Math.max(0,...e.map(e=>e.length));for(let r=0;r<n;r++)e.forEach(e=>{e[r]&&t.push(e[r])});return t}async function ue(e){let t=[[`reddit`,oe()]];e&&t.unshift([`giphy`,ce(e).then(e=>({memes:e,errors:[]}))]);let n=await Promise.allSettled(t.map(([,e])=>e)),r=[],i=[],a=[];return n.forEach((e,n)=>{e.status===`fulfilled`?(r.push(e.value.memes),i.push(t[n][0]),a.push(...e.value.errors)):a.push(e.reason?.message||`${t[n][0]} failed`)}),{memes:le(r),fetchedAt:Date.now(),sources:i,errors:a,usage:e?await w():void 0}}function de(){return typeof chrome<`u`&&!!(chrome.runtime?.id&&chrome.runtime.sendMessage)}async function $(e=!1){if(de()){let t=await chrome.runtime.sendMessage({type:`GET_TRENDING_MEMES`,force:e});if(t?.success)return t.feed;throw Error(t?.error||`Could not load trending memes`)}return ue()}async function fe(e){if(!de())return null;let t=await chrome.runtime.sendMessage({type:`SEARCH_GIPHY`,query:e});if(t?.success)return t.result;throw Error(t?.error||`GIPHY search failed`)}var pe=8388608,me=class{root=null;currentMemeBox=null;currentToast=null;currentModal=null;modalCleanup=null;hideTimeoutId=null;removeTimeoutId=null;toastTimeoutId=null;floatingDock=null;settings;callbacks;callMode=`local`;captionEl=null;delivered=!1;deliveryTimer=null;audioCtx=null;constructor(e,t={}){this.settings=e,this.callbacks=t,this.initRoot(),this.root&&(this.floatingDock=new I(this.root,this.settings.memes,{onTriggerMeme:e=>{this.callbacks.onTriggerMeme?this.callbacks.onTriggerMeme(e):this.showMeme(e)},onAddMeme:e=>{this.openQuickAddModal(e)},onTriggerTrending:e=>{let t=this.toMemeItem(e);this.callbacks.onTriggerMeme?this.callbacks.onTriggerMeme(t):this.showMeme(t)},onLoadTrending:e=>$(e),onSearchTrending:e=>fe(e),onDeleteMeme:e=>{let t=this.settings.memes.find(t=>t.id===e);this.callbacks.onDeleteMeme?.(e),this.showToast(`Removed "${t?.name||`meme`}"`)},onUpdateHotkey:async(e,t)=>{let n=this.settings.memes.find(t=>t.id===e);try{let r=await Z(e,t);this.updateSettings(r),this.callbacks.onUpdateHotkey?.(e,t),this.showToast(`"${n?.name||`Meme`}" is now on key ${t}`)}catch(e){this.showToast(e?.message||`Could not change key`)}},onMinimizedChange:e=>{this.callbacks.onDockMinimizedChange?.(e)},onPositionChange:e=>{this.settings.position=e,q({position:e}),this.showPositionPreview(e)}},this.settings.position,!this.settings.dockVisible))}toMemeItem(e){return{id:e.id,name:e.name,emoji:``,assetUrl:e.assetUrl,durationMs:this.settings.defaultDurationMs||2500}}updateSettings(e){this.settings=e,this.floatingDock?.updateMemes(e.memes),this.floatingDock?.setPosition(e.position),this.floatingDock?.setMinimized(!e.dockVisible,!1)}setDockVisible(e){this.floatingDock?.setVisible(e)}setDockMinimized(e){this.floatingDock?.setMinimized(e,!1)}setCameraLive(e){this.callMode=e?`live`:`local`,this.floatingDock?.setCallMode(this.callMode)}isCapturingKeyboard(){return!!this.currentModal||!!this.floatingDock?.isModalOpen()}showError(e){console.error(`[Memecord]`,e),this.showToast(e,8e3,`error`)}showToast(e,t=2500,n=`info`){if(!this.root)return;this.currentToast?.remove(),this.currentToast=null,this.toastTimeoutId&&=(clearTimeout(this.toastTimeoutId),null);let r=f(`div`,`memecord-toast${n===`error`?` error`:``}`,e);r.setAttribute(`role`,n===`error`?`alert`:`status`),this.root.appendChild(r),this.currentToast=r,requestAnimationFrame(()=>r.classList.add(`visible`)),this.toastTimeoutId=setTimeout(()=>{r.classList.remove(`visible`),r.classList.add(`hiding`),setTimeout(()=>{r.remove(),this.currentToast===r&&(this.currentToast=null)},300)},t)}showMeme(e){if(!this.root||!this.settings.enabled)return;this.settings.soundEnabled&&this.playTriggerSound(),this.hideTimeoutId&&clearTimeout(this.hideTimeoutId),this.removeTimeoutId&&clearTimeout(this.removeTimeoutId),this.deliveryTimer&&clearTimeout(this.deliveryTimer),this.hideTimeoutId=null,this.removeTimeoutId=null,this.currentMemeBox?.remove(),this.currentMemeBox=null;let t=e.durationMs||this.settings.defaultDurationMs||2500;this.floatingDock?.markFiring(e.id,t);let n=f(`div`,`memecord-meme-box ${this.getPositionClass(this.settings.position||`top-center`)}`);n.setAttribute(`aria-live`,`polite`);let r=g(e.assetUrl,e.name,`memecord-meme-image`,t=>{this.currentMemeBox===n&&this.hideMeme(),this.showError(`Couldn't show "${e.name}": ${t}`)}),i=f(`div`,`memecord-meme-title`,e.name),a=f(`div`,`memecord-meme-caption`);a.style.display=`none`,n.append(r,i,a),this.captionEl=a,this.root.appendChild(n),this.currentMemeBox=n,requestAnimationFrame(()=>n.classList.add(`visible`)),this.delivered=!1,this.deliveryTimer=setTimeout(()=>this.setDelivery(`none`,`no call connection was reported by this tab (reload the page if you just installed or updated Memecord)`),1500),this.hideTimeoutId=setTimeout(()=>{n.classList.remove(`visible`),n.classList.add(`hiding`),this.removeTimeoutId=setTimeout(()=>{n.remove(),this.currentMemeBox===n&&(this.currentMemeBox=null)},300)},t)}hideMeme(){this.hideTimeoutId&&clearTimeout(this.hideTimeoutId),this.removeTimeoutId&&clearTimeout(this.removeTimeoutId),this.deliveryTimer&&clearTimeout(this.deliveryTimer),this.hideTimeoutId=this.removeTimeoutId=this.deliveryTimer=null,this.currentMemeBox?.remove(),this.currentMemeBox=null}setDelivery(e,t){if(this.deliveryTimer&&=(clearTimeout(this.deliveryTimer),null),!this.captionEl||!this.currentMemeBox||(e!==`none`&&(this.delivered=!0),e===`none`&&this.delivered))return;let n=e===`none`;this.captionEl.style.display=n?``:`none`,this.captionEl.textContent=`Only you can see this — ${t||`couldn't reach the call`}`}showPositionPreview(e){this.showToast(`Memes will appear ${{"top-center":`top`,"top-right":`top right`,center:`center`,"bottom-right":`bottom right`}[e]} on your video`,1800)}openQuickAddModal(e={}){if(!this.root)return;this.closeModal();let t=n(this.settings.memes),i=new Set(this.settings.memes.map(e=>e.id)),a=new Set(this.settings.memes.map(e=>e.assetUrl)),o=e=>!i.has(e.id)&&!a.has(e.assetUrl),s=null,c=null,l=0,u=f(`div`,`memecord-modal-backdrop`);u.dataset.memecordModal=`add`;let p=f(`div`,`memecord-modal`);p.setAttribute(`role`,`dialog`),p.setAttribute(`aria-modal`,`true`),p.setAttribute(`aria-label`,`Add a meme`);let m=f(`div`,`memecord-modal-head`),h=f(`div`);h.appendChild(f(`h2`,``,`Add a meme`)),h.appendChild(f(`p`,``,`GIF, image or short video. Give it a key to fire it mid-call.`));let y=f(`button`,`memecord-icon-btn`);y.type=`button`,y.setAttribute(`aria-label`,`Close`),y.innerHTML=d(`x`,16),m.append(h,y);let b=f(`input`);b.type=`file`,b.accept=`image/gif,image/webp,image/png,image/jpeg,video/mp4,video/webm`,b.style.display=`none`;let x=f(`div`,`memecord-dropzone`);x.setAttribute(`role`,`button`),x.tabIndex=0,x.innerHTML=d(`upload`,20),x.appendChild(f(`strong`,``,`Upload or drop a file`)),x.appendChild(f(`span`,``,`GIF, WebP, PNG, JPG, MP4 · up to 8 MB`));let S=f(`div`,`memecord-field`),C=f(`label`,`memecord-label`,`Paste a link`);C.htmlFor=`memecord-add-url`;let w=f(`input`,`memecord-input`);w.id=`memecord-add-url`,w.type=`url`,w.placeholder=`Tenor, Giphy or direct .gif / .mp4 link`,w.autocomplete=`off`,S.append(C,w);let T=f(`div`,`memecord-field`),E=f(`span`,`memecord-label`,`Or pick what's trending`),D=f(`div`,`memecord-picks`);T.append(E,D);for(let e=0;e<6;e++)D.appendChild(f(`div`,`memecord-skeleton`));let O=e=>{if(D.innerHTML=``,e.length===0){T.style.display=`none`;return}e.slice(0,12).forEach(e=>{let t=f(`button`,`memecord-pick`);t.type=`button`,t.title=e.name,t.setAttribute(`aria-label`,e.name),t.appendChild(g(e.thumbUrl,e.name)),t.addEventListener(`click`,()=>{D.querySelectorAll(`.memecord-pick`).forEach(e=>e.classList.remove(`selected`)),t.classList.add(`selected`),w.value=``,N||(M.value=e.name),G({url:e.assetUrl,name:e.name},`Ready to add`)}),D.appendChild(t)})};$().then(e=>{let t=e.memes.filter(o);if(!t.length)throw Error(`empty`);O(t)}).catch(()=>{E.textContent=`Or pick a classic`,O(ee.filter(o).map(e=>({...e,thumbUrl:e.assetUrl})))});let k=f(`div`,`memecord-row`),A=f(`div`,`memecord-field`),j=f(`label`,`memecord-label`,`Name`);j.htmlFor=`memecord-add-name`;let M=f(`input`,`memecord-input`);M.id=`memecord-add-name`,M.type=`text`,M.placeholder=`e.g. Happy Cat`,M.maxLength=40,A.append(j,M);let N=!1;M.addEventListener(`input`,()=>{N=M.value.trim().length>0,W()});let P=f(`div`,`memecord-field key-field`),F=f(`label`,`memecord-label`,`Key`);F.htmlFor=`memecord-add-key`;let I=f(`input`,`memecord-input memecord-key-input`);I.id=`memecord-add-key`,I.type=`text`,I.readOnly=!0,I.value=t,I.title=`Click, then press a key`,P.append(F,I),k.append(A,P);let L=f(`div`,`memecord-hint`),R=f(`div`,`memecord-preview`);R.style.display=`none`;let z=f(`div`,`memecord-modal-actions`),B=f(`button`,`memecord-btn`,`Cancel`);B.type=`button`;let V=f(`button`,`memecord-btn primary`,`Add to deck`);V.type=`button`,V.disabled=!0,z.append(B,V),p.append(m,x,b,f(`div`,`memecord-divider`,`or`),S),p.appendChild(T),p.append(k,L,R,z),u.appendChild(p);let H=(e,t=``)=>{L.textContent=e,L.className=`memecord-hint${t?` ${t}`:``}`},U=()=>{let e=I.value.trim().toUpperCase(),t=e?J(this.settings.memes,e):void 0;return I.classList.toggle(`invalid`,!e||!!t),e?!t||(H(`${e} is already used by "${t.name}".`,`error`),!1):(H(`Pick a key for this meme.`,`error`),!1)},W=()=>{if(R.innerHTML=``,!s){R.style.display=`none`,V.disabled=!0;return}R.style.display=`flex`,R.appendChild(g(s.url,`Preview`,`memecord-preview-media`));let e=f(`div`,`memecord-preview-text`);e.appendChild(f(`strong`,``,M.value.trim()||s.name||`Untitled meme`)),e.appendChild(f(`span`,``,`Fires with key ${I.value||`—`}`)),R.appendChild(e),V.disabled=!U()},G=(e,t=``)=>{s=e,e?.name&&!N&&(M.value=e.name),t&&H(t,`success`),W(),e&&U()&&t&&H(t,`success`)},K=()=>{p.querySelectorAll(`.memecord-pick`).forEach(e=>e.classList.remove(`selected`))},q=async e=>{if(!/^(image|video)\//.test(e.type)){H(`That file isn't an image or video.`,`error`);return}if(e.size>pe){H(`That file is ${(e.size/1024/1024).toFixed(1)} MB — keep it under 8 MB.`,`error`);return}K(),w.value=``,H(`Reading file…`);try{let t=await _(e);G({url:t,name:v(e.name)},`Loaded ${e.name}`)}catch(e){H(e?.message||`Could not read that file.`,`error`)}},Y=e=>{K(),c&&clearTimeout(c);let t=e.trim();if(w.classList.remove(`invalid`),!t){G(null),H(``);return}H(`Checking link…`);let n=++l;c=setTimeout(async()=>{try{let e=await r(t);if(n!==l)return;G({url:e.url,name:e.name},`Link looks good`)}catch(e){if(n!==l)return;w.classList.add(`invalid`),G(null),H(e?.message||`That link doesn't look like a GIF or video.`,`error`)}},300)};x.addEventListener(`click`,()=>b.click()),x.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),b.click())}),b.addEventListener(`change`,()=>{let e=b.files?.[0];e&&q(e),b.value=``}),[`dragenter`,`dragover`].forEach(e=>x.addEventListener(e,e=>{e.preventDefault(),x.classList.add(`over`)})),x.addEventListener(`dragleave`,()=>x.classList.remove(`over`)),x.addEventListener(`drop`,e=>{e.preventDefault(),x.classList.remove(`over`);let t=e.dataTransfer?.files?.[0],n=e.dataTransfer?.getData(`text/uri-list`);t?q(t):n&&(w.value=n.split(`
`)[0].trim(),Y(w.value))}),w.addEventListener(`input`,()=>Y(w.value)),I.addEventListener(`keydown`,e=>{e.key!==`Tab`&&e.key!==`Escape`&&e.key!==`Enter`&&(e.preventDefault(),e.stopPropagation(),!(e.ctrlKey||e.metaKey||e.altKey)&&e.key.length===1&&/[a-z0-9]/i.test(e.key)&&(I.value=e.key.toUpperCase(),H(``),W(),U()&&H(`${I.value} is free.`,`success`)))});let X=async()=>{if(s&&U()){V.disabled=!0,V.textContent=`Adding…`;try{let e=I.value.trim().toUpperCase(),t=M.value.trim()||s.name||`Custom meme`,n={id:`meme_${Date.now()}`,name:t,emoji:``,assetUrl:s.url,hotkey:e,durationMs:this.settings.defaultDurationMs||2500};await this.callbacks.onAddMeme?.(n),this.closeModal(),this.showToast(`Added "${t}" — press ${e} to fire it`)}catch(e){H(e?.message||`Could not save this meme.`,`error`),V.disabled=!1,V.textContent=`Add to deck`}}};V.addEventListener(`click`,X),y.addEventListener(`click`,()=>this.closeModal()),B.addEventListener(`click`,()=>this.closeModal()),u.addEventListener(`mousedown`,e=>{e.target===u&&this.closeModal()}),p.addEventListener(`keydown`,e=>{e.key===`Escape`?(e.preventDefault(),this.closeModal()):e.key===`Enter`&&!V.disabled&&e.target?.tagName!==`BUTTON`&&(e.preventDefault(),X()),e.stopPropagation()});let Z=e=>e.stopPropagation();p.addEventListener(`keyup`,Z),p.addEventListener(`keypress`,Z),this.root.appendChild(u),this.currentModal=u,this.modalCleanup=()=>{c&&clearTimeout(c),l++},e.file?q(e.file):e.url&&(e.name&&(M.value=e.name,N=!0),w.value=e.url,Y(e.url)),w.focus()}closeModal(){this.modalCleanup?.(),this.modalCleanup=null,this.currentModal?.remove(),this.currentModal=null}playTriggerSound(){try{let e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.audioCtx=this.audioCtx||new e;let t=this.audioCtx,n=t.createOscillator(),r=t.createGain();n.type=`sine`,n.frequency.setValueAtTime(480,t.currentTime),n.frequency.exponentialRampToValueAtTime(960,t.currentTime+.1),r.gain.setValueAtTime(.12,t.currentTime),r.gain.exponentialRampToValueAtTime(.001,t.currentTime+.1),n.connect(r),r.connect(t.destination),n.start(),n.stop(t.currentTime+.11)}catch{}}getPositionClass(e){switch(e){case`center`:return`pos-center`;case`top-right`:return`pos-top-right`;case`bottom-right`:return`pos-bottom-right`;default:return`pos-top-center`}}initRoot(){if(!document.getElementById(`memecord-injected-styles`)){let e=document.createElement(`style`);e.id=`memecord-injected-styles`,e.textContent=R,(document.head||document.documentElement).appendChild(e)}let e=document.getElementById(`memecord-overlay-root`);e||(e=document.createElement(`div`),e.id=`memecord-overlay-root`,(document.body||document.documentElement).appendChild(e)),this.root=e}destroy(){this.hideTimeoutId&&clearTimeout(this.hideTimeoutId),this.removeTimeoutId&&clearTimeout(this.removeTimeoutId),this.toastTimeoutId&&clearTimeout(this.toastTimeoutId),this.floatingDock?.destroy(),this.floatingDock=null,this.closeModal(),this.deliveryTimer&&clearTimeout(this.deliveryTimer),this.audioCtx?.close().catch(()=>{}),this.audioCtx=null,this.root?.remove(),this.root=null}},he=class{overlay=null;settings=null;keydownHandler=null;isDestroyed=!1;isInCall=!1;isCameraStreaming=!1;isWebRtcConnected=!1;callCheckIntervalId=null;spaObserver=null;async init(){this.settings=await K(),this.ensureInjectedScript(),this.overlay=new me(this.settings,{onTriggerMeme:e=>{this.triggerMeme(e)},onAddMeme:async e=>{let t=await Y(e);this.settings=t,this.overlay?.updateSettings(t)},onDeleteMeme:async e=>{let t=await X(e);this.settings=t,this.overlay?.updateSettings(t)},onUpdateHotkey:(e,t)=>{this.settings&&(this.settings.memes=this.settings.memes.map(n=>n.id===e?{...n,hotkey:t}:n))},onDockMinimizedChange:e=>{this.settings&&(this.settings.dockVisible=!e,q({dockVisible:!e}))}}),this.overlay.setDockVisible(!1),this.registerKeyboardShortcuts(),this.setupListeners(),this.setupCallStateMonitoring(),this.checkCallState(),console.log(`[Memecord] Call-sensitive Overlay Controller initialized (supports cam & no-cam calls).`)}async triggerMeme(e){if(!this.settings||!this.settings.enabled||!this.isInCall)return!1;let{dataUrl:t,error:n}=await a(e.assetUrl);if(!t)return this.overlay?.showError(`Couldn't load "${e.name}": ${n||`unknown error`}`),!1;this.overlay?.showMeme({...e,assetUrl:t});let r={source:`MEMECORD_CONTENT`,type:`TRIGGER_CAMERA_MEME`,meme:{...e,assetUrl:t},position:this.settings.position||`center`};window.postMessage(r,`*`);try{document.querySelectorAll(`iframe`).forEach(e=>{try{e.contentWindow?.postMessage(r,`*`)}catch{}})}catch{}if(window.parent&&window.parent!==window)try{window.parent.postMessage(r,`*`)}catch{}return!0}isTestLab(){let e=window.location.href;return window.location.pathname.includes(`/test/`)||e.includes(`test/index.html`)||e.includes(`:4182`)||e.includes(`localhost:5173`)}isOngoingCall(){if(this.isTestLab()||this.isWebRtcConnected)return!0;let e=window.location.hostname,t=window.location.pathname;if(e.includes(`meet.google.com`)){if(!(/^\/[a-z]{3}-[a-z]{4}-[a-z]{3}/i.test(t)||t.includes(`/_meet/`)))return!1;let e=!!document.querySelector(`button[jsname="Qx7uuf"], button[aria-label*="Join" i], button[aria-label*="Ask to join" i], button[aria-label*="Unirse" i], button[aria-label*="Participer" i]`);return e||document.querySelector(`div[data-call-ended="true"], button[aria-label*="Rejoin" i]`)?!1:!!document.querySelector(`button[jsname="CQylAd"], button[jsname="B1qRre"], button[jsname="A17eec"], button[jsname="E90pfb"], button[aria-label*="Leave call" i], button[data-tooltip*="Leave call" i], button[aria-label*="End call" i], button[aria-label*="camera" i], button[aria-label*="cámara" i], button[aria-label*="kamera" i], button[aria-label*="microphone" i], button[aria-label*="micrófono" i], button[aria-label*="mikrofon" i], button[aria-label*="Raise hand" i], div[data-meeting-title], div[data-allocation-index], div[data-participant-id]`)||!e}return e.includes(`discord.com`)?!!document.querySelector(`div[class*="rtcConnectionStatus"], div[aria-label*="Voice Connected" i], div[class*="voiceUsers"], div[class*="connection_"], section[aria-label*="Voice" i], button[aria-label*="Disconnect" i], button[aria-label*="Leave Call" i], div[class*="videoGrid"], div[class*="callContainer"], div[class*="wrapperInCall"]`):e.includes(`zoom.us`)?!t.includes(`/wc/`)&&!t.includes(`/j/`)?!1:!!document.querySelector(`#foot-bar, .footer-button-container, button[aria-label*="Leave" i], button[aria-label*="End" i], button[aria-label*="audio" i], button[aria-label*="mute" i], button[aria-label*="video" i], #meeting-app, .meeting-app`):e.includes(`teams.microsoft.com`)||e.includes(`teams.live.com`)?!!document.querySelector(`button#hangup-button, button[id*="hangup"], button[aria-label*="Leave" i], button[aria-label*="Hang up" i], div[data-tid="call-controls"], div[id*="calling-bar"], div[class*="calling-unified-bar"]`):e.includes(`slack.com`)?!!document.querySelector(`button[data-qa*="leave" i], button[aria-label*="Leave call" i], div[data-qa*="huddle"], div[data-qa*="call_container"], div[class*="c-huddle"]`):e.includes(`facetime.apple.com`)?!!document.querySelector(`button[aria-label*="Leave" i], button[aria-label*="End" i], button[aria-label*="Camera" i], button[aria-label*="Microphone" i]`):e.includes(`web.whatsapp.com`)?!!document.querySelector(`div[data-testid="call-container"], button[aria-label*="End call" i], div[data-testid*="call"]`):!1}checkTimerId=null;scheduleCallCheck(){this.checkTimerId||=setTimeout(()=>{this.checkTimerId=null,this.checkCallState()},300)}getCallState(){return{inCall:this.isInCall}}checkCallState(){let e=this.isOngoingCall();e&&!this.isInCall?(this.isInCall=!0,console.log(`[Memecord] Ongoing call detected (cam or no-cam) -> showing HUD & enabling hotkeys`),this.overlay?.setDockVisible(!!this.settings?.enabled),this.overlay?.showToast(`Memecord is ready — press 1–9 to send a meme`)):!e&&this.isInCall&&(this.isInCall=!1,console.log(`[Memecord] Call ended / outside call -> hiding HUD`),this.overlay?.setDockVisible(!1),this.overlay?.hideMeme())}setupCallStateMonitoring(){window.addEventListener(`message`,e=>{e.data?.source===`MEMECORD_CAMERA`&&(e.data.type===`CALL_STREAM_STATE`?(this.isCameraStreaming=!!e.data.hasVideo,this.overlay?.setCameraLive(this.isCameraStreaming),this.checkCallState()):e.data.type===`CAMERA_CALL_STATE`?(this.isCameraStreaming=!!e.data.active,this.overlay?.setCameraLive(this.isCameraStreaming),this.checkCallState()):e.data.type===`MEME_DELIVERY`?this.overlay?.setDelivery(e.data.mode===`camera`||e.data.mode===`virtual`?e.data.mode:`none`,typeof e.data.reason==`string`?e.data.reason:void 0):e.data.type===`WEBRTC_CALL_STATE`&&(this.isWebRtcConnected=!!e.data.active,this.checkCallState()))}),this.callCheckIntervalId=setInterval(()=>{this.checkCallState()},1e3),this.spaObserver=new MutationObserver(()=>{this.scheduleCallCheck()});let e=document.body||document.documentElement;e&&this.spaObserver.observe(e,{childList:!0,subtree:!0})}ensureInjectedScript(){try{if(typeof chrome<`u`&&chrome.runtime?.getURL){let e=document.createElement(`script`);e.src=chrome.runtime.getURL(`inject.js`),e.onload=()=>e.remove(),(document.head||document.documentElement).appendChild(e)}}catch{}}registerKeyboardShortcuts(){this.keydownHandler=e=>{if(!this.settings||!this.settings.enabled||!this.isInCall||this.overlay?.isCapturingKeyboard())return;let n=document.activeElement;if(n&&(n.tagName===`INPUT`||n.tagName===`TEXTAREA`||n.isContentEditable||n.getAttribute(`role`)===`textbox`))return;if(l(e)){e.preventDefault();let t=!this.settings.dockVisible;q({dockVisible:t}),this.settings.dockVisible=t,this.overlay?.setDockMinimized(!t),this.overlay?.setDockVisible(!0),t||this.overlay?.showToast(`Memecord minimized — ${s()} to reopen`);return}if(e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;let r=e.key,i=this.settings.memes.find((e,n)=>{let i=e.hotkey||t(n);return i&&i.toLowerCase()===r.toLowerCase()});i&&(e.preventDefault(),console.log(`[Memecord] Hotkey [${r}] triggered: ${i.name}`),this.triggerMeme(i))},window.addEventListener(`keydown`,this.keydownHandler,!0)}setupListeners(){typeof chrome<`u`&&chrome.storage?.onChanged&&chrome.storage.onChanged.addListener((e,t)=>{let n=e.memecord_settings||e.mememeet_settings;if(t===`local`&&n){let e=n.newValue;e&&(this.settings=e,this.overlay?.updateSettings(e),this.overlay?.setDockVisible(this.isInCall&&e.enabled),window.postMessage({source:`MEMECORD_CONTENT`,type:`UPDATE_CAMERA_SETTINGS`,position:e.position||`center`},`*`))}}),typeof chrome<`u`&&chrome.runtime?.onMessage&&chrome.runtime.onMessage.addListener((e,t,n)=>{if(e.type===`GET_CALL_STATE`)return n(this.getCallState()),!0;if(e.type===`TRIGGER_MEME`){let t=this.settings?.memes.find(t=>t.id===e.memeId);return t?this.triggerMeme(t).then(e=>n({success:e,inCall:this.isInCall})):n({success:!1,inCall:this.isInCall}),!0}if(e.type===`TRIGGER_MEME_ITEM`)return this.triggerMeme(e.meme).then(e=>n({success:e,inCall:this.isInCall})),!0;if(e.type===`TOGGLE_DOCK`){if(this.settings){let e=!this.settings.dockVisible;this.settings.dockVisible=e,q({dockVisible:e}),this.overlay?.setDockMinimized(!e),this.overlay?.setDockVisible(this.isInCall&&this.settings.enabled),n({dockVisible:e})}return!0}return!1})}destroy(){this.isDestroyed||(this.isDestroyed=!0,this.callCheckIntervalId&&=(clearInterval(this.callCheckIntervalId),null),this.checkTimerId&&=(clearTimeout(this.checkTimerId),null),this.spaObserver&&=(this.spaObserver.disconnect(),null),this.keydownHandler&&=(window.removeEventListener(`keydown`,this.keydownHandler,!0),null),this.overlay&&=(this.overlay.destroy(),null))}};function ge(){if(window.__MEMECORD_INITIALIZED__)return;window.__MEMECORD_INITIALIZED__=!0;let e=new he;window.__MEMECORD_CONTROLLER__=e,document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>{e.init()}):e.init()}ge()})();