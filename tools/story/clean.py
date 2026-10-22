"""Denoise (spectral subtraction with a noise profile from the long pause), then cut the
pauses down, writing the cleaned voice and a time map from original to new seconds."""
import wave, json, sys, numpy as np

def read(path):
    with wave.open(path) as w:
        return w.getframerate(), np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
def write(path, sr, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())

sr, x = read(sys.argv[1])
N, H = 2048, 512
win = np.hanning(N + 1)[:-1].astype(np.float32)

def stft(sig):
    pad = np.concatenate([np.zeros(N // 2), sig, np.zeros(N)])
    frames = np.lib.stride_tricks.sliding_window_view(pad, N)[::H] * win
    return np.fft.rfft(frames, axis=1)
def istft(X, length):
    frames = np.fft.irfft(X, n=N, axis=1) * win
    out = np.zeros(frames.shape[0] * H + N); norm = np.zeros_like(out)
    for i, f in enumerate(frames):
        out[i*H:i*H+N] += f; norm[i*H:i*H+N] += win ** 2
    out /= np.maximum(norm, 1e-3)
    return out[N // 2:N // 2 + length]

X = stft(x)
P = np.abs(X) ** 2
freqs = np.fft.rfftfreq(N, 1 / sr)
f0, f1 = int(59.5 * sr / H), int(67.5 * sr / H)          # the long pause: pure noise
noise = np.percentile(P[f0:f1], 90, axis=0)               # noise PSD per bin, generous
alpha = np.where(freqs < 700, 3.0, 2.0)                   # subtract harder where the rumble is
floor = 10 ** (-30 / 20)
snr = P / (alpha * noise + 1e-12)
gain = np.maximum(1 - 1 / np.maximum(snr, 1e-6), floor ** 2)
k = np.array([0.25, 0.5, 0.25])
gain = np.apply_along_axis(lambda g: np.convolve(g, k, 'same'), 1, gain)
gain = 0.7 * gain + 0.3 * np.vstack([gain[:1], gain[:-1]])  # light temporal smoothing
gain = np.sqrt(np.clip(gain, floor ** 2, 1))
gain *= np.clip((freqs - 110) / 80, 0, 1)                 # high-pass: nothing below ~110 Hz
Y = X * gain

# Speech detection on the voice band only, so the leftover rumble cannot vote.
band = (freqs >= 250) & (freqs <= 3500)
bdb = 10 * np.log10(np.sum(np.abs(Y[:, band]) ** 2, axis=1) + 1e-12)
thr = np.percentile(bdb, 15) + 10
speech_f = bdb > thr
pad = int(0.15 * sr / H)
sp = np.zeros_like(speech_f)
for i in np.where(speech_f)[0]: sp[max(0, i - pad):i + pad + 1] = True
# Pauses get a further 10 dB dip, ramped over ~60 ms, so they sound like room, not hiss.
dip = np.where(sp, 1.0, 10 ** (-10 / 20))
for _ in range(3): dip = np.convolve(dip, np.ones(3) / 3, 'same')
y = istft(Y * dip[:, None], len(x)).astype(np.float32)
print(f'voice-band contrast: pause {np.percentile(bdb,15):.1f} dB, speech {np.percentile(bdb,90):.1f} dB, threshold {thr:.1f}')

# ---- pauses ---------------------------------------------------------------------------
step = H / sr
# Speech regions come from the transcript's word timings (reliable here), padded a little;
# the detector only extends an edge when it hears speech continuing past a word.
words = [w for seg in json.load(open(sys.argv[4])) for w in seg['words']]
regions = []
for w in words:
    s, e = w['s'] - 0.2, w['e'] + 0.3
    if regions and s <= regions[-1][1] + 0.3: regions[-1][1] = max(regions[-1][1], e)
    else: regions.append([max(s, 0), e])
def frame(t): return int(t / step)
for r in regions:
    i = frame(r[0]) - 1
    while i > 0 and speech_f[i] and r[0] - i * step < 0.5: i -= 1
    r[0] = max(i * step, 0)
    j = frame(r[1]) + 1
    while j < len(speech_f) - 1 and speech_f[j] and j * step - r[1] < 0.5: j += 1
    r[1] = min(j * step, len(y) / sr)
regions = [r for r in regions if r[1] - r[0] > 0.25]
LEAD, TAIL, GAP_MAX = 0.2, 0.5, 0.5
keep = []
cur = max(regions[0][0] - LEAD, 0)
for (s, e), nxt in zip(regions, regions[1:] + [None]):
    if nxt is None:
        keep.append([cur, min(e + TAIL, len(y) / sr)]); break
    gap = nxt[0] - e
    if gap > GAP_MAX:
        keep.append([cur, e + GAP_MAX / 2]); cur = nxt[0] - GAP_MAX / 2
pieces, amap, t = [], [], 0.0
xf = int(0.012 * sr)
for s, e in keep:
    seg = y[int(s * sr):int(e * sr)].copy()
    seg[:xf] *= np.linspace(0, 1, xf); seg[-xf:] *= np.linspace(1, 0, xf)
    amap.append([round(s, 3), round(e, 3), round(t, 3)])
    pieces.append(seg); t += len(seg) / sr
out = np.concatenate(pieces)
write(sys.argv[2], sr, out)
json.dump({'keep': amap, 'duration': round(len(out) / sr, 3)}, open(sys.argv[3], 'w'))
print(f'original {len(y)/sr:.1f}s -> {len(out)/sr:.1f}s, {len(keep)} pieces')
for s, e, t in amap: print(f'  keep {s:6.2f}-{e:6.2f} -> {t:6.2f}')
