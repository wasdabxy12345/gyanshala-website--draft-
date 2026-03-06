import re

with open(r'c:\Users\EDU-05\Documents\website stuff\gyanshala website (draft)\icons\vision_icon.html', 'r', encoding='utf-8') as f:
    text = f.read()

block_match = re.search(r'<g id=\"jigsaw-block\"[^>]*>(.*?)</g>', text, re.DOTALL)
if block_match:
    block = block_match.group(1)
    paths = re.findall(r'<path[^>]*d=\"(.*?)\"', block)
    for i, p in enumerate(paths):
        m = re.search(r'M([-]?\d+\.?\d*),([-]?\d+\.?\d*)', p)
        if m:
            x, y = float(m.group(1)), float(m.group(2))
            if abs(y - 81.762) < 1 and (abs(x - 243.232) < 1 or abs(x - 320.238) < 1):
                print(f'Piece {i}: X {x}, Y {y} | Full: {p}')
else:
    print("Block not found")
