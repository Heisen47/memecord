import { MemeItem, MemeOverlayPosition } from '../shared/types';

interface ActiveCameraMeme {
  meme: MemeItem;
  startTime: number;
  durationMs: number;
  mediaEl: HTMLImageElement | HTMLVideoElement;
  loaded: boolean;
  position: MemeOverlayPosition;
}

(function initMemecordVirtualCamera() {
  if (typeof window === 'undefined' || (window as any).__MEMECORD_CAMERA_INJECTED__) {
    return;
  }
  (window as any).__MEMECORD_CAMERA_INJECTED__ = true;

  console.log('[Memecord] Virtual Camera Compositor initializing in page context...');

  let activeMeme: ActiveCameraMeme | null = null;
  let currentPosition: MemeOverlayPosition = 'center';

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

  function activateMeme(meme: MemeItem, position: MemeOverlayPosition) {
    const assetUrl = meme.assetUrl;
    const isVideo = assetUrl.startsWith('data:video/') || assetUrl.endsWith('.mp4') || assetUrl.endsWith('.webm');

    let mediaEl: HTMLImageElement | HTMLVideoElement;
    let loaded = false;

    if (isVideo) {
      const video = document.createElement('video');
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      (video as any).playsInline = true;
      video.src = assetUrl;
      video.onloadeddata = () => {
        loaded = true;
      };
      video.play().catch(() => {});
      mediaEl = video;
    } else {
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.src = assetUrl;
      img.onload = () => {
        loaded = true;
      };
      if (img.complete) {
        loaded = true;
      }
      mediaEl = img;
    }

    activeMeme = {
      meme,
      startTime: performance.now(),
      durationMs: meme.durationMs || 2500,
      mediaEl,
      loaded,
      position
    };
  }

  // Hook navigator.mediaDevices.getUserMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

    navigator.mediaDevices.getUserMedia = async function (constraints?: MediaStreamConstraints): Promise<MediaStream> {
      // If video not requested, return raw audio stream
      if (!constraints || !constraints.video) {
        return originalGetUserMedia(constraints);
      }

      console.log('[Memecord] Intercepting getUserMedia for camera meme composite...', constraints);

      const realStream = await originalGetUserMedia(constraints);
      const realVideoTrack = realStream.getVideoTracks()[0];

      if (!realVideoTrack) {
        return realStream;
      }

      // Hidden video element to play incoming webcam stream
      const video = document.createElement('video');
      video.autoplay = true;
      video.muted = true;
      (video as any).playsInline = true;
      video.srcObject = new MediaStream([realVideoTrack]);

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
        setTimeout(resolve, 800); // fallback
      });
      video.play().catch(() => {});

      // Create compositing canvas matching video dimensions
      const canvas = document.createElement('canvas');
      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 720;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        return realStream;
      }

      const renderingCtx = ctx;
      let isStreaming = true;
      let animId: number;

      function drawFrame() {
        if (!isStreaming) return;

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
        }

        // 2. Draw active meme on top of camera frame
        if (activeMeme) {
          const now = performance.now();
          const elapsed = now - activeMeme.startTime;

          if (elapsed > activeMeme.durationMs) {
            activeMeme = null;
          } else {
            drawMemeOverlay(renderingCtx, width, height, activeMeme, elapsed);
          }
        }

        animId = requestAnimationFrame(drawFrame);
      }

      drawFrame();

      // Capture 30 FPS virtual camera stream
      const virtualStream = canvas.captureStream(30);
      const virtualVideoTrack = virtualStream.getVideoTracks()[0];

      // Clone label and capabilities
      try {
        Object.defineProperty(virtualVideoTrack, 'label', {
          value: realVideoTrack.label || 'Memecord Camera'
        });
      } catch (_) {}

      // Handle track stop cleanup (turn off hardware webcam when muted in call)
      const origStop = virtualVideoTrack.stop.bind(virtualVideoTrack);
      virtualVideoTrack.stop = () => {
        isStreaming = false;
        cancelAnimationFrame(animId);
        realVideoTrack.stop();
        video.srcObject = null;
        origStop();
      };

      realVideoTrack.onended = () => {
        virtualVideoTrack.stop();
      };

      // Combine virtual video track with real audio tracks
      return new MediaStream([virtualVideoTrack, ...realStream.getAudioTracks()]);
    };

    console.log('[Memecord] Camera stream compositor hooked successfully.');
  }

  function drawMemeOverlay(
    ctx: CanvasRenderingContext2D,
    canvasW: number,
    canvasH: number,
    item: ActiveCameraMeme,
    elapsed: number
  ) {
    const { mediaEl, meme, durationMs, position } = item;

    // Animation progress
    // Scale in over first 150ms, fade out over last 200ms
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

    // Calculate dimensions: meme takes ~50% of video height
    const maxH = canvasH * 0.52;
    const maxW = canvasW * 0.48;

    let naturalW = 400;
    let naturalH = 300;

    if (mediaEl instanceof HTMLImageElement && mediaEl.naturalWidth) {
      naturalW = mediaEl.naturalWidth;
      naturalH = mediaEl.naturalHeight;
    } else if (mediaEl instanceof HTMLVideoElement && mediaEl.videoWidth) {
      naturalW = mediaEl.videoWidth;
      naturalH = mediaEl.videoHeight;
    }

    const aspect = naturalW / naturalH;
    let memeW = maxW;
    let memeH = memeW / aspect;

    if (memeH > maxH) {
      memeH = maxH;
      memeW = memeH * aspect;
    }

    // Apply scale animation
    const scaledW = memeW * scale;
    const scaledH = memeH * scale;

    // Calculate position
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

    // 1. Draw glowing background shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12;

    // 2. Draw border container
    ctx.beginPath();
    roundRect(ctx, x, y, scaledW, scaledH, radius);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    // Reset shadow for image
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // 3. Draw media (image or video) clipped to rounded rectangle
    ctx.save();
    ctx.beginPath();
    roundRect(ctx, x, y, scaledW, scaledH, radius);
    ctx.clip();

    try {
      ctx.drawImage(mediaEl, x, y, scaledW, scaledH);
    } catch (_) {}

    ctx.restore();

    // 4. Draw outer border
    ctx.beginPath();
    roundRect(ctx, x, y, scaledW, scaledH, radius);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.stroke();

    // 5. Draw Title Pill below meme
    const titleText = `${meme.emoji || '✨'} ${meme.name}`;
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
