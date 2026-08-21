export type HnStat = { points: number; comments: number; hnUrl: string };

type Entry = { at: number; value: HnStat | null };

const TTL = 5 * 60 * 1000;
const cache = new Map<string, Entry>();

async function lookup(url: string): Promise<HnStat | null> {
  const endpoint = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(
    url,
  )}&restrictSearchableAttributes=url&tags=story`;
  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      hits?: { points?: number; num_comments?: number; objectID?: string }[];
    };
    const hits = json.hits ?? [];
    if (!hits.length) return null;
    const best = hits.reduce((a, b) => ((b.points ?? 0) > (a.points ?? 0) ? b : a));
    if (!best.objectID) return null;
    return {
      points: best.points ?? 0,
      comments: best.num_comments ?? 0,
      hnUrl: `https://news.ycombinator.com/item?id=${best.objectID}`,
    };
  } catch {
    return null;
  }
}

export async function getHnStats(urls: string[]): Promise<Record<string, HnStat>> {
  const now = Date.now();
  const pending: string[] = [];
  const out: Record<string, HnStat> = {};

  for (const url of urls) {
    const hit = cache.get(url);
    if (hit && now - hit.at < TTL) {
      if (hit.value) out[url] = hit.value;
    } else {
      pending.push(url);
    }
  }

  const queue = [...pending];
  const workers = Array.from({ length: Math.min(8, queue.length) }, async () => {
    for (;;) {
      const url = queue.shift();
      if (!url) return;
      const value = await lookup(url);
      cache.set(url, { at: Date.now(), value });
      if (value) out[url] = value;
    }
  });
  await Promise.all(workers);

  return out;
}
