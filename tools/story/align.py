"""Build the WebVTT from the cue texts below, timed by the words as heard in the final audio."""
import json, re, sys
CUES = [
  "The story of the bear shark.",
  "I was working at Airbnb,",
  "and I had gained a reputation for myself",
  "as the guy you call when you need something done.",
  "And lo and behold,",
  "my friend Brendan had been authorized by the company",
  "to build a life-size, 12-foot bear shark.",
  "Bear in the front, shark in the back,",
  "to be hung above the staircase.",
  "And when he ordered the two giant foam blocks",
  "to assemble the sculpture,",
  "they arrived as giant blocks in his apartment lobby,",
  "too large to get into the room.",
  "And so he called me up,",
  "and my solution was to borrow one of his guitar strings",
  "and hook it up into my car battery",
  "and make a makeshift hot wire",
  "to slice through the foam",
  "and get it into the studio.",
]
words = [w for s in json.load(open(sys.argv[1])) for w in s['words']]
norm = lambda t: re.sub(r'[^a-z0-9]', '', t.lower())
letters, owner = '', []
for i, w in enumerate(words):
    n = norm(w['w']); letters += n; owner += [i] * len(n)
pos, cues = 0, []
for text in CUES:
    # match on the spoken words; a cue may carry a leading word the recording clipped
    parts = text.split()
    for drop in range(len(parts)):
        key = norm(' '.join(parts[drop:]))
        at = letters.find(key, pos)
        if at >= 0: break
    assert at >= 0, f'could not find: {text}'
    first, last = owner[at], owner[at + len(key) - 1]
    cues.append([words[first]['s'] - 0.15, words[last]['e'] + 0.25, text])
    pos = at + len(key)
for a, b in zip(cues, cues[1:]):
    a[1] = min(a[1], b[0] - 0.05)      # never overlap the next cue
    a[1] = max(a[1], a[0] + 0.7)
fmt = lambda s: f'{int(s // 60):02d}:{max(s, 0) % 60:06.3f}'
out = 'WEBVTT\n\n' + '\n\n'.join(f'{fmt(s)} --> {fmt(e)}\n{t}' for s, e, t in cues) + '\n'
open(sys.argv[2], 'w').write(out)
for s, e, t in cues: print(f'{fmt(s)} --> {fmt(e)}  {t}')
