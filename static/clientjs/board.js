// Transcrypt'ed from Python, 2019-05-29 07:44:32
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {LICH_API_GAMES_EXPORT, getconn, lichapiget} from './connection.js';
import {Log, LogItem} from './widgets.js';
import {SplitPane, Tab, TabPane} from './widgets.js';
import {BLACK, BasicBoard, MultipvInfo, PgnInfo, PgnList, PgnText, VARIANT_OPTIONS, WHITE} from './basicboard.js';
import {IS_PROD, View, cpick, getglobalcssvarpxint, scorecolor, scoreverbal, uci_variant_to_variantkey} from './utils.js';
import {Button, CheckBox, ComboBox, CopyText, Div, Labeled, Span, TextArea, e} from './dom.js';
var __name__ = 'board';
export var Board =  __class__ ('Board', [e], {
	__module__: __name__,
	get flipcallback () {return __get__ (this, function (self) {
		self.basicboard.setflip (!(self.basicboard.flip));
		self.flip = self.basicboard.flip;
		localStorage.setItem ('mainboardflip', self.flip);
	});},
	get getstoredauto () {return __get__ (this, function (self) {
		self.autoinfo = null;
		self.buildauto ();
		if (self.dostoredauto) {
			getconn ().sioreq (dict ({'kind': 'getstoredauto', 'owner': self.id, 'bookname': self.getautoname (), 'variantkey': self.basicboard.variantkey, 'fen': self.basicboard.fen}));
		}
	});},
	get setfromfen () {return __get__ (this, function (self, fen, positioninfo, edithistory) {
		if (typeof positioninfo == 'undefined' || (positioninfo != null && positioninfo.hasOwnProperty ("__kwargtrans__"))) {;
			var positioninfo = dict ({});
		};
		if (typeof edithistory == 'undefined' || (edithistory != null && edithistory.hasOwnProperty ("__kwargtrans__"))) {;
			var edithistory = true;
		};
		self.fen2zobristkeyhex [fen] = null;
		if (__in__ ('zobristkeyhex', positioninfo)) {
			self.fen2zobristkeyhex [fen] = positioninfo ['zobristkeyhex'];
		}
		self.trainfen = null;
		var restartanalysis = false;
		if (self.analyzing.py_get ()) {
			self.stopanalyzecallback ();
			var restartanalysis = true;
		}
		if (edithistory && __in__ ('genmove', positioninfo)) {
			var genmove = positioninfo ['genmove'];
			if (genmove == 'reset') {
				self.history = [];
			}
			else {
				self.history.append (dict ({'fen': self.basicboard.fen, 'positioninfo': self.positioninfo}));
			}
		}
		self.positioninfo = positioninfo;
		self.movelist = cpick (__in__ ('movelist', self.positioninfo), self.positioninfo ['movelist'], []);
		self.basicboard.setfromfen (fen, self.positioninfo);
		self.basicboard.setflip (self.flip);
		self.buildpositioninfo ();
		if (restartanalysis) {
			self.analyzecallbackfactory () ();
		}
		self.getstoredanalysisinfo ();
		self.getstoredauto ();
		self.storeposinfo ();
	});},
	get getbookpage () {return __get__ (this, function (self) {
		if (self.dobook) {
			self.bookdiv.x ();
			getconn ().sioreq (dict ({'kind': 'getbook', 'variantkey': self.basicboard.variantkey, 'path': self.bookpath, 'drive': self.bookdrive, 'fen': self.basicboard.fen, 'owner': self.id}));
		}
	});},
	get getstoredanalysisinfo () {return __get__ (this, function (self) {
		self.getbookpage ();
		self.analysisinfodiv.x ();
		if (!(self.analyzing.py_get ()) && self.dostoredanalysis) {
			getconn ().sioreq (dict ({'kind': 'retrievedb', 'owner': self.id, 'path': 'analysisinfo/{}/{}'.format (self.basicboard.variantkey, self.positioninfo ['zobristkeyhex'])}));
		}
	});},
	get setvariantcombo () {return __get__ (this, function (self) {
		self.variantcombo.setoptions (VARIANT_OPTIONS, self.basicboard.variantkey, self.variantchanged);
	});},
	get showcurrentgamepos () {return __get__ (this, function (self) {
		try {
			for (var j = 0; j < len (self.positioninfos); j++) {
				self.posdivs [j].arc (j == self.gamei, 'boardposdivselected');
				if (j == self.gamei) {
					self.posdivs [j].e.scrollIntoView (dict ({'block': 'center', 'inline': 'center'}));
				}
			}
		}
		catch (__except0__) {
			// pass;
		}
	});},
	get posclickedfactory () {return __get__ (this, function (self, i) {
		var poslicked = function () {
			self.gamei = i;
			var pinfo = self.positioninfos [i];
			self.setfromfen (pinfo ['fen'], pinfo ['positioninfo']);
			self.showcurrentgamepos ();
			self.history = [];
			self.tabpane.selectbykey ('analysis');
		};
		return poslicked;
	});},
	get selectgamei () {return __get__ (this, function (self, i) {
		if (len (self.positioninfos) > 0) {
			self.posclickedfactory (i) ();
		}
	});},
	get gamehere () {return __get__ (this, function (self) {
		self.selectgamei (self.gamei);
	});},
	get gametobegin () {return __get__ (this, function (self) {
		self.gamei = 0;
		self.selectgamei (self.gamei);
	});},
	get gameback () {return __get__ (this, function (self) {
		self.gamei--;
		if (self.gamei < 0) {
			self.gamei = 0;
		}
		self.selectgamei (self.gamei);
	});},
	get gameforward () {return __get__ (this, function (self) {
		self.gamei++;
		if (self.gamei >= len (self.positioninfos)) {
			self.gamei = len (self.positioninfos) - 1;
		}
		self.selectgamei (self.gamei);
	});},
	get gametoend () {return __get__ (this, function (self) {
		self.gamei = len (self.positioninfos) - 1;
		self.selectgamei (self.gamei);
	});},
	get getcurrentline () {return __get__ (this, function (self) {
		try {
			var sans = [];
			var hm = -(1);
			for (var pinfo of self.positioninfos) {
				var posinfo = pinfo ['positioninfo'];
				var genmove = '*';
				if (__in__ ('genmove', posinfo)) {
					var genmove = posinfo ['genmove'] ['san'];
				}
				if (__mod__ (hm, 2) == 0) {
					var genmove = '{}. {}'.format (hm / 2 + 1, genmove);
				}
				hm++;
				if (hm <= self.gamei) {
					sans.append (genmove);
				}
			}
			return ' '.join (sans);
		}
		catch (__except0__) {
			print ('could not get current line');
			// pass;
		}
	});},
	get buildgame () {return __get__ (this, function (self) {
		self.gamediv.x ();
		self.posdivs = [];
		var i = 0;
		for (var pinfo of self.positioninfos) {
			var fen = pinfo ['fen'];
			var posinfo = pinfo ['positioninfo'];
			var genmove = '*';
			if (__in__ ('genmove', posinfo)) {
				var genmove = posinfo ['genmove'] ['san'];
			}
			var posdiv = Div ().ac ('boardposdiv');
			self.posdivs.append (posdiv);
			posdiv.ae ('mousedown', self.posclickedfactory (i));
			var movediv = Div ().ac ('boardposmovediv').html (genmove);
			var fendiv = Div ().ac ('boardposfendiv');
			if (self.dogamepreview) {
				var showboard = BasicBoard (dict ({'show': true, 'showfen': false, 'positioninfo': posinfo, 'fen': fen, 'squaresize': 20, 'flip': self.flip}));
				fendiv.a (showboard);
			}
			else {
				posdiv.w (500).mt (4);
				fendiv.w (400).pl (4).ml (4).mr (4);
				fendiv.html (fen);
			}
			posdiv.a ([movediv, fendiv]);
			self.gamediv.a (posdiv);
			i++;
		}
		self.gamei = 0;
		self.gamehere ();
	});},
	get entryclickedfactory () {return __get__ (this, function (self, uci) {
		var entryclicked = function () {
			if (!(self.moveclickedcallback === null)) {
				self.moveclickedcallback (self.basicboard.variantkey, self.basicboard.fen, uci);
			}
		};
		return entryclicked;
	});},
	get setbook () {return __get__ (this, function (self, obj) {
		self.entrieslist = obj ['entrieslist'];
		self.bookdiv.x ();
		self.bookcontrolpanel = Div ().ac ('bigboardanalysiscontrolpanel').w (260);
		self.addgamecontrolbuttons (self.bookcontrolpanel);
		self.bookdiv.a (self.bookcontrolpanel);
		for (var entry of self.entrieslist) {
			var uci = entry ['uci'];
			var san = entry ['san'];
			var weight = entry ['weight'];
			var ediv = Div ('pbookediv');
			var ucidiv = Div ('pucidiv').html (uci);
			var sandiv = Div ('psandiv').html (san);
			var weightdiv = Div ('pweightdiv').html (weight);
			ediv.a ([sandiv, ucidiv, weightdiv]);
			ediv.ae ('mousedown', self.entryclickedfactory (uci));
			self.bookdiv.a (ediv);
		}
	});},
	get automoveclickedfactory () {return __get__ (this, function (self, uci) {
		var automoveclicked = function () {
			if (self.addmovemode) {
				self.addmovecallback ();
				self.addmovetobook (move);
			}
			else if (!(self.moveclickedcallback === null)) {
				self.moveclickedcallback (self.basicboard.variantkey, self.basicboard.fen, uci);
			}
		};
		return automoveclicked;
	});},
	get getautoname () {return __get__ (this, function (self) {
		self.autoname = localStorage.getItem ('autoname/' + self.basicboard.variantkey);
		if (!(self.autoname)) {
			self.autoname = 'default';
		}
		return self.autoname;
	});},
	get changebookname () {return __get__ (this, function (self) {
		var bookname = window.prompt ('Enter book name.', self.getautoname ());
		if (!(bookname)) {
			return ;
		}
		localStorage.setItem ('autoname/' + self.basicboard.variantkey, bookname);
		self.getstoredauto ();
	});},
	get setenvvarfactory () {return __get__ (this, function (self, key, value) {
		if (key == 'ANALYSISROOT') {
			var value = self.basicboard.fen;
		}
		var settenvvar = function () {
			var valueinput = window.prompt ('Enter value for move {}:'.format (key), value);
			if (!(valueinput)) {
				return ;
			}
			getconn ().sioreq (dict ({'kind': 'setenvvar', 'key': key, 'value': valueinput, 'owner': self.id}));
		};
		return settenvvar;
	});},
	get buildauto () {return __get__ (this, function (self) {
		self.autodiv.x ();
		self.autonamediv = Div ().pad (5).ff ('monospace');
		self.booknamediv = Div ().disp ('inline-block').pad (1).pl (8).bc ('#cfc').par (8).fs (16).curlyborder ().html (self.getautoname ());
		self.autonamediv.a (self.booknamediv);
		self.envvarsdiv = Div ().ml (3);
		if (self.posdict) {
			self.autobookinfodiv = Div ().disp ('inline-block');
			self.autobookinfodiv.a (Div ().disp ('inline-block').pad (3).ml (5).bc ('#eef').fs (14).html ('numpos {}'.format (self.posdict ['numpos'])));
			self.autobookinfodiv.a (Div ().disp ('inline-block').pad (3).ml (5).bc ('#fee').html ('mod {}'.format (self.posdict ['mod'])));
			self.autobookinfodiv.a (Div ().disp ('inline-block').pad (3).ml (5).bc ('#fee').html ('maxnumbpos {}'.format (self.posdict ['maxnumbpos'])));
			self.autobookinfodiv.a (Div ().disp ('inline-block').pad (3).ml (5).bc ('#fee').html ('maxtotalblobsize {}'.format (self.posdict ['maxtotalblobsize'])));
			self.autonamediv.a (self.autobookinfodiv);
			for (var item of self.posdict ['envvars']) {
				var key = item [0];
				var value = item [1];
				var keydiv = Div ().cp ().fs (10).mar (2).pad (2).bc ('#eee').disp ('inline-block').html (key);
				keydiv.ae ('mousedown', self.setenvvarfactory (key, value));
				var valuediv = Div ().fs (10).pad (2).bc ('#efe').disp ('inline-block').html (value);
				self.envvarsdiv.a ([keydiv, valuediv]);
			}
			self.updatesdiv = Div ().ff ('monospace').fs (11);
			self.updatesdiv.a (Div ().disp ('inline-block').pad (3).mb (1).mt (1).ml (5).bc ('#ffe').html ('buildinfo {}'.format (self.posdict ['buildinfo'])));
			self.updatesdiv.a (Div ().disp ('inline-block').pad (3).mb (1).mt (1).ml (5).bc ('#fee').html ('lastsync {}'.format (self.posdict ['lastsync'])));
			self.updatesdiv.a (Div ().disp ('inline-block').pad (3).mb (1).mt (1).ml (5).bc ('#fee').html ('lastupload {}'.format (self.posdict ['lastupload'])));
			self.updatesdiv.a (Div ().disp ('inline-block').pad (3).mb (1).mt (1).ml (5).bc ('#fee').html ('lastminimax {}'.format (self.posdict ['lastminimax'])));
			self.updatesdiv.a (Div ().disp ('inline-block').pad (3).mb (1).mt (1).ml (5).bc ('#fee').html ('lastadd {}'.format (self.posdict ['lastadd'])));
		}
		self.autbookbuttonsdiv = Div ().mt (3);
		self.autbookbuttonsdiv.a (Button ('Change book name', self.changebookname));
		self.autbookbuttonsdiv.a (Button ('Analyze lichess', self.lichessanalysisclicked).ml (5));
		self.autodiv.a (self.autonamediv);
		self.autonamediv.a (self.autbookbuttonsdiv);
		if (self.updatesdiv) {
			self.autodiv.a (self.updatesdiv);
		}
		self.autodiv.a (self.envvarsdiv);
		if (!(self.autoinfo)) {
			return ;
		}
		self.autoinfo = sorted (self.autoinfo, __kwargtrans__ ({key: (function __lambda__ (item) {
			return item ['evaluation'];
		}), reverse: true}));
		for (var item of self.autoinfo) {
			var score = item ['score'];
			var evaluation = item ['evaluation'];
			var haspv = item ['haspv'];
			var uci = item ['algeb'];
			var depth = item ['depth'];
			var itemdiv = Div ().disp ('flex').ai ('center');
			var san = item ['san'];
			if (haspv > 0) {
				san += ' ...';
			}
			var sandiv = Div ().w (80).bc ('#ffe').ta ('center').pad (3).fs (20).cp ().fw ('bold').html (san).c (scorecolor (evaluation)).mar (2);
			sandiv.ae ('mousedown', self.automoveclickedfactory (uci));
			itemdiv.a (sandiv);
			var evaldiv = Div ().w (80).bc ('#efe').ta ('center').pad (3).fs (20).cp ().fw ('bold').html (scoreverbal (evaluation)).c (scorecolor (evaluation)).mar (2);
			itemdiv.a (evaldiv);
			var haspvstr = str (haspv);
			if (haspv == 0) {
				var haspvstr = '-';
			}
			var haspvdiv = Div ().w (80).bc ('#fef').ta ('center').pad (3).fs (14).cp ().html (haspvstr).mar (2).fst ('italic').fw ('bold');
			itemdiv.a (haspvdiv);
			var depthdiv = Div ().w (80).bc ('#eef').ta ('center').pad (3).fs (20).cp ().fw ('bold').html (depth).c ('#007').mar (2);
			itemdiv.a (depthdiv);
			var scorediv = Div ().w (80).bc ('#eee').ta ('center').pad (3).fs (20).cp ().fw ('bold').html (scoreverbal (score)).c (scorecolor (score)).mar (2);
			itemdiv.a (scorediv);
			self.autodiv.a (itemdiv);
		}
	});},
	get getcachedanalysisinfobyfen () {return __get__ (this, function (self, fen) {
		if (__in__ (fen, self.fen2zobristkeyhex)) {
			var zobristkeyhex = self.fen2zobristkeyhex [fen];
			if (zobristkeyhex) {
				try {
					if (self.analysisinfo ['zobristkeyhex'] == zobristkeyhex) {
						return self.analysisinfo;
					}
				}
				catch (__except0__) {
					// pass;
				}
				if (__in__ (zobristkeyhex, self.zobristkeyhex2analysisinfo)) {
					var dataobj = self.zobristkeyhex2analysisinfo [zobristkeyhex];
					if (dataobj == 'none') {
						return 'none';
					}
					if (__in__ ('analysisinfo', dataobj)) {
						var analysisinfo = dataobj ['analysisinfo'];
						return analysisinfo;
					}
				}
			}
		}
		return null;
	});},
	get sioresfunc () {return __get__ (this, function (self, response) {
		var dataobj = response ['dataobj'];
		if (dataobj) {
			var analysisinfo = dataobj ['analysisinfo'];
			if (analysisinfo) {
				self.processanalysisinfo (analysisinfo, true);
			}
		}
		var historyobj = response ['historyobj'];
		if (historyobj) {
			var uci_variant = historyobj ['uci_variant'];
			var chess960 = historyobj ['chess960'];
			var pgn = historyobj ['pgn'];
			var pgninfo = PgnInfo (self).setcontent (pgn);
			var vk = uci_variant_to_variantkey (uci_variant, chess960);
			self.variantchanged (vk, null, false);
			self.flip = pgninfo.meblack ();
			self.basicboard.setflip (self.flip);
			localStorage.setItem ('mainboardflip', self.flip);
			self.positioninfos = historyobj ['positioninfos'];
			self.buildgame ();
			self.tabpane.selectbykey ('analysis');
		}
		var kind = null;
		if (__in__ ('kind', response)) {
			var kind = response ['kind'];
		}
		if (kind == 'retrievedb') {
			if (__in__ ('path', response)) {
				var path = response ['path'];
				if (path) {
					var parts = path.py_split ('/');
					if (len (parts) > 2) {
						if (parts [0] == 'analysisinfo' && parts [1] == self.basicboard.variantkey) {
							var zobristkeyhex = parts [2];
							if (len (zobristkeyhex) == 16) {
								self.zobristkeyhex2analysisinfo [zobristkeyhex] = 'none';
								if (__in__ ('dataobj', response)) {
									var dobjrd = response ['dataobj'];
									if (dobjrd) {
										self.zobristkeyhex2analysisinfo [zobristkeyhex] = dobjrd;
									}
								}
							}
						}
					}
				}
			}
		}
		if (kind == 'engineout') {
			var sline = response ['sline'];
			var li = LogItem (dict ({'text': sline, 'kind': 'success', 'prompt': 'out > '}));
			li.container.pad (3).mar (3).bc ('#eee');
			self.engineoutlog.log (li);
		}
		else if (kind == 'enginein') {
			var sline = response ['sline'];
			var li = LogItem (dict ({'text': sline, 'kind': 'info', 'prompt': 'command > '}));
			li.container.pad (3).mar (3).bc ('#ffe');
			self.engineoutlog.log (li);
		}
		else if (kind == 'analysisinfo') {
			var analysisinfo = response ['analysisinfo'];
			self.processanalysisinfo (analysisinfo);
		}
		else if (kind == 'setbook') {
			self.setbook (response);
		}
		else if (kind == 'setmainboardfen') {
			var fen = response ['fen'];
			var pgn = response ['pgn'];
			var positioninfo = response ['positioninfo'];
			self.setfromfen (fen, positioninfo);
			if (pgn) {
				self.pgntext.setpgn (pgn);
			}
		}
		else if (kind == 'addmovetobookok') {
			var moveuci = response ['moveuci'];
			var movesan = response ['movesan'];
			var numpositions = response ['numpositions'];
			var nummoves = response ['nummoves'];
			window.alert ('Move {} [ {} ] was added to the book ! Book contains {} position(s) and {} move(s).'.format (movesan, moveuci, numpositions, nummoves));
			self.getbookpage ();
		}
		else if (kind == 'setstoredauto') {
			var posdict = response ['posdict'];
			self.posdict = posdict;
			if (!(posdict)) {
				return ;
			}
			self.autoinfo = [];
			for (var move in posdict ['moves']) {
				var movedict = posdict ['moves'] [move];
				var algeb = movedict ['algeb'];
				var score = movedict ['score'];
				var evaluation = movedict ['eval'];
				var haspv = movedict ['haspv'];
				var depth = movedict ['depth'];
				try {
					for (var moveinfo of self.positioninfo ['movelist']) {
						if (moveinfo ['uci'] == algeb) {
							var san = moveinfo ['san'];
							self.autoinfo.append (dict ({'algeb': algeb, 'san': san, 'score': score, 'evaluation': evaluation, 'haspv': haspv, 'depth': depth}));
						}
					}
				}
				catch (__except0__) {
					// pass;
				}
			}
			self.buildauto ();
		}
	});},
	get siores () {return __get__ (this, function (self, response) {
		if (IS_PROD ()) {
			try {
				self.sioresfunc (response);
			}
			catch (__except0__) {
				print ('error processing siores', response);
			}
		}
		else {
			self.sioresfunc (response);
		}
	});},
	get addmovecallback () {return __get__ (this, function (self) {
		self.addmovemode = !(self.addmovemode);
		self.movelistdiv.arc (self.addmovemode, 'movelistaddmovemode');
	});},
	get setbookpath () {return __get__ (this, function (self, path, drive) {
		if (typeof drive == 'undefined' || (drive != null && drive.hasOwnProperty ("__kwargtrans__"))) {;
			var drive = false;
		};
		self.bookpath = path;
		self.bookdrive = drive;
		self.bookpathdiv.html (self.bookpath);
		self.bookpathdiv.c (cpick (self.bookdrive, '#070', '#700'));
		self.addmovehook.x ();
		if (self.bookdrive) {
			self.addmovehook.a (Button ('Add move', self.addmovecallback));
		}
	});},
	get storeposinfo () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'storeposinfo', 'path': 'board/{}/posinfo'.format (getconn ().getuid ()), 'owner': self.id, 'dataobj': dict ({'variantkey': self.basicboard.variantkey, 'fen': self.basicboard.fen})}));
	});},
	get variantchanged () {return __get__ (this, function (self, variantkey, fen, docallback) {
		if (typeof docallback == 'undefined' || (docallback != null && docallback.hasOwnProperty ("__kwargtrans__"))) {;
			var docallback = true;
		};
		self.basicboard.variantkey = variantkey;
		self.basicboard.reset ();
		if (fen) {
			self.basicboard.setfromfen (fen);
		}
		try {
			self.basicboard.resize (self.resizewidth, self.resizeheight);
		}
		catch (__except0__) {
			// pass;
		}
		try {
			self.resizetabpanewidth (self.resizewidth);
		}
		catch (__except0__) {
			// pass;
		}
		if (!(self.variantchangedcallback === null) && docallback) {
			self.variantchangedcallback (self.basicboard.variantkey, self.basicboard.fen);
		}
		self.basicresize ();
		self.setvariantcombo ();
		self.setbookpath (('books/' + self.basicboard.variantkey) + '.bin');
		self.setfromfen (self.basicboard.fen);
		self.buildauto ();
	});},
	get setvariantcallback () {return __get__ (this, function (self) {
		self.variantchanged (self.basicboard.variantkey, null);
	});},
	get addmovetobook () {return __get__ (this, function (self, move) {
		var moveuci = move ['uci'];
		var movesan = move ['san'];
		var weight = 1;
		var weightinput = window.prompt ('Enter weight for move {} [ {} ] :'.format (movesan, moveuci), '1');
		if (weightinput) {
			if (!(weightinput == '')) {
				try {
					var weight = int (weightinput);
				}
				catch (__except0__) {
					// pass;
				}
			}
		}
		getconn ().sioreq (dict ({'kind': 'addmovetobook', 'variantkey': self.basicboard.variantkey, 'fen': self.basicboard.fen, 'moveuci': moveuci, 'movesan': movesan, 'weight': weight, 'owner': self.id, 'path': self.bookpath, 'drive': self.bookdrive}));
	});},
	get moveclickedfactory () {return __get__ (this, function (self, move) {
		var moveclicked = function () {
			if (self.addmovemode) {
				self.addmovecallback ();
				self.addmovetobook (move);
			}
			else if (!(self.moveclickedcallback === null)) {
				self.moveclickedcallback (self.basicboard.variantkey, self.basicboard.fen, move ['uci']);
			}
		};
		return moveclicked;
	});},
	get buildpositioninfo () {return __get__ (this, function (self) {
		self.movelistdiv.x ().h (self.totalheight ());
		try {
			for (var move of self.movelist) {
				var movediv = Div ().ac ('bigboardshowmove').html (move ['san']);
				movediv.ae ('mousedown', self.moveclickedfactory (move));
				self.movelistdiv.a (movediv);
			}
		}
		catch (__except0__) {
			// pass;
		}
	});},
	get makenullmove () {return __get__ (this, function (self, fen) {
		getconn ().sioreq (dict ({'kind': 'mainboardmove', 'variantkey': self.basicboard.variantkey, 'fen': fen, 'moveuci': 'null', 'owner': self.id}));
	});},
	get delcallback () {return __get__ (this, function (self, event, rep) {
		if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
			var event = null;
		};
		if (typeof rep == 'undefined' || (rep != null && rep.hasOwnProperty ("__kwargtrans__"))) {;
			var rep = 1;
		};
		if (len (self.history) < rep) {
			return ;
		}
		for (var _ = 0; _ < rep; _++) {
			self.delitem = self.history.py_pop ();
		}
		self.makenullmove (self.delitem ['fen']);
	});},
	get refreshcallback () {return __get__ (this, function (self) {
		self.setfromfen (self.basicboard.fen, self.basicboard.positioninfo, false);
	});},
	get clearcallback () {return __get__ (this, function (self) {
		var item = null;
		while (len (self.history) > 0) {
			var item = self.history.py_pop ();
		}
		return item;
	});},
	get clearall () {return __get__ (this, function (self) {
		var fen = self.basicboard.fen;
		var item = self.clearcallback ();
		if (item) {
			self.variantchanged (self.basicboard.variantkey, fen);
		}
	});},
	get delallcallback () {return __get__ (this, function (self) {
		var item = self.clearcallback ();
		if (item) {
			self.makenullmove (item ['fen']);
		}
	});},
	get totalheight () {return __get__ (this, function (self) {
		return self.basicboard.totalheight () + self.controlpanelheight;
	});},
	get controlwidth () {return __get__ (this, function (self) {
		return max (self.basicboard.outerwidth, self.controlpanelwidth);
	});},
	get totalwidth () {return __get__ (this, function (self) {
		return (self.controlwidth () + self.movelistdivwidth) + self.enginebardivwidth;
	});},
	get basicresize () {return __get__ (this, function (self) {
		self.controlpanel.w (self.controlwidth ()).mw (self.controlwidth ());
		self.sectioncontainer.w (self.controlwidth ());
		self.tabpane.resize (null, self.totalheight ());
	});},
	get resizetabpanewidth () {return __get__ (this, function (self, width) {
		self.tabpane.resize (max (width - self.totalwidth (), 600), null);
	});},
	get resizetask () {return __get__ (this, function (self) {
		self.resizewidth = self.resizeorigwidth;
		self.resizeheight = self.resizeorigheight - self.controlpanelheight;
		self.basicboard.resize (self.resizewidth, self.resizeheight);
		self.basicresize ();
		self.buildpositioninfo ();
		self.resizetabpanewidth (self.resizeorigwidth);
		self.setenginebar ();
	});},
	get resize () {return __get__ (this, function (self, width, height) {
		self.resizeorigwidth = width;
		self.resizeorigheight = height;
		self.resizetask ();
	});},
	get analyzecallbackfactory () {return __get__ (this, function (self, all, depthlimit, timelimit) {
		if (typeof all == 'undefined' || (all != null && all.hasOwnProperty ("__kwargtrans__"))) {;
			var all = false;
		};
		if (typeof depthlimit == 'undefined' || (depthlimit != null && depthlimit.hasOwnProperty ("__kwargtrans__"))) {;
			var depthlimit = null;
		};
		if (typeof timelimit == 'undefined' || (timelimit != null && timelimit.hasOwnProperty ("__kwargtrans__"))) {;
			var timelimit = null;
		};
		var analyzecallback = function () {
			self.anyinfo = false;
			self.depthlimit = depthlimit;
			self.timelimit = timelimit;
			self.analysisstartedat = new Date ().getTime ();
			self.bestmoveuci = null;
			self.analyzing.set (true);
			if (!(self.enginecommandcallback === null)) {
				var mpv = cpick (all, 200, self.getmultipv ());
				self.enginecommandcallback (dict ({'kind': 'analyze', 'variantkey': self.basicboard.variantkey, 'multipv': mpv, 'fen': self.basicboard.fen, 'owner': self.id}));
			}
		};
		return analyzecallback;
	});},
	get stopanalyzecallback () {return __get__ (this, function (self) {
		self.analyzing.set (false);
		self.basicboard.clearcanvases ();
		if (!(self.enginecommandcallback === null)) {
			self.enginecommandcallback (dict ({'kind': 'stopanalyze', 'owner': self.id}));
		}
	});},
	get analysismoveclicked () {return __get__ (this, function (self, moveuci, dostore) {
		if (typeof dostore == 'undefined' || (dostore != null && dostore.hasOwnProperty ("__kwargtrans__"))) {;
			var dostore = false;
		};
		if (!(self.moveclickedcallback === null)) {
			if (dostore) {
				self.storeanalysiscallback ();
			}
			self.moveclickedcallback (self.basicboard.variantkey, self.basicboard.fen, moveuci);
		}
	});},
	get setenginebar () {return __get__ (this, function (self, score) {
		if (typeof score == 'undefined' || (score != null && score.hasOwnProperty ("__kwargtrans__"))) {;
			var score = null;
		};
		if (score === null) {
			var score = self.latestscore;
		}
		self.latestscore = score;
		if (self.flip) {
			var score = -(score);
		}
		if (__in__ (' b', self.basicboard.fen)) {
			var score = -(score);
		}
		self.enginebardiv.x ();
		if (score < -(self.enginebarrange)) {
			var score = -(self.enginebarrange);
		}
		if (score > self.enginebarrange) {
			var score = self.enginebarrange;
		}
		var barheight = ((score + self.enginebarrange) / (2 * self.enginebarrange)) * self.totalheight ();
		self.bardiv = Div ().pa ().w (self.enginebardivwidth).h (barheight).t (self.totalheight () - barheight).l (0);
		self.bardiv.bc (scorecolor (score));
		self.enginebardiv.a (self.bardiv);
		var ticks = (2 * self.enginebarrange) / 100;
		for (var i = 1; i < ticks; i++) {
			var top = (i * self.totalheight ()) / ticks - 1;
			var col = '#0f0';
			if (i == ticks / 2) {
				var col = '#fff';
			}
			else if (i > ticks / 2) {
				var col = '#f00';
			}
			self.enginebardiv.a (Div ().pa ().t (top).l (0).w (self.enginebardivwidth).h (3).bc (col));
		}
	});},
	get getgamesan () {return __get__ (this, function (self) {
		try {
			var pinfoitem = self.positioninfos [self.gamei];
			var pinfoitemnext = self.positioninfos [self.gamei + 1];
			var fen = pinfoitem ['fen'];
			var pinfo = pinfoitemnext ['positioninfo'];
			if (!(fen == self.basicboard.fen)) {
				return null;
			}
			var san = pinfo ['genmove'] ['san'];
			return san;
		}
		catch (__except0__) {
			return null;
		}
	});},
	get buildanalysisinfodiv () {return __get__ (this, function (self) {
		self.analysisinfodiv.x ();
		self.basicboard.clearcanvases ();
		self.maxdepth = 0;
		var minfos = [];
		for (var infoi of self.analysisinfo ['pvitems']) {
			try {
				var minfo = MultipvInfo (infoi, self.analysispvlength);
				minfo.bestmovesanclickedcallback = self.analysismoveclicked;
				minfo.bonussliderchangedcallback = self.buildanalysisinfodiv;
				if (minfo.depth > self.maxdepth) {
					self.maxdepth = minfo.depth;
				}
				minfos.append (minfo);
			}
			catch (__except0__) {
				// pass;
			}
		}
		var gamesan = self.getgamesan ();
		var i = 1;
		for (var minfo of sorted (minfos, __kwargtrans__ ({key: (function __lambda__ (item) {
			return item.effscore ();
		}), reverse: true}))) {
			minfo.i = i;
			minfo.build (gamesan);
			if (i == 1) {
				self.bestmoveuci = minfo.bestmoveuci;
				self.setenginebar (minfo.effscore ());
			}
			var iw = 1 / (5 * i);
			if (self.trainmode == 'off') {
				self.basicboard.drawuciarrow (minfo.bestmoveuci, dict ({'strokecolor': scorecolor (minfo.effscore ()), 'linewidth': iw, 'headheight': iw}));
				self.basicboard.highlightucimove (minfo.bestmoveuci, minfo.trainbc, minfo.trainop);
			}
			self.analysisinfodiv.a (minfo);
			i++;
		}
	});},
	get processanalysisinfo () {return __get__ (this, function (self, obj, force) {
		if (typeof force == 'undefined' || (force != null && force.hasOwnProperty ("__kwargtrans__"))) {;
			var force = false;
		};
		if (!(self.analyzing.py_get ()) && !(force)) {
			return ;
		}
		self.anyinfo = true;
		var elapsed = new Date ().getTime () - self.analysisstartedat;
		self.analysisinfo = obj;
		self.analysiszobristkeyhex = self.analysisinfo ['zobristkeyhex'];
		try {
			self.zobristkeyhex2analysisinfo [self.analysiszobristkeyhex] = dict ({'analysisinfo': self.analysisinfo});
		}
		catch (__except0__) {
			print ('there was a problem caching analysis info');
			// pass;
		}
		if (!(self.trainweightshash)) {
			self.trainweightshash = dict ({});
		}
		try {
			for (var pvitem of self.analysisinfo ['pvitems']) {
				var algeb = pvitem ['bestmoveuci'];
				var metrainweight = pvitem ['metrainweight'];
				var opptrainweight = pvitem ['opptrainweight'];
				if (self.trainweightshash [self.analysiszobristkeyhex]) {
					var hashedweights = self.trainweightshash [self.analysiszobristkeyhex];
					if (hashedweights [algeb]) {
						var trainweights = hashedweights [algeb];
						if (!(metrainweight)) {
							pvitem ['metrainweight'] = trainweights ['metrainweight'];
						}
						if (!(opptrainweight)) {
							pvitem ['opptrainweight'] = trainweights ['opptrainweight'];
						}
					}
				}
			}
		}
		catch (__except0__) {
			print ('there was a problem with getting hashed train weights');
		}
		try {
			if (self.trainweightshash [self.analysiszobristkeyhex]) {
				var hashedweights = self.trainweightshash [self.analysiszobristkeyhex];
			}
			else {
				var hashedweights = dict ({});
				self.trainweightshash [self.analysiszobristkeyhex] = hashedweights;
			}
			for (var pvitem of self.analysisinfo ['pvitems']) {
				var algeb = pvitem ['bestmoveuci'];
				var metrainweight = pvitem ['metrainweight'];
				var opptrainweight = pvitem ['opptrainweight'];
				hashedweights [algeb] = dict ({'metrainweight': metrainweight, 'opptrainweight': opptrainweight});
			}
		}
		catch (__except0__) {
			print ('there was a problem with hashing train weights');
		}
		self.buildanalysisinfodiv ();
		if (self.analyzing.py_get () && !(self.depthlimit === null) || !(self.timelimit === null)) {
			var depthok = self.depthlimit === null || self.maxdepth >= self.depthlimit;
			var timeok = self.timelimit === null || elapsed >= self.timelimit;
			if (depthok && timeok) {
				self.stopandstoreanalysis ();
			}
		}
	});},
	get stopandstoreanalysis () {return __get__ (this, function (self) {
		self.stopanalyzecallback ();
		if (!(self.anyinfo)) {
			return ;
		}
		self.storeanalysiscallback ();
	});},
	get makeanalyzedmovecallback () {return __get__ (this, function (self) {
		if (!(self.bestmoveuci === null)) {
			if (!(self.moveclickedcallback === null)) {
				self.moveclickedcallback (self.basicboard.variantkey, self.basicboard.fen, self.bestmoveuci);
			}
		}
	});},
	get storeanalysiscallback () {return __get__ (this, function (self) {
		if (!(self.analysisinfo === null)) {
			try {
				var zobristkeyhex = self.analysisinfo ['zobristkeyhex'];
				for (var pvitem of self.analysisinfo ['pvitems']) {
					var metrainweight = null;
					if (__in__ ('metrainweight', pvitem)) {
						var metrainweight = pvitem ['metrainweight'];
					}
					var opptrainweight = null;
					if (__in__ ('opptrainweight', pvitem)) {
						var opptrainweight = pvitem ['opptrainweight'];
					}
					if (!(self.trainweightshash [zobristkeyhex])) {
						self.trainweightshash [zobristkeyhex] = dict ({});
					}
					if (!(self.trainweightshash [zobristkeyhex] [algeb])) {
						self.trainweightshash [zobristkeyhex] [algeb] = dict ({});
					}
					var algeb = pvitem ['bestmoveuci'];
					if (metrainweight) {
						self.trainweightshash [zobristkeyhex] [algeb] ['metrainweight'] = metrainweight;
					}
					if (opptrainweight) {
						self.trainweightshash [zobristkeyhex] [algeb] ['opptrainweight'] = opptrainweight;
					}
				}
			}
			catch (__except0__) {
				print ('there was a problem caching analysis info');
				// pass;
			}
			getconn ().sioreq (dict ({'kind': 'storedb', 'path': 'analysisinfo/{}/{}'.format (self.basicboard.variantkey, self.analysisinfo ['zobristkeyhex']), 'owner': self.id, 'dataobj': dict ({'analysisinfo': self.analysisinfo})}));
		}
		else {
			window.alert ('No analysis to store.');
		}
	});},
	get getmultipv () {return __get__ (this, function (self) {
		try {
			var multipv = int (self.multipvcombo.v ());
			return multipv;
		}
		catch (__except0__) {
			return self.defaultmultipv;
		}
	});},
	get analyzingchangedcallback () {return __get__ (this, function (self) {
		self.analysiscontrolpanelbottom.bc (cpick (self.analyzing.py_get (), '#afa', '#edd'));
	});},
	get getconfigscalar () {return __get__ (this, function (self, path, py_default) {
		if (self.configschema === null) {
			return py_default;
		}
		var found = getscalarfromschema (self.configschema, path);
		if (found === null) {
			return py_default;
		}
		return found;
	});},
	get getconfigbool () {return __get__ (this, function (self, path, py_default) {
		var s = self.getconfigscalar (path, null);
		if (s === null) {
			return py_default;
		}
		if (s == 'true') {
			return true;
		}
		if (s == 'false') {
			return false;
		}
		return py_default;
	});},
	get getconfigint () {return __get__ (this, function (self, path, py_default) {
		var s = self.getconfigscalar (path, null);
		if (s === null) {
			return py_default;
		}
		try {
			var i = int (s);
			return i;
		}
		catch (__except0__) {
			return py_default;
		}
	});},
	get tobookmark () {return __get__ (this, function (self) {
		self.pgnlist.tobookmark ();
	});},
	get gamesloadedok () {return __get__ (this, function (self, content) {
		self.pgnlist = PgnList (self).setcontent (content);
		self.gamesdiv.x ();
		self.gamesdiv.a (Button ('Reload', self.loadgames));
		self.gamesdiv.a (Button ('To bookmark', self.tobookmark).ml (5));
		self.gamesdiv.a (self.gamesloadingdiv.x ());
		self.gamesdiv.a (self.pgnlist);
	});},
	get gameloaderr () {return __get__ (this, function (self, err) {
		print ('game load error', err);
	});},
	get loadgames () {return __get__ (this, function (self) {
		self.gamesloadingdiv.html ('Games loading...');
		if (!(self.username === null) && self.dogames) {
			lichapiget ('{}/{}?max={}{}'.format (LICH_API_GAMES_EXPORT, self.username, self.maxgames, self.gamesfilter), self.usertoken, self.gamesloadedok, self.gameloaderr, self.gamesshowlinkdiv);
		}
	});},
	get setusername () {return __get__ (this, function (self, username, usertoken) {
		if (typeof usertoken == 'undefined' || (usertoken != null && usertoken.hasOwnProperty ("__kwargtrans__"))) {;
			var usertoken = null;
		};
		self.username = username;
		self.usertoken = usertoken;
		self.loadgames ();
		return self;
	});},
	get setconfigschema () {return __get__ (this, function (self, configschema) {
		self.configschema = configschema;
		self.showfen = self.getconfigbool ('global/showfen', true);
		self.basicboard.showfen = self.showfen;
		self.resizetask ();
	});},
	get storeforward () {return __get__ (this, function (self) {
		self.storeanalysiscallback ();
		self.gameforward ();
	});},
	get storemake () {return __get__ (this, function (self) {
		self.storeanalysiscallback ();
		self.makeanalyzedmovecallback ();
	});},
	get defaultmoveclickedcallback () {return __get__ (this, function (self, variantkey, fen, moveuci, handletrain) {
		if (typeof handletrain == 'undefined' || (handletrain != null && handletrain.hasOwnProperty ("__kwargtrans__"))) {;
			var handletrain = true;
		};
		if (handletrain && !(self.trainfreecheckbox.getchecked ())) {
			if (self.trainmode == 'white' && self.basicboard.turn () == BLACK || self.trainmode == 'black' && self.basicboard.turn () == WHITE) {
				self.examinealgeb = moveuci;
				self.trainhandler ();
				return ;
			}
		}
		getconn ().sioreq (dict ({'kind': 'mainboardmove', 'variantkey': variantkey, 'fen': fen, 'moveuci': moveuci, 'owner': self.id}));
	});},
	get setvariantandfen () {return __get__ (this, function (self, variantkey, fen) {
		getconn ().sioreq (dict ({'kind': 'mainboardsetvariant', 'variantkey': variantkey, 'fen': fen, 'owner': self.id}));
	});},
	get defaultvariantchangedcallback () {return __get__ (this, function (self, variantkey, fen) {
		self.setvariantandfen (variantkey, fen);
	});},
	get defaultenginecommandcallback () {return __get__ (this, function (self, enginecommandobj) {
		enginecommandobj ['owner'] = self.id;
		getconn ().sioreq (enginecommandobj);
	});},
	get createnewengine () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'createnewengine', 'owner': self.id}));
	});},
	get killengine () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'killengine', 'owner': self.id}));
	});},
	get addgamecontrolbuttons () {return __get__ (this, function (self, panel) {
		panel.a (Button ('#', self.gamehere).ac ('analysiscontrol'));
		panel.a (Button ('<<', self.gametobegin).ac ('analysiscontrol'));
		panel.a (Button ('<', self.gameback).ac ('analysiscontrol').w (60));
		panel.a (Button ('>', self.gameforward).ac ('analysiscontrol').w (60));
		panel.a (Button ('>>', self.gametoend).ac ('analysiscontrol'));
	});},
	get doautoanalyis () {return __get__ (this, function (self) {
		if (self.autoanalysis) {
			self.storeforward ();
			setTimeout (self.doautoanalyis, self.autoanalysisdelay);
		}
	});},
	get autoanalysisclicked () {return __get__ (this, function (self) {
		self.autoanalysis = !(self.autoanalysis);
		self.autoanalysisbutton.bc (cpick (self.autoanalysis, '#afa', '#ccc'));
		if (self.autoanalysis) {
			self.analyzecallbackfactory () ();
			setTimeout (self.doautoanalyis, self.autoanalysisdelay);
		}
		else {
			self.stopanalyzecallback ();
		}
	});},
	get multipvchanged () {return __get__ (this, function (self, value) {
		localStorage.setItem ('mainboardmultipv', value);
	});},
	get lichessanalysisclicked () {return __get__ (this, function (self) {
		window.open ((('https://lichess.org/analysis/' + self.basicboard.variantkey) + '/') + self.basicboard.fen, '_blank');
	});},
	get lichessgameclicked () {return __get__ (this, function (self) {
		if (self.loadedgameid) {
			var url = (((('https://lichess.org/' + self.loadedgameid) + '/') + self.loadedgameside) + '#') + str (self.gamei);
			window.open (url, '_blank');
		}
	});},
	get fentextchangedcallback () {return __get__ (this, function (self, fen) {
		self.variantchanged (self.basicboard.variantkey, fen);
	});},
	get gametabselected () {return __get__ (this, function (self) {
		self.showcurrentgamepos ();
	});},
	get showtraininfomsg () {return __get__ (this, function (self, msg, kind) {
		if (typeof kind == 'undefined' || (kind != null && kind.hasOwnProperty ("__kwargtrans__"))) {;
			var kind = null;
		};
		self.traininfodiv.x ().a (Div ().ff ('monospace').html (msg));
		self.traininfodiv.c ('#007');
		if (kind == 'err') {
			self.traininfodiv.c ('#700');
		}
		if (kind == 'succ') {
			self.traininfodiv.c ('#070');
		}
	});},
	get favlineclickedfactory () {return __get__ (this, function (self, favline) {
		var favlineclicked = function () {
			var fen = favline ['fen'];
			self.fentextchangedcallback (fen);
		};
		return favlineclicked;
	});},
	get getfavlines () {return __get__ (this, function (self) {
		return JSON.parse (localStorage.getItem (self.id + '/favlines'));
	});},
	get storefavlines () {return __get__ (this, function (self, favlines) {
		localStorage.setItem (self.id + '/favlines', JSON.stringify (favlines));
	});},
	get removefavlinefactory () {return __get__ (this, function (self, favline, edit) {
		if (typeof edit == 'undefined' || (edit != null && edit.hasOwnProperty ("__kwargtrans__"))) {;
			var edit = false;
		};
		var removefavline = function () {
			var favlines = self.getfavlines ();
			var newfavlines = [];
			for (var fl of favlines) {
				if (!(fl ['line'] == favline ['line'])) {
					newfavlines.append (fl);
				}
				else if (edit) {
					fl ['fen'] = self.basicboard.fen;
					newfavlines.append (fl);
				}
			}
			self.storefavlines (newfavlines);
		};
		return removefavline;
	});},
	get trainhandler () {return __get__ (this, function (self) {
		try {
			self.traintimediv.html (new Date ().toLocaleString ());
			self.trainlinediv.html (self.getcurrentline ());
			self.favlinesdiv.x ();
			var favlines = self.getfavlines ();
			for (var favline of favlines) {
				var favlinediv = Div ().disp ('flex').pad (1).mar (1).cp ();
				var line = favline ['line'];
				favlinediv.a ([Button ('*', self.removefavlinefactory (favline, true)).w (28).h (14).fs (7).bc ('#afa'), Button ('-', self.removefavlinefactory (favline)).w (14).h (14).fs (7).bc ('#faa').ml (2), Div ().ml (3).html (line).ae ('mousedown', self.favlineclickedfactory (favline))]);
				self.favlinesdiv.a (favlinediv);
			}
			self.trainmode = self.traincombo.v ();
			if (self.trainmode == 'off') {
				self.trainfen = null;
			}
			else {
				var trainside = WHITE;
				if (self.trainmode == 'black') {
					var trainside = BLACK;
				}
				var turn = self.basicboard.turn ();
				if (turn == trainside) {
					if (self.trainfen == self.basicboard.fen) {
						// pass;
					}
					else {
						var analysisinfo = self.getcachedanalysisinfobyfen (self.basicboard.fen);
						if (analysisinfo == 'none' || self.analyzing.py_get ()) {
							self.showtraininfomsg ('No analysis available to make move.', 'err');
							if (!(self.analyzing.py_get ())) {
								self.analyzecallbackfactory () ();
							}
							else {
								var elapsedms = new Date ().getTime () - self.analysisstartedat;
								var elapsed = int (elapsedms / 1000);
								self.showtraininfomsg ('Analyzing, elapsed: {} sec(s).'.format (elapsed));
								if (elapsed > 20) {
									self.showtraininfomsg ('Analysis done.', 'succ');
									self.stopandstoreanalysis ();
								}
							}
						}
						else if (analysisinfo && !(self.analyzing.py_get ())) {
							var ignorepreset = '';
							var foundmoves = [];
							var pvitems = analysisinfo ['pvitems'];
							for (var item of pvitems) {
								try {
									var opptrainweight = int (item ['opptrainweight']);
								}
								catch (__except0__) {
									var opptrainweight = 0;
								}
								if (opptrainweight > 0) {
									foundmoves.append ([item ['bestmoveuci'], opptrainweight]);
								}
							}
							if (int (Math.random () * 100) > 50) {
								var foundmoves = [];
								var ignorepreset = 'Ignore preset. ';
							}
							if (len (foundmoves) > 0) {
								var algebs = [];
								for (var moveitem of foundmoves) {
									for (var i = 0; i < moveitem [1]; i++) {
										algebs.append (moveitem [0]);
									}
								}
								var index = int (Math.random () * len (algebs));
								if (index >= len (algebs)) {
									var index = len (algebs) - 1;
								}
								var selectedalgeb = algebs [index];
								self.trainfen = self.basicboard.fen;
								self.showtraininfomsg ('Making training move : {} .'.format (selectedalgeb), 'succ');
								self.moveclickedcallback (self.basicboard.variantkey, self.basicboard.fen, selectedalgeb, false);
							}
							else if (len (pvitems) > 0) {
								var selsize = int (Math.random () * len (pvitems)) + 1;
								if (selsize > len (pvitems)) {
									var selsize = len (pvitems);
								}
								if (int (Math.random () * 100) > 20) {
									var selsize = 1;
								}
								var index = int (Math.random () * selsize);
								if (index >= len (pvitems)) {
									var index = len (pvitems) - 1;
								}
								var selectedalgeb = pvitems [index] ['bestmoveuci'];
								self.trainfen = self.basicboard.fen;
								self.moveclickedcallback (self.basicboard.variantkey, self.basicboard.fen, selectedalgeb, false);
								self.showtraininfomsg ('{}Making random engine move [ {} from {} : {} ].'.format (ignorepreset, index + 1, selsize, selectedalgeb));
							}
							else {
								self.trainfen = self.basicboard.fen;
								self.showtraininfomsg ('No legal moves.', 'err');
							}
						}
					}
				}
				else if (self.examinealgeb) {
					var examinealgeb = self.examinealgeb;
					var analysisinfo = self.getcachedanalysisinfobyfen (self.basicboard.fen);
					if (analysisinfo == 'none') {
						self.showtraininfomsg ('No analysis available to check move.', 'err');
						self.examinealgeb = null;
						self.moveclickedcallback (self.basicboard.variantkey, self.basicboard.fen, examinealgeb, false);
					}
					else if (analysisinfo) {
						self.examinealgeb = null;
						var moveok = false;
						var trainweight = 0;
						for (var item of analysisinfo ['pvitems']) {
							if (item ['bestmoveuci'] == examinealgeb) {
								try {
									var trainweight = int (item ['metrainweight']);
								}
								catch (__except0__) {
									var trainweight = 0;
								}
								if (trainweight > 0) {
									var moveok = true;
									break;
								}
							}
						}
						if (moveok) {
							self.showtraininfomsg ('Move ok. Weight : {}.'.format (trainweight), 'succ');
							self.moveclickedcallback (self.basicboard.variantkey, self.basicboard.fen, examinealgeb, false);
						}
						else {
							self.showtraininfomsg ('Wrong move.', 'err');
							self.basicboard.setfromfen (self.basicboard.fen);
						}
					}
				}
			}
		}
		catch (__except0__) {
			// pass;
		}
	});},
	get traincombochanged () {return __get__ (this, function (self) {
		self.basicboard.setfromfen (self.basicboard.fen);
		self.trainmode = self.traincombo.v ();
		if (self.trainmode == 'white') {
			if (!(self.basicboard.flip)) {
				self.flipcallback ();
			}
		}
		if (self.trainmode == 'black') {
			if (self.basicboard.flip) {
				self.flipcallback ();
			}
		}
	});},
	get addtrainline () {return __get__ (this, function (self) {
		var favlines = self.getfavlines ();
		var line = window.prompt ('Enter name:', self.getcurrentline ());
		favlines.append (dict ({'line': line, 'fen': self.basicboard.fen}));
		self.storefavlines (favlines);
	});},
	get takeback () {return __get__ (this, function (self) {
		self.delcallback (null, 2);
	});},
	get copylink () {return __get__ (this, function (self) {
		var url = (((((document.location.protocol + '//') + document.location.host) + '/analysis/') + self.basicboard.variantkey) + '/') + self.basicboard.fen;
		var url = url.py_replace (' ', '%20');
		self.basicboard.fentext.setText (url);
		self.basicboard.fentext.e.select ();
		document.execCommand ('copy');
	});},
	get parsepgn () {return __get__ (this, function (self, pgn) {
		getconn ().sioreq (dict ({'kind': 'parsepgn', 'owner': self.id, 'data': pgn}));
	});},
	get gameloaded () {return __get__ (this, function (self, content) {
		self.parsepgn (content);
	});},
	get getgamebyid () {return __get__ (this, function (self, id) {
		lichapiget ('game/export/{}'.format (id), null, self.gameloaded, (function __lambda__ (err) {
			return print (err);
		}), null);
	});},
	get gamesinputpastecallback () {return __get__ (this, function (self, text) {
		var re = new RegExp ('^https://lichess.org/([0-9a-zA-Z]+)');
		var m = text.match (re);
		if (m) {
			var id = m [1];
			self.getgamebyid (id);
			var id = id.__getslice__ (0, -(4), 1);
			self.getgamebyid (id);
		}
		else {
			self.parsepgn (text);
		}
	});},
	get screenshot () {return __get__ (this, function (self) {
		self.chartdiv.x ();
		html2canvas (self.analysisinfodiv.e).then ((function __lambda__ (canvas) {
			return self.chartdiv.e.appendChild (canvas);
		}), (function __lambda__ (err) {
			return print (err);
		}));
	});},
	get copypgn () {return __get__ (this, function (self) {
		self.tabpane.selectbykey ('pgn');
		self.pgntext.textarea.e.select ();
		document.execCommand ('copy');
	});},
	get copyfen () {return __get__ (this, function (self) {
		self.basicboard.fentext.e.select ();
		document.execCommand ('copy');
	});},
	get autopastefen () {return __get__ (this, function (self) {
		navigator.clipboard.readText ().then ((function __lambda__ (clipText) {
			return self.fentextchangedcallback (clipText);
		}), (function __lambda__ (err) {
			return print (err);
		}));
	});},
	get __init__ () {return __get__ (this, function (self, args) {
		__super__ (Board, '__init__') (self, 'div');
		self.gamei = 0;
		self.fen2zobristkeyhex = dict ({});
		self.zobristkeyhex2analysisinfo = dict ({});
		self.addmovemode = false;
		self.bookpath = null;
		self.resizeorigwidth = 800;
		self.resizeorigheight = 400;
		self.showfen = true;
		self.flip = false;
		if (localStorage.getItem ('mainboardflip') == 'true') {
			self.flip = true;
		}
		self.positioninfos = [];
		self.pgnlist = null;
		self.username = null;
		self.usertoken = null;
		self.configschema = null;
		self.depthlimit = null;
		self.analysisinfo = null;
		self.autoinfo = null;
		self.defaultmultipv = 3;
		var storedmultipv = localStorage.getItem ('mainboardmultipv');
		if (storedmultipv) {
			self.defaultmultipv = storedmultipv;
		}
		self.bestmoveuci = null;
		self.analyzing = View (self.analyzingchangedcallback, false);
		self.history = [];
		self.id = args.py_get ('id', 'mainboard');
		self.BARWIDTH = args.py_get ('barwidth', 20);
		self.RATINGHEIGHT = args.py_get ('ratingheight', 2);
		self.RATINGCLUSTER = args.py_get ('ratingcluster', 25);
		self.maxgames = args.py_get ('maxgames', 25);
		self.gamesfilter = args.py_get ('gamesfilter', '');
		self.analysispvlength = args.py_get ('analysispvlength', 4);
		self.setposinfo = args.py_get ('setposinfo', dict ({'variantkey': 'standard', 'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}));
		self.dobook = args.py_get ('dobook', true);
		self.dostoredanalysis = args.py_get ('dostoredanalysis', true);
		self.dostoredauto = args.py_get ('dostoredauto', true);
		self.dogames = args.py_get ('dogames', true);
		self.dogamepreview = args.py_get ('dogamepreview', true);
		self.variantchangedcallback = args.py_get ('variantchangedcallback', self.defaultvariantchangedcallback);
		self.moveclickedcallback = args.py_get ('moveclickedcallback', self.defaultmoveclickedcallback);
		self.enginecommandcallback = args.py_get ('enginecommandcallback', self.defaultenginecommandcallback);
		self.background = '/static/img/backgrounds/' + args.py_get ('background', 'wood.jpg');
		self.autoanalysisdelay = args.py_get ('autoanalysisdelay', 10) * 1000;
		args ['movecallback'] = self.moveclickedcallback;
		args ['fentextchangedcallback'] = self.fentextchangedcallback;
		self.basicboard = BasicBoard (args);
		self.controlpanel = Div ().ac ('boardcontrolpanel');
		self.controlpanelheight = getglobalcssvarpxint ('--boardcontrolpanelheight');
		self.controlpanelwidth = 260;
		self.controlpanel.a (Button ('Flip', self.flipcallback));
		self.variantcombo = ComboBox ();
		self.setvariantcombo ();
		self.controlpanel.a (self.variantcombo).w (self.basicboard.outerwidth).mw (self.basicboard.outerwidth);
		self.controlpanel.a (Button ('Reset', self.setvariantcallback));
		self.controlpanel.a (Button ('Clearall', self.clearall));
		self.controlpanel.a (Button ('Delall', self.delallcallback));
		self.controlpanel.a (Button ('#', self.refreshcallback));
		self.controlpanel.a (Button ('Del', self.delcallback));
		self.sectioncontainer = Div ().ac ('bigboardsectioncontainer').w (self.basicboard.outerwidth);
		self.sectioncontainer.bci (self.background);
		self.sectioncontainer.a ([self.controlpanel, self.basicboard]);
		self.verticalcontainer = Div ().ac ('bigboardverticalcontainer');
		self.movelistdivwidth = 100;
		self.movelistdiv = Div ().ac ('bigboardmovelist').w (self.movelistdivwidth).mw (self.movelistdivwidth);
		self.enginebardivwidth = 15;
		self.enginebarrange = 500;
		self.enginebardiv = Div ().pr ().ac ('bigboardenginebar').w (self.enginebardivwidth).mw (self.enginebardivwidth);
		self.analysisdiv = Div ();
		self.autodiv = Div ();
		self.analysiscontrolpaneltop = Div ().ac ('bigboardanalysiscontrolpanel');
		self.addgamecontrolbuttons (self.analysiscontrolpaneltop);
		self.analysiscontrolpaneltop.a (Button ('Store >', self.storeforward).ac ('analysismake'));
		self.analysiscontrolpaneltop.a (Button ('Store Make', self.storemake).ac ('analysismake'));
		self.analysiscontrolpaneltop.a (Button ('Store Stop', self.stopandstoreanalysis).ac ('analysisstop'));
		self.analysiscontrolpaneltop.a (Button ('CF', self.copyfen));
		self.analysiscontrolpaneltop.a (Button ('PF', self.autopastefen));
		self.analysiscontrolpanelbottom = Div ().ac ('bigboardanalysiscontrolpanel');
		self.analysiscontrolpanelbottom.a (Button ('#', self.getstoredanalysisinfo).ac ('analysisanalyze'));
		self.analysiscontrolpanelbottom.a (Button ('Analyze', self.analyzecallbackfactory ()).ac ('analysisanalyze'));
		self.analysiscontrolpanelbottom.a (Button ('Analyze all', self.analyzecallbackfactory (true)).ac ('analysisanalyze'));
		self.analysiscontrolpanelbottom.a (Button ('Quick all', self.analyzecallbackfactory (true, 5, null)).ac ('analysisanalyze'));
		self.analysiscontrolpanelbottom.a (Button ('Make', self.makeanalyzedmovecallback).ac ('analysismake'));
		self.analysiscontrolpanelbottom.a (Button ('Stop', self.stopanalyzecallback).ac ('analysisstop'));
		self.analysiscontrolpanelbottom.a (Button ('Store', self.storeanalysiscallback).ac ('analysisstore'));
		self.autoanalysis = false;
		self.autoanalysisbutton = Button ('A', self.autoanalysisclicked);
		self.analysiscontrolpanelbottom.a (self.autoanalysisbutton);
		self.copylinkbutton = Button ('H', self.copylink);
		self.analysiscontrolpanelbottom.a (self.copylinkbutton);
		self.screenshotbutton = Button ('S', self.screenshot);
		self.analysiscontrolpanelbottom.a (self.screenshotbutton);
		self.lichessanalysisbutton = Button ('L', self.lichessanalysisclicked);
		self.analysiscontrolpanelbottom.a (self.lichessanalysisbutton);
		self.lichessgamebutton = Button ('G', self.lichessgameclicked);
		self.analysiscontrolpanelbottom.a (self.lichessgamebutton);
		self.copypgnbutton = Button ('C', self.copypgn);
		self.analysiscontrolpanelbottom.a (self.copypgnbutton);
		var mopts = [];
		for (var i = 1; i < 501; i++) {
			mopts.append ([str (i), 'MultiPV {}'.format (i)]);
		}
		self.multipvcombo = ComboBox (dict ({'selectclass': 'boardmultipvcomboselect', 'optionfirstclass': 'boardmultipvcombooptionfirst', 'optionclass': 'boardmultipvcombooption'})).setoptions (mopts, str (self.defaultmultipv), self.multipvchanged);
		self.analysiscontrolpanelbottom.a (self.multipvcombo);
		self.analysisdiv.a ([self.analysiscontrolpaneltop, self.analysiscontrolpanelbottom]);
		self.analysisinfodiv = Div ();
		self.analysisdiv.a (self.analysisinfodiv);
		self.gamescontainerdiv = Div ();
		self.gamesinputdiv = Div ().ms ().pad (3);
		self.gamesinput = CopyText (dict ({'width': 500, 'pastecallback': self.gamesinputpastecallback}));
		self.gamesinputdiv.a (self.gamesinput);
		self.gamesshowlinkdiv = Div ().ms ().pad (3);
		self.gamesloadingdiv = Div ();
		self.gamesdiv = Div ();
		self.gamescontainerdiv.a ([self.gamesinputdiv, self.gamesshowlinkdiv, self.gamesdiv]);
		self.gamediv = Div ();
		self.pgntext = PgnText ();
		self.engineoutpane = SplitPane (dict ({'controlheight': 40}));
		self.engineoutpane.controlpanel.a ([Button ('Analyze', self.analyzecallbackfactory ()), Button ('Stop', self.stopanalyzecallback), Button ('New engine', self.createnewengine), Button ('Kill engine', self.killengine)]);
		self.engineoutlog = Log ();
		self.engineoutpane.setcontentelement (self.engineoutlog);
		self.bookpane = SplitPane (dict ({'controlheight': 40}));
		self.bookpathdiv = Div ('bookpathdiv');
		self.addmovehook = Div ();
		self.bookpane.controlpanel.a ([self.bookpathdiv, self.addmovehook]);
		self.bookdiv = Div ().ms ().fs (20);
		self.bookpane.setcontentelement (self.bookdiv);
		self.chartdiv = Div ();
		if (!(localStorage.getItem (self.id + '/favlines'))) {
			localStorage.setItem (self.id + '/favlines', '[]');
		}
		self.traindiv = Div ().mar (3);
		self.traincombo = ComboBox ().setoptions ([['off', 'Training off'], ['black', 'Train White'], ['white', 'Train Black']], 'off', self.traincombochanged);
		self.traincontrols = Div ().disp ('flex').jc ('space-around').ai ('center').h (40).w (500).bc ('#eee');
		self.traintimediv = Div ().w (200).bc ('#eff').html ('time').ff ('monospace').ta ('center');
		self.trainfreecheckbox = CheckBox ();
		self.traincontrols.a ([self.traincombo, Labeled ('Free', self.trainfreecheckbox), Button ('Take back', self.takeback), Button ('+', self.addtrainline), self.traintimediv]);
		self.traininfodiv = Div ().disp ('flex').jc ('space-around').ai ('center').h (40).w (500).bc ('#eee').mt (2);
		self.trainlinediv = Div ().mt (2).pad (1).ff ('monospace').c ('#00f').bc ('#eee');
		self.favlinesdiv = Div ().mt (2).ff ('monospace');
		self.traindiv.a ([self.traincontrols, self.traininfodiv, self.trainlinediv, self.favlinesdiv]);
		window.setInterval (self.trainhandler, 500);
		self.tabpane = TabPane (dict ({'kind': 'normal', 'id': 'board', 'tabs': [Tab ('analysis', 'Analysis', self.analysisdiv), Tab ('train', 'Train', self.traindiv), Tab ('auto', 'Auto', self.autodiv), Tab ('book', 'Book', self.bookpane), Tab ('game', 'Game', self.gamediv, self.gametabselected), Tab ('pgn', 'Pgn', self.pgntext), Tab ('games', 'Games', self.gamescontainerdiv), Tab ('chart', 'Chart', self.chartdiv), Tab ('engineout', 'Engine out', self.engineoutpane)], 'selected': 'analysis'}));
		self.verticalcontainer.a ([self.sectioncontainer, self.enginebardiv, self.movelistdiv, self.tabpane]);
		self.a (self.verticalcontainer);
		self.basicresize ();
		self.variantchanged (self.setposinfo ['variantkey'], self.setposinfo ['fen']);
	});}
});

//# sourceMappingURL=board.map