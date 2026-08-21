export type SourceKind = "publication" | "newsletter";

export type SourceDef = {
  source: string;
  url: string;
  kind: SourceKind;
  accent: string;
};

export const FEEDS: SourceDef[] = [
  {
    source: "TechCrunch",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    kind: "publication",
    accent: "oklch(0.78 0.17 145)",
  },
  {
    source: "The Verge",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    kind: "publication",
    accent: "oklch(0.76 0.16 25)",
  },
  {
    source: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
    kind: "publication",
    accent: "oklch(0.78 0.15 60)",
  },
  {
    source: "The Guardian",
    url: "https://www.theguardian.com/technology/artificialintelligenceai/rss",
    kind: "publication",
    accent: "oklch(0.72 0.15 250)",
  },
  {
    source: "MIT Tech Review",
    url: "https://www.technologyreview.com/feed/",
    kind: "publication",
    accent: "oklch(0.74 0.14 320)",
  },
  {
    source: "Hugging Face",
    url: "https://huggingface.co/blog/feed.xml",
    kind: "newsletter",
    accent: "oklch(0.82 0.15 95)",
  },
  {
    source: "One Useful Thing",
    url: "https://www.oneusefulthing.org/feed",
    kind: "newsletter",
    accent: "oklch(0.74 0.14 200)",
  },
  {
    source: "The Innermost Loop",
    url: "https://theinnermostloop.substack.com/feed",
    kind: "newsletter",
    accent: "oklch(0.72 0.14 285)",
  },
];

export const SOURCE_META: Record<string, { kind: SourceKind; accent: string }> =
  Object.fromEntries(FEEDS.map((f) => [f.source, { kind: f.kind, accent: f.accent }]));
