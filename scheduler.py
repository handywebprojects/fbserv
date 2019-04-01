#########################################################

from os import environ
from datetime import datetime

#########################################################

WAKE_HOURS = []
SLEEP_HOURS = []
DO_WAKE = bool(environ.get("DOWAKE", False))
DO_SLEEP = bool(environ.get("DOSLEEP", False))

#########################################################

try:
    WAKE_HOURS = environ["WAKEHOURS"].split(",")
except:
    pass

try:
    SLEEP_HOURS = environ["SLEEPHOURS"].split(",")
except:
    pass

#########################################################

print("scheduler", WAKE_HOURS, DO_WAKE, SLEEP_HOURS, DO_SLEEP)

#########################################################

def shouldwake():
    global WAKE_HOURS, DO_WAKE
    if DO_WAKE:
        nowhour = datetime.utcnow().hour
        if str(nowhour) in WAKE_HOURS:
            return True
    return False

def shouldsleep():
    global SLEEP_HOURS, DO_SLEEP
    if DO_SLEEP:
        nowhour = datetime.utcnow().hour
        if str(nowhour) in SLEEP_HOURS:
            return True
    return False

#########################################################
