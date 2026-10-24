import{i as e,n as t,r as n,t as r}from"./jsx-runtime-a6Sotibp.js";import{a as i,c as a,d as o,f as s,i as c,l,n as u,o as d,r as f,s as p,t as m,u as h}from"./storage-C4zm49CW.js";import{i as g,n as _}from"./trending-DHQP5gWj.js";var v=e(n(),1),y=e(t(),1),b=class{frames=[];totalDurationMs=0;isComplete=!1;hasFrames=!1;aborted=!1;async load(e){if(window.ImageDecoder===void 0)return!1;try{let t;if(e.startsWith(`data:`)){let n=e.indexOf(`,`);if(n!==-1){let r=e.slice(n+1),i=atob(r),a=i.length,o=new Uint8Array(a);for(let e=0;e<a;e++)o[e]=i.charCodeAt(e);t=o.buffer}else t=await(await fetch(e)).arrayBuffer()}else t=await(await fetch(e)).arrayBuffer();if(this.aborted)return!1;let n=e.includes(`webp`)?`image/webp`:`image/gif`,r=new window.ImageDecoder({data:t,type:n});if(await r.tracks.ready,this.aborted){try{r.close()}catch{}return!1}let i=r.tracks.selectedTrack,a=i?i.frameCount:0;try{let e=await r.decode({frameIndex:0});if(this.aborted){e.image.close();try{r.close()}catch{}return!1}let t=e.image.duration,n=t&&t>0?t/1e3:100,i=await createImageBitmap(e.image);e.image.close(),this.frames.push({bitmap:i,durationMs:n}),this.totalDurationMs+=n,this.hasFrames=!0}catch(e){console.warn(`[Memecord] First frame decode error:`,e);try{r.close()}catch{}return!1}if(a===1){this.isComplete=!0;try{r.close()}catch{}return!0}return(async()=>{let e=1;for(;!this.aborted&&e<120;)try{let t=await r.decode({frameIndex:e});if(this.aborted){t.image.close();break}let n=t.image.duration,i=n&&n>0?n/1e3:100,o=await createImageBitmap(t.image);if(t.image.close(),this.frames.push({bitmap:o,durationMs:i}),this.totalDurationMs+=i,e++,r.complete&&a>0&&e>=a)break}catch{break}this.isComplete=!0;try{r.close()}catch{}})(),!0}catch(e){return console.warn(`[Memecord] ImageDecoder init failed:`,e),!1}}getCurrentFrame(e){if(this.frames.length===0)return null;if(this.frames.length===1||this.totalDurationMs<=0)return this.frames[0].bitmap;let t=e%this.totalDurationMs,n=0;for(let e=0;e<this.frames.length;e++)if(n+=this.frames[e].durationMs,t<n)return this.frames[e].bitmap;return this.frames[this.frames.length-1].bitmap}destroy(){this.aborted=!0;for(let e of this.frames)try{e.bitmap.close()}catch{}this.frames=[]}};(function(){if(typeof window>`u`||window.__MEMECORD_CAMERA_INJECTED__)return;window.__MEMECORD_CAMERA_INJECTED__=!0,console.log(`[Memecord] Virtual Camera Compositor active in page context`);let e=null,t=`center`;function n(){let e=document.getElementById(`memecord-pipeline-container`);return e||(e=document.createElement(`div`),e.id=`memecord-pipeline-container`,e.setAttribute(`aria-hidden`,`true`),e.style.cssText=`position:fixed;bottom:0;right:0;width:4px;height:4px;opacity:0.01;pointer-events:none;overflow:hidden;z-index:-999999;contain:strict;`,(document.body||document.documentElement).appendChild(e)),e}function r(){if(e){try{e.gifPlayer&&e.gifPlayer.destroy(),e.videoEl&&(e.videoEl.pause(),e.videoEl.src=``,e.videoEl.remove()),e.objectUrl&&URL.revokeObjectURL(e.objectUrl),e.imgEl&&e.imgEl.remove()}catch{}e=null}}window.addEventListener(`message`,e=>{if(e.data&&e.data.source===`MEMECORD_CONTENT`){if(e.data.type===`TRIGGER_CAMERA_MEME`&&e.data.meme){let n=e.data.meme;i(n,e.data.position||t),y(n.durationMs||2500)}e.data.type===`UPDATE_CAMERA_SETTINGS`&&e.data.position&&(t=e.data.position)}});async function i(t,i){r();let a=t.assetUrl,o=a.startsWith(`data:video/`)||a.endsWith(`.mp4`)||a.endsWith(`.webm`),s=n(),c=null,l=null,u=null,d=null;if(o){let e=document.createElement(`video`);if(e.autoplay=!0,e.loop=!0,e.muted=!0,e.playsInline=!0,e.setAttribute(`playsinline`,`true`),e.setAttribute(`webkit-playsinline`,`true`),e.crossOrigin=`anonymous`,a.startsWith(`data:video/`))try{let t=await(await fetch(a)).blob();d=URL.createObjectURL(t),e.src=d}catch{e.src=a}else e.src=a;s.appendChild(e),e.play().catch(e=>console.warn(`[Memecord Camera] Video play error:`,e)),l=e}else{let e=new Image;a.startsWith(`data:`)||(e.crossOrigin=`anonymous`),e.src=a,s.appendChild(e),u=e,c=new b,c.load(a)}e={meme:t,startTime:performance.now(),durationMs:t.durationMs||2500,position:i,gifPlayer:c,videoEl:l,imgEl:u,objectUrl:d},console.log(`[Memecord Camera] Activated meme on camera feed: ${t.name} (${o?`Video`:`GIF/Image`})`)}let a=new Set,o=new Map,s=new Map,c=new Map,l=null,u=0;function d(e){let t={source:`MEMECORD_CAMERA`,type:`MEME_DELIVERY`,mode:e},n=new Set([window]);try{window.parent&&n.add(window.parent),window.top&&n.add(window.top)}catch{}n.forEach(e=>{try{e.postMessage(t,`*`)}catch{}})}function f(){document.querySelectorAll(`video`).forEach(e=>{if(e.hasAttribute(`data-memecord-keep`))return;let t=e.srcObject;if(t instanceof MediaStream)for(let n of t.getVideoTracks()){let r=o.get(n);if(!r||r.readyState===`ended`)continue;let i=s.get(r);i||(i=new MediaStream([r]),s.set(r,i)),c.has(e)||c.set(e,t),e.srcObject=i,e.play().catch(()=>{});break}})}function p(){l&&clearInterval(l),l=null,c.forEach((e,t)=>{t.isConnected&&(t.srcObject=e,t.play().catch(()=>{}))}),c.clear()}function m(e){u=performance.now()+e+350,f(),l||=setInterval(()=>{performance.now()>u?p():f()},300)}function h(){let e=[];return a.forEach(t=>{let n=[];try{n=t.getTransceivers()}catch{}n.forEach(t=>{let n=t.sender;if(!n||t.receiver?.track?.kind!==`video`)return;let r=t.currentDirection??t.direction;if(r===`recvonly`||r===`inactive`||r===`stopped`)return;let i=n.track;(!i||i.readyState===`ended`||C.has(i)&&!i.enabled)&&e.push(n)})}),e}let g=null;function _(){let e=g;e&&(g=null,clearInterval(e.drawTimer),clearTimeout(e.endTimer),e.swapped.forEach((e,t)=>{let n=e&&e.readyState!==`ended`?e:null;t.replaceTrack(n).catch(()=>{})}),e.track.stop())}async function v(t){let n=h().filter(e=>!g?.swapped.has(e));if(!n.length&&!g)return!1;if(!g){let t=document.createElement(`canvas`);t.width=1280,t.height=720;let n=t.getContext(`2d`,{alpha:!1});if(!n)return!1;let i=()=>{let i=n.createLinearGradient(0,0,0,t.height);if(i.addColorStop(0,`#171a24`),i.addColorStop(1,`#0b0d12`),n.fillStyle=i,n.fillRect(0,0,t.width,t.height),e){let i=performance.now()-e.startTime;i>e.durationMs?r():k(n,t.width,t.height,e,i)}};i();let a=t.captureStream(30).getVideoTracks()[0];if(!a)return!1;g={track:a,drawTimer:setInterval(i,33),endTimer:null,swapped:new Map}}let i=g;return await Promise.all(n.map(async e=>{let t=e.track;try{await e.replaceTrack(i.track),i.swapped.set(e,t)}catch{}})),i.swapped.size===0?(_(),!1):(clearTimeout(i.endTimer),i.endTimer=setTimeout(_,t+350),!0)}function y(e){if(C.size>0&&T()){d(`camera`),m(e);return}v(e).then(e=>{e&&d(`virtual`)}).catch(()=>{})}let x=new Set,S=new Set,C=new Set,w=``;function T(){let e=!1;return C.forEach(t=>{t.readyState===`ended`?C.delete(t):t.enabled&&(e=!0)}),e}function E(){let e=x.size>0,t=S.size>0&&(C.size===0||T());w=`${e}|${t}`;let n=e||t;window.postMessage({source:`MEMECORD_CAMERA`,type:`CALL_STREAM_STATE`,active:n,hasAudio:e,hasVideo:t},`*`),window.postMessage({source:`MEMECORD_CAMERA`,type:`CAMERA_CALL_STATE`,active:t},`*`)}setInterval(()=>{C.size!==0&&`${x.size>0}|${S.size>0&&T()}`!==w&&E()},1e3);function D(e){e&&(e.getAudioTracks().forEach(e=>{x.add(e.id),E();let t=e.stop.bind(e);e.stop=()=>{x.delete(e.id),E(),t()},e.addEventListener(`ended`,()=>{x.delete(e.id),E()})}),e.getVideoTracks().forEach(e=>{S.add(e.id),E();let t=e.stop.bind(e);e.stop=()=>{S.delete(e.id),E(),t()},e.addEventListener(`ended`,()=>{S.delete(e.id),E()})}))}if(typeof window<`u`&&window.RTCPeerConnection)try{let e=window.RTCPeerConnection,t=new Set,n=()=>{window.postMessage({source:`MEMECORD_CAMERA`,type:`WEBRTC_CALL_STATE`,active:t.size>0},`*`)},r=function(...r){let i=new e(...r);a.add(i);let o=()=>{let e=i.connectionState===`connected`||i.iceConnectionState===`connected`||i.iceConnectionState===`completed`,r=i.connectionState===`closed`||i.connectionState===`failed`||i.connectionState===`disconnected`||i.iceConnectionState===`closed`||i.iceConnectionState===`failed`||i.iceConnectionState===`disconnected`;e?(t.add(i),n()):r&&t.has(i)&&(t.delete(i),n())};i.addEventListener(`connectionstatechange`,o),i.addEventListener(`iceconnectionstatechange`,o);let s=i.close.bind(i);return i.close=function(){return a.delete(i),t.delete(i),n(),s()},i};r.prototype=e.prototype,Object.assign(r,e),window.RTCPeerConnection=r}catch{}async function O(t,i){if(D(t),!i||!i.video)return t;let a=t.getVideoTracks()[0];if(!a)return t;console.log(`[Memecord Camera] Stamping virtual compositor onto webcam stream...`);let c=n(),l=document.createElement(`video`);l.autoplay=!0,l.muted=!0,l.playsInline=!0,l.setAttribute(`playsinline`,`true`),l.srcObject=new MediaStream([a]),c.appendChild(l),await new Promise(e=>{l.onloadedmetadata=()=>e(),setTimeout(e,600)}),await l.play().catch(()=>{});let u=document.createElement(`canvas`),d=l.videoWidth||1280,f=l.videoHeight||720;u.width=d,u.height=f,c.appendChild(u);let p=u.getContext(`2d`,{alpha:!1});if(!p)return t;let m=p,h=!0,g,_=performance.now();function v(){if(!h)return;_=performance.now(),l.videoWidth&&u.width!==l.videoWidth&&(u.width=l.videoWidth,u.height=l.videoHeight);let t=u.width,n=u.height;if(l.readyState>=2?m.drawImage(l,0,0,t,n):(m.fillStyle=`#0f172a`,m.fillRect(0,0,t,n)),e){let i=performance.now()-e.startTime;i>e.durationMs?r():k(m,t,n,e,i)}g=requestAnimationFrame(v)}v();let y=setInterval(()=>{if(!h){clearInterval(y);return}performance.now()-_>45&&v()},33),b=u.captureStream(30).getVideoTracks()[0],x=a.getSettings?a.getSettings():{},w=a.getCapabilities?a.getCapabilities():{};b.getSettings=()=>({...x,width:u.width,height:u.height,frameRate:30}),b.getCapabilities=()=>({...w}),b.getConstraints=()=>a.getConstraints?a.getConstraints():{},b.applyConstraints=async e=>{a.applyConstraints&&await a.applyConstraints(e)};try{Object.defineProperty(b,"label",{value:a.label||`Camera`,writable:!0})}catch{}let T=b.clone.bind(b);b.clone=()=>{let e=T();return e.getSettings=b.getSettings,e.getCapabilities=b.getCapabilities,e.getConstraints=b.getConstraints,e.applyConstraints=b.applyConstraints,C.add(e),o.set(e,a),e},C.add(b),o.set(b,a),S.add(b.id),S.add(a.id),E();let O=b.stop.bind(b);return b.stop=()=>{h=!1,cancelAnimationFrame(g),clearInterval(y),r(),a.stop(),l.srcObject=null,l.parentElement&&l.remove(),u.parentElement&&u.remove(),S.delete(a.id),S.delete(b.id),C.delete(b),o.delete(b),s.delete(a),E(),O()},a.onended=()=>{b.stop()},new MediaStream([b,...t.getAudioTracks()])}if(typeof navigator<`u`&&navigator.mediaDevices){let e=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices),t=async function(t){return O(await e(t),t)};navigator.mediaDevices.getUserMedia=t,window.MediaDevices&&window.MediaDevices.prototype&&(window.MediaDevices.prototype.getUserMedia=t)}if(typeof navigator<`u`){let e=navigator;if(e.getUserMedia){let t=e.getUserMedia.bind(e);e.getUserMedia=function(e,n,r){t(e,async t=>{n(await O(t,e))},r)}}if(e.webkitGetUserMedia){let t=e.webkitGetUserMedia.bind(e);e.webkitGetUserMedia=function(e,n,r){t(e,async t=>{n(await O(t,e))},r)}}}function k(e,t,n,r,i){let{meme:a,durationMs:o,position:s,gifPlayer:c,videoEl:l,imgEl:u}=r,d=null,f=400,p=300;if(l){if(l.paused&&l.readyState>=2&&l.play().catch(()=>{}),l.duration&&Number.isFinite(l.duration)&&l.duration>0){let e=i/1e3%l.duration;if(Math.abs(l.currentTime-e)>.4)try{l.currentTime=e}catch{}}l.readyState>=2&&l.videoWidth>0&&(d=l,f=l.videoWidth,p=l.videoHeight)}else if(c&&c.hasFrames){let e=c.getCurrentFrame(i);e&&(d=e,f=e.width,p=e.height)}if(!d&&u&&u.complete&&u.naturalWidth>0&&(d=u,f=u.naturalWidth,p=u.naturalHeight),!d)return;let m=1,h=1;if(i<160){let e=i/160;m=.6+.4*Math.sin(e*Math.PI/2),h=e}else if(i>o-200){let e=(o-i)/200;h=Math.max(0,e),m=.9+.1*e}e.save(),e.globalAlpha=Math.max(0,Math.min(1,h));let g=n*.52,_=t*.48,v=f/p,y=_,b=y/v;b>g&&(b=g,y=b*v);let x=y*m,S=b*m,C=(t-x)/2,w=(n-S)/2;switch(s){case`top-center`:C=(t-x)/2,w=n*.05;break;case`top-right`:C=t-x-t*.05,w=n*.05;break;case`bottom-right`:C=t-x-t*.05,w=n-S-n*.12;break;default:C=(t-x)/2,w=(n-S)/2-n*.03}e.shadowColor=`rgba(0, 0, 0, 0.7)`,e.shadowBlur=24,e.shadowOffsetX=0,e.shadowOffsetY=12,e.beginPath(),A(e,C,w,x,S,16),e.fillStyle=`#0f172a`,e.fill(),e.shadowColor=`transparent`,e.shadowBlur=0,e.save(),e.beginPath(),A(e,C,w,x,S,16),e.clip();try{e.drawImage(d,C,w,x,S)}catch(e){console.warn(`[Memecord Camera] Error drawing meme:`,e)}e.restore(),e.beginPath(),A(e,C,w,x,S,16),e.lineWidth=3.5,e.strokeStyle=`rgba(255, 255, 255, 0.9)`,e.stroke();let T=a.name;e.font=`bold ${Math.max(12,Math.round(n*.026))}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;let E=e.measureText(T).width+24,D=Math.max(22,Math.round(n*.04)),O=C+(x-E)/2,k=w+S+8;e.beginPath(),A(e,O,k,E,D,D/2),e.fillStyle=`rgba(15, 23, 42, 0.88)`,e.fill(),e.lineWidth=1,e.strokeStyle=`rgba(255, 255, 255, 0.2)`,e.stroke(),e.fillStyle=`#ffffff`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(T,O+E/2,k+D/2),e.restore()}function A(e,t,n,r,i,a){r<2*a&&(a=r/2),i<2*a&&(a=i/2),e.beginPath(),e.moveTo(t+a,n),e.arcTo(t+r,n,t+r,n+i,a),e.arcTo(t+r,n+i,t,n+i,a),e.arcTo(t,n+i,t,n,a),e.arcTo(t,n,t+r,n,a),e.closePath()}})();var x=typeof navigator<`u`&&(/Mac|iPhone|iPod|iPad/i.test(navigator.platform||``)||/Macintosh|Mac OS X/i.test(navigator.userAgent||``)),S=()=>x?`⌥⇧M`:`Alt+M`,C=()=>x?`⌥⇧M (Option+Shift+M)`:`Alt+M`,w=e=>{if(e.code!==`KeyM`&&e.key.toLowerCase()!==`m`&&e.key!==`µ`)return!1;if(x){let t=e.altKey&&e.shiftKey,n=e.altKey&&!e.metaKey&&!e.ctrlKey,r=e.ctrlKey&&e.shiftKey,i=e.metaKey&&e.shiftKey;return!!(t||n||r||i)}return!!(e.altKey||e.ctrlKey&&e.shiftKey)},T={plus:`<path d="M12 5v14M5 12h14"/>`,pencil:`<path d="M21.17 6.81a2.83 2.83 0 0 0-4-4L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/>`,minus:`<path d="M5 12h14"/>`,x:`<path d="M18 6 6 18M6 6l12 12"/>`,search:`<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>`,play:`<path d="M6 4v16a1 1 0 0 0 1.5.86l13-8a1 1 0 0 0 0-1.72l-13-8A1 1 0 0 0 6 4z"/>`,keyboard:`<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M10 13h4"/>`,trash:`<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>`,upload:`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>`,flame:`<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`,refresh:`<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>`,image:`<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>`};function E(e,t=16){return`<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${T[e]}</svg>`}function D(e,t,n){let r=document.createElement(e);return t&&(r.className=t),n!==void 0&&(r.textContent=n),r}function O(e){if(!e)return``;if(e.startsWith(`http://`)||e.startsWith(`https://`)||e.startsWith(`data:`))return e;if(typeof chrome<`u`&&chrome.runtime?.id&&chrome.runtime.getURL)try{return chrome.runtime.getURL(e.replace(/^\//,``))}catch{}return e.startsWith(`/`)?e:`/${e}`}function k(e){return e.startsWith(`data:video/`)||/\.(mp4|webm)(\?|#|$)/i.test(e)}var A=`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7180' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21'/%3E%3C/svg%3E`;function j(e,t,n){let r=O(e);if(k(r)){let e=D(`video`,n);return e.src=r,e.muted=!0,e.loop=!0,e.autoplay=!0,e.playsInline=!0,e}let i=D(`img`,n);i.alt=t,i.decoding=`async`,i.referrerPolicy=`no-referrer`;let o=!1;return i.onerror=async()=>{if(!o&&r.startsWith(`http`)){o=!0;let e=await a(r);if(e.startsWith(`data:`)){i.src=e;return}}i.onerror=null,i.src=A},i.src=r,i}function M(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(r.result),r.onerror=()=>n(r.error||Error(`Could not read file`)),r.readAsDataURL(e)})}function N(e){return e.replace(/\.[a-z0-9]+$/i,``).replace(/[-_]+/g,` `).replace(/\s+/g,` `).trim().replace(/\b\w/g,e=>e.toUpperCase())}var P=`memecord_dock_anchor`,F=8,I=[{key:`top-center`,label:`Top`},{key:`top-right`,label:`Top right`},{key:`center`,label:`Center`},{key:`bottom-right`,label:`Bottom right`}],L=`1234567890QWERTYUIOPASDFGZXCVB`.split(``),R=null;function z(e=`pop`){try{let t=window.AudioContext||window.webkitAudioContext;if(!t)return;R||=new t;let n=R,r=n.createOscillator(),i=n.createGain();r.connect(i),i.connect(n.destination),r.type=`sine`;let[a,o,s,c]={pop:[440,880,.06,.08],minimize:[600,320,.05,.1],expand:[360,720,.05,.1],delete:[300,150,.07,.12]}[e],l=n.currentTime;r.frequency.setValueAtTime(a,l),r.frequency.exponentialRampToValueAtTime(o,l+c),i.gain.setValueAtTime(s,l),i.gain.exponentialRampToValueAtTime(.001,l+c),r.start(l),r.stop(l+c+.01)}catch{}}function B(e,t){return(e.hotkey||p(t)).toUpperCase()}var V=class{parent;element=null;pebble=null;gridContainer=null;statusEl=null;addBtn=null;refreshBtn=null;searchInput=null;trendingMeta=null;tabButtons=new Map;view=`mine`;trendingFeed=null;trendingLoading=!1;trendingError=``;searchResults=[];searchTimer=null;searchToken=0;editBtn=null;editBanner=null;contextMenu=null;activeModal=null;modalCleanup=null;isMinimized=!1;isEditMode=!1;isVisible=!1;searchQuery=``;callMode=`local`;currentPosition=`top-center`;memes=[];callbacks;firingTimers=new Map;anchor={right:20,bottom:104};docClickHandler=()=>this.closeContextMenu();resizeHandler=()=>this.applyAnchor();constructor(e,t,n,r=`top-center`,i=!1){this.parent=e,this.memes=t,this.callbacks=n,this.currentPosition=r,this.isMinimized=i,this.loadAnchor(),this.createDom(),this.render(),document.addEventListener(`click`,this.docClickHandler),window.addEventListener(`resize`,this.resizeHandler)}createDom(){let e=D(`div`,`memecord-deck`);e.setAttribute(`role`,`dialog`),e.setAttribute(`aria-label`,`Memecord meme deck`);let t=D(`div`,`memecord-deck-header`);t.title=`Drag to move`;let n=D(`img`,`memecord-deck-logo`);n.src=O(`icons/logo.png`),n.alt=``;let r=D(`div`,`memecord-deck-heading`);r.appendChild(D(`span`,`memecord-deck-title`,`Memecord`)),this.statusEl=D(`span`,`memecord-status`),r.appendChild(this.statusEl);let i=this.iconButton(`pencil`,`Edit keys & remove memes`);i.addEventListener(`click`,e=>{e.stopPropagation(),z(`pop`),this.setEditMode(!this.isEditMode)}),this.editBtn=i;let a=this.iconButton(`minus`,`Minimize (${S()})`);a.addEventListener(`click`,e=>{e.stopPropagation(),this.setMinimized(!0)}),t.append(n,r,i,a);let o=D(`div`,`memecord-tabs`);o.setAttribute(`role`,`tablist`),[[`mine`,`My memes`],[`trending`,`Trending`]].forEach(([e,t])=>{let n=D(`button`,`memecord-tab`);n.type=`button`,n.setAttribute(`role`,`tab`),e===`trending`&&(n.innerHTML=E(`flame`,14)),n.appendChild(D(`span`,``,t)),n.addEventListener(`click`,t=>{t.stopPropagation(),this.setView(e)}),this.tabButtons.set(e,n),o.appendChild(n)});let s=D(`div`,`memecord-toolbar`),c=D(`label`,`memecord-search`);c.innerHTML=E(`search`,14);let l=D(`input`);l.type=`search`,l.placeholder=`Search memes`,l.setAttribute(`aria-label`,`Search memes`),l.addEventListener(`input`,()=>{this.searchQuery=l.value.trim().toLowerCase(),this.renderCards(),this.view===`trending`&&this.scheduleTrendingSearch()}),this.searchInput=l,l.addEventListener(`keydown`,e=>{e.key===`Escape`&&(l.value=``,this.searchQuery=``,this.searchResults=[],this.renderCards(),l.blur())}),c.appendChild(l);let u=D(`button`,`memecord-btn primary`);u.type=`button`,u.innerHTML=`${E(`plus`,15)}<span>Add</span>`,u.title=`Add a GIF, image or video`,u.addEventListener(`click`,e=>{e.stopPropagation(),z(`pop`),this.setEditMode(!1),this.callbacks.onAddMeme()}),this.addBtn=u;let d=D(`button`,`memecord-btn`);d.type=`button`,d.innerHTML=E(`refresh`,15),d.title=`Refresh trending memes`,d.setAttribute(`aria-label`,`Refresh trending memes`),d.addEventListener(`click`,e=>{e.stopPropagation(),this.loadTrending(!0)}),this.refreshBtn=d,s.append(c,u,d);let f=D(`div`,`memecord-trending-meta`);this.trendingMeta=f;let p=D(`div`,`memecord-edit-banner`);p.appendChild(D(`span`,``,`Click a meme to change its key`));let m=D(`button`,`memecord-btn primary`,`Done`);m.type=`button`,m.addEventListener(`click`,e=>{e.stopPropagation(),this.setEditMode(!1)}),p.appendChild(m),p.style.display=`none`,this.editBanner=p;let h=D(`div`,`memecord-grid`);this.gridContainer=h;let g=D(`div`,`memecord-deck-footer`),_=D(`div`,`memecord-pos-group`);_.appendChild(D(`span`,`memecord-pos-label`,`Position`));let v=D(`div`,`memecord-pos-screen`);v.setAttribute(`role`,`radiogroup`),v.setAttribute(`aria-label`,`Where memes appear on your video`),I.forEach(e=>{let t=D(`button`,`memecord-pos-spot`);t.type=`button`,t.dataset.pos=e.key,t.title=`Show memes: ${e.label}`,t.setAttribute(`role`,`radio`),t.setAttribute(`aria-label`,e.label),t.addEventListener(`click`,t=>{t.stopPropagation(),this.setPosition(e.key),this.callbacks.onPositionChange?.(e.key)}),v.appendChild(t)}),_.appendChild(v);let y=D(`span`,`memecord-shortcut-hint`);y.title=C(),y.appendChild(D(`span`,`memecord-kbd`,S())),y.appendChild(D(`span`,``,`hide`)),g.append(_,y),e.append(t,o,s,p,f,h,g),this.bindDropTarget(e),this.bindDrag(e,t),this.parent.appendChild(e),this.element=e;let b=D(`button`,`memecord-pebble`);b.type=`button`,b.title=`Open Memecord (${C()})`;let x=D(`span`,`memecord-pebble-logo`),w=D(`img`);w.src=O(`icons/logo.png`),w.alt=``,x.append(w,D(`span`,`memecord-dot`)),b.append(x,D(`span`,``,`Memes`),D(`span`,`memecord-kbd`,S())),b.addEventListener(`click`,e=>{if(e.stopPropagation(),b.dataset.dragged===`1`){b.dataset.dragged=``;return}this.setMinimized(!1)}),this.bindDrag(b,b),this.parent.appendChild(b),this.pebble=b,this.setPosition(this.currentPosition),this.setCallMode(this.callMode),this.setView(`mine`),this.applyAnchor()}iconButton(e,t){let n=D(`button`,`memecord-icon-btn`);return n.type=`button`,n.title=t,n.setAttribute(`aria-label`,t),n.innerHTML=E(e,16),n}updateMemes(e){this.memes=e,this.renderCards()}setPosition(e){this.currentPosition=e,this.element?.querySelectorAll(`.memecord-pos-spot`).forEach(t=>{let n=t.dataset.pos===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-checked`,String(n))})}setCallMode(e){this.callMode=e,this.statusEl&&(this.statusEl.className=`memecord-status ${e}`,this.statusEl.innerHTML=``,this.statusEl.appendChild(D(`span`,`memecord-dot`)),this.statusEl.appendChild(D(`span`,``,e===`live`?`Live on your camera`:`Camera off · only you see memes`))),this.pebble&&(this.pebble.classList.toggle(`live`,e===`live`),this.pebble.classList.toggle(`local`,e===`local`))}markFiring(e,t){let n=this.gridContainer?.querySelector(`.memecord-card[data-meme-id="${CSS.escape(e)}"]`);this.firingTimers.forEach((e,t)=>{clearTimeout(e),this.gridContainer?.querySelector(`.memecord-card[data-meme-id="${CSS.escape(t)}"]`)?.classList.remove(`firing`)}),this.firingTimers.clear(),n&&(n.style.setProperty(`--mc-dur`,`${t}ms`),n.classList.remove(`firing`),n.offsetWidth,n.classList.add(`firing`),this.firingTimers.set(e,setTimeout(()=>{n.classList.remove(`firing`),this.firingTimers.delete(e)},t)))}isModalOpen(){return!!this.activeModal}setVisible(e){this.isVisible=e,e||(this.closeActiveModal(),this.closeContextMenu()),this.render()}setMinimized(e,t=!0){this.isMinimized!==e&&(this.isMinimized=e,e&&(this.closeActiveModal(),this.closeContextMenu(),this.setEditMode(!1)),t&&(z(e?`minimize`:`expand`),this.callbacks.onMinimizedChange?.(e)),!e&&this.element&&this.isVisible&&(this.element.classList.remove(`entering`),this.element.offsetWidth,this.element.classList.add(`entering`),setTimeout(()=>this.element?.classList.remove(`entering`),260)),this.render())}toggleMinimize(){this.setMinimized(!this.isMinimized)}render(){this.element&&(this.element.style.display=this.isVisible&&!this.isMinimized?`flex`:`none`),this.pebble&&(this.pebble.style.display=this.isVisible&&this.isMinimized?`flex`:`none`),this.applyAnchor()}setView(e){this.view=e,e===`trending`&&this.setEditMode(!1),this.tabButtons.forEach((t,n)=>{t.classList.toggle(`active`,n===e),t.setAttribute(`aria-selected`,String(n===e))}),this.addBtn&&(this.addBtn.style.display=e===`mine`?``:`none`),this.refreshBtn&&(this.refreshBtn.style.display=e===`trending`?``:`none`),this.editBtn&&(this.editBtn.style.visibility=e===`mine`?`visible`:`hidden`),this.searchInput&&(this.searchInput.placeholder=e===`trending`?`Search trending & GIFs`:`Search memes`),this.searchResults=[],e===`trending`&&this.searchQuery&&this.scheduleTrendingSearch(),e===`trending`&&!this.trendingFeed&&!this.trendingLoading&&this.loadTrending(!1),this.renderTrendingMeta(),this.renderCards(),this.gridContainer&&(this.gridContainer.scrollTop=0)}async loadTrending(e){if(this.callbacks.onLoadTrending&&!this.trendingLoading){this.trendingLoading=!0,this.trendingError=``,this.refreshBtn?.classList.add(`spinning`),this.renderTrendingMeta(),this.view===`trending`&&this.renderCards();try{this.trendingFeed=await this.callbacks.onLoadTrending(e),this.trendingFeed.memes.length||(this.trendingError=this.trendingFeed.errors[0]||`Nothing trending right now.`)}catch(e){this.trendingError=e?.message||`Could not load trending memes.`}finally{this.trendingLoading=!1,this.refreshBtn?.classList.remove(`spinning`),this.renderTrendingMeta(),this.view===`trending`&&this.renderCards()}}}scheduleTrendingSearch(){this.searchTimer&&clearTimeout(this.searchTimer);let e=this.searchQuery,t=++this.searchToken;if(e.length<2||!this.callbacks.onSearchTrending){this.searchResults=[];return}this.searchTimer=setTimeout(async()=>{try{let n=await this.callbacks.onSearchTrending(e);if(t!==this.searchToken||this.view!==`trending`)return;this.searchResults=n,this.renderCards()}catch{}},400)}renderTrendingMeta(){let e=this.trendingMeta;if(!e||(e.style.display=this.view===`trending`?`flex`:`none`,e.innerHTML=``,this.view!==`trending`))return;let t=this.trendingFeed;if(this.trendingLoading&&!t){e.appendChild(D(`span`,``,`Loading what's hot…`));return}if(!t)return;let n=t.sources.map(e=>e===`giphy`?`GIPHY`:`Reddit`);e.appendChild(D(`span`,``,`Hot on ${n.join(` + `)||`—`} · ${H(t.fetchedAt)}`)),t.sources.includes(`giphy`)||e.appendChild(D(`span`,`memecord-trending-tip`,`Add a GIPHY key in settings for trending GIFs`))}renderCards(){if(!this.gridContainer)return;if(this.view===`trending`){this.renderTrendingCards();return}this.gridContainer.innerHTML=``;let e=this.memes.map((e,t)=>({meme:e,key:B(e,t)})).filter(({meme:e,key:t})=>!this.searchQuery||e.name.toLowerCase().includes(this.searchQuery)||t.toLowerCase()===this.searchQuery);if(e.length===0&&this.searchQuery){let e=D(`div`,`memecord-empty`);e.appendChild(D(`strong`,``,`No matches`)),e.appendChild(D(`span`,``,`Nothing called "${this.searchQuery}" yet.`)),this.gridContainer.appendChild(e);return}if(e.forEach(({meme:e,key:t})=>{let n=D(`button`,`memecord-card`);n.type=`button`,n.dataset.memeId=e.id,n.title=this.isEditMode?`Change key for "${e.name}"`:`Show "${e.name}" (press ${t||`no key`})`,n.setAttribute(`aria-label`,this.isEditMode?`Change key for ${e.name}`:`Show ${e.name}`);let r=D(`span`,`memecord-card-thumb`);if(r.appendChild(j(e.assetUrl,e.name)),t&&r.appendChild(D(`span`,`memecord-keycap`,t)),r.appendChild(D(`span`,`memecord-card-progress`)),n.appendChild(r),n.appendChild(D(`span`,`memecord-card-name`,e.name)),this.isEditMode){let t=D(`span`,`memecord-card-remove`);t.setAttribute(`role`,`button`),t.setAttribute(`aria-label`,`Remove ${e.name}`),t.title=`Remove "${e.name}"`,t.innerHTML=E(`x`,13),t.addEventListener(`click`,t=>{t.stopPropagation(),z(`delete`),this.callbacks.onDeleteMeme(e.id)}),n.appendChild(t)}n.addEventListener(`click`,t=>{t.stopPropagation(),z(`pop`),this.isEditMode?this.openKeybindingModal(e):this.callbacks.onTriggerMeme(e)}),n.addEventListener(`contextmenu`,n=>{n.preventDefault(),n.stopPropagation(),this.openContextMenu(n.clientX,n.clientY,e,t)}),this.gridContainer.appendChild(n)}),!this.searchQuery){let e=D(`button`,`memecord-card add-tile`);e.type=`button`,e.title=`Add a GIF, image or video — or drop one on the deck`;let t=D(`span`,`memecord-card-thumb`);t.innerHTML=`${E(`plus`,20)}<span>Add meme</span>`,e.appendChild(t),e.appendChild(D(`span`,`memecord-card-name`,`Drop a GIF here`)),e.addEventListener(`click`,e=>{e.stopPropagation(),z(`pop`),this.setEditMode(!1),this.callbacks.onAddMeme()}),this.gridContainer.appendChild(e)}}renderTrendingCards(){let e=this.gridContainer;e.innerHTML=``;let t=this.trendingFeed?.memes||[],n=this.searchQuery,r=n?t.filter(e=>e.name.toLowerCase().includes(n)):t,i=new Set(r.map(e=>e.id)),a=[...r,...this.searchResults.filter(e=>!i.has(e.id))];if(a.length===0){let t=D(`div`,`memecord-empty`);if(this.trendingLoading){for(let t=0;t<6;t++)e.appendChild(D(`div`,`memecord-skeleton`));return}if(n)t.appendChild(D(`strong`,``,`No matches`)),t.appendChild(D(`span`,``,`Nothing trending for "${n}".`));else{t.appendChild(D(`strong`,``,`Couldn't load trending memes`)),t.appendChild(D(`span`,``,this.trendingError||`Check your connection and try again.`));let e=D(`button`,`memecord-btn`,`Try again`);e.type=`button`,e.addEventListener(`click`,e=>{e.stopPropagation(),this.loadTrending(!0)}),t.appendChild(e)}e.appendChild(t);return}a.forEach(t=>{let n=D(`button`,`memecord-card trending`);n.type=`button`,n.dataset.memeId=t.id,n.title=`Show "${t.name}" now`,n.setAttribute(`aria-label`,`Show ${t.name}`);let r=D(`span`,`memecord-card-thumb`);r.appendChild(j(t.thumbUrl||t.assetUrl,t.name)),r.appendChild(D(`span`,`memecord-source-tag ${t.source}`,t.source===`giphy`?`GIF`:`Reddit`)),r.appendChild(D(`span`,`memecord-card-progress`));let i=D(`span`,`memecord-card-save`);i.setAttribute(`role`,`button`),i.setAttribute(`aria-label`,`Save ${t.name} to my memes`),i.title=`Save to my memes with a key`,i.innerHTML=E(`plus`,14),i.addEventListener(`click`,e=>{e.stopPropagation(),z(`pop`),this.callbacks.onAddMeme({url:t.assetUrl,name:t.name})}),r.appendChild(i),n.appendChild(r),n.appendChild(D(`span`,`memecord-card-name`,t.name)),n.addEventListener(`click`,e=>{e.stopPropagation(),z(`pop`),this.callbacks.onTriggerTrending?.(t)}),e.appendChild(n)}),(this.trendingFeed?.sources.includes(`giphy`)||this.searchResults.length)&&e.appendChild(D(`div`,`memecord-attribution`,`Powered by GIPHY`))}setEditMode(e){this.isEditMode!==e&&(this.isEditMode=e,this.element?.classList.toggle(`edit-mode`,e),this.editBtn?.classList.toggle(`active`,e),this.editBtn?.setAttribute(`aria-pressed`,String(e)),this.editBanner&&(this.editBanner.style.display=e?`flex`:`none`),this.renderCards())}openKeybindingModal(e){this.closeActiveModal(),this.closeContextMenu();let t=this.memes.findIndex(t=>t.id===e.id),n=B(e,Math.max(0,t)),r=n,i=t=>this.memes.find((n,r)=>n.id!==e.id&&B(n,r)===t),a=D(`div`,`memecord-modal-backdrop`);a.dataset.memecordModal=`rebind`;let o=D(`div`,`memecord-modal`);o.setAttribute(`role`,`dialog`),o.setAttribute(`aria-modal`,`true`),o.setAttribute(`aria-label`,`Change key for ${e.name}`);let s=D(`div`,`memecord-modal-head`),c=D(`div`,`memecord-rebind-target`);c.appendChild(j(e.assetUrl,e.name,`memecord-preview-media`));let l=D(`div`);l.appendChild(D(`h2`,``,`Change key`)),l.appendChild(D(`p`,``,e.name)),c.appendChild(l);let u=this.iconButton(`x`,`Close`);s.append(c,u);let d=D(`div`,`memecord-key-capture`),f=D(`span`,`memecord-key-capture-key`,r||`–`);d.append(f,D(`span`,`memecord-key-capture-hint`,`Press any letter or number key`));let p=D(`div`,`memecord-hint`),m=D(`div`,`memecord-key-grid`);L.forEach(e=>{let t=i(e),n=D(`button`,`memecord-key-option${t?` taken`:``}`,e);n.type=`button`,n.dataset.key=e,n.title=t?`Used by "${t.name}"`:`Available`,m.appendChild(n)});let h=D(`div`,`memecord-modal-actions`),g=D(`button`,`memecord-btn`,`Cancel`);g.type=`button`;let _=D(`button`,`memecord-btn primary`,`Save`);_.type=`button`,h.append(g,_),o.append(s,d,p,m,h),a.appendChild(o);let v=e=>{r=e.toUpperCase(),f.textContent=r,m.querySelectorAll(`.memecord-key-option`).forEach(e=>{e.classList.toggle(`active`,e.dataset.key===r)});let t=i(r);d.classList.toggle(`clash`,!!t),_.disabled=!!t,t?(p.textContent=`${r} is already used by "${t.name}".`,p.className=`memecord-hint error`):(p.textContent=r===n?`This is the current key.`:`${r} is free.`,p.className=`memecord-hint success`)};v(r);let y=()=>{if(!r||i(r)){z(`delete`);return}r!==n&&this.callbacks.onUpdateHotkey?.(e.id,r),z(`pop`),this.closeActiveModal()};m.addEventListener(`click`,e=>{let t=e.target.closest(`.memecord-key-option`);t?.dataset.key&&(e.stopPropagation(),v(t.dataset.key))});let b=e=>{if(e.key===`Escape`){e.preventDefault(),e.stopPropagation(),this.closeActiveModal();return}if(e.key===`Enter`){e.preventDefault(),e.stopPropagation(),y();return}e.ctrlKey||e.metaKey||e.altKey||e.key.length===1&&/[a-z0-9]/i.test(e.key)&&(e.preventDefault(),e.stopPropagation(),v(e.key))};u.addEventListener(`click`,()=>this.closeActiveModal()),g.addEventListener(`click`,()=>this.closeActiveModal()),_.addEventListener(`click`,y),a.addEventListener(`mousedown`,e=>{e.target===a&&this.closeActiveModal()}),window.addEventListener(`keydown`,b,!0),this.parent.appendChild(a),this.activeModal=a,this.modalCleanup=()=>window.removeEventListener(`keydown`,b,!0),_.focus()}closeActiveModal(){this.modalCleanup?.(),this.modalCleanup=null,this.activeModal?.remove(),this.activeModal=null}openContextMenu(e,t,n,r){this.closeContextMenu();let i=D(`div`,`memecord-context-menu`);i.setAttribute(`role`,`menu`);let a=(e,t,n,r={})=>{let a=D(`button`,`memecord-menu-item${r.danger?` danger`:``}`);a.type=`button`,a.setAttribute(`role`,`menuitem`),a.innerHTML=E(e,15),a.appendChild(D(`span`,``,t)),r.kbd&&a.appendChild(D(`span`,`memecord-kbd`,r.kbd)),a.addEventListener(`click`,e=>{e.stopPropagation(),this.closeContextMenu(),n()}),i.appendChild(a)};a(`play`,`Show now`,()=>this.callbacks.onTriggerMeme(n),{kbd:r||void 0}),a(`keyboard`,`Change key`,()=>this.openKeybindingModal(n)),a(`trash`,`Remove`,()=>{z(`delete`),this.callbacks.onDeleteMeme(n.id)},{danger:!0}),this.parent.appendChild(i);let o=i.getBoundingClientRect();i.style.left=`${Math.min(e,window.innerWidth-o.width-F)}px`,i.style.top=`${Math.min(t,window.innerHeight-o.height-F)}px`,this.contextMenu=i}closeContextMenu(){this.contextMenu?.remove(),this.contextMenu=null}bindDropTarget(e){let t=0,n=e=>{let t=Array.from(e.dataTransfer?.types||[]);return t.includes(`Files`)||t.includes(`text/uri-list`)};e.addEventListener(`dragenter`,r=>{n(r)&&(r.preventDefault(),t++,e.classList.add(`drop-target`))}),e.addEventListener(`dragover`,e=>{n(e)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`copy`))}),e.addEventListener(`dragleave`,()=>{t=Math.max(0,t-1),t===0&&e.classList.remove(`drop-target`)}),e.addEventListener(`drop`,r=>{if(!n(r))return;r.preventDefault(),t=0,e.classList.remove(`drop-target`);let i=Array.from(r.dataTransfer?.files||[]).find(e=>/^(image|video)\//.test(e.type)),a=(r.dataTransfer?.getData(`text/uri-list`)||``).split(`
`).find(e=>e&&!e.startsWith(`#`));(i||a)&&(this.setEditMode(!1),this.callbacks.onAddMeme(i?{file:i}:{url:a.trim()}))})}bindDrag(e,t){t.addEventListener(`mousedown`,n=>{if(n.button!==0)return;let r=n.target;if(t!==e&&r.closest(`button, input`))return;let i=n.clientX,a=n.clientY,o={...this.anchor},s=!1,c=t=>{let n=t.clientX-i,r=t.clientY-a;!s&&Math.abs(n)+Math.abs(r)<4||(s=!0,this.anchor={right:o.right-n,bottom:o.bottom-r},this.applyAnchor(e))},l=()=>{document.removeEventListener(`mousemove`,c),document.removeEventListener(`mouseup`,l),s&&(e===this.pebble&&(e.dataset.dragged=`1`),this.anchor=this.applyAnchor(e),this.saveAnchor())};document.addEventListener(`mousemove`,c),document.addEventListener(`mouseup`,l),t!==e&&n.preventDefault()})}applyAnchor(e){let t=e||(this.isMinimized?this.pebble:this.element),n=t?.offsetWidth||0,r=t?.offsetHeight||0,i=Math.max(F,window.innerWidth-n-F),a=Math.max(F,window.innerHeight-r-F),o=Math.round(Math.min(i,Math.max(F,this.anchor.right))),s=Math.round(Math.min(a,Math.max(F,this.anchor.bottom)));return[this.element,this.pebble].forEach(e=>{e&&(e.style.right=`${o}px`,e.style.bottom=`${s}px`)}),{right:o,bottom:s}}loadAnchor(){try{let e=JSON.parse(localStorage.getItem(P)||`null`);e&&typeof e.right==`number`&&typeof e.bottom==`number`&&(this.anchor={right:e.right,bottom:e.bottom})}catch{}}saveAnchor(){try{localStorage.setItem(P,JSON.stringify(this.anchor))}catch{}}destroy(){this.closeContextMenu(),this.closeActiveModal(),this.firingTimers.forEach(e=>clearTimeout(e)),this.firingTimers.clear(),this.searchTimer&&clearTimeout(this.searchTimer),document.removeEventListener(`click`,this.docClickHandler),window.removeEventListener(`resize`,this.resizeHandler),this.element?.remove(),this.element=null,this.pebble?.remove(),this.pebble=null}};function H(e){let t=Math.round((Date.now()-e)/6e4);return t<1?`just now`:t<60?`${t}m ago`:`${Math.round(t/60)}h ago`}var U=`/* Memecord HUD — single source of truth, injected at runtime via ?raw import */
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
`,ee=8388608,W=class{root=null;currentMemeBox=null;currentToast=null;currentModal=null;modalCleanup=null;hideTimeoutId=null;removeTimeoutId=null;toastTimeoutId=null;floatingDock=null;settings;callbacks;callMode=`local`;badgeEl=null;captionEl=null;deliveryTimer=null;audioCtx=null;constructor(e,t={}){this.settings=e,this.callbacks=t,this.initRoot(),this.root&&(this.floatingDock=new V(this.root,this.settings.memes,{onTriggerMeme:e=>{this.callbacks.onTriggerMeme?this.callbacks.onTriggerMeme(e):this.showMeme(e)},onAddMeme:e=>{this.openQuickAddModal(e)},onTriggerTrending:e=>{let t=this.toMemeItem(e);this.callbacks.onTriggerMeme?this.callbacks.onTriggerMeme(t):this.showMeme(t)},onLoadTrending:e=>_(e),onSearchTrending:e=>g(e),onDeleteMeme:e=>{let t=this.settings.memes.find(t=>t.id===e);this.callbacks.onDeleteMeme?.(e),this.showToast(`Removed "${t?.name||`meme`}"`)},onUpdateHotkey:async(e,t)=>{let n=this.settings.memes.find(t=>t.id===e);try{let r=await d(e,t);this.updateSettings(r),this.callbacks.onUpdateHotkey?.(e,t),this.showToast(`"${n?.name||`Meme`}" is now on key ${t}`)}catch(e){this.showToast(e?.message||`Could not change key`)}},onMinimizedChange:e=>{this.callbacks.onDockMinimizedChange?.(e)},onPositionChange:e=>{this.settings.position=e,i({position:e}),this.showPositionPreview(e)}},this.settings.position,!this.settings.dockVisible))}toMemeItem(e){return{id:e.id,name:e.name,emoji:``,assetUrl:e.assetUrl,durationMs:this.settings.defaultDurationMs||2500}}updateSettings(e){this.settings=e,this.floatingDock?.updateMemes(e.memes),this.floatingDock?.setPosition(e.position),this.floatingDock?.setMinimized(!e.dockVisible,!1)}setDockVisible(e){this.floatingDock?.setVisible(e)}setDockMinimized(e){this.floatingDock?.setMinimized(e,!1)}setCameraLive(e){this.callMode=e?`live`:`local`,this.floatingDock?.setCallMode(this.callMode)}isCapturingKeyboard(){return!!this.currentModal||!!this.floatingDock?.isModalOpen()}showToast(e,t=2500){if(!this.root)return;this.currentToast?.remove(),this.currentToast=null,this.toastTimeoutId&&=(clearTimeout(this.toastTimeoutId),null);let n=D(`div`,`memecord-toast`,e);n.setAttribute(`role`,`status`),this.root.appendChild(n),this.currentToast=n,requestAnimationFrame(()=>n.classList.add(`visible`)),this.toastTimeoutId=setTimeout(()=>{n.classList.remove(`visible`),n.classList.add(`hiding`),setTimeout(()=>{n.remove(),this.currentToast===n&&(this.currentToast=null)},300)},t)}showMeme(e){if(!this.root||!this.settings.enabled)return;this.settings.soundEnabled&&this.playTriggerSound(),this.hideTimeoutId&&clearTimeout(this.hideTimeoutId),this.removeTimeoutId&&clearTimeout(this.removeTimeoutId),this.deliveryTimer&&clearTimeout(this.deliveryTimer),this.hideTimeoutId=null,this.removeTimeoutId=null,this.currentMemeBox?.remove(),this.currentMemeBox=null;let t=e.durationMs||this.settings.defaultDurationMs||2500;this.floatingDock?.markFiring(e.id,t);let n=D(`div`,`memecord-meme-box ${this.getPositionClass(this.settings.position||`top-center`)}`);n.setAttribute(`aria-live`,`polite`);let r=j(e.assetUrl,e.name,`memecord-meme-image`),i=D(`div`,`memecord-meme-title`),a=D(`span`,`memecord-meme-badge local`);a.appendChild(D(`span`,`memecord-dot`)),a.appendChild(D(`span`,``,`Sending…`)),i.append(a,D(`span`,``,e.name));let o=D(`div`,`memecord-meme-caption`);o.style.display=`none`,n.append(r,i,o),this.badgeEl=a,this.captionEl=o,this.root.appendChild(n),this.currentMemeBox=n,requestAnimationFrame(()=>n.classList.add(`visible`)),this.deliveryTimer=setTimeout(()=>this.setDelivery(`none`),900),this.hideTimeoutId=setTimeout(()=>{n.classList.remove(`visible`),n.classList.add(`hiding`),this.removeTimeoutId=setTimeout(()=>{n.remove(),this.currentMemeBox===n&&(this.currentMemeBox=null)},300)},t)}setDelivery(e){if(this.deliveryTimer&&=(clearTimeout(this.deliveryTimer),null),!this.badgeEl||!this.currentMemeBox)return;let t=this.badgeEl.lastElementChild,n=e!==`none`;this.badgeEl.className=`memecord-meme-badge ${n?`live`:`local`}`,t&&(t.textContent=n?`Everyone sees this`:`Only you`),this.captionEl&&(this.captionEl.style.display=n?`none`:``,this.captionEl.textContent=`Couldn't reach the call — turn your camera on so others see it`)}showPositionPreview(e){this.showToast(`Memes will appear ${{"top-center":`top`,"top-right":`top right`,center:`center`,"bottom-right":`bottom right`}[e]} on your video`,1800)}openQuickAddModal(e={}){if(!this.root)return;this.closeModal();let t=l(this.settings.memes),n=new Set(this.settings.memes.map(e=>e.id)),r=new Set(this.settings.memes.map(e=>e.assetUrl)),i=e=>!n.has(e.id)&&!r.has(e.assetUrl),a=null,o=null,c=0,d=D(`div`,`memecord-modal-backdrop`);d.dataset.memecordModal=`add`;let f=D(`div`,`memecord-modal`);f.setAttribute(`role`,`dialog`),f.setAttribute(`aria-modal`,`true`),f.setAttribute(`aria-label`,`Add a meme`);let p=D(`div`,`memecord-modal-head`),m=D(`div`);m.appendChild(D(`h2`,``,`Add a meme`)),m.appendChild(D(`p`,``,`GIF, image or short video. Give it a key to fire it mid-call.`));let g=D(`button`,`memecord-icon-btn`);g.type=`button`,g.setAttribute(`aria-label`,`Close`),g.innerHTML=E(`x`,16),p.append(m,g);let v=D(`input`);v.type=`file`,v.accept=`image/gif,image/webp,image/png,image/jpeg,video/mp4,video/webm`,v.style.display=`none`;let y=D(`div`,`memecord-dropzone`);y.setAttribute(`role`,`button`),y.tabIndex=0,y.innerHTML=E(`upload`,20),y.appendChild(D(`strong`,``,`Upload or drop a file`)),y.appendChild(D(`span`,``,`GIF, WebP, PNG, JPG, MP4 · up to 8 MB`));let b=D(`div`,`memecord-field`),x=D(`label`,`memecord-label`,`Paste a link`);x.htmlFor=`memecord-add-url`;let S=D(`input`,`memecord-input`);S.id=`memecord-add-url`,S.type=`url`,S.placeholder=`Tenor, Giphy or direct .gif / .mp4 link`,S.autocomplete=`off`,b.append(x,S);let C=D(`div`,`memecord-field`),w=D(`span`,`memecord-label`,`Or pick what's trending`),T=D(`div`,`memecord-picks`);C.append(w,T);for(let e=0;e<6;e++)T.appendChild(D(`div`,`memecord-skeleton`));let O=e=>{if(T.innerHTML=``,e.length===0){C.style.display=`none`;return}e.slice(0,12).forEach(e=>{let t=D(`button`,`memecord-pick`);t.type=`button`,t.title=e.name,t.setAttribute(`aria-label`,e.name),t.appendChild(j(e.thumbUrl,e.name)),t.addEventListener(`click`,()=>{T.querySelectorAll(`.memecord-pick`).forEach(e=>e.classList.remove(`selected`)),t.classList.add(`selected`),S.value=``,I||(F.value=e.name),J({url:e.assetUrl,name:e.name},`Ready to add`)}),T.appendChild(t)})};_().then(e=>{let t=e.memes.filter(i);if(!t.length)throw Error(`empty`);O(t)}).catch(()=>{w.textContent=`Or pick a classic`,O(s.filter(i).map(e=>({...e,thumbUrl:e.assetUrl})))});let k=D(`div`,`memecord-row`),A=D(`div`,`memecord-field`),P=D(`label`,`memecord-label`,`Name`);P.htmlFor=`memecord-add-name`;let F=D(`input`,`memecord-input`);F.id=`memecord-add-name`,F.type=`text`,F.placeholder=`e.g. Happy Cat`,F.maxLength=40,A.append(P,F);let I=!1;F.addEventListener(`input`,()=>{I=F.value.trim().length>0,q()});let L=D(`div`,`memecord-field key-field`),R=D(`label`,`memecord-label`,`Key`);R.htmlFor=`memecord-add-key`;let z=D(`input`,`memecord-input memecord-key-input`);z.id=`memecord-add-key`,z.type=`text`,z.readOnly=!0,z.value=t,z.title=`Click, then press a key`,L.append(R,z),k.append(A,L);let B=D(`div`,`memecord-hint`),V=D(`div`,`memecord-preview`);V.style.display=`none`;let H=D(`div`,`memecord-modal-actions`),U=D(`button`,`memecord-btn`,`Cancel`);U.type=`button`;let W=D(`button`,`memecord-btn primary`,`Add to deck`);W.type=`button`,W.disabled=!0,H.append(U,W),f.append(p,y,v,D(`div`,`memecord-divider`,`or`),b),f.appendChild(C),f.append(k,B,V,H),d.appendChild(f);let G=(e,t=``)=>{B.textContent=e,B.className=`memecord-hint${t?` ${t}`:``}`},K=()=>{let e=z.value.trim().toUpperCase(),t=e?u(this.settings.memes,e):void 0;return z.classList.toggle(`invalid`,!e||!!t),e?!t||(G(`${e} is already used by "${t.name}".`,`error`),!1):(G(`Pick a key for this meme.`,`error`),!1)},q=()=>{if(V.innerHTML=``,!a){V.style.display=`none`,W.disabled=!0;return}V.style.display=`flex`,V.appendChild(j(a.url,`Preview`,`memecord-preview-media`));let e=D(`div`,`memecord-preview-text`);e.appendChild(D(`strong`,``,F.value.trim()||a.name||`Untitled meme`)),e.appendChild(D(`span`,``,`Fires with key ${z.value||`—`}`)),V.appendChild(e),W.disabled=!K()},J=(e,t=``)=>{a=e,e?.name&&!I&&(F.value=e.name),t&&G(t,`success`),q(),e&&K()&&t&&G(t,`success`)},Y=()=>{f.querySelectorAll(`.memecord-pick`).forEach(e=>e.classList.remove(`selected`))},X=async e=>{if(!/^(image|video)\//.test(e.type)){G(`That file isn't an image or video.`,`error`);return}if(e.size>ee){G(`That file is ${(e.size/1024/1024).toFixed(1)} MB — keep it under 8 MB.`,`error`);return}Y(),S.value=``,G(`Reading file…`);try{let t=await M(e);J({url:t,name:N(e.name)},`Loaded ${e.name}`)}catch(e){G(e?.message||`Could not read that file.`,`error`)}},Z=e=>{Y(),o&&clearTimeout(o);let t=e.trim();if(S.classList.remove(`invalid`),!t){J(null),G(``);return}G(`Checking link…`);let n=++c;o=setTimeout(async()=>{try{let e=await h(t);if(n!==c)return;J({url:e.url,name:e.name},`Link looks good`)}catch(e){if(n!==c)return;S.classList.add(`invalid`),J(null),G(e?.message||`That link doesn't look like a GIF or video.`,`error`)}},300)};y.addEventListener(`click`,()=>v.click()),y.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),v.click())}),v.addEventListener(`change`,()=>{let e=v.files?.[0];e&&X(e),v.value=``}),[`dragenter`,`dragover`].forEach(e=>y.addEventListener(e,e=>{e.preventDefault(),y.classList.add(`over`)})),y.addEventListener(`dragleave`,()=>y.classList.remove(`over`)),y.addEventListener(`drop`,e=>{e.preventDefault(),y.classList.remove(`over`);let t=e.dataTransfer?.files?.[0],n=e.dataTransfer?.getData(`text/uri-list`);t?X(t):n&&(S.value=n.split(`
`)[0].trim(),Z(S.value))}),S.addEventListener(`input`,()=>Z(S.value)),z.addEventListener(`keydown`,e=>{e.key!==`Tab`&&e.key!==`Escape`&&e.key!==`Enter`&&(e.preventDefault(),e.stopPropagation(),!(e.ctrlKey||e.metaKey||e.altKey)&&e.key.length===1&&/[a-z0-9]/i.test(e.key)&&(z.value=e.key.toUpperCase(),G(``),q(),K()&&G(`${z.value} is free.`,`success`)))});let Q=async()=>{if(a&&K()){W.disabled=!0,W.textContent=`Adding…`;try{let e=z.value.trim().toUpperCase(),t=F.value.trim()||a.name||`Custom meme`,n={id:`meme_${Date.now()}`,name:t,emoji:``,assetUrl:a.url,hotkey:e,durationMs:this.settings.defaultDurationMs||2500};await this.callbacks.onAddMeme?.(n),this.closeModal(),this.showToast(`Added "${t}" — press ${e} to fire it`)}catch(e){G(e?.message||`Could not save this meme.`,`error`),W.disabled=!1,W.textContent=`Add to deck`}}};W.addEventListener(`click`,Q),g.addEventListener(`click`,()=>this.closeModal()),U.addEventListener(`click`,()=>this.closeModal()),d.addEventListener(`mousedown`,e=>{e.target===d&&this.closeModal()}),f.addEventListener(`keydown`,e=>{e.key===`Escape`?(e.preventDefault(),this.closeModal()):e.key===`Enter`&&!W.disabled&&e.target?.tagName!==`BUTTON`&&(e.preventDefault(),Q()),e.stopPropagation()});let $=e=>e.stopPropagation();f.addEventListener(`keyup`,$),f.addEventListener(`keypress`,$),this.root.appendChild(d),this.currentModal=d,this.modalCleanup=()=>{o&&clearTimeout(o),c++},e.file?X(e.file):e.url&&(e.name&&(F.value=e.name,I=!0),S.value=e.url,Z(e.url)),S.focus()}closeModal(){this.modalCleanup?.(),this.modalCleanup=null,this.currentModal?.remove(),this.currentModal=null}playTriggerSound(){try{let e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.audioCtx=this.audioCtx||new e;let t=this.audioCtx,n=t.createOscillator(),r=t.createGain();n.type=`sine`,n.frequency.setValueAtTime(480,t.currentTime),n.frequency.exponentialRampToValueAtTime(960,t.currentTime+.1),r.gain.setValueAtTime(.12,t.currentTime),r.gain.exponentialRampToValueAtTime(.001,t.currentTime+.1),n.connect(r),r.connect(t.destination),n.start(),n.stop(t.currentTime+.11)}catch{}}getPositionClass(e){switch(e){case`center`:return`pos-center`;case`top-right`:return`pos-top-right`;case`bottom-right`:return`pos-bottom-right`;default:return`pos-top-center`}}initRoot(){if(!document.getElementById(`memecord-injected-styles`)){let e=document.createElement(`style`);e.id=`memecord-injected-styles`,e.textContent=U,(document.head||document.documentElement).appendChild(e)}let e=document.getElementById(`memecord-overlay-root`);e||(e=document.createElement(`div`),e.id=`memecord-overlay-root`,(document.body||document.documentElement).appendChild(e)),this.root=e}destroy(){this.hideTimeoutId&&clearTimeout(this.hideTimeoutId),this.removeTimeoutId&&clearTimeout(this.removeTimeoutId),this.toastTimeoutId&&clearTimeout(this.toastTimeoutId),this.floatingDock?.destroy(),this.floatingDock=null,this.closeModal(),this.deliveryTimer&&clearTimeout(this.deliveryTimer),this.audioCtx?.close().catch(()=>{}),this.audioCtx=null,this.root?.remove(),this.root=null}},G=r(),K=()=>{let e=(0,v.useRef)(null),[t,n]=(0,v.useState)(o),[r,s]=(0,v.useState)([]),[l,u]=(0,v.useState)(null),[d,h]=(0,v.useState)(!1),g=(0,v.useRef)(null),_=(0,v.useRef)(null),y=e=>{let t=new Date().toLocaleTimeString();s(n=>[`[${t}] ${e}`,...n.slice(0,49)])},b=async n=>{u(n.name),y(`Triggered: ${n.name}`),e.current?.showMeme(n);try{let e=await a(n.assetUrl);window.postMessage({source:`MEMECORD_CONTENT`,type:`TRIGGER_CAMERA_MEME`,meme:{...n,assetUrl:e},position:t.position||`center`},`*`)}catch(e){console.warn(`Failed to post camera meme:`,e)}},x=async()=>{if(d)_.current&&=(_.current.getTracks().forEach(e=>e.stop()),null),g.current&&(g.current.srcObject=null),h(!1),e.current?.setCameraLive(!1),y(`Virtual Camera Preview stopped.`);else try{y(`Requesting webcam feed (hooked by Memecord compositor)...`);let t=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1});_.current=t,g.current&&(g.current.srcObject=t),h(!0),e.current?.setCameraLive(!0),y(`Webcam feed active! This preview shows what remote callers see.`)}catch(e){y(`Camera error: ${e?.message||e}`)}};(0,v.useEffect)(()=>{let t=!1;f().then(r=>{t||(n(r),e.current=new W(r,{onTriggerMeme:e=>{b(e)},onAddMeme:async t=>{let r=await m(t);n(r),e.current?.updateSettings(r),y(`Added new meme: ${t.name}`)},onDeleteMeme:async t=>{let r=await c(t);n(r),e.current?.updateSettings(r),y(`Deleted meme: ${t}`)},onUpdateHotkey:(e,t)=>{n(n=>({...n,memes:n.memes.map(n=>n.id===e?{...n,hotkey:t}:n)})),y(`Rebound meme ${e} to [${t}]`)},onDockMinimizedChange:e=>{i({dockVisible:!e}),n(t=>({...t,dockVisible:!e})),y(e?`HUD minimized. Click the pebble or press ${S()}.`:`HUD expanded.`)}}),e.current.setDockVisible(!0),y(`Memecord Test Lab initialized. Press 1–9, 0, Q... or click dock buttons (works with or without cam).`))});let r=t=>{t.data?.source===`MEMECORD_CAMERA`&&t.data.type===`MEME_DELIVERY`&&(e.current?.setDelivery(t.data.mode),y(`Meme reached the call (${t.data.mode===`camera`?`on camera`:`camera-off video`}).`))};window.addEventListener(`message`,r);let a=t=>{let r=document.activeElement;if(r&&(r.tagName===`INPUT`||r.tagName===`TEXTAREA`)||e.current?.isCapturingKeyboard())return;if(w(t)){t.preventDefault(),n(t=>{let n=!t.dockVisible;return i({dockVisible:n}),e.current?.setDockMinimized(!n),e.current?.setDockVisible(!0),y(n?`HUD expanded via ${S()}`:`HUD minimized via ${S()}`),{...t,dockVisible:n}});return}if(t.ctrlKey||t.metaKey||t.altKey||t.repeat)return;let a=t.key;f().then(e=>{let n=e.memes.find((e,t)=>{let n=e.hotkey||p(t);return n&&n.toLowerCase()===a.toLowerCase()});n&&(t.preventDefault(),b(n))})};return window.addEventListener(`keydown`,a),()=>{t=!0,window.removeEventListener(`message`,r),window.removeEventListener(`keydown`,a),e.current?.destroy(),e.current=null,_.current&&_.current.getTracks().forEach(e=>e.stop())}},[]);let T=async t=>{let r=await i({position:t});n(r),e.current?.updateSettings(r),y(`Changed overlay position to ${t}`),window.postMessage({source:`MEMECORD_CONTENT`,type:`UPDATE_CAMERA_SETTINGS`,position:t},`*`)};return(0,G.jsxs)(`div`,{className:`testlab-container`,children:[(0,G.jsxs)(`header`,{className:`testlab-header`,style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,G.jsxs)(`div`,{className:`testlab-brand`,children:[(0,G.jsx)(`img`,{src:`/icons/logo.png`,style:{width:36,height:36,borderRadius:`50%`,border:`1.5px solid rgba(129, 140, 248, 0.4)`},alt:`Memecord Logo`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`h1`,{children:`Memecord Test Lab`}),(0,G.jsx)(`p`,{children:`Interactive Sandbox & Meme Trigger Simulator (Cam & No-Cam Calls)`})]})]}),(0,G.jsxs)(`div`,{style:{display:`flex`,gap:10,alignItems:`center`},children:[(0,G.jsx)(`span`,{style:{fontSize:11,background:`rgba(16, 185, 129, 0.15)`,color:`#10b981`,border:`1px solid rgba(16, 185, 129, 0.3)`,borderRadius:20,padding:`4px 10px`,fontWeight:600},children:`● Active Call Simulated`}),(0,G.jsxs)(`button`,{onClick:()=>{n(t=>{let n=!t.dockVisible;return i({dockVisible:n}),e.current?.setDockMinimized(!n),e.current?.setDockVisible(!0),y(n?`HUD expanded via button`:`HUD minimized via button`),{...t,dockVisible:n}})},title:C(),style:{background:`rgba(99, 102, 241, 0.2)`,border:`1px solid rgba(99, 102, 241, 0.4)`,color:`#a5b4fc`,borderRadius:8,padding:`6px 12px`,fontSize:12,fontWeight:600,cursor:`pointer`},children:[`Toggle HUD (`,S(),`)`]})]})]}),(0,G.jsxs)(`div`,{style:{background:`rgba(99, 102, 241, 0.12)`,border:`1px solid rgba(129, 140, 248, 0.3)`,borderRadius:12,padding:`12px 18px`,marginBottom:20,display:`flex`,alignItems:`center`,gap:14},children:[(0,G.jsx)(`span`,{style:{fontSize:24},children:`🧩`}),(0,G.jsxs)(`div`,{children:[(0,G.jsx)(`strong`,{style:{color:`#fff`,fontSize:13,display:`block`,marginBottom:2},children:`Memecord is a Google Chrome Extension`}),(0,G.jsxs)(`span`,{style:{color:`#cbd5e1`,fontSize:12,lineHeight:1.5},children:[`It runs inside `,(0,G.jsx)(`strong`,{children:`Google Chrome browser tabs`}),` where video calls are made (such as `,(0,G.jsx)(`strong`,{children:`Google Meet`}),`, `,(0,G.jsx)(`strong`,{children:`Discord Web`}),` at `,(0,G.jsx)(`code`,{style:{color:`#a5b4fc`,background:`rgba(0,0,0,0.3)`,padding:`1px 5px`,borderRadius:4},children:`discord.com`}),`, `,(0,G.jsx)(`strong`,{children:`Zoom Web`}),`, `,(0,G.jsx)(`strong`,{children:`Teams Web`}),`, `,(0,G.jsx)(`strong`,{children:`Slack Huddles`}),`, and `,(0,G.jsx)(`strong`,{children:`FaceTime Web`}),`). It operates exclusively in the browser and does `,(0,G.jsx)(`em`,{children:`not`}),` run inside standalone desktop applications like Discord Desktop.`]})]})]}),(0,G.jsxs)(`div`,{className:`testlab-grid`,children:[(0,G.jsxs)(`div`,{className:`testlab-panel`,children:[(0,G.jsxs)(`h2`,{children:[`Meme Triggers (`,t.memes.length,`)`]}),(0,G.jsx)(`p`,{className:`testlab-sub`,children:`Click any button or press the corresponding hotkey on your keyboard:`}),(0,G.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(140px, 1fr))`,gap:10,margin:`16px 0`},children:t.memes.map((e,t)=>{let n=e.hotkey||(t<9?String(t+1):`-`),r=e.assetUrl.startsWith(`http`)||e.assetUrl.startsWith(`data:`)?e.assetUrl:`/${e.assetUrl.replace(/^\//,``)}`;return(0,G.jsxs)(`button`,{onClick:()=>b(e),style:{background:l===e.name?`rgba(99, 102, 241, 0.4)`:`rgba(255, 255, 255, 0.06)`,border:`1px solid rgba(255, 255, 255, 0.15)`,borderRadius:12,padding:`12px 10px`,color:`#fff`,cursor:`pointer`,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6,transition:`all 0.15s ease`},children:[(0,G.jsx)(`img`,{src:r,style:{width:40,height:40,borderRadius:8,objectFit:`cover`,background:`#1e293b`},alt:e.name}),(0,G.jsx)(`span`,{style:{fontSize:12,fontWeight:600,textAlign:`center`},children:e.name}),(0,G.jsxs)(`span`,{style:{fontSize:10,color:`#a5b4fc`,background:`rgba(0,0,0,0.3)`,padding:`2px 6px`,borderRadius:4},children:[`Key [`,n,`]`]})]},e.id)})}),(0,G.jsx)(`h3`,{style:{marginTop:20},children:`Position Preview`}),(0,G.jsx)(`div`,{style:{display:`flex`,gap:8,marginTop:8},children:[`top-center`,`center`,`top-right`,`bottom-right`].map(e=>(0,G.jsx)(`button`,{onClick:()=>T(e),style:{background:t.position===e?`#6366f1`:`rgba(255, 255, 255, 0.08)`,border:`1px solid rgba(255, 255, 255, 0.15)`,color:`#fff`,borderRadius:8,padding:`6px 12px`,fontSize:12,cursor:`pointer`},children:e},e))})]}),(0,G.jsxs)(`div`,{className:`testlab-panel`,children:[(0,G.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:12},children:[(0,G.jsx)(`h2`,{children:`Remote Caller Camera Stream`}),(0,G.jsx)(`button`,{onClick:x,style:{background:d?`#ef4444`:`#10b981`,border:`none`,color:`#fff`,padding:`6px 14px`,borderRadius:8,fontWeight:600,fontSize:12,cursor:`pointer`},children:d?`Stop Camera`:`Start Camera Stream`})]}),(0,G.jsxs)(`div`,{style:{position:`relative`,width:`100%`,height:220,background:`#090d16`,borderRadius:12,border:`1px solid rgba(255, 255, 255, 0.12)`,overflow:`hidden`,display:`flex`,alignItems:`center`,justifyContent:`center`,marginBottom:16},children:[(0,G.jsx)(`video`,{"data-memecord-keep":``,ref:g,autoPlay:!0,playsInline:!0,muted:!0,style:{width:`100%`,height:`100%`,objectFit:`cover`,display:d?`block`:`none`}}),!d&&(0,G.jsxs)(`div`,{style:{textAlign:`center`,color:`#64748b`,padding:20},children:[(0,G.jsx)(`div`,{style:{display:`inline-flex`,alignItems:`center`,gap:6,background:`rgba(239, 68, 68, 0.1)`,color:`#f87171`,border:`1px solid rgba(239, 68, 68, 0.25)`,borderRadius:20,padding:`3px 10px`,fontSize:11,fontWeight:600,marginBottom:8},children:`📷 Camera Disabled (No-Cam Mode)`}),(0,G.jsx)(`p`,{style:{margin:0,fontSize:13,fontWeight:500,color:`#e2e8f0`},children:`HUD & Hotkeys work even without camera enabled!`}),(0,G.jsx)(`p`,{style:{margin:`6px 0 0 0`,fontSize:11,color:`#94a3b8`},children:`Memes play in your screen overlay with sound. Click “Start Camera Stream” whenever you want to test stamping onto the remote video feed.`})]})]}),(0,G.jsx)(`h2`,{children:`Real-time Event Log`}),(0,G.jsx)(`div`,{style:{background:`rgba(0,0,0,0.4)`,borderRadius:10,padding:12,height:180,overflowY:`auto`,fontFamily:`monospace`,fontSize:12},children:r.map((e,t)=>(0,G.jsx)(`div`,{style:{color:`#38bdf8`,marginBottom:4},children:e},t))})]})]})]})},q=document.getElementById(`root`);q&&y.createRoot(q).render((0,G.jsx)(v.StrictMode,{children:(0,G.jsx)(K,{})}));