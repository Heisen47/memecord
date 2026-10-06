import { MemeItem, MemeOverlayPosition } from '../shared/types';

interface DecodedFrame {
  bitmap: ImageBitmap;
  durationMs: number;
}

class GifAnimationPlayer {
  public frames: DecodedFrame[] = [];
  public totalDurationMs: number = 0;
  public isComplete: boolean = false;
  public hasFrames: boolean = false;
  private aborted: boolean = false;

  async load(assetUrl: string): Promise<boolean> {
    if (typeof (window as any).ImageDecoder === 'undefined') {
      return false;
    }

    try {
      let buffer: ArrayBuffer;

      if (assetUrl.startsWith('data:')) {
        const base64Index = assetUrl.indexOf(',');
        if (base64Index !== -1) {
          const base64 = assetUrl.slice(base64Index + 1);
          const binaryString = atob(base64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          buffer = bytes.buffer;
        } else {
          const resp = await fetch(assetUrl);
          buffer = await resp.arrayBuffer();
        }
      } else {
        const resp = await fetch(assetUrl);
        buffer = await resp.arrayBuffer();
      }

      if (this.aborted) return false;

      const mimeType = assetUrl.includes('webp') ? 'image/webp' : 'image/gif';
      const decoder = new (window as any).ImageDecoder({
        data: buffer,
        type: mimeType
      });

      await decoder.tracks.ready;
      if (this.aborted) {
        try {
          decoder.close();
        } catch (_) {}
        return false;
      }

      const track = decoder.tracks.selectedTrack;
      const expectedCount = track ? track.frameCount : 0;

      // Decode frame 0 first for instant availability
      try {
        const first = await decoder.decode({ frameIndex: 0 });
        if (this.aborted) {
          first.image.close();
          try {
            decoder.close();
          } catch (_) {}
          return false;
        }
        const firstDurUs = first.image.duration;
        const firstDurMs = firstDurUs && firstDurUs > 0 ? firstDurUs / 1000 : 100;
        const firstBitmap = await createImageBitmap(first.image);
        first.image.close();

        this.frames.push({ bitmap: firstBitmap, durationMs: firstDurMs });
        this.totalDurationMs += firstDurMs;
        this.hasFrames = true;
      } catch (err) {
        console.warn('[Memecord] First frame decode error:', err);
        try {
          decoder.close();
        } catch (_) {}
        return false;
      }

      // If only 1 frame (static image), complete immediately
      if (expectedCount === 1) {
        this.isComplete = true;
        try {
          decoder.close();
        } catch (_) {}
        return true;
      }

      // Decode remaining frames asynchronously in background (capped at 120 frames to conserve memory)
      (async () => {
        let frameIdx = 1;
        const maxFrames = 120;
        while (!this.aborted && frameIdx < maxFrames) {
          try {
            const result = await decoder.decode({ frameIndex: frameIdx });
            if (this.aborted) {
              result.image.close();
              break;
            }
            const durUs = result.image.duration;
            const durMs = durUs && durUs > 0 ? durUs / 1000 : 100;
            const bitmap = await createImageBitmap(result.image);
            result.image.close();

            this.frames.push({ bitmap, durationMs: durMs });
            this.totalDurationMs += durMs;
            frameIdx++;

            if (decoder.complete && expectedCount > 0 && frameIdx >= expectedCount) {
              break;
            }
          } catch (_) {
            break;
          }
        }
        this.isComplete = true;
        try {
          decoder.close();
        } catch (_) {}
      })();

      return true;
    } catch (e) {
      console.warn('[Memecord] ImageDecoder init failed:', e);
      return false;
    }
  }

  getCurrentFrame(elapsedMs: number): ImageBitmap | null {
    if (this.frames.length === 0) return null;
    if (this.frames.length === 1 || this.totalDurationMs <= 0) return this.frames[0].bitmap;

    const loopTime = elapsedMs % this.totalDurationMs;
    let accumulated = 0;
    for (let i = 0; i < this.frames.length; i++) {
      accumulated += this.frames[i].durationMs;
      if (loopTime < accumulated) {
        return this.frames[i].bitmap;
      }
    }
    return this.frames[this.frames.length - 1].bitmap;
  }

  destroy() {
    this.aborted = true;
    for (const f of this.frames) {
      try {
        f.bitmap.close();
      } catch (_) {}
    }
    this.frames = [];
  }
}

interface ActiveCameraMeme {
  meme: MemeItem;
  startTime: number;
  durationMs: number;
  position: MemeOverlayPosition;
  gifPlayer: GifAnimationPlayer | null;
  videoEl: HTMLVideoElement | null;
  imgEl: HTMLImageElement | null;
  objectUrl: string | null;
}

(function initMemecordVirtualCamera() {
  if (typeof window === 'undefined' || (window as any).__MEMECORD_CAMERA_INJECTED__) {
    return;
  }
  (window as any).__MEMECORD_CAMERA_INJECTED__ = true;

  console.log('[Memecord] Virtual Camera Compositor active in page context');

  let activeMeme: ActiveCameraMeme | null = null;
  let currentPosition: MemeOverlayPosition = 'center';

  function getOrCreatePipelineContainer(): HTMLElement {
    let container = document.getElementById('memecord-pipeline-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'memecord-pipeline-container';
      container.setAttribute('aria-hidden', 'true');
      // Positioned in viewport with tiny 0.01 opacity so Blink compositor treats it as active visible layer
      container.style.cssText =
        'position:fixed;bottom:0;right:0;width:4px;height:4px;opacity:0.01;pointer-events:none;overflow:hidden;z-index:-999999;contain:strict;';
      (document.body || document.documentElement).appendChild(container);
    }
    return container;
  }

  function cleanupActiveMeme() {
    if (!activeMeme) return;
    try {
      if (activeMeme.gifPlayer) {
        activeMeme.gifPlayer.destroy();
      }
      if (activeMeme.videoEl) {
        activeMeme.videoEl.pause();
        activeMeme.videoEl.src = '';
        activeMeme.videoEl.remove();
      }
      if (activeMeme.objectUrl) {
        URL.revokeObjectURL(activeMeme.objectUrl);
      }
      if (activeMeme.imgEl) {
        activeMeme.imgEl.remove();
      }
    } catch (_) {}
    activeMeme = null;
  }

  // Listen for trigger events from Memecord content script
  window.addEventListener('message', (event) => {
    if (!event.data || event.data.source !== 'MEMECORD_CONTENT') return;

    if (event.data.type === 'TRIGGER_CAMERA_MEME' && event.data.meme) {
      const meme = event.data.meme as MemeItem;
      const position = event.data.position || currentPosition;
      activateMeme(meme, position);
    }

    if (event.data.type === 'UPDATE_CAMERA_SETTINGS') {
      if (event.data.position) {
        currentPosition = event.data.position;
      }
    }
  });

  async function activateMeme(meme: MemeItem, position: MemeOverlayPosition) {
    cleanupActiveMeme();

    const assetUrl = meme.assetUrl;
    const isVideo = assetUrl.startsWith('data:video/') || assetUrl.endsWith('.mp4') || assetUrl.endsWith('.webm');
    const container = getOrCreatePipelineContainer();

    let gifPlayer: GifAnimationPlayer | null = null;
    let videoEl: HTMLVideoElement | null = null;
    let imgEl: HTMLImageElement | null = null;
    let objectUrl: string | null = null;

    if (isVideo) {
      const video = document.createElement('video');
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      (video as any).playsInline = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.crossOrigin = 'anonymous';

      if (assetUrl.startsWith('data:video/')) {
        try {
          const resp = await fetch(assetUrl);
          const blob = await resp.blob();
          objectUrl = URL.createObjectURL(blob);
          video.src = objectUrl;
        } catch (_) {
          video.src = assetUrl;
        }
      } else {
        video.src = assetUrl;
      }

      container.appendChild(video);
      video.play().catch((e) => console.warn('[Memecord Camera] Video play error:', e));
      videoEl = video;
    } else {
      // DOM fallback image element inside active viewport container
      const img = new Image();
      if (!assetUrl.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }
      img.src = assetUrl;
      container.appendChild(img);
      imgEl = img;

      // Primary high-precision frame player via WebCodecs ImageDecoder
      gifPlayer = new GifAnimationPlayer();
      gifPlayer.load(assetUrl);
    }

    activeMeme = {
      meme,
      startTime: performance.now(),
      durationMs: meme.durationMs || 2500,
      position,
      gifPlayer,
      videoEl,
      imgEl,
      objectUrl
    };

    console.log(`[Memecord Camera] Activated meme on camera feed: ${meme.name} (${isVideo ? 'Video' : 'GIF/Image'})`);
  }

  const activeAudioTrackIds = new Set<string>();
  const activeVideoTrackIds = new Set<string>();

  function broadcastCallStreamState() {
    const hasAudio = activeAudioTrackIds.size > 0;
    const hasVideo = activeVideoTrackIds.size > 0;
    const active = hasAudio || hasVideo;

    window.postMessage(
      {
        source: 'MEMECORD_CAMERA',
        type: 'CALL_STREAM_STATE',
        active,
        hasAudio,
        hasVideo
      },
      '*'
    );

    // Keep CAMERA_CALL_STATE in sync for backward compatibility
    window.postMessage(
      {
        source: 'MEMECORD_CAMERA',
        type: 'CAMERA_CALL_STATE',
        active: hasVideo
      },
      '*'
    );
  }

  function trackMediaStreamTracks(stream: MediaStream) {
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      activeAudioTrackIds.add(track.id);
      broadcastCallStreamState();

      const origStop = track.stop.bind(track);
      track.stop = () => {
        activeAudioTrackIds.delete(track.id);
        broadcastCallStreamState();
        origStop();
      };

      track.addEventListener('ended', () => {
        activeAudioTrackIds.delete(track.id);
        broadcastCallStreamState();
      });
    });

    stream.getVideoTracks().forEach((track) => {
      activeVideoTrackIds.add(track.id);
      broadcastCallStreamState();

      const origStop = track.stop.bind(track);
      track.stop = () => {
        activeVideoTrackIds.delete(track.id);
        broadcastCallStreamState();
        origStop();
      };

      track.addEventListener('ended', () => {
        activeVideoTrackIds.delete(track.id);
        broadcastCallStreamState();
      });
    });
  }

  // Hook WebRTC RTCPeerConnection to detect ongoing calls even without camera
  if (typeof window !== 'undefined' && (window as any).RTCPeerConnection) {
    try {
      const OrigPeerConnection = (window as any).RTCPeerConnection;
      const activeConnections = new Set<any>();

      const broadcastWebRtcState = () => {
        window.postMessage(
          {
            source: 'MEMECORD_CAMERA',
            type: 'WEBRTC_CALL_STATE',
            active: activeConnections.size > 0
          },
          '*'
        );
      };

      const WrappedRTCPeerConnection = function (this: any, ...args: any[]) {
        const pc = new OrigPeerConnection(...args);

        const checkConnection = () => {
          const isConnected =
            pc.connectionState === 'connected' ||
            pc.iceConnectionState === 'connected' ||
            pc.iceConnectionState === 'completed';

          const isTerminated =
            pc.connectionState === 'closed' ||
            pc.connectionState === 'failed' ||
            pc.connectionState === 'disconnected' ||
            pc.iceConnectionState === 'closed' ||
            pc.iceConnectionState === 'failed' ||
            pc.iceConnectionState === 'disconnected';

          if (isConnected) {
            activeConnections.add(pc);
            broadcastWebRtcState();
          } else if (isTerminated) {
            if (activeConnections.has(pc)) {
              activeConnections.delete(pc);
              broadcastWebRtcState();
            }
          }
        };

        pc.addEventListener('connectionstatechange', checkConnection);
        pc.addEventListener('iceconnectionstatechange', checkConnection);

        const origClose = pc.close.bind(pc);
        pc.close = function () {
          activeConnections.delete(pc);
          broadcastWebRtcState();
          return origClose();
        };

        return pc;
      };

      WrappedRTCPeerConnection.prototype = OrigPeerConnection.prototype;
      Object.assign(WrappedRTCPeerConnection, OrigPeerConnection);
      (window as any).RTCPeerConnection = WrappedRTCPeerConnection;
    } catch (_) {}
  }

  // Helper to wrap getUserMedia stream with canvas compositor
  async function wrapStreamWithCompositor(
    realStream: MediaStream,
    constraints?: MediaStreamConstraints
  ): Promise<MediaStream> {
    trackMediaStreamTracks(realStream);

    if (!constraints || !constraints.video) {
      return realStream;
    }

    const realVideoTrack = realStream.getVideoTracks()[0];
    if (!realVideoTrack) {
      return realStream;
    }

    console.log('[Memecord Camera] Stamping virtual compositor onto webcam stream...');

    // Pipeline container in DOM to ensure Chrome continuously decodes video frames without throttling
    const pipelineContainer = getOrCreatePipelineContainer();

    // Hidden video element to play incoming webcam stream
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    (video as any).playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.srcObject = new MediaStream([realVideoTrack]);
    pipelineContainer.appendChild(video);

    await new Promise<void>((resolve) => {
      video.onloadedmetadata = () => resolve();
      setTimeout(resolve, 600);
    });
    await video.play().catch(() => {});

    // Create compositing canvas matching video dimensions
    const canvas = document.createElement('canvas');
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;
    pipelineContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      return realStream;
    }

    const renderingCtx = ctx;
    let isStreaming = true;
    let animId: number;
    let lastDrawTime = performance.now();

    function drawFrame() {
      if (!isStreaming) return;
      lastDrawTime = performance.now();

      // Ensure canvas matches video resolution if resolution changes dynamically
      if (video.videoWidth && canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw raw camera video frame
      if (video.readyState >= 2) {
        renderingCtx.drawImage(video, 0, 0, width, height);
      } else {
        renderingCtx.fillStyle = '#0f172a';
        renderingCtx.fillRect(0, 0, width, height);
      }

      // 2. Draw active meme on top of camera frame
      if (activeMeme) {
        const now = performance.now();
        const elapsed = now - activeMeme.startTime;

        if (elapsed > activeMeme.durationMs) {
          cleanupActiveMeme();
        } else {
          drawMemeOverlay(renderingCtx, width, height, activeMeme, elapsed);
        }
      }

      animId = requestAnimationFrame(drawFrame);
    }

    drawFrame();

    // Fallback interval to guarantee frame advances even if browser tab is backgrounded / throttled
    const fallbackInterval = setInterval(() => {
      if (!isStreaming) {
        clearInterval(fallbackInterval);
        return;
      }
      const now = performance.now();
      if (now - lastDrawTime > 45) {
        drawFrame();
      }
    }, 33);

    // Capture 30 FPS virtual camera stream
    const virtualStream = canvas.captureStream(30);
    const virtualVideoTrack = virtualStream.getVideoTracks()[0];

    // Mirror settings, capabilities, constraints, and deviceId so Meet/Discord accept it as native hardware
    const realSettings = realVideoTrack.getSettings ? realVideoTrack.getSettings() : {};
    const realCapabilities = realVideoTrack.getCapabilities ? realVideoTrack.getCapabilities() : {};

    virtualVideoTrack.getSettings = () => ({
      ...realSettings,
      width: canvas.width,
      height: canvas.height,
      frameRate: 30
    });

    virtualVideoTrack.getCapabilities = () => ({
      ...realCapabilities
    });

    virtualVideoTrack.getConstraints = () => {
      return realVideoTrack.getConstraints ? realVideoTrack.getConstraints() : {};
    };

    virtualVideoTrack.applyConstraints = async (c) => {
      if (realVideoTrack.applyConstraints) {
        await realVideoTrack.applyConstraints(c);
      }
    };

    try {
      Object.defineProperty(virtualVideoTrack, 'label', {
        value: realVideoTrack.label || 'Camera',
        writable: true
      });
    } catch (_) {}

    // Support track.clone() used internally by Google Meet and Zoom
    const origClone = virtualVideoTrack.clone.bind(virtualVideoTrack);
    virtualVideoTrack.clone = () => {
      const cloned = origClone();
      cloned.getSettings = virtualVideoTrack.getSettings;
      cloned.getCapabilities = virtualVideoTrack.getCapabilities;
      cloned.getConstraints = virtualVideoTrack.getConstraints;
      cloned.applyConstraints = virtualVideoTrack.applyConstraints;
      return cloned;
    };

    // Track active video track
    activeVideoTrackIds.add(virtualVideoTrack.id);
    activeVideoTrackIds.add(realVideoTrack.id);
    broadcastCallStreamState();

    // Handle track stop cleanup (turn off hardware webcam when user mutes camera)
    const origStop = virtualVideoTrack.stop.bind(virtualVideoTrack);
    virtualVideoTrack.stop = () => {
      isStreaming = false;
      cancelAnimationFrame(animId);
      clearInterval(fallbackInterval);
      cleanupActiveMeme();
      realVideoTrack.stop();
      video.srcObject = null;
      if (video.parentElement) video.remove();
      if (canvas.parentElement) canvas.remove();
      activeVideoTrackIds.delete(realVideoTrack.id);
      activeVideoTrackIds.delete(virtualVideoTrack.id);
      broadcastCallStreamState();
      origStop();
    };

    realVideoTrack.onended = () => {
      virtualVideoTrack.stop();
    };

    // Combine virtual video track with real audio tracks
    return new MediaStream([virtualVideoTrack, ...realStream.getAudioTracks()]);
  }

  // Hook navigator.mediaDevices.getUserMedia and MediaDevices.prototype.getUserMedia
  if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

    const hookedGetUserMedia = async function (constraints?: MediaStreamConstraints): Promise<MediaStream> {
      const realStream = await originalGetUserMedia(constraints);
      return wrapStreamWithCompositor(realStream, constraints);
    };

    navigator.mediaDevices.getUserMedia = hookedGetUserMedia;

    if ((window as any).MediaDevices && (window as any).MediaDevices.prototype) {
      (window as any).MediaDevices.prototype.getUserMedia = hookedGetUserMedia;
    }
  }

  // Hook legacy navigator.getUserMedia and navigator.webkitGetUserMedia
  if (typeof navigator !== 'undefined') {
    const nav = navigator as any;
    if (nav.getUserMedia) {
      const origNavGetUserMedia = nav.getUserMedia.bind(nav);
      nav.getUserMedia = function (
        constraints: any,
        success: (stream: MediaStream) => void,
        error: (err: any) => void
      ) {
        origNavGetUserMedia(
          constraints,
          async (realStream: MediaStream) => {
            const wrapped = await wrapStreamWithCompositor(realStream, constraints);
            success(wrapped);
          },
          error
        );
      };
    }
    if (nav.webkitGetUserMedia) {
      const origWebkitGetUserMedia = nav.webkitGetUserMedia.bind(nav);
      nav.webkitGetUserMedia = function (
        constraints: any,
        success: (stream: MediaStream) => void,
        error: (err: any) => void
      ) {
        origWebkitGetUserMedia(
          constraints,
          async (realStream: MediaStream) => {
            const wrapped = await wrapStreamWithCompositor(realStream, constraints);
            success(wrapped);
          },
          error
        );
      };
    }
  }

  function drawMemeOverlay(
    ctx: CanvasRenderingContext2D,
    canvasW: number,
    canvasH: number,
    item: ActiveCameraMeme,
    elapsed: number
  ) {
    const { meme, durationMs, position, gifPlayer, videoEl, imgEl } = item;

    // Determine active visual frame
    let drawable: CanvasImageSource | null = null;
    let naturalW = 400;
    let naturalH = 300;

    if (videoEl) {
      // Ensure video is actively playing and synchronized
      if (videoEl.paused && videoEl.readyState >= 2) {
        videoEl.play().catch(() => {});
      }
      if (videoEl.duration && Number.isFinite(videoEl.duration) && videoEl.duration > 0) {
        const targetTime = (elapsed / 1000) % videoEl.duration;
        if (Math.abs(videoEl.currentTime - targetTime) > 0.4) {
          try {
            videoEl.currentTime = targetTime;
          } catch (_) {}
        }
      }
      if (videoEl.readyState >= 2 && videoEl.videoWidth > 0) {
        drawable = videoEl;
        naturalW = videoEl.videoWidth;
        naturalH = videoEl.videoHeight;
      }
    } else if (gifPlayer && gifPlayer.hasFrames) {
      const frame = gifPlayer.getCurrentFrame(elapsed);
      if (frame) {
        drawable = frame;
        naturalW = frame.width;
        naturalH = frame.height;
      }
    }

    // Fallback to DOM img if ImageDecoder frames not ready yet or unsupported
    if (!drawable && imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
      drawable = imgEl;
      naturalW = imgEl.naturalWidth;
      naturalH = imgEl.naturalHeight;
    }

    if (!drawable) {
      return; // Skip rendering until at least one frame is decoded/ready
    }

    let scale = 1;
    let alpha = 1;

    if (elapsed < 160) {
      const p = elapsed / 160;
      scale = 0.6 + 0.4 * Math.sin((p * Math.PI) / 2);
      alpha = p;
    } else if (elapsed > durationMs - 200) {
      const p = (durationMs - elapsed) / 200;
      alpha = Math.max(0, p);
      scale = 0.9 + 0.1 * p;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Calculate dimensions: meme takes ~52% of video height
    const maxH = canvasH * 0.52;
    const maxW = canvasW * 0.48;

    const aspect = naturalW / naturalH;
    let memeW = maxW;
    let memeH = memeW / aspect;

    if (memeH > maxH) {
      memeH = maxH;
      memeW = memeH * aspect;
    }

    const scaledW = memeW * scale;
    const scaledH = memeH * scale;

    let x = (canvasW - scaledW) / 2;
    let y = (canvasH - scaledH) / 2;

    switch (position) {
      case 'top-center':
        x = (canvasW - scaledW) / 2;
        y = canvasH * 0.05;
        break;
      case 'top-right':
        x = canvasW - scaledW - canvasW * 0.05;
        y = canvasH * 0.05;
        break;
      case 'bottom-right':
        x = canvasW - scaledW - canvasW * 0.05;
        y = canvasH - scaledH - canvasH * 0.12;
        break;
      case 'center':
      default:
        x = (canvasW - scaledW) / 2;
        y = (canvasH - scaledH) / 2 - canvasH * 0.03;
        break;
    }

    const radius = 16;

    // 1. Glowing background shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12;

    // 2. Background container
    ctx.beginPath();
    roundRect(ctx, x, y, scaledW, scaledH, radius);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // 3. Draw media (ImageBitmap, HTMLVideoElement, or HTMLImageElement)
    ctx.save();
    ctx.beginPath();
    roundRect(ctx, x, y, scaledW, scaledH, radius);
    ctx.clip();

    try {
      ctx.drawImage(drawable, x, y, scaledW, scaledH);
    } catch (e) {
      console.warn('[Memecord Camera] Error drawing meme:', e);
    }

    ctx.restore();

    // 4. Draw outer border
    ctx.beginPath();
    roundRect(ctx, x, y, scaledW, scaledH, radius);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.stroke();

    // 5. Title Pill
    const titleText = meme.name;
    ctx.font = `bold ${Math.max(12, Math.round(canvasH * 0.026))}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    const textWidth = ctx.measureText(titleText).width;
    const pillW = textWidth + 24;
    const pillH = Math.max(22, Math.round(canvasH * 0.04));
    const pillX = x + (scaledW - pillW) / 2;
    const pillY = y + scaledH + 8;

    ctx.beginPath();
    roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(titleText, pillX + pillW / 2, pillY + pillH / 2);

    ctx.restore();
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
})();
