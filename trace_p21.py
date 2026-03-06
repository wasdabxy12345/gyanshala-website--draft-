import re

# Original Piece 21 path from Step 156 (before user edit and my edit)
path_d = 'M313.799,455.449  c-6.141,4.516-12.504-2.271-12.034-8.615c1.037-13.983,15.654,0.812,20.426-5.705c2.814-3.843,1.188-8.674,0.092-12.807  c-0.737-2.782-0.954-5.402-0.807-8.11c-8.926,1.85-17.86,4.027-26.917,2.319c-2.286-0.432-6.475-0.633-6.508-3.483  c-0.029-2.523,1.81-3.042,2.985-5.092c2.837-4.949-2.801-5.836-6.611-6.551c-4.371-0.82-9.008-0.724-13.216,0.819  c-3.273,2.451-3.164,3.25-0.925,6.809c1.798,2.857,2.846,5.507-1.191,6.017c-2.611,0.329-5.229,0.602-7.851,0.822  c-5.253,0.441-10.522,0.673-15.793,0.733c-1.932,0.022-3.863,0.014-5.794-0.008c-1.237,3.709-2.218,7.488-1.976,11.381  c0.255,4.099,1.598,6.435,4.633,8.706c3.823,0.959,7.157-1.605,10.724-2.418c8.262-1.883,9.117,11.247,4.703,15.472  c-5.577,5.335-11.824-5.771-17.445,0.555c-1.202,3.521-2.992,16.973-0.494,24.207h82.448  C323.586,470.102,322.192,449.278,313.799,455.449z'

def parse_path(data):
    pattern = re.compile(r'([a-zA-Z])|([-]?\d+\.?\d*)')
    tokens = []
    for m in pattern.finditer(data):
        tokens.append(m.group())
    steps = []
    i = 0
    cx, cy = 0.0, 0.0
    while i < len(tokens):
        t = tokens[i]
        if t.isalpha():
            cmd = t
            i += 1
        num_args = {'M':2, 'm':2, 'L':2, 'l':2, 'H':1, 'h':1, 'V':1, 'v':1, 'C':6, 'c':6, 'z':0, 'Z':0}[cmd.upper()]
        args = [float(tokens[i+j]) for j in range(num_args)]
        i += num_args
        if cmd == 'M': cx, cy = args[0], args[1]
        elif cmd == 'm': cx += args[0]; cy += args[1]
        elif cmd == 'c': cx += args[4]; cy += args[5]
        elif cmd == 'C': cx, cy = args[4], args[5]
        elif cmd == 'h': cx += args[0]
        steps.append({'cmd': cmd, 'args': args, 'pos': (cx, cy)})
    return steps

steps = parse_path(path_d)
for i, s in enumerate(steps):
    print(f'{i}: {s["cmd"]} end={s["pos"]}')
