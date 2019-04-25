from utils import ce, Vect

######################################################
# dom
class e:
    # create tag
    def __init__(self, tag):
        self.e = ce(tag)

    # text-align
    def ta(self, value):
        self.e.style.textAlign = value
        return self

    # display
    def disp(self, value):
        self.e.style.display = value
        return self

    # flex direction
    def fd(self, value):
        self.e.style.flexDirection = value
        return self

    # justify content
    def jc(self, value):
        self.e.style.justifyContent = value
        return self

    # background color
    def bc(self, color):
        self.e.style.backgroundColor = color
        return self

    # border style
    def bds(self, value):
        self.e.style.borderStyle = value
        return self

    # border width
    def bdw(self, value):
        self.e.style.borderWidth = value + "px"
        return self

    # border radius
    def bdr(self, value):
        self.e.style.borderRadius = value + "px"
        return self

    # border color
    def bdc(self, value):
        self.e.style.borderColor = value
        return self

    # curly border
    def curlyborder(self):
        return self.bds("solid").bdw(1).bdc("#777").bdr(20)

    # background image
    def bci(self, path):
        self.e.style.backgroundImage = "url({})".format(path)
        return self

    # cursor pointer
    def cp(self):
        self.e.style.cursor = "pointer"
        return self

    # cursor pointer
    def cm(self):
        self.e.style.cursor = "move"
        return self

    # color
    def c(self, color):
        self.e.style.color = color
        return self

    # z-index
    def zi(self, zindex):
        self.e.style.zIndex = zindex
        return self

    # opacity
    def op(self, opacity):
        self.e.style.opacity = opacity
        return self

    # monospace
    def ms(self):
        self.e.style.fontFamily = "monospace"
        return self

    # append element
    def a(self, element):
        if Array.isArray(element):
            for eitem in element:
                self.e.appendChild(eitem.e)
        else:
            self.e.appendChild(element.e)
        return self

    # align items
    def ai(self, alignitems):
        self.e.style.alignItems = alignitems
        return self

    # shorthand for setAttribute
    def sa(self, key, value):
        self.e.setAttribute(key,value)
        return self

    # shorthand for removeAttribute
    def ra(self, key):
        self.e.removeAttribute(key)
        return self

    # set or remove attribute conditional
    def srac(self, cond, key, value):
        if cond:
            self.sa(key, value)
        else:
            self.ra(key)

    # shorthand for getAttribute
    def ga(self, key):
        return self.e.getAttribute(key)

    # shorthand for setting value
    def sv(self, value):
        self.e.value = value
        return self

    # set inner html
    def html(self, value):
        self.e.innerHTML = value
        return self

    # clear
    def x(self):
        #self.html("")
        while self.e.firstChild:
            self.e.removeChild(self.e.firstChild)
        return self

    # width
    def w(self, w):
        self.e.style.width = w + "px"
        return self

    # min width
    def mw(self, w):
        self.e.style.minWidth = w + "px"
        return self

    # max width
    def maw(self, w):
        self.e.style.maxWidth = w + "px"
        return self

    # height
    def h(self, h):
        self.e.style.height = h + "px"
        return self

    # min height
    def mh(self, h):
        self.e.style.minHeight = h + "px"
        return self

    # max height
    def mah(self, h):
        self.e.style.maxHeight = h + "px"
        return self

    # top
    def t(self, t):
        self.e.style.top = t + "px"
        return self

    # left
    def l(self, l):
        self.e.style.left = l + "px"
        return self

    # position vector
    def pv(self, v):
        return self.l(v.x).t(v.y)

    # position absolute
    def pa(self):
        self.e.style.position = "absolute"
        return self

    # position relative
    def pr(self):
        self.e.style.position = "relative"
        return self

    def mar(self, mar):
        self.e.style.margin = mar + "px"
        return self

    def pad(self, pad):
        self.e.style.padding = pad + "px"
        return self

    # margin left
    def ml(self, ml):
        self.e.style.marginLeft = ml + "px"
        return self

    # margin right
    def mr(self, mr):
        self.e.style.marginRight = mr + "px"
        return self

    # margin top
    def mt(self, mt):
        self.e.style.marginTop = mt + "px"
        return self

    # margin bottom
    def mb(self, mb):
        self.e.style.marginBottom = mb + "px"
        return self

    # padding left
    def pl(self, pl):
        self.e.style.paddingLeft = pl + "px"
        return self

    # padding right
    def par(self, pr):
        self.e.style.paddingRight = pr + "px"
        return self

    # padding top
    def pt(self, pt):
        self.e.style.paddingTop = pt + "px"
        return self

    # padding bottom
    def pb(self, pb):
        self.e.style.paddingBottom = pb + "px"
        return self

    # add class
    def ac(self, klass):
        if Array.isArray(klass):
            for classitem in klass:
                self.e.classList.add(classitem)
        else:
            self.e.classList.add(klass)
        return self

    # add class conditional
    def acc(self, cond, klass):
        if cond:
            self.e.classList.add(klass)
        return self

    # remove class
    def rc(self, klass):
        if Array.isArray(klass):
            for classitem in klass:
                self.e.classList.remove(classitem)
        else:
            self.e.classList.remove(klass)
        return self

    # add or remove class based on condition
    def arc(self, cond, klass):
        if cond:
            self.e.classList.add(klass)
        else:
            self.e.classList.remove(klass)
        return self

    # return value
    def v(self):
        return self.e.value

    # focus me
    def focusme(self):                
        self.e.focus()
        return self

    # focus me later
    def fl(self, timeout = 50):                
        setTimeout(self.focusme, timeout)
        return self

    # float
    def float(self, float):
        self.e.style.float = float
        return self

    # transform
    def transform(self, transform):
        self.e.style.transform = transform
        return self

    # add event listener
    def ae(self, kind, callback, arg = False):        
        if Array.isArray(kind):
            for kinditem in kind:
                self.e.addEventListener(kinditem, callback, arg)
        else:
            self.e.addEventListener(kind, callback, arg)
        return self

    # disable
    def disable(self):
        return self.sa("disabled", True)

    # enable
    def enable(self):
        return self.ra("disabled")

    # able
    def able(self, able):
        if able:
            return self.enable()
        return self.disable()

    # font size
    def fs(self, size):
        self.e.style.fontSize = size + "px"
        return self

    # font style
    def fst(self, style):
        self.e.style.fontStyle = style
        return self

    # font size
    def ff(self, family):
        self.e.style.fontFamily = family
        return self

    # font size
    def fw(self, weight):
        self.e.style.fontWeight = weight
        return self

class Div(e):
    def __init__(self, klass = None):
        super().__init__("div")
        if klass:            
            self.ac(klass)

class Span(e):
    def __init__(self, klass = None):
        super().__init__("span")
        if klass:
            self.ac(klass)

class Br(e):
    def __init__(self):
        super().__init__("br")

class Table(e):
    def __init__(self, klass = None):
        super().__init__("table")
        if klass:            
            self.ac(klass)

class Tr(e):
    def __init__(self, klass = None):
        super().__init__("tr")
        if klass:            
            self.ac(klass)

class Td(e):
    def __init__(self, klass = None):
        super().__init__("td")
        if klass:            
            self.ac(klass)

class Input(e):
    def __init__(self, kind):
        super().__init__("input")
        self.sa("type", kind)

class Button(Input):
    def __init__(self, caption, callback):
        super().__init__("button")
        self.sa("value", caption)
        self.ae("mousedown", callback)
        self.ac("button")

class Select(e):
    def __init__(self):
        super().__init__("select")

class Option(e):
    def __init__(self, key, displayname, selected = False):
        super().__init__("option")
        self.sa("name", key)
        self.sa("id", key)
        self.sv(key)
        self.html(displayname)
        if selected:
            self.sa("selected", True)

class ComboBox(e):
    def changed(self):
        if self.changecallback:
            self.changecallback(self.v())

    def __init__(self):        
        super().__init__("select")
        self.ae("change", self.changed)

    def setoptions(self, options, selected, changecallback):
        self.changecallback = changecallback
        self.x()
        for option in options:                        
            self.a(Option(option[0], option[1], option[0] == selected))
        return self

class Slider(Input):
    def setmin(self, min):
        self.sa("min", min)
        return self

    def setmax(self, max):
        self.sa("max", max)
        return self

    def setstep(self, step):
        self.sa("step", step)
        return self

    def __init__(self):
        super().__init__("range")

class CheckBox(Input):
    def setchecked(self, checked):
        self.e.checked = checked
        return self

    def getchecked(self):
        return self.e.checked

    def __init__(self, checked = False):
        super().__init__("checkbox")
        self.setchecked(checked)

class Radio(Input):
    def setchecked(self, checked):
        self.e.checked = checked
        return self

    def __init__(self, checked = False):
        super().__init__("radio")
        self.setchecked(checked)

class DateInput(Input):
    def __init__(self, checked = False):
        super().__init__("date")

class ColorInput(Input):
    def __init__(self, checked = False):
        super().__init__("color")

class TextInput(Input):
    def onchange(self):
        self.rc("textinputediting")
        if self.changecallback:
            self.changecallback()

    def onenter(self):
        if self.entercallback:
            self.entercallback()

    def onkeyup(self, ev):        
        self.ac("textinputediting")
        if self.keyupcallback:
            self.keyupcallback(self.ev.keyCode)
        else:
            if ev.keyCode == 13:
                self.onchange()
                self.onenter()
            else:
                if self.editingcallback:
                    self.editingcallback()

    def setchangecallback(self, changecallback):
        self.changecallback = changecallback
        return self

    def setentercallback(self, entercallback):
        self.entercallback = entercallback
        return self

    def setkeyupcallback(self, keyupcallback):
        self.keyupcallback = keyupcallback
        return self

    def seteditingcallback(self, editingcallback):
        self.editingcallback = editingcallback
        return self

    def __init__(self):
        super().__init__("text")
        self.ac("textinput")
        self.changecallback = None
        self.keyupcallback = None
        self.ae("change", self.onchange)
        self.ae("keyup", self.onkeyup)

    def setText(self, content):
        self.sv(content)
        return self

    def getText(self):
        return self.v()

class PasswordInput(Input):
    def __init__(self):
        super().__init__("password")

    def setText(self, content):
        self.sv(content)
        return self

    def getText(self):
        return self.v()

class TextArea(e):
    def insert(self, content):
        ss = self.e.selectionStart            
        se = self.e.selectionEnd            
        v = self.v()
        nv = v.substring(0, ss) + content + v.substring(se)
        self.sv(nv)
        self.e.selectionEnd = ss + len(content)

    def keydowncallback(self, ev):
        if ev.keyCode == 9:
            ev.preventDefault()
            self.insert("\t")
        elif ev.keyCode == 13:
            ev.preventDefault()
            lines = self.v().substring(0, self.e.selectionStart).split("\n")
            chars = lines[len(lines) - 1].split("")
            t = ""
            for char in chars:
                if char == "\t":
                    t += "\t"
                else:
                    break
            self.insert("\n" + t)

    def __init__(self):
        super().__init__("textarea")
        self.ae("keydown", self.keydowncallback)

    def setText(self, content):
        self.sv(content)
        return self

    def getText(self):
        return self.v()

class Canvas(e):
    def __init__(self, width, height):
        super().__init__("canvas")
        self.width = width
        self.height = height
        self.sa("width", self.width)
        self.sa("height", self.height)        
        self.ctx = self.e.getContext("2d")

    def lineWidth(self, linewidth):        
        self.ctx.lineWidth = linewidth

    def strokeStyle(self, strokestyle):        
        self.ctx.strokeStyle = strokestyle

    def fillStyle(self, fillstyle):        
        self.ctx.fillStyle = fillstyle

    def fillRect(self, tlv, brv):          
        self.ctx.fillRect(tlv.x, tlv.y, brv.m(tlv).x, brv.m(tlv).y)

    def clear(self):        
        self.ctx.clearRect(0, 0, self.width, self.height)

    def drawline(self, fromv, tov):        
        self.ctx.beginPath()
        self.ctx.moveTo(fromv.x, fromv.y)
        self.ctx.lineTo(tov.x, tov.y)
        self.ctx.stroke()

class Form(e):
    def __init__(self):
        super().__init__("form")

class P(e):
    def __init__(self):
        super().__init__("p")

class Label(e):
    def __init__(self, content = None):
        super().__init__("label")        
        if content:
            self.html(content)

class FileInput(Input):
    def setmultiple(self, multiple):
        self.srac(multiple, "multiple", True)
        return self

    def getmultiple(self):
        return self.ga("multiple")

    def setaccept(self, accept):
        return self.sa("accept", accept)

    def getaccept(self):
        return self.ga("accept")

    def files(self):
        return self.e.files

    def __init__(self):
        super().__init__("file")

class Hlink(e):
    def __init__(self, href, caption):
        super().__init__("a")
        self.sa("href", href)
        self.html(caption)

class Labeled(e):
    def __init__(self, label, element):
        super().__init__("div")
        self.disp("flex").ai("center").bc("#eee").curlyborder()
        self.labeldiv = Div().mar(1).pad(1).ml(6).html(label).ff("monospace").bc("#ffe")
        self.element = element
        self.elementcontainer = Div().mr(2).a(self.element)
        self.a([self.labeldiv, self.elementcontainer])

class CopyText(e):
    def copy(self):
        pass

    def paste(self):
        pass

    def getText(self):
        return self.textinput.getText()

    def setText(self, text):
        self.textinput.setText(text)
        return self

    def pastehandler(self, clipText):
        self.textinput.setText(clipText)
        if(self.pastecallback):
            self.pastecallback(clipText)

    def paste(self):
        try:
            navigator.clipboard.readText().then(self.pastehandler, lambda err: print(err))        
        except:
            print("clipboard.readText does not work, falling back to text pasted manually")
            if self.pastecallback:
                self.pastecallback(self.textinput.getText())

    def resize(self, width, height):
        self.width = width
        self.height = height        
        if self.dopaste:
            self.copydiv.w(self.controlwidth/2)
        else:
            self.copydiv.w(self.controlwidth)
        self.copydiv.h(self.height/1.4)
        if self.docopy:
            self.pastediv.w(self.controlwidth/2).h(self.height/1.4)
        else:
            self.pastediv.w(self.controlwidth).h(self.height/1.4)
        self.pastediv.h(self.height/1.4)
        self.textinput.w(self.width - self.controlwidth * 1.2).h(self.height * 0.5).fs(self.height * 0.5)
        self.w(self.width).h(self.height)
        return self

    def __init__(self, args = {}):
        super().__init__("div")
        self.dopaste = args.get("dopaste", True)
        self.docopy = args.get("docopy", True)
        self.disp("flex").ai("center").jc("space-around").bc("#ddd").ac("noselect")
        self.width = args.get("width", 400)
        self.height = args.get("height", 40)
        self.controlwidth = args.get("controlwidth", 80)
        self.pastecallback = args.get("pastecallback", None)
        self.copydiv = Div().disp("flex").ai("center").jc("space-around").a(Div().html("Copy")).bc("#efe").cp().fs(10)
        self.copydiv.ae("mousedown", self.copy)
        self.pastediv = Div().disp("flex").ai("center").jc("space-around").a(Div().html("Paste")).bc("#fee").cp().fs(10)
        self.pastediv.ae("mousedown", self.paste)        
        self.textinput = TextInput().ff("monospace")
        self.a(self.textinput)
        if self.docopy:
            self.a(self.copydiv)
        if self.dopaste:
            self.a(self.pastediv)
        self.resize(self.width, self.height)

class Arrow(Div):
    def __init__(self, frm, to, args = {}):
        super().__init__()
        opacity = args.get("opacity", 1)
        self.op(opacity)
        diff = to.m(frm)
        l = diff.l()
        linewidth = args.get("linewidth", 12)
        pointwidth = args.get("pointwidth", 36)
        pointheight = args.get("pointheight", 36)
        self.pointheight = pointheight
        color = args.get("color", "#ff7")
        self.h(pointwidth).w(l)
        lineheight = l - pointheight        
        self.linediv = Div().h(linewidth).w(lineheight).float("left")
        self.linediv.mt((pointwidth - linewidth)/2).bc(color)
        self.pointdiv = Div().float("right")
        self.pointdiv.e.style.borderTop = str(pointwidth/2) + "px solid transparent"
        self.pointdiv.e.style.borderBottom = str(pointwidth/2) + "px solid transparent"
        self.pointdiv.e.style.borderLeft = str(pointheight) + "px solid " + str(color)
        rot = Math.asin((to.y - frm.y)/l)        
        if to.x < frm.x:
            rot = Math.PI - rot                     
        self.transform("rotate(" + str(rot / Math.PI * 180) +"deg)")
        self.a([self.linediv, self.pointdiv])                        
        shifty = l/2 * Math.sin(rot) - pointwidth/2
        shiftx = - ( l/2 - l/2 * Math.cos(rot) )
        
        self.t(frm.y + shifty).l(frm.x + shiftx)
        self.pa()
######################################################
