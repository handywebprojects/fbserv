#########################################################
# global imports
import firebase_admin
from firebase_admin import credentials, db, auth, storage, firestore

import json
import os
import sys
from traceback import print_exc
import shlex
import shutil
from threading import Thread
from queue import Queue
import time
import random
from datetime import datetime
from queue import Queue
from urllib.parse import unquote
import heroku3
#########################################################

#########################################################
# local imports
from utils.misc import write_string_to_file, read_string_from_file, dir_listing_as_list, postjson
from utils.misc import read_yaml_from_file, read_json_from_file, geturl, geturljson, geturlndjson
from utils.misc import ANSI_BRIGHTBLUE, ANSI_ENDC
from utils.process import Process
import config
from config import SERVER_URL, enginepath, IS_DEV, IS_PROD, getconfigschemawithdefaults, createconfigdefaults
from utils.misc import get_variant_board, addpositioninfo, createhistory
from utils.misc import ANSI_BRIGHTMAGENTA, ANSI_GREEN, get_score_numerical
from utils.misc import issubpathofpath, issubpathofpaths
from utils.servercommon import isuseradmin, ispathauthorized
import chess
from chess.uci import InfoHandler, Engine
from chess.polyglot import open_reader
from cbuild.book import get_zobrist_key_hex, Book
from cbuild.utils import create_dir
from lichess.models import Profile
import login
from scheduler import shouldsleep
#########################################################

#########################################################
# bot
if IS_PROD():
    import challenge
    import tourney
    import botmonitor
#########################################################

def pe():
    print_exc(file = sys.stderr)

#########################################################

try:
    cred = credentials.Certificate('firebase/fbsacckey.json')
    default_app = firebase_admin.initialize_app(cred, {
        "databaseURL": "https://fbserv-36b3e.firebaseio.com",
        "storageBucket": "fbserv-36b3e.appspot.com"
    })
    bucket = storage.bucket(app = default_app)
    fdb = firestore.client()
except:
    #pe()
    print("firebase could not be initialized")

#########################################################

publishqueue = Queue()

def publish(reqobj):
    global publishqueue
    publishqueue.put(reqobj)

#########################################################

def getdbelse(path, default):
    try:
        value = db.reference(path).get()        
        if not ( value is None ):
            return value
        return default
    except:
        return default

#########################################################

def defaultappstate():
    return {
        "lastrequesttime": time.time(),
        "serverstarttime": time.time(),
        "lastticktime": time.time(),
        "totalqueried": 0,
        "queryrate": 0
    }

#########################################################

ANALYSIS_DELAY = 0.5
STORE_DELAY = 5 * 60

#########################################################

MY_BOT_IDS = [
    "lichapibot",
    "atomicchessbot",
    "randommoverbot",
    "capturebot"
]

BOT_PROFILES = {}

#########################################################

processconsoles = {}

engineprocess = None

#########################################################

storedtitled = []
onlinestatus = []

#########################################################

LOG_CAPACITY = 250

def log(msg, referer = None, ip = None):
    logs = db.reference("logs").get()    
    if logs:
        if len(logs) > 0:
            latest = logs[-1]
            msgsame = ( latest.get("msg", "") == msg )
            referersame = ( latest.get("referer", None) == referer )
            ipsame = ( latest.get("ip", None) == ip )
            if msgsame and referersame and ( ipsame or bool(os.environ.get("LOGISIP", False)) ):
                mul = latest.get("mul", 0) + 1
                latest["mul"] = mul
                db.reference("logs").set(logs)
                return
        if len(logs) >= LOG_CAPACITY:
            logs = logs[1:]
    else:
        logs = []
    now = time.time()
    logs.append({
        "time": now,
        "timef": datetime.utcfromtimestamp(now).strftime('%Y-%m-%d %H:%M:%S'),
        "msg": msg,
        "referer": referer,
        "ip": ip,
        "mul": 1
    })
    db.reference("logs").set(logs)

def talktourneychat(req):
    try:
        lila2 = req.lila2
        if not lila2:
            lila2 = login.login(req.username, req.password)
        login.talktourneychat(req.tid, lila2, req.msg)
        return req.res({
            "kind": "tourneychatdone"
        })
    except:
        print("there was a problem with tourney chat")
        pe()
        return req.res({
            "kind": "tourneychatfailed"
        })        

def jointourney(req):
    try:
        lila2 = req.lila2
        if not lila2:
            lila2 = login.login(req.username, req.password)
        login.jointourney(req.tid, lila2)
        return req.res({
            "kind": "jointourneydone"
        })
    except:
        print("there was a problem with joining tourney")
        pe()
        return req.res({
            "kind": "jointourneyfailed"
        })        

#########################################################

def sendsiores(obj):
    #print("send siores", obj)
    postjson(SERVER_URL() + "/sendsiores", obj)

sioresqueue = Queue()

def sendsioresbuffered(obj):
    sioresqueue.put(obj)

def bufferedsiorestarget(sioresqueue, delay):
    while True:
        items = {}
        while not sioresqueue.empty():
            item = sioresqueue.get()
            uid = item.get("uid", "mockuser")
            if uid in items:
                items[uid].append(item)
            else:
                items[uid] = [item]
        if len(items) > 0:
            for uid in items:                
                sendsiores({
                    "kind": "buffered",                    
                    "sendto": "user",
                    "uid": uid,
                    "items": items[uid]
                })
        time.sleep(delay)

Thread(target = bufferedsiorestarget, args = (sioresqueue, 1)).start()

#########################################################

class ProcessConsole:
    def __init__(self, args):
        global processconsoles
        self.args = args
        self.key = args.get("key", None)        
        self.uid = args.get("uid", "mockuser")
        self.process = None        
        self.args["read_stdout_callback"] = self.read_stdout_callback
        self.args["read_stderr_callback"] = self.read_stderr_callback
        self.args["terminated_callback"] = self.terminated_callback
        processconsoles[self.key] = self

    def read_stdout_callback(self, sline):
        #print(sline)
        sendsioresbuffered({
            "kind": "proc",            
            "sendto": "user",
            "uid": self.uid,
            "subkind": "procstdout",
            "key": self.key,
            "sline": sline
        })

    def read_stderr_callback(self, sline):
        #print(sline)
        sendsioresbuffered({
            "kind": "proc",            
            "sendto": "user",
            "uid": self.uid,
            "subkind": "procstderr",
            "key": self.key,
            "sline": sline
        })

    def terminated_callback(self):
        global processconsoles
        self.process = None
        sendsioresbuffered({
            "kind": "proc",            
            "sendto": "user",
            "uid": self.uid,
            "subkind": "procterm",
            "key": self.key,
            "notify": "process terminated"
        })
        del processconsoles[self.key]

    def start(self):
        if not ( self.process is None ):            
            return
        self.process = Process(self.args)

    def stop(self):
        if self.process is None:            
            return
        self.process.kill()
        self.process = None

    def wait_for_return_code(self):
        if self.process is None:            
            return 0

        self.process.read_stdout_thread.join()

        returncode = self.process.wait_for_return_code()

        return returncode

class EngineProcess:
    def read_stdout_callback(self, sline):
        #print("{}engine out >".format(ANSI_GREEN), sline)        
        sendsioresbuffered({
            "kind": "engineout",
            "sline": sline,
            "sendto": "user",
            "uid": self.uid,            
            "owner": self.owner
        })
        try:
            if self.analyzestarted:
                parts = sline.split(" ")
                kind = parts[0]               
                if kind == "info":
                    try:                    
                        self.eng._info(sline)                    
                    except:
                        print("info handler error", sline)
                        pe()                 
                        return                        
                now = time.time()
                if ( now - self.analyzestarted ) > ANALYSIS_DELAY:
                    analysisinfo = {
                        "zobristkeyhex": get_zobrist_key_hex(self.board),
                        "pvitems": []
                    }
                    info = self.infh.info
                    firstdepth = None
                    depthsequal = True
                    for i , score in info["score"].items():                    
                        pvsan = None
                        bestmovesan = None                    
                        pvuci = None                    
                        bestmoveuci = None                    
                        pvpgn = None
                        try:
                            pvi = info["pv"][i]
                            sans = []
                            pgnsans = []
                            ucis = []
                            sanboard = self.board.copy()
                            mcnt = 0
                            for move in pvi:
                                san = sanboard.san(move)
                                sans.append(san)
                                ucis.append(move.uci())
                                if mcnt < config.analysispvlength():
                                    pref = ""                                
                                    if mcnt == 0:
                                        dot = ""                                    
                                        if sanboard.turn == chess.BLACK:
                                            dot = "."
                                        pref = "{}.{}".format(sanboard.fullmove_number, dot)
                                    elif sanboard.turn == chess.WHITE:
                                        pref = "{}.".format(sanboard.fullmove_number)
                                    if not ( pref == "" ):
                                        pgnsans.append(pref)
                                    pgnsans.append(san)
                                sanboard.push(move)                            
                                mcnt += 1                            
                            if len(sans) > config.analysispvlength():
                                sans = sans[:config.analysispvlength()]
                                ucis = ucis[:config.analysispvlength()]
                            pvsan = " ".join(sans)
                            bestmovesan = sans[0]
                            pvuci = " ".join(ucis)                        
                            bestmoveuci = ucis[0]
                            pvpgn = " ".join(pgnsans)
                        except:
                            pe()
                        depthi = info["depths"][i]
                        if firstdepth is None:
                            firstdepth = depthi
                        else:
                            if not ( depthi == firstdepth ):
                                depthsequal = False
                        npsi = info["npss"][i]
                        analysisinfo["pvitems"].append({
                            "i": i,
                            "score": score,
                            "pvsan": pvsan,
                            "pvpgn": pvpgn,
                            "bestmovesan": bestmovesan,
                            "pvuci": pvuci,
                            "bestmoveuci": bestmoveuci,
                            "scorenumerical": get_score_numerical(score),
                            "depth": depthi,
                            "nodes": info["nodes"],
                            "nps": npsi
                        })
                    if depthsequal:
                        sendsiores({
                            "kind": "analysisinfo",
                            "owner": self.owner,
                            "sendto": "user",
                            "uid": self.uid,
                            "analysisinfo": analysisinfo,                        
                        })
                        self.analyzestarted = now         
                        if ( now - self.storestarted ) > STORE_DELAY:
                            print("auto store analysis")
                            path = "analysisinfo/{}/{}".format(self.variantkey, self.zobristkeyhex)
                            db.reference(path).set({
                                "analysisinfo": analysisinfo
                            })
                            self.storestarted = now
                            
        except:
            print("! analysis processing error")

    def issue(self, sline):
        #print("{}engine in >".format(ANSI_BRIGHTMAGENTA), sline)        
        sendsioresbuffered({
            "kind": "enginein",
            "sendto": "user",
            "uid": self.uid,
            "sline": sline,
            "owner": self.owner
        })
        self.process.send_line(sline)

    def sendinitialanalysisinfo(self):
        time.sleep(0.25)
        print("sending initial analysis info", self.defaultanalysisinfo)

        sendsiores({
            "kind": "analysisinfo",
            "owner": self.owner,
            "sendto": "user",
            "uid": self.uid,
            "analysisinfo": self.defaultanalysisinfo,                        
        })

    def analyze(self, variantkey, multipv, fen):
        self.variantkey = variantkey
        self.fen = fen        

        self.board = get_variant_board(variantkey)       
        self.board.set_fen(fen)

        self.zobristkeyhex = get_zobrist_key_hex(self.board)

        print("analyzing", fen)

        self.defaultanalysisinfo = {
            "zobristkeyhex": self.zobristkeyhex,
            "pvitems": []
        }

        Thread(target = self.sendinitialanalysisinfo).start()

        print("starting engine")

        uci_variant = self.board.uci_variant
        self.eng = Engine()
        self.eng.board = self.board
        self.infh = InfoHandler()    
        self.eng.info_handlers.append(self.infh)
        self.issue("stop")
        self.issue("setoption name MultiPV value {}".format(multipv))
        self.issue("setoption name UCI_Variant value {}".format(uci_variant))
        threads = os.environ.get("THREADS", 1)        
        self.issue("setoption name Threads value {}".format(threads))
        hash = os.environ.get("HASH", 16)
        self.issue("setoption name Hash value {}".format(hash))
        self.issue("position fen {}".format(fen))
        self.issue("go infinite")
        now = time.time()
        self.analyzestarted = now
        self.storestarted = now

    def stopanalyze(self):
        self.issue("stop")        
        self.analyzestarted = None

    def __init__(self, owner, uid):
        self.owner = owner        
        self.uid = uid        
        self.analyzestarted = None
        self.process = Process({
            "command": enginepath(),
            "read_stdout_callback": self.read_stdout_callback,
            "read_stderr_callback": self.read_stdout_callback
        })
        self.issue("uci")

def userpath(uid, path):
    udir = os.path.join("drive", uid)        
    create_dir(udir)
    upath = os.path.join(udir, path)
    return upath

class Req:
    def ispathauthorized(self, path, write = False):
        return ispathauthorized(path, self.uid, write)

    def isadmin(self):
        return self.can("admin")

    def can(self, action):
        if isuseradmin(self.uid):
            return True
        canstr = os.environ.get("CAN" + action.upper(), "")
        cans = canstr.split(",")
        return self.uid in cans

    def noadmin(self):
        return not self.isadmin()

    def userconfigpath(self):
        return "config/" + self.uid

    def ismock(self):
        return self.uid == "mockuser"

    def effpath(self):
        if self.drive:
            return userpath(self.uid, self.path)
        else:
            return self.path

    def effdirpath(self):
        if self.drive:
            return userpath(self.uid, self.dirpath)
        else:
            return self.dirpath

    def __init__(self, reqobj = {}):
        self.reqobj = reqobj
        self.kind = None
        self.switchtodoctab = True
        self.owner = None        
        self.path = "."
        self.dirpath = "."
        self.dolog = True
        self.referer = None
        self.ip = None
        self.appstateupdate = {}
        self.publishobj = {}
        self.doupdate = True
        self.msg = None
        self.tid = None
        self.lila2 = None
        self.username = None
        self.password = None
        self.forumgame = {}
        self.fen = None
        self.queryparams = {}
        self.bookname = "default"
        self.key = "none"
        self.value = "none"
        try:
            for key, value in reqobj.items():
                self.__dict__[key] = value
        except:
            pe()
        self.sid = reqobj.get("sid", None)
        self.uid = reqobj.get("uid", "mockuser")
        self.drive = reqobj.get("drive", False)                

    def res(self, obj, sendto = "user"):
        obj["owner"] = self.owner
        obj["sid"] = self.sid
        obj["uid"] = self.uid
        obj["sendto"] = sendto
        obj["isadmin"] = self.isadmin()
        return obj

#########################################################

def dolog(req):
    try:                
        log(req.msg, req.referer, req.ip)
        return req.res({
            "kind": "logdone"
        })
    except:
        pe()
        return req.res({
            "kind": "dologfailed"
        })        

def serializeconfig(req):
    try:
        jsontext = json.dumps(req.data, indent = 2)
        if req.ismock():
            if IS_DEV():
                write_string_to_file("schemaconfig.json", jsontext)
            else:
                return req.res({
                    "kind": "configsavefailed",
                    "status": "unauthorized"
                })
        else:
            db.reference(req.userconfigpath()).set(req.data)
        return req.res({
            "kind": "configsaved",
            "size": len(jsontext)
        })
    except:
        pe()
        return req.res({
            "kind": "configsavefailed",
            "status": "fatal"
        })

def updateuserdisplayname(req):
    try:
        if not ( req.displayname == "" ):
            auth.update_user(
                req.uid,
                display_name = req.displayname                        
            )
            msg = "Updated user [{}] with display name [{}].".format(req.uid, req.displayname)
        else:
            auth.update_user(
                req.uid,
                display_name = None
            )        
            msg = "Removed display name of user [{}].".format(req.uid)
        #print(msg)
        return req.res({
            "kind": "alert",
            "reload": True,
            "data": msg
        })
    except:
        pe()
        return req.res({
            "kind": "alert",
            "data": "There was a problem updating user display name."
        })

def updateuserphotourl(req):
    try:
        if not ( req.photourl == "" ):
            auth.update_user(
                req.uid,
                photo_url = req.photourl
            )
            msg = "Updated user [{}] with photo url [{}].".format(req.uid, req.photourl)
        else:
            auth.update_user(
                req.uid,
                photo_url = None
            )
            msg = "Removed photo url of user [{}].".format(req.uid)
        #print(msg)
        return req.res({
            "kind": "alert",
            "reload": True,
            "data": msg
        })
    except:
        pe()
        return req.res({
            "kind": "alert",
            "data": "There was a problem updating user photo url."
        })

def saveupload(req):
    return req.res({
        "success": False,
        "status": "could not upload file, service currently disabled"
    })
    try:        
        blobpath = "uploads/{}".format(req.savefilename)
        #print("upload", blobpath)
        blob = bucket.blob(blobpath)
        blob.upload_from_filename(req.savepath)
        blob.make_public()
        medialink = blob.media_link
        return req.res({
            "success": True,
            "filename": req.filename,
            "savefilename": req.savefilename,
            "savepath": req.savepath,
            "blobpath": blobpath,
            "medialink": medialink
        })
    except:
        pe()
        return req.res({
            "success": False,
            "status": "could not upload file"
        })

def getupload(req):
    try:        
        blobpath = "uploads/{}".format(req.filename)
        #print("download", blobpath)
        blob = bucket.blob(blobpath)
        blob.download_to_filename(req.filepath)
        return req.res({
            "success": True,
            "filename": req.filename,
            "filepath": req.filepath,
            "blobpath": blobpath
        })
    except:
        pe()
        return req.res({
            "success": False,
            "status": "could not download file"
        })

def getdoc(req):
    try:        
        doc = read_string_from_file(os.path.join("docs", req.data) + ".md", "No docs avaialable.")
        return req.res({
            "kind": "showdoc",
            "docref": req.data,
            "switchtodoctab": req.switchtodoctab,
            "doc": doc
        })
    except:
        pe()
        return req.res({
            "kind": "showdocfailed"
        })

def simplehash(fen, range):
    parts = fen.split(" ")
    fen = parts[0] + " " + parts[1] + " " + parts[2] + " " + parts[3] + " 0 1"
    m = 1
    sum = 0
    for c in fen:
        sum += m * ord(c)
        m += 1
    return str(sum % range)

def blobtoposdict(blob, depth):
    parts = blob.split(";;")
    moves = {}
    for moveblob in parts[2].split("|"):
        moveparts = moveblob.split(";")
        algeb = moveparts[0]
        moves[algeb]={
            "algeb": algeb,
            "score": int(moveparts[1]),
            "eval": int(moveparts[2]),            
            "haspv": int(moveparts[4]),
            "depth": depth            
        }
    return {
        "moves": moves
    }

def setenvvar(req):
    try:
        if req.can("setenv"):       
            token = os.environ["HTOKEN"]
            conn = heroku3.from_key(token)
            app = conn.apps()[os.environ["APPNAME"]]
            config = app.config()
            print("setting env var", app, token, req.key, req.value)
            config[req.key] = req.value
            return req.res({
                "kind": "setenvvardone"
            })
        else:        
            return req.res({
                "kind": "alert",
                "data": "Not authorized to set env vars !"
            })
    except:
        pe()
        return req.res({
            "kind": "setenvvarfailed"
        })

BOOK_ENV_VARS = [
    "BOOKNAME",
    "ANALYSISROOT",
    "ANALYSISDEPTH",
    "ENGINEDEPTH",
    "NUMCYCLES",
    "BATCHSIZE",
    "MINIMAXAFTER",
    "WIDTHS"
]

def getstoredauto(req):    
    try:
        parts = req.fen.split(" ")        
        rawfenparts = parts[0].split("/")
        posdocid = "".join(rawfenparts) + parts[1] + parts[2] + parts[3]
        path = "books2/{}{}".format(req.bookname, req.variantkey)
        book = fdb.document(path)
        bookdict = book.get().to_dict()
        mod = int(bookdict["mod"])
        numpos = int(bookdict.get("numpos", 0))
        maxnumbpos = int(bookdict.get("maxnumbpos", 0))
        maxtotalblobsize = int(bookdict.get("maxtotalblobsize", 0))
        depth = int(bookdict.get("enginedepth", 0))
        buildinfo = bookdict.get("buildinfo", "-")
        lastsync = bookdict.get("lastsync", "-")
        lastupload = bookdict.get("lastupload", "-")
        lastminimax = bookdict.get("lastminimax", "-")
        lastadd = bookdict.get("lastadd", "-")
        try:
            bookletid = "booklet" + str(simplehash(req.fen, mod))
            booklet = book.collection("booklets").document(bookletid).get().to_dict()        
            posdict = booklet["positions"][posdocid]        
            obj = blobtoposdict(posdict["blob"], depth)
        except:
            print("could not find position")
            obj = {}
        obj["mod"] = mod
        obj["numpos"] = numpos
        obj["maxnumbpos"] = maxnumbpos
        obj["maxtotalblobsize"] = maxtotalblobsize
        obj["buildinfo"] = buildinfo
        obj["lastsync"] = lastsync
        obj["lastupload"] = lastupload
        obj["lastminimax"] = lastminimax
        obj["lastadd"] = lastadd
        obj["envvars"] = []
        for key in BOOK_ENV_VARS:
            obj["envvars"].append([key, os.environ.get(key, "-")])
        return req.res({
            "kind": "setstoredauto",
            "posdict": obj
        })
    except:
        pe()
        return req.res({
            "kind": "getstoredautofailed"
        })

def getforumgame(req):
    try:
        forumgamestr = getdbelse("forumgame", "{}")
        forumgame = json.loads(forumgamestr)
        return req.res({
            "kind": "setforumgame",
            "forumgame": forumgame
        })
    except:
        pe()
        return req.res({
            "kind": "getforumgamefailed"
        })

def setforumgame(req):
    try:
        if req.isadmin():       
            forumgamestr = json.dumps(req.forumgame)
            db.reference("forumgame").set(forumgamestr)            
            return req.res({
                "kind": "setforumgamedone"
            })
        else:        
            return req.res({
                "kind": "setforumgamefailed",
                "status": "not authorized"
            })
    except:
        pe()
        return req.res({
            "kind": "setforumgamefailed"
        })

def appenddirtopath(req):
    try:
        dp = req.effdirpath()
        if req.ispathauthorized(dp):            
            return req.res({
                "kind": "appenddirtopath",
                "dir": req.dir
            })
        else:
            return req.res({
                "kind": "appenddirtopathfailed",
                "status": "not authorized"
            })
    except:
        pe()
        return req.res({
            "kind": "appenddirtopathfailed",
            "status": "fatal"
        })

def getdirlist(req):
    try:
        dp = req.effdirpath()
        if req.ispathauthorized(dp):
            listing = dir_listing_as_list(dp)
            return req.res({
                "kind": "setdirlist",
                "listing": listing
            })
        else:
            return req.res({
                "kind": "getdirlistfailed",
                "status": "not authorized"
            })
    except:
        pe()
        return req.res({
            "kind": "getdirlistfailed",
            "status": "fatal"
        })

def getpath(req):
    try:
        p = req.effpath()
        if req.ispathauthorized(p):
            content = read_string_from_file(p, "")
            return req.res({
                "kind": "pathcontent",
                "path": req.path,
                "content": content
            })
        else:
            return req.res({
                "kind": "getpathfailed",
                "status": "not authorized"
            })
    except:
        pe()
        return req.res({
            "kind": "getpathfailed",
            "status": "fatal"
        })

def createfile(req):
    try:
        p = req.effpath()
        if req.ispathauthorized(p, True):
            write_string_to_file(p, "")
            return getdirlist(req)
        else:
            return req.res({
                "kind": "createfilefailed",
                "status": "not authorized"
            })
    except:
        pe()
        return req.res({
            "kind": "createfilefailed",
            "status": "fatal"
        })

def createdir(req):
    try:
        p = req.effpath()
        if req.ispathauthorized(p, True):
            create_dir(p)        
            return getdirlist(req)
        else:
            return req.res({
                "kind": "createdirfailed",
                "status": "not authorized"
            })
    except:
        pe()
        return req.res({
            "kind": "createdirfailed",
            "status": "fatal"
        })

def deletefile(req):
    try:        
        p = req.effpath()
        if req.ispathauthorized(p, True):            
            os.remove(p)
            return getdirlist(req)
        else:
            return req.res({
                "kind": "deletefilefailed",
                "status": "not authorized"
            })
    except:
        pe()
        return req.res({
            "kind": "deletefilefailed",
            "status": "fatal"
        })

def deletedir(req):
    try:        
        p = req.effpath()
        if req.ispathauthorized(p, True):            
            shutil.rmtree(p)
            return getdirlist(req)
        else:
            return req.res({
                "kind": "deletedirfailed",
                "status": "not authorized"
            })
    except:
        pe()
        return req.res({
            "kind": "deletedirfailed",
            "status": "fatal"
        })

def savefile(req):
    try:
        p = req.effpath()
        if req.ispathauthorized(p, True):            
            write_string_to_file(p, req.content)        
            return req.res({
                "kind": "alert",
                "data": "File saved ok !"
            })
        else:
            return req.res({
                "kind": "savefilefailed",
                "status": "not authorized"
            })
    except:
        pe()
        return req.res({
            "kind": "savefilefailed",
            "status": "fatal"
        })

def ziptocloud(req):
    if not req.isadmin():
        return req.res({
            "kind": "alert",
            "data": "Zip to cloud failed. Not authorized."
        })
    try:
        path = os.path.join("drive", req.uid)
        genpath = req.uid
        zippath = path + ".zip"
        shutil.make_archive(path, "zip", path)
        blob = bucket.blob(genpath)
        try:            
            blob.delete()
            print("blob deleted for user {}".format(req.uid))
        except:
            pass
        blob.upload_from_filename(zippath)                        
        return req.res({
            "kind": "alert",
            "data": "Drive zipped to cloud ok ! generation: {}".format(blob.generation)
        })
    except:
        pe()
        return req.res({
            "kind": "ziptocloudfailed"
        })

def unzipfromcloud(req):
    try:
        path = os.path.join("drive", req.uid)
        genpath = req.uid        
        zippath = path + ".zip"        
        blob = bucket.blob(genpath)
        blob.download_to_filename(zippath)
        shutil.unpack_archive(zippath, path)
        return getdirlist(req)
    except:
        pe()
        return req.res({
            "kind": "unzipfromcloudfailed"
        })

def connected(req):        
    schemaconfig = getconfigschemawithdefaults()
    if req.ismock():
        pass
    else:
        try:
            data = db.reference(req.userconfigpath()).get()
            if data:
                schemaconfig = createconfigdefaults(data)
        except:
            pass
    if IS_PROD() and req.noadmin():
        publish({
            "kind": "dolog",
            "msg": "connected {}".format(req.queryparams)
        })
    defposinfo = {
        "variantkey": req.queryparams.get("variantkey", "standard"),
        "fen": unquote(req.queryparams.get("fen", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"))
    }
    if req.queryparams.get("task", None) == "analysis":
        posinfo = defposinfo
    else:
        posinfo = getdbelse("board/{}/posinfo".format(req.uid), defposinfo)
    return req.res({
        "kind": "connectedack",        
        "schemaconfig": schemaconfig,
        "setposinfo": posinfo
    })

def sendfirebaseconfig(req):    
    firebaseconfig = read_yaml_from_file("firebase/fbcreds.yml", {})    
    return req.res({
        "kind": "firebaseconfig",
        "firebaseconfig": firebaseconfig
    }, [req.sid])

#########################################################
# process handlers
def startprocess(req):
    try:        
        if req.key in processconsoles:
            pc = processconsoles[req.key]
            if pc.process:
                return req.res({
                    "kind": "proc",
                    "subkind": "processalreadystarted",
                    "notify": "! process already started",
                    "key": req.key
                })
        pc = ProcessConsole(req.reqobj)
        pc.start()
        return req.res({
            "kind": "proc",
            "subkind": "processstarted",
            "notify": "process started ok",
            "key": req.key
        })
    except:
        pe()
        return req.res({
            "kind": "proc",
            "subkind": "processstartfailed",
            "notify": "! fatal process start failed",
            "key": req.key
        })

def stopprocess(req):
    try:
        if req.key in processconsoles:
            pc = processconsoles[req.key]
            if pc.process:
                pc.stop()
                return req.res({
                    "kind": "proc",
                    "subkind": "processstopped",
                    "notify": "process being stopped",
                    "key": req.key
                })
            else:
                return req.res({
                    "kind": "proc",
                    "subkind": "processalreadystopped",
                    "notify": "! process already stopped",
                    "key": req.key
                })
        else:
            return req.res({
                "kind": "proc",
                "subkind": "nosuchprocess",
                "notify": "! no such process",
                "key": req.key
            })
    except:
        pe()
        return req.res({
            "kind": "proc",
            "subkind": "processsstopfailed",
            "notify": "! fatal process stop failed",
            "key": req.key
        })

def sendline(req):
    try:
        if req.key in processconsoles:
            pc = processconsoles[req.key]                        
            if pc.process:
                pc.process.send_line(req.sline)
                return req.res({
                    "kind": "proc",
                    "subkind": "linesent",
                    "sline": req.sline,
                    "key": req.key
                })
        plusargs = shlex.split(req.sline)
        req.reqobj["command_args"] += plusargs
        pc = ProcessConsole(req.reqobj)
        pc.start()
        return req.res({
            "kind": "proc",
            "subkind": "processstarted",
            "notify": "process started ok with plus args {}".format(plusargs),
            "key": req.key
        })
    except:
        pe()
        return req.res({
            "kind": "proc",
            "subkind": "sendlinefailed",
            "notify": "! fatal send line failed",
            "key": req.key
        })

#########################################################

def storedb(req):
    try:        
        if req.noadmin():
            return req.res({
                "kind": "storedbfailed",
                "status": "not authorized"
            })
        db.reference(req.path).set(req.dataobj)
        return req.res({
            "kind": "storedb",
            "path": req.path,
            "size": len(json.dumps(req.dataobj))
        })
    except:
        #pe()
        return req.res({
            "kind": "storedbfailed"
        })

def storeposinfo(req):
    try:
        db.reference(req.path).set(req.dataobj)
        return req.res({
            "kind": "storeposinfo",
            "path": req.path,
            "size": len(json.dumps(req.dataobj))
        })
    except:
        #pe()
        return req.res({
            "kind": "storeposinfofailed"
        })

def retrievedb(req):
    try:                    
        data = db.reference(req.path).get()
        return req.res({            
            "kind": "retrievedb",
            "dataobj": data,
            "path": req.path
        })
    except:
        #pe()
        return req.res({
            "kind": "retrievedbfailed"
        })    

def mainboardsetvariant(req):
    try:        
        board = get_variant_board(req.variantkey)                      
        if req.variantkey == "chess960":
            board.set_chess960_pos(random.randint(0, 959))
        if req.fen:
            board.set_fen(req.fen)
        resobj = {
            "kind": "setmainboardfen",
            "fen": board.fen(),
            "status": "main board variant selected ok"
        }
        addpositioninfo(board, resobj, "reset")
        return req.res(resobj)
    except:
        pe()
        return req.res({
            "kind": "setmainboardfenfailed",
            "status": "! main board variant selection failed"
        })        

def mainboardmove(req):
    try:                                  
        move = chess.Move.from_uci(req.moveuci)
        board = get_variant_board(req.variantkey)
        board.set_fen(req.fen)
        if board.is_legal(move):
            genboard = board.copy()
            board.push(move)
            resobj = {
                "kind": "setmainboardfen",
                "fen": board.fen(),
                "status": "making main board move ok"
            }            
            addpositioninfo(board, resobj, move, genboard)
            return req.res(resobj)
        else:
            resobj = {
                "kind": "setmainboardfen",
                "fen": req.fen,
                "status": "! making main board move failed, illegal move"
            }                        
            addpositioninfo(board, resobj)
            return req.res(resobj)
    except:
        pe()
        return req.res({
            "kind": "mainboardmovefailed",
            "status": "! making main board move failed, fatal"
        })

def forumgamemove(req):
    try:                                  
        move = chess.Move.from_uci(req.moveuci)
        board = get_variant_board(req.variantkey)
        board.set_fen(req.fen)
        if board.is_legal(move):
            genboard = board.copy()
            board.push(move)
            resobj = {
                "kind": "setforumgamefen",
                "fen": board.fen(),
                "status": "making forum game board move ok"
            }            
            addpositioninfo(board, resobj, move, genboard)
            return req.res(resobj)
        else:
            return req.res({
                "kind": "forumgamemovefailed",
                "status": "! making forum game move failed, fatal"
            })
    except:
        pe()
        return req.res({
            "kind": "forumgamemovefailed",
            "status": "! making forum game move failed, fatal"
        })

def parsepgn(req):    
    try:        
        historyobj , status = createhistory(req.data)
        return req.res({
            "kind": "parsepgndone",
            "historyobj": historyobj,
            "status": status
        })
    except:                            
        pe()
        return req.res({
            "kind": "parsepgnfailed",
            "status": "! parse pgn failed"
        })

def analyze(req):
    global engineprocess
    try:
        if req.noadmin():
            return req.res({
                "kind": "analyzefailed",
                "status": "not authorized"
            })
        if engineprocess is None:
            #print("creating engine process")
            engineprocess = EngineProcess(req.owner, req.uid)        
        engineprocess.analyze(req.variantkey, req.multipv, req.fen)
        return req.res({
            "kind": "analyzestarted"
        })
    except:
        pe()
        return req.res({
            "kind": "analyzefailed"
        })

def stopanalyze(req):
    global engineprocess
    try:
        if req.noadmin():
            return req.res({
                "kind": "stopanalyzefailed",
                "status": "not authorized"
            })
        engineprocess.stopanalyze()
        return req.res({
            "kind": "analyzestopped"
        })
    except:
        return req.res({
            "kind": "stopanalyzefailed"
        })

def createnewengine(req):
    global engineprocess
    try:
        if req.noadmin():
            return req.res({
                "kind": "enginecreationfailed",
                "status": "not authorized"
            })
        if not ( engineprocess is None ):
            engineprocess.process.kill()
        engineprocess = EngineProcess(req.owner, req.uid)        
        return req.res({
            "kind": "enginecreated"
        })
    except:
        pe()
        return req.res({
            "kind": "enginecreationfailed"
        })

def killengine(req):
    global engineprocess
    try:
        if req.noadmin():
            return req.res({
                "kind": "enginekillfailed",
                "status": "not authorized"
            })
        if not ( engineprocess is None ):
            engineprocess.process.kill()        
            engineprocess = None
            return req.res({
                "kind": "enginekilled"
            })
        else:
            return req.res({
                "kind": "enginealreadykilled"
            })
    except:
        pe()
        return req.res({
            "kind": "enginekillfailed"
        })

def getbook(req):
    try:
        board = get_variant_board(req.variantkey)
        board.set_fen(req.fen)
        book_path = req.effpath()
        with open_reader(book_path) as reader:
            entries = reader.find_all(board, minimum_weight = 1)
            entries = sorted(entries, key = lambda entry: entry.weight, reverse = True)
            entrieslist = []
            for entry in entries:
                move = entry.move()
                uci = move.uci()
                san = board.san(move)
                weight = entry.weight
                entryobj = {
                    "uci": uci,
                    "san": san,
                    "weight": weight
                }
                entrieslist.append(entryobj)
            return req.res({
                "kind": "setbook",
                "variantkey": req.variantkey,
                "fen": req.fen,
                "entrieslist": entrieslist
            })
    except:
        #pe()
        return req.res({
            "kind": "getbookfailed"
        })

def addmovetobook(req):
    try:
        bookpath = req.effpath()
        moveuci = req.moveuci
        movesan = req.movesan
        weight = req.weight
        variantkey = req.variantkey
        fen = req.fen
        board = get_variant_board(variantkey)
        board.set_fen(fen)
        zobristkeyhex = get_zobrist_key_hex(board)
        print("add move to book", bookpath, fen, moveuci, zobristkeyhex)
        book = Book()
        book.merge_file(bookpath)
        pos = book.get_position(zobristkeyhex)        
        bm = pos.get_move(moveuci)
        bm.move = chess.Move.from_uci(moveuci)
        bm.weight = weight
        book.save_as_polyglot(bookpath)
        return req.res({
            "kind": "addmovetobookok",
            "moveuci": moveuci,
            "movesan": movesan,
            "numpositions": book.numpositions,
            "nummoves": book.nummoves
        })
    except:
        pe()
        return req.res({
            "kind": "addmovetobookfailed"
        })

def getmybots(req):
    global BOT_PROFILES
    try:
        botprofiles = getdbelse("BOT_PROFILES", BOT_PROFILES)        
        return req.res({
            "kind": "mybots",
            "mybots": botprofiles
        })
    except:
        pe()
        return req.res({
            "kind": "getmybotsfailed"
        })

def getstoredtitled(req):
    global storedtitled, onlinestatus
    try:
        if req.dolog:                    
            publish({
                "kind": "dolog",
                "msg": req.msg,
                "referer": req.referer,
                "ip": req.ip
            })
        return req.res({
            "kind": "storedtitled",
            "storedtitled": storedtitled,
            "onlinestatus": onlinestatus
        })
    except:
        pe()
        return req.res({
            "kind": "getstoredtitledfailed"
        })

def getlogs(req):
    try:                
        logs = db.reference("logs").get()
        if not logs:
            logs = []
        return req.res({
            "kind": "logs",
            "logs": logs
        })
    except:
        pe()
        return req.res({
            "kind": "getlogsfailed"
        })        

def updateappstate(req):
    global appstate
    try:
        appstate = getdbelse("appstate", defaultappstate())
        if req.doupdate:
            appstate.update(req.appstateupdate)
            db.reference("appstate").set(appstate)
        return req.res({
            "kind": "updateappstatedone",
            "appstate": appstate
        })
    except:
        pe()
        return req.res({
            "kind": "updateappstatefailed"
        }) 

#########################################################

def dopublish(req):
    publish(req.publishobj)

#########################################################

def serverlogic(reqobj):    
    req = Req(reqobj)
    if req.kind:
        try:
            return eval("{}(req)".format(req.kind))
        except:
            pe()
            return({
                "kind": "servererror"
            })
    return({
        "kind": "unknownrequest"
    })

#########################################################

#########################################################
# startup

def onlinestatusthread():
    global onlinestatus
    if os.environ.get("NOONLINE", False):
        print("no online status")
        return
    time.sleep(3)
    while True:        
        try:
            #print("getting online status")
            getonlinestartedat = time.time()
            players = geturlndjson("https://lichess.org/api/users/titled?titles=BOT,GM,WGM,IM,WIM,FM,WFM,CM,WCM,NM,WNM,LM&online=true")                
            #print("total online {}, took {:.2f} sec(s)".format(len(players), time.time() - getonlinestartedat))
            ol = []
            for player in players:
                id = player.get("id", None)
                if id:
                    ol.append(id)
            onlinestatus = ol                    
        except:
            print("problem getting online status")
        time.sleep(1)

def gettitledthread():
    global storedtitled
    if os.environ.get("NOTITLED", False):
        print("no titled")
        return
    storedtitled = db.reference("titled").get()
    if storedtitled:
        print("stored titled {}".format(len(storedtitled)))
    else:
        storedtitled = []
        print("no stored titled")
    while True:        
        titled = []
        if IS_PROD() or False:
            print("getting titled")
            try:
                #players = geturlndjson("https://lichess.org/team/{}/users".format("lichess-bots"))
                players = geturlndjson("https://lichess.org/api/users/titled?titles=BOT,GM,WGM,IM,WIM,FM,WFM,CM,WCM,NM,WNM,LM")                
                titlecnt = {}
                for player in players:
                    if "title" in player:
                        title = player["title"]            
                        id = player.get("id", None)
                        player["username"] = player.get("name", id)
                        for i in range(len(storedtitled)):
                            playeri = storedtitled[i]
                            idi = playeri.get("id", None)
                            if idi:
                                if id == idi:
                                    #print("updating player {}".format(id))
                                    player["nbFollowers"] = playeri.get("nbFollowers", 0)
                                    player["createdAt"] = playeri.get("createdAt", 0)
                                    player["totalgames"] = playeri.get("totalgames", 0)
                                    player["online"] = playeri.get("online", False)
                                    player["perfs"] = playeri.get("perfs", {})
                        titled.append(player)
                        if title in titlecnt:
                            titlecnt[title] += 1
                        else:
                            titlecnt[title] = 1        
                print("num titled {} size {} counts {}".format(len(titled), len(json.dumps(titled)), titlecnt))
            except:
                print("could not get players, falling back to stored data")            
        if len(titled)>0:
            db.reference("titled").set(titled)        
            storedtitled = titled
        titled = storedtitled
        random.shuffle(titled)
        storecnt = 0
        totalqueried = 0
        querystartedat = int(time.time())
        for player in titled:
            id = player["id"]
            #print("refreshing {} {}".format(player.get("title", "BOT"), id))
            try:            
                profiledata = geturljson("https://lichess.org/api/user/{}".format(id))            
                profile = Profile(profiledata)
                followers = profile.nbFollowers
                createdAt = profile.createdAt
                totalgames = profile.count.all
                online = profile.online
                player["nbFollowers"] = followers
                player["createdAt"] = createdAt
                player["totalgames"] = totalgames
                player["online"] = online
                player["perfs"] = profiledata.get("perfs", {})
                #print("followers {} total games {}".format(followers, totalgames))
                storecnt += 1
                totalqueried += 1
                elapsed = int(time.time() - querystartedat)                
                queryrate = elapsed / totalqueried
                esttotaltime = queryrate * len(titled) / 60
                #print("total players queried {} in {} sec(s), query rate {:.2f} sec/player, estimated total time {:.0f} min(s)".format(totalqueried, elapsed, queryrate, esttotaltime))
                if storecnt >= 100:
                    #print("storing players in database")
                    db.reference("titled").set(titled)
                    #print("storing players done")
                    storecnt = 0
                if ( totalqueried % 10 ) == 0:
                    publish({
                        "kind": "updateappstate",
                        "appstateupdate": {
                            "totalqueried": totalqueried,
                            "queryrate": "{:.2f}".format(queryrate)
                        }
                    })
                storedtitled = titled
                if elapsed < 2:
                    sleep(1)
            except:
                print("could not refresh profile", id)
                #pe()
                time.sleep(1)
        print("all players refreshed")
        db.reference("titled").set(titled)
        time.sleep(60)

def mainthread():
    print("serverlogic mainthread starting")
    while True:        
        try:
            mybots = geturljson("https://lichess.org/api/users/status?ids={}".format(",".join(MY_BOT_IDS)))
            for mybot in mybots:
                id = mybot["id"]
                online = mybot.get("online", False)
                botprofile = geturljson("https://lichess.org/api/user/{}".format(id))
                lastgame = geturlndjson("https://lichess.org/api/games/user/{}?max=1".format(id))[0]
                lastmoveat = lastgame["lastMoveAt"]
                lastmoveago = "{:.3f}".format(( time.time() * 1000 - lastmoveat ) / 1000 / 3600)
                lastplayers = "{} - {}".format(lastgame["players"]["white"], lastgame["players"]["black"])                
                botprofile["lastmoveago"] = lastmoveago
                botprofile["lastplayers"] = lastplayers
                botprofile["lastgame"] = lastgame
                botprofile["online"] = online       
                botprofile["onlinestr"] = ["offline", "online"][int(online)]
                BOT_PROFILES[id] = botprofile                
                time.sleep(0.25)
            #print("storing bots")
            for id, botprofile in BOT_PROFILES.items():
                print("{}{:15} : f {:>4} , o {:d} , g {:>6}{}".format(ANSI_BRIGHTBLUE, id, botprofile["nbFollowers"], online, botprofile["count"]["all"], ANSI_ENDC))
                pass            
            db.reference("BOT_PROFILES").set(BOT_PROFILES)
        except:
            print("problem getting my bots")
            pe()
        time.sleep(540)

def keepalivethread():
    keepalive = int(os.environ.get("KEEPALIVE", 0))
    print("keep alive period {}".format(keepalive))
    for i in range(keepalive * 6):
        print("keep alive cycle {}".format(i))
        try:            
            geturl("{}/tos".format(SERVER_URL()), verbose = False)
            print("keep alive done")
        except:
            print("could not get keep alive url")        
        time.sleep(600)
        if shouldsleep():
            print("should sleep")
            return
    print("keep alive terminated")

def tickthread():
    if os.environ.get("NOTICK", False):
        print("no tick")
        return
    while True:
        publish({
            "kind": "updateappstate",
            "appstateupdate": {
                "lastticktime": time.time()
            }
        })
        time.sleep(30)
#########################################################

#########################################################
# process published
def processpublishedtarget():
    global publishqueue
    while True:
        reqobj = publishqueue.get()
        serverlogic(reqobj)

Thread(target = processpublishedtarget).start()
#########################################################

#########################################################
# app state startup
if IS_PROD():
    db.reference("appstate").set(defaultappstate())
#########################################################

#########################################################
# threads startup
if IS_PROD() or True:
    Thread(target = mainthread).start()

if IS_PROD() or False:
    Thread(target = gettitledthread).start()

if IS_PROD() or False:
    Thread(target = onlinestatusthread).start()

if IS_PROD():
    Thread(target = keepalivethread).start()

if IS_PROD():
    Thread(target = tickthread).start()
#########################################################
