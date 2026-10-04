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

export async function fetchAsDataUrl(mediaUrl: string): Promise<string> {
  // If already data URL, return immediately
  if (mediaUrl.startsWith('data:')) {
    return mediaUrl;
  }

  // Check in-memory cache
  if (dataUrlCache.has(mediaUrl)) {
    return dataUrlCache.get(mediaUrl)!;
  }

  let fetchUrl = mediaUrl;
  if (mediaUrl.startsWith('memes/') || mediaUrl.startsWith('/memes/')) {
    if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
      fetchUrl = chrome.runtime.getURL(mediaUrl.replace(/^\//, ''));
    }
  }

  // Local extension asset -> fetch directly and convert to base64 Data URL
  if (fetchUrl.startsWith('chrome-extension://')) {
    try {
      const resp = await fetch(fetchUrl);
      const blob = await resp.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result as string;
          dataUrlCache.set(mediaUrl, res);
          resolve(res);
        };
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn('[Memecord] Failed to read local asset as data URL:', err);
    }
  }

  // External web URL -> fetch via background proxy to bypass page CSP/CORS
  try {
    const res = await chrome.runtime.sendMessage({
      type: 'FETCH_MEDIA_AS_DATA_URL',
      url: fetchUrl
    });
    if (res && res.success && res.dataUrl) {
      dataUrlCache.set(mediaUrl, res.dataUrl);
      return res.dataUrl;
    }
  } catch (err) {
    console.warn('[Memecord] Failed to convert to data URL via background:', err);
  }

  return mediaUrl;
}
