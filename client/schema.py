from dom import e, Div, ComboBox, TextInput, Button, Slider, CheckBox, Radio, TextArea, DateInput, Label, ColorInput
from utils import getitem, texttofloat, dateToDateInputStr, dateInputStrToDate

clipboard = None

SCHEMA_SCALAR_DEFAULT_VALUE = ""
SCHEMA_SLIDER_DEFAULT_VALUE = 0
SCHEMA_SLIDER_DEFAULT_MINVALUE = 0
SCHEMA_SLIDER_DEFAULT_MAXVALUE = 100
SCHEMA_SLIDER_DEFAULT_VALUESTEP = 1

SCHEMA_DEFAULT_ARGS = [
    [ "kind", "collection" ],
    [ "disposition", "dict" ],    
    [ "key", None ],
    [ "value", SCHEMA_SCALAR_DEFAULT_VALUE ],
    [ "minvalue", SCHEMA_SLIDER_DEFAULT_MINVALUE ],
    [ "maxvalue", SCHEMA_SLIDER_DEFAULT_MAXVALUE ],
    [ "valuestep", SCHEMA_SLIDER_DEFAULT_VALUESTEP ],
    [ "selected", False ],
    [ "childsarg", [] ],
    [ "childsopened", False ]
]

def iscollection(schema):
    if schema:
        return schema.kind == "collection"
    return False

def iscombo(schema):
    if iscollection(schema):
        return schema.disposition == "combo"
    return False

def isradio(schema):
    if iscollection(schema):
        return schema.disposition == "radio"
    return False

def isdict(schema):
    if iscollection(schema):
        return schema.disposition == "dict"
    return False

def islist(schema):    
    if iscollection(schema):
        return schema.disposition == "list"
    return False

class Schema(e):    
    def copydivclicked(self):
        global clipboard
        clipboard = self.toargs()

    def openbuttonclicked(self):
        self.childsopened = not self.childsopened
        self.build()

    def createcombochanged(self, v):
        if v == "scalar":
            sch = Schema({
                "parent": self,
                "kind": "scalar",
                "disposition": "string"
            })
        elif v == "slider":
            sch = Schema({
                "parent": self,
                "kind": "scalar",
                "disposition": "slider"
            })
        elif v == "checkbox":
            sch = Schema({
                "parent": self,
                "kind": "scalar",
                "disposition": "checkbox"
            })
        elif v == "textarea":
            sch = Schema({
                "parent": self,
                "kind": "scalar",
                "disposition": "textarea"
            })
        elif v == "date":
            sch = Schema({
                "parent": self,
                "kind": "scalar",
                "disposition": "date",
                "value": dateToDateInputStr(__new__(Date()))            
            })
        elif v == "color":
            sch = Schema({
                "parent": self,
                "kind": "scalar",
                "disposition": "color",
                "value": "#ffffff"
            })
        elif v == "dict":
            sch = Schema({
                "parent": self,
                "kind": "collection",
                "disposition": "dict"
            })
        elif v == "list":
            sch = Schema({
                "parent": self,
                "kind": "collection",
                "disposition": "list"
            })
        elif v == "combo":
            sch = Schema({
                "parent": self,
                "kind": "collection",
                "disposition": "combo"
            })
        elif v == "radio":
            sch = Schema({
                "parent": self,
                "kind": "collection",
                "disposition": "radio"
            })
        elif v == "process":
            sch = Schema({
                "parent": self,
                "kind": "collection",
                "disposition": "dict",
                "childsopened": True,
                "childsarg": [
                    {
                        "kind": "scalar",
                        "disposition": "string",
                        "key": "key"
                    },
                    {
                        "kind": "scalar",
                        "disposition": "string",
                        "key": "displayname"
                    },
                    {
                        "kind": "scalar",
                        "disposition": "string",
                        "key": "command"
                    },
                    {
                        "kind": "collection",
                        "disposition": "list",
                        "key": "command_args"
                    }
                ]
            })
        self.childs.append(sch)
        self.build()

    def stringvalueinputchanged(self):
        self.value = self.stringvalueinput.getText()

    def keyinputchanged(self):
        self.key = self.keyinput.getText()

    def deletechild(self, child):
        global clipboard
        newchilds = []
        for currchild in self.childs:
            if not ( currchild == child ):
                newchilds.append(currchild)
            else:
                clipboard = child.toargs()
        self.childs = newchilds
        self.build()

    def deletedivclicked(self):
        self.parent.deletechild(self)        

    def pastebuttonpushed(self):
        global clipboard        
        if clipboard:
            clipboard["parent"] = self
            sch = Schema(clipboard)
            self.childs.append(sch)
            self.build()

    def setslidervalue(self, value, doslider = True):        
        self.value = float(value)
        if self.value < self.minvalue:
            self.value = self.minvalue
        if self.value > self.maxvalue:
            self.value = self.maxvalue
        if doslider:
            self.slider.sv(self.value)
        self.slidervalueinput.setText("{}".format(self.value))

    def minvalueinputchanged(self):
        self.minvalue = texttofloat(self.minvalueinput.getText(), self.minvalue)
        self.slider.setmin(self.minvalue)
        self.setslidervalue(self.value)

    def maxvalueinputchanged(self):                
        self.maxvalue = texttofloat(self.maxvalueinput.getText(), self.maxvalue)
        self.slider.setmax(self.maxvalue)
        self.setslidervalue(self.value)

    def sliderstepinputhchanged(self):                
        self.valuestep = texttofloat(self.sliderstepinput.getText(), self.valuestep)
        self.slider.setstep(self.valuestep)
        self.setslidervalue(self.value)

    def sliderchanged(self):        
        self.setslidervalue(self.slider.v(), False)

    def slidervalueinputchanged(self):     
        self.setslidervalue(texttofloat(self.slidervalueinput.getText(), self.value))

    def checkboxchanged(self):
        self.value = self.checkbox.getchecked()
    
    def combocheckboxchanged(self):
        self.selected = self.combocheckbox.getchecked()

    def radioradioclicked(self):        
        for child in self.parent.childs:
            isme = ( child == self )
            child.radioradio.setchecked(isme)
            child.selected = isme            
            print(isme)

    def textareachanged(self):
        self.value = self.textarea.getText()

    def setdatelabel(self):
        self.datelabel.html("{}".format(dateInputStrToDate(self.value).getTime()))

    def datechanged(self):
        self.value = self.date.v()
        self.setdatelabel()

    def colorchanged(self):
        self.value = self.color.v()
        self.colorlabel.html(self.value)

    def build(self):
        self.x().ac("schema")
        self.itemdiv = Div(["item", self.disposition])        
        self.valuediv = Div(["value", self.disposition])
        if self.kind == "scalar":            
            if self.disposition == "dict":
                if type(self.value) == bool:
                    self.disposition = "checkbox"
                else:
                    self.disposition = "string"
            if self.disposition == "string":
                self.stringvalueinput = TextInput().ac("string").setText(self.value)
                self.stringvalueinput.ae("keyup", self.stringvalueinputchanged)
                self.valuediv.a(self.stringvalueinput)
            elif self.disposition == "slider":
                self.slidervalueinput = TextInput().ac("slidervalue").setText(self.value).setchangecallback(self.slidervalueinputchanged)                
                self.minvalueinput = TextInput().ac("sliderminmax").setText(self.minvalue).setchangecallback(self.minvalueinputchanged)
                self.slider = Slider().ac("sliderslider").ae("change", self.sliderchanged)                
                self.maxvalueinput = TextInput().ac("sliderminmax").setText(self.maxvalue).setchangecallback(self.maxvalueinputchanged)
                self.sliderstepinput = TextInput().ac("sliderstep").setText(self.valuestep).setchangecallback(self.sliderstepinputhchanged)
                self.valuediv.a([self.slidervalueinput, self.minvalueinput, self.slider, self.maxvalueinput, self.sliderstepinput])
                self.slider.setmin(self.minvalue).setmax(self.maxvalue).setstep(self.valuestep)
                self.setslidervalue(texttofloat(self.value, SCHEMA_SLIDER_DEFAULT_VALUE))
            elif self.disposition == "checkbox":
                self.value = ( self.value is True )
                self.checkbox = CheckBox().ac("checkbox").setchecked(self.value).ae("change", self.checkboxchanged)
                self.valuediv.a(self.checkbox)
            elif self.disposition == "textarea":
                self.textarea = TextArea().ac("textarea").setText(self.value)
                self.textarea.ae(["keyup", "change"], self.textareachanged)
                self.valuediv.a(self.textarea)
            elif self.disposition == "date":                
                self.date = DateInput().ac("date").sv(self.value)
                self.date.ae(["keyup", "change"], self.datechanged)
                self.datelabel = Label().ac("datelabel")
                self.setdatelabel()
                self.valuediv.a([self.date, self.datelabel])
            elif self.disposition == "color":                
                self.color = ColorInput().ac("color").sv(self.value)
                self.color.ae(["keyup", "change"], self.colorchanged)
                self.colorlabel = Label().ac("colorlabel").html(self.value)
                self.valuediv.a([self.color, self.colorlabel])
        self.helpdiv = Div(["box","help"]).html("?")
        self.copydiv = Div(["box","copy"]).html("C").ae("mousedown", self.copydivclicked)        
        if isdict(self.parent):
            self.keydiv = Div("key")
            self.keyinput = TextInput().ac("key").setText(self.key)
            self.keyinput.ae("keyup", self.keyinputchanged)
            self.keydiv.a(self.keyinput)
            self.itemdiv.a(self.keydiv)
        if iscombo(self.parent):
            self.combodiv = Div(["box", "combo"])
            self.combocheckbox = CheckBox().ac("checkbox").setchecked(self.selected).ae("change", self.combocheckboxchanged)
            self.combodiv.a(self.combocheckbox)
            self.itemdiv.a(self.combodiv)
        if isradio(self.parent):
            self.radiodiv = Div(["box", "radio"])
            self.radioradio = Radio().ac("radio").setchecked(self.selected).ae("mousedown", self.radioradioclicked)
            self.radiodiv.a(self.radioradio)
            self.itemdiv.a(self.radiodiv)
        self.itemdiv.a([self.valuediv, self.helpdiv, self.copydiv])
        if self.parent:
            self.deletediv = Div(["box","delete"]).html("X").ae("mousedown", self.deletedivclicked)
            self.itemdiv.a(self.deletediv)
        if iscollection(self):
            self.openbutton = Div("openbutton").ae("mousedown", self.openbuttonclicked)
            self.valuediv.a(self.openbutton)   
        self.childsdiv = Div("childs")
        if self.childsopened:
            self.creatediv = Div("create")
            cc = self.createcombo            
            self.createcombo = ComboBox().setoptions([
                [ "create" , "Create new" ],
                [ "scalar" , "Scalar" ],
                [ "slider" , "Slider" ],
                [ "checkbox" , "Checkbox" ],                
                [ "textarea" , "Textarea" ],                
                [ "date" , "Date" ],                
                [ "color" , "Color" ],                
                [ "dict" , "Dict" ],
                [ "list" , "List" ],
                [ "combo" , "Combo" ],
                [ "radio" , "Radio" ],
                [ "process" , "Process" ]
            ], "create", self.createcombochanged).ac("createcombo")
            self.creatediv.a(self.createcombo)
            self.pastebutton = Button("Paste", self.pastebuttonpushed).ac("pastebutton")
            self.creatediv.a(self.pastebutton)
            self.childsdiv.a(self.creatediv)
            for child in self.childs:
                self.childsdiv.a(child)
        self.container = Div("container")
        self.container.a([self.itemdiv, self.childsdiv])
        self.a(self.container)                
        return self

    def tojsontext(self):
        return JSON.stringify(self.toargs(), None, 2)

    def toargs(self):
        args = {}
        for arg in SCHEMA_DEFAULT_ARGS:
            args[arg[0]] = self[arg[0]]
        args["childsarg"] = []
        for child in self.childs:
            args["childsarg"].append(child.toargs())
        return args

    def __init__(self, args = {}):
        super().__init__("div")
        self.parent = getitem(args, "parent", None)
        for arg in SCHEMA_DEFAULT_ARGS:
            self[arg[0]] = getitem(args, arg[0], arg[1])
        self.childs = []
        for childarg in self.childsarg:
            childarg["parent"] = self
            child = Schema(childarg)
            self.childs.append(child)
        self.build()

    def getchildbykey(self, key):
        for child in self.childs:
            if child.key == key:
                return child
        return None

    def getpathrec(self, sch, pathparts):                
        if not sch:            
            return None
        if len(pathparts) == 0:
            return sch
        key = pathparts[0]
        pathparts = pathparts[1:]
        if self.disposition == "dict":
            return self.getpathrec(self.getchildbykey(key), pathparts)
        else:
            return None

    def getpath(self, path):
        if path == "":
            pathparts = []
        else:
            pathparts = path.split("/")
        return self.getpathrec(self, pathparts)
