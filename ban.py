#########################################################

import heroku3

from os import environ

from sys import argv, exit

from utils.misc import ANSI_BRIGHTYELLOW, ANSI_BRIGHTGREEN, ANSI_BRIGHTRED,  ANSI_ENDC

#########################################################

def showbans(bans):
    colbans = [ANSI_BRIGHTYELLOW + ban + ANSI_ENDC for ban in bans]
    print("banned:", " , ".join(colbans))

conn = heroku3.from_key(environ["FBSERV2_TOKEN"])

app = conn.apps()["fbserv2"]

config = app.config()

bans = config["BANLIST"].split(",")

showbans(bans)

if len(argv) > 1:
    player = argv[1]

    unban = False
    if player[0] == "-":
        player = player[1:]
        unban = True

    if unban:
        if player in bans:
            bans = [p for p in bans if not ( p == player )]            
            config["BANLIST"] = ",".join(bans)
            print(ANSI_BRIGHTGREEN + "player removed from banlist" + ANSI_ENDC)
        else:
            print(ANSI_BRIGHTRED + "player is already not banned" + ANSI_ENDC)    
    else:
        if player in bans:
            print(ANSI_BRIGHTRED + "player is already banned" + ANSI_ENDC)    
        else:
            bans.append(player)
            config["BANLIST"] = ",".join(bans)
            print(ANSI_BRIGHTGREEN + "player added to banlist" + ANSI_ENDC)

    showbans(bans)