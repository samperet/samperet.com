import json, re, sys
expected = ("story of the bear shark I was working at Airbnb and I had gained a reputation for myself as the guy "
            "you call when you need something done and lo and behold my friend Brendan had been authorized by the "
            "company to build a life-size 12-foot bear shark bear in the front shark in the back to be hung above the "
            "staircase and when he ordered the two giant foam blocks to assemble the sculpture they arrived as giant "
            "blocks in his apartment lobby too large to get into the room and so he called me up and my solution was "
            "to borrow one of his guitar strings and hook it up into my car battery and make a makeshift hot wire to "
            "slice through the foam and get it into the studio")
heard = ' '.join(s['text'] for s in json.load(open(sys.argv[1])))
n = lambda t: re.sub(r'[^a-z0-9 ]', '', t.lower().replace('-', ' ')).split()
e, h = n(expected), n(heard)
print('words expected', len(e), 'heard', len(h), '| match:', e == h)
if e != h:
    import difflib
    print('\n'.join(d for d in difflib.unified_diff(e, h, lineterm='', n=1) if d.startswith(('+', '-'))))
    sys.exit(1)
