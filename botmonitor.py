#########################################################

from os import environ
from utils.misc import geturljson
from time import sleep
import heroku3
from random import randint
from threading import Thread

#########################################################

BOT_TOKENS = environ["BOT_TOKENS"]

tokens = {}

for tokenstr in BOT_TOKENS.split(";"):
    tokenparts = tokenstr.split(":")
    tokens[tokenparts[1]] = tokenparts[0]

print("tokens", tokens)

#########################################################

class BotMonitor:
    def __init__(self, id, aliases):
        self.id = id
        self.aliases = aliases        
        self.conn = None
        self.app = None
        self.online = False        
        self.alias = None

    def getonline(self):
        resjson = geturljson("https://lichess.org/api/users/status?ids={}".format(self.id))[0]
        self.online = resjson.get("online", False)
        return self.online

    def getconn(self, token):
        self.conn = heroku3.from_key(token)

    def getapp(self, alias):
        global tokens
        self.alias = alias
        token = tokens[alias]
        self.getconn(token)
        self.app = self.conn.apps()[alias]

    def scale(self, kind, value):
        print("scaling bot {} {} {} {}".format(self.id, self.alias, kind, value))
        self.app.process_formation()[kind].scale(value)

#########################################################

bots = [
    BotMonitor("lichapibot", ["obscure-cove-74967", "lgbotapi", "lgbotapi2"]),
    BotMonitor("atomicchessbot", ["dry-falls-24950", "lgbotatom", "lgbotatom2"]),
    BotMonitor("randommoverbot", ["vast-harbor-23643", "lgbotrand", "lgbotrand2"]),
    BotMonitor("capturebot", ["calm-tundra-35866", "lgbotcapt", "lgbotcapt2"])
]

#########################################################

def botmonitorthread(bot):
    global tokens
    if environ.get("NOBOTMON", False):
        print("no bot monitor {}".format(bot.id))
        return
    wait = randint(5, 60)
    #print("waiting {} sec(s) to monitor {}".format(wait, bot.id))
    sleep(wait)
    #print("start monitoring {}".format(bot.id))
    while True:
        #print("checking bot {}".format(bot.id))
        try:            
            if bot.getonline():
                #print("bot {} is online".format(bot.id))
                pass
            else:
                print("bot {} is offline".format(bot.id))
                first = True      
                success = False
                for alias in bot.aliases:
                    print("trying alias {}".format(alias))
                    bot.getapp(alias)
                    if first:
                        kind = "worker"
                        first = False
                    else:
                        kind = "web"                       
                    print("stopping {}".format(alias))
                    sleep(1)
                    bot.scale(kind, 0)
                    if not success:                        
                        print("starting {}".format(alias))
                        sleep(1)
                        bot.scale(kind, 1)
                        print("waiting for {}".format(alias))
                        sleep(90)
                        if bot.getonline():
                            print("success {} is online".format(alias))
                            success = True
                        else:
                            print("failed to get {} online".format(alias))
                            print("stopping {}".format(alias))
                            bot.scale(kind, 0)
        except:
            print("there was a problem checking bot")
        sleep(180)

for bot in bots:    
    Thread(target = botmonitorthread, args = (bot,)).start()    
