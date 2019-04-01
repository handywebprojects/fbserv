#########################################################

from utils.misc import geturljson, write_json_to_file, geturl
from lichess.models import FULL_ATOMIC_TOURNEY_NAME
from time import sleep
from config import SERVER_URL
from threading import Thread
from os import environ

#########################################################

def tourneythread():
    if environ.get("NOTOURNEY", False):
        print("no tourney")
        return
    while True:
        #print("getting tourneys for create")
        tourneys = geturljson("https://lichess.org/api/tournament")
        #write_json_to_file("tourney.txt", tourneys)
        found = False
        for tourney in tourneys["created"] + tourneys["started"]:
            if tourney.get("fullName", "unknown tourney name") == FULL_ATOMIC_TOURNEY_NAME:
                #print("active atomic tourney found, starts in {:.0f} minutes, players {}".format(tourney.get("secondsToStart", 0) / 60, tourney.get("nbPlayers", 0)))
                found = True                    
        if found:
            pass
        else:
            print("atomic tourney not found, creating one")            
            print(geturl("{}/tourney".format(SERVER_URL())))
        sleep(60)

Thread(target = tourneythread).start()
#tourneythread()
