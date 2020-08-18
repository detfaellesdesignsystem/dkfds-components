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

},{"../utils/is-in-viewport":80,"../utils/toggle":82}],62:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheckboxToggleContent = function () {
    function CheckboxToggleContent(el) {
        _classCallCheck(this, CheckboxToggleContent);

        this.jsToggleTrigger = '.js-checkbox-toggle-content';
        this.jsToggleTarget = 'data-aria-controls';
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
                var targetEl = document.querySelector('#' + targetAttr);
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
                triggerEl.setAttribute('data-aria-expanded', 'true');
                targetEl.classList.remove('collapsed');
                targetEl.setAttribute('aria-hidden', 'false');
                triggerEl.dispatchEvent(this.eventOpen);
            }
        }
    }, {
        key: 'close',
        value: function close(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute('data-aria-expanded', 'false');
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

},{"../utils/generate-unique-id.js":79}],65:[function(require,module,exports){
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

},{"../utils/breakpoints":77,"../utils/closest":78,"../utils/toggle":82}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function Modal($modal) {
  this.$modal = $modal;
  var id = this.$modal.getAttribute('id');
  this.triggers = document.querySelectorAll('[data-module="modal"][data-target="' + id + '"]');
  window.modal = { "lastFocus": document.activeElement, "ignoreUtilFocusChanges": false };
}

Modal.prototype.init = function () {
  var triggers = this.triggers;
  for (var i = 0; i < triggers.length; i++) {
    var trigger = triggers[i];
    trigger.addEventListener('click', this.show.bind(this));
  }
  var closers = this.$modal.querySelectorAll('[data-modal-close]');
  for (var c = 0; c < closers.length; c++) {
    var closer = closers[c];
    closer.addEventListener('click', this.hide.bind(this));
  }
};

Modal.prototype.hide = function () {
  var modalElement = this.$modal;
  if (modalElement !== null) {
    modalElement.setAttribute('aria-hidden', 'true');

    var eventClose = document.createEvent('Event');
    eventClose.initEvent('fds.modal.hidden', true, true);
    modalElement.dispatchEvent(eventClose);

    var $backdrop = document.querySelector('#modal-backdrop');
    $backdrop.parentNode.removeChild($backdrop);

    document.getElementsByTagName('body')[0].classList.remove('modal-open');
    document.removeEventListener('focus', this.trapFocus, true);

    document.removeEventListener('keyup', handleEscape);
  }
};

Modal.prototype.show = function () {
  var modalElement = this.$modal;
  if (modalElement !== null) {
    modalElement.setAttribute('aria-hidden', 'false');
    modalElement.setAttribute('tabindex', '-1');

    var eventOpen = document.createEvent('Event');
    eventOpen.initEvent('fds.modal.shown', true, true);
    modalElement.dispatchEvent(eventOpen);

    var $backdrop = document.createElement('div');
    $backdrop.classList.add('modal-backdrop');
    $backdrop.setAttribute('id', "modal-backdrop");
    document.getElementsByTagName('body')[0].appendChild($backdrop);

    document.getElementsByTagName('body')[0].classList.add('modal-open');

    modalElement.focus();
    window.modal.lastFocus = document.activeElement;

    document.addEventListener('focus', this.trapFocus, true);

    document.addEventListener('keyup', handleEscape);
  }
};

var handleEscape = function handleEscape(event) {
  var key = event.which || event.keyCode;
  var currentModal = new Modal(document.querySelector('.fds-modal[aria-hidden=false]'));
  if (key === 27 && currentModal.hide()) {
    event.stopPropagation();
  }
};

Modal.prototype.trapFocus = function (event) {
  if (window.modal.ignoreUtilFocusChanges) {
    return;
  }
  var currentDialog = new Modal(document.querySelector('.fds-modal[aria-hidden=false]'));
  if (currentDialog.$modal.getElementsByClassName('modal-content')[0].contains(event.target) || currentDialog.$modal == event.target) {
    window.modal.lastFocus = event.target;
  } else {
    currentDialog.focusFirstDescendant(currentDialog.$modal);
    if (window.modal.lastFocus == document.activeElement) {
      currentDialog.focusLastDescendant(currentDialog.$modal);
    }
    window.modal.lastFocus = document.activeElement;
  }
};

Modal.prototype.isFocusable = function (element) {
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
};

Modal.prototype.focusFirstDescendant = function (element) {
  for (var i = 0; i < element.childNodes.length; i++) {
    var child = element.childNodes[i];
    if (this.attemptFocus(child) || this.focusFirstDescendant(child)) {
      return true;
    }
  }
  return false;
};

Modal.prototype.focusLastDescendant = function (element) {
  for (var i = element.childNodes.length - 1; i >= 0; i--) {
    var child = element.childNodes[i];
    if (this.attemptFocus(child) || this.focusLastDescendant(child)) {
      return true;
    }
  }
  return false;
};

Modal.prototype.attemptFocus = function (element) {
  if (!this.isFocusable(element)) {
    return false;
  }

  window.modal.ignoreUtilFocusChanges = true;
  try {
    element.focus();
  } catch (e) {}
  window.modal.ignoreUtilFocusChanges = false;
  return document.activeElement === element;
};

exports.default = Modal;

},{}],67:[function(require,module,exports){
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

  function trapTabKey(e) {
    var key = event.which || event.keyCode;
    // Check for TAB key press
    if (key === 9) {

      var lastTabStop = null;
      for (var i = 0; i < focusableElements.length; i++) {
        var number = focusableElements.length - 1;
        var element = focusableElements[number - i];
        if (element.offsetWidth > 0 && element.offsetHeight > 0) {
          lastTabStop = element;
          break;
        }
      }

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

  return {
    enable: function enable() {
      // Focus first child
      firstTabStop.focus();
      // Listen for and trap the keyboard
      document.addEventListener('keydown', trapTabKey);
    },
    release: function release() {
      document.removeEventListener('keydown', trapTabKey);
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

  var mobile = false;
  var openers = document.querySelectorAll(OPENERS);
  for (var o = 0; o < openers.length; o++) {
    if (window.getComputedStyle(openers[o], null).display !== 'none') {
      openers[o].addEventListener('click', toggleNav);
      mobile = true;
    }
  }

  if (mobile) {
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

    var trapContainers = document.querySelectorAll(NAV);
    for (var i = 0; i < trapContainers.length; i++) {
      focusTrap = _focusTrap(trapContainers[i]);
    }
  }

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

    this.init();

    window.addEventListener('resize', resize, false);
  }

  _createClass(Navigation, [{
    key: 'init',
    value: function init() {

      resize();
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

},{"../utils/select":81,"./dropdown":65,"array-foreach":1}],68:[function(require,module,exports){
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

},{}],69:[function(require,module,exports){
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

},{}],70:[function(require,module,exports){
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

},{"receptor/once":60}],71:[function(require,module,exports){
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

},{"../utils/select":81}],72:[function(require,module,exports){
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

},{}],73:[function(require,module,exports){
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

},{}],74:[function(require,module,exports){
'use strict';

var _details = require('./components/details');

var _details2 = _interopRequireDefault(_details);

var _modal = require('./components/modal');

var _modal2 = _interopRequireDefault(_modal);

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

  var modals = document.querySelectorAll('.fds-modal');
  for (var d = 0; d < modals.length; d++) {
    new _modal2.default(modals[d]).init();
  }

  var details = document.querySelectorAll('.js-details');
  for (var _d = 0; _d < details.length; _d++) {
    new _details2.default(details[_d]).init();
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

module.exports = { init: init, Collapse: Collapse, RadioToggleGroup: RadioToggleGroup, CheckboxToggleContent: CheckboxToggleContent, Dropdown: Dropdown, ResponsiveTable: ResponsiveTable, Accordion: Accordion, Tabnav: Tabnav, Tooltip: Tooltip, SetTabIndex: SetTabIndex, Navigation: Navigation, InputRegexMask: InputRegexMask, Modal: _modal2.default };

},{"./components/accordion":61,"./components/checkbox-toggle-content":62,"./components/collapse":63,"./components/details":64,"./components/dropdown":65,"./components/modal":66,"./components/navigation":67,"./components/radio-toggle-content":68,"./components/regex-input-mask":69,"./components/skipnav":70,"./components/table":71,"./components/tabnav":72,"./components/tooltip":73,"./polyfills":76}],75:[function(require,module,exports){
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

},{}],76:[function(require,module,exports){
'use strict';
// polyfills HTMLElement.prototype.classList and DOMTokenList

require('classlist-polyfill');
// polyfills HTMLElement.prototype.hidden
require('./element-hidden');

require('core-js/fn/object/assign');
require('core-js/fn/array/from');

},{"./element-hidden":75,"classlist-polyfill":2,"core-js/fn/array/from":3,"core-js/fn/object/assign":4}],77:[function(require,module,exports){
'use strict';

var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};

module.exports = breakpoints;

},{}],78:[function(require,module,exports){
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

},{}],79:[function(require,module,exports){
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

},{}],80:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;

  var rect = el.getBoundingClientRect();

  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}

module.exports = isElementInViewport;

},{}],81:[function(require,module,exports){
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

},{}],82:[function(require,module,exports){
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

},{}]},{},[74])(74)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9vbmNlL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWNjb3JkaW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jb2xsYXBzZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RldGFpbHMuanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi5qcyIsInNyYy9qcy9jb21wb25lbnRzL21vZGFsLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbmF2aWdhdGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzay5qcyIsInNyYy9qcy9jb21wb25lbnRzL3NraXBuYXYuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYm5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3Rvb2x0aXAuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwic3JjL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInNyYy9qcy91dGlscy9icmVha3BvaW50cy5qcyIsInNyYy9qcy91dGlscy9jbG9zZXN0LmpzIiwic3JjL2pzL3V0aWxzL2dlbmVyYXRlLXVuaXF1ZS1pZC5qcyIsInNyYy9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInNyYy9qcy91dGlscy9zZWxlY3QuanMiLCJzcmMvanMvdXRpbHMvdG9nZ2xlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFNBQVMsT0FBVCxDQUFrQixHQUFsQixFQUF1QixR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IihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIGFycmF5LWZvcmVhY2hcbiAqICAgQXJyYXkjZm9yRWFjaCBwb255ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnNcbiAqICAgKFBvbnlmaWxsOiBBIHBvbHlmaWxsIHRoYXQgZG9lc24ndCBvdmVyd3JpdGUgdGhlIG5hdGl2ZSBtZXRob2QpXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LTIwMTYgVGFrdXRvIFdhZGFcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2gvYmxvYi9tYXN0ZXIvTUlULUxJQ0VOU0VcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2ggKGFyeSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBpZiAoYXJ5LmZvckVhY2gpIHtcbiAgICAgICAgYXJ5LmZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSs9MSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGFyeVtpXSwgaSwgYXJ5KTtcbiAgICB9XG59O1xuIiwiLypcbiAqIGNsYXNzTGlzdC5qczogQ3Jvc3MtYnJvd3NlciBmdWxsIGVsZW1lbnQuY2xhc3NMaXN0IGltcGxlbWVudGF0aW9uLlxuICogMS4xLjIwMTcwNDI3XG4gKlxuICogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxuICogTGljZW5zZTogRGVkaWNhdGVkIHRvIHRoZSBwdWJsaWMgZG9tYWluLlxuICogICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG4vKmdsb2JhbCBzZWxmLCBkb2N1bWVudCwgRE9NRXhjZXB0aW9uICovXG5cbi8qISBAc291cmNlIGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvY2xhc3NMaXN0LmpzICovXG5cbmlmIChcImRvY3VtZW50XCIgaW4gd2luZG93LnNlbGYpIHtcblxuLy8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxuLy8gSW5jbHVkaW5nIElFIDwgRWRnZSBtaXNzaW5nIFNWR0VsZW1lbnQuY2xhc3NMaXN0XG5pZiAoIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpKSBcblx0fHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKSkpIHtcblxuKGZ1bmN0aW9uICh2aWV3KSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5pZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcblxudmFyXG5cdCAgY2xhc3NMaXN0UHJvcCA9IFwiY2xhc3NMaXN0XCJcblx0LCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG5cdCwgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF1cblx0LCBvYmpDdHIgPSBPYmplY3Rcblx0LCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIik7XG5cdH1cblx0LCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIGkgPSAwXG5cdFx0XHQsIGxlbiA9IHRoaXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cdC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xuXHQsIERPTUV4ID0gZnVuY3Rpb24gKHR5cGUsIG1lc3NhZ2UpIHtcblx0XHR0aGlzLm5hbWUgPSB0eXBlO1xuXHRcdHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9XG5cdCwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcblx0XHRpZiAodG9rZW4gPT09IFwiXCIpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIlNZTlRBWF9FUlJcIlxuXHRcdFx0XHQsIFwiQW4gaW52YWxpZCBvciBpbGxlZ2FsIHN0cmluZyB3YXMgc3BlY2lmaWVkXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCJcblx0XHRcdFx0LCBcIlN0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3RlclwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xuXHR9XG5cdCwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxuXHRcdFx0LCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cblx0XHRcdCwgaSA9IDBcblx0XHRcdCwgbGVuID0gY2xhc3Nlcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0dGhpcy5wdXNoKGNsYXNzZXNbaV0pO1xuXHRcdH1cblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMudG9TdHJpbmcoKSk7XG5cdFx0fTtcblx0fVxuXHQsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxuXHQsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IENsYXNzTGlzdCh0aGlzKTtcblx0fVxuO1xuLy8gTW9zdCBET01FeGNlcHRpb24gaW1wbGVtZW50YXRpb25zIGRvbid0IGFsbG93IGNhbGxpbmcgRE9NRXhjZXB0aW9uJ3MgdG9TdHJpbmcoKVxuLy8gb24gbm9uLURPTUV4Y2VwdGlvbnMuIEVycm9yJ3MgdG9TdHJpbmcoKSBpcyBzdWZmaWNpZW50IGhlcmUuXG5ET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcbmNsYXNzTGlzdFByb3RvLml0ZW0gPSBmdW5jdGlvbiAoaSkge1xuXHRyZXR1cm4gdGhpc1tpXSB8fCBudWxsO1xufTtcbmNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cdHJldHVybiBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pICE9PSAtMTtcbn07XG5jbGFzc0xpc3RQcm90by5hZGQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xuXHRcdFx0dGhpcy5wdXNoKHRva2VuKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHRcdCwgaW5kZXhcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR3aGlsZSAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHR0aGlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cblx0dmFyXG5cdFx0ICByZXN1bHQgPSB0aGlzLmNvbnRhaW5zKHRva2VuKVxuXHRcdCwgbWV0aG9kID0gcmVzdWx0ID9cblx0XHRcdGZvcmNlICE9PSB0cnVlICYmIFwicmVtb3ZlXCJcblx0XHQ6XG5cdFx0XHRmb3JjZSAhPT0gZmFsc2UgJiYgXCJhZGRcIlxuXHQ7XG5cblx0aWYgKG1ldGhvZCkge1xuXHRcdHRoaXNbbWV0aG9kXSh0b2tlbik7XG5cdH1cblxuXHRpZiAoZm9yY2UgPT09IHRydWUgfHwgZm9yY2UgPT09IGZhbHNlKSB7XG5cdFx0cmV0dXJuIGZvcmNlO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiAhcmVzdWx0O1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmpvaW4oXCIgXCIpO1xufTtcblxuaWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xuXHR2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XG5cdFx0ICBnZXQ6IGNsYXNzTGlzdEdldHRlclxuXHRcdCwgZW51bWVyYWJsZTogdHJ1ZVxuXHRcdCwgY29uZmlndXJhYmxlOiB0cnVlXG5cdH07XG5cdHRyeSB7XG5cdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHR9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcblx0XHQvLyBhZGRpbmcgdW5kZWZpbmVkIHRvIGZpZ2h0IHRoaXMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2lzc3Vlcy8zNlxuXHRcdC8vIG1vZGVybmllIElFOC1NU1c3IG1hY2hpbmUgaGFzIElFOCA4LjAuNjAwMS4xODcwMiBhbmQgaXMgYWZmZWN0ZWRcblx0XHRpZiAoZXgubnVtYmVyID09PSB1bmRlZmluZWQgfHwgZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xuXHRcdFx0Y2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuXHRcdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHRcdH1cblx0fVxufSBlbHNlIGlmIChvYmpDdHJbcHJvdG9Qcm9wXS5fX2RlZmluZUdldHRlcl9fKSB7XG5cdGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XG59XG5cbn0od2luZG93LnNlbGYpKTtcblxufVxuXG4vLyBUaGVyZSBpcyBmdWxsIG9yIHBhcnRpYWwgbmF0aXZlIGNsYXNzTGlzdCBzdXBwb3J0LCBzbyBqdXN0IGNoZWNrIGlmIHdlIG5lZWRcbi8vIHRvIG5vcm1hbGl6ZSB0aGUgYWRkL3JlbW92ZSBhbmQgdG9nZ2xlIEFQSXMuXG5cbihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpO1xuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjMVwiLCBcImMyXCIpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMC8xMSBhbmQgRmlyZWZveCA8MjYsIHdoZXJlIGNsYXNzTGlzdC5hZGQgYW5kXG5cdC8vIGNsYXNzTGlzdC5yZW1vdmUgZXhpc3QgYnV0IHN1cHBvcnQgb25seSBvbmUgYXJndW1lbnQgYXQgYSB0aW1lLlxuXHRpZiAoIXRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMyXCIpKSB7XG5cdFx0dmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdO1xuXG5cdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih0b2tlbikge1xuXHRcdFx0XHR2YXIgaSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0XHR0b2tlbiA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdFx0XHRvcmlnaW5hbC5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdGNyZWF0ZU1ldGhvZCgnYWRkJyk7XG5cdFx0Y3JlYXRlTWV0aG9kKCdyZW1vdmUnKTtcblx0fVxuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJjM1wiLCBmYWxzZSk7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwIGFuZCBGaXJlZm94IDwyNCwgd2hlcmUgY2xhc3NMaXN0LnRvZ2dsZSBkb2VzIG5vdFxuXHQvLyBzdXBwb3J0IHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdGlmICh0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjM1wiKSkge1xuXHRcdHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XG5cblx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKHRva2VuLCBmb3JjZSkge1xuXHRcdFx0aWYgKDEgaW4gYXJndW1lbnRzICYmICF0aGlzLmNvbnRhaW5zKHRva2VuKSA9PT0gIWZvcmNlKSB7XG5cdFx0XHRcdHJldHVybiBmb3JjZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBfdG9nZ2xlLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fVxuXG5cdHRlc3RFbGVtZW50ID0gbnVsbDtcbn0oKSk7XG5cbn1cbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuQXJyYXkuZnJvbTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5hc3NpZ247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjUuNycgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBpbmRleCwgdmFsdWUpIHtcbiAgaWYgKGluZGV4IGluIG9iamVjdCkgJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV07XG4gIHZhciBleHBvcnRzID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XG4gIHZhciBleHBQcm90byA9IGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pO1xuICB2YXIga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZiAoSVNfR0xPQkFMKSBzb3VyY2UgPSBuYW1lO1xuICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGV4cCA9IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICBpZiAodGFyZ2V0KSByZWRlZmluZSh0YXJnZXQsIGtleSwgb3V0LCB0eXBlICYgJGV4cG9ydC5VKTtcbiAgICAvLyBleHBvcnRcbiAgICBpZiAoZXhwb3J0c1trZXldICE9IG91dCkgaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYgKElTX1BST1RPICYmIGV4cFByb3RvW2tleV0gIT0gb3V0KSBleHBQcm90b1trZXldID0gb3V0O1xuICB9XG59O1xuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTtcbiIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyICRpdGVyQ3JlYXRlID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBCVUdHWSA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKTsgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxudmFyIEZGX0lURVJBVE9SID0gJ0BAaXRlcmF0b3InO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgaWYgKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKSByZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgdmFyIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFUztcbiAgdmFyIFZBTFVFU19CVUcgPSBmYWxzZTtcbiAgdmFyIHByb3RvID0gQmFzZS5wcm90b3R5cGU7XG4gIHZhciAkbmF0aXZlID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdO1xuICB2YXIgJGRlZmF1bHQgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKTtcbiAgdmFyICRlbnRyaWVzID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZDtcbiAgdmFyICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlO1xuICB2YXIgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZiAoJGFueU5hdGl2ZSkge1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUgJiYgSXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmICghTElCUkFSWSAmJiB0eXBlb2YgSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdICE9ICdmdW5jdGlvbicpIGhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSkge1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gPSByZXR1cm5UaGlzO1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChrZXkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKCEoa2V5IGluIHByb3RvKSkgcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcbiIsInZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uICgpIHsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRocm93LWxpdGVyYWxcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjLCBza2lwQ2xvc2luZykge1xuICBpZiAoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gWzddO1xuICAgIHZhciBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgZG9uZTogc2FmZSA9IHRydWUgfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyICRhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgUyA9IFN5bWJvbCgpO1xuICB2YXIgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUID0gdG9PYmplY3QodGFyZ2V0KTtcbiAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAxO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgdmFyIGlzRW51bSA9IHBJRS5mO1xuICB3aGlsZSAoYUxlbiA+IGluZGV4KSB7XG4gICAgdmFyIFMgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgdmFyIGtleXMgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikgaWYgKGlzRW51bS5jYWxsKFMsIGtleSA9IGtleXNbaisrXSkpIFRba2V5XSA9IFNba2V5XTtcbiAgfSByZXR1cm4gVDtcbn0gOiAkYXNzaWduO1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IGdldEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgUDtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFNSQyA9IHJlcXVpcmUoJy4vX3VpZCcpKCdzcmMnKTtcbnZhciBUT19TVFJJTkcgPSAndG9TdHJpbmcnO1xudmFyICR0b1N0cmluZyA9IEZ1bmN0aW9uW1RPX1NUUklOR107XG52YXIgVFBMID0gKCcnICsgJHRvU3RyaW5nKS5zcGxpdChUT19TVFJJTkcpO1xuXG5yZXF1aXJlKCcuL19jb3JlJykuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsLCBzYWZlKSB7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgJ25hbWUnKSB8fCBoaWRlKHZhbCwgJ25hbWUnLCBrZXkpO1xuICBpZiAoT1trZXldID09PSB2YWwpIHJldHVybjtcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsIFNSQykgfHwgaGlkZSh2YWwsIFNSQywgT1trZXldID8gJycgKyBPW2tleV0gOiBUUEwuam9pbihTdHJpbmcoa2V5KSkpO1xuICBpZiAoTyA9PT0gZ2xvYmFsKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKCFzYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfSBlbHNlIGlmIChPW2tleV0pIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzW1NSQ10gfHwgJHRvU3RyaW5nLmNhbGwodGhpcyk7XG59KTtcbiIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgdGFnLCBzdGF0KSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSBkZWYoaXQsIFRBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWcgfSk7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246IGNvcmUudmVyc2lvbixcbiAgbW9kZTogcmVxdWlyZSgnLi9fbGlicmFyeScpID8gJ3B1cmUnIDogJ2dsb2JhbCcsXG4gIGNvcHlyaWdodDogJ8KpIDIwMTggRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknXG59KTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikgeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgbWFwZm4gPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYgKG1hcHBpbmcpIG1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYgKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDKCk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvciAocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHsgYXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJykgfSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb25jZShsaXN0ZW5lciwgb3B0aW9ucykge1xuICB2YXIgd3JhcHBlZCA9IGZ1bmN0aW9uIHdyYXBwZWRPbmNlKGUpIHtcbiAgICBlLmN1cnJlbnRUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLnR5cGUsIHdyYXBwZWQsIG9wdGlvbnMpO1xuICAgIHJldHVybiBsaXN0ZW5lci5jYWxsKHRoaXMsIGUpO1xuICB9O1xuICByZXR1cm4gd3JhcHBlZDtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHRvZ2dsZSA9IHJlcXVpcmUoJy4uL3V0aWxzL3RvZ2dsZScpO1xuY29uc3QgaXNFbGVtZW50SW5WaWV3cG9ydCA9IHJlcXVpcmUoJy4uL3V0aWxzL2lzLWluLXZpZXdwb3J0Jyk7XG5jb25zdCBCVVRUT04gPSBgLmFjY29yZGlvbi1idXR0b25bYXJpYS1jb250cm9sc11gO1xuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XG5jb25zdCBNVUxUSVNFTEVDVEFCTEUgPSAnYXJpYS1tdWx0aXNlbGVjdGFibGUnO1xuY29uc3QgTVVMVElTRUxFQ1RBQkxFX0NMQVNTID0gJ2FjY29yZGlvbi1tdWx0aXNlbGVjdGFibGUnO1xuXG5jbGFzcyBBY2NvcmRpb257XG4gIGNvbnN0cnVjdG9yIChhY2NvcmRpb24pe1xuICAgIHRoaXMuYWNjb3JkaW9uID0gYWNjb3JkaW9uO1xuICAgIHRoaXMuYnV0dG9ucyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XG4gICAgdGhpcy5ldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgdGhpcy5ldmVudENsb3NlLmluaXRFdmVudCgnZmRzLmFjY29yZGlvbi5jbG9zZScsIHRydWUsIHRydWUpO1xuICAgIHRoaXMuZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgdGhpcy5ldmVudE9wZW4uaW5pdEV2ZW50KCdmZHMuYWNjb3JkaW9uLm9wZW4nLCB0cnVlLCB0cnVlKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQgKCl7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnNbaV07XG5cbiAgICAgIGxldCBleHBhbmRlZCA9IGN1cnJlbnRCdXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnO1xuICAgICAgdG9nZ2xlQnV0dG9uKGN1cnJlbnRCdXR0b24sIGV4cGFuZGVkKTtcblxuICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgICBjdXJyZW50QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhhdC5ldmVudE9uQ2xpY2ssIGZhbHNlKTtcbiAgICAgIGN1cnJlbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGF0LmV2ZW50T25DbGljaywgZmFsc2UpO1xuXG4gICAgfVxuICB9XG5cblxuICBldmVudE9uQ2xpY2sgKGV2ZW50KXtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBsZXQgYnV0dG9uID0gdGhpcztcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRvZ2dsZUJ1dHRvbihidXR0b24pO1xuICAgIGlmIChidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnKSB7XG4gICAgICAvLyBXZSB3ZXJlIGp1c3QgZXhwYW5kZWQsIGJ1dCBpZiBhbm90aGVyIGFjY29yZGlvbiB3YXMgYWxzbyBqdXN0XG4gICAgICAvLyBjb2xsYXBzZWQsIHdlIG1heSBubyBsb25nZXIgYmUgaW4gdGhlIHZpZXdwb3J0LiBUaGlzIGVuc3VyZXNcbiAgICAgIC8vIHRoYXQgd2UgYXJlIHN0aWxsIHZpc2libGUsIHNvIHRoZSB1c2VyIGlzbid0IGNvbmZ1c2VkLlxuICAgICAgaWYgKCFpc0VsZW1lbnRJblZpZXdwb3J0KGJ1dHRvbikpIGJ1dHRvbi5zY3JvbGxJbnRvVmlldygpO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRvZ2dsZSBhIGJ1dHRvbidzIFwicHJlc3NlZFwiIHN0YXRlLCBvcHRpb25hbGx5IHByb3ZpZGluZyBhIHRhcmdldFxuICAgKiBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj99IGV4cGFuZGVkIElmIG5vIHN0YXRlIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudFxuICAgKiBzdGF0ZSB3aWxsIGJlIHRvZ2dsZWQgKGZyb20gZmFsc2UgdG8gdHJ1ZSwgYW5kIHZpY2UtdmVyc2EpLlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0aGUgcmVzdWx0aW5nIHN0YXRlXG4gICAqL1xufVxuXG52YXIgdG9nZ2xlQnV0dG9uICA9IGZ1bmN0aW9uIChidXR0b24sIGV4cGFuZGVkKSB7XG4gIGxldCBhY2NvcmRpb24gPSBudWxsO1xuICBpZihidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uJykpe1xuICAgIGFjY29yZGlvbiA9IGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gIH1cblxuICBsZXQgZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICBldmVudENsb3NlLmluaXRFdmVudCgnZmRzLmFjY29yZGlvbi5jbG9zZScsIHRydWUsIHRydWUpO1xuICBsZXQgZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gIGV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5hY2NvcmRpb24ub3BlbicsIHRydWUsIHRydWUpO1xuICBleHBhbmRlZCA9IHRvZ2dsZShidXR0b24sIGV4cGFuZGVkKTtcblxuICBpZihleHBhbmRlZCl7XG4gICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcbiAgfSBlbHNle1xuICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xuICB9XG5cbiAgLy8gWFhYIG11bHRpc2VsZWN0YWJsZSBpcyBvcHQtaW4sIHRvIHByZXNlcnZlIGxlZ2FjeSBiZWhhdmlvclxuICBsZXQgbXVsdGlzZWxlY3RhYmxlID0gZmFsc2U7XG4gIGlmKGFjY29yZGlvbiAhPT0gbnVsbCAmJiAoYWNjb3JkaW9uLmdldEF0dHJpYnV0ZShNVUxUSVNFTEVDVEFCTEUpID09PSAndHJ1ZScgfHwgYWNjb3JkaW9uLmNsYXNzTGlzdC5jb250YWlucyhNVUxUSVNFTEVDVEFCTEVfQ0xBU1MpKSl7XG4gICAgbXVsdGlzZWxlY3RhYmxlID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChleHBhbmRlZCAmJiAhbXVsdGlzZWxlY3RhYmxlKSB7XG4gICAgbGV0IGJ1dHRvbnMgPSBbIGJ1dHRvbiBdO1xuICAgIGlmKGFjY29yZGlvbiAhPT0gbnVsbCkge1xuICAgICAgYnV0dG9ucyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XG4gICAgfVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY3VycmVudEJ1dHR0b24gPSBidXR0b25zW2ldO1xuICAgICAgaWYgKGN1cnJlbnRCdXR0dG9uICE9PSBidXR0b24pIHtcbiAgICAgICAgdG9nZ2xlKGN1cnJlbnRCdXR0dG9uLCBmYWxzZSk7XG4gICAgICAgIGN1cnJlbnRCdXR0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQWNjb3JkaW9uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY2xhc3MgQ2hlY2tib3hUb2dnbGVDb250ZW50e1xuICAgIGNvbnN0cnVjdG9yKGVsKXtcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRyaWdnZXIgPSAnLmpzLWNoZWNrYm94LXRvZ2dsZS1jb250ZW50JztcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRhcmdldCA9ICdkYXRhLWFyaWEtY29udHJvbHMnO1xuICAgICAgICB0aGlzLmV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgdGhpcy5ldmVudENsb3NlLmluaXRFdmVudCgnZmRzLmNvbGxhcHNlLmNsb3NlJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgIHRoaXMuZXZlbnRPcGVuLmluaXRFdmVudCgnZmRzLmNvbGxhcHNlLm9wZW4nLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XG4gICAgICAgIHRoaXMuY2hlY2tib3hFbCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5pbml0KGVsKTtcbiAgICB9XG5cbiAgICBpbml0KGVsKXtcbiAgICAgICAgdGhpcy5jaGVja2JveEVsID0gZWw7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGVja2JveEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uIChldmVudCl7XG4gICAgICAgICAgICB0aGF0LnRvZ2dsZSh0aGF0LmNoZWNrYm94RWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50b2dnbGUodGhpcy5jaGVja2JveEVsKTtcbiAgICB9XG5cbiAgICB0b2dnbGUodHJpZ2dlckVsKXtcbiAgICAgICAgdmFyIHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNUb2dnbGVUYXJnZXQpXG4gICAgICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHZhciB0YXJnZXRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdGFyZ2V0QXR0cik7XG4gICAgICAgICAgICBpZih0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICBpZih0cmlnZ2VyRWwuY2hlY2tlZCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSh0cmlnZ2VyRWwsIHRhcmdldEVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvcGVuKHRyaWdnZXJFbCwgdGFyZ2V0RWwpe1xuICAgICAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdkYXRhLWFyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50T3Blbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCl7XG4gICAgICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KHRoaXMuZXZlbnRDbG9zZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hlY2tib3hUb2dnbGVDb250ZW50O1xuIiwiLyoqXG4gKiBDb2xsYXBzZS9leHBhbmQuXG4gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIENvbGxhcHNlIHtcbiAgY29uc3RydWN0b3IgKGVsZW1lbnQsIGFjdGlvbiA9ICd0b2dnbGUnKXtcbiAgICB0aGlzLmpzQ29sbGFwc2VUYXJnZXQgPSAnZGF0YS1qcy10YXJnZXQnO1xuICAgIHRoaXMudHJpZ2dlckVsID0gZWxlbWVudDtcbiAgICB0aGlzLnRhcmdldEVsO1xuICAgIHRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5ldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgdGhpcy5ldmVudENsb3NlLmluaXRFdmVudCgnZmRzLmNvbGxhcHNlLmNsb3NlJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgdGhpcy5ldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICB0aGlzLmV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5jb2xsYXBzZS5vcGVuJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgdGhpcy50cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKXtcbiAgICAgIHRoYXQudG9nZ2xlKCk7XG4gICAgfSk7XG4gIH1cblxuICB0b2dnbGVDb2xsYXBzZSAoZm9yY2VDbG9zZSkge1xuICAgIGxldCB0YXJnZXRBdHRyID0gdGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNDb2xsYXBzZVRhcmdldCk7XG4gICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xuICAgICAgdGhpcy50YXJnZXRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0QXR0cik7XG4gICAgICBpZih0aGlzLnRhcmdldEVsICE9PSBudWxsICYmIHRoaXMudGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIC8vY2hhbmdlIHN0YXRlXG4gICAgICAgIGlmKHRoaXMudHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgfHwgdGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09IHVuZGVmaW5lZCB8fCBmb3JjZUNsb3NlICl7XG4gICAgICAgICAgLy9jbG9zZVxuICAgICAgICAgIHRoaXMuYW5pbWF0ZUNvbGxhcHNlKCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIC8vb3BlblxuICAgICAgICAgIHRoaXMuYW5pbWF0ZUV4cGFuZCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlICgpe1xuICAgIGlmKHRoaXMudHJpZ2dlckVsICE9PSBudWxsICYmIHRoaXMudHJpZ2dlckVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgdGhpcy50b2dnbGVDb2xsYXBzZSgpO1xuICAgIH1cbiAgfVxuXG5cbiAgYW5pbWF0ZUNvbGxhcHNlICgpIHtcbiAgICBpZighdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyl7XG4gICAgICB0aGlzLmFuaW1hdGVJblByb2dyZXNzID0gdHJ1ZTtcblxuICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSB0aGlzLnRhcmdldEVsLmNsaWVudEhlaWdodCsgJ3B4JztcbiAgICAgIHRoaXMudGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2UtdHJhbnNpdGlvbi1jb2xsYXBzZScpO1xuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcbiAgICAgICAgdGhhdC50YXJnZXRFbC5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICB9LCA1KTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCl7XG4gICAgICAgIHRoYXQudGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICAgIHRoYXQudGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2UtdHJhbnNpdGlvbi1jb2xsYXBzZScpO1xuXG4gICAgICAgIHRoYXQudHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICB0aGF0LmFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIHRoYXQudHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhhdC5ldmVudENsb3NlKTtcbiAgICAgIH0sIDIwMCk7XG4gICAgfVxuICB9XG5cbiAgYW5pbWF0ZUV4cGFuZCAoKSB7XG4gICAgaWYoIXRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3Mpe1xuICAgICAgdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xuICAgICAgbGV0IGV4cGFuZGVkSGVpZ2h0ID0gdGhpcy50YXJnZXRFbC5jbGllbnRIZWlnaHQ7XG4gICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLmhlaWdodCA9ICcwcHgnO1xuICAgICAgdGhpcy50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZS10cmFuc2l0aW9uLWV4cGFuZCcpO1xuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcbiAgICAgICAgdGhhdC50YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSBleHBhbmRlZEhlaWdodCsgJ3B4JztcbiAgICAgIH0sIDUpO1xuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpe1xuICAgICAgICB0aGF0LnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlLXRyYW5zaXRpb24tZXhwYW5kJyk7XG4gICAgICAgIHRoYXQudGFyZ2V0RWwucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuXG4gICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICB0aGF0LnRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB0aGF0LmFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIHRoYXQudHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhhdC5ldmVudE9wZW4pO1xuICAgICAgfSwgMjAwKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsYXBzZTtcbiIsIi8qKlxyXG4gKiBKYXZhU2NyaXB0ICdwb2x5ZmlsbCcgZm9yIEhUTUw1J3MgPGRldGFpbHM+IGFuZCA8c3VtbWFyeT4gZWxlbWVudHNcclxuICogYW5kICdzaGltJyB0byBhZGQgYWNjZXNzaWJsaXR5IGVuaGFuY2VtZW50cyBmb3IgYWxsIGJyb3dzZXJzXHJcbiAqXHJcbiAqIGh0dHA6Ly9jYW5pdXNlLmNvbS8jZmVhdD1kZXRhaWxzXHJcbiAqL1xyXG5pbXBvcnQgeyBnZW5lcmF0ZVVuaXF1ZUlEIH0gZnJvbSAnLi4vdXRpbHMvZ2VuZXJhdGUtdW5pcXVlLWlkLmpzJztcclxuXHJcbmNvbnN0IEtFWV9FTlRFUiA9IDEzO1xyXG5jb25zdCBLRVlfU1BBQ0UgPSAzMjtcclxuXHJcbmZ1bmN0aW9uIERldGFpbHMgKCRtb2R1bGUpIHtcclxuICB0aGlzLiRtb2R1bGUgPSAkbW9kdWxlO1xyXG59XHJcblxyXG5EZXRhaWxzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICghdGhpcy4kbW9kdWxlKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGVyZSBpcyBuYXRpdmUgZGV0YWlscyBzdXBwb3J0LCB3ZSB3YW50IHRvIGF2b2lkIHJ1bm5pbmcgY29kZSB0byBwb2x5ZmlsbCBuYXRpdmUgYmVoYXZpb3VyLlxyXG4gIGxldCBoYXNOYXRpdmVEZXRhaWxzID0gdHlwZW9mIHRoaXMuJG1vZHVsZS5vcGVuID09PSAnYm9vbGVhbic7XHJcblxyXG4gIGlmIChoYXNOYXRpdmVEZXRhaWxzKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB0aGlzLnBvbHlmaWxsRGV0YWlscygpO1xyXG59O1xyXG5cclxuRGV0YWlscy5wcm90b3R5cGUucG9seWZpbGxEZXRhaWxzID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCAkbW9kdWxlID0gdGhpcy4kbW9kdWxlO1xyXG5cclxuICAvLyBTYXZlIHNob3J0Y3V0cyB0byB0aGUgaW5uZXIgc3VtbWFyeSBhbmQgY29udGVudCBlbGVtZW50c1xyXG4gIGxldCAkc3VtbWFyeSA9IHRoaXMuJHN1bW1hcnkgPSAkbW9kdWxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzdW1tYXJ5JykuaXRlbSgwKTtcclxuICBsZXQgJGNvbnRlbnQgPSB0aGlzLiRjb250ZW50ID0gJG1vZHVsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2JykuaXRlbSgwKTtcclxuXHJcbiAgLy8gSWYgPGRldGFpbHM+IGRvZXNuJ3QgaGF2ZSBhIDxzdW1tYXJ5PiBhbmQgYSA8ZGl2PiByZXByZXNlbnRpbmcgdGhlIGNvbnRlbnRcclxuICAvLyBpdCBtZWFucyB0aGUgcmVxdWlyZWQgSFRNTCBzdHJ1Y3R1cmUgaXMgbm90IG1ldCBzbyB0aGUgc2NyaXB0IHdpbGwgc3RvcFxyXG4gIGlmICghJHN1bW1hcnkgfHwgISRjb250ZW50KSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGUgY29udGVudCBkb2Vzbid0IGhhdmUgYW4gSUQsIGFzc2lnbiBpdCBvbmUgbm93XHJcbiAgLy8gd2hpY2ggd2UnbGwgbmVlZCBmb3IgdGhlIHN1bW1hcnkncyBhcmlhLWNvbnRyb2xzIGFzc2lnbm1lbnRcclxuICBpZiAoISRjb250ZW50LmlkKSB7XHJcbiAgICAkY29udGVudC5pZCA9ICdkZXRhaWxzLWNvbnRlbnQtJyArIGdlbmVyYXRlVW5pcXVlSUQoKTtcclxuICB9XHJcblxyXG4gIC8vIEFkZCBBUklBIHJvbGU9XCJncm91cFwiIHRvIGRldGFpbHNcclxuICAkbW9kdWxlLnNldEF0dHJpYnV0ZSgncm9sZScsICdncm91cCcpO1xyXG5cclxuICAvLyBBZGQgcm9sZT1idXR0b24gdG8gc3VtbWFyeVxyXG4gICRzdW1tYXJ5LnNldEF0dHJpYnV0ZSgncm9sZScsICdidXR0b24nKTtcclxuXHJcbiAgLy8gQWRkIGFyaWEtY29udHJvbHNcclxuICAkc3VtbWFyeS5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCAkY29udGVudC5pZCk7XHJcblxyXG4gIC8vIFNldCB0YWJJbmRleCBzbyB0aGUgc3VtbWFyeSBpcyBrZXlib2FyZCBhY2Nlc3NpYmxlIGZvciBub24tbmF0aXZlIGVsZW1lbnRzXHJcbiAgLy9cclxuICAvLyBXZSBoYXZlIHRvIHVzZSB0aGUgY2FtZWxjYXNlIGB0YWJJbmRleGAgcHJvcGVydHkgYXMgdGhlcmUgaXMgYSBidWcgaW4gSUU2L0lFNyB3aGVuIHdlIHNldCB0aGUgY29ycmVjdCBhdHRyaWJ1dGUgbG93ZXJjYXNlOlxyXG4gIC8vIFNlZSBodHRwOi8vd2ViLmFyY2hpdmUub3JnL3dlYi8yMDE3MDEyMDE5NDAzNi9odHRwOi8vd3d3LnNhbGllbmNlcy5jb20vYnJvd3NlckJ1Z3MvdGFiSW5kZXguaHRtbCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cclxuICAkc3VtbWFyeS50YWJJbmRleCA9IDA7XHJcblxyXG4gIC8vIERldGVjdCBpbml0aWFsIG9wZW4gc3RhdGVcclxuICBsZXQgb3BlbkF0dHIgPSAkbW9kdWxlLmdldEF0dHJpYnV0ZSgnb3BlbicpICE9PSBudWxsO1xyXG4gIGlmIChvcGVuQXR0ciA9PT0gdHJ1ZSkge1xyXG4gICAgJHN1bW1hcnkuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgJHN1bW1hcnkuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAkY29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICB9XHJcblxyXG4gIC8vIEJpbmQgYW4gZXZlbnQgdG8gaGFuZGxlIHN1bW1hcnkgZWxlbWVudHNcclxuICB0aGlzLnBvbHlmaWxsSGFuZGxlSW5wdXRzKCRzdW1tYXJ5LCB0aGlzLnBvbHlmaWxsU2V0QXR0cmlidXRlcy5iaW5kKHRoaXMpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEZWZpbmUgYSBzdGF0ZWNoYW5nZSBmdW5jdGlvbiB0aGF0IHVwZGF0ZXMgYXJpYS1leHBhbmRlZCBhbmQgc3R5bGUuZGlzcGxheVxyXG4gKiBAcGFyYW0ge29iamVjdH0gc3VtbWFyeSBlbGVtZW50XHJcbiAqL1xyXG5EZXRhaWxzLnByb3RvdHlwZS5wb2x5ZmlsbFNldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0ICRtb2R1bGUgPSB0aGlzLiRtb2R1bGU7XHJcbiAgbGV0ICRzdW1tYXJ5ID0gdGhpcy4kc3VtbWFyeTtcclxuICBsZXQgJGNvbnRlbnQgPSB0aGlzLiRjb250ZW50O1xyXG5cclxuICBsZXQgZXhwYW5kZWQgPSAkc3VtbWFyeS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnO1xyXG4gIGxldCBoaWRkZW4gPSAkY29udGVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJztcclxuXHJcbiAgJHN1bW1hcnkuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgKGV4cGFuZGVkID8gJ2ZhbHNlJyA6ICd0cnVlJykpO1xyXG4gICRjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAoaGlkZGVuID8gJ2ZhbHNlJyA6ICd0cnVlJykpO1xyXG5cclxuXHJcbiAgbGV0IGhhc09wZW5BdHRyID0gJG1vZHVsZS5nZXRBdHRyaWJ1dGUoJ29wZW4nKSAhPT0gbnVsbDtcclxuICBpZiAoIWhhc09wZW5BdHRyKSB7XHJcbiAgICAkbW9kdWxlLnNldEF0dHJpYnV0ZSgnb3BlbicsICdvcGVuJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgICRtb2R1bGUucmVtb3ZlQXR0cmlidXRlKCdvcGVuJyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdHJ1ZVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhhbmRsZSBjcm9zcy1tb2RhbCBjbGljayBldmVudHNcclxuICogQHBhcmFtIHtvYmplY3R9IG5vZGUgZWxlbWVudFxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvblxyXG4gKi9cclxuRGV0YWlscy5wcm90b3R5cGUucG9seWZpbGxIYW5kbGVJbnB1dHMgPSBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcclxuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgLy8gV2hlbiB0aGUga2V5IGdldHMgcHJlc3NlZCAtIGNoZWNrIGlmIGl0IGlzIGVudGVyIG9yIHNwYWNlXHJcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZX0VOVEVSIHx8IGV2ZW50LmtleUNvZGUgPT09IEtFWV9TUEFDRSkge1xyXG4gICAgICBpZiAodGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzdW1tYXJ5Jykge1xyXG4gICAgICAgIC8vIFByZXZlbnQgc3BhY2UgZnJvbSBzY3JvbGxpbmcgdGhlIHBhZ2VcclxuICAgICAgICAvLyBhbmQgZW50ZXIgZnJvbSBzdWJtaXR0aW5nIGEgZm9ybVxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgLy8gQ2xpY2sgdG8gbGV0IHRoZSBjbGljayBldmVudCBkbyBhbGwgdGhlIG5lY2Vzc2FyeSBhY3Rpb25cclxuICAgICAgICBpZiAodGFyZ2V0LmNsaWNrKSB7XHJcbiAgICAgICAgICB0YXJnZXQuY2xpY2soKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gZXhjZXB0IFNhZmFyaSA1LjEgYW5kIHVuZGVyIGRvbid0IHN1cHBvcnQgLmNsaWNrKCkgaGVyZVxyXG4gICAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBQcmV2ZW50IGtleXVwIHRvIHByZXZlbnQgY2xpY2tpbmcgdHdpY2UgaW4gRmlyZWZveCB3aGVuIHVzaW5nIHNwYWNlIGtleVxyXG4gIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZX1NQQUNFKSB7XHJcbiAgICAgIGlmICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N1bW1hcnknKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGV0YWlscztcclxuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgY2xvc2VzdCA9IHJlcXVpcmUoJy4uL3V0aWxzL2Nsb3Nlc3QnKTtcbmNvbnN0IHRvZ2dsZSA9IHJlcXVpcmUoJy4uL3V0aWxzL3RvZ2dsZScpO1xuY29uc3QgYnJlYWtwb2ludHMgPSByZXF1aXJlKCcuLi91dGlscy9icmVha3BvaW50cycpO1xuY29uc3QgQlVUVE9OID0gJy5qcy1kcm9wZG93bic7XG5jb25zdCBqc0Ryb3Bkb3duQ29sbGFwc2VNb2RpZmllciA9ICdqcy1kcm9wZG93bi0tcmVzcG9uc2l2ZS1jb2xsYXBzZSc7IC8vb3B0aW9uOiBtYWtlIGRyb3Bkb3duIGJlaGF2ZSBhcyB0aGUgY29sbGFwc2UgY29tcG9uZW50IHdoZW4gb24gc21hbGwgc2NyZWVucyAodXNlZCBieSBzdWJtZW51cyBpbiB0aGUgaGVhZGVyIGFuZCBzdGVwLWRyb3Bkb3duKS5cbmNvbnN0IFRBUkdFVCA9ICdkYXRhLWpzLXRhcmdldCc7XG5jb25zdCBldmVudENsb3NlTmFtZSA9ICdmZHMuZHJvcGRvd24uY2xvc2UnO1xuY29uc3QgZXZlbnRPcGVuTmFtZSA9ICdmZHMuZHJvcGRvd24ub3Blbic7XG5cbmNsYXNzIERyb3Bkb3duIHtcbiAgY29uc3RydWN0b3IgKGVsKXtcbiAgICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLnRyaWdnZXJFbCA9IG51bGw7XG4gICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XG5cbiAgICB0aGlzLmluaXQoZWwpO1xuXG4gICAgaWYodGhpcy50cmlnZ2VyRWwgIT09IG51bGwgJiYgdGhpcy50cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnRhcmdldEVsICE9PSBudWxsICYmIHRoaXMudGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XG5cblxuICAgICAgaWYodGhpcy50cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSB8fCB0aGlzLnRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKXtcbiAgICAgICAgdGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vQ2xpY2tlZCBvdXRzaWRlIGRyb3Bkb3duIC0+IGNsb3NlIGl0XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xvc2UpO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3V0c2lkZUNsb3NlKTtcbiAgICAgIC8vQ2xpY2tlZCBvbiBkcm9wZG93biBvcGVuIGJ1dHRvbiAtLT4gdG9nZ2xlIGl0XG4gICAgICB0aGlzLnRyaWdnZXJFbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZURyb3Bkb3duKTtcbiAgICAgIHRoaXMudHJpZ2dlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlRHJvcGRvd24pO1xuXG4gICAgICAvLyBzZXQgYXJpYS1oaWRkZW4gY29ycmVjdGx5IGZvciBzY3JlZW5yZWFkZXJzIChUcmluZ3VpZGUgcmVzcG9uc2l2ZSlcbiAgICAgIGlmKHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQpIHtcbiAgICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLnRyaWdnZXJFbDtcbiAgICAgICAgaWYgKHdpbmRvdy5JbnRlcnNlY3Rpb25PYnNlcnZlcikge1xuICAgICAgICAgIC8vIHRyaWdnZXIgZXZlbnQgd2hlbiBidXR0b24gY2hhbmdlcyB2aXNpYmlsaXR5XG4gICAgICAgICAgbGV0IG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChlbnRyaWVzKSB7XG4gICAgICAgICAgICAvLyBidXR0b24gaXMgdmlzaWJsZVxuICAgICAgICAgICAgaWYgKGVudHJpZXNbIDAgXS5pbnRlcnNlY3Rpb25SYXRpbykge1xuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGJ1dHRvbiBpcyBub3QgdmlzaWJsZVxuICAgICAgICAgICAgICBpZiAodGhhdC50YXJnZXRFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgcm9vdDogZG9jdW1lbnQuYm9keVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSUU6IEludGVyc2VjdGlvbk9ic2VydmVyIGlzIG5vdCBzdXBwb3J0ZWQsIHNvIHdlIGxpc3RlbiBmb3Igd2luZG93IHJlc2l6ZSBhbmQgZ3JpZCBicmVha3BvaW50IGluc3RlYWRcbiAgICAgICAgICBpZiAoZG9SZXNwb25zaXZlQ29sbGFwc2UodGhhdC50cmlnZ2VyRWwpKSB7XG4gICAgICAgICAgICAvLyBzbWFsbCBzY3JlZW5cbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgICB9IGVsc2V7XG4gICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBMYXJnZSBzY3JlZW5cbiAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRoYXQudHJpZ2dlckVsKSkge1xuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgICAgIH0gZWxzZXtcbiAgICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBldnQgPSBldnQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDI3KSB7XG4gICAgICAgICAgY2xvc2VBbGwoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBpbml0IChlbCl7XG4gICAgdGhpcy50cmlnZ2VyRWwgPSBlbDtcbiAgICBpZih0aGlzLnRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0aGlzLnRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIGxldCB0YXJnZXRBdHRyID0gdGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XG4gICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIGxldCB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKSk7XG4gICAgICAgIGlmKHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgIHRoaXMudGFyZ2V0RWwgPSB0YXJnZXRFbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRvZ2dsZSBhIGJ1dHRvbidzIFwicHJlc3NlZFwiIHN0YXRlLCBvcHRpb25hbGx5IHByb3ZpZGluZyBhIHRhcmdldFxuICogc3RhdGUuXG4gKlxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXG4gKiBAcGFyYW0ge2Jvb2xlYW4/fSBleHBhbmRlZCBJZiBubyBzdGF0ZSBpcyBwcm92aWRlZCwgdGhlIGN1cnJlbnRcbiAqIHN0YXRlIHdpbGwgYmUgdG9nZ2xlZCAoZnJvbSBmYWxzZSB0byB0cnVlLCBhbmQgdmljZS12ZXJzYSkuXG4gKiBAcmV0dXJuIHtib29sZWFufSB0aGUgcmVzdWx0aW5nIHN0YXRlXG4gKi9cbmNvbnN0IHRvZ2dsZUJ1dHRvbiA9IChidXR0b24sIGV4cGFuZGVkKSA9PiB7XG4gIHRvZ2dsZShidXR0b24sIGV4cGFuZGVkKTtcbn07XG5cbi8qKlxuICogR2V0IGFuIEFycmF5IG9mIGJ1dHRvbiBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXG4gKiBhY2NvcmRpb24gZWxlbWVudC5cbiAqIEBwYXJhbSBwYXJlbnQgYWNjb3JkaW9uIGVsZW1lbnRcbiAqIEByZXR1cm5zIHtOb2RlTGlzdE9mPFNWR0VsZW1lbnRUYWdOYW1lTWFwW1tzdHJpbmddXT4gfCBOb2RlTGlzdE9mPEhUTUxFbGVtZW50VGFnTmFtZU1hcFtbc3RyaW5nXV0+IHwgTm9kZUxpc3RPZjxFbGVtZW50Pn1cbiAqL1xubGV0IGdldEJ1dHRvbnMgPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gIHJldHVybiBwYXJlbnQucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xufTtcblxubGV0IGNsb3NlQWxsID0gZnVuY3Rpb24gKCl7XG5cbiAgbGV0IGV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgZXZlbnRDbG9zZS5pbml0RXZlbnQoZXZlbnRDbG9zZU5hbWUsIHRydWUsIHRydWUpO1xuXG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG5cbiAgbGV0IG92ZXJmbG93TWVudUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3ZlcmZsb3ctbWVudScpO1xuICBmb3IgKGxldCBvaSA9IDA7IG9pIDwgb3ZlcmZsb3dNZW51RWwubGVuZ3RoOyBvaSsrKSB7XG4gICAgbGV0IGN1cnJlbnRPdmVyZmxvd01lbnVFTCA9IG92ZXJmbG93TWVudUVsWyBvaSBdO1xuICAgIGxldCB0cmlnZ2VyRWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwucXVlcnlTZWxlY3RvcihCVVRUT04pO1xuICAgIGxldCB0YXJnZXRFbCA9IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5xdWVyeVNlbGVjdG9yKCcjJyt0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCkucmVwbGFjZSgnIycsICcnKSk7XG5cbiAgICBpZiAodGFyZ2V0RWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSBudWxsKSB7XG4gICAgICBpZihkb1Jlc3BvbnNpdmVDb2xsYXBzZSh0cmlnZ2VyRWwpKXtcbiAgICAgICAgaWYodHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSB0cnVlKXtcbiAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcbiAgICAgICAgfVxuICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xuICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5sZXQgb2Zmc2V0ID0gZnVuY3Rpb24gKGVsKSB7XG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgcmV0dXJuIHsgdG9wOiByZWN0LnRvcCArIHNjcm9sbFRvcCwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCB9O1xufTtcblxubGV0IHRvZ2dsZURyb3Bkb3duID0gZnVuY3Rpb24gKGV2ZW50LCBmb3JjZUNsb3NlID0gZmFsc2UpIHtcbiAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgbGV0IGV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgZXZlbnRDbG9zZS5pbml0RXZlbnQoZXZlbnRDbG9zZU5hbWUsIHRydWUsIHRydWUpO1xuXG4gIGxldCBldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgZXZlbnRPcGVuLmluaXRFdmVudChldmVudE9wZW5OYW1lLCB0cnVlLCB0cnVlKTtcbiAgbGV0IHRyaWdnZXJFbCA9IHRoaXM7XG4gIGxldCB0YXJnZXRFbCA9IG51bGw7XG4gIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCl7XG4gICAgbGV0IHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XG4gICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xuICAgICAgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJykpO1xuICAgIH1cbiAgfVxuICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgLy9jaGFuZ2Ugc3RhdGVcblxuICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSBudWxsO1xuICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gbnVsbDtcblxuICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnIHx8IGZvcmNlQ2xvc2Upe1xuICAgICAgLy9jbG9zZVxuICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xuICAgIH1lbHNle1xuICAgICAgY2xvc2VBbGwoKTtcbiAgICAgIC8vb3BlblxuICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcbiAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XG4gICAgICBsZXQgdGFyZ2V0T2Zmc2V0ID0gb2Zmc2V0KHRhcmdldEVsKTtcblxuICAgICAgaWYodGFyZ2V0T2Zmc2V0LmxlZnQgPCAwKXtcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICcwcHgnO1xuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICdhdXRvJztcbiAgICAgIH1cbiAgICAgIGxldCByaWdodCA9IHRhcmdldE9mZnNldC5sZWZ0ICsgdGFyZ2V0RWwub2Zmc2V0V2lkdGg7XG4gICAgICBpZihyaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKXtcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICdhdXRvJztcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnMHB4JztcbiAgICAgIH1cblxuICAgICAgbGV0IG9mZnNldEFnYWluID0gb2Zmc2V0KHRhcmdldEVsKTtcblxuICAgICAgaWYob2Zmc2V0QWdhaW4ubGVmdCA8IDApe1xuXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnMHB4JztcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XG4gICAgICB9XG4gICAgICByaWdodCA9IG9mZnNldEFnYWluLmxlZnQgKyB0YXJnZXRFbC5vZmZzZXRXaWR0aDtcbiAgICAgIGlmKHJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpe1xuXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnYXV0byc7XG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cbn07XG5cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWVcbiAqL1xubGV0IHNob3cgPSBmdW5jdGlvbiAoYnV0dG9uKXtcbiAgdG9nZ2xlQnV0dG9uKGJ1dHRvbiwgdHJ1ZSk7XG59O1xuXG5cblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cbiAqIEByZXR1cm4ge2Jvb2xlYW59IGZhbHNlXG4gKi9cbmxldCBoaWRlID0gZnVuY3Rpb24gKGJ1dHRvbikge1xuICB0b2dnbGVCdXR0b24oYnV0dG9uLCBmYWxzZSk7XG59O1xuXG5cbmxldCBvdXRzaWRlQ2xvc2UgPSBmdW5jdGlvbiAoZXZ0KXtcbiAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keS5tb2JpbGVfbmF2LWFjdGl2ZScpID09PSBudWxsKSB7XG4gICAgbGV0IG9wZW5Ecm9wZG93bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtZHJvcGRvd25bYXJpYS1leHBhbmRlZD10cnVlXScpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3BlbkRyb3Bkb3ducy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHRyaWdnZXJFbCA9IG9wZW5Ecm9wZG93bnNbaV07XG4gICAgICBsZXQgdGFyZ2V0RWwgPSBudWxsO1xuICAgICAgbGV0IHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XG4gICAgICBpZiAodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyKTtcbiAgICAgIH1cbiAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSh0cmlnZ2VyRWwpKSB7XG4gICAgICAgIC8vY2xvc2VzIGRyb3Bkb3duIHdoZW4gY2xpY2tlZCBvdXRzaWRlXG4gICAgICAgIGlmIChldnQudGFyZ2V0ICE9PSB0cmlnZ2VyRWwpIHtcbiAgICAgICAgICAvL2NsaWNrZWQgb3V0c2lkZSB0cmlnZ2VyLCBmb3JjZSBjbG9zZVxuICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgICAgICAgIGxldCBldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgZXZlbnRDbG9zZS5pbml0RXZlbnQoZXZlbnRDbG9zZU5hbWUsIHRydWUsIHRydWUpO1xuICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5sZXQgZG9SZXNwb25zaXZlQ29sbGFwc2UgPSBmdW5jdGlvbiAodHJpZ2dlckVsKXtcbiAgaWYoIXRyaWdnZXJFbC5jbGFzc0xpc3QuY29udGFpbnMoanNEcm9wZG93bkNvbGxhcHNlTW9kaWZpZXIpKXtcbiAgICAvLyBub3QgbmF2IG92ZXJmbG93IG1lbnVcbiAgICBpZih0cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSB8fCB0cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSkge1xuICAgICAgLy8gdHJpbmluZGlrYXRvciBvdmVyZmxvdyBtZW51XG4gICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPD0gZ2V0VHJpbmd1aWRlQnJlYWtwb2ludCh0cmlnZ2VyRWwpKSB7XG4gICAgICAgIC8vIG92ZXJmbG93IG1lbnUgcMOlIHJlc3BvbnNpdiB0cmluZ3VpZGUgYWt0aXZlcmV0XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZXtcbiAgICAgIC8vIG5vcm1hbCBvdmVyZmxvdyBtZW51XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5sZXQgZ2V0VHJpbmd1aWRlQnJlYWtwb2ludCA9IGZ1bmN0aW9uIChidXR0b24pe1xuICBpZihidXR0b24ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSl7XG4gICAgcmV0dXJuIGJyZWFrcG9pbnRzLm1kO1xuICB9XG4gIGlmKGJ1dHRvbi5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKXtcbiAgICByZXR1cm4gYnJlYWtwb2ludHMubGc7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRHJvcGRvd247XG4iLCJcclxuZnVuY3Rpb24gTW9kYWwgKCRtb2RhbCl7XHJcbiAgdGhpcy4kbW9kYWwgPSAkbW9kYWw7XHJcbiAgbGV0IGlkID0gdGhpcy4kbW9kYWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gIHRoaXMudHJpZ2dlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGU9XCJtb2RhbFwiXVtkYXRhLXRhcmdldD1cIicraWQrJ1wiXScpO1xyXG4gIHdpbmRvdy5tb2RhbCA9IHtcImxhc3RGb2N1c1wiOiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LCBcImlnbm9yZVV0aWxGb2N1c0NoYW5nZXNcIjogZmFsc2V9O1xyXG59XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdHJpZ2dlcnMgPSB0aGlzLnRyaWdnZXJzO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHJpZ2dlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgbGV0IHRyaWdnZXIgPSB0cmlnZ2Vyc1sgaSBdO1xyXG4gICAgdHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2hvdy5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgbGV0IGNsb3NlcnMgPSB0aGlzLiRtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2RhbC1jbG9zZV0nKTtcclxuICBmb3IgKGxldCBjID0gMDsgYyA8IGNsb3NlcnMubGVuZ3RoOyBjKyspe1xyXG4gICAgbGV0IGNsb3NlciA9IGNsb3NlcnNbIGMgXTtcclxuICAgIGNsb3Nlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcclxuICB9XHJcblxyXG5cclxuXHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpe1xyXG4gIGxldCBtb2RhbEVsZW1lbnQgPSB0aGlzLiRtb2RhbDtcclxuICBpZihtb2RhbEVsZW1lbnQgIT09IG51bGwpe1xyXG4gICAgbW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuICAgIGxldCBldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICBldmVudENsb3NlLmluaXRFdmVudCgnZmRzLm1vZGFsLmhpZGRlbicsIHRydWUsIHRydWUpO1xyXG4gICAgbW9kYWxFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcblxyXG4gICAgbGV0ICRiYWNrZHJvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2RhbC1iYWNrZHJvcCcpO1xyXG4gICAgJGJhY2tkcm9wLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoJGJhY2tkcm9wKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy50cmFwRm9jdXMsIHRydWUpO1xyXG5cclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlRXNjYXBlKTtcclxuICB9XHJcbn07XHJcblxyXG5cclxuTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKXtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gdGhpcy4kbW9kYWw7XHJcbiAgaWYobW9kYWxFbGVtZW50ICE9PSBudWxsKXtcclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG5cclxuICAgIGxldCBldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgIGV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5tb2RhbC5zaG93bicsIHRydWUsIHRydWUpO1xyXG4gICAgbW9kYWxFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuXHJcbiAgICBsZXQgJGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAkYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnbW9kYWwtYmFja2Ryb3AnKTtcclxuICAgICRiYWNrZHJvcC5zZXRBdHRyaWJ1dGUoJ2lkJywgXCJtb2RhbC1iYWNrZHJvcFwiKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQoJGJhY2tkcm9wKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKTtcclxuXHJcbiAgICBtb2RhbEVsZW1lbnQuZm9jdXMoKTtcclxuICAgIHdpbmRvdy5tb2RhbC5sYXN0Rm9jdXMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy50cmFwRm9jdXMsIHRydWUpO1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlRXNjYXBlKTtcclxuXHJcbiAgfVxyXG59O1xyXG5cclxubGV0IGhhbmRsZUVzY2FwZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gIGxldCBjdXJyZW50TW9kYWwgPSBuZXcgTW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKSk7XHJcbiAgaWYgKGtleSA9PT0gMjcgJiYgY3VycmVudE1vZGFsLmhpZGUoKSkge1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG59O1xyXG5cclxuXHJcbk1vZGFsLnByb3RvdHlwZS50cmFwRm9jdXMgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgICBpZiAod2luZG93Lm1vZGFsLmlnbm9yZVV0aWxGb2N1c0NoYW5nZXMpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdmFyIGN1cnJlbnREaWFsb2cgPSBuZXcgTW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKSk7XHJcbiAgICBpZiAoY3VycmVudERpYWxvZy4kbW9kYWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbW9kYWwtY29udGVudCcpWzBdLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgfHwgY3VycmVudERpYWxvZy4kbW9kYWwgPT0gZXZlbnQudGFyZ2V0KSB7XHJcbiAgICAgIHdpbmRvdy5tb2RhbC5sYXN0Rm9jdXMgPSBldmVudC50YXJnZXQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY3VycmVudERpYWxvZy5mb2N1c0ZpcnN0RGVzY2VuZGFudChjdXJyZW50RGlhbG9nLiRtb2RhbCk7XHJcbiAgICAgIGlmICh3aW5kb3cubW9kYWwubGFzdEZvY3VzID09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgICBjdXJyZW50RGlhbG9nLmZvY3VzTGFzdERlc2NlbmRhbnQoY3VycmVudERpYWxvZy4kbW9kYWwpO1xyXG4gICAgICB9XHJcbiAgICAgIHdpbmRvdy5tb2RhbC5sYXN0Rm9jdXMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLmlzRm9jdXNhYmxlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICBpZiAoZWxlbWVudC50YWJJbmRleCA+IDAgfHwgKGVsZW1lbnQudGFiSW5kZXggPT09IDAgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYkluZGV4JykgIT09IG51bGwpKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGlmIChlbGVtZW50LmRpc2FibGVkKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBzd2l0Y2ggKGVsZW1lbnQubm9kZU5hbWUpIHtcclxuICAgIGNhc2UgJ0EnOlxyXG4gICAgICByZXR1cm4gISFlbGVtZW50LmhyZWYgJiYgZWxlbWVudC5yZWwgIT0gJ2lnbm9yZSc7XHJcbiAgICBjYXNlICdJTlBVVCc6XHJcbiAgICAgIHJldHVybiBlbGVtZW50LnR5cGUgIT0gJ2hpZGRlbicgJiYgZWxlbWVudC50eXBlICE9ICdmaWxlJztcclxuICAgIGNhc2UgJ0JVVFRPTic6XHJcbiAgICBjYXNlICdTRUxFQ1QnOlxyXG4gICAgY2FzZSAnVEVYVEFSRUEnOlxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcblxyXG5cclxuTW9kYWwucHJvdG90eXBlLmZvY3VzRmlyc3REZXNjZW5kYW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGNoaWxkID0gZWxlbWVudC5jaGlsZE5vZGVzW2ldO1xyXG4gICAgaWYgKHRoaXMuYXR0ZW1wdEZvY3VzKGNoaWxkKSB8fFxyXG4gICAgICB0aGlzLmZvY3VzRmlyc3REZXNjZW5kYW50KGNoaWxkKSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5mb2N1c0xhc3REZXNjZW5kYW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICBmb3IgKHZhciBpID0gZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICB2YXIgY2hpbGQgPSBlbGVtZW50LmNoaWxkTm9kZXNbaV07XHJcbiAgICBpZiAodGhpcy5hdHRlbXB0Rm9jdXMoY2hpbGQpIHx8XHJcbiAgICAgIHRoaXMuZm9jdXNMYXN0RGVzY2VuZGFudChjaGlsZCkpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbk1vZGFsLnByb3RvdHlwZS5hdHRlbXB0Rm9jdXMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gIGlmICghdGhpcy5pc0ZvY3VzYWJsZShlbGVtZW50KSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgd2luZG93Lm1vZGFsLmlnbm9yZVV0aWxGb2N1c0NoYW5nZXMgPSB0cnVlO1xyXG4gIHRyeSB7XHJcbiAgICBlbGVtZW50LmZvY3VzKCk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgfVxyXG4gIHdpbmRvdy5tb2RhbC5pZ25vcmVVdGlsRm9jdXNDaGFuZ2VzID0gZmFsc2U7XHJcbiAgcmV0dXJuIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBlbGVtZW50KTtcclxufTtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBNb2RhbDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xuY29uc3QgZHJvcGRvd24gPSByZXF1aXJlKCcuL2Ryb3Bkb3duJyk7XG5cbmNvbnN0IE5BViA9IGAubmF2YDtcbmNvbnN0IE5BVl9MSU5LUyA9IGAke05BVn0gYWA7XG5jb25zdCBPUEVORVJTID0gYC5qcy1tZW51LW9wZW5gO1xuY29uc3QgQ0xPU0VfQlVUVE9OID0gYC5qcy1tZW51LWNsb3NlYDtcbmNvbnN0IE9WRVJMQVkgPSBgLm92ZXJsYXlgO1xuY29uc3QgQ0xPU0VSUyA9IGAke0NMT1NFX0JVVFRPTn0sIC5vdmVybGF5YDtcbmNvbnN0IFRPR0dMRVMgPSBbIE5BViwgT1ZFUkxBWSBdLmpvaW4oJywgJyk7XG5cbmNvbnN0IEFDVElWRV9DTEFTUyA9ICdtb2JpbGVfbmF2LWFjdGl2ZSc7XG5jb25zdCBWSVNJQkxFX0NMQVNTID0gJ2lzLXZpc2libGUnO1xuXG5jb25zdCBpc0FjdGl2ZSA9ICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUyk7XG5cbmNvbnN0IF9mb2N1c1RyYXAgPSAodHJhcENvbnRhaW5lcikgPT4ge1xuXG4gIC8vIEZpbmQgYWxsIGZvY3VzYWJsZSBjaGlsZHJlblxuICBjb25zdCBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9ICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSc7XG4gIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IHRyYXBDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XG4gIGxldCBmaXJzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1sgMCBdO1xuXG4gIGZ1bmN0aW9uIHRyYXBUYWJLZXkgKGUpIHtcbiAgICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcbiAgICAvLyBDaGVjayBmb3IgVEFCIGtleSBwcmVzc1xuICAgIGlmIChrZXkgPT09IDkpIHtcblxuICAgICAgbGV0IGxhc3RUYWJTdG9wID0gbnVsbDtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGxldCBudW1iZXIgPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xuICAgICAgICBsZXQgZWxlbWVudCA9IGZvY3VzYWJsZUVsZW1lbnRzWyBudW1iZXIgLSBpIF07XG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoID4gMCAmJiBlbGVtZW50Lm9mZnNldEhlaWdodCA+IDApIHtcbiAgICAgICAgICBsYXN0VGFiU3RvcCA9IGVsZW1lbnQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU0hJRlQgKyBUQUJcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdFRhYlN0b3ApIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgbGFzdFRhYlN0b3AuZm9jdXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAvLyBUQUJcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0VGFiU3RvcCkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEVTQ0FQRVxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVuYWJsZSAoKSB7XG4gICAgICAgIC8vIEZvY3VzIGZpcnN0IGNoaWxkXG4gICAgICAgIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xuICAgICAgLy8gTGlzdGVuIGZvciBhbmQgdHJhcCB0aGUga2V5Ym9hcmRcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcbiAgICB9LFxuXG4gICAgcmVsZWFzZSAoKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcFRhYktleSk7XG4gICAgfSxcbiAgfTtcbn07XG5cbmxldCBmb2N1c1RyYXA7XG5cbmNvbnN0IHRvZ2dsZU5hdiA9IGZ1bmN0aW9uIChhY3RpdmUpIHtcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gIGlmICh0eXBlb2YgYWN0aXZlICE9PSAnYm9vbGVhbicpIHtcbiAgICBhY3RpdmUgPSAhaXNBY3RpdmUoKTtcbiAgfVxuICBib2R5LmNsYXNzTGlzdC50b2dnbGUoQUNUSVZFX0NMQVNTLCBhY3RpdmUpO1xuXG4gIGZvckVhY2goc2VsZWN0KFRPR0dMRVMpLCBlbCA9PiB7XG4gICAgZWwuY2xhc3NMaXN0LnRvZ2dsZShWSVNJQkxFX0NMQVNTLCBhY3RpdmUpO1xuICB9KTtcbiAgaWYgKGFjdGl2ZSkge1xuICAgIGZvY3VzVHJhcC5lbmFibGUoKTtcbiAgfSBlbHNlIHtcbiAgICBmb2N1c1RyYXAucmVsZWFzZSgpO1xuICB9XG5cbiAgY29uc3QgY2xvc2VCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcbiAgY29uc3QgbWVudUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihPUEVORVJTKTtcblxuICBpZiAoYWN0aXZlICYmIGNsb3NlQnV0dG9uKSB7XG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgYWN0aXZhdGVkLCBzbyBmb2N1cyBvbiB0aGUgY2xvc2UgYnV0dG9uLFxuICAgIC8vIHdoaWNoIGlzIGp1c3QgYmVmb3JlIGFsbCB0aGUgbmF2IGVsZW1lbnRzIGluIHRoZSB0YWIgb3JkZXIuXG4gICAgY2xvc2VCdXR0b24uZm9jdXMoKTtcbiAgfSBlbHNlIGlmICghYWN0aXZlICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGNsb3NlQnV0dG9uICYmXG4gICAgICAgICAgICAgbWVudUJ1dHRvbikge1xuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGRlYWN0aXZhdGVkLCBhbmQgZm9jdXMgd2FzIG9uIHRoZSBjbG9zZVxuICAgIC8vIGJ1dHRvbiwgd2hpY2ggaXMgbm8gbG9uZ2VyIHZpc2libGUuIFdlIGRvbid0IHdhbnQgdGhlIGZvY3VzIHRvXG4gICAgLy8gZGlzYXBwZWFyIGludG8gdGhlIHZvaWQsIHNvIGZvY3VzIG9uIHRoZSBtZW51IGJ1dHRvbiBpZiBpdCdzXG4gICAgLy8gdmlzaWJsZSAodGhpcyBtYXkgaGF2ZSBiZWVuIHdoYXQgdGhlIHVzZXIgd2FzIGp1c3QgZm9jdXNlZCBvbixcbiAgICAvLyBpZiB0aGV5IHRyaWdnZXJlZCB0aGUgbW9iaWxlIG5hdiBieSBtaXN0YWtlKS5cbiAgICBtZW51QnV0dG9uLmZvY3VzKCk7XG4gIH1cblxuICByZXR1cm4gYWN0aXZlO1xufTtcblxuY29uc3QgcmVzaXplID0gKCkgPT4ge1xuXG4gIGxldCBtb2JpbGUgPSBmYWxzZTtcbiAgbGV0IG9wZW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE9QRU5FUlMpO1xuICBmb3IobGV0IG8gPSAwOyBvIDwgb3BlbmVycy5sZW5ndGg7IG8rKykge1xuICAgIGlmKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG9wZW5lcnNbb10sIG51bGwpLmRpc3BsYXkgIT09ICdub25lJykge1xuICAgICAgb3BlbmVyc1tvXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU5hdik7XG4gICAgICBtb2JpbGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmKG1vYmlsZSl7XG4gICAgbGV0IGNsb3NlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKENMT1NFUlMpO1xuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjbG9zZXJzLmxlbmd0aDsgYysrKSB7XG4gICAgICBjbG9zZXJzWyBjIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVOYXYpO1xuICAgIH1cblxuICAgIGxldCBuYXZMaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoTkFWX0xJTktTKTtcbiAgICBmb3IobGV0IG4gPSAwOyBuIDwgbmF2TGlua3MubGVuZ3RoOyBuKyspIHtcbiAgICAgIG5hdkxpbmtzWyBuIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAvLyBBIG5hdmlnYXRpb24gbGluayBoYXMgYmVlbiBjbGlja2VkISBXZSB3YW50IHRvIGNvbGxhcHNlIGFueVxuICAgICAgICAvLyBoaWVyYXJjaGljYWwgbmF2aWdhdGlvbiBVSSBpdCdzIGEgcGFydCBvZiwgc28gdGhhdCB0aGUgdXNlclxuICAgICAgICAvLyBjYW4gZm9jdXMgb24gd2hhdGV2ZXIgdGhleSd2ZSBqdXN0IHNlbGVjdGVkLlxuXG4gICAgICAgIC8vIFNvbWUgbmF2aWdhdGlvbiBsaW5rcyBhcmUgaW5zaWRlIGRyb3Bkb3duczsgd2hlbiB0aGV5J3JlXG4gICAgICAgIC8vIGNsaWNrZWQsIHdlIHdhbnQgdG8gY29sbGFwc2UgdGhvc2UgZHJvcGRvd25zLlxuXG5cbiAgICAgICAgLy8gSWYgdGhlIG1vYmlsZSBuYXZpZ2F0aW9uIG1lbnUgaXMgYWN0aXZlLCB3ZSB3YW50IHRvIGhpZGUgaXQuXG4gICAgICAgIGlmIChpc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmFwQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoTkFWKTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdHJhcENvbnRhaW5lcnMubGVuZ3RoOyBpKyspe1xuICAgICAgZm9jdXNUcmFwID0gX2ZvY3VzVHJhcCh0cmFwQ29udGFpbmVyc1tpXSk7XG4gICAgfVxuXG4gIH1cblxuICBjb25zdCBjbG9zZXIgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcblxuICBpZiAoaXNBY3RpdmUoKSAmJiBjbG9zZXIgJiYgY2xvc2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoID09PSAwKSB7XG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgaXMgYWN0aXZlLCBidXQgdGhlIGNsb3NlIGJveCBpc24ndCB2aXNpYmxlLCB3aGljaFxuICAgIC8vIG1lYW5zIHRoZSB1c2VyJ3Mgdmlld3BvcnQgaGFzIGJlZW4gcmVzaXplZCBzbyB0aGF0IGl0IGlzIG5vIGxvbmdlclxuICAgIC8vIGluIG1vYmlsZSBtb2RlLiBMZXQncyBtYWtlIHRoZSBwYWdlIHN0YXRlIGNvbnNpc3RlbnQgYnlcbiAgICAvLyBkZWFjdGl2YXRpbmcgdGhlIG1vYmlsZSBuYXYuXG4gICAgdG9nZ2xlTmF2LmNhbGwoY2xvc2VyLCBmYWxzZSk7XG4gIH1cbn07XG5cbmNsYXNzIE5hdmlnYXRpb24ge1xuICBjb25zdHJ1Y3RvciAoKXtcbiAgICB0aGlzLmluaXQoKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcblxuXG4gIH1cblxuICBpbml0ICgpIHtcblxuICAgIHJlc2l6ZSgpO1xuICB9XG5cbiAgdGVhcmRvd24gKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hdmlnYXRpb247XG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5jbGFzcyBSYWRpb1RvZ2dsZUdyb3Vwe1xyXG4gICAgY29uc3RydWN0b3IoZWwpe1xyXG4gICAgICAgIHRoaXMuanNUb2dnbGVUcmlnZ2VyID0gJy5qcy1yYWRpby10b2dnbGUtZ3JvdXAnO1xyXG4gICAgICAgIHRoaXMuanNUb2dnbGVUYXJnZXQgPSAnZGF0YS1qcy10YXJnZXQnO1xyXG5cclxuICAgICAgICB0aGlzLmV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgICAgICB0aGlzLmV2ZW50Q2xvc2UuaW5pdEV2ZW50KCdmZHMuY29sbGFwc2UuY2xvc2UnLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdGhpcy5ldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgICAgICB0aGlzLmV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5jb2xsYXBzZS5vcGVuJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5yYWRpb0VscyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdChlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCAoZWwpe1xyXG4gICAgICAgIHRoaXMucmFkaW9Hcm91cCA9IGVsO1xyXG4gICAgICAgIHRoaXMucmFkaW9FbHMgPSB0aGlzLnJhZGlvR3JvdXAucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdJyk7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5yYWRpb0Vscy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICB2YXIgcmFkaW8gPSB0aGlzLnJhZGlvRWxzWyBpIF07XHJcbiAgICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgICAgZm9yKGxldCBhID0gMDsgYSA8IHRoYXQucmFkaW9FbHMubGVuZ3RoOyBhKysgKXtcclxuICAgICAgICAgICAgICB0aGF0LnRvZ2dsZSh0aGF0LnJhZGlvRWxzWyBhIF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGlzLnRvZ2dsZShyYWRpbyk7IC8vSW5pdGlhbCB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlICh0cmlnZ2VyRWwpe1xyXG4gICAgICAgIHZhciB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZSh0aGlzLmpzVG9nZ2xlVGFyZ2V0KTtcclxuICAgICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0QXR0cik7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYodHJpZ2dlckVsLmNoZWNrZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcclxuICAgICAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50T3Blbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCl7XHJcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudENsb3NlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmFkaW9Ub2dnbGVHcm91cDtcclxuIiwiLypcbiogUHJldmVudHMgdGhlIHVzZXIgZnJvbSBpbnB1dHRpbmcgYmFzZWQgb24gYSByZWdleC5cbiogRG9lcyBub3Qgd29yayB0aGUgc2FtZSB3YXkgYWYgPGlucHV0IHBhdHRlcm49XCJcIj4sIHRoaXMgcGF0dGVybiBpcyBvbmx5IHVzZWQgZm9yIHZhbGlkYXRpb24sIG5vdCB0byBwcmV2ZW50IGlucHV0LlxuKiBVc2VjYXNlOiBudW1iZXIgaW5wdXQgZm9yIGRhdGUtY29tcG9uZW50LlxuKiBFeGFtcGxlIC0gbnVtYmVyIG9ubHk6IDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtaW5wdXQtcmVnZXg9XCJeXFxkKiRcIj5cbiovXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IG1vZGlmaWVyU3RhdGUgPSB7XG4gIHNoaWZ0OiBmYWxzZSxcbiAgYWx0OiBmYWxzZSxcbiAgY3RybDogZmFsc2UsXG4gIGNvbW1hbmQ6IGZhbHNlXG59O1xuXG5jbGFzcyBJbnB1dFJlZ2V4TWFzayB7XG4gIGNvbnN0cnVjdG9yIChlbGVtZW50KXtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgcmVnZXhNYXNrKTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCByZWdleE1hc2spO1xuICB9XG59XG52YXIgcmVnZXhNYXNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGlmKG1vZGlmaWVyU3RhdGUuY3RybCB8fCBtb2RpZmllclN0YXRlLmNvbW1hbmQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5ld0NoYXIgPSBudWxsO1xuICBpZih0eXBlb2YgZXZlbnQua2V5ICE9PSAndW5kZWZpbmVkJyl7XG4gICAgaWYoZXZlbnQua2V5Lmxlbmd0aCA9PT0gMSl7XG4gICAgICBuZXdDaGFyID0gZXZlbnQua2V5O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZighZXZlbnQuY2hhckNvZGUpe1xuICAgICAgbmV3Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQua2V5Q29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmNoYXJDb2RlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgcmVnZXhTdHIgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1pbnB1dC1yZWdleCcpO1xuXG4gIGlmKGV2ZW50LnR5cGUgIT09IHVuZGVmaW5lZCAmJiBldmVudC50eXBlID09PSAncGFzdGUnKXtcbiAgICBjb25zb2xlLmxvZygncGFzdGUnKTtcbiAgfSBlbHNle1xuICAgIHZhciBlbGVtZW50ID0gbnVsbDtcbiAgICBpZihldmVudC50YXJnZXQgIT09IHVuZGVmaW5lZCl7XG4gICAgICBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICAgIH1cbiAgICBpZihuZXdDaGFyICE9PSBudWxsICYmIGVsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgIGlmKG5ld0NoYXIubGVuZ3RoID4gMCl7XG4gICAgICAgIGxldCBuZXdWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgIGlmKGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcicpe1xuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTsvL05vdGUgaW5wdXRbdHlwZT1udW1iZXJdIGRvZXMgbm90IGhhdmUgLnNlbGVjdGlvblN0YXJ0L0VuZCAoQ2hyb21lKS5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIGVsZW1lbnQuc2VsZWN0aW9uU3RhcnQpICsgdGhpcy52YWx1ZS5zbGljZShlbGVtZW50LnNlbGVjdGlvbkVuZCkgKyBuZXdDaGFyOyAvL3JlbW92ZXMgdGhlIG51bWJlcnMgc2VsZWN0ZWQgYnkgdGhlIHVzZXIsIHRoZW4gYWRkcyBuZXcgY2hhci5cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByID0gbmV3IFJlZ0V4cChyZWdleFN0cik7XG4gICAgICAgIGlmKHIuZXhlYyhuZXdWYWx1ZSkgPT09IG51bGwpe1xuICAgICAgICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXRSZWdleE1hc2s7XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBvbmNlID0gcmVxdWlyZSgncmVjZXB0b3Ivb25jZScpO1xuXG5jbGFzcyBTZXRUYWJJbmRleCB7XG4gIGNvbnN0cnVjdG9yIChlbGVtZW50KXtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCl7XG4gICAgICAvLyBOQjogd2Uga25vdyBiZWNhdXNlIG9mIHRoZSBzZWxlY3RvciB3ZSdyZSBkZWxlZ2F0aW5nIHRvIGJlbG93IHRoYXQgdGhlXG4gICAgICAvLyBocmVmIGFscmVhZHkgYmVnaW5zIHdpdGggJyMnXG4gICAgICBjb25zdCBpZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdocmVmJykuc2xpY2UoMSk7XG4gICAgICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgMCk7XG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgb25jZShldmVudCA9PiB7XG4gICAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSk7XG4gICAgICAgIH0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRocm93IGFuIGVycm9yP1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0VGFiSW5kZXg7XG4iLCJjb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcblxuY2xhc3MgUmVzcG9uc2l2ZVRhYmxlIHtcbiAgICBjb25zdHJ1Y3RvciAodGFibGUpIHtcbiAgICAgICAgdGhpcy5pbnNlcnRIZWFkZXJBc0F0dHJpYnV0ZXModGFibGUpO1xuICAgIH1cblxuICAgIC8vIEFkZCBkYXRhIGF0dHJpYnV0ZXMgbmVlZGVkIGZvciByZXNwb25zaXZlIG1vZGUuXG4gICAgaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzICh0YWJsZUVsKXtcbiAgICAgICAgaWYgKCF0YWJsZUVsKSByZXR1cm47XG5cbiAgICAgICAgbGV0IGhlYWRlciA9ICB0YWJsZUVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aGVhZCcpO1xuICAgICAgICBpZihoZWFkZXIubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgbGV0IGhlYWRlckNlbGxFbHMgPSBoZWFkZXJbIDAgXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGgnKTtcbiAgICAgICAgICBpZiAoaGVhZGVyQ2VsbEVscy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclsgMCBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChoZWFkZXJDZWxsRWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgYm9keVJvd0VscyA9IHNlbGVjdCgndGJvZHkgdHInLCB0YWJsZUVsKTtcbiAgICAgICAgICAgIEFycmF5LmZyb20oYm9keVJvd0VscykuZm9yRWFjaChyb3dFbCA9PiB7XG4gICAgICAgICAgICAgIGxldCBjZWxsRWxzID0gcm93RWwuY2hpbGRyZW47XG4gICAgICAgICAgICAgIGlmIChjZWxsRWxzLmxlbmd0aCA9PT0gaGVhZGVyQ2VsbEVscy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGhlYWRlckNlbGxFbHMpLmZvckVhY2goKGhlYWRlckNlbGxFbCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgICAgLy8gR3JhYiBoZWFkZXIgY2VsbCB0ZXh0IGFuZCB1c2UgaXQgYm9keSBjZWxsIGRhdGEgdGl0bGUuXG4gICAgICAgICAgICAgICAgICBjZWxsRWxzWyBpIF0uc2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJywgaGVhZGVyQ2VsbEVsLnRleHRDb250ZW50KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3BvbnNpdmVUYWJsZTtcbiIsIid1c2Ugc3RyaWN0JztcbmxldCBicmVha3BvaW50cyA9IHtcbiAgJ3hzJzogMCxcbiAgJ3NtJzogNTc2LFxuICAnbWQnOiA3NjgsXG4gICdsZyc6IDk5MixcbiAgJ3hsJzogMTIwMFxufTtcbmNsYXNzIFRhYm5hdiB7XG5cbiAgY29uc3RydWN0b3IgKHRhYm5hdikge1xuICAgIHRoaXMudGFibmF2ID0gdGFibmF2O1xuICAgIHRoaXMudGFicyA9IHRoaXMudGFibmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xuXG4gICAgLy8gaWYgbm8gaGFzaCBpcyBzZXQgb24gbG9hZCwgc2V0IGFjdGl2ZSB0YWJcbiAgICBpZiAoIXNldEFjdGl2ZUhhc2hUYWIoKSkge1xuICAgICAgLy8gc2V0IGZpcnN0IHRhYiBhcyBhY3RpdmVcbiAgICAgIGxldCB0YWIgPSB0aGlzLnRhYnNbIDAgXTtcblxuICAgICAgLy8gY2hlY2sgbm8gb3RoZXIgdGFicyBhcyBiZWVuIHNldCBhdCBkZWZhdWx0XG4gICAgICBsZXQgYWxyZWFkeUFjdGl2ZSA9IGdldEFjdGl2ZVRhYnModGhpcy50YWJuYXYpO1xuICAgICAgaWYgKGFscmVhZHlBY3RpdmUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRhYiA9IGFscmVhZHlBY3RpdmVbIDAgXTtcbiAgICAgIH1cblxuICAgICAgLy8gYWN0aXZhdGUgYW5kIGRlYWN0aXZhdGUgdGFic1xuICAgICAgYWN0aXZhdGVUYWIodGFiLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGV2ZW50bGlzdGVuZXJzIG9uIGJ1dHRvbnNcbiAgICBmb3IobGV0IHQgPSAwOyB0IDwgdGhpcy50YWJzLmxlbmd0aDsgdCArKyl7XG4gICAgICBhZGRMaXN0ZW5lcnModGhpcy50YWJzWyB0IF0pO1xuICAgIH1cbiAgfVxufVxuXG4vLyBGb3IgZWFzeSByZWZlcmVuY2VcbnZhciBrZXlzID0ge1xuICBlbmQ6IDM1LFxuICBob21lOiAzNixcbiAgbGVmdDogMzcsXG4gIHVwOiAzOCxcbiAgcmlnaHQ6IDM5LFxuICBkb3duOiA0MCxcbiAgZGVsZXRlOiA0NlxufTtcblxuLy8gQWRkIG9yIHN1YnN0cmFjdCBkZXBlbmRpbmcgb24ga2V5IHByZXNzZWRcbnZhciBkaXJlY3Rpb24gPSB7XG4gIDM3OiAtMSxcbiAgMzg6IC0xLFxuICAzOTogMSxcbiAgNDA6IDFcbn07XG5cblxuZnVuY3Rpb24gYWRkTGlzdGVuZXJzICh0YWIpIHtcbiAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tFdmVudExpc3RlbmVyKTtcbiAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duRXZlbnRMaXN0ZW5lcik7XG4gIHRhYi5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGtleXVwRXZlbnRMaXN0ZW5lcik7XG59XG5cbi8vIFdoZW4gYSB0YWIgaXMgY2xpY2tlZCwgYWN0aXZhdGVUYWIgaXMgZmlyZWQgdG8gYWN0aXZhdGUgaXRcbmZ1bmN0aW9uIGNsaWNrRXZlbnRMaXN0ZW5lciAoZXZlbnQpIHtcbiAgdmFyIHRhYiA9IHRoaXM7XG4gIGFjdGl2YXRlVGFiKHRhYiwgZmFsc2UpO1xufVxuXG5cbi8vIEhhbmRsZSBrZXlkb3duIG9uIHRhYnNcbmZ1bmN0aW9uIGtleWRvd25FdmVudExpc3RlbmVyIChldmVudCkge1xuICBsZXQga2V5ID0gZXZlbnQua2V5Q29kZTtcblxuICBzd2l0Y2ggKGtleSkge1xuICAgIGNhc2Uga2V5cy5lbmQ6XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgLy8gQWN0aXZhdGUgbGFzdCB0YWJcbiAgICAgIGZvY3VzTGFzdFRhYihldmVudC50YXJnZXQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBrZXlzLmhvbWU6XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgLy8gQWN0aXZhdGUgZmlyc3QgdGFiXG4gICAgICBmb2N1c0ZpcnN0VGFiKGV2ZW50LnRhcmdldCk7XG4gICAgICBicmVhaztcbiAgICAvLyBVcCBhbmQgZG93biBhcmUgaW4ga2V5ZG93blxuICAgIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBwcmV2ZW50IHBhZ2Ugc2Nyb2xsID46KVxuICAgIGNhc2Uga2V5cy51cDpcbiAgICBjYXNlIGtleXMuZG93bjpcbiAgICAgIGRldGVybWluZU9yaWVudGF0aW9uKGV2ZW50KTtcbiAgICAgIGJyZWFrO1xuICB9XG59XG5cbi8vIEhhbmRsZSBrZXl1cCBvbiB0YWJzXG5mdW5jdGlvbiBrZXl1cEV2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xuXG4gIHN3aXRjaCAoa2V5KSB7XG4gICAgY2FzZSBrZXlzLmxlZnQ6XG4gICAgY2FzZSBrZXlzLnJpZ2h0OlxuICAgICAgZGV0ZXJtaW5lT3JpZW50YXRpb24oZXZlbnQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBrZXlzLmRlbGV0ZTpcbiAgICAgIGJyZWFrO1xuICAgIGNhc2Uga2V5cy5lbnRlcjpcbiAgICBjYXNlIGtleXMuc3BhY2U6XG4gICAgICBhY3RpdmF0ZVRhYihldmVudC50YXJnZXQsIHRydWUpO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuXG5cbi8vIFdoZW4gYSB0YWJsaXN0IGFyaWEtb3JpZW50YXRpb24gaXMgc2V0IHRvIHZlcnRpY2FsLFxuLy8gb25seSB1cCBhbmQgZG93biBhcnJvdyBzaG91bGQgZnVuY3Rpb24uXG4vLyBJbiBhbGwgb3RoZXIgY2FzZXMgb25seSBsZWZ0IGFuZCByaWdodCBhcnJvdyBmdW5jdGlvbi5cbmZ1bmN0aW9uIGRldGVybWluZU9yaWVudGF0aW9uIChldmVudCkge1xuICBsZXQga2V5ID0gZXZlbnQua2V5Q29kZTtcblxuICBsZXQgdz13aW5kb3csXG4gICAgZD1kb2N1bWVudCxcbiAgICBlPWQuZG9jdW1lbnRFbGVtZW50LFxuICAgIGc9ZC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0sXG4gICAgeD13LmlubmVyV2lkdGh8fGUuY2xpZW50V2lkdGh8fGcuY2xpZW50V2lkdGgsXG4gICAgeT13LmlubmVySGVpZ2h0fHxlLmNsaWVudEhlaWdodHx8Zy5jbGllbnRIZWlnaHQ7XG5cbiAgbGV0IHZlcnRpY2FsID0geCA8IGJyZWFrcG9pbnRzLm1kO1xuICBsZXQgcHJvY2VlZCA9IGZhbHNlO1xuXG4gIGlmICh2ZXJ0aWNhbCkge1xuICAgIGlmIChrZXkgPT09IGtleXMudXAgfHwga2V5ID09PSBrZXlzLmRvd24pIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBwcm9jZWVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgaWYgKGtleSA9PT0ga2V5cy5sZWZ0IHx8IGtleSA9PT0ga2V5cy5yaWdodCkge1xuICAgICAgcHJvY2VlZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIGlmIChwcm9jZWVkKSB7XG4gICAgc3dpdGNoVGFiT25BcnJvd1ByZXNzKGV2ZW50KTtcbiAgfVxufVxuXG4vLyBFaXRoZXIgZm9jdXMgdGhlIG5leHQsIHByZXZpb3VzLCBmaXJzdCwgb3IgbGFzdCB0YWJcbi8vIGRlcGVuZGluZyBvbiBrZXkgcHJlc3NlZFxuZnVuY3Rpb24gc3dpdGNoVGFiT25BcnJvd1ByZXNzIChldmVudCkge1xuICB2YXIgcHJlc3NlZCA9IGV2ZW50LmtleUNvZGU7XG4gIGlmIChkaXJlY3Rpb25bIHByZXNzZWQgXSkge1xuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhcmdldCk7XG4gICAgbGV0IGluZGV4ID0gZ2V0SW5kZXhPZkVsZW1lbnRJbkxpc3QodGFyZ2V0LCB0YWJzKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBpZiAodGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdKSB7XG4gICAgICAgIHRhYnNbIGluZGV4ICsgZGlyZWN0aW9uWyBwcmVzc2VkIF0gXS5mb2N1cygpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAocHJlc3NlZCA9PT0ga2V5cy5sZWZ0IHx8IHByZXNzZWQgPT09IGtleXMudXApIHtcbiAgICAgICAgZm9jdXNMYXN0VGFiKHRhcmdldCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChwcmVzc2VkID09PSBrZXlzLnJpZ2h0IHx8IHByZXNzZWQgPT0ga2V5cy5kb3duKSB7XG4gICAgICAgIGZvY3VzRmlyc3RUYWIodGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgYWxsIGFjdGl2ZSB0YWJzIGluIGxpc3RcbiAqIEBwYXJhbSB0YWJuYXYgcGFyZW50IC50YWJuYXYgZWxlbWVudFxuICogQHJldHVybnMgcmV0dXJucyBsaXN0IG9mIGFjdGl2ZSB0YWJzIGlmIGFueVxuICovXG5mdW5jdGlvbiBnZXRBY3RpdmVUYWJzICh0YWJuYXYpIHtcbiAgcmV0dXJuIHRhYm5hdi5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24udGFibmF2LWl0ZW1bYXJpYS1zZWxlY3RlZD10cnVlXScpO1xufVxuXG4vKipcbiAqIEdldCBhIGxpc3Qgb2YgYWxsIGJ1dHRvbiB0YWJzIGluIGN1cnJlbnQgdGFibGlzdFxuICogQHBhcmFtIHRhYiBCdXR0b24gdGFiIGVsZW1lbnRcbiAqIEByZXR1cm5zIHsqfSByZXR1cm4gYXJyYXkgb2YgdGFic1xuICovXG5mdW5jdGlvbiBnZXRBbGxUYWJzSW5MaXN0ICh0YWIpIHtcbiAgbGV0IHBhcmVudE5vZGUgPSB0YWIucGFyZW50Tm9kZTtcbiAgaWYgKHBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWJuYXYnKSkge1xuICAgIHJldHVybiBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xuICB9XG4gIHJldHVybiBbXTtcbn1cblxuZnVuY3Rpb24gZ2V0SW5kZXhPZkVsZW1lbnRJbkxpc3QgKGVsZW1lbnQsIGxpc3Qpe1xuICBsZXQgaW5kZXggPSAtMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrICl7XG4gICAgaWYobGlzdFsgaSBdID09PSBlbGVtZW50KXtcbiAgICAgIGluZGV4ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpbmRleDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlcmUgaXMgYSB0YWIgaGFzaCBpbiB0aGUgdXJsIGFuZCBhY3RpdmF0ZXMgdGhlIHRhYiBhY2NvcmRpbmdseVxuICogQHJldHVybnMge2Jvb2xlYW59IHJldHVybnMgdHJ1ZSBpZiB0YWIgaGFzIGJlZW4gc2V0IC0gcmV0dXJucyBmYWxzZSBpZiBubyB0YWIgaGFzIGJlZW4gc2V0IHRvIGFjdGl2ZVxuICovXG5mdW5jdGlvbiBzZXRBY3RpdmVIYXNoVGFiICgpIHtcbiAgbGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XG4gIGlmIChoYXNoICE9PSAnJykge1xuICAgIGxldCB0YWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24udGFibmF2LWl0ZW1bYXJpYS1jb250cm9scz1cIiMnICsgaGFzaCArICdcIl0nKTtcbiAgICBpZiAodGFiICE9PSBudWxsKSB7XG4gICAgICBhY3RpdmF0ZVRhYih0YWIsIGZhbHNlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKipcbiAqIEFjdGl2YXRlL3Nob3cgdGFiIGFuZCBoaWRlIG90aGVyc1xuICogQHBhcmFtIHRhYiBidXR0b24gZWxlbWVudFxuICovXG5mdW5jdGlvbiBhY3RpdmF0ZVRhYiAodGFiLCBzZXRGb2N1cykge1xuICBkZWFjdGl2YXRlQWxsVGFic0V4Y2VwdCh0YWIpO1xuXG4gIGxldCB0YWJwYW5lbElEID0gdGFiLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xuICBsZXQgdGFicGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YWJwYW5lbElEKTtcblxuICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcbiAgdGFicGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICB0YWIucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xuXG4gIC8vIFNldCBmb2N1cyB3aGVuIHJlcXVpcmVkXG4gIGlmIChzZXRGb2N1cykge1xuICAgIHRhYi5mb2N1cygpO1xuICB9XG5cbiAgb3V0cHV0RXZlbnQodGFiLCAnZmRzLnRhYm5hdi5jaGFuZ2VkJyk7XG4gIG91dHB1dEV2ZW50KHRhYi5wYXJlbnROb2RlLCAnZmRzLnRhYm5hdi5vcGVuJyk7XG59XG5cbi8qKlxuICogRGVhY3RpdmF0ZSBhbGwgdGFicyBpbiBsaXN0IGV4Y2VwdCB0aGUgb25lIHBhc3NlZFxuICogQHBhcmFtIGFjdGl2ZVRhYiBidXR0b24gdGFiIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gZGVhY3RpdmF0ZUFsbFRhYnNFeGNlcHQgKGFjdGl2ZVRhYikge1xuICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QoYWN0aXZlVGFiKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgdGFiID0gdGFic1sgaSBdO1xuICAgIGlmICh0YWIgPT09IGFjdGl2ZVRhYikge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHRhYi5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnKSB7XG4gICAgICBvdXRwdXRFdmVudCh0YWIsICdmZHMudGFibmF2LmNsb3NlJyk7XG4gICAgfVxuXG4gICAgdGFiLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFiLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgfVxufVxuXG4vKipcbiAqIG91dHB1dCBhbiBldmVudCBvbiB0aGUgcGFzc2VkIGVsZW1lbnRcbiAqIEBwYXJhbSBlbGVtZW50XG4gKiBAcGFyYW0gZXZlbnROYW1lXG4gKi9cbmZ1bmN0aW9uIG91dHB1dEV2ZW50IChlbGVtZW50LCBldmVudE5hbWUpIHtcbiAgbGV0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gIGV2ZW50LmluaXRFdmVudChldmVudE5hbWUsIHRydWUsIHRydWUpO1xuICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuXG4vLyBNYWtlIGEgZ3Vlc3NcbmZ1bmN0aW9uIGZvY3VzRmlyc3RUYWIgKHRhYikge1xuICBnZXRBbGxUYWJzSW5MaXN0KHRhYilbIDAgXS5mb2N1cygpO1xufVxuXG4vLyBNYWtlIGEgZ3Vlc3NcbmZ1bmN0aW9uIGZvY3VzTGFzdFRhYiAodGFiKSB7XG4gIGxldCB0YWJzID0gZ2V0QWxsVGFic0luTGlzdCh0YWIpO1xuICB0YWJzWyB0YWJzLmxlbmd0aCAtIDEgXS5mb2N1cygpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gVGFibmF2O1xuIiwiY2xhc3MgVG9vbHRpcHtcbiAgY29uc3RydWN0b3IoZWxlbWVudCl7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLnNldEV2ZW50cygpO1xuICB9XG5cbiAgc2V0RXZlbnRzICgpe1xuICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICBpZih0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtdHJpZ2dlcicpICE9PSAnY2xpY2snKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBlLnRhcmdldDtcblxuICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSAhPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdmFyIHBvcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcblxuICAgICAgICB2YXIgdG9vbHRpcCA9IHRoYXQuY3JlYXRlVG9vbHRpcChlbGVtZW50LCBwb3MpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XG5cbiAgICAgICAgdGhhdC5wb3NpdGlvbkF0KGVsZW1lbnQsIHRvb2x0aXAsIHBvcyk7XG5cbiAgICAgIH0pO1xuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBlLnRhcmdldDtcblxuICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSAhPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdmFyIHBvcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcblxuICAgICAgICB2YXIgdG9vbHRpcCA9IHRoYXQuY3JlYXRlVG9vbHRpcChlbGVtZW50LCBwb3MpO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XG5cbiAgICAgICAgdGhhdC5wb3NpdGlvbkF0KGVsZW1lbnQsIHRvb2x0aXAsIHBvcyk7XG5cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB0b29sdGlwID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgICAgaWYodG9vbHRpcCAhPT0gbnVsbCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSAhPT0gbnVsbCl7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHRvb2x0aXAgPSB0aGlzLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgICBpZih0b29sdGlwICE9PSBudWxsICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApICE9PSBudWxsKXtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcztcbiAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JykgPT09IG51bGwpIHtcbiAgICAgICAgICB2YXIgcG9zID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC1wb3NpdGlvbicpIHx8ICd0b3AnO1xuICAgICAgICAgIHZhciB0b29sdGlwID0gdGhhdC5jcmVhdGVUb29sdGlwKGVsZW1lbnQsIHBvcyk7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b29sdGlwKTtcbiAgICAgICAgICB0aGF0LnBvc2l0aW9uQXQoZWxlbWVudCwgdG9vbHRpcCwgcG9zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgcG9wcGVyID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHBlcikpO1xuICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmICghZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnanMtdG9vbHRpcCcpKSB7XG4gICAgICAgIHRoYXQuY2xvc2VBbGwoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9XG5cbiAgY2xvc2VBbGwgKCl7XG4gICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRvb2x0aXBbYXJpYS1kZXNjcmliZWRieV0nKTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwb3BwZXIgPSBlbGVtZW50c1sgaSBdLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgZWxlbWVudHNbIGkgXS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocG9wcGVyKSk7XG4gICAgfVxuICB9XG4gIGNyZWF0ZVRvb2x0aXAgKGVsZW1lbnQsIHBvcykge1xuICAgIHZhciB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdG9vbHRpcC5jbGFzc05hbWUgPSAndG9vbHRpcC1wb3BwZXInO1xuICAgIHZhciBwb3BwZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1wb3BwZXInKTtcbiAgICB2YXIgaWQgPSAndG9vbHRpcC0nK3BvcHBlcnMubGVuZ3RoKzE7XG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Rvb2x0aXAnKTtcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnLCBwb3MpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgaWQpO1xuXG4gICAgdmFyIHRvb2x0aXBJbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRvb2x0aXBJbm5lci5jbGFzc05hbWUgPSAndG9vbHRpcCc7XG5cbiAgICB2YXIgdG9vbHRpcENvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0b29sdGlwQ29udGVudC5jbGFzc05hbWUgPSAndG9vbHRpcC1jb250ZW50JztcbiAgICB0b29sdGlwQ29udGVudC5pbm5lckhUTUwgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwJyk7XG4gICAgdG9vbHRpcElubmVyLmFwcGVuZENoaWxkKHRvb2x0aXBDb250ZW50KTtcbiAgICB0b29sdGlwLmFwcGVuZENoaWxkKHRvb2x0aXBJbm5lcik7XG5cbiAgICByZXR1cm4gdG9vbHRpcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQb3NpdGlvbnMgdGhlIHRvb2x0aXAuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJlbnQgLSBUaGUgdHJpZ2dlciBvZiB0aGUgdG9vbHRpcC5cbiAgICogQHBhcmFtIHtvYmplY3R9IHRvb2x0aXAgLSBUaGUgdG9vbHRpcCBpdHNlbGYuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwb3NIb3Jpem9udGFsIC0gRGVzaXJlZCBob3Jpem9udGFsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKGxlZnQvY2VudGVyL3JpZ2h0KVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcG9zVmVydGljYWwgLSBEZXNpcmVkIHZlcnRpY2FsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKHRvcC9jZW50ZXIvYm90dG9tKVxuICAgKlxuICAgKi9cbiAgcG9zaXRpb25BdCAocGFyZW50LCB0b29sdGlwLCBwb3MpIHtcbiAgICB2YXIgcGFyZW50Q29vcmRzID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBsZWZ0LCB0b3A7XG4gICAgdmFyIHRvb2x0aXBXaWR0aCA9IHRvb2x0aXAub2Zmc2V0V2lkdGg7XG5cbiAgICB2YXIgZGlzdCA9IDg7XG5cbiAgICBsZWZ0ID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLmxlZnQpICsgKChwYXJlbnQub2Zmc2V0V2lkdGggLSB0b29sdGlwLm9mZnNldFdpZHRoKSAvIDIpO1xuXG4gICAgc3dpdGNoIChwb3MpIHtcbiAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5ib3R0b20pICsgZGlzdDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICBjYXNlICd0b3AnOlxuICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMudG9wKSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gZGlzdDtcbiAgICB9XG5cbiAgICBpZihsZWZ0IDwgMCkge1xuICAgICAgbGVmdCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5sZWZ0KTtcbiAgICB9XG5cbiAgICBpZigodG9wICsgdG9vbHRpcC5vZmZzZXRIZWlnaHQpID49IHdpbmRvdy5pbm5lckhlaWdodCl7XG4gICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMudG9wKSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gZGlzdDtcbiAgICB9XG5cblxuICAgIHRvcCAgPSAodG9wIDwgMCkgPyBwYXJzZUludChwYXJlbnRDb29yZHMuYm90dG9tKSArIGRpc3QgOiB0b3A7XG4gICAgaWYod2luZG93LmlubmVyV2lkdGggPCAobGVmdCArIHRvb2x0aXBXaWR0aCkpe1xuICAgICAgdG9vbHRpcC5zdHlsZS5yaWdodCA9IGRpc3QgKyAncHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b29sdGlwLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICB9XG4gICAgdG9vbHRpcC5zdHlsZS50b3AgID0gdG9wICsgcGFnZVlPZmZzZXQgKyAncHgnO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVG9vbHRpcDtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IENvbGxhcHNlID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2NvbGxhcHNlJyk7XG5jb25zdCBSYWRpb1RvZ2dsZUdyb3VwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50Jyk7XG5jb25zdCBDaGVja2JveFRvZ2dsZUNvbnRlbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnKTtcbmNvbnN0IERyb3Bkb3duID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Ryb3Bkb3duJyk7XG5jb25zdCBBY2NvcmRpb24gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYWNjb3JkaW9uJyk7XG5jb25zdCBSZXNwb25zaXZlVGFibGUgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdGFibGUnKTtcbmNvbnN0IFRhYm5hdiA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy90YWJuYXYnKTtcbi8vY29uc3QgRGV0YWlscyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kZXRhaWxzJyk7XG5jb25zdCBUb29sdGlwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3Rvb2x0aXAnKTtcbmNvbnN0IFNldFRhYkluZGV4ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3NraXBuYXYnKTtcbmNvbnN0IE5hdmlnYXRpb24gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvbmF2aWdhdGlvbicpO1xuY29uc3QgSW5wdXRSZWdleE1hc2sgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzaycpO1xuaW1wb3J0IERldGFpbHMgZnJvbSAnLi9jb21wb25lbnRzL2RldGFpbHMnXG5pbXBvcnQgTW9kYWwgZnJvbSAnLi9jb21wb25lbnRzL21vZGFsJ1xuLyoqXG4gKiBUaGUgJ3BvbHlmaWxscycgZGVmaW5lIGtleSBFQ01BU2NyaXB0IDUgbWV0aG9kcyB0aGF0IG1heSBiZSBtaXNzaW5nIGZyb21cbiAqIG9sZGVyIGJyb3dzZXJzLCBzbyBtdXN0IGJlIGxvYWRlZCBmaXJzdC5cbiAqL1xucmVxdWlyZSgnLi9wb2x5ZmlsbHMnKTtcblxudmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgbmV3IE5hdmlnYXRpb24oKTtcblxuICB2YXIgbW9kYWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZkcy1tb2RhbCcpO1xuICBmb3IobGV0IGQgPSAwOyBkIDwgbW9kYWxzLmxlbmd0aDsgZCsrKSB7XG4gICAgbmV3IE1vZGFsKG1vZGFsc1tkXSkuaW5pdCgpO1xuICB9XG5cbiAgY29uc3QgZGV0YWlscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1kZXRhaWxzJyk7XG4gIGZvcihsZXQgZCA9IDA7IGQgPCBkZXRhaWxzLmxlbmd0aDsgZCsrKXtcbiAgICBuZXcgRGV0YWlscyhkZXRhaWxzWyBkIF0pLmluaXQoKTtcbiAgfVxuXG4gIGNvbnN0IGpzU2VsZWN0b3JSZWdleCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W2RhdGEtaW5wdXQtcmVnZXhdJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yUmVnZXgubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBJbnB1dFJlZ2V4TWFzayhqc1NlbGVjdG9yUmVnZXhbIGMgXSk7XG4gIH1cbiAgY29uc3QganNTZWxlY3RvclRhYmluZGV4ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNraXBuYXZbaHJlZl49XCIjXCJdJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFiaW5kZXgubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBTZXRUYWJJbmRleChqc1NlbGVjdG9yVGFiaW5kZXhbIGMgXSk7XG4gIH1cbiAgY29uc3QganNTZWxlY3RvclRvb2x0aXAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy10b29sdGlwJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVG9vbHRpcC5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IFRvb2x0aXAoanNTZWxlY3RvclRvb2x0aXBbIGMgXSk7XG4gIH1cbiAgY29uc3QganNTZWxlY3RvclRhYm5hdiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhYm5hdicpO1xuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRhYm5hdi5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IFRhYm5hdihqc1NlbGVjdG9yVGFibmF2WyBjIF0pO1xuICB9XG5cbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FjY29yZGlvbicpO1xuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckFjY29yZGlvbi5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uWyBjIF0pO1xuICB9XG4gIGNvbnN0IGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tYm9yZGVyZWQ6bm90KC5hY2NvcmRpb24pJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQWNjb3JkaW9uQm9yZGVyZWQubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBBY2NvcmRpb24oanNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkWyBjIF0pO1xuICB9XG5cbiAgY29uc3QganNTZWxlY3RvclRhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgndGFibGU6bm90KC5kYXRhVGFibGUpJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibGUubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBSZXNwb25zaXZlVGFibGUoanNTZWxlY3RvclRhYmxlWyBjIF0pO1xuICB9XG5cbiAgY29uc3QganNTZWxlY3RvckNvbGxhcHNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtY29sbGFwc2UnKTtcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JDb2xsYXBzZS5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IENvbGxhcHNlKGpzU2VsZWN0b3JDb2xsYXBzZVsgYyBdKTtcbiAgfVxuXG4gIGNvbnN0IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtcmFkaW8tdG9nZ2xlLWdyb3VwJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yUmFkaW9Db2xsYXBzZS5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IFJhZGlvVG9nZ2xlR3JvdXAoanNTZWxlY3RvclJhZGlvQ29sbGFwc2VbIGMgXSk7XG4gIH1cblxuICBjb25zdCBqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWNoZWNrYm94LXRvZ2dsZS1jb250ZW50Jyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZS5sZW5ndGg7IGMrKyl7XG4gICAgbmV3IENoZWNrYm94VG9nZ2xlQ29udGVudChqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZVsgYyBdKTtcbiAgfVxuXG4gIGNvbnN0IGpzU2VsZWN0b3JEcm9wZG93biA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWRyb3Bkb3duJyk7XG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yRHJvcGRvd24ubGVuZ3RoOyBjKyspe1xuICAgIG5ldyBEcm9wZG93bihqc1NlbGVjdG9yRHJvcGRvd25bIGMgXSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0geyBpbml0LCBDb2xsYXBzZSwgUmFkaW9Ub2dnbGVHcm91cCwgQ2hlY2tib3hUb2dnbGVDb250ZW50LCBEcm9wZG93biwgUmVzcG9uc2l2ZVRhYmxlLCBBY2NvcmRpb24sIFRhYm5hdiwgVG9vbHRpcCwgU2V0VGFiSW5kZXgsIE5hdmlnYXRpb24sIElucHV0UmVnZXhNYXNrLCBNb2RhbCB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBlbHByb3RvID0gd2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZTtcclxuY29uc3QgSElEREVOID0gJ2hpZGRlbic7XHJcblxyXG5pZiAoIShISURERU4gaW4gZWxwcm90bykpIHtcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxwcm90bywgSElEREVOLCB7XHJcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEhJRERFTik7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoSElEREVOLCAnJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NMaXN0IGFuZCBET01Ub2tlbkxpc3RcclxucmVxdWlyZSgnY2xhc3NsaXN0LXBvbHlmaWxsJyk7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZGVuXHJcbnJlcXVpcmUoJy4vZWxlbWVudC1oaWRkZW4nKTtcclxuXHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vb2JqZWN0L2Fzc2lnbicpO1xyXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL2FycmF5L2Zyb20nKTsiLCIndXNlIHN0cmljdCc7XG5sZXQgYnJlYWtwb2ludHMgPSB7XG4gICd4cyc6IDAsXG4gICdzbSc6IDU3NixcbiAgJ21kJzogNzY4LFxuICAnbGcnOiA5OTIsXG4gICd4bCc6IDEyMDBcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYnJlYWtwb2ludHM7XG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQG5hbWUgY2xvc2VzdFxyXG4gKiBAZGVzYyBnZXQgbmVhcmVzdCBwYXJlbnQgZWxlbWVudCBtYXRjaGluZyBzZWxlY3Rvci5cclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgSFRNTCBlbGVtZW50IHdoZXJlIHRoZSBzZWFyY2ggc3RhcnRzLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBTZWxlY3RvciB0byBiZSBmb3VuZC5cclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9IC0gTmVhcmVzdCBwYXJlbnQgZWxlbWVudCBtYXRjaGluZyBzZWxlY3Rvci5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xvc2VzdCAoZWwsIHNlbGVjdG9yKSB7XHJcbiAgdmFyIG1hdGNoZXNTZWxlY3RvciA9IGVsLm1hdGNoZXMgfHwgZWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGVsLm1vek1hdGNoZXNTZWxlY3RvciB8fCBlbC5tc01hdGNoZXNTZWxlY3RvcjtcclxuXHJcbiAgd2hpbGUgKGVsKSB7XHJcbiAgICAgIGlmIChtYXRjaGVzU2VsZWN0b3IuY2FsbChlbCwgc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgfVxyXG4gIHJldHVybiBlbDtcclxufTtcclxuIiwiLy8gVXNlZCB0byBnZW5lcmF0ZSBhIHVuaXF1ZSBzdHJpbmcsIGFsbG93cyBtdWx0aXBsZSBpbnN0YW5jZXMgb2YgdGhlIGNvbXBvbmVudCB3aXRob3V0XG4vLyBUaGVtIGNvbmZsaWN0aW5nIHdpdGggZWFjaCBvdGhlci5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODA5NDcyXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVVbmlxdWVJRCAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgaWYgKHR5cGVvZiB3aW5kb3cucGVyZm9ybWFuY2UgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cucGVyZm9ybWFuY2Uubm93ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZCArPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgLy8gdXNlIGhpZ2gtcHJlY2lzaW9uIHRpbWVyIGlmIGF2YWlsYWJsZVxuICB9XG4gIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDBcbiAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpXG4gICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDMgfCAweDgpKS50b1N0cmluZygxNilcbiAgfSlcbn1cbiIsIi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTU3NDMzXHJcbmZ1bmN0aW9uIGlzRWxlbWVudEluVmlld3BvcnQgKGVsLCB3aW49d2luZG93LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2NFbD1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuICB2YXIgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgcmVjdC50b3AgPj0gMCAmJlxyXG4gICAgcmVjdC5sZWZ0ID49IDAgJiZcclxuICAgIHJlY3QuYm90dG9tIDw9ICh3aW4uaW5uZXJIZWlnaHQgfHwgZG9jRWwuY2xpZW50SGVpZ2h0KSAmJlxyXG4gICAgcmVjdC5yaWdodCA8PSAod2luLmlubmVyV2lkdGggfHwgZG9jRWwuY2xpZW50V2lkdGgpXHJcbiAgKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpc0VsZW1lbnRJblZpZXdwb3J0O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQG5hbWUgaXNFbGVtZW50XHJcbiAqIEBkZXNjIHJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgRE9NIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxyXG4gKiBAcmV0dXJuIHtib29sZWFufVxyXG4gKi9cclxuY29uc3QgaXNFbGVtZW50ID0gdmFsdWUgPT4ge1xyXG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLm5vZGVUeXBlID09PSAxO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIHNlbGVjdFxyXG4gKiBAZGVzYyBzZWxlY3RzIGVsZW1lbnRzIGZyb20gdGhlIERPTSBieSBjbGFzcyBzZWxlY3RvciBvciBJRCBzZWxlY3Rvci5cclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gVGhlIHNlbGVjdG9yIHRvIHRyYXZlcnNlIHRoZSBET00gd2l0aC5cclxuICogQHBhcmFtIHtEb2N1bWVudHxIVE1MRWxlbWVudD99IGNvbnRleHQgLSBUaGUgY29udGV4dCB0byB0cmF2ZXJzZSB0aGUgRE9NXHJcbiAqICAgaW4uIElmIG5vdCBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gdGhlIGRvY3VtZW50LlxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudFtdfSAtIEFuIGFycmF5IG9mIERPTSBub2RlcyBvciBhbiBlbXB0eSBhcnJheS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2VsZWN0IChzZWxlY3RvciwgY29udGV4dCkge1xyXG5cclxuICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFjb250ZXh0IHx8ICFpc0VsZW1lbnQoY29udGV4dCkpIHtcclxuICAgIGNvbnRleHQgPSB3aW5kb3cuZG9jdW1lbnQ7XHJcbiAgfVxyXG5cclxuICBjb25zdCBzZWxlY3Rpb24gPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChzZWxlY3Rpb24pO1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcbmNvbnN0IENPTlRST0xTID0gJ2FyaWEtY29udHJvbHMnO1xuY29uc3QgSElEREVOID0gJ2FyaWEtaGlkZGVuJztcblxubW9kdWxlLmV4cG9ydHMgPSAoYnV0dG9uLCBleHBhbmRlZCkgPT4ge1xuXG4gIGlmICh0eXBlb2YgZXhwYW5kZWQgIT09ICdib29sZWFuJykge1xuICAgIGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICdmYWxzZSc7XG4gIH1cbiAgYnV0dG9uLnNldEF0dHJpYnV0ZShFWFBBTkRFRCwgZXhwYW5kZWQpO1xuICBjb25zdCBpZCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoQ09OVFJPTFMpO1xuICBjb25zdCBjb250cm9scyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgaWYgKCFjb250cm9scykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdObyB0b2dnbGUgdGFyZ2V0IGZvdW5kIHdpdGggaWQ6IFwiJyArIGlkICsgJ1wiJ1xuICAgICk7XG4gIH1cblxuICBjb250cm9scy5zZXRBdHRyaWJ1dGUoSElEREVOLCAhZXhwYW5kZWQpO1xuICByZXR1cm4gZXhwYW5kZWQ7XG59O1xuIl19
