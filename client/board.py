from dom import e, Div, Button, ComboBox, TextArea, Span, CheckBox, Labeled, CopyText
from utils import cpick, View, getglobalcssvarpxint, uci_variant_to_variantkey, scorecolor, IS_PROD, scoreverbal
from basicboard import BasicBoard, VARIANT_OPTIONS, PgnText, PgnList, PgnInfo, MultipvInfo, WHITE, BLACK
from widgets import TabPane, Tab, SplitPane
from widgets import Log, LogItem
from connection import getconn, lichapiget, LICH_API_GAMES_EXPORT

class Board(e):
    def flipcallback(self):
        self.basicboard.setflip(not self.basicboard.flip)        
        self.flip = self.basicboard.flip
        localStorage.setItem("mainboardflip", self.flip)

    def getstoredauto(self):
        self.autoinfo = None
        self.buildauto()
        if self.dostoredauto:
            getconn().sioreq({
                "kind": "getstoredauto",
                "owner": self.id,
                "bookname": self.getautoname(),
                "variantkey": self.basicboard.variantkey,
                "fen": self.basicboard.fen
            })

    def setfromfen(self, fen, positioninfo = {}, edithistory = True):
        self.fen2zobristkeyhex[fen] = None        
        if "zobristkeyhex" in positioninfo:
            self.fen2zobristkeyhex[fen] = positioninfo["zobristkeyhex"]            
        self.trainfen = None
        restartanalysis = False
        if self.analyzing.get():
            self.stopanalyzecallback()
            restartanalysis = True
        if edithistory and ( "genmove" in positioninfo ):
            genmove = positioninfo["genmove"]
            if genmove == "reset":
                self.history = []
            else:
                self.history.append({
                    "fen": self.basicboard.fen,
                    "positioninfo": self.positioninfo
                })
        self.positioninfo = positioninfo                
        self.movelist = cpick("movelist" in self.positioninfo, self.positioninfo["movelist"], [])        
        self.basicboard.setfromfen(fen, self.positioninfo)
        self.basicboard.setflip(self.flip)
        self.buildpositioninfo()        
        if restartanalysis:
            self.analyzecallbackfactory()()        
        self.getstoredanalysisinfo()        
        self.getstoredauto()
        self.storeposinfo()

    def getbookpage(self):
        if self.dobook:
            self.bookdiv.x()
            getconn().sioreq({
                "kind": "getbook",            
                "variantkey": self.basicboard.variantkey,
                "path": self.bookpath,
                "drive": self.bookdrive,
                "fen": self.basicboard.fen,
                "owner": self.id
            })

    def getstoredanalysisinfo(self):
        self.getbookpage()
        self.analysisinfodiv.x()        
        if ( not self.analyzing.get() ) and self.dostoredanalysis:                
            getconn().sioreq({
                "kind": "retrievedb",
                "owner": self.id,
                "path": "analysisinfo/{}/{}".format(self.basicboard.variantkey, self.positioninfo["zobristkeyhex"])
            })

    def setvariantcombo(self):        
        self.variantcombo.setoptions(VARIANT_OPTIONS, self.basicboard.variantkey, self.variantchanged)

    def showcurrentgamepos(self):
        try:
            for j in range(len(self.positioninfos)):
                self.posdivs[j].arc(j == self.gamei, "boardposdivselected")
                if j == self.gamei:
                    self.posdivs[j].e.scrollIntoView({"block": "center", "inline": "center"})
        except:
            pass

    def posclickedfactory(self, i):
        def poslicked():
            self.gamei = i
            pinfo = self.positioninfos[i]
            self.setfromfen(pinfo["fen"], pinfo["positioninfo"])
            self.showcurrentgamepos()
            self.history = []            
            self.tabpane.selectbykey("analysis")
        return poslicked

    def selectgamei(self, i):
        if len(self.positioninfos) > 0:
            self.posclickedfactory(i)()            

    def gamehere(self):
        self.selectgamei(self.gamei)

    def gametobegin(self):
        self.gamei = 0
        self.selectgamei(self.gamei)            

    def gameback(self):
        self.gamei -= 1
        if self.gamei < 0:
            self.gamei = 0
        self.selectgamei(self.gamei)            

    def gameforward(self):
        self.gamei += 1
        if self.gamei >= len(self.positioninfos):
            self.gamei = len(self.positioninfos) - 1
        self.selectgamei(self.gamei)            

    def gametoend(self):
        self.gamei = len(self.positioninfos) - 1
        self.selectgamei(self.gamei)            

    def getcurrentline(self):
        try:
            sans = []
            hm = -1
            for pinfo in self.positioninfos:
                posinfo = pinfo["positioninfo"]
                genmove = "*"
                if "genmove" in posinfo:
                    genmove = posinfo["genmove"]["san"]
                if ( hm % 2 ) == 0:
                    genmove = "{}. {}".format(hm/2 + 1, genmove)                
                hm += 1
                if hm <= self.gamei:
                    sans.append(genmove)                            
            return " ".join(sans)
        except:
            print("could not get current line")
            pass

    def buildgame(self):
        self.gamediv.x()        
        self.posdivs = []
        i = 0
        for pinfo in self.positioninfos:
            fen = pinfo["fen"]
            posinfo = pinfo["positioninfo"]
            genmove = "*"
            if "genmove" in posinfo:
                genmove = posinfo["genmove"]["san"]
            posdiv = Div().ac("boardposdiv")
            self.posdivs.append(posdiv)
            posdiv.ae("mousedown", self.posclickedfactory(i))            
            movediv = Div().ac("boardposmovediv").html(genmove)
            fendiv = Div().ac("boardposfendiv")
            if self.dogamepreview:
                showboard = BasicBoard({
                    "show": True,
                    "showfen": False,
                    "positioninfo": posinfo,
                    "fen": fen,
                    "squaresize": 20,
                    "flip": self.flip
                })
                fendiv.a(showboard)
            else:
                posdiv.w(500).mt(4)
                fendiv.w(400).pl(4).ml(4).mr(4)
                fendiv.html(fen)
            posdiv.a([movediv, fendiv])
            self.gamediv.a(posdiv)
            i += 1
        self.gamei = 0
        self.gamehere()

    def entryclickedfactory(self, uci):
        def entryclicked():
            if not ( self.moveclickedcallback is None ):
                self.moveclickedcallback(self.basicboard.variantkey, self.basicboard.fen, uci)
        return entryclicked

    def setbook(self, obj):
        self.entrieslist = obj["entrieslist"]
        self.bookdiv.x()
        self.bookcontrolpanel = Div().ac("bigboardanalysiscontrolpanel").w(260)
        self.addgamecontrolbuttons(self.bookcontrolpanel)
        self.bookdiv.a(self.bookcontrolpanel)
        for entry in self.entrieslist:
            uci = entry["uci"]
            san = entry["san"]
            weight = entry["weight"]
            ediv = Div("pbookediv")
            ucidiv = Div("pucidiv").html(uci)
            sandiv = Div("psandiv").html(san)
            weightdiv = Div("pweightdiv").html(weight)
            ediv.a([sandiv, ucidiv, weightdiv])
            ediv.ae("mousedown", self.entryclickedfactory(uci))
            self.bookdiv.a(ediv)

    def automoveclickedfactory(self, uci):
        def automoveclicked():            
            if self.addmovemode:
                self.addmovecallback()
                self.addmovetobook(move)
            elif not ( self.moveclickedcallback is None ):
                self.moveclickedcallback(self.basicboard.variantkey, self.basicboard.fen, uci)
        return automoveclicked

    def getautoname(self):
        self.autoname = localStorage.getItem("autoname/" + self.basicboard.variantkey)
        if not self.autoname:
            self.autoname = "default"
        return self.autoname

    def changebookname(self):
        bookname = window.prompt("Enter book name.", self.getautoname())
        if not bookname:
            return
        localStorage.setItem("autoname/" + self.basicboard.variantkey, bookname)        
        self.getstoredauto()

    def setenvvarfactory(self, key, value):
        if key == "ANALYSISROOT":
            value = self.basicboard.fen
        def settenvvar():            
            valueinput = window.prompt("Enter value for move {}:".format(key), value)
            if not valueinput:
                return
            getconn().sioreq({
                "kind": "setenvvar",
                "key": key,
                "value": valueinput,
                "owner": self.id
            })
        return settenvvar

    def buildauto(self):
        self.autodiv.x()
        self.autonamediv = Div().pad(5).ff("monospace")
        self.booknamediv = Div().disp("inline-block").pad(1).pl(8).bc("#cfc").par(8).fs(16).curlyborder().html(self.getautoname())
        self.autonamediv.a(self.booknamediv)
        self.envvarsdiv = Div().ml(3)            
        if self.posdict:
            self.autobookinfodiv = Div().disp("inline-block")
            self.autobookinfodiv.a(Div().disp("inline-block").pad(3).ml(5).bc("#eef").fs(14).html("numpos {}".format(self.posdict["numpos"])))
            self.autobookinfodiv.a(Div().disp("inline-block").pad(3).ml(5).bc("#fee").html("mod {}".format(self.posdict["mod"])))
            self.autobookinfodiv.a(Div().disp("inline-block").pad(3).ml(5).bc("#fee").html("maxnumbpos {}".format(self.posdict["maxnumbpos"])))
            self.autobookinfodiv.a(Div().disp("inline-block").pad(3).ml(5).bc("#fee").html("maxtotalblobsize {}".format(self.posdict["maxtotalblobsize"])))            
            self.autonamediv.a(self.autobookinfodiv)            
            for item in self.posdict["envvars"]:                
                key = item[0]
                value = item[1]                
                keydiv = Div().cp().fs(10).mar(2).pad(2).bc("#eee").disp("inline-block").html(key)
                keydiv.ae("mousedown", self.setenvvarfactory(key, value))
                valuediv = Div().fs(10).pad(2).bc("#efe").disp("inline-block").html(value)
                self.envvarsdiv.a([keydiv, valuediv])            
            self.updatesdiv = Div().ff("monospace").fs(11)
            self.updatesdiv.a(Div().disp("inline-block").pad(3).mb(1).mt(1).ml(5).bc("#ffe").html("buildinfo {}".format(self.posdict["buildinfo"])))
            self.updatesdiv.a(Div().disp("inline-block").pad(3).mb(1).mt(1).ml(5).bc("#fee").html("lastsync {}".format(self.posdict["lastsync"])))
            self.updatesdiv.a(Div().disp("inline-block").pad(3).mb(1).mt(1).ml(5).bc("#fee").html("lastupload {}".format(self.posdict["lastupload"])))
            self.updatesdiv.a(Div().disp("inline-block").pad(3).mb(1).mt(1).ml(5).bc("#fee").html("lastminimax {}".format(self.posdict["lastminimax"])))
            self.updatesdiv.a(Div().disp("inline-block").pad(3).mb(1).mt(1).ml(5).bc("#fee").html("lastadd {}".format(self.posdict["lastadd"])))
        self.autbookbuttonsdiv = Div().mt(3)
        self.autbookbuttonsdiv.a(Button("Change book name", self.changebookname))
        self.autbookbuttonsdiv.a(Button("Analyze lichess", self.lichessanalysisclicked).ml(5))        
        self.autodiv.a(self.autonamediv)
        self.autonamediv.a(self.autbookbuttonsdiv)
        if self.updatesdiv:
            self.autodiv.a(self.updatesdiv)
        self.autodiv.a(self.envvarsdiv)        
        if not self.autoinfo:
            return
        self.autoinfo = sorted(self.autoinfo, key = lambda item: item["evaluation"], reverse = True)        
        for item in self.autoinfo:            
            score = item["score"]
            evaluation = item["evaluation"]
            haspv = item["haspv"]
            uci = item["algeb"]
            depth = item["depth"]
            itemdiv = Div().disp("flex").ai("center")
            san = item["san"]
            if haspv > 0:
                san += " ..."
            sandiv = Div().w(80).bc("#ffe").ta("center").pad(3).fs(20).cp().fw("bold").html(san).c(scorecolor(evaluation)).mar(2)        
            sandiv.ae("mousedown", self.automoveclickedfactory(uci))
            itemdiv.a(sandiv)            
            evaldiv = Div().w(80).bc("#efe").ta("center").pad(3).fs(20).cp().fw("bold").html(scoreverbal(evaluation)).c(scorecolor(evaluation)).mar(2)                
            itemdiv.a(evaldiv)
            haspvstr = str(haspv)
            if haspv == 0:
                haspvstr = "-"
            haspvdiv = Div().w(80).bc("#fef").ta("center").pad(3).fs(14).cp().html(haspvstr).mar(2).fst("italic").fw("bold")
            itemdiv.a(haspvdiv)
            depthdiv = Div().w(80).bc("#eef").ta("center").pad(3).fs(20).cp().fw("bold").html(depth).c("#007").mar(2)                
            itemdiv.a(depthdiv)
            scorediv = Div().w(80).bc("#eee").ta("center").pad(3).fs(20).cp().fw("bold").html(scoreverbal(score)).c(scorecolor(score)).mar(2)                
            itemdiv.a(scorediv)
            self.autodiv.a(itemdiv)

    def getcachedanalysisinfobyfen(self, fen):        
        if fen in self.fen2zobristkeyhex:            
            zobristkeyhex = self.fen2zobristkeyhex[fen]            
            if zobristkeyhex:
                try:
                    if self.analysisinfo["zobristkeyhex"] == zobristkeyhex:
                        return self.analysisinfo
                except:                    
                    pass
                if zobristkeyhex in self.zobristkeyhex2analysisinfo:                
                    dataobj = self.zobristkeyhex2analysisinfo[zobristkeyhex]                            
                    if dataobj == "none":
                        return "none"
                    if "analysisinfo" in dataobj:            
                        analysisinfo = dataobj["analysisinfo"]
                        return analysisinfo        
        return None
            
    def sioresfunc(self, response):        
        dataobj = response["dataobj"]
        if dataobj:
            analysisinfo = dataobj["analysisinfo"]
            if analysisinfo:
                self.processanalysisinfo(analysisinfo, True)                
        
        historyobj = response["historyobj"]
        if historyobj:            
            uci_variant = historyobj["uci_variant"]
            chess960 = historyobj["chess960"]
            pgn = historyobj["pgn"]
            pgninfo = PgnInfo(self).setcontent(pgn)
            vk = uci_variant_to_variantkey(uci_variant, chess960)
            self.variantchanged(vk, None, False)         
            self.flip = pgninfo.meblack()            
            self.basicboard.setflip(self.flip)
            localStorage.setItem("mainboardflip", self.flip)
            self.positioninfos = historyobj["positioninfos"]
            self.buildgame()
            self.tabpane.selectbykey("analysis")

        kind = None
        if "kind" in response:
            kind = response["kind"]        
        
        if kind == "retrievedb":
            if "path" in response:
                path = response["path"]
                if path:
                    parts = path.split("/")
                    if len(parts) > 2:
                        if ( parts[0] == "analysisinfo" ) and ( parts[1] == self.basicboard.variantkey ):
                            zobristkeyhex = parts[2]
                            if len(zobristkeyhex) == 16:
                                self.zobristkeyhex2analysisinfo[zobristkeyhex] = "none"
                                if "dataobj" in response:
                                    dobjrd = response["dataobj"]                                    
                                    if dobjrd:
                                        self.zobristkeyhex2analysisinfo[zobristkeyhex] = dobjrd                                

        if kind == "engineout":
            sline = response["sline"]
            li = LogItem({
                "text": sline,
                "kind": "success",
                "prompt": "out > "
            })
            li.container.pad(3).mar(3).bc("#eee")
            self.engineoutlog.log(li)
        elif kind == "enginein":
            sline = response["sline"]
            li = LogItem({
                "text": sline,
                "kind": "info",
                "prompt": "command > "
            })                 
            li.container.pad(3).mar(3).bc("#ffe")
            self.engineoutlog.log(li)
        elif kind == "analysisinfo":                    
            analysisinfo = response["analysisinfo"]
            self.processanalysisinfo(analysisinfo)
        elif kind == "setbook":
            self.setbook(response)
        elif kind == "setmainboardfen":
            fen = response["fen"]
            pgn = response["pgn"]
            positioninfo = response["positioninfo"]                
            self.setfromfen(fen, positioninfo)
            if pgn:
                self.pgntext.setpgn(pgn)
        elif kind == "addmovetobookok":
            moveuci = response["moveuci"]
            movesan = response["movesan"]
            numpositions = response["numpositions"]
            nummoves = response["nummoves"]
            window.alert("Move {} [ {} ] was added to the book ! Book contains {} position(s) and {} move(s).".format(movesan, moveuci, numpositions, nummoves))
            self.getbookpage()
        elif kind == "setstoredauto":            
            posdict = response["posdict"]            
            self.posdict = posdict            
            if not posdict:
                return
            self.autoinfo = []
            __pragma__("jsiter")                        
            for move in posdict["moves"]:
                movedict = posdict["moves"][move]
                algeb = movedict["algeb"]
                score = movedict["score"]
                evaluation = movedict["eval"]
                haspv = movedict["haspv"]
                depth = movedict["depth"]
                __pragma__("nojsiter")                  
                try:
                    for moveinfo in self.positioninfo["movelist"]:
                        if moveinfo["uci"] == algeb:
                            san = moveinfo["san"]
                            self.autoinfo.append({
                                "algeb": algeb,
                                "san": san,                            
                                "score": score,
                                "evaluation": evaluation,
                                "haspv": haspv,
                                "depth": depth,
                            })
                except:
                    pass
                __pragma__("jsiter")                              
            __pragma__("nojsiter")
            self.buildauto()        

    def siores(self, response):        
        if IS_PROD():
            try:                        
                self.sioresfunc(response)
            except:
                print("error processing siores", response)
        else:
            self.sioresfunc(response)

    def addmovecallback(self):
        self.addmovemode = not self.addmovemode
        self.movelistdiv.arc(self.addmovemode, "movelistaddmovemode")
    
    def setbookpath(self, path, drive = False):
        self.bookpath = path
        self.bookdrive = drive
        self.bookpathdiv.html(self.bookpath)
        self.bookpathdiv.c(cpick(self.bookdrive, "#070", "#700"))
        self.addmovehook.x()
        if self.bookdrive:
            self.addmovehook.a(Button("Add move", self.addmovecallback))

    def storeposinfo(self):
        getconn().sioreq({
            "kind": "storeposinfo",
            "path": "board/{}/posinfo".format(getconn().getuid()),            
            "owner": self.id,
            "dataobj": {
                "variantkey": self.basicboard.variantkey,
                "fen": self.basicboard.fen
            }
        })

    def variantchanged(self, variantkey, fen, docallback = True):                
        self.basicboard.variantkey = variantkey
        self.basicboard.reset()
        if fen:
            self.basicboard.setfromfen(fen)
        try:
            self.basicboard.resize(self.resizewidth, self.resizeheight)            
        except:
            pass
        try:
            self.resizetabpanewidth(self.resizewidth)
        except:
            pass
        if ( not ( self.variantchangedcallback is None ) ) and ( docallback ):
            self.variantchangedcallback(self.basicboard.variantkey, self.basicboard.fen)
        self.basicresize()        
        self.setvariantcombo()                
        self.setbookpath("books/" + self.basicboard.variantkey + ".bin")
        self.setfromfen(self.basicboard.fen)
        self.buildauto()

    def setvariantcallback(self):
        self.variantchanged(self.basicboard.variantkey, None)

    def addmovetobook(self, move):
        moveuci = move["uci"]
        movesan = move["san"]
        weight = 1
        weightinput = window.prompt("Enter weight for move {} [ {} ] :".format(movesan, moveuci), "1")
        if weightinput:
            if not ( weightinput == "" ):                
                try:
                    weight = int(weightinput)
                except:
                    pass
        getconn().sioreq({
            "kind": "addmovetobook",            
            "variantkey": self.basicboard.variantkey,
            "fen": self.basicboard.fen,
            "moveuci": moveuci,
            "movesan": movesan,
            "weight": weight,
            "owner": self.id,
            "path": self.bookpath,
            "drive": self.bookdrive
        })

    def moveclickedfactory(self, move):
        def moveclicked():
            if self.addmovemode:
                self.addmovecallback()
                self.addmovetobook(move)
            elif not ( self.moveclickedcallback is None ):
                self.moveclickedcallback(self.basicboard.variantkey, self.basicboard.fen, move["uci"])
        return moveclicked

    def buildpositioninfo(self):
        self.movelistdiv.x().h(self.totalheight())
        try:
            for move in self.movelist:
                movediv = Div().ac("bigboardshowmove").html(move["san"])
                movediv.ae("mousedown", self.moveclickedfactory(move))
                self.movelistdiv.a(movediv)
        except:
            pass

    def makenullmove(self, fen):
        getconn().sioreq({
            "kind": "mainboardmove",
            "variantkey": self.basicboard.variantkey,
            "fen": fen,
            "moveuci": "null",
            "owner": self.id
        })

    def delcallback(self, event = None, rep = 1):        
        if len(self.history) < rep:
            return        
        for _ in range(rep):
            self.delitem = self.history.pop()
        #self.setfromfen(self.delitem["fen"], self.delitem["positioninfo"], False)
        self.makenullmove(self.delitem["fen"])

    def refreshcallback(self):
        self.setfromfen(self.basicboard.fen, self.basicboard.positioninfo, False)

    def clearcallback(self):
        item = None
        while len(self.history) > 0:
            item = self.history.pop()
        return item

    def clearall(self):        
        fen = self.basicboard.fen
        item = self.clearcallback()
        if item:
            self.variantchanged(self.basicboard.variantkey, fen)
    
    def delallcallback(self):
        item = self.clearcallback()
        if item:
            #self.setfromfen(item["fen"], item["positioninfo"], False)
            self.makenullmove(item["fen"])

    def totalheight(self):
        return self.basicboard.totalheight() + self.controlpanelheight

    def controlwidth(self):
        return max(self.basicboard.outerwidth, self.controlpanelwidth)

    def totalwidth(self):
        return self.controlwidth() + self.movelistdivwidth + self.enginebardivwidth

    def basicresize(self):        
        self.controlpanel.w(self.controlwidth()).mw(self.controlwidth())
        self.sectioncontainer.w(self.controlwidth())
        self.tabpane.resize(None, self.totalheight())

    def resizetabpanewidth(self, width):
        self.tabpane.resize(max(width - self.totalwidth(), 600), None)

    def resizetask(self):
        self.resizewidth = self.resizeorigwidth
        self.resizeheight = self.resizeorigheight - self.controlpanelheight
        self.basicboard.resize(self.resizewidth, self.resizeheight)
        self.basicresize()
        self.buildpositioninfo()
        self.resizetabpanewidth(self.resizeorigwidth)
        self.setenginebar()

    def resize(self, width, height):
        self.resizeorigwidth = width
        self.resizeorigheight = height        
        self.resizetask()

    def analyzecallbackfactory(self, all = False, depthlimit = None, timelimit = None):
        def analyzecallback():
            self.anyinfo = False
            self.depthlimit = depthlimit
            self.timelimit = timelimit
            self.analysisstartedat = __new__(Date()).getTime()
            self.bestmoveuci = None
            self.analyzing.set(True)
            if not ( self.enginecommandcallback is None ):            
                mpv = cpick(all, 200, self.getmultipv())
                self.enginecommandcallback({
                    "kind": "analyze",
                    "variantkey": self.basicboard.variantkey,
                    "multipv": mpv,
                    "fen": self.basicboard.fen,
                    "owner": self.id
                })
        return analyzecallback

    def stopanalyzecallback(self):
        self.analyzing.set(False)
        self.basicboard.clearcanvases()
        if not ( self.enginecommandcallback is None ):
            self.enginecommandcallback({
                "kind": "stopanalyze",
                "owner": self.id
            })

    def analysismoveclicked(self, moveuci, dostore = False):
        if not ( self.moveclickedcallback is None ):
            if dostore:
                #print("storing analysis")
                self.storeanalysiscallback()
            self.moveclickedcallback(self.basicboard.variantkey, self.basicboard.fen, moveuci)

    def setenginebar(self, score = None):
        if score is None:
            score = self.latestscore
        self.latestscore = score
        if self.flip:
            score = -score
        if " b" in self.basicboard.fen:
            score = -score
        self.enginebardiv.x()
        if score < -self.enginebarrange:
            score = -self.enginebarrange
        if score > self.enginebarrange:
            score = self.enginebarrange        
        barheight = ( score + self.enginebarrange ) / (2 * self.enginebarrange) * self.totalheight()
        self.bardiv = Div().pa().w(self.enginebardivwidth).h(barheight).t(self.totalheight() - barheight).l(0)
        self.bardiv.bc(scorecolor(score))        
        self.enginebardiv.a(self.bardiv)
        ticks = ( 2 * self.enginebarrange ) / 100        
        for i in range(1, ticks):
            top = i * self.totalheight() / ticks - 1
            col = "#0f0"
            if i == ticks / 2:
                col = "#fff"
            elif i > ( ticks / 2 ):
                col = "#f00"
            self.enginebardiv.a(Div().pa().t(top).l(0).w(self.enginebardivwidth).h(3).bc(col))

    def getgamesan(self):
        try:
            pinfoitem = self.positioninfos[self.gamei]            
            pinfoitemnext = self.positioninfos[self.gamei + 1]
            fen = pinfoitem["fen"]
            pinfo = pinfoitemnext["positioninfo"]            
            #print(fen, pinfo)            
            if not ( fen == self.basicboard.fen ):
                return None            
            san = pinfo["genmove"]["san"]
            return san
        except:
            #print("could not get game san")
            return None

    def buildanalysisinfodiv(self):
        self.analysisinfodiv.x()
        self.basicboard.clearcanvases()        
        self.maxdepth = 0
        minfos = []
        for infoi in self.analysisinfo["pvitems"]:            
            try:                                   
                minfo = MultipvInfo(infoi, self.analysispvlength)
                minfo.bestmovesanclickedcallback = self.analysismoveclicked
                minfo.bonussliderchangedcallback = self.buildanalysisinfodiv                
                if minfo.depth > self.maxdepth:
                    self.maxdepth = minfo.depth
                minfos.append(minfo)                
            except:                
                pass        
        gamesan = self.getgamesan()
        i = 1
        for minfo in sorted(minfos, key = lambda item: item.effscore(), reverse = True):
            minfo.i = i
            minfo.build(gamesan)
            if i == 1:
                self.bestmoveuci = minfo.bestmoveuci
                self.setenginebar(minfo.effscore())
            iw = 1 / ( 5 * i )
            if self.trainmode == "off":
                self.basicboard.drawuciarrow(minfo.bestmoveuci, {
                    "strokecolor": scorecolor(minfo.effscore()),
                    "linewidth": iw,
                    "headheight": iw
                })
                self.basicboard.highlightucimove(minfo.bestmoveuci, minfo.trainbc, minfo.trainop)
            self.analysisinfodiv.a(minfo)
            i += 1

    def processanalysisinfo(self, obj, force = False):
        if ( not self.analyzing.get() ) and ( not force ):
            return                
        self.anyinfo = True
        elapsed = __new__(Date()).getTime() - self.analysisstartedat
        self.analysisinfo = obj       
        self.analysiszobristkeyhex = self.analysisinfo["zobristkeyhex"]     
        try:
            self.zobristkeyhex2analysisinfo[self.analysiszobristkeyhex] = {
                "analysisinfo": self.analysisinfo
            }
        except:
            print("there was a problem caching analysis info")
            pass
        if not self.trainweightshash:
            self.trainweightshash = {}
        try:
            for pvitem in self.analysisinfo["pvitems"]:
                algeb = pvitem["bestmoveuci"]
                metrainweight = pvitem["metrainweight"]
                opptrainweight = pvitem["opptrainweight"]
                if self.trainweightshash[self.analysiszobristkeyhex]:
                    hashedweights = self.trainweightshash[self.analysiszobristkeyhex]
                    if hashedweights[algeb]:
                        trainweights = hashedweights[algeb]
                        if not metrainweight:
                            pvitem["metrainweight"] = trainweights["metrainweight"]
                        if not opptrainweight:
                            pvitem["opptrainweight"] = trainweights["opptrainweight"]
        except:
            print("there was a problem with getting hashed train weights")
        try:
            if self.trainweightshash[self.analysiszobristkeyhex]:
                hashedweights = self.trainweightshash[self.analysiszobristkeyhex]
            else:
                hashedweights = {}
                self.trainweightshash[self.analysiszobristkeyhex] = hashedweights
            for pvitem in self.analysisinfo["pvitems"]:
                algeb = pvitem["bestmoveuci"]
                metrainweight = pvitem["metrainweight"]
                opptrainweight = pvitem["opptrainweight"]
                hashedweights[algeb] = {
                    "metrainweight": metrainweight,
                    "opptrainweight": opptrainweight
                }            
        except:
            print("there was a problem with hashing train weights")
        self.buildanalysisinfodiv()        
        if ( self.analyzing.get() ) and ( not ( self.depthlimit is None ) ) or ( not ( self.timelimit is None ) ):
            depthok = ( self.depthlimit is None ) or ( self.maxdepth >= self.depthlimit )
            timeok = ( self.timelimit is None ) or ( elapsed >= self.timelimit )
            if depthok and timeok:
                self.stopandstoreanalysis()
                
    def stopandstoreanalysis(self):
        self.stopanalyzecallback()
        if not self.anyinfo:
            return
        self.storeanalysiscallback()

    def makeanalyzedmovecallback(self):
        if not ( self.bestmoveuci is None ):
            if not ( self.moveclickedcallback is None ):
                self.moveclickedcallback(self.basicboard.variantkey, self.basicboard.fen, self.bestmoveuci)

    def storeanalysiscallback(self):
        if not ( self.analysisinfo is None ):
            try:
                zobristkeyhex = self.analysisinfo["zobristkeyhex"]
                for pvitem in self.analysisinfo["pvitems"]:
                    metrainweight = None
                    if "metrainweight" in pvitem:
                        metrainweight = pvitem["metrainweight"]
                    opptrainweight = None
                    if "opptrainweight" in pvitem:
                        opptrainweight = pvitem["opptrainweight"]
                    if not self.trainweightshash[zobristkeyhex]:
                        self.trainweightshash[zobristkeyhex] = {}
                    if not self.trainweightshash[zobristkeyhex][algeb]:
                        self.trainweightshash[zobristkeyhex][algeb] = {}
                    algeb = pvitem["bestmoveuci"]
                    if metrainweight:
                        self.trainweightshash[zobristkeyhex][algeb]["metrainweight"] = metrainweight
                    if opptrainweight:
                        self.trainweightshash[zobristkeyhex][algeb]["opptrainweight"] = opptrainweight
            except:
                print("there was a problem caching analysis info")
                pass
            getconn().sioreq({
                "kind": "storedb",
                "path": "analysisinfo/{}/{}".format(self.basicboard.variantkey, self.analysisinfo["zobristkeyhex"]),            
                "owner": self.id,
                "dataobj": {
                    "analysisinfo": self.analysisinfo
                }
            })
        else:
            window.alert("No analysis to store.")

    def getmultipv(self):
        try:
            multipv = int(self.multipvcombo.v())
            return multipv
        except:
            return self.defaultmultipv

    def analyzingchangedcallback(self):
        self.analysiscontrolpanelbottom.bc(cpick(self.analyzing.get(), "#afa", "#edd"))

    def getconfigscalar(self, path, default):
        if self.configschema is None:
            return default
        found = getscalarfromschema(self.configschema, path)
        if found is None:
            return default
        return found

    def getconfigbool(self, path, default):
        s = self.getconfigscalar(path, None)
        if s is None:
            return default
        if s == "true":
            return True
        if s == "false":
            return False
        return default

    def getconfigint(self, path, default):
        s = self.getconfigscalar(path, None)
        if s is None:
            return default
        try:
            i = int(s)
            return i
        except:
            return default

    def tobookmark(self):
        self.pgnlist.tobookmark()

    def gamesloadedok(self, content):
        self.pgnlist = PgnList(self).setcontent(content)
        self.gamesdiv.x()
        self.gamesdiv.a(Button("Reload", self.loadgames))        
        self.gamesdiv.a(Button("To bookmark", self.tobookmark).ml(5))        
        self.gamesdiv.a(self.gamesloadingdiv.x())
        self.gamesdiv.a(self.pgnlist)
    
    def gameloaderr(self, err):
        print("game load error", err)

    def loadgames(self):
        self.gamesloadingdiv.html("Games loading...")
        if ( not ( self.username is None ) ) and self.dogames:
            lichapiget("{}/{}?max={}{}".format(LICH_API_GAMES_EXPORT, self.username, self.maxgames, self.gamesfilter), self.usertoken, self.gamesloadedok, self.gameloaderr, self.gamesshowlinkdiv)

    def setusername(self, username, usertoken = None):
        self.username = username
        self.usertoken = usertoken
        self.loadgames()
        return self

    def setconfigschema(self, configschema):
        self.configschema = configschema                
        self.showfen = self.getconfigbool("global/showfen", True)           
        self.basicboard.showfen = self.showfen
        self.resizetask()        

    def storeforward(self):        
        self.storeanalysiscallback()
        self.gameforward()

    def storemake(self):
        self.storeanalysiscallback()
        self.makeanalyzedmovecallback()

    def defaultmoveclickedcallback(self, variantkey, fen, moveuci, handletrain = True):        
        if handletrain and ( not self.trainfreecheckbox.getchecked() ):
            if ( ( self.trainmode == "white" ) and ( self.basicboard.turn() == BLACK ) ) or ( ( self.trainmode == "black" ) and ( self.basicboard.turn() == WHITE ) ):
                self.examinealgeb = moveuci            
                self.trainhandler()            
                return
        
        getconn().sioreq({
            "kind": "mainboardmove",
            "variantkey": variantkey,
            "fen": fen,
            "moveuci": moveuci,
            "owner": self.id
        })

    def setvariantandfen(self, variantkey, fen):
        getconn().sioreq({
            "kind": "mainboardsetvariant",
            "variantkey": variantkey,
            "fen": fen,
            "owner": self.id
        })

    def defaultvariantchangedcallback(self, variantkey, fen):
        self.setvariantandfen(variantkey, fen)

    def defaultenginecommandcallback(self, enginecommandobj):
        enginecommandobj["owner"] = self.id
        getconn().sioreq(enginecommandobj)

    def createnewengine(self):
        getconn().sioreq({
            "kind": "createnewengine",
            "owner": self.id
        })

    def killengine(self):
        getconn().sioreq({
            "kind": "killengine",
            "owner": self.id
        })

    def addgamecontrolbuttons(self, panel):
        panel.a(Button("#", self.gamehere).ac("analysiscontrol"))
        panel.a(Button("<<", self.gametobegin).ac("analysiscontrol"))
        panel.a(Button("<", self.gameback).ac("analysiscontrol").w(60))
        panel.a(Button(">", self.gameforward).ac("analysiscontrol").w(60))
        panel.a(Button(">>", self.gametoend).ac("analysiscontrol"))

    def doautoanalyis(self):
        if self.autoanalysis:
            self.storeforward()
            setTimeout(self.doautoanalyis, self.autoanalysisdelay)

    def autoanalysisclicked(self):
        self.autoanalysis = not self.autoanalysis
        self.autoanalysisbutton.bc(cpick(self.autoanalysis, "#afa", "#ccc"))
        if self.autoanalysis:
            self.analyzecallbackfactory()()
            setTimeout(self.doautoanalyis, self.autoanalysisdelay)
        else:
            self.stopanalyzecallback()

    def multipvchanged(self, value):
        localStorage.setItem("mainboardmultipv", value)

    def lichessanalysisclicked(self):
        window.open("https://lichess.org/analysis/" + self.basicboard.variantkey + "/" + self.basicboard.fen, "_blank")

    def lichessgameclicked(self):        
        if self.loadedgameid:            
            url = "https://lichess.org/" + self.loadedgameid + "/" + self.loadedgameside + "#" + str(self.gamei)
            window.open(url, "_blank")

    def fentextchangedcallback(self, fen):
        self.variantchanged(self.basicboard.variantkey, fen)

    def gametabselected(self):        
        self.showcurrentgamepos()

    def showtraininfomsg(self, msg, kind = None):                
        self.traininfodiv.x().a(Div().ff("monospace").html(msg))
        self.traininfodiv.c("#007")
        if kind == "err":
            self.traininfodiv.c("#700")
        if kind == "succ":
            self.traininfodiv.c("#070")

    def favlineclickedfactory(self, favline):
        def favlineclicked():
            fen = favline["fen"]
            self.fentextchangedcallback(fen)
        return favlineclicked

    def getfavlines(self):
        return JSON.parse(localStorage.getItem(self.id + "/favlines"))

    def storefavlines(self, favlines):
        localStorage.setItem(self.id + "/favlines", JSON.stringify(favlines))

    def removefavlinefactory(self, favline, edit = False):
        def removefavline():
            favlines = self.getfavlines()
            newfavlines = []
            for fl in favlines:
                if not ( fl["line"] == favline["line"] ):
                    newfavlines.append(fl)
                elif edit:
                    fl["fen"] = self.basicboard.fen
                    newfavlines.append(fl)
            self.storefavlines(newfavlines)
        return removefavline

    def trainhandler(self):                
        try:
            self.traintimediv.html(__new__(Date()).toLocaleString())
            self.trainlinediv.html(self.getcurrentline())
            self.favlinesdiv.x()
            favlines = self.getfavlines()
            for favline in favlines:
                favlinediv = Div().disp("flex").pad(1).mar(1).cp()
                line = favline["line"]
                favlinediv.a([
                    Button("*", self.removefavlinefactory(favline, True)).w(28).h(14).fs(7).bc("#afa"),
                    Button("-", self.removefavlinefactory(favline)).w(14).h(14).fs(7).bc("#faa").ml(2),
                    Div().ml(3).html(line).ae("mousedown", self.favlineclickedfactory(favline))
                ])
                self.favlinesdiv.a(favlinediv)
            self.trainmode = self.traincombo.v()
            if self.trainmode == "off":
                self.trainfen = None
            else:
                trainside = WHITE
                if self.trainmode == "black":
                    trainside = BLACK
                turn = self.basicboard.turn()
                if turn == trainside:                    
                    if self.trainfen == self.basicboard.fen:
                        pass
                    else:
                        analysisinfo = self.getcachedanalysisinfobyfen(self.basicboard.fen)                                                                        
                        if ( analysisinfo == "none" ) or self.analyzing.get():                                                        
                            self.showtraininfomsg("No analysis available to make move.", "err")                            
                            if not self.analyzing.get():
                                self.analyzecallbackfactory()()
                            else:
                                elapsedms = __new__(Date()).getTime() - self.analysisstartedat
                                elapsed = int(elapsedms / 1000)
                                self.showtraininfomsg("Analyzing, elapsed: {} sec(s).".format(elapsed))
                                if(elapsed > 20):
                                    self.showtraininfomsg("Analysis done.", "succ")
                                    self.stopandstoreanalysis()
                        elif analysisinfo and ( not self.analyzing.get() ):
                            ignorepreset = ""
                            foundmoves = []
                            pvitems = analysisinfo["pvitems"]
                            for item in pvitems:
                                try:
                                    opptrainweight = int(item["opptrainweight"])
                                except:
                                    opptrainweight = 0
                                if opptrainweight > 0:
                                    foundmoves.append([item["bestmoveuci"], opptrainweight])
                            if int(Math.random() * 100) > 50:
                                foundmoves = []
                                ignorepreset = "Ignore preset. "
                            if len(foundmoves) > 0:                                
                                algebs = []
                                for moveitem in foundmoves:
                                    for i in range(moveitem[1]):
                                        algebs.append(moveitem[0])                                
                                index = int(Math.random() * len(algebs))
                                if index >= len(algebs):
                                    index = len(algebs) - 1
                                selectedalgeb = algebs[index]                                
                                self.trainfen = self.basicboard.fen                                                                    
                                self.showtraininfomsg("Making training move : {} .".format(selectedalgeb), "succ")
                                self.moveclickedcallback(self.basicboard.variantkey, self.basicboard.fen, selectedalgeb, False)
                            elif len(pvitems) > 0:                                
                                selsize = int(Math.random() * len(pvitems)) + 1
                                if selsize > len(pvitems):
                                    selsize = len(pvitems)
                                if int(Math.random() * 100) > 20:
                                    selsize = 1
                                index = int(Math.random() * selsize)
                                if index >= len(pvitems):
                                    index = len(pvitems) - 1
                                selectedalgeb = pvitems[index]["bestmoveuci"]                                
                                self.trainfen = self.basicboard.fen                                                                    
                                self.moveclickedcallback(self.basicboard.variantkey, self.basicboard.fen, selectedalgeb, False)
                                self.showtraininfomsg("{}Making random engine move [ {} from {} : {} ].".format(ignorepreset, index + 1, selsize, selectedalgeb))                            
                            else:
                                self.trainfen = self.basicboard.fen
                                self.showtraininfomsg("No legal moves.", "err")
                else:                
                    if self.examinealgeb:                    
                        examinealgeb = self.examinealgeb                        
                        analysisinfo = self.getcachedanalysisinfobyfen(self.basicboard.fen)                                                
                        if analysisinfo == "none":      
                            self.showtraininfomsg("No analysis available to check move.", "err")
                            self.examinealgeb = None                                          
                            self.moveclickedcallback(self.basicboard.variantkey, self.basicboard.fen, examinealgeb, False)
                        elif analysisinfo:                        
                            self.examinealgeb = None                                          
                            moveok = False         
                            trainweight = 0               
                            for item in analysisinfo["pvitems"]:
                                if item["bestmoveuci"] == examinealgeb:
                                    try:
                                        trainweight = int(item["metrainweight"])
                                    except:
                                        trainweight = 0
                                    if trainweight > 0:
                                        moveok = True
                                        break                        
                            if moveok:
                                self.showtraininfomsg("Move ok. Weight : {}.".format(trainweight), "succ")
                                self.moveclickedcallback(self.basicboard.variantkey, self.basicboard.fen, examinealgeb, False)
                            else:
                                self.showtraininfomsg("Wrong move.", "err")
                                self.basicboard.setfromfen(self.basicboard.fen)
        except:
            pass

    def traincombochanged(self):
        self.basicboard.setfromfen(self.basicboard.fen)
        self.trainmode = self.traincombo.v()
        if self.trainmode == "white":
            if not self.basicboard.flip:
                self.flipcallback()
        if self.trainmode == "black":
            if self.basicboard.flip:
                self.flipcallback()

    def addtrainline(self):
        favlines = self.getfavlines()
        line = window.prompt("Enter name:", self.getcurrentline())
        favlines.append({
            "line": line,
            "fen": self.basicboard.fen
        })
        self.storefavlines(favlines)

    def takeback(self):
        self.delcallback(None, 2)

    def copylink(self):
        url = document.location.protocol + "//" +document.location.host + "/analysis/" + self.basicboard.variantkey + "/" + self.basicboard.fen
        url = url.replace(" ", "%20")
        self.basicboard.fentext.setText(url)
        self.basicboard.fentext.e.select()
        document.execCommand("copy")

    def parsepgn(self, pgn):
        getconn().sioreq({
            "kind": "parsepgn",
            "owner": self.id,
            "data": pgn
        })

    def gameloaded(self, content):
        #print("loaded", content)
        self.parsepgn(content)

    def getgamebyid(self, id):
        lichapiget("game/export/{}".format(id), None, self.gameloaded, lambda err: print(err), None)

    def gamesinputpastecallback(self, text):        
        re = __new__(RegExp("^https://lichess.org/([0-9a-zA-Z]+)"))
        m = text.match(re)
        if m:
            id = m[1]
            self.getgamebyid(id)
            id = id[:-4]
            self.getgamebyid(id)
        else:
            self.parsepgn(text)

    def screenshot(self):
        self.chartdiv.x()
        html2canvas(self.analysisinfodiv.e).then(lambda canvas: self.chartdiv.e.appendChild(canvas), lambda err: print(err))

    def copypgn(self):
        self.tabpane.selectbykey("pgn")
        self.pgntext.textarea.e.select()
        document.execCommand("copy")

    def __init__(self, args):
        super().__init__("div")
        self.gamei = 0
        self.fen2zobristkeyhex = {}
        self.zobristkeyhex2analysisinfo = {}
        self.addmovemode = False
        self.bookpath = None        
        self.resizeorigwidth = 800
        self.resizeorigheight = 400
        self.showfen = True
        self.flip = False
        if localStorage.getItem("mainboardflip") == "true":
            self.flip = True
        self.positioninfos = []
        self.pgnlist = None
        self.username = None
        self.usertoken = None
        self.configschema = None
        self.depthlimit = None
        self.analysisinfo = None
        self.autoinfo = None
        self.defaultmultipv = 3
        storedmultipv = localStorage.getItem("mainboardmultipv")
        if storedmultipv:
            self.defaultmultipv = storedmultipv
        self.bestmoveuci = None
        self.analyzing = View(self.analyzingchangedcallback, False)
        self.history = []
        self.id = args.get("id", "mainboard")
        self.BARWIDTH = args.get("barwidth", 20)        
        self.RATINGHEIGHT = args.get("ratingheight", 2)
        self.RATINGCLUSTER = args.get("ratingcluster", 25)
        self.maxgames = args.get("maxgames", 25)
        self.gamesfilter = args.get("gamesfilter", "")
        self.analysispvlength = args.get("analysispvlength", 4)
        self.setposinfo = args.get("setposinfo", {
            "variantkey": "standard",
            "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        })
        self.dobook = args.get("dobook", True)
        self.dostoredanalysis = args.get("dostoredanalysis", True)        
        self.dostoredauto = args.get("dostoredauto", True)        
        self.dogames = args.get("dogames", True)
        self.dogamepreview = args.get("dogamepreview", True)
        self.variantchangedcallback = args.get("variantchangedcallback", self.defaultvariantchangedcallback)
        self.moveclickedcallback = args.get("moveclickedcallback", self.defaultmoveclickedcallback)
        self.enginecommandcallback = args.get("enginecommandcallback", self.defaultenginecommandcallback)
        self.background = "/static/img/backgrounds/" + args.get("background", "wood.jpg")
        self.autoanalysisdelay = args.get("autoanalysisdelay", 10) * 1000
        args["movecallback"] = self.moveclickedcallback
        args["fentextchangedcallback"] = self.fentextchangedcallback
        self.basicboard = BasicBoard(args)        
        self.controlpanel = Div().ac("boardcontrolpanel")
        self.controlpanelheight = getglobalcssvarpxint("--boardcontrolpanelheight")
        self.controlpanelwidth = 260
        self.controlpanel.a(Button("Flip", self.flipcallback))        
        self.variantcombo = ComboBox()
        self.setvariantcombo()
        self.controlpanel.a(self.variantcombo).w(self.basicboard.outerwidth).mw(self.basicboard.outerwidth)        
        self.controlpanel.a(Button("Reset", self.setvariantcallback))
        self.controlpanel.a(Button("Clearall", self.clearall))
        self.controlpanel.a(Button("Delall", self.delallcallback))
        self.controlpanel.a(Button("#", self.refreshcallback))        
        self.controlpanel.a(Button("Del", self.delcallback))        
        self.sectioncontainer = Div().ac("bigboardsectioncontainer").w(self.basicboard.outerwidth)
        self.sectioncontainer.bci(self.background)
        self.sectioncontainer.a([self.controlpanel, self.basicboard])
        self.verticalcontainer = Div().ac("bigboardverticalcontainer")
        self.movelistdivwidth = 100        
        self.movelistdiv = Div().ac("bigboardmovelist").w(self.movelistdivwidth).mw(self.movelistdivwidth)
        self.enginebardivwidth = 15
        self.enginebarrange = 500
        self.enginebardiv = Div().pr().ac("bigboardenginebar").w(self.enginebardivwidth).mw(self.enginebardivwidth)
        self.analysisdiv = Div()
        self.autodiv = Div()
        self.analysiscontrolpaneltop = Div().ac("bigboardanalysiscontrolpanel")
        self.addgamecontrolbuttons(self.analysiscontrolpaneltop)
        self.analysiscontrolpaneltop.a(Button("Store >", self.storeforward).ac("analysismake"))
        self.analysiscontrolpaneltop.a(Button("Store Make", self.storemake).ac("analysismake"))
        self.analysiscontrolpaneltop.a(Button("Store Stop", self.stopandstoreanalysis).ac("analysisstop"))
        self.analysiscontrolpanelbottom = Div().ac("bigboardanalysiscontrolpanel")
        self.analysiscontrolpanelbottom.a(Button("#", self.getstoredanalysisinfo).ac("analysisanalyze"))
        self.analysiscontrolpanelbottom.a(Button("Analyze", self.analyzecallbackfactory()).ac("analysisanalyze"))
        self.analysiscontrolpanelbottom.a(Button("Analyze all", self.analyzecallbackfactory(True)).ac("analysisanalyze"))
        self.analysiscontrolpanelbottom.a(Button("Quick all", self.analyzecallbackfactory(True, 5, None)).ac("analysisanalyze"))
        self.analysiscontrolpanelbottom.a(Button("Make", self.makeanalyzedmovecallback).ac("analysismake"))
        self.analysiscontrolpanelbottom.a(Button("Stop", self.stopanalyzecallback).ac("analysisstop"))        
        self.analysiscontrolpanelbottom.a(Button("Store", self.storeanalysiscallback).ac("analysisstore"))
        self.autoanalysis = False
        self.autoanalysisbutton = Button("A", self.autoanalysisclicked)        
        self.analysiscontrolpanelbottom.a(self.autoanalysisbutton)
        self.copylinkbutton = Button("H", self.copylink)
        self.analysiscontrolpanelbottom.a(self.copylinkbutton)
        self.screenshotbutton = Button("S", self.screenshot)
        self.analysiscontrolpanelbottom.a(self.screenshotbutton)
        self.lichessanalysisbutton = Button("L", self.lichessanalysisclicked)
        self.analysiscontrolpanelbottom.a(self.lichessanalysisbutton)
        self.lichessgamebutton = Button("G", self.lichessgameclicked)        
        self.analysiscontrolpanelbottom.a(self.lichessgamebutton)
        self.copypgnbutton = Button("C", self.copypgn)
        self.analysiscontrolpanelbottom.a(self.copypgnbutton)
        mopts = []
        for i in range(1,501):
            mopts.append([ str(i), "MultiPV {}".format(i) ])
        self.multipvcombo = ComboBox({
            "selectclass": "boardmultipvcomboselect",
            "optionfirstclass": "boardmultipvcombooptionfirst",
            "optionclass": "boardmultipvcombooption"
        }).setoptions(mopts, str(self.defaultmultipv), self.multipvchanged)
        self.analysiscontrolpanelbottom.a(self.multipvcombo)
        self.analysisdiv.a([self.analysiscontrolpaneltop, self.analysiscontrolpanelbottom])
        self.analysisinfodiv = Div()
        self.analysisdiv.a(self.analysisinfodiv)
        self.gamescontainerdiv = Div()
        self.gamesinputdiv = Div().ms().pad(3)
        self.gamesinput = CopyText({
            "width": 500,
            "pastecallback": self.gamesinputpastecallback
        })
        self.gamesinputdiv.a(self.gamesinput)
        self.gamesshowlinkdiv = Div().ms().pad(3)
        self.gamesloadingdiv = Div()
        self.gamesdiv = Div()
        self.gamescontainerdiv.a([self.gamesinputdiv, self.gamesshowlinkdiv, self.gamesdiv])
        self.gamediv = Div()
        self.pgntext = PgnText()
        self.engineoutpane = SplitPane({
            "controlheight": 40
        })        
        self.engineoutpane.controlpanel.a([
            Button("Analyze", self.analyzecallbackfactory()),
            Button("Stop", self.stopanalyzecallback),
            Button("New engine", self.createnewengine),
            Button("Kill engine", self.killengine),
        ])
        self.engineoutlog = Log()
        self.engineoutpane.setcontentelement(self.engineoutlog)
        self.bookpane = SplitPane({
            "controlheight": 40
        })        
        self.bookpathdiv = Div("bookpathdiv")
        self.addmovehook = Div()
        self.bookpane.controlpanel.a([
            self.bookpathdiv,
            self.addmovehook
        ])        
        self.bookdiv = Div().ms().fs(20)
        self.bookpane.setcontentelement(self.bookdiv)
        self.chartdiv = Div()
        if not localStorage.getItem(self.id + "/favlines"):
            localStorage.setItem(self.id + "/favlines", "[]")
        self.traindiv = Div().mar(3)
        self.traincombo = ComboBox().setoptions([
            ["off", "Training off"],            
            ["black", "Train White"],
            ["white", "Train Black"]
        ], "off", self.traincombochanged)        
        self.traincontrols = Div().disp("flex").jc("space-around").ai("center").h(40).w(500).bc("#eee")
        self.traintimediv = Div().w(200).bc("#eff").html("time").ff("monospace").ta("center")
        self.trainfreecheckbox = CheckBox()
        self.traincontrols.a([
            self.traincombo,
            Labeled("Free", self.trainfreecheckbox),
            Button("Take back", self.takeback),
            Button("+", self.addtrainline),
            self.traintimediv
        ])
        self.traininfodiv = Div().disp("flex").jc("space-around").ai("center").h(40).w(500).bc("#eee").mt(2)
        self.trainlinediv = Div().mt(2).pad(1).ff("monospace").c("#00f").bc("#eee")
        self.favlinesdiv = Div().mt(2).ff("monospace")
        self.traindiv.a([self.traincontrols, self.traininfodiv, self.trainlinediv, self.favlinesdiv])
        window.setInterval(self.trainhandler, 500)
        self.tabpane = TabPane({
            "kind":"normal", 
            "id":"board",
            "tabs": [
                Tab("analysis", "Analysis", self.analysisdiv),
                Tab("train", "Train", self.traindiv),
                Tab("auto", "Auto", self.autodiv),
                Tab("book", "Book", self.bookpane),
                Tab("game", "Game", self.gamediv, self.gametabselected),
                Tab("pgn", "Pgn", self.pgntext),
                Tab("games", "Games", self.gamescontainerdiv),
                Tab("chart", "Chart", self.chartdiv),
                Tab("engineout", "Engine out", self.engineoutpane)
            ],
            "selected": "analysis"
        })        
        self.verticalcontainer.a([self.sectioncontainer, self.enginebardiv, self.movelistdiv, self.tabpane])
        self.a(self.verticalcontainer)
        self.basicresize()                
        self.variantchanged(self.setposinfo["variantkey"], self.setposinfo["fen"])