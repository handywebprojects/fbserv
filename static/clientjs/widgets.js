// Transcrypt'ed from Python, 2019-04-06 11:18:37
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {escapeHTML, getScrollBarWidth} from './utils.js';
import {Button, Div, FileInput, Form, Label, P, Span, TextInput, e} from './dom.js';
var __name__ = 'widgets';
export var MAX_LOGITEMS = 100;
export var SplitPane =  __class__ ('SplitPane', [e], {
	__module__: __name__,
	get resize () {return __get__ (this, function (self, width, height) {
		if (typeof width == 'undefined' || (width != null && width.hasOwnProperty ("__kwargtrans__"))) {;
			var width = null;
		};
		if (typeof height == 'undefined' || (height != null && height.hasOwnProperty ("__kwargtrans__"))) {;
			var height = null;
		};
		if (!(width === null)) {
			self.width = max (width, self.minwidth);
		}
		if (!(height === null)) {
			self.height = height;
		}
		self.contentheight = max (self.height - self.controlheight, self.mincontentheight);
		self.height = self.controlheight + self.contentheight;
		self.container.w (self.width).h (self.height);
		self.controlpanel.w (self.width).h (self.controlheight);
		self.contentdiv.w (self.width).h (self.contentheight);
		var sbw = getScrollBarWidth ();
		self.contentinnerwidth = self.width - sbw;
		self.contentinnerheight = self.contentheight - sbw;
		self.contentdiv.x ().a (self.contentelement);
		try {
			self.contentelement.resize (self.contentinnerwidth, self.contentinnerheight);
		}
		catch (__except0__) {
			// pass;
		}
		return self;
	});},
	get setcontentelement () {return __get__ (this, function (self, contentelement) {
		self.contentelement = contentelement;
		self.resize (self.width, self.height);
		return self;
	});},
	get resizetowindow () {return __get__ (this, function (self) {
		self.resize (window.innerWidth, window.innerHeight);
		return self;
	});},
	get __init__ () {return __get__ (this, function (self, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		__super__ (SplitPane, '__init__') (self, 'div');
		self.controlheight = args.py_get ('controlheight', 100);
		self.container = Div (['splitpane', 'container']);
		self.controlpanel = Div (['splitpane', 'controlpanel']);
		self.contentdiv = Div (['splitpane', 'contentdiv']);
		self.container.a ([self.controlpanel, self.contentdiv]);
		self.contentelement = Div ();
		self.minwidth = args.py_get ('minwidth', 400);
		self.mincontentheight = args.py_get ('mincontentheight', 200);
		self.resize (args.py_get ('width', 600), args.py_get ('height', 400));
		self.fillwindow = args.py_get ('fillwindow', false);
		if (self.fillwindow) {
			window.addEventListener ('resize', self.resizetowindow);
			self.resizetowindow ();
		}
		self.a (self.container);
	});}
});
export var Tab =  __class__ ('Tab', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, key, displayname, element, clickedcallback) {
		__super__ (Tab, '__init__') (self, 'div');
		self.key = key;
		self.displayname = displayname;
		self.element = element;
		self.clickedcallback = clickedcallback;
		self.container = Div (['tab', 'container', 'noselect']).html (displayname);
		self.a (self.container);
	});}
});
export var TabPane =  __class__ ('TabPane', [SplitPane], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		args ['controlheight'] = args.py_get ('controlheight', 35);
		__super__ (TabPane, '__init__') (self, args);
		self.tabmargin = args.py_get ('tabmargin', 5);
		self.tabpadding = args.py_get ('tabpadding', 5);
		self.tabs = args.py_get ('tabs', []);
		self.settabs (self.tabs);
		self.tabheight = self.controlheight - 2 * (self.tabmargin + self.tabpadding);
		self.tabfontsize = self.tabheight;
		self.id = args.py_get ('id', null);
		self.selected = args.py_get ('selected', null);
		if (self.id) {
			var stored = localStorage.getItem (self.id);
			if (stored) {
				self.selected = stored;
			}
		}
		self.build ();
		self.contentdiv.ae ('scroll', self.contentscrolled);
	});},
	get scrollpath () {return __get__ (this, function (self, which) {
		return 'tabpanecontentscroll/{}/{}/{}'.format (self.id, self.selected, which);
	});},
	get contentscrolled () {return __get__ (this, function (self) {
		localStorage.setItem (self.scrollpath ('left'), str (self.contentdiv.e.scrollLeft));
		localStorage.setItem (self.scrollpath ('top'), str (self.contentdiv.e.scrollTop));
	});},
	get setscroll () {return __get__ (this, function (self) {
		var scrollleftstr = localStorage.getItem (self.scrollpath ('left'));
		try {
			self.contentdiv.e.scrollLeft = int (scrollleftstr);
		}
		catch (__except0__) {
			// pass;
		}
		var scrolltopstr = localStorage.getItem (self.scrollpath ('top'));
		try {
			self.contentdiv.e.scrollTop = int (scrolltopstr);
		}
		catch (__except0__) {
			// pass;
		}
	});},
	get selectbykey () {return __get__ (this, function (self, key) {
		self.selected = key;
		if (self.id) {
			localStorage.setItem (self.id, self.selected);
		}
		self.build ();
	});},
	get tabclickedfactory () {return __get__ (this, function (self, tab) {
		var tabclicked = function () {
			self.selectbykey (tab.key);
			if (tab.clickedcallback) {
				tab.clickedcallback ();
			}
		};
		return tabclicked;
	});},
	get settabs () {return __get__ (this, function (self, tabs) {
		self.tabs = tabs;
		for (var tab of self.tabs) {
			tab.ae ('mousedown', self.tabclickedfactory (tab));
			tab.element.parenttabpane = self;
		}
		return self;
	});},
	get build () {return __get__ (this, function (self) {
		self.controlpanel.x ();
		for (var tab of self.tabs) {
			tab.container.h (self.tabheight).pad (self.tabpadding).pl (2 * self.tabpadding).par (2 * self.tabpadding);
			self.controlpanel.a (tab);
			tab.container.arc (tab.key == self.selected, 'selected').fs (self.tabfontsize);
			if (tab.key == self.selected) {
				self.setcontentelement (tab.element);
			}
		}
		self.setscroll ();
		return self;
	});}
});
export var FileUploader =  __class__ ('FileUploader', [e], {
	__module__: __name__,
	get fileinputchanged () {return __get__ (this, function (self) {
		self.files = self.fileinput.files ();
		self.handlefiles ();
	});},
	get preventdefaults () {return __get__ (this, function (self, ev) {
		ev.preventDefault ();
		ev.stopPropagation ();
	});},
	get highlight () {return __get__ (this, function (self) {
		self.droparea.ac ('highlight');
	});},
	get unhighlight () {return __get__ (this, function (self) {
		self.droparea.rc ('highlight');
	});},
	get log () {return __get__ (this, function (self, html) {
		self.infoitems.append (html);
		self.infoitems.reverse ();
		self.info.html ('<br>'.join (self.infoitems));
		self.infoitems.reverse ();
	});},
	get loginfo () {return __get__ (this, function (self, content) {
		try {
			var json = JSON.parse (content);
			if (json ['success']) {
				if (self.dirbrowseruploadedcallback) {
					self.dirbrowseruploadedcallback ();
					self.log ("Uploaded <span class='fileuploadfilename'>{}</span> .".format (json ['filename']));
				}
				else {
					var path = '/uploads/{}'.format (json ['savefilename']);
					self.log ("uploaded <span class='fileuploadfilename'>{}</span> <a href='{}' target='_blank' rel='noopener noreferrer'>{}</a> <br> <font size='2'> media link <a href='{}' target='_blank' rel='noopener noreferrer'>{}</a> </font>".format (json ['filename'], path, path, json ['medialink'], json ['medialink']));
				}
			}
			else {
				self.log ("<span class='fileuploaderror'>File upload failed. Status: {} .</span>".format (json ['status']));
			}
		}
		catch (__except0__) {
			self.log ('Error parsing response as JSON.');
		}
	});},
	get uploadfile () {return __get__ (this, function (self, file) {
		if (self.url === null) {
			print ('no upload url');
			return ;
		}
		var formdata = new FormData ();
		formdata.append ('files', file);
		formdata.append ('drive', self.drive);
		if (self.getuid) {
			formdata.append ('uid', self.getuid ());
		}
		if (self.dirbrowsergetpathcallback) {
			formdata.append ('dirpath', self.dirbrowsergetpathcallback ());
		}
		var args = {'method': 'POST', 'body': formdata};
		fetch (self.url, args).then ((function __lambda__ (response) {
			return response.text ().then ((function __lambda__ (content) {
				return self.loginfo (content);
			}), (function __lambda__ (err) {
				return self.loginfo (err);
			}));
		}), (function __lambda__ (err) {
			return self.loginfo (err);
		}));
	});},
	get handlefiles () {return __get__ (this, function (self, files) {
		if (typeof files == 'undefined' || (files != null && files.hasOwnProperty ("__kwargtrans__"))) {;
			var files = self.files;
		};
		for (var i = 0; i < files.length; i++) {
			print ('uploading file {}'.format (i));
			self.uploadfile (files.item (i));
		}
	});},
	get handledrop () {return __get__ (this, function (self, ev) {
		self.dt = ev.dataTransfer;
		self.files = self.dt.files;
		self.handlefiles ();
	});},
	get build () {return __get__ (this, function (self) {
		self.x ();
		self.droparea = Div ('fileuploaddroparea');
		self.form = Form ().ac ('fileuploadform');
		self.desc = P ().ac ('fileuploadp').html ('Upload {}s with the file dialog or by dragging and dropping them onto the dashed region'.format (self.acceptdisplay));
		self.fileinput = FileInput ().ac ('fileuploadfileelem').setmultiple (self.multiple).setaccept (self.accept);
		self.fileinput.sa ('id', 'fileinputelement');
		self.fileinput.ae ('change', self.fileinputchanged);
		self.button = Label ().ac ('fileuploadbutton').sa ('for', 'fileinputelement').html ('Select some {}s'.format (self.acceptdisplay));
		self.form.a ([self.desc, self.fileinput, self.button]);
		self.droparea.a (self.form);
		for (var eventname of ['dragenter', 'dragover', 'dragleave', 'drop']) {
			self.droparea.ae (eventname, self.preventdefaults);
		}
		for (var eventname of ['dragenter', 'dragover']) {
			self.droparea.ae (eventname, self.highlight);
		}
		for (var eventname of ['dragleave', 'drop']) {
			self.droparea.ae (eventname, self.unhighlight);
		}
		self.droparea.ae ('drop', self.handledrop);
		self.info = Div ('fileuploadinfo');
		self.infoitems = [];
		self.a ([self.droparea, self.info]);
	});},
	get __init__ () {return __get__ (this, function (self, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		__super__ (FileUploader, '__init__') (self, 'div');
		self.url = args.py_get ('url', null);
		self.multiple = args.py_get ('multiple', true);
		self.accept = args.py_get ('accept', 'image/*');
		self.acceptdisplay = args.py_get ('acceptdisplay', 'image');
		self.drive = args.py_get ('drive', false);
		self.dirbrowseruploadedcallback = args.py_get ('dirbrowseruploadedcallback', null);
		self.dirbrowsergetpathcallback = args.py_get ('dirbrowsergetpathcallback', null);
		self.getuid = args.py_get ('getuid', null);
		self.build ();
	});}
});
export var ProcessInput =  __class__ ('ProcessInput', [e], {
	__module__: __name__,
	get onenter () {return __get__ (this, function (self) {
		self.textinput.rc ('textinputediting');
		if (self.entercallback) {
			self.entercallback ();
		}
	});},
	get getText () {return __get__ (this, function (self) {
		return self.textinput.getText ();
	});},
	get setText () {return __get__ (this, function (self, content) {
		self.textinput.setText (content);
		return self;
	});},
	get __init__ () {return __get__ (this, function (self, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		__super__ (ProcessInput, '__init__') (self, 'div');
		self.container = Div ('processinput');
		self.buttonlabel = args.py_get ('buttonlabel', 'Submit');
		self.entercallback = args.py_get ('entercallback', null);
		self.textinput = TextInput ().setentercallback (self.entercallback);
		self.submitbutton = Button (self.buttonlabel, self.onenter);
		self.container.a ([self.textinput, self.submitbutton]);
		self.a (self.container);
	});}
});
export var LogItem =  __class__ ('LogItem', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		__super__ (LogItem, '__init__') (self, 'div');
		self.text = args.py_get ('text', '');
		self.kind = args.py_get ('kind', 'normal');
		self.prompt = args.py_get ('prompt', null);
		self.container = Div ('logitem');
		self.container.ac (self.kind);
		self.promptspan = Span ().ac ('prompt');
		if (self.prompt) {
			self.promptspan.html (self.prompt);
		}
		self.textspan = Span ().html (escapeHTML (self.text)).ac (self.kind);
		self.container.a ([self.promptspan, self.textspan]);
		self.a (self.container);
	});}
});
export var Log =  __class__ ('Log', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		__super__ (Log, '__init__') (self, 'div');
		self.py_items = [];
		self.container = Div ();
		self.a (self.container);
	});},
	get build () {return __get__ (this, function (self) {
		self.container.x ();
		for (var item of self.py_items) {
			self.container.a (item);
		}
	});},
	get log () {return __get__ (this, function (self, item) {
		var newitems = [item];
		var i = 1;
		for (var olditem of self.py_items) {
			if (i < MAX_LOGITEMS) {
				newitems.append (olditem);
				i++;
			}
			else {
				break;
			}
		}
		self.py_items = newitems;
		self.build ();
	});}
});

//# sourceMappingURL=widgets.map