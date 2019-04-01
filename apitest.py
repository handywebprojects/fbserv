from utils.misc import geturljson, geturlndjson, write_json_to_file

print("writing profile")
write_json_to_file("lichessprofile.txt",geturljson("https://lichess.org/api/user/lishadowapps"))
print("writing game")
write_json_to_file("lichessgame.txt",geturlndjson("https://lichess.org/api/games/user/lishadowapps?max=1"))