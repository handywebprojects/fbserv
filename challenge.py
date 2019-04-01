#########################################################

from utils.misc import geturljson, posturl
from time import sleep
from threading import Thread
from random import shuffle
from json import loads
from os import environ

#########################################################

ATOMIC_CHALLENGE_TOKEN = "EwVsmnLAnkHTMYaD"

#########################################################

def atomicchallengethread():
    if environ.get("NOCHALLENGE", False):
        print("no challenge")
        return
    while True:
        #print("getting atomic leaderboard")
        leaderboard = geturljson("https://lichess.org/player/top/200/atomic", headers = {"Accept":"application/vnd.lichess.v3+json"})
        lplayers = leaderboard["users"]
        shuffle(lplayers)
        for player in lplayers:
            id = player["id"]
            username = player["username"]
            playerstatus = geturljson("https://lichess.org/api/users/status?ids={}".format(username))[0]
            if playerstatus.get("online", False) and ( not playerstatus.get("playing", False) ):
                abotstatus = geturljson("https://lichess.org/api/users/status?ids=atomicchessbot")[0]
                if ( abotstatus.get("online", False) and ( not abotstatus.get("playing", False) ) ):                    
                    ok = 2
                    while ok > 0:
                        #print("challenging {}".format(username))
                        chgstr = posturl("https://lichess.org/api/challenge/{}".format(username),
                            headers = {
                                "Authorization": "Bearer {}".format(ATOMIC_CHALLENGE_TOKEN)
                            },
                            fields = {
                                "rated": "true",
                                "variant": "atomic",
                                "clock.limit": "180",
                                "clock.increment": "2",
                                "color": "black"
                            }
                        )                         
                        try:
                            chg = loads(chgstr)                    
                            destUser = chg["challenge"]["destUser"]
                            if destUser:
                                print("challenged {}".format(destUser))
                                sleep(10)
                                ok -= 1
                            else:
                                #print("challenge declined by {}".format(username))
                                sleep(1)
                                ok = 0
                        except:
                            #print("there was a problem with challenging {}".format(username))
                            sleep(1)
                            ok = 0
        sleep(180)

Thread(target = atomicchallengethread).start()
#atomicchallengethread()