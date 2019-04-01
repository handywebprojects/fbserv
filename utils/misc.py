import os
import yaml
import json
import stat
import certifi
import urllib3
import sys
from traceback import print_exc
import io
import random
import codecs

#############################################

import chess
from chess.variant import find_variant
from chess.pgn import read_game
from cbuild.book import get_zobrist_key_hex

#############################################

MATE_SCORE = 10000
MATE_LIMIT = MATE_SCORE * 0.9

def get_score_numerical(score):
    cp = score[0]
    mate = score[1]
    if cp == None:
        if mate > 0:
            return MATE_SCORE - mate
        else:
            return -MATE_SCORE - mate
    if cp > MATE_LIMIT:
        cp = MATE_LIMIT
    elif cp < (-MATE_LIMIT):
        cp = (-MATE_LIMIT)
    return cp

def get_variant_board(variantkey):
    if variantkey == "standard":
        return chess.Board()
    elif variantkey == "chess960":
        return chess.Board(chess960=True)
    elif variantkey == "fromPosition":
        return chess.Board()
    else:
        VariantBoard = find_variant(variantkey)
        return VariantBoard()

def addpositioninfo(board, obj, genmove = None, genboard = None):
    moves = board.generate_legal_moves()
    movelist = []
    for move in moves:
        movelist.append({
            "uci": move.uci(),
            "san": board.san(move)
        })
    movelist = sorted(movelist, key = lambda move: move["san"])
    obj["positioninfo"] = {
        "movelist": movelist,
        "zobristkeyhex": get_zobrist_key_hex(board)
    }
    if genmove == "reset":
        obj["positioninfo"]["genmove"] = "reset"
    elif not ( genmove is None ):        
        obj["positioninfo"]["genmove"] = {
            "uci": genmove.uci(),
            "san": genboard.san(genmove)
        }

def createhistory(pgn):
    historyobj = None
    try:    
        pgnio = io.StringIO(pgn)
        game = read_game(pgnio)
        board = game.board()
        positioninfos = []
        pinfo = {
            "fen": board.fen()
        }
        addpositioninfo(board, pinfo)
        positioninfos.append(pinfo)
        for move in game.main_line():
            genboard = board.copy()
            board.push(move)
            pinfo = {
                "fen": board.fen()
            }
            addpositioninfo(board, pinfo, move, genboard)
            positioninfos.append(pinfo)
        historyobj = {            
            "positioninfos": positioninfos,
            "pgn": pgn,
            "uci_variant": board.uci_variant,
            "chess960": board.chess960
        }
        return ( historyobj , "game history created ok" )
    except:
        print_exc(file=sys.stderr)
        return ( None , "! create game history failed" )

###################################################
# http
http = urllib3.PoolManager(
    cert_reqs='CERT_REQUIRED',
    ca_certs=certifi.where()
)

def geturl(url, verbose = True, headers = {}):
    if(verbose):
        print("get url", url, headers)    
    r = http.request("GET", url, headers = headers)
    content = r.data.decode("utf-8")
    return content

def posturl(url, verbose = False, headers = {}, fields = {}):
    if(verbose):
        print("post url", url, headers)    
    r = http.request("POST", url, headers = headers, fields = fields)
    content = r.data.decode("utf-8")
    return content

def posturlbody(url, verbose = False, headers = {}, body = ""):
    if(verbose):
        print("post url", url, headers)    
    r = http.request("POST", url, headers = headers, body = body)
    content = r.data.decode("utf-8")
    return content

def geturljson(url, verbose = False, headers = {}):
    content = geturl(url, verbose, headers)        
    return json.loads(content)

def geturlndjson(url, verbose = False):
    content = geturl(url, verbose, {"Accept": "application/x-ndjson"})    
    list = []
    for line in content.split("\n"):
        try:
            list.append(json.loads(line))
        except:
            pass
    return list

def postjson(url, obj):
    #print("post json", url, obj)
    try:
        r = http.request('POST', url, headers = {'Content-Type': 'application/json'}, body = json.dumps(obj))
        content = r.data.decode("utf-8")
        #print("response", content)
        return content
    except:
        print_exc(file = sys.stderr)
        return None

def postjsonjson(url, obj):
    try:
        resobj = json.loads(postjson(url, obj))
        return resobj
    except:
        return None
###################################################

###################################################
# schema

class Schema:
    def __init__(self):
        self.value = None

class SchemaString(Schema):
    def __init__(self, value):
        self.value = value

    def toargs(self):
        return {
            "kind": "scalar",
            "disposition": "string",
            "value": self.value
        }

    def quoted(self):
        return "SchemaString(\"{}\")".format(self.value)

class SchemaCheckbox(Schema):
    def __init__(self, value):
        self.value = value

    def toargs(self):
        return {
            "kind": "scalar",
            "disposition": "checkbox",
            "value": self.value
        }

    def quoted(self):
        return "SchemaCheckbox({})".format(self.value)

class SchemaSlider(Schema):
    def __init__(self, value, min, max, step):
        self.value = value
        self.min = min
        self.max = max
        self.step = step

    def toargs(self):
        return {
            "kind": "scalar",
            "disposition": "slider",
            "value": self.value,
            "minvalue": self.min,
            "maxvalue": self.max,
            "valuestep": self.step
        }

    def quoted(self):
        return "SchemaSlider({}, {}, {}, {})".format(self.value, self.min, self.max, self.step)


def getschemapath(schobj, path, defaultsch):
    if not ( ( type(schobj) == dict ) and ( type(path) == str ) ):
        print("! getschemapath invalid argument type {} {} {}".format(type(schobj), type(path), type(defaultsch)))
        return None
    parts = path.split("/")
    key = parts[0]
    if "disposition" in schobj:
        if schobj["disposition"] == "dict":
            if "childsarg" in schobj:
                childsarg = schobj["childsarg"]
            else:
                childsarg = []
            for childobj in childsarg:
                if childobj["key"] == key:
                    if len(parts) == 1:
                        return childobj
                    else:
                        return getschemapath(childobj, "/".join(parts[1:]), defaultsch)
    if len(parts) == 1:
        childobj = defaultsch.toargs()
        childobj["key"] = key
    else:        
        childobj = {
            "kind": "collection",
            "disposition": "dict",
            "key": key
        }
    if "childsarg" in schobj:
        schobj["childsarg"].append(childobj)
    else:
        schobj["childsarg"] = [ childobj ]
    if len(parts) == 1:
        return childobj
    return getschemapath(childobj, "/".join(parts[1:]), defaultsch)

def getschemavalue(schobj, path, defaultsch):
    foundschobj = getschemapath(schobj, path, defaultsch)
    if not foundschobj:
        return defaultsch.value
    if "kind" in foundschobj:
        if foundschobj["kind"] == "scalar":
            value = foundschobj["value"]
            if value is None:                
                return defaultsch.value
            return value
    return defaultsch.value

###################################################

###################################################
# misc

def cpick(cond, valuetrue, valuefalse):
    if cond:
        return valuetrue
    return valuefalse

def randurl():
    return random.randint(1e9,1e10)

###################################################

###################################################
# ANSI

ANSI = {
    "NONE" : "",

    "BLACK" : '\033[30m',
    "RED" : '\033[31m', 
    "GREEN" : '\033[32m',
    "YELLOW" : '\033[33m',
    "BLUE" : '\033[34m',
    "MAGENTA" : '\033[35m',
    "CYAN" : '\033[36m',
    "WHITE" : '\033[37m',
    "BRIGHTBLACK" : '\033[90m',
    "BRIGHTRED" : '\033[91m',
    "BRIGHTGREEN" : '\033[92m',
    "BRIGHTYELLOW" : '\033[93m',
    "BRIGHTBLUE" : '\033[94m',
    "BRIGHTMAGENTA" : '\033[95m',
    "BRIGHTCYAN" : '\033[96m',
    "BRIGHTWHITE" : '\033[97m',
        
    "ENDC" : '\033[0m',

    "BOLD" : '\033[1m',
    "UNDERLINE" : '\033[4m'
}

def GETANSI(a):
    if a in ANSI:
        return ANSI[a]
    return None

ANSI_BLACK = ANSI["BLACK"]
ANSI_RED = ANSI["RED"]
ANSI_GREEN = ANSI["GREEN"]
ANSI_YELLOW = ANSI["YELLOW"]
ANSI_BLUE = ANSI["BLUE"]
ANSI_MAGENTA = ANSI["MAGENTA"]
ANSI_CYAN = ANSI["CYAN"]
ANSI_WHITE = ANSI["WHITE"]
ANSI_BRIGHTBLACK = ANSI["BRIGHTBLACK"]
ANSI_BRIGHTRED = ANSI["BRIGHTRED"]
ANSI_BRIGHTGREEN = ANSI["BRIGHTGREEN"]
ANSI_BRIGHTYELLOW = ANSI["BRIGHTYELLOW"]
ANSI_BRIGHTBLUE = ANSI["BRIGHTBLUE"]
ANSI_BRIGHTMAGENTA = ANSI["BRIGHTMAGENTA"]
ANSI_BRIGHTCYAN = ANSI["BRIGHTCYAN"]
ANSI_BRIGHTWHITE = ANSI["BRIGHTWHITE"]

ANSI_ENDC = ANSI["ENDC"]

ANSI_BOLD = ANSI["BOLD"]
ANSI_UNDERLINE = ANSI["UNDERLINE"]

###################################################

#############################################
# file utils

def firstbetween(content, left, right):
    if left == "":
        parts = [None, content]
    else:
        parts = content.split(left)
    if(len(parts) > 1):
        parts = parts[1].split(right)
        return parts[0]
    else:
        return None

def issubpathofpath(subpath, path):
    subpathreal = os.path.realpath(subpath)
    pathreal = os.path.realpath(path)
    common = os.path.commonpath([subpathreal, pathreal])
    return common == pathreal

def issubpathofpaths(subpath, paths):
    for testpath in paths:
        if issubpathofpath(subpath, testpath):
            return True
    return False

def write_string_to_file(path, content, verbose = False):
    with open(path,"wb") as outfile:
        outfile.write(content.encode("utf-8"))
    if verbose:
        print(f"written file { path } ( { len(str) } characters )")

def read_string_from_file(path, default):
	try:		
		content = codecs.open(path, encoding = "utf-8").read()
		return content
	except:
		print_exc()
		return default

def write_yaml_to_file(path, obj):
    yaml.dump(obj, open(path, "w"))

def read_yaml_from_file(path, default):
    try:
        obj = yaml.load(open(path))
        return obj
    except:
        return default

def write_json_to_file(path, obj, indent = 2):    
    json.dump(obj, open(path, "w"), indent = indent)
    
def read_json_from_file(path, default):
    try:
        obj = json.load(open(path))
        return obj
    except:
        return default

def os_stats_as_dict(stats, name, isdir):
    parts = name.split(".")
    ext = parts[-1]
    basename = name
    if len(parts) > 1:
        basename = ".".join(parts[:-1])
    return {
        "name": name,
        "basename": basename,
        "ext": ext,
        "isdir": isdir,
        "st_mode": stats.st_mode,
        "st_mode_unix_rwx": stat.filemode(stats.st_mode),
        "st_ino": stats.st_ino,
        "st_dev": stats.st_dev,
        "st_nlink": stats.st_nlink,
        "st_uid": stats.st_uid,
        "st_gid": stats.st_gid,
        "st_size": stats.st_size,
        "st_atime": stats.st_atime,
        "st_mtime": stats.st_mtime,
        "st_ctime": stats.st_ctime
    }

def dir_listing_as_list(path):
    try:
        listing = []
        for name in os.listdir(path):            
            currpath = os.path.join(path, name)
            stats = os.stat(currpath)
            isdir = os.path.isdir(currpath)
            listing.append(os_stats_as_dict(stats, name, isdir))
        return listing
    except:
        return []

def dir_listing_as_dict(path):
    listing = dir_listing_as_list(path)
    dictionary = {}
    for item in listing:
        dictionary[item["name"]] = item
    return dictionary

def getlastmod(path):
    try:
        stats = os.stat(path)
        mtime = stats.st_mtime
        return mtime
    except:
        return 0

#############################################
