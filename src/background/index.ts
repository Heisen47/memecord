import { DEFAULT_SETTINGS } from '../shared/config';

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[Memecord] Extension installed/updated, reason:', details.reason);

  try {
    const existing = await chrome.storage.local.get('mememeet_settings');
    if (!existing || !existing.mememeet_settings) {
      await chrome.storage.local.set({ mememeet_settings: DEFAULT_SETTINGS });
      console.log('[Memecord] Default settings seeded.');
    }
  } catch (err) {
    console.error('[Memecord] Failed to seed storage on install:', err);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'PING') {
    sendResponse({ status: 'PONG' });
    return true;
  }

  // Resolve Tenor page URL to direct GIF or MP4
  if (message.type === 'RESOLVE_TENOR_URL') {
    (async () => {
      try {
        const rawUrl = message.url as string;
        const res = await fetch(rawUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        const html = await res.text();

        // 1. Try to find GIF URL
        const gifMatch = html.match(/https:\/\/media\.tenor\.com\/[^\s"'\''<>]+?\.gif/i);
        // 2. Try to find MP4 URL
        const mp4Match = html.match(/https:\/\/media\.tenor\.com\/[^\s"'\''<>]+?\.mp4/i);
        // 3. Try to find WebP
        const webpMatch = html.match(/https:\/\/media\.tenor\.com\/[^\s"'\''<>]+?\.webp/i);

        const resolvedUrl = gifMatch ? gifMatch[0] : (mp4Match ? mp4Match[0] : (webpMatch ? webpMatch[0] : rawUrl));
        const isVideo = Boolean(mp4Match && !gifMatch);

        // Extract clean name from URL slug
        let name = 'Tenor Meme';
        const slugMatch = rawUrl.match(/\/view\/([a-zA-Z0-9_-]+)/);
        if (slugMatch && slugMatch[1]) {
          name = slugMatch[1]
            .replace(/-gif-\d+$/, '')
            .replace(/-gif$/, '')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
        }

        sendResponse({
          success: true,
          resolvedUrl,
          name,
          isVideo
        });
      } catch (err: any) {
        console.error('[Memecord] Failed to resolve Tenor URL:', err);
        sendResponse({ success: false, error: err?.message || 'Failed to fetch Tenor page' });
      }
    })();
    return true; // Keep channel open for async response
  }

  // Fetch external media and convert to Base64 Data URL to bypass webpage CSP
  if (message.type === 'FETCH_MEDIA_AS_DATA_URL') {
    (async () => {
      try {
        const mediaUrl = message.url as string;
        const response = await fetch(mediaUrl);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          sendResponse({
            success: true,
            dataUrl: reader.result as string,
            mimeType: blob.type
          });
        };
        reader.onerror = () => {
          sendResponse({ success: false, error: 'FileReader failed to convert blob' });
        };
        reader.readAsDataURL(blob);
      } catch (err: any) {
        console.error('[Memecord] Failed to fetch media as data URL:', err);
        sendResponse({ success: false, error: err?.message || 'Failed to fetch media' });
      }
    })();
    return true;
  }

  return false;
});
