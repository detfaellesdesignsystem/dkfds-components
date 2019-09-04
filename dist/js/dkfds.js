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

var domready = require('domready');

/**
 * Import modal lib.
 * https://micromodal.now.sh
 */
var microModal = require("../../vendor/micromodal.js");
domready(function () {
  microModal.init({
    onShow: function onShow() {
      document.getElementsByTagName('body')[0].classList.add('modal-active');
    },
    onClose: function onClose() {
      document.getElementsByTagName('body')[0].classList.remove('modal-active');
    }
  }); //init all modals
});

},{"../../vendor/micromodal.js":90,"domready":60}],74:[function(require,module,exports){
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

},{"../../vendor/tippyjs/tippy.js":91,"../utils/select":88,"domready":60}],80:[function(require,module,exports){
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
var modal = require('./components/modal');
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

  var jsSelectorAccordion = document.getElementsByClassName('accordion');
  for (var c = 0; c < jsSelectorAccordion.length; c++) {
    new Accordion(jsSelectorAccordion[c]);
  }
  var jsSelectorAccordionBordered = document.querySelectorAll('.accordion-bordered:not(.accordion)');
  for (var _c = 0; _c < jsSelectorAccordionBordered.length; _c++) {
    new Accordion(jsSelectorAccordionBordered[_c]);
  }

  var jsSelectorTable = document.querySelectorAll('table:not(.dataTable)');
  for (var _c2 = 0; _c2 < jsSelectorTable.length; _c2++) {
    new ResponsiveTable(jsSelectorTable[_c2]);
  }

  var jsSelectorCollapse = document.getElementsByClassName('js-collapse');
  for (var _c3 = 0; _c3 < jsSelectorCollapse.length; _c3++) {
    new Collapse(jsSelectorCollapse[_c3]);
  }

  var jsSelectorRadioCollapse = document.getElementsByClassName('js-radio-toggle-group');
  for (var _c4 = 0; _c4 < jsSelectorRadioCollapse.length; _c4++) {
    new RadioToggleGroup(jsSelectorRadioCollapse[_c4]);
  }

  var jsSelectorCheckboxCollapse = document.getElementsByClassName('js-checkbox-toggle-content');
  for (var _c5 = 0; _c5 < jsSelectorCheckboxCollapse.length; _c5++) {
    new CheckboxToggleContent(jsSelectorCheckboxCollapse[_c5]);
  }
  var jsSelectorDropdown = document.getElementsByClassName('js-dropdown');
  for (var _c6 = 0; _c6 < jsSelectorDropdown.length; _c6++) {
    new Dropdown(jsSelectorDropdown[_c6]);
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
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.MicroModal = factory();
})(undefined, function () {
  'use strict';

  var version = "0.3.1";

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

  var toConsumableArray = function toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var MicroModal = function () {

    var FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', 'select:not([disabled]):not([aria-hidden])', 'textarea:not([disabled]):not([aria-hidden])', 'button:not([disabled]):not([aria-hidden])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];

    var Modal = function () {
      function Modal(_ref) {
        var targetModal = _ref.targetModal,
            _ref$triggers = _ref.triggers,
            triggers = _ref$triggers === undefined ? [] : _ref$triggers,
            _ref$onShow = _ref.onShow,
            onShow = _ref$onShow === undefined ? function () {} : _ref$onShow,
            _ref$onClose = _ref.onClose,
            onClose = _ref$onClose === undefined ? function () {} : _ref$onClose,
            _ref$openTrigger = _ref.openTrigger,
            openTrigger = _ref$openTrigger === undefined ? 'data-micromodal-trigger' : _ref$openTrigger,
            _ref$closeTrigger = _ref.closeTrigger,
            closeTrigger = _ref$closeTrigger === undefined ? 'data-micromodal-close' : _ref$closeTrigger,
            _ref$disableScroll = _ref.disableScroll,
            disableScroll = _ref$disableScroll === undefined ? false : _ref$disableScroll,
            _ref$disableFocus = _ref.disableFocus,
            disableFocus = _ref$disableFocus === undefined ? false : _ref$disableFocus,
            _ref$awaitCloseAnimat = _ref.awaitCloseAnimation,
            awaitCloseAnimation = _ref$awaitCloseAnimat === undefined ? false : _ref$awaitCloseAnimat,
            _ref$debugMode = _ref.debugMode,
            debugMode = _ref$debugMode === undefined ? false : _ref$debugMode;
        classCallCheck(this, Modal);

        // Save a reference of the modal
        this.modal = document.getElementById(targetModal);

        // Save a reference to the passed config
        this.config = { debugMode: debugMode, disableScroll: disableScroll, openTrigger: openTrigger, closeTrigger: closeTrigger, onShow: onShow, onClose: onClose, awaitCloseAnimation: awaitCloseAnimation, disableFocus: disableFocus

          // Register click events only if prebinding eventListeners
        };if (triggers.length > 0) this.registerTriggers.apply(this, toConsumableArray(triggers));

        // prebind functions for event listeners
        this.onClick = this.onClick.bind(this);
        this.onKeydown = this.onKeydown.bind(this);
      }

      /**
       * Loops through all openTriggers and binds click event
       * @param  {array} triggers [Array of node elements]
       * @return {void}
       */

      createClass(Modal, [{
        key: 'registerTriggers',
        value: function registerTriggers() {
          var _this = this;

          for (var _len = arguments.length, triggers = Array(_len), _key = 0; _key < _len; _key++) {
            triggers[_key] = arguments[_key];
          }

          triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function () {
              return _this.showModal();
            });
          });
        }
      }, {
        key: 'showModal',
        value: function showModal() {
          this.activeElement = document.activeElement;
          this.modal.setAttribute('aria-hidden', 'false');
          this.modal.classList.add('is-open');
          this.setFocusToFirstNode();
          this.scrollBehaviour('disable');
          this.addEventListeners();
          this.config.onShow(this.modal);
        }
      }, {
        key: 'closeModal',
        value: function closeModal() {
          var modal = this.modal;
          this.modal.setAttribute('aria-hidden', 'true');
          this.removeEventListeners();
          this.scrollBehaviour('enable');
          this.activeElement.focus();
          this.config.onClose(this.modal);

          if (this.config.awaitCloseAnimation) {
            this.modal.addEventListener('animationend', function handler() {
              modal.classList.remove('is-open');
              modal.removeEventListener('animationend', handler, false);
            }, false);
          } else {
            modal.classList.remove('is-open');
          }
        }
      }, {
        key: 'scrollBehaviour',
        value: function scrollBehaviour(toggle) {
          if (!this.config.disableScroll) return;
          var body = document.querySelector('body');
          switch (toggle) {
            case 'enable':
              Object.assign(body.style, { overflow: 'initial', height: 'initial' });
              break;
            case 'disable':
              Object.assign(body.style, { overflow: 'hidden', height: '100vh' });
              break;
            default:
          }
        }
      }, {
        key: 'addEventListeners',
        value: function addEventListeners() {
          this.modal.addEventListener('touchstart', this.onClick);
          this.modal.addEventListener('click', this.onClick);
          document.addEventListener('keydown', this.onKeydown);
        }
      }, {
        key: 'removeEventListeners',
        value: function removeEventListeners() {
          this.modal.removeEventListener('touchstart', this.onClick);
          this.modal.removeEventListener('click', this.onClick);
          document.removeEventListener('keydown', this.onKeydown);
        }
      }, {
        key: 'onClick',
        value: function onClick(event) {
          if (event.target.hasAttribute(this.config.closeTrigger)) {
            this.closeModal();
            event.preventDefault();
          }
        }
      }, {
        key: 'onKeydown',
        value: function onKeydown(event) {
          if (event.keyCode === 27) this.closeModal(event);
          if (event.keyCode === 9) this.maintainFocus(event);
        }
      }, {
        key: 'getFocusableNodes',
        value: function getFocusableNodes() {
          var nodes = this.modal.querySelectorAll(FOCUSABLE_ELEMENTS);
          return Object.keys(nodes).map(function (key) {
            return nodes[key];
          });
        }
      }, {
        key: 'setFocusToFirstNode',
        value: function setFocusToFirstNode() {
          if (this.config.disableFocus) return;
          var focusableNodes = this.getFocusableNodes();
          if (focusableNodes.length) focusableNodes[0].focus();
        }
      }, {
        key: 'maintainFocus',
        value: function maintainFocus(event) {
          var focusableNodes = this.getFocusableNodes();

          // if disableFocus is true
          if (!this.modal.contains(document.activeElement)) {
            focusableNodes[0].focus();
          } else {
            var focusedItemIndex = focusableNodes.indexOf(document.activeElement);

            if (event.shiftKey && focusedItemIndex === 0) {
              focusableNodes[focusableNodes.length - 1].focus();
              event.preventDefault();
            }

            if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
              focusableNodes[0].focus();
              event.preventDefault();
            }
          }
        }
      }]);
      return Modal;
    }();

    /**
     * Modal prototype ends.
     * Here on code is reposible for detecting and
     * autobinding event handlers on modal triggers
     */

    // Keep a reference to the opened modal


    var activeModal = null;

    /**
     * Generates an associative array of modals and it's
     * respective triggers
     * @param  {array} triggers     An array of all triggers
     * @param  {string} triggerAttr The data-attribute which triggers the module
     * @return {array}
     */
    var generateTriggerMap = function generateTriggerMap(triggers, triggerAttr) {
      var triggerMap = [];

      triggers.forEach(function (trigger) {
        var targetModal = trigger.attributes[triggerAttr].value;
        if (triggerMap[targetModal] === undefined) triggerMap[targetModal] = [];
        triggerMap[targetModal].push(trigger);
      });

      return triggerMap;
    };

    /**
     * Validates whether a modal of the given id exists
     * in the DOM
     * @param  {number} id  The id of the modal
     * @return {boolean}
     */
    var validateModalPresence = function validateModalPresence(id) {
      if (!document.getElementById(id)) {
        console.warn('MicroModal v' + version + ': \u2757Seems like you have missed %c\'' + id + '\'', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'ID somewhere in your code. Refer example below to resolve it.');
        console.warn('%cExample:', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', '<div class="modal" id="' + id + '"></div>');
        return false;
      }
    };

    /**
     * Validates if there are modal triggers present
     * in the DOM
     * @param  {array} triggers An array of data-triggers
     * @return {boolean}
     */
    var validateTriggerPresence = function validateTriggerPresence(triggers) {
      if (triggers.length <= 0) {
        console.warn('MicroModal v' + version + ': \u2757Please specify at least one %c\'micromodal-trigger\'', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'data attribute.');
        console.warn('%cExample:', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', '<a href="#" data-micromodal-trigger="my-modal"></a>');
        return false;
      }
    };

    /**
     * Checks if triggers and their corresponding modals
     * are present in the DOM
     * @param  {array} triggers   Array of DOM nodes which have data-triggers
     * @param  {array} triggerMap Associative array of modals and thier triggers
     * @return {boolean}
     */
    var validateArgs = function validateArgs(triggers, triggerMap) {
      validateTriggerPresence(triggers);
      if (!triggerMap) return true;
      for (var id in triggerMap) {
        validateModalPresence(id);
      }return true;
    };

    /**
     * Binds click handlers to all modal triggers
     * @param  {object} config [description]
     * @return void
     */
    var init = function init(config) {
      // Create an config object with default openTrigger
      var options = Object.assign({}, { openTrigger: 'data-micromodal-trigger' }, config);

      // Collects all the nodes with the trigger
      var triggers = [].concat(toConsumableArray(document.querySelectorAll('[' + options.openTrigger + ']')));

      // Makes a mappings of modals with their trigger nodes
      var triggerMap = generateTriggerMap(triggers, options.openTrigger);

      // Checks if modals and triggers exist in dom
      if (options.debugMode === true && validateArgs(triggers, triggerMap) === false) return;

      // For every target modal creates a new instance
      for (var key in triggerMap) {
        var value = triggerMap[key];
        options.targetModal = key;
        options.triggers = [].concat(toConsumableArray(value));
        new Modal(options); // eslint-disable-line no-new
      }
    };

    /**
     * Shows a particular modal
     * @param  {string} targetModal [The id of the modal to display]
     * @param  {object} config [The configuration object to pass]
     * @return {void}
     */
    var show = function show(targetModal, config) {
      var options = config || {};
      options.targetModal = targetModal;

      // Checks if modals and triggers exist in dom
      if (options.debugMode === true && validateModalPresence(targetModal) === false) return;

      // stores reference to active modal
      activeModal = new Modal(options); // eslint-disable-line no-new
      activeModal.showModal();
    };

    /**
     * Closes the active modal
     * @return {void}
     */
    var close = function close() {
      activeModal.closeModal();
    };

    return { init: init, show: show, close: close };
  }();

  return MicroModal;
});

},{}],91:[function(require,module,exports){
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9kb21yZWFkeS9yZWFkeS5qcyIsIm5vZGVfbW9kdWxlcy9lbGVtZW50LWNsb3Nlc3QvZWxlbWVudC1jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvYmVoYXZpb3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvY29tcG9zZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9kZWxlZ2F0ZUFsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9kZWxlZ2F0ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9vbmNlL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWNjb3JkaW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jb2xsYXBzZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvaW5kZXguanMiLCJzcmMvanMvY29tcG9uZW50cy9tb2RhbC5qcyIsInNyYy9qcy9jb21wb25lbnRzL25hdmlnYXRpb24uanMiLCJzcmMvanMvY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JlZ2V4LWlucHV0LW1hc2suanMiLCJzcmMvanMvY29tcG9uZW50cy9za2lwbmF2LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90b29sdGlwLmpzIiwic3JjL2pzL2NvbmZpZy5qcyIsInNyYy9qcy9ka2Zkcy5qcyIsInNyYy9qcy9ldmVudHMuanMiLCJzcmMvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwic3JjL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInNyYy9qcy91dGlscy9iZWhhdmlvci5qcyIsInNyYy9qcy91dGlscy9jbG9zZXN0LmpzIiwic3JjL2pzL3V0aWxzL2lzLWluLXZpZXdwb3J0LmpzIiwic3JjL2pzL3V0aWxzL3NlbGVjdC5qcyIsInNyYy9qcy91dGlscy90b2dnbGUuanMiLCJzcmMvdmVuZG9yL21pY3JvbW9kYWwuanMiLCJzcmMvdmVuZG9yL3RpcHB5anMvdGlwcHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxPQUFULENBQWtCLEdBQWxCLEVBQXVCLFFBQXZCLEVBQWlDLE9BQWpDLEVBQTBDO0FBQ3ZELFFBQUksSUFBSSxPQUFSLEVBQWlCO0FBQ2IsWUFBSSxPQUFKLENBQVksUUFBWixFQUFzQixPQUF0QjtBQUNBO0FBQ0g7QUFDRCxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksSUFBSSxNQUF4QixFQUFnQyxLQUFHLENBQW5DLEVBQXNDO0FBQ2xDLGlCQUFTLElBQVQsQ0FBYyxPQUFkLEVBQXVCLElBQUksQ0FBSixDQUF2QixFQUErQixDQUEvQixFQUFrQyxHQUFsQztBQUNIO0FBQ0osQ0FSRDs7Ozs7QUNiQTs7Ozs7Ozs7O0FBU0E7O0FBRUE7O0FBRUEsSUFBSSxjQUFjLE9BQU8sSUFBekIsRUFBK0I7O0FBRS9CO0FBQ0E7QUFDQSxLQUFJLEVBQUUsZUFBZSxTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBakIsS0FDQSxTQUFTLGVBQVQsSUFBNEIsRUFBRSxlQUFlLFNBQVMsZUFBVCxDQUF5Qiw0QkFBekIsRUFBc0QsR0FBdEQsQ0FBakIsQ0FEaEMsRUFDOEc7O0FBRTdHLGFBQVUsSUFBVixFQUFnQjs7QUFFakI7O0FBRUEsT0FBSSxFQUFFLGFBQWEsSUFBZixDQUFKLEVBQTBCOztBQUUxQixPQUNHLGdCQUFnQixXQURuQjtBQUFBLE9BRUcsWUFBWSxXQUZmO0FBQUEsT0FHRyxlQUFl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LFVBQVEsR0FBUixHQUFjLFVBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QjtBQUN6QyxXQUFPLFFBQVEsUUFBUixFQUFrQixPQUFsQixFQUEyQixJQUEzQixFQUFpQyxRQUFqQyxDQUEwQyxDQUExQyxDQUFQO0FBQ0QsR0FGRDtBQUdBLFVBQVEsaUJBQVIsR0FBNEIsWUFBWTtBQUN0QyxhQUFTLGNBQVQsR0FBMEIsU0FBUyxRQUFULEdBQW9CLENBQTlDO0FBQ0EsYUFBUyxXQUFULEdBQXVCLEtBQXZCO0FBQ0QsR0FIRDs7QUFLQSxTQUFPLE9BQVA7QUFFQyxDQTdwSUEsQ0FBRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogYXJyYXktZm9yZWFjaFxuICogICBBcnJheSNmb3JFYWNoIHBvbnlmaWxsIGZvciBvbGRlciBicm93c2Vyc1xuICogICAoUG9ueWZpbGw6IEEgcG9seWZpbGwgdGhhdCBkb2Vzbid0IG92ZXJ3cml0ZSB0aGUgbmF0aXZlIG1ldGhvZClcbiAqIFxuICogaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2hcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtMjAxNiBUYWt1dG8gV2FkYVxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogICBodHRwczovL2dpdGh1Yi5jb20vdHdhZGEvYXJyYXktZm9yZWFjaC9ibG9iL21hc3Rlci9NSVQtTElDRU5TRVxuICovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZm9yRWFjaCAoYXJ5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGlmIChhcnkuZm9yRWFjaCkge1xuICAgICAgICBhcnkuZm9yRWFjaChjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnkubGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgYXJ5W2ldLCBpLCBhcnkpO1xuICAgIH1cbn07XG4iLCIvKlxuICogY2xhc3NMaXN0LmpzOiBDcm9zcy1icm93c2VyIGZ1bGwgZWxlbWVudC5jbGFzc0xpc3QgaW1wbGVtZW50YXRpb24uXG4gKiAxLjEuMjAxNzA0MjdcbiAqXG4gKiBCeSBFbGkgR3JleSwgaHR0cDovL2VsaWdyZXkuY29tXG4gKiBMaWNlbnNlOiBEZWRpY2F0ZWQgdG8gdGhlIHB1YmxpYyBkb21haW4uXG4gKiAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuICovXG5cbi8qZ2xvYmFsIHNlbGYsIGRvY3VtZW50LCBET01FeGNlcHRpb24gKi9cblxuLyohIEBzb3VyY2UgaHR0cDovL3B1cmwuZWxpZ3JleS5jb20vZ2l0aHViL2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9jbGFzc0xpc3QuanMgKi9cblxuaWYgKFwiZG9jdW1lbnRcIiBpbiB3aW5kb3cuc2VsZikge1xuXG4vLyBGdWxsIHBvbHlmaWxsIGZvciBicm93c2VycyB3aXRoIG5vIGNsYXNzTGlzdCBzdXBwb3J0XG4vLyBJbmNsdWRpbmcgSUUgPCBFZGdlIG1pc3NpbmcgU1ZHRWxlbWVudC5jbGFzc0xpc3RcbmlmICghKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIikpIFxuXHR8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgJiYgIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpKSkge1xuXG4oZnVuY3Rpb24gKHZpZXcpIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmlmICghKCdFbGVtZW50JyBpbiB2aWV3KSkgcmV0dXJuO1xuXG52YXJcblx0ICBjbGFzc0xpc3RQcm9wID0gXCJjbGFzc0xpc3RcIlxuXHQsIHByb3RvUHJvcCA9IFwicHJvdG90eXBlXCJcblx0LCBlbGVtQ3RyUHJvdG8gPSB2aWV3LkVsZW1lbnRbcHJvdG9Qcm9wXVxuXHQsIG9iakN0ciA9IE9iamVjdFxuXHQsIHN0clRyaW0gPSBTdHJpbmdbcHJvdG9Qcm9wXS50cmltIHx8IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKTtcblx0fVxuXHQsIGFyckluZGV4T2YgPSBBcnJheVtwcm90b1Byb3BdLmluZGV4T2YgfHwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgaSA9IDBcblx0XHRcdCwgbGVuID0gdGhpcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gLTE7XG5cdH1cblx0Ly8gVmVuZG9yczogcGxlYXNlIGFsbG93IGNvbnRlbnQgY29kZSB0byBpbnN0YW50aWF0ZSBET01FeGNlcHRpb25zXG5cdCwgRE9NRXggPSBmdW5jdGlvbiAodHlwZSwgbWVzc2FnZSkge1xuXHRcdHRoaXMubmFtZSA9IHR5cGU7XG5cdFx0dGhpcy5jb2RlID0gRE9NRXhjZXB0aW9uW3R5cGVdO1xuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdH1cblx0LCBjaGVja1Rva2VuQW5kR2V0SW5kZXggPSBmdW5jdGlvbiAoY2xhc3NMaXN0LCB0b2tlbikge1xuXHRcdGlmICh0b2tlbiA9PT0gXCJcIikge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiU1lOVEFYX0VSUlwiXG5cdFx0XHRcdCwgXCJBbiBpbnZhbGlkIG9yIGlsbGVnYWwgc3RyaW5nIHdhcyBzcGVjaWZpZWRcIlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0aWYgKC9cXHMvLnRlc3QodG9rZW4pKSB7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdCAgXCJJTlZBTElEX0NIQVJBQ1RFUl9FUlJcIlxuXHRcdFx0XHQsIFwiU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiBhcnJJbmRleE9mLmNhbGwoY2xhc3NMaXN0LCB0b2tlbik7XG5cdH1cblx0LCBDbGFzc0xpc3QgPSBmdW5jdGlvbiAoZWxlbSkge1xuXHRcdHZhclxuXHRcdFx0ICB0cmltbWVkQ2xhc3NlcyA9IHN0clRyaW0uY2FsbChlbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpXG5cdFx0XHQsIGNsYXNzZXMgPSB0cmltbWVkQ2xhc3NlcyA/IHRyaW1tZWRDbGFzc2VzLnNwbGl0KC9cXHMrLykgOiBbXVxuXHRcdFx0LCBpID0gMFxuXHRcdFx0LCBsZW4gPSBjbGFzc2VzLmxlbmd0aFxuXHRcdDtcblx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHR0aGlzLnB1c2goY2xhc3Nlc1tpXSk7XG5cdFx0fVxuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy50b1N0cmluZygpKTtcblx0XHR9O1xuXHR9XG5cdCwgY2xhc3NMaXN0UHJvdG8gPSBDbGFzc0xpc3RbcHJvdG9Qcm9wXSA9IFtdXG5cdCwgY2xhc3NMaXN0R2V0dGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBuZXcgQ2xhc3NMaXN0KHRoaXMpO1xuXHR9XG47XG4vLyBNb3N0IERPTUV4Y2VwdGlvbiBpbXBsZW1lbnRhdGlvbnMgZG9uJ3QgYWxsb3cgY2FsbGluZyBET01FeGNlcHRpb24ncyB0b1N0cmluZygpXG4vLyBvbiBub24tRE9NRXhjZXB0aW9ucy4gRXJyb3IncyB0b1N0cmluZygpIGlzIHN1ZmZpY2llbnQgaGVyZS5cbkRPTUV4W3Byb3RvUHJvcF0gPSBFcnJvcltwcm90b1Byb3BdO1xuY2xhc3NMaXN0UHJvdG8uaXRlbSA9IGZ1bmN0aW9uIChpKSB7XG5cdHJldHVybiB0aGlzW2ldIHx8IG51bGw7XG59O1xuY2xhc3NMaXN0UHJvdG8uY29udGFpbnMgPSBmdW5jdGlvbiAodG9rZW4pIHtcblx0dG9rZW4gKz0gXCJcIjtcblx0cmV0dXJuIGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgIT09IC0xO1xufTtcbmNsYXNzTGlzdFByb3RvLmFkZCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHQ7XG5cdGRvIHtcblx0XHR0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG5cdFx0aWYgKGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgPT09IC0xKSB7XG5cdFx0XHR0aGlzLnB1c2godG9rZW4pO1xuXHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cdHdoaWxlICgrK2kgPCBsKTtcblxuXHRpZiAodXBkYXRlZCkge1xuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHR2YXJcblx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdCwgaSA9IDBcblx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0LCB0b2tlblxuXHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdFx0LCBpbmRleFxuXHQ7XG5cdGRvIHtcblx0XHR0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG5cdFx0aW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xuXHRcdHdoaWxlIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0aW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnRvZ2dsZSA9IGZ1bmN0aW9uICh0b2tlbiwgZm9yY2UpIHtcblx0dG9rZW4gKz0gXCJcIjtcblxuXHR2YXJcblx0XHQgIHJlc3VsdCA9IHRoaXMuY29udGFpbnModG9rZW4pXG5cdFx0LCBtZXRob2QgPSByZXN1bHQgP1xuXHRcdFx0Zm9yY2UgIT09IHRydWUgJiYgXCJyZW1vdmVcIlxuXHRcdDpcblx0XHRcdGZvcmNlICE9PSBmYWxzZSAmJiBcImFkZFwiXG5cdDtcblxuXHRpZiAobWV0aG9kKSB7XG5cdFx0dGhpc1ttZXRob2RdKHRva2VuKTtcblx0fVxuXG5cdGlmIChmb3JjZSA9PT0gdHJ1ZSB8fCBmb3JjZSA9PT0gZmFsc2UpIHtcblx0XHRyZXR1cm4gZm9yY2U7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuICFyZXN1bHQ7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuam9pbihcIiBcIik7XG59O1xuXG5pZiAob2JqQ3RyLmRlZmluZVByb3BlcnR5KSB7XG5cdHZhciBjbGFzc0xpc3RQcm9wRGVzYyA9IHtcblx0XHQgIGdldDogY2xhc3NMaXN0R2V0dGVyXG5cdFx0LCBlbnVtZXJhYmxlOiB0cnVlXG5cdFx0LCBjb25maWd1cmFibGU6IHRydWVcblx0fTtcblx0dHJ5IHtcblx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdH0gY2F0Y2ggKGV4KSB7IC8vIElFIDggZG9lc24ndCBzdXBwb3J0IGVudW1lcmFibGU6dHJ1ZVxuXHRcdC8vIGFkZGluZyB1bmRlZmluZWQgdG8gZmlnaHQgdGhpcyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvaXNzdWVzLzM2XG5cdFx0Ly8gbW9kZXJuaWUgSUU4LU1TVzcgbWFjaGluZSBoYXMgSUU4IDguMC42MDAxLjE4NzAyIGFuZCBpcyBhZmZlY3RlZFxuXHRcdGlmIChleC5udW1iZXIgPT09IHVuZGVmaW5lZCB8fCBleC5udW1iZXIgPT09IC0weDdGRjVFQzU0KSB7XG5cdFx0XHRjbGFzc0xpc3RQcm9wRGVzYy5lbnVtZXJhYmxlID0gZmFsc2U7XG5cdFx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdFx0fVxuXHR9XG59IGVsc2UgaWYgKG9iakN0cltwcm90b1Byb3BdLl9fZGVmaW5lR2V0dGVyX18pIHtcblx0ZWxlbUN0clByb3RvLl9fZGVmaW5lR2V0dGVyX18oY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0R2V0dGVyKTtcbn1cblxufSh3aW5kb3cuc2VsZikpO1xuXG59XG5cbi8vIFRoZXJlIGlzIGZ1bGwgb3IgcGFydGlhbCBuYXRpdmUgY2xhc3NMaXN0IHN1cHBvcnQsIHNvIGp1c3QgY2hlY2sgaWYgd2UgbmVlZFxuLy8gdG8gbm9ybWFsaXplIHRoZSBhZGQvcmVtb3ZlIGFuZCB0b2dnbGUgQVBJcy5cblxuKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIik7XG5cblx0dGVzdEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImMxXCIsIFwiYzJcIik7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwLzExIGFuZCBGaXJlZm94IDwyNiwgd2hlcmUgY2xhc3NMaXN0LmFkZCBhbmRcblx0Ly8gY2xhc3NMaXN0LnJlbW92ZSBleGlzdCBidXQgc3VwcG9ydCBvbmx5IG9uZSBhcmd1bWVudCBhdCBhIHRpbWUuXG5cdGlmICghdGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzJcIikpIHtcblx0XHR2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24obWV0aG9kKSB7XG5cdFx0XHR2YXIgb3JpZ2luYWwgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF07XG5cblx0XHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHRva2VuKSB7XG5cdFx0XHRcdHZhciBpLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRcdHRva2VuID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0XHRcdG9yaWdpbmFsLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0Y3JlYXRlTWV0aG9kKCdhZGQnKTtcblx0XHRjcmVhdGVNZXRob2QoJ3JlbW92ZScpO1xuXHR9XG5cblx0dGVzdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImMzXCIsIGZhbHNlKTtcblxuXHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAgYW5kIEZpcmVmb3ggPDI0LCB3aGVyZSBjbGFzc0xpc3QudG9nZ2xlIGRvZXMgbm90XG5cdC8vIHN1cHBvcnQgdGhlIHNlY29uZCBhcmd1bWVudC5cblx0aWYgKHRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMzXCIpKSB7XG5cdFx0dmFyIF90b2dnbGUgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZTtcblxuXHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24odG9rZW4sIGZvcmNlKSB7XG5cdFx0XHRpZiAoMSBpbiBhcmd1bWVudHMgJiYgIXRoaXMuY29udGFpbnModG9rZW4pID09PSAhZm9yY2UpIHtcblx0XHRcdFx0cmV0dXJuIGZvcmNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIF90b2dnbGUuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9XG5cblx0dGVzdEVsZW1lbnQgPSBudWxsO1xufSgpKTtcblxufVxuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5hcnJheS5mcm9tJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5BcnJheS5mcm9tO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmFzc2lnbjtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICh0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuIiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcbi8vIEVTMyB3cm9uZyBoZXJlXG52YXIgQVJHID0gY29mKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59O1xuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHsgdmVyc2lvbjogJzIuNS43JyB9O1xuaWYgKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpIF9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIGluZGV4LCB2YWx1ZSkge1xuICBpZiAoaW5kZXggaW4gb2JqZWN0KSAkZGVmaW5lUHJvcGVydHkuZihvYmplY3QsIGluZGV4LCBjcmVhdGVEZXNjKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W2luZGV4XSA9IHZhbHVlO1xufTtcbiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCB0aGF0LCBsZW5ndGgpIHtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYgKHRoYXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZuO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoLyogLi4uYXJncyAqLykge1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTtcbiIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG4vLyB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0JyBpbiBvbGQgSUVcbnZhciBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIHRhcmdldCA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSB8fCAoZ2xvYmFsW25hbWVdID0ge30pIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSk7XG4gIHZhciBrZXksIG93biwgb3V0LCBleHA7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZXhwID0gSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIGlmICh0YXJnZXQpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBvdXQsIHR5cGUgJiAkZXhwb3J0LlUpO1xuICAgIC8vIGV4cG9ydFxuICAgIGlmIChleHBvcnRzW2tleV0gIT0gb3V0KSBoaWRlKGV4cG9ydHMsIGtleSwgZXhwKTtcbiAgICBpZiAoSVNfUFJPVE8gJiYgZXhwUHJvdG9ba2V5XSAhPSBvdXQpIGV4cFByb3RvW2tleV0gPSBvdXQ7XG4gIH1cbn07XG5nbG9iYWwuY29yZSA9IGNvcmU7XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZiAodHlwZW9mIF9fZyA9PSAnbnVtYmVyJykgX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuIiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcykge1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkgYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBkZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KSB7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwgeyBuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpIH0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgJGl0ZXJDcmVhdGUgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpOyAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG52YXIgRkZfSVRFUkFUT1IgPSAnQEBpdGVyYXRvcic7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICBpZiAoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pIHJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTO1xuICB2YXIgVkFMVUVTX0JVRyA9IGZhbHNlO1xuICB2YXIgcHJvdG8gPSBCYXNlLnByb3RvdHlwZTtcbiAgdmFyICRuYXRpdmUgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF07XG4gIHZhciAkZGVmYXVsdCA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpO1xuICB2YXIgJGVudHJpZXMgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkO1xuICB2YXIgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmU7XG4gIHZhciBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmICgkYW55TmF0aXZlKSB7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYgKCFMSUJSQVJZICYmIHR5cGVvZiBJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUl0gIT0gJ2Z1bmN0aW9uJykgaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKSB7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSA9IHJldHVyblRoaXM7XG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoIShrZXkgaW4gcHJvdG8pKSByZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwidmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24gKCkgeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbiAoKSB7IHRocm93IDI7IH0pO1xufSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMsIHNraXBDbG9zaW5nKSB7XG4gIGlmICghc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORykgcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBbN107XG4gICAgdmFyIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geyBkb25lOiBzYWZlID0gdHJ1ZSB9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyIHBJRSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgJGFzc2lnbiA9IE9iamVjdC5hc3NpZ247XG5cbi8vIHNob3VsZCB3b3JrIHdpdGggc3ltYm9scyBhbmQgc2hvdWxkIGhhdmUgZGV0ZXJtaW5pc3RpYyBwcm9wZXJ0eSBvcmRlciAoVjggYnVnKVxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgdmFyIEEgPSB7fTtcbiAgdmFyIEIgPSB7fTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHZhciBTID0gU3ltYm9sKCk7XG4gIHZhciBLID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtTXSA9IDc7XG4gIEsuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGspIHsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgPSB0b09iamVjdCh0YXJnZXQpO1xuICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDE7XG4gIHZhciBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICB2YXIgaXNFbnVtID0gcElFLmY7XG4gIHdoaWxlIChhTGVuID4gaW5kZXgpIHtcbiAgICB2YXIgUyA9IElPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICB2YXIga2V5cyA9IGdldFN5bWJvbHMgPyBnZXRLZXlzKFMpLmNvbmNhdChnZXRTeW1ib2xzKFMpKSA6IGdldEtleXMoUyk7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBqID0gMDtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChsZW5ndGggPiBqKSBpZiAoaXNFbnVtLmNhbGwoUywga2V5ID0ga2V5c1tqKytdKSkgVFtrZXldID0gU1trZXldO1xuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247XG4iLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGRQcyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBFbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpO1xuICB2YXIgaSA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAoaS0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBkUCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG4gIHZhciBQO1xuICB3aGlsZSAobGVuZ3RoID4gaSkgZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59O1xuIiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIChPKSB7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYgKGhhcyhPLCBJRV9QUk9UTykpIHJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYgKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSU9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgaWYgKGtleSAhPSBJRV9QUk9UTykgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgU1JDID0gcmVxdWlyZSgnLi9fdWlkJykoJ3NyYycpO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgJHRvU3RyaW5nID0gRnVuY3Rpb25bVE9fU1RSSU5HXTtcbnZhciBUUEwgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vX2NvcmUnKS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiAkdG9TdHJpbmcuY2FsbChpdCk7XG59O1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWwsIHNhZmUpIHtcbiAgdmFyIGlzRnVuY3Rpb24gPSB0eXBlb2YgdmFsID09ICdmdW5jdGlvbic7XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCAnbmFtZScpIHx8IGhpZGUodmFsLCAnbmFtZScsIGtleSk7XG4gIGlmIChPW2tleV0gPT09IHZhbCkgcmV0dXJuO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgU1JDKSB8fCBoaWRlKHZhbCwgU1JDLCBPW2tleV0gPyAnJyArIE9ba2V5XSA6IFRQTC5qb2luKFN0cmluZyhrZXkpKSk7XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoIXNhZmUpIHtcbiAgICBkZWxldGUgT1trZXldO1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9IGVsc2UgaWYgKE9ba2V5XSkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIHtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfVxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIHRoaXNbU1JDXSB8fCAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pO1xuIiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCB0YWcsIHN0YXQpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpIGRlZihpdCwgVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZyB9KTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTtcbiIsInZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogY29yZS52ZXJzaW9uLFxuICBtb2RlOiByZXF1aXJlKCcuL19saWJyYXJ5JykgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAxOCBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRPX1NUUklORykge1xuICByZXR1cm4gZnVuY3Rpb24gKHRoYXQsIHBvcykge1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpO1xuICAgIHZhciBpID0gdG9JbnRlZ2VyKHBvcyk7XG4gICAgdmFyIGwgPSBzLmxlbmd0aDtcbiAgICB2YXIgYSwgYjtcbiAgICBpZiAoaSA8IDAgfHwgaSA+PSBsKSByZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbmRleCwgbGVuZ3RoKSB7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59O1xuIiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07XG4iLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBTKSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciBpZCA9IDA7XG52YXIgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59O1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbDtcbnZhciBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uIChpdGVyKSB7IEFycmF5LmZyb20oaXRlcik7IH0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UgLyogLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCAqLykge1xuICAgIHZhciBPID0gdG9PYmplY3QoYXJyYXlMaWtlKTtcbiAgICB2YXIgQyA9IHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXk7XG4gICAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBtYXBmbiA9IGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBpdGVyRm4gPSBnZXRJdGVyRm4oTyk7XG4gICAgdmFyIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZiAobWFwcGluZykgbWFwZm4gPSBjdHgobWFwZm4sIGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkLCAyKTtcbiAgICAvLyBpZiBvYmplY3QgaXNuJ3QgaXRlcmFibGUgb3IgaXQncyBhcnJheSB3aXRoIGRlZmF1bHQgaXRlcmF0b3IgLSB1c2Ugc2ltcGxlIGNhc2VcbiAgICBpZiAoaXRlckZuICE9IHVuZGVmaW5lZCAmJiAhKEMgPT0gQXJyYXkgJiYgaXNBcnJheUl0ZXIoaXRlckZuKSkpIHtcbiAgICAgIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChPKSwgcmVzdWx0ID0gbmV3IEMoKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBtYXBmbiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgICAgZm9yIChyZXN1bHQgPSBuZXcgQyhsZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0JywgeyBhc3NpZ246IHJlcXVpcmUoJy4vX29iamVjdC1hc3NpZ24nKSB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbiAoaXRlcmF0ZWQpIHtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24gKCkge1xuICB2YXIgTyA9IHRoaXMuX3Q7XG4gIHZhciBpbmRleCA9IHRoaXMuX2k7XG4gIHZhciBwb2ludDtcbiAgaWYgKGluZGV4ID49IE8ubGVuZ3RoKSByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7IHZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2UgfTtcbn0pO1xuIiwiLyohXG4gICogZG9tcmVhZHkgKGMpIER1c3RpbiBEaWF6IDIwMTQgLSBMaWNlbnNlIE1JVFxuICAqL1xuIWZ1bmN0aW9uIChuYW1lLCBkZWZpbml0aW9uKSB7XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JykgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgdGhpc1tuYW1lXSA9IGRlZmluaXRpb24oKVxuXG59KCdkb21yZWFkeScsIGZ1bmN0aW9uICgpIHtcblxuICB2YXIgZm5zID0gW10sIGxpc3RlbmVyXG4gICAgLCBkb2MgPSBkb2N1bWVudFxuICAgICwgaGFjayA9IGRvYy5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGxcbiAgICAsIGRvbUNvbnRlbnRMb2FkZWQgPSAnRE9NQ29udGVudExvYWRlZCdcbiAgICAsIGxvYWRlZCA9IChoYWNrID8gL15sb2FkZWR8XmMvIDogL15sb2FkZWR8Xml8XmMvKS50ZXN0KGRvYy5yZWFkeVN0YXRlKVxuXG5cbiAgaWYgKCFsb2FkZWQpXG4gIGRvYy5hZGRFdmVudExpc3RlbmVyKGRvbUNvbnRlbnRMb2FkZWQsIGxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgIGRvYy5yZW1vdmVFdmVudExpc3RlbmVyKGRvbUNvbnRlbnRMb2FkZWQsIGxpc3RlbmVyKVxuICAgIGxvYWRlZCA9IDFcbiAgICB3aGlsZSAobGlzdGVuZXIgPSBmbnMuc2hpZnQoKSkgbGlzdGVuZXIoKVxuICB9KVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICBsb2FkZWQgPyBzZXRUaW1lb3V0KGZuLCAwKSA6IGZucy5wdXNoKGZuKVxuICB9XG5cbn0pO1xuIiwiLy8gZWxlbWVudC1jbG9zZXN0IHwgQ0MwLTEuMCB8IGdpdGh1Yi5jb20vam9uYXRoYW50bmVhbC9jbG9zZXN0XG5cbihmdW5jdGlvbiAoRWxlbWVudFByb3RvKSB7XG5cdGlmICh0eXBlb2YgRWxlbWVudFByb3RvLm1hdGNoZXMgIT09ICdmdW5jdGlvbicpIHtcblx0XHRFbGVtZW50UHJvdG8ubWF0Y2hlcyA9IEVsZW1lbnRQcm90by5tc01hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50UHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnRQcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgZnVuY3Rpb24gbWF0Y2hlcyhzZWxlY3Rvcikge1xuXHRcdFx0dmFyIGVsZW1lbnQgPSB0aGlzO1xuXHRcdFx0dmFyIGVsZW1lbnRzID0gKGVsZW1lbnQuZG9jdW1lbnQgfHwgZWxlbWVudC5vd25lckRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblx0XHRcdHZhciBpbmRleCA9IDA7XG5cblx0XHRcdHdoaWxlIChlbGVtZW50c1tpbmRleF0gJiYgZWxlbWVudHNbaW5kZXhdICE9PSBlbGVtZW50KSB7XG5cdFx0XHRcdCsraW5kZXg7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBCb29sZWFuKGVsZW1lbnRzW2luZGV4XSk7XG5cdFx0fTtcblx0fVxuXG5cdGlmICh0eXBlb2YgRWxlbWVudFByb3RvLmNsb3Nlc3QgIT09ICdmdW5jdGlvbicpIHtcblx0XHRFbGVtZW50UHJvdG8uY2xvc2VzdCA9IGZ1bmN0aW9uIGNsb3Nlc3Qoc2VsZWN0b3IpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gdGhpcztcblxuXHRcdFx0d2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudC5ub2RlVHlwZSA9PT0gMSkge1xuXHRcdFx0XHRpZiAoZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSkge1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fTtcblx0fVxufSkod2luZG93LkVsZW1lbnQucHJvdG90eXBlKTtcbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJjb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5jb25zdCBkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4uL2RlbGVnYXRlJyk7XG5jb25zdCBkZWxlZ2F0ZUFsbCA9IHJlcXVpcmUoJy4uL2RlbGVnYXRlQWxsJyk7XG5cbmNvbnN0IERFTEVHQVRFX1BBVFRFUk4gPSAvXiguKyk6ZGVsZWdhdGVcXCgoLispXFwpJC87XG5jb25zdCBTUEFDRSA9ICcgJztcblxuY29uc3QgZ2V0TGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSwgaGFuZGxlcikge1xuICB2YXIgbWF0Y2ggPSB0eXBlLm1hdGNoKERFTEVHQVRFX1BBVFRFUk4pO1xuICB2YXIgc2VsZWN0b3I7XG4gIGlmIChtYXRjaCkge1xuICAgIHR5cGUgPSBtYXRjaFsxXTtcbiAgICBzZWxlY3RvciA9IG1hdGNoWzJdO1xuICB9XG5cbiAgdmFyIG9wdGlvbnM7XG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zID0ge1xuICAgICAgY2FwdHVyZTogcG9wS2V5KGhhbmRsZXIsICdjYXB0dXJlJyksXG4gICAgICBwYXNzaXZlOiBwb3BLZXkoaGFuZGxlciwgJ3Bhc3NpdmUnKVxuICAgIH07XG4gIH1cblxuICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgIGRlbGVnYXRlOiAodHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnKVxuICAgICAgPyBkZWxlZ2F0ZUFsbChoYW5kbGVyKVxuICAgICAgOiBzZWxlY3RvclxuICAgICAgICA/IGRlbGVnYXRlKHNlbGVjdG9yLCBoYW5kbGVyKVxuICAgICAgICA6IGhhbmRsZXIsXG4gICAgb3B0aW9uczogb3B0aW9uc1xuICB9O1xuXG4gIGlmICh0eXBlLmluZGV4T2YoU1BBQ0UpID4gLTEpIHtcbiAgICByZXR1cm4gdHlwZS5zcGxpdChTUEFDRSkubWFwKGZ1bmN0aW9uKF90eXBlKSB7XG4gICAgICByZXR1cm4gYXNzaWduKHt0eXBlOiBfdHlwZX0sIGxpc3RlbmVyKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0ZW5lci50eXBlID0gdHlwZTtcbiAgICByZXR1cm4gW2xpc3RlbmVyXTtcbiAgfVxufTtcblxudmFyIHBvcEtleSA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICBkZWxldGUgb2JqW2tleV07XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmVoYXZpb3IoZXZlbnRzLCBwcm9wcykge1xuICBjb25zdCBsaXN0ZW5lcnMgPSBPYmplY3Qua2V5cyhldmVudHMpXG4gICAgLnJlZHVjZShmdW5jdGlvbihtZW1vLCB0eXBlKSB7XG4gICAgICB2YXIgbGlzdGVuZXJzID0gZ2V0TGlzdGVuZXJzKHR5cGUsIGV2ZW50c1t0eXBlXSk7XG4gICAgICByZXR1cm4gbWVtby5jb25jYXQobGlzdGVuZXJzKTtcbiAgICB9LCBbXSk7XG5cbiAgcmV0dXJuIGFzc2lnbih7XG4gICAgYWRkOiBmdW5jdGlvbiBhZGRCZWhhdmlvcihlbGVtZW50KSB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgbGlzdGVuZXIudHlwZSxcbiAgICAgICAgICBsaXN0ZW5lci5kZWxlZ2F0ZSxcbiAgICAgICAgICBsaXN0ZW5lci5vcHRpb25zXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlQmVoYXZpb3IoZWxlbWVudCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGxpc3RlbmVyLnR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIuZGVsZWdhdGUsXG4gICAgICAgICAgbGlzdGVuZXIub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCBwcm9wcyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21wb3NlKGZ1bmN0aW9ucykge1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBmdW5jdGlvbnMuc29tZShmdW5jdGlvbihmbikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZSkgPT09IGZhbHNlO1xuICAgIH0sIHRoaXMpO1xuICB9O1xufTtcbiIsImNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnLi4vZGVsZWdhdGUnKTtcbmNvbnN0IGNvbXBvc2UgPSByZXF1aXJlKCcuLi9jb21wb3NlJyk7XG5cbmNvbnN0IFNQTEFUID0gJyonO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlQWxsKHNlbGVjdG9ycykge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoc2VsZWN0b3JzKVxuXG4gIC8vIFhYWCBvcHRpbWl6YXRpb246IGlmIHRoZXJlIGlzIG9ubHkgb25lIGhhbmRsZXIgYW5kIGl0IGFwcGxpZXMgdG9cbiAgLy8gYWxsIGVsZW1lbnRzICh0aGUgXCIqXCIgQ1NTIHNlbGVjdG9yKSwgdGhlbiBqdXN0IHJldHVybiB0aGF0XG4gIC8vIGhhbmRsZXJcbiAgaWYgKGtleXMubGVuZ3RoID09PSAxICYmIGtleXNbMF0gPT09IFNQTEFUKSB7XG4gICAgcmV0dXJuIHNlbGVjdG9yc1tTUExBVF07XG4gIH1cblxuICBjb25zdCBkZWxlZ2F0ZXMgPSBrZXlzLnJlZHVjZShmdW5jdGlvbihtZW1vLCBzZWxlY3Rvcikge1xuICAgIG1lbW8ucHVzaChkZWxlZ2F0ZShzZWxlY3Rvciwgc2VsZWN0b3JzW3NlbGVjdG9yXSkpO1xuICAgIHJldHVybiBtZW1vO1xuICB9LCBbXSk7XG4gIHJldHVybiBjb21wb3NlKGRlbGVnYXRlcyk7XG59O1xuIiwiLy8gcG9seWZpbGwgRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdFxucmVxdWlyZSgnZWxlbWVudC1jbG9zZXN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVsZWdhdGUoc2VsZWN0b3IsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBkZWxlZ2F0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KHNlbGVjdG9yKTtcbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0YXJnZXQsIGV2ZW50KTtcbiAgICB9XG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9uY2UobGlzdGVuZXIsIG9wdGlvbnMpIHtcbiAgdmFyIHdyYXBwZWQgPSBmdW5jdGlvbiB3cmFwcGVkT25jZShlKSB7XG4gICAgZS5jdXJyZW50VGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZS50eXBlLCB3cmFwcGVkLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbGlzdGVuZXIuY2FsbCh0aGlzLCBlKTtcbiAgfTtcbiAgcmV0dXJuIHdyYXBwZWQ7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCB0b2dnbGUgPSByZXF1aXJlKCcuLi91dGlscy90b2dnbGUnKTtcbmNvbnN0IGlzRWxlbWVudEluVmlld3BvcnQgPSByZXF1aXJlKCcuLi91dGlscy9pcy1pbi12aWV3cG9ydCcpO1xuY29uc3QgQlVUVE9OID0gYC5hY2NvcmRpb24tYnV0dG9uW2FyaWEtY29udHJvbHNdYDtcbmNvbnN0IEVYUEFOREVEID0gJ2FyaWEtZXhwYW5kZWQnO1xuY29uc3QgTVVMVElTRUxFQ1RBQkxFID0gJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJztcblxuY2xhc3MgQWNjb3JkaW9ue1xuICBjb25zdHJ1Y3RvciAoYWNjb3JkaW9uKXtcbiAgICB0aGlzLmFjY29yZGlvbiA9IGFjY29yZGlvbjtcbiAgICB0aGlzLmJ1dHRvbnMgPSBhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xuICAgIHRoaXMuZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmFjY29yZGlvbi5jbG9zZScpO1xuICAgIHRoaXMuZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuYWNjb3JkaW9uLm9wZW4nKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQgKCl7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnNbaV07XG5cbiAgICAgIGxldCBleHBhbmRlZCA9IGN1cnJlbnRCdXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnO1xuICAgICAgdGhpcy50b2dnbGVCdXR0b24oY3VycmVudEJ1dHRvbiwgZXhwYW5kZWQpO1xuXG4gICAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICAgIGN1cnJlbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIHRoYXQuZXZlbnRPbkNsaWNrKGV2ZW50LCB0aGlzKTtcbiAgICAgIH0pO1xuXG4gICAgfVxuICB9XG5cblxuICBldmVudE9uQ2xpY2sgKGV2ZW50LCBidXR0b24pe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy50b2dnbGVCdXR0b24oYnV0dG9uKTtcbiAgICBpZiAoYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJykge1xuICAgICAgLy8gV2Ugd2VyZSBqdXN0IGV4cGFuZGVkLCBidXQgaWYgYW5vdGhlciBhY2NvcmRpb24gd2FzIGFsc28ganVzdFxuICAgICAgLy8gY29sbGFwc2VkLCB3ZSBtYXkgbm8gbG9uZ2VyIGJlIGluIHRoZSB2aWV3cG9ydC4gVGhpcyBlbnN1cmVzXG4gICAgICAvLyB0aGF0IHdlIGFyZSBzdGlsbCB2aXNpYmxlLCBzbyB0aGUgdXNlciBpc24ndCBjb25mdXNlZC5cbiAgICAgIGlmICghaXNFbGVtZW50SW5WaWV3cG9ydChidXR0b24pKSBidXR0b24uc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUb2dnbGUgYSBidXR0b24ncyBcInByZXNzZWRcIiBzdGF0ZSwgb3B0aW9uYWxseSBwcm92aWRpbmcgYSB0YXJnZXRcbiAgICogc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxuICAgKiBAcGFyYW0ge2Jvb2xlYW4/fSBleHBhbmRlZCBJZiBubyBzdGF0ZSBpcyBwcm92aWRlZCwgdGhlIGN1cnJlbnRcbiAgICogc3RhdGUgd2lsbCBiZSB0b2dnbGVkIChmcm9tIGZhbHNlIHRvIHRydWUsIGFuZCB2aWNlLXZlcnNhKS5cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gdGhlIHJlc3VsdGluZyBzdGF0ZVxuICAgKi9cbiAgdG9nZ2xlQnV0dG9uIChidXR0b24sIGV4cGFuZGVkKSB7XG4gICAgaWYgKCF0aGlzLmFjY29yZGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKEJVVFRPTisnIGlzIG1pc3Npbmcgb3V0ZXIgQUNDT1JESU9OJyk7XG4gICAgfVxuXG4gICAgZXhwYW5kZWQgPSB0b2dnbGUoYnV0dG9uLCBleHBhbmRlZCk7XG5cbiAgICBpZihleHBhbmRlZCl7XG4gICAgICBidXR0b24uZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50T3Blbik7XG4gICAgfSBlbHNle1xuICAgICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudENsb3NlKTtcbiAgICB9XG5cbiAgICAvLyBYWFggbXVsdGlzZWxlY3RhYmxlIGlzIG9wdC1pbiwgdG8gcHJlc2VydmUgbGVnYWN5IGJlaGF2aW9yXG4gICAgY29uc3QgbXVsdGlzZWxlY3RhYmxlID0gdGhpcy5hY2NvcmRpb24uZ2V0QXR0cmlidXRlKE1VTFRJU0VMRUNUQUJMRSkgPT09ICd0cnVlJztcblxuICAgIGlmIChleHBhbmRlZCAmJiAhbXVsdGlzZWxlY3RhYmxlKSB7XG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBjdXJyZW50QnV0dHRvbiA9IHRoaXMuYnV0dG9uc1tpXTtcbiAgICAgICAgaWYgKGN1cnJlbnRCdXR0dG9uICE9PSBidXR0b24pIHtcbiAgICAgICAgICB0b2dnbGUoY3VycmVudEJ1dHR0b24sIGZhbHNlKTtcbiAgICAgICAgICBjdXJyZW50QnV0dHRvbi5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRDbG9zZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlXG4gICAqL1xuICBzaG93QnV0dG9uIChidXR0b24pe1xuICAgIHRvZ2dsZUJ1dHRvbihidXR0b24sIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxuICAgKiBAcmV0dXJuIHtib29sZWFufSBmYWxzZVxuICAgKi9cbiAgaGlkZUJ1dHRvbiAoYnV0dG9uKSB7XG4gICAgdG9nZ2xlQnV0dG9uKGJ1dHRvbiwgZmFsc2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQWNjb3JkaW9uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY2xhc3MgQ2hlY2tib3hUb2dnbGVDb250ZW50e1xuICAgIGNvbnN0cnVjdG9yKGVsKXtcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRyaWdnZXIgPSAnLmpzLWNoZWNrYm94LXRvZ2dsZS1jb250ZW50JztcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRhcmdldCA9ICdkYXRhLWpzLXRhcmdldCc7XG4gICAgICAgIHRoaXMuZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLmNsb3NlJyk7XG4gICAgICAgIHRoaXMuZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2Uub3BlbicpO1xuICAgICAgICB0aGlzLnRhcmdldEVsID0gbnVsbDtcbiAgICAgICAgdGhpcy5jaGVja2JveEVsID0gbnVsbDtcblxuICAgICAgICB0aGlzLmluaXQoZWwpO1xuICAgIH1cblxuICAgIGluaXQoZWwpe1xuICAgICAgICB0aGlzLmNoZWNrYm94RWwgPSBlbDtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB0aGlzLmNoZWNrYm94RWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJyxmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICB0aGF0LnRvZ2dsZSh0aGF0LmNoZWNrYm94RWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50b2dnbGUodGhpcy5jaGVja2JveEVsKTtcbiAgICB9XG5cbiAgICB0b2dnbGUodHJpZ2dlckVsKXtcbiAgICAgICAgdmFyIHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNUb2dnbGVUYXJnZXQpXG4gICAgICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHZhciB0YXJnZXRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0QXR0cik7XG4gICAgICAgICAgICBpZih0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICBpZih0cmlnZ2VyRWwuY2hlY2tlZCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSh0cmlnZ2VyRWwsIHRhcmdldEVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvcGVuKHRyaWdnZXJFbCwgdGFyZ2V0RWwpe1xuICAgICAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudE9wZW4pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNsb3NlKHRyaWdnZXJFbCwgdGFyZ2V0RWwpe1xuICAgICAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudENsb3NlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDaGVja2JveFRvZ2dsZUNvbnRlbnQ7XG4iLCIvKipcbiAqIENvbGxhcHNlL2V4cGFuZC5cbiAqL1xuXG4ndXNlIHN0cmljdCdcblxuY2xhc3MgQ29sbGFwc2Uge1xuICBjb25zdHJ1Y3RvciAoZWxlbWVudCwgYWN0aW9uID0gJ3RvZ2dsZScpe1xuICAgIHRoaXMuanNDb2xsYXBzZVRhcmdldCA9ICdkYXRhLWpzLXRhcmdldCc7XG4gICAgdGhpcy50cmlnZ2VyRWwgPSBlbGVtZW50O1xuICAgIHRoaXMudGFyZ2V0RWw7XG4gICAgdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICB0aGlzLmV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5jb2xsYXBzZS5jbG9zZScpO1xuICAgIHRoaXMuZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2Uub3BlbicpO1xuICAgIHRoaXMudHJpZ2dlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCl7XG4gICAgICB0aGF0LnRvZ2dsZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgdG9nZ2xlQ29sbGFwc2UgKGZvcmNlQ2xvc2UpIHtcbiAgICBsZXQgdGFyZ2V0QXR0ciA9IHRoaXMudHJpZ2dlckVsLmdldEF0dHJpYnV0ZSh0aGlzLmpzQ29sbGFwc2VUYXJnZXQpO1xuICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHRoaXMudGFyZ2V0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldEF0dHIpO1xuICAgICAgaWYodGhpcy50YXJnZXRFbCAhPT0gbnVsbCAmJiB0aGlzLnRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAvL2NoYW5nZSBzdGF0ZVxuICAgICAgICBpZih0aGlzLnRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnIHx8IHRoaXMudHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSB1bmRlZmluZWQgfHwgZm9yY2VDbG9zZSApe1xuICAgICAgICAgIC8vY2xvc2VcbiAgICAgICAgICB0aGlzLmFuaW1hdGVDb2xsYXBzZSgpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAvL29wZW5cbiAgICAgICAgICB0aGlzLmFuaW1hdGVFeHBhbmQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZSAoKXtcbiAgICBpZih0aGlzLnRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0aGlzLnRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHRoaXMudG9nZ2xlQ29sbGFwc2UoKTtcbiAgICB9XG4gIH1cblxuXG4gIGFuaW1hdGVDb2xsYXBzZSAoKSB7XG4gICAgaWYoIXRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3Mpe1xuICAgICAgdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyA9IHRydWU7XG5cbiAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUuaGVpZ2h0ID0gdGhpcy50YXJnZXRFbC5jbGllbnRIZWlnaHQrICdweCc7XG4gICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlLXRyYW5zaXRpb24tY29sbGFwc2UnKTtcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCl7XG4gICAgICAgIHRoYXQudGFyZ2V0RWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgfSwgNSk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpe1xuICAgICAgICB0aGF0LnRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xuICAgICAgICB0aGF0LnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlLXRyYW5zaXRpb24tY29sbGFwc2UnKTtcblxuICAgICAgICB0aGF0LnRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgdGhhdC5hbmltYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB0aGF0LnRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoYXQuZXZlbnRDbG9zZSk7XG4gICAgICB9LCAyMDApO1xuICAgIH1cbiAgfVxuXG4gIGFuaW1hdGVFeHBhbmQgKCkge1xuICAgIGlmKCF0aGlzLmFuaW1hdGVJblByb2dyZXNzKXtcbiAgICAgIHRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgdGhpcy50YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcbiAgICAgIGxldCBleHBhbmRlZEhlaWdodCA9IHRoaXMudGFyZ2V0RWwuY2xpZW50SGVpZ2h0O1xuICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSAnMHB4JztcbiAgICAgIHRoaXMudGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2UtdHJhbnNpdGlvbi1leHBhbmQnKTtcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCl7XG4gICAgICAgIHRoYXQudGFyZ2V0RWwuc3R5bGUuaGVpZ2h0ID0gZXhwYW5kZWRIZWlnaHQrICdweCc7XG4gICAgICB9LCA1KTtcblxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcbiAgICAgICAgdGhhdC50YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZS10cmFuc2l0aW9uLWV4cGFuZCcpO1xuICAgICAgICB0aGF0LnRhcmdldEVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcblxuICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgdGhhdC50cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgdGhhdC5hbmltYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB0aGF0LnRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoYXQuZXZlbnRPcGVuKTtcbiAgICAgIH0sIDIwMCk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sbGFwc2U7XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBjbG9zZXN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvY2xvc2VzdCcpO1xuXG5jbGFzcyBEcm9wZG93biB7XG4gIGNvbnN0cnVjdG9yIChlbCl7XG4gICAgdGhpcy5qc0Ryb3Bkb3duVHJpZ2dlciA9ICcuanMtZHJvcGRvd24nO1xuICAgIHRoaXMuanNEcm9wZG93blRhcmdldCA9ICdkYXRhLWpzLXRhcmdldCc7XG4gICAgdGhpcy5ldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcbiAgICB0aGlzLmV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLm9wZW4nKTtcblxuICAgIC8vb3B0aW9uOiBtYWtlIGRyb3Bkb3duIGJlaGF2ZSBhcyB0aGUgY29sbGFwc2UgY29tcG9uZW50IHdoZW4gb24gc21hbGwgc2NyZWVucyAodXNlZCBieSBzdWJtZW51cyBpbiB0aGUgaGVhZGVyIGFuZCBzdGVwLWRyb3Bkb3duKS5cbiAgICB0aGlzLm5hdlJlc3BvbnNpdmVCcmVha3BvaW50ID0gOTkyOyAvL3NhbWUgYXMgJG5hdi1yZXNwb25zaXZlLWJyZWFrcG9pbnQgZnJvbSB0aGUgc2Nzcy5cbiAgICB0aGlzLnRyaW5ndWlkZUJyZWFrcG9pbnQgPSA3Njg7IC8vc2FtZSBhcyAkbmF2LXJlc3BvbnNpdmUtYnJlYWtwb2ludCBmcm9tIHRoZSBzY3NzLlxuICAgIHRoaXMuanNSZXNwb25zaXZlQ29sbGFwc2VNb2RpZmllciA9ICcuanMtZHJvcGRvd24tLXJlc3BvbnNpdmUtY29sbGFwc2UnO1xuICAgIHRoaXMucmVzcG9uc2l2ZUNvbGxhcHNlRW5hYmxlZCA9IGZhbHNlO1xuICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSBmYWxzZTtcblxuXG4gICAgdGhpcy50cmlnZ2VyRWwgPSBudWxsO1xuICAgIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xuXG4gICAgdGhpcy5pbml0KGVsKTtcblxuICAgIGlmKHRoaXMudHJpZ2dlckVsICE9PSBudWxsICYmIHRoaXMudHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGhpcy50YXJnZXRFbCAhPT0gbnVsbCAmJiB0aGlzLnRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuXG5cbiAgICAgIGlmKHRoaXMudHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykpe1xuICAgICAgICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy9DbGlja2VkIG91dHNpZGUgZHJvcGRvd24gLT4gY2xvc2UgaXRcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCl7XG4gICAgICAgIHRoYXQub3V0c2lkZUNsb3NlKGV2ZW50KTtcbiAgICAgIH0pO1xuXG4gICAgICAvL0NsaWNrZWQgb24gZHJvcGRvd24gb3BlbiBidXR0b24gLS0+IHRvZ2dsZSBpdFxuICAgICAgdGhpcy50cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpe1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTsvL3ByZXZlbnRzIG91c2lkZSBjbGljayBsaXN0ZW5lciBmcm9tIHRyaWdnZXJpbmcuXG4gICAgICAgIHRoYXQudG9nZ2xlRHJvcGRvd24oKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBzZXQgYXJpYS1oaWRkZW4gY29ycmVjdGx5IGZvciBzY3JlZW5yZWFkZXJzIChUcmluZ3VpZGUgcmVzcG9uc2l2ZSlcbiAgICAgIGlmKHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLnRyaWdnZXJFbDtcbiAgICAgICAgaWYgKHdpbmRvdy5JbnRlcnNlY3Rpb25PYnNlcnZlcikge1xuICAgICAgICAgIC8vIHRyaWdnZXIgZXZlbnQgd2hlbiBidXR0b24gY2hhbmdlcyB2aXNpYmlsaXR5XG4gICAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChlbnRyaWVzKSB7XG4gICAgICAgICAgICAvLyBidXR0b24gaXMgdmlzaWJsZVxuICAgICAgICAgICAgaWYgKGVudHJpZXNbMF0uaW50ZXJzZWN0aW9uUmF0aW8pIHtcbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gYnV0dG9uIGlzIG5vdCB2aXNpYmxlXG4gICAgICAgICAgICAgIGlmICh0aGF0LnRhcmdldEVsLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgcm9vdDogZG9jdW1lbnQuYm9keVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSUU6IEludGVyc2VjdGlvbk9ic2VydmVyIGlzIG5vdCBzdXBwb3J0ZWQsIHNvIHdlIGxpc3RlbiBmb3Igd2luZG93IHJlc2l6ZSBhbmQgZ3JpZCBicmVha3BvaW50IGluc3RlYWRcbiAgICAgICAgICBpZiAodGhhdC5kb1Jlc3BvbnNpdmVTdGVwZ3VpZGVDb2xsYXBzZSgpKSB7XG4gICAgICAgICAgICAvLyBzbWFsbCBzY3JlZW5cbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNle1xuICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIExhcmdlIHNjcmVlblxuICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoYXQuZG9SZXNwb25zaXZlU3RlcGd1aWRlQ29sbGFwc2UoKSkge1xuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuICAgICAgICAgICAgICB9IGVsc2V7XG4gICAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBldnQgPSBldnQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDI3KSB7XG4gICAgICAgICAgdGhhdC5jbG9zZUFsbCgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG5cbiAgaW5pdCAoZWwpe1xuICAgIHRoaXMudHJpZ2dlckVsID0gZWw7XG4gICAgaWYodGhpcy50cmlnZ2VyRWwgIT09IG51bGwgJiYgdGhpcy50cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICBsZXQgdGFyZ2V0QXR0ciA9IHRoaXMudHJpZ2dlckVsLmdldEF0dHJpYnV0ZSh0aGlzLmpzRHJvcGRvd25UYXJnZXQpO1xuICAgICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xuICAgICAgICBsZXQgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJykpO1xuICAgICAgICBpZih0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICB0aGlzLnRhcmdldEVsID0gdGFyZ2V0RWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZih0aGlzLnRyaWdnZXJFbC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLWRyb3Bkb3duLS1yZXNwb25zaXZlLWNvbGxhcHNlJykpe1xuICAgICAgdGhpcy5yZXNwb25zaXZlQ29sbGFwc2VFbmFibGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZih0aGlzLnRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpKXtcbiAgICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICB9XG5cbiAgY2xvc2VBbGwgKCl7XG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcblxuICAgIGxldCBvdmVyZmxvd01lbnVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ292ZXJmbG93LW1lbnUnKTtcbiAgICBsZXQgdHJpZ2dlckVsID0gbnVsbDtcbiAgICBsZXQgdGFyZ2V0RWwgPSBudWxsO1xuICAgIGZvciAobGV0IG9pID0gMDsgb2kgPCBvdmVyZmxvd01lbnVFbC5sZW5ndGg7IG9pKyspIHtcbiAgICAgIGxldCBjdXJyZW50T3ZlcmZsb3dNZW51RUwgPSBvdmVyZmxvd01lbnVFbFsgb2kgXTtcbiAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgY3VycmVudE92ZXJmbG93TWVudUVMLmNoaWxkTm9kZXMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgaWYgKGN1cnJlbnRPdmVyZmxvd01lbnVFTC5jaGlsZE5vZGVzWyBhIF0udGFnTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKGN1cnJlbnRPdmVyZmxvd01lbnVFTC5jaGlsZE5vZGVzWyBhIF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1kcm9wZG93bicpKSB7XG4gICAgICAgICAgICB0cmlnZ2VyRWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwuY2hpbGROb2Rlc1sgYSBdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudE92ZXJmbG93TWVudUVMLmNoaWxkTm9kZXNbIGEgXS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtaW5uZXInKSkge1xuICAgICAgICAgICAgdGFyZ2V0RWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwuY2hpbGROb2Rlc1sgYSBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRhcmdldEVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ21vYmlsZV9uYXYtYWN0aXZlJykpIHtcbiAgICAgICAgICBpZiAoIWN1cnJlbnRPdmVyZmxvd01lbnVFTC5jbG9zZXN0KCcubmF2YmFyJykpIHtcblxuICAgICAgICAgICAgaWYodHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSB0cnVlKXtcbiAgICAgICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudENsb3NlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50Q2xvc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZURyb3Bkb3duIChmb3JjZUNsb3NlKSB7XG4gICAgaWYodGhpcy50cmlnZ2VyRWwgIT09IG51bGwgJiYgdGhpcy50cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnRhcmdldEVsICE9PSBudWxsICYmIHRoaXMudGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAvL2NoYW5nZSBzdGF0ZVxuXG4gICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLmxlZnQgPSBudWxsO1xuICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5yaWdodCA9IG51bGw7XG5cbiAgICAgIHZhciByZWN0ID0gdGhpcy50cmlnZ2VyRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBpZih0aGlzLnRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnIHx8IGZvcmNlQ2xvc2Upe1xuICAgICAgICAvL2Nsb3NlXG4gICAgICAgIHRoaXMudHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xuICAgICAgICB0aGlzLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICB0aGlzLnRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRDbG9zZSk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5jbG9zZUFsbCgpO1xuICAgICAgICAvL29wZW5cbiAgICAgICAgdGhpcy50cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgdGhpcy50YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgdGhpcy50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgICAgIHRoaXMudHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudE9wZW4pO1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5vZmZzZXQodGhpcy50YXJnZXRFbClcblxuICAgICAgICBpZihvZmZzZXQubGVmdCA8IDApe1xuICAgICAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUubGVmdCA9ICcwcHgnO1xuICAgICAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJpZ2h0ID0gb2Zmc2V0LmxlZnQgKyB0aGlzLnRhcmdldEVsLm9mZnNldFdpZHRoO1xuICAgICAgICBpZihyaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKXtcbiAgICAgICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLmxlZnQgPSAnYXV0byc7XG4gICAgICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5yaWdodCA9ICcwcHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9mZnNldEFnYWluID0gdGhpcy5vZmZzZXQodGhpcy50YXJnZXRFbCk7XG5cbiAgICAgICAgaWYob2Zmc2V0QWdhaW4ubGVmdCA8IDApe1xuXG4gICAgICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XG4gICAgICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5yaWdodCA9ICdhdXRvJztcbiAgICAgICAgfVxuICAgICAgICByaWdodCA9IG9mZnNldEFnYWluLmxlZnQgKyB0aGlzLnRhcmdldEVsLm9mZnNldFdpZHRoO1xuICAgICAgICBpZihyaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKXtcblxuICAgICAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUubGVmdCA9ICdhdXRvJztcbiAgICAgICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cblxuICB9XG5cbiAgb2Zmc2V0IChlbCkge1xuICAgIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LFxuICAgICAgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgcmV0dXJuIHsgdG9wOiByZWN0LnRvcCArIHNjcm9sbFRvcCwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCB9XG4gIH1cblxuXG4gIG91dHNpZGVDbG9zZSAoZXZlbnQpe1xuICAgIGlmKCF0aGlzLmRvUmVzcG9uc2l2ZUNvbGxhcHNlKCkpe1xuICAgICAgLy9jbG9zZXMgZHJvcGRvd24gd2hlbiBjbGlja2VkIG91dHNpZGUuXG4gICAgICBsZXQgZHJvcGRvd25FbG0gPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgdGhpcy50YXJnZXRFbC5pZCk7XG4gICAgICBpZigoZHJvcGRvd25FbG0gPT09IG51bGwgfHwgZHJvcGRvd25FbG0gPT09IHVuZGVmaW5lZCkgJiYgKGV2ZW50LnRhcmdldCAhPT0gdGhpcy50cmlnZ2VyRWwpKXtcbiAgICAgICAgLy9jbGlja2VkIG91dHNpZGUgdHJpZ2dlciwgZm9yY2UgY2xvc2VcbiAgICAgICAgdGhpcy50b2dnbGVEcm9wZG93bih0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkb1Jlc3BvbnNpdmVDb2xsYXBzZSAoKXtcbiAgICAvL3JldHVybnMgdHJ1ZSBpZiByZXNwb25zaXZlIGNvbGxhcHNlIGlzIGVuYWJsZWQgYW5kIHdlIGFyZSBvbiBhIHNtYWxsIHNjcmVlbi5cbiAgICBpZigodGhpcy5yZXNwb25zaXZlQ29sbGFwc2VFbmFibGVkIHx8IHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQpICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IHRoaXMubmF2UmVzcG9uc2l2ZUJyZWFrcG9pbnQpe1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBkb1Jlc3BvbnNpdmVTdGVwZ3VpZGVDb2xsYXBzZSAoKXtcbiAgICAvL3JldHVybnMgdHJ1ZSBpZiByZXNwb25zaXZlIGNvbGxhcHNlIGlzIGVuYWJsZWQgYW5kIHdlIGFyZSBvbiBhIHNtYWxsIHNjcmVlbi5cbiAgICBpZigodGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCkgJiYgd2luZG93LmlubmVyV2lkdGggPD0gdGhpcy50cmluZ3VpZGVCcmVha3BvaW50KXtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93bjtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIG5hdmlnYXRpb246IHJlcXVpcmUoJy4vbmF2aWdhdGlvbicpLFxyXG4gIHNraXBuYXY6ICAgIHJlcXVpcmUoJy4vc2tpcG5hdicpLFxyXG4gIHJlZ2V4bWFzazogIHJlcXVpcmUoJy4vcmVnZXgtaW5wdXQtbWFzaycpXHJcbn07XHJcbiIsIlxyXG5jb25zdCBkb21yZWFkeSA9IHJlcXVpcmUoJ2RvbXJlYWR5Jyk7XHJcblxyXG4vKipcclxuICogSW1wb3J0IG1vZGFsIGxpYi5cclxuICogaHR0cHM6Ly9taWNyb21vZGFsLm5vdy5zaFxyXG4gKi9cclxuY29uc3QgbWljcm9Nb2RhbCA9IHJlcXVpcmUoXCIuLi8uLi92ZW5kb3IvbWljcm9tb2RhbC5qc1wiKTtcclxuZG9tcmVhZHkoKCkgPT4ge1xyXG5cdG1pY3JvTW9kYWwuaW5pdCh7XHJcbiAgICBvblNob3c6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LmFkZCgnbW9kYWwtYWN0aXZlJyk7XHJcbiAgICB9LFxyXG4gICAgb25DbG9zZTogZnVuY3Rpb24oKXtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1hY3RpdmUnKTtcclxuICAgIH1cclxuICB9KTsgLy9pbml0IGFsbCBtb2RhbHNcclxufSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xyXG5jb25zdCBmb3JFYWNoID0gcmVxdWlyZSgnYXJyYXktZm9yZWFjaCcpO1xyXG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuY29uc3QgYWNjb3JkaW9uID0gcmVxdWlyZSgnLi9hY2NvcmRpb24nKTtcclxuXHJcbmNvbnN0IENMSUNLID0gcmVxdWlyZSgnLi4vZXZlbnRzJykuQ0xJQ0s7XHJcbmNvbnN0IFBSRUZJWCA9IHJlcXVpcmUoJy4uL2NvbmZpZycpLnByZWZpeDtcclxuXHJcbmNvbnN0IE5BViA9IGAubmF2YDtcclxuY29uc3QgTkFWX0xJTktTID0gYCR7TkFWfSBhYDtcclxuY29uc3QgT1BFTkVSUyA9IGAuanMtbWVudS1vcGVuYDtcclxuY29uc3QgQ0xPU0VfQlVUVE9OID0gYC5qcy1tZW51LWNsb3NlYDtcclxuY29uc3QgT1ZFUkxBWSA9IGAub3ZlcmxheWA7XHJcbmNvbnN0IENMT1NFUlMgPSBgJHtDTE9TRV9CVVRUT059LCAub3ZlcmxheWA7XHJcbmNvbnN0IFRPR0dMRVMgPSBbIE5BViwgT1ZFUkxBWSBdLmpvaW4oJywgJyk7XHJcblxyXG5jb25zdCBBQ1RJVkVfQ0xBU1MgPSAnbW9iaWxlX25hdi1hY3RpdmUnO1xyXG5jb25zdCBWSVNJQkxFX0NMQVNTID0gJ2lzLXZpc2libGUnO1xyXG5cclxuY29uc3QgaXNBY3RpdmUgPSAoKSA9PiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhBQ1RJVkVfQ0xBU1MpO1xyXG5cclxuY29uc3QgX2ZvY3VzVHJhcCA9ICh0cmFwQ29udGFpbmVyKSA9PiB7XHJcbiAgLy8gRmluZCBhbGwgZm9jdXNhYmxlIGNoaWxkcmVuXHJcbiAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0nO1xyXG4gIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gdHJhcENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nKTtcclxuICBjb25zdCBmaXJzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1sgMCBdO1xyXG4gIGNvbnN0IGxhc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbIGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDEgXTtcclxuXHJcbiAgZnVuY3Rpb24gdHJhcFRhYktleSAoZSkge1xyXG4gICAgLy8gQ2hlY2sgZm9yIFRBQiBrZXkgcHJlc3NcclxuICAgIGlmIChlLmtleUNvZGUgPT09IDkpIHtcclxuXHJcbiAgICAgIC8vIFNISUZUICsgVEFCXHJcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0VGFiU3RvcCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgbGFzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAvLyBUQUJcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdFRhYlN0b3ApIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEVTQ0FQRVxyXG4gICAgaWYgKGUua2V5Q29kZSA9PT0gMjcpIHtcclxuICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gRm9jdXMgZmlyc3QgY2hpbGRcclxuICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGVuYWJsZSAoKSB7XHJcbiAgICAgIC8vIExpc3RlbiBmb3IgYW5kIHRyYXAgdGhlIGtleWJvYXJkXHJcbiAgICAgIHRyYXBDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBUYWJLZXkpO1xyXG4gICAgfSxcclxuXHJcbiAgICByZWxlYXNlICgpIHtcclxuICAgICAgdHJhcENvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcFRhYktleSk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcblxyXG5sZXQgZm9jdXNUcmFwO1xyXG5cclxuY29uc3QgdG9nZ2xlTmF2ID0gZnVuY3Rpb24gKGFjdGl2ZSkge1xyXG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gIGlmICh0eXBlb2YgYWN0aXZlICE9PSAnYm9vbGVhbicpIHtcclxuICAgIGFjdGl2ZSA9ICFpc0FjdGl2ZSgpO1xyXG4gIH1cclxuICBib2R5LmNsYXNzTGlzdC50b2dnbGUoQUNUSVZFX0NMQVNTLCBhY3RpdmUpO1xyXG5cclxuICBmb3JFYWNoKHNlbGVjdChUT0dHTEVTKSwgZWwgPT4ge1xyXG4gICAgZWwuY2xhc3NMaXN0LnRvZ2dsZShWSVNJQkxFX0NMQVNTLCBhY3RpdmUpO1xyXG4gIH0pO1xyXG5cclxuICBpZiAoYWN0aXZlKSB7XHJcbiAgICBmb2N1c1RyYXAuZW5hYmxlKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGZvY3VzVHJhcC5yZWxlYXNlKCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBjbG9zZUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihDTE9TRV9CVVRUT04pO1xyXG4gIGNvbnN0IG1lbnVCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoT1BFTkVSUyk7XHJcblxyXG4gIGlmIChhY3RpdmUgJiYgY2xvc2VCdXR0b24pIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGFjdGl2YXRlZCwgc28gZm9jdXMgb24gdGhlIGNsb3NlIGJ1dHRvbixcclxuICAgIC8vIHdoaWNoIGlzIGp1c3QgYmVmb3JlIGFsbCB0aGUgbmF2IGVsZW1lbnRzIGluIHRoZSB0YWIgb3JkZXIuXHJcbiAgICBjbG9zZUJ1dHRvbi5mb2N1cygpO1xyXG4gIH0gZWxzZSBpZiAoIWFjdGl2ZSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBjbG9zZUJ1dHRvbiAmJlxyXG4gICAgICAgICAgICAgbWVudUJ1dHRvbikge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgZGVhY3RpdmF0ZWQsIGFuZCBmb2N1cyB3YXMgb24gdGhlIGNsb3NlXHJcbiAgICAvLyBidXR0b24sIHdoaWNoIGlzIG5vIGxvbmdlciB2aXNpYmxlLiBXZSBkb24ndCB3YW50IHRoZSBmb2N1cyB0b1xyXG4gICAgLy8gZGlzYXBwZWFyIGludG8gdGhlIHZvaWQsIHNvIGZvY3VzIG9uIHRoZSBtZW51IGJ1dHRvbiBpZiBpdCdzXHJcbiAgICAvLyB2aXNpYmxlICh0aGlzIG1heSBoYXZlIGJlZW4gd2hhdCB0aGUgdXNlciB3YXMganVzdCBmb2N1c2VkIG9uLFxyXG4gICAgLy8gaWYgdGhleSB0cmlnZ2VyZWQgdGhlIG1vYmlsZSBuYXYgYnkgbWlzdGFrZSkuXHJcbiAgICBtZW51QnV0dG9uLmZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYWN0aXZlO1xyXG59O1xyXG5cclxuY29uc3QgcmVzaXplID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNsb3NlciA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihDTE9TRV9CVVRUT04pO1xyXG5cclxuICBpZiAoaXNBY3RpdmUoKSAmJiBjbG9zZXIgJiYgY2xvc2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoID09PSAwKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiBpcyBhY3RpdmUsIGJ1dCB0aGUgY2xvc2UgYm94IGlzbid0IHZpc2libGUsIHdoaWNoXHJcbiAgICAvLyBtZWFucyB0aGUgdXNlcidzIHZpZXdwb3J0IGhhcyBiZWVuIHJlc2l6ZWQgc28gdGhhdCBpdCBpcyBubyBsb25nZXJcclxuICAgIC8vIGluIG1vYmlsZSBtb2RlLiBMZXQncyBtYWtlIHRoZSBwYWdlIHN0YXRlIGNvbnNpc3RlbnQgYnlcclxuICAgIC8vIGRlYWN0aXZhdGluZyB0aGUgbW9iaWxlIG5hdi5cclxuICAgIHRvZ2dsZU5hdi5jYWxsKGNsb3NlciwgZmFsc2UpO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IG5hdmlnYXRpb24gPSBiZWhhdmlvcih7XHJcbiAgWyBDTElDSyBdOiB7XHJcbiAgICBbIE9QRU5FUlMgXTogdG9nZ2xlTmF2LFxyXG4gICAgWyBDTE9TRVJTIF06IHRvZ2dsZU5hdixcclxuICAgIFsgTkFWX0xJTktTIF06IGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gQSBuYXZpZ2F0aW9uIGxpbmsgaGFzIGJlZW4gY2xpY2tlZCEgV2Ugd2FudCB0byBjb2xsYXBzZSBhbnlcclxuICAgICAgLy8gaGllcmFyY2hpY2FsIG5hdmlnYXRpb24gVUkgaXQncyBhIHBhcnQgb2YsIHNvIHRoYXQgdGhlIHVzZXJcclxuICAgICAgLy8gY2FuIGZvY3VzIG9uIHdoYXRldmVyIHRoZXkndmUganVzdCBzZWxlY3RlZC5cclxuXHJcbiAgICAgIC8vIFNvbWUgbmF2aWdhdGlvbiBsaW5rcyBhcmUgaW5zaWRlIGFjY29yZGlvbnM7IHdoZW4gdGhleSdyZVxyXG4gICAgICAvLyBjbGlja2VkLCB3ZSB3YW50IHRvIGNvbGxhcHNlIHRob3NlIGFjY29yZGlvbnMuXHJcbiAgICAgIGNvbnN0IGFjYyA9IHRoaXMuY2xvc2VzdChhY2NvcmRpb24uQUNDT1JESU9OKTtcclxuICAgICAgaWYgKGFjYykge1xyXG4gICAgICAgIGFjY29yZGlvbi5nZXRCdXR0b25zKGFjYykuZm9yRWFjaChidG4gPT4gYWNjb3JkaW9uLmhpZGUoYnRuKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElmIHRoZSBtb2JpbGUgbmF2aWdhdGlvbiBtZW51IGlzIGFjdGl2ZSwgd2Ugd2FudCB0byBoaWRlIGl0LlxyXG4gICAgICBpZiAoaXNBY3RpdmUoKSkge1xyXG4gICAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG59LCB7XHJcbiAgaW5pdCAoKSB7XHJcbiAgICBjb25zdCB0cmFwQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihOQVYpO1xyXG5cclxuICAgIGlmICh0cmFwQ29udGFpbmVyKSB7XHJcbiAgICAgIGZvY3VzVHJhcCA9IF9mb2N1c1RyYXAodHJhcENvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplKCk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplLCBmYWxzZSk7XHJcbiAgfSxcclxuICB0ZWFyZG93biAoKSB7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplLCBmYWxzZSk7XHJcbiAgfSxcclxufSk7XHJcblxyXG4vKipcclxuICogVE9ETyBmb3IgMi4wLCByZW1vdmUgdGhpcyBzdGF0ZW1lbnQgYW5kIGV4cG9ydCBgbmF2aWdhdGlvbmAgZGlyZWN0bHk6XHJcbiAqXHJcbiAqIG1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3Ioey4uLn0pO1xyXG4gKi9cclxuY29uc3QgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbihcclxuICBlbCA9PiBuYXZpZ2F0aW9uLm9uKGVsKSxcclxuICBuYXZpZ2F0aW9uXHJcbik7IiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBSYWRpb1RvZ2dsZUdyb3Vwe1xuICAgIGNvbnN0cnVjdG9yKGVsKXtcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRyaWdnZXIgPSAnLmpzLXJhZGlvLXRvZ2dsZS1ncm91cCc7XG4gICAgICAgIHRoaXMuanNUb2dnbGVUYXJnZXQgPSAnZGF0YS1qcy10YXJnZXQnO1xuICAgICAgICB0aGlzLmV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5jb2xsYXBzZS5jbG9zZScpO1xuICAgICAgICB0aGlzLmV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLm9wZW4nKTtcbiAgICAgICAgdGhpcy5yYWRpb0VscyA9IG51bGw7XG4gICAgICAgIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuaW5pdChlbCk7XG4gICAgfVxuXG4gICAgaW5pdCAoZWwpe1xuICAgICAgICB0aGlzLnJhZGlvR3JvdXAgPSBlbDtcbiAgICAgICAgdGhpcy5yYWRpb0VscyA9IHRoaXMucmFkaW9Hcm91cC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKTtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnJhZGlvRWxzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB2YXIgcmFkaW8gPSB0aGlzLnJhZGlvRWxzWyBpIF07XG4gICAgICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICBmb3IobGV0IGEgPSAwOyBhIDwgdGhhdC5yYWRpb0Vscy5sZW5ndGg7IGErKyApe1xuICAgICAgICAgICAgICB0aGF0LnRvZ2dsZSh0aGF0LnJhZGlvRWxzWyBhIF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy50b2dnbGUocmFkaW8pOyAvL0luaXRpYWwgdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGUgKHRyaWdnZXJFbCl7XG4gICAgICAgIHZhciB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZSh0aGlzLmpzVG9nZ2xlVGFyZ2V0KTtcbiAgICAgICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdmFyIHRhcmdldEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXRBdHRyKTtcbiAgICAgICAgICAgIGlmKHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIGlmKHRyaWdnZXJFbC5jaGVja2VkKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuKHRyaWdnZXJFbCwgdGFyZ2V0RWwpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKHRyaWdnZXJFbCwgdGFyZ2V0RWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbCl7XG4gICAgICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50T3Blbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCl7XG4gICAgICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50Q2xvc2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJhZGlvVG9nZ2xlR3JvdXA7XG4iLCIvKlxyXG4qIFByZXZlbnRzIHRoZSB1c2VyIGZyb20gaW5wdXR0aW5nIGJhc2VkIG9uIGEgcmVnZXguXHJcbiogRG9lcyBub3Qgd29yayB0aGUgc2FtZSB3YXkgYWYgPGlucHV0IHBhdHRlcm49XCJcIj4sIHRoaXMgcGF0dGVybiBpcyBvbmx5IHVzZWQgZm9yIHZhbGlkYXRpb24sIG5vdCB0byBwcmV2ZW50IGlucHV0LlxyXG4qIFVzZWNhc2U6IG51bWJlciBpbnB1dCBmb3IgZGF0ZS1jb21wb25lbnQuXHJcbiogRXhhbXBsZSAtIG51bWJlciBvbmx5OiA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWlucHV0LXJlZ2V4PVwiXlxcZCokXCI+XHJcbiovXHJcbid1c2Ugc3RyaWN0JztcclxuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xyXG5cclxuY29uc3QgbW9kaWZpZXJTdGF0ZSA9IHtcclxuICBzaGlmdDogZmFsc2UsXHJcbiAgYWx0OiBmYWxzZSxcclxuICBjdHJsOiBmYWxzZSxcclxuICBjb21tYW5kOiBmYWxzZVxyXG59O1xyXG5cclxuZnVuY3Rpb24gaW5wdXRSZWdleE1hc2sgKGV2ZW50KSB7XHJcbiAgaWYobW9kaWZpZXJTdGF0ZS5jdHJsIHx8IG1vZGlmaWVyU3RhdGUuY29tbWFuZCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgbmV3Q2hhciA9IG51bGw7XHJcbiAgaWYodHlwZW9mIGV2ZW50LmtleSAhPT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgaWYoZXZlbnQua2V5Lmxlbmd0aCA9PT0gMSl7XHJcbiAgICAgIG5ld0NoYXIgPSBldmVudC5rZXk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmKCFldmVudC5jaGFyQ29kZSl7XHJcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmtleUNvZGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV3Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQuY2hhckNvZGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHJlZ2V4U3RyID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5wdXQtcmVnZXgnKTtcclxuXHJcbiAgaWYoZXZlbnQudHlwZSAhPT0gdW5kZWZpbmVkICYmIGV2ZW50LnR5cGUgPT09ICdwYXN0ZScpe1xyXG4gICAgY29uc29sZS5sb2coJ3Bhc3RlJyk7XHJcbiAgfSBlbHNle1xyXG4gICAgdmFyIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgaWYoZXZlbnQudGFyZ2V0ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgaWYobmV3Q2hhciAhPT0gbnVsbCAmJiBlbGVtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgIGlmKG5ld0NoYXIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZihlbGVtZW50LnR5cGUgPT09ICdudW1iZXInKXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTsvL05vdGUgaW5wdXRbdHlwZT1udW1iZXJdIGRvZXMgbm90IGhhdmUgLnNlbGVjdGlvblN0YXJ0L0VuZCAoQ2hyb21lKS5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZS5zbGljZSgwLCBlbGVtZW50LnNlbGVjdGlvblN0YXJ0KSArIHRoaXMudmFsdWUuc2xpY2UoZWxlbWVudC5zZWxlY3Rpb25FbmQpICsgbmV3Q2hhcjsgLy9yZW1vdmVzIHRoZSBudW1iZXJzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCB0aGVuIGFkZHMgbmV3IGNoYXIuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAocmVnZXhTdHIpO1xyXG4gICAgICAgIGlmKHIuZXhlYyhuZXdWYWx1ZSkgPT09IG51bGwpe1xyXG4gICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcih7XHJcbiAgJ2tleXByZXNzIHBhc3RlJzoge1xyXG4gICAgJ2lucHV0W2RhdGEtaW5wdXQtcmVnZXhdOmZvY3VzJzogaW5wdXRSZWdleE1hc2ssXHJcbiAgfVxyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xuY29uc3Qgb25jZSA9IHJlcXVpcmUoJ3JlY2VwdG9yL29uY2UnKTtcblxuY29uc3QgQ0xJQ0sgPSByZXF1aXJlKCcuLi9ldmVudHMnKS5DTElDSztcbmNvbnN0IFBSRUZJWCA9IHJlcXVpcmUoJy4uL2NvbmZpZycpLnByZWZpeDtcbmNvbnN0IExJTksgPSBgLiR7UFJFRklYfXNraXBuYXZbaHJlZl49XCIjXCJdYDtcblxuY29uc3Qgc2V0VGFiaW5kZXggPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgLy8gTkI6IHdlIGtub3cgYmVjYXVzZSBvZiB0aGUgc2VsZWN0b3Igd2UncmUgZGVsZWdhdGluZyB0byBiZWxvdyB0aGF0IHRoZVxuICAvLyBocmVmIGFscmVhZHkgYmVnaW5zIHdpdGggJyMnXG4gIGNvbnN0IGlkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zbGljZSgxKTtcbiAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICBpZiAodGFyZ2V0KSB7XG4gICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uY2UoZXZlbnQgPT4ge1xuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSk7XG4gICAgfSkpO1xuICB9IGVsc2Uge1xuICAgIC8vIHRocm93IGFuIGVycm9yP1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHtcbiAgWyBDTElDSyBdOiB7XG4gICAgWyBMSU5LIF06IHNldFRhYmluZGV4LFxuICB9LFxufSk7XG4iLCJjb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcblxuY2xhc3MgUmVzcG9uc2l2ZVRhYmxlIHtcbiAgICBjb25zdHJ1Y3RvciAodGFibGUpIHtcbiAgICAgICAgdGhpcy5pbnNlcnRIZWFkZXJBc0F0dHJpYnV0ZXModGFibGUpO1xuICAgIH1cblxuICAgIC8vIEFkZCBkYXRhIGF0dHJpYnV0ZXMgbmVlZGVkIGZvciByZXNwb25zaXZlIG1vZGUuXG4gICAgaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzICh0YWJsZUVsKXtcbiAgICAgICAgaWYgKCF0YWJsZUVsKSByZXR1cm47XG5cbiAgICAgICAgbGV0IGhlYWRlciA9ICB0YWJsZUVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aGVhZCcpO1xuICAgICAgICBpZihoZWFkZXIubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgbGV0IGhlYWRlckNlbGxFbHMgPSBoZWFkZXJbIDAgXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGgnKTtcbiAgICAgICAgICBpZiAoaGVhZGVyQ2VsbEVscy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclsgMCBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChoZWFkZXJDZWxsRWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgYm9keVJvd0VscyA9IHNlbGVjdCgndGJvZHkgdHInLCB0YWJsZUVsKTtcbiAgICAgICAgICAgIEFycmF5LmZyb20oYm9keVJvd0VscykuZm9yRWFjaChyb3dFbCA9PiB7XG4gICAgICAgICAgICAgIGxldCBjZWxsRWxzID0gcm93RWwuY2hpbGRyZW47XG4gICAgICAgICAgICAgIGlmIChjZWxsRWxzLmxlbmd0aCA9PT0gaGVhZGVyQ2VsbEVscy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGhlYWRlckNlbGxFbHMpLmZvckVhY2goKGhlYWRlckNlbGxFbCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgLy8gR3JhYiBoZWFkZXIgY2VsbCB0ZXh0IGFuZCB1c2UgaXQgYm9keSBjZWxsIGRhdGEgdGl0bGUuXG4gICAgICAgICAgICAgICAgICBjZWxsRWxzWyBpIF0uc2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJywgaGVhZGVyQ2VsbEVsLnRleHRDb250ZW50KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3BvbnNpdmVUYWJsZTtcbiIsIlxyXG5jb25zdCBkb21yZWFkeSA9IHJlcXVpcmUoJ2RvbXJlYWR5Jyk7XHJcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xyXG4vL0ltcG9ydCB0aXBweS5qcyAoaHR0cHM6Ly9hdG9taWtzLmdpdGh1Yi5pby90aXBweWpzLylcclxuY29uc3QgdGlwcHkgPSByZXF1aXJlKCcuLi8uLi92ZW5kb3IvdGlwcHlqcy90aXBweS5qcycpO1xyXG5cclxudmFyIGluaXRUaXBweSA9IGZ1bmN0aW9uICgpe1xyXG4gICAgLy9pbml0IHRvb2x0aXAgb24gZWxlbWVudHMgd2l0aCB0aGUgLmpzLXRvb2x0aXAgY2xhc3NcclxuICAgIHRpcHB5KCcuanMtdG9vbHRpcCcsIHsgXHJcbiAgICAgICAgZHVyYXRpb246IDAsXHJcbiAgICAgICAgYXJyb3c6IHRydWVcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZG9tcmVhZHkoKCkgPT4ge1xyXG4gICAgaW5pdFRpcHB5KCk7XHJcbn0pO1xyXG5cclxuXHJcblxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBwcmVmaXg6ICcnLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKTtcclxuY29uc3QgQ29sbGFwc2UgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY29sbGFwc2UnKTtcclxuY29uc3QgUmFkaW9Ub2dnbGVHcm91cCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudCcpO1xyXG5jb25zdCBDaGVja2JveFRvZ2dsZUNvbnRlbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnKTtcclxuY29uc3QgRHJvcGRvd24gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZHJvcGRvd24nKTtcclxuY29uc3QgQWNjb3JkaW9uID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2FjY29yZGlvbicpO1xyXG5jb25zdCBtb2RhbCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9tb2RhbCcpO1xyXG5jb25zdCBSZXNwb25zaXZlVGFibGUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdGFibGUnKTtcclxuY29uc3QgdG9vbHRpcCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy90b29sdGlwJyk7XHJcblxyXG4vKipcclxuICogVGhlICdwb2x5ZmlsbHMnIGRlZmluZSBrZXkgRUNNQVNjcmlwdCA1IG1ldGhvZHMgdGhhdCBtYXkgYmUgbWlzc2luZyBmcm9tXHJcbiAqIG9sZGVyIGJyb3dzZXJzLCBzbyBtdXN0IGJlIGxvYWRlZCBmaXJzdC5cclxuICovXHJcbnJlcXVpcmUoJy4vcG9seWZpbGxzJyk7XHJcblxyXG5jb25zdCBka2ZkcyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XHJcblxyXG5jb25zdCBjb21wb25lbnRzID0gcmVxdWlyZSgnLi9jb21wb25lbnRzJyk7XHJcbmRrZmRzLmNvbXBvbmVudHMgPSBjb21wb25lbnRzO1xyXG5cclxuZG9tcmVhZHkoKCkgPT4ge1xyXG4gIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LmJvZHk7XHJcbiAgZm9yIChsZXQgbmFtZSBpbiBjb21wb25lbnRzKSB7XHJcbiAgICBjb25zdCBiZWhhdmlvciA9IGNvbXBvbmVudHNbIG5hbWUgXTtcclxuICAgIGJlaGF2aW9yLm9uKHRhcmdldCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc1NlbGVjdG9yQWNjb3JkaW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWNjb3JkaW9uJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JBY2NvcmRpb24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uWyBjIF0pO1xyXG4gIH1cclxuICBjb25zdCBqc1NlbGVjdG9yQWNjb3JkaW9uQm9yZGVyZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uLWJvcmRlcmVkOm5vdCguYWNjb3JkaW9uKScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQWNjb3JkaW9uQm9yZGVyZWQubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uQm9yZGVyZWRbIGMgXSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc1NlbGVjdG9yVGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZTpub3QoLmRhdGFUYWJsZSknKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRhYmxlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBSZXNwb25zaXZlVGFibGUoanNTZWxlY3RvclRhYmxlWyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3QganNTZWxlY3RvckNvbGxhcHNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtY29sbGFwc2UnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckNvbGxhcHNlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBDb2xsYXBzZShqc1NlbGVjdG9yQ29sbGFwc2VbIGMgXSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc1NlbGVjdG9yUmFkaW9Db2xsYXBzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXJhZGlvLXRvZ2dsZS1ncm91cCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yUmFkaW9Db2xsYXBzZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgUmFkaW9Ub2dnbGVHcm91cChqc1NlbGVjdG9yUmFkaW9Db2xsYXBzZVsgYyBdKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2UubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IENoZWNrYm94VG9nZ2xlQ29udGVudChqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZVsgYyBdKTtcclxuICB9XHJcbiAgY29uc3QganNTZWxlY3RvckRyb3Bkb3duID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtZHJvcGRvd24nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckRyb3Bkb3duLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBEcm9wZG93bihqc1NlbGVjdG9yRHJvcGRvd25bIGMgXSk7XHJcbiAgfVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHsgQ29sbGFwc2UsIFJhZGlvVG9nZ2xlR3JvdXAsIENoZWNrYm94VG9nZ2xlQ29udGVudCwgRHJvcGRvd24sIFJlc3BvbnNpdmVUYWJsZSwgQWNjb3JkaW9uIH07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIC8vIFRoaXMgdXNlZCB0byBiZSBjb25kaXRpb25hbGx5IGRlcGVuZGVudCBvbiB3aGV0aGVyIHRoZVxyXG4gIC8vIGJyb3dzZXIgc3VwcG9ydGVkIHRvdWNoIGV2ZW50czsgaWYgaXQgZGlkLCBgQ0xJQ0tgIHdhcyBzZXQgdG9cclxuICAvLyBgdG91Y2hzdGFydGAuICBIb3dldmVyLCB0aGlzIGhhZCBkb3duc2lkZXM6XHJcbiAgLy9cclxuICAvLyAqIEl0IHByZS1lbXB0ZWQgbW9iaWxlIGJyb3dzZXJzJyBkZWZhdWx0IGJlaGF2aW9yIG9mIGRldGVjdGluZ1xyXG4gIC8vICAgd2hldGhlciBhIHRvdWNoIHR1cm5lZCBpbnRvIGEgc2Nyb2xsLCB0aGVyZWJ5IHByZXZlbnRpbmdcclxuICAvLyAgIHVzZXJzIGZyb20gdXNpbmcgc29tZSBvZiBvdXIgY29tcG9uZW50cyBhcyBzY3JvbGwgc3VyZmFjZXMuXHJcbiAgLy9cclxuICAvLyAqIFNvbWUgZGV2aWNlcywgc3VjaCBhcyB0aGUgTWljcm9zb2Z0IFN1cmZhY2UgUHJvLCBzdXBwb3J0ICpib3RoKlxyXG4gIC8vICAgdG91Y2ggYW5kIGNsaWNrcy4gVGhpcyBtZWFudCB0aGUgY29uZGl0aW9uYWwgZWZmZWN0aXZlbHkgZHJvcHBlZFxyXG4gIC8vICAgc3VwcG9ydCBmb3IgdGhlIHVzZXIncyBtb3VzZSwgZnJ1c3RyYXRpbmcgdXNlcnMgd2hvIHByZWZlcnJlZFxyXG4gIC8vICAgaXQgb24gdGhvc2Ugc3lzdGVtcy5cclxuICBDTElDSzogJ2NsaWNrJyxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBlbHByb3RvID0gd2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZTtcclxuY29uc3QgSElEREVOID0gJ2hpZGRlbic7XHJcblxyXG5pZiAoIShISURERU4gaW4gZWxwcm90bykpIHtcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxwcm90bywgSElEREVOLCB7XHJcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEhJRERFTik7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoSElEREVOLCAnJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NMaXN0IGFuZCBET01Ub2tlbkxpc3RcclxucmVxdWlyZSgnY2xhc3NsaXN0LXBvbHlmaWxsJyk7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZGVuXHJcbnJlcXVpcmUoJy4vZWxlbWVudC1oaWRkZW4nKTtcclxuXHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vb2JqZWN0L2Fzc2lnbicpO1xyXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL2FycmF5L2Zyb20nKTsiLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuY29uc3QgQmVoYXZpb3IgPSByZXF1aXJlKCdyZWNlcHRvci9iZWhhdmlvcicpO1xyXG5cclxuY29uc3Qgc2VxdWVuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3Qgc2VxID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICBpZiAoIXRhcmdldCkge1xyXG4gICAgICB0YXJnZXQgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgfVxyXG4gICAgZm9yRWFjaChzZXEsIG1ldGhvZCA9PiB7XHJcbiAgICAgIGlmICh0eXBlb2YgdGhpc1sgbWV0aG9kIF0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB0aGlzWyBtZXRob2QgXS5jYWxsKHRoaXMsIHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogQG5hbWUgYmVoYXZpb3JcclxuICogQHBhcmFtIHtvYmplY3R9IGV2ZW50c1xyXG4gKiBAcGFyYW0ge29iamVjdD99IHByb3BzXHJcbiAqIEByZXR1cm4ge3JlY2VwdG9yLmJlaGF2aW9yfVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoZXZlbnRzLCBwcm9wcykgPT4ge1xyXG4gIHJldHVybiBCZWhhdmlvcihldmVudHMsIGFzc2lnbih7XHJcbiAgICBvbjogICBzZXF1ZW5jZSgnaW5pdCcsICdhZGQnKSxcclxuICAgIG9mZjogIHNlcXVlbmNlKCd0ZWFyZG93bicsICdyZW1vdmUnKSxcclxuICB9LCBwcm9wcykpO1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQG5hbWUgY2xvc2VzdFxyXG4gKiBAZGVzYyBnZXQgbmVhcmVzdCBwYXJlbnQgZWxlbWVudCBtYXRjaGluZyBzZWxlY3Rvci5cclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgSFRNTCBlbGVtZW50IHdoZXJlIHRoZSBzZWFyY2ggc3RhcnRzLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBTZWxlY3RvciB0byBiZSBmb3VuZC5cclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9IC0gTmVhcmVzdCBwYXJlbnQgZWxlbWVudCBtYXRjaGluZyBzZWxlY3Rvci5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xvc2VzdCAoZWwsIHNlbGVjdG9yKSB7XHJcbiAgdmFyIG1hdGNoZXNTZWxlY3RvciA9IGVsLm1hdGNoZXMgfHwgZWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGVsLm1vek1hdGNoZXNTZWxlY3RvciB8fCBlbC5tc01hdGNoZXNTZWxlY3RvcjtcclxuXHJcbiAgd2hpbGUgKGVsKSB7XHJcbiAgICAgIGlmIChtYXRjaGVzU2VsZWN0b3IuY2FsbChlbCwgc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgfVxyXG4gIHJldHVybiBlbDtcclxufTtcclxuIiwiLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzNcclxuZnVuY3Rpb24gaXNFbGVtZW50SW5WaWV3cG9ydCAoZWwsIHdpbj13aW5kb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICByZWN0LnRvcCA+PSAwICYmXHJcbiAgICByZWN0LmxlZnQgPj0gMCAmJlxyXG4gICAgcmVjdC5ib3R0b20gPD0gKHdpbi5pbm5lckhlaWdodCB8fCBkb2NFbC5jbGllbnRIZWlnaHQpICYmXHJcbiAgICByZWN0LnJpZ2h0IDw9ICh3aW4uaW5uZXJXaWR0aCB8fCBkb2NFbC5jbGllbnRXaWR0aClcclxuICApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudEluVmlld3BvcnQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBpc0VsZW1lbnRcclxuICogQGRlc2MgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudC5cclxuICogQHBhcmFtIHthbnl9IHZhbHVlXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VsZW1lbnQgPSB2YWx1ZSA9PiB7XHJcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUubm9kZVR5cGUgPT09IDE7XHJcbn07XHJcblxyXG4vKipcclxuICogQG5hbWUgc2VsZWN0XHJcbiAqIEBkZXNjIHNlbGVjdHMgZWxlbWVudHMgZnJvbSB0aGUgRE9NIGJ5IGNsYXNzIHNlbGVjdG9yIG9yIElEIHNlbGVjdG9yLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBUaGUgc2VsZWN0b3IgdG8gdHJhdmVyc2UgdGhlIERPTSB3aXRoLlxyXG4gKiBAcGFyYW0ge0RvY3VtZW50fEhUTUxFbGVtZW50P30gY29udGV4dCAtIFRoZSBjb250ZXh0IHRvIHRyYXZlcnNlIHRoZSBET01cclxuICogICBpbi4gSWYgbm90IHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byB0aGUgZG9jdW1lbnQuXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50W119IC0gQW4gYXJyYXkgb2YgRE9NIG5vZGVzIG9yIGFuIGVtcHR5IGFycmF5LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZWxlY3QgKHNlbGVjdG9yLCBjb250ZXh0KSB7XHJcblxyXG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBpZiAoIWNvbnRleHQgfHwgIWlzRWxlbWVudChjb250ZXh0KSkge1xyXG4gICAgY29udGV4dCA9IHdpbmRvdy5kb2N1bWVudDtcclxuICB9XHJcblxyXG4gIGNvbnN0IHNlbGVjdGlvbiA9IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGVjdGlvbik7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XHJcbmNvbnN0IENPTlRST0xTID0gJ2FyaWEtY29udHJvbHMnO1xyXG5jb25zdCBISURERU4gPSAnYXJpYS1oaWRkZW4nO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoYnV0dG9uLCBleHBhbmRlZCkgPT4ge1xyXG5cclxuICBpZiAodHlwZW9mIGV4cGFuZGVkICE9PSAnYm9vbGVhbicpIHtcclxuICAgIGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICdmYWxzZSc7XHJcbiAgfVxyXG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoRVhQQU5ERUQsIGV4cGFuZGVkKTtcclxuXHJcbiAgY29uc3QgaWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKENPTlRST0xTKTtcclxuICBjb25zdCBjb250cm9scyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICBpZiAoIWNvbnRyb2xzKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICdObyB0b2dnbGUgdGFyZ2V0IGZvdW5kIHdpdGggaWQ6IFwiJyArIGlkICsgJ1wiJ1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGNvbnRyb2xzLnNldEF0dHJpYnV0ZShISURERU4sICFleHBhbmRlZCk7XHJcbiAgcmV0dXJuIGV4cGFuZGVkO1xyXG59O1xyXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xyXG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcclxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxyXG5cdChnbG9iYWwuTWljcm9Nb2RhbCA9IGZhY3RvcnkoKSk7XHJcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHZlcnNpb24gPSBcIjAuMy4xXCI7XHJcblxyXG52YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XHJcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XHJcbiAgfVxyXG59O1xyXG5cclxudmFyIGNyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xyXG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xyXG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XHJcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcclxuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcclxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcclxuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XHJcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcclxuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcclxuICB9O1xyXG59KCk7XHJcblxyXG52YXIgdG9Db25zdW1hYmxlQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcclxuXHJcbiAgICByZXR1cm4gYXJyMjtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIEFycmF5LmZyb20oYXJyKTtcclxuICB9XHJcbn07XHJcblxyXG52YXIgTWljcm9Nb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgdmFyIEZPQ1VTQUJMRV9FTEVNRU5UUyA9IFsnYVtocmVmXScsICdhcmVhW2hyZWZdJywgJ2lucHV0Om5vdChbZGlzYWJsZWRdKTpub3QoW3R5cGU9XCJoaWRkZW5cIl0pOm5vdChbYXJpYS1oaWRkZW5dKScsICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW5dKScsICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbl0pJywgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbl0pJywgJ2lmcmFtZScsICdvYmplY3QnLCAnZW1iZWQnLCAnW2NvbnRlbnRlZGl0YWJsZV0nLCAnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4Xj1cIi1cIl0pJ107XHJcblxyXG4gIHZhciBNb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIE1vZGFsKF9yZWYpIHtcclxuICAgICAgdmFyIHRhcmdldE1vZGFsID0gX3JlZi50YXJnZXRNb2RhbCxcclxuICAgICAgICAgIF9yZWYkdHJpZ2dlcnMgPSBfcmVmLnRyaWdnZXJzLFxyXG4gICAgICAgICAgdHJpZ2dlcnMgPSBfcmVmJHRyaWdnZXJzID09PSB1bmRlZmluZWQgPyBbXSA6IF9yZWYkdHJpZ2dlcnMsXHJcbiAgICAgICAgICBfcmVmJG9uU2hvdyA9IF9yZWYub25TaG93LFxyXG4gICAgICAgICAgb25TaG93ID0gX3JlZiRvblNob3cgPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uICgpIHt9IDogX3JlZiRvblNob3csXHJcbiAgICAgICAgICBfcmVmJG9uQ2xvc2UgPSBfcmVmLm9uQ2xvc2UsXHJcbiAgICAgICAgICBvbkNsb3NlID0gX3JlZiRvbkNsb3NlID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoKSB7fSA6IF9yZWYkb25DbG9zZSxcclxuICAgICAgICAgIF9yZWYkb3BlblRyaWdnZXIgPSBfcmVmLm9wZW5UcmlnZ2VyLFxyXG4gICAgICAgICAgb3BlblRyaWdnZXIgPSBfcmVmJG9wZW5UcmlnZ2VyID09PSB1bmRlZmluZWQgPyAnZGF0YS1taWNyb21vZGFsLXRyaWdnZXInIDogX3JlZiRvcGVuVHJpZ2dlcixcclxuICAgICAgICAgIF9yZWYkY2xvc2VUcmlnZ2VyID0gX3JlZi5jbG9zZVRyaWdnZXIsXHJcbiAgICAgICAgICBjbG9zZVRyaWdnZXIgPSBfcmVmJGNsb3NlVHJpZ2dlciA9PT0gdW5kZWZpbmVkID8gJ2RhdGEtbWljcm9tb2RhbC1jbG9zZScgOiBfcmVmJGNsb3NlVHJpZ2dlcixcclxuICAgICAgICAgIF9yZWYkZGlzYWJsZVNjcm9sbCA9IF9yZWYuZGlzYWJsZVNjcm9sbCxcclxuICAgICAgICAgIGRpc2FibGVTY3JvbGwgPSBfcmVmJGRpc2FibGVTY3JvbGwgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRkaXNhYmxlU2Nyb2xsLFxyXG4gICAgICAgICAgX3JlZiRkaXNhYmxlRm9jdXMgPSBfcmVmLmRpc2FibGVGb2N1cyxcclxuICAgICAgICAgIGRpc2FibGVGb2N1cyA9IF9yZWYkZGlzYWJsZUZvY3VzID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9yZWYkZGlzYWJsZUZvY3VzLFxyXG4gICAgICAgICAgX3JlZiRhd2FpdENsb3NlQW5pbWF0ID0gX3JlZi5hd2FpdENsb3NlQW5pbWF0aW9uLFxyXG4gICAgICAgICAgYXdhaXRDbG9zZUFuaW1hdGlvbiA9IF9yZWYkYXdhaXRDbG9zZUFuaW1hdCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJGF3YWl0Q2xvc2VBbmltYXQsXHJcbiAgICAgICAgICBfcmVmJGRlYnVnTW9kZSA9IF9yZWYuZGVidWdNb2RlLFxyXG4gICAgICAgICAgZGVidWdNb2RlID0gX3JlZiRkZWJ1Z01vZGUgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRkZWJ1Z01vZGU7XHJcbiAgICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIE1vZGFsKTtcclxuXHJcbiAgICAgIC8vIFNhdmUgYSByZWZlcmVuY2Ugb2YgdGhlIG1vZGFsXHJcbiAgICAgIHRoaXMubW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRNb2RhbCk7XHJcblxyXG4gICAgICAvLyBTYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBwYXNzZWQgY29uZmlnXHJcbiAgICAgIHRoaXMuY29uZmlnID0geyBkZWJ1Z01vZGU6IGRlYnVnTW9kZSwgZGlzYWJsZVNjcm9sbDogZGlzYWJsZVNjcm9sbCwgb3BlblRyaWdnZXI6IG9wZW5UcmlnZ2VyLCBjbG9zZVRyaWdnZXI6IGNsb3NlVHJpZ2dlciwgb25TaG93OiBvblNob3csIG9uQ2xvc2U6IG9uQ2xvc2UsIGF3YWl0Q2xvc2VBbmltYXRpb246IGF3YWl0Q2xvc2VBbmltYXRpb24sIGRpc2FibGVGb2N1czogZGlzYWJsZUZvY3VzXHJcblxyXG4gICAgICAgIC8vIFJlZ2lzdGVyIGNsaWNrIGV2ZW50cyBvbmx5IGlmIHByZWJpbmRpbmcgZXZlbnRMaXN0ZW5lcnNcclxuICAgICAgfTtpZiAodHJpZ2dlcnMubGVuZ3RoID4gMCkgdGhpcy5yZWdpc3RlclRyaWdnZXJzLmFwcGx5KHRoaXMsIHRvQ29uc3VtYWJsZUFycmF5KHRyaWdnZXJzKSk7XHJcblxyXG4gICAgICAvLyBwcmViaW5kIGZ1bmN0aW9ucyBmb3IgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICAgIHRoaXMub25DbGljayA9IHRoaXMub25DbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLm9uS2V5ZG93biA9IHRoaXMub25LZXlkb3duLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb29wcyB0aHJvdWdoIGFsbCBvcGVuVHJpZ2dlcnMgYW5kIGJpbmRzIGNsaWNrIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0gIHthcnJheX0gdHJpZ2dlcnMgW0FycmF5IG9mIG5vZGUgZWxlbWVudHNdXHJcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAgICovXHJcblxyXG5cclxuICAgIGNyZWF0ZUNsYXNzKE1vZGFsLCBbe1xyXG4gICAgICBrZXk6ICdyZWdpc3RlclRyaWdnZXJzJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlZ2lzdGVyVHJpZ2dlcnMoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRyaWdnZXJzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XHJcbiAgICAgICAgICB0cmlnZ2Vyc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyaWdnZXJzLmZvckVhY2goZnVuY3Rpb24gKHRyaWdnZXIpIHtcclxuICAgICAgICAgIHRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5zaG93TW9kYWwoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ3Nob3dNb2RhbCcsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzaG93TW9kYWwoKSB7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuICAgICAgICB0aGlzLm1vZGFsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICB0aGlzLm1vZGFsLmNsYXNzTGlzdC5hZGQoJ2lzLW9wZW4nKTtcclxuICAgICAgICB0aGlzLnNldEZvY3VzVG9GaXJzdE5vZGUoKTtcclxuICAgICAgICB0aGlzLnNjcm9sbEJlaGF2aW91cignZGlzYWJsZScpO1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgICAgICB0aGlzLmNvbmZpZy5vblNob3codGhpcy5tb2RhbCk7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnY2xvc2VNb2RhbCcsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xyXG4gICAgICAgIHZhciBtb2RhbCA9IHRoaXMubW9kYWw7XHJcbiAgICAgICAgdGhpcy5tb2RhbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxCZWhhdmlvdXIoJ2VuYWJsZScpO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgIHRoaXMuY29uZmlnLm9uQ2xvc2UodGhpcy5tb2RhbCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5hd2FpdENsb3NlQW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICB0aGlzLm1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKTtcclxuICAgICAgICAgICAgbW9kYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgaGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ3Njcm9sbEJlaGF2aW91cicsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzY3JvbGxCZWhhdmlvdXIodG9nZ2xlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5kaXNhYmxlU2Nyb2xsKSByZXR1cm47XHJcbiAgICAgICAgdmFyIGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcbiAgICAgICAgc3dpdGNoICh0b2dnbGUpIHtcclxuICAgICAgICAgIGNhc2UgJ2VuYWJsZSc6XHJcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oYm9keS5zdHlsZSwgeyBvdmVyZmxvdzogJ2luaXRpYWwnLCBoZWlnaHQ6ICdpbml0aWFsJyB9KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdkaXNhYmxlJzpcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihib2R5LnN0eWxlLCB7IG92ZXJmbG93OiAnaGlkZGVuJywgaGVpZ2h0OiAnMTAwdmgnIH0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ2FkZEV2ZW50TGlzdGVuZXJzJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHRoaXMubW9kYWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25DbGljayk7XHJcbiAgICAgICAgdGhpcy5tb2RhbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljayk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25LZXlkb3duKTtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICdyZW1vdmVFdmVudExpc3RlbmVycycsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcclxuICAgICAgICB0aGlzLm1vZGFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uQ2xpY2spO1xyXG4gICAgICAgIHRoaXMubW9kYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2spO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLm9uS2V5ZG93bik7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnb25DbGljaycsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5oYXNBdHRyaWJ1dGUodGhpcy5jb25maWcuY2xvc2VUcmlnZ2VyKSkge1xyXG4gICAgICAgICAgdGhpcy5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICdvbktleWRvd24nLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb25LZXlkb3duKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDI3KSB0aGlzLmNsb3NlTW9kYWwoZXZlbnQpO1xyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSA5KSB0aGlzLm1haW50YWluRm9jdXMoZXZlbnQpO1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ2dldEZvY3VzYWJsZU5vZGVzJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEZvY3VzYWJsZU5vZGVzKCkge1xyXG4gICAgICAgIHZhciBub2RlcyA9IHRoaXMubW9kYWwucXVlcnlTZWxlY3RvckFsbChGT0NVU0FCTEVfRUxFTUVOVFMpO1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhub2RlcykubWFwKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgIHJldHVybiBub2Rlc1trZXldO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ3NldEZvY3VzVG9GaXJzdE5vZGUnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0Rm9jdXNUb0ZpcnN0Tm9kZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcuZGlzYWJsZUZvY3VzKSByZXR1cm47XHJcbiAgICAgICAgdmFyIGZvY3VzYWJsZU5vZGVzID0gdGhpcy5nZXRGb2N1c2FibGVOb2RlcygpO1xyXG4gICAgICAgIGlmIChmb2N1c2FibGVOb2Rlcy5sZW5ndGgpIGZvY3VzYWJsZU5vZGVzWzBdLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnbWFpbnRhaW5Gb2N1cycsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBtYWludGFpbkZvY3VzKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIGZvY3VzYWJsZU5vZGVzID0gdGhpcy5nZXRGb2N1c2FibGVOb2RlcygpO1xyXG5cclxuICAgICAgICAvLyBpZiBkaXNhYmxlRm9jdXMgaXMgdHJ1ZVxyXG4gICAgICAgIGlmICghdGhpcy5tb2RhbC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xyXG4gICAgICAgICAgZm9jdXNhYmxlTm9kZXNbMF0uZm9jdXMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFyIGZvY3VzZWRJdGVtSW5kZXggPSBmb2N1c2FibGVOb2Rlcy5pbmRleE9mKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgIGlmIChldmVudC5zaGlmdEtleSAmJiBmb2N1c2VkSXRlbUluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgIGZvY3VzYWJsZU5vZGVzW2ZvY3VzYWJsZU5vZGVzLmxlbmd0aCAtIDFdLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKCFldmVudC5zaGlmdEtleSAmJiBmb2N1c2VkSXRlbUluZGV4ID09PSBmb2N1c2FibGVOb2Rlcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgIGZvY3VzYWJsZU5vZGVzWzBdLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XSk7XHJcbiAgICByZXR1cm4gTW9kYWw7XHJcbiAgfSgpO1xyXG5cclxuICAvKipcclxuICAgKiBNb2RhbCBwcm90b3R5cGUgZW5kcy5cclxuICAgKiBIZXJlIG9uIGNvZGUgaXMgcmVwb3NpYmxlIGZvciBkZXRlY3RpbmcgYW5kXHJcbiAgICogYXV0b2JpbmRpbmcgZXZlbnQgaGFuZGxlcnMgb24gbW9kYWwgdHJpZ2dlcnNcclxuICAgKi9cclxuXHJcbiAgLy8gS2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgb3BlbmVkIG1vZGFsXHJcblxyXG5cclxuICB2YXIgYWN0aXZlTW9kYWwgPSBudWxsO1xyXG5cclxuICAvKipcclxuICAgKiBHZW5lcmF0ZXMgYW4gYXNzb2NpYXRpdmUgYXJyYXkgb2YgbW9kYWxzIGFuZCBpdCdzXHJcbiAgICogcmVzcGVjdGl2ZSB0cmlnZ2Vyc1xyXG4gICAqIEBwYXJhbSAge2FycmF5fSB0cmlnZ2VycyAgICAgQW4gYXJyYXkgb2YgYWxsIHRyaWdnZXJzXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0cmlnZ2VyQXR0ciBUaGUgZGF0YS1hdHRyaWJ1dGUgd2hpY2ggdHJpZ2dlcnMgdGhlIG1vZHVsZVxyXG4gICAqIEByZXR1cm4ge2FycmF5fVxyXG4gICAqL1xyXG4gIHZhciBnZW5lcmF0ZVRyaWdnZXJNYXAgPSBmdW5jdGlvbiBnZW5lcmF0ZVRyaWdnZXJNYXAodHJpZ2dlcnMsIHRyaWdnZXJBdHRyKSB7XHJcbiAgICB2YXIgdHJpZ2dlck1hcCA9IFtdO1xyXG5cclxuICAgIHRyaWdnZXJzLmZvckVhY2goZnVuY3Rpb24gKHRyaWdnZXIpIHtcclxuICAgICAgdmFyIHRhcmdldE1vZGFsID0gdHJpZ2dlci5hdHRyaWJ1dGVzW3RyaWdnZXJBdHRyXS52YWx1ZTtcclxuICAgICAgaWYgKHRyaWdnZXJNYXBbdGFyZ2V0TW9kYWxdID09PSB1bmRlZmluZWQpIHRyaWdnZXJNYXBbdGFyZ2V0TW9kYWxdID0gW107XHJcbiAgICAgIHRyaWdnZXJNYXBbdGFyZ2V0TW9kYWxdLnB1c2godHJpZ2dlcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdHJpZ2dlck1hcDtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBWYWxpZGF0ZXMgd2hldGhlciBhIG1vZGFsIG9mIHRoZSBnaXZlbiBpZCBleGlzdHNcclxuICAgKiBpbiB0aGUgRE9NXHJcbiAgICogQHBhcmFtICB7bnVtYmVyfSBpZCAgVGhlIGlkIG9mIHRoZSBtb2RhbFxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgdmFyIHZhbGlkYXRlTW9kYWxQcmVzZW5jZSA9IGZ1bmN0aW9uIHZhbGlkYXRlTW9kYWxQcmVzZW5jZShpZCkge1xyXG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdNaWNyb01vZGFsIHYnICsgdmVyc2lvbiArICc6IFxcdTI3NTdTZWVtcyBsaWtlIHlvdSBoYXZlIG1pc3NlZCAlY1xcJycgKyBpZCArICdcXCcnLCAnYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjlmYTtjb2xvcjogIzUwNTk2Yztmb250LXdlaWdodDogYm9sZDsnLCAnSUQgc29tZXdoZXJlIGluIHlvdXIgY29kZS4gUmVmZXIgZXhhbXBsZSBiZWxvdyB0byByZXNvbHZlIGl0LicpO1xyXG4gICAgICBjb25zb2xlLndhcm4oJyVjRXhhbXBsZTonLCAnYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjlmYTtjb2xvcjogIzUwNTk2Yztmb250LXdlaWdodDogYm9sZDsnLCAnPGRpdiBjbGFzcz1cIm1vZGFsXCIgaWQ9XCInICsgaWQgKyAnXCI+PC9kaXY+Jyk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBWYWxpZGF0ZXMgaWYgdGhlcmUgYXJlIG1vZGFsIHRyaWdnZXJzIHByZXNlbnRcclxuICAgKiBpbiB0aGUgRE9NXHJcbiAgICogQHBhcmFtICB7YXJyYXl9IHRyaWdnZXJzIEFuIGFycmF5IG9mIGRhdGEtdHJpZ2dlcnNcclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHZhciB2YWxpZGF0ZVRyaWdnZXJQcmVzZW5jZSA9IGZ1bmN0aW9uIHZhbGlkYXRlVHJpZ2dlclByZXNlbmNlKHRyaWdnZXJzKSB7XHJcbiAgICBpZiAodHJpZ2dlcnMubGVuZ3RoIDw9IDApIHtcclxuICAgICAgY29uc29sZS53YXJuKCdNaWNyb01vZGFsIHYnICsgdmVyc2lvbiArICc6IFxcdTI3NTdQbGVhc2Ugc3BlY2lmeSBhdCBsZWFzdCBvbmUgJWNcXCdtaWNyb21vZGFsLXRyaWdnZXJcXCcnLCAnYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjlmYTtjb2xvcjogIzUwNTk2Yztmb250LXdlaWdodDogYm9sZDsnLCAnZGF0YSBhdHRyaWJ1dGUuJyk7XHJcbiAgICAgIGNvbnNvbGUud2FybignJWNFeGFtcGxlOicsICdiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmOWZhO2NvbG9yOiAjNTA1OTZjO2ZvbnQtd2VpZ2h0OiBib2xkOycsICc8YSBocmVmPVwiI1wiIGRhdGEtbWljcm9tb2RhbC10cmlnZ2VyPVwibXktbW9kYWxcIj48L2E+Jyk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDaGVja3MgaWYgdHJpZ2dlcnMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgbW9kYWxzXHJcbiAgICogYXJlIHByZXNlbnQgaW4gdGhlIERPTVxyXG4gICAqIEBwYXJhbSAge2FycmF5fSB0cmlnZ2VycyAgIEFycmF5IG9mIERPTSBub2RlcyB3aGljaCBoYXZlIGRhdGEtdHJpZ2dlcnNcclxuICAgKiBAcGFyYW0gIHthcnJheX0gdHJpZ2dlck1hcCBBc3NvY2lhdGl2ZSBhcnJheSBvZiBtb2RhbHMgYW5kIHRoaWVyIHRyaWdnZXJzXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB2YXIgdmFsaWRhdGVBcmdzID0gZnVuY3Rpb24gdmFsaWRhdGVBcmdzKHRyaWdnZXJzLCB0cmlnZ2VyTWFwKSB7XHJcbiAgICB2YWxpZGF0ZVRyaWdnZXJQcmVzZW5jZSh0cmlnZ2Vycyk7XHJcbiAgICBpZiAoIXRyaWdnZXJNYXApIHJldHVybiB0cnVlO1xyXG4gICAgZm9yICh2YXIgaWQgaW4gdHJpZ2dlck1hcCkge1xyXG4gICAgICB2YWxpZGF0ZU1vZGFsUHJlc2VuY2UoaWQpO1xyXG4gICAgfXJldHVybiB0cnVlO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEJpbmRzIGNsaWNrIGhhbmRsZXJzIHRvIGFsbCBtb2RhbCB0cmlnZ2Vyc1xyXG4gICAqIEBwYXJhbSAge29iamVjdH0gY29uZmlnIFtkZXNjcmlwdGlvbl1cclxuICAgKiBAcmV0dXJuIHZvaWRcclxuICAgKi9cclxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uIGluaXQoY29uZmlnKSB7XHJcbiAgICAvLyBDcmVhdGUgYW4gY29uZmlnIG9iamVjdCB3aXRoIGRlZmF1bHQgb3BlblRyaWdnZXJcclxuICAgIHZhciBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgeyBvcGVuVHJpZ2dlcjogJ2RhdGEtbWljcm9tb2RhbC10cmlnZ2VyJyB9LCBjb25maWcpO1xyXG5cclxuICAgIC8vIENvbGxlY3RzIGFsbCB0aGUgbm9kZXMgd2l0aCB0aGUgdHJpZ2dlclxyXG4gICAgdmFyIHRyaWdnZXJzID0gW10uY29uY2F0KHRvQ29uc3VtYWJsZUFycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1snICsgb3B0aW9ucy5vcGVuVHJpZ2dlciArICddJykpKTtcclxuXHJcbiAgICAvLyBNYWtlcyBhIG1hcHBpbmdzIG9mIG1vZGFscyB3aXRoIHRoZWlyIHRyaWdnZXIgbm9kZXNcclxuICAgIHZhciB0cmlnZ2VyTWFwID0gZ2VuZXJhdGVUcmlnZ2VyTWFwKHRyaWdnZXJzLCBvcHRpb25zLm9wZW5UcmlnZ2VyKTtcclxuXHJcbiAgICAvLyBDaGVja3MgaWYgbW9kYWxzIGFuZCB0cmlnZ2VycyBleGlzdCBpbiBkb21cclxuICAgIGlmIChvcHRpb25zLmRlYnVnTW9kZSA9PT0gdHJ1ZSAmJiB2YWxpZGF0ZUFyZ3ModHJpZ2dlcnMsIHRyaWdnZXJNYXApID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgIC8vIEZvciBldmVyeSB0YXJnZXQgbW9kYWwgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZVxyXG4gICAgZm9yICh2YXIga2V5IGluIHRyaWdnZXJNYXApIHtcclxuICAgICAgdmFyIHZhbHVlID0gdHJpZ2dlck1hcFtrZXldO1xyXG4gICAgICBvcHRpb25zLnRhcmdldE1vZGFsID0ga2V5O1xyXG4gICAgICBvcHRpb25zLnRyaWdnZXJzID0gW10uY29uY2F0KHRvQ29uc3VtYWJsZUFycmF5KHZhbHVlKSk7XHJcbiAgICAgIG5ldyBNb2RhbChvcHRpb25zKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTaG93cyBhIHBhcnRpY3VsYXIgbW9kYWxcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRhcmdldE1vZGFsIFtUaGUgaWQgb2YgdGhlIG1vZGFsIHRvIGRpc3BsYXldXHJcbiAgICogQHBhcmFtICB7b2JqZWN0fSBjb25maWcgW1RoZSBjb25maWd1cmF0aW9uIG9iamVjdCB0byBwYXNzXVxyXG4gICAqIEByZXR1cm4ge3ZvaWR9XHJcbiAgICovXHJcbiAgdmFyIHNob3cgPSBmdW5jdGlvbiBzaG93KHRhcmdldE1vZGFsLCBjb25maWcpIHtcclxuICAgIHZhciBvcHRpb25zID0gY29uZmlnIHx8IHt9O1xyXG4gICAgb3B0aW9ucy50YXJnZXRNb2RhbCA9IHRhcmdldE1vZGFsO1xyXG5cclxuICAgIC8vIENoZWNrcyBpZiBtb2RhbHMgYW5kIHRyaWdnZXJzIGV4aXN0IGluIGRvbVxyXG4gICAgaWYgKG9wdGlvbnMuZGVidWdNb2RlID09PSB0cnVlICYmIHZhbGlkYXRlTW9kYWxQcmVzZW5jZSh0YXJnZXRNb2RhbCkgPT09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgLy8gc3RvcmVzIHJlZmVyZW5jZSB0byBhY3RpdmUgbW9kYWxcclxuICAgIGFjdGl2ZU1vZGFsID0gbmV3IE1vZGFsKG9wdGlvbnMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xyXG4gICAgYWN0aXZlTW9kYWwuc2hvd01vZGFsKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ2xvc2VzIHRoZSBhY3RpdmUgbW9kYWxcclxuICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAqL1xyXG4gIHZhciBjbG9zZSA9IGZ1bmN0aW9uIGNsb3NlKCkge1xyXG4gICAgYWN0aXZlTW9kYWwuY2xvc2VNb2RhbCgpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7IGluaXQ6IGluaXQsIHNob3c6IHNob3csIGNsb3NlOiBjbG9zZSB9O1xyXG59KCk7XHJcblxyXG5yZXR1cm4gTWljcm9Nb2RhbDtcclxuXHJcbn0pKSk7XHJcbiIsIi8qIVxyXG4qIFRpcHB5LmpzIHYyLjUuM1xyXG4qIChjKSAyMDE3LTIwMTggYXRvbWlrc1xyXG4qIE1JVFxyXG4qL1xyXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xyXG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcclxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxyXG5cdChnbG9iYWwudGlwcHkgPSBmYWN0b3J5KCkpO1xyXG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB2ZXJzaW9uID0gXCIyLjUuM1wiO1xyXG5cclxudmFyIGlzQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xyXG5cclxudmFyIGlzSUUgPSBpc0Jyb3dzZXIgJiYgL01TSUUgfFRyaWRlbnRcXC8vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcblxyXG52YXIgYnJvd3NlciA9IHt9O1xyXG5cclxuaWYgKGlzQnJvd3Nlcikge1xyXG4gIGJyb3dzZXIuc3VwcG9ydGVkID0gJ3JlcXVlc3RBbmltYXRpb25GcmFtZScgaW4gd2luZG93O1xyXG4gIGJyb3dzZXIuc3VwcG9ydHNUb3VjaCA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdztcclxuICBicm93c2VyLnVzaW5nVG91Y2ggPSBmYWxzZTtcclxuICBicm93c2VyLmR5bmFtaWNJbnB1dERldGVjdGlvbiA9IHRydWU7XHJcbiAgYnJvd3Nlci5pT1MgPSAvaVBob25lfGlQYWR8aVBvZC8udGVzdChuYXZpZ2F0b3IucGxhdGZvcm0pICYmICF3aW5kb3cuTVNTdHJlYW07XHJcbiAgYnJvd3Nlci5vblVzZXJJbnB1dENoYW5nZSA9IGZ1bmN0aW9uICgpIHt9O1xyXG59XHJcblxyXG4vKipcclxuICogU2VsZWN0b3IgY29uc3RhbnRzIHVzZWQgZm9yIGdyYWJiaW5nIGVsZW1lbnRzXHJcbiAqL1xyXG52YXIgc2VsZWN0b3JzID0ge1xyXG4gIFBPUFBFUjogJy50aXBweS1wb3BwZXInLFxyXG4gIFRPT0xUSVA6ICcudGlwcHktdG9vbHRpcCcsXHJcbiAgQ09OVEVOVDogJy50aXBweS1jb250ZW50JyxcclxuICBCQUNLRFJPUDogJy50aXBweS1iYWNrZHJvcCcsXHJcbiAgQVJST1c6ICcudGlwcHktYXJyb3cnLFxyXG4gIFJPVU5EX0FSUk9XOiAnLnRpcHB5LXJvdW5kYXJyb3cnLFxyXG4gIFJFRkVSRU5DRTogJ1tkYXRhLXRpcHB5XSdcclxufTtcclxuXHJcbnZhciBkZWZhdWx0cyA9IHtcclxuICBwbGFjZW1lbnQ6ICd0b3AnLFxyXG4gIGxpdmVQbGFjZW1lbnQ6IHRydWUsXHJcbiAgdHJpZ2dlcjogJ21vdXNlZW50ZXIgZm9jdXMnLFxyXG4gIGFuaW1hdGlvbjogJ3NoaWZ0LWF3YXknLFxyXG4gIGh0bWw6IGZhbHNlLFxyXG4gIGFuaW1hdGVGaWxsOiB0cnVlLFxyXG4gIGFycm93OiBmYWxzZSxcclxuICBkZWxheTogMCxcclxuICBkdXJhdGlvbjogWzM1MCwgMzAwXSxcclxuICBpbnRlcmFjdGl2ZTogZmFsc2UsXHJcbiAgaW50ZXJhY3RpdmVCb3JkZXI6IDIsXHJcbiAgdGhlbWU6ICdkYXJrJyxcclxuICBzaXplOiAncmVndWxhcicsXHJcbiAgZGlzdGFuY2U6IDEwLFxyXG4gIG9mZnNldDogMCxcclxuICBoaWRlT25DbGljazogdHJ1ZSxcclxuICBtdWx0aXBsZTogZmFsc2UsXHJcbiAgZm9sbG93Q3Vyc29yOiBmYWxzZSxcclxuICBpbmVydGlhOiBmYWxzZSxcclxuICB1cGRhdGVEdXJhdGlvbjogMzUwLFxyXG4gIHN0aWNreTogZmFsc2UsXHJcbiAgYXBwZW5kVG86IGZ1bmN0aW9uIGFwcGVuZFRvKCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmJvZHk7XHJcbiAgfSxcclxuICB6SW5kZXg6IDk5OTksXHJcbiAgdG91Y2hIb2xkOiBmYWxzZSxcclxuICBwZXJmb3JtYW5jZTogZmFsc2UsXHJcbiAgZHluYW1pY1RpdGxlOiBmYWxzZSxcclxuICBmbGlwOiB0cnVlLFxyXG4gIGZsaXBCZWhhdmlvcjogJ2ZsaXAnLFxyXG4gIGFycm93VHlwZTogJ3NoYXJwJyxcclxuICBhcnJvd1RyYW5zZm9ybTogJycsXHJcbiAgbWF4V2lkdGg6ICcnLFxyXG4gIHRhcmdldDogbnVsbCxcclxuICBhbGxvd1RpdGxlSFRNTDogdHJ1ZSxcclxuICBwb3BwZXJPcHRpb25zOiB7fSxcclxuICBjcmVhdGVQb3BwZXJJbnN0YW5jZU9uSW5pdDogZmFsc2UsXHJcbiAgb25TaG93OiBmdW5jdGlvbiBvblNob3coKSB7fSxcclxuICBvblNob3duOiBmdW5jdGlvbiBvblNob3duKCkge30sXHJcbiAgb25IaWRlOiBmdW5jdGlvbiBvbkhpZGUoKSB7fSxcclxuICBvbkhpZGRlbjogZnVuY3Rpb24gb25IaWRkZW4oKSB7fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBrZXlzIG9mIHRoZSBkZWZhdWx0cyBvYmplY3QgZm9yIHJlZHVjaW5nIGRvd24gaW50byBhIG5ldyBvYmplY3RcclxuICogVXNlZCBpbiBgZ2V0SW5kaXZpZHVhbE9wdGlvbnMoKWBcclxuICovXHJcbnZhciBkZWZhdWx0c0tleXMgPSBicm93c2VyLnN1cHBvcnRlZCAmJiBPYmplY3Qua2V5cyhkZWZhdWx0cyk7XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGFuIG9iamVjdCBsaXRlcmFsXHJcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzT2JqZWN0TGl0ZXJhbCh2YWx1ZSkge1xyXG4gIHJldHVybiB7fS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQb255ZmlsbCBmb3IgQXJyYXkuZnJvbVxyXG4gKiBAcGFyYW0geyp9IHZhbHVlXHJcbiAqIEByZXR1cm4ge0FycmF5fVxyXG4gKi9cclxuZnVuY3Rpb24gdG9BcnJheSh2YWx1ZSkge1xyXG4gIHJldHVybiBbXS5zbGljZS5jYWxsKHZhbHVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgZWxlbWVudHMgYmFzZWQgb24gdGhlIHNlbGVjdG9yIGlucHV0XHJcbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR8RWxlbWVudFtdfE5vZGVMaXN0fE9iamVjdH0gc2VsZWN0b3JcclxuICogQHJldHVybiB7RWxlbWVudFtdfVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QXJyYXlPZkVsZW1lbnRzKHNlbGVjdG9yKSB7XHJcbiAgaWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgRWxlbWVudCB8fCBpc09iamVjdExpdGVyYWwoc2VsZWN0b3IpKSB7XHJcbiAgICByZXR1cm4gW3NlbGVjdG9yXTtcclxuICB9XHJcblxyXG4gIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICByZXR1cm4gdG9BcnJheShzZWxlY3Rvcik7XHJcbiAgfVxyXG5cclxuICBpZiAoQXJyYXkuaXNBcnJheShzZWxlY3RvcikpIHtcclxuICAgIHJldHVybiBzZWxlY3RvcjtcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gdG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XHJcbiAgfSBjYXRjaCAoXykge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFBvbHlmaWxscyBuZWVkZWQgcHJvcHMvbWV0aG9kcyBmb3IgYSB2aXJ0dWFsIHJlZmVyZW5jZSBvYmplY3RcclxuICogTk9URTogaW4gdjMuMCB0aGlzIHdpbGwgYmUgcHVyZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gcmVmZXJlbmNlXHJcbiAqL1xyXG5mdW5jdGlvbiBwb2x5ZmlsbFZpcnR1YWxSZWZlcmVuY2VQcm9wcyhyZWZlcmVuY2UpIHtcclxuICByZWZlcmVuY2UucmVmT2JqID0gdHJ1ZTtcclxuICByZWZlcmVuY2UuYXR0cmlidXRlcyA9IHJlZmVyZW5jZS5hdHRyaWJ1dGVzIHx8IHt9O1xyXG4gIHJlZmVyZW5jZS5zZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcclxuICAgIHJlZmVyZW5jZS5hdHRyaWJ1dGVzW2tleV0gPSB2YWw7XHJcbiAgfTtcclxuICByZWZlcmVuY2UuZ2V0QXR0cmlidXRlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgcmV0dXJuIHJlZmVyZW5jZS5hdHRyaWJ1dGVzW2tleV07XHJcbiAgfTtcclxuICByZWZlcmVuY2UucmVtb3ZlQXR0cmlidXRlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgZGVsZXRlIHJlZmVyZW5jZS5hdHRyaWJ1dGVzW2tleV07XHJcbiAgfTtcclxuICByZWZlcmVuY2UuaGFzQXR0cmlidXRlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgcmV0dXJuIGtleSBpbiByZWZlcmVuY2UuYXR0cmlidXRlcztcclxuICB9O1xyXG4gIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKCkge307XHJcbiAgcmVmZXJlbmNlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7fTtcclxuICByZWZlcmVuY2UuY2xhc3NMaXN0ID0ge1xyXG4gICAgY2xhc3NOYW1lczoge30sXHJcbiAgICBhZGQ6IGZ1bmN0aW9uIGFkZChrZXkpIHtcclxuICAgICAgcmV0dXJuIHJlZmVyZW5jZS5jbGFzc0xpc3QuY2xhc3NOYW1lc1trZXldID0gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcclxuICAgICAgZGVsZXRlIHJlZmVyZW5jZS5jbGFzc0xpc3QuY2xhc3NOYW1lc1trZXldO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBjb250YWluczogZnVuY3Rpb24gY29udGFpbnMoa2V5KSB7XHJcbiAgICAgIHJldHVybiBrZXkgaW4gcmVmZXJlbmNlLmNsYXNzTGlzdC5jbGFzc05hbWVzO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBzdXBwb3J0ZWQgcHJlZml4ZWQgcHJvcGVydHkgLSBvbmx5IGB3ZWJraXRgIGlzIG5lZWRlZCwgYG1vemAsIGBtc2AgYW5kIGBvYCBhcmUgb2Jzb2xldGVcclxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5XHJcbiAqIEByZXR1cm4ge1N0cmluZ30gLSBicm93c2VyIHN1cHBvcnRlZCBwcmVmaXhlZCBwcm9wZXJ0eVxyXG4gKi9cclxuZnVuY3Rpb24gcHJlZml4KHByb3BlcnR5KSB7XHJcbiAgdmFyIHByZWZpeGVzID0gWycnLCAnd2Via2l0J107XHJcbiAgdmFyIHVwcGVyUHJvcCA9IHByb3BlcnR5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHkuc2xpY2UoMSk7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBfcHJlZml4ID0gcHJlZml4ZXNbaV07XHJcbiAgICB2YXIgcHJlZml4ZWRQcm9wID0gX3ByZWZpeCA/IF9wcmVmaXggKyB1cHBlclByb3AgOiBwcm9wZXJ0eTtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuYm9keS5zdHlsZVtwcmVmaXhlZFByb3BdICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICByZXR1cm4gcHJlZml4ZWRQcm9wO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgZGl2IGVsZW1lbnRcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbmZ1bmN0aW9uIGRpdigpIHtcclxuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgcG9wcGVyIGVsZW1lbnQgdGhlbiByZXR1cm5zIGl0XHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCAtIHRoZSBwb3BwZXIgaWRcclxuICogQHBhcmFtIHtTdHJpbmd9IHRpdGxlIC0gdGhlIHRvb2x0aXAncyBgdGl0bGVgIGF0dHJpYnV0ZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIGluZGl2aWR1YWwgb3B0aW9uc1xyXG4gKiBAcmV0dXJuIHtFbGVtZW50fSAtIHRoZSBwb3BwZXIgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlUG9wcGVyRWxlbWVudChpZCwgdGl0bGUsIG9wdGlvbnMpIHtcclxuICB2YXIgcG9wcGVyID0gZGl2KCk7XHJcbiAgcG9wcGVyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndGlwcHktcG9wcGVyJyk7XHJcbiAgcG9wcGVyLnNldEF0dHJpYnV0ZSgncm9sZScsICd0b29sdGlwJyk7XHJcbiAgcG9wcGVyLnNldEF0dHJpYnV0ZSgnaWQnLCAndGlwcHktJyArIGlkKTtcclxuICBwb3BwZXIuc3R5bGUuekluZGV4ID0gb3B0aW9ucy56SW5kZXg7XHJcbiAgcG9wcGVyLnN0eWxlLm1heFdpZHRoID0gb3B0aW9ucy5tYXhXaWR0aDtcclxuXHJcbiAgdmFyIHRvb2x0aXAgPSBkaXYoKTtcclxuICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndGlwcHktdG9vbHRpcCcpO1xyXG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLXNpemUnLCBvcHRpb25zLnNpemUpO1xyXG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLWFuaW1hdGlvbicsIG9wdGlvbnMuYW5pbWF0aW9uKTtcclxuICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0ZScsICdoaWRkZW4nKTtcclxuICBvcHRpb25zLnRoZW1lLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAodCkge1xyXG4gICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKHQgKyAnLXRoZW1lJyk7XHJcbiAgfSk7XHJcblxyXG4gIHZhciBjb250ZW50ID0gZGl2KCk7XHJcbiAgY29udGVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RpcHB5LWNvbnRlbnQnKTtcclxuXHJcbiAgaWYgKG9wdGlvbnMuYXJyb3cpIHtcclxuICAgIHZhciBhcnJvdyA9IGRpdigpO1xyXG4gICAgYXJyb3cuc3R5bGVbcHJlZml4KCd0cmFuc2Zvcm0nKV0gPSBvcHRpb25zLmFycm93VHJhbnNmb3JtO1xyXG5cclxuICAgIGlmIChvcHRpb25zLmFycm93VHlwZSA9PT0gJ3JvdW5kJykge1xyXG4gICAgICBhcnJvdy5jbGFzc0xpc3QuYWRkKCd0aXBweS1yb3VuZGFycm93Jyk7XHJcbiAgICAgIGFycm93LmlubmVySFRNTCA9ICc8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgOFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwiTTMgOHMyLjAyMS0uMDE1IDUuMjUzLTQuMjE4QzkuNTg0IDIuMDUxIDEwLjc5NyAxLjAwNyAxMiAxYzEuMjAzLS4wMDcgMi40MTYgMS4wMzUgMy43NjEgMi43ODJDMTkuMDEyIDguMDA1IDIxIDggMjEgOEgzelwiLz48L3N2Zz4nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXJyb3cuY2xhc3NMaXN0LmFkZCgndGlwcHktYXJyb3cnKTtcclxuICAgIH1cclxuXHJcbiAgICB0b29sdGlwLmFwcGVuZENoaWxkKGFycm93KTtcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLmFuaW1hdGVGaWxsKSB7XHJcbiAgICAvLyBDcmVhdGUgYW5pbWF0ZUZpbGwgY2lyY2xlIGVsZW1lbnQgZm9yIGFuaW1hdGlvblxyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYW5pbWF0ZWZpbGwnLCAnJyk7XHJcbiAgICB2YXIgYmFja2Ryb3AgPSBkaXYoKTtcclxuICAgIGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ3RpcHB5LWJhY2tkcm9wJyk7XHJcbiAgICBiYWNrZHJvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdGUnLCAnaGlkZGVuJyk7XHJcbiAgICB0b29sdGlwLmFwcGVuZENoaWxkKGJhY2tkcm9wKTtcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLmluZXJ0aWEpIHtcclxuICAgIC8vIENoYW5nZSB0cmFuc2l0aW9uIHRpbWluZyBmdW5jdGlvbiBjdWJpYyBiZXppZXJcclxuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLWluZXJ0aWEnLCAnJyk7XHJcbiAgfVxyXG5cclxuICBpZiAob3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW50ZXJhY3RpdmUnLCAnJyk7XHJcbiAgfVxyXG5cclxuICB2YXIgaHRtbCA9IG9wdGlvbnMuaHRtbDtcclxuICBpZiAoaHRtbCkge1xyXG4gICAgdmFyIHRlbXBsYXRlSWQgPSB2b2lkIDA7XHJcblxyXG4gICAgaWYgKGh0bWwgaW5zdGFuY2VvZiBFbGVtZW50KSB7XHJcbiAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoaHRtbCk7XHJcbiAgICAgIHRlbXBsYXRlSWQgPSAnIycgKyAoaHRtbC5pZCB8fCAndGlwcHktaHRtbC10ZW1wbGF0ZScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gdHJpY2sgbGludGVyczogaHR0cHM6Ly9naXRodWIuY29tL2F0b21pa3MvdGlwcHlqcy9pc3N1ZXMvMTk3XHJcbiAgICAgIGNvbnRlbnRbdHJ1ZSAmJiAnaW5uZXJIVE1MJ10gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGh0bWwpW3RydWUgJiYgJ2lubmVySFRNTCddO1xyXG4gICAgICB0ZW1wbGF0ZUlkID0gaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICBwb3BwZXIuc2V0QXR0cmlidXRlKCdkYXRhLWh0bWwnLCAnJyk7XHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnZGF0YS10ZW1wbGF0ZS1pZCcsIHRlbXBsYXRlSWQpO1xyXG5cclxuICAgIGlmIChvcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICAgIHBvcHBlci5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnRlbnRbb3B0aW9ucy5hbGxvd1RpdGxlSFRNTCA/ICdpbm5lckhUTUwnIDogJ3RleHRDb250ZW50J10gPSB0aXRsZTtcclxuICB9XHJcblxyXG4gIHRvb2x0aXAuYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcbiAgcG9wcGVyLmFwcGVuZENoaWxkKHRvb2x0aXApO1xyXG5cclxuICByZXR1cm4gcG9wcGVyO1xyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhIHRyaWdnZXIgYnkgYWRkaW5nIHRoZSBuZWNlc3NhcnkgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSByZWZlcmVuY2UgZWxlbWVudFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRUeXBlIC0gdGhlIGN1c3RvbSBldmVudCBzcGVjaWZpZWQgaW4gdGhlIGB0cmlnZ2VyYCBzZXR0aW5nXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcmVmZXJlbmNlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVycyAtIHRoZSBoYW5kbGVycyBmb3IgZWFjaCBldmVudFxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gKiBAcmV0dXJuIHtBcnJheX0gLSBhcnJheSBvZiBsaXN0ZW5lciBvYmplY3RzXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVUcmlnZ2VyKGV2ZW50VHlwZSwgcmVmZXJlbmNlLCBoYW5kbGVycywgb3B0aW9ucykge1xyXG4gIHZhciBvblRyaWdnZXIgPSBoYW5kbGVycy5vblRyaWdnZXIsXHJcbiAgICAgIG9uTW91c2VMZWF2ZSA9IGhhbmRsZXJzLm9uTW91c2VMZWF2ZSxcclxuICAgICAgb25CbHVyID0gaGFuZGxlcnMub25CbHVyLFxyXG4gICAgICBvbkRlbGVnYXRlU2hvdyA9IGhhbmRsZXJzLm9uRGVsZWdhdGVTaG93LFxyXG4gICAgICBvbkRlbGVnYXRlSGlkZSA9IGhhbmRsZXJzLm9uRGVsZWdhdGVIaWRlO1xyXG5cclxuICB2YXIgbGlzdGVuZXJzID0gW107XHJcblxyXG4gIGlmIChldmVudFR5cGUgPT09ICdtYW51YWwnKSByZXR1cm4gbGlzdGVuZXJzO1xyXG5cclxuICB2YXIgb24gPSBmdW5jdGlvbiBvbihldmVudFR5cGUsIGhhbmRsZXIpIHtcclxuICAgIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgaGFuZGxlcik7XHJcbiAgICBsaXN0ZW5lcnMucHVzaCh7IGV2ZW50OiBldmVudFR5cGUsIGhhbmRsZXI6IGhhbmRsZXIgfSk7XHJcbiAgfTtcclxuXHJcbiAgaWYgKCFvcHRpb25zLnRhcmdldCkge1xyXG4gICAgb24oZXZlbnRUeXBlLCBvblRyaWdnZXIpO1xyXG5cclxuICAgIGlmIChicm93c2VyLnN1cHBvcnRzVG91Y2ggJiYgb3B0aW9ucy50b3VjaEhvbGQpIHtcclxuICAgICAgb24oJ3RvdWNoc3RhcnQnLCBvblRyaWdnZXIpO1xyXG4gICAgICBvbigndG91Y2hlbmQnLCBvbk1vdXNlTGVhdmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50VHlwZSA9PT0gJ21vdXNlZW50ZXInKSB7XHJcbiAgICAgIG9uKCdtb3VzZWxlYXZlJywgb25Nb3VzZUxlYXZlKTtcclxuICAgIH1cclxuICAgIGlmIChldmVudFR5cGUgPT09ICdmb2N1cycpIHtcclxuICAgICAgb24oaXNJRSA/ICdmb2N1c291dCcgOiAnYmx1cicsIG9uQmx1cik7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChicm93c2VyLnN1cHBvcnRzVG91Y2ggJiYgb3B0aW9ucy50b3VjaEhvbGQpIHtcclxuICAgICAgb24oJ3RvdWNoc3RhcnQnLCBvbkRlbGVnYXRlU2hvdyk7XHJcbiAgICAgIG9uKCd0b3VjaGVuZCcsIG9uRGVsZWdhdGVIaWRlKTtcclxuICAgIH1cclxuICAgIGlmIChldmVudFR5cGUgPT09ICdtb3VzZWVudGVyJykge1xyXG4gICAgICBvbignbW91c2VvdmVyJywgb25EZWxlZ2F0ZVNob3cpO1xyXG4gICAgICBvbignbW91c2VvdXQnLCBvbkRlbGVnYXRlSGlkZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnRUeXBlID09PSAnZm9jdXMnKSB7XHJcbiAgICAgIG9uKCdmb2N1c2luJywgb25EZWxlZ2F0ZVNob3cpO1xyXG4gICAgICBvbignZm9jdXNvdXQnLCBvbkRlbGVnYXRlSGlkZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnRUeXBlID09PSAnY2xpY2snKSB7XHJcbiAgICAgIG9uKCdjbGljaycsIG9uRGVsZWdhdGVTaG93KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBsaXN0ZW5lcnM7XHJcbn1cclxuXHJcbnZhciBjbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcclxuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcclxuICB9XHJcbn07XHJcblxyXG52YXIgY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XHJcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcclxuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xyXG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xyXG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcclxuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xyXG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xyXG4gIH07XHJcbn0oKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xyXG5cclxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcclxuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGFyZ2V0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYW4gb2JqZWN0IG9mIHNldHRpbmdzIHRvIG92ZXJyaWRlIGdsb2JhbCBzZXR0aW5nc1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHJlZmVyZW5jZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VPcHRpb25zXHJcbiAqIEByZXR1cm4ge09iamVjdH0gLSBpbmRpdmlkdWFsIG9wdGlvbnNcclxuICovXHJcbmZ1bmN0aW9uIGdldEluZGl2aWR1YWxPcHRpb25zKHJlZmVyZW5jZSwgaW5zdGFuY2VPcHRpb25zKSB7XHJcbiAgdmFyIG9wdGlvbnMgPSBkZWZhdWx0c0tleXMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGtleSkge1xyXG4gICAgdmFyIHZhbCA9IHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGlwcHktJyArIGtleS50b0xvd2VyQ2FzZSgpKSB8fCBpbnN0YW5jZU9wdGlvbnNba2V5XTtcclxuXHJcbiAgICAvLyBDb252ZXJ0IHN0cmluZ3MgdG8gYm9vbGVhbnNcclxuICAgIGlmICh2YWwgPT09ICdmYWxzZScpIHZhbCA9IGZhbHNlO1xyXG4gICAgaWYgKHZhbCA9PT0gJ3RydWUnKSB2YWwgPSB0cnVlO1xyXG5cclxuICAgIC8vIENvbnZlcnQgbnVtYmVyIHN0cmluZ3MgdG8gdHJ1ZSBudW1iZXJzXHJcbiAgICBpZiAoaXNGaW5pdGUodmFsKSAmJiAhaXNOYU4ocGFyc2VGbG9hdCh2YWwpKSkge1xyXG4gICAgICB2YWwgPSBwYXJzZUZsb2F0KHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29udmVydCBhcnJheSBzdHJpbmdzIHRvIGFjdHVhbCBhcnJheXNcclxuICAgIGlmIChrZXkgIT09ICd0YXJnZXQnICYmIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbC50cmltKCkuY2hhckF0KDApID09PSAnWycpIHtcclxuICAgICAgdmFsID0gSlNPTi5wYXJzZSh2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjY1trZXldID0gdmFsO1xyXG5cclxuICAgIHJldHVybiBhY2M7XHJcbiAgfSwge30pO1xyXG5cclxuICByZXR1cm4gX2V4dGVuZHMoe30sIGluc3RhbmNlT3B0aW9ucywgb3B0aW9ucyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFdmFsdWF0ZXMvbW9kaWZpZXMgdGhlIG9wdGlvbnMgb2JqZWN0IGZvciBhcHByb3ByaWF0ZSBiZWhhdmlvclxyXG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSByZWZlcmVuY2VcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICogQHJldHVybiB7T2JqZWN0fSBtb2RpZmllZC9ldmFsdWF0ZWQgb3B0aW9uc1xyXG4gKi9cclxuZnVuY3Rpb24gZXZhbHVhdGVPcHRpb25zKHJlZmVyZW5jZSwgb3B0aW9ucykge1xyXG4gIC8vIGFuaW1hdGVGaWxsIGlzIGRpc2FibGVkIGlmIGFuIGFycm93IGlzIHRydWVcclxuICBpZiAob3B0aW9ucy5hcnJvdykge1xyXG4gICAgb3B0aW9ucy5hbmltYXRlRmlsbCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgaWYgKG9wdGlvbnMuYXBwZW5kVG8gJiYgdHlwZW9mIG9wdGlvbnMuYXBwZW5kVG8gPT09ICdmdW5jdGlvbicpIHtcclxuICAgIG9wdGlvbnMuYXBwZW5kVG8gPSBvcHRpb25zLmFwcGVuZFRvKCk7XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIG9wdGlvbnMuaHRtbCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgb3B0aW9ucy5odG1sID0gb3B0aW9ucy5odG1sKHJlZmVyZW5jZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3B0aW9ucztcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgaW5uZXIgZWxlbWVudHMgb2YgdGhlIHBvcHBlciBlbGVtZW50XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcG9wcGVyXHJcbiAqIEByZXR1cm4ge09iamVjdH1cclxuICovXHJcbmZ1bmN0aW9uIGdldElubmVyRWxlbWVudHMocG9wcGVyKSB7XHJcbiAgdmFyIHNlbGVjdCA9IGZ1bmN0aW9uIHNlbGVjdChzKSB7XHJcbiAgICByZXR1cm4gcG9wcGVyLnF1ZXJ5U2VsZWN0b3Iocyk7XHJcbiAgfTtcclxuICByZXR1cm4ge1xyXG4gICAgdG9vbHRpcDogc2VsZWN0KHNlbGVjdG9ycy5UT09MVElQKSxcclxuICAgIGJhY2tkcm9wOiBzZWxlY3Qoc2VsZWN0b3JzLkJBQ0tEUk9QKSxcclxuICAgIGNvbnRlbnQ6IHNlbGVjdChzZWxlY3RvcnMuQ09OVEVOVCksXHJcbiAgICBhcnJvdzogc2VsZWN0KHNlbGVjdG9ycy5BUlJPVykgfHwgc2VsZWN0KHNlbGVjdG9ycy5ST1VORF9BUlJPVylcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICogUmVtb3ZlcyB0aGUgdGl0bGUgZnJvbSBhbiBlbGVtZW50LCBzZXR0aW5nIGBkYXRhLW9yaWdpbmFsLXRpdGxlYFxyXG4gKiBhcHByb3ByaWF0ZWx5XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcclxuICovXHJcbmZ1bmN0aW9uIHJlbW92ZVRpdGxlKGVsKSB7XHJcbiAgdmFyIHRpdGxlID0gZWwuZ2V0QXR0cmlidXRlKCd0aXRsZScpO1xyXG4gIC8vIE9ubHkgc2V0IGBkYXRhLW9yaWdpbmFsLXRpdGxlYCBhdHRyIGlmIHRoZXJlIGlzIGEgdGl0bGVcclxuICBpZiAodGl0bGUpIHtcclxuICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1vcmlnaW5hbC10aXRsZScsIHRpdGxlKTtcclxuICB9XHJcbiAgZWwucmVtb3ZlQXR0cmlidXRlKCd0aXRsZScpO1xyXG59XHJcblxyXG4vKiohXHJcbiAqIEBmaWxlT3ZlcnZpZXcgS2lja2FzcyBsaWJyYXJ5IHRvIGNyZWF0ZSBhbmQgcGxhY2UgcG9wcGVycyBuZWFyIHRoZWlyIHJlZmVyZW5jZSBlbGVtZW50cy5cclxuICogQHZlcnNpb24gMS4xNC4zXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNiBGZWRlcmljbyBaaXZvbG8gYW5kIGNvbnRyaWJ1dG9yc1xyXG4gKlxyXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXHJcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG4gKlxyXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcclxuICogY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuICpcclxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcclxuICogU09GVFdBUkUuXHJcbiAqL1xyXG52YXIgaXNCcm93c2VyJDEgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnO1xyXG5cclxudmFyIGxvbmdlclRpbWVvdXRCcm93c2VycyA9IFsnRWRnZScsICdUcmlkZW50JywgJ0ZpcmVmb3gnXTtcclxudmFyIHRpbWVvdXREdXJhdGlvbiA9IDA7XHJcbmZvciAodmFyIGkgPSAwOyBpIDwgbG9uZ2VyVGltZW91dEJyb3dzZXJzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgaWYgKGlzQnJvd3NlciQxICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihsb25nZXJUaW1lb3V0QnJvd3NlcnNbaV0pID49IDApIHtcclxuICAgIHRpbWVvdXREdXJhdGlvbiA9IDE7XHJcbiAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1pY3JvdGFza0RlYm91bmNlKGZuKSB7XHJcbiAgdmFyIGNhbGxlZCA9IGZhbHNlO1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoY2FsbGVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNhbGxlZCA9IHRydWU7XHJcbiAgICB3aW5kb3cuUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNhbGxlZCA9IGZhbHNlO1xyXG4gICAgICBmbigpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gdGFza0RlYm91bmNlKGZuKSB7XHJcbiAgdmFyIHNjaGVkdWxlZCA9IGZhbHNlO1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoIXNjaGVkdWxlZCkge1xyXG4gICAgICBzY2hlZHVsZWQgPSB0cnVlO1xyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzY2hlZHVsZWQgPSBmYWxzZTtcclxuICAgICAgICBmbigpO1xyXG4gICAgICB9LCB0aW1lb3V0RHVyYXRpb24pO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbnZhciBzdXBwb3J0c01pY3JvVGFza3MgPSBpc0Jyb3dzZXIkMSAmJiB3aW5kb3cuUHJvbWlzZTtcclxuXHJcbi8qKlxyXG4qIENyZWF0ZSBhIGRlYm91bmNlZCB2ZXJzaW9uIG9mIGEgbWV0aG9kLCB0aGF0J3MgYXN5bmNocm9ub3VzbHkgZGVmZXJyZWRcclxuKiBidXQgY2FsbGVkIGluIHRoZSBtaW5pbXVtIHRpbWUgcG9zc2libGUuXHJcbipcclxuKiBAbWV0aG9kXHJcbiogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4qIEBhcmd1bWVudCB7RnVuY3Rpb259IGZuXHJcbiogQHJldHVybnMge0Z1bmN0aW9ufVxyXG4qL1xyXG52YXIgZGVib3VuY2UgPSBzdXBwb3J0c01pY3JvVGFza3MgPyBtaWNyb3Rhc2tEZWJvdW5jZSA6IHRhc2tEZWJvdW5jZTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdmFyaWFibGUgaXMgYSBmdW5jdGlvblxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtBbnl9IGZ1bmN0aW9uVG9DaGVjayAtIHZhcmlhYmxlIHRvIGNoZWNrXHJcbiAqIEByZXR1cm5zIHtCb29sZWFufSBhbnN3ZXIgdG86IGlzIGEgZnVuY3Rpb24/XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGZ1bmN0aW9uVG9DaGVjaykge1xyXG4gIHZhciBnZXRUeXBlID0ge307XHJcbiAgcmV0dXJuIGZ1bmN0aW9uVG9DaGVjayAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwoZnVuY3Rpb25Ub0NoZWNrKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBDU1MgY29tcHV0ZWQgcHJvcGVydHkgb2YgdGhlIGdpdmVuIGVsZW1lbnRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWVtZW50fSBlbGVtZW50XHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwcm9wZXJ0eVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KGVsZW1lbnQsIHByb3BlcnR5KSB7XHJcbiAgaWYgKGVsZW1lbnQubm9kZVR5cGUgIT09IDEpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcbiAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcclxuICB2YXIgY3NzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKTtcclxuICByZXR1cm4gcHJvcGVydHkgPyBjc3NbcHJvcGVydHldIDogY3NzO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgcGFyZW50Tm9kZSBvciB0aGUgaG9zdCBvZiB0aGUgZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtFbGVtZW50fSBwYXJlbnRcclxuICovXHJcbmZ1bmN0aW9uIGdldFBhcmVudE5vZGUoZWxlbWVudCkge1xyXG4gIGlmIChlbGVtZW50Lm5vZGVOYW1lID09PSAnSFRNTCcpIHtcclxuICAgIHJldHVybiBlbGVtZW50O1xyXG4gIH1cclxuICByZXR1cm4gZWxlbWVudC5wYXJlbnROb2RlIHx8IGVsZW1lbnQuaG9zdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHNjcm9sbGluZyBwYXJlbnQgb2YgdGhlIGdpdmVuIGVsZW1lbnRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7RWxlbWVudH0gc2Nyb2xsIHBhcmVudFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0U2Nyb2xsUGFyZW50KGVsZW1lbnQpIHtcclxuICAvLyBSZXR1cm4gYm9keSwgYGdldFNjcm9sbGAgd2lsbCB0YWtlIGNhcmUgdG8gZ2V0IHRoZSBjb3JyZWN0IGBzY3JvbGxUb3BgIGZyb20gaXRcclxuICBpZiAoIWVsZW1lbnQpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5ib2R5O1xyXG4gIH1cclxuXHJcbiAgc3dpdGNoIChlbGVtZW50Lm5vZGVOYW1lKSB7XHJcbiAgICBjYXNlICdIVE1MJzpcclxuICAgIGNhc2UgJ0JPRFknOlxyXG4gICAgICByZXR1cm4gZWxlbWVudC5vd25lckRvY3VtZW50LmJvZHk7XHJcbiAgICBjYXNlICcjZG9jdW1lbnQnOlxyXG4gICAgICByZXR1cm4gZWxlbWVudC5ib2R5O1xyXG4gIH1cclxuXHJcbiAgLy8gRmlyZWZveCB3YW50IHVzIHRvIGNoZWNrIGAteGAgYW5kIGAteWAgdmFyaWF0aW9ucyBhcyB3ZWxsXHJcblxyXG4gIHZhciBfZ2V0U3R5bGVDb21wdXRlZFByb3AgPSBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCksXHJcbiAgICAgIG92ZXJmbG93ID0gX2dldFN0eWxlQ29tcHV0ZWRQcm9wLm92ZXJmbG93LFxyXG4gICAgICBvdmVyZmxvd1ggPSBfZ2V0U3R5bGVDb21wdXRlZFByb3Aub3ZlcmZsb3dYLFxyXG4gICAgICBvdmVyZmxvd1kgPSBfZ2V0U3R5bGVDb21wdXRlZFByb3Aub3ZlcmZsb3dZO1xyXG5cclxuICBpZiAoLyhhdXRvfHNjcm9sbHxvdmVybGF5KS8udGVzdChvdmVyZmxvdyArIG92ZXJmbG93WSArIG92ZXJmbG93WCkpIHtcclxuICAgIHJldHVybiBlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGdldFNjcm9sbFBhcmVudChnZXRQYXJlbnROb2RlKGVsZW1lbnQpKTtcclxufVxyXG5cclxudmFyIGlzSUUxMSA9IGlzQnJvd3NlciQxICYmICEhKHdpbmRvdy5NU0lucHV0TWV0aG9kQ29udGV4dCAmJiBkb2N1bWVudC5kb2N1bWVudE1vZGUpO1xyXG52YXIgaXNJRTEwID0gaXNCcm93c2VyJDEgJiYgL01TSUUgMTAvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lcyBpZiB0aGUgYnJvd3NlciBpcyBJbnRlcm5ldCBFeHBsb3JlclxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtOdW1iZXJ9IHZlcnNpb24gdG8gY2hlY2tcclxuICogQHJldHVybnMge0Jvb2xlYW59IGlzSUVcclxuICovXHJcbmZ1bmN0aW9uIGlzSUUkMSh2ZXJzaW9uKSB7XHJcbiAgaWYgKHZlcnNpb24gPT09IDExKSB7XHJcbiAgICByZXR1cm4gaXNJRTExO1xyXG4gIH1cclxuICBpZiAodmVyc2lvbiA9PT0gMTApIHtcclxuICAgIHJldHVybiBpc0lFMTA7XHJcbiAgfVxyXG4gIHJldHVybiBpc0lFMTEgfHwgaXNJRTEwO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgb2Zmc2V0IHBhcmVudCBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtFbGVtZW50fSBvZmZzZXQgcGFyZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudCkge1xyXG4gIGlmICghZWxlbWVudCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICB9XHJcblxyXG4gIHZhciBub09mZnNldFBhcmVudCA9IGlzSUUkMSgxMCkgPyBkb2N1bWVudC5ib2R5IDogbnVsbDtcclxuXHJcbiAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcclxuICB2YXIgb2Zmc2V0UGFyZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQ7XHJcbiAgLy8gU2tpcCBoaWRkZW4gZWxlbWVudHMgd2hpY2ggZG9uJ3QgaGF2ZSBhbiBvZmZzZXRQYXJlbnRcclxuICB3aGlsZSAob2Zmc2V0UGFyZW50ID09PSBub09mZnNldFBhcmVudCAmJiBlbGVtZW50Lm5leHRFbGVtZW50U2libGluZykge1xyXG4gICAgb2Zmc2V0UGFyZW50ID0gKGVsZW1lbnQgPSBlbGVtZW50Lm5leHRFbGVtZW50U2libGluZykub2Zmc2V0UGFyZW50O1xyXG4gIH1cclxuXHJcbiAgdmFyIG5vZGVOYW1lID0gb2Zmc2V0UGFyZW50ICYmIG9mZnNldFBhcmVudC5ub2RlTmFtZTtcclxuXHJcbiAgaWYgKCFub2RlTmFtZSB8fCBub2RlTmFtZSA9PT0gJ0JPRFknIHx8IG5vZGVOYW1lID09PSAnSFRNTCcpIHtcclxuICAgIHJldHVybiBlbGVtZW50ID8gZWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCA6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICB9XHJcblxyXG4gIC8vIC5vZmZzZXRQYXJlbnQgd2lsbCByZXR1cm4gdGhlIGNsb3Nlc3QgVEQgb3IgVEFCTEUgaW4gY2FzZVxyXG4gIC8vIG5vIG9mZnNldFBhcmVudCBpcyBwcmVzZW50LCBJIGhhdGUgdGhpcyBqb2IuLi5cclxuICBpZiAoWydURCcsICdUQUJMRSddLmluZGV4T2Yob2Zmc2V0UGFyZW50Lm5vZGVOYW1lKSAhPT0gLTEgJiYgZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KG9mZnNldFBhcmVudCwgJ3Bvc2l0aW9uJykgPT09ICdzdGF0aWMnKSB7XHJcbiAgICByZXR1cm4gZ2V0T2Zmc2V0UGFyZW50KG9mZnNldFBhcmVudCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb2Zmc2V0UGFyZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc09mZnNldENvbnRhaW5lcihlbGVtZW50KSB7XHJcbiAgdmFyIG5vZGVOYW1lID0gZWxlbWVudC5ub2RlTmFtZTtcclxuXHJcbiAgaWYgKG5vZGVOYW1lID09PSAnQk9EWScpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIG5vZGVOYW1lID09PSAnSFRNTCcgfHwgZ2V0T2Zmc2V0UGFyZW50KGVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpID09PSBlbGVtZW50O1xyXG59XHJcblxyXG4vKipcclxuICogRmluZHMgdGhlIHJvb3Qgbm9kZSAoZG9jdW1lbnQsIHNoYWRvd0RPTSByb290KSBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBub2RlXHJcbiAqIEByZXR1cm5zIHtFbGVtZW50fSByb290IG5vZGVcclxuICovXHJcbmZ1bmN0aW9uIGdldFJvb3Qobm9kZSkge1xyXG4gIGlmIChub2RlLnBhcmVudE5vZGUgIT09IG51bGwpIHtcclxuICAgIHJldHVybiBnZXRSb290KG5vZGUucGFyZW50Tm9kZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZpbmRzIHRoZSBvZmZzZXQgcGFyZW50IGNvbW1vbiB0byB0aGUgdHdvIHByb3ZpZGVkIG5vZGVzXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnQxXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudDJcclxuICogQHJldHVybnMge0VsZW1lbnR9IGNvbW1vbiBvZmZzZXQgcGFyZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50KGVsZW1lbnQxLCBlbGVtZW50Mikge1xyXG4gIC8vIFRoaXMgY2hlY2sgaXMgbmVlZGVkIHRvIGF2b2lkIGVycm9ycyBpbiBjYXNlIG9uZSBvZiB0aGUgZWxlbWVudHMgaXNuJ3QgZGVmaW5lZCBmb3IgYW55IHJlYXNvblxyXG4gIGlmICghZWxlbWVudDEgfHwgIWVsZW1lbnQxLm5vZGVUeXBlIHx8ICFlbGVtZW50MiB8fCAhZWxlbWVudDIubm9kZVR5cGUpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICAvLyBIZXJlIHdlIG1ha2Ugc3VyZSB0byBnaXZlIGFzIFwic3RhcnRcIiB0aGUgZWxlbWVudCB0aGF0IGNvbWVzIGZpcnN0IGluIHRoZSBET01cclxuICB2YXIgb3JkZXIgPSBlbGVtZW50MS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihlbGVtZW50MikgJiBOb2RlLkRPQ1VNRU5UX1BPU0lUSU9OX0ZPTExPV0lORztcclxuICB2YXIgc3RhcnQgPSBvcmRlciA/IGVsZW1lbnQxIDogZWxlbWVudDI7XHJcbiAgdmFyIGVuZCA9IG9yZGVyID8gZWxlbWVudDIgOiBlbGVtZW50MTtcclxuXHJcbiAgLy8gR2V0IGNvbW1vbiBhbmNlc3RvciBjb250YWluZXJcclxuICB2YXIgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xyXG4gIHJhbmdlLnNldFN0YXJ0KHN0YXJ0LCAwKTtcclxuICByYW5nZS5zZXRFbmQoZW5kLCAwKTtcclxuICB2YXIgY29tbW9uQW5jZXN0b3JDb250YWluZXIgPSByYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcclxuXHJcbiAgLy8gQm90aCBub2RlcyBhcmUgaW5zaWRlICNkb2N1bWVudFxyXG5cclxuICBpZiAoZWxlbWVudDEgIT09IGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyICYmIGVsZW1lbnQyICE9PSBjb21tb25BbmNlc3RvckNvbnRhaW5lciB8fCBzdGFydC5jb250YWlucyhlbmQpKSB7XHJcbiAgICBpZiAoaXNPZmZzZXRDb250YWluZXIoY29tbW9uQW5jZXN0b3JDb250YWluZXIpKSB7XHJcbiAgICAgIHJldHVybiBjb21tb25BbmNlc3RvckNvbnRhaW5lcjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZ2V0T2Zmc2V0UGFyZW50KGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyKTtcclxuICB9XHJcblxyXG4gIC8vIG9uZSBvZiB0aGUgbm9kZXMgaXMgaW5zaWRlIHNoYWRvd0RPTSwgZmluZCB3aGljaCBvbmVcclxuICB2YXIgZWxlbWVudDFyb290ID0gZ2V0Um9vdChlbGVtZW50MSk7XHJcbiAgaWYgKGVsZW1lbnQxcm9vdC5ob3N0KSB7XHJcbiAgICByZXR1cm4gZmluZENvbW1vbk9mZnNldFBhcmVudChlbGVtZW50MXJvb3QuaG9zdCwgZWxlbWVudDIpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gZmluZENvbW1vbk9mZnNldFBhcmVudChlbGVtZW50MSwgZ2V0Um9vdChlbGVtZW50MikuaG9zdCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogR2V0cyB0aGUgc2Nyb2xsIHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50IGluIHRoZSBnaXZlbiBzaWRlICh0b3AgYW5kIGxlZnQpXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHNpZGUgYHRvcGAgb3IgYGxlZnRgXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGFtb3VudCBvZiBzY3JvbGxlZCBwaXhlbHNcclxuICovXHJcbmZ1bmN0aW9uIGdldFNjcm9sbChlbGVtZW50KSB7XHJcbiAgdmFyIHNpZGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICd0b3AnO1xyXG5cclxuICB2YXIgdXBwZXJTaWRlID0gc2lkZSA9PT0gJ3RvcCcgPyAnc2Nyb2xsVG9wJyA6ICdzY3JvbGxMZWZ0JztcclxuICB2YXIgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lO1xyXG5cclxuICBpZiAobm9kZU5hbWUgPT09ICdCT0RZJyB8fCBub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XHJcbiAgICB2YXIgaHRtbCA9IGVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICB2YXIgc2Nyb2xsaW5nRWxlbWVudCA9IGVsZW1lbnQub3duZXJEb2N1bWVudC5zY3JvbGxpbmdFbGVtZW50IHx8IGh0bWw7XHJcbiAgICByZXR1cm4gc2Nyb2xsaW5nRWxlbWVudFt1cHBlclNpZGVdO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGVsZW1lbnRbdXBwZXJTaWRlXTtcclxufVxyXG5cclxuLypcclxuICogU3VtIG9yIHN1YnRyYWN0IHRoZSBlbGVtZW50IHNjcm9sbCB2YWx1ZXMgKGxlZnQgYW5kIHRvcCkgZnJvbSBhIGdpdmVuIHJlY3Qgb2JqZWN0XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge09iamVjdH0gcmVjdCAtIFJlY3Qgb2JqZWN0IHlvdSB3YW50IHRvIGNoYW5nZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gVGhlIGVsZW1lbnQgZnJvbSB0aGUgZnVuY3Rpb24gcmVhZHMgdGhlIHNjcm9sbCB2YWx1ZXNcclxuICogQHBhcmFtIHtCb29sZWFufSBzdWJ0cmFjdCAtIHNldCB0byB0cnVlIGlmIHlvdSB3YW50IHRvIHN1YnRyYWN0IHRoZSBzY3JvbGwgdmFsdWVzXHJcbiAqIEByZXR1cm4ge09iamVjdH0gcmVjdCAtIFRoZSBtb2RpZmllciByZWN0IG9iamVjdFxyXG4gKi9cclxuZnVuY3Rpb24gaW5jbHVkZVNjcm9sbChyZWN0LCBlbGVtZW50KSB7XHJcbiAgdmFyIHN1YnRyYWN0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmYWxzZTtcclxuXHJcbiAgdmFyIHNjcm9sbFRvcCA9IGdldFNjcm9sbChlbGVtZW50LCAndG9wJyk7XHJcbiAgdmFyIHNjcm9sbExlZnQgPSBnZXRTY3JvbGwoZWxlbWVudCwgJ2xlZnQnKTtcclxuICB2YXIgbW9kaWZpZXIgPSBzdWJ0cmFjdCA/IC0xIDogMTtcclxuICByZWN0LnRvcCArPSBzY3JvbGxUb3AgKiBtb2RpZmllcjtcclxuICByZWN0LmJvdHRvbSArPSBzY3JvbGxUb3AgKiBtb2RpZmllcjtcclxuICByZWN0LmxlZnQgKz0gc2Nyb2xsTGVmdCAqIG1vZGlmaWVyO1xyXG4gIHJlY3QucmlnaHQgKz0gc2Nyb2xsTGVmdCAqIG1vZGlmaWVyO1xyXG4gIHJldHVybiByZWN0O1xyXG59XHJcblxyXG4vKlxyXG4gKiBIZWxwZXIgdG8gZGV0ZWN0IGJvcmRlcnMgb2YgYSBnaXZlbiBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge0NTU1N0eWxlRGVjbGFyYXRpb259IHN0eWxlc1xyXG4gKiBSZXN1bHQgb2YgYGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eWAgb24gdGhlIGdpdmVuIGVsZW1lbnRcclxuICogQHBhcmFtIHtTdHJpbmd9IGF4aXMgLSBgeGAgb3IgYHlgXHJcbiAqIEByZXR1cm4ge251bWJlcn0gYm9yZGVycyAtIFRoZSBib3JkZXJzIHNpemUgb2YgdGhlIGdpdmVuIGF4aXNcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRCb3JkZXJzU2l6ZShzdHlsZXMsIGF4aXMpIHtcclxuICB2YXIgc2lkZUEgPSBheGlzID09PSAneCcgPyAnTGVmdCcgOiAnVG9wJztcclxuICB2YXIgc2lkZUIgPSBzaWRlQSA9PT0gJ0xlZnQnID8gJ1JpZ2h0JyA6ICdCb3R0b20nO1xyXG5cclxuICByZXR1cm4gcGFyc2VGbG9hdChzdHlsZXNbJ2JvcmRlcicgKyBzaWRlQSArICdXaWR0aCddLCAxMCkgKyBwYXJzZUZsb2F0KHN0eWxlc1snYm9yZGVyJyArIHNpZGVCICsgJ1dpZHRoJ10sIDEwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2l6ZShheGlzLCBib2R5LCBodG1sLCBjb21wdXRlZFN0eWxlKSB7XHJcbiAgcmV0dXJuIE1hdGgubWF4KGJvZHlbJ29mZnNldCcgKyBheGlzXSwgYm9keVsnc2Nyb2xsJyArIGF4aXNdLCBodG1sWydjbGllbnQnICsgYXhpc10sIGh0bWxbJ29mZnNldCcgKyBheGlzXSwgaHRtbFsnc2Nyb2xsJyArIGF4aXNdLCBpc0lFJDEoMTApID8gaHRtbFsnb2Zmc2V0JyArIGF4aXNdICsgY29tcHV0ZWRTdHlsZVsnbWFyZ2luJyArIChheGlzID09PSAnSGVpZ2h0JyA/ICdUb3AnIDogJ0xlZnQnKV0gKyBjb21wdXRlZFN0eWxlWydtYXJnaW4nICsgKGF4aXMgPT09ICdIZWlnaHQnID8gJ0JvdHRvbScgOiAnUmlnaHQnKV0gOiAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0V2luZG93U2l6ZXMoKSB7XHJcbiAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gIHZhciBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIHZhciBjb21wdXRlZFN0eWxlID0gaXNJRSQxKDEwKSAmJiBnZXRDb21wdXRlZFN0eWxlKGh0bWwpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaGVpZ2h0OiBnZXRTaXplKCdIZWlnaHQnLCBib2R5LCBodG1sLCBjb21wdXRlZFN0eWxlKSxcclxuICAgIHdpZHRoOiBnZXRTaXplKCdXaWR0aCcsIGJvZHksIGh0bWwsIGNvbXB1dGVkU3R5bGUpXHJcbiAgfTtcclxufVxyXG5cclxudmFyIGNsYXNzQ2FsbENoZWNrJDEgPSBmdW5jdGlvbiBjbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcclxuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcclxuICB9XHJcbn07XHJcblxyXG52YXIgY3JlYXRlQ2xhc3MkMSA9IGZ1bmN0aW9uICgpIHtcclxuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcclxuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xyXG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XHJcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XHJcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xyXG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XHJcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XHJcbiAgfTtcclxufSgpO1xyXG5cclxudmFyIGRlZmluZVByb3BlcnR5JDEgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcclxuICBpZiAoa2V5IGluIG9iaikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XHJcbiAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIG9ialtrZXldID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb2JqO1xyXG59O1xyXG5cclxudmFyIF9leHRlbmRzJDEgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcclxuXHJcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XHJcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRhcmdldDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHaXZlbiBlbGVtZW50IG9mZnNldHMsIGdlbmVyYXRlIGFuIG91dHB1dCBzaW1pbGFyIHRvIGdldEJvdW5kaW5nQ2xpZW50UmVjdFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9mZnNldHNcclxuICogQHJldHVybnMge09iamVjdH0gQ2xpZW50UmVjdCBsaWtlIG91dHB1dFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Q2xpZW50UmVjdChvZmZzZXRzKSB7XHJcbiAgcmV0dXJuIF9leHRlbmRzJDEoe30sIG9mZnNldHMsIHtcclxuICAgIHJpZ2h0OiBvZmZzZXRzLmxlZnQgKyBvZmZzZXRzLndpZHRoLFxyXG4gICAgYm90dG9tOiBvZmZzZXRzLnRvcCArIG9mZnNldHMuaGVpZ2h0XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYm91bmRpbmcgY2xpZW50IHJlY3Qgb2YgZ2l2ZW4gZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IGNsaWVudCByZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCkge1xyXG4gIHZhciByZWN0ID0ge307XHJcblxyXG4gIC8vIElFMTAgMTAgRklYOiBQbGVhc2UsIGRvbid0IGFzaywgdGhlIGVsZW1lbnQgaXNuJ3RcclxuICAvLyBjb25zaWRlcmVkIGluIERPTSBpbiBzb21lIGNpcmN1bXN0YW5jZXMuLi5cclxuICAvLyBUaGlzIGlzbid0IHJlcHJvZHVjaWJsZSBpbiBJRTEwIGNvbXBhdGliaWxpdHkgbW9kZSBvZiBJRTExXHJcbiAgdHJ5IHtcclxuICAgIGlmIChpc0lFJDEoMTApKSB7XHJcbiAgICAgIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICB2YXIgc2Nyb2xsVG9wID0gZ2V0U2Nyb2xsKGVsZW1lbnQsICd0b3AnKTtcclxuICAgICAgdmFyIHNjcm9sbExlZnQgPSBnZXRTY3JvbGwoZWxlbWVudCwgJ2xlZnQnKTtcclxuICAgICAgcmVjdC50b3AgKz0gc2Nyb2xsVG9wO1xyXG4gICAgICByZWN0LmxlZnQgKz0gc2Nyb2xsTGVmdDtcclxuICAgICAgcmVjdC5ib3R0b20gKz0gc2Nyb2xsVG9wO1xyXG4gICAgICByZWN0LnJpZ2h0ICs9IHNjcm9sbExlZnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7fVxyXG5cclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgbGVmdDogcmVjdC5sZWZ0LFxyXG4gICAgdG9wOiByZWN0LnRvcCxcclxuICAgIHdpZHRoOiByZWN0LnJpZ2h0IC0gcmVjdC5sZWZ0LFxyXG4gICAgaGVpZ2h0OiByZWN0LmJvdHRvbSAtIHJlY3QudG9wXHJcbiAgfTtcclxuXHJcbiAgLy8gc3VidHJhY3Qgc2Nyb2xsYmFyIHNpemUgZnJvbSBzaXplc1xyXG4gIHZhciBzaXplcyA9IGVsZW1lbnQubm9kZU5hbWUgPT09ICdIVE1MJyA/IGdldFdpbmRvd1NpemVzKCkgOiB7fTtcclxuICB2YXIgd2lkdGggPSBzaXplcy53aWR0aCB8fCBlbGVtZW50LmNsaWVudFdpZHRoIHx8IHJlc3VsdC5yaWdodCAtIHJlc3VsdC5sZWZ0O1xyXG4gIHZhciBoZWlnaHQgPSBzaXplcy5oZWlnaHQgfHwgZWxlbWVudC5jbGllbnRIZWlnaHQgfHwgcmVzdWx0LmJvdHRvbSAtIHJlc3VsdC50b3A7XHJcblxyXG4gIHZhciBob3JpelNjcm9sbGJhciA9IGVsZW1lbnQub2Zmc2V0V2lkdGggLSB3aWR0aDtcclxuICB2YXIgdmVydFNjcm9sbGJhciA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gaGVpZ2h0O1xyXG5cclxuICAvLyBpZiBhbiBoeXBvdGhldGljYWwgc2Nyb2xsYmFyIGlzIGRldGVjdGVkLCB3ZSBtdXN0IGJlIHN1cmUgaXQncyBub3QgYSBgYm9yZGVyYFxyXG4gIC8vIHdlIG1ha2UgdGhpcyBjaGVjayBjb25kaXRpb25hbCBmb3IgcGVyZm9ybWFuY2UgcmVhc29uc1xyXG4gIGlmIChob3JpelNjcm9sbGJhciB8fCB2ZXJ0U2Nyb2xsYmFyKSB7XHJcbiAgICB2YXIgc3R5bGVzID0gZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KGVsZW1lbnQpO1xyXG4gICAgaG9yaXpTY3JvbGxiYXIgLT0gZ2V0Qm9yZGVyc1NpemUoc3R5bGVzLCAneCcpO1xyXG4gICAgdmVydFNjcm9sbGJhciAtPSBnZXRCb3JkZXJzU2l6ZShzdHlsZXMsICd5Jyk7XHJcblxyXG4gICAgcmVzdWx0LndpZHRoIC09IGhvcml6U2Nyb2xsYmFyO1xyXG4gICAgcmVzdWx0LmhlaWdodCAtPSB2ZXJ0U2Nyb2xsYmFyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGdldENsaWVudFJlY3QocmVzdWx0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlKGNoaWxkcmVuLCBwYXJlbnQpIHtcclxuICB2YXIgZml4ZWRQb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XHJcblxyXG4gIHZhciBpc0lFMTAgPSBpc0lFJDEoMTApO1xyXG4gIHZhciBpc0hUTUwgPSBwYXJlbnQubm9kZU5hbWUgPT09ICdIVE1MJztcclxuICB2YXIgY2hpbGRyZW5SZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGNoaWxkcmVuKTtcclxuICB2YXIgcGFyZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChwYXJlbnQpO1xyXG4gIHZhciBzY3JvbGxQYXJlbnQgPSBnZXRTY3JvbGxQYXJlbnQoY2hpbGRyZW4pO1xyXG5cclxuICB2YXIgc3R5bGVzID0gZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KHBhcmVudCk7XHJcbiAgdmFyIGJvcmRlclRvcFdpZHRoID0gcGFyc2VGbG9hdChzdHlsZXMuYm9yZGVyVG9wV2lkdGgsIDEwKTtcclxuICB2YXIgYm9yZGVyTGVmdFdpZHRoID0gcGFyc2VGbG9hdChzdHlsZXMuYm9yZGVyTGVmdFdpZHRoLCAxMCk7XHJcblxyXG4gIC8vIEluIGNhc2VzIHdoZXJlIHRoZSBwYXJlbnQgaXMgZml4ZWQsIHdlIG11c3QgaWdub3JlIG5lZ2F0aXZlIHNjcm9sbCBpbiBvZmZzZXQgY2FsY1xyXG4gIGlmIChmaXhlZFBvc2l0aW9uICYmIHBhcmVudC5ub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XHJcbiAgICBwYXJlbnRSZWN0LnRvcCA9IE1hdGgubWF4KHBhcmVudFJlY3QudG9wLCAwKTtcclxuICAgIHBhcmVudFJlY3QubGVmdCA9IE1hdGgubWF4KHBhcmVudFJlY3QubGVmdCwgMCk7XHJcbiAgfVxyXG4gIHZhciBvZmZzZXRzID0gZ2V0Q2xpZW50UmVjdCh7XHJcbiAgICB0b3A6IGNoaWxkcmVuUmVjdC50b3AgLSBwYXJlbnRSZWN0LnRvcCAtIGJvcmRlclRvcFdpZHRoLFxyXG4gICAgbGVmdDogY2hpbGRyZW5SZWN0LmxlZnQgLSBwYXJlbnRSZWN0LmxlZnQgLSBib3JkZXJMZWZ0V2lkdGgsXHJcbiAgICB3aWR0aDogY2hpbGRyZW5SZWN0LndpZHRoLFxyXG4gICAgaGVpZ2h0OiBjaGlsZHJlblJlY3QuaGVpZ2h0XHJcbiAgfSk7XHJcbiAgb2Zmc2V0cy5tYXJnaW5Ub3AgPSAwO1xyXG4gIG9mZnNldHMubWFyZ2luTGVmdCA9IDA7XHJcblxyXG4gIC8vIFN1YnRyYWN0IG1hcmdpbnMgb2YgZG9jdW1lbnRFbGVtZW50IGluIGNhc2UgaXQncyBiZWluZyB1c2VkIGFzIHBhcmVudFxyXG4gIC8vIHdlIGRvIHRoaXMgb25seSBvbiBIVE1MIGJlY2F1c2UgaXQncyB0aGUgb25seSBlbGVtZW50IHRoYXQgYmVoYXZlc1xyXG4gIC8vIGRpZmZlcmVudGx5IHdoZW4gbWFyZ2lucyBhcmUgYXBwbGllZCB0byBpdC4gVGhlIG1hcmdpbnMgYXJlIGluY2x1ZGVkIGluXHJcbiAgLy8gdGhlIGJveCBvZiB0aGUgZG9jdW1lbnRFbGVtZW50LCBpbiB0aGUgb3RoZXIgY2FzZXMgbm90LlxyXG4gIGlmICghaXNJRTEwICYmIGlzSFRNTCkge1xyXG4gICAgdmFyIG1hcmdpblRvcCA9IHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpblRvcCwgMTApO1xyXG4gICAgdmFyIG1hcmdpbkxlZnQgPSBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5MZWZ0LCAxMCk7XHJcblxyXG4gICAgb2Zmc2V0cy50b3AgLT0gYm9yZGVyVG9wV2lkdGggLSBtYXJnaW5Ub3A7XHJcbiAgICBvZmZzZXRzLmJvdHRvbSAtPSBib3JkZXJUb3BXaWR0aCAtIG1hcmdpblRvcDtcclxuICAgIG9mZnNldHMubGVmdCAtPSBib3JkZXJMZWZ0V2lkdGggLSBtYXJnaW5MZWZ0O1xyXG4gICAgb2Zmc2V0cy5yaWdodCAtPSBib3JkZXJMZWZ0V2lkdGggLSBtYXJnaW5MZWZ0O1xyXG5cclxuICAgIC8vIEF0dGFjaCBtYXJnaW5Ub3AgYW5kIG1hcmdpbkxlZnQgYmVjYXVzZSBpbiBzb21lIGNpcmN1bXN0YW5jZXMgd2UgbWF5IG5lZWQgdGhlbVxyXG4gICAgb2Zmc2V0cy5tYXJnaW5Ub3AgPSBtYXJnaW5Ub3A7XHJcbiAgICBvZmZzZXRzLm1hcmdpbkxlZnQgPSBtYXJnaW5MZWZ0O1xyXG4gIH1cclxuXHJcbiAgaWYgKGlzSUUxMCAmJiAhZml4ZWRQb3NpdGlvbiA/IHBhcmVudC5jb250YWlucyhzY3JvbGxQYXJlbnQpIDogcGFyZW50ID09PSBzY3JvbGxQYXJlbnQgJiYgc2Nyb2xsUGFyZW50Lm5vZGVOYW1lICE9PSAnQk9EWScpIHtcclxuICAgIG9mZnNldHMgPSBpbmNsdWRlU2Nyb2xsKG9mZnNldHMsIHBhcmVudCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb2Zmc2V0cztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Vmlld3BvcnRPZmZzZXRSZWN0UmVsYXRpdmVUb0FydGJpdHJhcnlOb2RlKGVsZW1lbnQpIHtcclxuICB2YXIgZXhjbHVkZVNjcm9sbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XHJcblxyXG4gIHZhciBodG1sID0gZWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICB2YXIgcmVsYXRpdmVPZmZzZXQgPSBnZXRPZmZzZXRSZWN0UmVsYXRpdmVUb0FyYml0cmFyeU5vZGUoZWxlbWVudCwgaHRtbCk7XHJcbiAgdmFyIHdpZHRoID0gTWF0aC5tYXgoaHRtbC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XHJcbiAgdmFyIGhlaWdodCA9IE1hdGgubWF4KGh0bWwuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMCk7XHJcblxyXG4gIHZhciBzY3JvbGxUb3AgPSAhZXhjbHVkZVNjcm9sbCA/IGdldFNjcm9sbChodG1sKSA6IDA7XHJcbiAgdmFyIHNjcm9sbExlZnQgPSAhZXhjbHVkZVNjcm9sbCA/IGdldFNjcm9sbChodG1sLCAnbGVmdCcpIDogMDtcclxuXHJcbiAgdmFyIG9mZnNldCA9IHtcclxuICAgIHRvcDogc2Nyb2xsVG9wIC0gcmVsYXRpdmVPZmZzZXQudG9wICsgcmVsYXRpdmVPZmZzZXQubWFyZ2luVG9wLFxyXG4gICAgbGVmdDogc2Nyb2xsTGVmdCAtIHJlbGF0aXZlT2Zmc2V0LmxlZnQgKyByZWxhdGl2ZU9mZnNldC5tYXJnaW5MZWZ0LFxyXG4gICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgaGVpZ2h0OiBoZWlnaHRcclxuICB9O1xyXG5cclxuICByZXR1cm4gZ2V0Q2xpZW50UmVjdChvZmZzZXQpO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhlIGdpdmVuIGVsZW1lbnQgaXMgZml4ZWQgb3IgaXMgaW5zaWRlIGEgZml4ZWQgcGFyZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBjdXN0b21Db250YWluZXJcclxuICogQHJldHVybnMge0Jvb2xlYW59IGFuc3dlciB0byBcImlzRml4ZWQ/XCJcclxuICovXHJcbmZ1bmN0aW9uIGlzRml4ZWQoZWxlbWVudCkge1xyXG4gIHZhciBub2RlTmFtZSA9IGVsZW1lbnQubm9kZU5hbWU7XHJcbiAgaWYgKG5vZGVOYW1lID09PSAnQk9EWScgfHwgbm9kZU5hbWUgPT09ICdIVE1MJykge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICBpZiAoZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KGVsZW1lbnQsICdwb3NpdGlvbicpID09PSAnZml4ZWQnKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGlzRml4ZWQoZ2V0UGFyZW50Tm9kZShlbGVtZW50KSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGaW5kcyB0aGUgZmlyc3QgcGFyZW50IG9mIGFuIGVsZW1lbnQgdGhhdCBoYXMgYSB0cmFuc2Zvcm1lZCBwcm9wZXJ0eSBkZWZpbmVkXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybnMge0VsZW1lbnR9IGZpcnN0IHRyYW5zZm9ybWVkIHBhcmVudCBvciBkb2N1bWVudEVsZW1lbnRcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRGaXhlZFBvc2l0aW9uT2Zmc2V0UGFyZW50KGVsZW1lbnQpIHtcclxuICAvLyBUaGlzIGNoZWNrIGlzIG5lZWRlZCB0byBhdm9pZCBlcnJvcnMgaW4gY2FzZSBvbmUgb2YgdGhlIGVsZW1lbnRzIGlzbid0IGRlZmluZWQgZm9yIGFueSByZWFzb25cclxuICBpZiAoIWVsZW1lbnQgfHwgIWVsZW1lbnQucGFyZW50RWxlbWVudCB8fCBpc0lFJDEoKSkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICB9XHJcbiAgdmFyIGVsID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gIHdoaWxlIChlbCAmJiBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWwsICd0cmFuc2Zvcm0nKSA9PT0gJ25vbmUnKSB7XHJcbiAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgfVxyXG4gIHJldHVybiBlbCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlZCB0aGUgYm91bmRhcmllcyBsaW1pdHMgYW5kIHJldHVybiB0aGVtXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3BwZXJcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcmVmZXJlbmNlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwYWRkaW5nXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGJvdW5kYXJpZXNFbGVtZW50IC0gRWxlbWVudCB1c2VkIHRvIGRlZmluZSB0aGUgYm91bmRhcmllc1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGZpeGVkUG9zaXRpb24gLSBJcyBpbiBmaXhlZCBwb3NpdGlvbiBtb2RlXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IENvb3JkaW5hdGVzIG9mIHRoZSBib3VuZGFyaWVzXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRCb3VuZGFyaWVzKHBvcHBlciwgcmVmZXJlbmNlLCBwYWRkaW5nLCBib3VuZGFyaWVzRWxlbWVudCkge1xyXG4gIHZhciBmaXhlZFBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiBmYWxzZTtcclxuXHJcbiAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcclxuXHJcbiAgdmFyIGJvdW5kYXJpZXMgPSB7IHRvcDogMCwgbGVmdDogMCB9O1xyXG4gIHZhciBvZmZzZXRQYXJlbnQgPSBmaXhlZFBvc2l0aW9uID8gZ2V0Rml4ZWRQb3NpdGlvbk9mZnNldFBhcmVudChwb3BwZXIpIDogZmluZENvbW1vbk9mZnNldFBhcmVudChwb3BwZXIsIHJlZmVyZW5jZSk7XHJcblxyXG4gIC8vIEhhbmRsZSB2aWV3cG9ydCBjYXNlXHJcbiAgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAndmlld3BvcnQnKSB7XHJcbiAgICBib3VuZGFyaWVzID0gZ2V0Vmlld3BvcnRPZmZzZXRSZWN0UmVsYXRpdmVUb0FydGJpdHJhcnlOb2RlKG9mZnNldFBhcmVudCwgZml4ZWRQb3NpdGlvbik7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIEhhbmRsZSBvdGhlciBjYXNlcyBiYXNlZCBvbiBET00gZWxlbWVudCB1c2VkIGFzIGJvdW5kYXJpZXNcclxuICAgIHZhciBib3VuZGFyaWVzTm9kZSA9IHZvaWQgMDtcclxuICAgIGlmIChib3VuZGFyaWVzRWxlbWVudCA9PT0gJ3Njcm9sbFBhcmVudCcpIHtcclxuICAgICAgYm91bmRhcmllc05vZGUgPSBnZXRTY3JvbGxQYXJlbnQoZ2V0UGFyZW50Tm9kZShyZWZlcmVuY2UpKTtcclxuICAgICAgaWYgKGJvdW5kYXJpZXNOb2RlLm5vZGVOYW1lID09PSAnQk9EWScpIHtcclxuICAgICAgICBib3VuZGFyaWVzTm9kZSA9IHBvcHBlci5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChib3VuZGFyaWVzRWxlbWVudCA9PT0gJ3dpbmRvdycpIHtcclxuICAgICAgYm91bmRhcmllc05vZGUgPSBwb3BwZXIub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBib3VuZGFyaWVzTm9kZSA9IGJvdW5kYXJpZXNFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBvZmZzZXRzID0gZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlKGJvdW5kYXJpZXNOb2RlLCBvZmZzZXRQYXJlbnQsIGZpeGVkUG9zaXRpb24pO1xyXG5cclxuICAgIC8vIEluIGNhc2Ugb2YgSFRNTCwgd2UgbmVlZCBhIGRpZmZlcmVudCBjb21wdXRhdGlvblxyXG4gICAgaWYgKGJvdW5kYXJpZXNOb2RlLm5vZGVOYW1lID09PSAnSFRNTCcgJiYgIWlzRml4ZWQob2Zmc2V0UGFyZW50KSkge1xyXG4gICAgICB2YXIgX2dldFdpbmRvd1NpemVzID0gZ2V0V2luZG93U2l6ZXMoKSxcclxuICAgICAgICAgIGhlaWdodCA9IF9nZXRXaW5kb3dTaXplcy5oZWlnaHQsXHJcbiAgICAgICAgICB3aWR0aCA9IF9nZXRXaW5kb3dTaXplcy53aWR0aDtcclxuXHJcbiAgICAgIGJvdW5kYXJpZXMudG9wICs9IG9mZnNldHMudG9wIC0gb2Zmc2V0cy5tYXJnaW5Ub3A7XHJcbiAgICAgIGJvdW5kYXJpZXMuYm90dG9tID0gaGVpZ2h0ICsgb2Zmc2V0cy50b3A7XHJcbiAgICAgIGJvdW5kYXJpZXMubGVmdCArPSBvZmZzZXRzLmxlZnQgLSBvZmZzZXRzLm1hcmdpbkxlZnQ7XHJcbiAgICAgIGJvdW5kYXJpZXMucmlnaHQgPSB3aWR0aCArIG9mZnNldHMubGVmdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGZvciBhbGwgdGhlIG90aGVyIERPTSBlbGVtZW50cywgdGhpcyBvbmUgaXMgZ29vZFxyXG4gICAgICBib3VuZGFyaWVzID0gb2Zmc2V0cztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEFkZCBwYWRkaW5nc1xyXG4gIGJvdW5kYXJpZXMubGVmdCArPSBwYWRkaW5nO1xyXG4gIGJvdW5kYXJpZXMudG9wICs9IHBhZGRpbmc7XHJcbiAgYm91bmRhcmllcy5yaWdodCAtPSBwYWRkaW5nO1xyXG4gIGJvdW5kYXJpZXMuYm90dG9tIC09IHBhZGRpbmc7XHJcblxyXG4gIHJldHVybiBib3VuZGFyaWVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBcmVhKF9yZWYpIHtcclxuICB2YXIgd2lkdGggPSBfcmVmLndpZHRoLFxyXG4gICAgICBoZWlnaHQgPSBfcmVmLmhlaWdodDtcclxuXHJcbiAgcmV0dXJuIHdpZHRoICogaGVpZ2h0O1xyXG59XHJcblxyXG4vKipcclxuICogVXRpbGl0eSB1c2VkIHRvIHRyYW5zZm9ybSB0aGUgYGF1dG9gIHBsYWNlbWVudCB0byB0aGUgcGxhY2VtZW50IHdpdGggbW9yZVxyXG4gKiBhdmFpbGFibGUgc3BhY2UuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIGNvbXB1dGVBdXRvUGxhY2VtZW50KHBsYWNlbWVudCwgcmVmUmVjdCwgcG9wcGVyLCByZWZlcmVuY2UsIGJvdW5kYXJpZXNFbGVtZW50KSB7XHJcbiAgdmFyIHBhZGRpbmcgPSBhcmd1bWVudHMubGVuZ3RoID4gNSAmJiBhcmd1bWVudHNbNV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s1XSA6IDA7XHJcblxyXG4gIGlmIChwbGFjZW1lbnQuaW5kZXhPZignYXV0bycpID09PSAtMSkge1xyXG4gICAgcmV0dXJuIHBsYWNlbWVudDtcclxuICB9XHJcblxyXG4gIHZhciBib3VuZGFyaWVzID0gZ2V0Qm91bmRhcmllcyhwb3BwZXIsIHJlZmVyZW5jZSwgcGFkZGluZywgYm91bmRhcmllc0VsZW1lbnQpO1xyXG5cclxuICB2YXIgcmVjdHMgPSB7XHJcbiAgICB0b3A6IHtcclxuICAgICAgd2lkdGg6IGJvdW5kYXJpZXMud2lkdGgsXHJcbiAgICAgIGhlaWdodDogcmVmUmVjdC50b3AgLSBib3VuZGFyaWVzLnRvcFxyXG4gICAgfSxcclxuICAgIHJpZ2h0OiB7XHJcbiAgICAgIHdpZHRoOiBib3VuZGFyaWVzLnJpZ2h0IC0gcmVmUmVjdC5yaWdodCxcclxuICAgICAgaGVpZ2h0OiBib3VuZGFyaWVzLmhlaWdodFxyXG4gICAgfSxcclxuICAgIGJvdHRvbToge1xyXG4gICAgICB3aWR0aDogYm91bmRhcmllcy53aWR0aCxcclxuICAgICAgaGVpZ2h0OiBib3VuZGFyaWVzLmJvdHRvbSAtIHJlZlJlY3QuYm90dG9tXHJcbiAgICB9LFxyXG4gICAgbGVmdDoge1xyXG4gICAgICB3aWR0aDogcmVmUmVjdC5sZWZ0IC0gYm91bmRhcmllcy5sZWZ0LFxyXG4gICAgICBoZWlnaHQ6IGJvdW5kYXJpZXMuaGVpZ2h0XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIHNvcnRlZEFyZWFzID0gT2JqZWN0LmtleXMocmVjdHMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICByZXR1cm4gX2V4dGVuZHMkMSh7XHJcbiAgICAgIGtleToga2V5XHJcbiAgICB9LCByZWN0c1trZXldLCB7XHJcbiAgICAgIGFyZWE6IGdldEFyZWEocmVjdHNba2V5XSlcclxuICAgIH0pO1xyXG4gIH0pLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgIHJldHVybiBiLmFyZWEgLSBhLmFyZWE7XHJcbiAgfSk7XHJcblxyXG4gIHZhciBmaWx0ZXJlZEFyZWFzID0gc29ydGVkQXJlYXMuZmlsdGVyKGZ1bmN0aW9uIChfcmVmMikge1xyXG4gICAgdmFyIHdpZHRoID0gX3JlZjIud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0ID0gX3JlZjIuaGVpZ2h0O1xyXG4gICAgcmV0dXJuIHdpZHRoID49IHBvcHBlci5jbGllbnRXaWR0aCAmJiBoZWlnaHQgPj0gcG9wcGVyLmNsaWVudEhlaWdodDtcclxuICB9KTtcclxuXHJcbiAgdmFyIGNvbXB1dGVkUGxhY2VtZW50ID0gZmlsdGVyZWRBcmVhcy5sZW5ndGggPiAwID8gZmlsdGVyZWRBcmVhc1swXS5rZXkgOiBzb3J0ZWRBcmVhc1swXS5rZXk7XHJcblxyXG4gIHZhciB2YXJpYXRpb24gPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVsxXTtcclxuXHJcbiAgcmV0dXJuIGNvbXB1dGVkUGxhY2VtZW50ICsgKHZhcmlhdGlvbiA/ICctJyArIHZhcmlhdGlvbiA6ICcnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBvZmZzZXRzIHRvIHRoZSByZWZlcmVuY2UgZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcG9wcGVyIC0gdGhlIHBvcHBlciBlbGVtZW50XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcmVmZXJlbmNlIC0gdGhlIHJlZmVyZW5jZSBlbGVtZW50ICh0aGUgcG9wcGVyIHdpbGwgYmUgcmVsYXRpdmUgdG8gdGhpcylcclxuICogQHBhcmFtIHtFbGVtZW50fSBmaXhlZFBvc2l0aW9uIC0gaXMgaW4gZml4ZWQgcG9zaXRpb24gbW9kZVxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgb2Zmc2V0cyB3aGljaCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlclxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UmVmZXJlbmNlT2Zmc2V0cyhzdGF0ZSwgcG9wcGVyLCByZWZlcmVuY2UpIHtcclxuICB2YXIgZml4ZWRQb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogbnVsbDtcclxuXHJcbiAgdmFyIGNvbW1vbk9mZnNldFBhcmVudCA9IGZpeGVkUG9zaXRpb24gPyBnZXRGaXhlZFBvc2l0aW9uT2Zmc2V0UGFyZW50KHBvcHBlcikgOiBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50KHBvcHBlciwgcmVmZXJlbmNlKTtcclxuICByZXR1cm4gZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlKHJlZmVyZW5jZSwgY29tbW9uT2Zmc2V0UGFyZW50LCBmaXhlZFBvc2l0aW9uKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgb3V0ZXIgc2l6ZXMgb2YgdGhlIGdpdmVuIGVsZW1lbnQgKG9mZnNldCBzaXplICsgbWFyZ2lucylcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBvYmplY3QgY29udGFpbmluZyB3aWR0aCBhbmQgaGVpZ2h0IHByb3BlcnRpZXNcclxuICovXHJcbmZ1bmN0aW9uIGdldE91dGVyU2l6ZXMoZWxlbWVudCkge1xyXG4gIHZhciBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xyXG4gIHZhciB4ID0gcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luVG9wKSArIHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpbkJvdHRvbSk7XHJcbiAgdmFyIHkgPSBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5MZWZ0KSArIHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpblJpZ2h0KTtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgd2lkdGg6IGVsZW1lbnQub2Zmc2V0V2lkdGggKyB5LFxyXG4gICAgaGVpZ2h0OiBlbGVtZW50Lm9mZnNldEhlaWdodCArIHhcclxuICB9O1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIG9wcG9zaXRlIHBsYWNlbWVudCBvZiB0aGUgZ2l2ZW4gb25lXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gcGxhY2VtZW50XHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IGZsaXBwZWQgcGxhY2VtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpIHtcclxuICB2YXIgaGFzaCA9IHsgbGVmdDogJ3JpZ2h0JywgcmlnaHQ6ICdsZWZ0JywgYm90dG9tOiAndG9wJywgdG9wOiAnYm90dG9tJyB9O1xyXG4gIHJldHVybiBwbGFjZW1lbnQucmVwbGFjZSgvbGVmdHxyaWdodHxib3R0b218dG9wL2csIGZ1bmN0aW9uIChtYXRjaGVkKSB7XHJcbiAgICByZXR1cm4gaGFzaFttYXRjaGVkXTtcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBvZmZzZXRzIHRvIHRoZSBwb3BwZXJcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBwb3NpdGlvbiAtIENTUyBwb3NpdGlvbiB0aGUgUG9wcGVyIHdpbGwgZ2V0IGFwcGxpZWRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcG9wcGVyIC0gdGhlIHBvcHBlciBlbGVtZW50XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWZlcmVuY2VPZmZzZXRzIC0gdGhlIHJlZmVyZW5jZSBvZmZzZXRzICh0aGUgcG9wcGVyIHdpbGwgYmUgcmVsYXRpdmUgdG8gdGhpcylcclxuICogQHBhcmFtIHtTdHJpbmd9IHBsYWNlbWVudCAtIG9uZSBvZiB0aGUgdmFsaWQgcGxhY2VtZW50IG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gcG9wcGVyT2Zmc2V0cyAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBvZmZzZXRzIHdoaWNoIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRQb3BwZXJPZmZzZXRzKHBvcHBlciwgcmVmZXJlbmNlT2Zmc2V0cywgcGxhY2VtZW50KSB7XHJcbiAgcGxhY2VtZW50ID0gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcblxyXG4gIC8vIEdldCBwb3BwZXIgbm9kZSBzaXplc1xyXG4gIHZhciBwb3BwZXJSZWN0ID0gZ2V0T3V0ZXJTaXplcyhwb3BwZXIpO1xyXG5cclxuICAvLyBBZGQgcG9zaXRpb24sIHdpZHRoIGFuZCBoZWlnaHQgdG8gb3VyIG9mZnNldHMgb2JqZWN0XHJcbiAgdmFyIHBvcHBlck9mZnNldHMgPSB7XHJcbiAgICB3aWR0aDogcG9wcGVyUmVjdC53aWR0aCxcclxuICAgIGhlaWdodDogcG9wcGVyUmVjdC5oZWlnaHRcclxuICB9O1xyXG5cclxuICAvLyBkZXBlbmRpbmcgYnkgdGhlIHBvcHBlciBwbGFjZW1lbnQgd2UgaGF2ZSB0byBjb21wdXRlIGl0cyBvZmZzZXRzIHNsaWdodGx5IGRpZmZlcmVudGx5XHJcbiAgdmFyIGlzSG9yaXogPSBbJ3JpZ2h0JywgJ2xlZnQnXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xO1xyXG4gIHZhciBtYWluU2lkZSA9IGlzSG9yaXogPyAndG9wJyA6ICdsZWZ0JztcclxuICB2YXIgc2Vjb25kYXJ5U2lkZSA9IGlzSG9yaXogPyAnbGVmdCcgOiAndG9wJztcclxuICB2YXIgbWVhc3VyZW1lbnQgPSBpc0hvcml6ID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xyXG4gIHZhciBzZWNvbmRhcnlNZWFzdXJlbWVudCA9ICFpc0hvcml6ID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xyXG5cclxuICBwb3BwZXJPZmZzZXRzW21haW5TaWRlXSA9IHJlZmVyZW5jZU9mZnNldHNbbWFpblNpZGVdICsgcmVmZXJlbmNlT2Zmc2V0c1ttZWFzdXJlbWVudF0gLyAyIC0gcG9wcGVyUmVjdFttZWFzdXJlbWVudF0gLyAyO1xyXG4gIGlmIChwbGFjZW1lbnQgPT09IHNlY29uZGFyeVNpZGUpIHtcclxuICAgIHBvcHBlck9mZnNldHNbc2Vjb25kYXJ5U2lkZV0gPSByZWZlcmVuY2VPZmZzZXRzW3NlY29uZGFyeVNpZGVdIC0gcG9wcGVyUmVjdFtzZWNvbmRhcnlNZWFzdXJlbWVudF07XHJcbiAgfSBlbHNlIHtcclxuICAgIHBvcHBlck9mZnNldHNbc2Vjb25kYXJ5U2lkZV0gPSByZWZlcmVuY2VPZmZzZXRzW2dldE9wcG9zaXRlUGxhY2VtZW50KHNlY29uZGFyeVNpZGUpXTtcclxuICB9XHJcblxyXG4gIHJldHVybiBwb3BwZXJPZmZzZXRzO1xyXG59XHJcblxyXG4vKipcclxuICogTWltaWNzIHRoZSBgZmluZGAgbWV0aG9kIG9mIEFycmF5XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0FycmF5fSBhcnJcclxuICogQGFyZ3VtZW50IHByb3BcclxuICogQGFyZ3VtZW50IHZhbHVlXHJcbiAqIEByZXR1cm5zIGluZGV4IG9yIC0xXHJcbiAqL1xyXG5mdW5jdGlvbiBmaW5kKGFyciwgY2hlY2spIHtcclxuICAvLyB1c2UgbmF0aXZlIGZpbmQgaWYgc3VwcG9ydGVkXHJcbiAgaWYgKEFycmF5LnByb3RvdHlwZS5maW5kKSB7XHJcbiAgICByZXR1cm4gYXJyLmZpbmQoY2hlY2spO1xyXG4gIH1cclxuXHJcbiAgLy8gdXNlIGBmaWx0ZXJgIHRvIG9idGFpbiB0aGUgc2FtZSBiZWhhdmlvciBvZiBgZmluZGBcclxuICByZXR1cm4gYXJyLmZpbHRlcihjaGVjaylbMF07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGluZGV4IG9mIHRoZSBtYXRjaGluZyBvYmplY3RcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7QXJyYXl9IGFyclxyXG4gKiBAYXJndW1lbnQgcHJvcFxyXG4gKiBAYXJndW1lbnQgdmFsdWVcclxuICogQHJldHVybnMgaW5kZXggb3IgLTFcclxuICovXHJcbmZ1bmN0aW9uIGZpbmRJbmRleChhcnIsIHByb3AsIHZhbHVlKSB7XHJcbiAgLy8gdXNlIG5hdGl2ZSBmaW5kSW5kZXggaWYgc3VwcG9ydGVkXHJcbiAgaWYgKEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgpIHtcclxuICAgIHJldHVybiBhcnIuZmluZEluZGV4KGZ1bmN0aW9uIChjdXIpIHtcclxuICAgICAgcmV0dXJuIGN1cltwcm9wXSA9PT0gdmFsdWU7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIHVzZSBgZmluZGAgKyBgaW5kZXhPZmAgaWYgYGZpbmRJbmRleGAgaXNuJ3Qgc3VwcG9ydGVkXHJcbiAgdmFyIG1hdGNoID0gZmluZChhcnIsIGZ1bmN0aW9uIChvYmopIHtcclxuICAgIHJldHVybiBvYmpbcHJvcF0gPT09IHZhbHVlO1xyXG4gIH0pO1xyXG4gIHJldHVybiBhcnIuaW5kZXhPZihtYXRjaCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBMb29wIHRyb3VnaCB0aGUgbGlzdCBvZiBtb2RpZmllcnMgYW5kIHJ1biB0aGVtIGluIG9yZGVyLFxyXG4gKiBlYWNoIG9mIHRoZW0gd2lsbCB0aGVuIGVkaXQgdGhlIGRhdGEgb2JqZWN0LlxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtkYXRhT2JqZWN0fSBkYXRhXHJcbiAqIEBwYXJhbSB7QXJyYXl9IG1vZGlmaWVyc1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gZW5kcyAtIE9wdGlvbmFsIG1vZGlmaWVyIG5hbWUgdXNlZCBhcyBzdG9wcGVyXHJcbiAqIEByZXR1cm5zIHtkYXRhT2JqZWN0fVxyXG4gKi9cclxuZnVuY3Rpb24gcnVuTW9kaWZpZXJzKG1vZGlmaWVycywgZGF0YSwgZW5kcykge1xyXG4gIHZhciBtb2RpZmllcnNUb1J1biA9IGVuZHMgPT09IHVuZGVmaW5lZCA/IG1vZGlmaWVycyA6IG1vZGlmaWVycy5zbGljZSgwLCBmaW5kSW5kZXgobW9kaWZpZXJzLCAnbmFtZScsIGVuZHMpKTtcclxuXHJcbiAgbW9kaWZpZXJzVG9SdW4uZm9yRWFjaChmdW5jdGlvbiAobW9kaWZpZXIpIHtcclxuICAgIGlmIChtb2RpZmllclsnZnVuY3Rpb24nXSkge1xyXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGRvdC1ub3RhdGlvblxyXG4gICAgICBjb25zb2xlLndhcm4oJ2Btb2RpZmllci5mdW5jdGlvbmAgaXMgZGVwcmVjYXRlZCwgdXNlIGBtb2RpZmllci5mbmAhJyk7XHJcbiAgICB9XHJcbiAgICB2YXIgZm4gPSBtb2RpZmllclsnZnVuY3Rpb24nXSB8fCBtb2RpZmllci5mbjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBkb3Qtbm90YXRpb25cclxuICAgIGlmIChtb2RpZmllci5lbmFibGVkICYmIGlzRnVuY3Rpb24oZm4pKSB7XHJcbiAgICAgIC8vIEFkZCBwcm9wZXJ0aWVzIHRvIG9mZnNldHMgdG8gbWFrZSB0aGVtIGEgY29tcGxldGUgY2xpZW50UmVjdCBvYmplY3RcclxuICAgICAgLy8gd2UgZG8gdGhpcyBiZWZvcmUgZWFjaCBtb2RpZmllciB0byBtYWtlIHN1cmUgdGhlIHByZXZpb3VzIG9uZSBkb2Vzbid0XHJcbiAgICAgIC8vIG1lc3Mgd2l0aCB0aGVzZSB2YWx1ZXNcclxuICAgICAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IGdldENsaWVudFJlY3QoZGF0YS5vZmZzZXRzLnBvcHBlcik7XHJcbiAgICAgIGRhdGEub2Zmc2V0cy5yZWZlcmVuY2UgPSBnZXRDbGllbnRSZWN0KGRhdGEub2Zmc2V0cy5yZWZlcmVuY2UpO1xyXG5cclxuICAgICAgZGF0YSA9IGZuKGRhdGEsIG1vZGlmaWVyKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9wcGVyLCBjb21wdXRpbmcgdGhlIG5ldyBvZmZzZXRzIGFuZCBhcHBseWluZ1xyXG4gKiB0aGUgbmV3IHN0eWxlLjxiciAvPlxyXG4gKiBQcmVmZXIgYHNjaGVkdWxlVXBkYXRlYCBvdmVyIGB1cGRhdGVgIGJlY2F1c2Ugb2YgcGVyZm9ybWFuY2UgcmVhc29ucy5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGUoKSB7XHJcbiAgLy8gaWYgcG9wcGVyIGlzIGRlc3Ryb3llZCwgZG9uJ3QgcGVyZm9ybSBhbnkgZnVydGhlciB1cGRhdGVcclxuICBpZiAodGhpcy5zdGF0ZS5pc0Rlc3Ryb3llZCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdmFyIGRhdGEgPSB7XHJcbiAgICBpbnN0YW5jZTogdGhpcyxcclxuICAgIHN0eWxlczoge30sXHJcbiAgICBhcnJvd1N0eWxlczoge30sXHJcbiAgICBhdHRyaWJ1dGVzOiB7fSxcclxuICAgIGZsaXBwZWQ6IGZhbHNlLFxyXG4gICAgb2Zmc2V0czoge31cclxuICB9O1xyXG5cclxuICAvLyBjb21wdXRlIHJlZmVyZW5jZSBlbGVtZW50IG9mZnNldHNcclxuICBkYXRhLm9mZnNldHMucmVmZXJlbmNlID0gZ2V0UmVmZXJlbmNlT2Zmc2V0cyh0aGlzLnN0YXRlLCB0aGlzLnBvcHBlciwgdGhpcy5yZWZlcmVuY2UsIHRoaXMub3B0aW9ucy5wb3NpdGlvbkZpeGVkKTtcclxuXHJcbiAgLy8gY29tcHV0ZSBhdXRvIHBsYWNlbWVudCwgc3RvcmUgcGxhY2VtZW50IGluc2lkZSB0aGUgZGF0YSBvYmplY3QsXHJcbiAgLy8gbW9kaWZpZXJzIHdpbGwgYmUgYWJsZSB0byBlZGl0IGBwbGFjZW1lbnRgIGlmIG5lZWRlZFxyXG4gIC8vIGFuZCByZWZlciB0byBvcmlnaW5hbFBsYWNlbWVudCB0byBrbm93IHRoZSBvcmlnaW5hbCB2YWx1ZVxyXG4gIGRhdGEucGxhY2VtZW50ID0gY29tcHV0ZUF1dG9QbGFjZW1lbnQodGhpcy5vcHRpb25zLnBsYWNlbWVudCwgZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSwgdGhpcy5wb3BwZXIsIHRoaXMucmVmZXJlbmNlLCB0aGlzLm9wdGlvbnMubW9kaWZpZXJzLmZsaXAuYm91bmRhcmllc0VsZW1lbnQsIHRoaXMub3B0aW9ucy5tb2RpZmllcnMuZmxpcC5wYWRkaW5nKTtcclxuXHJcbiAgLy8gc3RvcmUgdGhlIGNvbXB1dGVkIHBsYWNlbWVudCBpbnNpZGUgYG9yaWdpbmFsUGxhY2VtZW50YFxyXG4gIGRhdGEub3JpZ2luYWxQbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudDtcclxuXHJcbiAgZGF0YS5wb3NpdGlvbkZpeGVkID0gdGhpcy5vcHRpb25zLnBvc2l0aW9uRml4ZWQ7XHJcblxyXG4gIC8vIGNvbXB1dGUgdGhlIHBvcHBlciBvZmZzZXRzXHJcbiAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IGdldFBvcHBlck9mZnNldHModGhpcy5wb3BwZXIsIGRhdGEub2Zmc2V0cy5yZWZlcmVuY2UsIGRhdGEucGxhY2VtZW50KTtcclxuXHJcbiAgZGF0YS5vZmZzZXRzLnBvcHBlci5wb3NpdGlvbiA9IHRoaXMub3B0aW9ucy5wb3NpdGlvbkZpeGVkID8gJ2ZpeGVkJyA6ICdhYnNvbHV0ZSc7XHJcblxyXG4gIC8vIHJ1biB0aGUgbW9kaWZpZXJzXHJcbiAgZGF0YSA9IHJ1bk1vZGlmaWVycyh0aGlzLm1vZGlmaWVycywgZGF0YSk7XHJcblxyXG4gIC8vIHRoZSBmaXJzdCBgdXBkYXRlYCB3aWxsIGNhbGwgYG9uQ3JlYXRlYCBjYWxsYmFja1xyXG4gIC8vIHRoZSBvdGhlciBvbmVzIHdpbGwgY2FsbCBgb25VcGRhdGVgIGNhbGxiYWNrXHJcbiAgaWYgKCF0aGlzLnN0YXRlLmlzQ3JlYXRlZCkge1xyXG4gICAgdGhpcy5zdGF0ZS5pc0NyZWF0ZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5vcHRpb25zLm9uQ3JlYXRlKGRhdGEpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLm9wdGlvbnMub25VcGRhdGUoZGF0YSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogSGVscGVyIHVzZWQgdG8ga25vdyBpZiB0aGUgZ2l2ZW4gbW9kaWZpZXIgaXMgZW5hYmxlZC5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEByZXR1cm5zIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNNb2RpZmllckVuYWJsZWQobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpIHtcclxuICByZXR1cm4gbW9kaWZpZXJzLnNvbWUoZnVuY3Rpb24gKF9yZWYpIHtcclxuICAgIHZhciBuYW1lID0gX3JlZi5uYW1lLFxyXG4gICAgICAgIGVuYWJsZWQgPSBfcmVmLmVuYWJsZWQ7XHJcbiAgICByZXR1cm4gZW5hYmxlZCAmJiBuYW1lID09PSBtb2RpZmllck5hbWU7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHByZWZpeGVkIHN1cHBvcnRlZCBwcm9wZXJ0eSBuYW1lXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gcHJvcGVydHkgKGNhbWVsQ2FzZSlcclxuICogQHJldHVybnMge1N0cmluZ30gcHJlZml4ZWQgcHJvcGVydHkgKGNhbWVsQ2FzZSBvciBQYXNjYWxDYXNlLCBkZXBlbmRpbmcgb24gdGhlIHZlbmRvciBwcmVmaXgpXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRTdXBwb3J0ZWRQcm9wZXJ0eU5hbWUocHJvcGVydHkpIHtcclxuICB2YXIgcHJlZml4ZXMgPSBbZmFsc2UsICdtcycsICdXZWJraXQnLCAnTW96JywgJ08nXTtcclxuICB2YXIgdXBwZXJQcm9wID0gcHJvcGVydHkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wZXJ0eS5zbGljZSgxKTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHByZWZpeCA9IHByZWZpeGVzW2ldO1xyXG4gICAgdmFyIHRvQ2hlY2sgPSBwcmVmaXggPyAnJyArIHByZWZpeCArIHVwcGVyUHJvcCA6IHByb3BlcnR5O1xyXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudC5ib2R5LnN0eWxlW3RvQ2hlY2tdICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICByZXR1cm4gdG9DaGVjaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXN0cm95IHRoZSBwb3BwZXJcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gIHRoaXMuc3RhdGUuaXNEZXN0cm95ZWQgPSB0cnVlO1xyXG5cclxuICAvLyB0b3VjaCBET00gb25seSBpZiBgYXBwbHlTdHlsZWAgbW9kaWZpZXIgaXMgZW5hYmxlZFxyXG4gIGlmIChpc01vZGlmaWVyRW5hYmxlZCh0aGlzLm1vZGlmaWVycywgJ2FwcGx5U3R5bGUnKSkge1xyXG4gICAgdGhpcy5wb3BwZXIucmVtb3ZlQXR0cmlidXRlKCd4LXBsYWNlbWVudCcpO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGUucG9zaXRpb24gPSAnJztcclxuICAgIHRoaXMucG9wcGVyLnN0eWxlLnRvcCA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGUubGVmdCA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGUucmlnaHQgPSAnJztcclxuICAgIHRoaXMucG9wcGVyLnN0eWxlLmJvdHRvbSA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGUud2lsbENoYW5nZSA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGVbZ2V0U3VwcG9ydGVkUHJvcGVydHlOYW1lKCd0cmFuc2Zvcm0nKV0gPSAnJztcclxuICB9XHJcblxyXG4gIHRoaXMuZGlzYWJsZUV2ZW50TGlzdGVuZXJzKCk7XHJcblxyXG4gIC8vIHJlbW92ZSB0aGUgcG9wcGVyIGlmIHVzZXIgZXhwbGljaXR5IGFza2VkIGZvciB0aGUgZGVsZXRpb24gb24gZGVzdHJveVxyXG4gIC8vIGRvIG5vdCB1c2UgYHJlbW92ZWAgYmVjYXVzZSBJRTExIGRvZXNuJ3Qgc3VwcG9ydCBpdFxyXG4gIGlmICh0aGlzLm9wdGlvbnMucmVtb3ZlT25EZXN0cm95KSB7XHJcbiAgICB0aGlzLnBvcHBlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMucG9wcGVyKTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHdpbmRvdyBhc3NvY2lhdGVkIHdpdGggdGhlIGVsZW1lbnRcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtXaW5kb3d9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRXaW5kb3coZWxlbWVudCkge1xyXG4gIHZhciBvd25lckRvY3VtZW50ID0gZWxlbWVudC5vd25lckRvY3VtZW50O1xyXG4gIHJldHVybiBvd25lckRvY3VtZW50ID8gb3duZXJEb2N1bWVudC5kZWZhdWx0VmlldyA6IHdpbmRvdztcclxufVxyXG5cclxuZnVuY3Rpb24gYXR0YWNoVG9TY3JvbGxQYXJlbnRzKHNjcm9sbFBhcmVudCwgZXZlbnQsIGNhbGxiYWNrLCBzY3JvbGxQYXJlbnRzKSB7XHJcbiAgdmFyIGlzQm9keSA9IHNjcm9sbFBhcmVudC5ub2RlTmFtZSA9PT0gJ0JPRFknO1xyXG4gIHZhciB0YXJnZXQgPSBpc0JvZHkgPyBzY3JvbGxQYXJlbnQub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldyA6IHNjcm9sbFBhcmVudDtcclxuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2ssIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcclxuXHJcbiAgaWYgKCFpc0JvZHkpIHtcclxuICAgIGF0dGFjaFRvU2Nyb2xsUGFyZW50cyhnZXRTY3JvbGxQYXJlbnQodGFyZ2V0LnBhcmVudE5vZGUpLCBldmVudCwgY2FsbGJhY2ssIHNjcm9sbFBhcmVudHMpO1xyXG4gIH1cclxuICBzY3JvbGxQYXJlbnRzLnB1c2godGFyZ2V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldHVwIG5lZWRlZCBldmVudCBsaXN0ZW5lcnMgdXNlZCB0byB1cGRhdGUgdGhlIHBvcHBlciBwb3NpdGlvblxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIHNldHVwRXZlbnRMaXN0ZW5lcnMocmVmZXJlbmNlLCBvcHRpb25zLCBzdGF0ZSwgdXBkYXRlQm91bmQpIHtcclxuICAvLyBSZXNpemUgZXZlbnQgbGlzdGVuZXIgb24gd2luZG93XHJcbiAgc3RhdGUudXBkYXRlQm91bmQgPSB1cGRhdGVCb3VuZDtcclxuICBnZXRXaW5kb3cocmVmZXJlbmNlKS5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBzdGF0ZS51cGRhdGVCb3VuZCwgeyBwYXNzaXZlOiB0cnVlIH0pO1xyXG5cclxuICAvLyBTY3JvbGwgZXZlbnQgbGlzdGVuZXIgb24gc2Nyb2xsIHBhcmVudHNcclxuICB2YXIgc2Nyb2xsRWxlbWVudCA9IGdldFNjcm9sbFBhcmVudChyZWZlcmVuY2UpO1xyXG4gIGF0dGFjaFRvU2Nyb2xsUGFyZW50cyhzY3JvbGxFbGVtZW50LCAnc2Nyb2xsJywgc3RhdGUudXBkYXRlQm91bmQsIHN0YXRlLnNjcm9sbFBhcmVudHMpO1xyXG4gIHN0YXRlLnNjcm9sbEVsZW1lbnQgPSBzY3JvbGxFbGVtZW50O1xyXG4gIHN0YXRlLmV2ZW50c0VuYWJsZWQgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gc3RhdGU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJdCB3aWxsIGFkZCByZXNpemUvc2Nyb2xsIGV2ZW50cyBhbmQgc3RhcnQgcmVjYWxjdWxhdGluZ1xyXG4gKiBwb3NpdGlvbiBvZiB0aGUgcG9wcGVyIGVsZW1lbnQgd2hlbiB0aGV5IGFyZSB0cmlnZ2VyZWQuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlclxyXG4gKi9cclxuZnVuY3Rpb24gZW5hYmxlRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgaWYgKCF0aGlzLnN0YXRlLmV2ZW50c0VuYWJsZWQpIHtcclxuICAgIHRoaXMuc3RhdGUgPSBzZXR1cEV2ZW50TGlzdGVuZXJzKHRoaXMucmVmZXJlbmNlLCB0aGlzLm9wdGlvbnMsIHRoaXMuc3RhdGUsIHRoaXMuc2NoZWR1bGVVcGRhdGUpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMgdXNlZCB0byB1cGRhdGUgdGhlIHBvcHBlciBwb3NpdGlvblxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKHJlZmVyZW5jZSwgc3RhdGUpIHtcclxuICAvLyBSZW1vdmUgcmVzaXplIGV2ZW50IGxpc3RlbmVyIG9uIHdpbmRvd1xyXG4gIGdldFdpbmRvdyhyZWZlcmVuY2UpLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHN0YXRlLnVwZGF0ZUJvdW5kKTtcclxuXHJcbiAgLy8gUmVtb3ZlIHNjcm9sbCBldmVudCBsaXN0ZW5lciBvbiBzY3JvbGwgcGFyZW50c1xyXG4gIHN0YXRlLnNjcm9sbFBhcmVudHMuZm9yRWFjaChmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc3RhdGUudXBkYXRlQm91bmQpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBSZXNldCBzdGF0ZVxyXG4gIHN0YXRlLnVwZGF0ZUJvdW5kID0gbnVsbDtcclxuICBzdGF0ZS5zY3JvbGxQYXJlbnRzID0gW107XHJcbiAgc3RhdGUuc2Nyb2xsRWxlbWVudCA9IG51bGw7XHJcbiAgc3RhdGUuZXZlbnRzRW5hYmxlZCA9IGZhbHNlO1xyXG4gIHJldHVybiBzdGF0ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEl0IHdpbGwgcmVtb3ZlIHJlc2l6ZS9zY3JvbGwgZXZlbnRzIGFuZCB3b24ndCByZWNhbGN1bGF0ZSBwb3BwZXIgcG9zaXRpb25cclxuICogd2hlbiB0aGV5IGFyZSB0cmlnZ2VyZWQuIEl0IGFsc28gd29uJ3QgdHJpZ2dlciBvblVwZGF0ZSBjYWxsYmFjayBhbnltb3JlLFxyXG4gKiB1bmxlc3MgeW91IGNhbGwgYHVwZGF0ZWAgbWV0aG9kIG1hbnVhbGx5LlxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICovXHJcbmZ1bmN0aW9uIGRpc2FibGVFdmVudExpc3RlbmVycygpIHtcclxuICBpZiAodGhpcy5zdGF0ZS5ldmVudHNFbmFibGVkKSB7XHJcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnNjaGVkdWxlVXBkYXRlKTtcclxuICAgIHRoaXMuc3RhdGUgPSByZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLnJlZmVyZW5jZSwgdGhpcy5zdGF0ZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogVGVsbHMgaWYgYSBnaXZlbiBpbnB1dCBpcyBhIG51bWJlclxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHsqfSBpbnB1dCB0byBjaGVja1xyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNOdW1lcmljKG4pIHtcclxuICByZXR1cm4gbiAhPT0gJycgJiYgIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IHRoZSBzdHlsZSB0byB0aGUgZ2l2ZW4gcG9wcGVyXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnQgLSBFbGVtZW50IHRvIGFwcGx5IHRoZSBzdHlsZSB0b1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gc3R5bGVzXHJcbiAqIE9iamVjdCB3aXRoIGEgbGlzdCBvZiBwcm9wZXJ0aWVzIGFuZCB2YWx1ZXMgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRTdHlsZXMoZWxlbWVudCwgc3R5bGVzKSB7XHJcbiAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XHJcbiAgICB2YXIgdW5pdCA9ICcnO1xyXG4gICAgLy8gYWRkIHVuaXQgaWYgdGhlIHZhbHVlIGlzIG51bWVyaWMgYW5kIGlzIG9uZSBvZiB0aGUgZm9sbG93aW5nXHJcbiAgICBpZiAoWyd3aWR0aCcsICdoZWlnaHQnLCAndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0J10uaW5kZXhPZihwcm9wKSAhPT0gLTEgJiYgaXNOdW1lcmljKHN0eWxlc1twcm9wXSkpIHtcclxuICAgICAgdW5pdCA9ICdweCc7XHJcbiAgICB9XHJcbiAgICBlbGVtZW50LnN0eWxlW3Byb3BdID0gc3R5bGVzW3Byb3BdICsgdW5pdDtcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCB0aGUgYXR0cmlidXRlcyB0byB0aGUgZ2l2ZW4gcG9wcGVyXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnQgLSBFbGVtZW50IHRvIGFwcGx5IHRoZSBhdHRyaWJ1dGVzIHRvXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBzdHlsZXNcclxuICogT2JqZWN0IHdpdGggYSBsaXN0IG9mIHByb3BlcnRpZXMgYW5kIHZhbHVlcyB3aGljaCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMoZWxlbWVudCwgYXR0cmlidXRlcykge1xyXG4gIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcclxuICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNbcHJvcF07XHJcbiAgICBpZiAodmFsdWUgIT09IGZhbHNlKSB7XHJcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKHByb3AsIGF0dHJpYnV0ZXNbcHJvcF0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUocHJvcCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhLnN0eWxlcyAtIExpc3Qgb2Ygc3R5bGUgcHJvcGVydGllcyAtIHZhbHVlcyB0byBhcHBseSB0byBwb3BwZXIgZWxlbWVudFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YS5hdHRyaWJ1dGVzIC0gTGlzdCBvZiBhdHRyaWJ1dGUgcHJvcGVydGllcyAtIHZhbHVlcyB0byBhcHBseSB0byBwb3BwZXIgZWxlbWVudFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBzYW1lIGRhdGEgb2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBhcHBseVN0eWxlKGRhdGEpIHtcclxuICAvLyBhbnkgcHJvcGVydHkgcHJlc2VudCBpbiBgZGF0YS5zdHlsZXNgIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyLFxyXG4gIC8vIGluIHRoaXMgd2F5IHdlIGNhbiBtYWtlIHRoZSAzcmQgcGFydHkgbW9kaWZpZXJzIGFkZCBjdXN0b20gc3R5bGVzIHRvIGl0XHJcbiAgLy8gQmUgYXdhcmUsIG1vZGlmaWVycyBjb3VsZCBvdmVycmlkZSB0aGUgcHJvcGVydGllcyBkZWZpbmVkIGluIHRoZSBwcmV2aW91c1xyXG4gIC8vIGxpbmVzIG9mIHRoaXMgbW9kaWZpZXIhXHJcbiAgc2V0U3R5bGVzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLnN0eWxlcyk7XHJcblxyXG4gIC8vIGFueSBwcm9wZXJ0eSBwcmVzZW50IGluIGBkYXRhLmF0dHJpYnV0ZXNgIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyLFxyXG4gIC8vIHRoZXkgd2lsbCBiZSBzZXQgYXMgSFRNTCBhdHRyaWJ1dGVzIG9mIHRoZSBlbGVtZW50XHJcbiAgc2V0QXR0cmlidXRlcyhkYXRhLmluc3RhbmNlLnBvcHBlciwgZGF0YS5hdHRyaWJ1dGVzKTtcclxuXHJcbiAgLy8gaWYgYXJyb3dFbGVtZW50IGlzIGRlZmluZWQgYW5kIGFycm93U3R5bGVzIGhhcyBzb21lIHByb3BlcnRpZXNcclxuICBpZiAoZGF0YS5hcnJvd0VsZW1lbnQgJiYgT2JqZWN0LmtleXMoZGF0YS5hcnJvd1N0eWxlcykubGVuZ3RoKSB7XHJcbiAgICBzZXRTdHlsZXMoZGF0YS5hcnJvd0VsZW1lbnQsIGRhdGEuYXJyb3dTdHlsZXMpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIHgtcGxhY2VtZW50IGF0dHJpYnV0ZSBiZWZvcmUgZXZlcnl0aGluZyBlbHNlIGJlY2F1c2UgaXQgY291bGQgYmUgdXNlZFxyXG4gKiB0byBhZGQgbWFyZ2lucyB0byB0aGUgcG9wcGVyIG1hcmdpbnMgbmVlZHMgdG8gYmUgY2FsY3VsYXRlZCB0byBnZXQgdGhlXHJcbiAqIGNvcnJlY3QgcG9wcGVyIG9mZnNldHMuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5tb2RpZmllcnNcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcmVmZXJlbmNlIC0gVGhlIHJlZmVyZW5jZSBlbGVtZW50IHVzZWQgdG8gcG9zaXRpb24gdGhlIHBvcHBlclxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3BwZXIgLSBUaGUgSFRNTCBlbGVtZW50IHVzZWQgYXMgcG9wcGVyXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gUG9wcGVyLmpzIG9wdGlvbnNcclxuICovXHJcbmZ1bmN0aW9uIGFwcGx5U3R5bGVPbkxvYWQocmVmZXJlbmNlLCBwb3BwZXIsIG9wdGlvbnMsIG1vZGlmaWVyT3B0aW9ucywgc3RhdGUpIHtcclxuICAvLyBjb21wdXRlIHJlZmVyZW5jZSBlbGVtZW50IG9mZnNldHNcclxuICB2YXIgcmVmZXJlbmNlT2Zmc2V0cyA9IGdldFJlZmVyZW5jZU9mZnNldHMoc3RhdGUsIHBvcHBlciwgcmVmZXJlbmNlLCBvcHRpb25zLnBvc2l0aW9uRml4ZWQpO1xyXG5cclxuICAvLyBjb21wdXRlIGF1dG8gcGxhY2VtZW50LCBzdG9yZSBwbGFjZW1lbnQgaW5zaWRlIHRoZSBkYXRhIG9iamVjdCxcclxuICAvLyBtb2RpZmllcnMgd2lsbCBiZSBhYmxlIHRvIGVkaXQgYHBsYWNlbWVudGAgaWYgbmVlZGVkXHJcbiAgLy8gYW5kIHJlZmVyIHRvIG9yaWdpbmFsUGxhY2VtZW50IHRvIGtub3cgdGhlIG9yaWdpbmFsIHZhbHVlXHJcbiAgdmFyIHBsYWNlbWVudCA9IGNvbXB1dGVBdXRvUGxhY2VtZW50KG9wdGlvbnMucGxhY2VtZW50LCByZWZlcmVuY2VPZmZzZXRzLCBwb3BwZXIsIHJlZmVyZW5jZSwgb3B0aW9ucy5tb2RpZmllcnMuZmxpcC5ib3VuZGFyaWVzRWxlbWVudCwgb3B0aW9ucy5tb2RpZmllcnMuZmxpcC5wYWRkaW5nKTtcclxuXHJcbiAgcG9wcGVyLnNldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnLCBwbGFjZW1lbnQpO1xyXG5cclxuICAvLyBBcHBseSBgcG9zaXRpb25gIHRvIHBvcHBlciBiZWZvcmUgYW55dGhpbmcgZWxzZSBiZWNhdXNlXHJcbiAgLy8gd2l0aG91dCB0aGUgcG9zaXRpb24gYXBwbGllZCB3ZSBjYW4ndCBndWFyYW50ZWUgY29ycmVjdCBjb21wdXRhdGlvbnNcclxuICBzZXRTdHlsZXMocG9wcGVyLCB7IHBvc2l0aW9uOiBvcHRpb25zLnBvc2l0aW9uRml4ZWQgPyAnZml4ZWQnIDogJ2Fic29sdXRlJyB9KTtcclxuXHJcbiAgcmV0dXJuIG9wdGlvbnM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gY29tcHV0ZVN0eWxlKGRhdGEsIG9wdGlvbnMpIHtcclxuICB2YXIgeCA9IG9wdGlvbnMueCxcclxuICAgICAgeSA9IG9wdGlvbnMueTtcclxuICB2YXIgcG9wcGVyID0gZGF0YS5vZmZzZXRzLnBvcHBlcjtcclxuXHJcbiAgLy8gUmVtb3ZlIHRoaXMgbGVnYWN5IHN1cHBvcnQgaW4gUG9wcGVyLmpzIHYyXHJcblxyXG4gIHZhciBsZWdhY3lHcHVBY2NlbGVyYXRpb25PcHRpb24gPSBmaW5kKGRhdGEuaW5zdGFuY2UubW9kaWZpZXJzLCBmdW5jdGlvbiAobW9kaWZpZXIpIHtcclxuICAgIHJldHVybiBtb2RpZmllci5uYW1lID09PSAnYXBwbHlTdHlsZSc7XHJcbiAgfSkuZ3B1QWNjZWxlcmF0aW9uO1xyXG4gIGlmIChsZWdhY3lHcHVBY2NlbGVyYXRpb25PcHRpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiBgZ3B1QWNjZWxlcmF0aW9uYCBvcHRpb24gbW92ZWQgdG8gYGNvbXB1dGVTdHlsZWAgbW9kaWZpZXIgYW5kIHdpbGwgbm90IGJlIHN1cHBvcnRlZCBpbiBmdXR1cmUgdmVyc2lvbnMgb2YgUG9wcGVyLmpzIScpO1xyXG4gIH1cclxuICB2YXIgZ3B1QWNjZWxlcmF0aW9uID0gbGVnYWN5R3B1QWNjZWxlcmF0aW9uT3B0aW9uICE9PSB1bmRlZmluZWQgPyBsZWdhY3lHcHVBY2NlbGVyYXRpb25PcHRpb24gOiBvcHRpb25zLmdwdUFjY2VsZXJhdGlvbjtcclxuXHJcbiAgdmFyIG9mZnNldFBhcmVudCA9IGdldE9mZnNldFBhcmVudChkYXRhLmluc3RhbmNlLnBvcHBlcik7XHJcbiAgdmFyIG9mZnNldFBhcmVudFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3Qob2Zmc2V0UGFyZW50KTtcclxuXHJcbiAgLy8gU3R5bGVzXHJcbiAgdmFyIHN0eWxlcyA9IHtcclxuICAgIHBvc2l0aW9uOiBwb3BwZXIucG9zaXRpb25cclxuICB9O1xyXG5cclxuICAvLyBBdm9pZCBibHVycnkgdGV4dCBieSB1c2luZyBmdWxsIHBpeGVsIGludGVnZXJzLlxyXG4gIC8vIEZvciBwaXhlbC1wZXJmZWN0IHBvc2l0aW9uaW5nLCB0b3AvYm90dG9tIHByZWZlcnMgcm91bmRlZFxyXG4gIC8vIHZhbHVlcywgd2hpbGUgbGVmdC9yaWdodCBwcmVmZXJzIGZsb29yZWQgdmFsdWVzLlxyXG4gIHZhciBvZmZzZXRzID0ge1xyXG4gICAgbGVmdDogTWF0aC5mbG9vcihwb3BwZXIubGVmdCksXHJcbiAgICB0b3A6IE1hdGgucm91bmQocG9wcGVyLnRvcCksXHJcbiAgICBib3R0b206IE1hdGgucm91bmQocG9wcGVyLmJvdHRvbSksXHJcbiAgICByaWdodDogTWF0aC5mbG9vcihwb3BwZXIucmlnaHQpXHJcbiAgfTtcclxuXHJcbiAgdmFyIHNpZGVBID0geCA9PT0gJ2JvdHRvbScgPyAndG9wJyA6ICdib3R0b20nO1xyXG4gIHZhciBzaWRlQiA9IHkgPT09ICdyaWdodCcgPyAnbGVmdCcgOiAncmlnaHQnO1xyXG5cclxuICAvLyBpZiBncHVBY2NlbGVyYXRpb24gaXMgc2V0IHRvIGB0cnVlYCBhbmQgdHJhbnNmb3JtIGlzIHN1cHBvcnRlZCxcclxuICAvLyAgd2UgdXNlIGB0cmFuc2xhdGUzZGAgdG8gYXBwbHkgdGhlIHBvc2l0aW9uIHRvIHRoZSBwb3BwZXIgd2VcclxuICAvLyBhdXRvbWF0aWNhbGx5IHVzZSB0aGUgc3VwcG9ydGVkIHByZWZpeGVkIHZlcnNpb24gaWYgbmVlZGVkXHJcbiAgdmFyIHByZWZpeGVkUHJvcGVydHkgPSBnZXRTdXBwb3J0ZWRQcm9wZXJ0eU5hbWUoJ3RyYW5zZm9ybScpO1xyXG5cclxuICAvLyBub3csIGxldCdzIG1ha2UgYSBzdGVwIGJhY2sgYW5kIGxvb2sgYXQgdGhpcyBjb2RlIGNsb3NlbHkgKHd0Zj8pXHJcbiAgLy8gSWYgdGhlIGNvbnRlbnQgb2YgdGhlIHBvcHBlciBncm93cyBvbmNlIGl0J3MgYmVlbiBwb3NpdGlvbmVkLCBpdFxyXG4gIC8vIG1heSBoYXBwZW4gdGhhdCB0aGUgcG9wcGVyIGdldHMgbWlzcGxhY2VkIGJlY2F1c2Ugb2YgdGhlIG5ldyBjb250ZW50XHJcbiAgLy8gb3ZlcmZsb3dpbmcgaXRzIHJlZmVyZW5jZSBlbGVtZW50XHJcbiAgLy8gVG8gYXZvaWQgdGhpcyBwcm9ibGVtLCB3ZSBwcm92aWRlIHR3byBvcHRpb25zICh4IGFuZCB5KSwgd2hpY2ggYWxsb3dcclxuICAvLyB0aGUgY29uc3VtZXIgdG8gZGVmaW5lIHRoZSBvZmZzZXQgb3JpZ2luLlxyXG4gIC8vIElmIHdlIHBvc2l0aW9uIGEgcG9wcGVyIG9uIHRvcCBvZiBhIHJlZmVyZW5jZSBlbGVtZW50LCB3ZSBjYW4gc2V0XHJcbiAgLy8gYHhgIHRvIGB0b3BgIHRvIG1ha2UgdGhlIHBvcHBlciBncm93IHRvd2FyZHMgaXRzIHRvcCBpbnN0ZWFkIG9mXHJcbiAgLy8gaXRzIGJvdHRvbS5cclxuICB2YXIgbGVmdCA9IHZvaWQgMCxcclxuICAgICAgdG9wID0gdm9pZCAwO1xyXG4gIGlmIChzaWRlQSA9PT0gJ2JvdHRvbScpIHtcclxuICAgIHRvcCA9IC1vZmZzZXRQYXJlbnRSZWN0LmhlaWdodCArIG9mZnNldHMuYm90dG9tO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0b3AgPSBvZmZzZXRzLnRvcDtcclxuICB9XHJcbiAgaWYgKHNpZGVCID09PSAncmlnaHQnKSB7XHJcbiAgICBsZWZ0ID0gLW9mZnNldFBhcmVudFJlY3Qud2lkdGggKyBvZmZzZXRzLnJpZ2h0O1xyXG4gIH0gZWxzZSB7XHJcbiAgICBsZWZ0ID0gb2Zmc2V0cy5sZWZ0O1xyXG4gIH1cclxuICBpZiAoZ3B1QWNjZWxlcmF0aW9uICYmIHByZWZpeGVkUHJvcGVydHkpIHtcclxuICAgIHN0eWxlc1twcmVmaXhlZFByb3BlcnR5XSA9ICd0cmFuc2xhdGUzZCgnICsgbGVmdCArICdweCwgJyArIHRvcCArICdweCwgMCknO1xyXG4gICAgc3R5bGVzW3NpZGVBXSA9IDA7XHJcbiAgICBzdHlsZXNbc2lkZUJdID0gMDtcclxuICAgIHN0eWxlcy53aWxsQ2hhbmdlID0gJ3RyYW5zZm9ybSc7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIG90aHdlcmlzZSwgd2UgdXNlIHRoZSBzdGFuZGFyZCBgdG9wYCwgYGxlZnRgLCBgYm90dG9tYCBhbmQgYHJpZ2h0YCBwcm9wZXJ0aWVzXHJcbiAgICB2YXIgaW52ZXJ0VG9wID0gc2lkZUEgPT09ICdib3R0b20nID8gLTEgOiAxO1xyXG4gICAgdmFyIGludmVydExlZnQgPSBzaWRlQiA9PT0gJ3JpZ2h0JyA/IC0xIDogMTtcclxuICAgIHN0eWxlc1tzaWRlQV0gPSB0b3AgKiBpbnZlcnRUb3A7XHJcbiAgICBzdHlsZXNbc2lkZUJdID0gbGVmdCAqIGludmVydExlZnQ7XHJcbiAgICBzdHlsZXMud2lsbENoYW5nZSA9IHNpZGVBICsgJywgJyArIHNpZGVCO1xyXG4gIH1cclxuXHJcbiAgLy8gQXR0cmlidXRlc1xyXG4gIHZhciBhdHRyaWJ1dGVzID0ge1xyXG4gICAgJ3gtcGxhY2VtZW50JzogZGF0YS5wbGFjZW1lbnRcclxuICB9O1xyXG5cclxuICAvLyBVcGRhdGUgYGRhdGFgIGF0dHJpYnV0ZXMsIHN0eWxlcyBhbmQgYXJyb3dTdHlsZXNcclxuICBkYXRhLmF0dHJpYnV0ZXMgPSBfZXh0ZW5kcyQxKHt9LCBhdHRyaWJ1dGVzLCBkYXRhLmF0dHJpYnV0ZXMpO1xyXG4gIGRhdGEuc3R5bGVzID0gX2V4dGVuZHMkMSh7fSwgc3R5bGVzLCBkYXRhLnN0eWxlcyk7XHJcbiAgZGF0YS5hcnJvd1N0eWxlcyA9IF9leHRlbmRzJDEoe30sIGRhdGEub2Zmc2V0cy5hcnJvdywgZGF0YS5hcnJvd1N0eWxlcyk7XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogSGVscGVyIHVzZWQgdG8ga25vdyBpZiB0aGUgZ2l2ZW4gbW9kaWZpZXIgZGVwZW5kcyBmcm9tIGFub3RoZXIgb25lLjxiciAvPlxyXG4gKiBJdCBjaGVja3MgaWYgdGhlIG5lZWRlZCBtb2RpZmllciBpcyBsaXN0ZWQgYW5kIGVuYWJsZWQuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge0FycmF5fSBtb2RpZmllcnMgLSBsaXN0IG9mIG1vZGlmaWVyc1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdGluZ05hbWUgLSBuYW1lIG9mIHJlcXVlc3RpbmcgbW9kaWZpZXJcclxuICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RlZE5hbWUgLSBuYW1lIG9mIHJlcXVlc3RlZCBtb2RpZmllclxyXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzTW9kaWZpZXJSZXF1aXJlZChtb2RpZmllcnMsIHJlcXVlc3RpbmdOYW1lLCByZXF1ZXN0ZWROYW1lKSB7XHJcbiAgdmFyIHJlcXVlc3RpbmcgPSBmaW5kKG1vZGlmaWVycywgZnVuY3Rpb24gKF9yZWYpIHtcclxuICAgIHZhciBuYW1lID0gX3JlZi5uYW1lO1xyXG4gICAgcmV0dXJuIG5hbWUgPT09IHJlcXVlc3RpbmdOYW1lO1xyXG4gIH0pO1xyXG5cclxuICB2YXIgaXNSZXF1aXJlZCA9ICEhcmVxdWVzdGluZyAmJiBtb2RpZmllcnMuc29tZShmdW5jdGlvbiAobW9kaWZpZXIpIHtcclxuICAgIHJldHVybiBtb2RpZmllci5uYW1lID09PSByZXF1ZXN0ZWROYW1lICYmIG1vZGlmaWVyLmVuYWJsZWQgJiYgbW9kaWZpZXIub3JkZXIgPCByZXF1ZXN0aW5nLm9yZGVyO1xyXG4gIH0pO1xyXG5cclxuICBpZiAoIWlzUmVxdWlyZWQpIHtcclxuICAgIHZhciBfcmVxdWVzdGluZyA9ICdgJyArIHJlcXVlc3RpbmdOYW1lICsgJ2AnO1xyXG4gICAgdmFyIHJlcXVlc3RlZCA9ICdgJyArIHJlcXVlc3RlZE5hbWUgKyAnYCc7XHJcbiAgICBjb25zb2xlLndhcm4ocmVxdWVzdGVkICsgJyBtb2RpZmllciBpcyByZXF1aXJlZCBieSAnICsgX3JlcXVlc3RpbmcgKyAnIG1vZGlmaWVyIGluIG9yZGVyIHRvIHdvcmssIGJlIHN1cmUgdG8gaW5jbHVkZSBpdCBiZWZvcmUgJyArIF9yZXF1ZXN0aW5nICsgJyEnKTtcclxuICB9XHJcbiAgcmV0dXJuIGlzUmVxdWlyZWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIGFycm93KGRhdGEsIG9wdGlvbnMpIHtcclxuICB2YXIgX2RhdGEkb2Zmc2V0cyRhcnJvdztcclxuXHJcbiAgLy8gYXJyb3cgZGVwZW5kcyBvbiBrZWVwVG9nZXRoZXIgaW4gb3JkZXIgdG8gd29ya1xyXG4gIGlmICghaXNNb2RpZmllclJlcXVpcmVkKGRhdGEuaW5zdGFuY2UubW9kaWZpZXJzLCAnYXJyb3cnLCAna2VlcFRvZ2V0aGVyJykpIHtcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgdmFyIGFycm93RWxlbWVudCA9IG9wdGlvbnMuZWxlbWVudDtcclxuXHJcbiAgLy8gaWYgYXJyb3dFbGVtZW50IGlzIGEgc3RyaW5nLCBzdXBwb3NlIGl0J3MgYSBDU1Mgc2VsZWN0b3JcclxuICBpZiAodHlwZW9mIGFycm93RWxlbWVudCA9PT0gJ3N0cmluZycpIHtcclxuICAgIGFycm93RWxlbWVudCA9IGRhdGEuaW5zdGFuY2UucG9wcGVyLnF1ZXJ5U2VsZWN0b3IoYXJyb3dFbGVtZW50KTtcclxuXHJcbiAgICAvLyBpZiBhcnJvd0VsZW1lbnQgaXMgbm90IGZvdW5kLCBkb24ndCBydW4gdGhlIG1vZGlmaWVyXHJcbiAgICBpZiAoIWFycm93RWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgLy8gaWYgdGhlIGFycm93RWxlbWVudCBpc24ndCBhIHF1ZXJ5IHNlbGVjdG9yIHdlIG11c3QgY2hlY2sgdGhhdCB0aGVcclxuICAgIC8vIHByb3ZpZGVkIERPTSBub2RlIGlzIGNoaWxkIG9mIGl0cyBwb3BwZXIgbm9kZVxyXG4gICAgaWYgKCFkYXRhLmluc3RhbmNlLnBvcHBlci5jb250YWlucyhhcnJvd0VsZW1lbnQpKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignV0FSTklORzogYGFycm93LmVsZW1lbnRgIG11c3QgYmUgY2hpbGQgb2YgaXRzIHBvcHBlciBlbGVtZW50IScpO1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xyXG4gIHZhciBfZGF0YSRvZmZzZXRzID0gZGF0YS5vZmZzZXRzLFxyXG4gICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcixcclxuICAgICAgcmVmZXJlbmNlID0gX2RhdGEkb2Zmc2V0cy5yZWZlcmVuY2U7XHJcblxyXG4gIHZhciBpc1ZlcnRpY2FsID0gWydsZWZ0JywgJ3JpZ2h0J10uaW5kZXhPZihwbGFjZW1lbnQpICE9PSAtMTtcclxuXHJcbiAgdmFyIGxlbiA9IGlzVmVydGljYWwgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XHJcbiAgdmFyIHNpZGVDYXBpdGFsaXplZCA9IGlzVmVydGljYWwgPyAnVG9wJyA6ICdMZWZ0JztcclxuICB2YXIgc2lkZSA9IHNpZGVDYXBpdGFsaXplZC50b0xvd2VyQ2FzZSgpO1xyXG4gIHZhciBhbHRTaWRlID0gaXNWZXJ0aWNhbCA/ICdsZWZ0JyA6ICd0b3AnO1xyXG4gIHZhciBvcFNpZGUgPSBpc1ZlcnRpY2FsID8gJ2JvdHRvbScgOiAncmlnaHQnO1xyXG4gIHZhciBhcnJvd0VsZW1lbnRTaXplID0gZ2V0T3V0ZXJTaXplcyhhcnJvd0VsZW1lbnQpW2xlbl07XHJcblxyXG4gIC8vXHJcbiAgLy8gZXh0ZW5kcyBrZWVwVG9nZXRoZXIgYmVoYXZpb3IgbWFraW5nIHN1cmUgdGhlIHBvcHBlciBhbmQgaXRzXHJcbiAgLy8gcmVmZXJlbmNlIGhhdmUgZW5vdWdoIHBpeGVscyBpbiBjb25qdWN0aW9uXHJcbiAgLy9cclxuXHJcbiAgLy8gdG9wL2xlZnQgc2lkZVxyXG4gIGlmIChyZWZlcmVuY2Vbb3BTaWRlXSAtIGFycm93RWxlbWVudFNpemUgPCBwb3BwZXJbc2lkZV0pIHtcclxuICAgIGRhdGEub2Zmc2V0cy5wb3BwZXJbc2lkZV0gLT0gcG9wcGVyW3NpZGVdIC0gKHJlZmVyZW5jZVtvcFNpZGVdIC0gYXJyb3dFbGVtZW50U2l6ZSk7XHJcbiAgfVxyXG4gIC8vIGJvdHRvbS9yaWdodCBzaWRlXHJcbiAgaWYgKHJlZmVyZW5jZVtzaWRlXSArIGFycm93RWxlbWVudFNpemUgPiBwb3BwZXJbb3BTaWRlXSkge1xyXG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlcltzaWRlXSArPSByZWZlcmVuY2Vbc2lkZV0gKyBhcnJvd0VsZW1lbnRTaXplIC0gcG9wcGVyW29wU2lkZV07XHJcbiAgfVxyXG4gIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBnZXRDbGllbnRSZWN0KGRhdGEub2Zmc2V0cy5wb3BwZXIpO1xyXG5cclxuICAvLyBjb21wdXRlIGNlbnRlciBvZiB0aGUgcG9wcGVyXHJcbiAgdmFyIGNlbnRlciA9IHJlZmVyZW5jZVtzaWRlXSArIHJlZmVyZW5jZVtsZW5dIC8gMiAtIGFycm93RWxlbWVudFNpemUgLyAyO1xyXG5cclxuICAvLyBDb21wdXRlIHRoZSBzaWRlVmFsdWUgdXNpbmcgdGhlIHVwZGF0ZWQgcG9wcGVyIG9mZnNldHNcclxuICAvLyB0YWtlIHBvcHBlciBtYXJnaW4gaW4gYWNjb3VudCBiZWNhdXNlIHdlIGRvbid0IGhhdmUgdGhpcyBpbmZvIGF2YWlsYWJsZVxyXG4gIHZhciBjc3MgPSBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZGF0YS5pbnN0YW5jZS5wb3BwZXIpO1xyXG4gIHZhciBwb3BwZXJNYXJnaW5TaWRlID0gcGFyc2VGbG9hdChjc3NbJ21hcmdpbicgKyBzaWRlQ2FwaXRhbGl6ZWRdLCAxMCk7XHJcbiAgdmFyIHBvcHBlckJvcmRlclNpZGUgPSBwYXJzZUZsb2F0KGNzc1snYm9yZGVyJyArIHNpZGVDYXBpdGFsaXplZCArICdXaWR0aCddLCAxMCk7XHJcbiAgdmFyIHNpZGVWYWx1ZSA9IGNlbnRlciAtIGRhdGEub2Zmc2V0cy5wb3BwZXJbc2lkZV0gLSBwb3BwZXJNYXJnaW5TaWRlIC0gcG9wcGVyQm9yZGVyU2lkZTtcclxuXHJcbiAgLy8gcHJldmVudCBhcnJvd0VsZW1lbnQgZnJvbSBiZWluZyBwbGFjZWQgbm90IGNvbnRpZ3VvdXNseSB0byBpdHMgcG9wcGVyXHJcbiAgc2lkZVZhbHVlID0gTWF0aC5tYXgoTWF0aC5taW4ocG9wcGVyW2xlbl0gLSBhcnJvd0VsZW1lbnRTaXplLCBzaWRlVmFsdWUpLCAwKTtcclxuXHJcbiAgZGF0YS5hcnJvd0VsZW1lbnQgPSBhcnJvd0VsZW1lbnQ7XHJcbiAgZGF0YS5vZmZzZXRzLmFycm93ID0gKF9kYXRhJG9mZnNldHMkYXJyb3cgPSB7fSwgZGVmaW5lUHJvcGVydHkkMShfZGF0YSRvZmZzZXRzJGFycm93LCBzaWRlLCBNYXRoLnJvdW5kKHNpZGVWYWx1ZSkpLCBkZWZpbmVQcm9wZXJ0eSQxKF9kYXRhJG9mZnNldHMkYXJyb3csIGFsdFNpZGUsICcnKSwgX2RhdGEkb2Zmc2V0cyRhcnJvdyk7XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBvcHBvc2l0ZSBwbGFjZW1lbnQgdmFyaWF0aW9uIG9mIHRoZSBnaXZlbiBvbmVcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwbGFjZW1lbnQgdmFyaWF0aW9uXHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IGZsaXBwZWQgcGxhY2VtZW50IHZhcmlhdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0T3Bwb3NpdGVWYXJpYXRpb24odmFyaWF0aW9uKSB7XHJcbiAgaWYgKHZhcmlhdGlvbiA9PT0gJ2VuZCcpIHtcclxuICAgIHJldHVybiAnc3RhcnQnO1xyXG4gIH0gZWxzZSBpZiAodmFyaWF0aW9uID09PSAnc3RhcnQnKSB7XHJcbiAgICByZXR1cm4gJ2VuZCc7XHJcbiAgfVxyXG4gIHJldHVybiB2YXJpYXRpb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBMaXN0IG9mIGFjY2VwdGVkIHBsYWNlbWVudHMgdG8gdXNlIGFzIHZhbHVlcyBvZiB0aGUgYHBsYWNlbWVudGAgb3B0aW9uLjxiciAvPlxyXG4gKiBWYWxpZCBwbGFjZW1lbnRzIGFyZTpcclxuICogLSBgYXV0b2BcclxuICogLSBgdG9wYFxyXG4gKiAtIGByaWdodGBcclxuICogLSBgYm90dG9tYFxyXG4gKiAtIGBsZWZ0YFxyXG4gKlxyXG4gKiBFYWNoIHBsYWNlbWVudCBjYW4gaGF2ZSBhIHZhcmlhdGlvbiBmcm9tIHRoaXMgbGlzdDpcclxuICogLSBgLXN0YXJ0YFxyXG4gKiAtIGAtZW5kYFxyXG4gKlxyXG4gKiBWYXJpYXRpb25zIGFyZSBpbnRlcnByZXRlZCBlYXNpbHkgaWYgeW91IHRoaW5rIG9mIHRoZW0gYXMgdGhlIGxlZnQgdG8gcmlnaHRcclxuICogd3JpdHRlbiBsYW5ndWFnZXMuIEhvcml6b250YWxseSAoYHRvcGAgYW5kIGBib3R0b21gKSwgYHN0YXJ0YCBpcyBsZWZ0IGFuZCBgZW5kYFxyXG4gKiBpcyByaWdodC48YnIgLz5cclxuICogVmVydGljYWxseSAoYGxlZnRgIGFuZCBgcmlnaHRgKSwgYHN0YXJ0YCBpcyB0b3AgYW5kIGBlbmRgIGlzIGJvdHRvbS5cclxuICpcclxuICogU29tZSB2YWxpZCBleGFtcGxlcyBhcmU6XHJcbiAqIC0gYHRvcC1lbmRgIChvbiB0b3Agb2YgcmVmZXJlbmNlLCByaWdodCBhbGlnbmVkKVxyXG4gKiAtIGByaWdodC1zdGFydGAgKG9uIHJpZ2h0IG9mIHJlZmVyZW5jZSwgdG9wIGFsaWduZWQpXHJcbiAqIC0gYGJvdHRvbWAgKG9uIGJvdHRvbSwgY2VudGVyZWQpXHJcbiAqIC0gYGF1dG8tcmlnaHRgIChvbiB0aGUgc2lkZSB3aXRoIG1vcmUgc3BhY2UgYXZhaWxhYmxlLCBhbGlnbm1lbnQgZGVwZW5kcyBieSBwbGFjZW1lbnQpXHJcbiAqXHJcbiAqIEBzdGF0aWNcclxuICogQHR5cGUge0FycmF5fVxyXG4gKiBAZW51bSB7U3RyaW5nfVxyXG4gKiBAcmVhZG9ubHlcclxuICogQG1ldGhvZCBwbGFjZW1lbnRzXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICovXHJcbnZhciBwbGFjZW1lbnRzID0gWydhdXRvLXN0YXJ0JywgJ2F1dG8nLCAnYXV0by1lbmQnLCAndG9wLXN0YXJ0JywgJ3RvcCcsICd0b3AtZW5kJywgJ3JpZ2h0LXN0YXJ0JywgJ3JpZ2h0JywgJ3JpZ2h0LWVuZCcsICdib3R0b20tZW5kJywgJ2JvdHRvbScsICdib3R0b20tc3RhcnQnLCAnbGVmdC1lbmQnLCAnbGVmdCcsICdsZWZ0LXN0YXJ0J107XHJcblxyXG4vLyBHZXQgcmlkIG9mIGBhdXRvYCBgYXV0by1zdGFydGAgYW5kIGBhdXRvLWVuZGBcclxudmFyIHZhbGlkUGxhY2VtZW50cyA9IHBsYWNlbWVudHMuc2xpY2UoMyk7XHJcblxyXG4vKipcclxuICogR2l2ZW4gYW4gaW5pdGlhbCBwbGFjZW1lbnQsIHJldHVybnMgYWxsIHRoZSBzdWJzZXF1ZW50IHBsYWNlbWVudHNcclxuICogY2xvY2t3aXNlIChvciBjb3VudGVyLWNsb2Nrd2lzZSkuXHJcbiAqXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gcGxhY2VtZW50IC0gQSB2YWxpZCBwbGFjZW1lbnQgKGl0IGFjY2VwdHMgdmFyaWF0aW9ucylcclxuICogQGFyZ3VtZW50IHtCb29sZWFufSBjb3VudGVyIC0gU2V0IHRvIHRydWUgdG8gd2FsayB0aGUgcGxhY2VtZW50cyBjb3VudGVyY2xvY2t3aXNlXHJcbiAqIEByZXR1cm5zIHtBcnJheX0gcGxhY2VtZW50cyBpbmNsdWRpbmcgdGhlaXIgdmFyaWF0aW9uc1xyXG4gKi9cclxuZnVuY3Rpb24gY2xvY2t3aXNlKHBsYWNlbWVudCkge1xyXG4gIHZhciBjb3VudGVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcclxuXHJcbiAgdmFyIGluZGV4ID0gdmFsaWRQbGFjZW1lbnRzLmluZGV4T2YocGxhY2VtZW50KTtcclxuICB2YXIgYXJyID0gdmFsaWRQbGFjZW1lbnRzLnNsaWNlKGluZGV4ICsgMSkuY29uY2F0KHZhbGlkUGxhY2VtZW50cy5zbGljZSgwLCBpbmRleCkpO1xyXG4gIHJldHVybiBjb3VudGVyID8gYXJyLnJldmVyc2UoKSA6IGFycjtcclxufVxyXG5cclxudmFyIEJFSEFWSU9SUyA9IHtcclxuICBGTElQOiAnZmxpcCcsXHJcbiAgQ0xPQ0tXSVNFOiAnY2xvY2t3aXNlJyxcclxuICBDT1VOVEVSQ0xPQ0tXSVNFOiAnY291bnRlcmNsb2Nrd2lzZSdcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIGZsaXAoZGF0YSwgb3B0aW9ucykge1xyXG4gIC8vIGlmIGBpbm5lcmAgbW9kaWZpZXIgaXMgZW5hYmxlZCwgd2UgY2FuJ3QgdXNlIHRoZSBgZmxpcGAgbW9kaWZpZXJcclxuICBpZiAoaXNNb2RpZmllckVuYWJsZWQoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsICdpbm5lcicpKSB7XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIGlmIChkYXRhLmZsaXBwZWQgJiYgZGF0YS5wbGFjZW1lbnQgPT09IGRhdGEub3JpZ2luYWxQbGFjZW1lbnQpIHtcclxuICAgIC8vIHNlZW1zIGxpa2UgZmxpcCBpcyB0cnlpbmcgdG8gbG9vcCwgcHJvYmFibHkgdGhlcmUncyBub3QgZW5vdWdoIHNwYWNlIG9uIGFueSBvZiB0aGUgZmxpcHBhYmxlIHNpZGVzXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHZhciBib3VuZGFyaWVzID0gZ2V0Qm91bmRhcmllcyhkYXRhLmluc3RhbmNlLnBvcHBlciwgZGF0YS5pbnN0YW5jZS5yZWZlcmVuY2UsIG9wdGlvbnMucGFkZGluZywgb3B0aW9ucy5ib3VuZGFyaWVzRWxlbWVudCwgZGF0YS5wb3NpdGlvbkZpeGVkKTtcclxuXHJcbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcbiAgdmFyIHBsYWNlbWVudE9wcG9zaXRlID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KTtcclxuICB2YXIgdmFyaWF0aW9uID0gZGF0YS5wbGFjZW1lbnQuc3BsaXQoJy0nKVsxXSB8fCAnJztcclxuXHJcbiAgdmFyIGZsaXBPcmRlciA9IFtdO1xyXG5cclxuICBzd2l0Y2ggKG9wdGlvbnMuYmVoYXZpb3IpIHtcclxuICAgIGNhc2UgQkVIQVZJT1JTLkZMSVA6XHJcbiAgICAgIGZsaXBPcmRlciA9IFtwbGFjZW1lbnQsIHBsYWNlbWVudE9wcG9zaXRlXTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIEJFSEFWSU9SUy5DTE9DS1dJU0U6XHJcbiAgICAgIGZsaXBPcmRlciA9IGNsb2Nrd2lzZShwbGFjZW1lbnQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgQkVIQVZJT1JTLkNPVU5URVJDTE9DS1dJU0U6XHJcbiAgICAgIGZsaXBPcmRlciA9IGNsb2Nrd2lzZShwbGFjZW1lbnQsIHRydWUpO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGZsaXBPcmRlciA9IG9wdGlvbnMuYmVoYXZpb3I7XHJcbiAgfVxyXG5cclxuICBmbGlwT3JkZXIuZm9yRWFjaChmdW5jdGlvbiAoc3RlcCwgaW5kZXgpIHtcclxuICAgIGlmIChwbGFjZW1lbnQgIT09IHN0ZXAgfHwgZmxpcE9yZGVyLmxlbmd0aCA9PT0gaW5kZXggKyAxKSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcbiAgICBwbGFjZW1lbnRPcHBvc2l0ZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XHJcblxyXG4gICAgdmFyIHBvcHBlck9mZnNldHMgPSBkYXRhLm9mZnNldHMucG9wcGVyO1xyXG4gICAgdmFyIHJlZk9mZnNldHMgPSBkYXRhLm9mZnNldHMucmVmZXJlbmNlO1xyXG5cclxuICAgIC8vIHVzaW5nIGZsb29yIGJlY2F1c2UgdGhlIHJlZmVyZW5jZSBvZmZzZXRzIG1heSBjb250YWluIGRlY2ltYWxzIHdlIGFyZSBub3QgZ29pbmcgdG8gY29uc2lkZXIgaGVyZVxyXG4gICAgdmFyIGZsb29yID0gTWF0aC5mbG9vcjtcclxuICAgIHZhciBvdmVybGFwc1JlZiA9IHBsYWNlbWVudCA9PT0gJ2xlZnQnICYmIGZsb29yKHBvcHBlck9mZnNldHMucmlnaHQpID4gZmxvb3IocmVmT2Zmc2V0cy5sZWZ0KSB8fCBwbGFjZW1lbnQgPT09ICdyaWdodCcgJiYgZmxvb3IocG9wcGVyT2Zmc2V0cy5sZWZ0KSA8IGZsb29yKHJlZk9mZnNldHMucmlnaHQpIHx8IHBsYWNlbWVudCA9PT0gJ3RvcCcgJiYgZmxvb3IocG9wcGVyT2Zmc2V0cy5ib3R0b20pID4gZmxvb3IocmVmT2Zmc2V0cy50b3ApIHx8IHBsYWNlbWVudCA9PT0gJ2JvdHRvbScgJiYgZmxvb3IocG9wcGVyT2Zmc2V0cy50b3ApIDwgZmxvb3IocmVmT2Zmc2V0cy5ib3R0b20pO1xyXG5cclxuICAgIHZhciBvdmVyZmxvd3NMZWZ0ID0gZmxvb3IocG9wcGVyT2Zmc2V0cy5sZWZ0KSA8IGZsb29yKGJvdW5kYXJpZXMubGVmdCk7XHJcbiAgICB2YXIgb3ZlcmZsb3dzUmlnaHQgPSBmbG9vcihwb3BwZXJPZmZzZXRzLnJpZ2h0KSA+IGZsb29yKGJvdW5kYXJpZXMucmlnaHQpO1xyXG4gICAgdmFyIG92ZXJmbG93c1RvcCA9IGZsb29yKHBvcHBlck9mZnNldHMudG9wKSA8IGZsb29yKGJvdW5kYXJpZXMudG9wKTtcclxuICAgIHZhciBvdmVyZmxvd3NCb3R0b20gPSBmbG9vcihwb3BwZXJPZmZzZXRzLmJvdHRvbSkgPiBmbG9vcihib3VuZGFyaWVzLmJvdHRvbSk7XHJcblxyXG4gICAgdmFyIG92ZXJmbG93c0JvdW5kYXJpZXMgPSBwbGFjZW1lbnQgPT09ICdsZWZ0JyAmJiBvdmVyZmxvd3NMZWZ0IHx8IHBsYWNlbWVudCA9PT0gJ3JpZ2h0JyAmJiBvdmVyZmxvd3NSaWdodCB8fCBwbGFjZW1lbnQgPT09ICd0b3AnICYmIG92ZXJmbG93c1RvcCB8fCBwbGFjZW1lbnQgPT09ICdib3R0b20nICYmIG92ZXJmbG93c0JvdHRvbTtcclxuXHJcbiAgICAvLyBmbGlwIHRoZSB2YXJpYXRpb24gaWYgcmVxdWlyZWRcclxuICAgIHZhciBpc1ZlcnRpY2FsID0gWyd0b3AnLCAnYm90dG9tJ10uaW5kZXhPZihwbGFjZW1lbnQpICE9PSAtMTtcclxuICAgIHZhciBmbGlwcGVkVmFyaWF0aW9uID0gISFvcHRpb25zLmZsaXBWYXJpYXRpb25zICYmIChpc1ZlcnRpY2FsICYmIHZhcmlhdGlvbiA9PT0gJ3N0YXJ0JyAmJiBvdmVyZmxvd3NMZWZ0IHx8IGlzVmVydGljYWwgJiYgdmFyaWF0aW9uID09PSAnZW5kJyAmJiBvdmVyZmxvd3NSaWdodCB8fCAhaXNWZXJ0aWNhbCAmJiB2YXJpYXRpb24gPT09ICdzdGFydCcgJiYgb3ZlcmZsb3dzVG9wIHx8ICFpc1ZlcnRpY2FsICYmIHZhcmlhdGlvbiA9PT0gJ2VuZCcgJiYgb3ZlcmZsb3dzQm90dG9tKTtcclxuXHJcbiAgICBpZiAob3ZlcmxhcHNSZWYgfHwgb3ZlcmZsb3dzQm91bmRhcmllcyB8fCBmbGlwcGVkVmFyaWF0aW9uKSB7XHJcbiAgICAgIC8vIHRoaXMgYm9vbGVhbiB0byBkZXRlY3QgYW55IGZsaXAgbG9vcFxyXG4gICAgICBkYXRhLmZsaXBwZWQgPSB0cnVlO1xyXG5cclxuICAgICAgaWYgKG92ZXJsYXBzUmVmIHx8IG92ZXJmbG93c0JvdW5kYXJpZXMpIHtcclxuICAgICAgICBwbGFjZW1lbnQgPSBmbGlwT3JkZXJbaW5kZXggKyAxXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZsaXBwZWRWYXJpYXRpb24pIHtcclxuICAgICAgICB2YXJpYXRpb24gPSBnZXRPcHBvc2l0ZVZhcmlhdGlvbih2YXJpYXRpb24pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhLnBsYWNlbWVudCA9IHBsYWNlbWVudCArICh2YXJpYXRpb24gPyAnLScgKyB2YXJpYXRpb24gOiAnJyk7XHJcblxyXG4gICAgICAvLyB0aGlzIG9iamVjdCBjb250YWlucyBgcG9zaXRpb25gLCB3ZSB3YW50IHRvIHByZXNlcnZlIGl0IGFsb25nIHdpdGhcclxuICAgICAgLy8gYW55IGFkZGl0aW9uYWwgcHJvcGVydHkgd2UgbWF5IGFkZCBpbiB0aGUgZnV0dXJlXHJcbiAgICAgIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBfZXh0ZW5kcyQxKHt9LCBkYXRhLm9mZnNldHMucG9wcGVyLCBnZXRQb3BwZXJPZmZzZXRzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLm9mZnNldHMucmVmZXJlbmNlLCBkYXRhLnBsYWNlbWVudCkpO1xyXG5cclxuICAgICAgZGF0YSA9IHJ1bk1vZGlmaWVycyhkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgZGF0YSwgJ2ZsaXAnKTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24ga2VlcFRvZ2V0aGVyKGRhdGEpIHtcclxuICB2YXIgX2RhdGEkb2Zmc2V0cyA9IGRhdGEub2Zmc2V0cyxcclxuICAgICAgcG9wcGVyID0gX2RhdGEkb2Zmc2V0cy5wb3BwZXIsXHJcbiAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlO1xyXG5cclxuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuICB2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xyXG4gIHZhciBpc1ZlcnRpY2FsID0gWyd0b3AnLCAnYm90dG9tJ10uaW5kZXhPZihwbGFjZW1lbnQpICE9PSAtMTtcclxuICB2YXIgc2lkZSA9IGlzVmVydGljYWwgPyAncmlnaHQnIDogJ2JvdHRvbSc7XHJcbiAgdmFyIG9wU2lkZSA9IGlzVmVydGljYWwgPyAnbGVmdCcgOiAndG9wJztcclxuICB2YXIgbWVhc3VyZW1lbnQgPSBpc1ZlcnRpY2FsID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xyXG5cclxuICBpZiAocG9wcGVyW3NpZGVdIDwgZmxvb3IocmVmZXJlbmNlW29wU2lkZV0pKSB7XHJcbiAgICBkYXRhLm9mZnNldHMucG9wcGVyW29wU2lkZV0gPSBmbG9vcihyZWZlcmVuY2Vbb3BTaWRlXSkgLSBwb3BwZXJbbWVhc3VyZW1lbnRdO1xyXG4gIH1cclxuICBpZiAocG9wcGVyW29wU2lkZV0gPiBmbG9vcihyZWZlcmVuY2Vbc2lkZV0pKSB7XHJcbiAgICBkYXRhLm9mZnNldHMucG9wcGVyW29wU2lkZV0gPSBmbG9vcihyZWZlcmVuY2Vbc2lkZV0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyBhIHN0cmluZyBjb250YWluaW5nIHZhbHVlICsgdW5pdCBpbnRvIGEgcHggdmFsdWUgbnVtYmVyXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2Yge21vZGlmaWVyc35vZmZzZXR9XHJcbiAqIEBwcml2YXRlXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBzdHIgLSBWYWx1ZSArIHVuaXQgc3RyaW5nXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBtZWFzdXJlbWVudCAtIGBoZWlnaHRgIG9yIGB3aWR0aGBcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IHBvcHBlck9mZnNldHNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IHJlZmVyZW5jZU9mZnNldHNcclxuICogQHJldHVybnMge051bWJlcnxTdHJpbmd9XHJcbiAqIFZhbHVlIGluIHBpeGVscywgb3Igb3JpZ2luYWwgc3RyaW5nIGlmIG5vIHZhbHVlcyB3ZXJlIGV4dHJhY3RlZFxyXG4gKi9cclxuZnVuY3Rpb24gdG9WYWx1ZShzdHIsIG1lYXN1cmVtZW50LCBwb3BwZXJPZmZzZXRzLCByZWZlcmVuY2VPZmZzZXRzKSB7XHJcbiAgLy8gc2VwYXJhdGUgdmFsdWUgZnJvbSB1bml0XHJcbiAgdmFyIHNwbGl0ID0gc3RyLm1hdGNoKC8oKD86XFwtfFxcKyk/XFxkKlxcLj9cXGQqKSguKikvKTtcclxuICB2YXIgdmFsdWUgPSArc3BsaXRbMV07XHJcbiAgdmFyIHVuaXQgPSBzcGxpdFsyXTtcclxuXHJcbiAgLy8gSWYgaXQncyBub3QgYSBudW1iZXIgaXQncyBhbiBvcGVyYXRvciwgSSBndWVzc1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBzdHI7XHJcbiAgfVxyXG5cclxuICBpZiAodW5pdC5pbmRleE9mKCclJykgPT09IDApIHtcclxuICAgIHZhciBlbGVtZW50ID0gdm9pZCAwO1xyXG4gICAgc3dpdGNoICh1bml0KSB7XHJcbiAgICAgIGNhc2UgJyVwJzpcclxuICAgICAgICBlbGVtZW50ID0gcG9wcGVyT2Zmc2V0cztcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnJSc6XHJcbiAgICAgIGNhc2UgJyVyJzpcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBlbGVtZW50ID0gcmVmZXJlbmNlT2Zmc2V0cztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVjdCA9IGdldENsaWVudFJlY3QoZWxlbWVudCk7XHJcbiAgICByZXR1cm4gcmVjdFttZWFzdXJlbWVudF0gLyAxMDAgKiB2YWx1ZTtcclxuICB9IGVsc2UgaWYgKHVuaXQgPT09ICd2aCcgfHwgdW5pdCA9PT0gJ3Z3Jykge1xyXG4gICAgLy8gaWYgaXMgYSB2aCBvciB2dywgd2UgY2FsY3VsYXRlIHRoZSBzaXplIGJhc2VkIG9uIHRoZSB2aWV3cG9ydFxyXG4gICAgdmFyIHNpemUgPSB2b2lkIDA7XHJcbiAgICBpZiAodW5pdCA9PT0gJ3ZoJykge1xyXG4gICAgICBzaXplID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2l6ZSA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2l6ZSAvIDEwMCAqIHZhbHVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBpZiBpcyBhbiBleHBsaWNpdCBwaXhlbCB1bml0LCB3ZSBnZXQgcmlkIG9mIHRoZSB1bml0IGFuZCBrZWVwIHRoZSB2YWx1ZVxyXG4gICAgLy8gaWYgaXMgYW4gaW1wbGljaXQgdW5pdCwgaXQncyBweCwgYW5kIHdlIHJldHVybiBqdXN0IHRoZSB2YWx1ZVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFBhcnNlIGFuIGBvZmZzZXRgIHN0cmluZyB0byBleHRyYXBvbGF0ZSBgeGAgYW5kIGB5YCBudW1lcmljIG9mZnNldHMuXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2Yge21vZGlmaWVyc35vZmZzZXR9XHJcbiAqIEBwcml2YXRlXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBvZmZzZXRcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IHBvcHBlck9mZnNldHNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IHJlZmVyZW5jZU9mZnNldHNcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IGJhc2VQbGFjZW1lbnRcclxuICogQHJldHVybnMge0FycmF5fSBhIHR3byBjZWxscyBhcnJheSB3aXRoIHggYW5kIHkgb2Zmc2V0cyBpbiBudW1iZXJzXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZU9mZnNldChvZmZzZXQsIHBvcHBlck9mZnNldHMsIHJlZmVyZW5jZU9mZnNldHMsIGJhc2VQbGFjZW1lbnQpIHtcclxuICB2YXIgb2Zmc2V0cyA9IFswLCAwXTtcclxuXHJcbiAgLy8gVXNlIGhlaWdodCBpZiBwbGFjZW1lbnQgaXMgbGVmdCBvciByaWdodCBhbmQgaW5kZXggaXMgMCBvdGhlcndpc2UgdXNlIHdpZHRoXHJcbiAgLy8gaW4gdGhpcyB3YXkgdGhlIGZpcnN0IG9mZnNldCB3aWxsIHVzZSBhbiBheGlzIGFuZCB0aGUgc2Vjb25kIG9uZVxyXG4gIC8vIHdpbGwgdXNlIHRoZSBvdGhlciBvbmVcclxuICB2YXIgdXNlSGVpZ2h0ID0gWydyaWdodCcsICdsZWZ0J10uaW5kZXhPZihiYXNlUGxhY2VtZW50KSAhPT0gLTE7XHJcblxyXG4gIC8vIFNwbGl0IHRoZSBvZmZzZXQgc3RyaW5nIHRvIG9idGFpbiBhIGxpc3Qgb2YgdmFsdWVzIGFuZCBvcGVyYW5kc1xyXG4gIC8vIFRoZSByZWdleCBhZGRyZXNzZXMgdmFsdWVzIHdpdGggdGhlIHBsdXMgb3IgbWludXMgc2lnbiBpbiBmcm9udCAoKzEwLCAtMjAsIGV0YylcclxuICB2YXIgZnJhZ21lbnRzID0gb2Zmc2V0LnNwbGl0KC8oXFwrfFxcLSkvKS5tYXAoZnVuY3Rpb24gKGZyYWcpIHtcclxuICAgIHJldHVybiBmcmFnLnRyaW0oKTtcclxuICB9KTtcclxuXHJcbiAgLy8gRGV0ZWN0IGlmIHRoZSBvZmZzZXQgc3RyaW5nIGNvbnRhaW5zIGEgcGFpciBvZiB2YWx1ZXMgb3IgYSBzaW5nbGUgb25lXHJcbiAgLy8gdGhleSBjb3VsZCBiZSBzZXBhcmF0ZWQgYnkgY29tbWEgb3Igc3BhY2VcclxuICB2YXIgZGl2aWRlciA9IGZyYWdtZW50cy5pbmRleE9mKGZpbmQoZnJhZ21lbnRzLCBmdW5jdGlvbiAoZnJhZykge1xyXG4gICAgcmV0dXJuIGZyYWcuc2VhcmNoKC8sfFxccy8pICE9PSAtMTtcclxuICB9KSk7XHJcblxyXG4gIGlmIChmcmFnbWVudHNbZGl2aWRlcl0gJiYgZnJhZ21lbnRzW2RpdmlkZXJdLmluZGV4T2YoJywnKSA9PT0gLTEpIHtcclxuICAgIGNvbnNvbGUud2FybignT2Zmc2V0cyBzZXBhcmF0ZWQgYnkgd2hpdGUgc3BhY2UocykgYXJlIGRlcHJlY2F0ZWQsIHVzZSBhIGNvbW1hICgsKSBpbnN0ZWFkLicpO1xyXG4gIH1cclxuXHJcbiAgLy8gSWYgZGl2aWRlciBpcyBmb3VuZCwgd2UgZGl2aWRlIHRoZSBsaXN0IG9mIHZhbHVlcyBhbmQgb3BlcmFuZHMgdG8gZGl2aWRlXHJcbiAgLy8gdGhlbSBieSBvZnNldCBYIGFuZCBZLlxyXG4gIHZhciBzcGxpdFJlZ2V4ID0gL1xccyosXFxzKnxcXHMrLztcclxuICB2YXIgb3BzID0gZGl2aWRlciAhPT0gLTEgPyBbZnJhZ21lbnRzLnNsaWNlKDAsIGRpdmlkZXIpLmNvbmNhdChbZnJhZ21lbnRzW2RpdmlkZXJdLnNwbGl0KHNwbGl0UmVnZXgpWzBdXSksIFtmcmFnbWVudHNbZGl2aWRlcl0uc3BsaXQoc3BsaXRSZWdleClbMV1dLmNvbmNhdChmcmFnbWVudHMuc2xpY2UoZGl2aWRlciArIDEpKV0gOiBbZnJhZ21lbnRzXTtcclxuXHJcbiAgLy8gQ29udmVydCB0aGUgdmFsdWVzIHdpdGggdW5pdHMgdG8gYWJzb2x1dGUgcGl4ZWxzIHRvIGFsbG93IG91ciBjb21wdXRhdGlvbnNcclxuICBvcHMgPSBvcHMubWFwKGZ1bmN0aW9uIChvcCwgaW5kZXgpIHtcclxuICAgIC8vIE1vc3Qgb2YgdGhlIHVuaXRzIHJlbHkgb24gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwb3BwZXJcclxuICAgIHZhciBtZWFzdXJlbWVudCA9IChpbmRleCA9PT0gMSA/ICF1c2VIZWlnaHQgOiB1c2VIZWlnaHQpID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xyXG4gICAgdmFyIG1lcmdlV2l0aFByZXZpb3VzID0gZmFsc2U7XHJcbiAgICByZXR1cm4gb3BcclxuICAgIC8vIFRoaXMgYWdncmVnYXRlcyBhbnkgYCtgIG9yIGAtYCBzaWduIHRoYXQgYXJlbid0IGNvbnNpZGVyZWQgb3BlcmF0b3JzXHJcbiAgICAvLyBlLmcuOiAxMCArICs1ID0+IFsxMCwgKywgKzVdXHJcbiAgICAucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIGlmIChhW2EubGVuZ3RoIC0gMV0gPT09ICcnICYmIFsnKycsICctJ10uaW5kZXhPZihiKSAhPT0gLTEpIHtcclxuICAgICAgICBhW2EubGVuZ3RoIC0gMV0gPSBiO1xyXG4gICAgICAgIG1lcmdlV2l0aFByZXZpb3VzID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gYTtcclxuICAgICAgfSBlbHNlIGlmIChtZXJnZVdpdGhQcmV2aW91cykge1xyXG4gICAgICAgIGFbYS5sZW5ndGggLSAxXSArPSBiO1xyXG4gICAgICAgIG1lcmdlV2l0aFByZXZpb3VzID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGEuY29uY2F0KGIpO1xyXG4gICAgICB9XHJcbiAgICB9LCBbXSlcclxuICAgIC8vIEhlcmUgd2UgY29udmVydCB0aGUgc3RyaW5nIHZhbHVlcyBpbnRvIG51bWJlciB2YWx1ZXMgKGluIHB4KVxyXG4gICAgLm1hcChmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICAgIHJldHVybiB0b1ZhbHVlKHN0ciwgbWVhc3VyZW1lbnQsIHBvcHBlck9mZnNldHMsIHJlZmVyZW5jZU9mZnNldHMpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIExvb3AgdHJvdWdoIHRoZSBvZmZzZXRzIGFycmF5cyBhbmQgZXhlY3V0ZSB0aGUgb3BlcmF0aW9uc1xyXG4gIG9wcy5mb3JFYWNoKGZ1bmN0aW9uIChvcCwgaW5kZXgpIHtcclxuICAgIG9wLmZvckVhY2goZnVuY3Rpb24gKGZyYWcsIGluZGV4Mikge1xyXG4gICAgICBpZiAoaXNOdW1lcmljKGZyYWcpKSB7XHJcbiAgICAgICAgb2Zmc2V0c1tpbmRleF0gKz0gZnJhZyAqIChvcFtpbmRleDIgLSAxXSA9PT0gJy0nID8gLTEgOiAxKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIG9mZnNldHM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEBhcmd1bWVudCB7TnVtYmVyfFN0cmluZ30gb3B0aW9ucy5vZmZzZXQ9MFxyXG4gKiBUaGUgb2Zmc2V0IHZhbHVlIGFzIGRlc2NyaWJlZCBpbiB0aGUgbW9kaWZpZXIgZGVzY3JpcHRpb25cclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gb2Zmc2V0KGRhdGEsIF9yZWYpIHtcclxuICB2YXIgb2Zmc2V0ID0gX3JlZi5vZmZzZXQ7XHJcbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50LFxyXG4gICAgICBfZGF0YSRvZmZzZXRzID0gZGF0YS5vZmZzZXRzLFxyXG4gICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcixcclxuICAgICAgcmVmZXJlbmNlID0gX2RhdGEkb2Zmc2V0cy5yZWZlcmVuY2U7XHJcblxyXG4gIHZhciBiYXNlUGxhY2VtZW50ID0gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcblxyXG4gIHZhciBvZmZzZXRzID0gdm9pZCAwO1xyXG4gIGlmIChpc051bWVyaWMoK29mZnNldCkpIHtcclxuICAgIG9mZnNldHMgPSBbK29mZnNldCwgMF07XHJcbiAgfSBlbHNlIHtcclxuICAgIG9mZnNldHMgPSBwYXJzZU9mZnNldChvZmZzZXQsIHBvcHBlciwgcmVmZXJlbmNlLCBiYXNlUGxhY2VtZW50KTtcclxuICB9XHJcblxyXG4gIGlmIChiYXNlUGxhY2VtZW50ID09PSAnbGVmdCcpIHtcclxuICAgIHBvcHBlci50b3AgKz0gb2Zmc2V0c1swXTtcclxuICAgIHBvcHBlci5sZWZ0IC09IG9mZnNldHNbMV07XHJcbiAgfSBlbHNlIGlmIChiYXNlUGxhY2VtZW50ID09PSAncmlnaHQnKSB7XHJcbiAgICBwb3BwZXIudG9wICs9IG9mZnNldHNbMF07XHJcbiAgICBwb3BwZXIubGVmdCArPSBvZmZzZXRzWzFdO1xyXG4gIH0gZWxzZSBpZiAoYmFzZVBsYWNlbWVudCA9PT0gJ3RvcCcpIHtcclxuICAgIHBvcHBlci5sZWZ0ICs9IG9mZnNldHNbMF07XHJcbiAgICBwb3BwZXIudG9wIC09IG9mZnNldHNbMV07XHJcbiAgfSBlbHNlIGlmIChiYXNlUGxhY2VtZW50ID09PSAnYm90dG9tJykge1xyXG4gICAgcG9wcGVyLmxlZnQgKz0gb2Zmc2V0c1swXTtcclxuICAgIHBvcHBlci50b3AgKz0gb2Zmc2V0c1sxXTtcclxuICB9XHJcblxyXG4gIGRhdGEucG9wcGVyID0gcG9wcGVyO1xyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIHByZXZlbnRPdmVyZmxvdyhkYXRhLCBvcHRpb25zKSB7XHJcbiAgdmFyIGJvdW5kYXJpZXNFbGVtZW50ID0gb3B0aW9ucy5ib3VuZGFyaWVzRWxlbWVudCB8fCBnZXRPZmZzZXRQYXJlbnQoZGF0YS5pbnN0YW5jZS5wb3BwZXIpO1xyXG5cclxuICAvLyBJZiBvZmZzZXRQYXJlbnQgaXMgdGhlIHJlZmVyZW5jZSBlbGVtZW50LCB3ZSByZWFsbHkgd2FudCB0b1xyXG4gIC8vIGdvIG9uZSBzdGVwIHVwIGFuZCB1c2UgdGhlIG5leHQgb2Zmc2V0UGFyZW50IGFzIHJlZmVyZW5jZSB0b1xyXG4gIC8vIGF2b2lkIHRvIG1ha2UgdGhpcyBtb2RpZmllciBjb21wbGV0ZWx5IHVzZWxlc3MgYW5kIGxvb2sgbGlrZSBicm9rZW5cclxuICBpZiAoZGF0YS5pbnN0YW5jZS5yZWZlcmVuY2UgPT09IGJvdW5kYXJpZXNFbGVtZW50KSB7XHJcbiAgICBib3VuZGFyaWVzRWxlbWVudCA9IGdldE9mZnNldFBhcmVudChib3VuZGFyaWVzRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICAvLyBOT1RFOiBET00gYWNjZXNzIGhlcmVcclxuICAvLyByZXNldHMgdGhlIHBvcHBlcidzIHBvc2l0aW9uIHNvIHRoYXQgdGhlIGRvY3VtZW50IHNpemUgY2FuIGJlIGNhbGN1bGF0ZWQgZXhjbHVkaW5nXHJcbiAgLy8gdGhlIHNpemUgb2YgdGhlIHBvcHBlciBlbGVtZW50IGl0c2VsZlxyXG4gIHZhciB0cmFuc2Zvcm1Qcm9wID0gZ2V0U3VwcG9ydGVkUHJvcGVydHlOYW1lKCd0cmFuc2Zvcm0nKTtcclxuICB2YXIgcG9wcGVyU3R5bGVzID0gZGF0YS5pbnN0YW5jZS5wb3BwZXIuc3R5bGU7IC8vIGFzc2lnbm1lbnQgdG8gaGVscCBtaW5pZmljYXRpb25cclxuICB2YXIgdG9wID0gcG9wcGVyU3R5bGVzLnRvcCxcclxuICAgICAgbGVmdCA9IHBvcHBlclN0eWxlcy5sZWZ0LFxyXG4gICAgICB0cmFuc2Zvcm0gPSBwb3BwZXJTdHlsZXNbdHJhbnNmb3JtUHJvcF07XHJcblxyXG4gIHBvcHBlclN0eWxlcy50b3AgPSAnJztcclxuICBwb3BwZXJTdHlsZXMubGVmdCA9ICcnO1xyXG4gIHBvcHBlclN0eWxlc1t0cmFuc2Zvcm1Qcm9wXSA9ICcnO1xyXG5cclxuICB2YXIgYm91bmRhcmllcyA9IGdldEJvdW5kYXJpZXMoZGF0YS5pbnN0YW5jZS5wb3BwZXIsIGRhdGEuaW5zdGFuY2UucmVmZXJlbmNlLCBvcHRpb25zLnBhZGRpbmcsIGJvdW5kYXJpZXNFbGVtZW50LCBkYXRhLnBvc2l0aW9uRml4ZWQpO1xyXG5cclxuICAvLyBOT1RFOiBET00gYWNjZXNzIGhlcmVcclxuICAvLyByZXN0b3JlcyB0aGUgb3JpZ2luYWwgc3R5bGUgcHJvcGVydGllcyBhZnRlciB0aGUgb2Zmc2V0cyBoYXZlIGJlZW4gY29tcHV0ZWRcclxuICBwb3BwZXJTdHlsZXMudG9wID0gdG9wO1xyXG4gIHBvcHBlclN0eWxlcy5sZWZ0ID0gbGVmdDtcclxuICBwb3BwZXJTdHlsZXNbdHJhbnNmb3JtUHJvcF0gPSB0cmFuc2Zvcm07XHJcblxyXG4gIG9wdGlvbnMuYm91bmRhcmllcyA9IGJvdW5kYXJpZXM7XHJcblxyXG4gIHZhciBvcmRlciA9IG9wdGlvbnMucHJpb3JpdHk7XHJcbiAgdmFyIHBvcHBlciA9IGRhdGEub2Zmc2V0cy5wb3BwZXI7XHJcblxyXG4gIHZhciBjaGVjayA9IHtcclxuICAgIHByaW1hcnk6IGZ1bmN0aW9uIHByaW1hcnkocGxhY2VtZW50KSB7XHJcbiAgICAgIHZhciB2YWx1ZSA9IHBvcHBlcltwbGFjZW1lbnRdO1xyXG4gICAgICBpZiAocG9wcGVyW3BsYWNlbWVudF0gPCBib3VuZGFyaWVzW3BsYWNlbWVudF0gJiYgIW9wdGlvbnMuZXNjYXBlV2l0aFJlZmVyZW5jZSkge1xyXG4gICAgICAgIHZhbHVlID0gTWF0aC5tYXgocG9wcGVyW3BsYWNlbWVudF0sIGJvdW5kYXJpZXNbcGxhY2VtZW50XSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5JDEoe30sIHBsYWNlbWVudCwgdmFsdWUpO1xyXG4gICAgfSxcclxuICAgIHNlY29uZGFyeTogZnVuY3Rpb24gc2Vjb25kYXJ5KHBsYWNlbWVudCkge1xyXG4gICAgICB2YXIgbWFpblNpZGUgPSBwbGFjZW1lbnQgPT09ICdyaWdodCcgPyAnbGVmdCcgOiAndG9wJztcclxuICAgICAgdmFyIHZhbHVlID0gcG9wcGVyW21haW5TaWRlXTtcclxuICAgICAgaWYgKHBvcHBlcltwbGFjZW1lbnRdID4gYm91bmRhcmllc1twbGFjZW1lbnRdICYmICFvcHRpb25zLmVzY2FwZVdpdGhSZWZlcmVuY2UpIHtcclxuICAgICAgICB2YWx1ZSA9IE1hdGgubWluKHBvcHBlclttYWluU2lkZV0sIGJvdW5kYXJpZXNbcGxhY2VtZW50XSAtIChwbGFjZW1lbnQgPT09ICdyaWdodCcgPyBwb3BwZXIud2lkdGggOiBwb3BwZXIuaGVpZ2h0KSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5JDEoe30sIG1haW5TaWRlLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgb3JkZXIuZm9yRWFjaChmdW5jdGlvbiAocGxhY2VtZW50KSB7XHJcbiAgICB2YXIgc2lkZSA9IFsnbGVmdCcsICd0b3AnXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xID8gJ3ByaW1hcnknIDogJ3NlY29uZGFyeSc7XHJcbiAgICBwb3BwZXIgPSBfZXh0ZW5kcyQxKHt9LCBwb3BwZXIsIGNoZWNrW3NpZGVdKHBsYWNlbWVudCkpO1xyXG4gIH0pO1xyXG5cclxuICBkYXRhLm9mZnNldHMucG9wcGVyID0gcG9wcGVyO1xyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBgdXBkYXRlYCBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBzaGlmdChkYXRhKSB7XHJcbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50O1xyXG4gIHZhciBiYXNlUGxhY2VtZW50ID0gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcbiAgdmFyIHNoaWZ0dmFyaWF0aW9uID0gcGxhY2VtZW50LnNwbGl0KCctJylbMV07XHJcblxyXG4gIC8vIGlmIHNoaWZ0IHNoaWZ0dmFyaWF0aW9uIGlzIHNwZWNpZmllZCwgcnVuIHRoZSBtb2RpZmllclxyXG4gIGlmIChzaGlmdHZhcmlhdGlvbikge1xyXG4gICAgdmFyIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXHJcbiAgICAgICAgcmVmZXJlbmNlID0gX2RhdGEkb2Zmc2V0cy5yZWZlcmVuY2UsXHJcbiAgICAgICAgcG9wcGVyID0gX2RhdGEkb2Zmc2V0cy5wb3BwZXI7XHJcblxyXG4gICAgdmFyIGlzVmVydGljYWwgPSBbJ2JvdHRvbScsICd0b3AnXS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpICE9PSAtMTtcclxuICAgIHZhciBzaWRlID0gaXNWZXJ0aWNhbCA/ICdsZWZ0JyA6ICd0b3AnO1xyXG4gICAgdmFyIG1lYXN1cmVtZW50ID0gaXNWZXJ0aWNhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcclxuXHJcbiAgICB2YXIgc2hpZnRPZmZzZXRzID0ge1xyXG4gICAgICBzdGFydDogZGVmaW5lUHJvcGVydHkkMSh7fSwgc2lkZSwgcmVmZXJlbmNlW3NpZGVdKSxcclxuICAgICAgZW5kOiBkZWZpbmVQcm9wZXJ0eSQxKHt9LCBzaWRlLCByZWZlcmVuY2Vbc2lkZV0gKyByZWZlcmVuY2VbbWVhc3VyZW1lbnRdIC0gcG9wcGVyW21lYXN1cmVtZW50XSlcclxuICAgIH07XHJcblxyXG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IF9leHRlbmRzJDEoe30sIHBvcHBlciwgc2hpZnRPZmZzZXRzW3NoaWZ0dmFyaWF0aW9uXSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gaGlkZShkYXRhKSB7XHJcbiAgaWYgKCFpc01vZGlmaWVyUmVxdWlyZWQoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsICdoaWRlJywgJ3ByZXZlbnRPdmVyZmxvdycpKSB7XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHZhciByZWZSZWN0ID0gZGF0YS5vZmZzZXRzLnJlZmVyZW5jZTtcclxuICB2YXIgYm91bmQgPSBmaW5kKGRhdGEuaW5zdGFuY2UubW9kaWZpZXJzLCBmdW5jdGlvbiAobW9kaWZpZXIpIHtcclxuICAgIHJldHVybiBtb2RpZmllci5uYW1lID09PSAncHJldmVudE92ZXJmbG93JztcclxuICB9KS5ib3VuZGFyaWVzO1xyXG5cclxuICBpZiAocmVmUmVjdC5ib3R0b20gPCBib3VuZC50b3AgfHwgcmVmUmVjdC5sZWZ0ID4gYm91bmQucmlnaHQgfHwgcmVmUmVjdC50b3AgPiBib3VuZC5ib3R0b20gfHwgcmVmUmVjdC5yaWdodCA8IGJvdW5kLmxlZnQpIHtcclxuICAgIC8vIEF2b2lkIHVubmVjZXNzYXJ5IERPTSBhY2Nlc3MgaWYgdmlzaWJpbGl0eSBoYXNuJ3QgY2hhbmdlZFxyXG4gICAgaWYgKGRhdGEuaGlkZSA9PT0gdHJ1ZSkge1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhLmhpZGUgPSB0cnVlO1xyXG4gICAgZGF0YS5hdHRyaWJ1dGVzWyd4LW91dC1vZi1ib3VuZGFyaWVzJ10gPSAnJztcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gQXZvaWQgdW5uZWNlc3NhcnkgRE9NIGFjY2VzcyBpZiB2aXNpYmlsaXR5IGhhc24ndCBjaGFuZ2VkXHJcbiAgICBpZiAoZGF0YS5oaWRlID09PSBmYWxzZSkge1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhLmhpZGUgPSBmYWxzZTtcclxuICAgIGRhdGEuYXR0cmlidXRlc1sneC1vdXQtb2YtYm91bmRhcmllcyddID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBgdXBkYXRlYCBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBpbm5lcihkYXRhKSB7XHJcbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50O1xyXG4gIHZhciBiYXNlUGxhY2VtZW50ID0gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcbiAgdmFyIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXHJcbiAgICAgIHBvcHBlciA9IF9kYXRhJG9mZnNldHMucG9wcGVyLFxyXG4gICAgICByZWZlcmVuY2UgPSBfZGF0YSRvZmZzZXRzLnJlZmVyZW5jZTtcclxuXHJcbiAgdmFyIGlzSG9yaXogPSBbJ2xlZnQnLCAncmlnaHQnXS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpICE9PSAtMTtcclxuXHJcbiAgdmFyIHN1YnRyYWN0TGVuZ3RoID0gWyd0b3AnLCAnbGVmdCddLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPT09IC0xO1xyXG5cclxuICBwb3BwZXJbaXNIb3JpeiA/ICdsZWZ0JyA6ICd0b3AnXSA9IHJlZmVyZW5jZVtiYXNlUGxhY2VtZW50XSAtIChzdWJ0cmFjdExlbmd0aCA/IHBvcHBlcltpc0hvcml6ID8gJ3dpZHRoJyA6ICdoZWlnaHQnXSA6IDApO1xyXG5cclxuICBkYXRhLnBsYWNlbWVudCA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XHJcbiAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IGdldENsaWVudFJlY3QocG9wcGVyKTtcclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNb2RpZmllciBmdW5jdGlvbiwgZWFjaCBtb2RpZmllciBjYW4gaGF2ZSBhIGZ1bmN0aW9uIG9mIHRoaXMgdHlwZSBhc3NpZ25lZFxyXG4gKiB0byBpdHMgYGZuYCBwcm9wZXJ0eS48YnIgLz5cclxuICogVGhlc2UgZnVuY3Rpb25zIHdpbGwgYmUgY2FsbGVkIG9uIGVhY2ggdXBkYXRlLCB0aGlzIG1lYW5zIHRoYXQgeW91IG11c3RcclxuICogbWFrZSBzdXJlIHRoZXkgYXJlIHBlcmZvcm1hbnQgZW5vdWdoIHRvIGF2b2lkIHBlcmZvcm1hbmNlIGJvdHRsZW5lY2tzLlxyXG4gKlxyXG4gKiBAZnVuY3Rpb24gTW9kaWZpZXJGblxyXG4gKiBAYXJndW1lbnQge2RhdGFPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtkYXRhT2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIE1vZGlmaWVycyBhcmUgcGx1Z2lucyB1c2VkIHRvIGFsdGVyIHRoZSBiZWhhdmlvciBvZiB5b3VyIHBvcHBlcnMuPGJyIC8+XHJcbiAqIFBvcHBlci5qcyB1c2VzIGEgc2V0IG9mIDkgbW9kaWZpZXJzIHRvIHByb3ZpZGUgYWxsIHRoZSBiYXNpYyBmdW5jdGlvbmFsaXRpZXNcclxuICogbmVlZGVkIGJ5IHRoZSBsaWJyYXJ5LlxyXG4gKlxyXG4gKiBVc3VhbGx5IHlvdSBkb24ndCB3YW50IHRvIG92ZXJyaWRlIHRoZSBgb3JkZXJgLCBgZm5gIGFuZCBgb25Mb2FkYCBwcm9wcy5cclxuICogQWxsIHRoZSBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb25maWd1cmF0aW9ucyB0aGF0IGNvdWxkIGJlIHR3ZWFrZWQuXHJcbiAqIEBuYW1lc3BhY2UgbW9kaWZpZXJzXHJcbiAqL1xyXG52YXIgbW9kaWZpZXJzID0ge1xyXG4gIC8qKlxyXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gc2hpZnQgdGhlIHBvcHBlciBvbiB0aGUgc3RhcnQgb3IgZW5kIG9mIGl0cyByZWZlcmVuY2VcclxuICAgKiBlbGVtZW50LjxiciAvPlxyXG4gICAqIEl0IHdpbGwgcmVhZCB0aGUgdmFyaWF0aW9uIG9mIHRoZSBgcGxhY2VtZW50YCBwcm9wZXJ0eS48YnIgLz5cclxuICAgKiBJdCBjYW4gYmUgb25lIGVpdGhlciBgLWVuZGAgb3IgYC1zdGFydGAuXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIHNoaWZ0OiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9MTAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDEwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogc2hpZnRcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBUaGUgYG9mZnNldGAgbW9kaWZpZXIgY2FuIHNoaWZ0IHlvdXIgcG9wcGVyIG9uIGJvdGggaXRzIGF4aXMuXHJcbiAgICpcclxuICAgKiBJdCBhY2NlcHRzIHRoZSBmb2xsb3dpbmcgdW5pdHM6XHJcbiAgICogLSBgcHhgIG9yIHVuaXRsZXNzLCBpbnRlcnByZXRlZCBhcyBwaXhlbHNcclxuICAgKiAtIGAlYCBvciBgJXJgLCBwZXJjZW50YWdlIHJlbGF0aXZlIHRvIHRoZSBsZW5ndGggb2YgdGhlIHJlZmVyZW5jZSBlbGVtZW50XHJcbiAgICogLSBgJXBgLCBwZXJjZW50YWdlIHJlbGF0aXZlIHRvIHRoZSBsZW5ndGggb2YgdGhlIHBvcHBlciBlbGVtZW50XHJcbiAgICogLSBgdndgLCBDU1Mgdmlld3BvcnQgd2lkdGggdW5pdFxyXG4gICAqIC0gYHZoYCwgQ1NTIHZpZXdwb3J0IGhlaWdodCB1bml0XHJcbiAgICpcclxuICAgKiBGb3IgbGVuZ3RoIGlzIGludGVuZGVkIHRoZSBtYWluIGF4aXMgcmVsYXRpdmUgdG8gdGhlIHBsYWNlbWVudCBvZiB0aGUgcG9wcGVyLjxiciAvPlxyXG4gICAqIFRoaXMgbWVhbnMgdGhhdCBpZiB0aGUgcGxhY2VtZW50IGlzIGB0b3BgIG9yIGBib3R0b21gLCB0aGUgbGVuZ3RoIHdpbGwgYmUgdGhlXHJcbiAgICogYHdpZHRoYC4gSW4gY2FzZSBvZiBgbGVmdGAgb3IgYHJpZ2h0YCwgaXQgd2lsbCBiZSB0aGUgaGVpZ2h0LlxyXG4gICAqXHJcbiAgICogWW91IGNhbiBwcm92aWRlIGEgc2luZ2xlIHZhbHVlIChhcyBgTnVtYmVyYCBvciBgU3RyaW5nYCksIG9yIGEgcGFpciBvZiB2YWx1ZXNcclxuICAgKiBhcyBgU3RyaW5nYCBkaXZpZGVkIGJ5IGEgY29tbWEgb3Igb25lIChvciBtb3JlKSB3aGl0ZSBzcGFjZXMuPGJyIC8+XHJcbiAgICogVGhlIGxhdHRlciBpcyBhIGRlcHJlY2F0ZWQgbWV0aG9kIGJlY2F1c2UgaXQgbGVhZHMgdG8gY29uZnVzaW9uIGFuZCB3aWxsIGJlXHJcbiAgICogcmVtb3ZlZCBpbiB2Mi48YnIgLz5cclxuICAgKiBBZGRpdGlvbmFsbHksIGl0IGFjY2VwdHMgYWRkaXRpb25zIGFuZCBzdWJ0cmFjdGlvbnMgYmV0d2VlbiBkaWZmZXJlbnQgdW5pdHMuXHJcbiAgICogTm90ZSB0aGF0IG11bHRpcGxpY2F0aW9ucyBhbmQgZGl2aXNpb25zIGFyZW4ndCBzdXBwb3J0ZWQuXHJcbiAgICpcclxuICAgKiBWYWxpZCBleGFtcGxlcyBhcmU6XHJcbiAgICogYGBgXHJcbiAgICogMTBcclxuICAgKiAnMTAlJ1xyXG4gICAqICcxMCwgMTAnXHJcbiAgICogJzEwJSwgMTAnXHJcbiAgICogJzEwICsgMTAlJ1xyXG4gICAqICcxMCAtIDV2aCArIDMlJ1xyXG4gICAqICctMTBweCArIDV2aCwgNXB4IC0gNiUnXHJcbiAgICogYGBgXHJcbiAgICogPiAqKk5CKio6IElmIHlvdSBkZXNpcmUgdG8gYXBwbHkgb2Zmc2V0cyB0byB5b3VyIHBvcHBlcnMgaW4gYSB3YXkgdGhhdCBtYXkgbWFrZSB0aGVtIG92ZXJsYXBcclxuICAgKiA+IHdpdGggdGhlaXIgcmVmZXJlbmNlIGVsZW1lbnQsIHVuZm9ydHVuYXRlbHksIHlvdSB3aWxsIGhhdmUgdG8gZGlzYWJsZSB0aGUgYGZsaXBgIG1vZGlmaWVyLlxyXG4gICAqID4gTW9yZSBvbiB0aGlzIFtyZWFkaW5nIHRoaXMgaXNzdWVdKGh0dHBzOi8vZ2l0aHViLmNvbS9GZXpWcmFzdGEvcG9wcGVyLmpzL2lzc3Vlcy8zNzMpXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgb2Zmc2V0OiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9MjAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDIwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogb2Zmc2V0LFxyXG4gICAgLyoqIEBwcm9wIHtOdW1iZXJ8U3RyaW5nfSBvZmZzZXQ9MFxyXG4gICAgICogVGhlIG9mZnNldCB2YWx1ZSBhcyBkZXNjcmliZWQgaW4gdGhlIG1vZGlmaWVyIGRlc2NyaXB0aW9uXHJcbiAgICAgKi9cclxuICAgIG9mZnNldDogMFxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gcHJldmVudCB0aGUgcG9wcGVyIGZyb20gYmVpbmcgcG9zaXRpb25lZCBvdXRzaWRlIHRoZSBib3VuZGFyeS5cclxuICAgKlxyXG4gICAqIEFuIHNjZW5hcmlvIGV4aXN0cyB3aGVyZSB0aGUgcmVmZXJlbmNlIGl0c2VsZiBpcyBub3Qgd2l0aGluIHRoZSBib3VuZGFyaWVzLjxiciAvPlxyXG4gICAqIFdlIGNhbiBzYXkgaXQgaGFzIFwiZXNjYXBlZCB0aGUgYm91bmRhcmllc1wiIOKAlCBvciBqdXN0IFwiZXNjYXBlZFwiLjxiciAvPlxyXG4gICAqIEluIHRoaXMgY2FzZSB3ZSBuZWVkIHRvIGRlY2lkZSB3aGV0aGVyIHRoZSBwb3BwZXIgc2hvdWxkIGVpdGhlcjpcclxuICAgKlxyXG4gICAqIC0gZGV0YWNoIGZyb20gdGhlIHJlZmVyZW5jZSBhbmQgcmVtYWluIFwidHJhcHBlZFwiIGluIHRoZSBib3VuZGFyaWVzLCBvclxyXG4gICAqIC0gaWYgaXQgc2hvdWxkIGlnbm9yZSB0aGUgYm91bmRhcnkgYW5kIFwiZXNjYXBlIHdpdGggaXRzIHJlZmVyZW5jZVwiXHJcbiAgICpcclxuICAgKiBXaGVuIGBlc2NhcGVXaXRoUmVmZXJlbmNlYCBpcyBzZXQgdG9gdHJ1ZWAgYW5kIHJlZmVyZW5jZSBpcyBjb21wbGV0ZWx5XHJcbiAgICogb3V0c2lkZSBpdHMgYm91bmRhcmllcywgdGhlIHBvcHBlciB3aWxsIG92ZXJmbG93IChvciBjb21wbGV0ZWx5IGxlYXZlKVxyXG4gICAqIHRoZSBib3VuZGFyaWVzIGluIG9yZGVyIHRvIHJlbWFpbiBhdHRhY2hlZCB0byB0aGUgZWRnZSBvZiB0aGUgcmVmZXJlbmNlLlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIHByZXZlbnRPdmVyZmxvdzoge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTMwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiAzMDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IHByZXZlbnRPdmVyZmxvdyxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age0FycmF5fSBbcHJpb3JpdHk9WydsZWZ0JywncmlnaHQnLCd0b3AnLCdib3R0b20nXV1cclxuICAgICAqIFBvcHBlciB3aWxsIHRyeSB0byBwcmV2ZW50IG92ZXJmbG93IGZvbGxvd2luZyB0aGVzZSBwcmlvcml0aWVzIGJ5IGRlZmF1bHQsXHJcbiAgICAgKiB0aGVuLCBpdCBjb3VsZCBvdmVyZmxvdyBvbiB0aGUgbGVmdCBhbmQgb24gdG9wIG9mIHRoZSBgYm91bmRhcmllc0VsZW1lbnRgXHJcbiAgICAgKi9cclxuICAgIHByaW9yaXR5OiBbJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbSddLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7bnVtYmVyfSBwYWRkaW5nPTVcclxuICAgICAqIEFtb3VudCBvZiBwaXhlbCB1c2VkIHRvIGRlZmluZSBhIG1pbmltdW0gZGlzdGFuY2UgYmV0d2VlbiB0aGUgYm91bmRhcmllc1xyXG4gICAgICogYW5kIHRoZSBwb3BwZXIgdGhpcyBtYWtlcyBzdXJlIHRoZSBwb3BwZXIgaGFzIGFsd2F5cyBhIGxpdHRsZSBwYWRkaW5nXHJcbiAgICAgKiBiZXR3ZWVuIHRoZSBlZGdlcyBvZiBpdHMgY29udGFpbmVyXHJcbiAgICAgKi9cclxuICAgIHBhZGRpbmc6IDUsXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtTdHJpbmd8SFRNTEVsZW1lbnR9IGJvdW5kYXJpZXNFbGVtZW50PSdzY3JvbGxQYXJlbnQnXHJcbiAgICAgKiBCb3VuZGFyaWVzIHVzZWQgYnkgdGhlIG1vZGlmaWVyLCBjYW4gYmUgYHNjcm9sbFBhcmVudGAsIGB3aW5kb3dgLFxyXG4gICAgICogYHZpZXdwb3J0YCBvciBhbnkgRE9NIGVsZW1lbnQuXHJcbiAgICAgKi9cclxuICAgIGJvdW5kYXJpZXNFbGVtZW50OiAnc2Nyb2xsUGFyZW50J1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gbWFrZSBzdXJlIHRoZSByZWZlcmVuY2UgYW5kIGl0cyBwb3BwZXIgc3RheSBuZWFyIGVhY2hvdGhlcnNcclxuICAgKiB3aXRob3V0IGxlYXZpbmcgYW55IGdhcCBiZXR3ZWVuIHRoZSB0d28uIEV4cGVjaWFsbHkgdXNlZnVsIHdoZW4gdGhlIGFycm93IGlzXHJcbiAgICogZW5hYmxlZCBhbmQgeW91IHdhbnQgdG8gYXNzdXJlIGl0IHRvIHBvaW50IHRvIGl0cyByZWZlcmVuY2UgZWxlbWVudC5cclxuICAgKiBJdCBjYXJlcyBvbmx5IGFib3V0IHRoZSBmaXJzdCBheGlzLCB5b3UgY2FuIHN0aWxsIGhhdmUgcG9wcGVycyB3aXRoIG1hcmdpblxyXG4gICAqIGJldHdlZW4gdGhlIHBvcHBlciBhbmQgaXRzIHJlZmVyZW5jZSBlbGVtZW50LlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBrZWVwVG9nZXRoZXI6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj00MDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogNDAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBrZWVwVG9nZXRoZXJcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBUaGlzIG1vZGlmaWVyIGlzIHVzZWQgdG8gbW92ZSB0aGUgYGFycm93RWxlbWVudGAgb2YgdGhlIHBvcHBlciB0byBtYWtlXHJcbiAgICogc3VyZSBpdCBpcyBwb3NpdGlvbmVkIGJldHdlZW4gdGhlIHJlZmVyZW5jZSBlbGVtZW50IGFuZCBpdHMgcG9wcGVyIGVsZW1lbnQuXHJcbiAgICogSXQgd2lsbCByZWFkIHRoZSBvdXRlciBzaXplIG9mIHRoZSBgYXJyb3dFbGVtZW50YCBub2RlIHRvIGRldGVjdCBob3cgbWFueVxyXG4gICAqIHBpeGVscyBvZiBjb25qdWN0aW9uIGFyZSBuZWVkZWQuXHJcbiAgICpcclxuICAgKiBJdCBoYXMgbm8gZWZmZWN0IGlmIG5vIGBhcnJvd0VsZW1lbnRgIGlzIHByb3ZpZGVkLlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBhcnJvdzoge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTUwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiA1MDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IGFycm93LFxyXG4gICAgLyoqIEBwcm9wIHtTdHJpbmd8SFRNTEVsZW1lbnR9IGVsZW1lbnQ9J1t4LWFycm93XScgLSBTZWxlY3RvciBvciBub2RlIHVzZWQgYXMgYXJyb3cgKi9cclxuICAgIGVsZW1lbnQ6ICdbeC1hcnJvd10nXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogTW9kaWZpZXIgdXNlZCB0byBmbGlwIHRoZSBwb3BwZXIncyBwbGFjZW1lbnQgd2hlbiBpdCBzdGFydHMgdG8gb3ZlcmxhcCBpdHNcclxuICAgKiByZWZlcmVuY2UgZWxlbWVudC5cclxuICAgKlxyXG4gICAqIFJlcXVpcmVzIHRoZSBgcHJldmVudE92ZXJmbG93YCBtb2RpZmllciBiZWZvcmUgaXQgaW4gb3JkZXIgdG8gd29yay5cclxuICAgKlxyXG4gICAqICoqTk9URToqKiB0aGlzIG1vZGlmaWVyIHdpbGwgaW50ZXJydXB0IHRoZSBjdXJyZW50IHVwZGF0ZSBjeWNsZSBhbmQgd2lsbFxyXG4gICAqIHJlc3RhcnQgaXQgaWYgaXQgZGV0ZWN0cyB0aGUgbmVlZCB0byBmbGlwIHRoZSBwbGFjZW1lbnQuXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIGZsaXA6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj02MDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogNjAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBmbGlwLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7U3RyaW5nfEFycmF5fSBiZWhhdmlvcj0nZmxpcCdcclxuICAgICAqIFRoZSBiZWhhdmlvciB1c2VkIHRvIGNoYW5nZSB0aGUgcG9wcGVyJ3MgcGxhY2VtZW50LiBJdCBjYW4gYmUgb25lIG9mXHJcbiAgICAgKiBgZmxpcGAsIGBjbG9ja3dpc2VgLCBgY291bnRlcmNsb2Nrd2lzZWAgb3IgYW4gYXJyYXkgd2l0aCBhIGxpc3Qgb2YgdmFsaWRcclxuICAgICAqIHBsYWNlbWVudHMgKHdpdGggb3B0aW9uYWwgdmFyaWF0aW9ucykuXHJcbiAgICAgKi9cclxuICAgIGJlaGF2aW9yOiAnZmxpcCcsXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtudW1iZXJ9IHBhZGRpbmc9NVxyXG4gICAgICogVGhlIHBvcHBlciB3aWxsIGZsaXAgaWYgaXQgaGl0cyB0aGUgZWRnZXMgb2YgdGhlIGBib3VuZGFyaWVzRWxlbWVudGBcclxuICAgICAqL1xyXG4gICAgcGFkZGluZzogNSxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age1N0cmluZ3xIVE1MRWxlbWVudH0gYm91bmRhcmllc0VsZW1lbnQ9J3ZpZXdwb3J0J1xyXG4gICAgICogVGhlIGVsZW1lbnQgd2hpY2ggd2lsbCBkZWZpbmUgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIHBvcHBlciBwb3NpdGlvbixcclxuICAgICAqIHRoZSBwb3BwZXIgd2lsbCBuZXZlciBiZSBwbGFjZWQgb3V0c2lkZSBvZiB0aGUgZGVmaW5lZCBib3VuZGFyaWVzXHJcbiAgICAgKiAoZXhjZXB0IGlmIGtlZXBUb2dldGhlciBpcyBlbmFibGVkKVxyXG4gICAgICovXHJcbiAgICBib3VuZGFyaWVzRWxlbWVudDogJ3ZpZXdwb3J0J1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gbWFrZSB0aGUgcG9wcGVyIGZsb3cgdG93YXJkIHRoZSBpbm5lciBvZiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQuXHJcbiAgICogQnkgZGVmYXVsdCwgd2hlbiB0aGlzIG1vZGlmaWVyIGlzIGRpc2FibGVkLCB0aGUgcG9wcGVyIHdpbGwgYmUgcGxhY2VkIG91dHNpZGVcclxuICAgKiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQuXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIGlubmVyOiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9NzAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDcwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD1mYWxzZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiBmYWxzZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBpbm5lclxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gaGlkZSB0aGUgcG9wcGVyIHdoZW4gaXRzIHJlZmVyZW5jZSBlbGVtZW50IGlzIG91dHNpZGUgb2YgdGhlXHJcbiAgICogcG9wcGVyIGJvdW5kYXJpZXMuIEl0IHdpbGwgc2V0IGEgYHgtb3V0LW9mLWJvdW5kYXJpZXNgIGF0dHJpYnV0ZSB3aGljaCBjYW5cclxuICAgKiBiZSB1c2VkIHRvIGhpZGUgd2l0aCBhIENTUyBzZWxlY3RvciB0aGUgcG9wcGVyIHdoZW4gaXRzIHJlZmVyZW5jZSBpc1xyXG4gICAqIG91dCBvZiBib3VuZGFyaWVzLlxyXG4gICAqXHJcbiAgICogUmVxdWlyZXMgdGhlIGBwcmV2ZW50T3ZlcmZsb3dgIG1vZGlmaWVyIGJlZm9yZSBpdCBpbiBvcmRlciB0byB3b3JrLlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBoaWRlOiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9ODAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDgwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogaGlkZVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIENvbXB1dGVzIHRoZSBzdHlsZSB0aGF0IHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyIGVsZW1lbnQgdG8gZ2V0c1xyXG4gICAqIHByb3Blcmx5IHBvc2l0aW9uZWQuXHJcbiAgICpcclxuICAgKiBOb3RlIHRoYXQgdGhpcyBtb2RpZmllciB3aWxsIG5vdCB0b3VjaCB0aGUgRE9NLCBpdCBqdXN0IHByZXBhcmVzIHRoZSBzdHlsZXNcclxuICAgKiBzbyB0aGF0IGBhcHBseVN0eWxlYCBtb2RpZmllciBjYW4gYXBwbHkgaXQuIFRoaXMgc2VwYXJhdGlvbiBpcyB1c2VmdWxcclxuICAgKiBpbiBjYXNlIHlvdSBuZWVkIHRvIHJlcGxhY2UgYGFwcGx5U3R5bGVgIHdpdGggYSBjdXN0b20gaW1wbGVtZW50YXRpb24uXHJcbiAgICpcclxuICAgKiBUaGlzIG1vZGlmaWVyIGhhcyBgODUwYCBhcyBgb3JkZXJgIHZhbHVlIHRvIG1haW50YWluIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcclxuICAgKiB3aXRoIHByZXZpb3VzIHZlcnNpb25zIG9mIFBvcHBlci5qcy4gRXhwZWN0IHRoZSBtb2RpZmllcnMgb3JkZXJpbmcgbWV0aG9kXHJcbiAgICogdG8gY2hhbmdlIGluIGZ1dHVyZSBtYWpvciB2ZXJzaW9ucyBvZiB0aGUgbGlicmFyeS5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBjb21wdXRlU3R5bGU6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj04NTAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogODUwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBjb21wdXRlU3R5bGUsXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtCb29sZWFufSBncHVBY2NlbGVyYXRpb249dHJ1ZVxyXG4gICAgICogSWYgdHJ1ZSwgaXQgdXNlcyB0aGUgQ1NTIDNkIHRyYW5zZm9ybWF0aW9uIHRvIHBvc2l0aW9uIHRoZSBwb3BwZXIuXHJcbiAgICAgKiBPdGhlcndpc2UsIGl0IHdpbGwgdXNlIHRoZSBgdG9wYCBhbmQgYGxlZnRgIHByb3BlcnRpZXMuXHJcbiAgICAgKi9cclxuICAgIGdwdUFjY2VsZXJhdGlvbjogdHJ1ZSxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age3N0cmluZ30gW3g9J2JvdHRvbSddXHJcbiAgICAgKiBXaGVyZSB0byBhbmNob3IgdGhlIFggYXhpcyAoYGJvdHRvbWAgb3IgYHRvcGApLiBBS0EgWCBvZmZzZXQgb3JpZ2luLlxyXG4gICAgICogQ2hhbmdlIHRoaXMgaWYgeW91ciBwb3BwZXIgc2hvdWxkIGdyb3cgaW4gYSBkaXJlY3Rpb24gZGlmZmVyZW50IGZyb20gYGJvdHRvbWBcclxuICAgICAqL1xyXG4gICAgeDogJ2JvdHRvbScsXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtzdHJpbmd9IFt4PSdsZWZ0J11cclxuICAgICAqIFdoZXJlIHRvIGFuY2hvciB0aGUgWSBheGlzIChgbGVmdGAgb3IgYHJpZ2h0YCkuIEFLQSBZIG9mZnNldCBvcmlnaW4uXHJcbiAgICAgKiBDaGFuZ2UgdGhpcyBpZiB5b3VyIHBvcHBlciBzaG91bGQgZ3JvdyBpbiBhIGRpcmVjdGlvbiBkaWZmZXJlbnQgZnJvbSBgcmlnaHRgXHJcbiAgICAgKi9cclxuICAgIHk6ICdyaWdodCdcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBBcHBsaWVzIHRoZSBjb21wdXRlZCBzdHlsZXMgdG8gdGhlIHBvcHBlciBlbGVtZW50LlxyXG4gICAqXHJcbiAgICogQWxsIHRoZSBET00gbWFuaXB1bGF0aW9ucyBhcmUgbGltaXRlZCB0byB0aGlzIG1vZGlmaWVyLiBUaGlzIGlzIHVzZWZ1bCBpbiBjYXNlXHJcbiAgICogeW91IHdhbnQgdG8gaW50ZWdyYXRlIFBvcHBlci5qcyBpbnNpZGUgYSBmcmFtZXdvcmsgb3IgdmlldyBsaWJyYXJ5IGFuZCB5b3VcclxuICAgKiB3YW50IHRvIGRlbGVnYXRlIGFsbCB0aGUgRE9NIG1hbmlwdWxhdGlvbnMgdG8gaXQuXHJcbiAgICpcclxuICAgKiBOb3RlIHRoYXQgaWYgeW91IGRpc2FibGUgdGhpcyBtb2RpZmllciwgeW91IG11c3QgbWFrZSBzdXJlIHRoZSBwb3BwZXIgZWxlbWVudFxyXG4gICAqIGhhcyBpdHMgcG9zaXRpb24gc2V0IHRvIGBhYnNvbHV0ZWAgYmVmb3JlIFBvcHBlci5qcyBjYW4gZG8gaXRzIHdvcmshXHJcbiAgICpcclxuICAgKiBKdXN0IGRpc2FibGUgdGhpcyBtb2RpZmllciBhbmQgZGVmaW5lIHlvdSBvd24gdG8gYWNoaWV2ZSB0aGUgZGVzaXJlZCBlZmZlY3QuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgYXBwbHlTdHlsZToge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTkwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiA5MDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IGFwcGx5U3R5bGUsXHJcbiAgICAvKiogQHByb3Age0Z1bmN0aW9ufSAqL1xyXG4gICAgb25Mb2FkOiBhcHBseVN0eWxlT25Mb2FkLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDEuMTAuMCwgdGhlIHByb3BlcnR5IG1vdmVkIHRvIGBjb21wdXRlU3R5bGVgIG1vZGlmaWVyXHJcbiAgICAgKiBAcHJvcCB7Qm9vbGVhbn0gZ3B1QWNjZWxlcmF0aW9uPXRydWVcclxuICAgICAqIElmIHRydWUsIGl0IHVzZXMgdGhlIENTUyAzZCB0cmFuc2Zvcm1hdGlvbiB0byBwb3NpdGlvbiB0aGUgcG9wcGVyLlxyXG4gICAgICogT3RoZXJ3aXNlLCBpdCB3aWxsIHVzZSB0aGUgYHRvcGAgYW5kIGBsZWZ0YCBwcm9wZXJ0aWVzLlxyXG4gICAgICovXHJcbiAgICBncHVBY2NlbGVyYXRpb246IHVuZGVmaW5lZFxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgYGRhdGFPYmplY3RgIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgaW5mb3JtYXRpb25zIHVzZWQgYnkgUG9wcGVyLmpzXHJcbiAqIHRoaXMgb2JqZWN0IGdldCBwYXNzZWQgdG8gbW9kaWZpZXJzIGFuZCB0byB0aGUgYG9uQ3JlYXRlYCBhbmQgYG9uVXBkYXRlYCBjYWxsYmFja3MuXHJcbiAqIEBuYW1lIGRhdGFPYmplY3RcclxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEuaW5zdGFuY2UgVGhlIFBvcHBlci5qcyBpbnN0YW5jZVxyXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZGF0YS5wbGFjZW1lbnQgUGxhY2VtZW50IGFwcGxpZWQgdG8gcG9wcGVyXHJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBkYXRhLm9yaWdpbmFsUGxhY2VtZW50IFBsYWNlbWVudCBvcmlnaW5hbGx5IGRlZmluZWQgb24gaW5pdFxyXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IGRhdGEuZmxpcHBlZCBUcnVlIGlmIHBvcHBlciBoYXMgYmVlbiBmbGlwcGVkIGJ5IGZsaXAgbW9kaWZpZXJcclxuICogQHByb3BlcnR5IHtCb29sZWFufSBkYXRhLmhpZGUgVHJ1ZSBpZiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgaXMgb3V0IG9mIGJvdW5kYXJpZXMsIHVzZWZ1bCB0byBrbm93IHdoZW4gdG8gaGlkZSB0aGUgcG9wcGVyLlxyXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBkYXRhLmFycm93RWxlbWVudCBOb2RlIHVzZWQgYXMgYXJyb3cgYnkgYXJyb3cgbW9kaWZpZXJcclxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEuc3R5bGVzIEFueSBDU1MgcHJvcGVydHkgZGVmaW5lZCBoZXJlIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyLCBpdCBleHBlY3RzIHRoZSBKYXZhU2NyaXB0IG5vbWVuY2xhdHVyZSAoZWcuIGBtYXJnaW5Cb3R0b21gKVxyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5hcnJvd1N0eWxlcyBBbnkgQ1NTIHByb3BlcnR5IGRlZmluZWQgaGVyZSB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlciBhcnJvdywgaXQgZXhwZWN0cyB0aGUgSmF2YVNjcmlwdCBub21lbmNsYXR1cmUgKGVnLiBgbWFyZ2luQm90dG9tYClcclxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEuYm91bmRhcmllcyBPZmZzZXRzIG9mIHRoZSBwb3BwZXIgYm91bmRhcmllc1xyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5vZmZzZXRzIFRoZSBtZWFzdXJlbWVudHMgb2YgcG9wcGVyLCByZWZlcmVuY2UgYW5kIGFycm93IGVsZW1lbnRzLlxyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5vZmZzZXRzLnBvcHBlciBgdG9wYCwgYGxlZnRgLCBgd2lkdGhgLCBgaGVpZ2h0YCB2YWx1ZXNcclxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEub2Zmc2V0cy5yZWZlcmVuY2UgYHRvcGAsIGBsZWZ0YCwgYHdpZHRoYCwgYGhlaWdodGAgdmFsdWVzXHJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLm9mZnNldHMuYXJyb3ddIGB0b3BgIGFuZCBgbGVmdGAgb2Zmc2V0cywgb25seSBvbmUgb2YgdGhlbSB3aWxsIGJlIGRpZmZlcmVudCBmcm9tIDBcclxuICovXHJcblxyXG4vKipcclxuICogRGVmYXVsdCBvcHRpb25zIHByb3ZpZGVkIHRvIFBvcHBlci5qcyBjb25zdHJ1Y3Rvci48YnIgLz5cclxuICogVGhlc2UgY2FuIGJlIG92ZXJyaWRlbiB1c2luZyB0aGUgYG9wdGlvbnNgIGFyZ3VtZW50IG9mIFBvcHBlci5qcy48YnIgLz5cclxuICogVG8gb3ZlcnJpZGUgYW4gb3B0aW9uLCBzaW1wbHkgcGFzcyBhcyAzcmQgYXJndW1lbnQgYW4gb2JqZWN0IHdpdGggdGhlIHNhbWVcclxuICogc3RydWN0dXJlIG9mIHRoaXMgb2JqZWN0LCBleGFtcGxlOlxyXG4gKiBgYGBcclxuICogbmV3IFBvcHBlcihyZWYsIHBvcCwge1xyXG4gKiAgIG1vZGlmaWVyczoge1xyXG4gKiAgICAgcHJldmVudE92ZXJmbG93OiB7IGVuYWJsZWQ6IGZhbHNlIH1cclxuICogICB9XHJcbiAqIH0pXHJcbiAqIGBgYFxyXG4gKiBAdHlwZSB7T2JqZWN0fVxyXG4gKiBAc3RhdGljXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICovXHJcbnZhciBEZWZhdWx0cyA9IHtcclxuICAvKipcclxuICAgKiBQb3BwZXIncyBwbGFjZW1lbnRcclxuICAgKiBAcHJvcCB7UG9wcGVyLnBsYWNlbWVudHN9IHBsYWNlbWVudD0nYm90dG9tJ1xyXG4gICAqL1xyXG4gIHBsYWNlbWVudDogJ2JvdHRvbScsXHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGlzIHRvIHRydWUgaWYgeW91IHdhbnQgcG9wcGVyIHRvIHBvc2l0aW9uIGl0IHNlbGYgaW4gJ2ZpeGVkJyBtb2RlXHJcbiAgICogQHByb3Age0Jvb2xlYW59IHBvc2l0aW9uRml4ZWQ9ZmFsc2VcclxuICAgKi9cclxuICBwb3NpdGlvbkZpeGVkOiBmYWxzZSxcclxuXHJcbiAgLyoqXHJcbiAgICogV2hldGhlciBldmVudHMgKHJlc2l6ZSwgc2Nyb2xsKSBhcmUgaW5pdGlhbGx5IGVuYWJsZWRcclxuICAgKiBAcHJvcCB7Qm9vbGVhbn0gZXZlbnRzRW5hYmxlZD10cnVlXHJcbiAgICovXHJcbiAgZXZlbnRzRW5hYmxlZDogdHJ1ZSxcclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRvIHRydWUgaWYgeW91IHdhbnQgdG8gYXV0b21hdGljYWxseSByZW1vdmUgdGhlIHBvcHBlciB3aGVuXHJcbiAgICogeW91IGNhbGwgdGhlIGBkZXN0cm95YCBtZXRob2QuXHJcbiAgICogQHByb3Age0Jvb2xlYW59IHJlbW92ZU9uRGVzdHJveT1mYWxzZVxyXG4gICAqL1xyXG4gIHJlbW92ZU9uRGVzdHJveTogZmFsc2UsXHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBwb3BwZXIgaXMgY3JlYXRlZC48YnIgLz5cclxuICAgKiBCeSBkZWZhdWx0LCBpcyBzZXQgdG8gbm8tb3AuPGJyIC8+XHJcbiAgICogQWNjZXNzIFBvcHBlci5qcyBpbnN0YW5jZSB3aXRoIGBkYXRhLmluc3RhbmNlYC5cclxuICAgKiBAcHJvcCB7b25DcmVhdGV9XHJcbiAgICovXHJcbiAgb25DcmVhdGU6IGZ1bmN0aW9uIG9uQ3JlYXRlKCkge30sXHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBwb3BwZXIgaXMgdXBkYXRlZCwgdGhpcyBjYWxsYmFjayBpcyBub3QgY2FsbGVkXHJcbiAgICogb24gdGhlIGluaXRpYWxpemF0aW9uL2NyZWF0aW9uIG9mIHRoZSBwb3BwZXIsIGJ1dCBvbmx5IG9uIHN1YnNlcXVlbnRcclxuICAgKiB1cGRhdGVzLjxiciAvPlxyXG4gICAqIEJ5IGRlZmF1bHQsIGlzIHNldCB0byBuby1vcC48YnIgLz5cclxuICAgKiBBY2Nlc3MgUG9wcGVyLmpzIGluc3RhbmNlIHdpdGggYGRhdGEuaW5zdGFuY2VgLlxyXG4gICAqIEBwcm9wIHtvblVwZGF0ZX1cclxuICAgKi9cclxuICBvblVwZGF0ZTogZnVuY3Rpb24gb25VcGRhdGUoKSB7fSxcclxuXHJcbiAgLyoqXHJcbiAgICogTGlzdCBvZiBtb2RpZmllcnMgdXNlZCB0byBtb2RpZnkgdGhlIG9mZnNldHMgYmVmb3JlIHRoZXkgYXJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlci5cclxuICAgKiBUaGV5IHByb3ZpZGUgbW9zdCBvZiB0aGUgZnVuY3Rpb25hbGl0aWVzIG9mIFBvcHBlci5qc1xyXG4gICAqIEBwcm9wIHttb2RpZmllcnN9XHJcbiAgICovXHJcbiAgbW9kaWZpZXJzOiBtb2RpZmllcnNcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAY2FsbGJhY2sgb25DcmVhdGVcclxuICogQHBhcmFtIHtkYXRhT2JqZWN0fSBkYXRhXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjYWxsYmFjayBvblVwZGF0ZVxyXG4gKiBAcGFyYW0ge2RhdGFPYmplY3R9IGRhdGFcclxuICovXHJcblxyXG4vLyBVdGlsc1xyXG4vLyBNZXRob2RzXHJcbnZhciBQb3BwZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgbmV3IFBvcHBlci5qcyBpbnN0YW5jZVxyXG4gICAqIEBjbGFzcyBQb3BwZXJcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fHJlZmVyZW5jZU9iamVjdH0gcmVmZXJlbmNlIC0gVGhlIHJlZmVyZW5jZSBlbGVtZW50IHVzZWQgdG8gcG9zaXRpb24gdGhlIHBvcHBlclxyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHBlciAtIFRoZSBIVE1MIGVsZW1lbnQgdXNlZCBhcyBwb3BwZXIuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBZb3VyIGN1c3RvbSBvcHRpb25zIHRvIG92ZXJyaWRlIHRoZSBvbmVzIGRlZmluZWQgaW4gW0RlZmF1bHRzXSgjZGVmYXVsdHMpXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBpbnN0YW5jZSAtIFRoZSBnZW5lcmF0ZWQgUG9wcGVyLmpzIGluc3RhbmNlXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gUG9wcGVyKHJlZmVyZW5jZSwgcG9wcGVyKSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcclxuICAgIGNsYXNzQ2FsbENoZWNrJDEodGhpcywgUG9wcGVyKTtcclxuXHJcbiAgICB0aGlzLnNjaGVkdWxlVXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKF90aGlzLnVwZGF0ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIG1ha2UgdXBkYXRlKCkgZGVib3VuY2VkLCBzbyB0aGF0IGl0IG9ubHkgcnVucyBhdCBtb3N0IG9uY2UtcGVyLXRpY2tcclxuICAgIHRoaXMudXBkYXRlID0gZGVib3VuY2UodGhpcy51cGRhdGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgLy8gd2l0aCB7fSB3ZSBjcmVhdGUgYSBuZXcgb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgaW5zaWRlIGl0XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBfZXh0ZW5kcyQxKHt9LCBQb3BwZXIuRGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cclxuICAgIC8vIGluaXQgc3RhdGVcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIGlzRGVzdHJveWVkOiBmYWxzZSxcclxuICAgICAgaXNDcmVhdGVkOiBmYWxzZSxcclxuICAgICAgc2Nyb2xsUGFyZW50czogW11cclxuICAgIH07XHJcblxyXG4gICAgLy8gZ2V0IHJlZmVyZW5jZSBhbmQgcG9wcGVyIGVsZW1lbnRzIChhbGxvdyBqUXVlcnkgd3JhcHBlcnMpXHJcbiAgICB0aGlzLnJlZmVyZW5jZSA9IHJlZmVyZW5jZSAmJiByZWZlcmVuY2UuanF1ZXJ5ID8gcmVmZXJlbmNlWzBdIDogcmVmZXJlbmNlO1xyXG4gICAgdGhpcy5wb3BwZXIgPSBwb3BwZXIgJiYgcG9wcGVyLmpxdWVyeSA/IHBvcHBlclswXSA6IHBvcHBlcjtcclxuXHJcbiAgICAvLyBEZWVwIG1lcmdlIG1vZGlmaWVycyBvcHRpb25zXHJcbiAgICB0aGlzLm9wdGlvbnMubW9kaWZpZXJzID0ge307XHJcbiAgICBPYmplY3Qua2V5cyhfZXh0ZW5kcyQxKHt9LCBQb3BwZXIuRGVmYXVsdHMubW9kaWZpZXJzLCBvcHRpb25zLm1vZGlmaWVycykpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgX3RoaXMub3B0aW9ucy5tb2RpZmllcnNbbmFtZV0gPSBfZXh0ZW5kcyQxKHt9LCBQb3BwZXIuRGVmYXVsdHMubW9kaWZpZXJzW25hbWVdIHx8IHt9LCBvcHRpb25zLm1vZGlmaWVycyA/IG9wdGlvbnMubW9kaWZpZXJzW25hbWVdIDoge30pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUmVmYWN0b3JpbmcgbW9kaWZpZXJzJyBsaXN0IChPYmplY3QgPT4gQXJyYXkpXHJcbiAgICB0aGlzLm1vZGlmaWVycyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5tb2RpZmllcnMpLm1hcChmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICByZXR1cm4gX2V4dGVuZHMkMSh7XHJcbiAgICAgICAgbmFtZTogbmFtZVxyXG4gICAgICB9LCBfdGhpcy5vcHRpb25zLm1vZGlmaWVyc1tuYW1lXSk7XHJcbiAgICB9KVxyXG4gICAgLy8gc29ydCB0aGUgbW9kaWZpZXJzIGJ5IG9yZGVyXHJcbiAgICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICByZXR1cm4gYS5vcmRlciAtIGIub3JkZXI7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBtb2RpZmllcnMgaGF2ZSB0aGUgYWJpbGl0eSB0byBleGVjdXRlIGFyYml0cmFyeSBjb2RlIHdoZW4gUG9wcGVyLmpzIGdldCBpbml0ZWRcclxuICAgIC8vIHN1Y2ggY29kZSBpcyBleGVjdXRlZCBpbiB0aGUgc2FtZSBvcmRlciBvZiBpdHMgbW9kaWZpZXJcclxuICAgIC8vIHRoZXkgY291bGQgYWRkIG5ldyBwcm9wZXJ0aWVzIHRvIHRoZWlyIG9wdGlvbnMgY29uZmlndXJhdGlvblxyXG4gICAgLy8gQkUgQVdBUkU6IGRvbid0IGFkZCBvcHRpb25zIHRvIGBvcHRpb25zLm1vZGlmaWVycy5uYW1lYCBidXQgdG8gYG1vZGlmaWVyT3B0aW9uc2AhXHJcbiAgICB0aGlzLm1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllck9wdGlvbnMpIHtcclxuICAgICAgaWYgKG1vZGlmaWVyT3B0aW9ucy5lbmFibGVkICYmIGlzRnVuY3Rpb24obW9kaWZpZXJPcHRpb25zLm9uTG9hZCkpIHtcclxuICAgICAgICBtb2RpZmllck9wdGlvbnMub25Mb2FkKF90aGlzLnJlZmVyZW5jZSwgX3RoaXMucG9wcGVyLCBfdGhpcy5vcHRpb25zLCBtb2RpZmllck9wdGlvbnMsIF90aGlzLnN0YXRlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gZmlyZSB0aGUgZmlyc3QgdXBkYXRlIHRvIHBvc2l0aW9uIHRoZSBwb3BwZXIgaW4gdGhlIHJpZ2h0IHBsYWNlXHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgIHZhciBldmVudHNFbmFibGVkID0gdGhpcy5vcHRpb25zLmV2ZW50c0VuYWJsZWQ7XHJcbiAgICBpZiAoZXZlbnRzRW5hYmxlZCkge1xyXG4gICAgICAvLyBzZXR1cCBldmVudCBsaXN0ZW5lcnMsIHRoZXkgd2lsbCB0YWtlIGNhcmUgb2YgdXBkYXRlIHRoZSBwb3NpdGlvbiBpbiBzcGVjaWZpYyBzaXR1YXRpb25zXHJcbiAgICAgIHRoaXMuZW5hYmxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YXRlLmV2ZW50c0VuYWJsZWQgPSBldmVudHNFbmFibGVkO1xyXG4gIH1cclxuXHJcbiAgLy8gV2UgY2FuJ3QgdXNlIGNsYXNzIHByb3BlcnRpZXMgYmVjYXVzZSB0aGV5IGRvbid0IGdldCBsaXN0ZWQgaW4gdGhlXHJcbiAgLy8gY2xhc3MgcHJvdG90eXBlIGFuZCBicmVhayBzdHVmZiBsaWtlIFNpbm9uIHN0dWJzXHJcblxyXG5cclxuICBjcmVhdGVDbGFzcyQxKFBvcHBlciwgW3tcclxuICAgIGtleTogJ3VwZGF0ZScsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlJCQxKCkge1xyXG4gICAgICByZXR1cm4gdXBkYXRlLmNhbGwodGhpcyk7XHJcbiAgICB9XHJcbiAgfSwge1xyXG4gICAga2V5OiAnZGVzdHJveScsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSQkMSgpIHtcclxuICAgICAgcmV0dXJuIGRlc3Ryb3kuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuICB9LCB7XHJcbiAgICBrZXk6ICdlbmFibGVFdmVudExpc3RlbmVycycsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5hYmxlRXZlbnRMaXN0ZW5lcnMkJDEoKSB7XHJcbiAgICAgIHJldHVybiBlbmFibGVFdmVudExpc3RlbmVycy5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG4gIH0sIHtcclxuICAgIGtleTogJ2Rpc2FibGVFdmVudExpc3RlbmVycycsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzYWJsZUV2ZW50TGlzdGVuZXJzJCQxKCkge1xyXG4gICAgICByZXR1cm4gZGlzYWJsZUV2ZW50TGlzdGVuZXJzLmNhbGwodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTY2hlZHVsZSBhbiB1cGRhdGUsIGl0IHdpbGwgcnVuIG9uIHRoZSBuZXh0IFVJIHVwZGF0ZSBhdmFpbGFibGVcclxuICAgICAqIEBtZXRob2Qgc2NoZWR1bGVVcGRhdGVcclxuICAgICAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICAgICAqL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29sbGVjdGlvbiBvZiB1dGlsaXRpZXMgdXNlZnVsIHdoZW4gd3JpdGluZyBjdXN0b20gbW9kaWZpZXJzLlxyXG4gICAgICogU3RhcnRpbmcgZnJvbSB2ZXJzaW9uIDEuNywgdGhpcyBtZXRob2QgaXMgYXZhaWxhYmxlIG9ubHkgaWYgeW91XHJcbiAgICAgKiBpbmNsdWRlIGBwb3BwZXItdXRpbHMuanNgIGJlZm9yZSBgcG9wcGVyLmpzYC5cclxuICAgICAqXHJcbiAgICAgKiAqKkRFUFJFQ0FUSU9OKio6IFRoaXMgd2F5IHRvIGFjY2VzcyBQb3BwZXJVdGlscyBpcyBkZXByZWNhdGVkXHJcbiAgICAgKiBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHYyISBVc2UgdGhlIFBvcHBlclV0aWxzIG1vZHVsZSBkaXJlY3RseSBpbnN0ZWFkLlxyXG4gICAgICogRHVlIHRvIHRoZSBoaWdoIGluc3RhYmlsaXR5IG9mIHRoZSBtZXRob2RzIGNvbnRhaW5lZCBpbiBVdGlscywgd2UgY2FuJ3RcclxuICAgICAqIGd1YXJhbnRlZSB0aGVtIHRvIGZvbGxvdyBzZW12ZXIuIFVzZSB0aGVtIGF0IHlvdXIgb3duIHJpc2shXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHR5cGUge09iamVjdH1cclxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMS44XHJcbiAgICAgKiBAbWVtYmVyIFV0aWxzXHJcbiAgICAgKiBAbWVtYmVyb2YgUG9wcGVyXHJcbiAgICAgKi9cclxuXHJcbiAgfV0pO1xyXG4gIHJldHVybiBQb3BwZXI7XHJcbn0oKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgYHJlZmVyZW5jZU9iamVjdGAgaXMgYW4gb2JqZWN0IHRoYXQgcHJvdmlkZXMgYW4gaW50ZXJmYWNlIGNvbXBhdGlibGUgd2l0aCBQb3BwZXIuanNcclxuICogYW5kIGxldHMgeW91IHVzZSBpdCBhcyByZXBsYWNlbWVudCBvZiBhIHJlYWwgRE9NIG5vZGUuPGJyIC8+XHJcbiAqIFlvdSBjYW4gdXNlIHRoaXMgbWV0aG9kIHRvIHBvc2l0aW9uIGEgcG9wcGVyIHJlbGF0aXZlbHkgdG8gYSBzZXQgb2YgY29vcmRpbmF0ZXNcclxuICogaW4gY2FzZSB5b3UgZG9uJ3QgaGF2ZSBhIERPTSBub2RlIHRvIHVzZSBhcyByZWZlcmVuY2UuXHJcbiAqXHJcbiAqIGBgYFxyXG4gKiBuZXcgUG9wcGVyKHJlZmVyZW5jZU9iamVjdCwgcG9wcGVyTm9kZSk7XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBOQjogVGhpcyBmZWF0dXJlIGlzbid0IHN1cHBvcnRlZCBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMFxyXG4gKiBAbmFtZSByZWZlcmVuY2VPYmplY3RcclxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZGF0YS5nZXRCb3VuZGluZ0NsaWVudFJlY3RcclxuICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzZXQgb2YgY29vcmRpbmF0ZXMgY29tcGF0aWJsZSB3aXRoIHRoZSBuYXRpdmUgYGdldEJvdW5kaW5nQ2xpZW50UmVjdGAgbWV0aG9kLlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gZGF0YS5jbGllbnRXaWR0aFxyXG4gKiBBbiBFUzYgZ2V0dGVyIHRoYXQgd2lsbCByZXR1cm4gdGhlIHdpZHRoIG9mIHRoZSB2aXJ0dWFsIHJlZmVyZW5jZSBlbGVtZW50LlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gZGF0YS5jbGllbnRIZWlnaHRcclxuICogQW4gRVM2IGdldHRlciB0aGF0IHdpbGwgcmV0dXJuIHRoZSBoZWlnaHQgb2YgdGhlIHZpcnR1YWwgcmVmZXJlbmNlIGVsZW1lbnQuXHJcbiAqL1xyXG5cclxuUG9wcGVyLlV0aWxzID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogZ2xvYmFsKS5Qb3BwZXJVdGlscztcclxuUG9wcGVyLnBsYWNlbWVudHMgPSBwbGFjZW1lbnRzO1xyXG5Qb3BwZXIuRGVmYXVsdHMgPSBEZWZhdWx0cztcclxuXHJcbi8qKlxyXG4gKiBUcmlnZ2VycyBkb2N1bWVudCByZWZsb3cuXHJcbiAqIFVzZSB2b2lkIGJlY2F1c2Ugc29tZSBtaW5pZmllcnMgb3IgZW5naW5lcyB0aGluayBzaW1wbHkgYWNjZXNzaW5nIHRoZSBwcm9wZXJ0eVxyXG4gKiBpcyB1bm5lY2Vzc2FyeS5cclxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcclxuICovXHJcbmZ1bmN0aW9uIHJlZmxvdyhwb3BwZXIpIHtcclxuICB2b2lkIHBvcHBlci5vZmZzZXRIZWlnaHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXcmFwcGVyIHV0aWwgZm9yIHBvcHBlciBwb3NpdGlvbiB1cGRhdGluZy5cclxuICogVXBkYXRlcyB0aGUgcG9wcGVyJ3MgcG9zaXRpb24gYW5kIGludm9rZXMgdGhlIGNhbGxiYWNrIG9uIHVwZGF0ZS5cclxuICogSGFja2lzaCB3b3JrYXJvdW5kIHVudGlsIFBvcHBlciAyLjAncyB1cGRhdGUoKSBiZWNvbWVzIHN5bmMuXHJcbiAqIEBwYXJhbSB7UG9wcGVyfSBwb3BwZXJJbnN0YW5jZVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjazogdG8gcnVuIG9uY2UgcG9wcGVyJ3MgcG9zaXRpb24gd2FzIHVwZGF0ZWRcclxuICogQHBhcmFtIHtCb29sZWFufSB1cGRhdGVBbHJlYWR5Q2FsbGVkOiB3YXMgc2NoZWR1bGVVcGRhdGUoKSBhbHJlYWR5IGNhbGxlZD9cclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZVBvcHBlclBvc2l0aW9uKHBvcHBlckluc3RhbmNlLCBjYWxsYmFjaywgdXBkYXRlQWxyZWFkeUNhbGxlZCkge1xyXG4gIHZhciBwb3BwZXIgPSBwb3BwZXJJbnN0YW5jZS5wb3BwZXIsXHJcbiAgICAgIG9wdGlvbnMgPSBwb3BwZXJJbnN0YW5jZS5vcHRpb25zO1xyXG5cclxuICB2YXIgb25DcmVhdGUgPSBvcHRpb25zLm9uQ3JlYXRlO1xyXG4gIHZhciBvblVwZGF0ZSA9IG9wdGlvbnMub25VcGRhdGU7XHJcblxyXG4gIG9wdGlvbnMub25DcmVhdGUgPSBvcHRpb25zLm9uVXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmVmbG93KHBvcHBlciksIGNhbGxiYWNrICYmIGNhbGxiYWNrKCksIG9uVXBkYXRlKCk7XHJcbiAgICBvcHRpb25zLm9uQ3JlYXRlID0gb25DcmVhdGU7XHJcbiAgICBvcHRpb25zLm9uVXBkYXRlID0gb25VcGRhdGU7XHJcbiAgfTtcclxuXHJcbiAgaWYgKCF1cGRhdGVBbHJlYWR5Q2FsbGVkKSB7XHJcbiAgICBwb3BwZXJJbnN0YW5jZS5zY2hlZHVsZVVwZGF0ZSgpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGNvcmUgcGxhY2VtZW50ICgndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0Jykgb2YgYSBwb3BwZXJcclxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UG9wcGVyUGxhY2VtZW50KHBvcHBlcikge1xyXG4gIHJldHVybiBwb3BwZXIuZ2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcpLnJlcGxhY2UoLy0uKy8sICcnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIERldGVybWluZXMgaWYgdGhlIG1vdXNlJ3MgY3Vyc29yIGlzIG91dHNpZGUgdGhlIGludGVyYWN0aXZlIGJvcmRlclxyXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcG9wcGVyXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBjdXJzb3JJc091dHNpZGVJbnRlcmFjdGl2ZUJvcmRlcihldmVudCwgcG9wcGVyLCBvcHRpb25zKSB7XHJcbiAgaWYgKCFwb3BwZXIuZ2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcpKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgdmFyIHggPSBldmVudC5jbGllbnRYLFxyXG4gICAgICB5ID0gZXZlbnQuY2xpZW50WTtcclxuICB2YXIgaW50ZXJhY3RpdmVCb3JkZXIgPSBvcHRpb25zLmludGVyYWN0aXZlQm9yZGVyLFxyXG4gICAgICBkaXN0YW5jZSA9IG9wdGlvbnMuZGlzdGFuY2U7XHJcblxyXG5cclxuICB2YXIgcmVjdCA9IHBvcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICB2YXIgcGxhY2VtZW50ID0gZ2V0UG9wcGVyUGxhY2VtZW50KHBvcHBlcik7XHJcbiAgdmFyIGJvcmRlcldpdGhEaXN0YW5jZSA9IGludGVyYWN0aXZlQm9yZGVyICsgZGlzdGFuY2U7XHJcblxyXG4gIHZhciBleGNlZWRzID0ge1xyXG4gICAgdG9wOiByZWN0LnRvcCAtIHkgPiBpbnRlcmFjdGl2ZUJvcmRlcixcclxuICAgIGJvdHRvbTogeSAtIHJlY3QuYm90dG9tID4gaW50ZXJhY3RpdmVCb3JkZXIsXHJcbiAgICBsZWZ0OiByZWN0LmxlZnQgLSB4ID4gaW50ZXJhY3RpdmVCb3JkZXIsXHJcbiAgICByaWdodDogeCAtIHJlY3QucmlnaHQgPiBpbnRlcmFjdGl2ZUJvcmRlclxyXG4gIH07XHJcblxyXG4gIHN3aXRjaCAocGxhY2VtZW50KSB7XHJcbiAgICBjYXNlICd0b3AnOlxyXG4gICAgICBleGNlZWRzLnRvcCA9IHJlY3QudG9wIC0geSA+IGJvcmRlcldpdGhEaXN0YW5jZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdib3R0b20nOlxyXG4gICAgICBleGNlZWRzLmJvdHRvbSA9IHkgLSByZWN0LmJvdHRvbSA+IGJvcmRlcldpdGhEaXN0YW5jZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdsZWZ0JzpcclxuICAgICAgZXhjZWVkcy5sZWZ0ID0gcmVjdC5sZWZ0IC0geCA+IGJvcmRlcldpdGhEaXN0YW5jZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdyaWdodCc6XHJcbiAgICAgIGV4Y2VlZHMucmlnaHQgPSB4IC0gcmVjdC5yaWdodCA+IGJvcmRlcldpdGhEaXN0YW5jZTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZXhjZWVkcy50b3AgfHwgZXhjZWVkcy5ib3R0b20gfHwgZXhjZWVkcy5sZWZ0IHx8IGV4Y2VlZHMucmlnaHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUcmFuc2Zvcm1zIHRoZSBgYXJyb3dUcmFuc2Zvcm1gIG51bWJlcnMgYmFzZWQgb24gdGhlIHBsYWNlbWVudCBheGlzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlICdzY2FsZScgb3IgJ3RyYW5zbGF0ZSdcclxuICogQHBhcmFtIHtOdW1iZXJbXX0gbnVtYmVyc1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzVmVydGljYWxcclxuICogQHBhcmFtIHtCb29sZWFufSBpc1JldmVyc2VcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gdHJhbnNmb3JtTnVtYmVyc0Jhc2VkT25QbGFjZW1lbnRBeGlzKHR5cGUsIG51bWJlcnMsIGlzVmVydGljYWwsIGlzUmV2ZXJzZSkge1xyXG4gIGlmICghbnVtYmVycy5sZW5ndGgpIHJldHVybiAnJztcclxuXHJcbiAgdmFyIHRyYW5zZm9ybXMgPSB7XHJcbiAgICBzY2FsZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAobnVtYmVycy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gJycgKyBudW1iZXJzWzBdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBpc1ZlcnRpY2FsID8gbnVtYmVyc1swXSArICcsICcgKyBudW1iZXJzWzFdIDogbnVtYmVyc1sxXSArICcsICcgKyBudW1iZXJzWzBdO1xyXG4gICAgICB9XHJcbiAgICB9KCksXHJcbiAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKG51bWJlcnMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIGlzUmV2ZXJzZSA/IC1udW1iZXJzWzBdICsgJ3B4JyA6IG51bWJlcnNbMF0gKyAncHgnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpc1ZlcnRpY2FsKSB7XHJcbiAgICAgICAgICByZXR1cm4gaXNSZXZlcnNlID8gbnVtYmVyc1swXSArICdweCwgJyArIC1udW1iZXJzWzFdICsgJ3B4JyA6IG51bWJlcnNbMF0gKyAncHgsICcgKyBudW1iZXJzWzFdICsgJ3B4JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGlzUmV2ZXJzZSA/IC1udW1iZXJzWzFdICsgJ3B4LCAnICsgbnVtYmVyc1swXSArICdweCcgOiBudW1iZXJzWzFdICsgJ3B4LCAnICsgbnVtYmVyc1swXSArICdweCc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KClcclxuICB9O1xyXG5cclxuICByZXR1cm4gdHJhbnNmb3Jtc1t0eXBlXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRyYW5zZm9ybXMgdGhlIGBhcnJvd1RyYW5zZm9ybWAgeCBvciB5IGF4aXMgYmFzZWQgb24gdGhlIHBsYWNlbWVudCBheGlzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBheGlzICdYJywgJ1knLCAnJ1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzVmVydGljYWxcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gdHJhbnNmb3JtQXhpcyhheGlzLCBpc1ZlcnRpY2FsKSB7XHJcbiAgaWYgKCFheGlzKSByZXR1cm4gJyc7XHJcbiAgdmFyIG1hcCA9IHtcclxuICAgIFg6ICdZJyxcclxuICAgIFk6ICdYJ1xyXG4gIH07XHJcbiAgcmV0dXJuIGlzVmVydGljYWwgPyBheGlzIDogbWFwW2F4aXNdO1xyXG59XHJcblxyXG4vKipcclxuICogQ29tcHV0ZXMgYW5kIGFwcGxpZXMgdGhlIG5lY2Vzc2FyeSBhcnJvdyB0cmFuc2Zvcm1cclxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcclxuICogQHBhcmFtIHtFbGVtZW50fSBhcnJvd1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJyb3dUcmFuc2Zvcm1cclxuICovXHJcbmZ1bmN0aW9uIGNvbXB1dGVBcnJvd1RyYW5zZm9ybShwb3BwZXIsIGFycm93LCBhcnJvd1RyYW5zZm9ybSkge1xyXG4gIHZhciBwbGFjZW1lbnQgPSBnZXRQb3BwZXJQbGFjZW1lbnQocG9wcGVyKTtcclxuICB2YXIgaXNWZXJ0aWNhbCA9IHBsYWNlbWVudCA9PT0gJ3RvcCcgfHwgcGxhY2VtZW50ID09PSAnYm90dG9tJztcclxuICB2YXIgaXNSZXZlcnNlID0gcGxhY2VtZW50ID09PSAncmlnaHQnIHx8IHBsYWNlbWVudCA9PT0gJ2JvdHRvbSc7XHJcblxyXG4gIHZhciBnZXRBeGlzID0gZnVuY3Rpb24gZ2V0QXhpcyhyZSkge1xyXG4gICAgdmFyIG1hdGNoID0gYXJyb3dUcmFuc2Zvcm0ubWF0Y2gocmUpO1xyXG4gICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiAnJztcclxuICB9O1xyXG5cclxuICB2YXIgZ2V0TnVtYmVycyA9IGZ1bmN0aW9uIGdldE51bWJlcnMocmUpIHtcclxuICAgIHZhciBtYXRjaCA9IGFycm93VHJhbnNmb3JtLm1hdGNoKHJlKTtcclxuICAgIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdLnNwbGl0KCcsJykubWFwKHBhcnNlRmxvYXQpIDogW107XHJcbiAgfTtcclxuXHJcbiAgdmFyIHJlID0ge1xyXG4gICAgdHJhbnNsYXRlOiAvdHJhbnNsYXRlWD9ZP1xcKChbXildKylcXCkvLFxyXG4gICAgc2NhbGU6IC9zY2FsZVg/WT9cXCgoW14pXSspXFwpL1xyXG4gIH07XHJcblxyXG4gIHZhciBtYXRjaGVzID0ge1xyXG4gICAgdHJhbnNsYXRlOiB7XHJcbiAgICAgIGF4aXM6IGdldEF4aXMoL3RyYW5zbGF0ZShbWFldKS8pLFxyXG4gICAgICBudW1iZXJzOiBnZXROdW1iZXJzKHJlLnRyYW5zbGF0ZSlcclxuICAgIH0sXHJcbiAgICBzY2FsZToge1xyXG4gICAgICBheGlzOiBnZXRBeGlzKC9zY2FsZShbWFldKS8pLFxyXG4gICAgICBudW1iZXJzOiBnZXROdW1iZXJzKHJlLnNjYWxlKVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBjb21wdXRlZFRyYW5zZm9ybSA9IGFycm93VHJhbnNmb3JtLnJlcGxhY2UocmUudHJhbnNsYXRlLCAndHJhbnNsYXRlJyArIHRyYW5zZm9ybUF4aXMobWF0Y2hlcy50cmFuc2xhdGUuYXhpcywgaXNWZXJ0aWNhbCkgKyAnKCcgKyB0cmFuc2Zvcm1OdW1iZXJzQmFzZWRPblBsYWNlbWVudEF4aXMoJ3RyYW5zbGF0ZScsIG1hdGNoZXMudHJhbnNsYXRlLm51bWJlcnMsIGlzVmVydGljYWwsIGlzUmV2ZXJzZSkgKyAnKScpLnJlcGxhY2UocmUuc2NhbGUsICdzY2FsZScgKyB0cmFuc2Zvcm1BeGlzKG1hdGNoZXMuc2NhbGUuYXhpcywgaXNWZXJ0aWNhbCkgKyAnKCcgKyB0cmFuc2Zvcm1OdW1iZXJzQmFzZWRPblBsYWNlbWVudEF4aXMoJ3NjYWxlJywgbWF0Y2hlcy5zY2FsZS5udW1iZXJzLCBpc1ZlcnRpY2FsLCBpc1JldmVyc2UpICsgJyknKTtcclxuXHJcbiAgYXJyb3cuc3R5bGVbcHJlZml4KCd0cmFuc2Zvcm0nKV0gPSBjb21wdXRlZFRyYW5zZm9ybTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGRpc3RhbmNlIHRha2luZyBpbnRvIGFjY291bnQgdGhlIGRlZmF1bHQgZGlzdGFuY2UgZHVlIHRvXHJcbiAqIHRoZSB0cmFuc2Zvcm06IHRyYW5zbGF0ZSBzZXR0aW5nIGluIENTU1xyXG4gKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2VcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0T2Zmc2V0RGlzdGFuY2VJblB4KGRpc3RhbmNlKSB7XHJcbiAgcmV0dXJuIC0oZGlzdGFuY2UgLSBkZWZhdWx0cy5kaXN0YW5jZSkgKyAncHgnO1xyXG59XHJcblxyXG4vKipcclxuICogV2FpdHMgdW50aWwgbmV4dCByZXBhaW50IHRvIGV4ZWN1dGUgYSBmblxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKi9cclxuZnVuY3Rpb24gZGVmZXIoZm4pIHtcclxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgc2V0VGltZW91dChmbiwgMSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbnZhciBtYXRjaGVzID0ge307XHJcblxyXG5pZiAoaXNCcm93c2VyKSB7XHJcbiAgdmFyIGUgPSBFbGVtZW50LnByb3RvdHlwZTtcclxuICBtYXRjaGVzID0gZS5tYXRjaGVzIHx8IGUubWF0Y2hlc1NlbGVjdG9yIHx8IGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGUubW96TWF0Y2hlc1NlbGVjdG9yIHx8IGUubXNNYXRjaGVzU2VsZWN0b3IgfHwgZnVuY3Rpb24gKHMpIHtcclxuICAgIHZhciBtYXRjaGVzID0gKHRoaXMuZG9jdW1lbnQgfHwgdGhpcy5vd25lckRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHMpO1xyXG4gICAgdmFyIGkgPSBtYXRjaGVzLmxlbmd0aDtcclxuICAgIHdoaWxlICgtLWkgPj0gMCAmJiBtYXRjaGVzLml0ZW0oaSkgIT09IHRoaXMpIHt9IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZW1wdHlcclxuICAgIHJldHVybiBpID4gLTE7XHJcbiAgfTtcclxufVxyXG5cclxudmFyIG1hdGNoZXMkMSA9IG1hdGNoZXM7XHJcblxyXG4vKipcclxuICogUG9ueWZpbGwgdG8gZ2V0IHRoZSBjbG9zZXN0IHBhcmVudCBlbGVtZW50XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIGNoaWxkIG9mIHBhcmVudCB0byBiZSByZXR1cm5lZFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFyZW50U2VsZWN0b3IgLSBzZWxlY3RvciB0byBtYXRjaCB0aGUgcGFyZW50IGlmIGZvdW5kXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9zZXN0KGVsZW1lbnQsIHBhcmVudFNlbGVjdG9yKSB7XHJcbiAgdmFyIGZuID0gRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCB8fCBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgIHZhciBlbCA9IHRoaXM7XHJcbiAgICB3aGlsZSAoZWwpIHtcclxuICAgICAgaWYgKG1hdGNoZXMkMS5jYWxsKGVsLCBzZWxlY3RvcikpIHtcclxuICAgICAgICByZXR1cm4gZWw7XHJcbiAgICAgIH1cclxuICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiBmbi5jYWxsKGVsZW1lbnQsIHBhcmVudFNlbGVjdG9yKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHZhbHVlIHRha2luZyBpbnRvIGFjY291bnQgdGhlIHZhbHVlIGJlaW5nIGVpdGhlciBhIG51bWJlciBvciBhcnJheVxyXG4gKiBAcGFyYW0ge051bWJlcnxBcnJheX0gdmFsdWVcclxuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XHJcbiAqIEByZXR1cm4ge051bWJlcn1cclxuICovXHJcbmZ1bmN0aW9uIGdldFZhbHVlKHZhbHVlLCBpbmRleCkge1xyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlW2luZGV4XSA6IHZhbHVlO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0cyB0aGUgdmlzaWJpbGl0eSBzdGF0ZSBvZiBhbiBlbGVtZW50IGZvciB0cmFuc2l0aW9uIHRvIGJlZ2luXHJcbiAqIEBwYXJhbSB7RWxlbWVudFtdfSBlbHMgLSBhcnJheSBvZiBlbGVtZW50c1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtICd2aXNpYmxlJyBvciAnaGlkZGVuJ1xyXG4gKi9cclxuZnVuY3Rpb24gc2V0VmlzaWJpbGl0eVN0YXRlKGVscywgdHlwZSkge1xyXG4gIGVscy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgaWYgKCFlbCkgcmV0dXJuO1xyXG4gICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXN0YXRlJywgdHlwZSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXRzIHRoZSB0cmFuc2l0aW9uIHByb3BlcnR5IHRvIGVhY2ggZWxlbWVudFxyXG4gKiBAcGFyYW0ge0VsZW1lbnRbXX0gZWxzIC0gQXJyYXkgb2YgZWxlbWVudHNcclxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXHJcbiAqL1xyXG5mdW5jdGlvbiBhcHBseVRyYW5zaXRpb25EdXJhdGlvbihlbHMsIHZhbHVlKSB7XHJcbiAgZWxzLmZpbHRlcihCb29sZWFuKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgZWwuc3R5bGVbcHJlZml4KCd0cmFuc2l0aW9uRHVyYXRpb24nKV0gPSB2YWx1ZSArICdtcyc7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGb2N1c2VzIGFuIGVsZW1lbnQgd2hpbGUgcHJldmVudGluZyBhIHNjcm9sbCBqdW1wIGlmIGl0J3Mgbm90IGVudGlyZWx5IHdpdGhpbiB0aGUgdmlld3BvcnRcclxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxyXG4gKi9cclxuZnVuY3Rpb24gZm9jdXMoZWwpIHtcclxuICB2YXIgeCA9IHdpbmRvdy5zY3JvbGxYIHx8IHdpbmRvdy5wYWdlWE9mZnNldDtcclxuICB2YXIgeSA9IHdpbmRvdy5zY3JvbGxZIHx8IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuICBlbC5mb2N1cygpO1xyXG4gIHNjcm9sbCh4LCB5KTtcclxufVxyXG5cclxudmFyIGtleSA9IHt9O1xyXG52YXIgc3RvcmUgPSBmdW5jdGlvbiBzdG9yZShkYXRhKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChrKSB7XHJcbiAgICByZXR1cm4gayA9PT0ga2V5ICYmIGRhdGE7XHJcbiAgfTtcclxufTtcclxuXHJcbnZhciBUaXBweSA9IGZ1bmN0aW9uICgpIHtcclxuICBmdW5jdGlvbiBUaXBweShjb25maWcpIHtcclxuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFRpcHB5KTtcclxuXHJcbiAgICBmb3IgKHZhciBfa2V5IGluIGNvbmZpZykge1xyXG4gICAgICB0aGlzW19rZXldID0gY29uZmlnW19rZXldO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIGRlc3Ryb3llZDogZmFsc2UsXHJcbiAgICAgIHZpc2libGU6IGZhbHNlLFxyXG4gICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuXyA9IHN0b3JlKHtcclxuICAgICAgbXV0YXRpb25PYnNlcnZlcnM6IFtdXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuYWJsZXMgdGhlIHRvb2x0aXAgdG8gYWxsb3cgaXQgdG8gc2hvdyBvciBoaWRlXHJcbiAgICogQG1lbWJlcm9mIFRpcHB5XHJcbiAgICogQHB1YmxpY1xyXG4gICAqL1xyXG5cclxuXHJcbiAgY3JlYXRlQ2xhc3MoVGlwcHksIFt7XHJcbiAgICBrZXk6ICdlbmFibGUnLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVuYWJsZSgpIHtcclxuICAgICAgdGhpcy5zdGF0ZS5lbmFibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc2FibGVzIHRoZSB0b29sdGlwIGZyb20gc2hvd2luZyBvciBoaWRpbmcsIGJ1dCBkb2VzIG5vdCBkZXN0cm95IGl0XHJcbiAgICAgKiBAbWVtYmVyb2YgVGlwcHlcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqL1xyXG5cclxuICB9LCB7XHJcbiAgICBrZXk6ICdkaXNhYmxlJyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlKCkge1xyXG4gICAgICB0aGlzLnN0YXRlLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3dzIHRoZSB0b29sdGlwXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzXHJcbiAgICAgKiBAbWVtYmVyb2YgVGlwcHlcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqL1xyXG5cclxuICB9LCB7XHJcbiAgICBrZXk6ICdzaG93JyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBzaG93KGR1cmF0aW9uKSB7XHJcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAodGhpcy5zdGF0ZS5kZXN0cm95ZWQgfHwgIXRoaXMuc3RhdGUuZW5hYmxlZCkgcmV0dXJuO1xyXG5cclxuICAgICAgdmFyIHBvcHBlciA9IHRoaXMucG9wcGVyLFxyXG4gICAgICAgICAgcmVmZXJlbmNlID0gdGhpcy5yZWZlcmVuY2UsXHJcbiAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICAgICAgdmFyIF9nZXRJbm5lckVsZW1lbnRzID0gZ2V0SW5uZXJFbGVtZW50cyhwb3BwZXIpLFxyXG4gICAgICAgICAgdG9vbHRpcCA9IF9nZXRJbm5lckVsZW1lbnRzLnRvb2x0aXAsXHJcbiAgICAgICAgICBiYWNrZHJvcCA9IF9nZXRJbm5lckVsZW1lbnRzLmJhY2tkcm9wLFxyXG4gICAgICAgICAgY29udGVudCA9IF9nZXRJbm5lckVsZW1lbnRzLmNvbnRlbnQ7XHJcblxyXG4gICAgICAvLyBJZiB0aGUgYGR5bmFtaWNUaXRsZWAgb3B0aW9uIGlzIHRydWUsIHRoZSBpbnN0YW5jZSBpcyBhbGxvd2VkXHJcbiAgICAgIC8vIHRvIGJlIGNyZWF0ZWQgd2l0aCBhbiBlbXB0eSB0aXRsZS4gTWFrZSBzdXJlIHRoYXQgdGhlIHRvb2x0aXBcclxuICAgICAgLy8gY29udGVudCBpcyBub3QgZW1wdHkgYmVmb3JlIHNob3dpbmcgaXRcclxuXHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5keW5hbWljVGl0bGUgJiYgIXJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRG8gbm90IHNob3cgdG9vbHRpcCBpZiByZWZlcmVuY2UgY29udGFpbnMgJ2Rpc2FibGVkJyBhdHRyaWJ1dGUuIEZGIGZpeCBmb3IgIzIyMVxyXG4gICAgICBpZiAocmVmZXJlbmNlLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkgcmV0dXJuO1xyXG5cclxuICAgICAgLy8gRGVzdHJveSB0b29sdGlwIGlmIHRoZSByZWZlcmVuY2UgZWxlbWVudCBpcyBubyBsb25nZXIgb24gdGhlIERPTVxyXG4gICAgICBpZiAoIXJlZmVyZW5jZS5yZWZPYmogJiYgIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jb250YWlucyhyZWZlcmVuY2UpKSB7XHJcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvcHRpb25zLm9uU2hvdy5jYWxsKHBvcHBlciwgdGhpcyk7XHJcblxyXG4gICAgICBkdXJhdGlvbiA9IGdldFZhbHVlKGR1cmF0aW9uICE9PSB1bmRlZmluZWQgPyBkdXJhdGlvbiA6IG9wdGlvbnMuZHVyYXRpb24sIDApO1xyXG5cclxuICAgICAgLy8gUHJldmVudCBhIHRyYW5zaXRpb24gd2hlbiBwb3BwZXIgY2hhbmdlcyBwb3NpdGlvblxyXG4gICAgICBhcHBseVRyYW5zaXRpb25EdXJhdGlvbihbcG9wcGVyLCB0b29sdGlwLCBiYWNrZHJvcF0sIDApO1xyXG5cclxuICAgICAgcG9wcGVyLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XHJcbiAgICAgIHRoaXMuc3RhdGUudmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgICBfbW91bnQuY2FsbCh0aGlzLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCFfdGhpcy5zdGF0ZS52aXNpYmxlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICghX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yLmNhbGwoX3RoaXMpKSB7XHJcbiAgICAgICAgICAvLyBGSVg6IEFycm93IHdpbGwgc29tZXRpbWVzIG5vdCBiZSBwb3NpdGlvbmVkIGNvcnJlY3RseS4gRm9yY2UgYW5vdGhlciB1cGRhdGUuXHJcbiAgICAgICAgICBfdGhpcy5wb3BwZXJJbnN0YW5jZS5zY2hlZHVsZVVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IGluaXRpYWwgcG9zaXRpb24gbmVhciB0aGUgY3Vyc29yXHJcbiAgICAgICAgaWYgKF9oYXNGb2xsb3dDdXJzb3JCZWhhdmlvci5jYWxsKF90aGlzKSkge1xyXG4gICAgICAgICAgX3RoaXMucG9wcGVySW5zdGFuY2UuZGlzYWJsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICB2YXIgZGVsYXkgPSBnZXRWYWx1ZShvcHRpb25zLmRlbGF5LCAwKTtcclxuICAgICAgICAgIHZhciBsYXN0VHJpZ2dlckV2ZW50ID0gX3RoaXMuXyhrZXkpLmxhc3RUcmlnZ2VyRXZlbnQ7XHJcbiAgICAgICAgICBpZiAobGFzdFRyaWdnZXJFdmVudCkge1xyXG4gICAgICAgICAgICBfdGhpcy5fKGtleSkuZm9sbG93Q3Vyc29yTGlzdGVuZXIoZGVsYXkgJiYgX3RoaXMuXyhrZXkpLmxhc3RNb3VzZU1vdmVFdmVudCA/IF90aGlzLl8oa2V5KS5sYXN0TW91c2VNb3ZlRXZlbnQgOiBsYXN0VHJpZ2dlckV2ZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlLWFwcGx5IHRyYW5zaXRpb24gZHVyYXRpb25zXHJcbiAgICAgICAgYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24oW3Rvb2x0aXAsIGJhY2tkcm9wLCBiYWNrZHJvcCA/IGNvbnRlbnQgOiBudWxsXSwgZHVyYXRpb24pO1xyXG5cclxuICAgICAgICBpZiAoYmFja2Ryb3ApIHtcclxuICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUoYmFja2Ryb3ApW3ByZWZpeCgndHJhbnNmb3JtJyldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcclxuICAgICAgICAgIHJlZmVyZW5jZS5jbGFzc0xpc3QuYWRkKCd0aXBweS1hY3RpdmUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zLnN0aWNreSkge1xyXG4gICAgICAgICAgX21ha2VTdGlja3kuY2FsbChfdGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRWaXNpYmlsaXR5U3RhdGUoW3Rvb2x0aXAsIGJhY2tkcm9wXSwgJ3Zpc2libGUnKTtcclxuXHJcbiAgICAgICAgX29uVHJhbnNpdGlvbkVuZC5jYWxsKF90aGlzLCBkdXJhdGlvbiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgaWYgKCFvcHRpb25zLnVwZGF0ZUR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LmFkZCgndGlwcHktbm90cmFuc2l0aW9uJyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKG9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcclxuICAgICAgICAgICAgZm9jdXMocG9wcGVyKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZWZlcmVuY2Uuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgJ3RpcHB5LScgKyBfdGhpcy5pZCk7XHJcblxyXG4gICAgICAgICAgb3B0aW9ucy5vblNob3duLmNhbGwocG9wcGVyLCBfdGhpcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGlkZXMgdGhlIHRvb2x0aXBcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHNcclxuICAgICAqIEBtZW1iZXJvZiBUaXBweVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICovXHJcblxyXG4gIH0sIHtcclxuICAgIGtleTogJ2hpZGUnLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhpZGUoZHVyYXRpb24pIHtcclxuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAodGhpcy5zdGF0ZS5kZXN0cm95ZWQgfHwgIXRoaXMuc3RhdGUuZW5hYmxlZCkgcmV0dXJuO1xyXG5cclxuICAgICAgdmFyIHBvcHBlciA9IHRoaXMucG9wcGVyLFxyXG4gICAgICAgICAgcmVmZXJlbmNlID0gdGhpcy5yZWZlcmVuY2UsXHJcbiAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICAgICAgdmFyIF9nZXRJbm5lckVsZW1lbnRzMiA9IGdldElubmVyRWxlbWVudHMocG9wcGVyKSxcclxuICAgICAgICAgIHRvb2x0aXAgPSBfZ2V0SW5uZXJFbGVtZW50czIudG9vbHRpcCxcclxuICAgICAgICAgIGJhY2tkcm9wID0gX2dldElubmVyRWxlbWVudHMyLmJhY2tkcm9wLFxyXG4gICAgICAgICAgY29udGVudCA9IF9nZXRJbm5lckVsZW1lbnRzMi5jb250ZW50O1xyXG5cclxuICAgICAgb3B0aW9ucy5vbkhpZGUuY2FsbChwb3BwZXIsIHRoaXMpO1xyXG5cclxuICAgICAgZHVyYXRpb24gPSBnZXRWYWx1ZShkdXJhdGlvbiAhPT0gdW5kZWZpbmVkID8gZHVyYXRpb24gOiBvcHRpb25zLmR1cmF0aW9uLCAxKTtcclxuXHJcbiAgICAgIGlmICghb3B0aW9ucy51cGRhdGVEdXJhdGlvbikge1xyXG4gICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgndGlwcHktbm90cmFuc2l0aW9uJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICAgICAgcmVmZXJlbmNlLmNsYXNzTGlzdC5yZW1vdmUoJ3RpcHB5LWFjdGl2ZScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBwb3BwZXIuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICB0aGlzLnN0YXRlLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICAgIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uKFt0b29sdGlwLCBiYWNrZHJvcCwgYmFja2Ryb3AgPyBjb250ZW50IDogbnVsbF0sIGR1cmF0aW9uKTtcclxuXHJcbiAgICAgIHNldFZpc2liaWxpdHlTdGF0ZShbdG9vbHRpcCwgYmFja2Ryb3BdLCAnaGlkZGVuJyk7XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5pbnRlcmFjdGl2ZSAmJiBvcHRpb25zLnRyaWdnZXIuaW5kZXhPZignY2xpY2snKSA+IC0xKSB7XHJcbiAgICAgICAgZm9jdXMocmVmZXJlbmNlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLypcclxuICAgICAgKiBUaGlzIGNhbGwgaXMgZGVmZXJyZWQgYmVjYXVzZSBzb21ldGltZXMgd2hlbiB0aGUgdG9vbHRpcCBpcyBzdGlsbCB0cmFuc2l0aW9uaW5nIGluIGJ1dCBoaWRlKClcclxuICAgICAgKiBpcyBjYWxsZWQgYmVmb3JlIGl0IGZpbmlzaGVzLCB0aGUgQ1NTIHRyYW5zaXRpb24gd29uJ3QgcmV2ZXJzZSBxdWlja2x5IGVub3VnaCwgbWVhbmluZ1xyXG4gICAgICAqIHRoZSBDU1MgdHJhbnNpdGlvbiB3aWxsIGZpbmlzaCAxLTIgZnJhbWVzIGxhdGVyLCBhbmQgb25IaWRkZW4oKSB3aWxsIHJ1biBzaW5jZSB0aGUgSlMgc2V0IGl0XHJcbiAgICAgICogbW9yZSBxdWlja2x5LiBJdCBzaG91bGQgYWN0dWFsbHkgYmUgb25TaG93bigpLiBTZWVtcyB0byBiZSBzb21ldGhpbmcgQ2hyb21lIGRvZXMsIG5vdCBTYWZhcmlcclxuICAgICAgKi9cclxuICAgICAgZGVmZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9vblRyYW5zaXRpb25FbmQuY2FsbChfdGhpczIsIGR1cmF0aW9uLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoX3RoaXMyLnN0YXRlLnZpc2libGUgfHwgIW9wdGlvbnMuYXBwZW5kVG8uY29udGFpbnMocG9wcGVyKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgIGlmICghX3RoaXMyLl8oa2V5KS5pc1ByZXBhcmluZ1RvU2hvdykge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfdGhpczIuXyhrZXkpLmZvbGxvd0N1cnNvckxpc3RlbmVyKTtcclxuICAgICAgICAgICAgX3RoaXMyLl8oa2V5KS5sYXN0TW91c2VNb3ZlRXZlbnQgPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChfdGhpczIucG9wcGVySW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgX3RoaXMyLnBvcHBlckluc3RhbmNlLmRpc2FibGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJlZmVyZW5jZS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuXHJcbiAgICAgICAgICBvcHRpb25zLmFwcGVuZFRvLnJlbW92ZUNoaWxkKHBvcHBlcik7XHJcblxyXG4gICAgICAgICAgb3B0aW9ucy5vbkhpZGRlbi5jYWxsKHBvcHBlciwgX3RoaXMyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXN0cm95cyB0aGUgdG9vbHRpcCBpbnN0YW5jZVxyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBkZXN0cm95VGFyZ2V0SW5zdGFuY2VzIC0gcmVsZXZhbnQgb25seSB3aGVuIGRlc3Ryb3lpbmcgZGVsZWdhdGVzXHJcbiAgICAgKiBAbWVtYmVyb2YgVGlwcHlcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqL1xyXG5cclxuICB9LCB7XHJcbiAgICBrZXk6ICdkZXN0cm95JyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcclxuXHJcbiAgICAgIHZhciBkZXN0cm95VGFyZ2V0SW5zdGFuY2VzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xyXG5cclxuICAgICAgaWYgKHRoaXMuc3RhdGUuZGVzdHJveWVkKSByZXR1cm47XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIHBvcHBlciBpcyBoaWRkZW5cclxuICAgICAgaWYgKHRoaXMuc3RhdGUudmlzaWJsZSkge1xyXG4gICAgICAgIHRoaXMuaGlkZSgwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcclxuICAgICAgICBfdGhpczMucmVmZXJlbmNlLnJlbW92ZUV2ZW50TGlzdGVuZXIobGlzdGVuZXIuZXZlbnQsIGxpc3RlbmVyLmhhbmRsZXIpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIFJlc3RvcmUgdGl0bGVcclxuICAgICAgaWYgKHRoaXMudGl0bGUpIHtcclxuICAgICAgICB0aGlzLnJlZmVyZW5jZS5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgdGhpcy50aXRsZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRlbGV0ZSB0aGlzLnJlZmVyZW5jZS5fdGlwcHk7XHJcblxyXG4gICAgICB2YXIgYXR0cmlidXRlcyA9IFsnZGF0YS1vcmlnaW5hbC10aXRsZScsICdkYXRhLXRpcHB5JywgJ2RhdGEtdGlwcHktZGVsZWdhdGUnXTtcclxuICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XHJcbiAgICAgICAgX3RoaXMzLnJlZmVyZW5jZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy50YXJnZXQgJiYgZGVzdHJveVRhcmdldEluc3RhbmNlcykge1xyXG4gICAgICAgIHRvQXJyYXkodGhpcy5yZWZlcmVuY2UucXVlcnlTZWxlY3RvckFsbCh0aGlzLm9wdGlvbnMudGFyZ2V0KSkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcclxuICAgICAgICAgIHJldHVybiBjaGlsZC5fdGlwcHkgJiYgY2hpbGQuX3RpcHB5LmRlc3Ryb3koKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMucG9wcGVySW5zdGFuY2UpIHtcclxuICAgICAgICB0aGlzLnBvcHBlckluc3RhbmNlLmRlc3Ryb3koKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fKGtleSkubXV0YXRpb25PYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcclxuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5zdGF0ZS5kZXN0cm95ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1dKTtcclxuICByZXR1cm4gVGlwcHk7XHJcbn0oKTtcclxuXHJcbi8qKlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogUHJpdmF0ZSBtZXRob2RzXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBTdGFuZGFsb25lIGZ1bmN0aW9ucyB0byBiZSBjYWxsZWQgd2l0aCB0aGUgaW5zdGFuY2UncyBgdGhpc2AgY29udGV4dCB0byBtYWtlXHJcbiAqIHRoZW0gdHJ1bHkgcHJpdmF0ZSBhbmQgbm90IGFjY2Vzc2libGUgb24gdGhlIHByb3RvdHlwZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSB0b29sdGlwIGluc3RhbmNlIGhhcyBmb2xsb3dDdXJzb3IgYmVoYXZpb3JcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfaGFzRm9sbG93Q3Vyc29yQmVoYXZpb3IoKSB7XHJcbiAgdmFyIGxhc3RUcmlnZ2VyRXZlbnQgPSB0aGlzLl8oa2V5KS5sYXN0VHJpZ2dlckV2ZW50O1xyXG4gIHJldHVybiB0aGlzLm9wdGlvbnMuZm9sbG93Q3Vyc29yICYmICFicm93c2VyLnVzaW5nVG91Y2ggJiYgbGFzdFRyaWdnZXJFdmVudCAmJiBsYXN0VHJpZ2dlckV2ZW50LnR5cGUgIT09ICdmb2N1cyc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIHRoZSBUaXBweSBpbnN0YW5jZSBmb3IgdGhlIGNoaWxkIHRhcmdldCBvZiB0aGUgZGVsZWdhdGUgY29udGFpbmVyXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2NyZWF0ZURlbGVnYXRlQ2hpbGRUaXBweShldmVudCkge1xyXG4gIHZhciB0YXJnZXRFbCA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCB0aGlzLm9wdGlvbnMudGFyZ2V0KTtcclxuICBpZiAodGFyZ2V0RWwgJiYgIXRhcmdldEVsLl90aXBweSkge1xyXG4gICAgdmFyIHRpdGxlID0gdGFyZ2V0RWwuZ2V0QXR0cmlidXRlKCd0aXRsZScpIHx8IHRoaXMudGl0bGU7XHJcbiAgICBpZiAodGl0bGUpIHtcclxuICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCd0aXRsZScsIHRpdGxlKTtcclxuICAgICAgdGlwcHkkMSh0YXJnZXRFbCwgX2V4dGVuZHMoe30sIHRoaXMub3B0aW9ucywgeyB0YXJnZXQ6IG51bGwgfSkpO1xyXG4gICAgICBfZW50ZXIuY2FsbCh0YXJnZXRFbC5fdGlwcHksIGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNZXRob2QgdXNlZCBieSBldmVudCBsaXN0ZW5lcnMgdG8gaW52b2tlIHRoZSBzaG93IG1ldGhvZCwgdGFraW5nIGludG8gYWNjb3VudCBkZWxheXMgYW5kXHJcbiAqIHRoZSBgd2FpdGAgb3B0aW9uXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2VudGVyKGV2ZW50KSB7XHJcbiAgdmFyIF90aGlzNCA9IHRoaXM7XHJcblxyXG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuXHJcbiAgX2NsZWFyRGVsYXlUaW1lb3V0cy5jYWxsKHRoaXMpO1xyXG5cclxuICBpZiAodGhpcy5zdGF0ZS52aXNpYmxlKSByZXR1cm47XHJcblxyXG4gIC8vIElzIGEgZGVsZWdhdGUsIGNyZWF0ZSBUaXBweSBpbnN0YW5jZSBmb3IgdGhlIGNoaWxkIHRhcmdldFxyXG4gIGlmIChvcHRpb25zLnRhcmdldCkge1xyXG4gICAgX2NyZWF0ZURlbGVnYXRlQ2hpbGRUaXBweS5jYWxsKHRoaXMsIGV2ZW50KTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHRoaXMuXyhrZXkpLmlzUHJlcGFyaW5nVG9TaG93ID0gdHJ1ZTtcclxuXHJcbiAgaWYgKG9wdGlvbnMud2FpdCkge1xyXG4gICAgb3B0aW9ucy53YWl0LmNhbGwodGhpcy5wb3BwZXIsIHRoaXMuc2hvdy5iaW5kKHRoaXMpLCBldmVudCk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGUgdG9vbHRpcCBoYXMgYSBkZWxheSwgd2UgbmVlZCB0byBiZSBsaXN0ZW5pbmcgdG8gdGhlIG1vdXNlbW92ZSBhcyBzb29uIGFzIHRoZSB0cmlnZ2VyXHJcbiAgLy8gZXZlbnQgaXMgZmlyZWQgc28gdGhhdCBpdCdzIGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uIHVwb24gbW91bnQuXHJcbiAgaWYgKF9oYXNGb2xsb3dDdXJzb3JCZWhhdmlvci5jYWxsKHRoaXMpKSB7XHJcbiAgICBpZiAoIXRoaXMuXyhrZXkpLmZvbGxvd0N1cnNvckxpc3RlbmVyKSB7XHJcbiAgICAgIF9zZXRGb2xsb3dDdXJzb3JMaXN0ZW5lci5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBfZ2V0SW5uZXJFbGVtZW50czMgPSBnZXRJbm5lckVsZW1lbnRzKHRoaXMucG9wcGVyKSxcclxuICAgICAgICBhcnJvdyA9IF9nZXRJbm5lckVsZW1lbnRzMy5hcnJvdztcclxuXHJcbiAgICBpZiAoYXJyb3cpIGFycm93LnN0eWxlLm1hcmdpbiA9ICcwJztcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuXyhrZXkpLmZvbGxvd0N1cnNvckxpc3RlbmVyKTtcclxuICB9XHJcblxyXG4gIHZhciBkZWxheSA9IGdldFZhbHVlKG9wdGlvbnMuZGVsYXksIDApO1xyXG5cclxuICBpZiAoZGVsYXkpIHtcclxuICAgIHRoaXMuXyhrZXkpLnNob3dUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIF90aGlzNC5zaG93KCk7XHJcbiAgICB9LCBkZWxheSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMuc2hvdygpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIE1ldGhvZCB1c2VkIGJ5IGV2ZW50IGxpc3RlbmVycyB0byBpbnZva2UgdGhlIGhpZGUgbWV0aG9kLCB0YWtpbmcgaW50byBhY2NvdW50IGRlbGF5c1xyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9sZWF2ZSgpIHtcclxuICB2YXIgX3RoaXM1ID0gdGhpcztcclxuXHJcbiAgX2NsZWFyRGVsYXlUaW1lb3V0cy5jYWxsKHRoaXMpO1xyXG5cclxuICBpZiAoIXRoaXMuc3RhdGUudmlzaWJsZSkgcmV0dXJuO1xyXG5cclxuICB0aGlzLl8oa2V5KS5pc1ByZXBhcmluZ1RvU2hvdyA9IGZhbHNlO1xyXG5cclxuICB2YXIgZGVsYXkgPSBnZXRWYWx1ZSh0aGlzLm9wdGlvbnMuZGVsYXksIDEpO1xyXG5cclxuICBpZiAoZGVsYXkpIHtcclxuICAgIHRoaXMuXyhrZXkpLmhpZGVUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChfdGhpczUuc3RhdGUudmlzaWJsZSkge1xyXG4gICAgICAgIF90aGlzNS5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIGRlbGF5KTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5oaWRlKCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyByZWxldmFudCBsaXN0ZW5lcnMgZm9yIHRoZSBpbnN0YW5jZVxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IG9mIGxpc3RlbmVyc1xyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9nZXRFdmVudExpc3RlbmVycygpIHtcclxuICB2YXIgX3RoaXM2ID0gdGhpcztcclxuXHJcbiAgdmFyIG9uVHJpZ2dlciA9IGZ1bmN0aW9uIG9uVHJpZ2dlcihldmVudCkge1xyXG4gICAgaWYgKCFfdGhpczYuc3RhdGUuZW5hYmxlZCkgcmV0dXJuO1xyXG5cclxuICAgIHZhciBzaG91bGRTdG9wRXZlbnQgPSBicm93c2VyLnN1cHBvcnRzVG91Y2ggJiYgYnJvd3Nlci51c2luZ1RvdWNoICYmIFsnbW91c2VlbnRlcicsICdtb3VzZW92ZXInLCAnZm9jdXMnXS5pbmRleE9mKGV2ZW50LnR5cGUpID4gLTE7XHJcblxyXG4gICAgaWYgKHNob3VsZFN0b3BFdmVudCAmJiBfdGhpczYub3B0aW9ucy50b3VjaEhvbGQpIHJldHVybjtcclxuXHJcbiAgICBfdGhpczYuXyhrZXkpLmxhc3RUcmlnZ2VyRXZlbnQgPSBldmVudDtcclxuXHJcbiAgICAvLyBUb2dnbGUgc2hvdy9oaWRlIHdoZW4gY2xpY2tpbmcgY2xpY2stdHJpZ2dlcmVkIHRvb2x0aXBzXHJcbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJyAmJiBfdGhpczYub3B0aW9ucy5oaWRlT25DbGljayAhPT0gJ3BlcnNpc3RlbnQnICYmIF90aGlzNi5zdGF0ZS52aXNpYmxlKSB7XHJcbiAgICAgIF9sZWF2ZS5jYWxsKF90aGlzNik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBfZW50ZXIuY2FsbChfdGhpczYsIGV2ZW50KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgb25Nb3VzZUxlYXZlID0gZnVuY3Rpb24gb25Nb3VzZUxlYXZlKGV2ZW50KSB7XHJcbiAgICBpZiAoWydtb3VzZWxlYXZlJywgJ21vdXNlb3V0J10uaW5kZXhPZihldmVudC50eXBlKSA+IC0xICYmIGJyb3dzZXIuc3VwcG9ydHNUb3VjaCAmJiBicm93c2VyLnVzaW5nVG91Y2ggJiYgX3RoaXM2Lm9wdGlvbnMudG91Y2hIb2xkKSByZXR1cm47XHJcblxyXG4gICAgaWYgKF90aGlzNi5vcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICAgIHZhciBoaWRlID0gX2xlYXZlLmJpbmQoX3RoaXM2KTtcclxuXHJcbiAgICAgIHZhciBvbk1vdXNlTW92ZSA9IGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIHJlZmVyZW5jZUN1cnNvcklzT3ZlciA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBzZWxlY3RvcnMuUkVGRVJFTkNFKTtcclxuICAgICAgICB2YXIgY3Vyc29ySXNPdmVyUG9wcGVyID0gY2xvc2VzdChldmVudC50YXJnZXQsIHNlbGVjdG9ycy5QT1BQRVIpID09PSBfdGhpczYucG9wcGVyO1xyXG4gICAgICAgIHZhciBjdXJzb3JJc092ZXJSZWZlcmVuY2UgPSByZWZlcmVuY2VDdXJzb3JJc092ZXIgPT09IF90aGlzNi5yZWZlcmVuY2U7XHJcblxyXG4gICAgICAgIGlmIChjdXJzb3JJc092ZXJQb3BwZXIgfHwgY3Vyc29ySXNPdmVyUmVmZXJlbmNlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChjdXJzb3JJc091dHNpZGVJbnRlcmFjdGl2ZUJvcmRlcihldmVudCwgX3RoaXM2LnBvcHBlciwgX3RoaXM2Lm9wdGlvbnMpKSB7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoaWRlKTtcclxuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcclxuXHJcbiAgICAgICAgICBfbGVhdmUuY2FsbChfdGhpczYsIG9uTW91c2VNb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoaWRlKTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgX2xlYXZlLmNhbGwoX3RoaXM2KTtcclxuICB9O1xyXG5cclxuICB2YXIgb25CbHVyID0gZnVuY3Rpb24gb25CbHVyKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0ICE9PSBfdGhpczYucmVmZXJlbmNlIHx8IGJyb3dzZXIudXNpbmdUb3VjaCkgcmV0dXJuO1xyXG5cclxuICAgIGlmIChfdGhpczYub3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xyXG4gICAgICBpZiAoIWV2ZW50LnJlbGF0ZWRUYXJnZXQpIHJldHVybjtcclxuICAgICAgaWYgKGNsb3Nlc3QoZXZlbnQucmVsYXRlZFRhcmdldCwgc2VsZWN0b3JzLlBPUFBFUikpIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBfbGVhdmUuY2FsbChfdGhpczYpO1xyXG4gIH07XHJcblxyXG4gIHZhciBvbkRlbGVnYXRlU2hvdyA9IGZ1bmN0aW9uIG9uRGVsZWdhdGVTaG93KGV2ZW50KSB7XHJcbiAgICBpZiAoY2xvc2VzdChldmVudC50YXJnZXQsIF90aGlzNi5vcHRpb25zLnRhcmdldCkpIHtcclxuICAgICAgX2VudGVyLmNhbGwoX3RoaXM2LCBldmVudCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIG9uRGVsZWdhdGVIaWRlID0gZnVuY3Rpb24gb25EZWxlZ2F0ZUhpZGUoZXZlbnQpIHtcclxuICAgIGlmIChjbG9zZXN0KGV2ZW50LnRhcmdldCwgX3RoaXM2Lm9wdGlvbnMudGFyZ2V0KSkge1xyXG4gICAgICBfbGVhdmUuY2FsbChfdGhpczYpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBvblRyaWdnZXI6IG9uVHJpZ2dlcixcclxuICAgIG9uTW91c2VMZWF2ZTogb25Nb3VzZUxlYXZlLFxyXG4gICAgb25CbHVyOiBvbkJsdXIsXHJcbiAgICBvbkRlbGVnYXRlU2hvdzogb25EZWxlZ2F0ZVNob3csXHJcbiAgICBvbkRlbGVnYXRlSGlkZTogb25EZWxlZ2F0ZUhpZGVcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIG5ldyBwb3BwZXIgaW5zdGFuY2VcclxuICogQHJldHVybiB7UG9wcGVyfVxyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9jcmVhdGVQb3BwZXJJbnN0YW5jZSgpIHtcclxuICB2YXIgX3RoaXM3ID0gdGhpcztcclxuXHJcbiAgdmFyIHBvcHBlciA9IHRoaXMucG9wcGVyLFxyXG4gICAgICByZWZlcmVuY2UgPSB0aGlzLnJlZmVyZW5jZSxcclxuICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHJcbiAgdmFyIF9nZXRJbm5lckVsZW1lbnRzNCA9IGdldElubmVyRWxlbWVudHMocG9wcGVyKSxcclxuICAgICAgdG9vbHRpcCA9IF9nZXRJbm5lckVsZW1lbnRzNC50b29sdGlwO1xyXG5cclxuICB2YXIgcG9wcGVyT3B0aW9ucyA9IG9wdGlvbnMucG9wcGVyT3B0aW9ucztcclxuXHJcbiAgdmFyIGFycm93U2VsZWN0b3IgPSBvcHRpb25zLmFycm93VHlwZSA9PT0gJ3JvdW5kJyA/IHNlbGVjdG9ycy5ST1VORF9BUlJPVyA6IHNlbGVjdG9ycy5BUlJPVztcclxuICB2YXIgYXJyb3cgPSB0b29sdGlwLnF1ZXJ5U2VsZWN0b3IoYXJyb3dTZWxlY3Rvcik7XHJcblxyXG4gIHZhciBjb25maWcgPSBfZXh0ZW5kcyh7XHJcbiAgICBwbGFjZW1lbnQ6IG9wdGlvbnMucGxhY2VtZW50XHJcbiAgfSwgcG9wcGVyT3B0aW9ucyB8fCB7fSwge1xyXG4gICAgbW9kaWZpZXJzOiBfZXh0ZW5kcyh7fSwgcG9wcGVyT3B0aW9ucyA/IHBvcHBlck9wdGlvbnMubW9kaWZpZXJzIDoge30sIHtcclxuICAgICAgYXJyb3c6IF9leHRlbmRzKHtcclxuICAgICAgICBlbGVtZW50OiBhcnJvd1NlbGVjdG9yXHJcbiAgICAgIH0sIHBvcHBlck9wdGlvbnMgJiYgcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMgPyBwb3BwZXJPcHRpb25zLm1vZGlmaWVycy5hcnJvdyA6IHt9KSxcclxuICAgICAgZmxpcDogX2V4dGVuZHMoe1xyXG4gICAgICAgIGVuYWJsZWQ6IG9wdGlvbnMuZmxpcCxcclxuICAgICAgICBwYWRkaW5nOiBvcHRpb25zLmRpc3RhbmNlICsgNSAvKiA1cHggZnJvbSB2aWV3cG9ydCBib3VuZGFyeSAqL1xyXG4gICAgICAgICwgYmVoYXZpb3I6IG9wdGlvbnMuZmxpcEJlaGF2aW9yXHJcbiAgICAgIH0sIHBvcHBlck9wdGlvbnMgJiYgcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMgPyBwb3BwZXJPcHRpb25zLm1vZGlmaWVycy5mbGlwIDoge30pLFxyXG4gICAgICBvZmZzZXQ6IF9leHRlbmRzKHtcclxuICAgICAgICBvZmZzZXQ6IG9wdGlvbnMub2Zmc2V0XHJcbiAgICAgIH0sIHBvcHBlck9wdGlvbnMgJiYgcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMgPyBwb3BwZXJPcHRpb25zLm1vZGlmaWVycy5vZmZzZXQgOiB7fSlcclxuICAgIH0pLFxyXG4gICAgb25DcmVhdGU6IGZ1bmN0aW9uIG9uQ3JlYXRlKCkge1xyXG4gICAgICB0b29sdGlwLnN0eWxlW2dldFBvcHBlclBsYWNlbWVudChwb3BwZXIpXSA9IGdldE9mZnNldERpc3RhbmNlSW5QeChvcHRpb25zLmRpc3RhbmNlKTtcclxuXHJcbiAgICAgIGlmIChhcnJvdyAmJiBvcHRpb25zLmFycm93VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY29tcHV0ZUFycm93VHJhbnNmb3JtKHBvcHBlciwgYXJyb3csIG9wdGlvbnMuYXJyb3dUcmFuc2Zvcm0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgb25VcGRhdGU6IGZ1bmN0aW9uIG9uVXBkYXRlKCkge1xyXG4gICAgICB2YXIgc3R5bGVzID0gdG9vbHRpcC5zdHlsZTtcclxuICAgICAgc3R5bGVzLnRvcCA9ICcnO1xyXG4gICAgICBzdHlsZXMuYm90dG9tID0gJyc7XHJcbiAgICAgIHN0eWxlcy5sZWZ0ID0gJyc7XHJcbiAgICAgIHN0eWxlcy5yaWdodCA9ICcnO1xyXG4gICAgICBzdHlsZXNbZ2V0UG9wcGVyUGxhY2VtZW50KHBvcHBlcildID0gZ2V0T2Zmc2V0RGlzdGFuY2VJblB4KG9wdGlvbnMuZGlzdGFuY2UpO1xyXG5cclxuICAgICAgaWYgKGFycm93ICYmIG9wdGlvbnMuYXJyb3dUcmFuc2Zvcm0pIHtcclxuICAgICAgICBjb21wdXRlQXJyb3dUcmFuc2Zvcm0ocG9wcGVyLCBhcnJvdywgb3B0aW9ucy5hcnJvd1RyYW5zZm9ybSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgX2FkZE11dGF0aW9uT2JzZXJ2ZXIuY2FsbCh0aGlzLCB7XHJcbiAgICB0YXJnZXQ6IHBvcHBlcixcclxuICAgIGNhbGxiYWNrOiBmdW5jdGlvbiBjYWxsYmFjaygpIHtcclxuICAgICAgX3RoaXM3LnBvcHBlckluc3RhbmNlLnVwZGF0ZSgpO1xyXG4gICAgfSxcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgICBzdWJ0cmVlOiB0cnVlLFxyXG4gICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBuZXcgUG9wcGVyKHJlZmVyZW5jZSwgcG9wcGVyLCBjb25maWcpO1xyXG59XHJcblxyXG4vKipcclxuICogQXBwZW5kcyB0aGUgcG9wcGVyIGVsZW1lbnQgdG8gdGhlIERPTSwgdXBkYXRpbmcgb3IgY3JlYXRpbmcgdGhlIHBvcHBlciBpbnN0YW5jZVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9tb3VudChjYWxsYmFjaykge1xyXG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuXHJcbiAgaWYgKCF0aGlzLnBvcHBlckluc3RhbmNlKSB7XHJcbiAgICB0aGlzLnBvcHBlckluc3RhbmNlID0gX2NyZWF0ZVBvcHBlckluc3RhbmNlLmNhbGwodGhpcyk7XHJcbiAgICBpZiAoIW9wdGlvbnMubGl2ZVBsYWNlbWVudCkge1xyXG4gICAgICB0aGlzLnBvcHBlckluc3RhbmNlLmRpc2FibGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLnBvcHBlckluc3RhbmNlLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgICBpZiAob3B0aW9ucy5saXZlUGxhY2VtZW50ICYmICFfaGFzRm9sbG93Q3Vyc29yQmVoYXZpb3IuY2FsbCh0aGlzKSkge1xyXG4gICAgICB0aGlzLnBvcHBlckluc3RhbmNlLmVuYWJsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGUgaW5zdGFuY2UgcHJldmlvdXNseSBoYWQgZm9sbG93Q3Vyc29yIGJlaGF2aW9yLCBpdCB3aWxsIGJlIHBvc2l0aW9uZWQgaW5jb3JyZWN0bHlcclxuICAvLyBpZiB0cmlnZ2VyZWQgYnkgYGZvY3VzYCBhZnRlcndhcmRzIC0gdXBkYXRlIHRoZSByZWZlcmVuY2UgYmFjayB0byB0aGUgcmVhbCBET00gZWxlbWVudFxyXG4gIGlmICghX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yLmNhbGwodGhpcykpIHtcclxuICAgIHZhciBfZ2V0SW5uZXJFbGVtZW50czUgPSBnZXRJbm5lckVsZW1lbnRzKHRoaXMucG9wcGVyKSxcclxuICAgICAgICBhcnJvdyA9IF9nZXRJbm5lckVsZW1lbnRzNS5hcnJvdztcclxuXHJcbiAgICBpZiAoYXJyb3cpIGFycm93LnN0eWxlLm1hcmdpbiA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXJJbnN0YW5jZS5yZWZlcmVuY2UgPSB0aGlzLnJlZmVyZW5jZTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVBvcHBlclBvc2l0aW9uKHRoaXMucG9wcGVySW5zdGFuY2UsIGNhbGxiYWNrLCB0cnVlKTtcclxuXHJcbiAgaWYgKCFvcHRpb25zLmFwcGVuZFRvLmNvbnRhaW5zKHRoaXMucG9wcGVyKSkge1xyXG4gICAgb3B0aW9ucy5hcHBlbmRUby5hcHBlbmRDaGlsZCh0aGlzLnBvcHBlcik7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2xlYXJzIHRoZSBzaG93IGFuZCBoaWRlIGRlbGF5IHRpbWVvdXRzXHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2NsZWFyRGVsYXlUaW1lb3V0cygpIHtcclxuICB2YXIgX3JlZiA9IHRoaXMuXyhrZXkpLFxyXG4gICAgICBzaG93VGltZW91dCA9IF9yZWYuc2hvd1RpbWVvdXQsXHJcbiAgICAgIGhpZGVUaW1lb3V0ID0gX3JlZi5oaWRlVGltZW91dDtcclxuXHJcbiAgY2xlYXJUaW1lb3V0KHNob3dUaW1lb3V0KTtcclxuICBjbGVhclRpbWVvdXQoaGlkZVRpbWVvdXQpO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0cyB0aGUgbW91c2Vtb3ZlIGV2ZW50IGxpc3RlbmVyIGZ1bmN0aW9uIGZvciBgZm9sbG93Q3Vyc29yYCBvcHRpb25cclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfc2V0Rm9sbG93Q3Vyc29yTGlzdGVuZXIoKSB7XHJcbiAgdmFyIF90aGlzOCA9IHRoaXM7XHJcblxyXG4gIHRoaXMuXyhrZXkpLmZvbGxvd0N1cnNvckxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgXyRsYXN0TW91c2VNb3ZlRXZlbnQgPSBfdGhpczguXyhrZXkpLmxhc3RNb3VzZU1vdmVFdmVudCA9IGV2ZW50LFxyXG4gICAgICAgIGNsaWVudFggPSBfJGxhc3RNb3VzZU1vdmVFdmVudC5jbGllbnRYLFxyXG4gICAgICAgIGNsaWVudFkgPSBfJGxhc3RNb3VzZU1vdmVFdmVudC5jbGllbnRZO1xyXG5cclxuICAgIGlmICghX3RoaXM4LnBvcHBlckluc3RhbmNlKSByZXR1cm47XHJcblxyXG4gICAgX3RoaXM4LnBvcHBlckluc3RhbmNlLnJlZmVyZW5jZSA9IHtcclxuICAgICAgZ2V0Qm91bmRpbmdDbGllbnRSZWN0OiBmdW5jdGlvbiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgICAgdG9wOiBjbGllbnRZLFxyXG4gICAgICAgICAgbGVmdDogY2xpZW50WCxcclxuICAgICAgICAgIHJpZ2h0OiBjbGllbnRYLFxyXG4gICAgICAgICAgYm90dG9tOiBjbGllbnRZXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgICAgY2xpZW50V2lkdGg6IDAsXHJcbiAgICAgIGNsaWVudEhlaWdodDogMFxyXG4gICAgfTtcclxuXHJcbiAgICBfdGhpczgucG9wcGVySW5zdGFuY2Uuc2NoZWR1bGVVcGRhdGUoKTtcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlcyB0aGUgcG9wcGVyJ3MgcG9zaXRpb24gb24gZWFjaCBhbmltYXRpb24gZnJhbWVcclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfbWFrZVN0aWNreSgpIHtcclxuICB2YXIgX3RoaXM5ID0gdGhpcztcclxuXHJcbiAgdmFyIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uJCQxID0gZnVuY3Rpb24gYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24kJDEoKSB7XHJcbiAgICBfdGhpczkucG9wcGVyLnN0eWxlW3ByZWZpeCgndHJhbnNpdGlvbkR1cmF0aW9uJyldID0gX3RoaXM5Lm9wdGlvbnMudXBkYXRlRHVyYXRpb24gKyAnbXMnO1xyXG4gIH07XHJcblxyXG4gIHZhciByZW1vdmVUcmFuc2l0aW9uRHVyYXRpb24gPSBmdW5jdGlvbiByZW1vdmVUcmFuc2l0aW9uRHVyYXRpb24oKSB7XHJcbiAgICBfdGhpczkucG9wcGVyLnN0eWxlW3ByZWZpeCgndHJhbnNpdGlvbkR1cmF0aW9uJyldID0gJyc7XHJcbiAgfTtcclxuXHJcbiAgdmFyIHVwZGF0ZVBvc2l0aW9uID0gZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24oKSB7XHJcbiAgICBpZiAoX3RoaXM5LnBvcHBlckluc3RhbmNlKSB7XHJcbiAgICAgIF90aGlzOS5wb3BwZXJJbnN0YW5jZS51cGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseVRyYW5zaXRpb25EdXJhdGlvbiQkMSgpO1xyXG5cclxuICAgIGlmIChfdGhpczkuc3RhdGUudmlzaWJsZSkge1xyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlUG9zaXRpb24pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVtb3ZlVHJhbnNpdGlvbkR1cmF0aW9uKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdXBkYXRlUG9zaXRpb24oKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZHMgYSBtdXRhdGlvbiBvYnNlcnZlciB0byBhbiBlbGVtZW50IGFuZCBzdG9yZXMgaXQgaW4gdGhlIGluc3RhbmNlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fVxyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9hZGRNdXRhdGlvbk9ic2VydmVyKF9yZWYyKSB7XHJcbiAgdmFyIHRhcmdldCA9IF9yZWYyLnRhcmdldCxcclxuICAgICAgY2FsbGJhY2sgPSBfcmVmMi5jYWxsYmFjayxcclxuICAgICAgb3B0aW9ucyA9IF9yZWYyLm9wdGlvbnM7XHJcblxyXG4gIGlmICghd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIpIHJldHVybjtcclxuXHJcbiAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xyXG4gIG9ic2VydmVyLm9ic2VydmUodGFyZ2V0LCBvcHRpb25zKTtcclxuXHJcbiAgdGhpcy5fKGtleSkubXV0YXRpb25PYnNlcnZlcnMucHVzaChvYnNlcnZlcik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGaXJlcyB0aGUgY2FsbGJhY2sgZnVuY3Rpb25zIG9uY2UgdGhlIENTUyB0cmFuc2l0aW9uIGVuZHMgZm9yIGBzaG93YCBhbmQgYGhpZGVgIG1ldGhvZHNcclxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZmlyZSBvbmNlIHRyYW5zaXRpb24gY29tcGxldGVzXHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX29uVHJhbnNpdGlvbkVuZChkdXJhdGlvbiwgY2FsbGJhY2spIHtcclxuICAvLyBNYWtlIGNhbGxiYWNrIHN5bmNocm9ub3VzIGlmIGR1cmF0aW9uIGlzIDBcclxuICBpZiAoIWR1cmF0aW9uKSB7XHJcbiAgICByZXR1cm4gY2FsbGJhY2soKTtcclxuICB9XHJcblxyXG4gIHZhciBfZ2V0SW5uZXJFbGVtZW50czYgPSBnZXRJbm5lckVsZW1lbnRzKHRoaXMucG9wcGVyKSxcclxuICAgICAgdG9vbHRpcCA9IF9nZXRJbm5lckVsZW1lbnRzNi50b29sdGlwO1xyXG5cclxuICB2YXIgdG9nZ2xlTGlzdGVuZXJzID0gZnVuY3Rpb24gdG9nZ2xlTGlzdGVuZXJzKGFjdGlvbiwgbGlzdGVuZXIpIHtcclxuICAgIGlmICghbGlzdGVuZXIpIHJldHVybjtcclxuICAgIHRvb2x0aXBbYWN0aW9uICsgJ0V2ZW50TGlzdGVuZXInXSgnb250cmFuc2l0aW9uZW5kJyBpbiB3aW5kb3cgPyAndHJhbnNpdGlvbmVuZCcgOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsIGxpc3RlbmVyKTtcclxuICB9O1xyXG5cclxuICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiBsaXN0ZW5lcihlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQgPT09IHRvb2x0aXApIHtcclxuICAgICAgdG9nZ2xlTGlzdGVuZXJzKCdyZW1vdmUnLCBsaXN0ZW5lcik7XHJcbiAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdG9nZ2xlTGlzdGVuZXJzKCdyZW1vdmUnLCB0aGlzLl8oa2V5KS50cmFuc2l0aW9uZW5kTGlzdGVuZXIpO1xyXG4gIHRvZ2dsZUxpc3RlbmVycygnYWRkJywgbGlzdGVuZXIpO1xyXG5cclxuICB0aGlzLl8oa2V5KS50cmFuc2l0aW9uZW5kTGlzdGVuZXIgPSBsaXN0ZW5lcjtcclxufVxyXG5cclxudmFyIGlkQ291bnRlciA9IDE7XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyB0b29sdGlwcyBmb3IgZWFjaCByZWZlcmVuY2UgZWxlbWVudFxyXG4gKiBAcGFyYW0ge0VsZW1lbnRbXX0gZWxzXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICogQHJldHVybiB7VGlwcHlbXX0gQXJyYXkgb2YgVGlwcHkgaW5zdGFuY2VzXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVUb29sdGlwcyhlbHMsIGNvbmZpZykge1xyXG4gIHJldHVybiBlbHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHJlZmVyZW5jZSkge1xyXG4gICAgdmFyIGlkID0gaWRDb3VudGVyO1xyXG5cclxuICAgIHZhciBvcHRpb25zID0gZXZhbHVhdGVPcHRpb25zKHJlZmVyZW5jZSwgY29uZmlnLnBlcmZvcm1hbmNlID8gY29uZmlnIDogZ2V0SW5kaXZpZHVhbE9wdGlvbnMocmVmZXJlbmNlLCBjb25maWcpKTtcclxuXHJcbiAgICB2YXIgdGl0bGUgPSByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCd0aXRsZScpO1xyXG5cclxuICAgIC8vIERvbid0IGNyZWF0ZSBhbiBpbnN0YW5jZSB3aGVuOlxyXG4gICAgLy8gKiB0aGUgYHRpdGxlYCBhdHRyaWJ1dGUgaXMgZmFsc3kgKG51bGwgb3IgZW1wdHkgc3RyaW5nKSwgYW5kXHJcbiAgICAvLyAqIGl0J3Mgbm90IGEgZGVsZWdhdGUgZm9yIHRvb2x0aXBzLCBhbmRcclxuICAgIC8vICogdGhlcmUgaXMgbm8gaHRtbCB0ZW1wbGF0ZSBzcGVjaWZpZWQsIGFuZFxyXG4gICAgLy8gKiBgZHluYW1pY1RpdGxlYCBvcHRpb24gaXMgZmFsc2VcclxuICAgIGlmICghdGl0bGUgJiYgIW9wdGlvbnMudGFyZ2V0ICYmICFvcHRpb25zLmh0bWwgJiYgIW9wdGlvbnMuZHluYW1pY1RpdGxlKSB7XHJcbiAgICAgIHJldHVybiBhY2M7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGVsZWdhdGVzIHNob3VsZCBiZSBoaWdobGlnaHRlZCBhcyBkaWZmZXJlbnRcclxuICAgIHJlZmVyZW5jZS5zZXRBdHRyaWJ1dGUob3B0aW9ucy50YXJnZXQgPyAnZGF0YS10aXBweS1kZWxlZ2F0ZScgOiAnZGF0YS10aXBweScsICcnKTtcclxuXHJcbiAgICByZW1vdmVUaXRsZShyZWZlcmVuY2UpO1xyXG5cclxuICAgIHZhciBwb3BwZXIgPSBjcmVhdGVQb3BwZXJFbGVtZW50KGlkLCB0aXRsZSwgb3B0aW9ucyk7XHJcblxyXG4gICAgdmFyIHRpcHB5ID0gbmV3IFRpcHB5KHtcclxuICAgICAgaWQ6IGlkLFxyXG4gICAgICByZWZlcmVuY2U6IHJlZmVyZW5jZSxcclxuICAgICAgcG9wcGVyOiBwb3BwZXIsXHJcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXHJcbiAgICAgIHRpdGxlOiB0aXRsZSxcclxuICAgICAgcG9wcGVySW5zdGFuY2U6IG51bGxcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChvcHRpb25zLmNyZWF0ZVBvcHBlckluc3RhbmNlT25Jbml0KSB7XHJcbiAgICAgIHRpcHB5LnBvcHBlckluc3RhbmNlID0gX2NyZWF0ZVBvcHBlckluc3RhbmNlLmNhbGwodGlwcHkpO1xyXG4gICAgICB0aXBweS5wb3BwZXJJbnN0YW5jZS5kaXNhYmxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGlzdGVuZXJzID0gX2dldEV2ZW50TGlzdGVuZXJzLmNhbGwodGlwcHkpO1xyXG4gICAgdGlwcHkubGlzdGVuZXJzID0gb3B0aW9ucy50cmlnZ2VyLnRyaW0oKS5zcGxpdCgnICcpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBldmVudFR5cGUpIHtcclxuICAgICAgcmV0dXJuIGFjYy5jb25jYXQoY3JlYXRlVHJpZ2dlcihldmVudFR5cGUsIHJlZmVyZW5jZSwgbGlzdGVuZXJzLCBvcHRpb25zKSk7XHJcbiAgICB9LCBbXSk7XHJcblxyXG4gICAgLy8gVXBkYXRlIHRvb2x0aXAgY29udGVudCB3aGVuZXZlciB0aGUgdGl0bGUgYXR0cmlidXRlIG9uIHRoZSByZWZlcmVuY2UgY2hhbmdlc1xyXG4gICAgaWYgKG9wdGlvbnMuZHluYW1pY1RpdGxlKSB7XHJcbiAgICAgIF9hZGRNdXRhdGlvbk9ic2VydmVyLmNhbGwodGlwcHksIHtcclxuICAgICAgICB0YXJnZXQ6IHJlZmVyZW5jZSxcclxuICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gY2FsbGJhY2soKSB7XHJcbiAgICAgICAgICB2YXIgX2dldElubmVyRWxlbWVudHMgPSBnZXRJbm5lckVsZW1lbnRzKHBvcHBlciksXHJcbiAgICAgICAgICAgICAgY29udGVudCA9IF9nZXRJbm5lckVsZW1lbnRzLmNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgdmFyIHRpdGxlID0gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSgndGl0bGUnKTtcclxuICAgICAgICAgIGlmICh0aXRsZSkge1xyXG4gICAgICAgICAgICBjb250ZW50W29wdGlvbnMuYWxsb3dUaXRsZUhUTUwgPyAnaW5uZXJIVE1MJyA6ICd0ZXh0Q29udGVudCddID0gdGlwcHkudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICAgICAgcmVtb3ZlVGl0bGUocmVmZXJlbmNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTaG9ydGN1dHNcclxuICAgIHJlZmVyZW5jZS5fdGlwcHkgPSB0aXBweTtcclxuICAgIHBvcHBlci5fdGlwcHkgPSB0aXBweTtcclxuICAgIHBvcHBlci5fcmVmZXJlbmNlID0gcmVmZXJlbmNlO1xyXG5cclxuICAgIGFjYy5wdXNoKHRpcHB5KTtcclxuXHJcbiAgICBpZENvdW50ZXIrKztcclxuXHJcbiAgICByZXR1cm4gYWNjO1xyXG4gIH0sIFtdKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEhpZGVzIGFsbCBwb3BwZXJzXHJcbiAqIEBwYXJhbSB7VGlwcHl9IGV4Y2x1ZGVUaXBweSAtIHRpcHB5IHRvIGV4Y2x1ZGUgaWYgbmVlZGVkXHJcbiAqL1xyXG5mdW5jdGlvbiBoaWRlQWxsUG9wcGVycyhleGNsdWRlVGlwcHkpIHtcclxuICB2YXIgcG9wcGVycyA9IHRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMuUE9QUEVSKSk7XHJcblxyXG4gIHBvcHBlcnMuZm9yRWFjaChmdW5jdGlvbiAocG9wcGVyKSB7XHJcbiAgICB2YXIgdGlwcHkgPSBwb3BwZXIuX3RpcHB5O1xyXG4gICAgaWYgKCF0aXBweSkgcmV0dXJuO1xyXG5cclxuICAgIHZhciBvcHRpb25zID0gdGlwcHkub3B0aW9ucztcclxuXHJcblxyXG4gICAgaWYgKChvcHRpb25zLmhpZGVPbkNsaWNrID09PSB0cnVlIHx8IG9wdGlvbnMudHJpZ2dlci5pbmRleE9mKCdmb2N1cycpID4gLTEpICYmICghZXhjbHVkZVRpcHB5IHx8IHBvcHBlciAhPT0gZXhjbHVkZVRpcHB5LnBvcHBlcikpIHtcclxuICAgICAgdGlwcHkuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkcyB0aGUgbmVlZGVkIGV2ZW50IGxpc3RlbmVyc1xyXG4gKi9cclxuZnVuY3Rpb24gYmluZEV2ZW50TGlzdGVuZXJzKCkge1xyXG4gIHZhciBvbkRvY3VtZW50VG91Y2ggPSBmdW5jdGlvbiBvbkRvY3VtZW50VG91Y2goKSB7XHJcbiAgICBpZiAoYnJvd3Nlci51c2luZ1RvdWNoKSByZXR1cm47XHJcblxyXG4gICAgYnJvd3Nlci51c2luZ1RvdWNoID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoYnJvd3Nlci5pT1MpIHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd0aXBweS10b3VjaCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChicm93c2VyLmR5bmFtaWNJbnB1dERldGVjdGlvbiAmJiB3aW5kb3cucGVyZm9ybWFuY2UpIHtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Eb2N1bWVudE1vdXNlTW92ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYnJvd3Nlci5vblVzZXJJbnB1dENoYW5nZSgndG91Y2gnKTtcclxuICB9O1xyXG5cclxuICB2YXIgb25Eb2N1bWVudE1vdXNlTW92ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB0aW1lID0gdm9pZCAwO1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgIC8vIENocm9tZSA2MCsgaXMgMSBtb3VzZW1vdmUgcGVyIGFuaW1hdGlvbiBmcmFtZSwgdXNlIDIwbXMgdGltZSBkaWZmZXJlbmNlXHJcbiAgICAgIGlmIChub3cgLSB0aW1lIDwgMjApIHtcclxuICAgICAgICBicm93c2VyLnVzaW5nVG91Y2ggPSBmYWxzZTtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbkRvY3VtZW50TW91c2VNb3ZlKTtcclxuICAgICAgICBpZiAoIWJyb3dzZXIuaU9TKSB7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3RpcHB5LXRvdWNoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyb3dzZXIub25Vc2VySW5wdXRDaGFuZ2UoJ21vdXNlJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRpbWUgPSBub3c7XHJcbiAgICB9O1xyXG4gIH0oKTtcclxuXHJcbiAgdmFyIG9uRG9jdW1lbnRDbGljayA9IGZ1bmN0aW9uIG9uRG9jdW1lbnRDbGljayhldmVudCkge1xyXG4gICAgLy8gU2ltdWxhdGVkIGV2ZW50cyBkaXNwYXRjaGVkIG9uIHRoZSBkb2N1bWVudFxyXG4gICAgaWYgKCEoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudCkpIHtcclxuICAgICAgcmV0dXJuIGhpZGVBbGxQb3BwZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJlZmVyZW5jZSA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBzZWxlY3RvcnMuUkVGRVJFTkNFKTtcclxuICAgIHZhciBwb3BwZXIgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgc2VsZWN0b3JzLlBPUFBFUik7XHJcblxyXG4gICAgaWYgKHBvcHBlciAmJiBwb3BwZXIuX3RpcHB5ICYmIHBvcHBlci5fdGlwcHkub3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlZmVyZW5jZSAmJiByZWZlcmVuY2UuX3RpcHB5KSB7XHJcbiAgICAgIHZhciBvcHRpb25zID0gcmVmZXJlbmNlLl90aXBweS5vcHRpb25zO1xyXG5cclxuICAgICAgdmFyIGlzQ2xpY2tUcmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyLmluZGV4T2YoJ2NsaWNrJykgPiAtMTtcclxuICAgICAgdmFyIGlzTXVsdGlwbGUgPSBvcHRpb25zLm11bHRpcGxlO1xyXG5cclxuICAgICAgLy8gSGlkZSBhbGwgcG9wcGVycyBleGNlcHQgdGhlIG9uZSBiZWxvbmdpbmcgdG8gdGhlIGVsZW1lbnQgdGhhdCB3YXMgY2xpY2tlZFxyXG4gICAgICBpZiAoIWlzTXVsdGlwbGUgJiYgYnJvd3Nlci51c2luZ1RvdWNoIHx8ICFpc011bHRpcGxlICYmIGlzQ2xpY2tUcmlnZ2VyKSB7XHJcbiAgICAgICAgcmV0dXJuIGhpZGVBbGxQb3BwZXJzKHJlZmVyZW5jZS5fdGlwcHkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5oaWRlT25DbGljayAhPT0gdHJ1ZSB8fCBpc0NsaWNrVHJpZ2dlcikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhpZGVBbGxQb3BwZXJzKCk7XHJcbiAgfTtcclxuXHJcbiAgdmFyIG9uV2luZG93Qmx1ciA9IGZ1bmN0aW9uIG9uV2luZG93Qmx1cigpIHtcclxuICAgIHZhciBfZG9jdW1lbnQgPSBkb2N1bWVudCxcclxuICAgICAgICBlbCA9IF9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG5cclxuICAgIGlmIChlbCAmJiBlbC5ibHVyICYmIG1hdGNoZXMkMS5jYWxsKGVsLCBzZWxlY3RvcnMuUkVGRVJFTkNFKSkge1xyXG4gICAgICBlbC5ibHVyKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIG9uV2luZG93UmVzaXplID0gZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XHJcbiAgICB0b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLlBPUFBFUikpLmZvckVhY2goZnVuY3Rpb24gKHBvcHBlcikge1xyXG4gICAgICB2YXIgdGlwcHlJbnN0YW5jZSA9IHBvcHBlci5fdGlwcHk7XHJcbiAgICAgIGlmICh0aXBweUluc3RhbmNlICYmICF0aXBweUluc3RhbmNlLm9wdGlvbnMubGl2ZVBsYWNlbWVudCkge1xyXG4gICAgICAgIHRpcHB5SW5zdGFuY2UucG9wcGVySW5zdGFuY2Uuc2NoZWR1bGVVcGRhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkRvY3VtZW50Q2xpY2spO1xyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvbkRvY3VtZW50VG91Y2gpO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgb25XaW5kb3dCbHVyKTtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25XaW5kb3dSZXNpemUpO1xyXG5cclxuICBpZiAoIWJyb3dzZXIuc3VwcG9ydHNUb3VjaCAmJiAobmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzIHx8IG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzKSkge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBvbkRvY3VtZW50VG91Y2gpO1xyXG4gIH1cclxufVxyXG5cclxudmFyIGV2ZW50TGlzdGVuZXJzQm91bmQgPSBmYWxzZTtcclxuXHJcbi8qKlxyXG4gKiBFeHBvcnRlZCBtb2R1bGVcclxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxFbGVtZW50W118Tm9kZUxpc3R8T2JqZWN0fSBzZWxlY3RvclxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9uZSAtIGNyZWF0ZSBvbmUgdG9vbHRpcFxyXG4gKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAqL1xyXG5mdW5jdGlvbiB0aXBweSQxKHNlbGVjdG9yLCBvcHRpb25zLCBvbmUpIHtcclxuICBpZiAoYnJvd3Nlci5zdXBwb3J0ZWQgJiYgIWV2ZW50TGlzdGVuZXJzQm91bmQpIHtcclxuICAgIGJpbmRFdmVudExpc3RlbmVycygpO1xyXG4gICAgZXZlbnRMaXN0ZW5lcnNCb3VuZCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBpZiAoaXNPYmplY3RMaXRlcmFsKHNlbGVjdG9yKSkge1xyXG4gICAgcG9seWZpbGxWaXJ0dWFsUmVmZXJlbmNlUHJvcHMoc2VsZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgb3B0aW9ucyA9IF9leHRlbmRzKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gIHZhciByZWZlcmVuY2VzID0gZ2V0QXJyYXlPZkVsZW1lbnRzKHNlbGVjdG9yKTtcclxuICB2YXIgZmlyc3RSZWZlcmVuY2UgPSByZWZlcmVuY2VzWzBdO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxyXG4gICAgb3B0aW9uczogb3B0aW9ucyxcclxuICAgIHRvb2x0aXBzOiBicm93c2VyLnN1cHBvcnRlZCA/IGNyZWF0ZVRvb2x0aXBzKG9uZSAmJiBmaXJzdFJlZmVyZW5jZSA/IFtmaXJzdFJlZmVyZW5jZV0gOiByZWZlcmVuY2VzLCBvcHRpb25zKSA6IFtdLFxyXG4gICAgZGVzdHJveUFsbDogZnVuY3Rpb24gZGVzdHJveUFsbCgpIHtcclxuICAgICAgdGhpcy50b29sdGlwcy5mb3JFYWNoKGZ1bmN0aW9uICh0b29sdGlwKSB7XHJcbiAgICAgICAgcmV0dXJuIHRvb2x0aXAuZGVzdHJveSgpO1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy50b29sdGlwcyA9IFtdO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbnRpcHB5JDEudmVyc2lvbiA9IHZlcnNpb247XHJcbnRpcHB5JDEuYnJvd3NlciA9IGJyb3dzZXI7XHJcbnRpcHB5JDEuZGVmYXVsdHMgPSBkZWZhdWx0cztcclxudGlwcHkkMS5vbmUgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIG9wdGlvbnMpIHtcclxuICByZXR1cm4gdGlwcHkkMShzZWxlY3Rvciwgb3B0aW9ucywgdHJ1ZSkudG9vbHRpcHNbMF07XHJcbn07XHJcbnRpcHB5JDEuZGlzYWJsZUFuaW1hdGlvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgZGVmYXVsdHMudXBkYXRlRHVyYXRpb24gPSBkZWZhdWx0cy5kdXJhdGlvbiA9IDA7XHJcbiAgZGVmYXVsdHMuYW5pbWF0ZUZpbGwgPSBmYWxzZTtcclxufTtcclxuXHJcbnJldHVybiB0aXBweSQxO1xyXG5cclxufSkpKTtcclxuIl19
