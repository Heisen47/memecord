// Counts our own GIPHY API calls against the free (beta) key allowance.
// GIPHY documents 100 calls/hour for beta keys and returns HTTP 429 beyond that, but exposes no
// usage counter, so the extension tracks every call it makes in a rolling one-hour window.

export const GIPHY_HOURLY_LIMIT = 100;
const WINDOW_MS = 60 * 60 * 1000;
const STORAGE_KEY = 'memecord_giphy_usage';

export interface UsageInfo {
  used: number;
  limit: number;
  remaining: number;
  /** ms until the oldest counted call leaves the window (0 when nothing is counted) */
  resetsInMs: number;
}

async function readStamps(): Promise<number[]> {
  let raw: unknown;
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      raw = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY];
    } else {
      raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }
  } catch (_) {}
  const cutoff = Date.now() - WINDOW_MS;
  return Array.isArray(raw) ? raw.filter((t): t is number => typeof t === 'number' && t > cutoff) : [];
}

async function writeStamps(stamps: number[]): Promise<void> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({ [STORAGE_KEY]: stamps });
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stamps));
    }
  } catch (_) {}
}

function summarize(stamps: number[]): UsageInfo {
  const used = stamps.length;
  const oldest = stamps.length ? Math.min(...stamps) : 0;
  return {
    used,
    limit: GIPHY_HOURLY_LIMIT,
    remaining: Math.max(0, GIPHY_HOURLY_LIMIT - used),
    resetsInMs: oldest ? Math.max(0, oldest + WINDOW_MS - Date.now()) : 0
  };
}

export async function getGiphyUsage(): Promise<UsageInfo> {
  return summarize(await readStamps());
}

export async function recordGiphyCall(): Promise<UsageInfo> {
  const stamps = await readStamps();
  stamps.push(Date.now());
  await writeStamps(stamps);
  return summarize(stamps);
}

/** GIPHY itself said we're over the limit (e.g. the key is also used elsewhere): count the window as full */
export async function markGiphyLimitReached(): Promise<UsageInfo> {
  const stamps = await readStamps();
  const now = Date.now();
  while (stamps.length < GIPHY_HOURLY_LIMIT) stamps.push(now);
  await writeStamps(stamps);
  return summarize(stamps);
}

export function formatDuration(ms: number): string {
  const mins = Math.max(1, Math.ceil(ms / 60000));
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export function describeGiphyUsage(u: UsageInfo): string {
  const base = `${u.used} of ${u.limit} GIPHY calls used this hour`;
  if (u.used === 0) return `${base} · ${u.limit} left`;
  if (u.remaining === 0) return `${base} · limit reached, resets in ${formatDuration(u.resetsInMs)}`;
  return `${base} · ${u.remaining} left, oldest frees up in ${formatDuration(u.resetsInMs)}`;
}
