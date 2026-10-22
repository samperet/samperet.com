"""Add a soft entrance and exit to the normalized voice, and remap the subtitle file through
the cut map (original seconds -> cut seconds) plus the intro pre-roll."""
import wave, json, sys, re, numpy as np

voice_path, map_path, vtt_in, out_wav, vtt_out = sys.argv[1:6]

def read(path):
    with wave.open(path) as w:
        return w.getframerate(), np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
def write(path, sr, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())

sr, voice = read(voice_path)
t = lambda n: np.arange(n) / sr

def chime(notes, spacing, decay, level):
    """Soft bell-like notes: a sine with a quiet octave above it, each fading exponentially."""
    length = int((spacing * len(notes) + decay * 3) * sr)
    out = np.zeros(length)
    for i, f in enumerate(notes):
        start = int(i * spacing * sr)
        n = length - start
        tt = t(n)
        tone = (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 2 * f * tt + 0.3)) * np.exp(-tt / decay)
        tone *= np.minimum(tt / 0.006, 1)  # 6 ms attack, no click
        out[start:] += tone
    return out / np.max(np.abs(out)) * level

def swell(duration, level, rising=True):
    """A hushed breath of filtered noise that rises (entrance) or falls away (exit)."""
    n = int(duration * sr)
    rng = np.random.default_rng(7)
    noise = rng.standard_normal(n)
    spec = np.fft.rfft(noise)
    f = np.fft.rfftfreq(n, 1 / sr)
    spec *= np.exp(-((np.log(f + 1) - np.log(1800)) ** 2) / (2 * 0.7 ** 2))  # band around ~1.8 kHz
    noise = np.fft.irfft(spec, n)
    env = np.linspace(0, 1, n) ** 2 if rising else np.linspace(1, 0, n) ** 2
    return noise / np.max(np.abs(noise)) * env * level

PRE = 1.1    # seconds of intro before the first word
POST = 0.35  # gap after the last word before the exit begins

intro = chime([1046.5, 1318.5, 1568.0], spacing=0.11, decay=0.55, level=10 ** (-20 / 20))
intro = np.pad(intro, (0, max(0, int(PRE * sr) - len(intro))))
whoosh = swell(PRE, 10 ** (-30 / 20), rising=True)
outro = chime([1568.0, 1318.5, 1046.5], spacing=0.16, decay=0.9, level=10 ** (-23 / 20))
tail = swell(1.2, 10 ** (-34 / 20), rising=False)

head = np.zeros(int(PRE * sr))
head[: len(intro)] += intro[: len(head)]
head[: len(whoosh)] += whoosh[: len(head)]
# The chime's ring overlaps the first words slightly, which glues entrance and voice together.
ring = intro[len(head):] if len(intro) > len(head) else np.zeros(0)

total = len(head) + len(voice) + int(POST * sr) + len(outro) + int(0.4 * sr)
mix = np.zeros(total)
mix[: len(head)] += head
mix[len(head): len(head) + len(voice)] += voice
mix[len(head): len(head) + len(ring)] += ring[: max(0, total - len(head))]
o = len(head) + len(voice) + int(POST * sr)
mix[o: o + len(outro)] += outro
mix[o: o + len(tail)] += tail
# Gentle final fade so the ring ends in silence.
fade = int(0.3 * sr)
mix[-fade:] *= np.linspace(1, 0, fade)
write(out_wav, sr, mix)

# ---- subtitles: original time -> cut time -> + pre-roll -------------------------------
keep = json.load(open(map_path))['keep']
def remap(sec):
    for s, e, start in keep:
        if sec < s: return start                # fell in a removed gap: snap to next piece
        if sec <= e: return start + (sec - s)
    s, e, start = keep[-1]
    return start + (e - s)
def parse(stamp): return sum(float(p) * 60 ** i for i, p in enumerate(reversed(stamp.strip().split(':'))))
def fmt(sec):
    m, s = divmod(max(sec, 0), 60)
    return f'{int(m):02d}:{s:06.3f}'
text = open(vtt_in).read()
def fix(m):
    a, b = (remap(parse(m.group(1))) + PRE, remap(parse(m.group(2))) + PRE)
    if b - a < 0.6: b = a + 0.6
    return f'{fmt(a)} --> {fmt(b)}'
new = re.sub(r'(\d+:\d+\.\d+) --> (\d+:\d+\.\d+)', fix, text)
# cues must not overlap after remapping
lines = new.split('\n')
last_end = 0.0
for i, line in enumerate(lines):
    m = re.match(r'(\d+:\d+\.\d+) --> (\d+:\d+\.\d+)', line)
    if m:
        a, b = parse(m.group(1)), parse(m.group(2))
        if a < last_end: a = last_end + 0.05
        if b <= a: b = a + 0.6
        lines[i] = f'{fmt(a)} --> {fmt(b)}'
        last_end = b
open(vtt_out, 'w').write('\n'.join(lines))
print(f'final {total / sr:.1f}s (voice {len(voice) / sr:.1f}s, pre-roll {PRE}s)')
