# Story audio pipeline

How `public/stories/bear-shark.*` was made from a phone recording. Needs ffmpeg, numpy and
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
python3 check_words.py final_transcript.json               # every word still there? (edit the script)
python3 align.py final_transcript.json final.vtt           # subtitles timed to the final audio (edit CUES)
```

For a narrated book, `clean.py` takes the noise sample's start and end and the longest pause
to keep as extra arguments (`clean.py in.wav out.wav map.json transcript.json 95.0 97.4 1.3`),
and `align_book.py final_transcript.json narration.vtt narration.json` matches the book's
own lines (edit `INTRO`, `VERSES` and `ALIASES`) to the words as read.
