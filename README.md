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

A photo can carry a story: `story: { title, audio, captions }` on the photo plays the audio
over the picture with the WebVTT captions as subtitles, starting as soon as the photo is
opened. Files live in `public/stories/`, each as `.m4a` plus an `.mp3` twin for browsers
without AAC. The bear shark is the first one; `tools/story/` has the scripts that cleaned
the recording, cut the pauses, added the entrance and exit and timed the subtitles.
"Send me a message" opens a chat with Merlin instead.

## Foreside Fiasco

`/foreside-fiasco/` is the picture book as a flipbook (`src/pages/foreside-fiasco.astro`,
animated by [page-flip](https://github.com/Nodlik/StPageFlip), MIT). Pages are WebP images
rendered from the PDF at 150 dpi (`pdftoppm -r 150 -png book.pdf page`, then resized to
1400 px wide) in `public/books/foreside-fiasco/`; the PDF itself is at
`public/books/foreside-fiasco.pdf`. Narration is a TODO in that page's frontmatter.

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
| `DATABASE_URL` or `POSTGRES_URL` | Postgres connection string. Connecting a database from the Vercel Marketplace (Neon, Supabase) sets these automatically. Tables are created on first use. |
| `BACKEND_PASSWORD` | Password for `/backend`; any username. Without it `/backend` stays locked. |
| `RESEND_KEY` | Resend API key: each message is also emailed to Sam. |
| `MESSAGE_NOTIFY_TO` | Who gets those emails. Default `samperet@gmail.com`. |
| `RESEND_FROM` | Sender, on a domain verified in Resend. Default `Merlin <merlin@samperet.com>`. |

A message counts as delivered when either the database or the email took it, so one being
down loses nothing. When the visitor's message contains an email address, replies go to it.

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
