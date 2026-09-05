# Newsletter: click-to-open signup pill in the sort bar

## Concept

Remove the sidebar Newsletter panel. Add a "NEWSLETTER" pill button on the right side of the control bar, in the empty space next to the Latest / Trending / Most Discussed sort toggle. Clicking it opens a small dropdown panel with the email signup. Always visible, never intrusive, no sticky bar, no dismissal tracking — readers opt in when they're ready.

## 1. Remove the sidebar Newsletter panel

In `src/routes/index.tsx`, delete `<SubscribePanel />` and its component. Sidebar returns to Signal Board → Sources → How it works.

## 2. Newsletter pill in the control bar

In the sticky control bar in `src/routes/index.tsx` (same row as the sort toggle):

- Right-aligned (`ml-auto`) pill button matching the existing pill visual language: `label-mono` text "Newsletter" with a small `Mail` icon (lucide), bordered pill with amber `wire` accent — amber outline/text at rest, filled amber when the dropdown is open
- Sits on the same row as Latest / Trending / Most Discussed on desktop; on mobile it wraps to its own row right-aligned

## 3. Dropdown signup panel

Clicking the pill toggles a small panel anchored below it (absolute positioned, right-aligned to the pill, ~300px wide):

- Dark surface card, border, rounded corners, subtle shadow — same as sidebar panels
- Short pitch: "One email, the week's signal."
- Email input styled like the existing search field (dark surface, border, amber focus ring)
- Full-width amber Subscribe button, `label-mono`
- Client-side email check, then calls the existing `subscribeEmail` server function (beehiiv already connected — no changes there)
- Inline success ("Subscribed. Check your inbox.") or error message in small mono text
- Closes when clicking outside, pressing Escape, or clicking the pill again; stays open after errors; auto-closes ~4s after success
- Subtle scale/fade-in animation on open

No localStorage dismissal state needed — the closed pill IS the resting state.

## 4. Typography

No change in this pass — current Space Grotesk / Manrope / JetBrains Mono stays. The extra font options remain open for you to pick later; applying one is a small follow-up.

## Verification

Build, then check the home page: Newsletter pill sits right of the sort toggle, opens the dropdown on click, subscribes a real email successfully (beehiiv), closes on outside click / Escape / success, and the sidebar shows only Signal Board / Sources / How it works.
