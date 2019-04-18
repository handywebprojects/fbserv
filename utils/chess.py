#############################################

import chess
from chess.variant import find_variant
from chess.pgn import read_game

import io

#############################################

VARIANT_KEYS = [    
    [ "standard", "Standard" ],
    [ "chess960", "Chess960" ],
    [ "crazyhouse", "Crazyhouse" ],
    [ "antichess", "Giveaway" ],
    [ "atomic", "Atomic" ],
    [ "horde", "Horde" ],
    [ "kingOfTheHill", "King of the Hill" ],
    [ "racingKings", "Racing Kings" ],
    [ "threeCheck", "Three-check" ]
]

#############################################

def variantnameofvariantkey(variantkey):
    for item in VARIANT_KEYS:
        if item[0] == variantkey:
            return item[1]
    return "Standard"

def variantkeyofvariantname(variantname):
    for item in VARIANT_KEYS:
        if item[1] == variantname:
            return item[0]
    return "standard"

def getvariantboard(variantkey = "standard"):
    if variantkey == "standard":
        return chess.Board()
    elif variantkey == "chess960":
        return chess.Board(chess960 = True)
    elif variantkey == "fromPosition":
        return chess.Board()
    else:
        VariantBoard = find_variant(variantkey)
        return VariantBoard()

def sanext(board, move):
    san = board.san(move)
    fmn = board.fullmove_number
    turnblack = ( board.turn == chess.BLACK )
    sanext = "{}.".format(fmn)
    if turnblack:
        sanext += "."
    sanext += san
    return sanext

def stripsan(san):
    if ".." in san:
        parts = san.split("..")
        return parts[1]
    if "." in san:
        parts = san.split(".")
        return parts[1]
    return san

def treeofgamenode(gamenode):
        obj = {}
        for childnode in gamenode.variations:
            move = childnode.move
            board = gamenode.board()            
            obj[sanext(board, move)] = treeofgamenode(childnode)
        return obj

#############################################

class ClientGame:
    def fen(self):
        return self.currentnode.board().fen()

    def __init__(self, variantkey, pgn, fen):        
        self.variantkey = variantkey
        if pgn:                        
            pgnio = io.StringIO(pgn)
            game = chess.pgn.read_game(pgnio)                 
            self.variantkey = variantkeyofvariantname(game.headers.pop("Variant", self.variantkey))
            game.headers["Variant"] = variantnameofvariantkey(self.variantkey)
            self.rootnode = game
            self.currentnode = self.rootnode                    
            currentline = self.rootnode.headers.pop("CurrentLine", None)
            if currentline:
                rootfen = self.rootnode.board().fen()
                setuppgn = "[Variant \"{}\"]\n[FEN \"{}\"]\n[SetUp \"1\"]\n\n{}".format(variantkey, rootfen, currentline)                                                
                pgnio = io.StringIO(setuppgn)
                game = chess.pgn.read_game(pgnio)                
                for move in game.mainline_moves():                                        
                    self.currentnode = self.currentnode.variation(move)                                    
            return
        board = getvariantboard(variantkey)        
        if fen:
            board.set_fen(fen)        
        self.rootnode = chess.pgn.Game.from_board(board)
        self.currentnode = self.rootnode        

    def frommoveitems(self, variantkey, moveitems):
        self.variantkey = variantkey
        board = getvariantboard(self.variantkey)        
        self.rootnode = chess.pgn.Game.from_board(board)
        self.rootnode.headers["Event"] = "Theoretical game"
        self.rootnode.headers["Site"] = "https://cserv.herokuapp.com"
        self.rootnode.headers["Date"] = "2019.03.18"
        self.rootnode.headers.pop("White", None)
        self.rootnode.headers.pop("Black", None)
        self.rootnode.headers.pop("Round", None)
        self.rootnode.headers.pop("Result", None)        
        for moveitem in moveitems:
            linestr = moveitem["line"]
            moves = linestr.split("_")            
            self.currentnode = self.rootnode
            for move in moves:
                san = stripsan(move)
                self.makesanmove(san)
        return self

    def mergegame(self, dstgame, srcgame):        
        srccomment = srcgame.comment
        if not ( srccomment == "" ):
            dstgame.comment = srccomment
        for variation in srcgame.variations:
            move = variation.move
            srcgamenext = srcgame.variation(move)
            try:                
                dstgamenext = dstgame.variation(move)
            except:
                dstgamenext = dstgame.add_main_variation(move)    
            self.mergegame(dstgamenext, srcgamenext)                       

    def mergepgn(self, pgn):
        pgn = pgn.replace("\r", "")
        if not "\n\n" in pgn:
            pgn = "\n" + pgn
        if not "SetUp" in pgn:
            pgn = "[SetUp \"1\"]\n{}".format(pgn)
        if not "FEN" in pgn:
            pgn = "[FEN \"{}\"]\n{}".format(self.rootnode.board().fen(), pgn)
        if not "Variant" in pgn:
            pgn = "[Variant \"{}\"]\n{}".format(self.variantkey, pgn)        
        #print("merge pgn")
        #print(pgn)
        pgnio = io.StringIO(pgn)
        srcgame = chess.pgn.read_game(pgnio)                 
        self.mergegame(self.rootnode, srcgame)

    def pgn(self):
        self.rootnode.headers.pop("CurrentLine", None)
        exporter = chess.pgn.StringExporter(columns=None, headers=True, variations=True, comments=True)
        pgn = self.rootnode.accept(exporter)            
        reportpgn = "[CurrentLine \"{}\"]\n{}".format(self.currentlinepgn(), pgn)        
        return reportpgn

    def makemove(self, move):
        if self.currentnode.board().is_legal(move):
            try:                
                self.currentnode = self.currentnode.variation(move)                
            except:
                self.currentnode = self.currentnode.add_main_variation(move)                            
            return True
        else:
            print("illegal move")
            return False
    
    def makealgebmove(self, algeb):
        move = chess.Move.from_uci(algeb)
        return self.makemove(move)

    def makesanmove(self, san):
        move = self.currentnode.board().parse_san(san)
        return self.makemove(move)

    def setline(self, line):
        self.currentnode = self.rootnode
        for san in line:
            self.makesanmove(san)

    def delmove(self):
        if not self.currentnode.move:            
            return False        
        move = self.currentnode.move        
        self.currentnode = self.currentnode.parent
        self.currentnode.remove_variation(move)                        
        return True

    def tobegin(self):
        while self.backmove():
            pass

    def backmove(self):
        if not self.currentnode.parent:            
            return False
        self.currentnode = self.currentnode.parent                        
        return True

    def forwardmove(self):
        try:
            self.currentnode = self.currentnode.variation(0)                        
            return True
        except:            
            return False

    def toend(self):
        while self.forwardmove():
            pass

    def currentlinemoves(self):
        moves = []
        cursor = self.currentnode
        while cursor.parent:
            moves = [cursor.move] + moves
            cursor = cursor.parent
        return moves

    def getline(self):
        testboard = self.rootnode.board()
        line = []
        for move in self.currentlinemoves():            
            line.append(sanext(testboard, move))
            testboard.push(move)
        return line

    def getalgebline(self):
        testboard = self.rootnode.board()
        line = []
        for move in self.currentlinemoves():            
            line.append(move.uci())
            testboard.push(move)
        return line

    def currentlinepgn(self):
        testboard = self.rootnode.board()
        for move in self.currentlinemoves():
            testboard.push(move)
        testgame = chess.pgn.Game.from_board(testboard)
        exporter = chess.pgn.StringExporter(columns=None, headers=False, variations=False, comments=False)
        currentlinepgn = testgame.accept(exporter)    
        return currentlinepgn

#############################################
