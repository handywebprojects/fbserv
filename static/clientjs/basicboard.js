// Transcrypt'ed from Python, 2019-04-17 10:31:43
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {getconn} from './connection.js';
import {Vect, cpick, scorecolor, scoreverbal, xor} from './utils.js';
import {Canvas, ComboBox, Div, Slider, Table, Td, TextArea, TextInput, Tr, e} from './dom.js';
var __name__ = 'basicboard';
export var STANDARD_START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export var ANTICHESS_START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1';
export var RACING_KINGS_START_FEN = '8/8/8/8/8/8/krbnNBRK/qrbnNBRQ w - - 0 1';
export var HORDE_START_FEN = 'rnbqkbnr/pppppppp/8/1PP2PP1/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP w kq - 0 1';
export var THREE_CHECK_START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 3+3 0 1';
export var CRAZYHOUSE_START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR[] w KQkq - 0 1';
export var PIECE_KINDS = ['p', 'n', 'b', 'r', 'q', 'k'];
export var WHITE = 1;
export var BLACK = 0;
export var VARIANT_OPTIONS = [['standard', 'Standard'], ['fromPosition', 'From Position'], ['antichess', 'Antichess'], ['atomic', 'Atomic'], ['chess960', 'Chess960'], ['crazyhouse', 'Crazyhouse'], ['horde', 'Horde'], ['kingOfTheHill', 'King of the Hill'], ['racingKings', 'Racing Kings'], ['threeCheck', 'Three Check']];
export var PIECE_NAMES = dict ({'p': 'Pawn', 'n': 'Knight', 'b': 'Bishop', 'r': 'Rook', 'q': 'Queen', 'k': 'King'});
export var PROMPIECEKINDS_STANDARD = ['n', 'b', 'r', 'q'];
export var PROMPIECEKINDS_ANTICHESS = ['n', 'b', 'r', 'q', 'k'];
export var TRAIN_OPTIONS = [['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9']];
export var prompiecekindsforvariantkey = function (variantkey) {
	if (variantkey == 'antichess') {
		return PROMPIECEKINDS_ANTICHESS;
	}
	return PROMPIECEKINDS_STANDARD;
};
export var piececolortocolorname = function (color) {
	if (color == WHITE) {
		return 'White';
	}
	else if (color == BLACK) {
		return 'Black';
	}
	return 'Invalidcolor';
};
export var piecekindtopiecename = function (kind) {
	if (__in__ (kind, PIECE_NAMES)) {
		return PIECE_NAMES [kind];
	}
	return 'Invalidpiece';
};
export var getstartfenforvariantkey = function (variantkey) {
	if (variantkey == 'antichess') {
		return ANTICHESS_START_FEN;
	}
	if (variantkey == 'racingKings') {
		return RACING_KINGS_START_FEN;
	}
	if (variantkey == 'horde') {
		return HORDE_START_FEN;
	}
	if (variantkey == 'threeCheck') {
		return THREE_CHECK_START_FEN;
	}
	if (variantkey == 'crazyhouse') {
		return CRAZYHOUSE_START_FEN;
	}
	return STANDARD_START_FEN;
};
export var Piece =  __class__ ('Piece', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, kind, color) {
		if (typeof kind == 'undefined' || (kind != null && kind.hasOwnProperty ("__kwargtrans__"))) {;
			var kind = null;
		};
		if (typeof color == 'undefined' || (color != null && color.hasOwnProperty ("__kwargtrans__"))) {;
			var color = null;
		};
		self.kind = kind;
		self.color = color;
	});},
	get isempty () {return __get__ (this, function (self) {
		return self.kind === null;
	});},
	get ispiece () {return __get__ (this, function (self) {
		return !(self.isempty ());
	});},
	get __repr__ () {return __get__ (this, function (self) {
		if (self.isempty ()) {
			return 'Piece[None]';
		}
		return 'Piece[{} {}]'.format (piececolortocolorname (self.color), piecekindtopiecename (self.kind));
	});}
});
export var isvalidpieceletter = function (pieceletter) {
	if (__in__ (pieceletter, PIECE_KINDS)) {
		return true;
	}
	if (__in__ (pieceletter.toLowerCase (), PIECE_KINDS)) {
		return true;
	}
	return false;
};
export var piecelettertopiece = function (pieceletter) {
	if (isvalidpieceletter (pieceletter)) {
		var pieceletterlower = pieceletter.toLowerCase ();
		if (pieceletterlower == pieceletter) {
			return Piece (pieceletterlower, BLACK);
		}
		return Piece (pieceletterlower, WHITE);
	}
	print ('warning, piece letter not valid', pieceletter);
	return Piece ();
};
export var getclassforpiece = function (p, style) {
	var kind = p.kind;
	if (p.color == WHITE) {
		var kind = 'w' + kind;
	}
	return (style + 'piece') + kind;
};
export var Square =  __class__ ('Square', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, file, rank) {
		self.file = file;
		self.rank = rank;
	});},
	get hashkey () {return __get__ (this, function (self) {
		var hashkey = '{}:{}'.format (self.file, self.rank);
		return hashkey;
	});},
	get p () {return __get__ (this, function (self, sq) {
		return Square (self.file + sq.file, self.rank + sq.rank);
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return 'Square[file: {} , rank: {}]'.format (self.file, self.rank);
	});},
	get copy () {return __get__ (this, function (self) {
		return Square (self.file, self.rank);
	});}
});
export var Move =  __class__ ('Move', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, fromsq, tosq, prompiece) {
		if (typeof prompiece == 'undefined' || (prompiece != null && prompiece.hasOwnProperty ("__kwargtrans__"))) {;
			var prompiece = Piece ();
		};
		self.fromsq = fromsq;
		self.tosq = tosq;
		self.prompiece = prompiece;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return 'Move [from: {} , to: {} , prom: {}]'.format (self.fromsq, self.tosq, self.prompiece);
	});}
});
export var PieceStore =  __class__ ('PieceStore', [e], {
	__module__: __name__,
	get dragstartfactory () {return __get__ (this, function (self, p, pdiv, pdivcopy) {
		var dragstart = function (ev) {
			if (self.show) {
				ev.preventDefault ();
				return ;
			}
			self.parent.dragkind = 'set';
			self.parent.draggedsetpiece = p;
			self.parent.draggedpdiv = pdivcopy;
			self.parent.movecanvashook.x ();
			pdiv.op (0.7);
		};
		return dragstart;
	});},
	get setstore () {return __get__ (this, function (self, store) {
		self.store = store;
		self.container.x ();
		self.pieces = dict ({});
		for (var pieceletter of self.store.py_split ('')) {
			var p = piecelettertopiece (pieceletter);
			if (p.color == self.color) {
				if (__in__ (p.kind, self.pieces)) {
					self.pieces [p.kind] ['mul']++;
				}
				else {
					var pcdiv = Div ().pr ().w (self.piecesize).h (self.piecesize);
					var pdiv = Div ().pa ().cp ().ac (getclassforpiece (p, self.parent.piecestyle)).w (self.piecesize).h (self.piecesize);
					var pdivcopy = Div ().pa ().cp ().ac (getclassforpiece (p, self.parent.piecestyle)).w (self.piecesize).h (self.piecesize);
					pdiv.t (0).l (0).sa ('draggable', true).ae ('dragstart', self.dragstartfactory (p, pdiv, pdivcopy));
					pcdiv.a (pdiv);
					self.pieces [p.kind] = dict ({'mul': 1, 'p': p, 'pcdiv': pcdiv});
				}
			}
		}
		for (var [pkind, pdesc] of self.pieces.py_items ()) {
			var muldiv = Div ().pa ().w (self.muldivsize).h (self.muldivsize).fs (self.muldivsize * 1.3).html ('{}'.format (pdesc ['mul']));
			muldiv.l (self.piecesize - self.muldivsize).t (0).ac ('storemuldiv');
			pdesc ['pcdiv'].a (muldiv);
			self.container.a (pdesc ['pcdiv']);
		}
		return self;
	});},
	get __init__ () {return __get__ (this, function (self, args) {
		__super__ (PieceStore, '__init__') (self, 'div');
		self.show = args.py_get ('show', false);
		self.parent = args.py_get ('parent', BasicBoard (dict ({})));
		self.store = args.py_get ('store', '');
		self.color = args.py_get ('color', WHITE);
		self.container = args.py_get ('containerdiv', Div ());
		self.container.ac ('noselect');
		self.piecesize = args.py_get ('piecesize', self.parent.piecesize);
		self.muldivsize = int (self.piecesize / 2);
		self.a (self.container);
		self.setstore (self.store);
	});}
});
export var BasicBoard =  __class__ ('BasicBoard', [e], {
	__module__: __name__,
	get clearcanvases () {return __get__ (this, function (self) {
		self.movecanvas.py_clear ();
		self.piececanvashook.x ();
	});},
	get ucitosquare () {return __get__ (this, function (self, squci) {
		try {
			var file = squci.charCodeAt (0) - 'a'.charCodeAt (0);
			var rank = self.lastrank - (squci.charCodeAt (1) - '1'.charCodeAt (0));
			return Square (file, rank);
		}
		catch (__except0__) {
			return null;
		}
	});},
	get ucitomove () {return __get__ (this, function (self, moveuci) {
		if (__in__ ('@', moveuci)) {
			try {
				var parts = moveuci.py_split ('@');
				var sq = self.ucitosquare (parts [1]);
				var move = Move (sq, sq, Piece (parts [0].toLowerCase (), self.turn ()));
				return move;
			}
			catch (__except0__) {
				return null;
			}
		}
		else {
			try {
				var move = Move (self.ucitosquare (moveuci.__getslice__ (0, 2, 1)), self.ucitosquare (moveuci.__getslice__ (2, 4, 1)));
				try {
					if (len (moveuci) > 4) {
						move.prompiece = Piece (moveuci [4].toLowerCase (), self.turn ());
					}
				}
				catch (__except0__) {
					print ('could not parse prompiece');
				}
				return move;
			}
			catch (__except0__) {
				return null;
			}
		}
	});},
	get resize () {return __get__ (this, function (self, width, height) {
		self.squaresize = 35;
		self.calcsizes ();
		while (self.totalheight () < height) {
			self.squaresize++;
			self.calcsizes ();
		}
		self.squaresize--;
		self.calcsizes ();
		self.build ();
	});},
	get totalheight () {return __get__ (this, function (self) {
		var th = self.outerheight + cpick (self.showfen, self.fendivheight, 0);
		if (self.variantkey == 'crazyhouse') {
			th += 2 * self.squaresize;
		}
		return th;
	});},
	get squareuci () {return __get__ (this, function (self, sq) {
		var fileletter = String.fromCharCode (sq.file + 'a'.charCodeAt (0));
		var rankletter = String.fromCharCode ((self.lastrank - sq.rank) + '1'.charCodeAt (0));
		return fileletter + rankletter;
	});},
	get moveuci () {return __get__ (this, function (self, move) {
		var fromuci = self.squareuci (move.fromsq);
		var touci = self.squareuci (move.tosq);
		var promuci = cpick (move.prompiece.isempty (), '', move.prompiece.kind);
		return (fromuci + touci) + promuci;
	});},
	get islightfilerank () {return __get__ (this, function (self, file, rank) {
		return __mod__ (file + rank, 2) == 0;
	});},
	get islightsquare () {return __get__ (this, function (self, sq) {
		return self.islightfilerank (sq.file, sq.rank);
	});},
	get squarelist () {return __get__ (this, function (self) {
		var squarelist = [];
		for (var file = 0; file < self.numfiles; file++) {
			for (var rank = 0; rank < self.numranks; rank++) {
				squarelist.append (Square (file, rank));
			}
		}
		return squarelist;
	});},
	get squarecoordsvect () {return __get__ (this, function (self, sq) {
		return Vect (sq.file * self.squaresize, sq.rank * self.squaresize);
	});},
	get squarecoordsmiddlevect () {return __get__ (this, function (self, sq) {
		return self.squarecoordsvect (sq).p (Vect (self.squaresize / 2, self.squaresize / 2));
	});},
	get piececoordsvect () {return __get__ (this, function (self, sq) {
		return self.squarecoordsvect (sq).p (Vect (self.squarepadding, self.squarepadding));
	});},
	get flipawaresquare () {return __get__ (this, function (self, sq) {
		if (self.flip) {
			return Square (self.lastfile - sq.file, self.lastrank - sq.rank);
		}
		return sq;
	});},
	get piecedragstartfactory () {return __get__ (this, function (self, sq, pdiv) {
		var piecedragstart = function (ev) {
			if (self.promoting || self.show) {
				ev.preventDefault ();
				return ;
			}
			self.dragkind = 'move';
			self.draggedsq = sq;
			self.draggedpdiv = pdiv;
			self.movecanvashook.x ();
			pdiv.op (0.1);
		};
		return piecedragstart;
	});},
	get piecedragfactory () {return __get__ (this, function (self) {
		var piecedrag = function (ev) {
			// pass;
		};
		return piecedrag;
	});},
	get piecedragendfactory () {return __get__ (this, function (self, sq, pdiv) {
		var piecedragend = function (ev) {
			pdiv.op (0.5);
		};
		return piecedragend;
	});},
	get piecedragoverfactory () {return __get__ (this, function (self, sq) {
		var piecedragover = function (ev) {
			ev.preventDefault ();
		};
		return piecedragover;
	});},
	get ismovepromotion () {return __get__ (this, function (self, move) {
		var fromp = self.getpieceatsquare (move.fromsq);
		if (fromp.kind == 'p' && fromp.color == self.turn ()) {
			if (self.iswhitesturn ()) {
				if (move.tosq.rank == 0) {
					return true;
				}
			}
			else if (move.tosq.rank == self.lastrank) {
				return true;
			}
		}
		return false;
	});},
	get piecedropfactory () {return __get__ (this, function (self, sq) {
		var piecedrop = function (ev) {
			ev.preventDefault ();
			self.draggedpdiv.pv (self.piececoordsvect (self.flipawaresquare (sq)));
			self.draggedpdiv.zi (100);
			if (self.dragkind == 'move') {
				self.dragmove = Move (self.draggedsq, sq);
				if (self.ismovepromotion (self.dragmove)) {
					self.promoting = true;
					self.build ();
				}
				else if (!(self.movecallback === null)) {
					self.movecallback (self.variantkey, self.fen, self.moveuci (self.dragmove));
				}
			}
			else if (self.dragkind == 'set') {
				self.container.a (self.draggedpdiv);
				if (!(self.movecallback === null)) {
					var setuci = '{}@{}'.format (self.draggedsetpiece.kind, self.squareuci (sq));
					self.movecallback (self.variantkey, self.fen, setuci);
				}
			}
		};
		return piecedrop;
	});},
	get buildsquares () {return __get__ (this, function (self) {
		self.container.x ();
		self.sqdivs = dict ({});
		self.sqhdivs = dict ({});
		for (var sq of self.squarelist ()) {
			var sqclass = cpick (self.islightsquare (sq), 'boardsquarelight', 'boardsquaredark');
			var sqdiv = Div ().ac (['boardsquare', sqclass]).w (self.squaresize).h (self.squaresize);
			var sqhdiv = Div ().pa ().w (self.squaresize).h (self.squaresize);
			self.sqdivs [sq.hashkey ()] = sqdiv;
			self.sqhdivs [sq.hashkey ()] = sqhdiv;
			var fasq = self.flipawaresquare (sq);
			sqdiv.pv (self.squarecoordsvect (fasq));
			sqhdiv.pv (self.squarecoordsvect (fasq));
			sqdiv.ae ('dragover', self.piecedragoverfactory (sq));
			sqdiv.ae ('drop', self.piecedropfactory (sq));
			self.container.a ([sqdiv, sqhdiv]);
			var p = self.getpieceatsquare (sq);
			if (p.ispiece ()) {
				var pdiv = Div ().ac ('boardpiece').w (self.piecesize).h (self.piecesize).pv (self.piececoordsvect (fasq));
				pdiv.ac (getclassforpiece (p, self.piecestyle)).sa ('draggable', true);
				pdiv.ae ('dragstart', self.piecedragstartfactory (sq, pdiv));
				pdiv.ae ('drag', self.piecedragfactory ());
				pdiv.ae ('dragend', self.piecedragendfactory (sq, pdiv));
				pdiv.ae ('dragover', self.piecedragoverfactory (sq));
				pdiv.ae ('drop', self.piecedropfactory (sq));
				pdiv.zi (10);
				if (self.variantkey == 'threeCheck') {
					if (p.kind == 'k') {
						var mul = self.getthreelifesforcolor (p.color);
						var lifesdiv = Div ().pa ().t (-(self.squaresize) / 10).l (self.squaresize / 2 + self.squaresize / 10).w (self.squaresize / 2).h (self.squaresize / 2);
						lifesdiv.ac ('boardthreechecklifesdiv').fs (self.squaresize / 1.5).html ('{}'.format (mul));
						lifesdiv.c (['#ff0', '#ff0'] [p.color]);
						pdiv.a (lifesdiv);
					}
				}
				self.container.a (pdiv);
			}
		}
	});},
	get getthreelifesforcolor () {return __get__ (this, function (self, color) {
		var parts = self.threefen.py_split ('+');
		var mul = 3;
		if (color == WHITE) {
			try {
				var mul = int (parts [2]);
			}
			catch (__except0__) {
				print ('warning, could not parse white lifes from', self.threefen);
			}
		}
		if (color == BLACK) {
			try {
				var mul = int (parts [0]);
			}
			catch (__except0__) {
				print ('warning, could not parse black lifes from', self.threefen);
			}
		}
		return mul;
	});},
	get prompiececlickedfactory () {return __get__ (this, function (self, prompiecekind) {
		var prompiececlicked = function () {
			self.dragmove.prompiece = Piece (prompiecekind, self.turn ());
			self.movecallback (self.variantkey, self.fen, self.moveuci (self.dragmove));
		};
		return prompiececlicked;
	});},
	get buildprominput () {return __get__ (this, function (self) {
		var promkinds = prompiecekindsforvariantkey (self.variantkey);
		var promsq = self.dragmove.tosq.copy ();
		var dir = cpick (promsq.rank >= self.numranks / 2, -(1), 1);
		var ppks = prompiecekindsforvariantkey (self.variantkey);
		for (var ppk of ppks) {
			var fapromsq = self.flipawaresquare (promsq);
			var pp = Piece (ppk, self.turn ());
			var psqdiv = Div ().pa ().cp ().zi (150).w (self.squaresize).h (self.squaresize).ac ('boardpromotionsquare');
			psqdiv.pv (self.squarecoordsvect (fapromsq));
			var ppdiv = Div ().pa ().cp ().zi (200).w (self.piecesize).h (self.piecesize).ac (getclassforpiece (pp, self.piecestyle));
			ppdiv.pv (self.piececoordsvect (fapromsq)).ae ('mousedown', self.prompiececlickedfactory (ppk));
			self.container.a ([psqdiv, ppdiv]);
			var promsq = promsq.p (Square (0, dir));
		}
	});},
	get promotecancelclick () {return __get__ (this, function (self) {
		self.promoting = false;
		self.build ();
	});},
	get drawmovearrow () {return __get__ (this, function (self, move, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		if (move === null) {
			return ;
		}
		var strokecolor = args.py_get ('strokecolor', '#FFFF00');
		var linewidth = args.py_get ('linewidth', 0.2) * self.squaresize;
		var headwidth = args.py_get ('headwidth', 0.2) * self.squaresize;
		var headheight = args.py_get ('headheight', 0.2) * self.squaresize;
		self.movecanvas.lineWidth (linewidth);
		self.movecanvas.strokeStyle (strokecolor);
		self.movecanvas.fillStyle (strokecolor);
		var tomv = self.squarecoordsmiddlevect (self.flipawaresquare (move.tosq));
		self.movecanvas.drawline (self.squarecoordsmiddlevect (self.flipawaresquare (move.fromsq)), tomv);
		var dv = Vect (headwidth, headheight);
		self.movecanvas.fillRect (tomv.m (dv), tomv.p (dv));
		if (!(move.prompiece.isempty ())) {
			var pf = 4;
			var dvp = Vect (linewidth * pf, linewidth * pf);
			move.prompiece.color = self.turn ();
			var ppdiv = Div ().pa ().cp ().ac (getclassforpiece (move.prompiece, self.piecestyle)).w ((linewidth * 2) * pf).h ((linewidth * 2) * pf);
			ppdiv.pv (tomv.m (dvp));
			self.piececanvashook.a (ppdiv);
		}
	});},
	get drawuciarrow () {return __get__ (this, function (self, uci, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		self.drawmovearrow (self.ucitomove (uci), args);
	});},
	get highlightsquare () {return __get__ (this, function (self, sq, bc) {
		var margin = self.squaresize * 0.1;
		var hsize = self.squaresize - 2 * margin;
		var sqhdiv = self.sqhdivs [sq.hashkey ()];
		sqhdiv.a (Div ().pa ().t (margin).l (margin).w (hsize).h (hsize).bc (bc));
		sqhdiv.op (0.75);
	});},
	get highlightmove () {return __get__ (this, function (self, move, bc) {
		self.highlightsquare (move.fromsq, bc);
		self.highlightsquare (move.tosq, bc);
	});},
	get highlightucimove () {return __get__ (this, function (self, uci, bc) {
		self.highlightmove (self.ucitomove (uci), bc);
	});},
	get buildgenmove () {return __get__ (this, function (self) {
		if (__in__ ('genmove', self.positioninfo)) {
			if (!(genmove == 'reset')) {
				var genmoveuci = self.positioninfo ['genmove'] ['uci'];
				var genmove = self.ucitomove (genmoveuci);
				if (!(genmove === null)) {
					genmove.prompiece = Piece ();
					self.drawmovearrow (genmove);
				}
			}
		}
	});},
	get fentextchanged () {return __get__ (this, function (self) {
		if (self.fentextchangedcallback) {
			self.fentextchangedcallback (self.fentext.getText ());
		}
	});},
	get build () {return __get__ (this, function (self) {
		self.sectioncontainer = Div ().ac ('boardsectioncontainer').w (self.outerwidth);
		self.sectioncontainer.bci (self.background);
		self.outercontainer = Div ().ac ('boardoutercontainer').w (self.outerwidth).h (self.outerheight);
		self.outercontainer.bci (self.background);
		self.container = Div ().ac ('boardcontainer').w (self.width).h (self.height).t (self.margin).l (self.margin);
		self.container.bci (self.background);
		self.outercontainer.a (self.container);
		self.buildsquares ();
		self.turndiv = Div ().pa ().w (self.turndivsize).h (self.turndivsize).bc (cpick (self.iswhitesturn (), '#fff', '#000'));
		if (self.variantkey == 'racingKings') {
			self.turndiv.t (cpick (self.flip, 0, self.outerheight - self.turndivsize));
			if (xor (self.isblacksturn (), self.flip)) {
				self.turndiv.l (0);
			}
			else {
				self.turndiv.l (self.outerwidth - self.turndivsize);
			}
		}
		else {
			self.turndiv.l (self.outerwidth - self.turndivsize).t (cpick (xor (self.isblacksturn (), self.flip), 0, self.outerheight - self.turndivsize));
		}
		self.outercontainer.a (self.turndiv);
		if (self.promoting) {
			self.buildprominput ();
			self.container.ae ('mousedown', self.promotecancelclick);
		}
		self.fentext = TextInput (dict ({})).w (self.width).fs (10).setText (self.fen);
		self.fentext.changecallback = self.fentextchanged;
		self.fendiv = Div ().ac ('boardfendiv').h (self.fendivheight).a (self.fentext);
		if (self.variantkey == 'crazyhouse') {
			self.whitestorediv = Div ().ac ('boardstorediv').h (self.squaresize).w (self.outerwidth);
			self.whitestorediv.bci (self.background);
			self.blackstorediv = Div ().ac ('boardstorediv').h (self.squaresize).w (self.outerwidth);
			self.blackstorediv.bci (self.background);
			self.whitestore = PieceStore (dict ({'show': self.show, 'parent': self, 'color': WHITE, 'store': self.crazyfen, 'containerdiv': self.whitestorediv}));
			self.blackstore = PieceStore (dict ({'show': self.show, 'parent': self, 'color': BLACK, 'store': self.crazyfen, 'containerdiv': self.blackstorediv}));
			if (self.flip) {
				self.sectioncontainer.a ([self.whitestorediv, self.outercontainer, self.blackstorediv]);
			}
			else {
				self.sectioncontainer.a ([self.blackstorediv, self.outercontainer, self.whitestorediv]);
			}
		}
		else {
			self.sectioncontainer.a ([self.outercontainer]);
		}
		if (self.showfen) {
			self.sectioncontainer.a (self.fendiv);
		}
		self.x ().a (self.sectioncontainer);
		self.movecanvas = Canvas (self.width, self.height).pa ().t (0).l (0);
		self.movecanvashook = Div ().pa ().t (0).l (0).zi (5).op (0.5);
		self.piececanvashook = Div ().pa ().t (0).l (0).zi (11).op (0.5);
		self.container.a ([self.movecanvashook, self.piececanvashook]);
		self.movecanvashook.a (self.movecanvas);
		self.buildgenmove ();
		return self;
	});},
	get setflip () {return __get__ (this, function (self, flip) {
		self.flip = flip;
		self.build ();
	});},
	get calcsizes () {return __get__ (this, function (self) {
		self.lastfile = self.numfiles - 1;
		self.lastrank = self.numranks - 1;
		self.area = self.numfiles * self.numranks;
		self.width = self.numfiles * self.squaresize;
		self.height = self.numranks * self.squaresize;
		self.avgsize = (self.width + self.height) / 2;
		self.margin = self.marginratio * self.avgsize;
		self.squarepadding = self.squarepaddingratio * self.squaresize;
		self.piecesize = self.squaresize - 2 * self.squarepadding;
		self.outerwidth = self.width + 2 * self.margin;
		self.outerheight = self.height + 2 * self.margin;
		self.turndivsize = self.margin;
		self.fendivheight = 25;
	});},
	get parseargs () {return __get__ (this, function (self, args) {
		self.fentextchangedcallback = args.py_get ('fentextchangedcallback', null);
		self.positioninfo = args.py_get ('positioninfo', dict ({}));
		self.show = args.py_get ('show', false);
		self.showfen = args.py_get ('showfen', true);
		self.squaresize = args.py_get ('squaresize', 45);
		self.squarepaddingratio = args.py_get ('squarepaddingratio', 0.04);
		self.marginratio = args.py_get ('marginratio', 0.02);
		self.numfiles = args.py_get ('numfiles', 8);
		self.numranks = args.py_get ('numranks', 8);
		self.piecestyle = args.py_get ('piecestyle', 'alpha');
		self.flip = args.py_get ('flip', false);
		self.movecallback = args.py_get ('movecallback', null);
		self.background = '/static/img/backgrounds/' + args.py_get ('background', 'wood.jpg');
		self.calcsizes ();
	});},
	get setpieceati () {return __get__ (this, function (self, i, p) {
		if (i >= 0 && i < self.area) {
			self.rep [i] = p;
		}
		else {
			print ('warning, rep index out of range', i);
		}
	});},
	get getpieceati () {return __get__ (this, function (self, i) {
		if (i >= 0 && i < self.area) {
			return self.rep [i];
		}
		return Piece ();
	});},
	get getpieceatfilerank () {return __get__ (this, function (self, file, rank) {
		var i = rank * self.numfiles + file;
		return self.getpieceati (i);
	});},
	get getpieceatsquare () {return __get__ (this, function (self, sq) {
		return self.getpieceatfilerank (sq.file, sq.rank);
	});},
	get setrepfromfen () {return __get__ (this, function (self, fen) {
		self.fen = fen;
		self.crazyfen = null;
		self.threefen = null;
		self.rep = (function () {
			var __accu0__ = [];
			for (var i = 0; i < self.area; i++) {
				__accu0__.append (Piece ());
			}
			return __accu0__;
		}) ();
		var fenparts = self.fen.py_split (' ');
		self.rawfen = fenparts [0];
		var rawfenparts = self.rawfen.py_split ('/');
		if (self.variantkey == 'crazyhouse') {
			self.crazyfen = '';
			if (__in__ ('[', self.rawfen)) {
				var cfenparts = self.rawfen.py_split ('[');
				self.rawfen = cfenparts [0];
				var rawfenparts = self.rawfen.py_split ('/');
				var cfenparts = cfenparts [1].py_split (']');
				self.crazyfen = cfenparts [0];
			}
		}
		var i = 0;
		for (var rawfenpart of rawfenparts) {
			var pieceletters = rawfenpart.py_split ('');
			for (var pieceletter of pieceletters) {
				if (isvalidpieceletter (pieceletter)) {
					self.setpieceati (i, piecelettertopiece (pieceletter));
					i++;
				}
				else {
					var mul = 0;
					try {
						var mul = int (pieceletter);
					}
					catch (__except0__) {
						print ('warning, multiplicity could not be parsed from', pieceletter);
					}
					for (var j = 0; j < mul; j++) {
						self.setpieceati (i, Piece ());
						i++;
					}
				}
			}
		}
		if (i < self.area) {
			print ('warning, raw fen did not fill board');
		}
		else if (i > self.area) {
			print ('warning, raw fen exceeded board');
		}
		self.turnfen = 'w';
		if (len (fenparts) > 1) {
			self.turnfen = fenparts [1];
		}
		else {
			print ('warning, no turn fen');
		}
		self.castlefen = '-';
		if (len (fenparts) > 2) {
			self.castlefen = fenparts [2];
		}
		else {
			print ('warning, no castle fen');
		}
		self.epfen = '-';
		if (len (fenparts) > 3) {
			self.epfen = fenparts [3];
		}
		else {
			print ('warning, no ep fen');
		}
		var moveclocksi = cpick (self.variantkey == 'threeCheck', 5, 4);
		self.halfmoveclock = 0;
		if (len (fenparts) > moveclocksi) {
			try {
				self.halfmoveclock = int (fenparts [moveclocksi]);
			}
			catch (__except0__) {
				print ('warning, half move clock could not be parsed from', fenparts [4]);
			}
		}
		else {
			print ('warning, no half move fen');
		}
		self.fullmovenumber = 1;
		if (len (fenparts) > moveclocksi + 1) {
			try {
				self.fullmovenumber = int (fenparts [moveclocksi + 1]);
			}
			catch (__except0__) {
				print ('warning, full move number could not be parsed from', fenparts [5]);
			}
		}
		else {
			print ('warning, no full move fen');
		}
		if (self.variantkey == 'threeCheck') {
			if (len (fenparts) > 4) {
				self.threefen = fenparts [4];
			}
		}
		self.promoting = false;
	});},
	get turn () {return __get__ (this, function (self) {
		if (self.turnfen == 'w') {
			return WHITE;
		}
		return BLACK;
	});},
	get iswhitesturn () {return __get__ (this, function (self) {
		return self.turn () == WHITE;
	});},
	get isblacksturn () {return __get__ (this, function (self) {
		return self.turn () == BLACK;
	});},
	get initrep () {return __get__ (this, function (self, args) {
		self.variantkey = args.py_get ('variantkey', 'standard');
		self.setrepfromfen (args.py_get ('fen', getstartfenforvariantkey (self.variantkey)));
	});},
	get setfromfen () {return __get__ (this, function (self, fen, positioninfo) {
		if (typeof positioninfo == 'undefined' || (positioninfo != null && positioninfo.hasOwnProperty ("__kwargtrans__"))) {;
			var positioninfo = dict ({});
		};
		self.positioninfo = positioninfo;
		self.setrepfromfen (fen);
		self.build ();
	});},
	get reset () {return __get__ (this, function (self) {
		self.setfromfen (getstartfenforvariantkey (self.variantkey));
	});},
	get __init__ () {return __get__ (this, function (self, args) {
		__super__ (BasicBoard, '__init__') (self, 'div');
		self.positioninfo = dict ({});
		self.parseargs (args);
		self.initrep (args);
		self.build ();
	});}
});
export var MultipvInfo =  __class__ ('MultipvInfo', [e], {
	__module__: __name__,
	get bestmovesanclickedfactory () {return __get__ (this, function (self, moveuci, dostore) {
		if (typeof dostore == 'undefined' || (dostore != null && dostore.hasOwnProperty ("__kwargtrans__"))) {;
			var dostore = false;
		};
		var bestmovesanclicked = function () {
			if (!(self.bestmovesanclickedcallback === null)) {
				self.bestmovesanclickedcallback (moveuci, dostore);
			}
		};
		return bestmovesanclicked;
	});},
	get scorebonus () {return __get__ (this, function (self) {
		if (__in__ ('scorebonus', self.infoi)) {
			try {
				var scorebonus = int (self.infoi ['scorebonus']);
				return scorebonus;
			}
			catch (__except0__) {
				// pass;
			}
		}
		return 0;
	});},
	get effscore () {return __get__ (this, function (self) {
		return self.scorenumerical + self.scorebonus ();
	});},
	get bonussliderchanged () {return __get__ (this, function (self) {
		self.infoi ['scorebonus'] = self.bonusslider.v ();
		self.build ();
		if (!(self.bonussliderchangedcallback === null)) {
			self.bonussliderchangedcallback ();
		}
	});},
	get traincombochanged () {return __get__ (this, function (self) {
		self.infoi ['metrainweight'] = self.metraincombo.v ();
		self.infoi ['opptrainweight'] = self.opptraincombo.v ();
		self.build ();
	});},
	get build () {return __get__ (this, function (self, gamesan) {
		if (typeof gamesan == 'undefined' || (gamesan != null && gamesan.hasOwnProperty ("__kwargtrans__"))) {;
			var gamesan = null;
		};
		self.bestmoveuci = self.infoi ['bestmoveuci'];
		self.bestmovesan = self.infoi ['bestmovesan'];
		self.scorenumerical = self.infoi ['scorenumerical'];
		self.pvsan = self.infoi ['pvsan'];
		self.pvsans = self.pvsan.py_split (' ');
		if (len (self.pvsans) > self.pvlength + 1) {
			self.pvsans = self.pvsans.__getslice__ (0, self.pvlength + 1, 1);
		}
		if (len (self.pvsans) > 1) {
			self.pvsans = self.pvsans.__getslice__ (1, null, 1);
		}
		self.showpv = ' '.join (self.pvsans);
		self.pvpgn = self.infoi ['pvpgn'];
		self.depth = self.infoi ['depth'];
		self.nps = self.infoi ['nps'];
		self.container = Div ().ac ('multipvinfocontainer');
		self.idiv = Div ().ac ('multipvinfoi').html ('{}.'.format (self.i));
		self.bestmovesandiv = Div ().ac ('multipvinfobestmovesan').html (self.bestmovesan);
		if (gamesan == self.bestmovesan) {
			self.bestmovesandiv.bc ('#fbf');
		}
		self.bestmovesandiv.ae ('mousedown', self.bestmovesanclickedfactory (self.bestmoveuci));
		self.scorenumericaldiv = Div ().ac ('multipvinfoscorenumerical').html ('{}'.format (scoreverbal (self.effscore ()))).cp ();
		self.scorenumericaldiv.ae ('mousedown', self.bestmovesanclickedfactory (self.bestmoveuci, true));
		self.bonussliderdiv = Div ().ac ('multipvinfobonussliderdiv');
		self.bonusslider = Slider ().setmin (-(500)).setmax (500).ac ('multipvinfobonusslider').sv (self.scorebonus ());
		self.bonusslider.ae ('change', self.bonussliderchanged);
		self.bonussliderdiv.a (self.bonusslider);
		self.depthdiv = Div ().ac ('multipvinfodepth').html ('{}'.format (self.depth));
		self.miscdiv = Div ().ac ('multipvinfomisc').html ('nps {}'.format (self.nps));
		self.traindiv = Div ().ac ('multipvinfomisc').w (100);
		var metrainweight = self.infoi ['metrainweight'];
		var hasmetrain = false;
		if (!(metrainweight)) {
			var metrainweight = '0';
		}
		var opptrainweight = self.infoi ['opptrainweight'];
		var hasopptrain = false;
		if (!(opptrainweight)) {
			var opptrainweight = '0';
		}
		try {
			if (int (metrainweight) > 0) {
				var hasmetrain = true;
			}
			if (int (opptrainweight) > 0) {
				var hasopptrain = true;
			}
		}
		catch (__except0__) {
			// pass;
		}
		if (hasmetrain && hasopptrain) {
			self.trainbc = '#00f';
		}
		else if (hasmetrain) {
			self.trainbc = '#0f0';
		}
		else if (hasopptrain) {
			self.trainbc = '#f00';
		}
		else {
			self.trainbc = 'inherit';
		}
		self.metraincombo = ComboBox ().setoptions (TRAIN_OPTIONS, metrainweight, self.traincombochanged);
		self.opptraincombo = ComboBox ().setoptions (TRAIN_OPTIONS, opptrainweight, self.traincombochanged);
		self.traindiv.a ([self.metraincombo, self.opptraincombo]);
		self.pvdiv = Div ().ac ('multipvinfopv').html (self.showpv).c ('#070').fw ('bold');
		self.container.a ([self.idiv, self.bestmovesandiv, self.scorenumericaldiv, self.bonussliderdiv, self.traindiv, self.depthdiv, self.pvdiv]);
		self.container.bc (self.trainbc);
		self.bestmovesandiv.c (scorecolor (self.effscore ()));
		self.scorenumericaldiv.c (scorecolor (self.effscore ()));
		self.x ().a (self.container);
	});},
	get __init__ () {return __get__ (this, function (self, infoi, pvlength) {
		if (typeof pvlength == 'undefined' || (pvlength != null && pvlength.hasOwnProperty ("__kwargtrans__"))) {;
			var pvlength = 4;
		};
		__super__ (MultipvInfo, '__init__') (self, 'div');
		self.pvlength = pvlength;
		self.bestmovesanclickedcallback = null;
		self.bonussliderchangedcallback = null;
		self.infoi = infoi;
		self.i = self.infoi ['i'];
		self.build ();
	});}
});
export var PgnInfo =  __class__ ('PgnInfo', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, parent, pgnlistparent) {
		__super__ (PgnInfo, '__init__') (self, 'div');
		self.headers = [];
		self.parent = parent;
		self.pgnlistparent = pgnlistparent;
	});},
	get getheader () {return __get__ (this, function (self, key, py_default) {
		for (var header of self.headers) {
			if (header [0] == key) {
				return header [1];
			}
		}
		return py_default;
	});},
	get playerlink () {return __get__ (this, function (self, username) {
		return "<a href='https://lichess.org/@/{}' target='_blank' rel='noopener noreferrer'>{}</a>".format (username, username);
	});},
	get parsecontent () {return __get__ (this, function (self) {
		var lines = self.content.py_split ('\n');
		self.headers = [];
		for (var line of lines) {
			if (line [0] == '[') {
				var parts = line.__getslice__ (1, null, 1).py_split ('"');
				var key = parts [0].py_split (' ') [0];
				var value = parts [1].py_split ('"') [0];
				self.headers.append (tuple ([key, value]));
			}
		}
		self.white = self.getheader ('White', '?');
		self.black = self.getheader ('Black', '?');
		self.result = self.getheader ('Result', '?');
		self.site = self.getheader ('Site', '');
		self.whiteelo = self.getheader ('WhiteElo', '?');
		self.whiteratingdiff = self.getheader ('WhiteRatingDiff', '?');
		self.blackelo = self.getheader ('BlackElo', '?');
		self.blackratingdiff = self.getheader ('BlackRatingDiff', '?');
		self.variant = self.getheader ('Variant', 'Standard');
		self.timecontrol = self.getheader ('TimeControl', '?');
		self.utcdate = self.getheader ('UTCDate', '?');
		self.id = self.site.py_split ('/').__getslice__ (-(1), null, 1) [0];
	});},
	get idclicked () {return __get__ (this, function (self) {
		self.parent.loadedgameid = self.id;
		self.parent.loadedgameside = 'white';
		if (self.meblack ()) {
			self.parent.loadedgameside = 'black';
		}
		self.parent.pgntext.setpgn (self.content);
		self.bds ('dotted').bdw ('6').bdc ('#00f');
		localStorage.setItem ('pgninfo/idclicked', self.id);
		self.pgnlistparent.bookmarkedpi = self;
		getconn ().sioreq (dict ({'kind': 'parsepgn', 'owner': self.parent.id, 'data': self.content}));
	});},
	get mecolor () {return __get__ (this, function (self) {
		if (self.white == self.parent.username) {
			return WHITE;
		}
		if (self.black == self.parent.username) {
			return BLACK;
		}
		return null;
	});},
	get mewhite () {return __get__ (this, function (self) {
		return self.mecolor () == WHITE;
	});},
	get meblack () {return __get__ (this, function (self) {
		return self.mecolor () == BLACK;
	});},
	get hasme () {return __get__ (this, function (self) {
		return !(self.mecolor () === null);
	});},
	get score () {return __get__ (this, function (self) {
		if (self.result == '1-0') {
			return 1;
		}
		if (self.result == '0-1') {
			return 0;
		}
		return 0.5;
	});},
	get mescore () {return __get__ (this, function (self) {
		if (self.hasme ()) {
			if (self.mewhite ()) {
				return self.score ();
			}
			return 1 - self.score ();
		}
		return self.score ();
	});},
	get meratinginfo () {return __get__ (this, function (self) {
		if (self.hasme ()) {
			if (self.mewhite ()) {
				return [self.whiteelo, self.whiteratingdiff];
			}
			return [self.blackelo, self.blackratingdiff];
		}
		return null;
	});},
	get build () {return __get__ (this, function (self) {
		self.x ().ac ('pgninfocontainer');
		self.tcdiv = Div ().ac ('pgninfotcdiv').html ('{} {}'.format (self.timecontrol, self.variant));
		self.whitediv = Div ().ac ('pgninfoplayerdiv').html (self.playerlink (self.white));
		self.whiteelodiv = Div ().ac ('pgninfoplayerelodiv').html ('{} {}'.format (self.whiteelo, self.whiteratingdiff));
		if (self.meblack ()) {
			self.whitediv.ac ('pgninfotheyplayerdiv');
		}
		self.blackdiv = Div ().ac ('pgninfoplayerdiv').html (self.playerlink (self.black));
		self.blackelodiv = Div ().ac ('pgninfoplayerelodiv').html ('{} {}'.format (self.blackelo, self.blackratingdiff));
		if (self.mewhite ()) {
			self.blackdiv.ac ('pgninfotheyplayerdiv');
		}
		self.resultdiv = Div ().ac ('pgninforesultdiv').html (self.result);
		self.iddiv = Div ().ac ('pgninfoiddiv').html (self.id);
		self.iddiv.ae ('mousedown', self.idclicked);
		var mescore = self.mescore ();
		if (mescore == 1) {
			self.ac ('pgninfowhitewin');
		}
		else if (mescore == 0) {
			self.ac ('pgninfoblackwin');
		}
		else {
			self.ac ('pgninfodraw');
		}
		self.a ([self.tcdiv, self.whitediv, self.whiteelodiv, self.blackdiv, self.blackelodiv, self.resultdiv, self.iddiv]);
		if (self.id == localStorage.getItem ('pgninfo/idclicked')) {
			self.bds ('dashed').bdw ('6').bdc ('#00f');
		}
		return self;
	});},
	get setcontent () {return __get__ (this, function (self, content) {
		self.content = content;
		self.parsecontent ();
		return self.build ();
	});}
});
export var CandleStickChart =  __class__ ('CandleStickChart', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, args) {
		__super__ (CandleStickChart, '__init__') (self, 'div');
		self.BARWIDTH = args.py_get ('barwidth', 20);
		self.BARSEPARATION = int (self.BARWIDTH * 1.1);
		self.YHEIGHT = args.py_get ('yheight', 2);
		self.CLUSTER = args.py_get ('cluster', 50);
		self.data = args.py_get ('data', []);
		var first = true;
		for (var d of self.data) {
			var mind = d ['min'];
			var maxd = d ['max'];
			if (first) {
				var miny = mind;
				var maxy = maxd;
				var first = false;
			}
			else {
				if (mind < miny) {
					var miny = mind;
				}
				if (maxd > maxy) {
					var maxy = maxd;
				}
			}
		}
		var miny = miny - __mod__ (miny, self.CLUSTER);
		var maxy = (maxy - __mod__ (maxy, self.CLUSTER)) + self.CLUSTER;
		var chartwidth = self.BARSEPARATION * len (self.data);
		self.w (chartwidth);
		var range = maxy - miny;
		var chartheight = range * self.YHEIGHT;
		self.h (chartheight);
		self.pr ().bc ('#ffc');
		for (var i = 1; i < range / self.CLUSTER; i++) {
			var rt = maxy - i * self.CLUSTER;
			var yt = (i * self.CLUSTER) * self.YHEIGHT;
			var linediv = Div ().pa ().t (yt).l (0).w (chartwidth).h (1).bc ('#000');
			var ratingdiv = Div ().pa ().t (yt + 5).ms ().html (rt);
			self.a ([linediv, ratingdiv]);
		}
		var i = 0;
		for (var d of self.data) {
			var mind = d ['min'];
			var minr = range - (mind - miny);
			var mint = minr * self.YHEIGHT;
			var maxd = d ['max'];
			var maxr = range - (maxd - miny);
			var maxt = maxr * self.YHEIGHT;
			var open = d ['open'];
			var openr = range - (open - miny);
			var opent = openr * self.YHEIGHT;
			var close = d ['close'];
			var closer = range - (close - miny);
			var closet = closer * self.YHEIGHT;
			var xcoord = i * self.BARSEPARATION;
			var bardiv = Div ().pa ().t (min (opent, closet)).l (xcoord + 1).w (self.BARWIDTH).h (abs (opent - closet)).bc (cpick (opent < closet, '#f00', '#0f0'));
			var minmaxdiv = Div ().pa ().t (maxt).l (((xcoord + int (self.BARWIDTH / 2)) - 1) + 1).w (2).h (mint - maxt).bc ('#007');
			self.a ([minmaxdiv, bardiv]);
			i++;
		}
	});}
});
export var PgnList =  __class__ ('PgnList', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, parent) {
		__super__ (PgnList, '__init__') (self, 'div');
		self.parent = parent;
	});},
	get tobookmark () {return __get__ (this, function (self) {
		if (self.bookmarkedpi) {
			self.bookmarkedpi.e.scrollIntoView (dict ({'block': 'center', 'inline': 'center'}));
		}
	});},
	get build () {return __get__ (this, function (self) {
		self.x ();
		var first = true;
		var dateinfos = [];
		self.bookmarkedpi = null;
		for (var gamecontent of self.gamecontents) {
			var pi = PgnInfo (self.parent, self).setcontent (gamecontent);
			if (pi.id == localStorage.getItem ('pgninfo/idclicked')) {
				self.bookmarkedpi = pi;
			}
			self.a (pi);
			var mri = pi.meratinginfo ();
			if (mri) {
				var rating = 1500;
				var ratingdiff = 0;
				try {
					var rating = int (mri [0]);
				}
				catch (__except0__) {
					// pass;
				}
				try {
					var ratingdiff = int (mri [1]);
				}
				catch (__except0__) {
					// pass;
				}
				var newrating = rating + ratingdiff;
				if (first) {
					var currdate = pi.utcdate;
					var minrating = min (rating, newrating);
					var maxrating = max (rating, newrating);
					var openrating = rating;
					var closerating = newrating;
					var first = false;
				}
				else {
					if (!(currdate == pi.utcdate)) {
						dateinfos.push (dict ({'date': currdate, 'min': minrating, 'max': maxrating, 'open': openrating, 'close': closerating}));
						var minrating = min (rating, newrating);
						var maxrating = max (rating, newrating);
						var closerating = newrating;
						var currdate = pi.utcdate;
					}
					if (rating > maxrating) {
						var maxrating = rating;
					}
					if (rating < minrating) {
						var minrating = rating;
					}
					if (newrating > maxrating) {
						var maxrating = newrating;
					}
					if (newrating < minrating) {
						var minrating = newrating;
					}
					var openrating = rating;
				}
			}
		}
		self.parent.chartdiv.x ().a (CandleStickChart (dict ({'barwidth': self.parent.BARWIDTH, 'yheight': self.parent.RATINGHEIGHT, 'cluster': self.parent.RATINGCLUSTER, 'data': dateinfos})));
		var table = Table ();
		var tr = Tr ();
		tr.a (Td ('chartdataheadtd').html ('Date'));
		tr.a (Td ('chartdataheadtd').html ('Min'));
		tr.a (Td ('chartdataheadtd').html ('Max'));
		tr.a (Td ('chartdataheadtd').html ('Open'));
		tr.a (Td ('chartdataheadtd').html ('Close'));
		table.a (tr);
		for (var info of dateinfos) {
			var tr = Tr ();
			tr.a (Td ('chartdatatd').html (info ['date']));
			tr.a (Td ('chartdatatd').html (info ['min']));
			tr.a (Td ('chartdatatd').html (info ['max']));
			tr.a (Td ('chartdatatd').html (info ['open']));
			tr.a (Td ('chartdatatd').html (info ['close']));
			table.a (tr);
		}
		self.parent.chartdiv.a (table);
		return self;
	});},
	get setcontent () {return __get__ (this, function (self, content) {
		self.content = content;
		self.gamecontents = self.content.py_split ('\n\n\n').__getslice__ (0, -(1), 1);
		return self.build ();
	});}
});
export var PgnText =  __class__ ('PgnText', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (PgnText, '__init__') (self, 'div');
		self.ac ('pgntextcontainer');
		self.textarea = TextArea ();
		self.a (self.textarea);
		self.resize (600, 300);
	});},
	get setpgn () {return __get__ (this, function (self, pgn) {
		self.textarea.setText (pgn);
		return self;
	});},
	get getpgn () {return __get__ (this, function (self) {
		return self.textarea.getText ();
	});},
	get resize () {return __get__ (this, function (self, width, height) {
		self.width = width;
		self.height = height;
		self.textarea.w (width - 15).h (height - 15);
		return self;
	});}
});

//# sourceMappingURL=basicboard.map