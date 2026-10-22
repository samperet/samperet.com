"""Time the book's own lines against the narration's word timestamps. Writes the narration
JSON the reader uses: subtitle cues, and when each page's verse starts and ends."""
import json, re, sys

# (page, lines). Page is the text page of the spread; the art page is page + 1.
INTRO = [
    (1, ["Foreside Fiasco"]),
    (3, ["Written, read, and lived by Sam Peret."]),
    (5, ["Dedicated to Steve, Lurana and the Foreside Manor."]),
]
VERSES = [
    (6, ["It started one morning so peaceful and bright,", "At Steve and Lurana’s, the mood was just right.",
         "A cozy old house with sunlight to spare,", "Warm coffee aromas danced through the air."]),
    (8, ["And when the work was finished, the day nearly done,", "The Burgies were poured, perhaps more than one.",
         "The perfect way to end the day,", "Everything was feeling A.O.K."]),
    (10, ["Then Lurana remembered, “Oh wait, in the nook!”", "A box had been waiting, she gave it a look.",
          "“Warm seat! Air dryer! A luxury spray!", "We’ve truly gone fancy with this bidet!”"]),
    (12, ["“The plumbers are coming,” Lurana did say,", "But Sam waved his hand, “We’ll do it today!”",
          "Steve yawned and smiled, “I’m off to bed,”", "While Sam rolled his sleeves and scratched his head."]),
    (14, ["Out came the wrench, the shiny new seat.", "“This bidet will make your bathroom elite!”",
          "He twisted, he turned, and gave it a shove,", "A confident handyman, sort of, thereof."]),
    (16, ["Then all of a sudden arose such a clatter,", "With Lurana screaming, “What is the matter?!”",
          "Sam held the pipe, water shooting up high.", "The valve was broken! Oh me, oh my!"]),
    (18, ["Steve rushed downstairs, hair all askew,", "As drips from the chandelier shimmered like dew.",
          "Towels were flying, the floor got all wet,", "A scene they would sure never forget!"]),
    (20, ["The next morning the plumbers arrived, their tools in a queue,", "Now the bidet sparkles, clean and new.",
          "Steve, Lurana, and Sam all say,", "“Next time, we’ll wait for the pros — okay?”"]),
]
# What the transcriber tends to hear for names, so the letter match still lands.
ALIASES = {'lurana': ['laronna', 'lorana', 'luranna'], 'peret': ['perrette', 'perret', 'peret'], 'foreside': ['foresight', 'forside'],
           'burgies': ['berges', 'burgees', 'burgies', 'bergeys'], 'aok': ['aokay']}

words = [w for s in json.load(open(sys.argv[1])) for w in s['words']]
norm = lambda t: re.sub(r'[^a-z0-9]', '', t.lower().replace('’', '').replace("'", ''))
letters, owner = '', []
for i, w in enumerate(words):
    n = norm(w['w'])
    for canon, heard in ALIASES.items():
        if n in heard: n = canon
    letters += n; owner += [i] * len(n)

pos = 0
def locate(text):
    """Find the line's letters from the current position, tolerating a missed word or two."""
    global pos
    toks = [norm(t) for t in text.split() if norm(t)]
    # try the whole line, then shorter runs of leading words, anchored at the first found word
    for n in range(len(toks), 0, -1):
        key = ''.join(toks[:n])
        at = letters.find(key, pos)
        if at >= 0 and at - pos < 400:
            first = owner[at]
            # extend to the last token if it is findable soon after
            tail = letters.find(toks[-1], at + len(key)) if n < len(toks) else at + len(key) - 1
            last = owner[tail if tail >= 0 and tail - at < 200 else at + len(key) - 1]
            pos = (tail if tail >= 0 and tail - at < 200 else at + len(key) - 1) + 1
            return words[first]['s'], words[last]['e']
    raise SystemExit(f'could not place: {text}')

cues, verses, intro = [], [], []
for page, lines in INTRO:
    s, e = locate(lines[0])
    intro.append({'page': page, 'start': round(s, 2)})
    cues.append([s, e, lines[0]])
for page, lines in VERSES:
    starts = []
    for line in lines:
        s, e = locate(line)
        starts.append((s, e)); cues.append([s, e, line])
    # 'art' is when the second half of the verse begins: on a phone the reader turns to the
    # painting there, since it shows one page at a time.
    verses.append({'page': page, 'start': round(starts[0][0], 2), 'art': round(starts[2][0], 2), 'end': round(starts[-1][1], 2)})
# cue padding without overlap
for i, c in enumerate(cues):
    c[0] -= 0.15; c[1] += 0.3
    if i + 1 < len(cues): c[1] = min(c[1], cues[i + 1][0] - 0.15 - 0.05)
    c[1] = max(c[1], c[0] + 0.6)
fmt = lambda s: f'{int(s // 60):02d}:{max(s, 0) % 60:06.3f}'
open(sys.argv[2], 'w').write('WEBVTT\n\n' + '\n\n'.join(f'{fmt(s)} --> {fmt(e)}\n{t}' for s, e, t in cues) + '\n')
json.dump({'intro': intro, 'verses': verses}, open(sys.argv[3], 'w'), indent=1)
for v in intro: print('intro page', v)
for v in verses: print('verse page', v)
