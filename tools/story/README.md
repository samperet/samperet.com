# Story audio pipeline

How `public/stories/bear-shark.*` and `new-orleans.*` were made from phone recordings. Needs ffmpeg, numpy and
`pip install faster-whisper` (the small.en model downloads on first run).

```sh
ffmpeg -i recording.m4a -ac 1 -ar 48000 orig48.wav
ffmpeg -i recording.m4a -ac 1 -ar 16000 orig16.wav
python3 transcribe.py orig16.wav transcript.json          # words with timestamps
python3 clean.py orig48.wav voice_cut.wav map.json transcript.json
#   spectral-subtraction denoise (noise profile from a pause: edit f0/f1), pauses cut
#   two-pass loudness: measure, then apply (see the ffmpeg loudnorm docs); -> voice_norm.wav
python3 tighten.py voice_norm.wav voice_tight.wav tight_map.json   # remaining pauses to 0.45 s
python3 fx.py voice_tight.wav map.json old.vtt final.wav unused.vtt # soft chime in and out
ffmpeg -i final.wav -af alimiter=limit=-1.5dB:level=false -c:a aac -b:a 96k final.m4a
ffmpeg -i final.wav -af alimiter=limit=-1.5dB:level=false -codec:a libmp3lame -q:a 4 final.mp3
ffmpeg -i final.wav -ac 1 -ar 16000 final16.wav
python3 transcribe.py final16.wav final_transcript.json
python3 check_words.py final_transcript.json story.txt     # every word still there? (story.txt: the cues)
python3 align.py final_transcript.json final.vtt story.txt # subtitles timed to the final audio
```

For a narrated book, `clean.py` takes the noise sample's start and end and the longest pause
to keep as extra arguments (`clean.py in.wav out.wav map.json transcript.json 95.0 97.4 1.3`),
and `align_book.py final_transcript.json narration.vtt narration.json` matches the book's
own lines (edit `INTRO`, `VERSES` and `ALIASES`) to the words as read.

Each story's cue file holds its subtitles, one line per cue, in the words as spoken
(`bear-shark.txt`, `new-orleans.txt`). The cues are matched to the heard words word by word, so
a word the recogniser hears differently still lands in place.

`new-orleans` was recorded in a noisy room, with only about 7 dB between voice and noise in the
voice band. Two things to check on a recording like that: the noise sample must be a pause with
no speech in it (here 96.4–101.8 s; the longest pause, 137.5–145.2 s, held a quiet "seemingly"
the recogniser missed), and a word the transcript misses has to be added to it before `clean.py`,
which keeps only what the transcript's words cover. Its levels were set to the bear shark's
(-16 LUFS: `loudnorm=I=-16:TP=-2:LRA=7`, two passes).
