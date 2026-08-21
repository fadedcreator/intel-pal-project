import { FEEDS, type SourceDef, type SourceKind } from "./sources";

export type { SourceKind };

export type Article = {
  id: string;
  title: string;
  link: string;
  source: string;
  kind: SourceKind;
  publishedAt: string; // ISO
  summary: string;
  image: string | null;
};

type Feed = SourceDef;

export { FEEDS };



function entities(input: string): string {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&#0?39;|&apos;|&#x27;/g, "'")
    .replace(/&#8217;|&rsquo;/g, "\u2019")
    .replace(/&#8216;|&lsquo;/g, "\u2018")
    .replace(/&#8220;|&ldquo;/g, "\u201c")
    .replace(/&#8221;|&rdquo;/g, "\u201d")
    .replace(/&#8212;|&mdash;/g, "\u2014")
    .replace(/&#8211;|&ndash;/g, "\u2013")
    .replace(/&#8230;|&hellip;/g, "\u2026")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

function decode(input: string): string {
  let out = input.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  out = entities(out);
  out = out.replace(/<[^>]+>/g, " ");
  out = entities(out);
  out = out.replace(/<[^>]+>/g, " ");
  return out.replace(/\s+/g, " ").trim();
}

function tag(block: string, names: string[]): string | null {
  for (const name of names) {
    const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
    if (m?.[1] != null) return m[1];
  }
  return null;
}

function attr(block: string, tagName: string, attrName: string): string | null {
  const m = block.match(new RegExp(`<${tagName}\\b[^>]*\\b${attrName}=["']([^"']+)["']`, "i"));
  return m?.[1] ? entities(m[1]) : null;
}

function extractLink(block: string): string | null {
  const plain = tag(block, ["link"]);
  if (plain) {
    const value = decode(plain);
    if (value.startsWith("http")) return value;
  }
  const href: string | null =
    block.match(/<link\b[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i)?.[1] ??
    attr(block, "link", "href") ??
    null;
  return href ?? null;
}

function extractImage(block: string): string | null {
  const media = Array.from(block.matchAll(/<media:(?:content|thumbnail)\b[^>]*>/gi)).map((m) => {
    const url = m[0].match(/\burl=["']([^"']+)["']/i)?.[1];
    const width = Number(m[0].match(/\bwidth=["'](\d+)["']/i)?.[1] ?? 0);
    return { url: url ? entities(url) : null, width };
  });
  const best = media
    .filter((m): m is { url: string; width: number } => Boolean(m.url))
    .sort((a, b) => b.width - a.width)[0];
  if (best) return best.url;

  const enclosure = attr(block, "enclosure", "url");
  if (enclosure && /\.(jpe?g|png|webp|avif)/i.test(enclosure)) return enclosure;

  const inline = block.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  return inline ? entities(inline) : null;
}

function parseFeed(xml: string, source: string, kind: SourceKind): Article[] {
  const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/gi) ?? [];
  const out: Article[] = [];

  for (const block of blocks) {
    const title = tag(block, ["title"]);
    const link = extractLink(block);
    if (!title || !link) continue;

    const dateRaw = tag(block, ["pubDate", "published", "updated", "dc:date"]);
    const parsed = dateRaw ? new Date(decode(dateRaw)) : null;
    const publishedAt =
      parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : new Date().toISOString();

    const summaryRaw = tag(block, ["description", "summary", "content:encoded", "content"]) ?? "";
    const summaryFull = decode(summaryRaw);
    const summary =
      summaryFull.length > 240 ? `${summaryFull.slice(0, 240).trimEnd()}\u2026` : summaryFull;

    out.push({
      id: `${source}:${link}`,
      title: decode(title),
      link: link.trim(),
      source,
      kind,
      publishedAt,
      summary,
      image: extractImage(block),
    });
  }

  return out;
}

async function fetchFeed(feed: Feed): Promise<Article[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; AIWireBot/1.0)", accept: "*/*" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    return parseFeed(await res.text(), feed.source, feed.kind);
  } catch {
    return [];
  }
}

export async function loadArticles(): Promise<{ articles: Article[]; fetchedAt: string }> {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const seen = new Set<string>();
  const articles = results
    .flat()
    .filter((a) => {
      const key = a.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 90);

  return { articles, fetchedAt: new Date().toISOString() };
}

const TOPIC_TERMS = [
  "OpenAI",
  "ChatGPT",
  "Google",
  "Gemini",
  "Anthropic",
  "Claude",
  "Microsoft",
  "Copilot",
  "Meta",
  "Nvidia",
  "Apple",
  "Agents",
  "Open source",
  "Regulation",
  "Robotics",
  "Chips",
];

export function computeTopics(articles: Article[]) {
  return TOPIC_TERMS.map((term) => {
    const needle = term.toLowerCase();
    const count = articles.filter((a) =>
      `${a.title} ${a.summary}`.toLowerCase().includes(needle),
    ).length;
    return { term, count };
  })
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}
