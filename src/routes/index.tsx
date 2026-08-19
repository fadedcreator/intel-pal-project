import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  RefreshCw,
  ArrowUpRight,
  Bookmark,
  LayoutGrid,
  Rows3,
  Radio,
  X,
} from "lucide-react";

import { getNews } from "@/lib/news.functions";
import type { Article } from "@/lib/news.server";

export const Route = createFileRoute("/")({
  component: Index,
  loader: () => getNews(),
  head: () => ({
    meta: [
      { title: "AIWire · Every AI story that matters, one page" },
      {
        name: "description",
        content:
          "A live wire of artificial intelligence news from TechCrunch, The Verge, Ars Technica, The Guardian, MIT Tech Review and Hugging Face. Search, filter and skim in seconds.",
      },
      { property: "og:title", content: "AIWire · Every AI story that matters, one page" },
      {
        property: "og:description",
        content: "A live, filterable wire of AI news from the sources worth reading.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const TIME_RANGES = [
  { label: "Today", hours: 24 },
  { label: "3 days", hours: 72 },
  { label: "7 days", hours: 168 },
  { label: "All", hours: 0 },
] as const;

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function useSaved() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("aiwire:saved");
      if (raw) setSaved(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = (id: string) =>
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        window.localStorage.setItem("aiwire:saved", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  return { saved, toggle };
}

function SourceTag({ source }: { source: string }) {
  return <span className="label-mono text-wire">{source}</span>;
}

function Index() {
  const { articles, topics, fetchedAt } = Route.useLoaderData();
  const router = useRouter();
  const { saved, toggle } = useSaved();

  const [query, setQuery] = useState("");
  const [source, setSource] = useState<string | null>(null);
  const [range, setRange] = useState<number>(0);
  const [dense, setDense] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") searchRef.current?.blur();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sources = useMemo(
    () => Array.from(new Set(articles.map((a: Article) => a.source))).sort(),
    [articles],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cutoff = range ? Date.now() - range * 3600_000 : 0;
    return articles.filter((a: Article) => {
      if (source && a.source !== source) return false;
      if (onlySaved && !saved.includes(a.id)) return false;
      if (cutoff && new Date(a.publishedAt).getTime() < cutoff) return false;
      if (q && !`${a.title} ${a.summary} ${a.source}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [articles, query, source, range, onlySaved, saved]);

  const [lead, ...rest] = filtered;

  const refresh = async () => {
    setRefreshing(true);
    await router.invalidate();
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 py-3">
          <a href="/" className="flex items-center gap-2 pr-2">
            <Radio className="size-5 text-wire" strokeWidth={2.2} />
            <span className="font-display text-lg font-bold tracking-tight">AIWire</span>
          </a>

          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search headlines, sources, topics…"
              aria-label="Search articles"
              className="h-10 w-full rounded-md border border-border bg-surface pr-16 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:border-wire/70 focus:ring-1 focus:ring-wire/40"
            />
            {query ? (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            ) : (
              <kbd className="label-mono absolute top-1/2 right-3 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-muted-foreground">
                /
              </kbd>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDense((d) => !d)}
              aria-label={dense ? "Switch to grid view" : "Switch to list view"}
              className="flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm hover:border-wire/60"
            >
              {dense ? <Rows3 className="size-4" /> : <LayoutGrid className="size-4" />}
              <span className="hidden sm:inline">{dense ? "List" : "Grid"}</span>
            </button>
            <button
              onClick={refresh}
              className="flex h-10 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-2 px-5 pb-3">
          <span className="label-mono flex items-center gap-1.5 text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-wire" />
            Live · {new Date(fetchedAt).toUTCString().slice(17, 22)} UTC
          </span>
          <span className="mx-1 h-4 w-px bg-border" />
          {TIME_RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.hours)}
              className={`label-mono rounded-full px-2.5 py-1 transition-colors ${
                range === r.hours
                  ? "bg-wire text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-border" />
          <button
            onClick={() => setSource(null)}
            className={`label-mono rounded-full px-2.5 py-1 ${source === null ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            All sources
          </button>
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => setSource(s === source ? null : s)}
              className={`label-mono rounded-full px-2.5 py-1 ${source === s ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={() => setOnlySaved((v) => !v)}
            className={`label-mono ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 ${onlySaved ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Bookmark className={`size-3 ${onlySaved ? "fill-current" : ""}`} />
            Saved {saved.length}
          </button>
        </div>
      </header>

      <div className="overflow-hidden border-b border-border/70 bg-surface/60">
        <div className="ticker flex w-max gap-10 py-2">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 gap-10" aria-hidden={dup === 1}>
              {articles.slice(0, 12).map((a: Article) => (
                <a
                  key={`${dup}-${a.id}`}
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono flex items-center gap-2 whitespace-nowrap text-muted-foreground hover:text-wire"
                >
                  <span className="size-1 rounded-full bg-wire/70" />
                  {a.title}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <h1 className="sr-only">AIWire artificial intelligence news wire</h1>


        {filtered.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">
            No stories match those filters. Try widening the time range.
          </p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              {lead && !dense && <LeadStory article={lead} saved={saved} onSave={toggle} />}

              <div className="mt-8 mb-4 flex items-center gap-3">
                <h2 className="label-mono text-foreground">Latest · {rest.length}</h2>
                <span className="h-px flex-1 bg-border" />
              </div>

              {dense ? (
                <ul className="divide-y divide-border/70 border-y border-border/70">
                  {filtered.map((a: Article) => (
                    <DenseRow key={a.id} article={a} saved={saved} onSave={toggle} />
                  ))}
                </ul>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {rest.map((a: Article) => (
                    <StoryCard key={a.id} article={a} saved={saved} onSave={toggle} />
                  ))}
                </div>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-36 lg:self-start">
              <SignalBoard topics={topics} active={query} onPick={setQuery} />

              <section className="rounded-lg border border-border bg-surface p-4">
                <h2 className="label-mono mb-3 text-muted-foreground">Source pulse</h2>
                <ul className="space-y-2">
                  {sources.map((s: string) => {
                    const count = articles.filter((a: Article) => a.source === s).length;
                    return (
                      <li key={s}>
                        <button
                          onClick={() => setSource(s === source ? null : s)}
                          className="flex w-full items-center gap-2 text-left text-sm"
                        >
                          <span
                            className={`truncate ${source === s ? "text-wire" : "hover:text-wire"}`}
                          >
                            {s}
                          </span>
                          <span className="h-px flex-1 bg-border" />
                          <span className="label-mono text-muted-foreground">{count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="rounded-lg border border-border bg-surface p-4 text-sm">
                <h2 className="label-mono mb-2 text-muted-foreground">How it works</h2>
                <p className="text-muted-foreground">
                  AIWire pulls straight from the publishers' feeds. No rewriting, no algorithmic
                  reshuffling. Press{" "}
                  <kbd className="label-mono rounded border border-border px-1">/</kbd> to search,
                  bookmark anything to read later.
                </p>
              </section>
            </aside>
          </div>
        )}
      </main>

      <footer className="border-t border-border/70 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5">
          <span className="label-mono text-muted-foreground">
            AIWire · {articles.length} stories · {sources.length} sources
          </span>
          <span className="label-mono text-muted-foreground">
            Headlines belong to their publishers
          </span>
        </div>
      </footer>
    </div>
  );
}

type Topic = { term: string; count: number };

const SPARK = [32, 48, 40, 62, 55, 74, 66, 85, 70, 92, 78, 96, 84, 100];

function SignalBoard({
  topics,
  active,
  onPick,
}: {
  topics: Topic[];
  active: string;
  onPick: (term: string) => void;
}) {
  const max = topics[0]?.count || 1;
  const [top, ...others] = topics;
  if (!top) return null;

  return (
    <section className="relative overflow-hidden rounded-lg border border-border bg-surface p-4">
      <div className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-wire/10 blur-2xl" />
      <div className="mb-3 flex items-center justify-between">
        <h2 className="label-mono text-muted-foreground">Signal board</h2>
        <span className="label-mono flex items-center gap-1 text-wire">
          <span className="size-1.5 animate-pulse rounded-full bg-wire" />
          Live
        </span>
      </div>

      <button
        onClick={() => onPick(top.term)}
        className="group relative mb-3 block w-full rounded-md border border-wire/40 bg-wire/10 p-3 text-left"
      >
        <span className="label-mono text-wire">Top signal</span>
        <span className="mt-1 flex items-baseline justify-between gap-2">
          <span className="font-display text-xl font-bold tracking-tight group-hover:text-wire">
            {top.term}
          </span>
          <span className="font-display text-xl font-bold text-wire">{top.count}</span>
        </span>
        <span className="mt-2 flex h-6 items-end gap-0.5">
          {SPARK.map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-sm bg-wire/60"
              style={{ height: `${h}%` }}
            />
          ))}
        </span>
      </button>

      <div className="flex flex-wrap gap-1.5">
        {others.map((t) => {
          const heat = t.count / max;
          const isActive = active.toLowerCase() === t.term.toLowerCase();
          return (
            <button
              key={t.term}
              onClick={() => onPick(t.term)}
              style={{
                backgroundColor: `color-mix(in oklab, var(--wire) ${Math.round(heat * 22)}%, transparent)`,
              }}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                isActive
                  ? "border-wire text-wire"
                  : "border-border/70 text-foreground/90 hover:border-wire/60 hover:text-wire"
              }`}
            >
              {t.term}
              <span className="label-mono text-muted-foreground">{t.count}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

type CardProps = { article: Article; saved: string[]; onSave: (id: string) => void };

function SaveButton({ article, saved, onSave }: CardProps) {
  const isSaved = saved.includes(article.id);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onSave(article.id);
      }}
      aria-label={isSaved ? "Remove bookmark" : "Bookmark story"}
      className="rounded p-1.5 text-muted-foreground transition-colors hover:text-wire"
    >
      <Bookmark className={`size-4 ${isSaved ? "fill-wire text-wire" : ""}`} />
    </button>
  );
}

function LeadStory({ article, saved, onSave }: CardProps) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-surface">
      <a href={article.link} target="_blank" rel="noopener noreferrer" className="block">
        {article.image && (
          <img
            src={article.image}
            alt=""
            loading="eager"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="h-64 w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.03] sm:h-80"
          />
        )}
        <div className="p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-3">
            <SourceTag source={article.source} />
            <span className="label-mono text-muted-foreground">{timeAgo(article.publishedAt)}</span>
          </div>
          <h2 className="font-display text-2xl leading-tight font-bold sm:text-4xl">
            {article.title}
          </h2>
          {article.summary && (
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {article.summary}
            </p>
          )}
          <span className="label-mono mt-4 inline-flex items-center gap-1 text-wire">
            Read article <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </a>
      <div className="absolute top-3 right-3">
        <SaveButton article={article} saved={saved} onSave={onSave} />
      </div>
    </article>
  );
}

function StoryCard({ article, saved, onSave }: CardProps) {
  return (
    <article className="group flex flex-col rounded-lg border border-border bg-surface transition-colors hover:border-wire/50">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col p-4"
      >
        {article.image && (
          <img
            src={article.image}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="mb-3 h-36 w-full rounded-md object-cover opacity-85 transition-opacity group-hover:opacity-100"
          />
        )}
        <div className="mb-2 flex items-center gap-2">
          <SourceTag source={article.source} />
          <span className="label-mono text-muted-foreground">{timeAgo(article.publishedAt)}</span>
        </div>
        <h3 className="font-display text-base leading-snug font-semibold group-hover:text-wire">
          {article.title}
        </h3>
        {article.summary && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{article.summary}</p>
        )}
      </a>
      <div className="flex items-center justify-between border-t border-border/60 px-3 py-2">
        <span className="label-mono text-muted-foreground">Read ↗</span>
        <SaveButton article={article} saved={saved} onSave={onSave} />
      </div>
    </article>
  );
}

function DenseRow({ article, saved, onSave }: CardProps) {
  return (
    <li className="group flex items-center gap-3 py-2.5">
      <span className="label-mono w-16 shrink-0 text-muted-foreground">
        {timeAgo(article.publishedAt)}
      </span>
      <span className="w-28 shrink-0 truncate">
        <SourceTag source={article.source} />
      </span>
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 truncate text-sm font-medium group-hover:text-wire"
      >
        {article.title}
      </a>
      <SaveButton article={article} saved={saved} onSave={onSave} />
    </li>
  );
}
