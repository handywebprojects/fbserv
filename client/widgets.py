from dom import e, Div, P, Form, FileInput, Label, TextInput, Button, Span
from utils import getScrollBarWidth, escapeHTML

######################################################
# widgets

MAX_LOGITEMS = 100

class SplitPane(e):
    def resize(self, width = None, height = None):
        if not ( width is None ):
            self.width = max(width, self.minwidth)
        if not ( height is None ):
            self.height = height
        self.contentheight = max(self.height - self.controlheight, self.mincontentheight)
        self.height = self.controlheight + self.contentheight
        self.container.w(self.width).h(self.height)
        self.controlpanel.w(self.width).h(self.controlheight)
        self.contentdiv.w(self.width).h(self.contentheight)
        sbw = getScrollBarWidth()
        self.contentinnerwidth = self.width - sbw
        self.contentinnerheight = self.contentheight - sbw        
        self.contentdiv.x().a(self.contentelement)
        try:
            self.contentelement.resize(self.contentinnerwidth, self.contentinnerheight)
        except:
            pass
        return self

    def setcontentelement(self, contentelement):
        self.contentelement = contentelement
        self.resize(self.width, self.height)
        return self

    def resizetowindow(self):
        self.resize(window.innerWidth, window.innerHeight)
        return self

    def __init__(self, args = {}):
        super().__init__("div")
        self.controlheight = args.get("controlheight", 100)
        self.container = Div(["splitpane", "container"])
        self.controlpanel = Div(["splitpane", "controlpanel"])
        self.contentdiv = Div(["splitpane", "contentdiv"])
        self.container.a([self.controlpanel, self.contentdiv])        
        self.contentelement = Div()
        self.minwidth = args.get("minwidth", 400)        
        self.mincontentheight = args.get("mincontentheight", 200)
        self.resize(args.get("width", 600), args.get("height", 400))
        self.fillwindow = args.get("fillwindow", False)
        if self.fillwindow:
            window.addEventListener("resize", self.resizetowindow)
            self.resizetowindow()
        self.a(self.container)

class Tab(e):
    def __init__(self, key, displayname, element, clickedcallback):
        super().__init__("div")
        self.key = key
        self.displayname = displayname
        self.element = element
        self.clickedcallback = clickedcallback
        self.container = Div(["tab", "container", "noselect"]).html(displayname)
        self.a(self.container)

class TabPane(SplitPane):
    def __init__(self, args = {}):
        args["controlheight"] = args.get("controlheight", 35)        
        super().__init__(args)
        self.tabmargin = args.get("tabmargin", 5)
        self.tabpadding = args.get("tabpadding", 5)
        self.tabs = args.get("tabs", [])
        self.settabs(self.tabs)
        self.tabheight = self.controlheight - 2 * ( self.tabmargin + self.tabpadding )                
        self.tabfontsize = self.tabheight        
        self.id = args.get("id", None)
        self.selected = args.get("selected", None)
        if self.id:
            stored = localStorage.getItem(self.id)
            if stored:
                self.selected = stored                
        self.build()
        self.contentdiv.ae("scroll", self.contentscrolled)

    def scrollpath(self, which):
        return "tabpanecontentscroll/{}/{}/{}".format(self.id, self.selected, which)

    def contentscrolled(self):        
        localStorage.setItem(self.scrollpath("left"), str(self.contentdiv.e.scrollLeft))
        localStorage.setItem(self.scrollpath("top"), str(self.contentdiv.e.scrollTop))        

    def setscroll(self):
        scrollleftstr = localStorage.getItem(self.scrollpath("left"))        
        try:
            self.contentdiv.e.scrollLeft = int(scrollleftstr)            
        except:
            pass
        scrolltopstr = localStorage.getItem(self.scrollpath("top"))
        try:
            self.contentdiv.e.scrollTop = int(scrolltopstr)
        except:
            pass

    def selectbykey(self, key):
        self.selected = key
        if self.id:
            localStorage.setItem(self.id, self.selected)            
        self.build()        

    def tabclickedfactory(self, tab):
        def tabclicked():            
            self.selectbykey(tab.key)
            if tab.clickedcallback:
                tab.clickedcallback()
        return tabclicked

    def settabs(self, tabs):
        self.tabs = tabs
        for tab in self.tabs:
            tab.ae("mousedown", self.tabclickedfactory(tab))
            tab.element.parenttabpane = self
        return self

    def build(self):        
        self.controlpanel.x()
        for tab in self.tabs:            
            tab.container.h(self.tabheight).pad(self.tabpadding).pl(2 * self.tabpadding).par(2 * self.tabpadding)
            self.controlpanel.a(tab)
            tab.container.arc(tab.key == self.selected, "selected").fs(self.tabfontsize)
            if tab.key == self.selected:
                self.setcontentelement(tab.element)            
        self.setscroll()
        return self

#https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/

class FileUploader(e):
    def fileinputchanged(self):
        self.files = self.fileinput.files()
        self.handlefiles()

    def preventdefaults(self, ev):
        ev.preventDefault()
        ev.stopPropagation()

    def highlight(self):
        self.droparea.ac("highlight")

    def unhighlight(self):
        self.droparea.rc("highlight")

    def log(self, html):
        self.infoitems.append(html)
        self.infoitems.reverse()
        self.info.html("<br>".join(self.infoitems))
        self.infoitems.reverse()

    def loginfo(self, content):
        try:
            json = JSON.parse(content)
            if json["success"]:
                if self.dirbrowseruploadedcallback:
                    self.dirbrowseruploadedcallback()
                    self.log("Uploaded <span class='fileuploadfilename'>{}</span> .".format(json["filename"]))
                else:
                    path = "/uploads/{}".format(json["savefilename"])                
                    self.log("uploaded <span class='fileuploadfilename'>{}</span> <a href='{}' target='_blank' rel='noopener noreferrer'>{}</a> <br> <font size='2'> media link <a href='{}' target='_blank' rel='noopener noreferrer'>{}</a> </font>".format(json["filename"], path, path, json["medialink"], json["medialink"]))    
            else:
                self.log("<span class='fileuploaderror'>File upload failed. Status: {} .</span>".format(json["status"]))
        except:            
            self.log("Error parsing response as JSON.")

    def uploadfile(self, file):        
        if self.url is None:
            print("no upload url")
            return

        formdata = __new__ (FormData())

        formdata.append('files', file)
        formdata.append('drive', self.drive)
        if self.getuid:            
            formdata.append('uid', self.getuid())        
        if self.dirbrowsergetpathcallback:
            formdata.append("dirpath", self.dirbrowsergetpathcallback())

        __pragma__("jsiter")

        args = {
            "method": 'POST',
            "body": formdata
        }

        __pragma__("nojsiter")

        fetch(self.url, args).then(
            lambda response: response.text().then(
                lambda content: self.loginfo(content),
                lambda err: self.loginfo(err)    
            ),
            lambda err: self.loginfo(err)
        )

    def handlefiles(self, files = self.files):
        for i in range(files.length):
            print("uploading file {}".format(i))
            self.uploadfile(files.item(i))

    def handledrop(self, ev):
        self.dt = ev.dataTransfer
        self.files = self.dt.files

        self.handlefiles()

    def build(self):
        self.x()
        self.droparea = Div("fileuploaddroparea")
        self.form = Form().ac("fileuploadform")
        self.desc = P().ac("fileuploadp").html("Upload {}s with the file dialog or by dragging and dropping them onto the dashed region".format(self.acceptdisplay))
        self.fileinput = FileInput().ac("fileuploadfileelem").setmultiple(self.multiple).setaccept(self.accept)        
        self.fileinput.sa("id", "fileinputelement")
        self.fileinput.ae("change", self.fileinputchanged)
        self.button = Label().ac("fileuploadbutton").sa("for", "fileinputelement").html("Select some {}s".format(self.acceptdisplay))
        self.form.a([self.desc, self.fileinput, self.button])
        self.droparea.a(self.form)
        for eventname in ["dragenter", "dragover", "dragleave", "drop"]:
            self.droparea.ae(eventname, self.preventdefaults)
        for eventname in ["dragenter", "dragover"]:
            self.droparea.ae(eventname, self.highlight)
        for eventname in ["dragleave", "drop"]:
            self.droparea.ae(eventname, self.unhighlight)
        self.droparea.ae("drop", self.handledrop)
        self.info = Div("fileuploadinfo")
        self.infoitems = []
        self.a([self.droparea, self.info])

    def __init__(self, args = {}):
        super().__init__("div")
        self.url = args.get("url", None)
        self.multiple = args.get("multiple", True)
        self.accept = args.get("accept", "image/*")
        self.acceptdisplay = args.get("acceptdisplay", "image")
        self.drive = args.get("drive", False)
        self.dirbrowseruploadedcallback = args.get("dirbrowseruploadedcallback", None)        
        self.dirbrowsergetpathcallback = args.get("dirbrowsergetpathcallback", None)
        self.getuid = args.get("getuid", None)
        self.build()

class ProcessInput(e):    
    def onenter(self):
        self.textinput.rc("textinputediting")
        if self.entercallback:
            self.entercallback()

    def getText(self):
        return self.textinput.getText()

    def setText(self, content):
        self.textinput.setText(content)
        return self

    def __init__(self, args = {}):
        super().__init__("div")
        self.container = Div("processinput")
        self.buttonlabel = args.get("buttonlabel", "Submit")        
        self.entercallback = args.get("entercallback", None)
        self.textinput = TextInput().setentercallback(self.entercallback)
        self.submitbutton = Button(self.buttonlabel, self.onenter)
        self.container.a([self.textinput, self.submitbutton])
        self.a(self.container)

class LogItem(e):
    def __init__(self, args = {}):        
        super().__init__("div")        
        self.text = args.get("text", "")
        self.kind = args.get("kind", "normal")
        self.prompt = args.get("prompt", None)
        self.container = Div("logitem")
        self.container.ac(self.kind)
        self.promptspan = Span().ac("prompt")
        if self.prompt:
            self.promptspan.html(self.prompt)
        self.textspan = Span().html(escapeHTML(self.text)).ac(self.kind)
        self.container.a([self.promptspan, self.textspan])
        self.a(self.container)

class Log(e):
    def __init__(self, args = {}):        
        super().__init__("div")        
        self.items = []
        self.container = Div()
        self.a(self.container)

    def build(self):
        self.container.x()
        for item in self.items:
            self.container.a(item)

    def log(self, item):
        newitems = [item]
        i = 1
        for olditem in self.items:
            if i < MAX_LOGITEMS:
                newitems.append(olditem)
                i += 1
            else:
                break
        self.items = newitems
        self.build()
######################################################