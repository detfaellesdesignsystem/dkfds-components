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
"use strict";

module.exports = function once(listener, options) {
  var wrapped = function wrappedOnce(e) {
    e.currentTarget.removeEventListener(e.type, wrapped, options);
    return listener.call(this, e);
  };
  return wrapped;
};

},{}],61:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var toggle = require('../utils/toggle');
var isElementInViewport = require('../utils/is-in-viewport');
var BUTTON = '.accordion-button[aria-controls]';
var EXPANDED = 'aria-expanded';
var MULTISELECTABLE = 'aria-multiselectable';
var MULTISELECTABLE_CLASS = 'accordion-multiselectable';

var Accordion = function () {
  function Accordion(accordion) {
    _classCallCheck(this, Accordion);

    this.accordion = accordion;
    this.buttons = accordion.querySelectorAll(BUTTON);
    this.eventClose = document.createEvent('Event');
    this.eventClose.initEvent('fds.accordion.close', true, true);
    this.eventOpen = document.createEvent('Event');
    this.eventOpen.initEvent('fds.accordion.open', true, true);
    this.init();
  }

  _createClass(Accordion, [{
    key: 'init',
    value: function init() {
      for (var i = 0; i < this.buttons.length; i++) {
        var currentButton = this.buttons[i];

        var expanded = currentButton.getAttribute(EXPANDED) === 'true';
        toggleButton(currentButton, expanded);

        var that = this;
        currentButton.removeEventListener('click', that.eventOnClick, false);
        currentButton.addEventListener('click', that.eventOnClick, false);
      }
    }
  }, {
    key: 'eventOnClick',
    value: function eventOnClick(event) {
      event.stopPropagation();
      var button = this;
      event.preventDefault();
      toggleButton(button);
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

  }]);

  return Accordion;
}();

var toggleButton = function toggleButton(button, expanded) {
  var accordion = null;
  if (button.parentNode.parentNode.classList.contains('accordion')) {
    accordion = button.parentNode.parentNode;
  }

  var eventClose = document.createEvent('Event');
  eventClose.initEvent('fds.accordion.close', true, true);
  var eventOpen = document.createEvent('Event');
  eventOpen.initEvent('fds.accordion.open', true, true);
  expanded = toggle(button, expanded);

  if (expanded) {
    button.dispatchEvent(eventOpen);
  } else {
    button.dispatchEvent(eventClose);
  }

  // XXX multiselectable is opt-in, to preserve legacy behavior
  var multiselectable = false;
  if (accordion !== null && (accordion.getAttribute(MULTISELECTABLE) === 'true' || accordion.classList.contains(MULTISELECTABLE_CLASS))) {
    multiselectable = true;
  }

  if (expanded && !multiselectable) {
    var buttons = [button];
    if (accordion !== null) {
      buttons = accordion.querySelectorAll(BUTTON);
    }
    for (var i = 0; i < buttons.length; i++) {
      var currentButtton = buttons[i];
      if (currentButtton !== button) {
        toggle(currentButtton, false);
        currentButtton.dispatchEvent(eventClose);
      }
    }
  }
};

module.exports = Accordion;

},{"../utils/is-in-viewport":79,"../utils/toggle":81}],62:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheckboxToggleContent = function () {
    function CheckboxToggleContent(el) {
        _classCallCheck(this, CheckboxToggleContent);

        this.jsToggleTrigger = '.js-checkbox-toggle-content';
        this.jsToggleTarget = 'data-js-target';
        this.eventClose = document.createEvent('Event');
        this.eventClose.initEvent('fds.collapse.close', true, true);
        this.eventOpen = document.createEvent('Event');
        this.eventOpen.initEvent('fds.collapse.open', true, true);
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

},{}],63:[function(require,module,exports){
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
    this.eventClose = document.createEvent('Event');
    this.eventClose.initEvent('fds.collapse.close', true, true);
    this.eventOpen = document.createEvent('Event');
    this.eventOpen.initEvent('fds.collapse.open', true, true);
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

},{}],64:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _generateUniqueId = require('../utils/generate-unique-id.js');

var KEY_ENTER = 13; /**
                     * JavaScript 'polyfill' for HTML5's <details> and <summary> elements
                     * and 'shim' to add accessiblity enhancements for all browsers
                     *
                     * http://caniuse.com/#feat=details
                     */

var KEY_SPACE = 32;

function Details($module) {
  this.$module = $module;
}

Details.prototype.init = function () {
  if (!this.$module) {
    return;
  }

  // If there is native details support, we want to avoid running code to polyfill native behaviour.
  var hasNativeDetails = typeof this.$module.open === 'boolean';

  if (hasNativeDetails) {
    return;
  }

  this.polyfillDetails();
};

Details.prototype.polyfillDetails = function () {
  var $module = this.$module;

  // Save shortcuts to the inner summary and content elements
  var $summary = this.$summary = $module.getElementsByTagName('summary').item(0);
  var $content = this.$content = $module.getElementsByTagName('div').item(0);

  // If <details> doesn't have a <summary> and a <div> representing the content
  // it means the required HTML structure is not met so the script will stop
  if (!$summary || !$content) {
    return;
  }

  // If the content doesn't have an ID, assign it one now
  // which we'll need for the summary's aria-controls assignment
  if (!$content.id) {
    $content.id = 'details-content-' + (0, _generateUniqueId.generateUniqueID)();
  }

  // Add ARIA role="group" to details
  $module.setAttribute('role', 'group');

  // Add role=button to summary
  $summary.setAttribute('role', 'button');

  // Add aria-controls
  $summary.setAttribute('aria-controls', $content.id);

  // Set tabIndex so the summary is keyboard accessible for non-native elements
  //
  // We have to use the camelcase `tabIndex` property as there is a bug in IE6/IE7 when we set the correct attribute lowercase:
  // See http://web.archive.org/web/20170120194036/http://www.saliences.com/browserBugs/tabIndex.html for more information.
  $summary.tabIndex = 0;

  // Detect initial open state
  var openAttr = $module.getAttribute('open') !== null;
  if (openAttr === true) {
    $summary.setAttribute('aria-expanded', 'true');
    $content.setAttribute('aria-hidden', 'false');
  } else {
    $summary.setAttribute('aria-expanded', 'false');
    $content.setAttribute('aria-hidden', 'true');
  }

  // Bind an event to handle summary elements
  this.polyfillHandleInputs($summary, this.polyfillSetAttributes.bind(this));
};

/**
 * Define a statechange function that updates aria-expanded and style.display
 * @param {object} summary element
 */
Details.prototype.polyfillSetAttributes = function () {
  var $module = this.$module;
  var $summary = this.$summary;
  var $content = this.$content;

  var expanded = $summary.getAttribute('aria-expanded') === 'true';
  var hidden = $content.getAttribute('aria-hidden') === 'true';

  $summary.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  $content.setAttribute('aria-hidden', hidden ? 'false' : 'true');

  var hasOpenAttr = $module.getAttribute('open') !== null;
  if (!hasOpenAttr) {
    $module.setAttribute('open', 'open');
  } else {
    $module.removeAttribute('open');
  }

  return true;
};

/**
 * Handle cross-modal click events
 * @param {object} node element
 * @param {function} callback function
 */
Details.prototype.polyfillHandleInputs = function (node, callback) {
  node.addEventListener('keypress', function (event) {
    var target = event.target;
    // When the key gets pressed - check if it is enter or space
    if (event.keyCode === KEY_ENTER || event.keyCode === KEY_SPACE) {
      if (target.nodeName.toLowerCase() === 'summary') {
        // Prevent space from scrolling the page
        // and enter from submitting a form
        event.preventDefault();
        // Click to let the click event do all the necessary action
        if (target.click) {
          target.click();
        } else {
          // except Safari 5.1 and under don't support .click() here
          callback(event);
        }
      }
    }
  });

  // Prevent keyup to prevent clicking twice in Firefox when using space key
  node.addEventListener('keyup', function (event) {
    var target = event.target;
    if (event.keyCode === KEY_SPACE) {
      if (target.nodeName.toLowerCase() === 'summary') {
        event.preventDefault();
      }
    }
  });

  node.addEventListener('click', callback);
};

exports.default = Details;

},{"../utils/generate-unique-id.js":78}],65:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var closest = require('../utils/closest');
var toggle = require('../utils/toggle');
var breakpoints = require('../utils/breakpoints');
var BUTTON = '.js-dropdown';
var jsDropdownCollapseModifier = 'js-dropdown--responsive-collapse'; //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).
var TARGET = 'data-js-target';
var eventCloseName = 'fds.dropdown.close';
var eventOpenName = 'fds.dropdown.open';

var Dropdown = function () {
  function Dropdown(el) {
    _classCallCheck(this, Dropdown);

    this.responsiveListCollapseEnabled = false;

    this.triggerEl = null;
    this.targetEl = null;

    this.init(el);

    if (this.triggerEl !== null && this.triggerEl !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
      var that = this;

      if (this.triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive') || this.triggerEl.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
        this.responsiveListCollapseEnabled = true;
      }

      //Clicked outside dropdown -> close it
      document.getElementsByTagName('body')[0].removeEventListener('click', outsideClose);
      document.getElementsByTagName('body')[0].addEventListener('click', outsideClose);
      //Clicked on dropdown open button --> toggle it
      this.triggerEl.removeEventListener('click', toggleDropdown);
      this.triggerEl.addEventListener('click', toggleDropdown);

      // set aria-hidden correctly for screenreaders (Tringuide responsive)
      if (this.responsiveListCollapseEnabled) {
        var element = this.triggerEl;
        if (window.IntersectionObserver) {
          // trigger event when button changes visibility
          var observer = new IntersectionObserver(function (entries) {
            // button is visible
            if (entries[0].intersectionRatio) {
              if (element.getAttribute('aria-expanded') === 'false') {
                that.targetEl.setAttribute('aria-hidden', 'true');
              }
            } else {
              // button is not visible
              if (that.targetEl.getAttribute('aria-hidden') === 'true') {
                that.targetEl.setAttribute('aria-hidden', 'false');
              }
            }
          }, {
            root: document.body
          });
          observer.observe(element);
        } else {
          // IE: IntersectionObserver is not supported, so we listen for window resize and grid breakpoint instead
          if (doResponsiveCollapse(that.triggerEl)) {
            // small screen
            if (element.getAttribute('aria-expanded') === 'false') {
              that.targetEl.setAttribute('aria-hidden', 'true');
            } else {
              that.targetEl.setAttribute('aria-hidden', 'false');
            }
          } else {
            // Large screen
            that.targetEl.setAttribute('aria-hidden', 'false');
          }
          window.addEventListener('resize', function () {
            if (doResponsiveCollapse(that.triggerEl)) {
              if (element.getAttribute('aria-expanded') === 'false') {
                that.targetEl.setAttribute('aria-hidden', 'true');
              } else {
                that.targetEl.setAttribute('aria-hidden', 'false');
              }
            } else {
              that.targetEl.setAttribute('aria-hidden', 'false');
            }
          });
        }
      }

      document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode === 27) {
          closeAll();
        }
      };
    }
  }

  _createClass(Dropdown, [{
    key: 'init',
    value: function init(el) {
      this.triggerEl = el;
      if (this.triggerEl !== null && this.triggerEl !== undefined) {
        var targetAttr = this.triggerEl.getAttribute(TARGET);
        if (targetAttr !== null && targetAttr !== undefined) {
          var targetEl = document.getElementById(targetAttr.replace('#', ''));
          if (targetEl !== null && targetEl !== undefined) {
            this.targetEl = targetEl;
          }
        }
      }
    }
  }]);

  return Dropdown;
}();

/**
 * Toggle a button's "pressed" state, optionally providing a target
 * state.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean?} expanded If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */


var toggleButton = function toggleButton(button, expanded) {
  toggle(button, expanded);
};

/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param parent accordion element
 * @returns {NodeListOf<SVGElementTagNameMap[[string]]> | NodeListOf<HTMLElementTagNameMap[[string]]> | NodeListOf<Element>}
 */
var getButtons = function getButtons(parent) {
  return parent.querySelectorAll(BUTTON);
};

var closeAll = function closeAll() {

  var eventClose = document.createEvent('Event');
  eventClose.initEvent(eventCloseName, true, true);

  var body = document.querySelector('body');

  var overflowMenuEl = document.getElementsByClassName('overflow-menu');
  for (var oi = 0; oi < overflowMenuEl.length; oi++) {
    var currentOverflowMenuEL = overflowMenuEl[oi];
    var triggerEl = currentOverflowMenuEL.querySelector(BUTTON);
    var targetEl = currentOverflowMenuEL.querySelector('#' + triggerEl.getAttribute(TARGET).replace('#', ''));

    if (targetEl !== null && triggerEl !== null) {
      if (doResponsiveCollapse(triggerEl)) {
        if (triggerEl.getAttribute('aria-expanded') === true) {
          triggerEl.dispatchEvent(eventClose);
        }
        triggerEl.setAttribute('aria-expanded', 'false');
        targetEl.classList.add('collapsed');
        targetEl.setAttribute('aria-hidden', 'true');
      }
    }
  }
};
var offset = function offset(el) {
  var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

var toggleDropdown = function toggleDropdown(event) {
  var forceClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  event.stopPropagation();
  event.preventDefault();

  var eventClose = document.createEvent('Event');
  eventClose.initEvent(eventCloseName, true, true);

  var eventOpen = document.createEvent('Event');
  eventOpen.initEvent(eventOpenName, true, true);
  var triggerEl = this;
  var targetEl = null;
  if (triggerEl !== null && triggerEl !== undefined) {
    var targetAttr = triggerEl.getAttribute(TARGET);
    if (targetAttr !== null && targetAttr !== undefined) {
      targetEl = document.getElementById(targetAttr.replace('#', ''));
    }
  }
  if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
    //change state

    targetEl.style.left = null;
    targetEl.style.right = null;

    if (triggerEl.getAttribute('aria-expanded') === 'true' || forceClose) {
      //close
      triggerEl.setAttribute('aria-expanded', 'false');
      targetEl.classList.add('collapsed');
      targetEl.setAttribute('aria-hidden', 'true');
      triggerEl.dispatchEvent(eventClose);
    } else {
      closeAll();
      //open
      triggerEl.setAttribute('aria-expanded', 'true');
      targetEl.classList.remove('collapsed');
      targetEl.setAttribute('aria-hidden', 'false');
      triggerEl.dispatchEvent(eventOpen);
      var targetOffset = offset(targetEl);

      if (targetOffset.left < 0) {
        targetEl.style.left = '0px';
        targetEl.style.right = 'auto';
      }
      var right = targetOffset.left + targetEl.offsetWidth;
      if (right > window.innerWidth) {
        targetEl.style.left = 'auto';
        targetEl.style.right = '0px';
      }

      var offsetAgain = offset(targetEl);

      if (offsetAgain.left < 0) {

        targetEl.style.left = '0px';
        targetEl.style.right = 'auto';
      }
      right = offsetAgain.left + targetEl.offsetWidth;
      if (right > window.innerWidth) {

        targetEl.style.left = 'auto';
        targetEl.style.right = '0px';
      }
    }
  }
};

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} true
 */
var show = function show(button) {
  toggleButton(button, true);
};

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} false
 */
var hide = function hide(button) {
  toggleButton(button, false);
};

var outsideClose = function outsideClose(evt) {
  if (document.querySelector('body.mobile_nav-active') === null) {
    var openDropdowns = document.querySelectorAll('.js-dropdown[aria-expanded=true]');
    for (var i = 0; i < openDropdowns.length; i++) {
      var triggerEl = openDropdowns[i];
      var targetEl = null;
      var targetAttr = triggerEl.getAttribute(TARGET);
      if (targetAttr !== null && targetAttr !== undefined) {
        targetEl = document.getElementById(targetAttr);
      }
      if (doResponsiveCollapse(triggerEl)) {
        //closes dropdown when clicked outside
        if (evt.target !== triggerEl) {
          //clicked outside trigger, force close
          triggerEl.setAttribute('aria-expanded', 'false');
          targetEl.classList.add('collapsed');
          targetEl.setAttribute('aria-hidden', 'true');

          var eventClose = document.createEvent('Event');
          eventClose.initEvent(eventCloseName, true, true);
          triggerEl.dispatchEvent(eventClose);
        }
      }
    }
  }
};

var doResponsiveCollapse = function doResponsiveCollapse(triggerEl) {
  if (!triggerEl.classList.contains(jsDropdownCollapseModifier)) {
    // not nav overflow menu
    if (triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive') || triggerEl.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
      // trinindikator overflow menu
      if (window.innerWidth <= getTringuideBreakpoint(triggerEl)) {
        // overflow menu på responsiv tringuide aktiveret
        return true;
      }
    } else {
      // normal overflow menu
      return true;
    }
  }

  return false;
};

var getTringuideBreakpoint = function getTringuideBreakpoint(button) {
  if (button.parentNode.classList.contains('overflow-menu--md-no-responsive')) {
    return breakpoints.md;
  }
  if (button.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
    return breakpoints.lg;
  }
};

module.exports = Dropdown;

},{"../utils/breakpoints":76,"../utils/closest":77,"../utils/toggle":81}],66:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var forEach = require('array-foreach');
var select = require('../utils/select');
var dropdown = require('./dropdown');

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
    if (e.key === 'Escape') {
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

var Navigation = function () {
  function Navigation() {
    _classCallCheck(this, Navigation);

    var openers = document.querySelectorAll(OPENERS);
    for (var o = 0; o < openers.length; o++) {
      openers[o].addEventListener('click', toggleNav);
    }

    var closers = document.querySelectorAll(CLOSERS);
    for (var c = 0; c < closers.length; c++) {
      closers[c].addEventListener('click', toggleNav);
    }

    var navLinks = document.querySelectorAll(NAV_LINKS);
    for (var n = 0; n < navLinks.length; n++) {
      navLinks[n].addEventListener('click', function () {
        // A navigation link has been clicked! We want to collapse any
        // hierarchical navigation UI it's a part of, so that the user
        // can focus on whatever they've just selected.

        // Some navigation links are inside dropdowns; when they're
        // clicked, we want to collapse those dropdowns.


        // If the mobile navigation menu is active, we want to hide it.
        if (isActive()) {
          toggleNav.call(this, false);
        }
      });
    }

    this.init();
  }

  _createClass(Navigation, [{
    key: 'init',
    value: function init() {
      var trapContainers = document.querySelectorAll(NAV);
      for (var i = 0; i < trapContainers.length; i++) {
        focusTrap = _focusTrap(trapContainers[i]);
      }

      resize();
      window.addEventListener('resize', resize, false);
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      window.removeEventListener('resize', resize, false);
    }
  }]);

  return Navigation;
}();

module.exports = Navigation;

},{"../utils/select":80,"./dropdown":65,"array-foreach":1}],67:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RadioToggleGroup = function () {
    function RadioToggleGroup(el) {
        _classCallCheck(this, RadioToggleGroup);

        this.jsToggleTrigger = '.js-radio-toggle-group';
        this.jsToggleTarget = 'data-js-target';

        this.eventClose = document.createEvent('Event');
        this.eventClose.initEvent('fds.collapse.close', true, true);

        this.eventOpen = document.createEvent('Event');
        this.eventOpen.initEvent('fds.collapse.open', true, true);
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

},{}],68:[function(require,module,exports){
/*
* Prevents the user from inputting based on a regex.
* Does not work the same way af <input pattern="">, this pattern is only used for validation, not to prevent input.
* Usecase: number input for date-component.
* Example - number only: <input type="text" data-input-regex="^\d*$">
*/
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var modifierState = {
  shift: false,
  alt: false,
  ctrl: false,
  command: false
};

var InputRegexMask = function InputRegexMask(element) {
  _classCallCheck(this, InputRegexMask);

  element.addEventListener('paste', regexMask);
  element.addEventListener('keydown', regexMask);
};

var regexMask = function regexMask(event) {
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
};

module.exports = InputRegexMask;

},{}],69:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var once = require('receptor/once');

var SetTabIndex = function SetTabIndex(element) {
  _classCallCheck(this, SetTabIndex);

  element.addEventListener('click', function () {
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
  });
};

module.exports = SetTabIndex;

},{"receptor/once":60}],70:[function(require,module,exports){
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

},{"../utils/select":80}],71:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};

var Tabnav = function Tabnav(tabnav) {
  _classCallCheck(this, Tabnav);

  this.tabnav = tabnav;
  this.tabs = this.tabnav.querySelectorAll('button.tabnav-item');

  // if no hash is set on load, set active tab
  if (!setActiveHashTab()) {
    // set first tab as active
    var tab = this.tabs[0];

    // check no other tabs as been set at default
    var alreadyActive = getActiveTabs(this.tabnav);
    if (alreadyActive.length === 0) {
      tab = alreadyActive[0];
    }

    // activate and deactivate tabs
    activateTab(tab, false);
  }

  // add eventlisteners on buttons
  for (var t = 0; t < this.tabs.length; t++) {
    addListeners(this.tabs[t]);
  }
};

// For easy reference


var keys = {
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  delete: 46
};

// Add or substract depending on key pressed
var direction = {
  37: -1,
  38: -1,
  39: 1,
  40: 1
};

function addListeners(tab) {
  tab.addEventListener('click', clickEventListener);
  tab.addEventListener('keydown', keydownEventListener);
  tab.addEventListener('keyup', keyupEventListener);
}

// When a tab is clicked, activateTab is fired to activate it
function clickEventListener(event) {
  var tab = this;
  activateTab(tab, false);
}

// Handle keydown on tabs
function keydownEventListener(event) {
  var key = event.keyCode;

  switch (key) {
    case keys.end:
      event.preventDefault();
      // Activate last tab
      focusLastTab(event.target);
      break;
    case keys.home:
      event.preventDefault();
      // Activate first tab
      focusFirstTab(event.target);
      break;
    // Up and down are in keydown
    // because we need to prevent page scroll >:)
    case keys.up:
    case keys.down:
      determineOrientation(event);
      break;
  }
}

// Handle keyup on tabs
function keyupEventListener(event) {
  var key = event.keyCode;

  switch (key) {
    case keys.left:
    case keys.right:
      determineOrientation(event);
      break;
    case keys.delete:
      break;
    case keys.enter:
    case keys.space:
      activateTab(event.target, true);
      break;
  }
}

// When a tablist aria-orientation is set to vertical,
// only up and down arrow should function.
// In all other cases only left and right arrow function.
function determineOrientation(event) {
  var key = event.keyCode;

  var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;

  var vertical = x < breakpoints.md;
  var proceed = false;

  if (vertical) {
    if (key === keys.up || key === keys.down) {
      event.preventDefault();
      proceed = true;
    }
  } else {
    if (key === keys.left || key === keys.right) {
      proceed = true;
    }
  }
  if (proceed) {
    switchTabOnArrowPress(event);
  }
}

// Either focus the next, previous, first, or last tab
// depending on key pressed
function switchTabOnArrowPress(event) {
  var pressed = event.keyCode;
  if (direction[pressed]) {
    var target = event.target;
    var tabs = getAllTabsInList(target);
    var index = getIndexOfElementInList(target, tabs);
    if (index !== -1) {
      if (tabs[index + direction[pressed]]) {
        tabs[index + direction[pressed]].focus();
      } else if (pressed === keys.left || pressed === keys.up) {
        focusLastTab(target);
      } else if (pressed === keys.right || pressed == keys.down) {
        focusFirstTab(target);
      }
    }
  }
}

/**
 * Get all active tabs in list
 * @param tabnav parent .tabnav element
 * @returns returns list of active tabs if any
 */
function getActiveTabs(tabnav) {
  return tabnav.querySelectorAll('button.tabnav-item[aria-selected=true]');
}

/**
 * Get a list of all button tabs in current tablist
 * @param tab Button tab element
 * @returns {*} return array of tabs
 */
function getAllTabsInList(tab) {
  var parentNode = tab.parentNode;
  if (parentNode.classList.contains('tabnav')) {
    return parentNode.querySelectorAll('button.tabnav-item');
  }
  return [];
}

function getIndexOfElementInList(element, list) {
  var index = -1;
  for (var i = 0; i < list.length; i++) {
    if (list[i] === element) {
      index = i;
      break;
    }
  }

  return index;
}

/**
 * Checks if there is a tab hash in the url and activates the tab accordingly
 * @returns {boolean} returns true if tab has been set - returns false if no tab has been set to active
 */
function setActiveHashTab() {
  var hash = location.hash.replace('#', '');
  if (hash !== '') {
    var tab = document.querySelector('button.tabnav-item[aria-controls="#' + hash + '"]');
    if (tab !== null) {
      activateTab(tab, false);
      return true;
    }
  }
  return false;
}

/***
 * Activate/show tab and hide others
 * @param tab button element
 */
function activateTab(tab, setFocus) {
  deactivateAllTabsExcept(tab);

  var tabpanelID = tab.getAttribute('aria-controls');
  var tabpanel = document.getElementById(tabpanelID);

  tab.setAttribute('aria-selected', 'true');
  tabpanel.setAttribute('aria-hidden', 'false');
  tab.removeAttribute('tabindex');

  // Set focus when required
  if (setFocus) {
    tab.focus();
  }

  outputEvent(tab, 'fds.tabnav.changed');
  outputEvent(tab.parentNode, 'fds.tabnav.open');
}

/**
 * Deactivate all tabs in list except the one passed
 * @param activeTab button tab element
 */
function deactivateAllTabsExcept(activeTab) {
  var tabs = getAllTabsInList(activeTab);

  for (var i = 0; i < tabs.length; i++) {
    var tab = tabs[i];
    if (tab === activeTab) {
      continue;
    }

    if (tab.getAttribute('aria-selected') === 'true') {
      outputEvent(tab, 'fds.tabnav.close');
    }

    tab.setAttribute('tabindex', '-1');
    tab.setAttribute('aria-selected', 'false');
    document.getElementById(tab.getAttribute('aria-controls')).setAttribute('aria-hidden', 'true');
  }
}

/**
 * output an event on the passed element
 * @param element
 * @param eventName
 */
function outputEvent(element, eventName) {
  var event = document.createEvent('Event');
  event.initEvent(eventName, true, true);
  element.dispatchEvent(event);
}

// Make a guess
function focusFirstTab(tab) {
  getAllTabsInList(tab)[0].focus();
}

// Make a guess
function focusLastTab(tab) {
  var tabs = getAllTabsInList(tab);
  tabs[tabs.length - 1].focus();
}

module.exports = Tabnav;

},{}],72:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tooltip = function () {
  function Tooltip(element) {
    _classCallCheck(this, Tooltip);

    this.element = element;
    this.setEvents();
  }

  _createClass(Tooltip, [{
    key: 'setEvents',
    value: function setEvents() {
      var that = this;
      if (this.element.getAttribute('data-tooltip-trigger') !== 'click') {
        this.element.addEventListener('mouseover', function (e) {
          var element = e.target;

          if (element.getAttribute('aria-describedby') !== null) return;
          e.preventDefault();

          var pos = element.getAttribute('data-tooltip-position') || 'top';

          var tooltip = that.createTooltip(element, pos);

          document.body.appendChild(tooltip);

          that.positionAt(element, tooltip, pos);
        });
        this.element.addEventListener('focus', function (e) {
          var element = e.target;

          if (element.getAttribute('aria-describedby') !== null) return;
          e.preventDefault();

          var pos = element.getAttribute('data-tooltip-position') || 'top';

          var tooltip = that.createTooltip(element, pos);

          document.body.appendChild(tooltip);

          that.positionAt(element, tooltip, pos);
        });

        this.element.addEventListener('blur', function (e) {
          var tooltip = this.getAttribute('aria-describedby');
          if (tooltip !== null && document.getElementById(tooltip) !== null) {
            document.body.removeChild(document.getElementById(tooltip));
          }
          this.removeAttribute('aria-describedby');
        });
        this.element.addEventListener('mouseout', function (e) {
          var tooltip = this.getAttribute('aria-describedby');
          if (tooltip !== null && document.getElementById(tooltip) !== null) {
            document.body.removeChild(document.getElementById(tooltip));
          }
          this.removeAttribute('aria-describedby');
        });
      } else {
        this.element.addEventListener('click', function (e) {
          var element = this;
          if (element.getAttribute('aria-describedby') === null) {
            var pos = element.getAttribute('data-tooltip-position') || 'top';
            var tooltip = that.createTooltip(element, pos);
            document.body.appendChild(tooltip);
            that.positionAt(element, tooltip, pos);
          } else {
            var popper = element.getAttribute('aria-describedby');
            document.body.removeChild(document.getElementById(popper));
            element.removeAttribute('aria-describedby');
          }
        });
      }

      document.getElementsByTagName('body')[0].addEventListener('click', function (event) {
        if (!event.target.classList.contains('js-tooltip')) {
          that.closeAll();
        }
      });
    }
  }, {
    key: 'closeAll',
    value: function closeAll() {
      var elements = document.querySelectorAll('.js-tooltip[aria-describedby]');
      for (var i = 0; i < elements.length; i++) {
        var popper = elements[i].getAttribute('aria-describedby');
        elements[i].removeAttribute('aria-describedby');
        document.body.removeChild(document.getElementById(popper));
      }
    }
  }, {
    key: 'createTooltip',
    value: function createTooltip(element, pos) {
      var tooltip = document.createElement('div');
      tooltip.className = 'tooltip-popper';
      var poppers = document.getElementsByClassName('tooltip-popper');
      var id = 'tooltip-' + poppers.length + 1;
      tooltip.setAttribute('id', id);
      tooltip.setAttribute('role', 'tooltip');
      tooltip.setAttribute('x-placement', pos);
      element.setAttribute('aria-describedby', id);

      var tooltipInner = document.createElement('div');
      tooltipInner.className = 'tooltip';

      var tooltipContent = document.createElement('div');
      tooltipContent.className = 'tooltip-content';
      tooltipContent.innerHTML = element.getAttribute('data-tooltip');
      tooltipInner.appendChild(tooltipContent);
      tooltip.appendChild(tooltipInner);

      return tooltip;
    }

    /**
     * Positions the tooltip.
     *
     * @param {object} parent - The trigger of the tooltip.
     * @param {object} tooltip - The tooltip itself.
     * @param {string} posHorizontal - Desired horizontal position of the tooltip relatively to the trigger (left/center/right)
     * @param {string} posVertical - Desired vertical position of the tooltip relatively to the trigger (top/center/bottom)
     *
     */

  }, {
    key: 'positionAt',
    value: function positionAt(parent, tooltip, pos) {
      var parentCoords = parent.getBoundingClientRect(),
          left,
          top;
      var tooltipWidth = tooltip.offsetWidth;

      var dist = 8;

      left = parseInt(parentCoords.left) + (parent.offsetWidth - tooltip.offsetWidth) / 2;

      switch (pos) {
        case 'bottom':
          top = parseInt(parentCoords.bottom) + dist;
          break;

        default:
        case 'top':
          top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
      }

      if (left < 0) {
        left = parseInt(parentCoords.left);
      }

      if (top + tooltip.offsetHeight >= window.innerHeight) {
        top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
      }

      top = top < 0 ? parseInt(parentCoords.bottom) + dist : top;
      if (window.innerWidth < left + tooltipWidth) {
        tooltip.style.right = dist + 'px';
      } else {
        tooltip.style.left = left + 'px';
      }
      tooltip.style.top = top + pageYOffset + 'px';
    }
  }]);

  return Tooltip;
}();

module.exports = Tooltip;

},{}],73:[function(require,module,exports){
'use strict';

var _details = require('./components/details');

var _details2 = _interopRequireDefault(_details);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Collapse = require('./components/collapse');
var RadioToggleGroup = require('./components/radio-toggle-content');
var CheckboxToggleContent = require('./components/checkbox-toggle-content');
var Dropdown = require('./components/dropdown');
var Accordion = require('./components/accordion');
var ResponsiveTable = require('./components/table');
var Tabnav = require('./components/tabnav');
//const Details = require('./components/details');
var Tooltip = require('./components/tooltip');
var SetTabIndex = require('./components/skipnav');
var Navigation = require('./components/navigation');
var InputRegexMask = require('./components/regex-input-mask');

/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require('./polyfills');

var init = function init() {

  new Navigation();

  var details = document.querySelectorAll('.js-details');
  for (var d = 0; d < details.length; d++) {
    new _details2.default(details[d]).init();
  }

  var jsSelectorRegex = document.querySelectorAll('input[data-input-regex]');
  for (var c = 0; c < jsSelectorRegex.length; c++) {
    new InputRegexMask(jsSelectorRegex[c]);
  }
  var jsSelectorTabindex = document.querySelectorAll('.skipnav[href^="#"]');
  for (var _c = 0; _c < jsSelectorTabindex.length; _c++) {
    new SetTabIndex(jsSelectorTabindex[_c]);
  }
  var jsSelectorTooltip = document.getElementsByClassName('js-tooltip');
  for (var _c2 = 0; _c2 < jsSelectorTooltip.length; _c2++) {
    new Tooltip(jsSelectorTooltip[_c2]);
  }
  var jsSelectorTabnav = document.getElementsByClassName('tabnav');
  for (var _c3 = 0; _c3 < jsSelectorTabnav.length; _c3++) {
    new Tabnav(jsSelectorTabnav[_c3]);
  }

  var jsSelectorAccordion = document.getElementsByClassName('accordion');
  for (var _c4 = 0; _c4 < jsSelectorAccordion.length; _c4++) {
    new Accordion(jsSelectorAccordion[_c4]);
  }
  var jsSelectorAccordionBordered = document.querySelectorAll('.accordion-bordered:not(.accordion)');
  for (var _c5 = 0; _c5 < jsSelectorAccordionBordered.length; _c5++) {
    new Accordion(jsSelectorAccordionBordered[_c5]);
  }

  var jsSelectorTable = document.querySelectorAll('table:not(.dataTable)');
  for (var _c6 = 0; _c6 < jsSelectorTable.length; _c6++) {
    new ResponsiveTable(jsSelectorTable[_c6]);
  }

  var jsSelectorCollapse = document.getElementsByClassName('js-collapse');
  for (var _c7 = 0; _c7 < jsSelectorCollapse.length; _c7++) {
    new Collapse(jsSelectorCollapse[_c7]);
  }

  var jsSelectorRadioCollapse = document.getElementsByClassName('js-radio-toggle-group');
  for (var _c8 = 0; _c8 < jsSelectorRadioCollapse.length; _c8++) {
    new RadioToggleGroup(jsSelectorRadioCollapse[_c8]);
  }

  var jsSelectorCheckboxCollapse = document.getElementsByClassName('js-checkbox-toggle-content');
  for (var _c9 = 0; _c9 < jsSelectorCheckboxCollapse.length; _c9++) {
    new CheckboxToggleContent(jsSelectorCheckboxCollapse[_c9]);
  }

  var jsSelectorDropdown = document.getElementsByClassName('js-dropdown');
  for (var _c10 = 0; _c10 < jsSelectorDropdown.length; _c10++) {
    new Dropdown(jsSelectorDropdown[_c10]);
  }
};

module.exports = { init: init, Collapse: Collapse, RadioToggleGroup: RadioToggleGroup, CheckboxToggleContent: CheckboxToggleContent, Dropdown: Dropdown, ResponsiveTable: ResponsiveTable, Accordion: Accordion, Tabnav: Tabnav, Tooltip: Tooltip, SetTabIndex: SetTabIndex, Navigation: Navigation, InputRegexMask: InputRegexMask };

},{"./components/accordion":61,"./components/checkbox-toggle-content":62,"./components/collapse":63,"./components/details":64,"./components/dropdown":65,"./components/navigation":66,"./components/radio-toggle-content":67,"./components/regex-input-mask":68,"./components/skipnav":69,"./components/table":70,"./components/tabnav":71,"./components/tooltip":72,"./polyfills":75}],74:[function(require,module,exports){
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

},{}],75:[function(require,module,exports){
'use strict';
// polyfills HTMLElement.prototype.classList and DOMTokenList

require('classlist-polyfill');
// polyfills HTMLElement.prototype.hidden
require('./element-hidden');

require('core-js/fn/object/assign');
require('core-js/fn/array/from');

},{"./element-hidden":74,"classlist-polyfill":2,"core-js/fn/array/from":3,"core-js/fn/object/assign":4}],76:[function(require,module,exports){
'use strict';

var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};

module.exports = breakpoints;

},{}],77:[function(require,module,exports){
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

},{}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateUniqueID = generateUniqueID;
// Used to generate a unique string, allows multiple instances of the component without
// Them conflicting with each other.
// https://stackoverflow.com/a/8809472
function generateUniqueID() {
  var d = new Date().getTime();
  if (typeof window.performance !== 'undefined' && typeof window.performance.now === 'function') {
    d += window.performance.now(); // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
}

},{}],79:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;

  var rect = el.getBoundingClientRect();

  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}

module.exports = isElementInViewport;

},{}],80:[function(require,module,exports){
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

},{}],81:[function(require,module,exports){
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

},{}]},{},[73])(73)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9vbmNlL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWNjb3JkaW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jb2xsYXBzZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RldGFpbHMuanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi5qcyIsInNyYy9qcy9jb21wb25lbnRzL25hdmlnYXRpb24uanMiLCJzcmMvanMvY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JlZ2V4LWlucHV0LW1hc2suanMiLCJzcmMvanMvY29tcG9uZW50cy9za2lwbmF2LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJuYXYuanMiLCJzcmMvanMvY29tcG9uZW50cy90b29sdGlwLmpzIiwic3JjL2pzL2RrZmRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9lbGVtZW50LWhpZGRlbi5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvaW5kZXguanMiLCJzcmMvanMvdXRpbHMvYnJlYWtwb2ludHMuanMiLCJzcmMvanMvdXRpbHMvY2xvc2VzdC5qcyIsInNyYy9qcy91dGlscy9nZW5lcmF0ZS11bmlxdWUtaWQuanMiLCJzcmMvanMvdXRpbHMvaXMtaW4tdmlld3BvcnQuanMiLCJzcmMvanMvdXRpbHMvc2VsZWN0LmpzIiwic3JjL2pzL3V0aWxzL3RvZ2dsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7Ozs7Ozs7OztBQVdBOztBQUVBLE9BQU8sT0FBUCxHQUFpQixTQUFTLE9BQVQsQ0FBa0IsR0FBbEIsRUFBdUIsUUFBdkIsRUFBaUMsT0FBakMsRUFBMEM7QUFDdkQs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QUF6QixDQUFsQjtBQUNBLFNBQU8sTUFBTSxTQUFOLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQTJCLFNBQTNCLENBQVA7QUFDRCxDQVpEOzs7QUNwQkE7O0FBQ0EsSUFBTSxXQUFXLGVBQWpCO0FBQ0EsSUFBTSxXQUFXLGVBQWpCO0FBQ0EsSUFBTSxTQUFTLGFBQWY7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFVBQUMsTUFBRCxFQUFTLFFBQVQsRUFBc0I7O0FBRXJDLE1BQUksT0FBTyxRQUFQLEtBQW9CLFNBQXhCLEVBQW1DO0FBQ2pDLGVBQVcsT0FBTyxZQUFQLENBQW9CLFFBQXBCLE1BQWtDLE9BQTdDO0FBQ0Q7QUFDRCxTQUFPLFlBQVAsQ0FBb0IsUUFBcEIsRUFBOEIsUUFBOUI7QUFDQSxNQUFNLEtBQUssT0FBTyxZQUFQLENBQW9CLFFBQXBCLENBQVg7QUFDQSxNQUFNLFdBQVcsU0FBUyxjQUFULENBQXdCLEVBQXhCLENBQWpCO0FBQ0EsTUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNiLFVBQU0sSUFBSSxLQUFKLENBQ0osc0NBQXNDLEVBQXRDLEdBQTJDLEdBRHZDLENBQU47QUFHRDs7QUFFRCxXQUFTLFlBQVQsQ0FBc0IsTUFBdEIsRUFBOEIsQ0FBQyxRQUEvQjtBQUNBLFNBQU8sUUFBUDtBQUNELENBaEJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBhcnJheS1mb3JlYWNoXG4gKiAgIEFycmF5I2ZvckVhY2ggcG9ueWZpbGwgZm9yIG9sZGVyIGJyb3dzZXJzXG4gKiAgIChQb255ZmlsbDogQSBwb2x5ZmlsbCB0aGF0IGRvZXNuJ3Qgb3ZlcndyaXRlIHRoZSBuYXRpdmUgbWV0aG9kKVxuICogXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHdhZGEvYXJyYXktZm9yZWFjaFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNS0yMDE2IFRha3V0byBXYWRhXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoL2Jsb2IvbWFzdGVyL01JVC1MSUNFTlNFXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JFYWNoIChhcnksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgaWYgKGFyeS5mb3JFYWNoKSB7XG4gICAgICAgIGFyeS5mb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyeS5sZW5ndGg7IGkrPTEpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBhcnlbaV0sIGksIGFyeSk7XG4gICAgfVxufTtcbiIsIi8qXG4gKiBjbGFzc0xpc3QuanM6IENyb3NzLWJyb3dzZXIgZnVsbCBlbGVtZW50LmNsYXNzTGlzdCBpbXBsZW1lbnRhdGlvbi5cbiAqIDEuMS4yMDE3MDQyN1xuICpcbiAqIEJ5IEVsaSBHcmV5LCBodHRwOi8vZWxpZ3JleS5jb21cbiAqIExpY2Vuc2U6IERlZGljYXRlZCB0byB0aGUgcHVibGljIGRvbWFpbi5cbiAqICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4gKi9cblxuLypnbG9iYWwgc2VsZiwgZG9jdW1lbnQsIERPTUV4Y2VwdGlvbiAqL1xuXG4vKiEgQHNvdXJjZSBodHRwOi8vcHVybC5lbGlncmV5LmNvbS9naXRodWIvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL2NsYXNzTGlzdC5qcyAqL1xuXG5pZiAoXCJkb2N1bWVudFwiIGluIHdpbmRvdy5zZWxmKSB7XG5cbi8vIEZ1bGwgcG9seWZpbGwgZm9yIGJyb3dzZXJzIHdpdGggbm8gY2xhc3NMaXN0IHN1cHBvcnRcbi8vIEluY2x1ZGluZyBJRSA8IEVkZ2UgbWlzc2luZyBTVkdFbGVtZW50LmNsYXNzTGlzdFxuaWYgKCEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKSkgXG5cdHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJiAhKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIikpKSB7XG5cbihmdW5jdGlvbiAodmlldykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaWYgKCEoJ0VsZW1lbnQnIGluIHZpZXcpKSByZXR1cm47XG5cbnZhclxuXHQgIGNsYXNzTGlzdFByb3AgPSBcImNsYXNzTGlzdFwiXG5cdCwgcHJvdG9Qcm9wID0gXCJwcm90b3R5cGVcIlxuXHQsIGVsZW1DdHJQcm90byA9IHZpZXcuRWxlbWVudFtwcm90b1Byb3BdXG5cdCwgb2JqQ3RyID0gT2JqZWN0XG5cdCwgc3RyVHJpbSA9IFN0cmluZ1twcm90b1Byb3BdLnRyaW0gfHwgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpO1xuXHR9XG5cdCwgYXJySW5kZXhPZiA9IEFycmF5W3Byb3RvUHJvcF0uaW5kZXhPZiB8fCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdHZhclxuXHRcdFx0ICBpID0gMFxuXHRcdFx0LCBsZW4gPSB0aGlzLmxlbmd0aFxuXHRcdDtcblx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fVxuXHQvLyBWZW5kb3JzOiBwbGVhc2UgYWxsb3cgY29udGVudCBjb2RlIHRvIGluc3RhbnRpYXRlIERPTUV4Y2VwdGlvbnNcblx0LCBET01FeCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XG5cdFx0dGhpcy5uYW1lID0gdHlwZTtcblx0XHR0aGlzLmNvZGUgPSBET01FeGNlcHRpb25bdHlwZV07XG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0fVxuXHQsIGNoZWNrVG9rZW5BbmRHZXRJbmRleCA9IGZ1bmN0aW9uIChjbGFzc0xpc3QsIHRva2VuKSB7XG5cdFx0aWYgKHRva2VuID09PSBcIlwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdCAgXCJTWU5UQVhfRVJSXCJcblx0XHRcdFx0LCBcIkFuIGludmFsaWQgb3IgaWxsZWdhbCBzdHJpbmcgd2FzIHNwZWNpZmllZFwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRpZiAoL1xccy8udGVzdCh0b2tlbikpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIklOVkFMSURfQ0hBUkFDVEVSX0VSUlwiXG5cdFx0XHRcdCwgXCJTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXJcIlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGFyckluZGV4T2YuY2FsbChjbGFzc0xpc3QsIHRva2VuKTtcblx0fVxuXHQsIENsYXNzTGlzdCA9IGZ1bmN0aW9uIChlbGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIHRyaW1tZWRDbGFzc2VzID0gc3RyVHJpbS5jYWxsKGVsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIilcblx0XHRcdCwgY2xhc3NlcyA9IHRyaW1tZWRDbGFzc2VzID8gdHJpbW1lZENsYXNzZXMuc3BsaXQoL1xccysvKSA6IFtdXG5cdFx0XHQsIGkgPSAwXG5cdFx0XHQsIGxlbiA9IGNsYXNzZXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdHRoaXMucHVzaChjbGFzc2VzW2ldKTtcblx0XHR9XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLnRvU3RyaW5nKCkpO1xuXHRcdH07XG5cdH1cblx0LCBjbGFzc0xpc3RQcm90byA9IENsYXNzTGlzdFtwcm90b1Byb3BdID0gW11cblx0LCBjbGFzc0xpc3RHZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5ldyBDbGFzc0xpc3QodGhpcyk7XG5cdH1cbjtcbi8vIE1vc3QgRE9NRXhjZXB0aW9uIGltcGxlbWVudGF0aW9ucyBkb24ndCBhbGxvdyBjYWxsaW5nIERPTUV4Y2VwdGlvbidzIHRvU3RyaW5nKClcbi8vIG9uIG5vbi1ET01FeGNlcHRpb25zLiBFcnJvcidzIHRvU3RyaW5nKCkgaXMgc3VmZmljaWVudCBoZXJlLlxuRE9NRXhbcHJvdG9Qcm9wXSA9IEVycm9yW3Byb3RvUHJvcF07XG5jbGFzc0xpc3RQcm90by5pdGVtID0gZnVuY3Rpb24gKGkpIHtcblx0cmV0dXJuIHRoaXNbaV0gfHwgbnVsbDtcbn07XG5jbGFzc0xpc3RQcm90by5jb250YWlucyA9IGZ1bmN0aW9uICh0b2tlbikge1xuXHR0b2tlbiArPSBcIlwiO1xuXHRyZXR1cm4gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSAhPT0gLTE7XG59O1xuY2xhc3NMaXN0UHJvdG8uYWRkID0gZnVuY3Rpb24gKCkge1xuXHR2YXJcblx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdCwgaSA9IDBcblx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0LCB0b2tlblxuXHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpZiAoY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMucHVzaCh0b2tlbik7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0XHQsIGluZGV4XG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0d2hpbGUgKGluZGV4ICE9PSAtMSkge1xuXHRcdFx0dGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0fVxuXHR9XG5cdHdoaWxlICgrK2kgPCBsKTtcblxuXHRpZiAodXBkYXRlZCkge1xuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9nZ2xlID0gZnVuY3Rpb24gKHRva2VuLCBmb3JjZSkge1xuXHR0b2tlbiArPSBcIlwiO1xuXG5cdHZhclxuXHRcdCAgcmVzdWx0ID0gdGhpcy5jb250YWlucyh0b2tlbilcblx0XHQsIG1ldGhvZCA9IHJlc3VsdCA/XG5cdFx0XHRmb3JjZSAhPT0gdHJ1ZSAmJiBcInJlbW92ZVwiXG5cdFx0OlxuXHRcdFx0Zm9yY2UgIT09IGZhbHNlICYmIFwiYWRkXCJcblx0O1xuXG5cdGlmIChtZXRob2QpIHtcblx0XHR0aGlzW21ldGhvZF0odG9rZW4pO1xuXHR9XG5cblx0aWYgKGZvcmNlID09PSB0cnVlIHx8IGZvcmNlID09PSBmYWxzZSkge1xuXHRcdHJldHVybiBmb3JjZTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gIXJlc3VsdDtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5qb2luKFwiIFwiKTtcbn07XG5cbmlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcblx0dmFyIGNsYXNzTGlzdFByb3BEZXNjID0ge1xuXHRcdCAgZ2V0OiBjbGFzc0xpc3RHZXR0ZXJcblx0XHQsIGVudW1lcmFibGU6IHRydWVcblx0XHQsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHR9O1xuXHR0cnkge1xuXHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0fSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXG5cdFx0Ly8gYWRkaW5nIHVuZGVmaW5lZCB0byBmaWdodCB0aGlzIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9pc3N1ZXMvMzZcblx0XHQvLyBtb2Rlcm5pZSBJRTgtTVNXNyBtYWNoaW5lIGhhcyBJRTggOC4wLjYwMDEuMTg3MDIgYW5kIGlzIGFmZmVjdGVkXG5cdFx0aWYgKGV4Lm51bWJlciA9PT0gdW5kZWZpbmVkIHx8IGV4Lm51bWJlciA9PT0gLTB4N0ZGNUVDNTQpIHtcblx0XHRcdGNsYXNzTGlzdFByb3BEZXNjLmVudW1lcmFibGUgPSBmYWxzZTtcblx0XHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0XHR9XG5cdH1cbn0gZWxzZSBpZiAob2JqQ3RyW3Byb3RvUHJvcF0uX19kZWZpbmVHZXR0ZXJfXykge1xuXHRlbGVtQ3RyUHJvdG8uX19kZWZpbmVHZXR0ZXJfXyhjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RHZXR0ZXIpO1xufVxuXG59KHdpbmRvdy5zZWxmKSk7XG5cbn1cblxuLy8gVGhlcmUgaXMgZnVsbCBvciBwYXJ0aWFsIG5hdGl2ZSBjbGFzc0xpc3Qgc3VwcG9ydCwgc28ganVzdCBjaGVjayBpZiB3ZSBuZWVkXG4vLyB0byBub3JtYWxpemUgdGhlIGFkZC9yZW1vdmUgYW5kIHRvZ2dsZSBBUElzLlxuXG4oZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtcblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYzFcIiwgXCJjMlwiKTtcblxuXHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAvMTEgYW5kIEZpcmVmb3ggPDI2LCB3aGVyZSBjbGFzc0xpc3QuYWRkIGFuZFxuXHQvLyBjbGFzc0xpc3QucmVtb3ZlIGV4aXN0IGJ1dCBzdXBwb3J0IG9ubHkgb25lIGFyZ3VtZW50IGF0IGEgdGltZS5cblx0aWYgKCF0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjMlwiKSkge1xuXHRcdHZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QpIHtcblx0XHRcdHZhciBvcmlnaW5hbCA9IERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXTtcblxuXHRcdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odG9rZW4pIHtcblx0XHRcdFx0dmFyIGksIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0dG9rZW4gPSBhcmd1bWVudHNbaV07XG5cdFx0XHRcdFx0b3JpZ2luYWwuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblx0XHRjcmVhdGVNZXRob2QoJ2FkZCcpO1xuXHRcdGNyZWF0ZU1ldGhvZCgncmVtb3ZlJyk7XG5cdH1cblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYzNcIiwgZmFsc2UpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMCBhbmQgRmlyZWZveCA8MjQsIHdoZXJlIGNsYXNzTGlzdC50b2dnbGUgZG9lcyBub3Rcblx0Ly8gc3VwcG9ydCB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuXHRpZiAodGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzNcIikpIHtcblx0XHR2YXIgX3RvZ2dsZSA9IERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlO1xuXG5cdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbih0b2tlbiwgZm9yY2UpIHtcblx0XHRcdGlmICgxIGluIGFyZ3VtZW50cyAmJiAhdGhpcy5jb250YWlucyh0b2tlbikgPT09ICFmb3JjZSkge1xuXHRcdFx0XHRyZXR1cm4gZm9yY2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gX3RvZ2dsZS5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH1cblxuXHR0ZXN0RWxlbWVudCA9IG51bGw7XG59KCkpO1xuXG59XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LmFycmF5LmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLkFycmF5LmZyb207XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3QuYXNzaWduO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pIHtcbiAgICAgIGlmIChPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBBUkcgPSBjb2YoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi41LjcnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBzb3VyY2UpIHtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkY7XG4gIHZhciBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HO1xuICB2YXIgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuUztcbiAgdmFyIElTX1BST1RPID0gdHlwZSAmICRleHBvcnQuUDtcbiAgdmFyIElTX0JJTkQgPSB0eXBlICYgJGV4cG9ydC5CO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KTtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYgKHRhcmdldCkgcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYgKGV4cG9ydHNba2V5XSAhPSBvdXQpIGhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmIChJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dCkgZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgdHlwZW9mIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXSAhPSAnZnVuY3Rpb24nKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciAkYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICB2YXIgQSA9IHt9O1xuICB2YXIgQiA9IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgdmFyIFMgPSBTeW1ib2woKTtcbiAgdmFyIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAoaykgeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCA9IHRvT2JqZWN0KHRhcmdldCk7XG4gIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgd2hpbGUgKGFMZW4gPiBpbmRleCkge1xuICAgIHZhciBTID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHZhciBrZXlzID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGopIGlmIChpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKSBUW2tleV0gPSBTW2tleV07XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBTUkMgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciAkdG9TdHJpbmcgPSBGdW5jdGlvbltUT19TVFJJTkddO1xudmFyIFRQTCA9ICgnJyArICR0b1N0cmluZykuc3BsaXQoVE9fU1RSSU5HKTtcblxucmVxdWlyZSgnLi9fY29yZScpLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuICR0b1N0cmluZy5jYWxsKGl0KTtcbn07XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBrZXksIHZhbCwgc2FmZSkge1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJztcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsICduYW1lJykgfHwgaGlkZSh2YWwsICduYW1lJywga2V5KTtcbiAgaWYgKE9ba2V5XSA9PT0gdmFsKSByZXR1cm47XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCBTUkMpIHx8IGhpZGUodmFsLCBTUkMsIE9ba2V5XSA/ICcnICsgT1trZXldIDogVFBMLmpvaW4oU3RyaW5nKGtleSkpKTtcbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIGlmICghc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH0gZWxzZSBpZiAoT1trZXldKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2Uge1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgJiYgdGhpc1tTUkNdIHx8ICR0b1N0cmluZy5jYWxsKHRoaXMpO1xufSk7XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiBjb3JlLnZlcnNpb24sXG4gIG1vZGU6IHJlcXVpcmUoJy4vX2xpYnJhcnknKSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDE4IERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJ2YXIgc3RvcmUgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sO1xudmFyIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSAvKiAsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkICovKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdChhcnJheUxpa2UpO1xuICAgIHZhciBDID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheTtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG1hcGZuID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihPKTtcbiAgICB2YXIgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmIChtYXBwaW5nKSBtYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmIChpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSkge1xuICAgICAgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQygpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IgKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7IGFzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9uY2UobGlzdGVuZXIsIG9wdGlvbnMpIHtcbiAgdmFyIHdyYXBwZWQgPSBmdW5jdGlvbiB3cmFwcGVkT25jZShlKSB7XG4gICAgZS5jdXJyZW50VGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZS50eXBlLCB3cmFwcGVkLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbGlzdGVuZXIuY2FsbCh0aGlzLCBlKTtcbiAgfTtcbiAgcmV0dXJuIHdyYXBwZWQ7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IHRvZ2dsZSA9IHJlcXVpcmUoJy4uL3V0aWxzL3RvZ2dsZScpO1xyXG5jb25zdCBpc0VsZW1lbnRJblZpZXdwb3J0ID0gcmVxdWlyZSgnLi4vdXRpbHMvaXMtaW4tdmlld3BvcnQnKTtcclxuY29uc3QgQlVUVE9OID0gYC5hY2NvcmRpb24tYnV0dG9uW2FyaWEtY29udHJvbHNdYDtcclxuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XHJcbmNvbnN0IE1VTFRJU0VMRUNUQUJMRSA9ICdhcmlhLW11bHRpc2VsZWN0YWJsZSc7XHJcbmNvbnN0IE1VTFRJU0VMRUNUQUJMRV9DTEFTUyA9ICdhY2NvcmRpb24tbXVsdGlzZWxlY3RhYmxlJztcclxuXHJcbmNsYXNzIEFjY29yZGlvbntcclxuICBjb25zdHJ1Y3RvciAoYWNjb3JkaW9uKXtcclxuICAgIHRoaXMuYWNjb3JkaW9uID0gYWNjb3JkaW9uO1xyXG4gICAgdGhpcy5idXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxuICAgIHRoaXMuZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgdGhpcy5ldmVudENsb3NlLmluaXRFdmVudCgnZmRzLmFjY29yZGlvbi5jbG9zZScsIHRydWUsIHRydWUpO1xyXG4gICAgdGhpcy5ldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgIHRoaXMuZXZlbnRPcGVuLmluaXRFdmVudCgnZmRzLmFjY29yZGlvbi5vcGVuJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICB0aGlzLmluaXQoKTtcclxuICB9XHJcblxyXG4gIGluaXQgKCl7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIGxldCBjdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zW2ldO1xyXG5cclxuICAgICAgbGV0IGV4cGFuZGVkID0gY3VycmVudEJ1dHRvbi5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSAndHJ1ZSc7XHJcbiAgICAgIHRvZ2dsZUJ1dHRvbihjdXJyZW50QnV0dG9uLCBleHBhbmRlZCk7XHJcblxyXG4gICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgY3VycmVudEJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoYXQuZXZlbnRPbkNsaWNrLCBmYWxzZSk7XHJcbiAgICAgIGN1cnJlbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGF0LmV2ZW50T25DbGljaywgZmFsc2UpO1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBldmVudE9uQ2xpY2sgKGV2ZW50KXtcclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgbGV0IGJ1dHRvbiA9IHRoaXM7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdG9nZ2xlQnV0dG9uKGJ1dHRvbik7XHJcbiAgICBpZiAoYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJykge1xyXG4gICAgICAvLyBXZSB3ZXJlIGp1c3QgZXhwYW5kZWQsIGJ1dCBpZiBhbm90aGVyIGFjY29yZGlvbiB3YXMgYWxzbyBqdXN0XHJcbiAgICAgIC8vIGNvbGxhcHNlZCwgd2UgbWF5IG5vIGxvbmdlciBiZSBpbiB0aGUgdmlld3BvcnQuIFRoaXMgZW5zdXJlc1xyXG4gICAgICAvLyB0aGF0IHdlIGFyZSBzdGlsbCB2aXNpYmxlLCBzbyB0aGUgdXNlciBpc24ndCBjb25mdXNlZC5cclxuICAgICAgaWYgKCFpc0VsZW1lbnRJblZpZXdwb3J0KGJ1dHRvbikpIGJ1dHRvbi5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIFRvZ2dsZSBhIGJ1dHRvbidzIFwicHJlc3NlZFwiIHN0YXRlLCBvcHRpb25hbGx5IHByb3ZpZGluZyBhIHRhcmdldFxyXG4gICAqIHN0YXRlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXHJcbiAgICogQHBhcmFtIHtib29sZWFuP30gZXhwYW5kZWQgSWYgbm8gc3RhdGUgaXMgcHJvdmlkZWQsIHRoZSBjdXJyZW50XHJcbiAgICogc3RhdGUgd2lsbCBiZSB0b2dnbGVkIChmcm9tIGZhbHNlIHRvIHRydWUsIGFuZCB2aWNlLXZlcnNhKS5cclxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0aGUgcmVzdWx0aW5nIHN0YXRlXHJcbiAgICovXHJcbn1cclxuXHJcbnZhciB0b2dnbGVCdXR0b24gID0gZnVuY3Rpb24gKGJ1dHRvbiwgZXhwYW5kZWQpIHtcclxuICBsZXQgYWNjb3JkaW9uID0gbnVsbDtcclxuICBpZihidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uJykpe1xyXG4gICAgYWNjb3JkaW9uID0gYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICB9XHJcblxyXG4gIGxldCBldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgZXZlbnRDbG9zZS5pbml0RXZlbnQoJ2Zkcy5hY2NvcmRpb24uY2xvc2UnLCB0cnVlLCB0cnVlKTtcclxuICBsZXQgZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgZXZlbnRPcGVuLmluaXRFdmVudCgnZmRzLmFjY29yZGlvbi5vcGVuJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgZXhwYW5kZWQgPSB0b2dnbGUoYnV0dG9uLCBleHBhbmRlZCk7XHJcblxyXG4gIGlmKGV4cGFuZGVkKXtcclxuICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgfSBlbHNle1xyXG4gICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgfVxyXG5cclxuICAvLyBYWFggbXVsdGlzZWxlY3RhYmxlIGlzIG9wdC1pbiwgdG8gcHJlc2VydmUgbGVnYWN5IGJlaGF2aW9yXHJcbiAgbGV0IG11bHRpc2VsZWN0YWJsZSA9IGZhbHNlO1xyXG4gIGlmKGFjY29yZGlvbiAhPT0gbnVsbCAmJiAoYWNjb3JkaW9uLmdldEF0dHJpYnV0ZShNVUxUSVNFTEVDVEFCTEUpID09PSAndHJ1ZScgfHwgYWNjb3JkaW9uLmNsYXNzTGlzdC5jb250YWlucyhNVUxUSVNFTEVDVEFCTEVfQ0xBU1MpKSl7XHJcbiAgICBtdWx0aXNlbGVjdGFibGUgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKGV4cGFuZGVkICYmICFtdWx0aXNlbGVjdGFibGUpIHtcclxuICAgIGxldCBidXR0b25zID0gWyBidXR0b24gXTtcclxuICAgIGlmKGFjY29yZGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICBidXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBjdXJyZW50QnV0dHRvbiA9IGJ1dHRvbnNbaV07XHJcbiAgICAgIGlmIChjdXJyZW50QnV0dHRvbiAhPT0gYnV0dG9uKSB7XHJcbiAgICAgICAgdG9nZ2xlKGN1cnJlbnRCdXR0dG9uLCBmYWxzZSk7XHJcbiAgICAgICAgY3VycmVudEJ1dHR0b24uZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFjY29yZGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jbGFzcyBDaGVja2JveFRvZ2dsZUNvbnRlbnR7XHJcbiAgICBjb25zdHJ1Y3RvcihlbCl7XHJcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRyaWdnZXIgPSAnLmpzLWNoZWNrYm94LXRvZ2dsZS1jb250ZW50JztcclxuICAgICAgICB0aGlzLmpzVG9nZ2xlVGFyZ2V0ID0gJ2RhdGEtanMtdGFyZ2V0JztcclxuICAgICAgICB0aGlzLmV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgICAgICB0aGlzLmV2ZW50Q2xvc2UuaW5pdEV2ZW50KCdmZHMuY29sbGFwc2UuY2xvc2UnLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICB0aGlzLmV2ZW50T3BlbiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRPcGVuLmluaXRFdmVudCgnZmRzLmNvbGxhcHNlLm9wZW4nLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICB0aGlzLnRhcmdldEVsID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNoZWNrYm94RWwgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmluaXQoZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoZWwpe1xyXG4gICAgICAgIHRoaXMuY2hlY2tib3hFbCA9IGVsO1xyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLmNoZWNrYm94RWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJyxmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgICAgIHRoYXQudG9nZ2xlKHRoYXQuY2hlY2tib3hFbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50b2dnbGUodGhpcy5jaGVja2JveEVsKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGUodHJpZ2dlckVsKXtcclxuICAgICAgICB2YXIgdGFyZ2V0QXR0ciA9IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUodGhpcy5qc1RvZ2dsZVRhcmdldClcclxuICAgICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0QXR0cik7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYodHJpZ2dlckVsLmNoZWNrZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcclxuICAgICAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50T3Blbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCl7XHJcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudENsb3NlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2hlY2tib3hUb2dnbGVDb250ZW50O1xyXG4iLCIvKipcclxuICogQ29sbGFwc2UvZXhwYW5kLlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0J1xyXG5cclxuY2xhc3MgQ29sbGFwc2Uge1xyXG4gIGNvbnN0cnVjdG9yIChlbGVtZW50LCBhY3Rpb24gPSAndG9nZ2xlJyl7XHJcbiAgICB0aGlzLmpzQ29sbGFwc2VUYXJnZXQgPSAnZGF0YS1qcy10YXJnZXQnO1xyXG4gICAgdGhpcy50cmlnZ2VyRWwgPSBlbGVtZW50O1xyXG4gICAgdGhpcy50YXJnZXRFbDtcclxuICAgIHRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcclxuICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgdGhpcy5ldmVudENsb3NlLmluaXRFdmVudCgnZmRzLmNvbGxhcHNlLmNsb3NlJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICB0aGlzLmV2ZW50T3BlbiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgdGhpcy5ldmVudE9wZW4uaW5pdEV2ZW50KCdmZHMuY29sbGFwc2Uub3BlbicsIHRydWUsIHRydWUpO1xyXG4gICAgdGhpcy50cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKXtcclxuICAgICAgdGhhdC50b2dnbGUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlQ29sbGFwc2UgKGZvcmNlQ2xvc2UpIHtcclxuICAgIGxldCB0YXJnZXRBdHRyID0gdGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNDb2xsYXBzZVRhcmdldCk7XHJcbiAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHRoaXMudGFyZ2V0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldEF0dHIpO1xyXG4gICAgICBpZih0aGlzLnRhcmdldEVsICE9PSBudWxsICYmIHRoaXMudGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgLy9jaGFuZ2Ugc3RhdGVcclxuICAgICAgICBpZih0aGlzLnRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnIHx8IHRoaXMudHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSB1bmRlZmluZWQgfHwgZm9yY2VDbG9zZSApe1xyXG4gICAgICAgICAgLy9jbG9zZVxyXG4gICAgICAgICAgdGhpcy5hbmltYXRlQ29sbGFwc2UoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIC8vb3BlblxyXG4gICAgICAgICAgdGhpcy5hbmltYXRlRXhwYW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0b2dnbGUgKCl7XHJcbiAgICBpZih0aGlzLnRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0aGlzLnRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGhpcy50b2dnbGVDb2xsYXBzZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGFuaW1hdGVDb2xsYXBzZSAoKSB7XHJcbiAgICBpZighdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyl7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSB0aGlzLnRhcmdldEVsLmNsaWVudEhlaWdodCsgJ3B4JztcclxuICAgICAgdGhpcy50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZS10cmFuc2l0aW9uLWNvbGxhcHNlJyk7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcclxuICAgICAgICB0aGF0LnRhcmdldEVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcclxuICAgICAgfSwgNSk7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgdGhhdC50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICB0aGF0LnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlLXRyYW5zaXRpb24tY29sbGFwc2UnKTtcclxuXHJcbiAgICAgICAgdGhhdC50cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICB0aGF0LmFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XHJcbiAgICAgICAgdGhhdC50cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGF0LmV2ZW50Q2xvc2UpO1xyXG4gICAgICB9LCAyMDApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYW5pbWF0ZUV4cGFuZCAoKSB7XHJcbiAgICBpZighdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyl7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xyXG4gICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICBsZXQgZXhwYW5kZWRIZWlnaHQgPSB0aGlzLnRhcmdldEVsLmNsaWVudEhlaWdodDtcclxuICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSAnMHB4JztcclxuICAgICAgdGhpcy50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZS10cmFuc2l0aW9uLWV4cGFuZCcpO1xyXG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgdGhhdC50YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSBleHBhbmRlZEhlaWdodCsgJ3B4JztcclxuICAgICAgfSwgNSk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpe1xyXG4gICAgICAgIHRoYXQudGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2UtdHJhbnNpdGlvbi1leHBhbmQnKTtcclxuICAgICAgICB0aGF0LnRhcmdldEVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcclxuXHJcbiAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgdGhhdC50cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgICB0aGF0LmFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XHJcbiAgICAgICAgdGhhdC50cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGF0LmV2ZW50T3Blbik7XHJcbiAgICAgIH0sIDIwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxhcHNlO1xyXG4iLCIvKipcclxuICogSmF2YVNjcmlwdCAncG9seWZpbGwnIGZvciBIVE1MNSdzIDxkZXRhaWxzPiBhbmQgPHN1bW1hcnk+IGVsZW1lbnRzXHJcbiAqIGFuZCAnc2hpbScgdG8gYWRkIGFjY2Vzc2libGl0eSBlbmhhbmNlbWVudHMgZm9yIGFsbCBicm93c2Vyc1xyXG4gKlxyXG4gKiBodHRwOi8vY2FuaXVzZS5jb20vI2ZlYXQ9ZGV0YWlsc1xyXG4gKi9cclxuaW1wb3J0IHsgZ2VuZXJhdGVVbmlxdWVJRCB9IGZyb20gJy4uL3V0aWxzL2dlbmVyYXRlLXVuaXF1ZS1pZC5qcydcclxuXHJcbmNvbnN0IEtFWV9FTlRFUiA9IDEzO1xyXG5jb25zdCBLRVlfU1BBQ0UgPSAzMjtcclxuXHJcbmZ1bmN0aW9uIERldGFpbHMgKCRtb2R1bGUpIHtcclxuICB0aGlzLiRtb2R1bGUgPSAkbW9kdWxlO1xyXG59XHJcblxyXG5EZXRhaWxzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICghdGhpcy4kbW9kdWxlKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGVyZSBpcyBuYXRpdmUgZGV0YWlscyBzdXBwb3J0LCB3ZSB3YW50IHRvIGF2b2lkIHJ1bm5pbmcgY29kZSB0byBwb2x5ZmlsbCBuYXRpdmUgYmVoYXZpb3VyLlxyXG4gIGxldCBoYXNOYXRpdmVEZXRhaWxzID0gdHlwZW9mIHRoaXMuJG1vZHVsZS5vcGVuID09PSAnYm9vbGVhbic7XHJcblxyXG4gIGlmIChoYXNOYXRpdmVEZXRhaWxzKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB0aGlzLnBvbHlmaWxsRGV0YWlscygpO1xyXG59O1xyXG5cclxuRGV0YWlscy5wcm90b3R5cGUucG9seWZpbGxEZXRhaWxzID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCAkbW9kdWxlID0gdGhpcy4kbW9kdWxlO1xyXG5cclxuICAvLyBTYXZlIHNob3J0Y3V0cyB0byB0aGUgaW5uZXIgc3VtbWFyeSBhbmQgY29udGVudCBlbGVtZW50c1xyXG4gIGxldCAkc3VtbWFyeSA9IHRoaXMuJHN1bW1hcnkgPSAkbW9kdWxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdW1tYXJ5JykuaXRlbSgwKTtcclxuICBsZXQgJGNvbnRlbnQgPSB0aGlzLiRjb250ZW50ID0gJG1vZHVsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JykuaXRlbSgwKTtcclxuXHJcbiAgLy8gSWYgPGRldGFpbHM+IGRvZXNuJ3QgaGF2ZSBhIDxzdW1tYXJ5PiBhbmQgYSA8ZGl2PiByZXByZXNlbnRpbmcgdGhlIGNvbnRlbnRcclxuICAvLyBpdCBtZWFucyB0aGUgcmVxdWlyZWQgSFRNTCBzdHJ1Y3R1cmUgaXMgbm90IG1ldCBzbyB0aGUgc2NyaXB0IHdpbGwgc3RvcFxyXG4gIGlmICghJHN1bW1hcnkgfHwgISRjb250ZW50KSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGUgY29udGVudCBkb2Vzbid0IGhhdmUgYW4gSUQsIGFzc2lnbiBpdCBvbmUgbm93XHJcbiAgLy8gd2hpY2ggd2UnbGwgbmVlZCBmb3IgdGhlIHN1bW1hcnkncyBhcmlhLWNvbnRyb2xzIGFzc2lnbm1lbnRcclxuICBpZiAoISRjb250ZW50LmlkKSB7XHJcbiAgICAkY29udGVudC5pZCA9ICdkZXRhaWxzLWNvbnRlbnQtJyArIGdlbmVyYXRlVW5pcXVlSUQoKTtcclxuICB9XHJcblxyXG4gIC8vIEFkZCBBUklBIHJvbGU9XCJncm91cFwiIHRvIGRldGFpbHNcclxuICAkbW9kdWxlLnNldEF0dHJpYnV0ZSgncm9sZScsICdncm91cCcpO1xyXG5cclxuICAvLyBBZGQgcm9sZT1idXR0b24gdG8gc3VtbWFyeVxyXG4gICRzdW1tYXJ5LnNldEF0dHJpYnV0ZSgncm9sZScsICdidXR0b24nKTtcclxuXHJcbiAgLy8gQWRkIGFyaWEtY29udHJvbHNcclxuICAkc3VtbWFyeS5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCAkY29udGVudC5pZCk7XHJcblxyXG4gIC8vIFNldCB0YWJJbmRleCBzbyB0aGUgc3VtbWFyeSBpcyBrZXlib2FyZCBhY2Nlc3NpYmxlIGZvciBub24tbmF0aXZlIGVsZW1lbnRzXHJcbiAgLy9cclxuICAvLyBXZSBoYXZlIHRvIHVzZSB0aGUgY2FtZWxjYXNlIGB0YWJJbmRleGAgcHJvcGVydHkgYXMgdGhlcmUgaXMgYSBidWcgaW4gSUU2L0lFNyB3aGVuIHdlIHNldCB0aGUgY29ycmVjdCBhdHRyaWJ1dGUgbG93ZXJjYXNlOlxyXG4gIC8vIFNlZSBodHRwOi8vd2ViLmFyY2hpdmUub3JnL3dlYi8yMDE3MDEyMDE5NDAzNi9odHRwOi8vd3d3LnNhbGllbmNlcy5jb20vYnJvd3NlckJ1Z3MvdGFiSW5kZXguaHRtbCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cclxuICAkc3VtbWFyeS50YWJJbmRleCA9IDA7XHJcblxyXG4gIC8vIERldGVjdCBpbml0aWFsIG9wZW4gc3RhdGVcclxuICBsZXQgb3BlbkF0dHIgPSAkbW9kdWxlLmdldEF0dHJpYnV0ZSgnb3BlbicpICE9PSBudWxsO1xyXG4gIGlmIChvcGVuQXR0ciA9PT0gdHJ1ZSkge1xyXG4gICAgJHN1bW1hcnkuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgJHN1bW1hcnkuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAkY29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICB9XHJcblxyXG4gIC8vIEJpbmQgYW4gZXZlbnQgdG8gaGFuZGxlIHN1bW1hcnkgZWxlbWVudHNcclxuICB0aGlzLnBvbHlmaWxsSGFuZGxlSW5wdXRzKCRzdW1tYXJ5LCB0aGlzLnBvbHlmaWxsU2V0QXR0cmlidXRlcy5iaW5kKHRoaXMpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZWZpbmUgYSBzdGF0ZWNoYW5nZSBmdW5jdGlvbiB0aGF0IHVwZGF0ZXMgYXJpYS1leHBhbmRlZCBhbmQgc3R5bGUuZGlzcGxheVxyXG4gKiBAcGFyYW0ge29iamVjdH0gc3VtbWFyeSBlbGVtZW50XHJcbiAqL1xyXG5EZXRhaWxzLnByb3RvdHlwZS5wb2x5ZmlsbFNldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0ICRtb2R1bGUgPSB0aGlzLiRtb2R1bGU7XHJcbiAgbGV0ICRzdW1tYXJ5ID0gdGhpcy4kc3VtbWFyeTtcclxuICBsZXQgJGNvbnRlbnQgPSB0aGlzLiRjb250ZW50O1xyXG5cclxuICBsZXQgZXhwYW5kZWQgPSAkc3VtbWFyeS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnO1xyXG4gIGxldCBoaWRkZW4gPSAkY29udGVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJztcclxuXHJcbiAgJHN1bW1hcnkuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgKGV4cGFuZGVkID8gJ2ZhbHNlJyA6ICd0cnVlJykpO1xyXG4gICRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAoaGlkZGVuID8gJ2ZhbHNlJyA6ICd0cnVlJykpO1xyXG5cclxuXHJcbiAgbGV0IGhhc09wZW5BdHRyID0gJG1vZHVsZS5nZXRBdHRyaWJ1dGUoJ29wZW4nKSAhPT0gbnVsbDtcclxuICBpZiAoIWhhc09wZW5BdHRyKSB7XHJcbiAgICAkbW9kdWxlLnNldEF0dHJpYnV0ZSgnb3BlbicsICdvcGVuJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgICRtb2R1bGUucmVtb3ZlQXR0cmlidXRlKCdvcGVuJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdHJ1ZVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhhbmRsZSBjcm9zcy1tb2RhbCBjbGljayBldmVudHNcclxuICogQHBhcmFtIHtvYmplY3R9IG5vZGUgZWxlbWVudFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvblxyXG4gKi9cclxuRGV0YWlscy5wcm90b3R5cGUucG9seWZpbGxIYW5kbGVJbnB1dHMgPSBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcclxuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgLy8gV2hlbiB0aGUga2V5IGdldHMgcHJlc3NlZCAtIGNoZWNrIGlmIGl0IGlzIGVudGVyIG9yIHNwYWNlXHJcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZX0VOVEVSIHx8IGV2ZW50LmtleUNvZGUgPT09IEtFWV9TUEFDRSkge1xyXG4gICAgICBpZiAodGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdW1tYXJ5Jykge1xyXG4gICAgICAgIC8vIFByZXZlbnQgc3BhY2UgZnJvbSBzY3JvbGxpbmcgdGhlIHBhZ2VcclxuICAgICAgICAvLyBhbmQgZW50ZXIgZnJvbSBzdWJtaXR0aW5nIGEgZm9ybVxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgLy8gQ2xpY2sgdG8gbGV0IHRoZSBjbGljayBldmVudCBkbyBhbGwgdGhlIG5lY2Vzc2FyeSBhY3Rpb25cclxuICAgICAgICBpZiAodGFyZ2V0LmNsaWNrKSB7XHJcbiAgICAgICAgICB0YXJnZXQuY2xpY2soKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gZXhjZXB0IFNhZmFyaSA1LjEgYW5kIHVuZGVyIGRvbid0IHN1cHBvcnQgLmNsaWNrKCkgaGVyZVxyXG4gICAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBQcmV2ZW50IGtleXVwIHRvIHByZXZlbnQgY2xpY2tpbmcgdHdpY2UgaW4gRmlyZWZveCB3aGVuIHVzaW5nIHNwYWNlIGtleVxyXG4gIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZX1NQQUNFKSB7XHJcbiAgICAgIGlmICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N1bW1hcnknKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGV0YWlscztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBjbG9zZXN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvY2xvc2VzdCcpO1xyXG5jb25zdCB0b2dnbGUgPSByZXF1aXJlKCcuLi91dGlscy90b2dnbGUnKTtcclxuY29uc3QgYnJlYWtwb2ludHMgPSByZXF1aXJlKCcuLi91dGlscy9icmVha3BvaW50cycpO1xyXG5jb25zdCBCVVRUT04gPSAnLmpzLWRyb3Bkb3duJztcclxuY29uc3QganNEcm9wZG93bkNvbGxhcHNlTW9kaWZpZXIgPSAnanMtZHJvcGRvd24tLXJlc3BvbnNpdmUtY29sbGFwc2UnOyAvL29wdGlvbjogbWFrZSBkcm9wZG93biBiZWhhdmUgYXMgdGhlIGNvbGxhcHNlIGNvbXBvbmVudCB3aGVuIG9uIHNtYWxsIHNjcmVlbnMgKHVzZWQgYnkgc3VibWVudXMgaW4gdGhlIGhlYWRlciBhbmQgc3RlcC1kcm9wZG93bikuXHJcbmNvbnN0IFRBUkdFVCA9ICdkYXRhLWpzLXRhcmdldCc7XHJcbmNvbnN0IGV2ZW50Q2xvc2VOYW1lID0gJ2Zkcy5kcm9wZG93bi5jbG9zZSc7XHJcbmNvbnN0IGV2ZW50T3Blbk5hbWUgPSAnZmRzLmRyb3Bkb3duLm9wZW4nO1xyXG5cclxuY2xhc3MgRHJvcGRvd24ge1xyXG4gIGNvbnN0cnVjdG9yIChlbCl7XHJcbiAgICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy50cmlnZ2VyRWwgPSBudWxsO1xyXG4gICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5pbml0KGVsKTtcclxuXHJcbiAgICBpZih0aGlzLnRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0aGlzLnRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudGFyZ2V0RWwgIT09IG51bGwgJiYgdGhpcy50YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG5cclxuXHJcbiAgICAgIGlmKHRoaXMudHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykgfHwgdGhpcy50cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSl7XHJcbiAgICAgICAgdGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vQ2xpY2tlZCBvdXRzaWRlIGRyb3Bkb3duIC0+IGNsb3NlIGl0XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG91dHNpZGVDbG9zZSk7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG91dHNpZGVDbG9zZSk7XHJcbiAgICAgIC8vQ2xpY2tlZCBvbiBkcm9wZG93biBvcGVuIGJ1dHRvbiAtLT4gdG9nZ2xlIGl0XHJcbiAgICAgIHRoaXMudHJpZ2dlckVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlRHJvcGRvd24pO1xyXG4gICAgICB0aGlzLnRyaWdnZXJFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZURyb3Bkb3duKTtcclxuXHJcbiAgICAgIC8vIHNldCBhcmlhLWhpZGRlbiBjb3JyZWN0bHkgZm9yIHNjcmVlbnJlYWRlcnMgKFRyaW5ndWlkZSByZXNwb25zaXZlKVxyXG4gICAgICBpZih0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLnRyaWdnZXJFbDtcclxuICAgICAgICBpZiAod2luZG93LkludGVyc2VjdGlvbk9ic2VydmVyKSB7XHJcbiAgICAgICAgICAvLyB0cmlnZ2VyIGV2ZW50IHdoZW4gYnV0dG9uIGNoYW5nZXMgdmlzaWJpbGl0eVxyXG4gICAgICAgICAgbGV0IG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChlbnRyaWVzKSB7XHJcbiAgICAgICAgICAgIC8vIGJ1dHRvbiBpcyB2aXNpYmxlXHJcbiAgICAgICAgICAgIGlmIChlbnRyaWVzWyAwIF0uaW50ZXJzZWN0aW9uUmF0aW8pIHtcclxuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy8gYnV0dG9uIGlzIG5vdCB2aXNpYmxlXHJcbiAgICAgICAgICAgICAgaWYgKHRoYXQudGFyZ2V0RWwuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAndHJ1ZScpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICByb290OiBkb2N1bWVudC5ib2R5XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIElFOiBJbnRlcnNlY3Rpb25PYnNlcnZlciBpcyBub3Qgc3VwcG9ydGVkLCBzbyB3ZSBsaXN0ZW4gZm9yIHdpbmRvdyByZXNpemUgYW5kIGdyaWQgYnJlYWtwb2ludCBpbnN0ZWFkXHJcbiAgICAgICAgICBpZiAoZG9SZXNwb25zaXZlQ29sbGFwc2UodGhhdC50cmlnZ2VyRWwpKSB7XHJcbiAgICAgICAgICAgIC8vIHNtYWxsIHNjcmVlblxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTGFyZ2Ugc2NyZWVuXHJcbiAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRoYXQudHJpZ2dlckVsKSkge1xyXG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgZXZ0ID0gZXZ0IHx8IHdpbmRvdy5ldmVudDtcclxuICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDI3KSB7XHJcbiAgICAgICAgICBjbG9zZUFsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXQgKGVsKXtcclxuICAgIHRoaXMudHJpZ2dlckVsID0gZWw7XHJcbiAgICBpZih0aGlzLnRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0aGlzLnRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgbGV0IHRhcmdldEF0dHIgPSB0aGlzLnRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKTtcclxuICAgICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGxldCB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKSk7XHJcbiAgICAgICAgaWYodGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICB0aGlzLnRhcmdldEVsID0gdGFyZ2V0RWw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogVG9nZ2xlIGEgYnV0dG9uJ3MgXCJwcmVzc2VkXCIgc3RhdGUsIG9wdGlvbmFsbHkgcHJvdmlkaW5nIGEgdGFyZ2V0XHJcbiAqIHN0YXRlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cclxuICogQHBhcmFtIHtib29sZWFuP30gZXhwYW5kZWQgSWYgbm8gc3RhdGUgaXMgcHJvdmlkZWQsIHRoZSBjdXJyZW50XHJcbiAqIHN0YXRlIHdpbGwgYmUgdG9nZ2xlZCAoZnJvbSBmYWxzZSB0byB0cnVlLCBhbmQgdmljZS12ZXJzYSkuXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRoZSByZXN1bHRpbmcgc3RhdGVcclxuICovXHJcbmNvbnN0IHRvZ2dsZUJ1dHRvbiA9IChidXR0b24sIGV4cGFuZGVkKSA9PiB7XHJcbiAgdG9nZ2xlKGJ1dHRvbiwgZXhwYW5kZWQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBhbiBBcnJheSBvZiBidXR0b24gZWxlbWVudHMgYmVsb25naW5nIGRpcmVjdGx5IHRvIHRoZSBnaXZlblxyXG4gKiBhY2NvcmRpb24gZWxlbWVudC5cclxuICogQHBhcmFtIHBhcmVudCBhY2NvcmRpb24gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7Tm9kZUxpc3RPZjxTVkdFbGVtZW50VGFnTmFtZU1hcFtbc3RyaW5nXV0+IHwgTm9kZUxpc3RPZjxIVE1MRWxlbWVudFRhZ05hbWVNYXBbW3N0cmluZ11dPiB8IE5vZGVMaXN0T2Y8RWxlbWVudD59XHJcbiAqL1xyXG5sZXQgZ2V0QnV0dG9ucyA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcclxuICByZXR1cm4gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxufTtcclxuXHJcbmxldCBjbG9zZUFsbCA9IGZ1bmN0aW9uICgpe1xyXG5cclxuICBsZXQgZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gIGV2ZW50Q2xvc2UuaW5pdEV2ZW50KGV2ZW50Q2xvc2VOYW1lLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuXHJcbiAgbGV0IG92ZXJmbG93TWVudUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3ZlcmZsb3ctbWVudScpO1xyXG4gIGZvciAobGV0IG9pID0gMDsgb2kgPCBvdmVyZmxvd01lbnVFbC5sZW5ndGg7IG9pKyspIHtcclxuICAgIGxldCBjdXJyZW50T3ZlcmZsb3dNZW51RUwgPSBvdmVyZmxvd01lbnVFbFsgb2kgXTtcclxuICAgIGxldCB0cmlnZ2VyRWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwucXVlcnlTZWxlY3RvcihCVVRUT04pO1xyXG4gICAgbGV0IHRhcmdldEVsID0gY3VycmVudE92ZXJmbG93TWVudUVMLnF1ZXJ5U2VsZWN0b3IoJyMnK3RyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKS5yZXBsYWNlKCcjJywgJycpKTtcclxuXHJcbiAgICBpZiAodGFyZ2V0RWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSBudWxsKSB7XHJcbiAgICAgIGlmKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRyaWdnZXJFbCkpe1xyXG4gICAgICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5sZXQgb2Zmc2V0ID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgbGV0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcclxuICAgIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsXHJcbiAgICBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuICByZXR1cm4geyB0b3A6IHJlY3QudG9wICsgc2Nyb2xsVG9wLCBsZWZ0OiByZWN0LmxlZnQgKyBzY3JvbGxMZWZ0IH07XHJcbn07XHJcblxyXG5sZXQgdG9nZ2xlRHJvcGRvd24gPSBmdW5jdGlvbiAoZXZlbnQsIGZvcmNlQ2xvc2UgPSBmYWxzZSkge1xyXG4gIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gIGxldCBldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgZXZlbnRDbG9zZS5pbml0RXZlbnQoZXZlbnRDbG9zZU5hbWUsIHRydWUsIHRydWUpO1xyXG5cclxuICBsZXQgZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgZXZlbnRPcGVuLmluaXRFdmVudChldmVudE9wZW5OYW1lLCB0cnVlLCB0cnVlKTtcclxuICBsZXQgdHJpZ2dlckVsID0gdGhpcztcclxuICBsZXQgdGFyZ2V0RWwgPSBudWxsO1xyXG4gIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICBsZXQgdGFyZ2V0QXR0ciA9IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKTtcclxuICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJykpO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAvL2NoYW5nZSBzdGF0ZVxyXG5cclxuICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSBudWxsO1xyXG4gICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSBudWxsO1xyXG5cclxuICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnIHx8IGZvcmNlQ2xvc2Upe1xyXG4gICAgICAvL2Nsb3NlXHJcbiAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBjbG9zZUFsbCgpO1xyXG4gICAgICAvL29wZW5cclxuICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcbiAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgICAgIGxldCB0YXJnZXRPZmZzZXQgPSBvZmZzZXQodGFyZ2V0RWwpO1xyXG5cclxuICAgICAgaWYodGFyZ2V0T2Zmc2V0LmxlZnQgPCAwKXtcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHJpZ2h0ID0gdGFyZ2V0T2Zmc2V0LmxlZnQgKyB0YXJnZXRFbC5vZmZzZXRXaWR0aDtcclxuICAgICAgaWYocmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCl7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICdhdXRvJztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICcwcHgnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgb2Zmc2V0QWdhaW4gPSBvZmZzZXQodGFyZ2V0RWwpO1xyXG5cclxuICAgICAgaWYob2Zmc2V0QWdhaW4ubGVmdCA8IDApe1xyXG5cclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XHJcbiAgICAgIH1cclxuICAgICAgcmlnaHQgPSBvZmZzZXRBZ2Fpbi5sZWZ0ICsgdGFyZ2V0RWwub2Zmc2V0V2lkdGg7XHJcbiAgICAgIGlmKHJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpe1xyXG5cclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cclxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZVxyXG4gKi9cclxubGV0IHNob3cgPSBmdW5jdGlvbiAoYnV0dG9uKXtcclxuICB0b2dnbGVCdXR0b24oYnV0dG9uLCB0cnVlKTtcclxufTtcclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxyXG4gKiBAcmV0dXJuIHtib29sZWFufSBmYWxzZVxyXG4gKi9cclxubGV0IGhpZGUgPSBmdW5jdGlvbiAoYnV0dG9uKSB7XHJcbiAgdG9nZ2xlQnV0dG9uKGJ1dHRvbiwgZmFsc2UpO1xyXG59O1xyXG5cclxuXHJcbmxldCBvdXRzaWRlQ2xvc2UgPSBmdW5jdGlvbiAoZXZ0KXtcclxuICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Lm1vYmlsZV9uYXYtYWN0aXZlJykgPT09IG51bGwpIHtcclxuICAgIGxldCBvcGVuRHJvcGRvd25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWRyb3Bkb3duW2FyaWEtZXhwYW5kZWQ9dHJ1ZV0nKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3BlbkRyb3Bkb3ducy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgdHJpZ2dlckVsID0gb3BlbkRyb3Bkb3duc1tpXTtcclxuICAgICAgbGV0IHRhcmdldEVsID0gbnVsbDtcclxuICAgICAgbGV0IHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgICAgIGlmICh0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0cik7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRyaWdnZXJFbCkpIHtcclxuICAgICAgICAvL2Nsb3NlcyBkcm9wZG93biB3aGVuIGNsaWNrZWQgb3V0c2lkZVxyXG4gICAgICAgIGlmIChldnQudGFyZ2V0ICE9PSB0cmlnZ2VyRWwpIHtcclxuICAgICAgICAgIC8vY2xpY2tlZCBvdXRzaWRlIHRyaWdnZXIsIGZvcmNlIGNsb3NlXHJcbiAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuICAgICAgICAgIGxldCBldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICAgICAgICBldmVudENsb3NlLmluaXRFdmVudChldmVudENsb3NlTmFtZSwgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5sZXQgZG9SZXNwb25zaXZlQ29sbGFwc2UgPSBmdW5jdGlvbiAodHJpZ2dlckVsKXtcclxuICBpZighdHJpZ2dlckVsLmNsYXNzTGlzdC5jb250YWlucyhqc0Ryb3Bkb3duQ29sbGFwc2VNb2RpZmllcikpe1xyXG4gICAgLy8gbm90IG5hdiBvdmVyZmxvdyBtZW51XHJcbiAgICBpZih0cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSB8fCB0cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSkge1xyXG4gICAgICAvLyB0cmluaW5kaWthdG9yIG92ZXJmbG93IG1lbnVcclxuICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IGdldFRyaW5ndWlkZUJyZWFrcG9pbnQodHJpZ2dlckVsKSkge1xyXG4gICAgICAgIC8vIG92ZXJmbG93IG1lbnUgcMOlIHJlc3BvbnNpdiB0cmluZ3VpZGUgYWt0aXZlcmV0XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZXtcclxuICAgICAgLy8gbm9ybWFsIG92ZXJmbG93IG1lbnVcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5sZXQgZ2V0VHJpbmd1aWRlQnJlYWtwb2ludCA9IGZ1bmN0aW9uIChidXR0b24pe1xyXG4gIGlmKGJ1dHRvbi5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpKXtcclxuICAgIHJldHVybiBicmVha3BvaW50cy5tZDtcclxuICB9XHJcbiAgaWYoYnV0dG9uLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1sZy1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgcmV0dXJuIGJyZWFrcG9pbnRzLmxnO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRHJvcGRvd247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcbmNvbnN0IGRyb3Bkb3duID0gcmVxdWlyZSgnLi9kcm9wZG93bicpO1xyXG5cclxuY29uc3QgTkFWID0gYC5uYXZgO1xyXG5jb25zdCBOQVZfTElOS1MgPSBgJHtOQVZ9IGFgO1xyXG5jb25zdCBPUEVORVJTID0gYC5qcy1tZW51LW9wZW5gO1xyXG5jb25zdCBDTE9TRV9CVVRUT04gPSBgLmpzLW1lbnUtY2xvc2VgO1xyXG5jb25zdCBPVkVSTEFZID0gYC5vdmVybGF5YDtcclxuY29uc3QgQ0xPU0VSUyA9IGAke0NMT1NFX0JVVFRPTn0sIC5vdmVybGF5YDtcclxuY29uc3QgVE9HR0xFUyA9IFsgTkFWLCBPVkVSTEFZIF0uam9pbignLCAnKTtcclxuXHJcbmNvbnN0IEFDVElWRV9DTEFTUyA9ICdtb2JpbGVfbmF2LWFjdGl2ZSc7XHJcbmNvbnN0IFZJU0lCTEVfQ0xBU1MgPSAnaXMtdmlzaWJsZSc7XHJcblxyXG5jb25zdCBpc0FjdGl2ZSA9ICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUyk7XHJcblxyXG5jb25zdCBfZm9jdXNUcmFwID0gKHRyYXBDb250YWluZXIpID0+IHtcclxuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cclxuICBjb25zdCBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9ICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSc7XHJcbiAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSB0cmFwQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcpO1xyXG4gIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWyAwIF07XHJcbiAgY29uc3QgbGFzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1sgZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMSBdO1xyXG5cclxuICBmdW5jdGlvbiB0cmFwVGFiS2V5IChlKSB7XHJcbiAgICAvLyBDaGVjayBmb3IgVEFCIGtleSBwcmVzc1xyXG4gICAgaWYgKGUua2V5Q29kZSA9PT0gOSkge1xyXG5cclxuICAgICAgLy8gU0hJRlQgKyBUQUJcclxuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RUYWJTdG9wKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRBQlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0VGFiU3RvcCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRVNDQVBFXHJcbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XHJcbiAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEZvY3VzIGZpcnN0IGNoaWxkXHJcbiAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbmFibGUgKCkge1xyXG4gICAgICAvLyBMaXN0ZW4gZm9yIGFuZCB0cmFwIHRoZSBrZXlib2FyZFxyXG4gICAgICB0cmFwQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVsZWFzZSAoKSB7XHJcbiAgICAgIHRyYXBDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBUYWJLZXkpO1xyXG4gICAgfSxcclxuICB9O1xyXG59O1xyXG5cclxubGV0IGZvY3VzVHJhcDtcclxuXHJcbmNvbnN0IHRvZ2dsZU5hdiA9IGZ1bmN0aW9uIChhY3RpdmUpIHtcclxuICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICBpZiAodHlwZW9mIGFjdGl2ZSAhPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICBhY3RpdmUgPSAhaXNBY3RpdmUoKTtcclxuICB9XHJcbiAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKEFDVElWRV9DTEFTUywgYWN0aXZlKTtcclxuXHJcbiAgZm9yRWFjaChzZWxlY3QoVE9HR0xFUyksIGVsID0+IHtcclxuICAgIGVsLmNsYXNzTGlzdC50b2dnbGUoVklTSUJMRV9DTEFTUywgYWN0aXZlKTtcclxuICB9KTtcclxuICBpZiAoYWN0aXZlKSB7XHJcbiAgICBmb2N1c1RyYXAuZW5hYmxlKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGZvY3VzVHJhcC5yZWxlYXNlKCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBjbG9zZUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihDTE9TRV9CVVRUT04pO1xyXG4gIGNvbnN0IG1lbnVCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoT1BFTkVSUyk7XHJcblxyXG4gIGlmIChhY3RpdmUgJiYgY2xvc2VCdXR0b24pIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGFjdGl2YXRlZCwgc28gZm9jdXMgb24gdGhlIGNsb3NlIGJ1dHRvbixcclxuICAgIC8vIHdoaWNoIGlzIGp1c3QgYmVmb3JlIGFsbCB0aGUgbmF2IGVsZW1lbnRzIGluIHRoZSB0YWIgb3JkZXIuXHJcbiAgICBjbG9zZUJ1dHRvbi5mb2N1cygpO1xyXG4gIH0gZWxzZSBpZiAoIWFjdGl2ZSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBjbG9zZUJ1dHRvbiAmJlxyXG4gICAgICAgICAgICAgbWVudUJ1dHRvbikge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgZGVhY3RpdmF0ZWQsIGFuZCBmb2N1cyB3YXMgb24gdGhlIGNsb3NlXHJcbiAgICAvLyBidXR0b24sIHdoaWNoIGlzIG5vIGxvbmdlciB2aXNpYmxlLiBXZSBkb24ndCB3YW50IHRoZSBmb2N1cyB0b1xyXG4gICAgLy8gZGlzYXBwZWFyIGludG8gdGhlIHZvaWQsIHNvIGZvY3VzIG9uIHRoZSBtZW51IGJ1dHRvbiBpZiBpdCdzXHJcbiAgICAvLyB2aXNpYmxlICh0aGlzIG1heSBoYXZlIGJlZW4gd2hhdCB0aGUgdXNlciB3YXMganVzdCBmb2N1c2VkIG9uLFxyXG4gICAgLy8gaWYgdGhleSB0cmlnZ2VyZWQgdGhlIG1vYmlsZSBuYXYgYnkgbWlzdGFrZSkuXHJcbiAgICBtZW51QnV0dG9uLmZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYWN0aXZlO1xyXG59O1xyXG5cclxuY29uc3QgcmVzaXplID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNsb3NlciA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihDTE9TRV9CVVRUT04pO1xyXG5cclxuICBpZiAoaXNBY3RpdmUoKSAmJiBjbG9zZXIgJiYgY2xvc2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoID09PSAwKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiBpcyBhY3RpdmUsIGJ1dCB0aGUgY2xvc2UgYm94IGlzbid0IHZpc2libGUsIHdoaWNoXHJcbiAgICAvLyBtZWFucyB0aGUgdXNlcidzIHZpZXdwb3J0IGhhcyBiZWVuIHJlc2l6ZWQgc28gdGhhdCBpdCBpcyBubyBsb25nZXJcclxuICAgIC8vIGluIG1vYmlsZSBtb2RlLiBMZXQncyBtYWtlIHRoZSBwYWdlIHN0YXRlIGNvbnNpc3RlbnQgYnlcclxuICAgIC8vIGRlYWN0aXZhdGluZyB0aGUgbW9iaWxlIG5hdi5cclxuICAgIHRvZ2dsZU5hdi5jYWxsKGNsb3NlciwgZmFsc2UpO1xyXG4gIH1cclxufTtcclxuXHJcbmNsYXNzIE5hdmlnYXRpb24ge1xyXG4gIGNvbnN0cnVjdG9yICgpe1xyXG4gICAgbGV0IG9wZW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE9QRU5FUlMpO1xyXG4gICAgZm9yKGxldCBvID0gMDsgbyA8IG9wZW5lcnMubGVuZ3RoOyBvKyspIHtcclxuICAgICAgb3BlbmVyc1sgbyBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTmF2KTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY2xvc2VycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQ0xPU0VSUyk7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2xvc2Vycy5sZW5ndGg7IGMrKykge1xyXG4gICAgICBjbG9zZXJzWyBjIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVOYXYpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBuYXZMaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoTkFWX0xJTktTKTtcclxuICAgIGZvcihsZXQgbiA9IDA7IG4gPCBuYXZMaW5rcy5sZW5ndGg7IG4rKykge1xyXG4gICAgICBuYXZMaW5rc1sgbiBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyBBIG5hdmlnYXRpb24gbGluayBoYXMgYmVlbiBjbGlja2VkISBXZSB3YW50IHRvIGNvbGxhcHNlIGFueVxyXG4gICAgICAgIC8vIGhpZXJhcmNoaWNhbCBuYXZpZ2F0aW9uIFVJIGl0J3MgYSBwYXJ0IG9mLCBzbyB0aGF0IHRoZSB1c2VyXHJcbiAgICAgICAgLy8gY2FuIGZvY3VzIG9uIHdoYXRldmVyIHRoZXkndmUganVzdCBzZWxlY3RlZC5cclxuXHJcbiAgICAgICAgLy8gU29tZSBuYXZpZ2F0aW9uIGxpbmtzIGFyZSBpbnNpZGUgZHJvcGRvd25zOyB3aGVuIHRoZXkncmVcclxuICAgICAgICAvLyBjbGlja2VkLCB3ZSB3YW50IHRvIGNvbGxhcHNlIHRob3NlIGRyb3Bkb3ducy5cclxuXHJcblxyXG4gICAgICAgIC8vIElmIHRoZSBtb2JpbGUgbmF2aWdhdGlvbiBtZW51IGlzIGFjdGl2ZSwgd2Ugd2FudCB0byBoaWRlIGl0LlxyXG4gICAgICAgIGlmIChpc0FjdGl2ZSgpKSB7XHJcbiAgICAgICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxuICB9XHJcblxyXG4gIGluaXQgKCkge1xyXG4gICAgY29uc3QgdHJhcENvbnRhaW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE5BVik7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdHJhcENvbnRhaW5lcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIGZvY3VzVHJhcCA9IF9mb2N1c1RyYXAodHJhcENvbnRhaW5lcnNbaV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZSgpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSwgZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgdGVhcmRvd24gKCkge1xyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSwgZmFsc2UpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOYXZpZ2F0aW9uO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jbGFzcyBSYWRpb1RvZ2dsZUdyb3Vwe1xyXG4gICAgY29uc3RydWN0b3IoZWwpe1xyXG4gICAgICAgIHRoaXMuanNUb2dnbGVUcmlnZ2VyID0gJy5qcy1yYWRpby10b2dnbGUtZ3JvdXAnO1xyXG4gICAgICAgIHRoaXMuanNUb2dnbGVUYXJnZXQgPSAnZGF0YS1qcy10YXJnZXQnO1xyXG5cclxuICAgICAgICB0aGlzLmV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgICAgICB0aGlzLmV2ZW50Q2xvc2UuaW5pdEV2ZW50KCdmZHMuY29sbGFwc2UuY2xvc2UnLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5ldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgICAgICB0aGlzLmV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5jb2xsYXBzZS5vcGVuJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5yYWRpb0VscyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdChlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCAoZWwpe1xyXG4gICAgICAgIHRoaXMucmFkaW9Hcm91cCA9IGVsO1xyXG4gICAgICAgIHRoaXMucmFkaW9FbHMgPSB0aGlzLnJhZGlvR3JvdXAucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdJyk7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5yYWRpb0Vscy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICB2YXIgcmFkaW8gPSB0aGlzLnJhZGlvRWxzWyBpIF07XHJcbiAgICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgICAgZm9yKGxldCBhID0gMDsgYSA8IHRoYXQucmFkaW9FbHMubGVuZ3RoOyBhKysgKXtcclxuICAgICAgICAgICAgICB0aGF0LnRvZ2dsZSh0aGF0LnJhZGlvRWxzWyBhIF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGlzLnRvZ2dsZShyYWRpbyk7IC8vSW5pdGlhbCB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlICh0cmlnZ2VyRWwpe1xyXG4gICAgICAgIHZhciB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZSh0aGlzLmpzVG9nZ2xlVGFyZ2V0KTtcclxuICAgICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0QXR0cik7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYodHJpZ2dlckVsLmNoZWNrZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcclxuICAgICAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50T3Blbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCl7XHJcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudENsb3NlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmFkaW9Ub2dnbGVHcm91cDtcclxuIiwiLypcclxuKiBQcmV2ZW50cyB0aGUgdXNlciBmcm9tIGlucHV0dGluZyBiYXNlZCBvbiBhIHJlZ2V4LlxyXG4qIERvZXMgbm90IHdvcmsgdGhlIHNhbWUgd2F5IGFmIDxpbnB1dCBwYXR0ZXJuPVwiXCI+LCB0aGlzIHBhdHRlcm4gaXMgb25seSB1c2VkIGZvciB2YWxpZGF0aW9uLCBub3QgdG8gcHJldmVudCBpbnB1dC5cclxuKiBVc2VjYXNlOiBudW1iZXIgaW5wdXQgZm9yIGRhdGUtY29tcG9uZW50LlxyXG4qIEV4YW1wbGUgLSBudW1iZXIgb25seTogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1pbnB1dC1yZWdleD1cIl5cXGQqJFwiPlxyXG4qL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBtb2RpZmllclN0YXRlID0ge1xyXG4gIHNoaWZ0OiBmYWxzZSxcclxuICBhbHQ6IGZhbHNlLFxyXG4gIGN0cmw6IGZhbHNlLFxyXG4gIGNvbW1hbmQ6IGZhbHNlXHJcbn07XHJcblxyXG5jbGFzcyBJbnB1dFJlZ2V4TWFzayB7XHJcbiAgY29uc3RydWN0b3IgKGVsZW1lbnQpe1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIHJlZ2V4TWFzayk7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCByZWdleE1hc2spO1xyXG4gIH1cclxufVxyXG52YXIgcmVnZXhNYXNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgaWYobW9kaWZpZXJTdGF0ZS5jdHJsIHx8IG1vZGlmaWVyU3RhdGUuY29tbWFuZCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgbmV3Q2hhciA9IG51bGw7XHJcbiAgaWYodHlwZW9mIGV2ZW50LmtleSAhPT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgaWYoZXZlbnQua2V5Lmxlbmd0aCA9PT0gMSl7XHJcbiAgICAgIG5ld0NoYXIgPSBldmVudC5rZXk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmKCFldmVudC5jaGFyQ29kZSl7XHJcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmtleUNvZGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV3Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQuY2hhckNvZGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHJlZ2V4U3RyID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5wdXQtcmVnZXgnKTtcclxuXHJcbiAgaWYoZXZlbnQudHlwZSAhPT0gdW5kZWZpbmVkICYmIGV2ZW50LnR5cGUgPT09ICdwYXN0ZScpe1xyXG4gICAgY29uc29sZS5sb2coJ3Bhc3RlJyk7XHJcbiAgfSBlbHNle1xyXG4gICAgdmFyIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgaWYoZXZlbnQudGFyZ2V0ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgaWYobmV3Q2hhciAhPT0gbnVsbCAmJiBlbGVtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgIGlmKG5ld0NoYXIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZihlbGVtZW50LnR5cGUgPT09ICdudW1iZXInKXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTsvL05vdGUgaW5wdXRbdHlwZT1udW1iZXJdIGRvZXMgbm90IGhhdmUgLnNlbGVjdGlvblN0YXJ0L0VuZCAoQ2hyb21lKS5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZS5zbGljZSgwLCBlbGVtZW50LnNlbGVjdGlvblN0YXJ0KSArIHRoaXMudmFsdWUuc2xpY2UoZWxlbWVudC5zZWxlY3Rpb25FbmQpICsgbmV3Q2hhcjsgLy9yZW1vdmVzIHRoZSBudW1iZXJzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCB0aGVuIGFkZHMgbmV3IGNoYXIuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAocmVnZXhTdHIpO1xyXG4gICAgICAgIGlmKHIuZXhlYyhuZXdWYWx1ZSkgPT09IG51bGwpe1xyXG4gICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5wdXRSZWdleE1hc2s7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3Qgb25jZSA9IHJlcXVpcmUoJ3JlY2VwdG9yL29uY2UnKTtcclxuXHJcbmNsYXNzIFNldFRhYkluZGV4IHtcclxuICBjb25zdHJ1Y3RvciAoZWxlbWVudCl7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCl7XHJcbiAgICAgIC8vIE5COiB3ZSBrbm93IGJlY2F1c2Ugb2YgdGhlIHNlbGVjdG9yIHdlJ3JlIGRlbGVnYXRpbmcgdG8gYmVsb3cgdGhhdCB0aGVcclxuICAgICAgLy8gaHJlZiBhbHJlYWR5IGJlZ2lucyB3aXRoICcjJ1xyXG4gICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdocmVmJykuc2xpY2UoMSk7XHJcbiAgICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgaWYgKHRhcmdldCkge1xyXG4gICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgMCk7XHJcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvbmNlKGV2ZW50ID0+IHtcclxuICAgICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgLTEpO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyB0aHJvdyBhbiBlcnJvcj9cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNldFRhYkluZGV4O1xyXG4iLCJjb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuXHJcbmNsYXNzIFJlc3BvbnNpdmVUYWJsZSB7XHJcbiAgICBjb25zdHJ1Y3RvciAodGFibGUpIHtcclxuICAgICAgICB0aGlzLmluc2VydEhlYWRlckFzQXR0cmlidXRlcyh0YWJsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGRhdGEgYXR0cmlidXRlcyBuZWVkZWQgZm9yIHJlc3BvbnNpdmUgbW9kZS5cclxuICAgIGluc2VydEhlYWRlckFzQXR0cmlidXRlcyAodGFibGVFbCl7XHJcbiAgICAgICAgaWYgKCF0YWJsZUVsKSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBoZWFkZXIgPSAgdGFibGVFbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKTtcclxuICAgICAgICBpZihoZWFkZXIubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICBsZXQgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclsgMCBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aCcpO1xyXG4gICAgICAgICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclsgMCBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZCcpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChoZWFkZXJDZWxsRWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBib2R5Um93RWxzID0gc2VsZWN0KCd0Ym9keSB0cicsIHRhYmxlRWwpO1xyXG4gICAgICAgICAgICBBcnJheS5mcm9tKGJvZHlSb3dFbHMpLmZvckVhY2gocm93RWwgPT4ge1xyXG4gICAgICAgICAgICAgIGxldCBjZWxsRWxzID0gcm93RWwuY2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgaWYgKGNlbGxFbHMubGVuZ3RoID09PSBoZWFkZXJDZWxsRWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgQXJyYXkuZnJvbShoZWFkZXJDZWxsRWxzKS5mb3JFYWNoKChoZWFkZXJDZWxsRWwsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgLy8gR3JhYiBoZWFkZXIgY2VsbCB0ZXh0IGFuZCB1c2UgaXQgYm9keSBjZWxsIGRhdGEgdGl0bGUuXHJcbiAgICAgICAgICAgICAgICAgIGNlbGxFbHNbIGkgXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnLCBoZWFkZXJDZWxsRWwudGV4dENvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVzcG9uc2l2ZVRhYmxlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmxldCBicmVha3BvaW50cyA9IHtcclxuICAneHMnOiAwLFxyXG4gICdzbSc6IDU3NixcclxuICAnbWQnOiA3NjgsXHJcbiAgJ2xnJzogOTkyLFxyXG4gICd4bCc6IDEyMDBcclxufTtcclxuY2xhc3MgVGFibmF2IHtcclxuXHJcbiAgY29uc3RydWN0b3IgKHRhYm5hdikge1xyXG4gICAgdGhpcy50YWJuYXYgPSB0YWJuYXY7XHJcbiAgICB0aGlzLnRhYnMgPSB0aGlzLnRhYm5hdi5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24udGFibmF2LWl0ZW0nKTtcclxuXHJcbiAgICAvLyBpZiBubyBoYXNoIGlzIHNldCBvbiBsb2FkLCBzZXQgYWN0aXZlIHRhYlxyXG4gICAgaWYgKCFzZXRBY3RpdmVIYXNoVGFiKCkpIHtcclxuICAgICAgLy8gc2V0IGZpcnN0IHRhYiBhcyBhY3RpdmVcclxuICAgICAgbGV0IHRhYiA9IHRoaXMudGFic1sgMCBdO1xyXG5cclxuICAgICAgLy8gY2hlY2sgbm8gb3RoZXIgdGFicyBhcyBiZWVuIHNldCBhdCBkZWZhdWx0XHJcbiAgICAgIGxldCBhbHJlYWR5QWN0aXZlID0gZ2V0QWN0aXZlVGFicyh0aGlzLnRhYm5hdik7XHJcbiAgICAgIGlmIChhbHJlYWR5QWN0aXZlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRhYiA9IGFscmVhZHlBY3RpdmVbIDAgXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gYWN0aXZhdGUgYW5kIGRlYWN0aXZhdGUgdGFic1xyXG4gICAgICBhY3RpdmF0ZVRhYih0YWIsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhZGQgZXZlbnRsaXN0ZW5lcnMgb24gYnV0dG9uc1xyXG4gICAgZm9yKGxldCB0ID0gMDsgdCA8IHRoaXMudGFicy5sZW5ndGg7IHQgKyspe1xyXG4gICAgICBhZGRMaXN0ZW5lcnModGhpcy50YWJzWyB0IF0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gRm9yIGVhc3kgcmVmZXJlbmNlXHJcbnZhciBrZXlzID0ge1xyXG4gIGVuZDogMzUsXHJcbiAgaG9tZTogMzYsXHJcbiAgbGVmdDogMzcsXHJcbiAgdXA6IDM4LFxyXG4gIHJpZ2h0OiAzOSxcclxuICBkb3duOiA0MCxcclxuICBkZWxldGU6IDQ2XHJcbn07XHJcblxyXG4vLyBBZGQgb3Igc3Vic3RyYWN0IGRlcGVuZGluZyBvbiBrZXkgcHJlc3NlZFxyXG52YXIgZGlyZWN0aW9uID0ge1xyXG4gIDM3OiAtMSxcclxuICAzODogLTEsXHJcbiAgMzk6IDEsXHJcbiAgNDA6IDFcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnMgKHRhYikge1xyXG4gIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrRXZlbnRMaXN0ZW5lcik7XHJcbiAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duRXZlbnRMaXN0ZW5lcik7XHJcbiAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXBFdmVudExpc3RlbmVyKTtcclxufVxyXG5cclxuLy8gV2hlbiBhIHRhYiBpcyBjbGlja2VkLCBhY3RpdmF0ZVRhYiBpcyBmaXJlZCB0byBhY3RpdmF0ZSBpdFxyXG5mdW5jdGlvbiBjbGlja0V2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XHJcbiAgdmFyIHRhYiA9IHRoaXM7XHJcbiAgYWN0aXZhdGVUYWIodGFiLCBmYWxzZSk7XHJcbn1cclxuXHJcblxyXG4vLyBIYW5kbGUga2V5ZG93biBvbiB0YWJzXHJcbmZ1bmN0aW9uIGtleWRvd25FdmVudExpc3RlbmVyIChldmVudCkge1xyXG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xyXG5cclxuICBzd2l0Y2ggKGtleSkge1xyXG4gICAgY2FzZSBrZXlzLmVuZDpcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gQWN0aXZhdGUgbGFzdCB0YWJcclxuICAgICAgZm9jdXNMYXN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmhvbWU6XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIEFjdGl2YXRlIGZpcnN0IHRhYlxyXG4gICAgICBmb2N1c0ZpcnN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgLy8gVXAgYW5kIGRvd24gYXJlIGluIGtleWRvd25cclxuICAgIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBwcmV2ZW50IHBhZ2Ugc2Nyb2xsID46KVxyXG4gICAgY2FzZSBrZXlzLnVwOlxyXG4gICAgY2FzZSBrZXlzLmRvd246XHJcbiAgICAgIGRldGVybWluZU9yaWVudGF0aW9uKGV2ZW50KTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBIYW5kbGUga2V5dXAgb24gdGFic1xyXG5mdW5jdGlvbiBrZXl1cEV2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIHN3aXRjaCAoa2V5KSB7XHJcbiAgICBjYXNlIGtleXMubGVmdDpcclxuICAgIGNhc2Uga2V5cy5yaWdodDpcclxuICAgICAgZGV0ZXJtaW5lT3JpZW50YXRpb24oZXZlbnQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2Uga2V5cy5kZWxldGU6XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmVudGVyOlxyXG4gICAgY2FzZSBrZXlzLnNwYWNlOlxyXG4gICAgICBhY3RpdmF0ZVRhYihldmVudC50YXJnZXQsIHRydWUpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuLy8gV2hlbiBhIHRhYmxpc3QgYXJpYS1vcmllbnRhdGlvbiBpcyBzZXQgdG8gdmVydGljYWwsXHJcbi8vIG9ubHkgdXAgYW5kIGRvd24gYXJyb3cgc2hvdWxkIGZ1bmN0aW9uLlxyXG4vLyBJbiBhbGwgb3RoZXIgY2FzZXMgb25seSBsZWZ0IGFuZCByaWdodCBhcnJvdyBmdW5jdGlvbi5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lT3JpZW50YXRpb24gKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIGxldCB3PXdpbmRvdyxcclxuICAgIGQ9ZG9jdW1lbnQsXHJcbiAgICBlPWQuZG9jdW1lbnRFbGVtZW50LFxyXG4gICAgZz1kLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXSxcclxuICAgIHg9dy5pbm5lcldpZHRofHxlLmNsaWVudFdpZHRofHxnLmNsaWVudFdpZHRoLFxyXG4gICAgeT13LmlubmVySGVpZ2h0fHxlLmNsaWVudEhlaWdodHx8Zy5jbGllbnRIZWlnaHQ7XHJcblxyXG4gIGxldCB2ZXJ0aWNhbCA9IHggPCBicmVha3BvaW50cy5tZDtcclxuICBsZXQgcHJvY2VlZCA9IGZhbHNlO1xyXG5cclxuICBpZiAodmVydGljYWwpIHtcclxuICAgIGlmIChrZXkgPT09IGtleXMudXAgfHwga2V5ID09PSBrZXlzLmRvd24pIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgcHJvY2VlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgaWYgKGtleSA9PT0ga2V5cy5sZWZ0IHx8IGtleSA9PT0ga2V5cy5yaWdodCkge1xyXG4gICAgICBwcm9jZWVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHByb2NlZWQpIHtcclxuICAgIHN3aXRjaFRhYk9uQXJyb3dQcmVzcyhldmVudCk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBFaXRoZXIgZm9jdXMgdGhlIG5leHQsIHByZXZpb3VzLCBmaXJzdCwgb3IgbGFzdCB0YWJcclxuLy8gZGVwZW5kaW5nIG9uIGtleSBwcmVzc2VkXHJcbmZ1bmN0aW9uIHN3aXRjaFRhYk9uQXJyb3dQcmVzcyAoZXZlbnQpIHtcclxuICB2YXIgcHJlc3NlZCA9IGV2ZW50LmtleUNvZGU7XHJcbiAgaWYgKGRpcmVjdGlvblsgcHJlc3NlZCBdKSB7XHJcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhcmdldCk7XHJcbiAgICBsZXQgaW5kZXggPSBnZXRJbmRleE9mRWxlbWVudEluTGlzdCh0YXJnZXQsIHRhYnMpO1xyXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICBpZiAodGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdKSB7XHJcbiAgICAgICAgdGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocHJlc3NlZCA9PT0ga2V5cy5sZWZ0IHx8IHByZXNzZWQgPT09IGtleXMudXApIHtcclxuICAgICAgICBmb2N1c0xhc3RUYWIodGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChwcmVzc2VkID09PSBrZXlzLnJpZ2h0IHx8IHByZXNzZWQgPT0ga2V5cy5kb3duKSB7XHJcbiAgICAgICAgZm9jdXNGaXJzdFRhYih0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGFsbCBhY3RpdmUgdGFicyBpbiBsaXN0XHJcbiAqIEBwYXJhbSB0YWJuYXYgcGFyZW50IC50YWJuYXYgZWxlbWVudFxyXG4gKiBAcmV0dXJucyByZXR1cm5zIGxpc3Qgb2YgYWN0aXZlIHRhYnMgaWYgYW55XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBY3RpdmVUYWJzICh0YWJuYXYpIHtcclxuICByZXR1cm4gdGFibmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbVthcmlhLXNlbGVjdGVkPXRydWVdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYSBsaXN0IG9mIGFsbCBidXR0b24gdGFicyBpbiBjdXJyZW50IHRhYmxpc3RcclxuICogQHBhcmFtIHRhYiBCdXR0b24gdGFiIGVsZW1lbnRcclxuICogQHJldHVybnMgeyp9IHJldHVybiBhcnJheSBvZiB0YWJzXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBbGxUYWJzSW5MaXN0ICh0YWIpIHtcclxuICBsZXQgcGFyZW50Tm9kZSA9IHRhYi5wYXJlbnROb2RlO1xyXG4gIGlmIChwYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndGFibmF2JykpIHtcclxuICAgIHJldHVybiBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xyXG4gIH1cclxuICByZXR1cm4gW107XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEluZGV4T2ZFbGVtZW50SW5MaXN0IChlbGVtZW50LCBsaXN0KXtcclxuICBsZXQgaW5kZXggPSAtMTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKysgKXtcclxuICAgIGlmKGxpc3RbIGkgXSA9PT0gZWxlbWVudCl7XHJcbiAgICAgIGluZGV4ID0gaTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaW5kZXg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgdGhlcmUgaXMgYSB0YWIgaGFzaCBpbiB0aGUgdXJsIGFuZCBhY3RpdmF0ZXMgdGhlIHRhYiBhY2NvcmRpbmdseVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJucyB0cnVlIGlmIHRhYiBoYXMgYmVlbiBzZXQgLSByZXR1cm5zIGZhbHNlIGlmIG5vIHRhYiBoYXMgYmVlbiBzZXQgdG8gYWN0aXZlXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRBY3RpdmVIYXNoVGFiICgpIHtcclxuICBsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcclxuICBpZiAoaGFzaCAhPT0gJycpIHtcclxuICAgIGxldCB0YWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24udGFibmF2LWl0ZW1bYXJpYS1jb250cm9scz1cIiMnICsgaGFzaCArICdcIl0nKTtcclxuICAgIGlmICh0YWIgIT09IG51bGwpIHtcclxuICAgICAgYWN0aXZhdGVUYWIodGFiLCBmYWxzZSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKipcclxuICogQWN0aXZhdGUvc2hvdyB0YWIgYW5kIGhpZGUgb3RoZXJzXHJcbiAqIEBwYXJhbSB0YWIgYnV0dG9uIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGFjdGl2YXRlVGFiICh0YWIsIHNldEZvY3VzKSB7XHJcbiAgZGVhY3RpdmF0ZUFsbFRhYnNFeGNlcHQodGFiKTtcclxuXHJcbiAgbGV0IHRhYnBhbmVsSUQgPSB0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgbGV0IHRhYnBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFicGFuZWxJRCk7XHJcblxyXG4gIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xyXG4gIHRhYnBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICB0YWIucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xyXG5cclxuICAvLyBTZXQgZm9jdXMgd2hlbiByZXF1aXJlZFxyXG4gIGlmIChzZXRGb2N1cykge1xyXG4gICAgdGFiLmZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICBvdXRwdXRFdmVudCh0YWIsICdmZHMudGFibmF2LmNoYW5nZWQnKTtcclxuICBvdXRwdXRFdmVudCh0YWIucGFyZW50Tm9kZSwgJ2Zkcy50YWJuYXYub3BlbicpO1xyXG59XHJcblxyXG4vKipcclxuICogRGVhY3RpdmF0ZSBhbGwgdGFicyBpbiBsaXN0IGV4Y2VwdCB0aGUgb25lIHBhc3NlZFxyXG4gKiBAcGFyYW0gYWN0aXZlVGFiIGJ1dHRvbiB0YWIgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gZGVhY3RpdmF0ZUFsbFRhYnNFeGNlcHQgKGFjdGl2ZVRhYikge1xyXG4gIGxldCB0YWJzID0gZ2V0QWxsVGFic0luTGlzdChhY3RpdmVUYWIpO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCB0YWIgPSB0YWJzWyBpIF07XHJcbiAgICBpZiAodGFiID09PSBhY3RpdmVUYWIpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhYi5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgIG91dHB1dEV2ZW50KHRhYiwgJ2Zkcy50YWJuYXYuY2xvc2UnKTtcclxuICAgIH1cclxuXHJcbiAgICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG4gICAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFiLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBvdXRwdXQgYW4gZXZlbnQgb24gdGhlIHBhc3NlZCBlbGVtZW50XHJcbiAqIEBwYXJhbSBlbGVtZW50XHJcbiAqIEBwYXJhbSBldmVudE5hbWVcclxuICovXHJcbmZ1bmN0aW9uIG91dHB1dEV2ZW50IChlbGVtZW50LCBldmVudE5hbWUpIHtcclxuICBsZXQgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICBldmVudC5pbml0RXZlbnQoZXZlbnROYW1lLCB0cnVlLCB0cnVlKTtcclxuICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG59XHJcblxyXG4vLyBNYWtlIGEgZ3Vlc3NcclxuZnVuY3Rpb24gZm9jdXNGaXJzdFRhYiAodGFiKSB7XHJcbiAgZ2V0QWxsVGFic0luTGlzdCh0YWIpWyAwIF0uZm9jdXMoKTtcclxufVxyXG5cclxuLy8gTWFrZSBhIGd1ZXNzXHJcbmZ1bmN0aW9uIGZvY3VzTGFzdFRhYiAodGFiKSB7XHJcbiAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhYik7XHJcbiAgdGFic1sgdGFicy5sZW5ndGggLSAxIF0uZm9jdXMoKTtcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGFibmF2O1xyXG4iLCJjbGFzcyBUb29sdGlwe1xyXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQpe1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgIHRoaXMuc2V0RXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBzZXRFdmVudHMgKCl7XHJcbiAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICBpZih0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtdHJpZ2dlcicpICE9PSAnY2xpY2snKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB2YXIgcG9zID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC1wb3NpdGlvbicpIHx8ICd0b3AnO1xyXG5cclxuICAgICAgICB2YXIgdG9vbHRpcCA9IHRoYXQuY3JlYXRlVG9vbHRpcChlbGVtZW50LCBwb3MpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xyXG5cclxuICAgICAgICB0aGF0LnBvc2l0aW9uQXQoZWxlbWVudCwgdG9vbHRpcCwgcG9zKTtcclxuXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB2YXIgcG9zID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC1wb3NpdGlvbicpIHx8ICd0b3AnO1xyXG5cclxuICAgICAgICB2YXIgdG9vbHRpcCA9IHRoYXQuY3JlYXRlVG9vbHRpcChlbGVtZW50LCBwb3MpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xyXG5cclxuICAgICAgICB0aGF0LnBvc2l0aW9uQXQoZWxlbWVudCwgdG9vbHRpcCwgcG9zKTtcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciB0b29sdGlwID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgICBpZih0b29sdGlwICE9PSBudWxsICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApICE9PSBudWxsKXtcclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgdG9vbHRpcCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgaWYodG9vbHRpcCAhPT0gbnVsbCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSAhPT0gbnVsbCl7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcztcclxuICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgdmFyIHBvcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcclxuICAgICAgICAgIHZhciB0b29sdGlwID0gdGhhdC5jcmVhdGVUb29sdGlwKGVsZW1lbnQsIHBvcyk7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xyXG4gICAgICAgICAgdGhhdC5wb3NpdGlvbkF0KGVsZW1lbnQsIHRvb2x0aXAsIHBvcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZhciBwb3BwZXIgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwb3BwZXIpKTtcclxuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgIGlmICghZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnanMtdG9vbHRpcCcpKSB7XHJcbiAgICAgICAgdGhhdC5jbG9zZUFsbCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBjbG9zZUFsbCAoKXtcclxuICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy10b29sdGlwW2FyaWEtZGVzY3JpYmVkYnldJyk7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHBvcHBlciA9IGVsZW1lbnRzWyBpIF0uZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgIGVsZW1lbnRzWyBpIF0ucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocG9wcGVyKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNyZWF0ZVRvb2x0aXAgKGVsZW1lbnQsIHBvcykge1xyXG4gICAgdmFyIHRvb2x0aXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRvb2x0aXAuY2xhc3NOYW1lID0gJ3Rvb2x0aXAtcG9wcGVyJztcclxuICAgIHZhciBwb3BwZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1wb3BwZXInKTtcclxuICAgIHZhciBpZCA9ICd0b29sdGlwLScrcG9wcGVycy5sZW5ndGgrMTtcclxuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTtcclxuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Rvb2x0aXAnKTtcclxuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcsIHBvcyk7XHJcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIGlkKTtcclxuXHJcbiAgICB2YXIgdG9vbHRpcElubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b29sdGlwSW5uZXIuY2xhc3NOYW1lID0gJ3Rvb2x0aXAnO1xyXG5cclxuICAgIHZhciB0b29sdGlwQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdG9vbHRpcENvbnRlbnQuY2xhc3NOYW1lID0gJ3Rvb2x0aXAtY29udGVudCc7XHJcbiAgICB0b29sdGlwQ29udGVudC5pbm5lckhUTUwgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwJyk7XHJcbiAgICB0b29sdGlwSW5uZXIuYXBwZW5kQ2hpbGQodG9vbHRpcENvbnRlbnQpO1xyXG4gICAgdG9vbHRpcC5hcHBlbmRDaGlsZCh0b29sdGlwSW5uZXIpO1xyXG5cclxuICAgIHJldHVybiB0b29sdGlwO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUG9zaXRpb25zIHRoZSB0b29sdGlwLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcmVudCAtIFRoZSB0cmlnZ2VyIG9mIHRoZSB0b29sdGlwLlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSB0b29sdGlwIC0gVGhlIHRvb2x0aXAgaXRzZWxmLlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwb3NIb3Jpem9udGFsIC0gRGVzaXJlZCBob3Jpem9udGFsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKGxlZnQvY2VudGVyL3JpZ2h0KVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwb3NWZXJ0aWNhbCAtIERlc2lyZWQgdmVydGljYWwgcG9zaXRpb24gb2YgdGhlIHRvb2x0aXAgcmVsYXRpdmVseSB0byB0aGUgdHJpZ2dlciAodG9wL2NlbnRlci9ib3R0b20pXHJcbiAgICpcclxuICAgKi9cclxuICBwb3NpdGlvbkF0IChwYXJlbnQsIHRvb2x0aXAsIHBvcykge1xyXG4gICAgdmFyIHBhcmVudENvb3JkcyA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgbGVmdCwgdG9wO1xyXG4gICAgdmFyIHRvb2x0aXBXaWR0aCA9IHRvb2x0aXAub2Zmc2V0V2lkdGg7XHJcblxyXG4gICAgdmFyIGRpc3QgPSA4O1xyXG5cclxuICAgIGxlZnQgPSBwYXJzZUludChwYXJlbnRDb29yZHMubGVmdCkgKyAoKHBhcmVudC5vZmZzZXRXaWR0aCAtIHRvb2x0aXAub2Zmc2V0V2lkdGgpIC8gMik7XHJcblxyXG4gICAgc3dpdGNoIChwb3MpIHtcclxuICAgICAgY2FzZSAnYm90dG9tJzpcclxuICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMuYm90dG9tKSArIGRpc3Q7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICBjYXNlICd0b3AnOlxyXG4gICAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy50b3ApIC0gdG9vbHRpcC5vZmZzZXRIZWlnaHQgLSBkaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGxlZnQgPCAwKSB7XHJcbiAgICAgIGxlZnQgPSBwYXJzZUludChwYXJlbnRDb29yZHMubGVmdCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoKHRvcCArIHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSA+PSB3aW5kb3cuaW5uZXJIZWlnaHQpe1xyXG4gICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMudG9wKSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gZGlzdDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdG9wICA9ICh0b3AgPCAwKSA/IHBhcnNlSW50KHBhcmVudENvb3Jkcy5ib3R0b20pICsgZGlzdCA6IHRvcDtcclxuICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoIDwgKGxlZnQgKyB0b29sdGlwV2lkdGgpKXtcclxuICAgICAgdG9vbHRpcC5zdHlsZS5yaWdodCA9IGRpc3QgKyAncHgnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdG9vbHRpcC5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XHJcbiAgICB9XHJcbiAgICB0b29sdGlwLnN0eWxlLnRvcCAgPSB0b3AgKyBwYWdlWU9mZnNldCArICdweCc7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvb2x0aXA7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgQ29sbGFwc2UgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY29sbGFwc2UnKTtcclxuY29uc3QgUmFkaW9Ub2dnbGVHcm91cCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudCcpO1xyXG5jb25zdCBDaGVja2JveFRvZ2dsZUNvbnRlbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnKTtcclxuY29uc3QgRHJvcGRvd24gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZHJvcGRvd24nKTtcclxuY29uc3QgQWNjb3JkaW9uID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2FjY29yZGlvbicpO1xyXG5jb25zdCBSZXNwb25zaXZlVGFibGUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdGFibGUnKTtcclxuY29uc3QgVGFibmF2ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3RhYm5hdicpO1xyXG4vL2NvbnN0IERldGFpbHMgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGV0YWlscycpO1xyXG5jb25zdCBUb29sdGlwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3Rvb2x0aXAnKTtcclxuY29uc3QgU2V0VGFiSW5kZXggPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvc2tpcG5hdicpO1xyXG5jb25zdCBOYXZpZ2F0aW9uID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL25hdmlnYXRpb24nKTtcclxuY29uc3QgSW5wdXRSZWdleE1hc2sgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzaycpO1xyXG5cclxuXHJcbmltcG9ydCBEZXRhaWxzIGZyb20gJy4vY29tcG9uZW50cy9kZXRhaWxzJ1xyXG5cclxuLyoqXHJcbiAqIFRoZSAncG9seWZpbGxzJyBkZWZpbmUga2V5IEVDTUFTY3JpcHQgNSBtZXRob2RzIHRoYXQgbWF5IGJlIG1pc3NpbmcgZnJvbVxyXG4gKiBvbGRlciBicm93c2Vycywgc28gbXVzdCBiZSBsb2FkZWQgZmlyc3QuXHJcbiAqL1xyXG5yZXF1aXJlKCcuL3BvbHlmaWxscycpO1xyXG5cclxudmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gIG5ldyBOYXZpZ2F0aW9uKCk7XHJcblxyXG4gIGNvbnN0IGRldGFpbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtZGV0YWlscycpO1xyXG4gIGZvcihsZXQgZCA9IDA7IGQgPCBkZXRhaWxzLmxlbmd0aDsgZCsrKXtcclxuICAgIG5ldyBEZXRhaWxzKGRldGFpbHNbIGQgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QganNTZWxlY3RvclJlZ2V4ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbZGF0YS1pbnB1dC1yZWdleF0nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclJlZ2V4Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBJbnB1dFJlZ2V4TWFzayhqc1NlbGVjdG9yUmVnZXhbIGMgXSk7XHJcbiAgfVxyXG4gIGNvbnN0IGpzU2VsZWN0b3JUYWJpbmRleCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5za2lwbmF2W2hyZWZePVwiI1wiXScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFiaW5kZXgubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFNldFRhYkluZGV4KGpzU2VsZWN0b3JUYWJpbmRleFsgYyBdKTtcclxuICB9XHJcbiAgY29uc3QganNTZWxlY3RvclRvb2x0aXAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy10b29sdGlwJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JUb29sdGlwLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBUb29sdGlwKGpzU2VsZWN0b3JUb29sdGlwWyBjIF0pO1xyXG4gIH1cclxuICBjb25zdCBqc1NlbGVjdG9yVGFibmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGFibmF2Jyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JUYWJuYXYubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFRhYm5hdihqc1NlbGVjdG9yVGFibmF2WyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FjY29yZGlvbicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQWNjb3JkaW9uLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBBY2NvcmRpb24oanNTZWxlY3RvckFjY29yZGlvblsgYyBdKTtcclxuICB9XHJcbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1ib3JkZXJlZDpub3QoLmFjY29yZGlvbiknKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBBY2NvcmRpb24oanNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkWyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3QganNTZWxlY3RvclRhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGFibGU6bm90KC5kYXRhVGFibGUpJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JUYWJsZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgUmVzcG9uc2l2ZVRhYmxlKGpzU2VsZWN0b3JUYWJsZVsgYyBdKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGpzU2VsZWN0b3JDb2xsYXBzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWNvbGxhcHNlJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JDb2xsYXBzZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQ29sbGFwc2UoanNTZWxlY3RvckNvbGxhcHNlWyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3QganNTZWxlY3RvclJhZGlvQ29sbGFwc2UgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1yYWRpby10b2dnbGUtZ3JvdXAnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclJhZGlvQ29sbGFwc2UubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFJhZGlvVG9nZ2xlR3JvdXAoanNTZWxlY3RvclJhZGlvQ29sbGFwc2VbIGMgXSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWNoZWNrYm94LXRvZ2dsZS1jb250ZW50Jyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBDaGVja2JveFRvZ2dsZUNvbnRlbnQoanNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2VbIGMgXSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc1NlbGVjdG9yRHJvcGRvd24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1kcm9wZG93bicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yRHJvcGRvd24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IERyb3Bkb3duKGpzU2VsZWN0b3JEcm9wZG93blsgYyBdKTtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHsgaW5pdCwgQ29sbGFwc2UsIFJhZGlvVG9nZ2xlR3JvdXAsIENoZWNrYm94VG9nZ2xlQ29udGVudCwgRHJvcGRvd24sIFJlc3BvbnNpdmVUYWJsZSwgQWNjb3JkaW9uLCBUYWJuYXYsIFRvb2x0aXAsIFNldFRhYkluZGV4LCBOYXZpZ2F0aW9uLCBJbnB1dFJlZ2V4TWFzayB9O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGVscHJvdG8gPSB3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlO1xyXG5jb25zdCBISURERU4gPSAnaGlkZGVuJztcclxuXHJcbmlmICghKEhJRERFTiBpbiBlbHByb3RvKSkge1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbHByb3RvLCBISURERU4sIHtcclxuICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgIH0sXHJcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShISURERU4sICcnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShISURERU4pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0pO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jbGFzc0xpc3QgYW5kIERPTVRva2VuTGlzdFxyXG5yZXF1aXJlKCdjbGFzc2xpc3QtcG9seWZpbGwnKTtcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5oaWRkZW5cclxucmVxdWlyZSgnLi9lbGVtZW50LWhpZGRlbicpO1xyXG5cclxucmVxdWlyZSgnY29yZS1qcy9mbi9vYmplY3QvYXNzaWduJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vYXJyYXkvZnJvbScpOyIsIid1c2Ugc3RyaWN0JztcclxubGV0IGJyZWFrcG9pbnRzID0ge1xyXG4gICd4cyc6IDAsXHJcbiAgJ3NtJzogNTc2LFxyXG4gICdtZCc6IDc2OCxcclxuICAnbGcnOiA5OTIsXHJcbiAgJ3hsJzogMTIwMFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBicmVha3BvaW50cztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIGNsb3Nlc3RcclxuICogQGRlc2MgZ2V0IG5lYXJlc3QgcGFyZW50IGVsZW1lbnQgbWF0Y2hpbmcgc2VsZWN0b3IuXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gVGhlIEhUTUwgZWxlbWVudCB3aGVyZSB0aGUgc2VhcmNoIHN0YXJ0cy5cclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gU2VsZWN0b3IgdG8gYmUgZm91bmQuXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSAtIE5lYXJlc3QgcGFyZW50IGVsZW1lbnQgbWF0Y2hpbmcgc2VsZWN0b3IuXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNsb3Nlc3QgKGVsLCBzZWxlY3Rvcikge1xyXG4gIHZhciBtYXRjaGVzU2VsZWN0b3IgPSBlbC5tYXRjaGVzIHx8IGVsLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBlbC5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgZWwubXNNYXRjaGVzU2VsZWN0b3I7XHJcblxyXG4gIHdoaWxlIChlbCkge1xyXG4gICAgICBpZiAobWF0Y2hlc1NlbGVjdG9yLmNhbGwoZWwsIHNlbGVjdG9yKSkge1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xyXG4gIH1cclxuICByZXR1cm4gZWw7XHJcbn07XHJcbiIsIi8vIFVzZWQgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgc3RyaW5nLCBhbGxvd3MgbXVsdGlwbGUgaW5zdGFuY2VzIG9mIHRoZSBjb21wb25lbnQgd2l0aG91dFxyXG4vLyBUaGVtIGNvbmZsaWN0aW5nIHdpdGggZWFjaCBvdGhlci5cclxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg4MDk0NzJcclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVW5pcXVlSUQgKCkge1xyXG4gIHZhciBkID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuICBpZiAodHlwZW9mIHdpbmRvdy5wZXJmb3JtYW5jZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGQgKz0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIC8vIHVzZSBoaWdoLXByZWNpc2lvbiB0aW1lciBpZiBhdmFpbGFibGVcclxuICB9XHJcbiAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcclxuICAgIHZhciByID0gKGQgKyBNYXRoLnJhbmRvbSgpICogMTYpICUgMTYgfCAwXHJcbiAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpXHJcbiAgICByZXR1cm4gKGMgPT09ICd4JyA/IHIgOiAociAmIDB4MyB8IDB4OCkpLnRvU3RyaW5nKDE2KVxyXG4gIH0pXHJcbn1cclxuIiwiLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzNcclxuZnVuY3Rpb24gaXNFbGVtZW50SW5WaWV3cG9ydCAoZWwsIHdpbj13aW5kb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICByZWN0LnRvcCA+PSAwICYmXHJcbiAgICByZWN0LmxlZnQgPj0gMCAmJlxyXG4gICAgcmVjdC5ib3R0b20gPD0gKHdpbi5pbm5lckhlaWdodCB8fCBkb2NFbC5jbGllbnRIZWlnaHQpICYmXHJcbiAgICByZWN0LnJpZ2h0IDw9ICh3aW4uaW5uZXJXaWR0aCB8fCBkb2NFbC5jbGllbnRXaWR0aClcclxuICApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudEluVmlld3BvcnQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBpc0VsZW1lbnRcclxuICogQGRlc2MgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudC5cclxuICogQHBhcmFtIHthbnl9IHZhbHVlXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VsZW1lbnQgPSB2YWx1ZSA9PiB7XHJcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUubm9kZVR5cGUgPT09IDE7XHJcbn07XHJcblxyXG4vKipcclxuICogQG5hbWUgc2VsZWN0XHJcbiAqIEBkZXNjIHNlbGVjdHMgZWxlbWVudHMgZnJvbSB0aGUgRE9NIGJ5IGNsYXNzIHNlbGVjdG9yIG9yIElEIHNlbGVjdG9yLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBUaGUgc2VsZWN0b3IgdG8gdHJhdmVyc2UgdGhlIERPTSB3aXRoLlxyXG4gKiBAcGFyYW0ge0RvY3VtZW50fEhUTUxFbGVtZW50P30gY29udGV4dCAtIFRoZSBjb250ZXh0IHRvIHRyYXZlcnNlIHRoZSBET01cclxuICogICBpbi4gSWYgbm90IHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byB0aGUgZG9jdW1lbnQuXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50W119IC0gQW4gYXJyYXkgb2YgRE9NIG5vZGVzIG9yIGFuIGVtcHR5IGFycmF5LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZWxlY3QgKHNlbGVjdG9yLCBjb250ZXh0KSB7XHJcblxyXG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBpZiAoIWNvbnRleHQgfHwgIWlzRWxlbWVudChjb250ZXh0KSkge1xyXG4gICAgY29udGV4dCA9IHdpbmRvdy5kb2N1bWVudDtcclxuICB9XHJcblxyXG4gIGNvbnN0IHNlbGVjdGlvbiA9IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGVjdGlvbik7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XHJcbmNvbnN0IENPTlRST0xTID0gJ2FyaWEtY29udHJvbHMnO1xyXG5jb25zdCBISURERU4gPSAnYXJpYS1oaWRkZW4nO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoYnV0dG9uLCBleHBhbmRlZCkgPT4ge1xyXG5cclxuICBpZiAodHlwZW9mIGV4cGFuZGVkICE9PSAnYm9vbGVhbicpIHtcclxuICAgIGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICdmYWxzZSc7XHJcbiAgfVxyXG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoRVhQQU5ERUQsIGV4cGFuZGVkKTtcclxuICBjb25zdCBpZCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoQ09OVFJPTFMpO1xyXG4gIGNvbnN0IGNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gIGlmICghY29udHJvbHMpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgJ05vIHRvZ2dsZSB0YXJnZXQgZm91bmQgd2l0aCBpZDogXCInICsgaWQgKyAnXCInXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29udHJvbHMuc2V0QXR0cmlidXRlKEhJRERFTiwgIWV4cGFuZGVkKTtcclxuICByZXR1cm4gZXhwYW5kZWQ7XHJcbn07XHJcbiJdfQ==
