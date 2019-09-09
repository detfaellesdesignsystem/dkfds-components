(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DKFDS = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * array-foreach
 *   Array#forEach ponyfill for older browsers
 *   (Ponyfill: A polyfill that doesn't overwrite the native method)
 * 
 * https://github.com/twada/array-foreach
 *
 * Copyright (c) 2015-2016 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/array-foreach/blob/master/MIT-LICENSE
 */
'use strict';

module.exports = function forEach(ary, callback, thisArg) {
    if (ary.forEach) {
        ary.forEach(callback, thisArg);
        return;
    }
    for (var i = 0; i < ary.length; i += 1) {
        callback.call(thisArg, ary[i], i, ary);
    }
};

},{}],2:[function(require,module,exports){
"use strict";

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in window.self) {

	// Full polyfill for browsers with no classList support
	// Including IE < Edge missing SVGElement.classList
	if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {

		(function (view) {

			"use strict";

			if (!('Element' in view)) return;

			var classListProp = "classList",
			    protoProp = "prototype",
			    elemCtrProto = view.Element[protoProp],
			    objCtr = Object,
			    strTrim = String[protoProp].trim || function () {
				return this.replace(/^\s+|\s+$/g, "");
			},
			    arrIndexOf = Array[protoProp].indexOf || function (item) {
				var i = 0,
				    len = this.length;
				for (; i < len; i++) {
					if (i in this && this[i] === item) {
						return i;
					}
				}
				return -1;
			}
			// Vendors: please allow content code to instantiate DOMExceptions
			,
			    DOMEx = function DOMEx(type, message) {
				this.name = type;
				this.code = DOMException[type];
				this.message = message;
			},
			    checkTokenAndGetIndex = function checkTokenAndGetIndex(classList, token) {
				if (token === "") {
					throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
				}
				if (/\s/.test(token)) {
					throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
				}
				return arrIndexOf.call(classList, token);
			},
			    ClassList = function ClassList(elem) {
				var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
				    classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
				    i = 0,
				    len = classes.length;
				for (; i < len; i++) {
					this.push(classes[i]);
				}
				this._updateClassName = function () {
					elem.setAttribute("class", this.toString());
				};
			},
			    classListProto = ClassList[protoProp] = [],
			    classListGetter = function classListGetter() {
				return new ClassList(this);
			};
			// Most DOMException implementations don't allow calling DOMException's toString()
			// on non-DOMExceptions. Error's toString() is sufficient here.
			DOMEx[protoProp] = Error[protoProp];
			classListProto.item = function (i) {
				return this[i] || null;
			};
			classListProto.contains = function (token) {
				token += "";
				return checkTokenAndGetIndex(this, token) !== -1;
			};
			classListProto.add = function () {
				var tokens = arguments,
				    i = 0,
				    l = tokens.length,
				    token,
				    updated = false;
				do {
					token = tokens[i] + "";
					if (checkTokenAndGetIndex(this, token) === -1) {
						this.push(token);
						updated = true;
					}
				} while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.remove = function () {
				var tokens = arguments,
				    i = 0,
				    l = tokens.length,
				    token,
				    updated = false,
				    index;
				do {
					token = tokens[i] + "";
					index = checkTokenAndGetIndex(this, token);
					while (index !== -1) {
						this.splice(index, 1);
						updated = true;
						index = checkTokenAndGetIndex(this, token);
					}
				} while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.toggle = function (token, force) {
				token += "";

				var result = this.contains(token),
				    method = result ? force !== true && "remove" : force !== false && "add";

				if (method) {
					this[method](token);
				}

				if (force === true || force === false) {
					return force;
				} else {
					return !result;
				}
			};
			classListProto.toString = function () {
				return this.join(" ");
			};

			if (objCtr.defineProperty) {
				var classListPropDesc = {
					get: classListGetter,
					enumerable: true,
					configurable: true
				};
				try {
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
				} catch (ex) {
					// IE 8 doesn't support enumerable:true
					// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
					// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
					if (ex.number === undefined || ex.number === -0x7FF5EC54) {
						classListPropDesc.enumerable = false;
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					}
				}
			} else if (objCtr[protoProp].__defineGetter__) {
				elemCtrProto.__defineGetter__(classListProp, classListGetter);
			}
		})(window.self);
	}

	// There is full or partial native classList support, so just check if we need
	// to normalize the add/remove and toggle APIs.

	(function () {
		"use strict";

		var testElement = document.createElement("_");

		testElement.classList.add("c1", "c2");

		// Polyfill for IE 10/11 and Firefox <26, where classList.add and
		// classList.remove exist but support only one argument at a time.
		if (!testElement.classList.contains("c2")) {
			var createMethod = function createMethod(method) {
				var original = DOMTokenList.prototype[method];

				DOMTokenList.prototype[method] = function (token) {
					var i,
					    len = arguments.length;

					for (i = 0; i < len; i++) {
						token = arguments[i];
						original.call(this, token);
					}
				};
			};
			createMethod('add');
			createMethod('remove');
		}

		testElement.classList.toggle("c3", false);

		// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
		// support the second argument.
		if (testElement.classList.contains("c3")) {
			var _toggle = DOMTokenList.prototype.toggle;

			DOMTokenList.prototype.toggle = function (token, force) {
				if (1 in arguments && !this.contains(token) === !force) {
					return force;
				} else {
					return _toggle.call(this, token);
				}
			};
		}

		testElement = null;
	})();
}

},{}],3:[function(require,module,exports){
'use strict';

require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/_core":10,"../../modules/es6.array.from":57,"../../modules/es6.string.iterator":59}],4:[function(require,module,exports){
'use strict';

require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/_core":10,"../../modules/es6.object.assign":58}],5:[function(require,module,exports){
'use strict';

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],6:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":26}],7:[function(require,module,exports){
'use strict';

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":48,"./_to-iobject":50,"./_to-length":51}],8:[function(require,module,exports){
'use strict';

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
  // builtinTag case
  : ARG ? cof(O)
  // ES3 arguments fallback
  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":9,"./_wks":55}],9:[function(require,module,exports){
"use strict";

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],10:[function(require,module,exports){
'use strict';

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],11:[function(require,module,exports){
'use strict';

var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
};

},{"./_object-dp":35,"./_property-desc":42}],12:[function(require,module,exports){
'use strict';

// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":5}],13:[function(require,module,exports){
"use strict";

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],14:[function(require,module,exports){
'use strict';

// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_fails":18}],15:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":19,"./_is-object":26}],16:[function(require,module,exports){
'use strict';

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

},{}],17:[function(require,module,exports){
'use strict';

var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":10,"./_ctx":12,"./_global":19,"./_hide":21,"./_redefine":43}],18:[function(require,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],19:[function(require,module,exports){
'use strict';

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
// eslint-disable-next-line no-new-func
: Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],20:[function(require,module,exports){
"use strict";

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],21:[function(require,module,exports){
'use strict';

var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":14,"./_object-dp":35,"./_property-desc":42}],22:[function(require,module,exports){
'use strict';

var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":19}],23:[function(require,module,exports){
'use strict';

module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_descriptors":14,"./_dom-create":15,"./_fails":18}],24:[function(require,module,exports){
'use strict';

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":9}],25:[function(require,module,exports){
'use strict';

// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":31,"./_wks":55}],26:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
};

},{}],27:[function(require,module,exports){
'use strict';

// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":6}],28:[function(require,module,exports){
'use strict';

var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () {
  return this;
});

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":21,"./_object-create":34,"./_property-desc":42,"./_set-to-string-tag":44,"./_wks":55}],29:[function(require,module,exports){
'use strict';

var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function returnThis() {
  return this;
};

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":17,"./_hide":21,"./_iter-create":28,"./_iterators":31,"./_library":32,"./_object-gpo":38,"./_redefine":43,"./_set-to-string-tag":44,"./_wks":55}],30:[function(require,module,exports){
'use strict';

var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () {
    SAFE_CLOSING = true;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {/* empty */}

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () {
      return { done: safe = true };
    };
    arr[ITERATOR] = function () {
      return iter;
    };
    exec(arr);
  } catch (e) {/* empty */}
  return safe;
};

},{"./_wks":55}],31:[function(require,module,exports){
"use strict";

module.exports = {};

},{}],32:[function(require,module,exports){
"use strict";

module.exports = false;

},{}],33:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)

var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
    }
  }return T;
} : $assign;

},{"./_fails":18,"./_iobject":24,"./_object-gops":37,"./_object-keys":40,"./_object-pie":41,"./_to-object":52}],34:[function(require,module,exports){
'use strict';

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function Empty() {/* empty */};
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) {
    delete _createDict[PROTOTYPE][enumBugKeys[i]];
  }return _createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":6,"./_dom-create":15,"./_enum-bug-keys":16,"./_html":22,"./_object-dps":36,"./_shared-key":45}],35:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_ie8-dom-define":23,"./_to-primitive":53}],36:[function(require,module,exports){
'use strict';

var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) {
    dP.f(O, P = keys[i++], Properties[P]);
  }return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_object-dp":35,"./_object-keys":40}],37:[function(require,module,exports){
"use strict";

exports.f = Object.getOwnPropertySymbols;

},{}],38:[function(require,module,exports){
'use strict';

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }return O instanceof Object ? ObjectProto : null;
};

},{"./_has":20,"./_shared-key":45,"./_to-object":52}],39:[function(require,module,exports){
'use strict';

var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) {
    if (key != IE_PROTO) has(O, key) && result.push(key);
  } // Don't enum bug & hidden keys
  while (names.length > i) {
    if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  }return result;
};

},{"./_array-includes":7,"./_has":20,"./_shared-key":45,"./_to-iobject":50}],40:[function(require,module,exports){
'use strict';

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":16,"./_object-keys-internal":39}],41:[function(require,module,exports){
"use strict";

exports.f = {}.propertyIsEnumerable;

},{}],42:[function(require,module,exports){
"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],43:[function(require,module,exports){
'use strict';

var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":10,"./_global":19,"./_has":20,"./_hide":21,"./_uid":54}],44:[function(require,module,exports){
'use strict';

var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":20,"./_object-dp":35,"./_wks":55}],45:[function(require,module,exports){
'use strict';

var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":46,"./_uid":54}],46:[function(require,module,exports){
'use strict';

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":10,"./_global":19,"./_library":32}],47:[function(require,module,exports){
'use strict';

var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":13,"./_to-integer":49}],48:[function(require,module,exports){
'use strict';

var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":49}],49:[function(require,module,exports){
"use strict";

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],50:[function(require,module,exports){
'use strict';

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":13,"./_iobject":24}],51:[function(require,module,exports){
'use strict';

// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":49}],52:[function(require,module,exports){
'use strict';

// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":13}],53:[function(require,module,exports){
'use strict';

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":26}],54:[function(require,module,exports){
'use strict';

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],55:[function(require,module,exports){
'use strict';

var store = require('./_shared')('wks');
var uid = require('./_uid');
var _Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof _Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":19,"./_shared":46,"./_uid":54}],56:[function(require,module,exports){
'use strict';

var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

},{"./_classof":8,"./_core":10,"./_iterators":31,"./_wks":55}],57:[function(require,module,exports){
'use strict';

var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) {
  Array.from(iter);
}), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":11,"./_ctx":12,"./_export":17,"./_is-array-iter":25,"./_iter-call":27,"./_iter-detect":30,"./_to-length":51,"./_to-object":52,"./core.get-iterator-method":56}],58:[function(require,module,exports){
'use strict';

// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":17,"./_object-assign":33}],59:[function(require,module,exports){
'use strict';

var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":29,"./_string-at":47}],60:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition();else if (typeof define == 'function' && _typeof(define.amd) == 'object') define(definition);else this[name] = definition();
}('domready', function () {

  var fns = [],
      _listener,
      doc = document,
      hack = doc.documentElement.doScroll,
      domContentLoaded = 'DOMContentLoaded',
      loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);

  if (!loaded) doc.addEventListener(domContentLoaded, _listener = function listener() {
    doc.removeEventListener(domContentLoaded, _listener);
    loaded = 1;
    while (_listener = fns.shift()) {
      _listener();
    }
  });

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn);
  };
});

},{}],61:[function(require,module,exports){
'use strict';

// element-closest | CC0-1.0 | github.com/jonathantneal/closest

(function (ElementProto) {
	if (typeof ElementProto.matches !== 'function') {
		ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
			var element = this;
			var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
			var index = 0;

			while (elements[index] && elements[index] !== element) {
				++index;
			}

			return Boolean(elements[index]);
		};
	}

	if (typeof ElementProto.closest !== 'function') {
		ElementProto.closest = function closest(selector) {
			var element = this;

			while (element && element.nodeType === 1) {
				if (element.matches(selector)) {
					return element;
				}

				element = element.parentNode;
			}

			return null;
		};
	}
})(window.Element.prototype);

},{}],62:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],63:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var assign = require('object-assign');
var delegate = require('../delegate');
var delegateAll = require('../delegateAll');

var DELEGATE_PATTERN = /^(.+):delegate\((.+)\)$/;
var SPACE = ' ';

var getListeners = function getListeners(type, handler) {
  var match = type.match(DELEGATE_PATTERN);
  var selector;
  if (match) {
    type = match[1];
    selector = match[2];
  }

  var options;
  if ((typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object') {
    options = {
      capture: popKey(handler, 'capture'),
      passive: popKey(handler, 'passive')
    };
  }

  var listener = {
    selector: selector,
    delegate: (typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) === 'object' ? delegateAll(handler) : selector ? delegate(selector, handler) : handler,
    options: options
  };

  if (type.indexOf(SPACE) > -1) {
    return type.split(SPACE).map(function (_type) {
      return assign({ type: _type }, listener);
    });
  } else {
    listener.type = type;
    return [listener];
  }
};

var popKey = function popKey(obj, key) {
  var value = obj[key];
  delete obj[key];
  return value;
};

module.exports = function behavior(events, props) {
  var listeners = Object.keys(events).reduce(function (memo, type) {
    var listeners = getListeners(type, events[type]);
    return memo.concat(listeners);
  }, []);

  return assign({
    add: function addBehavior(element) {
      listeners.forEach(function (listener) {
        element.addEventListener(listener.type, listener.delegate, listener.options);
      });
    },
    remove: function removeBehavior(element) {
      listeners.forEach(function (listener) {
        element.removeEventListener(listener.type, listener.delegate, listener.options);
      });
    }
  }, props);
};

},{"../delegate":66,"../delegateAll":65,"object-assign":62}],64:[function(require,module,exports){
"use strict";

module.exports = function compose(functions) {
  return function (e) {
    return functions.some(function (fn) {
      return fn.call(this, e) === false;
    }, this);
  };
};

},{}],65:[function(require,module,exports){
'use strict';

var delegate = require('../delegate');
var compose = require('../compose');

var SPLAT = '*';

module.exports = function delegateAll(selectors) {
  var keys = Object.keys(selectors);

  // XXX optimization: if there is only one handler and it applies to
  // all elements (the "*" CSS selector), then just return that
  // handler
  if (keys.length === 1 && keys[0] === SPLAT) {
    return selectors[SPLAT];
  }

  var delegates = keys.reduce(function (memo, selector) {
    memo.push(delegate(selector, selectors[selector]));
    return memo;
  }, []);
  return compose(delegates);
};

},{"../compose":64,"../delegate":66}],66:[function(require,module,exports){
'use strict';

// polyfill Element.prototype.closest
require('element-closest');

module.exports = function delegate(selector, fn) {
  return function delegation(event) {
    var target = event.target.closest(selector);
    if (target) {
      return fn.call(target, event);
    }
  };
};

},{"element-closest":61}],67:[function(require,module,exports){
"use strict";

module.exports = function once(listener, options) {
  var wrapped = function wrappedOnce(e) {
    e.currentTarget.removeEventListener(e.type, wrapped, options);
    return listener.call(this, e);
  };
  return wrapped;
};

},{}],68:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var toggle = require('../utils/toggle');
var isElementInViewport = require('../utils/is-in-viewport');
var BUTTON = '.accordion-button[aria-controls]';
var EXPANDED = 'aria-expanded';
var MULTISELECTABLE = 'aria-multiselectable';

var Accordion = function () {
  function Accordion(accordion) {
    _classCallCheck(this, Accordion);

    this.accordion = accordion;
    this.buttons = accordion.querySelectorAll(BUTTON);
    this.eventClose = new Event('fds.accordion.close');
    this.eventOpen = new Event('fds.accordion.open');
    this.init();
  }

  _createClass(Accordion, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var _loop = function _loop() {
        var currentButton = _this.buttons[i];

        var expanded = currentButton.getAttribute(EXPANDED) === 'true';
        _this.toggleButton(currentButton, expanded);

        var that = _this;
        currentButton.addEventListener('click', function (event) {
          that.eventOnClick(event, this);
        });
      };

      for (var i = 0; i < this.buttons.length; i++) {
        _loop();
      }
    }
  }, {
    key: 'eventOnClick',
    value: function eventOnClick(event, button) {
      event.preventDefault();
      this.toggleButton(button);
      if (button.getAttribute(EXPANDED) === 'true') {
        // We were just expanded, but if another accordion was also just
        // collapsed, we may no longer be in the viewport. This ensures
        // that we are still visible, so the user isn't confused.
        if (!isElementInViewport(button)) button.scrollIntoView();
      }
    }

    /**
     * Toggle a button's "pressed" state, optionally providing a target
     * state.
     *
     * @param {HTMLButtonElement} button
     * @param {boolean?} expanded If no state is provided, the current
     * state will be toggled (from false to true, and vice-versa).
     * @return {boolean} the resulting state
     */

  }, {
    key: 'toggleButton',
    value: function toggleButton(button, expanded) {
      if (!this.accordion) {
        throw new Error(BUTTON + ' is missing outer ACCORDION');
      }

      expanded = toggle(button, expanded);

      if (expanded) {
        button.dispatchEvent(this.eventOpen);
      } else {
        button.dispatchEvent(this.eventClose);
      }

      // XXX multiselectable is opt-in, to preserve legacy behavior
      var multiselectable = this.accordion.getAttribute(MULTISELECTABLE) === 'true';

      if (expanded && !multiselectable) {
        for (var i = 0; i < this.buttons.length; i++) {
          var currentButtton = this.buttons[i];
          if (currentButtton !== button) {
            toggle(currentButtton, false);
            currentButtton.dispatchEvent(this.eventClose);
          }
        }
      }
    }
    /**
     * @param {HTMLButtonElement} button
     * @return {boolean} true
     */

  }, {
    key: 'showButton',
    value: function showButton(button) {
      toggleButton(button, true);
    }

    /**
     * @param {HTMLButtonElement} button
     * @return {boolean} false
     */

  }, {
    key: 'hideButton',
    value: function hideButton(button) {
      toggleButton(button, false);
    }
  }]);

  return Accordion;
}();

module.exports = Accordion;

},{"../utils/is-in-viewport":87,"../utils/toggle":89}],69:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheckboxToggleContent = function () {
    function CheckboxToggleContent(el) {
        _classCallCheck(this, CheckboxToggleContent);

        this.jsToggleTrigger = '.js-checkbox-toggle-content';
        this.jsToggleTarget = 'data-js-target';
        this.eventClose = new Event('fds.collapse.close');
        this.eventOpen = new Event('fds.collapse.open');
        this.targetEl = null;
        this.checkboxEl = null;

        this.init(el);
    }

    _createClass(CheckboxToggleContent, [{
        key: 'init',
        value: function init(el) {
            this.checkboxEl = el;
            var that = this;
            this.checkboxEl.addEventListener('change', function (event) {
                that.toggle(that.checkboxEl);
            });
            this.toggle(this.checkboxEl);
        }
    }, {
        key: 'toggle',
        value: function toggle(triggerEl) {
            var targetAttr = triggerEl.getAttribute(this.jsToggleTarget);
            if (targetAttr !== null && targetAttr !== undefined) {
                var targetEl = document.querySelector(targetAttr);
                if (targetEl !== null && targetEl !== undefined) {
                    if (triggerEl.checked) {
                        this.open(triggerEl, targetEl);
                    } else {
                        this.close(triggerEl, targetEl);
                    }
                }
            }
        }
    }, {
        key: 'open',
        value: function open(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute('aria-expanded', 'true');
                targetEl.classList.remove('collapsed');
                targetEl.setAttribute('aria-hidden', 'false');
                triggerEl.dispatchEvent(this.eventOpen);
            }
        }
    }, {
        key: 'close',
        value: function close(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute('aria-expanded', 'false');
                targetEl.classList.add('collapsed');
                targetEl.setAttribute('aria-hidden', 'true');
                triggerEl.dispatchEvent(this.eventClose);
            }
        }
    }]);

    return CheckboxToggleContent;
}();

module.exports = CheckboxToggleContent;

},{}],70:[function(require,module,exports){
/**
 * Collapse/expand.
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collapse = function () {
  function Collapse(element) {
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'toggle';

    _classCallCheck(this, Collapse);

    this.jsCollapseTarget = 'data-js-target';
    this.triggerEl = element;
    this.targetEl;
    this.animateInProgress = false;
    var that = this;
    this.eventClose = new Event('fds.collapse.close');
    this.eventOpen = new Event('fds.collapse.open');
    this.triggerEl.addEventListener('click', function () {
      that.toggle();
    });
  }

  _createClass(Collapse, [{
    key: 'toggleCollapse',
    value: function toggleCollapse(forceClose) {
      var targetAttr = this.triggerEl.getAttribute(this.jsCollapseTarget);
      if (targetAttr !== null && targetAttr !== undefined) {
        this.targetEl = document.querySelector(targetAttr);
        if (this.targetEl !== null && this.targetEl !== undefined) {
          //change state
          if (this.triggerEl.getAttribute('aria-expanded') === 'true' || this.triggerEl.getAttribute('aria-expanded') === undefined || forceClose) {
            //close
            this.animateCollapse();
          } else {
            //open
            this.animateExpand();
          }
        }
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.triggerEl !== null && this.triggerEl !== undefined) {
        this.toggleCollapse();
      }
    }
  }, {
    key: 'animateCollapse',
    value: function animateCollapse() {
      if (!this.animateInProgress) {
        this.animateInProgress = true;

        this.targetEl.style.height = this.targetEl.clientHeight + 'px';
        this.targetEl.classList.add('collapse-transition-collapse');
        var that = this;
        setTimeout(function () {
          that.targetEl.removeAttribute('style');
        }, 5);
        setTimeout(function () {
          that.targetEl.classList.add('collapsed');
          that.targetEl.classList.remove('collapse-transition-collapse');

          that.triggerEl.setAttribute('aria-expanded', 'false');
          that.targetEl.setAttribute('aria-hidden', 'true');
          that.animateInProgress = false;
          that.triggerEl.dispatchEvent(that.eventClose);
        }, 200);
      }
    }
  }, {
    key: 'animateExpand',
    value: function animateExpand() {
      if (!this.animateInProgress) {
        this.animateInProgress = true;
        this.targetEl.classList.remove('collapsed');
        var expandedHeight = this.targetEl.clientHeight;
        this.targetEl.style.height = '0px';
        this.targetEl.classList.add('collapse-transition-expand');
        var that = this;
        setTimeout(function () {
          that.targetEl.style.height = expandedHeight + 'px';
        }, 5);

        setTimeout(function () {
          that.targetEl.classList.remove('collapse-transition-expand');
          that.targetEl.removeAttribute('style');

          that.targetEl.setAttribute('aria-hidden', 'false');
          that.triggerEl.setAttribute('aria-expanded', 'true');
          that.animateInProgress = false;
          that.triggerEl.dispatchEvent(that.eventOpen);
        }, 200);
      }
    }
  }]);

  return Collapse;
}();

module.exports = Collapse;

},{}],71:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var closest = require('../utils/closest');

var Dropdown = function () {
  function Dropdown(el) {
    _classCallCheck(this, Dropdown);

    this.jsDropdownTrigger = '.js-dropdown';
    this.jsDropdownTarget = 'data-js-target';
    this.eventClose = new Event('fds.dropdown.close');
    this.eventOpen = new Event('fds.dropdown.open');

    //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).
    this.navResponsiveBreakpoint = 992; //same as $nav-responsive-breakpoint from the scss.
    this.tringuideBreakpoint = 768; //same as $nav-responsive-breakpoint from the scss.
    this.jsResponsiveCollapseModifier = '.js-dropdown--responsive-collapse';
    this.responsiveCollapseEnabled = false;
    this.responsiveListCollapseEnabled = false;

    this.triggerEl = null;
    this.targetEl = null;

    this.init(el);

    if (this.triggerEl !== null && this.triggerEl !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
      var that = this;

      if (this.triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive')) {
        this.responsiveListCollapseEnabled = true;
      }

      //Clicked outside dropdown -> close it
      document.getElementsByTagName('body')[0].addEventListener('click', function (event) {
        that.outsideClose(event);
      });

      //Clicked on dropdown open button --> toggle it
      this.triggerEl.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation(); //prevents ouside click listener from triggering.
        that.toggleDropdown();
      });

      // set aria-hidden correctly for screenreaders (Tringuide responsive)
      if (this.responsiveListCollapseEnabled) {
        var element = this.triggerEl;
        if (window.IntersectionObserver) {
          // trigger event when button changes visibility
          var observer = new IntersectionObserver(function (entries) {
            // button is visible
            if (entries[0].intersectionRatio) {
              if (element.getAttribute('aria-expanded') === 'false') {
                that.targetEl.setAttribute('aria-hidden', true);
              }
            } else {
              // button is not visible
              if (that.targetEl.getAttribute('aria-hidden') === 'true') {
                that.targetEl.setAttribute('aria-hidden', false);
              }
            }
          }, {
            root: document.body
          });
          observer.observe(element);
        } else {
          // IE: IntersectionObserver is not supported, so we listen for window resize and grid breakpoint instead
          if (that.doResponsiveStepguideCollapse()) {
            // small screen
            if (element.getAttribute('aria-expanded') === 'false') {
              that.targetEl.setAttribute('aria-hidden', true);
            } else {
              that.targetEl.setAttribute('aria-hidden', false);
            }
          } else {
            // Large screen
            that.targetEl.setAttribute('aria-hidden', false);
          }
          window.addEventListener('resize', function () {
            if (that.doResponsiveStepguideCollapse()) {
              if (element.getAttribute('aria-expanded') === 'false') {
                that.targetEl.setAttribute('aria-hidden', true);
              } else {
                that.targetEl.setAttribute('aria-hidden', false);
              }
            } else {
              that.targetEl.setAttribute('aria-hidden', false);
            }
          });
        }
      }

      document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode === 27) {
          that.closeAll();
        }
      };
    }
  }

  _createClass(Dropdown, [{
    key: 'init',
    value: function init(el) {
      this.triggerEl = el;
      if (this.triggerEl !== null && this.triggerEl !== undefined) {
        var targetAttr = this.triggerEl.getAttribute(this.jsDropdownTarget);
        if (targetAttr !== null && targetAttr !== undefined) {
          var targetEl = document.getElementById(targetAttr.replace('#', ''));
          if (targetEl !== null && targetEl !== undefined) {
            this.targetEl = targetEl;
          }
        }
      }

      if (this.triggerEl.classList.contains('js-dropdown--responsive-collapse')) {
        this.responsiveCollapseEnabled = true;
      }

      if (this.triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive')) {
        this.responsiveListCollapseEnabled = true;
      }
    }
  }, {
    key: 'closeAll',
    value: function closeAll() {
      var body = document.querySelector('body');

      var overflowMenuEl = document.getElementsByClassName('overflow-menu');
      var triggerEl = null;
      var targetEl = null;
      for (var oi = 0; oi < overflowMenuEl.length; oi++) {
        var currentOverflowMenuEL = overflowMenuEl[oi];
        for (var a = 0; a < currentOverflowMenuEL.childNodes.length; a++) {
          if (currentOverflowMenuEL.childNodes[a].tagName !== undefined) {
            if (currentOverflowMenuEL.childNodes[a].classList.contains('js-dropdown')) {
              triggerEl = currentOverflowMenuEL.childNodes[a];
            } else if (currentOverflowMenuEL.childNodes[a].classList.contains('overflow-menu-inner')) {
              targetEl = currentOverflowMenuEL.childNodes[a];
            }
          }
        }
        if (targetEl !== null && triggerEl !== null) {
          if (body.classList.contains('mobile_nav-active')) {
            if (!currentOverflowMenuEL.closest('.navbar')) {

              if (triggerEl.getAttribute('aria-expanded') === true) {
                triggerEl.dispatchEvent(this.eventClose);
              }
              triggerEl.setAttribute('aria-expanded', 'false');
              targetEl.classList.add('collapsed');
              targetEl.setAttribute('aria-hidden', 'true');
            }
          } else {
            if (triggerEl.getAttribute('aria-expanded') === true) {
              triggerEl.dispatchEvent(this.eventClose);
            }
            triggerEl.setAttribute('aria-expanded', 'false');
            targetEl.classList.add('collapsed');
            targetEl.setAttribute('aria-hidden', 'true');
          }
        }
      }
    }
  }, {
    key: 'toggleDropdown',
    value: function toggleDropdown(forceClose) {
      if (this.triggerEl !== null && this.triggerEl !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
        //change state

        this.targetEl.style.left = null;
        this.targetEl.style.right = null;

        var rect = this.triggerEl.getBoundingClientRect();
        if (this.triggerEl.getAttribute('aria-expanded') === 'true' || forceClose) {
          //close
          this.triggerEl.setAttribute('aria-expanded', 'false');
          this.targetEl.classList.add('collapsed');
          this.targetEl.setAttribute('aria-hidden', 'true');
          this.triggerEl.dispatchEvent(this.eventClose);
        } else {
          this.closeAll();
          //open
          this.triggerEl.setAttribute('aria-expanded', 'true');
          this.targetEl.classList.remove('collapsed');
          this.targetEl.setAttribute('aria-hidden', 'false');
          this.triggerEl.dispatchEvent(this.eventOpen);
          var offset = this.offset(this.targetEl);

          if (offset.left < 0) {
            this.targetEl.style.left = '0px';
            this.targetEl.style.right = 'auto';
          }
          var right = offset.left + this.targetEl.offsetWidth;
          if (right > window.innerWidth) {
            this.targetEl.style.left = 'auto';
            this.targetEl.style.right = '0px';
          }

          var offsetAgain = this.offset(this.targetEl);

          if (offsetAgain.left < 0) {

            this.targetEl.style.left = '0px';
            this.targetEl.style.right = 'auto';
          }
          right = offsetAgain.left + this.targetEl.offsetWidth;
          if (right > window.innerWidth) {

            this.targetEl.style.left = 'auto';
            this.targetEl.style.right = '0px';
          }
        }
      }
    }
  }, {
    key: 'offset',
    value: function offset(el) {
      var rect = el.getBoundingClientRect(),
          scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
    }
  }, {
    key: 'outsideClose',
    value: function outsideClose(event) {
      if (!this.doResponsiveCollapse()) {
        //closes dropdown when clicked outside.
        var dropdownElm = closest(event.target, this.targetEl.id);
        if ((dropdownElm === null || dropdownElm === undefined) && event.target !== this.triggerEl) {
          //clicked outside trigger, force close
          this.toggleDropdown(true);
        }
      }
    }
  }, {
    key: 'doResponsiveCollapse',
    value: function doResponsiveCollapse() {
      //returns true if responsive collapse is enabled and we are on a small screen.
      if ((this.responsiveCollapseEnabled || this.responsiveListCollapseEnabled) && window.innerWidth <= this.navResponsiveBreakpoint) {
        return true;
      }
      return false;
    }
  }, {
    key: 'doResponsiveStepguideCollapse',
    value: function doResponsiveStepguideCollapse() {
      //returns true if responsive collapse is enabled and we are on a small screen.
      if (this.responsiveListCollapseEnabled && window.innerWidth <= this.tringuideBreakpoint) {
        return true;
      }
      return false;
    }
  }]);

  return Dropdown;
}();

module.exports = Dropdown;

},{"../utils/closest":86}],72:[function(require,module,exports){
'use strict';

module.exports = {
  navigation: require('./navigation'),
  skipnav: require('./skipnav'),
  regexmask: require('./regex-input-mask')
};

},{"./navigation":74,"./regex-input-mask":76,"./skipnav":77}],73:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dialog = function () {
  function Dialog(element) {
    var setEvents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, Dialog);

    this.dialog = element;

    this.openEvent = new Event('fds.modal.open');
    this.closeEvent = new Event('fds.modal.close');
    if (this.dialog === null) {
      return false;
    }
  }

  _createClass(Dialog, [{
    key: 'open',
    value: function open() {
      document.getElementsByTagName('body')[0].classList.add('modal-active');
      this.dialog.classList.add('show');
      this.dialog.dispatchEvent(this.openEvent);
    }
  }, {
    key: 'close',
    value: function close() {
      this.dialog.classList.remove('show');
      document.getElementsByTagName('body')[0].classList.remove('modal-active');
      this.dialog.dispatchEvent(this.closeEvent);
    }
  }]);

  return Dialog;
}();

var Modal = function () {
  function Modal(button) {
    _classCallCheck(this, Modal);

    console.log('MODAL:', button);
    this.button = button;
    this.modal = null;
    this.lastFocus = null;
    this.IgnoreUtilFocusChanges = false;
    if (this.button.getAttribute('data-target') !== undefined && document.querySelector(this.button.getAttribute('data-target')).length !== 0) {
      this.modal = new Dialog(document.querySelector(this.button.getAttribute('data-target')));
    }
    if (this.modal.dialog !== null) {
      this.setEvents();
    } else {
      console.log('Modal not found');
    }
  }

  _createClass(Modal, [{
    key: 'setEvents',
    value: function setEvents() {
      var that = this;
      this.button.addEventListener('click', function (event) {
        that.modal.open();
      });
      this.modal.dialog.addEventListener('click', function (event) {
        if (event.target !== this) return;
        that.modal.close();
      });

      this.modal.dialog.getElementsByClassName('close')[0].addEventListener('click', function (event) {
        that.modal.close();
      });
      this.modal.dialog.addEventListener('fds.modal.open', function (event) {
        that.focusFirstDescendant(that.modal.dialog.getElementsByClassName('modal-dialog')[0]);
      });

      document.addEventListener('focus', function (event) {
        that.trapFocus(event, that);
      }, true);

      document.addEventListener('keyup', function (event) {
        that.handleEscape(event);
      });
    }
  }, {
    key: 'handleEscape',
    value: function handleEscape(event) {
      var key = event.which || event.keyCode;
      var modal = document.querySelector('.modal.show');
      if (modal !== null) {
        var dialog = new Dialog(modal);
        if (key === 27 && dialog.close()) {
          event.stopPropagation();
        }
      }
    }
  }, {
    key: 'trapFocus',
    value: function trapFocus(event, that) {
      if (that.IgnoreUtilFocusChanges) {
        return;
      }
      var currentDialog = that.modal.dialog.getElementsByClassName('modal-dialog')[0];
      console.log('currentDialog', currentDialog);
      if (currentDialog !== null && currentDialog.contains(event.target)) {
        that.lastFocus = event.target;
      } else {
        that.focusFirstDescendant(that.modal.dialog.getElementsByClassName('modal-dialog')[0]);
        if (that.lastFocus == document.activeElement) {
          that.focusLastDescendant(that.modal.dialog.getElementsByClassName('modal-dialog')[0]);
        }
        that.lastFocus = document.activeElement;
      }
    }
    /**
     * @desc Set focus on descendant nodes until the first focusable element is
     *       found.
     * @param element
     *          DOM node for which to find the first focusable descendant.
     * @returns
     *  true if a focusable element is found and focus is set.
     */

  }, {
    key: 'focusFirstDescendant',
    value: function focusFirstDescendant(element) {
      for (var i = 0; i < element.childNodes.length; i++) {
        var child = element.childNodes[i];
        if (this.attemptFocus(child) || this.focusFirstDescendant(child)) {
          return true;
        }
      }
      return false;
    }

    /**
     * @desc Find the last descendant node that is focusable.
     * @param element
     *          DOM node for which to find the last focusable descendant.
     * @returns
     *  true if a focusable element is found and focus is set.
     */

  }, {
    key: 'focusLastDescendant',
    value: function focusLastDescendant(element) {
      for (var i = element.childNodes.length - 1; i >= 0; i--) {
        var child = element.childNodes[i];
        if (this.attemptFocus(child) || this.focusLastDescendant(child)) {
          return true;
        }
      }
      return false;
    }

    /**
     * @desc Set Attempt to set focus on the current node.
     * @param element
     *          The node to attempt to focus on.
     * @returns
     *  true if element is focused.
     */

  }, {
    key: 'attemptFocus',
    value: function attemptFocus(element) {
      if (!this.isFocusable(element)) {
        return false;
      }

      this.IgnoreUtilFocusChanges = true;
      try {
        element.focus();
      } catch (e) {}
      this.IgnoreUtilFocusChanges = false;
      console.log('focused', element);
      return document.activeElement === element;
    }
  }, {
    key: 'isFocusable',
    value: function isFocusable(element) {
      if (element.tabIndex > 0 || element.tabIndex === 0 && element.getAttribute('tabIndex') !== null) {
        return true;
      }

      if (element.disabled) {
        return false;
      }

      switch (element.nodeName) {
        case 'A':
          return !!element.href && element.rel != 'ignore';
        case 'INPUT':
          return element.type != 'hidden' && element.type != 'file';
        case 'BUTTON':
        case 'SELECT':
        case 'TEXTAREA':
          return true;
        default:
          return false;
      }
    }
  }]);

  return Modal;
}();

module.exports = Modal;

},{}],74:[function(require,module,exports){
'use strict';

var _CLICK;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var behavior = require('../utils/behavior');
var forEach = require('array-foreach');
var select = require('../utils/select');
var accordion = require('./accordion');

var CLICK = require('../events').CLICK;
var PREFIX = require('../config').prefix;

var NAV = '.nav';
var NAV_LINKS = NAV + ' a';
var OPENERS = '.js-menu-open';
var CLOSE_BUTTON = '.js-menu-close';
var OVERLAY = '.overlay';
var CLOSERS = CLOSE_BUTTON + ', .overlay';
var TOGGLES = [NAV, OVERLAY].join(', ');

var ACTIVE_CLASS = 'mobile_nav-active';
var VISIBLE_CLASS = 'is-visible';

var isActive = function isActive() {
  return document.body.classList.contains(ACTIVE_CLASS);
};

var _focusTrap = function _focusTrap(trapContainer) {
  // Find all focusable children
  var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  var focusableElements = trapContainer.querySelectorAll(focusableElementsString);
  var firstTabStop = focusableElements[0];
  var lastTabStop = focusableElements[focusableElements.length - 1];

  function trapTabKey(e) {
    // Check for TAB key press
    if (e.keyCode === 9) {

      // SHIFT + TAB
      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }

        // TAB
      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    }

    // ESCAPE
    if (e.keyCode === 27) {
      toggleNav.call(this, false);
    }
  }

  // Focus first child
  firstTabStop.focus();

  return {
    enable: function enable() {
      // Listen for and trap the keyboard
      trapContainer.addEventListener('keydown', trapTabKey);
    },
    release: function release() {
      trapContainer.removeEventListener('keydown', trapTabKey);
    }
  };
};

var focusTrap = void 0;

var toggleNav = function toggleNav(active) {
  var body = document.body;
  if (typeof active !== 'boolean') {
    active = !isActive();
  }
  body.classList.toggle(ACTIVE_CLASS, active);

  forEach(select(TOGGLES), function (el) {
    el.classList.toggle(VISIBLE_CLASS, active);
  });

  if (active) {
    focusTrap.enable();
  } else {
    focusTrap.release();
  }

  var closeButton = body.querySelector(CLOSE_BUTTON);
  var menuButton = body.querySelector(OPENERS);

  if (active && closeButton) {
    // The mobile nav was just activated, so focus on the close button,
    // which is just before all the nav elements in the tab order.
    closeButton.focus();
  } else if (!active && document.activeElement === closeButton && menuButton) {
    // The mobile nav was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the menu button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the mobile nav by mistake).
    menuButton.focus();
  }

  return active;
};

var resize = function resize() {
  var closer = document.body.querySelector(CLOSE_BUTTON);

  if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
    // The mobile nav is active, but the close box isn't visible, which
    // means the user's viewport has been resized so that it is no longer
    // in mobile mode. Let's make the page state consistent by
    // deactivating the mobile nav.
    toggleNav.call(closer, false);
  }
};

var navigation = behavior(_defineProperty({}, CLICK, (_CLICK = {}, _defineProperty(_CLICK, OPENERS, toggleNav), _defineProperty(_CLICK, CLOSERS, toggleNav), _defineProperty(_CLICK, NAV_LINKS, function () {
  // A navigation link has been clicked! We want to collapse any
  // hierarchical navigation UI it's a part of, so that the user
  // can focus on whatever they've just selected.

  // Some navigation links are inside accordions; when they're
  // clicked, we want to collapse those accordions.
  var acc = this.closest(accordion.ACCORDION);
  if (acc) {
    accordion.getButtons(acc).forEach(function (btn) {
      return accordion.hide(btn);
    });
  }

  // If the mobile navigation menu is active, we want to hide it.
  if (isActive()) {
    toggleNav.call(this, false);
  }
}), _CLICK)), {
  init: function init() {
    var trapContainer = document.querySelector(NAV);

    if (trapContainer) {
      focusTrap = _focusTrap(trapContainer);
    }

    resize();
    window.addEventListener('resize', resize, false);
  },
  teardown: function teardown() {
    window.removeEventListener('resize', resize, false);
  }
});

/**
 * TODO for 2.0, remove this statement and export `navigation` directly:
 *
 * module.exports = behavior({...});
 */
var assign = require('object-assign');
module.exports = assign(function (el) {
  return navigation.on(el);
}, navigation);

},{"../config":80,"../events":82,"../utils/behavior":85,"../utils/select":88,"./accordion":68,"array-foreach":1,"object-assign":62}],75:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RadioToggleGroup = function () {
    function RadioToggleGroup(el) {
        _classCallCheck(this, RadioToggleGroup);

        this.jsToggleTrigger = '.js-radio-toggle-group';
        this.jsToggleTarget = 'data-js-target';
        this.eventClose = new Event('fds.collapse.close');
        this.eventOpen = new Event('fds.collapse.open');
        this.radioEls = null;
        this.targetEl = null;

        this.init(el);
    }

    _createClass(RadioToggleGroup, [{
        key: 'init',
        value: function init(el) {
            this.radioGroup = el;
            this.radioEls = this.radioGroup.querySelectorAll('input[type="radio"]');
            var that = this;

            for (var i = 0; i < this.radioEls.length; i++) {
                var radio = this.radioEls[i];
                radio.addEventListener('change', function () {
                    for (var a = 0; a < that.radioEls.length; a++) {
                        that.toggle(that.radioEls[a]);
                    }
                });

                this.toggle(radio); //Initial value;
            }
        }
    }, {
        key: 'toggle',
        value: function toggle(triggerEl) {
            var targetAttr = triggerEl.getAttribute(this.jsToggleTarget);
            if (targetAttr !== null && targetAttr !== undefined) {
                var targetEl = document.querySelector(targetAttr);
                if (targetEl !== null && targetEl !== undefined) {
                    if (triggerEl.checked) {
                        this.open(triggerEl, targetEl);
                    } else {
                        this.close(triggerEl, targetEl);
                    }
                }
            }
        }
    }, {
        key: 'open',
        value: function open(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute('aria-expanded', 'true');
                targetEl.classList.remove('collapsed');
                targetEl.setAttribute('aria-hidden', 'false');
                triggerEl.dispatchEvent(this.eventOpen);
            }
        }
    }, {
        key: 'close',
        value: function close(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute('aria-expanded', 'false');
                targetEl.classList.add('collapsed');
                targetEl.setAttribute('aria-hidden', 'true');
                triggerEl.dispatchEvent(this.eventClose);
            }
        }
    }]);

    return RadioToggleGroup;
}();

module.exports = RadioToggleGroup;

},{}],76:[function(require,module,exports){
/*
* Prevents the user from inputting based on a regex.
* Does not work the same way af <input pattern="">, this pattern is only used for validation, not to prevent input.
* Usecase: number input for date-component.
* Example - number only: <input type="text" data-input-regex="^\d*$">
*/
'use strict';

var behavior = require('../utils/behavior');

var modifierState = {
  shift: false,
  alt: false,
  ctrl: false,
  command: false
};

function inputRegexMask(event) {
  if (modifierState.ctrl || modifierState.command) {
    return;
  }
  var newChar = null;
  if (typeof event.key !== 'undefined') {
    if (event.key.length === 1) {
      newChar = event.key;
    }
  } else {
    if (!event.charCode) {
      newChar = String.fromCharCode(event.keyCode);
    } else {
      newChar = String.fromCharCode(event.charCode);
    }
  }

  var regexStr = this.getAttribute('data-input-regex');

  if (event.type !== undefined && event.type === 'paste') {
    console.log('paste');
  } else {
    var element = null;
    if (event.target !== undefined) {
      element = event.target;
    }
    if (newChar !== null && element !== null) {
      if (newChar.length > 0) {
        var newValue = this.value;
        if (element.type === 'number') {
          newValue = this.value; //Note input[type=number] does not have .selectionStart/End (Chrome).
        } else {
          newValue = this.value.slice(0, element.selectionStart) + this.value.slice(element.selectionEnd) + newChar; //removes the numbers selected by the user, then adds new char.
        }

        var r = new RegExp(regexStr);
        if (r.exec(newValue) === null) {
          if (event.preventDefault) {
            event.preventDefault();
          } else {
            event.returnValue = false;
          }
        }
      }
    }
  }
}

module.exports = behavior({
  'keypress paste': {
    'input[data-input-regex]:focus': inputRegexMask
  }
});

},{"../utils/behavior":85}],77:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var behavior = require('../utils/behavior');
var once = require('receptor/once');

var CLICK = require('../events').CLICK;
var PREFIX = require('../config').prefix;
var LINK = '.' + PREFIX + 'skipnav[href^="#"]';

var setTabindex = function setTabindex(event) {
  // NB: we know because of the selector we're delegating to below that the
  // href already begins with '#'
  var id = this.getAttribute('href').slice(1);
  var target = document.getElementById(id);
  if (target) {
    target.setAttribute('tabindex', 0);
    target.addEventListener('blur', once(function (event) {
      target.setAttribute('tabindex', -1);
    }));
  } else {
    // throw an error?
  }
};

module.exports = behavior(_defineProperty({}, CLICK, _defineProperty({}, LINK, setTabindex)));

},{"../config":80,"../events":82,"../utils/behavior":85,"receptor/once":67}],78:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var select = require('../utils/select');

var ResponsiveTable = function () {
  function ResponsiveTable(table) {
    _classCallCheck(this, ResponsiveTable);

    this.insertHeaderAsAttributes(table);
  }

  // Add data attributes needed for responsive mode.


  _createClass(ResponsiveTable, [{
    key: 'insertHeaderAsAttributes',
    value: function insertHeaderAsAttributes(tableEl) {
      if (!tableEl) return;

      var header = tableEl.getElementsByTagName('thead');
      if (header.length !== 0) {
        var headerCellEls = header[0].getElementsByTagName('th');
        if (headerCellEls.length == 0) {
          headerCellEls = header[0].getElementsByTagName('td');
        }

        if (headerCellEls.length) {
          var bodyRowEls = select('tbody tr', tableEl);
          Array.from(bodyRowEls).forEach(function (rowEl) {
            var cellEls = rowEl.children;
            if (cellEls.length === headerCellEls.length) {
              Array.from(headerCellEls).forEach(function (headerCellEl, i) {
                // Grab header cell text and use it body cell data title.
                cellEls[i].setAttribute('data-title', headerCellEl.textContent);
              });
            }
          });
        }
      }
    }
  }]);

  return ResponsiveTable;
}();

module.exports = ResponsiveTable;

},{"../utils/select":88}],79:[function(require,module,exports){
'use strict';

var domready = require('domready');
var select = require('../utils/select');
//Import tippy.js (https://atomiks.github.io/tippyjs/)
var tippy = require('../../vendor/tippyjs/tippy.js');

var initTippy = function initTippy() {
    //init tooltip on elements with the .js-tooltip class
    tippy('.js-tooltip', {
        duration: 0,
        arrow: true
    });
};

domready(function () {
    initTippy();
});

},{"../../vendor/tippyjs/tippy.js":90,"../utils/select":88,"domready":60}],80:[function(require,module,exports){
'use strict';

module.exports = {
  prefix: ''
};

},{}],81:[function(require,module,exports){
'use strict';

var domready = require('domready');
var Collapse = require('./components/collapse');
var RadioToggleGroup = require('./components/radio-toggle-content');
var CheckboxToggleContent = require('./components/checkbox-toggle-content');
var Dropdown = require('./components/dropdown');
var Accordion = require('./components/accordion');
var Modal = require('./components/modal');
var ResponsiveTable = require('./components/table');
var tooltip = require('./components/tooltip');

/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require('./polyfills');

var dkfds = require('./config');

var components = require('./components');
dkfds.components = components;

domready(function () {
  var target = document.body;
  for (var name in components) {
    var behavior = components[name];
    behavior.on(target);
  }
  var jsSelectorModalBody = document.querySelectorAll('*[data-toggle=modal]');
  for (var c = 0; c < jsSelectorModalBody.length; c++) {
    new Modal(jsSelectorModalBody[c]);
  }

  var jsSelectorAccordion = document.getElementsByClassName('accordion');
  for (var _c = 0; _c < jsSelectorAccordion.length; _c++) {
    new Accordion(jsSelectorAccordion[_c]);
  }
  var jsSelectorAccordionBordered = document.querySelectorAll('.accordion-bordered:not(.accordion)');
  for (var _c2 = 0; _c2 < jsSelectorAccordionBordered.length; _c2++) {
    new Accordion(jsSelectorAccordionBordered[_c2]);
  }

  var jsSelectorTable = document.querySelectorAll('table:not(.dataTable)');
  for (var _c3 = 0; _c3 < jsSelectorTable.length; _c3++) {
    new ResponsiveTable(jsSelectorTable[_c3]);
  }

  var jsSelectorCollapse = document.getElementsByClassName('js-collapse');
  for (var _c4 = 0; _c4 < jsSelectorCollapse.length; _c4++) {
    new Collapse(jsSelectorCollapse[_c4]);
  }

  var jsSelectorRadioCollapse = document.getElementsByClassName('js-radio-toggle-group');
  for (var _c5 = 0; _c5 < jsSelectorRadioCollapse.length; _c5++) {
    new RadioToggleGroup(jsSelectorRadioCollapse[_c5]);
  }

  var jsSelectorCheckboxCollapse = document.getElementsByClassName('js-checkbox-toggle-content');
  for (var _c6 = 0; _c6 < jsSelectorCheckboxCollapse.length; _c6++) {
    new CheckboxToggleContent(jsSelectorCheckboxCollapse[_c6]);
  }
  var jsSelectorDropdown = document.getElementsByClassName('js-dropdown');
  for (var _c7 = 0; _c7 < jsSelectorDropdown.length; _c7++) {
    new Dropdown(jsSelectorDropdown[_c7]);
  }
});

module.exports = { Collapse: Collapse, RadioToggleGroup: RadioToggleGroup, CheckboxToggleContent: CheckboxToggleContent, Dropdown: Dropdown, ResponsiveTable: ResponsiveTable, Accordion: Accordion };

},{"./components":72,"./components/accordion":68,"./components/checkbox-toggle-content":69,"./components/collapse":70,"./components/dropdown":71,"./components/modal":73,"./components/radio-toggle-content":75,"./components/table":78,"./components/tooltip":79,"./config":80,"./polyfills":84,"domready":60}],82:[function(require,module,exports){
'use strict';

module.exports = {
  // This used to be conditionally dependent on whether the
  // browser supported touch events; if it did, `CLICK` was set to
  // `touchstart`.  However, this had downsides:
  //
  // * It pre-empted mobile browsers' default behavior of detecting
  //   whether a touch turned into a scroll, thereby preventing
  //   users from using some of our components as scroll surfaces.
  //
  // * Some devices, such as the Microsoft Surface Pro, support *both*
  //   touch and clicks. This meant the conditional effectively dropped
  //   support for the user's mouse, frustrating users who preferred
  //   it on those systems.
  CLICK: 'click'
};

},{}],83:[function(require,module,exports){
'use strict';

var elproto = window.HTMLElement.prototype;
var HIDDEN = 'hidden';

if (!(HIDDEN in elproto)) {
  Object.defineProperty(elproto, HIDDEN, {
    get: function get() {
      return this.hasAttribute(HIDDEN);
    },
    set: function set(value) {
      if (value) {
        this.setAttribute(HIDDEN, '');
      } else {
        this.removeAttribute(HIDDEN);
      }
    }
  });
}

},{}],84:[function(require,module,exports){
'use strict';
// polyfills HTMLElement.prototype.classList and DOMTokenList

require('classlist-polyfill');
// polyfills HTMLElement.prototype.hidden
require('./element-hidden');

require('core-js/fn/object/assign');
require('core-js/fn/array/from');

},{"./element-hidden":83,"classlist-polyfill":2,"core-js/fn/array/from":3,"core-js/fn/object/assign":4}],85:[function(require,module,exports){
'use strict';

var assign = require('object-assign');
var forEach = require('array-foreach');
var Behavior = require('receptor/behavior');

var sequence = function sequence() {
  var seq = [].slice.call(arguments);
  return function (target) {
    var _this = this;

    if (!target) {
      target = document.body;
    }
    forEach(seq, function (method) {
      if (typeof _this[method] === 'function') {
        _this[method].call(_this, target);
      }
    });
  };
};

/**
 * @name behavior
 * @param {object} events
 * @param {object?} props
 * @return {receptor.behavior}
 */
module.exports = function (events, props) {
  return Behavior(events, assign({
    on: sequence('init', 'add'),
    off: sequence('teardown', 'remove')
  }, props));
};

},{"array-foreach":1,"object-assign":62,"receptor/behavior":63}],86:[function(require,module,exports){
'use strict';

/**
 * @name closest
 * @desc get nearest parent element matching selector.
 * @param {HTMLElement} el - The HTML element where the search starts.
 * @param {string} selector - Selector to be found.
 * @return {HTMLElement} - Nearest parent element matching selector.
 */

module.exports = function closest(el, selector) {
  var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

  while (el) {
    if (matchesSelector.call(el, selector)) {
      break;
    }
    el = el.parentElement;
  }
  return el;
};

},{}],87:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;

  var rect = el.getBoundingClientRect();

  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}

module.exports = isElementInViewport;

},{}],88:[function(require,module,exports){
'use strict';

/**
 * @name isElement
 * @desc returns whether or not the given argument is a DOM element.
 * @param {any} value
 * @return {boolean}
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isElement = function isElement(value) {
  return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.nodeType === 1;
};

/**
 * @name select
 * @desc selects elements from the DOM by class selector or ID selector.
 * @param {string} selector - The selector to traverse the DOM with.
 * @param {Document|HTMLElement?} context - The context to traverse the DOM
 *   in. If not provided, it defaults to the document.
 * @return {HTMLElement[]} - An array of DOM nodes or an empty array.
 */
module.exports = function select(selector, context) {

  if (typeof selector !== 'string') {
    return [];
  }

  if (!context || !isElement(context)) {
    context = window.document;
  }

  var selection = context.querySelectorAll(selector);
  return Array.prototype.slice.call(selection);
};

},{}],89:[function(require,module,exports){
'use strict';

var EXPANDED = 'aria-expanded';
var CONTROLS = 'aria-controls';
var HIDDEN = 'aria-hidden';

module.exports = function (button, expanded) {

  if (typeof expanded !== 'boolean') {
    expanded = button.getAttribute(EXPANDED) === 'false';
  }
  button.setAttribute(EXPANDED, expanded);

  var id = button.getAttribute(CONTROLS);
  var controls = document.getElementById(id);
  if (!controls) {
    throw new Error('No toggle target found with id: "' + id + '"');
  }

  controls.setAttribute(HIDDEN, !expanded);
  return expanded;
};

},{}],90:[function(require,module,exports){
(function (global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
* Tippy.js v2.5.3
* (c) 2017-2018 atomiks
* MIT
*/
(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.tippy = factory();
})(undefined, function () {
  'use strict';

  var version = "2.5.3";

  var isBrowser = typeof window !== 'undefined';

  var isIE = isBrowser && /MSIE |Trident\//.test(navigator.userAgent);

  var browser = {};

  if (isBrowser) {
    browser.supported = 'requestAnimationFrame' in window;
    browser.supportsTouch = 'ontouchstart' in window;
    browser.usingTouch = false;
    browser.dynamicInputDetection = true;
    browser.iOS = /iPhone|iPad|iPod/.test(navigator.platform) && !window.MSStream;
    browser.onUserInputChange = function () {};
  }

  /**
   * Selector constants used for grabbing elements
   */
  var selectors = {
    POPPER: '.tippy-popper',
    TOOLTIP: '.tippy-tooltip',
    CONTENT: '.tippy-content',
    BACKDROP: '.tippy-backdrop',
    ARROW: '.tippy-arrow',
    ROUND_ARROW: '.tippy-roundarrow',
    REFERENCE: '[data-tippy]'
  };

  var defaults = {
    placement: 'top',
    livePlacement: true,
    trigger: 'mouseenter focus',
    animation: 'shift-away',
    html: false,
    animateFill: true,
    arrow: false,
    delay: 0,
    duration: [350, 300],
    interactive: false,
    interactiveBorder: 2,
    theme: 'dark',
    size: 'regular',
    distance: 10,
    offset: 0,
    hideOnClick: true,
    multiple: false,
    followCursor: false,
    inertia: false,
    updateDuration: 350,
    sticky: false,
    appendTo: function appendTo() {
      return document.body;
    },
    zIndex: 9999,
    touchHold: false,
    performance: false,
    dynamicTitle: false,
    flip: true,
    flipBehavior: 'flip',
    arrowType: 'sharp',
    arrowTransform: '',
    maxWidth: '',
    target: null,
    allowTitleHTML: true,
    popperOptions: {},
    createPopperInstanceOnInit: false,
    onShow: function onShow() {},
    onShown: function onShown() {},
    onHide: function onHide() {},
    onHidden: function onHidden() {}
  };

  /**
   * The keys of the defaults object for reducing down into a new object
   * Used in `getIndividualOptions()`
   */
  var defaultsKeys = browser.supported && Object.keys(defaults);

  /**
   * Determines if a value is an object literal
   * @param {*} value
   * @return {Boolean}
   */
  function isObjectLiteral(value) {
    return {}.toString.call(value) === '[object Object]';
  }

  /**
   * Ponyfill for Array.from
   * @param {*} value
   * @return {Array}
   */
  function toArray(value) {
    return [].slice.call(value);
  }

  /**
   * Returns an array of elements based on the selector input
   * @param {String|Element|Element[]|NodeList|Object} selector
   * @return {Element[]}
   */
  function getArrayOfElements(selector) {
    if (selector instanceof Element || isObjectLiteral(selector)) {
      return [selector];
    }

    if (selector instanceof NodeList) {
      return toArray(selector);
    }

    if (Array.isArray(selector)) {
      return selector;
    }

    try {
      return toArray(document.querySelectorAll(selector));
    } catch (_) {
      return [];
    }
  }

  /**
   * Polyfills needed props/methods for a virtual reference object
   * NOTE: in v3.0 this will be pure
   * @param {Object} reference
   */
  function polyfillVirtualReferenceProps(reference) {
    reference.refObj = true;
    reference.attributes = reference.attributes || {};
    reference.setAttribute = function (key, val) {
      reference.attributes[key] = val;
    };
    reference.getAttribute = function (key) {
      return reference.attributes[key];
    };
    reference.removeAttribute = function (key) {
      delete reference.attributes[key];
    };
    reference.hasAttribute = function (key) {
      return key in reference.attributes;
    };
    reference.addEventListener = function () {};
    reference.removeEventListener = function () {};
    reference.classList = {
      classNames: {},
      add: function add(key) {
        return reference.classList.classNames[key] = true;
      },
      remove: function remove(key) {
        delete reference.classList.classNames[key];
        return true;
      },
      contains: function contains(key) {
        return key in reference.classList.classNames;
      }
    };
  }

  /**
   * Returns the supported prefixed property - only `webkit` is needed, `moz`, `ms` and `o` are obsolete
   * @param {String} property
   * @return {String} - browser supported prefixed property
   */
  function prefix(property) {
    var prefixes = ['', 'webkit'];
    var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

    for (var i = 0; i < prefixes.length; i++) {
      var _prefix = prefixes[i];
      var prefixedProp = _prefix ? _prefix + upperProp : property;
      if (typeof document.body.style[prefixedProp] !== 'undefined') {
        return prefixedProp;
      }
    }

    return null;
  }

  /**
   * Creates a div element
   * @return {Element}
   */
  function div() {
    return document.createElement('div');
  }

  /**
   * Creates a popper element then returns it
   * @param {Number} id - the popper id
   * @param {String} title - the tooltip's `title` attribute
   * @param {Object} options - individual options
   * @return {Element} - the popper element
   */
  function createPopperElement(id, title, options) {
    var popper = div();
    popper.setAttribute('class', 'tippy-popper');
    popper.setAttribute('role', 'tooltip');
    popper.setAttribute('id', 'tippy-' + id);
    popper.style.zIndex = options.zIndex;
    popper.style.maxWidth = options.maxWidth;

    var tooltip = div();
    tooltip.setAttribute('class', 'tippy-tooltip');
    tooltip.setAttribute('data-size', options.size);
    tooltip.setAttribute('data-animation', options.animation);
    tooltip.setAttribute('data-state', 'hidden');
    options.theme.split(' ').forEach(function (t) {
      tooltip.classList.add(t + '-theme');
    });

    var content = div();
    content.setAttribute('class', 'tippy-content');

    if (options.arrow) {
      var arrow = div();
      arrow.style[prefix('transform')] = options.arrowTransform;

      if (options.arrowType === 'round') {
        arrow.classList.add('tippy-roundarrow');
        arrow.innerHTML = '<svg viewBox="0 0 24 8" xmlns="http://www.w3.org/2000/svg"><path d="M3 8s2.021-.015 5.253-4.218C9.584 2.051 10.797 1.007 12 1c1.203-.007 2.416 1.035 3.761 2.782C19.012 8.005 21 8 21 8H3z"/></svg>';
      } else {
        arrow.classList.add('tippy-arrow');
      }

      tooltip.appendChild(arrow);
    }

    if (options.animateFill) {
      // Create animateFill circle element for animation
      tooltip.setAttribute('data-animatefill', '');
      var backdrop = div();
      backdrop.classList.add('tippy-backdrop');
      backdrop.setAttribute('data-state', 'hidden');
      tooltip.appendChild(backdrop);
    }

    if (options.inertia) {
      // Change transition timing function cubic bezier
      tooltip.setAttribute('data-inertia', '');
    }

    if (options.interactive) {
      tooltip.setAttribute('data-interactive', '');
    }

    var html = options.html;
    if (html) {
      var templateId = void 0;

      if (html instanceof Element) {
        content.appendChild(html);
        templateId = '#' + (html.id || 'tippy-html-template');
      } else {
        // trick linters: https://github.com/atomiks/tippyjs/issues/197
        content[true && 'innerHTML'] = document.querySelector(html)[true && 'innerHTML'];
        templateId = html;
      }

      popper.setAttribute('data-html', '');
      tooltip.setAttribute('data-template-id', templateId);

      if (options.interactive) {
        popper.setAttribute('tabindex', '-1');
      }
    } else {
      content[options.allowTitleHTML ? 'innerHTML' : 'textContent'] = title;
    }

    tooltip.appendChild(content);
    popper.appendChild(tooltip);

    return popper;
  }

  /**
   * Creates a trigger by adding the necessary event listeners to the reference element
   * @param {String} eventType - the custom event specified in the `trigger` setting
   * @param {Element} reference
   * @param {Object} handlers - the handlers for each event
   * @param {Object} options
   * @return {Array} - array of listener objects
   */
  function createTrigger(eventType, reference, handlers, options) {
    var onTrigger = handlers.onTrigger,
        onMouseLeave = handlers.onMouseLeave,
        onBlur = handlers.onBlur,
        onDelegateShow = handlers.onDelegateShow,
        onDelegateHide = handlers.onDelegateHide;

    var listeners = [];

    if (eventType === 'manual') return listeners;

    var on = function on(eventType, handler) {
      reference.addEventListener(eventType, handler);
      listeners.push({ event: eventType, handler: handler });
    };

    if (!options.target) {
      on(eventType, onTrigger);

      if (browser.supportsTouch && options.touchHold) {
        on('touchstart', onTrigger);
        on('touchend', onMouseLeave);
      }
      if (eventType === 'mouseenter') {
        on('mouseleave', onMouseLeave);
      }
      if (eventType === 'focus') {
        on(isIE ? 'focusout' : 'blur', onBlur);
      }
    } else {
      if (browser.supportsTouch && options.touchHold) {
        on('touchstart', onDelegateShow);
        on('touchend', onDelegateHide);
      }
      if (eventType === 'mouseenter') {
        on('mouseover', onDelegateShow);
        on('mouseout', onDelegateHide);
      }
      if (eventType === 'focus') {
        on('focusin', onDelegateShow);
        on('focusout', onDelegateHide);
      }
      if (eventType === 'click') {
        on('click', onDelegateShow);
      }
    }

    return listeners;
  }

  var classCallCheck = function classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  /**
   * Returns an object of settings to override global settings
   * @param {Element} reference
   * @param {Object} instanceOptions
   * @return {Object} - individual options
   */
  function getIndividualOptions(reference, instanceOptions) {
    var options = defaultsKeys.reduce(function (acc, key) {
      var val = reference.getAttribute('data-tippy-' + key.toLowerCase()) || instanceOptions[key];

      // Convert strings to booleans
      if (val === 'false') val = false;
      if (val === 'true') val = true;

      // Convert number strings to true numbers
      if (isFinite(val) && !isNaN(parseFloat(val))) {
        val = parseFloat(val);
      }

      // Convert array strings to actual arrays
      if (key !== 'target' && typeof val === 'string' && val.trim().charAt(0) === '[') {
        val = JSON.parse(val);
      }

      acc[key] = val;

      return acc;
    }, {});

    return _extends({}, instanceOptions, options);
  }

  /**
   * Evaluates/modifies the options object for appropriate behavior
   * @param {Element|Object} reference
   * @param {Object} options
   * @return {Object} modified/evaluated options
   */
  function evaluateOptions(reference, options) {
    // animateFill is disabled if an arrow is true
    if (options.arrow) {
      options.animateFill = false;
    }

    if (options.appendTo && typeof options.appendTo === 'function') {
      options.appendTo = options.appendTo();
    }

    if (typeof options.html === 'function') {
      options.html = options.html(reference);
    }

    return options;
  }

  /**
   * Returns inner elements of the popper element
   * @param {Element} popper
   * @return {Object}
   */
  function getInnerElements(popper) {
    var select = function select(s) {
      return popper.querySelector(s);
    };
    return {
      tooltip: select(selectors.TOOLTIP),
      backdrop: select(selectors.BACKDROP),
      content: select(selectors.CONTENT),
      arrow: select(selectors.ARROW) || select(selectors.ROUND_ARROW)
    };
  }

  /**
   * Removes the title from an element, setting `data-original-title`
   * appropriately
   * @param {Element} el
   */
  function removeTitle(el) {
    var title = el.getAttribute('title');
    // Only set `data-original-title` attr if there is a title
    if (title) {
      el.setAttribute('data-original-title', title);
    }
    el.removeAttribute('title');
  }

  /**!
   * @fileOverview Kickass library to create and place poppers near their reference elements.
   * @version 1.14.3
   * @license
   * Copyright (c) 2016 Federico Zivolo and contributors
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */
  var isBrowser$1 = typeof window !== 'undefined' && typeof document !== 'undefined';

  var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
  var timeoutDuration = 0;
  for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
    if (isBrowser$1 && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
      timeoutDuration = 1;
      break;
    }
  }

  function microtaskDebounce(fn) {
    var called = false;
    return function () {
      if (called) {
        return;
      }
      called = true;
      window.Promise.resolve().then(function () {
        called = false;
        fn();
      });
    };
  }

  function taskDebounce(fn) {
    var scheduled = false;
    return function () {
      if (!scheduled) {
        scheduled = true;
        setTimeout(function () {
          scheduled = false;
          fn();
        }, timeoutDuration);
      }
    };
  }

  var supportsMicroTasks = isBrowser$1 && window.Promise;

  /**
  * Create a debounced version of a method, that's asynchronously deferred
  * but called in the minimum time possible.
  *
  * @method
  * @memberof Popper.Utils
  * @argument {Function} fn
  * @returns {Function}
  */
  var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

  /**
   * Check if the given variable is a function
   * @method
   * @memberof Popper.Utils
   * @argument {Any} functionToCheck - variable to check
   * @returns {Boolean} answer to: is a function?
   */
  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  /**
   * Get CSS computed property of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Eement} element
   * @argument {String} property
   */
  function getStyleComputedProperty(element, property) {
    if (element.nodeType !== 1) {
      return [];
    }
    // NOTE: 1 DOM access here
    var css = getComputedStyle(element, null);
    return property ? css[property] : css;
  }

  /**
   * Returns the parentNode or the host of the element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} parent
   */
  function getParentNode(element) {
    if (element.nodeName === 'HTML') {
      return element;
    }
    return element.parentNode || element.host;
  }

  /**
   * Returns the scrolling parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} scroll parent
   */
  function getScrollParent(element) {
    // Return body, `getScroll` will take care to get the correct `scrollTop` from it
    if (!element) {
      return document.body;
    }

    switch (element.nodeName) {
      case 'HTML':
      case 'BODY':
        return element.ownerDocument.body;
      case '#document':
        return element.body;
    }

    // Firefox want us to check `-x` and `-y` variations as well

    var _getStyleComputedProp = getStyleComputedProperty(element),
        overflow = _getStyleComputedProp.overflow,
        overflowX = _getStyleComputedProp.overflowX,
        overflowY = _getStyleComputedProp.overflowY;

    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
      return element;
    }

    return getScrollParent(getParentNode(element));
  }

  var isIE11 = isBrowser$1 && !!(window.MSInputMethodContext && document.documentMode);
  var isIE10 = isBrowser$1 && /MSIE 10/.test(navigator.userAgent);

  /**
   * Determines if the browser is Internet Explorer
   * @method
   * @memberof Popper.Utils
   * @param {Number} version to check
   * @returns {Boolean} isIE
   */
  function isIE$1(version) {
    if (version === 11) {
      return isIE11;
    }
    if (version === 10) {
      return isIE10;
    }
    return isIE11 || isIE10;
  }

  /**
   * Returns the offset parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} offset parent
   */
  function getOffsetParent(element) {
    if (!element) {
      return document.documentElement;
    }

    var noOffsetParent = isIE$1(10) ? document.body : null;

    // NOTE: 1 DOM access here
    var offsetParent = element.offsetParent;
    // Skip hidden elements which don't have an offsetParent
    while (offsetParent === noOffsetParent && element.nextElementSibling) {
      offsetParent = (element = element.nextElementSibling).offsetParent;
    }

    var nodeName = offsetParent && offsetParent.nodeName;

    if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
      return element ? element.ownerDocument.documentElement : document.documentElement;
    }

    // .offsetParent will return the closest TD or TABLE in case
    // no offsetParent is present, I hate this job...
    if (['TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
      return getOffsetParent(offsetParent);
    }

    return offsetParent;
  }

  function isOffsetContainer(element) {
    var nodeName = element.nodeName;

    if (nodeName === 'BODY') {
      return false;
    }
    return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
  }

  /**
   * Finds the root node (document, shadowDOM root) of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} node
   * @returns {Element} root node
   */
  function getRoot(node) {
    if (node.parentNode !== null) {
      return getRoot(node.parentNode);
    }

    return node;
  }

  /**
   * Finds the offset parent common to the two provided nodes
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element1
   * @argument {Element} element2
   * @returns {Element} common offset parent
   */
  function findCommonOffsetParent(element1, element2) {
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
    if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
      return document.documentElement;
    }

    // Here we make sure to give as "start" the element that comes first in the DOM
    var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
    var start = order ? element1 : element2;
    var end = order ? element2 : element1;

    // Get common ancestor container
    var range = document.createRange();
    range.setStart(start, 0);
    range.setEnd(end, 0);
    var commonAncestorContainer = range.commonAncestorContainer;

    // Both nodes are inside #document

    if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
      if (isOffsetContainer(commonAncestorContainer)) {
        return commonAncestorContainer;
      }

      return getOffsetParent(commonAncestorContainer);
    }

    // one of the nodes is inside shadowDOM, find which one
    var element1root = getRoot(element1);
    if (element1root.host) {
      return findCommonOffsetParent(element1root.host, element2);
    } else {
      return findCommonOffsetParent(element1, getRoot(element2).host);
    }
  }

  /**
   * Gets the scroll value of the given element in the given side (top and left)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {String} side `top` or `left`
   * @returns {number} amount of scrolled pixels
   */
  function getScroll(element) {
    var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

    var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
    var nodeName = element.nodeName;

    if (nodeName === 'BODY' || nodeName === 'HTML') {
      var html = element.ownerDocument.documentElement;
      var scrollingElement = element.ownerDocument.scrollingElement || html;
      return scrollingElement[upperSide];
    }

    return element[upperSide];
  }

  /*
   * Sum or subtract the element scroll values (left and top) from a given rect object
   * @method
   * @memberof Popper.Utils
   * @param {Object} rect - Rect object you want to change
   * @param {HTMLElement} element - The element from the function reads the scroll values
   * @param {Boolean} subtract - set to true if you want to subtract the scroll values
   * @return {Object} rect - The modifier rect object
   */
  function includeScroll(rect, element) {
    var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var scrollTop = getScroll(element, 'top');
    var scrollLeft = getScroll(element, 'left');
    var modifier = subtract ? -1 : 1;
    rect.top += scrollTop * modifier;
    rect.bottom += scrollTop * modifier;
    rect.left += scrollLeft * modifier;
    rect.right += scrollLeft * modifier;
    return rect;
  }

  /*
   * Helper to detect borders of a given element
   * @method
   * @memberof Popper.Utils
   * @param {CSSStyleDeclaration} styles
   * Result of `getStyleComputedProperty` on the given element
   * @param {String} axis - `x` or `y`
   * @return {number} borders - The borders size of the given axis
   */

  function getBordersSize(styles, axis) {
    var sideA = axis === 'x' ? 'Left' : 'Top';
    var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

    return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
  }

  function getSize(axis, body, html, computedStyle) {
    return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE$1(10) ? html['offset' + axis] + computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')] + computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')] : 0);
  }

  function getWindowSizes() {
    var body = document.body;
    var html = document.documentElement;
    var computedStyle = isIE$1(10) && getComputedStyle(html);

    return {
      height: getSize('Height', body, html, computedStyle),
      width: getSize('Width', body, html, computedStyle)
    };
  }

  var classCallCheck$1 = function classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass$1 = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var defineProperty$1 = function defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var _extends$1 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  /**
   * Given element offsets, generate an output similar to getBoundingClientRect
   * @method
   * @memberof Popper.Utils
   * @argument {Object} offsets
   * @returns {Object} ClientRect like output
   */
  function getClientRect(offsets) {
    return _extends$1({}, offsets, {
      right: offsets.left + offsets.width,
      bottom: offsets.top + offsets.height
    });
  }

  /**
   * Get bounding client rect of given element
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} element
   * @return {Object} client rect
   */
  function getBoundingClientRect(element) {
    var rect = {};

    // IE10 10 FIX: Please, don't ask, the element isn't
    // considered in DOM in some circumstances...
    // This isn't reproducible in IE10 compatibility mode of IE11
    try {
      if (isIE$1(10)) {
        rect = element.getBoundingClientRect();
        var scrollTop = getScroll(element, 'top');
        var scrollLeft = getScroll(element, 'left');
        rect.top += scrollTop;
        rect.left += scrollLeft;
        rect.bottom += scrollTop;
        rect.right += scrollLeft;
      } else {
        rect = element.getBoundingClientRect();
      }
    } catch (e) {}

    var result = {
      left: rect.left,
      top: rect.top,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    };

    // subtract scrollbar size from sizes
    var sizes = element.nodeName === 'HTML' ? getWindowSizes() : {};
    var width = sizes.width || element.clientWidth || result.right - result.left;
    var height = sizes.height || element.clientHeight || result.bottom - result.top;

    var horizScrollbar = element.offsetWidth - width;
    var vertScrollbar = element.offsetHeight - height;

    // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
    // we make this check conditional for performance reasons
    if (horizScrollbar || vertScrollbar) {
      var styles = getStyleComputedProperty(element);
      horizScrollbar -= getBordersSize(styles, 'x');
      vertScrollbar -= getBordersSize(styles, 'y');

      result.width -= horizScrollbar;
      result.height -= vertScrollbar;
    }

    return getClientRect(result);
  }

  function getOffsetRectRelativeToArbitraryNode(children, parent) {
    var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var isIE10 = isIE$1(10);
    var isHTML = parent.nodeName === 'HTML';
    var childrenRect = getBoundingClientRect(children);
    var parentRect = getBoundingClientRect(parent);
    var scrollParent = getScrollParent(children);

    var styles = getStyleComputedProperty(parent);
    var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
    var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10);

    // In cases where the parent is fixed, we must ignore negative scroll in offset calc
    if (fixedPosition && parent.nodeName === 'HTML') {
      parentRect.top = Math.max(parentRect.top, 0);
      parentRect.left = Math.max(parentRect.left, 0);
    }
    var offsets = getClientRect({
      top: childrenRect.top - parentRect.top - borderTopWidth,
      left: childrenRect.left - parentRect.left - borderLeftWidth,
      width: childrenRect.width,
      height: childrenRect.height
    });
    offsets.marginTop = 0;
    offsets.marginLeft = 0;

    // Subtract margins of documentElement in case it's being used as parent
    // we do this only on HTML because it's the only element that behaves
    // differently when margins are applied to it. The margins are included in
    // the box of the documentElement, in the other cases not.
    if (!isIE10 && isHTML) {
      var marginTop = parseFloat(styles.marginTop, 10);
      var marginLeft = parseFloat(styles.marginLeft, 10);

      offsets.top -= borderTopWidth - marginTop;
      offsets.bottom -= borderTopWidth - marginTop;
      offsets.left -= borderLeftWidth - marginLeft;
      offsets.right -= borderLeftWidth - marginLeft;

      // Attach marginTop and marginLeft because in some circumstances we may need them
      offsets.marginTop = marginTop;
      offsets.marginLeft = marginLeft;
    }

    if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
      offsets = includeScroll(offsets, parent);
    }

    return offsets;
  }

  function getViewportOffsetRectRelativeToArtbitraryNode(element) {
    var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var html = element.ownerDocument.documentElement;
    var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
    var width = Math.max(html.clientWidth, window.innerWidth || 0);
    var height = Math.max(html.clientHeight, window.innerHeight || 0);

    var scrollTop = !excludeScroll ? getScroll(html) : 0;
    var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

    var offset = {
      top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
      left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
      width: width,
      height: height
    };

    return getClientRect(offset);
  }

  /**
   * Check if the given element is fixed or is inside a fixed parent
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {Element} customContainer
   * @returns {Boolean} answer to "isFixed?"
   */
  function isFixed(element) {
    var nodeName = element.nodeName;
    if (nodeName === 'BODY' || nodeName === 'HTML') {
      return false;
    }
    if (getStyleComputedProperty(element, 'position') === 'fixed') {
      return true;
    }
    return isFixed(getParentNode(element));
  }

  /**
   * Finds the first parent of an element that has a transformed property defined
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} first transformed parent or documentElement
   */

  function getFixedPositionOffsetParent(element) {
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
    if (!element || !element.parentElement || isIE$1()) {
      return document.documentElement;
    }
    var el = element.parentElement;
    while (el && getStyleComputedProperty(el, 'transform') === 'none') {
      el = el.parentElement;
    }
    return el || document.documentElement;
  }

  /**
   * Computed the boundaries limits and return them
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} popper
   * @param {HTMLElement} reference
   * @param {number} padding
   * @param {HTMLElement} boundariesElement - Element used to define the boundaries
   * @param {Boolean} fixedPosition - Is in fixed position mode
   * @returns {Object} Coordinates of the boundaries
   */
  function getBoundaries(popper, reference, padding, boundariesElement) {
    var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    // NOTE: 1 DOM access here

    var boundaries = { top: 0, left: 0 };
    var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);

    // Handle viewport case
    if (boundariesElement === 'viewport') {
      boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
    } else {
      // Handle other cases based on DOM element used as boundaries
      var boundariesNode = void 0;
      if (boundariesElement === 'scrollParent') {
        boundariesNode = getScrollParent(getParentNode(reference));
        if (boundariesNode.nodeName === 'BODY') {
          boundariesNode = popper.ownerDocument.documentElement;
        }
      } else if (boundariesElement === 'window') {
        boundariesNode = popper.ownerDocument.documentElement;
      } else {
        boundariesNode = boundariesElement;
      }

      var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

      // In case of HTML, we need a different computation
      if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
        var _getWindowSizes = getWindowSizes(),
            height = _getWindowSizes.height,
            width = _getWindowSizes.width;

        boundaries.top += offsets.top - offsets.marginTop;
        boundaries.bottom = height + offsets.top;
        boundaries.left += offsets.left - offsets.marginLeft;
        boundaries.right = width + offsets.left;
      } else {
        // for all the other DOM elements, this one is good
        boundaries = offsets;
      }
    }

    // Add paddings
    boundaries.left += padding;
    boundaries.top += padding;
    boundaries.right -= padding;
    boundaries.bottom -= padding;

    return boundaries;
  }

  function getArea(_ref) {
    var width = _ref.width,
        height = _ref.height;

    return width * height;
  }

  /**
   * Utility used to transform the `auto` placement to the placement with more
   * available space.
   * @method
   * @memberof Popper.Utils
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
    var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

    if (placement.indexOf('auto') === -1) {
      return placement;
    }

    var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

    var rects = {
      top: {
        width: boundaries.width,
        height: refRect.top - boundaries.top
      },
      right: {
        width: boundaries.right - refRect.right,
        height: boundaries.height
      },
      bottom: {
        width: boundaries.width,
        height: boundaries.bottom - refRect.bottom
      },
      left: {
        width: refRect.left - boundaries.left,
        height: boundaries.height
      }
    };

    var sortedAreas = Object.keys(rects).map(function (key) {
      return _extends$1({
        key: key
      }, rects[key], {
        area: getArea(rects[key])
      });
    }).sort(function (a, b) {
      return b.area - a.area;
    });

    var filteredAreas = sortedAreas.filter(function (_ref2) {
      var width = _ref2.width,
          height = _ref2.height;
      return width >= popper.clientWidth && height >= popper.clientHeight;
    });

    var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

    var variation = placement.split('-')[1];

    return computedPlacement + (variation ? '-' + variation : '');
  }

  /**
   * Get offsets to the reference element
   * @method
   * @memberof Popper.Utils
   * @param {Object} state
   * @param {Element} popper - the popper element
   * @param {Element} reference - the reference element (the popper will be relative to this)
   * @param {Element} fixedPosition - is in fixed position mode
   * @returns {Object} An object containing the offsets which will be applied to the popper
   */
  function getReferenceOffsets(state, popper, reference) {
    var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
    return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
  }

  /**
   * Get the outer sizes of the given element (offset size + margins)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Object} object containing width and height properties
   */
  function getOuterSizes(element) {
    var styles = getComputedStyle(element);
    var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
    var result = {
      width: element.offsetWidth + y,
      height: element.offsetHeight + x
    };
    return result;
  }

  /**
   * Get the opposite placement of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement
   * @returns {String} flipped placement
   */
  function getOppositePlacement(placement) {
    var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash[matched];
    });
  }

  /**
   * Get offsets to the popper
   * @method
   * @memberof Popper.Utils
   * @param {Object} position - CSS position the Popper will get applied
   * @param {HTMLElement} popper - the popper element
   * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
   * @param {String} placement - one of the valid placement options
   * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
   */
  function getPopperOffsets(popper, referenceOffsets, placement) {
    placement = placement.split('-')[0];

    // Get popper node sizes
    var popperRect = getOuterSizes(popper);

    // Add position, width and height to our offsets object
    var popperOffsets = {
      width: popperRect.width,
      height: popperRect.height
    };

    // depending by the popper placement we have to compute its offsets slightly differently
    var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
    var mainSide = isHoriz ? 'top' : 'left';
    var secondarySide = isHoriz ? 'left' : 'top';
    var measurement = isHoriz ? 'height' : 'width';
    var secondaryMeasurement = !isHoriz ? 'height' : 'width';

    popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
    if (placement === secondarySide) {
      popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
    } else {
      popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
    }

    return popperOffsets;
  }

  /**
   * Mimics the `find` method of Array
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */
  function find(arr, check) {
    // use native find if supported
    if (Array.prototype.find) {
      return arr.find(check);
    }

    // use `filter` to obtain the same behavior of `find`
    return arr.filter(check)[0];
  }

  /**
   * Return the index of the matching object
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */
  function findIndex(arr, prop, value) {
    // use native findIndex if supported
    if (Array.prototype.findIndex) {
      return arr.findIndex(function (cur) {
        return cur[prop] === value;
      });
    }

    // use `find` + `indexOf` if `findIndex` isn't supported
    var match = find(arr, function (obj) {
      return obj[prop] === value;
    });
    return arr.indexOf(match);
  }

  /**
   * Loop trough the list of modifiers and run them in order,
   * each of them will then edit the data object.
   * @method
   * @memberof Popper.Utils
   * @param {dataObject} data
   * @param {Array} modifiers
   * @param {String} ends - Optional modifier name used as stopper
   * @returns {dataObject}
   */
  function runModifiers(modifiers, data, ends) {
    var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

    modifiersToRun.forEach(function (modifier) {
      if (modifier['function']) {
        // eslint-disable-line dot-notation
        console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
      }
      var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
      if (modifier.enabled && isFunction(fn)) {
        // Add properties to offsets to make them a complete clientRect object
        // we do this before each modifier to make sure the previous one doesn't
        // mess with these values
        data.offsets.popper = getClientRect(data.offsets.popper);
        data.offsets.reference = getClientRect(data.offsets.reference);

        data = fn(data, modifier);
      }
    });

    return data;
  }

  /**
   * Updates the position of the popper, computing the new offsets and applying
   * the new style.<br />
   * Prefer `scheduleUpdate` over `update` because of performance reasons.
   * @method
   * @memberof Popper
   */
  function update() {
    // if popper is destroyed, don't perform any further update
    if (this.state.isDestroyed) {
      return;
    }

    var data = {
      instance: this,
      styles: {},
      arrowStyles: {},
      attributes: {},
      flipped: false,
      offsets: {}
    };

    // compute reference element offsets
    data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

    // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value
    data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

    // store the computed placement inside `originalPlacement`
    data.originalPlacement = data.placement;

    data.positionFixed = this.options.positionFixed;

    // compute the popper offsets
    data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

    data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

    // run the modifiers
    data = runModifiers(this.modifiers, data);

    // the first `update` will call `onCreate` callback
    // the other ones will call `onUpdate` callback
    if (!this.state.isCreated) {
      this.state.isCreated = true;
      this.options.onCreate(data);
    } else {
      this.options.onUpdate(data);
    }
  }

  /**
   * Helper used to know if the given modifier is enabled.
   * @method
   * @memberof Popper.Utils
   * @returns {Boolean}
   */
  function isModifierEnabled(modifiers, modifierName) {
    return modifiers.some(function (_ref) {
      var name = _ref.name,
          enabled = _ref.enabled;
      return enabled && name === modifierName;
    });
  }

  /**
   * Get the prefixed supported property name
   * @method
   * @memberof Popper.Utils
   * @argument {String} property (camelCase)
   * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
   */
  function getSupportedPropertyName(property) {
    var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
    var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

    for (var i = 0; i < prefixes.length; i++) {
      var prefix = prefixes[i];
      var toCheck = prefix ? '' + prefix + upperProp : property;
      if (typeof document.body.style[toCheck] !== 'undefined') {
        return toCheck;
      }
    }
    return null;
  }

  /**
   * Destroy the popper
   * @method
   * @memberof Popper
   */
  function destroy() {
    this.state.isDestroyed = true;

    // touch DOM only if `applyStyle` modifier is enabled
    if (isModifierEnabled(this.modifiers, 'applyStyle')) {
      this.popper.removeAttribute('x-placement');
      this.popper.style.position = '';
      this.popper.style.top = '';
      this.popper.style.left = '';
      this.popper.style.right = '';
      this.popper.style.bottom = '';
      this.popper.style.willChange = '';
      this.popper.style[getSupportedPropertyName('transform')] = '';
    }

    this.disableEventListeners();

    // remove the popper if user explicity asked for the deletion on destroy
    // do not use `remove` because IE11 doesn't support it
    if (this.options.removeOnDestroy) {
      this.popper.parentNode.removeChild(this.popper);
    }
    return this;
  }

  /**
   * Get the window associated with the element
   * @argument {Element} element
   * @returns {Window}
   */
  function getWindow(element) {
    var ownerDocument = element.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView : window;
  }

  function attachToScrollParents(scrollParent, event, callback, scrollParents) {
    var isBody = scrollParent.nodeName === 'BODY';
    var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
    target.addEventListener(event, callback, { passive: true });

    if (!isBody) {
      attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
    }
    scrollParents.push(target);
  }

  /**
   * Setup needed event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */
  function setupEventListeners(reference, options, state, updateBound) {
    // Resize event listener on window
    state.updateBound = updateBound;
    getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

    // Scroll event listener on scroll parents
    var scrollElement = getScrollParent(reference);
    attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
    state.scrollElement = scrollElement;
    state.eventsEnabled = true;

    return state;
  }

  /**
   * It will add resize/scroll events and start recalculating
   * position of the popper element when they are triggered.
   * @method
   * @memberof Popper
   */
  function enableEventListeners() {
    if (!this.state.eventsEnabled) {
      this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
    }
  }

  /**
   * Remove event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */
  function removeEventListeners(reference, state) {
    // Remove resize event listener on window
    getWindow(reference).removeEventListener('resize', state.updateBound);

    // Remove scroll event listener on scroll parents
    state.scrollParents.forEach(function (target) {
      target.removeEventListener('scroll', state.updateBound);
    });

    // Reset state
    state.updateBound = null;
    state.scrollParents = [];
    state.scrollElement = null;
    state.eventsEnabled = false;
    return state;
  }

  /**
   * It will remove resize/scroll events and won't recalculate popper position
   * when they are triggered. It also won't trigger onUpdate callback anymore,
   * unless you call `update` method manually.
   * @method
   * @memberof Popper
   */
  function disableEventListeners() {
    if (this.state.eventsEnabled) {
      cancelAnimationFrame(this.scheduleUpdate);
      this.state = removeEventListeners(this.reference, this.state);
    }
  }

  /**
   * Tells if a given input is a number
   * @method
   * @memberof Popper.Utils
   * @param {*} input to check
   * @return {Boolean}
   */
  function isNumeric(n) {
    return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
  }

  /**
   * Set the style to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the style to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */
  function setStyles(element, styles) {
    Object.keys(styles).forEach(function (prop) {
      var unit = '';
      // add unit if the value is numeric and is one of the following
      if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
        unit = 'px';
      }
      element.style[prop] = styles[prop] + unit;
    });
  }

  /**
   * Set the attributes to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the attributes to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */
  function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(function (prop) {
      var value = attributes[prop];
      if (value !== false) {
        element.setAttribute(prop, attributes[prop]);
      } else {
        element.removeAttribute(prop);
      }
    });
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} data.styles - List of style properties - values to apply to popper element
   * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The same data object
   */
  function applyStyle(data) {
    // any property present in `data.styles` will be applied to the popper,
    // in this way we can make the 3rd party modifiers add custom styles to it
    // Be aware, modifiers could override the properties defined in the previous
    // lines of this modifier!
    setStyles(data.instance.popper, data.styles);

    // any property present in `data.attributes` will be applied to the popper,
    // they will be set as HTML attributes of the element
    setAttributes(data.instance.popper, data.attributes);

    // if arrowElement is defined and arrowStyles has some properties
    if (data.arrowElement && Object.keys(data.arrowStyles).length) {
      setStyles(data.arrowElement, data.arrowStyles);
    }

    return data;
  }

  /**
   * Set the x-placement attribute before everything else because it could be used
   * to add margins to the popper margins needs to be calculated to get the
   * correct popper offsets.
   * @method
   * @memberof Popper.modifiers
   * @param {HTMLElement} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper
   * @param {Object} options - Popper.js options
   */
  function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
    // compute reference element offsets
    var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

    // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value
    var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

    popper.setAttribute('x-placement', placement);

    // Apply `position` to popper before anything else because
    // without the position applied we can't guarantee correct computations
    setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

    return options;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function computeStyle(data, options) {
    var x = options.x,
        y = options.y;
    var popper = data.offsets.popper;

    // Remove this legacy support in Popper.js v2

    var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
      return modifier.name === 'applyStyle';
    }).gpuAcceleration;
    if (legacyGpuAccelerationOption !== undefined) {
      console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
    }
    var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

    var offsetParent = getOffsetParent(data.instance.popper);
    var offsetParentRect = getBoundingClientRect(offsetParent);

    // Styles
    var styles = {
      position: popper.position
    };

    // Avoid blurry text by using full pixel integers.
    // For pixel-perfect positioning, top/bottom prefers rounded
    // values, while left/right prefers floored values.
    var offsets = {
      left: Math.floor(popper.left),
      top: Math.round(popper.top),
      bottom: Math.round(popper.bottom),
      right: Math.floor(popper.right)
    };

    var sideA = x === 'bottom' ? 'top' : 'bottom';
    var sideB = y === 'right' ? 'left' : 'right';

    // if gpuAcceleration is set to `true` and transform is supported,
    //  we use `translate3d` to apply the position to the popper we
    // automatically use the supported prefixed version if needed
    var prefixedProperty = getSupportedPropertyName('transform');

    // now, let's make a step back and look at this code closely (wtf?)
    // If the content of the popper grows once it's been positioned, it
    // may happen that the popper gets misplaced because of the new content
    // overflowing its reference element
    // To avoid this problem, we provide two options (x and y), which allow
    // the consumer to define the offset origin.
    // If we position a popper on top of a reference element, we can set
    // `x` to `top` to make the popper grow towards its top instead of
    // its bottom.
    var left = void 0,
        top = void 0;
    if (sideA === 'bottom') {
      top = -offsetParentRect.height + offsets.bottom;
    } else {
      top = offsets.top;
    }
    if (sideB === 'right') {
      left = -offsetParentRect.width + offsets.right;
    } else {
      left = offsets.left;
    }
    if (gpuAcceleration && prefixedProperty) {
      styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
      styles[sideA] = 0;
      styles[sideB] = 0;
      styles.willChange = 'transform';
    } else {
      // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
      var invertTop = sideA === 'bottom' ? -1 : 1;
      var invertLeft = sideB === 'right' ? -1 : 1;
      styles[sideA] = top * invertTop;
      styles[sideB] = left * invertLeft;
      styles.willChange = sideA + ', ' + sideB;
    }

    // Attributes
    var attributes = {
      'x-placement': data.placement
    };

    // Update `data` attributes, styles and arrowStyles
    data.attributes = _extends$1({}, attributes, data.attributes);
    data.styles = _extends$1({}, styles, data.styles);
    data.arrowStyles = _extends$1({}, data.offsets.arrow, data.arrowStyles);

    return data;
  }

  /**
   * Helper used to know if the given modifier depends from another one.<br />
   * It checks if the needed modifier is listed and enabled.
   * @method
   * @memberof Popper.Utils
   * @param {Array} modifiers - list of modifiers
   * @param {String} requestingName - name of requesting modifier
   * @param {String} requestedName - name of requested modifier
   * @returns {Boolean}
   */
  function isModifierRequired(modifiers, requestingName, requestedName) {
    var requesting = find(modifiers, function (_ref) {
      var name = _ref.name;
      return name === requestingName;
    });

    var isRequired = !!requesting && modifiers.some(function (modifier) {
      return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
    });

    if (!isRequired) {
      var _requesting = '`' + requestingName + '`';
      var requested = '`' + requestedName + '`';
      console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
    }
    return isRequired;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function arrow(data, options) {
    var _data$offsets$arrow;

    // arrow depends on keepTogether in order to work
    if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
      return data;
    }

    var arrowElement = options.element;

    // if arrowElement is a string, suppose it's a CSS selector
    if (typeof arrowElement === 'string') {
      arrowElement = data.instance.popper.querySelector(arrowElement);

      // if arrowElement is not found, don't run the modifier
      if (!arrowElement) {
        return data;
      }
    } else {
      // if the arrowElement isn't a query selector we must check that the
      // provided DOM node is child of its popper node
      if (!data.instance.popper.contains(arrowElement)) {
        console.warn('WARNING: `arrow.element` must be child of its popper element!');
        return data;
      }
    }

    var placement = data.placement.split('-')[0];
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var isVertical = ['left', 'right'].indexOf(placement) !== -1;

    var len = isVertical ? 'height' : 'width';
    var sideCapitalized = isVertical ? 'Top' : 'Left';
    var side = sideCapitalized.toLowerCase();
    var altSide = isVertical ? 'left' : 'top';
    var opSide = isVertical ? 'bottom' : 'right';
    var arrowElementSize = getOuterSizes(arrowElement)[len];

    //
    // extends keepTogether behavior making sure the popper and its
    // reference have enough pixels in conjuction
    //

    // top/left side
    if (reference[opSide] - arrowElementSize < popper[side]) {
      data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
    }
    // bottom/right side
    if (reference[side] + arrowElementSize > popper[opSide]) {
      data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
    }
    data.offsets.popper = getClientRect(data.offsets.popper);

    // compute center of the popper
    var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

    // Compute the sideValue using the updated popper offsets
    // take popper margin in account because we don't have this info available
    var css = getStyleComputedProperty(data.instance.popper);
    var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
    var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
    var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

    // prevent arrowElement from being placed not contiguously to its popper
    sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

    data.arrowElement = arrowElement;
    data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty$1(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty$1(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

    return data;
  }

  /**
   * Get the opposite placement variation of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement variation
   * @returns {String} flipped placement variation
   */
  function getOppositeVariation(variation) {
    if (variation === 'end') {
      return 'start';
    } else if (variation === 'start') {
      return 'end';
    }
    return variation;
  }

  /**
   * List of accepted placements to use as values of the `placement` option.<br />
   * Valid placements are:
   * - `auto`
   * - `top`
   * - `right`
   * - `bottom`
   * - `left`
   *
   * Each placement can have a variation from this list:
   * - `-start`
   * - `-end`
   *
   * Variations are interpreted easily if you think of them as the left to right
   * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
   * is right.<br />
   * Vertically (`left` and `right`), `start` is top and `end` is bottom.
   *
   * Some valid examples are:
   * - `top-end` (on top of reference, right aligned)
   * - `right-start` (on right of reference, top aligned)
   * - `bottom` (on bottom, centered)
   * - `auto-right` (on the side with more space available, alignment depends by placement)
   *
   * @static
   * @type {Array}
   * @enum {String}
   * @readonly
   * @method placements
   * @memberof Popper
   */
  var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

  // Get rid of `auto` `auto-start` and `auto-end`
  var validPlacements = placements.slice(3);

  /**
   * Given an initial placement, returns all the subsequent placements
   * clockwise (or counter-clockwise).
   *
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement - A valid placement (it accepts variations)
   * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
   * @returns {Array} placements including their variations
   */
  function clockwise(placement) {
    var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var index = validPlacements.indexOf(placement);
    var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
    return counter ? arr.reverse() : arr;
  }

  var BEHAVIORS = {
    FLIP: 'flip',
    CLOCKWISE: 'clockwise',
    COUNTERCLOCKWISE: 'counterclockwise'
  };

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function flip(data, options) {
    // if `inner` modifier is enabled, we can't use the `flip` modifier
    if (isModifierEnabled(data.instance.modifiers, 'inner')) {
      return data;
    }

    if (data.flipped && data.placement === data.originalPlacement) {
      // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
      return data;
    }

    var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

    var placement = data.placement.split('-')[0];
    var placementOpposite = getOppositePlacement(placement);
    var variation = data.placement.split('-')[1] || '';

    var flipOrder = [];

    switch (options.behavior) {
      case BEHAVIORS.FLIP:
        flipOrder = [placement, placementOpposite];
        break;
      case BEHAVIORS.CLOCKWISE:
        flipOrder = clockwise(placement);
        break;
      case BEHAVIORS.COUNTERCLOCKWISE:
        flipOrder = clockwise(placement, true);
        break;
      default:
        flipOrder = options.behavior;
    }

    flipOrder.forEach(function (step, index) {
      if (placement !== step || flipOrder.length === index + 1) {
        return data;
      }

      placement = data.placement.split('-')[0];
      placementOpposite = getOppositePlacement(placement);

      var popperOffsets = data.offsets.popper;
      var refOffsets = data.offsets.reference;

      // using floor because the reference offsets may contain decimals we are not going to consider here
      var floor = Math.floor;
      var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

      var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
      var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
      var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
      var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

      var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

      // flip the variation if required
      var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
      var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

      if (overlapsRef || overflowsBoundaries || flippedVariation) {
        // this boolean to detect any flip loop
        data.flipped = true;

        if (overlapsRef || overflowsBoundaries) {
          placement = flipOrder[index + 1];
        }

        if (flippedVariation) {
          variation = getOppositeVariation(variation);
        }

        data.placement = placement + (variation ? '-' + variation : '');

        // this object contains `position`, we want to preserve it along with
        // any additional property we may add in the future
        data.offsets.popper = _extends$1({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

        data = runModifiers(data.instance.modifiers, data, 'flip');
      }
    });
    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function keepTogether(data) {
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var placement = data.placement.split('-')[0];
    var floor = Math.floor;
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var side = isVertical ? 'right' : 'bottom';
    var opSide = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    if (popper[side] < floor(reference[opSide])) {
      data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
    }
    if (popper[opSide] > floor(reference[side])) {
      data.offsets.popper[opSide] = floor(reference[side]);
    }

    return data;
  }

  /**
   * Converts a string containing value + unit into a px value number
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} str - Value + unit string
   * @argument {String} measurement - `height` or `width`
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @returns {Number|String}
   * Value in pixels, or original string if no values were extracted
   */
  function toValue(str, measurement, popperOffsets, referenceOffsets) {
    // separate value from unit
    var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
    var value = +split[1];
    var unit = split[2];

    // If it's not a number it's an operator, I guess
    if (!value) {
      return str;
    }

    if (unit.indexOf('%') === 0) {
      var element = void 0;
      switch (unit) {
        case '%p':
          element = popperOffsets;
          break;
        case '%':
        case '%r':
        default:
          element = referenceOffsets;
      }

      var rect = getClientRect(element);
      return rect[measurement] / 100 * value;
    } else if (unit === 'vh' || unit === 'vw') {
      // if is a vh or vw, we calculate the size based on the viewport
      var size = void 0;
      if (unit === 'vh') {
        size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      } else {
        size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      }
      return size / 100 * value;
    } else {
      // if is an explicit pixel unit, we get rid of the unit and keep the value
      // if is an implicit unit, it's px, and we return just the value
      return value;
    }
  }

  /**
   * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} offset
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @argument {String} basePlacement
   * @returns {Array} a two cells array with x and y offsets in numbers
   */
  function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
    var offsets = [0, 0];

    // Use height if placement is left or right and index is 0 otherwise use width
    // in this way the first offset will use an axis and the second one
    // will use the other one
    var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

    // Split the offset string to obtain a list of values and operands
    // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
    var fragments = offset.split(/(\+|\-)/).map(function (frag) {
      return frag.trim();
    });

    // Detect if the offset string contains a pair of values or a single one
    // they could be separated by comma or space
    var divider = fragments.indexOf(find(fragments, function (frag) {
      return frag.search(/,|\s/) !== -1;
    }));

    if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
      console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
    }

    // If divider is found, we divide the list of values and operands to divide
    // them by ofset X and Y.
    var splitRegex = /\s*,\s*|\s+/;
    var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

    // Convert the values with units to absolute pixels to allow our computations
    ops = ops.map(function (op, index) {
      // Most of the units rely on the orientation of the popper
      var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
      var mergeWithPrevious = false;
      return op
      // This aggregates any `+` or `-` sign that aren't considered operators
      // e.g.: 10 + +5 => [10, +, +5]
      .reduce(function (a, b) {
        if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
          a[a.length - 1] = b;
          mergeWithPrevious = true;
          return a;
        } else if (mergeWithPrevious) {
          a[a.length - 1] += b;
          mergeWithPrevious = false;
          return a;
        } else {
          return a.concat(b);
        }
      }, [])
      // Here we convert the string values into number values (in px)
      .map(function (str) {
        return toValue(str, measurement, popperOffsets, referenceOffsets);
      });
    });

    // Loop trough the offsets arrays and execute the operations
    ops.forEach(function (op, index) {
      op.forEach(function (frag, index2) {
        if (isNumeric(frag)) {
          offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
        }
      });
    });
    return offsets;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @argument {Number|String} options.offset=0
   * The offset value as described in the modifier description
   * @returns {Object} The data object, properly modified
   */
  function offset(data, _ref) {
    var offset = _ref.offset;
    var placement = data.placement,
        _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var basePlacement = placement.split('-')[0];

    var offsets = void 0;
    if (isNumeric(+offset)) {
      offsets = [+offset, 0];
    } else {
      offsets = parseOffset(offset, popper, reference, basePlacement);
    }

    if (basePlacement === 'left') {
      popper.top += offsets[0];
      popper.left -= offsets[1];
    } else if (basePlacement === 'right') {
      popper.top += offsets[0];
      popper.left += offsets[1];
    } else if (basePlacement === 'top') {
      popper.left += offsets[0];
      popper.top -= offsets[1];
    } else if (basePlacement === 'bottom') {
      popper.left += offsets[0];
      popper.top += offsets[1];
    }

    data.popper = popper;
    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function preventOverflow(data, options) {
    var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

    // If offsetParent is the reference element, we really want to
    // go one step up and use the next offsetParent as reference to
    // avoid to make this modifier completely useless and look like broken
    if (data.instance.reference === boundariesElement) {
      boundariesElement = getOffsetParent(boundariesElement);
    }

    // NOTE: DOM access here
    // resets the popper's position so that the document size can be calculated excluding
    // the size of the popper element itself
    var transformProp = getSupportedPropertyName('transform');
    var popperStyles = data.instance.popper.style; // assignment to help minification
    var top = popperStyles.top,
        left = popperStyles.left,
        transform = popperStyles[transformProp];

    popperStyles.top = '';
    popperStyles.left = '';
    popperStyles[transformProp] = '';

    var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

    // NOTE: DOM access here
    // restores the original style properties after the offsets have been computed
    popperStyles.top = top;
    popperStyles.left = left;
    popperStyles[transformProp] = transform;

    options.boundaries = boundaries;

    var order = options.priority;
    var popper = data.offsets.popper;

    var check = {
      primary: function primary(placement) {
        var value = popper[placement];
        if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
          value = Math.max(popper[placement], boundaries[placement]);
        }
        return defineProperty$1({}, placement, value);
      },
      secondary: function secondary(placement) {
        var mainSide = placement === 'right' ? 'left' : 'top';
        var value = popper[mainSide];
        if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
          value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
        }
        return defineProperty$1({}, mainSide, value);
      }
    };

    order.forEach(function (placement) {
      var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
      popper = _extends$1({}, popper, check[side](placement));
    });

    data.offsets.popper = popper;

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function shift(data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var shiftvariation = placement.split('-')[1];

    // if shift shiftvariation is specified, run the modifier
    if (shiftvariation) {
      var _data$offsets = data.offsets,
          reference = _data$offsets.reference,
          popper = _data$offsets.popper;

      var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
      var side = isVertical ? 'left' : 'top';
      var measurement = isVertical ? 'width' : 'height';

      var shiftOffsets = {
        start: defineProperty$1({}, side, reference[side]),
        end: defineProperty$1({}, side, reference[side] + reference[measurement] - popper[measurement])
      };

      data.offsets.popper = _extends$1({}, popper, shiftOffsets[shiftvariation]);
    }

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function hide(data) {
    if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
      return data;
    }

    var refRect = data.offsets.reference;
    var bound = find(data.instance.modifiers, function (modifier) {
      return modifier.name === 'preventOverflow';
    }).boundaries;

    if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === true) {
        return data;
      }

      data.hide = true;
      data.attributes['x-out-of-boundaries'] = '';
    } else {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === false) {
        return data;
      }

      data.hide = false;
      data.attributes['x-out-of-boundaries'] = false;
    }

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function inner(data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

    var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

    popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

    data.placement = getOppositePlacement(placement);
    data.offsets.popper = getClientRect(popper);

    return data;
  }

  /**
   * Modifier function, each modifier can have a function of this type assigned
   * to its `fn` property.<br />
   * These functions will be called on each update, this means that you must
   * make sure they are performant enough to avoid performance bottlenecks.
   *
   * @function ModifierFn
   * @argument {dataObject} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {dataObject} The data object, properly modified
   */

  /**
   * Modifiers are plugins used to alter the behavior of your poppers.<br />
   * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
   * needed by the library.
   *
   * Usually you don't want to override the `order`, `fn` and `onLoad` props.
   * All the other properties are configurations that could be tweaked.
   * @namespace modifiers
   */
  var modifiers = {
    /**
     * Modifier used to shift the popper on the start or end of its reference
     * element.<br />
     * It will read the variation of the `placement` property.<br />
     * It can be one either `-end` or `-start`.
     * @memberof modifiers
     * @inner
     */
    shift: {
      /** @prop {number} order=100 - Index used to define the order of execution */
      order: 100,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: shift
    },

    /**
     * The `offset` modifier can shift your popper on both its axis.
     *
     * It accepts the following units:
     * - `px` or unitless, interpreted as pixels
     * - `%` or `%r`, percentage relative to the length of the reference element
     * - `%p`, percentage relative to the length of the popper element
     * - `vw`, CSS viewport width unit
     * - `vh`, CSS viewport height unit
     *
     * For length is intended the main axis relative to the placement of the popper.<br />
     * This means that if the placement is `top` or `bottom`, the length will be the
     * `width`. In case of `left` or `right`, it will be the height.
     *
     * You can provide a single value (as `Number` or `String`), or a pair of values
     * as `String` divided by a comma or one (or more) white spaces.<br />
     * The latter is a deprecated method because it leads to confusion and will be
     * removed in v2.<br />
     * Additionally, it accepts additions and subtractions between different units.
     * Note that multiplications and divisions aren't supported.
     *
     * Valid examples are:
     * ```
     * 10
     * '10%'
     * '10, 10'
     * '10%, 10'
     * '10 + 10%'
     * '10 - 5vh + 3%'
     * '-10px + 5vh, 5px - 6%'
     * ```
     * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
     * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
     * > More on this [reading this issue](https://github.com/FezVrasta/popper.js/issues/373)
     *
     * @memberof modifiers
     * @inner
     */
    offset: {
      /** @prop {number} order=200 - Index used to define the order of execution */
      order: 200,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: offset,
      /** @prop {Number|String} offset=0
       * The offset value as described in the modifier description
       */
      offset: 0
    },

    /**
     * Modifier used to prevent the popper from being positioned outside the boundary.
     *
     * An scenario exists where the reference itself is not within the boundaries.<br />
     * We can say it has "escaped the boundaries" — or just "escaped".<br />
     * In this case we need to decide whether the popper should either:
     *
     * - detach from the reference and remain "trapped" in the boundaries, or
     * - if it should ignore the boundary and "escape with its reference"
     *
     * When `escapeWithReference` is set to`true` and reference is completely
     * outside its boundaries, the popper will overflow (or completely leave)
     * the boundaries in order to remain attached to the edge of the reference.
     *
     * @memberof modifiers
     * @inner
     */
    preventOverflow: {
      /** @prop {number} order=300 - Index used to define the order of execution */
      order: 300,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: preventOverflow,
      /**
       * @prop {Array} [priority=['left','right','top','bottom']]
       * Popper will try to prevent overflow following these priorities by default,
       * then, it could overflow on the left and on top of the `boundariesElement`
       */
      priority: ['left', 'right', 'top', 'bottom'],
      /**
       * @prop {number} padding=5
       * Amount of pixel used to define a minimum distance between the boundaries
       * and the popper this makes sure the popper has always a little padding
       * between the edges of its container
       */
      padding: 5,
      /**
       * @prop {String|HTMLElement} boundariesElement='scrollParent'
       * Boundaries used by the modifier, can be `scrollParent`, `window`,
       * `viewport` or any DOM element.
       */
      boundariesElement: 'scrollParent'
    },

    /**
     * Modifier used to make sure the reference and its popper stay near eachothers
     * without leaving any gap between the two. Expecially useful when the arrow is
     * enabled and you want to assure it to point to its reference element.
     * It cares only about the first axis, you can still have poppers with margin
     * between the popper and its reference element.
     * @memberof modifiers
     * @inner
     */
    keepTogether: {
      /** @prop {number} order=400 - Index used to define the order of execution */
      order: 400,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: keepTogether
    },

    /**
     * This modifier is used to move the `arrowElement` of the popper to make
     * sure it is positioned between the reference element and its popper element.
     * It will read the outer size of the `arrowElement` node to detect how many
     * pixels of conjuction are needed.
     *
     * It has no effect if no `arrowElement` is provided.
     * @memberof modifiers
     * @inner
     */
    arrow: {
      /** @prop {number} order=500 - Index used to define the order of execution */
      order: 500,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: arrow,
      /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
      element: '[x-arrow]'
    },

    /**
     * Modifier used to flip the popper's placement when it starts to overlap its
     * reference element.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     *
     * **NOTE:** this modifier will interrupt the current update cycle and will
     * restart it if it detects the need to flip the placement.
     * @memberof modifiers
     * @inner
     */
    flip: {
      /** @prop {number} order=600 - Index used to define the order of execution */
      order: 600,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: flip,
      /**
       * @prop {String|Array} behavior='flip'
       * The behavior used to change the popper's placement. It can be one of
       * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
       * placements (with optional variations).
       */
      behavior: 'flip',
      /**
       * @prop {number} padding=5
       * The popper will flip if it hits the edges of the `boundariesElement`
       */
      padding: 5,
      /**
       * @prop {String|HTMLElement} boundariesElement='viewport'
       * The element which will define the boundaries of the popper position,
       * the popper will never be placed outside of the defined boundaries
       * (except if keepTogether is enabled)
       */
      boundariesElement: 'viewport'
    },

    /**
     * Modifier used to make the popper flow toward the inner of the reference element.
     * By default, when this modifier is disabled, the popper will be placed outside
     * the reference element.
     * @memberof modifiers
     * @inner
     */
    inner: {
      /** @prop {number} order=700 - Index used to define the order of execution */
      order: 700,
      /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
      enabled: false,
      /** @prop {ModifierFn} */
      fn: inner
    },

    /**
     * Modifier used to hide the popper when its reference element is outside of the
     * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
     * be used to hide with a CSS selector the popper when its reference is
     * out of boundaries.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     * @memberof modifiers
     * @inner
     */
    hide: {
      /** @prop {number} order=800 - Index used to define the order of execution */
      order: 800,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: hide
    },

    /**
     * Computes the style that will be applied to the popper element to gets
     * properly positioned.
     *
     * Note that this modifier will not touch the DOM, it just prepares the styles
     * so that `applyStyle` modifier can apply it. This separation is useful
     * in case you need to replace `applyStyle` with a custom implementation.
     *
     * This modifier has `850` as `order` value to maintain backward compatibility
     * with previous versions of Popper.js. Expect the modifiers ordering method
     * to change in future major versions of the library.
     *
     * @memberof modifiers
     * @inner
     */
    computeStyle: {
      /** @prop {number} order=850 - Index used to define the order of execution */
      order: 850,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: computeStyle,
      /**
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3d transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties.
       */
      gpuAcceleration: true,
      /**
       * @prop {string} [x='bottom']
       * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
       * Change this if your popper should grow in a direction different from `bottom`
       */
      x: 'bottom',
      /**
       * @prop {string} [x='left']
       * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
       * Change this if your popper should grow in a direction different from `right`
       */
      y: 'right'
    },

    /**
     * Applies the computed styles to the popper element.
     *
     * All the DOM manipulations are limited to this modifier. This is useful in case
     * you want to integrate Popper.js inside a framework or view library and you
     * want to delegate all the DOM manipulations to it.
     *
     * Note that if you disable this modifier, you must make sure the popper element
     * has its position set to `absolute` before Popper.js can do its work!
     *
     * Just disable this modifier and define you own to achieve the desired effect.
     *
     * @memberof modifiers
     * @inner
     */
    applyStyle: {
      /** @prop {number} order=900 - Index used to define the order of execution */
      order: 900,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: applyStyle,
      /** @prop {Function} */
      onLoad: applyStyleOnLoad,
      /**
       * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3d transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties.
       */
      gpuAcceleration: undefined
    }
  };

  /**
   * The `dataObject` is an object containing all the informations used by Popper.js
   * this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
   * @name dataObject
   * @property {Object} data.instance The Popper.js instance
   * @property {String} data.placement Placement applied to popper
   * @property {String} data.originalPlacement Placement originally defined on init
   * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
   * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper.
   * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
   * @property {Object} data.styles Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow, it expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.boundaries Offsets of the popper boundaries
   * @property {Object} data.offsets The measurements of popper, reference and arrow elements.
   * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
   */

  /**
   * Default options provided to Popper.js constructor.<br />
   * These can be overriden using the `options` argument of Popper.js.<br />
   * To override an option, simply pass as 3rd argument an object with the same
   * structure of this object, example:
   * ```
   * new Popper(ref, pop, {
   *   modifiers: {
   *     preventOverflow: { enabled: false }
   *   }
   * })
   * ```
   * @type {Object}
   * @static
   * @memberof Popper
   */
  var Defaults = {
    /**
     * Popper's placement
     * @prop {Popper.placements} placement='bottom'
     */
    placement: 'bottom',

    /**
     * Set this to true if you want popper to position it self in 'fixed' mode
     * @prop {Boolean} positionFixed=false
     */
    positionFixed: false,

    /**
     * Whether events (resize, scroll) are initially enabled
     * @prop {Boolean} eventsEnabled=true
     */
    eventsEnabled: true,

    /**
     * Set to true if you want to automatically remove the popper when
     * you call the `destroy` method.
     * @prop {Boolean} removeOnDestroy=false
     */
    removeOnDestroy: false,

    /**
     * Callback called when the popper is created.<br />
     * By default, is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onCreate}
     */
    onCreate: function onCreate() {},

    /**
     * Callback called when the popper is updated, this callback is not called
     * on the initialization/creation of the popper, but only on subsequent
     * updates.<br />
     * By default, is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onUpdate}
     */
    onUpdate: function onUpdate() {},

    /**
     * List of modifiers used to modify the offsets before they are applied to the popper.
     * They provide most of the functionalities of Popper.js
     * @prop {modifiers}
     */
    modifiers: modifiers
  };

  /**
   * @callback onCreate
   * @param {dataObject} data
   */

  /**
   * @callback onUpdate
   * @param {dataObject} data
   */

  // Utils
  // Methods
  var Popper = function () {
    /**
     * Create a new Popper.js instance
     * @class Popper
     * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
     * @param {HTMLElement} popper - The HTML element used as popper.
     * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
     * @return {Object} instance - The generated Popper.js instance
     */
    function Popper(reference, popper) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      classCallCheck$1(this, Popper);

      this.scheduleUpdate = function () {
        return requestAnimationFrame(_this.update);
      };

      // make update() debounced, so that it only runs at most once-per-tick
      this.update = debounce(this.update.bind(this));

      // with {} we create a new object with the options inside it
      this.options = _extends$1({}, Popper.Defaults, options);

      // init state
      this.state = {
        isDestroyed: false,
        isCreated: false,
        scrollParents: []
      };

      // get reference and popper elements (allow jQuery wrappers)
      this.reference = reference && reference.jquery ? reference[0] : reference;
      this.popper = popper && popper.jquery ? popper[0] : popper;

      // Deep merge modifiers options
      this.options.modifiers = {};
      Object.keys(_extends$1({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
        _this.options.modifiers[name] = _extends$1({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
      });

      // Refactoring modifiers' list (Object => Array)
      this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
        return _extends$1({
          name: name
        }, _this.options.modifiers[name]);
      })
      // sort the modifiers by order
      .sort(function (a, b) {
        return a.order - b.order;
      });

      // modifiers have the ability to execute arbitrary code when Popper.js get inited
      // such code is executed in the same order of its modifier
      // they could add new properties to their options configuration
      // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
      this.modifiers.forEach(function (modifierOptions) {
        if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
          modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
        }
      });

      // fire the first update to position the popper in the right place
      this.update();

      var eventsEnabled = this.options.eventsEnabled;
      if (eventsEnabled) {
        // setup event listeners, they will take care of update the position in specific situations
        this.enableEventListeners();
      }

      this.state.eventsEnabled = eventsEnabled;
    }

    // We can't use class properties because they don't get listed in the
    // class prototype and break stuff like Sinon stubs


    createClass$1(Popper, [{
      key: 'update',
      value: function update$$1() {
        return update.call(this);
      }
    }, {
      key: 'destroy',
      value: function destroy$$1() {
        return destroy.call(this);
      }
    }, {
      key: 'enableEventListeners',
      value: function enableEventListeners$$1() {
        return enableEventListeners.call(this);
      }
    }, {
      key: 'disableEventListeners',
      value: function disableEventListeners$$1() {
        return disableEventListeners.call(this);
      }

      /**
       * Schedule an update, it will run on the next UI update available
       * @method scheduleUpdate
       * @memberof Popper
       */

      /**
       * Collection of utilities useful when writing custom modifiers.
       * Starting from version 1.7, this method is available only if you
       * include `popper-utils.js` before `popper.js`.
       *
       * **DEPRECATION**: This way to access PopperUtils is deprecated
       * and will be removed in v2! Use the PopperUtils module directly instead.
       * Due to the high instability of the methods contained in Utils, we can't
       * guarantee them to follow semver. Use them at your own risk!
       * @static
       * @private
       * @type {Object}
       * @deprecated since version 1.8
       * @member Utils
       * @memberof Popper
       */

    }]);
    return Popper;
  }();

  /**
   * The `referenceObject` is an object that provides an interface compatible with Popper.js
   * and lets you use it as replacement of a real DOM node.<br />
   * You can use this method to position a popper relatively to a set of coordinates
   * in case you don't have a DOM node to use as reference.
   *
   * ```
   * new Popper(referenceObject, popperNode);
   * ```
   *
   * NB: This feature isn't supported in Internet Explorer 10
   * @name referenceObject
   * @property {Function} data.getBoundingClientRect
   * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
   * @property {number} data.clientWidth
   * An ES6 getter that will return the width of the virtual reference element.
   * @property {number} data.clientHeight
   * An ES6 getter that will return the height of the virtual reference element.
   */

  Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
  Popper.placements = placements;
  Popper.Defaults = Defaults;

  /**
   * Triggers document reflow.
   * Use void because some minifiers or engines think simply accessing the property
   * is unnecessary.
   * @param {Element} popper
   */
  function reflow(popper) {
    void popper.offsetHeight;
  }

  /**
   * Wrapper util for popper position updating.
   * Updates the popper's position and invokes the callback on update.
   * Hackish workaround until Popper 2.0's update() becomes sync.
   * @param {Popper} popperInstance
   * @param {Function} callback: to run once popper's position was updated
   * @param {Boolean} updateAlreadyCalled: was scheduleUpdate() already called?
   */
  function updatePopperPosition(popperInstance, callback, updateAlreadyCalled) {
    var popper = popperInstance.popper,
        options = popperInstance.options;

    var onCreate = options.onCreate;
    var onUpdate = options.onUpdate;

    options.onCreate = options.onUpdate = function () {
      reflow(popper), callback && callback(), onUpdate();
      options.onCreate = onCreate;
      options.onUpdate = onUpdate;
    };

    if (!updateAlreadyCalled) {
      popperInstance.scheduleUpdate();
    }
  }

  /**
   * Returns the core placement ('top', 'bottom', 'left', 'right') of a popper
   * @param {Element} popper
   * @return {String}
   */
  function getPopperPlacement(popper) {
    return popper.getAttribute('x-placement').replace(/-.+/, '');
  }

  /**
   * Determines if the mouse's cursor is outside the interactive border
   * @param {MouseEvent} event
   * @param {Element} popper
   * @param {Object} options
   * @return {Boolean}
   */
  function cursorIsOutsideInteractiveBorder(event, popper, options) {
    if (!popper.getAttribute('x-placement')) return true;

    var x = event.clientX,
        y = event.clientY;
    var interactiveBorder = options.interactiveBorder,
        distance = options.distance;

    var rect = popper.getBoundingClientRect();
    var placement = getPopperPlacement(popper);
    var borderWithDistance = interactiveBorder + distance;

    var exceeds = {
      top: rect.top - y > interactiveBorder,
      bottom: y - rect.bottom > interactiveBorder,
      left: rect.left - x > interactiveBorder,
      right: x - rect.right > interactiveBorder
    };

    switch (placement) {
      case 'top':
        exceeds.top = rect.top - y > borderWithDistance;
        break;
      case 'bottom':
        exceeds.bottom = y - rect.bottom > borderWithDistance;
        break;
      case 'left':
        exceeds.left = rect.left - x > borderWithDistance;
        break;
      case 'right':
        exceeds.right = x - rect.right > borderWithDistance;
        break;
    }

    return exceeds.top || exceeds.bottom || exceeds.left || exceeds.right;
  }

  /**
   * Transforms the `arrowTransform` numbers based on the placement axis
   * @param {String} type 'scale' or 'translate'
   * @param {Number[]} numbers
   * @param {Boolean} isVertical
   * @param {Boolean} isReverse
   * @return {String}
   */
  function transformNumbersBasedOnPlacementAxis(type, numbers, isVertical, isReverse) {
    if (!numbers.length) return '';

    var transforms = {
      scale: function () {
        if (numbers.length === 1) {
          return '' + numbers[0];
        } else {
          return isVertical ? numbers[0] + ', ' + numbers[1] : numbers[1] + ', ' + numbers[0];
        }
      }(),
      translate: function () {
        if (numbers.length === 1) {
          return isReverse ? -numbers[0] + 'px' : numbers[0] + 'px';
        } else {
          if (isVertical) {
            return isReverse ? numbers[0] + 'px, ' + -numbers[1] + 'px' : numbers[0] + 'px, ' + numbers[1] + 'px';
          } else {
            return isReverse ? -numbers[1] + 'px, ' + numbers[0] + 'px' : numbers[1] + 'px, ' + numbers[0] + 'px';
          }
        }
      }()
    };

    return transforms[type];
  }

  /**
   * Transforms the `arrowTransform` x or y axis based on the placement axis
   * @param {String} axis 'X', 'Y', ''
   * @param {Boolean} isVertical
   * @return {String}
   */
  function transformAxis(axis, isVertical) {
    if (!axis) return '';
    var map = {
      X: 'Y',
      Y: 'X'
    };
    return isVertical ? axis : map[axis];
  }

  /**
   * Computes and applies the necessary arrow transform
   * @param {Element} popper
   * @param {Element} arrow
   * @param {String} arrowTransform
   */
  function computeArrowTransform(popper, arrow, arrowTransform) {
    var placement = getPopperPlacement(popper);
    var isVertical = placement === 'top' || placement === 'bottom';
    var isReverse = placement === 'right' || placement === 'bottom';

    var getAxis = function getAxis(re) {
      var match = arrowTransform.match(re);
      return match ? match[1] : '';
    };

    var getNumbers = function getNumbers(re) {
      var match = arrowTransform.match(re);
      return match ? match[1].split(',').map(parseFloat) : [];
    };

    var re = {
      translate: /translateX?Y?\(([^)]+)\)/,
      scale: /scaleX?Y?\(([^)]+)\)/
    };

    var matches = {
      translate: {
        axis: getAxis(/translate([XY])/),
        numbers: getNumbers(re.translate)
      },
      scale: {
        axis: getAxis(/scale([XY])/),
        numbers: getNumbers(re.scale)
      }
    };

    var computedTransform = arrowTransform.replace(re.translate, 'translate' + transformAxis(matches.translate.axis, isVertical) + '(' + transformNumbersBasedOnPlacementAxis('translate', matches.translate.numbers, isVertical, isReverse) + ')').replace(re.scale, 'scale' + transformAxis(matches.scale.axis, isVertical) + '(' + transformNumbersBasedOnPlacementAxis('scale', matches.scale.numbers, isVertical, isReverse) + ')');

    arrow.style[prefix('transform')] = computedTransform;
  }

  /**
   * Returns the distance taking into account the default distance due to
   * the transform: translate setting in CSS
   * @param {Number} distance
   * @return {String}
   */
  function getOffsetDistanceInPx(distance) {
    return -(distance - defaults.distance) + 'px';
  }

  /**
   * Waits until next repaint to execute a fn
   * @param {Function} fn
   */
  function defer(fn) {
    requestAnimationFrame(function () {
      setTimeout(fn, 1);
    });
  }

  var matches = {};

  if (isBrowser) {
    var e = Element.prototype;
    matches = e.matches || e.matchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector || e.msMatchesSelector || function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s);
      var i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {} // eslint-disable-line no-empty
      return i > -1;
    };
  }

  var matches$1 = matches;

  /**
   * Ponyfill to get the closest parent element
   * @param {Element} element - child of parent to be returned
   * @param {String} parentSelector - selector to match the parent if found
   * @return {Element}
   */
  function closest(element, parentSelector) {
    var fn = Element.prototype.closest || function (selector) {
      var el = this;
      while (el) {
        if (matches$1.call(el, selector)) {
          return el;
        }
        el = el.parentElement;
      }
    };

    return fn.call(element, parentSelector);
  }

  /**
   * Returns the value taking into account the value being either a number or array
   * @param {Number|Array} value
   * @param {Number} index
   * @return {Number}
   */
  function getValue(value, index) {
    return Array.isArray(value) ? value[index] : value;
  }

  /**
   * Sets the visibility state of an element for transition to begin
   * @param {Element[]} els - array of elements
   * @param {String} type - 'visible' or 'hidden'
   */
  function setVisibilityState(els, type) {
    els.forEach(function (el) {
      if (!el) return;
      el.setAttribute('data-state', type);
    });
  }

  /**
   * Sets the transition property to each element
   * @param {Element[]} els - Array of elements
   * @param {String} value
   */
  function applyTransitionDuration(els, value) {
    els.filter(Boolean).forEach(function (el) {
      el.style[prefix('transitionDuration')] = value + 'ms';
    });
  }

  /**
   * Focuses an element while preventing a scroll jump if it's not entirely within the viewport
   * @param {Element} el
   */
  function focus(el) {
    var x = window.scrollX || window.pageXOffset;
    var y = window.scrollY || window.pageYOffset;
    el.focus();
    scroll(x, y);
  }

  var key = {};
  var store = function store(data) {
    return function (k) {
      return k === key && data;
    };
  };

  var Tippy = function () {
    function Tippy(config) {
      classCallCheck(this, Tippy);

      for (var _key in config) {
        this[_key] = config[_key];
      }

      this.state = {
        destroyed: false,
        visible: false,
        enabled: true
      };

      this._ = store({
        mutationObservers: []
      });
    }

    /**
     * Enables the tooltip to allow it to show or hide
     * @memberof Tippy
     * @public
     */

    createClass(Tippy, [{
      key: 'enable',
      value: function enable() {
        this.state.enabled = true;
      }

      /**
       * Disables the tooltip from showing or hiding, but does not destroy it
       * @memberof Tippy
       * @public
       */

    }, {
      key: 'disable',
      value: function disable() {
        this.state.enabled = false;
      }

      /**
       * Shows the tooltip
       * @param {Number} duration in milliseconds
       * @memberof Tippy
       * @public
       */

    }, {
      key: 'show',
      value: function show(duration) {
        var _this = this;

        if (this.state.destroyed || !this.state.enabled) return;

        var popper = this.popper,
            reference = this.reference,
            options = this.options;

        var _getInnerElements = getInnerElements(popper),
            tooltip = _getInnerElements.tooltip,
            backdrop = _getInnerElements.backdrop,
            content = _getInnerElements.content;

        // If the `dynamicTitle` option is true, the instance is allowed
        // to be created with an empty title. Make sure that the tooltip
        // content is not empty before showing it


        if (options.dynamicTitle && !reference.getAttribute('data-original-title')) {
          return;
        }

        // Do not show tooltip if reference contains 'disabled' attribute. FF fix for #221
        if (reference.hasAttribute('disabled')) return;

        // Destroy tooltip if the reference element is no longer on the DOM
        if (!reference.refObj && !document.documentElement.contains(reference)) {
          this.destroy();
          return;
        }

        options.onShow.call(popper, this);

        duration = getValue(duration !== undefined ? duration : options.duration, 0);

        // Prevent a transition when popper changes position
        applyTransitionDuration([popper, tooltip, backdrop], 0);

        popper.style.visibility = 'visible';
        this.state.visible = true;

        _mount.call(this, function () {
          if (!_this.state.visible) return;

          if (!_hasFollowCursorBehavior.call(_this)) {
            // FIX: Arrow will sometimes not be positioned correctly. Force another update.
            _this.popperInstance.scheduleUpdate();
          }

          // Set initial position near the cursor
          if (_hasFollowCursorBehavior.call(_this)) {
            _this.popperInstance.disableEventListeners();
            var delay = getValue(options.delay, 0);
            var lastTriggerEvent = _this._(key).lastTriggerEvent;
            if (lastTriggerEvent) {
              _this._(key).followCursorListener(delay && _this._(key).lastMouseMoveEvent ? _this._(key).lastMouseMoveEvent : lastTriggerEvent);
            }
          }

          // Re-apply transition durations
          applyTransitionDuration([tooltip, backdrop, backdrop ? content : null], duration);

          if (backdrop) {
            getComputedStyle(backdrop)[prefix('transform')];
          }

          if (options.interactive) {
            reference.classList.add('tippy-active');
          }

          if (options.sticky) {
            _makeSticky.call(_this);
          }

          setVisibilityState([tooltip, backdrop], 'visible');

          _onTransitionEnd.call(_this, duration, function () {
            if (!options.updateDuration) {
              tooltip.classList.add('tippy-notransition');
            }

            if (options.interactive) {
              focus(popper);
            }

            reference.setAttribute('aria-describedby', 'tippy-' + _this.id);

            options.onShown.call(popper, _this);
          });
        });
      }

      /**
       * Hides the tooltip
       * @param {Number} duration in milliseconds
       * @memberof Tippy
       * @public
       */

    }, {
      key: 'hide',
      value: function hide(duration) {
        var _this2 = this;

        if (this.state.destroyed || !this.state.enabled) return;

        var popper = this.popper,
            reference = this.reference,
            options = this.options;

        var _getInnerElements2 = getInnerElements(popper),
            tooltip = _getInnerElements2.tooltip,
            backdrop = _getInnerElements2.backdrop,
            content = _getInnerElements2.content;

        options.onHide.call(popper, this);

        duration = getValue(duration !== undefined ? duration : options.duration, 1);

        if (!options.updateDuration) {
          tooltip.classList.remove('tippy-notransition');
        }

        if (options.interactive) {
          reference.classList.remove('tippy-active');
        }

        popper.style.visibility = 'hidden';
        this.state.visible = false;

        applyTransitionDuration([tooltip, backdrop, backdrop ? content : null], duration);

        setVisibilityState([tooltip, backdrop], 'hidden');

        if (options.interactive && options.trigger.indexOf('click') > -1) {
          focus(reference);
        }

        /*
        * This call is deferred because sometimes when the tooltip is still transitioning in but hide()
        * is called before it finishes, the CSS transition won't reverse quickly enough, meaning
        * the CSS transition will finish 1-2 frames later, and onHidden() will run since the JS set it
        * more quickly. It should actually be onShown(). Seems to be something Chrome does, not Safari
        */
        defer(function () {
          _onTransitionEnd.call(_this2, duration, function () {
            if (_this2.state.visible || !options.appendTo.contains(popper)) return;

            if (!_this2._(key).isPreparingToShow) {
              document.removeEventListener('mousemove', _this2._(key).followCursorListener);
              _this2._(key).lastMouseMoveEvent = null;
            }

            if (_this2.popperInstance) {
              _this2.popperInstance.disableEventListeners();
            }

            reference.removeAttribute('aria-describedby');

            options.appendTo.removeChild(popper);

            options.onHidden.call(popper, _this2);
          });
        });
      }

      /**
       * Destroys the tooltip instance
       * @param {Boolean} destroyTargetInstances - relevant only when destroying delegates
       * @memberof Tippy
       * @public
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        var _this3 = this;

        var destroyTargetInstances = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (this.state.destroyed) return;

        // Ensure the popper is hidden
        if (this.state.visible) {
          this.hide(0);
        }

        this.listeners.forEach(function (listener) {
          _this3.reference.removeEventListener(listener.event, listener.handler);
        });

        // Restore title
        if (this.title) {
          this.reference.setAttribute('title', this.title);
        }

        delete this.reference._tippy;

        var attributes = ['data-original-title', 'data-tippy', 'data-tippy-delegate'];
        attributes.forEach(function (attr) {
          _this3.reference.removeAttribute(attr);
        });

        if (this.options.target && destroyTargetInstances) {
          toArray(this.reference.querySelectorAll(this.options.target)).forEach(function (child) {
            return child._tippy && child._tippy.destroy();
          });
        }

        if (this.popperInstance) {
          this.popperInstance.destroy();
        }

        this._(key).mutationObservers.forEach(function (observer) {
          observer.disconnect();
        });

        this.state.destroyed = true;
      }
    }]);
    return Tippy;
  }();

  /**
   * ------------------------------------------------------------------------
   * Private methods
   * ------------------------------------------------------------------------
   * Standalone functions to be called with the instance's `this` context to make
   * them truly private and not accessible on the prototype
   */

  /**
   * Determines if the tooltip instance has followCursor behavior
   * @return {Boolean}
   * @memberof Tippy
   * @private
   */
  function _hasFollowCursorBehavior() {
    var lastTriggerEvent = this._(key).lastTriggerEvent;
    return this.options.followCursor && !browser.usingTouch && lastTriggerEvent && lastTriggerEvent.type !== 'focus';
  }

  /**
   * Creates the Tippy instance for the child target of the delegate container
   * @param {Event} event
   * @memberof Tippy
   * @private
   */
  function _createDelegateChildTippy(event) {
    var targetEl = closest(event.target, this.options.target);
    if (targetEl && !targetEl._tippy) {
      var title = targetEl.getAttribute('title') || this.title;
      if (title) {
        targetEl.setAttribute('title', title);
        tippy$1(targetEl, _extends({}, this.options, { target: null }));
        _enter.call(targetEl._tippy, event);
      }
    }
  }

  /**
   * Method used by event listeners to invoke the show method, taking into account delays and
   * the `wait` option
   * @param {Event} event
   * @memberof Tippy
   * @private
   */
  function _enter(event) {
    var _this4 = this;

    var options = this.options;

    _clearDelayTimeouts.call(this);

    if (this.state.visible) return;

    // Is a delegate, create Tippy instance for the child target
    if (options.target) {
      _createDelegateChildTippy.call(this, event);
      return;
    }

    this._(key).isPreparingToShow = true;

    if (options.wait) {
      options.wait.call(this.popper, this.show.bind(this), event);
      return;
    }

    // If the tooltip has a delay, we need to be listening to the mousemove as soon as the trigger
    // event is fired so that it's in the correct position upon mount.
    if (_hasFollowCursorBehavior.call(this)) {
      if (!this._(key).followCursorListener) {
        _setFollowCursorListener.call(this);
      }

      var _getInnerElements3 = getInnerElements(this.popper),
          arrow = _getInnerElements3.arrow;

      if (arrow) arrow.style.margin = '0';
      document.addEventListener('mousemove', this._(key).followCursorListener);
    }

    var delay = getValue(options.delay, 0);

    if (delay) {
      this._(key).showTimeout = setTimeout(function () {
        _this4.show();
      }, delay);
    } else {
      this.show();
    }
  }

  /**
   * Method used by event listeners to invoke the hide method, taking into account delays
   * @memberof Tippy
   * @private
   */
  function _leave() {
    var _this5 = this;

    _clearDelayTimeouts.call(this);

    if (!this.state.visible) return;

    this._(key).isPreparingToShow = false;

    var delay = getValue(this.options.delay, 1);

    if (delay) {
      this._(key).hideTimeout = setTimeout(function () {
        if (_this5.state.visible) {
          _this5.hide();
        }
      }, delay);
    } else {
      this.hide();
    }
  }

  /**
   * Returns relevant listeners for the instance
   * @return {Object} of listeners
   * @memberof Tippy
   * @private
   */
  function _getEventListeners() {
    var _this6 = this;

    var onTrigger = function onTrigger(event) {
      if (!_this6.state.enabled) return;

      var shouldStopEvent = browser.supportsTouch && browser.usingTouch && ['mouseenter', 'mouseover', 'focus'].indexOf(event.type) > -1;

      if (shouldStopEvent && _this6.options.touchHold) return;

      _this6._(key).lastTriggerEvent = event;

      // Toggle show/hide when clicking click-triggered tooltips
      if (event.type === 'click' && _this6.options.hideOnClick !== 'persistent' && _this6.state.visible) {
        _leave.call(_this6);
      } else {
        _enter.call(_this6, event);
      }
    };

    var onMouseLeave = function onMouseLeave(event) {
      if (['mouseleave', 'mouseout'].indexOf(event.type) > -1 && browser.supportsTouch && browser.usingTouch && _this6.options.touchHold) return;

      if (_this6.options.interactive) {
        var hide = _leave.bind(_this6);

        var onMouseMove = function onMouseMove(event) {
          var referenceCursorIsOver = closest(event.target, selectors.REFERENCE);
          var cursorIsOverPopper = closest(event.target, selectors.POPPER) === _this6.popper;
          var cursorIsOverReference = referenceCursorIsOver === _this6.reference;

          if (cursorIsOverPopper || cursorIsOverReference) return;

          if (cursorIsOutsideInteractiveBorder(event, _this6.popper, _this6.options)) {
            document.body.removeEventListener('mouseleave', hide);
            document.removeEventListener('mousemove', onMouseMove);

            _leave.call(_this6, onMouseMove);
          }
        };

        document.body.addEventListener('mouseleave', hide);
        document.addEventListener('mousemove', onMouseMove);
        return;
      }

      _leave.call(_this6);
    };

    var onBlur = function onBlur(event) {
      if (event.target !== _this6.reference || browser.usingTouch) return;

      if (_this6.options.interactive) {
        if (!event.relatedTarget) return;
        if (closest(event.relatedTarget, selectors.POPPER)) return;
      }

      _leave.call(_this6);
    };

    var onDelegateShow = function onDelegateShow(event) {
      if (closest(event.target, _this6.options.target)) {
        _enter.call(_this6, event);
      }
    };

    var onDelegateHide = function onDelegateHide(event) {
      if (closest(event.target, _this6.options.target)) {
        _leave.call(_this6);
      }
    };

    return {
      onTrigger: onTrigger,
      onMouseLeave: onMouseLeave,
      onBlur: onBlur,
      onDelegateShow: onDelegateShow,
      onDelegateHide: onDelegateHide
    };
  }

  /**
   * Creates and returns a new popper instance
   * @return {Popper}
   * @memberof Tippy
   * @private
   */
  function _createPopperInstance() {
    var _this7 = this;

    var popper = this.popper,
        reference = this.reference,
        options = this.options;

    var _getInnerElements4 = getInnerElements(popper),
        tooltip = _getInnerElements4.tooltip;

    var popperOptions = options.popperOptions;

    var arrowSelector = options.arrowType === 'round' ? selectors.ROUND_ARROW : selectors.ARROW;
    var arrow = tooltip.querySelector(arrowSelector);

    var config = _extends({
      placement: options.placement
    }, popperOptions || {}, {
      modifiers: _extends({}, popperOptions ? popperOptions.modifiers : {}, {
        arrow: _extends({
          element: arrowSelector
        }, popperOptions && popperOptions.modifiers ? popperOptions.modifiers.arrow : {}),
        flip: _extends({
          enabled: options.flip,
          padding: options.distance + 5 /* 5px from viewport boundary */
          , behavior: options.flipBehavior
        }, popperOptions && popperOptions.modifiers ? popperOptions.modifiers.flip : {}),
        offset: _extends({
          offset: options.offset
        }, popperOptions && popperOptions.modifiers ? popperOptions.modifiers.offset : {})
      }),
      onCreate: function onCreate() {
        tooltip.style[getPopperPlacement(popper)] = getOffsetDistanceInPx(options.distance);

        if (arrow && options.arrowTransform) {
          computeArrowTransform(popper, arrow, options.arrowTransform);
        }
      },
      onUpdate: function onUpdate() {
        var styles = tooltip.style;
        styles.top = '';
        styles.bottom = '';
        styles.left = '';
        styles.right = '';
        styles[getPopperPlacement(popper)] = getOffsetDistanceInPx(options.distance);

        if (arrow && options.arrowTransform) {
          computeArrowTransform(popper, arrow, options.arrowTransform);
        }
      }
    });

    _addMutationObserver.call(this, {
      target: popper,
      callback: function callback() {
        _this7.popperInstance.update();
      },
      options: {
        childList: true,
        subtree: true,
        characterData: true
      }
    });

    return new Popper(reference, popper, config);
  }

  /**
   * Appends the popper element to the DOM, updating or creating the popper instance
   * @param {Function} callback
   * @memberof Tippy
   * @private
   */
  function _mount(callback) {
    var options = this.options;

    if (!this.popperInstance) {
      this.popperInstance = _createPopperInstance.call(this);
      if (!options.livePlacement) {
        this.popperInstance.disableEventListeners();
      }
    } else {
      this.popperInstance.scheduleUpdate();
      if (options.livePlacement && !_hasFollowCursorBehavior.call(this)) {
        this.popperInstance.enableEventListeners();
      }
    }

    // If the instance previously had followCursor behavior, it will be positioned incorrectly
    // if triggered by `focus` afterwards - update the reference back to the real DOM element
    if (!_hasFollowCursorBehavior.call(this)) {
      var _getInnerElements5 = getInnerElements(this.popper),
          arrow = _getInnerElements5.arrow;

      if (arrow) arrow.style.margin = '';
      this.popperInstance.reference = this.reference;
    }

    updatePopperPosition(this.popperInstance, callback, true);

    if (!options.appendTo.contains(this.popper)) {
      options.appendTo.appendChild(this.popper);
    }
  }

  /**
   * Clears the show and hide delay timeouts
   * @memberof Tippy
   * @private
   */
  function _clearDelayTimeouts() {
    var _ref = this._(key),
        showTimeout = _ref.showTimeout,
        hideTimeout = _ref.hideTimeout;

    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
  }

  /**
   * Sets the mousemove event listener function for `followCursor` option
   * @memberof Tippy
   * @private
   */
  function _setFollowCursorListener() {
    var _this8 = this;

    this._(key).followCursorListener = function (event) {
      var _$lastMouseMoveEvent = _this8._(key).lastMouseMoveEvent = event,
          clientX = _$lastMouseMoveEvent.clientX,
          clientY = _$lastMouseMoveEvent.clientY;

      if (!_this8.popperInstance) return;

      _this8.popperInstance.reference = {
        getBoundingClientRect: function getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            top: clientY,
            left: clientX,
            right: clientX,
            bottom: clientY
          };
        },
        clientWidth: 0,
        clientHeight: 0
      };

      _this8.popperInstance.scheduleUpdate();
    };
  }

  /**
   * Updates the popper's position on each animation frame
   * @memberof Tippy
   * @private
   */
  function _makeSticky() {
    var _this9 = this;

    var applyTransitionDuration$$1 = function applyTransitionDuration$$1() {
      _this9.popper.style[prefix('transitionDuration')] = _this9.options.updateDuration + 'ms';
    };

    var removeTransitionDuration = function removeTransitionDuration() {
      _this9.popper.style[prefix('transitionDuration')] = '';
    };

    var updatePosition = function updatePosition() {
      if (_this9.popperInstance) {
        _this9.popperInstance.update();
      }

      applyTransitionDuration$$1();

      if (_this9.state.visible) {
        requestAnimationFrame(updatePosition);
      } else {
        removeTransitionDuration();
      }
    };

    updatePosition();
  }

  /**
   * Adds a mutation observer to an element and stores it in the instance
   * @param {Object}
   * @memberof Tippy
   * @private
   */
  function _addMutationObserver(_ref2) {
    var target = _ref2.target,
        callback = _ref2.callback,
        options = _ref2.options;

    if (!window.MutationObserver) return;

    var observer = new MutationObserver(callback);
    observer.observe(target, options);

    this._(key).mutationObservers.push(observer);
  }

  /**
   * Fires the callback functions once the CSS transition ends for `show` and `hide` methods
   * @param {Number} duration
   * @param {Function} callback - callback function to fire once transition completes
   * @memberof Tippy
   * @private
   */
  function _onTransitionEnd(duration, callback) {
    // Make callback synchronous if duration is 0
    if (!duration) {
      return callback();
    }

    var _getInnerElements6 = getInnerElements(this.popper),
        tooltip = _getInnerElements6.tooltip;

    var toggleListeners = function toggleListeners(action, listener) {
      if (!listener) return;
      tooltip[action + 'EventListener']('ontransitionend' in window ? 'transitionend' : 'webkitTransitionEnd', listener);
    };

    var listener = function listener(e) {
      if (e.target === tooltip) {
        toggleListeners('remove', listener);
        callback();
      }
    };

    toggleListeners('remove', this._(key).transitionendListener);
    toggleListeners('add', listener);

    this._(key).transitionendListener = listener;
  }

  var idCounter = 1;

  /**
   * Creates tooltips for each reference element
   * @param {Element[]} els
   * @param {Object} config
   * @return {Tippy[]} Array of Tippy instances
   */
  function createTooltips(els, config) {
    return els.reduce(function (acc, reference) {
      var id = idCounter;

      var options = evaluateOptions(reference, config.performance ? config : getIndividualOptions(reference, config));

      var title = reference.getAttribute('title');

      // Don't create an instance when:
      // * the `title` attribute is falsy (null or empty string), and
      // * it's not a delegate for tooltips, and
      // * there is no html template specified, and
      // * `dynamicTitle` option is false
      if (!title && !options.target && !options.html && !options.dynamicTitle) {
        return acc;
      }

      // Delegates should be highlighted as different
      reference.setAttribute(options.target ? 'data-tippy-delegate' : 'data-tippy', '');

      removeTitle(reference);

      var popper = createPopperElement(id, title, options);

      var tippy = new Tippy({
        id: id,
        reference: reference,
        popper: popper,
        options: options,
        title: title,
        popperInstance: null
      });

      if (options.createPopperInstanceOnInit) {
        tippy.popperInstance = _createPopperInstance.call(tippy);
        tippy.popperInstance.disableEventListeners();
      }

      var listeners = _getEventListeners.call(tippy);
      tippy.listeners = options.trigger.trim().split(' ').reduce(function (acc, eventType) {
        return acc.concat(createTrigger(eventType, reference, listeners, options));
      }, []);

      // Update tooltip content whenever the title attribute on the reference changes
      if (options.dynamicTitle) {
        _addMutationObserver.call(tippy, {
          target: reference,
          callback: function callback() {
            var _getInnerElements = getInnerElements(popper),
                content = _getInnerElements.content;

            var title = reference.getAttribute('title');
            if (title) {
              content[options.allowTitleHTML ? 'innerHTML' : 'textContent'] = tippy.title = title;
              removeTitle(reference);
            }
          },

          options: {
            attributes: true
          }
        });
      }

      // Shortcuts
      reference._tippy = tippy;
      popper._tippy = tippy;
      popper._reference = reference;

      acc.push(tippy);

      idCounter++;

      return acc;
    }, []);
  }

  /**
   * Hides all poppers
   * @param {Tippy} excludeTippy - tippy to exclude if needed
   */
  function hideAllPoppers(excludeTippy) {
    var poppers = toArray(document.querySelectorAll(selectors.POPPER));

    poppers.forEach(function (popper) {
      var tippy = popper._tippy;
      if (!tippy) return;

      var options = tippy.options;

      if ((options.hideOnClick === true || options.trigger.indexOf('focus') > -1) && (!excludeTippy || popper !== excludeTippy.popper)) {
        tippy.hide();
      }
    });
  }

  /**
   * Adds the needed event listeners
   */
  function bindEventListeners() {
    var onDocumentTouch = function onDocumentTouch() {
      if (browser.usingTouch) return;

      browser.usingTouch = true;

      if (browser.iOS) {
        document.body.classList.add('tippy-touch');
      }

      if (browser.dynamicInputDetection && window.performance) {
        document.addEventListener('mousemove', onDocumentMouseMove);
      }

      browser.onUserInputChange('touch');
    };

    var onDocumentMouseMove = function () {
      var time = void 0;

      return function () {
        var now = performance.now();

        // Chrome 60+ is 1 mousemove per animation frame, use 20ms time difference
        if (now - time < 20) {
          browser.usingTouch = false;
          document.removeEventListener('mousemove', onDocumentMouseMove);
          if (!browser.iOS) {
            document.body.classList.remove('tippy-touch');
          }
          browser.onUserInputChange('mouse');
        }

        time = now;
      };
    }();

    var onDocumentClick = function onDocumentClick(event) {
      // Simulated events dispatched on the document
      if (!(event.target instanceof Element)) {
        return hideAllPoppers();
      }

      var reference = closest(event.target, selectors.REFERENCE);
      var popper = closest(event.target, selectors.POPPER);

      if (popper && popper._tippy && popper._tippy.options.interactive) {
        return;
      }

      if (reference && reference._tippy) {
        var options = reference._tippy.options;

        var isClickTrigger = options.trigger.indexOf('click') > -1;
        var isMultiple = options.multiple;

        // Hide all poppers except the one belonging to the element that was clicked
        if (!isMultiple && browser.usingTouch || !isMultiple && isClickTrigger) {
          return hideAllPoppers(reference._tippy);
        }

        if (options.hideOnClick !== true || isClickTrigger) {
          return;
        }
      }

      hideAllPoppers();
    };

    var onWindowBlur = function onWindowBlur() {
      var _document = document,
          el = _document.activeElement;

      if (el && el.blur && matches$1.call(el, selectors.REFERENCE)) {
        el.blur();
      }
    };

    var onWindowResize = function onWindowResize() {
      toArray(document.querySelectorAll(selectors.POPPER)).forEach(function (popper) {
        var tippyInstance = popper._tippy;
        if (tippyInstance && !tippyInstance.options.livePlacement) {
          tippyInstance.popperInstance.scheduleUpdate();
        }
      });
    };

    document.addEventListener('click', onDocumentClick);
    document.addEventListener('touchstart', onDocumentTouch);
    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('resize', onWindowResize);

    if (!browser.supportsTouch && (navigator.maxTouchPoints || navigator.msMaxTouchPoints)) {
      document.addEventListener('pointerdown', onDocumentTouch);
    }
  }

  var eventListenersBound = false;

  /**
   * Exported module
   * @param {String|Element|Element[]|NodeList|Object} selector
   * @param {Object} options
   * @param {Boolean} one - create one tooltip
   * @return {Object}
   */
  function tippy$1(selector, options, one) {
    if (browser.supported && !eventListenersBound) {
      bindEventListeners();
      eventListenersBound = true;
    }

    if (isObjectLiteral(selector)) {
      polyfillVirtualReferenceProps(selector);
    }

    options = _extends({}, defaults, options);

    var references = getArrayOfElements(selector);
    var firstReference = references[0];

    return {
      selector: selector,
      options: options,
      tooltips: browser.supported ? createTooltips(one && firstReference ? [firstReference] : references, options) : [],
      destroyAll: function destroyAll() {
        this.tooltips.forEach(function (tooltip) {
          return tooltip.destroy();
        });
        this.tooltips = [];
      }
    };
  }

  tippy$1.version = version;
  tippy$1.browser = browser;
  tippy$1.defaults = defaults;
  tippy$1.one = function (selector, options) {
    return tippy$1(selector, options, true).tooltips[0];
  };
  tippy$1.disableAnimations = function () {
    defaults.updateDuration = defaults.duration = 0;
    defaults.animateFill = false;
  };

  return tippy$1;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[81])(81)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9kb21yZWFkeS9yZWFkeS5qcyIsIm5vZGVfbW9kdWxlcy9lbGVtZW50LWNsb3Nlc3QvZWxlbWVudC1jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvYmVoYXZpb3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvY29tcG9zZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9kZWxlZ2F0ZUFsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9kZWxlZ2F0ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9vbmNlL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWNjb3JkaW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jb2xsYXBzZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvaW5kZXguanMiLCJzcmMvanMvY29tcG9uZW50cy9tb2RhbC5qcyIsInNyYy9qcy9jb21wb25lbnRzL25hdmlnYXRpb24uanMiLCJzcmMvanMvY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JlZ2V4LWlucHV0LW1hc2suanMiLCJzcmMvanMvY29tcG9uZW50cy9za2lwbmF2LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90b29sdGlwLmpzIiwic3JjL2pzL2NvbmZpZy5qcyIsInNyYy9qcy9ka2Zkcy5qcyIsInNyYy9qcy9ldmVudHMuanMiLCJzcmMvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwic3JjL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInNyYy9qcy91dGlscy9iZWhhdmlvci5qcyIsInNyYy9qcy91dGlscy9jbG9zZXN0LmpzIiwic3JjL2pzL3V0aWxzL2lzLWluLXZpZXdwb3J0LmpzIiwic3JjL2pzL3V0aWxzL3NlbGVjdC5qcyIsInNyYy9qcy91dGlscy90b2dnbGUuanMiLCJzcmMvdmVuZG9yL3RpcHB5anMvdGlwcHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxPQUFULENBQWtCLEdBQWxCLEVBQXVCLFFBQXZCLEVBQWlDLE9BQWpDLEVBQTBDO0FBQ3ZELFFBQUksSUFBSSxPQUFSLEVBQWlCO0FBQ2IsWUFBSSxPQUFKLENBQVksUUFBWixFQUFzQixPQUF0QjtBQUNBO0FBQ0g7QUFDRCxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksSUFBSSxNQUF4QixFQUFnQyxLQUFHLENBQW5DLEVBQXNDO0FBQ2xDLGlCQUFTLElBQVQsQ0FBYyxPQUFkLEVBQXVCLElBQUksQ0FBSixDQUF2QixFQUErQixDQUEvQixFQUFrQyxHQUFsQztBQUNIO0FBQ0osQ0FSRDs7Ozs7QUNiQTs7Ozs7Ozs7O0FBU0E7O0FBRUE7O0FBRUEsSUFBSSxjQUFjLE9BQU8sSUFBekIsRUFBK0I7O0FBRS9CO0FBQ0E7QUFDQSxLQUFJLEVBQUUsZUFBZSxTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBakIsS0FDQSxTQUFTLGVBQVQsSUFBNEIsRUFBRSxlQUFlLFNBQVMsZUFBVCxDQUF5Qiw0QkFBekIsRUFBc0QsR0FBdEQsQ0FBakIsQ0FEaEMsRUFDOEc7O0FBRTdHLGFBQVUsSUFBVixFQUFnQjs7QUFFakI7O0FBRUEsT0FBSSxFQUFFLGFBQWEsSUFBZixDQUFKLEVBQTBCOztBQUUxQixPQUNHLGdCQUFnQixXQURuQjtBQUFBLE9BRUcsWUFBWSxXQUZmO0FBQUEsT0FHRyxlQUFlLEtBQUssT0FBTCxDQUFhLFNBQWIsQ0FIbEI7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bUIsUUFBbkI7QUFDQSxVQUFRLEdBQVIsR0FBYyxVQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkI7QUFDekMsV0FBTyxRQUFRLFFBQVIsRUFBa0IsT0FBbEIsRUFBMkIsSUFBM0IsRUFBaUMsUUFBakMsQ0FBMEMsQ0FBMUMsQ0FBUDtBQUNELEdBRkQ7QUFHQSxVQUFRLGlCQUFSLEdBQTRCLFlBQVk7QUFDdEMsYUFBUyxjQUFULEdBQTBCLFNBQVMsUUFBVCxHQUFvQixDQUE5QztBQUNBLGFBQVMsV0FBVCxHQUF1QixLQUF2QjtBQUNELEdBSEQ7O0FBS0EsU0FBTyxPQUFQO0FBRUMsQ0E3cElBLENBQUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIGFycmF5LWZvcmVhY2hcbiAqICAgQXJyYXkjZm9yRWFjaCBwb255ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnNcbiAqICAgKFBvbnlmaWxsOiBBIHBvbHlmaWxsIHRoYXQgZG9lc24ndCBvdmVyd3JpdGUgdGhlIG5hdGl2ZSBtZXRob2QpXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LTIwMTYgVGFrdXRvIFdhZGFcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2gvYmxvYi9tYXN0ZXIvTUlULUxJQ0VOU0VcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2ggKGFyeSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBpZiAoYXJ5LmZvckVhY2gpIHtcbiAgICAgICAgYXJ5LmZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSs9MSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGFyeVtpXSwgaSwgYXJ5KTtcbiAgICB9XG59O1xuIiwiLypcbiAqIGNsYXNzTGlzdC5qczogQ3Jvc3MtYnJvd3NlciBmdWxsIGVsZW1lbnQuY2xhc3NMaXN0IGltcGxlbWVudGF0aW9uLlxuICogMS4xLjIwMTcwNDI3XG4gKlxuICogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxuICogTGljZW5zZTogRGVkaWNhdGVkIHRvIHRoZSBwdWJsaWMgZG9tYWluLlxuICogICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG4vKmdsb2JhbCBzZWxmLCBkb2N1bWVudCwgRE9NRXhjZXB0aW9uICovXG5cbi8qISBAc291cmNlIGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvY2xhc3NMaXN0LmpzICovXG5cbmlmIChcImRvY3VtZW50XCIgaW4gd2luZG93LnNlbGYpIHtcblxuLy8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxuLy8gSW5jbHVkaW5nIElFIDwgRWRnZSBtaXNzaW5nIFNWR0VsZW1lbnQuY2xhc3NMaXN0XG5pZiAoIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpKSBcblx0fHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKSkpIHtcblxuKGZ1bmN0aW9uICh2aWV3KSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5pZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcblxudmFyXG5cdCAgY2xhc3NMaXN0UHJvcCA9IFwiY2xhc3NMaXN0XCJcblx0LCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG5cdCwgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF1cblx0LCBvYmpDdHIgPSBPYmplY3Rcblx0LCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIik7XG5cdH1cblx0LCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIGkgPSAwXG5cdFx0XHQsIGxlbiA9IHRoaXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cdC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xuXHQsIERPTUV4ID0gZnVuY3Rpb24gKHR5cGUsIG1lc3NhZ2UpIHtcblx0XHR0aGlzLm5hbWUgPSB0eXBlO1xuXHRcdHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9XG5cdCwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcblx0XHRpZiAodG9rZW4gPT09IFwiXCIpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIlNZTlRBWF9FUlJcIlxuXHRcdFx0XHQsIFwiQW4gaW52YWxpZCBvciBpbGxlZ2FsIHN0cmluZyB3YXMgc3BlY2lmaWVkXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCJcblx0XHRcdFx0LCBcIlN0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3RlclwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xuXHR9XG5cdCwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxuXHRcdFx0LCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cblx0XHRcdCwgaSA9IDBcblx0XHRcdCwgbGVuID0gY2xhc3Nlcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0dGhpcy5wdXNoKGNsYXNzZXNbaV0pO1xuXHRcdH1cblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMudG9TdHJpbmcoKSk7XG5cdFx0fTtcblx0fVxuXHQsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxuXHQsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IENsYXNzTGlzdCh0aGlzKTtcblx0fVxuO1xuLy8gTW9zdCBET01FeGNlcHRpb24gaW1wbGVtZW50YXRpb25zIGRvbid0IGFsbG93IGNhbGxpbmcgRE9NRXhjZXB0aW9uJ3MgdG9TdHJpbmcoKVxuLy8gb24gbm9uLURPTUV4Y2VwdGlvbnMuIEVycm9yJ3MgdG9TdHJpbmcoKSBpcyBzdWZmaWNpZW50IGhlcmUuXG5ET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcbmNsYXNzTGlzdFByb3RvLml0ZW0gPSBmdW5jdGlvbiAoaSkge1xuXHRyZXR1cm4gdGhpc1tpXSB8fCBudWxsO1xufTtcbmNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cdHJldHVybiBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pICE9PSAtMTtcbn07XG5jbGFzc0xpc3RQcm90by5hZGQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xuXHRcdFx0dGhpcy5wdXNoKHRva2VuKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHRcdCwgaW5kZXhcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR3aGlsZSAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHR0aGlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cblx0dmFyXG5cdFx0ICByZXN1bHQgPSB0aGlzLmNvbnRhaW5zKHRva2VuKVxuXHRcdCwgbWV0aG9kID0gcmVzdWx0ID9cblx0XHRcdGZvcmNlICE9PSB0cnVlICYmIFwicmVtb3ZlXCJcblx0XHQ6XG5cdFx0XHRmb3JjZSAhPT0gZmFsc2UgJiYgXCJhZGRcIlxuXHQ7XG5cblx0aWYgKG1ldGhvZCkge1xuXHRcdHRoaXNbbWV0aG9kXSh0b2tlbik7XG5cdH1cblxuXHRpZiAoZm9yY2UgPT09IHRydWUgfHwgZm9yY2UgPT09IGZhbHNlKSB7XG5cdFx0cmV0dXJuIGZvcmNlO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiAhcmVzdWx0O1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmpvaW4oXCIgXCIpO1xufTtcblxuaWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xuXHR2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XG5cdFx0ICBnZXQ6IGNsYXNzTGlzdEdldHRlclxuXHRcdCwgZW51bWVyYWJsZTogdHJ1ZVxuXHRcdCwgY29uZmlndXJhYmxlOiB0cnVlXG5cdH07XG5cdHRyeSB7XG5cdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHR9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcblx0XHQvLyBhZGRpbmcgdW5kZWZpbmVkIHRvIGZpZ2h0IHRoaXMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2lzc3Vlcy8zNlxuXHRcdC8vIG1vZGVybmllIElFOC1NU1c3IG1hY2hpbmUgaGFzIElFOCA4LjAuNjAwMS4xODcwMiBhbmQgaXMgYWZmZWN0ZWRcblx0XHRpZiAoZXgubnVtYmVyID09PSB1bmRlZmluZWQgfHwgZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xuXHRcdFx0Y2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuXHRcdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHRcdH1cblx0fVxufSBlbHNlIGlmIChvYmpDdHJbcHJvdG9Qcm9wXS5fX2RlZmluZUdldHRlcl9fKSB7XG5cdGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XG59XG5cbn0od2luZG93LnNlbGYpKTtcblxufVxuXG4vLyBUaGVyZSBpcyBmdWxsIG9yIHBhcnRpYWwgbmF0aXZlIGNsYXNzTGlzdCBzdXBwb3J0LCBzbyBqdXN0IGNoZWNrIGlmIHdlIG5lZWRcbi8vIHRvIG5vcm1hbGl6ZSB0aGUgYWRkL3JlbW92ZSBhbmQgdG9nZ2xlIEFQSXMuXG5cbihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpO1xuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjMVwiLCBcImMyXCIpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMC8xMSBhbmQgRmlyZWZveCA8MjYsIHdoZXJlIGNsYXNzTGlzdC5hZGQgYW5kXG5cdC8vIGNsYXNzTGlzdC5yZW1vdmUgZXhpc3QgYnV0IHN1cHBvcnQgb25seSBvbmUgYXJndW1lbnQgYXQgYSB0aW1lLlxuXHRpZiAoIXRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMyXCIpKSB7XG5cdFx0dmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdO1xuXG5cdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih0b2tlbikge1xuXHRcdFx0XHR2YXIgaSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0XHR0b2tlbiA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdFx0XHRvcmlnaW5hbC5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdGNyZWF0ZU1ldGhvZCgnYWRkJyk7XG5cdFx0Y3JlYXRlTWV0aG9kKCdyZW1vdmUnKTtcblx0fVxuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJjM1wiLCBmYWxzZSk7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwIGFuZCBGaXJlZm94IDwyNCwgd2hlcmUgY2xhc3NMaXN0LnRvZ2dsZSBkb2VzIG5vdFxuXHQvLyBzdXBwb3J0IHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdGlmICh0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjM1wiKSkge1xuXHRcdHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XG5cblx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKHRva2VuLCBmb3JjZSkge1xuXHRcdFx0aWYgKDEgaW4gYXJndW1lbnRzICYmICF0aGlzLmNvbnRhaW5zKHRva2VuKSA9PT0gIWZvcmNlKSB7XG5cdFx0XHRcdHJldHVybiBmb3JjZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBfdG9nZ2xlLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fVxuXG5cdHRlc3RFbGVtZW50ID0gbnVsbDtcbn0oKSk7XG5cbn1cbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuQXJyYXkuZnJvbTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5hc3NpZ247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjUuNycgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBpbmRleCwgdmFsdWUpIHtcbiAgaWYgKGluZGV4IGluIG9iamVjdCkgJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV07XG4gIHZhciBleHBvcnRzID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XG4gIHZhciBleHBQcm90byA9IGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pO1xuICB2YXIga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZiAoSVNfR0xPQkFMKSBzb3VyY2UgPSBuYW1lO1xuICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGV4cCA9IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICBpZiAodGFyZ2V0KSByZWRlZmluZSh0YXJnZXQsIGtleSwgb3V0LCB0eXBlICYgJGV4cG9ydC5VKTtcbiAgICAvLyBleHBvcnRcbiAgICBpZiAoZXhwb3J0c1trZXldICE9IG91dCkgaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYgKElTX1BST1RPICYmIGV4cFByb3RvW2tleV0gIT0gb3V0KSBleHBQcm90b1trZXldID0gb3V0O1xuICB9XG59O1xuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTtcbiIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyICRpdGVyQ3JlYXRlID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBCVUdHWSA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKTsgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxudmFyIEZGX0lURVJBVE9SID0gJ0BAaXRlcmF0b3InO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgaWYgKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKSByZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgdmFyIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFUztcbiAgdmFyIFZBTFVFU19CVUcgPSBmYWxzZTtcbiAgdmFyIHByb3RvID0gQmFzZS5wcm90b3R5cGU7XG4gIHZhciAkbmF0aXZlID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdO1xuICB2YXIgJGRlZmF1bHQgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKTtcbiAgdmFyICRlbnRyaWVzID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZDtcbiAgdmFyICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlO1xuICB2YXIgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZiAoJGFueU5hdGl2ZSkge1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUgJiYgSXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmICghTElCUkFSWSAmJiB0eXBlb2YgSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdICE9ICdmdW5jdGlvbicpIGhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSkge1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gPSByZXR1cm5UaGlzO1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChrZXkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKCEoa2V5IGluIHByb3RvKSkgcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcbiIsInZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uICgpIHsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRocm93LWxpdGVyYWxcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjLCBza2lwQ2xvc2luZykge1xuICBpZiAoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gWzddO1xuICAgIHZhciBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgZG9uZTogc2FmZSA9IHRydWUgfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyICRhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgUyA9IFN5bWJvbCgpO1xuICB2YXIgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUID0gdG9PYmplY3QodGFyZ2V0KTtcbiAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAxO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgdmFyIGlzRW51bSA9IHBJRS5mO1xuICB3aGlsZSAoYUxlbiA+IGluZGV4KSB7XG4gICAgdmFyIFMgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgdmFyIGtleXMgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikgaWYgKGlzRW51bS5jYWxsKFMsIGtleSA9IGtleXNbaisrXSkpIFRba2V5XSA9IFNba2V5XTtcbiAgfSByZXR1cm4gVDtcbn0gOiAkYXNzaWduO1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IGdldEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgUDtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFNSQyA9IHJlcXVpcmUoJy4vX3VpZCcpKCdzcmMnKTtcbnZhciBUT19TVFJJTkcgPSAndG9TdHJpbmcnO1xudmFyICR0b1N0cmluZyA9IEZ1bmN0aW9uW1RPX1NUUklOR107XG52YXIgVFBMID0gKCcnICsgJHRvU3RyaW5nKS5zcGxpdChUT19TVFJJTkcpO1xuXG5yZXF1aXJlKCcuL19jb3JlJykuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsLCBzYWZlKSB7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgJ25hbWUnKSB8fCBoaWRlKHZhbCwgJ25hbWUnLCBrZXkpO1xuICBpZiAoT1trZXldID09PSB2YWwpIHJldHVybjtcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsIFNSQykgfHwgaGlkZSh2YWwsIFNSQywgT1trZXldID8gJycgKyBPW2tleV0gOiBUUEwuam9pbihTdHJpbmcoa2V5KSkpO1xuICBpZiAoTyA9PT0gZ2xvYmFsKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKCFzYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfSBlbHNlIGlmIChPW2tleV0pIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzW1NSQ10gfHwgJHRvU3RyaW5nLmNhbGwodGhpcyk7XG59KTtcbiIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgdGFnLCBzdGF0KSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSBkZWYoaXQsIFRBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWcgfSk7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246IGNvcmUudmVyc2lvbixcbiAgbW9kZTogcmVxdWlyZSgnLi9fbGlicmFyeScpID8gJ3B1cmUnIDogJ2dsb2JhbCcsXG4gIGNvcHlyaWdodDogJ8KpIDIwMTggRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknXG59KTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikgeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgbWFwZm4gPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYgKG1hcHBpbmcpIG1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYgKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDKCk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvciAocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHsgYXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJykgfSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIi8qIVxuICAqIGRvbXJlYWR5IChjKSBEdXN0aW4gRGlheiAyMDE0IC0gTGljZW5zZSBNSVRcbiAgKi9cbiFmdW5jdGlvbiAobmFtZSwgZGVmaW5pdGlvbikge1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIHRoaXNbbmFtZV0gPSBkZWZpbml0aW9uKClcblxufSgnZG9tcmVhZHknLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGZucyA9IFtdLCBsaXN0ZW5lclxuICAgICwgZG9jID0gZG9jdW1lbnRcbiAgICAsIGhhY2sgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsXG4gICAgLCBkb21Db250ZW50TG9hZGVkID0gJ0RPTUNvbnRlbnRMb2FkZWQnXG4gICAgLCBsb2FkZWQgPSAoaGFjayA/IC9ebG9hZGVkfF5jLyA6IC9ebG9hZGVkfF5pfF5jLykudGVzdChkb2MucmVhZHlTdGF0ZSlcblxuXG4gIGlmICghbG9hZGVkKVxuICBkb2MuYWRkRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lcilcbiAgICBsb2FkZWQgPSAxXG4gICAgd2hpbGUgKGxpc3RlbmVyID0gZm5zLnNoaWZ0KCkpIGxpc3RlbmVyKClcbiAgfSlcblxuICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgbG9hZGVkID8gc2V0VGltZW91dChmbiwgMCkgOiBmbnMucHVzaChmbilcbiAgfVxuXG59KTtcbiIsIi8vIGVsZW1lbnQtY2xvc2VzdCB8IENDMC0xLjAgfCBnaXRodWIuY29tL2pvbmF0aGFudG5lYWwvY2xvc2VzdFxuXG4oZnVuY3Rpb24gKEVsZW1lbnRQcm90bykge1xuXHRpZiAodHlwZW9mIEVsZW1lbnRQcm90by5tYXRjaGVzICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0RWxlbWVudFByb3RvLm1hdGNoZXMgPSBFbGVtZW50UHJvdG8ubXNNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudFByb3RvLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50UHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGZ1bmN0aW9uIG1hdGNoZXMoc2VsZWN0b3IpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gdGhpcztcblx0XHRcdHZhciBlbGVtZW50cyA9IChlbGVtZW50LmRvY3VtZW50IHx8IGVsZW1lbnQub3duZXJEb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdFx0XHR2YXIgaW5kZXggPSAwO1xuXG5cdFx0XHR3aGlsZSAoZWxlbWVudHNbaW5kZXhdICYmIGVsZW1lbnRzW2luZGV4XSAhPT0gZWxlbWVudCkge1xuXHRcdFx0XHQrK2luZGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gQm9vbGVhbihlbGVtZW50c1tpbmRleF0pO1xuXHRcdH07XG5cdH1cblxuXHRpZiAodHlwZW9mIEVsZW1lbnRQcm90by5jbG9zZXN0ICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0RWxlbWVudFByb3RvLmNsb3Nlc3QgPSBmdW5jdGlvbiBjbG9zZXN0KHNlbGVjdG9yKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IHRoaXM7XG5cblx0XHRcdHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IDEpIHtcblx0XHRcdFx0aWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH07XG5cdH1cbn0pKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSk7XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuY29uc3QgZGVsZWdhdGUgPSByZXF1aXJlKCcuLi9kZWxlZ2F0ZScpO1xuY29uc3QgZGVsZWdhdGVBbGwgPSByZXF1aXJlKCcuLi9kZWxlZ2F0ZUFsbCcpO1xuXG5jb25zdCBERUxFR0FURV9QQVRURVJOID0gL14oLispOmRlbGVnYXRlXFwoKC4rKVxcKSQvO1xuY29uc3QgU1BBQ0UgPSAnICc7XG5cbmNvbnN0IGdldExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgdmFyIG1hdGNoID0gdHlwZS5tYXRjaChERUxFR0FURV9QQVRURVJOKTtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAobWF0Y2gpIHtcbiAgICB0eXBlID0gbWF0Y2hbMV07XG4gICAgc2VsZWN0b3IgPSBtYXRjaFsyXTtcbiAgfVxuXG4gIHZhciBvcHRpb25zO1xuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGNhcHR1cmU6IHBvcEtleShoYW5kbGVyLCAnY2FwdHVyZScpLFxuICAgICAgcGFzc2l2ZTogcG9wS2V5KGhhbmRsZXIsICdwYXNzaXZlJylcbiAgICB9O1xuICB9XG5cbiAgdmFyIGxpc3RlbmVyID0ge1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICBkZWxlZ2F0ZTogKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0JylcbiAgICAgID8gZGVsZWdhdGVBbGwoaGFuZGxlcilcbiAgICAgIDogc2VsZWN0b3JcbiAgICAgICAgPyBkZWxlZ2F0ZShzZWxlY3RvciwgaGFuZGxlcilcbiAgICAgICAgOiBoYW5kbGVyLFxuICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgfTtcblxuICBpZiAodHlwZS5pbmRleE9mKFNQQUNFKSA+IC0xKSB7XG4gICAgcmV0dXJuIHR5cGUuc3BsaXQoU1BBQ0UpLm1hcChmdW5jdGlvbihfdHlwZSkge1xuICAgICAgcmV0dXJuIGFzc2lnbih7dHlwZTogX3R5cGV9LCBsaXN0ZW5lcik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdGVuZXIudHlwZSA9IHR5cGU7XG4gICAgcmV0dXJuIFtsaXN0ZW5lcl07XG4gIH1cbn07XG5cbnZhciBwb3BLZXkgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgZGVsZXRlIG9ialtrZXldO1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJlaGF2aW9yKGV2ZW50cywgcHJvcHMpIHtcbiAgY29uc3QgbGlzdGVuZXJzID0gT2JqZWN0LmtleXMoZXZlbnRzKVxuICAgIC5yZWR1Y2UoZnVuY3Rpb24obWVtbywgdHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycyA9IGdldExpc3RlbmVycyh0eXBlLCBldmVudHNbdHlwZV0pO1xuICAgICAgcmV0dXJuIG1lbW8uY29uY2F0KGxpc3RlbmVycyk7XG4gICAgfSwgW10pO1xuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIGFkZDogZnVuY3Rpb24gYWRkQmVoYXZpb3IoZWxlbWVudCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGxpc3RlbmVyLnR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIuZGVsZWdhdGUsXG4gICAgICAgICAgbGlzdGVuZXIub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZUJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgcHJvcHMpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcG9zZShmdW5jdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25zLnNvbWUoZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpID09PSBmYWxzZTtcbiAgICB9LCB0aGlzKTtcbiAgfTtcbn07XG4iLCJjb25zdCBkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4uL2RlbGVnYXRlJyk7XG5jb25zdCBjb21wb3NlID0gcmVxdWlyZSgnLi4vY29tcG9zZScpO1xuXG5jb25zdCBTUExBVCA9ICcqJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZUFsbChzZWxlY3RvcnMpIHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHNlbGVjdG9ycylcblxuICAvLyBYWFggb3B0aW1pemF0aW9uOiBpZiB0aGVyZSBpcyBvbmx5IG9uZSBoYW5kbGVyIGFuZCBpdCBhcHBsaWVzIHRvXG4gIC8vIGFsbCBlbGVtZW50cyAodGhlIFwiKlwiIENTUyBzZWxlY3RvciksIHRoZW4ganVzdCByZXR1cm4gdGhhdFxuICAvLyBoYW5kbGVyXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMSAmJiBrZXlzWzBdID09PSBTUExBVCkge1xuICAgIHJldHVybiBzZWxlY3RvcnNbU1BMQVRdO1xuICB9XG5cbiAgY29uc3QgZGVsZWdhdGVzID0ga2V5cy5yZWR1Y2UoZnVuY3Rpb24obWVtbywgc2VsZWN0b3IpIHtcbiAgICBtZW1vLnB1c2goZGVsZWdhdGUoc2VsZWN0b3IsIHNlbGVjdG9yc1tzZWxlY3Rvcl0pKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfSwgW10pO1xuICByZXR1cm4gY29tcG9zZShkZWxlZ2F0ZXMpO1xufTtcbiIsIi8vIHBvbHlmaWxsIEVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3RcbnJlcXVpcmUoJ2VsZW1lbnQtY2xvc2VzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlKHNlbGVjdG9yLCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZGVsZWdhdGlvbihldmVudCkge1xuICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdChzZWxlY3Rvcik7XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGFyZ2V0LCBldmVudCk7XG4gICAgfVxuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbmNlKGxpc3RlbmVyLCBvcHRpb25zKSB7XG4gIHZhciB3cmFwcGVkID0gZnVuY3Rpb24gd3JhcHBlZE9uY2UoZSkge1xuICAgIGUuY3VycmVudFRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGUudHlwZSwgd3JhcHBlZCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIGxpc3RlbmVyLmNhbGwodGhpcywgZSk7XG4gIH07XG4gIHJldHVybiB3cmFwcGVkO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgdG9nZ2xlID0gcmVxdWlyZSgnLi4vdXRpbHMvdG9nZ2xlJyk7XG5jb25zdCBpc0VsZW1lbnRJblZpZXdwb3J0ID0gcmVxdWlyZSgnLi4vdXRpbHMvaXMtaW4tdmlld3BvcnQnKTtcbmNvbnN0IEJVVFRPTiA9IGAuYWNjb3JkaW9uLWJ1dHRvblthcmlhLWNvbnRyb2xzXWA7XG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcbmNvbnN0IE1VTFRJU0VMRUNUQUJMRSA9ICdhcmlhLW11bHRpc2VsZWN0YWJsZSc7XG5cbmNsYXNzIEFjY29yZGlvbntcbiAgY29uc3RydWN0b3IgKGFjY29yZGlvbil7XG4gICAgdGhpcy5hY2NvcmRpb24gPSBhY2NvcmRpb247XG4gICAgdGhpcy5idXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcbiAgICB0aGlzLmV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5hY2NvcmRpb24uY2xvc2UnKTtcbiAgICB0aGlzLmV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmFjY29yZGlvbi5vcGVuJyk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0ICgpe1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSsrKXtcbiAgICAgIGxldCBjdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zW2ldO1xuXG4gICAgICBsZXQgZXhwYW5kZWQgPSBjdXJyZW50QnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJztcbiAgICAgIHRoaXMudG9nZ2xlQnV0dG9uKGN1cnJlbnRCdXR0b24sIGV4cGFuZGVkKTtcblxuICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICBjdXJyZW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICB0aGF0LmV2ZW50T25DbGljayhldmVudCwgdGhpcyk7XG4gICAgICB9KTtcblxuICAgIH1cbiAgfVxuXG5cbiAgZXZlbnRPbkNsaWNrIChldmVudCwgYnV0dG9uKXtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMudG9nZ2xlQnV0dG9uKGJ1dHRvbik7XG4gICAgaWYgKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSAndHJ1ZScpIHtcbiAgICAgIC8vIFdlIHdlcmUganVzdCBleHBhbmRlZCwgYnV0IGlmIGFub3RoZXIgYWNjb3JkaW9uIHdhcyBhbHNvIGp1c3RcbiAgICAgIC8vIGNvbGxhcHNlZCwgd2UgbWF5IG5vIGxvbmdlciBiZSBpbiB0aGUgdmlld3BvcnQuIFRoaXMgZW5zdXJlc1xuICAgICAgLy8gdGhhdCB3ZSBhcmUgc3RpbGwgdmlzaWJsZSwgc28gdGhlIHVzZXIgaXNuJ3QgY29uZnVzZWQuXG4gICAgICBpZiAoIWlzRWxlbWVudEluVmlld3BvcnQoYnV0dG9uKSkgYnV0dG9uLnNjcm9sbEludG9WaWV3KCk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogVG9nZ2xlIGEgYnV0dG9uJ3MgXCJwcmVzc2VkXCIgc3RhdGUsIG9wdGlvbmFsbHkgcHJvdmlkaW5nIGEgdGFyZ2V0XG4gICAqIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cbiAgICogQHBhcmFtIHtib29sZWFuP30gZXhwYW5kZWQgSWYgbm8gc3RhdGUgaXMgcHJvdmlkZWQsIHRoZSBjdXJyZW50XG4gICAqIHN0YXRlIHdpbGwgYmUgdG9nZ2xlZCAoZnJvbSBmYWxzZSB0byB0cnVlLCBhbmQgdmljZS12ZXJzYSkuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IHRoZSByZXN1bHRpbmcgc3RhdGVcbiAgICovXG4gIHRvZ2dsZUJ1dHRvbiAoYnV0dG9uLCBleHBhbmRlZCkge1xuICAgIGlmICghdGhpcy5hY2NvcmRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihCVVRUT04rJyBpcyBtaXNzaW5nIG91dGVyIEFDQ09SRElPTicpO1xuICAgIH1cblxuICAgIGV4cGFuZGVkID0gdG9nZ2xlKGJ1dHRvbiwgZXhwYW5kZWQpO1xuXG4gICAgaWYoZXhwYW5kZWQpe1xuICAgICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudE9wZW4pO1xuICAgIH0gZWxzZXtcbiAgICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRDbG9zZSk7XG4gICAgfVxuXG4gICAgLy8gWFhYIG11bHRpc2VsZWN0YWJsZSBpcyBvcHQtaW4sIHRvIHByZXNlcnZlIGxlZ2FjeSBiZWhhdmlvclxuICAgIGNvbnN0IG11bHRpc2VsZWN0YWJsZSA9IHRoaXMuYWNjb3JkaW9uLmdldEF0dHJpYnV0ZShNVUxUSVNFTEVDVEFCTEUpID09PSAndHJ1ZSc7XG5cbiAgICBpZiAoZXhwYW5kZWQgJiYgIW11bHRpc2VsZWN0YWJsZSkge1xuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgY3VycmVudEJ1dHR0b24gPSB0aGlzLmJ1dHRvbnNbaV07XG4gICAgICAgIGlmIChjdXJyZW50QnV0dHRvbiAhPT0gYnV0dG9uKSB7XG4gICAgICAgICAgdG9nZ2xlKGN1cnJlbnRCdXR0dG9uLCBmYWxzZSk7XG4gICAgICAgICAgY3VycmVudEJ1dHR0b24uZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50Q2xvc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZVxuICAgKi9cbiAgc2hvd0J1dHRvbiAoYnV0dG9uKXtcbiAgICB0b2dnbGVCdXR0b24oYnV0dG9uLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gZmFsc2VcbiAgICovXG4gIGhpZGVCdXR0b24gKGJ1dHRvbikge1xuICAgIHRvZ2dsZUJ1dHRvbihidXR0b24sIGZhbHNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFjY29yZGlvbjtcbiIsIid1c2Ugc3RyaWN0JztcbmNsYXNzIENoZWNrYm94VG9nZ2xlQ29udGVudHtcbiAgICBjb25zdHJ1Y3RvcihlbCl7XG4gICAgICAgIHRoaXMuanNUb2dnbGVUcmlnZ2VyID0gJy5qcy1jaGVja2JveC10b2dnbGUtY29udGVudCc7XG4gICAgICAgIHRoaXMuanNUb2dnbGVUYXJnZXQgPSAnZGF0YS1qcy10YXJnZXQnO1xuICAgICAgICB0aGlzLmV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5jb2xsYXBzZS5jbG9zZScpO1xuICAgICAgICB0aGlzLmV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLm9wZW4nKTtcbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XG4gICAgICAgIHRoaXMuY2hlY2tib3hFbCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5pbml0KGVsKTtcbiAgICB9XG5cbiAgICBpbml0KGVsKXtcbiAgICAgICAgdGhpcy5jaGVja2JveEVsID0gZWw7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGVja2JveEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgdGhhdC50b2dnbGUodGhhdC5jaGVja2JveEVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudG9nZ2xlKHRoaXMuY2hlY2tib3hFbCk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKHRyaWdnZXJFbCl7XG4gICAgICAgIHZhciB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZSh0aGlzLmpzVG9nZ2xlVGFyZ2V0KVxuICAgICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldEF0dHIpO1xuICAgICAgICAgICAgaWYodGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgaWYodHJpZ2dlckVsLmNoZWNrZWQpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRPcGVuKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjbG9zZSh0cmlnZ2VyRWwsIHRhcmdldEVsKXtcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRDbG9zZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hlY2tib3hUb2dnbGVDb250ZW50O1xuIiwiLyoqXG4gKiBDb2xsYXBzZS9leHBhbmQuXG4gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIENvbGxhcHNlIHtcbiAgY29uc3RydWN0b3IgKGVsZW1lbnQsIGFjdGlvbiA9ICd0b2dnbGUnKXtcbiAgICB0aGlzLmpzQ29sbGFwc2VUYXJnZXQgPSAnZGF0YS1qcy10YXJnZXQnO1xuICAgIHRoaXMudHJpZ2dlckVsID0gZWxlbWVudDtcbiAgICB0aGlzLnRhcmdldEVsO1xuICAgIHRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5ldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2UuY2xvc2UnKTtcbiAgICB0aGlzLmV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLm9wZW4nKTtcbiAgICB0aGlzLnRyaWdnZXJFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpe1xuICAgICAgdGhhdC50b2dnbGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRvZ2dsZUNvbGxhcHNlIChmb3JjZUNsb3NlKSB7XG4gICAgbGV0IHRhcmdldEF0dHIgPSB0aGlzLnRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUodGhpcy5qc0NvbGxhcHNlVGFyZ2V0KTtcbiAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XG4gICAgICB0aGlzLnRhcmdldEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXRBdHRyKTtcbiAgICAgIGlmKHRoaXMudGFyZ2V0RWwgIT09IG51bGwgJiYgdGhpcy50YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgLy9jaGFuZ2Ugc3RhdGVcbiAgICAgICAgaWYodGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJyB8fCB0aGlzLnRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gdW5kZWZpbmVkIHx8IGZvcmNlQ2xvc2UgKXtcbiAgICAgICAgICAvL2Nsb3NlXG4gICAgICAgICAgdGhpcy5hbmltYXRlQ29sbGFwc2UoKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgLy9vcGVuXG4gICAgICAgICAgdGhpcy5hbmltYXRlRXhwYW5kKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0b2dnbGUgKCl7XG4gICAgaWYodGhpcy50cmlnZ2VyRWwgIT09IG51bGwgJiYgdGhpcy50cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICB0aGlzLnRvZ2dsZUNvbGxhcHNlKCk7XG4gICAgfVxuICB9XG5cblxuICBhbmltYXRlQ29sbGFwc2UgKCkge1xuICAgIGlmKCF0aGlzLmFuaW1hdGVJblByb2dyZXNzKXtcbiAgICAgIHRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xuXG4gICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLmhlaWdodCA9IHRoaXMudGFyZ2V0RWwuY2xpZW50SGVpZ2h0KyAncHgnO1xuICAgICAgdGhpcy50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZS10cmFuc2l0aW9uLWNvbGxhcHNlJyk7XG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpe1xuICAgICAgICB0aGF0LnRhcmdldEVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgIH0sIDUpO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcbiAgICAgICAgdGhhdC50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgdGhhdC50YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZS10cmFuc2l0aW9uLWNvbGxhcHNlJyk7XG5cbiAgICAgICAgdGhhdC50cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgIHRoYXQuYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgdGhhdC50cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGF0LmV2ZW50Q2xvc2UpO1xuICAgICAgfSwgMjAwKTtcbiAgICB9XG4gIH1cblxuICBhbmltYXRlRXhwYW5kICgpIHtcbiAgICBpZighdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyl7XG4gICAgICB0aGlzLmFuaW1hdGVJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgIHRoaXMudGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XG4gICAgICBsZXQgZXhwYW5kZWRIZWlnaHQgPSB0aGlzLnRhcmdldEVsLmNsaWVudEhlaWdodDtcbiAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUuaGVpZ2h0ID0gJzBweCc7XG4gICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlLXRyYW5zaXRpb24tZXhwYW5kJyk7XG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpe1xuICAgICAgICB0aGF0LnRhcmdldEVsLnN0eWxlLmhlaWdodCA9IGV4cGFuZGVkSGVpZ2h0KyAncHgnO1xuICAgICAgfSwgNSk7XG5cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCl7XG4gICAgICAgIHRoYXQudGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2UtdHJhbnNpdGlvbi1leHBhbmQnKTtcbiAgICAgICAgdGhhdC50YXJnZXRFbC5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG5cbiAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgICAgIHRoYXQudHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgIHRoYXQuYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgdGhhdC50cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGF0LmV2ZW50T3Blbik7XG4gICAgICB9LCAyMDApO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxhcHNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgY2xvc2VzdCA9IHJlcXVpcmUoJy4uL3V0aWxzL2Nsb3Nlc3QnKTtcblxuY2xhc3MgRHJvcGRvd24ge1xuICBjb25zdHJ1Y3RvciAoZWwpe1xuICAgIHRoaXMuanNEcm9wZG93blRyaWdnZXIgPSAnLmpzLWRyb3Bkb3duJztcbiAgICB0aGlzLmpzRHJvcGRvd25UYXJnZXQgPSAnZGF0YS1qcy10YXJnZXQnO1xuICAgIHRoaXMuZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLmNsb3NlJyk7XG4gICAgdGhpcy5ldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5vcGVuJyk7XG5cbiAgICAvL29wdGlvbjogbWFrZSBkcm9wZG93biBiZWhhdmUgYXMgdGhlIGNvbGxhcHNlIGNvbXBvbmVudCB3aGVuIG9uIHNtYWxsIHNjcmVlbnMgKHVzZWQgYnkgc3VibWVudXMgaW4gdGhlIGhlYWRlciBhbmQgc3RlcC1kcm9wZG93bikuXG4gICAgdGhpcy5uYXZSZXNwb25zaXZlQnJlYWtwb2ludCA9IDk5MjsgLy9zYW1lIGFzICRuYXYtcmVzcG9uc2l2ZS1icmVha3BvaW50IGZyb20gdGhlIHNjc3MuXG4gICAgdGhpcy50cmluZ3VpZGVCcmVha3BvaW50ID0gNzY4OyAvL3NhbWUgYXMgJG5hdi1yZXNwb25zaXZlLWJyZWFrcG9pbnQgZnJvbSB0aGUgc2Nzcy5cbiAgICB0aGlzLmpzUmVzcG9uc2l2ZUNvbGxhcHNlTW9kaWZpZXIgPSAnLmpzLWRyb3Bkb3duLS1yZXNwb25zaXZlLWNvbGxhcHNlJztcbiAgICB0aGlzLnJlc3BvbnNpdmVDb2xsYXBzZUVuYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gZmFsc2U7XG5cblxuICAgIHRoaXMudHJpZ2dlckVsID0gbnVsbDtcbiAgICB0aGlzLnRhcmdldEVsID0gbnVsbDtcblxuICAgIHRoaXMuaW5pdChlbCk7XG5cbiAgICBpZih0aGlzLnRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0aGlzLnRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudGFyZ2V0RWwgIT09IG51bGwgJiYgdGhpcy50YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcblxuXG4gICAgICBpZih0aGlzLnRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpKXtcbiAgICAgICAgdGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vQ2xpY2tlZCBvdXRzaWRlIGRyb3Bkb3duIC0+IGNsb3NlIGl0XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpe1xuICAgICAgICB0aGF0Lm91dHNpZGVDbG9zZShldmVudCk7XG4gICAgICB9KTtcblxuICAgICAgLy9DbGlja2VkIG9uIGRyb3Bkb3duIG9wZW4gYnV0dG9uIC0tPiB0b2dnbGUgaXRcbiAgICAgIHRoaXMudHJpZ2dlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KXtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7Ly9wcmV2ZW50cyBvdXNpZGUgY2xpY2sgbGlzdGVuZXIgZnJvbSB0cmlnZ2VyaW5nLlxuICAgICAgICB0aGF0LnRvZ2dsZURyb3Bkb3duKCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gc2V0IGFyaWEtaGlkZGVuIGNvcnJlY3RseSBmb3Igc2NyZWVucmVhZGVycyAoVHJpbmd1aWRlIHJlc3BvbnNpdmUpXG4gICAgICBpZih0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy50cmlnZ2VyRWw7XG4gICAgICAgIGlmICh3aW5kb3cuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpIHtcbiAgICAgICAgICAvLyB0cmlnZ2VyIGV2ZW50IHdoZW4gYnV0dG9uIGNoYW5nZXMgdmlzaWJpbGl0eVxuICAgICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihmdW5jdGlvbiAoZW50cmllcykge1xuICAgICAgICAgICAgLy8gYnV0dG9uIGlzIHZpc2libGVcbiAgICAgICAgICAgIGlmIChlbnRyaWVzWzBdLmludGVyc2VjdGlvblJhdGlvKSB7XG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGJ1dHRvbiBpcyBub3QgdmlzaWJsZVxuICAgICAgICAgICAgICBpZiAodGhhdC50YXJnZXRFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHJvb3Q6IGRvY3VtZW50LmJvZHlcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElFOiBJbnRlcnNlY3Rpb25PYnNlcnZlciBpcyBub3Qgc3VwcG9ydGVkLCBzbyB3ZSBsaXN0ZW4gZm9yIHdpbmRvdyByZXNpemUgYW5kIGdyaWQgYnJlYWtwb2ludCBpbnN0ZWFkXG4gICAgICAgICAgaWYgKHRoYXQuZG9SZXNwb25zaXZlU3RlcGd1aWRlQ29sbGFwc2UoKSkge1xuICAgICAgICAgICAgLy8gc21hbGwgc2NyZWVuXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZXtcbiAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBMYXJnZSBzY3JlZW5cbiAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGF0LmRvUmVzcG9uc2l2ZVN0ZXBndWlkZUNvbGxhcHNlKCkpIHtcbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgICAgfSBlbHNle1xuICAgICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgZXZ0ID0gZXZ0IHx8IHdpbmRvdy5ldmVudDtcbiAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSAyNykge1xuICAgICAgICAgIHRoYXQuY2xvc2VBbGwoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuXG4gIGluaXQgKGVsKXtcbiAgICB0aGlzLnRyaWdnZXJFbCA9IGVsO1xuICAgIGlmKHRoaXMudHJpZ2dlckVsICE9PSBudWxsICYmIHRoaXMudHJpZ2dlckVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgbGV0IHRhcmdldEF0dHIgPSB0aGlzLnRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUodGhpcy5qc0Ryb3Bkb3duVGFyZ2V0KTtcbiAgICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgbGV0IHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpKTtcbiAgICAgICAgaWYodGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgdGhpcy50YXJnZXRFbCA9IHRhcmdldEVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYodGhpcy50cmlnZ2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1kcm9wZG93bi0tcmVzcG9uc2l2ZS1jb2xsYXBzZScpKXtcbiAgICAgIHRoaXMucmVzcG9uc2l2ZUNvbGxhcHNlRW5hYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYodGhpcy50cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSl7XG4gICAgICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgfVxuXG4gIGNsb3NlQWxsICgpe1xuICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG5cbiAgICBsZXQgb3ZlcmZsb3dNZW51RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdvdmVyZmxvdy1tZW51Jyk7XG4gICAgbGV0IHRyaWdnZXJFbCA9IG51bGw7XG4gICAgbGV0IHRhcmdldEVsID0gbnVsbDtcbiAgICBmb3IgKGxldCBvaSA9IDA7IG9pIDwgb3ZlcmZsb3dNZW51RWwubGVuZ3RoOyBvaSsrKSB7XG4gICAgICBsZXQgY3VycmVudE92ZXJmbG93TWVudUVMID0gb3ZlcmZsb3dNZW51RWxbIG9pIF07XG4gICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5jaGlsZE5vZGVzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgIGlmIChjdXJyZW50T3ZlcmZsb3dNZW51RUwuY2hpbGROb2Rlc1sgYSBdLnRhZ05hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChjdXJyZW50T3ZlcmZsb3dNZW51RUwuY2hpbGROb2Rlc1sgYSBdLmNsYXNzTGlzdC5jb250YWlucygnanMtZHJvcGRvd24nKSkge1xuICAgICAgICAgICAgdHJpZ2dlckVsID0gY3VycmVudE92ZXJmbG93TWVudUVMLmNoaWxkTm9kZXNbIGEgXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRPdmVyZmxvd01lbnVFTC5jaGlsZE5vZGVzWyBhIF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LWlubmVyJykpIHtcbiAgICAgICAgICAgIHRhcmdldEVsID0gY3VycmVudE92ZXJmbG93TWVudUVMLmNoaWxkTm9kZXNbIGEgXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0YXJnZXRFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2JpbGVfbmF2LWFjdGl2ZScpKSB7XG4gICAgICAgICAgaWYgKCFjdXJyZW50T3ZlcmZsb3dNZW51RUwuY2xvc2VzdCgnLm5hdmJhcicpKSB7XG5cbiAgICAgICAgICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRDbG9zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09IHRydWUpe1xuICAgICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudENsb3NlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0b2dnbGVEcm9wZG93biAoZm9yY2VDbG9zZSkge1xuICAgIGlmKHRoaXMudHJpZ2dlckVsICE9PSBudWxsICYmIHRoaXMudHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGhpcy50YXJnZXRFbCAhPT0gbnVsbCAmJiB0aGlzLnRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgLy9jaGFuZ2Ugc3RhdGVcblxuICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5sZWZ0ID0gbnVsbDtcbiAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUucmlnaHQgPSBudWxsO1xuXG4gICAgICB2YXIgcmVjdCA9IHRoaXMudHJpZ2dlckVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgaWYodGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJyB8fCBmb3JjZUNsb3NlKXtcbiAgICAgICAgLy9jbG9zZVxuICAgICAgICB0aGlzLnRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgdGhpcy50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgdGhpcy50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50Q2xvc2UpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMuY2xvc2VBbGwoKTtcbiAgICAgICAgLy9vcGVuXG4gICAgICAgIHRoaXMudHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgIHRoaXMudGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XG4gICAgICAgIHRoaXMudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICB0aGlzLnRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRPcGVuKTtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMub2Zmc2V0KHRoaXMudGFyZ2V0RWwpXG5cbiAgICAgICAgaWYob2Zmc2V0LmxlZnQgPCAwKXtcbiAgICAgICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLmxlZnQgPSAnMHB4JztcbiAgICAgICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xuICAgICAgICB9XG4gICAgICAgIHZhciByaWdodCA9IG9mZnNldC5sZWZ0ICsgdGhpcy50YXJnZXRFbC5vZmZzZXRXaWR0aDtcbiAgICAgICAgaWYocmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCl7XG4gICAgICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xuICAgICAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnMHB4JztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvZmZzZXRBZ2FpbiA9IHRoaXMub2Zmc2V0KHRoaXMudGFyZ2V0RWwpO1xuXG4gICAgICAgIGlmKG9mZnNldEFnYWluLmxlZnQgPCAwKXtcblxuICAgICAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUubGVmdCA9ICcwcHgnO1xuICAgICAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XG4gICAgICAgIH1cbiAgICAgICAgcmlnaHQgPSBvZmZzZXRBZ2Fpbi5sZWZ0ICsgdGhpcy50YXJnZXRFbC5vZmZzZXRXaWR0aDtcbiAgICAgICAgaWYocmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCl7XG5cbiAgICAgICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLmxlZnQgPSAnYXV0byc7XG4gICAgICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5yaWdodCA9ICcwcHgnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG5cbiAgfVxuXG4gIG9mZnNldCAoZWwpIHtcbiAgICB2YXIgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgIHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgIHJldHVybiB7IHRvcDogcmVjdC50b3AgKyBzY3JvbGxUb3AsIGxlZnQ6IHJlY3QubGVmdCArIHNjcm9sbExlZnQgfVxuICB9XG5cblxuICBvdXRzaWRlQ2xvc2UgKGV2ZW50KXtcbiAgICBpZighdGhpcy5kb1Jlc3BvbnNpdmVDb2xsYXBzZSgpKXtcbiAgICAgIC8vY2xvc2VzIGRyb3Bkb3duIHdoZW4gY2xpY2tlZCBvdXRzaWRlLlxuICAgICAgbGV0IGRyb3Bkb3duRWxtID0gY2xvc2VzdChldmVudC50YXJnZXQsIHRoaXMudGFyZ2V0RWwuaWQpO1xuICAgICAgaWYoKGRyb3Bkb3duRWxtID09PSBudWxsIHx8IGRyb3Bkb3duRWxtID09PSB1bmRlZmluZWQpICYmIChldmVudC50YXJnZXQgIT09IHRoaXMudHJpZ2dlckVsKSl7XG4gICAgICAgIC8vY2xpY2tlZCBvdXRzaWRlIHRyaWdnZXIsIGZvcmNlIGNsb3NlXG4gICAgICAgIHRoaXMudG9nZ2xlRHJvcGRvd24odHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZG9SZXNwb25zaXZlQ29sbGFwc2UgKCl7XG4gICAgLy9yZXR1cm5zIHRydWUgaWYgcmVzcG9uc2l2ZSBjb2xsYXBzZSBpcyBlbmFibGVkIGFuZCB3ZSBhcmUgb24gYSBzbWFsbCBzY3JlZW4uXG4gICAgaWYoKHRoaXMucmVzcG9uc2l2ZUNvbGxhcHNlRW5hYmxlZCB8fCB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkKSAmJiB3aW5kb3cuaW5uZXJXaWR0aCA8PSB0aGlzLm5hdlJlc3BvbnNpdmVCcmVha3BvaW50KXtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZG9SZXNwb25zaXZlU3RlcGd1aWRlQ29sbGFwc2UgKCl7XG4gICAgLy9yZXR1cm5zIHRydWUgaWYgcmVzcG9uc2l2ZSBjb2xsYXBzZSBpcyBlbmFibGVkIGFuZCB3ZSBhcmUgb24gYSBzbWFsbCBzY3JlZW4uXG4gICAgaWYoKHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQpICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IHRoaXMudHJpbmd1aWRlQnJlYWtwb2ludCl7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRHJvcGRvd247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBuYXZpZ2F0aW9uOiByZXF1aXJlKCcuL25hdmlnYXRpb24nKSxcclxuICBza2lwbmF2OiAgICByZXF1aXJlKCcuL3NraXBuYXYnKSxcclxuICByZWdleG1hc2s6ICByZXF1aXJlKCcuL3JlZ2V4LWlucHV0LW1hc2snKVxyXG59O1xyXG4iLCJjbGFzcyBEaWFsb2d7XG5cbiAgY29uc3RydWN0b3IgKGVsZW1lbnQsIHNldEV2ZW50cyA9IGZhbHNlKXtcbiAgICB0aGlzLmRpYWxvZyA9IGVsZW1lbnQ7XG5cbiAgICB0aGlzLm9wZW5FdmVudCA9IG5ldyBFdmVudCgnZmRzLm1vZGFsLm9wZW4nKTtcbiAgICB0aGlzLmNsb3NlRXZlbnQgPSBuZXcgRXZlbnQoJ2Zkcy5tb2RhbC5jbG9zZScpO1xuICAgIGlmKHRoaXMuZGlhbG9nID09PSBudWxsKXtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgfVxuXG4gIG9wZW4gKCl7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLmNsYXNzTGlzdC5hZGQoJ21vZGFsLWFjdGl2ZScpO1xuICAgIHRoaXMuZGlhbG9nLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICB0aGlzLmRpYWxvZy5kaXNwYXRjaEV2ZW50KHRoaXMub3BlbkV2ZW50KTtcbiAgfVxuXG4gIGNsb3NlICgpe1xuICAgIHRoaXMuZGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0uY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtYWN0aXZlJyk7XG4gICAgdGhpcy5kaWFsb2cuZGlzcGF0Y2hFdmVudCh0aGlzLmNsb3NlRXZlbnQpO1xuICB9XG5cbn1cbmNsYXNzIE1vZGFse1xuICBjb25zdHJ1Y3RvciAoYnV0dG9uKXtcbiAgICBjb25zb2xlLmxvZygnTU9EQUw6JywgYnV0dG9uKTtcbiAgICB0aGlzLmJ1dHRvbiA9IGJ1dHRvbjtcbiAgICB0aGlzLm1vZGFsID0gbnVsbDtcbiAgICB0aGlzLmxhc3RGb2N1cyA9IG51bGw7XG4gICAgdGhpcy5JZ25vcmVVdGlsRm9jdXNDaGFuZ2VzID0gZmFsc2U7XG4gICAgaWYodGhpcy5idXR0b24uZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpICE9PSB1bmRlZmluZWQgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JykpLmxlbmd0aCAhPT0gMCl7XG4gICAgICB0aGlzLm1vZGFsID0gbmV3IERpYWxvZyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuYnV0dG9uLmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKSkpO1xuICAgIH1cbiAgICBpZih0aGlzLm1vZGFsLmRpYWxvZyAhPT0gbnVsbCl7XG4gICAgICB0aGlzLnNldEV2ZW50cygpO1xuICAgIH0gZWxzZXtcbiAgICAgIGNvbnNvbGUubG9nKCdNb2RhbCBub3QgZm91bmQnKTtcbiAgICB9XG4gIH1cblxuICBzZXRFdmVudHMgKCl7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpe1xuICAgICAgdGhhdC5tb2RhbC5vcGVuKCk7XG4gICAgfSk7XG4gICAgdGhpcy5tb2RhbC5kaWFsb2cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpe1xuICAgICAgaWYgKGV2ZW50LnRhcmdldCAhPT0gdGhpcykgcmV0dXJuO1xuICAgICAgdGhhdC5tb2RhbC5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5tb2RhbC5kaWFsb2cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2xvc2UnKVsgMCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KXtcbiAgICAgIHRoYXQubW9kYWwuY2xvc2UoKTtcbiAgICB9KTtcbiAgICB0aGlzLm1vZGFsLmRpYWxvZy5hZGRFdmVudExpc3RlbmVyKCdmZHMubW9kYWwub3BlbicsIGZ1bmN0aW9uIChldmVudCl7XG4gICAgICB0aGF0LmZvY3VzRmlyc3REZXNjZW5kYW50KHRoYXQubW9kYWwuZGlhbG9nLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vZGFsLWRpYWxvZycpWzBdKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24gKGV2ZW50KXtcbiAgICAgIHRoYXQudHJhcEZvY3VzKGV2ZW50LCB0aGF0KTtcbiAgICB9LCB0cnVlKTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgdGhhdC5oYW5kbGVFc2NhcGUoZXZlbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlRXNjYXBlIChldmVudCkge1xuICAgIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xuICAgIHZhciBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC5zaG93Jyk7XG4gICAgaWYobW9kYWwgIT09IG51bGwpIHtcbiAgICAgIHZhciBkaWFsb2cgPSBuZXcgRGlhbG9nKG1vZGFsKTtcbiAgICAgIGlmIChrZXkgPT09IDI3ICYmIGRpYWxvZy5jbG9zZSgpKSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRyYXBGb2N1cyAoZXZlbnQsIHRoYXQpIHtcbiAgICBpZiAodGhhdC5JZ25vcmVVdGlsRm9jdXNDaGFuZ2VzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBjdXJyZW50RGlhbG9nID0gdGhhdC5tb2RhbC5kaWFsb2cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbW9kYWwtZGlhbG9nJylbMF07XG4gICAgY29uc29sZS5sb2coJ2N1cnJlbnREaWFsb2cnLCBjdXJyZW50RGlhbG9nKTtcbiAgICBpZiAoY3VycmVudERpYWxvZyAhPT0gbnVsbCAmJiBjdXJyZW50RGlhbG9nLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgIHRoYXQubGFzdEZvY3VzID0gZXZlbnQudGFyZ2V0O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoYXQuZm9jdXNGaXJzdERlc2NlbmRhbnQodGhhdC5tb2RhbC5kaWFsb2cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbW9kYWwtZGlhbG9nJylbMF0pO1xuICAgICAgaWYgKHRoYXQubGFzdEZvY3VzID09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgdGhhdC5mb2N1c0xhc3REZXNjZW5kYW50KHRoYXQubW9kYWwuZGlhbG9nLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vZGFsLWRpYWxvZycpWzBdKTtcbiAgICAgIH1cbiAgICAgIHRoYXQubGFzdEZvY3VzID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEBkZXNjIFNldCBmb2N1cyBvbiBkZXNjZW5kYW50IG5vZGVzIHVudGlsIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCBpc1xuICAgKiAgICAgICBmb3VuZC5cbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogICAgICAgICAgRE9NIG5vZGUgZm9yIHdoaWNoIHRvIGZpbmQgdGhlIGZpcnN0IGZvY3VzYWJsZSBkZXNjZW5kYW50LlxuICAgKiBAcmV0dXJuc1xuICAgKiAgdHJ1ZSBpZiBhIGZvY3VzYWJsZSBlbGVtZW50IGlzIGZvdW5kIGFuZCBmb2N1cyBpcyBzZXQuXG4gICAqL1xuICBmb2N1c0ZpcnN0RGVzY2VuZGFudCAoZWxlbWVudCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBlbGVtZW50LmNoaWxkTm9kZXNbaV07XG4gICAgICBpZiAodGhpcy5hdHRlbXB0Rm9jdXMoY2hpbGQpIHx8XG4gICAgICAgIHRoaXMuZm9jdXNGaXJzdERlc2NlbmRhbnQoY2hpbGQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2MgRmluZCB0aGUgbGFzdCBkZXNjZW5kYW50IG5vZGUgdGhhdCBpcyBmb2N1c2FibGUuXG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqICAgICAgICAgIERPTSBub2RlIGZvciB3aGljaCB0byBmaW5kIHRoZSBsYXN0IGZvY3VzYWJsZSBkZXNjZW5kYW50LlxuICAgKiBAcmV0dXJuc1xuICAgKiAgdHJ1ZSBpZiBhIGZvY3VzYWJsZSBlbGVtZW50IGlzIGZvdW5kIGFuZCBmb2N1cyBpcyBzZXQuXG4gICAqL1xuICBmb2N1c0xhc3REZXNjZW5kYW50IChlbGVtZW50KSB7XG4gICAgZm9yICh2YXIgaSA9IGVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdmFyIGNoaWxkID0gZWxlbWVudC5jaGlsZE5vZGVzW2ldO1xuICAgICAgaWYgKHRoaXMuYXR0ZW1wdEZvY3VzKGNoaWxkKSB8fFxuICAgICAgICB0aGlzLmZvY3VzTGFzdERlc2NlbmRhbnQoY2hpbGQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2MgU2V0IEF0dGVtcHQgdG8gc2V0IGZvY3VzIG9uIHRoZSBjdXJyZW50IG5vZGUuXG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqICAgICAgICAgIFRoZSBub2RlIHRvIGF0dGVtcHQgdG8gZm9jdXMgb24uXG4gICAqIEByZXR1cm5zXG4gICAqICB0cnVlIGlmIGVsZW1lbnQgaXMgZm9jdXNlZC5cbiAgICovXG4gIGF0dGVtcHRGb2N1cyAoZWxlbWVudCkge1xuICAgIGlmICghdGhpcy5pc0ZvY3VzYWJsZShlbGVtZW50KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuSWdub3JlVXRpbEZvY3VzQ2hhbmdlcyA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIGVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICB9XG4gICAgdGhpcy5JZ25vcmVVdGlsRm9jdXNDaGFuZ2VzID0gZmFsc2U7XG4gICAgY29uc29sZS5sb2coJ2ZvY3VzZWQnLCBlbGVtZW50KTtcbiAgICByZXR1cm4gKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGVsZW1lbnQpO1xuICB9XG5cbiAgaXNGb2N1c2FibGUgKGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudC50YWJJbmRleCA+IDAgfHwgKGVsZW1lbnQudGFiSW5kZXggPT09IDAgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JykgIT09IG51bGwpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZWxlbWVudC5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZWxlbWVudC5ub2RlTmFtZSkge1xuICAgICAgY2FzZSAnQSc6XG4gICAgICAgIHJldHVybiAhIWVsZW1lbnQuaHJlZiAmJiBlbGVtZW50LnJlbCAhPSAnaWdub3JlJztcbiAgICAgIGNhc2UgJ0lOUFVUJzpcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQudHlwZSAhPSAnaGlkZGVuJyAmJiBlbGVtZW50LnR5cGUgIT0gJ2ZpbGUnO1xuICAgICAgY2FzZSAnQlVUVE9OJzpcbiAgICAgIGNhc2UgJ1NFTEVDVCc6XG4gICAgICBjYXNlICdURVhUQVJFQSc6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGFsO1xuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XHJcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XHJcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xyXG5jb25zdCBhY2NvcmRpb24gPSByZXF1aXJlKCcuL2FjY29yZGlvbicpO1xyXG5cclxuY29uc3QgQ0xJQ0sgPSByZXF1aXJlKCcuLi9ldmVudHMnKS5DTElDSztcclxuY29uc3QgUFJFRklYID0gcmVxdWlyZSgnLi4vY29uZmlnJykucHJlZml4O1xyXG5cclxuY29uc3QgTkFWID0gYC5uYXZgO1xyXG5jb25zdCBOQVZfTElOS1MgPSBgJHtOQVZ9IGFgO1xyXG5jb25zdCBPUEVORVJTID0gYC5qcy1tZW51LW9wZW5gO1xyXG5jb25zdCBDTE9TRV9CVVRUT04gPSBgLmpzLW1lbnUtY2xvc2VgO1xyXG5jb25zdCBPVkVSTEFZID0gYC5vdmVybGF5YDtcclxuY29uc3QgQ0xPU0VSUyA9IGAke0NMT1NFX0JVVFRPTn0sIC5vdmVybGF5YDtcclxuY29uc3QgVE9HR0xFUyA9IFsgTkFWLCBPVkVSTEFZIF0uam9pbignLCAnKTtcclxuXHJcbmNvbnN0IEFDVElWRV9DTEFTUyA9ICdtb2JpbGVfbmF2LWFjdGl2ZSc7XHJcbmNvbnN0IFZJU0lCTEVfQ0xBU1MgPSAnaXMtdmlzaWJsZSc7XHJcblxyXG5jb25zdCBpc0FjdGl2ZSA9ICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUyk7XHJcblxyXG5jb25zdCBfZm9jdXNUcmFwID0gKHRyYXBDb250YWluZXIpID0+IHtcclxuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cclxuICBjb25zdCBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9ICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSc7XHJcbiAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSB0cmFwQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcpO1xyXG4gIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWyAwIF07XHJcbiAgY29uc3QgbGFzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1sgZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMSBdO1xyXG5cclxuICBmdW5jdGlvbiB0cmFwVGFiS2V5IChlKSB7XHJcbiAgICAvLyBDaGVjayBmb3IgVEFCIGtleSBwcmVzc1xyXG4gICAgaWYgKGUua2V5Q29kZSA9PT0gOSkge1xyXG5cclxuICAgICAgLy8gU0hJRlQgKyBUQUJcclxuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RUYWJTdG9wKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRBQlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0VGFiU3RvcCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRVNDQVBFXHJcbiAgICBpZiAoZS5rZXlDb2RlID09PSAyNykge1xyXG4gICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBGb2N1cyBmaXJzdCBjaGlsZFxyXG4gIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZW5hYmxlICgpIHtcclxuICAgICAgLy8gTGlzdGVuIGZvciBhbmQgdHJhcCB0aGUga2V5Ym9hcmRcclxuICAgICAgdHJhcENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcFRhYktleSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbGVhc2UgKCkge1xyXG4gICAgICB0cmFwQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmxldCBmb2N1c1RyYXA7XHJcblxyXG5jb25zdCB0b2dnbGVOYXYgPSBmdW5jdGlvbiAoYWN0aXZlKSB7XHJcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgaWYgKHR5cGVvZiBhY3RpdmUgIT09ICdib29sZWFuJykge1xyXG4gICAgYWN0aXZlID0gIWlzQWN0aXZlKCk7XHJcbiAgfVxyXG4gIGJvZHkuY2xhc3NMaXN0LnRvZ2dsZShBQ1RJVkVfQ0xBU1MsIGFjdGl2ZSk7XHJcblxyXG4gIGZvckVhY2goc2VsZWN0KFRPR0dMRVMpLCBlbCA9PiB7XHJcbiAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKFZJU0lCTEVfQ0xBU1MsIGFjdGl2ZSk7XHJcbiAgfSk7XHJcblxyXG4gIGlmIChhY3RpdmUpIHtcclxuICAgIGZvY3VzVHJhcC5lbmFibGUoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZm9jdXNUcmFwLnJlbGVhc2UoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNsb3NlQnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcbiAgY29uc3QgbWVudUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihPUEVORVJTKTtcclxuXHJcbiAgaWYgKGFjdGl2ZSAmJiBjbG9zZUJ1dHRvbikge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgYWN0aXZhdGVkLCBzbyBmb2N1cyBvbiB0aGUgY2xvc2UgYnV0dG9uLFxyXG4gICAgLy8gd2hpY2ggaXMganVzdCBiZWZvcmUgYWxsIHRoZSBuYXYgZWxlbWVudHMgaW4gdGhlIHRhYiBvcmRlci5cclxuICAgIGNsb3NlQnV0dG9uLmZvY3VzKCk7XHJcbiAgfSBlbHNlIGlmICghYWN0aXZlICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGNsb3NlQnV0dG9uICYmXHJcbiAgICAgICAgICAgICBtZW51QnV0dG9uKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBkZWFjdGl2YXRlZCwgYW5kIGZvY3VzIHdhcyBvbiB0aGUgY2xvc2VcclxuICAgIC8vIGJ1dHRvbiwgd2hpY2ggaXMgbm8gbG9uZ2VyIHZpc2libGUuIFdlIGRvbid0IHdhbnQgdGhlIGZvY3VzIHRvXHJcbiAgICAvLyBkaXNhcHBlYXIgaW50byB0aGUgdm9pZCwgc28gZm9jdXMgb24gdGhlIG1lbnUgYnV0dG9uIGlmIGl0J3NcclxuICAgIC8vIHZpc2libGUgKHRoaXMgbWF5IGhhdmUgYmVlbiB3aGF0IHRoZSB1c2VyIHdhcyBqdXN0IGZvY3VzZWQgb24sXHJcbiAgICAvLyBpZiB0aGV5IHRyaWdnZXJlZCB0aGUgbW9iaWxlIG5hdiBieSBtaXN0YWtlKS5cclxuICAgIG1lbnVCdXR0b24uZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhY3RpdmU7XHJcbn07XHJcblxyXG5jb25zdCByZXNpemUgPSAoKSA9PiB7XHJcbiAgY29uc3QgY2xvc2VyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcblxyXG4gIGlmIChpc0FjdGl2ZSgpICYmIGNsb3NlciAmJiBjbG9zZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggPT09IDApIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IGlzIGFjdGl2ZSwgYnV0IHRoZSBjbG9zZSBib3ggaXNuJ3QgdmlzaWJsZSwgd2hpY2hcclxuICAgIC8vIG1lYW5zIHRoZSB1c2VyJ3Mgdmlld3BvcnQgaGFzIGJlZW4gcmVzaXplZCBzbyB0aGF0IGl0IGlzIG5vIGxvbmdlclxyXG4gICAgLy8gaW4gbW9iaWxlIG1vZGUuIExldCdzIG1ha2UgdGhlIHBhZ2Ugc3RhdGUgY29uc2lzdGVudCBieVxyXG4gICAgLy8gZGVhY3RpdmF0aW5nIHRoZSBtb2JpbGUgbmF2LlxyXG4gICAgdG9nZ2xlTmF2LmNhbGwoY2xvc2VyLCBmYWxzZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgbmF2aWdhdGlvbiA9IGJlaGF2aW9yKHtcclxuICBbIENMSUNLIF06IHtcclxuICAgIFsgT1BFTkVSUyBdOiB0b2dnbGVOYXYsXHJcbiAgICBbIENMT1NFUlMgXTogdG9nZ2xlTmF2LFxyXG4gICAgWyBOQVZfTElOS1MgXTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBBIG5hdmlnYXRpb24gbGluayBoYXMgYmVlbiBjbGlja2VkISBXZSB3YW50IHRvIGNvbGxhcHNlIGFueVxyXG4gICAgICAvLyBoaWVyYXJjaGljYWwgbmF2aWdhdGlvbiBVSSBpdCdzIGEgcGFydCBvZiwgc28gdGhhdCB0aGUgdXNlclxyXG4gICAgICAvLyBjYW4gZm9jdXMgb24gd2hhdGV2ZXIgdGhleSd2ZSBqdXN0IHNlbGVjdGVkLlxyXG5cclxuICAgICAgLy8gU29tZSBuYXZpZ2F0aW9uIGxpbmtzIGFyZSBpbnNpZGUgYWNjb3JkaW9uczsgd2hlbiB0aGV5J3JlXHJcbiAgICAgIC8vIGNsaWNrZWQsIHdlIHdhbnQgdG8gY29sbGFwc2UgdGhvc2UgYWNjb3JkaW9ucy5cclxuICAgICAgY29uc3QgYWNjID0gdGhpcy5jbG9zZXN0KGFjY29yZGlvbi5BQ0NPUkRJT04pO1xyXG4gICAgICBpZiAoYWNjKSB7XHJcbiAgICAgICAgYWNjb3JkaW9uLmdldEJ1dHRvbnMoYWNjKS5mb3JFYWNoKGJ0biA9PiBhY2NvcmRpb24uaGlkZShidG4pKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgdGhlIG1vYmlsZSBuYXZpZ2F0aW9uIG1lbnUgaXMgYWN0aXZlLCB3ZSB3YW50IHRvIGhpZGUgaXQuXHJcbiAgICAgIGlmIChpc0FjdGl2ZSgpKSB7XHJcbiAgICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0sIHtcclxuICBpbml0ICgpIHtcclxuICAgIGNvbnN0IHRyYXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKE5BVik7XHJcblxyXG4gICAgaWYgKHRyYXBDb250YWluZXIpIHtcclxuICAgICAgZm9jdXNUcmFwID0gX2ZvY3VzVHJhcCh0cmFwQ29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNpemUoKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcclxuICB9LFxyXG4gIHRlYXJkb3duICgpIHtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcclxuICB9LFxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBUT0RPIGZvciAyLjAsIHJlbW92ZSB0aGlzIHN0YXRlbWVudCBhbmQgZXhwb3J0IGBuYXZpZ2F0aW9uYCBkaXJlY3RseTpcclxuICpcclxuICogbW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcih7Li4ufSk7XHJcbiAqL1xyXG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gYXNzaWduKFxyXG4gIGVsID0+IG5hdmlnYXRpb24ub24oZWwpLFxyXG4gIG5hdmlnYXRpb25cclxuKTsiLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIFJhZGlvVG9nZ2xlR3JvdXB7XG4gICAgY29uc3RydWN0b3IoZWwpe1xuICAgICAgICB0aGlzLmpzVG9nZ2xlVHJpZ2dlciA9ICcuanMtcmFkaW8tdG9nZ2xlLWdyb3VwJztcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRhcmdldCA9ICdkYXRhLWpzLXRhcmdldCc7XG4gICAgICAgIHRoaXMuZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLmNsb3NlJyk7XG4gICAgICAgIHRoaXMuZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2Uub3BlbicpO1xuICAgICAgICB0aGlzLnJhZGlvRWxzID0gbnVsbDtcbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5pbml0KGVsKTtcbiAgICB9XG5cbiAgICBpbml0IChlbCl7XG4gICAgICAgIHRoaXMucmFkaW9Hcm91cCA9IGVsO1xuICAgICAgICB0aGlzLnJhZGlvRWxzID0gdGhpcy5yYWRpb0dyb3VwLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMucmFkaW9FbHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIHZhciByYWRpbyA9IHRoaXMucmFkaW9FbHNbIGkgXTtcbiAgICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgIGZvcihsZXQgYSA9IDA7IGEgPCB0aGF0LnJhZGlvRWxzLmxlbmd0aDsgYSsrICl7XG4gICAgICAgICAgICAgIHRoYXQudG9nZ2xlKHRoYXQucmFkaW9FbHNbIGEgXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnRvZ2dsZShyYWRpbyk7IC8vSW5pdGlhbCB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZSAodHJpZ2dlckVsKXtcbiAgICAgICAgdmFyIHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNUb2dnbGVUYXJnZXQpO1xuICAgICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldEF0dHIpO1xuICAgICAgICAgICAgaWYodGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgaWYodHJpZ2dlckVsLmNoZWNrZWQpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRPcGVuKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjbG9zZSh0cmlnZ2VyRWwsIHRhcmdldEVsKXtcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRDbG9zZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmFkaW9Ub2dnbGVHcm91cDtcbiIsIi8qXHJcbiogUHJldmVudHMgdGhlIHVzZXIgZnJvbSBpbnB1dHRpbmcgYmFzZWQgb24gYSByZWdleC5cclxuKiBEb2VzIG5vdCB3b3JrIHRoZSBzYW1lIHdheSBhZiA8aW5wdXQgcGF0dGVybj1cIlwiPiwgdGhpcyBwYXR0ZXJuIGlzIG9ubHkgdXNlZCBmb3IgdmFsaWRhdGlvbiwgbm90IHRvIHByZXZlbnQgaW5wdXQuXHJcbiogVXNlY2FzZTogbnVtYmVyIGlucHV0IGZvciBkYXRlLWNvbXBvbmVudC5cclxuKiBFeGFtcGxlIC0gbnVtYmVyIG9ubHk6IDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtaW5wdXQtcmVnZXg9XCJeXFxkKiRcIj5cclxuKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XHJcblxyXG5jb25zdCBtb2RpZmllclN0YXRlID0ge1xyXG4gIHNoaWZ0OiBmYWxzZSxcclxuICBhbHQ6IGZhbHNlLFxyXG4gIGN0cmw6IGZhbHNlLFxyXG4gIGNvbW1hbmQ6IGZhbHNlXHJcbn07XHJcblxyXG5mdW5jdGlvbiBpbnB1dFJlZ2V4TWFzayAoZXZlbnQpIHtcclxuICBpZihtb2RpZmllclN0YXRlLmN0cmwgfHwgbW9kaWZpZXJTdGF0ZS5jb21tYW5kKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBuZXdDaGFyID0gbnVsbDtcclxuICBpZih0eXBlb2YgZXZlbnQua2V5ICE9PSAndW5kZWZpbmVkJyl7XHJcbiAgICBpZihldmVudC5rZXkubGVuZ3RoID09PSAxKXtcclxuICAgICAgbmV3Q2hhciA9IGV2ZW50LmtleTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYoIWV2ZW50LmNoYXJDb2RlKXtcclxuICAgICAgbmV3Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQua2V5Q29kZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5jaGFyQ29kZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgcmVnZXhTdHIgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1pbnB1dC1yZWdleCcpO1xyXG5cclxuICBpZihldmVudC50eXBlICE9PSB1bmRlZmluZWQgJiYgZXZlbnQudHlwZSA9PT0gJ3Bhc3RlJyl7XHJcbiAgICBjb25zb2xlLmxvZygncGFzdGUnKTtcclxuICB9IGVsc2V7XHJcbiAgICB2YXIgZWxlbWVudCA9IG51bGw7XHJcbiAgICBpZihldmVudC50YXJnZXQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XHJcbiAgICB9XHJcbiAgICBpZihuZXdDaGFyICE9PSBudWxsICYmIGVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgaWYobmV3Q2hhci5sZW5ndGggPiAwKXtcclxuICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGlmKGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcicpe1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlOy8vTm90ZSBpbnB1dFt0eXBlPW51bWJlcl0gZG9lcyBub3QgaGF2ZSAuc2VsZWN0aW9uU3RhcnQvRW5kIChDaHJvbWUpLlxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIGVsZW1lbnQuc2VsZWN0aW9uU3RhcnQpICsgdGhpcy52YWx1ZS5zbGljZShlbGVtZW50LnNlbGVjdGlvbkVuZCkgKyBuZXdDaGFyOyAvL3JlbW92ZXMgdGhlIG51bWJlcnMgc2VsZWN0ZWQgYnkgdGhlIHVzZXIsIHRoZW4gYWRkcyBuZXcgY2hhci5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByID0gbmV3IFJlZ0V4cChyZWdleFN0cik7XHJcbiAgICAgICAgaWYoci5leGVjKG5ld1ZhbHVlKSA9PT0gbnVsbCl7XHJcbiAgICAgICAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHtcclxuICAna2V5cHJlc3MgcGFzdGUnOiB7XHJcbiAgICAnaW5wdXRbZGF0YS1pbnB1dC1yZWdleF06Zm9jdXMnOiBpbnB1dFJlZ2V4TWFzayxcclxuICB9XHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XG5jb25zdCBvbmNlID0gcmVxdWlyZSgncmVjZXB0b3Ivb25jZScpO1xuXG5jb25zdCBDTElDSyA9IHJlcXVpcmUoJy4uL2V2ZW50cycpLkNMSUNLO1xuY29uc3QgUFJFRklYID0gcmVxdWlyZSgnLi4vY29uZmlnJykucHJlZml4O1xuY29uc3QgTElOSyA9IGAuJHtQUkVGSVh9c2tpcG5hdltocmVmXj1cIiNcIl1gO1xuXG5jb25zdCBzZXRUYWJpbmRleCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAvLyBOQjogd2Uga25vdyBiZWNhdXNlIG9mIHRoZSBzZWxlY3RvciB3ZSdyZSBkZWxlZ2F0aW5nIHRvIGJlbG93IHRoYXQgdGhlXG4gIC8vIGhyZWYgYWxyZWFkeSBiZWdpbnMgd2l0aCAnIydcbiAgY29uc3QgaWQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnaHJlZicpLnNsaWNlKDEpO1xuICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gIGlmICh0YXJnZXQpIHtcbiAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgb25jZShldmVudCA9PiB7XG4gICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKTtcbiAgICB9KSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gdGhyb3cgYW4gZXJyb3I/XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3Ioe1xuICBbIENMSUNLIF06IHtcbiAgICBbIExJTksgXTogc2V0VGFiaW5kZXgsXG4gIH0sXG59KTtcbiIsImNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xuXG5jbGFzcyBSZXNwb25zaXZlVGFibGUge1xuICAgIGNvbnN0cnVjdG9yICh0YWJsZSkge1xuICAgICAgICB0aGlzLmluc2VydEhlYWRlckFzQXR0cmlidXRlcyh0YWJsZSk7XG4gICAgfVxuXG4gICAgLy8gQWRkIGRhdGEgYXR0cmlidXRlcyBuZWVkZWQgZm9yIHJlc3BvbnNpdmUgbW9kZS5cbiAgICBpbnNlcnRIZWFkZXJBc0F0dHJpYnV0ZXMgKHRhYmxlRWwpe1xuICAgICAgICBpZiAoIXRhYmxlRWwpIHJldHVybjtcblxuICAgICAgICBsZXQgaGVhZGVyID0gIHRhYmxlRWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoZWFkJyk7XG4gICAgICAgIGlmKGhlYWRlci5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICBsZXQgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclsgMCBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aCcpO1xuICAgICAgICAgIGlmIChoZWFkZXJDZWxsRWxzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBoZWFkZXJDZWxsRWxzID0gaGVhZGVyWyAwIF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RkJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBib2R5Um93RWxzID0gc2VsZWN0KCd0Ym9keSB0cicsIHRhYmxlRWwpO1xuICAgICAgICAgICAgQXJyYXkuZnJvbShib2R5Um93RWxzKS5mb3JFYWNoKHJvd0VsID0+IHtcbiAgICAgICAgICAgICAgbGV0IGNlbGxFbHMgPSByb3dFbC5jaGlsZHJlbjtcbiAgICAgICAgICAgICAgaWYgKGNlbGxFbHMubGVuZ3RoID09PSBoZWFkZXJDZWxsRWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIEFycmF5LmZyb20oaGVhZGVyQ2VsbEVscykuZm9yRWFjaCgoaGVhZGVyQ2VsbEVsLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAvLyBHcmFiIGhlYWRlciBjZWxsIHRleHQgYW5kIHVzZSBpdCBib2R5IGNlbGwgZGF0YSB0aXRsZS5cbiAgICAgICAgICAgICAgICAgIGNlbGxFbHNbIGkgXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnLCBoZWFkZXJDZWxsRWwudGV4dENvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVzcG9uc2l2ZVRhYmxlO1xuIiwiXHJcbmNvbnN0IGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcbi8vSW1wb3J0IHRpcHB5LmpzIChodHRwczovL2F0b21pa3MuZ2l0aHViLmlvL3RpcHB5anMvKVxyXG5jb25zdCB0aXBweSA9IHJlcXVpcmUoJy4uLy4uL3ZlbmRvci90aXBweWpzL3RpcHB5LmpzJyk7XHJcblxyXG52YXIgaW5pdFRpcHB5ID0gZnVuY3Rpb24gKCl7XHJcbiAgICAvL2luaXQgdG9vbHRpcCBvbiBlbGVtZW50cyB3aXRoIHRoZSAuanMtdG9vbHRpcCBjbGFzc1xyXG4gICAgdGlwcHkoJy5qcy10b29sdGlwJywgeyBcclxuICAgICAgICBkdXJhdGlvbjogMCxcclxuICAgICAgICBhcnJvdzogdHJ1ZVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5kb21yZWFkeSgoKSA9PiB7XHJcbiAgICBpbml0VGlwcHkoKTtcclxufSk7XHJcblxyXG5cclxuXHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHByZWZpeDogJycsXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKTtcbmNvbnN0IENvbGxhcHNlID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2NvbGxhcHNlJyk7XG5jb25zdCBSYWRpb1RvZ2dsZUdyb3VwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50Jyk7XG5jb25zdCBDaGVja2JveFRvZ2dsZUNvbnRlbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnKTtcbmNvbnN0IERyb3Bkb3duID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Ryb3Bkb3duJyk7XG5jb25zdCBBY2NvcmRpb24gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYWNjb3JkaW9uJyk7XG5jb25zdCBNb2RhbCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9tb2RhbCcpO1xuY29uc3QgUmVzcG9uc2l2ZVRhYmxlID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3RhYmxlJyk7XG5jb25zdCB0b29sdGlwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3Rvb2x0aXAnKTtcblxuLyoqXG4gKiBUaGUgJ3BvbHlmaWxscycgZGVmaW5lIGtleSBFQ01BU2NyaXB0IDUgbWV0aG9kcyB0aGF0IG1heSBiZSBtaXNzaW5nIGZyb21cbiAqIG9sZGVyIGJyb3dzZXJzLCBzbyBtdXN0IGJlIGxvYWRlZCBmaXJzdC5cbiAqL1xucmVxdWlyZSgnLi9wb2x5ZmlsbHMnKTtcblxuY29uc3QgZGtmZHMgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xuXG5jb25zdCBjb21wb25lbnRzID0gcmVxdWlyZSgnLi9jb21wb25lbnRzJyk7XG5ka2Zkcy5jb21wb25lbnRzID0gY29tcG9uZW50cztcblxuZG9tcmVhZHkoKCkgPT4ge1xuICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5ib2R5O1xuICBmb3IgKGxldCBuYW1lIGluIGNvbXBvbmVudHMpIHtcbiAgICBjb25zdCBiZWhhdmlvciA9IGNvbXBvbmVudHNbIG5hbWUgXTtcbiAgICBiZWhhdmlvci5vbih0YXJnZXQpO1xuICB9XG4gIGNvbnN0IGpzU2VsZWN0b3JNb2RhbEJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcqW2RhdGEtdG9nZ2xlPW1vZGFsXScpO1xuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3Rvck1vZGFsQm9keS5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IE1vZGFsKGpzU2VsZWN0b3JNb2RhbEJvZHlbIGMgXSk7XG4gIH1cblxuICBjb25zdCBqc1NlbGVjdG9yQWNjb3JkaW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWNjb3JkaW9uJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQWNjb3JkaW9uLmxlbmd0aDsgYysrKXtcbiAgICBuZXcgQWNjb3JkaW9uKGpzU2VsZWN0b3JBY2NvcmRpb25bIGMgXSk7XG4gIH1cbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1ib3JkZXJlZDpub3QoLmFjY29yZGlvbiknKTtcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZC5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uQm9yZGVyZWRbIGMgXSk7XG4gIH1cblxuICBjb25zdCBqc1NlbGVjdG9yVGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZTpub3QoLmRhdGFUYWJsZSknKTtcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JUYWJsZS5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IFJlc3BvbnNpdmVUYWJsZShqc1NlbGVjdG9yVGFibGVbIGMgXSk7XG4gIH1cblxuICBjb25zdCBqc1NlbGVjdG9yQ29sbGFwc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1jb2xsYXBzZScpO1xuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckNvbGxhcHNlLmxlbmd0aDsgYysrKXtcbiAgICBuZXcgQ29sbGFwc2UoanNTZWxlY3RvckNvbGxhcHNlWyBjIF0pO1xuICB9XG5cbiAgY29uc3QganNTZWxlY3RvclJhZGlvQ29sbGFwc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1yYWRpby10b2dnbGUtZ3JvdXAnKTtcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlLmxlbmd0aDsgYysrKXtcbiAgICBuZXcgUmFkaW9Ub2dnbGVHcm91cChqc1NlbGVjdG9yUmFkaW9Db2xsYXBzZVsgYyBdKTtcbiAgfVxuXG4gIGNvbnN0IGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnKTtcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlLmxlbmd0aDsgYysrKXtcbiAgICBuZXcgQ2hlY2tib3hUb2dnbGVDb250ZW50KGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlWyBjIF0pO1xuICB9XG4gIGNvbnN0IGpzU2VsZWN0b3JEcm9wZG93biA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWRyb3Bkb3duJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yRHJvcGRvd24ubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBEcm9wZG93bihqc1NlbGVjdG9yRHJvcGRvd25bIGMgXSk7XG4gIH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0geyBDb2xsYXBzZSwgUmFkaW9Ub2dnbGVHcm91cCwgQ2hlY2tib3hUb2dnbGVDb250ZW50LCBEcm9wZG93biwgUmVzcG9uc2l2ZVRhYmxlLCBBY2NvcmRpb24gfTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIC8vIFRoaXMgdXNlZCB0byBiZSBjb25kaXRpb25hbGx5IGRlcGVuZGVudCBvbiB3aGV0aGVyIHRoZVxyXG4gIC8vIGJyb3dzZXIgc3VwcG9ydGVkIHRvdWNoIGV2ZW50czsgaWYgaXQgZGlkLCBgQ0xJQ0tgIHdhcyBzZXQgdG9cclxuICAvLyBgdG91Y2hzdGFydGAuICBIb3dldmVyLCB0aGlzIGhhZCBkb3duc2lkZXM6XHJcbiAgLy9cclxuICAvLyAqIEl0IHByZS1lbXB0ZWQgbW9iaWxlIGJyb3dzZXJzJyBkZWZhdWx0IGJlaGF2aW9yIG9mIGRldGVjdGluZ1xyXG4gIC8vICAgd2hldGhlciBhIHRvdWNoIHR1cm5lZCBpbnRvIGEgc2Nyb2xsLCB0aGVyZWJ5IHByZXZlbnRpbmdcclxuICAvLyAgIHVzZXJzIGZyb20gdXNpbmcgc29tZSBvZiBvdXIgY29tcG9uZW50cyBhcyBzY3JvbGwgc3VyZmFjZXMuXHJcbiAgLy9cclxuICAvLyAqIFNvbWUgZGV2aWNlcywgc3VjaCBhcyB0aGUgTWljcm9zb2Z0IFN1cmZhY2UgUHJvLCBzdXBwb3J0ICpib3RoKlxyXG4gIC8vICAgdG91Y2ggYW5kIGNsaWNrcy4gVGhpcyBtZWFudCB0aGUgY29uZGl0aW9uYWwgZWZmZWN0aXZlbHkgZHJvcHBlZFxyXG4gIC8vICAgc3VwcG9ydCBmb3IgdGhlIHVzZXIncyBtb3VzZSwgZnJ1c3RyYXRpbmcgdXNlcnMgd2hvIHByZWZlcnJlZFxyXG4gIC8vICAgaXQgb24gdGhvc2Ugc3lzdGVtcy5cclxuICBDTElDSzogJ2NsaWNrJyxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBlbHByb3RvID0gd2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZTtcclxuY29uc3QgSElEREVOID0gJ2hpZGRlbic7XHJcblxyXG5pZiAoIShISURERU4gaW4gZWxwcm90bykpIHtcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxwcm90bywgSElEREVOLCB7XHJcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEhJRERFTik7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoSElEREVOLCAnJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NMaXN0IGFuZCBET01Ub2tlbkxpc3RcclxucmVxdWlyZSgnY2xhc3NsaXN0LXBvbHlmaWxsJyk7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZGVuXHJcbnJlcXVpcmUoJy4vZWxlbWVudC1oaWRkZW4nKTtcclxuXHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vb2JqZWN0L2Fzc2lnbicpO1xyXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL2FycmF5L2Zyb20nKTsiLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuY29uc3QgQmVoYXZpb3IgPSByZXF1aXJlKCdyZWNlcHRvci9iZWhhdmlvcicpO1xyXG5cclxuY29uc3Qgc2VxdWVuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3Qgc2VxID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICBpZiAoIXRhcmdldCkge1xyXG4gICAgICB0YXJnZXQgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgfVxyXG4gICAgZm9yRWFjaChzZXEsIG1ldGhvZCA9PiB7XHJcbiAgICAgIGlmICh0eXBlb2YgdGhpc1sgbWV0aG9kIF0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB0aGlzWyBtZXRob2QgXS5jYWxsKHRoaXMsIHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogQG5hbWUgYmVoYXZpb3JcclxuICogQHBhcmFtIHtvYmplY3R9IGV2ZW50c1xyXG4gKiBAcGFyYW0ge29iamVjdD99IHByb3BzXHJcbiAqIEByZXR1cm4ge3JlY2VwdG9yLmJlaGF2aW9yfVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoZXZlbnRzLCBwcm9wcykgPT4ge1xyXG4gIHJldHVybiBCZWhhdmlvcihldmVudHMsIGFzc2lnbih7XHJcbiAgICBvbjogICBzZXF1ZW5jZSgnaW5pdCcsICdhZGQnKSxcclxuICAgIG9mZjogIHNlcXVlbmNlKCd0ZWFyZG93bicsICdyZW1vdmUnKSxcclxuICB9LCBwcm9wcykpO1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQG5hbWUgY2xvc2VzdFxyXG4gKiBAZGVzYyBnZXQgbmVhcmVzdCBwYXJlbnQgZWxlbWVudCBtYXRjaGluZyBzZWxlY3Rvci5cclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgSFRNTCBlbGVtZW50IHdoZXJlIHRoZSBzZWFyY2ggc3RhcnRzLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBTZWxlY3RvciB0byBiZSBmb3VuZC5cclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9IC0gTmVhcmVzdCBwYXJlbnQgZWxlbWVudCBtYXRjaGluZyBzZWxlY3Rvci5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xvc2VzdCAoZWwsIHNlbGVjdG9yKSB7XHJcbiAgdmFyIG1hdGNoZXNTZWxlY3RvciA9IGVsLm1hdGNoZXMgfHwgZWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGVsLm1vek1hdGNoZXNTZWxlY3RvciB8fCBlbC5tc01hdGNoZXNTZWxlY3RvcjtcclxuXHJcbiAgd2hpbGUgKGVsKSB7XHJcbiAgICAgIGlmIChtYXRjaGVzU2VsZWN0b3IuY2FsbChlbCwgc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgfVxyXG4gIHJldHVybiBlbDtcclxufTtcclxuIiwiLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzNcclxuZnVuY3Rpb24gaXNFbGVtZW50SW5WaWV3cG9ydCAoZWwsIHdpbj13aW5kb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICByZWN0LnRvcCA+PSAwICYmXHJcbiAgICByZWN0LmxlZnQgPj0gMCAmJlxyXG4gICAgcmVjdC5ib3R0b20gPD0gKHdpbi5pbm5lckhlaWdodCB8fCBkb2NFbC5jbGllbnRIZWlnaHQpICYmXHJcbiAgICByZWN0LnJpZ2h0IDw9ICh3aW4uaW5uZXJXaWR0aCB8fCBkb2NFbC5jbGllbnRXaWR0aClcclxuICApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudEluVmlld3BvcnQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBpc0VsZW1lbnRcclxuICogQGRlc2MgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudC5cclxuICogQHBhcmFtIHthbnl9IHZhbHVlXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VsZW1lbnQgPSB2YWx1ZSA9PiB7XHJcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUubm9kZVR5cGUgPT09IDE7XHJcbn07XHJcblxyXG4vKipcclxuICogQG5hbWUgc2VsZWN0XHJcbiAqIEBkZXNjIHNlbGVjdHMgZWxlbWVudHMgZnJvbSB0aGUgRE9NIGJ5IGNsYXNzIHNlbGVjdG9yIG9yIElEIHNlbGVjdG9yLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBUaGUgc2VsZWN0b3IgdG8gdHJhdmVyc2UgdGhlIERPTSB3aXRoLlxyXG4gKiBAcGFyYW0ge0RvY3VtZW50fEhUTUxFbGVtZW50P30gY29udGV4dCAtIFRoZSBjb250ZXh0IHRvIHRyYXZlcnNlIHRoZSBET01cclxuICogICBpbi4gSWYgbm90IHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byB0aGUgZG9jdW1lbnQuXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50W119IC0gQW4gYXJyYXkgb2YgRE9NIG5vZGVzIG9yIGFuIGVtcHR5IGFycmF5LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZWxlY3QgKHNlbGVjdG9yLCBjb250ZXh0KSB7XHJcblxyXG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBpZiAoIWNvbnRleHQgfHwgIWlzRWxlbWVudChjb250ZXh0KSkge1xyXG4gICAgY29udGV4dCA9IHdpbmRvdy5kb2N1bWVudDtcclxuICB9XHJcblxyXG4gIGNvbnN0IHNlbGVjdGlvbiA9IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGVjdGlvbik7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XHJcbmNvbnN0IENPTlRST0xTID0gJ2FyaWEtY29udHJvbHMnO1xyXG5jb25zdCBISURERU4gPSAnYXJpYS1oaWRkZW4nO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoYnV0dG9uLCBleHBhbmRlZCkgPT4ge1xyXG5cclxuICBpZiAodHlwZW9mIGV4cGFuZGVkICE9PSAnYm9vbGVhbicpIHtcclxuICAgIGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICdmYWxzZSc7XHJcbiAgfVxyXG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoRVhQQU5ERUQsIGV4cGFuZGVkKTtcclxuXHJcbiAgY29uc3QgaWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKENPTlRST0xTKTtcclxuICBjb25zdCBjb250cm9scyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICBpZiAoIWNvbnRyb2xzKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICdObyB0b2dnbGUgdGFyZ2V0IGZvdW5kIHdpdGggaWQ6IFwiJyArIGlkICsgJ1wiJ1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGNvbnRyb2xzLnNldEF0dHJpYnV0ZShISURERU4sICFleHBhbmRlZCk7XHJcbiAgcmV0dXJuIGV4cGFuZGVkO1xyXG59O1xyXG4iLCIvKiFcclxuKiBUaXBweS5qcyB2Mi41LjNcclxuKiAoYykgMjAxNy0yMDE4IGF0b21pa3NcclxuKiBNSVRcclxuKi9cclxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcclxuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XHJcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcclxuXHQoZ2xvYmFsLnRpcHB5ID0gZmFjdG9yeSgpKTtcclxufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdmVyc2lvbiA9IFwiMi41LjNcIjtcclxuXHJcbnZhciBpc0Jyb3dzZXIgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcclxuXHJcbnZhciBpc0lFID0gaXNCcm93c2VyICYmIC9NU0lFIHxUcmlkZW50XFwvLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG5cclxudmFyIGJyb3dzZXIgPSB7fTtcclxuXHJcbmlmIChpc0Jyb3dzZXIpIHtcclxuICBicm93c2VyLnN1cHBvcnRlZCA9ICdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnIGluIHdpbmRvdztcclxuICBicm93c2VyLnN1cHBvcnRzVG91Y2ggPSAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3c7XHJcbiAgYnJvd3Nlci51c2luZ1RvdWNoID0gZmFsc2U7XHJcbiAgYnJvd3Nlci5keW5hbWljSW5wdXREZXRlY3Rpb24gPSB0cnVlO1xyXG4gIGJyb3dzZXIuaU9TID0gL2lQaG9uZXxpUGFkfGlQb2QvLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtKSAmJiAhd2luZG93Lk1TU3RyZWFtO1xyXG4gIGJyb3dzZXIub25Vc2VySW5wdXRDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7fTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNlbGVjdG9yIGNvbnN0YW50cyB1c2VkIGZvciBncmFiYmluZyBlbGVtZW50c1xyXG4gKi9cclxudmFyIHNlbGVjdG9ycyA9IHtcclxuICBQT1BQRVI6ICcudGlwcHktcG9wcGVyJyxcclxuICBUT09MVElQOiAnLnRpcHB5LXRvb2x0aXAnLFxyXG4gIENPTlRFTlQ6ICcudGlwcHktY29udGVudCcsXHJcbiAgQkFDS0RST1A6ICcudGlwcHktYmFja2Ryb3AnLFxyXG4gIEFSUk9XOiAnLnRpcHB5LWFycm93JyxcclxuICBST1VORF9BUlJPVzogJy50aXBweS1yb3VuZGFycm93JyxcclxuICBSRUZFUkVOQ0U6ICdbZGF0YS10aXBweV0nXHJcbn07XHJcblxyXG52YXIgZGVmYXVsdHMgPSB7XHJcbiAgcGxhY2VtZW50OiAndG9wJyxcclxuICBsaXZlUGxhY2VtZW50OiB0cnVlLFxyXG4gIHRyaWdnZXI6ICdtb3VzZWVudGVyIGZvY3VzJyxcclxuICBhbmltYXRpb246ICdzaGlmdC1hd2F5JyxcclxuICBodG1sOiBmYWxzZSxcclxuICBhbmltYXRlRmlsbDogdHJ1ZSxcclxuICBhcnJvdzogZmFsc2UsXHJcbiAgZGVsYXk6IDAsXHJcbiAgZHVyYXRpb246IFszNTAsIDMwMF0sXHJcbiAgaW50ZXJhY3RpdmU6IGZhbHNlLFxyXG4gIGludGVyYWN0aXZlQm9yZGVyOiAyLFxyXG4gIHRoZW1lOiAnZGFyaycsXHJcbiAgc2l6ZTogJ3JlZ3VsYXInLFxyXG4gIGRpc3RhbmNlOiAxMCxcclxuICBvZmZzZXQ6IDAsXHJcbiAgaGlkZU9uQ2xpY2s6IHRydWUsXHJcbiAgbXVsdGlwbGU6IGZhbHNlLFxyXG4gIGZvbGxvd0N1cnNvcjogZmFsc2UsXHJcbiAgaW5lcnRpYTogZmFsc2UsXHJcbiAgdXBkYXRlRHVyYXRpb246IDM1MCxcclxuICBzdGlja3k6IGZhbHNlLFxyXG4gIGFwcGVuZFRvOiBmdW5jdGlvbiBhcHBlbmRUbygpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5ib2R5O1xyXG4gIH0sXHJcbiAgekluZGV4OiA5OTk5LFxyXG4gIHRvdWNoSG9sZDogZmFsc2UsXHJcbiAgcGVyZm9ybWFuY2U6IGZhbHNlLFxyXG4gIGR5bmFtaWNUaXRsZTogZmFsc2UsXHJcbiAgZmxpcDogdHJ1ZSxcclxuICBmbGlwQmVoYXZpb3I6ICdmbGlwJyxcclxuICBhcnJvd1R5cGU6ICdzaGFycCcsXHJcbiAgYXJyb3dUcmFuc2Zvcm06ICcnLFxyXG4gIG1heFdpZHRoOiAnJyxcclxuICB0YXJnZXQ6IG51bGwsXHJcbiAgYWxsb3dUaXRsZUhUTUw6IHRydWUsXHJcbiAgcG9wcGVyT3B0aW9uczoge30sXHJcbiAgY3JlYXRlUG9wcGVySW5zdGFuY2VPbkluaXQ6IGZhbHNlLFxyXG4gIG9uU2hvdzogZnVuY3Rpb24gb25TaG93KCkge30sXHJcbiAgb25TaG93bjogZnVuY3Rpb24gb25TaG93bigpIHt9LFxyXG4gIG9uSGlkZTogZnVuY3Rpb24gb25IaWRlKCkge30sXHJcbiAgb25IaWRkZW46IGZ1bmN0aW9uIG9uSGlkZGVuKCkge31cclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGUga2V5cyBvZiB0aGUgZGVmYXVsdHMgb2JqZWN0IGZvciByZWR1Y2luZyBkb3duIGludG8gYSBuZXcgb2JqZWN0XHJcbiAqIFVzZWQgaW4gYGdldEluZGl2aWR1YWxPcHRpb25zKClgXHJcbiAqL1xyXG52YXIgZGVmYXVsdHNLZXlzID0gYnJvd3Nlci5zdXBwb3J0ZWQgJiYgT2JqZWN0LmtleXMoZGVmYXVsdHMpO1xyXG5cclxuLyoqXHJcbiAqIERldGVybWluZXMgaWYgYSB2YWx1ZSBpcyBhbiBvYmplY3QgbGl0ZXJhbFxyXG4gKiBAcGFyYW0geyp9IHZhbHVlXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc09iamVjdExpdGVyYWwodmFsdWUpIHtcclxuICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xyXG59XHJcblxyXG4vKipcclxuICogUG9ueWZpbGwgZm9yIEFycmF5LmZyb21cclxuICogQHBhcmFtIHsqfSB2YWx1ZVxyXG4gKiBAcmV0dXJuIHtBcnJheX1cclxuICovXHJcbmZ1bmN0aW9uIHRvQXJyYXkodmFsdWUpIHtcclxuICByZXR1cm4gW10uc2xpY2UuY2FsbCh2YWx1ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIGVsZW1lbnRzIGJhc2VkIG9uIHRoZSBzZWxlY3RvciBpbnB1dFxyXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fEVsZW1lbnRbXXxOb2RlTGlzdHxPYmplY3R9IHNlbGVjdG9yXHJcbiAqIEByZXR1cm4ge0VsZW1lbnRbXX1cclxuICovXHJcbmZ1bmN0aW9uIGdldEFycmF5T2ZFbGVtZW50cyhzZWxlY3Rvcikge1xyXG4gIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIEVsZW1lbnQgfHwgaXNPYmplY3RMaXRlcmFsKHNlbGVjdG9yKSkge1xyXG4gICAgcmV0dXJuIFtzZWxlY3Rvcl07XHJcbiAgfVxyXG5cclxuICBpZiAoc2VsZWN0b3IgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgcmV0dXJuIHRvQXJyYXkoc2VsZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgaWYgKEFycmF5LmlzQXJyYXkoc2VsZWN0b3IpKSB7XHJcbiAgICByZXR1cm4gc2VsZWN0b3I7XHJcbiAgfVxyXG5cclxuICB0cnkge1xyXG4gICAgcmV0dXJuIHRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xyXG4gIH0gY2F0Y2ggKF8pIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQb2x5ZmlsbHMgbmVlZGVkIHByb3BzL21ldGhvZHMgZm9yIGEgdmlydHVhbCByZWZlcmVuY2Ugb2JqZWN0XHJcbiAqIE5PVEU6IGluIHYzLjAgdGhpcyB3aWxsIGJlIHB1cmVcclxuICogQHBhcmFtIHtPYmplY3R9IHJlZmVyZW5jZVxyXG4gKi9cclxuZnVuY3Rpb24gcG9seWZpbGxWaXJ0dWFsUmVmZXJlbmNlUHJvcHMocmVmZXJlbmNlKSB7XHJcbiAgcmVmZXJlbmNlLnJlZk9iaiA9IHRydWU7XHJcbiAgcmVmZXJlbmNlLmF0dHJpYnV0ZXMgPSByZWZlcmVuY2UuYXR0cmlidXRlcyB8fCB7fTtcclxuICByZWZlcmVuY2Uuc2V0QXR0cmlidXRlID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XHJcbiAgICByZWZlcmVuY2UuYXR0cmlidXRlc1trZXldID0gdmFsO1xyXG4gIH07XHJcbiAgcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgIHJldHVybiByZWZlcmVuY2UuYXR0cmlidXRlc1trZXldO1xyXG4gIH07XHJcbiAgcmVmZXJlbmNlLnJlbW92ZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgIGRlbGV0ZSByZWZlcmVuY2UuYXR0cmlidXRlc1trZXldO1xyXG4gIH07XHJcbiAgcmVmZXJlbmNlLmhhc0F0dHJpYnV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgIHJldHVybiBrZXkgaW4gcmVmZXJlbmNlLmF0dHJpYnV0ZXM7XHJcbiAgfTtcclxuICByZWZlcmVuY2UuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHt9O1xyXG4gIHJlZmVyZW5jZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKCkge307XHJcbiAgcmVmZXJlbmNlLmNsYXNzTGlzdCA9IHtcclxuICAgIGNsYXNzTmFtZXM6IHt9LFxyXG4gICAgYWRkOiBmdW5jdGlvbiBhZGQoa2V5KSB7XHJcbiAgICAgIHJldHVybiByZWZlcmVuY2UuY2xhc3NMaXN0LmNsYXNzTmFtZXNba2V5XSA9IHRydWU7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoa2V5KSB7XHJcbiAgICAgIGRlbGV0ZSByZWZlcmVuY2UuY2xhc3NMaXN0LmNsYXNzTmFtZXNba2V5XTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uIGNvbnRhaW5zKGtleSkge1xyXG4gICAgICByZXR1cm4ga2V5IGluIHJlZmVyZW5jZS5jbGFzc0xpc3QuY2xhc3NOYW1lcztcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgc3VwcG9ydGVkIHByZWZpeGVkIHByb3BlcnR5IC0gb25seSBgd2Via2l0YCBpcyBuZWVkZWQsIGBtb3pgLCBgbXNgIGFuZCBgb2AgYXJlIG9ic29sZXRlXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9IC0gYnJvd3NlciBzdXBwb3J0ZWQgcHJlZml4ZWQgcHJvcGVydHlcclxuICovXHJcbmZ1bmN0aW9uIHByZWZpeChwcm9wZXJ0eSkge1xyXG4gIHZhciBwcmVmaXhlcyA9IFsnJywgJ3dlYmtpdCddO1xyXG4gIHZhciB1cHBlclByb3AgPSBwcm9wZXJ0eS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnNsaWNlKDEpO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgX3ByZWZpeCA9IHByZWZpeGVzW2ldO1xyXG4gICAgdmFyIHByZWZpeGVkUHJvcCA9IF9wcmVmaXggPyBfcHJlZml4ICsgdXBwZXJQcm9wIDogcHJvcGVydHk7XHJcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50LmJvZHkuc3R5bGVbcHJlZml4ZWRQcm9wXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgcmV0dXJuIHByZWZpeGVkUHJvcDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhIGRpdiBlbGVtZW50XHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5mdW5jdGlvbiBkaXYoKSB7XHJcbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhIHBvcHBlciBlbGVtZW50IHRoZW4gcmV0dXJucyBpdFxyXG4gKiBAcGFyYW0ge051bWJlcn0gaWQgLSB0aGUgcG9wcGVyIGlkXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0aXRsZSAtIHRoZSB0b29sdGlwJ3MgYHRpdGxlYCBhdHRyaWJ1dGVcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBpbmRpdmlkdWFsIG9wdGlvbnNcclxuICogQHJldHVybiB7RWxlbWVudH0gLSB0aGUgcG9wcGVyIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVBvcHBlckVsZW1lbnQoaWQsIHRpdGxlLCBvcHRpb25zKSB7XHJcbiAgdmFyIHBvcHBlciA9IGRpdigpO1xyXG4gIHBvcHBlci5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RpcHB5LXBvcHBlcicpO1xyXG4gIHBvcHBlci5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndG9vbHRpcCcpO1xyXG4gIHBvcHBlci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3RpcHB5LScgKyBpZCk7XHJcbiAgcG9wcGVyLnN0eWxlLnpJbmRleCA9IG9wdGlvbnMuekluZGV4O1xyXG4gIHBvcHBlci5zdHlsZS5tYXhXaWR0aCA9IG9wdGlvbnMubWF4V2lkdGg7XHJcblxyXG4gIHZhciB0b29sdGlwID0gZGl2KCk7XHJcbiAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RpcHB5LXRvb2x0aXAnKTtcclxuICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnZGF0YS1zaXplJywgb3B0aW9ucy5zaXplKTtcclxuICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnZGF0YS1hbmltYXRpb24nLCBvcHRpb25zLmFuaW1hdGlvbik7XHJcbiAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdGUnLCAnaGlkZGVuJyk7XHJcbiAgb3B0aW9ucy50aGVtZS5zcGxpdCgnICcpLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcclxuICAgIHRvb2x0aXAuY2xhc3NMaXN0LmFkZCh0ICsgJy10aGVtZScpO1xyXG4gIH0pO1xyXG5cclxuICB2YXIgY29udGVudCA9IGRpdigpO1xyXG4gIGNvbnRlbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0aXBweS1jb250ZW50Jyk7XHJcblxyXG4gIGlmIChvcHRpb25zLmFycm93KSB7XHJcbiAgICB2YXIgYXJyb3cgPSBkaXYoKTtcclxuICAgIGFycm93LnN0eWxlW3ByZWZpeCgndHJhbnNmb3JtJyldID0gb3B0aW9ucy5hcnJvd1RyYW5zZm9ybTtcclxuXHJcbiAgICBpZiAob3B0aW9ucy5hcnJvd1R5cGUgPT09ICdyb3VuZCcpIHtcclxuICAgICAgYXJyb3cuY2xhc3NMaXN0LmFkZCgndGlwcHktcm91bmRhcnJvdycpO1xyXG4gICAgICBhcnJvdy5pbm5lckhUTUwgPSAnPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDhcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIk0zIDhzMi4wMjEtLjAxNSA1LjI1My00LjIxOEM5LjU4NCAyLjA1MSAxMC43OTcgMS4wMDcgMTIgMWMxLjIwMy0uMDA3IDIuNDE2IDEuMDM1IDMuNzYxIDIuNzgyQzE5LjAxMiA4LjAwNSAyMSA4IDIxIDhIM3pcIi8+PC9zdmc+JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFycm93LmNsYXNzTGlzdC5hZGQoJ3RpcHB5LWFycm93Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9vbHRpcC5hcHBlbmRDaGlsZChhcnJvdyk7XHJcbiAgfVxyXG5cclxuICBpZiAob3B0aW9ucy5hbmltYXRlRmlsbCkge1xyXG4gICAgLy8gQ3JlYXRlIGFuaW1hdGVGaWxsIGNpcmNsZSBlbGVtZW50IGZvciBhbmltYXRpb25cclxuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLWFuaW1hdGVmaWxsJywgJycpO1xyXG4gICAgdmFyIGJhY2tkcm9wID0gZGl2KCk7XHJcbiAgICBiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCd0aXBweS1iYWNrZHJvcCcpO1xyXG4gICAgYmFja2Ryb3Auc2V0QXR0cmlidXRlKCdkYXRhLXN0YXRlJywgJ2hpZGRlbicpO1xyXG4gICAgdG9vbHRpcC5hcHBlbmRDaGlsZChiYWNrZHJvcCk7XHJcbiAgfVxyXG5cclxuICBpZiAob3B0aW9ucy5pbmVydGlhKSB7XHJcbiAgICAvLyBDaGFuZ2UgdHJhbnNpdGlvbiB0aW1pbmcgZnVuY3Rpb24gY3ViaWMgYmV6aWVyXHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnZGF0YS1pbmVydGlhJywgJycpO1xyXG4gIH1cclxuXHJcbiAgaWYgKG9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcclxuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLWludGVyYWN0aXZlJywgJycpO1xyXG4gIH1cclxuXHJcbiAgdmFyIGh0bWwgPSBvcHRpb25zLmh0bWw7XHJcbiAgaWYgKGh0bWwpIHtcclxuICAgIHZhciB0ZW1wbGF0ZUlkID0gdm9pZCAwO1xyXG5cclxuICAgIGlmIChodG1sIGluc3RhbmNlb2YgRWxlbWVudCkge1xyXG4gICAgICBjb250ZW50LmFwcGVuZENoaWxkKGh0bWwpO1xyXG4gICAgICB0ZW1wbGF0ZUlkID0gJyMnICsgKGh0bWwuaWQgfHwgJ3RpcHB5LWh0bWwtdGVtcGxhdGUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIHRyaWNrIGxpbnRlcnM6IGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9taWtzL3RpcHB5anMvaXNzdWVzLzE5N1xyXG4gICAgICBjb250ZW50W3RydWUgJiYgJ2lubmVySFRNTCddID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihodG1sKVt0cnVlICYmICdpbm5lckhUTUwnXTtcclxuICAgICAgdGVtcGxhdGVJZCA9IGh0bWw7XHJcbiAgICB9XHJcblxyXG4gICAgcG9wcGVyLnNldEF0dHJpYnV0ZSgnZGF0YS1odG1sJywgJycpO1xyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGVtcGxhdGUtaWQnLCB0ZW1wbGF0ZUlkKTtcclxuXHJcbiAgICBpZiAob3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xyXG4gICAgICBwb3BwZXIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBjb250ZW50W29wdGlvbnMuYWxsb3dUaXRsZUhUTUwgPyAnaW5uZXJIVE1MJyA6ICd0ZXh0Q29udGVudCddID0gdGl0bGU7XHJcbiAgfVxyXG5cclxuICB0b29sdGlwLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG4gIHBvcHBlci5hcHBlbmRDaGlsZCh0b29sdGlwKTtcclxuXHJcbiAgcmV0dXJuIHBvcHBlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSB0cmlnZ2VyIGJ5IGFkZGluZyB0aGUgbmVjZXNzYXJ5IGV2ZW50IGxpc3RlbmVycyB0byB0aGUgcmVmZXJlbmNlIGVsZW1lbnRcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50VHlwZSAtIHRoZSBjdXN0b20gZXZlbnQgc3BlY2lmaWVkIGluIHRoZSBgdHJpZ2dlcmAgc2V0dGluZ1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHJlZmVyZW5jZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gaGFuZGxlcnMgLSB0aGUgaGFuZGxlcnMgZm9yIGVhY2ggZXZlbnRcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICogQHJldHVybiB7QXJyYXl9IC0gYXJyYXkgb2YgbGlzdGVuZXIgb2JqZWN0c1xyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlVHJpZ2dlcihldmVudFR5cGUsIHJlZmVyZW5jZSwgaGFuZGxlcnMsIG9wdGlvbnMpIHtcclxuICB2YXIgb25UcmlnZ2VyID0gaGFuZGxlcnMub25UcmlnZ2VyLFxyXG4gICAgICBvbk1vdXNlTGVhdmUgPSBoYW5kbGVycy5vbk1vdXNlTGVhdmUsXHJcbiAgICAgIG9uQmx1ciA9IGhhbmRsZXJzLm9uQmx1cixcclxuICAgICAgb25EZWxlZ2F0ZVNob3cgPSBoYW5kbGVycy5vbkRlbGVnYXRlU2hvdyxcclxuICAgICAgb25EZWxlZ2F0ZUhpZGUgPSBoYW5kbGVycy5vbkRlbGVnYXRlSGlkZTtcclxuXHJcbiAgdmFyIGxpc3RlbmVycyA9IFtdO1xyXG5cclxuICBpZiAoZXZlbnRUeXBlID09PSAnbWFudWFsJykgcmV0dXJuIGxpc3RlbmVycztcclxuXHJcbiAgdmFyIG9uID0gZnVuY3Rpb24gb24oZXZlbnRUeXBlLCBoYW5kbGVyKSB7XHJcbiAgICByZWZlcmVuY2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGhhbmRsZXIpO1xyXG4gICAgbGlzdGVuZXJzLnB1c2goeyBldmVudDogZXZlbnRUeXBlLCBoYW5kbGVyOiBoYW5kbGVyIH0pO1xyXG4gIH07XHJcblxyXG4gIGlmICghb3B0aW9ucy50YXJnZXQpIHtcclxuICAgIG9uKGV2ZW50VHlwZSwgb25UcmlnZ2VyKTtcclxuXHJcbiAgICBpZiAoYnJvd3Nlci5zdXBwb3J0c1RvdWNoICYmIG9wdGlvbnMudG91Y2hIb2xkKSB7XHJcbiAgICAgIG9uKCd0b3VjaHN0YXJ0Jywgb25UcmlnZ2VyKTtcclxuICAgICAgb24oJ3RvdWNoZW5kJywgb25Nb3VzZUxlYXZlKTtcclxuICAgIH1cclxuICAgIGlmIChldmVudFR5cGUgPT09ICdtb3VzZWVudGVyJykge1xyXG4gICAgICBvbignbW91c2VsZWF2ZScsIG9uTW91c2VMZWF2ZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnRUeXBlID09PSAnZm9jdXMnKSB7XHJcbiAgICAgIG9uKGlzSUUgPyAnZm9jdXNvdXQnIDogJ2JsdXInLCBvbkJsdXIpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoYnJvd3Nlci5zdXBwb3J0c1RvdWNoICYmIG9wdGlvbnMudG91Y2hIb2xkKSB7XHJcbiAgICAgIG9uKCd0b3VjaHN0YXJ0Jywgb25EZWxlZ2F0ZVNob3cpO1xyXG4gICAgICBvbigndG91Y2hlbmQnLCBvbkRlbGVnYXRlSGlkZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnRUeXBlID09PSAnbW91c2VlbnRlcicpIHtcclxuICAgICAgb24oJ21vdXNlb3ZlcicsIG9uRGVsZWdhdGVTaG93KTtcclxuICAgICAgb24oJ21vdXNlb3V0Jywgb25EZWxlZ2F0ZUhpZGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50VHlwZSA9PT0gJ2ZvY3VzJykge1xyXG4gICAgICBvbignZm9jdXNpbicsIG9uRGVsZWdhdGVTaG93KTtcclxuICAgICAgb24oJ2ZvY3Vzb3V0Jywgb25EZWxlZ2F0ZUhpZGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50VHlwZSA9PT0gJ2NsaWNrJykge1xyXG4gICAgICBvbignY2xpY2snLCBvbkRlbGVnYXRlU2hvdyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbGlzdGVuZXJzO1xyXG59XHJcblxyXG52YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XHJcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XHJcbiAgfVxyXG59O1xyXG5cclxudmFyIGNyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xyXG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xyXG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XHJcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcclxuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcclxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcclxuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XHJcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcclxuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcclxuICB9O1xyXG59KCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcclxuXHJcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XHJcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRhcmdldDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIG9iamVjdCBvZiBzZXR0aW5ncyB0byBvdmVycmlkZSBnbG9iYWwgc2V0dGluZ3NcclxuICogQHBhcmFtIHtFbGVtZW50fSByZWZlcmVuY2VcclxuICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlT3B0aW9uc1xyXG4gKiBAcmV0dXJuIHtPYmplY3R9IC0gaW5kaXZpZHVhbCBvcHRpb25zXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRJbmRpdmlkdWFsT3B0aW9ucyhyZWZlcmVuY2UsIGluc3RhbmNlT3B0aW9ucykge1xyXG4gIHZhciBvcHRpb25zID0gZGVmYXVsdHNLZXlzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBrZXkpIHtcclxuICAgIHZhciB2YWwgPSByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCdkYXRhLXRpcHB5LScgKyBrZXkudG9Mb3dlckNhc2UoKSkgfHwgaW5zdGFuY2VPcHRpb25zW2tleV07XHJcblxyXG4gICAgLy8gQ29udmVydCBzdHJpbmdzIHRvIGJvb2xlYW5zXHJcbiAgICBpZiAodmFsID09PSAnZmFsc2UnKSB2YWwgPSBmYWxzZTtcclxuICAgIGlmICh2YWwgPT09ICd0cnVlJykgdmFsID0gdHJ1ZTtcclxuXHJcbiAgICAvLyBDb252ZXJ0IG51bWJlciBzdHJpbmdzIHRvIHRydWUgbnVtYmVyc1xyXG4gICAgaWYgKGlzRmluaXRlKHZhbCkgJiYgIWlzTmFOKHBhcnNlRmxvYXQodmFsKSkpIHtcclxuICAgICAgdmFsID0gcGFyc2VGbG9hdCh2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbnZlcnQgYXJyYXkgc3RyaW5ncyB0byBhY3R1YWwgYXJyYXlzXHJcbiAgICBpZiAoa2V5ICE9PSAndGFyZ2V0JyAmJiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyAmJiB2YWwudHJpbSgpLmNoYXJBdCgwKSA9PT0gJ1snKSB7XHJcbiAgICAgIHZhbCA9IEpTT04ucGFyc2UodmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBhY2Nba2V5XSA9IHZhbDtcclxuXHJcbiAgICByZXR1cm4gYWNjO1xyXG4gIH0sIHt9KTtcclxuXHJcbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBpbnN0YW5jZU9wdGlvbnMsIG9wdGlvbnMpO1xyXG59XHJcblxyXG4vKipcclxuICogRXZhbHVhdGVzL21vZGlmaWVzIHRoZSBvcHRpb25zIG9iamVjdCBmb3IgYXBwcm9wcmlhdGUgYmVoYXZpb3JcclxuICogQHBhcmFtIHtFbGVtZW50fE9iamVjdH0gcmVmZXJlbmNlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAqIEByZXR1cm4ge09iamVjdH0gbW9kaWZpZWQvZXZhbHVhdGVkIG9wdGlvbnNcclxuICovXHJcbmZ1bmN0aW9uIGV2YWx1YXRlT3B0aW9ucyhyZWZlcmVuY2UsIG9wdGlvbnMpIHtcclxuICAvLyBhbmltYXRlRmlsbCBpcyBkaXNhYmxlZCBpZiBhbiBhcnJvdyBpcyB0cnVlXHJcbiAgaWYgKG9wdGlvbnMuYXJyb3cpIHtcclxuICAgIG9wdGlvbnMuYW5pbWF0ZUZpbGwgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLmFwcGVuZFRvICYmIHR5cGVvZiBvcHRpb25zLmFwcGVuZFRvID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBvcHRpb25zLmFwcGVuZFRvID0gb3B0aW9ucy5hcHBlbmRUbygpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHR5cGVvZiBvcHRpb25zLmh0bWwgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIG9wdGlvbnMuaHRtbCA9IG9wdGlvbnMuaHRtbChyZWZlcmVuY2UpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG9wdGlvbnM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGlubmVyIGVsZW1lbnRzIG9mIHRoZSBwb3BwZXIgZWxlbWVudFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlclxyXG4gKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRJbm5lckVsZW1lbnRzKHBvcHBlcikge1xyXG4gIHZhciBzZWxlY3QgPSBmdW5jdGlvbiBzZWxlY3Qocykge1xyXG4gICAgcmV0dXJuIHBvcHBlci5xdWVyeVNlbGVjdG9yKHMpO1xyXG4gIH07XHJcbiAgcmV0dXJuIHtcclxuICAgIHRvb2x0aXA6IHNlbGVjdChzZWxlY3RvcnMuVE9PTFRJUCksXHJcbiAgICBiYWNrZHJvcDogc2VsZWN0KHNlbGVjdG9ycy5CQUNLRFJPUCksXHJcbiAgICBjb250ZW50OiBzZWxlY3Qoc2VsZWN0b3JzLkNPTlRFTlQpLFxyXG4gICAgYXJyb3c6IHNlbGVjdChzZWxlY3RvcnMuQVJST1cpIHx8IHNlbGVjdChzZWxlY3RvcnMuUk9VTkRfQVJST1cpXHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJlbW92ZXMgdGhlIHRpdGxlIGZyb20gYW4gZWxlbWVudCwgc2V0dGluZyBgZGF0YS1vcmlnaW5hbC10aXRsZWBcclxuICogYXBwcm9wcmlhdGVseVxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXHJcbiAqL1xyXG5mdW5jdGlvbiByZW1vdmVUaXRsZShlbCkge1xyXG4gIHZhciB0aXRsZSA9IGVsLmdldEF0dHJpYnV0ZSgndGl0bGUnKTtcclxuICAvLyBPbmx5IHNldCBgZGF0YS1vcmlnaW5hbC10aXRsZWAgYXR0ciBpZiB0aGVyZSBpcyBhIHRpdGxlXHJcbiAgaWYgKHRpdGxlKSB7XHJcbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnLCB0aXRsZSk7XHJcbiAgfVxyXG4gIGVsLnJlbW92ZUF0dHJpYnV0ZSgndGl0bGUnKTtcclxufVxyXG5cclxuLyoqIVxyXG4gKiBAZmlsZU92ZXJ2aWV3IEtpY2thc3MgbGlicmFyeSB0byBjcmVhdGUgYW5kIHBsYWNlIHBvcHBlcnMgbmVhciB0aGVpciByZWZlcmVuY2UgZWxlbWVudHMuXHJcbiAqIEB2ZXJzaW9uIDEuMTQuM1xyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYgRmVkZXJpY28gWml2b2xvIGFuZCBjb250cmlidXRvcnNcclxuICpcclxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuICpcclxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXHJcbiAqIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcbiAqXHJcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXHJcbiAqIFNPRlRXQVJFLlxyXG4gKi9cclxudmFyIGlzQnJvd3NlciQxID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJztcclxuXHJcbnZhciBsb25nZXJUaW1lb3V0QnJvd3NlcnMgPSBbJ0VkZ2UnLCAnVHJpZGVudCcsICdGaXJlZm94J107XHJcbnZhciB0aW1lb3V0RHVyYXRpb24gPSAwO1xyXG5mb3IgKHZhciBpID0gMDsgaSA8IGxvbmdlclRpbWVvdXRCcm93c2Vycy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gIGlmIChpc0Jyb3dzZXIkMSAmJiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YobG9uZ2VyVGltZW91dEJyb3dzZXJzW2ldKSA+PSAwKSB7XHJcbiAgICB0aW1lb3V0RHVyYXRpb24gPSAxO1xyXG4gICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtaWNyb3Rhc2tEZWJvdW5jZShmbikge1xyXG4gIHZhciBjYWxsZWQgPSBmYWxzZTtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKGNhbGxlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjYWxsZWQgPSB0cnVlO1xyXG4gICAgd2luZG93LlByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICBjYWxsZWQgPSBmYWxzZTtcclxuICAgICAgZm4oKTtcclxuICAgIH0pO1xyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRhc2tEZWJvdW5jZShmbikge1xyXG4gIHZhciBzY2hlZHVsZWQgPSBmYWxzZTtcclxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCFzY2hlZHVsZWQpIHtcclxuICAgICAgc2NoZWR1bGVkID0gdHJ1ZTtcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2NoZWR1bGVkID0gZmFsc2U7XHJcbiAgICAgICAgZm4oKTtcclxuICAgICAgfSwgdGltZW91dER1cmF0aW9uKTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG52YXIgc3VwcG9ydHNNaWNyb1Rhc2tzID0gaXNCcm93c2VyJDEgJiYgd2luZG93LlByb21pc2U7XHJcblxyXG4vKipcclxuKiBDcmVhdGUgYSBkZWJvdW5jZWQgdmVyc2lvbiBvZiBhIG1ldGhvZCwgdGhhdCdzIGFzeW5jaHJvbm91c2x5IGRlZmVycmVkXHJcbiogYnV0IGNhbGxlZCBpbiB0aGUgbWluaW11bSB0aW1lIHBvc3NpYmxlLlxyXG4qXHJcbiogQG1ldGhvZFxyXG4qIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuKiBAYXJndW1lbnQge0Z1bmN0aW9ufSBmblxyXG4qIEByZXR1cm5zIHtGdW5jdGlvbn1cclxuKi9cclxudmFyIGRlYm91bmNlID0gc3VwcG9ydHNNaWNyb1Rhc2tzID8gbWljcm90YXNrRGVib3VuY2UgOiB0YXNrRGVib3VuY2U7XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIGEgZnVuY3Rpb25cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7QW55fSBmdW5jdGlvblRvQ2hlY2sgLSB2YXJpYWJsZSB0byBjaGVja1xyXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gYW5zd2VyIHRvOiBpcyBhIGZ1bmN0aW9uP1xyXG4gKi9cclxuZnVuY3Rpb24gaXNGdW5jdGlvbihmdW5jdGlvblRvQ2hlY2spIHtcclxuICB2YXIgZ2V0VHlwZSA9IHt9O1xyXG4gIHJldHVybiBmdW5jdGlvblRvQ2hlY2sgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKGZ1bmN0aW9uVG9DaGVjaykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgQ1NTIGNvbXB1dGVkIHByb3BlcnR5IG9mIHRoZSBnaXZlbiBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VlbWVudH0gZWxlbWVudFxyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gcHJvcGVydHlcclxuICovXHJcbmZ1bmN0aW9uIGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShlbGVtZW50LCBwcm9wZXJ0eSkge1xyXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG4gIC8vIE5PVEU6IDEgRE9NIGFjY2VzcyBoZXJlXHJcbiAgdmFyIGNzcyA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7XHJcbiAgcmV0dXJuIHByb3BlcnR5ID8gY3NzW3Byb3BlcnR5XSA6IGNzcztcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHBhcmVudE5vZGUgb3IgdGhlIGhvc3Qgb2YgdGhlIGVsZW1lbnRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7RWxlbWVudH0gcGFyZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRQYXJlbnROb2RlKGVsZW1lbnQpIHtcclxuICBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XHJcbiAgICByZXR1cm4gZWxlbWVudDtcclxuICB9XHJcbiAgcmV0dXJuIGVsZW1lbnQucGFyZW50Tm9kZSB8fCBlbGVtZW50Lmhvc3Q7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBzY3JvbGxpbmcgcGFyZW50IG9mIHRoZSBnaXZlbiBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybnMge0VsZW1lbnR9IHNjcm9sbCBwYXJlbnRcclxuICovXHJcbmZ1bmN0aW9uIGdldFNjcm9sbFBhcmVudChlbGVtZW50KSB7XHJcbiAgLy8gUmV0dXJuIGJvZHksIGBnZXRTY3JvbGxgIHdpbGwgdGFrZSBjYXJlIHRvIGdldCB0aGUgY29ycmVjdCBgc2Nyb2xsVG9wYCBmcm9tIGl0XHJcbiAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuYm9keTtcclxuICB9XHJcblxyXG4gIHN3aXRjaCAoZWxlbWVudC5ub2RlTmFtZSkge1xyXG4gICAgY2FzZSAnSFRNTCc6XHJcbiAgICBjYXNlICdCT0RZJzpcclxuICAgICAgcmV0dXJuIGVsZW1lbnQub3duZXJEb2N1bWVudC5ib2R5O1xyXG4gICAgY2FzZSAnI2RvY3VtZW50JzpcclxuICAgICAgcmV0dXJuIGVsZW1lbnQuYm9keTtcclxuICB9XHJcblxyXG4gIC8vIEZpcmVmb3ggd2FudCB1cyB0byBjaGVjayBgLXhgIGFuZCBgLXlgIHZhcmlhdGlvbnMgYXMgd2VsbFxyXG5cclxuICB2YXIgX2dldFN0eWxlQ29tcHV0ZWRQcm9wID0gZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KGVsZW1lbnQpLFxyXG4gICAgICBvdmVyZmxvdyA9IF9nZXRTdHlsZUNvbXB1dGVkUHJvcC5vdmVyZmxvdyxcclxuICAgICAgb3ZlcmZsb3dYID0gX2dldFN0eWxlQ29tcHV0ZWRQcm9wLm92ZXJmbG93WCxcclxuICAgICAgb3ZlcmZsb3dZID0gX2dldFN0eWxlQ29tcHV0ZWRQcm9wLm92ZXJmbG93WTtcclxuXHJcbiAgaWYgKC8oYXV0b3xzY3JvbGx8b3ZlcmxheSkvLnRlc3Qob3ZlcmZsb3cgKyBvdmVyZmxvd1kgKyBvdmVyZmxvd1gpKSB7XHJcbiAgICByZXR1cm4gZWxlbWVudDtcclxuICB9XHJcblxyXG4gIHJldHVybiBnZXRTY3JvbGxQYXJlbnQoZ2V0UGFyZW50Tm9kZShlbGVtZW50KSk7XHJcbn1cclxuXHJcbnZhciBpc0lFMTEgPSBpc0Jyb3dzZXIkMSAmJiAhISh3aW5kb3cuTVNJbnB1dE1ldGhvZENvbnRleHQgJiYgZG9jdW1lbnQuZG9jdW1lbnRNb2RlKTtcclxudmFyIGlzSUUxMCA9IGlzQnJvd3NlciQxICYmIC9NU0lFIDEwLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG5cclxuLyoqXHJcbiAqIERldGVybWluZXMgaWYgdGhlIGJyb3dzZXIgaXMgSW50ZXJuZXQgRXhwbG9yZXJcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB2ZXJzaW9uIHRvIGNoZWNrXHJcbiAqIEByZXR1cm5zIHtCb29sZWFufSBpc0lFXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0lFJDEodmVyc2lvbikge1xyXG4gIGlmICh2ZXJzaW9uID09PSAxMSkge1xyXG4gICAgcmV0dXJuIGlzSUUxMTtcclxuICB9XHJcbiAgaWYgKHZlcnNpb24gPT09IDEwKSB7XHJcbiAgICByZXR1cm4gaXNJRTEwO1xyXG4gIH1cclxuICByZXR1cm4gaXNJRTExIHx8IGlzSUUxMDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIG9mZnNldCBwYXJlbnQgb2YgdGhlIGdpdmVuIGVsZW1lbnRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7RWxlbWVudH0gb2Zmc2V0IHBhcmVudFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0T2Zmc2V0UGFyZW50KGVsZW1lbnQpIHtcclxuICBpZiAoIWVsZW1lbnQpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICB2YXIgbm9PZmZzZXRQYXJlbnQgPSBpc0lFJDEoMTApID8gZG9jdW1lbnQuYm9keSA6IG51bGw7XHJcblxyXG4gIC8vIE5PVEU6IDEgRE9NIGFjY2VzcyBoZXJlXHJcbiAgdmFyIG9mZnNldFBhcmVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50O1xyXG4gIC8vIFNraXAgaGlkZGVuIGVsZW1lbnRzIHdoaWNoIGRvbid0IGhhdmUgYW4gb2Zmc2V0UGFyZW50XHJcbiAgd2hpbGUgKG9mZnNldFBhcmVudCA9PT0gbm9PZmZzZXRQYXJlbnQgJiYgZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcpIHtcclxuICAgIG9mZnNldFBhcmVudCA9IChlbGVtZW50ID0gZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcpLm9mZnNldFBhcmVudDtcclxuICB9XHJcblxyXG4gIHZhciBub2RlTmFtZSA9IG9mZnNldFBhcmVudCAmJiBvZmZzZXRQYXJlbnQubm9kZU5hbWU7XHJcblxyXG4gIGlmICghbm9kZU5hbWUgfHwgbm9kZU5hbWUgPT09ICdCT0RZJyB8fCBub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XHJcbiAgICByZXR1cm4gZWxlbWVudCA/IGVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgOiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICAvLyAub2Zmc2V0UGFyZW50IHdpbGwgcmV0dXJuIHRoZSBjbG9zZXN0IFREIG9yIFRBQkxFIGluIGNhc2VcclxuICAvLyBubyBvZmZzZXRQYXJlbnQgaXMgcHJlc2VudCwgSSBoYXRlIHRoaXMgam9iLi4uXHJcbiAgaWYgKFsnVEQnLCAnVEFCTEUnXS5pbmRleE9mKG9mZnNldFBhcmVudC5ub2RlTmFtZSkgIT09IC0xICYmIGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShvZmZzZXRQYXJlbnQsICdwb3NpdGlvbicpID09PSAnc3RhdGljJykge1xyXG4gICAgcmV0dXJuIGdldE9mZnNldFBhcmVudChvZmZzZXRQYXJlbnQpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG9mZnNldFBhcmVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNPZmZzZXRDb250YWluZXIoZWxlbWVudCkge1xyXG4gIHZhciBub2RlTmFtZSA9IGVsZW1lbnQubm9kZU5hbWU7XHJcblxyXG4gIGlmIChub2RlTmFtZSA9PT0gJ0JPRFknKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHJldHVybiBub2RlTmFtZSA9PT0gJ0hUTUwnIHx8IGdldE9mZnNldFBhcmVudChlbGVtZW50LmZpcnN0RWxlbWVudENoaWxkKSA9PT0gZWxlbWVudDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZpbmRzIHRoZSByb290IG5vZGUgKGRvY3VtZW50LCBzaGFkb3dET00gcm9vdCkgb2YgdGhlIGdpdmVuIGVsZW1lbnRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gbm9kZVxyXG4gKiBAcmV0dXJucyB7RWxlbWVudH0gcm9vdCBub2RlXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSb290KG5vZGUpIHtcclxuICBpZiAobm9kZS5wYXJlbnROb2RlICE9PSBudWxsKSB7XHJcbiAgICByZXR1cm4gZ2V0Um9vdChub2RlLnBhcmVudE5vZGUpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5vZGU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGaW5kcyB0aGUgb2Zmc2V0IHBhcmVudCBjb21tb24gdG8gdGhlIHR3byBwcm92aWRlZCBub2Rlc1xyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50MVxyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnQyXHJcbiAqIEByZXR1cm5zIHtFbGVtZW50fSBjb21tb24gb2Zmc2V0IHBhcmVudFxyXG4gKi9cclxuZnVuY3Rpb24gZmluZENvbW1vbk9mZnNldFBhcmVudChlbGVtZW50MSwgZWxlbWVudDIpIHtcclxuICAvLyBUaGlzIGNoZWNrIGlzIG5lZWRlZCB0byBhdm9pZCBlcnJvcnMgaW4gY2FzZSBvbmUgb2YgdGhlIGVsZW1lbnRzIGlzbid0IGRlZmluZWQgZm9yIGFueSByZWFzb25cclxuICBpZiAoIWVsZW1lbnQxIHx8ICFlbGVtZW50MS5ub2RlVHlwZSB8fCAhZWxlbWVudDIgfHwgIWVsZW1lbnQyLm5vZGVUeXBlKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgLy8gSGVyZSB3ZSBtYWtlIHN1cmUgdG8gZ2l2ZSBhcyBcInN0YXJ0XCIgdGhlIGVsZW1lbnQgdGhhdCBjb21lcyBmaXJzdCBpbiB0aGUgRE9NXHJcbiAgdmFyIG9yZGVyID0gZWxlbWVudDEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oZWxlbWVudDIpICYgTm9kZS5ET0NVTUVOVF9QT1NJVElPTl9GT0xMT1dJTkc7XHJcbiAgdmFyIHN0YXJ0ID0gb3JkZXIgPyBlbGVtZW50MSA6IGVsZW1lbnQyO1xyXG4gIHZhciBlbmQgPSBvcmRlciA/IGVsZW1lbnQyIDogZWxlbWVudDE7XHJcblxyXG4gIC8vIEdldCBjb21tb24gYW5jZXN0b3IgY29udGFpbmVyXHJcbiAgdmFyIHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcclxuICByYW5nZS5zZXRTdGFydChzdGFydCwgMCk7XHJcbiAgcmFuZ2Uuc2V0RW5kKGVuZCwgMCk7XHJcbiAgdmFyIGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyID0gcmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XHJcblxyXG4gIC8vIEJvdGggbm9kZXMgYXJlIGluc2lkZSAjZG9jdW1lbnRcclxuXHJcbiAgaWYgKGVsZW1lbnQxICE9PSBjb21tb25BbmNlc3RvckNvbnRhaW5lciAmJiBlbGVtZW50MiAhPT0gY29tbW9uQW5jZXN0b3JDb250YWluZXIgfHwgc3RhcnQuY29udGFpbnMoZW5kKSkge1xyXG4gICAgaWYgKGlzT2Zmc2V0Q29udGFpbmVyKGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyKSkge1xyXG4gICAgICByZXR1cm4gY29tbW9uQW5jZXN0b3JDb250YWluZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGdldE9mZnNldFBhcmVudChjb21tb25BbmNlc3RvckNvbnRhaW5lcik7XHJcbiAgfVxyXG5cclxuICAvLyBvbmUgb2YgdGhlIG5vZGVzIGlzIGluc2lkZSBzaGFkb3dET00sIGZpbmQgd2hpY2ggb25lXHJcbiAgdmFyIGVsZW1lbnQxcm9vdCA9IGdldFJvb3QoZWxlbWVudDEpO1xyXG4gIGlmIChlbGVtZW50MXJvb3QuaG9zdCkge1xyXG4gICAgcmV0dXJuIGZpbmRDb21tb25PZmZzZXRQYXJlbnQoZWxlbWVudDFyb290Lmhvc3QsIGVsZW1lbnQyKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGZpbmRDb21tb25PZmZzZXRQYXJlbnQoZWxlbWVudDEsIGdldFJvb3QoZWxlbWVudDIpLmhvc3QpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdldHMgdGhlIHNjcm9sbCB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudCBpbiB0aGUgZ2l2ZW4gc2lkZSAodG9wIGFuZCBsZWZ0KVxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBzaWRlIGB0b3BgIG9yIGBsZWZ0YFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBhbW91bnQgb2Ygc2Nyb2xsZWQgcGl4ZWxzXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRTY3JvbGwoZWxlbWVudCkge1xyXG4gIHZhciBzaWRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAndG9wJztcclxuXHJcbiAgdmFyIHVwcGVyU2lkZSA9IHNpZGUgPT09ICd0b3AnID8gJ3Njcm9sbFRvcCcgOiAnc2Nyb2xsTGVmdCc7XHJcbiAgdmFyIG5vZGVOYW1lID0gZWxlbWVudC5ub2RlTmFtZTtcclxuXHJcbiAgaWYgKG5vZGVOYW1lID09PSAnQk9EWScgfHwgbm9kZU5hbWUgPT09ICdIVE1MJykge1xyXG4gICAgdmFyIGh0bWwgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgdmFyIHNjcm9sbGluZ0VsZW1lbnQgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudCB8fCBodG1sO1xyXG4gICAgcmV0dXJuIHNjcm9sbGluZ0VsZW1lbnRbdXBwZXJTaWRlXTtcclxuICB9XHJcblxyXG4gIHJldHVybiBlbGVtZW50W3VwcGVyU2lkZV07XHJcbn1cclxuXHJcbi8qXHJcbiAqIFN1bSBvciBzdWJ0cmFjdCB0aGUgZWxlbWVudCBzY3JvbGwgdmFsdWVzIChsZWZ0IGFuZCB0b3ApIGZyb20gYSBnaXZlbiByZWN0IG9iamVjdFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtPYmplY3R9IHJlY3QgLSBSZWN0IG9iamVjdCB5b3Ugd2FudCB0byBjaGFuZ2VcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFRoZSBlbGVtZW50IGZyb20gdGhlIGZ1bmN0aW9uIHJlYWRzIHRoZSBzY3JvbGwgdmFsdWVzXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc3VidHJhY3QgLSBzZXQgdG8gdHJ1ZSBpZiB5b3Ugd2FudCB0byBzdWJ0cmFjdCB0aGUgc2Nyb2xsIHZhbHVlc1xyXG4gKiBAcmV0dXJuIHtPYmplY3R9IHJlY3QgLSBUaGUgbW9kaWZpZXIgcmVjdCBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIGluY2x1ZGVTY3JvbGwocmVjdCwgZWxlbWVudCkge1xyXG4gIHZhciBzdWJ0cmFjdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XHJcblxyXG4gIHZhciBzY3JvbGxUb3AgPSBnZXRTY3JvbGwoZWxlbWVudCwgJ3RvcCcpO1xyXG4gIHZhciBzY3JvbGxMZWZ0ID0gZ2V0U2Nyb2xsKGVsZW1lbnQsICdsZWZ0Jyk7XHJcbiAgdmFyIG1vZGlmaWVyID0gc3VidHJhY3QgPyAtMSA6IDE7XHJcbiAgcmVjdC50b3AgKz0gc2Nyb2xsVG9wICogbW9kaWZpZXI7XHJcbiAgcmVjdC5ib3R0b20gKz0gc2Nyb2xsVG9wICogbW9kaWZpZXI7XHJcbiAgcmVjdC5sZWZ0ICs9IHNjcm9sbExlZnQgKiBtb2RpZmllcjtcclxuICByZWN0LnJpZ2h0ICs9IHNjcm9sbExlZnQgKiBtb2RpZmllcjtcclxuICByZXR1cm4gcmVjdDtcclxufVxyXG5cclxuLypcclxuICogSGVscGVyIHRvIGRldGVjdCBib3JkZXJzIG9mIGEgZ2l2ZW4gZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtDU1NTdHlsZURlY2xhcmF0aW9ufSBzdHlsZXNcclxuICogUmVzdWx0IG9mIGBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHlgIG9uIHRoZSBnaXZlbiBlbGVtZW50XHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBheGlzIC0gYHhgIG9yIGB5YFxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IGJvcmRlcnMgLSBUaGUgYm9yZGVycyBzaXplIG9mIHRoZSBnaXZlbiBheGlzXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZ2V0Qm9yZGVyc1NpemUoc3R5bGVzLCBheGlzKSB7XHJcbiAgdmFyIHNpZGVBID0gYXhpcyA9PT0gJ3gnID8gJ0xlZnQnIDogJ1RvcCc7XHJcbiAgdmFyIHNpZGVCID0gc2lkZUEgPT09ICdMZWZ0JyA/ICdSaWdodCcgOiAnQm90dG9tJztcclxuXHJcbiAgcmV0dXJuIHBhcnNlRmxvYXQoc3R5bGVzWydib3JkZXInICsgc2lkZUEgKyAnV2lkdGgnXSwgMTApICsgcGFyc2VGbG9hdChzdHlsZXNbJ2JvcmRlcicgKyBzaWRlQiArICdXaWR0aCddLCAxMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNpemUoYXhpcywgYm9keSwgaHRtbCwgY29tcHV0ZWRTdHlsZSkge1xyXG4gIHJldHVybiBNYXRoLm1heChib2R5WydvZmZzZXQnICsgYXhpc10sIGJvZHlbJ3Njcm9sbCcgKyBheGlzXSwgaHRtbFsnY2xpZW50JyArIGF4aXNdLCBodG1sWydvZmZzZXQnICsgYXhpc10sIGh0bWxbJ3Njcm9sbCcgKyBheGlzXSwgaXNJRSQxKDEwKSA/IGh0bWxbJ29mZnNldCcgKyBheGlzXSArIGNvbXB1dGVkU3R5bGVbJ21hcmdpbicgKyAoYXhpcyA9PT0gJ0hlaWdodCcgPyAnVG9wJyA6ICdMZWZ0JyldICsgY29tcHV0ZWRTdHlsZVsnbWFyZ2luJyArIChheGlzID09PSAnSGVpZ2h0JyA/ICdCb3R0b20nIDogJ1JpZ2h0JyldIDogMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFdpbmRvd1NpemVzKCkge1xyXG4gIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICB2YXIgaHRtbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICB2YXIgY29tcHV0ZWRTdHlsZSA9IGlzSUUkMSgxMCkgJiYgZ2V0Q29tcHV0ZWRTdHlsZShodG1sKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGhlaWdodDogZ2V0U2l6ZSgnSGVpZ2h0JywgYm9keSwgaHRtbCwgY29tcHV0ZWRTdHlsZSksXHJcbiAgICB3aWR0aDogZ2V0U2l6ZSgnV2lkdGgnLCBib2R5LCBodG1sLCBjb21wdXRlZFN0eWxlKVxyXG4gIH07XHJcbn1cclxuXHJcbnZhciBjbGFzc0NhbGxDaGVjayQxID0gZnVuY3Rpb24gY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XHJcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XHJcbiAgfVxyXG59O1xyXG5cclxudmFyIGNyZWF0ZUNsYXNzJDEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XHJcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcclxuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xyXG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xyXG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcclxuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xyXG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xyXG4gIH07XHJcbn0oKTtcclxuXHJcbnZhciBkZWZpbmVQcm9wZXJ0eSQxID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XHJcbiAgaWYgKGtleSBpbiBvYmopIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xyXG4gICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgd3JpdGFibGU6IHRydWVcclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG9iajtcclxufTtcclxuXHJcbnZhciBfZXh0ZW5kcyQxID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XHJcblxyXG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xyXG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0YXJnZXQ7XHJcbn07XHJcblxyXG4vKipcclxuICogR2l2ZW4gZWxlbWVudCBvZmZzZXRzLCBnZW5lcmF0ZSBhbiBvdXRwdXQgc2ltaWxhciB0byBnZXRCb3VuZGluZ0NsaWVudFJlY3RcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvZmZzZXRzXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IENsaWVudFJlY3QgbGlrZSBvdXRwdXRcclxuICovXHJcbmZ1bmN0aW9uIGdldENsaWVudFJlY3Qob2Zmc2V0cykge1xyXG4gIHJldHVybiBfZXh0ZW5kcyQxKHt9LCBvZmZzZXRzLCB7XHJcbiAgICByaWdodDogb2Zmc2V0cy5sZWZ0ICsgb2Zmc2V0cy53aWR0aCxcclxuICAgIGJvdHRvbTogb2Zmc2V0cy50b3AgKyBvZmZzZXRzLmhlaWdodFxyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IGJvdW5kaW5nIGNsaWVudCByZWN0IG9mIGdpdmVuIGVsZW1lbnRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybiB7T2JqZWN0fSBjbGllbnQgcmVjdFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQpIHtcclxuICB2YXIgcmVjdCA9IHt9O1xyXG5cclxuICAvLyBJRTEwIDEwIEZJWDogUGxlYXNlLCBkb24ndCBhc2ssIHRoZSBlbGVtZW50IGlzbid0XHJcbiAgLy8gY29uc2lkZXJlZCBpbiBET00gaW4gc29tZSBjaXJjdW1zdGFuY2VzLi4uXHJcbiAgLy8gVGhpcyBpc24ndCByZXByb2R1Y2libGUgaW4gSUUxMCBjb21wYXRpYmlsaXR5IG1vZGUgb2YgSUUxMVxyXG4gIHRyeSB7XHJcbiAgICBpZiAoaXNJRSQxKDEwKSkge1xyXG4gICAgICByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgdmFyIHNjcm9sbFRvcCA9IGdldFNjcm9sbChlbGVtZW50LCAndG9wJyk7XHJcbiAgICAgIHZhciBzY3JvbGxMZWZ0ID0gZ2V0U2Nyb2xsKGVsZW1lbnQsICdsZWZ0Jyk7XHJcbiAgICAgIHJlY3QudG9wICs9IHNjcm9sbFRvcDtcclxuICAgICAgcmVjdC5sZWZ0ICs9IHNjcm9sbExlZnQ7XHJcbiAgICAgIHJlY3QuYm90dG9tICs9IHNjcm9sbFRvcDtcclxuICAgICAgcmVjdC5yaWdodCArPSBzY3JvbGxMZWZ0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge31cclxuXHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICAgIGxlZnQ6IHJlY3QubGVmdCxcclxuICAgIHRvcDogcmVjdC50b3AsXHJcbiAgICB3aWR0aDogcmVjdC5yaWdodCAtIHJlY3QubGVmdCxcclxuICAgIGhlaWdodDogcmVjdC5ib3R0b20gLSByZWN0LnRvcFxyXG4gIH07XHJcblxyXG4gIC8vIHN1YnRyYWN0IHNjcm9sbGJhciBzaXplIGZyb20gc2l6ZXNcclxuICB2YXIgc2l6ZXMgPSBlbGVtZW50Lm5vZGVOYW1lID09PSAnSFRNTCcgPyBnZXRXaW5kb3dTaXplcygpIDoge307XHJcbiAgdmFyIHdpZHRoID0gc2l6ZXMud2lkdGggfHwgZWxlbWVudC5jbGllbnRXaWR0aCB8fCByZXN1bHQucmlnaHQgLSByZXN1bHQubGVmdDtcclxuICB2YXIgaGVpZ2h0ID0gc2l6ZXMuaGVpZ2h0IHx8IGVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8IHJlc3VsdC5ib3R0b20gLSByZXN1bHQudG9wO1xyXG5cclxuICB2YXIgaG9yaXpTY3JvbGxiYXIgPSBlbGVtZW50Lm9mZnNldFdpZHRoIC0gd2lkdGg7XHJcbiAgdmFyIHZlcnRTY3JvbGxiYXIgPSBlbGVtZW50Lm9mZnNldEhlaWdodCAtIGhlaWdodDtcclxuXHJcbiAgLy8gaWYgYW4gaHlwb3RoZXRpY2FsIHNjcm9sbGJhciBpcyBkZXRlY3RlZCwgd2UgbXVzdCBiZSBzdXJlIGl0J3Mgbm90IGEgYGJvcmRlcmBcclxuICAvLyB3ZSBtYWtlIHRoaXMgY2hlY2sgY29uZGl0aW9uYWwgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnNcclxuICBpZiAoaG9yaXpTY3JvbGxiYXIgfHwgdmVydFNjcm9sbGJhcikge1xyXG4gICAgdmFyIHN0eWxlcyA9IGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShlbGVtZW50KTtcclxuICAgIGhvcml6U2Nyb2xsYmFyIC09IGdldEJvcmRlcnNTaXplKHN0eWxlcywgJ3gnKTtcclxuICAgIHZlcnRTY3JvbGxiYXIgLT0gZ2V0Qm9yZGVyc1NpemUoc3R5bGVzLCAneScpO1xyXG5cclxuICAgIHJlc3VsdC53aWR0aCAtPSBob3JpelNjcm9sbGJhcjtcclxuICAgIHJlc3VsdC5oZWlnaHQgLT0gdmVydFNjcm9sbGJhcjtcclxuICB9XHJcblxyXG4gIHJldHVybiBnZXRDbGllbnRSZWN0KHJlc3VsdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJiaXRyYXJ5Tm9kZShjaGlsZHJlbiwgcGFyZW50KSB7XHJcbiAgdmFyIGZpeGVkUG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IGZhbHNlO1xyXG5cclxuICB2YXIgaXNJRTEwID0gaXNJRSQxKDEwKTtcclxuICB2YXIgaXNIVE1MID0gcGFyZW50Lm5vZGVOYW1lID09PSAnSFRNTCc7XHJcbiAgdmFyIGNoaWxkcmVuUmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChjaGlsZHJlbik7XHJcbiAgdmFyIHBhcmVudFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QocGFyZW50KTtcclxuICB2YXIgc2Nyb2xsUGFyZW50ID0gZ2V0U2Nyb2xsUGFyZW50KGNoaWxkcmVuKTtcclxuXHJcbiAgdmFyIHN0eWxlcyA9IGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShwYXJlbnQpO1xyXG4gIHZhciBib3JkZXJUb3BXaWR0aCA9IHBhcnNlRmxvYXQoc3R5bGVzLmJvcmRlclRvcFdpZHRoLCAxMCk7XHJcbiAgdmFyIGJvcmRlckxlZnRXaWR0aCA9IHBhcnNlRmxvYXQoc3R5bGVzLmJvcmRlckxlZnRXaWR0aCwgMTApO1xyXG5cclxuICAvLyBJbiBjYXNlcyB3aGVyZSB0aGUgcGFyZW50IGlzIGZpeGVkLCB3ZSBtdXN0IGlnbm9yZSBuZWdhdGl2ZSBzY3JvbGwgaW4gb2Zmc2V0IGNhbGNcclxuICBpZiAoZml4ZWRQb3NpdGlvbiAmJiBwYXJlbnQubm9kZU5hbWUgPT09ICdIVE1MJykge1xyXG4gICAgcGFyZW50UmVjdC50b3AgPSBNYXRoLm1heChwYXJlbnRSZWN0LnRvcCwgMCk7XHJcbiAgICBwYXJlbnRSZWN0LmxlZnQgPSBNYXRoLm1heChwYXJlbnRSZWN0LmxlZnQsIDApO1xyXG4gIH1cclxuICB2YXIgb2Zmc2V0cyA9IGdldENsaWVudFJlY3Qoe1xyXG4gICAgdG9wOiBjaGlsZHJlblJlY3QudG9wIC0gcGFyZW50UmVjdC50b3AgLSBib3JkZXJUb3BXaWR0aCxcclxuICAgIGxlZnQ6IGNoaWxkcmVuUmVjdC5sZWZ0IC0gcGFyZW50UmVjdC5sZWZ0IC0gYm9yZGVyTGVmdFdpZHRoLFxyXG4gICAgd2lkdGg6IGNoaWxkcmVuUmVjdC53aWR0aCxcclxuICAgIGhlaWdodDogY2hpbGRyZW5SZWN0LmhlaWdodFxyXG4gIH0pO1xyXG4gIG9mZnNldHMubWFyZ2luVG9wID0gMDtcclxuICBvZmZzZXRzLm1hcmdpbkxlZnQgPSAwO1xyXG5cclxuICAvLyBTdWJ0cmFjdCBtYXJnaW5zIG9mIGRvY3VtZW50RWxlbWVudCBpbiBjYXNlIGl0J3MgYmVpbmcgdXNlZCBhcyBwYXJlbnRcclxuICAvLyB3ZSBkbyB0aGlzIG9ubHkgb24gSFRNTCBiZWNhdXNlIGl0J3MgdGhlIG9ubHkgZWxlbWVudCB0aGF0IGJlaGF2ZXNcclxuICAvLyBkaWZmZXJlbnRseSB3aGVuIG1hcmdpbnMgYXJlIGFwcGxpZWQgdG8gaXQuIFRoZSBtYXJnaW5zIGFyZSBpbmNsdWRlZCBpblxyXG4gIC8vIHRoZSBib3ggb2YgdGhlIGRvY3VtZW50RWxlbWVudCwgaW4gdGhlIG90aGVyIGNhc2VzIG5vdC5cclxuICBpZiAoIWlzSUUxMCAmJiBpc0hUTUwpIHtcclxuICAgIHZhciBtYXJnaW5Ub3AgPSBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5Ub3AsIDEwKTtcclxuICAgIHZhciBtYXJnaW5MZWZ0ID0gcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luTGVmdCwgMTApO1xyXG5cclxuICAgIG9mZnNldHMudG9wIC09IGJvcmRlclRvcFdpZHRoIC0gbWFyZ2luVG9wO1xyXG4gICAgb2Zmc2V0cy5ib3R0b20gLT0gYm9yZGVyVG9wV2lkdGggLSBtYXJnaW5Ub3A7XHJcbiAgICBvZmZzZXRzLmxlZnQgLT0gYm9yZGVyTGVmdFdpZHRoIC0gbWFyZ2luTGVmdDtcclxuICAgIG9mZnNldHMucmlnaHQgLT0gYm9yZGVyTGVmdFdpZHRoIC0gbWFyZ2luTGVmdDtcclxuXHJcbiAgICAvLyBBdHRhY2ggbWFyZ2luVG9wIGFuZCBtYXJnaW5MZWZ0IGJlY2F1c2UgaW4gc29tZSBjaXJjdW1zdGFuY2VzIHdlIG1heSBuZWVkIHRoZW1cclxuICAgIG9mZnNldHMubWFyZ2luVG9wID0gbWFyZ2luVG9wO1xyXG4gICAgb2Zmc2V0cy5tYXJnaW5MZWZ0ID0gbWFyZ2luTGVmdDtcclxuICB9XHJcblxyXG4gIGlmIChpc0lFMTAgJiYgIWZpeGVkUG9zaXRpb24gPyBwYXJlbnQuY29udGFpbnMoc2Nyb2xsUGFyZW50KSA6IHBhcmVudCA9PT0gc2Nyb2xsUGFyZW50ICYmIHNjcm9sbFBhcmVudC5ub2RlTmFtZSAhPT0gJ0JPRFknKSB7XHJcbiAgICBvZmZzZXRzID0gaW5jbHVkZVNjcm9sbChvZmZzZXRzLCBwYXJlbnQpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG9mZnNldHM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFZpZXdwb3J0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcnRiaXRyYXJ5Tm9kZShlbGVtZW50KSB7XHJcbiAgdmFyIGV4Y2x1ZGVTY3JvbGwgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xyXG5cclxuICB2YXIgaHRtbCA9IGVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgdmFyIHJlbGF0aXZlT2Zmc2V0ID0gZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlKGVsZW1lbnQsIGh0bWwpO1xyXG4gIHZhciB3aWR0aCA9IE1hdGgubWF4KGh0bWwuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApO1xyXG4gIHZhciBoZWlnaHQgPSBNYXRoLm1heChodG1sLmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApO1xyXG5cclxuICB2YXIgc2Nyb2xsVG9wID0gIWV4Y2x1ZGVTY3JvbGwgPyBnZXRTY3JvbGwoaHRtbCkgOiAwO1xyXG4gIHZhciBzY3JvbGxMZWZ0ID0gIWV4Y2x1ZGVTY3JvbGwgPyBnZXRTY3JvbGwoaHRtbCwgJ2xlZnQnKSA6IDA7XHJcblxyXG4gIHZhciBvZmZzZXQgPSB7XHJcbiAgICB0b3A6IHNjcm9sbFRvcCAtIHJlbGF0aXZlT2Zmc2V0LnRvcCArIHJlbGF0aXZlT2Zmc2V0Lm1hcmdpblRvcCxcclxuICAgIGxlZnQ6IHNjcm9sbExlZnQgLSByZWxhdGl2ZU9mZnNldC5sZWZ0ICsgcmVsYXRpdmVPZmZzZXQubWFyZ2luTGVmdCxcclxuICAgIHdpZHRoOiB3aWR0aCxcclxuICAgIGhlaWdodDogaGVpZ2h0XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGdldENsaWVudFJlY3Qob2Zmc2V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHRoZSBnaXZlbiBlbGVtZW50IGlzIGZpeGVkIG9yIGlzIGluc2lkZSBhIGZpeGVkIHBhcmVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gY3VzdG9tQ29udGFpbmVyXHJcbiAqIEByZXR1cm5zIHtCb29sZWFufSBhbnN3ZXIgdG8gXCJpc0ZpeGVkP1wiXHJcbiAqL1xyXG5mdW5jdGlvbiBpc0ZpeGVkKGVsZW1lbnQpIHtcclxuICB2YXIgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lO1xyXG4gIGlmIChub2RlTmFtZSA9PT0gJ0JPRFknIHx8IG5vZGVOYW1lID09PSAnSFRNTCcpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgaWYgKGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShlbGVtZW50LCAncG9zaXRpb24nKSA9PT0gJ2ZpeGVkJykge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBpc0ZpeGVkKGdldFBhcmVudE5vZGUoZWxlbWVudCkpO1xyXG59XHJcblxyXG4vKipcclxuICogRmluZHMgdGhlIGZpcnN0IHBhcmVudCBvZiBhbiBlbGVtZW50IHRoYXQgaGFzIGEgdHJhbnNmb3JtZWQgcHJvcGVydHkgZGVmaW5lZFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtFbGVtZW50fSBmaXJzdCB0cmFuc2Zvcm1lZCBwYXJlbnQgb3IgZG9jdW1lbnRFbGVtZW50XHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZ2V0Rml4ZWRQb3NpdGlvbk9mZnNldFBhcmVudChlbGVtZW50KSB7XHJcbiAgLy8gVGhpcyBjaGVjayBpcyBuZWVkZWQgdG8gYXZvaWQgZXJyb3JzIGluIGNhc2Ugb25lIG9mIHRoZSBlbGVtZW50cyBpc24ndCBkZWZpbmVkIGZvciBhbnkgcmVhc29uXHJcbiAgaWYgKCFlbGVtZW50IHx8ICFlbGVtZW50LnBhcmVudEVsZW1lbnQgfHwgaXNJRSQxKCkpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgfVxyXG4gIHZhciBlbCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICB3aGlsZSAoZWwgJiYgZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KGVsLCAndHJhbnNmb3JtJykgPT09ICdub25lJykge1xyXG4gICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xyXG4gIH1cclxuICByZXR1cm4gZWwgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG59XHJcblxyXG4vKipcclxuICogQ29tcHV0ZWQgdGhlIGJvdW5kYXJpZXMgbGltaXRzIGFuZCByZXR1cm4gdGhlbVxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcG9wcGVyXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHJlZmVyZW5jZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gcGFkZGluZ1xyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBib3VuZGFyaWVzRWxlbWVudCAtIEVsZW1lbnQgdXNlZCB0byBkZWZpbmUgdGhlIGJvdW5kYXJpZXNcclxuICogQHBhcmFtIHtCb29sZWFufSBmaXhlZFBvc2l0aW9uIC0gSXMgaW4gZml4ZWQgcG9zaXRpb24gbW9kZVxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBDb29yZGluYXRlcyBvZiB0aGUgYm91bmRhcmllc1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Qm91bmRhcmllcyhwb3BwZXIsIHJlZmVyZW5jZSwgcGFkZGluZywgYm91bmRhcmllc0VsZW1lbnQpIHtcclxuICB2YXIgZml4ZWRQb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogZmFsc2U7XHJcblxyXG4gIC8vIE5PVEU6IDEgRE9NIGFjY2VzcyBoZXJlXHJcblxyXG4gIHZhciBib3VuZGFyaWVzID0geyB0b3A6IDAsIGxlZnQ6IDAgfTtcclxuICB2YXIgb2Zmc2V0UGFyZW50ID0gZml4ZWRQb3NpdGlvbiA/IGdldEZpeGVkUG9zaXRpb25PZmZzZXRQYXJlbnQocG9wcGVyKSA6IGZpbmRDb21tb25PZmZzZXRQYXJlbnQocG9wcGVyLCByZWZlcmVuY2UpO1xyXG5cclxuICAvLyBIYW5kbGUgdmlld3BvcnQgY2FzZVxyXG4gIGlmIChib3VuZGFyaWVzRWxlbWVudCA9PT0gJ3ZpZXdwb3J0Jykge1xyXG4gICAgYm91bmRhcmllcyA9IGdldFZpZXdwb3J0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcnRiaXRyYXJ5Tm9kZShvZmZzZXRQYXJlbnQsIGZpeGVkUG9zaXRpb24pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBIYW5kbGUgb3RoZXIgY2FzZXMgYmFzZWQgb24gRE9NIGVsZW1lbnQgdXNlZCBhcyBib3VuZGFyaWVzXHJcbiAgICB2YXIgYm91bmRhcmllc05vZGUgPSB2b2lkIDA7XHJcbiAgICBpZiAoYm91bmRhcmllc0VsZW1lbnQgPT09ICdzY3JvbGxQYXJlbnQnKSB7XHJcbiAgICAgIGJvdW5kYXJpZXNOb2RlID0gZ2V0U2Nyb2xsUGFyZW50KGdldFBhcmVudE5vZGUocmVmZXJlbmNlKSk7XHJcbiAgICAgIGlmIChib3VuZGFyaWVzTm9kZS5ub2RlTmFtZSA9PT0gJ0JPRFknKSB7XHJcbiAgICAgICAgYm91bmRhcmllc05vZGUgPSBwb3BwZXIub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoYm91bmRhcmllc0VsZW1lbnQgPT09ICd3aW5kb3cnKSB7XHJcbiAgICAgIGJvdW5kYXJpZXNOb2RlID0gcG9wcGVyLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYm91bmRhcmllc05vZGUgPSBib3VuZGFyaWVzRWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgb2Zmc2V0cyA9IGdldE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJiaXRyYXJ5Tm9kZShib3VuZGFyaWVzTm9kZSwgb2Zmc2V0UGFyZW50LCBmaXhlZFBvc2l0aW9uKTtcclxuXHJcbiAgICAvLyBJbiBjYXNlIG9mIEhUTUwsIHdlIG5lZWQgYSBkaWZmZXJlbnQgY29tcHV0YXRpb25cclxuICAgIGlmIChib3VuZGFyaWVzTm9kZS5ub2RlTmFtZSA9PT0gJ0hUTUwnICYmICFpc0ZpeGVkKG9mZnNldFBhcmVudCkpIHtcclxuICAgICAgdmFyIF9nZXRXaW5kb3dTaXplcyA9IGdldFdpbmRvd1NpemVzKCksXHJcbiAgICAgICAgICBoZWlnaHQgPSBfZ2V0V2luZG93U2l6ZXMuaGVpZ2h0LFxyXG4gICAgICAgICAgd2lkdGggPSBfZ2V0V2luZG93U2l6ZXMud2lkdGg7XHJcblxyXG4gICAgICBib3VuZGFyaWVzLnRvcCArPSBvZmZzZXRzLnRvcCAtIG9mZnNldHMubWFyZ2luVG9wO1xyXG4gICAgICBib3VuZGFyaWVzLmJvdHRvbSA9IGhlaWdodCArIG9mZnNldHMudG9wO1xyXG4gICAgICBib3VuZGFyaWVzLmxlZnQgKz0gb2Zmc2V0cy5sZWZ0IC0gb2Zmc2V0cy5tYXJnaW5MZWZ0O1xyXG4gICAgICBib3VuZGFyaWVzLnJpZ2h0ID0gd2lkdGggKyBvZmZzZXRzLmxlZnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBmb3IgYWxsIHRoZSBvdGhlciBET00gZWxlbWVudHMsIHRoaXMgb25lIGlzIGdvb2RcclxuICAgICAgYm91bmRhcmllcyA9IG9mZnNldHM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBBZGQgcGFkZGluZ3NcclxuICBib3VuZGFyaWVzLmxlZnQgKz0gcGFkZGluZztcclxuICBib3VuZGFyaWVzLnRvcCArPSBwYWRkaW5nO1xyXG4gIGJvdW5kYXJpZXMucmlnaHQgLT0gcGFkZGluZztcclxuICBib3VuZGFyaWVzLmJvdHRvbSAtPSBwYWRkaW5nO1xyXG5cclxuICByZXR1cm4gYm91bmRhcmllcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QXJlYShfcmVmKSB7XHJcbiAgdmFyIHdpZHRoID0gX3JlZi53aWR0aCxcclxuICAgICAgaGVpZ2h0ID0gX3JlZi5oZWlnaHQ7XHJcblxyXG4gIHJldHVybiB3aWR0aCAqIGhlaWdodDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFV0aWxpdHkgdXNlZCB0byB0cmFuc2Zvcm0gdGhlIGBhdXRvYCBwbGFjZW1lbnQgdG8gdGhlIHBsYWNlbWVudCB3aXRoIG1vcmVcclxuICogYXZhaWxhYmxlIHNwYWNlLlxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IHVwZGF0ZSBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBjb21wdXRlQXV0b1BsYWNlbWVudChwbGFjZW1lbnQsIHJlZlJlY3QsIHBvcHBlciwgcmVmZXJlbmNlLCBib3VuZGFyaWVzRWxlbWVudCkge1xyXG4gIHZhciBwYWRkaW5nID0gYXJndW1lbnRzLmxlbmd0aCA+IDUgJiYgYXJndW1lbnRzWzVdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNV0gOiAwO1xyXG5cclxuICBpZiAocGxhY2VtZW50LmluZGV4T2YoJ2F1dG8nKSA9PT0gLTEpIHtcclxuICAgIHJldHVybiBwbGFjZW1lbnQ7XHJcbiAgfVxyXG5cclxuICB2YXIgYm91bmRhcmllcyA9IGdldEJvdW5kYXJpZXMocG9wcGVyLCByZWZlcmVuY2UsIHBhZGRpbmcsIGJvdW5kYXJpZXNFbGVtZW50KTtcclxuXHJcbiAgdmFyIHJlY3RzID0ge1xyXG4gICAgdG9wOiB7XHJcbiAgICAgIHdpZHRoOiBib3VuZGFyaWVzLndpZHRoLFxyXG4gICAgICBoZWlnaHQ6IHJlZlJlY3QudG9wIC0gYm91bmRhcmllcy50b3BcclxuICAgIH0sXHJcbiAgICByaWdodDoge1xyXG4gICAgICB3aWR0aDogYm91bmRhcmllcy5yaWdodCAtIHJlZlJlY3QucmlnaHQsXHJcbiAgICAgIGhlaWdodDogYm91bmRhcmllcy5oZWlnaHRcclxuICAgIH0sXHJcbiAgICBib3R0b206IHtcclxuICAgICAgd2lkdGg6IGJvdW5kYXJpZXMud2lkdGgsXHJcbiAgICAgIGhlaWdodDogYm91bmRhcmllcy5ib3R0b20gLSByZWZSZWN0LmJvdHRvbVxyXG4gICAgfSxcclxuICAgIGxlZnQ6IHtcclxuICAgICAgd2lkdGg6IHJlZlJlY3QubGVmdCAtIGJvdW5kYXJpZXMubGVmdCxcclxuICAgICAgaGVpZ2h0OiBib3VuZGFyaWVzLmhlaWdodFxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBzb3J0ZWRBcmVhcyA9IE9iamVjdC5rZXlzKHJlY3RzKS5tYXAoZnVuY3Rpb24gKGtleSkge1xyXG4gICAgcmV0dXJuIF9leHRlbmRzJDEoe1xyXG4gICAgICBrZXk6IGtleVxyXG4gICAgfSwgcmVjdHNba2V5XSwge1xyXG4gICAgICBhcmVhOiBnZXRBcmVhKHJlY3RzW2tleV0pXHJcbiAgICB9KTtcclxuICB9KS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICByZXR1cm4gYi5hcmVhIC0gYS5hcmVhO1xyXG4gIH0pO1xyXG5cclxuICB2YXIgZmlsdGVyZWRBcmVhcyA9IHNvcnRlZEFyZWFzLmZpbHRlcihmdW5jdGlvbiAoX3JlZjIpIHtcclxuICAgIHZhciB3aWR0aCA9IF9yZWYyLndpZHRoLFxyXG4gICAgICAgIGhlaWdodCA9IF9yZWYyLmhlaWdodDtcclxuICAgIHJldHVybiB3aWR0aCA+PSBwb3BwZXIuY2xpZW50V2lkdGggJiYgaGVpZ2h0ID49IHBvcHBlci5jbGllbnRIZWlnaHQ7XHJcbiAgfSk7XHJcblxyXG4gIHZhciBjb21wdXRlZFBsYWNlbWVudCA9IGZpbHRlcmVkQXJlYXMubGVuZ3RoID4gMCA/IGZpbHRlcmVkQXJlYXNbMF0ua2V5IDogc29ydGVkQXJlYXNbMF0ua2V5O1xyXG5cclxuICB2YXIgdmFyaWF0aW9uID0gcGxhY2VtZW50LnNwbGl0KCctJylbMV07XHJcblxyXG4gIHJldHVybiBjb21wdXRlZFBsYWNlbWVudCArICh2YXJpYXRpb24gPyAnLScgKyB2YXJpYXRpb24gOiAnJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgb2Zmc2V0cyB0byB0aGUgcmVmZXJlbmNlIGVsZW1lbnRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZVxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlciAtIHRoZSBwb3BwZXIgZWxlbWVudFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHJlZmVyZW5jZSAtIHRoZSByZWZlcmVuY2UgZWxlbWVudCAodGhlIHBvcHBlciB3aWxsIGJlIHJlbGF0aXZlIHRvIHRoaXMpXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZml4ZWRQb3NpdGlvbiAtIGlzIGluIGZpeGVkIHBvc2l0aW9uIG1vZGVcclxuICogQHJldHVybnMge09iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9mZnNldHMgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXJcclxuICovXHJcbmZ1bmN0aW9uIGdldFJlZmVyZW5jZU9mZnNldHMoc3RhdGUsIHBvcHBlciwgcmVmZXJlbmNlKSB7XHJcbiAgdmFyIGZpeGVkUG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IG51bGw7XHJcblxyXG4gIHZhciBjb21tb25PZmZzZXRQYXJlbnQgPSBmaXhlZFBvc2l0aW9uID8gZ2V0Rml4ZWRQb3NpdGlvbk9mZnNldFBhcmVudChwb3BwZXIpIDogZmluZENvbW1vbk9mZnNldFBhcmVudChwb3BwZXIsIHJlZmVyZW5jZSk7XHJcbiAgcmV0dXJuIGdldE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJiaXRyYXJ5Tm9kZShyZWZlcmVuY2UsIGNvbW1vbk9mZnNldFBhcmVudCwgZml4ZWRQb3NpdGlvbik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIG91dGVyIHNpemVzIG9mIHRoZSBnaXZlbiBlbGVtZW50IChvZmZzZXQgc2l6ZSArIG1hcmdpbnMpXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybnMge09iamVjdH0gb2JqZWN0IGNvbnRhaW5pbmcgd2lkdGggYW5kIGhlaWdodCBwcm9wZXJ0aWVzXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRPdXRlclNpemVzKGVsZW1lbnQpIHtcclxuICB2YXIgc3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcclxuICB2YXIgeCA9IHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpblRvcCkgKyBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5Cb3R0b20pO1xyXG4gIHZhciB5ID0gcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5SaWdodCk7XHJcbiAgdmFyIHJlc3VsdCA9IHtcclxuICAgIHdpZHRoOiBlbGVtZW50Lm9mZnNldFdpZHRoICsgeSxcclxuICAgIGhlaWdodDogZWxlbWVudC5vZmZzZXRIZWlnaHQgKyB4XHJcbiAgfTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBvcHBvc2l0ZSBwbGFjZW1lbnQgb2YgdGhlIGdpdmVuIG9uZVxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHBsYWNlbWVudFxyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBmbGlwcGVkIHBsYWNlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KSB7XHJcbiAgdmFyIGhhc2ggPSB7IGxlZnQ6ICdyaWdodCcsIHJpZ2h0OiAnbGVmdCcsIGJvdHRvbTogJ3RvcCcsIHRvcDogJ2JvdHRvbScgfTtcclxuICByZXR1cm4gcGxhY2VtZW50LnJlcGxhY2UoL2xlZnR8cmlnaHR8Ym90dG9tfHRvcC9nLCBmdW5jdGlvbiAobWF0Y2hlZCkge1xyXG4gICAgcmV0dXJuIGhhc2hbbWF0Y2hlZF07XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgb2Zmc2V0cyB0byB0aGUgcG9wcGVyXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge09iamVjdH0gcG9zaXRpb24gLSBDU1MgcG9zaXRpb24gdGhlIFBvcHBlciB3aWxsIGdldCBhcHBsaWVkXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHBlciAtIHRoZSBwb3BwZXIgZWxlbWVudFxyXG4gKiBAcGFyYW0ge09iamVjdH0gcmVmZXJlbmNlT2Zmc2V0cyAtIHRoZSByZWZlcmVuY2Ugb2Zmc2V0cyAodGhlIHBvcHBlciB3aWxsIGJlIHJlbGF0aXZlIHRvIHRoaXMpXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwbGFjZW1lbnQgLSBvbmUgb2YgdGhlIHZhbGlkIHBsYWNlbWVudCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IHBvcHBlck9mZnNldHMgLSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgb2Zmc2V0cyB3aGljaCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlclxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UG9wcGVyT2Zmc2V0cyhwb3BwZXIsIHJlZmVyZW5jZU9mZnNldHMsIHBsYWNlbWVudCkge1xyXG4gIHBsYWNlbWVudCA9IHBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xyXG5cclxuICAvLyBHZXQgcG9wcGVyIG5vZGUgc2l6ZXNcclxuICB2YXIgcG9wcGVyUmVjdCA9IGdldE91dGVyU2l6ZXMocG9wcGVyKTtcclxuXHJcbiAgLy8gQWRkIHBvc2l0aW9uLCB3aWR0aCBhbmQgaGVpZ2h0IHRvIG91ciBvZmZzZXRzIG9iamVjdFxyXG4gIHZhciBwb3BwZXJPZmZzZXRzID0ge1xyXG4gICAgd2lkdGg6IHBvcHBlclJlY3Qud2lkdGgsXHJcbiAgICBoZWlnaHQ6IHBvcHBlclJlY3QuaGVpZ2h0XHJcbiAgfTtcclxuXHJcbiAgLy8gZGVwZW5kaW5nIGJ5IHRoZSBwb3BwZXIgcGxhY2VtZW50IHdlIGhhdmUgdG8gY29tcHV0ZSBpdHMgb2Zmc2V0cyBzbGlnaHRseSBkaWZmZXJlbnRseVxyXG4gIHZhciBpc0hvcml6ID0gWydyaWdodCcsICdsZWZ0J10uaW5kZXhPZihwbGFjZW1lbnQpICE9PSAtMTtcclxuICB2YXIgbWFpblNpZGUgPSBpc0hvcml6ID8gJ3RvcCcgOiAnbGVmdCc7XHJcbiAgdmFyIHNlY29uZGFyeVNpZGUgPSBpc0hvcml6ID8gJ2xlZnQnIDogJ3RvcCc7XHJcbiAgdmFyIG1lYXN1cmVtZW50ID0gaXNIb3JpeiA/ICdoZWlnaHQnIDogJ3dpZHRoJztcclxuICB2YXIgc2Vjb25kYXJ5TWVhc3VyZW1lbnQgPSAhaXNIb3JpeiA/ICdoZWlnaHQnIDogJ3dpZHRoJztcclxuXHJcbiAgcG9wcGVyT2Zmc2V0c1ttYWluU2lkZV0gPSByZWZlcmVuY2VPZmZzZXRzW21haW5TaWRlXSArIHJlZmVyZW5jZU9mZnNldHNbbWVhc3VyZW1lbnRdIC8gMiAtIHBvcHBlclJlY3RbbWVhc3VyZW1lbnRdIC8gMjtcclxuICBpZiAocGxhY2VtZW50ID09PSBzZWNvbmRhcnlTaWRlKSB7XHJcbiAgICBwb3BwZXJPZmZzZXRzW3NlY29uZGFyeVNpZGVdID0gcmVmZXJlbmNlT2Zmc2V0c1tzZWNvbmRhcnlTaWRlXSAtIHBvcHBlclJlY3Rbc2Vjb25kYXJ5TWVhc3VyZW1lbnRdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwb3BwZXJPZmZzZXRzW3NlY29uZGFyeVNpZGVdID0gcmVmZXJlbmNlT2Zmc2V0c1tnZXRPcHBvc2l0ZVBsYWNlbWVudChzZWNvbmRhcnlTaWRlKV07XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcG9wcGVyT2Zmc2V0cztcclxufVxyXG5cclxuLyoqXHJcbiAqIE1pbWljcyB0aGUgYGZpbmRgIG1ldGhvZCBvZiBBcnJheVxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtBcnJheX0gYXJyXHJcbiAqIEBhcmd1bWVudCBwcm9wXHJcbiAqIEBhcmd1bWVudCB2YWx1ZVxyXG4gKiBAcmV0dXJucyBpbmRleCBvciAtMVxyXG4gKi9cclxuZnVuY3Rpb24gZmluZChhcnIsIGNoZWNrKSB7XHJcbiAgLy8gdXNlIG5hdGl2ZSBmaW5kIGlmIHN1cHBvcnRlZFxyXG4gIGlmIChBcnJheS5wcm90b3R5cGUuZmluZCkge1xyXG4gICAgcmV0dXJuIGFyci5maW5kKGNoZWNrKTtcclxuICB9XHJcblxyXG4gIC8vIHVzZSBgZmlsdGVyYCB0byBvYnRhaW4gdGhlIHNhbWUgYmVoYXZpb3Igb2YgYGZpbmRgXHJcbiAgcmV0dXJuIGFyci5maWx0ZXIoY2hlY2spWzBdO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJuIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hpbmcgb2JqZWN0XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0FycmF5fSBhcnJcclxuICogQGFyZ3VtZW50IHByb3BcclxuICogQGFyZ3VtZW50IHZhbHVlXHJcbiAqIEByZXR1cm5zIGluZGV4IG9yIC0xXHJcbiAqL1xyXG5mdW5jdGlvbiBmaW5kSW5kZXgoYXJyLCBwcm9wLCB2YWx1ZSkge1xyXG4gIC8vIHVzZSBuYXRpdmUgZmluZEluZGV4IGlmIHN1cHBvcnRlZFxyXG4gIGlmIChBcnJheS5wcm90b3R5cGUuZmluZEluZGV4KSB7XHJcbiAgICByZXR1cm4gYXJyLmZpbmRJbmRleChmdW5jdGlvbiAoY3VyKSB7XHJcbiAgICAgIHJldHVybiBjdXJbcHJvcF0gPT09IHZhbHVlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyB1c2UgYGZpbmRgICsgYGluZGV4T2ZgIGlmIGBmaW5kSW5kZXhgIGlzbid0IHN1cHBvcnRlZFxyXG4gIHZhciBtYXRjaCA9IGZpbmQoYXJyLCBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICByZXR1cm4gb2JqW3Byb3BdID09PSB2YWx1ZTtcclxuICB9KTtcclxuICByZXR1cm4gYXJyLmluZGV4T2YobWF0Y2gpO1xyXG59XHJcblxyXG4vKipcclxuICogTG9vcCB0cm91Z2ggdGhlIGxpc3Qgb2YgbW9kaWZpZXJzIGFuZCBydW4gdGhlbSBpbiBvcmRlcixcclxuICogZWFjaCBvZiB0aGVtIHdpbGwgdGhlbiBlZGl0IHRoZSBkYXRhIG9iamVjdC5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7ZGF0YU9iamVjdH0gZGF0YVxyXG4gKiBAcGFyYW0ge0FycmF5fSBtb2RpZmllcnNcclxuICogQHBhcmFtIHtTdHJpbmd9IGVuZHMgLSBPcHRpb25hbCBtb2RpZmllciBuYW1lIHVzZWQgYXMgc3RvcHBlclxyXG4gKiBAcmV0dXJucyB7ZGF0YU9iamVjdH1cclxuICovXHJcbmZ1bmN0aW9uIHJ1bk1vZGlmaWVycyhtb2RpZmllcnMsIGRhdGEsIGVuZHMpIHtcclxuICB2YXIgbW9kaWZpZXJzVG9SdW4gPSBlbmRzID09PSB1bmRlZmluZWQgPyBtb2RpZmllcnMgOiBtb2RpZmllcnMuc2xpY2UoMCwgZmluZEluZGV4KG1vZGlmaWVycywgJ25hbWUnLCBlbmRzKSk7XHJcblxyXG4gIG1vZGlmaWVyc1RvUnVuLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyKSB7XHJcbiAgICBpZiAobW9kaWZpZXJbJ2Z1bmN0aW9uJ10pIHtcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBkb3Qtbm90YXRpb25cclxuICAgICAgY29uc29sZS53YXJuKCdgbW9kaWZpZXIuZnVuY3Rpb25gIGlzIGRlcHJlY2F0ZWQsIHVzZSBgbW9kaWZpZXIuZm5gIScpO1xyXG4gICAgfVxyXG4gICAgdmFyIGZuID0gbW9kaWZpZXJbJ2Z1bmN0aW9uJ10gfHwgbW9kaWZpZXIuZm47IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZG90LW5vdGF0aW9uXHJcbiAgICBpZiAobW9kaWZpZXIuZW5hYmxlZCAmJiBpc0Z1bmN0aW9uKGZuKSkge1xyXG4gICAgICAvLyBBZGQgcHJvcGVydGllcyB0byBvZmZzZXRzIHRvIG1ha2UgdGhlbSBhIGNvbXBsZXRlIGNsaWVudFJlY3Qgb2JqZWN0XHJcbiAgICAgIC8vIHdlIGRvIHRoaXMgYmVmb3JlIGVhY2ggbW9kaWZpZXIgdG8gbWFrZSBzdXJlIHRoZSBwcmV2aW91cyBvbmUgZG9lc24ndFxyXG4gICAgICAvLyBtZXNzIHdpdGggdGhlc2UgdmFsdWVzXHJcbiAgICAgIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBnZXRDbGllbnRSZWN0KGRhdGEub2Zmc2V0cy5wb3BwZXIpO1xyXG4gICAgICBkYXRhLm9mZnNldHMucmVmZXJlbmNlID0gZ2V0Q2xpZW50UmVjdChkYXRhLm9mZnNldHMucmVmZXJlbmNlKTtcclxuXHJcbiAgICAgIGRhdGEgPSBmbihkYXRhLCBtb2RpZmllcik7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2YgdGhlIHBvcHBlciwgY29tcHV0aW5nIHRoZSBuZXcgb2Zmc2V0cyBhbmQgYXBwbHlpbmdcclxuICogdGhlIG5ldyBzdHlsZS48YnIgLz5cclxuICogUHJlZmVyIGBzY2hlZHVsZVVwZGF0ZWAgb3ZlciBgdXBkYXRlYCBiZWNhdXNlIG9mIHBlcmZvcm1hbmNlIHJlYXNvbnMuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlclxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gIC8vIGlmIHBvcHBlciBpcyBkZXN0cm95ZWQsIGRvbid0IHBlcmZvcm0gYW55IGZ1cnRoZXIgdXBkYXRlXHJcbiAgaWYgKHRoaXMuc3RhdGUuaXNEZXN0cm95ZWQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHZhciBkYXRhID0ge1xyXG4gICAgaW5zdGFuY2U6IHRoaXMsXHJcbiAgICBzdHlsZXM6IHt9LFxyXG4gICAgYXJyb3dTdHlsZXM6IHt9LFxyXG4gICAgYXR0cmlidXRlczoge30sXHJcbiAgICBmbGlwcGVkOiBmYWxzZSxcclxuICAgIG9mZnNldHM6IHt9XHJcbiAgfTtcclxuXHJcbiAgLy8gY29tcHV0ZSByZWZlcmVuY2UgZWxlbWVudCBvZmZzZXRzXHJcbiAgZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSA9IGdldFJlZmVyZW5jZU9mZnNldHModGhpcy5zdGF0ZSwgdGhpcy5wb3BwZXIsIHRoaXMucmVmZXJlbmNlLCB0aGlzLm9wdGlvbnMucG9zaXRpb25GaXhlZCk7XHJcblxyXG4gIC8vIGNvbXB1dGUgYXV0byBwbGFjZW1lbnQsIHN0b3JlIHBsYWNlbWVudCBpbnNpZGUgdGhlIGRhdGEgb2JqZWN0LFxyXG4gIC8vIG1vZGlmaWVycyB3aWxsIGJlIGFibGUgdG8gZWRpdCBgcGxhY2VtZW50YCBpZiBuZWVkZWRcclxuICAvLyBhbmQgcmVmZXIgdG8gb3JpZ2luYWxQbGFjZW1lbnQgdG8ga25vdyB0aGUgb3JpZ2luYWwgdmFsdWVcclxuICBkYXRhLnBsYWNlbWVudCA9IGNvbXB1dGVBdXRvUGxhY2VtZW50KHRoaXMub3B0aW9ucy5wbGFjZW1lbnQsIGRhdGEub2Zmc2V0cy5yZWZlcmVuY2UsIHRoaXMucG9wcGVyLCB0aGlzLnJlZmVyZW5jZSwgdGhpcy5vcHRpb25zLm1vZGlmaWVycy5mbGlwLmJvdW5kYXJpZXNFbGVtZW50LCB0aGlzLm9wdGlvbnMubW9kaWZpZXJzLmZsaXAucGFkZGluZyk7XHJcblxyXG4gIC8vIHN0b3JlIHRoZSBjb21wdXRlZCBwbGFjZW1lbnQgaW5zaWRlIGBvcmlnaW5hbFBsYWNlbWVudGBcclxuICBkYXRhLm9yaWdpbmFsUGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQ7XHJcblxyXG4gIGRhdGEucG9zaXRpb25GaXhlZCA9IHRoaXMub3B0aW9ucy5wb3NpdGlvbkZpeGVkO1xyXG5cclxuICAvLyBjb21wdXRlIHRoZSBwb3BwZXIgb2Zmc2V0c1xyXG4gIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBnZXRQb3BwZXJPZmZzZXRzKHRoaXMucG9wcGVyLCBkYXRhLm9mZnNldHMucmVmZXJlbmNlLCBkYXRhLnBsYWNlbWVudCk7XHJcblxyXG4gIGRhdGEub2Zmc2V0cy5wb3BwZXIucG9zaXRpb24gPSB0aGlzLm9wdGlvbnMucG9zaXRpb25GaXhlZCA/ICdmaXhlZCcgOiAnYWJzb2x1dGUnO1xyXG5cclxuICAvLyBydW4gdGhlIG1vZGlmaWVyc1xyXG4gIGRhdGEgPSBydW5Nb2RpZmllcnModGhpcy5tb2RpZmllcnMsIGRhdGEpO1xyXG5cclxuICAvLyB0aGUgZmlyc3QgYHVwZGF0ZWAgd2lsbCBjYWxsIGBvbkNyZWF0ZWAgY2FsbGJhY2tcclxuICAvLyB0aGUgb3RoZXIgb25lcyB3aWxsIGNhbGwgYG9uVXBkYXRlYCBjYWxsYmFja1xyXG4gIGlmICghdGhpcy5zdGF0ZS5pc0NyZWF0ZWQpIHtcclxuICAgIHRoaXMuc3RhdGUuaXNDcmVhdGVkID0gdHJ1ZTtcclxuICAgIHRoaXMub3B0aW9ucy5vbkNyZWF0ZShkYXRhKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5vcHRpb25zLm9uVXBkYXRlKGRhdGEpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEhlbHBlciB1c2VkIHRvIGtub3cgaWYgdGhlIGdpdmVuIG1vZGlmaWVyIGlzIGVuYWJsZWQuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzTW9kaWZpZXJFbmFibGVkKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XHJcbiAgcmV0dXJuIG1vZGlmaWVycy5zb21lKGZ1bmN0aW9uIChfcmVmKSB7XHJcbiAgICB2YXIgbmFtZSA9IF9yZWYubmFtZSxcclxuICAgICAgICBlbmFibGVkID0gX3JlZi5lbmFibGVkO1xyXG4gICAgcmV0dXJuIGVuYWJsZWQgJiYgbmFtZSA9PT0gbW9kaWZpZXJOYW1lO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBwcmVmaXhlZCBzdXBwb3J0ZWQgcHJvcGVydHkgbmFtZVxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHByb3BlcnR5IChjYW1lbENhc2UpXHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHByZWZpeGVkIHByb3BlcnR5IChjYW1lbENhc2Ugb3IgUGFzY2FsQ2FzZSwgZGVwZW5kaW5nIG9uIHRoZSB2ZW5kb3IgcHJlZml4KVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0U3VwcG9ydGVkUHJvcGVydHlOYW1lKHByb3BlcnR5KSB7XHJcbiAgdmFyIHByZWZpeGVzID0gW2ZhbHNlLCAnbXMnLCAnV2Via2l0JywgJ01veicsICdPJ107XHJcbiAgdmFyIHVwcGVyUHJvcCA9IHByb3BlcnR5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHkuc2xpY2UoMSk7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBwcmVmaXggPSBwcmVmaXhlc1tpXTtcclxuICAgIHZhciB0b0NoZWNrID0gcHJlZml4ID8gJycgKyBwcmVmaXggKyB1cHBlclByb3AgOiBwcm9wZXJ0eTtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuYm9keS5zdHlsZVt0b0NoZWNrXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgcmV0dXJuIHRvQ2hlY2s7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogRGVzdHJveSB0aGUgcG9wcGVyXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlclxyXG4gKi9cclxuZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICB0aGlzLnN0YXRlLmlzRGVzdHJveWVkID0gdHJ1ZTtcclxuXHJcbiAgLy8gdG91Y2ggRE9NIG9ubHkgaWYgYGFwcGx5U3R5bGVgIG1vZGlmaWVyIGlzIGVuYWJsZWRcclxuICBpZiAoaXNNb2RpZmllckVuYWJsZWQodGhpcy5tb2RpZmllcnMsICdhcHBseVN0eWxlJykpIHtcclxuICAgIHRoaXMucG9wcGVyLnJlbW92ZUF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnKTtcclxuICAgIHRoaXMucG9wcGVyLnN0eWxlLnBvc2l0aW9uID0gJyc7XHJcbiAgICB0aGlzLnBvcHBlci5zdHlsZS50b3AgPSAnJztcclxuICAgIHRoaXMucG9wcGVyLnN0eWxlLmxlZnQgPSAnJztcclxuICAgIHRoaXMucG9wcGVyLnN0eWxlLnJpZ2h0ID0gJyc7XHJcbiAgICB0aGlzLnBvcHBlci5zdHlsZS5ib3R0b20gPSAnJztcclxuICAgIHRoaXMucG9wcGVyLnN0eWxlLndpbGxDaGFuZ2UgPSAnJztcclxuICAgIHRoaXMucG9wcGVyLnN0eWxlW2dldFN1cHBvcnRlZFByb3BlcnR5TmFtZSgndHJhbnNmb3JtJyldID0gJyc7XHJcbiAgfVxyXG5cclxuICB0aGlzLmRpc2FibGVFdmVudExpc3RlbmVycygpO1xyXG5cclxuICAvLyByZW1vdmUgdGhlIHBvcHBlciBpZiB1c2VyIGV4cGxpY2l0eSBhc2tlZCBmb3IgdGhlIGRlbGV0aW9uIG9uIGRlc3Ryb3lcclxuICAvLyBkbyBub3QgdXNlIGByZW1vdmVgIGJlY2F1c2UgSUUxMSBkb2Vzbid0IHN1cHBvcnQgaXRcclxuICBpZiAodGhpcy5vcHRpb25zLnJlbW92ZU9uRGVzdHJveSkge1xyXG4gICAgdGhpcy5wb3BwZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLnBvcHBlcik7XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IHRoZSB3aW5kb3cgYXNzb2NpYXRlZCB3aXRoIHRoZSBlbGVtZW50XHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7V2luZG93fVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0V2luZG93KGVsZW1lbnQpIHtcclxuICB2YXIgb3duZXJEb2N1bWVudCA9IGVsZW1lbnQub3duZXJEb2N1bWVudDtcclxuICByZXR1cm4gb3duZXJEb2N1bWVudCA/IG93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcgOiB3aW5kb3c7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGF0dGFjaFRvU2Nyb2xsUGFyZW50cyhzY3JvbGxQYXJlbnQsIGV2ZW50LCBjYWxsYmFjaywgc2Nyb2xsUGFyZW50cykge1xyXG4gIHZhciBpc0JvZHkgPSBzY3JvbGxQYXJlbnQubm9kZU5hbWUgPT09ICdCT0RZJztcclxuICB2YXIgdGFyZ2V0ID0gaXNCb2R5ID8gc2Nyb2xsUGFyZW50Lm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcgOiBzY3JvbGxQYXJlbnQ7XHJcbiAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrLCB7IHBhc3NpdmU6IHRydWUgfSk7XHJcblxyXG4gIGlmICghaXNCb2R5KSB7XHJcbiAgICBhdHRhY2hUb1Njcm9sbFBhcmVudHMoZ2V0U2Nyb2xsUGFyZW50KHRhcmdldC5wYXJlbnROb2RlKSwgZXZlbnQsIGNhbGxiYWNrLCBzY3JvbGxQYXJlbnRzKTtcclxuICB9XHJcbiAgc2Nyb2xsUGFyZW50cy5wdXNoKHRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXR1cCBuZWVkZWQgZXZlbnQgbGlzdGVuZXJzIHVzZWQgdG8gdXBkYXRlIHRoZSBwb3BwZXIgcG9zaXRpb25cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXR1cEV2ZW50TGlzdGVuZXJzKHJlZmVyZW5jZSwgb3B0aW9ucywgc3RhdGUsIHVwZGF0ZUJvdW5kKSB7XHJcbiAgLy8gUmVzaXplIGV2ZW50IGxpc3RlbmVyIG9uIHdpbmRvd1xyXG4gIHN0YXRlLnVwZGF0ZUJvdW5kID0gdXBkYXRlQm91bmQ7XHJcbiAgZ2V0V2luZG93KHJlZmVyZW5jZSkuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgc3RhdGUudXBkYXRlQm91bmQsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcclxuXHJcbiAgLy8gU2Nyb2xsIGV2ZW50IGxpc3RlbmVyIG9uIHNjcm9sbCBwYXJlbnRzXHJcbiAgdmFyIHNjcm9sbEVsZW1lbnQgPSBnZXRTY3JvbGxQYXJlbnQocmVmZXJlbmNlKTtcclxuICBhdHRhY2hUb1Njcm9sbFBhcmVudHMoc2Nyb2xsRWxlbWVudCwgJ3Njcm9sbCcsIHN0YXRlLnVwZGF0ZUJvdW5kLCBzdGF0ZS5zY3JvbGxQYXJlbnRzKTtcclxuICBzdGF0ZS5zY3JvbGxFbGVtZW50ID0gc2Nyb2xsRWxlbWVudDtcclxuICBzdGF0ZS5ldmVudHNFbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgcmV0dXJuIHN0YXRlO1xyXG59XHJcblxyXG4vKipcclxuICogSXQgd2lsbCBhZGQgcmVzaXplL3Njcm9sbCBldmVudHMgYW5kIHN0YXJ0IHJlY2FsY3VsYXRpbmdcclxuICogcG9zaXRpb24gb2YgdGhlIHBvcHBlciBlbGVtZW50IHdoZW4gdGhleSBhcmUgdHJpZ2dlcmVkLlxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICovXHJcbmZ1bmN0aW9uIGVuYWJsZUV2ZW50TGlzdGVuZXJzKCkge1xyXG4gIGlmICghdGhpcy5zdGF0ZS5ldmVudHNFbmFibGVkKSB7XHJcbiAgICB0aGlzLnN0YXRlID0gc2V0dXBFdmVudExpc3RlbmVycyh0aGlzLnJlZmVyZW5jZSwgdGhpcy5vcHRpb25zLCB0aGlzLnN0YXRlLCB0aGlzLnNjaGVkdWxlVXBkYXRlKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXJzIHVzZWQgdG8gdXBkYXRlIHRoZSBwb3BwZXIgcG9zaXRpb25cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycyhyZWZlcmVuY2UsIHN0YXRlKSB7XHJcbiAgLy8gUmVtb3ZlIHJlc2l6ZSBldmVudCBsaXN0ZW5lciBvbiB3aW5kb3dcclxuICBnZXRXaW5kb3cocmVmZXJlbmNlKS5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBzdGF0ZS51cGRhdGVCb3VuZCk7XHJcblxyXG4gIC8vIFJlbW92ZSBzY3JvbGwgZXZlbnQgbGlzdGVuZXIgb24gc2Nyb2xsIHBhcmVudHNcclxuICBzdGF0ZS5zY3JvbGxQYXJlbnRzLmZvckVhY2goZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHN0YXRlLnVwZGF0ZUJvdW5kKTtcclxuICB9KTtcclxuXHJcbiAgLy8gUmVzZXQgc3RhdGVcclxuICBzdGF0ZS51cGRhdGVCb3VuZCA9IG51bGw7XHJcbiAgc3RhdGUuc2Nyb2xsUGFyZW50cyA9IFtdO1xyXG4gIHN0YXRlLnNjcm9sbEVsZW1lbnQgPSBudWxsO1xyXG4gIHN0YXRlLmV2ZW50c0VuYWJsZWQgPSBmYWxzZTtcclxuICByZXR1cm4gc3RhdGU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJdCB3aWxsIHJlbW92ZSByZXNpemUvc2Nyb2xsIGV2ZW50cyBhbmQgd29uJ3QgcmVjYWxjdWxhdGUgcG9wcGVyIHBvc2l0aW9uXHJcbiAqIHdoZW4gdGhleSBhcmUgdHJpZ2dlcmVkLiBJdCBhbHNvIHdvbid0IHRyaWdnZXIgb25VcGRhdGUgY2FsbGJhY2sgYW55bW9yZSxcclxuICogdW5sZXNzIHlvdSBjYWxsIGB1cGRhdGVgIG1ldGhvZCBtYW51YWxseS5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBkaXNhYmxlRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgaWYgKHRoaXMuc3RhdGUuZXZlbnRzRW5hYmxlZCkge1xyXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5zY2hlZHVsZVVwZGF0ZSk7XHJcbiAgICB0aGlzLnN0YXRlID0gcmVtb3ZlRXZlbnRMaXN0ZW5lcnModGhpcy5yZWZlcmVuY2UsIHRoaXMuc3RhdGUpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRlbGxzIGlmIGEgZ2l2ZW4gaW5wdXQgaXMgYSBudW1iZXJcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7Kn0gaW5wdXQgdG8gY2hlY2tcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzTnVtZXJpYyhuKSB7XHJcbiAgcmV0dXJuIG4gIT09ICcnICYmICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCB0aGUgc3R5bGUgdG8gdGhlIGdpdmVuIHBvcHBlclxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50IC0gRWxlbWVudCB0byBhcHBseSB0aGUgc3R5bGUgdG9cclxuICogQGFyZ3VtZW50IHtPYmplY3R9IHN0eWxlc1xyXG4gKiBPYmplY3Qgd2l0aCBhIGxpc3Qgb2YgcHJvcGVydGllcyBhbmQgdmFsdWVzIHdoaWNoIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gc2V0U3R5bGVzKGVsZW1lbnQsIHN0eWxlcykge1xyXG4gIE9iamVjdC5rZXlzKHN0eWxlcykuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xyXG4gICAgdmFyIHVuaXQgPSAnJztcclxuICAgIC8vIGFkZCB1bml0IGlmIHRoZSB2YWx1ZSBpcyBudW1lcmljIGFuZCBpcyBvbmUgb2YgdGhlIGZvbGxvd2luZ1xyXG4gICAgaWYgKFsnd2lkdGgnLCAnaGVpZ2h0JywgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddLmluZGV4T2YocHJvcCkgIT09IC0xICYmIGlzTnVtZXJpYyhzdHlsZXNbcHJvcF0pKSB7XHJcbiAgICAgIHVuaXQgPSAncHgnO1xyXG4gICAgfVxyXG4gICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IHN0eWxlc1twcm9wXSArIHVuaXQ7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIGF0dHJpYnV0ZXMgdG8gdGhlIGdpdmVuIHBvcHBlclxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50IC0gRWxlbWVudCB0byBhcHBseSB0aGUgYXR0cmlidXRlcyB0b1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gc3R5bGVzXHJcbiAqIE9iamVjdCB3aXRoIGEgbGlzdCBvZiBwcm9wZXJ0aWVzIGFuZCB2YWx1ZXMgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcclxuICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XHJcbiAgICB2YXIgdmFsdWUgPSBhdHRyaWJ1dGVzW3Byb3BdO1xyXG4gICAgaWYgKHZhbHVlICE9PSBmYWxzZSkge1xyXG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShwcm9wLCBhdHRyaWJ1dGVzW3Byb3BdKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKHByb3ApO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YS5zdHlsZXMgLSBMaXN0IG9mIHN0eWxlIHByb3BlcnRpZXMgLSB2YWx1ZXMgdG8gYXBwbHkgdG8gcG9wcGVyIGVsZW1lbnRcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEuYXR0cmlidXRlcyAtIExpc3Qgb2YgYXR0cmlidXRlIHByb3BlcnRpZXMgLSB2YWx1ZXMgdG8gYXBwbHkgdG8gcG9wcGVyIGVsZW1lbnRcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgc2FtZSBkYXRhIG9iamVjdFxyXG4gKi9cclxuZnVuY3Rpb24gYXBwbHlTdHlsZShkYXRhKSB7XHJcbiAgLy8gYW55IHByb3BlcnR5IHByZXNlbnQgaW4gYGRhdGEuc3R5bGVzYCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlcixcclxuICAvLyBpbiB0aGlzIHdheSB3ZSBjYW4gbWFrZSB0aGUgM3JkIHBhcnR5IG1vZGlmaWVycyBhZGQgY3VzdG9tIHN0eWxlcyB0byBpdFxyXG4gIC8vIEJlIGF3YXJlLCBtb2RpZmllcnMgY291bGQgb3ZlcnJpZGUgdGhlIHByb3BlcnRpZXMgZGVmaW5lZCBpbiB0aGUgcHJldmlvdXNcclxuICAvLyBsaW5lcyBvZiB0aGlzIG1vZGlmaWVyIVxyXG4gIHNldFN0eWxlcyhkYXRhLmluc3RhbmNlLnBvcHBlciwgZGF0YS5zdHlsZXMpO1xyXG5cclxuICAvLyBhbnkgcHJvcGVydHkgcHJlc2VudCBpbiBgZGF0YS5hdHRyaWJ1dGVzYCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlcixcclxuICAvLyB0aGV5IHdpbGwgYmUgc2V0IGFzIEhUTUwgYXR0cmlidXRlcyBvZiB0aGUgZWxlbWVudFxyXG4gIHNldEF0dHJpYnV0ZXMoZGF0YS5pbnN0YW5jZS5wb3BwZXIsIGRhdGEuYXR0cmlidXRlcyk7XHJcblxyXG4gIC8vIGlmIGFycm93RWxlbWVudCBpcyBkZWZpbmVkIGFuZCBhcnJvd1N0eWxlcyBoYXMgc29tZSBwcm9wZXJ0aWVzXHJcbiAgaWYgKGRhdGEuYXJyb3dFbGVtZW50ICYmIE9iamVjdC5rZXlzKGRhdGEuYXJyb3dTdHlsZXMpLmxlbmd0aCkge1xyXG4gICAgc2V0U3R5bGVzKGRhdGEuYXJyb3dFbGVtZW50LCBkYXRhLmFycm93U3R5bGVzKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IHRoZSB4LXBsYWNlbWVudCBhdHRyaWJ1dGUgYmVmb3JlIGV2ZXJ5dGhpbmcgZWxzZSBiZWNhdXNlIGl0IGNvdWxkIGJlIHVzZWRcclxuICogdG8gYWRkIG1hcmdpbnMgdG8gdGhlIHBvcHBlciBtYXJnaW5zIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWQgdG8gZ2V0IHRoZVxyXG4gKiBjb3JyZWN0IHBvcHBlciBvZmZzZXRzLlxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIubW9kaWZpZXJzXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHJlZmVyZW5jZSAtIFRoZSByZWZlcmVuY2UgZWxlbWVudCB1c2VkIHRvIHBvc2l0aW9uIHRoZSBwb3BwZXJcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcG9wcGVyIC0gVGhlIEhUTUwgZWxlbWVudCB1c2VkIGFzIHBvcHBlclxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFBvcHBlci5qcyBvcHRpb25zXHJcbiAqL1xyXG5mdW5jdGlvbiBhcHBseVN0eWxlT25Mb2FkKHJlZmVyZW5jZSwgcG9wcGVyLCBvcHRpb25zLCBtb2RpZmllck9wdGlvbnMsIHN0YXRlKSB7XHJcbiAgLy8gY29tcHV0ZSByZWZlcmVuY2UgZWxlbWVudCBvZmZzZXRzXHJcbiAgdmFyIHJlZmVyZW5jZU9mZnNldHMgPSBnZXRSZWZlcmVuY2VPZmZzZXRzKHN0YXRlLCBwb3BwZXIsIHJlZmVyZW5jZSwgb3B0aW9ucy5wb3NpdGlvbkZpeGVkKTtcclxuXHJcbiAgLy8gY29tcHV0ZSBhdXRvIHBsYWNlbWVudCwgc3RvcmUgcGxhY2VtZW50IGluc2lkZSB0aGUgZGF0YSBvYmplY3QsXHJcbiAgLy8gbW9kaWZpZXJzIHdpbGwgYmUgYWJsZSB0byBlZGl0IGBwbGFjZW1lbnRgIGlmIG5lZWRlZFxyXG4gIC8vIGFuZCByZWZlciB0byBvcmlnaW5hbFBsYWNlbWVudCB0byBrbm93IHRoZSBvcmlnaW5hbCB2YWx1ZVxyXG4gIHZhciBwbGFjZW1lbnQgPSBjb21wdXRlQXV0b1BsYWNlbWVudChvcHRpb25zLnBsYWNlbWVudCwgcmVmZXJlbmNlT2Zmc2V0cywgcG9wcGVyLCByZWZlcmVuY2UsIG9wdGlvbnMubW9kaWZpZXJzLmZsaXAuYm91bmRhcmllc0VsZW1lbnQsIG9wdGlvbnMubW9kaWZpZXJzLmZsaXAucGFkZGluZyk7XHJcblxyXG4gIHBvcHBlci5zZXRBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50JywgcGxhY2VtZW50KTtcclxuXHJcbiAgLy8gQXBwbHkgYHBvc2l0aW9uYCB0byBwb3BwZXIgYmVmb3JlIGFueXRoaW5nIGVsc2UgYmVjYXVzZVxyXG4gIC8vIHdpdGhvdXQgdGhlIHBvc2l0aW9uIGFwcGxpZWQgd2UgY2FuJ3QgZ3VhcmFudGVlIGNvcnJlY3QgY29tcHV0YXRpb25zXHJcbiAgc2V0U3R5bGVzKHBvcHBlciwgeyBwb3NpdGlvbjogb3B0aW9ucy5wb3NpdGlvbkZpeGVkID8gJ2ZpeGVkJyA6ICdhYnNvbHV0ZScgfSk7XHJcblxyXG4gIHJldHVybiBvcHRpb25zO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIGNvbXB1dGVTdHlsZShkYXRhLCBvcHRpb25zKSB7XHJcbiAgdmFyIHggPSBvcHRpb25zLngsXHJcbiAgICAgIHkgPSBvcHRpb25zLnk7XHJcbiAgdmFyIHBvcHBlciA9IGRhdGEub2Zmc2V0cy5wb3BwZXI7XHJcblxyXG4gIC8vIFJlbW92ZSB0aGlzIGxlZ2FjeSBzdXBwb3J0IGluIFBvcHBlci5qcyB2MlxyXG5cclxuICB2YXIgbGVnYWN5R3B1QWNjZWxlcmF0aW9uT3B0aW9uID0gZmluZChkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgZnVuY3Rpb24gKG1vZGlmaWVyKSB7XHJcbiAgICByZXR1cm4gbW9kaWZpZXIubmFtZSA9PT0gJ2FwcGx5U3R5bGUnO1xyXG4gIH0pLmdwdUFjY2VsZXJhdGlvbjtcclxuICBpZiAobGVnYWN5R3B1QWNjZWxlcmF0aW9uT3B0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgIGNvbnNvbGUud2FybignV0FSTklORzogYGdwdUFjY2VsZXJhdGlvbmAgb3B0aW9uIG1vdmVkIHRvIGBjb21wdXRlU3R5bGVgIG1vZGlmaWVyIGFuZCB3aWxsIG5vdCBiZSBzdXBwb3J0ZWQgaW4gZnV0dXJlIHZlcnNpb25zIG9mIFBvcHBlci5qcyEnKTtcclxuICB9XHJcbiAgdmFyIGdwdUFjY2VsZXJhdGlvbiA9IGxlZ2FjeUdwdUFjY2VsZXJhdGlvbk9wdGlvbiAhPT0gdW5kZWZpbmVkID8gbGVnYWN5R3B1QWNjZWxlcmF0aW9uT3B0aW9uIDogb3B0aW9ucy5ncHVBY2NlbGVyYXRpb247XHJcblxyXG4gIHZhciBvZmZzZXRQYXJlbnQgPSBnZXRPZmZzZXRQYXJlbnQoZGF0YS5pbnN0YW5jZS5wb3BwZXIpO1xyXG4gIHZhciBvZmZzZXRQYXJlbnRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KG9mZnNldFBhcmVudCk7XHJcblxyXG4gIC8vIFN0eWxlc1xyXG4gIHZhciBzdHlsZXMgPSB7XHJcbiAgICBwb3NpdGlvbjogcG9wcGVyLnBvc2l0aW9uXHJcbiAgfTtcclxuXHJcbiAgLy8gQXZvaWQgYmx1cnJ5IHRleHQgYnkgdXNpbmcgZnVsbCBwaXhlbCBpbnRlZ2Vycy5cclxuICAvLyBGb3IgcGl4ZWwtcGVyZmVjdCBwb3NpdGlvbmluZywgdG9wL2JvdHRvbSBwcmVmZXJzIHJvdW5kZWRcclxuICAvLyB2YWx1ZXMsIHdoaWxlIGxlZnQvcmlnaHQgcHJlZmVycyBmbG9vcmVkIHZhbHVlcy5cclxuICB2YXIgb2Zmc2V0cyA9IHtcclxuICAgIGxlZnQ6IE1hdGguZmxvb3IocG9wcGVyLmxlZnQpLFxyXG4gICAgdG9wOiBNYXRoLnJvdW5kKHBvcHBlci50b3ApLFxyXG4gICAgYm90dG9tOiBNYXRoLnJvdW5kKHBvcHBlci5ib3R0b20pLFxyXG4gICAgcmlnaHQ6IE1hdGguZmxvb3IocG9wcGVyLnJpZ2h0KVxyXG4gIH07XHJcblxyXG4gIHZhciBzaWRlQSA9IHggPT09ICdib3R0b20nID8gJ3RvcCcgOiAnYm90dG9tJztcclxuICB2YXIgc2lkZUIgPSB5ID09PSAncmlnaHQnID8gJ2xlZnQnIDogJ3JpZ2h0JztcclxuXHJcbiAgLy8gaWYgZ3B1QWNjZWxlcmF0aW9uIGlzIHNldCB0byBgdHJ1ZWAgYW5kIHRyYW5zZm9ybSBpcyBzdXBwb3J0ZWQsXHJcbiAgLy8gIHdlIHVzZSBgdHJhbnNsYXRlM2RgIHRvIGFwcGx5IHRoZSBwb3NpdGlvbiB0byB0aGUgcG9wcGVyIHdlXHJcbiAgLy8gYXV0b21hdGljYWxseSB1c2UgdGhlIHN1cHBvcnRlZCBwcmVmaXhlZCB2ZXJzaW9uIGlmIG5lZWRlZFxyXG4gIHZhciBwcmVmaXhlZFByb3BlcnR5ID0gZ2V0U3VwcG9ydGVkUHJvcGVydHlOYW1lKCd0cmFuc2Zvcm0nKTtcclxuXHJcbiAgLy8gbm93LCBsZXQncyBtYWtlIGEgc3RlcCBiYWNrIGFuZCBsb29rIGF0IHRoaXMgY29kZSBjbG9zZWx5ICh3dGY/KVxyXG4gIC8vIElmIHRoZSBjb250ZW50IG9mIHRoZSBwb3BwZXIgZ3Jvd3Mgb25jZSBpdCdzIGJlZW4gcG9zaXRpb25lZCwgaXRcclxuICAvLyBtYXkgaGFwcGVuIHRoYXQgdGhlIHBvcHBlciBnZXRzIG1pc3BsYWNlZCBiZWNhdXNlIG9mIHRoZSBuZXcgY29udGVudFxyXG4gIC8vIG92ZXJmbG93aW5nIGl0cyByZWZlcmVuY2UgZWxlbWVudFxyXG4gIC8vIFRvIGF2b2lkIHRoaXMgcHJvYmxlbSwgd2UgcHJvdmlkZSB0d28gb3B0aW9ucyAoeCBhbmQgeSksIHdoaWNoIGFsbG93XHJcbiAgLy8gdGhlIGNvbnN1bWVyIHRvIGRlZmluZSB0aGUgb2Zmc2V0IG9yaWdpbi5cclxuICAvLyBJZiB3ZSBwb3NpdGlvbiBhIHBvcHBlciBvbiB0b3Agb2YgYSByZWZlcmVuY2UgZWxlbWVudCwgd2UgY2FuIHNldFxyXG4gIC8vIGB4YCB0byBgdG9wYCB0byBtYWtlIHRoZSBwb3BwZXIgZ3JvdyB0b3dhcmRzIGl0cyB0b3AgaW5zdGVhZCBvZlxyXG4gIC8vIGl0cyBib3R0b20uXHJcbiAgdmFyIGxlZnQgPSB2b2lkIDAsXHJcbiAgICAgIHRvcCA9IHZvaWQgMDtcclxuICBpZiAoc2lkZUEgPT09ICdib3R0b20nKSB7XHJcbiAgICB0b3AgPSAtb2Zmc2V0UGFyZW50UmVjdC5oZWlnaHQgKyBvZmZzZXRzLmJvdHRvbTtcclxuICB9IGVsc2Uge1xyXG4gICAgdG9wID0gb2Zmc2V0cy50b3A7XHJcbiAgfVxyXG4gIGlmIChzaWRlQiA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgbGVmdCA9IC1vZmZzZXRQYXJlbnRSZWN0LndpZHRoICsgb2Zmc2V0cy5yaWdodDtcclxuICB9IGVsc2Uge1xyXG4gICAgbGVmdCA9IG9mZnNldHMubGVmdDtcclxuICB9XHJcbiAgaWYgKGdwdUFjY2VsZXJhdGlvbiAmJiBwcmVmaXhlZFByb3BlcnR5KSB7XHJcbiAgICBzdHlsZXNbcHJlZml4ZWRQcm9wZXJ0eV0gPSAndHJhbnNsYXRlM2QoJyArIGxlZnQgKyAncHgsICcgKyB0b3AgKyAncHgsIDApJztcclxuICAgIHN0eWxlc1tzaWRlQV0gPSAwO1xyXG4gICAgc3R5bGVzW3NpZGVCXSA9IDA7XHJcbiAgICBzdHlsZXMud2lsbENoYW5nZSA9ICd0cmFuc2Zvcm0nO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBvdGh3ZXJpc2UsIHdlIHVzZSB0aGUgc3RhbmRhcmQgYHRvcGAsIGBsZWZ0YCwgYGJvdHRvbWAgYW5kIGByaWdodGAgcHJvcGVydGllc1xyXG4gICAgdmFyIGludmVydFRvcCA9IHNpZGVBID09PSAnYm90dG9tJyA/IC0xIDogMTtcclxuICAgIHZhciBpbnZlcnRMZWZ0ID0gc2lkZUIgPT09ICdyaWdodCcgPyAtMSA6IDE7XHJcbiAgICBzdHlsZXNbc2lkZUFdID0gdG9wICogaW52ZXJ0VG9wO1xyXG4gICAgc3R5bGVzW3NpZGVCXSA9IGxlZnQgKiBpbnZlcnRMZWZ0O1xyXG4gICAgc3R5bGVzLndpbGxDaGFuZ2UgPSBzaWRlQSArICcsICcgKyBzaWRlQjtcclxuICB9XHJcblxyXG4gIC8vIEF0dHJpYnV0ZXNcclxuICB2YXIgYXR0cmlidXRlcyA9IHtcclxuICAgICd4LXBsYWNlbWVudCc6IGRhdGEucGxhY2VtZW50XHJcbiAgfTtcclxuXHJcbiAgLy8gVXBkYXRlIGBkYXRhYCBhdHRyaWJ1dGVzLCBzdHlsZXMgYW5kIGFycm93U3R5bGVzXHJcbiAgZGF0YS5hdHRyaWJ1dGVzID0gX2V4dGVuZHMkMSh7fSwgYXR0cmlidXRlcywgZGF0YS5hdHRyaWJ1dGVzKTtcclxuICBkYXRhLnN0eWxlcyA9IF9leHRlbmRzJDEoe30sIHN0eWxlcywgZGF0YS5zdHlsZXMpO1xyXG4gIGRhdGEuYXJyb3dTdHlsZXMgPSBfZXh0ZW5kcyQxKHt9LCBkYXRhLm9mZnNldHMuYXJyb3csIGRhdGEuYXJyb3dTdHlsZXMpO1xyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEhlbHBlciB1c2VkIHRvIGtub3cgaWYgdGhlIGdpdmVuIG1vZGlmaWVyIGRlcGVuZHMgZnJvbSBhbm90aGVyIG9uZS48YnIgLz5cclxuICogSXQgY2hlY2tzIGlmIHRoZSBuZWVkZWQgbW9kaWZpZXIgaXMgbGlzdGVkIGFuZCBlbmFibGVkLlxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtBcnJheX0gbW9kaWZpZXJzIC0gbGlzdCBvZiBtb2RpZmllcnNcclxuICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RpbmdOYW1lIC0gbmFtZSBvZiByZXF1ZXN0aW5nIG1vZGlmaWVyXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0ZWROYW1lIC0gbmFtZSBvZiByZXF1ZXN0ZWQgbW9kaWZpZXJcclxuICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc01vZGlmaWVyUmVxdWlyZWQobW9kaWZpZXJzLCByZXF1ZXN0aW5nTmFtZSwgcmVxdWVzdGVkTmFtZSkge1xyXG4gIHZhciByZXF1ZXN0aW5nID0gZmluZChtb2RpZmllcnMsIGZ1bmN0aW9uIChfcmVmKSB7XHJcbiAgICB2YXIgbmFtZSA9IF9yZWYubmFtZTtcclxuICAgIHJldHVybiBuYW1lID09PSByZXF1ZXN0aW5nTmFtZTtcclxuICB9KTtcclxuXHJcbiAgdmFyIGlzUmVxdWlyZWQgPSAhIXJlcXVlc3RpbmcgJiYgbW9kaWZpZXJzLnNvbWUoZnVuY3Rpb24gKG1vZGlmaWVyKSB7XHJcbiAgICByZXR1cm4gbW9kaWZpZXIubmFtZSA9PT0gcmVxdWVzdGVkTmFtZSAmJiBtb2RpZmllci5lbmFibGVkICYmIG1vZGlmaWVyLm9yZGVyIDwgcmVxdWVzdGluZy5vcmRlcjtcclxuICB9KTtcclxuXHJcbiAgaWYgKCFpc1JlcXVpcmVkKSB7XHJcbiAgICB2YXIgX3JlcXVlc3RpbmcgPSAnYCcgKyByZXF1ZXN0aW5nTmFtZSArICdgJztcclxuICAgIHZhciByZXF1ZXN0ZWQgPSAnYCcgKyByZXF1ZXN0ZWROYW1lICsgJ2AnO1xyXG4gICAgY29uc29sZS53YXJuKHJlcXVlc3RlZCArICcgbW9kaWZpZXIgaXMgcmVxdWlyZWQgYnkgJyArIF9yZXF1ZXN0aW5nICsgJyBtb2RpZmllciBpbiBvcmRlciB0byB3b3JrLCBiZSBzdXJlIHRvIGluY2x1ZGUgaXQgYmVmb3JlICcgKyBfcmVxdWVzdGluZyArICchJyk7XHJcbiAgfVxyXG4gIHJldHVybiBpc1JlcXVpcmVkO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IHVwZGF0ZSBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBhcnJvdyhkYXRhLCBvcHRpb25zKSB7XHJcbiAgdmFyIF9kYXRhJG9mZnNldHMkYXJyb3c7XHJcblxyXG4gIC8vIGFycm93IGRlcGVuZHMgb24ga2VlcFRvZ2V0aGVyIGluIG9yZGVyIHRvIHdvcmtcclxuICBpZiAoIWlzTW9kaWZpZXJSZXF1aXJlZChkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgJ2Fycm93JywgJ2tlZXBUb2dldGhlcicpKSB7XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHZhciBhcnJvd0VsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnQ7XHJcblxyXG4gIC8vIGlmIGFycm93RWxlbWVudCBpcyBhIHN0cmluZywgc3VwcG9zZSBpdCdzIGEgQ1NTIHNlbGVjdG9yXHJcbiAgaWYgKHR5cGVvZiBhcnJvd0VsZW1lbnQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICBhcnJvd0VsZW1lbnQgPSBkYXRhLmluc3RhbmNlLnBvcHBlci5xdWVyeVNlbGVjdG9yKGFycm93RWxlbWVudCk7XHJcblxyXG4gICAgLy8gaWYgYXJyb3dFbGVtZW50IGlzIG5vdCBmb3VuZCwgZG9uJ3QgcnVuIHRoZSBtb2RpZmllclxyXG4gICAgaWYgKCFhcnJvd0VsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGlmIHRoZSBhcnJvd0VsZW1lbnQgaXNuJ3QgYSBxdWVyeSBzZWxlY3RvciB3ZSBtdXN0IGNoZWNrIHRoYXQgdGhlXHJcbiAgICAvLyBwcm92aWRlZCBET00gbm9kZSBpcyBjaGlsZCBvZiBpdHMgcG9wcGVyIG5vZGVcclxuICAgIGlmICghZGF0YS5pbnN0YW5jZS5wb3BwZXIuY29udGFpbnMoYXJyb3dFbGVtZW50KSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1dBUk5JTkc6IGBhcnJvdy5lbGVtZW50YCBtdXN0IGJlIGNoaWxkIG9mIGl0cyBwb3BwZXIgZWxlbWVudCEnKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuICB2YXIgX2RhdGEkb2Zmc2V0cyA9IGRhdGEub2Zmc2V0cyxcclxuICAgICAgcG9wcGVyID0gX2RhdGEkb2Zmc2V0cy5wb3BwZXIsXHJcbiAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlO1xyXG5cclxuICB2YXIgaXNWZXJ0aWNhbCA9IFsnbGVmdCcsICdyaWdodCddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTE7XHJcblxyXG4gIHZhciBsZW4gPSBpc1ZlcnRpY2FsID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xyXG4gIHZhciBzaWRlQ2FwaXRhbGl6ZWQgPSBpc1ZlcnRpY2FsID8gJ1RvcCcgOiAnTGVmdCc7XHJcbiAgdmFyIHNpZGUgPSBzaWRlQ2FwaXRhbGl6ZWQudG9Mb3dlckNhc2UoKTtcclxuICB2YXIgYWx0U2lkZSA9IGlzVmVydGljYWwgPyAnbGVmdCcgOiAndG9wJztcclxuICB2YXIgb3BTaWRlID0gaXNWZXJ0aWNhbCA/ICdib3R0b20nIDogJ3JpZ2h0JztcclxuICB2YXIgYXJyb3dFbGVtZW50U2l6ZSA9IGdldE91dGVyU2l6ZXMoYXJyb3dFbGVtZW50KVtsZW5dO1xyXG5cclxuICAvL1xyXG4gIC8vIGV4dGVuZHMga2VlcFRvZ2V0aGVyIGJlaGF2aW9yIG1ha2luZyBzdXJlIHRoZSBwb3BwZXIgYW5kIGl0c1xyXG4gIC8vIHJlZmVyZW5jZSBoYXZlIGVub3VnaCBwaXhlbHMgaW4gY29uanVjdGlvblxyXG4gIC8vXHJcblxyXG4gIC8vIHRvcC9sZWZ0IHNpZGVcclxuICBpZiAocmVmZXJlbmNlW29wU2lkZV0gLSBhcnJvd0VsZW1lbnRTaXplIDwgcG9wcGVyW3NpZGVdKSB7XHJcbiAgICBkYXRhLm9mZnNldHMucG9wcGVyW3NpZGVdIC09IHBvcHBlcltzaWRlXSAtIChyZWZlcmVuY2Vbb3BTaWRlXSAtIGFycm93RWxlbWVudFNpemUpO1xyXG4gIH1cclxuICAvLyBib3R0b20vcmlnaHQgc2lkZVxyXG4gIGlmIChyZWZlcmVuY2Vbc2lkZV0gKyBhcnJvd0VsZW1lbnRTaXplID4gcG9wcGVyW29wU2lkZV0pIHtcclxuICAgIGRhdGEub2Zmc2V0cy5wb3BwZXJbc2lkZV0gKz0gcmVmZXJlbmNlW3NpZGVdICsgYXJyb3dFbGVtZW50U2l6ZSAtIHBvcHBlcltvcFNpZGVdO1xyXG4gIH1cclxuICBkYXRhLm9mZnNldHMucG9wcGVyID0gZ2V0Q2xpZW50UmVjdChkYXRhLm9mZnNldHMucG9wcGVyKTtcclxuXHJcbiAgLy8gY29tcHV0ZSBjZW50ZXIgb2YgdGhlIHBvcHBlclxyXG4gIHZhciBjZW50ZXIgPSByZWZlcmVuY2Vbc2lkZV0gKyByZWZlcmVuY2VbbGVuXSAvIDIgLSBhcnJvd0VsZW1lbnRTaXplIC8gMjtcclxuXHJcbiAgLy8gQ29tcHV0ZSB0aGUgc2lkZVZhbHVlIHVzaW5nIHRoZSB1cGRhdGVkIHBvcHBlciBvZmZzZXRzXHJcbiAgLy8gdGFrZSBwb3BwZXIgbWFyZ2luIGluIGFjY291bnQgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIHRoaXMgaW5mbyBhdmFpbGFibGVcclxuICB2YXIgY3NzID0gZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KGRhdGEuaW5zdGFuY2UucG9wcGVyKTtcclxuICB2YXIgcG9wcGVyTWFyZ2luU2lkZSA9IHBhcnNlRmxvYXQoY3NzWydtYXJnaW4nICsgc2lkZUNhcGl0YWxpemVkXSwgMTApO1xyXG4gIHZhciBwb3BwZXJCb3JkZXJTaWRlID0gcGFyc2VGbG9hdChjc3NbJ2JvcmRlcicgKyBzaWRlQ2FwaXRhbGl6ZWQgKyAnV2lkdGgnXSwgMTApO1xyXG4gIHZhciBzaWRlVmFsdWUgPSBjZW50ZXIgLSBkYXRhLm9mZnNldHMucG9wcGVyW3NpZGVdIC0gcG9wcGVyTWFyZ2luU2lkZSAtIHBvcHBlckJvcmRlclNpZGU7XHJcblxyXG4gIC8vIHByZXZlbnQgYXJyb3dFbGVtZW50IGZyb20gYmVpbmcgcGxhY2VkIG5vdCBjb250aWd1b3VzbHkgdG8gaXRzIHBvcHBlclxyXG4gIHNpZGVWYWx1ZSA9IE1hdGgubWF4KE1hdGgubWluKHBvcHBlcltsZW5dIC0gYXJyb3dFbGVtZW50U2l6ZSwgc2lkZVZhbHVlKSwgMCk7XHJcblxyXG4gIGRhdGEuYXJyb3dFbGVtZW50ID0gYXJyb3dFbGVtZW50O1xyXG4gIGRhdGEub2Zmc2V0cy5hcnJvdyA9IChfZGF0YSRvZmZzZXRzJGFycm93ID0ge30sIGRlZmluZVByb3BlcnR5JDEoX2RhdGEkb2Zmc2V0cyRhcnJvdywgc2lkZSwgTWF0aC5yb3VuZChzaWRlVmFsdWUpKSwgZGVmaW5lUHJvcGVydHkkMShfZGF0YSRvZmZzZXRzJGFycm93LCBhbHRTaWRlLCAnJyksIF9kYXRhJG9mZnNldHMkYXJyb3cpO1xyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgb3Bwb3NpdGUgcGxhY2VtZW50IHZhcmlhdGlvbiBvZiB0aGUgZ2l2ZW4gb25lXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gcGxhY2VtZW50IHZhcmlhdGlvblxyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBmbGlwcGVkIHBsYWNlbWVudCB2YXJpYXRpb25cclxuICovXHJcbmZ1bmN0aW9uIGdldE9wcG9zaXRlVmFyaWF0aW9uKHZhcmlhdGlvbikge1xyXG4gIGlmICh2YXJpYXRpb24gPT09ICdlbmQnKSB7XHJcbiAgICByZXR1cm4gJ3N0YXJ0JztcclxuICB9IGVsc2UgaWYgKHZhcmlhdGlvbiA9PT0gJ3N0YXJ0Jykge1xyXG4gICAgcmV0dXJuICdlbmQnO1xyXG4gIH1cclxuICByZXR1cm4gdmFyaWF0aW9uO1xyXG59XHJcblxyXG4vKipcclxuICogTGlzdCBvZiBhY2NlcHRlZCBwbGFjZW1lbnRzIHRvIHVzZSBhcyB2YWx1ZXMgb2YgdGhlIGBwbGFjZW1lbnRgIG9wdGlvbi48YnIgLz5cclxuICogVmFsaWQgcGxhY2VtZW50cyBhcmU6XHJcbiAqIC0gYGF1dG9gXHJcbiAqIC0gYHRvcGBcclxuICogLSBgcmlnaHRgXHJcbiAqIC0gYGJvdHRvbWBcclxuICogLSBgbGVmdGBcclxuICpcclxuICogRWFjaCBwbGFjZW1lbnQgY2FuIGhhdmUgYSB2YXJpYXRpb24gZnJvbSB0aGlzIGxpc3Q6XHJcbiAqIC0gYC1zdGFydGBcclxuICogLSBgLWVuZGBcclxuICpcclxuICogVmFyaWF0aW9ucyBhcmUgaW50ZXJwcmV0ZWQgZWFzaWx5IGlmIHlvdSB0aGluayBvZiB0aGVtIGFzIHRoZSBsZWZ0IHRvIHJpZ2h0XHJcbiAqIHdyaXR0ZW4gbGFuZ3VhZ2VzLiBIb3Jpem9udGFsbHkgKGB0b3BgIGFuZCBgYm90dG9tYCksIGBzdGFydGAgaXMgbGVmdCBhbmQgYGVuZGBcclxuICogaXMgcmlnaHQuPGJyIC8+XHJcbiAqIFZlcnRpY2FsbHkgKGBsZWZ0YCBhbmQgYHJpZ2h0YCksIGBzdGFydGAgaXMgdG9wIGFuZCBgZW5kYCBpcyBib3R0b20uXHJcbiAqXHJcbiAqIFNvbWUgdmFsaWQgZXhhbXBsZXMgYXJlOlxyXG4gKiAtIGB0b3AtZW5kYCAob24gdG9wIG9mIHJlZmVyZW5jZSwgcmlnaHQgYWxpZ25lZClcclxuICogLSBgcmlnaHQtc3RhcnRgIChvbiByaWdodCBvZiByZWZlcmVuY2UsIHRvcCBhbGlnbmVkKVxyXG4gKiAtIGBib3R0b21gIChvbiBib3R0b20sIGNlbnRlcmVkKVxyXG4gKiAtIGBhdXRvLXJpZ2h0YCAob24gdGhlIHNpZGUgd2l0aCBtb3JlIHNwYWNlIGF2YWlsYWJsZSwgYWxpZ25tZW50IGRlcGVuZHMgYnkgcGxhY2VtZW50KVxyXG4gKlxyXG4gKiBAc3RhdGljXHJcbiAqIEB0eXBlIHtBcnJheX1cclxuICogQGVudW0ge1N0cmluZ31cclxuICogQHJlYWRvbmx5XHJcbiAqIEBtZXRob2QgcGxhY2VtZW50c1xyXG4gKiBAbWVtYmVyb2YgUG9wcGVyXHJcbiAqL1xyXG52YXIgcGxhY2VtZW50cyA9IFsnYXV0by1zdGFydCcsICdhdXRvJywgJ2F1dG8tZW5kJywgJ3RvcC1zdGFydCcsICd0b3AnLCAndG9wLWVuZCcsICdyaWdodC1zdGFydCcsICdyaWdodCcsICdyaWdodC1lbmQnLCAnYm90dG9tLWVuZCcsICdib3R0b20nLCAnYm90dG9tLXN0YXJ0JywgJ2xlZnQtZW5kJywgJ2xlZnQnLCAnbGVmdC1zdGFydCddO1xyXG5cclxuLy8gR2V0IHJpZCBvZiBgYXV0b2AgYGF1dG8tc3RhcnRgIGFuZCBgYXV0by1lbmRgXHJcbnZhciB2YWxpZFBsYWNlbWVudHMgPSBwbGFjZW1lbnRzLnNsaWNlKDMpO1xyXG5cclxuLyoqXHJcbiAqIEdpdmVuIGFuIGluaXRpYWwgcGxhY2VtZW50LCByZXR1cm5zIGFsbCB0aGUgc3Vic2VxdWVudCBwbGFjZW1lbnRzXHJcbiAqIGNsb2Nrd2lzZSAob3IgY291bnRlci1jbG9ja3dpc2UpLlxyXG4gKlxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHBsYWNlbWVudCAtIEEgdmFsaWQgcGxhY2VtZW50IChpdCBhY2NlcHRzIHZhcmlhdGlvbnMpXHJcbiAqIEBhcmd1bWVudCB7Qm9vbGVhbn0gY291bnRlciAtIFNldCB0byB0cnVlIHRvIHdhbGsgdGhlIHBsYWNlbWVudHMgY291bnRlcmNsb2Nrd2lzZVxyXG4gKiBAcmV0dXJucyB7QXJyYXl9IHBsYWNlbWVudHMgaW5jbHVkaW5nIHRoZWlyIHZhcmlhdGlvbnNcclxuICovXHJcbmZ1bmN0aW9uIGNsb2Nrd2lzZShwbGFjZW1lbnQpIHtcclxuICB2YXIgY291bnRlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XHJcblxyXG4gIHZhciBpbmRleCA9IHZhbGlkUGxhY2VtZW50cy5pbmRleE9mKHBsYWNlbWVudCk7XHJcbiAgdmFyIGFyciA9IHZhbGlkUGxhY2VtZW50cy5zbGljZShpbmRleCArIDEpLmNvbmNhdCh2YWxpZFBsYWNlbWVudHMuc2xpY2UoMCwgaW5kZXgpKTtcclxuICByZXR1cm4gY291bnRlciA/IGFyci5yZXZlcnNlKCkgOiBhcnI7XHJcbn1cclxuXHJcbnZhciBCRUhBVklPUlMgPSB7XHJcbiAgRkxJUDogJ2ZsaXAnLFxyXG4gIENMT0NLV0lTRTogJ2Nsb2Nrd2lzZScsXHJcbiAgQ09VTlRFUkNMT0NLV0lTRTogJ2NvdW50ZXJjbG9ja3dpc2UnXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IHVwZGF0ZSBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBmbGlwKGRhdGEsIG9wdGlvbnMpIHtcclxuICAvLyBpZiBgaW5uZXJgIG1vZGlmaWVyIGlzIGVuYWJsZWQsIHdlIGNhbid0IHVzZSB0aGUgYGZsaXBgIG1vZGlmaWVyXHJcbiAgaWYgKGlzTW9kaWZpZXJFbmFibGVkKGRhdGEuaW5zdGFuY2UubW9kaWZpZXJzLCAnaW5uZXInKSkge1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBpZiAoZGF0YS5mbGlwcGVkICYmIGRhdGEucGxhY2VtZW50ID09PSBkYXRhLm9yaWdpbmFsUGxhY2VtZW50KSB7XHJcbiAgICAvLyBzZWVtcyBsaWtlIGZsaXAgaXMgdHJ5aW5nIHRvIGxvb3AsIHByb2JhYmx5IHRoZXJlJ3Mgbm90IGVub3VnaCBzcGFjZSBvbiBhbnkgb2YgdGhlIGZsaXBwYWJsZSBzaWRlc1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICB2YXIgYm91bmRhcmllcyA9IGdldEJvdW5kYXJpZXMoZGF0YS5pbnN0YW5jZS5wb3BwZXIsIGRhdGEuaW5zdGFuY2UucmVmZXJlbmNlLCBvcHRpb25zLnBhZGRpbmcsIG9wdGlvbnMuYm91bmRhcmllc0VsZW1lbnQsIGRhdGEucG9zaXRpb25GaXhlZCk7XHJcblxyXG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xyXG4gIHZhciBwbGFjZW1lbnRPcHBvc2l0ZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XHJcbiAgdmFyIHZhcmlhdGlvbiA9IGRhdGEucGxhY2VtZW50LnNwbGl0KCctJylbMV0gfHwgJyc7XHJcblxyXG4gIHZhciBmbGlwT3JkZXIgPSBbXTtcclxuXHJcbiAgc3dpdGNoIChvcHRpb25zLmJlaGF2aW9yKSB7XHJcbiAgICBjYXNlIEJFSEFWSU9SUy5GTElQOlxyXG4gICAgICBmbGlwT3JkZXIgPSBbcGxhY2VtZW50LCBwbGFjZW1lbnRPcHBvc2l0ZV07XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBCRUhBVklPUlMuQ0xPQ0tXSVNFOlxyXG4gICAgICBmbGlwT3JkZXIgPSBjbG9ja3dpc2UocGxhY2VtZW50KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIEJFSEFWSU9SUy5DT1VOVEVSQ0xPQ0tXSVNFOlxyXG4gICAgICBmbGlwT3JkZXIgPSBjbG9ja3dpc2UocGxhY2VtZW50LCB0cnVlKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICBmbGlwT3JkZXIgPSBvcHRpb25zLmJlaGF2aW9yO1xyXG4gIH1cclxuXHJcbiAgZmxpcE9yZGVyLmZvckVhY2goZnVuY3Rpb24gKHN0ZXAsIGluZGV4KSB7XHJcbiAgICBpZiAocGxhY2VtZW50ICE9PSBzdGVwIHx8IGZsaXBPcmRlci5sZW5ndGggPT09IGluZGV4ICsgMSkge1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xyXG4gICAgcGxhY2VtZW50T3Bwb3NpdGUgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpO1xyXG5cclxuICAgIHZhciBwb3BwZXJPZmZzZXRzID0gZGF0YS5vZmZzZXRzLnBvcHBlcjtcclxuICAgIHZhciByZWZPZmZzZXRzID0gZGF0YS5vZmZzZXRzLnJlZmVyZW5jZTtcclxuXHJcbiAgICAvLyB1c2luZyBmbG9vciBiZWNhdXNlIHRoZSByZWZlcmVuY2Ugb2Zmc2V0cyBtYXkgY29udGFpbiBkZWNpbWFscyB3ZSBhcmUgbm90IGdvaW5nIHRvIGNvbnNpZGVyIGhlcmVcclxuICAgIHZhciBmbG9vciA9IE1hdGguZmxvb3I7XHJcbiAgICB2YXIgb3ZlcmxhcHNSZWYgPSBwbGFjZW1lbnQgPT09ICdsZWZ0JyAmJiBmbG9vcihwb3BwZXJPZmZzZXRzLnJpZ2h0KSA+IGZsb29yKHJlZk9mZnNldHMubGVmdCkgfHwgcGxhY2VtZW50ID09PSAncmlnaHQnICYmIGZsb29yKHBvcHBlck9mZnNldHMubGVmdCkgPCBmbG9vcihyZWZPZmZzZXRzLnJpZ2h0KSB8fCBwbGFjZW1lbnQgPT09ICd0b3AnICYmIGZsb29yKHBvcHBlck9mZnNldHMuYm90dG9tKSA+IGZsb29yKHJlZk9mZnNldHMudG9wKSB8fCBwbGFjZW1lbnQgPT09ICdib3R0b20nICYmIGZsb29yKHBvcHBlck9mZnNldHMudG9wKSA8IGZsb29yKHJlZk9mZnNldHMuYm90dG9tKTtcclxuXHJcbiAgICB2YXIgb3ZlcmZsb3dzTGVmdCA9IGZsb29yKHBvcHBlck9mZnNldHMubGVmdCkgPCBmbG9vcihib3VuZGFyaWVzLmxlZnQpO1xyXG4gICAgdmFyIG92ZXJmbG93c1JpZ2h0ID0gZmxvb3IocG9wcGVyT2Zmc2V0cy5yaWdodCkgPiBmbG9vcihib3VuZGFyaWVzLnJpZ2h0KTtcclxuICAgIHZhciBvdmVyZmxvd3NUb3AgPSBmbG9vcihwb3BwZXJPZmZzZXRzLnRvcCkgPCBmbG9vcihib3VuZGFyaWVzLnRvcCk7XHJcbiAgICB2YXIgb3ZlcmZsb3dzQm90dG9tID0gZmxvb3IocG9wcGVyT2Zmc2V0cy5ib3R0b20pID4gZmxvb3IoYm91bmRhcmllcy5ib3R0b20pO1xyXG5cclxuICAgIHZhciBvdmVyZmxvd3NCb3VuZGFyaWVzID0gcGxhY2VtZW50ID09PSAnbGVmdCcgJiYgb3ZlcmZsb3dzTGVmdCB8fCBwbGFjZW1lbnQgPT09ICdyaWdodCcgJiYgb3ZlcmZsb3dzUmlnaHQgfHwgcGxhY2VtZW50ID09PSAndG9wJyAmJiBvdmVyZmxvd3NUb3AgfHwgcGxhY2VtZW50ID09PSAnYm90dG9tJyAmJiBvdmVyZmxvd3NCb3R0b207XHJcblxyXG4gICAgLy8gZmxpcCB0aGUgdmFyaWF0aW9uIGlmIHJlcXVpcmVkXHJcbiAgICB2YXIgaXNWZXJ0aWNhbCA9IFsndG9wJywgJ2JvdHRvbSddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTE7XHJcbiAgICB2YXIgZmxpcHBlZFZhcmlhdGlvbiA9ICEhb3B0aW9ucy5mbGlwVmFyaWF0aW9ucyAmJiAoaXNWZXJ0aWNhbCAmJiB2YXJpYXRpb24gPT09ICdzdGFydCcgJiYgb3ZlcmZsb3dzTGVmdCB8fCBpc1ZlcnRpY2FsICYmIHZhcmlhdGlvbiA9PT0gJ2VuZCcgJiYgb3ZlcmZsb3dzUmlnaHQgfHwgIWlzVmVydGljYWwgJiYgdmFyaWF0aW9uID09PSAnc3RhcnQnICYmIG92ZXJmbG93c1RvcCB8fCAhaXNWZXJ0aWNhbCAmJiB2YXJpYXRpb24gPT09ICdlbmQnICYmIG92ZXJmbG93c0JvdHRvbSk7XHJcblxyXG4gICAgaWYgKG92ZXJsYXBzUmVmIHx8IG92ZXJmbG93c0JvdW5kYXJpZXMgfHwgZmxpcHBlZFZhcmlhdGlvbikge1xyXG4gICAgICAvLyB0aGlzIGJvb2xlYW4gdG8gZGV0ZWN0IGFueSBmbGlwIGxvb3BcclxuICAgICAgZGF0YS5mbGlwcGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIGlmIChvdmVybGFwc1JlZiB8fCBvdmVyZmxvd3NCb3VuZGFyaWVzKSB7XHJcbiAgICAgICAgcGxhY2VtZW50ID0gZmxpcE9yZGVyW2luZGV4ICsgMV07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChmbGlwcGVkVmFyaWF0aW9uKSB7XHJcbiAgICAgICAgdmFyaWF0aW9uID0gZ2V0T3Bwb3NpdGVWYXJpYXRpb24odmFyaWF0aW9uKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YS5wbGFjZW1lbnQgPSBwbGFjZW1lbnQgKyAodmFyaWF0aW9uID8gJy0nICsgdmFyaWF0aW9uIDogJycpO1xyXG5cclxuICAgICAgLy8gdGhpcyBvYmplY3QgY29udGFpbnMgYHBvc2l0aW9uYCwgd2Ugd2FudCB0byBwcmVzZXJ2ZSBpdCBhbG9uZyB3aXRoXHJcbiAgICAgIC8vIGFueSBhZGRpdGlvbmFsIHByb3BlcnR5IHdlIG1heSBhZGQgaW4gdGhlIGZ1dHVyZVxyXG4gICAgICBkYXRhLm9mZnNldHMucG9wcGVyID0gX2V4dGVuZHMkMSh7fSwgZGF0YS5vZmZzZXRzLnBvcHBlciwgZ2V0UG9wcGVyT2Zmc2V0cyhkYXRhLmluc3RhbmNlLnBvcHBlciwgZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSwgZGF0YS5wbGFjZW1lbnQpKTtcclxuXHJcbiAgICAgIGRhdGEgPSBydW5Nb2RpZmllcnMoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsIGRhdGEsICdmbGlwJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIGtlZXBUb2dldGhlcihkYXRhKSB7XHJcbiAgdmFyIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXHJcbiAgICAgIHBvcHBlciA9IF9kYXRhJG9mZnNldHMucG9wcGVyLFxyXG4gICAgICByZWZlcmVuY2UgPSBfZGF0YSRvZmZzZXRzLnJlZmVyZW5jZTtcclxuXHJcbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcbiAgdmFyIGZsb29yID0gTWF0aC5mbG9vcjtcclxuICB2YXIgaXNWZXJ0aWNhbCA9IFsndG9wJywgJ2JvdHRvbSddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTE7XHJcbiAgdmFyIHNpZGUgPSBpc1ZlcnRpY2FsID8gJ3JpZ2h0JyA6ICdib3R0b20nO1xyXG4gIHZhciBvcFNpZGUgPSBpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCc7XHJcbiAgdmFyIG1lYXN1cmVtZW50ID0gaXNWZXJ0aWNhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcclxuXHJcbiAgaWYgKHBvcHBlcltzaWRlXSA8IGZsb29yKHJlZmVyZW5jZVtvcFNpZGVdKSkge1xyXG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlcltvcFNpZGVdID0gZmxvb3IocmVmZXJlbmNlW29wU2lkZV0pIC0gcG9wcGVyW21lYXN1cmVtZW50XTtcclxuICB9XHJcbiAgaWYgKHBvcHBlcltvcFNpZGVdID4gZmxvb3IocmVmZXJlbmNlW3NpZGVdKSkge1xyXG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlcltvcFNpZGVdID0gZmxvb3IocmVmZXJlbmNlW3NpZGVdKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgYSBzdHJpbmcgY29udGFpbmluZyB2YWx1ZSArIHVuaXQgaW50byBhIHB4IHZhbHVlIG51bWJlclxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIHttb2RpZmllcnN+b2Zmc2V0fVxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gc3RyIC0gVmFsdWUgKyB1bml0IHN0cmluZ1xyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gbWVhc3VyZW1lbnQgLSBgaGVpZ2h0YCBvciBgd2lkdGhgXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBwb3BwZXJPZmZzZXRzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSByZWZlcmVuY2VPZmZzZXRzXHJcbiAqIEByZXR1cm5zIHtOdW1iZXJ8U3RyaW5nfVxyXG4gKiBWYWx1ZSBpbiBwaXhlbHMsIG9yIG9yaWdpbmFsIHN0cmluZyBpZiBubyB2YWx1ZXMgd2VyZSBleHRyYWN0ZWRcclxuICovXHJcbmZ1bmN0aW9uIHRvVmFsdWUoc3RyLCBtZWFzdXJlbWVudCwgcG9wcGVyT2Zmc2V0cywgcmVmZXJlbmNlT2Zmc2V0cykge1xyXG4gIC8vIHNlcGFyYXRlIHZhbHVlIGZyb20gdW5pdFxyXG4gIHZhciBzcGxpdCA9IHN0ci5tYXRjaCgvKCg/OlxcLXxcXCspP1xcZCpcXC4/XFxkKikoLiopLyk7XHJcbiAgdmFyIHZhbHVlID0gK3NwbGl0WzFdO1xyXG4gIHZhciB1bml0ID0gc3BsaXRbMl07XHJcblxyXG4gIC8vIElmIGl0J3Mgbm90IGEgbnVtYmVyIGl0J3MgYW4gb3BlcmF0b3IsIEkgZ3Vlc3NcclxuICBpZiAoIXZhbHVlKSB7XHJcbiAgICByZXR1cm4gc3RyO1xyXG4gIH1cclxuXHJcbiAgaWYgKHVuaXQuaW5kZXhPZignJScpID09PSAwKSB7XHJcbiAgICB2YXIgZWxlbWVudCA9IHZvaWQgMDtcclxuICAgIHN3aXRjaCAodW5pdCkge1xyXG4gICAgICBjYXNlICclcCc6XHJcbiAgICAgICAgZWxlbWVudCA9IHBvcHBlck9mZnNldHM7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJyUnOlxyXG4gICAgICBjYXNlICclcic6XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgZWxlbWVudCA9IHJlZmVyZW5jZU9mZnNldHM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJlY3QgPSBnZXRDbGllbnRSZWN0KGVsZW1lbnQpO1xyXG4gICAgcmV0dXJuIHJlY3RbbWVhc3VyZW1lbnRdIC8gMTAwICogdmFsdWU7XHJcbiAgfSBlbHNlIGlmICh1bml0ID09PSAndmgnIHx8IHVuaXQgPT09ICd2dycpIHtcclxuICAgIC8vIGlmIGlzIGEgdmggb3IgdncsIHdlIGNhbGN1bGF0ZSB0aGUgc2l6ZSBiYXNlZCBvbiB0aGUgdmlld3BvcnRcclxuICAgIHZhciBzaXplID0gdm9pZCAwO1xyXG4gICAgaWYgKHVuaXQgPT09ICd2aCcpIHtcclxuICAgICAgc2l6ZSA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNpemUgPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHNpemUgLyAxMDAgKiB2YWx1ZTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gaWYgaXMgYW4gZXhwbGljaXQgcGl4ZWwgdW5pdCwgd2UgZ2V0IHJpZCBvZiB0aGUgdW5pdCBhbmQga2VlcCB0aGUgdmFsdWVcclxuICAgIC8vIGlmIGlzIGFuIGltcGxpY2l0IHVuaXQsIGl0J3MgcHgsIGFuZCB3ZSByZXR1cm4ganVzdCB0aGUgdmFsdWVcclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQYXJzZSBhbiBgb2Zmc2V0YCBzdHJpbmcgdG8gZXh0cmFwb2xhdGUgYHhgIGFuZCBgeWAgbnVtZXJpYyBvZmZzZXRzLlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIHttb2RpZmllcnN+b2Zmc2V0fVxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gb2Zmc2V0XHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBwb3BwZXJPZmZzZXRzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSByZWZlcmVuY2VPZmZzZXRzXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBiYXNlUGxhY2VtZW50XHJcbiAqIEByZXR1cm5zIHtBcnJheX0gYSB0d28gY2VsbHMgYXJyYXkgd2l0aCB4IGFuZCB5IG9mZnNldHMgaW4gbnVtYmVyc1xyXG4gKi9cclxuZnVuY3Rpb24gcGFyc2VPZmZzZXQob2Zmc2V0LCBwb3BwZXJPZmZzZXRzLCByZWZlcmVuY2VPZmZzZXRzLCBiYXNlUGxhY2VtZW50KSB7XHJcbiAgdmFyIG9mZnNldHMgPSBbMCwgMF07XHJcblxyXG4gIC8vIFVzZSBoZWlnaHQgaWYgcGxhY2VtZW50IGlzIGxlZnQgb3IgcmlnaHQgYW5kIGluZGV4IGlzIDAgb3RoZXJ3aXNlIHVzZSB3aWR0aFxyXG4gIC8vIGluIHRoaXMgd2F5IHRoZSBmaXJzdCBvZmZzZXQgd2lsbCB1c2UgYW4gYXhpcyBhbmQgdGhlIHNlY29uZCBvbmVcclxuICAvLyB3aWxsIHVzZSB0aGUgb3RoZXIgb25lXHJcbiAgdmFyIHVzZUhlaWdodCA9IFsncmlnaHQnLCAnbGVmdCddLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgIT09IC0xO1xyXG5cclxuICAvLyBTcGxpdCB0aGUgb2Zmc2V0IHN0cmluZyB0byBvYnRhaW4gYSBsaXN0IG9mIHZhbHVlcyBhbmQgb3BlcmFuZHNcclxuICAvLyBUaGUgcmVnZXggYWRkcmVzc2VzIHZhbHVlcyB3aXRoIHRoZSBwbHVzIG9yIG1pbnVzIHNpZ24gaW4gZnJvbnQgKCsxMCwgLTIwLCBldGMpXHJcbiAgdmFyIGZyYWdtZW50cyA9IG9mZnNldC5zcGxpdCgvKFxcK3xcXC0pLykubWFwKGZ1bmN0aW9uIChmcmFnKSB7XHJcbiAgICByZXR1cm4gZnJhZy50cmltKCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIERldGVjdCBpZiB0aGUgb2Zmc2V0IHN0cmluZyBjb250YWlucyBhIHBhaXIgb2YgdmFsdWVzIG9yIGEgc2luZ2xlIG9uZVxyXG4gIC8vIHRoZXkgY291bGQgYmUgc2VwYXJhdGVkIGJ5IGNvbW1hIG9yIHNwYWNlXHJcbiAgdmFyIGRpdmlkZXIgPSBmcmFnbWVudHMuaW5kZXhPZihmaW5kKGZyYWdtZW50cywgZnVuY3Rpb24gKGZyYWcpIHtcclxuICAgIHJldHVybiBmcmFnLnNlYXJjaCgvLHxcXHMvKSAhPT0gLTE7XHJcbiAgfSkpO1xyXG5cclxuICBpZiAoZnJhZ21lbnRzW2RpdmlkZXJdICYmIGZyYWdtZW50c1tkaXZpZGVyXS5pbmRleE9mKCcsJykgPT09IC0xKSB7XHJcbiAgICBjb25zb2xlLndhcm4oJ09mZnNldHMgc2VwYXJhdGVkIGJ5IHdoaXRlIHNwYWNlKHMpIGFyZSBkZXByZWNhdGVkLCB1c2UgYSBjb21tYSAoLCkgaW5zdGVhZC4nKTtcclxuICB9XHJcblxyXG4gIC8vIElmIGRpdmlkZXIgaXMgZm91bmQsIHdlIGRpdmlkZSB0aGUgbGlzdCBvZiB2YWx1ZXMgYW5kIG9wZXJhbmRzIHRvIGRpdmlkZVxyXG4gIC8vIHRoZW0gYnkgb2ZzZXQgWCBhbmQgWS5cclxuICB2YXIgc3BsaXRSZWdleCA9IC9cXHMqLFxccyp8XFxzKy87XHJcbiAgdmFyIG9wcyA9IGRpdmlkZXIgIT09IC0xID8gW2ZyYWdtZW50cy5zbGljZSgwLCBkaXZpZGVyKS5jb25jYXQoW2ZyYWdtZW50c1tkaXZpZGVyXS5zcGxpdChzcGxpdFJlZ2V4KVswXV0pLCBbZnJhZ21lbnRzW2RpdmlkZXJdLnNwbGl0KHNwbGl0UmVnZXgpWzFdXS5jb25jYXQoZnJhZ21lbnRzLnNsaWNlKGRpdmlkZXIgKyAxKSldIDogW2ZyYWdtZW50c107XHJcblxyXG4gIC8vIENvbnZlcnQgdGhlIHZhbHVlcyB3aXRoIHVuaXRzIHRvIGFic29sdXRlIHBpeGVscyB0byBhbGxvdyBvdXIgY29tcHV0YXRpb25zXHJcbiAgb3BzID0gb3BzLm1hcChmdW5jdGlvbiAob3AsIGluZGV4KSB7XHJcbiAgICAvLyBNb3N0IG9mIHRoZSB1bml0cyByZWx5IG9uIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgcG9wcGVyXHJcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSAoaW5kZXggPT09IDEgPyAhdXNlSGVpZ2h0IDogdXNlSGVpZ2h0KSA/ICdoZWlnaHQnIDogJ3dpZHRoJztcclxuICAgIHZhciBtZXJnZVdpdGhQcmV2aW91cyA9IGZhbHNlO1xyXG4gICAgcmV0dXJuIG9wXHJcbiAgICAvLyBUaGlzIGFnZ3JlZ2F0ZXMgYW55IGArYCBvciBgLWAgc2lnbiB0aGF0IGFyZW4ndCBjb25zaWRlcmVkIG9wZXJhdG9yc1xyXG4gICAgLy8gZS5nLjogMTAgKyArNSA9PiBbMTAsICssICs1XVxyXG4gICAgLnJlZHVjZShmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICBpZiAoYVthLmxlbmd0aCAtIDFdID09PSAnJyAmJiBbJysnLCAnLSddLmluZGV4T2YoYikgIT09IC0xKSB7XHJcbiAgICAgICAgYVthLmxlbmd0aCAtIDFdID0gYjtcclxuICAgICAgICBtZXJnZVdpdGhQcmV2aW91cyA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgIH0gZWxzZSBpZiAobWVyZ2VXaXRoUHJldmlvdXMpIHtcclxuICAgICAgICBhW2EubGVuZ3RoIC0gMV0gKz0gYjtcclxuICAgICAgICBtZXJnZVdpdGhQcmV2aW91cyA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBhLmNvbmNhdChiKTtcclxuICAgICAgfVxyXG4gICAgfSwgW10pXHJcbiAgICAvLyBIZXJlIHdlIGNvbnZlcnQgdGhlIHN0cmluZyB2YWx1ZXMgaW50byBudW1iZXIgdmFsdWVzIChpbiBweClcclxuICAgIC5tYXAoZnVuY3Rpb24gKHN0cikge1xyXG4gICAgICByZXR1cm4gdG9WYWx1ZShzdHIsIG1lYXN1cmVtZW50LCBwb3BwZXJPZmZzZXRzLCByZWZlcmVuY2VPZmZzZXRzKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICAvLyBMb29wIHRyb3VnaCB0aGUgb2Zmc2V0cyBhcnJheXMgYW5kIGV4ZWN1dGUgdGhlIG9wZXJhdGlvbnNcclxuICBvcHMuZm9yRWFjaChmdW5jdGlvbiAob3AsIGluZGV4KSB7XHJcbiAgICBvcC5mb3JFYWNoKGZ1bmN0aW9uIChmcmFnLCBpbmRleDIpIHtcclxuICAgICAgaWYgKGlzTnVtZXJpYyhmcmFnKSkge1xyXG4gICAgICAgIG9mZnNldHNbaW5kZXhdICs9IGZyYWcgKiAob3BbaW5kZXgyIC0gMV0gPT09ICctJyA/IC0xIDogMSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIHJldHVybiBvZmZzZXRzO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IHVwZGF0ZSBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAYXJndW1lbnQge051bWJlcnxTdHJpbmd9IG9wdGlvbnMub2Zmc2V0PTBcclxuICogVGhlIG9mZnNldCB2YWx1ZSBhcyBkZXNjcmliZWQgaW4gdGhlIG1vZGlmaWVyIGRlc2NyaXB0aW9uXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIG9mZnNldChkYXRhLCBfcmVmKSB7XHJcbiAgdmFyIG9mZnNldCA9IF9yZWYub2Zmc2V0O1xyXG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudCxcclxuICAgICAgX2RhdGEkb2Zmc2V0cyA9IGRhdGEub2Zmc2V0cyxcclxuICAgICAgcG9wcGVyID0gX2RhdGEkb2Zmc2V0cy5wb3BwZXIsXHJcbiAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlO1xyXG5cclxuICB2YXIgYmFzZVBsYWNlbWVudCA9IHBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xyXG5cclxuICB2YXIgb2Zmc2V0cyA9IHZvaWQgMDtcclxuICBpZiAoaXNOdW1lcmljKCtvZmZzZXQpKSB7XHJcbiAgICBvZmZzZXRzID0gWytvZmZzZXQsIDBdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvZmZzZXRzID0gcGFyc2VPZmZzZXQob2Zmc2V0LCBwb3BwZXIsIHJlZmVyZW5jZSwgYmFzZVBsYWNlbWVudCk7XHJcbiAgfVxyXG5cclxuICBpZiAoYmFzZVBsYWNlbWVudCA9PT0gJ2xlZnQnKSB7XHJcbiAgICBwb3BwZXIudG9wICs9IG9mZnNldHNbMF07XHJcbiAgICBwb3BwZXIubGVmdCAtPSBvZmZzZXRzWzFdO1xyXG4gIH0gZWxzZSBpZiAoYmFzZVBsYWNlbWVudCA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgcG9wcGVyLnRvcCArPSBvZmZzZXRzWzBdO1xyXG4gICAgcG9wcGVyLmxlZnQgKz0gb2Zmc2V0c1sxXTtcclxuICB9IGVsc2UgaWYgKGJhc2VQbGFjZW1lbnQgPT09ICd0b3AnKSB7XHJcbiAgICBwb3BwZXIubGVmdCArPSBvZmZzZXRzWzBdO1xyXG4gICAgcG9wcGVyLnRvcCAtPSBvZmZzZXRzWzFdO1xyXG4gIH0gZWxzZSBpZiAoYmFzZVBsYWNlbWVudCA9PT0gJ2JvdHRvbScpIHtcclxuICAgIHBvcHBlci5sZWZ0ICs9IG9mZnNldHNbMF07XHJcbiAgICBwb3BwZXIudG9wICs9IG9mZnNldHNbMV07XHJcbiAgfVxyXG5cclxuICBkYXRhLnBvcHBlciA9IHBvcHBlcjtcclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBgdXBkYXRlYCBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBwcmV2ZW50T3ZlcmZsb3coZGF0YSwgb3B0aW9ucykge1xyXG4gIHZhciBib3VuZGFyaWVzRWxlbWVudCA9IG9wdGlvbnMuYm91bmRhcmllc0VsZW1lbnQgfHwgZ2V0T2Zmc2V0UGFyZW50KGRhdGEuaW5zdGFuY2UucG9wcGVyKTtcclxuXHJcbiAgLy8gSWYgb2Zmc2V0UGFyZW50IGlzIHRoZSByZWZlcmVuY2UgZWxlbWVudCwgd2UgcmVhbGx5IHdhbnQgdG9cclxuICAvLyBnbyBvbmUgc3RlcCB1cCBhbmQgdXNlIHRoZSBuZXh0IG9mZnNldFBhcmVudCBhcyByZWZlcmVuY2UgdG9cclxuICAvLyBhdm9pZCB0byBtYWtlIHRoaXMgbW9kaWZpZXIgY29tcGxldGVseSB1c2VsZXNzIGFuZCBsb29rIGxpa2UgYnJva2VuXHJcbiAgaWYgKGRhdGEuaW5zdGFuY2UucmVmZXJlbmNlID09PSBib3VuZGFyaWVzRWxlbWVudCkge1xyXG4gICAgYm91bmRhcmllc0VsZW1lbnQgPSBnZXRPZmZzZXRQYXJlbnQoYm91bmRhcmllc0VsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgLy8gTk9URTogRE9NIGFjY2VzcyBoZXJlXHJcbiAgLy8gcmVzZXRzIHRoZSBwb3BwZXIncyBwb3NpdGlvbiBzbyB0aGF0IHRoZSBkb2N1bWVudCBzaXplIGNhbiBiZSBjYWxjdWxhdGVkIGV4Y2x1ZGluZ1xyXG4gIC8vIHRoZSBzaXplIG9mIHRoZSBwb3BwZXIgZWxlbWVudCBpdHNlbGZcclxuICB2YXIgdHJhbnNmb3JtUHJvcCA9IGdldFN1cHBvcnRlZFByb3BlcnR5TmFtZSgndHJhbnNmb3JtJyk7XHJcbiAgdmFyIHBvcHBlclN0eWxlcyA9IGRhdGEuaW5zdGFuY2UucG9wcGVyLnN0eWxlOyAvLyBhc3NpZ25tZW50IHRvIGhlbHAgbWluaWZpY2F0aW9uXHJcbiAgdmFyIHRvcCA9IHBvcHBlclN0eWxlcy50b3AsXHJcbiAgICAgIGxlZnQgPSBwb3BwZXJTdHlsZXMubGVmdCxcclxuICAgICAgdHJhbnNmb3JtID0gcG9wcGVyU3R5bGVzW3RyYW5zZm9ybVByb3BdO1xyXG5cclxuICBwb3BwZXJTdHlsZXMudG9wID0gJyc7XHJcbiAgcG9wcGVyU3R5bGVzLmxlZnQgPSAnJztcclxuICBwb3BwZXJTdHlsZXNbdHJhbnNmb3JtUHJvcF0gPSAnJztcclxuXHJcbiAgdmFyIGJvdW5kYXJpZXMgPSBnZXRCb3VuZGFyaWVzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLmluc3RhbmNlLnJlZmVyZW5jZSwgb3B0aW9ucy5wYWRkaW5nLCBib3VuZGFyaWVzRWxlbWVudCwgZGF0YS5wb3NpdGlvbkZpeGVkKTtcclxuXHJcbiAgLy8gTk9URTogRE9NIGFjY2VzcyBoZXJlXHJcbiAgLy8gcmVzdG9yZXMgdGhlIG9yaWdpbmFsIHN0eWxlIHByb3BlcnRpZXMgYWZ0ZXIgdGhlIG9mZnNldHMgaGF2ZSBiZWVuIGNvbXB1dGVkXHJcbiAgcG9wcGVyU3R5bGVzLnRvcCA9IHRvcDtcclxuICBwb3BwZXJTdHlsZXMubGVmdCA9IGxlZnQ7XHJcbiAgcG9wcGVyU3R5bGVzW3RyYW5zZm9ybVByb3BdID0gdHJhbnNmb3JtO1xyXG5cclxuICBvcHRpb25zLmJvdW5kYXJpZXMgPSBib3VuZGFyaWVzO1xyXG5cclxuICB2YXIgb3JkZXIgPSBvcHRpb25zLnByaW9yaXR5O1xyXG4gIHZhciBwb3BwZXIgPSBkYXRhLm9mZnNldHMucG9wcGVyO1xyXG5cclxuICB2YXIgY2hlY2sgPSB7XHJcbiAgICBwcmltYXJ5OiBmdW5jdGlvbiBwcmltYXJ5KHBsYWNlbWVudCkge1xyXG4gICAgICB2YXIgdmFsdWUgPSBwb3BwZXJbcGxhY2VtZW50XTtcclxuICAgICAgaWYgKHBvcHBlcltwbGFjZW1lbnRdIDwgYm91bmRhcmllc1twbGFjZW1lbnRdICYmICFvcHRpb25zLmVzY2FwZVdpdGhSZWZlcmVuY2UpIHtcclxuICAgICAgICB2YWx1ZSA9IE1hdGgubWF4KHBvcHBlcltwbGFjZW1lbnRdLCBib3VuZGFyaWVzW3BsYWNlbWVudF0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eSQxKHt9LCBwbGFjZW1lbnQsIHZhbHVlKTtcclxuICAgIH0sXHJcbiAgICBzZWNvbmRhcnk6IGZ1bmN0aW9uIHNlY29uZGFyeShwbGFjZW1lbnQpIHtcclxuICAgICAgdmFyIG1haW5TaWRlID0gcGxhY2VtZW50ID09PSAncmlnaHQnID8gJ2xlZnQnIDogJ3RvcCc7XHJcbiAgICAgIHZhciB2YWx1ZSA9IHBvcHBlclttYWluU2lkZV07XHJcbiAgICAgIGlmIChwb3BwZXJbcGxhY2VtZW50XSA+IGJvdW5kYXJpZXNbcGxhY2VtZW50XSAmJiAhb3B0aW9ucy5lc2NhcGVXaXRoUmVmZXJlbmNlKSB7XHJcbiAgICAgICAgdmFsdWUgPSBNYXRoLm1pbihwb3BwZXJbbWFpblNpZGVdLCBib3VuZGFyaWVzW3BsYWNlbWVudF0gLSAocGxhY2VtZW50ID09PSAncmlnaHQnID8gcG9wcGVyLndpZHRoIDogcG9wcGVyLmhlaWdodCkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eSQxKHt9LCBtYWluU2lkZSwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG9yZGVyLmZvckVhY2goZnVuY3Rpb24gKHBsYWNlbWVudCkge1xyXG4gICAgdmFyIHNpZGUgPSBbJ2xlZnQnLCAndG9wJ10uaW5kZXhPZihwbGFjZW1lbnQpICE9PSAtMSA/ICdwcmltYXJ5JyA6ICdzZWNvbmRhcnknO1xyXG4gICAgcG9wcGVyID0gX2V4dGVuZHMkMSh7fSwgcG9wcGVyLCBjaGVja1tzaWRlXShwbGFjZW1lbnQpKTtcclxuICB9KTtcclxuXHJcbiAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IHBvcHBlcjtcclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gc2hpZnQoZGF0YSkge1xyXG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudDtcclxuICB2YXIgYmFzZVBsYWNlbWVudCA9IHBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xyXG4gIHZhciBzaGlmdHZhcmlhdGlvbiA9IHBsYWNlbWVudC5zcGxpdCgnLScpWzFdO1xyXG5cclxuICAvLyBpZiBzaGlmdCBzaGlmdHZhcmlhdGlvbiBpcyBzcGVjaWZpZWQsIHJ1biB0aGUgbW9kaWZpZXJcclxuICBpZiAoc2hpZnR2YXJpYXRpb24pIHtcclxuICAgIHZhciBfZGF0YSRvZmZzZXRzID0gZGF0YS5vZmZzZXRzLFxyXG4gICAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlLFxyXG4gICAgICAgIHBvcHBlciA9IF9kYXRhJG9mZnNldHMucG9wcGVyO1xyXG5cclxuICAgIHZhciBpc1ZlcnRpY2FsID0gWydib3R0b20nLCAndG9wJ10uaW5kZXhPZihiYXNlUGxhY2VtZW50KSAhPT0gLTE7XHJcbiAgICB2YXIgc2lkZSA9IGlzVmVydGljYWwgPyAnbGVmdCcgOiAndG9wJztcclxuICAgIHZhciBtZWFzdXJlbWVudCA9IGlzVmVydGljYWwgPyAnd2lkdGgnIDogJ2hlaWdodCc7XHJcblxyXG4gICAgdmFyIHNoaWZ0T2Zmc2V0cyA9IHtcclxuICAgICAgc3RhcnQ6IGRlZmluZVByb3BlcnR5JDEoe30sIHNpZGUsIHJlZmVyZW5jZVtzaWRlXSksXHJcbiAgICAgIGVuZDogZGVmaW5lUHJvcGVydHkkMSh7fSwgc2lkZSwgcmVmZXJlbmNlW3NpZGVdICsgcmVmZXJlbmNlW21lYXN1cmVtZW50XSAtIHBvcHBlclttZWFzdXJlbWVudF0pXHJcbiAgICB9O1xyXG5cclxuICAgIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBfZXh0ZW5kcyQxKHt9LCBwb3BwZXIsIHNoaWZ0T2Zmc2V0c1tzaGlmdHZhcmlhdGlvbl0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIGhpZGUoZGF0YSkge1xyXG4gIGlmICghaXNNb2RpZmllclJlcXVpcmVkKGRhdGEuaW5zdGFuY2UubW9kaWZpZXJzLCAnaGlkZScsICdwcmV2ZW50T3ZlcmZsb3cnKSkge1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICB2YXIgcmVmUmVjdCA9IGRhdGEub2Zmc2V0cy5yZWZlcmVuY2U7XHJcbiAgdmFyIGJvdW5kID0gZmluZChkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgZnVuY3Rpb24gKG1vZGlmaWVyKSB7XHJcbiAgICByZXR1cm4gbW9kaWZpZXIubmFtZSA9PT0gJ3ByZXZlbnRPdmVyZmxvdyc7XHJcbiAgfSkuYm91bmRhcmllcztcclxuXHJcbiAgaWYgKHJlZlJlY3QuYm90dG9tIDwgYm91bmQudG9wIHx8IHJlZlJlY3QubGVmdCA+IGJvdW5kLnJpZ2h0IHx8IHJlZlJlY3QudG9wID4gYm91bmQuYm90dG9tIHx8IHJlZlJlY3QucmlnaHQgPCBib3VuZC5sZWZ0KSB7XHJcbiAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBET00gYWNjZXNzIGlmIHZpc2liaWxpdHkgaGFzbid0IGNoYW5nZWRcclxuICAgIGlmIChkYXRhLmhpZGUgPT09IHRydWUpIHtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YS5oaWRlID0gdHJ1ZTtcclxuICAgIGRhdGEuYXR0cmlidXRlc1sneC1vdXQtb2YtYm91bmRhcmllcyddID0gJyc7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIEF2b2lkIHVubmVjZXNzYXJ5IERPTSBhY2Nlc3MgaWYgdmlzaWJpbGl0eSBoYXNuJ3QgY2hhbmdlZFxyXG4gICAgaWYgKGRhdGEuaGlkZSA9PT0gZmFsc2UpIHtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YS5oaWRlID0gZmFsc2U7XHJcbiAgICBkYXRhLmF0dHJpYnV0ZXNbJ3gtb3V0LW9mLWJvdW5kYXJpZXMnXSA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gaW5uZXIoZGF0YSkge1xyXG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudDtcclxuICB2YXIgYmFzZVBsYWNlbWVudCA9IHBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xyXG4gIHZhciBfZGF0YSRvZmZzZXRzID0gZGF0YS5vZmZzZXRzLFxyXG4gICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcixcclxuICAgICAgcmVmZXJlbmNlID0gX2RhdGEkb2Zmc2V0cy5yZWZlcmVuY2U7XHJcblxyXG4gIHZhciBpc0hvcml6ID0gWydsZWZ0JywgJ3JpZ2h0J10uaW5kZXhPZihiYXNlUGxhY2VtZW50KSAhPT0gLTE7XHJcblxyXG4gIHZhciBzdWJ0cmFjdExlbmd0aCA9IFsndG9wJywgJ2xlZnQnXS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpID09PSAtMTtcclxuXHJcbiAgcG9wcGVyW2lzSG9yaXogPyAnbGVmdCcgOiAndG9wJ10gPSByZWZlcmVuY2VbYmFzZVBsYWNlbWVudF0gLSAoc3VidHJhY3RMZW5ndGggPyBwb3BwZXJbaXNIb3JpeiA/ICd3aWR0aCcgOiAnaGVpZ2h0J10gOiAwKTtcclxuXHJcbiAgZGF0YS5wbGFjZW1lbnQgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpO1xyXG4gIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBnZXRDbGllbnRSZWN0KHBvcHBlcik7XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogTW9kaWZpZXIgZnVuY3Rpb24sIGVhY2ggbW9kaWZpZXIgY2FuIGhhdmUgYSBmdW5jdGlvbiBvZiB0aGlzIHR5cGUgYXNzaWduZWRcclxuICogdG8gaXRzIGBmbmAgcHJvcGVydHkuPGJyIC8+XHJcbiAqIFRoZXNlIGZ1bmN0aW9ucyB3aWxsIGJlIGNhbGxlZCBvbiBlYWNoIHVwZGF0ZSwgdGhpcyBtZWFucyB0aGF0IHlvdSBtdXN0XHJcbiAqIG1ha2Ugc3VyZSB0aGV5IGFyZSBwZXJmb3JtYW50IGVub3VnaCB0byBhdm9pZCBwZXJmb3JtYW5jZSBib3R0bGVuZWNrcy5cclxuICpcclxuICogQGZ1bmN0aW9uIE1vZGlmaWVyRm5cclxuICogQGFyZ3VtZW50IHtkYXRhT2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBgdXBkYXRlYCBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7ZGF0YU9iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBNb2RpZmllcnMgYXJlIHBsdWdpbnMgdXNlZCB0byBhbHRlciB0aGUgYmVoYXZpb3Igb2YgeW91ciBwb3BwZXJzLjxiciAvPlxyXG4gKiBQb3BwZXIuanMgdXNlcyBhIHNldCBvZiA5IG1vZGlmaWVycyB0byBwcm92aWRlIGFsbCB0aGUgYmFzaWMgZnVuY3Rpb25hbGl0aWVzXHJcbiAqIG5lZWRlZCBieSB0aGUgbGlicmFyeS5cclxuICpcclxuICogVXN1YWxseSB5b3UgZG9uJ3Qgd2FudCB0byBvdmVycmlkZSB0aGUgYG9yZGVyYCwgYGZuYCBhbmQgYG9uTG9hZGAgcHJvcHMuXHJcbiAqIEFsbCB0aGUgb3RoZXIgcHJvcGVydGllcyBhcmUgY29uZmlndXJhdGlvbnMgdGhhdCBjb3VsZCBiZSB0d2Vha2VkLlxyXG4gKiBAbmFtZXNwYWNlIG1vZGlmaWVyc1xyXG4gKi9cclxudmFyIG1vZGlmaWVycyA9IHtcclxuICAvKipcclxuICAgKiBNb2RpZmllciB1c2VkIHRvIHNoaWZ0IHRoZSBwb3BwZXIgb24gdGhlIHN0YXJ0IG9yIGVuZCBvZiBpdHMgcmVmZXJlbmNlXHJcbiAgICogZWxlbWVudC48YnIgLz5cclxuICAgKiBJdCB3aWxsIHJlYWQgdGhlIHZhcmlhdGlvbiBvZiB0aGUgYHBsYWNlbWVudGAgcHJvcGVydHkuPGJyIC8+XHJcbiAgICogSXQgY2FuIGJlIG9uZSBlaXRoZXIgYC1lbmRgIG9yIGAtc3RhcnRgLlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBzaGlmdDoge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTEwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiAxMDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IHNoaWZ0XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGBvZmZzZXRgIG1vZGlmaWVyIGNhbiBzaGlmdCB5b3VyIHBvcHBlciBvbiBib3RoIGl0cyBheGlzLlxyXG4gICAqXHJcbiAgICogSXQgYWNjZXB0cyB0aGUgZm9sbG93aW5nIHVuaXRzOlxyXG4gICAqIC0gYHB4YCBvciB1bml0bGVzcywgaW50ZXJwcmV0ZWQgYXMgcGl4ZWxzXHJcbiAgICogLSBgJWAgb3IgYCVyYCwgcGVyY2VudGFnZSByZWxhdGl2ZSB0byB0aGUgbGVuZ3RoIG9mIHRoZSByZWZlcmVuY2UgZWxlbWVudFxyXG4gICAqIC0gYCVwYCwgcGVyY2VudGFnZSByZWxhdGl2ZSB0byB0aGUgbGVuZ3RoIG9mIHRoZSBwb3BwZXIgZWxlbWVudFxyXG4gICAqIC0gYHZ3YCwgQ1NTIHZpZXdwb3J0IHdpZHRoIHVuaXRcclxuICAgKiAtIGB2aGAsIENTUyB2aWV3cG9ydCBoZWlnaHQgdW5pdFxyXG4gICAqXHJcbiAgICogRm9yIGxlbmd0aCBpcyBpbnRlbmRlZCB0aGUgbWFpbiBheGlzIHJlbGF0aXZlIHRvIHRoZSBwbGFjZW1lbnQgb2YgdGhlIHBvcHBlci48YnIgLz5cclxuICAgKiBUaGlzIG1lYW5zIHRoYXQgaWYgdGhlIHBsYWNlbWVudCBpcyBgdG9wYCBvciBgYm90dG9tYCwgdGhlIGxlbmd0aCB3aWxsIGJlIHRoZVxyXG4gICAqIGB3aWR0aGAuIEluIGNhc2Ugb2YgYGxlZnRgIG9yIGByaWdodGAsIGl0IHdpbGwgYmUgdGhlIGhlaWdodC5cclxuICAgKlxyXG4gICAqIFlvdSBjYW4gcHJvdmlkZSBhIHNpbmdsZSB2YWx1ZSAoYXMgYE51bWJlcmAgb3IgYFN0cmluZ2ApLCBvciBhIHBhaXIgb2YgdmFsdWVzXHJcbiAgICogYXMgYFN0cmluZ2AgZGl2aWRlZCBieSBhIGNvbW1hIG9yIG9uZSAob3IgbW9yZSkgd2hpdGUgc3BhY2VzLjxiciAvPlxyXG4gICAqIFRoZSBsYXR0ZXIgaXMgYSBkZXByZWNhdGVkIG1ldGhvZCBiZWNhdXNlIGl0IGxlYWRzIHRvIGNvbmZ1c2lvbiBhbmQgd2lsbCBiZVxyXG4gICAqIHJlbW92ZWQgaW4gdjIuPGJyIC8+XHJcbiAgICogQWRkaXRpb25hbGx5LCBpdCBhY2NlcHRzIGFkZGl0aW9ucyBhbmQgc3VidHJhY3Rpb25zIGJldHdlZW4gZGlmZmVyZW50IHVuaXRzLlxyXG4gICAqIE5vdGUgdGhhdCBtdWx0aXBsaWNhdGlvbnMgYW5kIGRpdmlzaW9ucyBhcmVuJ3Qgc3VwcG9ydGVkLlxyXG4gICAqXHJcbiAgICogVmFsaWQgZXhhbXBsZXMgYXJlOlxyXG4gICAqIGBgYFxyXG4gICAqIDEwXHJcbiAgICogJzEwJSdcclxuICAgKiAnMTAsIDEwJ1xyXG4gICAqICcxMCUsIDEwJ1xyXG4gICAqICcxMCArIDEwJSdcclxuICAgKiAnMTAgLSA1dmggKyAzJSdcclxuICAgKiAnLTEwcHggKyA1dmgsIDVweCAtIDYlJ1xyXG4gICAqIGBgYFxyXG4gICAqID4gKipOQioqOiBJZiB5b3UgZGVzaXJlIHRvIGFwcGx5IG9mZnNldHMgdG8geW91ciBwb3BwZXJzIGluIGEgd2F5IHRoYXQgbWF5IG1ha2UgdGhlbSBvdmVybGFwXHJcbiAgICogPiB3aXRoIHRoZWlyIHJlZmVyZW5jZSBlbGVtZW50LCB1bmZvcnR1bmF0ZWx5LCB5b3Ugd2lsbCBoYXZlIHRvIGRpc2FibGUgdGhlIGBmbGlwYCBtb2RpZmllci5cclxuICAgKiA+IE1vcmUgb24gdGhpcyBbcmVhZGluZyB0aGlzIGlzc3VlXShodHRwczovL2dpdGh1Yi5jb20vRmV6VnJhc3RhL3BvcHBlci5qcy9pc3N1ZXMvMzczKVxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIG9mZnNldDoge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTIwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiAyMDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IG9mZnNldCxcclxuICAgIC8qKiBAcHJvcCB7TnVtYmVyfFN0cmluZ30gb2Zmc2V0PTBcclxuICAgICAqIFRoZSBvZmZzZXQgdmFsdWUgYXMgZGVzY3JpYmVkIGluIHRoZSBtb2RpZmllciBkZXNjcmlwdGlvblxyXG4gICAgICovXHJcbiAgICBvZmZzZXQ6IDBcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBNb2RpZmllciB1c2VkIHRvIHByZXZlbnQgdGhlIHBvcHBlciBmcm9tIGJlaW5nIHBvc2l0aW9uZWQgb3V0c2lkZSB0aGUgYm91bmRhcnkuXHJcbiAgICpcclxuICAgKiBBbiBzY2VuYXJpbyBleGlzdHMgd2hlcmUgdGhlIHJlZmVyZW5jZSBpdHNlbGYgaXMgbm90IHdpdGhpbiB0aGUgYm91bmRhcmllcy48YnIgLz5cclxuICAgKiBXZSBjYW4gc2F5IGl0IGhhcyBcImVzY2FwZWQgdGhlIGJvdW5kYXJpZXNcIiDigJQgb3IganVzdCBcImVzY2FwZWRcIi48YnIgLz5cclxuICAgKiBJbiB0aGlzIGNhc2Ugd2UgbmVlZCB0byBkZWNpZGUgd2hldGhlciB0aGUgcG9wcGVyIHNob3VsZCBlaXRoZXI6XHJcbiAgICpcclxuICAgKiAtIGRldGFjaCBmcm9tIHRoZSByZWZlcmVuY2UgYW5kIHJlbWFpbiBcInRyYXBwZWRcIiBpbiB0aGUgYm91bmRhcmllcywgb3JcclxuICAgKiAtIGlmIGl0IHNob3VsZCBpZ25vcmUgdGhlIGJvdW5kYXJ5IGFuZCBcImVzY2FwZSB3aXRoIGl0cyByZWZlcmVuY2VcIlxyXG4gICAqXHJcbiAgICogV2hlbiBgZXNjYXBlV2l0aFJlZmVyZW5jZWAgaXMgc2V0IHRvYHRydWVgIGFuZCByZWZlcmVuY2UgaXMgY29tcGxldGVseVxyXG4gICAqIG91dHNpZGUgaXRzIGJvdW5kYXJpZXMsIHRoZSBwb3BwZXIgd2lsbCBvdmVyZmxvdyAob3IgY29tcGxldGVseSBsZWF2ZSlcclxuICAgKiB0aGUgYm91bmRhcmllcyBpbiBvcmRlciB0byByZW1haW4gYXR0YWNoZWQgdG8gdGhlIGVkZ2Ugb2YgdGhlIHJlZmVyZW5jZS5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBwcmV2ZW50T3ZlcmZsb3c6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj0zMDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogMzAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBwcmV2ZW50T3ZlcmZsb3csXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtBcnJheX0gW3ByaW9yaXR5PVsnbGVmdCcsJ3JpZ2h0JywndG9wJywnYm90dG9tJ11dXHJcbiAgICAgKiBQb3BwZXIgd2lsbCB0cnkgdG8gcHJldmVudCBvdmVyZmxvdyBmb2xsb3dpbmcgdGhlc2UgcHJpb3JpdGllcyBieSBkZWZhdWx0LFxyXG4gICAgICogdGhlbiwgaXQgY291bGQgb3ZlcmZsb3cgb24gdGhlIGxlZnQgYW5kIG9uIHRvcCBvZiB0aGUgYGJvdW5kYXJpZXNFbGVtZW50YFxyXG4gICAgICovXHJcbiAgICBwcmlvcml0eTogWydsZWZ0JywgJ3JpZ2h0JywgJ3RvcCcsICdib3R0b20nXSxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age251bWJlcn0gcGFkZGluZz01XHJcbiAgICAgKiBBbW91bnQgb2YgcGl4ZWwgdXNlZCB0byBkZWZpbmUgYSBtaW5pbXVtIGRpc3RhbmNlIGJldHdlZW4gdGhlIGJvdW5kYXJpZXNcclxuICAgICAqIGFuZCB0aGUgcG9wcGVyIHRoaXMgbWFrZXMgc3VyZSB0aGUgcG9wcGVyIGhhcyBhbHdheXMgYSBsaXR0bGUgcGFkZGluZ1xyXG4gICAgICogYmV0d2VlbiB0aGUgZWRnZXMgb2YgaXRzIGNvbnRhaW5lclxyXG4gICAgICovXHJcbiAgICBwYWRkaW5nOiA1LFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7U3RyaW5nfEhUTUxFbGVtZW50fSBib3VuZGFyaWVzRWxlbWVudD0nc2Nyb2xsUGFyZW50J1xyXG4gICAgICogQm91bmRhcmllcyB1c2VkIGJ5IHRoZSBtb2RpZmllciwgY2FuIGJlIGBzY3JvbGxQYXJlbnRgLCBgd2luZG93YCxcclxuICAgICAqIGB2aWV3cG9ydGAgb3IgYW55IERPTSBlbGVtZW50LlxyXG4gICAgICovXHJcbiAgICBib3VuZGFyaWVzRWxlbWVudDogJ3Njcm9sbFBhcmVudCdcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBNb2RpZmllciB1c2VkIHRvIG1ha2Ugc3VyZSB0aGUgcmVmZXJlbmNlIGFuZCBpdHMgcG9wcGVyIHN0YXkgbmVhciBlYWNob3RoZXJzXHJcbiAgICogd2l0aG91dCBsZWF2aW5nIGFueSBnYXAgYmV0d2VlbiB0aGUgdHdvLiBFeHBlY2lhbGx5IHVzZWZ1bCB3aGVuIHRoZSBhcnJvdyBpc1xyXG4gICAqIGVuYWJsZWQgYW5kIHlvdSB3YW50IHRvIGFzc3VyZSBpdCB0byBwb2ludCB0byBpdHMgcmVmZXJlbmNlIGVsZW1lbnQuXHJcbiAgICogSXQgY2FyZXMgb25seSBhYm91dCB0aGUgZmlyc3QgYXhpcywgeW91IGNhbiBzdGlsbCBoYXZlIHBvcHBlcnMgd2l0aCBtYXJnaW5cclxuICAgKiBiZXR3ZWVuIHRoZSBwb3BwZXIgYW5kIGl0cyByZWZlcmVuY2UgZWxlbWVudC5cclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAga2VlcFRvZ2V0aGVyOiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9NDAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDQwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjoga2VlcFRvZ2V0aGVyXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogVGhpcyBtb2RpZmllciBpcyB1c2VkIHRvIG1vdmUgdGhlIGBhcnJvd0VsZW1lbnRgIG9mIHRoZSBwb3BwZXIgdG8gbWFrZVxyXG4gICAqIHN1cmUgaXQgaXMgcG9zaXRpb25lZCBiZXR3ZWVuIHRoZSByZWZlcmVuY2UgZWxlbWVudCBhbmQgaXRzIHBvcHBlciBlbGVtZW50LlxyXG4gICAqIEl0IHdpbGwgcmVhZCB0aGUgb3V0ZXIgc2l6ZSBvZiB0aGUgYGFycm93RWxlbWVudGAgbm9kZSB0byBkZXRlY3QgaG93IG1hbnlcclxuICAgKiBwaXhlbHMgb2YgY29uanVjdGlvbiBhcmUgbmVlZGVkLlxyXG4gICAqXHJcbiAgICogSXQgaGFzIG5vIGVmZmVjdCBpZiBubyBgYXJyb3dFbGVtZW50YCBpcyBwcm92aWRlZC5cclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgYXJyb3c6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj01MDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogNTAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBhcnJvdyxcclxuICAgIC8qKiBAcHJvcCB7U3RyaW5nfEhUTUxFbGVtZW50fSBlbGVtZW50PSdbeC1hcnJvd10nIC0gU2VsZWN0b3Igb3Igbm9kZSB1c2VkIGFzIGFycm93ICovXHJcbiAgICBlbGVtZW50OiAnW3gtYXJyb3ddJ1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gZmxpcCB0aGUgcG9wcGVyJ3MgcGxhY2VtZW50IHdoZW4gaXQgc3RhcnRzIHRvIG92ZXJsYXAgaXRzXHJcbiAgICogcmVmZXJlbmNlIGVsZW1lbnQuXHJcbiAgICpcclxuICAgKiBSZXF1aXJlcyB0aGUgYHByZXZlbnRPdmVyZmxvd2AgbW9kaWZpZXIgYmVmb3JlIGl0IGluIG9yZGVyIHRvIHdvcmsuXHJcbiAgICpcclxuICAgKiAqKk5PVEU6KiogdGhpcyBtb2RpZmllciB3aWxsIGludGVycnVwdCB0aGUgY3VycmVudCB1cGRhdGUgY3ljbGUgYW5kIHdpbGxcclxuICAgKiByZXN0YXJ0IGl0IGlmIGl0IGRldGVjdHMgdGhlIG5lZWQgdG8gZmxpcCB0aGUgcGxhY2VtZW50LlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBmbGlwOiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9NjAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDYwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogZmxpcCxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age1N0cmluZ3xBcnJheX0gYmVoYXZpb3I9J2ZsaXAnXHJcbiAgICAgKiBUaGUgYmVoYXZpb3IgdXNlZCB0byBjaGFuZ2UgdGhlIHBvcHBlcidzIHBsYWNlbWVudC4gSXQgY2FuIGJlIG9uZSBvZlxyXG4gICAgICogYGZsaXBgLCBgY2xvY2t3aXNlYCwgYGNvdW50ZXJjbG9ja3dpc2VgIG9yIGFuIGFycmF5IHdpdGggYSBsaXN0IG9mIHZhbGlkXHJcbiAgICAgKiBwbGFjZW1lbnRzICh3aXRoIG9wdGlvbmFsIHZhcmlhdGlvbnMpLlxyXG4gICAgICovXHJcbiAgICBiZWhhdmlvcjogJ2ZsaXAnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7bnVtYmVyfSBwYWRkaW5nPTVcclxuICAgICAqIFRoZSBwb3BwZXIgd2lsbCBmbGlwIGlmIGl0IGhpdHMgdGhlIGVkZ2VzIG9mIHRoZSBgYm91bmRhcmllc0VsZW1lbnRgXHJcbiAgICAgKi9cclxuICAgIHBhZGRpbmc6IDUsXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtTdHJpbmd8SFRNTEVsZW1lbnR9IGJvdW5kYXJpZXNFbGVtZW50PSd2aWV3cG9ydCdcclxuICAgICAqIFRoZSBlbGVtZW50IHdoaWNoIHdpbGwgZGVmaW5lIHRoZSBib3VuZGFyaWVzIG9mIHRoZSBwb3BwZXIgcG9zaXRpb24sXHJcbiAgICAgKiB0aGUgcG9wcGVyIHdpbGwgbmV2ZXIgYmUgcGxhY2VkIG91dHNpZGUgb2YgdGhlIGRlZmluZWQgYm91bmRhcmllc1xyXG4gICAgICogKGV4Y2VwdCBpZiBrZWVwVG9nZXRoZXIgaXMgZW5hYmxlZClcclxuICAgICAqL1xyXG4gICAgYm91bmRhcmllc0VsZW1lbnQ6ICd2aWV3cG9ydCdcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBNb2RpZmllciB1c2VkIHRvIG1ha2UgdGhlIHBvcHBlciBmbG93IHRvd2FyZCB0aGUgaW5uZXIgb2YgdGhlIHJlZmVyZW5jZSBlbGVtZW50LlxyXG4gICAqIEJ5IGRlZmF1bHQsIHdoZW4gdGhpcyBtb2RpZmllciBpcyBkaXNhYmxlZCwgdGhlIHBvcHBlciB3aWxsIGJlIHBsYWNlZCBvdXRzaWRlXHJcbiAgICogdGhlIHJlZmVyZW5jZSBlbGVtZW50LlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBpbm5lcjoge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTcwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiA3MDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9ZmFsc2UgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogZmFsc2UsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogaW5uZXJcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBNb2RpZmllciB1c2VkIHRvIGhpZGUgdGhlIHBvcHBlciB3aGVuIGl0cyByZWZlcmVuY2UgZWxlbWVudCBpcyBvdXRzaWRlIG9mIHRoZVxyXG4gICAqIHBvcHBlciBib3VuZGFyaWVzLiBJdCB3aWxsIHNldCBhIGB4LW91dC1vZi1ib3VuZGFyaWVzYCBhdHRyaWJ1dGUgd2hpY2ggY2FuXHJcbiAgICogYmUgdXNlZCB0byBoaWRlIHdpdGggYSBDU1Mgc2VsZWN0b3IgdGhlIHBvcHBlciB3aGVuIGl0cyByZWZlcmVuY2UgaXNcclxuICAgKiBvdXQgb2YgYm91bmRhcmllcy5cclxuICAgKlxyXG4gICAqIFJlcXVpcmVzIHRoZSBgcHJldmVudE92ZXJmbG93YCBtb2RpZmllciBiZWZvcmUgaXQgaW4gb3JkZXIgdG8gd29yay5cclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgaGlkZToge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTgwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiA4MDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IGhpZGVcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBDb21wdXRlcyB0aGUgc3R5bGUgdGhhdCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlciBlbGVtZW50IHRvIGdldHNcclxuICAgKiBwcm9wZXJseSBwb3NpdGlvbmVkLlxyXG4gICAqXHJcbiAgICogTm90ZSB0aGF0IHRoaXMgbW9kaWZpZXIgd2lsbCBub3QgdG91Y2ggdGhlIERPTSwgaXQganVzdCBwcmVwYXJlcyB0aGUgc3R5bGVzXHJcbiAgICogc28gdGhhdCBgYXBwbHlTdHlsZWAgbW9kaWZpZXIgY2FuIGFwcGx5IGl0LiBUaGlzIHNlcGFyYXRpb24gaXMgdXNlZnVsXHJcbiAgICogaW4gY2FzZSB5b3UgbmVlZCB0byByZXBsYWNlIGBhcHBseVN0eWxlYCB3aXRoIGEgY3VzdG9tIGltcGxlbWVudGF0aW9uLlxyXG4gICAqXHJcbiAgICogVGhpcyBtb2RpZmllciBoYXMgYDg1MGAgYXMgYG9yZGVyYCB2YWx1ZSB0byBtYWludGFpbiBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XHJcbiAgICogd2l0aCBwcmV2aW91cyB2ZXJzaW9ucyBvZiBQb3BwZXIuanMuIEV4cGVjdCB0aGUgbW9kaWZpZXJzIG9yZGVyaW5nIG1ldGhvZFxyXG4gICAqIHRvIGNoYW5nZSBpbiBmdXR1cmUgbWFqb3IgdmVyc2lvbnMgb2YgdGhlIGxpYnJhcnkuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgY29tcHV0ZVN0eWxlOiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9ODUwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDg1MCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogY29tcHV0ZVN0eWxlLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7Qm9vbGVhbn0gZ3B1QWNjZWxlcmF0aW9uPXRydWVcclxuICAgICAqIElmIHRydWUsIGl0IHVzZXMgdGhlIENTUyAzZCB0cmFuc2Zvcm1hdGlvbiB0byBwb3NpdGlvbiB0aGUgcG9wcGVyLlxyXG4gICAgICogT3RoZXJ3aXNlLCBpdCB3aWxsIHVzZSB0aGUgYHRvcGAgYW5kIGBsZWZ0YCBwcm9wZXJ0aWVzLlxyXG4gICAgICovXHJcbiAgICBncHVBY2NlbGVyYXRpb246IHRydWUsXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtzdHJpbmd9IFt4PSdib3R0b20nXVxyXG4gICAgICogV2hlcmUgdG8gYW5jaG9yIHRoZSBYIGF4aXMgKGBib3R0b21gIG9yIGB0b3BgKS4gQUtBIFggb2Zmc2V0IG9yaWdpbi5cclxuICAgICAqIENoYW5nZSB0aGlzIGlmIHlvdXIgcG9wcGVyIHNob3VsZCBncm93IGluIGEgZGlyZWN0aW9uIGRpZmZlcmVudCBmcm9tIGBib3R0b21gXHJcbiAgICAgKi9cclxuICAgIHg6ICdib3R0b20nLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7c3RyaW5nfSBbeD0nbGVmdCddXHJcbiAgICAgKiBXaGVyZSB0byBhbmNob3IgdGhlIFkgYXhpcyAoYGxlZnRgIG9yIGByaWdodGApLiBBS0EgWSBvZmZzZXQgb3JpZ2luLlxyXG4gICAgICogQ2hhbmdlIHRoaXMgaWYgeW91ciBwb3BwZXIgc2hvdWxkIGdyb3cgaW4gYSBkaXJlY3Rpb24gZGlmZmVyZW50IGZyb20gYHJpZ2h0YFxyXG4gICAgICovXHJcbiAgICB5OiAncmlnaHQnXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQXBwbGllcyB0aGUgY29tcHV0ZWQgc3R5bGVzIHRvIHRoZSBwb3BwZXIgZWxlbWVudC5cclxuICAgKlxyXG4gICAqIEFsbCB0aGUgRE9NIG1hbmlwdWxhdGlvbnMgYXJlIGxpbWl0ZWQgdG8gdGhpcyBtb2RpZmllci4gVGhpcyBpcyB1c2VmdWwgaW4gY2FzZVxyXG4gICAqIHlvdSB3YW50IHRvIGludGVncmF0ZSBQb3BwZXIuanMgaW5zaWRlIGEgZnJhbWV3b3JrIG9yIHZpZXcgbGlicmFyeSBhbmQgeW91XHJcbiAgICogd2FudCB0byBkZWxlZ2F0ZSBhbGwgdGhlIERPTSBtYW5pcHVsYXRpb25zIHRvIGl0LlxyXG4gICAqXHJcbiAgICogTm90ZSB0aGF0IGlmIHlvdSBkaXNhYmxlIHRoaXMgbW9kaWZpZXIsIHlvdSBtdXN0IG1ha2Ugc3VyZSB0aGUgcG9wcGVyIGVsZW1lbnRcclxuICAgKiBoYXMgaXRzIHBvc2l0aW9uIHNldCB0byBgYWJzb2x1dGVgIGJlZm9yZSBQb3BwZXIuanMgY2FuIGRvIGl0cyB3b3JrIVxyXG4gICAqXHJcbiAgICogSnVzdCBkaXNhYmxlIHRoaXMgbW9kaWZpZXIgYW5kIGRlZmluZSB5b3Ugb3duIHRvIGFjaGlldmUgdGhlIGRlc2lyZWQgZWZmZWN0LlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIGFwcGx5U3R5bGU6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj05MDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogOTAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBhcHBseVN0eWxlLFxyXG4gICAgLyoqIEBwcm9wIHtGdW5jdGlvbn0gKi9cclxuICAgIG9uTG9hZDogYXBwbHlTdHlsZU9uTG9hZCxcclxuICAgIC8qKlxyXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAxLjEwLjAsIHRoZSBwcm9wZXJ0eSBtb3ZlZCB0byBgY29tcHV0ZVN0eWxlYCBtb2RpZmllclxyXG4gICAgICogQHByb3Age0Jvb2xlYW59IGdwdUFjY2VsZXJhdGlvbj10cnVlXHJcbiAgICAgKiBJZiB0cnVlLCBpdCB1c2VzIHRoZSBDU1MgM2QgdHJhbnNmb3JtYXRpb24gdG8gcG9zaXRpb24gdGhlIHBvcHBlci5cclxuICAgICAqIE90aGVyd2lzZSwgaXQgd2lsbCB1c2UgdGhlIGB0b3BgIGFuZCBgbGVmdGAgcHJvcGVydGllcy5cclxuICAgICAqL1xyXG4gICAgZ3B1QWNjZWxlcmF0aW9uOiB1bmRlZmluZWRcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVGhlIGBkYXRhT2JqZWN0YCBpcyBhbiBvYmplY3QgY29udGFpbmluZyBhbGwgdGhlIGluZm9ybWF0aW9ucyB1c2VkIGJ5IFBvcHBlci5qc1xyXG4gKiB0aGlzIG9iamVjdCBnZXQgcGFzc2VkIHRvIG1vZGlmaWVycyBhbmQgdG8gdGhlIGBvbkNyZWF0ZWAgYW5kIGBvblVwZGF0ZWAgY2FsbGJhY2tzLlxyXG4gKiBAbmFtZSBkYXRhT2JqZWN0XHJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLmluc3RhbmNlIFRoZSBQb3BwZXIuanMgaW5zdGFuY2VcclxuICogQHByb3BlcnR5IHtTdHJpbmd9IGRhdGEucGxhY2VtZW50IFBsYWNlbWVudCBhcHBsaWVkIHRvIHBvcHBlclxyXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZGF0YS5vcmlnaW5hbFBsYWNlbWVudCBQbGFjZW1lbnQgb3JpZ2luYWxseSBkZWZpbmVkIG9uIGluaXRcclxuICogQHByb3BlcnR5IHtCb29sZWFufSBkYXRhLmZsaXBwZWQgVHJ1ZSBpZiBwb3BwZXIgaGFzIGJlZW4gZmxpcHBlZCBieSBmbGlwIG1vZGlmaWVyXHJcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGF0YS5oaWRlIFRydWUgaWYgdGhlIHJlZmVyZW5jZSBlbGVtZW50IGlzIG91dCBvZiBib3VuZGFyaWVzLCB1c2VmdWwgdG8ga25vdyB3aGVuIHRvIGhpZGUgdGhlIHBvcHBlci5cclxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZGF0YS5hcnJvd0VsZW1lbnQgTm9kZSB1c2VkIGFzIGFycm93IGJ5IGFycm93IG1vZGlmaWVyXHJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLnN0eWxlcyBBbnkgQ1NTIHByb3BlcnR5IGRlZmluZWQgaGVyZSB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlciwgaXQgZXhwZWN0cyB0aGUgSmF2YVNjcmlwdCBub21lbmNsYXR1cmUgKGVnLiBgbWFyZ2luQm90dG9tYClcclxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEuYXJyb3dTdHlsZXMgQW55IENTUyBwcm9wZXJ0eSBkZWZpbmVkIGhlcmUgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIgYXJyb3csIGl0IGV4cGVjdHMgdGhlIEphdmFTY3JpcHQgbm9tZW5jbGF0dXJlIChlZy4gYG1hcmdpbkJvdHRvbWApXHJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLmJvdW5kYXJpZXMgT2Zmc2V0cyBvZiB0aGUgcG9wcGVyIGJvdW5kYXJpZXNcclxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEub2Zmc2V0cyBUaGUgbWVhc3VyZW1lbnRzIG9mIHBvcHBlciwgcmVmZXJlbmNlIGFuZCBhcnJvdyBlbGVtZW50cy5cclxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEub2Zmc2V0cy5wb3BwZXIgYHRvcGAsIGBsZWZ0YCwgYHdpZHRoYCwgYGhlaWdodGAgdmFsdWVzXHJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLm9mZnNldHMucmVmZXJlbmNlIGB0b3BgLCBgbGVmdGAsIGB3aWR0aGAsIGBoZWlnaHRgIHZhbHVlc1xyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5vZmZzZXRzLmFycm93XSBgdG9wYCBhbmQgYGxlZnRgIG9mZnNldHMsIG9ubHkgb25lIG9mIHRoZW0gd2lsbCBiZSBkaWZmZXJlbnQgZnJvbSAwXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIERlZmF1bHQgb3B0aW9ucyBwcm92aWRlZCB0byBQb3BwZXIuanMgY29uc3RydWN0b3IuPGJyIC8+XHJcbiAqIFRoZXNlIGNhbiBiZSBvdmVycmlkZW4gdXNpbmcgdGhlIGBvcHRpb25zYCBhcmd1bWVudCBvZiBQb3BwZXIuanMuPGJyIC8+XHJcbiAqIFRvIG92ZXJyaWRlIGFuIG9wdGlvbiwgc2ltcGx5IHBhc3MgYXMgM3JkIGFyZ3VtZW50IGFuIG9iamVjdCB3aXRoIHRoZSBzYW1lXHJcbiAqIHN0cnVjdHVyZSBvZiB0aGlzIG9iamVjdCwgZXhhbXBsZTpcclxuICogYGBgXHJcbiAqIG5ldyBQb3BwZXIocmVmLCBwb3AsIHtcclxuICogICBtb2RpZmllcnM6IHtcclxuICogICAgIHByZXZlbnRPdmVyZmxvdzogeyBlbmFibGVkOiBmYWxzZSB9XHJcbiAqICAgfVxyXG4gKiB9KVxyXG4gKiBgYGBcclxuICogQHR5cGUge09iamVjdH1cclxuICogQHN0YXRpY1xyXG4gKiBAbWVtYmVyb2YgUG9wcGVyXHJcbiAqL1xyXG52YXIgRGVmYXVsdHMgPSB7XHJcbiAgLyoqXHJcbiAgICogUG9wcGVyJ3MgcGxhY2VtZW50XHJcbiAgICogQHByb3Age1BvcHBlci5wbGFjZW1lbnRzfSBwbGFjZW1lbnQ9J2JvdHRvbSdcclxuICAgKi9cclxuICBwbGFjZW1lbnQ6ICdib3R0b20nLFxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhpcyB0byB0cnVlIGlmIHlvdSB3YW50IHBvcHBlciB0byBwb3NpdGlvbiBpdCBzZWxmIGluICdmaXhlZCcgbW9kZVxyXG4gICAqIEBwcm9wIHtCb29sZWFufSBwb3NpdGlvbkZpeGVkPWZhbHNlXHJcbiAgICovXHJcbiAgcG9zaXRpb25GaXhlZDogZmFsc2UsXHJcblxyXG4gIC8qKlxyXG4gICAqIFdoZXRoZXIgZXZlbnRzIChyZXNpemUsIHNjcm9sbCkgYXJlIGluaXRpYWxseSBlbmFibGVkXHJcbiAgICogQHByb3Age0Jvb2xlYW59IGV2ZW50c0VuYWJsZWQ9dHJ1ZVxyXG4gICAqL1xyXG4gIGV2ZW50c0VuYWJsZWQ6IHRydWUsXHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0byB0cnVlIGlmIHlvdSB3YW50IHRvIGF1dG9tYXRpY2FsbHkgcmVtb3ZlIHRoZSBwb3BwZXIgd2hlblxyXG4gICAqIHlvdSBjYWxsIHRoZSBgZGVzdHJveWAgbWV0aG9kLlxyXG4gICAqIEBwcm9wIHtCb29sZWFufSByZW1vdmVPbkRlc3Ryb3k9ZmFsc2VcclxuICAgKi9cclxuICByZW1vdmVPbkRlc3Ryb3k6IGZhbHNlLFxyXG5cclxuICAvKipcclxuICAgKiBDYWxsYmFjayBjYWxsZWQgd2hlbiB0aGUgcG9wcGVyIGlzIGNyZWF0ZWQuPGJyIC8+XHJcbiAgICogQnkgZGVmYXVsdCwgaXMgc2V0IHRvIG5vLW9wLjxiciAvPlxyXG4gICAqIEFjY2VzcyBQb3BwZXIuanMgaW5zdGFuY2Ugd2l0aCBgZGF0YS5pbnN0YW5jZWAuXHJcbiAgICogQHByb3Age29uQ3JlYXRlfVxyXG4gICAqL1xyXG4gIG9uQ3JlYXRlOiBmdW5jdGlvbiBvbkNyZWF0ZSgpIHt9LFxyXG5cclxuICAvKipcclxuICAgKiBDYWxsYmFjayBjYWxsZWQgd2hlbiB0aGUgcG9wcGVyIGlzIHVwZGF0ZWQsIHRoaXMgY2FsbGJhY2sgaXMgbm90IGNhbGxlZFxyXG4gICAqIG9uIHRoZSBpbml0aWFsaXphdGlvbi9jcmVhdGlvbiBvZiB0aGUgcG9wcGVyLCBidXQgb25seSBvbiBzdWJzZXF1ZW50XHJcbiAgICogdXBkYXRlcy48YnIgLz5cclxuICAgKiBCeSBkZWZhdWx0LCBpcyBzZXQgdG8gbm8tb3AuPGJyIC8+XHJcbiAgICogQWNjZXNzIFBvcHBlci5qcyBpbnN0YW5jZSB3aXRoIGBkYXRhLmluc3RhbmNlYC5cclxuICAgKiBAcHJvcCB7b25VcGRhdGV9XHJcbiAgICovXHJcbiAgb25VcGRhdGU6IGZ1bmN0aW9uIG9uVXBkYXRlKCkge30sXHJcblxyXG4gIC8qKlxyXG4gICAqIExpc3Qgb2YgbW9kaWZpZXJzIHVzZWQgdG8gbW9kaWZ5IHRoZSBvZmZzZXRzIGJlZm9yZSB0aGV5IGFyZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIuXHJcbiAgICogVGhleSBwcm92aWRlIG1vc3Qgb2YgdGhlIGZ1bmN0aW9uYWxpdGllcyBvZiBQb3BwZXIuanNcclxuICAgKiBAcHJvcCB7bW9kaWZpZXJzfVxyXG4gICAqL1xyXG4gIG1vZGlmaWVyczogbW9kaWZpZXJzXHJcbn07XHJcblxyXG4vKipcclxuICogQGNhbGxiYWNrIG9uQ3JlYXRlXHJcbiAqIEBwYXJhbSB7ZGF0YU9iamVjdH0gZGF0YVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2FsbGJhY2sgb25VcGRhdGVcclxuICogQHBhcmFtIHtkYXRhT2JqZWN0fSBkYXRhXHJcbiAqL1xyXG5cclxuLy8gVXRpbHNcclxuLy8gTWV0aG9kc1xyXG52YXIgUG9wcGVyID0gZnVuY3Rpb24gKCkge1xyXG4gIC8qKlxyXG4gICAqIENyZWF0ZSBhIG5ldyBQb3BwZXIuanMgaW5zdGFuY2VcclxuICAgKiBAY2xhc3MgUG9wcGVyXHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudHxyZWZlcmVuY2VPYmplY3R9IHJlZmVyZW5jZSAtIFRoZSByZWZlcmVuY2UgZWxlbWVudCB1c2VkIHRvIHBvc2l0aW9uIHRoZSBwb3BwZXJcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3BwZXIgLSBUaGUgSFRNTCBlbGVtZW50IHVzZWQgYXMgcG9wcGVyLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gWW91ciBjdXN0b20gb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgb25lcyBkZWZpbmVkIGluIFtEZWZhdWx0c10oI2RlZmF1bHRzKVxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gaW5zdGFuY2UgLSBUaGUgZ2VuZXJhdGVkIFBvcHBlci5qcyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIFBvcHBlcihyZWZlcmVuY2UsIHBvcHBlcikge1xyXG4gICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XHJcbiAgICBjbGFzc0NhbGxDaGVjayQxKHRoaXMsIFBvcHBlcik7XHJcblxyXG4gICAgdGhpcy5zY2hlZHVsZVVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZShfdGhpcy51cGRhdGUpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBtYWtlIHVwZGF0ZSgpIGRlYm91bmNlZCwgc28gdGhhdCBpdCBvbmx5IHJ1bnMgYXQgbW9zdCBvbmNlLXBlci10aWNrXHJcbiAgICB0aGlzLnVwZGF0ZSA9IGRlYm91bmNlKHRoaXMudXBkYXRlLmJpbmQodGhpcykpO1xyXG5cclxuICAgIC8vIHdpdGgge30gd2UgY3JlYXRlIGEgbmV3IG9iamVjdCB3aXRoIHRoZSBvcHRpb25zIGluc2lkZSBpdFxyXG4gICAgdGhpcy5vcHRpb25zID0gX2V4dGVuZHMkMSh7fSwgUG9wcGVyLkRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgICAvLyBpbml0IHN0YXRlXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBpc0Rlc3Ryb3llZDogZmFsc2UsXHJcbiAgICAgIGlzQ3JlYXRlZDogZmFsc2UsXHJcbiAgICAgIHNjcm9sbFBhcmVudHM6IFtdXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGdldCByZWZlcmVuY2UgYW5kIHBvcHBlciBlbGVtZW50cyAoYWxsb3cgalF1ZXJ5IHdyYXBwZXJzKVxyXG4gICAgdGhpcy5yZWZlcmVuY2UgPSByZWZlcmVuY2UgJiYgcmVmZXJlbmNlLmpxdWVyeSA/IHJlZmVyZW5jZVswXSA6IHJlZmVyZW5jZTtcclxuICAgIHRoaXMucG9wcGVyID0gcG9wcGVyICYmIHBvcHBlci5qcXVlcnkgPyBwb3BwZXJbMF0gOiBwb3BwZXI7XHJcblxyXG4gICAgLy8gRGVlcCBtZXJnZSBtb2RpZmllcnMgb3B0aW9uc1xyXG4gICAgdGhpcy5vcHRpb25zLm1vZGlmaWVycyA9IHt9O1xyXG4gICAgT2JqZWN0LmtleXMoX2V4dGVuZHMkMSh7fSwgUG9wcGVyLkRlZmF1bHRzLm1vZGlmaWVycywgb3B0aW9ucy5tb2RpZmllcnMpKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgIF90aGlzLm9wdGlvbnMubW9kaWZpZXJzW25hbWVdID0gX2V4dGVuZHMkMSh7fSwgUG9wcGVyLkRlZmF1bHRzLm1vZGlmaWVyc1tuYW1lXSB8fCB7fSwgb3B0aW9ucy5tb2RpZmllcnMgPyBvcHRpb25zLm1vZGlmaWVyc1tuYW1lXSA6IHt9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFJlZmFjdG9yaW5nIG1vZGlmaWVycycgbGlzdCAoT2JqZWN0ID0+IEFycmF5KVxyXG4gICAgdGhpcy5tb2RpZmllcnMgPSBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMubW9kaWZpZXJzKS5tYXAoZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgcmV0dXJuIF9leHRlbmRzJDEoe1xyXG4gICAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgfSwgX3RoaXMub3B0aW9ucy5tb2RpZmllcnNbbmFtZV0pO1xyXG4gICAgfSlcclxuICAgIC8vIHNvcnQgdGhlIG1vZGlmaWVycyBieSBvcmRlclxyXG4gICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgcmV0dXJuIGEub3JkZXIgLSBiLm9yZGVyO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gbW9kaWZpZXJzIGhhdmUgdGhlIGFiaWxpdHkgdG8gZXhlY3V0ZSBhcmJpdHJhcnkgY29kZSB3aGVuIFBvcHBlci5qcyBnZXQgaW5pdGVkXHJcbiAgICAvLyBzdWNoIGNvZGUgaXMgZXhlY3V0ZWQgaW4gdGhlIHNhbWUgb3JkZXIgb2YgaXRzIG1vZGlmaWVyXHJcbiAgICAvLyB0aGV5IGNvdWxkIGFkZCBuZXcgcHJvcGVydGllcyB0byB0aGVpciBvcHRpb25zIGNvbmZpZ3VyYXRpb25cclxuICAgIC8vIEJFIEFXQVJFOiBkb24ndCBhZGQgb3B0aW9ucyB0byBgb3B0aW9ucy5tb2RpZmllcnMubmFtZWAgYnV0IHRvIGBtb2RpZmllck9wdGlvbnNgIVxyXG4gICAgdGhpcy5tb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAobW9kaWZpZXJPcHRpb25zKSB7XHJcbiAgICAgIGlmIChtb2RpZmllck9wdGlvbnMuZW5hYmxlZCAmJiBpc0Z1bmN0aW9uKG1vZGlmaWVyT3B0aW9ucy5vbkxvYWQpKSB7XHJcbiAgICAgICAgbW9kaWZpZXJPcHRpb25zLm9uTG9hZChfdGhpcy5yZWZlcmVuY2UsIF90aGlzLnBvcHBlciwgX3RoaXMub3B0aW9ucywgbW9kaWZpZXJPcHRpb25zLCBfdGhpcy5zdGF0ZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGZpcmUgdGhlIGZpcnN0IHVwZGF0ZSB0byBwb3NpdGlvbiB0aGUgcG9wcGVyIGluIHRoZSByaWdodCBwbGFjZVxyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICB2YXIgZXZlbnRzRW5hYmxlZCA9IHRoaXMub3B0aW9ucy5ldmVudHNFbmFibGVkO1xyXG4gICAgaWYgKGV2ZW50c0VuYWJsZWQpIHtcclxuICAgICAgLy8gc2V0dXAgZXZlbnQgbGlzdGVuZXJzLCB0aGV5IHdpbGwgdGFrZSBjYXJlIG9mIHVwZGF0ZSB0aGUgcG9zaXRpb24gaW4gc3BlY2lmaWMgc2l0dWF0aW9uc1xyXG4gICAgICB0aGlzLmVuYWJsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5ldmVudHNFbmFibGVkID0gZXZlbnRzRW5hYmxlZDtcclxuICB9XHJcblxyXG4gIC8vIFdlIGNhbid0IHVzZSBjbGFzcyBwcm9wZXJ0aWVzIGJlY2F1c2UgdGhleSBkb24ndCBnZXQgbGlzdGVkIGluIHRoZVxyXG4gIC8vIGNsYXNzIHByb3RvdHlwZSBhbmQgYnJlYWsgc3R1ZmYgbGlrZSBTaW5vbiBzdHVic1xyXG5cclxuXHJcbiAgY3JlYXRlQ2xhc3MkMShQb3BwZXIsIFt7XHJcbiAgICBrZXk6ICd1cGRhdGUnLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZSQkMSgpIHtcclxuICAgICAgcmV0dXJuIHVwZGF0ZS5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG4gIH0sIHtcclxuICAgIGtleTogJ2Rlc3Ryb3knLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3kkJDEoKSB7XHJcbiAgICAgIHJldHVybiBkZXN0cm95LmNhbGwodGhpcyk7XHJcbiAgICB9XHJcbiAgfSwge1xyXG4gICAga2V5OiAnZW5hYmxlRXZlbnRMaXN0ZW5lcnMnLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVuYWJsZUV2ZW50TGlzdGVuZXJzJCQxKCkge1xyXG4gICAgICByZXR1cm4gZW5hYmxlRXZlbnRMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuICB9LCB7XHJcbiAgICBrZXk6ICdkaXNhYmxlRXZlbnRMaXN0ZW5lcnMnLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc2FibGVFdmVudExpc3RlbmVycyQkMSgpIHtcclxuICAgICAgcmV0dXJuIGRpc2FibGVFdmVudExpc3RlbmVycy5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2NoZWR1bGUgYW4gdXBkYXRlLCBpdCB3aWxsIHJ1biBvbiB0aGUgbmV4dCBVSSB1cGRhdGUgYXZhaWxhYmxlXHJcbiAgICAgKiBAbWV0aG9kIHNjaGVkdWxlVXBkYXRlXHJcbiAgICAgKiBAbWVtYmVyb2YgUG9wcGVyXHJcbiAgICAgKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbGxlY3Rpb24gb2YgdXRpbGl0aWVzIHVzZWZ1bCB3aGVuIHdyaXRpbmcgY3VzdG9tIG1vZGlmaWVycy5cclxuICAgICAqIFN0YXJ0aW5nIGZyb20gdmVyc2lvbiAxLjcsIHRoaXMgbWV0aG9kIGlzIGF2YWlsYWJsZSBvbmx5IGlmIHlvdVxyXG4gICAgICogaW5jbHVkZSBgcG9wcGVyLXV0aWxzLmpzYCBiZWZvcmUgYHBvcHBlci5qc2AuXHJcbiAgICAgKlxyXG4gICAgICogKipERVBSRUNBVElPTioqOiBUaGlzIHdheSB0byBhY2Nlc3MgUG9wcGVyVXRpbHMgaXMgZGVwcmVjYXRlZFxyXG4gICAgICogYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB2MiEgVXNlIHRoZSBQb3BwZXJVdGlscyBtb2R1bGUgZGlyZWN0bHkgaW5zdGVhZC5cclxuICAgICAqIER1ZSB0byB0aGUgaGlnaCBpbnN0YWJpbGl0eSBvZiB0aGUgbWV0aG9kcyBjb250YWluZWQgaW4gVXRpbHMsIHdlIGNhbid0XHJcbiAgICAgKiBndWFyYW50ZWUgdGhlbSB0byBmb2xsb3cgc2VtdmVyLiBVc2UgdGhlbSBhdCB5b3VyIG93biByaXNrIVxyXG4gICAgICogQHN0YXRpY1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEB0eXBlIHtPYmplY3R9XHJcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDEuOFxyXG4gICAgICogQG1lbWJlciBVdGlsc1xyXG4gICAgICogQG1lbWJlcm9mIFBvcHBlclxyXG4gICAgICovXHJcblxyXG4gIH1dKTtcclxuICByZXR1cm4gUG9wcGVyO1xyXG59KCk7XHJcblxyXG4vKipcclxuICogVGhlIGByZWZlcmVuY2VPYmplY3RgIGlzIGFuIG9iamVjdCB0aGF0IHByb3ZpZGVzIGFuIGludGVyZmFjZSBjb21wYXRpYmxlIHdpdGggUG9wcGVyLmpzXHJcbiAqIGFuZCBsZXRzIHlvdSB1c2UgaXQgYXMgcmVwbGFjZW1lbnQgb2YgYSByZWFsIERPTSBub2RlLjxiciAvPlxyXG4gKiBZb3UgY2FuIHVzZSB0aGlzIG1ldGhvZCB0byBwb3NpdGlvbiBhIHBvcHBlciByZWxhdGl2ZWx5IHRvIGEgc2V0IG9mIGNvb3JkaW5hdGVzXHJcbiAqIGluIGNhc2UgeW91IGRvbid0IGhhdmUgYSBET00gbm9kZSB0byB1c2UgYXMgcmVmZXJlbmNlLlxyXG4gKlxyXG4gKiBgYGBcclxuICogbmV3IFBvcHBlcihyZWZlcmVuY2VPYmplY3QsIHBvcHBlck5vZGUpO1xyXG4gKiBgYGBcclxuICpcclxuICogTkI6IFRoaXMgZmVhdHVyZSBpc24ndCBzdXBwb3J0ZWQgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTBcclxuICogQG5hbWUgcmVmZXJlbmNlT2JqZWN0XHJcbiAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGRhdGEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0XHJcbiAqIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgc2V0IG9mIGNvb3JkaW5hdGVzIGNvbXBhdGlibGUgd2l0aCB0aGUgbmF0aXZlIGBnZXRCb3VuZGluZ0NsaWVudFJlY3RgIG1ldGhvZC5cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IGRhdGEuY2xpZW50V2lkdGhcclxuICogQW4gRVM2IGdldHRlciB0aGF0IHdpbGwgcmV0dXJuIHRoZSB3aWR0aCBvZiB0aGUgdmlydHVhbCByZWZlcmVuY2UgZWxlbWVudC5cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IGRhdGEuY2xpZW50SGVpZ2h0XHJcbiAqIEFuIEVTNiBnZXR0ZXIgdGhhdCB3aWxsIHJldHVybiB0aGUgaGVpZ2h0IG9mIHRoZSB2aXJ0dWFsIHJlZmVyZW5jZSBlbGVtZW50LlxyXG4gKi9cclxuXHJcblBvcHBlci5VdGlscyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbCkuUG9wcGVyVXRpbHM7XHJcblBvcHBlci5wbGFjZW1lbnRzID0gcGxhY2VtZW50cztcclxuUG9wcGVyLkRlZmF1bHRzID0gRGVmYXVsdHM7XHJcblxyXG4vKipcclxuICogVHJpZ2dlcnMgZG9jdW1lbnQgcmVmbG93LlxyXG4gKiBVc2Ugdm9pZCBiZWNhdXNlIHNvbWUgbWluaWZpZXJzIG9yIGVuZ2luZXMgdGhpbmsgc2ltcGx5IGFjY2Vzc2luZyB0aGUgcHJvcGVydHlcclxuICogaXMgdW5uZWNlc3NhcnkuXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcG9wcGVyXHJcbiAqL1xyXG5mdW5jdGlvbiByZWZsb3cocG9wcGVyKSB7XHJcbiAgdm9pZCBwb3BwZXIub2Zmc2V0SGVpZ2h0O1xyXG59XHJcblxyXG4vKipcclxuICogV3JhcHBlciB1dGlsIGZvciBwb3BwZXIgcG9zaXRpb24gdXBkYXRpbmcuXHJcbiAqIFVwZGF0ZXMgdGhlIHBvcHBlcidzIHBvc2l0aW9uIGFuZCBpbnZva2VzIHRoZSBjYWxsYmFjayBvbiB1cGRhdGUuXHJcbiAqIEhhY2tpc2ggd29ya2Fyb3VuZCB1bnRpbCBQb3BwZXIgMi4wJ3MgdXBkYXRlKCkgYmVjb21lcyBzeW5jLlxyXG4gKiBAcGFyYW0ge1BvcHBlcn0gcG9wcGVySW5zdGFuY2VcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2s6IHRvIHJ1biBvbmNlIHBvcHBlcidzIHBvc2l0aW9uIHdhcyB1cGRhdGVkXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdXBkYXRlQWxyZWFkeUNhbGxlZDogd2FzIHNjaGVkdWxlVXBkYXRlKCkgYWxyZWFkeSBjYWxsZWQ/XHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVQb3BwZXJQb3NpdGlvbihwb3BwZXJJbnN0YW5jZSwgY2FsbGJhY2ssIHVwZGF0ZUFscmVhZHlDYWxsZWQpIHtcclxuICB2YXIgcG9wcGVyID0gcG9wcGVySW5zdGFuY2UucG9wcGVyLFxyXG4gICAgICBvcHRpb25zID0gcG9wcGVySW5zdGFuY2Uub3B0aW9ucztcclxuXHJcbiAgdmFyIG9uQ3JlYXRlID0gb3B0aW9ucy5vbkNyZWF0ZTtcclxuICB2YXIgb25VcGRhdGUgPSBvcHRpb25zLm9uVXBkYXRlO1xyXG5cclxuICBvcHRpb25zLm9uQ3JlYXRlID0gb3B0aW9ucy5vblVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJlZmxvdyhwb3BwZXIpLCBjYWxsYmFjayAmJiBjYWxsYmFjaygpLCBvblVwZGF0ZSgpO1xyXG4gICAgb3B0aW9ucy5vbkNyZWF0ZSA9IG9uQ3JlYXRlO1xyXG4gICAgb3B0aW9ucy5vblVwZGF0ZSA9IG9uVXBkYXRlO1xyXG4gIH07XHJcblxyXG4gIGlmICghdXBkYXRlQWxyZWFkeUNhbGxlZCkge1xyXG4gICAgcG9wcGVySW5zdGFuY2Uuc2NoZWR1bGVVcGRhdGUoKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBjb3JlIHBsYWNlbWVudCAoJ3RvcCcsICdib3R0b20nLCAnbGVmdCcsICdyaWdodCcpIG9mIGEgcG9wcGVyXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcG9wcGVyXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIGdldFBvcHBlclBsYWNlbWVudChwb3BwZXIpIHtcclxuICByZXR1cm4gcG9wcGVyLmdldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnKS5yZXBsYWNlKC8tLisvLCAnJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSBtb3VzZSdzIGN1cnNvciBpcyBvdXRzaWRlIHRoZSBpbnRlcmFjdGl2ZSBib3JkZXJcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlclxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gY3Vyc29ySXNPdXRzaWRlSW50ZXJhY3RpdmVCb3JkZXIoZXZlbnQsIHBvcHBlciwgb3B0aW9ucykge1xyXG4gIGlmICghcG9wcGVyLmdldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnKSkgcmV0dXJuIHRydWU7XHJcblxyXG4gIHZhciB4ID0gZXZlbnQuY2xpZW50WCxcclxuICAgICAgeSA9IGV2ZW50LmNsaWVudFk7XHJcbiAgdmFyIGludGVyYWN0aXZlQm9yZGVyID0gb3B0aW9ucy5pbnRlcmFjdGl2ZUJvcmRlcixcclxuICAgICAgZGlzdGFuY2UgPSBvcHRpb25zLmRpc3RhbmNlO1xyXG5cclxuXHJcbiAgdmFyIHJlY3QgPSBwb3BwZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgdmFyIHBsYWNlbWVudCA9IGdldFBvcHBlclBsYWNlbWVudChwb3BwZXIpO1xyXG4gIHZhciBib3JkZXJXaXRoRGlzdGFuY2UgPSBpbnRlcmFjdGl2ZUJvcmRlciArIGRpc3RhbmNlO1xyXG5cclxuICB2YXIgZXhjZWVkcyA9IHtcclxuICAgIHRvcDogcmVjdC50b3AgLSB5ID4gaW50ZXJhY3RpdmVCb3JkZXIsXHJcbiAgICBib3R0b206IHkgLSByZWN0LmJvdHRvbSA+IGludGVyYWN0aXZlQm9yZGVyLFxyXG4gICAgbGVmdDogcmVjdC5sZWZ0IC0geCA+IGludGVyYWN0aXZlQm9yZGVyLFxyXG4gICAgcmlnaHQ6IHggLSByZWN0LnJpZ2h0ID4gaW50ZXJhY3RpdmVCb3JkZXJcclxuICB9O1xyXG5cclxuICBzd2l0Y2ggKHBsYWNlbWVudCkge1xyXG4gICAgY2FzZSAndG9wJzpcclxuICAgICAgZXhjZWVkcy50b3AgPSByZWN0LnRvcCAtIHkgPiBib3JkZXJXaXRoRGlzdGFuY2U7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnYm90dG9tJzpcclxuICAgICAgZXhjZWVkcy5ib3R0b20gPSB5IC0gcmVjdC5ib3R0b20gPiBib3JkZXJXaXRoRGlzdGFuY2U7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnbGVmdCc6XHJcbiAgICAgIGV4Y2VlZHMubGVmdCA9IHJlY3QubGVmdCAtIHggPiBib3JkZXJXaXRoRGlzdGFuY2U7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAncmlnaHQnOlxyXG4gICAgICBleGNlZWRzLnJpZ2h0ID0geCAtIHJlY3QucmlnaHQgPiBib3JkZXJXaXRoRGlzdGFuY2U7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGV4Y2VlZHMudG9wIHx8IGV4Y2VlZHMuYm90dG9tIHx8IGV4Y2VlZHMubGVmdCB8fCBleGNlZWRzLnJpZ2h0O1xyXG59XHJcblxyXG4vKipcclxuICogVHJhbnNmb3JtcyB0aGUgYGFycm93VHJhbnNmb3JtYCBudW1iZXJzIGJhc2VkIG9uIHRoZSBwbGFjZW1lbnQgYXhpc1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAnc2NhbGUnIG9yICd0cmFuc2xhdGUnXHJcbiAqIEBwYXJhbSB7TnVtYmVyW119IG51bWJlcnNcclxuICogQHBhcmFtIHtCb29sZWFufSBpc1ZlcnRpY2FsXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNSZXZlcnNlXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIHRyYW5zZm9ybU51bWJlcnNCYXNlZE9uUGxhY2VtZW50QXhpcyh0eXBlLCBudW1iZXJzLCBpc1ZlcnRpY2FsLCBpc1JldmVyc2UpIHtcclxuICBpZiAoIW51bWJlcnMubGVuZ3RoKSByZXR1cm4gJyc7XHJcblxyXG4gIHZhciB0cmFuc2Zvcm1zID0ge1xyXG4gICAgc2NhbGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKG51bWJlcnMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuICcnICsgbnVtYmVyc1swXTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gaXNWZXJ0aWNhbCA/IG51bWJlcnNbMF0gKyAnLCAnICsgbnVtYmVyc1sxXSA6IG51bWJlcnNbMV0gKyAnLCAnICsgbnVtYmVyc1swXTtcclxuICAgICAgfVxyXG4gICAgfSgpLFxyXG4gICAgdHJhbnNsYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChudW1iZXJzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiBpc1JldmVyc2UgPyAtbnVtYmVyc1swXSArICdweCcgOiBudW1iZXJzWzBdICsgJ3B4JztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoaXNWZXJ0aWNhbCkge1xyXG4gICAgICAgICAgcmV0dXJuIGlzUmV2ZXJzZSA/IG51bWJlcnNbMF0gKyAncHgsICcgKyAtbnVtYmVyc1sxXSArICdweCcgOiBudW1iZXJzWzBdICsgJ3B4LCAnICsgbnVtYmVyc1sxXSArICdweCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBpc1JldmVyc2UgPyAtbnVtYmVyc1sxXSArICdweCwgJyArIG51bWJlcnNbMF0gKyAncHgnIDogbnVtYmVyc1sxXSArICdweCwgJyArIG51bWJlcnNbMF0gKyAncHgnO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSgpXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHRyYW5zZm9ybXNbdHlwZV07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUcmFuc2Zvcm1zIHRoZSBgYXJyb3dUcmFuc2Zvcm1gIHggb3IgeSBheGlzIGJhc2VkIG9uIHRoZSBwbGFjZW1lbnQgYXhpc1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gYXhpcyAnWCcsICdZJywgJydcclxuICogQHBhcmFtIHtCb29sZWFufSBpc1ZlcnRpY2FsXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIHRyYW5zZm9ybUF4aXMoYXhpcywgaXNWZXJ0aWNhbCkge1xyXG4gIGlmICghYXhpcykgcmV0dXJuICcnO1xyXG4gIHZhciBtYXAgPSB7XHJcbiAgICBYOiAnWScsXHJcbiAgICBZOiAnWCdcclxuICB9O1xyXG4gIHJldHVybiBpc1ZlcnRpY2FsID8gYXhpcyA6IG1hcFtheGlzXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbXB1dGVzIGFuZCBhcHBsaWVzIHRoZSBuZWNlc3NhcnkgYXJyb3cgdHJhbnNmb3JtXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcG9wcGVyXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gYXJyb3dcclxuICogQHBhcmFtIHtTdHJpbmd9IGFycm93VHJhbnNmb3JtXHJcbiAqL1xyXG5mdW5jdGlvbiBjb21wdXRlQXJyb3dUcmFuc2Zvcm0ocG9wcGVyLCBhcnJvdywgYXJyb3dUcmFuc2Zvcm0pIHtcclxuICB2YXIgcGxhY2VtZW50ID0gZ2V0UG9wcGVyUGxhY2VtZW50KHBvcHBlcik7XHJcbiAgdmFyIGlzVmVydGljYWwgPSBwbGFjZW1lbnQgPT09ICd0b3AnIHx8IHBsYWNlbWVudCA9PT0gJ2JvdHRvbSc7XHJcbiAgdmFyIGlzUmV2ZXJzZSA9IHBsYWNlbWVudCA9PT0gJ3JpZ2h0JyB8fCBwbGFjZW1lbnQgPT09ICdib3R0b20nO1xyXG5cclxuICB2YXIgZ2V0QXhpcyA9IGZ1bmN0aW9uIGdldEF4aXMocmUpIHtcclxuICAgIHZhciBtYXRjaCA9IGFycm93VHJhbnNmb3JtLm1hdGNoKHJlKTtcclxuICAgIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdIDogJyc7XHJcbiAgfTtcclxuXHJcbiAgdmFyIGdldE51bWJlcnMgPSBmdW5jdGlvbiBnZXROdW1iZXJzKHJlKSB7XHJcbiAgICB2YXIgbWF0Y2ggPSBhcnJvd1RyYW5zZm9ybS5tYXRjaChyZSk7XHJcbiAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXS5zcGxpdCgnLCcpLm1hcChwYXJzZUZsb2F0KSA6IFtdO1xyXG4gIH07XHJcblxyXG4gIHZhciByZSA9IHtcclxuICAgIHRyYW5zbGF0ZTogL3RyYW5zbGF0ZVg/WT9cXCgoW14pXSspXFwpLyxcclxuICAgIHNjYWxlOiAvc2NhbGVYP1k/XFwoKFteKV0rKVxcKS9cclxuICB9O1xyXG5cclxuICB2YXIgbWF0Y2hlcyA9IHtcclxuICAgIHRyYW5zbGF0ZToge1xyXG4gICAgICBheGlzOiBnZXRBeGlzKC90cmFuc2xhdGUoW1hZXSkvKSxcclxuICAgICAgbnVtYmVyczogZ2V0TnVtYmVycyhyZS50cmFuc2xhdGUpXHJcbiAgICB9LFxyXG4gICAgc2NhbGU6IHtcclxuICAgICAgYXhpczogZ2V0QXhpcygvc2NhbGUoW1hZXSkvKSxcclxuICAgICAgbnVtYmVyczogZ2V0TnVtYmVycyhyZS5zY2FsZSlcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgY29tcHV0ZWRUcmFuc2Zvcm0gPSBhcnJvd1RyYW5zZm9ybS5yZXBsYWNlKHJlLnRyYW5zbGF0ZSwgJ3RyYW5zbGF0ZScgKyB0cmFuc2Zvcm1BeGlzKG1hdGNoZXMudHJhbnNsYXRlLmF4aXMsIGlzVmVydGljYWwpICsgJygnICsgdHJhbnNmb3JtTnVtYmVyc0Jhc2VkT25QbGFjZW1lbnRBeGlzKCd0cmFuc2xhdGUnLCBtYXRjaGVzLnRyYW5zbGF0ZS5udW1iZXJzLCBpc1ZlcnRpY2FsLCBpc1JldmVyc2UpICsgJyknKS5yZXBsYWNlKHJlLnNjYWxlLCAnc2NhbGUnICsgdHJhbnNmb3JtQXhpcyhtYXRjaGVzLnNjYWxlLmF4aXMsIGlzVmVydGljYWwpICsgJygnICsgdHJhbnNmb3JtTnVtYmVyc0Jhc2VkT25QbGFjZW1lbnRBeGlzKCdzY2FsZScsIG1hdGNoZXMuc2NhbGUubnVtYmVycywgaXNWZXJ0aWNhbCwgaXNSZXZlcnNlKSArICcpJyk7XHJcblxyXG4gIGFycm93LnN0eWxlW3ByZWZpeCgndHJhbnNmb3JtJyldID0gY29tcHV0ZWRUcmFuc2Zvcm07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBkaXN0YW5jZSB0YWtpbmcgaW50byBhY2NvdW50IHRoZSBkZWZhdWx0IGRpc3RhbmNlIGR1ZSB0b1xyXG4gKiB0aGUgdHJhbnNmb3JtOiB0cmFuc2xhdGUgc2V0dGluZyBpbiBDU1NcclxuICogQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIGdldE9mZnNldERpc3RhbmNlSW5QeChkaXN0YW5jZSkge1xyXG4gIHJldHVybiAtKGRpc3RhbmNlIC0gZGVmYXVsdHMuZGlzdGFuY2UpICsgJ3B4JztcclxufVxyXG5cclxuLyoqXHJcbiAqIFdhaXRzIHVudGlsIG5leHQgcmVwYWludCB0byBleGVjdXRlIGEgZm5cclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICovXHJcbmZ1bmN0aW9uIGRlZmVyKGZuKSB7XHJcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcclxuICAgIHNldFRpbWVvdXQoZm4sIDEpO1xyXG4gIH0pO1xyXG59XHJcblxyXG52YXIgbWF0Y2hlcyA9IHt9O1xyXG5cclxuaWYgKGlzQnJvd3Nlcikge1xyXG4gIHZhciBlID0gRWxlbWVudC5wcm90b3R5cGU7XHJcbiAgbWF0Y2hlcyA9IGUubWF0Y2hlcyB8fCBlLm1hdGNoZXNTZWxlY3RvciB8fCBlLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBlLm1vek1hdGNoZXNTZWxlY3RvciB8fCBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IGZ1bmN0aW9uIChzKSB7XHJcbiAgICB2YXIgbWF0Y2hlcyA9ICh0aGlzLmRvY3VtZW50IHx8IHRoaXMub3duZXJEb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzKTtcclxuICAgIHZhciBpID0gbWF0Y2hlcy5sZW5ndGg7XHJcbiAgICB3aGlsZSAoLS1pID49IDAgJiYgbWF0Y2hlcy5pdGVtKGkpICE9PSB0aGlzKSB7fSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWVtcHR5XHJcbiAgICByZXR1cm4gaSA+IC0xO1xyXG4gIH07XHJcbn1cclxuXHJcbnZhciBtYXRjaGVzJDEgPSBtYXRjaGVzO1xyXG5cclxuLyoqXHJcbiAqIFBvbnlmaWxsIHRvIGdldCB0aGUgY2xvc2VzdCBwYXJlbnQgZWxlbWVudFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSBjaGlsZCBvZiBwYXJlbnQgdG8gYmUgcmV0dXJuZWRcclxuICogQHBhcmFtIHtTdHJpbmd9IHBhcmVudFNlbGVjdG9yIC0gc2VsZWN0b3IgdG8gbWF0Y2ggdGhlIHBhcmVudCBpZiBmb3VuZFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuZnVuY3Rpb24gY2xvc2VzdChlbGVtZW50LCBwYXJlbnRTZWxlY3Rvcikge1xyXG4gIHZhciBmbiA9IEVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3QgfHwgZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgZWwgPSB0aGlzO1xyXG4gICAgd2hpbGUgKGVsKSB7XHJcbiAgICAgIGlmIChtYXRjaGVzJDEuY2FsbChlbCwgc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsO1xyXG4gICAgICB9XHJcbiAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gZm4uY2FsbChlbGVtZW50LCBwYXJlbnRTZWxlY3Rvcik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSB2YWx1ZSB0YWtpbmcgaW50byBhY2NvdW50IHRoZSB2YWx1ZSBiZWluZyBlaXRoZXIgYSBudW1iZXIgb3IgYXJyYXlcclxuICogQHBhcmFtIHtOdW1iZXJ8QXJyYXl9IHZhbHVlXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRWYWx1ZSh2YWx1ZSwgaW5kZXgpIHtcclxuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZVtpbmRleF0gOiB2YWx1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldHMgdGhlIHZpc2liaWxpdHkgc3RhdGUgb2YgYW4gZWxlbWVudCBmb3IgdHJhbnNpdGlvbiB0byBiZWdpblxyXG4gKiBAcGFyYW0ge0VsZW1lbnRbXX0gZWxzIC0gYXJyYXkgb2YgZWxlbWVudHNcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSAndmlzaWJsZScgb3IgJ2hpZGRlbidcclxuICovXHJcbmZ1bmN0aW9uIHNldFZpc2liaWxpdHlTdGF0ZShlbHMsIHR5cGUpIHtcclxuICBlbHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgIGlmICghZWwpIHJldHVybjtcclxuICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0ZScsIHR5cGUpO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0cyB0aGUgdHJhbnNpdGlvbiBwcm9wZXJ0eSB0byBlYWNoIGVsZW1lbnRcclxuICogQHBhcmFtIHtFbGVtZW50W119IGVscyAtIEFycmF5IG9mIGVsZW1lbnRzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxyXG4gKi9cclxuZnVuY3Rpb24gYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24oZWxzLCB2YWx1ZSkge1xyXG4gIGVscy5maWx0ZXIoQm9vbGVhbikuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcclxuICAgIGVsLnN0eWxlW3ByZWZpeCgndHJhbnNpdGlvbkR1cmF0aW9uJyldID0gdmFsdWUgKyAnbXMnO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogRm9jdXNlcyBhbiBlbGVtZW50IHdoaWxlIHByZXZlbnRpbmcgYSBzY3JvbGwganVtcCBpZiBpdCdzIG5vdCBlbnRpcmVseSB3aXRoaW4gdGhlIHZpZXdwb3J0XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcclxuICovXHJcbmZ1bmN0aW9uIGZvY3VzKGVsKSB7XHJcbiAgdmFyIHggPSB3aW5kb3cuc2Nyb2xsWCB8fCB3aW5kb3cucGFnZVhPZmZzZXQ7XHJcbiAgdmFyIHkgPSB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcbiAgZWwuZm9jdXMoKTtcclxuICBzY3JvbGwoeCwgeSk7XHJcbn1cclxuXHJcbnZhciBrZXkgPSB7fTtcclxudmFyIHN0b3JlID0gZnVuY3Rpb24gc3RvcmUoZGF0YSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaykge1xyXG4gICAgcmV0dXJuIGsgPT09IGtleSAmJiBkYXRhO1xyXG4gIH07XHJcbn07XHJcblxyXG52YXIgVGlwcHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgZnVuY3Rpb24gVGlwcHkoY29uZmlnKSB7XHJcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBUaXBweSk7XHJcblxyXG4gICAgZm9yICh2YXIgX2tleSBpbiBjb25maWcpIHtcclxuICAgICAgdGhpc1tfa2V5XSA9IGNvbmZpZ1tfa2V5XTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBkZXN0cm95ZWQ6IGZhbHNlLFxyXG4gICAgICB2aXNpYmxlOiBmYWxzZSxcclxuICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLl8gPSBzdG9yZSh7XHJcbiAgICAgIG11dGF0aW9uT2JzZXJ2ZXJzOiBbXVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbmFibGVzIHRoZSB0b29sdGlwIHRvIGFsbG93IGl0IHRvIHNob3cgb3IgaGlkZVxyXG4gICAqIEBtZW1iZXJvZiBUaXBweVxyXG4gICAqIEBwdWJsaWNcclxuICAgKi9cclxuXHJcblxyXG4gIGNyZWF0ZUNsYXNzKFRpcHB5LCBbe1xyXG4gICAga2V5OiAnZW5hYmxlJyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmFibGUoKSB7XHJcbiAgICAgIHRoaXMuc3RhdGUuZW5hYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNhYmxlcyB0aGUgdG9vbHRpcCBmcm9tIHNob3dpbmcgb3IgaGlkaW5nLCBidXQgZG9lcyBub3QgZGVzdHJveSBpdFxyXG4gICAgICogQG1lbWJlcm9mIFRpcHB5XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKi9cclxuXHJcbiAgfSwge1xyXG4gICAga2V5OiAnZGlzYWJsZScsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzYWJsZSgpIHtcclxuICAgICAgdGhpcy5zdGF0ZS5lbmFibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG93cyB0aGUgdG9vbHRpcFxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kc1xyXG4gICAgICogQG1lbWJlcm9mIFRpcHB5XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKi9cclxuXHJcbiAgfSwge1xyXG4gICAga2V5OiAnc2hvdycsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2hvdyhkdXJhdGlvbikge1xyXG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKHRoaXMuc3RhdGUuZGVzdHJveWVkIHx8ICF0aGlzLnN0YXRlLmVuYWJsZWQpIHJldHVybjtcclxuXHJcbiAgICAgIHZhciBwb3BwZXIgPSB0aGlzLnBvcHBlcixcclxuICAgICAgICAgIHJlZmVyZW5jZSA9IHRoaXMucmVmZXJlbmNlLFxyXG4gICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHJcbiAgICAgIHZhciBfZ2V0SW5uZXJFbGVtZW50cyA9IGdldElubmVyRWxlbWVudHMocG9wcGVyKSxcclxuICAgICAgICAgIHRvb2x0aXAgPSBfZ2V0SW5uZXJFbGVtZW50cy50b29sdGlwLFxyXG4gICAgICAgICAgYmFja2Ryb3AgPSBfZ2V0SW5uZXJFbGVtZW50cy5iYWNrZHJvcCxcclxuICAgICAgICAgIGNvbnRlbnQgPSBfZ2V0SW5uZXJFbGVtZW50cy5jb250ZW50O1xyXG5cclxuICAgICAgLy8gSWYgdGhlIGBkeW5hbWljVGl0bGVgIG9wdGlvbiBpcyB0cnVlLCB0aGUgaW5zdGFuY2UgaXMgYWxsb3dlZFxyXG4gICAgICAvLyB0byBiZSBjcmVhdGVkIHdpdGggYW4gZW1wdHkgdGl0bGUuIE1ha2Ugc3VyZSB0aGF0IHRoZSB0b29sdGlwXHJcbiAgICAgIC8vIGNvbnRlbnQgaXMgbm90IGVtcHR5IGJlZm9yZSBzaG93aW5nIGl0XHJcblxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuZHluYW1pY1RpdGxlICYmICFyZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCdkYXRhLW9yaWdpbmFsLXRpdGxlJykpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIERvIG5vdCBzaG93IHRvb2x0aXAgaWYgcmVmZXJlbmNlIGNvbnRhaW5zICdkaXNhYmxlZCcgYXR0cmlidXRlLiBGRiBmaXggZm9yICMyMjFcclxuICAgICAgaWYgKHJlZmVyZW5jZS5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpIHJldHVybjtcclxuXHJcbiAgICAgIC8vIERlc3Ryb3kgdG9vbHRpcCBpZiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgaXMgbm8gbG9uZ2VyIG9uIHRoZSBET01cclxuICAgICAgaWYgKCFyZWZlcmVuY2UucmVmT2JqICYmICFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY29udGFpbnMocmVmZXJlbmNlKSkge1xyXG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgb3B0aW9ucy5vblNob3cuY2FsbChwb3BwZXIsIHRoaXMpO1xyXG5cclxuICAgICAgZHVyYXRpb24gPSBnZXRWYWx1ZShkdXJhdGlvbiAhPT0gdW5kZWZpbmVkID8gZHVyYXRpb24gOiBvcHRpb25zLmR1cmF0aW9uLCAwKTtcclxuXHJcbiAgICAgIC8vIFByZXZlbnQgYSB0cmFuc2l0aW9uIHdoZW4gcG9wcGVyIGNoYW5nZXMgcG9zaXRpb25cclxuICAgICAgYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24oW3BvcHBlciwgdG9vbHRpcCwgYmFja2Ryb3BdLCAwKTtcclxuXHJcbiAgICAgIHBvcHBlci5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xyXG4gICAgICB0aGlzLnN0YXRlLnZpc2libGUgPSB0cnVlO1xyXG5cclxuICAgICAgX21vdW50LmNhbGwodGhpcywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghX3RoaXMuc3RhdGUudmlzaWJsZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoIV9oYXNGb2xsb3dDdXJzb3JCZWhhdmlvci5jYWxsKF90aGlzKSkge1xyXG4gICAgICAgICAgLy8gRklYOiBBcnJvdyB3aWxsIHNvbWV0aW1lcyBub3QgYmUgcG9zaXRpb25lZCBjb3JyZWN0bHkuIEZvcmNlIGFub3RoZXIgdXBkYXRlLlxyXG4gICAgICAgICAgX3RoaXMucG9wcGVySW5zdGFuY2Uuc2NoZWR1bGVVcGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNldCBpbml0aWFsIHBvc2l0aW9uIG5lYXIgdGhlIGN1cnNvclxyXG4gICAgICAgIGlmIChfaGFzRm9sbG93Q3Vyc29yQmVoYXZpb3IuY2FsbChfdGhpcykpIHtcclxuICAgICAgICAgIF90aGlzLnBvcHBlckluc3RhbmNlLmRpc2FibGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgICAgICAgdmFyIGRlbGF5ID0gZ2V0VmFsdWUob3B0aW9ucy5kZWxheSwgMCk7XHJcbiAgICAgICAgICB2YXIgbGFzdFRyaWdnZXJFdmVudCA9IF90aGlzLl8oa2V5KS5sYXN0VHJpZ2dlckV2ZW50O1xyXG4gICAgICAgICAgaWYgKGxhc3RUcmlnZ2VyRXZlbnQpIHtcclxuICAgICAgICAgICAgX3RoaXMuXyhrZXkpLmZvbGxvd0N1cnNvckxpc3RlbmVyKGRlbGF5ICYmIF90aGlzLl8oa2V5KS5sYXN0TW91c2VNb3ZlRXZlbnQgPyBfdGhpcy5fKGtleSkubGFzdE1vdXNlTW92ZUV2ZW50IDogbGFzdFRyaWdnZXJFdmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZS1hcHBseSB0cmFuc2l0aW9uIGR1cmF0aW9uc1xyXG4gICAgICAgIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uKFt0b29sdGlwLCBiYWNrZHJvcCwgYmFja2Ryb3AgPyBjb250ZW50IDogbnVsbF0sIGR1cmF0aW9uKTtcclxuXHJcbiAgICAgICAgaWYgKGJhY2tkcm9wKSB7XHJcbiAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGJhY2tkcm9wKVtwcmVmaXgoJ3RyYW5zZm9ybScpXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICAgICAgICByZWZlcmVuY2UuY2xhc3NMaXN0LmFkZCgndGlwcHktYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5zdGlja3kpIHtcclxuICAgICAgICAgIF9tYWtlU3RpY2t5LmNhbGwoX3RoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0VmlzaWJpbGl0eVN0YXRlKFt0b29sdGlwLCBiYWNrZHJvcF0sICd2aXNpYmxlJyk7XHJcblxyXG4gICAgICAgIF9vblRyYW5zaXRpb25FbmQuY2FsbChfdGhpcywgZHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmICghb3B0aW9ucy51cGRhdGVEdXJhdGlvbikge1xyXG4gICAgICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQoJ3RpcHB5LW5vdHJhbnNpdGlvbicpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChvcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGZvY3VzKHBvcHBlcik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmVmZXJlbmNlLnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsICd0aXBweS0nICsgX3RoaXMuaWQpO1xyXG5cclxuICAgICAgICAgIG9wdGlvbnMub25TaG93bi5jYWxsKHBvcHBlciwgX3RoaXMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhpZGVzIHRoZSB0b29sdGlwXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzXHJcbiAgICAgKiBAbWVtYmVyb2YgVGlwcHlcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqL1xyXG5cclxuICB9LCB7XHJcbiAgICBrZXk6ICdoaWRlJyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBoaWRlKGR1cmF0aW9uKSB7XHJcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xyXG5cclxuICAgICAgaWYgKHRoaXMuc3RhdGUuZGVzdHJveWVkIHx8ICF0aGlzLnN0YXRlLmVuYWJsZWQpIHJldHVybjtcclxuXHJcbiAgICAgIHZhciBwb3BwZXIgPSB0aGlzLnBvcHBlcixcclxuICAgICAgICAgIHJlZmVyZW5jZSA9IHRoaXMucmVmZXJlbmNlLFxyXG4gICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHJcbiAgICAgIHZhciBfZ2V0SW5uZXJFbGVtZW50czIgPSBnZXRJbm5lckVsZW1lbnRzKHBvcHBlciksXHJcbiAgICAgICAgICB0b29sdGlwID0gX2dldElubmVyRWxlbWVudHMyLnRvb2x0aXAsXHJcbiAgICAgICAgICBiYWNrZHJvcCA9IF9nZXRJbm5lckVsZW1lbnRzMi5iYWNrZHJvcCxcclxuICAgICAgICAgIGNvbnRlbnQgPSBfZ2V0SW5uZXJFbGVtZW50czIuY29udGVudDtcclxuXHJcbiAgICAgIG9wdGlvbnMub25IaWRlLmNhbGwocG9wcGVyLCB0aGlzKTtcclxuXHJcbiAgICAgIGR1cmF0aW9uID0gZ2V0VmFsdWUoZHVyYXRpb24gIT09IHVuZGVmaW5lZCA/IGR1cmF0aW9uIDogb3B0aW9ucy5kdXJhdGlvbiwgMSk7XHJcblxyXG4gICAgICBpZiAoIW9wdGlvbnMudXBkYXRlRHVyYXRpb24pIHtcclxuICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoJ3RpcHB5LW5vdHJhbnNpdGlvbicpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xyXG4gICAgICAgIHJlZmVyZW5jZS5jbGFzc0xpc3QucmVtb3ZlKCd0aXBweS1hY3RpdmUnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcG9wcGVyLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICAgICAgdGhpcy5zdGF0ZS52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gICAgICBhcHBseVRyYW5zaXRpb25EdXJhdGlvbihbdG9vbHRpcCwgYmFja2Ryb3AsIGJhY2tkcm9wID8gY29udGVudCA6IG51bGxdLCBkdXJhdGlvbik7XHJcblxyXG4gICAgICBzZXRWaXNpYmlsaXR5U3RhdGUoW3Rvb2x0aXAsIGJhY2tkcm9wXSwgJ2hpZGRlbicpO1xyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuaW50ZXJhY3RpdmUgJiYgb3B0aW9ucy50cmlnZ2VyLmluZGV4T2YoJ2NsaWNrJykgPiAtMSkge1xyXG4gICAgICAgIGZvY3VzKHJlZmVyZW5jZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qXHJcbiAgICAgICogVGhpcyBjYWxsIGlzIGRlZmVycmVkIGJlY2F1c2Ugc29tZXRpbWVzIHdoZW4gdGhlIHRvb2x0aXAgaXMgc3RpbGwgdHJhbnNpdGlvbmluZyBpbiBidXQgaGlkZSgpXHJcbiAgICAgICogaXMgY2FsbGVkIGJlZm9yZSBpdCBmaW5pc2hlcywgdGhlIENTUyB0cmFuc2l0aW9uIHdvbid0IHJldmVyc2UgcXVpY2tseSBlbm91Z2gsIG1lYW5pbmdcclxuICAgICAgKiB0aGUgQ1NTIHRyYW5zaXRpb24gd2lsbCBmaW5pc2ggMS0yIGZyYW1lcyBsYXRlciwgYW5kIG9uSGlkZGVuKCkgd2lsbCBydW4gc2luY2UgdGhlIEpTIHNldCBpdFxyXG4gICAgICAqIG1vcmUgcXVpY2tseS4gSXQgc2hvdWxkIGFjdHVhbGx5IGJlIG9uU2hvd24oKS4gU2VlbXMgdG8gYmUgc29tZXRoaW5nIENocm9tZSBkb2VzLCBub3QgU2FmYXJpXHJcbiAgICAgICovXHJcbiAgICAgIGRlZmVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBfb25UcmFuc2l0aW9uRW5kLmNhbGwoX3RoaXMyLCBkdXJhdGlvbiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgaWYgKF90aGlzMi5zdGF0ZS52aXNpYmxlIHx8ICFvcHRpb25zLmFwcGVuZFRvLmNvbnRhaW5zKHBvcHBlcikpIHJldHVybjtcclxuXHJcbiAgICAgICAgICBpZiAoIV90aGlzMi5fKGtleSkuaXNQcmVwYXJpbmdUb1Nob3cpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX3RoaXMyLl8oa2V5KS5mb2xsb3dDdXJzb3JMaXN0ZW5lcik7XHJcbiAgICAgICAgICAgIF90aGlzMi5fKGtleSkubGFzdE1vdXNlTW92ZUV2ZW50ID0gbnVsbDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoX3RoaXMyLnBvcHBlckluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIF90aGlzMi5wb3BwZXJJbnN0YW5jZS5kaXNhYmxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZWZlcmVuY2UucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcblxyXG4gICAgICAgICAgb3B0aW9ucy5hcHBlbmRUby5yZW1vdmVDaGlsZChwb3BwZXIpO1xyXG5cclxuICAgICAgICAgIG9wdGlvbnMub25IaWRkZW4uY2FsbChwb3BwZXIsIF90aGlzMik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVzdHJveXMgdGhlIHRvb2x0aXAgaW5zdGFuY2VcclxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVzdHJveVRhcmdldEluc3RhbmNlcyAtIHJlbGV2YW50IG9ubHkgd2hlbiBkZXN0cm95aW5nIGRlbGVnYXRlc1xyXG4gICAgICogQG1lbWJlcm9mIFRpcHB5XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKi9cclxuXHJcbiAgfSwge1xyXG4gICAga2V5OiAnZGVzdHJveScsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XHJcblxyXG4gICAgICB2YXIgZGVzdHJveVRhcmdldEluc3RhbmNlcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogdHJ1ZTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnN0YXRlLmRlc3Ryb3llZCkgcmV0dXJuO1xyXG5cclxuICAgICAgLy8gRW5zdXJlIHRoZSBwb3BwZXIgaXMgaGlkZGVuXHJcbiAgICAgIGlmICh0aGlzLnN0YXRlLnZpc2libGUpIHtcclxuICAgICAgICB0aGlzLmhpZGUoMCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XHJcbiAgICAgICAgX3RoaXMzLnJlZmVyZW5jZS5yZW1vdmVFdmVudExpc3RlbmVyKGxpc3RlbmVyLmV2ZW50LCBsaXN0ZW5lci5oYW5kbGVyKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBSZXN0b3JlIHRpdGxlXHJcbiAgICAgIGlmICh0aGlzLnRpdGxlKSB7XHJcbiAgICAgICAgdGhpcy5yZWZlcmVuY2Uuc2V0QXR0cmlidXRlKCd0aXRsZScsIHRoaXMudGl0bGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkZWxldGUgdGhpcy5yZWZlcmVuY2UuX3RpcHB5O1xyXG5cclxuICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBbJ2RhdGEtb3JpZ2luYWwtdGl0bGUnLCAnZGF0YS10aXBweScsICdkYXRhLXRpcHB5LWRlbGVnYXRlJ107XHJcbiAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYXR0cikge1xyXG4gICAgICAgIF90aGlzMy5yZWZlcmVuY2UucmVtb3ZlQXR0cmlidXRlKGF0dHIpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGFyZ2V0ICYmIGRlc3Ryb3lUYXJnZXRJbnN0YW5jZXMpIHtcclxuICAgICAgICB0b0FycmF5KHRoaXMucmVmZXJlbmNlLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5vcHRpb25zLnRhcmdldCkpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XHJcbiAgICAgICAgICByZXR1cm4gY2hpbGQuX3RpcHB5ICYmIGNoaWxkLl90aXBweS5kZXN0cm95KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLnBvcHBlckluc3RhbmNlKSB7XHJcbiAgICAgICAgdGhpcy5wb3BwZXJJbnN0YW5jZS5kZXN0cm95KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuXyhrZXkpLm11dGF0aW9uT2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24gKG9ic2VydmVyKSB7XHJcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuc3RhdGUuZGVzdHJveWVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XSk7XHJcbiAgcmV0dXJuIFRpcHB5O1xyXG59KCk7XHJcblxyXG4vKipcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIFByaXZhdGUgbWV0aG9kc1xyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogU3RhbmRhbG9uZSBmdW5jdGlvbnMgdG8gYmUgY2FsbGVkIHdpdGggdGhlIGluc3RhbmNlJ3MgYHRoaXNgIGNvbnRleHQgdG8gbWFrZVxyXG4gKiB0aGVtIHRydWx5IHByaXZhdGUgYW5kIG5vdCBhY2Nlc3NpYmxlIG9uIHRoZSBwcm90b3R5cGVcclxuICovXHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lcyBpZiB0aGUgdG9vbHRpcCBpbnN0YW5jZSBoYXMgZm9sbG93Q3Vyc29yIGJlaGF2aW9yXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yKCkge1xyXG4gIHZhciBsYXN0VHJpZ2dlckV2ZW50ID0gdGhpcy5fKGtleSkubGFzdFRyaWdnZXJFdmVudDtcclxuICByZXR1cm4gdGhpcy5vcHRpb25zLmZvbGxvd0N1cnNvciAmJiAhYnJvd3Nlci51c2luZ1RvdWNoICYmIGxhc3RUcmlnZ2VyRXZlbnQgJiYgbGFzdFRyaWdnZXJFdmVudC50eXBlICE9PSAnZm9jdXMnO1xyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyB0aGUgVGlwcHkgaW5zdGFuY2UgZm9yIHRoZSBjaGlsZCB0YXJnZXQgb2YgdGhlIGRlbGVnYXRlIGNvbnRhaW5lclxyXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9jcmVhdGVEZWxlZ2F0ZUNoaWxkVGlwcHkoZXZlbnQpIHtcclxuICB2YXIgdGFyZ2V0RWwgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgdGhpcy5vcHRpb25zLnRhcmdldCk7XHJcbiAgaWYgKHRhcmdldEVsICYmICF0YXJnZXRFbC5fdGlwcHkpIHtcclxuICAgIHZhciB0aXRsZSA9IHRhcmdldEVsLmdldEF0dHJpYnV0ZSgndGl0bGUnKSB8fCB0aGlzLnRpdGxlO1xyXG4gICAgaWYgKHRpdGxlKSB7XHJcbiAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgndGl0bGUnLCB0aXRsZSk7XHJcbiAgICAgIHRpcHB5JDEodGFyZ2V0RWwsIF9leHRlbmRzKHt9LCB0aGlzLm9wdGlvbnMsIHsgdGFyZ2V0OiBudWxsIH0pKTtcclxuICAgICAgX2VudGVyLmNhbGwodGFyZ2V0RWwuX3RpcHB5LCBldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogTWV0aG9kIHVzZWQgYnkgZXZlbnQgbGlzdGVuZXJzIHRvIGludm9rZSB0aGUgc2hvdyBtZXRob2QsIHRha2luZyBpbnRvIGFjY291bnQgZGVsYXlzIGFuZFxyXG4gKiB0aGUgYHdhaXRgIG9wdGlvblxyXG4gKiBAcGFyYW0ge0V2ZW50fSBldmVudFxyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9lbnRlcihldmVudCkge1xyXG4gIHZhciBfdGhpczQgPSB0aGlzO1xyXG5cclxuICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHJcblxyXG4gIF9jbGVhckRlbGF5VGltZW91dHMuY2FsbCh0aGlzKTtcclxuXHJcbiAgaWYgKHRoaXMuc3RhdGUudmlzaWJsZSkgcmV0dXJuO1xyXG5cclxuICAvLyBJcyBhIGRlbGVnYXRlLCBjcmVhdGUgVGlwcHkgaW5zdGFuY2UgZm9yIHRoZSBjaGlsZCB0YXJnZXRcclxuICBpZiAob3B0aW9ucy50YXJnZXQpIHtcclxuICAgIF9jcmVhdGVEZWxlZ2F0ZUNoaWxkVGlwcHkuY2FsbCh0aGlzLCBldmVudCk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB0aGlzLl8oa2V5KS5pc1ByZXBhcmluZ1RvU2hvdyA9IHRydWU7XHJcblxyXG4gIGlmIChvcHRpb25zLndhaXQpIHtcclxuICAgIG9wdGlvbnMud2FpdC5jYWxsKHRoaXMucG9wcGVyLCB0aGlzLnNob3cuYmluZCh0aGlzKSwgZXZlbnQpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLy8gSWYgdGhlIHRvb2x0aXAgaGFzIGEgZGVsYXksIHdlIG5lZWQgdG8gYmUgbGlzdGVuaW5nIHRvIHRoZSBtb3VzZW1vdmUgYXMgc29vbiBhcyB0aGUgdHJpZ2dlclxyXG4gIC8vIGV2ZW50IGlzIGZpcmVkIHNvIHRoYXQgaXQncyBpbiB0aGUgY29ycmVjdCBwb3NpdGlvbiB1cG9uIG1vdW50LlxyXG4gIGlmIChfaGFzRm9sbG93Q3Vyc29yQmVoYXZpb3IuY2FsbCh0aGlzKSkge1xyXG4gICAgaWYgKCF0aGlzLl8oa2V5KS5mb2xsb3dDdXJzb3JMaXN0ZW5lcikge1xyXG4gICAgICBfc2V0Rm9sbG93Q3Vyc29yTGlzdGVuZXIuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgX2dldElubmVyRWxlbWVudHMzID0gZ2V0SW5uZXJFbGVtZW50cyh0aGlzLnBvcHBlciksXHJcbiAgICAgICAgYXJyb3cgPSBfZ2V0SW5uZXJFbGVtZW50czMuYXJyb3c7XHJcblxyXG4gICAgaWYgKGFycm93KSBhcnJvdy5zdHlsZS5tYXJnaW4gPSAnMCc7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl8oa2V5KS5mb2xsb3dDdXJzb3JMaXN0ZW5lcik7XHJcbiAgfVxyXG5cclxuICB2YXIgZGVsYXkgPSBnZXRWYWx1ZShvcHRpb25zLmRlbGF5LCAwKTtcclxuXHJcbiAgaWYgKGRlbGF5KSB7XHJcbiAgICB0aGlzLl8oa2V5KS5zaG93VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICBfdGhpczQuc2hvdygpO1xyXG4gICAgfSwgZGVsYXkpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLnNob3coKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNZXRob2QgdXNlZCBieSBldmVudCBsaXN0ZW5lcnMgdG8gaW52b2tlIHRoZSBoaWRlIG1ldGhvZCwgdGFraW5nIGludG8gYWNjb3VudCBkZWxheXNcclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfbGVhdmUoKSB7XHJcbiAgdmFyIF90aGlzNSA9IHRoaXM7XHJcblxyXG4gIF9jbGVhckRlbGF5VGltZW91dHMuY2FsbCh0aGlzKTtcclxuXHJcbiAgaWYgKCF0aGlzLnN0YXRlLnZpc2libGUpIHJldHVybjtcclxuXHJcbiAgdGhpcy5fKGtleSkuaXNQcmVwYXJpbmdUb1Nob3cgPSBmYWxzZTtcclxuXHJcbiAgdmFyIGRlbGF5ID0gZ2V0VmFsdWUodGhpcy5vcHRpb25zLmRlbGF5LCAxKTtcclxuXHJcbiAgaWYgKGRlbGF5KSB7XHJcbiAgICB0aGlzLl8oa2V5KS5oaWRlVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoX3RoaXM1LnN0YXRlLnZpc2libGUpIHtcclxuICAgICAgICBfdGhpczUuaGlkZSgpO1xyXG4gICAgICB9XHJcbiAgICB9LCBkZWxheSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMuaGlkZSgpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgcmVsZXZhbnQgbGlzdGVuZXJzIGZvciB0aGUgaW5zdGFuY2VcclxuICogQHJldHVybiB7T2JqZWN0fSBvZiBsaXN0ZW5lcnNcclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfZ2V0RXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgdmFyIF90aGlzNiA9IHRoaXM7XHJcblxyXG4gIHZhciBvblRyaWdnZXIgPSBmdW5jdGlvbiBvblRyaWdnZXIoZXZlbnQpIHtcclxuICAgIGlmICghX3RoaXM2LnN0YXRlLmVuYWJsZWQpIHJldHVybjtcclxuXHJcbiAgICB2YXIgc2hvdWxkU3RvcEV2ZW50ID0gYnJvd3Nlci5zdXBwb3J0c1RvdWNoICYmIGJyb3dzZXIudXNpbmdUb3VjaCAmJiBbJ21vdXNlZW50ZXInLCAnbW91c2VvdmVyJywgJ2ZvY3VzJ10uaW5kZXhPZihldmVudC50eXBlKSA+IC0xO1xyXG5cclxuICAgIGlmIChzaG91bGRTdG9wRXZlbnQgJiYgX3RoaXM2Lm9wdGlvbnMudG91Y2hIb2xkKSByZXR1cm47XHJcblxyXG4gICAgX3RoaXM2Ll8oa2V5KS5sYXN0VHJpZ2dlckV2ZW50ID0gZXZlbnQ7XHJcblxyXG4gICAgLy8gVG9nZ2xlIHNob3cvaGlkZSB3aGVuIGNsaWNraW5nIGNsaWNrLXRyaWdnZXJlZCB0b29sdGlwc1xyXG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdjbGljaycgJiYgX3RoaXM2Lm9wdGlvbnMuaGlkZU9uQ2xpY2sgIT09ICdwZXJzaXN0ZW50JyAmJiBfdGhpczYuc3RhdGUudmlzaWJsZSkge1xyXG4gICAgICBfbGVhdmUuY2FsbChfdGhpczYpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgX2VudGVyLmNhbGwoX3RoaXM2LCBldmVudCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIG9uTW91c2VMZWF2ZSA9IGZ1bmN0aW9uIG9uTW91c2VMZWF2ZShldmVudCkge1xyXG4gICAgaWYgKFsnbW91c2VsZWF2ZScsICdtb3VzZW91dCddLmluZGV4T2YoZXZlbnQudHlwZSkgPiAtMSAmJiBicm93c2VyLnN1cHBvcnRzVG91Y2ggJiYgYnJvd3Nlci51c2luZ1RvdWNoICYmIF90aGlzNi5vcHRpb25zLnRvdWNoSG9sZCkgcmV0dXJuO1xyXG5cclxuICAgIGlmIChfdGhpczYub3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xyXG4gICAgICB2YXIgaGlkZSA9IF9sZWF2ZS5iaW5kKF90aGlzNik7XHJcblxyXG4gICAgICB2YXIgb25Nb3VzZU1vdmUgPSBmdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xyXG4gICAgICAgIHZhciByZWZlcmVuY2VDdXJzb3JJc092ZXIgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgc2VsZWN0b3JzLlJFRkVSRU5DRSk7XHJcbiAgICAgICAgdmFyIGN1cnNvcklzT3ZlclBvcHBlciA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBzZWxlY3RvcnMuUE9QUEVSKSA9PT0gX3RoaXM2LnBvcHBlcjtcclxuICAgICAgICB2YXIgY3Vyc29ySXNPdmVyUmVmZXJlbmNlID0gcmVmZXJlbmNlQ3Vyc29ySXNPdmVyID09PSBfdGhpczYucmVmZXJlbmNlO1xyXG5cclxuICAgICAgICBpZiAoY3Vyc29ySXNPdmVyUG9wcGVyIHx8IGN1cnNvcklzT3ZlclJlZmVyZW5jZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAoY3Vyc29ySXNPdXRzaWRlSW50ZXJhY3RpdmVCb3JkZXIoZXZlbnQsIF90aGlzNi5wb3BwZXIsIF90aGlzNi5vcHRpb25zKSkge1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGlkZSk7XHJcbiAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XHJcblxyXG4gICAgICAgICAgX2xlYXZlLmNhbGwoX3RoaXM2LCBvbk1vdXNlTW92ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGlkZSk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIF9sZWF2ZS5jYWxsKF90aGlzNik7XHJcbiAgfTtcclxuXHJcbiAgdmFyIG9uQmx1ciA9IGZ1bmN0aW9uIG9uQmx1cihldmVudCkge1xyXG4gICAgaWYgKGV2ZW50LnRhcmdldCAhPT0gX3RoaXM2LnJlZmVyZW5jZSB8fCBicm93c2VyLnVzaW5nVG91Y2gpIHJldHVybjtcclxuXHJcbiAgICBpZiAoX3RoaXM2Lm9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcclxuICAgICAgaWYgKCFldmVudC5yZWxhdGVkVGFyZ2V0KSByZXR1cm47XHJcbiAgICAgIGlmIChjbG9zZXN0KGV2ZW50LnJlbGF0ZWRUYXJnZXQsIHNlbGVjdG9ycy5QT1BQRVIpKSByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgX2xlYXZlLmNhbGwoX3RoaXM2KTtcclxuICB9O1xyXG5cclxuICB2YXIgb25EZWxlZ2F0ZVNob3cgPSBmdW5jdGlvbiBvbkRlbGVnYXRlU2hvdyhldmVudCkge1xyXG4gICAgaWYgKGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBfdGhpczYub3B0aW9ucy50YXJnZXQpKSB7XHJcbiAgICAgIF9lbnRlci5jYWxsKF90aGlzNiwgZXZlbnQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBvbkRlbGVnYXRlSGlkZSA9IGZ1bmN0aW9uIG9uRGVsZWdhdGVIaWRlKGV2ZW50KSB7XHJcbiAgICBpZiAoY2xvc2VzdChldmVudC50YXJnZXQsIF90aGlzNi5vcHRpb25zLnRhcmdldCkpIHtcclxuICAgICAgX2xlYXZlLmNhbGwoX3RoaXM2KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgb25UcmlnZ2VyOiBvblRyaWdnZXIsXHJcbiAgICBvbk1vdXNlTGVhdmU6IG9uTW91c2VMZWF2ZSxcclxuICAgIG9uQmx1cjogb25CbHVyLFxyXG4gICAgb25EZWxlZ2F0ZVNob3c6IG9uRGVsZWdhdGVTaG93LFxyXG4gICAgb25EZWxlZ2F0ZUhpZGU6IG9uRGVsZWdhdGVIaWRlXHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBuZXcgcG9wcGVyIGluc3RhbmNlXHJcbiAqIEByZXR1cm4ge1BvcHBlcn1cclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfY3JlYXRlUG9wcGVySW5zdGFuY2UoKSB7XHJcbiAgdmFyIF90aGlzNyA9IHRoaXM7XHJcblxyXG4gIHZhciBwb3BwZXIgPSB0aGlzLnBvcHBlcixcclxuICAgICAgcmVmZXJlbmNlID0gdGhpcy5yZWZlcmVuY2UsXHJcbiAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG4gIHZhciBfZ2V0SW5uZXJFbGVtZW50czQgPSBnZXRJbm5lckVsZW1lbnRzKHBvcHBlciksXHJcbiAgICAgIHRvb2x0aXAgPSBfZ2V0SW5uZXJFbGVtZW50czQudG9vbHRpcDtcclxuXHJcbiAgdmFyIHBvcHBlck9wdGlvbnMgPSBvcHRpb25zLnBvcHBlck9wdGlvbnM7XHJcblxyXG4gIHZhciBhcnJvd1NlbGVjdG9yID0gb3B0aW9ucy5hcnJvd1R5cGUgPT09ICdyb3VuZCcgPyBzZWxlY3RvcnMuUk9VTkRfQVJST1cgOiBzZWxlY3RvcnMuQVJST1c7XHJcbiAgdmFyIGFycm93ID0gdG9vbHRpcC5xdWVyeVNlbGVjdG9yKGFycm93U2VsZWN0b3IpO1xyXG5cclxuICB2YXIgY29uZmlnID0gX2V4dGVuZHMoe1xyXG4gICAgcGxhY2VtZW50OiBvcHRpb25zLnBsYWNlbWVudFxyXG4gIH0sIHBvcHBlck9wdGlvbnMgfHwge30sIHtcclxuICAgIG1vZGlmaWVyczogX2V4dGVuZHMoe30sIHBvcHBlck9wdGlvbnMgPyBwb3BwZXJPcHRpb25zLm1vZGlmaWVycyA6IHt9LCB7XHJcbiAgICAgIGFycm93OiBfZXh0ZW5kcyh7XHJcbiAgICAgICAgZWxlbWVudDogYXJyb3dTZWxlY3RvclxyXG4gICAgICB9LCBwb3BwZXJPcHRpb25zICYmIHBvcHBlck9wdGlvbnMubW9kaWZpZXJzID8gcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMuYXJyb3cgOiB7fSksXHJcbiAgICAgIGZsaXA6IF9leHRlbmRzKHtcclxuICAgICAgICBlbmFibGVkOiBvcHRpb25zLmZsaXAsXHJcbiAgICAgICAgcGFkZGluZzogb3B0aW9ucy5kaXN0YW5jZSArIDUgLyogNXB4IGZyb20gdmlld3BvcnQgYm91bmRhcnkgKi9cclxuICAgICAgICAsIGJlaGF2aW9yOiBvcHRpb25zLmZsaXBCZWhhdmlvclxyXG4gICAgICB9LCBwb3BwZXJPcHRpb25zICYmIHBvcHBlck9wdGlvbnMubW9kaWZpZXJzID8gcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMuZmxpcCA6IHt9KSxcclxuICAgICAgb2Zmc2V0OiBfZXh0ZW5kcyh7XHJcbiAgICAgICAgb2Zmc2V0OiBvcHRpb25zLm9mZnNldFxyXG4gICAgICB9LCBwb3BwZXJPcHRpb25zICYmIHBvcHBlck9wdGlvbnMubW9kaWZpZXJzID8gcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMub2Zmc2V0IDoge30pXHJcbiAgICB9KSxcclxuICAgIG9uQ3JlYXRlOiBmdW5jdGlvbiBvbkNyZWF0ZSgpIHtcclxuICAgICAgdG9vbHRpcC5zdHlsZVtnZXRQb3BwZXJQbGFjZW1lbnQocG9wcGVyKV0gPSBnZXRPZmZzZXREaXN0YW5jZUluUHgob3B0aW9ucy5kaXN0YW5jZSk7XHJcblxyXG4gICAgICBpZiAoYXJyb3cgJiYgb3B0aW9ucy5hcnJvd1RyYW5zZm9ybSkge1xyXG4gICAgICAgIGNvbXB1dGVBcnJvd1RyYW5zZm9ybShwb3BwZXIsIGFycm93LCBvcHRpb25zLmFycm93VHJhbnNmb3JtKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uVXBkYXRlOiBmdW5jdGlvbiBvblVwZGF0ZSgpIHtcclxuICAgICAgdmFyIHN0eWxlcyA9IHRvb2x0aXAuc3R5bGU7XHJcbiAgICAgIHN0eWxlcy50b3AgPSAnJztcclxuICAgICAgc3R5bGVzLmJvdHRvbSA9ICcnO1xyXG4gICAgICBzdHlsZXMubGVmdCA9ICcnO1xyXG4gICAgICBzdHlsZXMucmlnaHQgPSAnJztcclxuICAgICAgc3R5bGVzW2dldFBvcHBlclBsYWNlbWVudChwb3BwZXIpXSA9IGdldE9mZnNldERpc3RhbmNlSW5QeChvcHRpb25zLmRpc3RhbmNlKTtcclxuXHJcbiAgICAgIGlmIChhcnJvdyAmJiBvcHRpb25zLmFycm93VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY29tcHV0ZUFycm93VHJhbnNmb3JtKHBvcHBlciwgYXJyb3csIG9wdGlvbnMuYXJyb3dUcmFuc2Zvcm0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIF9hZGRNdXRhdGlvbk9ic2VydmVyLmNhbGwodGhpcywge1xyXG4gICAgdGFyZ2V0OiBwb3BwZXIsXHJcbiAgICBjYWxsYmFjazogZnVuY3Rpb24gY2FsbGJhY2soKSB7XHJcbiAgICAgIF90aGlzNy5wb3BwZXJJbnN0YW5jZS51cGRhdGUoKTtcclxuICAgIH0sXHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgc3VidHJlZTogdHJ1ZSxcclxuICAgICAgY2hhcmFjdGVyRGF0YTogdHJ1ZVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gbmV3IFBvcHBlcihyZWZlcmVuY2UsIHBvcHBlciwgY29uZmlnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFwcGVuZHMgdGhlIHBvcHBlciBlbGVtZW50IHRvIHRoZSBET00sIHVwZGF0aW5nIG9yIGNyZWF0aW5nIHRoZSBwb3BwZXIgaW5zdGFuY2VcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfbW91bnQoY2FsbGJhY2spIHtcclxuICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHJcblxyXG4gIGlmICghdGhpcy5wb3BwZXJJbnN0YW5jZSkge1xyXG4gICAgdGhpcy5wb3BwZXJJbnN0YW5jZSA9IF9jcmVhdGVQb3BwZXJJbnN0YW5jZS5jYWxsKHRoaXMpO1xyXG4gICAgaWYgKCFvcHRpb25zLmxpdmVQbGFjZW1lbnQpIHtcclxuICAgICAgdGhpcy5wb3BwZXJJbnN0YW5jZS5kaXNhYmxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5wb3BwZXJJbnN0YW5jZS5zY2hlZHVsZVVwZGF0ZSgpO1xyXG4gICAgaWYgKG9wdGlvbnMubGl2ZVBsYWNlbWVudCAmJiAhX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yLmNhbGwodGhpcykpIHtcclxuICAgICAgdGhpcy5wb3BwZXJJbnN0YW5jZS5lbmFibGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gSWYgdGhlIGluc3RhbmNlIHByZXZpb3VzbHkgaGFkIGZvbGxvd0N1cnNvciBiZWhhdmlvciwgaXQgd2lsbCBiZSBwb3NpdGlvbmVkIGluY29ycmVjdGx5XHJcbiAgLy8gaWYgdHJpZ2dlcmVkIGJ5IGBmb2N1c2AgYWZ0ZXJ3YXJkcyAtIHVwZGF0ZSB0aGUgcmVmZXJlbmNlIGJhY2sgdG8gdGhlIHJlYWwgRE9NIGVsZW1lbnRcclxuICBpZiAoIV9oYXNGb2xsb3dDdXJzb3JCZWhhdmlvci5jYWxsKHRoaXMpKSB7XHJcbiAgICB2YXIgX2dldElubmVyRWxlbWVudHM1ID0gZ2V0SW5uZXJFbGVtZW50cyh0aGlzLnBvcHBlciksXHJcbiAgICAgICAgYXJyb3cgPSBfZ2V0SW5uZXJFbGVtZW50czUuYXJyb3c7XHJcblxyXG4gICAgaWYgKGFycm93KSBhcnJvdy5zdHlsZS5tYXJnaW4gPSAnJztcclxuICAgIHRoaXMucG9wcGVySW5zdGFuY2UucmVmZXJlbmNlID0gdGhpcy5yZWZlcmVuY2U7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVQb3BwZXJQb3NpdGlvbih0aGlzLnBvcHBlckluc3RhbmNlLCBjYWxsYmFjaywgdHJ1ZSk7XHJcblxyXG4gIGlmICghb3B0aW9ucy5hcHBlbmRUby5jb250YWlucyh0aGlzLnBvcHBlcikpIHtcclxuICAgIG9wdGlvbnMuYXBwZW5kVG8uYXBwZW5kQ2hpbGQodGhpcy5wb3BwZXIpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENsZWFycyB0aGUgc2hvdyBhbmQgaGlkZSBkZWxheSB0aW1lb3V0c1xyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9jbGVhckRlbGF5VGltZW91dHMoKSB7XHJcbiAgdmFyIF9yZWYgPSB0aGlzLl8oa2V5KSxcclxuICAgICAgc2hvd1RpbWVvdXQgPSBfcmVmLnNob3dUaW1lb3V0LFxyXG4gICAgICBoaWRlVGltZW91dCA9IF9yZWYuaGlkZVRpbWVvdXQ7XHJcblxyXG4gIGNsZWFyVGltZW91dChzaG93VGltZW91dCk7XHJcbiAgY2xlYXJUaW1lb3V0KGhpZGVUaW1lb3V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldHMgdGhlIG1vdXNlbW92ZSBldmVudCBsaXN0ZW5lciBmdW5jdGlvbiBmb3IgYGZvbGxvd0N1cnNvcmAgb3B0aW9uXHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX3NldEZvbGxvd0N1cnNvckxpc3RlbmVyKCkge1xyXG4gIHZhciBfdGhpczggPSB0aGlzO1xyXG5cclxuICB0aGlzLl8oa2V5KS5mb2xsb3dDdXJzb3JMaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdmFyIF8kbGFzdE1vdXNlTW92ZUV2ZW50ID0gX3RoaXM4Ll8oa2V5KS5sYXN0TW91c2VNb3ZlRXZlbnQgPSBldmVudCxcclxuICAgICAgICBjbGllbnRYID0gXyRsYXN0TW91c2VNb3ZlRXZlbnQuY2xpZW50WCxcclxuICAgICAgICBjbGllbnRZID0gXyRsYXN0TW91c2VNb3ZlRXZlbnQuY2xpZW50WTtcclxuXHJcbiAgICBpZiAoIV90aGlzOC5wb3BwZXJJbnN0YW5jZSkgcmV0dXJuO1xyXG5cclxuICAgIF90aGlzOC5wb3BwZXJJbnN0YW5jZS5yZWZlcmVuY2UgPSB7XHJcbiAgICAgIGdldEJvdW5kaW5nQ2xpZW50UmVjdDogZnVuY3Rpb24gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB3aWR0aDogMCxcclxuICAgICAgICAgIGhlaWdodDogMCxcclxuICAgICAgICAgIHRvcDogY2xpZW50WSxcclxuICAgICAgICAgIGxlZnQ6IGNsaWVudFgsXHJcbiAgICAgICAgICByaWdodDogY2xpZW50WCxcclxuICAgICAgICAgIGJvdHRvbTogY2xpZW50WVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0sXHJcbiAgICAgIGNsaWVudFdpZHRoOiAwLFxyXG4gICAgICBjbGllbnRIZWlnaHQ6IDBcclxuICAgIH07XHJcblxyXG4gICAgX3RoaXM4LnBvcHBlckluc3RhbmNlLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZXMgdGhlIHBvcHBlcidzIHBvc2l0aW9uIG9uIGVhY2ggYW5pbWF0aW9uIGZyYW1lXHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX21ha2VTdGlja3koKSB7XHJcbiAgdmFyIF90aGlzOSA9IHRoaXM7XHJcblxyXG4gIHZhciBhcHBseVRyYW5zaXRpb25EdXJhdGlvbiQkMSA9IGZ1bmN0aW9uIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uJCQxKCkge1xyXG4gICAgX3RoaXM5LnBvcHBlci5zdHlsZVtwcmVmaXgoJ3RyYW5zaXRpb25EdXJhdGlvbicpXSA9IF90aGlzOS5vcHRpb25zLnVwZGF0ZUR1cmF0aW9uICsgJ21zJztcclxuICB9O1xyXG5cclxuICB2YXIgcmVtb3ZlVHJhbnNpdGlvbkR1cmF0aW9uID0gZnVuY3Rpb24gcmVtb3ZlVHJhbnNpdGlvbkR1cmF0aW9uKCkge1xyXG4gICAgX3RoaXM5LnBvcHBlci5zdHlsZVtwcmVmaXgoJ3RyYW5zaXRpb25EdXJhdGlvbicpXSA9ICcnO1xyXG4gIH07XHJcblxyXG4gIHZhciB1cGRhdGVQb3NpdGlvbiA9IGZ1bmN0aW9uIHVwZGF0ZVBvc2l0aW9uKCkge1xyXG4gICAgaWYgKF90aGlzOS5wb3BwZXJJbnN0YW5jZSkge1xyXG4gICAgICBfdGhpczkucG9wcGVySW5zdGFuY2UudXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24kJDEoKTtcclxuXHJcbiAgICBpZiAoX3RoaXM5LnN0YXRlLnZpc2libGUpIHtcclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZVBvc2l0aW9uKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlbW92ZVRyYW5zaXRpb25EdXJhdGlvbigpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHVwZGF0ZVBvc2l0aW9uKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGRzIGEgbXV0YXRpb24gb2JzZXJ2ZXIgdG8gYW4gZWxlbWVudCBhbmQgc3RvcmVzIGl0IGluIHRoZSBpbnN0YW5jZVxyXG4gKiBAcGFyYW0ge09iamVjdH1cclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfYWRkTXV0YXRpb25PYnNlcnZlcihfcmVmMikge1xyXG4gIHZhciB0YXJnZXQgPSBfcmVmMi50YXJnZXQsXHJcbiAgICAgIGNhbGxiYWNrID0gX3JlZjIuY2FsbGJhY2ssXHJcbiAgICAgIG9wdGlvbnMgPSBfcmVmMi5vcHRpb25zO1xyXG5cclxuICBpZiAoIXdpbmRvdy5NdXRhdGlvbk9ic2VydmVyKSByZXR1cm47XHJcblxyXG4gIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcclxuICBvYnNlcnZlci5vYnNlcnZlKHRhcmdldCwgb3B0aW9ucyk7XHJcblxyXG4gIHRoaXMuXyhrZXkpLm11dGF0aW9uT2JzZXJ2ZXJzLnB1c2gob2JzZXJ2ZXIpO1xyXG59XHJcblxyXG4vKipcclxuICogRmlyZXMgdGhlIGNhbGxiYWNrIGZ1bmN0aW9ucyBvbmNlIHRoZSBDU1MgdHJhbnNpdGlvbiBlbmRzIGZvciBgc2hvd2AgYW5kIGBoaWRlYCBtZXRob2RzXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvblxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGZpcmUgb25jZSB0cmFuc2l0aW9uIGNvbXBsZXRlc1xyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9vblRyYW5zaXRpb25FbmQoZHVyYXRpb24sIGNhbGxiYWNrKSB7XHJcbiAgLy8gTWFrZSBjYWxsYmFjayBzeW5jaHJvbm91cyBpZiBkdXJhdGlvbiBpcyAwXHJcbiAgaWYgKCFkdXJhdGlvbikge1xyXG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XHJcbiAgfVxyXG5cclxuICB2YXIgX2dldElubmVyRWxlbWVudHM2ID0gZ2V0SW5uZXJFbGVtZW50cyh0aGlzLnBvcHBlciksXHJcbiAgICAgIHRvb2x0aXAgPSBfZ2V0SW5uZXJFbGVtZW50czYudG9vbHRpcDtcclxuXHJcbiAgdmFyIHRvZ2dsZUxpc3RlbmVycyA9IGZ1bmN0aW9uIHRvZ2dsZUxpc3RlbmVycyhhY3Rpb24sIGxpc3RlbmVyKSB7XHJcbiAgICBpZiAoIWxpc3RlbmVyKSByZXR1cm47XHJcbiAgICB0b29sdGlwW2FjdGlvbiArICdFdmVudExpc3RlbmVyJ10oJ29udHJhbnNpdGlvbmVuZCcgaW4gd2luZG93ID8gJ3RyYW5zaXRpb25lbmQnIDogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLCBsaXN0ZW5lcik7XHJcbiAgfTtcclxuXHJcbiAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24gbGlzdGVuZXIoZSkge1xyXG4gICAgaWYgKGUudGFyZ2V0ID09PSB0b29sdGlwKSB7XHJcbiAgICAgIHRvZ2dsZUxpc3RlbmVycygncmVtb3ZlJywgbGlzdGVuZXIpO1xyXG4gICAgICBjYWxsYmFjaygpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHRvZ2dsZUxpc3RlbmVycygncmVtb3ZlJywgdGhpcy5fKGtleSkudHJhbnNpdGlvbmVuZExpc3RlbmVyKTtcclxuICB0b2dnbGVMaXN0ZW5lcnMoJ2FkZCcsIGxpc3RlbmVyKTtcclxuXHJcbiAgdGhpcy5fKGtleSkudHJhbnNpdGlvbmVuZExpc3RlbmVyID0gbGlzdGVuZXI7XHJcbn1cclxuXHJcbnZhciBpZENvdW50ZXIgPSAxO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgdG9vbHRpcHMgZm9yIGVhY2ggcmVmZXJlbmNlIGVsZW1lbnRcclxuICogQHBhcmFtIHtFbGVtZW50W119IGVsc1xyXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXHJcbiAqIEByZXR1cm4ge1RpcHB5W119IEFycmF5IG9mIFRpcHB5IGluc3RhbmNlc1xyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlVG9vbHRpcHMoZWxzLCBjb25maWcpIHtcclxuICByZXR1cm4gZWxzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCByZWZlcmVuY2UpIHtcclxuICAgIHZhciBpZCA9IGlkQ291bnRlcjtcclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9IGV2YWx1YXRlT3B0aW9ucyhyZWZlcmVuY2UsIGNvbmZpZy5wZXJmb3JtYW5jZSA/IGNvbmZpZyA6IGdldEluZGl2aWR1YWxPcHRpb25zKHJlZmVyZW5jZSwgY29uZmlnKSk7XHJcblxyXG4gICAgdmFyIHRpdGxlID0gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSgndGl0bGUnKTtcclxuXHJcbiAgICAvLyBEb24ndCBjcmVhdGUgYW4gaW5zdGFuY2Ugd2hlbjpcclxuICAgIC8vICogdGhlIGB0aXRsZWAgYXR0cmlidXRlIGlzIGZhbHN5IChudWxsIG9yIGVtcHR5IHN0cmluZyksIGFuZFxyXG4gICAgLy8gKiBpdCdzIG5vdCBhIGRlbGVnYXRlIGZvciB0b29sdGlwcywgYW5kXHJcbiAgICAvLyAqIHRoZXJlIGlzIG5vIGh0bWwgdGVtcGxhdGUgc3BlY2lmaWVkLCBhbmRcclxuICAgIC8vICogYGR5bmFtaWNUaXRsZWAgb3B0aW9uIGlzIGZhbHNlXHJcbiAgICBpZiAoIXRpdGxlICYmICFvcHRpb25zLnRhcmdldCAmJiAhb3B0aW9ucy5odG1sICYmICFvcHRpb25zLmR5bmFtaWNUaXRsZSkge1xyXG4gICAgICByZXR1cm4gYWNjO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERlbGVnYXRlcyBzaG91bGQgYmUgaGlnaGxpZ2h0ZWQgYXMgZGlmZmVyZW50XHJcbiAgICByZWZlcmVuY2Uuc2V0QXR0cmlidXRlKG9wdGlvbnMudGFyZ2V0ID8gJ2RhdGEtdGlwcHktZGVsZWdhdGUnIDogJ2RhdGEtdGlwcHknLCAnJyk7XHJcblxyXG4gICAgcmVtb3ZlVGl0bGUocmVmZXJlbmNlKTtcclxuXHJcbiAgICB2YXIgcG9wcGVyID0gY3JlYXRlUG9wcGVyRWxlbWVudChpZCwgdGl0bGUsIG9wdGlvbnMpO1xyXG5cclxuICAgIHZhciB0aXBweSA9IG5ldyBUaXBweSh7XHJcbiAgICAgIGlkOiBpZCxcclxuICAgICAgcmVmZXJlbmNlOiByZWZlcmVuY2UsXHJcbiAgICAgIHBvcHBlcjogcG9wcGVyLFxyXG4gICAgICBvcHRpb25zOiBvcHRpb25zLFxyXG4gICAgICB0aXRsZTogdGl0bGUsXHJcbiAgICAgIHBvcHBlckluc3RhbmNlOiBudWxsXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAob3B0aW9ucy5jcmVhdGVQb3BwZXJJbnN0YW5jZU9uSW5pdCkge1xyXG4gICAgICB0aXBweS5wb3BwZXJJbnN0YW5jZSA9IF9jcmVhdGVQb3BwZXJJbnN0YW5jZS5jYWxsKHRpcHB5KTtcclxuICAgICAgdGlwcHkucG9wcGVySW5zdGFuY2UuZGlzYWJsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxpc3RlbmVycyA9IF9nZXRFdmVudExpc3RlbmVycy5jYWxsKHRpcHB5KTtcclxuICAgIHRpcHB5Lmxpc3RlbmVycyA9IG9wdGlvbnMudHJpZ2dlci50cmltKCkuc3BsaXQoJyAnKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgZXZlbnRUeXBlKSB7XHJcbiAgICAgIHJldHVybiBhY2MuY29uY2F0KGNyZWF0ZVRyaWdnZXIoZXZlbnRUeXBlLCByZWZlcmVuY2UsIGxpc3RlbmVycywgb3B0aW9ucykpO1xyXG4gICAgfSwgW10pO1xyXG5cclxuICAgIC8vIFVwZGF0ZSB0b29sdGlwIGNvbnRlbnQgd2hlbmV2ZXIgdGhlIHRpdGxlIGF0dHJpYnV0ZSBvbiB0aGUgcmVmZXJlbmNlIGNoYW5nZXNcclxuICAgIGlmIChvcHRpb25zLmR5bmFtaWNUaXRsZSkge1xyXG4gICAgICBfYWRkTXV0YXRpb25PYnNlcnZlci5jYWxsKHRpcHB5LCB7XHJcbiAgICAgICAgdGFyZ2V0OiByZWZlcmVuY2UsXHJcbiAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIGNhbGxiYWNrKCkge1xyXG4gICAgICAgICAgdmFyIF9nZXRJbm5lckVsZW1lbnRzID0gZ2V0SW5uZXJFbGVtZW50cyhwb3BwZXIpLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnQgPSBfZ2V0SW5uZXJFbGVtZW50cy5jb250ZW50O1xyXG5cclxuICAgICAgICAgIHZhciB0aXRsZSA9IHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoJ3RpdGxlJyk7XHJcbiAgICAgICAgICBpZiAodGl0bGUpIHtcclxuICAgICAgICAgICAgY29udGVudFtvcHRpb25zLmFsbG93VGl0bGVIVE1MID8gJ2lubmVySFRNTCcgOiAndGV4dENvbnRlbnQnXSA9IHRpcHB5LnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgIHJlbW92ZVRpdGxlKHJlZmVyZW5jZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgYXR0cmlidXRlczogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2hvcnRjdXRzXHJcbiAgICByZWZlcmVuY2UuX3RpcHB5ID0gdGlwcHk7XHJcbiAgICBwb3BwZXIuX3RpcHB5ID0gdGlwcHk7XHJcbiAgICBwb3BwZXIuX3JlZmVyZW5jZSA9IHJlZmVyZW5jZTtcclxuXHJcbiAgICBhY2MucHVzaCh0aXBweSk7XHJcblxyXG4gICAgaWRDb3VudGVyKys7XHJcblxyXG4gICAgcmV0dXJuIGFjYztcclxuICB9LCBbXSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIaWRlcyBhbGwgcG9wcGVyc1xyXG4gKiBAcGFyYW0ge1RpcHB5fSBleGNsdWRlVGlwcHkgLSB0aXBweSB0byBleGNsdWRlIGlmIG5lZWRlZFxyXG4gKi9cclxuZnVuY3Rpb24gaGlkZUFsbFBvcHBlcnMoZXhjbHVkZVRpcHB5KSB7XHJcbiAgdmFyIHBvcHBlcnMgPSB0b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLlBPUFBFUikpO1xyXG5cclxuICBwb3BwZXJzLmZvckVhY2goZnVuY3Rpb24gKHBvcHBlcikge1xyXG4gICAgdmFyIHRpcHB5ID0gcG9wcGVyLl90aXBweTtcclxuICAgIGlmICghdGlwcHkpIHJldHVybjtcclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9IHRpcHB5Lm9wdGlvbnM7XHJcblxyXG5cclxuICAgIGlmICgob3B0aW9ucy5oaWRlT25DbGljayA9PT0gdHJ1ZSB8fCBvcHRpb25zLnRyaWdnZXIuaW5kZXhPZignZm9jdXMnKSA+IC0xKSAmJiAoIWV4Y2x1ZGVUaXBweSB8fCBwb3BwZXIgIT09IGV4Y2x1ZGVUaXBweS5wb3BwZXIpKSB7XHJcbiAgICAgIHRpcHB5LmhpZGUoKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZHMgdGhlIG5lZWRlZCBldmVudCBsaXN0ZW5lcnNcclxuICovXHJcbmZ1bmN0aW9uIGJpbmRFdmVudExpc3RlbmVycygpIHtcclxuICB2YXIgb25Eb2N1bWVudFRvdWNoID0gZnVuY3Rpb24gb25Eb2N1bWVudFRvdWNoKCkge1xyXG4gICAgaWYgKGJyb3dzZXIudXNpbmdUb3VjaCkgcmV0dXJuO1xyXG5cclxuICAgIGJyb3dzZXIudXNpbmdUb3VjaCA9IHRydWU7XHJcblxyXG4gICAgaWYgKGJyb3dzZXIuaU9TKSB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgndGlwcHktdG91Y2gnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYnJvd3Nlci5keW5hbWljSW5wdXREZXRlY3Rpb24gJiYgd2luZG93LnBlcmZvcm1hbmNlKSB7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uRG9jdW1lbnRNb3VzZU1vdmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGJyb3dzZXIub25Vc2VySW5wdXRDaGFuZ2UoJ3RvdWNoJyk7XHJcbiAgfTtcclxuXHJcbiAgdmFyIG9uRG9jdW1lbnRNb3VzZU1vdmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgdGltZSA9IHZvaWQgMDtcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAvLyBDaHJvbWUgNjArIGlzIDEgbW91c2Vtb3ZlIHBlciBhbmltYXRpb24gZnJhbWUsIHVzZSAyMG1zIHRpbWUgZGlmZmVyZW5jZVxyXG4gICAgICBpZiAobm93IC0gdGltZSA8IDIwKSB7XHJcbiAgICAgICAgYnJvd3Nlci51c2luZ1RvdWNoID0gZmFsc2U7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Eb2N1bWVudE1vdXNlTW92ZSk7XHJcbiAgICAgICAgaWYgKCFicm93c2VyLmlPUykge1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCd0aXBweS10b3VjaCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicm93c2VyLm9uVXNlcklucHV0Q2hhbmdlKCdtb3VzZScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aW1lID0gbm93O1xyXG4gICAgfTtcclxuICB9KCk7XHJcblxyXG4gIHZhciBvbkRvY3VtZW50Q2xpY2sgPSBmdW5jdGlvbiBvbkRvY3VtZW50Q2xpY2soZXZlbnQpIHtcclxuICAgIC8vIFNpbXVsYXRlZCBldmVudHMgZGlzcGF0Y2hlZCBvbiB0aGUgZG9jdW1lbnRcclxuICAgIGlmICghKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XHJcbiAgICAgIHJldHVybiBoaWRlQWxsUG9wcGVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciByZWZlcmVuY2UgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgc2VsZWN0b3JzLlJFRkVSRU5DRSk7XHJcbiAgICB2YXIgcG9wcGVyID0gY2xvc2VzdChldmVudC50YXJnZXQsIHNlbGVjdG9ycy5QT1BQRVIpO1xyXG5cclxuICAgIGlmIChwb3BwZXIgJiYgcG9wcGVyLl90aXBweSAmJiBwb3BwZXIuX3RpcHB5Lm9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZWZlcmVuY2UgJiYgcmVmZXJlbmNlLl90aXBweSkge1xyXG4gICAgICB2YXIgb3B0aW9ucyA9IHJlZmVyZW5jZS5fdGlwcHkub3B0aW9ucztcclxuXHJcbiAgICAgIHZhciBpc0NsaWNrVHJpZ2dlciA9IG9wdGlvbnMudHJpZ2dlci5pbmRleE9mKCdjbGljaycpID4gLTE7XHJcbiAgICAgIHZhciBpc011bHRpcGxlID0gb3B0aW9ucy5tdWx0aXBsZTtcclxuXHJcbiAgICAgIC8vIEhpZGUgYWxsIHBvcHBlcnMgZXhjZXB0IHRoZSBvbmUgYmVsb25naW5nIHRvIHRoZSBlbGVtZW50IHRoYXQgd2FzIGNsaWNrZWRcclxuICAgICAgaWYgKCFpc011bHRpcGxlICYmIGJyb3dzZXIudXNpbmdUb3VjaCB8fCAhaXNNdWx0aXBsZSAmJiBpc0NsaWNrVHJpZ2dlcikge1xyXG4gICAgICAgIHJldHVybiBoaWRlQWxsUG9wcGVycyhyZWZlcmVuY2UuX3RpcHB5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuaGlkZU9uQ2xpY2sgIT09IHRydWUgfHwgaXNDbGlja1RyaWdnZXIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoaWRlQWxsUG9wcGVycygpO1xyXG4gIH07XHJcblxyXG4gIHZhciBvbldpbmRvd0JsdXIgPSBmdW5jdGlvbiBvbldpbmRvd0JsdXIoKSB7XHJcbiAgICB2YXIgX2RvY3VtZW50ID0gZG9jdW1lbnQsXHJcbiAgICAgICAgZWwgPSBfZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuXHJcbiAgICBpZiAoZWwgJiYgZWwuYmx1ciAmJiBtYXRjaGVzJDEuY2FsbChlbCwgc2VsZWN0b3JzLlJFRkVSRU5DRSkpIHtcclxuICAgICAgZWwuYmx1cigpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBvbldpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xyXG4gICAgdG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycy5QT1BQRVIpKS5mb3JFYWNoKGZ1bmN0aW9uIChwb3BwZXIpIHtcclxuICAgICAgdmFyIHRpcHB5SW5zdGFuY2UgPSBwb3BwZXIuX3RpcHB5O1xyXG4gICAgICBpZiAodGlwcHlJbnN0YW5jZSAmJiAhdGlwcHlJbnN0YW5jZS5vcHRpb25zLmxpdmVQbGFjZW1lbnQpIHtcclxuICAgICAgICB0aXBweUluc3RhbmNlLnBvcHBlckluc3RhbmNlLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Eb2N1bWVudENsaWNrKTtcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Eb2N1bWVudFRvdWNoKTtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uV2luZG93Qmx1cik7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplKTtcclxuXHJcbiAgaWYgKCFicm93c2VyLnN1cHBvcnRzVG91Y2ggJiYgKG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyB8fCBuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cykpIHtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgb25Eb2N1bWVudFRvdWNoKTtcclxuICB9XHJcbn1cclxuXHJcbnZhciBldmVudExpc3RlbmVyc0JvdW5kID0gZmFsc2U7XHJcblxyXG4vKipcclxuICogRXhwb3J0ZWQgbW9kdWxlXHJcbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR8RWxlbWVudFtdfE5vZGVMaXN0fE9iamVjdH0gc2VsZWN0b3JcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICogQHBhcmFtIHtCb29sZWFufSBvbmUgLSBjcmVhdGUgb25lIHRvb2x0aXBcclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKi9cclxuZnVuY3Rpb24gdGlwcHkkMShzZWxlY3Rvciwgb3B0aW9ucywgb25lKSB7XHJcbiAgaWYgKGJyb3dzZXIuc3VwcG9ydGVkICYmICFldmVudExpc3RlbmVyc0JvdW5kKSB7XHJcbiAgICBiaW5kRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIGV2ZW50TGlzdGVuZXJzQm91bmQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKGlzT2JqZWN0TGl0ZXJhbChzZWxlY3RvcikpIHtcclxuICAgIHBvbHlmaWxsVmlydHVhbFJlZmVyZW5jZVByb3BzKHNlbGVjdG9yKTtcclxuICB9XHJcblxyXG4gIG9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cclxuICB2YXIgcmVmZXJlbmNlcyA9IGdldEFycmF5T2ZFbGVtZW50cyhzZWxlY3Rvcik7XHJcbiAgdmFyIGZpcnN0UmVmZXJlbmNlID0gcmVmZXJlbmNlc1swXTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcclxuICAgIG9wdGlvbnM6IG9wdGlvbnMsXHJcbiAgICB0b29sdGlwczogYnJvd3Nlci5zdXBwb3J0ZWQgPyBjcmVhdGVUb29sdGlwcyhvbmUgJiYgZmlyc3RSZWZlcmVuY2UgPyBbZmlyc3RSZWZlcmVuY2VdIDogcmVmZXJlbmNlcywgb3B0aW9ucykgOiBbXSxcclxuICAgIGRlc3Ryb3lBbGw6IGZ1bmN0aW9uIGRlc3Ryb3lBbGwoKSB7XHJcbiAgICAgIHRoaXMudG9vbHRpcHMuZm9yRWFjaChmdW5jdGlvbiAodG9vbHRpcCkge1xyXG4gICAgICAgIHJldHVybiB0b29sdGlwLmRlc3Ryb3koKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMudG9vbHRpcHMgPSBbXTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG50aXBweSQxLnZlcnNpb24gPSB2ZXJzaW9uO1xyXG50aXBweSQxLmJyb3dzZXIgPSBicm93c2VyO1xyXG50aXBweSQxLmRlZmF1bHRzID0gZGVmYXVsdHM7XHJcbnRpcHB5JDEub25lID0gZnVuY3Rpb24gKHNlbGVjdG9yLCBvcHRpb25zKSB7XHJcbiAgcmV0dXJuIHRpcHB5JDEoc2VsZWN0b3IsIG9wdGlvbnMsIHRydWUpLnRvb2x0aXBzWzBdO1xyXG59O1xyXG50aXBweSQxLmRpc2FibGVBbmltYXRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gIGRlZmF1bHRzLnVwZGF0ZUR1cmF0aW9uID0gZGVmYXVsdHMuZHVyYXRpb24gPSAwO1xyXG4gIGRlZmF1bHRzLmFuaW1hdGVGaWxsID0gZmFsc2U7XHJcbn07XHJcblxyXG5yZXR1cm4gdGlwcHkkMTtcclxuXHJcbn0pKSk7XHJcbiJdfQ==
