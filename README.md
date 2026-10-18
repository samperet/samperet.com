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
Professional, Personal, Family, Adventure or Send me a message — from Merlin's question or
the buttons under the heading — opens the matching sections and closes the rest
(`src/scripts/topics.ts`).

"Send me a message" opens the visitor's email app addressed to `contactEmail` in
`src/pages/index.astro`. TODO: set that address; until then the form says messages aren't
connected yet.

## Merlin

`src/components/Merlin.astro` puts Merlin, the original Microsoft Agent character, on
the homepage. He shows himself once the page is idle (unless the visitor dismissed him
before, or prefers reduced motion), asks what the visitor is interested in and opens those
sections, plays his own animations from the Automation section, and points at wherever you
click. Clicking him asks again.

- Animation engine and frame data: [clippyjs](https://github.com/pi0/clippyjs) (MIT).
- Sprite sheet: `public/merlin/map.png`, extracted from clippyjs. The artwork is
  Microsoft's, from the discontinued Microsoft Agent.
- CSS effects (click marker, controls entrance): a subset of
  [Vivify](https://github.com/Martz90/vivify) (MIT) in `src/styles/vivify-subset.css`.
