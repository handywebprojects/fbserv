#########################################################
# global imports
import os
#########################################################

#########################################################
# local imports
from utils.misc import read_json_from_file, getschemavalue, randurl, write_json_to_file
from utils.misc import SchemaString, SchemaCheckbox, SchemaSlider
#########################################################

def APP_MODE():
    if "FBSERV_MODE" in os.environ:
        mode = os.environ["FBSERV_MODE"]
        return mode
    return "prod"

def IS_DEV():
    return APP_MODE() == "dev"

def IS_PROD():
    return APP_MODE() == "prod"

def SERVER_URL():
    return os.environ.get("SERVERURL", "http://localhost:5000")

#########################################################

REMOTE_URL = os.environ.get("REMOTEURL", "https://fbserv.herokuapp.com")
LOCAL_URL = "http://localhost:5000"
SIMPLE_URL = "http://localhost:4000"

def SERVER_URL():
    if IS_PROD():
        return REMOTE_URL        
    return LOCAL_URL

#########################################################

def getval(path, default = None):
    schobj = read_json_from_file("schemaconfig.json", {})
    value = getschemavalue(schobj, path, default)
    return value

def getmodeval(path, default = None):
    return getval(path + ":" + APP_MODE(), default)

def getconfigschema():
    return read_json_from_file("schemaconfig.json", {
        "kind": "collection",
        "disposition": "dict",
        "childsarg": []
    })

#########################################################

VALS = [    
    [ "global/dodocs", SchemaCheckbox(False), SchemaCheckbox(True) ],
    [ "global/dobook", SchemaCheckbox(False), SchemaCheckbox(True) ],
    [ "global/username", SchemaString("lishadowapps") ],
    [ "global/usertoken", SchemaString("lEbMJHEmjUXRy6OH") ],
    [ "global/enginepath", SchemaString("engines/stockfish9.exe"), SchemaString("/app/engines/stockfish9") ],
    [ "global/analysispvlength", SchemaSlider(4, 1, 20, 1) ],
    [ "global/dostoredanalysis", SchemaCheckbox(False), SchemaCheckbox(True) ],
    [ "global/dodirbrowser", SchemaCheckbox(False), SchemaCheckbox(True) ],
    [ "global/dogames", SchemaCheckbox(False), SchemaCheckbox(True) ],
    [ "global/doboard", SchemaCheckbox(False), SchemaCheckbox(True) ],
    [ "global/dodrive", SchemaCheckbox(False), SchemaCheckbox(True) ],
    [ "global/doabout", SchemaCheckbox(False), SchemaCheckbox(True) ],
    [ "global/dogamepreview", SchemaCheckbox(False), SchemaCheckbox(True) ],    
    [ "global/doforumgame", SchemaCheckbox(False), SchemaCheckbox(True) ],    
    [ "global/dostoredauto", SchemaCheckbox(False), SchemaCheckbox(True) ],    
    [ "global/autoanalysisdelay", SchemaSlider(10, 3, 60, 1) ],
    [ "global/maxgames", SchemaSlider(25, 10, 1000, 1) ],
    [ "global/gamesfilter", SchemaString("") ],
    [ "layout/boardbackground", SchemaString("wood.jpg") ],
]

#########################################################

def toint(x):
    return int(x)

def createconfigdefaults(schobj):
    for VAL in VALS:
        path = VAL[0]
        name = path.split("/")[-1]
        if len(VAL) == 2:
            default = VAL[1].quoted()
            getschemavalue(schobj, path, VAL[1])
        elif len(VAL) == 3:
            devdefault = VAL[1].quoted()
            proddefault = VAL[2].quoted()
            getschemavalue(schobj, path + ":dev", VAL[1])
            getschemavalue(schobj, path + ":prod", VAL[2])            
    return schobj

def getconfigschemawithdefaults():
    return createconfigdefaults(getconfigschema())

#########################################################

def enginepath():
    return getmodeval("global/enginepath")

def analysispvlength():
    return getval("global/analysispvlength")

#########################################################

if __name__ == "__main__":
    print("writing shchemaconfig.json")
    write_json_to_file("schemaconfig.json", getconfigschemawithdefaults())
