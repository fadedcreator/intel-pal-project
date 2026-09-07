import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

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
      "AIWire is a read-only news aggregator. The site itself needs no account: you can read everything without signing up, and it does not set tracking cookies or run advertising trackers.",
      "The one exception is the optional newsletter. If you choose to subscribe, your email address is sent to Beehiiv, the service that runs the newsletter.",
    ],
  },
  {
    title: "Newsletter",
    body: [
      "Subscribing is entirely optional and nothing on the site requires it.",
      "When you subscribe, your email address is stored and processed by Beehiiv, our newsletter provider, and Beehiiv's own privacy policy applies to that data.",
      "You can unsubscribe at any time using the link at the bottom of any newsletter email.",
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
const BEEHIIV_PRIVACY = "https://www.beehiiv.com/privacy";

function PrivacyPage() {
  return (
    <PageShell
      kicker="Privacy"
      title="Privacy notice"
      lede="Plain-language summary of what AIWire does and does not do with your data."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {SECTIONS.map((s) => (
          <section
            key={s.title}
            className="rounded-2xl border border-border/60 bg-surface p-6 lg:p-8"
          >
            <h2 className="font-display text-xl font-semibold text-foreground">{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
            {s.title === "Newsletter" && (
              <a
                href={BEEHIIV_PRIVACY}
                target="_blank"
                rel="noreferrer"
                className="label-mono mt-5 inline-flex items-center gap-1.5 text-wire underline-offset-4 hover:underline"
              >
                Beehiiv privacy policy
                <ArrowUpRight className="size-3.5" />
              </a>
            )}
            {s.title === "Questions" && (
              <a
                href={X_URL}
                target="_blank"
                rel="noreferrer"
                className="label-mono mt-5 inline-flex items-center gap-1.5 text-wire underline-offset-4 hover:underline"
              >
                @fadedcreator on X
                <ArrowUpRight className="size-3.5" />
              </a>
            )}
          </section>
        ))}
      </div>
      <p className="label-mono mt-12 border-t border-border/60 pt-8 text-muted-foreground">
        Last updated September 2026
      </p>

    </PageShell>
  );
}
