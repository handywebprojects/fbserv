"use strict";
// Transcrypt'ed from Python, 2019-03-08 14:47:08
function app () {
    var __symbols__ = ['__py3.6__', '__esv5__'];
    var __all__ = {};
    var __world__ = __all__;
    var __nest__ = function (headObject, tailNames, value) {
        var current = headObject;
        if (tailNames != '') {
            var tailChain = tailNames.split ('.');
            var firstNewIndex = tailChain.length;
            for (var index = 0; index < tailChain.length; index++) {
                if (!current.hasOwnProperty (tailChain [index])) {
                    firstNewIndex = index;
                    break;
                }
                current = current [tailChain [index]];
            }
            for (var index = firstNewIndex; index < tailChain.length; index++) {
                current [tailChain [index]] = {};
                current = current [tailChain [index]];
            }
        }
        for (var attrib in value) {
            current [attrib] = value [attrib];
        }
    };
    __all__.__nest__ = __nest__;
    var __init__ = function (module) {
        if (!module.__inited__) {
            module.__all__.__init__ (module.__all__);
            module.__inited__ = true;
        }
        return module.__all__;
    };
    __all__.__init__ = __init__;
    var __get__ = function (self, func, quotedFuncName) {
        if (self) {
            if (self.hasOwnProperty ('__class__') || typeof self == 'string' || self instanceof String) {
                if (quotedFuncName) {
                    Object.defineProperty (self, quotedFuncName, {
                        value: function () {
                            var args = [] .slice.apply (arguments);
                            return func.apply (null, [self] .concat (args));
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
                return function () {
                    var args = [] .slice.apply (arguments);
                    return func.apply (null, [self] .concat (args));
                };
            }
            else {
                return func;
            }
        }
        else {
            return func;
        }
    }
    __all__.__get__ = __get__;
    var __getcm__ = function (self, func, quotedFuncName) {
        if (self.hasOwnProperty ('__class__')) {
            return function () {
                var args = [] .slice.apply (arguments);
                return func.apply (null, [self.__class__] .concat (args));
            };
        }
        else {
            return function () {
                var args = [] .slice.apply (arguments);
                return func.apply (null, [self] .concat (args));
            };
        }
    }
    __all__.__getcm__ = __getcm__;
    var __getsm__ = function (self, func, quotedFuncName) {
        return func;
    }
    __all__.__getsm__ = __getsm__;
    var py_metatype = {
        __name__: 'type',
        __bases__: [],
        __new__: function (meta, name, bases, attribs) {
            var cls = function () {
                var args = [] .slice.apply (arguments);
                return cls.__new__ (args);
            };
            for (var index = bases.length - 1; index >= 0; index--) {
                var base = bases [index];
                for (var attrib in base) {
                    var descrip = Object.getOwnPropertyDescriptor (base, attrib);
                    Object.defineProperty (cls, attrib, descrip);
                }
            }
            cls.__metaclass__ = meta;
            cls.__name__ = name.startsWith ('py_') ? name.slice (3) : name;
            cls.__bases__ = bases;
            for (var attrib in attribs) {
                var descrip = Object.getOwnPropertyDescriptor (attribs, attrib);
                Object.defineProperty (cls, attrib, descrip);
            }
            return cls;
        }
    };
    py_metatype.__metaclass__ = py_metatype;
    __all__.py_metatype = py_metatype;
    var object = {
        __init__: function (self) {},
        __metaclass__: py_metatype,
        __name__: 'object',
        __bases__: [],
        __new__: function (args) {
            var instance = Object.create (this, {__class__: {value: this, enumerable: true}});
            this.__init__.apply (null, [instance] .concat (args));
            return instance;
        }
    };
    __all__.object = object;
    var __class__ = function (name, bases, attribs, meta) {
        if (meta === undefined) {
            meta = bases [0] .__metaclass__;
        }
        return meta.__new__ (meta, name, bases, attribs);
    }
    __all__.__class__ = __class__;
    var __pragma__ = function () {};
    __all__.__pragma__ = __pragma__;
	__nest__ (
		__all__,
		'org.transcrypt.__base__', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'org.transcrypt.__base__';
					var __Envir__ = __class__ ('__Envir__', [object], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self) {
							self.interpreter_name = 'python';
							self.transpiler_name = 'transcrypt';
							self.transpiler_version = '3.6.101';
							self.target_subdir = '__javascript__';
						});}
					});
					var __envir__ = __Envir__ ();
					__pragma__ ('<all>')
						__all__.__Envir__ = __Envir__;
						__all__.__envir__ = __envir__;
						__all__.__name__ = __name__;
					__pragma__ ('</all>')
				}
			}
		}
	);

	__nest__ (
		__all__,
		'org.transcrypt.__standard__', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'org.transcrypt.__standard__';
					var Exception = __class__ ('Exception', [object], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self) {
							var kwargs = dict ();
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
										}
									}
									delete kwargs.__kwargtrans__;
								}
								var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							self.__args__ = args;
							try {
								self.stack = kwargs.error.stack;
							}
							catch (__except0__) {
								self.stack = 'No stack trace available';
							}
						});},
						get __repr__ () {return __get__ (this, function (self) {
							if (len (self.__args__)) {
								return '{}{}'.format (self.__class__.__name__, repr (tuple (self.__args__)));
							}
							else {
								return '{}()'.format (self.__class__.__name__);
							}
						});},
						get __str__ () {return __get__ (this, function (self) {
							if (len (self.__args__) > 1) {
								return str (tuple (self.__args__));
							}
							else if (len (self.__args__)) {
								return str (self.__args__ [0]);
							}
							else {
								return '';
							}
						});}
					});
					var IterableError = __class__ ('IterableError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, error) {
							Exception.__init__ (self, "Can't iterate over non-iterable", __kwargtrans__ ({error: error}));
						});}
					});
					var StopIteration = __class__ ('StopIteration', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, error) {
							Exception.__init__ (self, 'Iterator exhausted', __kwargtrans__ ({error: error}));
						});}
					});
					var ValueError = __class__ ('ValueError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var KeyError = __class__ ('KeyError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var AssertionError = __class__ ('AssertionError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, message, error) {
							if (message) {
								Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
							}
							else {
								Exception.__init__ (self, __kwargtrans__ ({error: error}));
							}
						});}
					});
					var NotImplementedError = __class__ ('NotImplementedError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var IndexError = __class__ ('IndexError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var AttributeError = __class__ ('AttributeError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var py_TypeError = __class__ ('py_TypeError', [Exception], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, message, error) {
							Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
						});}
					});
					var Warning = __class__ ('Warning', [Exception], {
						__module__: __name__,
					});
					var UserWarning = __class__ ('UserWarning', [Warning], {
						__module__: __name__,
					});
					var DeprecationWarning = __class__ ('DeprecationWarning', [Warning], {
						__module__: __name__,
					});
					var RuntimeWarning = __class__ ('RuntimeWarning', [Warning], {
						__module__: __name__,
					});
					var __sort__ = function (iterable, key, reverse) {
						if (typeof key == 'undefined' || (key != null && key .hasOwnProperty ("__kwargtrans__"))) {;
							var key = null;
						};
						if (typeof reverse == 'undefined' || (reverse != null && reverse .hasOwnProperty ("__kwargtrans__"))) {;
							var reverse = false;
						};
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
									}
								}
							}
						}
						else {
						}
						if (key) {
							iterable.sort ((function __lambda__ (a, b) {
								if (arguments.length) {
									var __ilastarg0__ = arguments.length - 1;
									if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
										var __allkwargs0__ = arguments [__ilastarg0__--];
										for (var __attrib0__ in __allkwargs0__) {
											switch (__attrib0__) {
												case 'a': var a = __allkwargs0__ [__attrib0__]; break;
												case 'b': var b = __allkwargs0__ [__attrib0__]; break;
											}
										}
									}
								}
								else {
								}
								return (key (a) > key (b) ? 1 : -(1));
							}));
						}
						else {
							iterable.sort ();
						}
						if (reverse) {
							iterable.reverse ();
						}
					};
					var sorted = function (iterable, key, reverse) {
						if (typeof key == 'undefined' || (key != null && key .hasOwnProperty ("__kwargtrans__"))) {;
							var key = null;
						};
						if (typeof reverse == 'undefined' || (reverse != null && reverse .hasOwnProperty ("__kwargtrans__"))) {;
							var reverse = false;
						};
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
									}
								}
							}
						}
						else {
						}
						if (py_typeof (iterable) == dict) {
							var result = copy (iterable.py_keys ());
						}
						else {
							var result = copy (iterable);
						}
						__sort__ (result, key, reverse);
						return result;
					};
					var map = function (func, iterable) {
						return (function () {
							var __accu0__ = [];
							var __iterable0__ = iterable;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var item = __iterable0__ [__index0__];
								__accu0__.append (func (item));
							}
							return __accu0__;
						}) ();
					};
					var filter = function (func, iterable) {
						if (func == null) {
							var func = bool;
						}
						return (function () {
							var __accu0__ = [];
							var __iterable0__ = iterable;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var item = __iterable0__ [__index0__];
								if (func (item)) {
									__accu0__.append (item);
								}
							}
							return __accu0__;
						}) ();
					};
					var __Terminal__ = __class__ ('__Terminal__', [object], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self) {
							self.buffer = '';
							try {
								self.element = document.getElementById ('__terminal__');
							}
							catch (__except0__) {
								self.element = null;
							}
							if (self.element) {
								self.element.style.overflowX = 'auto';
								self.element.style.boxSizing = 'border-box';
								self.element.style.padding = '5px';
								self.element.innerHTML = '_';
							}
						});},
						get print () {return __get__ (this, function (self) {
							var sep = ' ';
							var end = '\n';
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'sep': var sep = __allkwargs0__ [__attrib0__]; break;
											case 'end': var end = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
								var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							self.buffer = '{}{}{}'.format (self.buffer, sep.join ((function () {
								var __accu0__ = [];
								var __iterable0__ = args;
								for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
									var arg = __iterable0__ [__index0__];
									__accu0__.append (str (arg));
								}
								return __accu0__;
							}) ()), end).__getslice__ (-(4096), null, 1);
							if (self.element) {
								self.element.innerHTML = self.buffer.py_replace ('\n', '<br>').py_replace (' ', '&nbsp');
								self.element.scrollTop = self.element.scrollHeight;
							}
							else {
								console.log (sep.join ((function () {
									var __accu0__ = [];
									var __iterable0__ = args;
									for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
										var arg = __iterable0__ [__index0__];
										__accu0__.append (str (arg));
									}
									return __accu0__;
								}) ()));
							}
						});},
						get input () {return __get__ (this, function (self, question) {
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'question': var question = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
							}
							else {
							}
							self.print ('{}'.format (question), __kwargtrans__ ({end: ''}));
							var answer = window.prompt ('\n'.join (self.buffer.py_split ('\n').__getslice__ (-(16), null, 1)));
							self.print (answer);
							return answer;
						});}
					});
					var __terminal__ = __Terminal__ ();
					__pragma__ ('<all>')
						__all__.AssertionError = AssertionError;
						__all__.AttributeError = AttributeError;
						__all__.DeprecationWarning = DeprecationWarning;
						__all__.Exception = Exception;
						__all__.IndexError = IndexError;
						__all__.IterableError = IterableError;
						__all__.KeyError = KeyError;
						__all__.NotImplementedError = NotImplementedError;
						__all__.RuntimeWarning = RuntimeWarning;
						__all__.StopIteration = StopIteration;
						__all__.py_TypeError = py_TypeError;
						__all__.UserWarning = UserWarning;
						__all__.ValueError = ValueError;
						__all__.Warning = Warning;
						__all__.__Terminal__ = __Terminal__;
						__all__.__name__ = __name__;
						__all__.__sort__ = __sort__;
						__all__.__terminal__ = __terminal__;
						__all__.filter = filter;
						__all__.map = map;
						__all__.sorted = sorted;
					__pragma__ ('</all>')
				}
			}
		}
	);

    var __call__ = function (/* <callee>, <this>, <params>* */) {
        var args = [] .slice.apply (arguments);
        if (typeof args [0] == 'object' && '__call__' in args [0]) {
            return args [0] .__call__ .apply (args [1], args.slice (2));
        }
        else {
            return args [0] .apply (args [1], args.slice (2));
        }
    };
    __all__.__call__ = __call__;
    __nest__ (__all__, '', __init__ (__all__.org.transcrypt.__base__));
    var __envir__ = __all__.__envir__;
    __nest__ (__all__, '', __init__ (__all__.org.transcrypt.__standard__));
    var Exception = __all__.Exception;
    var IterableError = __all__.IterableError;
    var StopIteration = __all__.StopIteration;
    var ValueError = __all__.ValueError;
    var KeyError = __all__.KeyError;
    var AssertionError = __all__.AssertionError;
    var NotImplementedError = __all__.NotImplementedError;
    var IndexError = __all__.IndexError;
    var AttributeError = __all__.AttributeError;
    var py_TypeError = __all__.py_TypeError;
    var Warning = __all__.Warning;
    var UserWarning = __all__.UserWarning;
    var DeprecationWarning = __all__.DeprecationWarning;
    var RuntimeWarning = __all__.RuntimeWarning;
    var __sort__ = __all__.__sort__;
    var sorted = __all__.sorted;
    var map = __all__.map;
    var filter = __all__.filter;
    __all__.print = __all__.__terminal__.print;
    __all__.input = __all__.__terminal__.input;
    var __terminal__ = __all__.__terminal__;
    var print = __all__.print;
    var input = __all__.input;
    __envir__.executor_name = __envir__.transpiler_name;
    var __main__ = {__file__: ''};
    __all__.main = __main__;
    var __except__ = null;
    __all__.__except__ = __except__;
    var __kwargtrans__ = function (anObject) {
        anObject.__kwargtrans__ = null;
        anObject.constructor = Object;
        return anObject;
    }
    __all__.__kwargtrans__ = __kwargtrans__;
    var __globals__ = function (anObject) {
        if (isinstance (anObject, dict)) {
            return anObject;
        }
        else {
            return dict (anObject)
        }
    }
    __all__.__globals__ = __globals__
    var __super__ = function (aClass, methodName) {
        for (var index = 0; index < aClass.__bases__.length; index++) {
            var base = aClass.__bases__ [index];
            if (methodName in base) {
               return base [methodName];
            }
        }
        throw new Exception ('Superclass method not found');
    }
    __all__.__super__ = __super__
    var property = function (getter, setter) {
        if (!setter) {
            setter = function () {};
        }
        return {get: function () {return getter (this)}, set: function (value) {setter (this, value)}, enumerable: true};
    }
    __all__.property = property;
    var __setProperty__ = function (anObject, name, descriptor) {
        if (!anObject.hasOwnProperty (name)) {
            Object.defineProperty (anObject, name, descriptor);
        }
    }
    __all__.__setProperty__ = __setProperty__
    function assert (condition, message) {
        if (!condition) {
            throw AssertionError (message, new Error ());
        }
    }
    __all__.assert = assert;
    var __merge__ = function (object0, object1) {
        var result = {};
        for (var attrib in object0) {
            result [attrib] = object0 [attrib];
        }
        for (var attrib in object1) {
            result [attrib] = object1 [attrib];
        }
        return result;
    };
    __all__.__merge__ = __merge__;
    var dir = function (obj) {
        var aList = [];
        for (var aKey in obj) {
            aList.push (aKey.startsWith ('py_') ? aKey.slice (3) : aKey);
        }
        aList.sort ();
        return aList;
    };
    __all__.dir = dir;
    var setattr = function (obj, name, value) {
        obj [name] = value;
    };
    __all__.setattr = setattr;
    var getattr = function (obj, name) {
        return name in obj ? obj [name] : obj ['py_' + name];
    };
    __all__.getattr = getattr;
    var hasattr = function (obj, name) {
        try {
            return name in obj || 'py_' + name in obj;
        }
        catch (exception) {
            return false;
        }
    };
    __all__.hasattr = hasattr;
    var delattr = function (obj, name) {
        if (name in obj) {
            delete obj [name];
        }
        else {
            delete obj ['py_' + name];
        }
    };
    __all__.delattr = (delattr);
    var __in__ = function (element, container) {
        if (container === undefined || container === null) {
            return false;
        }
        if (container.__contains__ instanceof Function) {
            return container.__contains__ (element);
        }
        else {
            return (
                container.indexOf ?
                container.indexOf (element) > -1 :
                container.hasOwnProperty (element)
            );
        }
    };
    __all__.__in__ = __in__;
    var __specialattrib__ = function (attrib) {
        return (attrib.startswith ('__') && attrib.endswith ('__')) || attrib == 'constructor' || attrib.startswith ('py_');
    };
    __all__.__specialattrib__ = __specialattrib__;
    var len = function (anObject) {
        if (anObject === undefined || anObject === null) {
            return 0;
        }
        if (anObject.__len__ instanceof Function) {
            return anObject.__len__ ();
        }
        if (anObject.length !== undefined) {
            return anObject.length;
        }
        var length = 0;
        for (var attr in anObject) {
            if (!__specialattrib__ (attr)) {
                length++;
            }
        }
        return length;
    };
    __all__.len = len;
    function __i__ (any) {
        return py_typeof (any) == dict ? any.py_keys () : any;
    }
    function __k__ (keyed, key) {
        var result = keyed [key];
        if (typeof result == 'undefined') {
            if (keyed instanceof Array)
                if (key == +key && key >= 0 && keyed.length > key)
                    return result;
                else
                    throw IndexError (key, new Error());
            else
                throw KeyError (key, new Error());
        }
        return result;
    }
    function __t__ (target) {
        return (
            target === undefined || target === null ? false :
            ['boolean', 'number'] .indexOf (typeof target) >= 0 ? target :
            target.__bool__ instanceof Function ? (target.__bool__ () ? target : false) :
            target.__len__ instanceof Function ?  (target.__len__ () !== 0 ? target : false) :
            target instanceof Function ? target :
            len (target) !== 0 ? target :
            false
        );
    }
    __all__.__t__ = __t__;
    var float = function (any) {
        if (any == 'inf') {
            return Infinity;
        }
        else if (any == '-inf') {
            return -Infinity;
        }
        else if (any == 'nan') {
            return NaN;
        }
        else if (isNaN (parseFloat (any))) {
            if (any === false) {
                return 0;
            }
            else if (any === true) {
                return 1;
            }
            else {
                throw ValueError ("could not convert string to float: '" + str(any) + "'", new Error ());
            }
        }
        else {
            return +any;
        }
    };
    float.__name__ = 'float';
    float.__bases__ = [object];
    __all__.float = float;
    var int = function (any) {
        return float (any) | 0
    };
    int.__name__ = 'int';
    int.__bases__ = [object];
    __all__.int = int;
    var bool = function (any) {
        return !!__t__ (any);
    };
    bool.__name__ = 'bool';
    bool.__bases__ = [int];
    __all__.bool = bool;
    var py_typeof = function (anObject) {
        var aType = typeof anObject;
        if (aType == 'object') {
            try {
                return '__class__' in anObject ? anObject.__class__ : object;
            }
            catch (exception) {
                return aType;
            }
        }
        else {
            return (
                aType == 'boolean' ? bool :
                aType == 'string' ? str :
                aType == 'number' ? (anObject % 1 == 0 ? int : float) :
                null
            );
        }
    };
    __all__.py_typeof = py_typeof;
    var issubclass = function (aClass, classinfo) {
        if (classinfo instanceof Array) {
            for (var index = 0; index < classinfo.length; index++) {
                var aClass2 = classinfo [index];
                if (issubclass (aClass, aClass2)) {
                    return true;
                }
            }
            return false;
        }
        try {
            var aClass2 = aClass;
            if (aClass2 == classinfo) {
                return true;
            }
            else {
                var bases = [].slice.call (aClass2.__bases__);
                while (bases.length) {
                    aClass2 = bases.shift ();
                    if (aClass2 == classinfo) {
                        return true;
                    }
                    if (aClass2.__bases__.length) {
                        bases = [].slice.call (aClass2.__bases__).concat (bases);
                    }
                }
                return false;
            }
        }
        catch (exception) {
            return aClass == classinfo || classinfo == object;
        }
    };
    __all__.issubclass = issubclass;
    var isinstance = function (anObject, classinfo) {
        try {
            return '__class__' in anObject ? issubclass (anObject.__class__, classinfo) : issubclass (py_typeof (anObject), classinfo);
        }
        catch (exception) {
            return issubclass (py_typeof (anObject), classinfo);
        }
    };
    __all__.isinstance = isinstance;
    var callable = function (anObject) {
        return anObject && typeof anObject == 'object' && '__call__' in anObject ? true : typeof anObject === 'function';
    };
    __all__.callable = callable;
    var repr = function (anObject) {
        try {
            return anObject.__repr__ ();
        }
        catch (exception) {
            try {
                return anObject.__str__ ();
            }
            catch (exception) {
                try {
                    if (anObject == null) {
                        return 'None';
                    }
                    else if (anObject.constructor == Object) {
                        var result = '{';
                        var comma = false;
                        for (var attrib in anObject) {
                            if (!__specialattrib__ (attrib)) {
                                if (attrib.isnumeric ()) {
                                    var attribRepr = attrib;
                                }
                                else {
                                    var attribRepr = '\'' + attrib + '\'';
                                }
                                if (comma) {
                                    result += ', ';
                                }
                                else {
                                    comma = true;
                                }
                                result += attribRepr + ': ' + repr (anObject [attrib]);
                            }
                        }
                        result += '}';
                        return result;
                    }
                    else {
                        return typeof anObject == 'boolean' ? anObject.toString () .capitalize () : anObject.toString ();
                    }
                }
                catch (exception) {
                    return '<object of type: ' + typeof anObject + '>';
                }
            }
        }
    };
    __all__.repr = repr;
    var chr = function (charCode) {
        return String.fromCharCode (charCode);
    };
    __all__.chr = chr;
    var ord = function (aChar) {
        return aChar.charCodeAt (0);
    };
    __all__.ord = ord;
    var max = function (nrOrSeq) {
        return arguments.length == 1 ? Math.max.apply (null, nrOrSeq) : Math.max.apply (null, arguments);
    };
    __all__.max = max;
    var min = function (nrOrSeq) {
        return arguments.length == 1 ? Math.min.apply (null, nrOrSeq) : Math.min.apply (null, arguments);
    };
    __all__.min = min;
    var abs = Math.abs;
    __all__.abs = abs;
    var round = function (number, ndigits) {
        if (ndigits) {
            var scale = Math.pow (10, ndigits);
            number *= scale;
        }
        var rounded = Math.round (number);
        if (rounded - number == 0.5 && rounded % 2) {
            rounded -= 1;
        }
        if (ndigits) {
            rounded /= scale;
        }
        return rounded;
    };
    __all__.round = round;
    function __jsUsePyNext__ () {
        try {
            var result = this.__next__ ();
            return {value: result, done: false};
        }
        catch (exception) {
            return {value: undefined, done: true};
        }
    }
    function __pyUseJsNext__ () {
        var result = this.next ();
        if (result.done) {
            throw StopIteration (new Error ());
        }
        else {
            return result.value;
        }
    }
    function py_iter (iterable) {
        if (typeof iterable == 'string' || '__iter__' in iterable) {
            var result = iterable.__iter__ ();
            result.next = __jsUsePyNext__;
        }
        else if ('selector' in iterable) {
            var result = list (iterable) .__iter__ ();
            result.next = __jsUsePyNext__;
        }
        else if ('next' in iterable) {
            var result = iterable
            if (! ('__next__' in result)) {
                result.__next__ = __pyUseJsNext__;
            }
        }
        else if (Symbol.iterator in iterable) {
            var result = iterable [Symbol.iterator] ();
            result.__next__ = __pyUseJsNext__;
        }
        else {
            throw IterableError (new Error ());
        }
        result [Symbol.iterator] = function () {return result;};
        return result;
    }
    function py_next (iterator) {
        try {
            var result = iterator.__next__ ();
        }
        catch (exception) {
            var result = iterator.next ();
            if (result.done) {
                throw StopIteration (new Error ());
            }
            else {
                return result.value;
            }
        }
        if (result == undefined) {
            throw StopIteration (new Error ());
        }
        else {
            return result;
        }
    }
    function __PyIterator__ (iterable) {
        this.iterable = iterable;
        this.index = 0;
    }
    __PyIterator__.prototype.__next__ = function () {
        if (this.index < this.iterable.length) {
            return this.iterable [this.index++];
        }
        else {
            throw StopIteration (new Error ());
        }
    };
    function __JsIterator__ (iterable) {
        this.iterable = iterable;
        this.index = 0;
    }
    __JsIterator__.prototype.next = function () {
        if (this.index < this.iterable.py_keys.length) {
            return {value: this.index++, done: false};
        }
        else {
            return {value: undefined, done: true};
        }
    };
    var py_reversed = function (iterable) {
        iterable = iterable.slice ();
        iterable.reverse ();
        return iterable;
    };
    __all__.py_reversed = py_reversed;
    var zip = function () {
        var args = [] .slice.call (arguments);
        for (var i = 0; i < args.length; i++) {
            if (typeof args [i] == 'string') {
                args [i] = args [i] .split ('');
            }
            else if (!Array.isArray (args [i])) {
                args [i] = Array.from (args [i]);
            }
        }
        var shortest = args.length == 0 ? [] : args.reduce (
            function (array0, array1) {
                return array0.length < array1.length ? array0 : array1;
            }
        );
        return shortest.map (
            function (current, index) {
                return args.map (
                    function (current) {
                        return current [index];
                    }
                );
            }
        );
    };
    __all__.zip = zip;
    function range (start, stop, step) {
        if (stop == undefined) {
            stop = start;
            start = 0;
        }
        if (step == undefined) {
            step = 1;
        }
        if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
            return [];
        }
        var result = [];
        for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
            result.push(i);
        }
        return result;
    };
    __all__.range = range;
    function any (iterable) {
        for (var index = 0; index < iterable.length; index++) {
            if (bool (iterable [index])) {
                return true;
            }
        }
        return false;
    }
    function all (iterable) {
        for (var index = 0; index < iterable.length; index++) {
            if (! bool (iterable [index])) {
                return false;
            }
        }
        return true;
    }
    function sum (iterable) {
        var result = 0;
        for (var index = 0; index < iterable.length; index++) {
            result += iterable [index];
        }
        return result;
    }
    __all__.any = any;
    __all__.all = all;
    __all__.sum = sum;
    function enumerate (iterable) {
        return zip (range (len (iterable)), iterable);
    }
    __all__.enumerate = enumerate;
    function copy (anObject) {
        if (anObject == null || typeof anObject == "object") {
            return anObject;
        }
        else {
            var result = {};
            for (var attrib in obj) {
                if (anObject.hasOwnProperty (attrib)) {
                    result [attrib] = anObject [attrib];
                }
            }
            return result;
        }
    }
    __all__.copy = copy;
    function deepcopy (anObject) {
        if (anObject == null || typeof anObject == "object") {
            return anObject;
        }
        else {
            var result = {};
            for (var attrib in obj) {
                if (anObject.hasOwnProperty (attrib)) {
                    result [attrib] = deepcopy (anObject [attrib]);
                }
            }
            return result;
        }
    }
    __all__.deepcopy = deepcopy;
    function list (iterable) {
        var instance = iterable ? [] .slice.apply (iterable) : [];
        return instance;
    }
    __all__.list = list;
    Array.prototype.__class__ = list;
    list.__name__ = 'list';
    list.__bases__ = [object];
    Array.prototype.__iter__ = function () {return new __PyIterator__ (this);};
    Array.prototype.__getslice__ = function (start, stop, step) {
        if (start < 0) {
            start = this.length + start;
        }
        if (stop == null) {
            stop = this.length;
        }
        else if (stop < 0) {
            stop = this.length + stop;
        }
        else if (stop > this.length) {
            stop = this.length;
        }
        var result = list ([]);
        for (var index = start; index < stop; index += step) {
            result.push (this [index]);
        }
        return result;
    };
    Array.prototype.__setslice__ = function (start, stop, step, source) {
        if (start < 0) {
            start = this.length + start;
        }
        if (stop == null) {
            stop = this.length;
        }
        else if (stop < 0) {
            stop = this.length + stop;
        }
        if (step == null) {
            Array.prototype.splice.apply (this, [start, stop - start] .concat (source));
        }
        else {
            var sourceIndex = 0;
            for (var targetIndex = start; targetIndex < stop; targetIndex += step) {
                this [targetIndex] = source [sourceIndex++];
            }
        }
    };
    Array.prototype.__repr__ = function () {
        if (this.__class__ == set && !this.length) {
            return 'set()';
        }
        var result = !this.__class__ || this.__class__ == list ? '[' : this.__class__ == tuple ? '(' : '{';
        for (var index = 0; index < this.length; index++) {
            if (index) {
                result += ', ';
            }
            result += repr (this [index]);
        }
        if (this.__class__ == tuple && this.length == 1) {
            result += ',';
        }
        result += !this.__class__ || this.__class__ == list ? ']' : this.__class__ == tuple ? ')' : '}';;
        return result;
    };
    Array.prototype.__str__ = Array.prototype.__repr__;
    Array.prototype.append = function (element) {
        this.push (element);
    };
    Array.prototype.py_clear = function () {
        this.length = 0;
    };
    Array.prototype.extend = function (aList) {
        this.push.apply (this, aList);
    };
    Array.prototype.insert = function (index, element) {
        this.splice (index, 0, element);
    };
    Array.prototype.remove = function (element) {
        var index = this.indexOf (element);
        if (index == -1) {
            throw ValueError ("list.remove(x): x not in list", new Error ());
        }
        this.splice (index, 1);
    };
    Array.prototype.index = function (element) {
        return this.indexOf (element);
    };
    Array.prototype.py_pop = function (index) {
        if (index == undefined) {
            return this.pop ();
        }
        else {
            return this.splice (index, 1) [0];
        }
    };
    Array.prototype.py_sort = function () {
        __sort__.apply  (null, [this].concat ([] .slice.apply (arguments)));
    };
    Array.prototype.__add__ = function (aList) {
        return list (this.concat (aList));
    };
    Array.prototype.__mul__ = function (scalar) {
        var result = this;
        for (var i = 1; i < scalar; i++) {
            result = result.concat (this);
        }
        return result;
    };
    Array.prototype.__rmul__ = Array.prototype.__mul__;
    function tuple (iterable) {
        var instance = iterable ? [] .slice.apply (iterable) : [];
        instance.__class__ = tuple;
        return instance;
    }
    __all__.tuple = tuple;
    tuple.__name__ = 'tuple';
    tuple.__bases__ = [object];
    function set (iterable) {
        var instance = [];
        if (iterable) {
            for (var index = 0; index < iterable.length; index++) {
                instance.add (iterable [index]);
            }
        }
        instance.__class__ = set;
        return instance;
    }
    __all__.set = set;
    set.__name__ = 'set';
    set.__bases__ = [object];
    Array.prototype.__bindexOf__ = function (element) {
        element += '';
        var mindex = 0;
        var maxdex = this.length - 1;
        while (mindex <= maxdex) {
            var index = (mindex + maxdex) / 2 | 0;
            var middle = this [index] + '';
            if (middle < element) {
                mindex = index + 1;
            }
            else if (middle > element) {
                maxdex = index - 1;
            }
            else {
                return index;
            }
        }
        return -1;
    };
    Array.prototype.add = function (element) {
        if (this.indexOf (element) == -1) {
            this.push (element);
        }
    };
    Array.prototype.discard = function (element) {
        var index = this.indexOf (element);
        if (index != -1) {
            this.splice (index, 1);
        }
    };
    Array.prototype.isdisjoint = function (other) {
        this.sort ();
        for (var i = 0; i < other.length; i++) {
            if (this.__bindexOf__ (other [i]) != -1) {
                return false;
            }
        }
        return true;
    };
    Array.prototype.issuperset = function (other) {
        this.sort ();
        for (var i = 0; i < other.length; i++) {
            if (this.__bindexOf__ (other [i]) == -1) {
                return false;
            }
        }
        return true;
    };
    Array.prototype.issubset = function (other) {
        return set (other.slice ()) .issuperset (this);
    };
    Array.prototype.union = function (other) {
        var result = set (this.slice () .sort ());
        for (var i = 0; i < other.length; i++) {
            if (result.__bindexOf__ (other [i]) == -1) {
                result.push (other [i]);
            }
        }
        return result;
    };
    Array.prototype.intersection = function (other) {
        this.sort ();
        var result = set ();
        for (var i = 0; i < other.length; i++) {
            if (this.__bindexOf__ (other [i]) != -1) {
                result.push (other [i]);
            }
        }
        return result;
    };
    Array.prototype.difference = function (other) {
        var sother = set (other.slice () .sort ());
        var result = set ();
        for (var i = 0; i < this.length; i++) {
            if (sother.__bindexOf__ (this [i]) == -1) {
                result.push (this [i]);
            }
        }
        return result;
    };
    Array.prototype.symmetric_difference = function (other) {
        return this.union (other) .difference (this.intersection (other));
    };
    Array.prototype.py_update = function () {
        var updated = [] .concat.apply (this.slice (), arguments) .sort ();
        this.py_clear ();
        for (var i = 0; i < updated.length; i++) {
            if (updated [i] != updated [i - 1]) {
                this.push (updated [i]);
            }
        }
    };
    Array.prototype.__eq__ = function (other) {
        if (this.length != other.length) {
            return false;
        }
        if (this.__class__ == set) {
            this.sort ();
            other.sort ();
        }
        for (var i = 0; i < this.length; i++) {
            if (this [i] != other [i]) {
                return false;
            }
        }
        return true;
    };
    Array.prototype.__ne__ = function (other) {
        return !this.__eq__ (other);
    };
    Array.prototype.__le__ = function (other) {
        return this.issubset (other);
    };
    Array.prototype.__ge__ = function (other) {
        return this.issuperset (other);
    };
    Array.prototype.__lt__ = function (other) {
        return this.issubset (other) && !this.issuperset (other);
    };
    Array.prototype.__gt__ = function (other) {
        return this.issuperset (other) && !this.issubset (other);
    };
    function bytearray (bytable, encoding) {
        if (bytable == undefined) {
            return new Uint8Array (0);
        }
        else {
            var aType = py_typeof (bytable);
            if (aType == int) {
                return new Uint8Array (bytable);
            }
            else if (aType == str) {
                var aBytes = new Uint8Array (len (bytable));
                for (var i = 0; i < len (bytable); i++) {
                    aBytes [i] = bytable.charCodeAt (i);
                }
                return aBytes;
            }
            else if (aType == list || aType == tuple) {
                return new Uint8Array (bytable);
            }
            else {
                throw py_TypeError;
            }
        }
    }
    var bytes = bytearray;
    __all__.bytearray = bytearray;
    __all__.bytes = bytearray;
    Uint8Array.prototype.__add__ = function (aBytes) {
        var result = new Uint8Array (this.length + aBytes.length);
        result.set (this);
        result.set (aBytes, this.length);
        return result;
    };
    Uint8Array.prototype.__mul__ = function (scalar) {
        var result = new Uint8Array (scalar * this.length);
        for (var i = 0; i < scalar; i++) {
            result.set (this, i * this.length);
        }
        return result;
    };
    Uint8Array.prototype.__rmul__ = Uint8Array.prototype.__mul__;
    function str (stringable) {
        if (typeof stringable === 'number')
            return stringable.toString();
        else {
            try {
                return stringable.__str__ ();
            }
            catch (exception) {
                try {
                    return repr (stringable);
                }
                catch (exception) {
                    return String (stringable);
                }
            }
        }
    };
    __all__.str = str;
    String.prototype.__class__ = str;
    str.__name__ = 'str';
    str.__bases__ = [object];
    String.prototype.__iter__ = function () {new __PyIterator__ (this);};
    String.prototype.__repr__ = function () {
        return (this.indexOf ('\'') == -1 ? '\'' + this + '\'' : '"' + this + '"') .py_replace ('\t', '\\t') .py_replace ('\n', '\\n');
    };
    String.prototype.__str__ = function () {
        return this;
    };
    String.prototype.capitalize = function () {
        return this.charAt (0).toUpperCase () + this.slice (1);
    };
    String.prototype.endswith = function (suffix) {
        if (suffix instanceof Array) {
            for (var i=0;i<suffix.length;i++) {
                if (this.slice (-suffix[i].length) == suffix[i])
                    return true;
            }
        } else
            return suffix == '' || this.slice (-suffix.length) == suffix;
        return false;
    };
    String.prototype.find  = function (sub, start) {
        return this.indexOf (sub, start);
    };
    String.prototype.__getslice__ = function (start, stop, step) {
        if (start < 0) {
            start = this.length + start;
        }
        if (stop == null) {
            stop = this.length;
        }
        else if (stop < 0) {
            stop = this.length + stop;
        }
        var result = '';
        if (step == 1) {
            result = this.substring (start, stop);
        }
        else {
            for (var index = start; index < stop; index += step) {
                result = result.concat (this.charAt(index));
            }
        }
        return result;
    };
    __setProperty__ (String.prototype, 'format', {
        get: function () {return __get__ (this, function (self) {
            var args = tuple ([] .slice.apply (arguments).slice (1));
            var autoIndex = 0;
            return self.replace (/\{(\w*)\}/g, function (match, key) {
                if (key == '') {
                    key = autoIndex++;
                }
                if (key == +key) {
                    return args [key] == undefined ? match : str (args [key]);
                }
                else {
                    for (var index = 0; index < args.length; index++) {
                        if (typeof args [index] == 'object' && args [index][key] != undefined) {
                            return str (args [index][key]);
                        }
                    }
                    return match;
                }
            });
        });},
        enumerable: true
    });
    String.prototype.isalnum = function () {
        return /^[0-9a-zA-Z]{1,}$/.test(this)
    }
    String.prototype.isalpha = function () {
        return /^[a-zA-Z]{1,}$/.test(this)
    }
    String.prototype.isdecimal = function () {
        return /^[0-9]{1,}$/.test(this)
    }
    String.prototype.isdigit = function () {
        return this.isdecimal()
    }
    String.prototype.islower = function () {
        return /^[a-z]{1,}$/.test(this)
    }
    String.prototype.isupper = function () {
        return /^[A-Z]{1,}$/.test(this)
    }
    String.prototype.isspace = function () {
        return /^[\s]{1,}$/.test(this)
    }
    String.prototype.isnumeric = function () {
        return !isNaN (parseFloat (this)) && isFinite (this);
    };
    String.prototype.join = function (strings) {
        return strings.join (this);
    };
    String.prototype.lower = function () {
        return this.toLowerCase ();
    };
    String.prototype.py_replace = function (old, aNew, maxreplace) {
        return this.split (old, maxreplace) .join (aNew);
    };
    String.prototype.lstrip = function () {
        return this.replace (/^\s*/g, '');
    };
    String.prototype.rfind = function (sub, start) {
        return this.lastIndexOf (sub, start);
    };
    String.prototype.rsplit = function (sep, maxsplit) {
        if (sep == undefined || sep == null) {
            sep = /\s+/;
            var stripped = this.strip ();
        }
        else {
            var stripped = this;
        }
        if (maxsplit == undefined || maxsplit == -1) {
            return stripped.split (sep);
        }
        else {
            var result = stripped.split (sep);
            if (maxsplit < result.length) {
                var maxrsplit = result.length - maxsplit;
                return [result.slice (0, maxrsplit) .join (sep)] .concat (result.slice (maxrsplit));
            }
            else {
                return result;
            }
        }
    };
    String.prototype.rstrip = function () {
        return this.replace (/\s*$/g, '');
    };
    String.prototype.py_split = function (sep, maxsplit) {
        if (sep == undefined || sep == null) {
            sep = /\s+/;
            var stripped = this.strip ();
        }
        else {
            var stripped = this;
        }
        if (maxsplit == undefined || maxsplit == -1) {
            return stripped.split (sep);
        }
        else {
            var result = stripped.split (sep);
            if (maxsplit < result.length) {
                return result.slice (0, maxsplit).concat ([result.slice (maxsplit).join (sep)]);
            }
            else {
                return result;
            }
        }
    };
    String.prototype.startswith = function (prefix) {
        if (prefix instanceof Array) {
            for (var i=0;i<prefix.length;i++) {
                if (this.indexOf (prefix [i]) == 0)
                    return true;
            }
        } else
            return this.indexOf (prefix) == 0;
        return false;
    };
    String.prototype.strip = function () {
        return this.trim ();
    };
    String.prototype.upper = function () {
        return this.toUpperCase ();
    };
    String.prototype.__mul__ = function (scalar) {
        var result = '';
        for (var i = 0; i < scalar; i++) {
            result = result + this;
        }
        return result;
    };
    String.prototype.__rmul__ = String.prototype.__mul__;
    function __contains__ (element) {
        return this.hasOwnProperty (element);
    }
    function __keys__ () {
        var keys = [];
        for (var attrib in this) {
            if (!__specialattrib__ (attrib)) {
                keys.push (attrib);
            }
        }
        return keys;
    }
    function __items__ () {
        var items = [];
        for (var attrib in this) {
            if (!__specialattrib__ (attrib)) {
                items.push ([attrib, this [attrib]]);
            }
        }
        return items;
    }
    function __del__ (key) {
        delete this [key];
    }
    function __clear__ () {
        for (var attrib in this) {
            delete this [attrib];
        }
    }
    function __getdefault__ (aKey, aDefault) {
        var result = this [aKey];
        if (result == undefined) {
            result = this ['py_' + aKey]
        }
        return result == undefined ? (aDefault == undefined ? null : aDefault) : result;
    }
    function __setdefault__ (aKey, aDefault) {
        var result = this [aKey];
        if (result != undefined) {
            return result;
        }
        var val = aDefault == undefined ? null : aDefault;
        this [aKey] = val;
        return val;
    }
    function __pop__ (aKey, aDefault) {
        var result = this [aKey];
        if (result != undefined) {
            delete this [aKey];
            return result;
        } else {
            if ( aDefault === undefined ) {
                throw KeyError (aKey, new Error());
            }
        }
        return aDefault;
    }
    function __popitem__ () {
        var aKey = Object.keys (this) [0];
        if (aKey == null) {
            throw KeyError ("popitem(): dictionary is empty", new Error ());
        }
        var result = tuple ([aKey, this [aKey]]);
        delete this [aKey];
        return result;
    }
    function __update__ (aDict) {
        for (var aKey in aDict) {
            this [aKey] = aDict [aKey];
        }
    }
    function __values__ () {
        var values = [];
        for (var attrib in this) {
            if (!__specialattrib__ (attrib)) {
                values.push (this [attrib]);
            }
        }
        return values;
    }
    function __dgetitem__ (aKey) {
        return this [aKey];
    }
    function __dsetitem__ (aKey, aValue) {
        this [aKey] = aValue;
    }
    function dict (objectOrPairs) {
        var instance = {};
        if (!objectOrPairs || objectOrPairs instanceof Array) {
            if (objectOrPairs) {
                for (var index = 0; index < objectOrPairs.length; index++) {
                    var pair = objectOrPairs [index];
                    if ( !(pair instanceof Array) || pair.length != 2) {
                        throw ValueError(
                            "dict update sequence element #" + index +
                            " has length " + pair.length +
                            "; 2 is required", new Error());
                    }
                    var key = pair [0];
                    var val = pair [1];
                    if (!(objectOrPairs instanceof Array) && objectOrPairs instanceof Object) {
                         if (!isinstance (objectOrPairs, dict)) {
                             val = dict (val);
                         }
                    }
                    instance [key] = val;
                }
            }
        }
        else {
            if (isinstance (objectOrPairs, dict)) {
                var aKeys = objectOrPairs.py_keys ();
                for (var index = 0; index < aKeys.length; index++ ) {
                    var key = aKeys [index];
                    instance [key] = objectOrPairs [key];
                }
            } else if (objectOrPairs instanceof Object) {
                instance = objectOrPairs;
            } else {
                throw ValueError ("Invalid type of object for dict creation", new Error ());
            }
        }
        __setProperty__ (instance, '__class__', {value: dict, enumerable: false, writable: true});
        __setProperty__ (instance, '__contains__', {value: __contains__, enumerable: false});
        __setProperty__ (instance, 'py_keys', {value: __keys__, enumerable: false});
        __setProperty__ (instance, '__iter__', {value: function () {new __PyIterator__ (this.py_keys ());}, enumerable: false});
        __setProperty__ (instance, Symbol.iterator, {value: function () {new __JsIterator__ (this.py_keys ());}, enumerable: false});
        __setProperty__ (instance, 'py_items', {value: __items__, enumerable: false});
        __setProperty__ (instance, 'py_del', {value: __del__, enumerable: false});
        __setProperty__ (instance, 'py_clear', {value: __clear__, enumerable: false});
        __setProperty__ (instance, 'py_get', {value: __getdefault__, enumerable: false});
        __setProperty__ (instance, 'py_setdefault', {value: __setdefault__, enumerable: false});
        __setProperty__ (instance, 'py_pop', {value: __pop__, enumerable: false});
        __setProperty__ (instance, 'py_popitem', {value: __popitem__, enumerable: false});
        __setProperty__ (instance, 'py_update', {value: __update__, enumerable: false});
        __setProperty__ (instance, 'py_values', {value: __values__, enumerable: false});
        __setProperty__ (instance, '__getitem__', {value: __dgetitem__, enumerable: false});
        __setProperty__ (instance, '__setitem__', {value: __dsetitem__, enumerable: false});
        return instance;
    }
    __all__.dict = dict;
    dict.__name__ = 'dict';
    dict.__bases__ = [object];
    function __setdoc__ (docString) {
        this.__doc__ = docString;
        return this;
    }
    __setProperty__ (Function.prototype, '__setdoc__', {value: __setdoc__, enumerable: false});
    var __jsmod__ = function (a, b) {
        if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rmod__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return a % b;
        }
    };
    __all__.__jsmod__ = __jsmod__;
    var __mod__ = function (a, b) {
        if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rmod__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return ((a % b) + b) % b;
        }
    };
    __all__.mod = __mod__;
    var __pow__ = function (a, b) {
        if (typeof a == 'object' && '__pow__' in a) {
            return a.__pow__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rpow__ (a);
        }
        else {
            return Math.pow (a, b);
        }
    };
    __all__.pow = __pow__;
    var __neg__ = function (a) {
        if (typeof a == 'object' && '__neg__' in a) {
            return a.__neg__ ();
        }
        else {
            return -a;
        }
    };
    __all__.__neg__ = __neg__;
    var __matmul__ = function (a, b) {
        return a.__matmul__ (b);
    };
    __all__.__matmul__ = __matmul__;
    var __mul__ = function (a, b) {
        if (typeof a == 'object' && '__mul__' in a) {
            return a.__mul__ (b);
        }
        else if (typeof b == 'object' && '__rmul__' in b) {
            return b.__rmul__ (a);
        }
        else if (typeof a == 'string') {
            return a.__mul__ (b);
        }
        else if (typeof b == 'string') {
            return b.__rmul__ (a);
        }
        else {
            return a * b;
        }
    };
    __all__.__mul__ = __mul__;
    var __truediv__ = function (a, b) {
        if (typeof a == 'object' && '__truediv__' in a) {
            return a.__truediv__ (b);
        }
        else if (typeof b == 'object' && '__rtruediv__' in b) {
            return b.__rtruediv__ (a);
        }
        else if (typeof a == 'object' && '__div__' in a) {
            return a.__div__ (b);
        }
        else if (typeof b == 'object' && '__rdiv__' in b) {
            return b.__rdiv__ (a);
        }
        else {
            return a / b;
        }
    };
    __all__.__truediv__ = __truediv__;
    var __floordiv__ = function (a, b) {
        if (typeof a == 'object' && '__floordiv__' in a) {
            return a.__floordiv__ (b);
        }
        else if (typeof b == 'object' && '__rfloordiv__' in b) {
            return b.__rfloordiv__ (a);
        }
        else if (typeof a == 'object' && '__div__' in a) {
            return a.__div__ (b);
        }
        else if (typeof b == 'object' && '__rdiv__' in b) {
            return b.__rdiv__ (a);
        }
        else {
            return Math.floor (a / b);
        }
    };
    __all__.__floordiv__ = __floordiv__;
    var __add__ = function (a, b) {
        if (typeof a == 'object' && '__add__' in a) {
            return a.__add__ (b);
        }
        else if (typeof b == 'object' && '__radd__' in b) {
            return b.__radd__ (a);
        }
        else {
            return a + b;
        }
    };
    __all__.__add__ = __add__;
    var __sub__ = function (a, b) {
        if (typeof a == 'object' && '__sub__' in a) {
            return a.__sub__ (b);
        }
        else if (typeof b == 'object' && '__rsub__' in b) {
            return b.__rsub__ (a);
        }
        else {
            return a - b;
        }
    };
    __all__.__sub__ = __sub__;
    var __lshift__ = function (a, b) {
        if (typeof a == 'object' && '__lshift__' in a) {
            return a.__lshift__ (b);
        }
        else if (typeof b == 'object' && '__rlshift__' in b) {
            return b.__rlshift__ (a);
        }
        else {
            return a << b;
        }
    };
    __all__.__lshift__ = __lshift__;
    var __rshift__ = function (a, b) {
        if (typeof a == 'object' && '__rshift__' in a) {
            return a.__rshift__ (b);
        }
        else if (typeof b == 'object' && '__rrshift__' in b) {
            return b.__rrshift__ (a);
        }
        else {
            return a >> b;
        }
    };
    __all__.__rshift__ = __rshift__;
    var __or__ = function (a, b) {
        if (typeof a == 'object' && '__or__' in a) {
            return a.__or__ (b);
        }
        else if (typeof b == 'object' && '__ror__' in b) {
            return b.__ror__ (a);
        }
        else {
            return a | b;
        }
    };
    __all__.__or__ = __or__;
    var __xor__ = function (a, b) {
        if (typeof a == 'object' && '__xor__' in a) {
            return a.__xor__ (b);
        }
        else if (typeof b == 'object' && '__rxor__' in b) {
            return b.__rxor__ (a);
        }
        else {
            return a ^ b;
        }
    };
    __all__.__xor__ = __xor__;
    var __and__ = function (a, b) {
        if (typeof a == 'object' && '__and__' in a) {
            return a.__and__ (b);
        }
        else if (typeof b == 'object' && '__rand__' in b) {
            return b.__rand__ (a);
        }
        else {
            return a & b;
        }
    };
    __all__.__and__ = __and__;
    var __eq__ = function (a, b) {
        if (typeof a == 'object' && '__eq__' in a) {
            return a.__eq__ (b);
        }
        else {
            return a == b;
        }
    };
    __all__.__eq__ = __eq__;
    var __ne__ = function (a, b) {
        if (typeof a == 'object' && '__ne__' in a) {
            return a.__ne__ (b);
        }
        else {
            return a != b
        }
    };
    __all__.__ne__ = __ne__;
    var __lt__ = function (a, b) {
        if (typeof a == 'object' && '__lt__' in a) {
            return a.__lt__ (b);
        }
        else {
            return a < b;
        }
    };
    __all__.__lt__ = __lt__;
    var __le__ = function (a, b) {
        if (typeof a == 'object' && '__le__' in a) {
            return a.__le__ (b);
        }
        else {
            return a <= b;
        }
    };
    __all__.__le__ = __le__;
    var __gt__ = function (a, b) {
        if (typeof a == 'object' && '__gt__' in a) {
            return a.__gt__ (b);
        }
        else {
            return a > b;
        }
    };
    __all__.__gt__ = __gt__;
    var __ge__ = function (a, b) {
        if (typeof a == 'object' && '__ge__' in a) {
            return a.__ge__ (b);
        }
        else {
            return a >= b;
        }
    };
    __all__.__ge__ = __ge__;
    var __imatmul__ = function (a, b) {
        if ('__imatmul__' in a) {
            return a.__imatmul__ (b);
        }
        else {
            return a.__matmul__ (b);
        }
    };
    __all__.__imatmul__ = __imatmul__;
    var __ipow__ = function (a, b) {
        if (typeof a == 'object' && '__pow__' in a) {
            return a.__ipow__ (b);
        }
        else if (typeof a == 'object' && '__ipow__' in a) {
            return a.__pow__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rpow__ (a);
        }
        else {
            return Math.pow (a, b);
        }
    };
    __all__.ipow = __ipow__;
    var __ijsmod__ = function (a, b) {
        if (typeof a == 'object' && '__imod__' in a) {
            return a.__ismod__ (b);
        }
        else if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rpow__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return a % b;
        }
    };
    __all__.ijsmod__ = __ijsmod__;
    var __imod__ = function (a, b) {
        if (typeof a == 'object' && '__imod__' in a) {
            return a.__imod__ (b);
        }
        else if (typeof a == 'object' && '__mod__' in a) {
            return a.__mod__ (b);
        }
        else if (typeof b == 'object' && '__rmod__' in b) {
            return b.__rmod__ (a);
        }
        else {
            return ((a % b) + b) % b;
        }
    };
    __all__.imod = __imod__;
    var __imul__ = function (a, b) {
        if (typeof a == 'object' && '__imul__' in a) {
            return a.__imul__ (b);
        }
        else if (typeof a == 'object' && '__mul__' in a) {
            return a = a.__mul__ (b);
        }
        else if (typeof b == 'object' && '__rmul__' in b) {
            return a = b.__rmul__ (a);
        }
        else if (typeof a == 'string') {
            return a = a.__mul__ (b);
        }
        else if (typeof b == 'string') {
            return a = b.__rmul__ (a);
        }
        else {
            return a *= b;
        }
    };
    __all__.__imul__ = __imul__;
    var __idiv__ = function (a, b) {
        if (typeof a == 'object' && '__idiv__' in a) {
            return a.__idiv__ (b);
        }
        else if (typeof a == 'object' && '__div__' in a) {
            return a = a.__div__ (b);
        }
        else if (typeof b == 'object' && '__rdiv__' in b) {
            return a = b.__rdiv__ (a);
        }
        else {
            return a /= b;
        }
    };
    __all__.__idiv__ = __idiv__;
    var __iadd__ = function (a, b) {
        if (typeof a == 'object' && '__iadd__' in a) {
            return a.__iadd__ (b);
        }
        else if (typeof a == 'object' && '__add__' in a) {
            return a = a.__add__ (b);
        }
        else if (typeof b == 'object' && '__radd__' in b) {
            return a = b.__radd__ (a);
        }
        else {
            return a += b;
        }
    };
    __all__.__iadd__ = __iadd__;
    var __isub__ = function (a, b) {
        if (typeof a == 'object' && '__isub__' in a) {
            return a.__isub__ (b);
        }
        else if (typeof a == 'object' && '__sub__' in a) {
            return a = a.__sub__ (b);
        }
        else if (typeof b == 'object' && '__rsub__' in b) {
            return a = b.__rsub__ (a);
        }
        else {
            return a -= b;
        }
    };
    __all__.__isub__ = __isub__;
    var __ilshift__ = function (a, b) {
        if (typeof a == 'object' && '__ilshift__' in a) {
            return a.__ilshift__ (b);
        }
        else if (typeof a == 'object' && '__lshift__' in a) {
            return a = a.__lshift__ (b);
        }
        else if (typeof b == 'object' && '__rlshift__' in b) {
            return a = b.__rlshift__ (a);
        }
        else {
            return a <<= b;
        }
    };
    __all__.__ilshift__ = __ilshift__;
    var __irshift__ = function (a, b) {
        if (typeof a == 'object' && '__irshift__' in a) {
            return a.__irshift__ (b);
        }
        else if (typeof a == 'object' && '__rshift__' in a) {
            return a = a.__rshift__ (b);
        }
        else if (typeof b == 'object' && '__rrshift__' in b) {
            return a = b.__rrshift__ (a);
        }
        else {
            return a >>= b;
        }
    };
    __all__.__irshift__ = __irshift__;
    var __ior__ = function (a, b) {
        if (typeof a == 'object' && '__ior__' in a) {
            return a.__ior__ (b);
        }
        else if (typeof a == 'object' && '__or__' in a) {
            return a = a.__or__ (b);
        }
        else if (typeof b == 'object' && '__ror__' in b) {
            return a = b.__ror__ (a);
        }
        else {
            return a |= b;
        }
    };
    __all__.__ior__ = __ior__;
    var __ixor__ = function (a, b) {
        if (typeof a == 'object' && '__ixor__' in a) {
            return a.__ixor__ (b);
        }
        else if (typeof a == 'object' && '__xor__' in a) {
            return a = a.__xor__ (b);
        }
        else if (typeof b == 'object' && '__rxor__' in b) {
            return a = b.__rxor__ (a);
        }
        else {
            return a ^= b;
        }
    };
    __all__.__ixor__ = __ixor__;
    var __iand__ = function (a, b) {
        if (typeof a == 'object' && '__iand__' in a) {
            return a.__iand__ (b);
        }
        else if (typeof a == 'object' && '__and__' in a) {
            return a = a.__and__ (b);
        }
        else if (typeof b == 'object' && '__rand__' in b) {
            return a = b.__rand__ (a);
        }
        else {
            return a &= b;
        }
    };
    __all__.__iand__ = __iand__;
    var __getitem__ = function (container, key) {
        if (typeof container == 'object' && '__getitem__' in container) {
            return container.__getitem__ (key);
        }
        else if ((typeof container == 'string' || container instanceof Array) && key < 0) {
            return container [container.length + key];
        }
        else {
            return container [key];
        }
    };
    __all__.__getitem__ = __getitem__;
    var __setitem__ = function (container, key, value) {
        if (typeof container == 'object' && '__setitem__' in container) {
            container.__setitem__ (key, value);
        }
        else if ((typeof container == 'string' || container instanceof Array) && key < 0) {
            container [container.length + key] = value;
        }
        else {
            container [key] = value;
        }
    };
    __all__.__setitem__ = __setitem__;
    var __getslice__ = function (container, lower, upper, step) {
        if (typeof container == 'object' && '__getitem__' in container) {
            return container.__getitem__ ([lower, upper, step]);
        }
        else {
            return container.__getslice__ (lower, upper, step);
        }
    };
    __all__.__getslice__ = __getslice__;
    var __setslice__ = function (container, lower, upper, step, value) {
        if (typeof container == 'object' && '__setitem__' in container) {
            container.__setitem__ ([lower, upper, step], value);
        }
        else {
            container.__setslice__ (lower, upper, step, value);
        }
    };
    __all__.__setslice__ = __setslice__;
	__nest__ (
		__all__,
		'basicboard', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'basicboard';
					var e = __init__ (__world__.dom).e;
					var Div = __init__ (__world__.dom).Div;
					var TextInput = __init__ (__world__.dom).TextInput;
					var Canvas = __init__ (__world__.dom).Canvas;
					var TextArea = __init__ (__world__.dom).TextArea;
					var Slider = __init__ (__world__.dom).Slider;
					var Table = __init__ (__world__.dom).Table;
					var Tr = __init__ (__world__.dom).Tr;
					var Td = __init__ (__world__.dom).Td;
					var Vect = __init__ (__world__.utils).Vect;
					var cpick = __init__ (__world__.utils).cpick;
					var xor = __init__ (__world__.utils).xor;
					var scorecolor = __init__ (__world__.utils).scorecolor;
					var scoreverbal = __init__ (__world__.utils).scoreverbal;
					var getconn = __init__ (__world__.connection).getconn;
					var STANDARD_START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
					var ANTICHESS_START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1';
					var RACING_KINGS_START_FEN = '8/8/8/8/8/8/krbnNBRK/qrbnNBRQ w - - 0 1';
					var HORDE_START_FEN = 'rnbqkbnr/pppppppp/8/1PP2PP1/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP w kq - 0 1';
					var THREE_CHECK_START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 3+3 0 1';
					var CRAZYHOUSE_START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR[] w KQkq - 0 1';
					var PIECE_KINDS = list (['p', 'n', 'b', 'r', 'q', 'k']);
					var WHITE = 1;
					var BLACK = 0;
					var VARIANT_OPTIONS = list ([list (['standard', 'Standard']), list (['fromPosition', 'From Position']), list (['antichess', 'Antichess']), list (['atomic', 'Atomic']), list (['chess960', 'Chess960']), list (['crazyhouse', 'Crazyhouse']), list (['horde', 'Horde']), list (['kingOfTheHill', 'King of the Hill']), list (['racingKings', 'Racing Kings']), list (['threeCheck', 'Three Check'])]);
					var PIECE_NAMES = dict ({'p': 'Pawn', 'n': 'Knight', 'b': 'Bishop', 'r': 'Rook', 'q': 'Queen', 'k': 'King'});
					var PROMPIECEKINDS_STANDARD = list (['n', 'b', 'r', 'q']);
					var PROMPIECEKINDS_ANTICHESS = list (['n', 'b', 'r', 'q', 'k']);
					var prompiecekindsforvariantkey = function (variantkey) {
						if (variantkey == 'antichess') {
							return PROMPIECEKINDS_ANTICHESS;
						}
						return PROMPIECEKINDS_STANDARD;
					};
					var piececolortocolorname = function (color) {
						if (color == WHITE) {
							return 'White';
						}
						else if (color == BLACK) {
							return 'Black';
						}
						return 'Invalidcolor';
					};
					var piecekindtopiecename = function (kind) {
						if (__in__ (kind, PIECE_NAMES)) {
							return PIECE_NAMES [kind];
						}
						return 'Invalidpiece';
					};
					var getstartfenforvariantkey = function (variantkey) {
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
					var Piece = __class__ ('Piece', [object], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, kind, color) {
							if (typeof kind == 'undefined' || (kind != null && kind .hasOwnProperty ("__kwargtrans__"))) {;
								var kind = null;
							};
							if (typeof color == 'undefined' || (color != null && color .hasOwnProperty ("__kwargtrans__"))) {;
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
					var isvalidpieceletter = function (pieceletter) {
						if (__in__ (pieceletter, PIECE_KINDS)) {
							return true;
						}
						if (__in__ (pieceletter.toLowerCase (), PIECE_KINDS)) {
							return true;
						}
						return false;
					};
					var piecelettertopiece = function (pieceletter) {
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
					var getclassforpiece = function (p, style) {
						var kind = p.kind;
						if (p.color == WHITE) {
							var kind = 'w' + kind;
						}
						return (style + 'piece') + kind;
					};
					var Square = __class__ ('Square', [object], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, file, rank) {
							self.file = file;
							self.rank = rank;
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
					var Move = __class__ ('Move', [object], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, fromsq, tosq, prompiece) {
							if (typeof prompiece == 'undefined' || (prompiece != null && prompiece .hasOwnProperty ("__kwargtrans__"))) {;
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
					var PieceStore = __class__ ('PieceStore', [e], {
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
							var __iterable0__ = self.store.py_split ('');
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var pieceletter = __iterable0__ [__index0__];
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
							var __iterable0__ = self.pieces.py_items ();
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var __left0__ = __iterable0__ [__index0__];
								var pkind = __left0__ [0];
								var pdesc = __left0__ [1];
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
					var BasicBoard = __class__ ('BasicBoard', [e], {
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
							var squarelist = list ([]);
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
							var __iterable0__ = self.squarelist ();
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var sq = __iterable0__ [__index0__];
								var sqclass = cpick (self.islightsquare (sq), 'boardsquarelight', 'boardsquaredark');
								var sqdiv = Div ().ac (list (['boardsquare', sqclass])).w (self.squaresize).h (self.squaresize);
								var fasq = self.flipawaresquare (sq);
								sqdiv.pv (self.squarecoordsvect (fasq));
								sqdiv.ae ('dragover', self.piecedragoverfactory (sq));
								sqdiv.ae ('drop', self.piecedropfactory (sq));
								self.container.a (sqdiv);
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
											lifesdiv.c (list (['#ff0', '#ff0']) [p.color]);
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
							var __iterable0__ = ppks;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var ppk = __iterable0__ [__index0__];
								var fapromsq = self.flipawaresquare (promsq);
								var pp = Piece (ppk, self.turn ());
								var psqdiv = Div ().pa ().cp ().zi (150).w (self.squaresize).h (self.squaresize).ac ('boardpromotionsquare');
								psqdiv.pv (self.squarecoordsvect (fapromsq));
								var ppdiv = Div ().pa ().cp ().zi (200).w (self.piecesize).h (self.piecesize).ac (getclassforpiece (pp, self.piecestyle));
								ppdiv.pv (self.piececoordsvect (fapromsq)).ae ('mousedown', self.prompiececlickedfactory (ppk));
								self.container.a (list ([psqdiv, ppdiv]));
								var promsq = promsq.p (Square (0, dir));
							}
						});},
						get promotecancelclick () {return __get__ (this, function (self) {
							self.promoting = false;
							self.build ();
						});},
						get drawmovearrow () {return __get__ (this, function (self, move, args) {
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
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
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
								var args = dict ({});
							};
							self.drawmovearrow (self.ucitomove (uci), args);
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
									self.sectioncontainer.a (list ([self.whitestorediv, self.outercontainer, self.blackstorediv]));
								}
								else {
									self.sectioncontainer.a (list ([self.blackstorediv, self.outercontainer, self.whitestorediv]));
								}
							}
							else {
								self.sectioncontainer.a (list ([self.outercontainer]));
							}
							if (self.showfen) {
								self.sectioncontainer.a (self.fendiv);
							}
							self.x ().a (self.sectioncontainer);
							self.movecanvas = Canvas (self.width, self.height).pa ().t (0).l (0);
							self.movecanvashook = Div ().pa ().t (0).l (0).zi (5).op (0.5);
							self.piececanvashook = Div ().pa ().t (0).l (0).zi (11).op (0.5);
							self.container.a (list ([self.movecanvashook, self.piececanvashook]));
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
							var __iterable0__ = rawfenparts;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var rawfenpart = __iterable0__ [__index0__];
								var pieceletters = rawfenpart.py_split ('');
								var __iterable1__ = pieceletters;
								for (var __index1__ = 0; __index1__ < len (__iterable1__); __index1__++) {
									var pieceletter = __iterable1__ [__index1__];
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
							if (typeof positioninfo == 'undefined' || (positioninfo != null && positioninfo .hasOwnProperty ("__kwargtrans__"))) {;
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
					var MultipvInfo = __class__ ('MultipvInfo', [e], {
						__module__: __name__,
						get bestmovesanclickedfactory () {return __get__ (this, function (self, moveuci) {
							var bestmovesanclicked = function () {
								if (!(self.bestmovesanclickedcallback === null)) {
									self.bestmovesanclickedcallback (moveuci);
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
						get build () {return __get__ (this, function (self) {
							self.bestmoveuci = self.infoi ['bestmoveuci'];
							self.bestmovesan = self.infoi ['bestmovesan'];
							self.scorenumerical = self.infoi ['scorenumerical'];
							self.pvsan = self.infoi ['pvsan'];
							self.pvpgn = self.infoi ['pvpgn'];
							self.depth = self.infoi ['depth'];
							self.nps = self.infoi ['nps'];
							self.container = Div ().ac ('multipvinfocontainer');
							self.idiv = Div ().ac ('multipvinfoi').html ('{}.'.format (self.i));
							self.bestmovesandiv = Div ().ac ('multipvinfobestmovesan').html (self.bestmovesan);
							self.bestmovesandiv.ae ('mousedown', self.bestmovesanclickedfactory (self.bestmoveuci));
							self.scorenumericaldiv = Div ().ac ('multipvinfoscorenumerical').html ('{}'.format (scoreverbal (self.effscore ())));
							self.bonussliderdiv = Div ().ac ('multipvinfobonussliderdiv');
							self.bonusslider = Slider ().setmin (-(500)).setmax (500).ac ('multipvinfobonusslider').sv (self.scorebonus ());
							self.bonusslider.ae ('change', self.bonussliderchanged);
							self.bonussliderdiv.a (self.bonusslider);
							self.depthdiv = Div ().ac ('multipvinfodepth').html ('{}'.format (self.depth));
							self.miscdiv = Div ().ac ('multipvinfomisc').html ('nps {}'.format (self.nps));
							self.pvdiv = Div ().ac ('multipvinfopv').html (self.pvpgn);
							self.container.a (list ([self.idiv, self.bestmovesandiv, self.scorenumericaldiv, self.bonussliderdiv, self.depthdiv, self.miscdiv, self.pvdiv]));
							self.bestmovesandiv.c (scorecolor (self.effscore ()));
							self.scorenumericaldiv.c (scorecolor (self.effscore ()));
							self.x ().a (self.container);
						});},
						get __init__ () {return __get__ (this, function (self, infoi) {
							__super__ (MultipvInfo, '__init__') (self, 'div');
							self.bestmovesanclickedcallback = null;
							self.bonussliderchangedcallback = null;
							self.infoi = infoi;
							self.i = self.infoi ['i'];
							self.build ();
						});}
					});
					var PgnInfo = __class__ ('PgnInfo', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, parent) {
							__super__ (PgnInfo, '__init__') (self, 'div');
							self.headers = list ([]);
							self.parent = parent;
						});},
						get getheader () {return __get__ (this, function (self, key, py_default) {
							var __iterable0__ = self.headers;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var header = __iterable0__ [__index0__];
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
							self.headers = list ([]);
							var __iterable0__ = lines;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var line = __iterable0__ [__index0__];
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
							self.parent.pgntext.setpgn (self.content);
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
									return list ([self.whiteelo, self.whiteratingdiff]);
								}
								return list ([self.blackelo, self.blackratingdiff]);
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
							self.a (list ([self.tcdiv, self.whitediv, self.whiteelodiv, self.blackdiv, self.blackelodiv, self.resultdiv, self.iddiv]));
							return self;
						});},
						get setcontent () {return __get__ (this, function (self, content) {
							self.content = content;
							self.parsecontent ();
							return self.build ();
						});}
					});
					var CandleStickChart = __class__ ('CandleStickChart', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, args) {
							__super__ (CandleStickChart, '__init__') (self, 'div');
							self.BARWIDTH = args.py_get ('barwidth', 20);
							self.BARSEPARATION = int (self.BARWIDTH * 1.1);
							self.YHEIGHT = args.py_get ('yheight', 2);
							self.CLUSTER = args.py_get ('cluster', 50);
							self.data = args.py_get ('data', list ([]));
							var first = true;
							var __iterable0__ = self.data;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var d = __iterable0__ [__index0__];
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
								self.a (list ([linediv, ratingdiv]));
							}
							var i = 0;
							var __iterable0__ = self.data;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var d = __iterable0__ [__index0__];
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
								self.a (list ([minmaxdiv, bardiv]));
								i++;
							}
						});}
					});
					var PgnList = __class__ ('PgnList', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, parent) {
							__super__ (PgnList, '__init__') (self, 'div');
							self.parent = parent;
						});},
						get build () {return __get__ (this, function (self) {
							self.x ();
							var first = true;
							var dateinfos = list ([]);
							var __iterable0__ = self.gamecontents;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var gamecontent = __iterable0__ [__index0__];
								var pi = PgnInfo (self.parent).setcontent (gamecontent);
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
							var __iterable0__ = dateinfos;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var info = __iterable0__ [__index0__];
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
					var PgnText = __class__ ('PgnText', [e], {
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
					__pragma__ ('<use>' +
						'connection' +
						'dom' +
						'utils' +
					'</use>')
					__pragma__ ('<all>')
						__all__.ANTICHESS_START_FEN = ANTICHESS_START_FEN;
						__all__.BLACK = BLACK;
						__all__.BasicBoard = BasicBoard;
						__all__.CRAZYHOUSE_START_FEN = CRAZYHOUSE_START_FEN;
						__all__.CandleStickChart = CandleStickChart;
						__all__.Canvas = Canvas;
						__all__.Div = Div;
						__all__.HORDE_START_FEN = HORDE_START_FEN;
						__all__.Move = Move;
						__all__.MultipvInfo = MultipvInfo;
						__all__.PIECE_KINDS = PIECE_KINDS;
						__all__.PIECE_NAMES = PIECE_NAMES;
						__all__.PROMPIECEKINDS_ANTICHESS = PROMPIECEKINDS_ANTICHESS;
						__all__.PROMPIECEKINDS_STANDARD = PROMPIECEKINDS_STANDARD;
						__all__.PgnInfo = PgnInfo;
						__all__.PgnList = PgnList;
						__all__.PgnText = PgnText;
						__all__.Piece = Piece;
						__all__.PieceStore = PieceStore;
						__all__.RACING_KINGS_START_FEN = RACING_KINGS_START_FEN;
						__all__.STANDARD_START_FEN = STANDARD_START_FEN;
						__all__.Slider = Slider;
						__all__.Square = Square;
						__all__.THREE_CHECK_START_FEN = THREE_CHECK_START_FEN;
						__all__.Table = Table;
						__all__.Td = Td;
						__all__.TextArea = TextArea;
						__all__.TextInput = TextInput;
						__all__.Tr = Tr;
						__all__.VARIANT_OPTIONS = VARIANT_OPTIONS;
						__all__.Vect = Vect;
						__all__.WHITE = WHITE;
						__all__.__name__ = __name__;
						__all__.cpick = cpick;
						__all__.e = e;
						__all__.getclassforpiece = getclassforpiece;
						__all__.getconn = getconn;
						__all__.getstartfenforvariantkey = getstartfenforvariantkey;
						__all__.isvalidpieceletter = isvalidpieceletter;
						__all__.piececolortocolorname = piececolortocolorname;
						__all__.piecekindtopiecename = piecekindtopiecename;
						__all__.piecelettertopiece = piecelettertopiece;
						__all__.prompiecekindsforvariantkey = prompiecekindsforvariantkey;
						__all__.scorecolor = scorecolor;
						__all__.scoreverbal = scoreverbal;
						__all__.xor = xor;
					__pragma__ ('</all>')
				}
			}
		}
	);

	__nest__ (
		__all__,
		'board', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'board';
					var e = __init__ (__world__.dom).e;
					var Div = __init__ (__world__.dom).Div;
					var Button = __init__ (__world__.dom).Button;
					var ComboBox = __init__ (__world__.dom).ComboBox;
					var TextArea = __init__ (__world__.dom).TextArea;
					var Span = __init__ (__world__.dom).Span;
					var cpick = __init__ (__world__.utils).cpick;
					var View = __init__ (__world__.utils).View;
					var getglobalcssvarpxint = __init__ (__world__.utils).getglobalcssvarpxint;
					var uci_variant_to_variantkey = __init__ (__world__.utils).uci_variant_to_variantkey;
					var scorecolor = __init__ (__world__.utils).scorecolor;
					var IS_PROD = __init__ (__world__.utils).IS_PROD;
					var scoreverbal = __init__ (__world__.utils).scoreverbal;
					var BasicBoard = __init__ (__world__.basicboard).BasicBoard;
					var VARIANT_OPTIONS = __init__ (__world__.basicboard).VARIANT_OPTIONS;
					var PgnText = __init__ (__world__.basicboard).PgnText;
					var PgnList = __init__ (__world__.basicboard).PgnList;
					var PgnInfo = __init__ (__world__.basicboard).PgnInfo;
					var MultipvInfo = __init__ (__world__.basicboard).MultipvInfo;
					var TabPane = __init__ (__world__.widgets).TabPane;
					var Tab = __init__ (__world__.widgets).Tab;
					var SplitPane = __init__ (__world__.widgets).SplitPane;
					var Log = __init__ (__world__.widgets).Log;
					var LogItem = __init__ (__world__.widgets).LogItem;
					var getconn = __init__ (__world__.connection).getconn;
					var lichapiget = __init__ (__world__.connection).lichapiget;
					var LICH_API_GAMES_EXPORT = __init__ (__world__.connection).LICH_API_GAMES_EXPORT;
					var Board = __class__ ('Board', [e], {
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
							if (typeof positioninfo == 'undefined' || (positioninfo != null && positioninfo .hasOwnProperty ("__kwargtrans__"))) {;
								var positioninfo = dict ({});
							};
							if (typeof edithistory == 'undefined' || (edithistory != null && edithistory .hasOwnProperty ("__kwargtrans__"))) {;
								var edithistory = true;
							};
							var restartanalysis = false;
							if (self.analyzing.py_get ()) {
								self.stopanalyzecallback ();
								var restartanalysis = true;
							}
							if (edithistory && __in__ ('genmove', positioninfo)) {
								var genmove = positioninfo ['genmove'];
								if (genmove == 'reset') {
									self.history = list ([]);
								}
								else {
									self.history.append (dict ({'fen': self.basicboard.fen, 'positioninfo': self.positioninfo}));
								}
							}
							self.positioninfo = positioninfo;
							self.movelist = cpick (__in__ ('movelist', self.positioninfo), self.positioninfo ['movelist'], list ([]));
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
						get posclickedfactory () {return __get__ (this, function (self, i) {
							var poslicked = function () {
								self.gamei = i;
								var pinfo = self.positioninfos [i];
								self.setfromfen (pinfo ['fen'], pinfo ['positioninfo']);
								for (var j = 0; j < len (self.positioninfos); j++) {
									self.posdivs [j].arc (j == self.gamei, 'boardposdivselected');
								}
								self.history = list ([]);
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
						get buildgame () {return __get__ (this, function (self) {
							self.gamediv.x ();
							self.posdivs = list ([]);
							var i = 0;
							var __iterable0__ = self.positioninfos;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var pinfo = __iterable0__ [__index0__];
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
								posdiv.a (list ([movediv, fendiv]));
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
							var __iterable0__ = self.entrieslist;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var entry = __iterable0__ [__index0__];
								var uci = entry ['uci'];
								var san = entry ['san'];
								var weight = entry ['weight'];
								var ediv = Div ('pbookediv');
								var ucidiv = Div ('pucidiv').html (uci);
								var sandiv = Div ('psandiv').html (san);
								var weightdiv = Div ('pweightdiv').html (weight);
								ediv.a (list ([sandiv, ucidiv, weightdiv]));
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
								var __iterable0__ = self.posdict ['envvars'];
								for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
									var item = __iterable0__ [__index0__];
									var key = item [0];
									var value = item [1];
									var keydiv = Div ().cp ().fs (10).mar (2).pad (2).bc ('#eee').disp ('inline-block').html (key);
									keydiv.ae ('mousedown', self.setenvvarfactory (key, value));
									var valuediv = Div ().fs (10).pad (2).bc ('#efe').disp ('inline-block').html (value);
									self.envvarsdiv.a (list ([keydiv, valuediv]));
								}
								self.updatesdiv = Div ().ff ('monospace').fs (11);
								self.updatesdiv.a (Div ().disp ('inline-block').pad (3).mt (2).ml (5).bc ('#ffe').html ('buildinfo {}'.format (self.posdict ['buildinfo'])));
								self.updatesdiv.a (Div ().disp ('inline-block').pad (3).mt (2).ml (5).bc ('#fee').html ('lastsync {}'.format (self.posdict ['lastsync'])));
								self.updatesdiv.a (Div ().disp ('inline-block').pad (3).mt (2).ml (5).bc ('#fee').html ('lastupload {}'.format (self.posdict ['lastupload'])));
								self.updatesdiv.a (Div ().disp ('inline-block').pad (3).mt (2).ml (5).bc ('#fee').html ('lastminimax {}'.format (self.posdict ['lastminimax'])));
								self.updatesdiv.a (Div ().disp ('inline-block').pad (3).mt (2).ml (5).bc ('#fee').html ('lastadd {}'.format (self.posdict ['lastadd'])));
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
							var __iterable0__ = self.autoinfo;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var item = __iterable0__ [__index0__];
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
							var kind = response ['kind'];
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
								var positioninfo = response ['positioninfo'];
								self.setfromfen (fen, positioninfo);
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
								self.autoinfo = list ([]);
								for (var move in posdict ['moves']) {
									var movedict = posdict ['moves'] [move];
									var algeb = movedict ['algeb'];
									var score = movedict ['score'];
									var evaluation = movedict ['eval'];
									var haspv = movedict ['haspv'];
									var depth = movedict ['depth'];
									var __iterable0__ = self.positioninfo ['movelist'];
									for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
										var moveinfo = __iterable0__ [__index0__];
										if (moveinfo ['uci'] == algeb) {
											var san = moveinfo ['san'];
											self.autoinfo.append (dict ({'algeb': algeb, 'san': san, 'score': score, 'evaluation': evaluation, 'haspv': haspv, 'depth': depth}));
										}
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
							if (typeof drive == 'undefined' || (drive != null && drive .hasOwnProperty ("__kwargtrans__"))) {;
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
							if (typeof docallback == 'undefined' || (docallback != null && docallback .hasOwnProperty ("__kwargtrans__"))) {;
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
							var __iterable0__ = self.movelist;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var move = __iterable0__ [__index0__];
								var movediv = Div ().ac ('bigboardshowmove').html (move ['san']);
								movediv.ae ('mousedown', self.moveclickedfactory (move));
								self.movelistdiv.a (movediv);
							}
						});},
						get delcallback () {return __get__ (this, function (self) {
							if (len (self.history) > 0) {
								var item = self.history.py_pop ();
								self.setfromfen (item ['fen'], item ['positioninfo'], false);
							}
						});},
						get delallcallback () {return __get__ (this, function (self) {
							while (len (self.history) > 0) {
								var item = self.history.py_pop ();
							}
							self.setfromfen (item ['fen'], item ['positioninfo'], false);
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
							if (typeof all == 'undefined' || (all != null && all .hasOwnProperty ("__kwargtrans__"))) {;
								var all = false;
							};
							if (typeof depthlimit == 'undefined' || (depthlimit != null && depthlimit .hasOwnProperty ("__kwargtrans__"))) {;
								var depthlimit = null;
							};
							if (typeof timelimit == 'undefined' || (timelimit != null && timelimit .hasOwnProperty ("__kwargtrans__"))) {;
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
						get analysismoveclicked () {return __get__ (this, function (self, moveuci) {
							if (!(self.moveclickedcallback === null)) {
								self.moveclickedcallback (self.basicboard.variantkey, self.basicboard.fen, moveuci);
							}
						});},
						get setenginebar () {return __get__ (this, function (self, score) {
							if (typeof score == 'undefined' || (score != null && score .hasOwnProperty ("__kwargtrans__"))) {;
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
						get buildanalysisinfodiv () {return __get__ (this, function (self) {
							self.analysisinfodiv.x ();
							self.basicboard.clearcanvases ();
							self.maxdepth = 0;
							var minfos = list ([]);
							var __iterable0__ = self.analysisinfo ['pvitems'];
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var infoi = __iterable0__ [__index0__];
								try {
									var minfo = MultipvInfo (infoi);
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
							var i = 1;
							var __iterable0__ = sorted (minfos, __kwargtrans__ ({key: (function __lambda__ (item) {
								return item.effscore ();
							}), reverse: true}));
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var minfo = __iterable0__ [__index0__];
								minfo.i = i;
								minfo.build ();
								if (i == 1) {
									self.bestmoveuci = minfo.bestmoveuci;
									self.setenginebar (minfo.effscore ());
								}
								var iw = 1 / (5 * i);
								self.basicboard.drawuciarrow (minfo.bestmoveuci, dict ({'strokecolor': scorecolor (minfo.effscore ()), 'linewidth': iw, 'headheight': iw}));
								self.analysisinfodiv.a (minfo);
								i++;
							}
						});},
						get processanalysisinfo () {return __get__ (this, function (self, obj, force) {
							if (typeof force == 'undefined' || (force != null && force .hasOwnProperty ("__kwargtrans__"))) {;
								var force = false;
							};
							if (!(self.analyzing) && !(force)) {
								return ;
							}
							self.anyinfo = true;
							var elapsed = new Date ().getTime () - self.analysisstartedat;
							self.analysisinfo = obj;
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
						get gamesloadedok () {return __get__ (this, function (self, content) {
							self.pgnlist = PgnList (self).setcontent (content);
							self.gamesdiv.x ();
							self.gamesdiv.a (Button ('Reload', self.loadgames));
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
							if (typeof usertoken == 'undefined' || (usertoken != null && usertoken .hasOwnProperty ("__kwargtrans__"))) {;
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
						get defaultmoveclickedcallback () {return __get__ (this, function (self, variantkey, fen, moveuci) {
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
						get fentextchangedcallback () {return __get__ (this, function (self, fen) {
							self.variantchanged (self.basicboard.variantkey, fen);
						});},
						get __init__ () {return __get__ (this, function (self, args) {
							__super__ (Board, '__init__') (self, 'div');
							self.addmovemode = false;
							self.bookpath = null;
							self.resizeorigwidth = 800;
							self.resizeorigheight = 400;
							self.showfen = true;
							self.flip = false;
							if (localStorage.getItem ('mainboardflip') == 'true') {
								self.flip = true;
							}
							self.positioninfos = list ([]);
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
							self.history = list ([]);
							self.id = args.py_get ('id', 'mainboard');
							self.BARWIDTH = args.py_get ('barwidth', 20);
							self.RATINGHEIGHT = args.py_get ('ratingheight', 2);
							self.RATINGCLUSTER = args.py_get ('ratingcluster', 25);
							self.maxgames = args.py_get ('maxgames', 25);
							self.gamesfilter = args.py_get ('gamesfilter', '');
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
							self.controlpanel.a (Button ('Del', self.delcallback));
							self.controlpanel.a (Button ('Delall', self.delallcallback));
							self.controlpanel.a (Button ('Reset', self.setvariantcallback));
							self.sectioncontainer = Div ().ac ('bigboardsectioncontainer').w (self.basicboard.outerwidth);
							self.sectioncontainer.bci (self.background);
							self.sectioncontainer.a (list ([self.controlpanel, self.basicboard]));
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
							self.lichessanalysisbutton = Button ('L', self.lichessanalysisclicked);
							self.analysiscontrolpanelbottom.a (self.lichessanalysisbutton);
							var mopts = list ([]);
							for (var i = 1; i < 501; i++) {
								mopts.append (list ([str (i), 'MultiPV {}'.format (i)]));
							}
							self.multipvcombo = ComboBox (dict ({'selectclass': 'boardmultipvcomboselect', 'optionfirstclass': 'boardmultipvcombooptionfirst', 'optionclass': 'boardmultipvcombooption'})).setoptions (mopts, str (self.defaultmultipv), self.multipvchanged);
							self.analysiscontrolpanelbottom.a (self.multipvcombo);
							self.analysisdiv.a (list ([self.analysiscontrolpaneltop, self.analysiscontrolpanelbottom]));
							self.analysisinfodiv = Div ();
							self.analysisdiv.a (self.analysisinfodiv);
							self.gamescontainerdiv = Div ();
							self.gamesshowlinkdiv = Div ().ms ().pad (3);
							self.gamesloadingdiv = Div ();
							self.gamesdiv = Div ();
							self.gamescontainerdiv.a (list ([self.gamesshowlinkdiv, self.gamesdiv]));
							self.gamediv = Div ();
							self.pgntext = PgnText ();
							self.engineoutpane = SplitPane (dict ({'controlheight': 40}));
							self.engineoutpane.controlpanel.a (list ([Button ('Analyze', self.analyzecallbackfactory ()), Button ('Stop', self.stopanalyzecallback), Button ('New engine', self.createnewengine), Button ('Kill engine', self.killengine)]));
							self.engineoutlog = Log ();
							self.engineoutpane.setcontentelement (self.engineoutlog);
							self.bookpane = SplitPane (dict ({'controlheight': 40}));
							self.bookpathdiv = Div ('bookpathdiv');
							self.addmovehook = Div ();
							self.bookpane.controlpanel.a (list ([self.bookpathdiv, self.addmovehook]));
							self.bookdiv = Div ().ms ().fs (20);
							self.bookpane.setcontentelement (self.bookdiv);
							self.chartdiv = Div ();
							self.tabpane = TabPane (dict ({'kind': 'normal', 'id': 'board', 'tabs': list ([Tab ('analysis', 'Analysis', self.analysisdiv), Tab ('auto', 'Auto', self.autodiv), Tab ('book', 'Book', self.bookpane), Tab ('game', 'Game', self.gamediv), Tab ('pgn', 'Pgn', self.pgntext), Tab ('games', 'Games', self.gamescontainerdiv), Tab ('chart', 'Chart', self.chartdiv), Tab ('engineout', 'Engine out', self.engineoutpane)]), 'selected': 'analysis'}));
							self.verticalcontainer.a (list ([self.sectioncontainer, self.enginebardiv, self.movelistdiv, self.tabpane]));
							self.a (self.verticalcontainer);
							self.basicresize ();
							self.variantchanged (self.setposinfo ['variantkey'], self.setposinfo ['fen']);
						});}
					});
					__pragma__ ('<use>' +
						'basicboard' +
						'connection' +
						'dom' +
						'utils' +
						'widgets' +
					'</use>')
					__pragma__ ('<all>')
						__all__.BasicBoard = BasicBoard;
						__all__.Board = Board;
						__all__.Button = Button;
						__all__.ComboBox = ComboBox;
						__all__.Div = Div;
						__all__.IS_PROD = IS_PROD;
						__all__.LICH_API_GAMES_EXPORT = LICH_API_GAMES_EXPORT;
						__all__.Log = Log;
						__all__.LogItem = LogItem;
						__all__.MultipvInfo = MultipvInfo;
						__all__.PgnInfo = PgnInfo;
						__all__.PgnList = PgnList;
						__all__.PgnText = PgnText;
						__all__.Span = Span;
						__all__.SplitPane = SplitPane;
						__all__.Tab = Tab;
						__all__.TabPane = TabPane;
						__all__.TextArea = TextArea;
						__all__.VARIANT_OPTIONS = VARIANT_OPTIONS;
						__all__.View = View;
						__all__.__name__ = __name__;
						__all__.cpick = cpick;
						__all__.e = e;
						__all__.getconn = getconn;
						__all__.getglobalcssvarpxint = getglobalcssvarpxint;
						__all__.lichapiget = lichapiget;
						__all__.scorecolor = scorecolor;
						__all__.scoreverbal = scoreverbal;
						__all__.uci_variant_to_variantkey = uci_variant_to_variantkey;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'client', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'client';
					var SUBMIT_URL = __init__ (__world__.utils).SUBMIT_URL;
					var ge = __init__ (__world__.utils).ge;
					var cpick = __init__ (__world__.utils).cpick;
					var getelse = __init__ (__world__.utils).getelse;
					var getrec = __init__ (__world__.utils).getrec;
					var getrecm = __init__ (__world__.utils).getrecm;
					var escapeHTML = __init__ (__world__.utils).escapeHTML;
					var allchilds = __init__ (__world__.utils).allchilds;
					var getext = __init__ (__world__.utils).getext;
					var IS_DEV = __init__ (__world__.utils).IS_DEV;
					var queryparams = __init__ (__world__.utils).queryparams;
					var Div = __init__ (__world__.dom).Div;
					var Span = __init__ (__world__.dom).Span;
					var TextInput = __init__ (__world__.dom).TextInput;
					var PasswordInput = __init__ (__world__.dom).PasswordInput;
					var Button = __init__ (__world__.dom).Button;
					var Label = __init__ (__world__.dom).Label;
					var Hlink = __init__ (__world__.dom).Hlink;
					var TabPane = __init__ (__world__.widgets).TabPane;
					var Tab = __init__ (__world__.widgets).Tab;
					var FileUploader = __init__ (__world__.widgets).FileUploader;
					var SplitPane = __init__ (__world__.widgets).SplitPane;
					var Schema = __init__ (__world__.schema).Schema;
					var DirBrowser = __init__ (__world__.system).DirBrowser;
					var ProcessConsole = __init__ (__world__.system).ProcessConsole;
					var Doc = __init__ (__world__.system).Doc;
					var ProcessPane = __init__ (__world__.system).ProcessPane;
					var Config = __init__ (__world__.system).Config;
					var Board = __init__ (__world__.board).Board;
					var createconn = __init__ (__world__.connection).createconn;
					var getconn = __init__ (__world__.connection).getconn;
					var Log = __init__ (__world__.widgets).Log;
					var Forumgame = __init__ (__world__.forumgame).Forumgame;
					var Client = __class__ ('Client', [object], {
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
							self.tabs = TabPane (dict ({'id': 'maintabpane', 'fillwindow': true, 'tabs': list ([Tab ('config', 'Config', self.config), Tab ('upload', 'Upload', FileUploader (dict ({'url': '/upload'}))), Tab ('board', 'Board', self.mainboard), self.forumgametab, Tab ('process', 'Process', self.processpane), Tab ('dirbrowser', 'Dirbrowser', self.maindirbrowser), Tab ('drive', 'Drive', self.drive), Tab ('bots', 'Bots', self.botdiv), Tab ('doc', 'Doc', self.doc), Tab ('src', 'Src', self.srcdiv), Tab ('log', 'Log', getconn ().log), getconn ().profiletab, Tab ('about', 'About', self.about)]), 'selected': 'drive'}));
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
									var __iterable0__ = obj ['items'];
									for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
										var item = __iterable0__ [__index0__];
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
					__pragma__ ('<use>' +
						'board' +
						'connection' +
						'dom' +
						'forumgame' +
						'schema' +
						'system' +
						'utils' +
						'widgets' +
					'</use>')
					__pragma__ ('<all>')
						__all__.Board = Board;
						__all__.Button = Button;
						__all__.Client = Client;
						__all__.Config = Config;
						__all__.DirBrowser = DirBrowser;
						__all__.Div = Div;
						__all__.Doc = Doc;
						__all__.FileUploader = FileUploader;
						__all__.Forumgame = Forumgame;
						__all__.Hlink = Hlink;
						__all__.IS_DEV = IS_DEV;
						__all__.Label = Label;
						__all__.Log = Log;
						__all__.PasswordInput = PasswordInput;
						__all__.ProcessConsole = ProcessConsole;
						__all__.ProcessPane = ProcessPane;
						__all__.SUBMIT_URL = SUBMIT_URL;
						__all__.Schema = Schema;
						__all__.Span = Span;
						__all__.SplitPane = SplitPane;
						__all__.Tab = Tab;
						__all__.TabPane = TabPane;
						__all__.TextInput = TextInput;
						__all__.__name__ = __name__;
						__all__.allchilds = allchilds;
						__all__.cpick = cpick;
						__all__.createconn = createconn;
						__all__.escapeHTML = escapeHTML;
						__all__.ge = ge;
						__all__.getconn = getconn;
						__all__.getelse = getelse;
						__all__.getext = getext;
						__all__.getrec = getrec;
						__all__.getrecm = getrecm;
						__all__.queryparams = queryparams;
					__pragma__ ('</all>')
				}
			}
		}
	);

	__nest__ (
		__all__,
		'connection', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'connection';
					var Log = __init__ (__world__.widgets).Log;
					var LogItem = __init__ (__world__.widgets).LogItem;
					var Tab = __init__ (__world__.widgets).Tab;
					var Div = __init__ (__world__.dom).Div;
					var Span = __init__ (__world__.dom).Span;
					var Button = __init__ (__world__.dom).Button;
					var TextInput = __init__ (__world__.dom).TextInput;
					var PasswordInput = __init__ (__world__.dom).PasswordInput;
					var cpick = __init__ (__world__.utils).cpick;
					var getelse = __init__ (__world__.utils).getelse;
					var Connection = __class__ ('Connection', [object], {
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
							self.signupmaildiv.a (list ([self.helpbutton, self.emaillabel, self.emailinput, self.passwordlabel, self.passwordinput, self.signinbutton, self.signoutbutton, self.signupbutton, self.sendverificationbutton, self.resetpasswordbutton, self.linkgooglebutton, self.linkmailbutton]));
							self.userdetailsdiv = Div ('userdetailsdiv');
							self.displaynamelabel = Span ().html ('Display name:');
							self.displaynameinput = TextInput ().ac ('profiletextinput').w (250);
							self.photourllabel = Span ().html ('Photo url:');
							self.photourlinput = TextInput ().ac ('profiletextinput').w (250);
							self.updatedisplaynamebutton = Button ('Update display name', self.updatedisplaynamecallback);
							self.updatephotourlbutton = Button ('Update photo url', self.updatephotourlcallback);
							self.userdetailsdiv.a (list ([self.displaynamelabel, self.displaynameinput, self.updatedisplaynamebutton, self.photourllabel, self.photourlinput, self.updatephotourlbutton]));
							self.photodiv = Div ('photodiv');
							self.signupdiv.a (list ([self.signupmaildiv, self.userdetailsdiv, self.userinfodiv, self.photodiv]));
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
							self.profiletab.rc (list (['profilelogged', 'profileanon']));
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
								self.userinfodiv.x ().a (list ([self.nameinfodiv, self.emailinfodiv, self.verifiedinfodiv, self.photourldiv, self.uidinfodiv]));
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
								self.userinfodiv.x ().a (list ([Div ().html ('Please sign up or sign in !'), Button ('Sign in anonymously', self.signinanonymously ())]));
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
							self.uiConfig = dict ({'signInSuccessUrl': '/', 'signInOptions': list ([firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.EmailAuthProvider.PROVIDER_ID]), 'tosUrl': '/tos'});
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
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
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
					var conn = null;
					var createconn = function (args) {
						conn = Connection (args);
					};
					var getconn = function () {
						return conn;
					};
					var LICH_API_GAMES_EXPORT = 'api/games/user';
					var lichapiget = function (path, token, callback, errcallback, showlink) {
						if (typeof showlink == 'undefined' || (showlink != null && showlink .hasOwnProperty ("__kwargtrans__"))) {;
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
					__pragma__ ('<use>' +
						'dom' +
						'utils' +
						'widgets' +
					'</use>')
					__pragma__ ('<all>')
						__all__.Button = Button;
						__all__.Connection = Connection;
						__all__.Div = Div;
						__all__.LICH_API_GAMES_EXPORT = LICH_API_GAMES_EXPORT;
						__all__.Log = Log;
						__all__.LogItem = LogItem;
						__all__.PasswordInput = PasswordInput;
						__all__.Span = Span;
						__all__.Tab = Tab;
						__all__.TextInput = TextInput;
						__all__.__name__ = __name__;
						__all__.conn = conn;
						__all__.cpick = cpick;
						__all__.createconn = createconn;
						__all__.getconn = getconn;
						__all__.getelse = getelse;
						__all__.lichapiget = lichapiget;
					__pragma__ ('</all>')
				}
			}
		}
	);

	__nest__ (
		__all__,
		'dom', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'dom';
					var ce = __init__ (__world__.utils).ce;
					var e = __class__ ('e', [object], {
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
								var __iterable0__ = element;
								for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
									var eitem = __iterable0__ [__index0__];
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
								var __iterable0__ = klass;
								for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
									var classitem = __iterable0__ [__index0__];
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
								var __iterable0__ = klass;
								for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
									var classitem = __iterable0__ [__index0__];
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
							if (typeof timeout == 'undefined' || (timeout != null && timeout .hasOwnProperty ("__kwargtrans__"))) {;
								var timeout = 50;
							};
							setTimeout (self.focusme, timeout);
							return self;
						});},
						get ae () {return __get__ (this, function (self, kind, callback, arg) {
							if (typeof arg == 'undefined' || (arg != null && arg .hasOwnProperty ("__kwargtrans__"))) {;
								var arg = false;
							};
							if (Array.isArray (kind)) {
								var __iterable0__ = kind;
								for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
									var kinditem = __iterable0__ [__index0__];
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
					var Div = __class__ ('Div', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, klass) {
							if (typeof klass == 'undefined' || (klass != null && klass .hasOwnProperty ("__kwargtrans__"))) {;
								var klass = null;
							};
							__super__ (Div, '__init__') (self, 'div');
							if (klass) {
								self.ac (klass);
							}
						});}
					});
					var Span = __class__ ('Span', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, klass) {
							if (typeof klass == 'undefined' || (klass != null && klass .hasOwnProperty ("__kwargtrans__"))) {;
								var klass = null;
							};
							__super__ (Span, '__init__') (self, 'span');
							if (klass) {
								self.ac (klass);
							}
						});}
					});
					var Br = __class__ ('Br', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self) {
							__super__ (Br, '__init__') (self, 'br');
						});}
					});
					var Table = __class__ ('Table', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, klass) {
							if (typeof klass == 'undefined' || (klass != null && klass .hasOwnProperty ("__kwargtrans__"))) {;
								var klass = null;
							};
							__super__ (Table, '__init__') (self, 'table');
							if (klass) {
								self.ac (klass);
							}
						});}
					});
					var Tr = __class__ ('Tr', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, klass) {
							if (typeof klass == 'undefined' || (klass != null && klass .hasOwnProperty ("__kwargtrans__"))) {;
								var klass = null;
							};
							__super__ (Tr, '__init__') (self, 'tr');
							if (klass) {
								self.ac (klass);
							}
						});}
					});
					var Td = __class__ ('Td', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, klass) {
							if (typeof klass == 'undefined' || (klass != null && klass .hasOwnProperty ("__kwargtrans__"))) {;
								var klass = null;
							};
							__super__ (Td, '__init__') (self, 'td');
							if (klass) {
								self.ac (klass);
							}
						});}
					});
					var Input = __class__ ('Input', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, kind) {
							__super__ (Input, '__init__') (self, 'input');
							self.sa ('type', kind);
						});}
					});
					var Button = __class__ ('Button', [Input], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, caption, callback) {
							__super__ (Button, '__init__') (self, 'button');
							self.sa ('value', caption);
							self.ae ('mousedown', callback);
							self.ac ('button');
						});}
					});
					var Select = __class__ ('Select', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self) {
							__super__ (Select, '__init__') (self, 'select');
						});}
					});
					var Option = __class__ ('Option', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, key, displayname, selected) {
							if (typeof selected == 'undefined' || (selected != null && selected .hasOwnProperty ("__kwargtrans__"))) {;
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
					var ComboBox = __class__ ('ComboBox', [e], {
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
							var __iterable0__ = options;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var option = __iterable0__ [__index0__];
								self.a (Option (option [0], option [1], option [0] == selected));
							}
							return self;
						});}
					});
					var Slider = __class__ ('Slider', [Input], {
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
					var CheckBox = __class__ ('CheckBox', [Input], {
						__module__: __name__,
						get setchecked () {return __get__ (this, function (self, checked) {
							self.e.checked = checked;
							return self;
						});},
						get getchecked () {return __get__ (this, function (self) {
							return self.e.checked;
						});},
						get __init__ () {return __get__ (this, function (self, checked) {
							if (typeof checked == 'undefined' || (checked != null && checked .hasOwnProperty ("__kwargtrans__"))) {;
								var checked = false;
							};
							__super__ (CheckBox, '__init__') (self, 'checkbox');
							self.setchecked (checked);
						});}
					});
					var Radio = __class__ ('Radio', [Input], {
						__module__: __name__,
						get setchecked () {return __get__ (this, function (self, checked) {
							self.e.checked = checked;
							return self;
						});},
						get __init__ () {return __get__ (this, function (self, checked) {
							if (typeof checked == 'undefined' || (checked != null && checked .hasOwnProperty ("__kwargtrans__"))) {;
								var checked = false;
							};
							__super__ (Radio, '__init__') (self, 'radio');
							self.setchecked (checked);
						});}
					});
					var DateInput = __class__ ('DateInput', [Input], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, checked) {
							if (typeof checked == 'undefined' || (checked != null && checked .hasOwnProperty ("__kwargtrans__"))) {;
								var checked = false;
							};
							__super__ (DateInput, '__init__') (self, 'date');
						});}
					});
					var ColorInput = __class__ ('ColorInput', [Input], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, checked) {
							if (typeof checked == 'undefined' || (checked != null && checked .hasOwnProperty ("__kwargtrans__"))) {;
								var checked = false;
							};
							__super__ (ColorInput, '__init__') (self, 'color');
						});}
					});
					var TextInput = __class__ ('TextInput', [Input], {
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
					var PasswordInput = __class__ ('PasswordInput', [Input], {
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
					var TextArea = __class__ ('TextArea', [e], {
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
								var __iterable0__ = chars;
								for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
									var char = __iterable0__ [__index0__];
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
					var Canvas = __class__ ('Canvas', [e], {
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
					var Form = __class__ ('Form', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self) {
							__super__ (Form, '__init__') (self, 'form');
						});}
					});
					var P = __class__ ('P', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self) {
							__super__ (P, '__init__') (self, 'p');
						});}
					});
					var Label = __class__ ('Label', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, content) {
							if (typeof content == 'undefined' || (content != null && content .hasOwnProperty ("__kwargtrans__"))) {;
								var content = null;
							};
							__super__ (Label, '__init__') (self, 'label');
							if (content) {
								self.html (content);
							}
						});}
					});
					var FileInput = __class__ ('FileInput', [Input], {
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
					var Hlink = __class__ ('Hlink', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, href, caption) {
							__super__ (Hlink, '__init__') (self, 'a');
							self.sa ('href', href);
							self.html (caption);
						});}
					});
					__pragma__ ('<use>' +
						'utils' +
					'</use>')
					__pragma__ ('<all>')
						__all__.Br = Br;
						__all__.Button = Button;
						__all__.Canvas = Canvas;
						__all__.CheckBox = CheckBox;
						__all__.ColorInput = ColorInput;
						__all__.ComboBox = ComboBox;
						__all__.DateInput = DateInput;
						__all__.Div = Div;
						__all__.FileInput = FileInput;
						__all__.Form = Form;
						__all__.Hlink = Hlink;
						__all__.Input = Input;
						__all__.Label = Label;
						__all__.Option = Option;
						__all__.P = P;
						__all__.PasswordInput = PasswordInput;
						__all__.Radio = Radio;
						__all__.Select = Select;
						__all__.Slider = Slider;
						__all__.Span = Span;
						__all__.Table = Table;
						__all__.Td = Td;
						__all__.TextArea = TextArea;
						__all__.TextInput = TextInput;
						__all__.Tr = Tr;
						__all__.__name__ = __name__;
						__all__.ce = ce;
						__all__.e = e;
					__pragma__ ('</all>')
				}
			}
		}
	);

	__nest__ (
		__all__,
		'forumgame', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'forumgame';
					var e = __init__ (__world__.dom).e;
					var Div = __init__ (__world__.dom).Div;
					var TextInput = __init__ (__world__.dom).TextInput;
					var Button = __init__ (__world__.dom).Button;
					var TextArea = __init__ (__world__.dom).TextArea;
					var BasicBoard = __init__ (__world__.basicboard).BasicBoard;
					var getconn = __init__ (__world__.connection).getconn;
					var queryparams = __init__ (__world__.utils).queryparams;
					var random = __init__ (__world__.utils).random;
					var setseed = __init__ (__world__.utils).setseed;
					var mainseed = 80;
					var Forumnode = __class__ ('Forumnode', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, root, args) {
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
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
							self.childs = list ([]);
							self.build ();
						});},
						get toobj () {return __get__ (this, function (self) {
							var moveobjs = dict ({});
							var __iterable0__ = self.childs;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var child = __iterable0__ [__index0__];
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
							self.childs = list ([]);
							self.root.rebuild (mainseed);
						});},
						get delme () {return __get__ (this, function (self) {
							var parent = self.parent;
							if (parent) {
								var newchilds = list ([]);
								var __iterable0__ = parent.childs;
								for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
									var child = __iterable0__ [__index0__];
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
							self.movedescdiv.a (list ([self.movelabeldiv, self.ownerdiv, self.commentdiv]));
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
							self.movecontainerdiv.a (list ([self.movedescdiv, self.boarddiv]));
							self.containerdiv = Div ().disp ('flex').fd ('column').ai ('flex-start');
							self.movediv.a (list ([self.movecontainerdiv, self.containerdiv]));
							self.setboard ();
							self.x ().a (self.movediv);
							self.mw (600);
						});}
					});
					var Forumgame = __class__ ('Forumgame', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self) {
							__super__ (Forumgame, '__init__') (self, 'div');
							self.messagediv = Div ().disp ('inline-block').pad (3).ff ('monospace');
							self.contentdiv = Div ();
							self.a (list ([self.messagediv, self.contentdiv]));
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
					__pragma__ ('<use>' +
						'basicboard' +
						'connection' +
						'dom' +
						'utils' +
					'</use>')
					__pragma__ ('<all>')
						__all__.BasicBoard = BasicBoard;
						__all__.Button = Button;
						__all__.Div = Div;
						__all__.Forumgame = Forumgame;
						__all__.Forumnode = Forumnode;
						__all__.TextArea = TextArea;
						__all__.TextInput = TextInput;
						__all__.__name__ = __name__;
						__all__.e = e;
						__all__.getconn = getconn;
						__all__.mainseed = mainseed;
						__all__.queryparams = queryparams;
						__all__.random = random;
						__all__.setseed = setseed;
					__pragma__ ('</all>')
				}
			}
		}
	);

	__nest__ (
		__all__,
		'schema', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'schema';
					var e = __init__ (__world__.dom).e;
					var Div = __init__ (__world__.dom).Div;
					var ComboBox = __init__ (__world__.dom).ComboBox;
					var TextInput = __init__ (__world__.dom).TextInput;
					var Button = __init__ (__world__.dom).Button;
					var Slider = __init__ (__world__.dom).Slider;
					var CheckBox = __init__ (__world__.dom).CheckBox;
					var Radio = __init__ (__world__.dom).Radio;
					var TextArea = __init__ (__world__.dom).TextArea;
					var DateInput = __init__ (__world__.dom).DateInput;
					var Label = __init__ (__world__.dom).Label;
					var ColorInput = __init__ (__world__.dom).ColorInput;
					var getitem = __init__ (__world__.utils).getitem;
					var texttofloat = __init__ (__world__.utils).texttofloat;
					var dateToDateInputStr = __init__ (__world__.utils).dateToDateInputStr;
					var dateInputStrToDate = __init__ (__world__.utils).dateInputStrToDate;
					var clipboard = null;
					var SCHEMA_SCALAR_DEFAULT_VALUE = '';
					var SCHEMA_SLIDER_DEFAULT_VALUE = 0;
					var SCHEMA_SLIDER_DEFAULT_MINVALUE = 0;
					var SCHEMA_SLIDER_DEFAULT_MAXVALUE = 100;
					var SCHEMA_SLIDER_DEFAULT_VALUESTEP = 1;
					var SCHEMA_DEFAULT_ARGS = list ([list (['kind', 'collection']), list (['disposition', 'dict']), list (['key', null]), list (['value', SCHEMA_SCALAR_DEFAULT_VALUE]), list (['minvalue', SCHEMA_SLIDER_DEFAULT_MINVALUE]), list (['maxvalue', SCHEMA_SLIDER_DEFAULT_MAXVALUE]), list (['valuestep', SCHEMA_SLIDER_DEFAULT_VALUESTEP]), list (['selected', false]), list (['childsarg', list ([])]), list (['childsopened', false])]);
					var iscollection = function (schema) {
						if (schema) {
							return schema.kind == 'collection';
						}
						return false;
					};
					var iscombo = function (schema) {
						if (iscollection (schema)) {
							return schema.disposition == 'combo';
						}
						return false;
					};
					var isradio = function (schema) {
						if (iscollection (schema)) {
							return schema.disposition == 'radio';
						}
						return false;
					};
					var isdict = function (schema) {
						if (iscollection (schema)) {
							return schema.disposition == 'dict';
						}
						return false;
					};
					var islist = function (schema) {
						if (iscollection (schema)) {
							return schema.disposition == 'list';
						}
						return false;
					};
					var Schema = __class__ ('Schema', [e], {
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
								var sch = Schema (dict ({'parent': self, 'kind': 'collection', 'disposition': 'dict', 'childsopened': true, 'childsarg': list ([dict ({'kind': 'scalar', 'disposition': 'string', 'key': 'key'}), dict ({'kind': 'scalar', 'disposition': 'string', 'key': 'displayname'}), dict ({'kind': 'scalar', 'disposition': 'string', 'key': 'command'}), dict ({'kind': 'collection', 'disposition': 'list', 'key': 'command_args'})])}));
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
							var newchilds = list ([]);
							var __iterable0__ = self.childs;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var currchild = __iterable0__ [__index0__];
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
							if (typeof doslider == 'undefined' || (doslider != null && doslider .hasOwnProperty ("__kwargtrans__"))) {;
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
							var __iterable0__ = self.parent.childs;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var child = __iterable0__ [__index0__];
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
							self.itemdiv = Div (list (['item', self.disposition]));
							self.valuediv = Div (list (['value', self.disposition]));
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
									self.valuediv.a (list ([self.slidervalueinput, self.minvalueinput, self.slider, self.maxvalueinput, self.sliderstepinput]));
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
									self.textarea.ae (list (['keyup', 'change']), self.textareachanged);
									self.valuediv.a (self.textarea);
								}
								else if (self.disposition == 'date') {
									self.date = DateInput ().ac ('date').sv (self.value);
									self.date.ae (list (['keyup', 'change']), self.datechanged);
									self.datelabel = Label ().ac ('datelabel');
									self.setdatelabel ();
									self.valuediv.a (list ([self.date, self.datelabel]));
								}
								else if (self.disposition == 'color') {
									self.color = ColorInput ().ac ('color').sv (self.value);
									self.color.ae (list (['keyup', 'change']), self.colorchanged);
									self.colorlabel = Label ().ac ('colorlabel').html (self.value);
									self.valuediv.a (list ([self.color, self.colorlabel]));
								}
							}
							self.helpdiv = Div (list (['box', 'help'])).html ('?');
							self.copydiv = Div (list (['box', 'copy'])).html ('C').ae ('mousedown', self.copydivclicked);
							if (isdict (self.parent)) {
								self.keydiv = Div ('key');
								self.keyinput = TextInput ().ac ('key').setText (self.key);
								self.keyinput.ae ('keyup', self.keyinputchanged);
								self.keydiv.a (self.keyinput);
								self.itemdiv.a (self.keydiv);
							}
							if (iscombo (self.parent)) {
								self.combodiv = Div (list (['box', 'combo']));
								self.combocheckbox = CheckBox ().ac ('checkbox').setchecked (self.selected).ae ('change', self.combocheckboxchanged);
								self.combodiv.a (self.combocheckbox);
								self.itemdiv.a (self.combodiv);
							}
							if (isradio (self.parent)) {
								self.radiodiv = Div (list (['box', 'radio']));
								self.radioradio = Radio ().ac ('radio').setchecked (self.selected).ae ('mousedown', self.radioradioclicked);
								self.radiodiv.a (self.radioradio);
								self.itemdiv.a (self.radiodiv);
							}
							self.itemdiv.a (list ([self.valuediv, self.helpdiv, self.copydiv]));
							if (self.parent) {
								self.deletediv = Div (list (['box', 'delete'])).html ('X').ae ('mousedown', self.deletedivclicked);
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
								self.createcombo = ComboBox ().setoptions (list ([list (['create', 'Create new']), list (['scalar', 'Scalar']), list (['slider', 'Slider']), list (['checkbox', 'Checkbox']), list (['textarea', 'Textarea']), list (['date', 'Date']), list (['color', 'Color']), list (['dict', 'Dict']), list (['list', 'List']), list (['combo', 'Combo']), list (['radio', 'Radio']), list (['process', 'Process'])]), 'create', self.createcombochanged).ac ('createcombo');
								self.creatediv.a (self.createcombo);
								self.pastebutton = Button ('Paste', self.pastebuttonpushed).ac ('pastebutton');
								self.creatediv.a (self.pastebutton);
								self.childsdiv.a (self.creatediv);
								var __iterable0__ = self.childs;
								for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
									var child = __iterable0__ [__index0__];
									self.childsdiv.a (child);
								}
							}
							self.container = Div ('container');
							self.container.a (list ([self.itemdiv, self.childsdiv]));
							self.a (self.container);
							return self;
						});},
						get tojsontext () {return __get__ (this, function (self) {
							return JSON.stringify (self.toargs (), null, 2);
						});},
						get toargs () {return __get__ (this, function (self) {
							var args = dict ({});
							var __iterable0__ = SCHEMA_DEFAULT_ARGS;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var arg = __iterable0__ [__index0__];
								args [arg [0]] = self [arg [0]];
							}
							args ['childsarg'] = list ([]);
							var __iterable0__ = self.childs;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var child = __iterable0__ [__index0__];
								args ['childsarg'].append (child.toargs ());
							}
							return args;
						});},
						get __init__ () {return __get__ (this, function (self, args) {
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
								var args = dict ({});
							};
							__super__ (Schema, '__init__') (self, 'div');
							self.parent = getitem (args, 'parent', null);
							var __iterable0__ = SCHEMA_DEFAULT_ARGS;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var arg = __iterable0__ [__index0__];
								self [arg [0]] = getitem (args, arg [0], arg [1]);
							}
							self.childs = list ([]);
							var __iterable0__ = self.childsarg;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var childarg = __iterable0__ [__index0__];
								childarg ['parent'] = self;
								var child = Schema (childarg);
								self.childs.append (child);
							}
							self.build ();
						});},
						get getchildbykey () {return __get__ (this, function (self, key) {
							var __iterable0__ = self.childs;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var child = __iterable0__ [__index0__];
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
								var pathparts = list ([]);
							}
							else {
								var pathparts = path.py_split ('/');
							}
							return self.getpathrec (self, pathparts);
						});}
					});
					__pragma__ ('<use>' +
						'dom' +
						'utils' +
					'</use>')
					__pragma__ ('<all>')
						__all__.Button = Button;
						__all__.CheckBox = CheckBox;
						__all__.ColorInput = ColorInput;
						__all__.ComboBox = ComboBox;
						__all__.DateInput = DateInput;
						__all__.Div = Div;
						__all__.Label = Label;
						__all__.Radio = Radio;
						__all__.SCHEMA_DEFAULT_ARGS = SCHEMA_DEFAULT_ARGS;
						__all__.SCHEMA_SCALAR_DEFAULT_VALUE = SCHEMA_SCALAR_DEFAULT_VALUE;
						__all__.SCHEMA_SLIDER_DEFAULT_MAXVALUE = SCHEMA_SLIDER_DEFAULT_MAXVALUE;
						__all__.SCHEMA_SLIDER_DEFAULT_MINVALUE = SCHEMA_SLIDER_DEFAULT_MINVALUE;
						__all__.SCHEMA_SLIDER_DEFAULT_VALUE = SCHEMA_SLIDER_DEFAULT_VALUE;
						__all__.SCHEMA_SLIDER_DEFAULT_VALUESTEP = SCHEMA_SLIDER_DEFAULT_VALUESTEP;
						__all__.Schema = Schema;
						__all__.Slider = Slider;
						__all__.TextArea = TextArea;
						__all__.TextInput = TextInput;
						__all__.__name__ = __name__;
						__all__.clipboard = clipboard;
						__all__.dateInputStrToDate = dateInputStrToDate;
						__all__.dateToDateInputStr = dateToDateInputStr;
						__all__.e = e;
						__all__.getitem = getitem;
						__all__.iscollection = iscollection;
						__all__.iscombo = iscombo;
						__all__.isdict = isdict;
						__all__.islist = islist;
						__all__.isradio = isradio;
						__all__.texttofloat = texttofloat;
					__pragma__ ('</all>')
				}
			}
		}
	);

	__nest__ (
		__all__,
		'system', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'system';
					var e = __init__ (__world__.dom).e;
					var Div = __init__ (__world__.dom).Div;
					var Tab = __init__ (__world__.widgets).Tab;
					var TabPane = __init__ (__world__.widgets).TabPane;
					var SplitPane = __init__ (__world__.widgets).SplitPane;
					var ProcessInput = __init__ (__world__.widgets).ProcessInput;
					var LogItem = __init__ (__world__.widgets).LogItem;
					var Log = __init__ (__world__.widgets).Log;
					var FileUploader = __init__ (__world__.widgets).FileUploader;
					var Button = __init__ (__world__.dom).Button;
					var TextArea = __init__ (__world__.dom).TextArea;
					var Span = __init__ (__world__.dom).Span;
					var escapeHTML = __init__ (__world__.utils).escapeHTML;
					var allchilds = __init__ (__world__.utils).allchilds;
					var getrecm = __init__ (__world__.utils).getrecm;
					var getconn = __init__ (__world__.connection).getconn;
					var Schema = __init__ (__world__.schema).Schema;
					var DIR_ITEM_FIELDS = list ([list (['name', 'filename']), list (['st_size', 'size']), list (['isdir', 'isdir']), list (['st_mtime', 'mtime']), list (['st_mode_unix_rwx', 'rwx'])]);
					var DirItem = __class__ ('DirItem', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, obj) {
							__super__ (DirItem, '__init__') (self, 'div');
							self.container = Div ('diritem');
							var __iterable0__ = DIR_ITEM_FIELDS;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var field = __iterable0__ [__index0__];
								self [field [1]] = obj [field [0]];
								var fdiv = Div (field [1]);
								self [field [1] + 'div'] = fdiv;
								self.container.a (fdiv);
							}
							if (self.isdir) {
								self.container.ac ('isdir');
							}
							self.filenamelabel = Div ().html (self.filename);
							self.filenamediv.a (list ([self.filenamelabel]));
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
					var EditTextarea = __class__ ('EditTextarea', [e], {
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
					var Editor = __class__ ('Editor', [e], {
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
							self.editdiv.controlpanel.a (list ([self.reloadbutton, self.savebutton]));
							self.edittextarea = EditTextarea ();
							self.editdiv.setcontentelement (self.edittextarea);
							self.a (self.editdiv);
						});}
					});
					var DirBrowser = __class__ ('DirBrowser', [e], {
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
							var dirs = list ([]);
							var files = list ([]);
							self.listing = sorted (self.listing, __kwargtrans__ ({key: (function __lambda__ (item) {
								return item ['name'].toLowerCase ();
							})}));
							var __iterable0__ = self.listing;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var item = __iterable0__ [__index0__];
								if (item ['isdir']) {
									dirs.append (item);
								}
								else {
									files.append (item);
								}
							}
							self.listing = list ([]);
							var __iterable0__ = dirs;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var item = __iterable0__ [__index0__];
								self.listing.append (item);
							}
							var __iterable0__ = files;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var item = __iterable0__ [__index0__];
								self.listing.append (item);
							}
							self.pathlabel.html (self.path ());
							self.filescontentdiv.x ();
							if (len (self.pathlist) > 0) {
								self.appenditem (dict ({'name': '..', 'isdir': true}));
							}
							var __iterable0__ = self.listing;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var item = __iterable0__ [__index0__];
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
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
								var args = dict ({});
							};
							__super__ (DirBrowser, '__init__') (self, 'div');
							self.ac ('dirbrowser');
							self.id = args.py_get ('id', null);
							self.drive = args.py_get ('drive', false);
							self.editclickedcallback = args.py_get ('editclickedcallback', null);
							self.pathlist = list ([]);
							self.listing = list ([]);
							self.filesdiv = SplitPane (dict ({'controlheight': 40}));
							self.pathlabel = Div ('pathlabel');
							self.createfilebutton = Button ('Create file', self.createfileclicked);
							self.createdirbutton = Button ('Create dir', self.createdirclicked);
							self.refreshbutton = Button ('Refresh', self.refreshclicked);
							self.filesdiv.controlpanel.a (list ([self.pathlabel, self.createfilebutton, self.createdirbutton, self.refreshbutton]));
							if (self.drive) {
								self.ziptocloudbutton = Button ('Zip to cloud', self.ziptocloudclicked);
								self.unzipfromcloudbutton = Button ('Unzip from cloud', self.unzipfromcloudclicked);
								self.filesdiv.controlpanel.a (list ([self.ziptocloudbutton, self.unzipfromcloudbutton]));
							}
							self.filescontentdiv = Div ();
							self.filesdiv.setcontentelement (self.filescontentdiv);
							self.editor = Editor ();
							self.editor.reloadbutton.ae ('mousedown', self.reloadclicked);
							self.editor.savebutton.ae ('mousedown', self.saveclicked);
							self.uploader = FileUploader (dict ({'url': '/dirbrowserupload', 'accept': '*', 'acceptdisplay': 'file', 'drive': self.drive, 'dirbrowseruploadedcallback': self.dirbrowseruploadedcallback, 'dirbrowsergetpathcallback': self.path, 'getuid': getconn ().getuid}));
							self.tabs = TabPane (dict ({'id': self.id + 'tabpane', 'tabs': list ([Tab ('files', 'Files', self.filesdiv), Tab ('edit', 'Edit', self.editor), Tab ('upload', 'Upload', self.uploader)]), 'selected': 'files'}));
							self.tabs.controlpanel.ac ('subcontrolpanel');
							self.a (self.tabs);
							self.requestdirlist ();
						});}
					});
					var ProcessConsole = __class__ ('ProcessConsole', [SplitPane], {
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
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
								var args = dict ({});
							};
							__super__ (ProcessConsole, '__init__') (self, args);
							self.ac ('processconsole');
							self.key = args.py_get ('key', null);
							self.command = args.py_get ('command', null);
							self.command_args = args.py_get ('command_args', list ([]));
							self.processinput = ProcessInput (dict ({'buttonlabel': args.py_get ('buttonlabel', 'Submit'), 'entercallback': args.py_get ('entercallback', self.onenter)}));
							self.processinput.submitbutton.ac ('bluebutton');
							self.startbutton = Button ('Start', self.startcallback).ac ('greenbutton');
							self.stopbutton = Button ('Stop', self.stopcallback).ac ('redbutton');
							self.controlpanel.a (list ([self.processinput, self.startbutton, self.stopbutton]));
							self.shortcuts = args.py_get ('shortcuts', list ([]));
							var __iterable0__ = self.shortcuts;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var shortcut = __iterable0__ [__index0__];
								self.controlpanel.a (Button (shortcut [0], self.shortcutclickedfactory (shortcut [1])));
							}
							self.log = Log ();
							self.setcontentelement (self.log);
						});}
					});
					var Doc = __class__ ('Doc', [e], {
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
							var newparts = list ([parts [0]]);
							var __iterable0__ = parts.__getslice__ (1, null, 1);
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var part = __iterable0__ [__index0__];
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
							var __iterable0__ = allchilds (self.docdiv.e);
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var child = __iterable0__ [__index0__];
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
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
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
					var ProcessPane = __class__ ('ProcessPane', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, args) {
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
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
							var proctabs = list ([]);
							var firstkey = null;
							var __iterable0__ = self.configsch.childs;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var proc = __iterable0__ [__index0__];
								var processkey = proc.getpath ('key').value;
								var command = proc.getpath ('command').value;
								var args = list ([]);
								var __iterable1__ = proc.getpath ('command_args').childs;
								for (var __index1__ = 0; __index1__ < len (__iterable1__); __index1__++) {
									var arg = __iterable1__ [__index1__];
									args.append (arg.value);
								}
								if (!(firstkey)) {
									var firstkey = processkey;
								}
								var processdisplayname = proc.getpath ('displayname').value;
								var shortcuts = list ([]);
								var shortcutsobj = proc.getpath ('shortcuts');
								if (shortcutsobj) {
									var __iterable1__ = shortcutsobj.childs;
									for (var __index1__ = 0; __index1__ < len (__iterable1__); __index1__++) {
										var shortcut = __iterable1__ [__index1__];
										shortcuts.append (list ([shortcut.key, shortcut.value]));
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
					var Config = __class__ ('Config', [e], {
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
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
								var args = dict ({});
							};
							__super__ (Config, '__init__') (self, 'div');
							self.id = args.py_get ('id', 'config');
							self.schemaconfig = dict ({'kind': 'collection', 'disposition': 'dict'});
							self.build ();
						});}
					});
					__pragma__ ('<use>' +
						'connection' +
						'dom' +
						'schema' +
						'utils' +
						'widgets' +
					'</use>')
					__pragma__ ('<all>')
						__all__.Button = Button;
						__all__.Config = Config;
						__all__.DIR_ITEM_FIELDS = DIR_ITEM_FIELDS;
						__all__.DirBrowser = DirBrowser;
						__all__.DirItem = DirItem;
						__all__.Div = Div;
						__all__.Doc = Doc;
						__all__.EditTextarea = EditTextarea;
						__all__.Editor = Editor;
						__all__.FileUploader = FileUploader;
						__all__.Log = Log;
						__all__.LogItem = LogItem;
						__all__.ProcessConsole = ProcessConsole;
						__all__.ProcessInput = ProcessInput;
						__all__.ProcessPane = ProcessPane;
						__all__.Schema = Schema;
						__all__.Span = Span;
						__all__.SplitPane = SplitPane;
						__all__.Tab = Tab;
						__all__.TabPane = TabPane;
						__all__.TextArea = TextArea;
						__all__.__name__ = __name__;
						__all__.allchilds = allchilds;
						__all__.e = e;
						__all__.escapeHTML = escapeHTML;
						__all__.getconn = getconn;
						__all__.getrecm = getrecm;
					__pragma__ ('</all>')
				}
			}
		}
	);

	__nest__ (
		__all__,
		'utils', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'utils';
					var MODE = function () {
						if (__in__ ('localhost', window.location.host)) {
							return 'dev';
						}
						return 'prod';
					};
					var IS_DEV = function () {
						return MODE () == 'dev';
					};
					var IS_PROD = function () {
						return MODE () == 'prod';
					};
					var effpath = function (path) {
						return (path + ':') + MODE ();
					};
					var queryparams = dict ({});
					try {
						var querystring = window.location.search.slice (1);
						var qsparts = querystring.py_split ('&');
						var __iterable0__ = qsparts;
						for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
							var part = __iterable0__ [__index0__];
							var subparts = part.py_split ('=');
							queryparams [subparts [0]] = subparts [1];
						}
					}
					catch (__except0__) {
						print ('could not parse query string');
					}
					print ('queryparams', queryparams);
					var seed = 1;
					var random = function () {
						seed++;
						var x = Math.sin (seed) * 10000;
						return x - Math.floor (x);
					};
					var setseed = function (newseed) {
						seed = newseed;
					};
					var MATE_SCORE = 10000;
					var MATE_LIMIT = MATE_SCORE * 0.9;
					var WINNING_MOVE_LIMIT = 1000;
					var DOUBLE_EXCLAM_LIMIT = 500;
					var EXCLAM_LIMIT = 350;
					var PROMISING_LIMIT = 250;
					var INTERESTING_LIMIT = 150;
					var DRAWISH_LIMIT = 80;
					var scoreverbal = function (score) {
						if (abs (score) < MATE_LIMIT) {
							return str (score);
						}
						if (score >= 0) {
							return '#{}'.format (MATE_SCORE - score);
						}
						return '#{}'.format (-(MATE_SCORE) - score);
					};
					var scorecolor = function (score) {
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
					var uci_variant_to_variantkey = function (uci_variant, chess960) {
						if (typeof chess960 == 'undefined' || (chess960 != null && chess960 .hasOwnProperty ("__kwargtrans__"))) {;
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
					var getglobalcssvar = function (key) {
						return getComputedStyle (window.document.documentElement).getPropertyValue (key);
					};
					var getglobalcssvarpxint = function (key, py_default) {
						try {
							var px = getglobalcssvar (key);
							var pxint = int (px.py_replace ('px', ''));
							return pxint;
						}
						catch (__except0__) {
							return py_default;
						}
					};
					var View = __class__ ('View', [object], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, callback, value) {
							if (typeof value == 'undefined' || (value != null && value .hasOwnProperty ("__kwargtrans__"))) {;
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
					var Vect = __class__ ('Vect', [object], {
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
					var dateToDateInputStr = function (dateObj) {
						var month = dateObj.getUTCMonth () + 1;
						var day = dateObj.getUTCDate ();
						var year = dateObj.getUTCFullYear ();
						return '{}-{}-{}'.format (year, pad (month, 2), pad (day, 2));
					};
					var dateInputStrToDate = function (dateInputStr) {
						var parts = dateInputStr.py_split ('-');
						var year = parseInt (parts [0]);
						var month = parseInt (parts [1]) - 1;
						var day = parseInt (parts [2]);
						return new Date (year, month, day);
					};
					var xor = function (b1, b2) {
						if (b1 && b2) {
							return false;
						}
						if (b1 || b2) {
							return true;
						}
						return false;
					};
					var pad = function (x, p) {
						var s = '{}'.format (x);
						while (len (s) < p) {
							var s = '0' + s;
						}
						return s;
					};
					var texttofloat = function (text, py_default) {
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
					var allchilds = function (node, childs) {
						if (typeof childs == 'undefined' || (childs != null && childs .hasOwnProperty ("__kwargtrans__"))) {;
							var childs = list ([]);
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
					var getext = function (dir) {
						var parts = dir.py_split ('.');
						return parts [len (parts) - 1];
					};
					var escapeHTML = function (html) {
						return html.py_replace ('&', '&amp;').py_replace ('<', '&lt;').py_replace ('>', '&gt;').py_replace ('\n', '<br>');
					};
					var getrec = function (path, currobj, py_default) {
						if (typeof py_default == 'undefined' || (py_default != null && py_default .hasOwnProperty ("__kwargtrans__"))) {;
							var py_default = null;
						};
						var parts = path.py_split ('/');
						var key = parts [0];
						if (currobj ['disposition'] == 'dict') {
							var __iterable0__ = currobj ['childsarg'];
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var child = __iterable0__ [__index0__];
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
					var getrecm = function (path, obj, py_default) {
						var value = getrec (path, obj, '__none__');
						if (value === '__none__') {
							return getrec (effpath (path), obj, py_default);
						}
						else {
							return value;
						}
					};
					var getitem = function (obj, key, py_default) {
						if (__in__ (key, obj)) {
							return obj [key];
						}
						return py_default;
					};
					var cpick = function (cond, valuetrue, valuefalse) {
						if (cond) {
							return valuetrue;
						}
						return valuefalse;
					};
					var getelse = function (value, elsevalue) {
						if (value) {
							return value;
						}
						return elsevalue;
					};
					var ce = function (tag) {
						return document.createElement (tag);
					};
					var ge = function (id) {
						return document.getElementById (id);
					};
					var getScrollBarWidth = function () {
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
					__pragma__ ('<all>')
						__all__.DOUBLE_EXCLAM_LIMIT = DOUBLE_EXCLAM_LIMIT;
						__all__.DRAWISH_LIMIT = DRAWISH_LIMIT;
						__all__.EXCLAM_LIMIT = EXCLAM_LIMIT;
						__all__.INTERESTING_LIMIT = INTERESTING_LIMIT;
						__all__.IS_DEV = IS_DEV;
						__all__.IS_PROD = IS_PROD;
						__all__.MATE_LIMIT = MATE_LIMIT;
						__all__.MATE_SCORE = MATE_SCORE;
						__all__.MODE = MODE;
						__all__.PROMISING_LIMIT = PROMISING_LIMIT;
						__all__.Vect = Vect;
						__all__.View = View;
						__all__.WINNING_MOVE_LIMIT = WINNING_MOVE_LIMIT;
						__all__.__name__ = __name__;
						__all__.allchilds = allchilds;
						__all__.ce = ce;
						__all__.cpick = cpick;
						__all__.dateInputStrToDate = dateInputStrToDate;
						__all__.dateToDateInputStr = dateToDateInputStr;
						__all__.effpath = effpath;
						__all__.escapeHTML = escapeHTML;
						__all__.ge = ge;
						__all__.getScrollBarWidth = getScrollBarWidth;
						__all__.getelse = getelse;
						__all__.getext = getext;
						__all__.getglobalcssvar = getglobalcssvar;
						__all__.getglobalcssvarpxint = getglobalcssvarpxint;
						__all__.getitem = getitem;
						__all__.getrec = getrec;
						__all__.getrecm = getrecm;
						__all__.pad = pad;
						__all__.part = part;
						__all__.qsparts = qsparts;
						__all__.queryparams = queryparams;
						__all__.querystring = querystring;
						__all__.random = random;
						__all__.scorecolor = scorecolor;
						__all__.scoreverbal = scoreverbal;
						__all__.seed = seed;
						__all__.setseed = setseed;
						__all__.subparts = subparts;
						__all__.texttofloat = texttofloat;
						__all__.uci_variant_to_variantkey = uci_variant_to_variantkey;
						__all__.xor = xor;
					__pragma__ ('</all>')
				}
			}
		}
	);

	__nest__ (
		__all__,
		'widgets', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'widgets';
					var e = __init__ (__world__.dom).e;
					var Div = __init__ (__world__.dom).Div;
					var P = __init__ (__world__.dom).P;
					var Form = __init__ (__world__.dom).Form;
					var FileInput = __init__ (__world__.dom).FileInput;
					var Label = __init__ (__world__.dom).Label;
					var TextInput = __init__ (__world__.dom).TextInput;
					var Button = __init__ (__world__.dom).Button;
					var Span = __init__ (__world__.dom).Span;
					var getScrollBarWidth = __init__ (__world__.utils).getScrollBarWidth;
					var escapeHTML = __init__ (__world__.utils).escapeHTML;
					var MAX_LOGITEMS = 100;
					var SplitPane = __class__ ('SplitPane', [e], {
						__module__: __name__,
						get resize () {return __get__ (this, function (self, width, height) {
							if (typeof width == 'undefined' || (width != null && width .hasOwnProperty ("__kwargtrans__"))) {;
								var width = null;
							};
							if (typeof height == 'undefined' || (height != null && height .hasOwnProperty ("__kwargtrans__"))) {;
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
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
								var args = dict ({});
							};
							__super__ (SplitPane, '__init__') (self, 'div');
							self.controlheight = args.py_get ('controlheight', 100);
							self.container = Div (list (['splitpane', 'container']));
							self.controlpanel = Div (list (['splitpane', 'controlpanel']));
							self.contentdiv = Div (list (['splitpane', 'contentdiv']));
							self.container.a (list ([self.controlpanel, self.contentdiv]));
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
					var Tab = __class__ ('Tab', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, key, displayname, element) {
							__super__ (Tab, '__init__') (self, 'div');
							self.key = key;
							self.displayname = displayname;
							self.element = element;
							self.container = Div (list (['tab', 'container', 'noselect'])).html (displayname);
							self.a (self.container);
						});}
					});
					var TabPane = __class__ ('TabPane', [SplitPane], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, args) {
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
								var args = dict ({});
							};
							args ['controlheight'] = args.py_get ('controlheight', 35);
							__super__ (TabPane, '__init__') (self, args);
							self.tabmargin = args.py_get ('tabmargin', 5);
							self.tabpadding = args.py_get ('tabpadding', 5);
							self.tabs = args.py_get ('tabs', list ([]));
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
							};
							return tabclicked;
						});},
						get settabs () {return __get__ (this, function (self, tabs) {
							self.tabs = tabs;
							var __iterable0__ = self.tabs;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var tab = __iterable0__ [__index0__];
								tab.ae ('mousedown', self.tabclickedfactory (tab));
								tab.element.parenttabpane = self;
							}
							return self;
						});},
						get build () {return __get__ (this, function (self) {
							self.controlpanel.x ();
							var __iterable0__ = self.tabs;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var tab = __iterable0__ [__index0__];
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
					var FileUploader = __class__ ('FileUploader', [e], {
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
							if (typeof files == 'undefined' || (files != null && files .hasOwnProperty ("__kwargtrans__"))) {;
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
							self.form.a (list ([self.desc, self.fileinput, self.button]));
							self.droparea.a (self.form);
							var __iterable0__ = list (['dragenter', 'dragover', 'dragleave', 'drop']);
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var eventname = __iterable0__ [__index0__];
								self.droparea.ae (eventname, self.preventdefaults);
							}
							var __iterable0__ = list (['dragenter', 'dragover']);
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var eventname = __iterable0__ [__index0__];
								self.droparea.ae (eventname, self.highlight);
							}
							var __iterable0__ = list (['dragleave', 'drop']);
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var eventname = __iterable0__ [__index0__];
								self.droparea.ae (eventname, self.unhighlight);
							}
							self.droparea.ae ('drop', self.handledrop);
							self.info = Div ('fileuploadinfo');
							self.infoitems = list ([]);
							self.a (list ([self.droparea, self.info]));
						});},
						get __init__ () {return __get__ (this, function (self, args) {
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
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
					var ProcessInput = __class__ ('ProcessInput', [e], {
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
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
								var args = dict ({});
							};
							__super__ (ProcessInput, '__init__') (self, 'div');
							self.container = Div ('processinput');
							self.buttonlabel = args.py_get ('buttonlabel', 'Submit');
							self.entercallback = args.py_get ('entercallback', null);
							self.textinput = TextInput ().setentercallback (self.entercallback);
							self.submitbutton = Button (self.buttonlabel, self.onenter);
							self.container.a (list ([self.textinput, self.submitbutton]));
							self.a (self.container);
						});}
					});
					var LogItem = __class__ ('LogItem', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, args) {
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
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
							self.container.a (list ([self.promptspan, self.textspan]));
							self.a (self.container);
						});}
					});
					var Log = __class__ ('Log', [e], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, args) {
							if (typeof args == 'undefined' || (args != null && args .hasOwnProperty ("__kwargtrans__"))) {;
								var args = dict ({});
							};
							__super__ (Log, '__init__') (self, 'div');
							self.py_items = list ([]);
							self.container = Div ();
							self.a (self.container);
						});},
						get build () {return __get__ (this, function (self) {
							self.container.x ();
							var __iterable0__ = self.py_items;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var item = __iterable0__ [__index0__];
								self.container.a (item);
							}
						});},
						get log () {return __get__ (this, function (self, item) {
							var newitems = list ([item]);
							var i = 1;
							var __iterable0__ = self.py_items;
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var olditem = __iterable0__ [__index0__];
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
					__pragma__ ('<use>' +
						'dom' +
						'utils' +
					'</use>')
					__pragma__ ('<all>')
						__all__.Button = Button;
						__all__.Div = Div;
						__all__.FileInput = FileInput;
						__all__.FileUploader = FileUploader;
						__all__.Form = Form;
						__all__.Label = Label;
						__all__.Log = Log;
						__all__.LogItem = LogItem;
						__all__.MAX_LOGITEMS = MAX_LOGITEMS;
						__all__.P = P;
						__all__.ProcessInput = ProcessInput;
						__all__.Span = Span;
						__all__.SplitPane = SplitPane;
						__all__.Tab = Tab;
						__all__.TabPane = TabPane;
						__all__.TextInput = TextInput;
						__all__.__name__ = __name__;
						__all__.e = e;
						__all__.escapeHTML = escapeHTML;
						__all__.getScrollBarWidth = getScrollBarWidth;
					__pragma__ ('</all>')
				}
			}
		}
	);

	(function () {
		var __name__ = '__main__';
		var Client = __init__ (__world__.client).Client;
		Client ().startup ();
		__pragma__ ('<use>' +
			'client' +
		'</use>')
		__pragma__ ('<all>')
			__all__.Client = Client;
			__all__.__name__ = __name__;
		__pragma__ ('</all>')
	}) ();

    return __all__;
}
window ['app'] = app ();
