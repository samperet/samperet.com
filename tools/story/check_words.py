"""Is every word of the story still in the final audio? check_words.py final_transcript.json cues.txt
prints the words heard differently from the cues; a cut word shows as a missing one."""
import difflib, json, re, sys
expected = ' '.join(l.strip() for l in open(sys.argv[2]) if l.strip())
heard = ' '.join(s['text'] for s in json.load(open(sys.argv[1])))
n = lambda t: re.sub(r'[^a-z0-9 ]', '', t.lower().replace('-', ' ')).split()
e, h = n(expected), n(heard)
print('words expected', len(e), 'heard', len(h), '| match:', e == h)
if e != h:
    print('\n'.join(d for d in difflib.unified_diff(e, h, lineterm='', n=1) if d.startswith(('+', '-')) and not d.startswith(('+++', '---'))))
    sys.exit(1)
