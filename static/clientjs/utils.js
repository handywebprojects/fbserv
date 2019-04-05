// Transcrypt'ed from Python, 2019-04-05 10:12:58
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = 'utils';
export var MODE = function () {
	if (__in__ ('localhost', window.location.host)) {
		return 'dev';
	}
	return 'prod';
};
export var IS_DEV = function () {
	return MODE () == 'dev';
};
export var IS_PROD = function () {
	return MODE () == 'prod';
};
export var effpath = function (path) {
	return (path + ':') + MODE ();
};
export var queryparams = dict ({});
try {
	var querystring = window.location.search.slice (1);
	var qsparts = querystring.py_split ('&');
	for (var part of qsparts) {
		var subparts = part.py_split ('=');
		queryparams [subparts [0]] = subparts [1];
	}
}
catch (__except0__) {
	print ('could not parse query string');
}
print ('queryparams', queryparams);
export var seed = 1;
export var random = function () {
	seed++;
	var x = Math.sin (seed) * 10000;
	return x - Math.floor (x);
};
export var setseed = function (newseed) {
	seed = newseed;
};
export var MATE_SCORE = 10000;
export var MATE_LIMIT = MATE_SCORE * 0.9;
export var WINNING_MOVE_LIMIT = 1000;
export var DOUBLE_EXCLAM_LIMIT = 500;
export var EXCLAM_LIMIT = 350;
export var PROMISING_LIMIT = 250;
export var INTERESTING_LIMIT = 150;
export var DRAWISH_LIMIT = 80;
export var scoreverbal = function (score) {
	if (abs (score) < MATE_LIMIT) {
		return str (score);
	}
	if (score >= 0) {
		return '#{}'.format (MATE_SCORE - score);
	}
	return '#{}'.format (-(MATE_SCORE) - score);
};
export var scorecolor = function (score) {
	if (score > MATE_LIMIT) {
		return '#0f0';
	}
	if (score > WINNING_MOVE_LIMIT) {
		return '#0e0';
	}
	if (score > DOUBLE_EXCLAM_LIMIT) {
		return '#0c0';
	}
	if (score > EXCLAM_LIMIT) {
		return '#0a0';
	}
	if (score > PROMISING_LIMIT) {
		return '#090';
	}
	if (score > INTERESTING_LIMIT) {
		return '#070';
	}
	if (score > DRAWISH_LIMIT) {
		return '#050';
	}
	if (score > 0) {
		return '#033';
	}
	if (score > -(DRAWISH_LIMIT)) {
		return '#330';
	}
	if (score > -(INTERESTING_LIMIT)) {
		return '#500';
	}
	if (score > -(PROMISING_LIMIT)) {
		return '#900';
	}
	if (score > -(EXCLAM_LIMIT)) {
		return '#a00';
	}
	if (score > -(DOUBLE_EXCLAM_LIMIT)) {
		return '#c00';
	}
	if (score > WINNING_MOVE_LIMIT) {
		return '#e00';
	}
	return '#f00';
};
export var uci_variant_to_variantkey = function (uci_variant, chess960) {
	if (typeof chess960 == 'undefined' || (chess960 != null && chess960.hasOwnProperty ("__kwargtrans__"))) {;
		var chess960 = false;
	};
	if (uci_variant == 'chess') {
		if (chess960) {
			return 'chess960';
		}
		else {
			return 'standard';
		}
	}
	if (uci_variant == 'giveaway') {
		return 'antichess';
	}
	if (uci_variant == 'kingofthehill') {
		return 'kingOfTheHill';
	}
	if (uci_variant == 'racingkings') {
		return 'racingKings';
	}
	if (uci_variant == '3check') {
		return 'threeCheck';
	}
	return uci_variant;
};
export var getglobalcssvar = function (key) {
	return getComputedStyle (window.document.documentElement).getPropertyValue (key);
};
export var getglobalcssvarpxint = function (key, py_default) {
	try {
		var px = getglobalcssvar (key);
		var pxint = int (px.py_replace ('px', ''));
		return pxint;
	}
	catch (__except0__) {
		return py_default;
	}
};
export var View =  __class__ ('View', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, callback, value) {
		if (typeof value == 'undefined' || (value != null && value.hasOwnProperty ("__kwargtrans__"))) {;
			var value = null;
		};
		self.callback = callback;
		self.value = value;
	});},
	get py_get () {return __get__ (this, function (self) {
		return self.value;
	});},
	get set () {return __get__ (this, function (self, value) {
		self.value = value;
		self.callback ();
	});}
});
export var Vect =  __class__ ('Vect', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, x, y) {
		try {
			self.x = float (x);
			self.y = float (y);
		}
		catch (__except0__) {
			self.x = 0.0;
			self.y = 0.0;
			print ('vect init failed on', x, y);
		}
	});},
	get p () {return __get__ (this, function (self, v) {
		return Vect (self.x + v.x, self.y + v.y);
	});},
	get s () {return __get__ (this, function (self, s) {
		return Vect (self.x * s, self.y * s);
	});},
	get m () {return __get__ (this, function (self, v) {
		return self.p (v.s (-(1)));
	});},
	get copy () {return __get__ (this, function (self) {
		return Vect (self.x, self.y);
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return 'Vect[x: {}, y: {}]'.format (self.x, self.y);
	});}
});
export var dateToDateInputStr = function (dateObj) {
	var month = dateObj.getUTCMonth () + 1;
	var day = dateObj.getUTCDate ();
	var year = dateObj.getUTCFullYear ();
	return '{}-{}-{}'.format (year, pad (month, 2), pad (day, 2));
};
export var dateInputStrToDate = function (dateInputStr) {
	var parts = dateInputStr.py_split ('-');
	var year = parseInt (parts [0]);
	var month = parseInt (parts [1]) - 1;
	var day = parseInt (parts [2]);
	return new Date (year, month, day);
};
export var xor = function (b1, b2) {
	if (b1 && b2) {
		return false;
	}
	if (b1 || b2) {
		return true;
	}
	return false;
};
export var pad = function (x, p) {
	var s = '{}'.format (x);
	while (len (s) < p) {
		var s = '0' + s;
	}
	return s;
};
export var texttofloat = function (text, py_default) {
	try {
		var f = float (text);
	}
	catch (__except0__) {
		var f = py_default;
	}
	if (f == null) {
		return py_default;
	}
	return f;
};
export var allchilds = function (node, childs) {
	if (typeof childs == 'undefined' || (childs != null && childs.hasOwnProperty ("__kwargtrans__"))) {;
		var childs = [];
	};
	var child = node.firstChild;
	while (!(typeof (child) == 'undefined')) {
		if (child) {
			childs.append (child);
			var childs = allchilds (child, childs);
			var child = child.nextSibling;
		}
		else {
			break;
		}
	}
	return childs;
};
export var getext = function (dir) {
	var parts = dir.py_split ('.');
	return parts [len (parts) - 1];
};
export var escapeHTML = function (html) {
	return html.py_replace ('&', '&amp;').py_replace ('<', '&lt;').py_replace ('>', '&gt;').py_replace ('\n', '<br>');
};
export var getrec = function (path, currobj, py_default) {
	if (typeof py_default == 'undefined' || (py_default != null && py_default.hasOwnProperty ("__kwargtrans__"))) {;
		var py_default = null;
	};
	var parts = path.py_split ('/');
	var key = parts [0];
	if (currobj ['disposition'] == 'dict') {
		for (var child of currobj ['childsarg']) {
			if (child ['key'] == key) {
				if (len (parts) == 1) {
					return child ['value'];
				}
				else {
					return getrec ('/'.join (parts.__getslice__ (1, null, 1)), child, py_default);
				}
			}
		}
	}
	return py_default;
};
export var getrecm = function (path, obj, py_default) {
	var value = getrec (path, obj, '__none__');
	if (value === '__none__') {
		return getrec (effpath (path), obj, py_default);
	}
	else {
		return value;
	}
};
export var getitem = function (obj, key, py_default) {
	if (__in__ (key, obj)) {
		return obj [key];
	}
	return py_default;
};
export var cpick = function (cond, valuetrue, valuefalse) {
	if (cond) {
		return valuetrue;
	}
	return valuefalse;
};
export var getelse = function (value, elsevalue) {
	if (value) {
		return value;
	}
	return elsevalue;
};
export var ce = function (tag) {
	return document.createElement (tag);
};
export var ge = function (id) {
	return document.getElementById (id);
};
export var getScrollBarWidth = function () {
	var outer = document.createElement ('div');
	outer.style.visibility = 'hidden';
	outer.style.width = '100px';
	outer.style.msOverflowStyle = 'scrollbar';
	document.body.appendChild (outer);
	var widthNoScroll = outer.offsetWidth;
	outer.style.overflow = 'scroll';
	var inner = document.createElement ('div');
	inner.style.width = '100%';
	outer.appendChild (inner);
	var widthWithScroll = inner.offsetWidth;
	outer.parentNode.removeChild (outer);
	return widthNoScroll - widthWithScroll;
};

//# sourceMappingURL=utils.map