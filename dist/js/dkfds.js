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

        this.targetEl.style.left = null;
        this.targetEl.style.right = null;

        var rect = this.triggerEl.getBoundingClientRect();
        console.log(rect.left);
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

          var offset = this.offset(this.targetEl);

          if (offset.left < 0) {
            console.log('Out of bounds: LEFT');
            this.targetEl.style.left = '0px';
            this.targetEl.style.right = 'auto';
          }
          var right = offset.left + this.targetEl.offsetWidth;
          console.log(right);
          if (right > window.innerWidth) {
            console.log('Out of bounds: RIGHT');
            this.targetEl.style.left = 'auto';
            this.targetEl.style.right = '0px';
          }

          var offsetAgain = this.offset(this.targetEl);

          if (offsetAgain.left < 0) {
            console.log('Out of bounds: LEFT');

            this.targetEl.style.left = '0px';
            this.targetEl.style.right = 'auto';
          }
          right = offsetAgain.left + this.targetEl.offsetWidth;
          if (right > window.innerWidth) {
            console.log('Out of bounds: RIGHT');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZmlsdGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FycmF5LWZvcmVhY2gvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY2xhc3NsaXN0LXBvbHlmaWxsL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL2FycmF5L2Zyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9mbi9vYmplY3QvYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lvYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdwby5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1rZXlzLWludGVybmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtcGllLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2hhcmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tYWJzb2x1dGUtaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3VpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvZG9tcmVhZHkvcmVhZHkuanMiLCJub2RlX21vZHVsZXMvZWxlbWVudC1jbG9zZXN0L2VsZW1lbnQtY2xvc2VzdC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2JlaGF2aW9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2NvbXBvc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvZGVsZWdhdGVBbGwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvZGVsZWdhdGUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3Ivb25jZS9pbmRleC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2NoZWNrYm94LXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY29sbGFwc2UuanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbW9kYWwuanMiLCJzcmMvanMvY29tcG9uZW50cy9uYXZpZ2F0aW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmFkaW8tdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9yZWdleC1pbnB1dC1tYXNrLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvc2tpcG5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYmxlLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9vbHRpcC5qcyIsInNyYy9qcy9jb25maWcuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvZXZlbnRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9lbGVtZW50LWhpZGRlbi5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvaW5kZXguanMiLCJzcmMvanMvdXRpbHMvYmVoYXZpb3IuanMiLCJzcmMvanMvdXRpbHMvY2xvc2VzdC5qcyIsInNyYy9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInNyYy9qcy91dGlscy9zZWxlY3QuanMiLCJzcmMvanMvdXRpbHMvdG9nZ2xlLmpzIiwic3JjL3ZlbmRvci9taWNyb21vZGFsLmpzIiwic3JjL3ZlbmRvci90aXBweWpzL3RpcHB5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTs7Ozs7Ozs7OztBQVVBLE9BQU8sT0FBUCxHQUFpQixVQUFVLEdBQVYsRUFBZSxFQUFmLEVBQW1CLElBQW5CLEVBQXlCO0FBQ3hDLE1BQUksSUFBSSxNQUFSLEVBQWdCLE9BQU8sSUFBSSxNQUFKLENBQVcsRUFBWCxFQUFlLElBQWYsQ0FBUDtBQUNoQixNQUFJLEtBQUssQ0FBTCxLQUFXLEdBQVgsSUFBa0IsU0FBUyxHQUEvQixFQUFvQyxNQUFNLElBQUksU0FBSixFQUFOO0FBQ3BDLE1BQUksY0FBYyxPQUFPLEVBQXpCLEVBQTZCLE1BQU0sSUFBSSxTQUFKLEVBQU47QUFDN0IsTUFBSSxNQUFNLEVBQVY7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksSUFBSSxNQUF4QixFQUFnQyxHQUFoQyxFQUFxQztBQUNuQyxRQUFJLENBQUMsT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixDQUFqQixDQUFMLEVBQTBCO0FBQzFCLFFBQUksTUFBTSxJQUFJLENBQUosQ0FBVjtBQUNBLFFBQUksR0FBRyxJQUFILENBQVEsSUFBUixFQUFjLEdBQWQsRUFBbUIsQ0FBbkIsRUFBc0IsR0FBdEIsQ0FBSixFQUFnQyxJQUFJLElBQUosQ0FBUyxHQUFUO0FBQ2pDO0FBQ0QsU0FBTyxHQUFQO0FBQ0QsQ0FYRDs7QUFhQSxJQUFJLFNBQVMsT0FBTyxTQUFQLENBQWlCLGNBQTlCOzs7QUN4QkE7Ozs7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Y0FBUCxHQUF3QixDQUFDLGNBQUQsQ0FBeEIsR0FBMkMsVUFBMUQsRUFBc0UsT0FBdEUsQ0FBcEIsR0FBcUcsRUFIMUc7QUFJTCxrQkFBWSxTQUFTLFVBQVQsR0FBc0I7QUFDaEMsYUFBSyxRQUFMLENBQWMsT0FBZCxDQUFzQixVQUFVLE9BQVYsRUFBbUI7QUFDdkMsaUJBQU8sUUFBUSxPQUFSLEVBQVA7QUFDRCxTQUZEO0FBR0EsYUFBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0Q7QUFUSSxLQUFQO0FBV0Q7O0FBRUQsVUFBUSxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsVUFBUSxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsVUFBUSxRQUFSLEdBQW1CLFFBQW5CO0FBQ0EsVUFBUSxHQUFSLEdBQWMsVUFBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCO0FBQ3pDLFdBQU8sUUFBUSxRQUFSLEVBQWtCLE9BQWxCLEVBQTJCLElBQTNCLEVBQWlDLFFBQWpDLENBQTBDLENBQTFDLENBQVA7QUFDRCxHQUZEO0FBR0EsVUFBUSxpQkFBUixHQUE0QixZQUFZO0FBQ3RDLGFBQVMsY0FBVCxHQUEwQixTQUFTLFFBQVQsR0FBb0IsQ0FBOUM7QUFDQSxhQUFTLFdBQVQsR0FBdUIsS0FBdkI7QUFDRCxHQUhEOztBQUtBLFNBQU8sT0FBUDtBQUVDLENBN3BJQSxDQUFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXG4vKipcbiAqIEFycmF5I2ZpbHRlci5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge09iamVjdD19IHNlbGZcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQHRocm93IFR5cGVFcnJvclxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyciwgZm4sIHNlbGYpIHtcbiAgaWYgKGFyci5maWx0ZXIpIHJldHVybiBhcnIuZmlsdGVyKGZuLCBzZWxmKTtcbiAgaWYgKHZvaWQgMCA9PT0gYXJyIHx8IG51bGwgPT09IGFycikgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgaWYgKCdmdW5jdGlvbicgIT0gdHlwZW9mIGZuKSB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICB2YXIgcmV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFoYXNPd24uY2FsbChhcnIsIGkpKSBjb250aW51ZTtcbiAgICB2YXIgdmFsID0gYXJyW2ldO1xuICAgIGlmIChmbi5jYWxsKHNlbGYsIHZhbCwgaSwgYXJyKSkgcmV0LnB1c2godmFsKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4iLCIvKipcbiAqIGFycmF5LWZvcmVhY2hcbiAqICAgQXJyYXkjZm9yRWFjaCBwb255ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnNcbiAqICAgKFBvbnlmaWxsOiBBIHBvbHlmaWxsIHRoYXQgZG9lc24ndCBvdmVyd3JpdGUgdGhlIG5hdGl2ZSBtZXRob2QpXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LTIwMTYgVGFrdXRvIFdhZGFcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2gvYmxvYi9tYXN0ZXIvTUlULUxJQ0VOU0VcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2ggKGFyeSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBpZiAoYXJ5LmZvckVhY2gpIHtcbiAgICAgICAgYXJ5LmZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSs9MSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGFyeVtpXSwgaSwgYXJ5KTtcbiAgICB9XG59O1xuIiwiLypcbiAqIGNsYXNzTGlzdC5qczogQ3Jvc3MtYnJvd3NlciBmdWxsIGVsZW1lbnQuY2xhc3NMaXN0IGltcGxlbWVudGF0aW9uLlxuICogMS4xLjIwMTcwNDI3XG4gKlxuICogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxuICogTGljZW5zZTogRGVkaWNhdGVkIHRvIHRoZSBwdWJsaWMgZG9tYWluLlxuICogICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG4vKmdsb2JhbCBzZWxmLCBkb2N1bWVudCwgRE9NRXhjZXB0aW9uICovXG5cbi8qISBAc291cmNlIGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvY2xhc3NMaXN0LmpzICovXG5cbmlmIChcImRvY3VtZW50XCIgaW4gd2luZG93LnNlbGYpIHtcblxuLy8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxuLy8gSW5jbHVkaW5nIElFIDwgRWRnZSBtaXNzaW5nIFNWR0VsZW1lbnQuY2xhc3NMaXN0XG5pZiAoIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpKSBcblx0fHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKSkpIHtcblxuKGZ1bmN0aW9uICh2aWV3KSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5pZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcblxudmFyXG5cdCAgY2xhc3NMaXN0UHJvcCA9IFwiY2xhc3NMaXN0XCJcblx0LCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG5cdCwgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF1cblx0LCBvYmpDdHIgPSBPYmplY3Rcblx0LCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIik7XG5cdH1cblx0LCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIGkgPSAwXG5cdFx0XHQsIGxlbiA9IHRoaXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cdC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xuXHQsIERPTUV4ID0gZnVuY3Rpb24gKHR5cGUsIG1lc3NhZ2UpIHtcblx0XHR0aGlzLm5hbWUgPSB0eXBlO1xuXHRcdHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9XG5cdCwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcblx0XHRpZiAodG9rZW4gPT09IFwiXCIpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIlNZTlRBWF9FUlJcIlxuXHRcdFx0XHQsIFwiQW4gaW52YWxpZCBvciBpbGxlZ2FsIHN0cmluZyB3YXMgc3BlY2lmaWVkXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCJcblx0XHRcdFx0LCBcIlN0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3RlclwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xuXHR9XG5cdCwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxuXHRcdFx0LCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cblx0XHRcdCwgaSA9IDBcblx0XHRcdCwgbGVuID0gY2xhc3Nlcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0dGhpcy5wdXNoKGNsYXNzZXNbaV0pO1xuXHRcdH1cblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMudG9TdHJpbmcoKSk7XG5cdFx0fTtcblx0fVxuXHQsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxuXHQsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IENsYXNzTGlzdCh0aGlzKTtcblx0fVxuO1xuLy8gTW9zdCBET01FeGNlcHRpb24gaW1wbGVtZW50YXRpb25zIGRvbid0IGFsbG93IGNhbGxpbmcgRE9NRXhjZXB0aW9uJ3MgdG9TdHJpbmcoKVxuLy8gb24gbm9uLURPTUV4Y2VwdGlvbnMuIEVycm9yJ3MgdG9TdHJpbmcoKSBpcyBzdWZmaWNpZW50IGhlcmUuXG5ET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcbmNsYXNzTGlzdFByb3RvLml0ZW0gPSBmdW5jdGlvbiAoaSkge1xuXHRyZXR1cm4gdGhpc1tpXSB8fCBudWxsO1xufTtcbmNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cdHJldHVybiBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pICE9PSAtMTtcbn07XG5jbGFzc0xpc3RQcm90by5hZGQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xuXHRcdFx0dGhpcy5wdXNoKHRva2VuKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHRcdCwgaW5kZXhcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR3aGlsZSAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHR0aGlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cblx0dmFyXG5cdFx0ICByZXN1bHQgPSB0aGlzLmNvbnRhaW5zKHRva2VuKVxuXHRcdCwgbWV0aG9kID0gcmVzdWx0ID9cblx0XHRcdGZvcmNlICE9PSB0cnVlICYmIFwicmVtb3ZlXCJcblx0XHQ6XG5cdFx0XHRmb3JjZSAhPT0gZmFsc2UgJiYgXCJhZGRcIlxuXHQ7XG5cblx0aWYgKG1ldGhvZCkge1xuXHRcdHRoaXNbbWV0aG9kXSh0b2tlbik7XG5cdH1cblxuXHRpZiAoZm9yY2UgPT09IHRydWUgfHwgZm9yY2UgPT09IGZhbHNlKSB7XG5cdFx0cmV0dXJuIGZvcmNlO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiAhcmVzdWx0O1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmpvaW4oXCIgXCIpO1xufTtcblxuaWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xuXHR2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XG5cdFx0ICBnZXQ6IGNsYXNzTGlzdEdldHRlclxuXHRcdCwgZW51bWVyYWJsZTogdHJ1ZVxuXHRcdCwgY29uZmlndXJhYmxlOiB0cnVlXG5cdH07XG5cdHRyeSB7XG5cdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHR9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcblx0XHQvLyBhZGRpbmcgdW5kZWZpbmVkIHRvIGZpZ2h0IHRoaXMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2lzc3Vlcy8zNlxuXHRcdC8vIG1vZGVybmllIElFOC1NU1c3IG1hY2hpbmUgaGFzIElFOCA4LjAuNjAwMS4xODcwMiBhbmQgaXMgYWZmZWN0ZWRcblx0XHRpZiAoZXgubnVtYmVyID09PSB1bmRlZmluZWQgfHwgZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xuXHRcdFx0Y2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuXHRcdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHRcdH1cblx0fVxufSBlbHNlIGlmIChvYmpDdHJbcHJvdG9Qcm9wXS5fX2RlZmluZUdldHRlcl9fKSB7XG5cdGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XG59XG5cbn0od2luZG93LnNlbGYpKTtcblxufVxuXG4vLyBUaGVyZSBpcyBmdWxsIG9yIHBhcnRpYWwgbmF0aXZlIGNsYXNzTGlzdCBzdXBwb3J0LCBzbyBqdXN0IGNoZWNrIGlmIHdlIG5lZWRcbi8vIHRvIG5vcm1hbGl6ZSB0aGUgYWRkL3JlbW92ZSBhbmQgdG9nZ2xlIEFQSXMuXG5cbihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpO1xuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjMVwiLCBcImMyXCIpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMC8xMSBhbmQgRmlyZWZveCA8MjYsIHdoZXJlIGNsYXNzTGlzdC5hZGQgYW5kXG5cdC8vIGNsYXNzTGlzdC5yZW1vdmUgZXhpc3QgYnV0IHN1cHBvcnQgb25seSBvbmUgYXJndW1lbnQgYXQgYSB0aW1lLlxuXHRpZiAoIXRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMyXCIpKSB7XG5cdFx0dmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdO1xuXG5cdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih0b2tlbikge1xuXHRcdFx0XHR2YXIgaSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0XHR0b2tlbiA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdFx0XHRvcmlnaW5hbC5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdGNyZWF0ZU1ldGhvZCgnYWRkJyk7XG5cdFx0Y3JlYXRlTWV0aG9kKCdyZW1vdmUnKTtcblx0fVxuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJjM1wiLCBmYWxzZSk7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwIGFuZCBGaXJlZm94IDwyNCwgd2hlcmUgY2xhc3NMaXN0LnRvZ2dsZSBkb2VzIG5vdFxuXHQvLyBzdXBwb3J0IHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdGlmICh0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjM1wiKSkge1xuXHRcdHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XG5cblx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKHRva2VuLCBmb3JjZSkge1xuXHRcdFx0aWYgKDEgaW4gYXJndW1lbnRzICYmICF0aGlzLmNvbnRhaW5zKHRva2VuKSA9PT0gIWZvcmNlKSB7XG5cdFx0XHRcdHJldHVybiBmb3JjZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBfdG9nZ2xlLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fVxuXG5cdHRlc3RFbGVtZW50ID0gbnVsbDtcbn0oKSk7XG5cbn1cbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuQXJyYXkuZnJvbTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5hc3NpZ247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjUuNycgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBpbmRleCwgdmFsdWUpIHtcbiAgaWYgKGluZGV4IGluIG9iamVjdCkgJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV07XG4gIHZhciBleHBvcnRzID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XG4gIHZhciBleHBQcm90byA9IGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pO1xuICB2YXIga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZiAoSVNfR0xPQkFMKSBzb3VyY2UgPSBuYW1lO1xuICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGV4cCA9IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICBpZiAodGFyZ2V0KSByZWRlZmluZSh0YXJnZXQsIGtleSwgb3V0LCB0eXBlICYgJGV4cG9ydC5VKTtcbiAgICAvLyBleHBvcnRcbiAgICBpZiAoZXhwb3J0c1trZXldICE9IG91dCkgaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYgKElTX1BST1RPICYmIGV4cFByb3RvW2tleV0gIT0gb3V0KSBleHBQcm90b1trZXldID0gb3V0O1xuICB9XG59O1xuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTtcbiIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyICRpdGVyQ3JlYXRlID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBCVUdHWSA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKTsgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxudmFyIEZGX0lURVJBVE9SID0gJ0BAaXRlcmF0b3InO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgaWYgKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKSByZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgdmFyIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFUztcbiAgdmFyIFZBTFVFU19CVUcgPSBmYWxzZTtcbiAgdmFyIHByb3RvID0gQmFzZS5wcm90b3R5cGU7XG4gIHZhciAkbmF0aXZlID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdO1xuICB2YXIgJGRlZmF1bHQgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKTtcbiAgdmFyICRlbnRyaWVzID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZDtcbiAgdmFyICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlO1xuICB2YXIgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZiAoJGFueU5hdGl2ZSkge1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUgJiYgSXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmICghTElCUkFSWSAmJiB0eXBlb2YgSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdICE9ICdmdW5jdGlvbicpIGhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSkge1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gPSByZXR1cm5UaGlzO1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChrZXkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKCEoa2V5IGluIHByb3RvKSkgcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcbiIsInZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uICgpIHsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRocm93LWxpdGVyYWxcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjLCBza2lwQ2xvc2luZykge1xuICBpZiAoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gWzddO1xuICAgIHZhciBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgZG9uZTogc2FmZSA9IHRydWUgfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyICRhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgUyA9IFN5bWJvbCgpO1xuICB2YXIgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUID0gdG9PYmplY3QodGFyZ2V0KTtcbiAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAxO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgdmFyIGlzRW51bSA9IHBJRS5mO1xuICB3aGlsZSAoYUxlbiA+IGluZGV4KSB7XG4gICAgdmFyIFMgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgdmFyIGtleXMgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikgaWYgKGlzRW51bS5jYWxsKFMsIGtleSA9IGtleXNbaisrXSkpIFRba2V5XSA9IFNba2V5XTtcbiAgfSByZXR1cm4gVDtcbn0gOiAkYXNzaWduO1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IGdldEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgUDtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFNSQyA9IHJlcXVpcmUoJy4vX3VpZCcpKCdzcmMnKTtcbnZhciBUT19TVFJJTkcgPSAndG9TdHJpbmcnO1xudmFyICR0b1N0cmluZyA9IEZ1bmN0aW9uW1RPX1NUUklOR107XG52YXIgVFBMID0gKCcnICsgJHRvU3RyaW5nKS5zcGxpdChUT19TVFJJTkcpO1xuXG5yZXF1aXJlKCcuL19jb3JlJykuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsLCBzYWZlKSB7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgJ25hbWUnKSB8fCBoaWRlKHZhbCwgJ25hbWUnLCBrZXkpO1xuICBpZiAoT1trZXldID09PSB2YWwpIHJldHVybjtcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsIFNSQykgfHwgaGlkZSh2YWwsIFNSQywgT1trZXldID8gJycgKyBPW2tleV0gOiBUUEwuam9pbihTdHJpbmcoa2V5KSkpO1xuICBpZiAoTyA9PT0gZ2xvYmFsKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKCFzYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfSBlbHNlIGlmIChPW2tleV0pIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzW1NSQ10gfHwgJHRvU3RyaW5nLmNhbGwodGhpcyk7XG59KTtcbiIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgdGFnLCBzdGF0KSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSBkZWYoaXQsIFRBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWcgfSk7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246IGNvcmUudmVyc2lvbixcbiAgbW9kZTogcmVxdWlyZSgnLi9fbGlicmFyeScpID8gJ3B1cmUnIDogJ2dsb2JhbCcsXG4gIGNvcHlyaWdodDogJ8KpIDIwMTggRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknXG59KTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikgeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgbWFwZm4gPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYgKG1hcHBpbmcpIG1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYgKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDKCk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvciAocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHsgYXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJykgfSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIi8qIVxuICAqIGRvbXJlYWR5IChjKSBEdXN0aW4gRGlheiAyMDE0IC0gTGljZW5zZSBNSVRcbiAgKi9cbiFmdW5jdGlvbiAobmFtZSwgZGVmaW5pdGlvbikge1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIHRoaXNbbmFtZV0gPSBkZWZpbml0aW9uKClcblxufSgnZG9tcmVhZHknLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGZucyA9IFtdLCBsaXN0ZW5lclxuICAgICwgZG9jID0gZG9jdW1lbnRcbiAgICAsIGhhY2sgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsXG4gICAgLCBkb21Db250ZW50TG9hZGVkID0gJ0RPTUNvbnRlbnRMb2FkZWQnXG4gICAgLCBsb2FkZWQgPSAoaGFjayA/IC9ebG9hZGVkfF5jLyA6IC9ebG9hZGVkfF5pfF5jLykudGVzdChkb2MucmVhZHlTdGF0ZSlcblxuXG4gIGlmICghbG9hZGVkKVxuICBkb2MuYWRkRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lcilcbiAgICBsb2FkZWQgPSAxXG4gICAgd2hpbGUgKGxpc3RlbmVyID0gZm5zLnNoaWZ0KCkpIGxpc3RlbmVyKClcbiAgfSlcblxuICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgbG9hZGVkID8gc2V0VGltZW91dChmbiwgMCkgOiBmbnMucHVzaChmbilcbiAgfVxuXG59KTtcbiIsIi8vIGVsZW1lbnQtY2xvc2VzdCB8IENDMC0xLjAgfCBnaXRodWIuY29tL2pvbmF0aGFudG5lYWwvY2xvc2VzdFxuXG4oZnVuY3Rpb24gKEVsZW1lbnRQcm90bykge1xuXHRpZiAodHlwZW9mIEVsZW1lbnRQcm90by5tYXRjaGVzICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0RWxlbWVudFByb3RvLm1hdGNoZXMgPSBFbGVtZW50UHJvdG8ubXNNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudFByb3RvLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50UHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGZ1bmN0aW9uIG1hdGNoZXMoc2VsZWN0b3IpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gdGhpcztcblx0XHRcdHZhciBlbGVtZW50cyA9IChlbGVtZW50LmRvY3VtZW50IHx8IGVsZW1lbnQub3duZXJEb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdFx0XHR2YXIgaW5kZXggPSAwO1xuXG5cdFx0XHR3aGlsZSAoZWxlbWVudHNbaW5kZXhdICYmIGVsZW1lbnRzW2luZGV4XSAhPT0gZWxlbWVudCkge1xuXHRcdFx0XHQrK2luZGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gQm9vbGVhbihlbGVtZW50c1tpbmRleF0pO1xuXHRcdH07XG5cdH1cblxuXHRpZiAodHlwZW9mIEVsZW1lbnRQcm90by5jbG9zZXN0ICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0RWxlbWVudFByb3RvLmNsb3Nlc3QgPSBmdW5jdGlvbiBjbG9zZXN0KHNlbGVjdG9yKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IHRoaXM7XG5cblx0XHRcdHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IDEpIHtcblx0XHRcdFx0aWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH07XG5cdH1cbn0pKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSk7XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuY29uc3QgZGVsZWdhdGUgPSByZXF1aXJlKCcuLi9kZWxlZ2F0ZScpO1xuY29uc3QgZGVsZWdhdGVBbGwgPSByZXF1aXJlKCcuLi9kZWxlZ2F0ZUFsbCcpO1xuXG5jb25zdCBERUxFR0FURV9QQVRURVJOID0gL14oLispOmRlbGVnYXRlXFwoKC4rKVxcKSQvO1xuY29uc3QgU1BBQ0UgPSAnICc7XG5cbmNvbnN0IGdldExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgdmFyIG1hdGNoID0gdHlwZS5tYXRjaChERUxFR0FURV9QQVRURVJOKTtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAobWF0Y2gpIHtcbiAgICB0eXBlID0gbWF0Y2hbMV07XG4gICAgc2VsZWN0b3IgPSBtYXRjaFsyXTtcbiAgfVxuXG4gIHZhciBvcHRpb25zO1xuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGNhcHR1cmU6IHBvcEtleShoYW5kbGVyLCAnY2FwdHVyZScpLFxuICAgICAgcGFzc2l2ZTogcG9wS2V5KGhhbmRsZXIsICdwYXNzaXZlJylcbiAgICB9O1xuICB9XG5cbiAgdmFyIGxpc3RlbmVyID0ge1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICBkZWxlZ2F0ZTogKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0JylcbiAgICAgID8gZGVsZWdhdGVBbGwoaGFuZGxlcilcbiAgICAgIDogc2VsZWN0b3JcbiAgICAgICAgPyBkZWxlZ2F0ZShzZWxlY3RvciwgaGFuZGxlcilcbiAgICAgICAgOiBoYW5kbGVyLFxuICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgfTtcblxuICBpZiAodHlwZS5pbmRleE9mKFNQQUNFKSA+IC0xKSB7XG4gICAgcmV0dXJuIHR5cGUuc3BsaXQoU1BBQ0UpLm1hcChmdW5jdGlvbihfdHlwZSkge1xuICAgICAgcmV0dXJuIGFzc2lnbih7dHlwZTogX3R5cGV9LCBsaXN0ZW5lcik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdGVuZXIudHlwZSA9IHR5cGU7XG4gICAgcmV0dXJuIFtsaXN0ZW5lcl07XG4gIH1cbn07XG5cbnZhciBwb3BLZXkgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgZGVsZXRlIG9ialtrZXldO1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJlaGF2aW9yKGV2ZW50cywgcHJvcHMpIHtcbiAgY29uc3QgbGlzdGVuZXJzID0gT2JqZWN0LmtleXMoZXZlbnRzKVxuICAgIC5yZWR1Y2UoZnVuY3Rpb24obWVtbywgdHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycyA9IGdldExpc3RlbmVycyh0eXBlLCBldmVudHNbdHlwZV0pO1xuICAgICAgcmV0dXJuIG1lbW8uY29uY2F0KGxpc3RlbmVycyk7XG4gICAgfSwgW10pO1xuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIGFkZDogZnVuY3Rpb24gYWRkQmVoYXZpb3IoZWxlbWVudCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGxpc3RlbmVyLnR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIuZGVsZWdhdGUsXG4gICAgICAgICAgbGlzdGVuZXIub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZUJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgcHJvcHMpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcG9zZShmdW5jdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25zLnNvbWUoZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpID09PSBmYWxzZTtcbiAgICB9LCB0aGlzKTtcbiAgfTtcbn07XG4iLCJjb25zdCBkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4uL2RlbGVnYXRlJyk7XG5jb25zdCBjb21wb3NlID0gcmVxdWlyZSgnLi4vY29tcG9zZScpO1xuXG5jb25zdCBTUExBVCA9ICcqJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZUFsbChzZWxlY3RvcnMpIHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHNlbGVjdG9ycylcblxuICAvLyBYWFggb3B0aW1pemF0aW9uOiBpZiB0aGVyZSBpcyBvbmx5IG9uZSBoYW5kbGVyIGFuZCBpdCBhcHBsaWVzIHRvXG4gIC8vIGFsbCBlbGVtZW50cyAodGhlIFwiKlwiIENTUyBzZWxlY3RvciksIHRoZW4ganVzdCByZXR1cm4gdGhhdFxuICAvLyBoYW5kbGVyXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMSAmJiBrZXlzWzBdID09PSBTUExBVCkge1xuICAgIHJldHVybiBzZWxlY3RvcnNbU1BMQVRdO1xuICB9XG5cbiAgY29uc3QgZGVsZWdhdGVzID0ga2V5cy5yZWR1Y2UoZnVuY3Rpb24obWVtbywgc2VsZWN0b3IpIHtcbiAgICBtZW1vLnB1c2goZGVsZWdhdGUoc2VsZWN0b3IsIHNlbGVjdG9yc1tzZWxlY3Rvcl0pKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfSwgW10pO1xuICByZXR1cm4gY29tcG9zZShkZWxlZ2F0ZXMpO1xufTtcbiIsIi8vIHBvbHlmaWxsIEVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3RcbnJlcXVpcmUoJ2VsZW1lbnQtY2xvc2VzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlKHNlbGVjdG9yLCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZGVsZWdhdGlvbihldmVudCkge1xuICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdChzZWxlY3Rvcik7XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGFyZ2V0LCBldmVudCk7XG4gICAgfVxuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbmNlKGxpc3RlbmVyLCBvcHRpb25zKSB7XG4gIHZhciB3cmFwcGVkID0gZnVuY3Rpb24gd3JhcHBlZE9uY2UoZSkge1xuICAgIGUuY3VycmVudFRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGUudHlwZSwgd3JhcHBlZCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIGxpc3RlbmVyLmNhbGwodGhpcywgZSk7XG4gIH07XG4gIHJldHVybiB3cmFwcGVkO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XHJcbmNvbnN0IGZpbHRlciA9IHJlcXVpcmUoJ2FycmF5LWZpbHRlcicpO1xyXG5jb25zdCBmb3JFYWNoID0gcmVxdWlyZSgnYXJyYXktZm9yZWFjaCcpO1xyXG5jb25zdCB0b2dnbGUgPSByZXF1aXJlKCcuLi91dGlscy90b2dnbGUnKTtcclxuY29uc3QgaXNFbGVtZW50SW5WaWV3cG9ydCA9IHJlcXVpcmUoJy4uL3V0aWxzL2lzLWluLXZpZXdwb3J0Jyk7XHJcblxyXG5jb25zdCBDTElDSyA9IHJlcXVpcmUoJy4uL2V2ZW50cycpLkNMSUNLO1xyXG5jb25zdCBQUkVGSVggPSByZXF1aXJlKCcuLi9jb25maWcnKS5wcmVmaXg7XHJcblxyXG4vLyBYWFggbWF0Y2ggLmFjY29yZGlvbiBhbmQgLmFjY29yZGlvbi1ib3JkZXJlZFxyXG5jb25zdCBBQ0NPUkRJT04gPSBgLiR7UFJFRklYfWFjY29yZGlvbiwgLiR7UFJFRklYfWFjY29yZGlvbi1ib3JkZXJlZGA7XHJcbmNvbnN0IEJVVFRPTiA9IGAuJHtQUkVGSVh9YWNjb3JkaW9uLWJ1dHRvblthcmlhLWNvbnRyb2xzXWA7XHJcbmNvbnN0IEVYUEFOREVEID0gJ2FyaWEtZXhwYW5kZWQnO1xyXG5jb25zdCBNVUxUSVNFTEVDVEFCTEUgPSAnYXJpYS1tdWx0aXNlbGVjdGFibGUnO1xyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSBhIGJ1dHRvbidzIFwicHJlc3NlZFwiIHN0YXRlLCBvcHRpb25hbGx5IHByb3ZpZGluZyBhIHRhcmdldFxyXG4gKiBzdGF0ZS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGV4cGFuZGVkIElmIG5vIHN0YXRlIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudFxyXG4gKiBzdGF0ZSB3aWxsIGJlIHRvZ2dsZWQgKGZyb20gZmFsc2UgdG8gdHJ1ZSwgYW5kIHZpY2UtdmVyc2EpLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0aGUgcmVzdWx0aW5nIHN0YXRlXHJcbiAqL1xyXG5jb25zdCB0b2dnbGVCdXR0b24gPSAoYnV0dG9uLCBleHBhbmRlZCkgPT4ge1xyXG4gIHZhciBhY2NvcmRpb24gPSBidXR0b24uY2xvc2VzdChBQ0NPUkRJT04pO1xyXG4gIGlmICghYWNjb3JkaW9uKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7QlVUVE9OfSBpcyBtaXNzaW5nIG91dGVyICR7QUNDT1JESU9OfWApO1xyXG4gIH1cclxuXHJcbiAgZXhwYW5kZWQgPSB0b2dnbGUoYnV0dG9uLCBleHBhbmRlZCk7XHJcbiAgLy8gWFhYIG11bHRpc2VsZWN0YWJsZSBpcyBvcHQtaW4sIHRvIHByZXNlcnZlIGxlZ2FjeSBiZWhhdmlvclxyXG4gIGNvbnN0IG11bHRpc2VsZWN0YWJsZSA9IGFjY29yZGlvbi5nZXRBdHRyaWJ1dGUoTVVMVElTRUxFQ1RBQkxFKSA9PT0gJ3RydWUnO1xyXG5cclxuICBpZiAoZXhwYW5kZWQgJiYgIW11bHRpc2VsZWN0YWJsZSkge1xyXG4gICAgZm9yRWFjaChnZXRBY2NvcmRpb25CdXR0b25zKGFjY29yZGlvbiksIG90aGVyID0+IHtcclxuICAgICAgaWYgKG90aGVyICE9PSBidXR0b24pIHtcclxuICAgICAgICB0b2dnbGUob3RoZXIsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlXHJcbiAqL1xyXG5jb25zdCBzaG93QnV0dG9uID0gYnV0dG9uID0+IHRvZ2dsZUJ1dHRvbihidXR0b24sIHRydWUpO1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxyXG4gKiBAcmV0dXJuIHtib29sZWFufSBmYWxzZVxyXG4gKi9cclxuY29uc3QgaGlkZUJ1dHRvbiA9IGJ1dHRvbiA9PiB0b2dnbGVCdXR0b24oYnV0dG9uLCBmYWxzZSk7XHJcblxyXG4vKipcclxuICogR2V0IGFuIEFycmF5IG9mIGJ1dHRvbiBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXHJcbiAqIGFjY29yZGlvbiBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBhY2NvcmRpb25cclxuICogQHJldHVybiB7YXJyYXk8SFRNTEJ1dHRvbkVsZW1lbnQ+fVxyXG4gKi9cclxuY29uc3QgZ2V0QWNjb3JkaW9uQnV0dG9ucyA9IGFjY29yZGlvbiA9PiB7XHJcbiAgcmV0dXJuIGZpbHRlcihhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pLCBidXR0b24gPT4ge1xyXG4gICAgcmV0dXJuIGJ1dHRvbi5jbG9zZXN0KEFDQ09SRElPTikgPT09IGFjY29yZGlvbjtcclxuICB9KTtcclxufTtcclxuXHJcbmNvbnN0IGFjY29yZGlvbiA9IGJlaGF2aW9yKHtcclxuICBbIENMSUNLIF06IHtcclxuICAgIFsgQlVUVE9OIF06IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB0b2dnbGVCdXR0b24odGhpcyk7XHJcblxyXG4gICAgICBpZiAodGhpcy5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSAndHJ1ZScpIHtcclxuICAgICAgICAvLyBXZSB3ZXJlIGp1c3QgZXhwYW5kZWQsIGJ1dCBpZiBhbm90aGVyIGFjY29yZGlvbiB3YXMgYWxzbyBqdXN0XHJcbiAgICAgICAgLy8gY29sbGFwc2VkLCB3ZSBtYXkgbm8gbG9uZ2VyIGJlIGluIHRoZSB2aWV3cG9ydC4gVGhpcyBlbnN1cmVzXHJcbiAgICAgICAgLy8gdGhhdCB3ZSBhcmUgc3RpbGwgdmlzaWJsZSwgc28gdGhlIHVzZXIgaXNuJ3QgY29uZnVzZWQuXHJcbiAgICAgICAgaWYgKCFpc0VsZW1lbnRJblZpZXdwb3J0KHRoaXMpKSB0aGlzLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxufSwge1xyXG4gIGluaXQ6IHJvb3QgPT4ge1xyXG4gICAgZm9yRWFjaChyb290LnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKSwgYnV0dG9uID0+IHtcclxuICAgICAgY29uc3QgZXhwYW5kZWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnO1xyXG4gICAgICB0b2dnbGVCdXR0b24oYnV0dG9uLCBleHBhbmRlZCk7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIEFDQ09SRElPTixcclxuICBCVVRUT04sXHJcbiAgc2hvdzogc2hvd0J1dHRvbixcclxuICBoaWRlOiBoaWRlQnV0dG9uLFxyXG4gIHRvZ2dsZTogdG9nZ2xlQnV0dG9uLFxyXG4gIGdldEJ1dHRvbnM6IGdldEFjY29yZGlvbkJ1dHRvbnMsXHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIFRPRE86IGZvciAyLjAsIHJlbW92ZSBldmVyeXRoaW5nIGJlbG93IHRoaXMgY29tbWVudCBhbmQgZXhwb3J0IHRoZVxyXG4gKiBiZWhhdmlvciBkaXJlY3RseTpcclxuICpcclxuICogbW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcih7Li4ufSk7XHJcbiAqL1xyXG5jb25zdCBBY2NvcmRpb24gPSBmdW5jdGlvbiAocm9vdCkge1xyXG4gIHRoaXMucm9vdCA9IHJvb3Q7XHJcbiAgYWNjb3JkaW9uLm9uKHRoaXMucm9vdCk7XHJcbn07XHJcblxyXG4vLyBjb3B5IGFsbCBvZiB0aGUgYmVoYXZpb3IgbWV0aG9kcyBhbmQgcHJvcHMgdG8gQWNjb3JkaW9uXHJcbmNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcclxuYXNzaWduKEFjY29yZGlvbiwgYWNjb3JkaW9uKTtcclxuXHJcbkFjY29yZGlvbi5wcm90b3R5cGUuc2hvdyA9IHNob3dCdXR0b247XHJcbkFjY29yZGlvbi5wcm90b3R5cGUuaGlkZSA9IGhpZGVCdXR0b247XHJcblxyXG5BY2NvcmRpb24ucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcclxuICBhY2NvcmRpb24ub2ZmKHRoaXMucm9vdCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFjY29yZGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XHJcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xyXG5jb25zdCBjbG9zZXN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvY2xvc2VzdCcpO1xyXG5jb25zdCBmb3JFYWNoID0gcmVxdWlyZSgnYXJyYXktZm9yZWFjaCcpO1xyXG5cclxuXHJcbmNsYXNzIGNoZWNrYm94VG9nZ2xlQ29udGVudHtcclxuICAgIGNvbnN0cnVjdG9yKGVsKXtcclxuICAgICAgICB0aGlzLmpzVG9nZ2xlVHJpZ2dlciA9IFwiLmpzLWNoZWNrYm94LXRvZ2dsZS1jb250ZW50XCI7XHJcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRhcmdldCA9IFwiZGF0YS1qcy10YXJnZXRcIjtcclxuXHJcbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jaGVja2JveEVsID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0KGVsKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KGVsKXtcclxuICAgICAgICB0aGlzLmNoZWNrYm94RWwgPSBlbDtcclxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jaGVja2JveEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICB0aGF0LnRvZ2dsZSh0aGF0LmNoZWNrYm94RWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlKHRoaXMuY2hlY2tib3hFbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlKHRyaWdnZXJFbCl7XHJcbiAgICAgICAgdmFyIHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNUb2dnbGVUYXJnZXQpXHJcbiAgICAgICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0RWwgPSBzZWxlY3QodGFyZ2V0QXR0ciwgJ2JvZHknKTtcclxuICAgICAgICAgICAgaWYodGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgIGlmKHRyaWdnZXJFbC5jaGVja2VkKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbFswXSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKHRyaWdnZXJFbCwgdGFyZ2V0RWxbMF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbCl7XHJcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcInRydWVcIik7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJjb2xsYXBzZWRcIik7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwiZmFsc2VcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCl7XHJcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKFwiY29sbGFwc2VkXCIpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrYm94VG9nZ2xlQ29udGVudDsiLCIvKipcclxuICogQ29sbGFwc2UvZXhwYW5kLlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xyXG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuY29uc3QgY2xvc2VzdCA9IHJlcXVpcmUoJy4uL3V0aWxzL2Nsb3Nlc3QnKTtcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuXHJcbmNvbnN0IGpzQ29sbGFwc2VUcmlnZ2VyID0gXCIuanMtY29sbGFwc2VcIjtcclxuY29uc3QganNDb2xsYXBzZVRhcmdldCA9IFwiZGF0YS1qcy10YXJnZXRcIjtcclxuXHJcbmNvbnN0IHRvZ2dsZUNvbGxhcHNlID0gZnVuY3Rpb24gKHRyaWdnZXJFbCwgZm9yY2VDbG9zZSkge1xyXG4gICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICB2YXIgdGFyZ2V0QXR0ciA9IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoanNDb2xsYXBzZVRhcmdldClcclxuICAgICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRFbCA9IHNlbGVjdCh0YXJnZXRBdHRyLCAnYm9keScpO1xyXG4gICAgICAgICAgICBpZih0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgLy90YXJnZXQgZm91bmQsIGNoZWNrIHN0YXRlXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRFbCA9IHRhcmdldEVsWzBdO1xyXG4gICAgICAgICAgICAgICAgLy9jaGFuZ2Ugc3RhdGVcclxuICAgICAgICAgICAgICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIpID09IFwidHJ1ZVwiIHx8IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIpID09IHVuZGVmaW5lZCB8fCBmb3JjZUNsb3NlICl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jbG9zZVxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVDb2xsYXBzZSh0YXJnZXRFbCwgdHJpZ2dlckVsKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIC8vb3BlblxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVFeHBhbmQodGFyZ2V0RWwsIHRyaWdnZXJFbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ICAgICAgIFxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgdG9nZ2xlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgdHJpZ2dlckVsbSA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBqc0NvbGxhcHNlVHJpZ2dlcik7XHJcbiAgICBpZih0cmlnZ2VyRWxtICE9PSBudWxsICYmIHRyaWdnZXJFbG0gIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgdG9nZ2xlQ29sbGFwc2UodHJpZ2dlckVsbSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG52YXIgYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVDb2xsYXBzZSh0YXJnZXRFbCwgdHJpZ2dlckVsKSB7XHJcbiAgICBpZighYW5pbWF0ZUluUHJvZ3Jlc3Mpe1xyXG4gICAgICAgIGFuaW1hdGVJblByb2dyZXNzID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSB0YXJnZXRFbC5jbGllbnRIZWlnaHQrIFwicHhcIjtcclxuICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKFwiY29sbGFwc2UtdHJhbnNpdGlvbi1jb2xsYXBzZVwiKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IFxyXG4gICAgICAgICAgICB0YXJnZXRFbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcclxuICAgICAgICB9LCA1KTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IFxyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKFwiY29sbGFwc2VkXCIpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKFwiY29sbGFwc2UtdHJhbnNpdGlvbi1jb2xsYXBzZVwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIik7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICAgYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcclxuICAgICAgICB9LCAyMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBhbmltYXRlRXhwYW5kKHRhcmdldEVsLCB0cmlnZ2VyRWwpIHtcclxuICAgIGlmKCFhbmltYXRlSW5Qcm9ncmVzcyl7XHJcbiAgICAgICAgYW5pbWF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xyXG4gICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJjb2xsYXBzZWRcIik7XHJcbiAgICAgICAgdmFyIGV4cGFuZGVkSGVpZ2h0ID0gdGFyZ2V0RWwuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmhlaWdodCA9IFwiMHB4XCI7XHJcbiAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZChcImNvbGxhcHNlLXRyYW5zaXRpb24tZXhwYW5kXCIpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgXHJcbiAgICAgICAgICAgIHRhcmdldEVsLnN0eWxlLmhlaWdodCA9IGV4cGFuZGVkSGVpZ2h0KyBcInB4XCI7XHJcbiAgICAgICAgfSwgNSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZShcImNvbGxhcHNlLXRyYW5zaXRpb24tZXhwYW5kXCIpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcclxuXHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwiZmFsc2VcIik7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICAgYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcclxuICAgICAgICB9LCAyMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHtcclxuICBbJ2NsaWNrJ106IHtcclxuICAgIFsganNDb2xsYXBzZVRyaWdnZXIgXTogdG9nZ2xlXHJcbiAgfSxcclxufSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGNsb3Nlc3QgPSByZXF1aXJlKCcuLi91dGlscy9jbG9zZXN0Jyk7XG5cbmNsYXNzIGRyb3Bkb3duIHtcbiAgY29uc3RydWN0b3IgKGVsKXtcbiAgICB0aGlzLmpzRHJvcGRvd25UcmlnZ2VyID0gJy5qcy1kcm9wZG93bic7XG4gICAgdGhpcy5qc0Ryb3Bkb3duVGFyZ2V0ID0gJ2RhdGEtanMtdGFyZ2V0JztcblxuICAgIC8vb3B0aW9uOiBtYWtlIGRyb3Bkb3duIGJlaGF2ZSBhcyB0aGUgY29sbGFwc2UgY29tcG9uZW50IHdoZW4gb24gc21hbGwgc2NyZWVucyAodXNlZCBieSBzdWJtZW51cyBpbiB0aGUgaGVhZGVyIGFuZCBzdGVwLWRyb3Bkb3duKS5cbiAgICB0aGlzLm5hdlJlc3BvbnNpdmVCcmVha3BvaW50ID0gOTkyOyAvL3NhbWUgYXMgJG5hdi1yZXNwb25zaXZlLWJyZWFrcG9pbnQgZnJvbSB0aGUgc2Nzcy5cbiAgICB0aGlzLnRyaW5ndWlkZUJyZWFrcG9pbnQgPSA3Njg7IC8vc2FtZSBhcyAkbmF2LXJlc3BvbnNpdmUtYnJlYWtwb2ludCBmcm9tIHRoZSBzY3NzLlxuICAgIHRoaXMuanNSZXNwb25zaXZlQ29sbGFwc2VNb2RpZmllciA9ICcuanMtZHJvcGRvd24tLXJlc3BvbnNpdmUtY29sbGFwc2UnO1xuICAgIHRoaXMucmVzcG9uc2l2ZUNvbGxhcHNlRW5hYmxlZCA9IGZhbHNlO1xuICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSBmYWxzZTtcblxuXG4gICAgdGhpcy50cmlnZ2VyRWwgPSBudWxsO1xuICAgIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xuXG4gICAgdGhpcy5pbml0KGVsKTtcblxuICAgIGlmKHRoaXMudHJpZ2dlckVsICE9PSBudWxsICYmIHRoaXMudHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGhpcy50YXJnZXRFbCAhPT0gbnVsbCAmJiB0aGlzLnRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuXG5cbiAgICAgIGlmKHRoaXMudHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykpe1xuICAgICAgICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy9DbGlja2VkIG91dHNpZGUgZHJvcGRvd24gLT4gY2xvc2UgaXRcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCl7XG4gICAgICAgIHRoYXQub3V0c2lkZUNsb3NlKGV2ZW50KTtcbiAgICAgIH0pO1xuXG4gICAgICAvL0NsaWNrZWQgb24gZHJvcGRvd24gb3BlbiBidXR0b24gLS0+IHRvZ2dsZSBpdFxuICAgICAgdGhpcy50cmlnZ2VyRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpe1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTsvL3ByZXZlbnRzIG91c2lkZSBjbGljayBsaXN0ZW5lciBmcm9tIHRyaWdnZXJpbmcuXG4gICAgICAgIHRoYXQudG9nZ2xlRHJvcGRvd24oKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBzZXQgYXJpYS1oaWRkZW4gY29ycmVjdGx5IGZvciBzY3JlZW5yZWFkZXJzIChUcmluZ3VpZGUgcmVzcG9uc2l2ZSlcbiAgICAgIGlmKHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLnRyaWdnZXJFbDtcbiAgICAgICAgaWYgKHdpbmRvdy5JbnRlcnNlY3Rpb25PYnNlcnZlcikge1xuICAgICAgICAgIC8vIHRyaWdnZXIgZXZlbnQgd2hlbiBidXR0b24gY2hhbmdlcyB2aXNpYmlsaXR5XG4gICAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChlbnRyaWVzKSB7XG4gICAgICAgICAgICAvLyBidXR0b24gaXMgdmlzaWJsZVxuICAgICAgICAgICAgaWYgKGVudHJpZXNbMF0uaW50ZXJzZWN0aW9uUmF0aW8pIHtcbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gYnV0dG9uIGlzIG5vdCB2aXNpYmxlXG4gICAgICAgICAgICAgIGlmICh0aGF0LnRhcmdldEVsLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgcm9vdDogZG9jdW1lbnQuYm9keVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSUU6IEludGVyc2VjdGlvbk9ic2VydmVyIGlzIG5vdCBzdXBwb3J0ZWQsIHNvIHdlIGxpc3RlbiBmb3Igd2luZG93IHJlc2l6ZSBhbmQgZ3JpZCBicmVha3BvaW50IGluc3RlYWRcbiAgICAgICAgICBpZiAodGhhdC5kb1Jlc3BvbnNpdmVTdGVwZ3VpZGVDb2xsYXBzZSgpKSB7XG4gICAgICAgICAgICAvLyBzbWFsbCBzY3JlZW5cbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNle1xuICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIExhcmdlIHNjcmVlblxuICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoYXQuZG9SZXNwb25zaXZlU3RlcGd1aWRlQ29sbGFwc2UoKSkge1xuICAgICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuICAgICAgICAgICAgICB9IGVsc2V7XG4gICAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBldnQgPSBldnQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDI3KSB7XG4gICAgICAgICAgdGhhdC5jbG9zZUFsbCgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG5cbiAgaW5pdCAoZWwpe1xuICAgIHRoaXMudHJpZ2dlckVsID0gZWw7XG4gICAgaWYodGhpcy50cmlnZ2VyRWwgIT09IG51bGwgJiYgdGhpcy50cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICBsZXQgdGFyZ2V0QXR0ciA9IHRoaXMudHJpZ2dlckVsLmdldEF0dHJpYnV0ZSh0aGlzLmpzRHJvcGRvd25UYXJnZXQpO1xuICAgICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xuICAgICAgICBsZXQgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJykpO1xuICAgICAgICBpZih0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICB0aGlzLnRhcmdldEVsID0gdGFyZ2V0RWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZih0aGlzLnRyaWdnZXJFbC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLWRyb3Bkb3duLS1yZXNwb25zaXZlLWNvbGxhcHNlJykpe1xuICAgICAgdGhpcy5yZXNwb25zaXZlQ29sbGFwc2VFbmFibGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZih0aGlzLnRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpKXtcbiAgICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICB9XG5cbiAgY2xvc2VBbGwgKCl7XG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcblxuICAgIGxldCBvdmVyZmxvd01lbnVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ292ZXJmbG93LW1lbnUnKTtcbiAgICBsZXQgdHJpZ2dlckVsID0gbnVsbDtcbiAgICBsZXQgdGFyZ2V0RWwgPSBudWxsO1xuICAgIGZvciAobGV0IG9pID0gMDsgb2kgPCBvdmVyZmxvd01lbnVFbC5sZW5ndGg7IG9pKyspIHtcbiAgICAgIGxldCBjdXJyZW50T3ZlcmZsb3dNZW51RUwgPSBvdmVyZmxvd01lbnVFbFsgb2kgXTtcbiAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgY3VycmVudE92ZXJmbG93TWVudUVMLmNoaWxkTm9kZXMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgaWYgKGN1cnJlbnRPdmVyZmxvd01lbnVFTC5jaGlsZE5vZGVzWyBhIF0udGFnTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKGN1cnJlbnRPdmVyZmxvd01lbnVFTC5jaGlsZE5vZGVzWyBhIF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1kcm9wZG93bicpKSB7XG4gICAgICAgICAgICB0cmlnZ2VyRWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwuY2hpbGROb2Rlc1sgYSBdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudE92ZXJmbG93TWVudUVMLmNoaWxkTm9kZXNbIGEgXS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtaW5uZXInKSkge1xuICAgICAgICAgICAgdGFyZ2V0RWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwuY2hpbGROb2Rlc1sgYSBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRhcmdldEVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ21vYmlsZV9uYXYtYWN0aXZlJykpIHtcbiAgICAgICAgICBpZiAoIWN1cnJlbnRPdmVyZmxvd01lbnVFTC5jbG9zZXN0KCcubmF2YmFyJykpIHtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZURyb3Bkb3duIChmb3JjZUNsb3NlKSB7XG4gICAgaWYodGhpcy50cmlnZ2VyRWwgIT09IG51bGwgJiYgdGhpcy50cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnRhcmdldEVsICE9PSBudWxsICYmIHRoaXMudGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAvL2NoYW5nZSBzdGF0ZVxuXG4gICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLmxlZnQgPSBudWxsO1xuICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5yaWdodCA9IG51bGw7XG5cbiAgICAgIHZhciByZWN0ID0gdGhpcy50cmlnZ2VyRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zb2xlLmxvZyhyZWN0LmxlZnQpO1xuICAgICAgaWYodGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJyB8fCBmb3JjZUNsb3NlKXtcbiAgICAgICAgLy9jbG9zZVxuICAgICAgICB0aGlzLnRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgdGhpcy50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgdGhpcy50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLmNsb3NlQWxsKCk7XG4gICAgICAgIC8vb3BlblxuICAgICAgICB0aGlzLnRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xuICAgICAgICB0aGlzLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5vZmZzZXQodGhpcy50YXJnZXRFbClcblxuICAgICAgICBpZihvZmZzZXQubGVmdCA8IDApe1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdPdXQgb2YgYm91bmRzOiBMRUZUJyk7XG4gICAgICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XG4gICAgICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5yaWdodCA9ICdhdXRvJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmlnaHQgPSBvZmZzZXQubGVmdCArIHRoaXMudGFyZ2V0RWwub2Zmc2V0V2lkdGg7XG4gICAgICAgIGNvbnNvbGUubG9nKHJpZ2h0KTtcbiAgICAgICAgaWYocmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCl7XG4gICAgICAgICAgY29uc29sZS5sb2coJ091dCBvZiBib3VuZHM6IFJJR0hUJyk7XG4gICAgICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xuICAgICAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnMHB4JztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvZmZzZXRBZ2FpbiA9IHRoaXMub2Zmc2V0KHRoaXMudGFyZ2V0RWwpO1xuXG4gICAgICAgIGlmKG9mZnNldEFnYWluLmxlZnQgPCAwKXtcbiAgICAgICAgICBjb25zb2xlLmxvZygnT3V0IG9mIGJvdW5kczogTEVGVCcpO1xuXG4gICAgICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XG4gICAgICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5yaWdodCA9ICdhdXRvJztcbiAgICAgICAgfVxuICAgICAgICByaWdodCA9IG9mZnNldEFnYWluLmxlZnQgKyB0aGlzLnRhcmdldEVsLm9mZnNldFdpZHRoO1xuICAgICAgICBpZihyaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKXtcbiAgICAgICAgICBjb25zb2xlLmxvZygnT3V0IG9mIGJvdW5kczogUklHSFQnKTtcblxuICAgICAgICAgIHRoaXMudGFyZ2V0RWwuc3R5bGUubGVmdCA9ICdhdXRvJztcbiAgICAgICAgICB0aGlzLnRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cblxuICB9XG5cbiAgb2Zmc2V0IChlbCkge1xuICAgIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LFxuICAgICAgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgcmV0dXJuIHsgdG9wOiByZWN0LnRvcCArIHNjcm9sbFRvcCwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCB9XG4gIH1cblxuXG4gIG91dHNpZGVDbG9zZSAoZXZlbnQpe1xuICAgIGlmKCF0aGlzLmRvUmVzcG9uc2l2ZUNvbGxhcHNlKCkpe1xuICAgICAgLy9jbG9zZXMgZHJvcGRvd24gd2hlbiBjbGlja2VkIG91dHNpZGUuXG4gICAgICBsZXQgZHJvcGRvd25FbG0gPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgdGhpcy50YXJnZXRFbC5pZCk7XG4gICAgICBpZigoZHJvcGRvd25FbG0gPT09IG51bGwgfHwgZHJvcGRvd25FbG0gPT09IHVuZGVmaW5lZCkgJiYgKGV2ZW50LnRhcmdldCAhPT0gdGhpcy50cmlnZ2VyRWwpKXtcbiAgICAgICAgLy9jbGlja2VkIG91dHNpZGUgdHJpZ2dlciwgZm9yY2UgY2xvc2VcbiAgICAgICAgdGhpcy50b2dnbGVEcm9wZG93bih0cnVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkb1Jlc3BvbnNpdmVDb2xsYXBzZSAoKXtcbiAgICAvL3JldHVybnMgdHJ1ZSBpZiByZXNwb25zaXZlIGNvbGxhcHNlIGlzIGVuYWJsZWQgYW5kIHdlIGFyZSBvbiBhIHNtYWxsIHNjcmVlbi5cbiAgICBpZigodGhpcy5yZXNwb25zaXZlQ29sbGFwc2VFbmFibGVkIHx8IHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQpICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IHRoaXMubmF2UmVzcG9uc2l2ZUJyZWFrcG9pbnQpe1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBkb1Jlc3BvbnNpdmVTdGVwZ3VpZGVDb2xsYXBzZSAoKXtcbiAgICAvL3JldHVybnMgdHJ1ZSBpZiByZXNwb25zaXZlIGNvbGxhcHNlIGlzIGVuYWJsZWQgYW5kIHdlIGFyZSBvbiBhIHNtYWxsIHNjcmVlbi5cbiAgICBpZigodGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCkgJiYgd2luZG93LmlubmVyV2lkdGggPD0gdGhpcy50cmluZ3VpZGVCcmVha3BvaW50KXtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkcm9wZG93bjtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGFjY29yZGlvbjogIHJlcXVpcmUoJy4vYWNjb3JkaW9uJyksXHJcbiAgbmF2aWdhdGlvbjogcmVxdWlyZSgnLi9uYXZpZ2F0aW9uJyksXHJcbiAgc2tpcG5hdjogICAgcmVxdWlyZSgnLi9za2lwbmF2JyksXHJcbiAgcmVnZXhtYXNrOiAgcmVxdWlyZSgnLi9yZWdleC1pbnB1dC1tYXNrJyksXHJcbiAgY29sbGFwc2U6ICAgcmVxdWlyZSgnLi9jb2xsYXBzZScpXHJcbn07XHJcbiIsIlxyXG5jb25zdCBkb21yZWFkeSA9IHJlcXVpcmUoJ2RvbXJlYWR5Jyk7XHJcblxyXG4vKipcclxuICogSW1wb3J0IG1vZGFsIGxpYi5cclxuICogaHR0cHM6Ly9taWNyb21vZGFsLm5vdy5zaFxyXG4gKi9cclxuY29uc3QgbWljcm9Nb2RhbCA9IHJlcXVpcmUoXCIuLi8uLi92ZW5kb3IvbWljcm9tb2RhbC5qc1wiKTtcclxuZG9tcmVhZHkoKCkgPT4ge1xyXG5cdG1pY3JvTW9kYWwuaW5pdCgpOyAvL2luaXQgYWxsIG1vZGFsc1xyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XHJcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XHJcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xyXG5jb25zdCBhY2NvcmRpb24gPSByZXF1aXJlKCcuL2FjY29yZGlvbicpO1xyXG5cclxuY29uc3QgQ0xJQ0sgPSByZXF1aXJlKCcuLi9ldmVudHMnKS5DTElDSztcclxuY29uc3QgUFJFRklYID0gcmVxdWlyZSgnLi4vY29uZmlnJykucHJlZml4O1xyXG5cclxuY29uc3QgTkFWID0gYC5uYXZgO1xyXG5jb25zdCBOQVZfTElOS1MgPSBgJHtOQVZ9IGFgO1xyXG5jb25zdCBPUEVORVJTID0gYC5qcy1tZW51LW9wZW5gO1xyXG5jb25zdCBDTE9TRV9CVVRUT04gPSBgLmpzLW1lbnUtY2xvc2VgO1xyXG5jb25zdCBPVkVSTEFZID0gYC5vdmVybGF5YDtcclxuY29uc3QgQ0xPU0VSUyA9IGAke0NMT1NFX0JVVFRPTn0sIC5vdmVybGF5YDtcclxuY29uc3QgVE9HR0xFUyA9IFsgTkFWLCBPVkVSTEFZIF0uam9pbignLCAnKTtcclxuXHJcbmNvbnN0IEFDVElWRV9DTEFTUyA9ICdtb2JpbGVfbmF2LWFjdGl2ZSc7XHJcbmNvbnN0IFZJU0lCTEVfQ0xBU1MgPSAnaXMtdmlzaWJsZSc7XHJcblxyXG5jb25zdCBpc0FjdGl2ZSA9ICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUyk7XHJcblxyXG5jb25zdCBfZm9jdXNUcmFwID0gKHRyYXBDb250YWluZXIpID0+IHtcclxuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cclxuICBjb25zdCBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9ICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSc7XHJcbiAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSB0cmFwQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcpO1xyXG4gIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWyAwIF07XHJcbiAgY29uc3QgbGFzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1sgZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMSBdO1xyXG5cclxuICBmdW5jdGlvbiB0cmFwVGFiS2V5IChlKSB7XHJcbiAgICAvLyBDaGVjayBmb3IgVEFCIGtleSBwcmVzc1xyXG4gICAgaWYgKGUua2V5Q29kZSA9PT0gOSkge1xyXG5cclxuICAgICAgLy8gU0hJRlQgKyBUQUJcclxuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RUYWJTdG9wKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRBQlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0VGFiU3RvcCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRVNDQVBFXHJcbiAgICBpZiAoZS5rZXlDb2RlID09PSAyNykge1xyXG4gICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBGb2N1cyBmaXJzdCBjaGlsZFxyXG4gIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZW5hYmxlICgpIHtcclxuICAgICAgLy8gTGlzdGVuIGZvciBhbmQgdHJhcCB0aGUga2V5Ym9hcmRcclxuICAgICAgdHJhcENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcFRhYktleSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbGVhc2UgKCkge1xyXG4gICAgICB0cmFwQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmxldCBmb2N1c1RyYXA7XHJcblxyXG5jb25zdCB0b2dnbGVOYXYgPSBmdW5jdGlvbiAoYWN0aXZlKSB7XHJcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgaWYgKHR5cGVvZiBhY3RpdmUgIT09ICdib29sZWFuJykge1xyXG4gICAgYWN0aXZlID0gIWlzQWN0aXZlKCk7XHJcbiAgfVxyXG4gIGJvZHkuY2xhc3NMaXN0LnRvZ2dsZShBQ1RJVkVfQ0xBU1MsIGFjdGl2ZSk7XHJcblxyXG4gIGZvckVhY2goc2VsZWN0KFRPR0dMRVMpLCBlbCA9PiB7XHJcbiAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKFZJU0lCTEVfQ0xBU1MsIGFjdGl2ZSk7XHJcbiAgfSk7XHJcblxyXG4gIGlmIChhY3RpdmUpIHtcclxuICAgIGZvY3VzVHJhcC5lbmFibGUoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZm9jdXNUcmFwLnJlbGVhc2UoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNsb3NlQnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcbiAgY29uc3QgbWVudUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihPUEVORVJTKTtcclxuXHJcbiAgaWYgKGFjdGl2ZSAmJiBjbG9zZUJ1dHRvbikge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgYWN0aXZhdGVkLCBzbyBmb2N1cyBvbiB0aGUgY2xvc2UgYnV0dG9uLFxyXG4gICAgLy8gd2hpY2ggaXMganVzdCBiZWZvcmUgYWxsIHRoZSBuYXYgZWxlbWVudHMgaW4gdGhlIHRhYiBvcmRlci5cclxuICAgIGNsb3NlQnV0dG9uLmZvY3VzKCk7XHJcbiAgfSBlbHNlIGlmICghYWN0aXZlICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGNsb3NlQnV0dG9uICYmXHJcbiAgICAgICAgICAgICBtZW51QnV0dG9uKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBkZWFjdGl2YXRlZCwgYW5kIGZvY3VzIHdhcyBvbiB0aGUgY2xvc2VcclxuICAgIC8vIGJ1dHRvbiwgd2hpY2ggaXMgbm8gbG9uZ2VyIHZpc2libGUuIFdlIGRvbid0IHdhbnQgdGhlIGZvY3VzIHRvXHJcbiAgICAvLyBkaXNhcHBlYXIgaW50byB0aGUgdm9pZCwgc28gZm9jdXMgb24gdGhlIG1lbnUgYnV0dG9uIGlmIGl0J3NcclxuICAgIC8vIHZpc2libGUgKHRoaXMgbWF5IGhhdmUgYmVlbiB3aGF0IHRoZSB1c2VyIHdhcyBqdXN0IGZvY3VzZWQgb24sXHJcbiAgICAvLyBpZiB0aGV5IHRyaWdnZXJlZCB0aGUgbW9iaWxlIG5hdiBieSBtaXN0YWtlKS5cclxuICAgIG1lbnVCdXR0b24uZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhY3RpdmU7XHJcbn07XHJcblxyXG5jb25zdCByZXNpemUgPSAoKSA9PiB7XHJcbiAgY29uc3QgY2xvc2VyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcblxyXG4gIGlmIChpc0FjdGl2ZSgpICYmIGNsb3NlciAmJiBjbG9zZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggPT09IDApIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IGlzIGFjdGl2ZSwgYnV0IHRoZSBjbG9zZSBib3ggaXNuJ3QgdmlzaWJsZSwgd2hpY2hcclxuICAgIC8vIG1lYW5zIHRoZSB1c2VyJ3Mgdmlld3BvcnQgaGFzIGJlZW4gcmVzaXplZCBzbyB0aGF0IGl0IGlzIG5vIGxvbmdlclxyXG4gICAgLy8gaW4gbW9iaWxlIG1vZGUuIExldCdzIG1ha2UgdGhlIHBhZ2Ugc3RhdGUgY29uc2lzdGVudCBieVxyXG4gICAgLy8gZGVhY3RpdmF0aW5nIHRoZSBtb2JpbGUgbmF2LlxyXG4gICAgdG9nZ2xlTmF2LmNhbGwoY2xvc2VyLCBmYWxzZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgbmF2aWdhdGlvbiA9IGJlaGF2aW9yKHtcclxuICBbIENMSUNLIF06IHtcclxuICAgIFsgT1BFTkVSUyBdOiB0b2dnbGVOYXYsXHJcbiAgICBbIENMT1NFUlMgXTogdG9nZ2xlTmF2LFxyXG4gICAgWyBOQVZfTElOS1MgXTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBBIG5hdmlnYXRpb24gbGluayBoYXMgYmVlbiBjbGlja2VkISBXZSB3YW50IHRvIGNvbGxhcHNlIGFueVxyXG4gICAgICAvLyBoaWVyYXJjaGljYWwgbmF2aWdhdGlvbiBVSSBpdCdzIGEgcGFydCBvZiwgc28gdGhhdCB0aGUgdXNlclxyXG4gICAgICAvLyBjYW4gZm9jdXMgb24gd2hhdGV2ZXIgdGhleSd2ZSBqdXN0IHNlbGVjdGVkLlxyXG5cclxuICAgICAgLy8gU29tZSBuYXZpZ2F0aW9uIGxpbmtzIGFyZSBpbnNpZGUgYWNjb3JkaW9uczsgd2hlbiB0aGV5J3JlXHJcbiAgICAgIC8vIGNsaWNrZWQsIHdlIHdhbnQgdG8gY29sbGFwc2UgdGhvc2UgYWNjb3JkaW9ucy5cclxuICAgICAgY29uc3QgYWNjID0gdGhpcy5jbG9zZXN0KGFjY29yZGlvbi5BQ0NPUkRJT04pO1xyXG4gICAgICBpZiAoYWNjKSB7XHJcbiAgICAgICAgYWNjb3JkaW9uLmdldEJ1dHRvbnMoYWNjKS5mb3JFYWNoKGJ0biA9PiBhY2NvcmRpb24uaGlkZShidG4pKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgdGhlIG1vYmlsZSBuYXZpZ2F0aW9uIG1lbnUgaXMgYWN0aXZlLCB3ZSB3YW50IHRvIGhpZGUgaXQuXHJcbiAgICAgIGlmIChpc0FjdGl2ZSgpKSB7XHJcbiAgICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0sIHtcclxuICBpbml0ICgpIHtcclxuICAgIGNvbnN0IHRyYXBDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKE5BVik7XHJcblxyXG4gICAgaWYgKHRyYXBDb250YWluZXIpIHtcclxuICAgICAgZm9jdXNUcmFwID0gX2ZvY3VzVHJhcCh0cmFwQ29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNpemUoKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcclxuICB9LFxyXG4gIHRlYXJkb3duICgpIHtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcclxuICB9LFxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBUT0RPIGZvciAyLjAsIHJlbW92ZSB0aGlzIHN0YXRlbWVudCBhbmQgZXhwb3J0IGBuYXZpZ2F0aW9uYCBkaXJlY3RseTpcclxuICpcclxuICogbW9kdWxlLmV4cG9ydHMgPSBiZWhhdmlvcih7Li4ufSk7XHJcbiAqL1xyXG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gYXNzaWduKFxyXG4gIGVsID0+IG5hdmlnYXRpb24ub24oZWwpLFxyXG4gIG5hdmlnYXRpb25cclxuKTsiLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZSgnLi4vdXRpbHMvYmVoYXZpb3InKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcbmNvbnN0IGNsb3Nlc3QgPSByZXF1aXJlKCcuLi91dGlscy9jbG9zZXN0Jyk7XHJcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XHJcblxyXG5cclxuY2xhc3MgcmFkaW9Ub2dnbGVHcm91cHtcclxuICAgIGNvbnN0cnVjdG9yKGVsKXtcclxuICAgICAgICB0aGlzLmpzVG9nZ2xlVHJpZ2dlciA9IFwiLmpzLXJhZGlvLXRvZ2dsZS1ncm91cFwiO1xyXG4gICAgICAgIHRoaXMuanNUb2dnbGVUYXJnZXQgPSBcImRhdGEtanMtdGFyZ2V0XCI7XHJcblxyXG4gICAgICAgIHRoaXMucmFkaW9FbHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmluaXQoZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoZWwpe1xyXG4gICAgICAgIHRoaXMucmFkaW9Hcm91cCA9IGVsO1xyXG4gICAgICAgIHRoaXMucmFkaW9FbHMgPSBzZWxlY3QoXCJpbnB1dFt0eXBlPSdyYWRpbyddXCIsIHRoaXMucmFkaW9Hcm91cCk7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBmb3JFYWNoKHRoaXMucmFkaW9FbHMsIHJhZGlvID0+IHtcclxuICAgICAgICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJyxmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgICAgICAgICBmb3JFYWNoKHRoYXQucmFkaW9FbHMsIHJhZGlvID0+IHsgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC50b2dnbGUocmFkaW8pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50b2dnbGUocmFkaW8pOyAvL0luaXRpYWwgdmFsdWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZSh0cmlnZ2VyRWwpe1xyXG4gICAgICAgIHZhciB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZSh0aGlzLmpzVG9nZ2xlVGFyZ2V0KVxyXG4gICAgICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdmFyIHRhcmdldEVsID0gc2VsZWN0KHRhcmdldEF0dHIsICdib2R5Jyk7XHJcbiAgICAgICAgICAgIGlmKHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICBpZih0cmlnZ2VyRWwuY2hlY2tlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuKHRyaWdnZXJFbCwgdGFyZ2V0RWxbMF0pO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSh0cmlnZ2VyRWwsIHRhcmdldEVsWzBdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcGVuKHRyaWdnZXJFbCwgdGFyZ2V0RWwpe1xyXG4gICAgICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKFwiY29sbGFwc2VkXCIpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcImZhbHNlXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsb3NlKHRyaWdnZXJFbCwgdGFyZ2V0RWwpe1xyXG4gICAgICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZChcImNvbGxhcHNlZFwiKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByYWRpb1RvZ2dsZUdyb3VwOyIsIi8qXHJcbiogUHJldmVudHMgdGhlIHVzZXIgZnJvbSBpbnB1dHRpbmcgYmFzZWQgb24gYSByZWdleC5cclxuKiBEb2VzIG5vdCB3b3JrIHRoZSBzYW1lIHdheSBhZiA8aW5wdXQgcGF0dGVybj1cIlwiPiwgdGhpcyBwYXR0ZXJuIGlzIG9ubHkgdXNlZCBmb3IgdmFsaWRhdGlvbiwgbm90IHRvIHByZXZlbnQgaW5wdXQuXHJcbiogVXNlY2FzZTogbnVtYmVyIGlucHV0IGZvciBkYXRlLWNvbXBvbmVudC5cclxuKiBFeGFtcGxlIC0gbnVtYmVyIG9ubHk6IDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtaW5wdXQtcmVnZXg9XCJeXFxkKiRcIj5cclxuKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XHJcblxyXG5jb25zdCBtb2RpZmllclN0YXRlID0ge1xyXG4gIHNoaWZ0OiBmYWxzZSxcclxuICBhbHQ6IGZhbHNlLFxyXG4gIGN0cmw6IGZhbHNlLFxyXG4gIGNvbW1hbmQ6IGZhbHNlXHJcbn07XHJcblxyXG5mdW5jdGlvbiBpbnB1dFJlZ2V4TWFzayAoZXZlbnQpIHtcclxuICBpZihtb2RpZmllclN0YXRlLmN0cmwgfHwgbW9kaWZpZXJTdGF0ZS5jb21tYW5kKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBuZXdDaGFyID0gbnVsbDtcclxuICBpZih0eXBlb2YgZXZlbnQua2V5ICE9PSAndW5kZWZpbmVkJyl7XHJcbiAgICBpZihldmVudC5rZXkubGVuZ3RoID09PSAxKXtcclxuICAgICAgbmV3Q2hhciA9IGV2ZW50LmtleTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYoIWV2ZW50LmNoYXJDb2RlKXtcclxuICAgICAgbmV3Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQua2V5Q29kZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5jaGFyQ29kZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgcmVnZXhTdHIgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1pbnB1dC1yZWdleCcpO1xyXG5cclxuICBpZihldmVudC50eXBlICE9PSB1bmRlZmluZWQgJiYgZXZlbnQudHlwZSA9PT0gJ3Bhc3RlJyl7XHJcbiAgICBjb25zb2xlLmxvZygncGFzdGUnKTtcclxuICB9IGVsc2V7XHJcbiAgICB2YXIgZWxlbWVudCA9IG51bGw7XHJcbiAgICBpZihldmVudC50YXJnZXQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XHJcbiAgICB9XHJcbiAgICBpZihuZXdDaGFyICE9PSBudWxsICYmIGVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgaWYobmV3Q2hhci5sZW5ndGggPiAwKXtcclxuICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGlmKGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcicpe1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlOy8vTm90ZSBpbnB1dFt0eXBlPW51bWJlcl0gZG9lcyBub3QgaGF2ZSAuc2VsZWN0aW9uU3RhcnQvRW5kIChDaHJvbWUpLlxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIGVsZW1lbnQuc2VsZWN0aW9uU3RhcnQpICsgdGhpcy52YWx1ZS5zbGljZShlbGVtZW50LnNlbGVjdGlvbkVuZCkgKyBuZXdDaGFyOyAvL3JlbW92ZXMgdGhlIG51bWJlcnMgc2VsZWN0ZWQgYnkgdGhlIHVzZXIsIHRoZW4gYWRkcyBuZXcgY2hhci5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByID0gbmV3IFJlZ0V4cChyZWdleFN0cik7XHJcbiAgICAgICAgaWYoci5leGVjKG5ld1ZhbHVlKSA9PT0gbnVsbCl7XHJcbiAgICAgICAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHtcclxuICAna2V5cHJlc3MgcGFzdGUnOiB7XHJcbiAgICAnaW5wdXRbZGF0YS1pbnB1dC1yZWdleF06Zm9jdXMnOiBpbnB1dFJlZ2V4TWFzayxcclxuICB9XHJcbn0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZSgnLi4vdXRpbHMvYmVoYXZpb3InKTtcclxuY29uc3Qgb25jZSA9IHJlcXVpcmUoJ3JlY2VwdG9yL29uY2UnKTtcclxuXHJcbmNvbnN0IENMSUNLID0gcmVxdWlyZSgnLi4vZXZlbnRzJykuQ0xJQ0s7XHJcbmNvbnN0IFBSRUZJWCA9IHJlcXVpcmUoJy4uL2NvbmZpZycpLnByZWZpeDtcclxuY29uc3QgTElOSyA9IGAuJHtQUkVGSVh9c2tpcG5hdltocmVmXj1cIiNcIl1gO1xyXG5cclxuY29uc3Qgc2V0VGFiaW5kZXggPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAvLyBOQjogd2Uga25vdyBiZWNhdXNlIG9mIHRoZSBzZWxlY3RvciB3ZSdyZSBkZWxlZ2F0aW5nIHRvIGJlbG93IHRoYXQgdGhlXHJcbiAgLy8gaHJlZiBhbHJlYWR5IGJlZ2lucyB3aXRoICcjJ1xyXG4gIGNvbnN0IGlkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zbGljZSgxKTtcclxuICBjb25zdCB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgaWYgKHRhcmdldCkge1xyXG4gICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcclxuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgb25jZShldmVudCA9PiB7XHJcbiAgICAgIHRhcmdldC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgLTEpO1xyXG4gICAgfSkpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyB0aHJvdyBhbiBlcnJvcj9cclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHtcclxuICBbIENMSUNLIF06IHtcclxuICAgIFsgTElOSyBdOiBzZXRUYWJpbmRleCxcclxuICB9LFxyXG59KTtcclxuIiwiY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcbmNvbnN0IGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKTtcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuXHJcbmRvbXJlYWR5KCgpID0+IHtcclxuXHRuZXcgUmVzcG9uc2l2ZVRhYmxlcygpOyBcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc3BvbnNpdmVUYWJsZXMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgY29uc3QgYWxsVGFibGVzID0gc2VsZWN0KCd0YWJsZTpub3QoLmRhdGFUYWJsZSknKTtcclxuICAgICAgICBmb3JFYWNoKGFsbFRhYmxlcywgdGFibGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmluc2VydEhlYWRlckFzQXR0cmlidXRlcyh0YWJsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGRhdGEgYXR0cmlidXRlcyBuZWVkZWQgZm9yIHJlc3BvbnNpdmUgbW9kZS5cclxuICAgIGluc2VydEhlYWRlckFzQXR0cmlidXRlcyh0YWJsZUVsKXtcclxuICAgICAgICBpZiAoIXRhYmxlRWwpIHJldHVyblxyXG5cclxuICAgICAgICBjb25zdCBoZWFkZXJDZWxsRWxzID0gIHNlbGVjdCgndGhlYWQgdGgsIHRoZWFkIHRkJywgdGFibGVFbCk7XHJcblxyXG4gICAgICAgIC8vY29uc3QgaGVhZGVyQ2VsbEVscyA9IHNlbGVjdChlbC5xdWVyeVNlbGVjdG9yQWxsKCd0aGVhZCB0aCwgdGhlYWQgdGQnKTtcclxuICAgIFxyXG4gICAgICAgIGlmIChoZWFkZXJDZWxsRWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBib2R5Um93RWxzID0gc2VsZWN0KCd0Ym9keSB0cicsIHRhYmxlRWwpO1xyXG4gICAgICAgICAgICBBcnJheS5mcm9tKGJvZHlSb3dFbHMpLmZvckVhY2gocm93RWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNlbGxFbHMgPSByb3dFbC5jaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgaWYgKGNlbGxFbHMubGVuZ3RoID09PSBoZWFkZXJDZWxsRWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oaGVhZGVyQ2VsbEVscykuZm9yRWFjaCgoaGVhZGVyQ2VsbEVsLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdyYWIgaGVhZGVyIGNlbGwgdGV4dCBhbmQgdXNlIGl0IGJvZHkgY2VsbCBkYXRhIHRpdGxlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsRWxzW2ldLnNldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScsIGhlYWRlckNlbGxFbC50ZXh0Q29udGVudClcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIlxyXG5jb25zdCBkb21yZWFkeSA9IHJlcXVpcmUoJ2RvbXJlYWR5Jyk7XHJcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xyXG4vL0ltcG9ydCB0aXBweS5qcyAoaHR0cHM6Ly9hdG9taWtzLmdpdGh1Yi5pby90aXBweWpzLylcclxuY29uc3QgdGlwcHkgPSByZXF1aXJlKCcuLi8uLi92ZW5kb3IvdGlwcHlqcy90aXBweS5qcycpO1xyXG5cclxudmFyIGluaXRUaXBweSA9IGZ1bmN0aW9uICgpe1xyXG4gICAgLy9pbml0IHRvb2x0aXAgb24gZWxlbWVudHMgd2l0aCB0aGUgLmpzLXRvb2x0aXAgY2xhc3NcclxuICAgIHRpcHB5KCcuanMtdG9vbHRpcCcsIHsgXHJcbiAgICAgICAgZHVyYXRpb246IDAsXHJcbiAgICAgICAgYXJyb3c6IHRydWVcclxuICAgIH0pO1xyXG59O1xyXG5cclxuZG9tcmVhZHkoKCkgPT4ge1xyXG4gICAgaW5pdFRpcHB5KCk7XHJcbn0pO1xyXG5cclxuXHJcblxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBwcmVmaXg6ICcnLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBkb21yZWFkeSA9IHJlcXVpcmUoJ2RvbXJlYWR5Jyk7XG5jb25zdCBmb3JFYWNoID0gcmVxdWlyZSgnYXJyYXktZm9yZWFjaCcpO1xuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi91dGlscy9zZWxlY3QnKTtcbmNvbnN0IG1vZGFsID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL21vZGFsJyk7XG5jb25zdCB0YWJsZSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy90YWJsZScpO1xuY29uc3QgdG9vbHRpcCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy90b29sdGlwJyk7XG5jb25zdCBkcm9wZG93biA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kcm9wZG93bicpO1xuY29uc3QgcmFkaW9Ub2dnbGVDb250ZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50Jyk7XG5jb25zdCBjaGVja2JveFRvZ2dsZUNvbnRlbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnKTtcblxuXG4vKipcbiAqIFRoZSAncG9seWZpbGxzJyBkZWZpbmUga2V5IEVDTUFTY3JpcHQgNSBtZXRob2RzIHRoYXQgbWF5IGJlIG1pc3NpbmcgZnJvbVxuICogb2xkZXIgYnJvd3NlcnMsIHNvIG11c3QgYmUgbG9hZGVkIGZpcnN0LlxuICovXG5yZXF1aXJlKCcuL3BvbHlmaWxscycpO1xuXG5jb25zdCBka2ZkcyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XG5cbmNvbnN0IGNvbXBvbmVudHMgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMnKTtcbmRrZmRzLmNvbXBvbmVudHMgPSBjb21wb25lbnRzO1xuXG5kb21yZWFkeSgoKSA9PiB7XG4gIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LmJvZHk7XG4gIGZvciAobGV0IG5hbWUgaW4gY29tcG9uZW50cykge1xuICAgIGNvbnN0IGJlaGF2aW9yID0gY29tcG9uZW50c1sgbmFtZSBdO1xuICAgIGJlaGF2aW9yLm9uKHRhcmdldCk7XG4gIH1cblxuICBjb25zdCBqc1NlbGVjdG9yRHJvcGRvd24gPSAnLmpzLWRyb3Bkb3duJztcbiAgZm9yRWFjaChzZWxlY3QoanNTZWxlY3RvckRyb3Bkb3duKSwgZHJvcGRvd25FbGVtZW50ID0+IHtcbiAgICBuZXcgZHJvcGRvd24oZHJvcGRvd25FbGVtZW50KTtcbiAgfSk7XG5cbiAgY29uc3QganNSYWRpb1RvZ2dsZUdyb3VwID0gJy5qcy1yYWRpby10b2dnbGUtZ3JvdXAnO1xuICBmb3JFYWNoKHNlbGVjdChqc1JhZGlvVG9nZ2xlR3JvdXApLCB0b2dnbGVFbGVtZW50ID0+IHtcbiAgICBuZXcgcmFkaW9Ub2dnbGVDb250ZW50KHRvZ2dsZUVsZW1lbnQpO1xuICB9KTtcblxuICBjb25zdCBqc0NoZWNrYm94VG9nZ2xlQ29udGVudCA9ICcuanMtY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnO1xuICBmb3JFYWNoKHNlbGVjdChqc0NoZWNrYm94VG9nZ2xlQ29udGVudCksIHRvZ2dsZUVsZW1lbnQgPT4ge1xuICAgIG5ldyBjaGVja2JveFRvZ2dsZUNvbnRlbnQodG9nZ2xlRWxlbWVudCk7XG4gIH0pO1xuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBka2ZkcztcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIC8vIFRoaXMgdXNlZCB0byBiZSBjb25kaXRpb25hbGx5IGRlcGVuZGVudCBvbiB3aGV0aGVyIHRoZVxyXG4gIC8vIGJyb3dzZXIgc3VwcG9ydGVkIHRvdWNoIGV2ZW50czsgaWYgaXQgZGlkLCBgQ0xJQ0tgIHdhcyBzZXQgdG9cclxuICAvLyBgdG91Y2hzdGFydGAuICBIb3dldmVyLCB0aGlzIGhhZCBkb3duc2lkZXM6XHJcbiAgLy9cclxuICAvLyAqIEl0IHByZS1lbXB0ZWQgbW9iaWxlIGJyb3dzZXJzJyBkZWZhdWx0IGJlaGF2aW9yIG9mIGRldGVjdGluZ1xyXG4gIC8vICAgd2hldGhlciBhIHRvdWNoIHR1cm5lZCBpbnRvIGEgc2Nyb2xsLCB0aGVyZWJ5IHByZXZlbnRpbmdcclxuICAvLyAgIHVzZXJzIGZyb20gdXNpbmcgc29tZSBvZiBvdXIgY29tcG9uZW50cyBhcyBzY3JvbGwgc3VyZmFjZXMuXHJcbiAgLy9cclxuICAvLyAqIFNvbWUgZGV2aWNlcywgc3VjaCBhcyB0aGUgTWljcm9zb2Z0IFN1cmZhY2UgUHJvLCBzdXBwb3J0ICpib3RoKlxyXG4gIC8vICAgdG91Y2ggYW5kIGNsaWNrcy4gVGhpcyBtZWFudCB0aGUgY29uZGl0aW9uYWwgZWZmZWN0aXZlbHkgZHJvcHBlZFxyXG4gIC8vICAgc3VwcG9ydCBmb3IgdGhlIHVzZXIncyBtb3VzZSwgZnJ1c3RyYXRpbmcgdXNlcnMgd2hvIHByZWZlcnJlZFxyXG4gIC8vICAgaXQgb24gdGhvc2Ugc3lzdGVtcy5cclxuICBDTElDSzogJ2NsaWNrJyxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBlbHByb3RvID0gd2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZTtcclxuY29uc3QgSElEREVOID0gJ2hpZGRlbic7XHJcblxyXG5pZiAoIShISURERU4gaW4gZWxwcm90bykpIHtcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxwcm90bywgSElEREVOLCB7XHJcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEhJRERFTik7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoSElEREVOLCAnJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NMaXN0IGFuZCBET01Ub2tlbkxpc3RcclxucmVxdWlyZSgnY2xhc3NsaXN0LXBvbHlmaWxsJyk7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZGVuXHJcbnJlcXVpcmUoJy4vZWxlbWVudC1oaWRkZW4nKTtcclxuXHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vb2JqZWN0L2Fzc2lnbicpO1xyXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL2FycmF5L2Zyb20nKTsiLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuY29uc3QgQmVoYXZpb3IgPSByZXF1aXJlKCdyZWNlcHRvci9iZWhhdmlvcicpO1xyXG5cclxuY29uc3Qgc2VxdWVuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgY29uc3Qgc2VxID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICBpZiAoIXRhcmdldCkge1xyXG4gICAgICB0YXJnZXQgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgfVxyXG4gICAgZm9yRWFjaChzZXEsIG1ldGhvZCA9PiB7XHJcbiAgICAgIGlmICh0eXBlb2YgdGhpc1sgbWV0aG9kIF0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB0aGlzWyBtZXRob2QgXS5jYWxsKHRoaXMsIHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogQG5hbWUgYmVoYXZpb3JcclxuICogQHBhcmFtIHtvYmplY3R9IGV2ZW50c1xyXG4gKiBAcGFyYW0ge29iamVjdD99IHByb3BzXHJcbiAqIEByZXR1cm4ge3JlY2VwdG9yLmJlaGF2aW9yfVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoZXZlbnRzLCBwcm9wcykgPT4ge1xyXG4gIHJldHVybiBCZWhhdmlvcihldmVudHMsIGFzc2lnbih7XHJcbiAgICBvbjogICBzZXF1ZW5jZSgnaW5pdCcsICdhZGQnKSxcclxuICAgIG9mZjogIHNlcXVlbmNlKCd0ZWFyZG93bicsICdyZW1vdmUnKSxcclxuICB9LCBwcm9wcykpO1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQG5hbWUgY2xvc2VzdFxyXG4gKiBAZGVzYyBnZXQgbmVhcmVzdCBwYXJlbnQgZWxlbWVudCBtYXRjaGluZyBzZWxlY3Rvci5cclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBUaGUgSFRNTCBlbGVtZW50IHdoZXJlIHRoZSBzZWFyY2ggc3RhcnRzLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBTZWxlY3RvciB0byBiZSBmb3VuZC5cclxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9IC0gTmVhcmVzdCBwYXJlbnQgZWxlbWVudCBtYXRjaGluZyBzZWxlY3Rvci5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xvc2VzdCAoZWwsIHNlbGVjdG9yKSB7XHJcbiAgdmFyIG1hdGNoZXNTZWxlY3RvciA9IGVsLm1hdGNoZXMgfHwgZWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGVsLm1vek1hdGNoZXNTZWxlY3RvciB8fCBlbC5tc01hdGNoZXNTZWxlY3RvcjtcclxuXHJcbiAgd2hpbGUgKGVsKSB7XHJcbiAgICAgIGlmIChtYXRjaGVzU2VsZWN0b3IuY2FsbChlbCwgc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgfVxyXG4gIHJldHVybiBlbDtcclxufTtcclxuIiwiLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzNcclxuZnVuY3Rpb24gaXNFbGVtZW50SW5WaWV3cG9ydCAoZWwsIHdpbj13aW5kb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICByZWN0LnRvcCA+PSAwICYmXHJcbiAgICByZWN0LmxlZnQgPj0gMCAmJlxyXG4gICAgcmVjdC5ib3R0b20gPD0gKHdpbi5pbm5lckhlaWdodCB8fCBkb2NFbC5jbGllbnRIZWlnaHQpICYmXHJcbiAgICByZWN0LnJpZ2h0IDw9ICh3aW4uaW5uZXJXaWR0aCB8fCBkb2NFbC5jbGllbnRXaWR0aClcclxuICApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudEluVmlld3BvcnQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBpc0VsZW1lbnRcclxuICogQGRlc2MgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudC5cclxuICogQHBhcmFtIHthbnl9IHZhbHVlXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VsZW1lbnQgPSB2YWx1ZSA9PiB7XHJcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUubm9kZVR5cGUgPT09IDE7XHJcbn07XHJcblxyXG4vKipcclxuICogQG5hbWUgc2VsZWN0XHJcbiAqIEBkZXNjIHNlbGVjdHMgZWxlbWVudHMgZnJvbSB0aGUgRE9NIGJ5IGNsYXNzIHNlbGVjdG9yIG9yIElEIHNlbGVjdG9yLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBUaGUgc2VsZWN0b3IgdG8gdHJhdmVyc2UgdGhlIERPTSB3aXRoLlxyXG4gKiBAcGFyYW0ge0RvY3VtZW50fEhUTUxFbGVtZW50P30gY29udGV4dCAtIFRoZSBjb250ZXh0IHRvIHRyYXZlcnNlIHRoZSBET01cclxuICogICBpbi4gSWYgbm90IHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byB0aGUgZG9jdW1lbnQuXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50W119IC0gQW4gYXJyYXkgb2YgRE9NIG5vZGVzIG9yIGFuIGVtcHR5IGFycmF5LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZWxlY3QgKHNlbGVjdG9yLCBjb250ZXh0KSB7XHJcblxyXG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBpZiAoIWNvbnRleHQgfHwgIWlzRWxlbWVudChjb250ZXh0KSkge1xyXG4gICAgY29udGV4dCA9IHdpbmRvdy5kb2N1bWVudDtcclxuICB9XHJcblxyXG4gIGNvbnN0IHNlbGVjdGlvbiA9IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGVjdGlvbik7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XHJcbmNvbnN0IENPTlRST0xTID0gJ2FyaWEtY29udHJvbHMnO1xyXG5jb25zdCBISURERU4gPSAnYXJpYS1oaWRkZW4nO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoYnV0dG9uLCBleHBhbmRlZCkgPT4ge1xyXG5cclxuICBpZiAodHlwZW9mIGV4cGFuZGVkICE9PSAnYm9vbGVhbicpIHtcclxuICAgIGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICdmYWxzZSc7XHJcbiAgfVxyXG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoRVhQQU5ERUQsIGV4cGFuZGVkKTtcclxuXHJcbiAgY29uc3QgaWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKENPTlRST0xTKTtcclxuICBjb25zdCBjb250cm9scyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICBpZiAoIWNvbnRyb2xzKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICdObyB0b2dnbGUgdGFyZ2V0IGZvdW5kIHdpdGggaWQ6IFwiJyArIGlkICsgJ1wiJ1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGNvbnRyb2xzLnNldEF0dHJpYnV0ZShISURERU4sICFleHBhbmRlZCk7XHJcbiAgcmV0dXJuIGV4cGFuZGVkO1xyXG59O1xyXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xyXG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcclxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxyXG5cdChnbG9iYWwuTWljcm9Nb2RhbCA9IGZhY3RvcnkoKSk7XHJcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHZlcnNpb24gPSBcIjAuMy4xXCI7XHJcblxyXG52YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XHJcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XHJcbiAgfVxyXG59O1xyXG5cclxudmFyIGNyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xyXG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xyXG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XHJcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcclxuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcclxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcclxuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XHJcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcclxuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcclxuICB9O1xyXG59KCk7XHJcblxyXG52YXIgdG9Db25zdW1hYmxlQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcclxuXHJcbiAgICByZXR1cm4gYXJyMjtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIEFycmF5LmZyb20oYXJyKTtcclxuICB9XHJcbn07XHJcblxyXG52YXIgTWljcm9Nb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgdmFyIEZPQ1VTQUJMRV9FTEVNRU5UUyA9IFsnYVtocmVmXScsICdhcmVhW2hyZWZdJywgJ2lucHV0Om5vdChbZGlzYWJsZWRdKTpub3QoW3R5cGU9XCJoaWRkZW5cIl0pOm5vdChbYXJpYS1oaWRkZW5dKScsICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW5dKScsICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbl0pJywgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbl0pJywgJ2lmcmFtZScsICdvYmplY3QnLCAnZW1iZWQnLCAnW2NvbnRlbnRlZGl0YWJsZV0nLCAnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4Xj1cIi1cIl0pJ107XHJcblxyXG4gIHZhciBNb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIE1vZGFsKF9yZWYpIHtcclxuICAgICAgdmFyIHRhcmdldE1vZGFsID0gX3JlZi50YXJnZXRNb2RhbCxcclxuICAgICAgICAgIF9yZWYkdHJpZ2dlcnMgPSBfcmVmLnRyaWdnZXJzLFxyXG4gICAgICAgICAgdHJpZ2dlcnMgPSBfcmVmJHRyaWdnZXJzID09PSB1bmRlZmluZWQgPyBbXSA6IF9yZWYkdHJpZ2dlcnMsXHJcbiAgICAgICAgICBfcmVmJG9uU2hvdyA9IF9yZWYub25TaG93LFxyXG4gICAgICAgICAgb25TaG93ID0gX3JlZiRvblNob3cgPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uICgpIHt9IDogX3JlZiRvblNob3csXHJcbiAgICAgICAgICBfcmVmJG9uQ2xvc2UgPSBfcmVmLm9uQ2xvc2UsXHJcbiAgICAgICAgICBvbkNsb3NlID0gX3JlZiRvbkNsb3NlID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoKSB7fSA6IF9yZWYkb25DbG9zZSxcclxuICAgICAgICAgIF9yZWYkb3BlblRyaWdnZXIgPSBfcmVmLm9wZW5UcmlnZ2VyLFxyXG4gICAgICAgICAgb3BlblRyaWdnZXIgPSBfcmVmJG9wZW5UcmlnZ2VyID09PSB1bmRlZmluZWQgPyAnZGF0YS1taWNyb21vZGFsLXRyaWdnZXInIDogX3JlZiRvcGVuVHJpZ2dlcixcclxuICAgICAgICAgIF9yZWYkY2xvc2VUcmlnZ2VyID0gX3JlZi5jbG9zZVRyaWdnZXIsXHJcbiAgICAgICAgICBjbG9zZVRyaWdnZXIgPSBfcmVmJGNsb3NlVHJpZ2dlciA9PT0gdW5kZWZpbmVkID8gJ2RhdGEtbWljcm9tb2RhbC1jbG9zZScgOiBfcmVmJGNsb3NlVHJpZ2dlcixcclxuICAgICAgICAgIF9yZWYkZGlzYWJsZVNjcm9sbCA9IF9yZWYuZGlzYWJsZVNjcm9sbCxcclxuICAgICAgICAgIGRpc2FibGVTY3JvbGwgPSBfcmVmJGRpc2FibGVTY3JvbGwgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRkaXNhYmxlU2Nyb2xsLFxyXG4gICAgICAgICAgX3JlZiRkaXNhYmxlRm9jdXMgPSBfcmVmLmRpc2FibGVGb2N1cyxcclxuICAgICAgICAgIGRpc2FibGVGb2N1cyA9IF9yZWYkZGlzYWJsZUZvY3VzID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IF9yZWYkZGlzYWJsZUZvY3VzLFxyXG4gICAgICAgICAgX3JlZiRhd2FpdENsb3NlQW5pbWF0ID0gX3JlZi5hd2FpdENsb3NlQW5pbWF0aW9uLFxyXG4gICAgICAgICAgYXdhaXRDbG9zZUFuaW1hdGlvbiA9IF9yZWYkYXdhaXRDbG9zZUFuaW1hdCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJGF3YWl0Q2xvc2VBbmltYXQsXHJcbiAgICAgICAgICBfcmVmJGRlYnVnTW9kZSA9IF9yZWYuZGVidWdNb2RlLFxyXG4gICAgICAgICAgZGVidWdNb2RlID0gX3JlZiRkZWJ1Z01vZGUgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRkZWJ1Z01vZGU7XHJcbiAgICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIE1vZGFsKTtcclxuXHJcbiAgICAgIC8vIFNhdmUgYSByZWZlcmVuY2Ugb2YgdGhlIG1vZGFsXHJcbiAgICAgIHRoaXMubW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRNb2RhbCk7XHJcblxyXG4gICAgICAvLyBTYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBwYXNzZWQgY29uZmlnXHJcbiAgICAgIHRoaXMuY29uZmlnID0geyBkZWJ1Z01vZGU6IGRlYnVnTW9kZSwgZGlzYWJsZVNjcm9sbDogZGlzYWJsZVNjcm9sbCwgb3BlblRyaWdnZXI6IG9wZW5UcmlnZ2VyLCBjbG9zZVRyaWdnZXI6IGNsb3NlVHJpZ2dlciwgb25TaG93OiBvblNob3csIG9uQ2xvc2U6IG9uQ2xvc2UsIGF3YWl0Q2xvc2VBbmltYXRpb246IGF3YWl0Q2xvc2VBbmltYXRpb24sIGRpc2FibGVGb2N1czogZGlzYWJsZUZvY3VzXHJcblxyXG4gICAgICAgIC8vIFJlZ2lzdGVyIGNsaWNrIGV2ZW50cyBvbmx5IGlmIHByZWJpbmRpbmcgZXZlbnRMaXN0ZW5lcnNcclxuICAgICAgfTtpZiAodHJpZ2dlcnMubGVuZ3RoID4gMCkgdGhpcy5yZWdpc3RlclRyaWdnZXJzLmFwcGx5KHRoaXMsIHRvQ29uc3VtYWJsZUFycmF5KHRyaWdnZXJzKSk7XHJcblxyXG4gICAgICAvLyBwcmViaW5kIGZ1bmN0aW9ucyBmb3IgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICAgIHRoaXMub25DbGljayA9IHRoaXMub25DbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICB0aGlzLm9uS2V5ZG93biA9IHRoaXMub25LZXlkb3duLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb29wcyB0aHJvdWdoIGFsbCBvcGVuVHJpZ2dlcnMgYW5kIGJpbmRzIGNsaWNrIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0gIHthcnJheX0gdHJpZ2dlcnMgW0FycmF5IG9mIG5vZGUgZWxlbWVudHNdXHJcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAgICovXHJcblxyXG5cclxuICAgIGNyZWF0ZUNsYXNzKE1vZGFsLCBbe1xyXG4gICAgICBrZXk6ICdyZWdpc3RlclRyaWdnZXJzJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlZ2lzdGVyVHJpZ2dlcnMoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHRyaWdnZXJzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XHJcbiAgICAgICAgICB0cmlnZ2Vyc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyaWdnZXJzLmZvckVhY2goZnVuY3Rpb24gKHRyaWdnZXIpIHtcclxuICAgICAgICAgIHRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5zaG93TW9kYWwoKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ3Nob3dNb2RhbCcsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzaG93TW9kYWwoKSB7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuICAgICAgICB0aGlzLm1vZGFsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICB0aGlzLm1vZGFsLmNsYXNzTGlzdC5hZGQoJ2lzLW9wZW4nKTtcclxuICAgICAgICB0aGlzLnNldEZvY3VzVG9GaXJzdE5vZGUoKTtcclxuICAgICAgICB0aGlzLnNjcm9sbEJlaGF2aW91cignZGlzYWJsZScpO1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgICAgICB0aGlzLmNvbmZpZy5vblNob3codGhpcy5tb2RhbCk7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnY2xvc2VNb2RhbCcsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xyXG4gICAgICAgIHZhciBtb2RhbCA9IHRoaXMubW9kYWw7XHJcbiAgICAgICAgdGhpcy5tb2RhbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxCZWhhdmlvdXIoJ2VuYWJsZScpO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgIHRoaXMuY29uZmlnLm9uQ2xvc2UodGhpcy5tb2RhbCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5hd2FpdENsb3NlQW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICB0aGlzLm1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XHJcbiAgICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKTtcclxuICAgICAgICAgICAgbW9kYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgaGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ3Njcm9sbEJlaGF2aW91cicsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzY3JvbGxCZWhhdmlvdXIodG9nZ2xlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5kaXNhYmxlU2Nyb2xsKSByZXR1cm47XHJcbiAgICAgICAgdmFyIGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcbiAgICAgICAgc3dpdGNoICh0b2dnbGUpIHtcclxuICAgICAgICAgIGNhc2UgJ2VuYWJsZSc6XHJcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oYm9keS5zdHlsZSwgeyBvdmVyZmxvdzogJ2luaXRpYWwnLCBoZWlnaHQ6ICdpbml0aWFsJyB9KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdkaXNhYmxlJzpcclxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihib2R5LnN0eWxlLCB7IG92ZXJmbG93OiAnaGlkZGVuJywgaGVpZ2h0OiAnMTAwdmgnIH0pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ2FkZEV2ZW50TGlzdGVuZXJzJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHRoaXMubW9kYWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25DbGljayk7XHJcbiAgICAgICAgdGhpcy5tb2RhbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljayk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25LZXlkb3duKTtcclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICdyZW1vdmVFdmVudExpc3RlbmVycycsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcclxuICAgICAgICB0aGlzLm1vZGFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uQ2xpY2spO1xyXG4gICAgICAgIHRoaXMubW9kYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2spO1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLm9uS2V5ZG93bik7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnb25DbGljaycsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5oYXNBdHRyaWJ1dGUodGhpcy5jb25maWcuY2xvc2VUcmlnZ2VyKSkge1xyXG4gICAgICAgICAgdGhpcy5jbG9zZU1vZGFsKCk7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSwge1xyXG4gICAgICBrZXk6ICdvbktleWRvd24nLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gb25LZXlkb3duKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDI3KSB0aGlzLmNsb3NlTW9kYWwoZXZlbnQpO1xyXG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSA5KSB0aGlzLm1haW50YWluRm9jdXMoZXZlbnQpO1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ2dldEZvY3VzYWJsZU5vZGVzJyxcclxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEZvY3VzYWJsZU5vZGVzKCkge1xyXG4gICAgICAgIHZhciBub2RlcyA9IHRoaXMubW9kYWwucXVlcnlTZWxlY3RvckFsbChGT0NVU0FCTEVfRUxFTUVOVFMpO1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhub2RlcykubWFwKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgIHJldHVybiBub2Rlc1trZXldO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgIGtleTogJ3NldEZvY3VzVG9GaXJzdE5vZGUnLFxyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0Rm9jdXNUb0ZpcnN0Tm9kZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jb25maWcuZGlzYWJsZUZvY3VzKSByZXR1cm47XHJcbiAgICAgICAgdmFyIGZvY3VzYWJsZU5vZGVzID0gdGhpcy5nZXRGb2N1c2FibGVOb2RlcygpO1xyXG4gICAgICAgIGlmIChmb2N1c2FibGVOb2Rlcy5sZW5ndGgpIGZvY3VzYWJsZU5vZGVzWzBdLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIHtcclxuICAgICAga2V5OiAnbWFpbnRhaW5Gb2N1cycsXHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBtYWludGFpbkZvY3VzKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIGZvY3VzYWJsZU5vZGVzID0gdGhpcy5nZXRGb2N1c2FibGVOb2RlcygpO1xyXG5cclxuICAgICAgICAvLyBpZiBkaXNhYmxlRm9jdXMgaXMgdHJ1ZVxyXG4gICAgICAgIGlmICghdGhpcy5tb2RhbC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xyXG4gICAgICAgICAgZm9jdXNhYmxlTm9kZXNbMF0uZm9jdXMoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFyIGZvY3VzZWRJdGVtSW5kZXggPSBmb2N1c2FibGVOb2Rlcy5pbmRleE9mKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgIGlmIChldmVudC5zaGlmdEtleSAmJiBmb2N1c2VkSXRlbUluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgIGZvY3VzYWJsZU5vZGVzW2ZvY3VzYWJsZU5vZGVzLmxlbmd0aCAtIDFdLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKCFldmVudC5zaGlmdEtleSAmJiBmb2N1c2VkSXRlbUluZGV4ID09PSBmb2N1c2FibGVOb2Rlcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgIGZvY3VzYWJsZU5vZGVzWzBdLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XSk7XHJcbiAgICByZXR1cm4gTW9kYWw7XHJcbiAgfSgpO1xyXG5cclxuICAvKipcclxuICAgKiBNb2RhbCBwcm90b3R5cGUgZW5kcy5cclxuICAgKiBIZXJlIG9uIGNvZGUgaXMgcmVwb3NpYmxlIGZvciBkZXRlY3RpbmcgYW5kXHJcbiAgICogYXV0b2JpbmRpbmcgZXZlbnQgaGFuZGxlcnMgb24gbW9kYWwgdHJpZ2dlcnNcclxuICAgKi9cclxuXHJcbiAgLy8gS2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgb3BlbmVkIG1vZGFsXHJcblxyXG5cclxuICB2YXIgYWN0aXZlTW9kYWwgPSBudWxsO1xyXG5cclxuICAvKipcclxuICAgKiBHZW5lcmF0ZXMgYW4gYXNzb2NpYXRpdmUgYXJyYXkgb2YgbW9kYWxzIGFuZCBpdCdzXHJcbiAgICogcmVzcGVjdGl2ZSB0cmlnZ2Vyc1xyXG4gICAqIEBwYXJhbSAge2FycmF5fSB0cmlnZ2VycyAgICAgQW4gYXJyYXkgb2YgYWxsIHRyaWdnZXJzXHJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0cmlnZ2VyQXR0ciBUaGUgZGF0YS1hdHRyaWJ1dGUgd2hpY2ggdHJpZ2dlcnMgdGhlIG1vZHVsZVxyXG4gICAqIEByZXR1cm4ge2FycmF5fVxyXG4gICAqL1xyXG4gIHZhciBnZW5lcmF0ZVRyaWdnZXJNYXAgPSBmdW5jdGlvbiBnZW5lcmF0ZVRyaWdnZXJNYXAodHJpZ2dlcnMsIHRyaWdnZXJBdHRyKSB7XHJcbiAgICB2YXIgdHJpZ2dlck1hcCA9IFtdO1xyXG5cclxuICAgIHRyaWdnZXJzLmZvckVhY2goZnVuY3Rpb24gKHRyaWdnZXIpIHtcclxuICAgICAgdmFyIHRhcmdldE1vZGFsID0gdHJpZ2dlci5hdHRyaWJ1dGVzW3RyaWdnZXJBdHRyXS52YWx1ZTtcclxuICAgICAgaWYgKHRyaWdnZXJNYXBbdGFyZ2V0TW9kYWxdID09PSB1bmRlZmluZWQpIHRyaWdnZXJNYXBbdGFyZ2V0TW9kYWxdID0gW107XHJcbiAgICAgIHRyaWdnZXJNYXBbdGFyZ2V0TW9kYWxdLnB1c2godHJpZ2dlcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdHJpZ2dlck1hcDtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBWYWxpZGF0ZXMgd2hldGhlciBhIG1vZGFsIG9mIHRoZSBnaXZlbiBpZCBleGlzdHNcclxuICAgKiBpbiB0aGUgRE9NXHJcbiAgICogQHBhcmFtICB7bnVtYmVyfSBpZCAgVGhlIGlkIG9mIHRoZSBtb2RhbFxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgdmFyIHZhbGlkYXRlTW9kYWxQcmVzZW5jZSA9IGZ1bmN0aW9uIHZhbGlkYXRlTW9kYWxQcmVzZW5jZShpZCkge1xyXG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdNaWNyb01vZGFsIHYnICsgdmVyc2lvbiArICc6IFxcdTI3NTdTZWVtcyBsaWtlIHlvdSBoYXZlIG1pc3NlZCAlY1xcJycgKyBpZCArICdcXCcnLCAnYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjlmYTtjb2xvcjogIzUwNTk2Yztmb250LXdlaWdodDogYm9sZDsnLCAnSUQgc29tZXdoZXJlIGluIHlvdXIgY29kZS4gUmVmZXIgZXhhbXBsZSBiZWxvdyB0byByZXNvbHZlIGl0LicpO1xyXG4gICAgICBjb25zb2xlLndhcm4oJyVjRXhhbXBsZTonLCAnYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjlmYTtjb2xvcjogIzUwNTk2Yztmb250LXdlaWdodDogYm9sZDsnLCAnPGRpdiBjbGFzcz1cIm1vZGFsXCIgaWQ9XCInICsgaWQgKyAnXCI+PC9kaXY+Jyk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBWYWxpZGF0ZXMgaWYgdGhlcmUgYXJlIG1vZGFsIHRyaWdnZXJzIHByZXNlbnRcclxuICAgKiBpbiB0aGUgRE9NXHJcbiAgICogQHBhcmFtICB7YXJyYXl9IHRyaWdnZXJzIEFuIGFycmF5IG9mIGRhdGEtdHJpZ2dlcnNcclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxyXG4gICAqL1xyXG4gIHZhciB2YWxpZGF0ZVRyaWdnZXJQcmVzZW5jZSA9IGZ1bmN0aW9uIHZhbGlkYXRlVHJpZ2dlclByZXNlbmNlKHRyaWdnZXJzKSB7XHJcbiAgICBpZiAodHJpZ2dlcnMubGVuZ3RoIDw9IDApIHtcclxuICAgICAgY29uc29sZS53YXJuKCdNaWNyb01vZGFsIHYnICsgdmVyc2lvbiArICc6IFxcdTI3NTdQbGVhc2Ugc3BlY2lmeSBhdCBsZWFzdCBvbmUgJWNcXCdtaWNyb21vZGFsLXRyaWdnZXJcXCcnLCAnYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjlmYTtjb2xvcjogIzUwNTk2Yztmb250LXdlaWdodDogYm9sZDsnLCAnZGF0YSBhdHRyaWJ1dGUuJyk7XHJcbiAgICAgIGNvbnNvbGUud2FybignJWNFeGFtcGxlOicsICdiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmOWZhO2NvbG9yOiAjNTA1OTZjO2ZvbnQtd2VpZ2h0OiBib2xkOycsICc8YSBocmVmPVwiI1wiIGRhdGEtbWljcm9tb2RhbC10cmlnZ2VyPVwibXktbW9kYWxcIj48L2E+Jyk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBDaGVja3MgaWYgdHJpZ2dlcnMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgbW9kYWxzXHJcbiAgICogYXJlIHByZXNlbnQgaW4gdGhlIERPTVxyXG4gICAqIEBwYXJhbSAge2FycmF5fSB0cmlnZ2VycyAgIEFycmF5IG9mIERPTSBub2RlcyB3aGljaCBoYXZlIGRhdGEtdHJpZ2dlcnNcclxuICAgKiBAcGFyYW0gIHthcnJheX0gdHJpZ2dlck1hcCBBc3NvY2lhdGl2ZSBhcnJheSBvZiBtb2RhbHMgYW5kIHRoaWVyIHRyaWdnZXJzXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgKi9cclxuICB2YXIgdmFsaWRhdGVBcmdzID0gZnVuY3Rpb24gdmFsaWRhdGVBcmdzKHRyaWdnZXJzLCB0cmlnZ2VyTWFwKSB7XHJcbiAgICB2YWxpZGF0ZVRyaWdnZXJQcmVzZW5jZSh0cmlnZ2Vycyk7XHJcbiAgICBpZiAoIXRyaWdnZXJNYXApIHJldHVybiB0cnVlO1xyXG4gICAgZm9yICh2YXIgaWQgaW4gdHJpZ2dlck1hcCkge1xyXG4gICAgICB2YWxpZGF0ZU1vZGFsUHJlc2VuY2UoaWQpO1xyXG4gICAgfXJldHVybiB0cnVlO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEJpbmRzIGNsaWNrIGhhbmRsZXJzIHRvIGFsbCBtb2RhbCB0cmlnZ2Vyc1xyXG4gICAqIEBwYXJhbSAge29iamVjdH0gY29uZmlnIFtkZXNjcmlwdGlvbl1cclxuICAgKiBAcmV0dXJuIHZvaWRcclxuICAgKi9cclxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uIGluaXQoY29uZmlnKSB7XHJcbiAgICAvLyBDcmVhdGUgYW4gY29uZmlnIG9iamVjdCB3aXRoIGRlZmF1bHQgb3BlblRyaWdnZXJcclxuICAgIHZhciBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgeyBvcGVuVHJpZ2dlcjogJ2RhdGEtbWljcm9tb2RhbC10cmlnZ2VyJyB9LCBjb25maWcpO1xyXG5cclxuICAgIC8vIENvbGxlY3RzIGFsbCB0aGUgbm9kZXMgd2l0aCB0aGUgdHJpZ2dlclxyXG4gICAgdmFyIHRyaWdnZXJzID0gW10uY29uY2F0KHRvQ29uc3VtYWJsZUFycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1snICsgb3B0aW9ucy5vcGVuVHJpZ2dlciArICddJykpKTtcclxuXHJcbiAgICAvLyBNYWtlcyBhIG1hcHBpbmdzIG9mIG1vZGFscyB3aXRoIHRoZWlyIHRyaWdnZXIgbm9kZXNcclxuICAgIHZhciB0cmlnZ2VyTWFwID0gZ2VuZXJhdGVUcmlnZ2VyTWFwKHRyaWdnZXJzLCBvcHRpb25zLm9wZW5UcmlnZ2VyKTtcclxuXHJcbiAgICAvLyBDaGVja3MgaWYgbW9kYWxzIGFuZCB0cmlnZ2VycyBleGlzdCBpbiBkb21cclxuICAgIGlmIChvcHRpb25zLmRlYnVnTW9kZSA9PT0gdHJ1ZSAmJiB2YWxpZGF0ZUFyZ3ModHJpZ2dlcnMsIHRyaWdnZXJNYXApID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgIC8vIEZvciBldmVyeSB0YXJnZXQgbW9kYWwgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZVxyXG4gICAgZm9yICh2YXIga2V5IGluIHRyaWdnZXJNYXApIHtcclxuICAgICAgdmFyIHZhbHVlID0gdHJpZ2dlck1hcFtrZXldO1xyXG4gICAgICBvcHRpb25zLnRhcmdldE1vZGFsID0ga2V5O1xyXG4gICAgICBvcHRpb25zLnRyaWdnZXJzID0gW10uY29uY2F0KHRvQ29uc3VtYWJsZUFycmF5KHZhbHVlKSk7XHJcbiAgICAgIG5ldyBNb2RhbChvcHRpb25zKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTaG93cyBhIHBhcnRpY3VsYXIgbW9kYWxcclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRhcmdldE1vZGFsIFtUaGUgaWQgb2YgdGhlIG1vZGFsIHRvIGRpc3BsYXldXHJcbiAgICogQHBhcmFtICB7b2JqZWN0fSBjb25maWcgW1RoZSBjb25maWd1cmF0aW9uIG9iamVjdCB0byBwYXNzXVxyXG4gICAqIEByZXR1cm4ge3ZvaWR9XHJcbiAgICovXHJcbiAgdmFyIHNob3cgPSBmdW5jdGlvbiBzaG93KHRhcmdldE1vZGFsLCBjb25maWcpIHtcclxuICAgIHZhciBvcHRpb25zID0gY29uZmlnIHx8IHt9O1xyXG4gICAgb3B0aW9ucy50YXJnZXRNb2RhbCA9IHRhcmdldE1vZGFsO1xyXG5cclxuICAgIC8vIENoZWNrcyBpZiBtb2RhbHMgYW5kIHRyaWdnZXJzIGV4aXN0IGluIGRvbVxyXG4gICAgaWYgKG9wdGlvbnMuZGVidWdNb2RlID09PSB0cnVlICYmIHZhbGlkYXRlTW9kYWxQcmVzZW5jZSh0YXJnZXRNb2RhbCkgPT09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgLy8gc3RvcmVzIHJlZmVyZW5jZSB0byBhY3RpdmUgbW9kYWxcclxuICAgIGFjdGl2ZU1vZGFsID0gbmV3IE1vZGFsKG9wdGlvbnMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xyXG4gICAgYWN0aXZlTW9kYWwuc2hvd01vZGFsKCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ2xvc2VzIHRoZSBhY3RpdmUgbW9kYWxcclxuICAgKiBAcmV0dXJuIHt2b2lkfVxyXG4gICAqL1xyXG4gIHZhciBjbG9zZSA9IGZ1bmN0aW9uIGNsb3NlKCkge1xyXG4gICAgYWN0aXZlTW9kYWwuY2xvc2VNb2RhbCgpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7IGluaXQ6IGluaXQsIHNob3c6IHNob3csIGNsb3NlOiBjbG9zZSB9O1xyXG59KCk7XHJcblxyXG5yZXR1cm4gTWljcm9Nb2RhbDtcclxuXHJcbn0pKSk7XHJcbiIsIi8qIVxyXG4qIFRpcHB5LmpzIHYyLjUuM1xyXG4qIChjKSAyMDE3LTIwMTggYXRvbWlrc1xyXG4qIE1JVFxyXG4qL1xyXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xyXG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcclxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxyXG5cdChnbG9iYWwudGlwcHkgPSBmYWN0b3J5KCkpO1xyXG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB2ZXJzaW9uID0gXCIyLjUuM1wiO1xyXG5cclxudmFyIGlzQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xyXG5cclxudmFyIGlzSUUgPSBpc0Jyb3dzZXIgJiYgL01TSUUgfFRyaWRlbnRcXC8vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcblxyXG52YXIgYnJvd3NlciA9IHt9O1xyXG5cclxuaWYgKGlzQnJvd3Nlcikge1xyXG4gIGJyb3dzZXIuc3VwcG9ydGVkID0gJ3JlcXVlc3RBbmltYXRpb25GcmFtZScgaW4gd2luZG93O1xyXG4gIGJyb3dzZXIuc3VwcG9ydHNUb3VjaCA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdztcclxuICBicm93c2VyLnVzaW5nVG91Y2ggPSBmYWxzZTtcclxuICBicm93c2VyLmR5bmFtaWNJbnB1dERldGVjdGlvbiA9IHRydWU7XHJcbiAgYnJvd3Nlci5pT1MgPSAvaVBob25lfGlQYWR8aVBvZC8udGVzdChuYXZpZ2F0b3IucGxhdGZvcm0pICYmICF3aW5kb3cuTVNTdHJlYW07XHJcbiAgYnJvd3Nlci5vblVzZXJJbnB1dENoYW5nZSA9IGZ1bmN0aW9uICgpIHt9O1xyXG59XHJcblxyXG4vKipcclxuICogU2VsZWN0b3IgY29uc3RhbnRzIHVzZWQgZm9yIGdyYWJiaW5nIGVsZW1lbnRzXHJcbiAqL1xyXG52YXIgc2VsZWN0b3JzID0ge1xyXG4gIFBPUFBFUjogJy50aXBweS1wb3BwZXInLFxyXG4gIFRPT0xUSVA6ICcudGlwcHktdG9vbHRpcCcsXHJcbiAgQ09OVEVOVDogJy50aXBweS1jb250ZW50JyxcclxuICBCQUNLRFJPUDogJy50aXBweS1iYWNrZHJvcCcsXHJcbiAgQVJST1c6ICcudGlwcHktYXJyb3cnLFxyXG4gIFJPVU5EX0FSUk9XOiAnLnRpcHB5LXJvdW5kYXJyb3cnLFxyXG4gIFJFRkVSRU5DRTogJ1tkYXRhLXRpcHB5XSdcclxufTtcclxuXHJcbnZhciBkZWZhdWx0cyA9IHtcclxuICBwbGFjZW1lbnQ6ICd0b3AnLFxyXG4gIGxpdmVQbGFjZW1lbnQ6IHRydWUsXHJcbiAgdHJpZ2dlcjogJ21vdXNlZW50ZXIgZm9jdXMnLFxyXG4gIGFuaW1hdGlvbjogJ3NoaWZ0LWF3YXknLFxyXG4gIGh0bWw6IGZhbHNlLFxyXG4gIGFuaW1hdGVGaWxsOiB0cnVlLFxyXG4gIGFycm93OiBmYWxzZSxcclxuICBkZWxheTogMCxcclxuICBkdXJhdGlvbjogWzM1MCwgMzAwXSxcclxuICBpbnRlcmFjdGl2ZTogZmFsc2UsXHJcbiAgaW50ZXJhY3RpdmVCb3JkZXI6IDIsXHJcbiAgdGhlbWU6ICdkYXJrJyxcclxuICBzaXplOiAncmVndWxhcicsXHJcbiAgZGlzdGFuY2U6IDEwLFxyXG4gIG9mZnNldDogMCxcclxuICBoaWRlT25DbGljazogdHJ1ZSxcclxuICBtdWx0aXBsZTogZmFsc2UsXHJcbiAgZm9sbG93Q3Vyc29yOiBmYWxzZSxcclxuICBpbmVydGlhOiBmYWxzZSxcclxuICB1cGRhdGVEdXJhdGlvbjogMzUwLFxyXG4gIHN0aWNreTogZmFsc2UsXHJcbiAgYXBwZW5kVG86IGZ1bmN0aW9uIGFwcGVuZFRvKCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmJvZHk7XHJcbiAgfSxcclxuICB6SW5kZXg6IDk5OTksXHJcbiAgdG91Y2hIb2xkOiBmYWxzZSxcclxuICBwZXJmb3JtYW5jZTogZmFsc2UsXHJcbiAgZHluYW1pY1RpdGxlOiBmYWxzZSxcclxuICBmbGlwOiB0cnVlLFxyXG4gIGZsaXBCZWhhdmlvcjogJ2ZsaXAnLFxyXG4gIGFycm93VHlwZTogJ3NoYXJwJyxcclxuICBhcnJvd1RyYW5zZm9ybTogJycsXHJcbiAgbWF4V2lkdGg6ICcnLFxyXG4gIHRhcmdldDogbnVsbCxcclxuICBhbGxvd1RpdGxlSFRNTDogdHJ1ZSxcclxuICBwb3BwZXJPcHRpb25zOiB7fSxcclxuICBjcmVhdGVQb3BwZXJJbnN0YW5jZU9uSW5pdDogZmFsc2UsXHJcbiAgb25TaG93OiBmdW5jdGlvbiBvblNob3coKSB7fSxcclxuICBvblNob3duOiBmdW5jdGlvbiBvblNob3duKCkge30sXHJcbiAgb25IaWRlOiBmdW5jdGlvbiBvbkhpZGUoKSB7fSxcclxuICBvbkhpZGRlbjogZnVuY3Rpb24gb25IaWRkZW4oKSB7fVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBrZXlzIG9mIHRoZSBkZWZhdWx0cyBvYmplY3QgZm9yIHJlZHVjaW5nIGRvd24gaW50byBhIG5ldyBvYmplY3RcclxuICogVXNlZCBpbiBgZ2V0SW5kaXZpZHVhbE9wdGlvbnMoKWBcclxuICovXHJcbnZhciBkZWZhdWx0c0tleXMgPSBicm93c2VyLnN1cHBvcnRlZCAmJiBPYmplY3Qua2V5cyhkZWZhdWx0cyk7XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGFuIG9iamVjdCBsaXRlcmFsXHJcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzT2JqZWN0TGl0ZXJhbCh2YWx1ZSkge1xyXG4gIHJldHVybiB7fS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQb255ZmlsbCBmb3IgQXJyYXkuZnJvbVxyXG4gKiBAcGFyYW0geyp9IHZhbHVlXHJcbiAqIEByZXR1cm4ge0FycmF5fVxyXG4gKi9cclxuZnVuY3Rpb24gdG9BcnJheSh2YWx1ZSkge1xyXG4gIHJldHVybiBbXS5zbGljZS5jYWxsKHZhbHVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYW4gYXJyYXkgb2YgZWxlbWVudHMgYmFzZWQgb24gdGhlIHNlbGVjdG9yIGlucHV0XHJcbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR8RWxlbWVudFtdfE5vZGVMaXN0fE9iamVjdH0gc2VsZWN0b3JcclxuICogQHJldHVybiB7RWxlbWVudFtdfVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QXJyYXlPZkVsZW1lbnRzKHNlbGVjdG9yKSB7XHJcbiAgaWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgRWxlbWVudCB8fCBpc09iamVjdExpdGVyYWwoc2VsZWN0b3IpKSB7XHJcbiAgICByZXR1cm4gW3NlbGVjdG9yXTtcclxuICB9XHJcblxyXG4gIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICByZXR1cm4gdG9BcnJheShzZWxlY3Rvcik7XHJcbiAgfVxyXG5cclxuICBpZiAoQXJyYXkuaXNBcnJheShzZWxlY3RvcikpIHtcclxuICAgIHJldHVybiBzZWxlY3RvcjtcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gdG9BcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XHJcbiAgfSBjYXRjaCAoXykge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFBvbHlmaWxscyBuZWVkZWQgcHJvcHMvbWV0aG9kcyBmb3IgYSB2aXJ0dWFsIHJlZmVyZW5jZSBvYmplY3RcclxuICogTk9URTogaW4gdjMuMCB0aGlzIHdpbGwgYmUgcHVyZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gcmVmZXJlbmNlXHJcbiAqL1xyXG5mdW5jdGlvbiBwb2x5ZmlsbFZpcnR1YWxSZWZlcmVuY2VQcm9wcyhyZWZlcmVuY2UpIHtcclxuICByZWZlcmVuY2UucmVmT2JqID0gdHJ1ZTtcclxuICByZWZlcmVuY2UuYXR0cmlidXRlcyA9IHJlZmVyZW5jZS5hdHRyaWJ1dGVzIHx8IHt9O1xyXG4gIHJlZmVyZW5jZS5zZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcclxuICAgIHJlZmVyZW5jZS5hdHRyaWJ1dGVzW2tleV0gPSB2YWw7XHJcbiAgfTtcclxuICByZWZlcmVuY2UuZ2V0QXR0cmlidXRlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgcmV0dXJuIHJlZmVyZW5jZS5hdHRyaWJ1dGVzW2tleV07XHJcbiAgfTtcclxuICByZWZlcmVuY2UucmVtb3ZlQXR0cmlidXRlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgZGVsZXRlIHJlZmVyZW5jZS5hdHRyaWJ1dGVzW2tleV07XHJcbiAgfTtcclxuICByZWZlcmVuY2UuaGFzQXR0cmlidXRlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgcmV0dXJuIGtleSBpbiByZWZlcmVuY2UuYXR0cmlidXRlcztcclxuICB9O1xyXG4gIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKCkge307XHJcbiAgcmVmZXJlbmNlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7fTtcclxuICByZWZlcmVuY2UuY2xhc3NMaXN0ID0ge1xyXG4gICAgY2xhc3NOYW1lczoge30sXHJcbiAgICBhZGQ6IGZ1bmN0aW9uIGFkZChrZXkpIHtcclxuICAgICAgcmV0dXJuIHJlZmVyZW5jZS5jbGFzc0xpc3QuY2xhc3NOYW1lc1trZXldID0gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcclxuICAgICAgZGVsZXRlIHJlZmVyZW5jZS5jbGFzc0xpc3QuY2xhc3NOYW1lc1trZXldO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBjb250YWluczogZnVuY3Rpb24gY29udGFpbnMoa2V5KSB7XHJcbiAgICAgIHJldHVybiBrZXkgaW4gcmVmZXJlbmNlLmNsYXNzTGlzdC5jbGFzc05hbWVzO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBzdXBwb3J0ZWQgcHJlZml4ZWQgcHJvcGVydHkgLSBvbmx5IGB3ZWJraXRgIGlzIG5lZWRlZCwgYG1vemAsIGBtc2AgYW5kIGBvYCBhcmUgb2Jzb2xldGVcclxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5XHJcbiAqIEByZXR1cm4ge1N0cmluZ30gLSBicm93c2VyIHN1cHBvcnRlZCBwcmVmaXhlZCBwcm9wZXJ0eVxyXG4gKi9cclxuZnVuY3Rpb24gcHJlZml4KHByb3BlcnR5KSB7XHJcbiAgdmFyIHByZWZpeGVzID0gWycnLCAnd2Via2l0J107XHJcbiAgdmFyIHVwcGVyUHJvcCA9IHByb3BlcnR5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHkuc2xpY2UoMSk7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBfcHJlZml4ID0gcHJlZml4ZXNbaV07XHJcbiAgICB2YXIgcHJlZml4ZWRQcm9wID0gX3ByZWZpeCA/IF9wcmVmaXggKyB1cHBlclByb3AgOiBwcm9wZXJ0eTtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuYm9keS5zdHlsZVtwcmVmaXhlZFByb3BdICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICByZXR1cm4gcHJlZml4ZWRQcm9wO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgZGl2IGVsZW1lbnRcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbmZ1bmN0aW9uIGRpdigpIHtcclxuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgcG9wcGVyIGVsZW1lbnQgdGhlbiByZXR1cm5zIGl0XHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCAtIHRoZSBwb3BwZXIgaWRcclxuICogQHBhcmFtIHtTdHJpbmd9IHRpdGxlIC0gdGhlIHRvb2x0aXAncyBgdGl0bGVgIGF0dHJpYnV0ZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIGluZGl2aWR1YWwgb3B0aW9uc1xyXG4gKiBAcmV0dXJuIHtFbGVtZW50fSAtIHRoZSBwb3BwZXIgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlUG9wcGVyRWxlbWVudChpZCwgdGl0bGUsIG9wdGlvbnMpIHtcclxuICB2YXIgcG9wcGVyID0gZGl2KCk7XHJcbiAgcG9wcGVyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndGlwcHktcG9wcGVyJyk7XHJcbiAgcG9wcGVyLnNldEF0dHJpYnV0ZSgncm9sZScsICd0b29sdGlwJyk7XHJcbiAgcG9wcGVyLnNldEF0dHJpYnV0ZSgnaWQnLCAndGlwcHktJyArIGlkKTtcclxuICBwb3BwZXIuc3R5bGUuekluZGV4ID0gb3B0aW9ucy56SW5kZXg7XHJcbiAgcG9wcGVyLnN0eWxlLm1heFdpZHRoID0gb3B0aW9ucy5tYXhXaWR0aDtcclxuXHJcbiAgdmFyIHRvb2x0aXAgPSBkaXYoKTtcclxuICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndGlwcHktdG9vbHRpcCcpO1xyXG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLXNpemUnLCBvcHRpb25zLnNpemUpO1xyXG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLWFuaW1hdGlvbicsIG9wdGlvbnMuYW5pbWF0aW9uKTtcclxuICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0ZScsICdoaWRkZW4nKTtcclxuICBvcHRpb25zLnRoZW1lLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAodCkge1xyXG4gICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKHQgKyAnLXRoZW1lJyk7XHJcbiAgfSk7XHJcblxyXG4gIHZhciBjb250ZW50ID0gZGl2KCk7XHJcbiAgY29udGVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RpcHB5LWNvbnRlbnQnKTtcclxuXHJcbiAgaWYgKG9wdGlvbnMuYXJyb3cpIHtcclxuICAgIHZhciBhcnJvdyA9IGRpdigpO1xyXG4gICAgYXJyb3cuc3R5bGVbcHJlZml4KCd0cmFuc2Zvcm0nKV0gPSBvcHRpb25zLmFycm93VHJhbnNmb3JtO1xyXG5cclxuICAgIGlmIChvcHRpb25zLmFycm93VHlwZSA9PT0gJ3JvdW5kJykge1xyXG4gICAgICBhcnJvdy5jbGFzc0xpc3QuYWRkKCd0aXBweS1yb3VuZGFycm93Jyk7XHJcbiAgICAgIGFycm93LmlubmVySFRNTCA9ICc8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgOFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj48cGF0aCBkPVwiTTMgOHMyLjAyMS0uMDE1IDUuMjUzLTQuMjE4QzkuNTg0IDIuMDUxIDEwLjc5NyAxLjAwNyAxMiAxYzEuMjAzLS4wMDcgMi40MTYgMS4wMzUgMy43NjEgMi43ODJDMTkuMDEyIDguMDA1IDIxIDggMjEgOEgzelwiLz48L3N2Zz4nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXJyb3cuY2xhc3NMaXN0LmFkZCgndGlwcHktYXJyb3cnKTtcclxuICAgIH1cclxuXHJcbiAgICB0b29sdGlwLmFwcGVuZENoaWxkKGFycm93KTtcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLmFuaW1hdGVGaWxsKSB7XHJcbiAgICAvLyBDcmVhdGUgYW5pbWF0ZUZpbGwgY2lyY2xlIGVsZW1lbnQgZm9yIGFuaW1hdGlvblxyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYW5pbWF0ZWZpbGwnLCAnJyk7XHJcbiAgICB2YXIgYmFja2Ryb3AgPSBkaXYoKTtcclxuICAgIGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ3RpcHB5LWJhY2tkcm9wJyk7XHJcbiAgICBiYWNrZHJvcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3RhdGUnLCAnaGlkZGVuJyk7XHJcbiAgICB0b29sdGlwLmFwcGVuZENoaWxkKGJhY2tkcm9wKTtcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLmluZXJ0aWEpIHtcclxuICAgIC8vIENoYW5nZSB0cmFuc2l0aW9uIHRpbWluZyBmdW5jdGlvbiBjdWJpYyBiZXppZXJcclxuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLWluZXJ0aWEnLCAnJyk7XHJcbiAgfVxyXG5cclxuICBpZiAob3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW50ZXJhY3RpdmUnLCAnJyk7XHJcbiAgfVxyXG5cclxuICB2YXIgaHRtbCA9IG9wdGlvbnMuaHRtbDtcclxuICBpZiAoaHRtbCkge1xyXG4gICAgdmFyIHRlbXBsYXRlSWQgPSB2b2lkIDA7XHJcblxyXG4gICAgaWYgKGh0bWwgaW5zdGFuY2VvZiBFbGVtZW50KSB7XHJcbiAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoaHRtbCk7XHJcbiAgICAgIHRlbXBsYXRlSWQgPSAnIycgKyAoaHRtbC5pZCB8fCAndGlwcHktaHRtbC10ZW1wbGF0ZScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gdHJpY2sgbGludGVyczogaHR0cHM6Ly9naXRodWIuY29tL2F0b21pa3MvdGlwcHlqcy9pc3N1ZXMvMTk3XHJcbiAgICAgIGNvbnRlbnRbdHJ1ZSAmJiAnaW5uZXJIVE1MJ10gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGh0bWwpW3RydWUgJiYgJ2lubmVySFRNTCddO1xyXG4gICAgICB0ZW1wbGF0ZUlkID0gaHRtbDtcclxuICAgIH1cclxuXHJcbiAgICBwb3BwZXIuc2V0QXR0cmlidXRlKCdkYXRhLWh0bWwnLCAnJyk7XHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnZGF0YS10ZW1wbGF0ZS1pZCcsIHRlbXBsYXRlSWQpO1xyXG5cclxuICAgIGlmIChvcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICAgIHBvcHBlci5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGNvbnRlbnRbb3B0aW9ucy5hbGxvd1RpdGxlSFRNTCA/ICdpbm5lckhUTUwnIDogJ3RleHRDb250ZW50J10gPSB0aXRsZTtcclxuICB9XHJcblxyXG4gIHRvb2x0aXAuYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcbiAgcG9wcGVyLmFwcGVuZENoaWxkKHRvb2x0aXApO1xyXG5cclxuICByZXR1cm4gcG9wcGVyO1xyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhIHRyaWdnZXIgYnkgYWRkaW5nIHRoZSBuZWNlc3NhcnkgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSByZWZlcmVuY2UgZWxlbWVudFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRUeXBlIC0gdGhlIGN1c3RvbSBldmVudCBzcGVjaWZpZWQgaW4gdGhlIGB0cmlnZ2VyYCBzZXR0aW5nXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcmVmZXJlbmNlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVycyAtIHRoZSBoYW5kbGVycyBmb3IgZWFjaCBldmVudFxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gKiBAcmV0dXJuIHtBcnJheX0gLSBhcnJheSBvZiBsaXN0ZW5lciBvYmplY3RzXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVUcmlnZ2VyKGV2ZW50VHlwZSwgcmVmZXJlbmNlLCBoYW5kbGVycywgb3B0aW9ucykge1xyXG4gIHZhciBvblRyaWdnZXIgPSBoYW5kbGVycy5vblRyaWdnZXIsXHJcbiAgICAgIG9uTW91c2VMZWF2ZSA9IGhhbmRsZXJzLm9uTW91c2VMZWF2ZSxcclxuICAgICAgb25CbHVyID0gaGFuZGxlcnMub25CbHVyLFxyXG4gICAgICBvbkRlbGVnYXRlU2hvdyA9IGhhbmRsZXJzLm9uRGVsZWdhdGVTaG93LFxyXG4gICAgICBvbkRlbGVnYXRlSGlkZSA9IGhhbmRsZXJzLm9uRGVsZWdhdGVIaWRlO1xyXG5cclxuICB2YXIgbGlzdGVuZXJzID0gW107XHJcblxyXG4gIGlmIChldmVudFR5cGUgPT09ICdtYW51YWwnKSByZXR1cm4gbGlzdGVuZXJzO1xyXG5cclxuICB2YXIgb24gPSBmdW5jdGlvbiBvbihldmVudFR5cGUsIGhhbmRsZXIpIHtcclxuICAgIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgaGFuZGxlcik7XHJcbiAgICBsaXN0ZW5lcnMucHVzaCh7IGV2ZW50OiBldmVudFR5cGUsIGhhbmRsZXI6IGhhbmRsZXIgfSk7XHJcbiAgfTtcclxuXHJcbiAgaWYgKCFvcHRpb25zLnRhcmdldCkge1xyXG4gICAgb24oZXZlbnRUeXBlLCBvblRyaWdnZXIpO1xyXG5cclxuICAgIGlmIChicm93c2VyLnN1cHBvcnRzVG91Y2ggJiYgb3B0aW9ucy50b3VjaEhvbGQpIHtcclxuICAgICAgb24oJ3RvdWNoc3RhcnQnLCBvblRyaWdnZXIpO1xyXG4gICAgICBvbigndG91Y2hlbmQnLCBvbk1vdXNlTGVhdmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50VHlwZSA9PT0gJ21vdXNlZW50ZXInKSB7XHJcbiAgICAgIG9uKCdtb3VzZWxlYXZlJywgb25Nb3VzZUxlYXZlKTtcclxuICAgIH1cclxuICAgIGlmIChldmVudFR5cGUgPT09ICdmb2N1cycpIHtcclxuICAgICAgb24oaXNJRSA/ICdmb2N1c291dCcgOiAnYmx1cicsIG9uQmx1cik7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChicm93c2VyLnN1cHBvcnRzVG91Y2ggJiYgb3B0aW9ucy50b3VjaEhvbGQpIHtcclxuICAgICAgb24oJ3RvdWNoc3RhcnQnLCBvbkRlbGVnYXRlU2hvdyk7XHJcbiAgICAgIG9uKCd0b3VjaGVuZCcsIG9uRGVsZWdhdGVIaWRlKTtcclxuICAgIH1cclxuICAgIGlmIChldmVudFR5cGUgPT09ICdtb3VzZWVudGVyJykge1xyXG4gICAgICBvbignbW91c2VvdmVyJywgb25EZWxlZ2F0ZVNob3cpO1xyXG4gICAgICBvbignbW91c2VvdXQnLCBvbkRlbGVnYXRlSGlkZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnRUeXBlID09PSAnZm9jdXMnKSB7XHJcbiAgICAgIG9uKCdmb2N1c2luJywgb25EZWxlZ2F0ZVNob3cpO1xyXG4gICAgICBvbignZm9jdXNvdXQnLCBvbkRlbGVnYXRlSGlkZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnRUeXBlID09PSAnY2xpY2snKSB7XHJcbiAgICAgIG9uKCdjbGljaycsIG9uRGVsZWdhdGVTaG93KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBsaXN0ZW5lcnM7XHJcbn1cclxuXHJcbnZhciBjbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcclxuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcclxuICB9XHJcbn07XHJcblxyXG52YXIgY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XHJcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcclxuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xyXG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xyXG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcclxuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xyXG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xyXG4gIH07XHJcbn0oKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xyXG5cclxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcclxuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcclxuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGFyZ2V0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYW4gb2JqZWN0IG9mIHNldHRpbmdzIHRvIG92ZXJyaWRlIGdsb2JhbCBzZXR0aW5nc1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHJlZmVyZW5jZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gaW5zdGFuY2VPcHRpb25zXHJcbiAqIEByZXR1cm4ge09iamVjdH0gLSBpbmRpdmlkdWFsIG9wdGlvbnNcclxuICovXHJcbmZ1bmN0aW9uIGdldEluZGl2aWR1YWxPcHRpb25zKHJlZmVyZW5jZSwgaW5zdGFuY2VPcHRpb25zKSB7XHJcbiAgdmFyIG9wdGlvbnMgPSBkZWZhdWx0c0tleXMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGtleSkge1xyXG4gICAgdmFyIHZhbCA9IHJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGlwcHktJyArIGtleS50b0xvd2VyQ2FzZSgpKSB8fCBpbnN0YW5jZU9wdGlvbnNba2V5XTtcclxuXHJcbiAgICAvLyBDb252ZXJ0IHN0cmluZ3MgdG8gYm9vbGVhbnNcclxuICAgIGlmICh2YWwgPT09ICdmYWxzZScpIHZhbCA9IGZhbHNlO1xyXG4gICAgaWYgKHZhbCA9PT0gJ3RydWUnKSB2YWwgPSB0cnVlO1xyXG5cclxuICAgIC8vIENvbnZlcnQgbnVtYmVyIHN0cmluZ3MgdG8gdHJ1ZSBudW1iZXJzXHJcbiAgICBpZiAoaXNGaW5pdGUodmFsKSAmJiAhaXNOYU4ocGFyc2VGbG9hdCh2YWwpKSkge1xyXG4gICAgICB2YWwgPSBwYXJzZUZsb2F0KHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29udmVydCBhcnJheSBzdHJpbmdzIHRvIGFjdHVhbCBhcnJheXNcclxuICAgIGlmIChrZXkgIT09ICd0YXJnZXQnICYmIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIHZhbC50cmltKCkuY2hhckF0KDApID09PSAnWycpIHtcclxuICAgICAgdmFsID0gSlNPTi5wYXJzZSh2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjY1trZXldID0gdmFsO1xyXG5cclxuICAgIHJldHVybiBhY2M7XHJcbiAgfSwge30pO1xyXG5cclxuICByZXR1cm4gX2V4dGVuZHMoe30sIGluc3RhbmNlT3B0aW9ucywgb3B0aW9ucyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFdmFsdWF0ZXMvbW9kaWZpZXMgdGhlIG9wdGlvbnMgb2JqZWN0IGZvciBhcHByb3ByaWF0ZSBiZWhhdmlvclxyXG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSByZWZlcmVuY2VcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICogQHJldHVybiB7T2JqZWN0fSBtb2RpZmllZC9ldmFsdWF0ZWQgb3B0aW9uc1xyXG4gKi9cclxuZnVuY3Rpb24gZXZhbHVhdGVPcHRpb25zKHJlZmVyZW5jZSwgb3B0aW9ucykge1xyXG4gIC8vIGFuaW1hdGVGaWxsIGlzIGRpc2FibGVkIGlmIGFuIGFycm93IGlzIHRydWVcclxuICBpZiAob3B0aW9ucy5hcnJvdykge1xyXG4gICAgb3B0aW9ucy5hbmltYXRlRmlsbCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgaWYgKG9wdGlvbnMuYXBwZW5kVG8gJiYgdHlwZW9mIG9wdGlvbnMuYXBwZW5kVG8gPT09ICdmdW5jdGlvbicpIHtcclxuICAgIG9wdGlvbnMuYXBwZW5kVG8gPSBvcHRpb25zLmFwcGVuZFRvKCk7XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIG9wdGlvbnMuaHRtbCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgb3B0aW9ucy5odG1sID0gb3B0aW9ucy5odG1sKHJlZmVyZW5jZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3B0aW9ucztcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgaW5uZXIgZWxlbWVudHMgb2YgdGhlIHBvcHBlciBlbGVtZW50XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcG9wcGVyXHJcbiAqIEByZXR1cm4ge09iamVjdH1cclxuICovXHJcbmZ1bmN0aW9uIGdldElubmVyRWxlbWVudHMocG9wcGVyKSB7XHJcbiAgdmFyIHNlbGVjdCA9IGZ1bmN0aW9uIHNlbGVjdChzKSB7XHJcbiAgICByZXR1cm4gcG9wcGVyLnF1ZXJ5U2VsZWN0b3Iocyk7XHJcbiAgfTtcclxuICByZXR1cm4ge1xyXG4gICAgdG9vbHRpcDogc2VsZWN0KHNlbGVjdG9ycy5UT09MVElQKSxcclxuICAgIGJhY2tkcm9wOiBzZWxlY3Qoc2VsZWN0b3JzLkJBQ0tEUk9QKSxcclxuICAgIGNvbnRlbnQ6IHNlbGVjdChzZWxlY3RvcnMuQ09OVEVOVCksXHJcbiAgICBhcnJvdzogc2VsZWN0KHNlbGVjdG9ycy5BUlJPVykgfHwgc2VsZWN0KHNlbGVjdG9ycy5ST1VORF9BUlJPVylcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICogUmVtb3ZlcyB0aGUgdGl0bGUgZnJvbSBhbiBlbGVtZW50LCBzZXR0aW5nIGBkYXRhLW9yaWdpbmFsLXRpdGxlYFxyXG4gKiBhcHByb3ByaWF0ZWx5XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcclxuICovXHJcbmZ1bmN0aW9uIHJlbW92ZVRpdGxlKGVsKSB7XHJcbiAgdmFyIHRpdGxlID0gZWwuZ2V0QXR0cmlidXRlKCd0aXRsZScpO1xyXG4gIC8vIE9ubHkgc2V0IGBkYXRhLW9yaWdpbmFsLXRpdGxlYCBhdHRyIGlmIHRoZXJlIGlzIGEgdGl0bGVcclxuICBpZiAodGl0bGUpIHtcclxuICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1vcmlnaW5hbC10aXRsZScsIHRpdGxlKTtcclxuICB9XHJcbiAgZWwucmVtb3ZlQXR0cmlidXRlKCd0aXRsZScpO1xyXG59XHJcblxyXG4vKiohXHJcbiAqIEBmaWxlT3ZlcnZpZXcgS2lja2FzcyBsaWJyYXJ5IHRvIGNyZWF0ZSBhbmQgcGxhY2UgcG9wcGVycyBuZWFyIHRoZWlyIHJlZmVyZW5jZSBlbGVtZW50cy5cclxuICogQHZlcnNpb24gMS4xNC4zXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNiBGZWRlcmljbyBaaXZvbG8gYW5kIGNvbnRyaWJ1dG9yc1xyXG4gKlxyXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXHJcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG4gKlxyXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcclxuICogY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuICpcclxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcclxuICogU09GVFdBUkUuXHJcbiAqL1xyXG52YXIgaXNCcm93c2VyJDEgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnO1xyXG5cclxudmFyIGxvbmdlclRpbWVvdXRCcm93c2VycyA9IFsnRWRnZScsICdUcmlkZW50JywgJ0ZpcmVmb3gnXTtcclxudmFyIHRpbWVvdXREdXJhdGlvbiA9IDA7XHJcbmZvciAodmFyIGkgPSAwOyBpIDwgbG9uZ2VyVGltZW91dEJyb3dzZXJzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgaWYgKGlzQnJvd3NlciQxICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihsb25nZXJUaW1lb3V0QnJvd3NlcnNbaV0pID49IDApIHtcclxuICAgIHRpbWVvdXREdXJhdGlvbiA9IDE7XHJcbiAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1pY3JvdGFza0RlYm91bmNlKGZuKSB7XHJcbiAgdmFyIGNhbGxlZCA9IGZhbHNlO1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoY2FsbGVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNhbGxlZCA9IHRydWU7XHJcbiAgICB3aW5kb3cuUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNhbGxlZCA9IGZhbHNlO1xyXG4gICAgICBmbigpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gdGFza0RlYm91bmNlKGZuKSB7XHJcbiAgdmFyIHNjaGVkdWxlZCA9IGZhbHNlO1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoIXNjaGVkdWxlZCkge1xyXG4gICAgICBzY2hlZHVsZWQgPSB0cnVlO1xyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBzY2hlZHVsZWQgPSBmYWxzZTtcclxuICAgICAgICBmbigpO1xyXG4gICAgICB9LCB0aW1lb3V0RHVyYXRpb24pO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbnZhciBzdXBwb3J0c01pY3JvVGFza3MgPSBpc0Jyb3dzZXIkMSAmJiB3aW5kb3cuUHJvbWlzZTtcclxuXHJcbi8qKlxyXG4qIENyZWF0ZSBhIGRlYm91bmNlZCB2ZXJzaW9uIG9mIGEgbWV0aG9kLCB0aGF0J3MgYXN5bmNocm9ub3VzbHkgZGVmZXJyZWRcclxuKiBidXQgY2FsbGVkIGluIHRoZSBtaW5pbXVtIHRpbWUgcG9zc2libGUuXHJcbipcclxuKiBAbWV0aG9kXHJcbiogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4qIEBhcmd1bWVudCB7RnVuY3Rpb259IGZuXHJcbiogQHJldHVybnMge0Z1bmN0aW9ufVxyXG4qL1xyXG52YXIgZGVib3VuY2UgPSBzdXBwb3J0c01pY3JvVGFza3MgPyBtaWNyb3Rhc2tEZWJvdW5jZSA6IHRhc2tEZWJvdW5jZTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGUgZ2l2ZW4gdmFyaWFibGUgaXMgYSBmdW5jdGlvblxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtBbnl9IGZ1bmN0aW9uVG9DaGVjayAtIHZhcmlhYmxlIHRvIGNoZWNrXHJcbiAqIEByZXR1cm5zIHtCb29sZWFufSBhbnN3ZXIgdG86IGlzIGEgZnVuY3Rpb24/XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGZ1bmN0aW9uVG9DaGVjaykge1xyXG4gIHZhciBnZXRUeXBlID0ge307XHJcbiAgcmV0dXJuIGZ1bmN0aW9uVG9DaGVjayAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwoZnVuY3Rpb25Ub0NoZWNrKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBDU1MgY29tcHV0ZWQgcHJvcGVydHkgb2YgdGhlIGdpdmVuIGVsZW1lbnRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWVtZW50fSBlbGVtZW50XHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwcm9wZXJ0eVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KGVsZW1lbnQsIHByb3BlcnR5KSB7XHJcbiAgaWYgKGVsZW1lbnQubm9kZVR5cGUgIT09IDEpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcbiAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcclxuICB2YXIgY3NzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKTtcclxuICByZXR1cm4gcHJvcGVydHkgPyBjc3NbcHJvcGVydHldIDogY3NzO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgcGFyZW50Tm9kZSBvciB0aGUgaG9zdCBvZiB0aGUgZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtFbGVtZW50fSBwYXJlbnRcclxuICovXHJcbmZ1bmN0aW9uIGdldFBhcmVudE5vZGUoZWxlbWVudCkge1xyXG4gIGlmIChlbGVtZW50Lm5vZGVOYW1lID09PSAnSFRNTCcpIHtcclxuICAgIHJldHVybiBlbGVtZW50O1xyXG4gIH1cclxuICByZXR1cm4gZWxlbWVudC5wYXJlbnROb2RlIHx8IGVsZW1lbnQuaG9zdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHNjcm9sbGluZyBwYXJlbnQgb2YgdGhlIGdpdmVuIGVsZW1lbnRcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7RWxlbWVudH0gc2Nyb2xsIHBhcmVudFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0U2Nyb2xsUGFyZW50KGVsZW1lbnQpIHtcclxuICAvLyBSZXR1cm4gYm9keSwgYGdldFNjcm9sbGAgd2lsbCB0YWtlIGNhcmUgdG8gZ2V0IHRoZSBjb3JyZWN0IGBzY3JvbGxUb3BgIGZyb20gaXRcclxuICBpZiAoIWVsZW1lbnQpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5ib2R5O1xyXG4gIH1cclxuXHJcbiAgc3dpdGNoIChlbGVtZW50Lm5vZGVOYW1lKSB7XHJcbiAgICBjYXNlICdIVE1MJzpcclxuICAgIGNhc2UgJ0JPRFknOlxyXG4gICAgICByZXR1cm4gZWxlbWVudC5vd25lckRvY3VtZW50LmJvZHk7XHJcbiAgICBjYXNlICcjZG9jdW1lbnQnOlxyXG4gICAgICByZXR1cm4gZWxlbWVudC5ib2R5O1xyXG4gIH1cclxuXHJcbiAgLy8gRmlyZWZveCB3YW50IHVzIHRvIGNoZWNrIGAteGAgYW5kIGAteWAgdmFyaWF0aW9ucyBhcyB3ZWxsXHJcblxyXG4gIHZhciBfZ2V0U3R5bGVDb21wdXRlZFByb3AgPSBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCksXHJcbiAgICAgIG92ZXJmbG93ID0gX2dldFN0eWxlQ29tcHV0ZWRQcm9wLm92ZXJmbG93LFxyXG4gICAgICBvdmVyZmxvd1ggPSBfZ2V0U3R5bGVDb21wdXRlZFByb3Aub3ZlcmZsb3dYLFxyXG4gICAgICBvdmVyZmxvd1kgPSBfZ2V0U3R5bGVDb21wdXRlZFByb3Aub3ZlcmZsb3dZO1xyXG5cclxuICBpZiAoLyhhdXRvfHNjcm9sbHxvdmVybGF5KS8udGVzdChvdmVyZmxvdyArIG92ZXJmbG93WSArIG92ZXJmbG93WCkpIHtcclxuICAgIHJldHVybiBlbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGdldFNjcm9sbFBhcmVudChnZXRQYXJlbnROb2RlKGVsZW1lbnQpKTtcclxufVxyXG5cclxudmFyIGlzSUUxMSA9IGlzQnJvd3NlciQxICYmICEhKHdpbmRvdy5NU0lucHV0TWV0aG9kQ29udGV4dCAmJiBkb2N1bWVudC5kb2N1bWVudE1vZGUpO1xyXG52YXIgaXNJRTEwID0gaXNCcm93c2VyJDEgJiYgL01TSUUgMTAvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcblxyXG4vKipcclxuICogRGV0ZXJtaW5lcyBpZiB0aGUgYnJvd3NlciBpcyBJbnRlcm5ldCBFeHBsb3JlclxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtOdW1iZXJ9IHZlcnNpb24gdG8gY2hlY2tcclxuICogQHJldHVybnMge0Jvb2xlYW59IGlzSUVcclxuICovXHJcbmZ1bmN0aW9uIGlzSUUkMSh2ZXJzaW9uKSB7XHJcbiAgaWYgKHZlcnNpb24gPT09IDExKSB7XHJcbiAgICByZXR1cm4gaXNJRTExO1xyXG4gIH1cclxuICBpZiAodmVyc2lvbiA9PT0gMTApIHtcclxuICAgIHJldHVybiBpc0lFMTA7XHJcbiAgfVxyXG4gIHJldHVybiBpc0lFMTEgfHwgaXNJRTEwO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgb2Zmc2V0IHBhcmVudCBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtFbGVtZW50fSBvZmZzZXQgcGFyZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudCkge1xyXG4gIGlmICghZWxlbWVudCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICB9XHJcblxyXG4gIHZhciBub09mZnNldFBhcmVudCA9IGlzSUUkMSgxMCkgPyBkb2N1bWVudC5ib2R5IDogbnVsbDtcclxuXHJcbiAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcclxuICB2YXIgb2Zmc2V0UGFyZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQ7XHJcbiAgLy8gU2tpcCBoaWRkZW4gZWxlbWVudHMgd2hpY2ggZG9uJ3QgaGF2ZSBhbiBvZmZzZXRQYXJlbnRcclxuICB3aGlsZSAob2Zmc2V0UGFyZW50ID09PSBub09mZnNldFBhcmVudCAmJiBlbGVtZW50Lm5leHRFbGVtZW50U2libGluZykge1xyXG4gICAgb2Zmc2V0UGFyZW50ID0gKGVsZW1lbnQgPSBlbGVtZW50Lm5leHRFbGVtZW50U2libGluZykub2Zmc2V0UGFyZW50O1xyXG4gIH1cclxuXHJcbiAgdmFyIG5vZGVOYW1lID0gb2Zmc2V0UGFyZW50ICYmIG9mZnNldFBhcmVudC5ub2RlTmFtZTtcclxuXHJcbiAgaWYgKCFub2RlTmFtZSB8fCBub2RlTmFtZSA9PT0gJ0JPRFknIHx8IG5vZGVOYW1lID09PSAnSFRNTCcpIHtcclxuICAgIHJldHVybiBlbGVtZW50ID8gZWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudCA6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICB9XHJcblxyXG4gIC8vIC5vZmZzZXRQYXJlbnQgd2lsbCByZXR1cm4gdGhlIGNsb3Nlc3QgVEQgb3IgVEFCTEUgaW4gY2FzZVxyXG4gIC8vIG5vIG9mZnNldFBhcmVudCBpcyBwcmVzZW50LCBJIGhhdGUgdGhpcyBqb2IuLi5cclxuICBpZiAoWydURCcsICdUQUJMRSddLmluZGV4T2Yob2Zmc2V0UGFyZW50Lm5vZGVOYW1lKSAhPT0gLTEgJiYgZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KG9mZnNldFBhcmVudCwgJ3Bvc2l0aW9uJykgPT09ICdzdGF0aWMnKSB7XHJcbiAgICByZXR1cm4gZ2V0T2Zmc2V0UGFyZW50KG9mZnNldFBhcmVudCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb2Zmc2V0UGFyZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc09mZnNldENvbnRhaW5lcihlbGVtZW50KSB7XHJcbiAgdmFyIG5vZGVOYW1lID0gZWxlbWVudC5ub2RlTmFtZTtcclxuXHJcbiAgaWYgKG5vZGVOYW1lID09PSAnQk9EWScpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIG5vZGVOYW1lID09PSAnSFRNTCcgfHwgZ2V0T2Zmc2V0UGFyZW50KGVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpID09PSBlbGVtZW50O1xyXG59XHJcblxyXG4vKipcclxuICogRmluZHMgdGhlIHJvb3Qgbm9kZSAoZG9jdW1lbnQsIHNoYWRvd0RPTSByb290KSBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBub2RlXHJcbiAqIEByZXR1cm5zIHtFbGVtZW50fSByb290IG5vZGVcclxuICovXHJcbmZ1bmN0aW9uIGdldFJvb3Qobm9kZSkge1xyXG4gIGlmIChub2RlLnBhcmVudE5vZGUgIT09IG51bGwpIHtcclxuICAgIHJldHVybiBnZXRSb290KG5vZGUucGFyZW50Tm9kZSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZpbmRzIHRoZSBvZmZzZXQgcGFyZW50IGNvbW1vbiB0byB0aGUgdHdvIHByb3ZpZGVkIG5vZGVzXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnQxXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudDJcclxuICogQHJldHVybnMge0VsZW1lbnR9IGNvbW1vbiBvZmZzZXQgcGFyZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50KGVsZW1lbnQxLCBlbGVtZW50Mikge1xyXG4gIC8vIFRoaXMgY2hlY2sgaXMgbmVlZGVkIHRvIGF2b2lkIGVycm9ycyBpbiBjYXNlIG9uZSBvZiB0aGUgZWxlbWVudHMgaXNuJ3QgZGVmaW5lZCBmb3IgYW55IHJlYXNvblxyXG4gIGlmICghZWxlbWVudDEgfHwgIWVsZW1lbnQxLm5vZGVUeXBlIHx8ICFlbGVtZW50MiB8fCAhZWxlbWVudDIubm9kZVR5cGUpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICAvLyBIZXJlIHdlIG1ha2Ugc3VyZSB0byBnaXZlIGFzIFwic3RhcnRcIiB0aGUgZWxlbWVudCB0aGF0IGNvbWVzIGZpcnN0IGluIHRoZSBET01cclxuICB2YXIgb3JkZXIgPSBlbGVtZW50MS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihlbGVtZW50MikgJiBOb2RlLkRPQ1VNRU5UX1BPU0lUSU9OX0ZPTExPV0lORztcclxuICB2YXIgc3RhcnQgPSBvcmRlciA/IGVsZW1lbnQxIDogZWxlbWVudDI7XHJcbiAgdmFyIGVuZCA9IG9yZGVyID8gZWxlbWVudDIgOiBlbGVtZW50MTtcclxuXHJcbiAgLy8gR2V0IGNvbW1vbiBhbmNlc3RvciBjb250YWluZXJcclxuICB2YXIgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xyXG4gIHJhbmdlLnNldFN0YXJ0KHN0YXJ0LCAwKTtcclxuICByYW5nZS5zZXRFbmQoZW5kLCAwKTtcclxuICB2YXIgY29tbW9uQW5jZXN0b3JDb250YWluZXIgPSByYW5nZS5jb21tb25BbmNlc3RvckNvbnRhaW5lcjtcclxuXHJcbiAgLy8gQm90aCBub2RlcyBhcmUgaW5zaWRlICNkb2N1bWVudFxyXG5cclxuICBpZiAoZWxlbWVudDEgIT09IGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyICYmIGVsZW1lbnQyICE9PSBjb21tb25BbmNlc3RvckNvbnRhaW5lciB8fCBzdGFydC5jb250YWlucyhlbmQpKSB7XHJcbiAgICBpZiAoaXNPZmZzZXRDb250YWluZXIoY29tbW9uQW5jZXN0b3JDb250YWluZXIpKSB7XHJcbiAgICAgIHJldHVybiBjb21tb25BbmNlc3RvckNvbnRhaW5lcjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZ2V0T2Zmc2V0UGFyZW50KGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyKTtcclxuICB9XHJcblxyXG4gIC8vIG9uZSBvZiB0aGUgbm9kZXMgaXMgaW5zaWRlIHNoYWRvd0RPTSwgZmluZCB3aGljaCBvbmVcclxuICB2YXIgZWxlbWVudDFyb290ID0gZ2V0Um9vdChlbGVtZW50MSk7XHJcbiAgaWYgKGVsZW1lbnQxcm9vdC5ob3N0KSB7XHJcbiAgICByZXR1cm4gZmluZENvbW1vbk9mZnNldFBhcmVudChlbGVtZW50MXJvb3QuaG9zdCwgZWxlbWVudDIpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gZmluZENvbW1vbk9mZnNldFBhcmVudChlbGVtZW50MSwgZ2V0Um9vdChlbGVtZW50MikuaG9zdCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogR2V0cyB0aGUgc2Nyb2xsIHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50IGluIHRoZSBnaXZlbiBzaWRlICh0b3AgYW5kIGxlZnQpXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHNpZGUgYHRvcGAgb3IgYGxlZnRgXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGFtb3VudCBvZiBzY3JvbGxlZCBwaXhlbHNcclxuICovXHJcbmZ1bmN0aW9uIGdldFNjcm9sbChlbGVtZW50KSB7XHJcbiAgdmFyIHNpZGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICd0b3AnO1xyXG5cclxuICB2YXIgdXBwZXJTaWRlID0gc2lkZSA9PT0gJ3RvcCcgPyAnc2Nyb2xsVG9wJyA6ICdzY3JvbGxMZWZ0JztcclxuICB2YXIgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lO1xyXG5cclxuICBpZiAobm9kZU5hbWUgPT09ICdCT0RZJyB8fCBub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XHJcbiAgICB2YXIgaHRtbCA9IGVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICB2YXIgc2Nyb2xsaW5nRWxlbWVudCA9IGVsZW1lbnQub3duZXJEb2N1bWVudC5zY3JvbGxpbmdFbGVtZW50IHx8IGh0bWw7XHJcbiAgICByZXR1cm4gc2Nyb2xsaW5nRWxlbWVudFt1cHBlclNpZGVdO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGVsZW1lbnRbdXBwZXJTaWRlXTtcclxufVxyXG5cclxuLypcclxuICogU3VtIG9yIHN1YnRyYWN0IHRoZSBlbGVtZW50IHNjcm9sbCB2YWx1ZXMgKGxlZnQgYW5kIHRvcCkgZnJvbSBhIGdpdmVuIHJlY3Qgb2JqZWN0XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge09iamVjdH0gcmVjdCAtIFJlY3Qgb2JqZWN0IHlvdSB3YW50IHRvIGNoYW5nZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gVGhlIGVsZW1lbnQgZnJvbSB0aGUgZnVuY3Rpb24gcmVhZHMgdGhlIHNjcm9sbCB2YWx1ZXNcclxuICogQHBhcmFtIHtCb29sZWFufSBzdWJ0cmFjdCAtIHNldCB0byB0cnVlIGlmIHlvdSB3YW50IHRvIHN1YnRyYWN0IHRoZSBzY3JvbGwgdmFsdWVzXHJcbiAqIEByZXR1cm4ge09iamVjdH0gcmVjdCAtIFRoZSBtb2RpZmllciByZWN0IG9iamVjdFxyXG4gKi9cclxuZnVuY3Rpb24gaW5jbHVkZVNjcm9sbChyZWN0LCBlbGVtZW50KSB7XHJcbiAgdmFyIHN1YnRyYWN0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBmYWxzZTtcclxuXHJcbiAgdmFyIHNjcm9sbFRvcCA9IGdldFNjcm9sbChlbGVtZW50LCAndG9wJyk7XHJcbiAgdmFyIHNjcm9sbExlZnQgPSBnZXRTY3JvbGwoZWxlbWVudCwgJ2xlZnQnKTtcclxuICB2YXIgbW9kaWZpZXIgPSBzdWJ0cmFjdCA/IC0xIDogMTtcclxuICByZWN0LnRvcCArPSBzY3JvbGxUb3AgKiBtb2RpZmllcjtcclxuICByZWN0LmJvdHRvbSArPSBzY3JvbGxUb3AgKiBtb2RpZmllcjtcclxuICByZWN0LmxlZnQgKz0gc2Nyb2xsTGVmdCAqIG1vZGlmaWVyO1xyXG4gIHJlY3QucmlnaHQgKz0gc2Nyb2xsTGVmdCAqIG1vZGlmaWVyO1xyXG4gIHJldHVybiByZWN0O1xyXG59XHJcblxyXG4vKlxyXG4gKiBIZWxwZXIgdG8gZGV0ZWN0IGJvcmRlcnMgb2YgYSBnaXZlbiBlbGVtZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge0NTU1N0eWxlRGVjbGFyYXRpb259IHN0eWxlc1xyXG4gKiBSZXN1bHQgb2YgYGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eWAgb24gdGhlIGdpdmVuIGVsZW1lbnRcclxuICogQHBhcmFtIHtTdHJpbmd9IGF4aXMgLSBgeGAgb3IgYHlgXHJcbiAqIEByZXR1cm4ge251bWJlcn0gYm9yZGVycyAtIFRoZSBib3JkZXJzIHNpemUgb2YgdGhlIGdpdmVuIGF4aXNcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRCb3JkZXJzU2l6ZShzdHlsZXMsIGF4aXMpIHtcclxuICB2YXIgc2lkZUEgPSBheGlzID09PSAneCcgPyAnTGVmdCcgOiAnVG9wJztcclxuICB2YXIgc2lkZUIgPSBzaWRlQSA9PT0gJ0xlZnQnID8gJ1JpZ2h0JyA6ICdCb3R0b20nO1xyXG5cclxuICByZXR1cm4gcGFyc2VGbG9hdChzdHlsZXNbJ2JvcmRlcicgKyBzaWRlQSArICdXaWR0aCddLCAxMCkgKyBwYXJzZUZsb2F0KHN0eWxlc1snYm9yZGVyJyArIHNpZGVCICsgJ1dpZHRoJ10sIDEwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2l6ZShheGlzLCBib2R5LCBodG1sLCBjb21wdXRlZFN0eWxlKSB7XHJcbiAgcmV0dXJuIE1hdGgubWF4KGJvZHlbJ29mZnNldCcgKyBheGlzXSwgYm9keVsnc2Nyb2xsJyArIGF4aXNdLCBodG1sWydjbGllbnQnICsgYXhpc10sIGh0bWxbJ29mZnNldCcgKyBheGlzXSwgaHRtbFsnc2Nyb2xsJyArIGF4aXNdLCBpc0lFJDEoMTApID8gaHRtbFsnb2Zmc2V0JyArIGF4aXNdICsgY29tcHV0ZWRTdHlsZVsnbWFyZ2luJyArIChheGlzID09PSAnSGVpZ2h0JyA/ICdUb3AnIDogJ0xlZnQnKV0gKyBjb21wdXRlZFN0eWxlWydtYXJnaW4nICsgKGF4aXMgPT09ICdIZWlnaHQnID8gJ0JvdHRvbScgOiAnUmlnaHQnKV0gOiAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0V2luZG93U2l6ZXMoKSB7XHJcbiAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gIHZhciBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIHZhciBjb21wdXRlZFN0eWxlID0gaXNJRSQxKDEwKSAmJiBnZXRDb21wdXRlZFN0eWxlKGh0bWwpO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaGVpZ2h0OiBnZXRTaXplKCdIZWlnaHQnLCBib2R5LCBodG1sLCBjb21wdXRlZFN0eWxlKSxcclxuICAgIHdpZHRoOiBnZXRTaXplKCdXaWR0aCcsIGJvZHksIGh0bWwsIGNvbXB1dGVkU3R5bGUpXHJcbiAgfTtcclxufVxyXG5cclxudmFyIGNsYXNzQ2FsbENoZWNrJDEgPSBmdW5jdGlvbiBjbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcclxuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcclxuICB9XHJcbn07XHJcblxyXG52YXIgY3JlYXRlQ2xhc3MkMSA9IGZ1bmN0aW9uICgpIHtcclxuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcclxuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xyXG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XHJcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XHJcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xyXG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XHJcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XHJcbiAgfTtcclxufSgpO1xyXG5cclxudmFyIGRlZmluZVByb3BlcnR5JDEgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcclxuICBpZiAoa2V5IGluIG9iaikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XHJcbiAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIG9ialtrZXldID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb2JqO1xyXG59O1xyXG5cclxudmFyIF9leHRlbmRzJDEgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcclxuXHJcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XHJcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRhcmdldDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHaXZlbiBlbGVtZW50IG9mZnNldHMsIGdlbmVyYXRlIGFuIG91dHB1dCBzaW1pbGFyIHRvIGdldEJvdW5kaW5nQ2xpZW50UmVjdFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9mZnNldHNcclxuICogQHJldHVybnMge09iamVjdH0gQ2xpZW50UmVjdCBsaWtlIG91dHB1dFxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0Q2xpZW50UmVjdChvZmZzZXRzKSB7XHJcbiAgcmV0dXJuIF9leHRlbmRzJDEoe30sIG9mZnNldHMsIHtcclxuICAgIHJpZ2h0OiBvZmZzZXRzLmxlZnQgKyBvZmZzZXRzLndpZHRoLFxyXG4gICAgYm90dG9tOiBvZmZzZXRzLnRvcCArIG9mZnNldHMuaGVpZ2h0XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYm91bmRpbmcgY2xpZW50IHJlY3Qgb2YgZ2l2ZW4gZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IGNsaWVudCByZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZWxlbWVudCkge1xyXG4gIHZhciByZWN0ID0ge307XHJcblxyXG4gIC8vIElFMTAgMTAgRklYOiBQbGVhc2UsIGRvbid0IGFzaywgdGhlIGVsZW1lbnQgaXNuJ3RcclxuICAvLyBjb25zaWRlcmVkIGluIERPTSBpbiBzb21lIGNpcmN1bXN0YW5jZXMuLi5cclxuICAvLyBUaGlzIGlzbid0IHJlcHJvZHVjaWJsZSBpbiBJRTEwIGNvbXBhdGliaWxpdHkgbW9kZSBvZiBJRTExXHJcbiAgdHJ5IHtcclxuICAgIGlmIChpc0lFJDEoMTApKSB7XHJcbiAgICAgIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICB2YXIgc2Nyb2xsVG9wID0gZ2V0U2Nyb2xsKGVsZW1lbnQsICd0b3AnKTtcclxuICAgICAgdmFyIHNjcm9sbExlZnQgPSBnZXRTY3JvbGwoZWxlbWVudCwgJ2xlZnQnKTtcclxuICAgICAgcmVjdC50b3AgKz0gc2Nyb2xsVG9wO1xyXG4gICAgICByZWN0LmxlZnQgKz0gc2Nyb2xsTGVmdDtcclxuICAgICAgcmVjdC5ib3R0b20gKz0gc2Nyb2xsVG9wO1xyXG4gICAgICByZWN0LnJpZ2h0ICs9IHNjcm9sbExlZnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7fVxyXG5cclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgbGVmdDogcmVjdC5sZWZ0LFxyXG4gICAgdG9wOiByZWN0LnRvcCxcclxuICAgIHdpZHRoOiByZWN0LnJpZ2h0IC0gcmVjdC5sZWZ0LFxyXG4gICAgaGVpZ2h0OiByZWN0LmJvdHRvbSAtIHJlY3QudG9wXHJcbiAgfTtcclxuXHJcbiAgLy8gc3VidHJhY3Qgc2Nyb2xsYmFyIHNpemUgZnJvbSBzaXplc1xyXG4gIHZhciBzaXplcyA9IGVsZW1lbnQubm9kZU5hbWUgPT09ICdIVE1MJyA/IGdldFdpbmRvd1NpemVzKCkgOiB7fTtcclxuICB2YXIgd2lkdGggPSBzaXplcy53aWR0aCB8fCBlbGVtZW50LmNsaWVudFdpZHRoIHx8IHJlc3VsdC5yaWdodCAtIHJlc3VsdC5sZWZ0O1xyXG4gIHZhciBoZWlnaHQgPSBzaXplcy5oZWlnaHQgfHwgZWxlbWVudC5jbGllbnRIZWlnaHQgfHwgcmVzdWx0LmJvdHRvbSAtIHJlc3VsdC50b3A7XHJcblxyXG4gIHZhciBob3JpelNjcm9sbGJhciA9IGVsZW1lbnQub2Zmc2V0V2lkdGggLSB3aWR0aDtcclxuICB2YXIgdmVydFNjcm9sbGJhciA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gaGVpZ2h0O1xyXG5cclxuICAvLyBpZiBhbiBoeXBvdGhldGljYWwgc2Nyb2xsYmFyIGlzIGRldGVjdGVkLCB3ZSBtdXN0IGJlIHN1cmUgaXQncyBub3QgYSBgYm9yZGVyYFxyXG4gIC8vIHdlIG1ha2UgdGhpcyBjaGVjayBjb25kaXRpb25hbCBmb3IgcGVyZm9ybWFuY2UgcmVhc29uc1xyXG4gIGlmIChob3JpelNjcm9sbGJhciB8fCB2ZXJ0U2Nyb2xsYmFyKSB7XHJcbiAgICB2YXIgc3R5bGVzID0gZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KGVsZW1lbnQpO1xyXG4gICAgaG9yaXpTY3JvbGxiYXIgLT0gZ2V0Qm9yZGVyc1NpemUoc3R5bGVzLCAneCcpO1xyXG4gICAgdmVydFNjcm9sbGJhciAtPSBnZXRCb3JkZXJzU2l6ZShzdHlsZXMsICd5Jyk7XHJcblxyXG4gICAgcmVzdWx0LndpZHRoIC09IGhvcml6U2Nyb2xsYmFyO1xyXG4gICAgcmVzdWx0LmhlaWdodCAtPSB2ZXJ0U2Nyb2xsYmFyO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGdldENsaWVudFJlY3QocmVzdWx0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlKGNoaWxkcmVuLCBwYXJlbnQpIHtcclxuICB2YXIgZml4ZWRQb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XHJcblxyXG4gIHZhciBpc0lFMTAgPSBpc0lFJDEoMTApO1xyXG4gIHZhciBpc0hUTUwgPSBwYXJlbnQubm9kZU5hbWUgPT09ICdIVE1MJztcclxuICB2YXIgY2hpbGRyZW5SZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGNoaWxkcmVuKTtcclxuICB2YXIgcGFyZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChwYXJlbnQpO1xyXG4gIHZhciBzY3JvbGxQYXJlbnQgPSBnZXRTY3JvbGxQYXJlbnQoY2hpbGRyZW4pO1xyXG5cclxuICB2YXIgc3R5bGVzID0gZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KHBhcmVudCk7XHJcbiAgdmFyIGJvcmRlclRvcFdpZHRoID0gcGFyc2VGbG9hdChzdHlsZXMuYm9yZGVyVG9wV2lkdGgsIDEwKTtcclxuICB2YXIgYm9yZGVyTGVmdFdpZHRoID0gcGFyc2VGbG9hdChzdHlsZXMuYm9yZGVyTGVmdFdpZHRoLCAxMCk7XHJcblxyXG4gIC8vIEluIGNhc2VzIHdoZXJlIHRoZSBwYXJlbnQgaXMgZml4ZWQsIHdlIG11c3QgaWdub3JlIG5lZ2F0aXZlIHNjcm9sbCBpbiBvZmZzZXQgY2FsY1xyXG4gIGlmIChmaXhlZFBvc2l0aW9uICYmIHBhcmVudC5ub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XHJcbiAgICBwYXJlbnRSZWN0LnRvcCA9IE1hdGgubWF4KHBhcmVudFJlY3QudG9wLCAwKTtcclxuICAgIHBhcmVudFJlY3QubGVmdCA9IE1hdGgubWF4KHBhcmVudFJlY3QubGVmdCwgMCk7XHJcbiAgfVxyXG4gIHZhciBvZmZzZXRzID0gZ2V0Q2xpZW50UmVjdCh7XHJcbiAgICB0b3A6IGNoaWxkcmVuUmVjdC50b3AgLSBwYXJlbnRSZWN0LnRvcCAtIGJvcmRlclRvcFdpZHRoLFxyXG4gICAgbGVmdDogY2hpbGRyZW5SZWN0LmxlZnQgLSBwYXJlbnRSZWN0LmxlZnQgLSBib3JkZXJMZWZ0V2lkdGgsXHJcbiAgICB3aWR0aDogY2hpbGRyZW5SZWN0LndpZHRoLFxyXG4gICAgaGVpZ2h0OiBjaGlsZHJlblJlY3QuaGVpZ2h0XHJcbiAgfSk7XHJcbiAgb2Zmc2V0cy5tYXJnaW5Ub3AgPSAwO1xyXG4gIG9mZnNldHMubWFyZ2luTGVmdCA9IDA7XHJcblxyXG4gIC8vIFN1YnRyYWN0IG1hcmdpbnMgb2YgZG9jdW1lbnRFbGVtZW50IGluIGNhc2UgaXQncyBiZWluZyB1c2VkIGFzIHBhcmVudFxyXG4gIC8vIHdlIGRvIHRoaXMgb25seSBvbiBIVE1MIGJlY2F1c2UgaXQncyB0aGUgb25seSBlbGVtZW50IHRoYXQgYmVoYXZlc1xyXG4gIC8vIGRpZmZlcmVudGx5IHdoZW4gbWFyZ2lucyBhcmUgYXBwbGllZCB0byBpdC4gVGhlIG1hcmdpbnMgYXJlIGluY2x1ZGVkIGluXHJcbiAgLy8gdGhlIGJveCBvZiB0aGUgZG9jdW1lbnRFbGVtZW50LCBpbiB0aGUgb3RoZXIgY2FzZXMgbm90LlxyXG4gIGlmICghaXNJRTEwICYmIGlzSFRNTCkge1xyXG4gICAgdmFyIG1hcmdpblRvcCA9IHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpblRvcCwgMTApO1xyXG4gICAgdmFyIG1hcmdpbkxlZnQgPSBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5MZWZ0LCAxMCk7XHJcblxyXG4gICAgb2Zmc2V0cy50b3AgLT0gYm9yZGVyVG9wV2lkdGggLSBtYXJnaW5Ub3A7XHJcbiAgICBvZmZzZXRzLmJvdHRvbSAtPSBib3JkZXJUb3BXaWR0aCAtIG1hcmdpblRvcDtcclxuICAgIG9mZnNldHMubGVmdCAtPSBib3JkZXJMZWZ0V2lkdGggLSBtYXJnaW5MZWZ0O1xyXG4gICAgb2Zmc2V0cy5yaWdodCAtPSBib3JkZXJMZWZ0V2lkdGggLSBtYXJnaW5MZWZ0O1xyXG5cclxuICAgIC8vIEF0dGFjaCBtYXJnaW5Ub3AgYW5kIG1hcmdpbkxlZnQgYmVjYXVzZSBpbiBzb21lIGNpcmN1bXN0YW5jZXMgd2UgbWF5IG5lZWQgdGhlbVxyXG4gICAgb2Zmc2V0cy5tYXJnaW5Ub3AgPSBtYXJnaW5Ub3A7XHJcbiAgICBvZmZzZXRzLm1hcmdpbkxlZnQgPSBtYXJnaW5MZWZ0O1xyXG4gIH1cclxuXHJcbiAgaWYgKGlzSUUxMCAmJiAhZml4ZWRQb3NpdGlvbiA/IHBhcmVudC5jb250YWlucyhzY3JvbGxQYXJlbnQpIDogcGFyZW50ID09PSBzY3JvbGxQYXJlbnQgJiYgc2Nyb2xsUGFyZW50Lm5vZGVOYW1lICE9PSAnQk9EWScpIHtcclxuICAgIG9mZnNldHMgPSBpbmNsdWRlU2Nyb2xsKG9mZnNldHMsIHBhcmVudCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb2Zmc2V0cztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Vmlld3BvcnRPZmZzZXRSZWN0UmVsYXRpdmVUb0FydGJpdHJhcnlOb2RlKGVsZW1lbnQpIHtcclxuICB2YXIgZXhjbHVkZVNjcm9sbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XHJcblxyXG4gIHZhciBodG1sID0gZWxlbWVudC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICB2YXIgcmVsYXRpdmVPZmZzZXQgPSBnZXRPZmZzZXRSZWN0UmVsYXRpdmVUb0FyYml0cmFyeU5vZGUoZWxlbWVudCwgaHRtbCk7XHJcbiAgdmFyIHdpZHRoID0gTWF0aC5tYXgoaHRtbC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XHJcbiAgdmFyIGhlaWdodCA9IE1hdGgubWF4KGh0bWwuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMCk7XHJcblxyXG4gIHZhciBzY3JvbGxUb3AgPSAhZXhjbHVkZVNjcm9sbCA/IGdldFNjcm9sbChodG1sKSA6IDA7XHJcbiAgdmFyIHNjcm9sbExlZnQgPSAhZXhjbHVkZVNjcm9sbCA/IGdldFNjcm9sbChodG1sLCAnbGVmdCcpIDogMDtcclxuXHJcbiAgdmFyIG9mZnNldCA9IHtcclxuICAgIHRvcDogc2Nyb2xsVG9wIC0gcmVsYXRpdmVPZmZzZXQudG9wICsgcmVsYXRpdmVPZmZzZXQubWFyZ2luVG9wLFxyXG4gICAgbGVmdDogc2Nyb2xsTGVmdCAtIHJlbGF0aXZlT2Zmc2V0LmxlZnQgKyByZWxhdGl2ZU9mZnNldC5tYXJnaW5MZWZ0LFxyXG4gICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgaGVpZ2h0OiBoZWlnaHRcclxuICB9O1xyXG5cclxuICByZXR1cm4gZ2V0Q2xpZW50UmVjdChvZmZzZXQpO1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhlIGdpdmVuIGVsZW1lbnQgaXMgZml4ZWQgb3IgaXMgaW5zaWRlIGEgZml4ZWQgcGFyZW50XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBjdXN0b21Db250YWluZXJcclxuICogQHJldHVybnMge0Jvb2xlYW59IGFuc3dlciB0byBcImlzRml4ZWQ/XCJcclxuICovXHJcbmZ1bmN0aW9uIGlzRml4ZWQoZWxlbWVudCkge1xyXG4gIHZhciBub2RlTmFtZSA9IGVsZW1lbnQubm9kZU5hbWU7XHJcbiAgaWYgKG5vZGVOYW1lID09PSAnQk9EWScgfHwgbm9kZU5hbWUgPT09ICdIVE1MJykge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICBpZiAoZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KGVsZW1lbnQsICdwb3NpdGlvbicpID09PSAnZml4ZWQnKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGlzRml4ZWQoZ2V0UGFyZW50Tm9kZShlbGVtZW50KSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGaW5kcyB0aGUgZmlyc3QgcGFyZW50IG9mIGFuIGVsZW1lbnQgdGhhdCBoYXMgYSB0cmFuc2Zvcm1lZCBwcm9wZXJ0eSBkZWZpbmVkXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybnMge0VsZW1lbnR9IGZpcnN0IHRyYW5zZm9ybWVkIHBhcmVudCBvciBkb2N1bWVudEVsZW1lbnRcclxuICovXHJcblxyXG5mdW5jdGlvbiBnZXRGaXhlZFBvc2l0aW9uT2Zmc2V0UGFyZW50KGVsZW1lbnQpIHtcclxuICAvLyBUaGlzIGNoZWNrIGlzIG5lZWRlZCB0byBhdm9pZCBlcnJvcnMgaW4gY2FzZSBvbmUgb2YgdGhlIGVsZW1lbnRzIGlzbid0IGRlZmluZWQgZm9yIGFueSByZWFzb25cclxuICBpZiAoIWVsZW1lbnQgfHwgIWVsZW1lbnQucGFyZW50RWxlbWVudCB8fCBpc0lFJDEoKSkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICB9XHJcbiAgdmFyIGVsID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gIHdoaWxlIChlbCAmJiBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWwsICd0cmFuc2Zvcm0nKSA9PT0gJ25vbmUnKSB7XHJcbiAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgfVxyXG4gIHJldHVybiBlbCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb21wdXRlZCB0aGUgYm91bmRhcmllcyBsaW1pdHMgYW5kIHJldHVybiB0aGVtXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3BwZXJcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcmVmZXJlbmNlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwYWRkaW5nXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGJvdW5kYXJpZXNFbGVtZW50IC0gRWxlbWVudCB1c2VkIHRvIGRlZmluZSB0aGUgYm91bmRhcmllc1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGZpeGVkUG9zaXRpb24gLSBJcyBpbiBmaXhlZCBwb3NpdGlvbiBtb2RlXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IENvb3JkaW5hdGVzIG9mIHRoZSBib3VuZGFyaWVzXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRCb3VuZGFyaWVzKHBvcHBlciwgcmVmZXJlbmNlLCBwYWRkaW5nLCBib3VuZGFyaWVzRWxlbWVudCkge1xyXG4gIHZhciBmaXhlZFBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiBmYWxzZTtcclxuXHJcbiAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcclxuXHJcbiAgdmFyIGJvdW5kYXJpZXMgPSB7IHRvcDogMCwgbGVmdDogMCB9O1xyXG4gIHZhciBvZmZzZXRQYXJlbnQgPSBmaXhlZFBvc2l0aW9uID8gZ2V0Rml4ZWRQb3NpdGlvbk9mZnNldFBhcmVudChwb3BwZXIpIDogZmluZENvbW1vbk9mZnNldFBhcmVudChwb3BwZXIsIHJlZmVyZW5jZSk7XHJcblxyXG4gIC8vIEhhbmRsZSB2aWV3cG9ydCBjYXNlXHJcbiAgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAndmlld3BvcnQnKSB7XHJcbiAgICBib3VuZGFyaWVzID0gZ2V0Vmlld3BvcnRPZmZzZXRSZWN0UmVsYXRpdmVUb0FydGJpdHJhcnlOb2RlKG9mZnNldFBhcmVudCwgZml4ZWRQb3NpdGlvbik7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIEhhbmRsZSBvdGhlciBjYXNlcyBiYXNlZCBvbiBET00gZWxlbWVudCB1c2VkIGFzIGJvdW5kYXJpZXNcclxuICAgIHZhciBib3VuZGFyaWVzTm9kZSA9IHZvaWQgMDtcclxuICAgIGlmIChib3VuZGFyaWVzRWxlbWVudCA9PT0gJ3Njcm9sbFBhcmVudCcpIHtcclxuICAgICAgYm91bmRhcmllc05vZGUgPSBnZXRTY3JvbGxQYXJlbnQoZ2V0UGFyZW50Tm9kZShyZWZlcmVuY2UpKTtcclxuICAgICAgaWYgKGJvdW5kYXJpZXNOb2RlLm5vZGVOYW1lID09PSAnQk9EWScpIHtcclxuICAgICAgICBib3VuZGFyaWVzTm9kZSA9IHBvcHBlci5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChib3VuZGFyaWVzRWxlbWVudCA9PT0gJ3dpbmRvdycpIHtcclxuICAgICAgYm91bmRhcmllc05vZGUgPSBwb3BwZXIub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBib3VuZGFyaWVzTm9kZSA9IGJvdW5kYXJpZXNFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBvZmZzZXRzID0gZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlKGJvdW5kYXJpZXNOb2RlLCBvZmZzZXRQYXJlbnQsIGZpeGVkUG9zaXRpb24pO1xyXG5cclxuICAgIC8vIEluIGNhc2Ugb2YgSFRNTCwgd2UgbmVlZCBhIGRpZmZlcmVudCBjb21wdXRhdGlvblxyXG4gICAgaWYgKGJvdW5kYXJpZXNOb2RlLm5vZGVOYW1lID09PSAnSFRNTCcgJiYgIWlzRml4ZWQob2Zmc2V0UGFyZW50KSkge1xyXG4gICAgICB2YXIgX2dldFdpbmRvd1NpemVzID0gZ2V0V2luZG93U2l6ZXMoKSxcclxuICAgICAgICAgIGhlaWdodCA9IF9nZXRXaW5kb3dTaXplcy5oZWlnaHQsXHJcbiAgICAgICAgICB3aWR0aCA9IF9nZXRXaW5kb3dTaXplcy53aWR0aDtcclxuXHJcbiAgICAgIGJvdW5kYXJpZXMudG9wICs9IG9mZnNldHMudG9wIC0gb2Zmc2V0cy5tYXJnaW5Ub3A7XHJcbiAgICAgIGJvdW5kYXJpZXMuYm90dG9tID0gaGVpZ2h0ICsgb2Zmc2V0cy50b3A7XHJcbiAgICAgIGJvdW5kYXJpZXMubGVmdCArPSBvZmZzZXRzLmxlZnQgLSBvZmZzZXRzLm1hcmdpbkxlZnQ7XHJcbiAgICAgIGJvdW5kYXJpZXMucmlnaHQgPSB3aWR0aCArIG9mZnNldHMubGVmdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGZvciBhbGwgdGhlIG90aGVyIERPTSBlbGVtZW50cywgdGhpcyBvbmUgaXMgZ29vZFxyXG4gICAgICBib3VuZGFyaWVzID0gb2Zmc2V0cztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEFkZCBwYWRkaW5nc1xyXG4gIGJvdW5kYXJpZXMubGVmdCArPSBwYWRkaW5nO1xyXG4gIGJvdW5kYXJpZXMudG9wICs9IHBhZGRpbmc7XHJcbiAgYm91bmRhcmllcy5yaWdodCAtPSBwYWRkaW5nO1xyXG4gIGJvdW5kYXJpZXMuYm90dG9tIC09IHBhZGRpbmc7XHJcblxyXG4gIHJldHVybiBib3VuZGFyaWVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBcmVhKF9yZWYpIHtcclxuICB2YXIgd2lkdGggPSBfcmVmLndpZHRoLFxyXG4gICAgICBoZWlnaHQgPSBfcmVmLmhlaWdodDtcclxuXHJcbiAgcmV0dXJuIHdpZHRoICogaGVpZ2h0O1xyXG59XHJcblxyXG4vKipcclxuICogVXRpbGl0eSB1c2VkIHRvIHRyYW5zZm9ybSB0aGUgYGF1dG9gIHBsYWNlbWVudCB0byB0aGUgcGxhY2VtZW50IHdpdGggbW9yZVxyXG4gKiBhdmFpbGFibGUgc3BhY2UuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIGNvbXB1dGVBdXRvUGxhY2VtZW50KHBsYWNlbWVudCwgcmVmUmVjdCwgcG9wcGVyLCByZWZlcmVuY2UsIGJvdW5kYXJpZXNFbGVtZW50KSB7XHJcbiAgdmFyIHBhZGRpbmcgPSBhcmd1bWVudHMubGVuZ3RoID4gNSAmJiBhcmd1bWVudHNbNV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s1XSA6IDA7XHJcblxyXG4gIGlmIChwbGFjZW1lbnQuaW5kZXhPZignYXV0bycpID09PSAtMSkge1xyXG4gICAgcmV0dXJuIHBsYWNlbWVudDtcclxuICB9XHJcblxyXG4gIHZhciBib3VuZGFyaWVzID0gZ2V0Qm91bmRhcmllcyhwb3BwZXIsIHJlZmVyZW5jZSwgcGFkZGluZywgYm91bmRhcmllc0VsZW1lbnQpO1xyXG5cclxuICB2YXIgcmVjdHMgPSB7XHJcbiAgICB0b3A6IHtcclxuICAgICAgd2lkdGg6IGJvdW5kYXJpZXMud2lkdGgsXHJcbiAgICAgIGhlaWdodDogcmVmUmVjdC50b3AgLSBib3VuZGFyaWVzLnRvcFxyXG4gICAgfSxcclxuICAgIHJpZ2h0OiB7XHJcbiAgICAgIHdpZHRoOiBib3VuZGFyaWVzLnJpZ2h0IC0gcmVmUmVjdC5yaWdodCxcclxuICAgICAgaGVpZ2h0OiBib3VuZGFyaWVzLmhlaWdodFxyXG4gICAgfSxcclxuICAgIGJvdHRvbToge1xyXG4gICAgICB3aWR0aDogYm91bmRhcmllcy53aWR0aCxcclxuICAgICAgaGVpZ2h0OiBib3VuZGFyaWVzLmJvdHRvbSAtIHJlZlJlY3QuYm90dG9tXHJcbiAgICB9LFxyXG4gICAgbGVmdDoge1xyXG4gICAgICB3aWR0aDogcmVmUmVjdC5sZWZ0IC0gYm91bmRhcmllcy5sZWZ0LFxyXG4gICAgICBoZWlnaHQ6IGJvdW5kYXJpZXMuaGVpZ2h0XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIHNvcnRlZEFyZWFzID0gT2JqZWN0LmtleXMocmVjdHMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICByZXR1cm4gX2V4dGVuZHMkMSh7XHJcbiAgICAgIGtleToga2V5XHJcbiAgICB9LCByZWN0c1trZXldLCB7XHJcbiAgICAgIGFyZWE6IGdldEFyZWEocmVjdHNba2V5XSlcclxuICAgIH0pO1xyXG4gIH0pLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgIHJldHVybiBiLmFyZWEgLSBhLmFyZWE7XHJcbiAgfSk7XHJcblxyXG4gIHZhciBmaWx0ZXJlZEFyZWFzID0gc29ydGVkQXJlYXMuZmlsdGVyKGZ1bmN0aW9uIChfcmVmMikge1xyXG4gICAgdmFyIHdpZHRoID0gX3JlZjIud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0ID0gX3JlZjIuaGVpZ2h0O1xyXG4gICAgcmV0dXJuIHdpZHRoID49IHBvcHBlci5jbGllbnRXaWR0aCAmJiBoZWlnaHQgPj0gcG9wcGVyLmNsaWVudEhlaWdodDtcclxuICB9KTtcclxuXHJcbiAgdmFyIGNvbXB1dGVkUGxhY2VtZW50ID0gZmlsdGVyZWRBcmVhcy5sZW5ndGggPiAwID8gZmlsdGVyZWRBcmVhc1swXS5rZXkgOiBzb3J0ZWRBcmVhc1swXS5rZXk7XHJcblxyXG4gIHZhciB2YXJpYXRpb24gPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVsxXTtcclxuXHJcbiAgcmV0dXJuIGNvbXB1dGVkUGxhY2VtZW50ICsgKHZhcmlhdGlvbiA/ICctJyArIHZhcmlhdGlvbiA6ICcnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBvZmZzZXRzIHRvIHRoZSByZWZlcmVuY2UgZWxlbWVudFxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcG9wcGVyIC0gdGhlIHBvcHBlciBlbGVtZW50XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcmVmZXJlbmNlIC0gdGhlIHJlZmVyZW5jZSBlbGVtZW50ICh0aGUgcG9wcGVyIHdpbGwgYmUgcmVsYXRpdmUgdG8gdGhpcylcclxuICogQHBhcmFtIHtFbGVtZW50fSBmaXhlZFBvc2l0aW9uIC0gaXMgaW4gZml4ZWQgcG9zaXRpb24gbW9kZVxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgb2Zmc2V0cyB3aGljaCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlclxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UmVmZXJlbmNlT2Zmc2V0cyhzdGF0ZSwgcG9wcGVyLCByZWZlcmVuY2UpIHtcclxuICB2YXIgZml4ZWRQb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogbnVsbDtcclxuXHJcbiAgdmFyIGNvbW1vbk9mZnNldFBhcmVudCA9IGZpeGVkUG9zaXRpb24gPyBnZXRGaXhlZFBvc2l0aW9uT2Zmc2V0UGFyZW50KHBvcHBlcikgOiBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50KHBvcHBlciwgcmVmZXJlbmNlKTtcclxuICByZXR1cm4gZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlKHJlZmVyZW5jZSwgY29tbW9uT2Zmc2V0UGFyZW50LCBmaXhlZFBvc2l0aW9uKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgb3V0ZXIgc2l6ZXMgb2YgdGhlIGdpdmVuIGVsZW1lbnQgKG9mZnNldCBzaXplICsgbWFyZ2lucylcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBvYmplY3QgY29udGFpbmluZyB3aWR0aCBhbmQgaGVpZ2h0IHByb3BlcnRpZXNcclxuICovXHJcbmZ1bmN0aW9uIGdldE91dGVyU2l6ZXMoZWxlbWVudCkge1xyXG4gIHZhciBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xyXG4gIHZhciB4ID0gcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luVG9wKSArIHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpbkJvdHRvbSk7XHJcbiAgdmFyIHkgPSBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5MZWZ0KSArIHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpblJpZ2h0KTtcclxuICB2YXIgcmVzdWx0ID0ge1xyXG4gICAgd2lkdGg6IGVsZW1lbnQub2Zmc2V0V2lkdGggKyB5LFxyXG4gICAgaGVpZ2h0OiBlbGVtZW50Lm9mZnNldEhlaWdodCArIHhcclxuICB9O1xyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIG9wcG9zaXRlIHBsYWNlbWVudCBvZiB0aGUgZ2l2ZW4gb25lXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gcGxhY2VtZW50XHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IGZsaXBwZWQgcGxhY2VtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpIHtcclxuICB2YXIgaGFzaCA9IHsgbGVmdDogJ3JpZ2h0JywgcmlnaHQ6ICdsZWZ0JywgYm90dG9tOiAndG9wJywgdG9wOiAnYm90dG9tJyB9O1xyXG4gIHJldHVybiBwbGFjZW1lbnQucmVwbGFjZSgvbGVmdHxyaWdodHxib3R0b218dG9wL2csIGZ1bmN0aW9uIChtYXRjaGVkKSB7XHJcbiAgICByZXR1cm4gaGFzaFttYXRjaGVkXTtcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBvZmZzZXRzIHRvIHRoZSBwb3BwZXJcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBwb3NpdGlvbiAtIENTUyBwb3NpdGlvbiB0aGUgUG9wcGVyIHdpbGwgZ2V0IGFwcGxpZWRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcG9wcGVyIC0gdGhlIHBvcHBlciBlbGVtZW50XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWZlcmVuY2VPZmZzZXRzIC0gdGhlIHJlZmVyZW5jZSBvZmZzZXRzICh0aGUgcG9wcGVyIHdpbGwgYmUgcmVsYXRpdmUgdG8gdGhpcylcclxuICogQHBhcmFtIHtTdHJpbmd9IHBsYWNlbWVudCAtIG9uZSBvZiB0aGUgdmFsaWQgcGxhY2VtZW50IG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gcG9wcGVyT2Zmc2V0cyAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBvZmZzZXRzIHdoaWNoIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRQb3BwZXJPZmZzZXRzKHBvcHBlciwgcmVmZXJlbmNlT2Zmc2V0cywgcGxhY2VtZW50KSB7XHJcbiAgcGxhY2VtZW50ID0gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcblxyXG4gIC8vIEdldCBwb3BwZXIgbm9kZSBzaXplc1xyXG4gIHZhciBwb3BwZXJSZWN0ID0gZ2V0T3V0ZXJTaXplcyhwb3BwZXIpO1xyXG5cclxuICAvLyBBZGQgcG9zaXRpb24sIHdpZHRoIGFuZCBoZWlnaHQgdG8gb3VyIG9mZnNldHMgb2JqZWN0XHJcbiAgdmFyIHBvcHBlck9mZnNldHMgPSB7XHJcbiAgICB3aWR0aDogcG9wcGVyUmVjdC53aWR0aCxcclxuICAgIGhlaWdodDogcG9wcGVyUmVjdC5oZWlnaHRcclxuICB9O1xyXG5cclxuICAvLyBkZXBlbmRpbmcgYnkgdGhlIHBvcHBlciBwbGFjZW1lbnQgd2UgaGF2ZSB0byBjb21wdXRlIGl0cyBvZmZzZXRzIHNsaWdodGx5IGRpZmZlcmVudGx5XHJcbiAgdmFyIGlzSG9yaXogPSBbJ3JpZ2h0JywgJ2xlZnQnXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xO1xyXG4gIHZhciBtYWluU2lkZSA9IGlzSG9yaXogPyAndG9wJyA6ICdsZWZ0JztcclxuICB2YXIgc2Vjb25kYXJ5U2lkZSA9IGlzSG9yaXogPyAnbGVmdCcgOiAndG9wJztcclxuICB2YXIgbWVhc3VyZW1lbnQgPSBpc0hvcml6ID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xyXG4gIHZhciBzZWNvbmRhcnlNZWFzdXJlbWVudCA9ICFpc0hvcml6ID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xyXG5cclxuICBwb3BwZXJPZmZzZXRzW21haW5TaWRlXSA9IHJlZmVyZW5jZU9mZnNldHNbbWFpblNpZGVdICsgcmVmZXJlbmNlT2Zmc2V0c1ttZWFzdXJlbWVudF0gLyAyIC0gcG9wcGVyUmVjdFttZWFzdXJlbWVudF0gLyAyO1xyXG4gIGlmIChwbGFjZW1lbnQgPT09IHNlY29uZGFyeVNpZGUpIHtcclxuICAgIHBvcHBlck9mZnNldHNbc2Vjb25kYXJ5U2lkZV0gPSByZWZlcmVuY2VPZmZzZXRzW3NlY29uZGFyeVNpZGVdIC0gcG9wcGVyUmVjdFtzZWNvbmRhcnlNZWFzdXJlbWVudF07XHJcbiAgfSBlbHNlIHtcclxuICAgIHBvcHBlck9mZnNldHNbc2Vjb25kYXJ5U2lkZV0gPSByZWZlcmVuY2VPZmZzZXRzW2dldE9wcG9zaXRlUGxhY2VtZW50KHNlY29uZGFyeVNpZGUpXTtcclxuICB9XHJcblxyXG4gIHJldHVybiBwb3BwZXJPZmZzZXRzO1xyXG59XHJcblxyXG4vKipcclxuICogTWltaWNzIHRoZSBgZmluZGAgbWV0aG9kIG9mIEFycmF5XHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0FycmF5fSBhcnJcclxuICogQGFyZ3VtZW50IHByb3BcclxuICogQGFyZ3VtZW50IHZhbHVlXHJcbiAqIEByZXR1cm5zIGluZGV4IG9yIC0xXHJcbiAqL1xyXG5mdW5jdGlvbiBmaW5kKGFyciwgY2hlY2spIHtcclxuICAvLyB1c2UgbmF0aXZlIGZpbmQgaWYgc3VwcG9ydGVkXHJcbiAgaWYgKEFycmF5LnByb3RvdHlwZS5maW5kKSB7XHJcbiAgICByZXR1cm4gYXJyLmZpbmQoY2hlY2spO1xyXG4gIH1cclxuXHJcbiAgLy8gdXNlIGBmaWx0ZXJgIHRvIG9idGFpbiB0aGUgc2FtZSBiZWhhdmlvciBvZiBgZmluZGBcclxuICByZXR1cm4gYXJyLmZpbHRlcihjaGVjaylbMF07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGluZGV4IG9mIHRoZSBtYXRjaGluZyBvYmplY3RcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7QXJyYXl9IGFyclxyXG4gKiBAYXJndW1lbnQgcHJvcFxyXG4gKiBAYXJndW1lbnQgdmFsdWVcclxuICogQHJldHVybnMgaW5kZXggb3IgLTFcclxuICovXHJcbmZ1bmN0aW9uIGZpbmRJbmRleChhcnIsIHByb3AsIHZhbHVlKSB7XHJcbiAgLy8gdXNlIG5hdGl2ZSBmaW5kSW5kZXggaWYgc3VwcG9ydGVkXHJcbiAgaWYgKEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgpIHtcclxuICAgIHJldHVybiBhcnIuZmluZEluZGV4KGZ1bmN0aW9uIChjdXIpIHtcclxuICAgICAgcmV0dXJuIGN1cltwcm9wXSA9PT0gdmFsdWU7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIHVzZSBgZmluZGAgKyBgaW5kZXhPZmAgaWYgYGZpbmRJbmRleGAgaXNuJ3Qgc3VwcG9ydGVkXHJcbiAgdmFyIG1hdGNoID0gZmluZChhcnIsIGZ1bmN0aW9uIChvYmopIHtcclxuICAgIHJldHVybiBvYmpbcHJvcF0gPT09IHZhbHVlO1xyXG4gIH0pO1xyXG4gIHJldHVybiBhcnIuaW5kZXhPZihtYXRjaCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBMb29wIHRyb3VnaCB0aGUgbGlzdCBvZiBtb2RpZmllcnMgYW5kIHJ1biB0aGVtIGluIG9yZGVyLFxyXG4gKiBlYWNoIG9mIHRoZW0gd2lsbCB0aGVuIGVkaXQgdGhlIGRhdGEgb2JqZWN0LlxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHtkYXRhT2JqZWN0fSBkYXRhXHJcbiAqIEBwYXJhbSB7QXJyYXl9IG1vZGlmaWVyc1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gZW5kcyAtIE9wdGlvbmFsIG1vZGlmaWVyIG5hbWUgdXNlZCBhcyBzdG9wcGVyXHJcbiAqIEByZXR1cm5zIHtkYXRhT2JqZWN0fVxyXG4gKi9cclxuZnVuY3Rpb24gcnVuTW9kaWZpZXJzKG1vZGlmaWVycywgZGF0YSwgZW5kcykge1xyXG4gIHZhciBtb2RpZmllcnNUb1J1biA9IGVuZHMgPT09IHVuZGVmaW5lZCA/IG1vZGlmaWVycyA6IG1vZGlmaWVycy5zbGljZSgwLCBmaW5kSW5kZXgobW9kaWZpZXJzLCAnbmFtZScsIGVuZHMpKTtcclxuXHJcbiAgbW9kaWZpZXJzVG9SdW4uZm9yRWFjaChmdW5jdGlvbiAobW9kaWZpZXIpIHtcclxuICAgIGlmIChtb2RpZmllclsnZnVuY3Rpb24nXSkge1xyXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGRvdC1ub3RhdGlvblxyXG4gICAgICBjb25zb2xlLndhcm4oJ2Btb2RpZmllci5mdW5jdGlvbmAgaXMgZGVwcmVjYXRlZCwgdXNlIGBtb2RpZmllci5mbmAhJyk7XHJcbiAgICB9XHJcbiAgICB2YXIgZm4gPSBtb2RpZmllclsnZnVuY3Rpb24nXSB8fCBtb2RpZmllci5mbjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBkb3Qtbm90YXRpb25cclxuICAgIGlmIChtb2RpZmllci5lbmFibGVkICYmIGlzRnVuY3Rpb24oZm4pKSB7XHJcbiAgICAgIC8vIEFkZCBwcm9wZXJ0aWVzIHRvIG9mZnNldHMgdG8gbWFrZSB0aGVtIGEgY29tcGxldGUgY2xpZW50UmVjdCBvYmplY3RcclxuICAgICAgLy8gd2UgZG8gdGhpcyBiZWZvcmUgZWFjaCBtb2RpZmllciB0byBtYWtlIHN1cmUgdGhlIHByZXZpb3VzIG9uZSBkb2Vzbid0XHJcbiAgICAgIC8vIG1lc3Mgd2l0aCB0aGVzZSB2YWx1ZXNcclxuICAgICAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IGdldENsaWVudFJlY3QoZGF0YS5vZmZzZXRzLnBvcHBlcik7XHJcbiAgICAgIGRhdGEub2Zmc2V0cy5yZWZlcmVuY2UgPSBnZXRDbGllbnRSZWN0KGRhdGEub2Zmc2V0cy5yZWZlcmVuY2UpO1xyXG5cclxuICAgICAgZGF0YSA9IGZuKGRhdGEsIG1vZGlmaWVyKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9wcGVyLCBjb21wdXRpbmcgdGhlIG5ldyBvZmZzZXRzIGFuZCBhcHBseWluZ1xyXG4gKiB0aGUgbmV3IHN0eWxlLjxiciAvPlxyXG4gKiBQcmVmZXIgYHNjaGVkdWxlVXBkYXRlYCBvdmVyIGB1cGRhdGVgIGJlY2F1c2Ugb2YgcGVyZm9ybWFuY2UgcmVhc29ucy5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGUoKSB7XHJcbiAgLy8gaWYgcG9wcGVyIGlzIGRlc3Ryb3llZCwgZG9uJ3QgcGVyZm9ybSBhbnkgZnVydGhlciB1cGRhdGVcclxuICBpZiAodGhpcy5zdGF0ZS5pc0Rlc3Ryb3llZCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgdmFyIGRhdGEgPSB7XHJcbiAgICBpbnN0YW5jZTogdGhpcyxcclxuICAgIHN0eWxlczoge30sXHJcbiAgICBhcnJvd1N0eWxlczoge30sXHJcbiAgICBhdHRyaWJ1dGVzOiB7fSxcclxuICAgIGZsaXBwZWQ6IGZhbHNlLFxyXG4gICAgb2Zmc2V0czoge31cclxuICB9O1xyXG5cclxuICAvLyBjb21wdXRlIHJlZmVyZW5jZSBlbGVtZW50IG9mZnNldHNcclxuICBkYXRhLm9mZnNldHMucmVmZXJlbmNlID0gZ2V0UmVmZXJlbmNlT2Zmc2V0cyh0aGlzLnN0YXRlLCB0aGlzLnBvcHBlciwgdGhpcy5yZWZlcmVuY2UsIHRoaXMub3B0aW9ucy5wb3NpdGlvbkZpeGVkKTtcclxuXHJcbiAgLy8gY29tcHV0ZSBhdXRvIHBsYWNlbWVudCwgc3RvcmUgcGxhY2VtZW50IGluc2lkZSB0aGUgZGF0YSBvYmplY3QsXHJcbiAgLy8gbW9kaWZpZXJzIHdpbGwgYmUgYWJsZSB0byBlZGl0IGBwbGFjZW1lbnRgIGlmIG5lZWRlZFxyXG4gIC8vIGFuZCByZWZlciB0byBvcmlnaW5hbFBsYWNlbWVudCB0byBrbm93IHRoZSBvcmlnaW5hbCB2YWx1ZVxyXG4gIGRhdGEucGxhY2VtZW50ID0gY29tcHV0ZUF1dG9QbGFjZW1lbnQodGhpcy5vcHRpb25zLnBsYWNlbWVudCwgZGF0YS5vZmZzZXRzLnJlZmVyZW5jZSwgdGhpcy5wb3BwZXIsIHRoaXMucmVmZXJlbmNlLCB0aGlzLm9wdGlvbnMubW9kaWZpZXJzLmZsaXAuYm91bmRhcmllc0VsZW1lbnQsIHRoaXMub3B0aW9ucy5tb2RpZmllcnMuZmxpcC5wYWRkaW5nKTtcclxuXHJcbiAgLy8gc3RvcmUgdGhlIGNvbXB1dGVkIHBsYWNlbWVudCBpbnNpZGUgYG9yaWdpbmFsUGxhY2VtZW50YFxyXG4gIGRhdGEub3JpZ2luYWxQbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudDtcclxuXHJcbiAgZGF0YS5wb3NpdGlvbkZpeGVkID0gdGhpcy5vcHRpb25zLnBvc2l0aW9uRml4ZWQ7XHJcblxyXG4gIC8vIGNvbXB1dGUgdGhlIHBvcHBlciBvZmZzZXRzXHJcbiAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IGdldFBvcHBlck9mZnNldHModGhpcy5wb3BwZXIsIGRhdGEub2Zmc2V0cy5yZWZlcmVuY2UsIGRhdGEucGxhY2VtZW50KTtcclxuXHJcbiAgZGF0YS5vZmZzZXRzLnBvcHBlci5wb3NpdGlvbiA9IHRoaXMub3B0aW9ucy5wb3NpdGlvbkZpeGVkID8gJ2ZpeGVkJyA6ICdhYnNvbHV0ZSc7XHJcblxyXG4gIC8vIHJ1biB0aGUgbW9kaWZpZXJzXHJcbiAgZGF0YSA9IHJ1bk1vZGlmaWVycyh0aGlzLm1vZGlmaWVycywgZGF0YSk7XHJcblxyXG4gIC8vIHRoZSBmaXJzdCBgdXBkYXRlYCB3aWxsIGNhbGwgYG9uQ3JlYXRlYCBjYWxsYmFja1xyXG4gIC8vIHRoZSBvdGhlciBvbmVzIHdpbGwgY2FsbCBgb25VcGRhdGVgIGNhbGxiYWNrXHJcbiAgaWYgKCF0aGlzLnN0YXRlLmlzQ3JlYXRlZCkge1xyXG4gICAgdGhpcy5zdGF0ZS5pc0NyZWF0ZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5vcHRpb25zLm9uQ3JlYXRlKGRhdGEpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLm9wdGlvbnMub25VcGRhdGUoZGF0YSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogSGVscGVyIHVzZWQgdG8ga25vdyBpZiB0aGUgZ2l2ZW4gbW9kaWZpZXIgaXMgZW5hYmxlZC5cclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEByZXR1cm5zIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNNb2RpZmllckVuYWJsZWQobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpIHtcclxuICByZXR1cm4gbW9kaWZpZXJzLnNvbWUoZnVuY3Rpb24gKF9yZWYpIHtcclxuICAgIHZhciBuYW1lID0gX3JlZi5uYW1lLFxyXG4gICAgICAgIGVuYWJsZWQgPSBfcmVmLmVuYWJsZWQ7XHJcbiAgICByZXR1cm4gZW5hYmxlZCAmJiBuYW1lID09PSBtb2RpZmllck5hbWU7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHByZWZpeGVkIHN1cHBvcnRlZCBwcm9wZXJ0eSBuYW1lXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gcHJvcGVydHkgKGNhbWVsQ2FzZSlcclxuICogQHJldHVybnMge1N0cmluZ30gcHJlZml4ZWQgcHJvcGVydHkgKGNhbWVsQ2FzZSBvciBQYXNjYWxDYXNlLCBkZXBlbmRpbmcgb24gdGhlIHZlbmRvciBwcmVmaXgpXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRTdXBwb3J0ZWRQcm9wZXJ0eU5hbWUocHJvcGVydHkpIHtcclxuICB2YXIgcHJlZml4ZXMgPSBbZmFsc2UsICdtcycsICdXZWJraXQnLCAnTW96JywgJ08nXTtcclxuICB2YXIgdXBwZXJQcm9wID0gcHJvcGVydHkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wZXJ0eS5zbGljZSgxKTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHByZWZpeCA9IHByZWZpeGVzW2ldO1xyXG4gICAgdmFyIHRvQ2hlY2sgPSBwcmVmaXggPyAnJyArIHByZWZpeCArIHVwcGVyUHJvcCA6IHByb3BlcnR5O1xyXG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudC5ib2R5LnN0eWxlW3RvQ2hlY2tdICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICByZXR1cm4gdG9DaGVjaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEZXN0cm95IHRoZSBwb3BwZXJcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyXHJcbiAqL1xyXG5mdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gIHRoaXMuc3RhdGUuaXNEZXN0cm95ZWQgPSB0cnVlO1xyXG5cclxuICAvLyB0b3VjaCBET00gb25seSBpZiBgYXBwbHlTdHlsZWAgbW9kaWZpZXIgaXMgZW5hYmxlZFxyXG4gIGlmIChpc01vZGlmaWVyRW5hYmxlZCh0aGlzLm1vZGlmaWVycywgJ2FwcGx5U3R5bGUnKSkge1xyXG4gICAgdGhpcy5wb3BwZXIucmVtb3ZlQXR0cmlidXRlKCd4LXBsYWNlbWVudCcpO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGUucG9zaXRpb24gPSAnJztcclxuICAgIHRoaXMucG9wcGVyLnN0eWxlLnRvcCA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGUubGVmdCA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGUucmlnaHQgPSAnJztcclxuICAgIHRoaXMucG9wcGVyLnN0eWxlLmJvdHRvbSA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGUud2lsbENoYW5nZSA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXIuc3R5bGVbZ2V0U3VwcG9ydGVkUHJvcGVydHlOYW1lKCd0cmFuc2Zvcm0nKV0gPSAnJztcclxuICB9XHJcblxyXG4gIHRoaXMuZGlzYWJsZUV2ZW50TGlzdGVuZXJzKCk7XHJcblxyXG4gIC8vIHJlbW92ZSB0aGUgcG9wcGVyIGlmIHVzZXIgZXhwbGljaXR5IGFza2VkIGZvciB0aGUgZGVsZXRpb24gb24gZGVzdHJveVxyXG4gIC8vIGRvIG5vdCB1c2UgYHJlbW92ZWAgYmVjYXVzZSBJRTExIGRvZXNuJ3Qgc3VwcG9ydCBpdFxyXG4gIGlmICh0aGlzLm9wdGlvbnMucmVtb3ZlT25EZXN0cm95KSB7XHJcbiAgICB0aGlzLnBvcHBlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMucG9wcGVyKTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgdGhlIHdpbmRvdyBhc3NvY2lhdGVkIHdpdGggdGhlIGVsZW1lbnRcclxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtXaW5kb3d9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRXaW5kb3coZWxlbWVudCkge1xyXG4gIHZhciBvd25lckRvY3VtZW50ID0gZWxlbWVudC5vd25lckRvY3VtZW50O1xyXG4gIHJldHVybiBvd25lckRvY3VtZW50ID8gb3duZXJEb2N1bWVudC5kZWZhdWx0VmlldyA6IHdpbmRvdztcclxufVxyXG5cclxuZnVuY3Rpb24gYXR0YWNoVG9TY3JvbGxQYXJlbnRzKHNjcm9sbFBhcmVudCwgZXZlbnQsIGNhbGxiYWNrLCBzY3JvbGxQYXJlbnRzKSB7XHJcbiAgdmFyIGlzQm9keSA9IHNjcm9sbFBhcmVudC5ub2RlTmFtZSA9PT0gJ0JPRFknO1xyXG4gIHZhciB0YXJnZXQgPSBpc0JvZHkgPyBzY3JvbGxQYXJlbnQub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldyA6IHNjcm9sbFBhcmVudDtcclxuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2ssIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcclxuXHJcbiAgaWYgKCFpc0JvZHkpIHtcclxuICAgIGF0dGFjaFRvU2Nyb2xsUGFyZW50cyhnZXRTY3JvbGxQYXJlbnQodGFyZ2V0LnBhcmVudE5vZGUpLCBldmVudCwgY2FsbGJhY2ssIHNjcm9sbFBhcmVudHMpO1xyXG4gIH1cclxuICBzY3JvbGxQYXJlbnRzLnB1c2godGFyZ2V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldHVwIG5lZWRlZCBldmVudCBsaXN0ZW5lcnMgdXNlZCB0byB1cGRhdGUgdGhlIHBvcHBlciBwb3NpdGlvblxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIHNldHVwRXZlbnRMaXN0ZW5lcnMocmVmZXJlbmNlLCBvcHRpb25zLCBzdGF0ZSwgdXBkYXRlQm91bmQpIHtcclxuICAvLyBSZXNpemUgZXZlbnQgbGlzdGVuZXIgb24gd2luZG93XHJcbiAgc3RhdGUudXBkYXRlQm91bmQgPSB1cGRhdGVCb3VuZDtcclxuICBnZXRXaW5kb3cocmVmZXJlbmNlKS5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBzdGF0ZS51cGRhdGVCb3VuZCwgeyBwYXNzaXZlOiB0cnVlIH0pO1xyXG5cclxuICAvLyBTY3JvbGwgZXZlbnQgbGlzdGVuZXIgb24gc2Nyb2xsIHBhcmVudHNcclxuICB2YXIgc2Nyb2xsRWxlbWVudCA9IGdldFNjcm9sbFBhcmVudChyZWZlcmVuY2UpO1xyXG4gIGF0dGFjaFRvU2Nyb2xsUGFyZW50cyhzY3JvbGxFbGVtZW50LCAnc2Nyb2xsJywgc3RhdGUudXBkYXRlQm91bmQsIHN0YXRlLnNjcm9sbFBhcmVudHMpO1xyXG4gIHN0YXRlLnNjcm9sbEVsZW1lbnQgPSBzY3JvbGxFbGVtZW50O1xyXG4gIHN0YXRlLmV2ZW50c0VuYWJsZWQgPSB0cnVlO1xyXG5cclxuICByZXR1cm4gc3RhdGU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJdCB3aWxsIGFkZCByZXNpemUvc2Nyb2xsIGV2ZW50cyBhbmQgc3RhcnQgcmVjYWxjdWxhdGluZ1xyXG4gKiBwb3NpdGlvbiBvZiB0aGUgcG9wcGVyIGVsZW1lbnQgd2hlbiB0aGV5IGFyZSB0cmlnZ2VyZWQuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlclxyXG4gKi9cclxuZnVuY3Rpb24gZW5hYmxlRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgaWYgKCF0aGlzLnN0YXRlLmV2ZW50c0VuYWJsZWQpIHtcclxuICAgIHRoaXMuc3RhdGUgPSBzZXR1cEV2ZW50TGlzdGVuZXJzKHRoaXMucmVmZXJlbmNlLCB0aGlzLm9wdGlvbnMsIHRoaXMuc3RhdGUsIHRoaXMuc2NoZWR1bGVVcGRhdGUpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMgdXNlZCB0byB1cGRhdGUgdGhlIHBvcHBlciBwb3NpdGlvblxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKHJlZmVyZW5jZSwgc3RhdGUpIHtcclxuICAvLyBSZW1vdmUgcmVzaXplIGV2ZW50IGxpc3RlbmVyIG9uIHdpbmRvd1xyXG4gIGdldFdpbmRvdyhyZWZlcmVuY2UpLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHN0YXRlLnVwZGF0ZUJvdW5kKTtcclxuXHJcbiAgLy8gUmVtb3ZlIHNjcm9sbCBldmVudCBsaXN0ZW5lciBvbiBzY3JvbGwgcGFyZW50c1xyXG4gIHN0YXRlLnNjcm9sbFBhcmVudHMuZm9yRWFjaChmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc3RhdGUudXBkYXRlQm91bmQpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBSZXNldCBzdGF0ZVxyXG4gIHN0YXRlLnVwZGF0ZUJvdW5kID0gbnVsbDtcclxuICBzdGF0ZS5zY3JvbGxQYXJlbnRzID0gW107XHJcbiAgc3RhdGUuc2Nyb2xsRWxlbWVudCA9IG51bGw7XHJcbiAgc3RhdGUuZXZlbnRzRW5hYmxlZCA9IGZhbHNlO1xyXG4gIHJldHVybiBzdGF0ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEl0IHdpbGwgcmVtb3ZlIHJlc2l6ZS9zY3JvbGwgZXZlbnRzIGFuZCB3b24ndCByZWNhbGN1bGF0ZSBwb3BwZXIgcG9zaXRpb25cclxuICogd2hlbiB0aGV5IGFyZSB0cmlnZ2VyZWQuIEl0IGFsc28gd29uJ3QgdHJpZ2dlciBvblVwZGF0ZSBjYWxsYmFjayBhbnltb3JlLFxyXG4gKiB1bmxlc3MgeW91IGNhbGwgYHVwZGF0ZWAgbWV0aG9kIG1hbnVhbGx5LlxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICovXHJcbmZ1bmN0aW9uIGRpc2FibGVFdmVudExpc3RlbmVycygpIHtcclxuICBpZiAodGhpcy5zdGF0ZS5ldmVudHNFbmFibGVkKSB7XHJcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnNjaGVkdWxlVXBkYXRlKTtcclxuICAgIHRoaXMuc3RhdGUgPSByZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLnJlZmVyZW5jZSwgdGhpcy5zdGF0ZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogVGVsbHMgaWYgYSBnaXZlbiBpbnB1dCBpcyBhIG51bWJlclxyXG4gKiBAbWV0aG9kXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcclxuICogQHBhcmFtIHsqfSBpbnB1dCB0byBjaGVja1xyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gaXNOdW1lcmljKG4pIHtcclxuICByZXR1cm4gbiAhPT0gJycgJiYgIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IHRoZSBzdHlsZSB0byB0aGUgZ2l2ZW4gcG9wcGVyXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnQgLSBFbGVtZW50IHRvIGFwcGx5IHRoZSBzdHlsZSB0b1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gc3R5bGVzXHJcbiAqIE9iamVjdCB3aXRoIGEgbGlzdCBvZiBwcm9wZXJ0aWVzIGFuZCB2YWx1ZXMgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRTdHlsZXMoZWxlbWVudCwgc3R5bGVzKSB7XHJcbiAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XHJcbiAgICB2YXIgdW5pdCA9ICcnO1xyXG4gICAgLy8gYWRkIHVuaXQgaWYgdGhlIHZhbHVlIGlzIG51bWVyaWMgYW5kIGlzIG9uZSBvZiB0aGUgZm9sbG93aW5nXHJcbiAgICBpZiAoWyd3aWR0aCcsICdoZWlnaHQnLCAndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0J10uaW5kZXhPZihwcm9wKSAhPT0gLTEgJiYgaXNOdW1lcmljKHN0eWxlc1twcm9wXSkpIHtcclxuICAgICAgdW5pdCA9ICdweCc7XHJcbiAgICB9XHJcbiAgICBlbGVtZW50LnN0eWxlW3Byb3BdID0gc3R5bGVzW3Byb3BdICsgdW5pdDtcclxuICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCB0aGUgYXR0cmlidXRlcyB0byB0aGUgZ2l2ZW4gcG9wcGVyXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnQgLSBFbGVtZW50IHRvIGFwcGx5IHRoZSBhdHRyaWJ1dGVzIHRvXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBzdHlsZXNcclxuICogT2JqZWN0IHdpdGggYSBsaXN0IG9mIHByb3BlcnRpZXMgYW5kIHZhbHVlcyB3aGljaCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMoZWxlbWVudCwgYXR0cmlidXRlcykge1xyXG4gIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcclxuICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNbcHJvcF07XHJcbiAgICBpZiAodmFsdWUgIT09IGZhbHNlKSB7XHJcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKHByb3AsIGF0dHJpYnV0ZXNbcHJvcF0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUocHJvcCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhLnN0eWxlcyAtIExpc3Qgb2Ygc3R5bGUgcHJvcGVydGllcyAtIHZhbHVlcyB0byBhcHBseSB0byBwb3BwZXIgZWxlbWVudFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YS5hdHRyaWJ1dGVzIC0gTGlzdCBvZiBhdHRyaWJ1dGUgcHJvcGVydGllcyAtIHZhbHVlcyB0byBhcHBseSB0byBwb3BwZXIgZWxlbWVudFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBzYW1lIGRhdGEgb2JqZWN0XHJcbiAqL1xyXG5mdW5jdGlvbiBhcHBseVN0eWxlKGRhdGEpIHtcclxuICAvLyBhbnkgcHJvcGVydHkgcHJlc2VudCBpbiBgZGF0YS5zdHlsZXNgIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyLFxyXG4gIC8vIGluIHRoaXMgd2F5IHdlIGNhbiBtYWtlIHRoZSAzcmQgcGFydHkgbW9kaWZpZXJzIGFkZCBjdXN0b20gc3R5bGVzIHRvIGl0XHJcbiAgLy8gQmUgYXdhcmUsIG1vZGlmaWVycyBjb3VsZCBvdmVycmlkZSB0aGUgcHJvcGVydGllcyBkZWZpbmVkIGluIHRoZSBwcmV2aW91c1xyXG4gIC8vIGxpbmVzIG9mIHRoaXMgbW9kaWZpZXIhXHJcbiAgc2V0U3R5bGVzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLnN0eWxlcyk7XHJcblxyXG4gIC8vIGFueSBwcm9wZXJ0eSBwcmVzZW50IGluIGBkYXRhLmF0dHJpYnV0ZXNgIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyLFxyXG4gIC8vIHRoZXkgd2lsbCBiZSBzZXQgYXMgSFRNTCBhdHRyaWJ1dGVzIG9mIHRoZSBlbGVtZW50XHJcbiAgc2V0QXR0cmlidXRlcyhkYXRhLmluc3RhbmNlLnBvcHBlciwgZGF0YS5hdHRyaWJ1dGVzKTtcclxuXHJcbiAgLy8gaWYgYXJyb3dFbGVtZW50IGlzIGRlZmluZWQgYW5kIGFycm93U3R5bGVzIGhhcyBzb21lIHByb3BlcnRpZXNcclxuICBpZiAoZGF0YS5hcnJvd0VsZW1lbnQgJiYgT2JqZWN0LmtleXMoZGF0YS5hcnJvd1N0eWxlcykubGVuZ3RoKSB7XHJcbiAgICBzZXRTdHlsZXMoZGF0YS5hcnJvd0VsZW1lbnQsIGRhdGEuYXJyb3dTdHlsZXMpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgdGhlIHgtcGxhY2VtZW50IGF0dHJpYnV0ZSBiZWZvcmUgZXZlcnl0aGluZyBlbHNlIGJlY2F1c2UgaXQgY291bGQgYmUgdXNlZFxyXG4gKiB0byBhZGQgbWFyZ2lucyB0byB0aGUgcG9wcGVyIG1hcmdpbnMgbmVlZHMgdG8gYmUgY2FsY3VsYXRlZCB0byBnZXQgdGhlXHJcbiAqIGNvcnJlY3QgcG9wcGVyIG9mZnNldHMuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5tb2RpZmllcnNcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcmVmZXJlbmNlIC0gVGhlIHJlZmVyZW5jZSBlbGVtZW50IHVzZWQgdG8gcG9zaXRpb24gdGhlIHBvcHBlclxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3BwZXIgLSBUaGUgSFRNTCBlbGVtZW50IHVzZWQgYXMgcG9wcGVyXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gUG9wcGVyLmpzIG9wdGlvbnNcclxuICovXHJcbmZ1bmN0aW9uIGFwcGx5U3R5bGVPbkxvYWQocmVmZXJlbmNlLCBwb3BwZXIsIG9wdGlvbnMsIG1vZGlmaWVyT3B0aW9ucywgc3RhdGUpIHtcclxuICAvLyBjb21wdXRlIHJlZmVyZW5jZSBlbGVtZW50IG9mZnNldHNcclxuICB2YXIgcmVmZXJlbmNlT2Zmc2V0cyA9IGdldFJlZmVyZW5jZU9mZnNldHMoc3RhdGUsIHBvcHBlciwgcmVmZXJlbmNlLCBvcHRpb25zLnBvc2l0aW9uRml4ZWQpO1xyXG5cclxuICAvLyBjb21wdXRlIGF1dG8gcGxhY2VtZW50LCBzdG9yZSBwbGFjZW1lbnQgaW5zaWRlIHRoZSBkYXRhIG9iamVjdCxcclxuICAvLyBtb2RpZmllcnMgd2lsbCBiZSBhYmxlIHRvIGVkaXQgYHBsYWNlbWVudGAgaWYgbmVlZGVkXHJcbiAgLy8gYW5kIHJlZmVyIHRvIG9yaWdpbmFsUGxhY2VtZW50IHRvIGtub3cgdGhlIG9yaWdpbmFsIHZhbHVlXHJcbiAgdmFyIHBsYWNlbWVudCA9IGNvbXB1dGVBdXRvUGxhY2VtZW50KG9wdGlvbnMucGxhY2VtZW50LCByZWZlcmVuY2VPZmZzZXRzLCBwb3BwZXIsIHJlZmVyZW5jZSwgb3B0aW9ucy5tb2RpZmllcnMuZmxpcC5ib3VuZGFyaWVzRWxlbWVudCwgb3B0aW9ucy5tb2RpZmllcnMuZmxpcC5wYWRkaW5nKTtcclxuXHJcbiAgcG9wcGVyLnNldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnLCBwbGFjZW1lbnQpO1xyXG5cclxuICAvLyBBcHBseSBgcG9zaXRpb25gIHRvIHBvcHBlciBiZWZvcmUgYW55dGhpbmcgZWxzZSBiZWNhdXNlXHJcbiAgLy8gd2l0aG91dCB0aGUgcG9zaXRpb24gYXBwbGllZCB3ZSBjYW4ndCBndWFyYW50ZWUgY29ycmVjdCBjb21wdXRhdGlvbnNcclxuICBzZXRTdHlsZXMocG9wcGVyLCB7IHBvc2l0aW9uOiBvcHRpb25zLnBvc2l0aW9uRml4ZWQgPyAnZml4ZWQnIDogJ2Fic29sdXRlJyB9KTtcclxuXHJcbiAgcmV0dXJuIG9wdGlvbnM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gY29tcHV0ZVN0eWxlKGRhdGEsIG9wdGlvbnMpIHtcclxuICB2YXIgeCA9IG9wdGlvbnMueCxcclxuICAgICAgeSA9IG9wdGlvbnMueTtcclxuICB2YXIgcG9wcGVyID0gZGF0YS5vZmZzZXRzLnBvcHBlcjtcclxuXHJcbiAgLy8gUmVtb3ZlIHRoaXMgbGVnYWN5IHN1cHBvcnQgaW4gUG9wcGVyLmpzIHYyXHJcblxyXG4gIHZhciBsZWdhY3lHcHVBY2NlbGVyYXRpb25PcHRpb24gPSBmaW5kKGRhdGEuaW5zdGFuY2UubW9kaWZpZXJzLCBmdW5jdGlvbiAobW9kaWZpZXIpIHtcclxuICAgIHJldHVybiBtb2RpZmllci5uYW1lID09PSAnYXBwbHlTdHlsZSc7XHJcbiAgfSkuZ3B1QWNjZWxlcmF0aW9uO1xyXG4gIGlmIChsZWdhY3lHcHVBY2NlbGVyYXRpb25PcHRpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiBgZ3B1QWNjZWxlcmF0aW9uYCBvcHRpb24gbW92ZWQgdG8gYGNvbXB1dGVTdHlsZWAgbW9kaWZpZXIgYW5kIHdpbGwgbm90IGJlIHN1cHBvcnRlZCBpbiBmdXR1cmUgdmVyc2lvbnMgb2YgUG9wcGVyLmpzIScpO1xyXG4gIH1cclxuICB2YXIgZ3B1QWNjZWxlcmF0aW9uID0gbGVnYWN5R3B1QWNjZWxlcmF0aW9uT3B0aW9uICE9PSB1bmRlZmluZWQgPyBsZWdhY3lHcHVBY2NlbGVyYXRpb25PcHRpb24gOiBvcHRpb25zLmdwdUFjY2VsZXJhdGlvbjtcclxuXHJcbiAgdmFyIG9mZnNldFBhcmVudCA9IGdldE9mZnNldFBhcmVudChkYXRhLmluc3RhbmNlLnBvcHBlcik7XHJcbiAgdmFyIG9mZnNldFBhcmVudFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3Qob2Zmc2V0UGFyZW50KTtcclxuXHJcbiAgLy8gU3R5bGVzXHJcbiAgdmFyIHN0eWxlcyA9IHtcclxuICAgIHBvc2l0aW9uOiBwb3BwZXIucG9zaXRpb25cclxuICB9O1xyXG5cclxuICAvLyBBdm9pZCBibHVycnkgdGV4dCBieSB1c2luZyBmdWxsIHBpeGVsIGludGVnZXJzLlxyXG4gIC8vIEZvciBwaXhlbC1wZXJmZWN0IHBvc2l0aW9uaW5nLCB0b3AvYm90dG9tIHByZWZlcnMgcm91bmRlZFxyXG4gIC8vIHZhbHVlcywgd2hpbGUgbGVmdC9yaWdodCBwcmVmZXJzIGZsb29yZWQgdmFsdWVzLlxyXG4gIHZhciBvZmZzZXRzID0ge1xyXG4gICAgbGVmdDogTWF0aC5mbG9vcihwb3BwZXIubGVmdCksXHJcbiAgICB0b3A6IE1hdGgucm91bmQocG9wcGVyLnRvcCksXHJcbiAgICBib3R0b206IE1hdGgucm91bmQocG9wcGVyLmJvdHRvbSksXHJcbiAgICByaWdodDogTWF0aC5mbG9vcihwb3BwZXIucmlnaHQpXHJcbiAgfTtcclxuXHJcbiAgdmFyIHNpZGVBID0geCA9PT0gJ2JvdHRvbScgPyAndG9wJyA6ICdib3R0b20nO1xyXG4gIHZhciBzaWRlQiA9IHkgPT09ICdyaWdodCcgPyAnbGVmdCcgOiAncmlnaHQnO1xyXG5cclxuICAvLyBpZiBncHVBY2NlbGVyYXRpb24gaXMgc2V0IHRvIGB0cnVlYCBhbmQgdHJhbnNmb3JtIGlzIHN1cHBvcnRlZCxcclxuICAvLyAgd2UgdXNlIGB0cmFuc2xhdGUzZGAgdG8gYXBwbHkgdGhlIHBvc2l0aW9uIHRvIHRoZSBwb3BwZXIgd2VcclxuICAvLyBhdXRvbWF0aWNhbGx5IHVzZSB0aGUgc3VwcG9ydGVkIHByZWZpeGVkIHZlcnNpb24gaWYgbmVlZGVkXHJcbiAgdmFyIHByZWZpeGVkUHJvcGVydHkgPSBnZXRTdXBwb3J0ZWRQcm9wZXJ0eU5hbWUoJ3RyYW5zZm9ybScpO1xyXG5cclxuICAvLyBub3csIGxldCdzIG1ha2UgYSBzdGVwIGJhY2sgYW5kIGxvb2sgYXQgdGhpcyBjb2RlIGNsb3NlbHkgKHd0Zj8pXHJcbiAgLy8gSWYgdGhlIGNvbnRlbnQgb2YgdGhlIHBvcHBlciBncm93cyBvbmNlIGl0J3MgYmVlbiBwb3NpdGlvbmVkLCBpdFxyXG4gIC8vIG1heSBoYXBwZW4gdGhhdCB0aGUgcG9wcGVyIGdldHMgbWlzcGxhY2VkIGJlY2F1c2Ugb2YgdGhlIG5ldyBjb250ZW50XHJcbiAgLy8gb3ZlcmZsb3dpbmcgaXRzIHJlZmVyZW5jZSBlbGVtZW50XHJcbiAgLy8gVG8gYXZvaWQgdGhpcyBwcm9ibGVtLCB3ZSBwcm92aWRlIHR3byBvcHRpb25zICh4IGFuZCB5KSwgd2hpY2ggYWxsb3dcclxuICAvLyB0aGUgY29uc3VtZXIgdG8gZGVmaW5lIHRoZSBvZmZzZXQgb3JpZ2luLlxyXG4gIC8vIElmIHdlIHBvc2l0aW9uIGEgcG9wcGVyIG9uIHRvcCBvZiBhIHJlZmVyZW5jZSBlbGVtZW50LCB3ZSBjYW4gc2V0XHJcbiAgLy8gYHhgIHRvIGB0b3BgIHRvIG1ha2UgdGhlIHBvcHBlciBncm93IHRvd2FyZHMgaXRzIHRvcCBpbnN0ZWFkIG9mXHJcbiAgLy8gaXRzIGJvdHRvbS5cclxuICB2YXIgbGVmdCA9IHZvaWQgMCxcclxuICAgICAgdG9wID0gdm9pZCAwO1xyXG4gIGlmIChzaWRlQSA9PT0gJ2JvdHRvbScpIHtcclxuICAgIHRvcCA9IC1vZmZzZXRQYXJlbnRSZWN0LmhlaWdodCArIG9mZnNldHMuYm90dG9tO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0b3AgPSBvZmZzZXRzLnRvcDtcclxuICB9XHJcbiAgaWYgKHNpZGVCID09PSAncmlnaHQnKSB7XHJcbiAgICBsZWZ0ID0gLW9mZnNldFBhcmVudFJlY3Qud2lkdGggKyBvZmZzZXRzLnJpZ2h0O1xyXG4gIH0gZWxzZSB7XHJcbiAgICBsZWZ0ID0gb2Zmc2V0cy5sZWZ0O1xyXG4gIH1cclxuICBpZiAoZ3B1QWNjZWxlcmF0aW9uICYmIHByZWZpeGVkUHJvcGVydHkpIHtcclxuICAgIHN0eWxlc1twcmVmaXhlZFByb3BlcnR5XSA9ICd0cmFuc2xhdGUzZCgnICsgbGVmdCArICdweCwgJyArIHRvcCArICdweCwgMCknO1xyXG4gICAgc3R5bGVzW3NpZGVBXSA9IDA7XHJcbiAgICBzdHlsZXNbc2lkZUJdID0gMDtcclxuICAgIHN0eWxlcy53aWxsQ2hhbmdlID0gJ3RyYW5zZm9ybSc7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIG90aHdlcmlzZSwgd2UgdXNlIHRoZSBzdGFuZGFyZCBgdG9wYCwgYGxlZnRgLCBgYm90dG9tYCBhbmQgYHJpZ2h0YCBwcm9wZXJ0aWVzXHJcbiAgICB2YXIgaW52ZXJ0VG9wID0gc2lkZUEgPT09ICdib3R0b20nID8gLTEgOiAxO1xyXG4gICAgdmFyIGludmVydExlZnQgPSBzaWRlQiA9PT0gJ3JpZ2h0JyA/IC0xIDogMTtcclxuICAgIHN0eWxlc1tzaWRlQV0gPSB0b3AgKiBpbnZlcnRUb3A7XHJcbiAgICBzdHlsZXNbc2lkZUJdID0gbGVmdCAqIGludmVydExlZnQ7XHJcbiAgICBzdHlsZXMud2lsbENoYW5nZSA9IHNpZGVBICsgJywgJyArIHNpZGVCO1xyXG4gIH1cclxuXHJcbiAgLy8gQXR0cmlidXRlc1xyXG4gIHZhciBhdHRyaWJ1dGVzID0ge1xyXG4gICAgJ3gtcGxhY2VtZW50JzogZGF0YS5wbGFjZW1lbnRcclxuICB9O1xyXG5cclxuICAvLyBVcGRhdGUgYGRhdGFgIGF0dHJpYnV0ZXMsIHN0eWxlcyBhbmQgYXJyb3dTdHlsZXNcclxuICBkYXRhLmF0dHJpYnV0ZXMgPSBfZXh0ZW5kcyQxKHt9LCBhdHRyaWJ1dGVzLCBkYXRhLmF0dHJpYnV0ZXMpO1xyXG4gIGRhdGEuc3R5bGVzID0gX2V4dGVuZHMkMSh7fSwgc3R5bGVzLCBkYXRhLnN0eWxlcyk7XHJcbiAgZGF0YS5hcnJvd1N0eWxlcyA9IF9leHRlbmRzJDEoe30sIGRhdGEub2Zmc2V0cy5hcnJvdywgZGF0YS5hcnJvd1N0eWxlcyk7XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogSGVscGVyIHVzZWQgdG8ga25vdyBpZiB0aGUgZ2l2ZW4gbW9kaWZpZXIgZGVwZW5kcyBmcm9tIGFub3RoZXIgb25lLjxiciAvPlxyXG4gKiBJdCBjaGVja3MgaWYgdGhlIG5lZWRlZCBtb2RpZmllciBpcyBsaXN0ZWQgYW5kIGVuYWJsZWQuXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAcGFyYW0ge0FycmF5fSBtb2RpZmllcnMgLSBsaXN0IG9mIG1vZGlmaWVyc1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdGluZ05hbWUgLSBuYW1lIG9mIHJlcXVlc3RpbmcgbW9kaWZpZXJcclxuICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RlZE5hbWUgLSBuYW1lIG9mIHJlcXVlc3RlZCBtb2RpZmllclxyXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIGlzTW9kaWZpZXJSZXF1aXJlZChtb2RpZmllcnMsIHJlcXVlc3RpbmdOYW1lLCByZXF1ZXN0ZWROYW1lKSB7XHJcbiAgdmFyIHJlcXVlc3RpbmcgPSBmaW5kKG1vZGlmaWVycywgZnVuY3Rpb24gKF9yZWYpIHtcclxuICAgIHZhciBuYW1lID0gX3JlZi5uYW1lO1xyXG4gICAgcmV0dXJuIG5hbWUgPT09IHJlcXVlc3RpbmdOYW1lO1xyXG4gIH0pO1xyXG5cclxuICB2YXIgaXNSZXF1aXJlZCA9ICEhcmVxdWVzdGluZyAmJiBtb2RpZmllcnMuc29tZShmdW5jdGlvbiAobW9kaWZpZXIpIHtcclxuICAgIHJldHVybiBtb2RpZmllci5uYW1lID09PSByZXF1ZXN0ZWROYW1lICYmIG1vZGlmaWVyLmVuYWJsZWQgJiYgbW9kaWZpZXIub3JkZXIgPCByZXF1ZXN0aW5nLm9yZGVyO1xyXG4gIH0pO1xyXG5cclxuICBpZiAoIWlzUmVxdWlyZWQpIHtcclxuICAgIHZhciBfcmVxdWVzdGluZyA9ICdgJyArIHJlcXVlc3RpbmdOYW1lICsgJ2AnO1xyXG4gICAgdmFyIHJlcXVlc3RlZCA9ICdgJyArIHJlcXVlc3RlZE5hbWUgKyAnYCc7XHJcbiAgICBjb25zb2xlLndhcm4ocmVxdWVzdGVkICsgJyBtb2RpZmllciBpcyByZXF1aXJlZCBieSAnICsgX3JlcXVlc3RpbmcgKyAnIG1vZGlmaWVyIGluIG9yZGVyIHRvIHdvcmssIGJlIHN1cmUgdG8gaW5jbHVkZSBpdCBiZWZvcmUgJyArIF9yZXF1ZXN0aW5nICsgJyEnKTtcclxuICB9XHJcbiAgcmV0dXJuIGlzUmVxdWlyZWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIGFycm93KGRhdGEsIG9wdGlvbnMpIHtcclxuICB2YXIgX2RhdGEkb2Zmc2V0cyRhcnJvdztcclxuXHJcbiAgLy8gYXJyb3cgZGVwZW5kcyBvbiBrZWVwVG9nZXRoZXIgaW4gb3JkZXIgdG8gd29ya1xyXG4gIGlmICghaXNNb2RpZmllclJlcXVpcmVkKGRhdGEuaW5zdGFuY2UubW9kaWZpZXJzLCAnYXJyb3cnLCAna2VlcFRvZ2V0aGVyJykpIHtcclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgdmFyIGFycm93RWxlbWVudCA9IG9wdGlvbnMuZWxlbWVudDtcclxuXHJcbiAgLy8gaWYgYXJyb3dFbGVtZW50IGlzIGEgc3RyaW5nLCBzdXBwb3NlIGl0J3MgYSBDU1Mgc2VsZWN0b3JcclxuICBpZiAodHlwZW9mIGFycm93RWxlbWVudCA9PT0gJ3N0cmluZycpIHtcclxuICAgIGFycm93RWxlbWVudCA9IGRhdGEuaW5zdGFuY2UucG9wcGVyLnF1ZXJ5U2VsZWN0b3IoYXJyb3dFbGVtZW50KTtcclxuXHJcbiAgICAvLyBpZiBhcnJvd0VsZW1lbnQgaXMgbm90IGZvdW5kLCBkb24ndCBydW4gdGhlIG1vZGlmaWVyXHJcbiAgICBpZiAoIWFycm93RWxlbWVudCkge1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgLy8gaWYgdGhlIGFycm93RWxlbWVudCBpc24ndCBhIHF1ZXJ5IHNlbGVjdG9yIHdlIG11c3QgY2hlY2sgdGhhdCB0aGVcclxuICAgIC8vIHByb3ZpZGVkIERPTSBub2RlIGlzIGNoaWxkIG9mIGl0cyBwb3BwZXIgbm9kZVxyXG4gICAgaWYgKCFkYXRhLmluc3RhbmNlLnBvcHBlci5jb250YWlucyhhcnJvd0VsZW1lbnQpKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignV0FSTklORzogYGFycm93LmVsZW1lbnRgIG11c3QgYmUgY2hpbGQgb2YgaXRzIHBvcHBlciBlbGVtZW50IScpO1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xyXG4gIHZhciBfZGF0YSRvZmZzZXRzID0gZGF0YS5vZmZzZXRzLFxyXG4gICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcixcclxuICAgICAgcmVmZXJlbmNlID0gX2RhdGEkb2Zmc2V0cy5yZWZlcmVuY2U7XHJcblxyXG4gIHZhciBpc1ZlcnRpY2FsID0gWydsZWZ0JywgJ3JpZ2h0J10uaW5kZXhPZihwbGFjZW1lbnQpICE9PSAtMTtcclxuXHJcbiAgdmFyIGxlbiA9IGlzVmVydGljYWwgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XHJcbiAgdmFyIHNpZGVDYXBpdGFsaXplZCA9IGlzVmVydGljYWwgPyAnVG9wJyA6ICdMZWZ0JztcclxuICB2YXIgc2lkZSA9IHNpZGVDYXBpdGFsaXplZC50b0xvd2VyQ2FzZSgpO1xyXG4gIHZhciBhbHRTaWRlID0gaXNWZXJ0aWNhbCA/ICdsZWZ0JyA6ICd0b3AnO1xyXG4gIHZhciBvcFNpZGUgPSBpc1ZlcnRpY2FsID8gJ2JvdHRvbScgOiAncmlnaHQnO1xyXG4gIHZhciBhcnJvd0VsZW1lbnRTaXplID0gZ2V0T3V0ZXJTaXplcyhhcnJvd0VsZW1lbnQpW2xlbl07XHJcblxyXG4gIC8vXHJcbiAgLy8gZXh0ZW5kcyBrZWVwVG9nZXRoZXIgYmVoYXZpb3IgbWFraW5nIHN1cmUgdGhlIHBvcHBlciBhbmQgaXRzXHJcbiAgLy8gcmVmZXJlbmNlIGhhdmUgZW5vdWdoIHBpeGVscyBpbiBjb25qdWN0aW9uXHJcbiAgLy9cclxuXHJcbiAgLy8gdG9wL2xlZnQgc2lkZVxyXG4gIGlmIChyZWZlcmVuY2Vbb3BTaWRlXSAtIGFycm93RWxlbWVudFNpemUgPCBwb3BwZXJbc2lkZV0pIHtcclxuICAgIGRhdGEub2Zmc2V0cy5wb3BwZXJbc2lkZV0gLT0gcG9wcGVyW3NpZGVdIC0gKHJlZmVyZW5jZVtvcFNpZGVdIC0gYXJyb3dFbGVtZW50U2l6ZSk7XHJcbiAgfVxyXG4gIC8vIGJvdHRvbS9yaWdodCBzaWRlXHJcbiAgaWYgKHJlZmVyZW5jZVtzaWRlXSArIGFycm93RWxlbWVudFNpemUgPiBwb3BwZXJbb3BTaWRlXSkge1xyXG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlcltzaWRlXSArPSByZWZlcmVuY2Vbc2lkZV0gKyBhcnJvd0VsZW1lbnRTaXplIC0gcG9wcGVyW29wU2lkZV07XHJcbiAgfVxyXG4gIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBnZXRDbGllbnRSZWN0KGRhdGEub2Zmc2V0cy5wb3BwZXIpO1xyXG5cclxuICAvLyBjb21wdXRlIGNlbnRlciBvZiB0aGUgcG9wcGVyXHJcbiAgdmFyIGNlbnRlciA9IHJlZmVyZW5jZVtzaWRlXSArIHJlZmVyZW5jZVtsZW5dIC8gMiAtIGFycm93RWxlbWVudFNpemUgLyAyO1xyXG5cclxuICAvLyBDb21wdXRlIHRoZSBzaWRlVmFsdWUgdXNpbmcgdGhlIHVwZGF0ZWQgcG9wcGVyIG9mZnNldHNcclxuICAvLyB0YWtlIHBvcHBlciBtYXJnaW4gaW4gYWNjb3VudCBiZWNhdXNlIHdlIGRvbid0IGhhdmUgdGhpcyBpbmZvIGF2YWlsYWJsZVxyXG4gIHZhciBjc3MgPSBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZGF0YS5pbnN0YW5jZS5wb3BwZXIpO1xyXG4gIHZhciBwb3BwZXJNYXJnaW5TaWRlID0gcGFyc2VGbG9hdChjc3NbJ21hcmdpbicgKyBzaWRlQ2FwaXRhbGl6ZWRdLCAxMCk7XHJcbiAgdmFyIHBvcHBlckJvcmRlclNpZGUgPSBwYXJzZUZsb2F0KGNzc1snYm9yZGVyJyArIHNpZGVDYXBpdGFsaXplZCArICdXaWR0aCddLCAxMCk7XHJcbiAgdmFyIHNpZGVWYWx1ZSA9IGNlbnRlciAtIGRhdGEub2Zmc2V0cy5wb3BwZXJbc2lkZV0gLSBwb3BwZXJNYXJnaW5TaWRlIC0gcG9wcGVyQm9yZGVyU2lkZTtcclxuXHJcbiAgLy8gcHJldmVudCBhcnJvd0VsZW1lbnQgZnJvbSBiZWluZyBwbGFjZWQgbm90IGNvbnRpZ3VvdXNseSB0byBpdHMgcG9wcGVyXHJcbiAgc2lkZVZhbHVlID0gTWF0aC5tYXgoTWF0aC5taW4ocG9wcGVyW2xlbl0gLSBhcnJvd0VsZW1lbnRTaXplLCBzaWRlVmFsdWUpLCAwKTtcclxuXHJcbiAgZGF0YS5hcnJvd0VsZW1lbnQgPSBhcnJvd0VsZW1lbnQ7XHJcbiAgZGF0YS5vZmZzZXRzLmFycm93ID0gKF9kYXRhJG9mZnNldHMkYXJyb3cgPSB7fSwgZGVmaW5lUHJvcGVydHkkMShfZGF0YSRvZmZzZXRzJGFycm93LCBzaWRlLCBNYXRoLnJvdW5kKHNpZGVWYWx1ZSkpLCBkZWZpbmVQcm9wZXJ0eSQxKF9kYXRhJG9mZnNldHMkYXJyb3csIGFsdFNpZGUsICcnKSwgX2RhdGEkb2Zmc2V0cyRhcnJvdyk7XHJcblxyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IHRoZSBvcHBvc2l0ZSBwbGFjZW1lbnQgdmFyaWF0aW9uIG9mIHRoZSBnaXZlbiBvbmVcclxuICogQG1ldGhvZFxyXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwbGFjZW1lbnQgdmFyaWF0aW9uXHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IGZsaXBwZWQgcGxhY2VtZW50IHZhcmlhdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0T3Bwb3NpdGVWYXJpYXRpb24odmFyaWF0aW9uKSB7XHJcbiAgaWYgKHZhcmlhdGlvbiA9PT0gJ2VuZCcpIHtcclxuICAgIHJldHVybiAnc3RhcnQnO1xyXG4gIH0gZWxzZSBpZiAodmFyaWF0aW9uID09PSAnc3RhcnQnKSB7XHJcbiAgICByZXR1cm4gJ2VuZCc7XHJcbiAgfVxyXG4gIHJldHVybiB2YXJpYXRpb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBMaXN0IG9mIGFjY2VwdGVkIHBsYWNlbWVudHMgdG8gdXNlIGFzIHZhbHVlcyBvZiB0aGUgYHBsYWNlbWVudGAgb3B0aW9uLjxiciAvPlxyXG4gKiBWYWxpZCBwbGFjZW1lbnRzIGFyZTpcclxuICogLSBgYXV0b2BcclxuICogLSBgdG9wYFxyXG4gKiAtIGByaWdodGBcclxuICogLSBgYm90dG9tYFxyXG4gKiAtIGBsZWZ0YFxyXG4gKlxyXG4gKiBFYWNoIHBsYWNlbWVudCBjYW4gaGF2ZSBhIHZhcmlhdGlvbiBmcm9tIHRoaXMgbGlzdDpcclxuICogLSBgLXN0YXJ0YFxyXG4gKiAtIGAtZW5kYFxyXG4gKlxyXG4gKiBWYXJpYXRpb25zIGFyZSBpbnRlcnByZXRlZCBlYXNpbHkgaWYgeW91IHRoaW5rIG9mIHRoZW0gYXMgdGhlIGxlZnQgdG8gcmlnaHRcclxuICogd3JpdHRlbiBsYW5ndWFnZXMuIEhvcml6b250YWxseSAoYHRvcGAgYW5kIGBib3R0b21gKSwgYHN0YXJ0YCBpcyBsZWZ0IGFuZCBgZW5kYFxyXG4gKiBpcyByaWdodC48YnIgLz5cclxuICogVmVydGljYWxseSAoYGxlZnRgIGFuZCBgcmlnaHRgKSwgYHN0YXJ0YCBpcyB0b3AgYW5kIGBlbmRgIGlzIGJvdHRvbS5cclxuICpcclxuICogU29tZSB2YWxpZCBleGFtcGxlcyBhcmU6XHJcbiAqIC0gYHRvcC1lbmRgIChvbiB0b3Agb2YgcmVmZXJlbmNlLCByaWdodCBhbGlnbmVkKVxyXG4gKiAtIGByaWdodC1zdGFydGAgKG9uIHJpZ2h0IG9mIHJlZmVyZW5jZSwgdG9wIGFsaWduZWQpXHJcbiAqIC0gYGJvdHRvbWAgKG9uIGJvdHRvbSwgY2VudGVyZWQpXHJcbiAqIC0gYGF1dG8tcmlnaHRgIChvbiB0aGUgc2lkZSB3aXRoIG1vcmUgc3BhY2UgYXZhaWxhYmxlLCBhbGlnbm1lbnQgZGVwZW5kcyBieSBwbGFjZW1lbnQpXHJcbiAqXHJcbiAqIEBzdGF0aWNcclxuICogQHR5cGUge0FycmF5fVxyXG4gKiBAZW51bSB7U3RyaW5nfVxyXG4gKiBAcmVhZG9ubHlcclxuICogQG1ldGhvZCBwbGFjZW1lbnRzXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICovXHJcbnZhciBwbGFjZW1lbnRzID0gWydhdXRvLXN0YXJ0JywgJ2F1dG8nLCAnYXV0by1lbmQnLCAndG9wLXN0YXJ0JywgJ3RvcCcsICd0b3AtZW5kJywgJ3JpZ2h0LXN0YXJ0JywgJ3JpZ2h0JywgJ3JpZ2h0LWVuZCcsICdib3R0b20tZW5kJywgJ2JvdHRvbScsICdib3R0b20tc3RhcnQnLCAnbGVmdC1lbmQnLCAnbGVmdCcsICdsZWZ0LXN0YXJ0J107XHJcblxyXG4vLyBHZXQgcmlkIG9mIGBhdXRvYCBgYXV0by1zdGFydGAgYW5kIGBhdXRvLWVuZGBcclxudmFyIHZhbGlkUGxhY2VtZW50cyA9IHBsYWNlbWVudHMuc2xpY2UoMyk7XHJcblxyXG4vKipcclxuICogR2l2ZW4gYW4gaW5pdGlhbCBwbGFjZW1lbnQsIHJldHVybnMgYWxsIHRoZSBzdWJzZXF1ZW50IHBsYWNlbWVudHNcclxuICogY2xvY2t3aXNlIChvciBjb3VudGVyLWNsb2Nrd2lzZSkuXHJcbiAqXHJcbiAqIEBtZXRob2RcclxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xyXG4gKiBAYXJndW1lbnQge1N0cmluZ30gcGxhY2VtZW50IC0gQSB2YWxpZCBwbGFjZW1lbnQgKGl0IGFjY2VwdHMgdmFyaWF0aW9ucylcclxuICogQGFyZ3VtZW50IHtCb29sZWFufSBjb3VudGVyIC0gU2V0IHRvIHRydWUgdG8gd2FsayB0aGUgcGxhY2VtZW50cyBjb3VudGVyY2xvY2t3aXNlXHJcbiAqIEByZXR1cm5zIHtBcnJheX0gcGxhY2VtZW50cyBpbmNsdWRpbmcgdGhlaXIgdmFyaWF0aW9uc1xyXG4gKi9cclxuZnVuY3Rpb24gY2xvY2t3aXNlKHBsYWNlbWVudCkge1xyXG4gIHZhciBjb3VudGVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcclxuXHJcbiAgdmFyIGluZGV4ID0gdmFsaWRQbGFjZW1lbnRzLmluZGV4T2YocGxhY2VtZW50KTtcclxuICB2YXIgYXJyID0gdmFsaWRQbGFjZW1lbnRzLnNsaWNlKGluZGV4ICsgMSkuY29uY2F0KHZhbGlkUGxhY2VtZW50cy5zbGljZSgwLCBpbmRleCkpO1xyXG4gIHJldHVybiBjb3VudGVyID8gYXJyLnJldmVyc2UoKSA6IGFycjtcclxufVxyXG5cclxudmFyIEJFSEFWSU9SUyA9IHtcclxuICBGTElQOiAnZmxpcCcsXHJcbiAgQ0xPQ0tXSVNFOiAnY2xvY2t3aXNlJyxcclxuICBDT1VOVEVSQ0xPQ0tXSVNFOiAnY291bnRlcmNsb2Nrd2lzZSdcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIGZsaXAoZGF0YSwgb3B0aW9ucykge1xyXG4gIC8vIGlmIGBpbm5lcmAgbW9kaWZpZXIgaXMgZW5hYmxlZCwgd2UgY2FuJ3QgdXNlIHRoZSBgZmxpcGAgbW9kaWZpZXJcclxuICBpZiAoaXNNb2RpZmllckVuYWJsZWQoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsICdpbm5lcicpKSB7XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIGlmIChkYXRhLmZsaXBwZWQgJiYgZGF0YS5wbGFjZW1lbnQgPT09IGRhdGEub3JpZ2luYWxQbGFjZW1lbnQpIHtcclxuICAgIC8vIHNlZW1zIGxpa2UgZmxpcCBpcyB0cnlpbmcgdG8gbG9vcCwgcHJvYmFibHkgdGhlcmUncyBub3QgZW5vdWdoIHNwYWNlIG9uIGFueSBvZiB0aGUgZmxpcHBhYmxlIHNpZGVzXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHZhciBib3VuZGFyaWVzID0gZ2V0Qm91bmRhcmllcyhkYXRhLmluc3RhbmNlLnBvcHBlciwgZGF0YS5pbnN0YW5jZS5yZWZlcmVuY2UsIG9wdGlvbnMucGFkZGluZywgb3B0aW9ucy5ib3VuZGFyaWVzRWxlbWVudCwgZGF0YS5wb3NpdGlvbkZpeGVkKTtcclxuXHJcbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcbiAgdmFyIHBsYWNlbWVudE9wcG9zaXRlID0gZ2V0T3Bwb3NpdGVQbGFjZW1lbnQocGxhY2VtZW50KTtcclxuICB2YXIgdmFyaWF0aW9uID0gZGF0YS5wbGFjZW1lbnQuc3BsaXQoJy0nKVsxXSB8fCAnJztcclxuXHJcbiAgdmFyIGZsaXBPcmRlciA9IFtdO1xyXG5cclxuICBzd2l0Y2ggKG9wdGlvbnMuYmVoYXZpb3IpIHtcclxuICAgIGNhc2UgQkVIQVZJT1JTLkZMSVA6XHJcbiAgICAgIGZsaXBPcmRlciA9IFtwbGFjZW1lbnQsIHBsYWNlbWVudE9wcG9zaXRlXTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIEJFSEFWSU9SUy5DTE9DS1dJU0U6XHJcbiAgICAgIGZsaXBPcmRlciA9IGNsb2Nrd2lzZShwbGFjZW1lbnQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgQkVIQVZJT1JTLkNPVU5URVJDTE9DS1dJU0U6XHJcbiAgICAgIGZsaXBPcmRlciA9IGNsb2Nrd2lzZShwbGFjZW1lbnQsIHRydWUpO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGZsaXBPcmRlciA9IG9wdGlvbnMuYmVoYXZpb3I7XHJcbiAgfVxyXG5cclxuICBmbGlwT3JkZXIuZm9yRWFjaChmdW5jdGlvbiAoc3RlcCwgaW5kZXgpIHtcclxuICAgIGlmIChwbGFjZW1lbnQgIT09IHN0ZXAgfHwgZmxpcE9yZGVyLmxlbmd0aCA9PT0gaW5kZXggKyAxKSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcbiAgICBwbGFjZW1lbnRPcHBvc2l0ZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XHJcblxyXG4gICAgdmFyIHBvcHBlck9mZnNldHMgPSBkYXRhLm9mZnNldHMucG9wcGVyO1xyXG4gICAgdmFyIHJlZk9mZnNldHMgPSBkYXRhLm9mZnNldHMucmVmZXJlbmNlO1xyXG5cclxuICAgIC8vIHVzaW5nIGZsb29yIGJlY2F1c2UgdGhlIHJlZmVyZW5jZSBvZmZzZXRzIG1heSBjb250YWluIGRlY2ltYWxzIHdlIGFyZSBub3QgZ29pbmcgdG8gY29uc2lkZXIgaGVyZVxyXG4gICAgdmFyIGZsb29yID0gTWF0aC5mbG9vcjtcclxuICAgIHZhciBvdmVybGFwc1JlZiA9IHBsYWNlbWVudCA9PT0gJ2xlZnQnICYmIGZsb29yKHBvcHBlck9mZnNldHMucmlnaHQpID4gZmxvb3IocmVmT2Zmc2V0cy5sZWZ0KSB8fCBwbGFjZW1lbnQgPT09ICdyaWdodCcgJiYgZmxvb3IocG9wcGVyT2Zmc2V0cy5sZWZ0KSA8IGZsb29yKHJlZk9mZnNldHMucmlnaHQpIHx8IHBsYWNlbWVudCA9PT0gJ3RvcCcgJiYgZmxvb3IocG9wcGVyT2Zmc2V0cy5ib3R0b20pID4gZmxvb3IocmVmT2Zmc2V0cy50b3ApIHx8IHBsYWNlbWVudCA9PT0gJ2JvdHRvbScgJiYgZmxvb3IocG9wcGVyT2Zmc2V0cy50b3ApIDwgZmxvb3IocmVmT2Zmc2V0cy5ib3R0b20pO1xyXG5cclxuICAgIHZhciBvdmVyZmxvd3NMZWZ0ID0gZmxvb3IocG9wcGVyT2Zmc2V0cy5sZWZ0KSA8IGZsb29yKGJvdW5kYXJpZXMubGVmdCk7XHJcbiAgICB2YXIgb3ZlcmZsb3dzUmlnaHQgPSBmbG9vcihwb3BwZXJPZmZzZXRzLnJpZ2h0KSA+IGZsb29yKGJvdW5kYXJpZXMucmlnaHQpO1xyXG4gICAgdmFyIG92ZXJmbG93c1RvcCA9IGZsb29yKHBvcHBlck9mZnNldHMudG9wKSA8IGZsb29yKGJvdW5kYXJpZXMudG9wKTtcclxuICAgIHZhciBvdmVyZmxvd3NCb3R0b20gPSBmbG9vcihwb3BwZXJPZmZzZXRzLmJvdHRvbSkgPiBmbG9vcihib3VuZGFyaWVzLmJvdHRvbSk7XHJcblxyXG4gICAgdmFyIG92ZXJmbG93c0JvdW5kYXJpZXMgPSBwbGFjZW1lbnQgPT09ICdsZWZ0JyAmJiBvdmVyZmxvd3NMZWZ0IHx8IHBsYWNlbWVudCA9PT0gJ3JpZ2h0JyAmJiBvdmVyZmxvd3NSaWdodCB8fCBwbGFjZW1lbnQgPT09ICd0b3AnICYmIG92ZXJmbG93c1RvcCB8fCBwbGFjZW1lbnQgPT09ICdib3R0b20nICYmIG92ZXJmbG93c0JvdHRvbTtcclxuXHJcbiAgICAvLyBmbGlwIHRoZSB2YXJpYXRpb24gaWYgcmVxdWlyZWRcclxuICAgIHZhciBpc1ZlcnRpY2FsID0gWyd0b3AnLCAnYm90dG9tJ10uaW5kZXhPZihwbGFjZW1lbnQpICE9PSAtMTtcclxuICAgIHZhciBmbGlwcGVkVmFyaWF0aW9uID0gISFvcHRpb25zLmZsaXBWYXJpYXRpb25zICYmIChpc1ZlcnRpY2FsICYmIHZhcmlhdGlvbiA9PT0gJ3N0YXJ0JyAmJiBvdmVyZmxvd3NMZWZ0IHx8IGlzVmVydGljYWwgJiYgdmFyaWF0aW9uID09PSAnZW5kJyAmJiBvdmVyZmxvd3NSaWdodCB8fCAhaXNWZXJ0aWNhbCAmJiB2YXJpYXRpb24gPT09ICdzdGFydCcgJiYgb3ZlcmZsb3dzVG9wIHx8ICFpc1ZlcnRpY2FsICYmIHZhcmlhdGlvbiA9PT0gJ2VuZCcgJiYgb3ZlcmZsb3dzQm90dG9tKTtcclxuXHJcbiAgICBpZiAob3ZlcmxhcHNSZWYgfHwgb3ZlcmZsb3dzQm91bmRhcmllcyB8fCBmbGlwcGVkVmFyaWF0aW9uKSB7XHJcbiAgICAgIC8vIHRoaXMgYm9vbGVhbiB0byBkZXRlY3QgYW55IGZsaXAgbG9vcFxyXG4gICAgICBkYXRhLmZsaXBwZWQgPSB0cnVlO1xyXG5cclxuICAgICAgaWYgKG92ZXJsYXBzUmVmIHx8IG92ZXJmbG93c0JvdW5kYXJpZXMpIHtcclxuICAgICAgICBwbGFjZW1lbnQgPSBmbGlwT3JkZXJbaW5kZXggKyAxXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZsaXBwZWRWYXJpYXRpb24pIHtcclxuICAgICAgICB2YXJpYXRpb24gPSBnZXRPcHBvc2l0ZVZhcmlhdGlvbih2YXJpYXRpb24pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhLnBsYWNlbWVudCA9IHBsYWNlbWVudCArICh2YXJpYXRpb24gPyAnLScgKyB2YXJpYXRpb24gOiAnJyk7XHJcblxyXG4gICAgICAvLyB0aGlzIG9iamVjdCBjb250YWlucyBgcG9zaXRpb25gLCB3ZSB3YW50IHRvIHByZXNlcnZlIGl0IGFsb25nIHdpdGhcclxuICAgICAgLy8gYW55IGFkZGl0aW9uYWwgcHJvcGVydHkgd2UgbWF5IGFkZCBpbiB0aGUgZnV0dXJlXHJcbiAgICAgIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBfZXh0ZW5kcyQxKHt9LCBkYXRhLm9mZnNldHMucG9wcGVyLCBnZXRQb3BwZXJPZmZzZXRzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLm9mZnNldHMucmVmZXJlbmNlLCBkYXRhLnBsYWNlbWVudCkpO1xyXG5cclxuICAgICAgZGF0YSA9IHJ1bk1vZGlmaWVycyhkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgZGF0YSwgJ2ZsaXAnKTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24ga2VlcFRvZ2V0aGVyKGRhdGEpIHtcclxuICB2YXIgX2RhdGEkb2Zmc2V0cyA9IGRhdGEub2Zmc2V0cyxcclxuICAgICAgcG9wcGVyID0gX2RhdGEkb2Zmc2V0cy5wb3BwZXIsXHJcbiAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlO1xyXG5cclxuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcclxuICB2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xyXG4gIHZhciBpc1ZlcnRpY2FsID0gWyd0b3AnLCAnYm90dG9tJ10uaW5kZXhPZihwbGFjZW1lbnQpICE9PSAtMTtcclxuICB2YXIgc2lkZSA9IGlzVmVydGljYWwgPyAncmlnaHQnIDogJ2JvdHRvbSc7XHJcbiAgdmFyIG9wU2lkZSA9IGlzVmVydGljYWwgPyAnbGVmdCcgOiAndG9wJztcclxuICB2YXIgbWVhc3VyZW1lbnQgPSBpc1ZlcnRpY2FsID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xyXG5cclxuICBpZiAocG9wcGVyW3NpZGVdIDwgZmxvb3IocmVmZXJlbmNlW29wU2lkZV0pKSB7XHJcbiAgICBkYXRhLm9mZnNldHMucG9wcGVyW29wU2lkZV0gPSBmbG9vcihyZWZlcmVuY2Vbb3BTaWRlXSkgLSBwb3BwZXJbbWVhc3VyZW1lbnRdO1xyXG4gIH1cclxuICBpZiAocG9wcGVyW29wU2lkZV0gPiBmbG9vcihyZWZlcmVuY2Vbc2lkZV0pKSB7XHJcbiAgICBkYXRhLm9mZnNldHMucG9wcGVyW29wU2lkZV0gPSBmbG9vcihyZWZlcmVuY2Vbc2lkZV0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyBhIHN0cmluZyBjb250YWluaW5nIHZhbHVlICsgdW5pdCBpbnRvIGEgcHggdmFsdWUgbnVtYmVyXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2Yge21vZGlmaWVyc35vZmZzZXR9XHJcbiAqIEBwcml2YXRlXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBzdHIgLSBWYWx1ZSArIHVuaXQgc3RyaW5nXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBtZWFzdXJlbWVudCAtIGBoZWlnaHRgIG9yIGB3aWR0aGBcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IHBvcHBlck9mZnNldHNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IHJlZmVyZW5jZU9mZnNldHNcclxuICogQHJldHVybnMge051bWJlcnxTdHJpbmd9XHJcbiAqIFZhbHVlIGluIHBpeGVscywgb3Igb3JpZ2luYWwgc3RyaW5nIGlmIG5vIHZhbHVlcyB3ZXJlIGV4dHJhY3RlZFxyXG4gKi9cclxuZnVuY3Rpb24gdG9WYWx1ZShzdHIsIG1lYXN1cmVtZW50LCBwb3BwZXJPZmZzZXRzLCByZWZlcmVuY2VPZmZzZXRzKSB7XHJcbiAgLy8gc2VwYXJhdGUgdmFsdWUgZnJvbSB1bml0XHJcbiAgdmFyIHNwbGl0ID0gc3RyLm1hdGNoKC8oKD86XFwtfFxcKyk/XFxkKlxcLj9cXGQqKSguKikvKTtcclxuICB2YXIgdmFsdWUgPSArc3BsaXRbMV07XHJcbiAgdmFyIHVuaXQgPSBzcGxpdFsyXTtcclxuXHJcbiAgLy8gSWYgaXQncyBub3QgYSBudW1iZXIgaXQncyBhbiBvcGVyYXRvciwgSSBndWVzc1xyXG4gIGlmICghdmFsdWUpIHtcclxuICAgIHJldHVybiBzdHI7XHJcbiAgfVxyXG5cclxuICBpZiAodW5pdC5pbmRleE9mKCclJykgPT09IDApIHtcclxuICAgIHZhciBlbGVtZW50ID0gdm9pZCAwO1xyXG4gICAgc3dpdGNoICh1bml0KSB7XHJcbiAgICAgIGNhc2UgJyVwJzpcclxuICAgICAgICBlbGVtZW50ID0gcG9wcGVyT2Zmc2V0cztcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnJSc6XHJcbiAgICAgIGNhc2UgJyVyJzpcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBlbGVtZW50ID0gcmVmZXJlbmNlT2Zmc2V0cztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVjdCA9IGdldENsaWVudFJlY3QoZWxlbWVudCk7XHJcbiAgICByZXR1cm4gcmVjdFttZWFzdXJlbWVudF0gLyAxMDAgKiB2YWx1ZTtcclxuICB9IGVsc2UgaWYgKHVuaXQgPT09ICd2aCcgfHwgdW5pdCA9PT0gJ3Z3Jykge1xyXG4gICAgLy8gaWYgaXMgYSB2aCBvciB2dywgd2UgY2FsY3VsYXRlIHRoZSBzaXplIGJhc2VkIG9uIHRoZSB2aWV3cG9ydFxyXG4gICAgdmFyIHNpemUgPSB2b2lkIDA7XHJcbiAgICBpZiAodW5pdCA9PT0gJ3ZoJykge1xyXG4gICAgICBzaXplID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2l6ZSA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2l6ZSAvIDEwMCAqIHZhbHVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBpZiBpcyBhbiBleHBsaWNpdCBwaXhlbCB1bml0LCB3ZSBnZXQgcmlkIG9mIHRoZSB1bml0IGFuZCBrZWVwIHRoZSB2YWx1ZVxyXG4gICAgLy8gaWYgaXMgYW4gaW1wbGljaXQgdW5pdCwgaXQncyBweCwgYW5kIHdlIHJldHVybiBqdXN0IHRoZSB2YWx1ZVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFBhcnNlIGFuIGBvZmZzZXRgIHN0cmluZyB0byBleHRyYXBvbGF0ZSBgeGAgYW5kIGB5YCBudW1lcmljIG9mZnNldHMuXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2Yge21vZGlmaWVyc35vZmZzZXR9XHJcbiAqIEBwcml2YXRlXHJcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBvZmZzZXRcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IHBvcHBlck9mZnNldHNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IHJlZmVyZW5jZU9mZnNldHNcclxuICogQGFyZ3VtZW50IHtTdHJpbmd9IGJhc2VQbGFjZW1lbnRcclxuICogQHJldHVybnMge0FycmF5fSBhIHR3byBjZWxscyBhcnJheSB3aXRoIHggYW5kIHkgb2Zmc2V0cyBpbiBudW1iZXJzXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZU9mZnNldChvZmZzZXQsIHBvcHBlck9mZnNldHMsIHJlZmVyZW5jZU9mZnNldHMsIGJhc2VQbGFjZW1lbnQpIHtcclxuICB2YXIgb2Zmc2V0cyA9IFswLCAwXTtcclxuXHJcbiAgLy8gVXNlIGhlaWdodCBpZiBwbGFjZW1lbnQgaXMgbGVmdCBvciByaWdodCBhbmQgaW5kZXggaXMgMCBvdGhlcndpc2UgdXNlIHdpZHRoXHJcbiAgLy8gaW4gdGhpcyB3YXkgdGhlIGZpcnN0IG9mZnNldCB3aWxsIHVzZSBhbiBheGlzIGFuZCB0aGUgc2Vjb25kIG9uZVxyXG4gIC8vIHdpbGwgdXNlIHRoZSBvdGhlciBvbmVcclxuICB2YXIgdXNlSGVpZ2h0ID0gWydyaWdodCcsICdsZWZ0J10uaW5kZXhPZihiYXNlUGxhY2VtZW50KSAhPT0gLTE7XHJcblxyXG4gIC8vIFNwbGl0IHRoZSBvZmZzZXQgc3RyaW5nIHRvIG9idGFpbiBhIGxpc3Qgb2YgdmFsdWVzIGFuZCBvcGVyYW5kc1xyXG4gIC8vIFRoZSByZWdleCBhZGRyZXNzZXMgdmFsdWVzIHdpdGggdGhlIHBsdXMgb3IgbWludXMgc2lnbiBpbiBmcm9udCAoKzEwLCAtMjAsIGV0YylcclxuICB2YXIgZnJhZ21lbnRzID0gb2Zmc2V0LnNwbGl0KC8oXFwrfFxcLSkvKS5tYXAoZnVuY3Rpb24gKGZyYWcpIHtcclxuICAgIHJldHVybiBmcmFnLnRyaW0oKTtcclxuICB9KTtcclxuXHJcbiAgLy8gRGV0ZWN0IGlmIHRoZSBvZmZzZXQgc3RyaW5nIGNvbnRhaW5zIGEgcGFpciBvZiB2YWx1ZXMgb3IgYSBzaW5nbGUgb25lXHJcbiAgLy8gdGhleSBjb3VsZCBiZSBzZXBhcmF0ZWQgYnkgY29tbWEgb3Igc3BhY2VcclxuICB2YXIgZGl2aWRlciA9IGZyYWdtZW50cy5pbmRleE9mKGZpbmQoZnJhZ21lbnRzLCBmdW5jdGlvbiAoZnJhZykge1xyXG4gICAgcmV0dXJuIGZyYWcuc2VhcmNoKC8sfFxccy8pICE9PSAtMTtcclxuICB9KSk7XHJcblxyXG4gIGlmIChmcmFnbWVudHNbZGl2aWRlcl0gJiYgZnJhZ21lbnRzW2RpdmlkZXJdLmluZGV4T2YoJywnKSA9PT0gLTEpIHtcclxuICAgIGNvbnNvbGUud2FybignT2Zmc2V0cyBzZXBhcmF0ZWQgYnkgd2hpdGUgc3BhY2UocykgYXJlIGRlcHJlY2F0ZWQsIHVzZSBhIGNvbW1hICgsKSBpbnN0ZWFkLicpO1xyXG4gIH1cclxuXHJcbiAgLy8gSWYgZGl2aWRlciBpcyBmb3VuZCwgd2UgZGl2aWRlIHRoZSBsaXN0IG9mIHZhbHVlcyBhbmQgb3BlcmFuZHMgdG8gZGl2aWRlXHJcbiAgLy8gdGhlbSBieSBvZnNldCBYIGFuZCBZLlxyXG4gIHZhciBzcGxpdFJlZ2V4ID0gL1xccyosXFxzKnxcXHMrLztcclxuICB2YXIgb3BzID0gZGl2aWRlciAhPT0gLTEgPyBbZnJhZ21lbnRzLnNsaWNlKDAsIGRpdmlkZXIpLmNvbmNhdChbZnJhZ21lbnRzW2RpdmlkZXJdLnNwbGl0KHNwbGl0UmVnZXgpWzBdXSksIFtmcmFnbWVudHNbZGl2aWRlcl0uc3BsaXQoc3BsaXRSZWdleClbMV1dLmNvbmNhdChmcmFnbWVudHMuc2xpY2UoZGl2aWRlciArIDEpKV0gOiBbZnJhZ21lbnRzXTtcclxuXHJcbiAgLy8gQ29udmVydCB0aGUgdmFsdWVzIHdpdGggdW5pdHMgdG8gYWJzb2x1dGUgcGl4ZWxzIHRvIGFsbG93IG91ciBjb21wdXRhdGlvbnNcclxuICBvcHMgPSBvcHMubWFwKGZ1bmN0aW9uIChvcCwgaW5kZXgpIHtcclxuICAgIC8vIE1vc3Qgb2YgdGhlIHVuaXRzIHJlbHkgb24gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwb3BwZXJcclxuICAgIHZhciBtZWFzdXJlbWVudCA9IChpbmRleCA9PT0gMSA/ICF1c2VIZWlnaHQgOiB1c2VIZWlnaHQpID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xyXG4gICAgdmFyIG1lcmdlV2l0aFByZXZpb3VzID0gZmFsc2U7XHJcbiAgICByZXR1cm4gb3BcclxuICAgIC8vIFRoaXMgYWdncmVnYXRlcyBhbnkgYCtgIG9yIGAtYCBzaWduIHRoYXQgYXJlbid0IGNvbnNpZGVyZWQgb3BlcmF0b3JzXHJcbiAgICAvLyBlLmcuOiAxMCArICs1ID0+IFsxMCwgKywgKzVdXHJcbiAgICAucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIGlmIChhW2EubGVuZ3RoIC0gMV0gPT09ICcnICYmIFsnKycsICctJ10uaW5kZXhPZihiKSAhPT0gLTEpIHtcclxuICAgICAgICBhW2EubGVuZ3RoIC0gMV0gPSBiO1xyXG4gICAgICAgIG1lcmdlV2l0aFByZXZpb3VzID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gYTtcclxuICAgICAgfSBlbHNlIGlmIChtZXJnZVdpdGhQcmV2aW91cykge1xyXG4gICAgICAgIGFbYS5sZW5ndGggLSAxXSArPSBiO1xyXG4gICAgICAgIG1lcmdlV2l0aFByZXZpb3VzID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGEuY29uY2F0KGIpO1xyXG4gICAgICB9XHJcbiAgICB9LCBbXSlcclxuICAgIC8vIEhlcmUgd2UgY29udmVydCB0aGUgc3RyaW5nIHZhbHVlcyBpbnRvIG51bWJlciB2YWx1ZXMgKGluIHB4KVxyXG4gICAgLm1hcChmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICAgIHJldHVybiB0b1ZhbHVlKHN0ciwgbWVhc3VyZW1lbnQsIHBvcHBlck9mZnNldHMsIHJlZmVyZW5jZU9mZnNldHMpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIC8vIExvb3AgdHJvdWdoIHRoZSBvZmZzZXRzIGFycmF5cyBhbmQgZXhlY3V0ZSB0aGUgb3BlcmF0aW9uc1xyXG4gIG9wcy5mb3JFYWNoKGZ1bmN0aW9uIChvcCwgaW5kZXgpIHtcclxuICAgIG9wLmZvckVhY2goZnVuY3Rpb24gKGZyYWcsIGluZGV4Mikge1xyXG4gICAgICBpZiAoaXNOdW1lcmljKGZyYWcpKSB7XHJcbiAgICAgICAgb2Zmc2V0c1tpbmRleF0gKz0gZnJhZyAqIChvcFtpbmRleDIgLSAxXSA9PT0gJy0nID8gLTEgOiAxKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIG9mZnNldHM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xyXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEBhcmd1bWVudCB7TnVtYmVyfFN0cmluZ30gb3B0aW9ucy5vZmZzZXQ9MFxyXG4gKiBUaGUgb2Zmc2V0IHZhbHVlIGFzIGRlc2NyaWJlZCBpbiB0aGUgbW9kaWZpZXIgZGVzY3JpcHRpb25cclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gb2Zmc2V0KGRhdGEsIF9yZWYpIHtcclxuICB2YXIgb2Zmc2V0ID0gX3JlZi5vZmZzZXQ7XHJcbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50LFxyXG4gICAgICBfZGF0YSRvZmZzZXRzID0gZGF0YS5vZmZzZXRzLFxyXG4gICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcixcclxuICAgICAgcmVmZXJlbmNlID0gX2RhdGEkb2Zmc2V0cy5yZWZlcmVuY2U7XHJcblxyXG4gIHZhciBiYXNlUGxhY2VtZW50ID0gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcblxyXG4gIHZhciBvZmZzZXRzID0gdm9pZCAwO1xyXG4gIGlmIChpc051bWVyaWMoK29mZnNldCkpIHtcclxuICAgIG9mZnNldHMgPSBbK29mZnNldCwgMF07XHJcbiAgfSBlbHNlIHtcclxuICAgIG9mZnNldHMgPSBwYXJzZU9mZnNldChvZmZzZXQsIHBvcHBlciwgcmVmZXJlbmNlLCBiYXNlUGxhY2VtZW50KTtcclxuICB9XHJcblxyXG4gIGlmIChiYXNlUGxhY2VtZW50ID09PSAnbGVmdCcpIHtcclxuICAgIHBvcHBlci50b3AgKz0gb2Zmc2V0c1swXTtcclxuICAgIHBvcHBlci5sZWZ0IC09IG9mZnNldHNbMV07XHJcbiAgfSBlbHNlIGlmIChiYXNlUGxhY2VtZW50ID09PSAncmlnaHQnKSB7XHJcbiAgICBwb3BwZXIudG9wICs9IG9mZnNldHNbMF07XHJcbiAgICBwb3BwZXIubGVmdCArPSBvZmZzZXRzWzFdO1xyXG4gIH0gZWxzZSBpZiAoYmFzZVBsYWNlbWVudCA9PT0gJ3RvcCcpIHtcclxuICAgIHBvcHBlci5sZWZ0ICs9IG9mZnNldHNbMF07XHJcbiAgICBwb3BwZXIudG9wIC09IG9mZnNldHNbMV07XHJcbiAgfSBlbHNlIGlmIChiYXNlUGxhY2VtZW50ID09PSAnYm90dG9tJykge1xyXG4gICAgcG9wcGVyLmxlZnQgKz0gb2Zmc2V0c1swXTtcclxuICAgIHBvcHBlci50b3AgKz0gb2Zmc2V0c1sxXTtcclxuICB9XHJcblxyXG4gIGRhdGEucG9wcGVyID0gcG9wcGVyO1xyXG4gIHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcclxuICovXHJcbmZ1bmN0aW9uIHByZXZlbnRPdmVyZmxvdyhkYXRhLCBvcHRpb25zKSB7XHJcbiAgdmFyIGJvdW5kYXJpZXNFbGVtZW50ID0gb3B0aW9ucy5ib3VuZGFyaWVzRWxlbWVudCB8fCBnZXRPZmZzZXRQYXJlbnQoZGF0YS5pbnN0YW5jZS5wb3BwZXIpO1xyXG5cclxuICAvLyBJZiBvZmZzZXRQYXJlbnQgaXMgdGhlIHJlZmVyZW5jZSBlbGVtZW50LCB3ZSByZWFsbHkgd2FudCB0b1xyXG4gIC8vIGdvIG9uZSBzdGVwIHVwIGFuZCB1c2UgdGhlIG5leHQgb2Zmc2V0UGFyZW50IGFzIHJlZmVyZW5jZSB0b1xyXG4gIC8vIGF2b2lkIHRvIG1ha2UgdGhpcyBtb2RpZmllciBjb21wbGV0ZWx5IHVzZWxlc3MgYW5kIGxvb2sgbGlrZSBicm9rZW5cclxuICBpZiAoZGF0YS5pbnN0YW5jZS5yZWZlcmVuY2UgPT09IGJvdW5kYXJpZXNFbGVtZW50KSB7XHJcbiAgICBib3VuZGFyaWVzRWxlbWVudCA9IGdldE9mZnNldFBhcmVudChib3VuZGFyaWVzRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICAvLyBOT1RFOiBET00gYWNjZXNzIGhlcmVcclxuICAvLyByZXNldHMgdGhlIHBvcHBlcidzIHBvc2l0aW9uIHNvIHRoYXQgdGhlIGRvY3VtZW50IHNpemUgY2FuIGJlIGNhbGN1bGF0ZWQgZXhjbHVkaW5nXHJcbiAgLy8gdGhlIHNpemUgb2YgdGhlIHBvcHBlciBlbGVtZW50IGl0c2VsZlxyXG4gIHZhciB0cmFuc2Zvcm1Qcm9wID0gZ2V0U3VwcG9ydGVkUHJvcGVydHlOYW1lKCd0cmFuc2Zvcm0nKTtcclxuICB2YXIgcG9wcGVyU3R5bGVzID0gZGF0YS5pbnN0YW5jZS5wb3BwZXIuc3R5bGU7IC8vIGFzc2lnbm1lbnQgdG8gaGVscCBtaW5pZmljYXRpb25cclxuICB2YXIgdG9wID0gcG9wcGVyU3R5bGVzLnRvcCxcclxuICAgICAgbGVmdCA9IHBvcHBlclN0eWxlcy5sZWZ0LFxyXG4gICAgICB0cmFuc2Zvcm0gPSBwb3BwZXJTdHlsZXNbdHJhbnNmb3JtUHJvcF07XHJcblxyXG4gIHBvcHBlclN0eWxlcy50b3AgPSAnJztcclxuICBwb3BwZXJTdHlsZXMubGVmdCA9ICcnO1xyXG4gIHBvcHBlclN0eWxlc1t0cmFuc2Zvcm1Qcm9wXSA9ICcnO1xyXG5cclxuICB2YXIgYm91bmRhcmllcyA9IGdldEJvdW5kYXJpZXMoZGF0YS5pbnN0YW5jZS5wb3BwZXIsIGRhdGEuaW5zdGFuY2UucmVmZXJlbmNlLCBvcHRpb25zLnBhZGRpbmcsIGJvdW5kYXJpZXNFbGVtZW50LCBkYXRhLnBvc2l0aW9uRml4ZWQpO1xyXG5cclxuICAvLyBOT1RFOiBET00gYWNjZXNzIGhlcmVcclxuICAvLyByZXN0b3JlcyB0aGUgb3JpZ2luYWwgc3R5bGUgcHJvcGVydGllcyBhZnRlciB0aGUgb2Zmc2V0cyBoYXZlIGJlZW4gY29tcHV0ZWRcclxuICBwb3BwZXJTdHlsZXMudG9wID0gdG9wO1xyXG4gIHBvcHBlclN0eWxlcy5sZWZ0ID0gbGVmdDtcclxuICBwb3BwZXJTdHlsZXNbdHJhbnNmb3JtUHJvcF0gPSB0cmFuc2Zvcm07XHJcblxyXG4gIG9wdGlvbnMuYm91bmRhcmllcyA9IGJvdW5kYXJpZXM7XHJcblxyXG4gIHZhciBvcmRlciA9IG9wdGlvbnMucHJpb3JpdHk7XHJcbiAgdmFyIHBvcHBlciA9IGRhdGEub2Zmc2V0cy5wb3BwZXI7XHJcblxyXG4gIHZhciBjaGVjayA9IHtcclxuICAgIHByaW1hcnk6IGZ1bmN0aW9uIHByaW1hcnkocGxhY2VtZW50KSB7XHJcbiAgICAgIHZhciB2YWx1ZSA9IHBvcHBlcltwbGFjZW1lbnRdO1xyXG4gICAgICBpZiAocG9wcGVyW3BsYWNlbWVudF0gPCBib3VuZGFyaWVzW3BsYWNlbWVudF0gJiYgIW9wdGlvbnMuZXNjYXBlV2l0aFJlZmVyZW5jZSkge1xyXG4gICAgICAgIHZhbHVlID0gTWF0aC5tYXgocG9wcGVyW3BsYWNlbWVudF0sIGJvdW5kYXJpZXNbcGxhY2VtZW50XSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5JDEoe30sIHBsYWNlbWVudCwgdmFsdWUpO1xyXG4gICAgfSxcclxuICAgIHNlY29uZGFyeTogZnVuY3Rpb24gc2Vjb25kYXJ5KHBsYWNlbWVudCkge1xyXG4gICAgICB2YXIgbWFpblNpZGUgPSBwbGFjZW1lbnQgPT09ICdyaWdodCcgPyAnbGVmdCcgOiAndG9wJztcclxuICAgICAgdmFyIHZhbHVlID0gcG9wcGVyW21haW5TaWRlXTtcclxuICAgICAgaWYgKHBvcHBlcltwbGFjZW1lbnRdID4gYm91bmRhcmllc1twbGFjZW1lbnRdICYmICFvcHRpb25zLmVzY2FwZVdpdGhSZWZlcmVuY2UpIHtcclxuICAgICAgICB2YWx1ZSA9IE1hdGgubWluKHBvcHBlclttYWluU2lkZV0sIGJvdW5kYXJpZXNbcGxhY2VtZW50XSAtIChwbGFjZW1lbnQgPT09ICdyaWdodCcgPyBwb3BwZXIud2lkdGggOiBwb3BwZXIuaGVpZ2h0KSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5JDEoe30sIG1haW5TaWRlLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgb3JkZXIuZm9yRWFjaChmdW5jdGlvbiAocGxhY2VtZW50KSB7XHJcbiAgICB2YXIgc2lkZSA9IFsnbGVmdCcsICd0b3AnXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xID8gJ3ByaW1hcnknIDogJ3NlY29uZGFyeSc7XHJcbiAgICBwb3BwZXIgPSBfZXh0ZW5kcyQxKHt9LCBwb3BwZXIsIGNoZWNrW3NpZGVdKHBsYWNlbWVudCkpO1xyXG4gIH0pO1xyXG5cclxuICBkYXRhLm9mZnNldHMucG9wcGVyID0gcG9wcGVyO1xyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBgdXBkYXRlYCBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBzaGlmdChkYXRhKSB7XHJcbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50O1xyXG4gIHZhciBiYXNlUGxhY2VtZW50ID0gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcbiAgdmFyIHNoaWZ0dmFyaWF0aW9uID0gcGxhY2VtZW50LnNwbGl0KCctJylbMV07XHJcblxyXG4gIC8vIGlmIHNoaWZ0IHNoaWZ0dmFyaWF0aW9uIGlzIHNwZWNpZmllZCwgcnVuIHRoZSBtb2RpZmllclxyXG4gIGlmIChzaGlmdHZhcmlhdGlvbikge1xyXG4gICAgdmFyIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXHJcbiAgICAgICAgcmVmZXJlbmNlID0gX2RhdGEkb2Zmc2V0cy5yZWZlcmVuY2UsXHJcbiAgICAgICAgcG9wcGVyID0gX2RhdGEkb2Zmc2V0cy5wb3BwZXI7XHJcblxyXG4gICAgdmFyIGlzVmVydGljYWwgPSBbJ2JvdHRvbScsICd0b3AnXS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpICE9PSAtMTtcclxuICAgIHZhciBzaWRlID0gaXNWZXJ0aWNhbCA/ICdsZWZ0JyA6ICd0b3AnO1xyXG4gICAgdmFyIG1lYXN1cmVtZW50ID0gaXNWZXJ0aWNhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcclxuXHJcbiAgICB2YXIgc2hpZnRPZmZzZXRzID0ge1xyXG4gICAgICBzdGFydDogZGVmaW5lUHJvcGVydHkkMSh7fSwgc2lkZSwgcmVmZXJlbmNlW3NpZGVdKSxcclxuICAgICAgZW5kOiBkZWZpbmVQcm9wZXJ0eSQxKHt9LCBzaWRlLCByZWZlcmVuY2Vbc2lkZV0gKyByZWZlcmVuY2VbbWVhc3VyZW1lbnRdIC0gcG9wcGVyW21lYXN1cmVtZW50XSlcclxuICAgIH07XHJcblxyXG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IF9leHRlbmRzJDEoe30sIHBvcHBlciwgc2hpZnRPZmZzZXRzW3NoaWZ0dmFyaWF0aW9uXSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxyXG4gKi9cclxuZnVuY3Rpb24gaGlkZShkYXRhKSB7XHJcbiAgaWYgKCFpc01vZGlmaWVyUmVxdWlyZWQoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsICdoaWRlJywgJ3ByZXZlbnRPdmVyZmxvdycpKSB7XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIHZhciByZWZSZWN0ID0gZGF0YS5vZmZzZXRzLnJlZmVyZW5jZTtcclxuICB2YXIgYm91bmQgPSBmaW5kKGRhdGEuaW5zdGFuY2UubW9kaWZpZXJzLCBmdW5jdGlvbiAobW9kaWZpZXIpIHtcclxuICAgIHJldHVybiBtb2RpZmllci5uYW1lID09PSAncHJldmVudE92ZXJmbG93JztcclxuICB9KS5ib3VuZGFyaWVzO1xyXG5cclxuICBpZiAocmVmUmVjdC5ib3R0b20gPCBib3VuZC50b3AgfHwgcmVmUmVjdC5sZWZ0ID4gYm91bmQucmlnaHQgfHwgcmVmUmVjdC50b3AgPiBib3VuZC5ib3R0b20gfHwgcmVmUmVjdC5yaWdodCA8IGJvdW5kLmxlZnQpIHtcclxuICAgIC8vIEF2b2lkIHVubmVjZXNzYXJ5IERPTSBhY2Nlc3MgaWYgdmlzaWJpbGl0eSBoYXNuJ3QgY2hhbmdlZFxyXG4gICAgaWYgKGRhdGEuaGlkZSA9PT0gdHJ1ZSkge1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhLmhpZGUgPSB0cnVlO1xyXG4gICAgZGF0YS5hdHRyaWJ1dGVzWyd4LW91dC1vZi1ib3VuZGFyaWVzJ10gPSAnJztcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gQXZvaWQgdW5uZWNlc3NhcnkgRE9NIGFjY2VzcyBpZiB2aXNpYmlsaXR5IGhhc24ndCBjaGFuZ2VkXHJcbiAgICBpZiAoZGF0YS5oaWRlID09PSBmYWxzZSkge1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhLmhpZGUgPSBmYWxzZTtcclxuICAgIGRhdGEuYXR0cmlidXRlc1sneC1vdXQtb2YtYm91bmRhcmllcyddID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0YTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXHJcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBgdXBkYXRlYCBtZXRob2RcclxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xyXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5mdW5jdGlvbiBpbm5lcihkYXRhKSB7XHJcbiAgdmFyIHBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50O1xyXG4gIHZhciBiYXNlUGxhY2VtZW50ID0gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XHJcbiAgdmFyIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXHJcbiAgICAgIHBvcHBlciA9IF9kYXRhJG9mZnNldHMucG9wcGVyLFxyXG4gICAgICByZWZlcmVuY2UgPSBfZGF0YSRvZmZzZXRzLnJlZmVyZW5jZTtcclxuXHJcbiAgdmFyIGlzSG9yaXogPSBbJ2xlZnQnLCAncmlnaHQnXS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpICE9PSAtMTtcclxuXHJcbiAgdmFyIHN1YnRyYWN0TGVuZ3RoID0gWyd0b3AnLCAnbGVmdCddLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPT09IC0xO1xyXG5cclxuICBwb3BwZXJbaXNIb3JpeiA/ICdsZWZ0JyA6ICd0b3AnXSA9IHJlZmVyZW5jZVtiYXNlUGxhY2VtZW50XSAtIChzdWJ0cmFjdExlbmd0aCA/IHBvcHBlcltpc0hvcml6ID8gJ3dpZHRoJyA6ICdoZWlnaHQnXSA6IDApO1xyXG5cclxuICBkYXRhLnBsYWNlbWVudCA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XHJcbiAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IGdldENsaWVudFJlY3QocG9wcGVyKTtcclxuXHJcbiAgcmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNb2RpZmllciBmdW5jdGlvbiwgZWFjaCBtb2RpZmllciBjYW4gaGF2ZSBhIGZ1bmN0aW9uIG9mIHRoaXMgdHlwZSBhc3NpZ25lZFxyXG4gKiB0byBpdHMgYGZuYCBwcm9wZXJ0eS48YnIgLz5cclxuICogVGhlc2UgZnVuY3Rpb25zIHdpbGwgYmUgY2FsbGVkIG9uIGVhY2ggdXBkYXRlLCB0aGlzIG1lYW5zIHRoYXQgeW91IG11c3RcclxuICogbWFrZSBzdXJlIHRoZXkgYXJlIHBlcmZvcm1hbnQgZW5vdWdoIHRvIGF2b2lkIHBlcmZvcm1hbmNlIGJvdHRsZW5lY2tzLlxyXG4gKlxyXG4gKiBAZnVuY3Rpb24gTW9kaWZpZXJGblxyXG4gKiBAYXJndW1lbnQge2RhdGFPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxyXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXHJcbiAqIEByZXR1cm5zIHtkYXRhT2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIE1vZGlmaWVycyBhcmUgcGx1Z2lucyB1c2VkIHRvIGFsdGVyIHRoZSBiZWhhdmlvciBvZiB5b3VyIHBvcHBlcnMuPGJyIC8+XHJcbiAqIFBvcHBlci5qcyB1c2VzIGEgc2V0IG9mIDkgbW9kaWZpZXJzIHRvIHByb3ZpZGUgYWxsIHRoZSBiYXNpYyBmdW5jdGlvbmFsaXRpZXNcclxuICogbmVlZGVkIGJ5IHRoZSBsaWJyYXJ5LlxyXG4gKlxyXG4gKiBVc3VhbGx5IHlvdSBkb24ndCB3YW50IHRvIG92ZXJyaWRlIHRoZSBgb3JkZXJgLCBgZm5gIGFuZCBgb25Mb2FkYCBwcm9wcy5cclxuICogQWxsIHRoZSBvdGhlciBwcm9wZXJ0aWVzIGFyZSBjb25maWd1cmF0aW9ucyB0aGF0IGNvdWxkIGJlIHR3ZWFrZWQuXHJcbiAqIEBuYW1lc3BhY2UgbW9kaWZpZXJzXHJcbiAqL1xyXG52YXIgbW9kaWZpZXJzID0ge1xyXG4gIC8qKlxyXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gc2hpZnQgdGhlIHBvcHBlciBvbiB0aGUgc3RhcnQgb3IgZW5kIG9mIGl0cyByZWZlcmVuY2VcclxuICAgKiBlbGVtZW50LjxiciAvPlxyXG4gICAqIEl0IHdpbGwgcmVhZCB0aGUgdmFyaWF0aW9uIG9mIHRoZSBgcGxhY2VtZW50YCBwcm9wZXJ0eS48YnIgLz5cclxuICAgKiBJdCBjYW4gYmUgb25lIGVpdGhlciBgLWVuZGAgb3IgYC1zdGFydGAuXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIHNoaWZ0OiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9MTAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDEwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogc2hpZnRcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBUaGUgYG9mZnNldGAgbW9kaWZpZXIgY2FuIHNoaWZ0IHlvdXIgcG9wcGVyIG9uIGJvdGggaXRzIGF4aXMuXHJcbiAgICpcclxuICAgKiBJdCBhY2NlcHRzIHRoZSBmb2xsb3dpbmcgdW5pdHM6XHJcbiAgICogLSBgcHhgIG9yIHVuaXRsZXNzLCBpbnRlcnByZXRlZCBhcyBwaXhlbHNcclxuICAgKiAtIGAlYCBvciBgJXJgLCBwZXJjZW50YWdlIHJlbGF0aXZlIHRvIHRoZSBsZW5ndGggb2YgdGhlIHJlZmVyZW5jZSBlbGVtZW50XHJcbiAgICogLSBgJXBgLCBwZXJjZW50YWdlIHJlbGF0aXZlIHRvIHRoZSBsZW5ndGggb2YgdGhlIHBvcHBlciBlbGVtZW50XHJcbiAgICogLSBgdndgLCBDU1Mgdmlld3BvcnQgd2lkdGggdW5pdFxyXG4gICAqIC0gYHZoYCwgQ1NTIHZpZXdwb3J0IGhlaWdodCB1bml0XHJcbiAgICpcclxuICAgKiBGb3IgbGVuZ3RoIGlzIGludGVuZGVkIHRoZSBtYWluIGF4aXMgcmVsYXRpdmUgdG8gdGhlIHBsYWNlbWVudCBvZiB0aGUgcG9wcGVyLjxiciAvPlxyXG4gICAqIFRoaXMgbWVhbnMgdGhhdCBpZiB0aGUgcGxhY2VtZW50IGlzIGB0b3BgIG9yIGBib3R0b21gLCB0aGUgbGVuZ3RoIHdpbGwgYmUgdGhlXHJcbiAgICogYHdpZHRoYC4gSW4gY2FzZSBvZiBgbGVmdGAgb3IgYHJpZ2h0YCwgaXQgd2lsbCBiZSB0aGUgaGVpZ2h0LlxyXG4gICAqXHJcbiAgICogWW91IGNhbiBwcm92aWRlIGEgc2luZ2xlIHZhbHVlIChhcyBgTnVtYmVyYCBvciBgU3RyaW5nYCksIG9yIGEgcGFpciBvZiB2YWx1ZXNcclxuICAgKiBhcyBgU3RyaW5nYCBkaXZpZGVkIGJ5IGEgY29tbWEgb3Igb25lIChvciBtb3JlKSB3aGl0ZSBzcGFjZXMuPGJyIC8+XHJcbiAgICogVGhlIGxhdHRlciBpcyBhIGRlcHJlY2F0ZWQgbWV0aG9kIGJlY2F1c2UgaXQgbGVhZHMgdG8gY29uZnVzaW9uIGFuZCB3aWxsIGJlXHJcbiAgICogcmVtb3ZlZCBpbiB2Mi48YnIgLz5cclxuICAgKiBBZGRpdGlvbmFsbHksIGl0IGFjY2VwdHMgYWRkaXRpb25zIGFuZCBzdWJ0cmFjdGlvbnMgYmV0d2VlbiBkaWZmZXJlbnQgdW5pdHMuXHJcbiAgICogTm90ZSB0aGF0IG11bHRpcGxpY2F0aW9ucyBhbmQgZGl2aXNpb25zIGFyZW4ndCBzdXBwb3J0ZWQuXHJcbiAgICpcclxuICAgKiBWYWxpZCBleGFtcGxlcyBhcmU6XHJcbiAgICogYGBgXHJcbiAgICogMTBcclxuICAgKiAnMTAlJ1xyXG4gICAqICcxMCwgMTAnXHJcbiAgICogJzEwJSwgMTAnXHJcbiAgICogJzEwICsgMTAlJ1xyXG4gICAqICcxMCAtIDV2aCArIDMlJ1xyXG4gICAqICctMTBweCArIDV2aCwgNXB4IC0gNiUnXHJcbiAgICogYGBgXHJcbiAgICogPiAqKk5CKio6IElmIHlvdSBkZXNpcmUgdG8gYXBwbHkgb2Zmc2V0cyB0byB5b3VyIHBvcHBlcnMgaW4gYSB3YXkgdGhhdCBtYXkgbWFrZSB0aGVtIG92ZXJsYXBcclxuICAgKiA+IHdpdGggdGhlaXIgcmVmZXJlbmNlIGVsZW1lbnQsIHVuZm9ydHVuYXRlbHksIHlvdSB3aWxsIGhhdmUgdG8gZGlzYWJsZSB0aGUgYGZsaXBgIG1vZGlmaWVyLlxyXG4gICAqID4gTW9yZSBvbiB0aGlzIFtyZWFkaW5nIHRoaXMgaXNzdWVdKGh0dHBzOi8vZ2l0aHViLmNvbS9GZXpWcmFzdGEvcG9wcGVyLmpzL2lzc3Vlcy8zNzMpXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgb2Zmc2V0OiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9MjAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDIwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogb2Zmc2V0LFxyXG4gICAgLyoqIEBwcm9wIHtOdW1iZXJ8U3RyaW5nfSBvZmZzZXQ9MFxyXG4gICAgICogVGhlIG9mZnNldCB2YWx1ZSBhcyBkZXNjcmliZWQgaW4gdGhlIG1vZGlmaWVyIGRlc2NyaXB0aW9uXHJcbiAgICAgKi9cclxuICAgIG9mZnNldDogMFxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gcHJldmVudCB0aGUgcG9wcGVyIGZyb20gYmVpbmcgcG9zaXRpb25lZCBvdXRzaWRlIHRoZSBib3VuZGFyeS5cclxuICAgKlxyXG4gICAqIEFuIHNjZW5hcmlvIGV4aXN0cyB3aGVyZSB0aGUgcmVmZXJlbmNlIGl0c2VsZiBpcyBub3Qgd2l0aGluIHRoZSBib3VuZGFyaWVzLjxiciAvPlxyXG4gICAqIFdlIGNhbiBzYXkgaXQgaGFzIFwiZXNjYXBlZCB0aGUgYm91bmRhcmllc1wiIOKAlCBvciBqdXN0IFwiZXNjYXBlZFwiLjxiciAvPlxyXG4gICAqIEluIHRoaXMgY2FzZSB3ZSBuZWVkIHRvIGRlY2lkZSB3aGV0aGVyIHRoZSBwb3BwZXIgc2hvdWxkIGVpdGhlcjpcclxuICAgKlxyXG4gICAqIC0gZGV0YWNoIGZyb20gdGhlIHJlZmVyZW5jZSBhbmQgcmVtYWluIFwidHJhcHBlZFwiIGluIHRoZSBib3VuZGFyaWVzLCBvclxyXG4gICAqIC0gaWYgaXQgc2hvdWxkIGlnbm9yZSB0aGUgYm91bmRhcnkgYW5kIFwiZXNjYXBlIHdpdGggaXRzIHJlZmVyZW5jZVwiXHJcbiAgICpcclxuICAgKiBXaGVuIGBlc2NhcGVXaXRoUmVmZXJlbmNlYCBpcyBzZXQgdG9gdHJ1ZWAgYW5kIHJlZmVyZW5jZSBpcyBjb21wbGV0ZWx5XHJcbiAgICogb3V0c2lkZSBpdHMgYm91bmRhcmllcywgdGhlIHBvcHBlciB3aWxsIG92ZXJmbG93IChvciBjb21wbGV0ZWx5IGxlYXZlKVxyXG4gICAqIHRoZSBib3VuZGFyaWVzIGluIG9yZGVyIHRvIHJlbWFpbiBhdHRhY2hlZCB0byB0aGUgZWRnZSBvZiB0aGUgcmVmZXJlbmNlLlxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIHByZXZlbnRPdmVyZmxvdzoge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTMwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiAzMDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IHByZXZlbnRPdmVyZmxvdyxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age0FycmF5fSBbcHJpb3JpdHk9WydsZWZ0JywncmlnaHQnLCd0b3AnLCdib3R0b20nXV1cclxuICAgICAqIFBvcHBlciB3aWxsIHRyeSB0byBwcmV2ZW50IG92ZXJmbG93IGZvbGxvd2luZyB0aGVzZSBwcmlvcml0aWVzIGJ5IGRlZmF1bHQsXHJcbiAgICAgKiB0aGVuLCBpdCBjb3VsZCBvdmVyZmxvdyBvbiB0aGUgbGVmdCBhbmQgb24gdG9wIG9mIHRoZSBgYm91bmRhcmllc0VsZW1lbnRgXHJcbiAgICAgKi9cclxuICAgIHByaW9yaXR5OiBbJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbSddLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7bnVtYmVyfSBwYWRkaW5nPTVcclxuICAgICAqIEFtb3VudCBvZiBwaXhlbCB1c2VkIHRvIGRlZmluZSBhIG1pbmltdW0gZGlzdGFuY2UgYmV0d2VlbiB0aGUgYm91bmRhcmllc1xyXG4gICAgICogYW5kIHRoZSBwb3BwZXIgdGhpcyBtYWtlcyBzdXJlIHRoZSBwb3BwZXIgaGFzIGFsd2F5cyBhIGxpdHRsZSBwYWRkaW5nXHJcbiAgICAgKiBiZXR3ZWVuIHRoZSBlZGdlcyBvZiBpdHMgY29udGFpbmVyXHJcbiAgICAgKi9cclxuICAgIHBhZGRpbmc6IDUsXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtTdHJpbmd8SFRNTEVsZW1lbnR9IGJvdW5kYXJpZXNFbGVtZW50PSdzY3JvbGxQYXJlbnQnXHJcbiAgICAgKiBCb3VuZGFyaWVzIHVzZWQgYnkgdGhlIG1vZGlmaWVyLCBjYW4gYmUgYHNjcm9sbFBhcmVudGAsIGB3aW5kb3dgLFxyXG4gICAgICogYHZpZXdwb3J0YCBvciBhbnkgRE9NIGVsZW1lbnQuXHJcbiAgICAgKi9cclxuICAgIGJvdW5kYXJpZXNFbGVtZW50OiAnc2Nyb2xsUGFyZW50J1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gbWFrZSBzdXJlIHRoZSByZWZlcmVuY2UgYW5kIGl0cyBwb3BwZXIgc3RheSBuZWFyIGVhY2hvdGhlcnNcclxuICAgKiB3aXRob3V0IGxlYXZpbmcgYW55IGdhcCBiZXR3ZWVuIHRoZSB0d28uIEV4cGVjaWFsbHkgdXNlZnVsIHdoZW4gdGhlIGFycm93IGlzXHJcbiAgICogZW5hYmxlZCBhbmQgeW91IHdhbnQgdG8gYXNzdXJlIGl0IHRvIHBvaW50IHRvIGl0cyByZWZlcmVuY2UgZWxlbWVudC5cclxuICAgKiBJdCBjYXJlcyBvbmx5IGFib3V0IHRoZSBmaXJzdCBheGlzLCB5b3UgY2FuIHN0aWxsIGhhdmUgcG9wcGVycyB3aXRoIG1hcmdpblxyXG4gICAqIGJldHdlZW4gdGhlIHBvcHBlciBhbmQgaXRzIHJlZmVyZW5jZSBlbGVtZW50LlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBrZWVwVG9nZXRoZXI6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj00MDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogNDAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBrZWVwVG9nZXRoZXJcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBUaGlzIG1vZGlmaWVyIGlzIHVzZWQgdG8gbW92ZSB0aGUgYGFycm93RWxlbWVudGAgb2YgdGhlIHBvcHBlciB0byBtYWtlXHJcbiAgICogc3VyZSBpdCBpcyBwb3NpdGlvbmVkIGJldHdlZW4gdGhlIHJlZmVyZW5jZSBlbGVtZW50IGFuZCBpdHMgcG9wcGVyIGVsZW1lbnQuXHJcbiAgICogSXQgd2lsbCByZWFkIHRoZSBvdXRlciBzaXplIG9mIHRoZSBgYXJyb3dFbGVtZW50YCBub2RlIHRvIGRldGVjdCBob3cgbWFueVxyXG4gICAqIHBpeGVscyBvZiBjb25qdWN0aW9uIGFyZSBuZWVkZWQuXHJcbiAgICpcclxuICAgKiBJdCBoYXMgbm8gZWZmZWN0IGlmIG5vIGBhcnJvd0VsZW1lbnRgIGlzIHByb3ZpZGVkLlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBhcnJvdzoge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTUwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiA1MDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IGFycm93LFxyXG4gICAgLyoqIEBwcm9wIHtTdHJpbmd8SFRNTEVsZW1lbnR9IGVsZW1lbnQ9J1t4LWFycm93XScgLSBTZWxlY3RvciBvciBub2RlIHVzZWQgYXMgYXJyb3cgKi9cclxuICAgIGVsZW1lbnQ6ICdbeC1hcnJvd10nXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogTW9kaWZpZXIgdXNlZCB0byBmbGlwIHRoZSBwb3BwZXIncyBwbGFjZW1lbnQgd2hlbiBpdCBzdGFydHMgdG8gb3ZlcmxhcCBpdHNcclxuICAgKiByZWZlcmVuY2UgZWxlbWVudC5cclxuICAgKlxyXG4gICAqIFJlcXVpcmVzIHRoZSBgcHJldmVudE92ZXJmbG93YCBtb2RpZmllciBiZWZvcmUgaXQgaW4gb3JkZXIgdG8gd29yay5cclxuICAgKlxyXG4gICAqICoqTk9URToqKiB0aGlzIG1vZGlmaWVyIHdpbGwgaW50ZXJydXB0IHRoZSBjdXJyZW50IHVwZGF0ZSBjeWNsZSBhbmQgd2lsbFxyXG4gICAqIHJlc3RhcnQgaXQgaWYgaXQgZGV0ZWN0cyB0aGUgbmVlZCB0byBmbGlwIHRoZSBwbGFjZW1lbnQuXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIGZsaXA6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj02MDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogNjAwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBmbGlwLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcCB7U3RyaW5nfEFycmF5fSBiZWhhdmlvcj0nZmxpcCdcclxuICAgICAqIFRoZSBiZWhhdmlvciB1c2VkIHRvIGNoYW5nZSB0aGUgcG9wcGVyJ3MgcGxhY2VtZW50LiBJdCBjYW4gYmUgb25lIG9mXHJcbiAgICAgKiBgZmxpcGAsIGBjbG9ja3dpc2VgLCBgY291bnRlcmNsb2Nrd2lzZWAgb3IgYW4gYXJyYXkgd2l0aCBhIGxpc3Qgb2YgdmFsaWRcclxuICAgICAqIHBsYWNlbWVudHMgKHdpdGggb3B0aW9uYWwgdmFyaWF0aW9ucykuXHJcbiAgICAgKi9cclxuICAgIGJlaGF2aW9yOiAnZmxpcCcsXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtudW1iZXJ9IHBhZGRpbmc9NVxyXG4gICAgICogVGhlIHBvcHBlciB3aWxsIGZsaXAgaWYgaXQgaGl0cyB0aGUgZWRnZXMgb2YgdGhlIGBib3VuZGFyaWVzRWxlbWVudGBcclxuICAgICAqL1xyXG4gICAgcGFkZGluZzogNSxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age1N0cmluZ3xIVE1MRWxlbWVudH0gYm91bmRhcmllc0VsZW1lbnQ9J3ZpZXdwb3J0J1xyXG4gICAgICogVGhlIGVsZW1lbnQgd2hpY2ggd2lsbCBkZWZpbmUgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIHBvcHBlciBwb3NpdGlvbixcclxuICAgICAqIHRoZSBwb3BwZXIgd2lsbCBuZXZlciBiZSBwbGFjZWQgb3V0c2lkZSBvZiB0aGUgZGVmaW5lZCBib3VuZGFyaWVzXHJcbiAgICAgKiAoZXhjZXB0IGlmIGtlZXBUb2dldGhlciBpcyBlbmFibGVkKVxyXG4gICAgICovXHJcbiAgICBib3VuZGFyaWVzRWxlbWVudDogJ3ZpZXdwb3J0J1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gbWFrZSB0aGUgcG9wcGVyIGZsb3cgdG93YXJkIHRoZSBpbm5lciBvZiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQuXHJcbiAgICogQnkgZGVmYXVsdCwgd2hlbiB0aGlzIG1vZGlmaWVyIGlzIGRpc2FibGVkLCB0aGUgcG9wcGVyIHdpbGwgYmUgcGxhY2VkIG91dHNpZGVcclxuICAgKiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQuXHJcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xyXG4gICAqIEBpbm5lclxyXG4gICAqL1xyXG4gIGlubmVyOiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9NzAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDcwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD1mYWxzZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiBmYWxzZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBpbm5lclxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gaGlkZSB0aGUgcG9wcGVyIHdoZW4gaXRzIHJlZmVyZW5jZSBlbGVtZW50IGlzIG91dHNpZGUgb2YgdGhlXHJcbiAgICogcG9wcGVyIGJvdW5kYXJpZXMuIEl0IHdpbGwgc2V0IGEgYHgtb3V0LW9mLWJvdW5kYXJpZXNgIGF0dHJpYnV0ZSB3aGljaCBjYW5cclxuICAgKiBiZSB1c2VkIHRvIGhpZGUgd2l0aCBhIENTUyBzZWxlY3RvciB0aGUgcG9wcGVyIHdoZW4gaXRzIHJlZmVyZW5jZSBpc1xyXG4gICAqIG91dCBvZiBib3VuZGFyaWVzLlxyXG4gICAqXHJcbiAgICogUmVxdWlyZXMgdGhlIGBwcmV2ZW50T3ZlcmZsb3dgIG1vZGlmaWVyIGJlZm9yZSBpdCBpbiBvcmRlciB0byB3b3JrLlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBoaWRlOiB7XHJcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9ODAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xyXG4gICAgb3JkZXI6IDgwMCxcclxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXHJcbiAgICBmbjogaGlkZVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIENvbXB1dGVzIHRoZSBzdHlsZSB0aGF0IHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyIGVsZW1lbnQgdG8gZ2V0c1xyXG4gICAqIHByb3Blcmx5IHBvc2l0aW9uZWQuXHJcbiAgICpcclxuICAgKiBOb3RlIHRoYXQgdGhpcyBtb2RpZmllciB3aWxsIG5vdCB0b3VjaCB0aGUgRE9NLCBpdCBqdXN0IHByZXBhcmVzIHRoZSBzdHlsZXNcclxuICAgKiBzbyB0aGF0IGBhcHBseVN0eWxlYCBtb2RpZmllciBjYW4gYXBwbHkgaXQuIFRoaXMgc2VwYXJhdGlvbiBpcyB1c2VmdWxcclxuICAgKiBpbiBjYXNlIHlvdSBuZWVkIHRvIHJlcGxhY2UgYGFwcGx5U3R5bGVgIHdpdGggYSBjdXN0b20gaW1wbGVtZW50YXRpb24uXHJcbiAgICpcclxuICAgKiBUaGlzIG1vZGlmaWVyIGhhcyBgODUwYCBhcyBgb3JkZXJgIHZhbHVlIHRvIG1haW50YWluIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcclxuICAgKiB3aXRoIHByZXZpb3VzIHZlcnNpb25zIG9mIFBvcHBlci5qcy4gRXhwZWN0IHRoZSBtb2RpZmllcnMgb3JkZXJpbmcgbWV0aG9kXHJcbiAgICogdG8gY2hhbmdlIGluIGZ1dHVyZSBtYWpvciB2ZXJzaW9ucyBvZiB0aGUgbGlicmFyeS5cclxuICAgKlxyXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcclxuICAgKiBAaW5uZXJcclxuICAgKi9cclxuICBjb21wdXRlU3R5bGU6IHtcclxuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj04NTAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXHJcbiAgICBvcmRlcjogODUwLFxyXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xyXG4gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cclxuICAgIGZuOiBjb21wdXRlU3R5bGUsXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtCb29sZWFufSBncHVBY2NlbGVyYXRpb249dHJ1ZVxyXG4gICAgICogSWYgdHJ1ZSwgaXQgdXNlcyB0aGUgQ1NTIDNkIHRyYW5zZm9ybWF0aW9uIHRvIHBvc2l0aW9uIHRoZSBwb3BwZXIuXHJcbiAgICAgKiBPdGhlcndpc2UsIGl0IHdpbGwgdXNlIHRoZSBgdG9wYCBhbmQgYGxlZnRgIHByb3BlcnRpZXMuXHJcbiAgICAgKi9cclxuICAgIGdwdUFjY2VsZXJhdGlvbjogdHJ1ZSxcclxuICAgIC8qKlxyXG4gICAgICogQHByb3Age3N0cmluZ30gW3g9J2JvdHRvbSddXHJcbiAgICAgKiBXaGVyZSB0byBhbmNob3IgdGhlIFggYXhpcyAoYGJvdHRvbWAgb3IgYHRvcGApLiBBS0EgWCBvZmZzZXQgb3JpZ2luLlxyXG4gICAgICogQ2hhbmdlIHRoaXMgaWYgeW91ciBwb3BwZXIgc2hvdWxkIGdyb3cgaW4gYSBkaXJlY3Rpb24gZGlmZmVyZW50IGZyb20gYGJvdHRvbWBcclxuICAgICAqL1xyXG4gICAgeDogJ2JvdHRvbScsXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wIHtzdHJpbmd9IFt4PSdsZWZ0J11cclxuICAgICAqIFdoZXJlIHRvIGFuY2hvciB0aGUgWSBheGlzIChgbGVmdGAgb3IgYHJpZ2h0YCkuIEFLQSBZIG9mZnNldCBvcmlnaW4uXHJcbiAgICAgKiBDaGFuZ2UgdGhpcyBpZiB5b3VyIHBvcHBlciBzaG91bGQgZ3JvdyBpbiBhIGRpcmVjdGlvbiBkaWZmZXJlbnQgZnJvbSBgcmlnaHRgXHJcbiAgICAgKi9cclxuICAgIHk6ICdyaWdodCdcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBBcHBsaWVzIHRoZSBjb21wdXRlZCBzdHlsZXMgdG8gdGhlIHBvcHBlciBlbGVtZW50LlxyXG4gICAqXHJcbiAgICogQWxsIHRoZSBET00gbWFuaXB1bGF0aW9ucyBhcmUgbGltaXRlZCB0byB0aGlzIG1vZGlmaWVyLiBUaGlzIGlzIHVzZWZ1bCBpbiBjYXNlXHJcbiAgICogeW91IHdhbnQgdG8gaW50ZWdyYXRlIFBvcHBlci5qcyBpbnNpZGUgYSBmcmFtZXdvcmsgb3IgdmlldyBsaWJyYXJ5IGFuZCB5b3VcclxuICAgKiB3YW50IHRvIGRlbGVnYXRlIGFsbCB0aGUgRE9NIG1hbmlwdWxhdGlvbnMgdG8gaXQuXHJcbiAgICpcclxuICAgKiBOb3RlIHRoYXQgaWYgeW91IGRpc2FibGUgdGhpcyBtb2RpZmllciwgeW91IG11c3QgbWFrZSBzdXJlIHRoZSBwb3BwZXIgZWxlbWVudFxyXG4gICAqIGhhcyBpdHMgcG9zaXRpb24gc2V0IHRvIGBhYnNvbHV0ZWAgYmVmb3JlIFBvcHBlci5qcyBjYW4gZG8gaXRzIHdvcmshXHJcbiAgICpcclxuICAgKiBKdXN0IGRpc2FibGUgdGhpcyBtb2RpZmllciBhbmQgZGVmaW5lIHlvdSBvd24gdG8gYWNoaWV2ZSB0aGUgZGVzaXJlZCBlZmZlY3QuXHJcbiAgICpcclxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXHJcbiAgICogQGlubmVyXHJcbiAgICovXHJcbiAgYXBwbHlTdHlsZToge1xyXG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTkwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cclxuICAgIG9yZGVyOiA5MDAsXHJcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xyXG4gICAgZm46IGFwcGx5U3R5bGUsXHJcbiAgICAvKiogQHByb3Age0Z1bmN0aW9ufSAqL1xyXG4gICAgb25Mb2FkOiBhcHBseVN0eWxlT25Mb2FkLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDEuMTAuMCwgdGhlIHByb3BlcnR5IG1vdmVkIHRvIGBjb21wdXRlU3R5bGVgIG1vZGlmaWVyXHJcbiAgICAgKiBAcHJvcCB7Qm9vbGVhbn0gZ3B1QWNjZWxlcmF0aW9uPXRydWVcclxuICAgICAqIElmIHRydWUsIGl0IHVzZXMgdGhlIENTUyAzZCB0cmFuc2Zvcm1hdGlvbiB0byBwb3NpdGlvbiB0aGUgcG9wcGVyLlxyXG4gICAgICogT3RoZXJ3aXNlLCBpdCB3aWxsIHVzZSB0aGUgYHRvcGAgYW5kIGBsZWZ0YCBwcm9wZXJ0aWVzLlxyXG4gICAgICovXHJcbiAgICBncHVBY2NlbGVyYXRpb246IHVuZGVmaW5lZFxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgYGRhdGFPYmplY3RgIGlzIGFuIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgaW5mb3JtYXRpb25zIHVzZWQgYnkgUG9wcGVyLmpzXHJcbiAqIHRoaXMgb2JqZWN0IGdldCBwYXNzZWQgdG8gbW9kaWZpZXJzIGFuZCB0byB0aGUgYG9uQ3JlYXRlYCBhbmQgYG9uVXBkYXRlYCBjYWxsYmFja3MuXHJcbiAqIEBuYW1lIGRhdGFPYmplY3RcclxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEuaW5zdGFuY2UgVGhlIFBvcHBlci5qcyBpbnN0YW5jZVxyXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZGF0YS5wbGFjZW1lbnQgUGxhY2VtZW50IGFwcGxpZWQgdG8gcG9wcGVyXHJcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBkYXRhLm9yaWdpbmFsUGxhY2VtZW50IFBsYWNlbWVudCBvcmlnaW5hbGx5IGRlZmluZWQgb24gaW5pdFxyXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IGRhdGEuZmxpcHBlZCBUcnVlIGlmIHBvcHBlciBoYXMgYmVlbiBmbGlwcGVkIGJ5IGZsaXAgbW9kaWZpZXJcclxuICogQHByb3BlcnR5IHtCb29sZWFufSBkYXRhLmhpZGUgVHJ1ZSBpZiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgaXMgb3V0IG9mIGJvdW5kYXJpZXMsIHVzZWZ1bCB0byBrbm93IHdoZW4gdG8gaGlkZSB0aGUgcG9wcGVyLlxyXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBkYXRhLmFycm93RWxlbWVudCBOb2RlIHVzZWQgYXMgYXJyb3cgYnkgYXJyb3cgbW9kaWZpZXJcclxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEuc3R5bGVzIEFueSBDU1MgcHJvcGVydHkgZGVmaW5lZCBoZXJlIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcG9wcGVyLCBpdCBleHBlY3RzIHRoZSBKYXZhU2NyaXB0IG5vbWVuY2xhdHVyZSAoZWcuIGBtYXJnaW5Cb3R0b21gKVxyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5hcnJvd1N0eWxlcyBBbnkgQ1NTIHByb3BlcnR5IGRlZmluZWQgaGVyZSB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlciBhcnJvdywgaXQgZXhwZWN0cyB0aGUgSmF2YVNjcmlwdCBub21lbmNsYXR1cmUgKGVnLiBgbWFyZ2luQm90dG9tYClcclxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEuYm91bmRhcmllcyBPZmZzZXRzIG9mIHRoZSBwb3BwZXIgYm91bmRhcmllc1xyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5vZmZzZXRzIFRoZSBtZWFzdXJlbWVudHMgb2YgcG9wcGVyLCByZWZlcmVuY2UgYW5kIGFycm93IGVsZW1lbnRzLlxyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5vZmZzZXRzLnBvcHBlciBgdG9wYCwgYGxlZnRgLCBgd2lkdGhgLCBgaGVpZ2h0YCB2YWx1ZXNcclxuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEub2Zmc2V0cy5yZWZlcmVuY2UgYHRvcGAsIGBsZWZ0YCwgYHdpZHRoYCwgYGhlaWdodGAgdmFsdWVzXHJcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLm9mZnNldHMuYXJyb3ddIGB0b3BgIGFuZCBgbGVmdGAgb2Zmc2V0cywgb25seSBvbmUgb2YgdGhlbSB3aWxsIGJlIGRpZmZlcmVudCBmcm9tIDBcclxuICovXHJcblxyXG4vKipcclxuICogRGVmYXVsdCBvcHRpb25zIHByb3ZpZGVkIHRvIFBvcHBlci5qcyBjb25zdHJ1Y3Rvci48YnIgLz5cclxuICogVGhlc2UgY2FuIGJlIG92ZXJyaWRlbiB1c2luZyB0aGUgYG9wdGlvbnNgIGFyZ3VtZW50IG9mIFBvcHBlci5qcy48YnIgLz5cclxuICogVG8gb3ZlcnJpZGUgYW4gb3B0aW9uLCBzaW1wbHkgcGFzcyBhcyAzcmQgYXJndW1lbnQgYW4gb2JqZWN0IHdpdGggdGhlIHNhbWVcclxuICogc3RydWN0dXJlIG9mIHRoaXMgb2JqZWN0LCBleGFtcGxlOlxyXG4gKiBgYGBcclxuICogbmV3IFBvcHBlcihyZWYsIHBvcCwge1xyXG4gKiAgIG1vZGlmaWVyczoge1xyXG4gKiAgICAgcHJldmVudE92ZXJmbG93OiB7IGVuYWJsZWQ6IGZhbHNlIH1cclxuICogICB9XHJcbiAqIH0pXHJcbiAqIGBgYFxyXG4gKiBAdHlwZSB7T2JqZWN0fVxyXG4gKiBAc3RhdGljXHJcbiAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICovXHJcbnZhciBEZWZhdWx0cyA9IHtcclxuICAvKipcclxuICAgKiBQb3BwZXIncyBwbGFjZW1lbnRcclxuICAgKiBAcHJvcCB7UG9wcGVyLnBsYWNlbWVudHN9IHBsYWNlbWVudD0nYm90dG9tJ1xyXG4gICAqL1xyXG4gIHBsYWNlbWVudDogJ2JvdHRvbScsXHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGlzIHRvIHRydWUgaWYgeW91IHdhbnQgcG9wcGVyIHRvIHBvc2l0aW9uIGl0IHNlbGYgaW4gJ2ZpeGVkJyBtb2RlXHJcbiAgICogQHByb3Age0Jvb2xlYW59IHBvc2l0aW9uRml4ZWQ9ZmFsc2VcclxuICAgKi9cclxuICBwb3NpdGlvbkZpeGVkOiBmYWxzZSxcclxuXHJcbiAgLyoqXHJcbiAgICogV2hldGhlciBldmVudHMgKHJlc2l6ZSwgc2Nyb2xsKSBhcmUgaW5pdGlhbGx5IGVuYWJsZWRcclxuICAgKiBAcHJvcCB7Qm9vbGVhbn0gZXZlbnRzRW5hYmxlZD10cnVlXHJcbiAgICovXHJcbiAgZXZlbnRzRW5hYmxlZDogdHJ1ZSxcclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IHRvIHRydWUgaWYgeW91IHdhbnQgdG8gYXV0b21hdGljYWxseSByZW1vdmUgdGhlIHBvcHBlciB3aGVuXHJcbiAgICogeW91IGNhbGwgdGhlIGBkZXN0cm95YCBtZXRob2QuXHJcbiAgICogQHByb3Age0Jvb2xlYW59IHJlbW92ZU9uRGVzdHJveT1mYWxzZVxyXG4gICAqL1xyXG4gIHJlbW92ZU9uRGVzdHJveTogZmFsc2UsXHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBwb3BwZXIgaXMgY3JlYXRlZC48YnIgLz5cclxuICAgKiBCeSBkZWZhdWx0LCBpcyBzZXQgdG8gbm8tb3AuPGJyIC8+XHJcbiAgICogQWNjZXNzIFBvcHBlci5qcyBpbnN0YW5jZSB3aXRoIGBkYXRhLmluc3RhbmNlYC5cclxuICAgKiBAcHJvcCB7b25DcmVhdGV9XHJcbiAgICovXHJcbiAgb25DcmVhdGU6IGZ1bmN0aW9uIG9uQ3JlYXRlKCkge30sXHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBwb3BwZXIgaXMgdXBkYXRlZCwgdGhpcyBjYWxsYmFjayBpcyBub3QgY2FsbGVkXHJcbiAgICogb24gdGhlIGluaXRpYWxpemF0aW9uL2NyZWF0aW9uIG9mIHRoZSBwb3BwZXIsIGJ1dCBvbmx5IG9uIHN1YnNlcXVlbnRcclxuICAgKiB1cGRhdGVzLjxiciAvPlxyXG4gICAqIEJ5IGRlZmF1bHQsIGlzIHNldCB0byBuby1vcC48YnIgLz5cclxuICAgKiBBY2Nlc3MgUG9wcGVyLmpzIGluc3RhbmNlIHdpdGggYGRhdGEuaW5zdGFuY2VgLlxyXG4gICAqIEBwcm9wIHtvblVwZGF0ZX1cclxuICAgKi9cclxuICBvblVwZGF0ZTogZnVuY3Rpb24gb25VcGRhdGUoKSB7fSxcclxuXHJcbiAgLyoqXHJcbiAgICogTGlzdCBvZiBtb2RpZmllcnMgdXNlZCB0byBtb2RpZnkgdGhlIG9mZnNldHMgYmVmb3JlIHRoZXkgYXJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlci5cclxuICAgKiBUaGV5IHByb3ZpZGUgbW9zdCBvZiB0aGUgZnVuY3Rpb25hbGl0aWVzIG9mIFBvcHBlci5qc1xyXG4gICAqIEBwcm9wIHttb2RpZmllcnN9XHJcbiAgICovXHJcbiAgbW9kaWZpZXJzOiBtb2RpZmllcnNcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAY2FsbGJhY2sgb25DcmVhdGVcclxuICogQHBhcmFtIHtkYXRhT2JqZWN0fSBkYXRhXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjYWxsYmFjayBvblVwZGF0ZVxyXG4gKiBAcGFyYW0ge2RhdGFPYmplY3R9IGRhdGFcclxuICovXHJcblxyXG4vLyBVdGlsc1xyXG4vLyBNZXRob2RzXHJcbnZhciBQb3BwZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgbmV3IFBvcHBlci5qcyBpbnN0YW5jZVxyXG4gICAqIEBjbGFzcyBQb3BwZXJcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fHJlZmVyZW5jZU9iamVjdH0gcmVmZXJlbmNlIC0gVGhlIHJlZmVyZW5jZSBlbGVtZW50IHVzZWQgdG8gcG9zaXRpb24gdGhlIHBvcHBlclxyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHBlciAtIFRoZSBIVE1MIGVsZW1lbnQgdXNlZCBhcyBwb3BwZXIuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBZb3VyIGN1c3RvbSBvcHRpb25zIHRvIG92ZXJyaWRlIHRoZSBvbmVzIGRlZmluZWQgaW4gW0RlZmF1bHRzXSgjZGVmYXVsdHMpXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBpbnN0YW5jZSAtIFRoZSBnZW5lcmF0ZWQgUG9wcGVyLmpzIGluc3RhbmNlXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gUG9wcGVyKHJlZmVyZW5jZSwgcG9wcGVyKSB7XHJcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcclxuICAgIGNsYXNzQ2FsbENoZWNrJDEodGhpcywgUG9wcGVyKTtcclxuXHJcbiAgICB0aGlzLnNjaGVkdWxlVXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKF90aGlzLnVwZGF0ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIG1ha2UgdXBkYXRlKCkgZGVib3VuY2VkLCBzbyB0aGF0IGl0IG9ubHkgcnVucyBhdCBtb3N0IG9uY2UtcGVyLXRpY2tcclxuICAgIHRoaXMudXBkYXRlID0gZGVib3VuY2UodGhpcy51cGRhdGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgLy8gd2l0aCB7fSB3ZSBjcmVhdGUgYSBuZXcgb2JqZWN0IHdpdGggdGhlIG9wdGlvbnMgaW5zaWRlIGl0XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBfZXh0ZW5kcyQxKHt9LCBQb3BwZXIuRGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cclxuICAgIC8vIGluaXQgc3RhdGVcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIGlzRGVzdHJveWVkOiBmYWxzZSxcclxuICAgICAgaXNDcmVhdGVkOiBmYWxzZSxcclxuICAgICAgc2Nyb2xsUGFyZW50czogW11cclxuICAgIH07XHJcblxyXG4gICAgLy8gZ2V0IHJlZmVyZW5jZSBhbmQgcG9wcGVyIGVsZW1lbnRzIChhbGxvdyBqUXVlcnkgd3JhcHBlcnMpXHJcbiAgICB0aGlzLnJlZmVyZW5jZSA9IHJlZmVyZW5jZSAmJiByZWZlcmVuY2UuanF1ZXJ5ID8gcmVmZXJlbmNlWzBdIDogcmVmZXJlbmNlO1xyXG4gICAgdGhpcy5wb3BwZXIgPSBwb3BwZXIgJiYgcG9wcGVyLmpxdWVyeSA/IHBvcHBlclswXSA6IHBvcHBlcjtcclxuXHJcbiAgICAvLyBEZWVwIG1lcmdlIG1vZGlmaWVycyBvcHRpb25zXHJcbiAgICB0aGlzLm9wdGlvbnMubW9kaWZpZXJzID0ge307XHJcbiAgICBPYmplY3Qua2V5cyhfZXh0ZW5kcyQxKHt9LCBQb3BwZXIuRGVmYXVsdHMubW9kaWZpZXJzLCBvcHRpb25zLm1vZGlmaWVycykpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgX3RoaXMub3B0aW9ucy5tb2RpZmllcnNbbmFtZV0gPSBfZXh0ZW5kcyQxKHt9LCBQb3BwZXIuRGVmYXVsdHMubW9kaWZpZXJzW25hbWVdIHx8IHt9LCBvcHRpb25zLm1vZGlmaWVycyA/IG9wdGlvbnMubW9kaWZpZXJzW25hbWVdIDoge30pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUmVmYWN0b3JpbmcgbW9kaWZpZXJzJyBsaXN0IChPYmplY3QgPT4gQXJyYXkpXHJcbiAgICB0aGlzLm1vZGlmaWVycyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5tb2RpZmllcnMpLm1hcChmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICByZXR1cm4gX2V4dGVuZHMkMSh7XHJcbiAgICAgICAgbmFtZTogbmFtZVxyXG4gICAgICB9LCBfdGhpcy5vcHRpb25zLm1vZGlmaWVyc1tuYW1lXSk7XHJcbiAgICB9KVxyXG4gICAgLy8gc29ydCB0aGUgbW9kaWZpZXJzIGJ5IG9yZGVyXHJcbiAgICAuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICByZXR1cm4gYS5vcmRlciAtIGIub3JkZXI7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBtb2RpZmllcnMgaGF2ZSB0aGUgYWJpbGl0eSB0byBleGVjdXRlIGFyYml0cmFyeSBjb2RlIHdoZW4gUG9wcGVyLmpzIGdldCBpbml0ZWRcclxuICAgIC8vIHN1Y2ggY29kZSBpcyBleGVjdXRlZCBpbiB0aGUgc2FtZSBvcmRlciBvZiBpdHMgbW9kaWZpZXJcclxuICAgIC8vIHRoZXkgY291bGQgYWRkIG5ldyBwcm9wZXJ0aWVzIHRvIHRoZWlyIG9wdGlvbnMgY29uZmlndXJhdGlvblxyXG4gICAgLy8gQkUgQVdBUkU6IGRvbid0IGFkZCBvcHRpb25zIHRvIGBvcHRpb25zLm1vZGlmaWVycy5uYW1lYCBidXQgdG8gYG1vZGlmaWVyT3B0aW9uc2AhXHJcbiAgICB0aGlzLm1vZGlmaWVycy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllck9wdGlvbnMpIHtcclxuICAgICAgaWYgKG1vZGlmaWVyT3B0aW9ucy5lbmFibGVkICYmIGlzRnVuY3Rpb24obW9kaWZpZXJPcHRpb25zLm9uTG9hZCkpIHtcclxuICAgICAgICBtb2RpZmllck9wdGlvbnMub25Mb2FkKF90aGlzLnJlZmVyZW5jZSwgX3RoaXMucG9wcGVyLCBfdGhpcy5vcHRpb25zLCBtb2RpZmllck9wdGlvbnMsIF90aGlzLnN0YXRlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gZmlyZSB0aGUgZmlyc3QgdXBkYXRlIHRvIHBvc2l0aW9uIHRoZSBwb3BwZXIgaW4gdGhlIHJpZ2h0IHBsYWNlXHJcbiAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgIHZhciBldmVudHNFbmFibGVkID0gdGhpcy5vcHRpb25zLmV2ZW50c0VuYWJsZWQ7XHJcbiAgICBpZiAoZXZlbnRzRW5hYmxlZCkge1xyXG4gICAgICAvLyBzZXR1cCBldmVudCBsaXN0ZW5lcnMsIHRoZXkgd2lsbCB0YWtlIGNhcmUgb2YgdXBkYXRlIHRoZSBwb3NpdGlvbiBpbiBzcGVjaWZpYyBzaXR1YXRpb25zXHJcbiAgICAgIHRoaXMuZW5hYmxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YXRlLmV2ZW50c0VuYWJsZWQgPSBldmVudHNFbmFibGVkO1xyXG4gIH1cclxuXHJcbiAgLy8gV2UgY2FuJ3QgdXNlIGNsYXNzIHByb3BlcnRpZXMgYmVjYXVzZSB0aGV5IGRvbid0IGdldCBsaXN0ZWQgaW4gdGhlXHJcbiAgLy8gY2xhc3MgcHJvdG90eXBlIGFuZCBicmVhayBzdHVmZiBsaWtlIFNpbm9uIHN0dWJzXHJcblxyXG5cclxuICBjcmVhdGVDbGFzcyQxKFBvcHBlciwgW3tcclxuICAgIGtleTogJ3VwZGF0ZScsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlJCQxKCkge1xyXG4gICAgICByZXR1cm4gdXBkYXRlLmNhbGwodGhpcyk7XHJcbiAgICB9XHJcbiAgfSwge1xyXG4gICAga2V5OiAnZGVzdHJveScsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSQkMSgpIHtcclxuICAgICAgcmV0dXJuIGRlc3Ryb3kuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuICB9LCB7XHJcbiAgICBrZXk6ICdlbmFibGVFdmVudExpc3RlbmVycycsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5hYmxlRXZlbnRMaXN0ZW5lcnMkJDEoKSB7XHJcbiAgICAgIHJldHVybiBlbmFibGVFdmVudExpc3RlbmVycy5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG4gIH0sIHtcclxuICAgIGtleTogJ2Rpc2FibGVFdmVudExpc3RlbmVycycsXHJcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzYWJsZUV2ZW50TGlzdGVuZXJzJCQxKCkge1xyXG4gICAgICByZXR1cm4gZGlzYWJsZUV2ZW50TGlzdGVuZXJzLmNhbGwodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTY2hlZHVsZSBhbiB1cGRhdGUsIGl0IHdpbGwgcnVuIG9uIHRoZSBuZXh0IFVJIHVwZGF0ZSBhdmFpbGFibGVcclxuICAgICAqIEBtZXRob2Qgc2NoZWR1bGVVcGRhdGVcclxuICAgICAqIEBtZW1iZXJvZiBQb3BwZXJcclxuICAgICAqL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29sbGVjdGlvbiBvZiB1dGlsaXRpZXMgdXNlZnVsIHdoZW4gd3JpdGluZyBjdXN0b20gbW9kaWZpZXJzLlxyXG4gICAgICogU3RhcnRpbmcgZnJvbSB2ZXJzaW9uIDEuNywgdGhpcyBtZXRob2QgaXMgYXZhaWxhYmxlIG9ubHkgaWYgeW91XHJcbiAgICAgKiBpbmNsdWRlIGBwb3BwZXItdXRpbHMuanNgIGJlZm9yZSBgcG9wcGVyLmpzYC5cclxuICAgICAqXHJcbiAgICAgKiAqKkRFUFJFQ0FUSU9OKio6IFRoaXMgd2F5IHRvIGFjY2VzcyBQb3BwZXJVdGlscyBpcyBkZXByZWNhdGVkXHJcbiAgICAgKiBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHYyISBVc2UgdGhlIFBvcHBlclV0aWxzIG1vZHVsZSBkaXJlY3RseSBpbnN0ZWFkLlxyXG4gICAgICogRHVlIHRvIHRoZSBoaWdoIGluc3RhYmlsaXR5IG9mIHRoZSBtZXRob2RzIGNvbnRhaW5lZCBpbiBVdGlscywgd2UgY2FuJ3RcclxuICAgICAqIGd1YXJhbnRlZSB0aGVtIHRvIGZvbGxvdyBzZW12ZXIuIFVzZSB0aGVtIGF0IHlvdXIgb3duIHJpc2shXHJcbiAgICAgKiBAc3RhdGljXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHR5cGUge09iamVjdH1cclxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMS44XHJcbiAgICAgKiBAbWVtYmVyIFV0aWxzXHJcbiAgICAgKiBAbWVtYmVyb2YgUG9wcGVyXHJcbiAgICAgKi9cclxuXHJcbiAgfV0pO1xyXG4gIHJldHVybiBQb3BwZXI7XHJcbn0oKTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgYHJlZmVyZW5jZU9iamVjdGAgaXMgYW4gb2JqZWN0IHRoYXQgcHJvdmlkZXMgYW4gaW50ZXJmYWNlIGNvbXBhdGlibGUgd2l0aCBQb3BwZXIuanNcclxuICogYW5kIGxldHMgeW91IHVzZSBpdCBhcyByZXBsYWNlbWVudCBvZiBhIHJlYWwgRE9NIG5vZGUuPGJyIC8+XHJcbiAqIFlvdSBjYW4gdXNlIHRoaXMgbWV0aG9kIHRvIHBvc2l0aW9uIGEgcG9wcGVyIHJlbGF0aXZlbHkgdG8gYSBzZXQgb2YgY29vcmRpbmF0ZXNcclxuICogaW4gY2FzZSB5b3UgZG9uJ3QgaGF2ZSBhIERPTSBub2RlIHRvIHVzZSBhcyByZWZlcmVuY2UuXHJcbiAqXHJcbiAqIGBgYFxyXG4gKiBuZXcgUG9wcGVyKHJlZmVyZW5jZU9iamVjdCwgcG9wcGVyTm9kZSk7XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBOQjogVGhpcyBmZWF0dXJlIGlzbid0IHN1cHBvcnRlZCBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMFxyXG4gKiBAbmFtZSByZWZlcmVuY2VPYmplY3RcclxuICogQHByb3BlcnR5IHtGdW5jdGlvbn0gZGF0YS5nZXRCb3VuZGluZ0NsaWVudFJlY3RcclxuICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzZXQgb2YgY29vcmRpbmF0ZXMgY29tcGF0aWJsZSB3aXRoIHRoZSBuYXRpdmUgYGdldEJvdW5kaW5nQ2xpZW50UmVjdGAgbWV0aG9kLlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gZGF0YS5jbGllbnRXaWR0aFxyXG4gKiBBbiBFUzYgZ2V0dGVyIHRoYXQgd2lsbCByZXR1cm4gdGhlIHdpZHRoIG9mIHRoZSB2aXJ0dWFsIHJlZmVyZW5jZSBlbGVtZW50LlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gZGF0YS5jbGllbnRIZWlnaHRcclxuICogQW4gRVM2IGdldHRlciB0aGF0IHdpbGwgcmV0dXJuIHRoZSBoZWlnaHQgb2YgdGhlIHZpcnR1YWwgcmVmZXJlbmNlIGVsZW1lbnQuXHJcbiAqL1xyXG5cclxuUG9wcGVyLlV0aWxzID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogZ2xvYmFsKS5Qb3BwZXJVdGlscztcclxuUG9wcGVyLnBsYWNlbWVudHMgPSBwbGFjZW1lbnRzO1xyXG5Qb3BwZXIuRGVmYXVsdHMgPSBEZWZhdWx0cztcclxuXHJcbi8qKlxyXG4gKiBUcmlnZ2VycyBkb2N1bWVudCByZWZsb3cuXHJcbiAqIFVzZSB2b2lkIGJlY2F1c2Ugc29tZSBtaW5pZmllcnMgb3IgZW5naW5lcyB0aGluayBzaW1wbHkgYWNjZXNzaW5nIHRoZSBwcm9wZXJ0eVxyXG4gKiBpcyB1bm5lY2Vzc2FyeS5cclxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcclxuICovXHJcbmZ1bmN0aW9uIHJlZmxvdyhwb3BwZXIpIHtcclxuICB2b2lkIHBvcHBlci5vZmZzZXRIZWlnaHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXcmFwcGVyIHV0aWwgZm9yIHBvcHBlciBwb3NpdGlvbiB1cGRhdGluZy5cclxuICogVXBkYXRlcyB0aGUgcG9wcGVyJ3MgcG9zaXRpb24gYW5kIGludm9rZXMgdGhlIGNhbGxiYWNrIG9uIHVwZGF0ZS5cclxuICogSGFja2lzaCB3b3JrYXJvdW5kIHVudGlsIFBvcHBlciAyLjAncyB1cGRhdGUoKSBiZWNvbWVzIHN5bmMuXHJcbiAqIEBwYXJhbSB7UG9wcGVyfSBwb3BwZXJJbnN0YW5jZVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjazogdG8gcnVuIG9uY2UgcG9wcGVyJ3MgcG9zaXRpb24gd2FzIHVwZGF0ZWRcclxuICogQHBhcmFtIHtCb29sZWFufSB1cGRhdGVBbHJlYWR5Q2FsbGVkOiB3YXMgc2NoZWR1bGVVcGRhdGUoKSBhbHJlYWR5IGNhbGxlZD9cclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZVBvcHBlclBvc2l0aW9uKHBvcHBlckluc3RhbmNlLCBjYWxsYmFjaywgdXBkYXRlQWxyZWFkeUNhbGxlZCkge1xyXG4gIHZhciBwb3BwZXIgPSBwb3BwZXJJbnN0YW5jZS5wb3BwZXIsXHJcbiAgICAgIG9wdGlvbnMgPSBwb3BwZXJJbnN0YW5jZS5vcHRpb25zO1xyXG5cclxuICB2YXIgb25DcmVhdGUgPSBvcHRpb25zLm9uQ3JlYXRlO1xyXG4gIHZhciBvblVwZGF0ZSA9IG9wdGlvbnMub25VcGRhdGU7XHJcblxyXG4gIG9wdGlvbnMub25DcmVhdGUgPSBvcHRpb25zLm9uVXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmVmbG93KHBvcHBlciksIGNhbGxiYWNrICYmIGNhbGxiYWNrKCksIG9uVXBkYXRlKCk7XHJcbiAgICBvcHRpb25zLm9uQ3JlYXRlID0gb25DcmVhdGU7XHJcbiAgICBvcHRpb25zLm9uVXBkYXRlID0gb25VcGRhdGU7XHJcbiAgfTtcclxuXHJcbiAgaWYgKCF1cGRhdGVBbHJlYWR5Q2FsbGVkKSB7XHJcbiAgICBwb3BwZXJJbnN0YW5jZS5zY2hlZHVsZVVwZGF0ZSgpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGNvcmUgcGxhY2VtZW50ICgndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0Jykgb2YgYSBwb3BwZXJcclxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0UG9wcGVyUGxhY2VtZW50KHBvcHBlcikge1xyXG4gIHJldHVybiBwb3BwZXIuZ2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcpLnJlcGxhY2UoLy0uKy8sICcnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIERldGVybWluZXMgaWYgdGhlIG1vdXNlJ3MgY3Vyc29yIGlzIG91dHNpZGUgdGhlIGludGVyYWN0aXZlIGJvcmRlclxyXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcG9wcGVyXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBjdXJzb3JJc091dHNpZGVJbnRlcmFjdGl2ZUJvcmRlcihldmVudCwgcG9wcGVyLCBvcHRpb25zKSB7XHJcbiAgaWYgKCFwb3BwZXIuZ2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcpKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgdmFyIHggPSBldmVudC5jbGllbnRYLFxyXG4gICAgICB5ID0gZXZlbnQuY2xpZW50WTtcclxuICB2YXIgaW50ZXJhY3RpdmVCb3JkZXIgPSBvcHRpb25zLmludGVyYWN0aXZlQm9yZGVyLFxyXG4gICAgICBkaXN0YW5jZSA9IG9wdGlvbnMuZGlzdGFuY2U7XHJcblxyXG5cclxuICB2YXIgcmVjdCA9IHBvcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICB2YXIgcGxhY2VtZW50ID0gZ2V0UG9wcGVyUGxhY2VtZW50KHBvcHBlcik7XHJcbiAgdmFyIGJvcmRlcldpdGhEaXN0YW5jZSA9IGludGVyYWN0aXZlQm9yZGVyICsgZGlzdGFuY2U7XHJcblxyXG4gIHZhciBleGNlZWRzID0ge1xyXG4gICAgdG9wOiByZWN0LnRvcCAtIHkgPiBpbnRlcmFjdGl2ZUJvcmRlcixcclxuICAgIGJvdHRvbTogeSAtIHJlY3QuYm90dG9tID4gaW50ZXJhY3RpdmVCb3JkZXIsXHJcbiAgICBsZWZ0OiByZWN0LmxlZnQgLSB4ID4gaW50ZXJhY3RpdmVCb3JkZXIsXHJcbiAgICByaWdodDogeCAtIHJlY3QucmlnaHQgPiBpbnRlcmFjdGl2ZUJvcmRlclxyXG4gIH07XHJcblxyXG4gIHN3aXRjaCAocGxhY2VtZW50KSB7XHJcbiAgICBjYXNlICd0b3AnOlxyXG4gICAgICBleGNlZWRzLnRvcCA9IHJlY3QudG9wIC0geSA+IGJvcmRlcldpdGhEaXN0YW5jZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdib3R0b20nOlxyXG4gICAgICBleGNlZWRzLmJvdHRvbSA9IHkgLSByZWN0LmJvdHRvbSA+IGJvcmRlcldpdGhEaXN0YW5jZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdsZWZ0JzpcclxuICAgICAgZXhjZWVkcy5sZWZ0ID0gcmVjdC5sZWZ0IC0geCA+IGJvcmRlcldpdGhEaXN0YW5jZTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdyaWdodCc6XHJcbiAgICAgIGV4Y2VlZHMucmlnaHQgPSB4IC0gcmVjdC5yaWdodCA+IGJvcmRlcldpdGhEaXN0YW5jZTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZXhjZWVkcy50b3AgfHwgZXhjZWVkcy5ib3R0b20gfHwgZXhjZWVkcy5sZWZ0IHx8IGV4Y2VlZHMucmlnaHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUcmFuc2Zvcm1zIHRoZSBgYXJyb3dUcmFuc2Zvcm1gIG51bWJlcnMgYmFzZWQgb24gdGhlIHBsYWNlbWVudCBheGlzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlICdzY2FsZScgb3IgJ3RyYW5zbGF0ZSdcclxuICogQHBhcmFtIHtOdW1iZXJbXX0gbnVtYmVyc1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzVmVydGljYWxcclxuICogQHBhcmFtIHtCb29sZWFufSBpc1JldmVyc2VcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gdHJhbnNmb3JtTnVtYmVyc0Jhc2VkT25QbGFjZW1lbnRBeGlzKHR5cGUsIG51bWJlcnMsIGlzVmVydGljYWwsIGlzUmV2ZXJzZSkge1xyXG4gIGlmICghbnVtYmVycy5sZW5ndGgpIHJldHVybiAnJztcclxuXHJcbiAgdmFyIHRyYW5zZm9ybXMgPSB7XHJcbiAgICBzY2FsZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAobnVtYmVycy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICByZXR1cm4gJycgKyBudW1iZXJzWzBdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBpc1ZlcnRpY2FsID8gbnVtYmVyc1swXSArICcsICcgKyBudW1iZXJzWzFdIDogbnVtYmVyc1sxXSArICcsICcgKyBudW1iZXJzWzBdO1xyXG4gICAgICB9XHJcbiAgICB9KCksXHJcbiAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKG51bWJlcnMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuIGlzUmV2ZXJzZSA/IC1udW1iZXJzWzBdICsgJ3B4JyA6IG51bWJlcnNbMF0gKyAncHgnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpc1ZlcnRpY2FsKSB7XHJcbiAgICAgICAgICByZXR1cm4gaXNSZXZlcnNlID8gbnVtYmVyc1swXSArICdweCwgJyArIC1udW1iZXJzWzFdICsgJ3B4JyA6IG51bWJlcnNbMF0gKyAncHgsICcgKyBudW1iZXJzWzFdICsgJ3B4JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGlzUmV2ZXJzZSA/IC1udW1iZXJzWzFdICsgJ3B4LCAnICsgbnVtYmVyc1swXSArICdweCcgOiBudW1iZXJzWzFdICsgJ3B4LCAnICsgbnVtYmVyc1swXSArICdweCc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KClcclxuICB9O1xyXG5cclxuICByZXR1cm4gdHJhbnNmb3Jtc1t0eXBlXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRyYW5zZm9ybXMgdGhlIGBhcnJvd1RyYW5zZm9ybWAgeCBvciB5IGF4aXMgYmFzZWQgb24gdGhlIHBsYWNlbWVudCBheGlzXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBheGlzICdYJywgJ1knLCAnJ1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzVmVydGljYWxcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gdHJhbnNmb3JtQXhpcyhheGlzLCBpc1ZlcnRpY2FsKSB7XHJcbiAgaWYgKCFheGlzKSByZXR1cm4gJyc7XHJcbiAgdmFyIG1hcCA9IHtcclxuICAgIFg6ICdZJyxcclxuICAgIFk6ICdYJ1xyXG4gIH07XHJcbiAgcmV0dXJuIGlzVmVydGljYWwgPyBheGlzIDogbWFwW2F4aXNdO1xyXG59XHJcblxyXG4vKipcclxuICogQ29tcHV0ZXMgYW5kIGFwcGxpZXMgdGhlIG5lY2Vzc2FyeSBhcnJvdyB0cmFuc2Zvcm1cclxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcclxuICogQHBhcmFtIHtFbGVtZW50fSBhcnJvd1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJyb3dUcmFuc2Zvcm1cclxuICovXHJcbmZ1bmN0aW9uIGNvbXB1dGVBcnJvd1RyYW5zZm9ybShwb3BwZXIsIGFycm93LCBhcnJvd1RyYW5zZm9ybSkge1xyXG4gIHZhciBwbGFjZW1lbnQgPSBnZXRQb3BwZXJQbGFjZW1lbnQocG9wcGVyKTtcclxuICB2YXIgaXNWZXJ0aWNhbCA9IHBsYWNlbWVudCA9PT0gJ3RvcCcgfHwgcGxhY2VtZW50ID09PSAnYm90dG9tJztcclxuICB2YXIgaXNSZXZlcnNlID0gcGxhY2VtZW50ID09PSAncmlnaHQnIHx8IHBsYWNlbWVudCA9PT0gJ2JvdHRvbSc7XHJcblxyXG4gIHZhciBnZXRBeGlzID0gZnVuY3Rpb24gZ2V0QXhpcyhyZSkge1xyXG4gICAgdmFyIG1hdGNoID0gYXJyb3dUcmFuc2Zvcm0ubWF0Y2gocmUpO1xyXG4gICAgcmV0dXJuIG1hdGNoID8gbWF0Y2hbMV0gOiAnJztcclxuICB9O1xyXG5cclxuICB2YXIgZ2V0TnVtYmVycyA9IGZ1bmN0aW9uIGdldE51bWJlcnMocmUpIHtcclxuICAgIHZhciBtYXRjaCA9IGFycm93VHJhbnNmb3JtLm1hdGNoKHJlKTtcclxuICAgIHJldHVybiBtYXRjaCA/IG1hdGNoWzFdLnNwbGl0KCcsJykubWFwKHBhcnNlRmxvYXQpIDogW107XHJcbiAgfTtcclxuXHJcbiAgdmFyIHJlID0ge1xyXG4gICAgdHJhbnNsYXRlOiAvdHJhbnNsYXRlWD9ZP1xcKChbXildKylcXCkvLFxyXG4gICAgc2NhbGU6IC9zY2FsZVg/WT9cXCgoW14pXSspXFwpL1xyXG4gIH07XHJcblxyXG4gIHZhciBtYXRjaGVzID0ge1xyXG4gICAgdHJhbnNsYXRlOiB7XHJcbiAgICAgIGF4aXM6IGdldEF4aXMoL3RyYW5zbGF0ZShbWFldKS8pLFxyXG4gICAgICBudW1iZXJzOiBnZXROdW1iZXJzKHJlLnRyYW5zbGF0ZSlcclxuICAgIH0sXHJcbiAgICBzY2FsZToge1xyXG4gICAgICBheGlzOiBnZXRBeGlzKC9zY2FsZShbWFldKS8pLFxyXG4gICAgICBudW1iZXJzOiBnZXROdW1iZXJzKHJlLnNjYWxlKVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBjb21wdXRlZFRyYW5zZm9ybSA9IGFycm93VHJhbnNmb3JtLnJlcGxhY2UocmUudHJhbnNsYXRlLCAndHJhbnNsYXRlJyArIHRyYW5zZm9ybUF4aXMobWF0Y2hlcy50cmFuc2xhdGUuYXhpcywgaXNWZXJ0aWNhbCkgKyAnKCcgKyB0cmFuc2Zvcm1OdW1iZXJzQmFzZWRPblBsYWNlbWVudEF4aXMoJ3RyYW5zbGF0ZScsIG1hdGNoZXMudHJhbnNsYXRlLm51bWJlcnMsIGlzVmVydGljYWwsIGlzUmV2ZXJzZSkgKyAnKScpLnJlcGxhY2UocmUuc2NhbGUsICdzY2FsZScgKyB0cmFuc2Zvcm1BeGlzKG1hdGNoZXMuc2NhbGUuYXhpcywgaXNWZXJ0aWNhbCkgKyAnKCcgKyB0cmFuc2Zvcm1OdW1iZXJzQmFzZWRPblBsYWNlbWVudEF4aXMoJ3NjYWxlJywgbWF0Y2hlcy5zY2FsZS5udW1iZXJzLCBpc1ZlcnRpY2FsLCBpc1JldmVyc2UpICsgJyknKTtcclxuXHJcbiAgYXJyb3cuc3R5bGVbcHJlZml4KCd0cmFuc2Zvcm0nKV0gPSBjb21wdXRlZFRyYW5zZm9ybTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGRpc3RhbmNlIHRha2luZyBpbnRvIGFjY291bnQgdGhlIGRlZmF1bHQgZGlzdGFuY2UgZHVlIHRvXHJcbiAqIHRoZSB0cmFuc2Zvcm06IHRyYW5zbGF0ZSBzZXR0aW5nIGluIENTU1xyXG4gKiBAcGFyYW0ge051bWJlcn0gZGlzdGFuY2VcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0T2Zmc2V0RGlzdGFuY2VJblB4KGRpc3RhbmNlKSB7XHJcbiAgcmV0dXJuIC0oZGlzdGFuY2UgLSBkZWZhdWx0cy5kaXN0YW5jZSkgKyAncHgnO1xyXG59XHJcblxyXG4vKipcclxuICogV2FpdHMgdW50aWwgbmV4dCByZXBhaW50IHRvIGV4ZWN1dGUgYSBmblxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKi9cclxuZnVuY3Rpb24gZGVmZXIoZm4pIHtcclxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xyXG4gICAgc2V0VGltZW91dChmbiwgMSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbnZhciBtYXRjaGVzID0ge307XHJcblxyXG5pZiAoaXNCcm93c2VyKSB7XHJcbiAgdmFyIGUgPSBFbGVtZW50LnByb3RvdHlwZTtcclxuICBtYXRjaGVzID0gZS5tYXRjaGVzIHx8IGUubWF0Y2hlc1NlbGVjdG9yIHx8IGUud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGUubW96TWF0Y2hlc1NlbGVjdG9yIHx8IGUubXNNYXRjaGVzU2VsZWN0b3IgfHwgZnVuY3Rpb24gKHMpIHtcclxuICAgIHZhciBtYXRjaGVzID0gKHRoaXMuZG9jdW1lbnQgfHwgdGhpcy5vd25lckRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHMpO1xyXG4gICAgdmFyIGkgPSBtYXRjaGVzLmxlbmd0aDtcclxuICAgIHdoaWxlICgtLWkgPj0gMCAmJiBtYXRjaGVzLml0ZW0oaSkgIT09IHRoaXMpIHt9IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tZW1wdHlcclxuICAgIHJldHVybiBpID4gLTE7XHJcbiAgfTtcclxufVxyXG5cclxudmFyIG1hdGNoZXMkMSA9IG1hdGNoZXM7XHJcblxyXG4vKipcclxuICogUG9ueWZpbGwgdG8gZ2V0IHRoZSBjbG9zZXN0IHBhcmVudCBlbGVtZW50XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCAtIGNoaWxkIG9mIHBhcmVudCB0byBiZSByZXR1cm5lZFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFyZW50U2VsZWN0b3IgLSBzZWxlY3RvciB0byBtYXRjaCB0aGUgcGFyZW50IGlmIGZvdW5kXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9zZXN0KGVsZW1lbnQsIHBhcmVudFNlbGVjdG9yKSB7XHJcbiAgdmFyIGZuID0gRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCB8fCBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgIHZhciBlbCA9IHRoaXM7XHJcbiAgICB3aGlsZSAoZWwpIHtcclxuICAgICAgaWYgKG1hdGNoZXMkMS5jYWxsKGVsLCBzZWxlY3RvcikpIHtcclxuICAgICAgICByZXR1cm4gZWw7XHJcbiAgICAgIH1cclxuICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiBmbi5jYWxsKGVsZW1lbnQsIHBhcmVudFNlbGVjdG9yKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHZhbHVlIHRha2luZyBpbnRvIGFjY291bnQgdGhlIHZhbHVlIGJlaW5nIGVpdGhlciBhIG51bWJlciBvciBhcnJheVxyXG4gKiBAcGFyYW0ge051bWJlcnxBcnJheX0gdmFsdWVcclxuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XHJcbiAqIEByZXR1cm4ge051bWJlcn1cclxuICovXHJcbmZ1bmN0aW9uIGdldFZhbHVlKHZhbHVlLCBpbmRleCkge1xyXG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlW2luZGV4XSA6IHZhbHVlO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0cyB0aGUgdmlzaWJpbGl0eSBzdGF0ZSBvZiBhbiBlbGVtZW50IGZvciB0cmFuc2l0aW9uIHRvIGJlZ2luXHJcbiAqIEBwYXJhbSB7RWxlbWVudFtdfSBlbHMgLSBhcnJheSBvZiBlbGVtZW50c1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtICd2aXNpYmxlJyBvciAnaGlkZGVuJ1xyXG4gKi9cclxuZnVuY3Rpb24gc2V0VmlzaWJpbGl0eVN0YXRlKGVscywgdHlwZSkge1xyXG4gIGVscy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgaWYgKCFlbCkgcmV0dXJuO1xyXG4gICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXN0YXRlJywgdHlwZSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXRzIHRoZSB0cmFuc2l0aW9uIHByb3BlcnR5IHRvIGVhY2ggZWxlbWVudFxyXG4gKiBAcGFyYW0ge0VsZW1lbnRbXX0gZWxzIC0gQXJyYXkgb2YgZWxlbWVudHNcclxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXHJcbiAqL1xyXG5mdW5jdGlvbiBhcHBseVRyYW5zaXRpb25EdXJhdGlvbihlbHMsIHZhbHVlKSB7XHJcbiAgZWxzLmZpbHRlcihCb29sZWFuKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgZWwuc3R5bGVbcHJlZml4KCd0cmFuc2l0aW9uRHVyYXRpb24nKV0gPSB2YWx1ZSArICdtcyc7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGb2N1c2VzIGFuIGVsZW1lbnQgd2hpbGUgcHJldmVudGluZyBhIHNjcm9sbCBqdW1wIGlmIGl0J3Mgbm90IGVudGlyZWx5IHdpdGhpbiB0aGUgdmlld3BvcnRcclxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxyXG4gKi9cclxuZnVuY3Rpb24gZm9jdXMoZWwpIHtcclxuICB2YXIgeCA9IHdpbmRvdy5zY3JvbGxYIHx8IHdpbmRvdy5wYWdlWE9mZnNldDtcclxuICB2YXIgeSA9IHdpbmRvdy5zY3JvbGxZIHx8IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuICBlbC5mb2N1cygpO1xyXG4gIHNjcm9sbCh4LCB5KTtcclxufVxyXG5cclxudmFyIGtleSA9IHt9O1xyXG52YXIgc3RvcmUgPSBmdW5jdGlvbiBzdG9yZShkYXRhKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChrKSB7XHJcbiAgICByZXR1cm4gayA9PT0ga2V5ICYmIGRhdGE7XHJcbiAgfTtcclxufTtcclxuXHJcbnZhciBUaXBweSA9IGZ1bmN0aW9uICgpIHtcclxuICBmdW5jdGlvbiBUaXBweShjb25maWcpIHtcclxuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFRpcHB5KTtcclxuXHJcbiAgICBmb3IgKHZhciBfa2V5IGluIGNvbmZpZykge1xyXG4gICAgICB0aGlzW19rZXldID0gY29uZmlnW19rZXldO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIGRlc3Ryb3llZDogZmFsc2UsXHJcbiAgICAgIHZpc2libGU6IGZhbHNlLFxyXG4gICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuXyA9IHN0b3JlKHtcclxuICAgICAgbXV0YXRpb25PYnNlcnZlcnM6IFtdXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuYWJsZXMgdGhlIHRvb2x0aXAgdG8gYWxsb3cgaXQgdG8gc2hvdyBvciBoaWRlXHJcbiAgICogQG1lbWJlcm9mIFRpcHB5XHJcbiAgICogQHB1YmxpY1xyXG4gICAqL1xyXG5cclxuXHJcbiAgY3JlYXRlQ2xhc3MoVGlwcHksIFt7XHJcbiAgICBrZXk6ICdlbmFibGUnLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVuYWJsZSgpIHtcclxuICAgICAgdGhpcy5zdGF0ZS5lbmFibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc2FibGVzIHRoZSB0b29sdGlwIGZyb20gc2hvd2luZyBvciBoaWRpbmcsIGJ1dCBkb2VzIG5vdCBkZXN0cm95IGl0XHJcbiAgICAgKiBAbWVtYmVyb2YgVGlwcHlcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqL1xyXG5cclxuICB9LCB7XHJcbiAgICBrZXk6ICdkaXNhYmxlJyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlKCkge1xyXG4gICAgICB0aGlzLnN0YXRlLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3dzIHRoZSB0b29sdGlwXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzXHJcbiAgICAgKiBAbWVtYmVyb2YgVGlwcHlcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqL1xyXG5cclxuICB9LCB7XHJcbiAgICBrZXk6ICdzaG93JyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBzaG93KGR1cmF0aW9uKSB7XHJcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAodGhpcy5zdGF0ZS5kZXN0cm95ZWQgfHwgIXRoaXMuc3RhdGUuZW5hYmxlZCkgcmV0dXJuO1xyXG5cclxuICAgICAgdmFyIHBvcHBlciA9IHRoaXMucG9wcGVyLFxyXG4gICAgICAgICAgcmVmZXJlbmNlID0gdGhpcy5yZWZlcmVuY2UsXHJcbiAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICAgICAgdmFyIF9nZXRJbm5lckVsZW1lbnRzID0gZ2V0SW5uZXJFbGVtZW50cyhwb3BwZXIpLFxyXG4gICAgICAgICAgdG9vbHRpcCA9IF9nZXRJbm5lckVsZW1lbnRzLnRvb2x0aXAsXHJcbiAgICAgICAgICBiYWNrZHJvcCA9IF9nZXRJbm5lckVsZW1lbnRzLmJhY2tkcm9wLFxyXG4gICAgICAgICAgY29udGVudCA9IF9nZXRJbm5lckVsZW1lbnRzLmNvbnRlbnQ7XHJcblxyXG4gICAgICAvLyBJZiB0aGUgYGR5bmFtaWNUaXRsZWAgb3B0aW9uIGlzIHRydWUsIHRoZSBpbnN0YW5jZSBpcyBhbGxvd2VkXHJcbiAgICAgIC8vIHRvIGJlIGNyZWF0ZWQgd2l0aCBhbiBlbXB0eSB0aXRsZS4gTWFrZSBzdXJlIHRoYXQgdGhlIHRvb2x0aXBcclxuICAgICAgLy8gY29udGVudCBpcyBub3QgZW1wdHkgYmVmb3JlIHNob3dpbmcgaXRcclxuXHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5keW5hbWljVGl0bGUgJiYgIXJlZmVyZW5jZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRG8gbm90IHNob3cgdG9vbHRpcCBpZiByZWZlcmVuY2UgY29udGFpbnMgJ2Rpc2FibGVkJyBhdHRyaWJ1dGUuIEZGIGZpeCBmb3IgIzIyMVxyXG4gICAgICBpZiAocmVmZXJlbmNlLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkgcmV0dXJuO1xyXG5cclxuICAgICAgLy8gRGVzdHJveSB0b29sdGlwIGlmIHRoZSByZWZlcmVuY2UgZWxlbWVudCBpcyBubyBsb25nZXIgb24gdGhlIERPTVxyXG4gICAgICBpZiAoIXJlZmVyZW5jZS5yZWZPYmogJiYgIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jb250YWlucyhyZWZlcmVuY2UpKSB7XHJcbiAgICAgICAgdGhpcy5kZXN0cm95KCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvcHRpb25zLm9uU2hvdy5jYWxsKHBvcHBlciwgdGhpcyk7XHJcblxyXG4gICAgICBkdXJhdGlvbiA9IGdldFZhbHVlKGR1cmF0aW9uICE9PSB1bmRlZmluZWQgPyBkdXJhdGlvbiA6IG9wdGlvbnMuZHVyYXRpb24sIDApO1xyXG5cclxuICAgICAgLy8gUHJldmVudCBhIHRyYW5zaXRpb24gd2hlbiBwb3BwZXIgY2hhbmdlcyBwb3NpdGlvblxyXG4gICAgICBhcHBseVRyYW5zaXRpb25EdXJhdGlvbihbcG9wcGVyLCB0b29sdGlwLCBiYWNrZHJvcF0sIDApO1xyXG5cclxuICAgICAgcG9wcGVyLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XHJcbiAgICAgIHRoaXMuc3RhdGUudmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgICBfbW91bnQuY2FsbCh0aGlzLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCFfdGhpcy5zdGF0ZS52aXNpYmxlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICghX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yLmNhbGwoX3RoaXMpKSB7XHJcbiAgICAgICAgICAvLyBGSVg6IEFycm93IHdpbGwgc29tZXRpbWVzIG5vdCBiZSBwb3NpdGlvbmVkIGNvcnJlY3RseS4gRm9yY2UgYW5vdGhlciB1cGRhdGUuXHJcbiAgICAgICAgICBfdGhpcy5wb3BwZXJJbnN0YW5jZS5zY2hlZHVsZVVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2V0IGluaXRpYWwgcG9zaXRpb24gbmVhciB0aGUgY3Vyc29yXHJcbiAgICAgICAgaWYgKF9oYXNGb2xsb3dDdXJzb3JCZWhhdmlvci5jYWxsKF90aGlzKSkge1xyXG4gICAgICAgICAgX3RoaXMucG9wcGVySW5zdGFuY2UuZGlzYWJsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICB2YXIgZGVsYXkgPSBnZXRWYWx1ZShvcHRpb25zLmRlbGF5LCAwKTtcclxuICAgICAgICAgIHZhciBsYXN0VHJpZ2dlckV2ZW50ID0gX3RoaXMuXyhrZXkpLmxhc3RUcmlnZ2VyRXZlbnQ7XHJcbiAgICAgICAgICBpZiAobGFzdFRyaWdnZXJFdmVudCkge1xyXG4gICAgICAgICAgICBfdGhpcy5fKGtleSkuZm9sbG93Q3Vyc29yTGlzdGVuZXIoZGVsYXkgJiYgX3RoaXMuXyhrZXkpLmxhc3RNb3VzZU1vdmVFdmVudCA/IF90aGlzLl8oa2V5KS5sYXN0TW91c2VNb3ZlRXZlbnQgOiBsYXN0VHJpZ2dlckV2ZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlLWFwcGx5IHRyYW5zaXRpb24gZHVyYXRpb25zXHJcbiAgICAgICAgYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24oW3Rvb2x0aXAsIGJhY2tkcm9wLCBiYWNrZHJvcCA/IGNvbnRlbnQgOiBudWxsXSwgZHVyYXRpb24pO1xyXG5cclxuICAgICAgICBpZiAoYmFja2Ryb3ApIHtcclxuICAgICAgICAgIGdldENvbXB1dGVkU3R5bGUoYmFja2Ryb3ApW3ByZWZpeCgndHJhbnNmb3JtJyldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcclxuICAgICAgICAgIHJlZmVyZW5jZS5jbGFzc0xpc3QuYWRkKCd0aXBweS1hY3RpdmUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvcHRpb25zLnN0aWNreSkge1xyXG4gICAgICAgICAgX21ha2VTdGlja3kuY2FsbChfdGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRWaXNpYmlsaXR5U3RhdGUoW3Rvb2x0aXAsIGJhY2tkcm9wXSwgJ3Zpc2libGUnKTtcclxuXHJcbiAgICAgICAgX29uVHJhbnNpdGlvbkVuZC5jYWxsKF90aGlzLCBkdXJhdGlvbiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgaWYgKCFvcHRpb25zLnVwZGF0ZUR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LmFkZCgndGlwcHktbm90cmFuc2l0aW9uJyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKG9wdGlvbnMuaW50ZXJhY3RpdmUpIHtcclxuICAgICAgICAgICAgZm9jdXMocG9wcGVyKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZWZlcmVuY2Uuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgJ3RpcHB5LScgKyBfdGhpcy5pZCk7XHJcblxyXG4gICAgICAgICAgb3B0aW9ucy5vblNob3duLmNhbGwocG9wcGVyLCBfdGhpcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGlkZXMgdGhlIHRvb2x0aXBcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHNcclxuICAgICAqIEBtZW1iZXJvZiBUaXBweVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICovXHJcblxyXG4gIH0sIHtcclxuICAgIGtleTogJ2hpZGUnLFxyXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhpZGUoZHVyYXRpb24pIHtcclxuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XHJcblxyXG4gICAgICBpZiAodGhpcy5zdGF0ZS5kZXN0cm95ZWQgfHwgIXRoaXMuc3RhdGUuZW5hYmxlZCkgcmV0dXJuO1xyXG5cclxuICAgICAgdmFyIHBvcHBlciA9IHRoaXMucG9wcGVyLFxyXG4gICAgICAgICAgcmVmZXJlbmNlID0gdGhpcy5yZWZlcmVuY2UsXHJcbiAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICAgICAgdmFyIF9nZXRJbm5lckVsZW1lbnRzMiA9IGdldElubmVyRWxlbWVudHMocG9wcGVyKSxcclxuICAgICAgICAgIHRvb2x0aXAgPSBfZ2V0SW5uZXJFbGVtZW50czIudG9vbHRpcCxcclxuICAgICAgICAgIGJhY2tkcm9wID0gX2dldElubmVyRWxlbWVudHMyLmJhY2tkcm9wLFxyXG4gICAgICAgICAgY29udGVudCA9IF9nZXRJbm5lckVsZW1lbnRzMi5jb250ZW50O1xyXG5cclxuICAgICAgb3B0aW9ucy5vbkhpZGUuY2FsbChwb3BwZXIsIHRoaXMpO1xyXG5cclxuICAgICAgZHVyYXRpb24gPSBnZXRWYWx1ZShkdXJhdGlvbiAhPT0gdW5kZWZpbmVkID8gZHVyYXRpb24gOiBvcHRpb25zLmR1cmF0aW9uLCAxKTtcclxuXHJcbiAgICAgIGlmICghb3B0aW9ucy51cGRhdGVEdXJhdGlvbikge1xyXG4gICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgndGlwcHktbm90cmFuc2l0aW9uJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICAgICAgcmVmZXJlbmNlLmNsYXNzTGlzdC5yZW1vdmUoJ3RpcHB5LWFjdGl2ZScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBwb3BwZXIuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICB0aGlzLnN0YXRlLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICAgIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uKFt0b29sdGlwLCBiYWNrZHJvcCwgYmFja2Ryb3AgPyBjb250ZW50IDogbnVsbF0sIGR1cmF0aW9uKTtcclxuXHJcbiAgICAgIHNldFZpc2liaWxpdHlTdGF0ZShbdG9vbHRpcCwgYmFja2Ryb3BdLCAnaGlkZGVuJyk7XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5pbnRlcmFjdGl2ZSAmJiBvcHRpb25zLnRyaWdnZXIuaW5kZXhPZignY2xpY2snKSA+IC0xKSB7XHJcbiAgICAgICAgZm9jdXMocmVmZXJlbmNlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLypcclxuICAgICAgKiBUaGlzIGNhbGwgaXMgZGVmZXJyZWQgYmVjYXVzZSBzb21ldGltZXMgd2hlbiB0aGUgdG9vbHRpcCBpcyBzdGlsbCB0cmFuc2l0aW9uaW5nIGluIGJ1dCBoaWRlKClcclxuICAgICAgKiBpcyBjYWxsZWQgYmVmb3JlIGl0IGZpbmlzaGVzLCB0aGUgQ1NTIHRyYW5zaXRpb24gd29uJ3QgcmV2ZXJzZSBxdWlja2x5IGVub3VnaCwgbWVhbmluZ1xyXG4gICAgICAqIHRoZSBDU1MgdHJhbnNpdGlvbiB3aWxsIGZpbmlzaCAxLTIgZnJhbWVzIGxhdGVyLCBhbmQgb25IaWRkZW4oKSB3aWxsIHJ1biBzaW5jZSB0aGUgSlMgc2V0IGl0XHJcbiAgICAgICogbW9yZSBxdWlja2x5LiBJdCBzaG91bGQgYWN0dWFsbHkgYmUgb25TaG93bigpLiBTZWVtcyB0byBiZSBzb21ldGhpbmcgQ2hyb21lIGRvZXMsIG5vdCBTYWZhcmlcclxuICAgICAgKi9cclxuICAgICAgZGVmZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9vblRyYW5zaXRpb25FbmQuY2FsbChfdGhpczIsIGR1cmF0aW9uLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoX3RoaXMyLnN0YXRlLnZpc2libGUgfHwgIW9wdGlvbnMuYXBwZW5kVG8uY29udGFpbnMocG9wcGVyKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgIGlmICghX3RoaXMyLl8oa2V5KS5pc1ByZXBhcmluZ1RvU2hvdykge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfdGhpczIuXyhrZXkpLmZvbGxvd0N1cnNvckxpc3RlbmVyKTtcclxuICAgICAgICAgICAgX3RoaXMyLl8oa2V5KS5sYXN0TW91c2VNb3ZlRXZlbnQgPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChfdGhpczIucG9wcGVySW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgX3RoaXMyLnBvcHBlckluc3RhbmNlLmRpc2FibGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJlZmVyZW5jZS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuXHJcbiAgICAgICAgICBvcHRpb25zLmFwcGVuZFRvLnJlbW92ZUNoaWxkKHBvcHBlcik7XHJcblxyXG4gICAgICAgICAgb3B0aW9ucy5vbkhpZGRlbi5jYWxsKHBvcHBlciwgX3RoaXMyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXN0cm95cyB0aGUgdG9vbHRpcCBpbnN0YW5jZVxyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBkZXN0cm95VGFyZ2V0SW5zdGFuY2VzIC0gcmVsZXZhbnQgb25seSB3aGVuIGRlc3Ryb3lpbmcgZGVsZWdhdGVzXHJcbiAgICAgKiBAbWVtYmVyb2YgVGlwcHlcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqL1xyXG5cclxuICB9LCB7XHJcbiAgICBrZXk6ICdkZXN0cm95JyxcclxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcclxuXHJcbiAgICAgIHZhciBkZXN0cm95VGFyZ2V0SW5zdGFuY2VzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB0cnVlO1xyXG5cclxuICAgICAgaWYgKHRoaXMuc3RhdGUuZGVzdHJveWVkKSByZXR1cm47XHJcblxyXG4gICAgICAvLyBFbnN1cmUgdGhlIHBvcHBlciBpcyBoaWRkZW5cclxuICAgICAgaWYgKHRoaXMuc3RhdGUudmlzaWJsZSkge1xyXG4gICAgICAgIHRoaXMuaGlkZSgwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcclxuICAgICAgICBfdGhpczMucmVmZXJlbmNlLnJlbW92ZUV2ZW50TGlzdGVuZXIobGlzdGVuZXIuZXZlbnQsIGxpc3RlbmVyLmhhbmRsZXIpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIFJlc3RvcmUgdGl0bGVcclxuICAgICAgaWYgKHRoaXMudGl0bGUpIHtcclxuICAgICAgICB0aGlzLnJlZmVyZW5jZS5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgdGhpcy50aXRsZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRlbGV0ZSB0aGlzLnJlZmVyZW5jZS5fdGlwcHk7XHJcblxyXG4gICAgICB2YXIgYXR0cmlidXRlcyA9IFsnZGF0YS1vcmlnaW5hbC10aXRsZScsICdkYXRhLXRpcHB5JywgJ2RhdGEtdGlwcHktZGVsZWdhdGUnXTtcclxuICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XHJcbiAgICAgICAgX3RoaXMzLnJlZmVyZW5jZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy50YXJnZXQgJiYgZGVzdHJveVRhcmdldEluc3RhbmNlcykge1xyXG4gICAgICAgIHRvQXJyYXkodGhpcy5yZWZlcmVuY2UucXVlcnlTZWxlY3RvckFsbCh0aGlzLm9wdGlvbnMudGFyZ2V0KSkuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcclxuICAgICAgICAgIHJldHVybiBjaGlsZC5fdGlwcHkgJiYgY2hpbGQuX3RpcHB5LmRlc3Ryb3koKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMucG9wcGVySW5zdGFuY2UpIHtcclxuICAgICAgICB0aGlzLnBvcHBlckluc3RhbmNlLmRlc3Ryb3koKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fKGtleSkubXV0YXRpb25PYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcclxuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5zdGF0ZS5kZXN0cm95ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1dKTtcclxuICByZXR1cm4gVGlwcHk7XHJcbn0oKTtcclxuXHJcbi8qKlxyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogUHJpdmF0ZSBtZXRob2RzXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiBTdGFuZGFsb25lIGZ1bmN0aW9ucyB0byBiZSBjYWxsZWQgd2l0aCB0aGUgaW5zdGFuY2UncyBgdGhpc2AgY29udGV4dCB0byBtYWtlXHJcbiAqIHRoZW0gdHJ1bHkgcHJpdmF0ZSBhbmQgbm90IGFjY2Vzc2libGUgb24gdGhlIHByb3RvdHlwZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSB0b29sdGlwIGluc3RhbmNlIGhhcyBmb2xsb3dDdXJzb3IgYmVoYXZpb3JcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfaGFzRm9sbG93Q3Vyc29yQmVoYXZpb3IoKSB7XHJcbiAgdmFyIGxhc3RUcmlnZ2VyRXZlbnQgPSB0aGlzLl8oa2V5KS5sYXN0VHJpZ2dlckV2ZW50O1xyXG4gIHJldHVybiB0aGlzLm9wdGlvbnMuZm9sbG93Q3Vyc29yICYmICFicm93c2VyLnVzaW5nVG91Y2ggJiYgbGFzdFRyaWdnZXJFdmVudCAmJiBsYXN0VHJpZ2dlckV2ZW50LnR5cGUgIT09ICdmb2N1cyc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIHRoZSBUaXBweSBpbnN0YW5jZSBmb3IgdGhlIGNoaWxkIHRhcmdldCBvZiB0aGUgZGVsZWdhdGUgY29udGFpbmVyXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2NyZWF0ZURlbGVnYXRlQ2hpbGRUaXBweShldmVudCkge1xyXG4gIHZhciB0YXJnZXRFbCA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCB0aGlzLm9wdGlvbnMudGFyZ2V0KTtcclxuICBpZiAodGFyZ2V0RWwgJiYgIXRhcmdldEVsLl90aXBweSkge1xyXG4gICAgdmFyIHRpdGxlID0gdGFyZ2V0RWwuZ2V0QXR0cmlidXRlKCd0aXRsZScpIHx8IHRoaXMudGl0bGU7XHJcbiAgICBpZiAodGl0bGUpIHtcclxuICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCd0aXRsZScsIHRpdGxlKTtcclxuICAgICAgdGlwcHkkMSh0YXJnZXRFbCwgX2V4dGVuZHMoe30sIHRoaXMub3B0aW9ucywgeyB0YXJnZXQ6IG51bGwgfSkpO1xyXG4gICAgICBfZW50ZXIuY2FsbCh0YXJnZXRFbC5fdGlwcHksIGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNZXRob2QgdXNlZCBieSBldmVudCBsaXN0ZW5lcnMgdG8gaW52b2tlIHRoZSBzaG93IG1ldGhvZCwgdGFraW5nIGludG8gYWNjb3VudCBkZWxheXMgYW5kXHJcbiAqIHRoZSBgd2FpdGAgb3B0aW9uXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2VudGVyKGV2ZW50KSB7XHJcbiAgdmFyIF90aGlzNCA9IHRoaXM7XHJcblxyXG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuXHJcbiAgX2NsZWFyRGVsYXlUaW1lb3V0cy5jYWxsKHRoaXMpO1xyXG5cclxuICBpZiAodGhpcy5zdGF0ZS52aXNpYmxlKSByZXR1cm47XHJcblxyXG4gIC8vIElzIGEgZGVsZWdhdGUsIGNyZWF0ZSBUaXBweSBpbnN0YW5jZSBmb3IgdGhlIGNoaWxkIHRhcmdldFxyXG4gIGlmIChvcHRpb25zLnRhcmdldCkge1xyXG4gICAgX2NyZWF0ZURlbGVnYXRlQ2hpbGRUaXBweS5jYWxsKHRoaXMsIGV2ZW50KTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHRoaXMuXyhrZXkpLmlzUHJlcGFyaW5nVG9TaG93ID0gdHJ1ZTtcclxuXHJcbiAgaWYgKG9wdGlvbnMud2FpdCkge1xyXG4gICAgb3B0aW9ucy53YWl0LmNhbGwodGhpcy5wb3BwZXIsIHRoaXMuc2hvdy5iaW5kKHRoaXMpLCBldmVudCk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGUgdG9vbHRpcCBoYXMgYSBkZWxheSwgd2UgbmVlZCB0byBiZSBsaXN0ZW5pbmcgdG8gdGhlIG1vdXNlbW92ZSBhcyBzb29uIGFzIHRoZSB0cmlnZ2VyXHJcbiAgLy8gZXZlbnQgaXMgZmlyZWQgc28gdGhhdCBpdCdzIGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uIHVwb24gbW91bnQuXHJcbiAgaWYgKF9oYXNGb2xsb3dDdXJzb3JCZWhhdmlvci5jYWxsKHRoaXMpKSB7XHJcbiAgICBpZiAoIXRoaXMuXyhrZXkpLmZvbGxvd0N1cnNvckxpc3RlbmVyKSB7XHJcbiAgICAgIF9zZXRGb2xsb3dDdXJzb3JMaXN0ZW5lci5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBfZ2V0SW5uZXJFbGVtZW50czMgPSBnZXRJbm5lckVsZW1lbnRzKHRoaXMucG9wcGVyKSxcclxuICAgICAgICBhcnJvdyA9IF9nZXRJbm5lckVsZW1lbnRzMy5hcnJvdztcclxuXHJcbiAgICBpZiAoYXJyb3cpIGFycm93LnN0eWxlLm1hcmdpbiA9ICcwJztcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuXyhrZXkpLmZvbGxvd0N1cnNvckxpc3RlbmVyKTtcclxuICB9XHJcblxyXG4gIHZhciBkZWxheSA9IGdldFZhbHVlKG9wdGlvbnMuZGVsYXksIDApO1xyXG5cclxuICBpZiAoZGVsYXkpIHtcclxuICAgIHRoaXMuXyhrZXkpLnNob3dUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIF90aGlzNC5zaG93KCk7XHJcbiAgICB9LCBkZWxheSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMuc2hvdygpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIE1ldGhvZCB1c2VkIGJ5IGV2ZW50IGxpc3RlbmVycyB0byBpbnZva2UgdGhlIGhpZGUgbWV0aG9kLCB0YWtpbmcgaW50byBhY2NvdW50IGRlbGF5c1xyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9sZWF2ZSgpIHtcclxuICB2YXIgX3RoaXM1ID0gdGhpcztcclxuXHJcbiAgX2NsZWFyRGVsYXlUaW1lb3V0cy5jYWxsKHRoaXMpO1xyXG5cclxuICBpZiAoIXRoaXMuc3RhdGUudmlzaWJsZSkgcmV0dXJuO1xyXG5cclxuICB0aGlzLl8oa2V5KS5pc1ByZXBhcmluZ1RvU2hvdyA9IGZhbHNlO1xyXG5cclxuICB2YXIgZGVsYXkgPSBnZXRWYWx1ZSh0aGlzLm9wdGlvbnMuZGVsYXksIDEpO1xyXG5cclxuICBpZiAoZGVsYXkpIHtcclxuICAgIHRoaXMuXyhrZXkpLmhpZGVUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChfdGhpczUuc3RhdGUudmlzaWJsZSkge1xyXG4gICAgICAgIF90aGlzNS5oaWRlKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIGRlbGF5KTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhpcy5oaWRlKCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyByZWxldmFudCBsaXN0ZW5lcnMgZm9yIHRoZSBpbnN0YW5jZVxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IG9mIGxpc3RlbmVyc1xyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9nZXRFdmVudExpc3RlbmVycygpIHtcclxuICB2YXIgX3RoaXM2ID0gdGhpcztcclxuXHJcbiAgdmFyIG9uVHJpZ2dlciA9IGZ1bmN0aW9uIG9uVHJpZ2dlcihldmVudCkge1xyXG4gICAgaWYgKCFfdGhpczYuc3RhdGUuZW5hYmxlZCkgcmV0dXJuO1xyXG5cclxuICAgIHZhciBzaG91bGRTdG9wRXZlbnQgPSBicm93c2VyLnN1cHBvcnRzVG91Y2ggJiYgYnJvd3Nlci51c2luZ1RvdWNoICYmIFsnbW91c2VlbnRlcicsICdtb3VzZW92ZXInLCAnZm9jdXMnXS5pbmRleE9mKGV2ZW50LnR5cGUpID4gLTE7XHJcblxyXG4gICAgaWYgKHNob3VsZFN0b3BFdmVudCAmJiBfdGhpczYub3B0aW9ucy50b3VjaEhvbGQpIHJldHVybjtcclxuXHJcbiAgICBfdGhpczYuXyhrZXkpLmxhc3RUcmlnZ2VyRXZlbnQgPSBldmVudDtcclxuXHJcbiAgICAvLyBUb2dnbGUgc2hvdy9oaWRlIHdoZW4gY2xpY2tpbmcgY2xpY2stdHJpZ2dlcmVkIHRvb2x0aXBzXHJcbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2NsaWNrJyAmJiBfdGhpczYub3B0aW9ucy5oaWRlT25DbGljayAhPT0gJ3BlcnNpc3RlbnQnICYmIF90aGlzNi5zdGF0ZS52aXNpYmxlKSB7XHJcbiAgICAgIF9sZWF2ZS5jYWxsKF90aGlzNik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBfZW50ZXIuY2FsbChfdGhpczYsIGV2ZW50KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgb25Nb3VzZUxlYXZlID0gZnVuY3Rpb24gb25Nb3VzZUxlYXZlKGV2ZW50KSB7XHJcbiAgICBpZiAoWydtb3VzZWxlYXZlJywgJ21vdXNlb3V0J10uaW5kZXhPZihldmVudC50eXBlKSA+IC0xICYmIGJyb3dzZXIuc3VwcG9ydHNUb3VjaCAmJiBicm93c2VyLnVzaW5nVG91Y2ggJiYgX3RoaXM2Lm9wdGlvbnMudG91Y2hIb2xkKSByZXR1cm47XHJcblxyXG4gICAgaWYgKF90aGlzNi5vcHRpb25zLmludGVyYWN0aXZlKSB7XHJcbiAgICAgIHZhciBoaWRlID0gX2xlYXZlLmJpbmQoX3RoaXM2KTtcclxuXHJcbiAgICAgIHZhciBvbk1vdXNlTW92ZSA9IGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIHJlZmVyZW5jZUN1cnNvcklzT3ZlciA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBzZWxlY3RvcnMuUkVGRVJFTkNFKTtcclxuICAgICAgICB2YXIgY3Vyc29ySXNPdmVyUG9wcGVyID0gY2xvc2VzdChldmVudC50YXJnZXQsIHNlbGVjdG9ycy5QT1BQRVIpID09PSBfdGhpczYucG9wcGVyO1xyXG4gICAgICAgIHZhciBjdXJzb3JJc092ZXJSZWZlcmVuY2UgPSByZWZlcmVuY2VDdXJzb3JJc092ZXIgPT09IF90aGlzNi5yZWZlcmVuY2U7XHJcblxyXG4gICAgICAgIGlmIChjdXJzb3JJc092ZXJQb3BwZXIgfHwgY3Vyc29ySXNPdmVyUmVmZXJlbmNlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChjdXJzb3JJc091dHNpZGVJbnRlcmFjdGl2ZUJvcmRlcihldmVudCwgX3RoaXM2LnBvcHBlciwgX3RoaXM2Lm9wdGlvbnMpKSB7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoaWRlKTtcclxuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcclxuXHJcbiAgICAgICAgICBfbGVhdmUuY2FsbChfdGhpczYsIG9uTW91c2VNb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoaWRlKTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgX2xlYXZlLmNhbGwoX3RoaXM2KTtcclxuICB9O1xyXG5cclxuICB2YXIgb25CbHVyID0gZnVuY3Rpb24gb25CbHVyKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0ICE9PSBfdGhpczYucmVmZXJlbmNlIHx8IGJyb3dzZXIudXNpbmdUb3VjaCkgcmV0dXJuO1xyXG5cclxuICAgIGlmIChfdGhpczYub3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xyXG4gICAgICBpZiAoIWV2ZW50LnJlbGF0ZWRUYXJnZXQpIHJldHVybjtcclxuICAgICAgaWYgKGNsb3Nlc3QoZXZlbnQucmVsYXRlZFRhcmdldCwgc2VsZWN0b3JzLlBPUFBFUikpIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBfbGVhdmUuY2FsbChfdGhpczYpO1xyXG4gIH07XHJcblxyXG4gIHZhciBvbkRlbGVnYXRlU2hvdyA9IGZ1bmN0aW9uIG9uRGVsZWdhdGVTaG93KGV2ZW50KSB7XHJcbiAgICBpZiAoY2xvc2VzdChldmVudC50YXJnZXQsIF90aGlzNi5vcHRpb25zLnRhcmdldCkpIHtcclxuICAgICAgX2VudGVyLmNhbGwoX3RoaXM2LCBldmVudCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIG9uRGVsZWdhdGVIaWRlID0gZnVuY3Rpb24gb25EZWxlZ2F0ZUhpZGUoZXZlbnQpIHtcclxuICAgIGlmIChjbG9zZXN0KGV2ZW50LnRhcmdldCwgX3RoaXM2Lm9wdGlvbnMudGFyZ2V0KSkge1xyXG4gICAgICBfbGVhdmUuY2FsbChfdGhpczYpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBvblRyaWdnZXI6IG9uVHJpZ2dlcixcclxuICAgIG9uTW91c2VMZWF2ZTogb25Nb3VzZUxlYXZlLFxyXG4gICAgb25CbHVyOiBvbkJsdXIsXHJcbiAgICBvbkRlbGVnYXRlU2hvdzogb25EZWxlZ2F0ZVNob3csXHJcbiAgICBvbkRlbGVnYXRlSGlkZTogb25EZWxlZ2F0ZUhpZGVcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIG5ldyBwb3BwZXIgaW5zdGFuY2VcclxuICogQHJldHVybiB7UG9wcGVyfVxyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9jcmVhdGVQb3BwZXJJbnN0YW5jZSgpIHtcclxuICB2YXIgX3RoaXM3ID0gdGhpcztcclxuXHJcbiAgdmFyIHBvcHBlciA9IHRoaXMucG9wcGVyLFxyXG4gICAgICByZWZlcmVuY2UgPSB0aGlzLnJlZmVyZW5jZSxcclxuICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHJcbiAgdmFyIF9nZXRJbm5lckVsZW1lbnRzNCA9IGdldElubmVyRWxlbWVudHMocG9wcGVyKSxcclxuICAgICAgdG9vbHRpcCA9IF9nZXRJbm5lckVsZW1lbnRzNC50b29sdGlwO1xyXG5cclxuICB2YXIgcG9wcGVyT3B0aW9ucyA9IG9wdGlvbnMucG9wcGVyT3B0aW9ucztcclxuXHJcbiAgdmFyIGFycm93U2VsZWN0b3IgPSBvcHRpb25zLmFycm93VHlwZSA9PT0gJ3JvdW5kJyA/IHNlbGVjdG9ycy5ST1VORF9BUlJPVyA6IHNlbGVjdG9ycy5BUlJPVztcclxuICB2YXIgYXJyb3cgPSB0b29sdGlwLnF1ZXJ5U2VsZWN0b3IoYXJyb3dTZWxlY3Rvcik7XHJcblxyXG4gIHZhciBjb25maWcgPSBfZXh0ZW5kcyh7XHJcbiAgICBwbGFjZW1lbnQ6IG9wdGlvbnMucGxhY2VtZW50XHJcbiAgfSwgcG9wcGVyT3B0aW9ucyB8fCB7fSwge1xyXG4gICAgbW9kaWZpZXJzOiBfZXh0ZW5kcyh7fSwgcG9wcGVyT3B0aW9ucyA/IHBvcHBlck9wdGlvbnMubW9kaWZpZXJzIDoge30sIHtcclxuICAgICAgYXJyb3c6IF9leHRlbmRzKHtcclxuICAgICAgICBlbGVtZW50OiBhcnJvd1NlbGVjdG9yXHJcbiAgICAgIH0sIHBvcHBlck9wdGlvbnMgJiYgcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMgPyBwb3BwZXJPcHRpb25zLm1vZGlmaWVycy5hcnJvdyA6IHt9KSxcclxuICAgICAgZmxpcDogX2V4dGVuZHMoe1xyXG4gICAgICAgIGVuYWJsZWQ6IG9wdGlvbnMuZmxpcCxcclxuICAgICAgICBwYWRkaW5nOiBvcHRpb25zLmRpc3RhbmNlICsgNSAvKiA1cHggZnJvbSB2aWV3cG9ydCBib3VuZGFyeSAqL1xyXG4gICAgICAgICwgYmVoYXZpb3I6IG9wdGlvbnMuZmxpcEJlaGF2aW9yXHJcbiAgICAgIH0sIHBvcHBlck9wdGlvbnMgJiYgcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMgPyBwb3BwZXJPcHRpb25zLm1vZGlmaWVycy5mbGlwIDoge30pLFxyXG4gICAgICBvZmZzZXQ6IF9leHRlbmRzKHtcclxuICAgICAgICBvZmZzZXQ6IG9wdGlvbnMub2Zmc2V0XHJcbiAgICAgIH0sIHBvcHBlck9wdGlvbnMgJiYgcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMgPyBwb3BwZXJPcHRpb25zLm1vZGlmaWVycy5vZmZzZXQgOiB7fSlcclxuICAgIH0pLFxyXG4gICAgb25DcmVhdGU6IGZ1bmN0aW9uIG9uQ3JlYXRlKCkge1xyXG4gICAgICB0b29sdGlwLnN0eWxlW2dldFBvcHBlclBsYWNlbWVudChwb3BwZXIpXSA9IGdldE9mZnNldERpc3RhbmNlSW5QeChvcHRpb25zLmRpc3RhbmNlKTtcclxuXHJcbiAgICAgIGlmIChhcnJvdyAmJiBvcHRpb25zLmFycm93VHJhbnNmb3JtKSB7XHJcbiAgICAgICAgY29tcHV0ZUFycm93VHJhbnNmb3JtKHBvcHBlciwgYXJyb3csIG9wdGlvbnMuYXJyb3dUcmFuc2Zvcm0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgb25VcGRhdGU6IGZ1bmN0aW9uIG9uVXBkYXRlKCkge1xyXG4gICAgICB2YXIgc3R5bGVzID0gdG9vbHRpcC5zdHlsZTtcclxuICAgICAgc3R5bGVzLnRvcCA9ICcnO1xyXG4gICAgICBzdHlsZXMuYm90dG9tID0gJyc7XHJcbiAgICAgIHN0eWxlcy5sZWZ0ID0gJyc7XHJcbiAgICAgIHN0eWxlcy5yaWdodCA9ICcnO1xyXG4gICAgICBzdHlsZXNbZ2V0UG9wcGVyUGxhY2VtZW50KHBvcHBlcildID0gZ2V0T2Zmc2V0RGlzdGFuY2VJblB4KG9wdGlvbnMuZGlzdGFuY2UpO1xyXG5cclxuICAgICAgaWYgKGFycm93ICYmIG9wdGlvbnMuYXJyb3dUcmFuc2Zvcm0pIHtcclxuICAgICAgICBjb21wdXRlQXJyb3dUcmFuc2Zvcm0ocG9wcGVyLCBhcnJvdywgb3B0aW9ucy5hcnJvd1RyYW5zZm9ybSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgX2FkZE11dGF0aW9uT2JzZXJ2ZXIuY2FsbCh0aGlzLCB7XHJcbiAgICB0YXJnZXQ6IHBvcHBlcixcclxuICAgIGNhbGxiYWNrOiBmdW5jdGlvbiBjYWxsYmFjaygpIHtcclxuICAgICAgX3RoaXM3LnBvcHBlckluc3RhbmNlLnVwZGF0ZSgpO1xyXG4gICAgfSxcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgICBzdWJ0cmVlOiB0cnVlLFxyXG4gICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiBuZXcgUG9wcGVyKHJlZmVyZW5jZSwgcG9wcGVyLCBjb25maWcpO1xyXG59XHJcblxyXG4vKipcclxuICogQXBwZW5kcyB0aGUgcG9wcGVyIGVsZW1lbnQgdG8gdGhlIERPTSwgdXBkYXRpbmcgb3IgY3JlYXRpbmcgdGhlIHBvcHBlciBpbnN0YW5jZVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9tb3VudChjYWxsYmFjaykge1xyXG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuXHJcbiAgaWYgKCF0aGlzLnBvcHBlckluc3RhbmNlKSB7XHJcbiAgICB0aGlzLnBvcHBlckluc3RhbmNlID0gX2NyZWF0ZVBvcHBlckluc3RhbmNlLmNhbGwodGhpcyk7XHJcbiAgICBpZiAoIW9wdGlvbnMubGl2ZVBsYWNlbWVudCkge1xyXG4gICAgICB0aGlzLnBvcHBlckluc3RhbmNlLmRpc2FibGVFdmVudExpc3RlbmVycygpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLnBvcHBlckluc3RhbmNlLnNjaGVkdWxlVXBkYXRlKCk7XHJcbiAgICBpZiAob3B0aW9ucy5saXZlUGxhY2VtZW50ICYmICFfaGFzRm9sbG93Q3Vyc29yQmVoYXZpb3IuY2FsbCh0aGlzKSkge1xyXG4gICAgICB0aGlzLnBvcHBlckluc3RhbmNlLmVuYWJsZUV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBJZiB0aGUgaW5zdGFuY2UgcHJldmlvdXNseSBoYWQgZm9sbG93Q3Vyc29yIGJlaGF2aW9yLCBpdCB3aWxsIGJlIHBvc2l0aW9uZWQgaW5jb3JyZWN0bHlcclxuICAvLyBpZiB0cmlnZ2VyZWQgYnkgYGZvY3VzYCBhZnRlcndhcmRzIC0gdXBkYXRlIHRoZSByZWZlcmVuY2UgYmFjayB0byB0aGUgcmVhbCBET00gZWxlbWVudFxyXG4gIGlmICghX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yLmNhbGwodGhpcykpIHtcclxuICAgIHZhciBfZ2V0SW5uZXJFbGVtZW50czUgPSBnZXRJbm5lckVsZW1lbnRzKHRoaXMucG9wcGVyKSxcclxuICAgICAgICBhcnJvdyA9IF9nZXRJbm5lckVsZW1lbnRzNS5hcnJvdztcclxuXHJcbiAgICBpZiAoYXJyb3cpIGFycm93LnN0eWxlLm1hcmdpbiA9ICcnO1xyXG4gICAgdGhpcy5wb3BwZXJJbnN0YW5jZS5yZWZlcmVuY2UgPSB0aGlzLnJlZmVyZW5jZTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVBvcHBlclBvc2l0aW9uKHRoaXMucG9wcGVySW5zdGFuY2UsIGNhbGxiYWNrLCB0cnVlKTtcclxuXHJcbiAgaWYgKCFvcHRpb25zLmFwcGVuZFRvLmNvbnRhaW5zKHRoaXMucG9wcGVyKSkge1xyXG4gICAgb3B0aW9ucy5hcHBlbmRUby5hcHBlbmRDaGlsZCh0aGlzLnBvcHBlcik7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ2xlYXJzIHRoZSBzaG93IGFuZCBoaWRlIGRlbGF5IHRpbWVvdXRzXHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX2NsZWFyRGVsYXlUaW1lb3V0cygpIHtcclxuICB2YXIgX3JlZiA9IHRoaXMuXyhrZXkpLFxyXG4gICAgICBzaG93VGltZW91dCA9IF9yZWYuc2hvd1RpbWVvdXQsXHJcbiAgICAgIGhpZGVUaW1lb3V0ID0gX3JlZi5oaWRlVGltZW91dDtcclxuXHJcbiAgY2xlYXJUaW1lb3V0KHNob3dUaW1lb3V0KTtcclxuICBjbGVhclRpbWVvdXQoaGlkZVRpbWVvdXQpO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0cyB0aGUgbW91c2Vtb3ZlIGV2ZW50IGxpc3RlbmVyIGZ1bmN0aW9uIGZvciBgZm9sbG93Q3Vyc29yYCBvcHRpb25cclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfc2V0Rm9sbG93Q3Vyc29yTGlzdGVuZXIoKSB7XHJcbiAgdmFyIF90aGlzOCA9IHRoaXM7XHJcblxyXG4gIHRoaXMuXyhrZXkpLmZvbGxvd0N1cnNvckxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgXyRsYXN0TW91c2VNb3ZlRXZlbnQgPSBfdGhpczguXyhrZXkpLmxhc3RNb3VzZU1vdmVFdmVudCA9IGV2ZW50LFxyXG4gICAgICAgIGNsaWVudFggPSBfJGxhc3RNb3VzZU1vdmVFdmVudC5jbGllbnRYLFxyXG4gICAgICAgIGNsaWVudFkgPSBfJGxhc3RNb3VzZU1vdmVFdmVudC5jbGllbnRZO1xyXG5cclxuICAgIGlmICghX3RoaXM4LnBvcHBlckluc3RhbmNlKSByZXR1cm47XHJcblxyXG4gICAgX3RoaXM4LnBvcHBlckluc3RhbmNlLnJlZmVyZW5jZSA9IHtcclxuICAgICAgZ2V0Qm91bmRpbmdDbGllbnRSZWN0OiBmdW5jdGlvbiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHdpZHRoOiAwLFxyXG4gICAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgICAgdG9wOiBjbGllbnRZLFxyXG4gICAgICAgICAgbGVmdDogY2xpZW50WCxcclxuICAgICAgICAgIHJpZ2h0OiBjbGllbnRYLFxyXG4gICAgICAgICAgYm90dG9tOiBjbGllbnRZXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgICAgY2xpZW50V2lkdGg6IDAsXHJcbiAgICAgIGNsaWVudEhlaWdodDogMFxyXG4gICAgfTtcclxuXHJcbiAgICBfdGhpczgucG9wcGVySW5zdGFuY2Uuc2NoZWR1bGVVcGRhdGUoKTtcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlcyB0aGUgcG9wcGVyJ3MgcG9zaXRpb24gb24gZWFjaCBhbmltYXRpb24gZnJhbWVcclxuICogQG1lbWJlcm9mIFRpcHB5XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfbWFrZVN0aWNreSgpIHtcclxuICB2YXIgX3RoaXM5ID0gdGhpcztcclxuXHJcbiAgdmFyIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uJCQxID0gZnVuY3Rpb24gYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24kJDEoKSB7XHJcbiAgICBfdGhpczkucG9wcGVyLnN0eWxlW3ByZWZpeCgndHJhbnNpdGlvbkR1cmF0aW9uJyldID0gX3RoaXM5Lm9wdGlvbnMudXBkYXRlRHVyYXRpb24gKyAnbXMnO1xyXG4gIH07XHJcblxyXG4gIHZhciByZW1vdmVUcmFuc2l0aW9uRHVyYXRpb24gPSBmdW5jdGlvbiByZW1vdmVUcmFuc2l0aW9uRHVyYXRpb24oKSB7XHJcbiAgICBfdGhpczkucG9wcGVyLnN0eWxlW3ByZWZpeCgndHJhbnNpdGlvbkR1cmF0aW9uJyldID0gJyc7XHJcbiAgfTtcclxuXHJcbiAgdmFyIHVwZGF0ZVBvc2l0aW9uID0gZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24oKSB7XHJcbiAgICBpZiAoX3RoaXM5LnBvcHBlckluc3RhbmNlKSB7XHJcbiAgICAgIF90aGlzOS5wb3BwZXJJbnN0YW5jZS51cGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseVRyYW5zaXRpb25EdXJhdGlvbiQkMSgpO1xyXG5cclxuICAgIGlmIChfdGhpczkuc3RhdGUudmlzaWJsZSkge1xyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlUG9zaXRpb24pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVtb3ZlVHJhbnNpdGlvbkR1cmF0aW9uKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdXBkYXRlUG9zaXRpb24oKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZHMgYSBtdXRhdGlvbiBvYnNlcnZlciB0byBhbiBlbGVtZW50IGFuZCBzdG9yZXMgaXQgaW4gdGhlIGluc3RhbmNlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fVxyXG4gKiBAbWVtYmVyb2YgVGlwcHlcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIF9hZGRNdXRhdGlvbk9ic2VydmVyKF9yZWYyKSB7XHJcbiAgdmFyIHRhcmdldCA9IF9yZWYyLnRhcmdldCxcclxuICAgICAgY2FsbGJhY2sgPSBfcmVmMi5jYWxsYmFjayxcclxuICAgICAgb3B0aW9ucyA9IF9yZWYyLm9wdGlvbnM7XHJcblxyXG4gIGlmICghd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIpIHJldHVybjtcclxuXHJcbiAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xyXG4gIG9ic2VydmVyLm9ic2VydmUodGFyZ2V0LCBvcHRpb25zKTtcclxuXHJcbiAgdGhpcy5fKGtleSkubXV0YXRpb25PYnNlcnZlcnMucHVzaChvYnNlcnZlcik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGaXJlcyB0aGUgY2FsbGJhY2sgZnVuY3Rpb25zIG9uY2UgdGhlIENTUyB0cmFuc2l0aW9uIGVuZHMgZm9yIGBzaG93YCBhbmQgYGhpZGVgIG1ldGhvZHNcclxuICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZmlyZSBvbmNlIHRyYW5zaXRpb24gY29tcGxldGVzXHJcbiAqIEBtZW1iZXJvZiBUaXBweVxyXG4gKiBAcHJpdmF0ZVxyXG4gKi9cclxuZnVuY3Rpb24gX29uVHJhbnNpdGlvbkVuZChkdXJhdGlvbiwgY2FsbGJhY2spIHtcclxuICAvLyBNYWtlIGNhbGxiYWNrIHN5bmNocm9ub3VzIGlmIGR1cmF0aW9uIGlzIDBcclxuICBpZiAoIWR1cmF0aW9uKSB7XHJcbiAgICByZXR1cm4gY2FsbGJhY2soKTtcclxuICB9XHJcblxyXG4gIHZhciBfZ2V0SW5uZXJFbGVtZW50czYgPSBnZXRJbm5lckVsZW1lbnRzKHRoaXMucG9wcGVyKSxcclxuICAgICAgdG9vbHRpcCA9IF9nZXRJbm5lckVsZW1lbnRzNi50b29sdGlwO1xyXG5cclxuICB2YXIgdG9nZ2xlTGlzdGVuZXJzID0gZnVuY3Rpb24gdG9nZ2xlTGlzdGVuZXJzKGFjdGlvbiwgbGlzdGVuZXIpIHtcclxuICAgIGlmICghbGlzdGVuZXIpIHJldHVybjtcclxuICAgIHRvb2x0aXBbYWN0aW9uICsgJ0V2ZW50TGlzdGVuZXInXSgnb250cmFuc2l0aW9uZW5kJyBpbiB3aW5kb3cgPyAndHJhbnNpdGlvbmVuZCcgOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsIGxpc3RlbmVyKTtcclxuICB9O1xyXG5cclxuICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiBsaXN0ZW5lcihlKSB7XHJcbiAgICBpZiAoZS50YXJnZXQgPT09IHRvb2x0aXApIHtcclxuICAgICAgdG9nZ2xlTGlzdGVuZXJzKCdyZW1vdmUnLCBsaXN0ZW5lcik7XHJcbiAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdG9nZ2xlTGlzdGVuZXJzKCdyZW1vdmUnLCB0aGlzLl8oa2V5KS50cmFuc2l0aW9uZW5kTGlzdGVuZXIpO1xyXG4gIHRvZ2dsZUxpc3RlbmVycygnYWRkJywgbGlzdGVuZXIpO1xyXG5cclxuICB0aGlzLl8oa2V5KS50cmFuc2l0aW9uZW5kTGlzdGVuZXIgPSBsaXN0ZW5lcjtcclxufVxyXG5cclxudmFyIGlkQ291bnRlciA9IDE7XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyB0b29sdGlwcyBmb3IgZWFjaCByZWZlcmVuY2UgZWxlbWVudFxyXG4gKiBAcGFyYW0ge0VsZW1lbnRbXX0gZWxzXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcclxuICogQHJldHVybiB7VGlwcHlbXX0gQXJyYXkgb2YgVGlwcHkgaW5zdGFuY2VzXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVUb29sdGlwcyhlbHMsIGNvbmZpZykge1xyXG4gIHJldHVybiBlbHMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHJlZmVyZW5jZSkge1xyXG4gICAgdmFyIGlkID0gaWRDb3VudGVyO1xyXG5cclxuICAgIHZhciBvcHRpb25zID0gZXZhbHVhdGVPcHRpb25zKHJlZmVyZW5jZSwgY29uZmlnLnBlcmZvcm1hbmNlID8gY29uZmlnIDogZ2V0SW5kaXZpZHVhbE9wdGlvbnMocmVmZXJlbmNlLCBjb25maWcpKTtcclxuXHJcbiAgICB2YXIgdGl0bGUgPSByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCd0aXRsZScpO1xyXG5cclxuICAgIC8vIERvbid0IGNyZWF0ZSBhbiBpbnN0YW5jZSB3aGVuOlxyXG4gICAgLy8gKiB0aGUgYHRpdGxlYCBhdHRyaWJ1dGUgaXMgZmFsc3kgKG51bGwgb3IgZW1wdHkgc3RyaW5nKSwgYW5kXHJcbiAgICAvLyAqIGl0J3Mgbm90IGEgZGVsZWdhdGUgZm9yIHRvb2x0aXBzLCBhbmRcclxuICAgIC8vICogdGhlcmUgaXMgbm8gaHRtbCB0ZW1wbGF0ZSBzcGVjaWZpZWQsIGFuZFxyXG4gICAgLy8gKiBgZHluYW1pY1RpdGxlYCBvcHRpb24gaXMgZmFsc2VcclxuICAgIGlmICghdGl0bGUgJiYgIW9wdGlvbnMudGFyZ2V0ICYmICFvcHRpb25zLmh0bWwgJiYgIW9wdGlvbnMuZHluYW1pY1RpdGxlKSB7XHJcbiAgICAgIHJldHVybiBhY2M7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRGVsZWdhdGVzIHNob3VsZCBiZSBoaWdobGlnaHRlZCBhcyBkaWZmZXJlbnRcclxuICAgIHJlZmVyZW5jZS5zZXRBdHRyaWJ1dGUob3B0aW9ucy50YXJnZXQgPyAnZGF0YS10aXBweS1kZWxlZ2F0ZScgOiAnZGF0YS10aXBweScsICcnKTtcclxuXHJcbiAgICByZW1vdmVUaXRsZShyZWZlcmVuY2UpO1xyXG5cclxuICAgIHZhciBwb3BwZXIgPSBjcmVhdGVQb3BwZXJFbGVtZW50KGlkLCB0aXRsZSwgb3B0aW9ucyk7XHJcblxyXG4gICAgdmFyIHRpcHB5ID0gbmV3IFRpcHB5KHtcclxuICAgICAgaWQ6IGlkLFxyXG4gICAgICByZWZlcmVuY2U6IHJlZmVyZW5jZSxcclxuICAgICAgcG9wcGVyOiBwb3BwZXIsXHJcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXHJcbiAgICAgIHRpdGxlOiB0aXRsZSxcclxuICAgICAgcG9wcGVySW5zdGFuY2U6IG51bGxcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChvcHRpb25zLmNyZWF0ZVBvcHBlckluc3RhbmNlT25Jbml0KSB7XHJcbiAgICAgIHRpcHB5LnBvcHBlckluc3RhbmNlID0gX2NyZWF0ZVBvcHBlckluc3RhbmNlLmNhbGwodGlwcHkpO1xyXG4gICAgICB0aXBweS5wb3BwZXJJbnN0YW5jZS5kaXNhYmxlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGlzdGVuZXJzID0gX2dldEV2ZW50TGlzdGVuZXJzLmNhbGwodGlwcHkpO1xyXG4gICAgdGlwcHkubGlzdGVuZXJzID0gb3B0aW9ucy50cmlnZ2VyLnRyaW0oKS5zcGxpdCgnICcpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBldmVudFR5cGUpIHtcclxuICAgICAgcmV0dXJuIGFjYy5jb25jYXQoY3JlYXRlVHJpZ2dlcihldmVudFR5cGUsIHJlZmVyZW5jZSwgbGlzdGVuZXJzLCBvcHRpb25zKSk7XHJcbiAgICB9LCBbXSk7XHJcblxyXG4gICAgLy8gVXBkYXRlIHRvb2x0aXAgY29udGVudCB3aGVuZXZlciB0aGUgdGl0bGUgYXR0cmlidXRlIG9uIHRoZSByZWZlcmVuY2UgY2hhbmdlc1xyXG4gICAgaWYgKG9wdGlvbnMuZHluYW1pY1RpdGxlKSB7XHJcbiAgICAgIF9hZGRNdXRhdGlvbk9ic2VydmVyLmNhbGwodGlwcHksIHtcclxuICAgICAgICB0YXJnZXQ6IHJlZmVyZW5jZSxcclxuICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gY2FsbGJhY2soKSB7XHJcbiAgICAgICAgICB2YXIgX2dldElubmVyRWxlbWVudHMgPSBnZXRJbm5lckVsZW1lbnRzKHBvcHBlciksXHJcbiAgICAgICAgICAgICAgY29udGVudCA9IF9nZXRJbm5lckVsZW1lbnRzLmNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgdmFyIHRpdGxlID0gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSgndGl0bGUnKTtcclxuICAgICAgICAgIGlmICh0aXRsZSkge1xyXG4gICAgICAgICAgICBjb250ZW50W29wdGlvbnMuYWxsb3dUaXRsZUhUTUwgPyAnaW5uZXJIVE1MJyA6ICd0ZXh0Q29udGVudCddID0gdGlwcHkudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICAgICAgcmVtb3ZlVGl0bGUocmVmZXJlbmNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTaG9ydGN1dHNcclxuICAgIHJlZmVyZW5jZS5fdGlwcHkgPSB0aXBweTtcclxuICAgIHBvcHBlci5fdGlwcHkgPSB0aXBweTtcclxuICAgIHBvcHBlci5fcmVmZXJlbmNlID0gcmVmZXJlbmNlO1xyXG5cclxuICAgIGFjYy5wdXNoKHRpcHB5KTtcclxuXHJcbiAgICBpZENvdW50ZXIrKztcclxuXHJcbiAgICByZXR1cm4gYWNjO1xyXG4gIH0sIFtdKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEhpZGVzIGFsbCBwb3BwZXJzXHJcbiAqIEBwYXJhbSB7VGlwcHl9IGV4Y2x1ZGVUaXBweSAtIHRpcHB5IHRvIGV4Y2x1ZGUgaWYgbmVlZGVkXHJcbiAqL1xyXG5mdW5jdGlvbiBoaWRlQWxsUG9wcGVycyhleGNsdWRlVGlwcHkpIHtcclxuICB2YXIgcG9wcGVycyA9IHRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMuUE9QUEVSKSk7XHJcblxyXG4gIHBvcHBlcnMuZm9yRWFjaChmdW5jdGlvbiAocG9wcGVyKSB7XHJcbiAgICB2YXIgdGlwcHkgPSBwb3BwZXIuX3RpcHB5O1xyXG4gICAgaWYgKCF0aXBweSkgcmV0dXJuO1xyXG5cclxuICAgIHZhciBvcHRpb25zID0gdGlwcHkub3B0aW9ucztcclxuXHJcblxyXG4gICAgaWYgKChvcHRpb25zLmhpZGVPbkNsaWNrID09PSB0cnVlIHx8IG9wdGlvbnMudHJpZ2dlci5pbmRleE9mKCdmb2N1cycpID4gLTEpICYmICghZXhjbHVkZVRpcHB5IHx8IHBvcHBlciAhPT0gZXhjbHVkZVRpcHB5LnBvcHBlcikpIHtcclxuICAgICAgdGlwcHkuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkcyB0aGUgbmVlZGVkIGV2ZW50IGxpc3RlbmVyc1xyXG4gKi9cclxuZnVuY3Rpb24gYmluZEV2ZW50TGlzdGVuZXJzKCkge1xyXG4gIHZhciBvbkRvY3VtZW50VG91Y2ggPSBmdW5jdGlvbiBvbkRvY3VtZW50VG91Y2goKSB7XHJcbiAgICBpZiAoYnJvd3Nlci51c2luZ1RvdWNoKSByZXR1cm47XHJcblxyXG4gICAgYnJvd3Nlci51c2luZ1RvdWNoID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoYnJvd3Nlci5pT1MpIHtcclxuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCd0aXBweS10b3VjaCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChicm93c2VyLmR5bmFtaWNJbnB1dERldGVjdGlvbiAmJiB3aW5kb3cucGVyZm9ybWFuY2UpIHtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Eb2N1bWVudE1vdXNlTW92ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYnJvd3Nlci5vblVzZXJJbnB1dENoYW5nZSgndG91Y2gnKTtcclxuICB9O1xyXG5cclxuICB2YXIgb25Eb2N1bWVudE1vdXNlTW92ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB0aW1lID0gdm9pZCAwO1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgIC8vIENocm9tZSA2MCsgaXMgMSBtb3VzZW1vdmUgcGVyIGFuaW1hdGlvbiBmcmFtZSwgdXNlIDIwbXMgdGltZSBkaWZmZXJlbmNlXHJcbiAgICAgIGlmIChub3cgLSB0aW1lIDwgMjApIHtcclxuICAgICAgICBicm93c2VyLnVzaW5nVG91Y2ggPSBmYWxzZTtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbkRvY3VtZW50TW91c2VNb3ZlKTtcclxuICAgICAgICBpZiAoIWJyb3dzZXIuaU9TKSB7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3RpcHB5LXRvdWNoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyb3dzZXIub25Vc2VySW5wdXRDaGFuZ2UoJ21vdXNlJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRpbWUgPSBub3c7XHJcbiAgICB9O1xyXG4gIH0oKTtcclxuXHJcbiAgdmFyIG9uRG9jdW1lbnRDbGljayA9IGZ1bmN0aW9uIG9uRG9jdW1lbnRDbGljayhldmVudCkge1xyXG4gICAgLy8gU2ltdWxhdGVkIGV2ZW50cyBkaXNwYXRjaGVkIG9uIHRoZSBkb2N1bWVudFxyXG4gICAgaWYgKCEoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudCkpIHtcclxuICAgICAgcmV0dXJuIGhpZGVBbGxQb3BwZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJlZmVyZW5jZSA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBzZWxlY3RvcnMuUkVGRVJFTkNFKTtcclxuICAgIHZhciBwb3BwZXIgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgc2VsZWN0b3JzLlBPUFBFUik7XHJcblxyXG4gICAgaWYgKHBvcHBlciAmJiBwb3BwZXIuX3RpcHB5ICYmIHBvcHBlci5fdGlwcHkub3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlZmVyZW5jZSAmJiByZWZlcmVuY2UuX3RpcHB5KSB7XHJcbiAgICAgIHZhciBvcHRpb25zID0gcmVmZXJlbmNlLl90aXBweS5vcHRpb25zO1xyXG5cclxuICAgICAgdmFyIGlzQ2xpY2tUcmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyLmluZGV4T2YoJ2NsaWNrJykgPiAtMTtcclxuICAgICAgdmFyIGlzTXVsdGlwbGUgPSBvcHRpb25zLm11bHRpcGxlO1xyXG5cclxuICAgICAgLy8gSGlkZSBhbGwgcG9wcGVycyBleGNlcHQgdGhlIG9uZSBiZWxvbmdpbmcgdG8gdGhlIGVsZW1lbnQgdGhhdCB3YXMgY2xpY2tlZFxyXG4gICAgICBpZiAoIWlzTXVsdGlwbGUgJiYgYnJvd3Nlci51c2luZ1RvdWNoIHx8ICFpc011bHRpcGxlICYmIGlzQ2xpY2tUcmlnZ2VyKSB7XHJcbiAgICAgICAgcmV0dXJuIGhpZGVBbGxQb3BwZXJzKHJlZmVyZW5jZS5fdGlwcHkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5oaWRlT25DbGljayAhPT0gdHJ1ZSB8fCBpc0NsaWNrVHJpZ2dlcikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhpZGVBbGxQb3BwZXJzKCk7XHJcbiAgfTtcclxuXHJcbiAgdmFyIG9uV2luZG93Qmx1ciA9IGZ1bmN0aW9uIG9uV2luZG93Qmx1cigpIHtcclxuICAgIHZhciBfZG9jdW1lbnQgPSBkb2N1bWVudCxcclxuICAgICAgICBlbCA9IF9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG5cclxuICAgIGlmIChlbCAmJiBlbC5ibHVyICYmIG1hdGNoZXMkMS5jYWxsKGVsLCBzZWxlY3RvcnMuUkVGRVJFTkNFKSkge1xyXG4gICAgICBlbC5ibHVyKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdmFyIG9uV2luZG93UmVzaXplID0gZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XHJcbiAgICB0b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLlBPUFBFUikpLmZvckVhY2goZnVuY3Rpb24gKHBvcHBlcikge1xyXG4gICAgICB2YXIgdGlwcHlJbnN0YW5jZSA9IHBvcHBlci5fdGlwcHk7XHJcbiAgICAgIGlmICh0aXBweUluc3RhbmNlICYmICF0aXBweUluc3RhbmNlLm9wdGlvbnMubGl2ZVBsYWNlbWVudCkge1xyXG4gICAgICAgIHRpcHB5SW5zdGFuY2UucG9wcGVySW5zdGFuY2Uuc2NoZWR1bGVVcGRhdGUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkRvY3VtZW50Q2xpY2spO1xyXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvbkRvY3VtZW50VG91Y2gpO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgb25XaW5kb3dCbHVyKTtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25XaW5kb3dSZXNpemUpO1xyXG5cclxuICBpZiAoIWJyb3dzZXIuc3VwcG9ydHNUb3VjaCAmJiAobmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzIHx8IG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzKSkge1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCBvbkRvY3VtZW50VG91Y2gpO1xyXG4gIH1cclxufVxyXG5cclxudmFyIGV2ZW50TGlzdGVuZXJzQm91bmQgPSBmYWxzZTtcclxuXHJcbi8qKlxyXG4gKiBFeHBvcnRlZCBtb2R1bGVcclxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxFbGVtZW50W118Tm9kZUxpc3R8T2JqZWN0fSBzZWxlY3RvclxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9uZSAtIGNyZWF0ZSBvbmUgdG9vbHRpcFxyXG4gKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAqL1xyXG5mdW5jdGlvbiB0aXBweSQxKHNlbGVjdG9yLCBvcHRpb25zLCBvbmUpIHtcclxuICBpZiAoYnJvd3Nlci5zdXBwb3J0ZWQgJiYgIWV2ZW50TGlzdGVuZXJzQm91bmQpIHtcclxuICAgIGJpbmRFdmVudExpc3RlbmVycygpO1xyXG4gICAgZXZlbnRMaXN0ZW5lcnNCb3VuZCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBpZiAoaXNPYmplY3RMaXRlcmFsKHNlbGVjdG9yKSkge1xyXG4gICAgcG9seWZpbGxWaXJ0dWFsUmVmZXJlbmNlUHJvcHMoc2VsZWN0b3IpO1xyXG4gIH1cclxuXHJcbiAgb3B0aW9ucyA9IF9leHRlbmRzKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gIHZhciByZWZlcmVuY2VzID0gZ2V0QXJyYXlPZkVsZW1lbnRzKHNlbGVjdG9yKTtcclxuICB2YXIgZmlyc3RSZWZlcmVuY2UgPSByZWZlcmVuY2VzWzBdO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxyXG4gICAgb3B0aW9uczogb3B0aW9ucyxcclxuICAgIHRvb2x0aXBzOiBicm93c2VyLnN1cHBvcnRlZCA/IGNyZWF0ZVRvb2x0aXBzKG9uZSAmJiBmaXJzdFJlZmVyZW5jZSA/IFtmaXJzdFJlZmVyZW5jZV0gOiByZWZlcmVuY2VzLCBvcHRpb25zKSA6IFtdLFxyXG4gICAgZGVzdHJveUFsbDogZnVuY3Rpb24gZGVzdHJveUFsbCgpIHtcclxuICAgICAgdGhpcy50b29sdGlwcy5mb3JFYWNoKGZ1bmN0aW9uICh0b29sdGlwKSB7XHJcbiAgICAgICAgcmV0dXJuIHRvb2x0aXAuZGVzdHJveSgpO1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy50b29sdGlwcyA9IFtdO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbnRpcHB5JDEudmVyc2lvbiA9IHZlcnNpb247XHJcbnRpcHB5JDEuYnJvd3NlciA9IGJyb3dzZXI7XHJcbnRpcHB5JDEuZGVmYXVsdHMgPSBkZWZhdWx0cztcclxudGlwcHkkMS5vbmUgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIG9wdGlvbnMpIHtcclxuICByZXR1cm4gdGlwcHkkMShzZWxlY3Rvciwgb3B0aW9ucywgdHJ1ZSkudG9vbHRpcHNbMF07XHJcbn07XHJcbnRpcHB5JDEuZGlzYWJsZUFuaW1hdGlvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgZGVmYXVsdHMudXBkYXRlRHVyYXRpb24gPSBkZWZhdWx0cy5kdXJhdGlvbiA9IDA7XHJcbiAgZGVmYXVsdHMuYW5pbWF0ZUZpbGwgPSBmYWxzZTtcclxufTtcclxuXHJcbnJldHVybiB0aXBweSQxO1xyXG5cclxufSkpKTtcclxuIl19
