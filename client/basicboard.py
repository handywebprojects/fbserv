from dom import e, Div, TextInput, Canvas, TextArea, Slider, Table, Tr, Td, ComboBox
from utils import Vect, cpick, xor, scorecolor, scoreverbal
from connection import getconn

STANDARD_START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
ANTICHESS_START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1"
RACING_KINGS_START_FEN = "8/8/8/8/8/8/krbnNBRK/qrbnNBRQ w - - 0 1"
HORDE_START_FEN = "rnbqkbnr/pppppppp/8/1PP2PP1/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP w kq - 0 1"
THREE_CHECK_START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 3+3 0 1"
CRAZYHOUSE_START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR[] w KQkq - 0 1"

PIECE_KINDS = ["p", "n", "b", "r", "q", "k"]

WHITE = 1
BLACK = 0

VARIANT_OPTIONS = [
    [ "standard", "Standard" ],
    [ "fromPosition", "From Position" ],
    [ "antichess", "Antichess" ],
    [ "atomic", "Atomic" ],
    [ "chess960", "Chess960" ],
    [ "crazyhouse", "Crazyhouse" ],
    [ "horde", "Horde" ],
    [ "kingOfTheHill", "King of the Hill" ],
    [ "racingKings", "Racing Kings" ],
    [ "threeCheck", "Three Check" ]
]

PIECE_NAMES = {
    "p": "Pawn",
    "n": "Knight",
    "b": "Bishop",
    "r": "Rook",
    "q": "Queen",
    "k": "King"
}

PROMPIECEKINDS_STANDARD = ["n", "b", "r", "q"]
PROMPIECEKINDS_ANTICHESS = ["n", "b", "r", "q", "k"]

TRAIN_OPTIONS = [
    ["0", "0"],
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4"],
    ["5", "5"],
    ["6", "6"],
    ["7", "7"],
    ["8", "8"],
    ["9", "9"]
]

def prompiecekindsforvariantkey(variantkey):
    if variantkey == "antichess":
        return PROMPIECEKINDS_ANTICHESS
    return PROMPIECEKINDS_STANDARD

def piececolortocolorname(color):
    if color == WHITE:
        return "White"
    elif color == BLACK:
        return "Black"
    return "Invalidcolor"

def piecekindtopiecename(kind):
    if kind in PIECE_NAMES:
        return PIECE_NAMES[kind]
    return "Invalidpiece"

def getstartfenforvariantkey(variantkey):
    if variantkey == "antichess":
        return ANTICHESS_START_FEN
    if variantkey == "racingKings":
        return RACING_KINGS_START_FEN
    if variantkey == "horde":
        return HORDE_START_FEN    
    if variantkey == "threeCheck":
        return THREE_CHECK_START_FEN
    if variantkey == "crazyhouse":
        return CRAZYHOUSE_START_FEN
    return STANDARD_START_FEN

class Piece():
    def __init__(self, kind = None, color = None):
        self.kind = kind
        self.color = color

    def isempty(self):
        return self.kind is None

    def ispiece(self):
        return not self.isempty()

    def __repr__(self):
        if self.isempty():
            return "Piece[None]"
        return "Piece[{} {}]".format(piececolortocolorname(self.color), piecekindtopiecename(self.kind))

def isvalidpieceletter(pieceletter):
    if pieceletter in PIECE_KINDS:
        return True
    if pieceletter.toLowerCase() in PIECE_KINDS:
        return True
    return False

def piecelettertopiece(pieceletter):
    if isvalidpieceletter(pieceletter):
        pieceletterlower = pieceletter.toLowerCase()
        if pieceletterlower == pieceletter:
            return Piece(pieceletterlower, BLACK)
        return Piece(pieceletterlower, WHITE)
    print("warning, piece letter not valid", pieceletter)
    return Piece()

def getclassforpiece(p, style):
    kind = p.kind
    if p.color == WHITE:
        kind = "w" + kind
    return style + "piece" + kind

class Square:
    def __init__(self, file, rank):
        self.file = file
        self.rank = rank

    def hashkey(self):
        hashkey = "{}:{}".format(self.file, self.rank)
        return hashkey

    def p(self, sq):
        return Square(self.file + sq.file, self.rank + sq.rank)

    def __repr__(self):
        return "Square[file: {} , rank: {}]".format(self.file, self.rank)

    def copy(self):
        return Square(self.file, self.rank)

class Move:
    def __init__(self, fromsq, tosq, prompiece = Piece()):
        self.fromsq = fromsq
        self.tosq = tosq
        self.prompiece = prompiece

    def __repr__(self):
        return "Move [from: {} , to: {} , prom: {}]".format(self.fromsq, self.tosq, self.prompiece)

class PieceStore(e):
    def dragstartfactory(self, p, pdiv, pdivcopy):
        def dragstart(ev):
            if self.show:
                ev.preventDefault()
                return
            self.parent.dragkind = "set"
            self.parent.draggedsetpiece = p
            self.parent.draggedpdiv = pdivcopy
            self.parent.movecanvashook.x()            
            pdiv.op(0.7)
        return dragstart

    def setstore(self, store):
        self.store = store
        self.container.x()
        self.pieces = {}        
        for pieceletter in self.store.split(""):
            p = piecelettertopiece(pieceletter)
            if p.color == self.color:
                if p.kind in self.pieces:
                    self.pieces[p.kind]["mul"] += 1
                else:
                    pcdiv = Div().pr().w(self.piecesize).h(self.piecesize)
                    pdiv = Div().pa().cp().ac(getclassforpiece(p, self.parent.piecestyle)).w(self.piecesize).h(self.piecesize)
                    pdivcopy = Div().pa().cp().ac(getclassforpiece(p, self.parent.piecestyle)).w(self.piecesize).h(self.piecesize)
                    pdiv.t(0).l(0).sa("draggable", True).ae("dragstart", self.dragstartfactory(p, pdiv, pdivcopy))                
                    pcdiv.a(pdiv)
                    self.pieces[p.kind] = {
                        "mul": 1,
                        "p": p,
                        "pcdiv": pcdiv
                    }        
        for pkind, pdesc in self.pieces.items():
            muldiv = Div().pa().w(self.muldivsize).h(self.muldivsize).fs(self.muldivsize * 1.3).html("{}".format(pdesc["mul"]))
            muldiv.l(self.piecesize - self.muldivsize).t(0).ac("storemuldiv")
            pdesc["pcdiv"].a(muldiv)
            self.container.a(pdesc["pcdiv"])            
        return self

    def __init__(self, args):
        super().__init__("div")
        self.show = args.get("show", False)
        self.parent = args.get("parent", BasicBoard({}))
        self.store = args.get("store", "")
        self.color = args.get("color", WHITE)
        self.container = args.get("containerdiv", Div())
        self.container.ac("noselect")
        self.piecesize = args.get("piecesize", self.parent.piecesize)
        self.muldivsize = int(self.piecesize / 2)        
        self.a(self.container)
        self.setstore(self.store)

class BasicBoard(e):
    def clearcanvases(self):
        self.movecanvas.clear()
        self.piececanvashook.x()

    def ucitosquare(self, squci):
        try:
            file = squci.charCodeAt(0) - "a".charCodeAt(0)
            rank = self.lastrank - ( squci.charCodeAt(1) - "1".charCodeAt(0) )
            return Square(file, rank)
        except:
            return None

    def ucitomove(self, moveuci):        
        if "@" in moveuci:
            try:
                parts = moveuci.split("@")
                sq = self.ucitosquare(parts[1])
                move = Move(sq, sq, Piece(parts[0].toLowerCase(), self.turn()))
                return move
            except:
                return None
        else:
            try:
                move = Move(self.ucitosquare(moveuci[0:2]), self.ucitosquare(moveuci[2:4]))
                try:
                    if len(moveuci) > 4:
                        move.prompiece = Piece(moveuci[4].toLowerCase(), self.turn())                    
                except:
                    print("could not parse prompiece")
                return move
            except:
                return None

    def resize(self, width, height):
        self.squaresize = 35
        self.calcsizes()
        while self.totalheight() < height:
            self.squaresize += 1
            self.calcsizes()
        self.squaresize -= 1
        self.calcsizes()
        self.build()

    def totalheight(self):
        th = self.outerheight + cpick(self.showfen, self.fendivheight, 0)
        if self.variantkey == "crazyhouse":
            th += 2 * self.squaresize
        return th

    def squareuci(self, sq):
        fileletter = String.fromCharCode(sq.file + "a".charCodeAt(0))
        rankletter = String.fromCharCode(self.lastrank - sq.rank + "1".charCodeAt(0))
        return fileletter + rankletter

    def moveuci(self, move):
        fromuci = self.squareuci(move.fromsq)
        touci = self.squareuci(move.tosq)
        promuci = cpick(move.prompiece.isempty(), "", move.prompiece.kind)
        return fromuci + touci + promuci

    def islightfilerank(self, file, rank):
        return ( ( ( file + rank ) % 2 ) == 0 )

    def islightsquare(self, sq):
        return self.islightfilerank(sq.file, sq.rank)

    def squarelist(self):
        squarelist = []
        for file in range(self.numfiles):
            for rank in range(self.numranks):
                squarelist.append(Square(file, rank))
        return squarelist

    def squarecoordsvect(self, sq):
        return Vect(sq.file * self.squaresize, sq.rank * self.squaresize)

    def squarecoordsmiddlevect(self, sq):
        return self.squarecoordsvect(sq).p(Vect(self.squaresize / 2, self.squaresize / 2))

    def piececoordsvect(self, sq):
        return self.squarecoordsvect(sq).p(Vect(self.squarepadding, self.squarepadding))

    def flipawaresquare(self, sq):
        if self.flip:
            return Square(self.lastfile - sq.file, self.lastrank - sq.rank)
        return sq

    def piecedragstartfactory(self, sq, pdiv):
        def piecedragstart(ev):
            if self.promoting or self.show:
                ev.preventDefault()
                return
            self.dragkind = "move"
            self.draggedsq = sq            
            self.draggedpdiv = pdiv
            self.movecanvashook.x()
            pdiv.op(0.1)
        return piecedragstart

    def piecedragfactory(self):
        def piecedrag(ev):            
            pass
        return piecedrag

    def piecedragendfactory(self, sq, pdiv):
        def piecedragend(ev):                        
            pdiv.op(0.5)
        return piecedragend

    def piecedragoverfactory(self, sq):
        def piecedragover(ev):
            ev.preventDefault()            
        return piecedragover

    def ismovepromotion(self, move):
        fromp = self.getpieceatsquare(move.fromsq)
        if ( fromp.kind == "p" ) and ( fromp.color == self.turn() ):
            if self.iswhitesturn():
                if move.tosq.rank == 0:
                    return True
            else:
                if move.tosq.rank == self.lastrank:
                    return True
        return False

    def piecedropfactory(self, sq):
        def piecedrop(ev):
            ev.preventDefault()            
            self.draggedpdiv.pv(self.piececoordsvect(self.flipawaresquare(sq)))
            self.draggedpdiv.zi(100)
            if self.dragkind == "move":                
                self.dragmove = Move(self.draggedsq, sq)
                if self.ismovepromotion(self.dragmove):
                    self.promoting = True
                    self.build()
                elif not ( self.movecallback is None ):
                    self.movecallback(self.variantkey, self.fen, self.moveuci(self.dragmove))
            elif self.dragkind == "set":
                self.container.a(self.draggedpdiv)
                if not ( self.movecallback is None ):
                    setuci = "{}@{}".format(self.draggedsetpiece.kind, self.squareuci(sq))
                    self.movecallback(self.variantkey, self.fen, setuci)
        return piecedrop

    def buildsquares(self):
        self.container.x()
        self.sqdivs = {}
        self.sqhdivs = {}
        for sq in self.squarelist():
            sqclass = cpick(self.islightsquare(sq), "boardsquarelight", "boardsquaredark")
            sqdiv = Div().ac(["boardsquare", sqclass]).w(self.squaresize).h(self.squaresize)
            sqhdiv = Div().pa().w(self.squaresize).h(self.squaresize)
            self.sqdivs[sq.hashkey()] = sqdiv
            self.sqhdivs[sq.hashkey()] = {
                "div": sqhdiv,
                "cumop": 0.0
            }
            fasq = self.flipawaresquare(sq)
            sqdiv.pv(self.squarecoordsvect(fasq))
            sqhdiv.pv(self.squarecoordsvect(fasq))
            sqdiv.ae("dragover", self.piecedragoverfactory(sq))
            sqdiv.ae("drop", self.piecedropfactory(sq))            
            sqhdiv.ae("dragover", self.piecedragoverfactory(sq))
            sqhdiv.ae("drop", self.piecedropfactory(sq))            
            self.container.a([sqdiv, sqhdiv])
            p = self.getpieceatsquare(sq)
            if p.ispiece():
                pdiv = Div().ac("boardpiece").w(self.piecesize).h(self.piecesize).pv(self.piececoordsvect(fasq))
                pdiv.ac(getclassforpiece(p, self.piecestyle)).sa("draggable", True)
                pdiv.ae("dragstart", self.piecedragstartfactory(sq, pdiv))
                pdiv.ae("drag", self.piecedragfactory())
                pdiv.ae("dragend", self.piecedragendfactory(sq, pdiv))
                pdiv.ae("dragover", self.piecedragoverfactory(sq))
                pdiv.ae("drop", self.piecedropfactory(sq))            
                pdiv.zi(10)
                if self.variantkey == "threeCheck":
                    if ( p.kind == "k" ):
                        mul = self.getthreelifesforcolor(p.color)
                        lifesdiv = Div().pa().t(- self.squaresize / 10).l(self.squaresize / 2 + self.squaresize / 10).w(self.squaresize / 2).h(self.squaresize / 2)
                        lifesdiv.ac("boardthreechecklifesdiv").fs(self.squaresize / 1.5).html("{}".format(mul))
                        lifesdiv.c(["#ff0", "#ff0"][p.color])
                        pdiv.a(lifesdiv)
                self.container.a(pdiv)

    def getthreelifesforcolor(self, color):
        parts = self.threefen.split("+")
        mul = 3
        if color == WHITE:
            try:
                mul = int(parts[2])
            except:
                print("warning, could not parse white lifes from", self.threefen)
        if color == BLACK:
            try:
                mul = int(parts[0])
            except:
                print("warning, could not parse black lifes from", self.threefen)
        return mul

    def prompiececlickedfactory(self, prompiecekind):
        def prompiececlicked():
            self.dragmove.prompiece = Piece(prompiecekind, self.turn())
            self.movecallback(self.variantkey, self.fen, self.moveuci(self.dragmove))
        return prompiececlicked

    def buildprominput(self):
        promkinds = prompiecekindsforvariantkey(self.variantkey)
        promsq = self.dragmove.tosq.copy()        
        dir = cpick(promsq.rank >= ( self.numranks / 2 ), -1, 1)
        ppks = prompiecekindsforvariantkey(self.variantkey)
        for ppk in ppks:            
            fapromsq = self.flipawaresquare(promsq)
            pp = Piece(ppk, self.turn())
            psqdiv = Div().pa().cp().zi(150).w(self.squaresize).h(self.squaresize).ac("boardpromotionsquare")
            psqdiv.pv(self.squarecoordsvect(fapromsq))
            ppdiv = Div().pa().cp().zi(200).w(self.piecesize).h(self.piecesize).ac(getclassforpiece(pp, self.piecestyle))
            ppdiv.pv(self.piececoordsvect(fapromsq)).ae("mousedown", self.prompiececlickedfactory(ppk))
            self.container.a([psqdiv, ppdiv])
            promsq = promsq.p(Square(0, dir))

    def promotecancelclick(self):
        self.promoting = False
        self.build()

    def drawmovearrow(self, move, args = {}):                        
        if move is None:
            return
        strokecolor = args.get("strokecolor", "#FFFF00")
        linewidth = args.get("linewidth", 0.2) * self.squaresize
        headwidth = args.get("headwidth", 0.2) * self.squaresize
        headheight = args.get("headheight", 0.2) * self.squaresize        
        self.movecanvas.lineWidth(linewidth)
        self.movecanvas.strokeStyle(strokecolor)
        self.movecanvas.fillStyle(strokecolor)
        tomv = self.squarecoordsmiddlevect(self.flipawaresquare(move.tosq))
        self.movecanvas.drawline(self.squarecoordsmiddlevect(self.flipawaresquare(move.fromsq)), tomv)
        dv = Vect(headwidth, headheight)            
        self.movecanvas.fillRect(tomv.m(dv), tomv.p(dv))
        if not ( move.prompiece.isempty() ):
            pf = 4
            dvp = Vect(linewidth * pf, linewidth * pf)
            move.prompiece.color = self.turn()
            ppdiv = Div().pa().cp().ac(getclassforpiece(move.prompiece, self.piecestyle)).w(linewidth * 2 * pf).h(linewidth * 2 * pf)
            ppdiv.pv(tomv.m(dvp))            
            self.piececanvashook.a(ppdiv)

    def drawuciarrow(self, uci, args = {}):
        self.drawmovearrow(self.ucitomove(uci), args)

    def highlightsquare(self, sq, bc, op):
        if op == 0:
            return
        margin = self.squaresize * 0.1
        hsize = self.squaresize - 2 * margin
        sqhdiv = self.sqhdivs[sq.hashkey()]                
        if op > sqhdiv["cumop"]:
            sqhdiv["cumop"] = op          
        sqhdiv["div"].x().a(Div().pa().t(margin).l(margin).w(hsize).h(hsize).bc(bc).op(sqhdiv["cumop"]))              

    def highlightmove(self, move, bc, op):        
        self.highlightsquare(move.fromsq, bc, op)
        self.highlightsquare(move.tosq, bc, op)

    def highlightucimove(self, uci, bc, op):        
        self.highlightmove(self.ucitomove(uci), bc, op)

    def buildgenmove(self):
        if "genmove" in self.positioninfo:
            if not ( genmove == "reset" ):
                genmoveuci = self.positioninfo["genmove"]["uci"]
                genmove = self.ucitomove(genmoveuci)
                if not ( genmove is None ):
                    genmove.prompiece = Piece()
                    self.drawmovearrow(genmove)

    def fentextchanged(self):
        if self.fentextchangedcallback:
            self.fentextchangedcallback(self.fentext.getText())

    def build(self):
        self.sectioncontainer = Div().ac("boardsectioncontainer").w(self.outerwidth)
        self.sectioncontainer.bci(self.background)
        self.outercontainer = Div().ac("boardoutercontainer").w(self.outerwidth).h(self.outerheight)
        self.outercontainer.bci(self.background)
        self.container = Div().ac("boardcontainer").w(self.width).h(self.height).t(self.margin).l(self.margin)        
        self.container.bci(self.background)
        self.outercontainer.a(self.container)        
        self.buildsquares()
        self.turndiv = Div().pa().w(self.turndivsize).h(self.turndivsize).bc(cpick(self.iswhitesturn(), "#fff", "#000"))
        if self.variantkey == "racingKings":
            self.turndiv.t(cpick(self.flip, 0, self.outerheight - self.turndivsize))
            if xor(self.isblacksturn(), self.flip):
                self.turndiv.l(0)
            else:
                self.turndiv.l(self.outerwidth - self.turndivsize)
        else:
            self.turndiv.l(self.outerwidth - self.turndivsize).t(cpick(xor(self.isblacksturn(), self.flip), 0, self.outerheight - self.turndivsize))
        self.outercontainer.a(self.turndiv)
        if self.promoting:
            self.buildprominput()
            self.container.ae("mousedown", self.promotecancelclick)
        self.fentext = TextInput({}).w(self.width).fs(10).setText(self.fen)
        self.fentext.changecallback = self.fentextchanged
        self.fendiv = Div().ac("boardfendiv").h(self.fendivheight).a(self.fentext)
        if self.variantkey == "crazyhouse":
            self.whitestorediv = Div().ac("boardstorediv").h(self.squaresize).w(self.outerwidth)
            self.whitestorediv.bci(self.background)
            self.blackstorediv = Div().ac("boardstorediv").h(self.squaresize).w(self.outerwidth)
            self.blackstorediv.bci(self.background)
            self.whitestore = PieceStore({
                "show": self.show,
                "parent": self,
                "color": WHITE,
                "store": self.crazyfen,
                "containerdiv": self.whitestorediv
            })
            self.blackstore = PieceStore({
                "show": self.show,
                "parent": self,
                "color": BLACK,
                "store": self.crazyfen,
                "containerdiv": self.blackstorediv
            })            
            if self.flip:
                self.sectioncontainer.a([self.whitestorediv, self.outercontainer, self.blackstorediv])
            else:
                self.sectioncontainer.a([self.blackstorediv, self.outercontainer, self.whitestorediv])
        else:
            self.sectioncontainer.a([self.outercontainer])
        if self.showfen:
            self.sectioncontainer.a(self.fendiv)
        self.x().a(self.sectioncontainer)
        self.movecanvas = Canvas(self.width, self.height).pa().t(0).l(0)
        self.movecanvashook = Div().pa().t(0).l(0).zi(5).op(0.5)
        self.piececanvashook = Div().pa().t(0).l(0).zi(11).op(0.5)
        self.container.a([self.movecanvashook, self.piececanvashook])
        self.movecanvashook.a(self.movecanvas)
        self.buildgenmove()
        return self

    def setflip(self, flip):
        self.flip = flip
        self.build()

    def calcsizes(self):
        self.lastfile = self.numfiles - 1
        self.lastrank = self.numranks - 1
        self.area = self.numfiles * self.numranks
        self.width = self.numfiles * self.squaresize
        self.height = self.numranks * self.squaresize
        self.avgsize = ( self.width + self.height ) / 2
        self.margin = self.marginratio * self.avgsize
        self.squarepadding = self.squarepaddingratio * self.squaresize
        self.piecesize = self.squaresize - 2 * self.squarepadding
        self.outerwidth = self.width + 2 * self.margin
        self.outerheight = self.height + 2 * self.margin
        self.turndivsize = self.margin
        self.fendivheight = 25

    def parseargs(self, args):        
        self.fentextchangedcallback = args.get("fentextchangedcallback", None)
        self.positioninfo = args.get("positioninfo", {})
        self.show = args.get("show", False)
        self.showfen = args.get("showfen", True)
        self.squaresize = args.get("squaresize", 45)
        self.squarepaddingratio = args.get("squarepaddingratio", 0.04)
        self.marginratio = args.get("marginratio", 0.02)
        self.numfiles = args.get("numfiles", 8)
        self.numranks = args.get("numranks", 8)        
        self.piecestyle = args.get("piecestyle", "alpha")
        self.flip = args.get("flip", False)
        self.movecallback = args.get("movecallback", None)
        self.background = "/static/img/backgrounds/" + args.get("background", "wood.jpg")
        self.calcsizes()

    def setpieceati(self, i, p):
        if ( i >= 0 ) and ( i < self.area ):
            self.rep[i] = p
        else:
            print("warning, rep index out of range", i)

    def getpieceati(self, i):
        if ( i >= 0 ) and ( i < self.area ):            
            return self.rep[i]
        return Piece()

    def getpieceatfilerank(self, file, rank):
        i = rank * self.numfiles + file        
        return self.getpieceati(i)

    def getpieceatsquare(self, sq):
        return self.getpieceatfilerank(sq.file, sq.rank)

    def setrepfromfen(self, fen):  
        self.fen = fen
        self.crazyfen = None
        self.threefen = None
        self.rep = [Piece() for i in range(self.area)]
        fenparts = self.fen.split(" ")
        self.rawfen = fenparts[0]
        rawfenparts = self.rawfen.split("/")        
        if self.variantkey == "crazyhouse":
            self.crazyfen = ""
            if "[" in self.rawfen:
                cfenparts = self.rawfen.split("[")
                self.rawfen = cfenparts[0]
                rawfenparts = self.rawfen.split("/")
                cfenparts = cfenparts[1].split("]")
                self.crazyfen = cfenparts[0]
        i = 0
        for rawfenpart in rawfenparts:
            pieceletters = rawfenpart.split("")
            for pieceletter in pieceletters:
                if isvalidpieceletter(pieceletter):
                    self.setpieceati(i, piecelettertopiece(pieceletter))
                    i+=1
                else:
                    mul = 0
                    try:
                        mul = int(pieceletter)                        
                    except:
                        print("warning, multiplicity could not be parsed from", pieceletter)
                    for j in range(mul):
                        self.setpieceati(i, Piece())
                        i += 1
        if i < self.area:
            print("warning, raw fen did not fill board")
        elif i > self.area:
            print("warning, raw fen exceeded board")
        self.turnfen = "w"
        if len(fenparts) > 1:
            self.turnfen = fenparts[1]
        else:
            print("warning, no turn fen")
        self.castlefen = "-"
        if len(fenparts) > 2:
            self.castlefen = fenparts[2]
        else:
            print("warning, no castle fen")
        self.epfen = "-"
        if len(fenparts) > 3:
            self.epfen = fenparts[3]
        else:
            print("warning, no ep fen")
        moveclocksi = cpick(self.variantkey == "threeCheck", 5, 4)
        self.halfmoveclock = 0
        if len(fenparts) > moveclocksi:
            try:
                self.halfmoveclock = int(fenparts[moveclocksi])
            except:
                print("warning, half move clock could not be parsed from", fenparts[4])
        else:
            print("warning, no half move fen")
        self.fullmovenumber = 1
        if len(fenparts) > ( moveclocksi + 1 ):
            try:
                self.fullmovenumber = int(fenparts[moveclocksi + 1])
            except:
                print("warning, full move number could not be parsed from", fenparts[5])
        else:
            print("warning, no full move fen")
        if self.variantkey == "threeCheck":
            if len(fenparts) > 4:
                self.threefen = fenparts[4]        
        self.promoting = False

    def turn(self):
        if self.turnfen == "w":
            return WHITE
        return BLACK

    def iswhitesturn(self):
        return self.turn() == WHITE

    def isblacksturn(self):
        return self.turn() == BLACK

    def initrep(self, args):
        self.variantkey = args.get("variantkey", "standard")
        self.setrepfromfen(args.get("fen", getstartfenforvariantkey(self.variantkey)))

    def setfromfen(self, fen, positioninfo = {}):                        
        self.positioninfo = positioninfo
        self.setrepfromfen(fen)
        self.build()                

    def reset(self):
        self.setfromfen(getstartfenforvariantkey(self.variantkey))

    def __init__(self, args):
        super().__init__("div")        
        self.positioninfo = {}
        self.parseargs(args)
        self.initrep(args)
        self.build()

class MultipvInfo(e):
    def bestmovesanclickedfactory(self, moveuci, dostore = False):
        def bestmovesanclicked():
            if not ( self.bestmovesanclickedcallback is None ):
                self.bestmovesanclickedcallback(moveuci, dostore)
        return bestmovesanclicked

    def scorebonus(self):
        if "scorebonus" in self.infoi:
            try:
                scorebonus = int(self.infoi["scorebonus"])
                return scorebonus
            except:
                pass
        return 0

    def effscore(self):
        return self.scorenumerical + self.scorebonus()

    def bonussliderchanged(self):
        self.infoi["scorebonus"] = self.bonusslider.v()
        self.build()            
        if not ( self.bonussliderchangedcallback is None ):            
            self.bonussliderchangedcallback()

    def traincombochanged(self):
        self.infoi["metrainweight"] = self.metraincombo.v()
        self.infoi["opptrainweight"] = self.opptraincombo.v()
        self.build()

    def build(self, gamesan = None):            
        self.bestmoveuci = self.infoi["bestmoveuci"]
        self.bestmovesan = self.infoi["bestmovesan"]
        self.scorenumerical = self.infoi["scorenumerical"]
        self.pvsan = self.infoi["pvsan"]
        self.pvsans = self.pvsan.split(" ")
        if len(self.pvsans) > ( self.pvlength + 1 ):
            self.pvsans = self.pvsans[0:self.pvlength + 1]
        if len(self.pvsans) > 1:
            self.pvsans = self.pvsans[1:]
        self.showpv = " ".join(self.pvsans)
        self.pvpgn = self.infoi["pvpgn"]
        self.depth = self.infoi["depth"]
        self.nps = self.infoi["nps"]        
        self.container = Div().ac("multipvinfocontainer")
        self.idiv = Div().ac("multipvinfoi").html("{}.".format(self.i))
        self.bestmovesandiv = Div().ac("multipvinfobestmovesan").html(self.bestmovesan)
        if gamesan == self.bestmovesan:
            self.bestmovesandiv.bc("#fbf")
        self.bestmovesandiv.ae("mousedown", self.bestmovesanclickedfactory(self.bestmoveuci))        
        self.scorenumericaldiv = Div().ac("multipvinfoscorenumerical").html("{}".format(scoreverbal(self.effscore()))).cp()
        self.scorenumericaldiv.ae("mousedown", self.bestmovesanclickedfactory(self.bestmoveuci, True))        
        self.bonussliderdiv = Div().ac("multipvinfobonussliderdiv")
        self.bonusslider = Slider().setmin(-500).setmax(500).ac("multipvinfobonusslider").sv(self.scorebonus())        
        self.bonusslider.ae("change", self.bonussliderchanged)
        self.bonussliderdiv.a(self.bonusslider)
        self.depthdiv = Div().ac("multipvinfodepth").html("{}".format(self.depth))
        self.miscdiv = Div().ac("multipvinfomisc").html("nps {}".format(self.nps))
        self.traindiv = Div().ac("multipvinfomisc").w(100)        
        metrainweight = self.infoi["metrainweight"]        
        hasmetrain = False
        if not metrainweight:
            metrainweight = "0"            
        opptrainweight = self.infoi["opptrainweight"]
        hasopptrain = False
        if not opptrainweight:
            opptrainweight = "0"                
        try:
            if int(metrainweight) > 0:
                hasmetrain = True
            if int(opptrainweight) > 0:
                hasopptrain = True
        except:
            pass
        if hasmetrain and hasopptrain:
            self.trainbc = "#00f"
        elif hasmetrain:
            self.trainbc = "#0f0"
        elif hasopptrain:
            self.trainbc = "#f00"
        else:
            self.trainbc = "inherit"                
        self.metrainweight = int(metrainweight)
        self.opptrainweight = int(opptrainweight)
        self.avgtrainweight = ( self.metrainweight + self.opptrainweight ) / 2.0
        self.trainop = self.avgtrainweight / 10.0
        self.metraincombo = ComboBox().setoptions(TRAIN_OPTIONS, metrainweight, self.traincombochanged)
        self.opptraincombo = ComboBox().setoptions(TRAIN_OPTIONS, opptrainweight, self.traincombochanged)        
        self.traindiv.a([self.metraincombo, self.opptraincombo])        
        self.pvdiv = Div().ac("multipvinfopv").html(self.showpv).c("#070").fw("bold")
        self.container.a([self.idiv, self.bestmovesandiv, self.scorenumericaldiv, self.bonussliderdiv, self.traindiv, self.depthdiv, self.pvdiv])        
        self.container.bc(self.trainbc)
        self.bestmovesandiv.c(scorecolor(self.effscore()))
        self.scorenumericaldiv.c(scorecolor(self.effscore()))        
        self.x().a(self.container)        

    def __init__(self, infoi, pvlength = 4):
        super().__init__("div")
        self.pvlength = pvlength
        self.bestmovesanclickedcallback = None
        self.bonussliderchangedcallback = None
        self.infoi = infoi
        self.i = self.infoi["i"]
        self.build()

class PgnInfo(e):
    def __init__(self, parent, pgnlistparent):
        super().__init__("div")
        self.headers = []
        self.parent = parent
        self.pgnlistparent = pgnlistparent

    def getheader(self, key, default):
        for header in self.headers:
            if header[0] == key:
                return header[1]
        return default

    def playerlink(self, username):
        return "<a href='https://lichess.org/@/{}' target='_blank' rel='noopener noreferrer'>{}</a>".format(username, username)

    def parsecontent(self):        
        lines = self.content.split("\n")
        self.headers = []
        for line in lines:
            if line[0] == "[":
                parts = line[1:].split("\"")
                key = parts[0].split(" ")[0]
                value = parts[1].split("\"")[0]
                self.headers.append((key, value))
        self.white = self.getheader("White", "?")        
        self.black = self.getheader("Black", "?")        
        self.result = self.getheader("Result", "?")        
        self.site = self.getheader("Site", "")               
        self.whiteelo =  self.getheader("WhiteElo", "?")
        self.whiteratingdiff =  self.getheader("WhiteRatingDiff", "?")
        self.blackelo =  self.getheader("BlackElo", "?")
        self.blackratingdiff =  self.getheader("BlackRatingDiff", "?")
        self.variant = self.getheader("Variant", "Standard")
        self.timecontrol = self.getheader("TimeControl", "?")
        self.utcdate = self.getheader("UTCDate", "?")
        self.id = self.site.split("/")[-1:][0]

    def idclicked(self):
        self.parent.loadedgameid = self.id
        self.parent.loadedgameside = "white"        
        if self.meblack():
            self.parent.loadedgameside = "black"
        self.parent.pgntext.setpgn(self.content)
        self.bds("dotted").bdw("6").bdc("#00f")
        localStorage.setItem("pgninfo/idclicked", self.id)
        self.pgnlistparent.bookmarkedpi = self
        getconn().sioreq({
            "kind": "parsepgn",
            "owner": self.parent.id,
            "data": self.content
        })

    def mecolor(self):
        if self.white == self.parent.username:
            return WHITE
        if self.black == self.parent.username:
            return BLACK
        return None

    def mewhite(self):
        return self.mecolor() == WHITE

    def meblack(self):
        return self.mecolor() == BLACK

    def hasme(self):
        return not ( self.mecolor() is None )

    def score(self):
        if self.result == "1-0":
            return 1
        if self.result == "0-1":
            return 0
        return 0.5

    def mescore(self):
        if self.hasme():
            if self.mewhite():
                return self.score()
            return 1 - self.score()
        return self.score()

    def meratinginfo(self):
        if self.hasme():
            if self.mewhite():
                return [ self.whiteelo, self.whiteratingdiff ]
            return [ self.blackelo, self.blackratingdiff ]
        return None

    def build(self):        
        self.x().ac("pgninfocontainer")
        self.tcdiv = Div().ac("pgninfotcdiv").html("{} {}".format(self.timecontrol, self.variant))        
        self.whitediv = Div().ac("pgninfoplayerdiv").html(self.playerlink(self.white))        
        self.whiteelodiv = Div().ac("pgninfoplayerelodiv").html("{} {}".format(self.whiteelo, self.whiteratingdiff))        
        if self.meblack():
            self.whitediv.ac("pgninfotheyplayerdiv")
        self.blackdiv = Div().ac("pgninfoplayerdiv").html(self.playerlink(self.black))        
        self.blackelodiv = Div().ac("pgninfoplayerelodiv").html("{} {}".format(self.blackelo, self.blackratingdiff))        
        if self.mewhite():
            self.blackdiv.ac("pgninfotheyplayerdiv")
        self.resultdiv = Div().ac("pgninforesultdiv").html(self.result)
        self.iddiv = Div().ac("pgninfoiddiv").html(self.id)
        self.iddiv.ae("mousedown", self.idclicked)
        mescore = self.mescore()
        if mescore == 1:
            self.ac("pgninfowhitewin")
        elif mescore == 0:
            self.ac("pgninfoblackwin")
        else:
            self.ac("pgninfodraw")
        self.a([self.tcdiv, self.whitediv, self.whiteelodiv, self.blackdiv, self.blackelodiv, self.resultdiv, self.iddiv])
        if self.id == localStorage.getItem("pgninfo/idclicked"):
            self.bds("dashed").bdw("6").bdc("#00f")
        return self

    def setcontent(self, content):
        self.content = content
        self.parsecontent()
        return self.build()

class CandleStickChart(e):
    def __init__(self, args):
        super().__init__("div")
        self.BARWIDTH = args.get("barwidth", 20)
        self.BARSEPARATION = int(self.BARWIDTH * 1.1)
        self.YHEIGHT = args.get("yheight", 2)
        self.CLUSTER = args.get("cluster", 50)
        self.data = args.get("data", [])
        first = True
        for d in self.data:
            mind = d["min"]
            maxd = d["max"]
            if first:
                miny = mind
                maxy = maxd
                first = False
            else:
                if mind < miny:
                    miny = mind
                if maxd > maxy:
                    maxy = maxd
        miny = miny - ( miny % self.CLUSTER )
        maxy = maxy - ( maxy % self.CLUSTER ) + self.CLUSTER
        chartwidth = self.BARSEPARATION * len(self.data)
        self.w(chartwidth)
        range = maxy - miny
        chartheight = range * self.YHEIGHT
        self.h(chartheight)
        self.pr().bc("#ffc")
        for i in range(1, range / self.CLUSTER):
            rt = maxy - ( i * self.CLUSTER )
            yt = i * self.CLUSTER * self.YHEIGHT
            linediv = Div().pa().t(yt).l(0).w(chartwidth).h(1).bc("#000")
            ratingdiv = Div().pa().t(yt + 5).ms().html(rt)
            self.a([ linediv, ratingdiv ])            
        i = 0
        for d in self.data:
            mind = d["min"]
            minr = range - ( mind - miny )
            mint = minr * self.YHEIGHT
            maxd = d["max"]
            maxr = range - ( maxd - miny )
            maxt = maxr * self.YHEIGHT
            open = d["open"]            
            openr = range - ( open - miny )
            opent = openr * self.YHEIGHT
            close = d["close"]
            closer = range - ( close - miny )
            closet = closer * self.YHEIGHT
            xcoord = i * self.BARSEPARATION
            bardiv = Div().pa().t(min(opent, closet)).l(xcoord + 1).w(self.BARWIDTH).h(abs(opent - closet)).bc(cpick(opent < closet, "#f00", "#0f0"))
            minmaxdiv = Div().pa().t(maxt).l(xcoord  + int(self.BARWIDTH / 2) - 1 + 1).w(2).h(mint - maxt).bc("#007")
            self.a([ minmaxdiv, bardiv ])
            i += 1
        
class PgnList(e):
    def __init__(self, parent):
        super().__init__("div")
        self.parent = parent

    def tobookmark(self):
        if self.bookmarkedpi:
            self.bookmarkedpi.e.scrollIntoView({"block": "center", "inline": "center"})

    def build(self):
        self.x()
        first = True
        dateinfos = []
        self.bookmarkedpi = None
        for gamecontent in self.gamecontents:
            pi = PgnInfo(self.parent, self).setcontent(gamecontent)
            if pi.id == localStorage.getItem("pgninfo/idclicked"):
                self.bookmarkedpi = pi
            self.a(pi)
            mri = pi.meratinginfo()            
            if mri:
                rating = 1500
                ratingdiff = 0
                try:
                    rating = int(mri[0])
                except:
                    pass
                try:                    
                    ratingdiff = int(mri[1])
                except:
                    pass
                newrating = rating + ratingdiff
                if first:                    
                    currdate = pi.utcdate
                    minrating = min(rating, newrating)
                    maxrating = max(rating, newrating)
                    openrating = rating
                    closerating = newrating
                    first = False
                else:
                    if not ( currdate == pi.utcdate ):
                        dateinfos.push({
                            "date": currdate,
                            "min": minrating,
                            "max": maxrating,
                            "open": openrating,
                            "close": closerating
                        })              
                        minrating = min(rating, newrating)
                        maxrating = max(rating, newrating)
                        closerating = newrating
                        currdate = pi.utcdate
                    if rating > maxrating:
                        maxrating = rating
                    if rating < minrating:
                        minrating = rating
                    if newrating > maxrating:
                        maxrating = newrating
                    if newrating < minrating:
                        minrating = newrating
                    openrating = rating                        
        self.parent.chartdiv.x().a(CandleStickChart({            
            "barwidth": self.parent.BARWIDTH,
            "yheight": self.parent.RATINGHEIGHT,
            "cluster": self.parent.RATINGCLUSTER,
            "data": dateinfos
        }))
        table = Table()
        tr = Tr()
        tr.a(Td("chartdataheadtd").html("Date"))
        tr.a(Td("chartdataheadtd").html("Min"))
        tr.a(Td("chartdataheadtd").html("Max"))
        tr.a(Td("chartdataheadtd").html("Open"))
        tr.a(Td("chartdataheadtd").html("Close"))
        table.a(tr)
        for info in dateinfos:
            tr = Tr()
            tr.a(Td("chartdatatd").html(info["date"]))
            tr.a(Td("chartdatatd").html(info["min"]))
            tr.a(Td("chartdatatd").html(info["max"]))
            tr.a(Td("chartdatatd").html(info["open"]))
            tr.a(Td("chartdatatd").html(info["close"]))
            table.a(tr)
        self.parent.chartdiv.a(table)
        return self

    def setcontent(self, content):
        self.content = content
        self.gamecontents = self.content.split("\n\n\n")[:-1]
        return self.build()

class PgnText(e):
    def __init__(self):
        super().__init__("div")
        self.ac("pgntextcontainer")
        self.textarea = TextArea()
        self.a(self.textarea)
        self.resize(600,300)

    def setpgn(self, pgn):
        self.textarea.setText(pgn)
        return self

    def getpgn(self):
        return self.textarea.getText()

    def resize(self, width, height):
        self.width = width
        self.height = height
        self.textarea.w(width - 15).h(height - 15)
        return self
