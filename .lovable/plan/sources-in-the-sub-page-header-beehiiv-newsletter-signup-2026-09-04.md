# Sources in the sub-page header + beehiiv newsletter signup

## 1. Sources link back in the header (sub-pages only)

`src/components/SiteChrome.tsx` currently has Wire / About / Privacy. Add "Sources" so the nav reads Wire, Sources, About, Privacy. The home page header in `src/routes/index.tsx` keeps only its logo + About link, so Sources stays off the main page.

## 2. Subscribe panel in the right sidebar

In `src/routes/index.tsx`, insert a new `Panel title="Newsletter"` directly after the "Sources" panel (before "How it works"):

- Short line of copy ("One email, the week's signal.")
- Email input styled like the existing search field (dark surface, border, amber focus ring)
- Full-width "Subscribe" button in the amber `wire` accent
- Monospace `label-mono` labels, matching Signal Board / Sources
- Local state: idle / submitting / success / error, with the response message shown under the button in small mono text
- Client-side email validation with zod before calling the server

## 3. The server function

`src/lib/subscribe.functions.ts` does not exist yet, so it will be created:

```ts
export const subscribeEmail = createServerFn({ method: "POST" })
  .inputValidator(...zod email...)
  .handler(async ({ data }) => { ...POST to beehiiv... })
```

The handler POSTs to beehiiv's subscriptions endpoint:

`POST https://api.beehiiv.com/v2/publications/{PUBLICATION_ID}/subscriptions`
with `Authorization: Bearer BEEHIIV_API_KEY` and body `{ email, reactivate_existing: true, send_welcome_email: true, utm_source: "aiwire" }`.

It returns `{ ok: true, message }` or `{ ok: false, message }` — beehiiv's error text is logged server-side, and the user sees a friendly message. Duplicate/existing subscribers are treated as success.

## 4. How to connect beehiiv (what you need to do)

Two values are needed, both from your beehiiv dashboard:

1. **API key** — Settings > Integrations > API, create a new key. This is secret; I'll open a secure form for you to paste it (stored as `BEEHIIV_API_KEY`, never in the code).
2. **Publication ID** — same API page, looks like `pub_xxxxxxxx-xxxx-...`. Stored as `BEEHIIV_PUBLICATION_ID`.

Once both are saved, the subscribe box is live. Until then the box renders but returns a "newsletter not configured yet" error.

## Verification

Build, then load the home page: the Newsletter panel sits between Sources and How it works, submitting an invalid email shows an inline error, and /about, /sources, /privacy headers show the Sources link while the home header does not.
