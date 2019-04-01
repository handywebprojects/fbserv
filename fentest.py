from utils.misc import read_string_from_file
from json import dumps

fentest = read_string_from_file("fentest.txt", "")

def simplehash(fen, range):
    m = 1
    sum = 0
    for c in fen:
        sum += m * ord(c)
        m += 1
    return str(sum % range)

counts = {}

lines = fentest.split("\n")
print(len(lines))
for line in lines:
    parts = line.split(" ")
    fen = parts[0] + parts[1] + parts[2]
    h = simplehash(fen, 20)
    if h in counts:
        counts[h]+=1
    else:
        counts[h]=1

print(dumps(counts, indent=2))