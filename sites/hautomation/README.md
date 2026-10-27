# hautomation.samperet.com

HAUTomation, Sam's home-automation practice: a one-page landing site looking for people doing
custom, creative projects (technology built into furniture, one-off pieces, creative custom work)
who want a partner to make them work. It names the tools Sam uses, Jellyfin and Stremio, and makes
one claim about him: he has been automating home systems since 2000 (the years are counted by the
page's one script). Keep it general about how he works and what he does. The call to action is a
half-hour call booked through Sam's Calendly (embedded in the closing section; the hero and header
buttons jump to it), with email to sam@peret.net as the alternative.

The tools sit in a dark "Get your movie night under control." band with a wall of film posters
tilted back for depth, each row drifting (still under reduced motion, paused on hover). The
posters, in `posters/`, are from films of 1914 to 1928, all in the public domain, from the
Internet Archive; the footer says so. No eyebrow labels anywhere on the page.

The brand is Swedish modern: Familjen Grotesk (by Familjen STHLM, SIL Open Font License, in
`fonts/`) on warm paper (`#f4f2ee`), birch panels (`#ebe7e0`) and ink (`#161616`), with one hero
colour, rouge (`#be2a44`; paper text on it is 5.4:1). The hero's picture is a deck of keys, one lit
in rouge. Never a plain bar of colour down the side of a block.

Plain static files, no build: `index.html`, `404.html`, `favicon.svg` and the fonts. Its own
Vercel project (`hautomation-samperet`) with this folder as the root directory; `vercel.json`
skips a deploy when a push doesn't change this folder.
