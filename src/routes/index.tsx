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
import { SOURCE_META, type SourceKind } from "@/lib/sources";
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
          "A live wire of artificial intelligence news from TechCrunch, The Verge, Ars Technica, The Guardian, MIT Tech Review, Hugging Face, One Useful Thing and The Innermost Loop.",
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

const FALLBACK_ACCENT = "var(--wire)";

function accentOf(source: string) {
  return SOURCE_META[source]?.accent ?? FALLBACK_ACCENT;
}

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
  const accent = accentOf(source);
  return (
    <span className="label-mono inline-flex items-center gap-1.5" style={{ color: accent }}>
      <span className="size-1.5 rounded-full" style={{ backgroundColor: accent }} />
      {source}
    </span>
  );
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

  const sources = useMemo<string[]>(
    () => Array.from(new Set(articles.map((a: Article) => a.source))).sort() as string[],
    [articles],
  );

  const grouped = useMemo(() => {
    const groups: Record<SourceKind, string[]> = { publication: [], newsletter: [] };
    for (const s of sources) groups[SOURCE_META[s]?.kind ?? "publication"].push(s);
    return groups;
  }, [sources]);

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
  const hasFilters = Boolean(query || source || range || onlySaved);

  const refresh = async () => {
    setRefreshing(true);
    await router.invalidate();
    setRefreshing(false);
  };

  const clearAll = () => {
    setQuery("");
    setSource(null);
    setRange(0);
    setOnlySaved(false);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1360px] items-center gap-4 px-6 lg:px-10">
          <a href="/" className="flex shrink-0 items-center gap-2.5">
            <Radio className="size-5 text-wire" strokeWidth={2.2} />
            <span className="font-display text-lg font-bold tracking-tight">AIWire</span>
          </a>

          <div className="relative ml-2 hidden min-w-0 flex-1 md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search headlines, sources, topics"
              aria-label="Search articles"
              className="h-10 w-full rounded-full border border-border bg-surface pr-16 pl-10 text-sm outline-none placeholder:text-muted-foreground focus:border-wire/60 focus:ring-2 focus:ring-wire/20"
            />
            {query ? (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            ) : (
              <kbd className="label-mono absolute top-1/2 right-3.5 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-muted-foreground">
                /
              </kbd>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setOnlySaved((v) => !v)}
              aria-pressed={onlySaved}
              className={`label-mono flex h-10 items-center gap-2 rounded-full border px-3.5 transition-colors ${
                onlySaved
                  ? "border-wire/60 bg-wire/10 text-wire"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bookmark className={`size-3.5 ${onlySaved ? "fill-current" : ""}`} />
              {saved.length}
            </button>
            <button
              onClick={() => setDense((d) => !d)}
              aria-label={dense ? "Switch to grid view" : "Switch to list view"}
              className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:border-wire/50 hover:text-foreground"
            >
              {dense ? <LayoutGrid className="size-4" /> : <Rows3 className="size-4" />}
            </button>
            <button
              onClick={refresh}
              className="flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        <div className="mx-auto flex h-12 max-w-[1360px] items-center gap-3 border-t border-border/40 px-6 lg:px-10">
          <span className="label-mono flex shrink-0 items-center gap-2 text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-wire" />
            Live {new Date(fetchedAt).toUTCString().slice(17, 22)} UTC
          </span>
          <span className="h-4 w-px shrink-0 bg-border" />
          <div className="flex items-center gap-1 rounded-full bg-surface p-1">
            {TIME_RANGES.map((r) => (
              <button
                key={r.label}
                onClick={() => setRange(r.hours)}
                className={`label-mono rounded-full px-3 py-1.5 transition-colors ${
                  range === r.hours
                    ? "bg-wire text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          {source && (
            <button
              onClick={() => setSource(null)}
              className="label-mono flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-foreground"
            >
              {source}
              <X className="size-3" />
            </button>
          )}
          <span className="label-mono ml-auto shrink-0 text-muted-foreground">
            {filtered.length} stories
          </span>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="label-mono shrink-0 text-muted-foreground underline-offset-4 hover:text-wire hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </header>

      <div className="overflow-hidden border-b border-border/60 bg-surface/50">
        <div className="ticker flex w-max gap-12 py-2.5">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 gap-12" aria-hidden={dup === 1}>
              {articles.slice(0, 12).map((a: Article) => (
                <a
                  key={`${dup}-${a.id}`}
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono flex items-center gap-2.5 whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: accentOf(a.source) }}
                  />
                  {a.title}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-[1360px] px-6 py-12 lg:px-10 lg:py-16">
        <h1 className="sr-only">AIWire artificial intelligence news wire</h1>

        {filtered.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-display text-xl font-semibold">Nothing on the wire</p>
            <p className="mt-2 text-sm text-muted-foreground">
              No stories match those filters. Try widening the time range.
            </p>
            <button
              onClick={clearAll}
              className="label-mono mt-6 rounded-full border border-border px-4 py-2 hover:border-wire/60 hover:text-wire"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
            <div>
              {lead && !dense && (
                <section className="mb-16">
                  <SectionHeading label="Lead story" />
                  <LeadStory article={lead} saved={saved} onSave={toggle} />
                </section>
              )}

              <section>
                <SectionHeading
                  label={dense ? "The wire" : "Latest"}
                  meta={`${dense ? filtered.length : rest.length} stories`}
                />
                {dense ? (
                  <ul className="divide-y divide-border/50">
                    {filtered.map((a: Article) => (
                      <DenseRow key={a.id} article={a} saved={saved} onSave={toggle} />
                    ))}
                  </ul>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 xl:gap-8">
                    {rest.map((a: Article) => (
                      <StoryCard key={a.id} article={a} saved={saved} onSave={toggle} />
                    ))}
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-8 lg:sticky lg:top-40 lg:self-start">
              <SignalBoard topics={topics} active={query} onPick={setQuery} />

              <Panel title="Sources">
                <div className="space-y-6">
                  {(["publication", "newsletter"] as SourceKind[]).map((kind) =>
                    grouped[kind].length ? (
                      <div key={kind}>
                        <p className="label-mono mb-3 text-muted-foreground/70">
                          {kind === "publication" ? "Publications" : "Newsletters"}
                        </p>
                        <ul className="space-y-2.5">
                          {grouped[kind].map((s) => {
                            const count = articles.filter((a: Article) => a.source === s).length;
                            const isActive = source === s;
                            return (
                              <li key={s}>
                                <button
                                  onClick={() => setSource(isActive ? null : s)}
                                  className="group flex w-full items-center gap-2.5 text-left text-sm"
                                >
                                  <span
                                    className="size-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: accentOf(s) }}
                                  />
                                  <span
                                    className={`truncate transition-colors ${
                                      isActive
                                        ? "font-medium text-foreground"
                                        : "text-muted-foreground group-hover:text-foreground"
                                    }`}
                                  >
                                    {s}
                                  </span>
                                  <span className="h-px flex-1 bg-border/70" />
                                  <span className="label-mono text-muted-foreground">{count}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : null,
                  )}
                </div>
              </Panel>

              <Panel title="How it works">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  AIWire pulls straight from the publishers' feeds. No rewriting, no algorithmic
                  reshuffling. Press{" "}
                  <kbd className="label-mono rounded border border-border px-1.5 py-0.5">/</kbd> to
                  search, bookmark anything to read later.
                </p>
              </Panel>
            </aside>
          </div>
        )}
      </main>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-4 px-6 lg:px-10">
          <span className="label-mono flex items-center gap-2 text-muted-foreground">
            <Radio className="size-4 text-wire" />
            AIWire
          </span>
          <span className="label-mono text-muted-foreground">
            {articles.length} stories · {sources.length} sources
          </span>
          <span className="label-mono text-muted-foreground">
            Headlines belong to their publishers
          </span>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({ label, meta }: { label: string; meta?: string }) {
  return (
    <div className="mb-6 flex items-baseline gap-4">
      <h2 className="label-mono text-foreground">{label}</h2>
      <span className="h-px flex-1 bg-border/70" />
      {meta && <span className="label-mono text-muted-foreground">{meta}</span>}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border/70 bg-surface p-5">
      <h2 className="label-mono mb-4 text-muted-foreground">{title}</h2>
      {children}
    </section>
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
    <section className="relative overflow-hidden rounded-xl border border-border/70 bg-surface p-5">
      <div className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-wire/10 blur-2xl" />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="label-mono text-muted-foreground">Signal board</h2>
        <span className="label-mono flex items-center gap-1.5 text-wire">
          <span className="size-1.5 animate-pulse rounded-full bg-wire" />
          Live
        </span>
      </div>

      <button
        onClick={() => onPick(top.term)}
        className="group relative mb-5 block w-full rounded-lg border border-wire/30 bg-wire/[0.07] p-4 text-left transition-colors hover:border-wire/60"
      >
        <span className="label-mono text-wire">Top signal</span>
        <span className="mt-2 flex items-baseline justify-between gap-3">
          <span className="font-display text-2xl leading-none font-bold tracking-tight">
            {top.term}
          </span>
          <span className="font-display text-2xl leading-none font-bold text-wire">
            {top.count}
          </span>
        </span>
        <span className="mt-3 flex h-7 items-end gap-0.5">
          {SPARK.map((h, i) => (
            <span key={i} className="flex-1 rounded-sm bg-wire/50" style={{ height: `${h}%` }} />
          ))}
        </span>
      </button>

      <div className="flex flex-wrap gap-2">
        {others.map((t) => {
          const heat = t.count / max;
          const isActive = active.toLowerCase() === t.term.toLowerCase();
          return (
            <button
              key={t.term}
              onClick={() => onPick(t.term)}
              style={{
                backgroundColor: `color-mix(in oklab, var(--wire) ${Math.round(heat * 18)}%, transparent)`,
              }}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? "border-wire text-wire"
                  : "border-border/60 text-foreground/85 hover:border-wire/60 hover:text-wire"
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
      className="rounded-full p-2 text-muted-foreground transition-colors hover:text-wire"
    >
      <Bookmark className={`size-4 ${isSaved ? "fill-wire text-wire" : ""}`} />
    </button>
  );
}

function LeadStory({ article, saved, onSave }: CardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/70 bg-surface transition-colors hover:border-wire/40">
      <a href={article.link} target="_blank" rel="noopener noreferrer" className="block">
        {article.image && (
          <img
            src={article.image}
            alt=""
            loading="eager"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="h-72 w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.02] sm:h-96"
          />
        )}
        <div className="p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-3">
            <SourceTag source={article.source} />
            <span className="size-1 rounded-full bg-border" />
            <span className="label-mono text-muted-foreground">{timeAgo(article.publishedAt)}</span>
          </div>
          <h2 className="font-display text-3xl leading-[1.1] font-bold tracking-tight sm:text-[2.75rem]">
            {article.title}
          </h2>
          {article.summary && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {article.summary}
            </p>
          )}
          <span className="label-mono mt-6 inline-flex items-center gap-1.5 text-wire">
            Read article <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </a>
      <div className="absolute top-4 right-4">
        <SaveButton article={article} saved={saved} onSave={onSave} />
      </div>
    </article>
  );
}

function StoryCard({ article, saved, onSave }: CardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-surface transition-colors hover:border-wire/40">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 flex-col"
      >
        {article.image && (
          <img
            src={article.image}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="h-44 w-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
          />
        )}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center gap-2.5">
            <SourceTag source={article.source} />
            <span className="size-1 rounded-full bg-border" />
            <span className="label-mono text-muted-foreground">{timeAgo(article.publishedAt)}</span>
          </div>
          <h3 className="font-display text-lg leading-snug font-semibold tracking-tight transition-colors group-hover:text-wire">
            {article.title}
          </h3>
          {article.summary && (
            <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {article.summary}
            </p>
          )}
        </div>
      </a>
      <div className="flex items-center justify-between border-t border-border/50 py-2 pr-2 pl-5">
        <span className="label-mono inline-flex items-center gap-1 text-muted-foreground transition-colors group-hover:text-wire">
          Read <ArrowUpRight className="size-3" />
        </span>
        <SaveButton article={article} saved={saved} onSave={onSave} />
      </div>
    </article>
  );
}

function DenseRow({ article, saved, onSave }: CardProps) {
  return (
    <li className="group flex items-center gap-4 py-3">
      <span className="label-mono w-16 shrink-0 text-muted-foreground">
        {timeAgo(article.publishedAt)}
      </span>
      <span className="hidden w-36 shrink-0 truncate sm:block">
        <SourceTag source={article.source} />
      </span>
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 truncate text-sm font-medium transition-colors group-hover:text-wire"
      >
        {article.title}
      </a>
      <SaveButton article={article} saved={saved} onSave={onSave} />
    </li>
  );
}
