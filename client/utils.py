######################################################
# utils 

def MODE():
    if "localhost" in window.location.host:
        return "dev"
    return "prod"

def IS_DEV():
    return MODE() == "dev"

def IS_PROD():
    return MODE() == "prod"

def effpath(path):
    return path + ":" + MODE()

######################################################

queryparams = {}

try:
    querystring = window.location.search.slice(1)

    qsparts = querystring.split("&")

    for part in qsparts:
        subparts = part.split("=")
        queryparams[subparts[0]] = subparts[1]
except:
    print("could not parse query string")

print("queryparams", queryparams)

######################################################

#https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
seed = 1
def random():
    global seed
    seed += 1
    x = Math.sin(seed) * 10000
    return x - Math.floor(x)

def setseed(newseed):
    global seed
    seed = newseed

######################################################
# chess

MATE_SCORE = 10000
MATE_LIMIT = MATE_SCORE * 0.9
WINNING_MOVE_LIMIT = 1000
DOUBLE_EXCLAM_LIMIT = 500
EXCLAM_LIMIT = 350
PROMISING_LIMIT = 250
INTERESTING_LIMIT = 150
DRAWISH_LIMIT = 80

def scoreverbal(score):
    if abs(score) < MATE_LIMIT:
        return str(score)
    if score >= 0:
        return "#{}".format(MATE_SCORE - score)
    return "#{}".format(- MATE_SCORE - score)

def scorecolor(score):
    if score > MATE_LIMIT:
        return "#0f0"
    if score > WINNING_MOVE_LIMIT:
        return "#0e0"
    if score > DOUBLE_EXCLAM_LIMIT:
        return "#0c0"
    if score > EXCLAM_LIMIT:
        return "#0a0"
    if score > PROMISING_LIMIT:
        return "#090"
    if score > INTERESTING_LIMIT:
        return "#070"
    if score > DRAWISH_LIMIT:
        return "#050"
    if score > 0:
        return "#033"
    if score > (-DRAWISH_LIMIT):
        return "#330"
    if score > (-INTERESTING_LIMIT):
        return "#500"
    if score > (-PROMISING_LIMIT):
        return "#900"
    if score > (-EXCLAM_LIMIT):
        return "#a00"
    if score > (-DOUBLE_EXCLAM_LIMIT):
        return "#c00"
    if score > WINNING_MOVE_LIMIT:
        return "#e00"
    return "#f00"

def uci_variant_to_variantkey(uci_variant, chess960 = False):
    if uci_variant == "chess":
        if chess960:
            return "chess960"
        else:
            return "standard"
    if uci_variant == "giveaway":
        return "antichess"
    if uci_variant == "kingofthehill":
        return "kingOfTheHill"
    if uci_variant == "racingkings":
        return "racingKings"
    if uci_variant == "3check":
        return "threeCheck"
    return uci_variant

######################################################

######################################################
# css

def getglobalcssvar(key):
    return getComputedStyle(window.document.documentElement).getPropertyValue(key)

def getglobalcssvarpxint(key, default):
    try:
        px = getglobalcssvar(key)
        pxint = int(px.replace("px",""))
        return pxint
    except:
        return default

######################################################

######################################################
# classes

class View:
    def __init__(self, callback, value = None):
        self.callback = callback
        self.value = value

    def get(self):
        return self.value

    def set(self, value):
        self.value = value
        self.callback()

class Vect:
    def __init__(self, x, y):
        try:
            self.x = float(x)
            self.y = float(y)
        except:
            self.x = 0.0
            self.y = 0.0
            print("vect init failed on", x, y)

    def p(self, v):
        return Vect(self.x + v.x, self.y + v.y)

    def s(self, s):
        return Vect(self.x * s, self.y * s)

    def m(self, v):
        return self.p(v.s(-1))

    def l(self):
        return Math.sqrt(self.x*self.x + self.y*self.y)
    
    def copy(self):
        return Vect(self.x, self.y)

    def __repr__(self):
        return "Vect[x: {}, y: {}]".format(self.x, self.y)

######################################################

######################################################
# date

def dateToDateInputStr(dateObj):
	month = dateObj.getUTCMonth() + 1
	day = dateObj.getUTCDate()
	year = dateObj.getUTCFullYear()
	return "{}-{}-{}".format(year, pad(month, 2), pad(day, 2))

def dateInputStrToDate(dateInputStr):
	parts = dateInputStr.split("-")
	year = parseInt(parts[0])
	month = parseInt(parts[1]) - 1
	day = parseInt(parts[2])
	return __new__(Date(year, month, day))

######################################################

######################################################
# misc

def xor(b1, b2):
    if b1 and b2:
        return False
    if b1 or b2:
        return True
    return False

def pad(x, p):
    s = "{}".format(x)
    while len(s) < p:
        s = "0" + s
    return s

def texttofloat(text, default):
    try:
        f = float(text)            
    except:
        f = default
    if f == None:
        return default
    return f

def allchilds(node, childs = []):    
    child = node.firstChild
    while not ( typeof(child) == "undefined" ):
        if child:
            childs.append(child)
            childs = allchilds(child, childs)
            child = child.nextSibling
        else:
            break
    return childs

def getext(dir):
    parts = dir.split(".")
    return parts[len(parts) - 1]

def escapeHTML(html):
    return html.replace("&",'&amp;').replace("<",'&lt;').replace(">",'&gt;').replace("\n", "<br>")

def getrec(path, currobj, default = None):
    parts = path.split("/")
    key = parts[0]
    if currobj["disposition"] == "dict":
        for child in currobj["childsarg"]:
            if child["key"] == key:
                if len(parts) == 1:
                    return child["value"]
                else:
                    return getrec("/".join(parts[1:]), child, default)
    return default

def getrecm(path, obj, default):
    value = getrec(path, obj, "__none__")    
    if value is "__none__":
        return getrec(effpath(path), obj, default)
    else:
        return value

def getitem(obj, key, default):
    if key in obj:
        return obj[key]
    return default

def cpick(cond, valuetrue, valuefalse):
    if cond:
        return valuetrue
    return valuefalse

def getelse(value, elsevalue):
    if value:
        return value
    return elsevalue

def ce(tag):
    return document.createElement(tag)

def ge(id):
    return document.getElementById(id)

# https://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
def getScrollBarWidth():
    outer = document.createElement("div")
    outer.style.visibility = "hidden"
    outer.style.width = "100px"
    outer.style.msOverflowStyle = "scrollbar" # needed for WinJS apps

    document.body.appendChild(outer)

    widthNoScroll = outer.offsetWidth
    # force scrollbars
    outer.style.overflow = "scroll"

    # add innerdiv
    inner = document.createElement("div")
    inner.style.width = "100%"
    outer.appendChild(inner)       

    widthWithScroll = inner.offsetWidth

    # remove divs
    outer.parentNode.removeChild(outer)

    return widthNoScroll - widthWithScroll

######################################################
