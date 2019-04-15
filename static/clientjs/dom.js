// Transcrypt'ed from Python, 2019-04-15 09:32:12
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {ce} from './utils.js';
var __name__ = 'dom';
export var e =  __class__ ('e', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, tag) {
		self.e = ce (tag);
	});},
	get ta () {return __get__ (this, function (self, value) {
		self.e.style.textAlign = value;
		return self;
	});},
	get disp () {return __get__ (this, function (self, value) {
		self.e.style.display = value;
		return self;
	});},
	get fd () {return __get__ (this, function (self, value) {
		self.e.style.flexDirection = value;
		return self;
	});},
	get jc () {return __get__ (this, function (self, value) {
		self.e.style.justifyContent = value;
		return self;
	});},
	get bc () {return __get__ (this, function (self, color) {
		self.e.style.backgroundColor = color;
		return self;
	});},
	get bds () {return __get__ (this, function (self, value) {
		self.e.style.borderStyle = value;
		return self;
	});},
	get bdw () {return __get__ (this, function (self, value) {
		self.e.style.borderWidth = value + 'px';
		return self;
	});},
	get bdr () {return __get__ (this, function (self, value) {
		self.e.style.borderRadius = value + 'px';
		return self;
	});},
	get bdc () {return __get__ (this, function (self, value) {
		self.e.style.borderColor = value;
		return self;
	});},
	get curlyborder () {return __get__ (this, function (self) {
		return self.bds ('solid').bdw (1).bdc ('#777').bdr (20);
	});},
	get bci () {return __get__ (this, function (self, path) {
		self.e.style.backgroundImage = 'url({})'.format (path);
		return self;
	});},
	get cp () {return __get__ (this, function (self) {
		self.e.style.cursor = 'pointer';
		return self;
	});},
	get cm () {return __get__ (this, function (self) {
		self.e.style.cursor = 'move';
		return self;
	});},
	get c () {return __get__ (this, function (self, color) {
		self.e.style.color = color;
		return self;
	});},
	get zi () {return __get__ (this, function (self, zindex) {
		self.e.style.zIndex = zindex;
		return self;
	});},
	get op () {return __get__ (this, function (self, opacity) {
		self.e.style.opacity = opacity;
		return self;
	});},
	get ms () {return __get__ (this, function (self) {
		self.e.style.fontFamily = 'monospace';
		return self;
	});},
	get a () {return __get__ (this, function (self, element) {
		if (Array.isArray (element)) {
			for (var eitem of element) {
				self.e.appendChild (eitem.e);
			}
		}
		else {
			self.e.appendChild (element.e);
		}
		return self;
	});},
	get ai () {return __get__ (this, function (self, alignitems) {
		self.e.style.alignItems = alignitems;
		return self;
	});},
	get sa () {return __get__ (this, function (self, key, value) {
		self.e.setAttribute (key, value);
		return self;
	});},
	get ra () {return __get__ (this, function (self, key) {
		self.e.removeAttribute (key);
		return self;
	});},
	get srac () {return __get__ (this, function (self, cond, key, value) {
		if (cond) {
			self.sa (key, value);
		}
		else {
			self.ra (key);
		}
	});},
	get ga () {return __get__ (this, function (self, key) {
		return self.e.getAttribute (key);
	});},
	get sv () {return __get__ (this, function (self, value) {
		self.e.value = value;
		return self;
	});},
	get html () {return __get__ (this, function (self, value) {
		self.e.innerHTML = value;
		return self;
	});},
	get x () {return __get__ (this, function (self) {
		while (self.e.firstChild) {
			self.e.removeChild (self.e.firstChild);
		}
		return self;
	});},
	get w () {return __get__ (this, function (self, w) {
		self.e.style.width = w + 'px';
		return self;
	});},
	get mw () {return __get__ (this, function (self, w) {
		self.e.style.minWidth = w + 'px';
		return self;
	});},
	get maw () {return __get__ (this, function (self, w) {
		self.e.style.maxWidth = w + 'px';
		return self;
	});},
	get h () {return __get__ (this, function (self, h) {
		self.e.style.height = h + 'px';
		return self;
	});},
	get mh () {return __get__ (this, function (self, h) {
		self.e.style.minHeight = h + 'px';
		return self;
	});},
	get mah () {return __get__ (this, function (self, h) {
		self.e.style.maxHeight = h + 'px';
		return self;
	});},
	get t () {return __get__ (this, function (self, t) {
		self.e.style.top = t + 'px';
		return self;
	});},
	get l () {return __get__ (this, function (self, l) {
		self.e.style.left = l + 'px';
		return self;
	});},
	get pv () {return __get__ (this, function (self, v) {
		return self.l (v.x).t (v.y);
	});},
	get pa () {return __get__ (this, function (self) {
		self.e.style.position = 'absolute';
		return self;
	});},
	get pr () {return __get__ (this, function (self) {
		self.e.style.position = 'relative';
		return self;
	});},
	get mar () {return __get__ (this, function (self, mar) {
		self.e.style.margin = mar + 'px';
		return self;
	});},
	get pad () {return __get__ (this, function (self, pad) {
		self.e.style.padding = pad + 'px';
		return self;
	});},
	get ml () {return __get__ (this, function (self, ml) {
		self.e.style.marginLeft = ml + 'px';
		return self;
	});},
	get mr () {return __get__ (this, function (self, mr) {
		self.e.style.marginRight = mr + 'px';
		return self;
	});},
	get mt () {return __get__ (this, function (self, mt) {
		self.e.style.marginTop = mt + 'px';
		return self;
	});},
	get mb () {return __get__ (this, function (self, mb) {
		self.e.style.marginBottom = mb + 'px';
		return self;
	});},
	get pl () {return __get__ (this, function (self, pl) {
		self.e.style.paddingLeft = pl + 'px';
		return self;
	});},
	get par () {return __get__ (this, function (self, pr) {
		self.e.style.paddingRight = pr + 'px';
		return self;
	});},
	get pt () {return __get__ (this, function (self, pt) {
		self.e.style.paddingTop = pt + 'px';
		return self;
	});},
	get pb () {return __get__ (this, function (self, pb) {
		self.e.style.paddingBottom = pb + 'px';
		return self;
	});},
	get ac () {return __get__ (this, function (self, klass) {
		if (Array.isArray (klass)) {
			for (var classitem of klass) {
				self.e.classList.add (classitem);
			}
		}
		else {
			self.e.classList.add (klass);
		}
		return self;
	});},
	get acc () {return __get__ (this, function (self, cond, klass) {
		if (cond) {
			self.e.classList.add (klass);
		}
		return self;
	});},
	get rc () {return __get__ (this, function (self, klass) {
		if (Array.isArray (klass)) {
			for (var classitem of klass) {
				self.e.classList.remove (classitem);
			}
		}
		else {
			self.e.classList.remove (klass);
		}
		return self;
	});},
	get arc () {return __get__ (this, function (self, cond, klass) {
		if (cond) {
			self.e.classList.add (klass);
		}
		else {
			self.e.classList.remove (klass);
		}
		return self;
	});},
	get v () {return __get__ (this, function (self) {
		return self.e.value;
	});},
	get focusme () {return __get__ (this, function (self) {
		self.e.focus ();
		return self;
	});},
	get fl () {return __get__ (this, function (self, timeout) {
		if (typeof timeout == 'undefined' || (timeout != null && timeout.hasOwnProperty ("__kwargtrans__"))) {;
			var timeout = 50;
		};
		setTimeout (self.focusme, timeout);
		return self;
	});},
	get ae () {return __get__ (this, function (self, kind, callback, arg) {
		if (typeof arg == 'undefined' || (arg != null && arg.hasOwnProperty ("__kwargtrans__"))) {;
			var arg = false;
		};
		if (Array.isArray (kind)) {
			for (var kinditem of kind) {
				self.e.addEventListener (kinditem, callback, arg);
			}
		}
		else {
			self.e.addEventListener (kind, callback, arg);
		}
		return self;
	});},
	get disable () {return __get__ (this, function (self) {
		return self.sa ('disabled', true);
	});},
	get enable () {return __get__ (this, function (self) {
		return self.ra ('disabled');
	});},
	get able () {return __get__ (this, function (self, able) {
		if (able) {
			return self.enable ();
		}
		return self.disable ();
	});},
	get fs () {return __get__ (this, function (self, size) {
		self.e.style.fontSize = size + 'px';
		return self;
	});},
	get fst () {return __get__ (this, function (self, style) {
		self.e.style.fontStyle = style;
		return self;
	});},
	get ff () {return __get__ (this, function (self, family) {
		self.e.style.fontFamily = family;
		return self;
	});},
	get fw () {return __get__ (this, function (self, weight) {
		self.e.style.fontWeight = weight;
		return self;
	});}
});
export var Div =  __class__ ('Div', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, klass) {
		if (typeof klass == 'undefined' || (klass != null && klass.hasOwnProperty ("__kwargtrans__"))) {;
			var klass = null;
		};
		__super__ (Div, '__init__') (self, 'div');
		if (klass) {
			self.ac (klass);
		}
	});}
});
export var Span =  __class__ ('Span', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, klass) {
		if (typeof klass == 'undefined' || (klass != null && klass.hasOwnProperty ("__kwargtrans__"))) {;
			var klass = null;
		};
		__super__ (Span, '__init__') (self, 'span');
		if (klass) {
			self.ac (klass);
		}
	});}
});
export var Br =  __class__ ('Br', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (Br, '__init__') (self, 'br');
	});}
});
export var Table =  __class__ ('Table', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, klass) {
		if (typeof klass == 'undefined' || (klass != null && klass.hasOwnProperty ("__kwargtrans__"))) {;
			var klass = null;
		};
		__super__ (Table, '__init__') (self, 'table');
		if (klass) {
			self.ac (klass);
		}
	});}
});
export var Tr =  __class__ ('Tr', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, klass) {
		if (typeof klass == 'undefined' || (klass != null && klass.hasOwnProperty ("__kwargtrans__"))) {;
			var klass = null;
		};
		__super__ (Tr, '__init__') (self, 'tr');
		if (klass) {
			self.ac (klass);
		}
	});}
});
export var Td =  __class__ ('Td', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, klass) {
		if (typeof klass == 'undefined' || (klass != null && klass.hasOwnProperty ("__kwargtrans__"))) {;
			var klass = null;
		};
		__super__ (Td, '__init__') (self, 'td');
		if (klass) {
			self.ac (klass);
		}
	});}
});
export var Input =  __class__ ('Input', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, kind) {
		__super__ (Input, '__init__') (self, 'input');
		self.sa ('type', kind);
	});}
});
export var Button =  __class__ ('Button', [Input], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, caption, callback) {
		__super__ (Button, '__init__') (self, 'button');
		self.sa ('value', caption);
		self.ae ('mousedown', callback);
		self.ac ('button');
	});}
});
export var Select =  __class__ ('Select', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (Select, '__init__') (self, 'select');
	});}
});
export var Option =  __class__ ('Option', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, key, displayname, selected) {
		if (typeof selected == 'undefined' || (selected != null && selected.hasOwnProperty ("__kwargtrans__"))) {;
			var selected = false;
		};
		__super__ (Option, '__init__') (self, 'option');
		self.sa ('name', key);
		self.sa ('id', key);
		self.sv (key);
		self.html (displayname);
		if (selected) {
			self.sa ('selected', true);
		}
	});}
});
export var ComboBox =  __class__ ('ComboBox', [e], {
	__module__: __name__,
	get changed () {return __get__ (this, function (self) {
		if (self.changecallback) {
			self.changecallback (self.v ());
		}
	});},
	get __init__ () {return __get__ (this, function (self) {
		__super__ (ComboBox, '__init__') (self, 'select');
		self.ae ('change', self.changed);
	});},
	get setoptions () {return __get__ (this, function (self, options, selected, changecallback) {
		self.changecallback = changecallback;
		self.x ();
		for (var option of options) {
			self.a (Option (option [0], option [1], option [0] == selected));
		}
		return self;
	});}
});
export var Slider =  __class__ ('Slider', [Input], {
	__module__: __name__,
	get setmin () {return __get__ (this, function (self, min) {
		self.sa ('min', min);
		return self;
	});},
	get setmax () {return __get__ (this, function (self, max) {
		self.sa ('max', max);
		return self;
	});},
	get setstep () {return __get__ (this, function (self, step) {
		self.sa ('step', step);
		return self;
	});},
	get __init__ () {return __get__ (this, function (self) {
		__super__ (Slider, '__init__') (self, 'range');
	});}
});
export var CheckBox =  __class__ ('CheckBox', [Input], {
	__module__: __name__,
	get setchecked () {return __get__ (this, function (self, checked) {
		self.e.checked = checked;
		return self;
	});},
	get getchecked () {return __get__ (this, function (self) {
		return self.e.checked;
	});},
	get __init__ () {return __get__ (this, function (self, checked) {
		if (typeof checked == 'undefined' || (checked != null && checked.hasOwnProperty ("__kwargtrans__"))) {;
			var checked = false;
		};
		__super__ (CheckBox, '__init__') (self, 'checkbox');
		self.setchecked (checked);
	});}
});
export var Radio =  __class__ ('Radio', [Input], {
	__module__: __name__,
	get setchecked () {return __get__ (this, function (self, checked) {
		self.e.checked = checked;
		return self;
	});},
	get __init__ () {return __get__ (this, function (self, checked) {
		if (typeof checked == 'undefined' || (checked != null && checked.hasOwnProperty ("__kwargtrans__"))) {;
			var checked = false;
		};
		__super__ (Radio, '__init__') (self, 'radio');
		self.setchecked (checked);
	});}
});
export var DateInput =  __class__ ('DateInput', [Input], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, checked) {
		if (typeof checked == 'undefined' || (checked != null && checked.hasOwnProperty ("__kwargtrans__"))) {;
			var checked = false;
		};
		__super__ (DateInput, '__init__') (self, 'date');
	});}
});
export var ColorInput =  __class__ ('ColorInput', [Input], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, checked) {
		if (typeof checked == 'undefined' || (checked != null && checked.hasOwnProperty ("__kwargtrans__"))) {;
			var checked = false;
		};
		__super__ (ColorInput, '__init__') (self, 'color');
	});}
});
export var TextInput =  __class__ ('TextInput', [Input], {
	__module__: __name__,
	get onchange () {return __get__ (this, function (self) {
		self.rc ('textinputediting');
		if (self.changecallback) {
			self.changecallback ();
		}
	});},
	get onenter () {return __get__ (this, function (self) {
		if (self.entercallback) {
			self.entercallback ();
		}
	});},
	get onkeyup () {return __get__ (this, function (self, ev) {
		self.ac ('textinputediting');
		if (self.keyupcallback) {
			self.keyupcallback (self.ev.keyCode);
		}
		else if (ev.keyCode == 13) {
			self.onchange ();
			self.onenter ();
		}
		else if (self.editingcallback) {
			self.editingcallback ();
		}
	});},
	get setchangecallback () {return __get__ (this, function (self, changecallback) {
		self.changecallback = changecallback;
		return self;
	});},
	get setentercallback () {return __get__ (this, function (self, entercallback) {
		self.entercallback = entercallback;
		return self;
	});},
	get setkeyupcallback () {return __get__ (this, function (self, keyupcallback) {
		self.keyupcallback = keyupcallback;
		return self;
	});},
	get seteditingcallback () {return __get__ (this, function (self, editingcallback) {
		self.editingcallback = editingcallback;
		return self;
	});},
	get __init__ () {return __get__ (this, function (self) {
		__super__ (TextInput, '__init__') (self, 'text');
		self.ac ('textinput');
		self.changecallback = null;
		self.keyupcallback = null;
		self.ae ('change', self.onchange);
		self.ae ('keyup', self.onkeyup);
	});},
	get setText () {return __get__ (this, function (self, content) {
		self.sv (content);
		return self;
	});},
	get getText () {return __get__ (this, function (self) {
		return self.v ();
	});}
});
export var PasswordInput =  __class__ ('PasswordInput', [Input], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (PasswordInput, '__init__') (self, 'password');
	});},
	get setText () {return __get__ (this, function (self, content) {
		self.sv (content);
		return self;
	});},
	get getText () {return __get__ (this, function (self) {
		return self.v ();
	});}
});
export var TextArea =  __class__ ('TextArea', [e], {
	__module__: __name__,
	get insert () {return __get__ (this, function (self, content) {
		var ss = self.e.selectionStart;
		var se = self.e.selectionEnd;
		var v = self.v ();
		var nv = (v.substring (0, ss) + content) + v.substring (se);
		self.sv (nv);
		self.e.selectionEnd = ss + len (content);
	});},
	get keydowncallback () {return __get__ (this, function (self, ev) {
		if (ev.keyCode == 9) {
			ev.preventDefault ();
			self.insert ('\t');
		}
		else if (ev.keyCode == 13) {
			ev.preventDefault ();
			var lines = self.v ().substring (0, self.e.selectionStart).py_split ('\n');
			var chars = lines [len (lines) - 1].py_split ('');
			var t = '';
			for (var char of chars) {
				if (char == '\t') {
					t += '\t';
				}
				else {
					break;
				}
			}
			self.insert ('\n' + t);
		}
	});},
	get __init__ () {return __get__ (this, function (self) {
		__super__ (TextArea, '__init__') (self, 'textarea');
		self.ae ('keydown', self.keydowncallback);
	});},
	get setText () {return __get__ (this, function (self, content) {
		self.sv (content);
		return self;
	});},
	get getText () {return __get__ (this, function (self) {
		return self.v ();
	});}
});
export var Canvas =  __class__ ('Canvas', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, width, height) {
		__super__ (Canvas, '__init__') (self, 'canvas');
		self.width = width;
		self.height = height;
		self.sa ('width', self.width);
		self.sa ('height', self.height);
		self.ctx = self.e.getContext ('2d');
	});},
	get lineWidth () {return __get__ (this, function (self, linewidth) {
		self.ctx.lineWidth = linewidth;
	});},
	get strokeStyle () {return __get__ (this, function (self, strokestyle) {
		self.ctx.strokeStyle = strokestyle;
	});},
	get fillStyle () {return __get__ (this, function (self, fillstyle) {
		self.ctx.fillStyle = fillstyle;
	});},
	get fillRect () {return __get__ (this, function (self, tlv, brv) {
		self.ctx.fillRect (tlv.x, tlv.y, brv.m (tlv).x, brv.m (tlv).y);
	});},
	get py_clear () {return __get__ (this, function (self) {
		self.ctx.clearRect (0, 0, self.width, self.height);
	});},
	get drawline () {return __get__ (this, function (self, fromv, tov) {
		self.ctx.beginPath ();
		self.ctx.moveTo (fromv.x, fromv.y);
		self.ctx.lineTo (tov.x, tov.y);
		self.ctx.stroke ();
	});}
});
export var Form =  __class__ ('Form', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (Form, '__init__') (self, 'form');
	});}
});
export var P =  __class__ ('P', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		__super__ (P, '__init__') (self, 'p');
	});}
});
export var Label =  __class__ ('Label', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, content) {
		if (typeof content == 'undefined' || (content != null && content.hasOwnProperty ("__kwargtrans__"))) {;
			var content = null;
		};
		__super__ (Label, '__init__') (self, 'label');
		if (content) {
			self.html (content);
		}
	});}
});
export var FileInput =  __class__ ('FileInput', [Input], {
	__module__: __name__,
	get setmultiple () {return __get__ (this, function (self, multiple) {
		self.srac (multiple, 'multiple', true);
		return self;
	});},
	get getmultiple () {return __get__ (this, function (self) {
		return self.ga ('multiple');
	});},
	get setaccept () {return __get__ (this, function (self, accept) {
		return self.sa ('accept', accept);
	});},
	get getaccept () {return __get__ (this, function (self) {
		return self.ga ('accept');
	});},
	get files () {return __get__ (this, function (self) {
		return self.e.files;
	});},
	get __init__ () {return __get__ (this, function (self) {
		__super__ (FileInput, '__init__') (self, 'file');
	});}
});
export var Hlink =  __class__ ('Hlink', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, href, caption) {
		__super__ (Hlink, '__init__') (self, 'a');
		self.sa ('href', href);
		self.html (caption);
	});}
});
export var Labeled =  __class__ ('Labeled', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, label, element) {
		__super__ (Labeled, '__init__') (self, 'div');
		self.disp ('flex').ai ('center').bc ('#eee').curlyborder ();
		self.labeldiv = Div ().mar (1).pad (1).ml (6).html (label).ff ('monospace').bc ('#ffe');
		self.element = element;
		self.elementcontainer = Div ().mr (2).a (self.element);
		self.a ([self.labeldiv, self.elementcontainer]);
	});}
});

//# sourceMappingURL=dom.map