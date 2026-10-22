"""Second pass on the cleaned, leveled voice: any near-silence longer than MAX_PAUSE is
shortened to MAX_PAUSE, leaving the natural short pauses alone."""
import wave, sys, json, numpy as np
def read(path):
    with wave.open(path) as w:
        return w.getframerate(), np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
def write(path, sr, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
sr, x = read(sys.argv[1])
MAX_PAUSE, MIN_RUN, LEAD, TAIL = 0.45, 0.60, 0.15, 0.45
# voice band only
F = np.fft.rfft(x); fq = np.fft.rfftfreq(len(x), 1 / sr)
F[(fq < 250) | (fq > 3500)] = 0
v = np.fft.irfft(F, len(x))
hop = int(0.02 * sr)
db = np.array([20 * np.log10(np.sqrt(np.mean(v[i:i+hop] ** 2)) + 1e-9) for i in range(0, len(v) - hop, hop)])
thr = np.percentile(db, 90) - 22
# median over 5 frames (100 ms) so a soft consonant inside a word never counts as a pause
db = np.array([np.median(db[max(0, i - 2):i + 3]) for i in range(len(db))])
quiet = db < thr
runs, start = [], None
for i, q in enumerate(list(quiet) + [False]):
    if q and start is None: start = i
    if not q and start is not None:
        if (i - start) * 0.02 >= MIN_RUN: runs.append((start * 0.02, i * 0.02))
        start = None
first = np.argmax(~quiet) * 0.02; last = (len(quiet) - np.argmax(~quiet[::-1])) * 0.02
cuts = []
for s, e in runs:
    if e <= first or s >= last: continue
    cuts.append((s + MAX_PAUSE / 2, e - MAX_PAUSE / 2))
cuts = [(max(first - LEAD, 0), None)] + cuts  # leading trim marker
pieces, t, xf, kept = [], 0.0, int(0.012 * sr), []
cursor = max(first - LEAD, 0)
for s, e in cuts[1:] + [(min(last + TAIL, len(x) / sr), None)]:
    seg = x[int(cursor * sr):int(s * sr)].copy()
    if len(seg) > 2 * xf: seg[:xf] *= np.linspace(0, 1, xf); seg[-xf:] *= np.linspace(1, 0, xf)
    pieces.append(seg); kept.append([round(cursor, 3), round(s, 3), round(t, 3)]); t += len(seg) / sr
    if e is None: break
    cursor = e
out = np.concatenate(pieces)
write(sys.argv[2], sr, out)
json.dump(kept, open(sys.argv[3], 'w'))
print(f'tightened {len(x)/sr:.1f}s -> {len(out)/sr:.1f}s; shortened {len(cuts)-1} pauses: ' + ', '.join(f'{s:.1f}s(-{e-s:.1f})' for s, e in cuts[1:]))
