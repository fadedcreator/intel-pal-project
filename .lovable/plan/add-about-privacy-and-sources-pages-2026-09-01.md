# Add About, Privacy, and Sources pages

Create three new routes matching the existing AIWire design language (dark wire-service theme, Space Grotesk headings, JetBrains Mono metadata, amber accent).

## Pages

### 1. `/sources` — src/routes/sources.tsx
- The source of truth is `src/lib/sources.ts` (FEEDS array, 29 sources). The page will **derive its content directly from FEEDS**, so the list is always correct by construction.
- Grouped by category using existing `SOURCE_KINDS` / `KIND_LABELS`: Companies (OpenAI, Anthropic, Google DeepMind, Google AI, Meta AI, Microsoft AI, Hugging Face), Publications (TechCrunch, The Verge, Ars Technica, The Guardian, MIT Tech Review, VentureBeat AI, Wired AI, The Register AI), Newsletters (One Useful Thing, The Innermost Loop, Simon Willison, The Batch, ImportAI, Ben's Bites, TLDR AI), YouTube (Andrej Karpathy, AI Explained, Two Minute Papers, Yannic Kilcher, DeepLearning.AI, Matthew Berman).
- Each source card: accent color dot, name, category chip, short note (e.g. "YouTube: full videos only, Shorts filtered"), and a link to the source's site/feed.
- Header strip explaining how the wire works: feeds polled server-side, deduplicated, per-source representation guaranteed.

### 2. `/about` — src/routes/about.tsx
- What AIWire is: a live AI news wire aggregating company blogs, publications, newsletters, and YouTube channels into one fast page.
- How it works: RSS/Atom ingestion, dedupe, sort modes (Latest / Trending / Most Discussed via Hacker News engagement), Signal Board topic detection, bookmarks kept locally in the browser.
- Editorial stance: links out to original sources; no rewritten articles; no fabricated metrics.
- Design matches the home page (same header chrome, panels, typography).

### 3. `/privacy` — src/routes/privacy.tsx
- App-owned privacy notice attributed to the site owner:
  - No accounts, no tracking cookies set by the app itself.
  - Bookmarks are stored only in the visitor's browser localStorage; never sent to a server.
  - Server-side feed fetching and Hacker News Algolia lookups: what requests are made and why; no personal data included.
  - Third-party content: outbound links and embedded thumbnails are served by the original publishers, each with their own policies.
  - Contact placeholder for privacy questions (owner email to be filled in by the user).
- No compliance certifications or legal claims beyond these facts.

## Shared work
- Shared page chrome: reuse the home page header/footer pattern; extract a minimal `SiteHeader`/`SiteFooter` only if duplication is trivial — otherwise inline consistent markup.
- Add nav links (About · Sources · Privacy) to the home page header and/or footer in `src/routes/index.tsx`.
- Each route gets its own `head()`: unique title, description, og:title, og:description, og:url and canonical pointing at `https://intel-pal-project.lovable.app/<path>`.
- Verify with a build + browser pass: all three pages render, nav links work, source list shows all 29 sources in 4 categories.

## Technical details
- New files: `src/routes/about.tsx`, `src/routes/privacy.tsx`, `src/routes/sources.tsx` with `createFileRoute("/about")` etc. (routeTree.gen.ts regenerates automatically).
- Import `FEEDS`, `SOURCE_KINDS`, `KIND_LABELS`, `SOURCE_META` from `@/lib/sources` on the Sources page — no hardcoded list to drift out of sync.
- No backend changes needed; pages are static content plus the FEEDS constant.
