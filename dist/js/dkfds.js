(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

/**
 * Array#filter.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Object=} self
 * @return {Array}
 * @throw TypeError
 */

module.exports = function (arr, fn, self) {
  if (arr.filter) return arr.filter(fn, self);
  if (void 0 === arr || null === arr) throw new TypeError();
  if ('function' != typeof fn) throw new TypeError();
  var ret = [];
  for (var i = 0; i < arr.length; i++) {
    if (!hasOwn.call(arr, i)) continue;
    var val = arr[i];
    if (fn.call(self, val, i, arr)) ret.push(val);
  }
  return ret;
};

var hasOwn = Object.prototype.hasOwnProperty;

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/_core":11,"../../modules/es6.array.from":58,"../../modules/es6.string.iterator":60}],5:[function(require,module,exports){
'use strict';

require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/_core":11,"../../modules/es6.object.assign":59}],6:[function(require,module,exports){
'use strict';

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],7:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":27}],8:[function(require,module,exports){
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

},{"./_to-absolute-index":49,"./_to-iobject":51,"./_to-length":52}],9:[function(require,module,exports){
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

},{"./_cof":10,"./_wks":56}],10:[function(require,module,exports){
"use strict";

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],11:[function(require,module,exports){
'use strict';

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],12:[function(require,module,exports){
'use strict';

var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
};

},{"./_object-dp":36,"./_property-desc":43}],13:[function(require,module,exports){
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

},{"./_a-function":6}],14:[function(require,module,exports){
"use strict";

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],15:[function(require,module,exports){
'use strict';

// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_fails":19}],16:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":20,"./_is-object":27}],17:[function(require,module,exports){
'use strict';

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

},{}],18:[function(require,module,exports){
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

},{"./_core":11,"./_ctx":13,"./_global":20,"./_hide":22,"./_redefine":44}],19:[function(require,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],20:[function(require,module,exports){
'use strict';

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
// eslint-disable-next-line no-new-func
: Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],21:[function(require,module,exports){
"use strict";

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],22:[function(require,module,exports){
'use strict';

var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":15,"./_object-dp":36,"./_property-desc":43}],23:[function(require,module,exports){
'use strict';

var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":20}],24:[function(require,module,exports){
'use strict';

module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_descriptors":15,"./_dom-create":16,"./_fails":19}],25:[function(require,module,exports){
'use strict';

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":10}],26:[function(require,module,exports){
'use strict';

// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":32,"./_wks":56}],27:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
};

},{}],28:[function(require,module,exports){
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

},{"./_an-object":7}],29:[function(require,module,exports){
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

},{"./_hide":22,"./_object-create":35,"./_property-desc":43,"./_set-to-string-tag":45,"./_wks":56}],30:[function(require,module,exports){
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

},{"./_export":18,"./_hide":22,"./_iter-create":29,"./_iterators":32,"./_library":33,"./_object-gpo":39,"./_redefine":44,"./_set-to-string-tag":45,"./_wks":56}],31:[function(require,module,exports){
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

},{"./_wks":56}],32:[function(require,module,exports){
"use strict";

module.exports = {};

},{}],33:[function(require,module,exports){
"use strict";

module.exports = false;

},{}],34:[function(require,module,exports){
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

},{"./_fails":19,"./_iobject":25,"./_object-gops":38,"./_object-keys":41,"./_object-pie":42,"./_to-object":53}],35:[function(require,module,exports){
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

},{"./_an-object":7,"./_dom-create":16,"./_enum-bug-keys":17,"./_html":23,"./_object-dps":37,"./_shared-key":46}],36:[function(require,module,exports){
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

},{"./_an-object":7,"./_descriptors":15,"./_ie8-dom-define":24,"./_to-primitive":54}],37:[function(require,module,exports){
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

},{"./_an-object":7,"./_descriptors":15,"./_object-dp":36,"./_object-keys":41}],38:[function(require,module,exports){
"use strict";

exports.f = Object.getOwnPropertySymbols;

},{}],39:[function(require,module,exports){
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

},{"./_has":21,"./_shared-key":46,"./_to-object":53}],40:[function(require,module,exports){
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

},{"./_array-includes":8,"./_has":21,"./_shared-key":46,"./_to-iobject":51}],41:[function(require,module,exports){
'use strict';

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":17,"./_object-keys-internal":40}],42:[function(require,module,exports){
"use strict";

exports.f = {}.propertyIsEnumerable;

},{}],43:[function(require,module,exports){
"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],44:[function(require,module,exports){
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

},{"./_core":11,"./_global":20,"./_has":21,"./_hide":22,"./_uid":55}],45:[function(require,module,exports){
'use strict';

var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":21,"./_object-dp":36,"./_wks":56}],46:[function(require,module,exports){
'use strict';

var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":47,"./_uid":55}],47:[function(require,module,exports){
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

},{"./_core":11,"./_global":20,"./_library":33}],48:[function(require,module,exports){
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

},{"./_defined":14,"./_to-integer":50}],49:[function(require,module,exports){
'use strict';

var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":50}],50:[function(require,module,exports){
"use strict";

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],51:[function(require,module,exports){
'use strict';

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":14,"./_iobject":25}],52:[function(require,module,exports){
'use strict';

// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":50}],53:[function(require,module,exports){
'use strict';

// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":14}],54:[function(require,module,exports){
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

},{"./_is-object":27}],55:[function(require,module,exports){
'use strict';

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],56:[function(require,module,exports){
'use strict';

var store = require('./_shared')('wks');
var uid = require('./_uid');
var _Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof _Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":20,"./_shared":47,"./_uid":55}],57:[function(require,module,exports){
'use strict';

var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

},{"./_classof":9,"./_core":11,"./_iterators":32,"./_wks":56}],58:[function(require,module,exports){
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

},{"./_create-property":12,"./_ctx":13,"./_export":18,"./_is-array-iter":26,"./_iter-call":28,"./_iter-detect":31,"./_to-length":52,"./_to-object":53,"./core.get-iterator-method":57}],59:[function(require,module,exports){
'use strict';

// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":18,"./_object-assign":34}],60:[function(require,module,exports){
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

},{"./_iter-define":30,"./_string-at":48}],61:[function(require,module,exports){
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

},{}],62:[function(require,module,exports){
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

},{}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
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

},{"../delegate":67,"../delegateAll":66,"object-assign":63}],65:[function(require,module,exports){
"use strict";

module.exports = function compose(functions) {
  return function (e) {
    return functions.some(function (fn) {
      return fn.call(this, e) === false;
    }, this);
  };
};

},{}],66:[function(require,module,exports){
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

},{"../compose":65,"../delegate":67}],67:[function(require,module,exports){
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

},{"element-closest":62}],68:[function(require,module,exports){
"use strict";

module.exports = function once(listener, options) {
  var wrapped = function wrappedOnce(e) {
    e.currentTarget.removeEventListener(e.type, wrapped, options);
    return listener.call(this, e);
  };
  return wrapped;
};

},{}],69:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var behavior = require('../utils/behavior');
var filter = require('array-filter');
var forEach = require('array-foreach');
var toggle = require('../utils/toggle');
var isElementInViewport = require('../utils/is-in-viewport');

var CLICK = require('../events').CLICK;
var PREFIX = require('../config').prefix;

// XXX match .accordion and .accordion-bordered
var ACCORDION = '.' + PREFIX + 'accordion, .' + PREFIX + 'accordion-bordered';
var BUTTON = '.' + PREFIX + 'accordion-button[aria-controls]';
var EXPANDED = 'aria-expanded';
var MULTISELECTABLE = 'aria-multiselectable';

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
  var accordion = button.closest(ACCORDION);
  if (!accordion) {
    throw new Error(BUTTON + ' is missing outer ' + ACCORDION);
  }

  expanded = toggle(button, expanded);
  // XXX multiselectable is opt-in, to preserve legacy behavior
  var multiselectable = accordion.getAttribute(MULTISELECTABLE) === 'true';

  if (expanded && !multiselectable) {
    forEach(getAccordionButtons(accordion), function (other) {
      if (other !== button) {
        toggle(other, false);
      }
    });
  }
};

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} true
 */
var showButton = function showButton(button) {
  return toggleButton(button, true);
};

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} false
 */
var hideButton = function hideButton(button) {
  return toggleButton(button, false);
};

/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param {HTMLElement} accordion
 * @return {array<HTMLButtonElement>}
 */
var getAccordionButtons = function getAccordionButtons(accordion) {
  return filter(accordion.querySelectorAll(BUTTON), function (button) {
    return button.closest(ACCORDION) === accordion;
  });
};

var accordion = behavior(_defineProperty({}, CLICK, _defineProperty({}, BUTTON, function (event) {
  event.preventDefault();
  toggleButton(this);

  if (this.getAttribute(EXPANDED) === 'true') {
    // We were just expanded, but if another accordion was also just
    // collapsed, we may no longer be in the viewport. This ensures
    // that we are still visible, so the user isn't confused.
    if (!isElementInViewport(this)) this.scrollIntoView();
  }
})), {
  init: function init(root) {
    forEach(root.querySelectorAll(BUTTON), function (button) {
      var expanded = button.getAttribute(EXPANDED) === 'true';
      toggleButton(button, expanded);
    });
  },
  ACCORDION: ACCORDION,
  BUTTON: BUTTON,
  show: showButton,
  hide: hideButton,
  toggle: toggleButton,
  getButtons: getAccordionButtons
});

/**
 * TODO: for 2.0, remove everything below this comment and export the
 * behavior directly:
 *
 * module.exports = behavior({...});
 */
var Accordion = function Accordion(root) {
  this.root = root;
  accordion.on(this.root);
};

// copy all of the behavior methods and props to Accordion
var assign = require('object-assign');
assign(Accordion, accordion);

Accordion.prototype.show = showButton;
Accordion.prototype.hide = hideButton;

Accordion.prototype.remove = function () {
  accordion.off(this.root);
};

module.exports = Accordion;

},{"../config":81,"../events":83,"../utils/behavior":86,"../utils/is-in-viewport":88,"../utils/toggle":90,"array-filter":1,"array-foreach":2,"object-assign":63}],70:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var behavior = require('../utils/behavior');
var select = require('../utils/select');
var closest = require('../utils/closest');
var forEach = require('array-foreach');

var checkboxToggleContent = function () {
    function checkboxToggleContent(el) {
        _classCallCheck(this, checkboxToggleContent);

        this.jsToggleTrigger = ".js-checkbox-toggle-content";
        this.jsToggleTarget = "data-js-target";

        this.targetEl = null;
        this.checkboxEl = null;

        this.init(el);
    }

    _createClass(checkboxToggleContent, [{
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
                var targetEl = select(targetAttr, 'body');
                if (targetEl !== null && targetEl !== undefined && targetEl.length > 0) {
                    if (triggerEl.checked) {
                        this.open(triggerEl, targetEl[0]);
                    } else {
                        this.close(triggerEl, targetEl[0]);
                    }
                }
            }
        }
    }, {
        key: 'open',
        value: function open(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute("aria-expanded", "true");
                targetEl.classList.remove("collapsed");
                targetEl.setAttribute("aria-hidden", "false");
            }
        }
    }, {
        key: 'close',
        value: function close(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute("aria-expanded", "false");
                targetEl.classList.add("collapsed");
                targetEl.setAttribute("aria-hidden", "true");
            }
        }
    }]);

    return checkboxToggleContent;
}();

module.exports = checkboxToggleContent;

},{"../utils/behavior":86,"../utils/closest":87,"../utils/select":89,"array-foreach":2}],71:[function(require,module,exports){
/**
 * Collapse/expand.
 */

'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var behavior = require('../utils/behavior');
var select = require('../utils/select');
var closest = require('../utils/closest');
var forEach = require('array-foreach');

var jsCollapseTrigger = ".js-collapse";
var jsCollapseTarget = "data-js-target";

var toggleCollapse = function toggleCollapse(triggerEl, forceClose) {
    if (triggerEl !== null && triggerEl !== undefined) {
        var targetAttr = triggerEl.getAttribute(jsCollapseTarget);
        if (targetAttr !== null && targetAttr !== undefined) {
            var targetEl = select(targetAttr, 'body');
            if (targetEl !== null && targetEl !== undefined && targetEl.length > 0) {
                //target found, check state
                targetEl = targetEl[0];
                //change state
                if (triggerEl.getAttribute("aria-expanded") == "true" || triggerEl.getAttribute("aria-expanded") == undefined || forceClose) {
                    //close
                    animateCollapse(targetEl, triggerEl);
                } else {
                    //open
                    animateExpand(targetEl, triggerEl);
                }
            }
        }
    }
};

var toggle = function toggle(event) {
    //event.preventDefault();
    var triggerElm = closest(event.target, jsCollapseTrigger);
    if (triggerElm !== null && triggerElm !== undefined) {
        toggleCollapse(triggerElm);
    }
};

var animateInProgress = false;

function animateCollapse(targetEl, triggerEl) {
    if (!animateInProgress) {
        animateInProgress = true;

        targetEl.style.height = targetEl.clientHeight + "px";
        targetEl.classList.add("collapse-transition-collapse");
        setTimeout(function () {
            targetEl.removeAttribute("style");
        }, 5);
        setTimeout(function () {
            targetEl.classList.add("collapsed");
            targetEl.classList.remove("collapse-transition-collapse");

            triggerEl.setAttribute("aria-expanded", "false");
            targetEl.setAttribute("aria-hidden", "true");
            animateInProgress = false;
        }, 200);
    }
}

function animateExpand(targetEl, triggerEl) {
    if (!animateInProgress) {
        animateInProgress = true;
        targetEl.classList.remove("collapsed");
        var expandedHeight = targetEl.clientHeight;
        targetEl.style.height = "0px";
        targetEl.classList.add("collapse-transition-expand");
        setTimeout(function () {
            targetEl.style.height = expandedHeight + "px";
        }, 5);

        setTimeout(function () {
            targetEl.classList.remove("collapse-transition-expand");
            targetEl.removeAttribute("style");

            targetEl.setAttribute("aria-hidden", "false");
            triggerEl.setAttribute("aria-expanded", "true");
            animateInProgress = false;
        }, 200);
    }
}

module.exports = behavior(_defineProperty({}, 'click', _defineProperty({}, jsCollapseTrigger, toggle)));

},{"../utils/behavior":86,"../utils/closest":87,"../utils/select":89,"array-foreach":2}],72:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var closest = require('../utils/closest');

var dropdown = function () {
  function dropdown(el) {
    _classCallCheck(this, dropdown);

    this.jsDropdownTrigger = '.js-dropdown';
    this.jsDropdownTarget = 'data-js-target';

    //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).
    this.navResponsiveBreakpoint = 992; //same as $nav-responsive-breakpoint from the scss.
    this.jsResponsiveCollapseModifier = '.js-dropdown--responsive-collapse';
    this.responsiveCollapseEnabled = false;

    this.triggerEl = null;
    this.targetEl = null;

    this.init(el);

    if (this.triggerEl !== null && this.triggerEl !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
      var that = this;

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

      var element = this.triggerEl;
      if (window.IntersectionObserver) {
        var observer = new IntersectionObserver(function (entries) {
          if (entries[0].intersectionRatio) {
            console.log('visible');
            if (element.getAttribute('aria-expanded') === 'false') {
              that.targetEl.setAttribute('aria-hidden', true);
            }
          } else {
            console.log('hidden');
            if (that.targetEl.getAttribute('aria-hidden') === 'true') {
              that.targetEl.setAttribute('aria-hidden', false);
            }
          }
        }, {
          root: document.body
        });
        observer.observe(element);
      }

      document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode === 27) {
          that.closeAll();
        }
      };
    }
  }

  _createClass(dropdown, [{
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
              triggerEl.setAttribute('aria-expanded', 'false');
              targetEl.classList.add('collapsed');
              targetEl.setAttribute('aria-hidden', 'true');
            }
          } else {
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
        if (this.triggerEl.getAttribute('aria-expanded') === 'true' || forceClose) {
          //close
          this.triggerEl.setAttribute('aria-expanded', 'false');
          this.targetEl.classList.add('collapsed');
          this.targetEl.setAttribute('aria-hidden', 'true');
        } else {
          this.closeAll();
          //open
          this.triggerEl.setAttribute('aria-expanded', 'true');
          this.targetEl.classList.remove('collapsed');
          this.targetEl.setAttribute('aria-hidden', 'false');
        }
      }
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
      if (this.responsiveCollapseEnabled && window.innerWidth <= this.navResponsiveBreakpoint) {
        return true;
      }
      return false;
    }
  }]);

  return dropdown;
}();

module.exports = dropdown;

},{"../utils/closest":87}],73:[function(require,module,exports){
'use strict';

module.exports = {
  accordion: require('./accordion'),
  navigation: require('./navigation'),
  skipnav: require('./skipnav'),
  regexmask: require('./regex-input-mask'),
  collapse: require('./collapse')
};

},{"./accordion":69,"./collapse":71,"./navigation":75,"./regex-input-mask":77,"./skipnav":78}],74:[function(require,module,exports){
"use strict";

var domready = require('domready');

/**
 * Import modal lib.
 * https://micromodal.now.sh
 */
var microModal = require("../../vendor/micromodal.js");
domready(function () {
  microModal.init(); //init all modals
});

},{"../../vendor/micromodal.js":91,"domready":61}],75:[function(require,module,exports){
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

},{"../config":81,"../events":83,"../utils/behavior":86,"../utils/select":89,"./accordion":69,"array-foreach":2,"object-assign":63}],76:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var behavior = require('../utils/behavior');
var select = require('../utils/select');
var closest = require('../utils/closest');
var forEach = require('array-foreach');

var radioToggleGroup = function () {
    function radioToggleGroup(el) {
        _classCallCheck(this, radioToggleGroup);

        this.jsToggleTrigger = ".js-radio-toggle-group";
        this.jsToggleTarget = "data-js-target";

        this.radioEls = null;
        this.targetEl = null;

        this.init(el);
    }

    _createClass(radioToggleGroup, [{
        key: 'init',
        value: function init(el) {
            var _this = this;

            this.radioGroup = el;
            this.radioEls = select("input[type='radio']", this.radioGroup);
            var that = this;

            forEach(this.radioEls, function (radio) {
                radio.addEventListener('change', function (event) {
                    forEach(that.radioEls, function (radio) {
                        that.toggle(radio);
                    });
                });

                _this.toggle(radio); //Initial value;
            });
        }
    }, {
        key: 'toggle',
        value: function toggle(triggerEl) {
            var targetAttr = triggerEl.getAttribute(this.jsToggleTarget);
            if (targetAttr !== null && targetAttr !== undefined) {
                var targetEl = select(targetAttr, 'body');
                if (targetEl !== null && targetEl !== undefined && targetEl.length > 0) {
                    if (triggerEl.checked) {
                        this.open(triggerEl, targetEl[0]);
                    } else {
                        this.close(triggerEl, targetEl[0]);
                    }
                }
            }
        }
    }, {
        key: 'open',
        value: function open(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute("aria-expanded", "true");
                targetEl.classList.remove("collapsed");
                targetEl.setAttribute("aria-hidden", "false");
            }
        }
    }, {
        key: 'close',
        value: function close(triggerEl, targetEl) {
            if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
                triggerEl.setAttribute("aria-expanded", "false");
                targetEl.classList.add("collapsed");
                targetEl.setAttribute("aria-hidden", "true");
            }
        }
    }]);

    return radioToggleGroup;
}();

module.exports = radioToggleGroup;

},{"../utils/behavior":86,"../utils/closest":87,"../utils/select":89,"array-foreach":2}],77:[function(require,module,exports){
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

},{"../utils/behavior":86}],78:[function(require,module,exports){
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

},{"../config":81,"../events":83,"../utils/behavior":86,"receptor/once":68}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var select = require('../utils/select');
var domready = require('domready');
var forEach = require('array-foreach');

domready(function () {
    new ResponsiveTables();
});

var ResponsiveTables = function () {
    function ResponsiveTables() {
        var _this = this;

        _classCallCheck(this, ResponsiveTables);

        var allTables = select('table:not(.dataTable)');
        forEach(allTables, function (table) {
            _this.insertHeaderAsAttributes(table);
        });
    }

    // Add data attributes needed for responsive mode.


    _createClass(ResponsiveTables, [{
        key: 'insertHeaderAsAttributes',
        value: function insertHeaderAsAttributes(tableEl) {
            if (!tableEl) return;

            var headerCellEls = select('thead th, thead td', tableEl);

            //const headerCellEls = select(el.querySelectorAll('thead th, thead td');

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
    }]);

    return ResponsiveTables;
}();

exports.default = ResponsiveTables;

},{"../utils/select":89,"array-foreach":2,"domready":61}],80:[function(require,module,exports){
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

},{"../../vendor/tippyjs/tippy.js":92,"../utils/select":89,"domready":61}],81:[function(require,module,exports){
'use strict';

module.exports = {
  prefix: ''
};

},{}],82:[function(require,module,exports){
'use strict';

var domready = require('domready');
var forEach = require('array-foreach');
var select = require('./utils/select');
var modal = require('./components/modal');
var table = require('./components/table');
var tooltip = require('./components/tooltip');
var dropdown = require('./components/dropdown');
var radioToggleContent = require('./components/radio-toggle-content');
var checkboxToggleContent = require('./components/checkbox-toggle-content');

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

  var jsSelectorDropdown = '.js-dropdown';
  forEach(select(jsSelectorDropdown), function (dropdownElement) {
    new dropdown(dropdownElement);
  });

  var jsRadioToggleGroup = '.js-radio-toggle-group';
  forEach(select(jsRadioToggleGroup), function (toggleElement) {
    new radioToggleContent(toggleElement);
  });

  var jsCheckboxToggleContent = '.js-checkbox-toggle-content';
  forEach(select(jsCheckboxToggleContent), function (toggleElement) {
    new checkboxToggleContent(toggleElement);
  });
});

module.exports = dkfds;

},{"./components":73,"./components/checkbox-toggle-content":70,"./components/dropdown":72,"./components/modal":74,"./components/radio-toggle-content":76,"./components/table":79,"./components/tooltip":80,"./config":81,"./polyfills":85,"./utils/select":89,"array-foreach":2,"domready":61}],83:[function(require,module,exports){
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

},{}],84:[function(require,module,exports){
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

},{}],85:[function(require,module,exports){
'use strict';
// polyfills HTMLElement.prototype.classList and DOMTokenList

require('classlist-polyfill');
// polyfills HTMLElement.prototype.hidden
require('./element-hidden');

require('core-js/fn/object/assign');
require('core-js/fn/array/from');

},{"./element-hidden":84,"classlist-polyfill":3,"core-js/fn/array/from":4,"core-js/fn/object/assign":5}],86:[function(require,module,exports){
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

},{"array-foreach":2,"object-assign":63,"receptor/behavior":64}],87:[function(require,module,exports){
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

},{}],88:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;

  var rect = el.getBoundingClientRect();

  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}

module.exports = isElementInViewport;

},{}],89:[function(require,module,exports){
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

},{}],90:[function(require,module,exports){
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

},{}],91:[function(require,module,exports){
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

},{}],92:[function(require,module,exports){
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

},{}]},{},[82])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZmlsdGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FycmF5LWZvcmVhY2gvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY2xhc3NsaXN0LXBvbHlmaWxsL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL2FycmF5L2Zyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9mbi9vYmplY3QvYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lvYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdwby5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1rZXlzLWludGVybmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtcGllLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2hhcmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tYWJzb2x1dGUtaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3VpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvZG9tcmVhZHkvcmVhZHkuanMiLCJub2RlX21vZHVsZXMvZWxlbWVudC1jbG9zZXN0L2VsZW1lbnQtY2xvc2VzdC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2JlaGF2aW9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2NvbXBvc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvZGVsZWdhdGVBbGwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvZGVsZWdhdGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3Ivb25jZS9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2NoZWNrYm94LXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY29sbGFwc2UuanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbW9kYWwuanMiLCJzcmMvanMvY29tcG9uZW50cy9uYXZpZ2F0aW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmFkaW8tdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9yZWdleC1pbnB1dC1tYXNrLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvc2tpcG5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYmxlLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9vbHRpcC5qcyIsInNyYy9qcy9jb25maWcuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvZXZlbnRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9lbGVtZW50LWhpZGRlbi5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvaW5kZXguanMiLCJzcmMvanMvdXRpbHMvYmVoYXZpb3IuanMiLCJzcmMvanMvdXRpbHMvY2xvc2VzdC5qcyIsInNyYy9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInNyYy9qcy91dGlscy9zZWxlY3QuanMiLCJzcmMvanMvdXRpbHMvdG9nZ2xlLmpzIiwic3JjL3ZlbmRvci9taWNyb21vZGFsLmpzIiwic3JjL3ZlbmRvci90aXBweWpzL3RpcHB5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTs7Ozs7Ozs7OztBQVVBLE9BQU8sT0FBUCxHQUFpQixVQUFVLEdBQVYsRUFBZSxFQUFmLEVBQW1CLElBQW5CLEVBQXlCO0FBQ3hDLE1BQUksSUFBSSxNQUFSLEVBQWdCLE9BQU8sSUFBSSxNQUFKLENBQVcsRUFBWCxFQUFlLElBQWYsQ0FBUDtBQUNoQixNQUFJLEtBQUssQ0FBTCxLQUFXLEdBQVgsSUFBa0IsU0FBUyxHQUEvQixFQUFvQyxNQUFNLElBQUksU0FBSixFQUFOO0FBQ3BDLE1BQUksY0FBYyxPQUFPLEVBQXpCLEVBQTZCLE1BQU0sSUFBSSxTQUFKLEVBQU47QUFDN0IsTUFBSSxNQUFNLEVBQVY7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksSUFBSSxNQUF4QixFQUFnQyxHQUFoQyxFQUFxQztBQUNuQyxRQUFJLENBQUMsT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixDQUFqQixDQUFMLEVBQTBCO0FBQzFCLFFBQUksTUFBTSxJQUFJLENBQUosQ0FBVjtBQUNBLFFBQUksR0FBRyxJQUFILENBQVEsSUFBUixFQUFjLEdBQWQsRUFBbUIsQ0FBbkIsRUFBc0IsR0FBdEIsQ0FBSixFQUFnQyxJQUFJLElBQUosQ0FBUyxHQUFUO0FBQ2pDO0FBQ0QsU0FBTyxHQUFQO0FBQ0QsQ0FYRDs7QUFhQSxJQUFJLFNBQVMsT0FBTyxTQUFQLENBQWlCLGNBQTlCOzs7QUN4QkE7Ozs7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QTdwSUEsQ0FBRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxuLyoqXG4gKiBBcnJheSNmaWx0ZXIuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtPYmplY3Q9fSBzZWxmXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEB0aHJvdyBUeXBlRXJyb3JcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcnIsIGZuLCBzZWxmKSB7XG4gIGlmIChhcnIuZmlsdGVyKSByZXR1cm4gYXJyLmZpbHRlcihmbiwgc2VsZik7XG4gIGlmICh2b2lkIDAgPT09IGFyciB8fCBudWxsID09PSBhcnIpIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gIGlmICgnZnVuY3Rpb24nICE9IHR5cGVvZiBmbikgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgdmFyIHJldCA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgIGlmICghaGFzT3duLmNhbGwoYXJyLCBpKSkgY29udGludWU7XG4gICAgdmFyIHZhbCA9IGFycltpXTtcbiAgICBpZiAoZm4uY2FsbChzZWxmLCB2YWwsIGksIGFycikpIHJldC5wdXNoKHZhbCk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuIiwiLyoqXG4gKiBhcnJheS1mb3JlYWNoXG4gKiAgIEFycmF5I2ZvckVhY2ggcG9ueWZpbGwgZm9yIG9sZGVyIGJyb3dzZXJzXG4gKiAgIChQb255ZmlsbDogQSBwb2x5ZmlsbCB0aGF0IGRvZXNuJ3Qgb3ZlcndyaXRlIHRoZSBuYXRpdmUgbWV0aG9kKVxuICogXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHdhZGEvYXJyYXktZm9yZWFjaFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNS0yMDE2IFRha3V0byBXYWRhXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoL2Jsb2IvbWFzdGVyL01JVC1MSUNFTlNFXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JFYWNoIChhcnksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgaWYgKGFyeS5mb3JFYWNoKSB7XG4gICAgICAgIGFyeS5mb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyeS5sZW5ndGg7IGkrPTEpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBhcnlbaV0sIGksIGFyeSk7XG4gICAgfVxufTtcbiIsIi8qXG4gKiBjbGFzc0xpc3QuanM6IENyb3NzLWJyb3dzZXIgZnVsbCBlbGVtZW50LmNsYXNzTGlzdCBpbXBsZW1lbnRhdGlvbi5cbiAqIDEuMS4yMDE3MDQyN1xuICpcbiAqIEJ5IEVsaSBHcmV5LCBodHRwOi8vZWxpZ3JleS5jb21cbiAqIExpY2Vuc2U6IERlZGljYXRlZCB0byB0aGUgcHVibGljIGRvbWFpbi5cbiAqICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4gKi9cblxuLypnbG9iYWwgc2VsZiwgZG9jdW1lbnQsIERPTUV4Y2VwdGlvbiAqL1xuXG4vKiEgQHNvdXJjZSBodHRwOi8vcHVybC5lbGlncmV5LmNvbS9naXRodWIvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL2NsYXNzTGlzdC5qcyAqL1xuXG5pZiAoXCJkb2N1bWVudFwiIGluIHdpbmRvdy5zZWxmKSB7XG5cbi8vIEZ1bGwgcG9seWZpbGwgZm9yIGJyb3dzZXJzIHdpdGggbm8gY2xhc3NMaXN0IHN1cHBvcnRcbi8vIEluY2x1ZGluZyBJRSA8IEVkZ2UgbWlzc2luZyBTVkdFbGVtZW50LmNsYXNzTGlzdFxuaWYgKCEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKSkgXG5cdHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJiAhKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIikpKSB7XG5cbihmdW5jdGlvbiAodmlldykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaWYgKCEoJ0VsZW1lbnQnIGluIHZpZXcpKSByZXR1cm47XG5cbnZhclxuXHQgIGNsYXNzTGlzdFByb3AgPSBcImNsYXNzTGlzdFwiXG5cdCwgcHJvdG9Qcm9wID0gXCJwcm90b3R5cGVcIlxuXHQsIGVsZW1DdHJQcm90byA9IHZpZXcuRWxlbWVudFtwcm90b1Byb3BdXG5cdCwgb2JqQ3RyID0gT2JqZWN0XG5cdCwgc3RyVHJpbSA9IFN0cmluZ1twcm90b1Byb3BdLnRyaW0gfHwgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpO1xuXHR9XG5cdCwgYXJySW5kZXhPZiA9IEFycmF5W3Byb3RvUHJvcF0uaW5kZXhPZiB8fCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdHZhclxuXHRcdFx0ICBpID0gMFxuXHRcdFx0LCBsZW4gPSB0aGlzLmxlbmd0aFxuXHRcdDtcblx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fVxuXHQvLyBWZW5kb3JzOiBwbGVhc2UgYWxsb3cgY29udGVudCBjb2RlIHRvIGluc3RhbnRpYXRlIERPTUV4Y2VwdGlvbnNcblx0LCBET01FeCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XG5cdFx0dGhpcy5uYW1lID0gdHlwZTtcblx0XHR0aGlzLmNvZGUgPSBET01FeGNlcHRpb25bdHlwZV07XG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0fVxuXHQsIGNoZWNrVG9rZW5BbmRHZXRJbmRleCA9IGZ1bmN0aW9uIChjbGFzc0xpc3QsIHRva2VuKSB7XG5cdFx0aWYgKHRva2VuID09PSBcIlwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdCAgXCJTWU5UQVhfRVJSXCJcblx0XHRcdFx0LCBcIkFuIGludmFsaWQgb3IgaWxsZWdhbCBzdHJpbmcgd2FzIHNwZWNpZmllZFwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRpZiAoL1xccy8udGVzdCh0b2tlbikpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIklOVkFMSURfQ0hBUkFDVEVSX0VSUlwiXG5cdFx0XHRcdCwgXCJTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXJcIlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGFyckluZGV4T2YuY2FsbChjbGFzc0xpc3QsIHRva2VuKTtcblx0fVxuXHQsIENsYXNzTGlzdCA9IGZ1bmN0aW9uIChlbGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIHRyaW1tZWRDbGFzc2VzID0gc3RyVHJpbS5jYWxsKGVsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIilcblx0XHRcdCwgY2xhc3NlcyA9IHRyaW1tZWRDbGFzc2VzID8gdHJpbW1lZENsYXNzZXMuc3BsaXQoL1xccysvKSA6IFtdXG5cdFx0XHQsIGkgPSAwXG5cdFx0XHQsIGxlbiA9IGNsYXNzZXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdHRoaXMucHVzaChjbGFzc2VzW2ldKTtcblx0XHR9XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLnRvU3RyaW5nKCkpO1xuXHRcdH07XG5cdH1cblx0LCBjbGFzc0xpc3RQcm90byA9IENsYXNzTGlzdFtwcm90b1Byb3BdID0gW11cblx0LCBjbGFzc0xpc3RHZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5ldyBDbGFzc0xpc3QodGhpcyk7XG5cdH1cbjtcbi8vIE1vc3QgRE9NRXhjZXB0aW9uIGltcGxlbWVudGF0aW9ucyBkb24ndCBhbGxvdyBjYWxsaW5nIERPTUV4Y2VwdGlvbidzIHRvU3RyaW5nKClcbi8vIG9uIG5vbi1ET01FeGNlcHRpb25zLiBFcnJvcidzIHRvU3RyaW5nKCkgaXMgc3VmZmljaWVudCBoZXJlLlxuRE9NRXhbcHJvdG9Qcm9wXSA9IEVycm9yW3Byb3RvUHJvcF07XG5jbGFzc0xpc3RQcm90by5pdGVtID0gZnVuY3Rpb24gKGkpIHtcblx0cmV0dXJuIHRoaXNbaV0gfHwgbnVsbDtcbn07XG5jbGFzc0xpc3RQcm90by5jb250YWlucyA9IGZ1bmN0aW9uICh0b2tlbikge1xuXHR0b2tlbiArPSBcIlwiO1xuXHRyZXR1cm4gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSAhPT0gLTE7XG59O1xuY2xhc3NMaXN0UHJvdG8uYWRkID0gZnVuY3Rpb24gKCkge1xuXHR2YXJcblx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdCwgaSA9IDBcblx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0LCB0b2tlblxuXHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpZiAoY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMucHVzaCh0b2tlbik7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0XHQsIGluZGV4XG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0d2hpbGUgKGluZGV4ICE9PSAtMSkge1xuXHRcdFx0dGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0fVxuXHR9XG5cdHdoaWxlICgrK2kgPCBsKTtcblxuXHRpZiAodXBkYXRlZCkge1xuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9nZ2xlID0gZnVuY3Rpb24gKHRva2VuLCBmb3JjZSkge1xuXHR0b2tlbiArPSBcIlwiO1xuXG5cdHZhclxuXHRcdCAgcmVzdWx0ID0gdGhpcy5jb250YWlucyh0b2tlbilcblx0XHQsIG1ldGhvZCA9IHJlc3VsdCA/XG5cdFx0XHRmb3JjZSAhPT0gdHJ1ZSAmJiBcInJlbW92ZVwiXG5cdFx0OlxuXHRcdFx0Zm9yY2UgIT09IGZhbHNlICYmIFwiYWRkXCJcblx0O1xuXG5cdGlmIChtZXRob2QpIHtcblx0XHR0aGlzW21ldGhvZF0odG9rZW4pO1xuXHR9XG5cblx0aWYgKGZvcmNlID09PSB0cnVlIHx8IGZvcmNlID09PSBmYWxzZSkge1xuXHRcdHJldHVybiBmb3JjZTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gIXJlc3VsdDtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5qb2luKFwiIFwiKTtcbn07XG5cbmlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcblx0dmFyIGNsYXNzTGlzdFByb3BEZXNjID0ge1xuXHRcdCAgZ2V0OiBjbGFzc0xpc3RHZXR0ZXJcblx0XHQsIGVudW1lcmFibGU6IHRydWVcblx0XHQsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHR9O1xuXHR0cnkge1xuXHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0fSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXG5cdFx0Ly8gYWRkaW5nIHVuZGVmaW5lZCB0byBmaWdodCB0aGlzIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9pc3N1ZXMvMzZcblx0XHQvLyBtb2Rlcm5pZSBJRTgtTVNXNyBtYWNoaW5lIGhhcyBJRTggOC4wLjYwMDEuMTg3MDIgYW5kIGlzIGFmZmVjdGVkXG5cdFx0aWYgKGV4Lm51bWJlciA9PT0gdW5kZWZpbmVkIHx8IGV4Lm51bWJlciA9PT0gLTB4N0ZGNUVDNTQpIHtcblx0XHRcdGNsYXNzTGlzdFByb3BEZXNjLmVudW1lcmFibGUgPSBmYWxzZTtcblx0XHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0XHR9XG5cdH1cbn0gZWxzZSBpZiAob2JqQ3RyW3Byb3RvUHJvcF0uX19kZWZpbmVHZXR0ZXJfXykge1xuXHRlbGVtQ3RyUHJvdG8uX19kZWZpbmVHZXR0ZXJfXyhjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RHZXR0ZXIpO1xufVxuXG59KHdpbmRvdy5zZWxmKSk7XG5cbn1cblxuLy8gVGhlcmUgaXMgZnVsbCBvciBwYXJ0aWFsIG5hdGl2ZSBjbGFzc0xpc3Qgc3VwcG9ydCwgc28ganVzdCBjaGVjayBpZiB3ZSBuZWVkXG4vLyB0byBub3JtYWxpemUgdGhlIGFkZC9yZW1vdmUgYW5kIHRvZ2dsZSBBUElzLlxuXG4oZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtcblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYzFcIiwgXCJjMlwiKTtcblxuXHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAvMTEgYW5kIEZpcmVmb3ggPDI2LCB3aGVyZSBjbGFzc0xpc3QuYWRkIGFuZFxuXHQvLyBjbGFzc0xpc3QucmVtb3ZlIGV4aXN0IGJ1dCBzdXBwb3J0IG9ubHkgb25lIGFyZ3VtZW50IGF0IGEgdGltZS5cblx0aWYgKCF0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjMlwiKSkge1xuXHRcdHZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QpIHtcblx0XHRcdHZhciBvcmlnaW5hbCA9IERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXTtcblxuXHRcdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odG9rZW4pIHtcblx0XHRcdFx0dmFyIGksIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0dG9rZW4gPSBhcmd1bWVudHNbaV07XG5cdFx0XHRcdFx0b3JpZ2luYWwuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblx0XHRjcmVhdGVNZXRob2QoJ2FkZCcpO1xuXHRcdGNyZWF0ZU1ldGhvZCgncmVtb3ZlJyk7XG5cdH1cblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYzNcIiwgZmFsc2UpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMCBhbmQgRmlyZWZveCA8MjQsIHdoZXJlIGNsYXNzTGlzdC50b2dnbGUgZG9lcyBub3Rcblx0Ly8gc3VwcG9ydCB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuXHRpZiAodGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzNcIikpIHtcblx0XHR2YXIgX3RvZ2dsZSA9IERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlO1xuXG5cdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbih0b2tlbiwgZm9yY2UpIHtcblx0XHRcdGlmICgxIGluIGFyZ3VtZW50cyAmJiAhdGhpcy5jb250YWlucyh0b2tlbikgPT09ICFmb3JjZSkge1xuXHRcdFx0XHRyZXR1cm4gZm9yY2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gX3RvZ2dsZS5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH1cblxuXHR0ZXN0RWxlbWVudCA9IG51bGw7XG59KCkpO1xuXG59XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LmFycmF5LmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLkFycmF5LmZyb207XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3QuYXNzaWduO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pIHtcbiAgICAgIGlmIChPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBBUkcgPSBjb2YoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi41LjcnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBzb3VyY2UpIHtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkY7XG4gIHZhciBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HO1xuICB2YXIgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuUztcbiAgdmFyIElTX1BST1RPID0gdHlwZSAmICRleHBvcnQuUDtcbiAgdmFyIElTX0JJTkQgPSB0eXBlICYgJGV4cG9ydC5CO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KTtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYgKHRhcmdldCkgcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYgKGV4cG9ydHNba2V5XSAhPSBvdXQpIGhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmIChJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dCkgZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgdHlwZW9mIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXSAhPSAnZnVuY3Rpb24nKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciAkYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICB2YXIgQSA9IHt9O1xuICB2YXIgQiA9IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgdmFyIFMgPSBTeW1ib2woKTtcbiAgdmFyIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAoaykgeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCA9IHRvT2JqZWN0KHRhcmdldCk7XG4gIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgd2hpbGUgKGFMZW4gPiBpbmRleCkge1xuICAgIHZhciBTID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHZhciBrZXlzID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGopIGlmIChpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKSBUW2tleV0gPSBTW2tleV07XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBTUkMgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciAkdG9TdHJpbmcgPSBGdW5jdGlvbltUT19TVFJJTkddO1xudmFyIFRQTCA9ICgnJyArICR0b1N0cmluZykuc3BsaXQoVE9fU1RSSU5HKTtcblxucmVxdWlyZSgnLi9fY29yZScpLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuICR0b1N0cmluZy5jYWxsKGl0KTtcbn07XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBrZXksIHZhbCwgc2FmZSkge1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJztcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsICduYW1lJykgfHwgaGlkZSh2YWwsICduYW1lJywga2V5KTtcbiAgaWYgKE9ba2V5XSA9PT0gdmFsKSByZXR1cm47XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCBTUkMpIHx8IGhpZGUodmFsLCBTUkMsIE9ba2V5XSA/ICcnICsgT1trZXldIDogVFBMLmpvaW4oU3RyaW5nKGtleSkpKTtcbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIGlmICghc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH0gZWxzZSBpZiAoT1trZXldKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2Uge1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgJiYgdGhpc1tTUkNdIHx8ICR0b1N0cmluZy5jYWxsKHRoaXMpO1xufSk7XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiBjb3JlLnZlcnNpb24sXG4gIG1vZGU6IHJlcXVpcmUoJy4vX2xpYnJhcnknKSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDE4IERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJ2YXIgc3RvcmUgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sO1xudmFyIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSAvKiAsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkICovKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdChhcnJheUxpa2UpO1xuICAgIHZhciBDID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheTtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG1hcGZuID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihPKTtcbiAgICB2YXIgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmIChtYXBwaW5nKSBtYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmIChpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSkge1xuICAgICAgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQygpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IgKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7IGFzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCIvKiFcbiAgKiBkb21yZWFkeSAoYykgRHVzdGluIERpYXogMjAxNCAtIExpY2Vuc2UgTUlUXG4gICovXG4hZnVuY3Rpb24gKG5hbWUsIGRlZmluaXRpb24pIHtcblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSB0aGlzW25hbWVdID0gZGVmaW5pdGlvbigpXG5cbn0oJ2RvbXJlYWR5JywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciBmbnMgPSBbXSwgbGlzdGVuZXJcbiAgICAsIGRvYyA9IGRvY3VtZW50XG4gICAgLCBoYWNrID0gZG9jLmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbFxuICAgICwgZG9tQ29udGVudExvYWRlZCA9ICdET01Db250ZW50TG9hZGVkJ1xuICAgICwgbG9hZGVkID0gKGhhY2sgPyAvXmxvYWRlZHxeYy8gOiAvXmxvYWRlZHxeaXxeYy8pLnRlc3QoZG9jLnJlYWR5U3RhdGUpXG5cblxuICBpZiAoIWxvYWRlZClcbiAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgbGlzdGVuZXIpXG4gICAgbG9hZGVkID0gMVxuICAgIHdoaWxlIChsaXN0ZW5lciA9IGZucy5zaGlmdCgpKSBsaXN0ZW5lcigpXG4gIH0pXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgIGxvYWRlZCA/IHNldFRpbWVvdXQoZm4sIDApIDogZm5zLnB1c2goZm4pXG4gIH1cblxufSk7XG4iLCIvLyBlbGVtZW50LWNsb3Nlc3QgfCBDQzAtMS4wIHwgZ2l0aHViLmNvbS9qb25hdGhhbnRuZWFsL2Nsb3Nlc3RcblxuKGZ1bmN0aW9uIChFbGVtZW50UHJvdG8pIHtcblx0aWYgKHR5cGVvZiBFbGVtZW50UHJvdG8ubWF0Y2hlcyAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdEVsZW1lbnRQcm90by5tYXRjaGVzID0gRWxlbWVudFByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnRQcm90by5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudFByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBmdW5jdGlvbiBtYXRjaGVzKHNlbGVjdG9yKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IHRoaXM7XG5cdFx0XHR2YXIgZWxlbWVudHMgPSAoZWxlbWVudC5kb2N1bWVudCB8fCBlbGVtZW50Lm93bmVyRG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXHRcdFx0dmFyIGluZGV4ID0gMDtcblxuXHRcdFx0d2hpbGUgKGVsZW1lbnRzW2luZGV4XSAmJiBlbGVtZW50c1tpbmRleF0gIT09IGVsZW1lbnQpIHtcblx0XHRcdFx0KytpbmRleDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIEJvb2xlYW4oZWxlbWVudHNbaW5kZXhdKTtcblx0XHR9O1xuXHR9XG5cblx0aWYgKHR5cGVvZiBFbGVtZW50UHJvdG8uY2xvc2VzdCAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdEVsZW1lbnRQcm90by5jbG9zZXN0ID0gZnVuY3Rpb24gY2xvc2VzdChzZWxlY3Rvcikge1xuXHRcdFx0dmFyIGVsZW1lbnQgPSB0aGlzO1xuXG5cdFx0XHR3aGlsZSAoZWxlbWVudCAmJiBlbGVtZW50Lm5vZGVUeXBlID09PSAxKSB7XG5cdFx0XHRcdGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9O1xuXHR9XG59KSh3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUpO1xuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbmNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnLi4vZGVsZWdhdGUnKTtcbmNvbnN0IGRlbGVnYXRlQWxsID0gcmVxdWlyZSgnLi4vZGVsZWdhdGVBbGwnKTtcblxuY29uc3QgREVMRUdBVEVfUEFUVEVSTiA9IC9eKC4rKTpkZWxlZ2F0ZVxcKCguKylcXCkkLztcbmNvbnN0IFNQQUNFID0gJyAnO1xuXG5jb25zdCBnZXRMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlLCBoYW5kbGVyKSB7XG4gIHZhciBtYXRjaCA9IHR5cGUubWF0Y2goREVMRUdBVEVfUEFUVEVSTik7XG4gIHZhciBzZWxlY3RvcjtcbiAgaWYgKG1hdGNoKSB7XG4gICAgdHlwZSA9IG1hdGNoWzFdO1xuICAgIHNlbGVjdG9yID0gbWF0Y2hbMl07XG4gIH1cblxuICB2YXIgb3B0aW9ucztcbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0Jykge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBjYXB0dXJlOiBwb3BLZXkoaGFuZGxlciwgJ2NhcHR1cmUnKSxcbiAgICAgIHBhc3NpdmU6IHBvcEtleShoYW5kbGVyLCAncGFzc2l2ZScpXG4gICAgfTtcbiAgfVxuXG4gIHZhciBsaXN0ZW5lciA9IHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXG4gICAgZGVsZWdhdGU6ICh0eXBlb2YgaGFuZGxlciA9PT0gJ29iamVjdCcpXG4gICAgICA/IGRlbGVnYXRlQWxsKGhhbmRsZXIpXG4gICAgICA6IHNlbGVjdG9yXG4gICAgICAgID8gZGVsZWdhdGUoc2VsZWN0b3IsIGhhbmRsZXIpXG4gICAgICAgIDogaGFuZGxlcixcbiAgICBvcHRpb25zOiBvcHRpb25zXG4gIH07XG5cbiAgaWYgKHR5cGUuaW5kZXhPZihTUEFDRSkgPiAtMSkge1xuICAgIHJldHVybiB0eXBlLnNwbGl0KFNQQUNFKS5tYXAoZnVuY3Rpb24oX3R5cGUpIHtcbiAgICAgIHJldHVybiBhc3NpZ24oe3R5cGU6IF90eXBlfSwgbGlzdGVuZXIpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxpc3RlbmVyLnR5cGUgPSB0eXBlO1xuICAgIHJldHVybiBbbGlzdGVuZXJdO1xuICB9XG59O1xuXG52YXIgcG9wS2V5ID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gIGRlbGV0ZSBvYmpba2V5XTtcbiAgcmV0dXJuIHZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiZWhhdmlvcihldmVudHMsIHByb3BzKSB7XG4gIGNvbnN0IGxpc3RlbmVycyA9IE9iamVjdC5rZXlzKGV2ZW50cylcbiAgICAucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHR5cGUpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSBnZXRMaXN0ZW5lcnModHlwZSwgZXZlbnRzW3R5cGVdKTtcbiAgICAgIHJldHVybiBtZW1vLmNvbmNhdChsaXN0ZW5lcnMpO1xuICAgIH0sIFtdKTtcblxuICByZXR1cm4gYXNzaWduKHtcbiAgICBhZGQ6IGZ1bmN0aW9uIGFkZEJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmVCZWhhdmlvcihlbGVtZW50KSB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgbGlzdGVuZXIudHlwZSxcbiAgICAgICAgICBsaXN0ZW5lci5kZWxlZ2F0ZSxcbiAgICAgICAgICBsaXN0ZW5lci5vcHRpb25zXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHByb3BzKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBvc2UoZnVuY3Rpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBlKSA9PT0gZmFsc2U7XG4gICAgfSwgdGhpcyk7XG4gIH07XG59O1xuIiwiY29uc3QgZGVsZWdhdGUgPSByZXF1aXJlKCcuLi9kZWxlZ2F0ZScpO1xuY29uc3QgY29tcG9zZSA9IHJlcXVpcmUoJy4uL2NvbXBvc2UnKTtcblxuY29uc3QgU1BMQVQgPSAnKic7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVsZWdhdGVBbGwoc2VsZWN0b3JzKSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhzZWxlY3RvcnMpXG5cbiAgLy8gWFhYIG9wdGltaXphdGlvbjogaWYgdGhlcmUgaXMgb25seSBvbmUgaGFuZGxlciBhbmQgaXQgYXBwbGllcyB0b1xuICAvLyBhbGwgZWxlbWVudHMgKHRoZSBcIipcIiBDU1Mgc2VsZWN0b3IpLCB0aGVuIGp1c3QgcmV0dXJuIHRoYXRcbiAgLy8gaGFuZGxlclxuICBpZiAoa2V5cy5sZW5ndGggPT09IDEgJiYga2V5c1swXSA9PT0gU1BMQVQpIHtcbiAgICByZXR1cm4gc2VsZWN0b3JzW1NQTEFUXTtcbiAgfVxuXG4gIGNvbnN0IGRlbGVnYXRlcyA9IGtleXMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHNlbGVjdG9yKSB7XG4gICAgbWVtby5wdXNoKGRlbGVnYXRlKHNlbGVjdG9yLCBzZWxlY3RvcnNbc2VsZWN0b3JdKSk7XG4gICAgcmV0dXJuIG1lbW87XG4gIH0sIFtdKTtcbiAgcmV0dXJuIGNvbXBvc2UoZGVsZWdhdGVzKTtcbn07XG4iLCIvLyBwb2x5ZmlsbCBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0XG5yZXF1aXJlKCdlbGVtZW50LWNsb3Nlc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZShzZWxlY3RvciwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlbGVnYXRpb24oZXZlbnQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3Qoc2VsZWN0b3IpO1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRhcmdldCwgZXZlbnQpO1xuICAgIH1cbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb25jZShsaXN0ZW5lciwgb3B0aW9ucykge1xuICB2YXIgd3JhcHBlZCA9IGZ1bmN0aW9uIHdyYXBwZWRPbmNlKGUpIHtcbiAgICBlLmN1cnJlbnRUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLnR5cGUsIHdyYXBwZWQsIG9wdGlvbnMpO1xuICAgIHJldHVybiBsaXN0ZW5lci5jYWxsKHRoaXMsIGUpO1xuICB9O1xuICByZXR1cm4gd3JhcHBlZDtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xyXG5jb25zdCBmaWx0ZXIgPSByZXF1aXJlKCdhcnJheS1maWx0ZXInKTtcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuY29uc3QgdG9nZ2xlID0gcmVxdWlyZSgnLi4vdXRpbHMvdG9nZ2xlJyk7XHJcbmNvbnN0IGlzRWxlbWVudEluVmlld3BvcnQgPSByZXF1aXJlKCcuLi91dGlscy9pcy1pbi12aWV3cG9ydCcpO1xyXG5cclxuY29uc3QgQ0xJQ0sgPSByZXF1aXJlKCcuLi9ldmVudHMnKS5DTElDSztcclxuY29uc3QgUFJFRklYID0gcmVxdWlyZSgnLi4vY29uZmlnJykucHJlZml4O1xyXG5cclxuLy8gWFhYIG1hdGNoIC5hY2NvcmRpb24gYW5kIC5hY2NvcmRpb24tYm9yZGVyZWRcclxuY29uc3QgQUNDT1JESU9OID0gYC4ke1BSRUZJWH1hY2NvcmRpb24sIC4ke1BSRUZJWH1hY2NvcmRpb24tYm9yZGVyZWRgO1xyXG5jb25zdCBCVVRUT04gPSBgLiR7UFJFRklYfWFjY29yZGlvbi1idXR0b25bYXJpYS1jb250cm9sc11gO1xyXG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcclxuY29uc3QgTVVMVElTRUxFQ1RBQkxFID0gJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJztcclxuXHJcbi8qKlxyXG4gKiBUb2dnbGUgYSBidXR0b24ncyBcInByZXNzZWRcIiBzdGF0ZSwgb3B0aW9uYWxseSBwcm92aWRpbmcgYSB0YXJnZXRcclxuICogc3RhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxyXG4gKiBAcGFyYW0ge2Jvb2xlYW4/fSBleHBhbmRlZCBJZiBubyBzdGF0ZSBpcyBwcm92aWRlZCwgdGhlIGN1cnJlbnRcclxuICogc3RhdGUgd2lsbCBiZSB0b2dnbGVkIChmcm9tIGZhbHNlIHRvIHRydWUsIGFuZCB2aWNlLXZlcnNhKS5cclxuICogQHJldHVybiB7Ym9vbGVhbn0gdGhlIHJlc3VsdGluZyBzdGF0ZVxyXG4gKi9cclxuY29uc3QgdG9nZ2xlQnV0dG9uID0gKGJ1dHRvbiwgZXhwYW5kZWQpID0+IHtcclxuICB2YXIgYWNjb3JkaW9uID0gYnV0dG9uLmNsb3Nlc3QoQUNDT1JESU9OKTtcclxuICBpZiAoIWFjY29yZGlvbikge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGAke0JVVFRPTn0gaXMgbWlzc2luZyBvdXRlciAke0FDQ09SRElPTn1gKTtcclxuICB9XHJcblxyXG4gIGV4cGFuZGVkID0gdG9nZ2xlKGJ1dHRvbiwgZXhwYW5kZWQpO1xyXG4gIC8vIFhYWCBtdWx0aXNlbGVjdGFibGUgaXMgb3B0LWluLCB0byBwcmVzZXJ2ZSBsZWdhY3kgYmVoYXZpb3JcclxuICBjb25zdCBtdWx0aXNlbGVjdGFibGUgPSBhY2NvcmRpb24uZ2V0QXR0cmlidXRlKE1VTFRJU0VMRUNUQUJMRSkgPT09ICd0cnVlJztcclxuXHJcbiAgaWYgKGV4cGFuZGVkICYmICFtdWx0aXNlbGVjdGFibGUpIHtcclxuICAgIGZvckVhY2goZ2V0QWNjb3JkaW9uQnV0dG9ucyhhY2NvcmRpb24pLCBvdGhlciA9PiB7XHJcbiAgICAgIGlmIChvdGhlciAhPT0gYnV0dG9uKSB7XHJcbiAgICAgICAgdG9nZ2xlKG90aGVyLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cclxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZVxyXG4gKi9cclxuY29uc3Qgc2hvd0J1dHRvbiA9IGJ1dHRvbiA9PiB0b2dnbGVCdXR0b24oYnV0dG9uLCB0cnVlKTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cclxuICogQHJldHVybiB7Ym9vbGVhbn0gZmFsc2VcclxuICovXHJcbmNvbnN0IGhpZGVCdXR0b24gPSBidXR0b24gPT4gdG9nZ2xlQnV0dG9uKGJ1dHRvbiwgZmFsc2UpO1xyXG5cclxuLyoqXHJcbiAqIEdldCBhbiBBcnJheSBvZiBidXR0b24gZWxlbWVudHMgYmVsb25naW5nIGRpcmVjdGx5IHRvIHRoZSBnaXZlblxyXG4gKiBhY2NvcmRpb24gZWxlbWVudC5cclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gYWNjb3JkaW9uXHJcbiAqIEByZXR1cm4ge2FycmF5PEhUTUxCdXR0b25FbGVtZW50Pn1cclxuICovXHJcbmNvbnN0IGdldEFjY29yZGlvbkJ1dHRvbnMgPSBhY2NvcmRpb24gPT4ge1xyXG4gIHJldHVybiBmaWx0ZXIoYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKSwgYnV0dG9uID0+IHtcclxuICAgIHJldHVybiBidXR0b24uY2xvc2VzdChBQ0NPUkRJT04pID09PSBhY2NvcmRpb247XHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBhY2NvcmRpb24gPSBiZWhhdmlvcih7XHJcbiAgWyBDTElDSyBdOiB7XHJcbiAgICBbIEJVVFRPTiBdOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdG9nZ2xlQnV0dG9uKHRoaXMpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgICAgLy8gV2Ugd2VyZSBqdXN0IGV4cGFuZGVkLCBidXQgaWYgYW5vdGhlciBhY2NvcmRpb24gd2FzIGFsc28ganVzdFxyXG4gICAgICAgIC8vIGNvbGxhcHNlZCwgd2UgbWF5IG5vIGxvbmdlciBiZSBpbiB0aGUgdmlld3BvcnQuIFRoaXMgZW5zdXJlc1xyXG4gICAgICAgIC8vIHRoYXQgd2UgYXJlIHN0aWxsIHZpc2libGUsIHNvIHRoZSB1c2VyIGlzbid0IGNvbmZ1c2VkLlxyXG4gICAgICAgIGlmICghaXNFbGVtZW50SW5WaWV3cG9ydCh0aGlzKSkgdGhpcy5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0sIHtcclxuICBpbml0OiByb290ID0+IHtcclxuICAgIGZvckVhY2gocm9vdC5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTiksIGJ1dHRvbiA9PiB7XHJcbiAgICAgIGNvbnN0IGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJztcclxuICAgICAgdG9nZ2xlQnV0dG9uKGJ1dHRvbiwgZXhwYW5kZWQpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBBQ0NPUkRJT04sXHJcbiAgQlVUVE9OLFxyXG4gIHNob3c6IHNob3dCdXR0b24sXHJcbiAgaGlkZTogaGlkZUJ1dHRvbixcclxuICB0b2dnbGU6IHRvZ2dsZUJ1dHRvbixcclxuICBnZXRCdXR0b25zOiBnZXRBY2NvcmRpb25CdXR0b25zLFxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBUT0RPOiBmb3IgMi4wLCByZW1vdmUgZXZlcnl0aGluZyBiZWxvdyB0aGlzIGNvbW1lbnQgYW5kIGV4cG9ydCB0aGVcclxuICogYmVoYXZpb3IgZGlyZWN0bHk6XHJcbiAqXHJcbiAqIG1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3Ioey4uLn0pO1xyXG4gKi9cclxuY29uc3QgQWNjb3JkaW9uID0gZnVuY3Rpb24gKHJvb3QpIHtcclxuICB0aGlzLnJvb3QgPSByb290O1xyXG4gIGFjY29yZGlvbi5vbih0aGlzLnJvb3QpO1xyXG59O1xyXG5cclxuLy8gY29weSBhbGwgb2YgdGhlIGJlaGF2aW9yIG1ldGhvZHMgYW5kIHByb3BzIHRvIEFjY29yZGlvblxyXG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XHJcbmFzc2lnbihBY2NvcmRpb24sIGFjY29yZGlvbik7XHJcblxyXG5BY2NvcmRpb24ucHJvdG90eXBlLnNob3cgPSBzaG93QnV0dG9uO1xyXG5BY2NvcmRpb24ucHJvdG90eXBlLmhpZGUgPSBoaWRlQnV0dG9uO1xyXG5cclxuQWNjb3JkaW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgYWNjb3JkaW9uLm9mZih0aGlzLnJvb3QpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBY2NvcmRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xyXG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuY29uc3QgY2xvc2VzdCA9IHJlcXVpcmUoJy4uL3V0aWxzL2Nsb3Nlc3QnKTtcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuXHJcblxyXG5jbGFzcyBjaGVja2JveFRvZ2dsZUNvbnRlbnR7XHJcbiAgICBjb25zdHJ1Y3RvcihlbCl7XHJcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRyaWdnZXIgPSBcIi5qcy1jaGVja2JveC10b2dnbGUtY29udGVudFwiO1xyXG4gICAgICAgIHRoaXMuanNUb2dnbGVUYXJnZXQgPSBcImRhdGEtanMtdGFyZ2V0XCI7XHJcblxyXG4gICAgICAgIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY2hlY2tib3hFbCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdChlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChlbCl7XHJcbiAgICAgICAgdGhpcy5jaGVja2JveEVsID0gZWw7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2hlY2tib3hFbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgdGhhdC50b2dnbGUodGhhdC5jaGVja2JveEVsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRvZ2dsZSh0aGlzLmNoZWNrYm94RWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZSh0cmlnZ2VyRWwpe1xyXG4gICAgICAgIHZhciB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZSh0aGlzLmpzVG9nZ2xlVGFyZ2V0KVxyXG4gICAgICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdmFyIHRhcmdldEVsID0gc2VsZWN0KHRhcmdldEF0dHIsICdib2R5Jyk7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICBpZih0cmlnZ2VyRWwuY2hlY2tlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuKHRyaWdnZXJFbCwgdGFyZ2V0RWxbMF0pO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSh0cmlnZ2VyRWwsIHRhcmdldEVsWzBdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcGVuKHRyaWdnZXJFbCwgdGFyZ2V0RWwpe1xyXG4gICAgICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKFwiY29sbGFwc2VkXCIpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcImZhbHNlXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsb3NlKHRyaWdnZXJFbCwgdGFyZ2V0RWwpe1xyXG4gICAgICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZChcImNvbGxhcHNlZFwiKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGVja2JveFRvZ2dsZUNvbnRlbnQ7IiwiLyoqXHJcbiAqIENvbGxhcHNlL2V4cGFuZC5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZSgnLi4vdXRpbHMvYmVoYXZpb3InKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcbmNvbnN0IGNsb3Nlc3QgPSByZXF1aXJlKCcuLi91dGlscy9jbG9zZXN0Jyk7XHJcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XHJcblxyXG5jb25zdCBqc0NvbGxhcHNlVHJpZ2dlciA9IFwiLmpzLWNvbGxhcHNlXCI7XHJcbmNvbnN0IGpzQ29sbGFwc2VUYXJnZXQgPSBcImRhdGEtanMtdGFyZ2V0XCI7XHJcblxyXG5jb25zdCB0b2dnbGVDb2xsYXBzZSA9IGZ1bmN0aW9uICh0cmlnZ2VyRWwsIGZvcmNlQ2xvc2UpIHtcclxuICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgdmFyIHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKGpzQ29sbGFwc2VUYXJnZXQpXHJcbiAgICAgICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0RWwgPSBzZWxlY3QodGFyZ2V0QXR0ciwgJ2JvZHknKTtcclxuICAgICAgICAgICAgaWYodGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgIC8vdGFyZ2V0IGZvdW5kLCBjaGVjayBzdGF0ZVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0RWwgPSB0YXJnZXRFbFswXTtcclxuICAgICAgICAgICAgICAgIC8vY2hhbmdlIHN0YXRlXHJcbiAgICAgICAgICAgICAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiKSA9PSBcInRydWVcIiB8fCB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiKSA9PSB1bmRlZmluZWQgfHwgZm9yY2VDbG9zZSApe1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY2xvc2VcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlQ29sbGFwc2UodGFyZ2V0RWwsIHRyaWdnZXJFbCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAvL29wZW5cclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlRXhwYW5kKHRhcmdldEVsLCB0cmlnZ2VyRWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICAgICBcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IHRvZ2dsZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdmFyIHRyaWdnZXJFbG0gPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwganNDb2xsYXBzZVRyaWdnZXIpO1xyXG4gICAgaWYodHJpZ2dlckVsbSAhPT0gbnVsbCAmJiB0cmlnZ2VyRWxtICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHRvZ2dsZUNvbGxhcHNlKHRyaWdnZXJFbG0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XHJcblxyXG5mdW5jdGlvbiBhbmltYXRlQ29sbGFwc2UodGFyZ2V0RWwsIHRyaWdnZXJFbCkge1xyXG4gICAgaWYoIWFuaW1hdGVJblByb2dyZXNzKXtcclxuICAgICAgICBhbmltYXRlSW5Qcm9ncmVzcyA9IHRydWU7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUuaGVpZ2h0ID0gdGFyZ2V0RWwuY2xpZW50SGVpZ2h0KyBcInB4XCI7XHJcbiAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZChcImNvbGxhcHNlLXRyYW5zaXRpb24tY29sbGFwc2VcIik7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBcclxuICAgICAgICAgICAgdGFyZ2V0RWwucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XHJcbiAgICAgICAgfSwgNSk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZChcImNvbGxhcHNlZFwiKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZShcImNvbGxhcHNlLXRyYW5zaXRpb24tY29sbGFwc2VcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XHJcbiAgICAgICAgICAgIGFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XHJcbiAgICAgICAgfSwgMjAwKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gYW5pbWF0ZUV4cGFuZCh0YXJnZXRFbCwgdHJpZ2dlckVsKSB7XHJcbiAgICBpZighYW5pbWF0ZUluUHJvZ3Jlc3Mpe1xyXG4gICAgICAgIGFuaW1hdGVJblByb2dyZXNzID0gdHJ1ZTtcclxuICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKFwiY29sbGFwc2VkXCIpO1xyXG4gICAgICAgIHZhciBleHBhbmRlZEhlaWdodCA9IHRhcmdldEVsLmNsaWVudEhlaWdodDtcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSBcIjBweFwiO1xyXG4gICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoXCJjb2xsYXBzZS10cmFuc2l0aW9uLWV4cGFuZFwiKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IFxyXG4gICAgICAgICAgICB0YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSBleHBhbmRlZEhlaWdodCsgXCJweFwiO1xyXG4gICAgICAgIH0sIDUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgXHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJjb2xsYXBzZS10cmFuc2l0aW9uLWV4cGFuZFwiKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XHJcblxyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcImZhbHNlXCIpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcInRydWVcIik7XHJcbiAgICAgICAgICAgIGFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XHJcbiAgICAgICAgfSwgMjAwKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcih7XHJcbiAgWydjbGljayddOiB7XHJcbiAgICBbIGpzQ29sbGFwc2VUcmlnZ2VyIF06IHRvZ2dsZVxyXG4gIH0sXHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBjbG9zZXN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvY2xvc2VzdCcpO1xuXG5jbGFzcyBkcm9wZG93biB7XG4gIGNvbnN0cnVjdG9yIChlbCl7XG4gICAgdGhpcy5qc0Ryb3Bkb3duVHJpZ2dlciA9ICcuanMtZHJvcGRvd24nO1xuICAgIHRoaXMuanNEcm9wZG93blRhcmdldCA9ICdkYXRhLWpzLXRhcmdldCc7XG5cbiAgICAvL29wdGlvbjogbWFrZSBkcm9wZG93biBiZWhhdmUgYXMgdGhlIGNvbGxhcHNlIGNvbXBvbmVudCB3aGVuIG9uIHNtYWxsIHNjcmVlbnMgKHVzZWQgYnkgc3VibWVudXMgaW4gdGhlIGhlYWRlciBhbmQgc3RlcC1kcm9wZG93bikuXG4gICAgdGhpcy5uYXZSZXNwb25zaXZlQnJlYWtwb2ludCA9IDk5MjsgLy9zYW1lIGFzICRuYXYtcmVzcG9uc2l2ZS1icmVha3BvaW50IGZyb20gdGhlIHNjc3MuXG4gICAgdGhpcy5qc1Jlc3BvbnNpdmVDb2xsYXBzZU1vZGlmaWVyID0gJy5qcy1kcm9wZG93bi0tcmVzcG9uc2l2ZS1jb2xsYXBzZSc7XG4gICAgdGhpcy5yZXNwb25zaXZlQ29sbGFwc2VFbmFibGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLnRyaWdnZXJFbCA9IG51bGw7XG4gICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XG5cbiAgICB0aGlzLmluaXQoZWwpO1xuXG4gICAgaWYodGhpcy50cmlnZ2VyRWwgIT09IG51bGwgJiYgdGhpcy50cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnRhcmdldEVsICE9PSBudWxsICYmIHRoaXMudGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XG5cbiAgICAgIC8vQ2xpY2tlZCBvdXRzaWRlIGRyb3Bkb3duIC0+IGNsb3NlIGl0XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpe1xuICAgICAgICB0aGF0Lm91dHNpZGVDbG9zZShldmVudCk7XG4gICAgICB9KTtcblxuICAgICAgLy9DbGlja2VkIG9uIGRyb3Bkb3duIG9wZW4gYnV0dG9uIC0tPiB0b2dnbGUgaXRcbiAgICAgIHRoaXMudHJpZ2dlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KXtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7Ly9wcmV2ZW50cyBvdXNpZGUgY2xpY2sgbGlzdGVuZXIgZnJvbSB0cmlnZ2VyaW5nLlxuICAgICAgICB0aGF0LnRvZ2dsZURyb3Bkb3duKCk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLnRyaWdnZXJFbDtcbiAgICAgIGlmICh3aW5kb3cuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpIHtcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGZ1bmN0aW9uKGVudHJpZXMpIHtcbiAgICAgICAgICBpZiAoZW50cmllc1sgMCBdLmludGVyc2VjdGlvblJhdGlvKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndmlzaWJsZScpO1xuICAgICAgICAgICAgaWYoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJyl7XG4gICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaGlkZGVuJyk7XG4gICAgICAgICAgICBpZih0aGF0LnRhcmdldEVsLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PT0gJ3RydWUnKXtcbiAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHJvb3Q6IGRvY3VtZW50LmJvZHlcbiAgICAgICAgfSk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgZXZ0ID0gZXZ0IHx8IHdpbmRvdy5ldmVudDtcbiAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSAyNykge1xuICAgICAgICAgIHRoYXQuY2xvc2VBbGwoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuXG4gIGluaXQgKGVsKXtcbiAgICB0aGlzLnRyaWdnZXJFbCA9IGVsO1xuICAgIGlmKHRoaXMudHJpZ2dlckVsICE9PSBudWxsICYmIHRoaXMudHJpZ2dlckVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgbGV0IHRhcmdldEF0dHIgPSB0aGlzLnRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUodGhpcy5qc0Ryb3Bkb3duVGFyZ2V0KTtcbiAgICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgbGV0IHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpKTtcbiAgICAgICAgaWYodGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgdGhpcy50YXJnZXRFbCA9IHRhcmdldEVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYodGhpcy50cmlnZ2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1kcm9wZG93bi0tcmVzcG9uc2l2ZS1jb2xsYXBzZScpKXtcbiAgICAgIHRoaXMucmVzcG9uc2l2ZUNvbGxhcHNlRW5hYmxlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgY2xvc2VBbGwgKCl7XG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcblxuICAgIGxldCBvdmVyZmxvd01lbnVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ292ZXJmbG93LW1lbnUnKTtcbiAgICBsZXQgdHJpZ2dlckVsID0gbnVsbDtcbiAgICBsZXQgdGFyZ2V0RWwgPSBudWxsO1xuICAgIGZvciAobGV0IG9pID0gMDsgb2kgPCBvdmVyZmxvd01lbnVFbC5sZW5ndGg7IG9pKyspIHtcbiAgICAgIGxldCBjdXJyZW50T3ZlcmZsb3dNZW51RUwgPSBvdmVyZmxvd01lbnVFbFsgb2kgXTtcbiAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgY3VycmVudE92ZXJmbG93TWVudUVMLmNoaWxkTm9kZXMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgaWYgKGN1cnJlbnRPdmVyZmxvd01lbnVFTC5jaGlsZE5vZGVzWyBhIF0udGFnTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKGN1cnJlbnRPdmVyZmxvd01lbnVFTC5jaGlsZE5vZGVzWyBhIF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1kcm9wZG93bicpKSB7XG4gICAgICAgICAgICB0cmlnZ2VyRWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwuY2hpbGROb2Rlc1sgYSBdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudE92ZXJmbG93TWVudUVMLmNoaWxkTm9kZXNbIGEgXS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtaW5uZXInKSkge1xuICAgICAgICAgICAgdGFyZ2V0RWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwuY2hpbGROb2Rlc1sgYSBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRhcmdldEVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ21vYmlsZV9uYXYtYWN0aXZlJykpIHtcbiAgICAgICAgICBpZiAoIWN1cnJlbnRPdmVyZmxvd01lbnVFTC5jbG9zZXN0KCcubmF2YmFyJykpIHtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZURyb3Bkb3duIChmb3JjZUNsb3NlKSB7XG4gICAgaWYodGhpcy50cmlnZ2VyRWwgIT09IG51bGwgJiYgdGhpcy50cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnRhcmdldEVsICE9PSBudWxsICYmIHRoaXMudGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAvL2NoYW5nZSBzdGF0ZVxuICAgICAgaWYodGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJyB8fCBmb3JjZUNsb3NlKXtcbiAgICAgICAgLy9jbG9zZVxuICAgICAgICB0aGlzLnRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgdGhpcy50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgdGhpcy50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLmNsb3NlQWxsKCk7XG4gICAgICAgIC8vb3BlblxuICAgICAgICB0aGlzLnRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xuICAgICAgICB0aGlzLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvdXRzaWRlQ2xvc2UgKGV2ZW50KXtcbiAgICBpZighdGhpcy5kb1Jlc3BvbnNpdmVDb2xsYXBzZSgpKXtcbiAgICAgIC8vY2xvc2VzIGRyb3Bkb3duIHdoZW4gY2xpY2tlZCBvdXRzaWRlLlxuICAgICAgbGV0IGRyb3Bkb3duRWxtID0gY2xvc2VzdChldmVudC50YXJnZXQsIHRoaXMudGFyZ2V0RWwuaWQpO1xuICAgICAgaWYoKGRyb3Bkb3duRWxtID09PSBudWxsIHx8IGRyb3Bkb3duRWxtID09PSB1bmRlZmluZWQpICYmIChldmVudC50YXJnZXQgIT09IHRoaXMudHJpZ2dlckVsKSl7XG4gICAgICAgIC8vY2xpY2tlZCBvdXRzaWRlIHRyaWdnZXIsIGZvcmNlIGNsb3NlXG4gICAgICAgIHRoaXMudG9nZ2xlRHJvcGRvd24odHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZG9SZXNwb25zaXZlQ29sbGFwc2UgKCl7XG4gICAgLy9yZXR1cm5zIHRydWUgaWYgcmVzcG9uc2l2ZSBjb2xsYXBzZSBpcyBlbmFibGVkIGFuZCB3ZSBhcmUgb24gYSBzbWFsbCBzY3JlZW4uXG4gICAgaWYodGhpcy5yZXNwb25zaXZlQ29sbGFwc2VFbmFibGVkICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IHRoaXMubmF2UmVzcG9uc2l2ZUJyZWFrcG9pbnQpe1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRyb3Bkb3duO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgYWNjb3JkaW9uOiAgcmVxdWlyZSgnLi9hY2NvcmRpb24nKSxcclxuICBuYXZpZ2F0aW9uOiByZXF1aXJlKCcuL25hdmlnYXRpb24nKSxcclxuICBza2lwbmF2OiAgICByZXF1aXJlKCcuL3NraXBuYXYnKSxcclxuICByZWdleG1hc2s6ICByZXF1aXJlKCcuL3JlZ2V4LWlucHV0LW1hc2snKSxcclxuICBjb2xsYXBzZTogICByZXF1aXJlKCcuL2NvbGxhcHNlJylcclxufTtcclxuIiwiXHJcbmNvbnN0IGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKTtcclxuXHJcbi8qKlxyXG4gKiBJbXBvcnQgbW9kYWwgbGliLlxyXG4gKiBodHRwczovL21pY3JvbW9kYWwubm93LnNoXHJcbiAqL1xyXG5jb25zdCBtaWNyb01vZGFsID0gcmVxdWlyZShcIi4uLy4uL3ZlbmRvci9taWNyb21vZGFsLmpzXCIpO1xyXG5kb21yZWFkeSgoKSA9PiB7XHJcblx0bWljcm9Nb2RhbC5pbml0KCk7IC8vaW5pdCBhbGwgbW9kYWxzXHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZSgnLi4vdXRpbHMvYmVoYXZpb3InKTtcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcbmNvbnN0IGFjY29yZGlvbiA9IHJlcXVpcmUoJy4vYWNjb3JkaW9uJyk7XHJcblxyXG5jb25zdCBDTElDSyA9IHJlcXVpcmUoJy4uL2V2ZW50cycpLkNMSUNLO1xyXG5jb25zdCBQUkVGSVggPSByZXF1aXJlKCcuLi9jb25maWcnKS5wcmVmaXg7XHJcblxyXG5jb25zdCBOQVYgPSBgLm5hdmA7XHJcbmNvbnN0IE5BVl9MSU5LUyA9IGAke05BVn0gYWA7XHJcbmNvbnN0IE9QRU5FUlMgPSBgLmpzLW1lbnUtb3BlbmA7XHJcbmNvbnN0IENMT1NFX0JVVFRPTiA9IGAuanMtbWVudS1jbG9zZWA7XHJcbmNvbnN0IE9WRVJMQVkgPSBgLm92ZXJsYXlgO1xyXG5jb25zdCBDTE9TRVJTID0gYCR7Q0xPU0VfQlVUVE9OfSwgLm92ZXJsYXlgO1xyXG5jb25zdCBUT0dHTEVTID0gWyBOQVYsIE9WRVJMQVkgXS5qb2luKCcsICcpO1xyXG5cclxuY29uc3QgQUNUSVZFX0NMQVNTID0gJ21vYmlsZV9uYXYtYWN0aXZlJztcclxuY29uc3QgVklTSUJMRV9DTEFTUyA9ICdpcy12aXNpYmxlJztcclxuXHJcbmNvbnN0IGlzQWN0aXZlID0gKCkgPT4gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoQUNUSVZFX0NMQVNTKTtcclxuXHJcbmNvbnN0IF9mb2N1c1RyYXAgPSAodHJhcENvbnRhaW5lcikgPT4ge1xyXG4gIC8vIEZpbmQgYWxsIGZvY3VzYWJsZSBjaGlsZHJlblxyXG4gIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nID0gJ2FbaHJlZl0sIGFyZWFbaHJlZl0sIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCBpZnJhbWUsIG9iamVjdCwgZW1iZWQsIFt0YWJpbmRleD1cIjBcIl0sIFtjb250ZW50ZWRpdGFibGVdJztcclxuICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IHRyYXBDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XHJcbiAgY29uc3QgZmlyc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbIDAgXTtcclxuICBjb25zdCBsYXN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWyBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxIF07XHJcblxyXG4gIGZ1bmN0aW9uIHRyYXBUYWJLZXkgKGUpIHtcclxuICAgIC8vIENoZWNrIGZvciBUQUIga2V5IHByZXNzXHJcbiAgICBpZiAoZS5rZXlDb2RlID09PSA5KSB7XHJcblxyXG4gICAgICAvLyBTSElGVCArIFRBQlxyXG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdFRhYlN0b3ApIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgLy8gVEFCXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3RUYWJTdG9wKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBFU0NBUEVcclxuICAgIGlmIChlLmtleUNvZGUgPT09IDI3KSB7XHJcbiAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEZvY3VzIGZpcnN0IGNoaWxkXHJcbiAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbmFibGUgKCkge1xyXG4gICAgICAvLyBMaXN0ZW4gZm9yIGFuZCB0cmFwIHRoZSBrZXlib2FyZFxyXG4gICAgICB0cmFwQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVsZWFzZSAoKSB7XHJcbiAgICAgIHRyYXBDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBUYWJLZXkpO1xyXG4gICAgfSxcclxuICB9O1xyXG59O1xyXG5cclxubGV0IGZvY3VzVHJhcDtcclxuXHJcbmNvbnN0IHRvZ2dsZU5hdiA9IGZ1bmN0aW9uIChhY3RpdmUpIHtcclxuICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICBpZiAodHlwZW9mIGFjdGl2ZSAhPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICBhY3RpdmUgPSAhaXNBY3RpdmUoKTtcclxuICB9XHJcbiAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKEFDVElWRV9DTEFTUywgYWN0aXZlKTtcclxuXHJcbiAgZm9yRWFjaChzZWxlY3QoVE9HR0xFUyksIGVsID0+IHtcclxuICAgIGVsLmNsYXNzTGlzdC50b2dnbGUoVklTSUJMRV9DTEFTUywgYWN0aXZlKTtcclxuICB9KTtcclxuXHJcbiAgaWYgKGFjdGl2ZSkge1xyXG4gICAgZm9jdXNUcmFwLmVuYWJsZSgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmb2N1c1RyYXAucmVsZWFzZSgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY2xvc2VCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcclxuICBjb25zdCBtZW51QnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKE9QRU5FUlMpO1xyXG5cclxuICBpZiAoYWN0aXZlICYmIGNsb3NlQnV0dG9uKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBhY3RpdmF0ZWQsIHNvIGZvY3VzIG9uIHRoZSBjbG9zZSBidXR0b24sXHJcbiAgICAvLyB3aGljaCBpcyBqdXN0IGJlZm9yZSBhbGwgdGhlIG5hdiBlbGVtZW50cyBpbiB0aGUgdGFiIG9yZGVyLlxyXG4gICAgY2xvc2VCdXR0b24uZm9jdXMoKTtcclxuICB9IGVsc2UgaWYgKCFhY3RpdmUgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gY2xvc2VCdXR0b24gJiZcclxuICAgICAgICAgICAgIG1lbnVCdXR0b24pIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGRlYWN0aXZhdGVkLCBhbmQgZm9jdXMgd2FzIG9uIHRoZSBjbG9zZVxyXG4gICAgLy8gYnV0dG9uLCB3aGljaCBpcyBubyBsb25nZXIgdmlzaWJsZS4gV2UgZG9uJ3Qgd2FudCB0aGUgZm9jdXMgdG9cclxuICAgIC8vIGRpc2FwcGVhciBpbnRvIHRoZSB2b2lkLCBzbyBmb2N1cyBvbiB0aGUgbWVudSBidXR0b24gaWYgaXQnc1xyXG4gICAgLy8gdmlzaWJsZSAodGhpcyBtYXkgaGF2ZSBiZWVuIHdoYXQgdGhlIHVzZXIgd2FzIGp1c3QgZm9jdXNlZCBvbixcclxuICAgIC8vIGlmIHRoZXkgdHJpZ2dlcmVkIHRoZSBtb2JpbGUgbmF2IGJ5IG1pc3Rha2UpLlxyXG4gICAgbWVudUJ1dHRvbi5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFjdGl2ZTtcclxufTtcclxuXHJcbmNvbnN0IHJlc2l6ZSA9ICgpID0+IHtcclxuICBjb25zdCBjbG9zZXIgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcclxuXHJcbiAgaWYgKGlzQWN0aXZlKCkgJiYgY2xvc2VyICYmIGNsb3Nlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCA9PT0gMCkge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgaXMgYWN0aXZlLCBidXQgdGhlIGNsb3NlIGJveCBpc24ndCB2aXNpYmxlLCB3aGljaFxyXG4gICAgLy8gbWVhbnMgdGhlIHVzZXIncyB2aWV3cG9ydCBoYXMgYmVlbiByZXNpemVkIHNvIHRoYXQgaXQgaXMgbm8gbG9uZ2VyXHJcbiAgICAvLyBpbiBtb2JpbGUgbW9kZS4gTGV0J3MgbWFrZSB0aGUgcGFnZSBzdGF0ZSBjb25zaXN0ZW50IGJ5XHJcbiAgICAvLyBkZWFjdGl2YXRpbmcgdGhlIG1vYmlsZSBuYXYuXHJcbiAgICB0b2dnbGVOYXYuY2FsbChjbG9zZXIsIGZhbHNlKTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBuYXZpZ2F0aW9uID0gYmVoYXZpb3Ioe1xyXG4gIFsgQ0xJQ0sgXToge1xyXG4gICAgWyBPUEVORVJTIF06IHRvZ2dsZU5hdixcclxuICAgIFsgQ0xPU0VSUyBdOiB0b2dnbGVOYXYsXHJcbiAgICBbIE5BVl9MSU5LUyBdOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIEEgbmF2aWdhdGlvbiBsaW5rIGhhcyBiZWVuIGNsaWNrZWQhIFdlIHdhbnQgdG8gY29sbGFwc2UgYW55XHJcbiAgICAgIC8vIGhpZXJhcmNoaWNhbCBuYXZpZ2F0aW9uIFVJIGl0J3MgYSBwYXJ0IG9mLCBzbyB0aGF0IHRoZSB1c2VyXHJcbiAgICAgIC8vIGNhbiBmb2N1cyBvbiB3aGF0ZXZlciB0aGV5J3ZlIGp1c3Qgc2VsZWN0ZWQuXHJcblxyXG4gICAgICAvLyBTb21lIG5hdmlnYXRpb24gbGlua3MgYXJlIGluc2lkZSBhY2NvcmRpb25zOyB3aGVuIHRoZXkncmVcclxuICAgICAgLy8gY2xpY2tlZCwgd2Ugd2FudCB0byBjb2xsYXBzZSB0aG9zZSBhY2NvcmRpb25zLlxyXG4gICAgICBjb25zdCBhY2MgPSB0aGlzLmNsb3Nlc3QoYWNjb3JkaW9uLkFDQ09SRElPTik7XHJcbiAgICAgIGlmIChhY2MpIHtcclxuICAgICAgICBhY2NvcmRpb24uZ2V0QnV0dG9ucyhhY2MpLmZvckVhY2goYnRuID0+IGFjY29yZGlvbi5oaWRlKGJ0bikpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJZiB0aGUgbW9iaWxlIG5hdmlnYXRpb24gbWVudSBpcyBhY3RpdmUsIHdlIHdhbnQgdG8gaGlkZSBpdC5cclxuICAgICAgaWYgKGlzQWN0aXZlKCkpIHtcclxuICAgICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxufSwge1xyXG4gIGluaXQgKCkge1xyXG4gICAgY29uc3QgdHJhcENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoTkFWKTtcclxuXHJcbiAgICBpZiAodHJhcENvbnRhaW5lcikge1xyXG4gICAgICBmb2N1c1RyYXAgPSBfZm9jdXNUcmFwKHRyYXBDb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZSgpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSwgZmFsc2UpO1xyXG4gIH0sXHJcbiAgdGVhcmRvd24gKCkge1xyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSwgZmFsc2UpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFRPRE8gZm9yIDIuMCwgcmVtb3ZlIHRoaXMgc3RhdGVtZW50IGFuZCBleHBvcnQgYG5hdmlnYXRpb25gIGRpcmVjdGx5OlxyXG4gKlxyXG4gKiBtb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHsuLi59KTtcclxuICovXHJcbmNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ24oXHJcbiAgZWwgPT4gbmF2aWdhdGlvbi5vbihlbCksXHJcbiAgbmF2aWdhdGlvblxyXG4pOyIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xyXG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuY29uc3QgY2xvc2VzdCA9IHJlcXVpcmUoJy4uL3V0aWxzL2Nsb3Nlc3QnKTtcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuXHJcblxyXG5jbGFzcyByYWRpb1RvZ2dsZUdyb3Vwe1xyXG4gICAgY29uc3RydWN0b3IoZWwpe1xyXG4gICAgICAgIHRoaXMuanNUb2dnbGVUcmlnZ2VyID0gXCIuanMtcmFkaW8tdG9nZ2xlLWdyb3VwXCI7XHJcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRhcmdldCA9IFwiZGF0YS1qcy10YXJnZXRcIjtcclxuXHJcbiAgICAgICAgdGhpcy5yYWRpb0VscyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdChlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChlbCl7XHJcbiAgICAgICAgdGhpcy5yYWRpb0dyb3VwID0gZWw7XHJcbiAgICAgICAgdGhpcy5yYWRpb0VscyA9IHNlbGVjdChcImlucHV0W3R5cGU9J3JhZGlvJ11cIiwgdGhpcy5yYWRpb0dyb3VwKTtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZvckVhY2godGhpcy5yYWRpb0VscywgcmFkaW8gPT4ge1xyXG4gICAgICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgICAgIGZvckVhY2godGhhdC5yYWRpb0VscywgcmFkaW8gPT4geyBcclxuICAgICAgICAgICAgICAgICAgICB0aGF0LnRvZ2dsZShyYWRpbyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZShyYWRpbyk7IC8vSW5pdGlhbCB2YWx1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlKHRyaWdnZXJFbCl7XHJcbiAgICAgICAgdmFyIHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNUb2dnbGVUYXJnZXQpXHJcbiAgICAgICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0RWwgPSBzZWxlY3QodGFyZ2V0QXR0ciwgJ2JvZHknKTtcclxuICAgICAgICAgICAgaWYodGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgIGlmKHRyaWdnZXJFbC5jaGVja2VkKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbFswXSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKHRyaWdnZXJFbCwgdGFyZ2V0RWxbMF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbCl7XHJcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcInRydWVcIik7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJjb2xsYXBzZWRcIik7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwiZmFsc2VcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCl7XHJcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKFwiY29sbGFwc2VkXCIpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJhZGlvVG9nZ2xlR3JvdXA7IiwiLypcclxuKiBQcmV2ZW50cyB0aGUgdXNlciBmcm9tIGlucHV0dGluZyBiYXNlZCBvbiBhIHJlZ2V4LlxyXG4qIERvZXMgbm90IHdvcmsgdGhlIHNhbWUgd2F5IGFmIDxpbnB1dCBwYXR0ZXJuPVwiXCI+LCB0aGlzIHBhdHRlcm4gaXMgb25seSB1c2VkIGZvciB2YWxpZGF0aW9uLCBub3QgdG8gcHJldmVudCBpbnB1dC5cclxuKiBVc2VjYXNlOiBudW1iZXIgaW5wdXQgZm9yIGRhdGUtY29tcG9uZW50LlxyXG4qIEV4YW1wbGUgLSBudW1iZXIgb25seTogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1pbnB1dC1yZWdleD1cIl5cXGQqJFwiPlxyXG4qL1xyXG4ndXNlIHN0cmljdCc7XHJcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZSgnLi4vdXRpbHMvYmVoYXZpb3InKTtcclxuXHJcbmNvbnN0IG1vZGlmaWVyU3RhdGUgPSB7XHJcbiAgc2hpZnQ6IGZhbHNlLFxyXG4gIGFsdDogZmFsc2UsXHJcbiAgY3RybDogZmFsc2UsXHJcbiAgY29tbWFuZDogZmFsc2VcclxufTtcclxuXHJcbmZ1bmN0aW9uIGlucHV0UmVnZXhNYXNrIChldmVudCkge1xyXG4gIGlmKG1vZGlmaWVyU3RhdGUuY3RybCB8fCBtb2RpZmllclN0YXRlLmNvbW1hbmQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIG5ld0NoYXIgPSBudWxsO1xyXG4gIGlmKHR5cGVvZiBldmVudC5rZXkgIT09ICd1bmRlZmluZWQnKXtcclxuICAgIGlmKGV2ZW50LmtleS5sZW5ndGggPT09IDEpe1xyXG4gICAgICBuZXdDaGFyID0gZXZlbnQua2V5O1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZighZXZlbnQuY2hhckNvZGUpe1xyXG4gICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5rZXlDb2RlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmNoYXJDb2RlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciByZWdleFN0ciA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWlucHV0LXJlZ2V4Jyk7XHJcblxyXG4gIGlmKGV2ZW50LnR5cGUgIT09IHVuZGVmaW5lZCAmJiBldmVudC50eXBlID09PSAncGFzdGUnKXtcclxuICAgIGNvbnNvbGUubG9nKCdwYXN0ZScpO1xyXG4gIH0gZWxzZXtcclxuICAgIHZhciBlbGVtZW50ID0gbnVsbDtcclxuICAgIGlmKGV2ZW50LnRhcmdldCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcclxuICAgIH1cclxuICAgIGlmKG5ld0NoYXIgIT09IG51bGwgJiYgZWxlbWVudCAhPT0gbnVsbCkge1xyXG4gICAgICBpZihuZXdDaGFyLmxlbmd0aCA+IDApe1xyXG4gICAgICAgIGxldCBuZXdWYWx1ZSA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgaWYoZWxlbWVudC50eXBlID09PSAnbnVtYmVyJyl7XHJcbiAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMudmFsdWU7Ly9Ob3RlIGlucHV0W3R5cGU9bnVtYmVyXSBkb2VzIG5vdCBoYXZlIC5zZWxlY3Rpb25TdGFydC9FbmQgKENocm9tZSkuXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMudmFsdWUuc2xpY2UoMCwgZWxlbWVudC5zZWxlY3Rpb25TdGFydCkgKyB0aGlzLnZhbHVlLnNsaWNlKGVsZW1lbnQuc2VsZWN0aW9uRW5kKSArIG5ld0NoYXI7IC8vcmVtb3ZlcyB0aGUgbnVtYmVycyBzZWxlY3RlZCBieSB0aGUgdXNlciwgdGhlbiBhZGRzIG5ldyBjaGFyLlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHIgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyKTtcclxuICAgICAgICBpZihyLmV4ZWMobmV3VmFsdWUpID09PSBudWxsKXtcclxuICAgICAgICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3Ioe1xyXG4gICdrZXlwcmVzcyBwYXN0ZSc6IHtcclxuICAgICdpbnB1dFtkYXRhLWlucHV0LXJlZ2V4XTpmb2N1cyc6IGlucHV0UmVnZXhNYXNrLFxyXG4gIH1cclxufSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xyXG5jb25zdCBvbmNlID0gcmVxdWlyZSgncmVjZXB0b3Ivb25jZScpO1xyXG5cclxuY29uc3QgQ0xJQ0sgPSByZXF1aXJlKCcuLi9ldmVudHMnKS5DTElDSztcclxuY29uc3QgUFJFRklYID0gcmVxdWlyZSgnLi4vY29uZmlnJykucHJlZml4O1xyXG5jb25zdCBMSU5LID0gYC4ke1BSRUZJWH1za2lwbmF2W2hyZWZePVwiI1wiXWA7XHJcblxyXG5jb25zdCBzZXRUYWJpbmRleCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIC8vIE5COiB3ZSBrbm93IGJlY2F1c2Ugb2YgdGhlIHNlbGVjdG9yIHdlJ3JlIGRlbGVnYXRpbmcgdG8gYmVsb3cgdGhhdCB0aGVcclxuICAvLyBocmVmIGFscmVhZHkgYmVnaW5zIHdpdGggJyMnXHJcbiAgY29uc3QgaWQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnaHJlZicpLnNsaWNlKDEpO1xyXG4gIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICBpZiAodGFyZ2V0KSB7XHJcbiAgICB0YXJnZXQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xyXG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvbmNlKGV2ZW50ID0+IHtcclxuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSk7XHJcbiAgICB9KSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIHRocm93IGFuIGVycm9yP1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3Ioe1xyXG4gIFsgQ0xJQ0sgXToge1xyXG4gICAgWyBMSU5LIF06IHNldFRhYmluZGV4LFxyXG4gIH0sXHJcbn0pO1xyXG4iLCJjb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuY29uc3QgZG9tcmVhZHkgPSByZXF1aXJlKCdkb21yZWFkeScpO1xyXG5jb25zdCBmb3JFYWNoID0gcmVxdWlyZSgnYXJyYXktZm9yZWFjaCcpO1xyXG5cclxuZG9tcmVhZHkoKCkgPT4ge1xyXG5cdG5ldyBSZXNwb25zaXZlVGFibGVzKCk7IFxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzcG9uc2l2ZVRhYmxlcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBjb25zdCBhbGxUYWJsZXMgPSBzZWxlY3QoJ3RhYmxlOm5vdCguZGF0YVRhYmxlKScpO1xyXG4gICAgICAgIGZvckVhY2goYWxsVGFibGVzLCB0YWJsZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzKHRhYmxlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgZGF0YSBhdHRyaWJ1dGVzIG5lZWRlZCBmb3IgcmVzcG9uc2l2ZSBtb2RlLlxyXG4gICAgaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzKHRhYmxlRWwpe1xyXG4gICAgICAgIGlmICghdGFibGVFbCkgcmV0dXJuXHJcblxyXG4gICAgICAgIGNvbnN0IGhlYWRlckNlbGxFbHMgPSAgc2VsZWN0KCd0aGVhZCB0aCwgdGhlYWQgdGQnLCB0YWJsZUVsKTtcclxuXHJcbiAgICAgICAgLy9jb25zdCBoZWFkZXJDZWxsRWxzID0gc2VsZWN0KGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RoZWFkIHRoLCB0aGVhZCB0ZCcpO1xyXG4gICAgXHJcbiAgICAgICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHlSb3dFbHMgPSBzZWxlY3QoJ3Rib2R5IHRyJywgdGFibGVFbCk7XHJcbiAgICAgICAgICAgIEFycmF5LmZyb20oYm9keVJvd0VscykuZm9yRWFjaChyb3dFbCA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2VsbEVscyA9IHJvd0VsLmNoaWxkcmVuXHJcbiAgICAgICAgICAgICAgICBpZiAoY2VsbEVscy5sZW5ndGggPT09IGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShoZWFkZXJDZWxsRWxzKS5mb3JFYWNoKChoZWFkZXJDZWxsRWwsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR3JhYiBoZWFkZXIgY2VsbCB0ZXh0IGFuZCB1c2UgaXQgYm9keSBjZWxsIGRhdGEgdGl0bGUuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxFbHNbaV0uc2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJywgaGVhZGVyQ2VsbEVsLnRleHRDb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbmNvbnN0IGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcbi8vSW1wb3J0IHRpcHB5LmpzIChodHRwczovL2F0b21pa3MuZ2l0aHViLmlvL3RpcHB5anMvKVxyXG5jb25zdCB0aXBweSA9IHJlcXVpcmUoJy4uLy4uL3ZlbmRvci90aXBweWpzL3RpcHB5LmpzJyk7XHJcblxyXG52YXIgaW5pdFRpcHB5ID0gZnVuY3Rpb24gKCl7XHJcbiAgICAvL2luaXQgdG9vbHRpcCBvbiBlbGVtZW50cyB3aXRoIHRoZSAuanMtdG9vbHRpcCBjbGFzc1xyXG4gICAgdGlwcHkoJy5qcy10b29sdGlwJywgeyBcclxuICAgICAgICBkdXJhdGlvbjogMCxcclxuICAgICAgICBhcnJvdzogdHJ1ZVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5kb21yZWFkeSgoKSA9PiB7XHJcbiAgICBpbml0VGlwcHkoKTtcclxufSk7XHJcblxyXG5cclxuXHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHByZWZpeDogJycsXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKTtcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuL3V0aWxzL3NlbGVjdCcpO1xuY29uc3QgbW9kYWwgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvbW9kYWwnKTtcbmNvbnN0IHRhYmxlID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3RhYmxlJyk7XG5jb25zdCB0b29sdGlwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3Rvb2x0aXAnKTtcbmNvbnN0IGRyb3Bkb3duID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Ryb3Bkb3duJyk7XG5jb25zdCByYWRpb1RvZ2dsZUNvbnRlbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcmFkaW8tdG9nZ2xlLWNvbnRlbnQnKTtcbmNvbnN0IGNoZWNrYm94VG9nZ2xlQ29udGVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudCcpO1xuXG5cbi8qKlxuICogVGhlICdwb2x5ZmlsbHMnIGRlZmluZSBrZXkgRUNNQVNjcmlwdCA1IG1ldGhvZHMgdGhhdCBtYXkgYmUgbWlzc2luZyBmcm9tXG4gKiBvbGRlciBicm93c2Vycywgc28gbXVzdCBiZSBsb2FkZWQgZmlyc3QuXG4gKi9cbnJlcXVpcmUoJy4vcG9seWZpbGxzJyk7XG5cbmNvbnN0IGRrZmRzID0gcmVxdWlyZSgnLi9jb25maWcnKTtcblxuY29uc3QgY29tcG9uZW50cyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cycpO1xuZGtmZHMuY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG5cbmRvbXJlYWR5KCgpID0+IHtcbiAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuYm9keTtcbiAgZm9yIChsZXQgbmFtZSBpbiBjb21wb25lbnRzKSB7XG4gICAgY29uc3QgYmVoYXZpb3IgPSBjb21wb25lbnRzWyBuYW1lIF07XG4gICAgYmVoYXZpb3Iub24odGFyZ2V0KTtcbiAgfVxuXG4gIGNvbnN0IGpzU2VsZWN0b3JEcm9wZG93biA9ICcuanMtZHJvcGRvd24nO1xuICBmb3JFYWNoKHNlbGVjdChqc1NlbGVjdG9yRHJvcGRvd24pLCBkcm9wZG93bkVsZW1lbnQgPT4ge1xuICAgIG5ldyBkcm9wZG93bihkcm9wZG93bkVsZW1lbnQpO1xuICB9KTtcblxuICBjb25zdCBqc1JhZGlvVG9nZ2xlR3JvdXAgPSAnLmpzLXJhZGlvLXRvZ2dsZS1ncm91cCc7XG4gIGZvckVhY2goc2VsZWN0KGpzUmFkaW9Ub2dnbGVHcm91cCksIHRvZ2dsZUVsZW1lbnQgPT4ge1xuICAgIG5ldyByYWRpb1RvZ2dsZUNvbnRlbnQodG9nZ2xlRWxlbWVudCk7XG4gIH0pO1xuXG4gIGNvbnN0IGpzQ2hlY2tib3hUb2dnbGVDb250ZW50ID0gJy5qcy1jaGVja2JveC10b2dnbGUtY29udGVudCc7XG4gIGZvckVhY2goc2VsZWN0KGpzQ2hlY2tib3hUb2dnbGVDb250ZW50KSwgdG9nZ2xlRWxlbWVudCA9PiB7XG4gICAgbmV3IGNoZWNrYm94VG9nZ2xlQ29udGVudCh0b2dnbGVFbGVtZW50KTtcbiAgfSk7XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRrZmRzO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgLy8gVGhpcyB1c2VkIHRvIGJlIGNvbmRpdGlvbmFsbHkgZGVwZW5kZW50IG9uIHdoZXRoZXIgdGhlXHJcbiAgLy8gYnJvd3NlciBzdXBwb3J0ZWQgdG91Y2ggZXZlbnRzOyBpZiBpdCBkaWQsIGBDTElDS2Agd2FzIHNldCB0b1xyXG4gIC8vIGB0b3VjaHN0YXJ0YC4gIEhvd2V2ZXIsIHRoaXMgaGFkIGRvd25zaWRlczpcclxuICAvL1xyXG4gIC8vICogSXQgcHJlLWVtcHRlZCBtb2JpbGUgYnJvd3NlcnMnIGRlZmF1bHQgYmVoYXZpb3Igb2YgZGV0ZWN0aW5nXHJcbiAgLy8gICB3aGV0aGVyIGEgdG91Y2ggdHVybmVkIGludG8gYSBzY3JvbGwsIHRoZXJlYnkgcHJldmVudGluZ1xyXG4gIC8vICAgdXNlcnMgZnJvbSB1c2luZyBzb21lIG9mIG91ciBjb21wb25lbnRzIGFzIHNjcm9sbCBzdXJmYWNlcy5cclxuICAvL1xyXG4gIC8vICogU29tZSBkZXZpY2VzLCBzdWNoIGFzIHRoZSBNaWNyb3NvZnQgU3VyZmFjZSBQcm8sIHN1cHBvcnQgKmJvdGgqXHJcbiAgLy8gICB0b3VjaCBhbmQgY2xpY2tzLiBUaGlzIG1lYW50IHRoZSBjb25kaXRpb25hbCBlZmZlY3RpdmVseSBkcm9wcGVkXHJcbiAgLy8gICBzdXBwb3J0IGZvciB0aGUgdXNlcidzIG1vdXNlLCBmcnVzdHJhdGluZyB1c2VycyB3aG8gcHJlZmVycmVkXHJcbiAgLy8gICBpdCBvbiB0aG9zZSBzeXN0ZW1zLlxyXG4gIENMSUNLOiAnY2xpY2snLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGVscHJvdG8gPSB3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlO1xyXG5jb25zdCBISURERU4gPSAnaGlkZGVuJztcclxuXHJcbmlmICghKEhJRERFTiBpbiBlbHByb3RvKSkge1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbHByb3RvLCBISURERU4sIHtcclxuICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgIH0sXHJcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShISURERU4sICcnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShISURERU4pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0pO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jbGFzc0xpc3QgYW5kIERPTVRva2VuTGlzdFxyXG5yZXF1aXJlKCdjbGFzc2xpc3QtcG9seWZpbGwnKTtcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5oaWRkZW5cclxucmVxdWlyZSgnLi9lbGVtZW50LWhpZGRlbicpO1xyXG5cclxucmVxdWlyZSgnY29yZS1qcy9mbi9vYmplY3QvYXNzaWduJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vYXJyYXkvZnJvbScpOyIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xyXG5jb25zdCBmb3JFYWNoID0gcmVxdWlyZSgnYXJyYXktZm9yZWFjaCcpO1xyXG5jb25zdCBCZWhhdmlvciA9IHJlcXVpcmUoJ3JlY2VwdG9yL2JlaGF2aW9yJyk7XHJcblxyXG5jb25zdCBzZXF1ZW5jZSA9IGZ1bmN0aW9uICgpIHtcclxuICBjb25zdCBzZXEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgIGlmICghdGFyZ2V0KSB7XHJcbiAgICAgIHRhcmdldCA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICB9XHJcbiAgICBmb3JFYWNoKHNlcSwgbWV0aG9kID0+IHtcclxuICAgICAgaWYgKHR5cGVvZiB0aGlzWyBtZXRob2QgXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHRoaXNbIG1ldGhvZCBdLmNhbGwodGhpcywgdGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBiZWhhdmlvclxyXG4gKiBAcGFyYW0ge29iamVjdH0gZXZlbnRzXHJcbiAqIEBwYXJhbSB7b2JqZWN0P30gcHJvcHNcclxuICogQHJldHVybiB7cmVjZXB0b3IuYmVoYXZpb3J9XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IChldmVudHMsIHByb3BzKSA9PiB7XHJcbiAgcmV0dXJuIEJlaGF2aW9yKGV2ZW50cywgYXNzaWduKHtcclxuICAgIG9uOiAgIHNlcXVlbmNlKCdpbml0JywgJ2FkZCcpLFxyXG4gICAgb2ZmOiAgc2VxdWVuY2UoJ3RlYXJkb3duJywgJ3JlbW92ZScpLFxyXG4gIH0sIHByb3BzKSk7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBjbG9zZXN0XHJcbiAqIEBkZXNjIGdldCBuZWFyZXN0IHBhcmVudCBlbGVtZW50IG1hdGNoaW5nIHNlbGVjdG9yLlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBIVE1MIGVsZW1lbnQgd2hlcmUgdGhlIHNlYXJjaCBzdGFydHMuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciAtIFNlbGVjdG9yIHRvIGJlIGZvdW5kLlxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gLSBOZWFyZXN0IHBhcmVudCBlbGVtZW50IG1hdGNoaW5nIHNlbGVjdG9yLlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbG9zZXN0IChlbCwgc2VsZWN0b3IpIHtcclxuICB2YXIgbWF0Y2hlc1NlbGVjdG9yID0gZWwubWF0Y2hlcyB8fCBlbC53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgZWwubW96TWF0Y2hlc1NlbGVjdG9yIHx8IGVsLm1zTWF0Y2hlc1NlbGVjdG9yO1xyXG5cclxuICB3aGlsZSAoZWwpIHtcclxuICAgICAgaWYgKG1hdGNoZXNTZWxlY3Rvci5jYWxsKGVsLCBzZWxlY3RvcikpIHtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcclxuICB9XHJcbiAgcmV0dXJuIGVsO1xyXG59O1xyXG4iLCIvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzU1NzQzM1xyXG5mdW5jdGlvbiBpc0VsZW1lbnRJblZpZXdwb3J0IChlbCwgd2luPXdpbmRvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jRWw9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcbiAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIHJlY3QudG9wID49IDAgJiZcclxuICAgIHJlY3QubGVmdCA+PSAwICYmXHJcbiAgICByZWN0LmJvdHRvbSA8PSAod2luLmlubmVySGVpZ2h0IHx8IGRvY0VsLmNsaWVudEhlaWdodCkgJiZcclxuICAgIHJlY3QucmlnaHQgPD0gKHdpbi5pbm5lcldpZHRoIHx8IGRvY0VsLmNsaWVudFdpZHRoKVxyXG4gICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaXNFbGVtZW50SW5WaWV3cG9ydDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIGlzRWxlbWVudFxyXG4gKiBAZGVzYyByZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIERPTSBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcclxuICogQHJldHVybiB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRWxlbWVudCA9IHZhbHVlID0+IHtcclxuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5ub2RlVHlwZSA9PT0gMTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBzZWxlY3RcclxuICogQGRlc2Mgc2VsZWN0cyBlbGVtZW50cyBmcm9tIHRoZSBET00gYnkgY2xhc3Mgc2VsZWN0b3Igb3IgSUQgc2VsZWN0b3IuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciAtIFRoZSBzZWxlY3RvciB0byB0cmF2ZXJzZSB0aGUgRE9NIHdpdGguXHJcbiAqIEBwYXJhbSB7RG9jdW1lbnR8SFRNTEVsZW1lbnQ/fSBjb250ZXh0IC0gVGhlIGNvbnRleHQgdG8gdHJhdmVyc2UgdGhlIERPTVxyXG4gKiAgIGluLiBJZiBub3QgcHJvdmlkZWQsIGl0IGRlZmF1bHRzIHRvIHRoZSBkb2N1bWVudC5cclxuICogQHJldHVybiB7SFRNTEVsZW1lbnRbXX0gLSBBbiBhcnJheSBvZiBET00gbm9kZXMgb3IgYW4gZW1wdHkgYXJyYXkuXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlbGVjdCAoc2VsZWN0b3IsIGNvbnRleHQpIHtcclxuXHJcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciAhPT0gJ3N0cmluZycpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIGlmICghY29udGV4dCB8fCAhaXNFbGVtZW50KGNvbnRleHQpKSB7XHJcbiAgICBjb250ZXh0ID0gd2luZG93LmRvY3VtZW50O1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgc2VsZWN0aW9uID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc2VsZWN0aW9uKTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcclxuY29uc3QgQ09OVFJPTFMgPSAnYXJpYS1jb250cm9scyc7XHJcbmNvbnN0IEhJRERFTiA9ICdhcmlhLWhpZGRlbic7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IChidXR0b24sIGV4cGFuZGVkKSA9PiB7XHJcblxyXG4gIGlmICh0eXBlb2YgZXhwYW5kZWQgIT09ICdib29sZWFuJykge1xyXG4gICAgZXhwYW5kZWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ2ZhbHNlJztcclxuICB9XHJcbiAgYnV0dG9uLnNldEF0dHJpYnV0ZShFWFBBTkRFRCwgZXhwYW5kZWQpO1xyXG5cclxuICBjb25zdCBpZCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoQ09OVFJPTFMpO1xyXG4gIGNvbnN0IGNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gIGlmICghY29udHJvbHMpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgJ05vIHRvZ2dsZSB0YXJnZXQgZm91bmQgd2l0aCBpZDogXCInICsgaWQgKyAnXCInXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29udHJvbHMuc2V0QXR0cmlidXRlKEhJRERFTiwgIWV4cGFuZGVkKTtcclxuICByZXR1cm4gZXhwYW5kZWQ7XHJcbn07XHJcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XHJcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxyXG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XHJcblx0KGdsb2JhbC5NaWNyb01vZGFsID0gZmFjdG9yeSgpKTtcclxufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdmVyc2lvbiA9IFwiMC4zLjFcIjtcclxuXHJcbnZhciBjbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcclxuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcclxuICB9XHJcbn07XHJcblxyXG52YXIgY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XHJcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcclxuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xyXG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xyXG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcclxuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xyXG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xyXG4gIH07XHJcbn0oKTtcclxuXHJcbnZhciB0b0NvbnN1bWFibGVBcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcclxuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xyXG5cclxuICAgIHJldHVybiBhcnIyO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhcnIpO1xyXG4gIH1cclxufTtcclxuXHJcbnZhciBNaWNyb01vZGFsID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICB2YXIgRk9DVVNBQkxFX0VMRU1FTlRTID0gWydhW2hyZWZdJywgJ2FyZWFbaHJlZl0nLCAnaW5wdXQ6bm90KFtkaXNhYmxlZF0pOm5vdChbdHlwZT1cImhpZGRlblwiXSk6bm90KFthcmlhLWhpZGRlbl0pJywgJ3NlbGVjdDpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbl0pJywgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuXSknLCAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuXSknLCAnaWZyYW1lJywgJ29iamVjdCcsICdlbWJlZCcsICdbY29udGVudGVkaXRhYmxlXScsICdbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXhePVwiLVwiXSknXTtcclxuXHJcbiAgdmFyIE1vZGFsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTW9kYWwoX3JlZikge1xyXG4gICAgICB2YXIgdGFyZ2V0TW9kYWwgPSBfcmVmLnRhcmdldE1vZGFsLFxyXG4gICAgICAgICAgX3JlZiR0cmlnZ2VycyA9IF9yZWYudHJpZ2dlcnMsXHJcbiAgICAgICAgICB0cmlnZ2VycyA9IF9yZWYkdHJpZ2dlcnMgPT09IHVuZGVmaW5lZCA/IFtdIDogX3JlZiR0cmlnZ2VycyxcclxuICAgICAgICAgIF9yZWYkb25TaG93ID0gX3JlZi5vblNob3csXHJcbiAgICAgICAgICBvblNob3cgPSBfcmVmJG9uU2hvdyA9PT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKCkge30gOiBfcmVmJG9uU2hvdyxcclxuICAgICAgICAgIF9yZWYkb25DbG9zZSA9IF9yZWYub25DbG9zZSxcclxuICAgICAgICAgIG9uQ2xvc2UgPSBfcmVmJG9uQ2xvc2UgPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uICgpIHt9IDogX3JlZiRvbkNsb3NlLFxyXG4gICAgICAgICAgX3JlZiRvcGVuVHJpZ2dlciA9IF9yZWYub3BlblRyaWdnZXIsXHJcbiAgICAgICAgICBvcGVuVHJpZ2dlciA9IF9yZWYkb3BlblRyaWdnZXIgPT09IHVuZGVmaW5lZCA/ICdkYXRhLW1pY3JvbW9kYWwtdHJpZ2dlcicgOiBfcmVmJG9wZW5UcmlnZ2VyLFxyXG4gICAgICAgICAgX3JlZiRjbG9zZVRyaWdnZXIgPSBfcmVmLmNsb3NlVHJpZ2dlcixcclxuICAgICAgICAgIGNsb3NlVHJpZ2dlciA9IF9yZWYkY2xvc2VUcmlnZ2VyID09PSB1bmRlZmluZWQgPyAnZGF0YS1taWNyb21vZGFsLWNsb3NlJyA6IF9yZWYkY2xvc2VUcmlnZ2VyLFxyXG4gICAgICAgICAgX3JlZiRkaXNhYmxlU2Nyb2xsID0gX3JlZi5kaXNhYmxlU2Nyb2xsLFxyXG4gICAgICAgICAgZGlzYWJsZVNjcm9sbCA9IF9yZWYkZGlzYWJsZVNjcm9sbCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJGRpc2FibGVTY3JvbGwsXHJcbiAgICAgICAgICBfcmVmJGRpc2FibGVGb2N1cyA9IF9yZWYuZGlzYWJsZUZvY3VzLFxyXG4gICAgICAgICAgZGlzYWJsZUZvY3VzID0gX3JlZiRkaXNhYmxlRm9jdXMgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRkaXNhYmxlRm9jdXMsXHJcbiAgICAgICAgICBfcmVmJGF3YWl0Q2xvc2VBbmltYXQgPSBfcmVmLmF3YWl0Q2xvc2VBbmltYXRpb24sXHJcbiAgICAgICAgICBhd2FpdENsb3NlQW5pbWF0aW9uID0gX3JlZiRhd2FpdENsb3NlQW5pbWF0ID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9yZWYkYXdhaXRDbG9zZUFuaW1hdCxcclxuICAgICAgICAgIF9yZWYkZGVidWdNb2RlID0gX3JlZi5kZWJ1Z01vZGUsXHJcbiAgICAgICAgICBkZWJ1Z01vZGUgPSBfcmVmJGRlYnVnTW9kZSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJGRlYnVnTW9kZTtcclxuICAgICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgTW9kYWwpO1xyXG5cclxuICAgICAgLy8gU2F2ZSBhIHJlZmVyZW5jZSBvZiB0aGUgbW9kYWxcclxuICAgICAgdGhpcy5tb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldE1vZGFsKTtcclxuXHJcbiAgICAgIC8vIFNhdmUgYSByZWZlcmVuY2UgdG8gdGhlIHBhc3NlZCBjb25maWdcclxuICAgICAgdGhpcy5jb25maWcgPSB7IGRlYnVnTW9kZTogZGVidWdNb2RlLCBkaXNhYmxlU2Nyb2xsOiBkaXNhYmxlU2Nyb2xsLCBvcGVuVHJpZ2dlcjogb3BlblRyaWdnZXIsIGNsb3NlVHJpZ2dlcjogY2xvc2VUcmlnZ2VyLCBvblNob3c6IG9uU2hvdywgb25DbG9zZTogb25DbG9zZSwgYXdhaXRDbG9zZUFuaW1hdGlvbjogYXdhaXRDbG9zZUFuaW1hdGlvbiwgZGlzYWJsZUZvY3VzOiBkaXNhYmxlRm9jdXNcclxuXHJcbiAgICAgICAgLy8gUmVnaXN0ZXIgY2xpY2sgZXZlbnRzIG9ubHkgaWYgcHJlYmluZGluZyBldmVudExpc3RlbmVyc1xyXG4gICAgICB9O2lmICh0cmlnZ2Vycy5sZW5ndGggPiAwKSB0aGlzLnJlZ2lzdGVyVHJpZ2dlcnMuYXBwbHkodGhpcywgdG9Db25zdW1hYmxlQXJyYXkodHJpZ2dlcnMpKTtcclxuXHJcbiAgICAgIC8vIHByZWJpbmQgZnVuY3Rpb25zIGZvciBldmVudCBsaXN0ZW5lcnNcclxuICAgICAgdGhpcy5vbkNsaWNrID0gdGhpcy5vbkNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICAgIHRoaXMub25LZXlkb3duID0gdGhpcy5vbktleWRvd24uYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExvb3BzIHRocm91Z2ggYWxsIG9wZW5UcmlnZ2VycyBhbmQgYmluZHMgY2xpY2sgZXZlbnRcclxuICAgICAqIEBwYXJhbSAge2FycmF5fSB0cmlnZ2VycyBbQXJyYXkgb2Ygbm9kZSBlbGVtZW50c11cclxuICAgICAqIEByZXR1cm4ge3ZvaWR9XHJcbiAgICAgKi9cclxuXHJcblxyXG4gICAgY3JlYXRlQ2xhc3MoTW9kYWwsIFt7XHJcbiAgICAgIGtleTogJ3JlZ2lzdGVyVHJpZ2dlcnMnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVnaXN0ZXJUcmlnZ2VycygpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgdHJpZ2dlcnMgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcclxuICAgICAgICAgIHRyaWdnZXJzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJpZ2dlcnMuZm9yRWFjaChmdW5jdGlvbiAodHJpZ2dlcikge1xyXG4gICAgICAgICAgdHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF90aGlzLnNob3dNb2RhbCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnc2hvd01vZGFsJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNob3dNb2RhbCgpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZUVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICAgIHRoaXMubW9kYWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgIHRoaXMubW9kYWwuY2xhc3NMaXN0LmFkZCgnaXMtb3BlbicpO1xyXG4gICAgICAgIHRoaXMuc2V0Rm9jdXNUb0ZpcnN0Tm9kZSgpO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsQmVoYXZpb3VyKCdkaXNhYmxlJyk7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycygpO1xyXG4gICAgICAgIHRoaXMuY29uZmlnLm9uU2hvdyh0aGlzLm1vZGFsKTtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICdjbG9zZU1vZGFsJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNsb3NlTW9kYWwoKSB7XHJcbiAgICAgICAgdmFyIG1vZGFsID0gdGhpcy5tb2RhbDtcclxuICAgICAgICB0aGlzLm1vZGFsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgICAgICB0aGlzLnNjcm9sbEJlaGF2aW91cignZW5hYmxlJyk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgdGhpcy5jb25maWcub25DbG9zZSh0aGlzLm1vZGFsKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmF3YWl0Q2xvc2VBbmltYXRpb24pIHtcclxuICAgICAgICAgIHRoaXMubW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgZnVuY3Rpb24gaGFuZGxlcigpIHtcclxuICAgICAgICAgICAgbW9kYWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3BlbicpO1xyXG4gICAgICAgICAgICBtb2RhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBoYW5kbGVyLCBmYWxzZSk7XHJcbiAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnc2Nyb2xsQmVoYXZpb3VyJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNjcm9sbEJlaGF2aW91cih0b2dnbGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmRpc2FibGVTY3JvbGwpIHJldHVybjtcclxuICAgICAgICB2YXIgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuICAgICAgICBzd2l0Y2ggKHRvZ2dsZSkge1xyXG4gICAgICAgICAgY2FzZSAnZW5hYmxlJzpcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihib2R5LnN0eWxlLCB7IG92ZXJmbG93OiAnaW5pdGlhbCcsIGhlaWdodDogJ2luaXRpYWwnIH0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ2Rpc2FibGUnOlxyXG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKGJvZHkuc3R5bGUsIHsgb3ZlcmZsb3c6ICdoaWRkZW4nLCBoZWlnaHQ6ICcxMDB2aCcgfSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnYWRkRXZlbnRMaXN0ZW5lcnMnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgdGhpcy5tb2RhbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vbkNsaWNrKTtcclxuICAgICAgICB0aGlzLm1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsaWNrKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5vbktleWRvd24pO1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ3JlbW92ZUV2ZW50TGlzdGVuZXJzJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHRoaXMubW9kYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25DbGljayk7XHJcbiAgICAgICAgdGhpcy5tb2RhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljayk7XHJcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25LZXlkb3duKTtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICdvbkNsaWNrJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQpIHtcclxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZSh0aGlzLmNvbmZpZy5jbG9zZVRyaWdnZXIpKSB7XHJcbiAgICAgICAgICB0aGlzLmNsb3NlTW9kYWwoKTtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ29uS2V5ZG93bicsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbktleWRvd24oZXZlbnQpIHtcclxuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMjcpIHRoaXMuY2xvc2VNb2RhbChldmVudCk7XHJcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDkpIHRoaXMubWFpbnRhaW5Gb2N1cyhldmVudCk7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnZ2V0Rm9jdXNhYmxlTm9kZXMnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Rm9jdXNhYmxlTm9kZXMoKSB7XHJcbiAgICAgICAgdmFyIG5vZGVzID0gdGhpcy5tb2RhbC5xdWVyeVNlbGVjdG9yQWxsKEZPQ1VTQUJMRV9FTEVNRU5UUyk7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG5vZGVzKS5tYXAoZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgcmV0dXJuIG5vZGVzW2tleV07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnc2V0Rm9jdXNUb0ZpcnN0Tm9kZScsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRGb2N1c1RvRmlyc3ROb2RlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5kaXNhYmxlRm9jdXMpIHJldHVybjtcclxuICAgICAgICB2YXIgZm9jdXNhYmxlTm9kZXMgPSB0aGlzLmdldEZvY3VzYWJsZU5vZGVzKCk7XHJcbiAgICAgICAgaWYgKGZvY3VzYWJsZU5vZGVzLmxlbmd0aCkgZm9jdXNhYmxlTm9kZXNbMF0uZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICdtYWludGFpbkZvY3VzJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG1haW50YWluRm9jdXMoZXZlbnQpIHtcclxuICAgICAgICB2YXIgZm9jdXNhYmxlTm9kZXMgPSB0aGlzLmdldEZvY3VzYWJsZU5vZGVzKCk7XHJcblxyXG4gICAgICAgIC8vIGlmIGRpc2FibGVGb2N1cyBpcyB0cnVlXHJcbiAgICAgICAgaWYgKCF0aGlzLm1vZGFsLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XHJcbiAgICAgICAgICBmb2N1c2FibGVOb2Rlc1swXS5mb2N1cygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YXIgZm9jdXNlZEl0ZW1JbmRleCA9IGZvY3VzYWJsZU5vZGVzLmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5ICYmIGZvY3VzZWRJdGVtSW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgZm9jdXNhYmxlTm9kZXNbZm9jdXNhYmxlTm9kZXMubGVuZ3RoIC0gMV0uZm9jdXMoKTtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoIWV2ZW50LnNoaWZ0S2V5ICYmIGZvY3VzZWRJdGVtSW5kZXggPT09IGZvY3VzYWJsZU5vZGVzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgZm9jdXNhYmxlTm9kZXNbMF0uZm9jdXMoKTtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1dKTtcclxuICAgIHJldHVybiBNb2RhbDtcclxuICB9KCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIE1vZGFsIHByb3RvdHlwZSBlbmRzLlxyXG4gICAqIEhlcmUgb24gY29kZSBpcyByZXBvc2libGUgZm9yIGRldGVjdGluZyBhbmRcclxuICAgKiBhdXRvYmluZGluZyBldmVudCBoYW5kbGVycyBvbiBtb2RhbCB0cmlnZ2Vyc1xyXG4gICAqL1xyXG5cclxuICAvLyBLZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBvcGVuZWQgbW9kYWxcclxuXHJcblxyXG4gIHZhciBhY3RpdmVNb2RhbCA9IG51bGw7XHJcblxyXG4gIC8qKlxyXG4gICAqIEdlbmVyYXRlcyBhbiBhc3NvY2lhdGl2ZSBhcnJheSBvZiBtb2RhbHMgYW5kIGl0J3NcclxuICAgKiByZXNwZWN0aXZlIHRyaWdnZXJzXHJcbiAgICogQHBhcmFtICB7YXJyYXl9IHRyaWdnZXJzICAgICBBbiBhcnJheSBvZiBhbGwgdHJpZ2dlcnNcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRyaWdnZXJBdHRyIFRoZSBkYXRhLWF0dHJpYnV0ZSB3aGljaCB0cmlnZ2VycyB0aGUgbW9kdWxlXHJcbiAgICogQHJldHVybiB7YXJyYXl9XHJcbiAgICovXHJcbiAgdmFyIGdlbmVyYXRlVHJpZ2dlck1hcCA9IGZ1bmN0aW9uIGdlbmVyYXRlVHJpZ2dlck1hcCh0cmlnZ2VycywgdHJpZ2dlckF0dHIpIHtcclxuICAgIHZhciB0cmlnZ2VyTWFwID0gW107XHJcblxyXG4gICAgdHJpZ2dlcnMuZm9yRWFjaChmdW5jdGlvbiAodHJpZ2dlcikge1xyXG4gICAgICB2YXIgdGFyZ2V0TW9kYWwgPSB0cmlnZ2VyLmF0dHJpYnV0ZXNbdHJpZ2dlckF0dHJdLnZhbHVlO1xyXG4gICAgICBpZiAodHJpZ2dlck1hcFt0YXJnZXRNb2RhbF0gPT09IHVuZGVmaW5lZCkgdHJpZ2dlck1hcFt0YXJnZXRNb2RhbF0gPSBbXTtcclxuICAgICAgdHJpZ2dlck1hcFt0YXJnZXRNb2RhbF0ucHVzaCh0cmlnZ2VyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0cmlnZ2VyTWFwO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFZhbGlkYXRlcyB3aGV0aGVyIGEgbW9kYWwgb2YgdGhlIGdpdmVuIGlkIGV4aXN0c1xyXG4gICAqIGluIHRoZSBET01cclxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGlkICBUaGUgaWQgb2YgdGhlIG1vZGFsXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB2YXIgdmFsaWRhdGVNb2RhbFByZXNlbmNlID0gZnVuY3Rpb24gdmFsaWRhdGVNb2RhbFByZXNlbmNlKGlkKSB7XHJcbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ01pY3JvTW9kYWwgdicgKyB2ZXJzaW9uICsgJzogXFx1Mjc1N1NlZW1zIGxpa2UgeW91IGhhdmUgbWlzc2VkICVjXFwnJyArIGlkICsgJ1xcJycsICdiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmOWZhO2NvbG9yOiAjNTA1OTZjO2ZvbnQtd2VpZ2h0OiBib2xkOycsICdJRCBzb21ld2hlcmUgaW4geW91ciBjb2RlLiBSZWZlciBleGFtcGxlIGJlbG93IHRvIHJlc29sdmUgaXQuJyk7XHJcbiAgICAgIGNvbnNvbGUud2FybignJWNFeGFtcGxlOicsICdiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmOWZhO2NvbG9yOiAjNTA1OTZjO2ZvbnQtd2VpZ2h0OiBib2xkOycsICc8ZGl2IGNsYXNzPVwibW9kYWxcIiBpZD1cIicgKyBpZCArICdcIj48L2Rpdj4nKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFZhbGlkYXRlcyBpZiB0aGVyZSBhcmUgbW9kYWwgdHJpZ2dlcnMgcHJlc2VudFxyXG4gICAqIGluIHRoZSBET01cclxuICAgKiBAcGFyYW0gIHthcnJheX0gdHJpZ2dlcnMgQW4gYXJyYXkgb2YgZGF0YS10cmlnZ2Vyc1xyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgdmFyIHZhbGlkYXRlVHJpZ2dlclByZXNlbmNlID0gZnVuY3Rpb24gdmFsaWRhdGVUcmlnZ2VyUHJlc2VuY2UodHJpZ2dlcnMpIHtcclxuICAgIGlmICh0cmlnZ2Vycy5sZW5ndGggPD0gMCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ01pY3JvTW9kYWwgdicgKyB2ZXJzaW9uICsgJzogXFx1Mjc1N1BsZWFzZSBzcGVjaWZ5IGF0IGxlYXN0IG9uZSAlY1xcJ21pY3JvbW9kYWwtdHJpZ2dlclxcJycsICdiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmOWZhO2NvbG9yOiAjNTA1OTZjO2ZvbnQtd2VpZ2h0OiBib2xkOycsICdkYXRhIGF0dHJpYnV0ZS4nKTtcclxuICAgICAgY29uc29sZS53YXJuKCclY0V4YW1wbGU6JywgJ2JhY2tncm91bmQtY29sb3I6ICNmOGY5ZmE7Y29sb3I6ICM1MDU5NmM7Zm9udC13ZWlnaHQ6IGJvbGQ7JywgJzxhIGhyZWY9XCIjXCIgZGF0YS1taWNyb21vZGFsLXRyaWdnZXI9XCJteS1tb2RhbFwiPjwvYT4nKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIENoZWNrcyBpZiB0cmlnZ2VycyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBtb2RhbHNcclxuICAgKiBhcmUgcHJlc2VudCBpbiB0aGUgRE9NXHJcbiAgICogQHBhcmFtICB7YXJyYXl9IHRyaWdnZXJzICAgQXJyYXkgb2YgRE9NIG5vZGVzIHdoaWNoIGhhdmUgZGF0YS10cmlnZ2Vyc1xyXG4gICAqIEBwYXJhbSAge2FycmF5fSB0cmlnZ2VyTWFwIEFzc29jaWF0aXZlIGFycmF5IG9mIG1vZGFscyBhbmQgdGhpZXIgdHJpZ2dlcnNcclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHZhciB2YWxpZGF0ZUFyZ3MgPSBmdW5jdGlvbiB2YWxpZGF0ZUFyZ3ModHJpZ2dlcnMsIHRyaWdnZXJNYXApIHtcclxuICAgIHZhbGlkYXRlVHJpZ2dlclByZXNlbmNlKHRyaWdnZXJzKTtcclxuICAgIGlmICghdHJpZ2dlck1hcCkgcmV0dXJuIHRydWU7XHJcbiAgICBmb3IgKHZhciBpZCBpbiB0cmlnZ2VyTWFwKSB7XHJcbiAgICAgIHZhbGlkYXRlTW9kYWxQcmVzZW5jZShpZCk7XHJcbiAgICB9cmV0dXJuIHRydWU7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQmluZHMgY2xpY2sgaGFuZGxlcnMgdG8gYWxsIG1vZGFsIHRyaWdnZXJzXHJcbiAgICogQHBhcmFtICB7b2JqZWN0fSBjb25maWcgW2Rlc2NyaXB0aW9uXVxyXG4gICAqIEByZXR1cm4gdm9pZFxyXG4gICAqL1xyXG4gIHZhciBpbml0ID0gZnVuY3Rpb24gaW5pdChjb25maWcpIHtcclxuICAgIC8vIENyZWF0ZSBhbiBjb25maWcgb2JqZWN0IHdpdGggZGVmYXVsdCBvcGVuVHJpZ2dlclxyXG4gICAgdmFyIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB7IG9wZW5UcmlnZ2VyOiAnZGF0YS1taWNyb21vZGFsLXRyaWdnZXInIH0sIGNvbmZpZyk7XHJcblxyXG4gICAgLy8gQ29sbGVjdHMgYWxsIHRoZSBub2RlcyB3aXRoIHRoZSB0cmlnZ2VyXHJcbiAgICB2YXIgdHJpZ2dlcnMgPSBbXS5jb25jYXQodG9Db25zdW1hYmxlQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnWycgKyBvcHRpb25zLm9wZW5UcmlnZ2VyICsgJ10nKSkpO1xyXG5cclxuICAgIC8vIE1ha2VzIGEgbWFwcGluZ3Mgb2YgbW9kYWxzIHdpdGggdGhlaXIgdHJpZ2dlciBub2Rlc1xyXG4gICAgdmFyIHRyaWdnZXJNYXAgPSBnZW5lcmF0ZVRyaWdnZXJNYXAodHJpZ2dlcnMsIG9wdGlvbnMub3BlblRyaWdnZXIpO1xyXG5cclxuICAgIC8vIENoZWNrcyBpZiBtb2RhbHMgYW5kIHRyaWdnZXJzIGV4aXN0IGluIGRvbVxyXG4gICAgaWYgKG9wdGlvbnMuZGVidWdNb2RlID09PSB0cnVlICYmIHZhbGlkYXRlQXJncyh0cmlnZ2VycywgdHJpZ2dlck1hcCkgPT09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgLy8gRm9yIGV2ZXJ5IHRhcmdldCBtb2RhbCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlXHJcbiAgICBmb3IgKHZhciBrZXkgaW4gdHJpZ2dlck1hcCkge1xyXG4gICAgICB2YXIgdmFsdWUgPSB0cmlnZ2VyTWFwW2tleV07XHJcbiAgICAgIG9wdGlvbnMudGFyZ2V0TW9kYWwgPSBrZXk7XHJcbiAgICAgIG9wdGlvbnMudHJpZ2dlcnMgPSBbXS5jb25jYXQodG9Db25zdW1hYmxlQXJyYXkodmFsdWUpKTtcclxuICAgICAgbmV3IE1vZGFsKG9wdGlvbnMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNob3dzIGEgcGFydGljdWxhciBtb2RhbFxyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGFyZ2V0TW9kYWwgW1RoZSBpZCBvZiB0aGUgbW9kYWwgdG8gZGlzcGxheV1cclxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGNvbmZpZyBbVGhlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHRvIHBhc3NdXHJcbiAgICogQHJldHVybiB7dm9pZH1cclxuICAgKi9cclxuICB2YXIgc2hvdyA9IGZ1bmN0aW9uIHNob3codGFyZ2V0TW9kYWwsIGNvbmZpZykge1xyXG4gICAgdmFyIG9wdGlvbnMgPSBjb25maWcgfHwge307XHJcbiAgICBvcHRpb25zLnRhcmdldE1vZGFsID0gdGFyZ2V0TW9kYWw7XHJcblxyXG4gICAgLy8gQ2hlY2tzIGlmIG1vZGFscyBhbmQgdHJpZ2dlcnMgZXhpc3QgaW4gZG9tXHJcbiAgICBpZiAob3B0aW9ucy5kZWJ1Z01vZGUgPT09IHRydWUgJiYgdmFsaWRhdGVNb2RhbFByZXNlbmNlKHRhcmdldE1vZGFsKSA9PT0gZmFsc2UpIHJldHVybjtcclxuXHJcbiAgICAvLyBzdG9yZXMgcmVmZXJlbmNlIHRvIGFjdGl2ZSBtb2RhbFxyXG4gICAgYWN0aXZlTW9kYWwgPSBuZXcgTW9kYWwob3B0aW9ucyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XHJcbiAgICBhY3RpdmVNb2RhbC5zaG93TW9kYWwoKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDbG9zZXMgdGhlIGFjdGl2ZSBtb2RhbFxyXG4gICAqIEByZXR1cm4ge3ZvaWR9XHJcbiAgICovXHJcbiAgdmFyIGNsb3NlID0gZnVuY3Rpb24gY2xvc2UoKSB7XHJcbiAgICBhY3RpdmVNb2RhbC5jbG9zZU1vZGFsKCk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHsgaW5pdDogaW5pdCwgc2hvdzogc2hvdywgY2xvc2U6IGNsb3NlIH07XHJcbn0oKTtcclxuXHJcbnJldHVybiBNaWNyb01vZGFsO1xyXG5cclxufSkpKTtcclxuIiwiLyohXHJcbiogVGlwcHkuanMgdjIuNS4zXHJcbiogKGMpIDIwMTctMjAxOCBhdG9taWtzXHJcbiogTUlUXHJcbiovXHJcbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XHJcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxyXG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XHJcblx0KGdsb2JhbC50aXBweSA9IGZhY3RvcnkoKSk7XHJcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHZlcnNpb24gPSBcIjIuNS4zXCI7XHJcblxyXG52YXIgaXNCcm93c2VyID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XHJcblxyXG52YXIgaXNJRSA9IGlzQnJvd3NlciAmJiAvTVNJRSB8VHJpZGVudFxcLy8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcclxuXHJcbnZhciBicm93c2VyID0ge307XHJcblxyXG5pZiAoaXNCcm93c2VyKSB7XHJcbiAgYnJvd3Nlci5zdXBwb3J0ZWQgPSAncmVxdWVzdEFuaW1hdGlvbkZyYW1lJyBpbiB3aW5kb3c7XHJcbiAgYnJvd3Nlci5zdXBwb3J0c1RvdWNoID0gJ29udG91Y2hzdGFydCcgaW4gd2luZG93O1xyXG4gIGJyb3dzZXIudXNpbmdUb3VjaCA9IGZhbHNlO1xyXG4gIGJyb3dzZXIuZHluYW1pY0lucHV0RGV0ZWN0aW9uID0gdHJ1ZTtcclxuICBicm93c2VyLmlPUyA9IC9pUGhvbmV8aVBhZHxpUG9kLy50ZXN0KG5hdmlnYXRvci5wbGF0Zm9ybSkgJiYgIXdpbmRvdy5NU1N0cmVhbTtcclxuICBicm93c2VyLm9uVXNlcklucHV0Q2hhbmdlID0gZnVuY3Rpb24gKCkge307XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZWxlY3RvciBjb25zdGFudHMgdXNlZCBmb3IgZ3JhYmJpbmcgZWxlbWVudHNcclxuICovXHJcbnZhciBzZWxlY3RvcnMgPSB7XHJcbiAgUE9QUEVSOiAnLnRpcHB5LXBvcHBlcicsXHJcbiAgVE9PTFRJUDogJy50aXBweS10b29sdGlwJyxcclxuICBDT05URU5UOiAnLnRpcHB5LWNvbnRlbnQnLFxyXG4gIEJBQ0tEUk9QOiAnLnRpcHB5LWJhY2tkcm9wJyxcclxuICBBUlJPVzogJy50aXBweS1hcnJvdycsXHJcbiAgUk9VTkRfQVJST1c6ICcudGlwcHktcm91bmRhcnJvdycsXHJcbiAgUkVGRVJFTkNFOiAnW2RhdGEtdGlwcHldJ1xyXG59O1xyXG5cclxudmFyIGRlZmF1bHRzID0ge1xyXG4gIHBsYWNlbWVudDogJ3RvcCcsXHJcbiAgbGl2ZVBsYWNlbWVudDogdHJ1ZSxcclxuICB0cmlnZ2VyOiAnbW91c2VlbnRlciBmb2N1cycsXHJcbiAgYW5pbWF0aW9uOiAnc2hpZnQtYXdheScsXHJcbiAgaHRtbDogZmFsc2UsXHJcbiAgYW5pbWF0ZUZpbGw6IHRydWUsXHJcbiAgYXJyb3c6IGZhbHNlLFxyXG4gIGRlbGF5OiAwLFxyXG4gIGR1cmF0aW9uOiBbMzUwLCAzMDBdLFxyXG4gIGludGVyYWN0aXZlOiBmYWxzZSxcclxuICBpbnRlcmFjdGl2ZUJvcmRlcjogMixcclxuICB0aGVtZTogJ2RhcmsnLFxyXG4gIHNpemU6ICdyZWd1bGFyJyxcclxuICBkaXN0YW5jZTogMTAsXHJcbiAgb2Zmc2V0OiAwLFxyXG4gIGhpZGVPbkNsaWNrOiB0cnVlLFxyXG4gIG11bHRpcGxlOiBmYWxzZSxcclxuICBmb2xsb3dDdXJzb3I6IGZhbHNlLFxyXG4gIGluZXJ0aWE6IGZhbHNlLFxyXG4gIHVwZGF0ZUR1cmF0aW9uOiAzNTAsXHJcbiAgc3RpY2t5OiBmYWxzZSxcclxuICBhcHBlbmRUbzogZnVuY3Rpb24gYXBwZW5kVG8oKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuYm9keTtcclxuICB9LFxyXG4gIHpJbmRleDogOTk5OSxcclxuICB0b3VjaEhvbGQ6IGZhbHNlLFxyXG4gIHBlcmZvcm1hbmNlOiBmYWxzZSxcclxuICBkeW5hbWljVGl0bGU6IGZhbHNlLFxyXG4gIGZsaXA6IHRydWUsXHJcbiAgZmxpcEJlaGF2aW9yOiAnZmxpcCcsXHJcbiAgYXJyb3dUeXBlOiAnc2hhcnAnLFxyXG4gIGFycm93VHJhbnNmb3JtOiAnJyxcclxuICBtYXhXaWR0aDogJycsXHJcbiAgdGFyZ2V0OiBudWxsLFxyXG4gIGFsbG93VGl0bGVIVE1MOiB0cnVlLFxyXG4gIHBvcHBlck9wdGlvbnM6IHt9LFxyXG4gIGNyZWF0ZVBvcHBlckluc3RhbmNlT25Jbml0OiBmYWxzZSxcclxuICBvblNob3c6IGZ1bmN0aW9uIG9uU2hvdygpIHt9LFxyXG4gIG9uU2hvd246IGZ1bmN0aW9uIG9uU2hvd24oKSB7fSxcclxuICBvbkhpZGU6IGZ1bmN0aW9uIG9uSGlkZSgpIHt9LFxyXG4gIG9uSGlkZGVuOiBmdW5jdGlvbiBvbkhpZGRlbigpIHt9XHJcbn07XHJcblxyXG4vKipcclxuICogVGhlIGtleXMgb2YgdGhlIGRlZmF1bHRzIG9iamVjdCBmb3IgcmVkdWNpbmcgZG93biBpbnRvIGEgbmV3IG9iamVjdFxyXG4gKiBVc2VkIGluIGBnZXRJbmRpdmlkdWFsT3B0aW9ucygpYFxyXG4gKi9cclxudmFyIGRlZmF1bHRzS2V5cyA9IGJyb3dzZXIuc3VwcG9ydGVkICYmIE9iamVjdC5rZXlzKGRlZmF1bHRzKTtcclxuXHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgYW4gb2JqZWN0IGxpdGVyYWxcclxuICogQHBhcmFtIHsqfSB2YWx1ZVxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNPYmplY3RMaXRlcmFsKHZhbHVlKSB7XHJcbiAgcmV0dXJuIHt9LnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJztcclxufVxyXG5cclxuLyoqXHJcbiAqIFBvbnlmaWxsIGZvciBBcnJheS5mcm9tXHJcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcclxuICogQHJldHVybiB7QXJyYXl9XHJcbiAqL1xyXG5mdW5jdGlvbiB0b0FycmF5KHZhbHVlKSB7XHJcbiAgcmV0dXJuIFtdLnNsaWNlLmNhbGwodmFsdWUpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhbiBhcnJheSBvZiBlbGVtZW50cyBiYXNlZCBvbiB0aGUgc2VsZWN0b3IgaW5wdXRcclxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxFbGVtZW50W118Tm9kZUxpc3R8T2JqZWN0fSBzZWxlY3RvclxyXG4gKiBAcmV0dXJuIHtFbGVtZW50W119XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBcnJheU9mRWxlbWVudHMoc2VsZWN0b3IpIHtcclxuICBpZiAoc2VsZWN0b3IgaW5zdGFuY2VvZiBFbGVtZW50IHx8IGlzT2JqZWN0TGl0ZXJhbChzZWxlY3RvcikpIHtcclxuICAgIHJldHVybiBbc2VsZWN0b3JdO1xyXG4gIH1cclxuXHJcbiAgaWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgIHJldHVybiB0b0FycmF5KHNlbGVjdG9yKTtcclxuICB9XHJcblxyXG4gIGlmIChBcnJheS5pc0FycmF5KHNlbGVjdG9yKSkge1xyXG4gICAgcmV0dXJuIHNlbGVjdG9yO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiB0b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcclxuICB9IGNhdGNoIChfKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUG9seWZpbGxzIG5lZWRlZCBwcm9wcy9tZXRob2RzIGZvciBhIHZpcnR1YWwgcmVmZXJlbmNlIG9iamVjdFxyXG4gKiBOT1RFOiBpbiB2My4wIHRoaXMgd2lsbCBiZSBwdXJlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWZlcmVuY2VcclxuICovXHJcbmZ1bmN0aW9uIHBvbHlmaWxsVmlydHVhbFJlZmVyZW5jZVByb3BzKHJlZmVyZW5jZSkge1xyXG4gIHJlZmVyZW5jZS5yZWZPYmogPSB0cnVlO1xyXG4gIHJlZmVyZW5jZS5hdHRyaWJ1dGVzID0gcmVmZXJlbmNlLmF0dHJpYnV0ZXMgfHwge307XHJcbiAgcmVmZXJlbmNlLnNldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xyXG4gICAgcmVmZXJlbmNlLmF0dHJpYnV0ZXNba2V5XSA9IHZhbDtcclxuICB9O1xyXG4gIHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICByZXR1cm4gcmVmZXJlbmNlLmF0dHJpYnV0ZXNba2V5XTtcclxuICB9O1xyXG4gIHJlZmVyZW5jZS5yZW1vdmVBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICBkZWxldGUgcmVmZXJlbmNlLmF0dHJpYnV0ZXNba2V5XTtcclxuICB9O1xyXG4gIHJlZmVyZW5jZS5oYXNBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICByZXR1cm4ga2V5IGluIHJlZmVyZW5jZS5hdHRyaWJ1dGVzO1xyXG4gIH07XHJcbiAgcmVmZXJlbmNlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7fTtcclxuICByZWZlcmVuY2UucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHt9O1xyXG4gIHJlZmVyZW5jZS5jbGFzc0xpc3QgPSB7XHJcbiAgICBjbGFzc05hbWVzOiB7fSxcclxuICAgIGFkZDogZnVuY3Rpb24gYWRkKGtleSkge1xyXG4gICAgICByZXR1cm4gcmVmZXJlbmNlLmNsYXNzTGlzdC5jbGFzc05hbWVzW2tleV0gPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKGtleSkge1xyXG4gICAgICBkZWxldGUgcmVmZXJlbmNlLmNsYXNzTGlzdC5jbGFzc05hbWVzW2tleV07XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuICAgIGNvbnRhaW5zOiBmdW5jdGlvbiBjb250YWlucyhrZXkpIHtcclxuICAgICAgcmV0dXJuIGtleSBpbiByZWZlcmVuY2UuY2xhc3NMaXN0LmNsYXNzTmFtZXM7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHN1cHBvcnRlZCBwcmVmaXhlZCBwcm9wZXJ0eSAtIG9ubHkgYHdlYmtpdGAgaXMgbmVlZGVkLCBgbW96YCwgYG1zYCBhbmQgYG9gIGFyZSBvYnNvbGV0ZVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlcclxuICogQHJldHVybiB7U3RyaW5nfSAtIGJyb3dzZXIgc3VwcG9ydGVkIHByZWZpeGVkIHByb3BlcnR5XHJcbiAqL1xyXG5mdW5jdGlvbiBwcmVmaXgocHJvcGVydHkpIHtcclxuICB2YXIgcHJlZml4ZXMgPSBbJycsICd3ZWJraXQnXTtcclxuICB2YXIgdXBwZXJQcm9wID0gcHJvcGVydHkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wZXJ0eS5zbGljZSgxKTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIF9wcmVmaXggPSBwcmVmaXhlc1tpXTtcclxuICAgIHZhciBwcmVmaXhlZFByb3AgPSBfcHJlZml4ID8gX3ByZWZpeCArIHVwcGVyUHJvcCA6IHByb3BlcnR5O1xyXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudC5ib2R5LnN0eWxlW3ByZWZpeGVkUHJvcF0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHJldHVybiBwcmVmaXhlZFByb3A7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBkaXYgZWxlbWVudFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuZnVuY3Rpb24gZGl2KCkge1xyXG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBwb3BwZXIgZWxlbWVudCB0aGVuIHJldHVybnMgaXRcclxuICogQHBhcmFtIHtOdW1iZXJ9IGlkIC0gdGhlIHBvcHBlciBpZFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdGl0bGUgLSB0aGUgdG9vbHRpcCdzIGB0aXRsZWAgYXR0cmlidXRlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gaW5kaXZpZHVhbCBvcHRpb25zXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9IC0gdGhlIHBvcHBlciBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVQb3BwZXJFbGVtZW50KGlkLCB0aXRsZSwgb3B0aW9ucykge1xyXG4gIHZhciBwb3BwZXIgPSBkaXYoKTtcclxuICBwb3BwZXIuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0aXBweS1wb3BwZXInKTtcclxuICBwb3BwZXIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Rvb2x0aXAnKTtcclxuICBwb3BwZXIuc2V0QXR0cmlidXRlKCdpZCcsICd0aXBweS0nICsgaWQpO1xyXG4gIHBvcHBlci5zdHlsZS56SW5kZXggPSBvcHRpb25zLnpJbmRleDtcclxuICBwb3BwZXIuc3R5bGUubWF4V2lkdGggPSBvcHRpb25zLm1heFdpZHRoO1xyXG5cclxuICB2YXIgdG9vbHRpcCA9IGRpdigpO1xyXG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0aXBweS10b29sdGlwJyk7XHJcbiAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2l6ZScsIG9wdGlvbnMuc2l6ZSk7XHJcbiAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYW5pbWF0aW9uJywgb3B0aW9ucy5hbmltYXRpb24pO1xyXG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLXN0YXRlJywgJ2hpZGRlbicpO1xyXG4gIG9wdGlvbnMudGhlbWUuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XHJcbiAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQodCArICctdGhlbWUnKTtcclxuICB9KTtcclxuXHJcbiAgdmFyIGNvbnRlbnQgPSBkaXYoKTtcclxuICBjb250ZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndGlwcHktY29udGVudCcpO1xyXG5cclxuICBpZiAob3B0aW9ucy5hcnJvdykge1xyXG4gICAgdmFyIGFycm93ID0gZGl2KCk7XHJcbiAgICBhcnJvdy5zdHlsZVtwcmVmaXgoJ3RyYW5zZm9ybScpXSA9IG9wdGlvbnMuYXJyb3dUcmFuc2Zvcm07XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuYXJyb3dUeXBlID09PSAncm91bmQnKSB7XHJcbiAgICAgIGFycm93LmNsYXNzTGlzdC5hZGQoJ3RpcHB5LXJvdW5kYXJyb3cnKTtcclxuICAgICAgYXJyb3cuaW5uZXJIVE1MID0gJzxzdmcgdmlld0JveD1cIjAgMCAyNCA4XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPjxwYXRoIGQ9XCJNMyA4czIuMDIxLS4wMTUgNS4yNTMtNC4yMThDOS41ODQgMi4wNTEgMTAuNzk3IDEuMDA3IDEyIDFjMS4yMDMtLjAwNyAyLjQxNiAxLjAzNSAzLjc2MSAyLjc4MkMxOS4wMTIgOC4wMDUgMjEgOCAyMSA4SDN6XCIvPjwvc3ZnPic7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhcnJvdy5jbGFzc0xpc3QuYWRkKCd0aXBweS1hcnJvdycpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvb2x0aXAuYXBwZW5kQ2hpbGQoYXJyb3cpO1xyXG4gIH1cclxuXHJcbiAgaWYgKG9wdGlvbnMuYW5pbWF0ZUZpbGwpIHtcclxuICAgIC8vIENyZWF0ZSBhbmltYXRlRmlsbCBjaXJjbGUgZWxlbWVudCBmb3IgYW5pbWF0aW9uXHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnZGF0YS1hbmltYXRlZmlsbCcsICcnKTtcclxuICAgIHZhciBiYWNrZHJvcCA9IGRpdigpO1xyXG4gICAgYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgndGlwcHktYmFja2Ryb3AnKTtcclxuICAgIGJhY2tkcm9wLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0ZScsICdoaWRkZW4nKTtcclxuICAgIHRvb2x0aXAuYXBwZW5kQ2hpbGQoYmFja2Ryb3ApO1xyXG4gIH1cclxuXHJcbiAgaWYgKG9wdGlvbnMuaW5lcnRpYSkge1xyXG4gICAgLy8gQ2hhbmdlIHRyYW5zaXRpb24gdGltaW5nIGZ1bmN0aW9uIGN1YmljIGJlemllclxyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5lcnRpYScsICcnKTtcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnZGF0YS1pbnRlcmFjdGl2ZScsICcnKTtcclxuICB9XHJcblxyXG4gIHZhciBodG1sID0gb3B0aW9ucy5odG1sO1xyXG4gIGlmIChodG1sKSB7XHJcbiAgICB2YXIgdGVtcGxhdGVJZCA9IHZvaWQgMDtcclxuXHJcbiAgICBpZiAoaHRtbCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcclxuICAgICAgY29udGVudC5hcHBlbmRDaGlsZChodG1sKTtcclxuICAgICAgdGVtcGxhdGVJZCA9ICcjJyArIChodG1sLmlkIHx8ICd0aXBweS1odG1sLXRlbXBsYXRlJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyB0cmljayBsaW50ZXJzOiBodHRwczovL2dpdGh1Yi5jb20vYXRvbWlrcy90aXBweWpzL2lzc3Vlcy8xOTdcclxuICAgICAgY29udGVudFt0cnVlICYmICdpbm5lckhUTUwnXSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaHRtbClbdHJ1ZSAmJiAnaW5uZXJIVE1MJ107XHJcbiAgICAgIHRlbXBsYXRlSWQgPSBodG1sO1xyXG4gICAgfVxyXG5cclxuICAgIHBvcHBlci5zZXRBdHRyaWJ1dGUoJ2RhdGEtaHRtbCcsICcnKTtcclxuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLXRlbXBsYXRlLWlkJywgdGVtcGxhdGVJZCk7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcclxuICAgICAgcG9wcGVyLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgY29udGVudFtvcHRpb25zLmFsbG93VGl0bGVIVE1MID8gJ2lubmVySFRNTCcgOiAndGV4dENvbnRlbnQnXSA9IHRpdGxlO1xyXG4gIH1cclxuXHJcbiAgdG9vbHRpcC5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuICBwb3BwZXIuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XHJcblxyXG4gIHJldHVybiBwb3BwZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgdHJpZ2dlciBieSBhZGRpbmcgdGhlIG5lY2Vzc2FyeSBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIHJlZmVyZW5jZSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGUgLSB0aGUgY3VzdG9tIGV2ZW50IHNwZWNpZmllZCBpbiB0aGUgYHRyaWdnZXJgIHNldHRpbmdcclxuICogQHBhcmFtIHtFbGVtZW50fSByZWZlcmVuY2VcclxuICogQHBhcmFtIHtPYmplY3R9IGhhbmRsZXJzIC0gdGhlIGhhbmRsZXJzIGZvciBlYWNoIGV2ZW50XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAqIEByZXR1cm4ge0FycmF5fSAtIGFycmF5IG9mIGxpc3RlbmVyIG9iamVjdHNcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVRyaWdnZXIoZXZlbnRUeXBlLCByZWZlcmVuY2UsIGhhbmRsZXJzLCBvcHRpb25zKSB7XHJcbiAgdmFyIG9uVHJpZ2dlciA9IGhhbmRsZXJzLm9uVHJpZ2dlcixcclxuICAgICAgb25Nb3VzZUxlYXZlID0gaGFuZGxlcnMub25Nb3VzZUxlYXZlLFxyXG4gICAgICBvbkJsdXIgPSBoYW5kbGVycy5vbkJsdXIsXHJcbiAgICAgIG9uRGVsZWdhdGVTaG93ID0gaGFuZGxlcnMub25EZWxlZ2F0ZVNob3csXHJcbiAgICAgIG9uRGVsZWdhdGVIaWRlID0gaGFuZGxlcnMub25EZWxlZ2F0ZUhpZGU7XHJcblxyXG4gIHZhciBsaXN0ZW5lcnMgPSBbXTtcclxuXHJcbiAgaWYgKGV2ZW50VHlwZSA9PT0gJ21hbnVhbCcpIHJldHVybiBsaXN0ZW5lcnM7XHJcblxyXG4gIHZhciBvbiA9IGZ1bmN0aW9uIG9uKGV2ZW50VHlwZSwgaGFuZGxlcikge1xyXG4gICAgcmVmZXJlbmNlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBoYW5kbGVyKTtcclxuICAgIGxpc3RlbmVycy5wdXNoKHsgZXZlbnQ6IGV2ZW50VHlwZSwgaGFuZGxlcjogaGFuZGxlciB9KTtcclxuICB9O1xyXG5cclxuICBpZiAoIW9wdGlvbnMudGFyZ2V0KSB7XHJcbiAgICBvbihldmVudFR5cGUsIG9uVHJpZ2dlcik7XHJcblxyXG4gICAgaWYgKGJyb3dzZXIuc3VwcG9ydHNUb3VjaCAmJiBvcHRpb25zLnRvdWNoSG9sZCkge1xyXG4gICAgICBvbigndG91Y2hzdGFydCcsIG9uVHJpZ2dlcik7XHJcbiAgICAgIG9uKCd0b3VjaGVuZCcsIG9uTW91c2VMZWF2ZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnRUeXBlID09PSAnbW91c2VlbnRlcicpIHtcclxuICAgICAgb24oJ21vdXNlbGVhdmUnLCBvbk1vdXNlTGVhdmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50VHlwZSA9PT0gJ2ZvY3VzJykge1xyXG4gICAgICBvbihpc0lFID8gJ2ZvY3Vzb3V0JyA6ICdibHVyJywgb25CbHVyKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKGJyb3dzZXIuc3VwcG9ydHNUb3VjaCAmJiBvcHRpb25zLnRvdWNoSG9sZCkge1xyXG4gICAgICBvbigndG91Y2hzdGFydCcsIG9uRGVsZWdhdGVTaG93KTtcclxuICAgICAgb24oJ3RvdWNoZW5kJywgb25EZWxlZ2F0ZUhpZGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50VHlwZSA9PT0gJ21vdXNlZW50ZXInKSB7XHJcbiAgICAgIG9uKCdtb3VzZW92ZXInLCBvbkRlbGVnYXRlU2hvdyk7XHJcbiAgICAgIG9uKCdtb3VzZW91dCcsIG9uRGVsZWdhdGVIaWRlKTtcclxuICAgIH1cclxuICAgIGlmIChldmVudFR5cGUgPT09ICdmb2N1cycpIHtcclxuICAgICAgb24oJ2ZvY3VzaW4nLCBvbkRlbGVnYXRlU2hvdyk7XHJcbiAgICAgIG9uKCdmb2N1c291dCcsIG9uRGVsZWdhdGVIaWRlKTtcclxuICAgIH1cclxuICAgIGlmIChldmVudFR5cGUgPT09ICdjbGljaycpIHtcclxuICAgICAgb24oJ2NsaWNrJywgb25EZWxlZ2F0ZVNob3cpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGxpc3RlbmVycztcclxufVxyXG5cclxudmFyIGNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xyXG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbnZhciBjcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcclxuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcclxuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xyXG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XHJcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XHJcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xyXG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XHJcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XHJcbiAgfTtcclxufSgpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XHJcblxyXG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xyXG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0YXJnZXQ7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhbiBvYmplY3Qgb2Ygc2V0dGluZ3MgdG8gb3ZlcnJpZGUgZ2xvYmFsIHNldHRpbmdzXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcmVmZXJlbmNlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZU9wdGlvbnNcclxuICogQHJldHVybiB7T2JqZWN0fSAtIGluZGl2aWR1YWwgb3B0aW9uc1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5kaXZpZHVhbE9wdGlvbnMocmVmZXJlbmNlLCBpbnN0YW5jZU9wdGlvbnMpIHtcclxuICB2YXIgb3B0aW9ucyA9IGRlZmF1bHRzS2V5cy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywga2V5KSB7XHJcbiAgICB2YXIgdmFsID0gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXBweS0nICsga2V5LnRvTG93ZXJDYXNlKCkpIHx8IGluc3RhbmNlT3B0aW9uc1trZXldO1xyXG5cclxuICAgIC8vIENvbnZlcnQgc3RyaW5ncyB0byBib29sZWFuc1xyXG4gICAgaWYgKHZhbCA9PT0gJ2ZhbHNlJykgdmFsID0gZmFsc2U7XHJcbiAgICBpZiAodmFsID09PSAndHJ1ZScpIHZhbCA9IHRydWU7XHJcblxyXG4gICAgLy8gQ29udmVydCBudW1iZXIgc3RyaW5ncyB0byB0cnVlIG51bWJlcnNcclxuICAgIGlmIChpc0Zpbml0ZSh2YWwpICYmICFpc05hTihwYXJzZUZsb2F0KHZhbCkpKSB7XHJcbiAgICAgIHZhbCA9IHBhcnNlRmxvYXQodmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb252ZXJ0IGFycmF5IHN0cmluZ3MgdG8gYWN0dWFsIGFycmF5c1xyXG4gICAgaWYgKGtleSAhPT0gJ3RhcmdldCcgJiYgdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgJiYgdmFsLnRyaW0oKS5jaGFyQXQoMCkgPT09ICdbJykge1xyXG4gICAgICB2YWwgPSBKU09OLnBhcnNlKHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWNjW2tleV0gPSB2YWw7XHJcblxyXG4gICAgcmV0dXJuIGFjYztcclxuICB9LCB7fSk7XHJcblxyXG4gIHJldHVybiBfZXh0ZW5kcyh7fSwgaW5zdGFuY2VPcHRpb25zLCBvcHRpb25zKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEV2YWx1YXRlcy9tb2RpZmllcyB0aGUgb3B0aW9ucyBvYmplY3QgZm9yIGFwcHJvcHJpYXRlIGJlaGF2aW9yXHJcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IHJlZmVyZW5jZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gKiBAcmV0dXJuIHtPYmplY3R9IG1vZGlmaWVkL2V2YWx1YXRlZCBvcHRpb25zXHJcbiAqL1xyXG5mdW5jdGlvbiBldmFsdWF0ZU9wdGlvbnMocmVmZXJlbmNlLCBvcHRpb25zKSB7XHJcbiAgLy8gYW5pbWF0ZUZpbGwgaXMgZGlzYWJsZWQgaWYgYW4gYXJyb3cgaXMgdHJ1ZVxyXG4gIGlmIChvcHRpb25zLmFycm93KSB7XHJcbiAgICBvcHRpb25zLmFuaW1hdGVGaWxsID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAob3B0aW9ucy5hcHBlbmRUbyAmJiB0eXBlb2Ygb3B0aW9ucy5hcHBlbmRUbyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgb3B0aW9ucy5hcHBlbmRUbyA9IG9wdGlvbnMuYXBwZW5kVG8oKTtcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5odG1sID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBvcHRpb25zLmh0bWwgPSBvcHRpb25zLmh0bWwocmVmZXJlbmNlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBvcHRpb25zO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBpbm5lciBlbGVtZW50cyBvZiB0aGUgcG9wcGVyIGVsZW1lbnRcclxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5uZXJFbGVtZW50cyhwb3BwZXIpIHtcclxuICB2YXIgc2VsZWN0ID0gZnVuY3Rpb24gc2VsZWN0KHMpIHtcclxuICAgIHJldHVybiBwb3BwZXIucXVlcnlTZWxlY3RvcihzKTtcclxuICB9O1xyXG4gIHJldHVybiB7XHJcbiAgICB0b29sdGlwOiBzZWxlY3Qoc2VsZWN0b3JzLlRPT0xUSVApLFxyXG4gICAgYmFja2Ryb3A6IHNlbGVjdChzZWxlY3RvcnMuQkFDS0RST1ApLFxyXG4gICAgY29udGVudDogc2VsZWN0KHNlbGVjdG9ycy5DT05URU5UKSxcclxuICAgIGFycm93OiBzZWxlY3Qoc2VsZWN0b3JzLkFSUk9XKSB8fCBzZWxlY3Qoc2VsZWN0b3JzLlJPVU5EX0FSUk9XKVxyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW1vdmVzIHRoZSB0aXRsZSBmcm9tIGFuIGVsZW1lbnQsIHNldHRpbmcgYGRhdGEtb3JpZ2luYWwtdGl0bGVgXHJcbiAqIGFwcHJvcHJpYXRlbHlcclxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxyXG4gKi9cclxuZnVuY3Rpb24gcmVtb3ZlVGl0bGUoZWwpIHtcclxuICB2YXIgdGl0bGUgPSBlbC5nZXRBdHRyaWJ1dGUoJ3RpdGxlJyk7XHJcbiAgLy8gT25seSBzZXQgYGRhdGEtb3JpZ2luYWwtdGl0bGVgIGF0dHIgaWYgdGhlcmUgaXMgYSB0aXRsZVxyXG4gIGlmICh0aXRsZSkge1xyXG4gICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLW9yaWdpbmFsLXRpdGxlJywgdGl0bGUpO1xyXG4gIH1cclxuICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ3RpdGxlJyk7XHJcbn1cclxuXHJcbi8qKiFcclxuICogQGZpbGVPdmVydmlldyBLaWNrYXNzIGxpYnJhcnkgdG8gY3JlYXRlIGFuZCBwbGFjZSBwb3BwZXJzIG5lYXIgdGhlaXIgcmVmZXJlbmNlIGVsZW1lbnRzLlxyXG4gKiBAdmVyc2lvbiAxLjE0LjNcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IChjKSAyMDE2IEZlZGVyaWNvIFppdm9sbyBhbmQgY29udHJpYnV0b3JzXHJcbiAqXHJcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcbiAqXHJcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxyXG4gKiBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG4gKlxyXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxyXG4gKiBTT0ZUV0FSRS5cclxuICovXHJcbnZhciBpc0Jyb3dzZXIkMSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCc7XHJcblxyXG52YXIgbG9uZ2VyVGltZW91dEJyb3dzZXJzID0gWydFZGdlJywgJ1RyaWRlbnQnLCAnRmlyZWZveCddO1xyXG52YXIgdGltZW91dER1cmF0aW9uID0gMDtcclxuZm9yICh2YXIgaSA9IDA7IGkgPCBsb25nZXJUaW1lb3V0QnJvd3NlcnMubGVuZ3RoOyBpICs9IDEpIHtcclxuICBpZiAoaXNCcm93c2VyJDEgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKGxvbmdlclRpbWVvdXRCcm93c2Vyc1tpXSkgPj0gMCkge1xyXG4gICAgdGltZW91dER1cmF0aW9uID0gMTtcclxuICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWljcm90YXNrRGVib3VuY2UoZm4pIHtcclxuICB2YXIgY2FsbGVkID0gZmFsc2U7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChjYWxsZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY2FsbGVkID0gdHJ1ZTtcclxuICAgIHdpbmRvdy5Qcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgY2FsbGVkID0gZmFsc2U7XHJcbiAgICAgIGZuKCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiB0YXNrRGVib3VuY2UoZm4pIHtcclxuICB2YXIgc2NoZWR1bGVkID0gZmFsc2U7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICghc2NoZWR1bGVkKSB7XHJcbiAgICAgIHNjaGVkdWxlZCA9IHRydWU7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNjaGVkdWxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGZuKCk7XHJcbiAgICAgIH0sIHRpbWVvdXREdXJhdGlvbik7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxudmFyIHN1cHBvcnRzTWljcm9UYXNrcyA9IGlzQnJvd3NlciQxICYmIHdpbmRvdy5Qcm9taXNlO1xyXG5cclxuLyoqXHJcbiogQ3JlYXRlIGEgZGVib3VuY2VkIHZlcnNpb24gb2YgYSBtZXRob2QsIHRoYXQncyBhc3luY2hyb25vdXNseSBkZWZlcnJlZFxyXG4qIGJ1dCBjYWxsZWQgaW4gdGhlIG1pbmltdW0gdGltZSBwb3NzaWJsZS5cclxuKlxyXG4qIEBtZXRob2RcclxuKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiogQGFyZ3VtZW50IHtGdW5jdGlvbn0gZm5cclxuKiBAcmV0dXJucyB7RnVuY3Rpb259XHJcbiovXHJcbnZhciBkZWJvdW5jZSA9IHN1cHBvcnRzTWljcm9UYXNrcyA/IG1pY3JvdGFza0RlYm91bmNlIDogdGFza0RlYm91bmNlO1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhIGZ1bmN0aW9uXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0FueX0gZnVuY3Rpb25Ub0NoZWNrIC0gdmFyaWFibGUgdG8gY2hlY2tcclxuICogQHJldHVybnMge0Jvb2xlYW59IGFuc3dlciB0bzogaXMgYSBmdW5jdGlvbj9cclxuICovXHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZnVuY3Rpb25Ub0NoZWNrKSB7XHJcbiAgdmFyIGdldFR5cGUgPSB7fTtcclxuICByZXR1cm4gZnVuY3Rpb25Ub0NoZWNrICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbChmdW5jdGlvblRvQ2hlY2spID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IENTUyBjb21wdXRlZCBwcm9wZXJ0eSBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFZW1lbnR9IGVsZW1lbnRcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHByb3BlcnR5XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCwgcHJvcGVydHkpIHtcclxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuICAvLyBOT1RFOiAxIERPTSBhY2Nlc3MgaGVyZVxyXG4gIHZhciBjc3MgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQsIG51bGwpO1xyXG4gIHJldHVybiBwcm9wZXJ0eSA/IGNzc1twcm9wZXJ0eV0gOiBjc3M7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBwYXJlbnROb2RlIG9yIHRoZSBob3N0IG9mIHRoZSBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybnMge0VsZW1lbnR9IHBhcmVudFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UGFyZW50Tm9kZShlbGVtZW50KSB7XHJcbiAgaWYgKGVsZW1lbnQubm9kZU5hbWUgPT09ICdIVE1MJykge1xyXG4gICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgfVxyXG4gIHJldHVybiBlbGVtZW50LnBhcmVudE5vZGUgfHwgZWxlbWVudC5ob3N0O1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgc2Nyb2xsaW5nIHBhcmVudCBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtFbGVtZW50fSBzY3JvbGwgcGFyZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRTY3JvbGxQYXJlbnQoZWxlbWVudCkge1xyXG4gIC8vIFJldHVybiBib2R5LCBgZ2V0U2Nyb2xsYCB3aWxsIHRha2UgY2FyZSB0byBnZXQgdGhlIGNvcnJlY3QgYHNjcm9sbFRvcGAgZnJvbSBpdFxyXG4gIGlmICghZWxlbWVudCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmJvZHk7XHJcbiAgfVxyXG5cclxuICBzd2l0Y2ggKGVsZW1lbnQubm9kZU5hbWUpIHtcclxuICAgIGNhc2UgJ0hUTUwnOlxyXG4gICAgY2FzZSAnQk9EWSc6XHJcbiAgICAgIHJldHVybiBlbGVtZW50Lm93bmVyRG9jdW1lbnQuYm9keTtcclxuICAgIGNhc2UgJyNkb2N1bWVudCc6XHJcbiAgICAgIHJldHVybiBlbGVtZW50LmJvZHk7XHJcbiAgfVxyXG5cclxuICAvLyBGaXJlZm94IHdhbnQgdXMgdG8gY2hlY2sgYC14YCBhbmQgYC15YCB2YXJpYXRpb25zIGFzIHdlbGxcclxuXHJcbiAgdmFyIF9nZXRTdHlsZUNvbXB1dGVkUHJvcCA9IGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShlbGVtZW50KSxcclxuICAgICAgb3ZlcmZsb3cgPSBfZ2V0U3R5bGVDb21wdXRlZFByb3Aub3ZlcmZsb3csXHJcbiAgICAgIG92ZXJmbG93WCA9IF9nZXRTdHlsZUNvbXB1dGVkUHJvcC5vdmVyZmxvd1gsXHJcbiAgICAgIG92ZXJmbG93WSA9IF9nZXRTdHlsZUNvbXB1dGVkUHJvcC5vdmVyZmxvd1k7XHJcblxyXG4gIGlmICgvKGF1dG98c2Nyb2xsfG92ZXJsYXkpLy50ZXN0KG92ZXJmbG93ICsgb3ZlcmZsb3dZICsgb3ZlcmZsb3dYKSkge1xyXG4gICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZ2V0U2Nyb2xsUGFyZW50KGdldFBhcmVudE5vZGUoZWxlbWVudCkpO1xyXG59XHJcblxyXG52YXIgaXNJRTExID0gaXNCcm93c2VyJDEgJiYgISEod2luZG93Lk1TSW5wdXRNZXRob2RDb250ZXh0ICYmIGRvY3VtZW50LmRvY3VtZW50TW9kZSk7XHJcbnZhciBpc0lFMTAgPSBpc0Jyb3dzZXIkMSAmJiAvTVNJRSAxMC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcclxuXHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSBicm93c2VyIGlzIEludGVybmV0IEV4cGxvcmVyXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge051bWJlcn0gdmVyc2lvbiB0byBjaGVja1xyXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gaXNJRVxyXG4gKi9cclxuZnVuY3Rpb24gaXNJRSQxKHZlcnNpb24pIHtcclxuICBpZiAodmVyc2lvbiA9PT0gMTEpIHtcclxuICAgIHJldHVybiBpc0lFMTE7XHJcbiAgfVxyXG4gIGlmICh2ZXJzaW9uID09PSAxMCkge1xyXG4gICAgcmV0dXJuIGlzSUUxMDtcclxuICB9XHJcbiAgcmV0dXJuIGlzSUUxMSB8fCBpc0lFMTA7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBvZmZzZXQgcGFyZW50IG9mIHRoZSBnaXZlbiBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybnMge0VsZW1lbnR9IG9mZnNldCBwYXJlbnRcclxuICovXHJcbmZ1bmN0aW9uIGdldE9mZnNldFBhcmVudChlbGVtZW50KSB7XHJcbiAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgdmFyIG5vT2Zmc2V0UGFyZW50ID0gaXNJRSQxKDEwKSA/IGRvY3VtZW50LmJvZHkgOiBudWxsO1xyXG5cclxuICAvLyBOT1RFOiAxIERPTSBhY2Nlc3MgaGVyZVxyXG4gIHZhciBvZmZzZXRQYXJlbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcclxuICAvLyBTa2lwIGhpZGRlbiBlbGVtZW50cyB3aGljaCBkb24ndCBoYXZlIGFuIG9mZnNldFBhcmVudFxyXG4gIHdoaWxlIChvZmZzZXRQYXJlbnQgPT09IG5vT2Zmc2V0UGFyZW50ICYmIGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nKSB7XHJcbiAgICBvZmZzZXRQYXJlbnQgPSAoZWxlbWVudCA9IGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nKS5vZmZzZXRQYXJlbnQ7XHJcbiAgfVxyXG5cclxuICB2YXIgbm9kZU5hbWUgPSBvZmZzZXRQYXJlbnQgJiYgb2Zmc2V0UGFyZW50Lm5vZGVOYW1lO1xyXG5cclxuICBpZiAoIW5vZGVOYW1lIHx8IG5vZGVOYW1lID09PSAnQk9EWScgfHwgbm9kZU5hbWUgPT09ICdIVE1MJykge1xyXG4gICAgcmV0dXJuIGVsZW1lbnQgPyBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgLy8gLm9mZnNldFBhcmVudCB3aWxsIHJldHVybiB0aGUgY2xvc2VzdCBURCBvciBUQUJMRSBpbiBjYXNlXHJcbiAgLy8gbm8gb2Zmc2V0UGFyZW50IGlzIHByZXNlbnQsIEkgaGF0ZSB0aGlzIGpvYi4uLlxyXG4gIGlmIChbJ1REJywgJ1RBQkxFJ10uaW5kZXhPZihvZmZzZXRQYXJlbnQubm9kZU5hbWUpICE9PSAtMSAmJiBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkob2Zmc2V0UGFyZW50LCAncG9zaXRpb24nKSA9PT0gJ3N0YXRpYycpIHtcclxuICAgIHJldHVybiBnZXRPZmZzZXRQYXJlbnQob2Zmc2V0UGFyZW50KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBvZmZzZXRQYXJlbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzT2Zmc2V0Q29udGFpbmVyKGVsZW1lbnQpIHtcclxuICB2YXIgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lO1xyXG5cclxuICBpZiAobm9kZU5hbWUgPT09ICdCT0RZJykge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gbm9kZU5hbWUgPT09ICdIVE1MJyB8fCBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZCkgPT09IGVsZW1lbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGaW5kcyB0aGUgcm9vdCBub2RlIChkb2N1bWVudCwgc2hhZG93RE9NIHJvb3QpIG9mIHRoZSBnaXZlbiBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IG5vZGVcclxuICogQHJldHVybnMge0VsZW1lbnR9IHJvb3Qgbm9kZVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Um9vdChub2RlKSB7XHJcbiAgaWYgKG5vZGUucGFyZW50Tm9kZSAhPT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIGdldFJvb3Qobm9kZS5wYXJlbnROb2RlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBub2RlO1xyXG59XHJcblxyXG4vKipcclxuICogRmluZHMgdGhlIG9mZnNldCBwYXJlbnQgY29tbW9uIHRvIHRoZSB0d28gcHJvdmlkZWQgbm9kZXNcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudDFcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50MlxyXG4gKiBAcmV0dXJucyB7RWxlbWVudH0gY29tbW9uIG9mZnNldCBwYXJlbnRcclxuICovXHJcbmZ1bmN0aW9uIGZpbmRDb21tb25PZmZzZXRQYXJlbnQoZWxlbWVudDEsIGVsZW1lbnQyKSB7XHJcbiAgLy8gVGhpcyBjaGVjayBpcyBuZWVkZWQgdG8gYXZvaWQgZXJyb3JzIGluIGNhc2Ugb25lIG9mIHRoZSBlbGVtZW50cyBpc24ndCBkZWZpbmVkIGZvciBhbnkgcmVhc29uXHJcbiAgaWYgKCFlbGVtZW50MSB8fCAhZWxlbWVudDEubm9kZVR5cGUgfHwgIWVsZW1lbnQyIHx8ICFlbGVtZW50Mi5ub2RlVHlwZSkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICB9XHJcblxyXG4gIC8vIEhlcmUgd2UgbWFrZSBzdXJlIHRvIGdpdmUgYXMgXCJzdGFydFwiIHRoZSBlbGVtZW50IHRoYXQgY29tZXMgZmlyc3QgaW4gdGhlIERPTVxyXG4gIHZhciBvcmRlciA9IGVsZW1lbnQxLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGVsZW1lbnQyKSAmIE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fRk9MTE9XSU5HO1xyXG4gIHZhciBzdGFydCA9IG9yZGVyID8gZWxlbWVudDEgOiBlbGVtZW50MjtcclxuICB2YXIgZW5kID0gb3JkZXIgPyBlbGVtZW50MiA6IGVsZW1lbnQxO1xyXG5cclxuICAvLyBHZXQgY29tbW9uIGFuY2VzdG9yIGNvbnRhaW5lclxyXG4gIHZhciByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XHJcbiAgcmFuZ2Uuc2V0U3RhcnQoc3RhcnQsIDApO1xyXG4gIHJhbmdlLnNldEVuZChlbmQsIDApO1xyXG4gIHZhciBjb21tb25BbmNlc3RvckNvbnRhaW5lciA9IHJhbmdlLmNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xyXG5cclxuICAvLyBCb3RoIG5vZGVzIGFyZSBpbnNpZGUgI2RvY3VtZW50XHJcblxyXG4gIGlmIChlbGVtZW50MSAhPT0gY29tbW9uQW5jZXN0b3JDb250YWluZXIgJiYgZWxlbWVudDIgIT09IGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyIHx8IHN0YXJ0LmNvbnRhaW5zKGVuZCkpIHtcclxuICAgIGlmIChpc09mZnNldENvbnRhaW5lcihjb21tb25BbmNlc3RvckNvbnRhaW5lcikpIHtcclxuICAgICAgcmV0dXJuIGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBnZXRPZmZzZXRQYXJlbnQoY29tbW9uQW5jZXN0b3JDb250YWluZXIpO1xyXG4gIH1cclxuXHJcbiAgLy8gb25lIG9mIHRoZSBub2RlcyBpcyBpbnNpZGUgc2hhZG93RE9NLCBmaW5kIHdoaWNoIG9uZVxyXG4gIHZhciBlbGVtZW50MXJvb3QgPSBnZXRSb290KGVsZW1lbnQxKTtcclxuICBpZiAoZWxlbWVudDFyb290Lmhvc3QpIHtcclxuICAgIHJldHVybiBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50KGVsZW1lbnQxcm9vdC5ob3N0LCBlbGVtZW50Mik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50KGVsZW1lbnQxLCBnZXRSb290KGVsZW1lbnQyKS5ob3N0KTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXRzIHRoZSBzY3JvbGwgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQgaW4gdGhlIGdpdmVuIHNpZGUgKHRvcCBhbmQgbGVmdClcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gc2lkZSBgdG9wYCBvciBgbGVmdGBcclxuICogQHJldHVybnMge251bWJlcn0gYW1vdW50IG9mIHNjcm9sbGVkIHBpeGVsc1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0U2Nyb2xsKGVsZW1lbnQpIHtcclxuICB2YXIgc2lkZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogJ3RvcCc7XHJcblxyXG4gIHZhciB1cHBlclNpZGUgPSBzaWRlID09PSAndG9wJyA/ICdzY3JvbGxUb3AnIDogJ3Njcm9sbExlZnQnO1xyXG4gIHZhciBub2RlTmFtZSA9IGVsZW1lbnQubm9kZU5hbWU7XHJcblxyXG4gIGlmIChub2RlTmFtZSA9PT0gJ0JPRFknIHx8IG5vZGVOYW1lID09PSAnSFRNTCcpIHtcclxuICAgIHZhciBodG1sID0gZWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICAgIHZhciBzY3JvbGxpbmdFbGVtZW50ID0gZWxlbWVudC5vd25lckRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQgfHwgaHRtbDtcclxuICAgIHJldHVybiBzY3JvbGxpbmdFbGVtZW50W3VwcGVyU2lkZV07XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZWxlbWVudFt1cHBlclNpZGVdO1xyXG59XHJcblxyXG4vKlxyXG4gKiBTdW0gb3Igc3VidHJhY3QgdGhlIGVsZW1lbnQgc2Nyb2xsIHZhbHVlcyAobGVmdCBhbmQgdG9wKSBmcm9tIGEgZ2l2ZW4gcmVjdCBvYmplY3RcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWN0IC0gUmVjdCBvYmplY3QgeW91IHdhbnQgdG8gY2hhbmdlXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgZWxlbWVudCBmcm9tIHRoZSBmdW5jdGlvbiByZWFkcyB0aGUgc2Nyb2xsIHZhbHVlc1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHN1YnRyYWN0IC0gc2V0IHRvIHRydWUgaWYgeW91IHdhbnQgdG8gc3VidHJhY3QgdGhlIHNjcm9sbCB2YWx1ZXNcclxuICogQHJldHVybiB7T2JqZWN0fSByZWN0IC0gVGhlIG1vZGlmaWVyIHJlY3Qgb2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBpbmNsdWRlU2Nyb2xsKHJlY3QsIGVsZW1lbnQpIHtcclxuICB2YXIgc3VidHJhY3QgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IGZhbHNlO1xyXG5cclxuICB2YXIgc2Nyb2xsVG9wID0gZ2V0U2Nyb2xsKGVsZW1lbnQsICd0b3AnKTtcclxuICB2YXIgc2Nyb2xsTGVmdCA9IGdldFNjcm9sbChlbGVtZW50LCAnbGVmdCcpO1xyXG4gIHZhciBtb2RpZmllciA9IHN1YnRyYWN0ID8gLTEgOiAxO1xyXG4gIHJlY3QudG9wICs9IHNjcm9sbFRvcCAqIG1vZGlmaWVyO1xyXG4gIHJlY3QuYm90dG9tICs9IHNjcm9sbFRvcCAqIG1vZGlmaWVyO1xyXG4gIHJlY3QubGVmdCArPSBzY3JvbGxMZWZ0ICogbW9kaWZpZXI7XHJcbiAgcmVjdC5yaWdodCArPSBzY3JvbGxMZWZ0ICogbW9kaWZpZXI7XHJcbiAgcmV0dXJuIHJlY3Q7XHJcbn1cclxuXHJcbi8qXHJcbiAqIEhlbHBlciB0byBkZXRlY3QgYm9yZGVycyBvZiBhIGdpdmVuIGVsZW1lbnRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7Q1NTU3R5bGVEZWNsYXJhdGlvbn0gc3R5bGVzXHJcbiAqIFJlc3VsdCBvZiBgZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5YCBvbiB0aGUgZ2l2ZW4gZWxlbWVudFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gYXhpcyAtIGB4YCBvciBgeWBcclxuICogQHJldHVybiB7bnVtYmVyfSBib3JkZXJzIC0gVGhlIGJvcmRlcnMgc2l6ZSBvZiB0aGUgZ2l2ZW4gYXhpc1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGdldEJvcmRlcnNTaXplKHN0eWxlcywgYXhpcykge1xyXG4gIHZhciBzaWRlQSA9IGF4aXMgPT09ICd4JyA/ICdMZWZ0JyA6ICdUb3AnO1xyXG4gIHZhciBzaWRlQiA9IHNpZGVBID09PSAnTGVmdCcgPyAnUmlnaHQnIDogJ0JvdHRvbSc7XHJcblxyXG4gIHJldHVybiBwYXJzZUZsb2F0KHN0eWxlc1snYm9yZGVyJyArIHNpZGVBICsgJ1dpZHRoJ10sIDEwKSArIHBhcnNlRmxvYXQoc3R5bGVzWydib3JkZXInICsgc2lkZUIgKyAnV2lkdGgnXSwgMTApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTaXplKGF4aXMsIGJvZHksIGh0bWwsIGNvbXB1dGVkU3R5bGUpIHtcclxuICByZXR1cm4gTWF0aC5tYXgoYm9keVsnb2Zmc2V0JyArIGF4aXNdLCBib2R5WydzY3JvbGwnICsgYXhpc10sIGh0bWxbJ2NsaWVudCcgKyBheGlzXSwgaHRtbFsnb2Zmc2V0JyArIGF4aXNdLCBodG1sWydzY3JvbGwnICsgYXhpc10sIGlzSUUkMSgxMCkgPyBodG1sWydvZmZzZXQnICsgYXhpc10gKyBjb21wdXRlZFN0eWxlWydtYXJnaW4nICsgKGF4aXMgPT09ICdIZWlnaHQnID8gJ1RvcCcgOiAnTGVmdCcpXSArIGNvbXB1dGVkU3R5bGVbJ21hcmdpbicgKyAoYXhpcyA9PT0gJ0hlaWdodCcgPyAnQm90dG9tJyA6ICdSaWdodCcpXSA6IDApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRXaW5kb3dTaXplcygpIHtcclxuICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgdmFyIGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgdmFyIGNvbXB1dGVkU3R5bGUgPSBpc0lFJDEoMTApICYmIGdldENvbXB1dGVkU3R5bGUoaHRtbCk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBoZWlnaHQ6IGdldFNpemUoJ0hlaWdodCcsIGJvZHksIGh0bWwsIGNvbXB1dGVkU3R5bGUpLFxyXG4gICAgd2lkdGg6IGdldFNpemUoJ1dpZHRoJywgYm9keSwgaHRtbCwgY29tcHV0ZWRTdHlsZSlcclxuICB9O1xyXG59XHJcblxyXG52YXIgY2xhc3NDYWxsQ2hlY2skMSA9IGZ1bmN0aW9uIGNsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xyXG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbnZhciBjcmVhdGVDbGFzcyQxID0gZnVuY3Rpb24gKCkge1xyXG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xyXG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XHJcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcclxuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcclxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcclxuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XHJcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcclxuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcclxuICB9O1xyXG59KCk7XHJcblxyXG52YXIgZGVmaW5lUHJvcGVydHkkMSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xyXG4gIGlmIChrZXkgaW4gb2JqKSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcclxuICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgIHdyaXRhYmxlOiB0cnVlXHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBvYmo7XHJcbn07XHJcblxyXG52YXIgX2V4dGVuZHMkMSA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xyXG5cclxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcclxuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGFyZ2V0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdpdmVuIGVsZW1lbnQgb2Zmc2V0cywgZ2VuZXJhdGUgYW4gb3V0cHV0IHNpbWlsYXIgdG8gZ2V0Qm91bmRpbmdDbGllbnRSZWN0XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb2Zmc2V0c1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBDbGllbnRSZWN0IGxpa2Ugb3V0cHV0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRDbGllbnRSZWN0KG9mZnNldHMpIHtcclxuICByZXR1cm4gX2V4dGVuZHMkMSh7fSwgb2Zmc2V0cywge1xyXG4gICAgcmlnaHQ6IG9mZnNldHMubGVmdCArIG9mZnNldHMud2lkdGgsXHJcbiAgICBib3R0b206IG9mZnNldHMudG9wICsgb2Zmc2V0cy5oZWlnaHRcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBib3VuZGluZyBjbGllbnQgcmVjdCBvZiBnaXZlbiBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm4ge09iamVjdH0gY2xpZW50IHJlY3RcclxuICovXHJcbmZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50KSB7XHJcbiAgdmFyIHJlY3QgPSB7fTtcclxuXHJcbiAgLy8gSUUxMCAxMCBGSVg6IFBsZWFzZSwgZG9uJ3QgYXNrLCB0aGUgZWxlbWVudCBpc24ndFxyXG4gIC8vIGNvbnNpZGVyZWQgaW4gRE9NIGluIHNvbWUgY2lyY3Vtc3RhbmNlcy4uLlxyXG4gIC8vIFRoaXMgaXNuJ3QgcmVwcm9kdWNpYmxlIGluIElFMTAgY29tcGF0aWJpbGl0eSBtb2RlIG9mIElFMTFcclxuICB0cnkge1xyXG4gICAgaWYgKGlzSUUkMSgxMCkpIHtcclxuICAgICAgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIHZhciBzY3JvbGxUb3AgPSBnZXRTY3JvbGwoZWxlbWVudCwgJ3RvcCcpO1xyXG4gICAgICB2YXIgc2Nyb2xsTGVmdCA9IGdldFNjcm9sbChlbGVtZW50LCAnbGVmdCcpO1xyXG4gICAgICByZWN0LnRvcCArPSBzY3JvbGxUb3A7XHJcbiAgICAgIHJlY3QubGVmdCArPSBzY3JvbGxMZWZ0O1xyXG4gICAgICByZWN0LmJvdHRvbSArPSBzY3JvbGxUb3A7XHJcbiAgICAgIHJlY3QucmlnaHQgKz0gc2Nyb2xsTGVmdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHt9XHJcblxyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICBsZWZ0OiByZWN0LmxlZnQsXHJcbiAgICB0b3A6IHJlY3QudG9wLFxyXG4gICAgd2lkdGg6IHJlY3QucmlnaHQgLSByZWN0LmxlZnQsXHJcbiAgICBoZWlnaHQ6IHJlY3QuYm90dG9tIC0gcmVjdC50b3BcclxuICB9O1xyXG5cclxuICAvLyBzdWJ0cmFjdCBzY3JvbGxiYXIgc2l6ZSBmcm9tIHNpemVzXHJcbiAgdmFyIHNpemVzID0gZWxlbWVudC5ub2RlTmFtZSA9PT0gJ0hUTUwnID8gZ2V0V2luZG93U2l6ZXMoKSA6IHt9O1xyXG4gIHZhciB3aWR0aCA9IHNpemVzLndpZHRoIHx8IGVsZW1lbnQuY2xpZW50V2lkdGggfHwgcmVzdWx0LnJpZ2h0IC0gcmVzdWx0LmxlZnQ7XHJcbiAgdmFyIGhlaWdodCA9IHNpemVzLmhlaWdodCB8fCBlbGVtZW50LmNsaWVudEhlaWdodCB8fCByZXN1bHQuYm90dG9tIC0gcmVzdWx0LnRvcDtcclxuXHJcbiAgdmFyIGhvcml6U2Nyb2xsYmFyID0gZWxlbWVudC5vZmZzZXRXaWR0aCAtIHdpZHRoO1xyXG4gIHZhciB2ZXJ0U2Nyb2xsYmFyID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgLSBoZWlnaHQ7XHJcblxyXG4gIC8vIGlmIGFuIGh5cG90aGV0aWNhbCBzY3JvbGxiYXIgaXMgZGV0ZWN0ZWQsIHdlIG11c3QgYmUgc3VyZSBpdCdzIG5vdCBhIGBib3JkZXJgXHJcbiAgLy8gd2UgbWFrZSB0aGlzIGNoZWNrIGNvbmRpdGlvbmFsIGZvciBwZXJmb3JtYW5jZSByZWFzb25zXHJcbiAgaWYgKGhvcml6U2Nyb2xsYmFyIHx8IHZlcnRTY3JvbGxiYXIpIHtcclxuICAgIHZhciBzdHlsZXMgPSBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCk7XHJcbiAgICBob3JpelNjcm9sbGJhciAtPSBnZXRCb3JkZXJzU2l6ZShzdHlsZXMsICd4Jyk7XHJcbiAgICB2ZXJ0U2Nyb2xsYmFyIC09IGdldEJvcmRlcnNTaXplKHN0eWxlcywgJ3knKTtcclxuXHJcbiAgICByZXN1bHQud2lkdGggLT0gaG9yaXpTY3JvbGxiYXI7XHJcbiAgICByZXN1bHQuaGVpZ2h0IC09IHZlcnRTY3JvbGxiYXI7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZ2V0Q2xpZW50UmVjdChyZXN1bHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRPZmZzZXRSZWN0UmVsYXRpdmVUb0FyYml0cmFyeU5vZGUoY2hpbGRyZW4sIHBhcmVudCkge1xyXG4gIHZhciBmaXhlZFBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmYWxzZTtcclxuXHJcbiAgdmFyIGlzSUUxMCA9IGlzSUUkMSgxMCk7XHJcbiAgdmFyIGlzSFRNTCA9IHBhcmVudC5ub2RlTmFtZSA9PT0gJ0hUTUwnO1xyXG4gIHZhciBjaGlsZHJlblJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoY2hpbGRyZW4pO1xyXG4gIHZhciBwYXJlbnRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KHBhcmVudCk7XHJcbiAgdmFyIHNjcm9sbFBhcmVudCA9IGdldFNjcm9sbFBhcmVudChjaGlsZHJlbik7XHJcblxyXG4gIHZhciBzdHlsZXMgPSBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkocGFyZW50KTtcclxuICB2YXIgYm9yZGVyVG9wV2lkdGggPSBwYXJzZUZsb2F0KHN0eWxlcy5ib3JkZXJUb3BXaWR0aCwgMTApO1xyXG4gIHZhciBib3JkZXJMZWZ0V2lkdGggPSBwYXJzZUZsb2F0KHN0eWxlcy5ib3JkZXJMZWZ0V2lkdGgsIDEwKTtcclxuXHJcbiAgLy8gSW4gY2FzZXMgd2hlcmUgdGhlIHBhcmVudCBpcyBmaXhlZCwgd2UgbXVzdCBpZ25vcmUgbmVnYXRpdmUgc2Nyb2xsIGluIG9mZnNldCBjYWxjXHJcbiAgaWYgKGZpeGVkUG9zaXRpb24gJiYgcGFyZW50Lm5vZGVOYW1lID09PSAnSFRNTCcpIHtcclxuICAgIHBhcmVudFJlY3QudG9wID0gTWF0aC5tYXgocGFyZW50UmVjdC50b3AsIDApO1xyXG4gICAgcGFyZW50UmVjdC5sZWZ0ID0gTWF0aC5tYXgocGFyZW50UmVjdC5sZWZ0LCAwKTtcclxuICB9XHJcbiAgdmFyIG9mZnNldHMgPSBnZXRDbGllbnRSZWN0KHtcclxuICAgIHRvcDogY2hpbGRyZW5SZWN0LnRvcCAtIHBhcmVudFJlY3QudG9wIC0gYm9yZGVyVG9wV2lkdGgsXHJcbiAgICBsZWZ0OiBjaGlsZHJlblJlY3QubGVmdCAtIHBhcmVudFJlY3QubGVmdCAtIGJvcmRlckxlZnRXaWR0aCxcclxuICAgIHdpZHRoOiBjaGlsZHJlblJlY3Qud2lkdGgsXHJcbiAgICBoZWlnaHQ6IGNoaWxkcmVuUmVjdC5oZWlnaHRcclxuICB9KTtcclxuICBvZmZzZXRzLm1hcmdpblRvcCA9IDA7XHJcbiAgb2Zmc2V0cy5tYXJnaW5MZWZ0ID0gMDtcclxuXHJcbiAgLy8gU3VidHJhY3QgbWFyZ2lucyBvZiBkb2N1bWVudEVsZW1lbnQgaW4gY2FzZSBpdCdzIGJlaW5nIHVzZWQgYXMgcGFyZW50XHJcbiAgLy8gd2UgZG8gdGhpcyBvbmx5IG9uIEhUTUwgYmVjYXVzZSBpdCdzIHRoZSBvbmx5IGVsZW1lbnQgdGhhdCBiZWhhdmVzXHJcbiAgLy8gZGlmZmVyZW50bHkgd2hlbiBtYXJnaW5zIGFyZSBhcHBsaWVkIHRvIGl0LiBUaGUgbWFyZ2lucyBhcmUgaW5jbHVkZWQgaW5cclxuICAvLyB0aGUgYm94IG9mIHRoZSBkb2N1bWVudEVsZW1lbnQsIGluIHRoZSBvdGhlciBjYXNlcyBub3QuXHJcbiAgaWYgKCFpc0lFMTAgJiYgaXNIVE1MKSB7XHJcbiAgICB2YXIgbWFyZ2luVG9wID0gcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luVG9wLCAxMCk7XHJcbiAgICB2YXIgbWFyZ2luTGVmdCA9IHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpbkxlZnQsIDEwKTtcclxuXHJcbiAgICBvZmZzZXRzLnRvcCAtPSBib3JkZXJUb3BXaWR0aCAtIG1hcmdpblRvcDtcclxuICAgIG9mZnNldHMuYm90dG9tIC09IGJvcmRlclRvcFdpZHRoIC0gbWFyZ2luVG9wO1xyXG4gICAgb2Zmc2V0cy5sZWZ0IC09IGJvcmRlckxlZnRXaWR0aCAtIG1hcmdpbkxlZnQ7XHJcbiAgICBvZmZzZXRzLnJpZ2h0IC09IGJvcmRlckxlZnRXaWR0aCAtIG1hcmdpbkxlZnQ7XHJcblxyXG4gICAgLy8gQXR0YWNoIG1hcmdpblRvcCBhbmQgbWFyZ2luTGVmdCBiZWNhdXNlIGluIHNvbWUgY2lyY3Vtc3RhbmNlcyB3ZSBtYXkgbmVlZCB0aGVtXHJcbiAgICBvZmZzZXRzLm1hcmdpblRvcCA9IG1hcmdpblRvcDtcclxuICAgIG9mZnNldHMubWFyZ2luTGVmdCA9IG1hcmdpbkxlZnQ7XHJcbiAgfVxyXG5cclxuICBpZiAoaXNJRTEwICYmICFmaXhlZFBvc2l0aW9uID8gcGFyZW50LmNvbnRhaW5zKHNjcm9sbFBhcmVudCkgOiBwYXJlbnQgPT09IHNjcm9sbFBhcmVudCAmJiBzY3JvbGxQYXJlbnQubm9kZU5hbWUgIT09ICdCT0RZJykge1xyXG4gICAgb2Zmc2V0cyA9IGluY2x1ZGVTY3JvbGwob2Zmc2V0cywgcGFyZW50KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBvZmZzZXRzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWaWV3cG9ydE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJ0Yml0cmFyeU5vZGUoZWxlbWVudCkge1xyXG4gIHZhciBleGNsdWRlU2Nyb2xsID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcclxuXHJcbiAgdmFyIGh0bWwgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIHZhciByZWxhdGl2ZU9mZnNldCA9IGdldE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJiaXRyYXJ5Tm9kZShlbGVtZW50LCBodG1sKTtcclxuICB2YXIgd2lkdGggPSBNYXRoLm1heChodG1sLmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcclxuICB2YXIgaGVpZ2h0ID0gTWF0aC5tYXgoaHRtbC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKTtcclxuXHJcbiAgdmFyIHNjcm9sbFRvcCA9ICFleGNsdWRlU2Nyb2xsID8gZ2V0U2Nyb2xsKGh0bWwpIDogMDtcclxuICB2YXIgc2Nyb2xsTGVmdCA9ICFleGNsdWRlU2Nyb2xsID8gZ2V0U2Nyb2xsKGh0bWwsICdsZWZ0JykgOiAwO1xyXG5cclxuICB2YXIgb2Zmc2V0ID0ge1xyXG4gICAgdG9wOiBzY3JvbGxUb3AgLSByZWxhdGl2ZU9mZnNldC50b3AgKyByZWxhdGl2ZU9mZnNldC5tYXJnaW5Ub3AsXHJcbiAgICBsZWZ0OiBzY3JvbGxMZWZ0IC0gcmVsYXRpdmVPZmZzZXQubGVmdCArIHJlbGF0aXZlT2Zmc2V0Lm1hcmdpbkxlZnQsXHJcbiAgICB3aWR0aDogd2lkdGgsXHJcbiAgICBoZWlnaHQ6IGhlaWdodFxyXG4gIH07XHJcblxyXG4gIHJldHVybiBnZXRDbGllbnRSZWN0KG9mZnNldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBmaXhlZCBvciBpcyBpbnNpZGUgYSBmaXhlZCBwYXJlbnRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGN1c3RvbUNvbnRhaW5lclxyXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gYW5zd2VyIHRvIFwiaXNGaXhlZD9cIlxyXG4gKi9cclxuZnVuY3Rpb24gaXNGaXhlZChlbGVtZW50KSB7XHJcbiAgdmFyIG5vZGVOYW1lID0gZWxlbWVudC5ub2RlTmFtZTtcclxuICBpZiAobm9kZU5hbWUgPT09ICdCT0RZJyB8fCBub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIGlmIChnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCwgJ3Bvc2l0aW9uJykgPT09ICdmaXhlZCcpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gaXNGaXhlZChnZXRQYXJlbnROb2RlKGVsZW1lbnQpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZpbmRzIHRoZSBmaXJzdCBwYXJlbnQgb2YgYW4gZWxlbWVudCB0aGF0IGhhcyBhIHRyYW5zZm9ybWVkIHByb3BlcnR5IGRlZmluZWRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7RWxlbWVudH0gZmlyc3QgdHJhbnNmb3JtZWQgcGFyZW50IG9yIGRvY3VtZW50RWxlbWVudFxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGdldEZpeGVkUG9zaXRpb25PZmZzZXRQYXJlbnQoZWxlbWVudCkge1xyXG4gIC8vIFRoaXMgY2hlY2sgaXMgbmVlZGVkIHRvIGF2b2lkIGVycm9ycyBpbiBjYXNlIG9uZSBvZiB0aGUgZWxlbWVudHMgaXNuJ3QgZGVmaW5lZCBmb3IgYW55IHJlYXNvblxyXG4gIGlmICghZWxlbWVudCB8fCAhZWxlbWVudC5wYXJlbnRFbGVtZW50IHx8IGlzSUUkMSgpKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIH1cclxuICB2YXIgZWwgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgd2hpbGUgKGVsICYmIGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShlbCwgJ3RyYW5zZm9ybScpID09PSAnbm9uZScpIHtcclxuICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcclxuICB9XHJcbiAgcmV0dXJuIGVsIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbXB1dGVkIHRoZSBib3VuZGFyaWVzIGxpbWl0cyBhbmQgcmV0dXJuIHRoZW1cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHBlclxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByZWZlcmVuY2VcclxuICogQHBhcmFtIHtudW1iZXJ9IHBhZGRpbmdcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gYm91bmRhcmllc0VsZW1lbnQgLSBFbGVtZW50IHVzZWQgdG8gZGVmaW5lIHRoZSBib3VuZGFyaWVzXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZml4ZWRQb3NpdGlvbiAtIElzIGluIGZpeGVkIHBvc2l0aW9uIG1vZGVcclxuICogQHJldHVybnMge09iamVjdH0gQ29vcmRpbmF0ZXMgb2YgdGhlIGJvdW5kYXJpZXNcclxuICovXHJcbmZ1bmN0aW9uIGdldEJvdW5kYXJpZXMocG9wcGVyLCByZWZlcmVuY2UsIHBhZGRpbmcsIGJvdW5kYXJpZXNFbGVtZW50KSB7XHJcbiAgdmFyIGZpeGVkUG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IGZhbHNlO1xyXG5cclxuICAvLyBOT1RFOiAxIERPTSBhY2Nlc3MgaGVyZVxyXG5cclxuICB2YXIgYm91bmRhcmllcyA9IHsgdG9wOiAwLCBsZWZ0OiAwIH07XHJcbiAgdmFyIG9mZnNldFBhcmVudCA9IGZpeGVkUG9zaXRpb24gPyBnZXRGaXhlZFBvc2l0aW9uT2Zmc2V0UGFyZW50KHBvcHBlcikgOiBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50KHBvcHBlciwgcmVmZXJlbmNlKTtcclxuXHJcbiAgLy8gSGFuZGxlIHZpZXdwb3J0IGNhc2VcclxuICBpZiAoYm91bmRhcmllc0VsZW1lbnQgPT09ICd2aWV3cG9ydCcpIHtcclxuICAgIGJvdW5kYXJpZXMgPSBnZXRWaWV3cG9ydE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJ0Yml0cmFyeU5vZGUob2Zmc2V0UGFyZW50LCBmaXhlZFBvc2l0aW9uKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gSGFuZGxlIG90aGVyIGNhc2VzIGJhc2VkIG9uIERPTSBlbGVtZW50IHVzZWQgYXMgYm91bmRhcmllc1xyXG4gICAgdmFyIGJvdW5kYXJpZXNOb2RlID0gdm9pZCAwO1xyXG4gICAgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAnc2Nyb2xsUGFyZW50Jykge1xyXG4gICAgICBib3VuZGFyaWVzTm9kZSA9IGdldFNjcm9sbFBhcmVudChnZXRQYXJlbnROb2RlKHJlZmVyZW5jZSkpO1xyXG4gICAgICBpZiAoYm91bmRhcmllc05vZGUubm9kZU5hbWUgPT09ICdCT0RZJykge1xyXG4gICAgICAgIGJvdW5kYXJpZXNOb2RlID0gcG9wcGVyLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAnd2luZG93Jykge1xyXG4gICAgICBib3VuZGFyaWVzTm9kZSA9IHBvcHBlci5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGJvdW5kYXJpZXNOb2RlID0gYm91bmRhcmllc0VsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG9mZnNldHMgPSBnZXRPZmZzZXRSZWN0UmVsYXRpdmVUb0FyYml0cmFyeU5vZGUoYm91bmRhcmllc05vZGUsIG9mZnNldFBhcmVudCwgZml4ZWRQb3NpdGlvbik7XHJcblxyXG4gICAgLy8gSW4gY2FzZSBvZiBIVE1MLCB3ZSBuZWVkIGEgZGlmZmVyZW50IGNvbXB1dGF0aW9uXHJcbiAgICBpZiAoYm91bmRhcmllc05vZGUubm9kZU5hbWUgPT09ICdIVE1MJyAmJiAhaXNGaXhlZChvZmZzZXRQYXJlbnQpKSB7XHJcbiAgICAgIHZhciBfZ2V0V2luZG93U2l6ZXMgPSBnZXRXaW5kb3dTaXplcygpLFxyXG4gICAgICAgICAgaGVpZ2h0ID0gX2dldFdpbmRvd1NpemVzLmhlaWdodCxcclxuICAgICAgICAgIHdpZHRoID0gX2dldFdpbmRvd1NpemVzLndpZHRoO1xyXG5cclxuICAgICAgYm91bmRhcmllcy50b3AgKz0gb2Zmc2V0cy50b3AgLSBvZmZzZXRzLm1hcmdpblRvcDtcclxuICAgICAgYm91bmRhcmllcy5ib3R0b20gPSBoZWlnaHQgKyBvZmZzZXRzLnRvcDtcclxuICAgICAgYm91bmRhcmllcy5sZWZ0ICs9IG9mZnNldHMubGVmdCAtIG9mZnNldHMubWFyZ2luTGVmdDtcclxuICAgICAgYm91bmRhcmllcy5yaWdodCA9IHdpZHRoICsgb2Zmc2V0cy5sZWZ0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gZm9yIGFsbCB0aGUgb3RoZXIgRE9NIGVsZW1lbnRzLCB0aGlzIG9uZSBpcyBnb29kXHJcbiAgICAgIGJvdW5kYXJpZXMgPSBvZmZzZXRzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIHBhZGRpbmdzXHJcbiAgYm91bmRhcmllcy5sZWZ0ICs9IHBhZGRpbmc7XHJcbiAgYm91bmRhcmllcy50b3AgKz0gcGFkZGluZztcclxuICBib3VuZGFyaWVzLnJpZ2h0IC09IHBhZGRpbmc7XHJcbiAgYm91bmRhcmllcy5ib3R0b20gLT0gcGFkZGluZztcclxuXHJcbiAgcmV0dXJuIGJvdW5kYXJpZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFyZWEoX3JlZikge1xyXG4gIHZhciB3aWR0aCA9IF9yZWYud2lkdGgsXHJcbiAgICAgIGhlaWdodCA9IF9yZWYuaGVpZ2h0O1xyXG5cclxuICByZXR1cm4gd2lkdGggKiBoZWlnaHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVdGlsaXR5IHVzZWQgdG8gdHJhbnNmb3JtIHRoZSBgYXV0b2AgcGxhY2VtZW50IHRvIHRoZSBwbGFjZW1lbnQgd2l0aCBtb3JlXHJcbiAqIGF2YWlsYWJsZSBzcGFjZS5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gY29tcHV0ZUF1dG9QbGFjZW1lbnQocGxhY2VtZW50LCByZWZSZWN0LCBwb3BwZXIsIHJlZmVyZW5jZSwgYm91bmRhcmllc0VsZW1lbnQpIHtcclxuICB2YXIgcGFkZGluZyA9IGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIGFyZ3VtZW50c1s1XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzVdIDogMDtcclxuXHJcbiAgaWYgKHBsYWNlbWVudC5pbmRleE9mKCdhdXRvJykgPT09IC0xKSB7XHJcbiAgICByZXR1cm4gcGxhY2VtZW50O1xyXG4gIH1cclxuXHJcbiAgdmFyIGJvdW5kYXJpZXMgPSBnZXRCb3VuZGFyaWVzKHBvcHBlciwgcmVmZXJlbmNlLCBwYWRkaW5nLCBib3VuZGFyaWVzRWxlbWVudCk7XHJcblxyXG4gIHZhciByZWN0cyA9IHtcclxuICAgIHRvcDoge1xyXG4gICAgICB3aWR0aDogYm91bmRhcmllcy53aWR0aCxcclxuICAgICAgaGVpZ2h0OiByZWZSZWN0LnRvcCAtIGJvdW5kYXJpZXMudG9wXHJcbiAgICB9LFxyXG4gICAgcmlnaHQ6IHtcclxuICAgICAgd2lkdGg6IGJvdW5kYXJpZXMucmlnaHQgLSByZWZSZWN0LnJpZ2h0LFxyXG4gICAgICBoZWlnaHQ6IGJvdW5kYXJpZXMuaGVpZ2h0XHJcbiAgICB9LFxyXG4gICAgYm90dG9tOiB7XHJcbiAgICAgIHdpZHRoOiBib3VuZGFyaWVzLndpZHRoLFxyXG4gICAgICBoZWlnaHQ6IGJvdW5kYXJpZXMuYm90dG9tIC0gcmVmUmVjdC5ib3R0b21cclxuICAgIH0sXHJcbiAgICBsZWZ0OiB7XHJcbiAgICAgIHdpZHRoOiByZWZSZWN0LmxlZnQgLSBib3VuZGFyaWVzLmxlZnQsXHJcbiAgICAgIGhlaWdodDogYm91bmRhcmllcy5oZWlnaHRcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgc29ydGVkQXJlYXMgPSBPYmplY3Qua2V5cyhyZWN0cykubWFwKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgIHJldHVybiBfZXh0ZW5kcyQxKHtcclxuICAgICAga2V5OiBrZXlcclxuICAgIH0sIHJlY3RzW2tleV0sIHtcclxuICAgICAgYXJlYTogZ2V0QXJlYShyZWN0c1trZXldKVxyXG4gICAgfSk7XHJcbiAgfSkuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgcmV0dXJuIGIuYXJlYSAtIGEuYXJlYTtcclxuICB9KTtcclxuXHJcbiAgdmFyIGZpbHRlcmVkQXJlYXMgPSBzb3J0ZWRBcmVhcy5maWx0ZXIoZnVuY3Rpb24gKF9yZWYyKSB7XHJcbiAgICB2YXIgd2lkdGggPSBfcmVmMi53aWR0aCxcclxuICAgICAgICBoZWlnaHQgPSBfcmVmMi5oZWlnaHQ7XHJcbiAgICByZXR1cm4gd2lkdGggPj0gcG9wcGVyLmNsaWVudFdpZHRoICYmIGhlaWdodCA+PSBwb3BwZXIuY2xpZW50SGVpZ2h0O1xyXG4gIH0pO1xyXG5cclxuICB2YXIgY29tcHV0ZWRQbGFjZW1lbnQgPSBmaWx0ZXJlZEFyZWFzLmxlbmd0aCA+IDAgPyBmaWx0ZXJlZEFyZWFzWzBdLmtleSA6IHNvcnRlZEFyZWFzWzBdLmtleTtcclxuXHJcbiAgdmFyIHZhcmlhdGlvbiA9IHBsYWNlbWVudC5zcGxpdCgnLScpWzFdO1xyXG5cclxuICByZXR1cm4gY29tcHV0ZWRQbGFjZW1lbnQgKyAodmFyaWF0aW9uID8gJy0nICsgdmFyaWF0aW9uIDogJycpO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IG9mZnNldHMgdG8gdGhlIHJlZmVyZW5jZSBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhdGVcclxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXIgLSB0aGUgcG9wcGVyIGVsZW1lbnRcclxuICogQHBhcmFtIHtFbGVtZW50fSByZWZlcmVuY2UgLSB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgKHRoZSBwb3BwZXIgd2lsbCBiZSByZWxhdGl2ZSB0byB0aGlzKVxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGZpeGVkUG9zaXRpb24gLSBpcyBpbiBmaXhlZCBwb3NpdGlvbiBtb2RlXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBvZmZzZXRzIHdoaWNoIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSZWZlcmVuY2VPZmZzZXRzKHN0YXRlLCBwb3BwZXIsIHJlZmVyZW5jZSkge1xyXG4gIHZhciBmaXhlZFBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiBudWxsO1xyXG5cclxuICB2YXIgY29tbW9uT2Zmc2V0UGFyZW50ID0gZml4ZWRQb3NpdGlvbiA/IGdldEZpeGVkUG9zaXRpb25PZmZzZXRQYXJlbnQocG9wcGVyKSA6IGZpbmRDb21tb25PZmZzZXRQYXJlbnQocG9wcGVyLCByZWZlcmVuY2UpO1xyXG4gIHJldHVybiBnZXRPZmZzZXRSZWN0UmVsYXRpdmVUb0FyYml0cmFyeU5vZGUocmVmZXJlbmNlLCBjb21tb25PZmZzZXRQYXJlbnQsIGZpeGVkUG9zaXRpb24pO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBvdXRlciBzaXplcyBvZiB0aGUgZ2l2ZW4gZWxlbWVudCAob2Zmc2V0IHNpemUgKyBtYXJnaW5zKVxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IG9iamVjdCBjb250YWluaW5nIHdpZHRoIGFuZCBoZWlnaHQgcHJvcGVydGllc1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0T3V0ZXJTaXplcyhlbGVtZW50KSB7XHJcbiAgdmFyIHN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XHJcbiAgdmFyIHggPSBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5Ub3ApICsgcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luQm90dG9tKTtcclxuICB2YXIgeSA9IHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpbkxlZnQpICsgcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luUmlnaHQpO1xyXG4gIHZhciByZXN1bHQgPSB7XHJcbiAgICB3aWR0aDogZWxlbWVudC5vZmZzZXRXaWR0aCArIHksXHJcbiAgICBoZWlnaHQ6IGVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgeFxyXG4gIH07XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgb3Bwb3NpdGUgcGxhY2VtZW50IG9mIHRoZSBnaXZlbiBvbmVcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwbGFjZW1lbnRcclxuICogQHJldHVybnMge1N0cmluZ30gZmxpcHBlZCBwbGFjZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCkge1xyXG4gIHZhciBoYXNoID0geyBsZWZ0OiAncmlnaHQnLCByaWdodDogJ2xlZnQnLCBib3R0b206ICd0b3AnLCB0b3A6ICdib3R0b20nIH07XHJcbiAgcmV0dXJuIHBsYWNlbWVudC5yZXBsYWNlKC9sZWZ0fHJpZ2h0fGJvdHRvbXx0b3AvZywgZnVuY3Rpb24gKG1hdGNoZWQpIHtcclxuICAgIHJldHVybiBoYXNoW21hdGNoZWRdO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IG9mZnNldHMgdG8gdGhlIHBvcHBlclxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtPYmplY3R9IHBvc2l0aW9uIC0gQ1NTIHBvc2l0aW9uIHRoZSBQb3BwZXIgd2lsbCBnZXQgYXBwbGllZFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3BwZXIgLSB0aGUgcG9wcGVyIGVsZW1lbnRcclxuICogQHBhcmFtIHtPYmplY3R9IHJlZmVyZW5jZU9mZnNldHMgLSB0aGUgcmVmZXJlbmNlIG9mZnNldHMgKHRoZSBwb3BwZXIgd2lsbCBiZSByZWxhdGl2ZSB0byB0aGlzKVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcGxhY2VtZW50IC0gb25lIG9mIHRoZSB2YWxpZCBwbGFjZW1lbnQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBwb3BwZXJPZmZzZXRzIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9mZnNldHMgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXJcclxuICovXHJcbmZ1bmN0aW9uIGdldFBvcHBlck9mZnNldHMocG9wcGVyLCByZWZlcmVuY2VPZmZzZXRzLCBwbGFjZW1lbnQpIHtcclxuICBwbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuXHJcbiAgLy8gR2V0IHBvcHBlciBub2RlIHNpemVzXHJcbiAgdmFyIHBvcHBlclJlY3QgPSBnZXRPdXRlclNpemVzKHBvcHBlcik7XHJcblxyXG4gIC8vIEFkZCBwb3NpdGlvbiwgd2lkdGggYW5kIGhlaWdodCB0byBvdXIgb2Zmc2V0cyBvYmplY3RcclxuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IHtcclxuICAgIHdpZHRoOiBwb3BwZXJSZWN0LndpZHRoLFxyXG4gICAgaGVpZ2h0OiBwb3BwZXJSZWN0LmhlaWdodFxyXG4gIH07XHJcblxyXG4gIC8vIGRlcGVuZGluZyBieSB0aGUgcG9wcGVyIHBsYWNlbWVudCB3ZSBoYXZlIHRvIGNvbXB1dGUgaXRzIG9mZnNldHMgc2xpZ2h0bHkgZGlmZmVyZW50bHlcclxuICB2YXIgaXNIb3JpeiA9IFsncmlnaHQnLCAnbGVmdCddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTE7XHJcbiAgdmFyIG1haW5TaWRlID0gaXNIb3JpeiA/ICd0b3AnIDogJ2xlZnQnO1xyXG4gIHZhciBzZWNvbmRhcnlTaWRlID0gaXNIb3JpeiA/ICdsZWZ0JyA6ICd0b3AnO1xyXG4gIHZhciBtZWFzdXJlbWVudCA9IGlzSG9yaXogPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XHJcbiAgdmFyIHNlY29uZGFyeU1lYXN1cmVtZW50ID0gIWlzSG9yaXogPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XHJcblxyXG4gIHBvcHBlck9mZnNldHNbbWFpblNpZGVdID0gcmVmZXJlbmNlT2Zmc2V0c1ttYWluU2lkZV0gKyByZWZlcmVuY2VPZmZzZXRzW21lYXN1cmVtZW50XSAvIDIgLSBwb3BwZXJSZWN0W21lYXN1cmVtZW50XSAvIDI7XHJcbiAgaWYgKHBsYWNlbWVudCA9PT0gc2Vjb25kYXJ5U2lkZSkge1xyXG4gICAgcG9wcGVyT2Zmc2V0c1tzZWNvbmRhcnlTaWRlXSA9IHJlZmVyZW5jZU9mZnNldHNbc2Vjb25kYXJ5U2lkZV0gLSBwb3BwZXJSZWN0W3NlY29uZGFyeU1lYXN1cmVtZW50XTtcclxuICB9IGVsc2Uge1xyXG4gICAgcG9wcGVyT2Zmc2V0c1tzZWNvbmRhcnlTaWRlXSA9IHJlZmVyZW5jZU9mZnNldHNbZ2V0T3Bwb3NpdGVQbGFjZW1lbnQoc2Vjb25kYXJ5U2lkZSldO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHBvcHBlck9mZnNldHM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNaW1pY3MgdGhlIGBmaW5kYCBtZXRob2Qgb2YgQXJyYXlcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7QXJyYXl9IGFyclxyXG4gKiBAYXJndW1lbnQgcHJvcFxyXG4gKiBAYXJndW1lbnQgdmFsdWVcclxuICogQHJldHVybnMgaW5kZXggb3IgLTFcclxuICovXHJcbmZ1bmN0aW9uIGZpbmQoYXJyLCBjaGVjaykge1xyXG4gIC8vIHVzZSBuYXRpdmUgZmluZCBpZiBzdXBwb3J0ZWRcclxuICBpZiAoQXJyYXkucHJvdG90eXBlLmZpbmQpIHtcclxuICAgIHJldHVybiBhcnIuZmluZChjaGVjayk7XHJcbiAgfVxyXG5cclxuICAvLyB1c2UgYGZpbHRlcmAgdG8gb2J0YWluIHRoZSBzYW1lIGJlaGF2aW9yIG9mIGBmaW5kYFxyXG4gIHJldHVybiBhcnIuZmlsdGVyKGNoZWNrKVswXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0aGUgaW5kZXggb2YgdGhlIG1hdGNoaW5nIG9iamVjdFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtBcnJheX0gYXJyXHJcbiAqIEBhcmd1bWVudCBwcm9wXHJcbiAqIEBhcmd1bWVudCB2YWx1ZVxyXG4gKiBAcmV0dXJucyBpbmRleCBvciAtMVxyXG4gKi9cclxuZnVuY3Rpb24gZmluZEluZGV4KGFyciwgcHJvcCwgdmFsdWUpIHtcclxuICAvLyB1c2UgbmF0aXZlIGZpbmRJbmRleCBpZiBzdXBwb3J0ZWRcclxuICBpZiAoQXJyYXkucHJvdG90eXBlLmZpbmRJbmRleCkge1xyXG4gICAgcmV0dXJuIGFyci5maW5kSW5kZXgoZnVuY3Rpb24gKGN1cikge1xyXG4gICAgICByZXR1cm4gY3VyW3Byb3BdID09PSB2YWx1ZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gdXNlIGBmaW5kYCArIGBpbmRleE9mYCBpZiBgZmluZEluZGV4YCBpc24ndCBzdXBwb3J0ZWRcclxuICB2YXIgbWF0Y2ggPSBmaW5kKGFyciwgZnVuY3Rpb24gKG9iaikge1xyXG4gICAgcmV0dXJuIG9ialtwcm9wXSA9PT0gdmFsdWU7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGFyci5pbmRleE9mKG1hdGNoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIExvb3AgdHJvdWdoIHRoZSBsaXN0IG9mIG1vZGlmaWVycyBhbmQgcnVuIHRoZW0gaW4gb3JkZXIsXHJcbiAqIGVhY2ggb2YgdGhlbSB3aWxsIHRoZW4gZWRpdCB0aGUgZGF0YSBvYmplY3QuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge2RhdGFPYmplY3R9IGRhdGFcclxuICogQHBhcmFtIHtBcnJheX0gbW9kaWZpZXJzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBlbmRzIC0gT3B0aW9uYWwgbW9kaWZpZXIgbmFtZSB1c2VkIGFzIHN0b3BwZXJcclxuICogQHJldHVybnMge2RhdGFPYmplY3R9XHJcbiAqL1xyXG5mdW5jdGlvbiBydW5Nb2RpZmllcnMobW9kaWZpZXJzLCBkYXRhLCBlbmRzKSB7XHJcbiAgdmFyIG1vZGlmaWVyc1RvUnVuID0gZW5kcyA9PT0gdW5kZWZpbmVkID8gbW9kaWZpZXJzIDogbW9kaWZpZXJzLnNsaWNlKDAsIGZpbmRJbmRleChtb2RpZmllcnMsICduYW1lJywgZW5kcykpO1xyXG5cclxuICBtb2RpZmllcnNUb1J1bi5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xyXG4gICAgaWYgKG1vZGlmaWVyWydmdW5jdGlvbiddKSB7XHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZG90LW5vdGF0aW9uXHJcbiAgICAgIGNvbnNvbGUud2FybignYG1vZGlmaWVyLmZ1bmN0aW9uYCBpcyBkZXByZWNhdGVkLCB1c2UgYG1vZGlmaWVyLmZuYCEnKTtcclxuICAgIH1cclxuICAgIHZhciBmbiA9IG1vZGlmaWVyWydmdW5jdGlvbiddIHx8IG1vZGlmaWVyLmZuOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGRvdC1ub3RhdGlvblxyXG4gICAgaWYgKG1vZGlmaWVyLmVuYWJsZWQgJiYgaXNGdW5jdGlvbihmbikpIHtcclxuICAgICAgLy8gQWRkIHByb3BlcnRpZXMgdG8gb2Zmc2V0cyB0byBtYWtlIHRoZW0gYSBjb21wbGV0ZSBjbGllbnRSZWN0IG9iamVjdFxyXG4gICAgICAvLyB3ZSBkbyB0aGlzIGJlZm9yZSBlYWNoIG1vZGlmaWVyIHRvIG1ha2Ugc3VyZSB0aGUgcHJldmlvdXMgb25lIGRvZXNuJ3RcclxuICAgICAgLy8gbWVzcyB3aXRoIHRoZXNlIHZhbHVlc1xyXG4gICAgICBkYXRhLm9mZnNldHMucG9wcGVyID0gZ2V0Q2xpZW50UmVjdChkYXRhLm9mZnNldHMucG9wcGVyKTtcclxuICAgICAgZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSA9IGdldENsaWVudFJlY3QoZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSk7XHJcblxyXG4gICAgICBkYXRhID0gZm4oZGF0YSwgbW9kaWZpZXIpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBwb3BwZXIsIGNvbXB1dGluZyB0aGUgbmV3IG9mZnNldHMgYW5kIGFwcGx5aW5nXHJcbiAqIHRoZSBuZXcgc3R5bGUuPGJyIC8+XHJcbiAqIFByZWZlciBgc2NoZWR1bGVVcGRhdGVgIG92ZXIgYHVwZGF0ZWAgYmVjYXVzZSBvZiBwZXJmb3JtYW5jZSByZWFzb25zLlxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuICAvLyBpZiBwb3BwZXIgaXMgZGVzdHJveWVkLCBkb24ndCBwZXJmb3JtIGFueSBmdXJ0aGVyIHVwZGF0ZVxyXG4gIGlmICh0aGlzLnN0YXRlLmlzRGVzdHJveWVkKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICB2YXIgZGF0YSA9IHtcclxuICAgIGluc3RhbmNlOiB0aGlzLFxyXG4gICAgc3R5bGVzOiB7fSxcclxuICAgIGFycm93U3R5bGVzOiB7fSxcclxuICAgIGF0dHJpYnV0ZXM6IHt9LFxyXG4gICAgZmxpcHBlZDogZmFsc2UsXHJcbiAgICBvZmZzZXRzOiB7fVxyXG4gIH07XHJcblxyXG4gIC8vIGNvbXB1dGUgcmVmZXJlbmNlIGVsZW1lbnQgb2Zmc2V0c1xyXG4gIGRhdGEub2Zmc2V0cy5yZWZlcmVuY2UgPSBnZXRSZWZlcmVuY2VPZmZzZXRzKHRoaXMuc3RhdGUsIHRoaXMucG9wcGVyLCB0aGlzLnJlZmVyZW5jZSwgdGhpcy5vcHRpb25zLnBvc2l0aW9uRml4ZWQpO1xyXG5cclxuICAvLyBjb21wdXRlIGF1dG8gcGxhY2VtZW50LCBzdG9yZSBwbGFjZW1lbnQgaW5zaWRlIHRoZSBkYXRhIG9iamVjdCxcclxuICAvLyBtb2RpZmllcnMgd2lsbCBiZSBhYmxlIHRvIGVkaXQgYHBsYWNlbWVudGAgaWYgbmVlZGVkXHJcbiAgLy8gYW5kIHJlZmVyIHRvIG9yaWdpbmFsUGxhY2VtZW50IHRvIGtub3cgdGhlIG9yaWdpbmFsIHZhbHVlXHJcbiAgZGF0YS5wbGFjZW1lbnQgPSBjb21wdXRlQXV0b1BsYWNlbWVudCh0aGlzLm9wdGlvbnMucGxhY2VtZW50LCBkYXRhLm9mZnNldHMucmVmZXJlbmNlLCB0aGlzLnBvcHBlciwgdGhpcy5yZWZlcmVuY2UsIHRoaXMub3B0aW9ucy5tb2RpZmllcnMuZmxpcC5ib3VuZGFyaWVzRWxlbWVudCwgdGhpcy5vcHRpb25zLm1vZGlmaWVycy5mbGlwLnBhZGRpbmcpO1xyXG5cclxuICAvLyBzdG9yZSB0aGUgY29tcHV0ZWQgcGxhY2VtZW50IGluc2lkZSBgb3JpZ2luYWxQbGFjZW1lbnRgXHJcbiAgZGF0YS5vcmlnaW5hbFBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50O1xyXG5cclxuICBkYXRhLnBvc2l0aW9uRml4ZWQgPSB0aGlzLm9wdGlvbnMucG9zaXRpb25GaXhlZDtcclxuXHJcbiAgLy8gY29tcHV0ZSB0aGUgcG9wcGVyIG9mZnNldHNcclxuICBkYXRhLm9mZnNldHMucG9wcGVyID0gZ2V0UG9wcGVyT2Zmc2V0cyh0aGlzLnBvcHBlciwgZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSwgZGF0YS5wbGFjZW1lbnQpO1xyXG5cclxuICBkYXRhLm9mZnNldHMucG9wcGVyLnBvc2l0aW9uID0gdGhpcy5vcHRpb25zLnBvc2l0aW9uRml4ZWQgPyAnZml4ZWQnIDogJ2Fic29sdXRlJztcclxuXHJcbiAgLy8gcnVuIHRoZSBtb2RpZmllcnNcclxuICBkYXRhID0gcnVuTW9kaWZpZXJzKHRoaXMubW9kaWZpZXJzLCBkYXRhKTtcclxuXHJcbiAgLy8gdGhlIGZpcnN0IGB1cGRhdGVgIHdpbGwgY2FsbCBgb25DcmVhdGVgIGNhbGxiYWNrXHJcbiAgLy8gdGhlIG90aGVyIG9uZXMgd2lsbCBjYWxsIGBvblVwZGF0ZWAgY2FsbGJhY2tcclxuICBpZiAoIXRoaXMuc3RhdGUuaXNDcmVhdGVkKSB7XHJcbiAgICB0aGlzLnN0YXRlLmlzQ3JlYXRlZCA9IHRydWU7XHJcbiAgICB0aGlzLm9wdGlvbnMub25DcmVhdGUoZGF0YSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMub3B0aW9ucy5vblVwZGF0ZShkYXRhKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIZWxwZXIgdXNlZCB0byBrbm93IGlmIHRoZSBnaXZlbiBtb2RpZmllciBpcyBlbmFibGVkLlxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc01vZGlmaWVyRW5hYmxlZChtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSkge1xyXG4gIHJldHVybiBtb2RpZmllcnMuc29tZShmdW5jdGlvbiAoX3JlZikge1xyXG4gICAgdmFyIG5hbWUgPSBfcmVmLm5hbWUsXHJcbiAgICAgICAgZW5hYmxlZCA9IF9yZWYuZW5hYmxlZDtcclxuICAgIHJldHVybiBlbmFibGVkICYmIG5hbWUgPT09IG1vZGlmaWVyTmFtZTtcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgcHJlZml4ZWQgc3VwcG9ydGVkIHByb3BlcnR5IG5hbWVcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwcm9wZXJ0eSAoY2FtZWxDYXNlKVxyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBwcmVmaXhlZCBwcm9wZXJ0eSAoY2FtZWxDYXNlIG9yIFBhc2NhbENhc2UsIGRlcGVuZGluZyBvbiB0aGUgdmVuZG9yIHByZWZpeClcclxuICovXHJcbmZ1bmN0aW9uIGdldFN1cHBvcnRlZFByb3BlcnR5TmFtZShwcm9wZXJ0eSkge1xyXG4gIHZhciBwcmVmaXhlcyA9IFtmYWxzZSwgJ21zJywgJ1dlYmtpdCcsICdNb3onLCAnTyddO1xyXG4gIHZhciB1cHBlclByb3AgPSBwcm9wZXJ0eS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnNsaWNlKDEpO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgcHJlZml4ID0gcHJlZml4ZXNbaV07XHJcbiAgICB2YXIgdG9DaGVjayA9IHByZWZpeCA/ICcnICsgcHJlZml4ICsgdXBwZXJQcm9wIDogcHJvcGVydHk7XHJcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50LmJvZHkuc3R5bGVbdG9DaGVja10gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHJldHVybiB0b0NoZWNrO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIERlc3Ryb3kgdGhlIHBvcHBlclxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICovXHJcbmZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgdGhpcy5zdGF0ZS5pc0Rlc3Ryb3llZCA9IHRydWU7XHJcblxyXG4gIC8vIHRvdWNoIERPTSBvbmx5IGlmIGBhcHBseVN0eWxlYCBtb2RpZmllciBpcyBlbmFibGVkXHJcbiAgaWYgKGlzTW9kaWZpZXJFbmFibGVkKHRoaXMubW9kaWZpZXJzLCAnYXBwbHlTdHlsZScpKSB7XHJcbiAgICB0aGlzLnBvcHBlci5yZW1vdmVBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50Jyk7XHJcbiAgICB0aGlzLnBvcHBlci5zdHlsZS5wb3NpdGlvbiA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGUudG9wID0gJyc7XHJcbiAgICB0aGlzLnBvcHBlci5zdHlsZS5sZWZ0ID0gJyc7XHJcbiAgICB0aGlzLnBvcHBlci5zdHlsZS5yaWdodCA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGUuYm90dG9tID0gJyc7XHJcbiAgICB0aGlzLnBvcHBlci5zdHlsZS53aWxsQ2hhbmdlID0gJyc7XHJcbiAgICB0aGlzLnBvcHBlci5zdHlsZVtnZXRTdXBwb3J0ZWRQcm9wZXJ0eU5hbWUoJ3RyYW5zZm9ybScpXSA9ICcnO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5kaXNhYmxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuXHJcbiAgLy8gcmVtb3ZlIHRoZSBwb3BwZXIgaWYgdXNlciBleHBsaWNpdHkgYXNrZWQgZm9yIHRoZSBkZWxldGlvbiBvbiBkZXN0cm95XHJcbiAgLy8gZG8gbm90IHVzZSBgcmVtb3ZlYCBiZWNhdXNlIElFMTEgZG9lc24ndCBzdXBwb3J0IGl0XHJcbiAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdmVPbkRlc3Ryb3kpIHtcclxuICAgIHRoaXMucG9wcGVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5wb3BwZXIpO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgd2luZG93IGFzc29jaWF0ZWQgd2l0aCB0aGUgZWxlbWVudFxyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybnMge1dpbmRvd31cclxuICovXHJcbmZ1bmN0aW9uIGdldFdpbmRvdyhlbGVtZW50KSB7XHJcbiAgdmFyIG93bmVyRG9jdW1lbnQgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQ7XHJcbiAgcmV0dXJuIG93bmVyRG9jdW1lbnQgPyBvd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IDogd2luZG93O1xyXG59XHJcblxyXG5mdW5jdGlvbiBhdHRhY2hUb1Njcm9sbFBhcmVudHMoc2Nyb2xsUGFyZW50LCBldmVudCwgY2FsbGJhY2ssIHNjcm9sbFBhcmVudHMpIHtcclxuICB2YXIgaXNCb2R5ID0gc2Nyb2xsUGFyZW50Lm5vZGVOYW1lID09PSAnQk9EWSc7XHJcbiAgdmFyIHRhcmdldCA9IGlzQm9keSA/IHNjcm9sbFBhcmVudC5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IDogc2Nyb2xsUGFyZW50O1xyXG4gIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaywgeyBwYXNzaXZlOiB0cnVlIH0pO1xyXG5cclxuICBpZiAoIWlzQm9keSkge1xyXG4gICAgYXR0YWNoVG9TY3JvbGxQYXJlbnRzKGdldFNjcm9sbFBhcmVudCh0YXJnZXQucGFyZW50Tm9kZSksIGV2ZW50LCBjYWxsYmFjaywgc2Nyb2xsUGFyZW50cyk7XHJcbiAgfVxyXG4gIHNjcm9sbFBhcmVudHMucHVzaCh0YXJnZXQpO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0dXAgbmVlZGVkIGV2ZW50IGxpc3RlbmVycyB1c2VkIHRvIHVwZGF0ZSB0aGUgcG9wcGVyIHBvc2l0aW9uXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gc2V0dXBFdmVudExpc3RlbmVycyhyZWZlcmVuY2UsIG9wdGlvbnMsIHN0YXRlLCB1cGRhdGVCb3VuZCkge1xyXG4gIC8vIFJlc2l6ZSBldmVudCBsaXN0ZW5lciBvbiB3aW5kb3dcclxuICBzdGF0ZS51cGRhdGVCb3VuZCA9IHVwZGF0ZUJvdW5kO1xyXG4gIGdldFdpbmRvdyhyZWZlcmVuY2UpLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHN0YXRlLnVwZGF0ZUJvdW5kLCB7IHBhc3NpdmU6IHRydWUgfSk7XHJcblxyXG4gIC8vIFNjcm9sbCBldmVudCBsaXN0ZW5lciBvbiBzY3JvbGwgcGFyZW50c1xyXG4gIHZhciBzY3JvbGxFbGVtZW50ID0gZ2V0U2Nyb2xsUGFyZW50KHJlZmVyZW5jZSk7XHJcbiAgYXR0YWNoVG9TY3JvbGxQYXJlbnRzKHNjcm9sbEVsZW1lbnQsICdzY3JvbGwnLCBzdGF0ZS51cGRhdGVCb3VuZCwgc3RhdGUuc2Nyb2xsUGFyZW50cyk7XHJcbiAgc3RhdGUuc2Nyb2xsRWxlbWVudCA9IHNjcm9sbEVsZW1lbnQ7XHJcbiAgc3RhdGUuZXZlbnRzRW5hYmxlZCA9IHRydWU7XHJcblxyXG4gIHJldHVybiBzdGF0ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEl0IHdpbGwgYWRkIHJlc2l6ZS9zY3JvbGwgZXZlbnRzIGFuZCBzdGFydCByZWNhbGN1bGF0aW5nXHJcbiAqIHBvc2l0aW9uIG9mIHRoZSBwb3BwZXIgZWxlbWVudCB3aGVuIHRoZXkgYXJlIHRyaWdnZXJlZC5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBlbmFibGVFdmVudExpc3RlbmVycygpIHtcclxuICBpZiAoIXRoaXMuc3RhdGUuZXZlbnRzRW5hYmxlZCkge1xyXG4gICAgdGhpcy5zdGF0ZSA9IHNldHVwRXZlbnRMaXN0ZW5lcnModGhpcy5yZWZlcmVuY2UsIHRoaXMub3B0aW9ucywgdGhpcy5zdGF0ZSwgdGhpcy5zY2hlZHVsZVVwZGF0ZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyB1c2VkIHRvIHVwZGF0ZSB0aGUgcG9wcGVyIHBvc2l0aW9uXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMocmVmZXJlbmNlLCBzdGF0ZSkge1xyXG4gIC8vIFJlbW92ZSByZXNpemUgZXZlbnQgbGlzdGVuZXIgb24gd2luZG93XHJcbiAgZ2V0V2luZG93KHJlZmVyZW5jZSkucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgc3RhdGUudXBkYXRlQm91bmQpO1xyXG5cclxuICAvLyBSZW1vdmUgc2Nyb2xsIGV2ZW50IGxpc3RlbmVyIG9uIHNjcm9sbCBwYXJlbnRzXHJcbiAgc3RhdGUuc2Nyb2xsUGFyZW50cy5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzdGF0ZS51cGRhdGVCb3VuZCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIFJlc2V0IHN0YXRlXHJcbiAgc3RhdGUudXBkYXRlQm91bmQgPSBudWxsO1xyXG4gIHN0YXRlLnNjcm9sbFBhcmVudHMgPSBbXTtcclxuICBzdGF0ZS5zY3JvbGxFbGVtZW50ID0gbnVsbDtcclxuICBzdGF0ZS5ldmVudHNFbmFibGVkID0gZmFsc2U7XHJcbiAgcmV0dXJuIHN0YXRlO1xyXG59XHJcblxyXG4vKipcclxuICogSXQgd2lsbCByZW1vdmUgcmVzaXplL3Njcm9sbCBldmVudHMgYW5kIHdvbid0IHJlY2FsY3VsYXRlIHBvcHBlciBwb3NpdGlvblxyXG4gKiB3aGVuIHRoZXkgYXJlIHRyaWdnZXJlZC4gSXQgYWxzbyB3b24ndCB0cmlnZ2VyIG9uVXBkYXRlIGNhbGxiYWNrIGFueW1vcmUsXHJcbiAqIHVubGVzcyB5b3UgY2FsbCBgdXBkYXRlYCBtZXRob2QgbWFudWFsbHkuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlclxyXG4gKi9cclxuZnVuY3Rpb24gZGlzYWJsZUV2ZW50TGlzdGVuZXJzKCkge1xyXG4gIGlmICh0aGlzLnN0YXRlLmV2ZW50c0VuYWJsZWQpIHtcclxuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuc2NoZWR1bGVVcGRhdGUpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHJlbW92ZUV2ZW50TGlzdGVuZXJzKHRoaXMucmVmZXJlbmNlLCB0aGlzLnN0YXRlKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUZWxscyBpZiBhIGdpdmVuIGlucHV0IGlzIGEgbnVtYmVyXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0geyp9IGlucHV0IHRvIGNoZWNrXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc051bWVyaWMobikge1xyXG4gIHJldHVybiBuICE9PSAnJyAmJiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIHN0eWxlIHRvIHRoZSBnaXZlbiBwb3BwZXJcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudCAtIEVsZW1lbnQgdG8gYXBwbHkgdGhlIHN0eWxlIHRvXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBzdHlsZXNcclxuICogT2JqZWN0IHdpdGggYSBsaXN0IG9mIHByb3BlcnRpZXMgYW5kIHZhbHVlcyB3aGljaCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIHNldFN0eWxlcyhlbGVtZW50LCBzdHlsZXMpIHtcclxuICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcclxuICAgIHZhciB1bml0ID0gJyc7XHJcbiAgICAvLyBhZGQgdW5pdCBpZiB0aGUgdmFsdWUgaXMgbnVtZXJpYyBhbmQgaXMgb25lIG9mIHRoZSBmb2xsb3dpbmdcclxuICAgIGlmIChbJ3dpZHRoJywgJ2hlaWdodCcsICd0b3AnLCAncmlnaHQnLCAnYm90dG9tJywgJ2xlZnQnXS5pbmRleE9mKHByb3ApICE9PSAtMSAmJiBpc051bWVyaWMoc3R5bGVzW3Byb3BdKSkge1xyXG4gICAgICB1bml0ID0gJ3B4JztcclxuICAgIH1cclxuICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSBzdHlsZXNbcHJvcF0gKyB1bml0O1xyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IHRoZSBhdHRyaWJ1dGVzIHRvIHRoZSBnaXZlbiBwb3BwZXJcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudCAtIEVsZW1lbnQgdG8gYXBwbHkgdGhlIGF0dHJpYnV0ZXMgdG9cclxuICogQGFyZ3VtZW50IHtPYmplY3R9IHN0eWxlc1xyXG4gKiBPYmplY3Qgd2l0aCBhIGxpc3Qgb2YgcHJvcGVydGllcyBhbmQgdmFsdWVzIHdoaWNoIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gc2V0QXR0cmlidXRlcyhlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XHJcbiAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xyXG4gICAgdmFyIHZhbHVlID0gYXR0cmlidXRlc1twcm9wXTtcclxuICAgIGlmICh2YWx1ZSAhPT0gZmFsc2UpIHtcclxuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cmlidXRlc1twcm9wXSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShwcm9wKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBgdXBkYXRlYCBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEuc3R5bGVzIC0gTGlzdCBvZiBzdHlsZSBwcm9wZXJ0aWVzIC0gdmFsdWVzIHRvIGFwcGx5IHRvIHBvcHBlciBlbGVtZW50XHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhLmF0dHJpYnV0ZXMgLSBMaXN0IG9mIGF0dHJpYnV0ZSBwcm9wZXJ0aWVzIC0gdmFsdWVzIHRvIGFwcGx5IHRvIHBvcHBlciBlbGVtZW50XHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIHNhbWUgZGF0YSBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIGFwcGx5U3R5bGUoZGF0YSkge1xyXG4gIC8vIGFueSBwcm9wZXJ0eSBwcmVzZW50IGluIGBkYXRhLnN0eWxlc2Agd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIsXHJcbiAgLy8gaW4gdGhpcyB3YXkgd2UgY2FuIG1ha2UgdGhlIDNyZCBwYXJ0eSBtb2RpZmllcnMgYWRkIGN1c3RvbSBzdHlsZXMgdG8gaXRcclxuICAvLyBCZSBhd2FyZSwgbW9kaWZpZXJzIGNvdWxkIG92ZXJyaWRlIHRoZSBwcm9wZXJ0aWVzIGRlZmluZWQgaW4gdGhlIHByZXZpb3VzXHJcbiAgLy8gbGluZXMgb2YgdGhpcyBtb2RpZmllciFcclxuICBzZXRTdHlsZXMoZGF0YS5pbnN0YW5jZS5wb3BwZXIsIGRhdGEuc3R5bGVzKTtcclxuXHJcbiAgLy8gYW55IHByb3BlcnR5IHByZXNlbnQgaW4gYGRhdGEuYXR0cmlidXRlc2Agd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIsXHJcbiAgLy8gdGhleSB3aWxsIGJlIHNldCBhcyBIVE1MIGF0dHJpYnV0ZXMgb2YgdGhlIGVsZW1lbnRcclxuICBzZXRBdHRyaWJ1dGVzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLmF0dHJpYnV0ZXMpO1xyXG5cclxuICAvLyBpZiBhcnJvd0VsZW1lbnQgaXMgZGVmaW5lZCBhbmQgYXJyb3dTdHlsZXMgaGFzIHNvbWUgcHJvcGVydGllc1xyXG4gIGlmIChkYXRhLmFycm93RWxlbWVudCAmJiBPYmplY3Qua2V5cyhkYXRhLmFycm93U3R5bGVzKS5sZW5ndGgpIHtcclxuICAgIHNldFN0eWxlcyhkYXRhLmFycm93RWxlbWVudCwgZGF0YS5hcnJvd1N0eWxlcyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCB0aGUgeC1wbGFjZW1lbnQgYXR0cmlidXRlIGJlZm9yZSBldmVyeXRoaW5nIGVsc2UgYmVjYXVzZSBpdCBjb3VsZCBiZSB1c2VkXHJcbiAqIHRvIGFkZCBtYXJnaW5zIHRvIHRoZSBwb3BwZXIgbWFyZ2lucyBuZWVkcyB0byBiZSBjYWxjdWxhdGVkIHRvIGdldCB0aGVcclxuICogY29ycmVjdCBwb3BwZXIgb2Zmc2V0cy5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLm1vZGlmaWVyc1xyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByZWZlcmVuY2UgLSBUaGUgcmVmZXJlbmNlIGVsZW1lbnQgdXNlZCB0byBwb3NpdGlvbiB0aGUgcG9wcGVyXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHBlciAtIFRoZSBIVE1MIGVsZW1lbnQgdXNlZCBhcyBwb3BwZXJcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBQb3BwZXIuanMgb3B0aW9uc1xyXG4gKi9cclxuZnVuY3Rpb24gYXBwbHlTdHlsZU9uTG9hZChyZWZlcmVuY2UsIHBvcHBlciwgb3B0aW9ucywgbW9kaWZpZXJPcHRpb25zLCBzdGF0ZSkge1xyXG4gIC8vIGNvbXB1dGUgcmVmZXJlbmNlIGVsZW1lbnQgb2Zmc2V0c1xyXG4gIHZhciByZWZlcmVuY2VPZmZzZXRzID0gZ2V0UmVmZXJlbmNlT2Zmc2V0cyhzdGF0ZSwgcG9wcGVyLCByZWZlcmVuY2UsIG9wdGlvbnMucG9zaXRpb25GaXhlZCk7XHJcblxyXG4gIC8vIGNvbXB1dGUgYXV0byBwbGFjZW1lbnQsIHN0b3JlIHBsYWNlbWVudCBpbnNpZGUgdGhlIGRhdGEgb2JqZWN0LFxyXG4gIC8vIG1vZGlmaWVycyB3aWxsIGJlIGFibGUgdG8gZWRpdCBgcGxhY2VtZW50YCBpZiBuZWVkZWRcclxuICAvLyBhbmQgcmVmZXIgdG8gb3JpZ2luYWxQbGFjZW1lbnQgdG8ga25vdyB0aGUgb3JpZ2luYWwgdmFsdWVcclxuICB2YXIgcGxhY2VtZW50ID0gY29tcHV0ZUF1dG9QbGFjZW1lbnQob3B0aW9ucy5wbGFjZW1lbnQsIHJlZmVyZW5jZU9mZnNldHMsIHBvcHBlciwgcmVmZXJlbmNlLCBvcHRpb25zLm1vZGlmaWVycy5mbGlwLmJvdW5kYXJpZXNFbGVtZW50LCBvcHRpb25zLm1vZGlmaWVycy5mbGlwLnBhZGRpbmcpO1xyXG5cclxuICBwb3BwZXIuc2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcsIHBsYWNlbWVudCk7XHJcblxyXG4gIC8vIEFwcGx5IGBwb3NpdGlvbmAgdG8gcG9wcGVyIGJlZm9yZSBhbnl0aGluZyBlbHNlIGJlY2F1c2VcclxuICAvLyB3aXRob3V0IHRoZSBwb3NpdGlvbiBhcHBsaWVkIHdlIGNhbid0IGd1YXJhbnRlZSBjb3JyZWN0IGNvbXB1dGF0aW9uc1xyXG4gIHNldFN0eWxlcyhwb3BwZXIsIHsgcG9zaXRpb246IG9wdGlvbnMucG9zaXRpb25GaXhlZCA/ICdmaXhlZCcgOiAnYWJzb2x1dGUnIH0pO1xyXG5cclxuICByZXR1cm4gb3B0aW9ucztcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBgdXBkYXRlYCBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBjb21wdXRlU3R5bGUoZGF0YSwgb3B0aW9ucykge1xyXG4gIHZhciB4ID0gb3B0aW9ucy54LFxyXG4gICAgICB5ID0gb3B0aW9ucy55O1xyXG4gIHZhciBwb3BwZXIgPSBkYXRhLm9mZnNldHMucG9wcGVyO1xyXG5cclxuICAvLyBSZW1vdmUgdGhpcyBsZWdhY3kgc3VwcG9ydCBpbiBQb3BwZXIuanMgdjJcclxuXHJcbiAgdmFyIGxlZ2FjeUdwdUFjY2VsZXJhdGlvbk9wdGlvbiA9IGZpbmQoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsIGZ1bmN0aW9uIChtb2RpZmllcikge1xyXG4gICAgcmV0dXJuIG1vZGlmaWVyLm5hbWUgPT09ICdhcHBseVN0eWxlJztcclxuICB9KS5ncHVBY2NlbGVyYXRpb247XHJcbiAgaWYgKGxlZ2FjeUdwdUFjY2VsZXJhdGlvbk9wdGlvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBjb25zb2xlLndhcm4oJ1dBUk5JTkc6IGBncHVBY2NlbGVyYXRpb25gIG9wdGlvbiBtb3ZlZCB0byBgY29tcHV0ZVN0eWxlYCBtb2RpZmllciBhbmQgd2lsbCBub3QgYmUgc3VwcG9ydGVkIGluIGZ1dHVyZSB2ZXJzaW9ucyBvZiBQb3BwZXIuanMhJyk7XHJcbiAgfVxyXG4gIHZhciBncHVBY2NlbGVyYXRpb24gPSBsZWdhY3lHcHVBY2NlbGVyYXRpb25PcHRpb24gIT09IHVuZGVmaW5lZCA/IGxlZ2FjeUdwdUFjY2VsZXJhdGlvbk9wdGlvbiA6IG9wdGlvbnMuZ3B1QWNjZWxlcmF0aW9uO1xyXG5cclxuICB2YXIgb2Zmc2V0UGFyZW50ID0gZ2V0T2Zmc2V0UGFyZW50KGRhdGEuaW5zdGFuY2UucG9wcGVyKTtcclxuICB2YXIgb2Zmc2V0UGFyZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChvZmZzZXRQYXJlbnQpO1xyXG5cclxuICAvLyBTdHlsZXNcclxuICB2YXIgc3R5bGVzID0ge1xyXG4gICAgcG9zaXRpb246IHBvcHBlci5wb3NpdGlvblxyXG4gIH07XHJcblxyXG4gIC8vIEF2b2lkIGJsdXJyeSB0ZXh0IGJ5IHVzaW5nIGZ1bGwgcGl4ZWwgaW50ZWdlcnMuXHJcbiAgLy8gRm9yIHBpeGVsLXBlcmZlY3QgcG9zaXRpb25pbmcsIHRvcC9ib3R0b20gcHJlZmVycyByb3VuZGVkXHJcbiAgLy8gdmFsdWVzLCB3aGlsZSBsZWZ0L3JpZ2h0IHByZWZlcnMgZmxvb3JlZCB2YWx1ZXMuXHJcbiAgdmFyIG9mZnNldHMgPSB7XHJcbiAgICBsZWZ0OiBNYXRoLmZsb29yKHBvcHBlci5sZWZ0KSxcclxuICAgIHRvcDogTWF0aC5yb3VuZChwb3BwZXIudG9wKSxcclxuICAgIGJvdHRvbTogTWF0aC5yb3VuZChwb3BwZXIuYm90dG9tKSxcclxuICAgIHJpZ2h0OiBNYXRoLmZsb29yKHBvcHBlci5yaWdodClcclxuICB9O1xyXG5cclxuICB2YXIgc2lkZUEgPSB4ID09PSAnYm90dG9tJyA/ICd0b3AnIDogJ2JvdHRvbSc7XHJcbiAgdmFyIHNpZGVCID0geSA9PT0gJ3JpZ2h0JyA/ICdsZWZ0JyA6ICdyaWdodCc7XHJcblxyXG4gIC8vIGlmIGdwdUFjY2VsZXJhdGlvbiBpcyBzZXQgdG8gYHRydWVgIGFuZCB0cmFuc2Zvcm0gaXMgc3VwcG9ydGVkLFxyXG4gIC8vICB3ZSB1c2UgYHRyYW5zbGF0ZTNkYCB0byBhcHBseSB0aGUgcG9zaXRpb24gdG8gdGhlIHBvcHBlciB3ZVxyXG4gIC8vIGF1dG9tYXRpY2FsbHkgdXNlIHRoZSBzdXBwb3J0ZWQgcHJlZml4ZWQgdmVyc2lvbiBpZiBuZWVkZWRcclxuICB2YXIgcHJlZml4ZWRQcm9wZXJ0eSA9IGdldFN1cHBvcnRlZFByb3BlcnR5TmFtZSgndHJhbnNmb3JtJyk7XHJcblxyXG4gIC8vIG5vdywgbGV0J3MgbWFrZSBhIHN0ZXAgYmFjayBhbmQgbG9vayBhdCB0aGlzIGNvZGUgY2xvc2VseSAod3RmPylcclxuICAvLyBJZiB0aGUgY29udGVudCBvZiB0aGUgcG9wcGVyIGdyb3dzIG9uY2UgaXQncyBiZWVuIHBvc2l0aW9uZWQsIGl0XHJcbiAgLy8gbWF5IGhhcHBlbiB0aGF0IHRoZSBwb3BwZXIgZ2V0cyBtaXNwbGFjZWQgYmVjYXVzZSBvZiB0aGUgbmV3IGNvbnRlbnRcclxuICAvLyBvdmVyZmxvd2luZyBpdHMgcmVmZXJlbmNlIGVsZW1lbnRcclxuICAvLyBUbyBhdm9pZCB0aGlzIHByb2JsZW0sIHdlIHByb3ZpZGUgdHdvIG9wdGlvbnMgKHggYW5kIHkpLCB3aGljaCBhbGxvd1xyXG4gIC8vIHRoZSBjb25zdW1lciB0byBkZWZpbmUgdGhlIG9mZnNldCBvcmlnaW4uXHJcbiAgLy8gSWYgd2UgcG9zaXRpb24gYSBwb3BwZXIgb24gdG9wIG9mIGEgcmVmZXJlbmNlIGVsZW1lbnQsIHdlIGNhbiBzZXRcclxuICAvLyBgeGAgdG8gYHRvcGAgdG8gbWFrZSB0aGUgcG9wcGVyIGdyb3cgdG93YXJkcyBpdHMgdG9wIGluc3RlYWQgb2ZcclxuICAvLyBpdHMgYm90dG9tLlxyXG4gIHZhciBsZWZ0ID0gdm9pZCAwLFxyXG4gICAgICB0b3AgPSB2b2lkIDA7XHJcbiAgaWYgKHNpZGVBID09PSAnYm90dG9tJykge1xyXG4gICAgdG9wID0gLW9mZnNldFBhcmVudFJlY3QuaGVpZ2h0ICsgb2Zmc2V0cy5ib3R0b207XHJcbiAgfSBlbHNlIHtcclxuICAgIHRvcCA9IG9mZnNldHMudG9wO1xyXG4gIH1cclxuICBpZiAoc2lkZUIgPT09ICdyaWdodCcpIHtcclxuICAgIGxlZnQgPSAtb2Zmc2V0UGFyZW50UmVjdC53aWR0aCArIG9mZnNldHMucmlnaHQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIGxlZnQgPSBvZmZzZXRzLmxlZnQ7XHJcbiAgfVxyXG4gIGlmIChncHVBY2NlbGVyYXRpb24gJiYgcHJlZml4ZWRQcm9wZXJ0eSkge1xyXG4gICAgc3R5bGVzW3ByZWZpeGVkUHJvcGVydHldID0gJ3RyYW5zbGF0ZTNkKCcgKyBsZWZ0ICsgJ3B4LCAnICsgdG9wICsgJ3B4LCAwKSc7XHJcbiAgICBzdHlsZXNbc2lkZUFdID0gMDtcclxuICAgIHN0eWxlc1tzaWRlQl0gPSAwO1xyXG4gICAgc3R5bGVzLndpbGxDaGFuZ2UgPSAndHJhbnNmb3JtJztcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gb3Rod2VyaXNlLCB3ZSB1c2UgdGhlIHN0YW5kYXJkIGB0b3BgLCBgbGVmdGAsIGBib3R0b21gIGFuZCBgcmlnaHRgIHByb3BlcnRpZXNcclxuICAgIHZhciBpbnZlcnRUb3AgPSBzaWRlQSA9PT0gJ2JvdHRvbScgPyAtMSA6IDE7XHJcbiAgICB2YXIgaW52ZXJ0TGVmdCA9IHNpZGVCID09PSAncmlnaHQnID8gLTEgOiAxO1xyXG4gICAgc3R5bGVzW3NpZGVBXSA9IHRvcCAqIGludmVydFRvcDtcclxuICAgIHN0eWxlc1tzaWRlQl0gPSBsZWZ0ICogaW52ZXJ0TGVmdDtcclxuICAgIHN0eWxlcy53aWxsQ2hhbmdlID0gc2lkZUEgKyAnLCAnICsgc2lkZUI7XHJcbiAgfVxyXG5cclxuICAvLyBBdHRyaWJ1dGVzXHJcbiAgdmFyIGF0dHJpYnV0ZXMgPSB7XHJcbiAgICAneC1wbGFjZW1lbnQnOiBkYXRhLnBsYWNlbWVudFxyXG4gIH07XHJcblxyXG4gIC8vIFVwZGF0ZSBgZGF0YWAgYXR0cmlidXRlcywgc3R5bGVzIGFuZCBhcnJvd1N0eWxlc1xyXG4gIGRhdGEuYXR0cmlidXRlcyA9IF9leHRlbmRzJDEoe30sIGF0dHJpYnV0ZXMsIGRhdGEuYXR0cmlidXRlcyk7XHJcbiAgZGF0YS5zdHlsZXMgPSBfZXh0ZW5kcyQxKHt9LCBzdHlsZXMsIGRhdGEuc3R5bGVzKTtcclxuICBkYXRhLmFycm93U3R5bGVzID0gX2V4dGVuZHMkMSh7fSwgZGF0YS5vZmZzZXRzLmFycm93LCBkYXRhLmFycm93U3R5bGVzKTtcclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIZWxwZXIgdXNlZCB0byBrbm93IGlmIHRoZSBnaXZlbiBtb2RpZmllciBkZXBlbmRzIGZyb20gYW5vdGhlciBvbmUuPGJyIC8+XHJcbiAqIEl0IGNoZWNrcyBpZiB0aGUgbmVlZGVkIG1vZGlmaWVyIGlzIGxpc3RlZCBhbmQgZW5hYmxlZC5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7QXJyYXl9IG1vZGlmaWVycyAtIGxpc3Qgb2YgbW9kaWZpZXJzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0aW5nTmFtZSAtIG5hbWUgb2YgcmVxdWVzdGluZyBtb2RpZmllclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdGVkTmFtZSAtIG5hbWUgb2YgcmVxdWVzdGVkIG1vZGlmaWVyXHJcbiAqIEByZXR1cm5zIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNNb2RpZmllclJlcXVpcmVkKG1vZGlmaWVycywgcmVxdWVzdGluZ05hbWUsIHJlcXVlc3RlZE5hbWUpIHtcclxuICB2YXIgcmVxdWVzdGluZyA9IGZpbmQobW9kaWZpZXJzLCBmdW5jdGlvbiAoX3JlZikge1xyXG4gICAgdmFyIG5hbWUgPSBfcmVmLm5hbWU7XHJcbiAgICByZXR1cm4gbmFtZSA9PT0gcmVxdWVzdGluZ05hbWU7XHJcbiAgfSk7XHJcblxyXG4gIHZhciBpc1JlcXVpcmVkID0gISFyZXF1ZXN0aW5nICYmIG1vZGlmaWVycy5zb21lKGZ1bmN0aW9uIChtb2RpZmllcikge1xyXG4gICAgcmV0dXJuIG1vZGlmaWVyLm5hbWUgPT09IHJlcXVlc3RlZE5hbWUgJiYgbW9kaWZpZXIuZW5hYmxlZCAmJiBtb2RpZmllci5vcmRlciA8IHJlcXVlc3Rpbmcub3JkZXI7XHJcbiAgfSk7XHJcblxyXG4gIGlmICghaXNSZXF1aXJlZCkge1xyXG4gICAgdmFyIF9yZXF1ZXN0aW5nID0gJ2AnICsgcmVxdWVzdGluZ05hbWUgKyAnYCc7XHJcbiAgICB2YXIgcmVxdWVzdGVkID0gJ2AnICsgcmVxdWVzdGVkTmFtZSArICdgJztcclxuICAgIGNvbnNvbGUud2FybihyZXF1ZXN0ZWQgKyAnIG1vZGlmaWVyIGlzIHJlcXVpcmVkIGJ5ICcgKyBfcmVxdWVzdGluZyArICcgbW9kaWZpZXIgaW4gb3JkZXIgdG8gd29yaywgYmUgc3VyZSB0byBpbmNsdWRlIGl0IGJlZm9yZSAnICsgX3JlcXVlc3RpbmcgKyAnIScpO1xyXG4gIH1cclxuICByZXR1cm4gaXNSZXF1aXJlZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gYXJyb3coZGF0YSwgb3B0aW9ucykge1xyXG4gIHZhciBfZGF0YSRvZmZzZXRzJGFycm93O1xyXG5cclxuICAvLyBhcnJvdyBkZXBlbmRzIG9uIGtlZXBUb2dldGhlciBpbiBvcmRlciB0byB3b3JrXHJcbiAgaWYgKCFpc01vZGlmaWVyUmVxdWlyZWQoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsICdhcnJvdycsICdrZWVwVG9nZXRoZXInKSkge1xyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICB2YXIgYXJyb3dFbGVtZW50ID0gb3B0aW9ucy5lbGVtZW50O1xyXG5cclxuICAvLyBpZiBhcnJvd0VsZW1lbnQgaXMgYSBzdHJpbmcsIHN1cHBvc2UgaXQncyBhIENTUyBzZWxlY3RvclxyXG4gIGlmICh0eXBlb2YgYXJyb3dFbGVtZW50ID09PSAnc3RyaW5nJykge1xyXG4gICAgYXJyb3dFbGVtZW50ID0gZGF0YS5pbnN0YW5jZS5wb3BwZXIucXVlcnlTZWxlY3RvcihhcnJvd0VsZW1lbnQpO1xyXG5cclxuICAgIC8vIGlmIGFycm93RWxlbWVudCBpcyBub3QgZm91bmQsIGRvbid0IHJ1biB0aGUgbW9kaWZpZXJcclxuICAgIGlmICghYXJyb3dFbGVtZW50KSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBpZiB0aGUgYXJyb3dFbGVtZW50IGlzbid0IGEgcXVlcnkgc2VsZWN0b3Igd2UgbXVzdCBjaGVjayB0aGF0IHRoZVxyXG4gICAgLy8gcHJvdmlkZWQgRE9NIG5vZGUgaXMgY2hpbGQgb2YgaXRzIHBvcHBlciBub2RlXHJcbiAgICBpZiAoIWRhdGEuaW5zdGFuY2UucG9wcGVyLmNvbnRhaW5zKGFycm93RWxlbWVudCkpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiBgYXJyb3cuZWxlbWVudGAgbXVzdCBiZSBjaGlsZCBvZiBpdHMgcG9wcGVyIGVsZW1lbnQhJyk7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcbiAgdmFyIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXHJcbiAgICAgIHBvcHBlciA9IF9kYXRhJG9mZnNldHMucG9wcGVyLFxyXG4gICAgICByZWZlcmVuY2UgPSBfZGF0YSRvZmZzZXRzLnJlZmVyZW5jZTtcclxuXHJcbiAgdmFyIGlzVmVydGljYWwgPSBbJ2xlZnQnLCAncmlnaHQnXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xO1xyXG5cclxuICB2YXIgbGVuID0gaXNWZXJ0aWNhbCA/ICdoZWlnaHQnIDogJ3dpZHRoJztcclxuICB2YXIgc2lkZUNhcGl0YWxpemVkID0gaXNWZXJ0aWNhbCA/ICdUb3AnIDogJ0xlZnQnO1xyXG4gIHZhciBzaWRlID0gc2lkZUNhcGl0YWxpemVkLnRvTG93ZXJDYXNlKCk7XHJcbiAgdmFyIGFsdFNpZGUgPSBpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCc7XHJcbiAgdmFyIG9wU2lkZSA9IGlzVmVydGljYWwgPyAnYm90dG9tJyA6ICdyaWdodCc7XHJcbiAgdmFyIGFycm93RWxlbWVudFNpemUgPSBnZXRPdXRlclNpemVzKGFycm93RWxlbWVudClbbGVuXTtcclxuXHJcbiAgLy9cclxuICAvLyBleHRlbmRzIGtlZXBUb2dldGhlciBiZWhhdmlvciBtYWtpbmcgc3VyZSB0aGUgcG9wcGVyIGFuZCBpdHNcclxuICAvLyByZWZlcmVuY2UgaGF2ZSBlbm91Z2ggcGl4ZWxzIGluIGNvbmp1Y3Rpb25cclxuICAvL1xyXG5cclxuICAvLyB0b3AvbGVmdCBzaWRlXHJcbiAgaWYgKHJlZmVyZW5jZVtvcFNpZGVdIC0gYXJyb3dFbGVtZW50U2l6ZSA8IHBvcHBlcltzaWRlXSkge1xyXG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlcltzaWRlXSAtPSBwb3BwZXJbc2lkZV0gLSAocmVmZXJlbmNlW29wU2lkZV0gLSBhcnJvd0VsZW1lbnRTaXplKTtcclxuICB9XHJcbiAgLy8gYm90dG9tL3JpZ2h0IHNpZGVcclxuICBpZiAocmVmZXJlbmNlW3NpZGVdICsgYXJyb3dFbGVtZW50U2l6ZSA+IHBvcHBlcltvcFNpZGVdKSB7XHJcbiAgICBkYXRhLm9mZnNldHMucG9wcGVyW3NpZGVdICs9IHJlZmVyZW5jZVtzaWRlXSArIGFycm93RWxlbWVudFNpemUgLSBwb3BwZXJbb3BTaWRlXTtcclxuICB9XHJcbiAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IGdldENsaWVudFJlY3QoZGF0YS5vZmZzZXRzLnBvcHBlcik7XHJcblxyXG4gIC8vIGNvbXB1dGUgY2VudGVyIG9mIHRoZSBwb3BwZXJcclxuICB2YXIgY2VudGVyID0gcmVmZXJlbmNlW3NpZGVdICsgcmVmZXJlbmNlW2xlbl0gLyAyIC0gYXJyb3dFbGVtZW50U2l6ZSAvIDI7XHJcblxyXG4gIC8vIENvbXB1dGUgdGhlIHNpZGVWYWx1ZSB1c2luZyB0aGUgdXBkYXRlZCBwb3BwZXIgb2Zmc2V0c1xyXG4gIC8vIHRha2UgcG9wcGVyIG1hcmdpbiBpbiBhY2NvdW50IGJlY2F1c2Ugd2UgZG9uJ3QgaGF2ZSB0aGlzIGluZm8gYXZhaWxhYmxlXHJcbiAgdmFyIGNzcyA9IGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShkYXRhLmluc3RhbmNlLnBvcHBlcik7XHJcbiAgdmFyIHBvcHBlck1hcmdpblNpZGUgPSBwYXJzZUZsb2F0KGNzc1snbWFyZ2luJyArIHNpZGVDYXBpdGFsaXplZF0sIDEwKTtcclxuICB2YXIgcG9wcGVyQm9yZGVyU2lkZSA9IHBhcnNlRmxvYXQoY3NzWydib3JkZXInICsgc2lkZUNhcGl0YWxpemVkICsgJ1dpZHRoJ10sIDEwKTtcclxuICB2YXIgc2lkZVZhbHVlID0gY2VudGVyIC0gZGF0YS5vZmZzZXRzLnBvcHBlcltzaWRlXSAtIHBvcHBlck1hcmdpblNpZGUgLSBwb3BwZXJCb3JkZXJTaWRlO1xyXG5cclxuICAvLyBwcmV2ZW50IGFycm93RWxlbWVudCBmcm9tIGJlaW5nIHBsYWNlZCBub3QgY29udGlndW91c2x5IHRvIGl0cyBwb3BwZXJcclxuICBzaWRlVmFsdWUgPSBNYXRoLm1heChNYXRoLm1pbihwb3BwZXJbbGVuXSAtIGFycm93RWxlbWVudFNpemUsIHNpZGVWYWx1ZSksIDApO1xyXG5cclxuICBkYXRhLmFycm93RWxlbWVudCA9IGFycm93RWxlbWVudDtcclxuICBkYXRhLm9mZnNldHMuYXJyb3cgPSAoX2RhdGEkb2Zmc2V0cyRhcnJvdyA9IHt9LCBkZWZpbmVQcm9wZXJ0eSQxKF9kYXRhJG9mZnNldHMkYXJyb3csIHNpZGUsIE1hdGgucm91bmQoc2lkZVZhbHVlKSksIGRlZmluZVByb3BlcnR5JDEoX2RhdGEkb2Zmc2V0cyRhcnJvdywgYWx0U2lkZSwgJycpLCBfZGF0YSRvZmZzZXRzJGFycm93KTtcclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIG9wcG9zaXRlIHBsYWNlbWVudCB2YXJpYXRpb24gb2YgdGhlIGdpdmVuIG9uZVxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHBsYWNlbWVudCB2YXJpYXRpb25cclxuICogQHJldHVybnMge1N0cmluZ30gZmxpcHBlZCBwbGFjZW1lbnQgdmFyaWF0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRPcHBvc2l0ZVZhcmlhdGlvbih2YXJpYXRpb24pIHtcclxuICBpZiAodmFyaWF0aW9uID09PSAnZW5kJykge1xyXG4gICAgcmV0dXJuICdzdGFydCc7XHJcbiAgfSBlbHNlIGlmICh2YXJpYXRpb24gPT09ICdzdGFydCcpIHtcclxuICAgIHJldHVybiAnZW5kJztcclxuICB9XHJcbiAgcmV0dXJuIHZhcmlhdGlvbjtcclxufVxyXG5cclxuLyoqXHJcbiAqIExpc3Qgb2YgYWNjZXB0ZWQgcGxhY2VtZW50cyB0byB1c2UgYXMgdmFsdWVzIG9mIHRoZSBgcGxhY2VtZW50YCBvcHRpb24uPGJyIC8+XHJcbiAqIFZhbGlkIHBsYWNlbWVudHMgYXJlOlxyXG4gKiAtIGBhdXRvYFxyXG4gKiAtIGB0b3BgXHJcbiAqIC0gYHJpZ2h0YFxyXG4gKiAtIGBib3R0b21gXHJcbiAqIC0gYGxlZnRgXHJcbiAqXHJcbiAqIEVhY2ggcGxhY2VtZW50IGNhbiBoYXZlIGEgdmFyaWF0aW9uIGZyb20gdGhpcyBsaXN0OlxyXG4gKiAtIGAtc3RhcnRgXHJcbiAqIC0gYC1lbmRgXHJcbiAqXHJcbiAqIFZhcmlhdGlvbnMgYXJlIGludGVycHJldGVkIGVhc2lseSBpZiB5b3UgdGhpbmsgb2YgdGhlbSBhcyB0aGUgbGVmdCB0byByaWdodFxyXG4gKiB3cml0dGVuIGxhbmd1YWdlcy4gSG9yaXpvbnRhbGx5IChgdG9wYCBhbmQgYGJvdHRvbWApLCBgc3RhcnRgIGlzIGxlZnQgYW5kIGBlbmRgXHJcbiAqIGlzIHJpZ2h0LjxiciAvPlxyXG4gKiBWZXJ0aWNhbGx5IChgbGVmdGAgYW5kIGByaWdodGApLCBgc3RhcnRgIGlzIHRvcCBhbmQgYGVuZGAgaXMgYm90dG9tLlxyXG4gKlxyXG4gKiBTb21lIHZhbGlkIGV4YW1wbGVzIGFyZTpcclxuICogLSBgdG9wLWVuZGAgKG9uIHRvcCBvZiByZWZlcmVuY2UsIHJpZ2h0IGFsaWduZWQpXHJcbiAqIC0gYHJpZ2h0LXN0YXJ0YCAob24gcmlnaHQgb2YgcmVmZXJlbmNlLCB0b3AgYWxpZ25lZClcclxuICogLSBgYm90dG9tYCAob24gYm90dG9tLCBjZW50ZXJlZClcclxuICogLSBgYXV0by1yaWdodGAgKG9uIHRoZSBzaWRlIHdpdGggbW9yZSBzcGFjZSBhdmFpbGFibGUsIGFsaWdubWVudCBkZXBlbmRzIGJ5IHBsYWNlbWVudClcclxuICpcclxuICogQHN0YXRpY1xyXG4gKiBAdHlwZSB7QXJyYXl9XHJcbiAqIEBlbnVtIHtTdHJpbmd9XHJcbiAqIEByZWFkb25seVxyXG4gKiBAbWV0aG9kIHBsYWNlbWVudHNcclxuICogQG1lbWJlcm9mIFBvcHBlclxyXG4gKi9cclxudmFyIHBsYWNlbWVudHMgPSBbJ2F1dG8tc3RhcnQnLCAnYXV0bycsICdhdXRvLWVuZCcsICd0b3Atc3RhcnQnLCAndG9wJywgJ3RvcC1lbmQnLCAncmlnaHQtc3RhcnQnLCAncmlnaHQnLCAncmlnaHQtZW5kJywgJ2JvdHRvbS1lbmQnLCAnYm90dG9tJywgJ2JvdHRvbS1zdGFydCcsICdsZWZ0LWVuZCcsICdsZWZ0JywgJ2xlZnQtc3RhcnQnXTtcclxuXHJcbi8vIEdldCByaWQgb2YgYGF1dG9gIGBhdXRvLXN0YXJ0YCBhbmQgYGF1dG8tZW5kYFxyXG52YXIgdmFsaWRQbGFjZW1lbnRzID0gcGxhY2VtZW50cy5zbGljZSgzKTtcclxuXHJcbi8qKlxyXG4gKiBHaXZlbiBhbiBpbml0aWFsIHBsYWNlbWVudCwgcmV0dXJucyBhbGwgdGhlIHN1YnNlcXVlbnQgcGxhY2VtZW50c1xyXG4gKiBjbG9ja3dpc2UgKG9yIGNvdW50ZXItY2xvY2t3aXNlKS5cclxuICpcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwbGFjZW1lbnQgLSBBIHZhbGlkIHBsYWNlbWVudCAoaXQgYWNjZXB0cyB2YXJpYXRpb25zKVxyXG4gKiBAYXJndW1lbnQge0Jvb2xlYW59IGNvdW50ZXIgLSBTZXQgdG8gdHJ1ZSB0byB3YWxrIHRoZSBwbGFjZW1lbnRzIGNvdW50ZXJjbG9ja3dpc2VcclxuICogQHJldHVybnMge0FycmF5fSBwbGFjZW1lbnRzIGluY2x1ZGluZyB0aGVpciB2YXJpYXRpb25zXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9ja3dpc2UocGxhY2VtZW50KSB7XHJcbiAgdmFyIGNvdW50ZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IGZhbHNlO1xyXG5cclxuICB2YXIgaW5kZXggPSB2YWxpZFBsYWNlbWVudHMuaW5kZXhPZihwbGFjZW1lbnQpO1xyXG4gIHZhciBhcnIgPSB2YWxpZFBsYWNlbWVudHMuc2xpY2UoaW5kZXggKyAxKS5jb25jYXQodmFsaWRQbGFjZW1lbnRzLnNsaWNlKDAsIGluZGV4KSk7XHJcbiAgcmV0dXJuIGNvdW50ZXIgPyBhcnIucmV2ZXJzZSgpIDogYXJyO1xyXG59XHJcblxyXG52YXIgQkVIQVZJT1JTID0ge1xyXG4gIEZMSVA6ICdmbGlwJyxcclxuICBDTE9DS1dJU0U6ICdjbG9ja3dpc2UnLFxyXG4gIENPVU5URVJDTE9DS1dJU0U6ICdjb3VudGVyY2xvY2t3aXNlJ1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gZmxpcChkYXRhLCBvcHRpb25zKSB7XHJcbiAgLy8gaWYgYGlubmVyYCBtb2RpZmllciBpcyBlbmFibGVkLCB3ZSBjYW4ndCB1c2UgdGhlIGBmbGlwYCBtb2RpZmllclxyXG4gIGlmIChpc01vZGlmaWVyRW5hYmxlZChkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgJ2lubmVyJykpIHtcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgaWYgKGRhdGEuZmxpcHBlZCAmJiBkYXRhLnBsYWNlbWVudCA9PT0gZGF0YS5vcmlnaW5hbFBsYWNlbWVudCkge1xyXG4gICAgLy8gc2VlbXMgbGlrZSBmbGlwIGlzIHRyeWluZyB0byBsb29wLCBwcm9iYWJseSB0aGVyZSdzIG5vdCBlbm91Z2ggc3BhY2Ugb24gYW55IG9mIHRoZSBmbGlwcGFibGUgc2lkZXNcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgdmFyIGJvdW5kYXJpZXMgPSBnZXRCb3VuZGFyaWVzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLmluc3RhbmNlLnJlZmVyZW5jZSwgb3B0aW9ucy5wYWRkaW5nLCBvcHRpb25zLmJvdW5kYXJpZXNFbGVtZW50LCBkYXRhLnBvc2l0aW9uRml4ZWQpO1xyXG5cclxuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuICB2YXIgcGxhY2VtZW50T3Bwb3NpdGUgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpO1xyXG4gIHZhciB2YXJpYXRpb24gPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzFdIHx8ICcnO1xyXG5cclxuICB2YXIgZmxpcE9yZGVyID0gW107XHJcblxyXG4gIHN3aXRjaCAob3B0aW9ucy5iZWhhdmlvcikge1xyXG4gICAgY2FzZSBCRUhBVklPUlMuRkxJUDpcclxuICAgICAgZmxpcE9yZGVyID0gW3BsYWNlbWVudCwgcGxhY2VtZW50T3Bwb3NpdGVdO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgQkVIQVZJT1JTLkNMT0NLV0lTRTpcclxuICAgICAgZmxpcE9yZGVyID0gY2xvY2t3aXNlKHBsYWNlbWVudCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBCRUhBVklPUlMuQ09VTlRFUkNMT0NLV0lTRTpcclxuICAgICAgZmxpcE9yZGVyID0gY2xvY2t3aXNlKHBsYWNlbWVudCwgdHJ1ZSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgZmxpcE9yZGVyID0gb3B0aW9ucy5iZWhhdmlvcjtcclxuICB9XHJcblxyXG4gIGZsaXBPcmRlci5mb3JFYWNoKGZ1bmN0aW9uIChzdGVwLCBpbmRleCkge1xyXG4gICAgaWYgKHBsYWNlbWVudCAhPT0gc3RlcCB8fCBmbGlwT3JkZXIubGVuZ3RoID09PSBpbmRleCArIDEpIHtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuICAgIHBsYWNlbWVudE9wcG9zaXRlID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KTtcclxuXHJcbiAgICB2YXIgcG9wcGVyT2Zmc2V0cyA9IGRhdGEub2Zmc2V0cy5wb3BwZXI7XHJcbiAgICB2YXIgcmVmT2Zmc2V0cyA9IGRhdGEub2Zmc2V0cy5yZWZlcmVuY2U7XHJcblxyXG4gICAgLy8gdXNpbmcgZmxvb3IgYmVjYXVzZSB0aGUgcmVmZXJlbmNlIG9mZnNldHMgbWF5IGNvbnRhaW4gZGVjaW1hbHMgd2UgYXJlIG5vdCBnb2luZyB0byBjb25zaWRlciBoZXJlXHJcbiAgICB2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xyXG4gICAgdmFyIG92ZXJsYXBzUmVmID0gcGxhY2VtZW50ID09PSAnbGVmdCcgJiYgZmxvb3IocG9wcGVyT2Zmc2V0cy5yaWdodCkgPiBmbG9vcihyZWZPZmZzZXRzLmxlZnQpIHx8IHBsYWNlbWVudCA9PT0gJ3JpZ2h0JyAmJiBmbG9vcihwb3BwZXJPZmZzZXRzLmxlZnQpIDwgZmxvb3IocmVmT2Zmc2V0cy5yaWdodCkgfHwgcGxhY2VtZW50ID09PSAndG9wJyAmJiBmbG9vcihwb3BwZXJPZmZzZXRzLmJvdHRvbSkgPiBmbG9vcihyZWZPZmZzZXRzLnRvcCkgfHwgcGxhY2VtZW50ID09PSAnYm90dG9tJyAmJiBmbG9vcihwb3BwZXJPZmZzZXRzLnRvcCkgPCBmbG9vcihyZWZPZmZzZXRzLmJvdHRvbSk7XHJcblxyXG4gICAgdmFyIG92ZXJmbG93c0xlZnQgPSBmbG9vcihwb3BwZXJPZmZzZXRzLmxlZnQpIDwgZmxvb3IoYm91bmRhcmllcy5sZWZ0KTtcclxuICAgIHZhciBvdmVyZmxvd3NSaWdodCA9IGZsb29yKHBvcHBlck9mZnNldHMucmlnaHQpID4gZmxvb3IoYm91bmRhcmllcy5yaWdodCk7XHJcbiAgICB2YXIgb3ZlcmZsb3dzVG9wID0gZmxvb3IocG9wcGVyT2Zmc2V0cy50b3ApIDwgZmxvb3IoYm91bmRhcmllcy50b3ApO1xyXG4gICAgdmFyIG92ZXJmbG93c0JvdHRvbSA9IGZsb29yKHBvcHBlck9mZnNldHMuYm90dG9tKSA+IGZsb29yKGJvdW5kYXJpZXMuYm90dG9tKTtcclxuXHJcbiAgICB2YXIgb3ZlcmZsb3dzQm91bmRhcmllcyA9IHBsYWNlbWVudCA9PT0gJ2xlZnQnICYmIG92ZXJmbG93c0xlZnQgfHwgcGxhY2VtZW50ID09PSAncmlnaHQnICYmIG92ZXJmbG93c1JpZ2h0IHx8IHBsYWNlbWVudCA9PT0gJ3RvcCcgJiYgb3ZlcmZsb3dzVG9wIHx8IHBsYWNlbWVudCA9PT0gJ2JvdHRvbScgJiYgb3ZlcmZsb3dzQm90dG9tO1xyXG5cclxuICAgIC8vIGZsaXAgdGhlIHZhcmlhdGlvbiBpZiByZXF1aXJlZFxyXG4gICAgdmFyIGlzVmVydGljYWwgPSBbJ3RvcCcsICdib3R0b20nXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xO1xyXG4gICAgdmFyIGZsaXBwZWRWYXJpYXRpb24gPSAhIW9wdGlvbnMuZmxpcFZhcmlhdGlvbnMgJiYgKGlzVmVydGljYWwgJiYgdmFyaWF0aW9uID09PSAnc3RhcnQnICYmIG92ZXJmbG93c0xlZnQgfHwgaXNWZXJ0aWNhbCAmJiB2YXJpYXRpb24gPT09ICdlbmQnICYmIG92ZXJmbG93c1JpZ2h0IHx8ICFpc1ZlcnRpY2FsICYmIHZhcmlhdGlvbiA9PT0gJ3N0YXJ0JyAmJiBvdmVyZmxvd3NUb3AgfHwgIWlzVmVydGljYWwgJiYgdmFyaWF0aW9uID09PSAnZW5kJyAmJiBvdmVyZmxvd3NCb3R0b20pO1xyXG5cclxuICAgIGlmIChvdmVybGFwc1JlZiB8fCBvdmVyZmxvd3NCb3VuZGFyaWVzIHx8IGZsaXBwZWRWYXJpYXRpb24pIHtcclxuICAgICAgLy8gdGhpcyBib29sZWFuIHRvIGRldGVjdCBhbnkgZmxpcCBsb29wXHJcbiAgICAgIGRhdGEuZmxpcHBlZCA9IHRydWU7XHJcblxyXG4gICAgICBpZiAob3ZlcmxhcHNSZWYgfHwgb3ZlcmZsb3dzQm91bmRhcmllcykge1xyXG4gICAgICAgIHBsYWNlbWVudCA9IGZsaXBPcmRlcltpbmRleCArIDFdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZmxpcHBlZFZhcmlhdGlvbikge1xyXG4gICAgICAgIHZhcmlhdGlvbiA9IGdldE9wcG9zaXRlVmFyaWF0aW9uKHZhcmlhdGlvbik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRhdGEucGxhY2VtZW50ID0gcGxhY2VtZW50ICsgKHZhcmlhdGlvbiA/ICctJyArIHZhcmlhdGlvbiA6ICcnKTtcclxuXHJcbiAgICAgIC8vIHRoaXMgb2JqZWN0IGNvbnRhaW5zIGBwb3NpdGlvbmAsIHdlIHdhbnQgdG8gcHJlc2VydmUgaXQgYWxvbmcgd2l0aFxyXG4gICAgICAvLyBhbnkgYWRkaXRpb25hbCBwcm9wZXJ0eSB3ZSBtYXkgYWRkIGluIHRoZSBmdXR1cmVcclxuICAgICAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IF9leHRlbmRzJDEoe30sIGRhdGEub2Zmc2V0cy5wb3BwZXIsIGdldFBvcHBlck9mZnNldHMoZGF0YS5pbnN0YW5jZS5wb3BwZXIsIGRhdGEub2Zmc2V0cy5yZWZlcmVuY2UsIGRhdGEucGxhY2VtZW50KSk7XHJcblxyXG4gICAgICBkYXRhID0gcnVuTW9kaWZpZXJzKGRhdGEuaW5zdGFuY2UubW9kaWZpZXJzLCBkYXRhLCAnZmxpcCcpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IHVwZGF0ZSBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBrZWVwVG9nZXRoZXIoZGF0YSkge1xyXG4gIHZhciBfZGF0YSRvZmZzZXRzID0gZGF0YS5vZmZzZXRzLFxyXG4gICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcixcclxuICAgICAgcmVmZXJlbmNlID0gX2RhdGEkb2Zmc2V0cy5yZWZlcmVuY2U7XHJcblxyXG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xyXG4gIHZhciBmbG9vciA9IE1hdGguZmxvb3I7XHJcbiAgdmFyIGlzVmVydGljYWwgPSBbJ3RvcCcsICdib3R0b20nXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xO1xyXG4gIHZhciBzaWRlID0gaXNWZXJ0aWNhbCA/ICdyaWdodCcgOiAnYm90dG9tJztcclxuICB2YXIgb3BTaWRlID0gaXNWZXJ0aWNhbCA/ICdsZWZ0JyA6ICd0b3AnO1xyXG4gIHZhciBtZWFzdXJlbWVudCA9IGlzVmVydGljYWwgPyAnd2lkdGgnIDogJ2hlaWdodCc7XHJcblxyXG4gIGlmIChwb3BwZXJbc2lkZV0gPCBmbG9vcihyZWZlcmVuY2Vbb3BTaWRlXSkpIHtcclxuICAgIGRhdGEub2Zmc2V0cy5wb3BwZXJbb3BTaWRlXSA9IGZsb29yKHJlZmVyZW5jZVtvcFNpZGVdKSAtIHBvcHBlclttZWFzdXJlbWVudF07XHJcbiAgfVxyXG4gIGlmIChwb3BwZXJbb3BTaWRlXSA+IGZsb29yKHJlZmVyZW5jZVtzaWRlXSkpIHtcclxuICAgIGRhdGEub2Zmc2V0cy5wb3BwZXJbb3BTaWRlXSA9IGZsb29yKHJlZmVyZW5jZVtzaWRlXSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIGEgc3RyaW5nIGNvbnRhaW5pbmcgdmFsdWUgKyB1bml0IGludG8gYSBweCB2YWx1ZSBudW1iZXJcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiB7bW9kaWZpZXJzfm9mZnNldH1cclxuICogQHByaXZhdGVcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHN0ciAtIFZhbHVlICsgdW5pdCBzdHJpbmdcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IG1lYXN1cmVtZW50IC0gYGhlaWdodGAgb3IgYHdpZHRoYFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gcG9wcGVyT2Zmc2V0c1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gcmVmZXJlbmNlT2Zmc2V0c1xyXG4gKiBAcmV0dXJucyB7TnVtYmVyfFN0cmluZ31cclxuICogVmFsdWUgaW4gcGl4ZWxzLCBvciBvcmlnaW5hbCBzdHJpbmcgaWYgbm8gdmFsdWVzIHdlcmUgZXh0cmFjdGVkXHJcbiAqL1xyXG5mdW5jdGlvbiB0b1ZhbHVlKHN0ciwgbWVhc3VyZW1lbnQsIHBvcHBlck9mZnNldHMsIHJlZmVyZW5jZU9mZnNldHMpIHtcclxuICAvLyBzZXBhcmF0ZSB2YWx1ZSBmcm9tIHVuaXRcclxuICB2YXIgc3BsaXQgPSBzdHIubWF0Y2goLygoPzpcXC18XFwrKT9cXGQqXFwuP1xcZCopKC4qKS8pO1xyXG4gIHZhciB2YWx1ZSA9ICtzcGxpdFsxXTtcclxuICB2YXIgdW5pdCA9IHNwbGl0WzJdO1xyXG5cclxuICAvLyBJZiBpdCdzIG5vdCBhIG51bWJlciBpdCdzIGFuIG9wZXJhdG9yLCBJIGd1ZXNzXHJcbiAgaWYgKCF2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHN0cjtcclxuICB9XHJcblxyXG4gIGlmICh1bml0LmluZGV4T2YoJyUnKSA9PT0gMCkge1xyXG4gICAgdmFyIGVsZW1lbnQgPSB2b2lkIDA7XHJcbiAgICBzd2l0Y2ggKHVuaXQpIHtcclxuICAgICAgY2FzZSAnJXAnOlxyXG4gICAgICAgIGVsZW1lbnQgPSBwb3BwZXJPZmZzZXRzO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICclJzpcclxuICAgICAgY2FzZSAnJXInOlxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGVsZW1lbnQgPSByZWZlcmVuY2VPZmZzZXRzO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciByZWN0ID0gZ2V0Q2xpZW50UmVjdChlbGVtZW50KTtcclxuICAgIHJldHVybiByZWN0W21lYXN1cmVtZW50XSAvIDEwMCAqIHZhbHVlO1xyXG4gIH0gZWxzZSBpZiAodW5pdCA9PT0gJ3ZoJyB8fCB1bml0ID09PSAndncnKSB7XHJcbiAgICAvLyBpZiBpcyBhIHZoIG9yIHZ3LCB3ZSBjYWxjdWxhdGUgdGhlIHNpemUgYmFzZWQgb24gdGhlIHZpZXdwb3J0XHJcbiAgICB2YXIgc2l6ZSA9IHZvaWQgMDtcclxuICAgIGlmICh1bml0ID09PSAndmgnKSB7XHJcbiAgICAgIHNpemUgPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzaXplID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzaXplIC8gMTAwICogdmFsdWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGlmIGlzIGFuIGV4cGxpY2l0IHBpeGVsIHVuaXQsIHdlIGdldCByaWQgb2YgdGhlIHVuaXQgYW5kIGtlZXAgdGhlIHZhbHVlXHJcbiAgICAvLyBpZiBpcyBhbiBpbXBsaWNpdCB1bml0LCBpdCdzIHB4LCBhbmQgd2UgcmV0dXJuIGp1c3QgdGhlIHZhbHVlXHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUGFyc2UgYW4gYG9mZnNldGAgc3RyaW5nIHRvIGV4dHJhcG9sYXRlIGB4YCBhbmQgYHlgIG51bWVyaWMgb2Zmc2V0cy5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiB7bW9kaWZpZXJzfm9mZnNldH1cclxuICogQHByaXZhdGVcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IG9mZnNldFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gcG9wcGVyT2Zmc2V0c1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gcmVmZXJlbmNlT2Zmc2V0c1xyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gYmFzZVBsYWNlbWVudFxyXG4gKiBAcmV0dXJucyB7QXJyYXl9IGEgdHdvIGNlbGxzIGFycmF5IHdpdGggeCBhbmQgeSBvZmZzZXRzIGluIG51bWJlcnNcclxuICovXHJcbmZ1bmN0aW9uIHBhcnNlT2Zmc2V0KG9mZnNldCwgcG9wcGVyT2Zmc2V0cywgcmVmZXJlbmNlT2Zmc2V0cywgYmFzZVBsYWNlbWVudCkge1xyXG4gIHZhciBvZmZzZXRzID0gWzAsIDBdO1xyXG5cclxuICAvLyBVc2UgaGVpZ2h0IGlmIHBsYWNlbWVudCBpcyBsZWZ0IG9yIHJpZ2h0IGFuZCBpbmRleCBpcyAwIG90aGVyd2lzZSB1c2Ugd2lkdGhcclxuICAvLyBpbiB0aGlzIHdheSB0aGUgZmlyc3Qgb2Zmc2V0IHdpbGwgdXNlIGFuIGF4aXMgYW5kIHRoZSBzZWNvbmQgb25lXHJcbiAgLy8gd2lsbCB1c2UgdGhlIG90aGVyIG9uZVxyXG4gIHZhciB1c2VIZWlnaHQgPSBbJ3JpZ2h0JywgJ2xlZnQnXS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpICE9PSAtMTtcclxuXHJcbiAgLy8gU3BsaXQgdGhlIG9mZnNldCBzdHJpbmcgdG8gb2J0YWluIGEgbGlzdCBvZiB2YWx1ZXMgYW5kIG9wZXJhbmRzXHJcbiAgLy8gVGhlIHJlZ2V4IGFkZHJlc3NlcyB2YWx1ZXMgd2l0aCB0aGUgcGx1cyBvciBtaW51cyBzaWduIGluIGZyb250ICgrMTAsIC0yMCwgZXRjKVxyXG4gIHZhciBmcmFnbWVudHMgPSBvZmZzZXQuc3BsaXQoLyhcXCt8XFwtKS8pLm1hcChmdW5jdGlvbiAoZnJhZykge1xyXG4gICAgcmV0dXJuIGZyYWcudHJpbSgpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBEZXRlY3QgaWYgdGhlIG9mZnNldCBzdHJpbmcgY29udGFpbnMgYSBwYWlyIG9mIHZhbHVlcyBvciBhIHNpbmdsZSBvbmVcclxuICAvLyB0aGV5IGNvdWxkIGJlIHNlcGFyYXRlZCBieSBjb21tYSBvciBzcGFjZVxyXG4gIHZhciBkaXZpZGVyID0gZnJhZ21lbnRzLmluZGV4T2YoZmluZChmcmFnbWVudHMsIGZ1bmN0aW9uIChmcmFnKSB7XHJcbiAgICByZXR1cm4gZnJhZy5zZWFyY2goLyx8XFxzLykgIT09IC0xO1xyXG4gIH0pKTtcclxuXHJcbiAgaWYgKGZyYWdtZW50c1tkaXZpZGVyXSAmJiBmcmFnbWVudHNbZGl2aWRlcl0uaW5kZXhPZignLCcpID09PSAtMSkge1xyXG4gICAgY29uc29sZS53YXJuKCdPZmZzZXRzIHNlcGFyYXRlZCBieSB3aGl0ZSBzcGFjZShzKSBhcmUgZGVwcmVjYXRlZCwgdXNlIGEgY29tbWEgKCwpIGluc3RlYWQuJyk7XHJcbiAgfVxyXG5cclxuICAvLyBJZiBkaXZpZGVyIGlzIGZvdW5kLCB3ZSBkaXZpZGUgdGhlIGxpc3Qgb2YgdmFsdWVzIGFuZCBvcGVyYW5kcyB0byBkaXZpZGVcclxuICAvLyB0aGVtIGJ5IG9mc2V0IFggYW5kIFkuXHJcbiAgdmFyIHNwbGl0UmVnZXggPSAvXFxzKixcXHMqfFxccysvO1xyXG4gIHZhciBvcHMgPSBkaXZpZGVyICE9PSAtMSA/IFtmcmFnbWVudHMuc2xpY2UoMCwgZGl2aWRlcikuY29uY2F0KFtmcmFnbWVudHNbZGl2aWRlcl0uc3BsaXQoc3BsaXRSZWdleClbMF1dKSwgW2ZyYWdtZW50c1tkaXZpZGVyXS5zcGxpdChzcGxpdFJlZ2V4KVsxXV0uY29uY2F0KGZyYWdtZW50cy5zbGljZShkaXZpZGVyICsgMSkpXSA6IFtmcmFnbWVudHNdO1xyXG5cclxuICAvLyBDb252ZXJ0IHRoZSB2YWx1ZXMgd2l0aCB1bml0cyB0byBhYnNvbHV0ZSBwaXhlbHMgdG8gYWxsb3cgb3VyIGNvbXB1dGF0aW9uc1xyXG4gIG9wcyA9IG9wcy5tYXAoZnVuY3Rpb24gKG9wLCBpbmRleCkge1xyXG4gICAgLy8gTW9zdCBvZiB0aGUgdW5pdHMgcmVseSBvbiB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHBvcHBlclxyXG4gICAgdmFyIG1lYXN1cmVtZW50ID0gKGluZGV4ID09PSAxID8gIXVzZUhlaWdodCA6IHVzZUhlaWdodCkgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XHJcbiAgICB2YXIgbWVyZ2VXaXRoUHJldmlvdXMgPSBmYWxzZTtcclxuICAgIHJldHVybiBvcFxyXG4gICAgLy8gVGhpcyBhZ2dyZWdhdGVzIGFueSBgK2Agb3IgYC1gIHNpZ24gdGhhdCBhcmVuJ3QgY29uc2lkZXJlZCBvcGVyYXRvcnNcclxuICAgIC8vIGUuZy46IDEwICsgKzUgPT4gWzEwLCArLCArNV1cclxuICAgIC5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgaWYgKGFbYS5sZW5ndGggLSAxXSA9PT0gJycgJiYgWycrJywgJy0nXS5pbmRleE9mKGIpICE9PSAtMSkge1xyXG4gICAgICAgIGFbYS5sZW5ndGggLSAxXSA9IGI7XHJcbiAgICAgICAgbWVyZ2VXaXRoUHJldmlvdXMgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgICB9IGVsc2UgaWYgKG1lcmdlV2l0aFByZXZpb3VzKSB7XHJcbiAgICAgICAgYVthLmxlbmd0aCAtIDFdICs9IGI7XHJcbiAgICAgICAgbWVyZ2VXaXRoUHJldmlvdXMgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4gYTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYS5jb25jYXQoYik7XHJcbiAgICAgIH1cclxuICAgIH0sIFtdKVxyXG4gICAgLy8gSGVyZSB3ZSBjb252ZXJ0IHRoZSBzdHJpbmcgdmFsdWVzIGludG8gbnVtYmVyIHZhbHVlcyAoaW4gcHgpXHJcbiAgICAubWFwKGZ1bmN0aW9uIChzdHIpIHtcclxuICAgICAgcmV0dXJuIHRvVmFsdWUoc3RyLCBtZWFzdXJlbWVudCwgcG9wcGVyT2Zmc2V0cywgcmVmZXJlbmNlT2Zmc2V0cyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgLy8gTG9vcCB0cm91Z2ggdGhlIG9mZnNldHMgYXJyYXlzIGFuZCBleGVjdXRlIHRoZSBvcGVyYXRpb25zXHJcbiAgb3BzLmZvckVhY2goZnVuY3Rpb24gKG9wLCBpbmRleCkge1xyXG4gICAgb3AuZm9yRWFjaChmdW5jdGlvbiAoZnJhZywgaW5kZXgyKSB7XHJcbiAgICAgIGlmIChpc051bWVyaWMoZnJhZykpIHtcclxuICAgICAgICBvZmZzZXRzW2luZGV4XSArPSBmcmFnICogKG9wW2luZGV4MiAtIDFdID09PSAnLScgPyAtMSA6IDEpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm4gb2Zmc2V0cztcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQGFyZ3VtZW50IHtOdW1iZXJ8U3RyaW5nfSBvcHRpb25zLm9mZnNldD0wXHJcbiAqIFRoZSBvZmZzZXQgdmFsdWUgYXMgZGVzY3JpYmVkIGluIHRoZSBtb2RpZmllciBkZXNjcmlwdGlvblxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBvZmZzZXQoZGF0YSwgX3JlZikge1xyXG4gIHZhciBvZmZzZXQgPSBfcmVmLm9mZnNldDtcclxuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQsXHJcbiAgICAgIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXHJcbiAgICAgIHBvcHBlciA9IF9kYXRhJG9mZnNldHMucG9wcGVyLFxyXG4gICAgICByZWZlcmVuY2UgPSBfZGF0YSRvZmZzZXRzLnJlZmVyZW5jZTtcclxuXHJcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuXHJcbiAgdmFyIG9mZnNldHMgPSB2b2lkIDA7XHJcbiAgaWYgKGlzTnVtZXJpYygrb2Zmc2V0KSkge1xyXG4gICAgb2Zmc2V0cyA9IFsrb2Zmc2V0LCAwXTtcclxuICB9IGVsc2Uge1xyXG4gICAgb2Zmc2V0cyA9IHBhcnNlT2Zmc2V0KG9mZnNldCwgcG9wcGVyLCByZWZlcmVuY2UsIGJhc2VQbGFjZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGJhc2VQbGFjZW1lbnQgPT09ICdsZWZ0Jykge1xyXG4gICAgcG9wcGVyLnRvcCArPSBvZmZzZXRzWzBdO1xyXG4gICAgcG9wcGVyLmxlZnQgLT0gb2Zmc2V0c1sxXTtcclxuICB9IGVsc2UgaWYgKGJhc2VQbGFjZW1lbnQgPT09ICdyaWdodCcpIHtcclxuICAgIHBvcHBlci50b3AgKz0gb2Zmc2V0c1swXTtcclxuICAgIHBvcHBlci5sZWZ0ICs9IG9mZnNldHNbMV07XHJcbiAgfSBlbHNlIGlmIChiYXNlUGxhY2VtZW50ID09PSAndG9wJykge1xyXG4gICAgcG9wcGVyLmxlZnQgKz0gb2Zmc2V0c1swXTtcclxuICAgIHBvcHBlci50b3AgLT0gb2Zmc2V0c1sxXTtcclxuICB9IGVsc2UgaWYgKGJhc2VQbGFjZW1lbnQgPT09ICdib3R0b20nKSB7XHJcbiAgICBwb3BwZXIubGVmdCArPSBvZmZzZXRzWzBdO1xyXG4gICAgcG9wcGVyLnRvcCArPSBvZmZzZXRzWzFdO1xyXG4gIH1cclxuXHJcbiAgZGF0YS5wb3BwZXIgPSBwb3BwZXI7XHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gcHJldmVudE92ZXJmbG93KGRhdGEsIG9wdGlvbnMpIHtcclxuICB2YXIgYm91bmRhcmllc0VsZW1lbnQgPSBvcHRpb25zLmJvdW5kYXJpZXNFbGVtZW50IHx8IGdldE9mZnNldFBhcmVudChkYXRhLmluc3RhbmNlLnBvcHBlcik7XHJcblxyXG4gIC8vIElmIG9mZnNldFBhcmVudCBpcyB0aGUgcmVmZXJlbmNlIGVsZW1lbnQsIHdlIHJlYWxseSB3YW50IHRvXHJcbiAgLy8gZ28gb25lIHN0ZXAgdXAgYW5kIHVzZSB0aGUgbmV4dCBvZmZzZXRQYXJlbnQgYXMgcmVmZXJlbmNlIHRvXHJcbiAgLy8gYXZvaWQgdG8gbWFrZSB0aGlzIG1vZGlmaWVyIGNvbXBsZXRlbHkgdXNlbGVzcyBhbmQgbG9vayBsaWtlIGJyb2tlblxyXG4gIGlmIChkYXRhLmluc3RhbmNlLnJlZmVyZW5jZSA9PT0gYm91bmRhcmllc0VsZW1lbnQpIHtcclxuICAgIGJvdW5kYXJpZXNFbGVtZW50ID0gZ2V0T2Zmc2V0UGFyZW50KGJvdW5kYXJpZXNFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIC8vIE5PVEU6IERPTSBhY2Nlc3MgaGVyZVxyXG4gIC8vIHJlc2V0cyB0aGUgcG9wcGVyJ3MgcG9zaXRpb24gc28gdGhhdCB0aGUgZG9jdW1lbnQgc2l6ZSBjYW4gYmUgY2FsY3VsYXRlZCBleGNsdWRpbmdcclxuICAvLyB0aGUgc2l6ZSBvZiB0aGUgcG9wcGVyIGVsZW1lbnQgaXRzZWxmXHJcbiAgdmFyIHRyYW5zZm9ybVByb3AgPSBnZXRTdXBwb3J0ZWRQcm9wZXJ0eU5hbWUoJ3RyYW5zZm9ybScpO1xyXG4gIHZhciBwb3BwZXJTdHlsZXMgPSBkYXRhLmluc3RhbmNlLnBvcHBlci5zdHlsZTsgLy8gYXNzaWdubWVudCB0byBoZWxwIG1pbmlmaWNhdGlvblxyXG4gIHZhciB0b3AgPSBwb3BwZXJTdHlsZXMudG9wLFxyXG4gICAgICBsZWZ0ID0gcG9wcGVyU3R5bGVzLmxlZnQsXHJcbiAgICAgIHRyYW5zZm9ybSA9IHBvcHBlclN0eWxlc1t0cmFuc2Zvcm1Qcm9wXTtcclxuXHJcbiAgcG9wcGVyU3R5bGVzLnRvcCA9ICcnO1xyXG4gIHBvcHBlclN0eWxlcy5sZWZ0ID0gJyc7XHJcbiAgcG9wcGVyU3R5bGVzW3RyYW5zZm9ybVByb3BdID0gJyc7XHJcblxyXG4gIHZhciBib3VuZGFyaWVzID0gZ2V0Qm91bmRhcmllcyhkYXRhLmluc3RhbmNlLnBvcHBlciwgZGF0YS5pbnN0YW5jZS5yZWZlcmVuY2UsIG9wdGlvbnMucGFkZGluZywgYm91bmRhcmllc0VsZW1lbnQsIGRhdGEucG9zaXRpb25GaXhlZCk7XHJcblxyXG4gIC8vIE5PVEU6IERPTSBhY2Nlc3MgaGVyZVxyXG4gIC8vIHJlc3RvcmVzIHRoZSBvcmlnaW5hbCBzdHlsZSBwcm9wZXJ0aWVzIGFmdGVyIHRoZSBvZmZzZXRzIGhhdmUgYmVlbiBjb21wdXRlZFxyXG4gIHBvcHBlclN0eWxlcy50b3AgPSB0b3A7XHJcbiAgcG9wcGVyU3R5bGVzLmxlZnQgPSBsZWZ0O1xyXG4gIHBvcHBlclN0eWxlc1t0cmFuc2Zvcm1Qcm9wXSA9IHRyYW5zZm9ybTtcclxuXHJcbiAgb3B0aW9ucy5ib3VuZGFyaWVzID0gYm91bmRhcmllcztcclxuXHJcbiAgdmFyIG9yZGVyID0gb3B0aW9ucy5wcmlvcml0eTtcclxuICB2YXIgcG9wcGVyID0gZGF0YS5vZmZzZXRzLnBvcHBlcjtcclxuXHJcbiAgdmFyIGNoZWNrID0ge1xyXG4gICAgcHJpbWFyeTogZnVuY3Rpb24gcHJpbWFyeShwbGFjZW1lbnQpIHtcclxuICAgICAgdmFyIHZhbHVlID0gcG9wcGVyW3BsYWNlbWVudF07XHJcbiAgICAgIGlmIChwb3BwZXJbcGxhY2VtZW50XSA8IGJvdW5kYXJpZXNbcGxhY2VtZW50XSAmJiAhb3B0aW9ucy5lc2NhcGVXaXRoUmVmZXJlbmNlKSB7XHJcbiAgICAgICAgdmFsdWUgPSBNYXRoLm1heChwb3BwZXJbcGxhY2VtZW50XSwgYm91bmRhcmllc1twbGFjZW1lbnRdKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkkMSh7fSwgcGxhY2VtZW50LCB2YWx1ZSk7XHJcbiAgICB9LFxyXG4gICAgc2Vjb25kYXJ5OiBmdW5jdGlvbiBzZWNvbmRhcnkocGxhY2VtZW50KSB7XHJcbiAgICAgIHZhciBtYWluU2lkZSA9IHBsYWNlbWVudCA9PT0gJ3JpZ2h0JyA/ICdsZWZ0JyA6ICd0b3AnO1xyXG4gICAgICB2YXIgdmFsdWUgPSBwb3BwZXJbbWFpblNpZGVdO1xyXG4gICAgICBpZiAocG9wcGVyW3BsYWNlbWVudF0gPiBib3VuZGFyaWVzW3BsYWNlbWVudF0gJiYgIW9wdGlvbnMuZXNjYXBlV2l0aFJlZmVyZW5jZSkge1xyXG4gICAgICAgIHZhbHVlID0gTWF0aC5taW4ocG9wcGVyW21haW5TaWRlXSwgYm91bmRhcmllc1twbGFjZW1lbnRdIC0gKHBsYWNlbWVudCA9PT0gJ3JpZ2h0JyA/IHBvcHBlci53aWR0aCA6IHBvcHBlci5oZWlnaHQpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkkMSh7fSwgbWFpblNpZGUsIHZhbHVlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBvcmRlci5mb3JFYWNoKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcclxuICAgIHZhciBzaWRlID0gWydsZWZ0JywgJ3RvcCddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTEgPyAncHJpbWFyeScgOiAnc2Vjb25kYXJ5JztcclxuICAgIHBvcHBlciA9IF9leHRlbmRzJDEoe30sIHBvcHBlciwgY2hlY2tbc2lkZV0ocGxhY2VtZW50KSk7XHJcbiAgfSk7XHJcblxyXG4gIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBwb3BwZXI7XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIHNoaWZ0KGRhdGEpIHtcclxuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQ7XHJcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuICB2YXIgc2hpZnR2YXJpYXRpb24gPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVsxXTtcclxuXHJcbiAgLy8gaWYgc2hpZnQgc2hpZnR2YXJpYXRpb24gaXMgc3BlY2lmaWVkLCBydW4gdGhlIG1vZGlmaWVyXHJcbiAgaWYgKHNoaWZ0dmFyaWF0aW9uKSB7XHJcbiAgICB2YXIgX2RhdGEkb2Zmc2V0cyA9IGRhdGEub2Zmc2V0cyxcclxuICAgICAgICByZWZlcmVuY2UgPSBfZGF0YSRvZmZzZXRzLnJlZmVyZW5jZSxcclxuICAgICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcjtcclxuXHJcbiAgICB2YXIgaXNWZXJ0aWNhbCA9IFsnYm90dG9tJywgJ3RvcCddLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgIT09IC0xO1xyXG4gICAgdmFyIHNpZGUgPSBpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCc7XHJcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSBpc1ZlcnRpY2FsID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xyXG5cclxuICAgIHZhciBzaGlmdE9mZnNldHMgPSB7XHJcbiAgICAgIHN0YXJ0OiBkZWZpbmVQcm9wZXJ0eSQxKHt9LCBzaWRlLCByZWZlcmVuY2Vbc2lkZV0pLFxyXG4gICAgICBlbmQ6IGRlZmluZVByb3BlcnR5JDEoe30sIHNpZGUsIHJlZmVyZW5jZVtzaWRlXSArIHJlZmVyZW5jZVttZWFzdXJlbWVudF0gLSBwb3BwZXJbbWVhc3VyZW1lbnRdKVxyXG4gICAgfTtcclxuXHJcbiAgICBkYXRhLm9mZnNldHMucG9wcGVyID0gX2V4dGVuZHMkMSh7fSwgcG9wcGVyLCBzaGlmdE9mZnNldHNbc2hpZnR2YXJpYXRpb25dKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IHVwZGF0ZSBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBoaWRlKGRhdGEpIHtcclxuICBpZiAoIWlzTW9kaWZpZXJSZXF1aXJlZChkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgJ2hpZGUnLCAncHJldmVudE92ZXJmbG93JykpIHtcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgdmFyIHJlZlJlY3QgPSBkYXRhLm9mZnNldHMucmVmZXJlbmNlO1xyXG4gIHZhciBib3VuZCA9IGZpbmQoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsIGZ1bmN0aW9uIChtb2RpZmllcikge1xyXG4gICAgcmV0dXJuIG1vZGlmaWVyLm5hbWUgPT09ICdwcmV2ZW50T3ZlcmZsb3cnO1xyXG4gIH0pLmJvdW5kYXJpZXM7XHJcblxyXG4gIGlmIChyZWZSZWN0LmJvdHRvbSA8IGJvdW5kLnRvcCB8fCByZWZSZWN0LmxlZnQgPiBib3VuZC5yaWdodCB8fCByZWZSZWN0LnRvcCA+IGJvdW5kLmJvdHRvbSB8fCByZWZSZWN0LnJpZ2h0IDwgYm91bmQubGVmdCkge1xyXG4gICAgLy8gQXZvaWQgdW5uZWNlc3NhcnkgRE9NIGFjY2VzcyBpZiB2aXNpYmlsaXR5IGhhc24ndCBjaGFuZ2VkXHJcbiAgICBpZiAoZGF0YS5oaWRlID09PSB0cnVlKSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEuaGlkZSA9IHRydWU7XHJcbiAgICBkYXRhLmF0dHJpYnV0ZXNbJ3gtb3V0LW9mLWJvdW5kYXJpZXMnXSA9ICcnO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBET00gYWNjZXNzIGlmIHZpc2liaWxpdHkgaGFzbid0IGNoYW5nZWRcclxuICAgIGlmIChkYXRhLmhpZGUgPT09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEuaGlkZSA9IGZhbHNlO1xyXG4gICAgZGF0YS5hdHRyaWJ1dGVzWyd4LW91dC1vZi1ib3VuZGFyaWVzJ10gPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIGlubmVyKGRhdGEpIHtcclxuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQ7XHJcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuICB2YXIgX2RhdGEkb2Zmc2V0cyA9IGRhdGEub2Zmc2V0cyxcclxuICAgICAgcG9wcGVyID0gX2RhdGEkb2Zmc2V0cy5wb3BwZXIsXHJcbiAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlO1xyXG5cclxuICB2YXIgaXNIb3JpeiA9IFsnbGVmdCcsICdyaWdodCddLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgIT09IC0xO1xyXG5cclxuICB2YXIgc3VidHJhY3RMZW5ndGggPSBbJ3RvcCcsICdsZWZ0J10uaW5kZXhPZihiYXNlUGxhY2VtZW50KSA9PT0gLTE7XHJcblxyXG4gIHBvcHBlcltpc0hvcml6ID8gJ2xlZnQnIDogJ3RvcCddID0gcmVmZXJlbmNlW2Jhc2VQbGFjZW1lbnRdIC0gKHN1YnRyYWN0TGVuZ3RoID8gcG9wcGVyW2lzSG9yaXogPyAnd2lkdGgnIDogJ2hlaWdodCddIDogMCk7XHJcblxyXG4gIGRhdGEucGxhY2VtZW50ID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KTtcclxuICBkYXRhLm9mZnNldHMucG9wcGVyID0gZ2V0Q2xpZW50UmVjdChwb3BwZXIpO1xyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIE1vZGlmaWVyIGZ1bmN0aW9uLCBlYWNoIG1vZGlmaWVyIGNhbiBoYXZlIGEgZnVuY3Rpb24gb2YgdGhpcyB0eXBlIGFzc2lnbmVkXHJcbiAqIHRvIGl0cyBgZm5gIHByb3BlcnR5LjxiciAvPlxyXG4gKiBUaGVzZSBmdW5jdGlvbnMgd2lsbCBiZSBjYWxsZWQgb24gZWFjaCB1cGRhdGUsIHRoaXMgbWVhbnMgdGhhdCB5b3UgbXVzdFxyXG4gKiBtYWtlIHN1cmUgdGhleSBhcmUgcGVyZm9ybWFudCBlbm91Z2ggdG8gYXZvaWQgcGVyZm9ybWFuY2UgYm90dGxlbmVja3MuXHJcbiAqXHJcbiAqIEBmdW5jdGlvbiBNb2RpZmllckZuXHJcbiAqIEBhcmd1bWVudCB7ZGF0YU9iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge2RhdGFPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcblxyXG4vKipcclxuICogTW9kaWZpZXJzIGFyZSBwbHVnaW5zIHVzZWQgdG8gYWx0ZXIgdGhlIGJlaGF2aW9yIG9mIHlvdXIgcG9wcGVycy48YnIgLz5cclxuICogUG9wcGVyLmpzIHVzZXMgYSBzZXQgb2YgOSBtb2RpZmllcnMgdG8gcHJvdmlkZSBhbGwgdGhlIGJhc2ljIGZ1bmN0aW9uYWxpdGllc1xyXG4gKiBuZWVkZWQgYnkgdGhlIGxpYnJhcnkuXHJcbiAqXHJcbiAqIFVzdWFsbHkgeW91IGRvbid0IHdhbnQgdG8gb3ZlcnJpZGUgdGhlIGBvcmRlcmAsIGBmbmAgYW5kIGBvbkxvYWRgIHByb3BzLlxyXG4gKiBBbGwgdGhlIG90aGVyIHByb3BlcnRpZXMgYXJlIGNvbmZpZ3VyYXRpb25zIHRoYXQgY291bGQgYmUgdHdlYWtlZC5cclxuICogQG5hbWVzcGFjZSBtb2RpZmllcnNcclxuICovXHJcbnZhciBtb2RpZmllcnMgPSB7XHJcbiAgLyoqXHJcbiAgICogTW9kaWZpZXIgdXNlZCB0byBzaGlmdCB0aGUgcG9wcGVyIG9uIHRoZSBzdGFydCBvciBlbmQgb2YgaXRzIHJlZmVyZW5jZVxyXG4gICAqIGVsZW1lbnQuPGJyIC8+XHJcbiAgICogSXQgd2lsbCByZWFkIHRoZSB2YXJpYXRpb24gb2YgdGhlIGBwbGFjZW1lbnRgIHByb3BlcnR5LjxiciAvPlxyXG4gICAqIEl0IGNhbiBiZSBvbmUgZWl0aGVyIGAtZW5kYCBvciBgLXN0YXJ0YC5cclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgc2hpZnQ6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj0xMDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogMTAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBzaGlmdFxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBgb2Zmc2V0YCBtb2RpZmllciBjYW4gc2hpZnQgeW91ciBwb3BwZXIgb24gYm90aCBpdHMgYXhpcy5cclxuICAgKlxyXG4gICAqIEl0IGFjY2VwdHMgdGhlIGZvbGxvd2luZyB1bml0czpcclxuICAgKiAtIGBweGAgb3IgdW5pdGxlc3MsIGludGVycHJldGVkIGFzIHBpeGVsc1xyXG4gICAqIC0gYCVgIG9yIGAlcmAsIHBlcmNlbnRhZ2UgcmVsYXRpdmUgdG8gdGhlIGxlbmd0aCBvZiB0aGUgcmVmZXJlbmNlIGVsZW1lbnRcclxuICAgKiAtIGAlcGAsIHBlcmNlbnRhZ2UgcmVsYXRpdmUgdG8gdGhlIGxlbmd0aCBvZiB0aGUgcG9wcGVyIGVsZW1lbnRcclxuICAgKiAtIGB2d2AsIENTUyB2aWV3cG9ydCB3aWR0aCB1bml0XHJcbiAgICogLSBgdmhgLCBDU1Mgdmlld3BvcnQgaGVpZ2h0IHVuaXRcclxuICAgKlxyXG4gICAqIEZvciBsZW5ndGggaXMgaW50ZW5kZWQgdGhlIG1haW4gYXhpcyByZWxhdGl2ZSB0byB0aGUgcGxhY2VtZW50IG9mIHRoZSBwb3BwZXIuPGJyIC8+XHJcbiAgICogVGhpcyBtZWFucyB0aGF0IGlmIHRoZSBwbGFjZW1lbnQgaXMgYHRvcGAgb3IgYGJvdHRvbWAsIHRoZSBsZW5ndGggd2lsbCBiZSB0aGVcclxuICAgKiBgd2lkdGhgLiBJbiBjYXNlIG9mIGBsZWZ0YCBvciBgcmlnaHRgLCBpdCB3aWxsIGJlIHRoZSBoZWlnaHQuXHJcbiAgICpcclxuICAgKiBZb3UgY2FuIHByb3ZpZGUgYSBzaW5nbGUgdmFsdWUgKGFzIGBOdW1iZXJgIG9yIGBTdHJpbmdgKSwgb3IgYSBwYWlyIG9mIHZhbHVlc1xyXG4gICAqIGFzIGBTdHJpbmdgIGRpdmlkZWQgYnkgYSBjb21tYSBvciBvbmUgKG9yIG1vcmUpIHdoaXRlIHNwYWNlcy48YnIgLz5cclxuICAgKiBUaGUgbGF0dGVyIGlzIGEgZGVwcmVjYXRlZCBtZXRob2QgYmVjYXVzZSBpdCBsZWFkcyB0byBjb25mdXNpb24gYW5kIHdpbGwgYmVcclxuICAgKiByZW1vdmVkIGluIHYyLjxiciAvPlxyXG4gICAqIEFkZGl0aW9uYWxseSwgaXQgYWNjZXB0cyBhZGRpdGlvbnMgYW5kIHN1YnRyYWN0aW9ucyBiZXR3ZWVuIGRpZmZlcmVudCB1bml0cy5cclxuICAgKiBOb3RlIHRoYXQgbXVsdGlwbGljYXRpb25zIGFuZCBkaXZpc2lvbnMgYXJlbid0IHN1cHBvcnRlZC5cclxuICAgKlxyXG4gICAqIFZhbGlkIGV4YW1wbGVzIGFyZTpcclxuICAgKiBgYGBcclxuICAgKiAxMFxyXG4gICAqICcxMCUnXHJcbiAgICogJzEwLCAxMCdcclxuICAgKiAnMTAlLCAxMCdcclxuICAgKiAnMTAgKyAxMCUnXHJcbiAgICogJzEwIC0gNXZoICsgMyUnXHJcbiAgICogJy0xMHB4ICsgNXZoLCA1cHggLSA2JSdcclxuICAgKiBgYGBcclxuICAgKiA+ICoqTkIqKjogSWYgeW91IGRlc2lyZSB0byBhcHBseSBvZmZzZXRzIHRvIHlvdXIgcG9wcGVycyBpbiBhIHdheSB0aGF0IG1heSBtYWtlIHRoZW0gb3ZlcmxhcFxyXG4gICAqID4gd2l0aCB0aGVpciByZWZlcmVuY2UgZWxlbWVudCwgdW5mb3J0dW5hdGVseSwgeW91IHdpbGwgaGF2ZSB0byBkaXNhYmxlIHRoZSBgZmxpcGAgbW9kaWZpZXIuXHJcbiAgICogPiBNb3JlIG9uIHRoaXMgW3JlYWRpbmcgdGhpcyBpc3N1ZV0oaHR0cHM6Ly9naXRodWIuY29tL0ZlelZyYXN0YS9wb3BwZXIuanMvaXNzdWVzLzM3MylcclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBvZmZzZXQ6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj0yMDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogMjAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBvZmZzZXQsXHJcbiAgICAvKiogQHByb3Age051bWJlcnxTdHJpbmd9IG9mZnNldD0wXHJcbiAgICAgKiBUaGUgb2Zmc2V0IHZhbHVlIGFzIGRlc2NyaWJlZCBpbiB0aGUgbW9kaWZpZXIgZGVzY3JpcHRpb25cclxuICAgICAqL1xyXG4gICAgb2Zmc2V0OiAwXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogTW9kaWZpZXIgdXNlZCB0byBwcmV2ZW50IHRoZSBwb3BwZXIgZnJvbSBiZWluZyBwb3NpdGlvbmVkIG91dHNpZGUgdGhlIGJvdW5kYXJ5LlxyXG4gICAqXHJcbiAgICogQW4gc2NlbmFyaW8gZXhpc3RzIHdoZXJlIHRoZSByZWZlcmVuY2UgaXRzZWxmIGlzIG5vdCB3aXRoaW4gdGhlIGJvdW5kYXJpZXMuPGJyIC8+XHJcbiAgICogV2UgY2FuIHNheSBpdCBoYXMgXCJlc2NhcGVkIHRoZSBib3VuZGFyaWVzXCIg4oCUIG9yIGp1c3QgXCJlc2NhcGVkXCIuPGJyIC8+XHJcbiAgICogSW4gdGhpcyBjYXNlIHdlIG5lZWQgdG8gZGVjaWRlIHdoZXRoZXIgdGhlIHBvcHBlciBzaG91bGQgZWl0aGVyOlxyXG4gICAqXHJcbiAgICogLSBkZXRhY2ggZnJvbSB0aGUgcmVmZXJlbmNlIGFuZCByZW1haW4gXCJ0cmFwcGVkXCIgaW4gdGhlIGJvdW5kYXJpZXMsIG9yXHJcbiAgICogLSBpZiBpdCBzaG91bGQgaWdub3JlIHRoZSBib3VuZGFyeSBhbmQgXCJlc2NhcGUgd2l0aCBpdHMgcmVmZXJlbmNlXCJcclxuICAgKlxyXG4gICAqIFdoZW4gYGVzY2FwZVdpdGhSZWZlcmVuY2VgIGlzIHNldCB0b2B0cnVlYCBhbmQgcmVmZXJlbmNlIGlzIGNvbXBsZXRlbHlcclxuICAgKiBvdXRzaWRlIGl0cyBib3VuZGFyaWVzLCB0aGUgcG9wcGVyIHdpbGwgb3ZlcmZsb3cgKG9yIGNvbXBsZXRlbHkgbGVhdmUpXHJcbiAgICogdGhlIGJvdW5kYXJpZXMgaW4gb3JkZXIgdG8gcmVtYWluIGF0dGFjaGVkIHRvIHRoZSBlZGdlIG9mIHRoZSByZWZlcmVuY2UuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgcHJldmVudE92ZXJmbG93OiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9MzAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDMwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogcHJldmVudE92ZXJmbG93LFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7QXJyYXl9IFtwcmlvcml0eT1bJ2xlZnQnLCdyaWdodCcsJ3RvcCcsJ2JvdHRvbSddXVxyXG4gICAgICogUG9wcGVyIHdpbGwgdHJ5IHRvIHByZXZlbnQgb3ZlcmZsb3cgZm9sbG93aW5nIHRoZXNlIHByaW9yaXRpZXMgYnkgZGVmYXVsdCxcclxuICAgICAqIHRoZW4sIGl0IGNvdWxkIG92ZXJmbG93IG9uIHRoZSBsZWZ0IGFuZCBvbiB0b3Agb2YgdGhlIGBib3VuZGFyaWVzRWxlbWVudGBcclxuICAgICAqL1xyXG4gICAgcHJpb3JpdHk6IFsnbGVmdCcsICdyaWdodCcsICd0b3AnLCAnYm90dG9tJ10sXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtudW1iZXJ9IHBhZGRpbmc9NVxyXG4gICAgICogQW1vdW50IG9mIHBpeGVsIHVzZWQgdG8gZGVmaW5lIGEgbWluaW11bSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBib3VuZGFyaWVzXHJcbiAgICAgKiBhbmQgdGhlIHBvcHBlciB0aGlzIG1ha2VzIHN1cmUgdGhlIHBvcHBlciBoYXMgYWx3YXlzIGEgbGl0dGxlIHBhZGRpbmdcclxuICAgICAqIGJldHdlZW4gdGhlIGVkZ2VzIG9mIGl0cyBjb250YWluZXJcclxuICAgICAqL1xyXG4gICAgcGFkZGluZzogNSxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age1N0cmluZ3xIVE1MRWxlbWVudH0gYm91bmRhcmllc0VsZW1lbnQ9J3Njcm9sbFBhcmVudCdcclxuICAgICAqIEJvdW5kYXJpZXMgdXNlZCBieSB0aGUgbW9kaWZpZXIsIGNhbiBiZSBgc2Nyb2xsUGFyZW50YCwgYHdpbmRvd2AsXHJcbiAgICAgKiBgdmlld3BvcnRgIG9yIGFueSBET00gZWxlbWVudC5cclxuICAgICAqL1xyXG4gICAgYm91bmRhcmllc0VsZW1lbnQ6ICdzY3JvbGxQYXJlbnQnXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogTW9kaWZpZXIgdXNlZCB0byBtYWtlIHN1cmUgdGhlIHJlZmVyZW5jZSBhbmQgaXRzIHBvcHBlciBzdGF5IG5lYXIgZWFjaG90aGVyc1xyXG4gICAqIHdpdGhvdXQgbGVhdmluZyBhbnkgZ2FwIGJldHdlZW4gdGhlIHR3by4gRXhwZWNpYWxseSB1c2VmdWwgd2hlbiB0aGUgYXJyb3cgaXNcclxuICAgKiBlbmFibGVkIGFuZCB5b3Ugd2FudCB0byBhc3N1cmUgaXQgdG8gcG9pbnQgdG8gaXRzIHJlZmVyZW5jZSBlbGVtZW50LlxyXG4gICAqIEl0IGNhcmVzIG9ubHkgYWJvdXQgdGhlIGZpcnN0IGF4aXMsIHlvdSBjYW4gc3RpbGwgaGF2ZSBwb3BwZXJzIHdpdGggbWFyZ2luXHJcbiAgICogYmV0d2VlbiB0aGUgcG9wcGVyIGFuZCBpdHMgcmVmZXJlbmNlIGVsZW1lbnQuXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIGtlZXBUb2dldGhlcjoge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTQwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiA0MDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IGtlZXBUb2dldGhlclxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFRoaXMgbW9kaWZpZXIgaXMgdXNlZCB0byBtb3ZlIHRoZSBgYXJyb3dFbGVtZW50YCBvZiB0aGUgcG9wcGVyIHRvIG1ha2VcclxuICAgKiBzdXJlIGl0IGlzIHBvc2l0aW9uZWQgYmV0d2VlbiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgYW5kIGl0cyBwb3BwZXIgZWxlbWVudC5cclxuICAgKiBJdCB3aWxsIHJlYWQgdGhlIG91dGVyIHNpemUgb2YgdGhlIGBhcnJvd0VsZW1lbnRgIG5vZGUgdG8gZGV0ZWN0IGhvdyBtYW55XHJcbiAgICogcGl4ZWxzIG9mIGNvbmp1Y3Rpb24gYXJlIG5lZWRlZC5cclxuICAgKlxyXG4gICAqIEl0IGhhcyBubyBlZmZlY3QgaWYgbm8gYGFycm93RWxlbWVudGAgaXMgcHJvdmlkZWQuXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIGFycm93OiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9NTAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDUwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogYXJyb3csXHJcbiAgICAvKiogQHByb3Age1N0cmluZ3xIVE1MRWxlbWVudH0gZWxlbWVudD0nW3gtYXJyb3ddJyAtIFNlbGVjdG9yIG9yIG5vZGUgdXNlZCBhcyBhcnJvdyAqL1xyXG4gICAgZWxlbWVudDogJ1t4LWFycm93XSdcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBNb2RpZmllciB1c2VkIHRvIGZsaXAgdGhlIHBvcHBlcidzIHBsYWNlbWVudCB3aGVuIGl0IHN0YXJ0cyB0byBvdmVybGFwIGl0c1xyXG4gICAqIHJlZmVyZW5jZSBlbGVtZW50LlxyXG4gICAqXHJcbiAgICogUmVxdWlyZXMgdGhlIGBwcmV2ZW50T3ZlcmZsb3dgIG1vZGlmaWVyIGJlZm9yZSBpdCBpbiBvcmRlciB0byB3b3JrLlxyXG4gICAqXHJcbiAgICogKipOT1RFOioqIHRoaXMgbW9kaWZpZXIgd2lsbCBpbnRlcnJ1cHQgdGhlIGN1cnJlbnQgdXBkYXRlIGN5Y2xlIGFuZCB3aWxsXHJcbiAgICogcmVzdGFydCBpdCBpZiBpdCBkZXRlY3RzIHRoZSBuZWVkIHRvIGZsaXAgdGhlIHBsYWNlbWVudC5cclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgZmxpcDoge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTYwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiA2MDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IGZsaXAsXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtTdHJpbmd8QXJyYXl9IGJlaGF2aW9yPSdmbGlwJ1xyXG4gICAgICogVGhlIGJlaGF2aW9yIHVzZWQgdG8gY2hhbmdlIHRoZSBwb3BwZXIncyBwbGFjZW1lbnQuIEl0IGNhbiBiZSBvbmUgb2ZcclxuICAgICAqIGBmbGlwYCwgYGNsb2Nrd2lzZWAsIGBjb3VudGVyY2xvY2t3aXNlYCBvciBhbiBhcnJheSB3aXRoIGEgbGlzdCBvZiB2YWxpZFxyXG4gICAgICogcGxhY2VtZW50cyAod2l0aCBvcHRpb25hbCB2YXJpYXRpb25zKS5cclxuICAgICAqL1xyXG4gICAgYmVoYXZpb3I6ICdmbGlwJyxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age251bWJlcn0gcGFkZGluZz01XHJcbiAgICAgKiBUaGUgcG9wcGVyIHdpbGwgZmxpcCBpZiBpdCBoaXRzIHRoZSBlZGdlcyBvZiB0aGUgYGJvdW5kYXJpZXNFbGVtZW50YFxyXG4gICAgICovXHJcbiAgICBwYWRkaW5nOiA1LFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7U3RyaW5nfEhUTUxFbGVtZW50fSBib3VuZGFyaWVzRWxlbWVudD0ndmlld3BvcnQnXHJcbiAgICAgKiBUaGUgZWxlbWVudCB3aGljaCB3aWxsIGRlZmluZSB0aGUgYm91bmRhcmllcyBvZiB0aGUgcG9wcGVyIHBvc2l0aW9uLFxyXG4gICAgICogdGhlIHBvcHBlciB3aWxsIG5ldmVyIGJlIHBsYWNlZCBvdXRzaWRlIG9mIHRoZSBkZWZpbmVkIGJvdW5kYXJpZXNcclxuICAgICAqIChleGNlcHQgaWYga2VlcFRvZ2V0aGVyIGlzIGVuYWJsZWQpXHJcbiAgICAgKi9cclxuICAgIGJvdW5kYXJpZXNFbGVtZW50OiAndmlld3BvcnQnXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogTW9kaWZpZXIgdXNlZCB0byBtYWtlIHRoZSBwb3BwZXIgZmxvdyB0b3dhcmQgdGhlIGlubmVyIG9mIHRoZSByZWZlcmVuY2UgZWxlbWVudC5cclxuICAgKiBCeSBkZWZhdWx0LCB3aGVuIHRoaXMgbW9kaWZpZXIgaXMgZGlzYWJsZWQsIHRoZSBwb3BwZXIgd2lsbCBiZSBwbGFjZWQgb3V0c2lkZVxyXG4gICAqIHRoZSByZWZlcmVuY2UgZWxlbWVudC5cclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgaW5uZXI6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj03MDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogNzAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPWZhbHNlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IGZhbHNlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IGlubmVyXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogTW9kaWZpZXIgdXNlZCB0byBoaWRlIHRoZSBwb3BwZXIgd2hlbiBpdHMgcmVmZXJlbmNlIGVsZW1lbnQgaXMgb3V0c2lkZSBvZiB0aGVcclxuICAgKiBwb3BwZXIgYm91bmRhcmllcy4gSXQgd2lsbCBzZXQgYSBgeC1vdXQtb2YtYm91bmRhcmllc2AgYXR0cmlidXRlIHdoaWNoIGNhblxyXG4gICAqIGJlIHVzZWQgdG8gaGlkZSB3aXRoIGEgQ1NTIHNlbGVjdG9yIHRoZSBwb3BwZXIgd2hlbiBpdHMgcmVmZXJlbmNlIGlzXHJcbiAgICogb3V0IG9mIGJvdW5kYXJpZXMuXHJcbiAgICpcclxuICAgKiBSZXF1aXJlcyB0aGUgYHByZXZlbnRPdmVyZmxvd2AgbW9kaWZpZXIgYmVmb3JlIGl0IGluIG9yZGVyIHRvIHdvcmsuXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIGhpZGU6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj04MDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogODAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBoaWRlXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ29tcHV0ZXMgdGhlIHN0eWxlIHRoYXQgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIgZWxlbWVudCB0byBnZXRzXHJcbiAgICogcHJvcGVybHkgcG9zaXRpb25lZC5cclxuICAgKlxyXG4gICAqIE5vdGUgdGhhdCB0aGlzIG1vZGlmaWVyIHdpbGwgbm90IHRvdWNoIHRoZSBET00sIGl0IGp1c3QgcHJlcGFyZXMgdGhlIHN0eWxlc1xyXG4gICAqIHNvIHRoYXQgYGFwcGx5U3R5bGVgIG1vZGlmaWVyIGNhbiBhcHBseSBpdC4gVGhpcyBzZXBhcmF0aW9uIGlzIHVzZWZ1bFxyXG4gICAqIGluIGNhc2UgeW91IG5lZWQgdG8gcmVwbGFjZSBgYXBwbHlTdHlsZWAgd2l0aCBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvbi5cclxuICAgKlxyXG4gICAqIFRoaXMgbW9kaWZpZXIgaGFzIGA4NTBgIGFzIGBvcmRlcmAgdmFsdWUgdG8gbWFpbnRhaW4gYmFja3dhcmQgY29tcGF0aWJpbGl0eVxyXG4gICAqIHdpdGggcHJldmlvdXMgdmVyc2lvbnMgb2YgUG9wcGVyLmpzLiBFeHBlY3QgdGhlIG1vZGlmaWVycyBvcmRlcmluZyBtZXRob2RcclxuICAgKiB0byBjaGFuZ2UgaW4gZnV0dXJlIG1ham9yIHZlcnNpb25zIG9mIHRoZSBsaWJyYXJ5LlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIGNvbXB1dGVTdHlsZToge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTg1MCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiA4NTAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IGNvbXB1dGVTdHlsZSxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age0Jvb2xlYW59IGdwdUFjY2VsZXJhdGlvbj10cnVlXHJcbiAgICAgKiBJZiB0cnVlLCBpdCB1c2VzIHRoZSBDU1MgM2QgdHJhbnNmb3JtYXRpb24gdG8gcG9zaXRpb24gdGhlIHBvcHBlci5cclxuICAgICAqIE90aGVyd2lzZSwgaXQgd2lsbCB1c2UgdGhlIGB0b3BgIGFuZCBgbGVmdGAgcHJvcGVydGllcy5cclxuICAgICAqL1xyXG4gICAgZ3B1QWNjZWxlcmF0aW9uOiB0cnVlLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7c3RyaW5nfSBbeD0nYm90dG9tJ11cclxuICAgICAqIFdoZXJlIHRvIGFuY2hvciB0aGUgWCBheGlzIChgYm90dG9tYCBvciBgdG9wYCkuIEFLQSBYIG9mZnNldCBvcmlnaW4uXHJcbiAgICAgKiBDaGFuZ2UgdGhpcyBpZiB5b3VyIHBvcHBlciBzaG91bGQgZ3JvdyBpbiBhIGRpcmVjdGlvbiBkaWZmZXJlbnQgZnJvbSBgYm90dG9tYFxyXG4gICAgICovXHJcbiAgICB4OiAnYm90dG9tJyxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age3N0cmluZ30gW3g9J2xlZnQnXVxyXG4gICAgICogV2hlcmUgdG8gYW5jaG9yIHRoZSBZIGF4aXMgKGBsZWZ0YCBvciBgcmlnaHRgKS4gQUtBIFkgb2Zmc2V0IG9yaWdpbi5cclxuICAgICAqIENoYW5nZSB0aGlzIGlmIHlvdXIgcG9wcGVyIHNob3VsZCBncm93IGluIGEgZGlyZWN0aW9uIGRpZmZlcmVudCBmcm9tIGByaWdodGBcclxuICAgICAqL1xyXG4gICAgeTogJ3JpZ2h0J1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEFwcGxpZXMgdGhlIGNvbXB1dGVkIHN0eWxlcyB0byB0aGUgcG9wcGVyIGVsZW1lbnQuXHJcbiAgICpcclxuICAgKiBBbGwgdGhlIERPTSBtYW5pcHVsYXRpb25zIGFyZSBsaW1pdGVkIHRvIHRoaXMgbW9kaWZpZXIuIFRoaXMgaXMgdXNlZnVsIGluIGNhc2VcclxuICAgKiB5b3Ugd2FudCB0byBpbnRlZ3JhdGUgUG9wcGVyLmpzIGluc2lkZSBhIGZyYW1ld29yayBvciB2aWV3IGxpYnJhcnkgYW5kIHlvdVxyXG4gICAqIHdhbnQgdG8gZGVsZWdhdGUgYWxsIHRoZSBET00gbWFuaXB1bGF0aW9ucyB0byBpdC5cclxuICAgKlxyXG4gICAqIE5vdGUgdGhhdCBpZiB5b3UgZGlzYWJsZSB0aGlzIG1vZGlmaWVyLCB5b3UgbXVzdCBtYWtlIHN1cmUgdGhlIHBvcHBlciBlbGVtZW50XHJcbiAgICogaGFzIGl0cyBwb3NpdGlvbiBzZXQgdG8gYGFic29sdXRlYCBiZWZvcmUgUG9wcGVyLmpzIGNhbiBkbyBpdHMgd29yayFcclxuICAgKlxyXG4gICAqIEp1c3QgZGlzYWJsZSB0aGlzIG1vZGlmaWVyIGFuZCBkZWZpbmUgeW91IG93biB0byBhY2hpZXZlIHRoZSBkZXNpcmVkIGVmZmVjdC5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBhcHBseVN0eWxlOiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9OTAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDkwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogYXBwbHlTdHlsZSxcclxuICAgIC8qKiBAcHJvcCB7RnVuY3Rpb259ICovXHJcbiAgICBvbkxvYWQ6IGFwcGx5U3R5bGVPbkxvYWQsXHJcbiAgICAvKipcclxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMS4xMC4wLCB0aGUgcHJvcGVydHkgbW92ZWQgdG8gYGNvbXB1dGVTdHlsZWAgbW9kaWZpZXJcclxuICAgICAqIEBwcm9wIHtCb29sZWFufSBncHVBY2NlbGVyYXRpb249dHJ1ZVxyXG4gICAgICogSWYgdHJ1ZSwgaXQgdXNlcyB0aGUgQ1NTIDNkIHRyYW5zZm9ybWF0aW9uIHRvIHBvc2l0aW9uIHRoZSBwb3BwZXIuXHJcbiAgICAgKiBPdGhlcndpc2UsIGl0IHdpbGwgdXNlIHRoZSBgdG9wYCBhbmQgYGxlZnRgIHByb3BlcnRpZXMuXHJcbiAgICAgKi9cclxuICAgIGdwdUFjY2VsZXJhdGlvbjogdW5kZWZpbmVkXHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBgZGF0YU9iamVjdGAgaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBpbmZvcm1hdGlvbnMgdXNlZCBieSBQb3BwZXIuanNcclxuICogdGhpcyBvYmplY3QgZ2V0IHBhc3NlZCB0byBtb2RpZmllcnMgYW5kIHRvIHRoZSBgb25DcmVhdGVgIGFuZCBgb25VcGRhdGVgIGNhbGxiYWNrcy5cclxuICogQG5hbWUgZGF0YU9iamVjdFxyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5pbnN0YW5jZSBUaGUgUG9wcGVyLmpzIGluc3RhbmNlXHJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBkYXRhLnBsYWNlbWVudCBQbGFjZW1lbnQgYXBwbGllZCB0byBwb3BwZXJcclxuICogQHByb3BlcnR5IHtTdHJpbmd9IGRhdGEub3JpZ2luYWxQbGFjZW1lbnQgUGxhY2VtZW50IG9yaWdpbmFsbHkgZGVmaW5lZCBvbiBpbml0XHJcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGF0YS5mbGlwcGVkIFRydWUgaWYgcG9wcGVyIGhhcyBiZWVuIGZsaXBwZWQgYnkgZmxpcCBtb2RpZmllclxyXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IGRhdGEuaGlkZSBUcnVlIGlmIHRoZSByZWZlcmVuY2UgZWxlbWVudCBpcyBvdXQgb2YgYm91bmRhcmllcywgdXNlZnVsIHRvIGtub3cgd2hlbiB0byBoaWRlIHRoZSBwb3BwZXIuXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGRhdGEuYXJyb3dFbGVtZW50IE5vZGUgdXNlZCBhcyBhcnJvdyBieSBhcnJvdyBtb2RpZmllclxyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5zdHlsZXMgQW55IENTUyBwcm9wZXJ0eSBkZWZpbmVkIGhlcmUgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIsIGl0IGV4cGVjdHMgdGhlIEphdmFTY3JpcHQgbm9tZW5jbGF0dXJlIChlZy4gYG1hcmdpbkJvdHRvbWApXHJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLmFycm93U3R5bGVzIEFueSBDU1MgcHJvcGVydHkgZGVmaW5lZCBoZXJlIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyIGFycm93LCBpdCBleHBlY3RzIHRoZSBKYXZhU2NyaXB0IG5vbWVuY2xhdHVyZSAoZWcuIGBtYXJnaW5Cb3R0b21gKVxyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5ib3VuZGFyaWVzIE9mZnNldHMgb2YgdGhlIHBvcHBlciBib3VuZGFyaWVzXHJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLm9mZnNldHMgVGhlIG1lYXN1cmVtZW50cyBvZiBwb3BwZXIsIHJlZmVyZW5jZSBhbmQgYXJyb3cgZWxlbWVudHMuXHJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLm9mZnNldHMucG9wcGVyIGB0b3BgLCBgbGVmdGAsIGB3aWR0aGAsIGBoZWlnaHRgIHZhbHVlc1xyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSBgdG9wYCwgYGxlZnRgLCBgd2lkdGhgLCBgaGVpZ2h0YCB2YWx1ZXNcclxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEub2Zmc2V0cy5hcnJvd10gYHRvcGAgYW5kIGBsZWZ0YCBvZmZzZXRzLCBvbmx5IG9uZSBvZiB0aGVtIHdpbGwgYmUgZGlmZmVyZW50IGZyb20gMFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBEZWZhdWx0IG9wdGlvbnMgcHJvdmlkZWQgdG8gUG9wcGVyLmpzIGNvbnN0cnVjdG9yLjxiciAvPlxyXG4gKiBUaGVzZSBjYW4gYmUgb3ZlcnJpZGVuIHVzaW5nIHRoZSBgb3B0aW9uc2AgYXJndW1lbnQgb2YgUG9wcGVyLmpzLjxiciAvPlxyXG4gKiBUbyBvdmVycmlkZSBhbiBvcHRpb24sIHNpbXBseSBwYXNzIGFzIDNyZCBhcmd1bWVudCBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZVxyXG4gKiBzdHJ1Y3R1cmUgb2YgdGhpcyBvYmplY3QsIGV4YW1wbGU6XHJcbiAqIGBgYFxyXG4gKiBuZXcgUG9wcGVyKHJlZiwgcG9wLCB7XHJcbiAqICAgbW9kaWZpZXJzOiB7XHJcbiAqICAgICBwcmV2ZW50T3ZlcmZsb3c6IHsgZW5hYmxlZDogZmFsc2UgfVxyXG4gKiAgIH1cclxuICogfSlcclxuICogYGBgXHJcbiAqIEB0eXBlIHtPYmplY3R9XHJcbiAqIEBzdGF0aWNcclxuICogQG1lbWJlcm9mIFBvcHBlclxyXG4gKi9cclxudmFyIERlZmF1bHRzID0ge1xyXG4gIC8qKlxyXG4gICAqIFBvcHBlcidzIHBsYWNlbWVudFxyXG4gICAqIEBwcm9wIHtQb3BwZXIucGxhY2VtZW50c30gcGxhY2VtZW50PSdib3R0b20nXHJcbiAgICovXHJcbiAgcGxhY2VtZW50OiAnYm90dG9tJyxcclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRoaXMgdG8gdHJ1ZSBpZiB5b3Ugd2FudCBwb3BwZXIgdG8gcG9zaXRpb24gaXQgc2VsZiBpbiAnZml4ZWQnIG1vZGVcclxuICAgKiBAcHJvcCB7Qm9vbGVhbn0gcG9zaXRpb25GaXhlZD1mYWxzZVxyXG4gICAqL1xyXG4gIHBvc2l0aW9uRml4ZWQ6IGZhbHNlLFxyXG5cclxuICAvKipcclxuICAgKiBXaGV0aGVyIGV2ZW50cyAocmVzaXplLCBzY3JvbGwpIGFyZSBpbml0aWFsbHkgZW5hYmxlZFxyXG4gICAqIEBwcm9wIHtCb29sZWFufSBldmVudHNFbmFibGVkPXRydWVcclxuICAgKi9cclxuICBldmVudHNFbmFibGVkOiB0cnVlLFxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdG8gdHJ1ZSBpZiB5b3Ugd2FudCB0byBhdXRvbWF0aWNhbGx5IHJlbW92ZSB0aGUgcG9wcGVyIHdoZW5cclxuICAgKiB5b3UgY2FsbCB0aGUgYGRlc3Ryb3lgIG1ldGhvZC5cclxuICAgKiBAcHJvcCB7Qm9vbGVhbn0gcmVtb3ZlT25EZXN0cm95PWZhbHNlXHJcbiAgICovXHJcbiAgcmVtb3ZlT25EZXN0cm95OiBmYWxzZSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIHBvcHBlciBpcyBjcmVhdGVkLjxiciAvPlxyXG4gICAqIEJ5IGRlZmF1bHQsIGlzIHNldCB0byBuby1vcC48YnIgLz5cclxuICAgKiBBY2Nlc3MgUG9wcGVyLmpzIGluc3RhbmNlIHdpdGggYGRhdGEuaW5zdGFuY2VgLlxyXG4gICAqIEBwcm9wIHtvbkNyZWF0ZX1cclxuICAgKi9cclxuICBvbkNyZWF0ZTogZnVuY3Rpb24gb25DcmVhdGUoKSB7fSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIHBvcHBlciBpcyB1cGRhdGVkLCB0aGlzIGNhbGxiYWNrIGlzIG5vdCBjYWxsZWRcclxuICAgKiBvbiB0aGUgaW5pdGlhbGl6YXRpb24vY3JlYXRpb24gb2YgdGhlIHBvcHBlciwgYnV0IG9ubHkgb24gc3Vic2VxdWVudFxyXG4gICAqIHVwZGF0ZXMuPGJyIC8+XHJcbiAgICogQnkgZGVmYXVsdCwgaXMgc2V0IHRvIG5vLW9wLjxiciAvPlxyXG4gICAqIEFjY2VzcyBQb3BwZXIuanMgaW5zdGFuY2Ugd2l0aCBgZGF0YS5pbnN0YW5jZWAuXHJcbiAgICogQHByb3Age29uVXBkYXRlfVxyXG4gICAqL1xyXG4gIG9uVXBkYXRlOiBmdW5jdGlvbiBvblVwZGF0ZSgpIHt9LFxyXG5cclxuICAvKipcclxuICAgKiBMaXN0IG9mIG1vZGlmaWVycyB1c2VkIHRvIG1vZGlmeSB0aGUgb2Zmc2V0cyBiZWZvcmUgdGhleSBhcmUgYXBwbGllZCB0byB0aGUgcG9wcGVyLlxyXG4gICAqIFRoZXkgcHJvdmlkZSBtb3N0IG9mIHRoZSBmdW5jdGlvbmFsaXRpZXMgb2YgUG9wcGVyLmpzXHJcbiAgICogQHByb3Age21vZGlmaWVyc31cclxuICAgKi9cclxuICBtb2RpZmllcnM6IG1vZGlmaWVyc1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBjYWxsYmFjayBvbkNyZWF0ZVxyXG4gKiBAcGFyYW0ge2RhdGFPYmplY3R9IGRhdGFcclxuICovXHJcblxyXG4vKipcclxuICogQGNhbGxiYWNrIG9uVXBkYXRlXHJcbiAqIEBwYXJhbSB7ZGF0YU9iamVjdH0gZGF0YVxyXG4gKi9cclxuXHJcbi8vIFV0aWxzXHJcbi8vIE1ldGhvZHNcclxudmFyIFBvcHBlciA9IGZ1bmN0aW9uICgpIHtcclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgUG9wcGVyLmpzIGluc3RhbmNlXHJcbiAgICogQGNsYXNzIFBvcHBlclxyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8cmVmZXJlbmNlT2JqZWN0fSByZWZlcmVuY2UgLSBUaGUgcmVmZXJlbmNlIGVsZW1lbnQgdXNlZCB0byBwb3NpdGlvbiB0aGUgcG9wcGVyXHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcG9wcGVyIC0gVGhlIEhUTUwgZWxlbWVudCB1c2VkIGFzIHBvcHBlci5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFlvdXIgY3VzdG9tIG9wdGlvbnMgdG8gb3ZlcnJpZGUgdGhlIG9uZXMgZGVmaW5lZCBpbiBbRGVmYXVsdHNdKCNkZWZhdWx0cylcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IGluc3RhbmNlIC0gVGhlIGdlbmVyYXRlZCBQb3BwZXIuanMgaW5zdGFuY2VcclxuICAgKi9cclxuICBmdW5jdGlvbiBQb3BwZXIocmVmZXJlbmNlLCBwb3BwZXIpIHtcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xyXG4gICAgY2xhc3NDYWxsQ2hlY2skMSh0aGlzLCBQb3BwZXIpO1xyXG5cclxuICAgIHRoaXMuc2NoZWR1bGVVcGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoX3RoaXMudXBkYXRlKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gbWFrZSB1cGRhdGUoKSBkZWJvdW5jZWQsIHNvIHRoYXQgaXQgb25seSBydW5zIGF0IG1vc3Qgb25jZS1wZXItdGlja1xyXG4gICAgdGhpcy51cGRhdGUgPSBkZWJvdW5jZSh0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAvLyB3aXRoIHt9IHdlIGNyZWF0ZSBhIG5ldyBvYmplY3Qgd2l0aCB0aGUgb3B0aW9ucyBpbnNpZGUgaXRcclxuICAgIHRoaXMub3B0aW9ucyA9IF9leHRlbmRzJDEoe30sIFBvcHBlci5EZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgLy8gaW5pdCBzdGF0ZVxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgaXNEZXN0cm95ZWQ6IGZhbHNlLFxyXG4gICAgICBpc0NyZWF0ZWQ6IGZhbHNlLFxyXG4gICAgICBzY3JvbGxQYXJlbnRzOiBbXVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBnZXQgcmVmZXJlbmNlIGFuZCBwb3BwZXIgZWxlbWVudHMgKGFsbG93IGpRdWVyeSB3cmFwcGVycylcclxuICAgIHRoaXMucmVmZXJlbmNlID0gcmVmZXJlbmNlICYmIHJlZmVyZW5jZS5qcXVlcnkgPyByZWZlcmVuY2VbMF0gOiByZWZlcmVuY2U7XHJcbiAgICB0aGlzLnBvcHBlciA9IHBvcHBlciAmJiBwb3BwZXIuanF1ZXJ5ID8gcG9wcGVyWzBdIDogcG9wcGVyO1xyXG5cclxuICAgIC8vIERlZXAgbWVyZ2UgbW9kaWZpZXJzIG9wdGlvbnNcclxuICAgIHRoaXMub3B0aW9ucy5tb2RpZmllcnMgPSB7fTtcclxuICAgIE9iamVjdC5rZXlzKF9leHRlbmRzJDEoe30sIFBvcHBlci5EZWZhdWx0cy5tb2RpZmllcnMsIG9wdGlvbnMubW9kaWZpZXJzKSkuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICBfdGhpcy5vcHRpb25zLm1vZGlmaWVyc1tuYW1lXSA9IF9leHRlbmRzJDEoe30sIFBvcHBlci5EZWZhdWx0cy5tb2RpZmllcnNbbmFtZV0gfHwge30sIG9wdGlvbnMubW9kaWZpZXJzID8gb3B0aW9ucy5tb2RpZmllcnNbbmFtZV0gOiB7fSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBSZWZhY3RvcmluZyBtb2RpZmllcnMnIGxpc3QgKE9iamVjdCA9PiBBcnJheSlcclxuICAgIHRoaXMubW9kaWZpZXJzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLm1vZGlmaWVycykubWFwKGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgIHJldHVybiBfZXh0ZW5kcyQxKHtcclxuICAgICAgICBuYW1lOiBuYW1lXHJcbiAgICAgIH0sIF90aGlzLm9wdGlvbnMubW9kaWZpZXJzW25hbWVdKTtcclxuICAgIH0pXHJcbiAgICAvLyBzb3J0IHRoZSBtb2RpZmllcnMgYnkgb3JkZXJcclxuICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHJldHVybiBhLm9yZGVyIC0gYi5vcmRlcjtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIG1vZGlmaWVycyBoYXZlIHRoZSBhYmlsaXR5IHRvIGV4ZWN1dGUgYXJiaXRyYXJ5IGNvZGUgd2hlbiBQb3BwZXIuanMgZ2V0IGluaXRlZFxyXG4gICAgLy8gc3VjaCBjb2RlIGlzIGV4ZWN1dGVkIGluIHRoZSBzYW1lIG9yZGVyIG9mIGl0cyBtb2RpZmllclxyXG4gICAgLy8gdGhleSBjb3VsZCBhZGQgbmV3IHByb3BlcnRpZXMgdG8gdGhlaXIgb3B0aW9ucyBjb25maWd1cmF0aW9uXHJcbiAgICAvLyBCRSBBV0FSRTogZG9uJ3QgYWRkIG9wdGlvbnMgdG8gYG9wdGlvbnMubW9kaWZpZXJzLm5hbWVgIGJ1dCB0byBgbW9kaWZpZXJPcHRpb25zYCFcclxuICAgIHRoaXMubW9kaWZpZXJzLmZvckVhY2goZnVuY3Rpb24gKG1vZGlmaWVyT3B0aW9ucykge1xyXG4gICAgICBpZiAobW9kaWZpZXJPcHRpb25zLmVuYWJsZWQgJiYgaXNGdW5jdGlvbihtb2RpZmllck9wdGlvbnMub25Mb2FkKSkge1xyXG4gICAgICAgIG1vZGlmaWVyT3B0aW9ucy5vbkxvYWQoX3RoaXMucmVmZXJlbmNlLCBfdGhpcy5wb3BwZXIsIF90aGlzLm9wdGlvbnMsIG1vZGlmaWVyT3B0aW9ucywgX3RoaXMuc3RhdGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBmaXJlIHRoZSBmaXJzdCB1cGRhdGUgdG8gcG9zaXRpb24gdGhlIHBvcHBlciBpbiB0aGUgcmlnaHQgcGxhY2VcclxuICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgdmFyIGV2ZW50c0VuYWJsZWQgPSB0aGlzLm9wdGlvbnMuZXZlbnRzRW5hYmxlZDtcclxuICAgIGlmIChldmVudHNFbmFibGVkKSB7XHJcbiAgICAgIC8vIHNldHVwIGV2ZW50IGxpc3RlbmVycywgdGhleSB3aWxsIHRha2UgY2FyZSBvZiB1cGRhdGUgdGhlIHBvc2l0aW9uIGluIHNwZWNpZmljIHNpdHVhdGlvbnNcclxuICAgICAgdGhpcy5lbmFibGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RhdGUuZXZlbnRzRW5hYmxlZCA9IGV2ZW50c0VuYWJsZWQ7XHJcbiAgfVxyXG5cclxuICAvLyBXZSBjYW4ndCB1c2UgY2xhc3MgcHJvcGVydGllcyBiZWNhdXNlIHRoZXkgZG9uJ3QgZ2V0IGxpc3RlZCBpbiB0aGVcclxuICAvLyBjbGFzcyBwcm90b3R5cGUgYW5kIGJyZWFrIHN0dWZmIGxpa2UgU2lub24gc3R1YnNcclxuXHJcblxyXG4gIGNyZWF0ZUNsYXNzJDEoUG9wcGVyLCBbe1xyXG4gICAga2V5OiAndXBkYXRlJyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUkJDEoKSB7XHJcbiAgICAgIHJldHVybiB1cGRhdGUuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuICB9LCB7XHJcbiAgICBrZXk6ICdkZXN0cm95JyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95JCQxKCkge1xyXG4gICAgICByZXR1cm4gZGVzdHJveS5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG4gIH0sIHtcclxuICAgIGtleTogJ2VuYWJsZUV2ZW50TGlzdGVuZXJzJyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmFibGVFdmVudExpc3RlbmVycyQkMSgpIHtcclxuICAgICAgcmV0dXJuIGVuYWJsZUV2ZW50TGlzdGVuZXJzLmNhbGwodGhpcyk7XHJcbiAgICB9XHJcbiAgfSwge1xyXG4gICAga2V5OiAnZGlzYWJsZUV2ZW50TGlzdGVuZXJzJyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlRXZlbnRMaXN0ZW5lcnMkJDEoKSB7XHJcbiAgICAgIHJldHVybiBkaXNhYmxlRXZlbnRMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNjaGVkdWxlIGFuIHVwZGF0ZSwgaXQgd2lsbCBydW4gb24gdGhlIG5leHQgVUkgdXBkYXRlIGF2YWlsYWJsZVxyXG4gICAgICogQG1ldGhvZCBzY2hlZHVsZVVwZGF0ZVxyXG4gICAgICogQG1lbWJlcm9mIFBvcHBlclxyXG4gICAgICovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb2xsZWN0aW9uIG9mIHV0aWxpdGllcyB1c2VmdWwgd2hlbiB3cml0aW5nIGN1c3RvbSBtb2RpZmllcnMuXHJcbiAgICAgKiBTdGFydGluZyBmcm9tIHZlcnNpb24gMS43LCB0aGlzIG1ldGhvZCBpcyBhdmFpbGFibGUgb25seSBpZiB5b3VcclxuICAgICAqIGluY2x1ZGUgYHBvcHBlci11dGlscy5qc2AgYmVmb3JlIGBwb3BwZXIuanNgLlxyXG4gICAgICpcclxuICAgICAqICoqREVQUkVDQVRJT04qKjogVGhpcyB3YXkgdG8gYWNjZXNzIFBvcHBlclV0aWxzIGlzIGRlcHJlY2F0ZWRcclxuICAgICAqIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdjIhIFVzZSB0aGUgUG9wcGVyVXRpbHMgbW9kdWxlIGRpcmVjdGx5IGluc3RlYWQuXHJcbiAgICAgKiBEdWUgdG8gdGhlIGhpZ2ggaW5zdGFiaWxpdHkgb2YgdGhlIG1ldGhvZHMgY29udGFpbmVkIGluIFV0aWxzLCB3ZSBjYW4ndFxyXG4gICAgICogZ3VhcmFudGVlIHRoZW0gdG8gZm9sbG93IHNlbXZlci4gVXNlIHRoZW0gYXQgeW91ciBvd24gcmlzayFcclxuICAgICAqIEBzdGF0aWNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxyXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAxLjhcclxuICAgICAqIEBtZW1iZXIgVXRpbHNcclxuICAgICAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICAgICAqL1xyXG5cclxuICB9XSk7XHJcbiAgcmV0dXJuIFBvcHBlcjtcclxufSgpO1xyXG5cclxuLyoqXHJcbiAqIFRoZSBgcmVmZXJlbmNlT2JqZWN0YCBpcyBhbiBvYmplY3QgdGhhdCBwcm92aWRlcyBhbiBpbnRlcmZhY2UgY29tcGF0aWJsZSB3aXRoIFBvcHBlci5qc1xyXG4gKiBhbmQgbGV0cyB5b3UgdXNlIGl0IGFzIHJlcGxhY2VtZW50IG9mIGEgcmVhbCBET00gbm9kZS48YnIgLz5cclxuICogWW91IGNhbiB1c2UgdGhpcyBtZXRob2QgdG8gcG9zaXRpb24gYSBwb3BwZXIgcmVsYXRpdmVseSB0byBhIHNldCBvZiBjb29yZGluYXRlc1xyXG4gKiBpbiBjYXNlIHlvdSBkb24ndCBoYXZlIGEgRE9NIG5vZGUgdG8gdXNlIGFzIHJlZmVyZW5jZS5cclxuICpcclxuICogYGBgXHJcbiAqIG5ldyBQb3BwZXIocmVmZXJlbmNlT2JqZWN0LCBwb3BwZXJOb2RlKTtcclxuICogYGBgXHJcbiAqXHJcbiAqIE5COiBUaGlzIGZlYXR1cmUgaXNuJ3Qgc3VwcG9ydGVkIGluIEludGVybmV0IEV4cGxvcmVyIDEwXHJcbiAqIEBuYW1lIHJlZmVyZW5jZU9iamVjdFxyXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBkYXRhLmdldEJvdW5kaW5nQ2xpZW50UmVjdFxyXG4gKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHNldCBvZiBjb29yZGluYXRlcyBjb21wYXRpYmxlIHdpdGggdGhlIG5hdGl2ZSBgZ2V0Qm91bmRpbmdDbGllbnRSZWN0YCBtZXRob2QuXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkYXRhLmNsaWVudFdpZHRoXHJcbiAqIEFuIEVTNiBnZXR0ZXIgdGhhdCB3aWxsIHJldHVybiB0aGUgd2lkdGggb2YgdGhlIHZpcnR1YWwgcmVmZXJlbmNlIGVsZW1lbnQuXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkYXRhLmNsaWVudEhlaWdodFxyXG4gKiBBbiBFUzYgZ2V0dGVyIHRoYXQgd2lsbCByZXR1cm4gdGhlIGhlaWdodCBvZiB0aGUgdmlydHVhbCByZWZlcmVuY2UgZWxlbWVudC5cclxuICovXHJcblxyXG5Qb3BwZXIuVXRpbHMgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBnbG9iYWwpLlBvcHBlclV0aWxzO1xyXG5Qb3BwZXIucGxhY2VtZW50cyA9IHBsYWNlbWVudHM7XHJcblBvcHBlci5EZWZhdWx0cyA9IERlZmF1bHRzO1xyXG5cclxuLyoqXHJcbiAqIFRyaWdnZXJzIGRvY3VtZW50IHJlZmxvdy5cclxuICogVXNlIHZvaWQgYmVjYXVzZSBzb21lIG1pbmlmaWVycyBvciBlbmdpbmVzIHRoaW5rIHNpbXBseSBhY2Nlc3NpbmcgdGhlIHByb3BlcnR5XHJcbiAqIGlzIHVubmVjZXNzYXJ5LlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlclxyXG4gKi9cclxuZnVuY3Rpb24gcmVmbG93KHBvcHBlcikge1xyXG4gIHZvaWQgcG9wcGVyLm9mZnNldEhlaWdodDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFdyYXBwZXIgdXRpbCBmb3IgcG9wcGVyIHBvc2l0aW9uIHVwZGF0aW5nLlxyXG4gKiBVcGRhdGVzIHRoZSBwb3BwZXIncyBwb3NpdGlvbiBhbmQgaW52b2tlcyB0aGUgY2FsbGJhY2sgb24gdXBkYXRlLlxyXG4gKiBIYWNraXNoIHdvcmthcm91bmQgdW50aWwgUG9wcGVyIDIuMCdzIHVwZGF0ZSgpIGJlY29tZXMgc3luYy5cclxuICogQHBhcmFtIHtQb3BwZXJ9IHBvcHBlckluc3RhbmNlXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrOiB0byBydW4gb25jZSBwb3BwZXIncyBwb3NpdGlvbiB3YXMgdXBkYXRlZFxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHVwZGF0ZUFscmVhZHlDYWxsZWQ6IHdhcyBzY2hlZHVsZVVwZGF0ZSgpIGFscmVhZHkgY2FsbGVkP1xyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlUG9wcGVyUG9zaXRpb24ocG9wcGVySW5zdGFuY2UsIGNhbGxiYWNrLCB1cGRhdGVBbHJlYWR5Q2FsbGVkKSB7XHJcbiAgdmFyIHBvcHBlciA9IHBvcHBlckluc3RhbmNlLnBvcHBlcixcclxuICAgICAgb3B0aW9ucyA9IHBvcHBlckluc3RhbmNlLm9wdGlvbnM7XHJcblxyXG4gIHZhciBvbkNyZWF0ZSA9IG9wdGlvbnMub25DcmVhdGU7XHJcbiAgdmFyIG9uVXBkYXRlID0gb3B0aW9ucy5vblVwZGF0ZTtcclxuXHJcbiAgb3B0aW9ucy5vbkNyZWF0ZSA9IG9wdGlvbnMub25VcGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZWZsb3cocG9wcGVyKSwgY2FsbGJhY2sgJiYgY2FsbGJhY2soKSwgb25VcGRhdGUoKTtcclxuICAgIG9wdGlvbnMub25DcmVhdGUgPSBvbkNyZWF0ZTtcclxuICAgIG9wdGlvbnMub25VcGRhdGUgPSBvblVwZGF0ZTtcclxuICB9O1xyXG5cclxuICBpZiAoIXVwZGF0ZUFscmVhZHlDYWxsZWQpIHtcclxuICAgIHBvcHBlckluc3RhbmNlLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgY29yZSBwbGFjZW1lbnQgKCd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnKSBvZiBhIHBvcHBlclxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlclxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRQb3BwZXJQbGFjZW1lbnQocG9wcGVyKSB7XHJcbiAgcmV0dXJuIHBvcHBlci5nZXRBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50JykucmVwbGFjZSgvLS4rLywgJycpO1xyXG59XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lcyBpZiB0aGUgbW91c2UncyBjdXJzb3IgaXMgb3V0c2lkZSB0aGUgaW50ZXJhY3RpdmUgYm9yZGVyXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnRcclxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGN1cnNvcklzT3V0c2lkZUludGVyYWN0aXZlQm9yZGVyKGV2ZW50LCBwb3BwZXIsIG9wdGlvbnMpIHtcclxuICBpZiAoIXBvcHBlci5nZXRBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50JykpIHJldHVybiB0cnVlO1xyXG5cclxuICB2YXIgeCA9IGV2ZW50LmNsaWVudFgsXHJcbiAgICAgIHkgPSBldmVudC5jbGllbnRZO1xyXG4gIHZhciBpbnRlcmFjdGl2ZUJvcmRlciA9IG9wdGlvbnMuaW50ZXJhY3RpdmVCb3JkZXIsXHJcbiAgICAgIGRpc3RhbmNlID0gb3B0aW9ucy5kaXN0YW5jZTtcclxuXHJcblxyXG4gIHZhciByZWN0ID0gcG9wcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gIHZhciBwbGFjZW1lbnQgPSBnZXRQb3BwZXJQbGFjZW1lbnQocG9wcGVyKTtcclxuICB2YXIgYm9yZGVyV2l0aERpc3RhbmNlID0gaW50ZXJhY3RpdmVCb3JkZXIgKyBkaXN0YW5jZTtcclxuXHJcbiAgdmFyIGV4Y2VlZHMgPSB7XHJcbiAgICB0b3A6IHJlY3QudG9wIC0geSA+IGludGVyYWN0aXZlQm9yZGVyLFxyXG4gICAgYm90dG9tOiB5IC0gcmVjdC5ib3R0b20gPiBpbnRlcmFjdGl2ZUJvcmRlcixcclxuICAgIGxlZnQ6IHJlY3QubGVmdCAtIHggPiBpbnRlcmFjdGl2ZUJvcmRlcixcclxuICAgIHJpZ2h0OiB4IC0gcmVjdC5yaWdodCA+IGludGVyYWN0aXZlQm9yZGVyXHJcbiAgfTtcclxuXHJcbiAgc3dpdGNoIChwbGFjZW1lbnQpIHtcclxuICAgIGNhc2UgJ3RvcCc6XHJcbiAgICAgIGV4Y2VlZHMudG9wID0gcmVjdC50b3AgLSB5ID4gYm9yZGVyV2l0aERpc3RhbmNlO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ2JvdHRvbSc6XHJcbiAgICAgIGV4Y2VlZHMuYm90dG9tID0geSAtIHJlY3QuYm90dG9tID4gYm9yZGVyV2l0aERpc3RhbmNlO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ2xlZnQnOlxyXG4gICAgICBleGNlZWRzLmxlZnQgPSByZWN0LmxlZnQgLSB4ID4gYm9yZGVyV2l0aERpc3RhbmNlO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ3JpZ2h0JzpcclxuICAgICAgZXhjZWVkcy5yaWdodCA9IHggLSByZWN0LnJpZ2h0ID4gYm9yZGVyV2l0aERpc3RhbmNlO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcblxyXG4gIHJldHVybiBleGNlZWRzLnRvcCB8fCBleGNlZWRzLmJvdHRvbSB8fCBleGNlZWRzLmxlZnQgfHwgZXhjZWVkcy5yaWdodDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRyYW5zZm9ybXMgdGhlIGBhcnJvd1RyYW5zZm9ybWAgbnVtYmVycyBiYXNlZCBvbiB0aGUgcGxhY2VtZW50IGF4aXNcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgJ3NjYWxlJyBvciAndHJhbnNsYXRlJ1xyXG4gKiBAcGFyYW0ge051bWJlcltdfSBudW1iZXJzXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNWZXJ0aWNhbFxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzUmV2ZXJzZVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiB0cmFuc2Zvcm1OdW1iZXJzQmFzZWRPblBsYWNlbWVudEF4aXModHlwZSwgbnVtYmVycywgaXNWZXJ0aWNhbCwgaXNSZXZlcnNlKSB7XHJcbiAgaWYgKCFudW1iZXJzLmxlbmd0aCkgcmV0dXJuICcnO1xyXG5cclxuICB2YXIgdHJhbnNmb3JtcyA9IHtcclxuICAgIHNjYWxlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChudW1iZXJzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiAnJyArIG51bWJlcnNbMF07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGlzVmVydGljYWwgPyBudW1iZXJzWzBdICsgJywgJyArIG51bWJlcnNbMV0gOiBudW1iZXJzWzFdICsgJywgJyArIG51bWJlcnNbMF07XHJcbiAgICAgIH1cclxuICAgIH0oKSxcclxuICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAobnVtYmVycy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gaXNSZXZlcnNlID8gLW51bWJlcnNbMF0gKyAncHgnIDogbnVtYmVyc1swXSArICdweCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGlzVmVydGljYWwpIHtcclxuICAgICAgICAgIHJldHVybiBpc1JldmVyc2UgPyBudW1iZXJzWzBdICsgJ3B4LCAnICsgLW51bWJlcnNbMV0gKyAncHgnIDogbnVtYmVyc1swXSArICdweCwgJyArIG51bWJlcnNbMV0gKyAncHgnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gaXNSZXZlcnNlID8gLW51bWJlcnNbMV0gKyAncHgsICcgKyBudW1iZXJzWzBdICsgJ3B4JyA6IG51bWJlcnNbMV0gKyAncHgsICcgKyBudW1iZXJzWzBdICsgJ3B4JztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0oKVxyXG4gIH07XHJcblxyXG4gIHJldHVybiB0cmFuc2Zvcm1zW3R5cGVdO1xyXG59XHJcblxyXG4vKipcclxuICogVHJhbnNmb3JtcyB0aGUgYGFycm93VHJhbnNmb3JtYCB4IG9yIHkgYXhpcyBiYXNlZCBvbiB0aGUgcGxhY2VtZW50IGF4aXNcclxuICogQHBhcmFtIHtTdHJpbmd9IGF4aXMgJ1gnLCAnWScsICcnXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNWZXJ0aWNhbFxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiB0cmFuc2Zvcm1BeGlzKGF4aXMsIGlzVmVydGljYWwpIHtcclxuICBpZiAoIWF4aXMpIHJldHVybiAnJztcclxuICB2YXIgbWFwID0ge1xyXG4gICAgWDogJ1knLFxyXG4gICAgWTogJ1gnXHJcbiAgfTtcclxuICByZXR1cm4gaXNWZXJ0aWNhbCA/IGF4aXMgOiBtYXBbYXhpc107XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlcyBhbmQgYXBwbGllcyB0aGUgbmVjZXNzYXJ5IGFycm93IHRyYW5zZm9ybVxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlclxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGFycm93XHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcnJvd1RyYW5zZm9ybVxyXG4gKi9cclxuZnVuY3Rpb24gY29tcHV0ZUFycm93VHJhbnNmb3JtKHBvcHBlciwgYXJyb3csIGFycm93VHJhbnNmb3JtKSB7XHJcbiAgdmFyIHBsYWNlbWVudCA9IGdldFBvcHBlclBsYWNlbWVudChwb3BwZXIpO1xyXG4gIHZhciBpc1ZlcnRpY2FsID0gcGxhY2VtZW50ID09PSAndG9wJyB8fCBwbGFjZW1lbnQgPT09ICdib3R0b20nO1xyXG4gIHZhciBpc1JldmVyc2UgPSBwbGFjZW1lbnQgPT09ICdyaWdodCcgfHwgcGxhY2VtZW50ID09PSAnYm90dG9tJztcclxuXHJcbiAgdmFyIGdldEF4aXMgPSBmdW5jdGlvbiBnZXRBeGlzKHJlKSB7XHJcbiAgICB2YXIgbWF0Y2ggPSBhcnJvd1RyYW5zZm9ybS5tYXRjaChyZSk7XHJcbiAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnO1xyXG4gIH07XHJcblxyXG4gIHZhciBnZXROdW1iZXJzID0gZnVuY3Rpb24gZ2V0TnVtYmVycyhyZSkge1xyXG4gICAgdmFyIG1hdGNoID0gYXJyb3dUcmFuc2Zvcm0ubWF0Y2gocmUpO1xyXG4gICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0uc3BsaXQoJywnKS5tYXAocGFyc2VGbG9hdCkgOiBbXTtcclxuICB9O1xyXG5cclxuICB2YXIgcmUgPSB7XHJcbiAgICB0cmFuc2xhdGU6IC90cmFuc2xhdGVYP1k/XFwoKFteKV0rKVxcKS8sXHJcbiAgICBzY2FsZTogL3NjYWxlWD9ZP1xcKChbXildKylcXCkvXHJcbiAgfTtcclxuXHJcbiAgdmFyIG1hdGNoZXMgPSB7XHJcbiAgICB0cmFuc2xhdGU6IHtcclxuICAgICAgYXhpczogZ2V0QXhpcygvdHJhbnNsYXRlKFtYWV0pLyksXHJcbiAgICAgIG51bWJlcnM6IGdldE51bWJlcnMocmUudHJhbnNsYXRlKVxyXG4gICAgfSxcclxuICAgIHNjYWxlOiB7XHJcbiAgICAgIGF4aXM6IGdldEF4aXMoL3NjYWxlKFtYWV0pLyksXHJcbiAgICAgIG51bWJlcnM6IGdldE51bWJlcnMocmUuc2NhbGUpXHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIGNvbXB1dGVkVHJhbnNmb3JtID0gYXJyb3dUcmFuc2Zvcm0ucmVwbGFjZShyZS50cmFuc2xhdGUsICd0cmFuc2xhdGUnICsgdHJhbnNmb3JtQXhpcyhtYXRjaGVzLnRyYW5zbGF0ZS5heGlzLCBpc1ZlcnRpY2FsKSArICcoJyArIHRyYW5zZm9ybU51bWJlcnNCYXNlZE9uUGxhY2VtZW50QXhpcygndHJhbnNsYXRlJywgbWF0Y2hlcy50cmFuc2xhdGUubnVtYmVycywgaXNWZXJ0aWNhbCwgaXNSZXZlcnNlKSArICcpJykucmVwbGFjZShyZS5zY2FsZSwgJ3NjYWxlJyArIHRyYW5zZm9ybUF4aXMobWF0Y2hlcy5zY2FsZS5heGlzLCBpc1ZlcnRpY2FsKSArICcoJyArIHRyYW5zZm9ybU51bWJlcnNCYXNlZE9uUGxhY2VtZW50QXhpcygnc2NhbGUnLCBtYXRjaGVzLnNjYWxlLm51bWJlcnMsIGlzVmVydGljYWwsIGlzUmV2ZXJzZSkgKyAnKScpO1xyXG5cclxuICBhcnJvdy5zdHlsZVtwcmVmaXgoJ3RyYW5zZm9ybScpXSA9IGNvbXB1dGVkVHJhbnNmb3JtO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgZGlzdGFuY2UgdGFraW5nIGludG8gYWNjb3VudCB0aGUgZGVmYXVsdCBkaXN0YW5jZSBkdWUgdG9cclxuICogdGhlIHRyYW5zZm9ybTogdHJhbnNsYXRlIHNldHRpbmcgaW4gQ1NTXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBkaXN0YW5jZVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRPZmZzZXREaXN0YW5jZUluUHgoZGlzdGFuY2UpIHtcclxuICByZXR1cm4gLShkaXN0YW5jZSAtIGRlZmF1bHRzLmRpc3RhbmNlKSArICdweCc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXYWl0cyB1bnRpbCBuZXh0IHJlcGFpbnQgdG8gZXhlY3V0ZSBhIGZuXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqL1xyXG5mdW5jdGlvbiBkZWZlcihmbikge1xyXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICBzZXRUaW1lb3V0KGZuLCAxKTtcclxuICB9KTtcclxufVxyXG5cclxudmFyIG1hdGNoZXMgPSB7fTtcclxuXHJcbmlmIChpc0Jyb3dzZXIpIHtcclxuICB2YXIgZSA9IEVsZW1lbnQucHJvdG90eXBlO1xyXG4gIG1hdGNoZXMgPSBlLm1hdGNoZXMgfHwgZS5tYXRjaGVzU2VsZWN0b3IgfHwgZS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgZS5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgZS5tc01hdGNoZXNTZWxlY3RvciB8fCBmdW5jdGlvbiAocykge1xyXG4gICAgdmFyIG1hdGNoZXMgPSAodGhpcy5kb2N1bWVudCB8fCB0aGlzLm93bmVyRG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwocyk7XHJcbiAgICB2YXIgaSA9IG1hdGNoZXMubGVuZ3RoO1xyXG4gICAgd2hpbGUgKC0taSA+PSAwICYmIG1hdGNoZXMuaXRlbShpKSAhPT0gdGhpcykge30gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1lbXB0eVxyXG4gICAgcmV0dXJuIGkgPiAtMTtcclxuICB9O1xyXG59XHJcblxyXG52YXIgbWF0Y2hlcyQxID0gbWF0Y2hlcztcclxuXHJcbi8qKlxyXG4gKiBQb255ZmlsbCB0byBnZXQgdGhlIGNsb3Nlc3QgcGFyZW50IGVsZW1lbnRcclxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IC0gY2hpbGQgb2YgcGFyZW50IHRvIGJlIHJldHVybmVkXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXJlbnRTZWxlY3RvciAtIHNlbGVjdG9yIHRvIG1hdGNoIHRoZSBwYXJlbnQgaWYgZm91bmRcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbmZ1bmN0aW9uIGNsb3Nlc3QoZWxlbWVudCwgcGFyZW50U2VsZWN0b3IpIHtcclxuICB2YXIgZm4gPSBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0IHx8IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG4gICAgdmFyIGVsID0gdGhpcztcclxuICAgIHdoaWxlIChlbCkge1xyXG4gICAgICBpZiAobWF0Y2hlcyQxLmNhbGwoZWwsIHNlbGVjdG9yKSkge1xyXG4gICAgICAgIHJldHVybiBlbDtcclxuICAgICAgfVxyXG4gICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGZuLmNhbGwoZWxlbWVudCwgcGFyZW50U2VsZWN0b3IpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgdmFsdWUgdGFraW5nIGludG8gYWNjb3VudCB0aGUgdmFsdWUgYmVpbmcgZWl0aGVyIGEgbnVtYmVyIG9yIGFycmF5XHJcbiAqIEBwYXJhbSB7TnVtYmVyfEFycmF5fSB2YWx1ZVxyXG4gKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcclxuICogQHJldHVybiB7TnVtYmVyfVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0VmFsdWUodmFsdWUsIGluZGV4KSB7XHJcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWVbaW5kZXhdIDogdmFsdWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXRzIHRoZSB2aXNpYmlsaXR5IHN0YXRlIG9mIGFuIGVsZW1lbnQgZm9yIHRyYW5zaXRpb24gdG8gYmVnaW5cclxuICogQHBhcmFtIHtFbGVtZW50W119IGVscyAtIGFycmF5IG9mIGVsZW1lbnRzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gJ3Zpc2libGUnIG9yICdoaWRkZW4nXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRWaXNpYmlsaXR5U3RhdGUoZWxzLCB0eXBlKSB7XHJcbiAgZWxzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICBpZiAoIWVsKSByZXR1cm47XHJcbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdGUnLCB0eXBlKTtcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldHMgdGhlIHRyYW5zaXRpb24gcHJvcGVydHkgdG8gZWFjaCBlbGVtZW50XHJcbiAqIEBwYXJhbSB7RWxlbWVudFtdfSBlbHMgLSBBcnJheSBvZiBlbGVtZW50c1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcclxuICovXHJcbmZ1bmN0aW9uIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uKGVscywgdmFsdWUpIHtcclxuICBlbHMuZmlsdGVyKEJvb2xlYW4pLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XHJcbiAgICBlbC5zdHlsZVtwcmVmaXgoJ3RyYW5zaXRpb25EdXJhdGlvbicpXSA9IHZhbHVlICsgJ21zJztcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZvY3VzZXMgYW4gZWxlbWVudCB3aGlsZSBwcmV2ZW50aW5nIGEgc2Nyb2xsIGp1bXAgaWYgaXQncyBub3QgZW50aXJlbHkgd2l0aGluIHRoZSB2aWV3cG9ydFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXHJcbiAqL1xyXG5mdW5jdGlvbiBmb2N1cyhlbCkge1xyXG4gIHZhciB4ID0gd2luZG93LnNjcm9sbFggfHwgd2luZG93LnBhZ2VYT2Zmc2V0O1xyXG4gIHZhciB5ID0gd2luZG93LnNjcm9sbFkgfHwgd2luZG93LnBhZ2VZT2Zmc2V0O1xyXG4gIGVsLmZvY3VzKCk7XHJcbiAgc2Nyb2xsKHgsIHkpO1xyXG59XHJcblxyXG52YXIga2V5ID0ge307XHJcbnZhciBzdG9yZSA9IGZ1bmN0aW9uIHN0b3JlKGRhdGEpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGspIHtcclxuICAgIHJldHVybiBrID09PSBrZXkgJiYgZGF0YTtcclxuICB9O1xyXG59O1xyXG5cclxudmFyIFRpcHB5ID0gZnVuY3Rpb24gKCkge1xyXG4gIGZ1bmN0aW9uIFRpcHB5KGNvbmZpZykge1xyXG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgVGlwcHkpO1xyXG5cclxuICAgIGZvciAodmFyIF9rZXkgaW4gY29uZmlnKSB7XHJcbiAgICAgIHRoaXNbX2tleV0gPSBjb25maWdbX2tleV07XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgZGVzdHJveWVkOiBmYWxzZSxcclxuICAgICAgdmlzaWJsZTogZmFsc2UsXHJcbiAgICAgIGVuYWJsZWQ6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5fID0gc3RvcmUoe1xyXG4gICAgICBtdXRhdGlvbk9ic2VydmVyczogW11cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRW5hYmxlcyB0aGUgdG9vbHRpcCB0byBhbGxvdyBpdCB0byBzaG93IG9yIGhpZGVcclxuICAgKiBAbWVtYmVyb2YgVGlwcHlcclxuICAgKiBAcHVibGljXHJcbiAgICovXHJcblxyXG5cclxuICBjcmVhdGVDbGFzcyhUaXBweSwgW3tcclxuICAgIGtleTogJ2VuYWJsZScsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5hYmxlKCkge1xyXG4gICAgICB0aGlzLnN0YXRlLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzYWJsZXMgdGhlIHRvb2x0aXAgZnJvbSBzaG93aW5nIG9yIGhpZGluZywgYnV0IGRvZXMgbm90IGRlc3Ryb3kgaXRcclxuICAgICAqIEBtZW1iZXJvZiBUaXBweVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICovXHJcblxyXG4gIH0sIHtcclxuICAgIGtleTogJ2Rpc2FibGUnLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc2FibGUoKSB7XHJcbiAgICAgIHRoaXMuc3RhdGUuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvd3MgdGhlIHRvb2x0aXBcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHNcclxuICAgICAqIEBtZW1iZXJvZiBUaXBweVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICovXHJcblxyXG4gIH0sIHtcclxuICAgIGtleTogJ3Nob3cnLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNob3coZHVyYXRpb24pIHtcclxuICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgIGlmICh0aGlzLnN0YXRlLmRlc3Ryb3llZCB8fCAhdGhpcy5zdGF0ZS5lbmFibGVkKSByZXR1cm47XHJcblxyXG4gICAgICB2YXIgcG9wcGVyID0gdGhpcy5wb3BwZXIsXHJcbiAgICAgICAgICByZWZlcmVuY2UgPSB0aGlzLnJlZmVyZW5jZSxcclxuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG4gICAgICB2YXIgX2dldElubmVyRWxlbWVudHMgPSBnZXRJbm5lckVsZW1lbnRzKHBvcHBlciksXHJcbiAgICAgICAgICB0b29sdGlwID0gX2dldElubmVyRWxlbWVudHMudG9vbHRpcCxcclxuICAgICAgICAgIGJhY2tkcm9wID0gX2dldElubmVyRWxlbWVudHMuYmFja2Ryb3AsXHJcbiAgICAgICAgICBjb250ZW50ID0gX2dldElubmVyRWxlbWVudHMuY29udGVudDtcclxuXHJcbiAgICAgIC8vIElmIHRoZSBgZHluYW1pY1RpdGxlYCBvcHRpb24gaXMgdHJ1ZSwgdGhlIGluc3RhbmNlIGlzIGFsbG93ZWRcclxuICAgICAgLy8gdG8gYmUgY3JlYXRlZCB3aXRoIGFuIGVtcHR5IHRpdGxlLiBNYWtlIHN1cmUgdGhhdCB0aGUgdG9vbHRpcFxyXG4gICAgICAvLyBjb250ZW50IGlzIG5vdCBlbXB0eSBiZWZvcmUgc2hvd2luZyBpdFxyXG5cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmR5bmFtaWNUaXRsZSAmJiAhcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSgnZGF0YS1vcmlnaW5hbC10aXRsZScpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBEbyBub3Qgc2hvdyB0b29sdGlwIGlmIHJlZmVyZW5jZSBjb250YWlucyAnZGlzYWJsZWQnIGF0dHJpYnV0ZS4gRkYgZml4IGZvciAjMjIxXHJcbiAgICAgIGlmIChyZWZlcmVuY2UuaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpKSByZXR1cm47XHJcblxyXG4gICAgICAvLyBEZXN0cm95IHRvb2x0aXAgaWYgdGhlIHJlZmVyZW5jZSBlbGVtZW50IGlzIG5vIGxvbmdlciBvbiB0aGUgRE9NXHJcbiAgICAgIGlmICghcmVmZXJlbmNlLnJlZk9iaiAmJiAhZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNvbnRhaW5zKHJlZmVyZW5jZSkpIHtcclxuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9wdGlvbnMub25TaG93LmNhbGwocG9wcGVyLCB0aGlzKTtcclxuXHJcbiAgICAgIGR1cmF0aW9uID0gZ2V0VmFsdWUoZHVyYXRpb24gIT09IHVuZGVmaW5lZCA/IGR1cmF0aW9uIDogb3B0aW9ucy5kdXJhdGlvbiwgMCk7XHJcblxyXG4gICAgICAvLyBQcmV2ZW50IGEgdHJhbnNpdGlvbiB3aGVuIHBvcHBlciBjaGFuZ2VzIHBvc2l0aW9uXHJcbiAgICAgIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uKFtwb3BwZXIsIHRvb2x0aXAsIGJhY2tkcm9wXSwgMCk7XHJcblxyXG4gICAgICBwb3BwZXIuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxuICAgICAgdGhpcy5zdGF0ZS52aXNpYmxlID0gdHJ1ZTtcclxuXHJcbiAgICAgIF9tb3VudC5jYWxsKHRoaXMsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIV90aGlzLnN0YXRlLnZpc2libGUpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKCFfaGFzRm9sbG93Q3Vyc29yQmVoYXZpb3IuY2FsbChfdGhpcykpIHtcclxuICAgICAgICAgIC8vIEZJWDogQXJyb3cgd2lsbCBzb21ldGltZXMgbm90IGJlIHBvc2l0aW9uZWQgY29ycmVjdGx5LiBGb3JjZSBhbm90aGVyIHVwZGF0ZS5cclxuICAgICAgICAgIF90aGlzLnBvcHBlckluc3RhbmNlLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTZXQgaW5pdGlhbCBwb3NpdGlvbiBuZWFyIHRoZSBjdXJzb3JcclxuICAgICAgICBpZiAoX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yLmNhbGwoX3RoaXMpKSB7XHJcbiAgICAgICAgICBfdGhpcy5wb3BwZXJJbnN0YW5jZS5kaXNhYmxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgICAgICAgIHZhciBkZWxheSA9IGdldFZhbHVlKG9wdGlvbnMuZGVsYXksIDApO1xyXG4gICAgICAgICAgdmFyIGxhc3RUcmlnZ2VyRXZlbnQgPSBfdGhpcy5fKGtleSkubGFzdFRyaWdnZXJFdmVudDtcclxuICAgICAgICAgIGlmIChsYXN0VHJpZ2dlckV2ZW50KSB7XHJcbiAgICAgICAgICAgIF90aGlzLl8oa2V5KS5mb2xsb3dDdXJzb3JMaXN0ZW5lcihkZWxheSAmJiBfdGhpcy5fKGtleSkubGFzdE1vdXNlTW92ZUV2ZW50ID8gX3RoaXMuXyhrZXkpLmxhc3RNb3VzZU1vdmVFdmVudCA6IGxhc3RUcmlnZ2VyRXZlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmUtYXBwbHkgdHJhbnNpdGlvbiBkdXJhdGlvbnNcclxuICAgICAgICBhcHBseVRyYW5zaXRpb25EdXJhdGlvbihbdG9vbHRpcCwgYmFja2Ryb3AsIGJhY2tkcm9wID8gY29udGVudCA6IG51bGxdLCBkdXJhdGlvbik7XHJcblxyXG4gICAgICAgIGlmIChiYWNrZHJvcCkge1xyXG4gICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShiYWNrZHJvcClbcHJlZml4KCd0cmFuc2Zvcm0nKV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xyXG4gICAgICAgICAgcmVmZXJlbmNlLmNsYXNzTGlzdC5hZGQoJ3RpcHB5LWFjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuc3RpY2t5KSB7XHJcbiAgICAgICAgICBfbWFrZVN0aWNreS5jYWxsKF90aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFZpc2liaWxpdHlTdGF0ZShbdG9vbHRpcCwgYmFja2Ryb3BdLCAndmlzaWJsZScpO1xyXG5cclxuICAgICAgICBfb25UcmFuc2l0aW9uRW5kLmNhbGwoX3RoaXMsIGR1cmF0aW9uLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoIW9wdGlvbnMudXBkYXRlRHVyYXRpb24pIHtcclxuICAgICAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKCd0aXBweS1ub3RyYW5zaXRpb24nKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAob3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xyXG4gICAgICAgICAgICBmb2N1cyhwb3BwZXIpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJlZmVyZW5jZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCAndGlwcHktJyArIF90aGlzLmlkKTtcclxuXHJcbiAgICAgICAgICBvcHRpb25zLm9uU2hvd24uY2FsbChwb3BwZXIsIF90aGlzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIaWRlcyB0aGUgdG9vbHRpcFxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kc1xyXG4gICAgICogQG1lbWJlcm9mIFRpcHB5XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKi9cclxuXHJcbiAgfSwge1xyXG4gICAga2V5OiAnaGlkZScsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGlkZShkdXJhdGlvbikge1xyXG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcclxuXHJcbiAgICAgIGlmICh0aGlzLnN0YXRlLmRlc3Ryb3llZCB8fCAhdGhpcy5zdGF0ZS5lbmFibGVkKSByZXR1cm47XHJcblxyXG4gICAgICB2YXIgcG9wcGVyID0gdGhpcy5wb3BwZXIsXHJcbiAgICAgICAgICByZWZlcmVuY2UgPSB0aGlzLnJlZmVyZW5jZSxcclxuICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG4gICAgICB2YXIgX2dldElubmVyRWxlbWVudHMyID0gZ2V0SW5uZXJFbGVtZW50cyhwb3BwZXIpLFxyXG4gICAgICAgICAgdG9vbHRpcCA9IF9nZXRJbm5lckVsZW1lbnRzMi50b29sdGlwLFxyXG4gICAgICAgICAgYmFja2Ryb3AgPSBfZ2V0SW5uZXJFbGVtZW50czIuYmFja2Ryb3AsXHJcbiAgICAgICAgICBjb250ZW50ID0gX2dldElubmVyRWxlbWVudHMyLmNvbnRlbnQ7XHJcblxyXG4gICAgICBvcHRpb25zLm9uSGlkZS5jYWxsKHBvcHBlciwgdGhpcyk7XHJcblxyXG4gICAgICBkdXJhdGlvbiA9IGdldFZhbHVlKGR1cmF0aW9uICE9PSB1bmRlZmluZWQgPyBkdXJhdGlvbiA6IG9wdGlvbnMuZHVyYXRpb24sIDEpO1xyXG5cclxuICAgICAgaWYgKCFvcHRpb25zLnVwZGF0ZUR1cmF0aW9uKSB7XHJcbiAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QucmVtb3ZlKCd0aXBweS1ub3RyYW5zaXRpb24nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcclxuICAgICAgICByZWZlcmVuY2UuY2xhc3NMaXN0LnJlbW92ZSgndGlwcHktYWN0aXZlJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBvcHBlci5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICAgIHRoaXMuc3RhdGUudmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24oW3Rvb2x0aXAsIGJhY2tkcm9wLCBiYWNrZHJvcCA/IGNvbnRlbnQgOiBudWxsXSwgZHVyYXRpb24pO1xyXG5cclxuICAgICAgc2V0VmlzaWJpbGl0eVN0YXRlKFt0b29sdGlwLCBiYWNrZHJvcF0sICdoaWRkZW4nKTtcclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmludGVyYWN0aXZlICYmIG9wdGlvbnMudHJpZ2dlci5pbmRleE9mKCdjbGljaycpID4gLTEpIHtcclxuICAgICAgICBmb2N1cyhyZWZlcmVuY2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKlxyXG4gICAgICAqIFRoaXMgY2FsbCBpcyBkZWZlcnJlZCBiZWNhdXNlIHNvbWV0aW1lcyB3aGVuIHRoZSB0b29sdGlwIGlzIHN0aWxsIHRyYW5zaXRpb25pbmcgaW4gYnV0IGhpZGUoKVxyXG4gICAgICAqIGlzIGNhbGxlZCBiZWZvcmUgaXQgZmluaXNoZXMsIHRoZSBDU1MgdHJhbnNpdGlvbiB3b24ndCByZXZlcnNlIHF1aWNrbHkgZW5vdWdoLCBtZWFuaW5nXHJcbiAgICAgICogdGhlIENTUyB0cmFuc2l0aW9uIHdpbGwgZmluaXNoIDEtMiBmcmFtZXMgbGF0ZXIsIGFuZCBvbkhpZGRlbigpIHdpbGwgcnVuIHNpbmNlIHRoZSBKUyBzZXQgaXRcclxuICAgICAgKiBtb3JlIHF1aWNrbHkuIEl0IHNob3VsZCBhY3R1YWxseSBiZSBvblNob3duKCkuIFNlZW1zIHRvIGJlIHNvbWV0aGluZyBDaHJvbWUgZG9lcywgbm90IFNhZmFyaVxyXG4gICAgICAqL1xyXG4gICAgICBkZWZlcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgX29uVHJhbnNpdGlvbkVuZC5jYWxsKF90aGlzMiwgZHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmIChfdGhpczIuc3RhdGUudmlzaWJsZSB8fCAhb3B0aW9ucy5hcHBlbmRUby5jb250YWlucyhwb3BwZXIpKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgaWYgKCFfdGhpczIuXyhrZXkpLmlzUHJlcGFyaW5nVG9TaG93KSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF90aGlzMi5fKGtleSkuZm9sbG93Q3Vyc29yTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICBfdGhpczIuXyhrZXkpLmxhc3RNb3VzZU1vdmVFdmVudCA9IG51bGw7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKF90aGlzMi5wb3BwZXJJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBfdGhpczIucG9wcGVySW5zdGFuY2UuZGlzYWJsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmVmZXJlbmNlLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG5cclxuICAgICAgICAgIG9wdGlvbnMuYXBwZW5kVG8ucmVtb3ZlQ2hpbGQocG9wcGVyKTtcclxuXHJcbiAgICAgICAgICBvcHRpb25zLm9uSGlkZGVuLmNhbGwocG9wcGVyLCBfdGhpczIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERlc3Ryb3lzIHRoZSB0b29sdGlwIGluc3RhbmNlXHJcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRlc3Ryb3lUYXJnZXRJbnN0YW5jZXMgLSByZWxldmFudCBvbmx5IHdoZW4gZGVzdHJveWluZyBkZWxlZ2F0ZXNcclxuICAgICAqIEBtZW1iZXJvZiBUaXBweVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICovXHJcblxyXG4gIH0sIHtcclxuICAgIGtleTogJ2Rlc3Ryb3knLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICAgIHZhciBfdGhpczMgPSB0aGlzO1xyXG5cclxuICAgICAgdmFyIGRlc3Ryb3lUYXJnZXRJbnN0YW5jZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XHJcblxyXG4gICAgICBpZiAodGhpcy5zdGF0ZS5kZXN0cm95ZWQpIHJldHVybjtcclxuXHJcbiAgICAgIC8vIEVuc3VyZSB0aGUgcG9wcGVyIGlzIGhpZGRlblxyXG4gICAgICBpZiAodGhpcy5zdGF0ZS52aXNpYmxlKSB7XHJcbiAgICAgICAgdGhpcy5oaWRlKDApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xyXG4gICAgICAgIF90aGlzMy5yZWZlcmVuY2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihsaXN0ZW5lci5ldmVudCwgbGlzdGVuZXIuaGFuZGxlcik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gUmVzdG9yZSB0aXRsZVxyXG4gICAgICBpZiAodGhpcy50aXRsZSkge1xyXG4gICAgICAgIHRoaXMucmVmZXJlbmNlLnNldEF0dHJpYnV0ZSgndGl0bGUnLCB0aGlzLnRpdGxlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGVsZXRlIHRoaXMucmVmZXJlbmNlLl90aXBweTtcclxuXHJcbiAgICAgIHZhciBhdHRyaWJ1dGVzID0gWydkYXRhLW9yaWdpbmFsLXRpdGxlJywgJ2RhdGEtdGlwcHknLCAnZGF0YS10aXBweS1kZWxlZ2F0ZSddO1xyXG4gICAgICBhdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcclxuICAgICAgICBfdGhpczMucmVmZXJlbmNlLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRhcmdldCAmJiBkZXN0cm95VGFyZ2V0SW5zdGFuY2VzKSB7XHJcbiAgICAgICAgdG9BcnJheSh0aGlzLnJlZmVyZW5jZS5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy50YXJnZXQpKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gICAgICAgICAgcmV0dXJuIGNoaWxkLl90aXBweSAmJiBjaGlsZC5fdGlwcHkuZGVzdHJveSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5wb3BwZXJJbnN0YW5jZSkge1xyXG4gICAgICAgIHRoaXMucG9wcGVySW5zdGFuY2UuZGVzdHJveSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl8oa2V5KS5tdXRhdGlvbk9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChvYnNlcnZlcikge1xyXG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnN0YXRlLmRlc3Ryb3llZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfV0pO1xyXG4gIHJldHVybiBUaXBweTtcclxufSgpO1xyXG5cclxuLyoqXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBQcml2YXRlIG1ldGhvZHNcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqIFN0YW5kYWxvbmUgZnVuY3Rpb25zIHRvIGJlIGNhbGxlZCB3aXRoIHRoZSBpbnN0YW5jZSdzIGB0aGlzYCBjb250ZXh0IHRvIG1ha2VcclxuICogdGhlbSB0cnVseSBwcml2YXRlIGFuZCBub3QgYWNjZXNzaWJsZSBvbiB0aGUgcHJvdG90eXBlXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIERldGVybWluZXMgaWYgdGhlIHRvb2x0aXAgaW5zdGFuY2UgaGFzIGZvbGxvd0N1cnNvciBiZWhhdmlvclxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9oYXNGb2xsb3dDdXJzb3JCZWhhdmlvcigpIHtcclxuICB2YXIgbGFzdFRyaWdnZXJFdmVudCA9IHRoaXMuXyhrZXkpLmxhc3RUcmlnZ2VyRXZlbnQ7XHJcbiAgcmV0dXJuIHRoaXMub3B0aW9ucy5mb2xsb3dDdXJzb3IgJiYgIWJyb3dzZXIudXNpbmdUb3VjaCAmJiBsYXN0VHJpZ2dlckV2ZW50ICYmIGxhc3RUcmlnZ2VyRXZlbnQudHlwZSAhPT0gJ2ZvY3VzJztcclxufVxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgdGhlIFRpcHB5IGluc3RhbmNlIGZvciB0aGUgY2hpbGQgdGFyZ2V0IG9mIHRoZSBkZWxlZ2F0ZSBjb250YWluZXJcclxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfY3JlYXRlRGVsZWdhdGVDaGlsZFRpcHB5KGV2ZW50KSB7XHJcbiAgdmFyIHRhcmdldEVsID0gY2xvc2VzdChldmVudC50YXJnZXQsIHRoaXMub3B0aW9ucy50YXJnZXQpO1xyXG4gIGlmICh0YXJnZXRFbCAmJiAhdGFyZ2V0RWwuX3RpcHB5KSB7XHJcbiAgICB2YXIgdGl0bGUgPSB0YXJnZXRFbC5nZXRBdHRyaWJ1dGUoJ3RpdGxlJykgfHwgdGhpcy50aXRsZTtcclxuICAgIGlmICh0aXRsZSkge1xyXG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgdGl0bGUpO1xyXG4gICAgICB0aXBweSQxKHRhcmdldEVsLCBfZXh0ZW5kcyh7fSwgdGhpcy5vcHRpb25zLCB7IHRhcmdldDogbnVsbCB9KSk7XHJcbiAgICAgIF9lbnRlci5jYWxsKHRhcmdldEVsLl90aXBweSwgZXZlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIE1ldGhvZCB1c2VkIGJ5IGV2ZW50IGxpc3RlbmVycyB0byBpbnZva2UgdGhlIHNob3cgbWV0aG9kLCB0YWtpbmcgaW50byBhY2NvdW50IGRlbGF5cyBhbmRcclxuICogdGhlIGB3YWl0YCBvcHRpb25cclxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfZW50ZXIoZXZlbnQpIHtcclxuICB2YXIgX3RoaXM0ID0gdGhpcztcclxuXHJcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG5cclxuICBfY2xlYXJEZWxheVRpbWVvdXRzLmNhbGwodGhpcyk7XHJcblxyXG4gIGlmICh0aGlzLnN0YXRlLnZpc2libGUpIHJldHVybjtcclxuXHJcbiAgLy8gSXMgYSBkZWxlZ2F0ZSwgY3JlYXRlIFRpcHB5IGluc3RhbmNlIGZvciB0aGUgY2hpbGQgdGFyZ2V0XHJcbiAgaWYgKG9wdGlvbnMudGFyZ2V0KSB7XHJcbiAgICBfY3JlYXRlRGVsZWdhdGVDaGlsZFRpcHB5LmNhbGwodGhpcywgZXZlbnQpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5fKGtleSkuaXNQcmVwYXJpbmdUb1Nob3cgPSB0cnVlO1xyXG5cclxuICBpZiAob3B0aW9ucy53YWl0KSB7XHJcbiAgICBvcHRpb25zLndhaXQuY2FsbCh0aGlzLnBvcHBlciwgdGhpcy5zaG93LmJpbmQodGhpcyksIGV2ZW50KTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIElmIHRoZSB0b29sdGlwIGhhcyBhIGRlbGF5LCB3ZSBuZWVkIHRvIGJlIGxpc3RlbmluZyB0byB0aGUgbW91c2Vtb3ZlIGFzIHNvb24gYXMgdGhlIHRyaWdnZXJcclxuICAvLyBldmVudCBpcyBmaXJlZCBzbyB0aGF0IGl0J3MgaW4gdGhlIGNvcnJlY3QgcG9zaXRpb24gdXBvbiBtb3VudC5cclxuICBpZiAoX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yLmNhbGwodGhpcykpIHtcclxuICAgIGlmICghdGhpcy5fKGtleSkuZm9sbG93Q3Vyc29yTGlzdGVuZXIpIHtcclxuICAgICAgX3NldEZvbGxvd0N1cnNvckxpc3RlbmVyLmNhbGwodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIF9nZXRJbm5lckVsZW1lbnRzMyA9IGdldElubmVyRWxlbWVudHModGhpcy5wb3BwZXIpLFxyXG4gICAgICAgIGFycm93ID0gX2dldElubmVyRWxlbWVudHMzLmFycm93O1xyXG5cclxuICAgIGlmIChhcnJvdykgYXJyb3cuc3R5bGUubWFyZ2luID0gJzAnO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fKGtleSkuZm9sbG93Q3Vyc29yTGlzdGVuZXIpO1xyXG4gIH1cclxuXHJcbiAgdmFyIGRlbGF5ID0gZ2V0VmFsdWUob3B0aW9ucy5kZWxheSwgMCk7XHJcblxyXG4gIGlmIChkZWxheSkge1xyXG4gICAgdGhpcy5fKGtleSkuc2hvd1RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgX3RoaXM0LnNob3coKTtcclxuICAgIH0sIGRlbGF5KTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5zaG93KCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogTWV0aG9kIHVzZWQgYnkgZXZlbnQgbGlzdGVuZXJzIHRvIGludm9rZSB0aGUgaGlkZSBtZXRob2QsIHRha2luZyBpbnRvIGFjY291bnQgZGVsYXlzXHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2xlYXZlKCkge1xyXG4gIHZhciBfdGhpczUgPSB0aGlzO1xyXG5cclxuICBfY2xlYXJEZWxheVRpbWVvdXRzLmNhbGwodGhpcyk7XHJcblxyXG4gIGlmICghdGhpcy5zdGF0ZS52aXNpYmxlKSByZXR1cm47XHJcblxyXG4gIHRoaXMuXyhrZXkpLmlzUHJlcGFyaW5nVG9TaG93ID0gZmFsc2U7XHJcblxyXG4gIHZhciBkZWxheSA9IGdldFZhbHVlKHRoaXMub3B0aW9ucy5kZWxheSwgMSk7XHJcblxyXG4gIGlmIChkZWxheSkge1xyXG4gICAgdGhpcy5fKGtleSkuaGlkZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKF90aGlzNS5zdGF0ZS52aXNpYmxlKSB7XHJcbiAgICAgICAgX3RoaXM1LmhpZGUoKTtcclxuICAgICAgfVxyXG4gICAgfSwgZGVsYXkpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLmhpZGUoKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHJlbGV2YW50IGxpc3RlbmVycyBmb3IgdGhlIGluc3RhbmNlXHJcbiAqIEByZXR1cm4ge09iamVjdH0gb2YgbGlzdGVuZXJzXHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2dldEV2ZW50TGlzdGVuZXJzKCkge1xyXG4gIHZhciBfdGhpczYgPSB0aGlzO1xyXG5cclxuICB2YXIgb25UcmlnZ2VyID0gZnVuY3Rpb24gb25UcmlnZ2VyKGV2ZW50KSB7XHJcbiAgICBpZiAoIV90aGlzNi5zdGF0ZS5lbmFibGVkKSByZXR1cm47XHJcblxyXG4gICAgdmFyIHNob3VsZFN0b3BFdmVudCA9IGJyb3dzZXIuc3VwcG9ydHNUb3VjaCAmJiBicm93c2VyLnVzaW5nVG91Y2ggJiYgWydtb3VzZWVudGVyJywgJ21vdXNlb3ZlcicsICdmb2N1cyddLmluZGV4T2YoZXZlbnQudHlwZSkgPiAtMTtcclxuXHJcbiAgICBpZiAoc2hvdWxkU3RvcEV2ZW50ICYmIF90aGlzNi5vcHRpb25zLnRvdWNoSG9sZCkgcmV0dXJuO1xyXG5cclxuICAgIF90aGlzNi5fKGtleSkubGFzdFRyaWdnZXJFdmVudCA9IGV2ZW50O1xyXG5cclxuICAgIC8vIFRvZ2dsZSBzaG93L2hpZGUgd2hlbiBjbGlja2luZyBjbGljay10cmlnZ2VyZWQgdG9vbHRpcHNcclxuICAgIGlmIChldmVudC50eXBlID09PSAnY2xpY2snICYmIF90aGlzNi5vcHRpb25zLmhpZGVPbkNsaWNrICE9PSAncGVyc2lzdGVudCcgJiYgX3RoaXM2LnN0YXRlLnZpc2libGUpIHtcclxuICAgICAgX2xlYXZlLmNhbGwoX3RoaXM2KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIF9lbnRlci5jYWxsKF90aGlzNiwgZXZlbnQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBvbk1vdXNlTGVhdmUgPSBmdW5jdGlvbiBvbk1vdXNlTGVhdmUoZXZlbnQpIHtcclxuICAgIGlmIChbJ21vdXNlbGVhdmUnLCAnbW91c2VvdXQnXS5pbmRleE9mKGV2ZW50LnR5cGUpID4gLTEgJiYgYnJvd3Nlci5zdXBwb3J0c1RvdWNoICYmIGJyb3dzZXIudXNpbmdUb3VjaCAmJiBfdGhpczYub3B0aW9ucy50b3VjaEhvbGQpIHJldHVybjtcclxuXHJcbiAgICBpZiAoX3RoaXM2Lm9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcclxuICAgICAgdmFyIGhpZGUgPSBfbGVhdmUuYmluZChfdGhpczYpO1xyXG5cclxuICAgICAgdmFyIG9uTW91c2VNb3ZlID0gZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcclxuICAgICAgICB2YXIgcmVmZXJlbmNlQ3Vyc29ySXNPdmVyID0gY2xvc2VzdChldmVudC50YXJnZXQsIHNlbGVjdG9ycy5SRUZFUkVOQ0UpO1xyXG4gICAgICAgIHZhciBjdXJzb3JJc092ZXJQb3BwZXIgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgc2VsZWN0b3JzLlBPUFBFUikgPT09IF90aGlzNi5wb3BwZXI7XHJcbiAgICAgICAgdmFyIGN1cnNvcklzT3ZlclJlZmVyZW5jZSA9IHJlZmVyZW5jZUN1cnNvcklzT3ZlciA9PT0gX3RoaXM2LnJlZmVyZW5jZTtcclxuXHJcbiAgICAgICAgaWYgKGN1cnNvcklzT3ZlclBvcHBlciB8fCBjdXJzb3JJc092ZXJSZWZlcmVuY2UpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKGN1cnNvcklzT3V0c2lkZUludGVyYWN0aXZlQm9yZGVyKGV2ZW50LCBfdGhpczYucG9wcGVyLCBfdGhpczYub3B0aW9ucykpIHtcclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGhpZGUpO1xyXG4gICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xyXG5cclxuICAgICAgICAgIF9sZWF2ZS5jYWxsKF90aGlzNiwgb25Nb3VzZU1vdmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGhpZGUpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbk1vdXNlTW92ZSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBfbGVhdmUuY2FsbChfdGhpczYpO1xyXG4gIH07XHJcblxyXG4gIHZhciBvbkJsdXIgPSBmdW5jdGlvbiBvbkJsdXIoZXZlbnQpIHtcclxuICAgIGlmIChldmVudC50YXJnZXQgIT09IF90aGlzNi5yZWZlcmVuY2UgfHwgYnJvd3Nlci51c2luZ1RvdWNoKSByZXR1cm47XHJcblxyXG4gICAgaWYgKF90aGlzNi5vcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICAgIGlmICghZXZlbnQucmVsYXRlZFRhcmdldCkgcmV0dXJuO1xyXG4gICAgICBpZiAoY2xvc2VzdChldmVudC5yZWxhdGVkVGFyZ2V0LCBzZWxlY3RvcnMuUE9QUEVSKSkgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIF9sZWF2ZS5jYWxsKF90aGlzNik7XHJcbiAgfTtcclxuXHJcbiAgdmFyIG9uRGVsZWdhdGVTaG93ID0gZnVuY3Rpb24gb25EZWxlZ2F0ZVNob3coZXZlbnQpIHtcclxuICAgIGlmIChjbG9zZXN0KGV2ZW50LnRhcmdldCwgX3RoaXM2Lm9wdGlvbnMudGFyZ2V0KSkge1xyXG4gICAgICBfZW50ZXIuY2FsbChfdGhpczYsIGV2ZW50KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgb25EZWxlZ2F0ZUhpZGUgPSBmdW5jdGlvbiBvbkRlbGVnYXRlSGlkZShldmVudCkge1xyXG4gICAgaWYgKGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBfdGhpczYub3B0aW9ucy50YXJnZXQpKSB7XHJcbiAgICAgIF9sZWF2ZS5jYWxsKF90aGlzNik7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG9uVHJpZ2dlcjogb25UcmlnZ2VyLFxyXG4gICAgb25Nb3VzZUxlYXZlOiBvbk1vdXNlTGVhdmUsXHJcbiAgICBvbkJsdXI6IG9uQmx1cixcclxuICAgIG9uRGVsZWdhdGVTaG93OiBvbkRlbGVnYXRlU2hvdyxcclxuICAgIG9uRGVsZWdhdGVIaWRlOiBvbkRlbGVnYXRlSGlkZVxyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgbmV3IHBvcHBlciBpbnN0YW5jZVxyXG4gKiBAcmV0dXJuIHtQb3BwZXJ9XHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2NyZWF0ZVBvcHBlckluc3RhbmNlKCkge1xyXG4gIHZhciBfdGhpczcgPSB0aGlzO1xyXG5cclxuICB2YXIgcG9wcGVyID0gdGhpcy5wb3BwZXIsXHJcbiAgICAgIHJlZmVyZW5jZSA9IHRoaXMucmVmZXJlbmNlLFxyXG4gICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICB2YXIgX2dldElubmVyRWxlbWVudHM0ID0gZ2V0SW5uZXJFbGVtZW50cyhwb3BwZXIpLFxyXG4gICAgICB0b29sdGlwID0gX2dldElubmVyRWxlbWVudHM0LnRvb2x0aXA7XHJcblxyXG4gIHZhciBwb3BwZXJPcHRpb25zID0gb3B0aW9ucy5wb3BwZXJPcHRpb25zO1xyXG5cclxuICB2YXIgYXJyb3dTZWxlY3RvciA9IG9wdGlvbnMuYXJyb3dUeXBlID09PSAncm91bmQnID8gc2VsZWN0b3JzLlJPVU5EX0FSUk9XIDogc2VsZWN0b3JzLkFSUk9XO1xyXG4gIHZhciBhcnJvdyA9IHRvb2x0aXAucXVlcnlTZWxlY3RvcihhcnJvd1NlbGVjdG9yKTtcclxuXHJcbiAgdmFyIGNvbmZpZyA9IF9leHRlbmRzKHtcclxuICAgIHBsYWNlbWVudDogb3B0aW9ucy5wbGFjZW1lbnRcclxuICB9LCBwb3BwZXJPcHRpb25zIHx8IHt9LCB7XHJcbiAgICBtb2RpZmllcnM6IF9leHRlbmRzKHt9LCBwb3BwZXJPcHRpb25zID8gcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMgOiB7fSwge1xyXG4gICAgICBhcnJvdzogX2V4dGVuZHMoe1xyXG4gICAgICAgIGVsZW1lbnQ6IGFycm93U2VsZWN0b3JcclxuICAgICAgfSwgcG9wcGVyT3B0aW9ucyAmJiBwb3BwZXJPcHRpb25zLm1vZGlmaWVycyA/IHBvcHBlck9wdGlvbnMubW9kaWZpZXJzLmFycm93IDoge30pLFxyXG4gICAgICBmbGlwOiBfZXh0ZW5kcyh7XHJcbiAgICAgICAgZW5hYmxlZDogb3B0aW9ucy5mbGlwLFxyXG4gICAgICAgIHBhZGRpbmc6IG9wdGlvbnMuZGlzdGFuY2UgKyA1IC8qIDVweCBmcm9tIHZpZXdwb3J0IGJvdW5kYXJ5ICovXHJcbiAgICAgICAgLCBiZWhhdmlvcjogb3B0aW9ucy5mbGlwQmVoYXZpb3JcclxuICAgICAgfSwgcG9wcGVyT3B0aW9ucyAmJiBwb3BwZXJPcHRpb25zLm1vZGlmaWVycyA/IHBvcHBlck9wdGlvbnMubW9kaWZpZXJzLmZsaXAgOiB7fSksXHJcbiAgICAgIG9mZnNldDogX2V4dGVuZHMoe1xyXG4gICAgICAgIG9mZnNldDogb3B0aW9ucy5vZmZzZXRcclxuICAgICAgfSwgcG9wcGVyT3B0aW9ucyAmJiBwb3BwZXJPcHRpb25zLm1vZGlmaWVycyA/IHBvcHBlck9wdGlvbnMubW9kaWZpZXJzLm9mZnNldCA6IHt9KVxyXG4gICAgfSksXHJcbiAgICBvbkNyZWF0ZTogZnVuY3Rpb24gb25DcmVhdGUoKSB7XHJcbiAgICAgIHRvb2x0aXAuc3R5bGVbZ2V0UG9wcGVyUGxhY2VtZW50KHBvcHBlcildID0gZ2V0T2Zmc2V0RGlzdGFuY2VJblB4KG9wdGlvbnMuZGlzdGFuY2UpO1xyXG5cclxuICAgICAgaWYgKGFycm93ICYmIG9wdGlvbnMuYXJyb3dUcmFuc2Zvcm0pIHtcclxuICAgICAgICBjb21wdXRlQXJyb3dUcmFuc2Zvcm0ocG9wcGVyLCBhcnJvdywgb3B0aW9ucy5hcnJvd1RyYW5zZm9ybSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvblVwZGF0ZTogZnVuY3Rpb24gb25VcGRhdGUoKSB7XHJcbiAgICAgIHZhciBzdHlsZXMgPSB0b29sdGlwLnN0eWxlO1xyXG4gICAgICBzdHlsZXMudG9wID0gJyc7XHJcbiAgICAgIHN0eWxlcy5ib3R0b20gPSAnJztcclxuICAgICAgc3R5bGVzLmxlZnQgPSAnJztcclxuICAgICAgc3R5bGVzLnJpZ2h0ID0gJyc7XHJcbiAgICAgIHN0eWxlc1tnZXRQb3BwZXJQbGFjZW1lbnQocG9wcGVyKV0gPSBnZXRPZmZzZXREaXN0YW5jZUluUHgob3B0aW9ucy5kaXN0YW5jZSk7XHJcblxyXG4gICAgICBpZiAoYXJyb3cgJiYgb3B0aW9ucy5hcnJvd1RyYW5zZm9ybSkge1xyXG4gICAgICAgIGNvbXB1dGVBcnJvd1RyYW5zZm9ybShwb3BwZXIsIGFycm93LCBvcHRpb25zLmFycm93VHJhbnNmb3JtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBfYWRkTXV0YXRpb25PYnNlcnZlci5jYWxsKHRoaXMsIHtcclxuICAgIHRhcmdldDogcG9wcGVyLFxyXG4gICAgY2FsbGJhY2s6IGZ1bmN0aW9uIGNhbGxiYWNrKCkge1xyXG4gICAgICBfdGhpczcucG9wcGVySW5zdGFuY2UudXBkYXRlKCk7XHJcbiAgICB9LFxyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICBjaGlsZExpc3Q6IHRydWUsXHJcbiAgICAgIHN1YnRyZWU6IHRydWUsXHJcbiAgICAgIGNoYXJhY3RlckRhdGE6IHRydWVcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIG5ldyBQb3BwZXIocmVmZXJlbmNlLCBwb3BwZXIsIGNvbmZpZyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBcHBlbmRzIHRoZSBwb3BwZXIgZWxlbWVudCB0byB0aGUgRE9NLCB1cGRhdGluZyBvciBjcmVhdGluZyB0aGUgcG9wcGVyIGluc3RhbmNlXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX21vdW50KGNhbGxiYWNrKSB7XHJcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcblxyXG5cclxuICBpZiAoIXRoaXMucG9wcGVySW5zdGFuY2UpIHtcclxuICAgIHRoaXMucG9wcGVySW5zdGFuY2UgPSBfY3JlYXRlUG9wcGVySW5zdGFuY2UuY2FsbCh0aGlzKTtcclxuICAgIGlmICghb3B0aW9ucy5saXZlUGxhY2VtZW50KSB7XHJcbiAgICAgIHRoaXMucG9wcGVySW5zdGFuY2UuZGlzYWJsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMucG9wcGVySW5zdGFuY2Uuc2NoZWR1bGVVcGRhdGUoKTtcclxuICAgIGlmIChvcHRpb25zLmxpdmVQbGFjZW1lbnQgJiYgIV9oYXNGb2xsb3dDdXJzb3JCZWhhdmlvci5jYWxsKHRoaXMpKSB7XHJcbiAgICAgIHRoaXMucG9wcGVySW5zdGFuY2UuZW5hYmxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIElmIHRoZSBpbnN0YW5jZSBwcmV2aW91c2x5IGhhZCBmb2xsb3dDdXJzb3IgYmVoYXZpb3IsIGl0IHdpbGwgYmUgcG9zaXRpb25lZCBpbmNvcnJlY3RseVxyXG4gIC8vIGlmIHRyaWdnZXJlZCBieSBgZm9jdXNgIGFmdGVyd2FyZHMgLSB1cGRhdGUgdGhlIHJlZmVyZW5jZSBiYWNrIHRvIHRoZSByZWFsIERPTSBlbGVtZW50XHJcbiAgaWYgKCFfaGFzRm9sbG93Q3Vyc29yQmVoYXZpb3IuY2FsbCh0aGlzKSkge1xyXG4gICAgdmFyIF9nZXRJbm5lckVsZW1lbnRzNSA9IGdldElubmVyRWxlbWVudHModGhpcy5wb3BwZXIpLFxyXG4gICAgICAgIGFycm93ID0gX2dldElubmVyRWxlbWVudHM1LmFycm93O1xyXG5cclxuICAgIGlmIChhcnJvdykgYXJyb3cuc3R5bGUubWFyZ2luID0gJyc7XHJcbiAgICB0aGlzLnBvcHBlckluc3RhbmNlLnJlZmVyZW5jZSA9IHRoaXMucmVmZXJlbmNlO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUG9wcGVyUG9zaXRpb24odGhpcy5wb3BwZXJJbnN0YW5jZSwgY2FsbGJhY2ssIHRydWUpO1xyXG5cclxuICBpZiAoIW9wdGlvbnMuYXBwZW5kVG8uY29udGFpbnModGhpcy5wb3BwZXIpKSB7XHJcbiAgICBvcHRpb25zLmFwcGVuZFRvLmFwcGVuZENoaWxkKHRoaXMucG9wcGVyKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDbGVhcnMgdGhlIHNob3cgYW5kIGhpZGUgZGVsYXkgdGltZW91dHNcclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfY2xlYXJEZWxheVRpbWVvdXRzKCkge1xyXG4gIHZhciBfcmVmID0gdGhpcy5fKGtleSksXHJcbiAgICAgIHNob3dUaW1lb3V0ID0gX3JlZi5zaG93VGltZW91dCxcclxuICAgICAgaGlkZVRpbWVvdXQgPSBfcmVmLmhpZGVUaW1lb3V0O1xyXG5cclxuICBjbGVhclRpbWVvdXQoc2hvd1RpbWVvdXQpO1xyXG4gIGNsZWFyVGltZW91dChoaWRlVGltZW91dCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXRzIHRoZSBtb3VzZW1vdmUgZXZlbnQgbGlzdGVuZXIgZnVuY3Rpb24gZm9yIGBmb2xsb3dDdXJzb3JgIG9wdGlvblxyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9zZXRGb2xsb3dDdXJzb3JMaXN0ZW5lcigpIHtcclxuICB2YXIgX3RoaXM4ID0gdGhpcztcclxuXHJcbiAgdGhpcy5fKGtleSkuZm9sbG93Q3Vyc29yTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHZhciBfJGxhc3RNb3VzZU1vdmVFdmVudCA9IF90aGlzOC5fKGtleSkubGFzdE1vdXNlTW92ZUV2ZW50ID0gZXZlbnQsXHJcbiAgICAgICAgY2xpZW50WCA9IF8kbGFzdE1vdXNlTW92ZUV2ZW50LmNsaWVudFgsXHJcbiAgICAgICAgY2xpZW50WSA9IF8kbGFzdE1vdXNlTW92ZUV2ZW50LmNsaWVudFk7XHJcblxyXG4gICAgaWYgKCFfdGhpczgucG9wcGVySW5zdGFuY2UpIHJldHVybjtcclxuXHJcbiAgICBfdGhpczgucG9wcGVySW5zdGFuY2UucmVmZXJlbmNlID0ge1xyXG4gICAgICBnZXRCb3VuZGluZ0NsaWVudFJlY3Q6IGZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICBoZWlnaHQ6IDAsXHJcbiAgICAgICAgICB0b3A6IGNsaWVudFksXHJcbiAgICAgICAgICBsZWZ0OiBjbGllbnRYLFxyXG4gICAgICAgICAgcmlnaHQ6IGNsaWVudFgsXHJcbiAgICAgICAgICBib3R0b206IGNsaWVudFlcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgICBjbGllbnRXaWR0aDogMCxcclxuICAgICAgY2xpZW50SGVpZ2h0OiAwXHJcbiAgICB9O1xyXG5cclxuICAgIF90aGlzOC5wb3BwZXJJbnN0YW5jZS5zY2hlZHVsZVVwZGF0ZSgpO1xyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGVzIHRoZSBwb3BwZXIncyBwb3NpdGlvbiBvbiBlYWNoIGFuaW1hdGlvbiBmcmFtZVxyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9tYWtlU3RpY2t5KCkge1xyXG4gIHZhciBfdGhpczkgPSB0aGlzO1xyXG5cclxuICB2YXIgYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24kJDEgPSBmdW5jdGlvbiBhcHBseVRyYW5zaXRpb25EdXJhdGlvbiQkMSgpIHtcclxuICAgIF90aGlzOS5wb3BwZXIuc3R5bGVbcHJlZml4KCd0cmFuc2l0aW9uRHVyYXRpb24nKV0gPSBfdGhpczkub3B0aW9ucy51cGRhdGVEdXJhdGlvbiArICdtcyc7XHJcbiAgfTtcclxuXHJcbiAgdmFyIHJlbW92ZVRyYW5zaXRpb25EdXJhdGlvbiA9IGZ1bmN0aW9uIHJlbW92ZVRyYW5zaXRpb25EdXJhdGlvbigpIHtcclxuICAgIF90aGlzOS5wb3BwZXIuc3R5bGVbcHJlZml4KCd0cmFuc2l0aW9uRHVyYXRpb24nKV0gPSAnJztcclxuICB9O1xyXG5cclxuICB2YXIgdXBkYXRlUG9zaXRpb24gPSBmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbigpIHtcclxuICAgIGlmIChfdGhpczkucG9wcGVySW5zdGFuY2UpIHtcclxuICAgICAgX3RoaXM5LnBvcHBlckluc3RhbmNlLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uJCQxKCk7XHJcblxyXG4gICAgaWYgKF90aGlzOS5zdGF0ZS52aXNpYmxlKSB7XHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGVQb3NpdGlvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZW1vdmVUcmFuc2l0aW9uRHVyYXRpb24oKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB1cGRhdGVQb3NpdGlvbigpO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkcyBhIG11dGF0aW9uIG9ic2VydmVyIHRvIGFuIGVsZW1lbnQgYW5kIHN0b3JlcyBpdCBpbiB0aGUgaW5zdGFuY2VcclxuICogQHBhcmFtIHtPYmplY3R9XHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2FkZE11dGF0aW9uT2JzZXJ2ZXIoX3JlZjIpIHtcclxuICB2YXIgdGFyZ2V0ID0gX3JlZjIudGFyZ2V0LFxyXG4gICAgICBjYWxsYmFjayA9IF9yZWYyLmNhbGxiYWNrLFxyXG4gICAgICBvcHRpb25zID0gX3JlZjIub3B0aW9ucztcclxuXHJcbiAgaWYgKCF3aW5kb3cuTXV0YXRpb25PYnNlcnZlcikgcmV0dXJuO1xyXG5cclxuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XHJcbiAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXQsIG9wdGlvbnMpO1xyXG5cclxuICB0aGlzLl8oa2V5KS5tdXRhdGlvbk9ic2VydmVycy5wdXNoKG9ic2VydmVyKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZpcmVzIHRoZSBjYWxsYmFjayBmdW5jdGlvbnMgb25jZSB0aGUgQ1NTIHRyYW5zaXRpb24gZW5kcyBmb3IgYHNob3dgIGFuZCBgaGlkZWAgbWV0aG9kc1xyXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBjYWxsYmFjayBmdW5jdGlvbiB0byBmaXJlIG9uY2UgdHJhbnNpdGlvbiBjb21wbGV0ZXNcclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfb25UcmFuc2l0aW9uRW5kKGR1cmF0aW9uLCBjYWxsYmFjaykge1xyXG4gIC8vIE1ha2UgY2FsbGJhY2sgc3luY2hyb25vdXMgaWYgZHVyYXRpb24gaXMgMFxyXG4gIGlmICghZHVyYXRpb24pIHtcclxuICAgIHJldHVybiBjYWxsYmFjaygpO1xyXG4gIH1cclxuXHJcbiAgdmFyIF9nZXRJbm5lckVsZW1lbnRzNiA9IGdldElubmVyRWxlbWVudHModGhpcy5wb3BwZXIpLFxyXG4gICAgICB0b29sdGlwID0gX2dldElubmVyRWxlbWVudHM2LnRvb2x0aXA7XHJcblxyXG4gIHZhciB0b2dnbGVMaXN0ZW5lcnMgPSBmdW5jdGlvbiB0b2dnbGVMaXN0ZW5lcnMoYWN0aW9uLCBsaXN0ZW5lcikge1xyXG4gICAgaWYgKCFsaXN0ZW5lcikgcmV0dXJuO1xyXG4gICAgdG9vbHRpcFthY3Rpb24gKyAnRXZlbnRMaXN0ZW5lciddKCdvbnRyYW5zaXRpb25lbmQnIGluIHdpbmRvdyA/ICd0cmFuc2l0aW9uZW5kJyA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJywgbGlzdGVuZXIpO1xyXG4gIH07XHJcblxyXG4gIHZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uIGxpc3RlbmVyKGUpIHtcclxuICAgIGlmIChlLnRhcmdldCA9PT0gdG9vbHRpcCkge1xyXG4gICAgICB0b2dnbGVMaXN0ZW5lcnMoJ3JlbW92ZScsIGxpc3RlbmVyKTtcclxuICAgICAgY2FsbGJhY2soKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB0b2dnbGVMaXN0ZW5lcnMoJ3JlbW92ZScsIHRoaXMuXyhrZXkpLnRyYW5zaXRpb25lbmRMaXN0ZW5lcik7XHJcbiAgdG9nZ2xlTGlzdGVuZXJzKCdhZGQnLCBsaXN0ZW5lcik7XHJcblxyXG4gIHRoaXMuXyhrZXkpLnRyYW5zaXRpb25lbmRMaXN0ZW5lciA9IGxpc3RlbmVyO1xyXG59XHJcblxyXG52YXIgaWRDb3VudGVyID0gMTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIHRvb2x0aXBzIGZvciBlYWNoIHJlZmVyZW5jZSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7RWxlbWVudFtdfSBlbHNcclxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xyXG4gKiBAcmV0dXJuIHtUaXBweVtdfSBBcnJheSBvZiBUaXBweSBpbnN0YW5jZXNcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXBzKGVscywgY29uZmlnKSB7XHJcbiAgcmV0dXJuIGVscy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgcmVmZXJlbmNlKSB7XHJcbiAgICB2YXIgaWQgPSBpZENvdW50ZXI7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSBldmFsdWF0ZU9wdGlvbnMocmVmZXJlbmNlLCBjb25maWcucGVyZm9ybWFuY2UgPyBjb25maWcgOiBnZXRJbmRpdmlkdWFsT3B0aW9ucyhyZWZlcmVuY2UsIGNvbmZpZykpO1xyXG5cclxuICAgIHZhciB0aXRsZSA9IHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoJ3RpdGxlJyk7XHJcblxyXG4gICAgLy8gRG9uJ3QgY3JlYXRlIGFuIGluc3RhbmNlIHdoZW46XHJcbiAgICAvLyAqIHRoZSBgdGl0bGVgIGF0dHJpYnV0ZSBpcyBmYWxzeSAobnVsbCBvciBlbXB0eSBzdHJpbmcpLCBhbmRcclxuICAgIC8vICogaXQncyBub3QgYSBkZWxlZ2F0ZSBmb3IgdG9vbHRpcHMsIGFuZFxyXG4gICAgLy8gKiB0aGVyZSBpcyBubyBodG1sIHRlbXBsYXRlIHNwZWNpZmllZCwgYW5kXHJcbiAgICAvLyAqIGBkeW5hbWljVGl0bGVgIG9wdGlvbiBpcyBmYWxzZVxyXG4gICAgaWYgKCF0aXRsZSAmJiAhb3B0aW9ucy50YXJnZXQgJiYgIW9wdGlvbnMuaHRtbCAmJiAhb3B0aW9ucy5keW5hbWljVGl0bGUpIHtcclxuICAgICAgcmV0dXJuIGFjYztcclxuICAgIH1cclxuXHJcbiAgICAvLyBEZWxlZ2F0ZXMgc2hvdWxkIGJlIGhpZ2hsaWdodGVkIGFzIGRpZmZlcmVudFxyXG4gICAgcmVmZXJlbmNlLnNldEF0dHJpYnV0ZShvcHRpb25zLnRhcmdldCA/ICdkYXRhLXRpcHB5LWRlbGVnYXRlJyA6ICdkYXRhLXRpcHB5JywgJycpO1xyXG5cclxuICAgIHJlbW92ZVRpdGxlKHJlZmVyZW5jZSk7XHJcblxyXG4gICAgdmFyIHBvcHBlciA9IGNyZWF0ZVBvcHBlckVsZW1lbnQoaWQsIHRpdGxlLCBvcHRpb25zKTtcclxuXHJcbiAgICB2YXIgdGlwcHkgPSBuZXcgVGlwcHkoe1xyXG4gICAgICBpZDogaWQsXHJcbiAgICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlLFxyXG4gICAgICBwb3BwZXI6IHBvcHBlcixcclxuICAgICAgb3B0aW9uczogb3B0aW9ucyxcclxuICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICBwb3BwZXJJbnN0YW5jZTogbnVsbFxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuY3JlYXRlUG9wcGVySW5zdGFuY2VPbkluaXQpIHtcclxuICAgICAgdGlwcHkucG9wcGVySW5zdGFuY2UgPSBfY3JlYXRlUG9wcGVySW5zdGFuY2UuY2FsbCh0aXBweSk7XHJcbiAgICAgIHRpcHB5LnBvcHBlckluc3RhbmNlLmRpc2FibGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaXN0ZW5lcnMgPSBfZ2V0RXZlbnRMaXN0ZW5lcnMuY2FsbCh0aXBweSk7XHJcbiAgICB0aXBweS5saXN0ZW5lcnMgPSBvcHRpb25zLnRyaWdnZXIudHJpbSgpLnNwbGl0KCcgJykucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGV2ZW50VHlwZSkge1xyXG4gICAgICByZXR1cm4gYWNjLmNvbmNhdChjcmVhdGVUcmlnZ2VyKGV2ZW50VHlwZSwgcmVmZXJlbmNlLCBsaXN0ZW5lcnMsIG9wdGlvbnMpKTtcclxuICAgIH0sIFtdKTtcclxuXHJcbiAgICAvLyBVcGRhdGUgdG9vbHRpcCBjb250ZW50IHdoZW5ldmVyIHRoZSB0aXRsZSBhdHRyaWJ1dGUgb24gdGhlIHJlZmVyZW5jZSBjaGFuZ2VzXHJcbiAgICBpZiAob3B0aW9ucy5keW5hbWljVGl0bGUpIHtcclxuICAgICAgX2FkZE11dGF0aW9uT2JzZXJ2ZXIuY2FsbCh0aXBweSwge1xyXG4gICAgICAgIHRhcmdldDogcmVmZXJlbmNlLFxyXG4gICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiBjYWxsYmFjaygpIHtcclxuICAgICAgICAgIHZhciBfZ2V0SW5uZXJFbGVtZW50cyA9IGdldElubmVyRWxlbWVudHMocG9wcGVyKSxcclxuICAgICAgICAgICAgICBjb250ZW50ID0gX2dldElubmVyRWxlbWVudHMuY29udGVudDtcclxuXHJcbiAgICAgICAgICB2YXIgdGl0bGUgPSByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCd0aXRsZScpO1xyXG4gICAgICAgICAgaWYgKHRpdGxlKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnRbb3B0aW9ucy5hbGxvd1RpdGxlSFRNTCA/ICdpbm5lckhUTUwnIDogJ3RleHRDb250ZW50J10gPSB0aXBweS50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgICAgICByZW1vdmVUaXRsZShyZWZlcmVuY2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNob3J0Y3V0c1xyXG4gICAgcmVmZXJlbmNlLl90aXBweSA9IHRpcHB5O1xyXG4gICAgcG9wcGVyLl90aXBweSA9IHRpcHB5O1xyXG4gICAgcG9wcGVyLl9yZWZlcmVuY2UgPSByZWZlcmVuY2U7XHJcblxyXG4gICAgYWNjLnB1c2godGlwcHkpO1xyXG5cclxuICAgIGlkQ291bnRlcisrO1xyXG5cclxuICAgIHJldHVybiBhY2M7XHJcbiAgfSwgW10pO1xyXG59XHJcblxyXG4vKipcclxuICogSGlkZXMgYWxsIHBvcHBlcnNcclxuICogQHBhcmFtIHtUaXBweX0gZXhjbHVkZVRpcHB5IC0gdGlwcHkgdG8gZXhjbHVkZSBpZiBuZWVkZWRcclxuICovXHJcbmZ1bmN0aW9uIGhpZGVBbGxQb3BwZXJzKGV4Y2x1ZGVUaXBweSkge1xyXG4gIHZhciBwb3BwZXJzID0gdG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycy5QT1BQRVIpKTtcclxuXHJcbiAgcG9wcGVycy5mb3JFYWNoKGZ1bmN0aW9uIChwb3BwZXIpIHtcclxuICAgIHZhciB0aXBweSA9IHBvcHBlci5fdGlwcHk7XHJcbiAgICBpZiAoIXRpcHB5KSByZXR1cm47XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSB0aXBweS5vcHRpb25zO1xyXG5cclxuXHJcbiAgICBpZiAoKG9wdGlvbnMuaGlkZU9uQ2xpY2sgPT09IHRydWUgfHwgb3B0aW9ucy50cmlnZ2VyLmluZGV4T2YoJ2ZvY3VzJykgPiAtMSkgJiYgKCFleGNsdWRlVGlwcHkgfHwgcG9wcGVyICE9PSBleGNsdWRlVGlwcHkucG9wcGVyKSkge1xyXG4gICAgICB0aXBweS5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGRzIHRoZSBuZWVkZWQgZXZlbnQgbGlzdGVuZXJzXHJcbiAqL1xyXG5mdW5jdGlvbiBiaW5kRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgdmFyIG9uRG9jdW1lbnRUb3VjaCA9IGZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaCgpIHtcclxuICAgIGlmIChicm93c2VyLnVzaW5nVG91Y2gpIHJldHVybjtcclxuXHJcbiAgICBicm93c2VyLnVzaW5nVG91Y2ggPSB0cnVlO1xyXG5cclxuICAgIGlmIChicm93c2VyLmlPUykge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3RpcHB5LXRvdWNoJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGJyb3dzZXIuZHluYW1pY0lucHV0RGV0ZWN0aW9uICYmIHdpbmRvdy5wZXJmb3JtYW5jZSkge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbkRvY3VtZW50TW91c2VNb3ZlKTtcclxuICAgIH1cclxuXHJcbiAgICBicm93c2VyLm9uVXNlcklucHV0Q2hhbmdlKCd0b3VjaCcpO1xyXG4gIH07XHJcblxyXG4gIHZhciBvbkRvY3VtZW50TW91c2VNb3ZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHRpbWUgPSB2b2lkIDA7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cclxuICAgICAgLy8gQ2hyb21lIDYwKyBpcyAxIG1vdXNlbW92ZSBwZXIgYW5pbWF0aW9uIGZyYW1lLCB1c2UgMjBtcyB0aW1lIGRpZmZlcmVuY2VcclxuICAgICAgaWYgKG5vdyAtIHRpbWUgPCAyMCkge1xyXG4gICAgICAgIGJyb3dzZXIudXNpbmdUb3VjaCA9IGZhbHNlO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uRG9jdW1lbnRNb3VzZU1vdmUpO1xyXG4gICAgICAgIGlmICghYnJvd3Nlci5pT1MpIHtcclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgndGlwcHktdG91Y2gnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJvd3Nlci5vblVzZXJJbnB1dENoYW5nZSgnbW91c2UnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGltZSA9IG5vdztcclxuICAgIH07XHJcbiAgfSgpO1xyXG5cclxuICB2YXIgb25Eb2N1bWVudENsaWNrID0gZnVuY3Rpb24gb25Eb2N1bWVudENsaWNrKGV2ZW50KSB7XHJcbiAgICAvLyBTaW11bGF0ZWQgZXZlbnRzIGRpc3BhdGNoZWQgb24gdGhlIGRvY3VtZW50XHJcbiAgICBpZiAoIShldmVudC50YXJnZXQgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xyXG4gICAgICByZXR1cm4gaGlkZUFsbFBvcHBlcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVmZXJlbmNlID0gY2xvc2VzdChldmVudC50YXJnZXQsIHNlbGVjdG9ycy5SRUZFUkVOQ0UpO1xyXG4gICAgdmFyIHBvcHBlciA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBzZWxlY3RvcnMuUE9QUEVSKTtcclxuXHJcbiAgICBpZiAocG9wcGVyICYmIHBvcHBlci5fdGlwcHkgJiYgcG9wcGVyLl90aXBweS5vcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVmZXJlbmNlICYmIHJlZmVyZW5jZS5fdGlwcHkpIHtcclxuICAgICAgdmFyIG9wdGlvbnMgPSByZWZlcmVuY2UuX3RpcHB5Lm9wdGlvbnM7XHJcblxyXG4gICAgICB2YXIgaXNDbGlja1RyaWdnZXIgPSBvcHRpb25zLnRyaWdnZXIuaW5kZXhPZignY2xpY2snKSA+IC0xO1xyXG4gICAgICB2YXIgaXNNdWx0aXBsZSA9IG9wdGlvbnMubXVsdGlwbGU7XHJcblxyXG4gICAgICAvLyBIaWRlIGFsbCBwb3BwZXJzIGV4Y2VwdCB0aGUgb25lIGJlbG9uZ2luZyB0byB0aGUgZWxlbWVudCB0aGF0IHdhcyBjbGlja2VkXHJcbiAgICAgIGlmICghaXNNdWx0aXBsZSAmJiBicm93c2VyLnVzaW5nVG91Y2ggfHwgIWlzTXVsdGlwbGUgJiYgaXNDbGlja1RyaWdnZXIpIHtcclxuICAgICAgICByZXR1cm4gaGlkZUFsbFBvcHBlcnMocmVmZXJlbmNlLl90aXBweSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmhpZGVPbkNsaWNrICE9PSB0cnVlIHx8IGlzQ2xpY2tUcmlnZ2VyKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZUFsbFBvcHBlcnMoKTtcclxuICB9O1xyXG5cclxuICB2YXIgb25XaW5kb3dCbHVyID0gZnVuY3Rpb24gb25XaW5kb3dCbHVyKCkge1xyXG4gICAgdmFyIF9kb2N1bWVudCA9IGRvY3VtZW50LFxyXG4gICAgICAgIGVsID0gX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcblxyXG4gICAgaWYgKGVsICYmIGVsLmJsdXIgJiYgbWF0Y2hlcyQxLmNhbGwoZWwsIHNlbGVjdG9ycy5SRUZFUkVOQ0UpKSB7XHJcbiAgICAgIGVsLmJsdXIoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgb25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcclxuICAgIHRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMuUE9QUEVSKSkuZm9yRWFjaChmdW5jdGlvbiAocG9wcGVyKSB7XHJcbiAgICAgIHZhciB0aXBweUluc3RhbmNlID0gcG9wcGVyLl90aXBweTtcclxuICAgICAgaWYgKHRpcHB5SW5zdGFuY2UgJiYgIXRpcHB5SW5zdGFuY2Uub3B0aW9ucy5saXZlUGxhY2VtZW50KSB7XHJcbiAgICAgICAgdGlwcHlJbnN0YW5jZS5wb3BwZXJJbnN0YW5jZS5zY2hlZHVsZVVwZGF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uRG9jdW1lbnRDbGljayk7XHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uRG9jdW1lbnRUb3VjaCk7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvbldpbmRvd0JsdXIpO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSk7XHJcblxyXG4gIGlmICghYnJvd3Nlci5zdXBwb3J0c1RvdWNoICYmIChuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgfHwgbmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMpKSB7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIG9uRG9jdW1lbnRUb3VjaCk7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgZXZlbnRMaXN0ZW5lcnNCb3VuZCA9IGZhbHNlO1xyXG5cclxuLyoqXHJcbiAqIEV4cG9ydGVkIG1vZHVsZVxyXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fEVsZW1lbnRbXXxOb2RlTGlzdHxPYmplY3R9IHNlbGVjdG9yXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25lIC0gY3JlYXRlIG9uZSB0b29sdGlwXHJcbiAqIEByZXR1cm4ge09iamVjdH1cclxuICovXHJcbmZ1bmN0aW9uIHRpcHB5JDEoc2VsZWN0b3IsIG9wdGlvbnMsIG9uZSkge1xyXG4gIGlmIChicm93c2VyLnN1cHBvcnRlZCAmJiAhZXZlbnRMaXN0ZW5lcnNCb3VuZCkge1xyXG4gICAgYmluZEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICBldmVudExpc3RlbmVyc0JvdW5kID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGlmIChpc09iamVjdExpdGVyYWwoc2VsZWN0b3IpKSB7XHJcbiAgICBwb2x5ZmlsbFZpcnR1YWxSZWZlcmVuY2VQcm9wcyhzZWxlY3Rvcik7XHJcbiAgfVxyXG5cclxuICBvcHRpb25zID0gX2V4dGVuZHMoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgdmFyIHJlZmVyZW5jZXMgPSBnZXRBcnJheU9mRWxlbWVudHMoc2VsZWN0b3IpO1xyXG4gIHZhciBmaXJzdFJlZmVyZW5jZSA9IHJlZmVyZW5jZXNbMF07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXHJcbiAgICBvcHRpb25zOiBvcHRpb25zLFxyXG4gICAgdG9vbHRpcHM6IGJyb3dzZXIuc3VwcG9ydGVkID8gY3JlYXRlVG9vbHRpcHMob25lICYmIGZpcnN0UmVmZXJlbmNlID8gW2ZpcnN0UmVmZXJlbmNlXSA6IHJlZmVyZW5jZXMsIG9wdGlvbnMpIDogW10sXHJcbiAgICBkZXN0cm95QWxsOiBmdW5jdGlvbiBkZXN0cm95QWxsKCkge1xyXG4gICAgICB0aGlzLnRvb2x0aXBzLmZvckVhY2goZnVuY3Rpb24gKHRvb2x0aXApIHtcclxuICAgICAgICByZXR1cm4gdG9vbHRpcC5kZXN0cm95KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLnRvb2x0aXBzID0gW107XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxudGlwcHkkMS52ZXJzaW9uID0gdmVyc2lvbjtcclxudGlwcHkkMS5icm93c2VyID0gYnJvd3NlcjtcclxudGlwcHkkMS5kZWZhdWx0cyA9IGRlZmF1bHRzO1xyXG50aXBweSQxLm9uZSA9IGZ1bmN0aW9uIChzZWxlY3Rvciwgb3B0aW9ucykge1xyXG4gIHJldHVybiB0aXBweSQxKHNlbGVjdG9yLCBvcHRpb25zLCB0cnVlKS50b29sdGlwc1swXTtcclxufTtcclxudGlwcHkkMS5kaXNhYmxlQW5pbWF0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICBkZWZhdWx0cy51cGRhdGVEdXJhdGlvbiA9IGRlZmF1bHRzLmR1cmF0aW9uID0gMDtcclxuICBkZWZhdWx0cy5hbmltYXRlRmlsbCA9IGZhbHNlO1xyXG59O1xyXG5cclxucmV0dXJuIHRpcHB5JDE7XHJcblxyXG59KSkpO1xyXG4iXX0=
