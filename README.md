# samperet.com

Static Astro site.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Design system

Every page is built on `src/layouts/Base.astro` (the one `<head>`, the shared styles, Merlin and
the photo viewer) from two stylesheets:

- `src/styles/tokens.css` — the palette (Rausch, Hackberry, Kazan, Babu, Lima, Beach, Ebisu,
  Tirol, Foggy, Hof), the semantic colours pages actually use (`--bg`, `--fg`, `--muted`,
  `--rule`, `--accent`, `--focus`…), the four skill colours, type scale, spacing (`--s1`–`--s9`),
  radius (3px; never a pill) and motion. The site is light only; there is no dark mode.
- `src/styles/base.css` — reset, type (Fraunces for display, the system sans for body), links,
  `.arrow-link`, buttons, `.toggle`, `.tag` (metadata only), `.mark` (skill marks), `.badge`.

Fraunces is self-hosted at build time through Astro's `fonts` config (`astro.config.mjs`).
The rules: hairlines not boxes, one accent, no pills except metadata, nothing animates on its
own, one flourish per page. **`/branding/`** is the unlinked, `noindex` style guide that shows
all of it; keep it current when a token or component changes.

## Sections and topics

Every section in `src/pages/index.astro` is a tile (`<details>`, `src/components/Section.astro`):
a picture from `tile.src` (or a palette colour, `tile.color`) with its kind, title and one line.
Clicking it, or a link to its id (e.g. `/#travel-and-adventure`; old ids such as `/#travel` still work), opens it on its own: the other tiles step
out and its text, links, photos and embeds follow below. While a card is open the header
shrinks and a "← Home" button under Career dismisses it; the cross or Escape does too. Each lists its `topics`; choosing Personal, Family or Adventure
from Merlin's question opens the matching tiles and closes the rest (`src/scripts/topics.ts`).
Professional goes to `/career/`, where the work now lives. Tiles can nest (a section's
`children`), though none do now. A section's `message` adds a button that opens Merlin's message
chat (CommunityOS uses it for "Ask about setting it up"). A section's `books` adds a "Recommended reading" shelf: each cover (in `public/reading/`) is a
little book that opens on its spine on hover and links out. Tile pictures that aren't
already elsewhere live in `public/tiles/`. Photos open in a full-screen viewer
(`src/components/PhotoViewer.astro`).

A photo can carry a story: `story: { title, audio, captions }` on the photo plays the audio
over the picture with the WebVTT captions as subtitles, starting as soon as the photo is
opened. Files live in `public/stories/`, each as `.m4a` plus an `.mp3` twin for browsers
without AAC. The bear shark is the first one; `tools/story/` has the scripts that cleaned
the recording, cut the pauses, added the entrance and exit and timed the subtitles.
"Send me a message" opens a chat with Merlin instead.

The Travel & Adventure card embeds a globe of Sam's travels: `public/globe/` holds the page
(`index.html`, with the 83 stops inline), self-hosted d3 7.9.0 and topojson-client 3.1.0, and
Natural Earth's 110m world map. It came from Sam's Route Atlas export, rebuilt because the export
was broken (a corrupted d3 and map files it could not reach); the route curves are illustrative,
not GPS tracks. It loads only when the card opens, and only turns when dragged or asked to spin.

## Career

`/career/` (`src/pages/career.astro`) is the résumé as a page: summary, competencies, five
roles with titles and dates, initiatives, education, community, boards and awards, all data
at the top of the file. Each highlight is marked with the tagline's four skills; choosing one
under "Show me" keeps the matching highlights and dims the rest. The side list follows the
section in view, ALPS has a row of photos and Airbnb the bear-shark story (both open full
screen). Printing from the browser gives a clean multi-page CV.

Logos live in `public/logos/` as trimmed PNGs in their own colours. ALPS's came from acadialps.com, Cloud Nurv's
from nurv.au and Founders Wanted's from Sam; Airbnb, SNHU, altMBA and BDO from Brandfetch.
Whaleback Systems has none yet.

The Percentage Allocator card embeds Sam's percentcalc app, copied from
[samperet/percentcalc](https://github.com/samperet/percentcalc) into `public/percentcalc/` (served at
`/percentcalc/`, installable and offline through its own service worker). To update it, copy the
repository's files over that folder again.

The Family card holds the family photos, a "Memories archive" (a section's `memories`: each
recording plays in its own row with its transcript folded beneath; files in `public/memories/`,
`.m4a` plus an `.mp3` twin) and jayaandfiona.com as a nested card.

## Stories

`/stories/` (`src/pages/stories.astro`) gathers the picture books and the told stories as tiles:
Foreside Fiasco and The Golden Berry open their flipbooks, and the bear shark opens the photo
viewer and plays Sam telling it. The homepage links to it next to Career.

Both books use `src/components/Flipbook.astro`: give it the page count, image folder and page
size, and optionally a PDF to download, an `about` note, a `buy` link and `narration` for
"Read it to me". The Golden Berry (`/golden-berry/`,
Little Red Riding Hood and The Golden Berry by Jaya Elnora Peret, illustrated by the Ukrainian
watercolor artist Kateryna Rohotova) is 16 square pages rendered at
1200 px from the PDF in `public/books/golden-berry/`, with a note on how Jaya told it and a
link to buy the paperback on Lulu (no PDF download).

## Foreside Fiasco

`/foreside-fiasco/` is the picture book as a flipbook (`src/pages/foreside-fiasco.astro`,
animated by [page-flip](https://github.com/Nodlik/StPageFlip), MIT). Pages are WebP images
rendered from the PDF at 150 dpi (`pdftoppm -r 150 -png book.pdf page`, then resized to
1400 px wide) in `public/books/foreside-fiasco/`; the PDF itself is at
`public/books/foreside-fiasco.pdf`.

"Read it to me" plays Sam's narration (`narration.m4a` is his original recording, untouched;
`narration.mp3` is a straight transcode for browsers without AAC) with subtitles (`narration.vtt`) and turns the pages on cue from
`narration.json`, which `tools/story/align_book.py` builds from the transcription: when the
title, the dedication and each verse begin, and when to show the painting on a phone.
Turning a page by hand pauses the reading; Keep reading brings the book back to it.

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
those sections, takes messages for Sam through a short chat, tells a few jokes, and points
at wherever you click. The hat hides while he's out; clicking him asks again, and
"Silencio" puts him away. He's on every page except the backend and the brand guide.

Everything he says, asks and takes down appears in one card built from the design system
(see `/branding/#merlin`); clippyjs's own yellow speech balloon is never used.

- Animation engine and frame data: [clippyjs](https://github.com/pi0/clippyjs) (MIT).
- Sprite sheet: `public/merlin/map.png`, extracted from clippyjs. The artwork is
  Microsoft's, from the discontinued Microsoft Agent.
- CSS effect for the click marker: a subset of
  [Vivify](https://github.com/Martz90/vivify) (MIT) in `src/styles/vivify-subset.css`.
