###################################################

from os import environ

import certifi
import urllib3

from http.client import responses

from getpass import getpass

import random, string

import time

###################################################

http = urllib3.PoolManager(
    cert_reqs = 'CERT_REQUIRED',
    ca_certs = certifi.where()
)

###################################################

LICHESS_URL = "https://lichess.org"
API_URL = "https://lichess.org/api"
MAX_TOURNEY_LENGTH_MINS = 360

###################################################

def getalltourneysurl():
    return "{}/tournament".format(API_URL)

def gettourneyurl(tid):
    return "{}/tournament/{}".format(API_URL, tid)

def gettourneygamesurl(tid):
    return "{}/tournament/{}/games".format(API_URL, tid)

###################################################

def randsri():
    return ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(10))

def tourneychaturl(tid):    
    return "wss://socket.lichess.org/tournament/{}/socket/v4?sri={}".format(tid, randsri())

def tourneystandingsurl(tid, page, partial = "true"):
    return "{}/tournament/{}?page={}&partial={}&_={}".format(LICHESS_URL, tid, page, partial, time.time())

#########################################################

FEATURED_TOURNEY_NAME = environ.get("FEATUREDTOURNEY", "AtomicChessBot Blitz Tourney")

def fulltourneyname(tourneyname):
    return tourneyname + " Arena"

FULL_FEATURED_TOURNEY_NAME = fulltourneyname(FEATURED_TOURNEY_NAME)

FEATURED_TOURNEY_CREATOR = environ.get("FEATUREDTOURNEYCREATOR", "handywebprojects")

CHAT_USER = environ.get("CHATUSER", "UltraBulletBot")
CHAT_PASS = environ.get("CHATPASS", None)

###################################################

def login(username = None, password = None):
    if not username:
        username = input("Username: ")
    if not password:
        password = getpass()

    res = http.request("POST", "https://lichess.org/login?referrer=%2F", headers = {
        "Referer": "https://lichess.org/login?referrer=%2F"
    }, fields = {
        "username": username,
        "password": password
    })

    print("login status", responses[res.status])

    if res.status == 200:
        sch = res.info().get("Set-Cookie")

        lila2 = sch.split(";")[0][6:]

        print("for {} obtained: {}".format(username, lila2))
        return lila2
    else:
        print("could not log in with {}".format(username))
        return None

###################################################

def chatuserlila2():
    return login(CHAT_USER, CHAT_PASS)