from widgets import Log, LogItem, Tab
from dom import Div, Span, Button, TextInput, PasswordInput
from utils import cpick, getelse

######################################################
# connection

class Connection:
    def signincallback(self):
        email = self.emailinput.getText()
        password = self.passwordinput.getText()
        print("signing in user with", email, password)
        firebase.auth().signInWithEmailAndPassword(email, password).then(
            lambda: print("ok"),
            lambda error: window.alert("{}".format(error))
        )

    def signoutcallback(self):
        if firebase.auth().currentUser:            
            print("signing out")
            firebase.auth().signOut()
        else:
            window.alert("Already signed out.")

    def signupcallback(self):
        email = self.emailinput.getText()
        password = self.passwordinput.getText()
        print("signing up user with", email, password)
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
            lambda: print("ok"),
            lambda error: window.alert("{}".format(error))
        )

    def sendverificationcallback(self):
        email = self.emailinput.getText()
        firebase.auth().currentUser.sendEmailVerification().then(
            lambda: window.alert("Verification email has been sent to {} !".format(email)),
            lambda error: window.alert("{}".format(error))
        )

    def resetpasswordcallback(self):
        email = self.emailinput.getText()
        firebase.auth().sendPasswordResetEmail(email).then(
            lambda: window.alert("Password reset email has been sent to {} !".format(email)),
            lambda error: window.alert("{}".format(error))
        )

    def updatedisplaynamecallback(self):
        getconn().sioreq({
            "kind": "updateuserdisplayname",
            "displayname": self.displaynameinput.getText(),
            "uid": self.uid
        })

    def updatephotourlcallback(self):
        getconn().sioreq({
            "kind": "updateuserphotourl",
            "photourl": self.photourlinput.getText(),
            "uid": self.uid
        })

    def linkgoogleok(self, result):
        print(result)
        window.alert("Account linked with Google !")
        location.reload()

    def linkmailok(self, usercred):
        print(usercred)
        window.alert("Account linked with Email !")
        location.reload()

    def linkgooglecallback(self):
        provider = __new__(firebase.auth.GoogleAuthProvider())
        firebase.auth().currentUser.linkWithPopup(provider).then(
            self.linkgoogleok,
            lambda err: window.alert("Link Google failed: {}".format(err))
        )

    def linkmailcallback(self):
        credential = firebase.auth.EmailAuthProvider.credential(self.emailinput.getText(), self.passwordinput.getText())
        firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential).then(
            self.linkmailok,
            lambda err: window.alert("Link Email failed: {}".format(err))
        )

    def helpcallback(self):
        self.sioreq({
            "kind": "getdoc",
            "data": "profilehelp",
            "owner": "doc"
        })

    def buildsignupdiv(self):
        self.signupdiv = Div()
        self.signupmaildiv = Div("signupmaildiv")
        self.emaillabel = Span().html("Email:")
        self.emailinput = TextInput().ac("profiletextinput").w(250)
        self.passwordlabel = Span().html("Password:")
        self.passwordinput = PasswordInput().ac("profiletextinput").w(100)
        self.helpbutton = Button("Help", self.helpcallback).ac("helpbutton")
        self.signinbutton = Button("Sign in", self.signincallback)
        self.signoutbutton = Button("Sign out", self.signoutcallback)
        self.signupbutton = Button("Sign up", self.signupcallback)
        self.sendverificationbutton = Button("Send verification", self.sendverificationcallback)
        self.resetpasswordbutton = Button("Reset password", self.resetpasswordcallback)
        self.linkgooglebutton = Button("Link Google", self.linkgooglecallback)
        self.linkmailbutton = Button("Link Email", self.linkmailcallback)
        self.userinfodiv = Div("userinfodiv")
        self.signupmaildiv.a([self.helpbutton, self.emaillabel, self.emailinput, self.passwordlabel, self.passwordinput, self.signinbutton, self.signoutbutton, self.signupbutton, self.sendverificationbutton, self.resetpasswordbutton, self.linkgooglebutton, self.linkmailbutton])        
        self.userdetailsdiv = Div("userdetailsdiv")
        self.displaynamelabel = Span().html("Display name:")
        self.displaynameinput = TextInput().ac("profiletextinput").w(250)
        self.photourllabel = Span().html("Photo url:")        
        self.photourlinput = TextInput().ac("profiletextinput").w(250)
        self.updatedisplaynamebutton = Button("Update display name", self.updatedisplaynamecallback)
        self.updatephotourlbutton = Button("Update photo url", self.updatephotourlcallback)
        self.userdetailsdiv.a([self.displaynamelabel, self.displaynameinput, self.updatedisplaynamebutton, self.photourllabel, self.photourlinput, self.updatephotourlbutton])
        self.photodiv = Div("photodiv")
        self.signupdiv.a([self.signupmaildiv, self.userdetailsdiv, self.userinfodiv, self.photodiv])                
        self.firebaseuidiv = Div().sa("id", "firebaseuidiv")        
        self.signupdiv.a(self.firebaseuidiv)

    def logobj(self, logkind, obj, prompt):
        objstr = JSON.stringify(obj)
        if self.log:
            li = LogItem({
                "text": objstr,
                "kind": logkind,
                "prompt": prompt
            })
            li.container.ac("socketlog")
            self.log.log(li)

    def emit(self, kind, obj):
        self.logobj("info", obj, "-> ")
        if self.rawsocket:
            self.rawsocket.emit(kind, obj)

    def sioreq(self, obj):
        obj["uid"] = self.getuid()
        #print("sioreq", obj)
        self.emit("sioreq", obj)

    def onconnect(self):
        if self.log:
            self.logobj("success", "socket connected ok", "socket message: ")
        if not self.configloaded:
            self.sioreq({
                "kind": "sendfirebaseconfig"
            })
        if self.connectcallback:
            self.connectcallback()

    def siores(self, obj):
        if self.log:
            self.logobj("normal", obj, "<- ")
        if self.configloaded:
            if self.siorescallback:
                self.siorescallback(obj)
        else:
            kind = obj["kind"]
            if kind == "firebaseconfig":
                self.configloaded = True
                self.startfirebase(obj["firebaseconfig"])                                

    def getuserdisplayname(self):
        if self.user:
            if self.displayName:
                return self.displayName
            return self.email
        return None

    def setprofiletab(self):
        self.profiletab.rc(["profilelogged", "profileanon"])
        dn = self.getuserdisplayname()
        if dn:
            self.profiletab.container.html(dn)
            self.profiletab.ac("profilelogged")
        else:
            if self.user:
                self.profiletab.container.html("Anonymous")
                self.profiletab.ac("profileanon")
            else:
                self.profiletab.container.html("Profile")

    def signinanonymously(self):
        firebase.auth().signInAnonymously().then(
            lambda: print("ok"),
            lambda error: print(error)
        )

    def userstatusverbal(self):
        if not self.user:
            return "[logged out]"
        if self.user.isAnonymous:
            return "anonymous"
        return cpick(self.emailVerified, "verified", "not verified")

    def userverified(self):
        if not self.user:
            return False
        if self.user.isAnonymous:
            return False
        return self.user.emailVerified

    def authstatechanged(self, user):        
        self.user = user
        self.passwordinput.setText("")
        if user:        
            self.displayName = user.displayName
            self.email = user.email
            self.emailVerified = user.emailVerified
            self.photoURL = user.photoURL
            self.isAnonymous = user.isAnonymous
            self.uid = user.uid
            self.providerData = user.providerData        
            print("user:", self.uid, self.displayName, self.email, self.providerData)
            self.nameinfodiv = Div().html("name : <span class='{}'>{}</span>".format(cpick(self.displayName, "uiinfo", "uiinfored"), getelse(self.displayName,"&lt;NA&gt;"))).pt(5)
            self.emailinfodiv = Div().html("email : <span class='{}'>{}</span>".format(cpick(self.email, "uiinfo", "uiinfored"), getelse(self.email, "&lt;NA&gt;")))
            self.verifiedinfodiv = Div().html("status : <span class='{}'>{}</span>".format(cpick(self.userverified(), "uiinfo", "uiinfored"), self.userstatusverbal()))            
            self.photourldiv = Div().html("photo url : <span class='{}'>{}</span>".format(cpick(self.photoURL, "uiinfo", "uiinfored"), getelse(self.photoURL,"&lt;NA&gt;")))
            self.uidinfodiv = Div().html("uid : <span class='uiinfo'>{}</span>".format(self.uid)).pb(8)
            self.userinfodiv.x().a([self.nameinfodiv, self.emailinfodiv, self.verifiedinfodiv, self.photourldiv, self.uidinfodiv])
            self.emailinput.setText(self.email)        
            self.displaynameinput.setText(self.displayName)                
            self.photourlinput.setText(self.photoURL)                
            self.photodiv.x()
            if self.photoURL:
                self.photodiv.html("<img src='{}' class='userphotoimg'></img>".format(self.photoURL))
        else:
            print("no user")
            self.userinfodiv.x().a([
                Div().html("Please sign up or sign in !"),
                Button("Sign in anonymously", self.signinanonymously())
            ])
        self.setprofiletab()
        self.userinfodiv.fs(cpick(self.user, 10, 14))
        if user:
            if self.authcallback:
                self.authcallback()

    def initializefirebase(self):
        print("initializing firebase from", self.firebaseconfig)
        firebase.initializeApp(self.firebaseconfig)                    
        firebase.auth().onAuthStateChanged(self.authstatechanged)                    

    def initializefirebaseui(self):
        self.uiConfig = {
            "signInSuccessUrl": '/',
            "signInOptions": [            
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                #firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                #firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                #firebase.auth.GithubAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                #firebase.auth.PhoneAuthProvider.PROVIDER_ID
            ],        
           "tosUrl": '/tos'
        }
        print("initializing firebase ui from", self.uiConfig)
        self.ui = __new__(firebaseui.auth.AuthUI(firebase.auth()))                
        self.ui.start(self.firebaseuidiv.e, self.uiConfig)

    def startfirebase(self, firebaseconfig):
        self.firebaseconfig = firebaseconfig
        self.initializefirebase()
        self.initializefirebaseui()        

    def getuid(self):
        if self.user:
            return self.uid
        return "mockuser"

    def __init__(self, args = {}):        
        self.configloaded = False
        self.user = None
        if window.location.protocol == "https:":
            self.ws_scheme = "wss://"
        else:
            self.ws_scheme = "ws://"
        self.SUBMIT_URL = self.ws_scheme + window.location.host
        print("creating socket {}".format(self.SUBMIT_URL))
        self.rawsocket = io.connect(self.SUBMIT_URL)
        print("socket created ok")
        self.log = Log()
        self.connectcallback = args.get("connectcallback", None)
        self.authcallback = args.get("authcallback", None)
        self.siorescallback = args.get("siorescallback", None)                
        self.buildsignupdiv()
        self.profiletab = Tab("profile", "Profile", self.signupdiv)
        if self.rawsocket:
            self.rawsocket.on("connect", self.onconnect)
            self.rawsocket.on("siores", self.siores)

conn = None

def createconn(args):
    global conn
    conn = Connection(args)    

def getconn():
    global conn
    return conn

######################################################

#LICH_API_GAMES_EXPORT = "games/export"
LICH_API_GAMES_EXPORT = "api/games/user"

######################################################

__pragma__("jsiter")

def lichapiget(path, token, callback, errcallback, showlink = None):    

    args = {
        "method": "GET"
    }

    if ( not ( token is None ) ) and ( True ):
        args["headers"] = {
            "Authorization": "Bearer {}".format(token)
        }

    fullpath = "https://lichess.org/" + path

    if showlink:
        showlink.html("<a href='{}' target='_blank' rel='noopener noreferrer'>{}</a>".format(fullpath, fullpath))

    fetch(fullpath, args).then(
        lambda response: response.text().then(
            lambda content: callback(content),
            lambda err: errcallback(err)
        ),
        lambda err: errcallback(err)
    )

__pragma__("nojsiter")

######################################################

