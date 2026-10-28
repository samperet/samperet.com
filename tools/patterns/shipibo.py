# A Shipibo (kené)-style tile: a bold stepped cross at the centre with two finer crosses inside
# it, arms running out to meet the neighbouring tiles, diagonals with fine parallel lines out
# to small crosses at the corners, and little crosses filling the open diamonds.
import math, sys
T = 160; C = 80
CH = [(-1,-5),(1,-5),(1,-3),(3,-3),(3,-1),(5,-1),(5,1),(3,1),(3,3),(1,3),(1,5),(-1,5),(-1,3),(-3,3),(-3,1),(-5,1),(-5,-1),(-3,-1),(-3,-3),(-1,-3)]
def chakana(cx, cy, u):
    return 'M' + ' L'.join(f'{cx+x*u:.1f} {cy+y*u:.1f}' for x, y in CH) + ' Z'
bold, fine = [], []
bold.append(chakana(C, C, 10))
fine.append(chakana(C, C, 6.5))
fine.append(chakana(C, C, 3.5))
bold.append(f'M{C-3} {C} L{C+3} {C} M{C} {C-3} L{C} {C+3}')
# arms out to the edges, doubled by fine lines either side
for (x0, y0, x1, y1) in [(C, 30, C, 0), (C, 130, C, T), (30, C, 0, C), (130, C, T, C)]:
    bold.append(f'M{x0} {y0} L{x1} {y1}')
    if x0 == x1:
        fine.append(f'M{x0-6} {y0} L{x1-6} {y1} M{x0+6} {y0} L{x1+6} {y1}')
    else:
        fine.append(f'M{x0} {y0-6} L{x1} {y1-6} M{x0} {y0+6} L{x1} {y1+6}')
# corner crosses (each drawn whole at every corner; the tile clips them)
for cx in (0, T):
    for cy in (0, T):
        bold.append(chakana(cx, cy, 5))
        fine.append(chakana(cx, cy, 2.5))
# diagonals from the big cross's outer steps to the corner crosses' steps, with fine parallels
for sx in (-1, 1):
    for sy in (-1, 1):
        a = (C + sx * 30, C + sy * 30)
        b = (C + sx * (80 - 15), C + sy * (80 - 15))
        bold.append(f'M{a[0]} {a[1]} L{b[0]} {b[1]}')
        d = 6 / math.sqrt(2)
        for k in (-1, 1):
            ox, oy = k * d * sy, -k * d * sx
            fine.append(f'M{a[0]+ox:.1f} {a[1]+oy:.1f} L{b[0]+ox:.1f} {b[1]+oy:.1f}')
# small crosses in the open diamonds between arms and diagonals
for (x, y) in [(40, 18), (120, 18), (40, 142), (120, 142), (18, 40), (142, 40), (18, 120), (142, 120)]:
    fine.append(f'M{x-4} {y} L{x+4} {y} M{x} {y-4} L{x} {y+4}')
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{T}" height="{T}" viewBox="0 0 {T} {T}">
<g fill="none" stroke="#2b211c" stroke-linecap="square" stroke-linejoin="miter">
<path stroke-width="3.2" d="{' '.join(bold)}"/>
<path stroke-width="1.2" d="{' '.join(fine)}"/>
</g>
</svg>
'''
open(sys.argv[1] if len(sys.argv) > 1 else 'public/patterns/shipibo.svg', 'w').write(svg)
print(len(svg), 'bytes')
