// Transcrypt'ed from Python, 2019-04-05 10:12:57
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {Forumgame} from './forumgame.js';
import {Log} from './widgets.js';
import {createconn, getconn} from './connection.js';
import {Board} from './board.js';
import {Config, DirBrowser, Doc, ProcessConsole, ProcessPane} from './system.js';
import {Schema} from './schema.js';
import {FileUploader, SplitPane, Tab, TabPane} from './widgets.js';
import {Button, Div, Hlink, Label, PasswordInput, Span, TextInput} from './dom.js';
import {IS_DEV, allchilds, cpick, escapeHTML, ge, getelse, getext, getrec, getrecm, queryparams} from './utils.js';
var __name__ = 'client';
export var Client =  __class__ ('Client', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		self.isadmin = false;
		self.root = ge ('clientroot');
		self.owners = dict ({});
		self.config = Config ();
		self.authdone = false;
		self.connectdone = false;
	});},
	get driveeditclickedcallback () {return __get__ (this, function (self, dir) {
		var ext = getext (dir);
		if (ext == 'bin') {
			self.mainboard.setbookpath (dir, true);
			self.mainboard.tabpane.selectbykey ('book');
			self.tabs.selectbykey ('board');
			self.mainboard.getbookpage ();
			return true;
		}
	});},
	get requestbots () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'getmybots'}));
	});},
	get createbotdiv () {return __get__ (this, function (self) {
		self.botdiv = Div ();
		self.botresultdiv = Div ();
		self.botdiv.a (Button ('Request bots', self.requestbots).mar (10));
		self.botdiv.a (Hlink ('/bots', 'Bots page'));
		self.botdiv.a (self.botresultdiv);
	});},
	get build () {return __get__ (this, function (self) {
		self.root.innerHTML = '';
		self.owners ['config'] = self.config;
		if (self.dodirbrowser) {
			self.maindirbrowser = DirBrowser (dict ({'id': 'maindirbrowser'}));
			self.owners ['maindirbrowser'] = self.maindirbrowser;
		}
		else {
			self.maindirbrowser = Div ();
		}
		if (self.dodrive) {
			self.drive = DirBrowser (dict ({'id': 'drive', 'drive': true, 'editclickedcallback': self.driveeditclickedcallback}));
			self.owners ['drive'] = self.drive;
		}
		else {
			self.drive = Div ();
		}
		self.createbotdiv ();
		if (self.doboard) {
			self.mainboard = Board (dict ({'dobook': self.dobook, 'dostoredanalysis': self.dostoredanalysis, 'dostoredauto': self.dostoredauto, 'dogames': self.dogames, 'setposinfo': self.setposinfo, 'dogamepreview': self.dogamepreview, 'background': self.boardbackground, 'autoanalysisdelay': self.autoanalysisdelay, 'maxgames': self.maxgames, 'gamesfilter': self.gamesfilter}));
			self.mainboard.setusername (self.username, self.usertoken);
			self.mainboard.tabpane.controlpanel.ac ('subcontrolpanel');
			self.owners ['mainboard'] = self.mainboard;
		}
		else {
			self.mainboard = Div ();
		}
		if (self.dodocs) {
			self.doc = Doc ();
			self.srcdiv = self.doc.srcdiv;
			self.owners ['doc'] = self.doc;
		}
		else {
			self.doc = Div ();
			self.srcdiv = Div ();
		}
		if (self.doabout) {
			self.about = Doc (dict ({'id': 'about', 'startpage': 'about', 'showcontentslink': false}));
			self.owners ['about'] = self.about;
		}
		else {
			self.about = Div ();
		}
		if (self.isadmin) {
			self.processpane = ProcessPane (dict ({'configsch': self.config.getpath ('processes')}));
			self.processpane.processtabpane.controlpanel.ac ('subcontrolpanel');
		}
		else {
			self.processpane = Div ('featureplaceholder').html ('Admin only feature.');
		}
		self.forumgametab = Tab ('forumgame', 'Forum game', Div ('featureplaceholder').html ('Forum game disabled.'));
		if (self.doforumgame) {
			self.forumgame = Forumgame ();
			self.forumgame.mainboard = self.mainboard;
			self.owners ['forumgame'] = self.forumgame;
			self.forumgametab = Tab ('forumgame', 'Forum game', self.forumgame);
		}
		self.tabs = TabPane (dict ({'id': 'maintabpane', 'fillwindow': true, 'tabs': [Tab ('config', 'Config', self.config), Tab ('upload', 'Upload', FileUploader (dict ({'url': '/upload'}))), Tab ('board', 'Board', self.mainboard), self.forumgametab, Tab ('process', 'Process', self.processpane), Tab ('dirbrowser', 'Dirbrowser', self.maindirbrowser), Tab ('drive', 'Drive', self.drive), Tab ('bots', 'Bots', self.botdiv), Tab ('doc', 'Doc', self.doc), Tab ('src', 'Src', self.srcdiv), Tab ('log', 'Log', getconn ().log), getconn ().profiletab, Tab ('about', 'About', self.about)], 'selected': 'drive'}));
		self.root.appendChild (self.tabs.e);
		var qseltab = queryparams.py_get ('tab', null);
		if (qseltab) {
			self.tabs.selectbykey (qseltab);
		}
	});},
	get onready () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'connected', 'queryparams': queryparams}));
	});},
	get setloadinfo () {return __get__ (this, function (self, content) {
		ge ('connectmsg').innerHTML = content;
	});},
	get onconnect () {return __get__ (this, function (self) {
		self.connectdone = true;
		if (self.authdone) {
			self.onready ();
		}
		else {
			self.setloadinfo ('Authenticating, please wait ...');
		}
	});},
	get onauth () {return __get__ (this, function (self) {
		self.authdone = true;
		if (self.connectdone) {
			self.onready ();
		}
		else {
			self.setloadinfo ('Authenticated, connecting to server, please wait ...');
		}
	});},
	get getschemaconfigfromobj () {return __get__ (this, function (self, obj) {
		self.config.setschemaconfig (obj ['schemaconfig']);
		self.dodocs = self.config.py_get ('global/dodocs', true);
		self.dobook = self.config.py_get ('global/dobook', true);
		self.username = self.config.py_get ('global/username');
		self.usertoken = self.config.py_get ('global/usertoken');
		self.dostoredanalysis = self.config.py_get ('global/dostoredanalysis', true);
		self.dodirbrowser = self.config.py_get ('global/dodirbrowser', true);
		self.dodrive = self.config.py_get ('global/dodrive', true);
		self.dogames = self.config.py_get ('global/dogames', true);
		self.doboard = self.config.py_get ('global/doboard', true);
		self.doabout = self.config.py_get ('global/doabout', true);
		self.dogamepreview = self.config.py_get ('global/dogamepreview', true);
		self.doforumgame = self.config.py_get ('global/doforumgame', true);
		self.dostoredauto = self.config.py_get ('global/dostoredauto', true);
		self.boardbackground = self.config.py_get ('layout/boardbackground', 'wood.jpg');
		self.autoanalysisdelay = self.config.py_get ('global/autoanalysisdelay', true);
		self.maxgames = self.config.py_get ('global/maxgames', 25);
		self.gamesfilter = self.config.py_get ('global/gamesfilter', '');
		self.setposinfo = obj ['setposinfo'];
	});},
	get buildfromconfiginobj () {return __get__ (this, function (self, obj) {
		self.getschemaconfigfromobj (obj);
		self.build ();
	});},
	get setmybots () {return __get__ (this, function (self, obj) {
		var botprofiles = obj ['mybots'];
		self.botresultdiv.x ();
		for (var id in botprofiles) {
			var botprofile = botprofiles [id];
			self.botresultdiv.a (Div ().html ('{} {}'.format (botprofile ['username'], cpick (botprofile ['online'], 'online', 'offline'))).fs (25).pad (5));
			self.botresultdiv.a (Div ().html ('follow {} games {} last move {}'.format (botprofile ['nbFollowers'], botprofile ['count'] ['all'], botprofile ['lastmoveago'])).fs (20).pad (3));
			self.botresultdiv.a (Div ().html ('last players {}'.format (botprofile ['lastplayers'])).fs (20).pad (3));
		}
	});},
	get siores () {return __get__ (this, function (self, obj) {
		self.isadmin = obj ['isadmin'];
		if (queryparams.py_get ('noadmin', 'false') == 'true') {
			self.isadmin = false;
		}
		if (__in__ ('kind', obj)) {
			var kind = obj ['kind'];
			if (kind == 'buffered') {
				for (var item of obj ['items']) {
					self.siores (item);
				}
			}
			else if (kind == 'connectedack') {
				self.buildfromconfiginobj (obj);
			}
			else if (kind == 'configsaved') {
				window.alert ('Config saved, {} characters'.format (obj ['size']));
				location.reload ();
			}
			else if (kind == 'alert') {
				window.alert (obj ['data']);
				if (obj ['reload']) {
					location.reload ();
				}
			}
			else if (kind == 'proc') {
				self.processpane.siores (obj);
			}
			else if (kind == 'storedb') {
				// pass;
			}
			else if (kind == 'storedbfailed') {
				// pass;
			}
			else if (kind == 'retrievedbfailed') {
				// pass;
			}
			else if (kind == 'mybots') {
				self.setmybots (obj);
			}
			else if (IS_DEV ()) {
				self.owners [obj ['owner']].siores (obj);
			}
			else {
				try {
					self.owners [obj ['owner']].siores (obj);
				}
				catch (__except0__) {
					print ('could not handle', obj);
				}
			}
			if (kind == 'showdoc') {
				if (obj ['switchtodoctab']) {
					self.tabs.selectbykey ('doc');
				}
			}
		}
	});},
	get authtimeout () {return __get__ (this, function (self) {
		if (!(self.authdone)) {
			print ('authtimeout');
			self.onauth ();
		}
	});},
	get startup () {return __get__ (this, function (self) {
		createconn (dict ({'connectcallback': self.onconnect, 'authcallback': self.onauth, 'siorescallback': self.siores}));
		if (IS_DEV ()) {
			setTimeout (self.authtimeout, 3000);
		}
	});}
});

//# sourceMappingURL=client.map