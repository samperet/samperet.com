"""Build the WebVTT from a story's cue texts (one per line), timed by the words as heard in the
final audio: align.py final_transcript.json out.vtt cues.txt. The cues are matched to the heard
words word by word, so a word the recogniser got differently ("from" for "for") still lands."""
import difflib, json, re, sys
CUES = [l.strip() for l in open(sys.argv[3]) if l.strip()]
words = [w for s in json.load(open(sys.argv[1])) for w in s['words']]
norm = lambda t: re.sub(r'[^a-z0-9]', '', t.lower())
heard = [norm(w['w']) for w in words]
said, owner = [], []
for c, text in enumerate(CUES):
    for w in text.replace('-', ' ').split():
        if norm(w): said.append(norm(w)); owner.append(c)
# Each cue word's heard word, where the two line up (equal or replaced runs of the same length).
match = {}
for op, a0, a1, b0, b1 in difflib.SequenceMatcher(None, said, heard, autojunk=False).get_opcodes():
    if op == 'equal' or (op == 'replace' and a1 - a0 == b1 - b0):
        for k in range(a1 - a0): match[a0 + k] = b0 + k
    elif op == 'replace':
        match[a0] = b0; match[a1 - 1] = b1 - 1
cues = []
for c, text in enumerate(CUES):
    hits = [match[i] for i in range(len(said)) if owner[i] == c and i in match]
    assert hits, f'could not place: {text}'
    cues.append([words[min(hits)]['s'] - 0.15, words[max(hits)]['e'] + 0.25, text])
for a, b in zip(cues, cues[1:]):
    a[1] = min(a[1], b[0] - 0.05)      # never overlap the next cue
    a[1] = max(a[1], a[0] + 0.7)
fmt = lambda s: f'{int(s // 60):02d}:{max(s, 0) % 60:06.3f}'
out = 'WEBVTT\n\n' + '\n\n'.join(f'{fmt(s)} --> {fmt(e)}\n{t}' for s, e, t in cues) + '\n'
open(sys.argv[2], 'w').write(out)
for s, e, t in cues: print(f'{fmt(s)} --> {fmt(e)}  {t}')
