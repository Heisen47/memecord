// Live trending meme feed: Reddit hot (via meme-api.com, no key) + GIPHY trending (optional key).
// X/Twitter has no public trending-media API; GIPHY powers its GIF picker, so it's the closest proxy.

import { UsageInfo, getGiphyUsage, recordGiphyCall, markGiphyLimitReached, formatDuration, GIPHY_HOURLY_LIMIT } from './usage';

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
  /** Exact reason each failed source or subreddit couldn't load (feed can still be partial) */
  errors: string[];
  /** Free-key usage, present when a GIPHY key is set */
  usage?: UsageInfo;
}

export interface GiphySearchResult {
  memes: TrendingMeme[];
  usage: UsageInfo;
}

const CACHE_KEY = 'memecord_trending_cache';
const CACHE_TTL_MS = 20 * 60 * 1000;
const REDDIT_SUBS = ['memes', 'dankmemes', 'wholesomememes'];
// Media bigger than this can't be passed through the extension reliably (and is unwatchable on a call)
export const MAX_MEDIA_BYTES = 8 * 1024 * 1024;
const MEDIA_EXT = /\.(gif|png|jpe?g|webp|mp4)(\?|$)/i;

function cleanTitle(title: string): string {
  return title
    .replace(/\s+GIF(\s+by\s+.*)?$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60);
}

/** Why a fetch() threw, in plain words */
function networkReason(err: any): string {
  const detail = err?.message || String(err);
  if (err?.name === 'AbortError') return 'request timed out';
  if (err instanceof TypeError) return `network error (${detail}) — check your connection, VPN or an ad blocker`;
  return detail;
}

function describeNetworkError(label: string, err: any): string {
  return `${label}: ${networkReason(err)}`;
}

async function fetchRedditHot(): Promise<{ memes: TrendingMeme[]; errors: string[] }> {
  const results = await Promise.allSettled(
    REDDIT_SUBS.map(async (sub) => {
      let res: Response;
      try {
        res = await fetch(`https://meme-api.com/gimme/${sub}/50`);
      } catch (err) {
        throw Object.assign(new Error(networkReason(err)), { sub });
      }
      if (!res.ok) {
        const hint = res.status === 429 ? ' — meme-api.com is rate limiting you, try again in a few minutes' : '';
        throw Object.assign(new Error(`HTTP ${res.status} ${res.statusText}`.trim() + hint), { sub });
      }
      let json: any;
      try {
        json = await res.json();
      } catch (_) {
        throw Object.assign(new Error("response wasn't valid JSON"), { sub });
      }
      return (json.memes || []) as any[];
    })
  );

  // One line per distinct failure, listing every subreddit it hit
  const bySubs = new Map<string, string[]>();
  results.forEach((r, i) => {
    if (r.status !== 'rejected') return;
    const reason = r.reason?.message || 'request failed';
    bySubs.set(reason, [...(bySubs.get(reason) || []), `r/${REDDIT_SUBS[i]}`]);
  });
  const errors = [...bySubs].map(([reason, subs]) => `${subs.join(', ')} via meme-api.com: ${reason}`);

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

  if (memes.length === 0 && errors.length > 0) {
    throw new Error(errors.join(' · '));
  }
  const ranked = memes.sort((a, b) => b.score - a.score).slice(0, 60);
  return { memes: (await dropUnusable(ranked)).slice(0, 45), errors };
}

/**
 * Reddit allows 30+ MB GIFs and deleted posts linger in feeds. HEAD-check each item and drop
 * dead or oversized ones. Fails open (keeps the item) if the check itself can't run.
 */
async function dropUnusable(memes: TrendingMeme[]): Promise<TrendingMeme[]> {
  const checks = await Promise.all(
    memes.map(async (m) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 4000);
      try {
        const res = await fetch(m.assetUrl, { method: 'HEAD', signal: ctrl.signal });
        if (!res.ok) return false;
        const len = Number(res.headers.get('content-length') || 0);
        return !(len > MAX_MEDIA_BYTES);
      } catch (_) {
        return true;
      } finally {
        clearTimeout(timer);
      }
    })
  );
  return memes.filter((_, i) => checks[i]);
}

async function fetchGiphy(apiKey: string, query?: string): Promise<TrendingMeme[]> {
  // Stop before spending a call we know will be rejected
  const before = await getGiphyUsage();
  if (before.remaining === 0) {
    throw new Error(
      `GIPHY free limit reached: ${before.used} of ${GIPHY_HOURLY_LIMIT} calls used this hour. ` +
        `Resets in ${formatDuration(before.resetsInMs)}.`
    );
  }

  const params = new URLSearchParams({ api_key: apiKey, limit: '45', rating: 'pg-13', bundle: 'messaging_non_clips' });
  const endpoint = query ? 'search' : 'trending';
  if (query) params.set('q', query);
  let res: Response;
  try {
    res = await fetch(`https://api.giphy.com/v1/gifs/${endpoint}?${params}`);
  } catch (err) {
    throw new Error(describeNetworkError('GIPHY', err));
  }
  await recordGiphyCall();
  if (res.status === 429) {
    const usage = await markGiphyLimitReached();
    throw new Error(
      `GIPHY HTTP 429: too many requests. A free key allows ${GIPHY_HOURLY_LIMIT} calls per hour. ` +
        `Resets in about ${formatDuration(usage.resetsInMs)}.`
    );
  }
  if (res.status === 401 || res.status === 403) {
    throw new Error(`GIPHY rejected the API key (HTTP ${res.status}) — check the key in Memecord settings`);
  }
  if (!res.ok) throw new Error(`GIPHY HTTP ${res.status} ${res.statusText}`.trim());
  const json = await res.json().catch(() => {
    throw new Error("GIPHY response wasn't valid JSON");
  });
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
  const tasks: [TrendingSource, Promise<{ memes: TrendingMeme[]; errors: string[] }>][] = [
    ['reddit', fetchRedditHot()]
  ];
  if (giphyApiKey) {
    tasks.unshift(['giphy', fetchGiphy(giphyApiKey).then((memes) => ({ memes, errors: [] as string[] }))]);
  }

  const settled = await Promise.allSettled(tasks.map(([, p]) => p));
  const lists: TrendingMeme[][] = [];
  const sources: TrendingSource[] = [];
  const errors: string[] = [];
  settled.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      lists.push(r.value.memes);
      sources.push(tasks[i][0]);
      errors.push(...r.value.errors);
    } else {
      errors.push(r.reason?.message || `${tasks[i][0]} failed`);
    }
  });

  return {
    memes: interleave(lists),
    fetchedAt: Date.now(),
    sources,
    errors,
    usage: giphyApiKey ? await getGiphyUsage() : undefined
  };
}

export async function searchGiphyDirect(apiKey: string, query: string): Promise<GiphySearchResult> {
  const memes = await fetchGiphy(apiKey, query);
  return { memes, usage: await getGiphyUsage() };
}

/** Background-side cached feed (chrome.storage.local, 20 min TTL) */
export async function getCachedTrending(giphyApiKey: string | undefined, force: boolean): Promise<TrendingFeed> {
  const cacheTag = `v2-${giphyApiKey ? 'with-giphy' : 'reddit-only'}`;
  if (!force) {
    try {
      const stored = (await chrome.storage.local.get(CACHE_KEY))[CACHE_KEY] as (TrendingFeed & { tag: string }) | undefined;
      if (stored && stored.tag === cacheTag && Date.now() - stored.fetchedAt < CACHE_TTL_MS && stored.memes.length) {
        // Cached memes cost no API calls, but the usage line should still be current
        return { ...stored, usage: giphyApiKey ? await getGiphyUsage() : undefined };
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

export async function searchTrendingGifs(query: string): Promise<GiphySearchResult | null> {
  if (!hasExtensionRuntime()) return null;
  const res = await chrome.runtime.sendMessage({ type: 'SEARCH_GIPHY', query });
  if (res?.success) return res.result as GiphySearchResult | null;
  throw new Error(res?.error || 'GIPHY search failed');
}
