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
      routeMemeToCall(meme.durationMs || 2500);
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

  // ---- Delivery to the call --------------------------------------------------
  const allPeerConnections = new Set<any>();
  // outgoing (composited / cloned) camera track -> the raw camera track behind it
  const rawCameraFor = new Map<MediaStreamTrack, MediaStreamTrack>();
  const cleanStreams = new Map<MediaStreamTrack, MediaStream>();
  const savedSelfViews = new Map<HTMLVideoElement, MediaProvider | null>();
  let selfViewTimer: any = null;
  let selfViewUntil = 0;

  type DeliveryMode = 'camera' | 'virtual' | 'none';

  function postDelivery(mode: DeliveryMode, reason?: string) {
    const msg = { source: 'MEMECORD_CAMERA', type: 'MEME_DELIVERY', mode, reason };
    const targets = new Set<Window>([window]);
    try {
      if (window.parent) targets.add(window.parent);
      if (window.top) targets.add(window.top);
    } catch (_) {}
    targets.forEach((w) => {
      try {
        w.postMessage(msg, '*');
      } catch (_) {}
    });
  }

  /**
   * While a meme is up, point your own video tile at the raw camera so you don't see a
   * mirrored second copy (the meme is already shown to you, un-mirrored, by the HUD).
   * The outgoing stream the call sends is untouched.
   */
  function applyCleanSelfView() {
    document.querySelectorAll('video').forEach((v) => {
      if (v.hasAttribute('data-memecord-keep')) return;
      const src = v.srcObject;
      if (!(src instanceof MediaStream)) return;
      for (const track of src.getVideoTracks()) {
        const raw = rawCameraFor.get(track);
        if (!raw || raw.readyState === 'ended') continue;
        let clean = cleanStreams.get(raw);
        if (!clean) {
          clean = new MediaStream([raw]);
          cleanStreams.set(raw, clean);
        }
        if (!savedSelfViews.has(v)) savedSelfViews.set(v, src);
        v.srcObject = clean;
        v.play().catch(() => {});
        break;
      }
    });
  }

  function restoreSelfViews() {
    if (selfViewTimer) clearInterval(selfViewTimer);
    selfViewTimer = null;
    savedSelfViews.forEach((original, v) => {
      if (!v.isConnected) return;
      v.srcObject = original as MediaStream | null;
      v.play().catch(() => {});
    });
    savedSelfViews.clear();
  }

  function holdCleanSelfView(durationMs: number) {
    selfViewUntil = performance.now() + durationMs + 350;
    applyCleanSelfView();
    if (!selfViewTimer) {
      selfViewTimer = setInterval(() => {
        if (performance.now() > selfViewUntil) restoreSelfViews();
        else applyCleanSelfView();
      }, 300);
    }
  }

  /** Video senders that are currently sending nothing (camera off / muted) */
  function idleVideoSenders(): RTCRtpSender[] {
    const out: RTCRtpSender[] = [];
    allPeerConnections.forEach((pc) => {
      let transceivers: RTCRtpTransceiver[] = [];
      try {
        transceivers = pc.getTransceivers();
      } catch (_) {}
      transceivers.forEach((t) => {
        const sender = t.sender;
        if (!sender || t.receiver?.track?.kind !== 'video') return;
        const dir = (t as any).currentDirection ?? t.direction;
        if (dir === 'recvonly' || dir === 'inactive' || (dir as string) === 'stopped') return;
        const track = sender.track;
        const idle =
          !track ||
          track.readyState === 'ended' ||
          (outgoingVideoTracks.has(track) && !track.enabled);
        if (idle) out.push(sender);
      });
    });
    return out;
  }

  interface VirtualSession {
    track: MediaStreamTrack;
    drawTimer: any;
    endTimer: any;
    swapped: Map<RTCRtpSender, MediaStreamTrack | null>;
  }
  let virtualSession: VirtualSession | null = null;

  function endVirtualSession() {
    const session = virtualSession;
    if (!session) return;
    virtualSession = null;
    clearInterval(session.drawTimer);
    clearTimeout(session.endTimer);
    session.swapped.forEach((previous, sender) => {
      const restore = previous && previous.readyState !== 'ended' ? previous : null;
      sender.replaceTrack(restore).catch(() => {});
    });
    session.track.stop();
  }

  /**
   * Camera off: briefly hand the call a meme-only video (dark background + the meme) in
   * place of "no video", then restore whatever the sender had before.
   */
  async function deliverViaVirtualVideo(durationMs: number): Promise<{ ok: true } | { ok: false; reason: string }> {
    const senders = idleVideoSenders().filter((s) => !virtualSession?.swapped.has(s));
    if (!senders.length && !virtualSession) {
      return {
        ok: false,
        reason:
          allPeerConnections.size === 0
            ? 'no call connection found in this tab yet'
            : 'the call has no open video channel while your camera is off — turn your camera on so others see memes'
      };
    }

    if (!virtualSession) {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return { ok: false, reason: 'this browser blocked the drawing surface needed to send the meme' };

      const draw = () => {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#171a24');
        grad.addColorStop(1, '#0b0d12');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (activeMeme) {
          const elapsed = performance.now() - activeMeme.startTime;
          if (elapsed > activeMeme.durationMs) cleanupActiveMeme();
          else drawMemeOverlay(ctx, canvas.width, canvas.height, activeMeme, elapsed);
        }
      };
      draw();

      const track = canvas.captureStream(30).getVideoTracks()[0];
      if (!track) return { ok: false, reason: 'this browser could not create a video track to send the meme' };
      virtualSession = { track, drawTimer: setInterval(draw, 33), endTimer: null, swapped: new Map() };
    }

    const session = virtualSession;
    let lastError = '';
    await Promise.all(
      senders.map(async (sender) => {
        const previous = sender.track;
        try {
          await sender.replaceTrack(session.track);
          session.swapped.set(sender, previous);
        } catch (err: any) {
          lastError = err?.message || String(err);
        }
      })
    );

    if (session.swapped.size === 0) {
      endVirtualSession();
      return { ok: false, reason: `the call app refused the video swap (${lastError || 'unknown error'})` };
    }
    clearTimeout(session.endTimer);
    session.endTimer = setTimeout(endVirtualSession, durationMs + 350);
    return { ok: true };
  }

  function routeMemeToCall(durationMs: number) {
    if (outgoingVideoTracks.size > 0 && isOutgoingCameraOn()) {
      postDelivery('camera');
      holdCleanSelfView(durationMs);
      return;
    }
    deliverViaVirtualVideo(durationMs)
      .then((result) => {
        if (result.ok) postDelivery('virtual');
        // Frames with no call stay quiet; the HUD's timeout covers "no connection anywhere"
        else if (allPeerConnections.size > 0) postDelivery('none', result.reason);
      })
      .catch((err) => postDelivery('none', `unexpected error while sending the meme (${err?.message || err})`));
  }

  const activeAudioTrackIds = new Set<string>();
  const activeVideoTrackIds = new Set<string>();
  // Composited tracks handed to the call app (plus clones); apps often mute by toggling `enabled`
  const outgoingVideoTracks = new Set<MediaStreamTrack>();
  let lastBroadcastKey = '';

  function isOutgoingCameraOn(): boolean {
    let anyOn = false;
    outgoingVideoTracks.forEach((t) => {
      if (t.readyState === 'ended') {
        outgoingVideoTracks.delete(t);
      } else if (t.enabled) {
        anyOn = true;
      }
    });
    return anyOn;
  }

  function broadcastCallStreamState() {
    const hasAudio = activeAudioTrackIds.size > 0;
    const hasVideo = activeVideoTrackIds.size > 0 && (outgoingVideoTracks.size === 0 || isOutgoingCameraOn());
    lastBroadcastKey = `${hasAudio}|${hasVideo}`;
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

  // `enabled` flips fire no events, so poll cheaply and only broadcast on change
  setInterval(() => {
    if (outgoingVideoTracks.size === 0) return;
    const hasAudio = activeAudioTrackIds.size > 0;
    const hasVideo = activeVideoTrackIds.size > 0 && isOutgoingCameraOn();
    if (`${hasAudio}|${hasVideo}` !== lastBroadcastKey) broadcastCallStreamState();
  }, 1000);

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
        allPeerConnections.add(pc);

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
          allPeerConnections.delete(pc);
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
      outgoingVideoTracks.add(cloned);
      rawCameraFor.set(cloned, realVideoTrack);
      return cloned;
    };

    // Track active video track
    outgoingVideoTracks.add(virtualVideoTrack);
    rawCameraFor.set(virtualVideoTrack, realVideoTrack);
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
      outgoingVideoTracks.delete(virtualVideoTrack);
      rawCameraFor.delete(virtualVideoTrack);
      cleanStreams.delete(realVideoTrack);
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

    // Size relative to the video frame. Viewers often watch on a phone-sized tile, so the
    // meme gets most of the frame (less when parked in a corner) and the caption stays big.
    const corner = position === 'top-right' || position === 'bottom-right';
    const margin = Math.round(canvasH * 0.04);
    const pillH = Math.max(30, Math.round(canvasH * 0.07));
    const pillGap = Math.round(canvasH * 0.015);
    const maxH = canvasH * (corner ? 0.6 : 0.74) - pillH - pillGap;
    const maxW = canvasW * (corner ? 0.6 : 0.82);

    const aspect = naturalW / naturalH;
    let memeW = maxW;
    let memeH = memeW / aspect;

    if (memeH > maxH) {
      memeH = maxH;
      memeW = memeH * aspect;
    }

    const scaledW = memeW * scale;
    const scaledH = memeH * scale;
    // Block = meme + gap + caption pill, laid out as one unit so the caption never leaves the frame
    const blockH = scaledH + pillGap + pillH;

    let x = (canvasW - scaledW) / 2;
    let y = (canvasH - blockH) / 2;

    switch (position) {
      case 'top-center':
        y = margin;
        break;
      case 'top-right':
        x = canvasW - scaledW - margin;
        y = margin;
        break;
      case 'bottom-right':
        x = canvasW - scaledW - margin;
        y = canvasH - blockH - margin;
        break;
      case 'center':
      default:
        break;
    }
    y = Math.max(margin / 2, Math.min(y, canvasH - blockH - margin / 2));

    const radius = Math.max(16, Math.round(canvasH * 0.028));

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
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(drawable, x, y, scaledW, scaledH);
    } catch (e) {
      console.warn('[Memecord Camera] Error drawing meme:', e);
    }

    ctx.restore();

    // 4. Draw outer border
    ctx.beginPath();
    roundRect(ctx, x, y, scaledW, scaledH, radius);
    ctx.lineWidth = Math.max(3.5, canvasH * 0.007);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.stroke();

    // 5. Caption pill (bold, high contrast, truncated to fit the frame)
    ctx.font = `800 ${Math.max(16, Math.round(pillH * 0.56))}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    const padX = Math.round(pillH * 0.5);
    const maxTextW = canvasW * 0.9 - padX * 2;
    let titleText = meme.name;
    while (titleText.length > 3 && ctx.measureText(titleText).width > maxTextW) {
      titleText = titleText.slice(0, -2).trimEnd() + '…';
    }
    const pillW = ctx.measureText(titleText).width + padX * 2;
    const pillX = Math.max(margin / 2, Math.min(x + (scaledW - pillW) / 2, canvasW - pillW - margin / 2));
    const pillY = y + scaledH + pillGap;

    ctx.beginPath();
    roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = 'rgba(8, 10, 16, 0.92)';
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, canvasH * 0.003);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(titleText, pillX + pillW / 2, pillY + pillH / 2 + 1);

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
