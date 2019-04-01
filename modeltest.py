from utils.misc import read_json_from_file
from lichess.models import Profile, Game

p = Profile(read_json_from_file("lichessprofile.txt", {}))

g = Game(read_json_from_file("lichessgame.txt", [{}])[0])

print(g)
print(g.summary())

