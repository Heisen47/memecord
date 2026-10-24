import { fetchMediaDataUrl } from '../shared/media-resolver';

// Lucide-style 24x24 stroke icons, kept inline so the HUD has no asset dependencies
const ICON_PATHS = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  pencil: '<path d="M21.17 6.81a2.83 2.83 0 0 0-4-4L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/>',
  minus: '<path d="M5 12h14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  play: '<path d="M6 4v16a1 1 0 0 0 1.5.86l13-8a1 1 0 0 0 0-1.72l-13-8A1 1 0 0 0 6 4z"/>',
  keyboard: '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M10 13h4"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>'
} as const;

export type IconName = keyof typeof ICON_PATHS;

export function icon(name: IconName, size = 16): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function resolveAssetUrl(assetUrl: string): string {
  if (!assetUrl) return '';
  if (assetUrl.startsWith('http://') || assetUrl.startsWith('https://') || assetUrl.startsWith('data:')) {
    return assetUrl;
  }
  if (typeof chrome !== 'undefined' && chrome.runtime?.id && chrome.runtime.getURL) {
    try {
      return chrome.runtime.getURL(assetUrl.replace(/^\//, ''));
    } catch (_) {}
  }
  return assetUrl.startsWith('/') ? assetUrl : `/${assetUrl}`;
}

export function isVideoAsset(url: string): boolean {
  return url.startsWith('data:video/') || /\.(mp4|webm)(\?|#|$)/i.test(url);
}

const PLACEHOLDER_THUMB =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7180' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21'/%3E%3C/svg%3E";

/**
 * Builds an <img>/<video> preview for a meme asset. Remote images blocked by the
 * call site's CSP are retried through the background proxy as a data URL.
 */
export function createMediaThumb(
  assetUrl: string,
  alt: string,
  className?: string,
  onFail?: (reason: string) => void
): HTMLImageElement | HTMLVideoElement {
  const src = resolveAssetUrl(assetUrl);

  if (isVideoAsset(src)) {
    const video = el('video', className);
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    if (onFail) {
      video.onerror = () => onFail(`the video can't be played (${video.error?.message || 'unsupported format'})`);
    }
    return video;
  }

  const img = el('img', className);
  img.alt = alt;
  img.decoding = 'async';
  img.referrerPolicy = 'no-referrer';
  let retried = false;
  let proxyError = '';
  img.onerror = async () => {
    // The page's CSP often blocks remote images: retry through the extension background
    if (!retried && src.startsWith('http')) {
      retried = true;
      const res = await fetchMediaDataUrl(src);
      if (res.dataUrl) {
        img.src = res.dataUrl;
        return;
      }
      proxyError = res.error || '';
    }
    img.onerror = null;
    if (onFail) {
      onFail(
        proxyError ||
          (src.startsWith('data:')
            ? "the file is corrupted or isn't a supported image format"
            : 'the page blocked the image and it could not be loaded another way')
      );
      return;
    }
    img.src = PLACEHOLDER_THUMB;
  };
  img.src = src;
  return img;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error || new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

export function nameFromFilename(filename: string): string {
  return filename
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
