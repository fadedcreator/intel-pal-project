# Switch display typeface to Sora + Manrope

## What changes
Swap the headline/display font from **Space Grotesk** to **Sora**, keeping **Manrope** for body text and **JetBrains Mono** for mono labels/metadata. Sora is a more geometric, tighter grotesk that gives the site a cleaner, more "premium product" headline feel while staying in the tech-wire family.

## Files
1. `src/routes/__root.tsx` — update the Google Fonts stylesheet `<link>`:
   - Replace `family=Space+Grotesk:wght@500;600;700` with `family=Sora:wght@500;600;700`.
   - Keep `family=Manrope:wght@400;500;600;700` and `family=JetBrains+Mono:wght@400;500;600`.
2. `src/styles.css` — update the theme token:
   - `--font-display: "Space Grotesk", ...` → `--font-display: "Sora", ui-sans-serif, system-ui, sans-serif;`
   - `--font-sans` (Manrope) and `--font-mono` (JetBrains Mono) unchanged.

## Why
- Minimal, low-risk change: one font family name in two files.
- Sora pairs cleanly with Manrope (both geometric/humanist sans) and preserves the dark editorial tech-wire identity.
- No layout/component changes needed; headlines will render slightly tighter and more modern.

## Verify
- `bun run build` exits 0.
- Playwright check on `/` and `/about` confirms Sora headlines render (computed `font-family` contains `"Sora"`) with no console errors and no missing-font fallback.
