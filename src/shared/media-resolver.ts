// Helper for resolving Tenor, Giphy, and web URLs to direct media

export interface ResolvedMedia {
  url: string;
  name?: string;
  emoji?: string;
  isVideo?: boolean;
}

const dataUrlCache = new Map<string, string>();

export function assignDefaultHotkey(index: number): string {
  if (index < 9) return String(index + 1); // 1-9
  if (index === 9) return '0';
  const letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F'];
  const letterIndex = index - 10;
  return letterIndex < letters.length ? letters[letterIndex] : '';
}

export function findFirstAvailableHotkey(existingMemes: { hotkey?: string }[]): string {
  const assigned = new Set(
    existingMemes
      .map((m, idx) => (m.hotkey || assignDefaultHotkey(idx)).trim().toUpperCase())
      .filter(Boolean)
  );
  const candidates = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M'
  ];
  for (const c of candidates) {
    if (!assigned.has(c)) return c;
  }
  return '';
}


export async function resolveMediaUrl(rawUrl: string): Promise<ResolvedMedia> {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    throw new Error('URL cannot be empty');
  }

  // Already a data URL
  if (trimmed.startsWith('data:')) {
    const isVideo = trimmed.startsWith('data:video/');
    return { url: trimmed, isVideo };
  }

  // Local extension asset
  if (trimmed.startsWith('memes/') || trimmed.startsWith('/memes/')) {
    return { url: trimmed, isVideo: false };
  }

  // Check if Tenor webpage link (e.g. tenor.com/view/xxx)
  if (trimmed.includes('tenor.com')) {
    // If already direct media link
    if (trimmed.includes('media.tenor.com') && (trimmed.endsWith('.gif') || trimmed.endsWith('.mp4') || trimmed.endsWith('.webp'))) {
      const isVideo = trimmed.endsWith('.mp4') || trimmed.endsWith('.webm');
      return { url: trimmed, isVideo };
    }

    // Call background to extract direct link from Tenor page
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'RESOLVE_TENOR_URL',
        url: trimmed
      });
      if (response && response.success && response.resolvedUrl) {
        return {
          url: response.resolvedUrl,
          name: response.name,
          emoji: '✨',
          isVideo: response.isVideo
        };
      }
    } catch (err) {
      console.warn('[Memecord] Background Tenor resolve failed, trying fallback slug:', err);
    }

    // Extract title fallback from slug: tenor.com/view/happy-cat-jumping-cat-gif-25608826
    const slugMatch = trimmed.match(/\/view\/([a-zA-Z0-9_-]+)/);
    let fallbackName = 'Tenor Meme';
    if (slugMatch && slugMatch[1]) {
      fallbackName = slugMatch[1]
        .replace(/-gif-\d+$/, '')
        .replace(/-gif$/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return { url: trimmed, name: fallbackName, isVideo: false };
  }

  // Check if Giphy webpage link (e.g. giphy.com/gifs/cat-12345)
  if (trimmed.includes('giphy.com/gifs/')) {
    const idMatch = trimmed.match(/-([a-zA-Z0-9]+)$/);
    if (idMatch && idMatch[1]) {
      const directUrl = `https://media.giphy.com/media/${idMatch[1]}/giphy.gif`;
      return { url: directUrl, isVideo: false };
    }
  }

  const isVideo = trimmed.endsWith('.mp4') || trimmed.endsWith('.webm');
  return { url: trimmed, isVideo };
}

export interface MediaLoadResult {
  dataUrl?: string;
  /** Plain-language reason when dataUrl is missing, shown to the user as-is */
  error?: string;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error || new Error('could not read the file'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Resolves any meme URL to a base64 data URL (no page CSP / CORS / canvas-tainting problems),
 * or says exactly why it couldn't.
 */
export async function fetchMediaDataUrl(mediaUrl: string): Promise<MediaLoadResult> {
  if (mediaUrl.startsWith('data:')) return { dataUrl: mediaUrl };
  const cached = dataUrlCache.get(mediaUrl);
  if (cached) return { dataUrl: cached };

  const isBundled = mediaUrl.startsWith('memes/') || mediaUrl.startsWith('/memes/');
  const inExtension = typeof chrome !== 'undefined' && Boolean(chrome.runtime?.id);

  // Bundled meme: read from the extension package (or the site root in the Test Lab / dev server)
  if (isBundled) {
    const path = mediaUrl.replace(/^\//, '');
    const url = inExtension && chrome.runtime.getURL ? chrome.runtime.getURL(path) : `/${path}`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) return { error: `bundled file ${path} is missing (HTTP ${resp.status})` };
      const dataUrl = await blobToDataUrl(await resp.blob());
      dataUrlCache.set(mediaUrl, dataUrl);
      return { dataUrl };
    } catch (err: any) {
      return { error: `couldn't read bundled file ${path}: ${err?.message || err}` };
    }
  }

  // Remote file: the background worker fetches it (it has host permissions and isn't bound by the page's CSP)
  if (!inExtension) {
    return { error: 'remote memes can only be loaded inside the installed extension' };
  }
  try {
    const res = await chrome.runtime.sendMessage({ type: 'FETCH_MEDIA_AS_DATA_URL', url: mediaUrl });
    if (res?.success && res.dataUrl) {
      dataUrlCache.set(mediaUrl, res.dataUrl);
      return { dataUrl: res.dataUrl };
    }
    return { error: res?.error || 'the extension returned no data' };
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (/context invalidated|receiving end does not exist/i.test(msg)) {
      return { error: 'the extension was reloaded or updated — refresh this tab and try again' };
    }
    return { error: `couldn't reach the extension background (${msg})` };
  }
}

export async function fetchAsDataUrl(mediaUrl: string): Promise<string> {
  const { dataUrl, error } = await fetchMediaDataUrl(mediaUrl);
  if (!dataUrl && error) console.warn('[Memecord] Could not load media:', mediaUrl, '-', error);
  return dataUrl || mediaUrl;
}
