import json, sys, wave, numpy as np
from faster_whisper import WhisperModel
model = WhisperModel("small.en", device="cpu", compute_type="int8")
with wave.open(sys.argv[1]) as w:
    audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
segments, info = model.transcribe(audio, word_timestamps=True, vad_filter=True, beam_size=5)
out = []
for s in segments:
    out.append({"start": round(s.start, 2), "end": round(s.end, 2), "text": s.text.strip(),
                "words": [{"w": w.word, "s": round(w.start, 2), "e": round(w.end, 2)} for w in (s.words or [])]})
json.dump(out, open(sys.argv[2], "w"), indent=1)
for s in out: print(f"[{s['start']:6.2f} - {s['end']:6.2f}] {s['text']}")
