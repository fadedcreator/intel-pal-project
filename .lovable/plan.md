# Move Sources/About out of the header

Remove the "Sources" and "About" links from the header navigation next to the AIWire logo, and turn the "How it works" sidebar panel sentence into a link to the About page.

## Context

- The home page (`src/routes/index.tsx`) header has its own inline nav with Sources and About links (lines 233-246).
- The shared `SiteHeader` in `src/components/SiteChrome.tsx` (used by /about, /sources, /privacy) has a nav with Wire, Sources, About, Privacy.
- The home page sidebar has a "How it works" panel (lines 510-517) with a short description.
- Both footers already keep Sources/About/Privacy links, so those pages remain reachable.

## Changes

### 1. `src/routes/index.tsx` — remove header nav
- Delete the `<nav>` block (lines 233-246) that renders Sources/About links next to the logo. The logo, search bar, and action buttons stay.

### 2. `src/components/SiteChrome.tsx` — trim SiteHeader nav
- Remove the "Sources" and "About" entries from the nav array in `SiteHeader`, leaving "Wire" and "Privacy" (the same trim applied to both headers so the chrome is consistent across pages).

### 3. `src/routes/index.tsx` — link "How it works" to About
- In the "How it works" `Panel` (lines 510-517), wrap the words "how it works" in a `<Link to="/about">` styled to match the existing wire-accent link treatment used elsewhere (e.g. `text-wire underline-offset-4 hover:underline`). `Link` is already imported at the top of the file.

## Verification
- Build the app and load the home page: no Sources/About links next to the logo; "How it works" panel links to /about.
- Visit /about, /sources, /privacy: their headers show only Wire + Privacy; footers still offer Sources/About/Privacy.
