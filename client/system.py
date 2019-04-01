from dom import e, Div
from widgets import Tab, TabPane, SplitPane, ProcessInput, LogItem, Log, FileUploader
from dom import Button, TextArea, Span
from utils import escapeHTML, allchilds, getrecm
from connection import getconn
from schema import Schema

DIR_ITEM_FIELDS = [
    [ "name", "filename" ],
    [ "st_size", "size" ],
    [ "isdir", "isdir" ],    
    [ "st_mtime", "mtime" ],
    [ "st_mode_unix_rwx", "rwx" ]
]

class DirItem(e):
    def __init__(self, obj):
        super().__init__("div")
        self.container = Div("diritem")                
        for field in DIR_ITEM_FIELDS:            
            self[field[1]] = obj[field[0]]
            fdiv = Div(field[1])
            self[field[1] + "div"] = fdiv
            self.container.a(fdiv)
        if self.isdir:            
            self.container.ac("isdir")
        self.filenamelabel = Div().html(self.filename)        
        self.filenamediv.a([self.filenamelabel])
        self.deletebutton = None
        if self.filename == "..":
            self.filenamediv.ac("parent")
        else:
            self.deletebutton = Button("Delete").ac("delete")
            self.isdirdiv.a(self.deletebutton)
            self.mtimediv.html(__new__(Date(self.mtime * 1000)).toLocaleString())
        if self.isdir:
            self.sizediv.html("dir")            
        else:
            self.editbutton = Button("Edit")
            self.filenamediv.a(self.editbutton)
            self.sizediv.html(self.size)        
        if self.rwx:
            self.rwxdiv.html(self.rwx)        
        self.a(self.container)

class EditTextarea(e):
    def resize(self, width, height):
        self.textarea.w(width - 9).h(height - 9)

    def setText(self, text):
        self.textarea.setText(text)
        return self
    
    def getText(self):
        return self.textarea.getText()

    def __init__(self):
        super().__init__("div")
        self.textarea = TextArea()
        self.a(self.textarea)

class Editor(e):
    def setpath(self, path):
        self.path = path
        self.pathlabel.html(self.path)

    def resize(self, width, height):
        self.editdiv.resize(width, height)

    def setText(self, text):
        self.edittextarea.setText(text)
        return self
    
    def getText(self):
        return self.edittextarea.getText()

    def __init__(self):
        super().__init__("div")
        self.editdiv = SplitPane({
            "controlheight": 40
        })
        self.pathlabel = Div("pathlabel")
        self.editdiv.controlpanel.a(self.pathlabel)
        self.reloadbutton = Button("Reload")
        self.savebutton = Button("Save")
        self.editdiv.controlpanel.a([self.reloadbutton, self.savebutton])   
        self.edittextarea = EditTextarea()        
        self.editdiv.setcontentelement(self.edittextarea)
        self.a(self.editdiv)

class DirBrowser(e):
    def path(self):
        if len(self.pathlist) == 0:
            return "."
        return "/".join(self.pathlist)

    def dirclickedfactory(self, dir):
        def dirclicked():
            if dir == "..":
                if len(self.pathlist) > 0:
                    self.pathlist.pop()
                self.requestdirlist()
            else:
                self.pathlist.append(dir)
                getconn().sioreq({
                    "kind": "appenddirtopath",
                    "owner": self.id,
                    "drive": self.drive,                    
                    "dirpath": self.path(),
                    "dir": dir
                })
                self.pathlist.pop()
        return dirclicked

    def openclickedfactory(self, dir):
        def openclicked():
            if self.drive:
                window.open("/file/drive/" + getconn().getuid() + "/" + self.comppath(dir))
            else:
                window.open("/file/" + self.comppath(dir))
        return openclicked

    def editclickedfactory(self, dir):
        def editclicked(ev):
            ev.stopPropagation()
            if self.editclickedcallback:
                if self.editclickedcallback(dir):
                    return
            self.requestpath(self.comppath(dir))
        return editclicked

    def deletefileclickedfactory(self, dir):
        def deletefileclicked(ev):            
            if window.confirm("Delete file [ " + dir + " ] ?"):                
                self.requestdeletefile(dir)
        return deletefileclicked

    def deletedirclickedfactory(self, dir):
        def deletedirclicked(ev):            
            if window.confirm("Delete directory [ " + dir + " ] ?"):                
                self.requestdeletedir(dir)
        return deletedirclicked

    def appenditem(self, item):
        di = DirItem(item)
        self.filescontentdiv.a(di)
        if item["isdir"]:
            di.filenamediv.ae("mousedown", self.dirclickedfactory(item["name"]))                
            if di.deletebutton:
                di.deletebutton.ae("mousedown", self.deletedirclickedfactory(item["name"]))
        else:
            di.filenamediv.ae("mousedown", self.openclickedfactory(item["name"]))
            di.editbutton.ae("mousedown", self.editclickedfactory(item["name"]))
            di.deletebutton.ae("mousedown", self.deletefileclickedfactory(item["name"]))

    def build(self):
        dirs = []
        files = []
        self.listing = sorted(self.listing, key = lambda item: item["name"].toLowerCase())
        for item in self.listing:
            if item["isdir"]:
                dirs.append(item)
            else:
                files.append(item)        
        self.listing = []
        for item in dirs:
            self.listing.append(item)
        for item in files:
            self.listing.append(item)        
        self.pathlabel.html(self.path())                
        self.filescontentdiv.x()
        if len(self.pathlist) > 0:
            self.appenditem({
                "name": "..",
                "isdir": True
            })
        for item in self.listing:
            self.appenditem(item)

    def siores(self, obj):
        if "kind" in obj:
            kind = obj["kind"]            
            if kind == "setdirlist":
                self.listing = obj["listing"]
                self.build()
            elif kind == "pathcontent":
                self.editor.setpath(obj["path"])
                self.editor.setText(obj["content"])
                self.tabs.selectbykey("edit")
            elif kind == "appenddirtopath":
                self.pathlist.append(obj["dir"])
                self.requestdirlist()
            elif kind == "appenddirtopathfailed":
                window.alert("Opening directory failed. Status: {} .".format(obj["status"]))
            elif kind == "getdirlistfailed":
                window.alert("Get dirlist failed. Status: {} .".format(obj["status"]))
            elif kind == "getpathfailed":
                window.alert("Get path failed. Status: {} .".format(obj["status"]))
            elif kind == "createfilefailed":
                window.alert("Create file failed. Status: {} .".format(obj["status"])) 
            elif kind == "createdirfailed":
                window.alert("Create directory failed. Status: {} .".format(obj["status"]))
            elif kind == "deletefilefailed":
                window.alert("Delete file failed. Status: {} .".format(obj["status"]))
            elif kind == "deletedirfailed":
                window.alert("Delete directory failed. Status: {} .".format(obj["status"]))
            elif kind == "savefilefailed":
                window.alert("Save file failed. Status: {} .".format(obj["status"]))

    def comppath(self, path):
        if self.path() == ".":
            return path
        return self.path() + "/" + path

    def requestdirlist(self):        
        getconn().sioreq({
            "kind": "getdirlist",
            "owner": self.id,
            "drive": self.drive,
            "dirpath": self.path()
        })

    def requestpath(self, path):        
        getconn().sioreq({
            "kind": "getpath",
            "owner": self.id,
            "drive": self.drive,
            "path": path
        })

    def requestcreatefile(self, createname):        
        getconn().sioreq({
            "kind": "createfile",
            "owner": self.id,
            "drive": self.drive,            
            "path": self.comppath(createname),
            "dirpath": self.path()
        })

    def requestcreatedir(self, createname):        
        getconn().sioreq({
            "kind": "createdir",
            "owner": self.id,
            "drive": self.drive,            
            "path": self.comppath(createname),
            "dirpath": self.path()
        })

    def requestdeletefile(self, dir):        
        getconn().sioreq({
            "kind": "deletefile",
            "owner": self.id,                
            "drive": self.drive,            
            "path": self.comppath(dir),
            "dirpath": self.path()
        })

    def requestdeletedir(self, dir):        
        getconn().sioreq({
            "kind": "deletedir",
            "owner": self.id,                
            "drive": self.drive,            
            "path": self.comppath(dir),
            "dirpath": self.path()
        })

    def requestsave(self, path, content):        
        getconn().sioreq({
            "kind": "savefile",
            "owner": self.id,                
            "drive": self.drive,            
            "content": content,
            "path": path
        })

    def requestziptocloud(self):        
        getconn().sioreq({
            "kind": "ziptocloud",
            "owner": self.id,                
            "drive": self.drive
        })

    def requestunzipfromcloud(self):        
        getconn().sioreq({
            "kind": "unzipfromcloud",
            "owner": self.id,                
            "drive": self.drive
        })

    def resize(self, width, height):
        self.tabs.resize(width, height)
        self.build()

    def reloadclicked(self):
        self.requestpath(self.editor.path)

    def saveclicked(self):
        self.requestsave(self.editor.path, self.editor.getText())

    def createfileclicked(self):
        createname = window.prompt("Enter file name", "foo.txt")
        if createname:
            if not ( createname == "" ):                
                self.requestcreatefile(createname)

    def createdirclicked(self):
        createname = window.prompt("Enter directory name", "foo")
        if createname:
            if not ( createname == "" ):                
                self.requestcreatedir(createname)

    def refreshclicked(self):
        self.requestdirlist()

    def ziptocloudclicked(self):
        self.requestziptocloud()

    def unzipfromcloudclicked(self):
        self.requestunzipfromcloud()

    def dirbrowseruploadedcallback(self):
        self.tabs.selectbykey("files")
        self.requestdirlist()

    def __init__(self, args = {}):
        super().__init__("div")
        self.ac("dirbrowser")
        self.id = args.get("id", None)        
        self.drive = args.get("drive", False)
        self.editclickedcallback = args.get("editclickedcallback", None)
        self.pathlist = []
        self.listing = []
        self.filesdiv = SplitPane({
            "controlheight": 40
        })
        self.pathlabel = Div("pathlabel")
        self.createfilebutton = Button("Create file", self.createfileclicked)
        self.createdirbutton = Button("Create dir", self.createdirclicked)
        self.refreshbutton = Button("Refresh", self.refreshclicked)
        self.filesdiv.controlpanel.a([self.pathlabel, self.createfilebutton, self.createdirbutton, self.refreshbutton])        
        if self.drive:
            self.ziptocloudbutton = Button("Zip to cloud", self.ziptocloudclicked)
            self.unzipfromcloudbutton = Button("Unzip from cloud", self.unzipfromcloudclicked)
            self.filesdiv.controlpanel.a([self.ziptocloudbutton, self.unzipfromcloudbutton])
        self.filescontentdiv = Div()
        self.filesdiv.setcontentelement(self.filescontentdiv)
        self.editor = Editor()
        self.editor.reloadbutton.ae("mousedown", self.reloadclicked)
        self.editor.savebutton.ae("mousedown", self.saveclicked)
        self.uploader = FileUploader({
            "url": "/dirbrowserupload",
            "accept": "*",
            "acceptdisplay": "file",
            "drive": self.drive,
            "dirbrowseruploadedcallback": self.dirbrowseruploadedcallback,
            "dirbrowsergetpathcallback": self.path,
            "getuid": getconn().getuid
        })
        self.tabs = TabPane({
            "id": self.id + "tabpane",
            "tabs": [                
                Tab("files", "Files", self.filesdiv),                
                Tab("edit", "Edit", self.editor),                
                Tab("upload", "Upload", self.uploader),                
            ],
            "selected": "files"
        })        
        self.tabs.controlpanel.ac("subcontrolpanel")
        self.a(self.tabs)
        self.requestdirlist()

class ProcessConsole(SplitPane):
    def shortcutclickedfactory(self, argsstr):
        def shortcutclicked():
            self.sendline(argsstr)
        return shortcutclicked

    def procout(self, obj):
        subkind = obj["subkind"]
        notify = obj["notify"]
        print("subkind", subkind, notify)
        logkind = "normal"
        content = "<proc>"
        if subkind == "linesent":
            logkind = "info"            
            content = obj["sline"]
        elif subkind == "procstderr":
            logkind = "error"
            content = obj["sline"]
        elif subkind == "procstdout":            
            content = obj["sline"]
        elif notify:
            content = notify
            logkind = "success"
            if notify[0:1] == "!":
                logkind = "error"
        self.log.log(LogItem({
            "prompt": "{} &gt; ".format(obj["key"]),
            "text": content,
            "kind": logkind
        }))

    def sendline(self, sline):
        getconn().sioreq({
            "kind": "sendline",
            "key": self.key,
            "command": self.command,
            "command_args": self.command_args,
            "sline": sline
        })

    def onenter(self):
        sline = self.processinput.getText()
        self.processinput.setText("")
        self.sendline(sline)

    def startcallback(self):
        getconn().sioreq({
            "kind": "startprocess",
            "key": self.key,
            "command": self.command,
            "command_args": self.command_args
        })
    
    def stopcallback(self):
        getconn().sioreq({
            "kind": "stopprocess",
            "key": self.key
        })

    def __init__(self, args = {}):        
        super().__init__(args)        
        self.ac("processconsole")
        self.key = args.get("key", None)        
        self.command = args.get("command", None)
        self.command_args = args.get("command_args", [])
        self.processinput = ProcessInput({
            "buttonlabel": args.get("buttonlabel", "Submit"),
            "entercallback": args.get("entercallback", self.onenter)
        })        
        self.processinput.submitbutton.ac("bluebutton")
        self.startbutton = Button("Start", self.startcallback).ac("greenbutton")
        self.stopbutton = Button("Stop", self.stopcallback).ac("redbutton")
        self.controlpanel.a([self.processinput, self.startbutton, self.stopbutton])        
        self.shortcuts = args.get("shortcuts", [])
        for shortcut in self.shortcuts:
            self.controlpanel.a(Button(shortcut[0], self.shortcutclickedfactory(shortcut[1])))
        self.log = Log()
        self.setcontentelement(self.log)

class Doc(e):
    def siores(self, obj):
        kind = obj["kind"]
        if kind == "showdoc":
            self.setdoc(obj)

    def reflinkclickedfactory(self, ref):
        def reflinkclicked():
            getconn().sioreq({
                "kind": "getdoc",
                "owner": self.id,
                "data": ref
            })
        return reflinkclicked

    def setdoc(self, obj):
        doc = obj["doc"]
        docref = obj["docref"]
        contentlink = "### $!contents$$-> back to Table of contents!$\n"
        if ( not ( docref == "contents" ) ) and self.showcontentslink:                    
            doc = contentlink + doc + contentlink
        dochtml = self.mdconv.makeHtml(doc)                
        parts = dochtml.split("$!")
        newparts = [parts[0]]
        for part in parts[1:]:
            subparts = part.split("!$")
            refparts = subparts[0].split("$$")
            ref = refparts[0]
            refdisplay = refparts[1]
            rest = subparts[1]
            reflink = "<span purpose='reflink' class='docref noselect' docref='{}'>{}</span>".format(ref, refdisplay)
            newparts.append(reflink)
            newparts.append(rest)                
        dochtml = "".join(newparts)                                
        self.docdiv.html(dochtml)
        self.srcdiv.html(escapeHTML(dochtml))
        for child in allchilds(self.docdiv.e):
            try:
                purpose = child.getAttribute("purpose")
                ref = child.getAttribute("docref")
                if purpose == "reflink":
                    child.addEventListener("mousedown", self.reflinkclickedfactory(ref))
            except:
                pass

    def __init__(self, args = {}):
        super().__init__("div")
        self.id = args.get("id", "doc")
        self.startpage = args.get("startpage", "contents")
        self.showcontentslink = args.get("showcontentslink", True)
        self.mdconv = __new__(showdown.Converter())
        self.docdiv = Div("docdiv")        
        self.srcdiv = Div("srcdiv")
        self.a(self.docdiv)
        getconn().sioreq({
            "kind": "getdoc",
            "owner": self.id,
            "data": self.startpage,
            "switchtodoctab": False
        })
    
class ProcessPane(e):
    def __init__(self, args = {}):
        super().__init__("div")        
        self.processconsoles = {}        
        self.configsch = args.get("configsch", {})
        self.id = args.get("id", "processpane")
        try:
            self.build()
        except:
            print("processpane {} build failed from {}".format(self.id, self.configsch))

    def resize(self, width, height):
        if self.processtabpane:
            self.processtabpane.resize(width, height)

    def siores(self, obj):
        key = obj["key"]
        if key in self.processconsoles:
            pc = self.processconsoles[key]
            pc.procout(obj)

    def build(self):
        proctabs = []
        firstkey = None
        for proc in self.configsch.childs:
            processkey = proc.getpath("key").value
            command = proc.getpath("command").value
            args = []
            for arg in proc.getpath("command_args").childs:
                args.append(arg.value)
            if not firstkey:
                firstkey = processkey
            processdisplayname = proc.getpath("displayname").value
            shortcuts = []
            shortcutsobj = proc.getpath("shortcuts")
            if shortcutsobj:
                for shortcut in shortcutsobj.childs:
                    shortcuts.append([shortcut.key, shortcut.value])
            processconsole = ProcessConsole({
                "key": processkey,                
                "command": command,
                "command_args": args,
                "shortcuts": shortcuts
            })
            self.processconsoles[processkey] = processconsole
            proctabs.append(Tab(processkey, processdisplayname, processconsole))
        self.processtabpane = TabPane({
            "id": self.id,
            "tabs": proctabs,
            "selected": firstkey
        })
        self.x().a(self.processtabpane)
        return self
    
class Config(e):
    def serializeconfig(self):
        getconn().sioreq({
            "kind": "serializeconfig",
            "data": self.configschema.toargs(),
            "owner": self.id
        })

    def resize(self, width, height):
        self.configsplitpane.resize(width, height)

    def build(self):
        self.configsplitpane = SplitPane({
            "controlheight": 50
        })        
        self.configdiv = Div("largesheet")
        self.configsplitpane.controlpanel.a(Button("Serialize", self.serializeconfig).ac("controlbutton"))                
        self.configsplitpane.controlpanel.ac("subcontrolpanel")
        self.configschema = Schema(self.schemaconfig)
        self.configdiv.a(self.configschema)        
        self.configsplitpane.setcontentelement(self.configdiv)
        self.x().a(self.configsplitpane)

    def setschemaconfig(self, schemaconfig):
        self.schemaconfig = schemaconfig
        self.build()

    def get(self, path, default):
        return getrecm(path, self.configschema, default)

    def getpath(self, path):
        return self.configschema.getpath(path)

    def __init__(self, args = {}):
        super().__init__("div")
        self.id = args.get("id", "config")
        self.schemaconfig = {
            "kind": "collection",
            "disposition": "dict"
        }
        self.build()