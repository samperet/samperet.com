# hautomation.samperet.com

HAUTomation, Sam's home-automation practice: a one-page landing site for people installing
open-source home media (Jellyfin, Kodi) and home automation (Home Assistant, ESPHome), with a
Stream Deck of custom keys as the front panel. The hero holds an example deck: pressing a key
lights it in rouge and lists what it does. The call to action is a free call by email
(sam@peret.net).

The brand is Swedish modern: Familjen Grotesk (by Familjen STHLM, SIL Open Font License, in
`fonts/`) on warm paper (`#f4f2ee`), birch panels (`#ebe7e0`) and ink (`#161616`), with one hero
colour, rouge (`#be2a44`; paper text on it is 5.4:1). Never a plain bar of colour down the side
of a block.

Plain static files, no build: `index.html`, `404.html`, `favicon.svg` and the fonts. Its own
Vercel project (`hautomation-samperet`) with this folder as the root directory; `vercel.json`
skips a deploy when a push doesn't change this folder.
