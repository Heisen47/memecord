import{a as e,c as t,d as n,f as r,i,l as a,m as o,n as s,o as c,p as l,r as u,s as d,t as f,u as p}from"./jsx-runtime-BWGIWDXd.js";import{n as m,t as h}from"./config-D_7DoMh8.js";var g=o(l(),1),_=o(r(),1),v=class{frames=[];totalDurationMs=0;isComplete=!1;hasFrames=!1;aborted=!1;async load(e){if(window.ImageDecoder===void 0)return!1;try{let t;if(e.startsWith(`data:`)){let n=e.indexOf(`,`);if(n!==-1){let r=e.slice(n+1),i=atob(r),a=i.length,o=new Uint8Array(a);for(let e=0;e<a;e++)o[e]=i.charCodeAt(e);t=o.buffer}else t=await(await fetch(e)).arrayBuffer()}else t=await(await fetch(e)).arrayBuffer();if(this.aborted)return!1;let n=e.includes(`webp`)?`image/webp`:`image/gif`,r=new window.ImageDecoder({data:t,type:n});if(await r.tracks.ready,this.aborted){try{r.close()}catch{}return!1}let i=r.tracks.selectedTrack,a=i?i.frameCount:0;try{let e=await r.decode({frameIndex:0});if(this.aborted){e.image.close();try{r.close()}catch{}return!1}let t=e.image.duration,n=t&&t>0?t/1e3:100,i=await createImageBitmap(e.image);e.image.close(),this.frames.push({bitmap:i,durationMs:n}),this.totalDurationMs+=n,this.hasFrames=!0}catch(e){console.warn(`[Memecord] First frame decode error:`,e);try{r.close()}catch{}return!1}if(a===1){this.isComplete=!0;try{r.close()}catch{}return!0}return(async()=>{let e=1;for(;!this.aborted&&e<120;)try{let t=await r.decode({frameIndex:e});if(this.aborted){t.image.close();break}let n=t.image.duration,i=n&&n>0?n/1e3:100,o=await createImageBitmap(t.image);if(t.image.close(),this.frames.push({bitmap:o,durationMs:i}),this.totalDurationMs+=i,e++,r.complete&&a>0&&e>=a)break}catch{break}this.isComplete=!0;try{r.close()}catch{}})(),!0}catch(e){return console.warn(`[Memecord] ImageDecoder init failed:`,e),!1}}getCurrentFrame(e){if(this.frames.length===0)return null;if(this.frames.length===1||this.totalDurationMs<=0)return this.frames[0].bitmap;let t=e%this.totalDurationMs,n=0;for(let e=0;e<this.frames.length;e++)if(n+=this.frames[e].durationMs,t<n)return this.frames[e].bitmap;return this.frames[this.frames.length-1].bitmap}destroy(){this.aborted=!0;for(let e of this.frames)try{e.bitmap.close()}catch{}this.frames=[]}};(function(){if(typeof window>`u`||window.__MEMECORD_CAMERA_INJECTED__)return;window.__MEMECORD_CAMERA_INJECTED__=!0,console.log(`[Memecord] Virtual Camera Compositor active in page context`);let e=null,t=`center`;function n(){let e=document.getElementById(`memecord-pipeline-container`);return e||(e=document.createElement(`div`),e.id=`memecord-pipeline-container`,e.setAttribute(`aria-hidden`,`true`),e.style.cssText=`position:fixed;bottom:0;right:0;width:4px;height:4px;opacity:0.01;pointer-events:none;overflow:hidden;z-index:-999999;contain:strict;`,(document.body||document.documentElement).appendChild(e)),e}function r(){if(e){try{e.gifPlayer&&e.gifPlayer.destroy(),e.videoEl&&(e.videoEl.pause(),e.videoEl.src=``,e.videoEl.remove()),e.objectUrl&&URL.revokeObjectURL(e.objectUrl),e.imgEl&&e.imgEl.remove()}catch{}e=null}}window.addEventListener(`message`,e=>{if(e.data&&e.data.source===`MEMECORD_CONTENT`){if(e.data.type===`TRIGGER_CAMERA_MEME`&&e.data.meme){let n=e.data.meme;i(n,e.data.position||t)}e.data.type===`UPDATE_CAMERA_SETTINGS`&&e.data.position&&(t=e.data.position)}});async function i(t,i){r();let a=t.assetUrl,o=a.startsWith(`data:video/`)||a.endsWith(`.mp4`)||a.endsWith(`.webm`),s=n(),c=null,l=null,u=null,d=null;if(o){let e=document.createElement(`video`);if(e.autoplay=!0,e.loop=!0,e.muted=!0,e.playsInline=!0,e.setAttribute(`playsinline`,`true`),e.setAttribute(`webkit-playsinline`,`true`),e.crossOrigin=`anonymous`,a.startsWith(`data:video/`))try{let t=await(await fetch(a)).blob();d=URL.createObjectURL(t),e.src=d}catch{e.src=a}else e.src=a;s.appendChild(e),e.play().catch(e=>console.warn(`[Memecord Camera] Video play error:`,e)),l=e}else{let e=new Image;a.startsWith(`data:`)||(e.crossOrigin=`anonymous`),e.src=a,s.appendChild(e),u=e,c=new v,c.load(a)}e={meme:t,startTime:performance.now(),durationMs:t.durationMs||2500,position:i,gifPlayer:c,videoEl:l,imgEl:u,objectUrl:d},console.log(`[Memecord Camera] Activated meme on camera feed: ${t.name} (${o?`Video`:`GIF/Image`})`)}let a=new Set,o=new Set,s=new Set,c=``;function l(){let e=!1;return s.forEach(t=>{t.readyState===`ended`?s.delete(t):t.enabled&&(e=!0)}),e}function u(){let e=a.size>0,t=o.size>0&&(s.size===0||l());c=`${e}|${t}`;let n=e||t;window.postMessage({source:`MEMECORD_CAMERA`,type:`CALL_STREAM_STATE`,active:n,hasAudio:e,hasVideo:t},`*`),window.postMessage({source:`MEMECORD_CAMERA`,type:`CAMERA_CALL_STATE`,active:t},`*`)}setInterval(()=>{s.size!==0&&`${a.size>0}|${o.size>0&&l()}`!==c&&u()},1e3);function d(e){e&&(e.getAudioTracks().forEach(e=>{a.add(e.id),u();let t=e.stop.bind(e);e.stop=()=>{a.delete(e.id),u(),t()},e.addEventListener(`ended`,()=>{a.delete(e.id),u()})}),e.getVideoTracks().forEach(e=>{o.add(e.id),u();let t=e.stop.bind(e);e.stop=()=>{o.delete(e.id),u(),t()},e.addEventListener(`ended`,()=>{o.delete(e.id),u()})}))}if(typeof window<`u`&&window.RTCPeerConnection)try{let e=window.RTCPeerConnection,t=new Set,n=()=>{window.postMessage({source:`MEMECORD_CAMERA`,type:`WEBRTC_CALL_STATE`,active:t.size>0},`*`)},r=function(...r){let i=new e(...r),a=()=>{let e=i.connectionState===`connected`||i.iceConnectionState===`connected`||i.iceConnectionState===`completed`,r=i.connectionState===`closed`||i.connectionState===`failed`||i.connectionState===`disconnected`||i.iceConnectionState===`closed`||i.iceConnectionState===`failed`||i.iceConnectionState===`disconnected`;e?(t.add(i),n()):r&&t.has(i)&&(t.delete(i),n())};i.addEventListener(`connectionstatechange`,a),i.addEventListener(`iceconnectionstatechange`,a);let o=i.close.bind(i);return i.close=function(){return t.delete(i),n(),o()},i};r.prototype=e.prototype,Object.assign(r,e),window.RTCPeerConnection=r}catch{}async function f(t,i){if(d(t),!i||!i.video)return t;let a=t.getVideoTracks()[0];if(!a)return t;console.log(`[Memecord Camera] Stamping virtual compositor onto webcam stream...`);let c=n(),l=document.createElement(`video`);l.autoplay=!0,l.muted=!0,l.playsInline=!0,l.setAttribute(`playsinline`,`true`),l.srcObject=new MediaStream([a]),c.appendChild(l),await new Promise(e=>{l.onloadedmetadata=()=>e(),setTimeout(e,600)}),await l.play().catch(()=>{});let f=document.createElement(`canvas`),m=l.videoWidth||1280,h=l.videoHeight||720;f.width=m,f.height=h,c.appendChild(f);let g=f.getContext(`2d`,{alpha:!1});if(!g)return t;let _=g,v=!0,y,b=performance.now();function x(){if(!v)return;b=performance.now(),l.videoWidth&&f.width!==l.videoWidth&&(f.width=l.videoWidth,f.height=l.videoHeight);let t=f.width,n=f.height;if(l.readyState>=2?_.drawImage(l,0,0,t,n):(_.fillStyle=`#0f172a`,_.fillRect(0,0,t,n)),e){let i=performance.now()-e.startTime;i>e.durationMs?r():p(_,t,n,e,i)}y=requestAnimationFrame(x)}x();let S=setInterval(()=>{if(!v){clearInterval(S);return}performance.now()-b>45&&x()},33),C=f.captureStream(30).getVideoTracks()[0],w=a.getSettings?a.getSettings():{},T=a.getCapabilities?a.getCapabilities():{};C.getSettings=()=>({...w,width:f.width,height:f.height,frameRate:30}),C.getCapabilities=()=>({...T}),C.getConstraints=()=>a.getConstraints?a.getConstraints():{},C.applyConstraints=async e=>{a.applyConstraints&&await a.applyConstraints(e)};try{Object.defineProperty(C,"label",{value:a.label||`Camera`,writable:!0})}catch{}let E=C.clone.bind(C);C.clone=()=>{let e=E();return e.getSettings=C.getSettings,e.getCapabilities=C.getCapabilities,e.getConstraints=C.getConstraints,e.applyConstraints=C.applyConstraints,s.add(e),e},s.add(C),o.add(C.id),o.add(a.id),u();let D=C.stop.bind(C);return C.stop=()=>{v=!1,cancelAnimationFrame(y),clearInterval(S),r(),a.stop(),l.srcObject=null,l.parentElement&&l.remove(),f.parentElement&&f.remove(),o.delete(a.id),o.delete(C.id),s.delete(C),u(),D()},a.onended=()=>{C.stop()},new MediaStream([C,...t.getAudioTracks()])}if(typeof navigator<`u`&&navigator.mediaDevices){let e=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices),t=async function(t){return f(await e(t),t)};navigator.mediaDevices.getUserMedia=t,window.MediaDevices&&window.MediaDevices.prototype&&(window.MediaDevices.prototype.getUserMedia=t)}if(typeof navigator<`u`){let e=navigator;if(e.getUserMedia){let t=e.getUserMedia.bind(e);e.getUserMedia=function(e,n,r){t(e,async t=>{n(await f(t,e))},r)}}if(e.webkitGetUserMedia){let t=e.webkitGetUserMedia.bind(e);e.webkitGetUserMedia=function(e,n,r){t(e,async t=>{n(await f(t,e))},r)}}}function p(e,t,n,r,i){let{meme:a,durationMs:o,position:s,gifPlayer:c,videoEl:l,imgEl:u}=r,d=null,f=400,p=300;if(l){if(l.paused&&l.readyState>=2&&l.play().catch(()=>{}),l.duration&&Number.isFinite(l.duration)&&l.duration>0){let e=i/1e3%l.duration;if(Math.abs(l.currentTime-e)>.4)try{l.currentTime=e}catch{}}l.readyState>=2&&l.videoWidth>0&&(d=l,f=l.videoWidth,p=l.videoHeight)}else if(c&&c.hasFrames){let e=c.getCurrentFrame(i);e&&(d=e,f=e.width,p=e.height)}if(!d&&u&&u.complete&&u.naturalWidth>0&&(d=u,f=u.naturalWidth,p=u.naturalHeight),!d)return;let h=1,g=1;if(i<160){let e=i/160;h=.6+.4*Math.sin(e*Math.PI/2),g=e}else if(i>o-200){let e=(o-i)/200;g=Math.max(0,e),h=.9+.1*e}e.save(),e.globalAlpha=Math.max(0,Math.min(1,g));let _=n*.52,v=t*.48,y=f/p,b=v,x=b/y;x>_&&(x=_,b=x*y);let S=b*h,C=x*h,w=(t-S)/2,T=(n-C)/2;switch(s){case`top-center`:w=(t-S)/2,T=n*.05;break;case`top-right`:w=t-S-t*.05,T=n*.05;break;case`bottom-right`:w=t-S-t*.05,T=n-C-n*.12;break;default:w=(t-S)/2,T=(n-C)/2-n*.03}e.shadowColor=`rgba(0, 0, 0, 0.7)`,e.shadowBlur=24,e.shadowOffsetX=0,e.shadowOffsetY=12,e.beginPath(),m(e,w,T,S,C,16),e.fillStyle=`#0f172a`,e.fill(),e.shadowColor=`transparent`,e.shadowBlur=0,e.save(),e.beginPath(),m(e,w,T,S,C,16),e.clip();try{e.drawImage(d,w,T,S,C)}catch(e){console.warn(`[Memecord Camera] Error drawing meme:`,e)}e.restore(),e.beginPath(),m(e,w,T,S,C,16),e.lineWidth=3.5,e.strokeStyle=`rgba(255, 255, 255, 0.9)`,e.stroke();let E=a.name;e.font=`bold ${Math.max(12,Math.round(n*.026))}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;let D=e.measureText(E).width+24,O=Math.max(22,Math.round(n*.04)),k=w+(S-D)/2,A=T+C+8;e.beginPath(),m(e,k,A,D,O,O/2),e.fillStyle=`rgba(15, 23, 42, 0.88)`,e.fill(),e.lineWidth=1,e.strokeStyle=`rgba(255, 255, 255, 0.2)`,e.stroke(),e.fillStyle=`#ffffff`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(E,k+D/2,A+O/2),e.restore()}function m(e,t,n,r,i,a){r<2*a&&(a=r/2),i<2*a&&(a=i/2),e.beginPath(),e.moveTo(t+a,n),e.arcTo(t+r,n,t+r,n+i,a),e.arcTo(t+r,n+i,t,n+i,a),e.arcTo(t,n+i,t,n,a),e.arcTo(t,n,t+r,n,a),e.closePath()}})();var y=typeof navigator<`u`&&(/Mac|iPhone|iPod|iPad/i.test(navigator.platform||``)||/Macintosh|Mac OS X/i.test(navigator.userAgent||``)),b=()=>y?`⌥⇧M`:`Alt+M`,x=()=>y?`⌥⇧M (Option+Shift+M)`:`Alt+M`,S=e=>{if(e.code!==`KeyM`&&e.key.toLowerCase()!==`m`&&e.key!==`µ`)return!1;if(y){let t=e.altKey&&e.shiftKey,n=e.altKey&&!e.metaKey&&!e.ctrlKey,r=e.ctrlKey&&e.shiftKey,i=e.metaKey&&e.shiftKey;return!!(t||n||r||i)}return!!(e.altKey||e.ctrlKey&&e.shiftKey)},C={plus:`<path d="M12 5v14M5 12h14"/>`,pencil:`<path d="M21.17 6.81a2.83 2.83 0 0 0-4-4L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/>`,minus:`<path d="M5 12h14"/>`,x:`<path d="M18 6 6 18M6 6l12 12"/>`,search:`<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>`,play:`<path d="M6 4v16a1 1 0 0 0 1.5.86l13-8a1 1 0 0 0 0-1.72l-13-8A1 1 0 0 0 6 4z"/>`,keyboard:`<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M10 13h4"/>`,trash:`<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>`,upload:`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>`,image:`<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>`};function w(e,t=16){return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${C[e]}</svg>`}function T(e,t,n){let r=document.createElement(e);return t&&(r.className=t),n!==void 0&&(r.textContent=n),r}function E(e){if(!e)return``;if(e.startsWith(`http://`)||e.startsWith(`https://`)||e.startsWith(`data:`))return e;if(typeof chrome<`u`&&chrome.runtime?.id&&chrome.runtime.getURL)try{return chrome.runtime.getURL(e.replace(/^\//,``))}catch{}return e.startsWith(`/`)?e:`/${e}`}function D(e){return e.startsWith(`data:video/`)||/\.(mp4|webm)(\?|#|$)/i.test(e)}var O=`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7180' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21'/%3E%3C/svg%3E`;function k(e,t,n){let r=E(e);if(D(r)){let e=T(`video`,n);return e.src=r,e.muted=!0,e.loop=!0,e.autoplay=!0,e.playsInline=!0,e}let i=T(`img`,n);i.alt=t,i.decoding=`async`,i.referrerPolicy=`no-referrer`;let o=!1;return i.onerror=async()=>{if(!o&&r.startsWith(`http`)){o=!0;let e=await a(r);if(e.startsWith(`data:`)){i.src=e;return}}i.onerror=null,i.src=O},i.src=r,i}function A(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(r.result),r.onerror=()=>n(r.error||Error(`Could not read file`)),r.readAsDataURL(e)})}function j(e){return e.replace(/\.[a-z0-9]+$/i,``).replace(/[-_]+/g,` `).replace(/\s+/g,` `).trim().replace(/\b\w/g,e=>e.toUpperCase())}var M=`memecord_dock_anchor`,N=8,P=[{key:`top-center`,label:`Top`},{key:`top-right`,label:`Top right`},{key:`center`,label:`Center`},{key:`bottom-right`,label:`Bottom right`}],F=`1234567890QWERTYUIOPASDFGZXCVB`.split(``),I=null;function L(e=`pop`){try{let t=window.AudioContext||window.webkitAudioContext;if(!t)return;I||=new t;let n=I,r=n.createOscillator(),i=n.createGain();r.connect(i),i.connect(n.destination),r.type=`sine`;let[a,o,s,c]={pop:[440,880,.06,.08],minimize:[600,320,.05,.1],expand:[360,720,.05,.1],delete:[300,150,.07,.12]}[e],l=n.currentTime;r.frequency.setValueAtTime(a,l),r.frequency.exponentialRampToValueAtTime(o,l+c),i.gain.setValueAtTime(s,l),i.gain.exponentialRampToValueAtTime(.001,l+c),r.start(l),r.stop(l+c+.01)}catch{}}function R(e,n){return(e.hotkey||t(n)).toUpperCase()}var z=class{parent;element=null;pebble=null;gridContainer=null;statusEl=null;editBtn=null;editBanner=null;contextMenu=null;activeModal=null;modalCleanup=null;isMinimized=!1;isEditMode=!1;isVisible=!1;searchQuery=``;callMode=`local`;currentPosition=`top-center`;memes=[];callbacks;firingTimers=new Map;anchor={right:20,bottom:104};docClickHandler=()=>this.closeContextMenu();resizeHandler=()=>this.applyAnchor();constructor(e,t,n,r=`top-center`,i=!1){this.parent=e,this.memes=t,this.callbacks=n,this.currentPosition=r,this.isMinimized=i,this.loadAnchor(),this.createDom(),this.render(),document.addEventListener(`click`,this.docClickHandler),window.addEventListener(`resize`,this.resizeHandler)}createDom(){let e=T(`div`,`memecord-deck`);e.setAttribute(`role`,`dialog`),e.setAttribute(`aria-label`,`Memecord meme deck`);let t=T(`div`,`memecord-deck-header`);t.title=`Drag to move`;let n=T(`img`,`memecord-deck-logo`);n.src=E(`icons/logo.png`),n.alt=``;let r=T(`div`,`memecord-deck-heading`);r.appendChild(T(`span`,`memecord-deck-title`,`Memecord`)),this.statusEl=T(`span`,`memecord-status`),r.appendChild(this.statusEl);let i=this.iconButton(`pencil`,`Edit keys & remove memes`);i.addEventListener(`click`,e=>{e.stopPropagation(),L(`pop`),this.setEditMode(!this.isEditMode)}),this.editBtn=i;let a=this.iconButton(`minus`,`Minimize (${b()})`);a.addEventListener(`click`,e=>{e.stopPropagation(),this.setMinimized(!0)}),t.append(n,r,i,a);let o=T(`div`,`memecord-toolbar`),s=T(`label`,`memecord-search`);s.innerHTML=w(`search`,14);let c=T(`input`);c.type=`search`,c.placeholder=`Search memes`,c.setAttribute(`aria-label`,`Search memes`),c.addEventListener(`input`,()=>{this.searchQuery=c.value.trim().toLowerCase(),this.renderCards()}),c.addEventListener(`keydown`,e=>{e.key===`Escape`&&(c.value=``,this.searchQuery=``,this.renderCards(),c.blur())}),s.appendChild(c);let l=T(`button`,`memecord-btn primary`);l.type=`button`,l.innerHTML=`${w(`plus`,15)}<span>Add</span>`,l.title=`Add a GIF, image or video`,l.addEventListener(`click`,e=>{e.stopPropagation(),L(`pop`),this.setEditMode(!1),this.callbacks.onAddMeme()}),o.append(s,l);let u=T(`div`,`memecord-edit-banner`);u.appendChild(T(`span`,``,`Click a meme to change its key`));let d=T(`button`,`memecord-btn primary`,`Done`);d.type=`button`,d.addEventListener(`click`,e=>{e.stopPropagation(),this.setEditMode(!1)}),u.appendChild(d),u.style.display=`none`,this.editBanner=u;let f=T(`div`,`memecord-grid`);this.gridContainer=f;let p=T(`div`,`memecord-deck-footer`),m=T(`div`,`memecord-pos-group`);m.appendChild(T(`span`,`memecord-pos-label`,`Position`));let h=T(`div`,`memecord-pos-screen`);h.setAttribute(`role`,`radiogroup`),h.setAttribute(`aria-label`,`Where memes appear on your video`),P.forEach(e=>{let t=T(`button`,`memecord-pos-spot`);t.type=`button`,t.dataset.pos=e.key,t.title=`Show memes: ${e.label}`,t.setAttribute(`role`,`radio`),t.setAttribute(`aria-label`,e.label),t.addEventListener(`click`,t=>{t.stopPropagation(),this.setPosition(e.key),this.callbacks.onPositionChange?.(e.key)}),h.appendChild(t)}),m.appendChild(h);let g=T(`span`,`memecord-shortcut-hint`);g.title=x(),g.appendChild(T(`span`,`memecord-kbd`,b())),g.appendChild(T(`span`,``,`hide`)),p.append(m,g),e.append(t,o,u,f,p),this.bindDropTarget(e),this.bindDrag(e,t),this.parent.appendChild(e),this.element=e;let _=T(`button`,`memecord-pebble`);_.type=`button`,_.title=`Open Memecord (${x()})`;let v=T(`span`,`memecord-pebble-logo`),y=T(`img`);y.src=E(`icons/logo.png`),y.alt=``,v.append(y,T(`span`,`memecord-dot`)),_.append(v,T(`span`,``,`Memes`),T(`span`,`memecord-kbd`,b())),_.addEventListener(`click`,e=>{if(e.stopPropagation(),_.dataset.dragged===`1`){_.dataset.dragged=``;return}this.setMinimized(!1)}),this.bindDrag(_,_),this.parent.appendChild(_),this.pebble=_,this.setPosition(this.currentPosition),this.setCallMode(this.callMode),this.renderCards(),this.applyAnchor()}iconButton(e,t){let n=T(`button`,`memecord-icon-btn`);return n.type=`button`,n.title=t,n.setAttribute(`aria-label`,t),n.innerHTML=w(e,16),n}updateMemes(e){this.memes=e,this.renderCards()}setPosition(e){this.currentPosition=e,this.element?.querySelectorAll(`.memecord-pos-spot`).forEach(t=>{let n=t.dataset.pos===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-checked`,String(n))})}setCallMode(e){this.callMode=e,this.statusEl&&(this.statusEl.className=`memecord-status ${e}`,this.statusEl.innerHTML=``,this.statusEl.appendChild(T(`span`,`memecord-dot`)),this.statusEl.appendChild(T(`span`,``,e===`live`?`Live on your camera`:`Camera off · only you see memes`))),this.pebble&&(this.pebble.classList.toggle(`live`,e===`live`),this.pebble.classList.toggle(`local`,e===`local`))}markFiring(e,t){let n=this.gridContainer?.querySelector(`.memecord-card[data-meme-id="${CSS.escape(e)}"]`);this.firingTimers.forEach((e,t)=>{clearTimeout(e),this.gridContainer?.querySelector(`.memecord-card[data-meme-id="${CSS.escape(t)}"]`)?.classList.remove(`firing`)}),this.firingTimers.clear(),n&&(n.style.setProperty(`--mc-dur`,`${t}ms`),n.classList.remove(`firing`),n.offsetWidth,n.classList.add(`firing`),this.firingTimers.set(e,setTimeout(()=>{n.classList.remove(`firing`),this.firingTimers.delete(e)},t)))}isModalOpen(){return!!this.activeModal}setVisible(e){this.isVisible=e,e||(this.closeActiveModal(),this.closeContextMenu()),this.render()}setMinimized(e,t=!0){this.isMinimized!==e&&(this.isMinimized=e,e&&(this.closeActiveModal(),this.closeContextMenu(),this.setEditMode(!1)),t&&(L(e?`minimize`:`expand`),this.callbacks.onMinimizedChange?.(e)),!e&&this.element&&this.isVisible&&(this.element.classList.remove(`entering`),this.element.offsetWidth,this.element.classList.add(`entering`),setTimeout(()=>this.element?.classList.remove(`entering`),260)),this.render())}toggleMinimize(){this.setMinimized(!this.isMinimized)}render(){this.element&&(this.element.style.display=this.isVisible&&!this.isMinimized?`flex`:`none`),this.pebble&&(this.pebble.style.display=this.isVisible&&this.isMinimized?`flex`:`none`),this.applyAnchor()}renderCards(){if(!this.gridContainer)return;this.gridContainer.innerHTML=``;let e=this.memes.map((e,t)=>({meme:e,key:R(e,t)})).filter(({meme:e,key:t})=>!this.searchQuery||e.name.toLowerCase().includes(this.searchQuery)||t.toLowerCase()===this.searchQuery);if(e.length===0&&this.searchQuery){let e=T(`div`,`memecord-empty`);e.appendChild(T(`strong`,``,`No matches`)),e.appendChild(T(`span`,``,`Nothing called "${this.searchQuery}" yet.`)),this.gridContainer.appendChild(e);return}if(e.forEach(({meme:e,key:t})=>{let n=T(`button`,`memecord-card`);n.type=`button`,n.dataset.memeId=e.id,n.title=this.isEditMode?`Change key for "${e.name}"`:`Show "${e.name}" (press ${t||`no key`})`,n.setAttribute(`aria-label`,this.isEditMode?`Change key for ${e.name}`:`Show ${e.name}`);let r=T(`span`,`memecord-card-thumb`);if(r.appendChild(k(e.assetUrl,e.name)),t&&r.appendChild(T(`span`,`memecord-keycap`,t)),r.appendChild(T(`span`,`memecord-card-progress`)),n.appendChild(r),n.appendChild(T(`span`,`memecord-card-name`,e.name)),this.isEditMode){let t=T(`span`,`memecord-card-remove`);t.setAttribute(`role`,`button`),t.setAttribute(`aria-label`,`Remove ${e.name}`),t.title=`Remove "${e.name}"`,t.innerHTML=w(`x`,13),t.addEventListener(`click`,t=>{t.stopPropagation(),L(`delete`),this.callbacks.onDeleteMeme(e.id)}),n.appendChild(t)}n.addEventListener(`click`,t=>{t.stopPropagation(),L(`pop`),this.isEditMode?this.openKeybindingModal(e):this.callbacks.onTriggerMeme(e)}),n.addEventListener(`contextmenu`,n=>{n.preventDefault(),n.stopPropagation(),this.openContextMenu(n.clientX,n.clientY,e,t)}),this.gridContainer.appendChild(n)}),!this.searchQuery){let e=T(`button`,`memecord-card add-tile`);e.type=`button`,e.title=`Add a GIF, image or video — or drop one on the deck`;let t=T(`span`,`memecord-card-thumb`);t.innerHTML=`${w(`plus`,20)}<span>Add meme</span>`,e.appendChild(t),e.appendChild(T(`span`,`memecord-card-name`,`Drop a GIF here`)),e.addEventListener(`click`,e=>{e.stopPropagation(),L(`pop`),this.setEditMode(!1),this.callbacks.onAddMeme()}),this.gridContainer.appendChild(e)}}setEditMode(e){this.isEditMode!==e&&(this.isEditMode=e,this.element?.classList.toggle(`edit-mode`,e),this.editBtn?.classList.toggle(`active`,e),this.editBtn?.setAttribute(`aria-pressed`,String(e)),this.editBanner&&(this.editBanner.style.display=e?`flex`:`none`),this.renderCards())}openKeybindingModal(e){this.closeActiveModal(),this.closeContextMenu();let t=this.memes.findIndex(t=>t.id===e.id),n=R(e,Math.max(0,t)),r=n,i=t=>this.memes.find((n,r)=>n.id!==e.id&&R(n,r)===t),a=T(`div`,`memecord-modal-backdrop`);a.dataset.memecordModal=`rebind`;let o=T(`div`,`memecord-modal`);o.setAttribute(`role`,`dialog`),o.setAttribute(`aria-modal`,`true`),o.setAttribute(`aria-label`,`Change key for ${e.name}`);let s=T(`div`,`memecord-modal-head`),c=T(`div`,`memecord-rebind-target`);c.appendChild(k(e.assetUrl,e.name,`memecord-preview-media`));let l=T(`div`);l.appendChild(T(`h2`,``,`Change key`)),l.appendChild(T(`p`,``,e.name)),c.appendChild(l);let u=this.iconButton(`x`,`Close`);s.append(c,u);let d=T(`div`,`memecord-key-capture`),f=T(`span`,`memecord-key-capture-key`,r||`–`);d.append(f,T(`span`,`memecord-key-capture-hint`,`Press any letter or number key`));let p=T(`div`,`memecord-hint`),m=T(`div`,`memecord-key-grid`);F.forEach(e=>{let t=i(e),n=T(`button`,`memecord-key-option${t?` taken`:``}`,e);n.type=`button`,n.dataset.key=e,n.title=t?`Used by "${t.name}"`:`Available`,m.appendChild(n)});let h=T(`div`,`memecord-modal-actions`),g=T(`button`,`memecord-btn`,`Cancel`);g.type=`button`;let _=T(`button`,`memecord-btn primary`,`Save`);_.type=`button`,h.append(g,_),o.append(s,d,p,m,h),a.appendChild(o);let v=e=>{r=e.toUpperCase(),f.textContent=r,m.querySelectorAll(`.memecord-key-option`).forEach(e=>{e.classList.toggle(`active`,e.dataset.key===r)});let t=i(r);d.classList.toggle(`clash`,!!t),_.disabled=!!t,t?(p.textContent=`${r} is already used by "${t.name}".`,p.className=`memecord-hint error`):(p.textContent=r===n?`This is the current key.`:`${r} is free.`,p.className=`memecord-hint success`)};v(r);let y=()=>{if(!r||i(r)){L(`delete`);return}r!==n&&this.callbacks.onUpdateHotkey?.(e.id,r),L(`pop`),this.closeActiveModal()};m.addEventListener(`click`,e=>{let t=e.target.closest(`.memecord-key-option`);t?.dataset.key&&(e.stopPropagation(),v(t.dataset.key))});let b=e=>{if(e.key===`Escape`){e.preventDefault(),e.stopPropagation(),this.closeActiveModal();return}if(e.key===`Enter`){e.preventDefault(),e.stopPropagation(),y();return}e.ctrlKey||e.metaKey||e.altKey||e.key.length===1&&/[a-z0-9]/i.test(e.key)&&(e.preventDefault(),e.stopPropagation(),v(e.key))};u.addEventListener(`click`,()=>this.closeActiveModal()),g.addEventListener(`click`,()=>this.closeActiveModal()),_.addEventListener(`click`,y),a.addEventListener(`mousedown`,e=>{e.target===a&&this.closeActiveModal()}),window.addEventListener(`keydown`,b,!0),this.parent.appendChild(a),this.activeModal=a,this.modalCleanup=()=>window.removeEventListener(`keydown`,b,!0),_.focus()}closeActiveModal(){this.modalCleanup?.(),this.modalCleanup=null,this.activeModal?.remove(),this.activeModal=null}openContextMenu(e,t,n,r){this.closeContextMenu();let i=T(`div`,`memecord-context-menu`);i.setAttribute(`role`,`menu`);let a=(e,t,n,r={})=>{let a=T(`button`,`memecord-menu-item${r.danger?` danger`:``}`);a.type=`button`,a.setAttribute(`role`,`menuitem`),a.innerHTML=w(e,15),a.appendChild(T(`span`,``,t)),r.kbd&&a.appendChild(T(`span`,`memecord-kbd`,r.kbd)),a.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),n()}),i.appendChild(a)};a(`play`,`Show now`,()=>this.callbacks.onTriggerMeme(n),{kbd:r||void 0}),a(`keyboard`,`Change key`,()=>this.openKeybindingModal(n)),a(`trash`,`Remove`,()=>{L(`delete`),this.callbacks.onDeleteMeme(n.id)},{danger:!0}),this.parent.appendChild(i);let o=i.getBoundingClientRect();i.style.left=`${Math.min(e,window.innerWidth-o.width-N)}px`,i.style.top=`${Math.min(t,window.innerHeight-o.height-N)}px`,this.contextMenu=i}closeContextMenu(){this.contextMenu?.remove(),this.contextMenu=null}bindDropTarget(e){let t=0,n=e=>{let t=Array.from(e.dataTransfer?.types||[]);return t.includes(`Files`)||t.includes(`text/uri-list`)};e.addEventListener(`dragenter`,r=>{n(r)&&(r.preventDefault(),t++,e.classList.add(`drop-target`))}),e.addEventListener(`dragover`,e=>{n(e)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`copy`))}),e.addEventListener(`dragleave`,()=>{t=Math.max(0,t-1),t===0&&e.classList.remove(`drop-target`)}),e.addEventListener(`drop`,r=>{if(!n(r))return;r.preventDefault(),t=0,e.classList.remove(`drop-target`);let i=Array.from(r.dataTransfer?.files||[]).find(e=>/^(image|video)\//.test(e.type)),a=(r.dataTransfer?.getData(`text/uri-list`)||``).split(`
`).find(e=>e&&!e.startsWith(`#`));(i||a)&&(this.setEditMode(!1),this.callbacks.onAddMeme(i?{file:i}:{url:a.trim()}))})}bindDrag(e,t){t.addEventListener(`mousedown`,n=>{if(n.button!==0)return;let r=n.target;if(t!==e&&r.closest(`button, input`))return;let i=n.clientX,a=n.clientY,o={...this.anchor},s=!1,c=t=>{let n=t.clientX-i,r=t.clientY-a;!s&&Math.abs(n)+Math.abs(r)<4||(s=!0,this.anchor={right:o.right-n,bottom:o.bottom-r},this.applyAnchor(e))},l=()=>{document.removeEventListener(`mousemove`,c),document.removeEventListener(`mouseup`,l),s&&(e===this.pebble&&(e.dataset.dragged=`1`),this.anchor=this.applyAnchor(e),this.saveAnchor())};document.addEventListener(`mousemove`,c),document.addEventListener(`mouseup`,l),t!==e&&n.preventDefault()})}applyAnchor(e){let t=e||(this.isMinimized?this.pebble:this.element),n=t?.offsetWidth||0,r=t?.offsetHeight||0,i=Math.max(N,window.innerWidth-n-N),a=Math.max(N,window.innerHeight-r-N),o=Math.round(Math.min(i,Math.max(N,this.anchor.right))),s=Math.round(Math.min(a,Math.max(N,this.anchor.bottom)));return[this.element,this.pebble].forEach(e=>{e&&(e.style.right=`${o}px`,e.style.bottom=`${s}px`)}),{right:o,bottom:s}}loadAnchor(){try{let e=JSON.parse(localStorage.getItem(M)||`null`);e&&typeof e.right==`number`&&typeof e.bottom==`number`&&(this.anchor={right:e.right,bottom:e.bottom})}catch{}}saveAnchor(){try{localStorage.setItem(M,JSON.stringify(this.anchor))}catch{}}destroy(){this.closeContextMenu(),this.closeActiveModal(),this.firingTimers.forEach(e=>clearTimeout(e)),this.firingTimers.clear(),document.removeEventListener(`click`,this.docClickHandler),window.removeEventListener(`resize`,this.resizeHandler),this.element?.remove(),this.element=null,this.pebble?.remove(),this.pebble=null}},B=`/* Memecord HUD — single source of truth, injected at runtime via ?raw import */
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
`,V=8388608,H=class{root=null;currentMemeBox=null;currentToast=null;currentModal=null;modalCleanup=null;hideTimeoutId=null;removeTimeoutId=null;toastTimeoutId=null;floatingDock=null;settings;callbacks;callMode=`local`;audioCtx=null;constructor(e,t={}){this.settings=e,this.callbacks=t,this.initRoot(),this.root&&(this.floatingDock=new z(this.root,this.settings.memes,{onTriggerMeme:e=>{this.callbacks.onTriggerMeme?this.callbacks.onTriggerMeme(e):this.showMeme(e)},onAddMeme:e=>{this.openQuickAddModal(e)},onDeleteMeme:e=>{let t=this.settings.memes.find(t=>t.id===e);this.callbacks.onDeleteMeme?.(e),this.showToast(`Removed "${t?.name||`meme`}"`)},onUpdateHotkey:async(e,t)=>{let n=this.settings.memes.find(t=>t.id===e);try{let r=await d(e,t);this.updateSettings(r),this.callbacks.onUpdateHotkey?.(e,t),this.showToast(`"${n?.name||`Meme`}" is now on key ${t}`)}catch(e){this.showToast(e?.message||`Could not change key`)}},onMinimizedChange:e=>{this.callbacks.onDockMinimizedChange?.(e)},onPositionChange:e=>{this.settings.position=e,c({position:e}),this.showPositionPreview(e)}},this.settings.position,!this.settings.dockVisible))}updateSettings(e){this.settings=e,this.floatingDock?.updateMemes(e.memes),this.floatingDock?.setPosition(e.position),this.floatingDock?.setMinimized(!e.dockVisible,!1)}setDockVisible(e){this.floatingDock?.setVisible(e)}setDockMinimized(e){this.floatingDock?.setMinimized(e,!1)}setCameraLive(e){this.callMode=e?`live`:`local`,this.floatingDock?.setCallMode(this.callMode)}isCapturingKeyboard(){return!!this.currentModal||!!this.floatingDock?.isModalOpen()}showToast(e,t=2500){if(!this.root)return;this.currentToast?.remove(),this.currentToast=null,this.toastTimeoutId&&=(clearTimeout(this.toastTimeoutId),null);let n=T(`div`,`memecord-toast`,e);n.setAttribute(`role`,`status`),this.root.appendChild(n),this.currentToast=n,requestAnimationFrame(()=>n.classList.add(`visible`)),this.toastTimeoutId=setTimeout(()=>{n.classList.remove(`visible`),n.classList.add(`hiding`),setTimeout(()=>{n.remove(),this.currentToast===n&&(this.currentToast=null)},300)},t)}showMeme(e){if(!this.root||!this.settings.enabled)return;this.settings.soundEnabled&&this.playTriggerSound(),this.hideTimeoutId&&clearTimeout(this.hideTimeoutId),this.removeTimeoutId&&clearTimeout(this.removeTimeoutId),this.hideTimeoutId=null,this.removeTimeoutId=null,this.currentMemeBox?.remove(),this.currentMemeBox=null;let t=e.durationMs||this.settings.defaultDurationMs||2500,n=this.callMode===`live`;this.floatingDock?.markFiring(e.id,t);let r=T(`div`,`memecord-meme-box ${this.getPositionClass(this.settings.position||`top-center`)}${n?` compact`:``}`);r.setAttribute(`aria-live`,`polite`);let i=k(e.assetUrl,e.name,`memecord-meme-image`),a=T(`div`,`memecord-meme-title`),o=T(`span`,`memecord-meme-badge ${n?`live`:`local`}`);o.appendChild(T(`span`,`memecord-dot`)),o.appendChild(T(`span`,``,n?`On camera`:`Only you`)),a.append(o,T(`span`,``,e.name)),r.append(i,a),n||r.appendChild(T(`div`,`memecord-meme-caption`,`Turn your camera on so others see it`)),this.root.appendChild(r),this.currentMemeBox=r,requestAnimationFrame(()=>r.classList.add(`visible`)),this.hideTimeoutId=setTimeout(()=>{r.classList.remove(`visible`),r.classList.add(`hiding`),this.removeTimeoutId=setTimeout(()=>{r.remove(),this.currentMemeBox===r&&(this.currentMemeBox=null)},300)},t)}showPositionPreview(e){this.showToast(`Memes will appear ${{"top-center":`top`,"top-right":`top right`,center:`center`,"bottom-right":`bottom right`}[e]} on your video`,1800)}openQuickAddModal(e={}){if(!this.root)return;this.closeModal();let t=p(this.settings.memes),r=new Set(this.settings.memes.map(e=>e.id)),i=new Set(this.settings.memes.map(e=>e.assetUrl)),a=m.filter(e=>!r.has(e.id)&&!i.has(e.assetUrl)),o=null,s=null,c=0,l=T(`div`,`memecord-modal-backdrop`);l.dataset.memecordModal=`add`;let d=T(`div`,`memecord-modal`);d.setAttribute(`role`,`dialog`),d.setAttribute(`aria-modal`,`true`),d.setAttribute(`aria-label`,`Add a meme`);let f=T(`div`,`memecord-modal-head`),h=T(`div`);h.appendChild(T(`h2`,``,`Add a meme`)),h.appendChild(T(`p`,``,`GIF, image or short video. Give it a key to fire it mid-call.`));let g=T(`button`,`memecord-icon-btn`);g.type=`button`,g.setAttribute(`aria-label`,`Close`),g.innerHTML=w(`x`,16),f.append(h,g);let _=T(`input`);_.type=`file`,_.accept=`image/gif,image/webp,image/png,image/jpeg,video/mp4,video/webm`,_.style.display=`none`;let v=T(`div`,`memecord-dropzone`);v.setAttribute(`role`,`button`),v.tabIndex=0,v.innerHTML=w(`upload`,20),v.appendChild(T(`strong`,``,`Upload or drop a file`)),v.appendChild(T(`span`,``,`GIF, WebP, PNG, JPG, MP4 · up to 8 MB`));let y=T(`div`,`memecord-field`),b=T(`label`,`memecord-label`,`Paste a link`);b.htmlFor=`memecord-add-url`;let x=T(`input`,`memecord-input`);x.id=`memecord-add-url`,x.type=`url`,x.placeholder=`Tenor, Giphy or direct .gif / .mp4 link`,x.autocomplete=`off`,y.append(b,x);let S=null;if(a.length>0){S=T(`div`,`memecord-field`),S.appendChild(T(`span`,`memecord-label`,`Or pick a classic`));let e=T(`div`,`memecord-picks`);a.slice(0,12).forEach(t=>{let n=T(`button`,`memecord-pick`);n.type=`button`,n.title=t.name,n.setAttribute(`aria-label`,t.name),n.appendChild(k(t.assetUrl,t.name)),n.addEventListener(`click`,()=>{e.querySelectorAll(`.memecord-pick`).forEach(e=>e.classList.remove(`selected`)),n.classList.add(`selected`),x.value=``,M||(O.value=t.name),G({url:t.assetUrl,name:t.name},`Ready to add`)}),e.appendChild(n)}),S.appendChild(e)}let C=T(`div`,`memecord-row`),E=T(`div`,`memecord-field`),D=T(`label`,`memecord-label`,`Name`);D.htmlFor=`memecord-add-name`;let O=T(`input`,`memecord-input`);O.id=`memecord-add-name`,O.type=`text`,O.placeholder=`e.g. Happy Cat`,O.maxLength=40,E.append(D,O);let M=!1;O.addEventListener(`input`,()=>{M=O.value.trim().length>0,W()});let N=T(`div`,`memecord-field key-field`),P=T(`label`,`memecord-label`,`Key`);P.htmlFor=`memecord-add-key`;let F=T(`input`,`memecord-input memecord-key-input`);F.id=`memecord-add-key`,F.type=`text`,F.readOnly=!0,F.value=t,F.title=`Click, then press a key`,N.append(P,F),C.append(E,N);let I=T(`div`,`memecord-hint`),L=T(`div`,`memecord-preview`);L.style.display=`none`;let R=T(`div`,`memecord-modal-actions`),z=T(`button`,`memecord-btn`,`Cancel`);z.type=`button`;let B=T(`button`,`memecord-btn primary`,`Add to deck`);B.type=`button`,B.disabled=!0,R.append(z,B),d.append(f,v,_,T(`div`,`memecord-divider`,`or`),y),S&&d.appendChild(S),d.append(C,I,L,R),l.appendChild(d);let H=(e,t=``)=>{I.textContent=e,I.className=`memecord-hint${t?` ${t}`:``}`},U=()=>{let e=F.value.trim().toUpperCase(),t=e?u(this.settings.memes,e):void 0;return F.classList.toggle(`invalid`,!e||!!t),e?!t||(H(`${e} is already used by "${t.name}".`,`error`),!1):(H(`Pick a key for this meme.`,`error`),!1)},W=()=>{if(L.innerHTML=``,!o){L.style.display=`none`,B.disabled=!0;return}L.style.display=`flex`,L.appendChild(k(o.url,`Preview`,`memecord-preview-media`));let e=T(`div`,`memecord-preview-text`);e.appendChild(T(`strong`,``,O.value.trim()||o.name||`Untitled meme`)),e.appendChild(T(`span`,``,`Fires with key ${F.value||`—`}`)),L.appendChild(e),B.disabled=!U()},G=(e,t=``)=>{o=e,e?.name&&!M&&(O.value=e.name),t&&H(t,`success`),W(),e&&U()&&t&&H(t,`success`)},K=()=>{d.querySelectorAll(`.memecord-pick`).forEach(e=>e.classList.remove(`selected`))},q=async e=>{if(!/^(image|video)\//.test(e.type)){H(`That file isn't an image or video.`,`error`);return}if(e.size>V){H(`That file is ${(e.size/1024/1024).toFixed(1)} MB — keep it under 8 MB.`,`error`);return}K(),x.value=``,H(`Reading file…`);try{let t=await A(e);G({url:t,name:j(e.name)},`Loaded ${e.name}`)}catch(e){H(e?.message||`Could not read that file.`,`error`)}},J=e=>{K(),s&&clearTimeout(s);let t=e.trim();if(x.classList.remove(`invalid`),!t){G(null),H(``);return}H(`Checking link…`);let r=++c;s=setTimeout(async()=>{try{let e=await n(t);if(r!==c)return;G({url:e.url,name:e.name},`Link looks good`)}catch(e){if(r!==c)return;x.classList.add(`invalid`),G(null),H(e?.message||`That link doesn't look like a GIF or video.`,`error`)}},300)};v.addEventListener(`click`,()=>_.click()),v.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),_.click())}),_.addEventListener(`change`,()=>{let e=_.files?.[0];e&&q(e),_.value=``}),[`dragenter`,`dragover`].forEach(e=>v.addEventListener(e,e=>{e.preventDefault(),v.classList.add(`over`)})),v.addEventListener(`dragleave`,()=>v.classList.remove(`over`)),v.addEventListener(`drop`,e=>{e.preventDefault(),v.classList.remove(`over`);let t=e.dataTransfer?.files?.[0],n=e.dataTransfer?.getData(`text/uri-list`);t?q(t):n&&(x.value=n.split(`
`)[0].trim(),J(x.value))}),x.addEventListener(`input`,()=>J(x.value)),F.addEventListener(`keydown`,e=>{e.key!==`Tab`&&e.key!==`Escape`&&e.key!==`Enter`&&(e.preventDefault(),e.stopPropagation(),!(e.ctrlKey||e.metaKey||e.altKey)&&e.key.length===1&&/[a-z0-9]/i.test(e.key)&&(F.value=e.key.toUpperCase(),H(``),W(),U()&&H(`${F.value} is free.`,`success`)))});let Y=async()=>{if(o&&U()){B.disabled=!0,B.textContent=`Adding…`;try{let e=F.value.trim().toUpperCase(),t=O.value.trim()||o.name||`Custom meme`,n={id:`meme_${Date.now()}`,name:t,emoji:``,assetUrl:o.url,hotkey:e,durationMs:this.settings.defaultDurationMs||2500};await this.callbacks.onAddMeme?.(n),this.closeModal(),this.showToast(`Added "${t}" — press ${e} to fire it`)}catch(e){H(e?.message||`Could not save this meme.`,`error`),B.disabled=!1,B.textContent=`Add to deck`}}};B.addEventListener(`click`,Y),g.addEventListener(`click`,()=>this.closeModal()),z.addEventListener(`click`,()=>this.closeModal()),l.addEventListener(`mousedown`,e=>{e.target===l&&this.closeModal()}),d.addEventListener(`keydown`,e=>{e.key===`Escape`?(e.preventDefault(),this.closeModal()):e.key===`Enter`&&!B.disabled&&e.target?.tagName!==`BUTTON`&&(e.preventDefault(),Y()),e.stopPropagation()});let X=e=>e.stopPropagation();d.addEventListener(`keyup`,X),d.addEventListener(`keypress`,X),this.root.appendChild(l),this.currentModal=l,this.modalCleanup=()=>{s&&clearTimeout(s),c++},e.file?q(e.file):e.url&&(x.value=e.url,J(e.url)),x.focus()}closeModal(){this.modalCleanup?.(),this.modalCleanup=null,this.currentModal?.remove(),this.currentModal=null}playTriggerSound(){try{let e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.audioCtx=this.audioCtx||new e;let t=this.audioCtx,n=t.createOscillator(),r=t.createGain();n.type=`sine`,n.frequency.setValueAtTime(480,t.currentTime),n.frequency.exponentialRampToValueAtTime(960,t.currentTime+.1),r.gain.setValueAtTime(.12,t.currentTime),r.gain.exponentialRampToValueAtTime(.001,t.currentTime+.1),n.connect(r),r.connect(t.destination),n.start(),n.stop(t.currentTime+.11)}catch{}}getPositionClass(e){switch(e){case`center`:return`pos-center`;case`top-right`:return`pos-top-right`;case`bottom-right`:return`pos-bottom-right`;default:return`pos-top-center`}}initRoot(){if(!document.getElementById(`memecord-injected-styles`)){let e=document.createElement(`style`);e.id=`memecord-injected-styles`,e.textContent=B,(document.head||document.documentElement).appendChild(e)}let e=document.getElementById(`memecord-overlay-root`);e||(e=document.createElement(`div`),e.id=`memecord-overlay-root`,(document.body||document.documentElement).appendChild(e)),this.root=e}destroy(){this.hideTimeoutId&&clearTimeout(this.hideTimeoutId),this.removeTimeoutId&&clearTimeout(this.removeTimeoutId),this.toastTimeoutId&&clearTimeout(this.toastTimeoutId),this.floatingDock?.destroy(),this.floatingDock=null,this.closeModal(),this.audioCtx?.close().catch(()=>{}),this.audioCtx=null,this.root?.remove(),this.root=null}},U=f(),W=()=>{let n=(0,g.useRef)(null),[r,o]=(0,g.useState)(h),[l,u]=(0,g.useState)([]),[d,f]=(0,g.useState)(null),[p,m]=(0,g.useState)(!1),_=(0,g.useRef)(null),v=(0,g.useRef)(null),y=e=>{let t=new Date().toLocaleTimeString();u(n=>[`[${t}] ${e}`,...n.slice(0,49)])},C=async e=>{f(e.name),y(`Triggered: ${e.name}`),n.current?.showMeme(e);try{let t=await a(e.assetUrl);window.postMessage({source:`MEMECORD_CONTENT`,type:`TRIGGER_CAMERA_MEME`,meme:{...e,assetUrl:t},position:r.position||`center`},`*`)}catch(e){console.warn(`Failed to post camera meme:`,e)}},w=async()=>{if(p)v.current&&=(v.current.getTracks().forEach(e=>e.stop()),null),_.current&&(_.current.srcObject=null),m(!1),n.current?.setCameraLive(!1),y(`Virtual Camera Preview stopped.`);else try{y(`Requesting webcam feed (hooked by Memecord compositor)...`);let e=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1});v.current=e,_.current&&(_.current.srcObject=e),m(!0),n.current?.setCameraLive(!0),y(`Webcam feed active! This preview shows what remote callers see.`)}catch(e){y(`Camera error: ${e?.message||e}`)}};(0,g.useEffect)(()=>{let r=!1;i().then(t=>{r||(o(t),n.current=new H(t,{onTriggerMeme:e=>{C(e)},onAddMeme:async e=>{let t=await s(e);o(t),n.current?.updateSettings(t),y(`Added new meme: ${e.name}`)},onDeleteMeme:async t=>{let r=await e(t);o(r),n.current?.updateSettings(r),y(`Deleted meme: ${t}`)},onUpdateHotkey:(e,t)=>{o(n=>({...n,memes:n.memes.map(n=>n.id===e?{...n,hotkey:t}:n)})),y(`Rebound meme ${e} to [${t}]`)},onDockMinimizedChange:e=>{c({dockVisible:!e}),o(t=>({...t,dockVisible:!e})),y(e?`HUD minimized. Click the pebble or press ${b()}.`:`HUD expanded.`)}}),n.current.setDockVisible(!0),y(`Memecord Test Lab initialized. Press 1–9, 0, Q... or click dock buttons (works with or without cam).`))});let a=e=>{let r=document.activeElement;if(r&&(r.tagName===`INPUT`||r.tagName===`TEXTAREA`)||n.current?.isCapturingKeyboard())return;if(S(e)){e.preventDefault(),o(e=>{let t=!e.dockVisible;return c({dockVisible:t}),n.current?.setDockMinimized(!t),n.current?.setDockVisible(!0),y(t?`HUD expanded via ${b()}`:`HUD minimized via ${b()}`),{...e,dockVisible:t}});return}if(e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;let a=e.key;i().then(n=>{let r=n.memes.find((e,n)=>{let r=e.hotkey||t(n);return r&&r.toLowerCase()===a.toLowerCase()});r&&(e.preventDefault(),C(r))})};return window.addEventListener(`keydown`,a),()=>{r=!0,window.removeEventListener(`keydown`,a),n.current?.destroy(),n.current=null,v.current&&v.current.getTracks().forEach(e=>e.stop())}},[]);let T=async e=>{let t=await c({position:e});o(t),n.current?.updateSettings(t),y(`Changed overlay position to ${e}`),window.postMessage({source:`MEMECORD_CONTENT`,type:`UPDATE_CAMERA_SETTINGS`,position:e},`*`)};return(0,U.jsxs)(`div`,{className:`testlab-container`,children:[(0,U.jsxs)(`header`,{className:`testlab-header`,style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,U.jsxs)(`div`,{className:`testlab-brand`,children:[(0,U.jsx)(`img`,{src:`/icons/logo.png`,style:{width:36,height:36,borderRadius:`50%`,border:`1.5px solid rgba(129, 140, 248, 0.4)`},alt:`Memecord Logo`}),(0,U.jsxs)(`div`,{children:[(0,U.jsx)(`h1`,{children:`Memecord Test Lab`}),(0,U.jsx)(`p`,{children:`Interactive Sandbox & Meme Trigger Simulator (Cam & No-Cam Calls)`})]})]}),(0,U.jsxs)(`div`,{style:{display:`flex`,gap:10,alignItems:`center`},children:[(0,U.jsx)(`span`,{style:{fontSize:11,background:`rgba(16, 185, 129, 0.15)`,color:`#10b981`,border:`1px solid rgba(16, 185, 129, 0.3)`,borderRadius:20,padding:`4px 10px`,fontWeight:600},children:`● Active Call Simulated`}),(0,U.jsxs)(`button`,{onClick:()=>{o(e=>{let t=!e.dockVisible;return c({dockVisible:t}),n.current?.setDockMinimized(!t),n.current?.setDockVisible(!0),y(t?`HUD expanded via button`:`HUD minimized via button`),{...e,dockVisible:t}})},title:x(),style:{background:`rgba(99, 102, 241, 0.2)`,border:`1px solid rgba(99, 102, 241, 0.4)`,color:`#a5b4fc`,borderRadius:8,padding:`6px 12px`,fontSize:12,fontWeight:600,cursor:`pointer`},children:[`Toggle HUD (`,b(),`)`]})]})]}),(0,U.jsxs)(`div`,{style:{background:`rgba(99, 102, 241, 0.12)`,border:`1px solid rgba(129, 140, 248, 0.3)`,borderRadius:12,padding:`12px 18px`,marginBottom:20,display:`flex`,alignItems:`center`,gap:14},children:[(0,U.jsx)(`span`,{style:{fontSize:24},children:`🧩`}),(0,U.jsxs)(`div`,{children:[(0,U.jsx)(`strong`,{style:{color:`#fff`,fontSize:13,display:`block`,marginBottom:2},children:`Memecord is a Google Chrome Extension`}),(0,U.jsxs)(`span`,{style:{color:`#cbd5e1`,fontSize:12,lineHeight:1.5},children:[`It runs inside `,(0,U.jsx)(`strong`,{children:`Google Chrome browser tabs`}),` where video calls are made (such as `,(0,U.jsx)(`strong`,{children:`Google Meet`}),`, `,(0,U.jsx)(`strong`,{children:`Discord Web`}),` at `,(0,U.jsx)(`code`,{style:{color:`#a5b4fc`,background:`rgba(0,0,0,0.3)`,padding:`1px 5px`,borderRadius:4},children:`discord.com`}),`, `,(0,U.jsx)(`strong`,{children:`Zoom Web`}),`, `,(0,U.jsx)(`strong`,{children:`Teams Web`}),`, `,(0,U.jsx)(`strong`,{children:`Slack Huddles`}),`, and `,(0,U.jsx)(`strong`,{children:`FaceTime Web`}),`). It operates exclusively in the browser and does `,(0,U.jsx)(`em`,{children:`not`}),` run inside standalone desktop applications like Discord Desktop.`]})]})]}),(0,U.jsxs)(`div`,{className:`testlab-grid`,children:[(0,U.jsxs)(`div`,{className:`testlab-panel`,children:[(0,U.jsxs)(`h2`,{children:[`Meme Triggers (`,r.memes.length,`)`]}),(0,U.jsx)(`p`,{className:`testlab-sub`,children:`Click any button or press the corresponding hotkey on your keyboard:`}),(0,U.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(140px, 1fr))`,gap:10,margin:`16px 0`},children:r.memes.map((e,t)=>{let n=e.hotkey||(t<9?String(t+1):`-`),r=e.assetUrl.startsWith(`http`)||e.assetUrl.startsWith(`data:`)?e.assetUrl:`/${e.assetUrl.replace(/^\//,``)}`;return(0,U.jsxs)(`button`,{onClick:()=>C(e),style:{background:d===e.name?`rgba(99, 102, 241, 0.4)`:`rgba(255, 255, 255, 0.06)`,border:`1px solid rgba(255, 255, 255, 0.15)`,borderRadius:12,padding:`12px 10px`,color:`#fff`,cursor:`pointer`,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6,transition:`all 0.15s ease`},children:[(0,U.jsx)(`img`,{src:r,style:{width:40,height:40,borderRadius:8,objectFit:`cover`,background:`#1e293b`},alt:e.name}),(0,U.jsx)(`span`,{style:{fontSize:12,fontWeight:600,textAlign:`center`},children:e.name}),(0,U.jsxs)(`span`,{style:{fontSize:10,color:`#a5b4fc`,background:`rgba(0,0,0,0.3)`,padding:`2px 6px`,borderRadius:4},children:[`Key [`,n,`]`]})]},e.id)})}),(0,U.jsx)(`h3`,{style:{marginTop:20},children:`Position Preview`}),(0,U.jsx)(`div`,{style:{display:`flex`,gap:8,marginTop:8},children:[`top-center`,`center`,`top-right`,`bottom-right`].map(e=>(0,U.jsx)(`button`,{onClick:()=>T(e),style:{background:r.position===e?`#6366f1`:`rgba(255, 255, 255, 0.08)`,border:`1px solid rgba(255, 255, 255, 0.15)`,color:`#fff`,borderRadius:8,padding:`6px 12px`,fontSize:12,cursor:`pointer`},children:e},e))})]}),(0,U.jsxs)(`div`,{className:`testlab-panel`,children:[(0,U.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:12},children:[(0,U.jsx)(`h2`,{children:`Remote Caller Camera Stream`}),(0,U.jsx)(`button`,{onClick:w,style:{background:p?`#ef4444`:`#10b981`,border:`none`,color:`#fff`,padding:`6px 14px`,borderRadius:8,fontWeight:600,fontSize:12,cursor:`pointer`},children:p?`Stop Camera`:`Start Camera Stream`})]}),(0,U.jsxs)(`div`,{style:{position:`relative`,width:`100%`,height:220,background:`#090d16`,borderRadius:12,border:`1px solid rgba(255, 255, 255, 0.12)`,overflow:`hidden`,display:`flex`,alignItems:`center`,justifyContent:`center`,marginBottom:16},children:[(0,U.jsx)(`video`,{ref:_,autoPlay:!0,playsInline:!0,muted:!0,style:{width:`100%`,height:`100%`,objectFit:`cover`,display:p?`block`:`none`}}),!p&&(0,U.jsxs)(`div`,{style:{textAlign:`center`,color:`#64748b`,padding:20},children:[(0,U.jsx)(`div`,{style:{display:`inline-flex`,alignItems:`center`,gap:6,background:`rgba(239, 68, 68, 0.1)`,color:`#f87171`,border:`1px solid rgba(239, 68, 68, 0.25)`,borderRadius:20,padding:`3px 10px`,fontSize:11,fontWeight:600,marginBottom:8},children:`📷 Camera Disabled (No-Cam Mode)`}),(0,U.jsx)(`p`,{style:{margin:0,fontSize:13,fontWeight:500,color:`#e2e8f0`},children:`HUD & Hotkeys work even without camera enabled!`}),(0,U.jsx)(`p`,{style:{margin:`6px 0 0 0`,fontSize:11,color:`#94a3b8`},children:`Memes play in your screen overlay with sound. Click “Start Camera Stream” whenever you want to test stamping onto the remote video feed.`})]})]}),(0,U.jsx)(`h2`,{children:`Real-time Event Log`}),(0,U.jsx)(`div`,{style:{background:`rgba(0,0,0,0.4)`,borderRadius:10,padding:12,height:180,overflowY:`auto`,fontFamily:`monospace`,fontSize:12},children:l.map((e,t)=>(0,U.jsx)(`div`,{style:{color:`#38bdf8`,marginBottom:4},children:e},t))})]})]})]})},G=document.getElementById(`root`);G&&_.createRoot(G).render((0,U.jsx)(g.StrictMode,{children:(0,U.jsx)(W,{})}));