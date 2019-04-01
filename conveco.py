import re

from utils.misc import read_string_from_file, write_json_to_file

ecotxt = read_string_from_file("eco.txt", "")

pattern = re.compile("([^\s]+)\s+\"(.*?)\"(.*)")

i = 0

lines = []

for line in ecotxt.split("\n"):
    match = pattern.match(line)
    if match:
        code = match.group(1)
        name = match.group(2)
        line = match.group(3)
        if "1." in line:
            for moveno in range(20):
                line = line.replace("{}.".format(moveno), "")
            line = line.replace("\r", "")
            line = line.replace("*", "")
            parts = line.split(" ")
            moves = []
            for part in parts:
                if not ( part == "" ):
                    moves.append(part)
            lines.append([code, name, " ".join(moves)])

write_json_to_file("eco.json", lines)