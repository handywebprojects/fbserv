from dom import e, Div, TextInput, Button, TextArea
from basicboard import BasicBoard
from connection import getconn
from utils import queryparams, random, setseed

mainseed = 80

class Forumnode(e):
    def __init__(self, root, args = {}):
        super().__init__("div")                
        self.root = root
        self.move = args["move"]
        self.uci = args["uci"]
        self.comment = args["comment"]
        if not self.comment:
            self.comment = ""
        self.owner = args["owner"]
        self.fen = args["fen"]
        self.parent = args["parent"]
        self.isadmin = args["isadmin"]
        self.halfmoveno = args["halfmoveno"]
        if not self.halfmoveno:
            self.halfmoveno = -1
        self.childs = []
        self.build()

    def toobj(self):
        moveobjs = {}
        for child in self.childs:
            moveobjs[child.move] = child.toobj()
        return {            
            "uci": self.uci,
            "comment": self.comment,
            "owner": self.owner,
            "fen": self.fen,
            "moves": moveobjs
        }

    def appendchild(self, node):
        node.halfmoveno = self.halfmoveno + 1        
        node.build()
        self.childs.append(node)        
        self.containerdiv.a(node)
        if len(self.childs) > 1:
            rgb = "rgb({},{},{})".format(int(random()*128 + 127),int(random()*128 + 127),int(random()*128 + 127))            
            self.containerdiv.bc(rgb).bds("solid").bdw(10).bdr(20).bdc(rgb)

    def addnode(self):
        input = window.prompt("Move:uci:owner:fen", "")
        if input:
            self.root.shift()
            parts = input.split(":")            
            self.appendchild(Forumnode(self.root, {
                "move": parts[0],
                "uci": None,
                "comment": "",
                "uci": parts[0],
                "owner": parts[2],
                "fen": parts[2],
                "parent": self,
                "isadmin": self.isadmin                
            }))
            self.root.parse()

    def edituci(self):
        input = window.prompt("Uci", "")
        if input:
            self.uci = input
            self.setboard()
            self.ucidiv.html(self.uci)
            self.root.parse()

    def editfen(self):
        input = window.prompt("Fen", "")
        if input:
            self.fen = input
            self.setboard()            
            self.root.parse()

    def setmovelabel(self):
        if self.halfmoveno < 0:
            moveno = ""
        elif ( self.halfmoveno % 2 ) == 0:
            moveno = ( ( self.halfmoveno + 2 ) / 2 ) + ". "
        else:
            moveno = ( ( self.halfmoveno + 1 ) / 2 ) + ".. "
        self.movelabeldiv.html("{}{}".format(moveno, self.move))

    def editsan(self):
        input = window.prompt("San", "")
        if input:
            self.move = input            
            self.setmovelabel()
            self.root.parse()

    def editcomment(self):
        input = window.prompt("Comment", self.comment)
        if input:
            self.comment = input            
            self.commentdiv.html(self.comment)
            self.root.parse()

    def editowner(self):
        input = window.prompt("Owner", "")
        if input:
            self.owner = input            
            self.ownerdiv.html(self.owner)
            self.root.parse()

    def movecallback(self, variantkey, fen, uci):
        if self.reqfenunderway:
            print("a fen request is in progress, cannot start a new one")
            return
        self.root.shift()
        self.root.reqfenunderway = True
        self.root.reqnode = self
        getconn().sioreq({
            "kind": "forumgamemove",                        
            "owner": "forumgame",
            "moveuci": uci,
            "variantkey": variantkey,
            "fen": fen
        })

    def bbdragstart(self, ev):        
        ev.stopPropagation()                

    def setboard(self):        
        initobj = {
            "fen": self.fen,
            "squaresize": 20,
            "showfen": False,
            "movecallback": self.movecallback,
            "variantkey": "atomic"
        }
        if self.uci:
            initobj["positioninfo"] = {
                "genmove": {
                    "uci": self.uci
                }
            }
        b = BasicBoard(initobj)        
        b.cp().ae("dragstart", self.bbdragstart)
        self.boarddiv.x().a(b)

    def analyzelocal(self):        
        try:
            self.root.mainboard.variantchanged("atomic", self.fen)
            self.root.parenttabpane.selectbykey("board")
        except:
            pass

    def analyzelichess(self):
        window.open("https://lichess.org/analysis/atomic/" + self.fen, "_blank")

    def delchilds(self):
        self.childs = []
        self.root.rebuild(mainseed)

    def delme(self):
        parent = self.parent
        if parent:
            newchilds = []
            for child in parent.childs:
                print("child", child.move, child.uci)
                if not ( child == self ):
                    newchilds.append(child)
            parent.childs = newchilds
            self.root.rebuild(mainseed)

    def serializefunc(self):
        self.root.rebuild(mainseed + 1)
        self.root.store()        

    def serialize(self):
        self.infohook.html("serializing")
        setTimeout(self.serializefunc, 100)        

    def copysrc(self):
        self.root.copysrc()
    
    def copylink(self):
        ti = TextInput()
        self.linktexthook.a(ti)        
        ti.setText("https://fbserv.herokuapp.com/analysis/atomic/" + self.fen.replace(" ", "%20"))
        ti.e.select()
        document.execCommand("copy")
        self.linktexthook.x()

    def build(self):        
        self.movediv = Div().disp("flex").fd("row").ai("center")
        self.movedescdiv = Div().bc("#eee").w(110).maw(110).pad(3)
        self.movelabeldiv = Div().fw("bold").pad(3).ff("monospace")
        self.setmovelabel()
        self.ownerdiv = Div().html(self.owner).ff("monospace").fs("10").c("#007")
        self.ucidiv = Div().ff("monospace").fs("12").pad(3)
        self.commentdiv = Div().fs("12").pad(5).html(self.comment)
        if self.uci:
            self.ucidiv.html(self.uci)
        self.movedescdiv.a([self.movelabeldiv, self.ownerdiv, self.commentdiv])                
        self.movedescdiv.a(Button("Analyze local", self.analyzelocal).mar(2))
        self.movedescdiv.a(Button("Analyze lichess", self.analyzelichess).mar(2))
        self.infohook = Div().ff("monospace").pad(3).c("#007").fw("bold").html("built")
        if self.isadmin:            
            self.movedescdiv.a(self.infohook)
            self.linktexthook = Div()
            self.movedescdiv.a(self.ucidiv)
            self.movedescdiv.a(Button("+", self.addnode).pad(5))
            self.movedescdiv.a(Button("san", self.editsan).pad(5))
            self.movedescdiv.a(Button("uci", self.edituci).pad(5))
            self.movedescdiv.a(Button("fen", self.editfen).pad(5))
            self.movedescdiv.a(Button("comment", self.editcomment).pad(5))
            self.movedescdiv.a(Button("owner", self.editowner).pad(5))
            self.movedescdiv.a(Button("serialize", self.serialize).pad(5).bc("#ffa"))
            self.movedescdiv.a(Button("copy", self.copysrc).pad(5).bc("#afa"))
            self.movedescdiv.a(self.linktexthook)
            self.movedescdiv.a(Button("link", self.copylink).pad(5).bc("#aff"))
            self.movedescdiv.a(Button("delchilds", self.delchilds).pad(5).bc("#faa"))
            self.movedescdiv.a(Button("delme", self.delme).pad(5).bc("#faa"))
        self.boarddiv = Div().pad(2)
        self.movecontainerdiv = Div().disp("flex").fd("row").ai("center")
        self.movecontainerdiv.a([self.movedescdiv, self.boarddiv])
        self.containerdiv = Div().disp("flex").fd("column").ai("flex-start")        
        self.movediv.a([self.movecontainerdiv, self.containerdiv])        
        self.setboard()
        self.x().a(self.movediv)        
        self.mw(600)

class Forumgame(e):
    def __init__(self):
        super().__init__("div")                        
        self.messagediv = Div().disp("inline-block").pad(3).ff("monospace")
        self.contentdiv = Div()
        self.a([self.messagediv, self.contentdiv])
        self.reqfenunderway = False
        self.reqnode = None
        self.requestforumgame()        
        self.ae("mousemove", self.mousemove)
        self.ae("mouseup", self.mouseup)        
        self.ae("mouseleave", self.mouseleave)        

    def copysrc(self):
        self.textarea.e.select()
        document.execCommand("copy")
        window.alert("Copied source to clipboard, {} characters.".format(len(self.textarea.getText())))

    def mousemove(self, ev):        
        if self.dragunderway:            
            dx = ev.clientX - self.dragstartx
            dy = ev.clientY - self.dragstarty                                    
            self.parenttabpane.contentdiv.e.scrollTop = self.scrolltop + 20 * dy
            self.parenttabpane.contentdiv.e.scrollLeft = self.scrollleft + 20 * dx

    def mouseup(self, ev):           
        self.dragunderway = False

    def mouseleave(self, ev):    
        self.dragunderway = False

    def parse(self):
        obj = self.rootnode.toobj()
        text = JSON.stringify(obj, None, 2)
        self.textarea.setText(text)
        return text

    def store(self):
        self.parenttabpane.contentdiv.bc("#faa")
        self.messagediv.html("Parsing JSON")
        try:
            obj = JSON.parse(self.textarea.getText())
            self.messagediv.html("Storing JSON")
            getconn().sioreq({
                "kind": "setforumgame",                        
                "owner": "forumgame",
                "forumgame": obj
            })
        except:
            self.messagediv.html("Error: could not parse JSON")
            return        

    def requestforumgame(self):
        getconn().sioreq({
            "kind": "getforumgame",                        
            "owner": "forumgame"
        })

    def buildrec(self, parentnode, tree):                
        __pragma__("jsiter")
        if not tree["moves"]:
            return        
        for move in tree["moves"]:       
            moveobj = tree["moves"][move]            
            node = Forumnode(self, {
                "move": move,
                "uci": moveobj["uci"],
                "comment": moveobj["comment"],
                "owner": moveobj["owner"],
                "fen": moveobj["fen"],
                "parent": parentnode,
                "isadmin": self.isadmin                
            })
            parentnode.appendchild(node)
            self.buildrec(node, moveobj)
        __pragma__("nojsiter")

    def build(self, text, seed):
        setseed(seed)
        self.contentdiv.x().pad(3)        
        self.textarea = TextArea().w(1000).h(200)
        self.textarea.setText(text)        
        self.controlpanel = Div()
        self.controlpanel.a(Button("Store", self.store))                        
        if self.isadmin:
            self.contentdiv.a(self.textarea)
            self.contentdiv.a(self.controlpanel)
        self.rootnode = Forumnode(self, {
            "move": "startpos",
            "uci": None,
            "owner": "Wolfram_EP",
            "comment": "Forum game",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "parent": None,
            "isadmin": self.isadmin
        })
        self.contentdiv.a(self.rootnode)
        self.buildrec(self.rootnode, self.forumgame)
        #self.rootnode.e.scrollIntoView(True)        
        self.parenttabpane.setscroll()
        self.contentdiv.sa("draggable", True).cm().ae("dragstart", self.dragstart)        

    def dragstart(self, ev):
        ev.preventDefault()
        self.dragstartx = ev.clientX
        self.dragstarty = ev.clientY
        self.scrolltop = self.parenttabpane.contentdiv.e.scrollTop
        self.scrollleft = self.parenttabpane.contentdiv.e.scrollLeft
        self.dragunderway = True

    def rebuild(self, seed):
        text = self.parse()            
        self.forumgame = JSON.parse(text)
        self.build(text, seed)

    def shift(self):
        sl = self.parenttabpane.contentdiv.e.scrollLeft        
        self.parenttabpane.contentdiv.e.scrollLeft = sl + 300

    def siores(self, response):        
        if response["kind"] == "setforumgame":            
            self.forumgame = response["forumgame"]
            self.messagediv.html("Forumgame loaded")
            self.isadmin = response["isadmin"]
            if queryparams.get("noadmin", "false") == "true":                
                self.isadmin = False
            self.build(JSON.stringify(self.forumgame, None, 2), mainseed)
            self.parenttabpane.contentdiv.bc("#def")
        if response["kind"] == "setforumgamedone":
            self.messagediv.html("Stored, refreshing")
            self.requestforumgame()
        if response["kind"] == "setforumgamefen":                        
            posinfo = response["positioninfo"]
            fen = response["fen"]
            san = posinfo["genmove"]["san"]
            uci = posinfo["genmove"]["uci"]
            rp = self.reqnode.parent
            owner = None
            if rp:
                owner = rp.owner
            if not owner:
                owner = window.prompt("Owner", "?")
            if not owner:
                owner = "?"
            self.reqnode.appendchild(Forumnode(self, {
                "move": san,
                "uci": uci,
                "comment": "",
                "owner": owner,
                "fen": fen,
                "parent": self.reqnode,
                "isadmin": self.isadmin
            }))
            self.parse()