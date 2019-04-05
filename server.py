#########################################################
# global imports
import random
import json
import sys
import os
import uuid
import time
from traceback import print_exc
from datetime import datetime
import hashlib
import calendar
#########################################################

#########################################################
# local imports
import config

from utils.misc import read_yaml_from_file, read_json_from_file, postjson, postjsonjson, posturl, geturl
from utils.misc import read_string_from_file
from utils.servercommon import isuseradmin, ispathauthorized
from lichess.models import Game, TITLED_COLUMN_TYPES, LICHESS_TITLES, ATOMIC_TOURNEY_NAME
from login import talktourneychat, login
from scheduler import shouldwake
#########################################################

#########################################################
# flask imports
import mimetypes
mimetypes.add_type('text/javascript', '.js')

from flask import Flask, render_template, request, Response, send_from_directory, redirect
#########################################################

#########################################################
# create app
app = Flask(__name__, static_url_path = '/static')
app.config['SECRET_KEY'] = 'secret!'
app.config['UPLOAD_FOLDER'] = 'upload'
app.config['DOWNLOAD_FOLDER'] = 'download'
#########################################################

#########################################################
# flask socketio imports
from flask_socketio import SocketIO, emit
#########################################################

#########################################################
# mount socket
#socketio = SocketIO(app)
socketio = SocketIO(app, async_mode='gevent')
#########################################################

#########################################################
# globals
sids = {}
uids = {}
#########################################################

#########################################################
# config
REQUIRED_PROFILES = 4
NUM_TITLED_COLUMNS = 5

TOURNEY_LINKS = [
    "https://fbserv.herokuapp.com/titled",
    "https://fbserv.herokuapp.com/tourneys.html"
]

TOURNEY_MESSAGES = [
    "check out", "navigate to",
    "try", "dive into",
    "have a look at", "ratchet up",
    "consider", "prop up",
    "give a chance to", "propel",
    "taste", "befriend",
    "risk", "bookmark",
    "examine", "taste",
    "try out", "extract",
    "check", "render",
    "visit", "capture",
    "tour", "fly over",
    "go to", "dig into",
    "walk to", "open",
    "enter", "roll down",
    "click", "ignate",
    "explore", "view"
]

def randomtourneymessage():
    return random.choice(TOURNEY_MESSAGES) + " " + random.choice(TOURNEY_LINKS)
#########################################################

#########################################################
# utils
def hexdigest(content):
    content = "{}".format(content)
    encoded = content.encode("utf-8")
    return hashlib.md5(encoded).hexdigest()[:10]

SEP = "----------"
def printreq(req):
    return
    print(f"{SEP} request -{SEP}")
    for key in list(req.__dict__.keys()):
        if not key in ["environ", "routing_exception", "shallow", "cookies", "view_args", "namespace"]:
            print(key, req.__dict__[key])
    print(f"{SEP}{SEP}{SEP}")

def my_broadcast(obj):
    sendto = obj.get("sendto", "user")    
    uid = obj.get("uid", "mockuser")
    if uid == "mockuser":
        print("info: broadcast received mockuser uid")
        if sendto == "user":
            print("error: user was specified as sendto, refusing to emit")
            return
    sendtosids = []
    if sendto == "user":
        if uid in uids:            
            for sid in uids[uid]:
                sendtosids.append(sid)
    elif sendto == "all":
        sendtosids = sids
    else:
        print("broadcast specific {}".format(sendto))
        sendtosids = sendto
    #print("uids", json.dumps(uids, indent = 2))
    #print("sendto", sendto)
    #print("uid", uid)
    #print("sendtosids", sendtosids)
    #print("kind", obj["kind"])
    for sid in sendtosids:
        try:                
            socketio.emit("siores", obj, room = sid, namespace = "/")
        except:
            print("emit failed for sid {}".format(sid))

def postsimple(obj):
    return postjson(config.SIMPLE_URL, obj)

def postsimplejson(obj):
    return postjsonjson(config.SIMPLE_URL, obj)
#########################################################

def reqpub(reqobj):
    postsimple({
        "kind": "dopublish",
        "publishobj": reqobj
    })

def reqlog(request, msg = None):
    if not msg:
        msg = request.url 
    reqpub({
        "kind": "dolog",
        "msg": msg,
        "referer": request.headers.get("Referer", None),
        "ip": request.remote_addr
    })

def reqappstateupdate(appstateupdateobj):
    reqpub({
        "kind": "updateappstate",
        "appstateupdate": appstateupdateobj
    })

#########################################################
# tear down request handler

reqcnt = 0
lastwake = 0

@app.teardown_request
def teardownrequest(exc):        
    global reqcnt, lastwake
    try:
        if config.IS_PROD() and (reqcnt < 1):
            reqlog(request, msg = "startup " + request.url)
            reqcnt += 1
        if config.IS_PROD():
            if os.environ.get("NOLASTREQ", False):
                pass
            else:
                reqappstateupdate({
                    "lastrequesttime": time.time()
                })
    except:
        print("ann error occured while tearing down the request")
        print_exc(file = sys.stderr)
    try:
        if shouldwake():
            if ( time.time() - lastwake ) > 600:
                lastwake = time.time()
                WAKE_URL = os.environ.get("WAKEURL", "https://fbserv2.herokuapp.com/tos")
                print("waking up")
                geturl(WAKE_URL)
    except:
        print("problem with waking")
        print_exc(file = sys.stderr)

#########################################################

#########################################################
# app routes
@app.route("/tos")
def tos():
    printreq(request)
    return render_template("tos.html")

@app.route("/tourney")
def tourney():    
    token = request.args.get("token")
    name = request.args.get("name", ATOMIC_TOURNEY_NAME)
    clockTime = request.args.get("clockTime", 3)
    clockIncrement = request.args.get("clockIncrement", 2)
    minutes = request.args.get("minutes", 360)
    waitMinutes = request.args.get("waitMinutes", os.environ.get("WAITMINUTES", 10))
    variant = request.args.get("variant", "atomic")
    rated = request.args.get("rated", "true")    
    minRating = request.args.get("minRating", 0)
    minRatingPerf = request.args.get("minRatingPerf", "auto")
    maxRating = request.args.get("maxRating", 9999)
    maxRatingPerf = request.args.get("maxRatingPerf", "auto")
    nbRatedGame = request.args.get("nbRatedGame", 0)
    nbRatedGamePerf = request.args.get("nbRatedGamePerf", "auto")
    startDate = request.args.get("startDate", None)
    fields = {
        "name": name,
        "clockTime": clockTime,
        "clockIncrement": clockIncrement,
        "minutes": minutes,
        "waitMinutes": waitMinutes,
        "variant": variant,
        "rated": rated,
        "conditions.minRating.rating": minRating,
        "conditions.minRating.perf": minRatingPerf,
        "conditions.maxRating.rating": maxRating,
        "conditions.maxRating.perf": maxRatingPerf,
        "conditions.nbRatedGame.nb": nbRatedGame,
        "conditions.nbRatedGame.perf": nbRatedGamePerf            
    }
    if startDate:        
        try:
            format = "%Y-%m-%d %H:%M"
            dt = datetime.strptime(startDate, format)
            utctimestamp = calendar.timegm(dt.timetuple())
            timestamp = int(utctimestamp) * 1000
        except:
            timestamp = startDate
        fields["startDate"] = timestamp
    resstr = posturl("https://lichess.org/api/tournament",
        headers = {
            "Authorization": "Bearer {}".format(token)
        },
        fields = fields
    )                         
    tid = None
    try:
        resjson = json.loads(resstr)
        resstr = json.dumps(resjson, indent = 2)                
        tid = resjson["id"]
        if False:
            msg = randomtourneymessage()
            msg = "have a good tourney"            
            reqpub({
                "kind": "talktourneychat",
                "tid": tid,
                "username": "AtomicChessBot",
                "password": os.environ["ATOMPASS"],
                "msg": msg
            })
            reqpub({
                "kind": "jointourney",
                "tid": tid,
                "username": "lishadowapps",
                "password": os.environ["LICHPASS"]
            })
    except:
        print("there was a problem with tourney response")    
    return render_template("tourneyresponse.html", tourneyresponse = {
        "content": str(resstr),
        "url": "https://lichess.org/tournament/{}".format(tid)
    })

@app.route("/")
def index():
    printreq(request)    
    return render_template("index.html", config = config)

@app.route("/upload", methods = ["POST"])
def upload():
    if 'files' not in request.files:            
        return Response(json.dumps({
            "success": False,
            "status": "no file input"
        }), content_type = "application/json")
    file = request.files['files']
    if file:            
        filename = file.filename
        parts = filename.split(".")            
        savefilename = uuid.uuid1().hex + "." + parts[-1]            
        savepath = os.path.join(app.config['UPLOAD_FOLDER'], savefilename)
        file.save(savepath)            
        simpleresponsecontent = postsimple({
            "kind": "saveupload",
            "filename": filename,
            "savefilename": savefilename,
            "savepath": savepath
        })                
        return Response(simpleresponsecontent, content_type = "application/json")

@app.route("/dirbrowserupload", methods = ["POST"])
def dirbrowserupload():
    try:
        if 'files' not in request.files:            
            return Response(json.dumps({
                "success": False,
                "status": "no file input"
            }), content_type = "application/json")
        file = request.files['files']
        if file:            
            filename = file.filename        
            drive = request.form["drive"] == "true"
            dirpath = request.form["dirpath"]
            uid = request.form["uid"]        
            if dirpath == ".":
                savepath = filename
                if drive:
                    savepath = os.path.join("drive", uid, filename)
            else:
                savepath = os.path.join(dirpath, filename)
                if drive:
                    savepath = os.path.join("drive", uid, dirpath, filename)
            if isuseradmin(uid):
            #if isuseradmin(uid) or drive:
                file.save(savepath)
                return Response(json.dumps({
                    "success": True,
                    "filename": filename
                }), content_type = "application/json")
            else:
                return Response(json.dumps({
                    "success": False,
                    "status": "not authorized"
                }), content_type = "application/json")
    except:
        print("! dirbrowser upload error")
        print_exc(file = sys.stderr)
        return Response(json.dumps({
            "success": False,
            "status": "dirbrowser upload error"
        }), content_type = "application/json")

@app.route("/getbook/<path:path>")
def getbook(path):
    parts = path.split("/")
    variantkey = parts[0]
    fen = "/".join(parts[1:])
    simpleresponsecontent = postsimple({
        "kind": "getbook",
        "variantkey": variantkey,
        "fen": fen,
        "owner": "servergetbook"
    })                
    return Response(simpleresponsecontent, content_type = "application/json")

@app.route("/uploads/<path:path>")
def serve_uploaded_file(path):        
    filepath = os.path.join(app.config['DOWNLOAD_FOLDER'], path)    
    postsimple({
        "kind": "getupload",
        "filepath": filepath,
        "filename": path
    })                
    return send_from_directory('.', "download/{}".format(path))

@app.route("/file/<path:path>")
def serve_file(path):                
    if ispathauthorized(path, "nonadminuser"):
        return send_from_directory('.', path)
    else:
        return "Not authorized"

@app.route("/analysis/<path:path>")
def analysis(path):                
    variantkey = "standard"
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    if path:
        parts = path.split("/")
        variantkey = parts[0]
        if len(parts) > 1:
            fen = "/".join(parts[1:])
    return redirect(config.SERVER_URL() + "/?task=analysis&variantkey={}&fen={}&tab=board".format(variantkey, fen))

@app.route("/atomictourneys")
def atomictourneys():
    return redirect(config.SERVER_URL() + "/tourneys.html?ref=tourney&ignoredperfs=ultraBullet,bullet,blitz,rapid,classical,correspondence,chess960,crazyhouse,antichess,horde,kingOfTheHill,racingKings,threeCheck&includekinds=created,started,finished")

@app.route("/analysis")
def analysisdefault1():
    return analysis(None)

@app.route("/analysis/")
def analysisdefault2():
    return analysis(None)

@app.route("/sendsiores", methods = ["POST"])
def sendsiores():       
    obj = request.get_json()    
    my_broadcast(obj)
    return ""

@app.route("/bots")
def bots():           
    fontsize = request.args.get("fontsize", 12)
    botprofiles = {}     
    while len(botprofiles) < REQUIRED_PROFILES:
        obj = postsimplejson({
            "kind": "getmybots"        
        })                    
        if not obj:
            return "Error: could not get bots."
        botprofiles = obj.get("mybots", None)
        for k, v in botprofiles.items():
            v["lastgameclass"] = Game(v["lastgame"])
        if len(botprofiles) < REQUIRED_PROFILES:
            print("not enough profiles")
            time.sleep(2)
    return render_template("bots.html", botprofiles = botprofiles, config = config, fontsize = fontsize)

@app.route("/titled")
def titled():               
    columns = [None]*NUM_TITLED_COLUMNS
    columns[0] = request.args.get("column0", "total_games")
    columns[1] = request.args.get("column1", "number_of_followers")
    columns[2] = request.args.get("column2", "bullet_rating")
    columns[3] = request.args.get("column3", "blitz_rating")
    columns[4] = request.args.get("column4", "rapid_rating")    
    reversesstr = request.args.get("reverses", "nnnnn")
    fontsize = request.args.get("fontsize", "inherit")
    minimal = ( request.args.get("minimal", "false") == "true" )
    reverses = []
    for letter in list(reversesstr):
        if letter == 'y':
            reverses.append(True)
        else:
            reverses.append(False)
    titles = request.args.get("titles", "BOT").split(",")
    onlineonly = ( request.args.get("onlineonly", "false") == "true" )
    hideoffline = ( request.args.get("hideoffline", "false") == "true" )
    nolog = ( request.args.get("nolog", "false") == "true" )
    storedtitled = []
    onlinestatus = None
    while len(storedtitled) == 0:
        obj = postsimplejson({
            "kind": "getstoredtitled",
            "msg": request.url,
            "referer": request.headers.get("Referer", None),
            "ip": request.remote_addr,
            "dolog": not nolog
        })
        if not obj:
            return "Error: could not get titled."
        storedtitled = obj["storedtitled"]
        onlinestatus = obj["onlinestatus"]
        if len(storedtitled) == 0:
            print("no titled players yet, waiting")
            time.sleep(2)
    print("stored titled {}".format(len(storedtitled)))
    playerrows = []
    rowcnt = 0
    titlecnts = {}
    idnamehash = {}
    nameidhash = {}
    for player in storedtitled:
        title = player["title"]        
        id = player["id"]
        username = player["username"]        
        ok = True
        if onlineonly:
            if onlinestatus:
                ok = id in onlinestatus
            else:
                ok = player.get("online", False)
        if ( title in titles ) and ok:            
            if title in titlecnts:
                titlecnts[title] += 1
            else:
                titlecnts[title] = 1
            playerrow = [
                0,
                username,
                title
            ]
            idnamehash[id] = {
                "username": username,
                "title": title
            }
            nameidhash[username] = id
            for i in range(NUM_TITLED_COLUMNS):
                column = columns[i]
                columnparts = column.split("_")       
                data = 0
                if len(columnparts) > 1:
                    if columnparts[1] == "rating":
                        data = player.get("perfs", {}).get(columnparts[0], {}).get("rating", 1500)
                    if columnparts[1] == "games":
                        data = player.get("perfs", {}).get(columnparts[0], {}).get("games", 0)
                if column == "number_of_followers":
                    data = player.get("nbFollowers", 0)                
                if column == "total_games":
                    data = player.get("totalgames", 0)
                if column == "created_at":
                    dataraw = int(player.get("createdAt", 0)/1000)
                    data = datetime.utcfromtimestamp(dataraw).strftime('%Y-%m-%d %H:%M:%S')
                playerrow.append(data)
            playerrows.append(playerrow)
    for i in range(NUM_TITLED_COLUMNS):        
        playerrows = sorted(playerrows, key = lambda row: row[NUM_TITLED_COLUMNS - i + 2], reverse = not reverses[NUM_TITLED_COLUMNS - 1 - i])
    for rowcnt in range(len(playerrows)):
        playerrows[rowcnt][0] = rowcnt + 1
    titlebreakdowns = []
    for title in sorted(list(titlecnts.keys()), key = lambda x: titlecnts[x], reverse = True):
        titlebreakdowns.append("{} {}".format(title, titlecnts[title]))
    titlebreakdown = " , ".join(titlebreakdowns)
    return render_template("titled.html", config = config, columntypes = TITLED_COLUMN_TYPES, numcolumns = NUM_TITLED_COLUMNS, columns = columns, alltitles = LICHESS_TITLES, titles = titles, playerrows = playerrows, numplayers = len(playerrows), onlineonly = onlineonly, hideoffline = hideoffline, titlebreakdown = titlebreakdown, reverses = reverses, nolog = nolog, fontsize = fontsize, idnamehash = idnamehash, nameidhash = nameidhash, minimal = minimal)

@app.route("/tourneys.html")
def tourneys():
    reqlog(request)
    return read_string_from_file("tourneys.html", "tourneys")

@app.route("/games.html")
def games():    
    reqlog(request)
    return read_string_from_file("games.html", "games")

@app.route("/createtourney.html")
def createtourney():    
    reqlog(request)
    return read_string_from_file("createtourney.html", "createtourney")

@app.route("/smileyeditor.html")
def smileyeditor():    
    reqlog(request)
    return read_string_from_file("smileyeditor.html", "smileyeditor")

@app.route("/wait")
def wait():    
    time.sleep(15)
    return "wait returned"

@app.route("/logs")
def logs():           
    obj = postsimplejson({
        "kind": "getlogs"
    })
    if not obj:
        return "Error: could not get logs."
    logs = obj["logs"]    
    logs.reverse()
    if len(logs) == 0:
        return "No logs yet."
    obj = postsimplejson({
        "kind": "updateappstate",
        "doupdate": False
    })
    if not obj:
        return "Error: could not get appstate for logs."
    appstate = obj["appstate"]
    now = time.time()
    lrt = appstate.get("lastrequesttime", now)
    appstate["lastrequesttimef"] = datetime.utcfromtimestamp(lrt).strftime('%Y-%m-%d %H:%M:%S')
    lastrequestdelta = datetime.utcfromtimestamp(now) - datetime.utcfromtimestamp(lrt)
    appstate["lastrequestdelta"] = str(lastrequestdelta)    
    if lrt >= now:
        appstate["lastrequestdelta"] = "0"
    sst = appstate.get("serverstarttime", now)
    appstate["serverstarttimef"] = datetime.utcfromtimestamp(sst).strftime('%Y-%m-%d %H:%M:%S')
    sstdelta = datetime.utcfromtimestamp(now) - datetime.utcfromtimestamp(sst)
    appstate["sstdelta"] = str(sstdelta)    
    if sst >= now:
        appstate["sstdelta"] = "0"
    ltt = appstate.get("lastticktime", now)
    appstate["lastticktimef"] = datetime.utcfromtimestamp(ltt).strftime('%Y-%m-%d %H:%M:%S')
    lttdelta = datetime.utcfromtimestamp(now) - datetime.utcfromtimestamp(ltt)
    appstate["lttdelta"] = str(lttdelta)    
    if ltt >= now:
        appstate["lttdelta"] = "0"
    dates = {}
    for logitem in logs:
        date = logitem["timef"][:10]
        ip = logitem.get("ip", "none")
        cdate = dates.get(date, {})
        if not ( ip in cdate ):
            cdate[ip] = True        
            numips = cdate.get("numips", 0)
            cdate["numips"] = numips + 1
        dates[date] = cdate
            
    return render_template("logs.html", config = config, logs = logs, appstate = appstate, hexdigest = hexdigest, dates = dates)

#########################################################

#########################################################
# socketio event handler
@socketio.on('sioreq')
def handle_sioreq(obj):
    sid = request.sid
    t = time.time()
    sids[sid] = t
    uid = obj.get("uid", "mockuser")
    if uid in uids:
        uids[uid][sid] = t
    else:
        uids[uid] = {
            sid: t
        }
    #print("sids", sids)
    #print("uids", uids)
    printreq(request)    
    try:
        obj["sid"] = sid
        resobj = postsimplejson(obj)
        my_broadcast(resobj)
    except:
        print_exc(file = sys.stderr)
#########################################################

#########################################################
# startup
def startup(port = 5000):
    socketio.run(app, port = port)
#########################################################

#########################################################
# main
if __name__ == '__main__':    
    startup()
#########################################################
