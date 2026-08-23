export type SourceKind = "company" | "publication" | "newsletter" | "youtube";

export const SOURCE_KINDS: SourceKind[] = ["company", "publication", "newsletter", "youtube"];

export const KIND_LABELS: Record<SourceKind, string> = {
  company: "Companies",
  publication: "Publications",
  newsletter: "Newsletters",
  youtube: "YouTube",
};

export type SourceDef = {
  source: string;
  url: string;
  kind: SourceKind;
  accent: string;
};

export const FEEDS: SourceDef[] = [
  // Companies
  {
    source: "OpenAI",
    url: "https://openai.com/news/rss.xml",
    kind: "company",
    accent: "oklch(0.80 0.13 165)",
  },
  {
    source: "Anthropic",
    url: "https://www.anthropic.com/rss.xml",
    kind: "company",
    accent: "oklch(0.78 0.14 45)",
  },
  {
    source: "Google DeepMind",
    url: "https://deepmind.google/blog/rss/feed/",
    kind: "company",
    accent: "oklch(0.74 0.15 265)",
  },
  {
    source: "Google AI",
    url: "https://blog.google/technology/ai/rss/",
    kind: "company",
    accent: "oklch(0.80 0.14 230)",
  },
  {
    source: "Meta AI",
    url: "https://ai.meta.com/blog/feed/",
    kind: "company",
    accent: "oklch(0.72 0.16 255)",
  },
  {
    source: "Microsoft AI",
    url: "https://blogs.microsoft.com/ai/feed/",
    kind: "company",
    accent: "oklch(0.76 0.15 195)",
  },
  {
    source: "Hugging Face",
    url: "https://huggingface.co/blog/feed.xml",
    kind: "company",
    accent: "oklch(0.82 0.15 95)",
  },

  // Publications
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
    source: "VentureBeat AI",
    url: "https://venturebeat.com/category/ai/feed/",
    kind: "publication",
    accent: "oklch(0.80 0.15 130)",
  },
  {
    source: "Wired AI",
    url: "https://www.wired.com/feed/tag/ai/latest/rss",
    kind: "publication",
    accent: "oklch(0.70 0.14 10)",
  },
  {
    source: "The Register AI",
    url: "https://www.theregister.com/software/ai_ml/headlines.atom",
    kind: "publication",
    accent: "oklch(0.74 0.16 35)",
  },

  // Newsletters / insiders
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
  {
    source: "Simon Willison",
    url: "https://simonwillison.net/atom/blog/",
    kind: "newsletter",
    accent: "oklch(0.78 0.13 175)",
  },
  {
    source: "The Batch",
    url: "https://www.deeplearning.ai/the-batch/feed/",
    kind: "newsletter",
    accent: "oklch(0.80 0.13 110)",
  },
  {
    source: "ImportAI",
    url: "https://importai.substack.com/feed",
    kind: "newsletter",
    accent: "oklch(0.76 0.13 305)",
  },
  {
    source: "Ben's Bites",
    url: "https://bensbites.beehiiv.com/feed",
    kind: "newsletter",
    accent: "oklch(0.82 0.14 75)",
  },
  {
    source: "TLDR AI",
    url: "https://tldr.tech/ai/rss",
    kind: "newsletter",
    accent: "oklch(0.72 0.13 215)",
  },

  // YouTube
  {
    source: "Andrej Karpathy",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCB1rRq8aevRkX6kVMlgBVXQ",
    kind: "youtube",
    accent: "oklch(0.70 0.17 20)",
  },
  {
    source: "AI Explained",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCNJ1Ymd5yFuUPtn21xtRbbw",
    kind: "youtube",
    accent: "oklch(0.74 0.15 340)",
  },
  {
    source: "Two Minute Papers",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCbfYPyITQ-7l4upoX8nvctg",
    kind: "youtube",
    accent: "oklch(0.78 0.14 145)",
  },
  {
    source: "Yannic Kilcher",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCZHmQk67mSJgfCCTn7xBfew",
    kind: "youtube",
    accent: "oklch(0.76 0.14 275)",
  },
  {
    source: "DeepLearning.AI",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCcIXc5mJsHVYTZR1maL5l9w",
    kind: "youtube",
    accent: "oklch(0.80 0.12 190)",
  },
  {
    source: "Matthew Berman",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCawZsQWqfGSbCI5yjkdVkTA",
    kind: "youtube",
    accent: "oklch(0.82 0.13 55)",
  },
];

export const SOURCE_META: Record<string, { kind: SourceKind; accent: string }> =
  Object.fromEntries(FEEDS.map((f) => [f.source, { kind: f.kind, accent: f.accent }]));
