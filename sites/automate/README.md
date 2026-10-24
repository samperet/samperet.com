# automate.samperet.com

A one-page landing site for Sam's home-automation consulting: media libraries, living-room
scenes, ESP32s and local movie collections, with a call to book a free consulting call
(an email to sam@peret.net).

Plain static files, no build: `index.html`, `404.html`, `favicon.svg` and the Fraunces fonts
(SIL Open Font License) in `fonts/`. Its own Vercel project with this folder as the root
directory; `vercel.json` skips a deploy when a push doesn't change this folder.
