// Transcrypt'ed from Python, 2019-04-05 08:47:04
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {dateInputStrToDate, dateToDateInputStr, getitem, texttofloat} from './utils.js';
import {Button, CheckBox, ColorInput, ComboBox, DateInput, Div, Label, Radio, Slider, TextArea, TextInput, e} from './dom.js';
var __name__ = 'schema';
export var clipboard = null;
export var SCHEMA_SCALAR_DEFAULT_VALUE = '';
export var SCHEMA_SLIDER_DEFAULT_VALUE = 0;
export var SCHEMA_SLIDER_DEFAULT_MINVALUE = 0;
export var SCHEMA_SLIDER_DEFAULT_MAXVALUE = 100;
export var SCHEMA_SLIDER_DEFAULT_VALUESTEP = 1;
export var SCHEMA_DEFAULT_ARGS = [['kind', 'collection'], ['disposition', 'dict'], ['key', null], ['value', SCHEMA_SCALAR_DEFAULT_VALUE], ['minvalue', SCHEMA_SLIDER_DEFAULT_MINVALUE], ['maxvalue', SCHEMA_SLIDER_DEFAULT_MAXVALUE], ['valuestep', SCHEMA_SLIDER_DEFAULT_VALUESTEP], ['selected', false], ['childsarg', []], ['childsopened', false]];
export var iscollection = function (schema) {
	if (schema) {
		return schema.kind == 'collection';
	}
	return false;
};
export var iscombo = function (schema) {
	if (iscollection (schema)) {
		return schema.disposition == 'combo';
	}
	return false;
};
export var isradio = function (schema) {
	if (iscollection (schema)) {
		return schema.disposition == 'radio';
	}
	return false;
};
export var isdict = function (schema) {
	if (iscollection (schema)) {
		return schema.disposition == 'dict';
	}
	return false;
};
export var islist = function (schema) {
	if (iscollection (schema)) {
		return schema.disposition == 'list';
	}
	return false;
};
export var Schema =  __class__ ('Schema', [e], {
	__module__: __name__,
	get copydivclicked () {return __get__ (this, function (self) {
		clipboard = self.toargs ();
	});},
	get openbuttonclicked () {return __get__ (this, function (self) {
		self.childsopened = !(self.childsopened);
		self.build ();
	});},
	get createcombochanged () {return __get__ (this, function (self, v) {
		if (v == 'scalar') {
			var sch = Schema (dict ({'parent': self, 'kind': 'scalar', 'disposition': 'string'}));
		}
		else if (v == 'slider') {
			var sch = Schema (dict ({'parent': self, 'kind': 'scalar', 'disposition': 'slider'}));
		}
		else if (v == 'checkbox') {
			var sch = Schema (dict ({'parent': self, 'kind': 'scalar', 'disposition': 'checkbox'}));
		}
		else if (v == 'textarea') {
			var sch = Schema (dict ({'parent': self, 'kind': 'scalar', 'disposition': 'textarea'}));
		}
		else if (v == 'date') {
			var sch = Schema (dict ({'parent': self, 'kind': 'scalar', 'disposition': 'date', 'value': dateToDateInputStr (new Date ())}));
		}
		else if (v == 'color') {
			var sch = Schema (dict ({'parent': self, 'kind': 'scalar', 'disposition': 'color', 'value': '#ffffff'}));
		}
		else if (v == 'dict') {
			var sch = Schema (dict ({'parent': self, 'kind': 'collection', 'disposition': 'dict'}));
		}
		else if (v == 'list') {
			var sch = Schema (dict ({'parent': self, 'kind': 'collection', 'disposition': 'list'}));
		}
		else if (v == 'combo') {
			var sch = Schema (dict ({'parent': self, 'kind': 'collection', 'disposition': 'combo'}));
		}
		else if (v == 'radio') {
			var sch = Schema (dict ({'parent': self, 'kind': 'collection', 'disposition': 'radio'}));
		}
		else if (v == 'process') {
			var sch = Schema (dict ({'parent': self, 'kind': 'collection', 'disposition': 'dict', 'childsopened': true, 'childsarg': [dict ({'kind': 'scalar', 'disposition': 'string', 'key': 'key'}), dict ({'kind': 'scalar', 'disposition': 'string', 'key': 'displayname'}), dict ({'kind': 'scalar', 'disposition': 'string', 'key': 'command'}), dict ({'kind': 'collection', 'disposition': 'list', 'key': 'command_args'})]}));
		}
		self.childs.append (sch);
		self.build ();
	});},
	get stringvalueinputchanged () {return __get__ (this, function (self) {
		self.value = self.stringvalueinput.getText ();
	});},
	get keyinputchanged () {return __get__ (this, function (self) {
		self.key = self.keyinput.getText ();
	});},
	get deletechild () {return __get__ (this, function (self, child) {
		var newchilds = [];
		for (var currchild of self.childs) {
			if (!(currchild == child)) {
				newchilds.append (currchild);
			}
			else {
				clipboard = child.toargs ();
			}
		}
		self.childs = newchilds;
		self.build ();
	});},
	get deletedivclicked () {return __get__ (this, function (self) {
		self.parent.deletechild (self);
	});},
	get pastebuttonpushed () {return __get__ (this, function (self) {
		if (clipboard) {
			clipboard ['parent'] = self;
			var sch = Schema (clipboard);
			self.childs.append (sch);
			self.build ();
		}
	});},
	get setslidervalue () {return __get__ (this, function (self, value, doslider) {
		if (typeof doslider == 'undefined' || (doslider != null && doslider.hasOwnProperty ("__kwargtrans__"))) {;
			var doslider = true;
		};
		self.value = float (value);
		if (self.value < self.minvalue) {
			self.value = self.minvalue;
		}
		if (self.value > self.maxvalue) {
			self.value = self.maxvalue;
		}
		if (doslider) {
			self.slider.sv (self.value);
		}
		self.slidervalueinput.setText ('{}'.format (self.value));
	});},
	get minvalueinputchanged () {return __get__ (this, function (self) {
		self.minvalue = texttofloat (self.minvalueinput.getText (), self.minvalue);
		self.slider.setmin (self.minvalue);
		self.setslidervalue (self.value);
	});},
	get maxvalueinputchanged () {return __get__ (this, function (self) {
		self.maxvalue = texttofloat (self.maxvalueinput.getText (), self.maxvalue);
		self.slider.setmax (self.maxvalue);
		self.setslidervalue (self.value);
	});},
	get sliderstepinputhchanged () {return __get__ (this, function (self) {
		self.valuestep = texttofloat (self.sliderstepinput.getText (), self.valuestep);
		self.slider.setstep (self.valuestep);
		self.setslidervalue (self.value);
	});},
	get sliderchanged () {return __get__ (this, function (self) {
		self.setslidervalue (self.slider.v (), false);
	});},
	get slidervalueinputchanged () {return __get__ (this, function (self) {
		self.setslidervalue (texttofloat (self.slidervalueinput.getText (), self.value));
	});},
	get checkboxchanged () {return __get__ (this, function (self) {
		self.value = self.checkbox.getchecked ();
	});},
	get combocheckboxchanged () {return __get__ (this, function (self) {
		self.selected = self.combocheckbox.getchecked ();
	});},
	get radioradioclicked () {return __get__ (this, function (self) {
		for (var child of self.parent.childs) {
			var isme = child == self;
			child.radioradio.setchecked (isme);
			child.selected = isme;
			print (isme);
		}
	});},
	get textareachanged () {return __get__ (this, function (self) {
		self.value = self.textarea.getText ();
	});},
	get setdatelabel () {return __get__ (this, function (self) {
		self.datelabel.html ('{}'.format (dateInputStrToDate (self.value).getTime ()));
	});},
	get datechanged () {return __get__ (this, function (self) {
		self.value = self.date.v ();
		self.setdatelabel ();
	});},
	get colorchanged () {return __get__ (this, function (self) {
		self.value = self.color.v ();
		self.colorlabel.html (self.value);
	});},
	get build () {return __get__ (this, function (self) {
		self.x ().ac ('schema');
		self.itemdiv = Div (['item', self.disposition]);
		self.valuediv = Div (['value', self.disposition]);
		if (self.kind == 'scalar') {
			if (self.disposition == 'dict') {
				if (py_typeof (self.value) == bool) {
					self.disposition = 'checkbox';
				}
				else {
					self.disposition = 'string';
				}
			}
			if (self.disposition == 'string') {
				self.stringvalueinput = TextInput ().ac ('string').setText (self.value);
				self.stringvalueinput.ae ('keyup', self.stringvalueinputchanged);
				self.valuediv.a (self.stringvalueinput);
			}
			else if (self.disposition == 'slider') {
				self.slidervalueinput = TextInput ().ac ('slidervalue').setText (self.value).setchangecallback (self.slidervalueinputchanged);
				self.minvalueinput = TextInput ().ac ('sliderminmax').setText (self.minvalue).setchangecallback (self.minvalueinputchanged);
				self.slider = Slider ().ac ('sliderslider').ae ('change', self.sliderchanged);
				self.maxvalueinput = TextInput ().ac ('sliderminmax').setText (self.maxvalue).setchangecallback (self.maxvalueinputchanged);
				self.sliderstepinput = TextInput ().ac ('sliderstep').setText (self.valuestep).setchangecallback (self.sliderstepinputhchanged);
				self.valuediv.a ([self.slidervalueinput, self.minvalueinput, self.slider, self.maxvalueinput, self.sliderstepinput]);
				self.slider.setmin (self.minvalue).setmax (self.maxvalue).setstep (self.valuestep);
				self.setslidervalue (texttofloat (self.value, SCHEMA_SLIDER_DEFAULT_VALUE));
			}
			else if (self.disposition == 'checkbox') {
				self.value = self.value === true;
				self.checkbox = CheckBox ().ac ('checkbox').setchecked (self.value).ae ('change', self.checkboxchanged);
				self.valuediv.a (self.checkbox);
			}
			else if (self.disposition == 'textarea') {
				self.textarea = TextArea ().ac ('textarea').setText (self.value);
				self.textarea.ae (['keyup', 'change'], self.textareachanged);
				self.valuediv.a (self.textarea);
			}
			else if (self.disposition == 'date') {
				self.date = DateInput ().ac ('date').sv (self.value);
				self.date.ae (['keyup', 'change'], self.datechanged);
				self.datelabel = Label ().ac ('datelabel');
				self.setdatelabel ();
				self.valuediv.a ([self.date, self.datelabel]);
			}
			else if (self.disposition == 'color') {
				self.color = ColorInput ().ac ('color').sv (self.value);
				self.color.ae (['keyup', 'change'], self.colorchanged);
				self.colorlabel = Label ().ac ('colorlabel').html (self.value);
				self.valuediv.a ([self.color, self.colorlabel]);
			}
		}
		self.helpdiv = Div (['box', 'help']).html ('?');
		self.copydiv = Div (['box', 'copy']).html ('C').ae ('mousedown', self.copydivclicked);
		if (isdict (self.parent)) {
			self.keydiv = Div ('key');
			self.keyinput = TextInput ().ac ('key').setText (self.key);
			self.keyinput.ae ('keyup', self.keyinputchanged);
			self.keydiv.a (self.keyinput);
			self.itemdiv.a (self.keydiv);
		}
		if (iscombo (self.parent)) {
			self.combodiv = Div (['box', 'combo']);
			self.combocheckbox = CheckBox ().ac ('checkbox').setchecked (self.selected).ae ('change', self.combocheckboxchanged);
			self.combodiv.a (self.combocheckbox);
			self.itemdiv.a (self.combodiv);
		}
		if (isradio (self.parent)) {
			self.radiodiv = Div (['box', 'radio']);
			self.radioradio = Radio ().ac ('radio').setchecked (self.selected).ae ('mousedown', self.radioradioclicked);
			self.radiodiv.a (self.radioradio);
			self.itemdiv.a (self.radiodiv);
		}
		self.itemdiv.a ([self.valuediv, self.helpdiv, self.copydiv]);
		if (self.parent) {
			self.deletediv = Div (['box', 'delete']).html ('X').ae ('mousedown', self.deletedivclicked);
			self.itemdiv.a (self.deletediv);
		}
		if (iscollection (self)) {
			self.openbutton = Div ('openbutton').ae ('mousedown', self.openbuttonclicked);
			self.valuediv.a (self.openbutton);
		}
		self.childsdiv = Div ('childs');
		if (self.childsopened) {
			self.creatediv = Div ('create');
			var cc = self.createcombo;
			self.createcombo = ComboBox ().setoptions ([['create', 'Create new'], ['scalar', 'Scalar'], ['slider', 'Slider'], ['checkbox', 'Checkbox'], ['textarea', 'Textarea'], ['date', 'Date'], ['color', 'Color'], ['dict', 'Dict'], ['list', 'List'], ['combo', 'Combo'], ['radio', 'Radio'], ['process', 'Process']], 'create', self.createcombochanged).ac ('createcombo');
			self.creatediv.a (self.createcombo);
			self.pastebutton = Button ('Paste', self.pastebuttonpushed).ac ('pastebutton');
			self.creatediv.a (self.pastebutton);
			self.childsdiv.a (self.creatediv);
			for (var child of self.childs) {
				self.childsdiv.a (child);
			}
		}
		self.container = Div ('container');
		self.container.a ([self.itemdiv, self.childsdiv]);
		self.a (self.container);
		return self;
	});},
	get tojsontext () {return __get__ (this, function (self) {
		return JSON.stringify (self.toargs (), null, 2);
	});},
	get toargs () {return __get__ (this, function (self) {
		var args = dict ({});
		for (var arg of SCHEMA_DEFAULT_ARGS) {
			args [arg [0]] = self [arg [0]];
		}
		args ['childsarg'] = [];
		for (var child of self.childs) {
			args ['childsarg'].append (child.toargs ());
		}
		return args;
	});},
	get __init__ () {return __get__ (this, function (self, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		__super__ (Schema, '__init__') (self, 'div');
		self.parent = getitem (args, 'parent', null);
		for (var arg of SCHEMA_DEFAULT_ARGS) {
			self [arg [0]] = getitem (args, arg [0], arg [1]);
		}
		self.childs = [];
		for (var childarg of self.childsarg) {
			childarg ['parent'] = self;
			var child = Schema (childarg);
			self.childs.append (child);
		}
		self.build ();
	});},
	get getchildbykey () {return __get__ (this, function (self, key) {
		for (var child of self.childs) {
			if (child.key == key) {
				return child;
			}
		}
		return null;
	});},
	get getpathrec () {return __get__ (this, function (self, sch, pathparts) {
		if (!(sch)) {
			return null;
		}
		if (len (pathparts) == 0) {
			return sch;
		}
		var key = pathparts [0];
		var pathparts = pathparts.__getslice__ (1, null, 1);
		if (self.disposition == 'dict') {
			return self.getpathrec (self.getchildbykey (key), pathparts);
		}
		else {
			return null;
		}
	});},
	get getpath () {return __get__ (this, function (self, path) {
		if (path == '') {
			var pathparts = [];
		}
		else {
			var pathparts = path.py_split ('/');
		}
		return self.getpathrec (self, pathparts);
	});}
});

//# sourceMappingURL=schema.map