import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/SiteChrome";

const SITE = "https://intel-pal-project.lovable.app";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy · AIWire" },
      {
        name: "description",
        content:
          "AIWire privacy notice: no accounts, no tracking cookies, bookmarks stay in your browser.",
      },
      { property: "og:title", content: "Privacy · AIWire" },
      {
        property: "og:description",
        content:
          "AIWire privacy notice: no accounts, no tracking cookies, bookmarks stay in your browser.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/privacy` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/privacy` }],
  }),
});

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "The short version",
    body: [
      "AIWire is a read-only news aggregator. There are no accounts, no sign-ups, and the site itself does not set tracking cookies or run advertising trackers.",
    ],
  },
  {
    title: "What is stored",
    body: [
      "Your bookmarked stories are saved in your own browser's local storage. That data never leaves your device and is never sent to any server. Clearing your browser storage removes it permanently.",
    ],
  },
  {
    title: "Requests the site makes",
    body: [
      "To build the wire, the server fetches public RSS and Atom feeds from the listed sources. To rank stories by discussion, article URLs are looked up against the public Hacker News Algolia search API. These requests contain article URLs only; they do not include any information about you.",
    ],
  },
  {
    title: "Third-party content",
    body: [
      "Headlines link out to the original publishers, and article thumbnails are loaded from the publishers' own servers. When you follow a link or load an image, you are interacting with that publisher, and their own privacy policies apply.",
    ],
  },
  {
    title: "Questions",
    body: [
      "AIWire is operated by the site owner. For privacy questions, reach out on X:",
    ],
  },
];

const X_URL = "https://x.com/fadedcreator";

function PrivacyPage() {
  return (
    <PageShell
      kicker="Privacy"
      title="Privacy notice"
      lede="Plain-language summary of what AIWire does and does not do with your data."
    >
      <div className="max-w-3xl space-y-10">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-xl font-semibold text-foreground">{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </section>
        ))}
        <p className="label-mono border-t border-border/60 pt-6 text-muted-foreground">
          Last updated September 2026
        </p>
      </div>
    </PageShell>
  );
}
