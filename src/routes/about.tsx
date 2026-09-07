import { createFileRoute, Link } from "@tanstack/react-router";
import { Radio, Zap, TrendingUp, MessageSquare, Bookmark } from "lucide-react";

import { PageShell } from "@/components/SiteChrome";
import { FEEDS } from "@/lib/sources";

const SITE = "https://intel-pal-project.lovable.app";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About · AIWire" },
      {
        name: "description",
        content:
          "AIWire is a live wire of artificial intelligence news: every important story from trusted sources, on one fast page.",
      },
      { property: "og:title", content: "About · AIWire" },
      {
        property: "og:description",
        content:
          "AIWire is a live wire of artificial intelligence news: every important story from trusted sources, on one fast page.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/about` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/about` }],
  }),
});

const FEATURES = [
  {
    icon: Radio,
    title: "Straight from the feeds",
    body: "AIWire reads the publishers' RSS and Atom feeds directly. Headlines, summaries and images come from the source, and every story links out to the original.",
  },
  {
    icon: Zap,
    title: "Latest",
    body: "The default view. Stories sorted by publish time, newest first, refreshed on every visit.",
  },
  {
    icon: TrendingUp,
    title: "Trending",
    body: "Stories mentioning the topics currently heating up on the Signal Board surface first.",
  },
  {
    icon: MessageSquare,
    title: "Most discussed",
    body: "Real Hacker News engagement. Each story is matched against Hacker News and ranked by actual points and comments. Stories without a discussion are never given invented numbers.",
  },
  {
    icon: Bookmark,
    title: "Your reading list",
    body: "Bookmark anything to read later. Saved stories live in your browser only, never on a server.",
  },
];

function AboutPage() {
  return (
    <PageShell
      kicker="About"
      title="Every AI story that matters, one page"
      lede={`AIWire is a live news wire for artificial intelligence. It pulls from ${FEEDS.length} trusted sources: the labs building the models, the publications covering the industry, the insiders writing the newsletters, and the channels explaining the research.`}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-xl border border-border/60 bg-surface p-6">
            <f.icon className="size-5 text-wire" strokeWidth={2} />
            <h2 className="font-display mt-3 text-base font-semibold text-foreground">{f.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </div>

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-surface p-6 lg:p-8">
          <h2 className="label-mono text-foreground">Editorial stance</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            AIWire does not rewrite articles, does not editorialize headlines, and does not
            fabricate engagement metrics. The wire shows what the sources published, when they
            published it. All rights to headlines, summaries and images remain with their
            publishers.
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-surface p-6 lg:p-8">
          <h2 className="label-mono text-foreground">The sources</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Company blogs, major tech publications, independent newsletters and YouTube channels,
            each hand-picked and grouped by category. See the full list on the{" "}
            <Link to="/sources" className="text-wire underline-offset-4 hover:underline">
              sources page
            </Link>
            .
          </p>
        </div>
      </section>
    </PageShell>
  );
}
