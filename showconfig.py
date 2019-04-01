#########################################################

import heroku3

from os import environ

from json import dumps

from utils.ansi import pretty

#########################################################

def prettyconfig(configobj):
    config = configobj.__dict__["_ConfigVars__data"]
    for key in list(config.keys()):
        if ( "FBSACCKEY" in key ) or ( "BOT_TOKENS" in key ):
            del config[key]
    return pretty(config, indent = 2)

#########################################################

def showconfig():
    handywebprojectsconn = heroku3.from_key(environ["FBSERV_TOKEN"])

    fbservapp = handywebprojectsconn.apps()["fbserv"]

    fbservconfig = fbservapp.config()

    print("fbserv config", prettyconfig(fbservconfig))

    handychessapplicationsconn = heroku3.from_key(environ["FBSERV2_TOKEN"])

    fbserv2app = handychessapplicationsconn.apps()["fbserv2"]

    fbserv2config = fbserv2app.config()

    print("fbserv2 config", prettyconfig(fbserv2config))

if __name__ == "__main__":
    showconfig()

#########################################################