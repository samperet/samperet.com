# samperet.com

Static Astro site.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Sections and topics

Every section in `src/pages/index.astro` is a collapsed row (`<details>`) that opens on
click, or from a link to its id (e.g. `/#travel`). Each lists its `topics`; choosing
Professional, Personal, Family or Adventure from Merlin's question opens the matching
sections and closes the rest (`src/scripts/topics.ts`). Rows can nest: Adventure holds
Humanitarian Relief and Travel (`src/components/Section.astro`). Photos open in a
full-screen viewer (`src/components/PhotoViewer.astro`).
"Send me a message" opens a chat with Merlin instead.

## Backend, traffic and messages

The site is static except for three on-demand routes on Vercel (`@astrojs/vercel`):

- `POST /api/track`: page views and clicks from `src/scripts/track.ts`, each with a per-tab
  session id, the device type and the visitor's city/region/country from Vercel's
  geolocation headers. No IP address is stored; browsers sending Global Privacy Control or
  Do Not Track, and known bots, are not logged.
- `POST /api/message`: messages sent through Merlin's chat (name and text; he reminds
  visitors to put a way to reply in the message).
- `/backend`: the dashboard (visitors, page views, clicks, messages, interests, geography,
  what was clicked, recent activity), behind HTTP Basic auth.

Environment variables on the Vercel project (server-only):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (Neon, Supabase, Vercel Postgres). Tables are created on first use. |
| `BACKEND_PASSWORD` | Password for `/backend`; any username. Without it `/backend` stays locked. |

Locally, without `DATABASE_URL`, `npm run dev` uses an in-memory PGlite database, so
`BACKEND_PASSWORD=dev npm run dev` gives a working backend at http://localhost:4321/backend.

## Merlin

`src/components/Merlin.astro` puts Merlin, the original Microsoft Agent character, on
the homepage, hidden behind a wizard-hat button in the bottom-right corner
(`public/merlin/hat.webp`). Summoned, he asks what the visitor is interested in and opens
those sections, takes messages for Sam through a short chat, tells a few jokes, plays his own animations from
the Automation section, and points at wherever you click. The hat hides while he's out;
clicking him asks again, and "Send Merlin back to his hat" (or the Automation section's
Dismiss button) puts him away.

- Animation engine and frame data: [clippyjs](https://github.com/pi0/clippyjs) (MIT).
- Sprite sheet: `public/merlin/map.png`, extracted from clippyjs. The artwork is
  Microsoft's, from the discontinued Microsoft Agent.
- CSS effects (click marker, controls entrance): a subset of
  [Vivify](https://github.com/Martz90/vivify) (MIT) in `src/styles/vivify-subset.css`.
