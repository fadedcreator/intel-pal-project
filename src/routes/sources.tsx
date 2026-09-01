import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { PageShell } from "@/components/SiteChrome";
import { FEEDS, SOURCE_KINDS, KIND_LABELS } from "@/lib/sources";

const SITE = "https://intel-pal-project.lovable.app";

export const Route = createFileRoute("/sources")({
  component: SourcesPage,
  head: () => ({
    meta: [
      { title: "Sources · AIWire" },
      {
        name: "description",
        content:
          "The 29 publications, company blogs, newsletters and YouTube channels that feed the AIWire news wire.",
      },
      { property: "og:title", content: "Sources · AIWire" },
      {
        property: "og:description",
        content:
          "Every publication, company blog, newsletter and YouTube channel that feeds the AIWire news wire.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/sources` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/sources` }],
  }),
});

const KIND_NOTES: Record<string, string> = {
  company: "Official blogs from the labs building the models.",
  publication: "Newsroom coverage of the AI industry.",
  newsletter: "Independent analysts and insiders.",
  youtube: "Full videos only. Shorts are filtered out.",
};

function siteUrl(feedUrl: string) {
  try {
    return new URL(feedUrl).origin;
  } catch {
    return feedUrl;
  }
}

function SourcesPage() {
  return (
    <PageShell
      kicker="The wire"
      title="Sources"
      lede={`AIWire reads ${FEEDS.length} feeds directly: company blogs, publications, newsletters and YouTube channels. Every headline links out to the original publisher.`}
    >
      <div className="space-y-14">
        {SOURCE_KINDS.map((kind) => {
          const feeds = FEEDS.filter((f) => f.kind === kind);
          if (feeds.length === 0) return null;
          return (
            <section key={kind}>
              <div className="mb-6 flex items-baseline gap-4">
                <h2 className="label-mono text-foreground">{KIND_LABELS[kind]}</h2>
                <span className="label-mono text-muted-foreground">
                  {feeds.length} {feeds.length === 1 ? "source" : "sources"}
                </span>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {KIND_NOTES[kind]}
                </span>
                <div className="h-px flex-1 bg-border/60" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {feeds.map((feed) => (
                  <a
                    key={feed.source}
                    href={siteUrl(feed.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="card-lift group flex items-center gap-3 rounded-xl border border-border/60 bg-surface p-4"
                  >
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: feed.accent }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {feed.source}
                      </span>
                      <span className="label-mono mt-1 block text-muted-foreground">
                        {KIND_LABELS[feed.kind]}
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-wire" />
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-16 rounded-2xl border border-border/60 bg-surface p-6 lg:p-8">
        <h2 className="label-mono text-foreground">How feeds are handled</h2>
        <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
          <li>Feeds are fetched server-side and refreshed on every load.</li>
          <li>Headlines are deduplicated across sources by title.</li>
          <li>Every source is guaranteed representation in the feed.</li>
          <li>YouTube feeds include full videos only; Shorts are dropped.</li>
        </ul>
      </section>
    </PageShell>
  );
}
