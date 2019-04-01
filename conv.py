import base64
from utils.misc import read_string_from_file, write_string_to_file
import sys, os
import heroku3

CHUNK_SIZE = 512

ENV_NAME = "FBSACCKEY"

def chunkstring(string, length):
    return (string[0+i:length+i] for i in range(0, len(string), length))

def enc(s):
    return base64.b64encode(str.encode(s))

def toenv():
    fbsacckey = read_string_from_file("firebase/fbsacckeyorig.json","{}")

    chunks = chunkstring(enc(fbsacckey), CHUNK_SIZE)

    bat = ""

    heroku_conn = heroku3.from_key(os.environ.get("FBSERV_TOKEN"))

    app = heroku_conn.app("fbserv")

    appconfig = app.config()

    print("heroku app", app, appconfig)

    i = 0
    for chunk in chunks:        
        varname = "{}_{}".format(ENV_NAME, i)
        decchunk = chunk.decode()
        print("setting config var", i, varname, decchunk)        
        appconfig[varname] = decchunk
        bat += "set {}={}\n".format(varname, decchunk)
        i+=1

    write_string_to_file("s/toenv.bat", bat)

    appconfig["NOTOURNEY"] = "1"
    appconfig["NOCHAT"] = "1"
    bottokens = read_string_from_file("conf/bottokens.txt", "")
    print("setting bot tokens", bottokens)
    appconfig["BOT_TOKENS"] = bottokens
    
    print("new app config", appconfig)

def fromenv():
    content = ""
    for i in range(100):
        try:
            chunk = os.environ["{}_{}".format(ENV_NAME, i)]
            cd = base64.b64decode(chunk).decode()
            content += cd
        except:
            break
        
    write_string_to_file("firebase/fbsacckey.json", content)

    print("written content", content)

if sys.argv[1] == "e":
    toenv()
elif sys.argv[1] == "d":
    fromenv()

