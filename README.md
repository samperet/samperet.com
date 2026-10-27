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
The rules: hairlines not boxes, one accent, no pills except metadata, no bars of colour down
the side of a block, nothing animates on its own, one flourish per page. **`/branding/`** is the unlinked, `noindex` style guide that shows
all of it; keep it current when a token or component changes.

## Other sites in this repository

- `sites/hautomation/` is **hautomation.samperet.com**, HAUTomation: a one-page landing site for
  installing open-source home media and home automation with a Stream Deck of custom keys, in a
  Swedish-modern brand with rouge as its hero colour. Plain static files, its own Vercel project
  (`hautomation-samperet`) with this folder as its root directory; see its README.
- `sites/automate/` is **automate.samperet.com**, a one-page landing site for home-automation
  consulting. Plain static files, deployed by its own Vercel project (`automate-samperet`) with
  this folder as its root directory; see its README.

## Sections and topics

Every section in `src/pages/index.astro` is a tile (`<details>`, `src/components/Section.astro`):
a picture from `tile.src` (or a palette colour, `tile.color`) with only its title on it, as large as
the card allows: the homepage script fits each title to its card's width and the lower three
fifths of its height (`kind` and `line` stay in the data but aren't shown). CommunityOS and the
Percentage Allocator are smaller cards under a Projects heading after the main grid.
Clicking it, or a link to its id (e.g. `/#travel-and-adventure`; old ids such as `/#travel` still work), opens it on its own: the other tiles step
out and its text, links, photos and embeds follow below. While a card is open the header
shrinks and a "← Home" button under Career dismisses it; the cross or Escape does too. Each lists its `topics`; choosing Personal, Family or Adventure
from Merlin's question opens the matching tiles and closes the rest (`src/scripts/topics.ts`).
Professional goes to `/career/`, where the work now lives. Tiles can nest (a section's
`children`), though none do now. A section's `message` adds a button that opens Merlin's message
chat (CommunityOS uses it for "Ask about setting it up").

**Interests and book shelves.** Books live in `src/data/books.ts`, each tagged with interests
(yoga, sufism, spirituality, heartwise, circles, travel, adventure, stories, family, men, career,
leadership). A card's `interests`, or a page's (`<Base interests={[…]}>`, shown in the footer),
puts a "Recommended reading" shelf at its foot with the books tagged with any of them
(`src/components/Shelf.astro`); with no matching book there is no shelf. Each cover (in
`public/reading/`) is a little book that opens on its spine on hover and links out. Only the
Spirituality card has tagged books so far: tag a book `men` and it appears on `/mens-group/`.

**Cards in parts.** A card's `parts` are sections of it under their own headings: Yoga, Sufism
and Get HeartWise in "Yoga, Spirituality & Personal Development" (HeartWise is no longer a card of
its own; `/#heartwise` opens the card narrowed to it). A row of the parts' names at the top
narrows the card to one, and its shelf to that part's interests. With `ask`, Merlin pops up the
first time the card opens on a visit, asks the question with the parts as answers, narrows the
card to the one chosen and goes back to his hat.

**Footer.** Every public page ends with `src/components/Footer.astro`: the page's shelf, links,
and the copyright. On the homepage it holds two more cards: Recommended Books (every book) and
Photos (every photo on the site, by the card or career chapter it appears in, filterable like a
card in parts; the career photos come from `src/data/photos.ts`). Other pages link to them
(`/#recommended-books`, `/#photos`). Tile pictures that aren't
already elsewhere live in `public/tiles/`. An open tile shows only its title on top, with no picture, kind or line. Photos open in a full-screen viewer
(`src/components/PhotoViewer.astro`). Galleries never crop: they are justified, each photo at
its own shape and each row grown to the full width at one height, using sizes read from the
files at build time (`src/lib/photo-size.ts`, with sharp). Tile faces are the one place a
picture is cut to a shape (4:3); set `tile.position` to keep the right part in view. A photo shows a caption there only when it has
`caption`, which is Sam's own words; `alt` is for screen readers and never shown.

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
`.m4a` plus an `.mp3` twin) and, at its foot, jayaandfiona.com live, edge to edge across the window and as tall as its
page, so nothing scrolls inside it (`embedLast` puts a card's embed after everything else; the
heights, measured from the site, are in `index.astro` and need raising if the site grows).

## Stories

Stories is a card on the homepage, before Family. Inside it, Foreside Fiasco and The Golden
Berry are tiles that open their flipbook pages, and The Bear Shark is a tile that opens the photo
viewer and plays Sam telling it (a link tile with `story`). The books' "← Home" returns to the
open card, and the old `/stories/` page (`src/pages/stories.astro`) now only forwards to it.

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

## Men's group

`/mens-group/` (`src/pages/mens-group.astro`; on the homepage the Get HeartWise part ends with "I'm
currently looking for men to start a men's group with." and a "Join a men's group" button to it,
a card's `cta`) invites
men to a group in Charlotte, VT, meeting weekly for three months through Lover, Warrior, Magician
and King. The cost is commitment and accountability.

The page has its own look, rougher than the rest of the site: `body.grit` redefines the colour
tokens (near-black, bone, Beach gold as its one accent), adds film grain, squares every corner,
and sets headings in Oswald, a condensed grotesque loaded only on this page (`astro.config.mjs`).
Merlin and the photo viewer are off here.

Five blocks show the places filled: `src/data/mens-group.ts` holds `{ size: 5, filled: 2 }`,
which the page reads, so raise `filled` as men are accepted. The time,
place and start date are set once all five are in.

The archetypes sit on a wheel that stays in view while their explanations scroll past, turning
clockwise with the scroll so Lover, Warrior, Magician and King come to the top in order (the
wedges run counter-clockwise from the top for that); clicking one scrolls to it, and the names
turn with the wheel, upright on top. `#lover`,
`#warrior`, `#magician` or `#king` opens on one. MKP publishes no colours for the archetypes, so
they follow their elements in Cliff Barry's Shadow Work map: Kazan for the Lover (water), burnt
sienna `#a3472a` for the Warrior (earth), Hackberry for the Magician (air) and Beach gold for the
King (fire).

The application asks one question at a time, like Typeform: a progress bar, Enter to move on
(Shift+Enter for a new line), letters to pick choices, ↑ ↓ to go back and forth. It waits behind
an APPLY NOW button. Name, email, why, the video and the commitment are required; phone, town and
the times that suit are optional. The video answers "When have you felt most alive?" in up to a
minute: a short note on what to record comes first, and the camera and Record button only after
"I'm ready" (the page requires it where the browser can record; the server still accepts an
application without one, for browsers that can't) (MediaRecorder at about 350 kb/s, so a minute stays under Vercel's 4.5 MB request limit;
WebM gets its duration written in by `fix-webm-duration`). It posts to `POST /api/apply`:
applications land with Merlin's messages (they show at `/backend`) and are emailed to Sam with
the applicant as the reply-to. The video travels only as an attachment to that email, never
stored on the site, so an application with a video succeeds only once the email is sent. Without
JavaScript every explanation shows, the questions are one plain form without the video, and the
post comes back to the page's `#applied` note.

Email needs `RESEND_FROM` on a domain verified in Resend. Until samperet.com is verified there
(Resend → Domains, then its DNS records added to samperet.com's DNS on Vercel), Resend refuses
every message, and with no database connected the form has nowhere to put an application.

## Admin studio

`/admin` (`src/pages/admin.astro`) is the content studio, behind HTTP Basic auth (any username).
The password is `ADMIN_PASSWORD` when that is set on Vercel; otherwise the one whose salted PBKDF2
hash sits in `src/middleware.ts` (the repository is public, so the password itself is not in it).

Its tool is the speed take: pick a track (the site's recordings, or upload one), choose a
recording speed (50% by default, 25–100%), and press Record. After a 3-2-1 count the track plays
at that speed, pitch kept by default, while the camera records. The studio then plays the take
back 1 ÷ speed times faster into a canvas, records that with the original track at full speed,
and offers the result to download (H.264 MP4 where the browser can, otherwise WebM with its
duration written in by `fix-webm-duration`). A Sync slider shifts the video against the track by
up to 300 ms if the movement lands early or late. It all runs in the browser; nothing is uploaded
or stored.

## Backend, traffic and messages

The site is static except for a few on-demand routes on Vercel (`@astrojs/vercel`):

- `POST /api/track`: page views and clicks from `src/scripts/track.ts`, each with a per-tab
  session id, the device type and the visitor's city/region/country from Vercel's
  geolocation headers. No IP address is stored; browsers sending Global Privacy Control or
  Do Not Track, and known bots, are not logged.
- `POST /api/message`: messages sent through Merlin's chat (name and text; he reminds
  visitors to put a way to reply in the message).
- `POST /api/apply`: applications to the men's group, kept and emailed like messages.
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
