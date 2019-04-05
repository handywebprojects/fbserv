// Transcrypt'ed from Python, 2019-04-05 10:12:57
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {queryparams, random, setseed} from './utils.js';
import {getconn} from './connection.js';
import {BasicBoard} from './basicboard.js';
import {Button, Div, TextArea, TextInput, e} from './dom.js';
var __name__ = 'forumgame';
export var mainseed = 80;
export var Forumnode =  __class__ ('Forumnode', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, root, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		__super__ (Forumnode, '__init__') (self, 'div');
		self.root = root;
		self.move = args ['move'];
		self.uci = args ['uci'];
		self.comment = args ['comment'];
		if (!(self.comment)) {
			self.comment = '';
		}
		self.owner = args ['owner'];
		self.fen = args ['fen'];
		self.parent = args ['parent'];
		self.isadmin = args ['isadmin'];
		self.halfmoveno = args ['halfmoveno'];
		if (!(self.halfmoveno)) {
			self.halfmoveno = -(1);
		}
		self.childs = [];
		self.build ();
	});},
	get toobj () {return __get__ (this, function (self) {
		var moveobjs = dict ({});
		for (var child of self.childs) {
			moveobjs [child.move] = child.toobj ();
		}
		return dict ({'uci': self.uci, 'comment': self.comment, 'owner': self.owner, 'fen': self.fen, 'moves': moveobjs});
	});},
	get appendchild () {return __get__ (this, function (self, node) {
		node.halfmoveno = self.halfmoveno + 1;
		node.build ();
		self.childs.append (node);
		self.containerdiv.a (node);
		if (len (self.childs) > 1) {
			var rgb = 'rgb({},{},{})'.format (int (random () * 128 + 127), int (random () * 128 + 127), int (random () * 128 + 127));
			self.containerdiv.bc (rgb).bds ('solid').bdw (10).bdr (20).bdc (rgb);
		}
	});},
	get addnode () {return __get__ (this, function (self) {
		var input = window.prompt ('Move:uci:owner:fen', '');
		if (input) {
			self.root.shift ();
			var parts = input.py_split (':');
			self.appendchild (Forumnode (self.root, dict ({'move': parts [0], 'uci': null, 'comment': '', 'uci': parts [0], 'owner': parts [2], 'fen': parts [2], 'parent': self, 'isadmin': self.isadmin})));
			self.root.parse ();
		}
	});},
	get edituci () {return __get__ (this, function (self) {
		var input = window.prompt ('Uci', '');
		if (input) {
			self.uci = input;
			self.setboard ();
			self.ucidiv.html (self.uci);
			self.root.parse ();
		}
	});},
	get editfen () {return __get__ (this, function (self) {
		var input = window.prompt ('Fen', '');
		if (input) {
			self.fen = input;
			self.setboard ();
			self.root.parse ();
		}
	});},
	get setmovelabel () {return __get__ (this, function (self) {
		if (self.halfmoveno < 0) {
			var moveno = '';
		}
		else if (__mod__ (self.halfmoveno, 2) == 0) {
			var moveno = (self.halfmoveno + 2) / 2 + '. ';
		}
		else {
			var moveno = (self.halfmoveno + 1) / 2 + '.. ';
		}
		self.movelabeldiv.html ('{}{}'.format (moveno, self.move));
	});},
	get editsan () {return __get__ (this, function (self) {
		var input = window.prompt ('San', '');
		if (input) {
			self.move = input;
			self.setmovelabel ();
			self.root.parse ();
		}
	});},
	get editcomment () {return __get__ (this, function (self) {
		var input = window.prompt ('Comment', self.comment);
		if (input) {
			self.comment = input;
			self.commentdiv.html (self.comment);
			self.root.parse ();
		}
	});},
	get editowner () {return __get__ (this, function (self) {
		var input = window.prompt ('Owner', '');
		if (input) {
			self.owner = input;
			self.ownerdiv.html (self.owner);
			self.root.parse ();
		}
	});},
	get movecallback () {return __get__ (this, function (self, variantkey, fen, uci) {
		if (self.reqfenunderway) {
			print ('a fen request is in progress, cannot start a new one');
			return ;
		}
		self.root.shift ();
		self.root.reqfenunderway = true;
		self.root.reqnode = self;
		getconn ().sioreq (dict ({'kind': 'forumgamemove', 'owner': 'forumgame', 'moveuci': uci, 'variantkey': variantkey, 'fen': fen}));
	});},
	get bbdragstart () {return __get__ (this, function (self, ev) {
		ev.stopPropagation ();
	});},
	get setboard () {return __get__ (this, function (self) {
		var initobj = dict ({'fen': self.fen, 'squaresize': 20, 'showfen': false, 'movecallback': self.movecallback, 'variantkey': 'atomic'});
		if (self.uci) {
			initobj ['positioninfo'] = dict ({'genmove': dict ({'uci': self.uci})});
		}
		var b = BasicBoard (initobj);
		b.cp ().ae ('dragstart', self.bbdragstart);
		self.boarddiv.x ().a (b);
	});},
	get analyzelocal () {return __get__ (this, function (self) {
		try {
			self.root.mainboard.variantchanged ('atomic', self.fen);
			self.root.parenttabpane.selectbykey ('board');
		}
		catch (__except0__) {
			// pass;
		}
	});},
	get analyzelichess () {return __get__ (this, function (self) {
		window.open ('https://lichess.org/analysis/atomic/' + self.fen, '_blank');
	});},
	get delchilds () {return __get__ (this, function (self) {
		self.childs = [];
		self.root.rebuild (mainseed);
	});},
	get delme () {return __get__ (this, function (self) {
		var parent = self.parent;
		if (parent) {
			var newchilds = [];
			for (var child of parent.childs) {
				print ('child', child.move, child.uci);
				if (!(child == self)) {
					newchilds.append (child);
				}
			}
			parent.childs = newchilds;
			self.root.rebuild (mainseed);
		}
	});},
	get serializefunc () {return __get__ (this, function (self) {
		self.root.rebuild (mainseed + 1);
		self.root.store ();
	});},
	get serialize () {return __get__ (this, function (self) {
		self.infohook.html ('serializing');
		setTimeout (self.serializefunc, 100);
	});},
	get copysrc () {return __get__ (this, function (self) {
		self.root.copysrc ();
	});},
	get copylink () {return __get__ (this, function (self) {
		var ti = TextInput ();
		self.linktexthook.a (ti);
		ti.setText ('https://fbserv.herokuapp.com/analysis/atomic/' + self.fen.py_replace (' ', '%20'));
		ti.e.select ();
		document.execCommand ('copy');
		self.linktexthook.x ();
	});},
	get build () {return __get__ (this, function (self) {
		self.movediv = Div ().disp ('flex').fd ('row').ai ('center');
		self.movedescdiv = Div ().bc ('#eee').w (110).maw (110).pad (3);
		self.movelabeldiv = Div ().fw ('bold').pad (3).ff ('monospace');
		self.setmovelabel ();
		self.ownerdiv = Div ().html (self.owner).ff ('monospace').fs ('10').c ('#007');
		self.ucidiv = Div ().ff ('monospace').fs ('12').pad (3);
		self.commentdiv = Div ().fs ('12').pad (5).html (self.comment);
		if (self.uci) {
			self.ucidiv.html (self.uci);
		}
		self.movedescdiv.a ([self.movelabeldiv, self.ownerdiv, self.commentdiv]);
		self.movedescdiv.a (Button ('Analyze local', self.analyzelocal).mar (2));
		self.movedescdiv.a (Button ('Analyze lichess', self.analyzelichess).mar (2));
		self.infohook = Div ().ff ('monospace').pad (3).c ('#007').fw ('bold').html ('built');
		if (self.isadmin) {
			self.movedescdiv.a (self.infohook);
			self.linktexthook = Div ();
			self.movedescdiv.a (self.ucidiv);
			self.movedescdiv.a (Button ('+', self.addnode).pad (5));
			self.movedescdiv.a (Button ('san', self.editsan).pad (5));
			self.movedescdiv.a (Button ('uci', self.edituci).pad (5));
			self.movedescdiv.a (Button ('fen', self.editfen).pad (5));
			self.movedescdiv.a (Button ('comment', self.editcomment).pad (5));
			self.movedescdiv.a (Button ('owner', self.editowner).pad (5));
			self.movedescdiv.a (Button ('serialize', self.serialize).pad (5).bc ('#ffa'));
			self.movedescdiv.a (Button ('copy', self.copysrc).pad (5).bc ('#afa'));
			self.movedescdiv.a (self.linktexthook);
			self.movedescdiv.a (Button ('link', self.copylink).pad (5).bc ('#aff'));
			self.movedescdiv.a (Button ('delchilds', self.delchilds).pad (5).bc ('#faa'));
			self.movedescdiv.a (Button ('delme', self.delme).pad (5).bc ('#faa'));
		}
		self.boarddiv = Div ().pad (2);
		self.movecontainerdiv = Div ().disp ('flex').fd ('row').ai ('center');
		self.movecontainerdiv.a ([self.movedescdiv, self.boarddiv]);
		self.containerdiv = Div ().disp ('flex').fd ('column').ai ('flex-start');
		self.movediv.a ([self.movecontainerdiv, self.containerdiv]);
		self.setboard ();
		self.x ().a (self.movediv);
		self.mw (600);
	});}
});
export var Forumgame =  __class__ ('Forumgame', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (Forumgame, '__init__') (self, 'div');
		self.messagediv = Div ().disp ('inline-block').pad (3).ff ('monospace');
		self.contentdiv = Div ();
		self.a ([self.messagediv, self.contentdiv]);
		self.reqfenunderway = false;
		self.reqnode = null;
		self.requestforumgame ();
		self.ae ('mousemove', self.mousemove);
		self.ae ('mouseup', self.mouseup);
		self.ae ('mouseleave', self.mouseleave);
	});},
	get copysrc () {return __get__ (this, function (self) {
		self.textarea.e.select ();
		document.execCommand ('copy');
		window.alert ('Copied source to clipboard, {} characters.'.format (len (self.textarea.getText ())));
	});},
	get mousemove () {return __get__ (this, function (self, ev) {
		if (self.dragunderway) {
			var dx = ev.clientX - self.dragstartx;
			var dy = ev.clientY - self.dragstarty;
			self.parenttabpane.contentdiv.e.scrollTop = self.scrolltop + 20 * dy;
			self.parenttabpane.contentdiv.e.scrollLeft = self.scrollleft + 20 * dx;
		}
	});},
	get mouseup () {return __get__ (this, function (self, ev) {
		self.dragunderway = false;
	});},
	get mouseleave () {return __get__ (this, function (self, ev) {
		self.dragunderway = false;
	});},
	get parse () {return __get__ (this, function (self) {
		var obj = self.rootnode.toobj ();
		var text = JSON.stringify (obj, null, 2);
		self.textarea.setText (text);
		return text;
	});},
	get store () {return __get__ (this, function (self) {
		self.parenttabpane.contentdiv.bc ('#faa');
		self.messagediv.html ('Parsing JSON');
		try {
			var obj = JSON.parse (self.textarea.getText ());
			self.messagediv.html ('Storing JSON');
			getconn ().sioreq (dict ({'kind': 'setforumgame', 'owner': 'forumgame', 'forumgame': obj}));
		}
		catch (__except0__) {
			self.messagediv.html ('Error: could not parse JSON');
			return ;
		}
	});},
	get requestforumgame () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'getforumgame', 'owner': 'forumgame'}));
	});},
	get buildrec () {return __get__ (this, function (self, parentnode, tree) {
		if (!(tree ['moves'])) {
			return ;
		}
		for (var move in tree ['moves']) {
			var moveobj = tree ['moves'] [move];
			var node = Forumnode (self, {'move': move, 'uci': moveobj ['uci'], 'comment': moveobj ['comment'], 'owner': moveobj ['owner'], 'fen': moveobj ['fen'], 'parent': parentnode, 'isadmin': self.isadmin});
			parentnode.appendchild (node);
			self.buildrec (node, moveobj);
		}
	});},
	get build () {return __get__ (this, function (self, text, seed) {
		setseed (seed);
		self.contentdiv.x ().pad (3);
		self.textarea = TextArea ().w (1000).h (200);
		self.textarea.setText (text);
		self.controlpanel = Div ();
		self.controlpanel.a (Button ('Store', self.store));
		if (self.isadmin) {
			self.contentdiv.a (self.textarea);
			self.contentdiv.a (self.controlpanel);
		}
		self.rootnode = Forumnode (self, dict ({'move': 'startpos', 'uci': null, 'owner': 'Wolfram_EP', 'comment': 'Forum game', 'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'parent': null, 'isadmin': self.isadmin}));
		self.contentdiv.a (self.rootnode);
		self.buildrec (self.rootnode, self.forumgame);
		self.parenttabpane.setscroll ();
		self.contentdiv.sa ('draggable', true).cm ().ae ('dragstart', self.dragstart);
	});},
	get dragstart () {return __get__ (this, function (self, ev) {
		ev.preventDefault ();
		self.dragstartx = ev.clientX;
		self.dragstarty = ev.clientY;
		self.scrolltop = self.parenttabpane.contentdiv.e.scrollTop;
		self.scrollleft = self.parenttabpane.contentdiv.e.scrollLeft;
		self.dragunderway = true;
	});},
	get rebuild () {return __get__ (this, function (self, seed) {
		var text = self.parse ();
		self.forumgame = JSON.parse (text);
		self.build (text, seed);
	});},
	get shift () {return __get__ (this, function (self) {
		var sl = self.parenttabpane.contentdiv.e.scrollLeft;
		self.parenttabpane.contentdiv.e.scrollLeft = sl + 300;
	});},
	get siores () {return __get__ (this, function (self, response) {
		if (response ['kind'] == 'setforumgame') {
			self.forumgame = response ['forumgame'];
			self.messagediv.html ('Forumgame loaded');
			self.isadmin = response ['isadmin'];
			if (queryparams.py_get ('noadmin', 'false') == 'true') {
				self.isadmin = false;
			}
			self.build (JSON.stringify (self.forumgame, null, 2), mainseed);
			self.parenttabpane.contentdiv.bc ('#def');
		}
		if (response ['kind'] == 'setforumgamedone') {
			self.messagediv.html ('Stored, refreshing');
			self.requestforumgame ();
		}
		if (response ['kind'] == 'setforumgamefen') {
			var posinfo = response ['positioninfo'];
			var fen = response ['fen'];
			var san = posinfo ['genmove'] ['san'];
			var uci = posinfo ['genmove'] ['uci'];
			var rp = self.reqnode.parent;
			var owner = null;
			if (rp) {
				var owner = rp.owner;
			}
			if (!(owner)) {
				var owner = window.prompt ('Owner', '?');
			}
			if (!(owner)) {
				var owner = '?';
			}
			self.reqnode.appendchild (Forumnode (self, dict ({'move': san, 'uci': uci, 'comment': '', 'owner': owner, 'fen': fen, 'parent': self.reqnode, 'isadmin': self.isadmin})));
			self.parse ();
		}
	});}
});

//# sourceMappingURL=forumgame.map