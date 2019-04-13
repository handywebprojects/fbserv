from utils import ge, cpick, getelse, getrec, getrecm, escapeHTML, allchilds, getext, IS_DEV, queryparams
from dom import Div, Span, TextInput, PasswordInput, Button, Label, Hlink
from widgets import TabPane, Tab, FileUploader, SplitPane
from schema import Schema
from system import DirBrowser, ProcessConsole, Doc, ProcessPane, Config
from board import Board
from connection import createconn, getconn
from widgets import Log
from forumgame import Forumgame

######################################################
# client
class Client:
    def __init__(self):        
        self.isadmin = False
        self.root = ge("clientroot")        
        self.owners = {}        
        self.config = Config()
        self.authdone = False
        self.connectdone = False

    def driveeditclickedcallback(self, dir):
        ext = getext(dir)
        if ext == "bin":
            self.mainboard.setbookpath(dir, True)
            self.mainboard.tabpane.selectbykey("book")
            self.tabs.selectbykey("board")
            self.mainboard.getbookpage()
            return True

    def requestbots(self):
        getconn().sioreq({
            "kind": "getmybots"
        })

    def createbotdiv(self):
        self.botdiv = Div()
        self.botresultdiv = Div()
        self.botdiv.a(Button("Request bots", self.requestbots).mar(10))                                
        self.botdiv.a(Hlink("/bots","Bots page"))
        self.botdiv.a(self.botresultdiv)

    def build(self):        
        self.root.innerHTML = ""     

        self.owners["config"] = self.config

        if self.dodirbrowser:
            self.maindirbrowser = DirBrowser({
                "id": "maindirbrowser"            
            })
            self.owners["maindirbrowser"] = self.maindirbrowser
        else:
            self.maindirbrowser = Div()

        if self.dodrive:
            self.drive = DirBrowser({
                "id": "drive",
                "drive": True,
                "editclickedcallback": self.driveeditclickedcallback
            })
            self.owners["drive"] = self.drive
        else:
            self.drive = Div()

        self.createbotdiv()                

        if self.doboard:
            self.mainboard = Board({
                "dobook": self.dobook,
                "dostoredanalysis": self.dostoredanalysis,                
                "dostoredauto": self.dostoredauto,
                "dogames": self.dogames,
                "setposinfo": self.setposinfo,
                "dogamepreview": self.dogamepreview,
                "background": self.boardbackground,
                "autoanalysisdelay": self.autoanalysisdelay,
                "maxgames": self.maxgames,
                "gamesfilter": self.gamesfilter,
                "analysispvlength": self.analysispvlength
            })            
            self.mainboard.setusername(self.username, self.usertoken)
            self.mainboard.tabpane.controlpanel.ac("subcontrolpanel")
            self.owners["mainboard"] = self.mainboard                
        else:
            self.mainboard = Div()

        if self.dodocs:
            self.doc = Doc()           
            self.srcdiv = self.doc.srcdiv             
            self.owners["doc"] = self.doc                        
        else:
            self.doc = Div()
            self.srcdiv = Div()

        if self.doabout:
            self.about = Doc({
                "id": "about",
                "startpage": "about",
                "showcontentslink": False
            })                       
            self.owners["about"] = self.about
        else:
            self.about = Div()            

        if self.isadmin:
            self.processpane = ProcessPane({
                "configsch": self.config.getpath("processes")
            })
            self.processpane.processtabpane.controlpanel.ac("subcontrolpanel")                
        else:
            self.processpane = Div("featureplaceholder").html("Admin only feature.")

        self.forumgametab = Tab("forumgame", "Forum game", Div("featureplaceholder").html("Forum game disabled."))
        if self.doforumgame:
            self.forumgame = Forumgame()
            self.forumgame.mainboard = self.mainboard
            self.owners["forumgame"] = self.forumgame
            self.forumgametab = Tab("forumgame", "Forum game", self.forumgame)        

        self.tabs = TabPane({
            "id": "maintabpane",
            "fillwindow": True,
            "tabs": [                
                Tab("config", "Config", self.config),
                Tab("upload", "Upload", FileUploader({"url": "/upload"})),
                Tab("board", "Board", self.mainboard),
                self.forumgametab,
                Tab("process", "Process", self.processpane),
                Tab("dirbrowser", "Dirbrowser", self.maindirbrowser),
                Tab("drive", "Drive", self.drive),
                Tab("bots", "Bots", self.botdiv),
                Tab("doc", "Doc", self.doc),
                Tab("src", "Src", self.srcdiv),
                Tab("log", "Log", getconn().log),
                getconn().profiletab,
                Tab("about", "About", self.about)
            ],
            "selected": "drive"
        })        
        
        self.root.appendChild(self.tabs.e)

        qseltab = queryparams.get("tab", None)
        if qseltab:
            self.tabs.selectbykey(qseltab)

    def onready(self):
        getconn().sioreq({
            "kind": "connected",
            "queryparams": queryparams
        })

    def setloadinfo(self, content):
        ge("connectmsg").innerHTML = content

    def onconnect(self):
        self.connectdone = True
        if self.authdone:
            self.onready()
        else:            
            self.setloadinfo("Authenticating, please wait ...")

    def onauth(self):
        self.authdone = True
        if self.connectdone:
            self.onready()
        else:            
            self.setloadinfo("Authenticated, connecting to server, please wait ...")

    def getschemaconfigfromobj(self, obj):
        self.config.setschemaconfig(obj["schemaconfig"])
         
        self.dodocs = self.config.get("global/dodocs", True)
        self.dobook = self.config.get("global/dobook", True)
        self.username = self.config.get("global/username")
        self.usertoken = self.config.get("global/usertoken")
        self.dostoredanalysis = self.config.get("global/dostoredanalysis", True)        
        self.dodirbrowser = self.config.get("global/dodirbrowser", True)        
        self.dodrive = self.config.get("global/dodrive", True)        
        self.dogames = self.config.get("global/dogames", True)        
        self.doboard = self.config.get("global/doboard", True)        
        self.doabout = self.config.get("global/doabout", True)        
        self.dogamepreview = self.config.get("global/dogamepreview", True)        
        self.doforumgame = self.config.get("global/doforumgame", True)        
        self.dostoredauto = self.config.get("global/dostoredauto", True)        
        self.boardbackground = self.config.get("layout/boardbackground", "wood.jpg")
        self.autoanalysisdelay = self.config.get("global/autoanalysisdelay", True)        
        self.maxgames = self.config.get("global/maxgames", 25)        
        self.gamesfilter = self.config.get("global/gamesfilter", "")        
        self.analysispvlength = self.config.get("global/analysispvlength", 4)        
        self.setposinfo = obj["setposinfo"]

    def buildfromconfiginobj(self, obj):        
        self.getschemaconfigfromobj(obj)                
        self.build()        

    def setmybots(self, obj):        
        botprofiles = obj["mybots"]        
        self.botresultdiv.x()
        __pragma__("jsiter")
        for id in botprofiles:
            botprofile = botprofiles[id]                        
            self.botresultdiv.a(Div().html("{} {}".format(botprofile["username"], cpick(botprofile["online"], "online", "offline"))).fs(25).pad(5))
            self.botresultdiv.a(Div().html("follow {} games {} last move {}".format(botprofile["nbFollowers"], botprofile["count"]["all"], botprofile["lastmoveago"])).fs(20).pad(3))
            self.botresultdiv.a(Div().html("last players {}".format(botprofile["lastplayers"])).fs(20).pad(3))
        __pragma__("nojsiter")

    def siores(self, obj):
        self.isadmin = obj["isadmin"]
        if queryparams.get("noadmin", "false") == "true":            
            self.isadmin = False
        if "kind" in obj:
            kind = obj["kind"]
            if kind == "buffered":
                for item in obj["items"]:
                    self.siores(item)
            elif kind == "connectedack":
                self.buildfromconfiginobj(obj)                
            elif kind == "configsaved":
                window.alert("Config saved, {} characters".format(obj["size"]))
                location.reload()                        
            elif kind == "alert":
                window.alert(obj["data"])
                if obj["reload"]:
                    location.reload()                                    
            elif kind == "proc":
                self.processpane.siores(obj)
            elif kind == "storedb":
                pass
            elif kind == "storedbfailed":
                pass
            elif kind == "retrievedbfailed":
                pass            
            elif kind == "mybots":
                self.setmybots(obj)
            else:                  
                if IS_DEV():
                    self.owners[obj["owner"]].siores(obj)
                else:
                    try:
                        self.owners[obj["owner"]].siores(obj)
                    except:
                        print("could not handle", obj)

            if kind == "showdoc":                
                if obj["switchtodoctab"]:
                    self.tabs.selectbykey("doc")

    def authtimeout(self):
        if not self.authdone:
            print("authtimeout")
            self.onauth()

    def startup(self):                
        createconn({            
            "connectcallback": self.onconnect,
            "authcallback": self.onauth,
            "siorescallback": self.siores
        })
        if IS_DEV():
            setTimeout(self.authtimeout, 3000)
######################################################
