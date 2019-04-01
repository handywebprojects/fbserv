###################################################

from obscureridge import lichess
from obscureridge.urllibutils import geturljson
from obscureridge.chatbot import Chatbot
from obscureridge.unicodeutils import translate

from os import environ
import time
import random

import login

from traceback import print_exc as pe

import threading

import sys

from utils.misc import ANSI_BRIGHTYELLOW, ANSI_BRIGHTGREEN, ANSI_BRIGHTMAGENTA, ANSI_BRIGHTRED, ANSI_ENDC

###################################################

def getallfeaturedtourneys(kinds = ["created", "started"]):
    alltourneys = geturljson(lichess.getalltourneysurl())    
    allfeaturedtourneys = []
    for kind in kinds:
        tourneys = alltourneys[kind]
        for tourney in tourneys:
            createdby = tourney["createdBy"]
            name = tourney["fullName"]
            if ( createdby == lichess.FEATURED_TOURNEY_CREATOR ) and ( name == lichess.FULL_FEATURED_TOURNEY_NAME ):
                allfeaturedtourneys.append(tourney)
    return allfeaturedtourneys

###################################################

MY_USERS = [
    "atomicexpert"
]

###################################################

class Ratelimiter:
    def __init__(self, limits, size = 1000):
        self.limits = limits
        self.history = []
        self.size = size
    
    def logfailed(self):
        now = time.time()
        self.history.append(now)
        while len(self.history) > self.size:
            self.history = self.history[1:]
        for limit in self.limits:
            duration = limit[0]
            credits = limit[1]
            cnt = 0
            for item in self.history:                
                if ( now - item ) < duration:
                    cnt += 1
            if cnt > credits:
                return True
        return False

class MyChatbot(Chatbot):
    def __init__(self, lila2, tid):
        super().__init__(lila2, tid)
        self.halfhourmod = -1
        self.hisaid = {}
        self.ggsaid = {}
        self.lolsaid = {}
        self.cheatersaid = {}        
        self.glsaid = {}
        self.thxsaid = {}
        self.ohsaid = {}
        self.behavesaid = {}
        self.drawsaid = {}
        self.lagsaid = {}
        self.matchsaid = {}
        self.damnsaid = {}
        self.luckysaid = {}
        self.noobsaid = {}
        self.byesaid = {}
        self.lastbannedmsg = 0
        self.emotcodes = {
            ":)" :          b"\U0001F602",
            ":(" :          b"\U0001F626",
            "#devil" :      b"\U0001F608",
            "#sunglass" :   b"\U0001F60E",
            "#thumbsup":    b"\U0001F44D",
            "#rocket":      b"\U0001F680",
            "#jacko":       b"\U0001F383",
            "#oh":          b"\U0001F47E",
            "#firework":    b"\U0001F386",
            "#astonished":  b"\U0001F632",
            "#checkmark":   b"\U00002714",
            "#warning":     b"\U000026A0",
            "#noentry":     b"\U000026D4",
            "#greenhart":   b"\U0001F49A",
            "#halfmoon":    b"\U0001F313",
            "#turtle":      b"\U0001F422",
            "#clover":      b"\U0001F340",
            "#pill":        b"\U0001F48A",
            "#greenbook":   b"\U0001F4D7",
            "#bluebook":    b"\U0001F4D8",
            "#orangebook":  b"\U0001F4D9",
            "#noob":        b"\U0001F530",
            "#waving":      b"\U0001F44B",
            "#smileheart":  b"\U0001F60D"
        }
        self.replyratelimiter = Ratelimiter([
            [10, 1],
            [60, 2],
            [300, 4],
            [1800, 8],
            [3600, 10]
        ])
        self.banliststr = environ.get("BANLIST", "letzplaykrazy,ijh,gingerpatzer,davidier")
        self.banlist = self.banliststr.split(",")

    def convertemots(self, msg):        
        try:
            for emot, emotcode in self.emotcodes.items():
                msg = msg.replace(emot, emotcode.decode('unicode-escape'))
        except:
            pe()
            print("could not convert emot codes")
        return msg

    def say(self, msg, delay = 0, force = False):                
        now = time.time()
        if ( ( now - self.lastbannedmsg ) < 900 ) and ( not force ):
            print("{}banned timeout, refused to say{}".format(ANSI_BRIGHTRED, ANSI_ENDC), msg)
            return
        msg = self.convertemots(msg)
        threading.Thread(target = self.say_thread_target, args = (msg, delay)).start()

    def reply(self, msg, delay = 0):
        if self.replyratelimiter.logfailed():
            print("{}rate limit exceeded{}".format(ANSI_BRIGHTRED, ANSI_ENDC))
            return
        self.say(msg, delay)

    def cron_thread_target(self):
        ads = [
            [
                "#bluebook #bluebook #bluebook join team Atomic Chess Theoreticians #bluebook #bluebook #bluebook",
                "https://lichess.org/team/atomic-chess-theoreticians"
            ],
            [
                "#orangebook #orangebook #orangebook keep track of atomic tourneys #orangebook #orangebook #orangebook",
                "https://fbserv.herokuapp.com/atomictourneys"
            ]            
        ]

        maxad = ( int( environ.get("MAXADS", len(ads)) ) )
        if maxad == 0:
            print("no ads")
            return
        print("max ad", maxad)
        ads = ads[:maxad]
        
        HALF_HOUR = 7200
        TICK = 10
        RANGE = 3
        print("cron started for {}".format(self.tid))
        while self.alive:
            try:
                now = int(time.time())
                halfhourmod = ( now % HALF_HOUR )
                self.halfhourmod = halfhourmod
                if halfhourmod < ( RANGE * TICK ):                
                    adindex = int( ( now - halfhourmod ) / HALF_HOUR ) % len(ads)
                    print("half hour event for {} , ad index {}".format(self.tid, adindex))
                    for ad in ads[adindex]:
                        self.say(ad)
                        time.sleep(2)
                    time.sleep(TICK * RANGE * 6)
            except:
                print("something went wrong with cron")
                pe()
            time.sleep(TICK)
        print("cron terminated for {}".format(self.tid))

    def on_open_callback(self):
        threading.Thread(target = self.cron_thread_target).start()

    def gamesreachedhandler(self, numgames):
        try:
            print("reporting games reached")
            sep = int(numgames / 50) * "#firework"
            self.say("{} wow, {} games played already in the tourney {}".format(sep, translate(numgames, "bold-sans"), sep))
        except:
            pe()
            print("could not report games reached")

    def couldnotreplyto(self, msg):
        print("{}could not reply to {}{}".format(ANSI_BRIGHTRED, ANSI_ENDC, msg))
        pe()

    def disturbance(self):
        #self.say("disturbance in the force")
        self.lastbannedmsg = time.time()

    def crowdhandler(self, nb, users, anons):
        for user in users:
            userlower = user.lower()
            if userlower in self.banlist:
                self.disturbance()
                return

    def talkhandler(self, user, msg):
        global MY_USERS        
        print("{}{}{} : {}{}{}".format(ANSI_BRIGHTYELLOW, user, ANSI_ENDC, ANSI_BRIGHTGREEN, msg, ANSI_ENDC))        
        userlower = user.lower()
        if userlower == "lishadowapps":
            if "shut" in msg:
                self.say("#smileheart yes my author, I will shut up", 3, True)
            elif "there" in msg:
                self.say("#smileheart yes my author, I'm here", 3, True)
            elif "tourney" in msg:
                self.say("#smileheart yes my author, AtomicChessBot Blitz Tourney Arena is good tourney", 3, True)
            elif ( msg == "hi" ) or ( "hi" in msg ):    
                self.say("#smileheart hi my author", 3, True)
            return
        if userlower in self.banlist:
            print("{}user banned{}".format(ANSI_BRIGHTRED, ANSI_ENDC))
            self.disturbance()
            return
        msg = msg.lower()        
        userbold = translate(user, "bold-italic-sans")
        try:
            if ( ( msg == "hi" ) or ( "привет" in msg ) or ( "hi " in msg ) or ( "hello" in msg ) or ( "hola" in msg ) or ( msg == "hey" ) or ( "hey " in msg ) ) and ( not ( user in MY_USERS ) ):
                hisaid = self.hisaid.get(user, 0)
                now = time.time()
                if ( now - hisaid ) > ( 30 * 60 ):
                    self.hisaid[user] = now
                    if "hola" in msg:
                        self.reply("#jacko hola {}".format(userbold), 3)
                    elif "привет" in msg:
                        self.reply("#jacko привет {}".format(userbold), 3)
                    else:
                        self.reply(random.choice([
                            "#jacko hi {}".format(userbold),
                            "#jacko how is it going {}".format(userbold),
                            "#jacko what's up {}".format(userbold),
                            "#jacko how is everything {}".format(userbold),
                            "#jacko good to see you {}".format(userbold),
                            "#jacko hey {}".format(userbold)                        
                        ]), 3)
                return
        except:            
            self.couldnotreplyto("greeting")
        try:
            if ( ( "gg" in msg ) or ( "good game" in msg ) ) and ( not ( user in MY_USERS ) ):
                ggsaid = self.ggsaid.get(user, 0)
                now = time.time()
                if ( now - ggsaid ) > ( 30 * 60 ):
                    self.ggsaid[user] = now
                    self.reply("#sunglass gg {}".format(userbold), 3)
                return
        except:
            self.couldnotreplyto("gg")
        try:
            if ( ( msg == "lol" ) or ( "lol " in msg ) or ( " lol" in msg ) or ( "lmao" in msg ) or ( "rotfl" in msg ) ) and ( not ( user in MY_USERS ) ):
                lolsaid = self.lolsaid.get(user, 0)
                now = time.time()
                if ( now - lolsaid ) > ( 30 * 60 ):
                    self.lolsaid[user] = now
                    if "lmao" in msg:
                        self.reply(":) laughing my anxiety off {}".format(userbold), 3)
                    elif "rotfl" in msg:
                        self.reply(":) rolling on the floor laughing {}".format(userbold), 3)
                    else:
                        self.reply(":) lol {}".format(userbold), 3)
                return
        except:            
            self.couldnotreplyto("lol")
        try:
            if ( ( "cheater" in msg ) or ( "cheating" in msg ) or ( "cheats" in msg ) ) and ( not ( user in MY_USERS ) ):
                cheatersaid = self.cheatersaid.get(user, 0)
                now = time.time()
                if ( now - cheatersaid ) > ( 30 * 60 ):
                    self.cheatersaid[user] = now
                    self.reply(random.choice([
                        "#warning #oh cheaters should be reported {}".format(userbold),
                        "#warning #oh cheaters are a menace to atomic {}".format(userbold),
                        "#warning #oh cheating should stop {}".format(userbold),
                        "#warning #oh everyone should play honestly {}".format(userbold),
                        "#warning #oh cheating is bad sportsmanship {}".format(userbold)
                    ]), 3)
                    return
        except:
            self.couldnotreplyto("cheater")
        try:
            if ( "lucky" in msg ) and ( not ( user in MY_USERS ) ):
                luckysaid = self.luckysaid.get(user, 0)
                now = time.time()
                if ( now - luckysaid ) > ( 30 * 60 ):
                    self.luckysaid[user] = now
                    self.reply(random.choice([
                        "#clover lucky {}".format(userbold),
                        "#clover good players can have luck {}".format(userbold)
                    ]), 3)
                return
        except:
            self.couldnotreplyto("lucky")
        try:
            if ( ( msg == "gl" ) or ( "gl " in msg ) or ( "good luck" in msg ) ) and ( not ( user in MY_USERS ) ):
                glsaid = self.glsaid.get(user, 0)
                now = time.time()
                if ( now - glsaid ) > ( 30 * 60 ):
                    self.glsaid[user] = now
                    self.reply(random.choice([
                        "#thumbsup good luck {}".format(userbold),
                        "#thumbsup gl {}".format(userbold),
                        "#thumbsup have a good luck {}".format(userbold)
                    ]), 3)
                    return
        except:
            self.couldnotreplyto("gl")
        try:
            if ( ( "thank" in msg ) or ( "thx" in msg ) ) and ( not ( user in MY_USERS ) ):
                thxsaid = self.thxsaid.get(user, 0)
                now = time.time()
                if ( now - thxsaid ) > ( 30 * 60 ):
                    self.thxsaid[user] = now
                    self.reply("#thumbsup you are welcome {}".format(userbold), 3)
                return
        except:
            self.couldnotreplyto("thanks")
        try:
            if ( ( msg == "oh" ) or ( "oh " in msg ) ) and ( not ( user in MY_USERS ) ):
                ohsaid = self.ohsaid.get(user, 0)
                now = time.time()
                if ( now - ohsaid ) > ( 30 * 60 ):
                    self.ohsaid[user] = now
                    self.reply("#astonished oh {}".format(userbold), 3)
                return
        except:
            self.couldnotreplyto("oh")
        try:
            if ( ( "fuck" in msg ) or ( "suck" in msg ) or ( "shit" in msg ) or ( "prick" in msg ) or ( "mierda" in msg ) ) and ( not ( user in MY_USERS ) ):
                behavesaid = self.behavesaid.get(user, 0)
                now = time.time()
                if ( now - behavesaid ) > ( 30 * 60 ):
                    self.behavesaid[user] = now
                    if "mierda" in msg:
                        self.reply("#warning #noentry pórtate bien {}".format(userbold), 3)
                    else:
                        self.reply("#warning #noentry behave yourself {}".format(userbold), 3)
                return
        except:
            self.couldnotreplyto("swear words")
        try:
            if ( "draw" in msg ) and ( not ( user in MY_USERS ) ):
                drawsaid = self.drawsaid.get(user, 0)
                now = time.time()
                if ( now - drawsaid ) > ( 30 * 60 ):
                    self.drawsaid[user] = now
                    self.reply(random.choice([
                        "#halfmoon a draw is better than a loss {}".format(userbold),
                        "#halfmoon always draw if you can't win {}".format(userbold),
                        "#halfmoon draw is a bottle half full half empty {}".format(userbold)
                    ]), 3)
                return
        except:
            self.couldnotreplyto("draw")
        try:
            if ( ( msg == "lag" ) or ( "lag " in msg ) or ( " lag" in msg ) ) and ( not ( user in MY_USERS ) ):
                lagsaid = self.lagsaid.get(user, 0)
                now = time.time()
                if ( now - lagsaid ) > ( 30 * 60 ):
                    self.lagsaid[user] = now
                    self.reply(random.choice([
                        "#turtle lag is a bad thing {}".format(userbold),                        
                        "#turtle lag is spoiling the game {}".format(userbold),                        
                        "#turtle unlucky having a bad lag {}".format(userbold)
                    ]), 3)
                return
        except:
            self.couldnotreplyto("lag")
        try:
            if ( "match" in msg ) and ( not ( user in MY_USERS ) ):
                matchsaid = self.matchsaid.get(user, 0)
                now = time.time()
                if ( now - matchsaid ) > ( 30 * 60 ):
                    self.matchsaid[user] = now
                    self.reply(random.choice([
                        "#turtle matching is sometimes slow {}".format(userbold),
                        "#turtle with few players matching is slow {}".format(userbold),
                        "#turtle matching algorithm could be better {}".format(userbold)
                    ]), 3)
                return
        except:
            self.couldnotreplyto("match")
        try:
            if ( "damn" in msg ) and ( not ( user in MY_USERS ) ):
                damnsaid = self.damnsaid.get(user, 0)
                now = time.time()
                if ( now - damnsaid ) > ( 30 * 60 ):
                    self.damnsaid[user] = now
                    self.reply(random.choice([
                        ":( damn {}".format(userbold)                        
                    ]), 3)
                return
        except:
            self.couldnotreplyto("damn")
        try:
            if ( "noob" in msg ) and ( not ( user in MY_USERS ) ):
                noobsaid = self.noobsaid.get(user, 0)
                now = time.time()
                if ( now - noobsaid ) > ( 30 * 60 ):
                    self.noobsaid[user] = now
                    self.reply(random.choice([
                        "#noob noobs are noob {}".format(userbold),
                        "#noob beginner {}".format(userbold),
                        "#noob freshman {}".format(userbold),
                        "#noob initial {}".format(userbold),
                        "#noob entrant {}".format(userbold),
                        "#noob fledgling {}".format(userbold),
                        "#noob cheryy {}".format(userbold)
                    ]), 3)
                return
        except:
            self.couldnotreplyto("noob")
        try:
            if ( ( "bye" in msg ) or ( "c ya" in msg ) or ( msg == "see you" ) ) and ( not ( user in MY_USERS ) ):
                byesaid = self.byesaid.get(user, 0)
                now = time.time()
                if ( now - byesaid ) > ( 30 * 60 ):
                    self.byesaid[user] = now
                    self.reply(random.choice([
                        "#waving see you later alligator {}".format(userbold),
                        "#waving bye {}".format(userbold),
                        "#waving so long {}".format(userbold),
                        "#waving c ya {}".format(userbold),
                        "#waving see you {}".format(userbold)                        
                    ]), 3)
                return
        except:            
            self.couldnotreplyto("bye")

    def gratulate(self, user):
        user = "#greenhart {} #greenhart".format(user)
        self.say(random.choice([
            "#checkmark grats {}".format(user),
            "#checkmark gg {}".format(user),
            "#checkmark well done {}".format(user),
            "#checkmark keep it up {}".format(user),
            "#checkmark keep going {}".format(user)
        ]))

    def gamefinishedhandler(self, gid):                
        try:
            gobj = self.games[gid]
            ratingbias = gobj["ratingBias"]
            score = gobj["score"]
            nomoves = len(gobj["moves"])
            whitename = gobj["whiteName"]
            whiterating = gobj["whiteRating"]
            blackname = gobj["blackName"]
            blackrating = gobj["blackRating"]
            whitenamelower = whitename.lower()
            blacknamelower = blackname.lower()
            if ( whitenamelower in self.banlist ) or ( blacknamelower in self.banlist ):
                self.disturbance()
                return
            whiteratedname = "{} ( {} )".format(translate(whitename, "bold-sans"), translate(whiterating, "bold-sans"))
            blackratedname = "{} ( {} )".format(translate(blackname, "bold-sans"), translate(blackrating, "bold-sans"))
            rs = ratingbias * score                                
            rslimit = ( -1 ) * int(environ.get("RSLIMIT", "200"))
            effrslimit = rslimit
            rsfactor = float(environ.get("RSFACTOR", 3))
            if score < 0:
                effrslimit = int(effrslimit / rsfactor)
            print("{}game finished".format(ANSI_BRIGHTMAGENTA), whitename, whiterating, blackname, blackrating, score, nomoves, rs, effrslimit, self.halfhourmod,  ANSI_ENDC)
            exclam = random.choice([
                "what a game",
                "wow",
                "unbelievable",
                "can you believe this",
                "surprise, surprise"
            ])
            if ( rs < effrslimit ) and ( nomoves > 1 ):            
                upset = whitename            
                upsetrated = whiteratedname
                upsetloser = blackname
                upsetloserrated = blackratedname
                if score < 0:
                    upset = blackname
                    upsetrated = blackratedname
                    upsetloser = whitename     
                    upsetloserrated = whiteratedname       
                gameurl = "https://lichess.org/{}".format(gid)                
                beats = random.choice([
                    "wins against",
                    "winning against",
                    "defeats",
                    "defeating",
                    "demolishes",
                    "demolishing",
                    "wipes off",
                    "wiping off",
                    "beats",
                    "beating"
                ])
                self.say(random.choice([
                    "#rocket {} {} {} {}".format(exclam, upsetrated, beats, upsetloserrated),
                    "#rocket {} {} {} {}".format(exclam, upsetrated, beats, upsetloserrated),
                    "#rocket {} {} {} {} points higher rated".format(exclam, upsetrated, beats, translate(abs(ratingbias), "bold-sans"))
                ])) 
                time.sleep(2)
                self.say(gameurl)               
                withblack = random.choice([
                    "#devil with black!",
                    "#devil having the black pieces!",
                    "#devil as black!",
                    "#devil playing black!"
                ])
                if upset == blackname:
                    time.sleep(2)
                    self.say(withblack)                
                time.sleep(2)
                self.gratulate(translate(upset, "bold-sans"))
            if ( ( whiterating - blackrating ) > abs(rslimit) ) and ( score == 0 ):            
                self.say("#rocket {} {} draws {} with black".format(exclam, blackname, whitename))                
                time.sleep(2)
                self.gratulate(translate(blackname, "bold-sans"))
        except:
            pe()
            print("could not handle game finished")

chatbots = {}

def startup():        
    if environ.get("NOCHAT", False):
        print("no chat")
        return
    chatuserlila2 = login.login(environ.get("CHATUSER", "none"), environ.get("CHATPASS", "none"))
    if not chatuserlila2:
        chatuserlila2 = environ.get("CHATUSERLILA2", None)
        print("obtained chatuserlila2 from env", chatuserlila2)
    else:
        print("obtained chatuserlila2 by login", chatuserlila2)

    while True:
        #print("getting tourneys for chatbot")
        tourneys = getallfeaturedtourneys()

        if len(tourneys) > 0:
            tourney = tourneys[0]
            tid = tourney["id"]
            #print("found tourney {}".format(tid))
            missing = not ( tid in chatbots )
            if not missing:
                cb = chatbots[tid]
                if not ( cb.alive ):
                    print("bot found but not alive for {}".format(tid))
                    missing = True
            if missing:
                print("creating bot for {}".format(tid))
                chatbot = MyChatbot(chatuserlila2, tid)
                chatbot.startup()
                chatbots[tid] = chatbot                            
                #time.sleep(3)                                
                #chatbot.say("#noob")
            else:
                #print("bot already up for {}".format(tid))
                pass
        else:
            print("could not find tourney")

        time.sleep(180)

###################################################