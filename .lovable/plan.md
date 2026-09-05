# Newsletter: replace sidebar panel with a dismissible sticky bottom bar

## What changes

### 1. Remove the sidebar Newsletter panel

In `src/routes/index.tsx`, delete the `<SubscribePanel />` usage and the `SubscribePanel` component (plus its `subscribeEmail` / `useServerFn` imports move to the new bar component). The sidebar goes back to Signal Board → Sources → How it works.

### 2. New `NewsletterBar` component

New file `src/components/NewsletterBar.tsx`, rendered once in the home page (root level, after the footer):

- Fixed to the bottom of the viewport, full width, above all content (high z-index)
- Dark surface with top border and subtle shadow, matching the site's dark wire aesthetic
- Layout (desktop): `label-mono` "NEWSLETTER" tag + short pitch ("One email, the week's signal.") on the left, email input + amber Subscribe button on the right, X close button at the far right
- Mobile: stacks into two rows (pitch on top, input + button below), close button top-right corner
- Input styled like the existing search field; amber `wire` accent on the button; monospace labels, same as the current panel

### 3. Behavior

- **Dismiss**: X button slides the bar down and away; dismissal is remembered in `localStorage` (`aiwire-newsletter-dismissed`) so it stays gone on future visits
- **Entrance**: slides up with a short ease animation ~1.5s after page load so it doesn't flash on arrival
- **Submit**: same client-side email check, then calls the existing `subscribeEmail` server function (no changes needed there — beehiiv is already connected)
- **Success**: shows "Subscribed. Check your inbox." in amber inside the bar, then auto-dismisses after ~4 seconds and stays dismissed
- **Error**: shows the error message inline in the bar, bar stays open

### 4. Spacing

A bottom padding is added to the page while the bar is visible so it never covers the footer content.

## Verification

Build, then check the home page: bar slides in at the bottom, subscribing with a real email returns the success message and the bar dismisses itself, the X closes it and it stays closed after reload, and the sidebar shows only Signal Board / Sources / How it works.
