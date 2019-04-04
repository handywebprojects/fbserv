////////////////////////////////////////////////////////////////////

function dateToDateInputStr(dateObj){
    let month = "" + ( dateObj.getUTCMonth() + 1 )
	let day = "" + dateObj.getUTCDate()
	let year = dateObj.getUTCFullYear()
    return year + "-" + month.padStart(2, "0") + "-" + day.padStart(2, "0")
}

function dateInputStrToDate(dateInputStr){
	let parts = dateInputStr.split("-")
	let year = parseInt(parts[0])
	let month = parseInt(parts[1]) - 1
	let day = parseInt(parts[2])
    return new Date(year, month, day)
}

ONE_SECOND = 1000
ONE_MINUTE = 60 * ONE_SECOND
ONE_HOUR = 60 * ONE_MINUTE
ONE_DAY = 24 * ONE_HOUR

////////////////////////////////////////////////////////////////////
// url params https://www.sitepoint.com/get-url-parameters-with-javascript/
function getAllUrlParams(url) {
    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');

        // set parameter name and value (use 'true' if empty)
        var paramName = a[0];
        var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

        // (optional) keep case consistent
        //paramName = paramName.toLowerCase();
        //if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

        // if the paramName ends with square brackets, e.g. colors[] or colors[2]
        if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
            // get the index value and add the entry at the appropriate position
            var index = /\[(\d+)\]/.exec(paramName)[1];
            obj[key][index] = paramValue;
        } else {
            // otherwise add the value to the end of the array
            obj[key].push(paramValue);
        }
        } else {
        // we're dealing with a string
        if (!obj[paramName]) {
            // if it doesn't exist, create property
            obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
            // if property does exist and it's a string, convert it to an array
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
        } else {
            // otherwise add the property
            obj[paramName].push(paramValue);
        }
        }
    }
    }

    return obj;
}

params = getAllUrlParams()
////////////////////////////////////////////////////////////////////

function ge(id){return document.getElementById(id)}
function se(id, e){
    te = ge(id)
    te.innerHTML = ""
    te.append(e.e)
}
function ae(id, e){
    ge(id).append(e.e)
}

////////////////////////////////////////////////////////////////////
// dom
class e{
    constructor(kind){
        this.e = document.createElement(kind)
    }

    v(){
        return this.e.value
    }

    sv(value){
        this.e.value = value
        return this
    }

    html(content){
        this.e.innerHTML = content
        return this
    }

    focus(){
        this.e.focus()
        return this
    }

    w(width){
        this.e.style.width = width + "px"
        return this
    }

    h(height){
        this.e.style.height = height + "px"
        return this
    }

    bc(color){
        this.e.style.backgroundColor = color
        return this
    }

    c(color){
        this.e.style.color = color
        return this
    }

    ta(value){
        this.e.style.textAlign = value
        return this
    }

    border(style, width, radius, color){
        this.e.style.borderStyle = style
        if(arguments.length > 1) this.e.style.borderWidth = width + "px"
        if(arguments.length > 2) this.e.style.borderRadius = radius + "px"
        if(arguments.length > 3) this.e.style.borderColor = color
        return this
    }

    pad(value){
        this.e.style.padding = value + "px"
        return this
    }

    mar(value){
        this.e.style.margin = value + "px"
        return this
    }

    ml(value){
        this.e.style.marginLeft = value + "px"
        return this
    }

    mr(value){
        this.e.style.marginRight = value + "px"
        return this
    }

    mt(value){
        this.e.style.marginTop = value + "px"
        return this
    }

    mb(value){
        this.e.style.marginBottom = value + "px"
        return this
    }

    fs(value){
        this.e.style.fontSize = value + "px"
        return this
    }

    ff(value){
        this.e.style.fontFamily = value
        return this
    }

    fst(value){
        this.e.style.fontStyle = value
        return this
    }

    fw(value){
        this.e.style.fontWeight = value
        return this
    }

    disp(display){
        this.e.style.display = display
        return this
    }

    cp(){
        this.e.style.cursor = "pointer"
        return this
    }

    jc(justifycontent){
        this.e.style.justifyContent = justifycontent
        return this
    }

    ai(alignitems){
        this.e.style.alignItems = alignitems
        return this
    }

    sa(key, value){
        this.e.setAttribute(key, value)
        return this
    }

    pl(padleft){
        this.e.style.paddingLeft = padleft + "px"
        return this
    }

    pr(padright){
        this.e.style.paddingRight = padright + "px"
        return this
    }

    a(...args){        
        for(let arg of args){            
            try{
                for(let arge of arg){
                    this.e.appendChild(arge.e)                            
                }
            }catch(e){                
                this.e.appendChild(arg.e)
            }
        }
        return this
    }

    ac(klass){
        this.e.classList.add(klass)
        return this
    }

    acc(cond, klass){
        if(cond) this.ac(klass)
        return this
    }

    rc(klass){
        this.e.classList.remove(klass)
        return this
    }

    ae(kind, handler){
        this.e.addEventListener(kind, handler)
        return this
    }

    bds(value){
        this.e.style.borderStyle = value
        return this
    }

    bdw(value){
        this.e.style.borderWidth = value + "px"
        return this
    }

    bdc(value){
        this.e.style.borderColor = value
        return this
    }

    bdr(value){
        this.e.style.borderRadius = value + "px"
        return this
    }

    get x(){                
        return this.html("")
    }

    curlyborder(){
        return this.bds("solid").bdw(1).bdc("#777").bdr(10)
    }
}

class Div_ extends e{
    constructor(){
        super("div")
    }
}
function Div(){return new Div_()}

class Table_ extends e{
    constructor(){
        super("table")
    }
}
function Table(){return new Table_()}

class Tr_ extends e{
    constructor(){
        super("tr")
    }
}
function Tr(){return new Tr_()}

class Td_ extends e{
    constructor(){
        super("td")
    }
}
function Td(){return new Td_()}

class Input_ extends e{
    constructor(kind){
        super("input")
        this.sa("type", kind)
    }
}

class TextInput_ extends Input_{
    change(){
        localStorage.setItem(this.storeid, this.getText())
    }

    constructor(args){
        super("text")
        this.args = args || {}
        this.storeid = this.args.storeid
        if(this.storeid){
            this.ae("keyup", this.change.bind(this))
            this.ae("change", this.change.bind(this))
            let value = localStorage.getItem(this.storeid)
            if(value) this.setText(value)
        }
    }

    setText(text){
        return this.sv(text)
    }

    getText(){
        return this.v()
    }
}
function TextInput(args){return new TextInput_(args)}

class TextArea_ extends e{
    constructor(){
        super("textarea")
    }

    setText(text){
        return this.sv(text)
    }

    getText(){
        return this.v()
    }

    ss(){
        return this.e.selectionStart
    }

    se(){
        return this.e.selectionEnd
    }

    srt(content, start, end, selectmode){        
        // selectmode : select / start / end / preserve
        this.e.setRangeText(content, start, end, selectmode)
        return this
    }

    insert(content){
        this.srt(content, this.ss(), this.ss(), "end")
        this.focus()
        return this
    }

    rs(content){
        this.srt(content, this.ss(), this.se(), "select")
        this.focus()
        return this
    }

    gs(){
        let text = this.getText()
        return text.slice(this.ss(), this.se())
    }

    ssr(start, end, direction){        
        this.e.setSelectionRange(start, end, direction)
        return this
    }

    selectall(){                
        this.e.select()        
        return this
    }
}
function TextArea(){return new TextArea_()}

class CheckBox_ extends Input_{
    change(){
        localStorage.setItem(this.storeid, this.checked)
    }

    constructor(args){
        super("checkbox")
        this.args = args || {}
        this.storeid = this.args.storeid
        if(this.storeid){
            this.ae("change", this.change.bind(this))
            let value = `${localStorage.getItem(this.storeid) || this.args.checked || true}`
            this.set(value == "true")
            localStorage.setItem(this.storeid, value)
        }
    }

    set(value){
        this.e.checked = value
        return this
    }

    get checked(){
        return this.e.checked
    }

    onchange(handler){
        return this.ae("change", handler)
    }
}
function Check(args){return new CheckBox_(args)}

class LabeledCheckBox_ extends Div_{
    constructor(label){
        super()
        this.container = Div().disp("flex").bc("#f7f7f7").pad(2).jc("space-around").ai("center").border("dotted", 1, 8, "#777")
        this.label = Div().html(label).pl(4).pr(2)
        this.cb = Check()
        this.container.a(this.label, this.cb)
        this.disp("inline-block").a(this.container).mar(1)
    }

    set(value){
        this.cb.set(value)
        return this
    }

    get checked(){
        return this.cb.checked
    }

    onchange(handler){
        this.cb.onchange(handler)                
        return this
    }
}
function LCheck(label){return new LabeledCheckBox_(label)}

class Button_ extends Input_{
    constructor(caption, handler){
        super("button")
        this.e.value=caption
        this.ae("mousedown", handler)
        this.mar(1)
    }
}
function Button(caption, handler){return new Button_(caption, handler)}

class Hlink_ extends e{
    constructor(href, caption, newtab){                
        super("a")
        this.sa("href", href)
        if(newtab){                    
            this.sa("target", "_blank")
            this.sa("rel", "noopener noreferrer")
        }
        this.html(caption)                
    }
}
function Hlink(href, caption, newtab){return new Hlink_(href, caption, newtab)}

class Slider_ extends Input_{
    constructor(){
        super("range")        
    }

    min(value){
        this.e.min = value
        return this
    }

    max(value){
        this.e.max = value
        return this
    }

    step(value){
        this.e.step = value
        return this
    }

    set(value){
        return this.sv(value)
    }

    get value(){
        return this.e.valueAsNumber
    }
}
function Slider(){return new Slider_()}

class SliderText_ extends e{
    sliderhcanged(){
        this.text.setText(this.slider.v())
    }

    checktext(){
        this.slider.set(this.text.getText())
    }

    constructor(){
        super("div")        
        this.disp("flex").ai("center").bc("#eee").curlyborder().pad(2).jc("space-around")
        this.slider = Slider().ae("change", this.sliderhcanged.bind(this))
        this.text = TextInput().ml(3).mr(3).w(80)
        this.a(this.text, this.slider)
        this.sliderhcanged()
        setInterval(this.checktext.bind(this), 3000)
    }

    w(value){
        this.slider.w(value - 110)
        super.w(value)
        return this
    }

    min(value){        
        this.slider.min(value)
        this.sliderhcanged()
        return this
    }

    max(value){
        this.slider.max(value)
        this.sliderhcanged()
        return this
    }

    step(value){
        this.slider.step(value)
        this.sliderhcanged()
        return this
    }

    set(value){
        this.slider.set(value)
        this.sliderhcanged()
        return this
    }

    get value(){
        return this.text.getText()
    }
}
function SliderText(){return new SliderText_()}

class Range_ extends e{
    constructor(frommin, frommax, fromstep, fromval, tomin, tomax, tostep, toval){
        super("div")
        this.disp("flex").ai("center").bc("#ddd").curlyborder().pad(2).jc("space-around")
        this.fromlabel = Div().html("From").fs(12).fs(12).ff("courier").fst("italic")
        this.fromslider = SliderText().min(frommin).max(frommax).step(fromstep).set(fromval).w(400)
        this.tolabel = Div().html("To").fs(12).ff("courier").fst("italic")
        this.toslider = SliderText().min(tomin).max(tomax).step(tostep).set(toval).w(400)
        this.a(this.fromlabel, this.fromslider, this.tolabel, this.toslider).w(880)
    }
}
function Range(frommin, frommax, fromstep, fromval, tomin, tomax, tostep, toval){return new Range_(frommin, frommax, fromstep, fromval, tomin, tomax, tostep, toval)}

class DateInput_ extends Input_{
    constructor(){
        super("date")
    }

    set(value){        
        this.sv(value)
        return this
    }

    asms(){
        let date = dateInputStrToDate(this.v())        
        return date.getTime()
    }
}
function DateInput(){return new DateInput_()}

class Option_ extends e{
    constructor(){
        super("option")
    }

    key(key){
        this.sv(key)
        return this
    }

    value(value){
        this.html(value)
        return this
    }
}
function Option(){return new Option_()}

class Select_ extends e{
    change(){
        localStorage.setItem(this.storeid, this.v())        
    }

    constructor(args){
        super("select")
        this.args = args || {}
        this.storeid = this.args.storeid        
        if(this.storeid){
            this.ae("change", this.change.bind(this))
        }
    }

    setoptions(options, selected){
        this.x
        let trueselected = selected
        if(this.storeid) trueselected = localStorage.getItem(this.storeid) || selected
        for(let keyvalue of options){
            let key = keyvalue[0]
            let value = keyvalue[1]
            let o = Option().key(key).value(value)
            if(trueselected == key){
                o.sa("selected", true)
                if(this.storeid) localStorage.setItem(this.storeid, trueselected)
            }
            this.a(o)
        }
        return this
    }
}
function Select(args){return new Select_(args)}

class FeaturedTextInput_ extends e{
    constructor(label){
        super("div")
        this.disp("flex").ai("center").jc("space-around").w(300).curlyborder().pad(3).mar(3)
        this.label = Div().html(label)
        this.textinput = TextInput().w(200).fs(20).pad(3).pl(5)
        this.a(this.label, this.textinput)
    }

    setText(value){
        this.textinput.setText(value)
        return this
    }

    getText(){
        return this.textinput.getText()
    }
}
function FeaturedTextInput(label){return new FeaturedTextInput_(label)}

class InputField_ extends e{
    constructor(label, input){
        super("div")
        this.disp("flex").h(36).bc("#eee").mar(1).ai("center")
        this.labeldiv = Div().w(260).bc("#ffe").html(label).pad(5).ml(5)
        this.inputdiv = Div().w(600).bc("#eff").a(input).pad(5).ml(5).mr(5)
        this.a(this.labeldiv, this.inputdiv)
    }
}
function InputField(label, input){return new InputField_(label, input)}

class InputFields_ extends e{
    constructor(args){
        super("div")
        this.w(900)
        this.args = args || {}
        this.id = args.id || "inputfields"
        this.bc("#fef")
        this.inputdescs = this.args.inputdescs || []
        this.inputs = {}
        for(let inputdesc of this.inputdescs){
            let label = inputdesc.label || "Input"
            let kind = inputdesc.kind
            let storeid = `${this.id}/${inputdesc.id}`
            let input = TextInput({storeid: storeid}).w(500).pad(2)
            if(kind == "select"){
                this.options = inputdesc.options || []
                this.selected = inputdesc.selected
                input = Select({storeid: storeid}).setoptions(this.options, this.selected).pad(2)
            }
            if(kind == "check"){                
                this.checked = inputdesc.checked
                input = Check({storeid: storeid, checked: this.checked})
            }
            let inputfield = InputField(label, input)
            this.a(inputfield)
            this.inputs[inputdesc.id] = input
        }
    }
}
function InputFields(args){return new InputFields_(args)}
////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
// utils
function fetchjson(url, callback, errcallback){
    fetch(url).then(
        res=>res.text().then(
            content=>{
                try{
                    obj = JSON.parse(content)
                    callback(obj)
                }catch(err){
                    errcallback("fetch parse failed", url, content, err)
                }
            },
            err=>errcallback("fetching content failed", url, "", err)
        ),
        err=>errcallback("fetch request failed", url, "", err)
    )
}

function fetchallndjson(url, callback, errcallback){
    fetch(url, {
        headers:{
            Accept: "application/x-ndjson"
        }                    
    }).then(
        res=>res.text().then(
            content=>{
                try{
                    list = []
                    for(line of content.split("\n")){
                        try{
                            obj = JSON.parse(line)
                            list.push(obj)
                        }catch(e){
                        }
                    }                    
                    callback(list)
                }catch(err){
                    errcallback("fetch parse failed", url, content, err)
                }
            },
            err=>errcallback("fetching content failed", url, "", err)
        ),
        err=>errcallback("fetch request failed", url, "", err)
    )
}
////////////////////////////////////////////////////////////////////
