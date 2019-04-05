// Transcrypt'ed from Python, 2019-04-05 10:12:58
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {cpick, getelse} from './utils.js';
import {Button, Div, PasswordInput, Span, TextInput} from './dom.js';
import {Log, LogItem, Tab} from './widgets.js';
var __name__ = 'connection';
export var Connection =  __class__ ('Connection', [object], {
	__module__: __name__,
	get signincallback () {return __get__ (this, function (self) {
		var email = self.emailinput.getText ();
		var password = self.passwordinput.getText ();
		print ('signing in user with', email, password);
		firebase.auth ().signInWithEmailAndPassword (email, password).then ((function __lambda__ () {
			return print ('ok');
		}), (function __lambda__ (error) {
			return window.alert ('{}'.format (error));
		}));
	});},
	get signoutcallback () {return __get__ (this, function (self) {
		if (firebase.auth ().currentUser) {
			print ('signing out');
			firebase.auth ().signOut ();
		}
		else {
			window.alert ('Already signed out.');
		}
	});},
	get signupcallback () {return __get__ (this, function (self) {
		var email = self.emailinput.getText ();
		var password = self.passwordinput.getText ();
		print ('signing up user with', email, password);
		firebase.auth ().createUserWithEmailAndPassword (email, password).then ((function __lambda__ () {
			return print ('ok');
		}), (function __lambda__ (error) {
			return window.alert ('{}'.format (error));
		}));
	});},
	get sendverificationcallback () {return __get__ (this, function (self) {
		var email = self.emailinput.getText ();
		firebase.auth ().currentUser.sendEmailVerification ().then ((function __lambda__ () {
			return window.alert ('Verification email has been sent to {} !'.format (email));
		}), (function __lambda__ (error) {
			return window.alert ('{}'.format (error));
		}));
	});},
	get resetpasswordcallback () {return __get__ (this, function (self) {
		var email = self.emailinput.getText ();
		firebase.auth ().sendPasswordResetEmail (email).then ((function __lambda__ () {
			return window.alert ('Password reset email has been sent to {} !'.format (email));
		}), (function __lambda__ (error) {
			return window.alert ('{}'.format (error));
		}));
	});},
	get updatedisplaynamecallback () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'updateuserdisplayname', 'displayname': self.displaynameinput.getText (), 'uid': self.uid}));
	});},
	get updatephotourlcallback () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'updateuserphotourl', 'photourl': self.photourlinput.getText (), 'uid': self.uid}));
	});},
	get linkgoogleok () {return __get__ (this, function (self, result) {
		print (result);
		window.alert ('Account linked with Google !');
		location.reload ();
	});},
	get linkmailok () {return __get__ (this, function (self, usercred) {
		print (usercred);
		window.alert ('Account linked with Email !');
		location.reload ();
	});},
	get linkgooglecallback () {return __get__ (this, function (self) {
		var provider = new firebase.auth.GoogleAuthProvider ();
		firebase.auth ().currentUser.linkWithPopup (provider).then (self.linkgoogleok, (function __lambda__ (err) {
			return window.alert ('Link Google failed: {}'.format (err));
		}));
	});},
	get linkmailcallback () {return __get__ (this, function (self) {
		var credential = firebase.auth.EmailAuthProvider.credential (self.emailinput.getText (), self.passwordinput.getText ());
		firebase.auth ().currentUser.linkAndRetrieveDataWithCredential (credential).then (self.linkmailok, (function __lambda__ (err) {
			return window.alert ('Link Email failed: {}'.format (err));
		}));
	});},
	get helpcallback () {return __get__ (this, function (self) {
		self.sioreq (dict ({'kind': 'getdoc', 'data': 'profilehelp', 'owner': 'doc'}));
	});},
	get buildsignupdiv () {return __get__ (this, function (self) {
		self.signupdiv = Div ();
		self.signupmaildiv = Div ('signupmaildiv');
		self.emaillabel = Span ().html ('Email:');
		self.emailinput = TextInput ().ac ('profiletextinput').w (250);
		self.passwordlabel = Span ().html ('Password:');
		self.passwordinput = PasswordInput ().ac ('profiletextinput').w (100);
		self.helpbutton = Button ('Help', self.helpcallback).ac ('helpbutton');
		self.signinbutton = Button ('Sign in', self.signincallback);
		self.signoutbutton = Button ('Sign out', self.signoutcallback);
		self.signupbutton = Button ('Sign up', self.signupcallback);
		self.sendverificationbutton = Button ('Send verification', self.sendverificationcallback);
		self.resetpasswordbutton = Button ('Reset password', self.resetpasswordcallback);
		self.linkgooglebutton = Button ('Link Google', self.linkgooglecallback);
		self.linkmailbutton = Button ('Link Email', self.linkmailcallback);
		self.userinfodiv = Div ('userinfodiv');
		self.signupmaildiv.a ([self.helpbutton, self.emaillabel, self.emailinput, self.passwordlabel, self.passwordinput, self.signinbutton, self.signoutbutton, self.signupbutton, self.sendverificationbutton, self.resetpasswordbutton, self.linkgooglebutton, self.linkmailbutton]);
		self.userdetailsdiv = Div ('userdetailsdiv');
		self.displaynamelabel = Span ().html ('Display name:');
		self.displaynameinput = TextInput ().ac ('profiletextinput').w (250);
		self.photourllabel = Span ().html ('Photo url:');
		self.photourlinput = TextInput ().ac ('profiletextinput').w (250);
		self.updatedisplaynamebutton = Button ('Update display name', self.updatedisplaynamecallback);
		self.updatephotourlbutton = Button ('Update photo url', self.updatephotourlcallback);
		self.userdetailsdiv.a ([self.displaynamelabel, self.displaynameinput, self.updatedisplaynamebutton, self.photourllabel, self.photourlinput, self.updatephotourlbutton]);
		self.photodiv = Div ('photodiv');
		self.signupdiv.a ([self.signupmaildiv, self.userdetailsdiv, self.userinfodiv, self.photodiv]);
		self.firebaseuidiv = Div ().sa ('id', 'firebaseuidiv');
		self.signupdiv.a (self.firebaseuidiv);
	});},
	get logobj () {return __get__ (this, function (self, logkind, obj, prompt) {
		var objstr = JSON.stringify (obj);
		if (self.log) {
			var li = LogItem (dict ({'text': objstr, 'kind': logkind, 'prompt': prompt}));
			li.container.ac ('socketlog');
			self.log.log (li);
		}
	});},
	get emit () {return __get__ (this, function (self, kind, obj) {
		self.logobj ('info', obj, '-> ');
		if (self.rawsocket) {
			self.rawsocket.emit (kind, obj);
		}
	});},
	get sioreq () {return __get__ (this, function (self, obj) {
		obj ['uid'] = self.getuid ();
		self.emit ('sioreq', obj);
	});},
	get onconnect () {return __get__ (this, function (self) {
		if (self.log) {
			self.logobj ('success', 'socket connected ok', 'socket message: ');
		}
		if (!(self.configloaded)) {
			self.sioreq (dict ({'kind': 'sendfirebaseconfig'}));
		}
		if (self.connectcallback) {
			self.connectcallback ();
		}
	});},
	get siores () {return __get__ (this, function (self, obj) {
		if (self.log) {
			self.logobj ('normal', obj, '<- ');
		}
		if (self.configloaded) {
			if (self.siorescallback) {
				self.siorescallback (obj);
			}
		}
		else {
			var kind = obj ['kind'];
			if (kind == 'firebaseconfig') {
				self.configloaded = true;
				self.startfirebase (obj ['firebaseconfig']);
			}
		}
	});},
	get getuserdisplayname () {return __get__ (this, function (self) {
		if (self.user) {
			if (self.displayName) {
				return self.displayName;
			}
			return self.email;
		}
		return null;
	});},
	get setprofiletab () {return __get__ (this, function (self) {
		self.profiletab.rc (['profilelogged', 'profileanon']);
		var dn = self.getuserdisplayname ();
		if (dn) {
			self.profiletab.container.html (dn);
			self.profiletab.ac ('profilelogged');
		}
		else if (self.user) {
			self.profiletab.container.html ('Anonymous');
			self.profiletab.ac ('profileanon');
		}
		else {
			self.profiletab.container.html ('Profile');
		}
	});},
	get signinanonymously () {return __get__ (this, function (self) {
		firebase.auth ().signInAnonymously ().then ((function __lambda__ () {
			return print ('ok');
		}), (function __lambda__ (error) {
			return print (error);
		}));
	});},
	get userstatusverbal () {return __get__ (this, function (self) {
		if (!(self.user)) {
			return '[logged out]';
		}
		if (self.user.isAnonymous) {
			return 'anonymous';
		}
		return cpick (self.emailVerified, 'verified', 'not verified');
	});},
	get userverified () {return __get__ (this, function (self) {
		if (!(self.user)) {
			return false;
		}
		if (self.user.isAnonymous) {
			return false;
		}
		return self.user.emailVerified;
	});},
	get authstatechanged () {return __get__ (this, function (self, user) {
		self.user = user;
		self.passwordinput.setText ('');
		if (user) {
			self.displayName = user.displayName;
			self.email = user.email;
			self.emailVerified = user.emailVerified;
			self.photoURL = user.photoURL;
			self.isAnonymous = user.isAnonymous;
			self.uid = user.uid;
			self.providerData = user.providerData;
			print ('user:', self.uid, self.displayName, self.email, self.providerData);
			self.nameinfodiv = Div ().html ("name : <span class='{}'>{}</span>".format (cpick (self.displayName, 'uiinfo', 'uiinfored'), getelse (self.displayName, '&lt;NA&gt;'))).pt (5);
			self.emailinfodiv = Div ().html ("email : <span class='{}'>{}</span>".format (cpick (self.email, 'uiinfo', 'uiinfored'), getelse (self.email, '&lt;NA&gt;')));
			self.verifiedinfodiv = Div ().html ("status : <span class='{}'>{}</span>".format (cpick (self.userverified (), 'uiinfo', 'uiinfored'), self.userstatusverbal ()));
			self.photourldiv = Div ().html ("photo url : <span class='{}'>{}</span>".format (cpick (self.photoURL, 'uiinfo', 'uiinfored'), getelse (self.photoURL, '&lt;NA&gt;')));
			self.uidinfodiv = Div ().html ("uid : <span class='uiinfo'>{}</span>".format (self.uid)).pb (8);
			self.userinfodiv.x ().a ([self.nameinfodiv, self.emailinfodiv, self.verifiedinfodiv, self.photourldiv, self.uidinfodiv]);
			self.emailinput.setText (self.email);
			self.displaynameinput.setText (self.displayName);
			self.photourlinput.setText (self.photoURL);
			self.photodiv.x ();
			if (self.photoURL) {
				self.photodiv.html ("<img src='{}' class='userphotoimg'></img>".format (self.photoURL));
			}
		}
		else {
			print ('no user');
			self.userinfodiv.x ().a ([Div ().html ('Please sign up or sign in !'), Button ('Sign in anonymously', self.signinanonymously ())]);
		}
		self.setprofiletab ();
		self.userinfodiv.fs (cpick (self.user, 10, 14));
		if (user) {
			if (self.authcallback) {
				self.authcallback ();
			}
		}
	});},
	get initializefirebase () {return __get__ (this, function (self) {
		print ('initializing firebase from', self.firebaseconfig);
		firebase.initializeApp (self.firebaseconfig);
		firebase.auth ().onAuthStateChanged (self.authstatechanged);
	});},
	get initializefirebaseui () {return __get__ (this, function (self) {
		self.uiConfig = dict ({'signInSuccessUrl': '/', 'signInOptions': [firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.EmailAuthProvider.PROVIDER_ID], 'tosUrl': '/tos'});
		print ('initializing firebase ui from', self.uiConfig);
		self.ui = new firebaseui.auth.AuthUI (firebase.auth ());
		self.ui.start (self.firebaseuidiv.e, self.uiConfig);
	});},
	get startfirebase () {return __get__ (this, function (self, firebaseconfig) {
		self.firebaseconfig = firebaseconfig;
		self.initializefirebase ();
		self.initializefirebaseui ();
	});},
	get getuid () {return __get__ (this, function (self) {
		if (self.user) {
			return self.uid;
		}
		return 'mockuser';
	});},
	get __init__ () {return __get__ (this, function (self, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		self.configloaded = false;
		self.user = null;
		if (window.location.protocol == 'https:') {
			self.ws_scheme = 'wss://';
		}
		else {
			self.ws_scheme = 'ws://';
		}
		self.SUBMIT_URL = self.ws_scheme + window.location.host;
		print ('creating socket {}'.format (self.SUBMIT_URL));
		self.rawsocket = io.connect (self.SUBMIT_URL);
		print ('socket created ok');
		self.log = Log ();
		self.connectcallback = args.py_get ('connectcallback', null);
		self.authcallback = args.py_get ('authcallback', null);
		self.siorescallback = args.py_get ('siorescallback', null);
		self.buildsignupdiv ();
		self.profiletab = Tab ('profile', 'Profile', self.signupdiv);
		if (self.rawsocket) {
			self.rawsocket.on ('connect', self.onconnect);
			self.rawsocket.on ('siores', self.siores);
		}
	});}
});
export var conn = null;
export var createconn = function (args) {
	conn = Connection (args);
};
export var getconn = function () {
	return conn;
};
export var LICH_API_GAMES_EXPORT = 'api/games/user';
export var lichapiget = function (path, token, callback, errcallback, showlink) {
	if (typeof showlink == 'undefined' || (showlink != null && showlink.hasOwnProperty ("__kwargtrans__"))) {;
		var showlink = null;
	};
	var args = {'method': 'GET'};
	if (!(token === null) && true) {
		args ['headers'] = {'Authorization': 'Bearer {}'.format (token)};
	}
	var fullpath = 'https://lichess.org/' + path;
	if (showlink) {
		showlink.html ("<a href='{}' target='_blank' rel='noopener noreferrer'>{}</a>".format (fullpath, fullpath));
	}
	fetch (fullpath, args).then ((function __lambda__ (response) {
		return response.text ().then ((function __lambda__ (content) {
			return callback (content);
		}), (function __lambda__ (err) {
			return errcallback (err);
		}));
	}), (function __lambda__ (err) {
		return errcallback (err);
	}));
};

//# sourceMappingURL=connection.map