// Live trending meme feed: Reddit hot (via meme-api.com, no key) + GIPHY trending (optional key).
// X/Twitter has no public trending-media API; GIPHY powers its GIF picker, so it's the closest proxy.

export type TrendingSource = 'reddit' | 'giphy';

export interface TrendingMeme {
  id: string;
  name: string;
  assetUrl: string;
  thumbUrl: string;
  source: TrendingSource;
  sourceUrl?: string;
  score: number;
}

export interface TrendingFeed {
  memes: TrendingMeme[];
  fetchedAt: number;
  sources: TrendingSource[];
  errors: string[];
}

const CACHE_KEY = 'memecord_trending_cache';
const CACHE_TTL_MS = 20 * 60 * 1000;
const REDDIT_SUBS = ['memes', 'dankmemes', 'wholesomememes'];
const MEDIA_EXT = /\.(gif|png|jpe?g|webp|mp4)(\?|$)/i;

function cleanTitle(title: string): string {
  return title
    .replace(/\s+GIF(\s+by\s+.*)?$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60);
}

async function fetchRedditHot(): Promise<TrendingMeme[]> {
  const results = await Promise.allSettled(
    REDDIT_SUBS.map(async (sub) => {
      const res = await fetch(`https://meme-api.com/gimme/${sub}/50`);
      if (!res.ok) throw new Error(`r/${sub}: HTTP ${res.status}`);
      const json = await res.json();
      return (json.memes || []) as any[];
    })
  );

  const seen = new Set<string>();
  const memes: TrendingMeme[] = [];
  results.forEach((r) => {
    if (r.status !== 'fulfilled') return;
    r.value.forEach((m) => {
      if (!m?.url || m.nsfw || m.spoiler || !MEDIA_EXT.test(m.url) || seen.has(m.url)) return;
      seen.add(m.url);
      const previews: string[] = Array.isArray(m.preview) ? m.preview : [];
      memes.push({
        id: `reddit_${(m.postLink || m.url).split('/').pop()}`,
        name: cleanTitle(m.title || 'Reddit meme') || 'Reddit meme',
        assetUrl: m.url,
        thumbUrl: previews[Math.min(1, previews.length - 1)] || m.url,
        source: 'reddit',
        sourceUrl: m.postLink,
        score: Number(m.ups) || 0
      });
    });
  });

  if (memes.length === 0 && results.every((r) => r.status === 'rejected')) {
    throw new Error('Reddit feed unavailable');
  }
  return memes.sort((a, b) => b.score - a.score).slice(0, 45);
}

async function fetchGiphy(apiKey: string, query?: string): Promise<TrendingMeme[]> {
  const params = new URLSearchParams({ api_key: apiKey, limit: '45', rating: 'pg-13', bundle: 'messaging_non_clips' });
  const endpoint = query ? 'search' : 'trending';
  if (query) params.set('q', query);
  const res = await fetch(`https://api.giphy.com/v1/gifs/${endpoint}?${params}`);
  if (res.status === 401 || res.status === 403) throw new Error('GIPHY key was rejected');
  if (!res.ok) throw new Error(`GIPHY: HTTP ${res.status}`);
  const json = await res.json();
  return ((json.data || []) as any[]).map((g, i) => {
    const images = g.images || {};
    return {
      id: `giphy_${g.id}`,
      name: cleanTitle(g.title || '') || 'Trending GIF',
      assetUrl: images.downsized?.url || images.original?.url,
      thumbUrl: images.fixed_width?.webp || images.fixed_width?.url || images.downsized?.url,
      source: 'giphy' as const,
      sourceUrl: g.url,
      // Preserve GIPHY's own ranking when interleaving with Reddit
      score: 1000 - i
    };
  }).filter((m) => m.assetUrl);
}

/** Interleave sources so neither dominates the top of the grid */
function interleave(lists: TrendingMeme[][]): TrendingMeme[] {
  const out: TrendingMeme[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) {
    lists.forEach((l) => {
      if (l[i]) out.push(l[i]);
    });
  }
  return out;
}

/** Fetches straight from the APIs. Runs in the background worker (or the Test Lab). */
export async function fetchTrendingDirect(giphyApiKey?: string): Promise<TrendingFeed> {
  const tasks: [TrendingSource, Promise<TrendingMeme[]>][] = [['reddit', fetchRedditHot()]];
  if (giphyApiKey) tasks.unshift(['giphy', fetchGiphy(giphyApiKey)]);

  const settled = await Promise.allSettled(tasks.map(([, p]) => p));
  const lists: TrendingMeme[][] = [];
  const sources: TrendingSource[] = [];
  const errors: string[] = [];
  settled.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      lists.push(r.value);
      sources.push(tasks[i][0]);
    } else {
      errors.push(r.reason?.message || `${tasks[i][0]} failed`);
    }
  });

  return { memes: interleave(lists), fetchedAt: Date.now(), sources, errors };
}

export async function searchGiphyDirect(apiKey: string, query: string): Promise<TrendingMeme[]> {
  return fetchGiphy(apiKey, query);
}

/** Background-side cached feed (chrome.storage.local, 20 min TTL) */
export async function getCachedTrending(giphyApiKey: string | undefined, force: boolean): Promise<TrendingFeed> {
  const cacheTag = giphyApiKey ? 'with-giphy' : 'reddit-only';
  if (!force) {
    try {
      const stored = (await chrome.storage.local.get(CACHE_KEY))[CACHE_KEY] as (TrendingFeed & { tag: string }) | undefined;
      if (stored && stored.tag === cacheTag && Date.now() - stored.fetchedAt < CACHE_TTL_MS && stored.memes.length) {
        return stored;
      }
    } catch (_) {}
  }
  const feed = await fetchTrendingDirect(giphyApiKey);
  if (feed.memes.length) {
    try {
      await chrome.storage.local.set({ [CACHE_KEY]: { ...feed, tag: cacheTag } });
    } catch (_) {}
  }
  return feed;
}

function hasExtensionRuntime(): boolean {
  return typeof chrome !== 'undefined' && Boolean(chrome.runtime?.id && chrome.runtime.sendMessage);
}

/**
 * Callable from content scripts / popup: content scripts can't fetch cross-origin,
 * so this goes through the background worker when running as an extension.
 */
export async function getTrendingMemes(force = false): Promise<TrendingFeed> {
  if (hasExtensionRuntime()) {
    const res = await chrome.runtime.sendMessage({ type: 'GET_TRENDING_MEMES', force });
    if (res?.success) return res.feed as TrendingFeed;
    throw new Error(res?.error || 'Could not load trending memes');
  }
  return fetchTrendingDirect();
}

export async function searchTrendingGifs(query: string): Promise<TrendingMeme[]> {
  if (!hasExtensionRuntime()) return [];
  const res = await chrome.runtime.sendMessage({ type: 'SEARCH_GIPHY', query });
  if (res?.success) return res.memes as TrendingMeme[];
  throw new Error(res?.error || 'Search failed');
}
