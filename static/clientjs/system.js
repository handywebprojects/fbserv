// Transcrypt'ed from Python, 2019-04-05 10:13:03
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {Schema} from './schema.js';
import {getconn} from './connection.js';
import {allchilds, escapeHTML, getrecm} from './utils.js';
import {Button, Span, TextArea} from './dom.js';
import {FileUploader, Log, LogItem, ProcessInput, SplitPane, Tab, TabPane} from './widgets.js';
import {Div, e} from './dom.js';
var __name__ = 'system';
export var DIR_ITEM_FIELDS = [['name', 'filename'], ['st_size', 'size'], ['isdir', 'isdir'], ['st_mtime', 'mtime'], ['st_mode_unix_rwx', 'rwx']];
export var DirItem =  __class__ ('DirItem', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, obj) {
		__super__ (DirItem, '__init__') (self, 'div');
		self.container = Div ('diritem');
		for (var field of DIR_ITEM_FIELDS) {
			self [field [1]] = obj [field [0]];
			var fdiv = Div (field [1]);
			self [field [1] + 'div'] = fdiv;
			self.container.a (fdiv);
		}
		if (self.isdir) {
			self.container.ac ('isdir');
		}
		self.filenamelabel = Div ().html (self.filename);
		self.filenamediv.a ([self.filenamelabel]);
		self.deletebutton = null;
		if (self.filename == '..') {
			self.filenamediv.ac ('parent');
		}
		else {
			self.deletebutton = Button ('Delete').ac ('delete');
			self.isdirdiv.a (self.deletebutton);
			self.mtimediv.html (new Date (self.mtime * 1000).toLocaleString ());
		}
		if (self.isdir) {
			self.sizediv.html ('dir');
		}
		else {
			self.editbutton = Button ('Edit');
			self.filenamediv.a (self.editbutton);
			self.sizediv.html (self.size);
		}
		if (self.rwx) {
			self.rwxdiv.html (self.rwx);
		}
		self.a (self.container);
	});}
});
export var EditTextarea =  __class__ ('EditTextarea', [e], {
	__module__: __name__,
	get resize () {return __get__ (this, function (self, width, height) {
		self.textarea.w (width - 9).h (height - 9);
	});},
	get setText () {return __get__ (this, function (self, text) {
		self.textarea.setText (text);
		return self;
	});},
	get getText () {return __get__ (this, function (self) {
		return self.textarea.getText ();
	});},
	get __init__ () {return __get__ (this, function (self) {
		__super__ (EditTextarea, '__init__') (self, 'div');
		self.textarea = TextArea ();
		self.a (self.textarea);
	});}
});
export var Editor =  __class__ ('Editor', [e], {
	__module__: __name__,
	get setpath () {return __get__ (this, function (self, path) {
		self.path = path;
		self.pathlabel.html (self.path);
	});},
	get resize () {return __get__ (this, function (self, width, height) {
		self.editdiv.resize (width, height);
	});},
	get setText () {return __get__ (this, function (self, text) {
		self.edittextarea.setText (text);
		return self;
	});},
	get getText () {return __get__ (this, function (self) {
		return self.edittextarea.getText ();
	});},
	get __init__ () {return __get__ (this, function (self) {
		__super__ (Editor, '__init__') (self, 'div');
		self.editdiv = SplitPane (dict ({'controlheight': 40}));
		self.pathlabel = Div ('pathlabel');
		self.editdiv.controlpanel.a (self.pathlabel);
		self.reloadbutton = Button ('Reload');
		self.savebutton = Button ('Save');
		self.editdiv.controlpanel.a ([self.reloadbutton, self.savebutton]);
		self.edittextarea = EditTextarea ();
		self.editdiv.setcontentelement (self.edittextarea);
		self.a (self.editdiv);
	});}
});
export var DirBrowser =  __class__ ('DirBrowser', [e], {
	__module__: __name__,
	get path () {return __get__ (this, function (self) {
		if (len (self.pathlist) == 0) {
			return '.';
		}
		return '/'.join (self.pathlist);
	});},
	get dirclickedfactory () {return __get__ (this, function (self, dir) {
		var dirclicked = function () {
			if (dir == '..') {
				if (len (self.pathlist) > 0) {
					self.pathlist.py_pop ();
				}
				self.requestdirlist ();
			}
			else {
				self.pathlist.append (dir);
				getconn ().sioreq (dict ({'kind': 'appenddirtopath', 'owner': self.id, 'drive': self.drive, 'dirpath': self.path (), 'dir': dir}));
				self.pathlist.py_pop ();
			}
		};
		return dirclicked;
	});},
	get openclickedfactory () {return __get__ (this, function (self, dir) {
		var openclicked = function () {
			if (self.drive) {
				window.open ((('/file/drive/' + getconn ().getuid ()) + '/') + self.comppath (dir));
			}
			else {
				window.open ('/file/' + self.comppath (dir));
			}
		};
		return openclicked;
	});},
	get editclickedfactory () {return __get__ (this, function (self, dir) {
		var editclicked = function (ev) {
			ev.stopPropagation ();
			if (self.editclickedcallback) {
				if (self.editclickedcallback (dir)) {
					return ;
				}
			}
			self.requestpath (self.comppath (dir));
		};
		return editclicked;
	});},
	get deletefileclickedfactory () {return __get__ (this, function (self, dir) {
		var deletefileclicked = function (ev) {
			if (window.confirm (('Delete file [ ' + dir) + ' ] ?')) {
				self.requestdeletefile (dir);
			}
		};
		return deletefileclicked;
	});},
	get deletedirclickedfactory () {return __get__ (this, function (self, dir) {
		var deletedirclicked = function (ev) {
			if (window.confirm (('Delete directory [ ' + dir) + ' ] ?')) {
				self.requestdeletedir (dir);
			}
		};
		return deletedirclicked;
	});},
	get appenditem () {return __get__ (this, function (self, item) {
		var di = DirItem (item);
		self.filescontentdiv.a (di);
		if (item ['isdir']) {
			di.filenamediv.ae ('mousedown', self.dirclickedfactory (item ['name']));
			if (di.deletebutton) {
				di.deletebutton.ae ('mousedown', self.deletedirclickedfactory (item ['name']));
			}
		}
		else {
			di.filenamediv.ae ('mousedown', self.openclickedfactory (item ['name']));
			di.editbutton.ae ('mousedown', self.editclickedfactory (item ['name']));
			di.deletebutton.ae ('mousedown', self.deletefileclickedfactory (item ['name']));
		}
	});},
	get build () {return __get__ (this, function (self) {
		var dirs = [];
		var files = [];
		self.listing = sorted (self.listing, __kwargtrans__ ({key: (function __lambda__ (item) {
			return item ['name'].toLowerCase ();
		})}));
		for (var item of self.listing) {
			if (item ['isdir']) {
				dirs.append (item);
			}
			else {
				files.append (item);
			}
		}
		self.listing = [];
		for (var item of dirs) {
			self.listing.append (item);
		}
		for (var item of files) {
			self.listing.append (item);
		}
		self.pathlabel.html (self.path ());
		self.filescontentdiv.x ();
		if (len (self.pathlist) > 0) {
			self.appenditem (dict ({'name': '..', 'isdir': true}));
		}
		for (var item of self.listing) {
			self.appenditem (item);
		}
	});},
	get siores () {return __get__ (this, function (self, obj) {
		if (__in__ ('kind', obj)) {
			var kind = obj ['kind'];
			if (kind == 'setdirlist') {
				self.listing = obj ['listing'];
				self.build ();
			}
			else if (kind == 'pathcontent') {
				self.editor.setpath (obj ['path']);
				self.editor.setText (obj ['content']);
				self.tabs.selectbykey ('edit');
			}
			else if (kind == 'appenddirtopath') {
				self.pathlist.append (obj ['dir']);
				self.requestdirlist ();
			}
			else if (kind == 'appenddirtopathfailed') {
				window.alert ('Opening directory failed. Status: {} .'.format (obj ['status']));
			}
			else if (kind == 'getdirlistfailed') {
				window.alert ('Get dirlist failed. Status: {} .'.format (obj ['status']));
			}
			else if (kind == 'getpathfailed') {
				window.alert ('Get path failed. Status: {} .'.format (obj ['status']));
			}
			else if (kind == 'createfilefailed') {
				window.alert ('Create file failed. Status: {} .'.format (obj ['status']));
			}
			else if (kind == 'createdirfailed') {
				window.alert ('Create directory failed. Status: {} .'.format (obj ['status']));
			}
			else if (kind == 'deletefilefailed') {
				window.alert ('Delete file failed. Status: {} .'.format (obj ['status']));
			}
			else if (kind == 'deletedirfailed') {
				window.alert ('Delete directory failed. Status: {} .'.format (obj ['status']));
			}
			else if (kind == 'savefilefailed') {
				window.alert ('Save file failed. Status: {} .'.format (obj ['status']));
			}
		}
	});},
	get comppath () {return __get__ (this, function (self, path) {
		if (self.path () == '.') {
			return path;
		}
		return (self.path () + '/') + path;
	});},
	get requestdirlist () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'getdirlist', 'owner': self.id, 'drive': self.drive, 'dirpath': self.path ()}));
	});},
	get requestpath () {return __get__ (this, function (self, path) {
		getconn ().sioreq (dict ({'kind': 'getpath', 'owner': self.id, 'drive': self.drive, 'path': path}));
	});},
	get requestcreatefile () {return __get__ (this, function (self, createname) {
		getconn ().sioreq (dict ({'kind': 'createfile', 'owner': self.id, 'drive': self.drive, 'path': self.comppath (createname), 'dirpath': self.path ()}));
	});},
	get requestcreatedir () {return __get__ (this, function (self, createname) {
		getconn ().sioreq (dict ({'kind': 'createdir', 'owner': self.id, 'drive': self.drive, 'path': self.comppath (createname), 'dirpath': self.path ()}));
	});},
	get requestdeletefile () {return __get__ (this, function (self, dir) {
		getconn ().sioreq (dict ({'kind': 'deletefile', 'owner': self.id, 'drive': self.drive, 'path': self.comppath (dir), 'dirpath': self.path ()}));
	});},
	get requestdeletedir () {return __get__ (this, function (self, dir) {
		getconn ().sioreq (dict ({'kind': 'deletedir', 'owner': self.id, 'drive': self.drive, 'path': self.comppath (dir), 'dirpath': self.path ()}));
	});},
	get requestsave () {return __get__ (this, function (self, path, content) {
		getconn ().sioreq (dict ({'kind': 'savefile', 'owner': self.id, 'drive': self.drive, 'content': content, 'path': path}));
	});},
	get requestziptocloud () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'ziptocloud', 'owner': self.id, 'drive': self.drive}));
	});},
	get requestunzipfromcloud () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'unzipfromcloud', 'owner': self.id, 'drive': self.drive}));
	});},
	get resize () {return __get__ (this, function (self, width, height) {
		self.tabs.resize (width, height);
		self.build ();
	});},
	get reloadclicked () {return __get__ (this, function (self) {
		self.requestpath (self.editor.path);
	});},
	get saveclicked () {return __get__ (this, function (self) {
		self.requestsave (self.editor.path, self.editor.getText ());
	});},
	get createfileclicked () {return __get__ (this, function (self) {
		var createname = window.prompt ('Enter file name', 'foo.txt');
		if (createname) {
			if (!(createname == '')) {
				self.requestcreatefile (createname);
			}
		}
	});},
	get createdirclicked () {return __get__ (this, function (self) {
		var createname = window.prompt ('Enter directory name', 'foo');
		if (createname) {
			if (!(createname == '')) {
				self.requestcreatedir (createname);
			}
		}
	});},
	get refreshclicked () {return __get__ (this, function (self) {
		self.requestdirlist ();
	});},
	get ziptocloudclicked () {return __get__ (this, function (self) {
		self.requestziptocloud ();
	});},
	get unzipfromcloudclicked () {return __get__ (this, function (self) {
		self.requestunzipfromcloud ();
	});},
	get dirbrowseruploadedcallback () {return __get__ (this, function (self) {
		self.tabs.selectbykey ('files');
		self.requestdirlist ();
	});},
	get __init__ () {return __get__ (this, function (self, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		__super__ (DirBrowser, '__init__') (self, 'div');
		self.ac ('dirbrowser');
		self.id = args.py_get ('id', null);
		self.drive = args.py_get ('drive', false);
		self.editclickedcallback = args.py_get ('editclickedcallback', null);
		self.pathlist = [];
		self.listing = [];
		self.filesdiv = SplitPane (dict ({'controlheight': 40}));
		self.pathlabel = Div ('pathlabel');
		self.createfilebutton = Button ('Create file', self.createfileclicked);
		self.createdirbutton = Button ('Create dir', self.createdirclicked);
		self.refreshbutton = Button ('Refresh', self.refreshclicked);
		self.filesdiv.controlpanel.a ([self.pathlabel, self.createfilebutton, self.createdirbutton, self.refreshbutton]);
		if (self.drive) {
			self.ziptocloudbutton = Button ('Zip to cloud', self.ziptocloudclicked);
			self.unzipfromcloudbutton = Button ('Unzip from cloud', self.unzipfromcloudclicked);
			self.filesdiv.controlpanel.a ([self.ziptocloudbutton, self.unzipfromcloudbutton]);
		}
		self.filescontentdiv = Div ();
		self.filesdiv.setcontentelement (self.filescontentdiv);
		self.editor = Editor ();
		self.editor.reloadbutton.ae ('mousedown', self.reloadclicked);
		self.editor.savebutton.ae ('mousedown', self.saveclicked);
		self.uploader = FileUploader (dict ({'url': '/dirbrowserupload', 'accept': '*', 'acceptdisplay': 'file', 'drive': self.drive, 'dirbrowseruploadedcallback': self.dirbrowseruploadedcallback, 'dirbrowsergetpathcallback': self.path, 'getuid': getconn ().getuid}));
		self.tabs = TabPane (dict ({'id': self.id + 'tabpane', 'tabs': [Tab ('files', 'Files', self.filesdiv), Tab ('edit', 'Edit', self.editor), Tab ('upload', 'Upload', self.uploader)], 'selected': 'files'}));
		self.tabs.controlpanel.ac ('subcontrolpanel');
		self.a (self.tabs);
		self.requestdirlist ();
	});}
});
export var ProcessConsole =  __class__ ('ProcessConsole', [SplitPane], {
	__module__: __name__,
	get shortcutclickedfactory () {return __get__ (this, function (self, argsstr) {
		var shortcutclicked = function () {
			self.sendline (argsstr);
		};
		return shortcutclicked;
	});},
	get procout () {return __get__ (this, function (self, obj) {
		var subkind = obj ['subkind'];
		var notify = obj ['notify'];
		print ('subkind', subkind, notify);
		var logkind = 'normal';
		var content = '<proc>';
		if (subkind == 'linesent') {
			var logkind = 'info';
			var content = obj ['sline'];
		}
		else if (subkind == 'procstderr') {
			var logkind = 'error';
			var content = obj ['sline'];
		}
		else if (subkind == 'procstdout') {
			var content = obj ['sline'];
		}
		else if (notify) {
			var content = notify;
			var logkind = 'success';
			if (notify.__getslice__ (0, 1, 1) == '!') {
				var logkind = 'error';
			}
		}
		self.log.log (LogItem (dict ({'prompt': '{} &gt; '.format (obj ['key']), 'text': content, 'kind': logkind})));
	});},
	get sendline () {return __get__ (this, function (self, sline) {
		getconn ().sioreq (dict ({'kind': 'sendline', 'key': self.key, 'command': self.command, 'command_args': self.command_args, 'sline': sline}));
	});},
	get onenter () {return __get__ (this, function (self) {
		var sline = self.processinput.getText ();
		self.processinput.setText ('');
		self.sendline (sline);
	});},
	get startcallback () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'startprocess', 'key': self.key, 'command': self.command, 'command_args': self.command_args}));
	});},
	get stopcallback () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'stopprocess', 'key': self.key}));
	});},
	get __init__ () {return __get__ (this, function (self, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		__super__ (ProcessConsole, '__init__') (self, args);
		self.ac ('processconsole');
		self.key = args.py_get ('key', null);
		self.command = args.py_get ('command', null);
		self.command_args = args.py_get ('command_args', []);
		self.processinput = ProcessInput (dict ({'buttonlabel': args.py_get ('buttonlabel', 'Submit'), 'entercallback': args.py_get ('entercallback', self.onenter)}));
		self.processinput.submitbutton.ac ('bluebutton');
		self.startbutton = Button ('Start', self.startcallback).ac ('greenbutton');
		self.stopbutton = Button ('Stop', self.stopcallback).ac ('redbutton');
		self.controlpanel.a ([self.processinput, self.startbutton, self.stopbutton]);
		self.shortcuts = args.py_get ('shortcuts', []);
		for (var shortcut of self.shortcuts) {
			self.controlpanel.a (Button (shortcut [0], self.shortcutclickedfactory (shortcut [1])));
		}
		self.log = Log ();
		self.setcontentelement (self.log);
	});}
});
export var Doc =  __class__ ('Doc', [e], {
	__module__: __name__,
	get siores () {return __get__ (this, function (self, obj) {
		var kind = obj ['kind'];
		if (kind == 'showdoc') {
			self.setdoc (obj);
		}
	});},
	get reflinkclickedfactory () {return __get__ (this, function (self, ref) {
		var reflinkclicked = function () {
			getconn ().sioreq (dict ({'kind': 'getdoc', 'owner': self.id, 'data': ref}));
		};
		return reflinkclicked;
	});},
	get setdoc () {return __get__ (this, function (self, obj) {
		var doc = obj ['doc'];
		var docref = obj ['docref'];
		var contentlink = '### $!contents$$-> back to Table of contents!$\n';
		if (!(docref == 'contents') && self.showcontentslink) {
			var doc = (contentlink + doc) + contentlink;
		}
		var dochtml = self.mdconv.makeHtml (doc);
		var parts = dochtml.py_split ('$!');
		var newparts = [parts [0]];
		for (var part of parts.__getslice__ (1, null, 1)) {
			var subparts = part.py_split ('!$');
			var refparts = subparts [0].py_split ('$$');
			var ref = refparts [0];
			var refdisplay = refparts [1];
			var rest = subparts [1];
			var reflink = "<span purpose='reflink' class='docref noselect' docref='{}'>{}</span>".format (ref, refdisplay);
			newparts.append (reflink);
			newparts.append (rest);
		}
		var dochtml = ''.join (newparts);
		self.docdiv.html (dochtml);
		self.srcdiv.html (escapeHTML (dochtml));
		for (var child of allchilds (self.docdiv.e)) {
			try {
				var purpose = child.getAttribute ('purpose');
				var ref = child.getAttribute ('docref');
				if (purpose == 'reflink') {
					child.addEventListener ('mousedown', self.reflinkclickedfactory (ref));
				}
			}
			catch (__except0__) {
				// pass;
			}
		}
	});},
	get __init__ () {return __get__ (this, function (self, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		__super__ (Doc, '__init__') (self, 'div');
		self.id = args.py_get ('id', 'doc');
		self.startpage = args.py_get ('startpage', 'contents');
		self.showcontentslink = args.py_get ('showcontentslink', true);
		self.mdconv = new showdown.Converter ();
		self.docdiv = Div ('docdiv');
		self.srcdiv = Div ('srcdiv');
		self.a (self.docdiv);
		getconn ().sioreq (dict ({'kind': 'getdoc', 'owner': self.id, 'data': self.startpage, 'switchtodoctab': false}));
	});}
});
export var ProcessPane =  __class__ ('ProcessPane', [e], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		__super__ (ProcessPane, '__init__') (self, 'div');
		self.processconsoles = dict ({});
		self.configsch = args.py_get ('configsch', dict ({}));
		self.id = args.py_get ('id', 'processpane');
		try {
			self.build ();
		}
		catch (__except0__) {
			print ('processpane {} build failed from {}'.format (self.id, self.configsch));
		}
	});},
	get resize () {return __get__ (this, function (self, width, height) {
		if (self.processtabpane) {
			self.processtabpane.resize (width, height);
		}
	});},
	get siores () {return __get__ (this, function (self, obj) {
		var key = obj ['key'];
		if (__in__ (key, self.processconsoles)) {
			var pc = self.processconsoles [key];
			pc.procout (obj);
		}
	});},
	get build () {return __get__ (this, function (self) {
		var proctabs = [];
		var firstkey = null;
		for (var proc of self.configsch.childs) {
			var processkey = proc.getpath ('key').value;
			var command = proc.getpath ('command').value;
			var args = [];
			for (var arg of proc.getpath ('command_args').childs) {
				args.append (arg.value);
			}
			if (!(firstkey)) {
				var firstkey = processkey;
			}
			var processdisplayname = proc.getpath ('displayname').value;
			var shortcuts = [];
			var shortcutsobj = proc.getpath ('shortcuts');
			if (shortcutsobj) {
				for (var shortcut of shortcutsobj.childs) {
					shortcuts.append ([shortcut.key, shortcut.value]);
				}
			}
			var processconsole = ProcessConsole (dict ({'key': processkey, 'command': command, 'command_args': args, 'shortcuts': shortcuts}));
			self.processconsoles [processkey] = processconsole;
			proctabs.append (Tab (processkey, processdisplayname, processconsole));
		}
		self.processtabpane = TabPane (dict ({'id': self.id, 'tabs': proctabs, 'selected': firstkey}));
		self.x ().a (self.processtabpane);
		return self;
	});}
});
export var Config =  __class__ ('Config', [e], {
	__module__: __name__,
	get serializeconfig () {return __get__ (this, function (self) {
		getconn ().sioreq (dict ({'kind': 'serializeconfig', 'data': self.configschema.toargs (), 'owner': self.id}));
	});},
	get resize () {return __get__ (this, function (self, width, height) {
		self.configsplitpane.resize (width, height);
	});},
	get build () {return __get__ (this, function (self) {
		self.configsplitpane = SplitPane (dict ({'controlheight': 50}));
		self.configdiv = Div ('largesheet');
		self.configsplitpane.controlpanel.a (Button ('Serialize', self.serializeconfig).ac ('controlbutton'));
		self.configsplitpane.controlpanel.ac ('subcontrolpanel');
		self.configschema = Schema (self.schemaconfig);
		self.configdiv.a (self.configschema);
		self.configsplitpane.setcontentelement (self.configdiv);
		self.x ().a (self.configsplitpane);
	});},
	get setschemaconfig () {return __get__ (this, function (self, schemaconfig) {
		self.schemaconfig = schemaconfig;
		self.build ();
	});},
	get py_get () {return __get__ (this, function (self, path, py_default) {
		return getrecm (path, self.configschema, py_default);
	});},
	get getpath () {return __get__ (this, function (self, path) {
		return self.configschema.getpath (path);
	});},
	get __init__ () {return __get__ (this, function (self, args) {
		if (typeof args == 'undefined' || (args != null && args.hasOwnProperty ("__kwargtrans__"))) {;
			var args = dict ({});
		};
		__super__ (Config, '__init__') (self, 'div');
		self.id = args.py_get ('id', 'config');
		self.schemaconfig = dict ({'kind': 'collection', 'disposition': 'dict'});
		self.build ();
	});}
});

//# sourceMappingURL=system.map