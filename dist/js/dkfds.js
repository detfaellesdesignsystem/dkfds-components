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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/_core":12,"../../modules/es6.array.from":59,"../../modules/es6.string.iterator":61}],6:[function(require,module,exports){
'use strict';

require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/_core":12,"../../modules/es6.object.assign":60}],7:[function(require,module,exports){
'use strict';

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],8:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":28}],9:[function(require,module,exports){
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

},{"./_to-absolute-index":50,"./_to-iobject":52,"./_to-length":53}],10:[function(require,module,exports){
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

},{"./_cof":11,"./_wks":57}],11:[function(require,module,exports){
"use strict";

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],12:[function(require,module,exports){
'use strict';

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],13:[function(require,module,exports){
'use strict';

var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
};

},{"./_object-dp":37,"./_property-desc":44}],14:[function(require,module,exports){
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

},{"./_a-function":7}],15:[function(require,module,exports){
"use strict";

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],16:[function(require,module,exports){
'use strict';

// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_fails":20}],17:[function(require,module,exports){
'use strict';

var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":21,"./_is-object":28}],18:[function(require,module,exports){
'use strict';

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

},{}],19:[function(require,module,exports){
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

},{"./_core":12,"./_ctx":14,"./_global":21,"./_hide":23,"./_redefine":45}],20:[function(require,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],21:[function(require,module,exports){
'use strict';

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
// eslint-disable-next-line no-new-func
: Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],22:[function(require,module,exports){
"use strict";

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],23:[function(require,module,exports){
'use strict';

var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":16,"./_object-dp":37,"./_property-desc":44}],24:[function(require,module,exports){
'use strict';

var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":21}],25:[function(require,module,exports){
'use strict';

module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

},{"./_descriptors":16,"./_dom-create":17,"./_fails":20}],26:[function(require,module,exports){
'use strict';

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":11}],27:[function(require,module,exports){
'use strict';

// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":33,"./_wks":57}],28:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
};

},{}],29:[function(require,module,exports){
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

},{"./_an-object":8}],30:[function(require,module,exports){
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

},{"./_hide":23,"./_object-create":36,"./_property-desc":44,"./_set-to-string-tag":46,"./_wks":57}],31:[function(require,module,exports){
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

},{"./_export":19,"./_hide":23,"./_iter-create":30,"./_iterators":33,"./_library":34,"./_object-gpo":40,"./_redefine":45,"./_set-to-string-tag":46,"./_wks":57}],32:[function(require,module,exports){
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

},{"./_wks":57}],33:[function(require,module,exports){
"use strict";

module.exports = {};

},{}],34:[function(require,module,exports){
"use strict";

module.exports = false;

},{}],35:[function(require,module,exports){
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

},{"./_fails":20,"./_iobject":26,"./_object-gops":39,"./_object-keys":42,"./_object-pie":43,"./_to-object":54}],36:[function(require,module,exports){
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

},{"./_an-object":8,"./_dom-create":17,"./_enum-bug-keys":18,"./_html":24,"./_object-dps":38,"./_shared-key":47}],37:[function(require,module,exports){
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

},{"./_an-object":8,"./_descriptors":16,"./_ie8-dom-define":25,"./_to-primitive":55}],38:[function(require,module,exports){
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

},{"./_an-object":8,"./_descriptors":16,"./_object-dp":37,"./_object-keys":42}],39:[function(require,module,exports){
"use strict";

exports.f = Object.getOwnPropertySymbols;

},{}],40:[function(require,module,exports){
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

},{"./_has":22,"./_shared-key":47,"./_to-object":54}],41:[function(require,module,exports){
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

},{"./_array-includes":9,"./_has":22,"./_shared-key":47,"./_to-iobject":52}],42:[function(require,module,exports){
'use strict';

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":18,"./_object-keys-internal":41}],43:[function(require,module,exports){
"use strict";

exports.f = {}.propertyIsEnumerable;

},{}],44:[function(require,module,exports){
"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],45:[function(require,module,exports){
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

},{"./_core":12,"./_global":21,"./_has":22,"./_hide":23,"./_uid":56}],46:[function(require,module,exports){
'use strict';

var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":22,"./_object-dp":37,"./_wks":57}],47:[function(require,module,exports){
'use strict';

var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":48,"./_uid":56}],48:[function(require,module,exports){
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

},{"./_core":12,"./_global":21,"./_library":34}],49:[function(require,module,exports){
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

},{"./_defined":15,"./_to-integer":51}],50:[function(require,module,exports){
'use strict';

var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":51}],51:[function(require,module,exports){
"use strict";

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],52:[function(require,module,exports){
'use strict';

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":15,"./_iobject":26}],53:[function(require,module,exports){
'use strict';

// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":51}],54:[function(require,module,exports){
'use strict';

// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":15}],55:[function(require,module,exports){
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

},{"./_is-object":28}],56:[function(require,module,exports){
'use strict';

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],57:[function(require,module,exports){
'use strict';

var store = require('./_shared')('wks');
var uid = require('./_uid');
var _Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof _Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":21,"./_shared":48,"./_uid":56}],58:[function(require,module,exports){
'use strict';

var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

},{"./_classof":10,"./_core":12,"./_iterators":33,"./_wks":57}],59:[function(require,module,exports){
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

},{"./_create-property":13,"./_ctx":14,"./_export":19,"./_is-array-iter":27,"./_iter-call":29,"./_iter-detect":32,"./_to-length":53,"./_to-object":54,"./core.get-iterator-method":58}],60:[function(require,module,exports){
'use strict';

// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":19,"./_object-assign":35}],61:[function(require,module,exports){
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

},{"./_iter-define":31,"./_string-at":49}],62:[function(require,module,exports){
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

},{}],63:[function(require,module,exports){
'use strict';

// <3 Modernizr
// https://raw.githubusercontent.com/Modernizr/Modernizr/master/feature-detects/dom/dataset.js

function useNative() {
	var elem = document.createElement('div');
	elem.setAttribute('data-a-b', 'c');

	return Boolean(elem.dataset && elem.dataset.aB === 'c');
}

function nativeDataset(element) {
	return element.dataset;
}

module.exports = useNative() ? nativeDataset : function (element) {
	var map = {};
	var attributes = element.attributes;

	function getter() {
		return this.value;
	}

	function setter(name, value) {
		if (typeof value === 'undefined') {
			this.removeAttribute(name);
		} else {
			this.setAttribute(name, value);
		}
	}

	for (var i = 0, j = attributes.length; i < j; i++) {
		var attribute = attributes[i];

		if (attribute) {
			var name = attribute.name;

			if (name.indexOf('data-') === 0) {
				var prop = name.slice(5).replace(/-./g, function (u) {
					return u.charAt(1).toUpperCase();
				});

				var value = attribute.value;

				Object.defineProperty(map, prop, {
					enumerable: true,
					get: getter.bind({ value: value || '' }),
					set: setter.bind(element, name)
				});
			}
		}
	}

	return map;
};

},{}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
(function (global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function now() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

module.exports = debounce;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],66:[function(require,module,exports){
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

},{}],67:[function(require,module,exports){
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

},{"../delegate":70,"../delegateAll":69,"object-assign":66}],68:[function(require,module,exports){
"use strict";

module.exports = function compose(functions) {
  return function (e) {
    return functions.some(function (fn) {
      return fn.call(this, e) === false;
    }, this);
  };
};

},{}],69:[function(require,module,exports){
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

},{"../compose":68,"../delegate":70}],70:[function(require,module,exports){
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

},{"element-closest":64}],71:[function(require,module,exports){
"use strict";

module.exports = function once(listener, options) {
  var wrapped = function wrappedOnce(e) {
    e.currentTarget.removeEventListener(e.type, wrapped, options);
    return listener.call(this, e);
  };
  return wrapped;
};

},{}],72:[function(require,module,exports){
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

},{"../config":86,"../events":88,"../utils/behavior":91,"../utils/is-in-viewport":93,"../utils/toggle":95,"array-filter":1,"array-foreach":2,"object-assign":66}],73:[function(require,module,exports){
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

},{"../utils/behavior":91,"../utils/closest":92,"../utils/select":94,"array-foreach":2}],74:[function(require,module,exports){
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

},{"../utils/behavior":91,"../utils/closest":92,"../utils/select":94,"array-foreach":2}],75:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pikaday = require("../../vendor/pikaday.js");
var behavior = require('../utils/behavior');
var select = require('../utils/select');
var closest = require('../utils/closest');

var jsDatepickerSelector = '.js-calendar-datepicker';
var jsDayInput = '.js-calendar-day-input';
var jsMonthInput = '.js-calendar-month-input';
var jsYearInput = '.js-calendar-year-input';

var datepickerGroup = function () {
  function datepickerGroup(el) {
    _classCallCheck(this, datepickerGroup);

    this.pikadayInstance = null;
    this.datepickerElement = select(jsDatepickerSelector, el);
    this.dateGroup = el;
    this.formGroup = closest(el, '.form-group');
    this.dayInputElement = null;
    this.monthInputElement = null;
    this.yearInputElement = null;

    this.initDateInputs();
    this.initDatepicker(this.datepickerElement[0]);
  }

  _createClass(datepickerGroup, [{
    key: 'initDateInputs',
    value: function initDateInputs() {
      this.dayInputElement = select(jsDayInput, this.dateGroup)[0];
      this.monthInputElement = select(jsMonthInput, this.dateGroup)[0];
      this.yearInputElement = select(jsYearInput, this.dateGroup)[0];

      var that = this;

      this.dayInputElement.addEventListener("blur", function () {
        that.formatInputs();
        that.validateInputs();
      });

      this.monthInputElement.addEventListener("blur", function () {
        that.formatInputs();
        that.validateInputs();
      });

      this.yearInputElement.addEventListener("blur", function () {
        that.formatInputs();
        that.validateInputs();
      });
    }
  }, {
    key: 'initDatepicker',
    value: function initDatepicker(el) {
      if (el) {
        //Note: el may not be a <svg>, IE11 does not add .blur() method to svg elements (--> esc and enter does not dismiss pikaday). 
        this.initDone = false;
        var that = this;

        this.pikadayInstance = new Pikaday({
          field: el,
          format: 'DD/MM/YYYY',
          firstDay: 1, //mandag
          i18n: {
            previousMonth: 'Forrige måned',
            nextMonth: 'Næste måned',
            months: ['Januar', 'Februar', 'Marth', 'April', 'Maj', 'Juni', 'July', 'August', 'September', 'Oktober', 'November', 'December'],
            weekdays: ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],
            weekdaysShort: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør']
          },
          onSelect: function onSelect(date) {
            //selected new date in pikaday, update input fields. 
            if (that.initDone) {
              that.updateDateInputs(date);
              that.validateInputs();
            }
          },
          onOpen: function onOpen() {
            //update pikaday with values from input fields
            var day = parseInt(that.dayInputElement.value);
            var month = parseInt(that.monthInputElement.value) - 1;
            var year = parseInt(that.yearInputElement.value);
            var newDate = new Date(year, month, day);
            if (that.validateInputs()) {
              that.updateDatepickerDate(newDate);
            }
          }
        });

        var initDate = new Date();
        this.pikadayInstance.setDate(initDate);
        //this.updateDateInputs(initDate);
        this.initDone = true;
      }
    }
  }, {
    key: 'validateInputs',
    value: function validateInputs() {
      var day = parseInt(this.dayInputElement.value);
      var month = parseInt(this.monthInputElement.value);
      var year = parseInt(this.yearInputElement.value);
      var maxDay = new Date(year, month, 0).getDate();

      var msg = "";
      var isValid = true;
      if (day > maxDay) {
        isValid = false;
        msg = "Hov, den dag findes ikke i den valgte måned.";
        this.showError(msg);
      } else if (month > 12) {
        isValid = false;
        msg = "Hov, den måned findes ikke.";
        this.showError(msg);
      }

      if (isValid) {
        this.removeError();
      }

      return isValid;
    }
  }, {
    key: 'showError',
    value: function showError(msg) {
      this.formGroup.classList.add("input-error");
      select(".input-error-message", this.formGroup)[0].textContent = msg;
    }
  }, {
    key: 'removeError',
    value: function removeError() {
      this.formGroup.classList.remove("input-error");
      select(".input-error-message", this.formGroup)[0].textContent = "";
    }
  }, {
    key: 'updateDateInputs',
    value: function updateDateInputs(date) {
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      this.dayInputElement.value = this.dayFormat(day);
      this.monthInputElement.value = this.monthFormat(month);
      this.yearInputElement.value = year;
    }

    //adds 0 at the front of day number

  }, {
    key: 'dayFormat',
    value: function dayFormat(day) {
      return ("0" + day).slice(-2);
    }
  }, {
    key: 'monthFormat',
    value: function monthFormat(month) {
      return ("0" + month).slice(-2);
    }
  }, {
    key: 'formatInputs',
    value: function formatInputs() {
      var day = parseInt(this.dayInputElement.value);
      var month = parseInt(this.monthInputElement.value);
      if (!isNaN(day)) {
        this.dayInputElement.value = this.dayFormat(day);
      }
      if (!isNaN(month)) {
        this.monthInputElement.value = this.monthFormat(month);
      }
    }
  }, {
    key: 'updateDatepickerDate',
    value: function updateDatepickerDate(newDate) {
      this.pikadayInstance.setDate(newDate);
    }
  }]);

  return datepickerGroup;
}();

module.exports = datepickerGroup;

},{"../../vendor/pikaday.js":98,"../utils/behavior":91,"../utils/closest":92,"../utils/select":94}],76:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var behavior = require('../utils/behavior');
var select = require('../utils/select');
var closest = require('../utils/closest');
var forEach = require('array-foreach');

var dropdown = function () {
    function dropdown(el) {
        _classCallCheck(this, dropdown);

        this.jsDropdownTrigger = ".js-dropdown";
        this.jsDropdownTarget = "data-js-target";

        //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown). 
        this.navResponsiveBreakpoint = 992; //same as $nav-responsive-breakpoint from the scss.
        this.jsResponsiveCollapseModifier = ".js-dropdown--responsive-collapse";
        this.responsiveCollapseEnabled = false;

        this.triggerEl = null;
        this.targetEl = null;

        this.init(el);

        if (this.triggerEl !== null && this.triggerEl !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
            var that = this;

            //Clicked outside dropdown -> close it
            select('body')[0].addEventListener("click", function (event) {
                that.outsideClose(event);
            });

            //Clicked on dropdown open button --> toggle it
            this.triggerEl.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation(); //prevents ouside click listener from triggering. 
                that.toggleDropdown();
            });
        }
    }

    _createClass(dropdown, [{
        key: 'init',
        value: function init(el) {
            this.triggerEl = el;
            if (this.triggerEl !== null && this.triggerEl !== undefined) {
                var targetAttr = this.triggerEl.getAttribute(this.jsDropdownTarget);
                if (targetAttr !== null && targetAttr !== undefined) {
                    var targetEl = select(targetAttr, 'body');
                    if (targetEl !== null && targetEl !== undefined && targetEl.length > 0) {
                        this.targetEl = targetEl[0];
                    }
                }
            }

            if (this.triggerEl.classList.contains('js-dropdown--responsive-collapse')) {
                this.responsiveCollapseEnabled = true;
            }
        }
    }, {
        key: 'toggleDropdown',
        value: function toggleDropdown(forceClose) {
            if (this.triggerEl !== null && this.triggerEl !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
                //change state
                if (this.triggerEl.getAttribute("aria-expanded") == "true" || forceClose) {
                    //close
                    this.triggerEl.setAttribute("aria-expanded", "false");
                    this.targetEl.classList.add("collapsed");
                    this.targetEl.setAttribute("aria-hidden", "true");
                } else {
                    //open
                    this.triggerEl.setAttribute("aria-expanded", "true");
                    this.targetEl.classList.remove("collapsed");
                    this.targetEl.setAttribute("aria-hidden", "false");
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

},{"../utils/behavior":91,"../utils/closest":92,"../utils/select":94,"array-foreach":2}],77:[function(require,module,exports){
'use strict';

module.exports = {
  accordion: require('./accordion'),
  navigation: require('./navigation'),
  skipnav: require('./skipnav'),
  validator: require('./validator'),
  regexmask: require('./regex-input-mask'),
  collapse: require('./collapse')
};

},{"./accordion":72,"./collapse":74,"./navigation":79,"./regex-input-mask":81,"./skipnav":82,"./validator":85}],78:[function(require,module,exports){
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

},{"../../vendor/micromodal.js":97,"domready":62}],79:[function(require,module,exports){
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

},{"../config":86,"../events":88,"../utils/behavior":91,"../utils/select":94,"./accordion":72,"array-foreach":2,"object-assign":66}],80:[function(require,module,exports){
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

},{"../utils/behavior":91,"../utils/closest":92,"../utils/select":94,"array-foreach":2}],81:[function(require,module,exports){

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
    if (typeof event.key !== "undefined") {
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
    var element = null;
    if (event.target !== undefined) {
        element = event.target;
    }
    if (newChar !== null && element !== null) {
        if (newChar.length > 0) {
            if (element.type === "number") {
                var newValue = this.value; //Note input[type=number] does not have .selectionStart/End (Chrome).
            } else {
                var newValue = this.value.slice(0, element.selectionStart) + this.value.slice(element.selectionEnd) + newChar; //removes the numbers selected by the user, then adds new char. 
            }

            var regexStr = this.getAttribute("data-input-regex");
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

module.exports = behavior({
    'keypress paste': {
        'input[data-input-regex]': inputRegexMask
    }
});

},{"../utils/behavior":91}],82:[function(require,module,exports){
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

},{"../config":86,"../events":88,"../utils/behavior":91,"receptor/once":71}],83:[function(require,module,exports){
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

},{"../utils/select":94,"array-foreach":2,"domready":62}],84:[function(require,module,exports){
'use strict';

var domready = require('domready');
var select = require('../utils/select');
//Import tippy.js (https://atomiks.github.io/tippyjs/)
var tippy = require("../../vendor/tippyjs/tippy.js");

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

var body = select('body')[0];
body.addEventListener('init-tooltips', function (e) {
    initTippy();
}, false);

},{"../../vendor/tippyjs/tippy.js":99,"../utils/select":94,"domready":62}],85:[function(require,module,exports){
'use strict';

var behavior = require('../utils/behavior');
var validate = require('../utils/validate-input');
var debounce = require('lodash.debounce');

var change = function change(event) {
  return validate(this);
};

module.exports = behavior({
  'keyup change': {
    'input[data-validation-element]': change
  }
});

/**
 * TODO for 2.0, remove this statement and export `navigation` directly:
 *
 * module.exports = behavior({...});
 */
/*const assign = require('object-assign');
module.exports = assign(
  el => validator.on(el),
  validator
);*/

},{"../utils/behavior":91,"../utils/validate-input":96,"lodash.debounce":65}],86:[function(require,module,exports){
'use strict';

module.exports = {
  prefix: ''
};

},{}],87:[function(require,module,exports){
'use strict';

var domready = require('domready');
var forEach = require('array-foreach');
var select = require('./utils/select');
var datepicker = require('./components/datepicker');
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

  //Init datepicker.  (Note: above 'behavior.on' does not work with pikaday -> seperate initialization)
  var jsSelectorDatepicker = '.js-calendar-group';
  forEach(select(jsSelectorDatepicker), function (calendarGroupElement) {
    new datepicker(calendarGroupElement);
  });

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

},{"./components":77,"./components/checkbox-toggle-content":73,"./components/datepicker":75,"./components/dropdown":76,"./components/modal":78,"./components/radio-toggle-content":80,"./components/table":83,"./components/tooltip":84,"./config":86,"./polyfills":90,"./utils/select":94,"array-foreach":2,"domready":62}],88:[function(require,module,exports){
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

},{}],89:[function(require,module,exports){
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

},{}],90:[function(require,module,exports){
'use strict';
// polyfills HTMLElement.prototype.classList and DOMTokenList

require('classlist-polyfill');
// polyfills HTMLElement.prototype.hidden
require('./element-hidden');

require('core-js/fn/object/assign');
require('core-js/fn/array/from');

},{"./element-hidden":89,"classlist-polyfill":4,"core-js/fn/array/from":5,"core-js/fn/object/assign":6}],91:[function(require,module,exports){
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

},{"array-foreach":2,"object-assign":66,"receptor/behavior":67}],92:[function(require,module,exports){
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

},{}],93:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;

  var rect = el.getBoundingClientRect();

  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}

module.exports = isElementInViewport;

},{}],94:[function(require,module,exports){
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

},{}],95:[function(require,module,exports){
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

},{}],96:[function(require,module,exports){
'use strict';

var dataset = require('elem-dataset');

var PREFIX = require('../config').prefix;
var CHECKED = 'aria-checked';
var CHECKED_CLASS = PREFIX + 'checklist-checked';

module.exports = function validate(el) {
  var data = dataset(el);
  var id = data.validationElement;
  var checkList = id.charAt(0) === '#' ? document.querySelector(id) : document.getElementById(id);

  if (!checkList) {
    throw new Error('No validation element found with id: "' + id + '"');
  }

  for (var key in data) {
    if (key.startsWith('validate')) {
      var validatorName = key.substr('validate'.length).toLowerCase();
      var validatorPattern = new RegExp(data[key]);
      var validatorSelector = '[data-validator="' + validatorName + '"]';
      var validatorCheckbox = checkList.querySelector(validatorSelector);
      if (!validatorCheckbox) {
        throw new Error('No validator checkbox found for: "' + validatorName + '"');
      }

      var checked = validatorPattern.test(el.value);
      validatorCheckbox.classList.toggle(CHECKED_CLASS, checked);
      validatorCheckbox.setAttribute(CHECKED, checked);
    }
  }
};

},{"../config":86,"elem-dataset":63}],97:[function(require,module,exports){
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

},{}],98:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * Pikaday
 *
 * Copyright © 2014 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
 */

(function (root, factory) {
    'use strict';

    var moment;
    if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        // CommonJS module
        // Load moment.js as an optional dependency
        try {
            moment = require('moment');
        } catch (e) {}
        module.exports = factory(moment);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function (req) {
            // Load moment.js as an optional dependency
            var id = 'moment';
            try {
                moment = req(id);
            } catch (e) {}
            return factory(moment);
        });
    } else {
        root.Pikaday = factory(root.moment);
    }
})(undefined, function (moment) {
    'use strict';

    /**
     * feature detection and helper functions
     */

    var hasMoment = typeof moment === 'function',
        hasEventListeners = !!window.addEventListener,
        document = window.document,
        sto = window.setTimeout,
        addEvent = function addEvent(el, e, callback, capture) {
        if (hasEventListeners) {
            el.addEventListener(e, callback, !!capture);
        } else {
            el.attachEvent('on' + e, callback);
        }
    },
        removeEvent = function removeEvent(el, e, callback, capture) {
        if (hasEventListeners) {
            el.removeEventListener(e, callback, !!capture);
        } else {
            el.detachEvent('on' + e, callback);
        }
    },
        trim = function trim(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    },
        hasClass = function hasClass(el, cn) {
        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    },
        addClass = function addClass(el, cn) {
        if (!hasClass(el, cn)) {
            el.className = el.className === '' ? cn : el.className + ' ' + cn;
        }
    },
        removeClass = function removeClass(el, cn) {
        el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    },
        isArray = function isArray(obj) {
        return (/Array/.test(Object.prototype.toString.call(obj))
        );
    },
        isDate = function isDate(obj) {
        return (/Date/.test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime())
        );
    },
        isWeekend = function isWeekend(date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    },
        isLeapYear = function isLeapYear(year) {
        // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    },
        getDaysInMonth = function getDaysInMonth(year, month) {
        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },
        setToStartOfDay = function setToStartOfDay(date) {
        if (isDate(date)) date.setHours(0, 0, 0, 0);
    },
        compareDates = function compareDates(a, b) {
        // weak date comparison (use setToStartOfDay(date) to ensure correct result)
        return a.getTime() === b.getTime();
    },
        extend = function extend(to, from, overwrite) {
        var prop, hasProp;
        for (prop in from) {
            hasProp = to[prop] !== undefined;
            if (hasProp && _typeof(from[prop]) === 'object' && from[prop] !== null && from[prop].nodeName === undefined) {
                if (isDate(from[prop])) {
                    if (overwrite) {
                        to[prop] = new Date(from[prop].getTime());
                    }
                } else if (isArray(from[prop])) {
                    if (overwrite) {
                        to[prop] = from[prop].slice(0);
                    }
                } else {
                    to[prop] = extend({}, from[prop], overwrite);
                }
            } else if (overwrite || !hasProp) {
                to[prop] = from[prop];
            }
        }
        return to;
    },
        fireEvent = function fireEvent(el, eventName, data) {
        var ev;

        if (document.createEvent) {
            ev = document.createEvent('HTMLEvents');
            ev.initEvent(eventName, true, false);
            ev = extend(ev, data);
            el.dispatchEvent(ev);
        } else if (document.createEventObject) {
            ev = document.createEventObject();
            ev = extend(ev, data);
            el.fireEvent('on' + eventName, ev);
        }
    },
        adjustCalendar = function adjustCalendar(calendar) {
        if (calendar.month < 0) {
            calendar.year -= Math.ceil(Math.abs(calendar.month) / 12);
            calendar.month += 12;
        }
        if (calendar.month > 11) {
            calendar.year += Math.floor(Math.abs(calendar.month) / 12);
            calendar.month -= 12;
        }
        return calendar;
    },


    /**
     * defaults and localisation
     */
    defaults = {

        // bind the picker to a form field
        field: null,

        // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
        bound: undefined,

        // position of the datepicker, relative to the field (default to bottom & left)
        // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
        position: 'bottom left',

        // automatically fit in the viewport even if it means repositioning from the position option
        reposition: true,

        // the default output format for `.toString()` and `field` value
        format: 'YYYY-MM-DD',

        // the toString function which gets passed a current date object and format
        // and returns a string
        toString: null,

        // used to create date object from current input string
        parse: null,

        // the initial date to view when first opened
        defaultDate: null,

        // make the `defaultDate` the initial selected value
        setDefaultDate: false,

        // first day of week (0: Sunday, 1: Monday etc)
        firstDay: 0,

        // the default flag for moment's strict date parsing
        formatStrict: false,

        // the minimum/earliest date that can be selected
        minDate: null,
        // the maximum/latest date that can be selected
        maxDate: null,

        // number of years either side, or array of upper/lower range
        yearRange: 10,

        // show week numbers at head of row
        showWeekNumber: false,

        // Week picker mode
        pickWholeWeek: false,

        // used internally (don't config outside)
        minYear: 0,
        maxYear: 9999,
        minMonth: undefined,
        maxMonth: undefined,

        startRange: null,
        endRange: null,

        isRTL: false,

        // Additional text to append to the year in the calendar title
        yearSuffix: '',

        // Render the month after year in the calendar title
        showMonthAfterYear: false,

        // Render days of the calendar grid that fall in the next or previous month
        showDaysInNextAndPreviousMonths: false,

        // Allows user to select days that fall in the next or previous month
        enableSelectionDaysInNextAndPreviousMonths: false,

        // how many months are visible
        numberOfMonths: 1,

        // when numberOfMonths is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`)
        // only used for the first display or when a selected date is not visible
        mainCalendar: 'left',

        // Specify a DOM element to render the calendar in
        container: undefined,

        // Blur field when date is selected
        blurFieldOnSelect: true,

        // internationalization
        i18n: {
            previousMonth: 'Previous Month',
            nextMonth: 'Next Month',
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },

        // Theme Classname
        theme: null,

        // events array
        events: [],

        // callback function
        onSelect: null,
        onOpen: null,
        onClose: null,
        onDraw: null,

        // Enable keyboard input
        keyboardInput: true
    },


    /**
     * templating functions to abstract HTML rendering
     */
    renderDayName = function renderDayName(opts, day, abbr) {
        day += opts.firstDay;
        while (day >= 7) {
            day -= 7;
        }
        return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
    },
        renderDay = function renderDay(opts) {
        var arr = [];
        var ariaSelected = 'false';
        if (opts.isEmpty) {
            if (opts.showDaysInNextAndPreviousMonths) {
                arr.push('is-outside-current-month');

                if (!opts.enableSelectionDaysInNextAndPreviousMonths) {
                    arr.push('is-selection-disabled');
                }
            } else {
                return '<td class="is-empty"></td>';
            }
        }
        if (opts.isDisabled) {
            arr.push('is-disabled');
        }
        if (opts.isToday) {
            arr.push('is-today');
        }
        if (opts.isSelected) {
            arr.push('is-selected');
            ariaSelected = 'true';
        }
        if (opts.hasEvent) {
            arr.push('has-event');
        }
        if (opts.isInRange) {
            arr.push('is-inrange');
        }
        if (opts.isStartRange) {
            arr.push('is-startrange');
        }
        if (opts.isEndRange) {
            arr.push('is-endrange');
        }
        return '<td data-day="' + opts.day + '" class="' + arr.join(' ') + '" aria-selected="' + ariaSelected + '">' + '<button class="pika-button pika-day" type="button" ' + 'data-pika-year="' + opts.year + '" data-pika-month="' + opts.month + '" data-pika-day="' + opts.day + '">' + opts.day + '</button>' + '</td>';
    },
        renderWeek = function renderWeek(d, m, y) {
        // Lifted from http://javascript.about.com/library/blweekyear.htm, lightly modified.
        var onejan = new Date(y, 0, 1),
            weekNum = Math.ceil(((new Date(y, m, d) - onejan) / 86400000 + onejan.getDay() + 1) / 7);
        return '<td class="pika-week">' + weekNum + '</td>';
    },
        renderRow = function renderRow(days, isRTL, pickWholeWeek, isRowSelected) {
        return '<tr class="pika-row' + (pickWholeWeek ? ' pick-whole-week' : '') + (isRowSelected ? ' is-selected' : '') + '">' + (isRTL ? days.reverse() : days).join('') + '</tr>';
    },
        renderBody = function renderBody(rows) {
        return '<tbody>' + rows.join('') + '</tbody>';
    },
        renderHead = function renderHead(opts) {
        var i,
            arr = [];
        if (opts.showWeekNumber) {
            arr.push('<th></th>');
        }
        for (i = 0; i < 7; i++) {
            arr.push('<th scope="col"><abbr title="' + renderDayName(opts, i) + '">' + renderDayName(opts, i, true) + '</abbr></th>');
        }
        return '<thead><tr>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</tr></thead>';
    },
        renderTitle = function renderTitle(instance, c, year, month, refYear, randId) {
        var i,
            j,
            arr,
            opts = instance._o,
            isMinYear = year === opts.minYear,
            isMaxYear = year === opts.maxYear,
            html = '<div id="' + randId + '" class="pika-title" role="heading" aria-live="assertive">',
            monthHtml,
            yearHtml,
            prev = true,
            next = true;

        for (arr = [], i = 0; i < 12; i++) {
            arr.push('<option value="' + (year === refYear ? i - c : 12 + i - c) + '"' + (i === month ? ' selected="selected"' : '') + (isMinYear && i < opts.minMonth || isMaxYear && i > opts.maxMonth ? 'disabled="disabled"' : '') + '>' + opts.i18n.months[i] + '</option>');
        }

        monthHtml = '<div class="pika-label">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month" tabindex="-1">' + arr.join('') + '</select></div>';

        if (isArray(opts.yearRange)) {
            i = opts.yearRange[0];
            j = opts.yearRange[1] + 1;
        } else {
            i = year - opts.yearRange;
            j = 1 + year + opts.yearRange;
        }

        for (arr = []; i < j && i <= opts.maxYear; i++) {
            if (i >= opts.minYear) {
                arr.push('<option value="' + i + '"' + (i === year ? ' selected="selected"' : '') + '>' + i + '</option>');
            }
        }
        yearHtml = '<div class="pika-label">' + year + opts.yearSuffix + '<select class="pika-select pika-select-year" tabindex="-1">' + arr.join('') + '</select></div>';

        if (opts.showMonthAfterYear) {
            html += yearHtml + monthHtml;
        } else {
            html += monthHtml + yearHtml;
        }

        if (isMinYear && (month === 0 || opts.minMonth >= month)) {
            prev = false;
        }

        if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
            next = false;
        }

        if (c === 0) {
            html += '<button class="pika-prev' + (prev ? '' : ' is-disabled') + '" type="button">' + opts.i18n.previousMonth + '</button>';
        }
        if (c === instance._o.numberOfMonths - 1) {
            html += '<button class="pika-next' + (next ? '' : ' is-disabled') + '" type="button">' + opts.i18n.nextMonth + '</button>';
        }

        return html += '</div>';
    },
        renderTable = function renderTable(opts, data, randId) {
        return '<table cellpadding="0" cellspacing="0" class="pika-table" role="grid" aria-labelledby="' + randId + '">' + renderHead(opts) + renderBody(data) + '</table>';
    },


    /**
     * Pikaday constructor
     */
    Pikaday = function Pikaday(options) {
        var self = this,
            opts = self.config(options);

        self._onMouseDown = function (e) {
            if (!self._v) {
                return;
            }
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            if (!hasClass(target, 'is-disabled')) {
                if (hasClass(target, 'pika-button') && !hasClass(target, 'is-empty') && !hasClass(target.parentNode, 'is-disabled')) {
                    self.setDate(new Date(target.getAttribute('data-pika-year'), target.getAttribute('data-pika-month'), target.getAttribute('data-pika-day')));
                    if (opts.bound) {
                        sto(function () {
                            self.hide();
                            if (opts.blurFieldOnSelect && opts.field) {
                                opts.field.blur();
                            }
                        }, 100);
                    }
                } else if (hasClass(target, 'pika-prev')) {
                    self.prevMonth();
                } else if (hasClass(target, 'pika-next')) {
                    self.nextMonth();
                }
            }
            if (!hasClass(target, 'pika-select')) {
                // if this is touch event prevent mouse events emulation
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                    return false;
                }
            } else {
                self._c = true;
            }
        };

        self._onChange = function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }
            if (hasClass(target, 'pika-select-month')) {
                self.gotoMonth(target.value);
            } else if (hasClass(target, 'pika-select-year')) {
                self.gotoYear(target.value);
            }
        };

        self._onKeyChange = function (e) {
            e = e || window.event;

            if (self.isVisible()) {

                switch (e.keyCode) {
                    case 13:
                    case 27:
                        if (opts.field) {
                            opts.field.blur();
                        }
                        break;
                    case 37:
                        e.preventDefault();
                        self.adjustDate('subtract', 1);
                        break;
                    case 38:
                        self.adjustDate('subtract', 7);
                        break;
                    case 39:
                        self.adjustDate('add', 1);
                        break;
                    case 40:
                        self.adjustDate('add', 7);
                        break;
                }
            }
        };

        self._onInputChange = function (e) {
            var date;

            if (e.firedBy === self) {
                return;
            }
            if (opts.parse) {
                date = opts.parse(opts.field.value, opts.format);
            } else if (hasMoment) {
                date = moment(opts.field.value, opts.format, opts.formatStrict);
                date = date && date.isValid() ? date.toDate() : null;
            } else {
                date = new Date(Date.parse(opts.field.value));
            }
            if (isDate(date)) {
                self.setDate(date);
            }
            if (!self._v) {
                self.show();
            }
        };

        self._onInputFocus = function () {
            self.show();
        };

        self._onInputClick = function () {
            self.show();
        };

        self._onInputBlur = function () {
            // IE allows pika div to gain focus; catch blur the input field
            var pEl = document.activeElement;
            do {
                if (hasClass(pEl, 'pika-single')) {
                    return;
                }
            } while (pEl = pEl.parentNode);

            if (!self._c) {
                self._b = sto(function () {
                    self.hide();
                }, 50);
            }
            self._c = false;
        };

        self._onClick = function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement,
                pEl = target;
            if (!target) {
                return;
            }
            if (!hasEventListeners && hasClass(target, 'pika-select')) {
                if (!target.onchange) {
                    target.setAttribute('onchange', 'return;');
                    addEvent(target, 'change', self._onChange);
                }
            }
            do {
                if (hasClass(pEl, 'pika-single') || pEl === opts.trigger) {
                    return;
                }
            } while (pEl = pEl.parentNode);
            if (self._v && target !== opts.trigger && pEl !== opts.trigger) {
                self.hide();
            }
        };

        self.el = document.createElement('div');
        self.el.className = 'pika-single' + (opts.isRTL ? ' is-rtl' : '') + (opts.theme ? ' ' + opts.theme : '');

        addEvent(self.el, 'mousedown', self._onMouseDown, true);
        addEvent(self.el, 'touchend', self._onMouseDown, true);
        addEvent(self.el, 'change', self._onChange);

        if (opts.keyboardInput) {
            addEvent(document, 'keydown', self._onKeyChange);
        }

        if (opts.field) {
            if (opts.container) {
                opts.container.appendChild(self.el);
            } else if (opts.bound) {
                document.body.appendChild(self.el);
            } else {
                opts.field.parentNode.insertBefore(self.el, opts.field.nextSibling);
            }
            addEvent(opts.field, 'change', self._onInputChange);

            if (!opts.defaultDate) {
                if (hasMoment && opts.field.value) {
                    opts.defaultDate = moment(opts.field.value, opts.format).toDate();
                } else {
                    opts.defaultDate = new Date(Date.parse(opts.field.value));
                }
                opts.setDefaultDate = true;
            }
        }

        var defDate = opts.defaultDate;

        if (isDate(defDate)) {
            if (opts.setDefaultDate) {
                self.setDate(defDate, true);
            } else {
                self.gotoDate(defDate);
            }
        } else {
            self.gotoDate(new Date());
        }

        if (opts.bound) {
            this.hide();
            self.el.className += ' is-bound';
            addEvent(opts.trigger, 'click', self._onInputClick);
            addEvent(opts.trigger, 'focus', self._onInputFocus);
            addEvent(opts.trigger, 'blur', self._onInputBlur);
        } else {
            this.show();
        }
    };

    /**
     * public Pikaday API
     */
    Pikaday.prototype = {

        /**
         * configure functionality
         */
        config: function config(options) {
            if (!this._o) {
                this._o = extend({}, defaults, true);
            }

            var opts = extend(this._o, options, true);

            opts.isRTL = !!opts.isRTL;

            opts.field = opts.field && opts.field.nodeName ? opts.field : null;

            opts.theme = typeof opts.theme === 'string' && opts.theme ? opts.theme : null;

            opts.bound = !!(opts.bound !== undefined ? opts.field && opts.bound : opts.field);

            opts.trigger = opts.trigger && opts.trigger.nodeName ? opts.trigger : opts.field;

            opts.disableWeekends = !!opts.disableWeekends;

            opts.disableDayFn = typeof opts.disableDayFn === 'function' ? opts.disableDayFn : null;

            var nom = parseInt(opts.numberOfMonths, 10) || 1;
            opts.numberOfMonths = nom > 4 ? 4 : nom;

            if (!isDate(opts.minDate)) {
                opts.minDate = false;
            }
            if (!isDate(opts.maxDate)) {
                opts.maxDate = false;
            }
            if (opts.minDate && opts.maxDate && opts.maxDate < opts.minDate) {
                opts.maxDate = opts.minDate = false;
            }
            if (opts.minDate) {
                this.setMinDate(opts.minDate);
            }
            if (opts.maxDate) {
                this.setMaxDate(opts.maxDate);
            }

            if (isArray(opts.yearRange)) {
                var fallback = new Date().getFullYear() - 10;
                opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
                opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
            } else {
                opts.yearRange = Math.abs(parseInt(opts.yearRange, 10)) || defaults.yearRange;
                if (opts.yearRange > 100) {
                    opts.yearRange = 100;
                }
            }

            return opts;
        },

        /**
         * return a formatted string of the current selection (using Moment.js if available)
         */
        toString: function toString(format) {
            format = format || this._o.format;
            if (!isDate(this._d)) {
                return '';
            }
            if (this._o.toString) {
                return this._o.toString(this._d, format);
            }
            if (hasMoment) {
                return moment(this._d).format(format);
            }
            return this._d.toDateString();
        },

        /**
         * return a Moment.js object of the current selection (if available)
         */
        getMoment: function getMoment() {
            return hasMoment ? moment(this._d) : null;
        },

        /**
         * set the current selection from a Moment.js object (if available)
         */
        setMoment: function setMoment(date, preventOnSelect) {
            if (hasMoment && moment.isMoment(date)) {
                this.setDate(date.toDate(), preventOnSelect);
            }
        },

        /**
         * return a Date object of the current selection
         */
        getDate: function getDate() {
            return isDate(this._d) ? new Date(this._d.getTime()) : null;
        },

        /**
         * set the current selection
         */
        setDate: function setDate(date, preventOnSelect) {
            if (!date) {
                this._d = null;

                if (this._o.field) {
                    this._o.field.value = '';
                    fireEvent(this._o.field, 'change', { firedBy: this });
                }

                return this.draw();
            }
            if (typeof date === 'string') {
                date = new Date(Date.parse(date));
            }
            if (!isDate(date)) {
                return;
            }

            var min = this._o.minDate,
                max = this._o.maxDate;

            if (isDate(min) && date < min) {
                date = min;
            } else if (isDate(max) && date > max) {
                date = max;
            }

            this._d = new Date(date.getTime());
            setToStartOfDay(this._d);
            this.gotoDate(this._d);

            if (this._o.field) {
                this._o.field.value = this.toString();
                fireEvent(this._o.field, 'change', { firedBy: this });
            }
            if (!preventOnSelect && typeof this._o.onSelect === 'function') {
                this._o.onSelect.call(this, this.getDate());
            }
        },

        /**
         * change view to a specific date
         */
        gotoDate: function gotoDate(date) {
            var newCalendar = true;

            if (!isDate(date)) {
                return;
            }

            if (this.calendars) {
                var firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1),
                    lastVisibleDate = new Date(this.calendars[this.calendars.length - 1].year, this.calendars[this.calendars.length - 1].month, 1),
                    visibleDate = date.getTime();
                // get the end of the month
                lastVisibleDate.setMonth(lastVisibleDate.getMonth() + 1);
                lastVisibleDate.setDate(lastVisibleDate.getDate() - 1);
                newCalendar = visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate;
            }

            if (newCalendar) {
                this.calendars = [{
                    month: date.getMonth(),
                    year: date.getFullYear()
                }];
                if (this._o.mainCalendar === 'right') {
                    this.calendars[0].month += 1 - this._o.numberOfMonths;
                }
            }

            this.adjustCalendars();
        },

        adjustDate: function adjustDate(sign, days) {

            var day = this.getDate() || new Date();
            var difference = parseInt(days) * 24 * 60 * 60 * 1000;

            var newDay;

            if (sign === 'add') {
                newDay = new Date(day.valueOf() + difference);
            } else if (sign === 'subtract') {
                newDay = new Date(day.valueOf() - difference);
            }

            this.setDate(newDay);
        },

        adjustCalendars: function adjustCalendars() {
            this.calendars[0] = adjustCalendar(this.calendars[0]);
            for (var c = 1; c < this._o.numberOfMonths; c++) {
                this.calendars[c] = adjustCalendar({
                    month: this.calendars[0].month + c,
                    year: this.calendars[0].year
                });
            }
            this.draw();
        },

        gotoToday: function gotoToday() {
            this.gotoDate(new Date());
        },

        /**
         * change view to a specific month (zero-index, e.g. 0: January)
         */
        gotoMonth: function gotoMonth(month) {
            if (!isNaN(month)) {
                this.calendars[0].month = parseInt(month, 10);
                this.adjustCalendars();
            }
        },

        nextMonth: function nextMonth() {
            this.calendars[0].month++;
            this.adjustCalendars();
        },

        prevMonth: function prevMonth() {
            this.calendars[0].month--;
            this.adjustCalendars();
        },

        /**
         * change view to a specific full year (e.g. "2012")
         */
        gotoYear: function gotoYear(year) {
            if (!isNaN(year)) {
                this.calendars[0].year = parseInt(year, 10);
                this.adjustCalendars();
            }
        },

        /**
         * change the minDate
         */
        setMinDate: function setMinDate(value) {
            if (value instanceof Date) {
                setToStartOfDay(value);
                this._o.minDate = value;
                this._o.minYear = value.getFullYear();
                this._o.minMonth = value.getMonth();
            } else {
                this._o.minDate = defaults.minDate;
                this._o.minYear = defaults.minYear;
                this._o.minMonth = defaults.minMonth;
                this._o.startRange = defaults.startRange;
            }

            this.draw();
        },

        /**
         * change the maxDate
         */
        setMaxDate: function setMaxDate(value) {
            if (value instanceof Date) {
                setToStartOfDay(value);
                this._o.maxDate = value;
                this._o.maxYear = value.getFullYear();
                this._o.maxMonth = value.getMonth();
            } else {
                this._o.maxDate = defaults.maxDate;
                this._o.maxYear = defaults.maxYear;
                this._o.maxMonth = defaults.maxMonth;
                this._o.endRange = defaults.endRange;
            }

            this.draw();
        },

        setStartRange: function setStartRange(value) {
            this._o.startRange = value;
        },

        setEndRange: function setEndRange(value) {
            this._o.endRange = value;
        },

        /**
         * refresh the HTML
         */
        draw: function draw(force) {
            if (!this._v && !force) {
                return;
            }
            var opts = this._o,
                minYear = opts.minYear,
                maxYear = opts.maxYear,
                minMonth = opts.minMonth,
                maxMonth = opts.maxMonth,
                html = '',
                randId;

            if (this._y <= minYear) {
                this._y = minYear;
                if (!isNaN(minMonth) && this._m < minMonth) {
                    this._m = minMonth;
                }
            }
            if (this._y >= maxYear) {
                this._y = maxYear;
                if (!isNaN(maxMonth) && this._m > maxMonth) {
                    this._m = maxMonth;
                }
            }

            randId = 'pika-title-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 2);

            for (var c = 0; c < opts.numberOfMonths; c++) {
                html += '<div class="pika-lendar">' + renderTitle(this, c, this.calendars[c].year, this.calendars[c].month, this.calendars[0].year, randId) + this.render(this.calendars[c].year, this.calendars[c].month, randId) + '</div>';
            }

            this.el.innerHTML = html;

            if (opts.bound) {
                if (opts.field.type !== 'hidden') {
                    sto(function () {
                        opts.trigger.focus();
                    }, 1);
                }
            }

            if (typeof this._o.onDraw === 'function') {
                this._o.onDraw(this);
            }

            if (opts.bound) {
                // let the screen reader user know to use arrow keys
                opts.field.setAttribute('aria-label', 'Use the arrow keys to pick a date');
            }
        },

        adjustPosition: function adjustPosition() {
            var field, pEl, width, height, viewportWidth, viewportHeight, scrollTop, left, top, clientRect;

            if (this._o.container) return;

            this.el.style.position = 'absolute';

            field = this._o.trigger;
            pEl = field;
            width = this.el.offsetWidth;
            height = this.el.offsetHeight;
            viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;

            if (typeof field.getBoundingClientRect === 'function') {
                clientRect = field.getBoundingClientRect();
                left = clientRect.left + window.pageXOffset;
                top = clientRect.bottom + window.pageYOffset;
            } else {
                left = pEl.offsetLeft;
                top = pEl.offsetTop + pEl.offsetHeight;
                while (pEl = pEl.offsetParent) {
                    left += pEl.offsetLeft;
                    top += pEl.offsetTop;
                }
            }

            // default position is bottom & left
            if (this._o.reposition && left + width > viewportWidth || this._o.position.indexOf('right') > -1 && left - width + field.offsetWidth > 0) {
                left = left - width + field.offsetWidth;
            }
            if (this._o.reposition && top + height > viewportHeight + scrollTop || this._o.position.indexOf('top') > -1 && top - height - field.offsetHeight > 0) {
                top = top - height - field.offsetHeight;
            }

            this.el.style.left = left + 'px';
            this.el.style.top = top + 'px';
        },

        /**
         * render HTML for a particular month
         */
        render: function render(year, month, randId) {
            var opts = this._o,
                now = new Date(),
                days = getDaysInMonth(year, month),
                before = new Date(year, month, 1).getDay(),
                data = [],
                row = [];
            setToStartOfDay(now);
            if (opts.firstDay > 0) {
                before -= opts.firstDay;
                if (before < 0) {
                    before += 7;
                }
            }
            var previousMonth = month === 0 ? 11 : month - 1,
                nextMonth = month === 11 ? 0 : month + 1,
                yearOfPreviousMonth = month === 0 ? year - 1 : year,
                yearOfNextMonth = month === 11 ? year + 1 : year,
                daysInPreviousMonth = getDaysInMonth(yearOfPreviousMonth, previousMonth);
            var cells = days + before,
                after = cells;
            while (after > 7) {
                after -= 7;
            }
            cells += 7 - after;
            var isWeekSelected = false;
            for (var i = 0, r = 0; i < cells; i++) {
                var day = new Date(year, month, 1 + (i - before)),
                    isSelected = isDate(this._d) ? compareDates(day, this._d) : false,
                    isToday = compareDates(day, now),
                    hasEvent = opts.events.indexOf(day.toDateString()) !== -1 ? true : false,
                    isEmpty = i < before || i >= days + before,
                    dayNumber = 1 + (i - before),
                    monthNumber = month,
                    yearNumber = year,
                    isStartRange = opts.startRange && compareDates(opts.startRange, day),
                    isEndRange = opts.endRange && compareDates(opts.endRange, day),
                    isInRange = opts.startRange && opts.endRange && opts.startRange < day && day < opts.endRange,
                    isDisabled = opts.minDate && day < opts.minDate || opts.maxDate && day > opts.maxDate || opts.disableWeekends && isWeekend(day) || opts.disableDayFn && opts.disableDayFn(day);

                if (isEmpty) {
                    if (i < before) {
                        dayNumber = daysInPreviousMonth + dayNumber;
                        monthNumber = previousMonth;
                        yearNumber = yearOfPreviousMonth;
                    } else {
                        dayNumber = dayNumber - days;
                        monthNumber = nextMonth;
                        yearNumber = yearOfNextMonth;
                    }
                }

                var dayConfig = {
                    day: dayNumber,
                    month: monthNumber,
                    year: yearNumber,
                    hasEvent: hasEvent,
                    isSelected: isSelected,
                    isToday: isToday,
                    isDisabled: isDisabled,
                    isEmpty: isEmpty,
                    isStartRange: isStartRange,
                    isEndRange: isEndRange,
                    isInRange: isInRange,
                    showDaysInNextAndPreviousMonths: opts.showDaysInNextAndPreviousMonths,
                    enableSelectionDaysInNextAndPreviousMonths: opts.enableSelectionDaysInNextAndPreviousMonths
                };

                if (opts.pickWholeWeek && isSelected) {
                    isWeekSelected = true;
                }

                row.push(renderDay(dayConfig));

                if (++r === 7) {
                    if (opts.showWeekNumber) {
                        row.unshift(renderWeek(i - before, month, year));
                    }
                    data.push(renderRow(row, opts.isRTL, opts.pickWholeWeek, isWeekSelected));
                    row = [];
                    r = 0;
                    isWeekSelected = false;
                }
            }
            return renderTable(opts, data, randId);
        },

        isVisible: function isVisible() {
            return this._v;
        },

        show: function show() {
            if (!this.isVisible()) {
                this._v = true;
                this.draw();
                removeClass(this.el, 'is-hidden');
                if (this._o.bound) {
                    addEvent(document, 'click', this._onClick);
                    this.adjustPosition();
                }
                if (typeof this._o.onOpen === 'function') {
                    this._o.onOpen.call(this);
                }
            }
        },

        hide: function hide() {
            var v = this._v;
            if (v !== false) {
                if (this._o.bound) {
                    removeEvent(document, 'click', this._onClick);
                }
                this.el.style.position = 'static'; // reset
                this.el.style.left = 'auto';
                this.el.style.top = 'auto';
                addClass(this.el, 'is-hidden');
                this._v = false;
                if (v !== undefined && typeof this._o.onClose === 'function') {
                    this._o.onClose.call(this);
                }
            }
        },

        /**
         * GAME OVER
         */
        destroy: function destroy() {
            var opts = this._o;

            this.hide();
            removeEvent(this.el, 'mousedown', this._onMouseDown, true);
            removeEvent(this.el, 'touchend', this._onMouseDown, true);
            removeEvent(this.el, 'change', this._onChange);
            if (opts.keyboardInput) {
                removeEvent(document, 'keydown', this._onKeyChange);
            }
            if (opts.field) {
                removeEvent(opts.field, 'change', this._onInputChange);
                if (opts.bound) {
                    removeEvent(opts.trigger, 'click', this._onInputClick);
                    removeEvent(opts.trigger, 'focus', this._onInputFocus);
                    removeEvent(opts.trigger, 'blur', this._onInputBlur);
                }
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        }

    };

    return Pikaday;
});

},{"moment":3}],99:[function(require,module,exports){
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

},{}]},{},[87])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZmlsdGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FycmF5LWZvcmVhY2gvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9saWIvX2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2NsYXNzbGlzdC1wb2x5ZmlsbC9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9mbi9hcnJheS9mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vb2JqZWN0L2Fzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2EtZnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NsYXNzb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY3JlYXRlLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY3R4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVmaW5lZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19leHBvcnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mYWlscy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2dsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2hhcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2hpZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19odG1sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRldGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2xpYnJhcnkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LXBpZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19yZWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2hhcmVkLWtleS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWFic29sdXRlLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1sZW5ndGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL191aWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL193a3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2RvbXJlYWR5L3JlYWR5LmpzIiwibm9kZV9tb2R1bGVzL2VsZW0tZGF0YXNldC9kaXN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VsZW1lbnQtY2xvc2VzdC9lbGVtZW50LWNsb3Nlc3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvYmVoYXZpb3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvY29tcG9zZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9kZWxlZ2F0ZUFsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9kZWxlZ2F0ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9vbmNlL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWNjb3JkaW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jb2xsYXBzZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RhdGVwaWNrZXIuanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2luZGV4LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbW9kYWwuanMiLCJzcmMvanMvY29tcG9uZW50cy9uYXZpZ2F0aW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmFkaW8tdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9yZWdleC1pbnB1dC1tYXNrLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvc2tpcG5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYmxlLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9vbHRpcC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3ZhbGlkYXRvci5qcyIsInNyYy9qcy9jb25maWcuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvZXZlbnRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9lbGVtZW50LWhpZGRlbi5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvaW5kZXguanMiLCJzcmMvanMvdXRpbHMvYmVoYXZpb3IuanMiLCJzcmMvanMvdXRpbHMvY2xvc2VzdC5qcyIsInNyYy9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInNyYy9qcy91dGlscy9zZWxlY3QuanMiLCJzcmMvanMvdXRpbHMvdG9nZ2xlLmpzIiwic3JjL2pzL3V0aWxzL3ZhbGlkYXRlLWlucHV0LmpzIiwic3JjL3ZlbmRvci9taWNyb21vZGFsLmpzIiwic3JjL3ZlbmRvci9waWthZGF5LmpzIiwic3JjL3ZlbmRvci90aXBweWpzL3RpcHB5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTs7Ozs7Ozs7OztBQVVBLE9BQU8sT0FBUCxHQUFpQixVQUFVLEdBQVYsRUFBZSxFQUFmLEVBQW1CLElBQW5CLEVBQXlCO0FBQ3hDLE1BQUksSUFBSSxNQUFSLEVBQWdCLE9BQU8sSUFBSSxNQUFKLENBQVcsRUFBWCxFQUFlLElBQWYsQ0FBUDtBQUNoQixNQUFJLEtBQUssQ0FBTCxLQUFXLEdBQVgsSUFBa0IsU0FBUyxHQUEvQixFQUFvQyxNQUFNLElBQUksU0FBSixFQUFOO0FBQ3BDLE1BQUksY0FBYyxPQUFPLEVBQXpCLEVBQTZCLE1BQU0sSUFBSSxTQUFKLEVBQU47QUFDN0IsTUFBSSxNQUFNLEVBQVY7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksSUFBSSxNQUF4QixFQUFnQyxHQUFoQyxFQUFxQztBQUNuQyxRQUFJLENBQUMsT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixDQUFqQixDQUFMLEVBQTBCO0FBQzFCLFFBQUksTUFBTSxJQUFJLENBQUosQ0FBVjtBQUNBLFFBQUksR0FBRyxJQUFILENBQVEsSUFBUixFQUFjLEdBQWQsRUFBbUIsQ0FBbkIsRUFBc0IsR0FBdEIsQ0FBSixFQUFnQyxJQUFJLElBQUosQ0FBUyxHQUFUO0FBQ2pDO0FBQ0QsU0FBTyxHQUFQO0FBQ0QsQ0FYRDs7QUFhQSxJQUFJLFNBQVMsT0FBTyxTQUFQLENBQWlCLGNBQTlCOzs7QUN4QkE7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFNBQVMsT0FBVCxDQUFrQixHQUFsQixFQUF1QixRQUF2QixFQUFpQyxPQUFqQyxFQUEwQztBQUN2RCxRQUFJLElBQUksT0FBUixFQUFpQjtBQUNiLFlBQUksT0FBSixDQUFZLFFBQVosRUFBc0IsT0FBdEI7QUFDQTtBQUNIO0FBQ0QsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLElBQUksTUFBeEIsRUFBZ0MsS0FBRyxDQUFuQyxFQUFzQztBQUNsQyxpQkFBUyxJQUFULENBQWMsT0FBZCxFQUF1QixJQUFJLENBQUosQ0FBdkIsRUFBK0IsQ0FBL0IsRUFBa0MsR0FBbEM7QUFDSDtBQUNKLENBUkQ7OztBQ2JBO0FBQ0E7Ozs7QUNEQTs7Ozs7Ozs7O0FBU0E7O0FBRUE7O0FBRUEsSUFBSSxjQUFjLE9BQU8sSUFBekIsRUFBK0I7O0FBRS9CO0FBQ0E7QUFDQSxLQUFJLEVBQUUsZUFBZSxTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBakIsS0FDQSxTQUFTLGVBQVQsSUFBNEIsRUFBRSxlQUFlLFNBQVMsZUFBVCxDQUF5Qiw0QkFBekIsRUFBc0QsR0FBdEQsQ0FBakIsQ0FEaEMsRUFDOEc7O0FBRTdHLGFBQVUsSUFBVixFQUFnQjs7QUFFakI7O0FBRUEsT0FBSSxFQUFFLGFBQWEsSUFBZixDQUFKLEVBQTBCOztBQUUxQixPQUNHLGdCQUFnQixXQURuQjtBQUFBLE9BRUcsWUFBWSxXQUZmO0FBQUEsT0FHRyxlQUFlLEtBQUssT0FBTCxDQUFhLFNBQWIsQ0FIbEI7QUFBQSxPQUlHLFNBQVMsTUFKWjtBQUFBLE9BS0csVUFBVSxPQUFPLFNBQVAsRUFBa0IsSUFBbEIsSUFBMEIsWUFBWTtBQUNqRCxXQUFPLEtBQUssT0FBTCxDQUFhLFlBQWIsRUFBMkIsRUFBM0IsQ0FBUDtBQUNBLElBUEY7QUFBQSxPQVFHLGFBQWEsTUFBTSxTQUFOLEVBQWlCLE9BQWpCLElBQTRCLFVBQVUsSUFBVixFQUFnQjtBQUMxRCxRQUNHLElBQUksQ0FEUDtBQUFBLFFBRUcsTUFBTSxLQUFLLE1BRmQ7QUFJQSxXQUFPLElBQUksR0FBWCxFQUFnQixHQUFoQixFQUFxQjtBQUNwQixTQUFJLEtBQUssSUFBTCxJQUFhLEtBQUssQ0FBTCxNQUFZLElBQTdCLEVBQW1DO0FBQ2xDLGFBQU8sQ0FBUDtBQUNBO0FBQ0Q7QUFDRCxXQUFPLENBQUMsQ0FBUjtBQUNBO0FBQ0Q7QUFwQkQ7QUFBQSxPQXFCRyxRQUFRLFNBQVIsS0FBUSxDQUFVLElBQVYsRUFBZ0IsT0FBaEIsRUFBeUI7QUFDbEMsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFNBQUssSUFBTCxHQUFZLGFBQWEsSUFBYixDQUFaO0FBQ0EsU0FBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLElBekJGO0FBQUEsT0EwQkcsd0JBQXdCLFNBQXhCLHFCQUF3QixDQUFVLFNBQVYsRUFBcUIsS0FBckIsRUFBNEI7QUFDckQsUUFBSSxVQUFVLEVBQWQsRUFBa0I7QUFDakIsV0FBTSxJQUFJLEtBQUosQ0FDSCxZQURHLEVBRUgsNENBRkcsQ0FBTjtBQUlBO0FBQ0QsUUFBSSxLQUFLLElBQUwsQ0FBVSxLQUFWLENBQUosRUFBc0I7QUFDckIsV0FBTSxJQUFJLEtBQUosQ0FDSCx1QkFERyxFQUVILHNDQUZHLENBQU47QUFJQTtBQUNELFdBQU8sV0FBVyxJQUFYLENBQWdCLFNBQWhCLEVBQTJCLEtBQTNCLENBQVA7QUFDQSxJQXhDRjtBQUFBLE9BeUNHLFlBQVksU0FBWixTQUFZLENBQVUsSUFBVixFQUFnQjtBQUM3QixRQUNHLGlCQUFpQixRQUFRLElBQVIsQ0FBYSxLQUFLLFlBQUwsQ0FBa0IsT0FBbEIsS0FBOEIsRUFBM0MsQ0FEcEI7QUFBQSxRQUVHLFVBQVUsaUJBQWlCLGVBQWUsS0FBZixDQUFxQixLQUFyQixDQUFqQixHQUErQyxFQUY1RDtBQUFBLFFBR0csSUFBSSxDQUhQO0FBQUEsUUFJRyxNQUFNLFFBQVEsTUFKakI7QUFNQSxXQUFPLElBQUksR0FBWCxFQUFnQixHQUFoQixFQUFxQjtBQUNwQixVQUFLLElBQUwsQ0FBVSxRQUFRLENBQVIsQ0FBVjtBQUNBO0FBQ0QsU0FBSyxnQkFBTCxHQUF3QixZQUFZO0FBQ25DLFVBQUssWUFBTCxDQUFrQixPQUFsQixFQUEyQixLQUFLLFFBQUwsRUFBM0I7QUFDQSxLQUZEO0FBR0EsSUF0REY7QUFBQSxPQXVERyxpQkFBaUIsVUFBVSxTQUFWLElBQXVCLEVBdkQzQztBQUFBLE9Bd0RHLGtCQUFrQixTQUFsQixlQUFrQixHQUFZO0FBQy9CLFdBQU8sSUFBSSxTQUFKLENBQWMsSUFBZCxDQUFQO0FBQ0EsSUExREY7QUE0REE7QUFDQTtBQUNBLFNBQU0sU0FBTixJQUFtQixNQUFNLFNBQU4sQ0FBbkI7QUFDQSxrQkFBZSxJQUFmLEdBQXNCLFVBQVUsQ0FBVixFQUFhO0FBQ2xDLFdBQU8sS0FBSyxDQUFMLEtBQVcsSUFBbEI7QUFDQSxJQUZEO0FBR0Esa0JBQWUsUUFBZixHQUEwQixVQUFVLEtBQVYsRUFBaUI7QUFDMUMsYUFBUyxFQUFUO0FBQ0EsV0FBTyxzQkFBc0IsSUFBdEIsRUFBNEIsS0FBNUIsTUFBdUMsQ0FBQyxDQUEvQztBQUNBLElBSEQ7QUFJQSxrQkFBZSxHQUFmLEdBQXFCLFlBQVk7QUFDaEMsUUFDRyxTQUFTLFNBRFo7QUFBQSxRQUVHLElBQUksQ0FGUDtBQUFBLFFBR0csSUFBSSxPQUFPLE1BSGQ7QUFBQSxRQUlHLEtBSkg7QUFBQSxRQUtHLFVBQVUsS0FMYjtBQU9BLE9BQUc7QUFDRixhQUFRLE9BQU8sQ0FBUCxJQUFZLEVBQXBCO0FBQ0EsU0FBSSxzQkFBc0IsSUFBdEIsRUFBNEIsS0FBNUIsTUFBdUMsQ0FBQyxDQUE1QyxFQUErQztBQUM5QyxXQUFLLElBQUwsQ0FBVSxLQUFWO0FBQ0EsZ0JBQVUsSUFBVjtBQUNBO0FBQ0QsS0FORCxRQU9PLEVBQUUsQ0FBRixHQUFNLENBUGI7O0FBU0EsUUFBSSxPQUFKLEVBQWE7QUFDWixVQUFLLGdCQUFMO0FBQ0E7QUFDRCxJQXBCRDtBQXFCQSxrQkFBZSxNQUFmLEdBQXdCLFlBQVk7QUFDbkMsUUFDRyxTQUFTLFNBRFo7QUFBQSxRQUVHLElBQUksQ0FGUDtBQUFBLFFBR0csSUFBSSxPQUFPLE1BSGQ7QUFBQSxRQUlHLEtBSkg7QUFBQSxRQUtHLFVBQVUsS0FMYjtBQUFBLFFBTUcsS0FOSDtBQVFBLE9BQUc7QUFDRixhQUFRLE9BQU8sQ0FBUCxJQUFZLEVBQXBCO0FBQ0EsYUFBUSxzQkFBc0IsSUFBdEIsRUFBNEIsS0FBNUIsQ0FBUjtBQUNBLFlBQU8sVUFBVSxDQUFDLENBQWxCLEVBQXFCO0FBQ3BCLFdBQUssTUFBTCxDQUFZLEtBQVosRUFBbUIsQ0FBbkI7QUFDQSxnQkFBVSxJQUFWO0FBQ0EsY0FBUSxzQkFBc0IsSUFBdEIsRUFBNEIsS0FBNUIsQ0FBUjtBQUNBO0FBQ0QsS0FSRCxRQVNPLEVBQUUsQ0FBRixHQUFNLENBVGI7O0FBV0EsUUFBSSxPQUFKLEVBQWE7QUFDWixVQUFLLGdCQUFMO0FBQ0E7QUFDRCxJQXZCRDtBQXdCQSxrQkFBZSxNQUFmLEdBQXdCLFVBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QjtBQUMvQyxhQUFTLEVBQVQ7O0FBRUEsUUFDRyxTQUFTLEtBQUssUUFBTCxDQUFjLEtBQWQsQ0FEWjtBQUFBLFFBRUcsU0FBUyxTQUNWLFVBQVUsSUFBVixJQUFrQixRQURSLEdBR1YsVUFBVSxLQUFWLElBQW1CLEtBTHJCOztBQVFBLFFBQUksTUFBSixFQUFZO0FBQ1gsVUFBSyxNQUFMLEVBQWEsS0FBYjtBQUNBOztBQUVELFFBQUksVUFBVSxJQUFWLElBQWtCLFVBQVUsS0FBaEMsRUFBdUM7QUFDdEMsWUFBTyxLQUFQO0FBQ0EsS0FGRCxNQUVPO0FBQ04sWUFBTyxDQUFDLE1BQVI7QUFDQTtBQUNELElBcEJEO0FBcUJBLGtCQUFlLFFBQWYsR0FBMEIsWUFBWTtBQUNyQyxXQUFPLEtBQUssSUFBTCxDQUFVLEdBQVYsQ0FBUDtBQUNBLElBRkQ7O0FBSUEsT0FBSSxPQUFPLGNBQVgsRUFBMkI7QUFDMUIsUUFBSSxvQkFBb0I7QUFDckIsVUFBSyxlQURnQjtBQUVyQixpQkFBWSxJQUZTO0FBR3JCLG1CQUFjO0FBSE8sS0FBeEI7QUFLQSxRQUFJO0FBQ0gsWUFBTyxjQUFQLENBQXNCLFlBQXRCLEVBQW9DLGFBQXBDLEVBQW1ELGlCQUFuRDtBQUNBLEtBRkQsQ0FFRSxPQUFPLEVBQVAsRUFBVztBQUFFO0FBQ2Q7QUFDQTtBQUNBLFNBQUksR0FBRyxNQUFILEtBQWMsU0FBZCxJQUEyQixHQUFHLE1BQUgsS0FBYyxDQUFDLFVBQTlDLEVBQTBEO0FBQ3pELHdCQUFrQixVQUFsQixHQUErQixLQUEvQjtBQUNBLGFBQU8sY0FBUCxDQUFzQixZQUF0QixFQUFvQyxhQUFwQyxFQUFtRCxpQkFBbkQ7QUFDQTtBQUNEO0FBQ0QsSUFoQkQsTUFnQk8sSUFBSSxPQUFPLFNBQVAsRUFBa0IsZ0JBQXRCLEVBQXdDO0FBQzlDLGlCQUFhLGdCQUFiLENBQThCLGFBQTlCLEVBQTZDLGVBQTdDO0FBQ0E7QUFFQSxHQXRLQSxFQXNLQyxPQUFPLElBdEtSLENBQUQ7QUF3S0M7O0FBRUQ7QUFDQTs7QUFFQyxjQUFZO0FBQ1o7O0FBRUEsTUFBSSxjQUFjLFNBQVMsYUFBVCxDQUF1QixHQUF2QixDQUFsQjs7QUFFQSxjQUFZLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEIsSUFBMUIsRUFBZ0MsSUFBaEM7O0FBRUE7QUFDQTtBQUNBLE1BQUksQ0FBQyxZQUFZLFNBQVosQ0FBc0IsUUFBdEIsQ0FBK0IsSUFBL0IsQ0FBTCxFQUEyQztBQUMxQyxPQUFJLGVBQWUsU0FBZixZQUFlLENBQVMsTUFBVCxFQUFpQjtBQUNuQyxRQUFJLFdBQVcsYUFBYSxTQUFiLENBQXVCLE1BQXZCLENBQWY7O0FBRUEsaUJBQWEsU0FBYixDQUF1QixNQUF2QixJQUFpQyxVQUFTLEtBQVQsRUFBZ0I7QUFDaEQsU0FBSSxDQUFKO0FBQUEsU0FBTyxNQUFNLFVBQVUsTUFBdkI7O0FBRUEsVUFBSyxJQUFJLENBQVQsRUFBWSxJQUFJLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCO0FBQ3pCLGNBQVEsVUFBVSxDQUFWLENBQVI7QUFDQSxlQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CLEtBQXBCO0FBQ0E7QUFDRCxLQVBEO0FBUUEsSUFYRDtBQVlBLGdCQUFhLEtBQWI7QUFDQSxnQkFBYSxRQUFiO0FBQ0E7O0FBRUQsY0FBWSxTQUFaLENBQXNCLE1BQXRCLENBQTZCLElBQTdCLEVBQW1DLEtBQW5DOztBQUVBO0FBQ0E7QUFDQSxNQUFJLFlBQVksU0FBWixDQUFzQixRQUF0QixDQUErQixJQUEvQixDQUFKLEVBQTBDO0FBQ3pDLE9BQUksVUFBVSxhQUFhLFNBQWIsQ0FBdUIsTUFBckM7O0FBRUEsZ0JBQWEsU0FBYixDQUF1QixNQUF2QixHQUFnQyxVQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUI7QUFDdEQsUUFBSSxLQUFLLFNBQUwsSUFBa0IsQ0FBQyxLQUFLLFFBQUwsQ0FBYyxLQUFkLENBQUQsS0FBMEIsQ0FBQyxLQUFqRCxFQUF3RDtBQUN2RCxZQUFPLEtBQVA7QUFDQSxLQUZELE1BRU87QUFDTixZQUFPLFFBQVEsSUFBUixDQUFhLElBQWIsRUFBbUIsS0FBbkIsQ0FBUDtBQUNBO0FBQ0QsSUFORDtBQVFBOztBQUVELGdCQUFjLElBQWQ7QUFDQSxFQTVDQSxHQUFEO0FBOENDOzs7OztBQy9PRCxRQUFRLG1DQUFSO0FBQ0EsUUFBUSw4QkFBUjtBQUNBLE9BQU8sT0FBUCxHQUFpQixRQUFRLHFCQUFSLEVBQStCLEtBQS9CLENBQXFDLElBQXREOzs7OztBQ0ZBLFFBQVEsaUNBQVI7QUFDQSxPQUFPLE9BQVAsR0FBaUIsUUFBUSxxQkFBUixFQUErQixNQUEvQixDQUFzQyxNQUF2RDs7Ozs7QUNEQSxPQUFPLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWM7QUFDN0IsTUFBSSxPQUFPLEVBQVAsSUFBYSxVQUFqQixFQUE2QixNQUFNLFVBQVUsS0FBSyxxQkFBZixDQUFOO0FBQzdCLFNBQU8sRUFBUDtBQUNELENBSEQ7Ozs7O0FDQUEsSUFBSSxXQUFXLFFBQVEsY0FBUixDQUFmO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjO0FBQzdCLE1BQUksQ0FBQyxTQUFTLEVBQVQsQ0FBTCxFQUFtQixNQUFNLFVBQVUsS0FBSyxvQkFBZixDQUFOO0FBQ25CLFNBQU8sRUFBUDtBQUNELENBSEQ7Ozs7O0FDREE7QUFDQTtBQUNBLElBQUksWUFBWSxRQUFRLGVBQVIsQ0FBaEI7QUFDQSxJQUFJLFdBQVcsUUFBUSxjQUFSLENBQWY7QUFDQSxJQUFJLGtCQUFrQixRQUFRLHNCQUFSLENBQXRCO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLFVBQVUsV0FBVixFQUF1QjtBQUN0QyxTQUFPLFVBQVUsS0FBVixFQUFpQixFQUFqQixFQUFxQixTQUFyQixFQUFnQztBQUNyQyxRQUFJLElBQUksVUFBVSxLQUFWLENBQVI7QUFDQSxRQUFJLFNBQVMsU0FBUyxFQUFFLE1BQVgsQ0FBYjtBQUNBLFFBQUksUUFBUSxnQkFBZ0IsU0FBaEIsRUFBMkIsTUFBM0IsQ0FBWjtBQUNBLFFBQUksS0FBSjtBQUNBO0FBQ0E7QUFDQSxRQUFJLGVBQWUsTUFBTSxFQUF6QixFQUE2QixPQUFPLFNBQVMsS0FBaEIsRUFBdUI7QUFDbEQsY0FBUSxFQUFFLE9BQUYsQ0FBUjtBQUNBO0FBQ0EsVUFBSSxTQUFTLEtBQWIsRUFBb0IsT0FBTyxJQUFQO0FBQ3RCO0FBQ0MsS0FMRCxNQUtPLE9BQU0sU0FBUyxLQUFmLEVBQXNCLE9BQXRCO0FBQStCLFVBQUksZUFBZSxTQUFTLENBQTVCLEVBQStCO0FBQ25FLFlBQUksRUFBRSxLQUFGLE1BQWEsRUFBakIsRUFBcUIsT0FBTyxlQUFlLEtBQWYsSUFBd0IsQ0FBL0I7QUFDdEI7QUFGTSxLQUVMLE9BQU8sQ0FBQyxXQUFELElBQWdCLENBQUMsQ0FBeEI7QUFDSCxHQWZEO0FBZ0JELENBakJEOzs7OztBQ0xBO0FBQ0EsSUFBSSxNQUFNLFFBQVEsUUFBUixDQUFWO0FBQ0EsSUFBSSxNQUFNLFFBQVEsUUFBUixFQUFrQixhQUFsQixDQUFWO0FBQ0E7QUFDQSxJQUFJLE1BQU0sSUFBSSxZQUFZO0FBQUUsU0FBTyxTQUFQO0FBQW1CLENBQWpDLEVBQUosS0FBNEMsV0FBdEQ7O0FBRUE7QUFDQSxJQUFJLFNBQVMsU0FBVCxNQUFTLENBQVUsRUFBVixFQUFjLEdBQWQsRUFBbUI7QUFDOUIsTUFBSTtBQUNGLFdBQU8sR0FBRyxHQUFILENBQVA7QUFDRCxHQUZELENBRUUsT0FBTyxDQUFQLEVBQVUsQ0FBRSxXQUFhO0FBQzVCLENBSkQ7O0FBTUEsT0FBTyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjO0FBQzdCLE1BQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWO0FBQ0EsU0FBTyxPQUFPLFNBQVAsR0FBbUIsV0FBbkIsR0FBaUMsT0FBTyxJQUFQLEdBQWM7QUFDcEQ7QUFEc0MsSUFFcEMsUUFBUSxJQUFJLE9BQU8sSUFBSSxPQUFPLEVBQVAsQ0FBWCxFQUF1QixHQUF2QixDQUFaLEtBQTRDLFFBQTVDLEdBQXVEO0FBQ3pEO0FBREUsSUFFQSxNQUFNLElBQUksQ0FBSjtBQUNSO0FBREUsSUFFQSxDQUFDLElBQUksSUFBSSxDQUFKLENBQUwsS0FBZ0IsUUFBaEIsSUFBNEIsT0FBTyxFQUFFLE1BQVQsSUFBbUIsVUFBL0MsR0FBNEQsV0FBNUQsR0FBMEUsQ0FOOUU7QUFPRCxDQVREOzs7OztBQ2JBLElBQUksV0FBVyxHQUFHLFFBQWxCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYztBQUM3QixTQUFPLFNBQVMsSUFBVCxDQUFjLEVBQWQsRUFBa0IsS0FBbEIsQ0FBd0IsQ0FBeEIsRUFBMkIsQ0FBQyxDQUE1QixDQUFQO0FBQ0QsQ0FGRDs7Ozs7QUNGQSxJQUFJLE9BQU8sT0FBTyxPQUFQLEdBQWlCLEVBQUUsU0FBUyxPQUFYLEVBQTVCO0FBQ0EsSUFBSSxPQUFPLEdBQVAsSUFBYyxRQUFsQixFQUE0QixNQUFNLElBQU4sQyxDQUFZOzs7QUNEeEM7O0FBQ0EsSUFBSSxrQkFBa0IsUUFBUSxjQUFSLENBQXRCO0FBQ0EsSUFBSSxhQUFhLFFBQVEsa0JBQVIsQ0FBakI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFVBQVUsTUFBVixFQUFrQixLQUFsQixFQUF5QixLQUF6QixFQUFnQztBQUMvQyxNQUFJLFNBQVMsTUFBYixFQUFxQixnQkFBZ0IsQ0FBaEIsQ0FBa0IsTUFBbEIsRUFBMEIsS0FBMUIsRUFBaUMsV0FBVyxDQUFYLEVBQWMsS0FBZCxDQUFqQyxFQUFyQixLQUNLLE9BQU8sS0FBUCxJQUFnQixLQUFoQjtBQUNOLENBSEQ7Ozs7O0FDSkE7QUFDQSxJQUFJLFlBQVksUUFBUSxlQUFSLENBQWhCO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjLElBQWQsRUFBb0IsTUFBcEIsRUFBNEI7QUFDM0MsWUFBVSxFQUFWO0FBQ0EsTUFBSSxTQUFTLFNBQWIsRUFBd0IsT0FBTyxFQUFQO0FBQ3hCLFVBQVEsTUFBUjtBQUNFLFNBQUssQ0FBTDtBQUFRLGFBQU8sVUFBVSxDQUFWLEVBQWE7QUFDMUIsZUFBTyxHQUFHLElBQUgsQ0FBUSxJQUFSLEVBQWMsQ0FBZCxDQUFQO0FBQ0QsT0FGTztBQUdSLFNBQUssQ0FBTDtBQUFRLGFBQU8sVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUM3QixlQUFPLEdBQUcsSUFBSCxDQUFRLElBQVIsRUFBYyxDQUFkLEVBQWlCLENBQWpCLENBQVA7QUFDRCxPQUZPO0FBR1IsU0FBSyxDQUFMO0FBQVEsYUFBTyxVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CO0FBQ2hDLGVBQU8sR0FBRyxJQUFILENBQVEsSUFBUixFQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsQ0FBUDtBQUNELE9BRk87QUFQVjtBQVdBLFNBQU8sWUFBVSxhQUFlO0FBQzlCLFdBQU8sR0FBRyxLQUFILENBQVMsSUFBVCxFQUFlLFNBQWYsQ0FBUDtBQUNELEdBRkQ7QUFHRCxDQWpCRDs7Ozs7QUNGQTtBQUNBLE9BQU8sT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYztBQUM3QixNQUFJLE1BQU0sU0FBVixFQUFxQixNQUFNLFVBQVUsMkJBQTJCLEVBQXJDLENBQU47QUFDckIsU0FBTyxFQUFQO0FBQ0QsQ0FIRDs7Ozs7QUNEQTtBQUNBLE9BQU8sT0FBUCxHQUFpQixDQUFDLFFBQVEsVUFBUixFQUFvQixZQUFZO0FBQ2hELFNBQU8sT0FBTyxjQUFQLENBQXNCLEVBQXRCLEVBQTBCLEdBQTFCLEVBQStCLEVBQUUsS0FBSyxlQUFZO0FBQUUsYUFBTyxDQUFQO0FBQVcsS0FBaEMsRUFBL0IsRUFBbUUsQ0FBbkUsSUFBd0UsQ0FBL0U7QUFDRCxDQUZpQixDQUFsQjs7Ozs7QUNEQSxJQUFJLFdBQVcsUUFBUSxjQUFSLENBQWY7QUFDQSxJQUFJLFdBQVcsUUFBUSxXQUFSLEVBQXFCLFFBQXBDO0FBQ0E7QUFDQSxJQUFJLEtBQUssU0FBUyxRQUFULEtBQXNCLFNBQVMsU0FBUyxhQUFsQixDQUEvQjtBQUNBLE9BQU8sT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYztBQUM3QixTQUFPLEtBQUssU0FBUyxhQUFULENBQXVCLEVBQXZCLENBQUwsR0FBa0MsRUFBekM7QUFDRCxDQUZEOzs7OztBQ0pBO0FBQ0EsT0FBTyxPQUFQLEdBQ0UsK0ZBRGUsQ0FFZixLQUZlLENBRVQsR0FGUyxDQUFqQjs7Ozs7QUNEQSxJQUFJLFNBQVMsUUFBUSxXQUFSLENBQWI7QUFDQSxJQUFJLE9BQU8sUUFBUSxTQUFSLENBQVg7QUFDQSxJQUFJLE9BQU8sUUFBUSxTQUFSLENBQVg7QUFDQSxJQUFJLFdBQVcsUUFBUSxhQUFSLENBQWY7QUFDQSxJQUFJLE1BQU0sUUFBUSxRQUFSLENBQVY7QUFDQSxJQUFJLFlBQVksV0FBaEI7O0FBRUEsSUFBSSxVQUFVLFNBQVYsT0FBVSxDQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsTUFBdEIsRUFBOEI7QUFDMUMsTUFBSSxZQUFZLE9BQU8sUUFBUSxDQUEvQjtBQUNBLE1BQUksWUFBWSxPQUFPLFFBQVEsQ0FBL0I7QUFDQSxNQUFJLFlBQVksT0FBTyxRQUFRLENBQS9CO0FBQ0EsTUFBSSxXQUFXLE9BQU8sUUFBUSxDQUE5QjtBQUNBLE1BQUksVUFBVSxPQUFPLFFBQVEsQ0FBN0I7QUFDQSxNQUFJLFNBQVMsWUFBWSxNQUFaLEdBQXFCLFlBQVksT0FBTyxJQUFQLE1BQWlCLE9BQU8sSUFBUCxJQUFlLEVBQWhDLENBQVosR0FBa0QsQ0FBQyxPQUFPLElBQVAsS0FBZ0IsRUFBakIsRUFBcUIsU0FBckIsQ0FBcEY7QUFDQSxNQUFJLFVBQVUsWUFBWSxJQUFaLEdBQW1CLEtBQUssSUFBTCxNQUFlLEtBQUssSUFBTCxJQUFhLEVBQTVCLENBQWpDO0FBQ0EsTUFBSSxXQUFXLFFBQVEsU0FBUixNQUF1QixRQUFRLFNBQVIsSUFBcUIsRUFBNUMsQ0FBZjtBQUNBLE1BQUksR0FBSixFQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLEdBQW5CO0FBQ0EsTUFBSSxTQUFKLEVBQWUsU0FBUyxJQUFUO0FBQ2YsT0FBSyxHQUFMLElBQVksTUFBWixFQUFvQjtBQUNsQjtBQUNBLFVBQU0sQ0FBQyxTQUFELElBQWMsTUFBZCxJQUF3QixPQUFPLEdBQVAsTUFBZ0IsU0FBOUM7QUFDQTtBQUNBLFVBQU0sQ0FBQyxNQUFNLE1BQU4sR0FBZSxNQUFoQixFQUF3QixHQUF4QixDQUFOO0FBQ0E7QUFDQSxVQUFNLFdBQVcsR0FBWCxHQUFpQixJQUFJLEdBQUosRUFBUyxNQUFULENBQWpCLEdBQW9DLFlBQVksT0FBTyxHQUFQLElBQWMsVUFBMUIsR0FBdUMsSUFBSSxTQUFTLElBQWIsRUFBbUIsR0FBbkIsQ0FBdkMsR0FBaUUsR0FBM0c7QUFDQTtBQUNBLFFBQUksTUFBSixFQUFZLFNBQVMsTUFBVCxFQUFpQixHQUFqQixFQUFzQixHQUF0QixFQUEyQixPQUFPLFFBQVEsQ0FBMUM7QUFDWjtBQUNBLFFBQUksUUFBUSxHQUFSLEtBQWdCLEdBQXBCLEVBQXlCLEtBQUssT0FBTCxFQUFjLEdBQWQsRUFBbUIsR0FBbkI7QUFDekIsUUFBSSxZQUFZLFNBQVMsR0FBVCxLQUFpQixHQUFqQyxFQUFzQyxTQUFTLEdBQVQsSUFBZ0IsR0FBaEI7QUFDdkM7QUFDRixDQXhCRDtBQXlCQSxPQUFPLElBQVAsR0FBYyxJQUFkO0FBQ0E7QUFDQSxRQUFRLENBQVIsR0FBWSxDQUFaLEMsQ0FBaUI7QUFDakIsUUFBUSxDQUFSLEdBQVksQ0FBWixDLENBQWlCO0FBQ2pCLFFBQVEsQ0FBUixHQUFZLENBQVosQyxDQUFpQjtBQUNqQixRQUFRLENBQVIsR0FBWSxDQUFaLEMsQ0FBaUI7QUFDakIsUUFBUSxDQUFSLEdBQVksRUFBWixDLENBQWlCO0FBQ2pCLFFBQVEsQ0FBUixHQUFZLEVBQVosQyxDQUFpQjtBQUNqQixRQUFRLENBQVIsR0FBWSxFQUFaLEMsQ0FBaUI7QUFDakIsUUFBUSxDQUFSLEdBQVksR0FBWixDLENBQWlCO0FBQ2pCLE9BQU8sT0FBUCxHQUFpQixPQUFqQjs7Ozs7QUMxQ0EsT0FBTyxPQUFQLEdBQWlCLFVBQVUsSUFBVixFQUFnQjtBQUMvQixNQUFJO0FBQ0YsV0FBTyxDQUFDLENBQUMsTUFBVDtBQUNELEdBRkQsQ0FFRSxPQUFPLENBQVAsRUFBVTtBQUNWLFdBQU8sSUFBUDtBQUNEO0FBQ0YsQ0FORDs7Ozs7QUNBQTtBQUNBLElBQUksU0FBUyxPQUFPLE9BQVAsR0FBaUIsT0FBTyxNQUFQLElBQWlCLFdBQWpCLElBQWdDLE9BQU8sSUFBUCxJQUFlLElBQS9DLEdBQzFCLE1BRDBCLEdBQ2pCLE9BQU8sSUFBUCxJQUFlLFdBQWYsSUFBOEIsS0FBSyxJQUFMLElBQWEsSUFBM0MsR0FBa0Q7QUFDN0Q7QUFEVyxFQUVULFNBQVMsYUFBVCxHQUhKO0FBSUEsSUFBSSxPQUFPLEdBQVAsSUFBYyxRQUFsQixFQUE0QixNQUFNLE1BQU4sQyxDQUFjOzs7OztBQ0wxQyxJQUFJLGlCQUFpQixHQUFHLGNBQXhCO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjLEdBQWQsRUFBbUI7QUFDbEMsU0FBTyxlQUFlLElBQWYsQ0FBb0IsRUFBcEIsRUFBd0IsR0FBeEIsQ0FBUDtBQUNELENBRkQ7Ozs7O0FDREEsSUFBSSxLQUFLLFFBQVEsY0FBUixDQUFUO0FBQ0EsSUFBSSxhQUFhLFFBQVEsa0JBQVIsQ0FBakI7QUFDQSxPQUFPLE9BQVAsR0FBaUIsUUFBUSxnQkFBUixJQUE0QixVQUFVLE1BQVYsRUFBa0IsR0FBbEIsRUFBdUIsS0FBdkIsRUFBOEI7QUFDekUsU0FBTyxHQUFHLENBQUgsQ0FBSyxNQUFMLEVBQWEsR0FBYixFQUFrQixXQUFXLENBQVgsRUFBYyxLQUFkLENBQWxCLENBQVA7QUFDRCxDQUZnQixHQUViLFVBQVUsTUFBVixFQUFrQixHQUFsQixFQUF1QixLQUF2QixFQUE4QjtBQUNoQyxTQUFPLEdBQVAsSUFBYyxLQUFkO0FBQ0EsU0FBTyxNQUFQO0FBQ0QsQ0FMRDs7Ozs7QUNGQSxJQUFJLFdBQVcsUUFBUSxXQUFSLEVBQXFCLFFBQXBDO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLFlBQVksU0FBUyxlQUF0Qzs7Ozs7QUNEQSxPQUFPLE9BQVAsR0FBaUIsQ0FBQyxRQUFRLGdCQUFSLENBQUQsSUFBOEIsQ0FBQyxRQUFRLFVBQVIsRUFBb0IsWUFBWTtBQUM5RSxTQUFPLE9BQU8sY0FBUCxDQUFzQixRQUFRLGVBQVIsRUFBeUIsS0FBekIsQ0FBdEIsRUFBdUQsR0FBdkQsRUFBNEQsRUFBRSxLQUFLLGVBQVk7QUFBRSxhQUFPLENBQVA7QUFBVyxLQUFoQyxFQUE1RCxFQUFnRyxDQUFoRyxJQUFxRyxDQUE1RztBQUNELENBRitDLENBQWhEOzs7OztBQ0FBO0FBQ0EsSUFBSSxNQUFNLFFBQVEsUUFBUixDQUFWO0FBQ0E7QUFDQSxPQUFPLE9BQVAsR0FBaUIsT0FBTyxHQUFQLEVBQVksb0JBQVosQ0FBaUMsQ0FBakMsSUFBc0MsTUFBdEMsR0FBK0MsVUFBVSxFQUFWLEVBQWM7QUFDNUUsU0FBTyxJQUFJLEVBQUosS0FBVyxRQUFYLEdBQXNCLEdBQUcsS0FBSCxDQUFTLEVBQVQsQ0FBdEIsR0FBcUMsT0FBTyxFQUFQLENBQTVDO0FBQ0QsQ0FGRDs7Ozs7QUNIQTtBQUNBLElBQUksWUFBWSxRQUFRLGNBQVIsQ0FBaEI7QUFDQSxJQUFJLFdBQVcsUUFBUSxRQUFSLEVBQWtCLFVBQWxCLENBQWY7QUFDQSxJQUFJLGFBQWEsTUFBTSxTQUF2Qjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWM7QUFDN0IsU0FBTyxPQUFPLFNBQVAsS0FBcUIsVUFBVSxLQUFWLEtBQW9CLEVBQXBCLElBQTBCLFdBQVcsUUFBWCxNQUF5QixFQUF4RSxDQUFQO0FBQ0QsQ0FGRDs7Ozs7OztBQ0xBLE9BQU8sT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYztBQUM3QixTQUFPLFFBQU8sRUFBUCx5Q0FBTyxFQUFQLE9BQWMsUUFBZCxHQUF5QixPQUFPLElBQWhDLEdBQXVDLE9BQU8sRUFBUCxLQUFjLFVBQTVEO0FBQ0QsQ0FGRDs7Ozs7QUNBQTtBQUNBLElBQUksV0FBVyxRQUFRLGNBQVIsQ0FBZjtBQUNBLE9BQU8sT0FBUCxHQUFpQixVQUFVLFFBQVYsRUFBb0IsRUFBcEIsRUFBd0IsS0FBeEIsRUFBK0IsT0FBL0IsRUFBd0M7QUFDdkQsTUFBSTtBQUNGLFdBQU8sVUFBVSxHQUFHLFNBQVMsS0FBVCxFQUFnQixDQUFoQixDQUFILEVBQXVCLE1BQU0sQ0FBTixDQUF2QixDQUFWLEdBQTZDLEdBQUcsS0FBSCxDQUFwRDtBQUNGO0FBQ0MsR0FIRCxDQUdFLE9BQU8sQ0FBUCxFQUFVO0FBQ1YsUUFBSSxNQUFNLFNBQVMsUUFBVCxDQUFWO0FBQ0EsUUFBSSxRQUFRLFNBQVosRUFBdUIsU0FBUyxJQUFJLElBQUosQ0FBUyxRQUFULENBQVQ7QUFDdkIsVUFBTSxDQUFOO0FBQ0Q7QUFDRixDQVREOzs7QUNGQTs7QUFDQSxJQUFJLFNBQVMsUUFBUSxrQkFBUixDQUFiO0FBQ0EsSUFBSSxhQUFhLFFBQVEsa0JBQVIsQ0FBakI7QUFDQSxJQUFJLGlCQUFpQixRQUFRLHNCQUFSLENBQXJCO0FBQ0EsSUFBSSxvQkFBb0IsRUFBeEI7O0FBRUE7QUFDQSxRQUFRLFNBQVIsRUFBbUIsaUJBQW5CLEVBQXNDLFFBQVEsUUFBUixFQUFrQixVQUFsQixDQUF0QyxFQUFxRSxZQUFZO0FBQUUsU0FBTyxJQUFQO0FBQWMsQ0FBakc7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFVBQVUsV0FBVixFQUF1QixJQUF2QixFQUE2QixJQUE3QixFQUFtQztBQUNsRCxjQUFZLFNBQVosR0FBd0IsT0FBTyxpQkFBUCxFQUEwQixFQUFFLE1BQU0sV0FBVyxDQUFYLEVBQWMsSUFBZCxDQUFSLEVBQTFCLENBQXhCO0FBQ0EsaUJBQWUsV0FBZixFQUE0QixPQUFPLFdBQW5DO0FBQ0QsQ0FIRDs7O0FDVEE7O0FBQ0EsSUFBSSxVQUFVLFFBQVEsWUFBUixDQUFkO0FBQ0EsSUFBSSxVQUFVLFFBQVEsV0FBUixDQUFkO0FBQ0EsSUFBSSxXQUFXLFFBQVEsYUFBUixDQUFmO0FBQ0EsSUFBSSxPQUFPLFFBQVEsU0FBUixDQUFYO0FBQ0EsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFoQjtBQUNBLElBQUksY0FBYyxRQUFRLGdCQUFSLENBQWxCO0FBQ0EsSUFBSSxpQkFBaUIsUUFBUSxzQkFBUixDQUFyQjtBQUNBLElBQUksaUJBQWlCLFFBQVEsZUFBUixDQUFyQjtBQUNBLElBQUksV0FBVyxRQUFRLFFBQVIsRUFBa0IsVUFBbEIsQ0FBZjtBQUNBLElBQUksUUFBUSxFQUFFLEdBQUcsSUFBSCxJQUFXLFVBQVUsR0FBRyxJQUFILEVBQXZCLENBQVosQyxDQUErQztBQUMvQyxJQUFJLGNBQWMsWUFBbEI7QUFDQSxJQUFJLE9BQU8sTUFBWDtBQUNBLElBQUksU0FBUyxRQUFiOztBQUVBLElBQUksYUFBYSxTQUFiLFVBQWEsR0FBWTtBQUFFLFNBQU8sSUFBUDtBQUFjLENBQTdDOztBQUVBLE9BQU8sT0FBUCxHQUFpQixVQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsV0FBdEIsRUFBbUMsSUFBbkMsRUFBeUMsT0FBekMsRUFBa0QsTUFBbEQsRUFBMEQsTUFBMUQsRUFBa0U7QUFDakYsY0FBWSxXQUFaLEVBQXlCLElBQXpCLEVBQStCLElBQS9CO0FBQ0EsTUFBSSxZQUFZLFNBQVosU0FBWSxDQUFVLElBQVYsRUFBZ0I7QUFDOUIsUUFBSSxDQUFDLEtBQUQsSUFBVSxRQUFRLEtBQXRCLEVBQTZCLE9BQU8sTUFBTSxJQUFOLENBQVA7QUFDN0IsWUFBUSxJQUFSO0FBQ0UsV0FBSyxJQUFMO0FBQVcsZUFBTyxTQUFTLElBQVQsR0FBZ0I7QUFBRSxpQkFBTyxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsQ0FBUDtBQUFxQyxTQUE5RDtBQUNYLFdBQUssTUFBTDtBQUFhLGVBQU8sU0FBUyxNQUFULEdBQWtCO0FBQUUsaUJBQU8sSUFBSSxXQUFKLENBQWdCLElBQWhCLEVBQXNCLElBQXRCLENBQVA7QUFBcUMsU0FBaEU7QUFGZixLQUdFLE9BQU8sU0FBUyxPQUFULEdBQW1CO0FBQUUsYUFBTyxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsQ0FBUDtBQUFxQyxLQUFqRTtBQUNILEdBTkQ7QUFPQSxNQUFJLE1BQU0sT0FBTyxXQUFqQjtBQUNBLE1BQUksYUFBYSxXQUFXLE1BQTVCO0FBQ0EsTUFBSSxhQUFhLEtBQWpCO0FBQ0EsTUFBSSxRQUFRLEtBQUssU0FBakI7QUFDQSxNQUFJLFVBQVUsTUFBTSxRQUFOLEtBQW1CLE1BQU0sV0FBTixDQUFuQixJQUF5QyxXQUFXLE1BQU0sT0FBTixDQUFsRTtBQUNBLE1BQUksV0FBVyxXQUFXLFVBQVUsT0FBVixDQUExQjtBQUNBLE1BQUksV0FBVyxVQUFVLENBQUMsVUFBRCxHQUFjLFFBQWQsR0FBeUIsVUFBVSxTQUFWLENBQW5DLEdBQTBELFNBQXpFO0FBQ0EsTUFBSSxhQUFhLFFBQVEsT0FBUixHQUFrQixNQUFNLE9BQU4sSUFBaUIsT0FBbkMsR0FBNkMsT0FBOUQ7QUFDQSxNQUFJLE9BQUosRUFBYSxHQUFiLEVBQWtCLGlCQUFsQjtBQUNBO0FBQ0EsTUFBSSxVQUFKLEVBQWdCO0FBQ2Qsd0JBQW9CLGVBQWUsV0FBVyxJQUFYLENBQWdCLElBQUksSUFBSixFQUFoQixDQUFmLENBQXBCO0FBQ0EsUUFBSSxzQkFBc0IsT0FBTyxTQUE3QixJQUEwQyxrQkFBa0IsSUFBaEUsRUFBc0U7QUFDcEU7QUFDQSxxQkFBZSxpQkFBZixFQUFrQyxHQUFsQyxFQUF1QyxJQUF2QztBQUNBO0FBQ0EsVUFBSSxDQUFDLE9BQUQsSUFBWSxPQUFPLGtCQUFrQixRQUFsQixDQUFQLElBQXNDLFVBQXRELEVBQWtFLEtBQUssaUJBQUwsRUFBd0IsUUFBeEIsRUFBa0MsVUFBbEM7QUFDbkU7QUFDRjtBQUNEO0FBQ0EsTUFBSSxjQUFjLE9BQWQsSUFBeUIsUUFBUSxJQUFSLEtBQWlCLE1BQTlDLEVBQXNEO0FBQ3BELGlCQUFhLElBQWI7QUFDQSxlQUFXLFNBQVMsTUFBVCxHQUFrQjtBQUFFLGFBQU8sUUFBUSxJQUFSLENBQWEsSUFBYixDQUFQO0FBQTRCLEtBQTNEO0FBQ0Q7QUFDRDtBQUNBLE1BQUksQ0FBQyxDQUFDLE9BQUQsSUFBWSxNQUFiLE1BQXlCLFNBQVMsVUFBVCxJQUF1QixDQUFDLE1BQU0sUUFBTixDQUFqRCxDQUFKLEVBQXVFO0FBQ3JFLFNBQUssS0FBTCxFQUFZLFFBQVosRUFBc0IsUUFBdEI7QUFDRDtBQUNEO0FBQ0EsWUFBVSxJQUFWLElBQWtCLFFBQWxCO0FBQ0EsWUFBVSxHQUFWLElBQWlCLFVBQWpCO0FBQ0EsTUFBSSxPQUFKLEVBQWE7QUFDWCxjQUFVO0FBQ1IsY0FBUSxhQUFhLFFBQWIsR0FBd0IsVUFBVSxNQUFWLENBRHhCO0FBRVIsWUFBTSxTQUFTLFFBQVQsR0FBb0IsVUFBVSxJQUFWLENBRmxCO0FBR1IsZUFBUztBQUhELEtBQVY7QUFLQSxRQUFJLE1BQUosRUFBWSxLQUFLLEdBQUwsSUFBWSxPQUFaLEVBQXFCO0FBQy9CLFVBQUksRUFBRSxPQUFPLEtBQVQsQ0FBSixFQUFxQixTQUFTLEtBQVQsRUFBZ0IsR0FBaEIsRUFBcUIsUUFBUSxHQUFSLENBQXJCO0FBQ3RCLEtBRkQsTUFFTyxRQUFRLFFBQVEsQ0FBUixHQUFZLFFBQVEsQ0FBUixJQUFhLFNBQVMsVUFBdEIsQ0FBcEIsRUFBdUQsSUFBdkQsRUFBNkQsT0FBN0Q7QUFDUjtBQUNELFNBQU8sT0FBUDtBQUNELENBbkREOzs7OztBQ2pCQSxJQUFJLFdBQVcsUUFBUSxRQUFSLEVBQWtCLFVBQWxCLENBQWY7QUFDQSxJQUFJLGVBQWUsS0FBbkI7O0FBRUEsSUFBSTtBQUNGLE1BQUksUUFBUSxDQUFDLENBQUQsRUFBSSxRQUFKLEdBQVo7QUFDQSxRQUFNLFFBQU4sSUFBa0IsWUFBWTtBQUFFLG1CQUFlLElBQWY7QUFBc0IsR0FBdEQ7QUFDQTtBQUNBLFFBQU0sSUFBTixDQUFXLEtBQVgsRUFBa0IsWUFBWTtBQUFFLFVBQU0sQ0FBTjtBQUFVLEdBQTFDO0FBQ0QsQ0FMRCxDQUtFLE9BQU8sQ0FBUCxFQUFVLENBQUUsV0FBYTs7QUFFM0IsT0FBTyxPQUFQLEdBQWlCLFVBQVUsSUFBVixFQUFnQixXQUFoQixFQUE2QjtBQUM1QyxNQUFJLENBQUMsV0FBRCxJQUFnQixDQUFDLFlBQXJCLEVBQW1DLE9BQU8sS0FBUDtBQUNuQyxNQUFJLE9BQU8sS0FBWDtBQUNBLE1BQUk7QUFDRixRQUFJLE1BQU0sQ0FBQyxDQUFELENBQVY7QUFDQSxRQUFJLE9BQU8sSUFBSSxRQUFKLEdBQVg7QUFDQSxTQUFLLElBQUwsR0FBWSxZQUFZO0FBQUUsYUFBTyxFQUFFLE1BQU0sT0FBTyxJQUFmLEVBQVA7QUFBK0IsS0FBekQ7QUFDQSxRQUFJLFFBQUosSUFBZ0IsWUFBWTtBQUFFLGFBQU8sSUFBUDtBQUFjLEtBQTVDO0FBQ0EsU0FBSyxHQUFMO0FBQ0QsR0FORCxDQU1FLE9BQU8sQ0FBUCxFQUFVLENBQUUsV0FBYTtBQUMzQixTQUFPLElBQVA7QUFDRCxDQVhEOzs7OztBQ1ZBLE9BQU8sT0FBUCxHQUFpQixFQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsS0FBakI7OztBQ0FBO0FBQ0E7O0FBQ0EsSUFBSSxVQUFVLFFBQVEsZ0JBQVIsQ0FBZDtBQUNBLElBQUksT0FBTyxRQUFRLGdCQUFSLENBQVg7QUFDQSxJQUFJLE1BQU0sUUFBUSxlQUFSLENBQVY7QUFDQSxJQUFJLFdBQVcsUUFBUSxjQUFSLENBQWY7QUFDQSxJQUFJLFVBQVUsUUFBUSxZQUFSLENBQWQ7QUFDQSxJQUFJLFVBQVUsT0FBTyxNQUFyQjs7QUFFQTtBQUNBLE9BQU8sT0FBUCxHQUFpQixDQUFDLE9BQUQsSUFBWSxRQUFRLFVBQVIsRUFBb0IsWUFBWTtBQUMzRCxNQUFJLElBQUksRUFBUjtBQUNBLE1BQUksSUFBSSxFQUFSO0FBQ0E7QUFDQSxNQUFJLElBQUksUUFBUjtBQUNBLE1BQUksSUFBSSxzQkFBUjtBQUNBLElBQUUsQ0FBRixJQUFPLENBQVA7QUFDQSxJQUFFLEtBQUYsQ0FBUSxFQUFSLEVBQVksT0FBWixDQUFvQixVQUFVLENBQVYsRUFBYTtBQUFFLE1BQUUsQ0FBRixJQUFPLENBQVA7QUFBVyxHQUE5QztBQUNBLFNBQU8sUUFBUSxFQUFSLEVBQVksQ0FBWixFQUFlLENBQWYsS0FBcUIsQ0FBckIsSUFBMEIsT0FBTyxJQUFQLENBQVksUUFBUSxFQUFSLEVBQVksQ0FBWixDQUFaLEVBQTRCLElBQTVCLENBQWlDLEVBQWpDLEtBQXdDLENBQXpFO0FBQ0QsQ0FUNEIsQ0FBWixHQVNaLFNBQVMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixNQUF4QixFQUFnQztBQUFFO0FBQ3JDLE1BQUksSUFBSSxTQUFTLE1BQVQsQ0FBUjtBQUNBLE1BQUksT0FBTyxVQUFVLE1BQXJCO0FBQ0EsTUFBSSxRQUFRLENBQVo7QUFDQSxNQUFJLGFBQWEsS0FBSyxDQUF0QjtBQUNBLE1BQUksU0FBUyxJQUFJLENBQWpCO0FBQ0EsU0FBTyxPQUFPLEtBQWQsRUFBcUI7QUFDbkIsUUFBSSxJQUFJLFFBQVEsVUFBVSxPQUFWLENBQVIsQ0FBUjtBQUNBLFFBQUksT0FBTyxhQUFhLFFBQVEsQ0FBUixFQUFXLE1BQVgsQ0FBa0IsV0FBVyxDQUFYLENBQWxCLENBQWIsR0FBZ0QsUUFBUSxDQUFSLENBQTNEO0FBQ0EsUUFBSSxTQUFTLEtBQUssTUFBbEI7QUFDQSxRQUFJLElBQUksQ0FBUjtBQUNBLFFBQUksR0FBSjtBQUNBLFdBQU8sU0FBUyxDQUFoQjtBQUFtQixVQUFJLE9BQU8sSUFBUCxDQUFZLENBQVosRUFBZSxNQUFNLEtBQUssR0FBTCxDQUFyQixDQUFKLEVBQXFDLEVBQUUsR0FBRixJQUFTLEVBQUUsR0FBRixDQUFUO0FBQXhEO0FBQ0QsR0FBQyxPQUFPLENBQVA7QUFDSCxDQXZCZ0IsR0F1QmIsT0F2Qko7Ozs7O0FDVkE7QUFDQSxJQUFJLFdBQVcsUUFBUSxjQUFSLENBQWY7QUFDQSxJQUFJLE1BQU0sUUFBUSxlQUFSLENBQVY7QUFDQSxJQUFJLGNBQWMsUUFBUSxrQkFBUixDQUFsQjtBQUNBLElBQUksV0FBVyxRQUFRLGVBQVIsRUFBeUIsVUFBekIsQ0FBZjtBQUNBLElBQUksUUFBUSxTQUFSLEtBQVEsR0FBWSxDQUFFLFdBQWEsQ0FBdkM7QUFDQSxJQUFJLFlBQVksV0FBaEI7O0FBRUE7QUFDQSxJQUFJLGNBQWEsc0JBQVk7QUFDM0I7QUFDQSxNQUFJLFNBQVMsUUFBUSxlQUFSLEVBQXlCLFFBQXpCLENBQWI7QUFDQSxNQUFJLElBQUksWUFBWSxNQUFwQjtBQUNBLE1BQUksS0FBSyxHQUFUO0FBQ0EsTUFBSSxLQUFLLEdBQVQ7QUFDQSxNQUFJLGNBQUo7QUFDQSxTQUFPLEtBQVAsQ0FBYSxPQUFiLEdBQXVCLE1BQXZCO0FBQ0EsVUFBUSxTQUFSLEVBQW1CLFdBQW5CLENBQStCLE1BQS9CO0FBQ0EsU0FBTyxHQUFQLEdBQWEsYUFBYixDQVQyQixDQVNDO0FBQzVCO0FBQ0E7QUFDQSxtQkFBaUIsT0FBTyxhQUFQLENBQXFCLFFBQXRDO0FBQ0EsaUJBQWUsSUFBZjtBQUNBLGlCQUFlLEtBQWYsQ0FBcUIsS0FBSyxRQUFMLEdBQWdCLEVBQWhCLEdBQXFCLG1CQUFyQixHQUEyQyxFQUEzQyxHQUFnRCxTQUFoRCxHQUE0RCxFQUFqRjtBQUNBLGlCQUFlLEtBQWY7QUFDQSxnQkFBYSxlQUFlLENBQTVCO0FBQ0EsU0FBTyxHQUFQO0FBQVksV0FBTyxZQUFXLFNBQVgsRUFBc0IsWUFBWSxDQUFaLENBQXRCLENBQVA7QUFBWixHQUNBLE9BQU8sYUFBUDtBQUNELENBbkJEOztBQXFCQSxPQUFPLE9BQVAsR0FBaUIsT0FBTyxNQUFQLElBQWlCLFNBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFtQixVQUFuQixFQUErQjtBQUMvRCxNQUFJLE1BQUo7QUFDQSxNQUFJLE1BQU0sSUFBVixFQUFnQjtBQUNkLFVBQU0sU0FBTixJQUFtQixTQUFTLENBQVQsQ0FBbkI7QUFDQSxhQUFTLElBQUksS0FBSixFQUFUO0FBQ0EsVUFBTSxTQUFOLElBQW1CLElBQW5CO0FBQ0E7QUFDQSxXQUFPLFFBQVAsSUFBbUIsQ0FBbkI7QUFDRCxHQU5ELE1BTU8sU0FBUyxhQUFUO0FBQ1AsU0FBTyxlQUFlLFNBQWYsR0FBMkIsTUFBM0IsR0FBb0MsSUFBSSxNQUFKLEVBQVksVUFBWixDQUEzQztBQUNELENBVkQ7Ozs7O0FDOUJBLElBQUksV0FBVyxRQUFRLGNBQVIsQ0FBZjtBQUNBLElBQUksaUJBQWlCLFFBQVEsbUJBQVIsQ0FBckI7QUFDQSxJQUFJLGNBQWMsUUFBUSxpQkFBUixDQUFsQjtBQUNBLElBQUksS0FBSyxPQUFPLGNBQWhCOztBQUVBLFFBQVEsQ0FBUixHQUFZLFFBQVEsZ0JBQVIsSUFBNEIsT0FBTyxjQUFuQyxHQUFvRCxTQUFTLGNBQVQsQ0FBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsRUFBOEIsVUFBOUIsRUFBMEM7QUFDeEcsV0FBUyxDQUFUO0FBQ0EsTUFBSSxZQUFZLENBQVosRUFBZSxJQUFmLENBQUo7QUFDQSxXQUFTLFVBQVQ7QUFDQSxNQUFJLGNBQUosRUFBb0IsSUFBSTtBQUN0QixXQUFPLEdBQUcsQ0FBSCxFQUFNLENBQU4sRUFBUyxVQUFULENBQVA7QUFDRCxHQUZtQixDQUVsQixPQUFPLENBQVAsRUFBVSxDQUFFLFdBQWE7QUFDM0IsTUFBSSxTQUFTLFVBQVQsSUFBdUIsU0FBUyxVQUFwQyxFQUFnRCxNQUFNLFVBQVUsMEJBQVYsQ0FBTjtBQUNoRCxNQUFJLFdBQVcsVUFBZixFQUEyQixFQUFFLENBQUYsSUFBTyxXQUFXLEtBQWxCO0FBQzNCLFNBQU8sQ0FBUDtBQUNELENBVkQ7Ozs7O0FDTEEsSUFBSSxLQUFLLFFBQVEsY0FBUixDQUFUO0FBQ0EsSUFBSSxXQUFXLFFBQVEsY0FBUixDQUFmO0FBQ0EsSUFBSSxVQUFVLFFBQVEsZ0JBQVIsQ0FBZDs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsUUFBUSxnQkFBUixJQUE0QixPQUFPLGdCQUFuQyxHQUFzRCxTQUFTLGdCQUFULENBQTBCLENBQTFCLEVBQTZCLFVBQTdCLEVBQXlDO0FBQzlHLFdBQVMsQ0FBVDtBQUNBLE1BQUksT0FBTyxRQUFRLFVBQVIsQ0FBWDtBQUNBLE1BQUksU0FBUyxLQUFLLE1BQWxCO0FBQ0EsTUFBSSxJQUFJLENBQVI7QUFDQSxNQUFJLENBQUo7QUFDQSxTQUFPLFNBQVMsQ0FBaEI7QUFBbUIsT0FBRyxDQUFILENBQUssQ0FBTCxFQUFRLElBQUksS0FBSyxHQUFMLENBQVosRUFBdUIsV0FBVyxDQUFYLENBQXZCO0FBQW5CLEdBQ0EsT0FBTyxDQUFQO0FBQ0QsQ0FSRDs7Ozs7QUNKQSxRQUFRLENBQVIsR0FBWSxPQUFPLHFCQUFuQjs7Ozs7QUNBQTtBQUNBLElBQUksTUFBTSxRQUFRLFFBQVIsQ0FBVjtBQUNBLElBQUksV0FBVyxRQUFRLGNBQVIsQ0FBZjtBQUNBLElBQUksV0FBVyxRQUFRLGVBQVIsRUFBeUIsVUFBekIsQ0FBZjtBQUNBLElBQUksY0FBYyxPQUFPLFNBQXpCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixPQUFPLGNBQVAsSUFBeUIsVUFBVSxDQUFWLEVBQWE7QUFDckQsTUFBSSxTQUFTLENBQVQsQ0FBSjtBQUNBLE1BQUksSUFBSSxDQUFKLEVBQU8sUUFBUCxDQUFKLEVBQXNCLE9BQU8sRUFBRSxRQUFGLENBQVA7QUFDdEIsTUFBSSxPQUFPLEVBQUUsV0FBVCxJQUF3QixVQUF4QixJQUFzQyxhQUFhLEVBQUUsV0FBekQsRUFBc0U7QUFDcEUsV0FBTyxFQUFFLFdBQUYsQ0FBYyxTQUFyQjtBQUNELEdBQUMsT0FBTyxhQUFhLE1BQWIsR0FBc0IsV0FBdEIsR0FBb0MsSUFBM0M7QUFDSCxDQU5EOzs7OztBQ05BLElBQUksTUFBTSxRQUFRLFFBQVIsQ0FBVjtBQUNBLElBQUksWUFBWSxRQUFRLGVBQVIsQ0FBaEI7QUFDQSxJQUFJLGVBQWUsUUFBUSxtQkFBUixFQUE2QixLQUE3QixDQUFuQjtBQUNBLElBQUksV0FBVyxRQUFRLGVBQVIsRUFBeUIsVUFBekIsQ0FBZjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsVUFBVSxNQUFWLEVBQWtCLEtBQWxCLEVBQXlCO0FBQ3hDLE1BQUksSUFBSSxVQUFVLE1BQVYsQ0FBUjtBQUNBLE1BQUksSUFBSSxDQUFSO0FBQ0EsTUFBSSxTQUFTLEVBQWI7QUFDQSxNQUFJLEdBQUo7QUFDQSxPQUFLLEdBQUwsSUFBWSxDQUFaO0FBQWUsUUFBSSxPQUFPLFFBQVgsRUFBcUIsSUFBSSxDQUFKLEVBQU8sR0FBUCxLQUFlLE9BQU8sSUFBUCxDQUFZLEdBQVosQ0FBZjtBQUFwQyxHQUx3QyxDQU14QztBQUNBLFNBQU8sTUFBTSxNQUFOLEdBQWUsQ0FBdEI7QUFBeUIsUUFBSSxJQUFJLENBQUosRUFBTyxNQUFNLE1BQU0sR0FBTixDQUFiLENBQUosRUFBOEI7QUFDckQsT0FBQyxhQUFhLE1BQWIsRUFBcUIsR0FBckIsQ0FBRCxJQUE4QixPQUFPLElBQVAsQ0FBWSxHQUFaLENBQTlCO0FBQ0Q7QUFGRCxHQUdBLE9BQU8sTUFBUDtBQUNELENBWEQ7Ozs7O0FDTEE7QUFDQSxJQUFJLFFBQVEsUUFBUSx5QkFBUixDQUFaO0FBQ0EsSUFBSSxjQUFjLFFBQVEsa0JBQVIsQ0FBbEI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLE9BQU8sSUFBUCxJQUFlLFNBQVMsSUFBVCxDQUFjLENBQWQsRUFBaUI7QUFDL0MsU0FBTyxNQUFNLENBQU4sRUFBUyxXQUFULENBQVA7QUFDRCxDQUZEOzs7OztBQ0pBLFFBQVEsQ0FBUixHQUFZLEdBQUcsb0JBQWY7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCLFVBQVUsTUFBVixFQUFrQixLQUFsQixFQUF5QjtBQUN4QyxTQUFPO0FBQ0wsZ0JBQVksRUFBRSxTQUFTLENBQVgsQ0FEUDtBQUVMLGtCQUFjLEVBQUUsU0FBUyxDQUFYLENBRlQ7QUFHTCxjQUFVLEVBQUUsU0FBUyxDQUFYLENBSEw7QUFJTCxXQUFPO0FBSkYsR0FBUDtBQU1ELENBUEQ7Ozs7O0FDQUEsSUFBSSxTQUFTLFFBQVEsV0FBUixDQUFiO0FBQ0EsSUFBSSxPQUFPLFFBQVEsU0FBUixDQUFYO0FBQ0EsSUFBSSxNQUFNLFFBQVEsUUFBUixDQUFWO0FBQ0EsSUFBSSxNQUFNLFFBQVEsUUFBUixFQUFrQixLQUFsQixDQUFWO0FBQ0EsSUFBSSxZQUFZLFVBQWhCO0FBQ0EsSUFBSSxZQUFZLFNBQVMsU0FBVCxDQUFoQjtBQUNBLElBQUksTUFBTSxDQUFDLEtBQUssU0FBTixFQUFpQixLQUFqQixDQUF1QixTQUF2QixDQUFWOztBQUVBLFFBQVEsU0FBUixFQUFtQixhQUFuQixHQUFtQyxVQUFVLEVBQVYsRUFBYztBQUMvQyxTQUFPLFVBQVUsSUFBVixDQUFlLEVBQWYsQ0FBUDtBQUNELENBRkQ7O0FBSUEsQ0FBQyxPQUFPLE9BQVAsR0FBaUIsVUFBVSxDQUFWLEVBQWEsR0FBYixFQUFrQixHQUFsQixFQUF1QixJQUF2QixFQUE2QjtBQUM3QyxNQUFJLGFBQWEsT0FBTyxHQUFQLElBQWMsVUFBL0I7QUFDQSxNQUFJLFVBQUosRUFBZ0IsSUFBSSxHQUFKLEVBQVMsTUFBVCxLQUFvQixLQUFLLEdBQUwsRUFBVSxNQUFWLEVBQWtCLEdBQWxCLENBQXBCO0FBQ2hCLE1BQUksRUFBRSxHQUFGLE1BQVcsR0FBZixFQUFvQjtBQUNwQixNQUFJLFVBQUosRUFBZ0IsSUFBSSxHQUFKLEVBQVMsR0FBVCxLQUFpQixLQUFLLEdBQUwsRUFBVSxHQUFWLEVBQWUsRUFBRSxHQUFGLElBQVMsS0FBSyxFQUFFLEdBQUYsQ0FBZCxHQUF1QixJQUFJLElBQUosQ0FBUyxPQUFPLEdBQVAsQ0FBVCxDQUF0QyxDQUFqQjtBQUNoQixNQUFJLE1BQU0sTUFBVixFQUFrQjtBQUNoQixNQUFFLEdBQUYsSUFBUyxHQUFUO0FBQ0QsR0FGRCxNQUVPLElBQUksQ0FBQyxJQUFMLEVBQVc7QUFDaEIsV0FBTyxFQUFFLEdBQUYsQ0FBUDtBQUNBLFNBQUssQ0FBTCxFQUFRLEdBQVIsRUFBYSxHQUFiO0FBQ0QsR0FITSxNQUdBLElBQUksRUFBRSxHQUFGLENBQUosRUFBWTtBQUNqQixNQUFFLEdBQUYsSUFBUyxHQUFUO0FBQ0QsR0FGTSxNQUVBO0FBQ0wsU0FBSyxDQUFMLEVBQVEsR0FBUixFQUFhLEdBQWI7QUFDRDtBQUNIO0FBQ0MsQ0FoQkQsRUFnQkcsU0FBUyxTQWhCWixFQWdCdUIsU0FoQnZCLEVBZ0JrQyxTQUFTLFFBQVQsR0FBb0I7QUFDcEQsU0FBTyxPQUFPLElBQVAsSUFBZSxVQUFmLElBQTZCLEtBQUssR0FBTCxDQUE3QixJQUEwQyxVQUFVLElBQVYsQ0FBZSxJQUFmLENBQWpEO0FBQ0QsQ0FsQkQ7Ozs7O0FDWkEsSUFBSSxNQUFNLFFBQVEsY0FBUixFQUF3QixDQUFsQztBQUNBLElBQUksTUFBTSxRQUFRLFFBQVIsQ0FBVjtBQUNBLElBQUksTUFBTSxRQUFRLFFBQVIsRUFBa0IsYUFBbEIsQ0FBVjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWMsR0FBZCxFQUFtQixJQUFuQixFQUF5QjtBQUN4QyxNQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFQLEdBQVksR0FBRyxTQUF4QixFQUFtQyxHQUFuQyxDQUFYLEVBQW9ELElBQUksRUFBSixFQUFRLEdBQVIsRUFBYSxFQUFFLGNBQWMsSUFBaEIsRUFBc0IsT0FBTyxHQUE3QixFQUFiO0FBQ3JELENBRkQ7Ozs7O0FDSkEsSUFBSSxTQUFTLFFBQVEsV0FBUixFQUFxQixNQUFyQixDQUFiO0FBQ0EsSUFBSSxNQUFNLFFBQVEsUUFBUixDQUFWO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLFVBQVUsR0FBVixFQUFlO0FBQzlCLFNBQU8sT0FBTyxHQUFQLE1BQWdCLE9BQU8sR0FBUCxJQUFjLElBQUksR0FBSixDQUE5QixDQUFQO0FBQ0QsQ0FGRDs7Ozs7QUNGQSxJQUFJLE9BQU8sUUFBUSxTQUFSLENBQVg7QUFDQSxJQUFJLFNBQVMsUUFBUSxXQUFSLENBQWI7QUFDQSxJQUFJLFNBQVMsb0JBQWI7QUFDQSxJQUFJLFFBQVEsT0FBTyxNQUFQLE1BQW1CLE9BQU8sTUFBUCxJQUFpQixFQUFwQyxDQUFaOztBQUVBLENBQUMsT0FBTyxPQUFQLEdBQWlCLFVBQVUsR0FBVixFQUFlLEtBQWYsRUFBc0I7QUFDdEMsU0FBTyxNQUFNLEdBQU4sTUFBZSxNQUFNLEdBQU4sSUFBYSxVQUFVLFNBQVYsR0FBc0IsS0FBdEIsR0FBOEIsRUFBMUQsQ0FBUDtBQUNELENBRkQsRUFFRyxVQUZILEVBRWUsRUFGZixFQUVtQixJQUZuQixDQUV3QjtBQUN0QixXQUFTLEtBQUssT0FEUTtBQUV0QixRQUFNLFFBQVEsWUFBUixJQUF3QixNQUF4QixHQUFpQyxRQUZqQjtBQUd0QixhQUFXO0FBSFcsQ0FGeEI7Ozs7O0FDTEEsSUFBSSxZQUFZLFFBQVEsZUFBUixDQUFoQjtBQUNBLElBQUksVUFBVSxRQUFRLFlBQVIsQ0FBZDtBQUNBO0FBQ0E7QUFDQSxPQUFPLE9BQVAsR0FBaUIsVUFBVSxTQUFWLEVBQXFCO0FBQ3BDLFNBQU8sVUFBVSxJQUFWLEVBQWdCLEdBQWhCLEVBQXFCO0FBQzFCLFFBQUksSUFBSSxPQUFPLFFBQVEsSUFBUixDQUFQLENBQVI7QUFDQSxRQUFJLElBQUksVUFBVSxHQUFWLENBQVI7QUFDQSxRQUFJLElBQUksRUFBRSxNQUFWO0FBQ0EsUUFBSSxDQUFKLEVBQU8sQ0FBUDtBQUNBLFFBQUksSUFBSSxDQUFKLElBQVMsS0FBSyxDQUFsQixFQUFxQixPQUFPLFlBQVksRUFBWixHQUFpQixTQUF4QjtBQUNyQixRQUFJLEVBQUUsVUFBRixDQUFhLENBQWIsQ0FBSjtBQUNBLFdBQU8sSUFBSSxNQUFKLElBQWMsSUFBSSxNQUFsQixJQUE0QixJQUFJLENBQUosS0FBVSxDQUF0QyxJQUEyQyxDQUFDLElBQUksRUFBRSxVQUFGLENBQWEsSUFBSSxDQUFqQixDQUFMLElBQTRCLE1BQXZFLElBQWlGLElBQUksTUFBckYsR0FDSCxZQUFZLEVBQUUsTUFBRixDQUFTLENBQVQsQ0FBWixHQUEwQixDQUR2QixHQUVILFlBQVksRUFBRSxLQUFGLENBQVEsQ0FBUixFQUFXLElBQUksQ0FBZixDQUFaLEdBQWdDLENBQUMsSUFBSSxNQUFKLElBQWMsRUFBZixLQUFzQixJQUFJLE1BQTFCLElBQW9DLE9BRnhFO0FBR0QsR0FWRDtBQVdELENBWkQ7Ozs7O0FDSkEsSUFBSSxZQUFZLFFBQVEsZUFBUixDQUFoQjtBQUNBLElBQUksTUFBTSxLQUFLLEdBQWY7QUFDQSxJQUFJLE1BQU0sS0FBSyxHQUFmO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLFVBQVUsS0FBVixFQUFpQixNQUFqQixFQUF5QjtBQUN4QyxVQUFRLFVBQVUsS0FBVixDQUFSO0FBQ0EsU0FBTyxRQUFRLENBQVIsR0FBWSxJQUFJLFFBQVEsTUFBWixFQUFvQixDQUFwQixDQUFaLEdBQXFDLElBQUksS0FBSixFQUFXLE1BQVgsQ0FBNUM7QUFDRCxDQUhEOzs7OztBQ0hBO0FBQ0EsSUFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxJQUFJLFFBQVEsS0FBSyxLQUFqQjtBQUNBLE9BQU8sT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYztBQUM3QixTQUFPLE1BQU0sS0FBSyxDQUFDLEVBQVosSUFBa0IsQ0FBbEIsR0FBc0IsQ0FBQyxLQUFLLENBQUwsR0FBUyxLQUFULEdBQWlCLElBQWxCLEVBQXdCLEVBQXhCLENBQTdCO0FBQ0QsQ0FGRDs7Ozs7QUNIQTtBQUNBLElBQUksVUFBVSxRQUFRLFlBQVIsQ0FBZDtBQUNBLElBQUksVUFBVSxRQUFRLFlBQVIsQ0FBZDtBQUNBLE9BQU8sT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYztBQUM3QixTQUFPLFFBQVEsUUFBUSxFQUFSLENBQVIsQ0FBUDtBQUNELENBRkQ7Ozs7O0FDSEE7QUFDQSxJQUFJLFlBQVksUUFBUSxlQUFSLENBQWhCO0FBQ0EsSUFBSSxNQUFNLEtBQUssR0FBZjtBQUNBLE9BQU8sT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYztBQUM3QixTQUFPLEtBQUssQ0FBTCxHQUFTLElBQUksVUFBVSxFQUFWLENBQUosRUFBbUIsZ0JBQW5CLENBQVQsR0FBZ0QsQ0FBdkQsQ0FENkIsQ0FDNkI7QUFDM0QsQ0FGRDs7Ozs7QUNIQTtBQUNBLElBQUksVUFBVSxRQUFRLFlBQVIsQ0FBZDtBQUNBLE9BQU8sT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYztBQUM3QixTQUFPLE9BQU8sUUFBUSxFQUFSLENBQVAsQ0FBUDtBQUNELENBRkQ7Ozs7O0FDRkE7QUFDQSxJQUFJLFdBQVcsUUFBUSxjQUFSLENBQWY7QUFDQTtBQUNBO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjLENBQWQsRUFBaUI7QUFDaEMsTUFBSSxDQUFDLFNBQVMsRUFBVCxDQUFMLEVBQW1CLE9BQU8sRUFBUDtBQUNuQixNQUFJLEVBQUosRUFBUSxHQUFSO0FBQ0EsTUFBSSxLQUFLLFFBQVEsS0FBSyxHQUFHLFFBQWhCLEtBQTZCLFVBQWxDLElBQWdELENBQUMsU0FBUyxNQUFNLEdBQUcsSUFBSCxDQUFRLEVBQVIsQ0FBZixDQUFyRCxFQUFrRixPQUFPLEdBQVA7QUFDbEYsTUFBSSxRQUFRLEtBQUssR0FBRyxPQUFoQixLQUE0QixVQUE1QixJQUEwQyxDQUFDLFNBQVMsTUFBTSxHQUFHLElBQUgsQ0FBUSxFQUFSLENBQWYsQ0FBL0MsRUFBNEUsT0FBTyxHQUFQO0FBQzVFLE1BQUksQ0FBQyxDQUFELElBQU0sUUFBUSxLQUFLLEdBQUcsUUFBaEIsS0FBNkIsVUFBbkMsSUFBaUQsQ0FBQyxTQUFTLE1BQU0sR0FBRyxJQUFILENBQVEsRUFBUixDQUFmLENBQXRELEVBQW1GLE9BQU8sR0FBUDtBQUNuRixRQUFNLFVBQVUseUNBQVYsQ0FBTjtBQUNELENBUEQ7Ozs7O0FDSkEsSUFBSSxLQUFLLENBQVQ7QUFDQSxJQUFJLEtBQUssS0FBSyxNQUFMLEVBQVQ7QUFDQSxPQUFPLE9BQVAsR0FBaUIsVUFBVSxHQUFWLEVBQWU7QUFDOUIsU0FBTyxVQUFVLE1BQVYsQ0FBaUIsUUFBUSxTQUFSLEdBQW9CLEVBQXBCLEdBQXlCLEdBQTFDLEVBQStDLElBQS9DLEVBQXFELENBQUMsRUFBRSxFQUFGLEdBQU8sRUFBUixFQUFZLFFBQVosQ0FBcUIsRUFBckIsQ0FBckQsQ0FBUDtBQUNELENBRkQ7Ozs7O0FDRkEsSUFBSSxRQUFRLFFBQVEsV0FBUixFQUFxQixLQUFyQixDQUFaO0FBQ0EsSUFBSSxNQUFNLFFBQVEsUUFBUixDQUFWO0FBQ0EsSUFBSSxVQUFTLFFBQVEsV0FBUixFQUFxQixNQUFsQztBQUNBLElBQUksYUFBYSxPQUFPLE9BQVAsSUFBaUIsVUFBbEM7O0FBRUEsSUFBSSxXQUFXLE9BQU8sT0FBUCxHQUFpQixVQUFVLElBQVYsRUFBZ0I7QUFDOUMsU0FBTyxNQUFNLElBQU4sTUFBZ0IsTUFBTSxJQUFOLElBQ3JCLGNBQWMsUUFBTyxJQUFQLENBQWQsSUFBOEIsQ0FBQyxhQUFhLE9BQWIsR0FBc0IsR0FBdkIsRUFBNEIsWUFBWSxJQUF4QyxDQUR6QixDQUFQO0FBRUQsQ0FIRDs7QUFLQSxTQUFTLEtBQVQsR0FBaUIsS0FBakI7Ozs7O0FDVkEsSUFBSSxVQUFVLFFBQVEsWUFBUixDQUFkO0FBQ0EsSUFBSSxXQUFXLFFBQVEsUUFBUixFQUFrQixVQUFsQixDQUFmO0FBQ0EsSUFBSSxZQUFZLFFBQVEsY0FBUixDQUFoQjtBQUNBLE9BQU8sT0FBUCxHQUFpQixRQUFRLFNBQVIsRUFBbUIsaUJBQW5CLEdBQXVDLFVBQVUsRUFBVixFQUFjO0FBQ3BFLE1BQUksTUFBTSxTQUFWLEVBQXFCLE9BQU8sR0FBRyxRQUFILEtBQ3ZCLEdBQUcsWUFBSCxDQUR1QixJQUV2QixVQUFVLFFBQVEsRUFBUixDQUFWLENBRmdCO0FBR3RCLENBSkQ7OztBQ0hBOztBQUNBLElBQUksTUFBTSxRQUFRLFFBQVIsQ0FBVjtBQUNBLElBQUksVUFBVSxRQUFRLFdBQVIsQ0FBZDtBQUNBLElBQUksV0FBVyxRQUFRLGNBQVIsQ0FBZjtBQUNBLElBQUksT0FBTyxRQUFRLGNBQVIsQ0FBWDtBQUNBLElBQUksY0FBYyxRQUFRLGtCQUFSLENBQWxCO0FBQ0EsSUFBSSxXQUFXLFFBQVEsY0FBUixDQUFmO0FBQ0EsSUFBSSxpQkFBaUIsUUFBUSxvQkFBUixDQUFyQjtBQUNBLElBQUksWUFBWSxRQUFRLDRCQUFSLENBQWhCOztBQUVBLFFBQVEsUUFBUSxDQUFSLEdBQVksUUFBUSxDQUFSLEdBQVksQ0FBQyxRQUFRLGdCQUFSLEVBQTBCLFVBQVUsSUFBVixFQUFnQjtBQUFFLFFBQU0sSUFBTixDQUFXLElBQVg7QUFBbUIsQ0FBL0QsQ0FBakMsRUFBbUcsT0FBbkcsRUFBNEc7QUFDMUc7QUFDQSxRQUFNLFNBQVMsSUFBVCxDQUFjLFNBQWQsQ0FBd0IsOENBQXhCLEVBQXdFO0FBQzVFLFFBQUksSUFBSSxTQUFTLFNBQVQsQ0FBUjtBQUNBLFFBQUksSUFBSSxPQUFPLElBQVAsSUFBZSxVQUFmLEdBQTRCLElBQTVCLEdBQW1DLEtBQTNDO0FBQ0EsUUFBSSxPQUFPLFVBQVUsTUFBckI7QUFDQSxRQUFJLFFBQVEsT0FBTyxDQUFQLEdBQVcsVUFBVSxDQUFWLENBQVgsR0FBMEIsU0FBdEM7QUFDQSxRQUFJLFVBQVUsVUFBVSxTQUF4QjtBQUNBLFFBQUksUUFBUSxDQUFaO0FBQ0EsUUFBSSxTQUFTLFVBQVUsQ0FBVixDQUFiO0FBQ0EsUUFBSSxNQUFKLEVBQVksTUFBWixFQUFvQixJQUFwQixFQUEwQixRQUExQjtBQUNBLFFBQUksT0FBSixFQUFhLFFBQVEsSUFBSSxLQUFKLEVBQVcsT0FBTyxDQUFQLEdBQVcsVUFBVSxDQUFWLENBQVgsR0FBMEIsU0FBckMsRUFBZ0QsQ0FBaEQsQ0FBUjtBQUNiO0FBQ0EsUUFBSSxVQUFVLFNBQVYsSUFBdUIsRUFBRSxLQUFLLEtBQUwsSUFBYyxZQUFZLE1BQVosQ0FBaEIsQ0FBM0IsRUFBaUU7QUFDL0QsV0FBSyxXQUFXLE9BQU8sSUFBUCxDQUFZLENBQVosQ0FBWCxFQUEyQixTQUFTLElBQUksQ0FBSixFQUF6QyxFQUFrRCxDQUFDLENBQUMsT0FBTyxTQUFTLElBQVQsRUFBUixFQUF5QixJQUE1RSxFQUFrRixPQUFsRixFQUEyRjtBQUN6Rix1QkFBZSxNQUFmLEVBQXVCLEtBQXZCLEVBQThCLFVBQVUsS0FBSyxRQUFMLEVBQWUsS0FBZixFQUFzQixDQUFDLEtBQUssS0FBTixFQUFhLEtBQWIsQ0FBdEIsRUFBMkMsSUFBM0MsQ0FBVixHQUE2RCxLQUFLLEtBQWhHO0FBQ0Q7QUFDRixLQUpELE1BSU87QUFDTCxlQUFTLFNBQVMsRUFBRSxNQUFYLENBQVQ7QUFDQSxXQUFLLFNBQVMsSUFBSSxDQUFKLENBQU0sTUFBTixDQUFkLEVBQTZCLFNBQVMsS0FBdEMsRUFBNkMsT0FBN0MsRUFBc0Q7QUFDcEQsdUJBQWUsTUFBZixFQUF1QixLQUF2QixFQUE4QixVQUFVLE1BQU0sRUFBRSxLQUFGLENBQU4sRUFBZ0IsS0FBaEIsQ0FBVixHQUFtQyxFQUFFLEtBQUYsQ0FBakU7QUFDRDtBQUNGO0FBQ0QsV0FBTyxNQUFQLEdBQWdCLEtBQWhCO0FBQ0EsV0FBTyxNQUFQO0FBQ0Q7QUF6QnlHLENBQTVHOzs7OztBQ1ZBO0FBQ0EsSUFBSSxVQUFVLFFBQVEsV0FBUixDQUFkOztBQUVBLFFBQVEsUUFBUSxDQUFSLEdBQVksUUFBUSxDQUE1QixFQUErQixRQUEvQixFQUF5QyxFQUFFLFFBQVEsUUFBUSxrQkFBUixDQUFWLEVBQXpDOzs7QUNIQTs7QUFDQSxJQUFJLE1BQU0sUUFBUSxjQUFSLEVBQXdCLElBQXhCLENBQVY7O0FBRUE7QUFDQSxRQUFRLGdCQUFSLEVBQTBCLE1BQTFCLEVBQWtDLFFBQWxDLEVBQTRDLFVBQVUsUUFBVixFQUFvQjtBQUM5RCxPQUFLLEVBQUwsR0FBVSxPQUFPLFFBQVAsQ0FBVixDQUQ4RCxDQUNsQztBQUM1QixPQUFLLEVBQUwsR0FBVSxDQUFWLENBRjhELENBRWxDO0FBQzlCO0FBQ0MsQ0FKRCxFQUlHLFlBQVk7QUFDYixNQUFJLElBQUksS0FBSyxFQUFiO0FBQ0EsTUFBSSxRQUFRLEtBQUssRUFBakI7QUFDQSxNQUFJLEtBQUo7QUFDQSxNQUFJLFNBQVMsRUFBRSxNQUFmLEVBQXVCLE9BQU8sRUFBRSxPQUFPLFNBQVQsRUFBb0IsTUFBTSxJQUExQixFQUFQO0FBQ3ZCLFVBQVEsSUFBSSxDQUFKLEVBQU8sS0FBUCxDQUFSO0FBQ0EsT0FBSyxFQUFMLElBQVcsTUFBTSxNQUFqQjtBQUNBLFNBQU8sRUFBRSxPQUFPLEtBQVQsRUFBZ0IsTUFBTSxLQUF0QixFQUFQO0FBQ0QsQ0FaRDs7Ozs7OztBQ0pBOzs7QUFHQSxDQUFDLFVBQVUsSUFBVixFQUFnQixVQUFoQixFQUE0Qjs7QUFFM0IsTUFBSSxPQUFPLE1BQVAsSUFBaUIsV0FBckIsRUFBa0MsT0FBTyxPQUFQLEdBQWlCLFlBQWpCLENBQWxDLEtBQ0ssSUFBSSxPQUFPLE1BQVAsSUFBaUIsVUFBakIsSUFBK0IsUUFBTyxPQUFPLEdBQWQsS0FBcUIsUUFBeEQsRUFBa0UsT0FBTyxVQUFQLEVBQWxFLEtBQ0EsS0FBSyxJQUFMLElBQWEsWUFBYjtBQUVOLENBTkEsQ0FNQyxVQU5ELEVBTWEsWUFBWTs7QUFFeEIsTUFBSSxNQUFNLEVBQVY7QUFBQSxNQUFjLFNBQWQ7QUFBQSxNQUNJLE1BQU0sUUFEVjtBQUFBLE1BRUksT0FBTyxJQUFJLGVBQUosQ0FBb0IsUUFGL0I7QUFBQSxNQUdJLG1CQUFtQixrQkFIdkI7QUFBQSxNQUlJLFNBQVMsQ0FBQyxPQUFPLFlBQVAsR0FBc0IsZUFBdkIsRUFBd0MsSUFBeEMsQ0FBNkMsSUFBSSxVQUFqRCxDQUpiOztBQU9BLE1BQUksQ0FBQyxNQUFMLEVBQ0EsSUFBSSxnQkFBSixDQUFxQixnQkFBckIsRUFBdUMsWUFBVyxvQkFBWTtBQUM1RCxRQUFJLG1CQUFKLENBQXdCLGdCQUF4QixFQUEwQyxTQUExQztBQUNBLGFBQVMsQ0FBVDtBQUNBLFdBQU8sWUFBVyxJQUFJLEtBQUosRUFBbEI7QUFBK0I7QUFBL0I7QUFDRCxHQUpEOztBQU1BLFNBQU8sVUFBVSxFQUFWLEVBQWM7QUFDbkIsYUFBUyxXQUFXLEVBQVgsRUFBZSxDQUFmLENBQVQsR0FBNkIsSUFBSSxJQUFKLENBQVMsRUFBVCxDQUE3QjtBQUNELEdBRkQ7QUFJRCxDQTFCQSxDQUFEOzs7QUNIQTs7QUFFQTtBQUNBOztBQUVBLFNBQVMsU0FBVCxHQUFxQjtBQUNwQixLQUFJLE9BQU8sU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVg7QUFDQSxNQUFLLFlBQUwsQ0FBa0IsVUFBbEIsRUFBOEIsR0FBOUI7O0FBRUEsUUFBTyxRQUFRLEtBQUssT0FBTCxJQUFnQixLQUFLLE9BQUwsQ0FBYSxFQUFiLEtBQW9CLEdBQTVDLENBQVA7QUFDQTs7QUFFRCxTQUFTLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0M7QUFDL0IsUUFBTyxRQUFRLE9BQWY7QUFDQTs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsY0FBYyxhQUFkLEdBQThCLFVBQVUsT0FBVixFQUFtQjtBQUNqRSxLQUFJLE1BQU0sRUFBVjtBQUNBLEtBQUksYUFBYSxRQUFRLFVBQXpCOztBQUVBLFVBQVMsTUFBVCxHQUFrQjtBQUNqQixTQUFPLEtBQUssS0FBWjtBQUNBOztBQUVELFVBQVMsTUFBVCxDQUFnQixJQUFoQixFQUFzQixLQUF0QixFQUE2QjtBQUM1QixNQUFJLE9BQU8sS0FBUCxLQUFpQixXQUFyQixFQUFrQztBQUNqQyxRQUFLLGVBQUwsQ0FBcUIsSUFBckI7QUFDQSxHQUZELE1BRU87QUFDTixRQUFLLFlBQUwsQ0FBa0IsSUFBbEIsRUFBd0IsS0FBeEI7QUFDQTtBQUNEOztBQUVELE1BQUssSUFBSSxJQUFJLENBQVIsRUFBVyxJQUFJLFdBQVcsTUFBL0IsRUFBdUMsSUFBSSxDQUEzQyxFQUE4QyxHQUE5QyxFQUFtRDtBQUNsRCxNQUFJLFlBQVksV0FBVyxDQUFYLENBQWhCOztBQUVBLE1BQUksU0FBSixFQUFlO0FBQ2QsT0FBSSxPQUFPLFVBQVUsSUFBckI7O0FBRUEsT0FBSSxLQUFLLE9BQUwsQ0FBYSxPQUFiLE1BQTBCLENBQTlCLEVBQWlDO0FBQ2hDLFFBQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsT0FBZCxDQUFzQixLQUF0QixFQUE2QixVQUFVLENBQVYsRUFBYTtBQUNwRCxZQUFPLEVBQUUsTUFBRixDQUFTLENBQVQsRUFBWSxXQUFaLEVBQVA7QUFDQSxLQUZVLENBQVg7O0FBSUEsUUFBSSxRQUFRLFVBQVUsS0FBdEI7O0FBRUEsV0FBTyxjQUFQLENBQXNCLEdBQXRCLEVBQTJCLElBQTNCLEVBQWlDO0FBQ2hDLGlCQUFZLElBRG9CO0FBRWhDLFVBQUssT0FBTyxJQUFQLENBQVksRUFBRSxPQUFPLFNBQVMsRUFBbEIsRUFBWixDQUYyQjtBQUdoQyxVQUFLLE9BQU8sSUFBUCxDQUFZLE9BQVosRUFBcUIsSUFBckI7QUFIMkIsS0FBakM7QUFLQTtBQUNEO0FBQ0Q7O0FBRUQsUUFBTyxHQUFQO0FBQ0EsQ0F2Q0Q7Ozs7O0FDaEJBOztBQUVBLENBQUMsVUFBVSxZQUFWLEVBQXdCO0FBQ3hCLEtBQUksT0FBTyxhQUFhLE9BQXBCLEtBQWdDLFVBQXBDLEVBQWdEO0FBQy9DLGVBQWEsT0FBYixHQUF1QixhQUFhLGlCQUFiLElBQWtDLGFBQWEsa0JBQS9DLElBQXFFLGFBQWEscUJBQWxGLElBQTJHLFNBQVMsT0FBVCxDQUFpQixRQUFqQixFQUEyQjtBQUM1SixPQUFJLFVBQVUsSUFBZDtBQUNBLE9BQUksV0FBVyxDQUFDLFFBQVEsUUFBUixJQUFvQixRQUFRLGFBQTdCLEVBQTRDLGdCQUE1QyxDQUE2RCxRQUE3RCxDQUFmO0FBQ0EsT0FBSSxRQUFRLENBQVo7O0FBRUEsVUFBTyxTQUFTLEtBQVQsS0FBbUIsU0FBUyxLQUFULE1BQW9CLE9BQTlDLEVBQXVEO0FBQ3RELE1BQUUsS0FBRjtBQUNBOztBQUVELFVBQU8sUUFBUSxTQUFTLEtBQVQsQ0FBUixDQUFQO0FBQ0EsR0FWRDtBQVdBOztBQUVELEtBQUksT0FBTyxhQUFhLE9BQXBCLEtBQWdDLFVBQXBDLEVBQWdEO0FBQy9DLGVBQWEsT0FBYixHQUF1QixTQUFTLE9BQVQsQ0FBaUIsUUFBakIsRUFBMkI7QUFDakQsT0FBSSxVQUFVLElBQWQ7O0FBRUEsVUFBTyxXQUFXLFFBQVEsUUFBUixLQUFxQixDQUF2QyxFQUEwQztBQUN6QyxRQUFJLFFBQVEsT0FBUixDQUFnQixRQUFoQixDQUFKLEVBQStCO0FBQzlCLFlBQU8sT0FBUDtBQUNBOztBQUVELGNBQVUsUUFBUSxVQUFsQjtBQUNBOztBQUVELFVBQU8sSUFBUDtBQUNBLEdBWkQ7QUFhQTtBQUNELENBOUJELEVBOEJHLE9BQU8sT0FBUCxDQUFlLFNBOUJsQjs7Ozs7Ozs7QUNGQTs7Ozs7Ozs7O0FBU0E7QUFDQSxJQUFJLGtCQUFrQixxQkFBdEI7O0FBRUE7QUFDQSxJQUFJLE1BQU0sSUFBSSxDQUFkOztBQUVBO0FBQ0EsSUFBSSxZQUFZLGlCQUFoQjs7QUFFQTtBQUNBLElBQUksU0FBUyxZQUFiOztBQUVBO0FBQ0EsSUFBSSxhQUFhLG9CQUFqQjs7QUFFQTtBQUNBLElBQUksYUFBYSxZQUFqQjs7QUFFQTtBQUNBLElBQUksWUFBWSxhQUFoQjs7QUFFQTtBQUNBLElBQUksZUFBZSxRQUFuQjs7QUFFQTtBQUNBLElBQUksYUFBYSxRQUFPLE1BQVAseUNBQU8sTUFBUCxNQUFpQixRQUFqQixJQUE2QixNQUE3QixJQUF1QyxPQUFPLE1BQVAsS0FBa0IsTUFBekQsSUFBbUUsTUFBcEY7O0FBRUE7QUFDQSxJQUFJLFdBQVcsUUFBTyxJQUFQLHlDQUFPLElBQVAsTUFBZSxRQUFmLElBQTJCLElBQTNCLElBQW1DLEtBQUssTUFBTCxLQUFnQixNQUFuRCxJQUE2RCxJQUE1RTs7QUFFQTtBQUNBLElBQUksT0FBTyxjQUFjLFFBQWQsSUFBMEIsU0FBUyxhQUFULEdBQXJDOztBQUVBO0FBQ0EsSUFBSSxjQUFjLE9BQU8sU0FBekI7O0FBRUE7Ozs7O0FBS0EsSUFBSSxpQkFBaUIsWUFBWSxRQUFqQzs7QUFFQTtBQUNBLElBQUksWUFBWSxLQUFLLEdBQXJCO0FBQUEsSUFDSSxZQUFZLEtBQUssR0FEckI7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsSUFBSSxNQUFNLFNBQU4sR0FBTSxHQUFXO0FBQ25CLFNBQU8sS0FBSyxJQUFMLENBQVUsR0FBVixFQUFQO0FBQ0QsQ0FGRDs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0RBLFNBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF3QixJQUF4QixFQUE4QixPQUE5QixFQUF1QztBQUNyQyxNQUFJLFFBQUo7QUFBQSxNQUNJLFFBREo7QUFBQSxNQUVJLE9BRko7QUFBQSxNQUdJLE1BSEo7QUFBQSxNQUlJLE9BSko7QUFBQSxNQUtJLFlBTEo7QUFBQSxNQU1JLGlCQUFpQixDQU5yQjtBQUFBLE1BT0ksVUFBVSxLQVBkO0FBQUEsTUFRSSxTQUFTLEtBUmI7QUFBQSxNQVNJLFdBQVcsSUFUZjs7QUFXQSxNQUFJLE9BQU8sSUFBUCxJQUFlLFVBQW5CLEVBQStCO0FBQzdCLFVBQU0sSUFBSSxTQUFKLENBQWMsZUFBZCxDQUFOO0FBQ0Q7QUFDRCxTQUFPLFNBQVMsSUFBVCxLQUFrQixDQUF6QjtBQUNBLE1BQUksU0FBUyxPQUFULENBQUosRUFBdUI7QUFDckIsY0FBVSxDQUFDLENBQUMsUUFBUSxPQUFwQjtBQUNBLGFBQVMsYUFBYSxPQUF0QjtBQUNBLGNBQVUsU0FBUyxVQUFVLFNBQVMsUUFBUSxPQUFqQixLQUE2QixDQUF2QyxFQUEwQyxJQUExQyxDQUFULEdBQTJELE9BQXJFO0FBQ0EsZUFBVyxjQUFjLE9BQWQsR0FBd0IsQ0FBQyxDQUFDLFFBQVEsUUFBbEMsR0FBNkMsUUFBeEQ7QUFDRDs7QUFFRCxXQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEI7QUFDeEIsUUFBSSxPQUFPLFFBQVg7QUFBQSxRQUNJLFVBQVUsUUFEZDs7QUFHQSxlQUFXLFdBQVcsU0FBdEI7QUFDQSxxQkFBaUIsSUFBakI7QUFDQSxhQUFTLEtBQUssS0FBTCxDQUFXLE9BQVgsRUFBb0IsSUFBcEIsQ0FBVDtBQUNBLFdBQU8sTUFBUDtBQUNEOztBQUVELFdBQVMsV0FBVCxDQUFxQixJQUFyQixFQUEyQjtBQUN6QjtBQUNBLHFCQUFpQixJQUFqQjtBQUNBO0FBQ0EsY0FBVSxXQUFXLFlBQVgsRUFBeUIsSUFBekIsQ0FBVjtBQUNBO0FBQ0EsV0FBTyxVQUFVLFdBQVcsSUFBWCxDQUFWLEdBQTZCLE1BQXBDO0FBQ0Q7O0FBRUQsV0FBUyxhQUFULENBQXVCLElBQXZCLEVBQTZCO0FBQzNCLFFBQUksb0JBQW9CLE9BQU8sWUFBL0I7QUFBQSxRQUNJLHNCQUFzQixPQUFPLGNBRGpDO0FBQUEsUUFFSSxTQUFTLE9BQU8saUJBRnBCOztBQUlBLFdBQU8sU0FBUyxVQUFVLE1BQVYsRUFBa0IsVUFBVSxtQkFBNUIsQ0FBVCxHQUE0RCxNQUFuRTtBQUNEOztBQUVELFdBQVMsWUFBVCxDQUFzQixJQUF0QixFQUE0QjtBQUMxQixRQUFJLG9CQUFvQixPQUFPLFlBQS9CO0FBQUEsUUFDSSxzQkFBc0IsT0FBTyxjQURqQzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxXQUFRLGlCQUFpQixTQUFqQixJQUErQixxQkFBcUIsSUFBcEQsSUFDTCxvQkFBb0IsQ0FEZixJQUNzQixVQUFVLHVCQUF1QixPQUQvRDtBQUVEOztBQUVELFdBQVMsWUFBVCxHQUF3QjtBQUN0QixRQUFJLE9BQU8sS0FBWDtBQUNBLFFBQUksYUFBYSxJQUFiLENBQUosRUFBd0I7QUFDdEIsYUFBTyxhQUFhLElBQWIsQ0FBUDtBQUNEO0FBQ0Q7QUFDQSxjQUFVLFdBQVcsWUFBWCxFQUF5QixjQUFjLElBQWQsQ0FBekIsQ0FBVjtBQUNEOztBQUVELFdBQVMsWUFBVCxDQUFzQixJQUF0QixFQUE0QjtBQUMxQixjQUFVLFNBQVY7O0FBRUE7QUFDQTtBQUNBLFFBQUksWUFBWSxRQUFoQixFQUEwQjtBQUN4QixhQUFPLFdBQVcsSUFBWCxDQUFQO0FBQ0Q7QUFDRCxlQUFXLFdBQVcsU0FBdEI7QUFDQSxXQUFPLE1BQVA7QUFDRDs7QUFFRCxXQUFTLE1BQVQsR0FBa0I7QUFDaEIsUUFBSSxZQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLG1CQUFhLE9BQWI7QUFDRDtBQUNELHFCQUFpQixDQUFqQjtBQUNBLGVBQVcsZUFBZSxXQUFXLFVBQVUsU0FBL0M7QUFDRDs7QUFFRCxXQUFTLEtBQVQsR0FBaUI7QUFDZixXQUFPLFlBQVksU0FBWixHQUF3QixNQUF4QixHQUFpQyxhQUFhLEtBQWIsQ0FBeEM7QUFDRDs7QUFFRCxXQUFTLFNBQVQsR0FBcUI7QUFDbkIsUUFBSSxPQUFPLEtBQVg7QUFBQSxRQUNJLGFBQWEsYUFBYSxJQUFiLENBRGpCOztBQUdBLGVBQVcsU0FBWDtBQUNBLGVBQVcsSUFBWDtBQUNBLG1CQUFlLElBQWY7O0FBRUEsUUFBSSxVQUFKLEVBQWdCO0FBQ2QsVUFBSSxZQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLGVBQU8sWUFBWSxZQUFaLENBQVA7QUFDRDtBQUNELFVBQUksTUFBSixFQUFZO0FBQ1Y7QUFDQSxrQkFBVSxXQUFXLFlBQVgsRUFBeUIsSUFBekIsQ0FBVjtBQUNBLGVBQU8sV0FBVyxZQUFYLENBQVA7QUFDRDtBQUNGO0FBQ0QsUUFBSSxZQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLGdCQUFVLFdBQVcsWUFBWCxFQUF5QixJQUF6QixDQUFWO0FBQ0Q7QUFDRCxXQUFPLE1BQVA7QUFDRDtBQUNELFlBQVUsTUFBVixHQUFtQixNQUFuQjtBQUNBLFlBQVUsS0FBVixHQUFrQixLQUFsQjtBQUNBLFNBQU8sU0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUF5QjtBQUN2QixNQUFJLGNBQWMsS0FBZCx5Q0FBYyxLQUFkLENBQUo7QUFDQSxTQUFPLENBQUMsQ0FBQyxLQUFGLEtBQVksUUFBUSxRQUFSLElBQW9CLFFBQVEsVUFBeEMsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QkEsU0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQTZCO0FBQzNCLFNBQU8sQ0FBQyxDQUFDLEtBQUYsSUFBVyxRQUFPLEtBQVAseUNBQU8sS0FBUCxNQUFnQixRQUFsQztBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxTQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFBeUI7QUFDdkIsU0FBTyxRQUFPLEtBQVAseUNBQU8sS0FBUCxNQUFnQixRQUFoQixJQUNKLGFBQWEsS0FBYixLQUF1QixlQUFlLElBQWYsQ0FBb0IsS0FBcEIsS0FBOEIsU0FEeEQ7QUFFRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkEsU0FBUyxRQUFULENBQWtCLEtBQWxCLEVBQXlCO0FBQ3ZCLE1BQUksT0FBTyxLQUFQLElBQWdCLFFBQXBCLEVBQThCO0FBQzVCLFdBQU8sS0FBUDtBQUNEO0FBQ0QsTUFBSSxTQUFTLEtBQVQsQ0FBSixFQUFxQjtBQUNuQixXQUFPLEdBQVA7QUFDRDtBQUNELE1BQUksU0FBUyxLQUFULENBQUosRUFBcUI7QUFDbkIsUUFBSSxRQUFRLE9BQU8sTUFBTSxPQUFiLElBQXdCLFVBQXhCLEdBQXFDLE1BQU0sT0FBTixFQUFyQyxHQUF1RCxLQUFuRTtBQUNBLFlBQVEsU0FBUyxLQUFULElBQW1CLFFBQVEsRUFBM0IsR0FBaUMsS0FBekM7QUFDRDtBQUNELE1BQUksT0FBTyxLQUFQLElBQWdCLFFBQXBCLEVBQThCO0FBQzVCLFdBQU8sVUFBVSxDQUFWLEdBQWMsS0FBZCxHQUFzQixDQUFDLEtBQTlCO0FBQ0Q7QUFDRCxVQUFRLE1BQU0sT0FBTixDQUFjLE1BQWQsRUFBc0IsRUFBdEIsQ0FBUjtBQUNBLE1BQUksV0FBVyxXQUFXLElBQVgsQ0FBZ0IsS0FBaEIsQ0FBZjtBQUNBLFNBQVEsWUFBWSxVQUFVLElBQVYsQ0FBZSxLQUFmLENBQWIsR0FDSCxhQUFhLE1BQU0sS0FBTixDQUFZLENBQVosQ0FBYixFQUE2QixXQUFXLENBQVgsR0FBZSxDQUE1QyxDQURHLEdBRUYsV0FBVyxJQUFYLENBQWdCLEtBQWhCLElBQXlCLEdBQXpCLEdBQStCLENBQUMsS0FGckM7QUFHRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsUUFBakI7Ozs7O0FDeFhBOzs7Ozs7QUFNQTtBQUNBOztBQUNBLElBQUksd0JBQXdCLE9BQU8scUJBQW5DO0FBQ0EsSUFBSSxpQkFBaUIsT0FBTyxTQUFQLENBQWlCLGNBQXRDO0FBQ0EsSUFBSSxtQkFBbUIsT0FBTyxTQUFQLENBQWlCLG9CQUF4Qzs7QUFFQSxTQUFTLFFBQVQsQ0FBa0IsR0FBbEIsRUFBdUI7QUFDdEIsS0FBSSxRQUFRLElBQVIsSUFBZ0IsUUFBUSxTQUE1QixFQUF1QztBQUN0QyxRQUFNLElBQUksU0FBSixDQUFjLHVEQUFkLENBQU47QUFDQTs7QUFFRCxRQUFPLE9BQU8sR0FBUCxDQUFQO0FBQ0E7O0FBRUQsU0FBUyxlQUFULEdBQTJCO0FBQzFCLEtBQUk7QUFDSCxNQUFJLENBQUMsT0FBTyxNQUFaLEVBQW9CO0FBQ25CLFVBQU8sS0FBUDtBQUNBOztBQUVEOztBQUVBO0FBQ0EsTUFBSSxRQUFRLElBQUksTUFBSixDQUFXLEtBQVgsQ0FBWixDQVJHLENBUTZCO0FBQ2hDLFFBQU0sQ0FBTixJQUFXLElBQVg7QUFDQSxNQUFJLE9BQU8sbUJBQVAsQ0FBMkIsS0FBM0IsRUFBa0MsQ0FBbEMsTUFBeUMsR0FBN0MsRUFBa0Q7QUFDakQsVUFBTyxLQUFQO0FBQ0E7O0FBRUQ7QUFDQSxNQUFJLFFBQVEsRUFBWjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxFQUFwQixFQUF3QixHQUF4QixFQUE2QjtBQUM1QixTQUFNLE1BQU0sT0FBTyxZQUFQLENBQW9CLENBQXBCLENBQVosSUFBc0MsQ0FBdEM7QUFDQTtBQUNELE1BQUksU0FBUyxPQUFPLG1CQUFQLENBQTJCLEtBQTNCLEVBQWtDLEdBQWxDLENBQXNDLFVBQVUsQ0FBVixFQUFhO0FBQy9ELFVBQU8sTUFBTSxDQUFOLENBQVA7QUFDQSxHQUZZLENBQWI7QUFHQSxNQUFJLE9BQU8sSUFBUCxDQUFZLEVBQVosTUFBb0IsWUFBeEIsRUFBc0M7QUFDckMsVUFBTyxLQUFQO0FBQ0E7O0FBRUQ7QUFDQSxNQUFJLFFBQVEsRUFBWjtBQUNBLHlCQUF1QixLQUF2QixDQUE2QixFQUE3QixFQUFpQyxPQUFqQyxDQUF5QyxVQUFVLE1BQVYsRUFBa0I7QUFDMUQsU0FBTSxNQUFOLElBQWdCLE1BQWhCO0FBQ0EsR0FGRDtBQUdBLE1BQUksT0FBTyxJQUFQLENBQVksT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFsQixDQUFaLEVBQXNDLElBQXRDLENBQTJDLEVBQTNDLE1BQ0Ysc0JBREYsRUFDMEI7QUFDekIsVUFBTyxLQUFQO0FBQ0E7O0FBRUQsU0FBTyxJQUFQO0FBQ0EsRUFyQ0QsQ0FxQ0UsT0FBTyxHQUFQLEVBQVk7QUFDYjtBQUNBLFNBQU8sS0FBUDtBQUNBO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLG9CQUFvQixPQUFPLE1BQTNCLEdBQW9DLFVBQVUsTUFBVixFQUFrQixNQUFsQixFQUEwQjtBQUM5RSxLQUFJLElBQUo7QUFDQSxLQUFJLEtBQUssU0FBUyxNQUFULENBQVQ7QUFDQSxLQUFJLE9BQUo7O0FBRUEsTUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDMUMsU0FBTyxPQUFPLFVBQVUsQ0FBVixDQUFQLENBQVA7O0FBRUEsT0FBSyxJQUFJLEdBQVQsSUFBZ0IsSUFBaEIsRUFBc0I7QUFDckIsT0FBSSxlQUFlLElBQWYsQ0FBb0IsSUFBcEIsRUFBMEIsR0FBMUIsQ0FBSixFQUFvQztBQUNuQyxPQUFHLEdBQUgsSUFBVSxLQUFLLEdBQUwsQ0FBVjtBQUNBO0FBQ0Q7O0FBRUQsTUFBSSxxQkFBSixFQUEyQjtBQUMxQixhQUFVLHNCQUFzQixJQUF0QixDQUFWO0FBQ0EsUUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFFBQVEsTUFBNUIsRUFBb0MsR0FBcEMsRUFBeUM7QUFDeEMsUUFBSSxpQkFBaUIsSUFBakIsQ0FBc0IsSUFBdEIsRUFBNEIsUUFBUSxDQUFSLENBQTVCLENBQUosRUFBNkM7QUFDNUMsUUFBRyxRQUFRLENBQVIsQ0FBSCxJQUFpQixLQUFLLFFBQVEsQ0FBUixDQUFMLENBQWpCO0FBQ0E7QUFDRDtBQUNEO0FBQ0Q7O0FBRUQsUUFBTyxFQUFQO0FBQ0EsQ0F6QkQ7Ozs7Ozs7QUNoRUEsSUFBTSxTQUFTLFFBQVEsZUFBUixDQUFmO0FBQ0EsSUFBTSxXQUFXLFFBQVEsYUFBUixDQUFqQjtBQUNBLElBQU0sY0FBYyxRQUFRLGdCQUFSLENBQXBCOztBQUVBLElBQU0sbUJBQW1CLHlCQUF6QjtBQUNBLElBQU0sUUFBUSxHQUFkOztBQUVBLElBQU0sZUFBZSxTQUFmLFlBQWUsQ0FBUyxJQUFULEVBQWUsT0FBZixFQUF3QjtBQUMzQyxNQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcsZ0JBQVgsQ0FBWjtBQUNBLE1BQUksUUFBSjtBQUNBLE1BQUksS0FBSixFQUFXO0FBQ1QsV0FBTyxNQUFNLENBQU4sQ0FBUDtBQUNBLGVBQVcsTUFBTSxDQUFOLENBQVg7QUFDRDs7QUFFRCxNQUFJLE9BQUo7QUFDQSxNQUFJLFFBQU8sT0FBUCx5Q0FBTyxPQUFQLE9BQW1CLFFBQXZCLEVBQWlDO0FBQy9CLGNBQVU7QUFDUixlQUFTLE9BQU8sT0FBUCxFQUFnQixTQUFoQixDQUREO0FBRVIsZUFBUyxPQUFPLE9BQVAsRUFBZ0IsU0FBaEI7QUFGRCxLQUFWO0FBSUQ7O0FBRUQsTUFBSSxXQUFXO0FBQ2IsY0FBVSxRQURHO0FBRWIsY0FBVyxRQUFPLE9BQVAseUNBQU8sT0FBUCxPQUFtQixRQUFwQixHQUNOLFlBQVksT0FBWixDQURNLEdBRU4sV0FDRSxTQUFTLFFBQVQsRUFBbUIsT0FBbkIsQ0FERixHQUVFLE9BTk87QUFPYixhQUFTO0FBUEksR0FBZjs7QUFVQSxNQUFJLEtBQUssT0FBTCxDQUFhLEtBQWIsSUFBc0IsQ0FBQyxDQUEzQixFQUE4QjtBQUM1QixXQUFPLEtBQUssS0FBTCxDQUFXLEtBQVgsRUFBa0IsR0FBbEIsQ0FBc0IsVUFBUyxLQUFULEVBQWdCO0FBQzNDLGFBQU8sT0FBTyxFQUFDLE1BQU0sS0FBUCxFQUFQLEVBQXNCLFFBQXRCLENBQVA7QUFDRCxLQUZNLENBQVA7QUFHRCxHQUpELE1BSU87QUFDTCxhQUFTLElBQVQsR0FBZ0IsSUFBaEI7QUFDQSxXQUFPLENBQUMsUUFBRCxDQUFQO0FBQ0Q7QUFDRixDQWxDRDs7QUFvQ0EsSUFBSSxTQUFTLFNBQVQsTUFBUyxDQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CO0FBQzlCLE1BQUksUUFBUSxJQUFJLEdBQUosQ0FBWjtBQUNBLFNBQU8sSUFBSSxHQUFKLENBQVA7QUFDQSxTQUFPLEtBQVA7QUFDRCxDQUpEOztBQU1BLE9BQU8sT0FBUCxHQUFpQixTQUFTLFFBQVQsQ0FBa0IsTUFBbEIsRUFBMEIsS0FBMUIsRUFBaUM7QUFDaEQsTUFBTSxZQUFZLE9BQU8sSUFBUCxDQUFZLE1BQVosRUFDZixNQURlLENBQ1IsVUFBUyxJQUFULEVBQWUsSUFBZixFQUFxQjtBQUMzQixRQUFJLFlBQVksYUFBYSxJQUFiLEVBQW1CLE9BQU8sSUFBUCxDQUFuQixDQUFoQjtBQUNBLFdBQU8sS0FBSyxNQUFMLENBQVksU0FBWixDQUFQO0FBQ0QsR0FKZSxFQUliLEVBSmEsQ0FBbEI7O0FBTUEsU0FBTyxPQUFPO0FBQ1osU0FBSyxTQUFTLFdBQVQsQ0FBcUIsT0FBckIsRUFBOEI7QUFDakMsZ0JBQVUsT0FBVixDQUFrQixVQUFTLFFBQVQsRUFBbUI7QUFDbkMsZ0JBQVEsZ0JBQVIsQ0FDRSxTQUFTLElBRFgsRUFFRSxTQUFTLFFBRlgsRUFHRSxTQUFTLE9BSFg7QUFLRCxPQU5EO0FBT0QsS0FUVztBQVVaLFlBQVEsU0FBUyxjQUFULENBQXdCLE9BQXhCLEVBQWlDO0FBQ3ZDLGdCQUFVLE9BQVYsQ0FBa0IsVUFBUyxRQUFULEVBQW1CO0FBQ25DLGdCQUFRLG1CQUFSLENBQ0UsU0FBUyxJQURYLEVBRUUsU0FBUyxRQUZYLEVBR0UsU0FBUyxPQUhYO0FBS0QsT0FORDtBQU9EO0FBbEJXLEdBQVAsRUFtQkosS0FuQkksQ0FBUDtBQW9CRCxDQTNCRDs7Ozs7QUNqREEsT0FBTyxPQUFQLEdBQWlCLFNBQVMsT0FBVCxDQUFpQixTQUFqQixFQUE0QjtBQUMzQyxTQUFPLFVBQVMsQ0FBVCxFQUFZO0FBQ2pCLFdBQU8sVUFBVSxJQUFWLENBQWUsVUFBUyxFQUFULEVBQWE7QUFDakMsYUFBTyxHQUFHLElBQUgsQ0FBUSxJQUFSLEVBQWMsQ0FBZCxNQUFxQixLQUE1QjtBQUNELEtBRk0sRUFFSixJQUZJLENBQVA7QUFHRCxHQUpEO0FBS0QsQ0FORDs7Ozs7QUNBQSxJQUFNLFdBQVcsUUFBUSxhQUFSLENBQWpCO0FBQ0EsSUFBTSxVQUFVLFFBQVEsWUFBUixDQUFoQjs7QUFFQSxJQUFNLFFBQVEsR0FBZDs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxXQUFULENBQXFCLFNBQXJCLEVBQWdDO0FBQy9DLE1BQU0sT0FBTyxPQUFPLElBQVAsQ0FBWSxTQUFaLENBQWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSSxLQUFLLE1BQUwsS0FBZ0IsQ0FBaEIsSUFBcUIsS0FBSyxDQUFMLE1BQVksS0FBckMsRUFBNEM7QUFDMUMsV0FBTyxVQUFVLEtBQVYsQ0FBUDtBQUNEOztBQUVELE1BQU0sWUFBWSxLQUFLLE1BQUwsQ0FBWSxVQUFTLElBQVQsRUFBZSxRQUFmLEVBQXlCO0FBQ3JELFNBQUssSUFBTCxDQUFVLFNBQVMsUUFBVCxFQUFtQixVQUFVLFFBQVYsQ0FBbkIsQ0FBVjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBSGlCLEVBR2YsRUFIZSxDQUFsQjtBQUlBLFNBQU8sUUFBUSxTQUFSLENBQVA7QUFDRCxDQWZEOzs7OztBQ0xBO0FBQ0EsUUFBUSxpQkFBUjs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxRQUFULENBQWtCLFFBQWxCLEVBQTRCLEVBQTVCLEVBQWdDO0FBQy9DLFNBQU8sU0FBUyxVQUFULENBQW9CLEtBQXBCLEVBQTJCO0FBQ2hDLFFBQUksU0FBUyxNQUFNLE1BQU4sQ0FBYSxPQUFiLENBQXFCLFFBQXJCLENBQWI7QUFDQSxRQUFJLE1BQUosRUFBWTtBQUNWLGFBQU8sR0FBRyxJQUFILENBQVEsTUFBUixFQUFnQixLQUFoQixDQUFQO0FBQ0Q7QUFDRixHQUxEO0FBTUQsQ0FQRDs7Ozs7QUNIQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxJQUFULENBQWMsUUFBZCxFQUF3QixPQUF4QixFQUFpQztBQUNoRCxNQUFJLFVBQVUsU0FBUyxXQUFULENBQXFCLENBQXJCLEVBQXdCO0FBQ3BDLE1BQUUsYUFBRixDQUFnQixtQkFBaEIsQ0FBb0MsRUFBRSxJQUF0QyxFQUE0QyxPQUE1QyxFQUFxRCxPQUFyRDtBQUNBLFdBQU8sU0FBUyxJQUFULENBQWMsSUFBZCxFQUFvQixDQUFwQixDQUFQO0FBQ0QsR0FIRDtBQUlBLFNBQU8sT0FBUDtBQUNELENBTkQ7OztBQ0FBOzs7O0FBQ0EsSUFBTSxXQUFXLFFBQVEsbUJBQVIsQ0FBakI7QUFDQSxJQUFNLFNBQVMsUUFBUSxjQUFSLENBQWY7QUFDQSxJQUFNLFVBQVUsUUFBUSxlQUFSLENBQWhCO0FBQ0EsSUFBTSxTQUFTLFFBQVEsaUJBQVIsQ0FBZjtBQUNBLElBQU0sc0JBQXNCLFFBQVEseUJBQVIsQ0FBNUI7O0FBRUEsSUFBTSxRQUFRLFFBQVEsV0FBUixFQUFxQixLQUFuQztBQUNBLElBQU0sU0FBUyxRQUFRLFdBQVIsRUFBcUIsTUFBcEM7O0FBRUE7QUFDQSxJQUFNLGtCQUFnQixNQUFoQixvQkFBcUMsTUFBckMsdUJBQU47QUFDQSxJQUFNLGVBQWEsTUFBYixvQ0FBTjtBQUNBLElBQU0sV0FBVyxlQUFqQjtBQUNBLElBQU0sa0JBQWtCLHNCQUF4Qjs7QUFFQTs7Ozs7Ozs7O0FBU0EsSUFBTSxlQUFlLFNBQWYsWUFBZSxDQUFDLE1BQUQsRUFBUyxRQUFULEVBQXNCO0FBQ3pDLE1BQUksWUFBWSxPQUFPLE9BQVAsQ0FBZSxTQUFmLENBQWhCO0FBQ0EsTUFBSSxDQUFDLFNBQUwsRUFBZ0I7QUFDZCxVQUFNLElBQUksS0FBSixDQUFhLE1BQWIsMEJBQXdDLFNBQXhDLENBQU47QUFDRDs7QUFFRCxhQUFXLE9BQU8sTUFBUCxFQUFlLFFBQWYsQ0FBWDtBQUNBO0FBQ0EsTUFBTSxrQkFBa0IsVUFBVSxZQUFWLENBQXVCLGVBQXZCLE1BQTRDLE1BQXBFOztBQUVBLE1BQUksWUFBWSxDQUFDLGVBQWpCLEVBQWtDO0FBQ2hDLFlBQVEsb0JBQW9CLFNBQXBCLENBQVIsRUFBd0MsaUJBQVM7QUFDL0MsVUFBSSxVQUFVLE1BQWQsRUFBc0I7QUFDcEIsZUFBTyxLQUFQLEVBQWMsS0FBZDtBQUNEO0FBQ0YsS0FKRDtBQUtEO0FBQ0YsQ0FqQkQ7O0FBbUJBOzs7O0FBSUEsSUFBTSxhQUFhLFNBQWIsVUFBYTtBQUFBLFNBQVUsYUFBYSxNQUFiLEVBQXFCLElBQXJCLENBQVY7QUFBQSxDQUFuQjs7QUFFQTs7OztBQUlBLElBQU0sYUFBYSxTQUFiLFVBQWE7QUFBQSxTQUFVLGFBQWEsTUFBYixFQUFxQixLQUFyQixDQUFWO0FBQUEsQ0FBbkI7O0FBRUE7Ozs7OztBQU1BLElBQU0sc0JBQXNCLFNBQXRCLG1CQUFzQixZQUFhO0FBQ3ZDLFNBQU8sT0FBTyxVQUFVLGdCQUFWLENBQTJCLE1BQTNCLENBQVAsRUFBMkMsa0JBQVU7QUFDMUQsV0FBTyxPQUFPLE9BQVAsQ0FBZSxTQUFmLE1BQThCLFNBQXJDO0FBQ0QsR0FGTSxDQUFQO0FBR0QsQ0FKRDs7QUFNQSxJQUFNLFlBQVksNkJBQ2QsS0FEYyxzQkFFWixNQUZZLEVBRUYsVUFBVSxLQUFWLEVBQWlCO0FBQzNCLFFBQU0sY0FBTjtBQUNBLGVBQWEsSUFBYjs7QUFFQSxNQUFJLEtBQUssWUFBTCxDQUFrQixRQUFsQixNQUFnQyxNQUFwQyxFQUE0QztBQUMxQztBQUNBO0FBQ0E7QUFDQSxRQUFJLENBQUMsb0JBQW9CLElBQXBCLENBQUwsRUFBZ0MsS0FBSyxjQUFMO0FBQ2pDO0FBQ0YsQ0FaYSxJQWNmO0FBQ0QsUUFBTSxvQkFBUTtBQUNaLFlBQVEsS0FBSyxnQkFBTCxDQUFzQixNQUF0QixDQUFSLEVBQXVDLGtCQUFVO0FBQy9DLFVBQU0sV0FBVyxPQUFPLFlBQVAsQ0FBb0IsUUFBcEIsTUFBa0MsTUFBbkQ7QUFDQSxtQkFBYSxNQUFiLEVBQXFCLFFBQXJCO0FBQ0QsS0FIRDtBQUlELEdBTkE7QUFPRCxzQkFQQztBQVFELGdCQVJDO0FBU0QsUUFBTSxVQVRMO0FBVUQsUUFBTSxVQVZMO0FBV0QsVUFBUSxZQVhQO0FBWUQsY0FBWTtBQVpYLENBZGUsQ0FBbEI7O0FBNkJBOzs7Ozs7QUFNQSxJQUFNLFlBQVksU0FBWixTQUFZLENBQVUsSUFBVixFQUFnQjtBQUNoQyxPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsWUFBVSxFQUFWLENBQWEsS0FBSyxJQUFsQjtBQUNELENBSEQ7O0FBS0E7QUFDQSxJQUFNLFNBQVMsUUFBUSxlQUFSLENBQWY7QUFDQSxPQUFPLFNBQVAsRUFBa0IsU0FBbEI7O0FBRUEsVUFBVSxTQUFWLENBQW9CLElBQXBCLEdBQTJCLFVBQTNCO0FBQ0EsVUFBVSxTQUFWLENBQW9CLElBQXBCLEdBQTJCLFVBQTNCOztBQUVBLFVBQVUsU0FBVixDQUFvQixNQUFwQixHQUE2QixZQUFZO0FBQ3ZDLFlBQVUsR0FBVixDQUFjLEtBQUssSUFBbkI7QUFDRCxDQUZEOztBQUlBLE9BQU8sT0FBUCxHQUFpQixTQUFqQjs7O0FDdkhBOzs7Ozs7QUFDQSxJQUFNLFdBQVcsUUFBUSxtQkFBUixDQUFqQjtBQUNBLElBQU0sU0FBUyxRQUFRLGlCQUFSLENBQWY7QUFDQSxJQUFNLFVBQVUsUUFBUSxrQkFBUixDQUFoQjtBQUNBLElBQU0sVUFBVSxRQUFRLGVBQVIsQ0FBaEI7O0lBR00scUI7QUFDRixtQ0FBWSxFQUFaLEVBQWU7QUFBQTs7QUFDWCxhQUFLLGVBQUwsR0FBdUIsNkJBQXZCO0FBQ0EsYUFBSyxjQUFMLEdBQXNCLGdCQUF0Qjs7QUFFQSxhQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxhQUFLLFVBQUwsR0FBa0IsSUFBbEI7O0FBRUEsYUFBSyxJQUFMLENBQVUsRUFBVjtBQUNIOzs7OzZCQUVJLEUsRUFBRztBQUNKLGlCQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxnQkFBSSxPQUFPLElBQVg7QUFDQSxpQkFBSyxVQUFMLENBQWdCLGdCQUFoQixDQUFpQyxRQUFqQyxFQUEwQyxVQUFTLEtBQVQsRUFBZTtBQUNyRCxxQkFBSyxNQUFMLENBQVksS0FBSyxVQUFqQjtBQUNILGFBRkQ7QUFHQSxpQkFBSyxNQUFMLENBQVksS0FBSyxVQUFqQjtBQUNIOzs7K0JBRU0sUyxFQUFVO0FBQ2IsZ0JBQUksYUFBYSxVQUFVLFlBQVYsQ0FBdUIsS0FBSyxjQUE1QixDQUFqQjtBQUNBLGdCQUFHLGVBQWUsSUFBZixJQUF1QixlQUFlLFNBQXpDLEVBQW1EO0FBQy9DLG9CQUFJLFdBQVcsT0FBTyxVQUFQLEVBQW1CLE1BQW5CLENBQWY7QUFDQSxvQkFBRyxhQUFhLElBQWIsSUFBcUIsYUFBYSxTQUFsQyxJQUErQyxTQUFTLE1BQVQsR0FBa0IsQ0FBcEUsRUFBc0U7QUFDbEUsd0JBQUcsVUFBVSxPQUFiLEVBQXFCO0FBQ2pCLDZCQUFLLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFNBQVMsQ0FBVCxDQUFyQjtBQUNILHFCQUZELE1BRUs7QUFDRCw2QkFBSyxLQUFMLENBQVcsU0FBWCxFQUFzQixTQUFTLENBQVQsQ0FBdEI7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7OzZCQUVJLFMsRUFBVyxRLEVBQVM7QUFDckIsZ0JBQUcsY0FBYyxJQUFkLElBQXNCLGNBQWMsU0FBcEMsSUFBaUQsYUFBYSxJQUE5RCxJQUFzRSxhQUFhLFNBQXRGLEVBQWdHO0FBQzVGLDBCQUFVLFlBQVYsQ0FBdUIsZUFBdkIsRUFBd0MsTUFBeEM7QUFDQSx5QkFBUyxTQUFULENBQW1CLE1BQW5CLENBQTBCLFdBQTFCO0FBQ0EseUJBQVMsWUFBVCxDQUFzQixhQUF0QixFQUFxQyxPQUFyQztBQUNIO0FBQ0o7Ozs4QkFDSyxTLEVBQVcsUSxFQUFTO0FBQ3RCLGdCQUFHLGNBQWMsSUFBZCxJQUFzQixjQUFjLFNBQXBDLElBQWlELGFBQWEsSUFBOUQsSUFBc0UsYUFBYSxTQUF0RixFQUFnRztBQUM1RiwwQkFBVSxZQUFWLENBQXVCLGVBQXZCLEVBQXdDLE9BQXhDO0FBQ0EseUJBQVMsU0FBVCxDQUFtQixHQUFuQixDQUF1QixXQUF2QjtBQUNBLHlCQUFTLFlBQVQsQ0FBc0IsYUFBdEIsRUFBcUMsTUFBckM7QUFDSDtBQUNKOzs7Ozs7QUFHTCxPQUFPLE9BQVAsR0FBaUIscUJBQWpCOzs7QUN6REE7Ozs7QUFJQTs7OztBQUNBLElBQU0sV0FBVyxRQUFRLG1CQUFSLENBQWpCO0FBQ0EsSUFBTSxTQUFTLFFBQVEsaUJBQVIsQ0FBZjtBQUNBLElBQU0sVUFBVSxRQUFRLGtCQUFSLENBQWhCO0FBQ0EsSUFBTSxVQUFVLFFBQVEsZUFBUixDQUFoQjs7QUFFQSxJQUFNLG9CQUFvQixjQUExQjtBQUNBLElBQU0sbUJBQW1CLGdCQUF6Qjs7QUFFQSxJQUFNLGlCQUFpQixTQUFqQixjQUFpQixDQUFVLFNBQVYsRUFBcUIsVUFBckIsRUFBaUM7QUFDcEQsUUFBRyxjQUFjLElBQWQsSUFBc0IsY0FBYyxTQUF2QyxFQUFpRDtBQUM3QyxZQUFJLGFBQWEsVUFBVSxZQUFWLENBQXVCLGdCQUF2QixDQUFqQjtBQUNBLFlBQUcsZUFBZSxJQUFmLElBQXVCLGVBQWUsU0FBekMsRUFBbUQ7QUFDL0MsZ0JBQUksV0FBVyxPQUFPLFVBQVAsRUFBbUIsTUFBbkIsQ0FBZjtBQUNBLGdCQUFHLGFBQWEsSUFBYixJQUFxQixhQUFhLFNBQWxDLElBQStDLFNBQVMsTUFBVCxHQUFrQixDQUFwRSxFQUFzRTtBQUNsRTtBQUNBLDJCQUFXLFNBQVMsQ0FBVCxDQUFYO0FBQ0E7QUFDQSxvQkFBRyxVQUFVLFlBQVYsQ0FBdUIsZUFBdkIsS0FBMkMsTUFBM0MsSUFBcUQsVUFBVSxZQUFWLENBQXVCLGVBQXZCLEtBQTJDLFNBQWhHLElBQTZHLFVBQWhILEVBQTRIO0FBQ3hIO0FBQ0Esb0NBQWdCLFFBQWhCLEVBQTBCLFNBQTFCO0FBQ0gsaUJBSEQsTUFHSztBQUNEO0FBQ0Esa0NBQWMsUUFBZCxFQUF3QixTQUF4QjtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBQ0osQ0FuQkQ7O0FBcUJBLElBQU0sU0FBUyxTQUFULE1BQVMsQ0FBVSxLQUFWLEVBQWlCO0FBQzVCO0FBQ0EsUUFBSSxhQUFhLFFBQVEsTUFBTSxNQUFkLEVBQXNCLGlCQUF0QixDQUFqQjtBQUNBLFFBQUcsZUFBZSxJQUFmLElBQXVCLGVBQWUsU0FBekMsRUFBbUQ7QUFDL0MsdUJBQWUsVUFBZjtBQUNIO0FBQ0osQ0FORDs7QUFRQSxJQUFJLG9CQUFvQixLQUF4Qjs7QUFFQSxTQUFTLGVBQVQsQ0FBeUIsUUFBekIsRUFBbUMsU0FBbkMsRUFBOEM7QUFDMUMsUUFBRyxDQUFDLGlCQUFKLEVBQXNCO0FBQ2xCLDRCQUFvQixJQUFwQjs7QUFFQSxpQkFBUyxLQUFULENBQWUsTUFBZixHQUF3QixTQUFTLFlBQVQsR0FBdUIsSUFBL0M7QUFDQSxpQkFBUyxTQUFULENBQW1CLEdBQW5CLENBQXVCLDhCQUF2QjtBQUNBLG1CQUFXLFlBQVU7QUFDakIscUJBQVMsZUFBVCxDQUF5QixPQUF6QjtBQUNILFNBRkQsRUFFRyxDQUZIO0FBR0EsbUJBQVcsWUFBVTtBQUNqQixxQkFBUyxTQUFULENBQW1CLEdBQW5CLENBQXVCLFdBQXZCO0FBQ0EscUJBQVMsU0FBVCxDQUFtQixNQUFuQixDQUEwQiw4QkFBMUI7O0FBRUEsc0JBQVUsWUFBVixDQUF1QixlQUF2QixFQUF3QyxPQUF4QztBQUNBLHFCQUFTLFlBQVQsQ0FBc0IsYUFBdEIsRUFBcUMsTUFBckM7QUFDQSxnQ0FBb0IsS0FBcEI7QUFDSCxTQVBELEVBT0csR0FQSDtBQVFIO0FBQ0o7O0FBRUQsU0FBUyxhQUFULENBQXVCLFFBQXZCLEVBQWlDLFNBQWpDLEVBQTRDO0FBQ3hDLFFBQUcsQ0FBQyxpQkFBSixFQUFzQjtBQUNsQiw0QkFBb0IsSUFBcEI7QUFDQSxpQkFBUyxTQUFULENBQW1CLE1BQW5CLENBQTBCLFdBQTFCO0FBQ0EsWUFBSSxpQkFBaUIsU0FBUyxZQUE5QjtBQUNBLGlCQUFTLEtBQVQsQ0FBZSxNQUFmLEdBQXdCLEtBQXhCO0FBQ0EsaUJBQVMsU0FBVCxDQUFtQixHQUFuQixDQUF1Qiw0QkFBdkI7QUFDQSxtQkFBVyxZQUFVO0FBQ2pCLHFCQUFTLEtBQVQsQ0FBZSxNQUFmLEdBQXdCLGlCQUFnQixJQUF4QztBQUNILFNBRkQsRUFFRyxDQUZIOztBQUlBLG1CQUFXLFlBQVU7QUFDakIscUJBQVMsU0FBVCxDQUFtQixNQUFuQixDQUEwQiw0QkFBMUI7QUFDQSxxQkFBUyxlQUFULENBQXlCLE9BQXpCOztBQUVBLHFCQUFTLFlBQVQsQ0FBc0IsYUFBdEIsRUFBcUMsT0FBckM7QUFDQSxzQkFBVSxZQUFWLENBQXVCLGVBQXZCLEVBQXdDLE1BQXhDO0FBQ0EsZ0NBQW9CLEtBQXBCO0FBQ0gsU0FQRCxFQU9HLEdBUEg7QUFRSDtBQUNKOztBQUVELE9BQU8sT0FBUCxHQUFpQiw2QkFDZCxPQURjLHNCQUVYLGlCQUZXLEVBRVUsTUFGVixHQUFqQjs7O0FDdEZBOzs7Ozs7QUFDQSxJQUFNLFVBQVUsUUFBUSx5QkFBUixDQUFoQjtBQUNBLElBQU0sV0FBVyxRQUFRLG1CQUFSLENBQWpCO0FBQ0EsSUFBTSxTQUFTLFFBQVEsaUJBQVIsQ0FBZjtBQUNBLElBQU0sVUFBVSxRQUFRLGtCQUFSLENBQWhCOztBQUVBLElBQU0sdUJBQXVCLHlCQUE3QjtBQUNBLElBQU0sYUFBYSx3QkFBbkI7QUFDQSxJQUFNLGVBQWUsMEJBQXJCO0FBQ0EsSUFBTSxjQUFjLHlCQUFwQjs7SUFFTSxlO0FBQ0osMkJBQVksRUFBWixFQUFlO0FBQUE7O0FBRWIsU0FBSyxlQUFMLEdBQXVCLElBQXZCO0FBQ0EsU0FBSyxpQkFBTCxHQUF5QixPQUFPLG9CQUFQLEVBQTZCLEVBQTdCLENBQXpCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLFFBQVEsRUFBUixFQUFZLGFBQVosQ0FBakI7QUFDQSxTQUFLLGVBQUwsR0FBdUIsSUFBdkI7QUFDQSxTQUFLLGlCQUFMLEdBQXlCLElBQXpCO0FBQ0EsU0FBSyxnQkFBTCxHQUF3QixJQUF4Qjs7QUFFQSxTQUFLLGNBQUw7QUFDQSxTQUFLLGNBQUwsQ0FBb0IsS0FBSyxpQkFBTCxDQUF1QixDQUF2QixDQUFwQjtBQUNEOzs7O3FDQUVlO0FBQ2QsV0FBSyxlQUFMLEdBQXVCLE9BQU8sVUFBUCxFQUFtQixLQUFLLFNBQXhCLEVBQW1DLENBQW5DLENBQXZCO0FBQ0EsV0FBSyxpQkFBTCxHQUF5QixPQUFPLFlBQVAsRUFBcUIsS0FBSyxTQUExQixFQUFxQyxDQUFyQyxDQUF6QjtBQUNBLFdBQUssZ0JBQUwsR0FBd0IsT0FBTyxXQUFQLEVBQW9CLEtBQUssU0FBekIsRUFBb0MsQ0FBcEMsQ0FBeEI7O0FBRUEsVUFBSSxPQUFPLElBQVg7O0FBRUEsV0FBSyxlQUFMLENBQXFCLGdCQUFyQixDQUFzQyxNQUF0QyxFQUE4QyxZQUFVO0FBQ3RELGFBQUssWUFBTDtBQUNBLGFBQUssY0FBTDtBQUNELE9BSEQ7O0FBS0EsV0FBSyxpQkFBTCxDQUF1QixnQkFBdkIsQ0FBd0MsTUFBeEMsRUFBZ0QsWUFBVTtBQUN4RCxhQUFLLFlBQUw7QUFDQSxhQUFLLGNBQUw7QUFDRCxPQUhEOztBQUtBLFdBQUssZ0JBQUwsQ0FBc0IsZ0JBQXRCLENBQXVDLE1BQXZDLEVBQStDLFlBQVU7QUFDdkQsYUFBSyxZQUFMO0FBQ0EsYUFBSyxjQUFMO0FBQ0QsT0FIRDtBQUlEOzs7bUNBRWMsRSxFQUFHO0FBQ2hCLFVBQUcsRUFBSCxFQUFNO0FBQ0o7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxZQUFJLE9BQU8sSUFBWDs7QUFFQSxhQUFLLGVBQUwsR0FBdUIsSUFBSSxPQUFKLENBQVk7QUFDakMsaUJBQU8sRUFEMEI7QUFFakMsa0JBQVEsWUFGeUI7QUFHakMsb0JBQVUsQ0FIdUIsRUFHcEI7QUFDYixnQkFBTTtBQUNKLDJCQUFnQixlQURaO0FBRUosdUJBQWdCLGFBRlo7QUFHSixvQkFBZ0IsQ0FBQyxRQUFELEVBQVUsU0FBVixFQUFvQixPQUFwQixFQUE0QixPQUE1QixFQUFvQyxLQUFwQyxFQUEwQyxNQUExQyxFQUFpRCxNQUFqRCxFQUF3RCxRQUF4RCxFQUFpRSxXQUFqRSxFQUE2RSxTQUE3RSxFQUF1RixVQUF2RixFQUFrRyxVQUFsRyxDQUhaO0FBSUosc0JBQWdCLENBQUMsUUFBRCxFQUFVLFFBQVYsRUFBbUIsU0FBbkIsRUFBNkIsUUFBN0IsRUFBc0MsU0FBdEMsRUFBZ0QsUUFBaEQsRUFBeUQsUUFBekQsQ0FKWjtBQUtKLDJCQUFnQixDQUFDLEtBQUQsRUFBTyxLQUFQLEVBQWEsS0FBYixFQUFtQixLQUFuQixFQUF5QixLQUF6QixFQUErQixLQUEvQixFQUFxQyxLQUFyQztBQUxaLFdBSjJCO0FBV2pDLG9CQUFVLGtCQUFTLElBQVQsRUFBZTtBQUN2QjtBQUNBLGdCQUFHLEtBQUssUUFBUixFQUFpQjtBQUNmLG1CQUFLLGdCQUFMLENBQXNCLElBQXRCO0FBQ0EsbUJBQUssY0FBTDtBQUNEO0FBQ0YsV0FqQmdDO0FBa0JqQyxrQkFBUSxrQkFBVTtBQUNoQjtBQUNBLGdCQUFJLE1BQU0sU0FBUyxLQUFLLGVBQUwsQ0FBcUIsS0FBOUIsQ0FBVjtBQUNBLGdCQUFJLFFBQVEsU0FBUyxLQUFLLGlCQUFMLENBQXVCLEtBQWhDLElBQXdDLENBQXBEO0FBQ0EsZ0JBQUksT0FBTyxTQUFTLEtBQUssZ0JBQUwsQ0FBc0IsS0FBL0IsQ0FBWDtBQUNBLGdCQUFJLFVBQVUsSUFBSSxJQUFKLENBQVMsSUFBVCxFQUFlLEtBQWYsRUFBc0IsR0FBdEIsQ0FBZDtBQUNBLGdCQUFHLEtBQUssY0FBTCxFQUFILEVBQXlCO0FBQ3ZCLG1CQUFLLG9CQUFMLENBQTBCLE9BQTFCO0FBQ0Q7QUFDRjtBQTNCZ0MsU0FBWixDQUF2Qjs7QUE4QkEsWUFBSSxXQUFXLElBQUksSUFBSixFQUFmO0FBQ0EsYUFBSyxlQUFMLENBQXFCLE9BQXJCLENBQTZCLFFBQTdCO0FBQ0E7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDRDtBQUNGOzs7cUNBRWU7QUFDZCxVQUFJLE1BQU0sU0FBUyxLQUFLLGVBQUwsQ0FBcUIsS0FBOUIsQ0FBVjtBQUNBLFVBQUksUUFBUSxTQUFTLEtBQUssaUJBQUwsQ0FBdUIsS0FBaEMsQ0FBWjtBQUNBLFVBQUksT0FBTyxTQUFTLEtBQUssZ0JBQUwsQ0FBc0IsS0FBL0IsQ0FBWDtBQUNBLFVBQUksU0FBUyxJQUFJLElBQUosQ0FBUyxJQUFULEVBQWUsS0FBZixFQUFzQixDQUF0QixFQUF5QixPQUF6QixFQUFiOztBQUVBLFVBQUksTUFBTSxFQUFWO0FBQ0EsVUFBSSxVQUFVLElBQWQ7QUFDQSxVQUFHLE1BQU0sTUFBVCxFQUFnQjtBQUNkLGtCQUFVLEtBQVY7QUFDQSxjQUFNLDhDQUFOO0FBQ0EsYUFBSyxTQUFMLENBQWUsR0FBZjtBQUNELE9BSkQsTUFJTSxJQUFHLFFBQVEsRUFBWCxFQUFjO0FBQ2xCLGtCQUFVLEtBQVY7QUFDQSxjQUFNLDZCQUFOO0FBQ0EsYUFBSyxTQUFMLENBQWUsR0FBZjtBQUNEOztBQUVELFVBQUcsT0FBSCxFQUFXO0FBQ1QsYUFBSyxXQUFMO0FBQ0Q7O0FBRUQsYUFBTyxPQUFQO0FBQ0Q7Ozs4QkFFUyxHLEVBQUk7QUFDWixXQUFLLFNBQUwsQ0FBZSxTQUFmLENBQXlCLEdBQXpCLENBQTZCLGFBQTdCO0FBQ0EsYUFBTyxzQkFBUCxFQUFnQyxLQUFLLFNBQXJDLEVBQWdELENBQWhELEVBQW1ELFdBQW5ELEdBQWlFLEdBQWpFO0FBQ0Q7OztrQ0FDWTtBQUNYLFdBQUssU0FBTCxDQUFlLFNBQWYsQ0FBeUIsTUFBekIsQ0FBZ0MsYUFBaEM7QUFDQSxhQUFPLHNCQUFQLEVBQWdDLEtBQUssU0FBckMsRUFBZ0QsQ0FBaEQsRUFBbUQsV0FBbkQsR0FBaUUsRUFBakU7QUFDRDs7O3FDQUVnQixJLEVBQUs7QUFDcEIsVUFBSSxNQUFNLEtBQUssT0FBTCxFQUFWO0FBQ0EsVUFBSSxRQUFRLEtBQUssUUFBTCxLQUFrQixDQUE5QjtBQUNBLFVBQUksT0FBTyxLQUFLLFdBQUwsRUFBWDs7QUFFQSxXQUFLLGVBQUwsQ0FBcUIsS0FBckIsR0FBNkIsS0FBSyxTQUFMLENBQWUsR0FBZixDQUE3QjtBQUNBLFdBQUssaUJBQUwsQ0FBdUIsS0FBdkIsR0FBK0IsS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQS9CO0FBQ0EsV0FBSyxnQkFBTCxDQUFzQixLQUF0QixHQUE4QixJQUE5QjtBQUNEOztBQUVEOzs7OzhCQUNVLEcsRUFBSTtBQUNaLGFBQU8sQ0FBQyxNQUFNLEdBQVAsRUFBWSxLQUFaLENBQWtCLENBQUMsQ0FBbkIsQ0FBUDtBQUNEOzs7Z0NBQ1csSyxFQUFNO0FBQ2hCLGFBQU8sQ0FBQyxNQUFNLEtBQVAsRUFBYyxLQUFkLENBQW9CLENBQUMsQ0FBckIsQ0FBUDtBQUNEOzs7bUNBQ2E7QUFDWixVQUFJLE1BQU0sU0FBUyxLQUFLLGVBQUwsQ0FBcUIsS0FBOUIsQ0FBVjtBQUNBLFVBQUksUUFBUSxTQUFTLEtBQUssaUJBQUwsQ0FBdUIsS0FBaEMsQ0FBWjtBQUNBLFVBQUcsQ0FBQyxNQUFNLEdBQU4sQ0FBSixFQUFpQjtBQUNmLGFBQUssZUFBTCxDQUFxQixLQUFyQixHQUE2QixLQUFLLFNBQUwsQ0FBZSxHQUFmLENBQTdCO0FBQ0Q7QUFDRCxVQUFHLENBQUMsTUFBTSxLQUFOLENBQUosRUFBaUI7QUFDZixhQUFLLGlCQUFMLENBQXVCLEtBQXZCLEdBQStCLEtBQUssV0FBTCxDQUFpQixLQUFqQixDQUEvQjtBQUNEO0FBQ0Y7Ozt5Q0FFb0IsTyxFQUFRO0FBQzNCLFdBQUssZUFBTCxDQUFxQixPQUFyQixDQUE2QixPQUE3QjtBQUNEOzs7Ozs7QUFHSCxPQUFPLE9BQVAsR0FBaUIsZUFBakI7OztBQy9KQTs7Ozs7O0FBQ0EsSUFBTSxXQUFXLFFBQVEsbUJBQVIsQ0FBakI7QUFDQSxJQUFNLFNBQVMsUUFBUSxpQkFBUixDQUFmO0FBQ0EsSUFBTSxVQUFVLFFBQVEsa0JBQVIsQ0FBaEI7QUFDQSxJQUFNLFVBQVUsUUFBUSxlQUFSLENBQWhCOztJQUdNLFE7QUFDRixzQkFBWSxFQUFaLEVBQWU7QUFBQTs7QUFDWCxhQUFLLGlCQUFMLEdBQXlCLGNBQXpCO0FBQ0EsYUFBSyxnQkFBTCxHQUF3QixnQkFBeEI7O0FBRUE7QUFDQSxhQUFLLHVCQUFMLEdBQStCLEdBQS9CLENBTFcsQ0FLeUI7QUFDcEMsYUFBSyw0QkFBTCxHQUFvQyxtQ0FBcEM7QUFDQSxhQUFLLHlCQUFMLEdBQWlDLEtBQWpDOztBQUVBLGFBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNBLGFBQUssUUFBTCxHQUFnQixJQUFoQjs7QUFFQSxhQUFLLElBQUwsQ0FBVSxFQUFWOztBQUVBLFlBQUcsS0FBSyxTQUFMLEtBQW1CLElBQW5CLElBQTJCLEtBQUssU0FBTCxLQUFtQixTQUE5QyxJQUEyRCxLQUFLLFFBQUwsS0FBa0IsSUFBN0UsSUFBcUYsS0FBSyxRQUFMLEtBQWtCLFNBQTFHLEVBQW9IO0FBQ2hILGdCQUFJLE9BQU8sSUFBWDs7QUFFQTtBQUNBLG1CQUFPLE1BQVAsRUFBZSxDQUFmLEVBQWtCLGdCQUFsQixDQUFtQyxPQUFuQyxFQUE0QyxVQUFTLEtBQVQsRUFBZTtBQUN2RCxxQkFBSyxZQUFMLENBQWtCLEtBQWxCO0FBQ0gsYUFGRDs7QUFJQTtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxnQkFBZixDQUFnQyxPQUFoQyxFQUF5QyxVQUFTLEtBQVQsRUFBZTtBQUNwRCxzQkFBTSxjQUFOO0FBQ0Esc0JBQU0sZUFBTixHQUZvRCxDQUU1QjtBQUN4QixxQkFBSyxjQUFMO0FBQ0gsYUFKRDtBQUtIO0FBQ0o7Ozs7NkJBRUksRSxFQUFHO0FBQ0osaUJBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLGdCQUFHLEtBQUssU0FBTCxLQUFtQixJQUFuQixJQUEyQixLQUFLLFNBQUwsS0FBbUIsU0FBakQsRUFBMkQ7QUFDdkQsb0JBQUksYUFBYSxLQUFLLFNBQUwsQ0FBZSxZQUFmLENBQTRCLEtBQUssZ0JBQWpDLENBQWpCO0FBQ0Esb0JBQUcsZUFBZSxJQUFmLElBQXVCLGVBQWUsU0FBekMsRUFBbUQ7QUFDL0Msd0JBQUksV0FBVyxPQUFPLFVBQVAsRUFBbUIsTUFBbkIsQ0FBZjtBQUNBLHdCQUFHLGFBQWEsSUFBYixJQUFxQixhQUFhLFNBQWxDLElBQStDLFNBQVMsTUFBVCxHQUFrQixDQUFwRSxFQUFzRTtBQUNsRSw2QkFBSyxRQUFMLEdBQWdCLFNBQVMsQ0FBVCxDQUFoQjtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxnQkFBRyxLQUFLLFNBQUwsQ0FBZSxTQUFmLENBQXlCLFFBQXpCLENBQWtDLGtDQUFsQyxDQUFILEVBQXlFO0FBQ3JFLHFCQUFLLHlCQUFMLEdBQWlDLElBQWpDO0FBQ0g7QUFDSjs7O3VDQUdjLFUsRUFBWTtBQUN2QixnQkFBRyxLQUFLLFNBQUwsS0FBbUIsSUFBbkIsSUFBMkIsS0FBSyxTQUFMLEtBQW1CLFNBQTlDLElBQTJELEtBQUssUUFBTCxLQUFrQixJQUE3RSxJQUFxRixLQUFLLFFBQUwsS0FBa0IsU0FBMUcsRUFBb0g7QUFDaEg7QUFDQSxvQkFBRyxLQUFLLFNBQUwsQ0FBZSxZQUFmLENBQTRCLGVBQTVCLEtBQWdELE1BQWhELElBQTBELFVBQTdELEVBQXdFO0FBQ3BFO0FBQ0EseUJBQUssU0FBTCxDQUFlLFlBQWYsQ0FBNEIsZUFBNUIsRUFBNkMsT0FBN0M7QUFDQSx5QkFBSyxRQUFMLENBQWMsU0FBZCxDQUF3QixHQUF4QixDQUE0QixXQUE1QjtBQUNBLHlCQUFLLFFBQUwsQ0FBYyxZQUFkLENBQTJCLGFBQTNCLEVBQTBDLE1BQTFDO0FBQ0gsaUJBTEQsTUFLSztBQUNEO0FBQ0EseUJBQUssU0FBTCxDQUFlLFlBQWYsQ0FBNEIsZUFBNUIsRUFBNkMsTUFBN0M7QUFDQSx5QkFBSyxRQUFMLENBQWMsU0FBZCxDQUF3QixNQUF4QixDQUErQixXQUEvQjtBQUNBLHlCQUFLLFFBQUwsQ0FBYyxZQUFkLENBQTJCLGFBQTNCLEVBQTBDLE9BQTFDO0FBQ0g7QUFDSjtBQUNKOzs7cUNBRVksSyxFQUFNO0FBQ2YsZ0JBQUcsQ0FBQyxLQUFLLG9CQUFMLEVBQUosRUFBZ0M7QUFDNUI7QUFDQSxvQkFBSSxjQUFjLFFBQVEsTUFBTSxNQUFkLEVBQXNCLEtBQUssUUFBTCxDQUFjLEVBQXBDLENBQWxCO0FBQ0Esb0JBQUcsQ0FBQyxnQkFBZ0IsSUFBaEIsSUFBd0IsZ0JBQWdCLFNBQXpDLEtBQXdELE1BQU0sTUFBTixLQUFpQixLQUFLLFNBQWpGLEVBQTRGO0FBQ3hGO0FBQ0EseUJBQUssY0FBTCxDQUFvQixJQUFwQjtBQUNIO0FBQ0o7QUFDSjs7OytDQUVxQjtBQUNsQjtBQUNBLGdCQUFHLEtBQUsseUJBQUwsSUFBa0MsT0FBTyxVQUFQLElBQXFCLEtBQUssdUJBQS9ELEVBQXVGO0FBQ25GLHVCQUFPLElBQVA7QUFDSDtBQUNELG1CQUFPLEtBQVA7QUFDSDs7Ozs7O0FBR0wsT0FBTyxPQUFQLEdBQWlCLFFBQWpCOzs7OztBQzlGQSxPQUFPLE9BQVAsR0FBaUI7QUFDZixhQUFZLFFBQVEsYUFBUixDQURHO0FBRWYsY0FBWSxRQUFRLGNBQVIsQ0FGRztBQUdmLFdBQVksUUFBUSxXQUFSLENBSEc7QUFJZixhQUFZLFFBQVEsYUFBUixDQUpHO0FBS2YsYUFBWSxRQUFRLG9CQUFSLENBTEc7QUFNZixZQUFZLFFBQVEsWUFBUjtBQU5HLENBQWpCOzs7OztBQ0NBLElBQU0sV0FBVyxRQUFRLFVBQVIsQ0FBakI7O0FBRUE7Ozs7QUFJQSxJQUFNLGFBQWEsUUFBUSw0QkFBUixDQUFuQjtBQUNBLFNBQVMsWUFBTTtBQUNkLGFBQVcsSUFBWCxHQURjLENBQ0s7QUFDbkIsQ0FGRDs7O0FDUkE7Ozs7OztBQUNBLElBQU0sV0FBVyxRQUFRLG1CQUFSLENBQWpCO0FBQ0EsSUFBTSxVQUFVLFFBQVEsZUFBUixDQUFoQjtBQUNBLElBQU0sU0FBUyxRQUFRLGlCQUFSLENBQWY7QUFDQSxJQUFNLFlBQVksUUFBUSxhQUFSLENBQWxCOztBQUVBLElBQU0sUUFBUSxRQUFRLFdBQVIsRUFBcUIsS0FBbkM7QUFDQSxJQUFNLFNBQVMsUUFBUSxXQUFSLEVBQXFCLE1BQXBDOztBQUVBLElBQU0sWUFBTjtBQUNBLElBQU0sWUFBZSxHQUFmLE9BQU47QUFDQSxJQUFNLHlCQUFOO0FBQ0EsSUFBTSwrQkFBTjtBQUNBLElBQU0sb0JBQU47QUFDQSxJQUFNLFVBQWEsWUFBYixlQUFOO0FBQ0EsSUFBTSxVQUFVLENBQUUsR0FBRixFQUFPLE9BQVAsRUFBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBaEI7O0FBRUEsSUFBTSxlQUFlLG1CQUFyQjtBQUNBLElBQU0sZ0JBQWdCLFlBQXRCOztBQUVBLElBQU0sV0FBVyxTQUFYLFFBQVc7QUFBQSxTQUFNLFNBQVMsSUFBVCxDQUFjLFNBQWQsQ0FBd0IsUUFBeEIsQ0FBaUMsWUFBakMsQ0FBTjtBQUFBLENBQWpCOztBQUVBLElBQU0sYUFBYSxTQUFiLFVBQWEsQ0FBQyxhQUFELEVBQW1CO0FBQ3BDO0FBQ0EsTUFBTSwwQkFBMEIsZ0xBQWhDO0FBQ0EsTUFBTSxvQkFBb0IsY0FBYyxnQkFBZCxDQUErQix1QkFBL0IsQ0FBMUI7QUFDQSxNQUFNLGVBQWUsa0JBQW1CLENBQW5CLENBQXJCO0FBQ0EsTUFBTSxjQUFjLGtCQUFtQixrQkFBa0IsTUFBbEIsR0FBMkIsQ0FBOUMsQ0FBcEI7O0FBRUEsV0FBUyxVQUFULENBQXFCLENBQXJCLEVBQXdCO0FBQ3RCO0FBQ0EsUUFBSSxFQUFFLE9BQUYsS0FBYyxDQUFsQixFQUFxQjs7QUFFbkI7QUFDQSxVQUFJLEVBQUUsUUFBTixFQUFnQjtBQUNkLFlBQUksU0FBUyxhQUFULEtBQTJCLFlBQS9CLEVBQTZDO0FBQzNDLFlBQUUsY0FBRjtBQUNBLHNCQUFZLEtBQVo7QUFDRDs7QUFFSDtBQUNDLE9BUEQsTUFPTztBQUNMLFlBQUksU0FBUyxhQUFULEtBQTJCLFdBQS9CLEVBQTRDO0FBQzFDLFlBQUUsY0FBRjtBQUNBLHVCQUFhLEtBQWI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQ7QUFDQSxRQUFJLEVBQUUsT0FBRixLQUFjLEVBQWxCLEVBQXNCO0FBQ3BCLGdCQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLEtBQXJCO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLGVBQWEsS0FBYjs7QUFFQSxTQUFPO0FBQ0wsVUFESyxvQkFDSztBQUNSO0FBQ0Esb0JBQWMsZ0JBQWQsQ0FBK0IsU0FBL0IsRUFBMEMsVUFBMUM7QUFDRCxLQUpJO0FBTUwsV0FOSyxxQkFNTTtBQUNULG9CQUFjLG1CQUFkLENBQWtDLFNBQWxDLEVBQTZDLFVBQTdDO0FBQ0Q7QUFSSSxHQUFQO0FBVUQsQ0E5Q0Q7O0FBZ0RBLElBQUksa0JBQUo7O0FBRUEsSUFBTSxZQUFZLFNBQVosU0FBWSxDQUFVLE1BQVYsRUFBa0I7QUFDbEMsTUFBTSxPQUFPLFNBQVMsSUFBdEI7QUFDQSxNQUFJLE9BQU8sTUFBUCxLQUFrQixTQUF0QixFQUFpQztBQUMvQixhQUFTLENBQUMsVUFBVjtBQUNEO0FBQ0QsT0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixZQUF0QixFQUFvQyxNQUFwQzs7QUFFQSxVQUFRLE9BQU8sT0FBUCxDQUFSLEVBQXlCLGNBQU07QUFDN0IsT0FBRyxTQUFILENBQWEsTUFBYixDQUFvQixhQUFwQixFQUFtQyxNQUFuQztBQUNELEdBRkQ7O0FBSUEsTUFBSSxNQUFKLEVBQVk7QUFDVixjQUFVLE1BQVY7QUFDRCxHQUZELE1BRU87QUFDTCxjQUFVLE9BQVY7QUFDRDs7QUFFRCxNQUFNLGNBQWMsS0FBSyxhQUFMLENBQW1CLFlBQW5CLENBQXBCO0FBQ0EsTUFBTSxhQUFhLEtBQUssYUFBTCxDQUFtQixPQUFuQixDQUFuQjs7QUFFQSxNQUFJLFVBQVUsV0FBZCxFQUEyQjtBQUN6QjtBQUNBO0FBQ0EsZ0JBQVksS0FBWjtBQUNELEdBSkQsTUFJTyxJQUFJLENBQUMsTUFBRCxJQUFXLFNBQVMsYUFBVCxLQUEyQixXQUF0QyxJQUNBLFVBREosRUFDZ0I7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQVcsS0FBWDtBQUNEOztBQUVELFNBQU8sTUFBUDtBQUNELENBbkNEOztBQXFDQSxJQUFNLFNBQVMsU0FBVCxNQUFTLEdBQU07QUFDbkIsTUFBTSxTQUFTLFNBQVMsSUFBVCxDQUFjLGFBQWQsQ0FBNEIsWUFBNUIsQ0FBZjs7QUFFQSxNQUFJLGNBQWMsTUFBZCxJQUF3QixPQUFPLHFCQUFQLEdBQStCLEtBQS9CLEtBQXlDLENBQXJFLEVBQXdFO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBVSxJQUFWLENBQWUsTUFBZixFQUF1QixLQUF2QjtBQUNEO0FBQ0YsQ0FWRDs7QUFZQSxJQUFNLGFBQWEsNkJBQ2YsS0FEZSx3Q0FFYixPQUZhLEVBRUYsU0FGRSwyQkFHYixPQUhhLEVBR0YsU0FIRSwyQkFJYixTQUphLEVBSUEsWUFBWTtBQUN6QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0sTUFBTSxLQUFLLE9BQUwsQ0FBYSxVQUFVLFNBQXZCLENBQVo7QUFDQSxNQUFJLEdBQUosRUFBUztBQUNQLGNBQVUsVUFBVixDQUFxQixHQUFyQixFQUEwQixPQUExQixDQUFrQztBQUFBLGFBQU8sVUFBVSxJQUFWLENBQWUsR0FBZixDQUFQO0FBQUEsS0FBbEM7QUFDRDs7QUFFRDtBQUNBLE1BQUksVUFBSixFQUFnQjtBQUNkLGNBQVUsSUFBVixDQUFlLElBQWYsRUFBcUIsS0FBckI7QUFDRDtBQUNGLENBcEJjLGFBc0JoQjtBQUNELE1BREMsa0JBQ087QUFDTixRQUFNLGdCQUFnQixTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBdEI7O0FBRUEsUUFBSSxhQUFKLEVBQW1CO0FBQ2pCLGtCQUFZLFdBQVcsYUFBWCxDQUFaO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFPLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLE1BQWxDLEVBQTBDLEtBQTFDO0FBQ0QsR0FWQTtBQVdELFVBWEMsc0JBV1c7QUFDVixXQUFPLG1CQUFQLENBQTJCLFFBQTNCLEVBQXFDLE1BQXJDLEVBQTZDLEtBQTdDO0FBQ0Q7QUFiQSxDQXRCZ0IsQ0FBbkI7O0FBc0NBOzs7OztBQUtBLElBQU0sU0FBUyxRQUFRLGVBQVIsQ0FBZjtBQUNBLE9BQU8sT0FBUCxHQUFpQixPQUNmO0FBQUEsU0FBTSxXQUFXLEVBQVgsQ0FBYyxFQUFkLENBQU47QUFBQSxDQURlLEVBRWYsVUFGZSxDQUFqQjs7O0FDcktBOzs7Ozs7QUFDQSxJQUFNLFdBQVcsUUFBUSxtQkFBUixDQUFqQjtBQUNBLElBQU0sU0FBUyxRQUFRLGlCQUFSLENBQWY7QUFDQSxJQUFNLFVBQVUsUUFBUSxrQkFBUixDQUFoQjtBQUNBLElBQU0sVUFBVSxRQUFRLGVBQVIsQ0FBaEI7O0lBR00sZ0I7QUFDRiw4QkFBWSxFQUFaLEVBQWU7QUFBQTs7QUFDWCxhQUFLLGVBQUwsR0FBdUIsd0JBQXZCO0FBQ0EsYUFBSyxjQUFMLEdBQXNCLGdCQUF0Qjs7QUFFQSxhQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsSUFBaEI7O0FBRUEsYUFBSyxJQUFMLENBQVUsRUFBVjtBQUNIOzs7OzZCQUVJLEUsRUFBRztBQUFBOztBQUNKLGlCQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxpQkFBSyxRQUFMLEdBQWdCLE9BQU8scUJBQVAsRUFBOEIsS0FBSyxVQUFuQyxDQUFoQjtBQUNBLGdCQUFJLE9BQU8sSUFBWDs7QUFFQSxvQkFBUSxLQUFLLFFBQWIsRUFBdUIsaUJBQVM7QUFDNUIsc0JBQU0sZ0JBQU4sQ0FBdUIsUUFBdkIsRUFBZ0MsVUFBUyxLQUFULEVBQWU7QUFDM0MsNEJBQVEsS0FBSyxRQUFiLEVBQXVCLGlCQUFTO0FBQzVCLDZCQUFLLE1BQUwsQ0FBWSxLQUFaO0FBQ0gscUJBRkQ7QUFHSCxpQkFKRDs7QUFNQSxzQkFBSyxNQUFMLENBQVksS0FBWixFQVA0QixDQU9SO0FBQ3ZCLGFBUkQ7QUFVSDs7OytCQUVNLFMsRUFBVTtBQUNiLGdCQUFJLGFBQWEsVUFBVSxZQUFWLENBQXVCLEtBQUssY0FBNUIsQ0FBakI7QUFDQSxnQkFBRyxlQUFlLElBQWYsSUFBdUIsZUFBZSxTQUF6QyxFQUFtRDtBQUMvQyxvQkFBSSxXQUFXLE9BQU8sVUFBUCxFQUFtQixNQUFuQixDQUFmO0FBQ0Esb0JBQUcsYUFBYSxJQUFiLElBQXFCLGFBQWEsU0FBbEMsSUFBK0MsU0FBUyxNQUFULEdBQWtCLENBQXBFLEVBQXNFO0FBQ2xFLHdCQUFHLFVBQVUsT0FBYixFQUFxQjtBQUNqQiw2QkFBSyxJQUFMLENBQVUsU0FBVixFQUFxQixTQUFTLENBQVQsQ0FBckI7QUFDSCxxQkFGRCxNQUVLO0FBQ0QsNkJBQUssS0FBTCxDQUFXLFNBQVgsRUFBc0IsU0FBUyxDQUFULENBQXRCO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7Ozs2QkFFSSxTLEVBQVcsUSxFQUFTO0FBQ3JCLGdCQUFHLGNBQWMsSUFBZCxJQUFzQixjQUFjLFNBQXBDLElBQWlELGFBQWEsSUFBOUQsSUFBc0UsYUFBYSxTQUF0RixFQUFnRztBQUM1RiwwQkFBVSxZQUFWLENBQXVCLGVBQXZCLEVBQXdDLE1BQXhDO0FBQ0EseUJBQVMsU0FBVCxDQUFtQixNQUFuQixDQUEwQixXQUExQjtBQUNBLHlCQUFTLFlBQVQsQ0FBc0IsYUFBdEIsRUFBcUMsT0FBckM7QUFDSDtBQUNKOzs7OEJBQ0ssUyxFQUFXLFEsRUFBUztBQUN0QixnQkFBRyxjQUFjLElBQWQsSUFBc0IsY0FBYyxTQUFwQyxJQUFpRCxhQUFhLElBQTlELElBQXNFLGFBQWEsU0FBdEYsRUFBZ0c7QUFDNUYsMEJBQVUsWUFBVixDQUF1QixlQUF2QixFQUF3QyxPQUF4QztBQUNBLHlCQUFTLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsV0FBdkI7QUFDQSx5QkFBUyxZQUFULENBQXNCLGFBQXRCLEVBQXFDLE1BQXJDO0FBQ0g7QUFDSjs7Ozs7O0FBR0wsT0FBTyxPQUFQLEdBQWlCLGdCQUFqQjs7OztBQ2hFQTs7Ozs7O0FBTUE7O0FBQ0EsSUFBTSxXQUFXLFFBQVEsbUJBQVIsQ0FBakI7O0FBRUEsSUFBTSxnQkFBZ0I7QUFDcEIsV0FBTyxLQURhO0FBRXBCLFNBQUssS0FGZTtBQUdwQixVQUFNLEtBSGM7QUFJcEIsYUFBUztBQUpXLENBQXRCOztBQU9BLFNBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQjs7QUFFM0IsUUFBRyxjQUFjLElBQWQsSUFBc0IsY0FBYyxPQUF2QyxFQUFnRDtBQUM1QztBQUNIO0FBQ0QsUUFBSSxVQUFVLElBQWQ7QUFDQSxRQUFHLE9BQU8sTUFBTSxHQUFiLEtBQXFCLFdBQXhCLEVBQW9DO0FBQ2hDLFlBQUcsTUFBTSxHQUFOLENBQVUsTUFBVixLQUFxQixDQUF4QixFQUEwQjtBQUN0QixzQkFBVSxNQUFNLEdBQWhCO0FBQ0g7QUFDSixLQUpELE1BSU87QUFDSCxZQUFHLENBQUMsTUFBTSxRQUFWLEVBQW1CO0FBQ2Ysc0JBQVUsT0FBTyxZQUFQLENBQW9CLE1BQU0sT0FBMUIsQ0FBVjtBQUNILFNBRkQsTUFFTztBQUNILHNCQUFVLE9BQU8sWUFBUCxDQUFvQixNQUFNLFFBQTFCLENBQVY7QUFDSDtBQUNKO0FBQ0QsUUFBSSxVQUFVLElBQWQ7QUFDQSxRQUFHLE1BQU0sTUFBTixLQUFpQixTQUFwQixFQUE4QjtBQUMxQixrQkFBVSxNQUFNLE1BQWhCO0FBQ0g7QUFDRCxRQUFHLFlBQVksSUFBWixJQUFvQixZQUFZLElBQW5DLEVBQXlDO0FBQ3JDLFlBQUcsUUFBUSxNQUFSLEdBQWlCLENBQXBCLEVBQXNCO0FBQ2xCLGdCQUFHLFFBQVEsSUFBUixLQUFpQixRQUFwQixFQUE2QjtBQUN6QixvQkFBSSxXQUFXLEtBQUssS0FBcEIsQ0FEeUIsQ0FDQztBQUM3QixhQUZELE1BRUs7QUFDRCxvQkFBSSxXQUFXLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsQ0FBakIsRUFBb0IsUUFBUSxjQUE1QixJQUE4QyxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLFFBQVEsWUFBekIsQ0FBOUMsR0FBdUYsT0FBdEcsQ0FEQyxDQUM4RztBQUNsSDs7QUFFRCxnQkFBSSxXQUFXLEtBQUssWUFBTCxDQUFrQixrQkFBbEIsQ0FBZjtBQUNBLGdCQUFJLElBQUksSUFBSSxNQUFKLENBQVcsUUFBWCxDQUFSO0FBQ0EsZ0JBQUcsRUFBRSxJQUFGLENBQU8sUUFBUCxNQUFxQixJQUF4QixFQUE2QjtBQUN6QixvQkFBSSxNQUFNLGNBQVYsRUFBMEI7QUFDeEIsMEJBQU0sY0FBTjtBQUNELGlCQUZELE1BRU87QUFDTCwwQkFBTSxXQUFOLEdBQW9CLEtBQXBCO0FBQ0Q7QUFDSjtBQUNKO0FBQ0o7QUFDSjs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsU0FBUztBQUN4QixzQkFBa0I7QUFDaEIsbUNBQTJCO0FBRFg7QUFETSxDQUFULENBQWpCOzs7QUMzREE7Ozs7QUFDQSxJQUFNLFdBQVcsUUFBUSxtQkFBUixDQUFqQjtBQUNBLElBQU0sT0FBTyxRQUFRLGVBQVIsQ0FBYjs7QUFFQSxJQUFNLFFBQVEsUUFBUSxXQUFSLEVBQXFCLEtBQW5DO0FBQ0EsSUFBTSxTQUFTLFFBQVEsV0FBUixFQUFxQixNQUFwQztBQUNBLElBQU0sYUFBVyxNQUFYLHVCQUFOOztBQUVBLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBVSxLQUFWLEVBQWlCO0FBQ25DO0FBQ0E7QUFDQSxNQUFNLEtBQUssS0FBSyxZQUFMLENBQWtCLE1BQWxCLEVBQTBCLEtBQTFCLENBQWdDLENBQWhDLENBQVg7QUFDQSxNQUFNLFNBQVMsU0FBUyxjQUFULENBQXdCLEVBQXhCLENBQWY7QUFDQSxNQUFJLE1BQUosRUFBWTtBQUNWLFdBQU8sWUFBUCxDQUFvQixVQUFwQixFQUFnQyxDQUFoQztBQUNBLFdBQU8sZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsS0FBSyxpQkFBUztBQUM1QyxhQUFPLFlBQVAsQ0FBb0IsVUFBcEIsRUFBZ0MsQ0FBQyxDQUFqQztBQUNELEtBRitCLENBQWhDO0FBR0QsR0FMRCxNQUtPO0FBQ0w7QUFDRDtBQUNGLENBYkQ7O0FBZUEsT0FBTyxPQUFQLEdBQWlCLDZCQUNiLEtBRGEsc0JBRVgsSUFGVyxFQUVILFdBRkcsR0FBakI7Ozs7Ozs7Ozs7Ozs7QUN2QkEsSUFBTSxTQUFTLFFBQVEsaUJBQVIsQ0FBZjtBQUNBLElBQU0sV0FBVyxRQUFRLFVBQVIsQ0FBakI7QUFDQSxJQUFNLFVBQVUsUUFBUSxlQUFSLENBQWhCOztBQUVBLFNBQVMsWUFBTTtBQUNkLFFBQUksZ0JBQUo7QUFDQSxDQUZEOztJQUdxQixnQjtBQUNqQixnQ0FBYztBQUFBOztBQUFBOztBQUNWLFlBQU0sWUFBWSxPQUFPLHVCQUFQLENBQWxCO0FBQ0EsZ0JBQVEsU0FBUixFQUFtQixpQkFBUztBQUN4QixrQkFBSyx3QkFBTCxDQUE4QixLQUE5QjtBQUNILFNBRkQ7QUFHSDs7QUFFRDs7Ozs7aURBQ3lCLE8sRUFBUTtBQUM3QixnQkFBSSxDQUFDLE9BQUwsRUFBYzs7QUFFZCxnQkFBTSxnQkFBaUIsT0FBTyxvQkFBUCxFQUE2QixPQUE3QixDQUF2Qjs7QUFFQTs7QUFFQSxnQkFBSSxjQUFjLE1BQWxCLEVBQTBCO0FBQ3RCLG9CQUFNLGFBQWEsT0FBTyxVQUFQLEVBQW1CLE9BQW5CLENBQW5CO0FBQ0Esc0JBQU0sSUFBTixDQUFXLFVBQVgsRUFBdUIsT0FBdkIsQ0FBK0IsaUJBQVM7QUFDcEMsd0JBQUksVUFBVSxNQUFNLFFBQXBCO0FBQ0Esd0JBQUksUUFBUSxNQUFSLEtBQW1CLGNBQWMsTUFBckMsRUFBNkM7QUFDekMsOEJBQU0sSUFBTixDQUFXLGFBQVgsRUFBMEIsT0FBMUIsQ0FBa0MsVUFBQyxZQUFELEVBQWUsQ0FBZixFQUFxQjtBQUNuRDtBQUNBLG9DQUFRLENBQVIsRUFBVyxZQUFYLENBQXdCLFlBQXhCLEVBQXNDLGFBQWEsV0FBbkQ7QUFDSCx5QkFIRDtBQUlIO0FBQ0osaUJBUkQ7QUFTSDtBQUNKOzs7Ozs7a0JBNUJnQixnQjs7Ozs7QUNOckIsSUFBTSxXQUFXLFFBQVEsVUFBUixDQUFqQjtBQUNBLElBQU0sU0FBUyxRQUFRLGlCQUFSLENBQWY7QUFDQTtBQUNBLElBQU0sUUFBUSxRQUFRLCtCQUFSLENBQWQ7O0FBRUEsSUFBSSxZQUFZLFNBQVosU0FBWSxHQUFVO0FBQ3RCO0FBQ0EsVUFBTSxhQUFOLEVBQXFCO0FBQ2pCLGtCQUFVLENBRE87QUFFakIsZUFBTztBQUZVLEtBQXJCO0FBSUgsQ0FORDs7QUFRQSxTQUFTLFlBQU07QUFDWDtBQUNILENBRkQ7O0FBSUEsSUFBSSxPQUFPLE9BQU8sTUFBUCxFQUFlLENBQWYsQ0FBWDtBQUNBLEtBQUssZ0JBQUwsQ0FBc0IsZUFBdEIsRUFBdUMsVUFBVSxDQUFWLEVBQWE7QUFDaEQ7QUFDSCxDQUZELEVBRUcsS0FGSDs7O0FDbkJBOztBQUNBLElBQU0sV0FBVyxRQUFRLG1CQUFSLENBQWpCO0FBQ0EsSUFBTSxXQUFXLFFBQVEseUJBQVIsQ0FBakI7QUFDQSxJQUFNLFdBQVcsUUFBUSxpQkFBUixDQUFqQjs7QUFFQSxJQUFNLFNBQVMsU0FBVCxNQUFTLENBQVUsS0FBVixFQUFpQjtBQUM5QixTQUFPLFNBQVMsSUFBVCxDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsU0FBUztBQUN4QixrQkFBZ0I7QUFDZCxzQ0FBa0M7QUFEcEI7QUFEUSxDQUFULENBQWpCOztBQU1BOzs7OztBQUtBOzs7Ozs7Ozs7QUNwQkEsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsVUFBUTtBQURPLENBQWpCOzs7QUNBQTs7QUFDQSxJQUFNLFdBQVcsUUFBUSxVQUFSLENBQWpCO0FBQ0EsSUFBTSxVQUFVLFFBQVEsZUFBUixDQUFoQjtBQUNBLElBQU0sU0FBUyxRQUFRLGdCQUFSLENBQWY7QUFDQSxJQUFNLGFBQWEsUUFBUSx5QkFBUixDQUFuQjtBQUNBLElBQU0sUUFBUSxRQUFRLG9CQUFSLENBQWQ7QUFDQSxJQUFNLFFBQVEsUUFBUSxvQkFBUixDQUFkO0FBQ0EsSUFBTSxVQUFVLFFBQVEsc0JBQVIsQ0FBaEI7QUFDQSxJQUFNLFdBQVcsUUFBUSx1QkFBUixDQUFqQjtBQUNBLElBQU0scUJBQXFCLFFBQVEsbUNBQVIsQ0FBM0I7QUFDQSxJQUFNLHdCQUF3QixRQUFRLHNDQUFSLENBQTlCOztBQUdBOzs7O0FBSUEsUUFBUSxhQUFSOztBQUVBLElBQU0sUUFBUSxRQUFRLFVBQVIsQ0FBZDs7QUFFQSxJQUFNLGFBQWEsUUFBUSxjQUFSLENBQW5CO0FBQ0EsTUFBTSxVQUFOLEdBQW1CLFVBQW5COztBQUVBLFNBQVMsWUFBTTtBQUNiLE1BQU0sU0FBUyxTQUFTLElBQXhCO0FBQ0EsT0FBSyxJQUFJLElBQVQsSUFBaUIsVUFBakIsRUFBNkI7QUFDM0IsUUFBTSxXQUFXLFdBQVksSUFBWixDQUFqQjtBQUNBLGFBQVMsRUFBVCxDQUFZLE1BQVo7QUFDRDs7QUFFRDtBQUNBLE1BQU0sdUJBQXVCLG9CQUE3QjtBQUNBLFVBQVEsT0FBTyxvQkFBUCxDQUFSLEVBQXNDLGdDQUF3QjtBQUM1RCxRQUFJLFVBQUosQ0FBZSxvQkFBZjtBQUNELEdBRkQ7O0FBSUEsTUFBTSxxQkFBcUIsY0FBM0I7QUFDQSxVQUFRLE9BQU8sa0JBQVAsQ0FBUixFQUFvQywyQkFBbUI7QUFDckQsUUFBSSxRQUFKLENBQWEsZUFBYjtBQUNELEdBRkQ7O0FBSUEsTUFBTSxxQkFBcUIsd0JBQTNCO0FBQ0EsVUFBUSxPQUFPLGtCQUFQLENBQVIsRUFBb0MseUJBQWlCO0FBQ25ELFFBQUksa0JBQUosQ0FBdUIsYUFBdkI7QUFDRCxHQUZEOztBQUlBLE1BQU0sMEJBQTBCLDZCQUFoQztBQUNBLFVBQVEsT0FBTyx1QkFBUCxDQUFSLEVBQXlDLHlCQUFpQjtBQUN4RCxRQUFJLHFCQUFKLENBQTBCLGFBQTFCO0FBQ0QsR0FGRDtBQUlELENBNUJEOztBQThCQSxPQUFPLE9BQVAsR0FBaUIsS0FBakI7Ozs7O0FDdERBLE9BQU8sT0FBUCxHQUFpQjtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQU87QUFiUSxDQUFqQjs7O0FDQUE7O0FBQ0EsSUFBTSxVQUFVLE9BQU8sV0FBUCxDQUFtQixTQUFuQztBQUNBLElBQU0sU0FBUyxRQUFmOztBQUVBLElBQUksRUFBRSxVQUFVLE9BQVosQ0FBSixFQUEwQjtBQUN4QixTQUFPLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsTUFBL0IsRUFBdUM7QUFDckMsU0FBSyxlQUFZO0FBQ2YsYUFBTyxLQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FBUDtBQUNELEtBSG9DO0FBSXJDLFNBQUssYUFBVSxLQUFWLEVBQWlCO0FBQ3BCLFVBQUksS0FBSixFQUFXO0FBQ1QsYUFBSyxZQUFMLENBQWtCLE1BQWxCLEVBQTBCLEVBQTFCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBSyxlQUFMLENBQXFCLE1BQXJCO0FBQ0Q7QUFDRjtBQVZvQyxHQUF2QztBQVlEOzs7QUNqQkQ7QUFDQTs7QUFDQSxRQUFRLG9CQUFSO0FBQ0E7QUFDQSxRQUFRLGtCQUFSOztBQUVBLFFBQVEsMEJBQVI7QUFDQSxRQUFRLHVCQUFSOzs7QUNQQTs7QUFDQSxJQUFNLFNBQVMsUUFBUSxlQUFSLENBQWY7QUFDQSxJQUFNLFVBQVUsUUFBUSxlQUFSLENBQWhCO0FBQ0EsSUFBTSxXQUFXLFFBQVEsbUJBQVIsQ0FBakI7O0FBRUEsSUFBTSxXQUFXLFNBQVgsUUFBVyxHQUFZO0FBQzNCLE1BQU0sTUFBTSxHQUFHLEtBQUgsQ0FBUyxJQUFULENBQWMsU0FBZCxDQUFaO0FBQ0EsU0FBTyxVQUFVLE1BQVYsRUFBa0I7QUFBQTs7QUFDdkIsUUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNYLGVBQVMsU0FBUyxJQUFsQjtBQUNEO0FBQ0QsWUFBUSxHQUFSLEVBQWEsa0JBQVU7QUFDckIsVUFBSSxPQUFPLE1BQU0sTUFBTixDQUFQLEtBQTBCLFVBQTlCLEVBQTBDO0FBQ3hDLGNBQU0sTUFBTixFQUFlLElBQWYsUUFBMEIsTUFBMUI7QUFDRDtBQUNGLEtBSkQ7QUFLRCxHQVREO0FBVUQsQ0FaRDs7QUFjQTs7Ozs7O0FBTUEsT0FBTyxPQUFQLEdBQWlCLFVBQUMsTUFBRCxFQUFTLEtBQVQsRUFBbUI7QUFDbEMsU0FBTyxTQUFTLE1BQVQsRUFBaUIsT0FBTztBQUM3QixRQUFNLFNBQVMsTUFBVCxFQUFpQixLQUFqQixDQUR1QjtBQUU3QixTQUFNLFNBQVMsVUFBVCxFQUFxQixRQUFyQjtBQUZ1QixHQUFQLEVBR3JCLEtBSHFCLENBQWpCLENBQVA7QUFJRCxDQUxEOzs7QUN6QkE7O0FBRUE7Ozs7Ozs7O0FBT0EsT0FBTyxPQUFQLEdBQWlCLFNBQVMsT0FBVCxDQUFrQixFQUFsQixFQUFzQixRQUF0QixFQUFnQztBQUMvQyxRQUFJLGtCQUFrQixHQUFHLE9BQUgsSUFBYyxHQUFHLHFCQUFqQixJQUEwQyxHQUFHLGtCQUE3QyxJQUFtRSxHQUFHLGlCQUE1Rjs7QUFFQSxXQUFPLEVBQVAsRUFBVztBQUNQLFlBQUksZ0JBQWdCLElBQWhCLENBQXFCLEVBQXJCLEVBQXlCLFFBQXpCLENBQUosRUFBd0M7QUFDcEM7QUFDSDtBQUNELGFBQUssR0FBRyxhQUFSO0FBQ0g7QUFDRCxXQUFPLEVBQVA7QUFDRCxDQVZEOzs7OztBQ1RBO0FBQ0EsU0FBUyxtQkFBVCxDQUE4QixFQUE5QixFQUM4RDtBQUFBLE1BRDVCLEdBQzRCLHVFQUR4QixNQUN3QjtBQUFBLE1BQWhDLEtBQWdDLHVFQUExQixTQUFTLGVBQWlCOztBQUM1RCxNQUFJLE9BQU8sR0FBRyxxQkFBSCxFQUFYOztBQUVBLFNBQ0UsS0FBSyxHQUFMLElBQVksQ0FBWixJQUNBLEtBQUssSUFBTCxJQUFhLENBRGIsSUFFQSxLQUFLLE1BQUwsS0FBZ0IsSUFBSSxXQUFKLElBQW1CLE1BQU0sWUFBekMsQ0FGQSxJQUdBLEtBQUssS0FBTCxLQUFlLElBQUksVUFBSixJQUFrQixNQUFNLFdBQXZDLENBSkY7QUFNRDs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsbUJBQWpCOzs7QUNiQTs7QUFFQTs7Ozs7Ozs7O0FBTUEsSUFBTSxZQUFZLFNBQVosU0FBWSxRQUFTO0FBQ3pCLFNBQU8sU0FBUyxRQUFPLEtBQVAseUNBQU8sS0FBUCxPQUFpQixRQUExQixJQUFzQyxNQUFNLFFBQU4sS0FBbUIsQ0FBaEU7QUFDRCxDQUZEOztBQUlBOzs7Ozs7OztBQVFBLE9BQU8sT0FBUCxHQUFpQixTQUFTLE1BQVQsQ0FBaUIsUUFBakIsRUFBMkIsT0FBM0IsRUFBb0M7O0FBRW5ELE1BQUksT0FBTyxRQUFQLEtBQW9CLFFBQXhCLEVBQWtDO0FBQ2hDLFdBQU8sRUFBUDtBQUNEOztBQUVELE1BQUksQ0FBQyxPQUFELElBQVksQ0FBQyxVQUFVLE9BQVYsQ0FBakIsRUFBcUM7QUFDbkMsY0FBVSxPQUFPLFFBQWpCO0FBQ0Q7O0FBRUQsTUFBTSxZQUFZLFFBQVEsZ0JBQVIsQ0FBeUIsUUFBekIsQ0FBbEI7QUFDQSxTQUFPLE1BQU0sU0FBTixDQUFnQixLQUFoQixDQUFzQixJQUF0QixDQUEyQixTQUEzQixDQUFQO0FBQ0QsQ0FaRDs7O0FDcEJBOztBQUNBLElBQU0sV0FBVyxlQUFqQjtBQUNBLElBQU0sV0FBVyxlQUFqQjtBQUNBLElBQU0sU0FBUyxhQUFmOztBQUVBLE9BQU8sT0FBUCxHQUFpQixVQUFDLE1BQUQsRUFBUyxRQUFULEVBQXNCOztBQUVyQyxNQUFJLE9BQU8sUUFBUCxLQUFvQixTQUF4QixFQUFtQztBQUNqQyxlQUFXLE9BQU8sWUFBUCxDQUFvQixRQUFwQixNQUFrQyxPQUE3QztBQUNEO0FBQ0QsU0FBTyxZQUFQLENBQW9CLFFBQXBCLEVBQThCLFFBQTlCOztBQUVBLE1BQU0sS0FBSyxPQUFPLFlBQVAsQ0FBb0IsUUFBcEIsQ0FBWDtBQUNBLE1BQU0sV0FBVyxTQUFTLGNBQVQsQ0FBd0IsRUFBeEIsQ0FBakI7QUFDQSxNQUFJLENBQUMsUUFBTCxFQUFlO0FBQ2IsVUFBTSxJQUFJLEtBQUosQ0FDSixzQ0FBc0MsRUFBdEMsR0FBMkMsR0FEdkMsQ0FBTjtBQUdEOztBQUVELFdBQVMsWUFBVCxDQUFzQixNQUF0QixFQUE4QixDQUFDLFFBQS9CO0FBQ0EsU0FBTyxRQUFQO0FBQ0QsQ0FqQkQ7OztBQ0xBOztBQUNBLElBQU0sVUFBVSxRQUFRLGNBQVIsQ0FBaEI7O0FBRUEsSUFBTSxTQUFTLFFBQVEsV0FBUixFQUFxQixNQUFwQztBQUNBLElBQU0sVUFBVSxjQUFoQjtBQUNBLElBQU0sZ0JBQW1CLE1BQW5CLHNCQUFOOztBQUVBLE9BQU8sT0FBUCxHQUFpQixTQUFTLFFBQVQsQ0FBbUIsRUFBbkIsRUFBdUI7QUFDdEMsTUFBTSxPQUFPLFFBQVEsRUFBUixDQUFiO0FBQ0EsTUFBTSxLQUFLLEtBQUssaUJBQWhCO0FBQ0EsTUFBTSxZQUFZLEdBQUcsTUFBSCxDQUFVLENBQVYsTUFBaUIsR0FBakIsR0FDZCxTQUFTLGFBQVQsQ0FBdUIsRUFBdkIsQ0FEYyxHQUVkLFNBQVMsY0FBVCxDQUF3QixFQUF4QixDQUZKOztBQUlBLE1BQUksQ0FBQyxTQUFMLEVBQWdCO0FBQ2QsVUFBTSxJQUFJLEtBQUosNENBQ3FDLEVBRHJDLE9BQU47QUFHRDs7QUFFRCxPQUFLLElBQU0sR0FBWCxJQUFrQixJQUFsQixFQUF3QjtBQUN0QixRQUFJLElBQUksVUFBSixDQUFlLFVBQWYsQ0FBSixFQUFnQztBQUM5QixVQUFNLGdCQUFnQixJQUFJLE1BQUosQ0FBVyxXQUFXLE1BQXRCLEVBQThCLFdBQTlCLEVBQXRCO0FBQ0EsVUFBTSxtQkFBbUIsSUFBSSxNQUFKLENBQVcsS0FBTSxHQUFOLENBQVgsQ0FBekI7QUFDQSxVQUFNLDBDQUF3QyxhQUF4QyxPQUFOO0FBQ0EsVUFBTSxvQkFBb0IsVUFBVSxhQUFWLENBQXdCLGlCQUF4QixDQUExQjtBQUNBLFVBQUksQ0FBQyxpQkFBTCxFQUF3QjtBQUN0QixjQUFNLElBQUksS0FBSix3Q0FDaUMsYUFEakMsT0FBTjtBQUdEOztBQUVELFVBQU0sVUFBVSxpQkFBaUIsSUFBakIsQ0FBc0IsR0FBRyxLQUF6QixDQUFoQjtBQUNBLHdCQUFrQixTQUFsQixDQUE0QixNQUE1QixDQUFtQyxhQUFuQyxFQUFrRCxPQUFsRDtBQUNBLHdCQUFrQixZQUFsQixDQUErQixPQUEvQixFQUF3QyxPQUF4QztBQUNEO0FBQ0Y7QUFDRixDQTlCRDs7Ozs7OztBQ1BDLFdBQVUsTUFBVixFQUFrQixPQUFsQixFQUEyQjtBQUMzQixVQUFPLE9BQVAseUNBQU8sT0FBUCxPQUFtQixRQUFuQixJQUErQixPQUFPLE1BQVAsS0FBa0IsV0FBakQsR0FBK0QsT0FBTyxPQUFQLEdBQWlCLFNBQWhGLEdBQ0EsT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE9BQU8sR0FBdkMsR0FBNkMsT0FBTyxPQUFQLENBQTdDLEdBQ0MsT0FBTyxVQUFQLEdBQW9CLFNBRnJCO0FBR0EsQ0FKQSxhQUlRLFlBQVk7QUFBRTs7QUFFdkIsTUFBSSxVQUFVLE9BQWQ7O0FBRUEsTUFBSSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBVSxRQUFWLEVBQW9CLFdBQXBCLEVBQWlDO0FBQ3BELFFBQUksRUFBRSxvQkFBb0IsV0FBdEIsQ0FBSixFQUF3QztBQUN0QyxZQUFNLElBQUksU0FBSixDQUFjLG1DQUFkLENBQU47QUFDRDtBQUNGLEdBSkQ7O0FBTUEsTUFBSSxjQUFjLFlBQVk7QUFDNUIsYUFBUyxnQkFBVCxDQUEwQixNQUExQixFQUFrQyxLQUFsQyxFQUF5QztBQUN2QyxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQyxZQUFJLGFBQWEsTUFBTSxDQUFOLENBQWpCO0FBQ0EsbUJBQVcsVUFBWCxHQUF3QixXQUFXLFVBQVgsSUFBeUIsS0FBakQ7QUFDQSxtQkFBVyxZQUFYLEdBQTBCLElBQTFCO0FBQ0EsWUFBSSxXQUFXLFVBQWYsRUFBMkIsV0FBVyxRQUFYLEdBQXNCLElBQXRCO0FBQzNCLGVBQU8sY0FBUCxDQUFzQixNQUF0QixFQUE4QixXQUFXLEdBQXpDLEVBQThDLFVBQTlDO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPLFVBQVUsV0FBVixFQUF1QixVQUF2QixFQUFtQyxXQUFuQyxFQUFnRDtBQUNyRCxVQUFJLFVBQUosRUFBZ0IsaUJBQWlCLFlBQVksU0FBN0IsRUFBd0MsVUFBeEM7QUFDaEIsVUFBSSxXQUFKLEVBQWlCLGlCQUFpQixXQUFqQixFQUE4QixXQUE5QjtBQUNqQixhQUFPLFdBQVA7QUFDRCxLQUpEO0FBS0QsR0FoQmlCLEVBQWxCOztBQWtCQSxNQUFJLG9CQUFvQixTQUFwQixpQkFBb0IsQ0FBVSxHQUFWLEVBQWU7QUFDckMsUUFBSSxNQUFNLE9BQU4sQ0FBYyxHQUFkLENBQUosRUFBd0I7QUFDdEIsV0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLE9BQU8sTUFBTSxJQUFJLE1BQVYsQ0FBdkIsRUFBMEMsSUFBSSxJQUFJLE1BQWxELEVBQTBELEdBQTFEO0FBQStELGFBQUssQ0FBTCxJQUFVLElBQUksQ0FBSixDQUFWO0FBQS9ELE9BRUEsT0FBTyxJQUFQO0FBQ0QsS0FKRCxNQUlPO0FBQ0wsYUFBTyxNQUFNLElBQU4sQ0FBVyxHQUFYLENBQVA7QUFDRDtBQUNGLEdBUkQ7O0FBVUEsTUFBSSxhQUFhLFlBQVk7O0FBRTNCLFFBQUkscUJBQXFCLENBQUMsU0FBRCxFQUFZLFlBQVosRUFBMEIsK0RBQTFCLEVBQTJGLDJDQUEzRixFQUF3SSw2Q0FBeEksRUFBdUwsMkNBQXZMLEVBQW9PLFFBQXBPLEVBQThPLFFBQTlPLEVBQXdQLE9BQXhQLEVBQWlRLG1CQUFqUSxFQUFzUixpQ0FBdFIsQ0FBekI7O0FBRUEsUUFBSSxRQUFRLFlBQVk7QUFDdEIsZUFBUyxLQUFULENBQWUsSUFBZixFQUFxQjtBQUNuQixZQUFJLGNBQWMsS0FBSyxXQUF2QjtBQUFBLFlBQ0ksZ0JBQWdCLEtBQUssUUFEekI7QUFBQSxZQUVJLFdBQVcsa0JBQWtCLFNBQWxCLEdBQThCLEVBQTlCLEdBQW1DLGFBRmxEO0FBQUEsWUFHSSxjQUFjLEtBQUssTUFIdkI7QUFBQSxZQUlJLFNBQVMsZ0JBQWdCLFNBQWhCLEdBQTRCLFlBQVksQ0FBRSxDQUExQyxHQUE2QyxXQUoxRDtBQUFBLFlBS0ksZUFBZSxLQUFLLE9BTHhCO0FBQUEsWUFNSSxVQUFVLGlCQUFpQixTQUFqQixHQUE2QixZQUFZLENBQUUsQ0FBM0MsR0FBOEMsWUFONUQ7QUFBQSxZQU9JLG1CQUFtQixLQUFLLFdBUDVCO0FBQUEsWUFRSSxjQUFjLHFCQUFxQixTQUFyQixHQUFpQyx5QkFBakMsR0FBNkQsZ0JBUi9FO0FBQUEsWUFTSSxvQkFBb0IsS0FBSyxZQVQ3QjtBQUFBLFlBVUksZUFBZSxzQkFBc0IsU0FBdEIsR0FBa0MsdUJBQWxDLEdBQTRELGlCQVYvRTtBQUFBLFlBV0kscUJBQXFCLEtBQUssYUFYOUI7QUFBQSxZQVlJLGdCQUFnQix1QkFBdUIsU0FBdkIsR0FBbUMsS0FBbkMsR0FBMkMsa0JBWi9EO0FBQUEsWUFhSSxvQkFBb0IsS0FBSyxZQWI3QjtBQUFBLFlBY0ksZUFBZSxzQkFBc0IsU0FBdEIsR0FBa0MsS0FBbEMsR0FBMEMsaUJBZDdEO0FBQUEsWUFlSSx3QkFBd0IsS0FBSyxtQkFmakM7QUFBQSxZQWdCSSxzQkFBc0IsMEJBQTBCLFNBQTFCLEdBQXNDLEtBQXRDLEdBQThDLHFCQWhCeEU7QUFBQSxZQWlCSSxpQkFBaUIsS0FBSyxTQWpCMUI7QUFBQSxZQWtCSSxZQUFZLG1CQUFtQixTQUFuQixHQUErQixLQUEvQixHQUF1QyxjQWxCdkQ7QUFtQkEsdUJBQWUsSUFBZixFQUFxQixLQUFyQjs7QUFFQTtBQUNBLGFBQUssS0FBTCxHQUFhLFNBQVMsY0FBVCxDQUF3QixXQUF4QixDQUFiOztBQUVBO0FBQ0EsYUFBSyxNQUFMLEdBQWMsRUFBRSxXQUFXLFNBQWIsRUFBd0IsZUFBZSxhQUF2QyxFQUFzRCxhQUFhLFdBQW5FLEVBQWdGLGNBQWMsWUFBOUYsRUFBNEcsUUFBUSxNQUFwSCxFQUE0SCxTQUFTLE9BQXJJLEVBQThJLHFCQUFxQixtQkFBbkssRUFBd0wsY0FBYzs7QUFFbE47QUFGWSxTQUFkLENBR0UsSUFBSSxTQUFTLE1BQVQsR0FBa0IsQ0FBdEIsRUFBeUIsS0FBSyxnQkFBTCxDQUFzQixLQUF0QixDQUE0QixJQUE1QixFQUFrQyxrQkFBa0IsUUFBbEIsQ0FBbEM7O0FBRTNCO0FBQ0EsYUFBSyxPQUFMLEdBQWUsS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixJQUFsQixDQUFmO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBakI7QUFDRDs7QUFFRDs7Ozs7O0FBT0Esa0JBQVksS0FBWixFQUFtQixDQUFDO0FBQ2xCLGFBQUssa0JBRGE7QUFFbEIsZUFBTyxTQUFTLGdCQUFULEdBQTRCO0FBQ2pDLGNBQUksUUFBUSxJQUFaOztBQUVBLGVBQUssSUFBSSxPQUFPLFVBQVUsTUFBckIsRUFBNkIsV0FBVyxNQUFNLElBQU4sQ0FBeEMsRUFBcUQsT0FBTyxDQUFqRSxFQUFvRSxPQUFPLElBQTNFLEVBQWlGLE1BQWpGLEVBQXlGO0FBQ3ZGLHFCQUFTLElBQVQsSUFBaUIsVUFBVSxJQUFWLENBQWpCO0FBQ0Q7O0FBRUQsbUJBQVMsT0FBVCxDQUFpQixVQUFVLE9BQVYsRUFBbUI7QUFDbEMsb0JBQVEsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsWUFBWTtBQUM1QyxxQkFBTyxNQUFNLFNBQU4sRUFBUDtBQUNELGFBRkQ7QUFHRCxXQUpEO0FBS0Q7QUFkaUIsT0FBRCxFQWVoQjtBQUNELGFBQUssV0FESjtBQUVELGVBQU8sU0FBUyxTQUFULEdBQXFCO0FBQzFCLGVBQUssYUFBTCxHQUFxQixTQUFTLGFBQTlCO0FBQ0EsZUFBSyxLQUFMLENBQVcsWUFBWCxDQUF3QixhQUF4QixFQUF1QyxPQUF2QztBQUNBLGVBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsR0FBckIsQ0FBeUIsU0FBekI7QUFDQSxlQUFLLG1CQUFMO0FBQ0EsZUFBSyxlQUFMLENBQXFCLFNBQXJCO0FBQ0EsZUFBSyxpQkFBTDtBQUNBLGVBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsS0FBSyxLQUF4QjtBQUNEO0FBVkEsT0FmZ0IsRUEwQmhCO0FBQ0QsYUFBSyxZQURKO0FBRUQsZUFBTyxTQUFTLFVBQVQsR0FBc0I7QUFDM0IsY0FBSSxRQUFRLEtBQUssS0FBakI7QUFDQSxlQUFLLEtBQUwsQ0FBVyxZQUFYLENBQXdCLGFBQXhCLEVBQXVDLE1BQXZDO0FBQ0EsZUFBSyxvQkFBTDtBQUNBLGVBQUssZUFBTCxDQUFxQixRQUFyQjtBQUNBLGVBQUssYUFBTCxDQUFtQixLQUFuQjtBQUNBLGVBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsS0FBSyxLQUF6Qjs7QUFFQSxjQUFJLEtBQUssTUFBTCxDQUFZLG1CQUFoQixFQUFxQztBQUNuQyxpQkFBSyxLQUFMLENBQVcsZ0JBQVgsQ0FBNEIsY0FBNUIsRUFBNEMsU0FBUyxPQUFULEdBQW1CO0FBQzdELG9CQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsU0FBdkI7QUFDQSxvQkFBTSxtQkFBTixDQUEwQixjQUExQixFQUEwQyxPQUExQyxFQUFtRCxLQUFuRDtBQUNELGFBSEQsRUFHRyxLQUhIO0FBSUQsV0FMRCxNQUtPO0FBQ0wsa0JBQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixTQUF2QjtBQUNEO0FBQ0Y7QUFsQkEsT0ExQmdCLEVBNkNoQjtBQUNELGFBQUssaUJBREo7QUFFRCxlQUFPLFNBQVMsZUFBVCxDQUF5QixNQUF6QixFQUFpQztBQUN0QyxjQUFJLENBQUMsS0FBSyxNQUFMLENBQVksYUFBakIsRUFBZ0M7QUFDaEMsY0FBSSxPQUFPLFNBQVMsYUFBVCxDQUF1QixNQUF2QixDQUFYO0FBQ0Esa0JBQVEsTUFBUjtBQUNFLGlCQUFLLFFBQUw7QUFDRSxxQkFBTyxNQUFQLENBQWMsS0FBSyxLQUFuQixFQUEwQixFQUFFLFVBQVUsU0FBWixFQUF1QixRQUFRLFNBQS9CLEVBQTFCO0FBQ0E7QUFDRixpQkFBSyxTQUFMO0FBQ0UscUJBQU8sTUFBUCxDQUFjLEtBQUssS0FBbkIsRUFBMEIsRUFBRSxVQUFVLFFBQVosRUFBc0IsUUFBUSxPQUE5QixFQUExQjtBQUNBO0FBQ0Y7QUFQRjtBQVNEO0FBZEEsT0E3Q2dCLEVBNERoQjtBQUNELGFBQUssbUJBREo7QUFFRCxlQUFPLFNBQVMsaUJBQVQsR0FBNkI7QUFDbEMsZUFBSyxLQUFMLENBQVcsZ0JBQVgsQ0FBNEIsWUFBNUIsRUFBMEMsS0FBSyxPQUEvQztBQUNBLGVBQUssS0FBTCxDQUFXLGdCQUFYLENBQTRCLE9BQTVCLEVBQXFDLEtBQUssT0FBMUM7QUFDQSxtQkFBUyxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxLQUFLLFNBQTFDO0FBQ0Q7QUFOQSxPQTVEZ0IsRUFtRWhCO0FBQ0QsYUFBSyxzQkFESjtBQUVELGVBQU8sU0FBUyxvQkFBVCxHQUFnQztBQUNyQyxlQUFLLEtBQUwsQ0FBVyxtQkFBWCxDQUErQixZQUEvQixFQUE2QyxLQUFLLE9BQWxEO0FBQ0EsZUFBSyxLQUFMLENBQVcsbUJBQVgsQ0FBK0IsT0FBL0IsRUFBd0MsS0FBSyxPQUE3QztBQUNBLG1CQUFTLG1CQUFULENBQTZCLFNBQTdCLEVBQXdDLEtBQUssU0FBN0M7QUFDRDtBQU5BLE9BbkVnQixFQTBFaEI7QUFDRCxhQUFLLFNBREo7QUFFRCxlQUFPLFNBQVMsT0FBVCxDQUFpQixLQUFqQixFQUF3QjtBQUM3QixjQUFJLE1BQU0sTUFBTixDQUFhLFlBQWIsQ0FBMEIsS0FBSyxNQUFMLENBQVksWUFBdEMsQ0FBSixFQUF5RDtBQUN2RCxpQkFBSyxVQUFMO0FBQ0Esa0JBQU0sY0FBTjtBQUNEO0FBQ0Y7QUFQQSxPQTFFZ0IsRUFrRmhCO0FBQ0QsYUFBSyxXQURKO0FBRUQsZUFBTyxTQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEI7QUFDL0IsY0FBSSxNQUFNLE9BQU4sS0FBa0IsRUFBdEIsRUFBMEIsS0FBSyxVQUFMLENBQWdCLEtBQWhCO0FBQzFCLGNBQUksTUFBTSxPQUFOLEtBQWtCLENBQXRCLEVBQXlCLEtBQUssYUFBTCxDQUFtQixLQUFuQjtBQUMxQjtBQUxBLE9BbEZnQixFQXdGaEI7QUFDRCxhQUFLLG1CQURKO0FBRUQsZUFBTyxTQUFTLGlCQUFULEdBQTZCO0FBQ2xDLGNBQUksUUFBUSxLQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUE0QixrQkFBNUIsQ0FBWjtBQUNBLGlCQUFPLE9BQU8sSUFBUCxDQUFZLEtBQVosRUFBbUIsR0FBbkIsQ0FBdUIsVUFBVSxHQUFWLEVBQWU7QUFDM0MsbUJBQU8sTUFBTSxHQUFOLENBQVA7QUFDRCxXQUZNLENBQVA7QUFHRDtBQVBBLE9BeEZnQixFQWdHaEI7QUFDRCxhQUFLLHFCQURKO0FBRUQsZUFBTyxTQUFTLG1CQUFULEdBQStCO0FBQ3BDLGNBQUksS0FBSyxNQUFMLENBQVksWUFBaEIsRUFBOEI7QUFDOUIsY0FBSSxpQkFBaUIsS0FBSyxpQkFBTCxFQUFyQjtBQUNBLGNBQUksZUFBZSxNQUFuQixFQUEyQixlQUFlLENBQWYsRUFBa0IsS0FBbEI7QUFDNUI7QUFOQSxPQWhHZ0IsRUF1R2hCO0FBQ0QsYUFBSyxlQURKO0FBRUQsZUFBTyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsRUFBOEI7QUFDbkMsY0FBSSxpQkFBaUIsS0FBSyxpQkFBTCxFQUFyQjs7QUFFQTtBQUNBLGNBQUksQ0FBQyxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLFNBQVMsYUFBN0IsQ0FBTCxFQUFrRDtBQUNoRCwyQkFBZSxDQUFmLEVBQWtCLEtBQWxCO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsZ0JBQUksbUJBQW1CLGVBQWUsT0FBZixDQUF1QixTQUFTLGFBQWhDLENBQXZCOztBQUVBLGdCQUFJLE1BQU0sUUFBTixJQUFrQixxQkFBcUIsQ0FBM0MsRUFBOEM7QUFDNUMsNkJBQWUsZUFBZSxNQUFmLEdBQXdCLENBQXZDLEVBQTBDLEtBQTFDO0FBQ0Esb0JBQU0sY0FBTjtBQUNEOztBQUVELGdCQUFJLENBQUMsTUFBTSxRQUFQLElBQW1CLHFCQUFxQixlQUFlLE1BQWYsR0FBd0IsQ0FBcEUsRUFBdUU7QUFDckUsNkJBQWUsQ0FBZixFQUFrQixLQUFsQjtBQUNBLG9CQUFNLGNBQU47QUFDRDtBQUNGO0FBQ0Y7QUFyQkEsT0F2R2dCLENBQW5CO0FBOEhBLGFBQU8sS0FBUDtBQUNELEtBM0tXLEVBQVo7O0FBNktBOzs7Ozs7QUFNQTs7O0FBR0EsUUFBSSxjQUFjLElBQWxCOztBQUVBOzs7Ozs7O0FBT0EsUUFBSSxxQkFBcUIsU0FBUyxrQkFBVCxDQUE0QixRQUE1QixFQUFzQyxXQUF0QyxFQUFtRDtBQUMxRSxVQUFJLGFBQWEsRUFBakI7O0FBRUEsZUFBUyxPQUFULENBQWlCLFVBQVUsT0FBVixFQUFtQjtBQUNsQyxZQUFJLGNBQWMsUUFBUSxVQUFSLENBQW1CLFdBQW5CLEVBQWdDLEtBQWxEO0FBQ0EsWUFBSSxXQUFXLFdBQVgsTUFBNEIsU0FBaEMsRUFBMkMsV0FBVyxXQUFYLElBQTBCLEVBQTFCO0FBQzNDLG1CQUFXLFdBQVgsRUFBd0IsSUFBeEIsQ0FBNkIsT0FBN0I7QUFDRCxPQUpEOztBQU1BLGFBQU8sVUFBUDtBQUNELEtBVkQ7O0FBWUE7Ozs7OztBQU1BLFFBQUksd0JBQXdCLFNBQVMscUJBQVQsQ0FBK0IsRUFBL0IsRUFBbUM7QUFDN0QsVUFBSSxDQUFDLFNBQVMsY0FBVCxDQUF3QixFQUF4QixDQUFMLEVBQWtDO0FBQ2hDLGdCQUFRLElBQVIsQ0FBYSxpQkFBaUIsT0FBakIsR0FBMkIseUNBQTNCLEdBQXVFLEVBQXZFLEdBQTRFLElBQXpGLEVBQStGLDZEQUEvRixFQUE4SiwrREFBOUo7QUFDQSxnQkFBUSxJQUFSLENBQWEsWUFBYixFQUEyQiw2REFBM0IsRUFBMEYsNEJBQTRCLEVBQTVCLEdBQWlDLFVBQTNIO0FBQ0EsZUFBTyxLQUFQO0FBQ0Q7QUFDRixLQU5EOztBQVFBOzs7Ozs7QUFNQSxRQUFJLDBCQUEwQixTQUFTLHVCQUFULENBQWlDLFFBQWpDLEVBQTJDO0FBQ3ZFLFVBQUksU0FBUyxNQUFULElBQW1CLENBQXZCLEVBQTBCO0FBQ3hCLGdCQUFRLElBQVIsQ0FBYSxpQkFBaUIsT0FBakIsR0FBMkIsOERBQXhDLEVBQXdHLDZEQUF4RyxFQUF1SyxpQkFBdks7QUFDQSxnQkFBUSxJQUFSLENBQWEsWUFBYixFQUEyQiw2REFBM0IsRUFBMEYscURBQTFGO0FBQ0EsZUFBTyxLQUFQO0FBQ0Q7QUFDRixLQU5EOztBQVFBOzs7Ozs7O0FBT0EsUUFBSSxlQUFlLFNBQVMsWUFBVCxDQUFzQixRQUF0QixFQUFnQyxVQUFoQyxFQUE0QztBQUM3RCw4QkFBd0IsUUFBeEI7QUFDQSxVQUFJLENBQUMsVUFBTCxFQUFpQixPQUFPLElBQVA7QUFDakIsV0FBSyxJQUFJLEVBQVQsSUFBZSxVQUFmLEVBQTJCO0FBQ3pCLDhCQUFzQixFQUF0QjtBQUNELGNBQU8sSUFBUDtBQUNGLEtBTkQ7O0FBUUE7Ozs7O0FBS0EsUUFBSSxPQUFPLFNBQVMsSUFBVCxDQUFjLE1BQWQsRUFBc0I7QUFDL0I7QUFDQSxVQUFJLFVBQVUsT0FBTyxNQUFQLENBQWMsRUFBZCxFQUFrQixFQUFFLGFBQWEseUJBQWYsRUFBbEIsRUFBOEQsTUFBOUQsQ0FBZDs7QUFFQTtBQUNBLFVBQUksV0FBVyxHQUFHLE1BQUgsQ0FBVSxrQkFBa0IsU0FBUyxnQkFBVCxDQUEwQixNQUFNLFFBQVEsV0FBZCxHQUE0QixHQUF0RCxDQUFsQixDQUFWLENBQWY7O0FBRUE7QUFDQSxVQUFJLGFBQWEsbUJBQW1CLFFBQW5CLEVBQTZCLFFBQVEsV0FBckMsQ0FBakI7O0FBRUE7QUFDQSxVQUFJLFFBQVEsU0FBUixLQUFzQixJQUF0QixJQUE4QixhQUFhLFFBQWIsRUFBdUIsVUFBdkIsTUFBdUMsS0FBekUsRUFBZ0Y7O0FBRWhGO0FBQ0EsV0FBSyxJQUFJLEdBQVQsSUFBZ0IsVUFBaEIsRUFBNEI7QUFDMUIsWUFBSSxRQUFRLFdBQVcsR0FBWCxDQUFaO0FBQ0EsZ0JBQVEsV0FBUixHQUFzQixHQUF0QjtBQUNBLGdCQUFRLFFBQVIsR0FBbUIsR0FBRyxNQUFILENBQVUsa0JBQWtCLEtBQWxCLENBQVYsQ0FBbkI7QUFDQSxZQUFJLEtBQUosQ0FBVSxPQUFWLEVBSjBCLENBSU47QUFDckI7QUFDRixLQXBCRDs7QUFzQkE7Ozs7OztBQU1BLFFBQUksT0FBTyxTQUFTLElBQVQsQ0FBYyxXQUFkLEVBQTJCLE1BQTNCLEVBQW1DO0FBQzVDLFVBQUksVUFBVSxVQUFVLEVBQXhCO0FBQ0EsY0FBUSxXQUFSLEdBQXNCLFdBQXRCOztBQUVBO0FBQ0EsVUFBSSxRQUFRLFNBQVIsS0FBc0IsSUFBdEIsSUFBOEIsc0JBQXNCLFdBQXRCLE1BQXVDLEtBQXpFLEVBQWdGOztBQUVoRjtBQUNBLG9CQUFjLElBQUksS0FBSixDQUFVLE9BQVYsQ0FBZCxDQVI0QyxDQVFWO0FBQ2xDLGtCQUFZLFNBQVo7QUFDRCxLQVZEOztBQVlBOzs7O0FBSUEsUUFBSSxRQUFRLFNBQVMsS0FBVCxHQUFpQjtBQUMzQixrQkFBWSxVQUFaO0FBQ0QsS0FGRDs7QUFJQSxXQUFPLEVBQUUsTUFBTSxJQUFSLEVBQWMsTUFBTSxJQUFwQixFQUEwQixPQUFPLEtBQWpDLEVBQVA7QUFDRCxHQWhUZ0IsRUFBakI7O0FBa1RBLFNBQU8sVUFBUDtBQUVDLENBOVZBLENBQUQ7Ozs7Ozs7QUNBQTs7Ozs7O0FBTUMsV0FBVSxJQUFWLEVBQWdCLE9BQWhCLEVBQ0Q7QUFDSTs7QUFFQSxRQUFJLE1BQUo7QUFDQSxRQUFJLFFBQU8sT0FBUCx5Q0FBTyxPQUFQLE9BQW1CLFFBQXZCLEVBQWlDO0FBQzdCO0FBQ0E7QUFDQSxZQUFJO0FBQUUscUJBQVMsUUFBUSxRQUFSLENBQVQ7QUFBNkIsU0FBbkMsQ0FBb0MsT0FBTyxDQUFQLEVBQVUsQ0FBRTtBQUNoRCxlQUFPLE9BQVAsR0FBaUIsUUFBUSxNQUFSLENBQWpCO0FBQ0gsS0FMRCxNQUtPLElBQUksT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE9BQU8sR0FBM0MsRUFBZ0Q7QUFDbkQ7QUFDQSxlQUFPLFVBQVUsR0FBVixFQUNQO0FBQ0k7QUFDQSxnQkFBSSxLQUFLLFFBQVQ7QUFDQSxnQkFBSTtBQUFFLHlCQUFTLElBQUksRUFBSixDQUFUO0FBQW1CLGFBQXpCLENBQTBCLE9BQU8sQ0FBUCxFQUFVLENBQUU7QUFDdEMsbUJBQU8sUUFBUSxNQUFSLENBQVA7QUFDSCxTQU5EO0FBT0gsS0FUTSxNQVNBO0FBQ0gsYUFBSyxPQUFMLEdBQWUsUUFBUSxLQUFLLE1BQWIsQ0FBZjtBQUNIO0FBQ0osQ0F0QkEsYUFzQk8sVUFBVSxNQUFWLEVBQ1I7QUFDSTs7QUFFQTs7OztBQUdBLFFBQUksWUFBWSxPQUFPLE1BQVAsS0FBa0IsVUFBbEM7QUFBQSxRQUVBLG9CQUFvQixDQUFDLENBQUMsT0FBTyxnQkFGN0I7QUFBQSxRQUlBLFdBQVcsT0FBTyxRQUpsQjtBQUFBLFFBTUEsTUFBTSxPQUFPLFVBTmI7QUFBQSxRQVFBLFdBQVcsU0FBWCxRQUFXLENBQVMsRUFBVCxFQUFhLENBQWIsRUFBZ0IsUUFBaEIsRUFBMEIsT0FBMUIsRUFDWDtBQUNJLFlBQUksaUJBQUosRUFBdUI7QUFDbkIsZUFBRyxnQkFBSCxDQUFvQixDQUFwQixFQUF1QixRQUF2QixFQUFpQyxDQUFDLENBQUMsT0FBbkM7QUFDSCxTQUZELE1BRU87QUFDSCxlQUFHLFdBQUgsQ0FBZSxPQUFPLENBQXRCLEVBQXlCLFFBQXpCO0FBQ0g7QUFDSixLQWZEO0FBQUEsUUFpQkEsY0FBYyxTQUFkLFdBQWMsQ0FBUyxFQUFULEVBQWEsQ0FBYixFQUFnQixRQUFoQixFQUEwQixPQUExQixFQUNkO0FBQ0ksWUFBSSxpQkFBSixFQUF1QjtBQUNuQixlQUFHLG1CQUFILENBQXVCLENBQXZCLEVBQTBCLFFBQTFCLEVBQW9DLENBQUMsQ0FBQyxPQUF0QztBQUNILFNBRkQsTUFFTztBQUNILGVBQUcsV0FBSCxDQUFlLE9BQU8sQ0FBdEIsRUFBeUIsUUFBekI7QUFDSDtBQUNKLEtBeEJEO0FBQUEsUUEwQkEsT0FBTyxTQUFQLElBQU8sQ0FBUyxHQUFULEVBQ1A7QUFDSSxlQUFPLElBQUksSUFBSixHQUFXLElBQUksSUFBSixFQUFYLEdBQXdCLElBQUksT0FBSixDQUFZLFlBQVosRUFBeUIsRUFBekIsQ0FBL0I7QUFDSCxLQTdCRDtBQUFBLFFBK0JBLFdBQVcsU0FBWCxRQUFXLENBQVMsRUFBVCxFQUFhLEVBQWIsRUFDWDtBQUNJLGVBQU8sQ0FBQyxNQUFNLEdBQUcsU0FBVCxHQUFxQixHQUF0QixFQUEyQixPQUEzQixDQUFtQyxNQUFNLEVBQU4sR0FBVyxHQUE5QyxNQUF1RCxDQUFDLENBQS9EO0FBQ0gsS0FsQ0Q7QUFBQSxRQW9DQSxXQUFXLFNBQVgsUUFBVyxDQUFTLEVBQVQsRUFBYSxFQUFiLEVBQ1g7QUFDSSxZQUFJLENBQUMsU0FBUyxFQUFULEVBQWEsRUFBYixDQUFMLEVBQXVCO0FBQ25CLGVBQUcsU0FBSCxHQUFnQixHQUFHLFNBQUgsS0FBaUIsRUFBbEIsR0FBd0IsRUFBeEIsR0FBNkIsR0FBRyxTQUFILEdBQWUsR0FBZixHQUFxQixFQUFqRTtBQUNIO0FBQ0osS0F6Q0Q7QUFBQSxRQTJDQSxjQUFjLFNBQWQsV0FBYyxDQUFTLEVBQVQsRUFBYSxFQUFiLEVBQ2Q7QUFDSSxXQUFHLFNBQUgsR0FBZSxLQUFLLENBQUMsTUFBTSxHQUFHLFNBQVQsR0FBcUIsR0FBdEIsRUFBMkIsT0FBM0IsQ0FBbUMsTUFBTSxFQUFOLEdBQVcsR0FBOUMsRUFBbUQsR0FBbkQsQ0FBTCxDQUFmO0FBQ0gsS0E5Q0Q7QUFBQSxRQWdEQSxVQUFVLFNBQVYsT0FBVSxDQUFTLEdBQVQsRUFDVjtBQUNJLGVBQVEsUUFBRCxDQUFVLElBQVYsQ0FBZSxPQUFPLFNBQVAsQ0FBaUIsUUFBakIsQ0FBMEIsSUFBMUIsQ0FBK0IsR0FBL0IsQ0FBZjtBQUFQO0FBQ0gsS0FuREQ7QUFBQSxRQXFEQSxTQUFTLFNBQVQsTUFBUyxDQUFTLEdBQVQsRUFDVDtBQUNJLGVBQVEsT0FBRCxDQUFTLElBQVQsQ0FBYyxPQUFPLFNBQVAsQ0FBaUIsUUFBakIsQ0FBMEIsSUFBMUIsQ0FBK0IsR0FBL0IsQ0FBZCxLQUFzRCxDQUFDLE1BQU0sSUFBSSxPQUFKLEVBQU47QUFBOUQ7QUFDSCxLQXhERDtBQUFBLFFBMERBLFlBQVksU0FBWixTQUFZLENBQVMsSUFBVCxFQUNaO0FBQ0ksWUFBSSxNQUFNLEtBQUssTUFBTCxFQUFWO0FBQ0EsZUFBTyxRQUFRLENBQVIsSUFBYSxRQUFRLENBQTVCO0FBQ0gsS0E5REQ7QUFBQSxRQWdFQSxhQUFhLFNBQWIsVUFBYSxDQUFTLElBQVQsRUFDYjtBQUNJO0FBQ0EsZUFBTyxPQUFPLENBQVAsS0FBYSxDQUFiLElBQWtCLE9BQU8sR0FBUCxLQUFlLENBQWpDLElBQXNDLE9BQU8sR0FBUCxLQUFlLENBQTVEO0FBQ0gsS0FwRUQ7QUFBQSxRQXNFQSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBUyxJQUFULEVBQWUsS0FBZixFQUNqQjtBQUNJLGVBQU8sQ0FBQyxFQUFELEVBQUssV0FBVyxJQUFYLElBQW1CLEVBQW5CLEdBQXdCLEVBQTdCLEVBQWlDLEVBQWpDLEVBQXFDLEVBQXJDLEVBQXlDLEVBQXpDLEVBQTZDLEVBQTdDLEVBQWlELEVBQWpELEVBQXFELEVBQXJELEVBQXlELEVBQXpELEVBQTZELEVBQTdELEVBQWlFLEVBQWpFLEVBQXFFLEVBQXJFLEVBQXlFLEtBQXpFLENBQVA7QUFDSCxLQXpFRDtBQUFBLFFBMkVBLGtCQUFrQixTQUFsQixlQUFrQixDQUFTLElBQVQsRUFDbEI7QUFDSSxZQUFJLE9BQU8sSUFBUCxDQUFKLEVBQWtCLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBZ0IsQ0FBaEIsRUFBa0IsQ0FBbEIsRUFBb0IsQ0FBcEI7QUFDckIsS0E5RUQ7QUFBQSxRQWdGQSxlQUFlLFNBQWYsWUFBZSxDQUFTLENBQVQsRUFBVyxDQUFYLEVBQ2Y7QUFDSTtBQUNBLGVBQU8sRUFBRSxPQUFGLE9BQWdCLEVBQUUsT0FBRixFQUF2QjtBQUNILEtBcEZEO0FBQUEsUUFzRkEsU0FBUyxTQUFULE1BQVMsQ0FBUyxFQUFULEVBQWEsSUFBYixFQUFtQixTQUFuQixFQUNUO0FBQ0ksWUFBSSxJQUFKLEVBQVUsT0FBVjtBQUNBLGFBQUssSUFBTCxJQUFhLElBQWIsRUFBbUI7QUFDZixzQkFBVSxHQUFHLElBQUgsTUFBYSxTQUF2QjtBQUNBLGdCQUFJLFdBQVcsUUFBTyxLQUFLLElBQUwsQ0FBUCxNQUFzQixRQUFqQyxJQUE2QyxLQUFLLElBQUwsTUFBZSxJQUE1RCxJQUFvRSxLQUFLLElBQUwsRUFBVyxRQUFYLEtBQXdCLFNBQWhHLEVBQTJHO0FBQ3ZHLG9CQUFJLE9BQU8sS0FBSyxJQUFMLENBQVAsQ0FBSixFQUF3QjtBQUNwQix3QkFBSSxTQUFKLEVBQWU7QUFDWCwyQkFBRyxJQUFILElBQVcsSUFBSSxJQUFKLENBQVMsS0FBSyxJQUFMLEVBQVcsT0FBWCxFQUFULENBQVg7QUFDSDtBQUNKLGlCQUpELE1BS0ssSUFBSSxRQUFRLEtBQUssSUFBTCxDQUFSLENBQUosRUFBeUI7QUFDMUIsd0JBQUksU0FBSixFQUFlO0FBQ1gsMkJBQUcsSUFBSCxJQUFXLEtBQUssSUFBTCxFQUFXLEtBQVgsQ0FBaUIsQ0FBakIsQ0FBWDtBQUNIO0FBQ0osaUJBSkksTUFJRTtBQUNILHVCQUFHLElBQUgsSUFBVyxPQUFPLEVBQVAsRUFBVyxLQUFLLElBQUwsQ0FBWCxFQUF1QixTQUF2QixDQUFYO0FBQ0g7QUFDSixhQWJELE1BYU8sSUFBSSxhQUFhLENBQUMsT0FBbEIsRUFBMkI7QUFDOUIsbUJBQUcsSUFBSCxJQUFXLEtBQUssSUFBTCxDQUFYO0FBQ0g7QUFDSjtBQUNELGVBQU8sRUFBUDtBQUNILEtBN0dEO0FBQUEsUUErR0EsWUFBWSxTQUFaLFNBQVksQ0FBUyxFQUFULEVBQWEsU0FBYixFQUF3QixJQUF4QixFQUNaO0FBQ0ksWUFBSSxFQUFKOztBQUVBLFlBQUksU0FBUyxXQUFiLEVBQTBCO0FBQ3RCLGlCQUFLLFNBQVMsV0FBVCxDQUFxQixZQUFyQixDQUFMO0FBQ0EsZUFBRyxTQUFILENBQWEsU0FBYixFQUF3QixJQUF4QixFQUE4QixLQUE5QjtBQUNBLGlCQUFLLE9BQU8sRUFBUCxFQUFXLElBQVgsQ0FBTDtBQUNBLGVBQUcsYUFBSCxDQUFpQixFQUFqQjtBQUNILFNBTEQsTUFLTyxJQUFJLFNBQVMsaUJBQWIsRUFBZ0M7QUFDbkMsaUJBQUssU0FBUyxpQkFBVCxFQUFMO0FBQ0EsaUJBQUssT0FBTyxFQUFQLEVBQVcsSUFBWCxDQUFMO0FBQ0EsZUFBRyxTQUFILENBQWEsT0FBTyxTQUFwQixFQUErQixFQUEvQjtBQUNIO0FBQ0osS0E3SEQ7QUFBQSxRQStIQSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBUyxRQUFULEVBQW1CO0FBQ2hDLFlBQUksU0FBUyxLQUFULEdBQWlCLENBQXJCLEVBQXdCO0FBQ3BCLHFCQUFTLElBQVQsSUFBaUIsS0FBSyxJQUFMLENBQVUsS0FBSyxHQUFMLENBQVMsU0FBUyxLQUFsQixJQUF5QixFQUFuQyxDQUFqQjtBQUNBLHFCQUFTLEtBQVQsSUFBa0IsRUFBbEI7QUFDSDtBQUNELFlBQUksU0FBUyxLQUFULEdBQWlCLEVBQXJCLEVBQXlCO0FBQ3JCLHFCQUFTLElBQVQsSUFBaUIsS0FBSyxLQUFMLENBQVcsS0FBSyxHQUFMLENBQVMsU0FBUyxLQUFsQixJQUF5QixFQUFwQyxDQUFqQjtBQUNBLHFCQUFTLEtBQVQsSUFBa0IsRUFBbEI7QUFDSDtBQUNELGVBQU8sUUFBUDtBQUNILEtBeklEOzs7QUEySUE7OztBQUdBLGVBQVc7O0FBRVA7QUFDQSxlQUFPLElBSEE7O0FBS1A7QUFDQSxlQUFPLFNBTkE7O0FBUVA7QUFDQTtBQUNBLGtCQUFVLGFBVkg7O0FBWVA7QUFDQSxvQkFBWSxJQWJMOztBQWVQO0FBQ0EsZ0JBQVEsWUFoQkQ7O0FBa0JQO0FBQ0E7QUFDQSxrQkFBVSxJQXBCSDs7QUFzQlA7QUFDQSxlQUFPLElBdkJBOztBQXlCUDtBQUNBLHFCQUFhLElBMUJOOztBQTRCUDtBQUNBLHdCQUFnQixLQTdCVDs7QUErQlA7QUFDQSxrQkFBVSxDQWhDSDs7QUFrQ1A7QUFDQSxzQkFBYyxLQW5DUDs7QUFxQ1A7QUFDQSxpQkFBUyxJQXRDRjtBQXVDUDtBQUNBLGlCQUFTLElBeENGOztBQTBDUDtBQUNBLG1CQUFXLEVBM0NKOztBQTZDUDtBQUNBLHdCQUFnQixLQTlDVDs7QUFnRFA7QUFDQSx1QkFBZSxLQWpEUjs7QUFtRFA7QUFDQSxpQkFBUyxDQXBERjtBQXFEUCxpQkFBUyxJQXJERjtBQXNEUCxrQkFBVSxTQXRESDtBQXVEUCxrQkFBVSxTQXZESDs7QUF5RFAsb0JBQVksSUF6REw7QUEwRFAsa0JBQVUsSUExREg7O0FBNERQLGVBQU8sS0E1REE7O0FBOERQO0FBQ0Esb0JBQVksRUEvREw7O0FBaUVQO0FBQ0EsNEJBQW9CLEtBbEViOztBQW9FUDtBQUNBLHlDQUFpQyxLQXJFMUI7O0FBdUVQO0FBQ0Esb0RBQTRDLEtBeEVyQzs7QUEwRVA7QUFDQSx3QkFBZ0IsQ0EzRVQ7O0FBNkVQO0FBQ0E7QUFDQSxzQkFBYyxNQS9FUDs7QUFpRlA7QUFDQSxtQkFBVyxTQWxGSjs7QUFvRlA7QUFDQSwyQkFBb0IsSUFyRmI7O0FBdUZQO0FBQ0EsY0FBTTtBQUNGLDJCQUFnQixnQkFEZDtBQUVGLHVCQUFnQixZQUZkO0FBR0Ysb0JBQWdCLENBQUMsU0FBRCxFQUFXLFVBQVgsRUFBc0IsT0FBdEIsRUFBOEIsT0FBOUIsRUFBc0MsS0FBdEMsRUFBNEMsTUFBNUMsRUFBbUQsTUFBbkQsRUFBMEQsUUFBMUQsRUFBbUUsV0FBbkUsRUFBK0UsU0FBL0UsRUFBeUYsVUFBekYsRUFBb0csVUFBcEcsQ0FIZDtBQUlGLHNCQUFnQixDQUFDLFFBQUQsRUFBVSxRQUFWLEVBQW1CLFNBQW5CLEVBQTZCLFdBQTdCLEVBQXlDLFVBQXpDLEVBQW9ELFFBQXBELEVBQTZELFVBQTdELENBSmQ7QUFLRiwyQkFBZ0IsQ0FBQyxLQUFELEVBQU8sS0FBUCxFQUFhLEtBQWIsRUFBbUIsS0FBbkIsRUFBeUIsS0FBekIsRUFBK0IsS0FBL0IsRUFBcUMsS0FBckM7QUFMZCxTQXhGQzs7QUFnR1A7QUFDQSxlQUFPLElBakdBOztBQW1HUDtBQUNBLGdCQUFRLEVBcEdEOztBQXNHUDtBQUNBLGtCQUFVLElBdkdIO0FBd0dQLGdCQUFRLElBeEdEO0FBeUdQLGlCQUFTLElBekdGO0FBMEdQLGdCQUFRLElBMUdEOztBQTRHUDtBQUNBLHVCQUFlO0FBN0dSLEtBOUlYOzs7QUErUEE7OztBQUdBLG9CQUFnQixTQUFoQixhQUFnQixDQUFTLElBQVQsRUFBZSxHQUFmLEVBQW9CLElBQXBCLEVBQ2hCO0FBQ0ksZUFBTyxLQUFLLFFBQVo7QUFDQSxlQUFPLE9BQU8sQ0FBZCxFQUFpQjtBQUNiLG1CQUFPLENBQVA7QUFDSDtBQUNELGVBQU8sT0FBTyxLQUFLLElBQUwsQ0FBVSxhQUFWLENBQXdCLEdBQXhCLENBQVAsR0FBc0MsS0FBSyxJQUFMLENBQVUsUUFBVixDQUFtQixHQUFuQixDQUE3QztBQUNILEtBelFEO0FBQUEsUUEyUUEsWUFBWSxTQUFaLFNBQVksQ0FBUyxJQUFULEVBQ1o7QUFDSSxZQUFJLE1BQU0sRUFBVjtBQUNBLFlBQUksZUFBZSxPQUFuQjtBQUNBLFlBQUksS0FBSyxPQUFULEVBQWtCO0FBQ2QsZ0JBQUksS0FBSywrQkFBVCxFQUEwQztBQUN0QyxvQkFBSSxJQUFKLENBQVMsMEJBQVQ7O0FBRUEsb0JBQUcsQ0FBQyxLQUFLLDBDQUFULEVBQXFEO0FBQ2pELHdCQUFJLElBQUosQ0FBUyx1QkFBVDtBQUNIO0FBRUosYUFQRCxNQU9PO0FBQ0gsdUJBQU8sNEJBQVA7QUFDSDtBQUNKO0FBQ0QsWUFBSSxLQUFLLFVBQVQsRUFBcUI7QUFDakIsZ0JBQUksSUFBSixDQUFTLGFBQVQ7QUFDSDtBQUNELFlBQUksS0FBSyxPQUFULEVBQWtCO0FBQ2QsZ0JBQUksSUFBSixDQUFTLFVBQVQ7QUFDSDtBQUNELFlBQUksS0FBSyxVQUFULEVBQXFCO0FBQ2pCLGdCQUFJLElBQUosQ0FBUyxhQUFUO0FBQ0EsMkJBQWUsTUFBZjtBQUNIO0FBQ0QsWUFBSSxLQUFLLFFBQVQsRUFBbUI7QUFDZixnQkFBSSxJQUFKLENBQVMsV0FBVDtBQUNIO0FBQ0QsWUFBSSxLQUFLLFNBQVQsRUFBb0I7QUFDaEIsZ0JBQUksSUFBSixDQUFTLFlBQVQ7QUFDSDtBQUNELFlBQUksS0FBSyxZQUFULEVBQXVCO0FBQ25CLGdCQUFJLElBQUosQ0FBUyxlQUFUO0FBQ0g7QUFDRCxZQUFJLEtBQUssVUFBVCxFQUFxQjtBQUNqQixnQkFBSSxJQUFKLENBQVMsYUFBVDtBQUNIO0FBQ0QsZUFBTyxtQkFBbUIsS0FBSyxHQUF4QixHQUE4QixXQUE5QixHQUE0QyxJQUFJLElBQUosQ0FBUyxHQUFULENBQTVDLEdBQTRELG1CQUE1RCxHQUFrRixZQUFsRixHQUFpRyxJQUFqRyxHQUNFLHFEQURGLEdBRUssa0JBRkwsR0FFMEIsS0FBSyxJQUYvQixHQUVzQyxxQkFGdEMsR0FFOEQsS0FBSyxLQUZuRSxHQUUyRSxtQkFGM0UsR0FFaUcsS0FBSyxHQUZ0RyxHQUU0RyxJQUY1RyxHQUdTLEtBQUssR0FIZCxHQUlFLFdBSkYsR0FLQSxPQUxQO0FBTUgsS0F2VEQ7QUFBQSxRQXlUQSxhQUFhLFNBQWIsVUFBYSxDQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CO0FBQzVCO0FBQ0EsWUFBSSxTQUFTLElBQUksSUFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFiO0FBQUEsWUFDSSxVQUFVLEtBQUssSUFBTCxDQUFVLENBQUUsQ0FBQyxJQUFJLElBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsSUFBb0IsTUFBckIsSUFBK0IsUUFBaEMsR0FBNEMsT0FBTyxNQUFQLEVBQTVDLEdBQTRELENBQTdELElBQWdFLENBQTFFLENBRGQ7QUFFQSxlQUFPLDJCQUEyQixPQUEzQixHQUFxQyxPQUE1QztBQUNILEtBOVREO0FBQUEsUUFnVUEsWUFBWSxTQUFaLFNBQVksQ0FBUyxJQUFULEVBQWUsS0FBZixFQUFzQixhQUF0QixFQUFxQyxhQUFyQyxFQUNaO0FBQ0ksZUFBTyx5QkFBeUIsZ0JBQWdCLGtCQUFoQixHQUFxQyxFQUE5RCxLQUFxRSxnQkFBZ0IsY0FBaEIsR0FBaUMsRUFBdEcsSUFBNEcsSUFBNUcsR0FBbUgsQ0FBQyxRQUFRLEtBQUssT0FBTCxFQUFSLEdBQXlCLElBQTFCLEVBQWdDLElBQWhDLENBQXFDLEVBQXJDLENBQW5ILEdBQThKLE9BQXJLO0FBQ0gsS0FuVUQ7QUFBQSxRQXFVQSxhQUFhLFNBQWIsVUFBYSxDQUFTLElBQVQsRUFDYjtBQUNJLGVBQU8sWUFBWSxLQUFLLElBQUwsQ0FBVSxFQUFWLENBQVosR0FBNEIsVUFBbkM7QUFDSCxLQXhVRDtBQUFBLFFBMFVBLGFBQWEsU0FBYixVQUFhLENBQVMsSUFBVCxFQUNiO0FBQ0ksWUFBSSxDQUFKO0FBQUEsWUFBTyxNQUFNLEVBQWI7QUFDQSxZQUFJLEtBQUssY0FBVCxFQUF5QjtBQUNyQixnQkFBSSxJQUFKLENBQVMsV0FBVDtBQUNIO0FBQ0QsYUFBSyxJQUFJLENBQVQsRUFBWSxJQUFJLENBQWhCLEVBQW1CLEdBQW5CLEVBQXdCO0FBQ3BCLGdCQUFJLElBQUosQ0FBUyxrQ0FBa0MsY0FBYyxJQUFkLEVBQW9CLENBQXBCLENBQWxDLEdBQTJELElBQTNELEdBQWtFLGNBQWMsSUFBZCxFQUFvQixDQUFwQixFQUF1QixJQUF2QixDQUFsRSxHQUFpRyxjQUExRztBQUNIO0FBQ0QsZUFBTyxnQkFBZ0IsQ0FBQyxLQUFLLEtBQUwsR0FBYSxJQUFJLE9BQUosRUFBYixHQUE2QixHQUE5QixFQUFtQyxJQUFuQyxDQUF3QyxFQUF4QyxDQUFoQixHQUE4RCxlQUFyRTtBQUNILEtBcFZEO0FBQUEsUUFzVkEsY0FBYyxTQUFkLFdBQWMsQ0FBUyxRQUFULEVBQW1CLENBQW5CLEVBQXNCLElBQXRCLEVBQTRCLEtBQTVCLEVBQW1DLE9BQW5DLEVBQTRDLE1BQTVDLEVBQ2Q7QUFDSSxZQUFJLENBQUo7QUFBQSxZQUFPLENBQVA7QUFBQSxZQUFVLEdBQVY7QUFBQSxZQUNJLE9BQU8sU0FBUyxFQURwQjtBQUFBLFlBRUksWUFBWSxTQUFTLEtBQUssT0FGOUI7QUFBQSxZQUdJLFlBQVksU0FBUyxLQUFLLE9BSDlCO0FBQUEsWUFJSSxPQUFPLGNBQWMsTUFBZCxHQUF1Qiw0REFKbEM7QUFBQSxZQUtJLFNBTEo7QUFBQSxZQU1JLFFBTko7QUFBQSxZQU9JLE9BQU8sSUFQWDtBQUFBLFlBUUksT0FBTyxJQVJYOztBQVVBLGFBQUssTUFBTSxFQUFOLEVBQVUsSUFBSSxDQUFuQixFQUFzQixJQUFJLEVBQTFCLEVBQThCLEdBQTlCLEVBQW1DO0FBQy9CLGdCQUFJLElBQUosQ0FBUyxxQkFBcUIsU0FBUyxPQUFULEdBQW1CLElBQUksQ0FBdkIsR0FBMkIsS0FBSyxDQUFMLEdBQVMsQ0FBekQsSUFBOEQsR0FBOUQsSUFDSixNQUFNLEtBQU4sR0FBYyxzQkFBZCxHQUFzQyxFQURsQyxLQUVILGFBQWEsSUFBSSxLQUFLLFFBQXZCLElBQXFDLGFBQWEsSUFBSSxLQUFLLFFBQTNELEdBQXVFLHFCQUF2RSxHQUErRixFQUYzRixJQUVpRyxHQUZqRyxHQUdMLEtBQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUIsQ0FBakIsQ0FISyxHQUdpQixXQUgxQjtBQUlIOztBQUVELG9CQUFZLDZCQUE2QixLQUFLLElBQUwsQ0FBVSxNQUFWLENBQWlCLEtBQWpCLENBQTdCLEdBQXVELDhEQUF2RCxHQUF3SCxJQUFJLElBQUosQ0FBUyxFQUFULENBQXhILEdBQXVJLGlCQUFuSjs7QUFFQSxZQUFJLFFBQVEsS0FBSyxTQUFiLENBQUosRUFBNkI7QUFDekIsZ0JBQUksS0FBSyxTQUFMLENBQWUsQ0FBZixDQUFKO0FBQ0EsZ0JBQUksS0FBSyxTQUFMLENBQWUsQ0FBZixJQUFvQixDQUF4QjtBQUNILFNBSEQsTUFHTztBQUNILGdCQUFJLE9BQU8sS0FBSyxTQUFoQjtBQUNBLGdCQUFJLElBQUksSUFBSixHQUFXLEtBQUssU0FBcEI7QUFDSDs7QUFFRCxhQUFLLE1BQU0sRUFBWCxFQUFlLElBQUksQ0FBSixJQUFTLEtBQUssS0FBSyxPQUFsQyxFQUEyQyxHQUEzQyxFQUFnRDtBQUM1QyxnQkFBSSxLQUFLLEtBQUssT0FBZCxFQUF1QjtBQUNuQixvQkFBSSxJQUFKLENBQVMsb0JBQW9CLENBQXBCLEdBQXdCLEdBQXhCLElBQStCLE1BQU0sSUFBTixHQUFhLHNCQUFiLEdBQXFDLEVBQXBFLElBQTBFLEdBQTFFLEdBQWlGLENBQWpGLEdBQXNGLFdBQS9GO0FBQ0g7QUFDSjtBQUNELG1CQUFXLDZCQUE2QixJQUE3QixHQUFvQyxLQUFLLFVBQXpDLEdBQXNELDZEQUF0RCxHQUFzSCxJQUFJLElBQUosQ0FBUyxFQUFULENBQXRILEdBQXFJLGlCQUFoSjs7QUFFQSxZQUFJLEtBQUssa0JBQVQsRUFBNkI7QUFDekIsb0JBQVEsV0FBVyxTQUFuQjtBQUNILFNBRkQsTUFFTztBQUNILG9CQUFRLFlBQVksUUFBcEI7QUFDSDs7QUFFRCxZQUFJLGNBQWMsVUFBVSxDQUFWLElBQWUsS0FBSyxRQUFMLElBQWlCLEtBQTlDLENBQUosRUFBMEQ7QUFDdEQsbUJBQU8sS0FBUDtBQUNIOztBQUVELFlBQUksY0FBYyxVQUFVLEVBQVYsSUFBZ0IsS0FBSyxRQUFMLElBQWlCLEtBQS9DLENBQUosRUFBMkQ7QUFDdkQsbUJBQU8sS0FBUDtBQUNIOztBQUVELFlBQUksTUFBTSxDQUFWLEVBQWE7QUFDVCxvQkFBUSw4QkFBOEIsT0FBTyxFQUFQLEdBQVksY0FBMUMsSUFBNEQsa0JBQTVELEdBQWlGLEtBQUssSUFBTCxDQUFVLGFBQTNGLEdBQTJHLFdBQW5IO0FBQ0g7QUFDRCxZQUFJLE1BQU8sU0FBUyxFQUFULENBQVksY0FBWixHQUE2QixDQUF4QyxFQUE2QztBQUN6QyxvQkFBUSw4QkFBOEIsT0FBTyxFQUFQLEdBQVksY0FBMUMsSUFBNEQsa0JBQTVELEdBQWlGLEtBQUssSUFBTCxDQUFVLFNBQTNGLEdBQXVHLFdBQS9HO0FBQ0g7O0FBRUQsZUFBTyxRQUFRLFFBQWY7QUFDSCxLQWhaRDtBQUFBLFFBa1pBLGNBQWMsU0FBZCxXQUFjLENBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUIsTUFBckIsRUFDZDtBQUNJLGVBQU8sNEZBQTRGLE1BQTVGLEdBQXFHLElBQXJHLEdBQTRHLFdBQVcsSUFBWCxDQUE1RyxHQUErSCxXQUFXLElBQVgsQ0FBL0gsR0FBa0osVUFBeko7QUFDSCxLQXJaRDs7O0FBd1pBOzs7QUFHQSxjQUFVLFNBQVYsT0FBVSxDQUFTLE9BQVQsRUFDVjtBQUNJLFlBQUksT0FBTyxJQUFYO0FBQUEsWUFDSSxPQUFPLEtBQUssTUFBTCxDQUFZLE9BQVosQ0FEWDs7QUFHQSxhQUFLLFlBQUwsR0FBb0IsVUFBUyxDQUFULEVBQ3BCO0FBQ0ksZ0JBQUksQ0FBQyxLQUFLLEVBQVYsRUFBYztBQUNWO0FBQ0g7QUFDRCxnQkFBSSxLQUFLLE9BQU8sS0FBaEI7QUFDQSxnQkFBSSxTQUFTLEVBQUUsTUFBRixJQUFZLEVBQUUsVUFBM0I7QUFDQSxnQkFBSSxDQUFDLE1BQUwsRUFBYTtBQUNUO0FBQ0g7O0FBRUQsZ0JBQUksQ0FBQyxTQUFTLE1BQVQsRUFBaUIsYUFBakIsQ0FBTCxFQUFzQztBQUNsQyxvQkFBSSxTQUFTLE1BQVQsRUFBaUIsYUFBakIsS0FBbUMsQ0FBQyxTQUFTLE1BQVQsRUFBaUIsVUFBakIsQ0FBcEMsSUFBb0UsQ0FBQyxTQUFTLE9BQU8sVUFBaEIsRUFBNEIsYUFBNUIsQ0FBekUsRUFBcUg7QUFDakgseUJBQUssT0FBTCxDQUFhLElBQUksSUFBSixDQUFTLE9BQU8sWUFBUCxDQUFvQixnQkFBcEIsQ0FBVCxFQUFnRCxPQUFPLFlBQVAsQ0FBb0IsaUJBQXBCLENBQWhELEVBQXdGLE9BQU8sWUFBUCxDQUFvQixlQUFwQixDQUF4RixDQUFiO0FBQ0Esd0JBQUksS0FBSyxLQUFULEVBQWdCO0FBQ1osNEJBQUksWUFBVztBQUNYLGlDQUFLLElBQUw7QUFDQSxnQ0FBSSxLQUFLLGlCQUFMLElBQTBCLEtBQUssS0FBbkMsRUFBMEM7QUFDdEMscUNBQUssS0FBTCxDQUFXLElBQVg7QUFDSDtBQUNKLHlCQUxELEVBS0csR0FMSDtBQU1IO0FBQ0osaUJBVkQsTUFXSyxJQUFJLFNBQVMsTUFBVCxFQUFpQixXQUFqQixDQUFKLEVBQW1DO0FBQ3BDLHlCQUFLLFNBQUw7QUFDSCxpQkFGSSxNQUdBLElBQUksU0FBUyxNQUFULEVBQWlCLFdBQWpCLENBQUosRUFBbUM7QUFDcEMseUJBQUssU0FBTDtBQUNIO0FBQ0o7QUFDRCxnQkFBSSxDQUFDLFNBQVMsTUFBVCxFQUFpQixhQUFqQixDQUFMLEVBQXNDO0FBQ2xDO0FBQ0Esb0JBQUksRUFBRSxjQUFOLEVBQXNCO0FBQ2xCLHNCQUFFLGNBQUY7QUFDSCxpQkFGRCxNQUVPO0FBQ0gsc0JBQUUsV0FBRixHQUFnQixLQUFoQjtBQUNBLDJCQUFPLEtBQVA7QUFDSDtBQUNKLGFBUkQsTUFRTztBQUNILHFCQUFLLEVBQUwsR0FBVSxJQUFWO0FBQ0g7QUFDSixTQXpDRDs7QUEyQ0EsYUFBSyxTQUFMLEdBQWlCLFVBQVMsQ0FBVCxFQUNqQjtBQUNJLGdCQUFJLEtBQUssT0FBTyxLQUFoQjtBQUNBLGdCQUFJLFNBQVMsRUFBRSxNQUFGLElBQVksRUFBRSxVQUEzQjtBQUNBLGdCQUFJLENBQUMsTUFBTCxFQUFhO0FBQ1Q7QUFDSDtBQUNELGdCQUFJLFNBQVMsTUFBVCxFQUFpQixtQkFBakIsQ0FBSixFQUEyQztBQUN2QyxxQkFBSyxTQUFMLENBQWUsT0FBTyxLQUF0QjtBQUNILGFBRkQsTUFHSyxJQUFJLFNBQVMsTUFBVCxFQUFpQixrQkFBakIsQ0FBSixFQUEwQztBQUMzQyxxQkFBSyxRQUFMLENBQWMsT0FBTyxLQUFyQjtBQUNIO0FBQ0osU0FiRDs7QUFlQSxhQUFLLFlBQUwsR0FBb0IsVUFBUyxDQUFULEVBQ3BCO0FBQ0ksZ0JBQUksS0FBSyxPQUFPLEtBQWhCOztBQUVBLGdCQUFJLEtBQUssU0FBTCxFQUFKLEVBQXNCOztBQUVsQix3QkFBTyxFQUFFLE9BQVQ7QUFDSSx5QkFBSyxFQUFMO0FBQ0EseUJBQUssRUFBTDtBQUNJLDRCQUFJLEtBQUssS0FBVCxFQUFnQjtBQUNaLGlDQUFLLEtBQUwsQ0FBVyxJQUFYO0FBQ0g7QUFDRDtBQUNKLHlCQUFLLEVBQUw7QUFDSSwwQkFBRSxjQUFGO0FBQ0EsNkJBQUssVUFBTCxDQUFnQixVQUFoQixFQUE0QixDQUE1QjtBQUNBO0FBQ0oseUJBQUssRUFBTDtBQUNJLDZCQUFLLFVBQUwsQ0FBZ0IsVUFBaEIsRUFBNEIsQ0FBNUI7QUFDQTtBQUNKLHlCQUFLLEVBQUw7QUFDSSw2QkFBSyxVQUFMLENBQWdCLEtBQWhCLEVBQXVCLENBQXZCO0FBQ0E7QUFDSix5QkFBSyxFQUFMO0FBQ0ksNkJBQUssVUFBTCxDQUFnQixLQUFoQixFQUF1QixDQUF2QjtBQUNBO0FBbkJSO0FBcUJIO0FBQ0osU0E1QkQ7O0FBOEJBLGFBQUssY0FBTCxHQUFzQixVQUFTLENBQVQsRUFDdEI7QUFDSSxnQkFBSSxJQUFKOztBQUVBLGdCQUFJLEVBQUUsT0FBRixLQUFjLElBQWxCLEVBQXdCO0FBQ3BCO0FBQ0g7QUFDRCxnQkFBSSxLQUFLLEtBQVQsRUFBZ0I7QUFDWix1QkFBTyxLQUFLLEtBQUwsQ0FBVyxLQUFLLEtBQUwsQ0FBVyxLQUF0QixFQUE2QixLQUFLLE1BQWxDLENBQVA7QUFDSCxhQUZELE1BRU8sSUFBSSxTQUFKLEVBQWU7QUFDbEIsdUJBQU8sT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFsQixFQUF5QixLQUFLLE1BQTlCLEVBQXNDLEtBQUssWUFBM0MsQ0FBUDtBQUNBLHVCQUFRLFFBQVEsS0FBSyxPQUFMLEVBQVQsR0FBMkIsS0FBSyxNQUFMLEVBQTNCLEdBQTJDLElBQWxEO0FBQ0gsYUFITSxNQUlGO0FBQ0QsdUJBQU8sSUFBSSxJQUFKLENBQVMsS0FBSyxLQUFMLENBQVcsS0FBSyxLQUFMLENBQVcsS0FBdEIsQ0FBVCxDQUFQO0FBQ0g7QUFDRCxnQkFBSSxPQUFPLElBQVAsQ0FBSixFQUFrQjtBQUNoQixxQkFBSyxPQUFMLENBQWEsSUFBYjtBQUNEO0FBQ0QsZ0JBQUksQ0FBQyxLQUFLLEVBQVYsRUFBYztBQUNWLHFCQUFLLElBQUw7QUFDSDtBQUNKLFNBdEJEOztBQXdCQSxhQUFLLGFBQUwsR0FBcUIsWUFDckI7QUFDSSxpQkFBSyxJQUFMO0FBQ0gsU0FIRDs7QUFLQSxhQUFLLGFBQUwsR0FBcUIsWUFDckI7QUFDSSxpQkFBSyxJQUFMO0FBQ0gsU0FIRDs7QUFLQSxhQUFLLFlBQUwsR0FBb0IsWUFDcEI7QUFDSTtBQUNBLGdCQUFJLE1BQU0sU0FBUyxhQUFuQjtBQUNBLGVBQUc7QUFDQyxvQkFBSSxTQUFTLEdBQVQsRUFBYyxhQUFkLENBQUosRUFBa0M7QUFDOUI7QUFDSDtBQUNKLGFBSkQsUUFLUSxNQUFNLElBQUksVUFMbEI7O0FBT0EsZ0JBQUksQ0FBQyxLQUFLLEVBQVYsRUFBYztBQUNWLHFCQUFLLEVBQUwsR0FBVSxJQUFJLFlBQVc7QUFDckIseUJBQUssSUFBTDtBQUNILGlCQUZTLEVBRVAsRUFGTyxDQUFWO0FBR0g7QUFDRCxpQkFBSyxFQUFMLEdBQVUsS0FBVjtBQUNILFNBakJEOztBQW1CQSxhQUFLLFFBQUwsR0FBZ0IsVUFBUyxDQUFULEVBQ2hCO0FBQ0ksZ0JBQUksS0FBSyxPQUFPLEtBQWhCO0FBQ0EsZ0JBQUksU0FBUyxFQUFFLE1BQUYsSUFBWSxFQUFFLFVBQTNCO0FBQUEsZ0JBQ0ksTUFBTSxNQURWO0FBRUEsZ0JBQUksQ0FBQyxNQUFMLEVBQWE7QUFDVDtBQUNIO0FBQ0QsZ0JBQUksQ0FBQyxpQkFBRCxJQUFzQixTQUFTLE1BQVQsRUFBaUIsYUFBakIsQ0FBMUIsRUFBMkQ7QUFDdkQsb0JBQUksQ0FBQyxPQUFPLFFBQVosRUFBc0I7QUFDbEIsMkJBQU8sWUFBUCxDQUFvQixVQUFwQixFQUFnQyxTQUFoQztBQUNBLDZCQUFTLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsS0FBSyxTQUFoQztBQUNIO0FBQ0o7QUFDRCxlQUFHO0FBQ0Msb0JBQUksU0FBUyxHQUFULEVBQWMsYUFBZCxLQUFnQyxRQUFRLEtBQUssT0FBakQsRUFBMEQ7QUFDdEQ7QUFDSDtBQUNKLGFBSkQsUUFLUSxNQUFNLElBQUksVUFMbEI7QUFNQSxnQkFBSSxLQUFLLEVBQUwsSUFBVyxXQUFXLEtBQUssT0FBM0IsSUFBc0MsUUFBUSxLQUFLLE9BQXZELEVBQWdFO0FBQzVELHFCQUFLLElBQUw7QUFDSDtBQUNKLFNBdkJEOztBQXlCQSxhQUFLLEVBQUwsR0FBVSxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBVjtBQUNBLGFBQUssRUFBTCxDQUFRLFNBQVIsR0FBb0IsaUJBQWlCLEtBQUssS0FBTCxHQUFhLFNBQWIsR0FBeUIsRUFBMUMsS0FBaUQsS0FBSyxLQUFMLEdBQWEsTUFBTSxLQUFLLEtBQXhCLEdBQWdDLEVBQWpGLENBQXBCOztBQUVBLGlCQUFTLEtBQUssRUFBZCxFQUFrQixXQUFsQixFQUErQixLQUFLLFlBQXBDLEVBQWtELElBQWxEO0FBQ0EsaUJBQVMsS0FBSyxFQUFkLEVBQWtCLFVBQWxCLEVBQThCLEtBQUssWUFBbkMsRUFBaUQsSUFBakQ7QUFDQSxpQkFBUyxLQUFLLEVBQWQsRUFBa0IsUUFBbEIsRUFBNEIsS0FBSyxTQUFqQzs7QUFFQSxZQUFJLEtBQUssYUFBVCxFQUF3QjtBQUNwQixxQkFBUyxRQUFULEVBQW1CLFNBQW5CLEVBQThCLEtBQUssWUFBbkM7QUFDSDs7QUFFRCxZQUFJLEtBQUssS0FBVCxFQUFnQjtBQUNaLGdCQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNoQixxQkFBSyxTQUFMLENBQWUsV0FBZixDQUEyQixLQUFLLEVBQWhDO0FBQ0gsYUFGRCxNQUVPLElBQUksS0FBSyxLQUFULEVBQWdCO0FBQ25CLHlCQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLEtBQUssRUFBL0I7QUFDSCxhQUZNLE1BRUE7QUFDSCxxQkFBSyxLQUFMLENBQVcsVUFBWCxDQUFzQixZQUF0QixDQUFtQyxLQUFLLEVBQXhDLEVBQTRDLEtBQUssS0FBTCxDQUFXLFdBQXZEO0FBQ0g7QUFDRCxxQkFBUyxLQUFLLEtBQWQsRUFBcUIsUUFBckIsRUFBK0IsS0FBSyxjQUFwQzs7QUFFQSxnQkFBSSxDQUFDLEtBQUssV0FBVixFQUF1QjtBQUNuQixvQkFBSSxhQUFhLEtBQUssS0FBTCxDQUFXLEtBQTVCLEVBQW1DO0FBQy9CLHlCQUFLLFdBQUwsR0FBbUIsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFsQixFQUF5QixLQUFLLE1BQTlCLEVBQXNDLE1BQXRDLEVBQW5CO0FBQ0gsaUJBRkQsTUFFTztBQUNILHlCQUFLLFdBQUwsR0FBbUIsSUFBSSxJQUFKLENBQVMsS0FBSyxLQUFMLENBQVcsS0FBSyxLQUFMLENBQVcsS0FBdEIsQ0FBVCxDQUFuQjtBQUNIO0FBQ0QscUJBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNIO0FBQ0o7O0FBRUQsWUFBSSxVQUFVLEtBQUssV0FBbkI7O0FBRUEsWUFBSSxPQUFPLE9BQVAsQ0FBSixFQUFxQjtBQUNqQixnQkFBSSxLQUFLLGNBQVQsRUFBeUI7QUFDckIscUJBQUssT0FBTCxDQUFhLE9BQWIsRUFBc0IsSUFBdEI7QUFDSCxhQUZELE1BRU87QUFDSCxxQkFBSyxRQUFMLENBQWMsT0FBZDtBQUNIO0FBQ0osU0FORCxNQU1PO0FBQ0gsaUJBQUssUUFBTCxDQUFjLElBQUksSUFBSixFQUFkO0FBQ0g7O0FBRUQsWUFBSSxLQUFLLEtBQVQsRUFBZ0I7QUFDWixpQkFBSyxJQUFMO0FBQ0EsaUJBQUssRUFBTCxDQUFRLFNBQVIsSUFBcUIsV0FBckI7QUFDQSxxQkFBUyxLQUFLLE9BQWQsRUFBdUIsT0FBdkIsRUFBZ0MsS0FBSyxhQUFyQztBQUNBLHFCQUFTLEtBQUssT0FBZCxFQUF1QixPQUF2QixFQUFnQyxLQUFLLGFBQXJDO0FBQ0EscUJBQVMsS0FBSyxPQUFkLEVBQXVCLE1BQXZCLEVBQStCLEtBQUssWUFBcEM7QUFDSCxTQU5ELE1BTU87QUFDSCxpQkFBSyxJQUFMO0FBQ0g7QUFDSixLQTFuQkQ7O0FBNm5CQTs7O0FBR0EsWUFBUSxTQUFSLEdBQW9COztBQUdoQjs7O0FBR0EsZ0JBQVEsZ0JBQVMsT0FBVCxFQUNSO0FBQ0ksZ0JBQUksQ0FBQyxLQUFLLEVBQVYsRUFBYztBQUNWLHFCQUFLLEVBQUwsR0FBVSxPQUFPLEVBQVAsRUFBVyxRQUFYLEVBQXFCLElBQXJCLENBQVY7QUFDSDs7QUFFRCxnQkFBSSxPQUFPLE9BQU8sS0FBSyxFQUFaLEVBQWdCLE9BQWhCLEVBQXlCLElBQXpCLENBQVg7O0FBRUEsaUJBQUssS0FBTCxHQUFhLENBQUMsQ0FBQyxLQUFLLEtBQXBCOztBQUVBLGlCQUFLLEtBQUwsR0FBYyxLQUFLLEtBQUwsSUFBYyxLQUFLLEtBQUwsQ0FBVyxRQUExQixHQUFzQyxLQUFLLEtBQTNDLEdBQW1ELElBQWhFOztBQUVBLGlCQUFLLEtBQUwsR0FBYyxPQUFPLEtBQUssS0FBYixLQUF3QixRQUF4QixJQUFvQyxLQUFLLEtBQXpDLEdBQWlELEtBQUssS0FBdEQsR0FBOEQsSUFBM0U7O0FBRUEsaUJBQUssS0FBTCxHQUFhLENBQUMsRUFBRSxLQUFLLEtBQUwsS0FBZSxTQUFmLEdBQTJCLEtBQUssS0FBTCxJQUFjLEtBQUssS0FBOUMsR0FBc0QsS0FBSyxLQUE3RCxDQUFkOztBQUVBLGlCQUFLLE9BQUwsR0FBZ0IsS0FBSyxPQUFMLElBQWdCLEtBQUssT0FBTCxDQUFhLFFBQTlCLEdBQTBDLEtBQUssT0FBL0MsR0FBeUQsS0FBSyxLQUE3RTs7QUFFQSxpQkFBSyxlQUFMLEdBQXVCLENBQUMsQ0FBQyxLQUFLLGVBQTlCOztBQUVBLGlCQUFLLFlBQUwsR0FBcUIsT0FBTyxLQUFLLFlBQWIsS0FBK0IsVUFBL0IsR0FBNEMsS0FBSyxZQUFqRCxHQUFnRSxJQUFwRjs7QUFFQSxnQkFBSSxNQUFNLFNBQVMsS0FBSyxjQUFkLEVBQThCLEVBQTlCLEtBQXFDLENBQS9DO0FBQ0EsaUJBQUssY0FBTCxHQUFzQixNQUFNLENBQU4sR0FBVSxDQUFWLEdBQWMsR0FBcEM7O0FBRUEsZ0JBQUksQ0FBQyxPQUFPLEtBQUssT0FBWixDQUFMLEVBQTJCO0FBQ3ZCLHFCQUFLLE9BQUwsR0FBZSxLQUFmO0FBQ0g7QUFDRCxnQkFBSSxDQUFDLE9BQU8sS0FBSyxPQUFaLENBQUwsRUFBMkI7QUFDdkIscUJBQUssT0FBTCxHQUFlLEtBQWY7QUFDSDtBQUNELGdCQUFLLEtBQUssT0FBTCxJQUFnQixLQUFLLE9BQXRCLElBQWtDLEtBQUssT0FBTCxHQUFlLEtBQUssT0FBMUQsRUFBbUU7QUFDL0QscUJBQUssT0FBTCxHQUFlLEtBQUssT0FBTCxHQUFlLEtBQTlCO0FBQ0g7QUFDRCxnQkFBSSxLQUFLLE9BQVQsRUFBa0I7QUFDZCxxQkFBSyxVQUFMLENBQWdCLEtBQUssT0FBckI7QUFDSDtBQUNELGdCQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNkLHFCQUFLLFVBQUwsQ0FBZ0IsS0FBSyxPQUFyQjtBQUNIOztBQUVELGdCQUFJLFFBQVEsS0FBSyxTQUFiLENBQUosRUFBNkI7QUFDekIsb0JBQUksV0FBVyxJQUFJLElBQUosR0FBVyxXQUFYLEtBQTJCLEVBQTFDO0FBQ0EscUJBQUssU0FBTCxDQUFlLENBQWYsSUFBb0IsU0FBUyxLQUFLLFNBQUwsQ0FBZSxDQUFmLENBQVQsRUFBNEIsRUFBNUIsS0FBbUMsUUFBdkQ7QUFDQSxxQkFBSyxTQUFMLENBQWUsQ0FBZixJQUFvQixTQUFTLEtBQUssU0FBTCxDQUFlLENBQWYsQ0FBVCxFQUE0QixFQUE1QixLQUFtQyxRQUF2RDtBQUNILGFBSkQsTUFJTztBQUNILHFCQUFLLFNBQUwsR0FBaUIsS0FBSyxHQUFMLENBQVMsU0FBUyxLQUFLLFNBQWQsRUFBeUIsRUFBekIsQ0FBVCxLQUEwQyxTQUFTLFNBQXBFO0FBQ0Esb0JBQUksS0FBSyxTQUFMLEdBQWlCLEdBQXJCLEVBQTBCO0FBQ3RCLHlCQUFLLFNBQUwsR0FBaUIsR0FBakI7QUFDSDtBQUNKOztBQUVELG1CQUFPLElBQVA7QUFDSCxTQTNEZTs7QUE2RGhCOzs7QUFHQSxrQkFBVSxrQkFBUyxNQUFULEVBQ1Y7QUFDSSxxQkFBUyxVQUFVLEtBQUssRUFBTCxDQUFRLE1BQTNCO0FBQ0EsZ0JBQUksQ0FBQyxPQUFPLEtBQUssRUFBWixDQUFMLEVBQXNCO0FBQ2xCLHVCQUFPLEVBQVA7QUFDSDtBQUNELGdCQUFJLEtBQUssRUFBTCxDQUFRLFFBQVosRUFBc0I7QUFDcEIsdUJBQU8sS0FBSyxFQUFMLENBQVEsUUFBUixDQUFpQixLQUFLLEVBQXRCLEVBQTBCLE1BQTFCLENBQVA7QUFDRDtBQUNELGdCQUFJLFNBQUosRUFBZTtBQUNiLHVCQUFPLE9BQU8sS0FBSyxFQUFaLEVBQWdCLE1BQWhCLENBQXVCLE1BQXZCLENBQVA7QUFDRDtBQUNELG1CQUFPLEtBQUssRUFBTCxDQUFRLFlBQVIsRUFBUDtBQUNILFNBN0VlOztBQStFaEI7OztBQUdBLG1CQUFXLHFCQUNYO0FBQ0ksbUJBQU8sWUFBWSxPQUFPLEtBQUssRUFBWixDQUFaLEdBQThCLElBQXJDO0FBQ0gsU0FyRmU7O0FBdUZoQjs7O0FBR0EsbUJBQVcsbUJBQVMsSUFBVCxFQUFlLGVBQWYsRUFDWDtBQUNJLGdCQUFJLGFBQWEsT0FBTyxRQUFQLENBQWdCLElBQWhCLENBQWpCLEVBQXdDO0FBQ3BDLHFCQUFLLE9BQUwsQ0FBYSxLQUFLLE1BQUwsRUFBYixFQUE0QixlQUE1QjtBQUNIO0FBQ0osU0EvRmU7O0FBaUdoQjs7O0FBR0EsaUJBQVMsbUJBQ1Q7QUFDSSxtQkFBTyxPQUFPLEtBQUssRUFBWixJQUFrQixJQUFJLElBQUosQ0FBUyxLQUFLLEVBQUwsQ0FBUSxPQUFSLEVBQVQsQ0FBbEIsR0FBZ0QsSUFBdkQ7QUFDSCxTQXZHZTs7QUF5R2hCOzs7QUFHQSxpQkFBUyxpQkFBUyxJQUFULEVBQWUsZUFBZixFQUNUO0FBQ0ksZ0JBQUksQ0FBQyxJQUFMLEVBQVc7QUFDUCxxQkFBSyxFQUFMLEdBQVUsSUFBVjs7QUFFQSxvQkFBSSxLQUFLLEVBQUwsQ0FBUSxLQUFaLEVBQW1CO0FBQ2YseUJBQUssRUFBTCxDQUFRLEtBQVIsQ0FBYyxLQUFkLEdBQXNCLEVBQXRCO0FBQ0EsOEJBQVUsS0FBSyxFQUFMLENBQVEsS0FBbEIsRUFBeUIsUUFBekIsRUFBbUMsRUFBRSxTQUFTLElBQVgsRUFBbkM7QUFDSDs7QUFFRCx1QkFBTyxLQUFLLElBQUwsRUFBUDtBQUNIO0FBQ0QsZ0JBQUksT0FBTyxJQUFQLEtBQWdCLFFBQXBCLEVBQThCO0FBQzFCLHVCQUFPLElBQUksSUFBSixDQUFTLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBVCxDQUFQO0FBQ0g7QUFDRCxnQkFBSSxDQUFDLE9BQU8sSUFBUCxDQUFMLEVBQW1CO0FBQ2Y7QUFDSDs7QUFFRCxnQkFBSSxNQUFNLEtBQUssRUFBTCxDQUFRLE9BQWxCO0FBQUEsZ0JBQ0ksTUFBTSxLQUFLLEVBQUwsQ0FBUSxPQURsQjs7QUFHQSxnQkFBSSxPQUFPLEdBQVAsS0FBZSxPQUFPLEdBQTFCLEVBQStCO0FBQzNCLHVCQUFPLEdBQVA7QUFDSCxhQUZELE1BRU8sSUFBSSxPQUFPLEdBQVAsS0FBZSxPQUFPLEdBQTFCLEVBQStCO0FBQ2xDLHVCQUFPLEdBQVA7QUFDSDs7QUFFRCxpQkFBSyxFQUFMLEdBQVUsSUFBSSxJQUFKLENBQVMsS0FBSyxPQUFMLEVBQVQsQ0FBVjtBQUNBLDRCQUFnQixLQUFLLEVBQXJCO0FBQ0EsaUJBQUssUUFBTCxDQUFjLEtBQUssRUFBbkI7O0FBRUEsZ0JBQUksS0FBSyxFQUFMLENBQVEsS0FBWixFQUFtQjtBQUNmLHFCQUFLLEVBQUwsQ0FBUSxLQUFSLENBQWMsS0FBZCxHQUFzQixLQUFLLFFBQUwsRUFBdEI7QUFDQSwwQkFBVSxLQUFLLEVBQUwsQ0FBUSxLQUFsQixFQUF5QixRQUF6QixFQUFtQyxFQUFFLFNBQVMsSUFBWCxFQUFuQztBQUNIO0FBQ0QsZ0JBQUksQ0FBQyxlQUFELElBQW9CLE9BQU8sS0FBSyxFQUFMLENBQVEsUUFBZixLQUE0QixVQUFwRCxFQUFnRTtBQUM1RCxxQkFBSyxFQUFMLENBQVEsUUFBUixDQUFpQixJQUFqQixDQUFzQixJQUF0QixFQUE0QixLQUFLLE9BQUwsRUFBNUI7QUFDSDtBQUNKLFNBbkplOztBQXFKaEI7OztBQUdBLGtCQUFVLGtCQUFTLElBQVQsRUFDVjtBQUNJLGdCQUFJLGNBQWMsSUFBbEI7O0FBRUEsZ0JBQUksQ0FBQyxPQUFPLElBQVAsQ0FBTCxFQUFtQjtBQUNmO0FBQ0g7O0FBRUQsZ0JBQUksS0FBSyxTQUFULEVBQW9CO0FBQ2hCLG9CQUFJLG1CQUFtQixJQUFJLElBQUosQ0FBUyxLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLElBQTNCLEVBQWlDLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsS0FBbkQsRUFBMEQsQ0FBMUQsQ0FBdkI7QUFBQSxvQkFDSSxrQkFBa0IsSUFBSSxJQUFKLENBQVMsS0FBSyxTQUFMLENBQWUsS0FBSyxTQUFMLENBQWUsTUFBZixHQUFzQixDQUFyQyxFQUF3QyxJQUFqRCxFQUF1RCxLQUFLLFNBQUwsQ0FBZSxLQUFLLFNBQUwsQ0FBZSxNQUFmLEdBQXNCLENBQXJDLEVBQXdDLEtBQS9GLEVBQXNHLENBQXRHLENBRHRCO0FBQUEsb0JBRUksY0FBYyxLQUFLLE9BQUwsRUFGbEI7QUFHQTtBQUNBLGdDQUFnQixRQUFoQixDQUF5QixnQkFBZ0IsUUFBaEIsS0FBMkIsQ0FBcEQ7QUFDQSxnQ0FBZ0IsT0FBaEIsQ0FBd0IsZ0JBQWdCLE9BQWhCLEtBQTBCLENBQWxEO0FBQ0EsOEJBQWUsY0FBYyxpQkFBaUIsT0FBakIsRUFBZCxJQUE0QyxnQkFBZ0IsT0FBaEIsS0FBNEIsV0FBdkY7QUFDSDs7QUFFRCxnQkFBSSxXQUFKLEVBQWlCO0FBQ2IscUJBQUssU0FBTCxHQUFpQixDQUFDO0FBQ2QsMkJBQU8sS0FBSyxRQUFMLEVBRE87QUFFZCwwQkFBTSxLQUFLLFdBQUw7QUFGUSxpQkFBRCxDQUFqQjtBQUlBLG9CQUFJLEtBQUssRUFBTCxDQUFRLFlBQVIsS0FBeUIsT0FBN0IsRUFBc0M7QUFDbEMseUJBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsS0FBbEIsSUFBMkIsSUFBSSxLQUFLLEVBQUwsQ0FBUSxjQUF2QztBQUNIO0FBQ0o7O0FBRUQsaUJBQUssZUFBTDtBQUNILFNBckxlOztBQXVMaEIsb0JBQVksb0JBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUI7O0FBRTdCLGdCQUFJLE1BQU0sS0FBSyxPQUFMLE1BQWtCLElBQUksSUFBSixFQUE1QjtBQUNBLGdCQUFJLGFBQWEsU0FBUyxJQUFULElBQWUsRUFBZixHQUFrQixFQUFsQixHQUFxQixFQUFyQixHQUF3QixJQUF6Qzs7QUFFQSxnQkFBSSxNQUFKOztBQUVBLGdCQUFJLFNBQVMsS0FBYixFQUFvQjtBQUNoQix5QkFBUyxJQUFJLElBQUosQ0FBUyxJQUFJLE9BQUosS0FBZ0IsVUFBekIsQ0FBVDtBQUNILGFBRkQsTUFFTyxJQUFJLFNBQVMsVUFBYixFQUF5QjtBQUM1Qix5QkFBUyxJQUFJLElBQUosQ0FBUyxJQUFJLE9BQUosS0FBZ0IsVUFBekIsQ0FBVDtBQUNIOztBQUVELGlCQUFLLE9BQUwsQ0FBYSxNQUFiO0FBQ0gsU0FyTWU7O0FBdU1oQix5QkFBaUIsMkJBQVc7QUFDeEIsaUJBQUssU0FBTCxDQUFlLENBQWYsSUFBb0IsZUFBZSxLQUFLLFNBQUwsQ0FBZSxDQUFmLENBQWYsQ0FBcEI7QUFDQSxpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssRUFBTCxDQUFRLGNBQTVCLEVBQTRDLEdBQTVDLEVBQWlEO0FBQzdDLHFCQUFLLFNBQUwsQ0FBZSxDQUFmLElBQW9CLGVBQWU7QUFDL0IsMkJBQU8sS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixLQUFsQixHQUEwQixDQURGO0FBRS9CLDBCQUFNLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0I7QUFGTyxpQkFBZixDQUFwQjtBQUlIO0FBQ0QsaUJBQUssSUFBTDtBQUNILFNBaE5lOztBQWtOaEIsbUJBQVcscUJBQ1g7QUFDSSxpQkFBSyxRQUFMLENBQWMsSUFBSSxJQUFKLEVBQWQ7QUFDSCxTQXJOZTs7QUF1TmhCOzs7QUFHQSxtQkFBVyxtQkFBUyxLQUFULEVBQ1g7QUFDSSxnQkFBSSxDQUFDLE1BQU0sS0FBTixDQUFMLEVBQW1CO0FBQ2YscUJBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsS0FBbEIsR0FBMEIsU0FBUyxLQUFULEVBQWdCLEVBQWhCLENBQTFCO0FBQ0EscUJBQUssZUFBTDtBQUNIO0FBQ0osU0FoT2U7O0FBa09oQixtQkFBVyxxQkFDWDtBQUNJLGlCQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLEtBQWxCO0FBQ0EsaUJBQUssZUFBTDtBQUNILFNBdE9lOztBQXdPaEIsbUJBQVcscUJBQ1g7QUFDSSxpQkFBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixLQUFsQjtBQUNBLGlCQUFLLGVBQUw7QUFDSCxTQTVPZTs7QUE4T2hCOzs7QUFHQSxrQkFBVSxrQkFBUyxJQUFULEVBQ1Y7QUFDSSxnQkFBSSxDQUFDLE1BQU0sSUFBTixDQUFMLEVBQWtCO0FBQ2QscUJBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsSUFBbEIsR0FBeUIsU0FBUyxJQUFULEVBQWUsRUFBZixDQUF6QjtBQUNBLHFCQUFLLGVBQUw7QUFDSDtBQUNKLFNBdlBlOztBQXlQaEI7OztBQUdBLG9CQUFZLG9CQUFTLEtBQVQsRUFDWjtBQUNJLGdCQUFHLGlCQUFpQixJQUFwQixFQUEwQjtBQUN0QixnQ0FBZ0IsS0FBaEI7QUFDQSxxQkFBSyxFQUFMLENBQVEsT0FBUixHQUFrQixLQUFsQjtBQUNBLHFCQUFLLEVBQUwsQ0FBUSxPQUFSLEdBQW1CLE1BQU0sV0FBTixFQUFuQjtBQUNBLHFCQUFLLEVBQUwsQ0FBUSxRQUFSLEdBQW1CLE1BQU0sUUFBTixFQUFuQjtBQUNILGFBTEQsTUFLTztBQUNILHFCQUFLLEVBQUwsQ0FBUSxPQUFSLEdBQWtCLFNBQVMsT0FBM0I7QUFDQSxxQkFBSyxFQUFMLENBQVEsT0FBUixHQUFtQixTQUFTLE9BQTVCO0FBQ0EscUJBQUssRUFBTCxDQUFRLFFBQVIsR0FBbUIsU0FBUyxRQUE1QjtBQUNBLHFCQUFLLEVBQUwsQ0FBUSxVQUFSLEdBQXFCLFNBQVMsVUFBOUI7QUFDSDs7QUFFRCxpQkFBSyxJQUFMO0FBQ0gsU0EzUWU7O0FBNlFoQjs7O0FBR0Esb0JBQVksb0JBQVMsS0FBVCxFQUNaO0FBQ0ksZ0JBQUcsaUJBQWlCLElBQXBCLEVBQTBCO0FBQ3RCLGdDQUFnQixLQUFoQjtBQUNBLHFCQUFLLEVBQUwsQ0FBUSxPQUFSLEdBQWtCLEtBQWxCO0FBQ0EscUJBQUssRUFBTCxDQUFRLE9BQVIsR0FBa0IsTUFBTSxXQUFOLEVBQWxCO0FBQ0EscUJBQUssRUFBTCxDQUFRLFFBQVIsR0FBbUIsTUFBTSxRQUFOLEVBQW5CO0FBQ0gsYUFMRCxNQUtPO0FBQ0gscUJBQUssRUFBTCxDQUFRLE9BQVIsR0FBa0IsU0FBUyxPQUEzQjtBQUNBLHFCQUFLLEVBQUwsQ0FBUSxPQUFSLEdBQWtCLFNBQVMsT0FBM0I7QUFDQSxxQkFBSyxFQUFMLENBQVEsUUFBUixHQUFtQixTQUFTLFFBQTVCO0FBQ0EscUJBQUssRUFBTCxDQUFRLFFBQVIsR0FBbUIsU0FBUyxRQUE1QjtBQUNIOztBQUVELGlCQUFLLElBQUw7QUFDSCxTQS9SZTs7QUFpU2hCLHVCQUFlLHVCQUFTLEtBQVQsRUFDZjtBQUNJLGlCQUFLLEVBQUwsQ0FBUSxVQUFSLEdBQXFCLEtBQXJCO0FBQ0gsU0FwU2U7O0FBc1NoQixxQkFBYSxxQkFBUyxLQUFULEVBQ2I7QUFDSSxpQkFBSyxFQUFMLENBQVEsUUFBUixHQUFtQixLQUFuQjtBQUNILFNBelNlOztBQTJTaEI7OztBQUdBLGNBQU0sY0FBUyxLQUFULEVBQ047QUFDSSxnQkFBSSxDQUFDLEtBQUssRUFBTixJQUFZLENBQUMsS0FBakIsRUFBd0I7QUFDcEI7QUFDSDtBQUNELGdCQUFJLE9BQU8sS0FBSyxFQUFoQjtBQUFBLGdCQUNJLFVBQVUsS0FBSyxPQURuQjtBQUFBLGdCQUVJLFVBQVUsS0FBSyxPQUZuQjtBQUFBLGdCQUdJLFdBQVcsS0FBSyxRQUhwQjtBQUFBLGdCQUlJLFdBQVcsS0FBSyxRQUpwQjtBQUFBLGdCQUtJLE9BQU8sRUFMWDtBQUFBLGdCQU1JLE1BTko7O0FBUUEsZ0JBQUksS0FBSyxFQUFMLElBQVcsT0FBZixFQUF3QjtBQUNwQixxQkFBSyxFQUFMLEdBQVUsT0FBVjtBQUNBLG9CQUFJLENBQUMsTUFBTSxRQUFOLENBQUQsSUFBb0IsS0FBSyxFQUFMLEdBQVUsUUFBbEMsRUFBNEM7QUFDeEMseUJBQUssRUFBTCxHQUFVLFFBQVY7QUFDSDtBQUNKO0FBQ0QsZ0JBQUksS0FBSyxFQUFMLElBQVcsT0FBZixFQUF3QjtBQUNwQixxQkFBSyxFQUFMLEdBQVUsT0FBVjtBQUNBLG9CQUFJLENBQUMsTUFBTSxRQUFOLENBQUQsSUFBb0IsS0FBSyxFQUFMLEdBQVUsUUFBbEMsRUFBNEM7QUFDeEMseUJBQUssRUFBTCxHQUFVLFFBQVY7QUFDSDtBQUNKOztBQUVELHFCQUFTLGdCQUFnQixLQUFLLE1BQUwsR0FBYyxRQUFkLENBQXVCLEVBQXZCLEVBQTJCLE9BQTNCLENBQW1DLFVBQW5DLEVBQStDLEVBQS9DLEVBQW1ELE1BQW5ELENBQTBELENBQTFELEVBQTZELENBQTdELENBQXpCOztBQUVBLGlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxjQUF6QixFQUF5QyxHQUF6QyxFQUE4QztBQUMxQyx3QkFBUSw4QkFBOEIsWUFBWSxJQUFaLEVBQWtCLENBQWxCLEVBQXFCLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsSUFBdkMsRUFBNkMsS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixLQUEvRCxFQUFzRSxLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLElBQXhGLEVBQThGLE1BQTlGLENBQTlCLEdBQXNJLEtBQUssTUFBTCxDQUFZLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsSUFBOUIsRUFBb0MsS0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixLQUF0RCxFQUE2RCxNQUE3RCxDQUF0SSxHQUE2TSxRQUFyTjtBQUNIOztBQUVELGlCQUFLLEVBQUwsQ0FBUSxTQUFSLEdBQW9CLElBQXBCOztBQUVBLGdCQUFJLEtBQUssS0FBVCxFQUFnQjtBQUNaLG9CQUFHLEtBQUssS0FBTCxDQUFXLElBQVgsS0FBb0IsUUFBdkIsRUFBaUM7QUFDN0Isd0JBQUksWUFBVztBQUNYLDZCQUFLLE9BQUwsQ0FBYSxLQUFiO0FBQ0gscUJBRkQsRUFFRyxDQUZIO0FBR0g7QUFDSjs7QUFFRCxnQkFBSSxPQUFPLEtBQUssRUFBTCxDQUFRLE1BQWYsS0FBMEIsVUFBOUIsRUFBMEM7QUFDdEMscUJBQUssRUFBTCxDQUFRLE1BQVIsQ0FBZSxJQUFmO0FBQ0g7O0FBRUQsZ0JBQUksS0FBSyxLQUFULEVBQWdCO0FBQ1o7QUFDQSxxQkFBSyxLQUFMLENBQVcsWUFBWCxDQUF3QixZQUF4QixFQUFzQyxtQ0FBdEM7QUFDSDtBQUNKLFNBaFdlOztBQWtXaEIsd0JBQWdCLDBCQUNoQjtBQUNJLGdCQUFJLEtBQUosRUFBVyxHQUFYLEVBQWdCLEtBQWhCLEVBQXVCLE1BQXZCLEVBQStCLGFBQS9CLEVBQThDLGNBQTlDLEVBQThELFNBQTlELEVBQXlFLElBQXpFLEVBQStFLEdBQS9FLEVBQW9GLFVBQXBGOztBQUVBLGdCQUFJLEtBQUssRUFBTCxDQUFRLFNBQVosRUFBdUI7O0FBRXZCLGlCQUFLLEVBQUwsQ0FBUSxLQUFSLENBQWMsUUFBZCxHQUF5QixVQUF6Qjs7QUFFQSxvQkFBUSxLQUFLLEVBQUwsQ0FBUSxPQUFoQjtBQUNBLGtCQUFNLEtBQU47QUFDQSxvQkFBUSxLQUFLLEVBQUwsQ0FBUSxXQUFoQjtBQUNBLHFCQUFTLEtBQUssRUFBTCxDQUFRLFlBQWpCO0FBQ0EsNEJBQWdCLE9BQU8sVUFBUCxJQUFxQixTQUFTLGVBQVQsQ0FBeUIsV0FBOUQ7QUFDQSw2QkFBaUIsT0FBTyxXQUFQLElBQXNCLFNBQVMsZUFBVCxDQUF5QixZQUFoRTtBQUNBLHdCQUFZLE9BQU8sV0FBUCxJQUFzQixTQUFTLElBQVQsQ0FBYyxTQUFwQyxJQUFpRCxTQUFTLGVBQVQsQ0FBeUIsU0FBdEY7O0FBRUEsZ0JBQUksT0FBTyxNQUFNLHFCQUFiLEtBQXVDLFVBQTNDLEVBQXVEO0FBQ25ELDZCQUFhLE1BQU0scUJBQU4sRUFBYjtBQUNBLHVCQUFPLFdBQVcsSUFBWCxHQUFrQixPQUFPLFdBQWhDO0FBQ0Esc0JBQU0sV0FBVyxNQUFYLEdBQW9CLE9BQU8sV0FBakM7QUFDSCxhQUpELE1BSU87QUFDSCx1QkFBTyxJQUFJLFVBQVg7QUFDQSxzQkFBTyxJQUFJLFNBQUosR0FBZ0IsSUFBSSxZQUEzQjtBQUNBLHVCQUFPLE1BQU0sSUFBSSxZQUFqQixFQUFnQztBQUM1Qiw0QkFBUSxJQUFJLFVBQVo7QUFDQSwyQkFBUSxJQUFJLFNBQVo7QUFDSDtBQUNKOztBQUVEO0FBQ0EsZ0JBQUssS0FBSyxFQUFMLENBQVEsVUFBUixJQUFzQixPQUFPLEtBQVAsR0FBZSxhQUF0QyxJQUVJLEtBQUssRUFBTCxDQUFRLFFBQVIsQ0FBaUIsT0FBakIsQ0FBeUIsT0FBekIsSUFBb0MsQ0FBQyxDQUFyQyxJQUNBLE9BQU8sS0FBUCxHQUFlLE1BQU0sV0FBckIsR0FBbUMsQ0FIM0MsRUFLRTtBQUNFLHVCQUFPLE9BQU8sS0FBUCxHQUFlLE1BQU0sV0FBNUI7QUFDSDtBQUNELGdCQUFLLEtBQUssRUFBTCxDQUFRLFVBQVIsSUFBc0IsTUFBTSxNQUFOLEdBQWUsaUJBQWlCLFNBQXZELElBRUksS0FBSyxFQUFMLENBQVEsUUFBUixDQUFpQixPQUFqQixDQUF5QixLQUF6QixJQUFrQyxDQUFDLENBQW5DLElBQ0EsTUFBTSxNQUFOLEdBQWUsTUFBTSxZQUFyQixHQUFvQyxDQUg1QyxFQUtFO0FBQ0Usc0JBQU0sTUFBTSxNQUFOLEdBQWUsTUFBTSxZQUEzQjtBQUNIOztBQUVELGlCQUFLLEVBQUwsQ0FBUSxLQUFSLENBQWMsSUFBZCxHQUFxQixPQUFPLElBQTVCO0FBQ0EsaUJBQUssRUFBTCxDQUFRLEtBQVIsQ0FBYyxHQUFkLEdBQW9CLE1BQU0sSUFBMUI7QUFDSCxTQW5aZTs7QUFxWmhCOzs7QUFHQSxnQkFBUSxnQkFBUyxJQUFULEVBQWUsS0FBZixFQUFzQixNQUF0QixFQUNSO0FBQ0ksZ0JBQUksT0FBUyxLQUFLLEVBQWxCO0FBQUEsZ0JBQ0ksTUFBUyxJQUFJLElBQUosRUFEYjtBQUFBLGdCQUVJLE9BQVMsZUFBZSxJQUFmLEVBQXFCLEtBQXJCLENBRmI7QUFBQSxnQkFHSSxTQUFTLElBQUksSUFBSixDQUFTLElBQVQsRUFBZSxLQUFmLEVBQXNCLENBQXRCLEVBQXlCLE1BQXpCLEVBSGI7QUFBQSxnQkFJSSxPQUFTLEVBSmI7QUFBQSxnQkFLSSxNQUFTLEVBTGI7QUFNQSw0QkFBZ0IsR0FBaEI7QUFDQSxnQkFBSSxLQUFLLFFBQUwsR0FBZ0IsQ0FBcEIsRUFBdUI7QUFDbkIsMEJBQVUsS0FBSyxRQUFmO0FBQ0Esb0JBQUksU0FBUyxDQUFiLEVBQWdCO0FBQ1osOEJBQVUsQ0FBVjtBQUNIO0FBQ0o7QUFDRCxnQkFBSSxnQkFBZ0IsVUFBVSxDQUFWLEdBQWMsRUFBZCxHQUFtQixRQUFRLENBQS9DO0FBQUEsZ0JBQ0ksWUFBWSxVQUFVLEVBQVYsR0FBZSxDQUFmLEdBQW1CLFFBQVEsQ0FEM0M7QUFBQSxnQkFFSSxzQkFBc0IsVUFBVSxDQUFWLEdBQWMsT0FBTyxDQUFyQixHQUF5QixJQUZuRDtBQUFBLGdCQUdJLGtCQUFrQixVQUFVLEVBQVYsR0FBZSxPQUFPLENBQXRCLEdBQTBCLElBSGhEO0FBQUEsZ0JBSUksc0JBQXNCLGVBQWUsbUJBQWYsRUFBb0MsYUFBcEMsQ0FKMUI7QUFLQSxnQkFBSSxRQUFRLE9BQU8sTUFBbkI7QUFBQSxnQkFDSSxRQUFRLEtBRFo7QUFFQSxtQkFBTSxRQUFRLENBQWQsRUFBaUI7QUFDYix5QkFBUyxDQUFUO0FBQ0g7QUFDRCxxQkFBUyxJQUFJLEtBQWI7QUFDQSxnQkFBSSxpQkFBaUIsS0FBckI7QUFDQSxpQkFBSyxJQUFJLElBQUksQ0FBUixFQUFXLElBQUksQ0FBcEIsRUFBdUIsSUFBSSxLQUEzQixFQUFrQyxHQUFsQyxFQUNBO0FBQ0ksb0JBQUksTUFBTSxJQUFJLElBQUosQ0FBUyxJQUFULEVBQWUsS0FBZixFQUFzQixLQUFLLElBQUksTUFBVCxDQUF0QixDQUFWO0FBQUEsb0JBQ0ksYUFBYSxPQUFPLEtBQUssRUFBWixJQUFrQixhQUFhLEdBQWIsRUFBa0IsS0FBSyxFQUF2QixDQUFsQixHQUErQyxLQURoRTtBQUFBLG9CQUVJLFVBQVUsYUFBYSxHQUFiLEVBQWtCLEdBQWxCLENBRmQ7QUFBQSxvQkFHSSxXQUFXLEtBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsSUFBSSxZQUFKLEVBQXBCLE1BQTRDLENBQUMsQ0FBN0MsR0FBaUQsSUFBakQsR0FBd0QsS0FIdkU7QUFBQSxvQkFJSSxVQUFVLElBQUksTUFBSixJQUFjLEtBQU0sT0FBTyxNQUp6QztBQUFBLG9CQUtJLFlBQVksS0FBSyxJQUFJLE1BQVQsQ0FMaEI7QUFBQSxvQkFNSSxjQUFjLEtBTmxCO0FBQUEsb0JBT0ksYUFBYSxJQVBqQjtBQUFBLG9CQVFJLGVBQWUsS0FBSyxVQUFMLElBQW1CLGFBQWEsS0FBSyxVQUFsQixFQUE4QixHQUE5QixDQVJ0QztBQUFBLG9CQVNJLGFBQWEsS0FBSyxRQUFMLElBQWlCLGFBQWEsS0FBSyxRQUFsQixFQUE0QixHQUE1QixDQVRsQztBQUFBLG9CQVVJLFlBQVksS0FBSyxVQUFMLElBQW1CLEtBQUssUUFBeEIsSUFBb0MsS0FBSyxVQUFMLEdBQWtCLEdBQXRELElBQTZELE1BQU0sS0FBSyxRQVZ4RjtBQUFBLG9CQVdJLGFBQWMsS0FBSyxPQUFMLElBQWdCLE1BQU0sS0FBSyxPQUE1QixJQUNDLEtBQUssT0FBTCxJQUFnQixNQUFNLEtBQUssT0FENUIsSUFFQyxLQUFLLGVBQUwsSUFBd0IsVUFBVSxHQUFWLENBRnpCLElBR0MsS0FBSyxZQUFMLElBQXFCLEtBQUssWUFBTCxDQUFrQixHQUFsQixDQWR2Qzs7QUFnQkEsb0JBQUksT0FBSixFQUFhO0FBQ1Qsd0JBQUksSUFBSSxNQUFSLEVBQWdCO0FBQ1osb0NBQVksc0JBQXNCLFNBQWxDO0FBQ0Esc0NBQWMsYUFBZDtBQUNBLHFDQUFhLG1CQUFiO0FBQ0gscUJBSkQsTUFJTztBQUNILG9DQUFZLFlBQVksSUFBeEI7QUFDQSxzQ0FBYyxTQUFkO0FBQ0EscUNBQWEsZUFBYjtBQUNIO0FBQ0o7O0FBRUQsb0JBQUksWUFBWTtBQUNSLHlCQUFLLFNBREc7QUFFUiwyQkFBTyxXQUZDO0FBR1IsMEJBQU0sVUFIRTtBQUlSLDhCQUFVLFFBSkY7QUFLUixnQ0FBWSxVQUxKO0FBTVIsNkJBQVMsT0FORDtBQU9SLGdDQUFZLFVBUEo7QUFRUiw2QkFBUyxPQVJEO0FBU1Isa0NBQWMsWUFUTjtBQVVSLGdDQUFZLFVBVko7QUFXUiwrQkFBVyxTQVhIO0FBWVIscURBQWlDLEtBQUssK0JBWjlCO0FBYVIsZ0VBQTRDLEtBQUs7QUFiekMsaUJBQWhCOztBQWdCQSxvQkFBSSxLQUFLLGFBQUwsSUFBc0IsVUFBMUIsRUFBc0M7QUFDbEMscUNBQWlCLElBQWpCO0FBQ0g7O0FBRUQsb0JBQUksSUFBSixDQUFTLFVBQVUsU0FBVixDQUFUOztBQUVBLG9CQUFJLEVBQUUsQ0FBRixLQUFRLENBQVosRUFBZTtBQUNYLHdCQUFJLEtBQUssY0FBVCxFQUF5QjtBQUNyQiw0QkFBSSxPQUFKLENBQVksV0FBVyxJQUFJLE1BQWYsRUFBdUIsS0FBdkIsRUFBOEIsSUFBOUIsQ0FBWjtBQUNIO0FBQ0QseUJBQUssSUFBTCxDQUFVLFVBQVUsR0FBVixFQUFlLEtBQUssS0FBcEIsRUFBMkIsS0FBSyxhQUFoQyxFQUErQyxjQUEvQyxDQUFWO0FBQ0EsMEJBQU0sRUFBTjtBQUNBLHdCQUFJLENBQUo7QUFDQSxxQ0FBaUIsS0FBakI7QUFDSDtBQUNKO0FBQ0QsbUJBQU8sWUFBWSxJQUFaLEVBQWtCLElBQWxCLEVBQXdCLE1BQXhCLENBQVA7QUFDSCxTQWxmZTs7QUFvZmhCLG1CQUFXLHFCQUNYO0FBQ0ksbUJBQU8sS0FBSyxFQUFaO0FBQ0gsU0F2ZmU7O0FBeWZoQixjQUFNLGdCQUNOO0FBQ0ksZ0JBQUksQ0FBQyxLQUFLLFNBQUwsRUFBTCxFQUF1QjtBQUNuQixxQkFBSyxFQUFMLEdBQVUsSUFBVjtBQUNBLHFCQUFLLElBQUw7QUFDQSw0QkFBWSxLQUFLLEVBQWpCLEVBQXFCLFdBQXJCO0FBQ0Esb0JBQUksS0FBSyxFQUFMLENBQVEsS0FBWixFQUFtQjtBQUNmLDZCQUFTLFFBQVQsRUFBbUIsT0FBbkIsRUFBNEIsS0FBSyxRQUFqQztBQUNBLHlCQUFLLGNBQUw7QUFDSDtBQUNELG9CQUFJLE9BQU8sS0FBSyxFQUFMLENBQVEsTUFBZixLQUEwQixVQUE5QixFQUEwQztBQUN0Qyx5QkFBSyxFQUFMLENBQVEsTUFBUixDQUFlLElBQWYsQ0FBb0IsSUFBcEI7QUFDSDtBQUNKO0FBQ0osU0F2Z0JlOztBQXlnQmhCLGNBQU0sZ0JBQ047QUFDSSxnQkFBSSxJQUFJLEtBQUssRUFBYjtBQUNBLGdCQUFJLE1BQU0sS0FBVixFQUFpQjtBQUNiLG9CQUFJLEtBQUssRUFBTCxDQUFRLEtBQVosRUFBbUI7QUFDZixnQ0FBWSxRQUFaLEVBQXNCLE9BQXRCLEVBQStCLEtBQUssUUFBcEM7QUFDSDtBQUNELHFCQUFLLEVBQUwsQ0FBUSxLQUFSLENBQWMsUUFBZCxHQUF5QixRQUF6QixDQUphLENBSXNCO0FBQ25DLHFCQUFLLEVBQUwsQ0FBUSxLQUFSLENBQWMsSUFBZCxHQUFxQixNQUFyQjtBQUNBLHFCQUFLLEVBQUwsQ0FBUSxLQUFSLENBQWMsR0FBZCxHQUFvQixNQUFwQjtBQUNBLHlCQUFTLEtBQUssRUFBZCxFQUFrQixXQUFsQjtBQUNBLHFCQUFLLEVBQUwsR0FBVSxLQUFWO0FBQ0Esb0JBQUksTUFBTSxTQUFOLElBQW1CLE9BQU8sS0FBSyxFQUFMLENBQVEsT0FBZixLQUEyQixVQUFsRCxFQUE4RDtBQUMxRCx5QkFBSyxFQUFMLENBQVEsT0FBUixDQUFnQixJQUFoQixDQUFxQixJQUFyQjtBQUNIO0FBQ0o7QUFDSixTQXpoQmU7O0FBMmhCaEI7OztBQUdBLGlCQUFTLG1CQUNUO0FBQ0ksZ0JBQUksT0FBTyxLQUFLLEVBQWhCOztBQUVBLGlCQUFLLElBQUw7QUFDQSx3QkFBWSxLQUFLLEVBQWpCLEVBQXFCLFdBQXJCLEVBQWtDLEtBQUssWUFBdkMsRUFBcUQsSUFBckQ7QUFDQSx3QkFBWSxLQUFLLEVBQWpCLEVBQXFCLFVBQXJCLEVBQWlDLEtBQUssWUFBdEMsRUFBb0QsSUFBcEQ7QUFDQSx3QkFBWSxLQUFLLEVBQWpCLEVBQXFCLFFBQXJCLEVBQStCLEtBQUssU0FBcEM7QUFDQSxnQkFBSSxLQUFLLGFBQVQsRUFBd0I7QUFDcEIsNEJBQVksUUFBWixFQUFzQixTQUF0QixFQUFpQyxLQUFLLFlBQXRDO0FBQ0g7QUFDRCxnQkFBSSxLQUFLLEtBQVQsRUFBZ0I7QUFDWiw0QkFBWSxLQUFLLEtBQWpCLEVBQXdCLFFBQXhCLEVBQWtDLEtBQUssY0FBdkM7QUFDQSxvQkFBSSxLQUFLLEtBQVQsRUFBZ0I7QUFDWixnQ0FBWSxLQUFLLE9BQWpCLEVBQTBCLE9BQTFCLEVBQW1DLEtBQUssYUFBeEM7QUFDQSxnQ0FBWSxLQUFLLE9BQWpCLEVBQTBCLE9BQTFCLEVBQW1DLEtBQUssYUFBeEM7QUFDQSxnQ0FBWSxLQUFLLE9BQWpCLEVBQTBCLE1BQTFCLEVBQWtDLEtBQUssWUFBdkM7QUFDSDtBQUNKO0FBQ0QsZ0JBQUksS0FBSyxFQUFMLENBQVEsVUFBWixFQUF3QjtBQUNwQixxQkFBSyxFQUFMLENBQVEsVUFBUixDQUFtQixXQUFuQixDQUErQixLQUFLLEVBQXBDO0FBQ0g7QUFDSjs7QUFwakJlLEtBQXBCOztBQXdqQkEsV0FBTyxPQUFQO0FBQ0gsQ0F0dENBLENBQUQ7Ozs7Ozs7O0FDTkE7Ozs7O0FBS0MsV0FBVSxNQUFWLEVBQWtCLE9BQWxCLEVBQTJCO0FBQzNCLFVBQU8sT0FBUCx5Q0FBTyxPQUFQLE9BQW1CLFFBQW5CLElBQStCLE9BQU8sTUFBUCxLQUFrQixXQUFqRCxHQUErRCxPQUFPLE9BQVAsR0FBaUIsU0FBaEYsR0FDQSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsT0FBTyxHQUF2QyxHQUE2QyxPQUFPLE9BQVAsQ0FBN0MsR0FDQyxPQUFPLEtBQVAsR0FBZSxTQUZoQjtBQUdBLENBSkEsYUFJUSxZQUFZO0FBQUU7O0FBRXZCLE1BQUksVUFBVSxPQUFkOztBQUVBLE1BQUksWUFBWSxPQUFPLE1BQVAsS0FBa0IsV0FBbEM7O0FBRUEsTUFBSSxPQUFPLGFBQWEsa0JBQWtCLElBQWxCLENBQXVCLFVBQVUsU0FBakMsQ0FBeEI7O0FBRUEsTUFBSSxVQUFVLEVBQWQ7O0FBRUEsTUFBSSxTQUFKLEVBQWU7QUFDYixZQUFRLFNBQVIsR0FBb0IsMkJBQTJCLE1BQS9DO0FBQ0EsWUFBUSxhQUFSLEdBQXdCLGtCQUFrQixNQUExQztBQUNBLFlBQVEsVUFBUixHQUFxQixLQUFyQjtBQUNBLFlBQVEscUJBQVIsR0FBZ0MsSUFBaEM7QUFDQSxZQUFRLEdBQVIsR0FBYyxtQkFBbUIsSUFBbkIsQ0FBd0IsVUFBVSxRQUFsQyxLQUErQyxDQUFDLE9BQU8sUUFBckU7QUFDQSxZQUFRLGlCQUFSLEdBQTRCLFlBQVksQ0FBRSxDQUExQztBQUNEOztBQUVEOzs7QUFHQSxNQUFJLFlBQVk7QUFDZCxZQUFRLGVBRE07QUFFZCxhQUFTLGdCQUZLO0FBR2QsYUFBUyxnQkFISztBQUlkLGNBQVUsaUJBSkk7QUFLZCxXQUFPLGNBTE87QUFNZCxpQkFBYSxtQkFOQztBQU9kLGVBQVc7QUFQRyxHQUFoQjs7QUFVQSxNQUFJLFdBQVc7QUFDYixlQUFXLEtBREU7QUFFYixtQkFBZSxJQUZGO0FBR2IsYUFBUyxrQkFISTtBQUliLGVBQVcsWUFKRTtBQUtiLFVBQU0sS0FMTztBQU1iLGlCQUFhLElBTkE7QUFPYixXQUFPLEtBUE07QUFRYixXQUFPLENBUk07QUFTYixjQUFVLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FURztBQVViLGlCQUFhLEtBVkE7QUFXYix1QkFBbUIsQ0FYTjtBQVliLFdBQU8sTUFaTTtBQWFiLFVBQU0sU0FiTztBQWNiLGNBQVUsRUFkRztBQWViLFlBQVEsQ0FmSztBQWdCYixpQkFBYSxJQWhCQTtBQWlCYixjQUFVLEtBakJHO0FBa0JiLGtCQUFjLEtBbEJEO0FBbUJiLGFBQVMsS0FuQkk7QUFvQmIsb0JBQWdCLEdBcEJIO0FBcUJiLFlBQVEsS0FyQks7QUFzQmIsY0FBVSxTQUFTLFFBQVQsR0FBb0I7QUFDNUIsYUFBTyxTQUFTLElBQWhCO0FBQ0QsS0F4Qlk7QUF5QmIsWUFBUSxJQXpCSztBQTBCYixlQUFXLEtBMUJFO0FBMkJiLGlCQUFhLEtBM0JBO0FBNEJiLGtCQUFjLEtBNUJEO0FBNkJiLFVBQU0sSUE3Qk87QUE4QmIsa0JBQWMsTUE5QkQ7QUErQmIsZUFBVyxPQS9CRTtBQWdDYixvQkFBZ0IsRUFoQ0g7QUFpQ2IsY0FBVSxFQWpDRztBQWtDYixZQUFRLElBbENLO0FBbUNiLG9CQUFnQixJQW5DSDtBQW9DYixtQkFBZSxFQXBDRjtBQXFDYixnQ0FBNEIsS0FyQ2Y7QUFzQ2IsWUFBUSxTQUFTLE1BQVQsR0FBa0IsQ0FBRSxDQXRDZjtBQXVDYixhQUFTLFNBQVMsT0FBVCxHQUFtQixDQUFFLENBdkNqQjtBQXdDYixZQUFRLFNBQVMsTUFBVCxHQUFrQixDQUFFLENBeENmO0FBeUNiLGNBQVUsU0FBUyxRQUFULEdBQW9CLENBQUU7QUF6Q25CLEdBQWY7O0FBNENBOzs7O0FBSUEsTUFBSSxlQUFlLFFBQVEsU0FBUixJQUFxQixPQUFPLElBQVAsQ0FBWSxRQUFaLENBQXhDOztBQUVBOzs7OztBQUtBLFdBQVMsZUFBVCxDQUF5QixLQUF6QixFQUFnQztBQUM5QixXQUFPLEdBQUcsUUFBSCxDQUFZLElBQVosQ0FBaUIsS0FBakIsTUFBNEIsaUJBQW5DO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsV0FBUyxPQUFULENBQWlCLEtBQWpCLEVBQXdCO0FBQ3RCLFdBQU8sR0FBRyxLQUFILENBQVMsSUFBVCxDQUFjLEtBQWQsQ0FBUDtBQUNEOztBQUVEOzs7OztBQUtBLFdBQVMsa0JBQVQsQ0FBNEIsUUFBNUIsRUFBc0M7QUFDcEMsUUFBSSxvQkFBb0IsT0FBcEIsSUFBK0IsZ0JBQWdCLFFBQWhCLENBQW5DLEVBQThEO0FBQzVELGFBQU8sQ0FBQyxRQUFELENBQVA7QUFDRDs7QUFFRCxRQUFJLG9CQUFvQixRQUF4QixFQUFrQztBQUNoQyxhQUFPLFFBQVEsUUFBUixDQUFQO0FBQ0Q7O0FBRUQsUUFBSSxNQUFNLE9BQU4sQ0FBYyxRQUFkLENBQUosRUFBNkI7QUFDM0IsYUFBTyxRQUFQO0FBQ0Q7O0FBRUQsUUFBSTtBQUNGLGFBQU8sUUFBUSxTQUFTLGdCQUFULENBQTBCLFFBQTFCLENBQVIsQ0FBUDtBQUNELEtBRkQsQ0FFRSxPQUFPLENBQVAsRUFBVTtBQUNWLGFBQU8sRUFBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7O0FBS0EsV0FBUyw2QkFBVCxDQUF1QyxTQUF2QyxFQUFrRDtBQUNoRCxjQUFVLE1BQVYsR0FBbUIsSUFBbkI7QUFDQSxjQUFVLFVBQVYsR0FBdUIsVUFBVSxVQUFWLElBQXdCLEVBQS9DO0FBQ0EsY0FBVSxZQUFWLEdBQXlCLFVBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0I7QUFDM0MsZ0JBQVUsVUFBVixDQUFxQixHQUFyQixJQUE0QixHQUE1QjtBQUNELEtBRkQ7QUFHQSxjQUFVLFlBQVYsR0FBeUIsVUFBVSxHQUFWLEVBQWU7QUFDdEMsYUFBTyxVQUFVLFVBQVYsQ0FBcUIsR0FBckIsQ0FBUDtBQUNELEtBRkQ7QUFHQSxjQUFVLGVBQVYsR0FBNEIsVUFBVSxHQUFWLEVBQWU7QUFDekMsYUFBTyxVQUFVLFVBQVYsQ0FBcUIsR0FBckIsQ0FBUDtBQUNELEtBRkQ7QUFHQSxjQUFVLFlBQVYsR0FBeUIsVUFBVSxHQUFWLEVBQWU7QUFDdEMsYUFBTyxPQUFPLFVBQVUsVUFBeEI7QUFDRCxLQUZEO0FBR0EsY0FBVSxnQkFBVixHQUE2QixZQUFZLENBQUUsQ0FBM0M7QUFDQSxjQUFVLG1CQUFWLEdBQWdDLFlBQVksQ0FBRSxDQUE5QztBQUNBLGNBQVUsU0FBVixHQUFzQjtBQUNwQixrQkFBWSxFQURRO0FBRXBCLFdBQUssU0FBUyxHQUFULENBQWEsR0FBYixFQUFrQjtBQUNyQixlQUFPLFVBQVUsU0FBVixDQUFvQixVQUFwQixDQUErQixHQUEvQixJQUFzQyxJQUE3QztBQUNELE9BSm1CO0FBS3BCLGNBQVEsU0FBUyxNQUFULENBQWdCLEdBQWhCLEVBQXFCO0FBQzNCLGVBQU8sVUFBVSxTQUFWLENBQW9CLFVBQXBCLENBQStCLEdBQS9CLENBQVA7QUFDQSxlQUFPLElBQVA7QUFDRCxPQVJtQjtBQVNwQixnQkFBVSxTQUFTLFFBQVQsQ0FBa0IsR0FBbEIsRUFBdUI7QUFDL0IsZUFBTyxPQUFPLFVBQVUsU0FBVixDQUFvQixVQUFsQztBQUNEO0FBWG1CLEtBQXRCO0FBYUQ7O0FBRUQ7Ozs7O0FBS0EsV0FBUyxNQUFULENBQWdCLFFBQWhCLEVBQTBCO0FBQ3hCLFFBQUksV0FBVyxDQUFDLEVBQUQsRUFBSyxRQUFMLENBQWY7QUFDQSxRQUFJLFlBQVksU0FBUyxNQUFULENBQWdCLENBQWhCLEVBQW1CLFdBQW5CLEtBQW1DLFNBQVMsS0FBVCxDQUFlLENBQWYsQ0FBbkQ7O0FBRUEsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFNBQVMsTUFBN0IsRUFBcUMsR0FBckMsRUFBMEM7QUFDeEMsVUFBSSxVQUFVLFNBQVMsQ0FBVCxDQUFkO0FBQ0EsVUFBSSxlQUFlLFVBQVUsVUFBVSxTQUFwQixHQUFnQyxRQUFuRDtBQUNBLFVBQUksT0FBTyxTQUFTLElBQVQsQ0FBYyxLQUFkLENBQW9CLFlBQXBCLENBQVAsS0FBNkMsV0FBakQsRUFBOEQ7QUFDNUQsZUFBTyxZQUFQO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPLElBQVA7QUFDRDs7QUFFRDs7OztBQUlBLFdBQVMsR0FBVCxHQUFlO0FBQ2IsV0FBTyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7O0FBT0EsV0FBUyxtQkFBVCxDQUE2QixFQUE3QixFQUFpQyxLQUFqQyxFQUF3QyxPQUF4QyxFQUFpRDtBQUMvQyxRQUFJLFNBQVMsS0FBYjtBQUNBLFdBQU8sWUFBUCxDQUFvQixPQUFwQixFQUE2QixjQUE3QjtBQUNBLFdBQU8sWUFBUCxDQUFvQixNQUFwQixFQUE0QixTQUE1QjtBQUNBLFdBQU8sWUFBUCxDQUFvQixJQUFwQixFQUEwQixXQUFXLEVBQXJDO0FBQ0EsV0FBTyxLQUFQLENBQWEsTUFBYixHQUFzQixRQUFRLE1BQTlCO0FBQ0EsV0FBTyxLQUFQLENBQWEsUUFBYixHQUF3QixRQUFRLFFBQWhDOztBQUVBLFFBQUksVUFBVSxLQUFkO0FBQ0EsWUFBUSxZQUFSLENBQXFCLE9BQXJCLEVBQThCLGVBQTlCO0FBQ0EsWUFBUSxZQUFSLENBQXFCLFdBQXJCLEVBQWtDLFFBQVEsSUFBMUM7QUFDQSxZQUFRLFlBQVIsQ0FBcUIsZ0JBQXJCLEVBQXVDLFFBQVEsU0FBL0M7QUFDQSxZQUFRLFlBQVIsQ0FBcUIsWUFBckIsRUFBbUMsUUFBbkM7QUFDQSxZQUFRLEtBQVIsQ0FBYyxLQUFkLENBQW9CLEdBQXBCLEVBQXlCLE9BQXpCLENBQWlDLFVBQVUsQ0FBVixFQUFhO0FBQzVDLGNBQVEsU0FBUixDQUFrQixHQUFsQixDQUFzQixJQUFJLFFBQTFCO0FBQ0QsS0FGRDs7QUFJQSxRQUFJLFVBQVUsS0FBZDtBQUNBLFlBQVEsWUFBUixDQUFxQixPQUFyQixFQUE4QixlQUE5Qjs7QUFFQSxRQUFJLFFBQVEsS0FBWixFQUFtQjtBQUNqQixVQUFJLFFBQVEsS0FBWjtBQUNBLFlBQU0sS0FBTixDQUFZLE9BQU8sV0FBUCxDQUFaLElBQW1DLFFBQVEsY0FBM0M7O0FBRUEsVUFBSSxRQUFRLFNBQVIsS0FBc0IsT0FBMUIsRUFBbUM7QUFDakMsY0FBTSxTQUFOLENBQWdCLEdBQWhCLENBQW9CLGtCQUFwQjtBQUNBLGNBQU0sU0FBTixHQUFrQixxTUFBbEI7QUFDRCxPQUhELE1BR087QUFDTCxjQUFNLFNBQU4sQ0FBZ0IsR0FBaEIsQ0FBb0IsYUFBcEI7QUFDRDs7QUFFRCxjQUFRLFdBQVIsQ0FBb0IsS0FBcEI7QUFDRDs7QUFFRCxRQUFJLFFBQVEsV0FBWixFQUF5QjtBQUN2QjtBQUNBLGNBQVEsWUFBUixDQUFxQixrQkFBckIsRUFBeUMsRUFBekM7QUFDQSxVQUFJLFdBQVcsS0FBZjtBQUNBLGVBQVMsU0FBVCxDQUFtQixHQUFuQixDQUF1QixnQkFBdkI7QUFDQSxlQUFTLFlBQVQsQ0FBc0IsWUFBdEIsRUFBb0MsUUFBcEM7QUFDQSxjQUFRLFdBQVIsQ0FBb0IsUUFBcEI7QUFDRDs7QUFFRCxRQUFJLFFBQVEsT0FBWixFQUFxQjtBQUNuQjtBQUNBLGNBQVEsWUFBUixDQUFxQixjQUFyQixFQUFxQyxFQUFyQztBQUNEOztBQUVELFFBQUksUUFBUSxXQUFaLEVBQXlCO0FBQ3ZCLGNBQVEsWUFBUixDQUFxQixrQkFBckIsRUFBeUMsRUFBekM7QUFDRDs7QUFFRCxRQUFJLE9BQU8sUUFBUSxJQUFuQjtBQUNBLFFBQUksSUFBSixFQUFVO0FBQ1IsVUFBSSxhQUFhLEtBQUssQ0FBdEI7O0FBRUEsVUFBSSxnQkFBZ0IsT0FBcEIsRUFBNkI7QUFDM0IsZ0JBQVEsV0FBUixDQUFvQixJQUFwQjtBQUNBLHFCQUFhLE9BQU8sS0FBSyxFQUFMLElBQVcscUJBQWxCLENBQWI7QUFDRCxPQUhELE1BR087QUFDTDtBQUNBLGdCQUFRLFFBQVEsV0FBaEIsSUFBK0IsU0FBUyxhQUFULENBQXVCLElBQXZCLEVBQTZCLFFBQVEsV0FBckMsQ0FBL0I7QUFDQSxxQkFBYSxJQUFiO0FBQ0Q7O0FBRUQsYUFBTyxZQUFQLENBQW9CLFdBQXBCLEVBQWlDLEVBQWpDO0FBQ0EsY0FBUSxZQUFSLENBQXFCLGtCQUFyQixFQUF5QyxVQUF6Qzs7QUFFQSxVQUFJLFFBQVEsV0FBWixFQUF5QjtBQUN2QixlQUFPLFlBQVAsQ0FBb0IsVUFBcEIsRUFBZ0MsSUFBaEM7QUFDRDtBQUNGLEtBbEJELE1Ba0JPO0FBQ0wsY0FBUSxRQUFRLGNBQVIsR0FBeUIsV0FBekIsR0FBdUMsYUFBL0MsSUFBZ0UsS0FBaEU7QUFDRDs7QUFFRCxZQUFRLFdBQVIsQ0FBb0IsT0FBcEI7QUFDQSxXQUFPLFdBQVAsQ0FBbUIsT0FBbkI7O0FBRUEsV0FBTyxNQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O0FBUUEsV0FBUyxhQUFULENBQXVCLFNBQXZCLEVBQWtDLFNBQWxDLEVBQTZDLFFBQTdDLEVBQXVELE9BQXZELEVBQWdFO0FBQzlELFFBQUksWUFBWSxTQUFTLFNBQXpCO0FBQUEsUUFDSSxlQUFlLFNBQVMsWUFENUI7QUFBQSxRQUVJLFNBQVMsU0FBUyxNQUZ0QjtBQUFBLFFBR0ksaUJBQWlCLFNBQVMsY0FIOUI7QUFBQSxRQUlJLGlCQUFpQixTQUFTLGNBSjlCOztBQU1BLFFBQUksWUFBWSxFQUFoQjs7QUFFQSxRQUFJLGNBQWMsUUFBbEIsRUFBNEIsT0FBTyxTQUFQOztBQUU1QixRQUFJLEtBQUssU0FBUyxFQUFULENBQVksU0FBWixFQUF1QixPQUF2QixFQUFnQztBQUN2QyxnQkFBVSxnQkFBVixDQUEyQixTQUEzQixFQUFzQyxPQUF0QztBQUNBLGdCQUFVLElBQVYsQ0FBZSxFQUFFLE9BQU8sU0FBVCxFQUFvQixTQUFTLE9BQTdCLEVBQWY7QUFDRCxLQUhEOztBQUtBLFFBQUksQ0FBQyxRQUFRLE1BQWIsRUFBcUI7QUFDbkIsU0FBRyxTQUFILEVBQWMsU0FBZDs7QUFFQSxVQUFJLFFBQVEsYUFBUixJQUF5QixRQUFRLFNBQXJDLEVBQWdEO0FBQzlDLFdBQUcsWUFBSCxFQUFpQixTQUFqQjtBQUNBLFdBQUcsVUFBSCxFQUFlLFlBQWY7QUFDRDtBQUNELFVBQUksY0FBYyxZQUFsQixFQUFnQztBQUM5QixXQUFHLFlBQUgsRUFBaUIsWUFBakI7QUFDRDtBQUNELFVBQUksY0FBYyxPQUFsQixFQUEyQjtBQUN6QixXQUFHLE9BQU8sVUFBUCxHQUFvQixNQUF2QixFQUErQixNQUEvQjtBQUNEO0FBQ0YsS0FiRCxNQWFPO0FBQ0wsVUFBSSxRQUFRLGFBQVIsSUFBeUIsUUFBUSxTQUFyQyxFQUFnRDtBQUM5QyxXQUFHLFlBQUgsRUFBaUIsY0FBakI7QUFDQSxXQUFHLFVBQUgsRUFBZSxjQUFmO0FBQ0Q7QUFDRCxVQUFJLGNBQWMsWUFBbEIsRUFBZ0M7QUFDOUIsV0FBRyxXQUFILEVBQWdCLGNBQWhCO0FBQ0EsV0FBRyxVQUFILEVBQWUsY0FBZjtBQUNEO0FBQ0QsVUFBSSxjQUFjLE9BQWxCLEVBQTJCO0FBQ3pCLFdBQUcsU0FBSCxFQUFjLGNBQWQ7QUFDQSxXQUFHLFVBQUgsRUFBZSxjQUFmO0FBQ0Q7QUFDRCxVQUFJLGNBQWMsT0FBbEIsRUFBMkI7QUFDekIsV0FBRyxPQUFILEVBQVksY0FBWjtBQUNEO0FBQ0Y7O0FBRUQsV0FBTyxTQUFQO0FBQ0Q7O0FBRUQsTUFBSSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBVSxRQUFWLEVBQW9CLFdBQXBCLEVBQWlDO0FBQ3BELFFBQUksRUFBRSxvQkFBb0IsV0FBdEIsQ0FBSixFQUF3QztBQUN0QyxZQUFNLElBQUksU0FBSixDQUFjLG1DQUFkLENBQU47QUFDRDtBQUNGLEdBSkQ7O0FBTUEsTUFBSSxjQUFjLFlBQVk7QUFDNUIsYUFBUyxnQkFBVCxDQUEwQixNQUExQixFQUFrQyxLQUFsQyxFQUF5QztBQUN2QyxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQyxZQUFJLGFBQWEsTUFBTSxDQUFOLENBQWpCO0FBQ0EsbUJBQVcsVUFBWCxHQUF3QixXQUFXLFVBQVgsSUFBeUIsS0FBakQ7QUFDQSxtQkFBVyxZQUFYLEdBQTBCLElBQTFCO0FBQ0EsWUFBSSxXQUFXLFVBQWYsRUFBMkIsV0FBVyxRQUFYLEdBQXNCLElBQXRCO0FBQzNCLGVBQU8sY0FBUCxDQUFzQixNQUF0QixFQUE4QixXQUFXLEdBQXpDLEVBQThDLFVBQTlDO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPLFVBQVUsV0FBVixFQUF1QixVQUF2QixFQUFtQyxXQUFuQyxFQUFnRDtBQUNyRCxVQUFJLFVBQUosRUFBZ0IsaUJBQWlCLFlBQVksU0FBN0IsRUFBd0MsVUFBeEM7QUFDaEIsVUFBSSxXQUFKLEVBQWlCLGlCQUFpQixXQUFqQixFQUE4QixXQUE5QjtBQUNqQixhQUFPLFdBQVA7QUFDRCxLQUpEO0FBS0QsR0FoQmlCLEVBQWxCOztBQXdCQSxNQUFJLFdBQVcsT0FBTyxNQUFQLElBQWlCLFVBQVUsTUFBVixFQUFrQjtBQUNoRCxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksVUFBVSxNQUE5QixFQUFzQyxHQUF0QyxFQUEyQztBQUN6QyxVQUFJLFNBQVMsVUFBVSxDQUFWLENBQWI7O0FBRUEsV0FBSyxJQUFJLEdBQVQsSUFBZ0IsTUFBaEIsRUFBd0I7QUFDdEIsWUFBSSxPQUFPLFNBQVAsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBcUMsTUFBckMsRUFBNkMsR0FBN0MsQ0FBSixFQUF1RDtBQUNyRCxpQkFBTyxHQUFQLElBQWMsT0FBTyxHQUFQLENBQWQ7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsV0FBTyxNQUFQO0FBQ0QsR0FaRDs7QUFjQTs7Ozs7O0FBTUEsV0FBUyxvQkFBVCxDQUE4QixTQUE5QixFQUF5QyxlQUF6QyxFQUEwRDtBQUN4RCxRQUFJLFVBQVUsYUFBYSxNQUFiLENBQW9CLFVBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0I7QUFDcEQsVUFBSSxNQUFNLFVBQVUsWUFBVixDQUF1QixnQkFBZ0IsSUFBSSxXQUFKLEVBQXZDLEtBQTZELGdCQUFnQixHQUFoQixDQUF2RTs7QUFFQTtBQUNBLFVBQUksUUFBUSxPQUFaLEVBQXFCLE1BQU0sS0FBTjtBQUNyQixVQUFJLFFBQVEsTUFBWixFQUFvQixNQUFNLElBQU47O0FBRXBCO0FBQ0EsVUFBSSxTQUFTLEdBQVQsS0FBaUIsQ0FBQyxNQUFNLFdBQVcsR0FBWCxDQUFOLENBQXRCLEVBQThDO0FBQzVDLGNBQU0sV0FBVyxHQUFYLENBQU47QUFDRDs7QUFFRDtBQUNBLFVBQUksUUFBUSxRQUFSLElBQW9CLE9BQU8sR0FBUCxLQUFlLFFBQW5DLElBQStDLElBQUksSUFBSixHQUFXLE1BQVgsQ0FBa0IsQ0FBbEIsTUFBeUIsR0FBNUUsRUFBaUY7QUFDL0UsY0FBTSxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQU47QUFDRDs7QUFFRCxVQUFJLEdBQUosSUFBVyxHQUFYOztBQUVBLGFBQU8sR0FBUDtBQUNELEtBcEJhLEVBb0JYLEVBcEJXLENBQWQ7O0FBc0JBLFdBQU8sU0FBUyxFQUFULEVBQWEsZUFBYixFQUE4QixPQUE5QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7OztBQU1BLFdBQVMsZUFBVCxDQUF5QixTQUF6QixFQUFvQyxPQUFwQyxFQUE2QztBQUMzQztBQUNBLFFBQUksUUFBUSxLQUFaLEVBQW1CO0FBQ2pCLGNBQVEsV0FBUixHQUFzQixLQUF0QjtBQUNEOztBQUVELFFBQUksUUFBUSxRQUFSLElBQW9CLE9BQU8sUUFBUSxRQUFmLEtBQTRCLFVBQXBELEVBQWdFO0FBQzlELGNBQVEsUUFBUixHQUFtQixRQUFRLFFBQVIsRUFBbkI7QUFDRDs7QUFFRCxRQUFJLE9BQU8sUUFBUSxJQUFmLEtBQXdCLFVBQTVCLEVBQXdDO0FBQ3RDLGNBQVEsSUFBUixHQUFlLFFBQVEsSUFBUixDQUFhLFNBQWIsQ0FBZjtBQUNEOztBQUVELFdBQU8sT0FBUDtBQUNEOztBQUVEOzs7OztBQUtBLFdBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0M7QUFDaEMsUUFBSSxTQUFTLFNBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFtQjtBQUM5QixhQUFPLE9BQU8sYUFBUCxDQUFxQixDQUFyQixDQUFQO0FBQ0QsS0FGRDtBQUdBLFdBQU87QUFDTCxlQUFTLE9BQU8sVUFBVSxPQUFqQixDQURKO0FBRUwsZ0JBQVUsT0FBTyxVQUFVLFFBQWpCLENBRkw7QUFHTCxlQUFTLE9BQU8sVUFBVSxPQUFqQixDQUhKO0FBSUwsYUFBTyxPQUFPLFVBQVUsS0FBakIsS0FBMkIsT0FBTyxVQUFVLFdBQWpCO0FBSjdCLEtBQVA7QUFNRDs7QUFFRDs7Ozs7QUFLQSxXQUFTLFdBQVQsQ0FBcUIsRUFBckIsRUFBeUI7QUFDdkIsUUFBSSxRQUFRLEdBQUcsWUFBSCxDQUFnQixPQUFoQixDQUFaO0FBQ0E7QUFDQSxRQUFJLEtBQUosRUFBVztBQUNULFNBQUcsWUFBSCxDQUFnQixxQkFBaEIsRUFBdUMsS0FBdkM7QUFDRDtBQUNELE9BQUcsZUFBSCxDQUFtQixPQUFuQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QkEsTUFBSSxjQUFjLE9BQU8sTUFBUCxLQUFrQixXQUFsQixJQUFpQyxPQUFPLFFBQVAsS0FBb0IsV0FBdkU7O0FBRUEsTUFBSSx3QkFBd0IsQ0FBQyxNQUFELEVBQVMsU0FBVCxFQUFvQixTQUFwQixDQUE1QjtBQUNBLE1BQUksa0JBQWtCLENBQXRCO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLHNCQUFzQixNQUExQyxFQUFrRCxLQUFLLENBQXZELEVBQTBEO0FBQ3hELFFBQUksZUFBZSxVQUFVLFNBQVYsQ0FBb0IsT0FBcEIsQ0FBNEIsc0JBQXNCLENBQXRCLENBQTVCLEtBQXlELENBQTVFLEVBQStFO0FBQzdFLHdCQUFrQixDQUFsQjtBQUNBO0FBQ0Q7QUFDRjs7QUFFRCxXQUFTLGlCQUFULENBQTJCLEVBQTNCLEVBQStCO0FBQzdCLFFBQUksU0FBUyxLQUFiO0FBQ0EsV0FBTyxZQUFZO0FBQ2pCLFVBQUksTUFBSixFQUFZO0FBQ1Y7QUFDRDtBQUNELGVBQVMsSUFBVDtBQUNBLGFBQU8sT0FBUCxDQUFlLE9BQWYsR0FBeUIsSUFBekIsQ0FBOEIsWUFBWTtBQUN4QyxpQkFBUyxLQUFUO0FBQ0E7QUFDRCxPQUhEO0FBSUQsS0FURDtBQVVEOztBQUVELFdBQVMsWUFBVCxDQUFzQixFQUF0QixFQUEwQjtBQUN4QixRQUFJLFlBQVksS0FBaEI7QUFDQSxXQUFPLFlBQVk7QUFDakIsVUFBSSxDQUFDLFNBQUwsRUFBZ0I7QUFDZCxvQkFBWSxJQUFaO0FBQ0EsbUJBQVcsWUFBWTtBQUNyQixzQkFBWSxLQUFaO0FBQ0E7QUFDRCxTQUhELEVBR0csZUFISDtBQUlEO0FBQ0YsS0FSRDtBQVNEOztBQUVELE1BQUkscUJBQXFCLGVBQWUsT0FBTyxPQUEvQzs7QUFFQTs7Ozs7Ozs7O0FBU0EsTUFBSSxXQUFXLHFCQUFxQixpQkFBckIsR0FBeUMsWUFBeEQ7O0FBRUE7Ozs7Ozs7QUFPQSxXQUFTLFVBQVQsQ0FBb0IsZUFBcEIsRUFBcUM7QUFDbkMsUUFBSSxVQUFVLEVBQWQ7QUFDQSxXQUFPLG1CQUFtQixRQUFRLFFBQVIsQ0FBaUIsSUFBakIsQ0FBc0IsZUFBdEIsTUFBMkMsbUJBQXJFO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxXQUFTLHdCQUFULENBQWtDLE9BQWxDLEVBQTJDLFFBQTNDLEVBQXFEO0FBQ25ELFFBQUksUUFBUSxRQUFSLEtBQXFCLENBQXpCLEVBQTRCO0FBQzFCLGFBQU8sRUFBUDtBQUNEO0FBQ0Q7QUFDQSxRQUFJLE1BQU0saUJBQWlCLE9BQWpCLEVBQTBCLElBQTFCLENBQVY7QUFDQSxXQUFPLFdBQVcsSUFBSSxRQUFKLENBQVgsR0FBMkIsR0FBbEM7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFdBQVMsYUFBVCxDQUF1QixPQUF2QixFQUFnQztBQUM5QixRQUFJLFFBQVEsUUFBUixLQUFxQixNQUF6QixFQUFpQztBQUMvQixhQUFPLE9BQVA7QUFDRDtBQUNELFdBQU8sUUFBUSxVQUFSLElBQXNCLFFBQVEsSUFBckM7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFdBQVMsZUFBVCxDQUF5QixPQUF6QixFQUFrQztBQUNoQztBQUNBLFFBQUksQ0FBQyxPQUFMLEVBQWM7QUFDWixhQUFPLFNBQVMsSUFBaEI7QUFDRDs7QUFFRCxZQUFRLFFBQVEsUUFBaEI7QUFDRSxXQUFLLE1BQUw7QUFDQSxXQUFLLE1BQUw7QUFDRSxlQUFPLFFBQVEsYUFBUixDQUFzQixJQUE3QjtBQUNGLFdBQUssV0FBTDtBQUNFLGVBQU8sUUFBUSxJQUFmO0FBTEo7O0FBUUE7O0FBRUEsUUFBSSx3QkFBd0IseUJBQXlCLE9BQXpCLENBQTVCO0FBQUEsUUFDSSxXQUFXLHNCQUFzQixRQURyQztBQUFBLFFBRUksWUFBWSxzQkFBc0IsU0FGdEM7QUFBQSxRQUdJLFlBQVksc0JBQXNCLFNBSHRDOztBQUtBLFFBQUksd0JBQXdCLElBQXhCLENBQTZCLFdBQVcsU0FBWCxHQUF1QixTQUFwRCxDQUFKLEVBQW9FO0FBQ2xFLGFBQU8sT0FBUDtBQUNEOztBQUVELFdBQU8sZ0JBQWdCLGNBQWMsT0FBZCxDQUFoQixDQUFQO0FBQ0Q7O0FBRUQsTUFBSSxTQUFTLGVBQWUsQ0FBQyxFQUFFLE9BQU8sb0JBQVAsSUFBK0IsU0FBUyxZQUExQyxDQUE3QjtBQUNBLE1BQUksU0FBUyxlQUFlLFVBQVUsSUFBVixDQUFlLFVBQVUsU0FBekIsQ0FBNUI7O0FBRUE7Ozs7Ozs7QUFPQSxXQUFTLE1BQVQsQ0FBZ0IsT0FBaEIsRUFBeUI7QUFDdkIsUUFBSSxZQUFZLEVBQWhCLEVBQW9CO0FBQ2xCLGFBQU8sTUFBUDtBQUNEO0FBQ0QsUUFBSSxZQUFZLEVBQWhCLEVBQW9CO0FBQ2xCLGFBQU8sTUFBUDtBQUNEO0FBQ0QsV0FBTyxVQUFVLE1BQWpCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxXQUFTLGVBQVQsQ0FBeUIsT0FBekIsRUFBa0M7QUFDaEMsUUFBSSxDQUFDLE9BQUwsRUFBYztBQUNaLGFBQU8sU0FBUyxlQUFoQjtBQUNEOztBQUVELFFBQUksaUJBQWlCLE9BQU8sRUFBUCxJQUFhLFNBQVMsSUFBdEIsR0FBNkIsSUFBbEQ7O0FBRUE7QUFDQSxRQUFJLGVBQWUsUUFBUSxZQUEzQjtBQUNBO0FBQ0EsV0FBTyxpQkFBaUIsY0FBakIsSUFBbUMsUUFBUSxrQkFBbEQsRUFBc0U7QUFDcEUscUJBQWUsQ0FBQyxVQUFVLFFBQVEsa0JBQW5CLEVBQXVDLFlBQXREO0FBQ0Q7O0FBRUQsUUFBSSxXQUFXLGdCQUFnQixhQUFhLFFBQTVDOztBQUVBLFFBQUksQ0FBQyxRQUFELElBQWEsYUFBYSxNQUExQixJQUFvQyxhQUFhLE1BQXJELEVBQTZEO0FBQzNELGFBQU8sVUFBVSxRQUFRLGFBQVIsQ0FBc0IsZUFBaEMsR0FBa0QsU0FBUyxlQUFsRTtBQUNEOztBQUVEO0FBQ0E7QUFDQSxRQUFJLENBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsT0FBaEIsQ0FBd0IsYUFBYSxRQUFyQyxNQUFtRCxDQUFDLENBQXBELElBQXlELHlCQUF5QixZQUF6QixFQUF1QyxVQUF2QyxNQUF1RCxRQUFwSCxFQUE4SDtBQUM1SCxhQUFPLGdCQUFnQixZQUFoQixDQUFQO0FBQ0Q7O0FBRUQsV0FBTyxZQUFQO0FBQ0Q7O0FBRUQsV0FBUyxpQkFBVCxDQUEyQixPQUEzQixFQUFvQztBQUNsQyxRQUFJLFdBQVcsUUFBUSxRQUF2Qjs7QUFFQSxRQUFJLGFBQWEsTUFBakIsRUFBeUI7QUFDdkIsYUFBTyxLQUFQO0FBQ0Q7QUFDRCxXQUFPLGFBQWEsTUFBYixJQUF1QixnQkFBZ0IsUUFBUSxpQkFBeEIsTUFBK0MsT0FBN0U7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFdBQVMsT0FBVCxDQUFpQixJQUFqQixFQUF1QjtBQUNyQixRQUFJLEtBQUssVUFBTCxLQUFvQixJQUF4QixFQUE4QjtBQUM1QixhQUFPLFFBQVEsS0FBSyxVQUFiLENBQVA7QUFDRDs7QUFFRCxXQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7QUFRQSxXQUFTLHNCQUFULENBQWdDLFFBQWhDLEVBQTBDLFFBQTFDLEVBQW9EO0FBQ2xEO0FBQ0EsUUFBSSxDQUFDLFFBQUQsSUFBYSxDQUFDLFNBQVMsUUFBdkIsSUFBbUMsQ0FBQyxRQUFwQyxJQUFnRCxDQUFDLFNBQVMsUUFBOUQsRUFBd0U7QUFDdEUsYUFBTyxTQUFTLGVBQWhCO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFJLFFBQVEsU0FBUyx1QkFBVCxDQUFpQyxRQUFqQyxJQUE2QyxLQUFLLDJCQUE5RDtBQUNBLFFBQUksUUFBUSxRQUFRLFFBQVIsR0FBbUIsUUFBL0I7QUFDQSxRQUFJLE1BQU0sUUFBUSxRQUFSLEdBQW1CLFFBQTdCOztBQUVBO0FBQ0EsUUFBSSxRQUFRLFNBQVMsV0FBVCxFQUFaO0FBQ0EsVUFBTSxRQUFOLENBQWUsS0FBZixFQUFzQixDQUF0QjtBQUNBLFVBQU0sTUFBTixDQUFhLEdBQWIsRUFBa0IsQ0FBbEI7QUFDQSxRQUFJLDBCQUEwQixNQUFNLHVCQUFwQzs7QUFFQTs7QUFFQSxRQUFJLGFBQWEsdUJBQWIsSUFBd0MsYUFBYSx1QkFBckQsSUFBZ0YsTUFBTSxRQUFOLENBQWUsR0FBZixDQUFwRixFQUF5RztBQUN2RyxVQUFJLGtCQUFrQix1QkFBbEIsQ0FBSixFQUFnRDtBQUM5QyxlQUFPLHVCQUFQO0FBQ0Q7O0FBRUQsYUFBTyxnQkFBZ0IsdUJBQWhCLENBQVA7QUFDRDs7QUFFRDtBQUNBLFFBQUksZUFBZSxRQUFRLFFBQVIsQ0FBbkI7QUFDQSxRQUFJLGFBQWEsSUFBakIsRUFBdUI7QUFDckIsYUFBTyx1QkFBdUIsYUFBYSxJQUFwQyxFQUEwQyxRQUExQyxDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsYUFBTyx1QkFBdUIsUUFBdkIsRUFBaUMsUUFBUSxRQUFSLEVBQWtCLElBQW5ELENBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7OztBQVFBLFdBQVMsU0FBVCxDQUFtQixPQUFuQixFQUE0QjtBQUMxQixRQUFJLE9BQU8sVUFBVSxNQUFWLEdBQW1CLENBQW5CLElBQXdCLFVBQVUsQ0FBVixNQUFpQixTQUF6QyxHQUFxRCxVQUFVLENBQVYsQ0FBckQsR0FBb0UsS0FBL0U7O0FBRUEsUUFBSSxZQUFZLFNBQVMsS0FBVCxHQUFpQixXQUFqQixHQUErQixZQUEvQztBQUNBLFFBQUksV0FBVyxRQUFRLFFBQXZCOztBQUVBLFFBQUksYUFBYSxNQUFiLElBQXVCLGFBQWEsTUFBeEMsRUFBZ0Q7QUFDOUMsVUFBSSxPQUFPLFFBQVEsYUFBUixDQUFzQixlQUFqQztBQUNBLFVBQUksbUJBQW1CLFFBQVEsYUFBUixDQUFzQixnQkFBdEIsSUFBMEMsSUFBakU7QUFDQSxhQUFPLGlCQUFpQixTQUFqQixDQUFQO0FBQ0Q7O0FBRUQsV0FBTyxRQUFRLFNBQVIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7QUFTQSxXQUFTLGFBQVQsQ0FBdUIsSUFBdkIsRUFBNkIsT0FBN0IsRUFBc0M7QUFDcEMsUUFBSSxXQUFXLFVBQVUsTUFBVixHQUFtQixDQUFuQixJQUF3QixVQUFVLENBQVYsTUFBaUIsU0FBekMsR0FBcUQsVUFBVSxDQUFWLENBQXJELEdBQW9FLEtBQW5GOztBQUVBLFFBQUksWUFBWSxVQUFVLE9BQVYsRUFBbUIsS0FBbkIsQ0FBaEI7QUFDQSxRQUFJLGFBQWEsVUFBVSxPQUFWLEVBQW1CLE1BQW5CLENBQWpCO0FBQ0EsUUFBSSxXQUFXLFdBQVcsQ0FBQyxDQUFaLEdBQWdCLENBQS9CO0FBQ0EsU0FBSyxHQUFMLElBQVksWUFBWSxRQUF4QjtBQUNBLFNBQUssTUFBTCxJQUFlLFlBQVksUUFBM0I7QUFDQSxTQUFLLElBQUwsSUFBYSxhQUFhLFFBQTFCO0FBQ0EsU0FBSyxLQUFMLElBQWMsYUFBYSxRQUEzQjtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7O0FBVUEsV0FBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLElBQWhDLEVBQXNDO0FBQ3BDLFFBQUksUUFBUSxTQUFTLEdBQVQsR0FBZSxNQUFmLEdBQXdCLEtBQXBDO0FBQ0EsUUFBSSxRQUFRLFVBQVUsTUFBVixHQUFtQixPQUFuQixHQUE2QixRQUF6Qzs7QUFFQSxXQUFPLFdBQVcsT0FBTyxXQUFXLEtBQVgsR0FBbUIsT0FBMUIsQ0FBWCxFQUErQyxFQUEvQyxJQUFxRCxXQUFXLE9BQU8sV0FBVyxLQUFYLEdBQW1CLE9BQTFCLENBQVgsRUFBK0MsRUFBL0MsQ0FBNUQ7QUFDRDs7QUFFRCxXQUFTLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkIsSUFBN0IsRUFBbUMsYUFBbkMsRUFBa0Q7QUFDaEQsV0FBTyxLQUFLLEdBQUwsQ0FBUyxLQUFLLFdBQVcsSUFBaEIsQ0FBVCxFQUFnQyxLQUFLLFdBQVcsSUFBaEIsQ0FBaEMsRUFBdUQsS0FBSyxXQUFXLElBQWhCLENBQXZELEVBQThFLEtBQUssV0FBVyxJQUFoQixDQUE5RSxFQUFxRyxLQUFLLFdBQVcsSUFBaEIsQ0FBckcsRUFBNEgsT0FBTyxFQUFQLElBQWEsS0FBSyxXQUFXLElBQWhCLElBQXdCLGNBQWMsWUFBWSxTQUFTLFFBQVQsR0FBb0IsS0FBcEIsR0FBNEIsTUFBeEMsQ0FBZCxDQUF4QixHQUF5RixjQUFjLFlBQVksU0FBUyxRQUFULEdBQW9CLFFBQXBCLEdBQStCLE9BQTNDLENBQWQsQ0FBdEcsR0FBMkssQ0FBdlMsQ0FBUDtBQUNEOztBQUVELFdBQVMsY0FBVCxHQUEwQjtBQUN4QixRQUFJLE9BQU8sU0FBUyxJQUFwQjtBQUNBLFFBQUksT0FBTyxTQUFTLGVBQXBCO0FBQ0EsUUFBSSxnQkFBZ0IsT0FBTyxFQUFQLEtBQWMsaUJBQWlCLElBQWpCLENBQWxDOztBQUVBLFdBQU87QUFDTCxjQUFRLFFBQVEsUUFBUixFQUFrQixJQUFsQixFQUF3QixJQUF4QixFQUE4QixhQUE5QixDQURIO0FBRUwsYUFBTyxRQUFRLE9BQVIsRUFBaUIsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkIsYUFBN0I7QUFGRixLQUFQO0FBSUQ7O0FBRUQsTUFBSSxtQkFBbUIsU0FBUyxjQUFULENBQXdCLFFBQXhCLEVBQWtDLFdBQWxDLEVBQStDO0FBQ3BFLFFBQUksRUFBRSxvQkFBb0IsV0FBdEIsQ0FBSixFQUF3QztBQUN0QyxZQUFNLElBQUksU0FBSixDQUFjLG1DQUFkLENBQU47QUFDRDtBQUNGLEdBSkQ7O0FBTUEsTUFBSSxnQkFBZ0IsWUFBWTtBQUM5QixhQUFTLGdCQUFULENBQTBCLE1BQTFCLEVBQWtDLEtBQWxDLEVBQXlDO0FBQ3ZDLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQ3JDLFlBQUksYUFBYSxNQUFNLENBQU4sQ0FBakI7QUFDQSxtQkFBVyxVQUFYLEdBQXdCLFdBQVcsVUFBWCxJQUF5QixLQUFqRDtBQUNBLG1CQUFXLFlBQVgsR0FBMEIsSUFBMUI7QUFDQSxZQUFJLFdBQVcsVUFBZixFQUEyQixXQUFXLFFBQVgsR0FBc0IsSUFBdEI7QUFDM0IsZUFBTyxjQUFQLENBQXNCLE1BQXRCLEVBQThCLFdBQVcsR0FBekMsRUFBOEMsVUFBOUM7QUFDRDtBQUNGOztBQUVELFdBQU8sVUFBVSxXQUFWLEVBQXVCLFVBQXZCLEVBQW1DLFdBQW5DLEVBQWdEO0FBQ3JELFVBQUksVUFBSixFQUFnQixpQkFBaUIsWUFBWSxTQUE3QixFQUF3QyxVQUF4QztBQUNoQixVQUFJLFdBQUosRUFBaUIsaUJBQWlCLFdBQWpCLEVBQThCLFdBQTlCO0FBQ2pCLGFBQU8sV0FBUDtBQUNELEtBSkQ7QUFLRCxHQWhCbUIsRUFBcEI7O0FBa0JBLE1BQUksbUJBQW1CLFNBQVMsY0FBVCxDQUF3QixHQUF4QixFQUE2QixHQUE3QixFQUFrQyxLQUFsQyxFQUF5QztBQUM5RCxRQUFJLE9BQU8sR0FBWCxFQUFnQjtBQUNkLGFBQU8sY0FBUCxDQUFzQixHQUF0QixFQUEyQixHQUEzQixFQUFnQztBQUM5QixlQUFPLEtBRHVCO0FBRTlCLG9CQUFZLElBRmtCO0FBRzlCLHNCQUFjLElBSGdCO0FBSTlCLGtCQUFVO0FBSm9CLE9BQWhDO0FBTUQsS0FQRCxNQU9PO0FBQ0wsVUFBSSxHQUFKLElBQVcsS0FBWDtBQUNEOztBQUVELFdBQU8sR0FBUDtBQUNELEdBYkQ7O0FBZUEsTUFBSSxhQUFhLE9BQU8sTUFBUCxJQUFpQixVQUFVLE1BQVYsRUFBa0I7QUFDbEQsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsVUFBSSxTQUFTLFVBQVUsQ0FBVixDQUFiOztBQUVBLFdBQUssSUFBSSxHQUFULElBQWdCLE1BQWhCLEVBQXdCO0FBQ3RCLFlBQUksT0FBTyxTQUFQLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLENBQXFDLE1BQXJDLEVBQTZDLEdBQTdDLENBQUosRUFBdUQ7QUFDckQsaUJBQU8sR0FBUCxJQUFjLE9BQU8sR0FBUCxDQUFkO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFdBQU8sTUFBUDtBQUNELEdBWkQ7O0FBY0E7Ozs7Ozs7QUFPQSxXQUFTLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0M7QUFDOUIsV0FBTyxXQUFXLEVBQVgsRUFBZSxPQUFmLEVBQXdCO0FBQzdCLGFBQU8sUUFBUSxJQUFSLEdBQWUsUUFBUSxLQUREO0FBRTdCLGNBQVEsUUFBUSxHQUFSLEdBQWMsUUFBUTtBQUZELEtBQXhCLENBQVA7QUFJRDs7QUFFRDs7Ozs7OztBQU9BLFdBQVMscUJBQVQsQ0FBK0IsT0FBL0IsRUFBd0M7QUFDdEMsUUFBSSxPQUFPLEVBQVg7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBSTtBQUNGLFVBQUksT0FBTyxFQUFQLENBQUosRUFBZ0I7QUFDZCxlQUFPLFFBQVEscUJBQVIsRUFBUDtBQUNBLFlBQUksWUFBWSxVQUFVLE9BQVYsRUFBbUIsS0FBbkIsQ0FBaEI7QUFDQSxZQUFJLGFBQWEsVUFBVSxPQUFWLEVBQW1CLE1BQW5CLENBQWpCO0FBQ0EsYUFBSyxHQUFMLElBQVksU0FBWjtBQUNBLGFBQUssSUFBTCxJQUFhLFVBQWI7QUFDQSxhQUFLLE1BQUwsSUFBZSxTQUFmO0FBQ0EsYUFBSyxLQUFMLElBQWMsVUFBZDtBQUNELE9BUkQsTUFRTztBQUNMLGVBQU8sUUFBUSxxQkFBUixFQUFQO0FBQ0Q7QUFDRixLQVpELENBWUUsT0FBTyxDQUFQLEVBQVUsQ0FBRTs7QUFFZCxRQUFJLFNBQVM7QUFDWCxZQUFNLEtBQUssSUFEQTtBQUVYLFdBQUssS0FBSyxHQUZDO0FBR1gsYUFBTyxLQUFLLEtBQUwsR0FBYSxLQUFLLElBSGQ7QUFJWCxjQUFRLEtBQUssTUFBTCxHQUFjLEtBQUs7QUFKaEIsS0FBYjs7QUFPQTtBQUNBLFFBQUksUUFBUSxRQUFRLFFBQVIsS0FBcUIsTUFBckIsR0FBOEIsZ0JBQTlCLEdBQWlELEVBQTdEO0FBQ0EsUUFBSSxRQUFRLE1BQU0sS0FBTixJQUFlLFFBQVEsV0FBdkIsSUFBc0MsT0FBTyxLQUFQLEdBQWUsT0FBTyxJQUF4RTtBQUNBLFFBQUksU0FBUyxNQUFNLE1BQU4sSUFBZ0IsUUFBUSxZQUF4QixJQUF3QyxPQUFPLE1BQVAsR0FBZ0IsT0FBTyxHQUE1RTs7QUFFQSxRQUFJLGlCQUFpQixRQUFRLFdBQVIsR0FBc0IsS0FBM0M7QUFDQSxRQUFJLGdCQUFnQixRQUFRLFlBQVIsR0FBdUIsTUFBM0M7O0FBRUE7QUFDQTtBQUNBLFFBQUksa0JBQWtCLGFBQXRCLEVBQXFDO0FBQ25DLFVBQUksU0FBUyx5QkFBeUIsT0FBekIsQ0FBYjtBQUNBLHdCQUFrQixlQUFlLE1BQWYsRUFBdUIsR0FBdkIsQ0FBbEI7QUFDQSx1QkFBaUIsZUFBZSxNQUFmLEVBQXVCLEdBQXZCLENBQWpCOztBQUVBLGFBQU8sS0FBUCxJQUFnQixjQUFoQjtBQUNBLGFBQU8sTUFBUCxJQUFpQixhQUFqQjtBQUNEOztBQUVELFdBQU8sY0FBYyxNQUFkLENBQVA7QUFDRDs7QUFFRCxXQUFTLG9DQUFULENBQThDLFFBQTlDLEVBQXdELE1BQXhELEVBQWdFO0FBQzlELFFBQUksZ0JBQWdCLFVBQVUsTUFBVixHQUFtQixDQUFuQixJQUF3QixVQUFVLENBQVYsTUFBaUIsU0FBekMsR0FBcUQsVUFBVSxDQUFWLENBQXJELEdBQW9FLEtBQXhGOztBQUVBLFFBQUksU0FBUyxPQUFPLEVBQVAsQ0FBYjtBQUNBLFFBQUksU0FBUyxPQUFPLFFBQVAsS0FBb0IsTUFBakM7QUFDQSxRQUFJLGVBQWUsc0JBQXNCLFFBQXRCLENBQW5CO0FBQ0EsUUFBSSxhQUFhLHNCQUFzQixNQUF0QixDQUFqQjtBQUNBLFFBQUksZUFBZSxnQkFBZ0IsUUFBaEIsQ0FBbkI7O0FBRUEsUUFBSSxTQUFTLHlCQUF5QixNQUF6QixDQUFiO0FBQ0EsUUFBSSxpQkFBaUIsV0FBVyxPQUFPLGNBQWxCLEVBQWtDLEVBQWxDLENBQXJCO0FBQ0EsUUFBSSxrQkFBa0IsV0FBVyxPQUFPLGVBQWxCLEVBQW1DLEVBQW5DLENBQXRCOztBQUVBO0FBQ0EsUUFBSSxpQkFBaUIsT0FBTyxRQUFQLEtBQW9CLE1BQXpDLEVBQWlEO0FBQy9DLGlCQUFXLEdBQVgsR0FBaUIsS0FBSyxHQUFMLENBQVMsV0FBVyxHQUFwQixFQUF5QixDQUF6QixDQUFqQjtBQUNBLGlCQUFXLElBQVgsR0FBa0IsS0FBSyxHQUFMLENBQVMsV0FBVyxJQUFwQixFQUEwQixDQUExQixDQUFsQjtBQUNEO0FBQ0QsUUFBSSxVQUFVLGNBQWM7QUFDMUIsV0FBSyxhQUFhLEdBQWIsR0FBbUIsV0FBVyxHQUE5QixHQUFvQyxjQURmO0FBRTFCLFlBQU0sYUFBYSxJQUFiLEdBQW9CLFdBQVcsSUFBL0IsR0FBc0MsZUFGbEI7QUFHMUIsYUFBTyxhQUFhLEtBSE07QUFJMUIsY0FBUSxhQUFhO0FBSkssS0FBZCxDQUFkO0FBTUEsWUFBUSxTQUFSLEdBQW9CLENBQXBCO0FBQ0EsWUFBUSxVQUFSLEdBQXFCLENBQXJCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSSxDQUFDLE1BQUQsSUFBVyxNQUFmLEVBQXVCO0FBQ3JCLFVBQUksWUFBWSxXQUFXLE9BQU8sU0FBbEIsRUFBNkIsRUFBN0IsQ0FBaEI7QUFDQSxVQUFJLGFBQWEsV0FBVyxPQUFPLFVBQWxCLEVBQThCLEVBQTlCLENBQWpCOztBQUVBLGNBQVEsR0FBUixJQUFlLGlCQUFpQixTQUFoQztBQUNBLGNBQVEsTUFBUixJQUFrQixpQkFBaUIsU0FBbkM7QUFDQSxjQUFRLElBQVIsSUFBZ0Isa0JBQWtCLFVBQWxDO0FBQ0EsY0FBUSxLQUFSLElBQWlCLGtCQUFrQixVQUFuQzs7QUFFQTtBQUNBLGNBQVEsU0FBUixHQUFvQixTQUFwQjtBQUNBLGNBQVEsVUFBUixHQUFxQixVQUFyQjtBQUNEOztBQUVELFFBQUksVUFBVSxDQUFDLGFBQVgsR0FBMkIsT0FBTyxRQUFQLENBQWdCLFlBQWhCLENBQTNCLEdBQTJELFdBQVcsWUFBWCxJQUEyQixhQUFhLFFBQWIsS0FBMEIsTUFBcEgsRUFBNEg7QUFDMUgsZ0JBQVUsY0FBYyxPQUFkLEVBQXVCLE1BQXZCLENBQVY7QUFDRDs7QUFFRCxXQUFPLE9BQVA7QUFDRDs7QUFFRCxXQUFTLDZDQUFULENBQXVELE9BQXZELEVBQWdFO0FBQzlELFFBQUksZ0JBQWdCLFVBQVUsTUFBVixHQUFtQixDQUFuQixJQUF3QixVQUFVLENBQVYsTUFBaUIsU0FBekMsR0FBcUQsVUFBVSxDQUFWLENBQXJELEdBQW9FLEtBQXhGOztBQUVBLFFBQUksT0FBTyxRQUFRLGFBQVIsQ0FBc0IsZUFBakM7QUFDQSxRQUFJLGlCQUFpQixxQ0FBcUMsT0FBckMsRUFBOEMsSUFBOUMsQ0FBckI7QUFDQSxRQUFJLFFBQVEsS0FBSyxHQUFMLENBQVMsS0FBSyxXQUFkLEVBQTJCLE9BQU8sVUFBUCxJQUFxQixDQUFoRCxDQUFaO0FBQ0EsUUFBSSxTQUFTLEtBQUssR0FBTCxDQUFTLEtBQUssWUFBZCxFQUE0QixPQUFPLFdBQVAsSUFBc0IsQ0FBbEQsQ0FBYjs7QUFFQSxRQUFJLFlBQVksQ0FBQyxhQUFELEdBQWlCLFVBQVUsSUFBVixDQUFqQixHQUFtQyxDQUFuRDtBQUNBLFFBQUksYUFBYSxDQUFDLGFBQUQsR0FBaUIsVUFBVSxJQUFWLEVBQWdCLE1BQWhCLENBQWpCLEdBQTJDLENBQTVEOztBQUVBLFFBQUksU0FBUztBQUNYLFdBQUssWUFBWSxlQUFlLEdBQTNCLEdBQWlDLGVBQWUsU0FEMUM7QUFFWCxZQUFNLGFBQWEsZUFBZSxJQUE1QixHQUFtQyxlQUFlLFVBRjdDO0FBR1gsYUFBTyxLQUhJO0FBSVgsY0FBUTtBQUpHLEtBQWI7O0FBT0EsV0FBTyxjQUFjLE1BQWQsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7OztBQVFBLFdBQVMsT0FBVCxDQUFpQixPQUFqQixFQUEwQjtBQUN4QixRQUFJLFdBQVcsUUFBUSxRQUF2QjtBQUNBLFFBQUksYUFBYSxNQUFiLElBQXVCLGFBQWEsTUFBeEMsRUFBZ0Q7QUFDOUMsYUFBTyxLQUFQO0FBQ0Q7QUFDRCxRQUFJLHlCQUF5QixPQUF6QixFQUFrQyxVQUFsQyxNQUFrRCxPQUF0RCxFQUErRDtBQUM3RCxhQUFPLElBQVA7QUFDRDtBQUNELFdBQU8sUUFBUSxjQUFjLE9BQWQsQ0FBUixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O0FBUUEsV0FBUyw0QkFBVCxDQUFzQyxPQUF0QyxFQUErQztBQUM3QztBQUNBLFFBQUksQ0FBQyxPQUFELElBQVksQ0FBQyxRQUFRLGFBQXJCLElBQXNDLFFBQTFDLEVBQW9EO0FBQ2xELGFBQU8sU0FBUyxlQUFoQjtBQUNEO0FBQ0QsUUFBSSxLQUFLLFFBQVEsYUFBakI7QUFDQSxXQUFPLE1BQU0seUJBQXlCLEVBQXpCLEVBQTZCLFdBQTdCLE1BQThDLE1BQTNELEVBQW1FO0FBQ2pFLFdBQUssR0FBRyxhQUFSO0FBQ0Q7QUFDRCxXQUFPLE1BQU0sU0FBUyxlQUF0QjtBQUNEOztBQUVEOzs7Ozs7Ozs7OztBQVdBLFdBQVMsYUFBVCxDQUF1QixNQUF2QixFQUErQixTQUEvQixFQUEwQyxPQUExQyxFQUFtRCxpQkFBbkQsRUFBc0U7QUFDcEUsUUFBSSxnQkFBZ0IsVUFBVSxNQUFWLEdBQW1CLENBQW5CLElBQXdCLFVBQVUsQ0FBVixNQUFpQixTQUF6QyxHQUFxRCxVQUFVLENBQVYsQ0FBckQsR0FBb0UsS0FBeEY7O0FBRUE7O0FBRUEsUUFBSSxhQUFhLEVBQUUsS0FBSyxDQUFQLEVBQVUsTUFBTSxDQUFoQixFQUFqQjtBQUNBLFFBQUksZUFBZSxnQkFBZ0IsNkJBQTZCLE1BQTdCLENBQWhCLEdBQXVELHVCQUF1QixNQUF2QixFQUErQixTQUEvQixDQUExRTs7QUFFQTtBQUNBLFFBQUksc0JBQXNCLFVBQTFCLEVBQXNDO0FBQ3BDLG1CQUFhLDhDQUE4QyxZQUE5QyxFQUE0RCxhQUE1RCxDQUFiO0FBQ0QsS0FGRCxNQUVPO0FBQ0w7QUFDQSxVQUFJLGlCQUFpQixLQUFLLENBQTFCO0FBQ0EsVUFBSSxzQkFBc0IsY0FBMUIsRUFBMEM7QUFDeEMseUJBQWlCLGdCQUFnQixjQUFjLFNBQWQsQ0FBaEIsQ0FBakI7QUFDQSxZQUFJLGVBQWUsUUFBZixLQUE0QixNQUFoQyxFQUF3QztBQUN0QywyQkFBaUIsT0FBTyxhQUFQLENBQXFCLGVBQXRDO0FBQ0Q7QUFDRixPQUxELE1BS08sSUFBSSxzQkFBc0IsUUFBMUIsRUFBb0M7QUFDekMseUJBQWlCLE9BQU8sYUFBUCxDQUFxQixlQUF0QztBQUNELE9BRk0sTUFFQTtBQUNMLHlCQUFpQixpQkFBakI7QUFDRDs7QUFFRCxVQUFJLFVBQVUscUNBQXFDLGNBQXJDLEVBQXFELFlBQXJELEVBQW1FLGFBQW5FLENBQWQ7O0FBRUE7QUFDQSxVQUFJLGVBQWUsUUFBZixLQUE0QixNQUE1QixJQUFzQyxDQUFDLFFBQVEsWUFBUixDQUEzQyxFQUFrRTtBQUNoRSxZQUFJLGtCQUFrQixnQkFBdEI7QUFBQSxZQUNJLFNBQVMsZ0JBQWdCLE1BRDdCO0FBQUEsWUFFSSxRQUFRLGdCQUFnQixLQUY1Qjs7QUFJQSxtQkFBVyxHQUFYLElBQWtCLFFBQVEsR0FBUixHQUFjLFFBQVEsU0FBeEM7QUFDQSxtQkFBVyxNQUFYLEdBQW9CLFNBQVMsUUFBUSxHQUFyQztBQUNBLG1CQUFXLElBQVgsSUFBbUIsUUFBUSxJQUFSLEdBQWUsUUFBUSxVQUExQztBQUNBLG1CQUFXLEtBQVgsR0FBbUIsUUFBUSxRQUFRLElBQW5DO0FBQ0QsT0FURCxNQVNPO0FBQ0w7QUFDQSxxQkFBYSxPQUFiO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLGVBQVcsSUFBWCxJQUFtQixPQUFuQjtBQUNBLGVBQVcsR0FBWCxJQUFrQixPQUFsQjtBQUNBLGVBQVcsS0FBWCxJQUFvQixPQUFwQjtBQUNBLGVBQVcsTUFBWCxJQUFxQixPQUFyQjs7QUFFQSxXQUFPLFVBQVA7QUFDRDs7QUFFRCxXQUFTLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUI7QUFDckIsUUFBSSxRQUFRLEtBQUssS0FBakI7QUFBQSxRQUNJLFNBQVMsS0FBSyxNQURsQjs7QUFHQSxXQUFPLFFBQVEsTUFBZjtBQUNEOztBQUVEOzs7Ozs7Ozs7QUFTQSxXQUFTLG9CQUFULENBQThCLFNBQTlCLEVBQXlDLE9BQXpDLEVBQWtELE1BQWxELEVBQTBELFNBQTFELEVBQXFFLGlCQUFyRSxFQUF3RjtBQUN0RixRQUFJLFVBQVUsVUFBVSxNQUFWLEdBQW1CLENBQW5CLElBQXdCLFVBQVUsQ0FBVixNQUFpQixTQUF6QyxHQUFxRCxVQUFVLENBQVYsQ0FBckQsR0FBb0UsQ0FBbEY7O0FBRUEsUUFBSSxVQUFVLE9BQVYsQ0FBa0IsTUFBbEIsTUFBOEIsQ0FBQyxDQUFuQyxFQUFzQztBQUNwQyxhQUFPLFNBQVA7QUFDRDs7QUFFRCxRQUFJLGFBQWEsY0FBYyxNQUFkLEVBQXNCLFNBQXRCLEVBQWlDLE9BQWpDLEVBQTBDLGlCQUExQyxDQUFqQjs7QUFFQSxRQUFJLFFBQVE7QUFDVixXQUFLO0FBQ0gsZUFBTyxXQUFXLEtBRGY7QUFFSCxnQkFBUSxRQUFRLEdBQVIsR0FBYyxXQUFXO0FBRjlCLE9BREs7QUFLVixhQUFPO0FBQ0wsZUFBTyxXQUFXLEtBQVgsR0FBbUIsUUFBUSxLQUQ3QjtBQUVMLGdCQUFRLFdBQVc7QUFGZCxPQUxHO0FBU1YsY0FBUTtBQUNOLGVBQU8sV0FBVyxLQURaO0FBRU4sZ0JBQVEsV0FBVyxNQUFYLEdBQW9CLFFBQVE7QUFGOUIsT0FURTtBQWFWLFlBQU07QUFDSixlQUFPLFFBQVEsSUFBUixHQUFlLFdBQVcsSUFEN0I7QUFFSixnQkFBUSxXQUFXO0FBRmY7QUFiSSxLQUFaOztBQW1CQSxRQUFJLGNBQWMsT0FBTyxJQUFQLENBQVksS0FBWixFQUFtQixHQUFuQixDQUF1QixVQUFVLEdBQVYsRUFBZTtBQUN0RCxhQUFPLFdBQVc7QUFDaEIsYUFBSztBQURXLE9BQVgsRUFFSixNQUFNLEdBQU4sQ0FGSSxFQUVRO0FBQ2IsY0FBTSxRQUFRLE1BQU0sR0FBTixDQUFSO0FBRE8sT0FGUixDQUFQO0FBS0QsS0FOaUIsRUFNZixJQU5lLENBTVYsVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUN0QixhQUFPLEVBQUUsSUFBRixHQUFTLEVBQUUsSUFBbEI7QUFDRCxLQVJpQixDQUFsQjs7QUFVQSxRQUFJLGdCQUFnQixZQUFZLE1BQVosQ0FBbUIsVUFBVSxLQUFWLEVBQWlCO0FBQ3RELFVBQUksUUFBUSxNQUFNLEtBQWxCO0FBQUEsVUFDSSxTQUFTLE1BQU0sTUFEbkI7QUFFQSxhQUFPLFNBQVMsT0FBTyxXQUFoQixJQUErQixVQUFVLE9BQU8sWUFBdkQ7QUFDRCxLQUptQixDQUFwQjs7QUFNQSxRQUFJLG9CQUFvQixjQUFjLE1BQWQsR0FBdUIsQ0FBdkIsR0FBMkIsY0FBYyxDQUFkLEVBQWlCLEdBQTVDLEdBQWtELFlBQVksQ0FBWixFQUFlLEdBQXpGOztBQUVBLFFBQUksWUFBWSxVQUFVLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBaEI7O0FBRUEsV0FBTyxxQkFBcUIsWUFBWSxNQUFNLFNBQWxCLEdBQThCLEVBQW5ELENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQVVBLFdBQVMsbUJBQVQsQ0FBNkIsS0FBN0IsRUFBb0MsTUFBcEMsRUFBNEMsU0FBNUMsRUFBdUQ7QUFDckQsUUFBSSxnQkFBZ0IsVUFBVSxNQUFWLEdBQW1CLENBQW5CLElBQXdCLFVBQVUsQ0FBVixNQUFpQixTQUF6QyxHQUFxRCxVQUFVLENBQVYsQ0FBckQsR0FBb0UsSUFBeEY7O0FBRUEsUUFBSSxxQkFBcUIsZ0JBQWdCLDZCQUE2QixNQUE3QixDQUFoQixHQUF1RCx1QkFBdUIsTUFBdkIsRUFBK0IsU0FBL0IsQ0FBaEY7QUFDQSxXQUFPLHFDQUFxQyxTQUFyQyxFQUFnRCxrQkFBaEQsRUFBb0UsYUFBcEUsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7O0FBT0EsV0FBUyxhQUFULENBQXVCLE9BQXZCLEVBQWdDO0FBQzlCLFFBQUksU0FBUyxpQkFBaUIsT0FBakIsQ0FBYjtBQUNBLFFBQUksSUFBSSxXQUFXLE9BQU8sU0FBbEIsSUFBK0IsV0FBVyxPQUFPLFlBQWxCLENBQXZDO0FBQ0EsUUFBSSxJQUFJLFdBQVcsT0FBTyxVQUFsQixJQUFnQyxXQUFXLE9BQU8sV0FBbEIsQ0FBeEM7QUFDQSxRQUFJLFNBQVM7QUFDWCxhQUFPLFFBQVEsV0FBUixHQUFzQixDQURsQjtBQUVYLGNBQVEsUUFBUSxZQUFSLEdBQXVCO0FBRnBCLEtBQWI7QUFJQSxXQUFPLE1BQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFdBQVMsb0JBQVQsQ0FBOEIsU0FBOUIsRUFBeUM7QUFDdkMsUUFBSSxPQUFPLEVBQUUsTUFBTSxPQUFSLEVBQWlCLE9BQU8sTUFBeEIsRUFBZ0MsUUFBUSxLQUF4QyxFQUErQyxLQUFLLFFBQXBELEVBQVg7QUFDQSxXQUFPLFVBQVUsT0FBVixDQUFrQix3QkFBbEIsRUFBNEMsVUFBVSxPQUFWLEVBQW1CO0FBQ3BFLGFBQU8sS0FBSyxPQUFMLENBQVA7QUFDRCxLQUZNLENBQVA7QUFHRDs7QUFFRDs7Ozs7Ozs7OztBQVVBLFdBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0MsZ0JBQWxDLEVBQW9ELFNBQXBELEVBQStEO0FBQzdELGdCQUFZLFVBQVUsS0FBVixDQUFnQixHQUFoQixFQUFxQixDQUFyQixDQUFaOztBQUVBO0FBQ0EsUUFBSSxhQUFhLGNBQWMsTUFBZCxDQUFqQjs7QUFFQTtBQUNBLFFBQUksZ0JBQWdCO0FBQ2xCLGFBQU8sV0FBVyxLQURBO0FBRWxCLGNBQVEsV0FBVztBQUZELEtBQXBCOztBQUtBO0FBQ0EsUUFBSSxVQUFVLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsT0FBbEIsQ0FBMEIsU0FBMUIsTUFBeUMsQ0FBQyxDQUF4RDtBQUNBLFFBQUksV0FBVyxVQUFVLEtBQVYsR0FBa0IsTUFBakM7QUFDQSxRQUFJLGdCQUFnQixVQUFVLE1BQVYsR0FBbUIsS0FBdkM7QUFDQSxRQUFJLGNBQWMsVUFBVSxRQUFWLEdBQXFCLE9BQXZDO0FBQ0EsUUFBSSx1QkFBdUIsQ0FBQyxPQUFELEdBQVcsUUFBWCxHQUFzQixPQUFqRDs7QUFFQSxrQkFBYyxRQUFkLElBQTBCLGlCQUFpQixRQUFqQixJQUE2QixpQkFBaUIsV0FBakIsSUFBZ0MsQ0FBN0QsR0FBaUUsV0FBVyxXQUFYLElBQTBCLENBQXJIO0FBQ0EsUUFBSSxjQUFjLGFBQWxCLEVBQWlDO0FBQy9CLG9CQUFjLGFBQWQsSUFBK0IsaUJBQWlCLGFBQWpCLElBQWtDLFdBQVcsb0JBQVgsQ0FBakU7QUFDRCxLQUZELE1BRU87QUFDTCxvQkFBYyxhQUFkLElBQStCLGlCQUFpQixxQkFBcUIsYUFBckIsQ0FBakIsQ0FBL0I7QUFDRDs7QUFFRCxXQUFPLGFBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O0FBU0EsV0FBUyxJQUFULENBQWMsR0FBZCxFQUFtQixLQUFuQixFQUEwQjtBQUN4QjtBQUNBLFFBQUksTUFBTSxTQUFOLENBQWdCLElBQXBCLEVBQTBCO0FBQ3hCLGFBQU8sSUFBSSxJQUFKLENBQVMsS0FBVCxDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFPLElBQUksTUFBSixDQUFXLEtBQVgsRUFBa0IsQ0FBbEIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7QUFTQSxXQUFTLFNBQVQsQ0FBbUIsR0FBbkIsRUFBd0IsSUFBeEIsRUFBOEIsS0FBOUIsRUFBcUM7QUFDbkM7QUFDQSxRQUFJLE1BQU0sU0FBTixDQUFnQixTQUFwQixFQUErQjtBQUM3QixhQUFPLElBQUksU0FBSixDQUFjLFVBQVUsR0FBVixFQUFlO0FBQ2xDLGVBQU8sSUFBSSxJQUFKLE1BQWMsS0FBckI7QUFDRCxPQUZNLENBQVA7QUFHRDs7QUFFRDtBQUNBLFFBQUksUUFBUSxLQUFLLEdBQUwsRUFBVSxVQUFVLEdBQVYsRUFBZTtBQUNuQyxhQUFPLElBQUksSUFBSixNQUFjLEtBQXJCO0FBQ0QsS0FGVyxDQUFaO0FBR0EsV0FBTyxJQUFJLE9BQUosQ0FBWSxLQUFaLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQVVBLFdBQVMsWUFBVCxDQUFzQixTQUF0QixFQUFpQyxJQUFqQyxFQUF1QyxJQUF2QyxFQUE2QztBQUMzQyxRQUFJLGlCQUFpQixTQUFTLFNBQVQsR0FBcUIsU0FBckIsR0FBaUMsVUFBVSxLQUFWLENBQWdCLENBQWhCLEVBQW1CLFVBQVUsU0FBVixFQUFxQixNQUFyQixFQUE2QixJQUE3QixDQUFuQixDQUF0RDs7QUFFQSxtQkFBZSxPQUFmLENBQXVCLFVBQVUsUUFBVixFQUFvQjtBQUN6QyxVQUFJLFNBQVMsVUFBVCxDQUFKLEVBQTBCO0FBQ3hCO0FBQ0EsZ0JBQVEsSUFBUixDQUFhLHVEQUFiO0FBQ0Q7QUFDRCxVQUFJLEtBQUssU0FBUyxVQUFULEtBQXdCLFNBQVMsRUFBMUMsQ0FMeUMsQ0FLSztBQUM5QyxVQUFJLFNBQVMsT0FBVCxJQUFvQixXQUFXLEVBQVgsQ0FBeEIsRUFBd0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsYUFBSyxPQUFMLENBQWEsTUFBYixHQUFzQixjQUFjLEtBQUssT0FBTCxDQUFhLE1BQTNCLENBQXRCO0FBQ0EsYUFBSyxPQUFMLENBQWEsU0FBYixHQUF5QixjQUFjLEtBQUssT0FBTCxDQUFhLFNBQTNCLENBQXpCOztBQUVBLGVBQU8sR0FBRyxJQUFILEVBQVMsUUFBVCxDQUFQO0FBQ0Q7QUFDRixLQWZEOztBQWlCQSxXQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFdBQVMsTUFBVCxHQUFrQjtBQUNoQjtBQUNBLFFBQUksS0FBSyxLQUFMLENBQVcsV0FBZixFQUE0QjtBQUMxQjtBQUNEOztBQUVELFFBQUksT0FBTztBQUNULGdCQUFVLElBREQ7QUFFVCxjQUFRLEVBRkM7QUFHVCxtQkFBYSxFQUhKO0FBSVQsa0JBQVksRUFKSDtBQUtULGVBQVMsS0FMQTtBQU1ULGVBQVM7QUFOQSxLQUFYOztBQVNBO0FBQ0EsU0FBSyxPQUFMLENBQWEsU0FBYixHQUF5QixvQkFBb0IsS0FBSyxLQUF6QixFQUFnQyxLQUFLLE1BQXJDLEVBQTZDLEtBQUssU0FBbEQsRUFBNkQsS0FBSyxPQUFMLENBQWEsYUFBMUUsQ0FBekI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLHFCQUFxQixLQUFLLE9BQUwsQ0FBYSxTQUFsQyxFQUE2QyxLQUFLLE9BQUwsQ0FBYSxTQUExRCxFQUFxRSxLQUFLLE1BQTFFLEVBQWtGLEtBQUssU0FBdkYsRUFBa0csS0FBSyxPQUFMLENBQWEsU0FBYixDQUF1QixJQUF2QixDQUE0QixpQkFBOUgsRUFBaUosS0FBSyxPQUFMLENBQWEsU0FBYixDQUF1QixJQUF2QixDQUE0QixPQUE3SyxDQUFqQjs7QUFFQTtBQUNBLFNBQUssaUJBQUwsR0FBeUIsS0FBSyxTQUE5Qjs7QUFFQSxTQUFLLGFBQUwsR0FBcUIsS0FBSyxPQUFMLENBQWEsYUFBbEM7O0FBRUE7QUFDQSxTQUFLLE9BQUwsQ0FBYSxNQUFiLEdBQXNCLGlCQUFpQixLQUFLLE1BQXRCLEVBQThCLEtBQUssT0FBTCxDQUFhLFNBQTNDLEVBQXNELEtBQUssU0FBM0QsQ0FBdEI7O0FBRUEsU0FBSyxPQUFMLENBQWEsTUFBYixDQUFvQixRQUFwQixHQUErQixLQUFLLE9BQUwsQ0FBYSxhQUFiLEdBQTZCLE9BQTdCLEdBQXVDLFVBQXRFOztBQUVBO0FBQ0EsV0FBTyxhQUFhLEtBQUssU0FBbEIsRUFBNkIsSUFBN0IsQ0FBUDs7QUFFQTtBQUNBO0FBQ0EsUUFBSSxDQUFDLEtBQUssS0FBTCxDQUFXLFNBQWhCLEVBQTJCO0FBQ3pCLFdBQUssS0FBTCxDQUFXLFNBQVgsR0FBdUIsSUFBdkI7QUFDQSxXQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLElBQXRCO0FBQ0QsS0FIRCxNQUdPO0FBQ0wsV0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixJQUF0QjtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7OztBQU1BLFdBQVMsaUJBQVQsQ0FBMkIsU0FBM0IsRUFBc0MsWUFBdEMsRUFBb0Q7QUFDbEQsV0FBTyxVQUFVLElBQVYsQ0FBZSxVQUFVLElBQVYsRUFBZ0I7QUFDcEMsVUFBSSxPQUFPLEtBQUssSUFBaEI7QUFBQSxVQUNJLFVBQVUsS0FBSyxPQURuQjtBQUVBLGFBQU8sV0FBVyxTQUFTLFlBQTNCO0FBQ0QsS0FKTSxDQUFQO0FBS0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxXQUFTLHdCQUFULENBQWtDLFFBQWxDLEVBQTRDO0FBQzFDLFFBQUksV0FBVyxDQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsUUFBZCxFQUF3QixLQUF4QixFQUErQixHQUEvQixDQUFmO0FBQ0EsUUFBSSxZQUFZLFNBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFtQixXQUFuQixLQUFtQyxTQUFTLEtBQVQsQ0FBZSxDQUFmLENBQW5EOztBQUVBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxTQUFTLE1BQTdCLEVBQXFDLEdBQXJDLEVBQTBDO0FBQ3hDLFVBQUksU0FBUyxTQUFTLENBQVQsQ0FBYjtBQUNBLFVBQUksVUFBVSxTQUFTLEtBQUssTUFBTCxHQUFjLFNBQXZCLEdBQW1DLFFBQWpEO0FBQ0EsVUFBSSxPQUFPLFNBQVMsSUFBVCxDQUFjLEtBQWQsQ0FBb0IsT0FBcEIsQ0FBUCxLQUF3QyxXQUE1QyxFQUF5RDtBQUN2RCxlQUFPLE9BQVA7QUFDRDtBQUNGO0FBQ0QsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsV0FBUyxPQUFULEdBQW1CO0FBQ2pCLFNBQUssS0FBTCxDQUFXLFdBQVgsR0FBeUIsSUFBekI7O0FBRUE7QUFDQSxRQUFJLGtCQUFrQixLQUFLLFNBQXZCLEVBQWtDLFlBQWxDLENBQUosRUFBcUQ7QUFDbkQsV0FBSyxNQUFMLENBQVksZUFBWixDQUE0QixhQUE1QjtBQUNBLFdBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsUUFBbEIsR0FBNkIsRUFBN0I7QUFDQSxXQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLEdBQWxCLEdBQXdCLEVBQXhCO0FBQ0EsV0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixJQUFsQixHQUF5QixFQUF6QjtBQUNBLFdBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsS0FBbEIsR0FBMEIsRUFBMUI7QUFDQSxXQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLE1BQWxCLEdBQTJCLEVBQTNCO0FBQ0EsV0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixVQUFsQixHQUErQixFQUEvQjtBQUNBLFdBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IseUJBQXlCLFdBQXpCLENBQWxCLElBQTJELEVBQTNEO0FBQ0Q7O0FBRUQsU0FBSyxxQkFBTDs7QUFFQTtBQUNBO0FBQ0EsUUFBSSxLQUFLLE9BQUwsQ0FBYSxlQUFqQixFQUFrQztBQUNoQyxXQUFLLE1BQUwsQ0FBWSxVQUFaLENBQXVCLFdBQXZCLENBQW1DLEtBQUssTUFBeEM7QUFDRDtBQUNELFdBQU8sSUFBUDtBQUNEOztBQUVEOzs7OztBQUtBLFdBQVMsU0FBVCxDQUFtQixPQUFuQixFQUE0QjtBQUMxQixRQUFJLGdCQUFnQixRQUFRLGFBQTVCO0FBQ0EsV0FBTyxnQkFBZ0IsY0FBYyxXQUE5QixHQUE0QyxNQUFuRDtBQUNEOztBQUVELFdBQVMscUJBQVQsQ0FBK0IsWUFBL0IsRUFBNkMsS0FBN0MsRUFBb0QsUUFBcEQsRUFBOEQsYUFBOUQsRUFBNkU7QUFDM0UsUUFBSSxTQUFTLGFBQWEsUUFBYixLQUEwQixNQUF2QztBQUNBLFFBQUksU0FBUyxTQUFTLGFBQWEsYUFBYixDQUEyQixXQUFwQyxHQUFrRCxZQUEvRDtBQUNBLFdBQU8sZ0JBQVAsQ0FBd0IsS0FBeEIsRUFBK0IsUUFBL0IsRUFBeUMsRUFBRSxTQUFTLElBQVgsRUFBekM7O0FBRUEsUUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNYLDRCQUFzQixnQkFBZ0IsT0FBTyxVQUF2QixDQUF0QixFQUEwRCxLQUExRCxFQUFpRSxRQUFqRSxFQUEyRSxhQUEzRTtBQUNEO0FBQ0Qsa0JBQWMsSUFBZCxDQUFtQixNQUFuQjtBQUNEOztBQUVEOzs7Ozs7QUFNQSxXQUFTLG1CQUFULENBQTZCLFNBQTdCLEVBQXdDLE9BQXhDLEVBQWlELEtBQWpELEVBQXdELFdBQXhELEVBQXFFO0FBQ25FO0FBQ0EsVUFBTSxXQUFOLEdBQW9CLFdBQXBCO0FBQ0EsY0FBVSxTQUFWLEVBQXFCLGdCQUFyQixDQUFzQyxRQUF0QyxFQUFnRCxNQUFNLFdBQXRELEVBQW1FLEVBQUUsU0FBUyxJQUFYLEVBQW5FOztBQUVBO0FBQ0EsUUFBSSxnQkFBZ0IsZ0JBQWdCLFNBQWhCLENBQXBCO0FBQ0EsMEJBQXNCLGFBQXRCLEVBQXFDLFFBQXJDLEVBQStDLE1BQU0sV0FBckQsRUFBa0UsTUFBTSxhQUF4RTtBQUNBLFVBQU0sYUFBTixHQUFzQixhQUF0QjtBQUNBLFVBQU0sYUFBTixHQUFzQixJQUF0Qjs7QUFFQSxXQUFPLEtBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsV0FBUyxvQkFBVCxHQUFnQztBQUM5QixRQUFJLENBQUMsS0FBSyxLQUFMLENBQVcsYUFBaEIsRUFBK0I7QUFDN0IsV0FBSyxLQUFMLEdBQWEsb0JBQW9CLEtBQUssU0FBekIsRUFBb0MsS0FBSyxPQUF6QyxFQUFrRCxLQUFLLEtBQXZELEVBQThELEtBQUssY0FBbkUsQ0FBYjtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7OztBQU1BLFdBQVMsb0JBQVQsQ0FBOEIsU0FBOUIsRUFBeUMsS0FBekMsRUFBZ0Q7QUFDOUM7QUFDQSxjQUFVLFNBQVYsRUFBcUIsbUJBQXJCLENBQXlDLFFBQXpDLEVBQW1ELE1BQU0sV0FBekQ7O0FBRUE7QUFDQSxVQUFNLGFBQU4sQ0FBb0IsT0FBcEIsQ0FBNEIsVUFBVSxNQUFWLEVBQWtCO0FBQzVDLGFBQU8sbUJBQVAsQ0FBMkIsUUFBM0IsRUFBcUMsTUFBTSxXQUEzQztBQUNELEtBRkQ7O0FBSUE7QUFDQSxVQUFNLFdBQU4sR0FBb0IsSUFBcEI7QUFDQSxVQUFNLGFBQU4sR0FBc0IsRUFBdEI7QUFDQSxVQUFNLGFBQU4sR0FBc0IsSUFBdEI7QUFDQSxVQUFNLGFBQU4sR0FBc0IsS0FBdEI7QUFDQSxXQUFPLEtBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFdBQVMscUJBQVQsR0FBaUM7QUFDL0IsUUFBSSxLQUFLLEtBQUwsQ0FBVyxhQUFmLEVBQThCO0FBQzVCLDJCQUFxQixLQUFLLGNBQTFCO0FBQ0EsV0FBSyxLQUFMLEdBQWEscUJBQXFCLEtBQUssU0FBMUIsRUFBcUMsS0FBSyxLQUExQyxDQUFiO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7OztBQU9BLFdBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQjtBQUNwQixXQUFPLE1BQU0sRUFBTixJQUFZLENBQUMsTUFBTSxXQUFXLENBQVgsQ0FBTixDQUFiLElBQXFDLFNBQVMsQ0FBVCxDQUE1QztBQUNEOztBQUVEOzs7Ozs7OztBQVFBLFdBQVMsU0FBVCxDQUFtQixPQUFuQixFQUE0QixNQUE1QixFQUFvQztBQUNsQyxXQUFPLElBQVAsQ0FBWSxNQUFaLEVBQW9CLE9BQXBCLENBQTRCLFVBQVUsSUFBVixFQUFnQjtBQUMxQyxVQUFJLE9BQU8sRUFBWDtBQUNBO0FBQ0EsVUFBSSxDQUFDLE9BQUQsRUFBVSxRQUFWLEVBQW9CLEtBQXBCLEVBQTJCLE9BQTNCLEVBQW9DLFFBQXBDLEVBQThDLE1BQTlDLEVBQXNELE9BQXRELENBQThELElBQTlELE1BQXdFLENBQUMsQ0FBekUsSUFBOEUsVUFBVSxPQUFPLElBQVAsQ0FBVixDQUFsRixFQUEyRztBQUN6RyxlQUFPLElBQVA7QUFDRDtBQUNELGNBQVEsS0FBUixDQUFjLElBQWQsSUFBc0IsT0FBTyxJQUFQLElBQWUsSUFBckM7QUFDRCxLQVBEO0FBUUQ7O0FBRUQ7Ozs7Ozs7O0FBUUEsV0FBUyxhQUFULENBQXVCLE9BQXZCLEVBQWdDLFVBQWhDLEVBQTRDO0FBQzFDLFdBQU8sSUFBUCxDQUFZLFVBQVosRUFBd0IsT0FBeEIsQ0FBZ0MsVUFBVSxJQUFWLEVBQWdCO0FBQzlDLFVBQUksUUFBUSxXQUFXLElBQVgsQ0FBWjtBQUNBLFVBQUksVUFBVSxLQUFkLEVBQXFCO0FBQ25CLGdCQUFRLFlBQVIsQ0FBcUIsSUFBckIsRUFBMkIsV0FBVyxJQUFYLENBQTNCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZ0JBQVEsZUFBUixDQUF3QixJQUF4QjtBQUNEO0FBQ0YsS0FQRDtBQVFEOztBQUVEOzs7Ozs7Ozs7QUFTQSxXQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEI7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFVLEtBQUssUUFBTCxDQUFjLE1BQXhCLEVBQWdDLEtBQUssTUFBckM7O0FBRUE7QUFDQTtBQUNBLGtCQUFjLEtBQUssUUFBTCxDQUFjLE1BQTVCLEVBQW9DLEtBQUssVUFBekM7O0FBRUE7QUFDQSxRQUFJLEtBQUssWUFBTCxJQUFxQixPQUFPLElBQVAsQ0FBWSxLQUFLLFdBQWpCLEVBQThCLE1BQXZELEVBQStEO0FBQzdELGdCQUFVLEtBQUssWUFBZixFQUE2QixLQUFLLFdBQWxDO0FBQ0Q7O0FBRUQsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxXQUFTLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLE1BQXJDLEVBQTZDLE9BQTdDLEVBQXNELGVBQXRELEVBQXVFLEtBQXZFLEVBQThFO0FBQzVFO0FBQ0EsUUFBSSxtQkFBbUIsb0JBQW9CLEtBQXBCLEVBQTJCLE1BQTNCLEVBQW1DLFNBQW5DLEVBQThDLFFBQVEsYUFBdEQsQ0FBdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBSSxZQUFZLHFCQUFxQixRQUFRLFNBQTdCLEVBQXdDLGdCQUF4QyxFQUEwRCxNQUExRCxFQUFrRSxTQUFsRSxFQUE2RSxRQUFRLFNBQVIsQ0FBa0IsSUFBbEIsQ0FBdUIsaUJBQXBHLEVBQXVILFFBQVEsU0FBUixDQUFrQixJQUFsQixDQUF1QixPQUE5SSxDQUFoQjs7QUFFQSxXQUFPLFlBQVAsQ0FBb0IsYUFBcEIsRUFBbUMsU0FBbkM7O0FBRUE7QUFDQTtBQUNBLGNBQVUsTUFBVixFQUFrQixFQUFFLFVBQVUsUUFBUSxhQUFSLEdBQXdCLE9BQXhCLEdBQWtDLFVBQTlDLEVBQWxCOztBQUVBLFdBQU8sT0FBUDtBQUNEOztBQUVEOzs7Ozs7O0FBT0EsV0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCLE9BQTVCLEVBQXFDO0FBQ25DLFFBQUksSUFBSSxRQUFRLENBQWhCO0FBQUEsUUFDSSxJQUFJLFFBQVEsQ0FEaEI7QUFFQSxRQUFJLFNBQVMsS0FBSyxPQUFMLENBQWEsTUFBMUI7O0FBRUE7O0FBRUEsUUFBSSw4QkFBOEIsS0FBSyxLQUFLLFFBQUwsQ0FBYyxTQUFuQixFQUE4QixVQUFVLFFBQVYsRUFBb0I7QUFDbEYsYUFBTyxTQUFTLElBQVQsS0FBa0IsWUFBekI7QUFDRCxLQUZpQyxFQUUvQixlQUZIO0FBR0EsUUFBSSxnQ0FBZ0MsU0FBcEMsRUFBK0M7QUFDN0MsY0FBUSxJQUFSLENBQWEsK0hBQWI7QUFDRDtBQUNELFFBQUksa0JBQWtCLGdDQUFnQyxTQUFoQyxHQUE0QywyQkFBNUMsR0FBMEUsUUFBUSxlQUF4Rzs7QUFFQSxRQUFJLGVBQWUsZ0JBQWdCLEtBQUssUUFBTCxDQUFjLE1BQTlCLENBQW5CO0FBQ0EsUUFBSSxtQkFBbUIsc0JBQXNCLFlBQXRCLENBQXZCOztBQUVBO0FBQ0EsUUFBSSxTQUFTO0FBQ1gsZ0JBQVUsT0FBTztBQUROLEtBQWI7O0FBSUE7QUFDQTtBQUNBO0FBQ0EsUUFBSSxVQUFVO0FBQ1osWUFBTSxLQUFLLEtBQUwsQ0FBVyxPQUFPLElBQWxCLENBRE07QUFFWixXQUFLLEtBQUssS0FBTCxDQUFXLE9BQU8sR0FBbEIsQ0FGTztBQUdaLGNBQVEsS0FBSyxLQUFMLENBQVcsT0FBTyxNQUFsQixDQUhJO0FBSVosYUFBTyxLQUFLLEtBQUwsQ0FBVyxPQUFPLEtBQWxCO0FBSkssS0FBZDs7QUFPQSxRQUFJLFFBQVEsTUFBTSxRQUFOLEdBQWlCLEtBQWpCLEdBQXlCLFFBQXJDO0FBQ0EsUUFBSSxRQUFRLE1BQU0sT0FBTixHQUFnQixNQUFoQixHQUF5QixPQUFyQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFJLG1CQUFtQix5QkFBeUIsV0FBekIsQ0FBdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSSxPQUFPLEtBQUssQ0FBaEI7QUFBQSxRQUNJLE1BQU0sS0FBSyxDQURmO0FBRUEsUUFBSSxVQUFVLFFBQWQsRUFBd0I7QUFDdEIsWUFBTSxDQUFDLGlCQUFpQixNQUFsQixHQUEyQixRQUFRLE1BQXpDO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsWUFBTSxRQUFRLEdBQWQ7QUFDRDtBQUNELFFBQUksVUFBVSxPQUFkLEVBQXVCO0FBQ3JCLGFBQU8sQ0FBQyxpQkFBaUIsS0FBbEIsR0FBMEIsUUFBUSxLQUF6QztBQUNELEtBRkQsTUFFTztBQUNMLGFBQU8sUUFBUSxJQUFmO0FBQ0Q7QUFDRCxRQUFJLG1CQUFtQixnQkFBdkIsRUFBeUM7QUFDdkMsYUFBTyxnQkFBUCxJQUEyQixpQkFBaUIsSUFBakIsR0FBd0IsTUFBeEIsR0FBaUMsR0FBakMsR0FBdUMsUUFBbEU7QUFDQSxhQUFPLEtBQVAsSUFBZ0IsQ0FBaEI7QUFDQSxhQUFPLEtBQVAsSUFBZ0IsQ0FBaEI7QUFDQSxhQUFPLFVBQVAsR0FBb0IsV0FBcEI7QUFDRCxLQUxELE1BS087QUFDTDtBQUNBLFVBQUksWUFBWSxVQUFVLFFBQVYsR0FBcUIsQ0FBQyxDQUF0QixHQUEwQixDQUExQztBQUNBLFVBQUksYUFBYSxVQUFVLE9BQVYsR0FBb0IsQ0FBQyxDQUFyQixHQUF5QixDQUExQztBQUNBLGFBQU8sS0FBUCxJQUFnQixNQUFNLFNBQXRCO0FBQ0EsYUFBTyxLQUFQLElBQWdCLE9BQU8sVUFBdkI7QUFDQSxhQUFPLFVBQVAsR0FBb0IsUUFBUSxJQUFSLEdBQWUsS0FBbkM7QUFDRDs7QUFFRDtBQUNBLFFBQUksYUFBYTtBQUNmLHFCQUFlLEtBQUs7QUFETCxLQUFqQjs7QUFJQTtBQUNBLFNBQUssVUFBTCxHQUFrQixXQUFXLEVBQVgsRUFBZSxVQUFmLEVBQTJCLEtBQUssVUFBaEMsQ0FBbEI7QUFDQSxTQUFLLE1BQUwsR0FBYyxXQUFXLEVBQVgsRUFBZSxNQUFmLEVBQXVCLEtBQUssTUFBNUIsQ0FBZDtBQUNBLFNBQUssV0FBTCxHQUFtQixXQUFXLEVBQVgsRUFBZSxLQUFLLE9BQUwsQ0FBYSxLQUE1QixFQUFtQyxLQUFLLFdBQXhDLENBQW5COztBQUVBLFdBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7O0FBVUEsV0FBUyxrQkFBVCxDQUE0QixTQUE1QixFQUF1QyxjQUF2QyxFQUF1RCxhQUF2RCxFQUFzRTtBQUNwRSxRQUFJLGFBQWEsS0FBSyxTQUFMLEVBQWdCLFVBQVUsSUFBVixFQUFnQjtBQUMvQyxVQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGFBQU8sU0FBUyxjQUFoQjtBQUNELEtBSGdCLENBQWpCOztBQUtBLFFBQUksYUFBYSxDQUFDLENBQUMsVUFBRixJQUFnQixVQUFVLElBQVYsQ0FBZSxVQUFVLFFBQVYsRUFBb0I7QUFDbEUsYUFBTyxTQUFTLElBQVQsS0FBa0IsYUFBbEIsSUFBbUMsU0FBUyxPQUE1QyxJQUF1RCxTQUFTLEtBQVQsR0FBaUIsV0FBVyxLQUExRjtBQUNELEtBRmdDLENBQWpDOztBQUlBLFFBQUksQ0FBQyxVQUFMLEVBQWlCO0FBQ2YsVUFBSSxjQUFjLE1BQU0sY0FBTixHQUF1QixHQUF6QztBQUNBLFVBQUksWUFBWSxNQUFNLGFBQU4sR0FBc0IsR0FBdEM7QUFDQSxjQUFRLElBQVIsQ0FBYSxZQUFZLDJCQUFaLEdBQTBDLFdBQTFDLEdBQXdELDJEQUF4RCxHQUFzSCxXQUF0SCxHQUFvSSxHQUFqSjtBQUNEO0FBQ0QsV0FBTyxVQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxXQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCLE9BQXJCLEVBQThCO0FBQzVCLFFBQUksbUJBQUo7O0FBRUE7QUFDQSxRQUFJLENBQUMsbUJBQW1CLEtBQUssUUFBTCxDQUFjLFNBQWpDLEVBQTRDLE9BQTVDLEVBQXFELGNBQXJELENBQUwsRUFBMkU7QUFDekUsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQsUUFBSSxlQUFlLFFBQVEsT0FBM0I7O0FBRUE7QUFDQSxRQUFJLE9BQU8sWUFBUCxLQUF3QixRQUE1QixFQUFzQztBQUNwQyxxQkFBZSxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLGFBQXJCLENBQW1DLFlBQW5DLENBQWY7O0FBRUE7QUFDQSxVQUFJLENBQUMsWUFBTCxFQUFtQjtBQUNqQixlQUFPLElBQVA7QUFDRDtBQUNGLEtBUEQsTUFPTztBQUNMO0FBQ0E7QUFDQSxVQUFJLENBQUMsS0FBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixRQUFyQixDQUE4QixZQUE5QixDQUFMLEVBQWtEO0FBQ2hELGdCQUFRLElBQVIsQ0FBYSwrREFBYjtBQUNBLGVBQU8sSUFBUDtBQUNEO0FBQ0Y7O0FBRUQsUUFBSSxZQUFZLEtBQUssU0FBTCxDQUFlLEtBQWYsQ0FBcUIsR0FBckIsRUFBMEIsQ0FBMUIsQ0FBaEI7QUFDQSxRQUFJLGdCQUFnQixLQUFLLE9BQXpCO0FBQUEsUUFDSSxTQUFTLGNBQWMsTUFEM0I7QUFBQSxRQUVJLFlBQVksY0FBYyxTQUY5Qjs7QUFJQSxRQUFJLGFBQWEsQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixPQUFsQixDQUEwQixTQUExQixNQUF5QyxDQUFDLENBQTNEOztBQUVBLFFBQUksTUFBTSxhQUFhLFFBQWIsR0FBd0IsT0FBbEM7QUFDQSxRQUFJLGtCQUFrQixhQUFhLEtBQWIsR0FBcUIsTUFBM0M7QUFDQSxRQUFJLE9BQU8sZ0JBQWdCLFdBQWhCLEVBQVg7QUFDQSxRQUFJLFVBQVUsYUFBYSxNQUFiLEdBQXNCLEtBQXBDO0FBQ0EsUUFBSSxTQUFTLGFBQWEsUUFBYixHQUF3QixPQUFyQztBQUNBLFFBQUksbUJBQW1CLGNBQWMsWUFBZCxFQUE0QixHQUE1QixDQUF2Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQUksVUFBVSxNQUFWLElBQW9CLGdCQUFwQixHQUF1QyxPQUFPLElBQVAsQ0FBM0MsRUFBeUQ7QUFDdkQsV0FBSyxPQUFMLENBQWEsTUFBYixDQUFvQixJQUFwQixLQUE2QixPQUFPLElBQVAsS0FBZ0IsVUFBVSxNQUFWLElBQW9CLGdCQUFwQyxDQUE3QjtBQUNEO0FBQ0Q7QUFDQSxRQUFJLFVBQVUsSUFBVixJQUFrQixnQkFBbEIsR0FBcUMsT0FBTyxNQUFQLENBQXpDLEVBQXlEO0FBQ3ZELFdBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsSUFBcEIsS0FBNkIsVUFBVSxJQUFWLElBQWtCLGdCQUFsQixHQUFxQyxPQUFPLE1BQVAsQ0FBbEU7QUFDRDtBQUNELFNBQUssT0FBTCxDQUFhLE1BQWIsR0FBc0IsY0FBYyxLQUFLLE9BQUwsQ0FBYSxNQUEzQixDQUF0Qjs7QUFFQTtBQUNBLFFBQUksU0FBUyxVQUFVLElBQVYsSUFBa0IsVUFBVSxHQUFWLElBQWlCLENBQW5DLEdBQXVDLG1CQUFtQixDQUF2RTs7QUFFQTtBQUNBO0FBQ0EsUUFBSSxNQUFNLHlCQUF5QixLQUFLLFFBQUwsQ0FBYyxNQUF2QyxDQUFWO0FBQ0EsUUFBSSxtQkFBbUIsV0FBVyxJQUFJLFdBQVcsZUFBZixDQUFYLEVBQTRDLEVBQTVDLENBQXZCO0FBQ0EsUUFBSSxtQkFBbUIsV0FBVyxJQUFJLFdBQVcsZUFBWCxHQUE2QixPQUFqQyxDQUFYLEVBQXNELEVBQXRELENBQXZCO0FBQ0EsUUFBSSxZQUFZLFNBQVMsS0FBSyxPQUFMLENBQWEsTUFBYixDQUFvQixJQUFwQixDQUFULEdBQXFDLGdCQUFyQyxHQUF3RCxnQkFBeEU7O0FBRUE7QUFDQSxnQkFBWSxLQUFLLEdBQUwsQ0FBUyxLQUFLLEdBQUwsQ0FBUyxPQUFPLEdBQVAsSUFBYyxnQkFBdkIsRUFBeUMsU0FBekMsQ0FBVCxFQUE4RCxDQUE5RCxDQUFaOztBQUVBLFNBQUssWUFBTCxHQUFvQixZQUFwQjtBQUNBLFNBQUssT0FBTCxDQUFhLEtBQWIsSUFBc0Isc0JBQXNCLEVBQXRCLEVBQTBCLGlCQUFpQixtQkFBakIsRUFBc0MsSUFBdEMsRUFBNEMsS0FBSyxLQUFMLENBQVcsU0FBWCxDQUE1QyxDQUExQixFQUE4RixpQkFBaUIsbUJBQWpCLEVBQXNDLE9BQXRDLEVBQStDLEVBQS9DLENBQTlGLEVBQWtKLG1CQUF4Szs7QUFFQSxXQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFdBQVMsb0JBQVQsQ0FBOEIsU0FBOUIsRUFBeUM7QUFDdkMsUUFBSSxjQUFjLEtBQWxCLEVBQXlCO0FBQ3ZCLGFBQU8sT0FBUDtBQUNELEtBRkQsTUFFTyxJQUFJLGNBQWMsT0FBbEIsRUFBMkI7QUFDaEMsYUFBTyxLQUFQO0FBQ0Q7QUFDRCxXQUFPLFNBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStCQSxNQUFJLGFBQWEsQ0FBQyxZQUFELEVBQWUsTUFBZixFQUF1QixVQUF2QixFQUFtQyxXQUFuQyxFQUFnRCxLQUFoRCxFQUF1RCxTQUF2RCxFQUFrRSxhQUFsRSxFQUFpRixPQUFqRixFQUEwRixXQUExRixFQUF1RyxZQUF2RyxFQUFxSCxRQUFySCxFQUErSCxjQUEvSCxFQUErSSxVQUEvSSxFQUEySixNQUEzSixFQUFtSyxZQUFuSyxDQUFqQjs7QUFFQTtBQUNBLE1BQUksa0JBQWtCLFdBQVcsS0FBWCxDQUFpQixDQUFqQixDQUF0Qjs7QUFFQTs7Ozs7Ozs7OztBQVVBLFdBQVMsU0FBVCxDQUFtQixTQUFuQixFQUE4QjtBQUM1QixRQUFJLFVBQVUsVUFBVSxNQUFWLEdBQW1CLENBQW5CLElBQXdCLFVBQVUsQ0FBVixNQUFpQixTQUF6QyxHQUFxRCxVQUFVLENBQVYsQ0FBckQsR0FBb0UsS0FBbEY7O0FBRUEsUUFBSSxRQUFRLGdCQUFnQixPQUFoQixDQUF3QixTQUF4QixDQUFaO0FBQ0EsUUFBSSxNQUFNLGdCQUFnQixLQUFoQixDQUFzQixRQUFRLENBQTlCLEVBQWlDLE1BQWpDLENBQXdDLGdCQUFnQixLQUFoQixDQUFzQixDQUF0QixFQUF5QixLQUF6QixDQUF4QyxDQUFWO0FBQ0EsV0FBTyxVQUFVLElBQUksT0FBSixFQUFWLEdBQTBCLEdBQWpDO0FBQ0Q7O0FBRUQsTUFBSSxZQUFZO0FBQ2QsVUFBTSxNQURRO0FBRWQsZUFBVyxXQUZHO0FBR2Qsc0JBQWtCO0FBSEosR0FBaEI7O0FBTUE7Ozs7Ozs7QUFPQSxXQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CLE9BQXBCLEVBQTZCO0FBQzNCO0FBQ0EsUUFBSSxrQkFBa0IsS0FBSyxRQUFMLENBQWMsU0FBaEMsRUFBMkMsT0FBM0MsQ0FBSixFQUF5RDtBQUN2RCxhQUFPLElBQVA7QUFDRDs7QUFFRCxRQUFJLEtBQUssT0FBTCxJQUFnQixLQUFLLFNBQUwsS0FBbUIsS0FBSyxpQkFBNUMsRUFBK0Q7QUFDN0Q7QUFDQSxhQUFPLElBQVA7QUFDRDs7QUFFRCxRQUFJLGFBQWEsY0FBYyxLQUFLLFFBQUwsQ0FBYyxNQUE1QixFQUFvQyxLQUFLLFFBQUwsQ0FBYyxTQUFsRCxFQUE2RCxRQUFRLE9BQXJFLEVBQThFLFFBQVEsaUJBQXRGLEVBQXlHLEtBQUssYUFBOUcsQ0FBakI7O0FBRUEsUUFBSSxZQUFZLEtBQUssU0FBTCxDQUFlLEtBQWYsQ0FBcUIsR0FBckIsRUFBMEIsQ0FBMUIsQ0FBaEI7QUFDQSxRQUFJLG9CQUFvQixxQkFBcUIsU0FBckIsQ0FBeEI7QUFDQSxRQUFJLFlBQVksS0FBSyxTQUFMLENBQWUsS0FBZixDQUFxQixHQUFyQixFQUEwQixDQUExQixLQUFnQyxFQUFoRDs7QUFFQSxRQUFJLFlBQVksRUFBaEI7O0FBRUEsWUFBUSxRQUFRLFFBQWhCO0FBQ0UsV0FBSyxVQUFVLElBQWY7QUFDRSxvQkFBWSxDQUFDLFNBQUQsRUFBWSxpQkFBWixDQUFaO0FBQ0E7QUFDRixXQUFLLFVBQVUsU0FBZjtBQUNFLG9CQUFZLFVBQVUsU0FBVixDQUFaO0FBQ0E7QUFDRixXQUFLLFVBQVUsZ0JBQWY7QUFDRSxvQkFBWSxVQUFVLFNBQVYsRUFBcUIsSUFBckIsQ0FBWjtBQUNBO0FBQ0Y7QUFDRSxvQkFBWSxRQUFRLFFBQXBCO0FBWEo7O0FBY0EsY0FBVSxPQUFWLENBQWtCLFVBQVUsSUFBVixFQUFnQixLQUFoQixFQUF1QjtBQUN2QyxVQUFJLGNBQWMsSUFBZCxJQUFzQixVQUFVLE1BQVYsS0FBcUIsUUFBUSxDQUF2RCxFQUEwRDtBQUN4RCxlQUFPLElBQVA7QUFDRDs7QUFFRCxrQkFBWSxLQUFLLFNBQUwsQ0FBZSxLQUFmLENBQXFCLEdBQXJCLEVBQTBCLENBQTFCLENBQVo7QUFDQSwwQkFBb0IscUJBQXFCLFNBQXJCLENBQXBCOztBQUVBLFVBQUksZ0JBQWdCLEtBQUssT0FBTCxDQUFhLE1BQWpDO0FBQ0EsVUFBSSxhQUFhLEtBQUssT0FBTCxDQUFhLFNBQTlCOztBQUVBO0FBQ0EsVUFBSSxRQUFRLEtBQUssS0FBakI7QUFDQSxVQUFJLGNBQWMsY0FBYyxNQUFkLElBQXdCLE1BQU0sY0FBYyxLQUFwQixJQUE2QixNQUFNLFdBQVcsSUFBakIsQ0FBckQsSUFBK0UsY0FBYyxPQUFkLElBQXlCLE1BQU0sY0FBYyxJQUFwQixJQUE0QixNQUFNLFdBQVcsS0FBakIsQ0FBcEksSUFBK0osY0FBYyxLQUFkLElBQXVCLE1BQU0sY0FBYyxNQUFwQixJQUE4QixNQUFNLFdBQVcsR0FBakIsQ0FBcE4sSUFBNk8sY0FBYyxRQUFkLElBQTBCLE1BQU0sY0FBYyxHQUFwQixJQUEyQixNQUFNLFdBQVcsTUFBakIsQ0FBcFQ7O0FBRUEsVUFBSSxnQkFBZ0IsTUFBTSxjQUFjLElBQXBCLElBQTRCLE1BQU0sV0FBVyxJQUFqQixDQUFoRDtBQUNBLFVBQUksaUJBQWlCLE1BQU0sY0FBYyxLQUFwQixJQUE2QixNQUFNLFdBQVcsS0FBakIsQ0FBbEQ7QUFDQSxVQUFJLGVBQWUsTUFBTSxjQUFjLEdBQXBCLElBQTJCLE1BQU0sV0FBVyxHQUFqQixDQUE5QztBQUNBLFVBQUksa0JBQWtCLE1BQU0sY0FBYyxNQUFwQixJQUE4QixNQUFNLFdBQVcsTUFBakIsQ0FBcEQ7O0FBRUEsVUFBSSxzQkFBc0IsY0FBYyxNQUFkLElBQXdCLGFBQXhCLElBQXlDLGNBQWMsT0FBZCxJQUF5QixjQUFsRSxJQUFvRixjQUFjLEtBQWQsSUFBdUIsWUFBM0csSUFBMkgsY0FBYyxRQUFkLElBQTBCLGVBQS9LOztBQUVBO0FBQ0EsVUFBSSxhQUFhLENBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsT0FBbEIsQ0FBMEIsU0FBMUIsTUFBeUMsQ0FBQyxDQUEzRDtBQUNBLFVBQUksbUJBQW1CLENBQUMsQ0FBQyxRQUFRLGNBQVYsS0FBNkIsY0FBYyxjQUFjLE9BQTVCLElBQXVDLGFBQXZDLElBQXdELGNBQWMsY0FBYyxLQUE1QixJQUFxQyxjQUE3RixJQUErRyxDQUFDLFVBQUQsSUFBZSxjQUFjLE9BQTdCLElBQXdDLFlBQXZKLElBQXVLLENBQUMsVUFBRCxJQUFlLGNBQWMsS0FBN0IsSUFBc0MsZUFBMU8sQ0FBdkI7O0FBRUEsVUFBSSxlQUFlLG1CQUFmLElBQXNDLGdCQUExQyxFQUE0RDtBQUMxRDtBQUNBLGFBQUssT0FBTCxHQUFlLElBQWY7O0FBRUEsWUFBSSxlQUFlLG1CQUFuQixFQUF3QztBQUN0QyxzQkFBWSxVQUFVLFFBQVEsQ0FBbEIsQ0FBWjtBQUNEOztBQUVELFlBQUksZ0JBQUosRUFBc0I7QUFDcEIsc0JBQVkscUJBQXFCLFNBQXJCLENBQVo7QUFDRDs7QUFFRCxhQUFLLFNBQUwsR0FBaUIsYUFBYSxZQUFZLE1BQU0sU0FBbEIsR0FBOEIsRUFBM0MsQ0FBakI7O0FBRUE7QUFDQTtBQUNBLGFBQUssT0FBTCxDQUFhLE1BQWIsR0FBc0IsV0FBVyxFQUFYLEVBQWUsS0FBSyxPQUFMLENBQWEsTUFBNUIsRUFBb0MsaUJBQWlCLEtBQUssUUFBTCxDQUFjLE1BQS9CLEVBQXVDLEtBQUssT0FBTCxDQUFhLFNBQXBELEVBQStELEtBQUssU0FBcEUsQ0FBcEMsQ0FBdEI7O0FBRUEsZUFBTyxhQUFhLEtBQUssUUFBTCxDQUFjLFNBQTNCLEVBQXNDLElBQXRDLEVBQTRDLE1BQTVDLENBQVA7QUFDRDtBQUNGLEtBOUNEO0FBK0NBLFdBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBT0EsV0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCO0FBQzFCLFFBQUksZ0JBQWdCLEtBQUssT0FBekI7QUFBQSxRQUNJLFNBQVMsY0FBYyxNQUQzQjtBQUFBLFFBRUksWUFBWSxjQUFjLFNBRjlCOztBQUlBLFFBQUksWUFBWSxLQUFLLFNBQUwsQ0FBZSxLQUFmLENBQXFCLEdBQXJCLEVBQTBCLENBQTFCLENBQWhCO0FBQ0EsUUFBSSxRQUFRLEtBQUssS0FBakI7QUFDQSxRQUFJLGFBQWEsQ0FBQyxLQUFELEVBQVEsUUFBUixFQUFrQixPQUFsQixDQUEwQixTQUExQixNQUF5QyxDQUFDLENBQTNEO0FBQ0EsUUFBSSxPQUFPLGFBQWEsT0FBYixHQUF1QixRQUFsQztBQUNBLFFBQUksU0FBUyxhQUFhLE1BQWIsR0FBc0IsS0FBbkM7QUFDQSxRQUFJLGNBQWMsYUFBYSxPQUFiLEdBQXVCLFFBQXpDOztBQUVBLFFBQUksT0FBTyxJQUFQLElBQWUsTUFBTSxVQUFVLE1BQVYsQ0FBTixDQUFuQixFQUE2QztBQUMzQyxXQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLE1BQXBCLElBQThCLE1BQU0sVUFBVSxNQUFWLENBQU4sSUFBMkIsT0FBTyxXQUFQLENBQXpEO0FBQ0Q7QUFDRCxRQUFJLE9BQU8sTUFBUCxJQUFpQixNQUFNLFVBQVUsSUFBVixDQUFOLENBQXJCLEVBQTZDO0FBQzNDLFdBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsTUFBcEIsSUFBOEIsTUFBTSxVQUFVLElBQVYsQ0FBTixDQUE5QjtBQUNEOztBQUVELFdBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7QUFZQSxXQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0IsV0FBdEIsRUFBbUMsYUFBbkMsRUFBa0QsZ0JBQWxELEVBQW9FO0FBQ2xFO0FBQ0EsUUFBSSxRQUFRLElBQUksS0FBSixDQUFVLDJCQUFWLENBQVo7QUFDQSxRQUFJLFFBQVEsQ0FBQyxNQUFNLENBQU4sQ0FBYjtBQUNBLFFBQUksT0FBTyxNQUFNLENBQU4sQ0FBWDs7QUFFQTtBQUNBLFFBQUksQ0FBQyxLQUFMLEVBQVk7QUFDVixhQUFPLEdBQVA7QUFDRDs7QUFFRCxRQUFJLEtBQUssT0FBTCxDQUFhLEdBQWIsTUFBc0IsQ0FBMUIsRUFBNkI7QUFDM0IsVUFBSSxVQUFVLEtBQUssQ0FBbkI7QUFDQSxjQUFRLElBQVI7QUFDRSxhQUFLLElBQUw7QUFDRSxvQkFBVSxhQUFWO0FBQ0E7QUFDRixhQUFLLEdBQUw7QUFDQSxhQUFLLElBQUw7QUFDQTtBQUNFLG9CQUFVLGdCQUFWO0FBUEo7O0FBVUEsVUFBSSxPQUFPLGNBQWMsT0FBZCxDQUFYO0FBQ0EsYUFBTyxLQUFLLFdBQUwsSUFBb0IsR0FBcEIsR0FBMEIsS0FBakM7QUFDRCxLQWRELE1BY08sSUFBSSxTQUFTLElBQVQsSUFBaUIsU0FBUyxJQUE5QixFQUFvQztBQUN6QztBQUNBLFVBQUksT0FBTyxLQUFLLENBQWhCO0FBQ0EsVUFBSSxTQUFTLElBQWIsRUFBbUI7QUFDakIsZUFBTyxLQUFLLEdBQUwsQ0FBUyxTQUFTLGVBQVQsQ0FBeUIsWUFBbEMsRUFBZ0QsT0FBTyxXQUFQLElBQXNCLENBQXRFLENBQVA7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPLEtBQUssR0FBTCxDQUFTLFNBQVMsZUFBVCxDQUF5QixXQUFsQyxFQUErQyxPQUFPLFVBQVAsSUFBcUIsQ0FBcEUsQ0FBUDtBQUNEO0FBQ0QsYUFBTyxPQUFPLEdBQVAsR0FBYSxLQUFwQjtBQUNELEtBVE0sTUFTQTtBQUNMO0FBQ0E7QUFDQSxhQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7OztBQVdBLFdBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixhQUE3QixFQUE0QyxnQkFBNUMsRUFBOEQsYUFBOUQsRUFBNkU7QUFDM0UsUUFBSSxVQUFVLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBZDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFJLFlBQVksQ0FBQyxPQUFELEVBQVUsTUFBVixFQUFrQixPQUFsQixDQUEwQixhQUExQixNQUE2QyxDQUFDLENBQTlEOztBQUVBO0FBQ0E7QUFDQSxRQUFJLFlBQVksT0FBTyxLQUFQLENBQWEsU0FBYixFQUF3QixHQUF4QixDQUE0QixVQUFVLElBQVYsRUFBZ0I7QUFDMUQsYUFBTyxLQUFLLElBQUwsRUFBUDtBQUNELEtBRmUsQ0FBaEI7O0FBSUE7QUFDQTtBQUNBLFFBQUksVUFBVSxVQUFVLE9BQVYsQ0FBa0IsS0FBSyxTQUFMLEVBQWdCLFVBQVUsSUFBVixFQUFnQjtBQUM5RCxhQUFPLEtBQUssTUFBTCxDQUFZLE1BQVosTUFBd0IsQ0FBQyxDQUFoQztBQUNELEtBRitCLENBQWxCLENBQWQ7O0FBSUEsUUFBSSxVQUFVLE9BQVYsS0FBc0IsVUFBVSxPQUFWLEVBQW1CLE9BQW5CLENBQTJCLEdBQTNCLE1BQW9DLENBQUMsQ0FBL0QsRUFBa0U7QUFDaEUsY0FBUSxJQUFSLENBQWEsOEVBQWI7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsUUFBSSxhQUFhLGFBQWpCO0FBQ0EsUUFBSSxNQUFNLFlBQVksQ0FBQyxDQUFiLEdBQWlCLENBQUMsVUFBVSxLQUFWLENBQWdCLENBQWhCLEVBQW1CLE9BQW5CLEVBQTRCLE1BQTVCLENBQW1DLENBQUMsVUFBVSxPQUFWLEVBQW1CLEtBQW5CLENBQXlCLFVBQXpCLEVBQXFDLENBQXJDLENBQUQsQ0FBbkMsQ0FBRCxFQUFnRixDQUFDLFVBQVUsT0FBVixFQUFtQixLQUFuQixDQUF5QixVQUF6QixFQUFxQyxDQUFyQyxDQUFELEVBQTBDLE1BQTFDLENBQWlELFVBQVUsS0FBVixDQUFnQixVQUFVLENBQTFCLENBQWpELENBQWhGLENBQWpCLEdBQW1MLENBQUMsU0FBRCxDQUE3TDs7QUFFQTtBQUNBLFVBQU0sSUFBSSxHQUFKLENBQVEsVUFBVSxFQUFWLEVBQWMsS0FBZCxFQUFxQjtBQUNqQztBQUNBLFVBQUksY0FBYyxDQUFDLFVBQVUsQ0FBVixHQUFjLENBQUMsU0FBZixHQUEyQixTQUE1QixJQUF5QyxRQUF6QyxHQUFvRCxPQUF0RTtBQUNBLFVBQUksb0JBQW9CLEtBQXhCO0FBQ0EsYUFBTztBQUNQO0FBQ0E7QUFGTyxPQUdOLE1BSE0sQ0FHQyxVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQ3RCLFlBQUksRUFBRSxFQUFFLE1BQUYsR0FBVyxDQUFiLE1BQW9CLEVBQXBCLElBQTBCLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxPQUFYLENBQW1CLENBQW5CLE1BQTBCLENBQUMsQ0FBekQsRUFBNEQ7QUFDMUQsWUFBRSxFQUFFLE1BQUYsR0FBVyxDQUFiLElBQWtCLENBQWxCO0FBQ0EsOEJBQW9CLElBQXBCO0FBQ0EsaUJBQU8sQ0FBUDtBQUNELFNBSkQsTUFJTyxJQUFJLGlCQUFKLEVBQXVCO0FBQzVCLFlBQUUsRUFBRSxNQUFGLEdBQVcsQ0FBYixLQUFtQixDQUFuQjtBQUNBLDhCQUFvQixLQUFwQjtBQUNBLGlCQUFPLENBQVA7QUFDRCxTQUpNLE1BSUE7QUFDTCxpQkFBTyxFQUFFLE1BQUYsQ0FBUyxDQUFULENBQVA7QUFDRDtBQUNGLE9BZk0sRUFlSixFQWZJO0FBZ0JQO0FBaEJPLE9BaUJOLEdBakJNLENBaUJGLFVBQVUsR0FBVixFQUFlO0FBQ2xCLGVBQU8sUUFBUSxHQUFSLEVBQWEsV0FBYixFQUEwQixhQUExQixFQUF5QyxnQkFBekMsQ0FBUDtBQUNELE9BbkJNLENBQVA7QUFvQkQsS0F4QkssQ0FBTjs7QUEwQkE7QUFDQSxRQUFJLE9BQUosQ0FBWSxVQUFVLEVBQVYsRUFBYyxLQUFkLEVBQXFCO0FBQy9CLFNBQUcsT0FBSCxDQUFXLFVBQVUsSUFBVixFQUFnQixNQUFoQixFQUF3QjtBQUNqQyxZQUFJLFVBQVUsSUFBVixDQUFKLEVBQXFCO0FBQ25CLGtCQUFRLEtBQVIsS0FBa0IsUUFBUSxHQUFHLFNBQVMsQ0FBWixNQUFtQixHQUFuQixHQUF5QixDQUFDLENBQTFCLEdBQThCLENBQXRDLENBQWxCO0FBQ0Q7QUFDRixPQUpEO0FBS0QsS0FORDtBQU9BLFdBQU8sT0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7QUFTQSxXQUFTLE1BQVQsQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsRUFBNEI7QUFDMUIsUUFBSSxTQUFTLEtBQUssTUFBbEI7QUFDQSxRQUFJLFlBQVksS0FBSyxTQUFyQjtBQUFBLFFBQ0ksZ0JBQWdCLEtBQUssT0FEekI7QUFBQSxRQUVJLFNBQVMsY0FBYyxNQUYzQjtBQUFBLFFBR0ksWUFBWSxjQUFjLFNBSDlCOztBQUtBLFFBQUksZ0JBQWdCLFVBQVUsS0FBVixDQUFnQixHQUFoQixFQUFxQixDQUFyQixDQUFwQjs7QUFFQSxRQUFJLFVBQVUsS0FBSyxDQUFuQjtBQUNBLFFBQUksVUFBVSxDQUFDLE1BQVgsQ0FBSixFQUF3QjtBQUN0QixnQkFBVSxDQUFDLENBQUMsTUFBRixFQUFVLENBQVYsQ0FBVjtBQUNELEtBRkQsTUFFTztBQUNMLGdCQUFVLFlBQVksTUFBWixFQUFvQixNQUFwQixFQUE0QixTQUE1QixFQUF1QyxhQUF2QyxDQUFWO0FBQ0Q7O0FBRUQsUUFBSSxrQkFBa0IsTUFBdEIsRUFBOEI7QUFDNUIsYUFBTyxHQUFQLElBQWMsUUFBUSxDQUFSLENBQWQ7QUFDQSxhQUFPLElBQVAsSUFBZSxRQUFRLENBQVIsQ0FBZjtBQUNELEtBSEQsTUFHTyxJQUFJLGtCQUFrQixPQUF0QixFQUErQjtBQUNwQyxhQUFPLEdBQVAsSUFBYyxRQUFRLENBQVIsQ0FBZDtBQUNBLGFBQU8sSUFBUCxJQUFlLFFBQVEsQ0FBUixDQUFmO0FBQ0QsS0FITSxNQUdBLElBQUksa0JBQWtCLEtBQXRCLEVBQTZCO0FBQ2xDLGFBQU8sSUFBUCxJQUFlLFFBQVEsQ0FBUixDQUFmO0FBQ0EsYUFBTyxHQUFQLElBQWMsUUFBUSxDQUFSLENBQWQ7QUFDRCxLQUhNLE1BR0EsSUFBSSxrQkFBa0IsUUFBdEIsRUFBZ0M7QUFDckMsYUFBTyxJQUFQLElBQWUsUUFBUSxDQUFSLENBQWY7QUFDQSxhQUFPLEdBQVAsSUFBYyxRQUFRLENBQVIsQ0FBZDtBQUNEOztBQUVELFNBQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFdBQVMsZUFBVCxDQUF5QixJQUF6QixFQUErQixPQUEvQixFQUF3QztBQUN0QyxRQUFJLG9CQUFvQixRQUFRLGlCQUFSLElBQTZCLGdCQUFnQixLQUFLLFFBQUwsQ0FBYyxNQUE5QixDQUFyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFJLEtBQUssUUFBTCxDQUFjLFNBQWQsS0FBNEIsaUJBQWhDLEVBQW1EO0FBQ2pELDBCQUFvQixnQkFBZ0IsaUJBQWhCLENBQXBCO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsUUFBSSxnQkFBZ0IseUJBQXlCLFdBQXpCLENBQXBCO0FBQ0EsUUFBSSxlQUFlLEtBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsS0FBeEMsQ0Fkc0MsQ0FjUztBQUMvQyxRQUFJLE1BQU0sYUFBYSxHQUF2QjtBQUFBLFFBQ0ksT0FBTyxhQUFhLElBRHhCO0FBQUEsUUFFSSxZQUFZLGFBQWEsYUFBYixDQUZoQjs7QUFJQSxpQkFBYSxHQUFiLEdBQW1CLEVBQW5CO0FBQ0EsaUJBQWEsSUFBYixHQUFvQixFQUFwQjtBQUNBLGlCQUFhLGFBQWIsSUFBOEIsRUFBOUI7O0FBRUEsUUFBSSxhQUFhLGNBQWMsS0FBSyxRQUFMLENBQWMsTUFBNUIsRUFBb0MsS0FBSyxRQUFMLENBQWMsU0FBbEQsRUFBNkQsUUFBUSxPQUFyRSxFQUE4RSxpQkFBOUUsRUFBaUcsS0FBSyxhQUF0RyxDQUFqQjs7QUFFQTtBQUNBO0FBQ0EsaUJBQWEsR0FBYixHQUFtQixHQUFuQjtBQUNBLGlCQUFhLElBQWIsR0FBb0IsSUFBcEI7QUFDQSxpQkFBYSxhQUFiLElBQThCLFNBQTlCOztBQUVBLFlBQVEsVUFBUixHQUFxQixVQUFyQjs7QUFFQSxRQUFJLFFBQVEsUUFBUSxRQUFwQjtBQUNBLFFBQUksU0FBUyxLQUFLLE9BQUwsQ0FBYSxNQUExQjs7QUFFQSxRQUFJLFFBQVE7QUFDVixlQUFTLFNBQVMsT0FBVCxDQUFpQixTQUFqQixFQUE0QjtBQUNuQyxZQUFJLFFBQVEsT0FBTyxTQUFQLENBQVo7QUFDQSxZQUFJLE9BQU8sU0FBUCxJQUFvQixXQUFXLFNBQVgsQ0FBcEIsSUFBNkMsQ0FBQyxRQUFRLG1CQUExRCxFQUErRTtBQUM3RSxrQkFBUSxLQUFLLEdBQUwsQ0FBUyxPQUFPLFNBQVAsQ0FBVCxFQUE0QixXQUFXLFNBQVgsQ0FBNUIsQ0FBUjtBQUNEO0FBQ0QsZUFBTyxpQkFBaUIsRUFBakIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBaEMsQ0FBUDtBQUNELE9BUFM7QUFRVixpQkFBVyxTQUFTLFNBQVQsQ0FBbUIsU0FBbkIsRUFBOEI7QUFDdkMsWUFBSSxXQUFXLGNBQWMsT0FBZCxHQUF3QixNQUF4QixHQUFpQyxLQUFoRDtBQUNBLFlBQUksUUFBUSxPQUFPLFFBQVAsQ0FBWjtBQUNBLFlBQUksT0FBTyxTQUFQLElBQW9CLFdBQVcsU0FBWCxDQUFwQixJQUE2QyxDQUFDLFFBQVEsbUJBQTFELEVBQStFO0FBQzdFLGtCQUFRLEtBQUssR0FBTCxDQUFTLE9BQU8sUUFBUCxDQUFULEVBQTJCLFdBQVcsU0FBWCxLQUF5QixjQUFjLE9BQWQsR0FBd0IsT0FBTyxLQUEvQixHQUF1QyxPQUFPLE1BQXZFLENBQTNCLENBQVI7QUFDRDtBQUNELGVBQU8saUJBQWlCLEVBQWpCLEVBQXFCLFFBQXJCLEVBQStCLEtBQS9CLENBQVA7QUFDRDtBQWZTLEtBQVo7O0FBa0JBLFVBQU0sT0FBTixDQUFjLFVBQVUsU0FBVixFQUFxQjtBQUNqQyxVQUFJLE9BQU8sQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixPQUFoQixDQUF3QixTQUF4QixNQUF1QyxDQUFDLENBQXhDLEdBQTRDLFNBQTVDLEdBQXdELFdBQW5FO0FBQ0EsZUFBUyxXQUFXLEVBQVgsRUFBZSxNQUFmLEVBQXVCLE1BQU0sSUFBTixFQUFZLFNBQVosQ0FBdkIsQ0FBVDtBQUNELEtBSEQ7O0FBS0EsU0FBSyxPQUFMLENBQWEsTUFBYixHQUFzQixNQUF0Qjs7QUFFQSxXQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFdBQVMsS0FBVCxDQUFlLElBQWYsRUFBcUI7QUFDbkIsUUFBSSxZQUFZLEtBQUssU0FBckI7QUFDQSxRQUFJLGdCQUFnQixVQUFVLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBcEI7QUFDQSxRQUFJLGlCQUFpQixVQUFVLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBckI7O0FBRUE7QUFDQSxRQUFJLGNBQUosRUFBb0I7QUFDbEIsVUFBSSxnQkFBZ0IsS0FBSyxPQUF6QjtBQUFBLFVBQ0ksWUFBWSxjQUFjLFNBRDlCO0FBQUEsVUFFSSxTQUFTLGNBQWMsTUFGM0I7O0FBSUEsVUFBSSxhQUFhLENBQUMsUUFBRCxFQUFXLEtBQVgsRUFBa0IsT0FBbEIsQ0FBMEIsYUFBMUIsTUFBNkMsQ0FBQyxDQUEvRDtBQUNBLFVBQUksT0FBTyxhQUFhLE1BQWIsR0FBc0IsS0FBakM7QUFDQSxVQUFJLGNBQWMsYUFBYSxPQUFiLEdBQXVCLFFBQXpDOztBQUVBLFVBQUksZUFBZTtBQUNqQixlQUFPLGlCQUFpQixFQUFqQixFQUFxQixJQUFyQixFQUEyQixVQUFVLElBQVYsQ0FBM0IsQ0FEVTtBQUVqQixhQUFLLGlCQUFpQixFQUFqQixFQUFxQixJQUFyQixFQUEyQixVQUFVLElBQVYsSUFBa0IsVUFBVSxXQUFWLENBQWxCLEdBQTJDLE9BQU8sV0FBUCxDQUF0RTtBQUZZLE9BQW5COztBQUtBLFdBQUssT0FBTCxDQUFhLE1BQWIsR0FBc0IsV0FBVyxFQUFYLEVBQWUsTUFBZixFQUF1QixhQUFhLGNBQWIsQ0FBdkIsQ0FBdEI7QUFDRDs7QUFFRCxXQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFdBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0I7QUFDbEIsUUFBSSxDQUFDLG1CQUFtQixLQUFLLFFBQUwsQ0FBYyxTQUFqQyxFQUE0QyxNQUE1QyxFQUFvRCxpQkFBcEQsQ0FBTCxFQUE2RTtBQUMzRSxhQUFPLElBQVA7QUFDRDs7QUFFRCxRQUFJLFVBQVUsS0FBSyxPQUFMLENBQWEsU0FBM0I7QUFDQSxRQUFJLFFBQVEsS0FBSyxLQUFLLFFBQUwsQ0FBYyxTQUFuQixFQUE4QixVQUFVLFFBQVYsRUFBb0I7QUFDNUQsYUFBTyxTQUFTLElBQVQsS0FBa0IsaUJBQXpCO0FBQ0QsS0FGVyxFQUVULFVBRkg7O0FBSUEsUUFBSSxRQUFRLE1BQVIsR0FBaUIsTUFBTSxHQUF2QixJQUE4QixRQUFRLElBQVIsR0FBZSxNQUFNLEtBQW5ELElBQTRELFFBQVEsR0FBUixHQUFjLE1BQU0sTUFBaEYsSUFBMEYsUUFBUSxLQUFSLEdBQWdCLE1BQU0sSUFBcEgsRUFBMEg7QUFDeEg7QUFDQSxVQUFJLEtBQUssSUFBTCxLQUFjLElBQWxCLEVBQXdCO0FBQ3RCLGVBQU8sSUFBUDtBQUNEOztBQUVELFdBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxXQUFLLFVBQUwsQ0FBZ0IscUJBQWhCLElBQXlDLEVBQXpDO0FBQ0QsS0FSRCxNQVFPO0FBQ0w7QUFDQSxVQUFJLEtBQUssSUFBTCxLQUFjLEtBQWxCLEVBQXlCO0FBQ3ZCLGVBQU8sSUFBUDtBQUNEOztBQUVELFdBQUssSUFBTCxHQUFZLEtBQVo7QUFDQSxXQUFLLFVBQUwsQ0FBZ0IscUJBQWhCLElBQXlDLEtBQXpDO0FBQ0Q7O0FBRUQsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxXQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCO0FBQ25CLFFBQUksWUFBWSxLQUFLLFNBQXJCO0FBQ0EsUUFBSSxnQkFBZ0IsVUFBVSxLQUFWLENBQWdCLEdBQWhCLEVBQXFCLENBQXJCLENBQXBCO0FBQ0EsUUFBSSxnQkFBZ0IsS0FBSyxPQUF6QjtBQUFBLFFBQ0ksU0FBUyxjQUFjLE1BRDNCO0FBQUEsUUFFSSxZQUFZLGNBQWMsU0FGOUI7O0FBSUEsUUFBSSxVQUFVLENBQUMsTUFBRCxFQUFTLE9BQVQsRUFBa0IsT0FBbEIsQ0FBMEIsYUFBMUIsTUFBNkMsQ0FBQyxDQUE1RDs7QUFFQSxRQUFJLGlCQUFpQixDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLE9BQWhCLENBQXdCLGFBQXhCLE1BQTJDLENBQUMsQ0FBakU7O0FBRUEsV0FBTyxVQUFVLE1BQVYsR0FBbUIsS0FBMUIsSUFBbUMsVUFBVSxhQUFWLEtBQTRCLGlCQUFpQixPQUFPLFVBQVUsT0FBVixHQUFvQixRQUEzQixDQUFqQixHQUF3RCxDQUFwRixDQUFuQzs7QUFFQSxTQUFLLFNBQUwsR0FBaUIscUJBQXFCLFNBQXJCLENBQWpCO0FBQ0EsU0FBSyxPQUFMLENBQWEsTUFBYixHQUFzQixjQUFjLE1BQWQsQ0FBdEI7O0FBRUEsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7OztBQVlBOzs7Ozs7Ozs7QUFTQSxNQUFJLFlBQVk7QUFDZDs7Ozs7Ozs7QUFRQSxXQUFPO0FBQ0w7QUFDQSxhQUFPLEdBRkY7QUFHTDtBQUNBLGVBQVMsSUFKSjtBQUtMO0FBQ0EsVUFBSTtBQU5DLEtBVE87O0FBa0JkOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNDQSxZQUFRO0FBQ047QUFDQSxhQUFPLEdBRkQ7QUFHTjtBQUNBLGVBQVMsSUFKSDtBQUtOO0FBQ0EsVUFBSSxNQU5FO0FBT047OztBQUdBLGNBQVE7QUFWRixLQXhETTs7QUFxRWQ7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLHFCQUFpQjtBQUNmO0FBQ0EsYUFBTyxHQUZRO0FBR2Y7QUFDQSxlQUFTLElBSk07QUFLZjtBQUNBLFVBQUksZUFOVztBQU9mOzs7OztBQUtBLGdCQUFVLENBQUMsTUFBRCxFQUFTLE9BQVQsRUFBa0IsS0FBbEIsRUFBeUIsUUFBekIsQ0FaSztBQWFmOzs7Ozs7QUFNQSxlQUFTLENBbkJNO0FBb0JmOzs7OztBQUtBLHlCQUFtQjtBQXpCSixLQXRGSDs7QUFrSGQ7Ozs7Ozs7OztBQVNBLGtCQUFjO0FBQ1o7QUFDQSxhQUFPLEdBRks7QUFHWjtBQUNBLGVBQVMsSUFKRztBQUtaO0FBQ0EsVUFBSTtBQU5RLEtBM0hBOztBQW9JZDs7Ozs7Ozs7OztBQVVBLFdBQU87QUFDTDtBQUNBLGFBQU8sR0FGRjtBQUdMO0FBQ0EsZUFBUyxJQUpKO0FBS0w7QUFDQSxVQUFJLEtBTkM7QUFPTDtBQUNBLGVBQVM7QUFSSixLQTlJTzs7QUF5SmQ7Ozs7Ozs7Ozs7O0FBV0EsVUFBTTtBQUNKO0FBQ0EsYUFBTyxHQUZIO0FBR0o7QUFDQSxlQUFTLElBSkw7QUFLSjtBQUNBLFVBQUksSUFOQTtBQU9KOzs7Ozs7QUFNQSxnQkFBVSxNQWJOO0FBY0o7Ozs7QUFJQSxlQUFTLENBbEJMO0FBbUJKOzs7Ozs7QUFNQSx5QkFBbUI7QUF6QmYsS0FwS1E7O0FBZ01kOzs7Ozs7O0FBT0EsV0FBTztBQUNMO0FBQ0EsYUFBTyxHQUZGO0FBR0w7QUFDQSxlQUFTLEtBSko7QUFLTDtBQUNBLFVBQUk7QUFOQyxLQXZNTzs7QUFnTmQ7Ozs7Ozs7Ozs7QUFVQSxVQUFNO0FBQ0o7QUFDQSxhQUFPLEdBRkg7QUFHSjtBQUNBLGVBQVMsSUFKTDtBQUtKO0FBQ0EsVUFBSTtBQU5BLEtBMU5ROztBQW1PZDs7Ozs7Ozs7Ozs7Ozs7O0FBZUEsa0JBQWM7QUFDWjtBQUNBLGFBQU8sR0FGSztBQUdaO0FBQ0EsZUFBUyxJQUpHO0FBS1o7QUFDQSxVQUFJLFlBTlE7QUFPWjs7Ozs7QUFLQSx1QkFBaUIsSUFaTDtBQWFaOzs7OztBQUtBLFNBQUcsUUFsQlM7QUFtQlo7Ozs7O0FBS0EsU0FBRztBQXhCUyxLQWxQQTs7QUE2UWQ7Ozs7Ozs7Ozs7Ozs7OztBQWVBLGdCQUFZO0FBQ1Y7QUFDQSxhQUFPLEdBRkc7QUFHVjtBQUNBLGVBQVMsSUFKQztBQUtWO0FBQ0EsVUFBSSxVQU5NO0FBT1Y7QUFDQSxjQUFRLGdCQVJFO0FBU1Y7Ozs7OztBQU1BLHVCQUFpQjtBQWZQO0FBNVJFLEdBQWhCOztBQStTQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxNQUFJLFdBQVc7QUFDYjs7OztBQUlBLGVBQVcsUUFMRTs7QUFPYjs7OztBQUlBLG1CQUFlLEtBWEY7O0FBYWI7Ozs7QUFJQSxtQkFBZSxJQWpCRjs7QUFtQmI7Ozs7O0FBS0EscUJBQWlCLEtBeEJKOztBQTBCYjs7Ozs7O0FBTUEsY0FBVSxTQUFTLFFBQVQsR0FBb0IsQ0FBRSxDQWhDbkI7O0FBa0NiOzs7Ozs7OztBQVFBLGNBQVUsU0FBUyxRQUFULEdBQW9CLENBQUUsQ0ExQ25COztBQTRDYjs7Ozs7QUFLQSxlQUFXO0FBakRFLEdBQWY7O0FBb0RBOzs7OztBQUtBOzs7OztBQUtBO0FBQ0E7QUFDQSxNQUFJLFNBQVMsWUFBWTtBQUN2Qjs7Ozs7Ozs7QUFRQSxhQUFTLE1BQVQsQ0FBZ0IsU0FBaEIsRUFBMkIsTUFBM0IsRUFBbUM7QUFDakMsVUFBSSxRQUFRLElBQVo7O0FBRUEsVUFBSSxVQUFVLFVBQVUsTUFBVixHQUFtQixDQUFuQixJQUF3QixVQUFVLENBQVYsTUFBaUIsU0FBekMsR0FBcUQsVUFBVSxDQUFWLENBQXJELEdBQW9FLEVBQWxGO0FBQ0EsdUJBQWlCLElBQWpCLEVBQXVCLE1BQXZCOztBQUVBLFdBQUssY0FBTCxHQUFzQixZQUFZO0FBQ2hDLGVBQU8sc0JBQXNCLE1BQU0sTUFBNUIsQ0FBUDtBQUNELE9BRkQ7O0FBSUE7QUFDQSxXQUFLLE1BQUwsR0FBYyxTQUFTLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsSUFBakIsQ0FBVCxDQUFkOztBQUVBO0FBQ0EsV0FBSyxPQUFMLEdBQWUsV0FBVyxFQUFYLEVBQWUsT0FBTyxRQUF0QixFQUFnQyxPQUFoQyxDQUFmOztBQUVBO0FBQ0EsV0FBSyxLQUFMLEdBQWE7QUFDWCxxQkFBYSxLQURGO0FBRVgsbUJBQVcsS0FGQTtBQUdYLHVCQUFlO0FBSEosT0FBYjs7QUFNQTtBQUNBLFdBQUssU0FBTCxHQUFpQixhQUFhLFVBQVUsTUFBdkIsR0FBZ0MsVUFBVSxDQUFWLENBQWhDLEdBQStDLFNBQWhFO0FBQ0EsV0FBSyxNQUFMLEdBQWMsVUFBVSxPQUFPLE1BQWpCLEdBQTBCLE9BQU8sQ0FBUCxDQUExQixHQUFzQyxNQUFwRDs7QUFFQTtBQUNBLFdBQUssT0FBTCxDQUFhLFNBQWIsR0FBeUIsRUFBekI7QUFDQSxhQUFPLElBQVAsQ0FBWSxXQUFXLEVBQVgsRUFBZSxPQUFPLFFBQVAsQ0FBZ0IsU0FBL0IsRUFBMEMsUUFBUSxTQUFsRCxDQUFaLEVBQTBFLE9BQTFFLENBQWtGLFVBQVUsSUFBVixFQUFnQjtBQUNoRyxjQUFNLE9BQU4sQ0FBYyxTQUFkLENBQXdCLElBQXhCLElBQWdDLFdBQVcsRUFBWCxFQUFlLE9BQU8sUUFBUCxDQUFnQixTQUFoQixDQUEwQixJQUExQixLQUFtQyxFQUFsRCxFQUFzRCxRQUFRLFNBQVIsR0FBb0IsUUFBUSxTQUFSLENBQWtCLElBQWxCLENBQXBCLEdBQThDLEVBQXBHLENBQWhDO0FBQ0QsT0FGRDs7QUFJQTtBQUNBLFdBQUssU0FBTCxHQUFpQixPQUFPLElBQVAsQ0FBWSxLQUFLLE9BQUwsQ0FBYSxTQUF6QixFQUFvQyxHQUFwQyxDQUF3QyxVQUFVLElBQVYsRUFBZ0I7QUFDdkUsZUFBTyxXQUFXO0FBQ2hCLGdCQUFNO0FBRFUsU0FBWCxFQUVKLE1BQU0sT0FBTixDQUFjLFNBQWQsQ0FBd0IsSUFBeEIsQ0FGSSxDQUFQO0FBR0QsT0FKZ0I7QUFLakI7QUFMaUIsT0FNaEIsSUFOZ0IsQ0FNWCxVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQ3BCLGVBQU8sRUFBRSxLQUFGLEdBQVUsRUFBRSxLQUFuQjtBQUNELE9BUmdCLENBQWpCOztBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBSyxTQUFMLENBQWUsT0FBZixDQUF1QixVQUFVLGVBQVYsRUFBMkI7QUFDaEQsWUFBSSxnQkFBZ0IsT0FBaEIsSUFBMkIsV0FBVyxnQkFBZ0IsTUFBM0IsQ0FBL0IsRUFBbUU7QUFDakUsMEJBQWdCLE1BQWhCLENBQXVCLE1BQU0sU0FBN0IsRUFBd0MsTUFBTSxNQUE5QyxFQUFzRCxNQUFNLE9BQTVELEVBQXFFLGVBQXJFLEVBQXNGLE1BQU0sS0FBNUY7QUFDRDtBQUNGLE9BSkQ7O0FBTUE7QUFDQSxXQUFLLE1BQUw7O0FBRUEsVUFBSSxnQkFBZ0IsS0FBSyxPQUFMLENBQWEsYUFBakM7QUFDQSxVQUFJLGFBQUosRUFBbUI7QUFDakI7QUFDQSxhQUFLLG9CQUFMO0FBQ0Q7O0FBRUQsV0FBSyxLQUFMLENBQVcsYUFBWCxHQUEyQixhQUEzQjtBQUNEOztBQUVEO0FBQ0E7OztBQUdBLGtCQUFjLE1BQWQsRUFBc0IsQ0FBQztBQUNyQixXQUFLLFFBRGdCO0FBRXJCLGFBQU8sU0FBUyxTQUFULEdBQXFCO0FBQzFCLGVBQU8sT0FBTyxJQUFQLENBQVksSUFBWixDQUFQO0FBQ0Q7QUFKb0IsS0FBRCxFQUtuQjtBQUNELFdBQUssU0FESjtBQUVELGFBQU8sU0FBUyxVQUFULEdBQXNCO0FBQzNCLGVBQU8sUUFBUSxJQUFSLENBQWEsSUFBYixDQUFQO0FBQ0Q7QUFKQSxLQUxtQixFQVVuQjtBQUNELFdBQUssc0JBREo7QUFFRCxhQUFPLFNBQVMsdUJBQVQsR0FBbUM7QUFDeEMsZUFBTyxxQkFBcUIsSUFBckIsQ0FBMEIsSUFBMUIsQ0FBUDtBQUNEO0FBSkEsS0FWbUIsRUFlbkI7QUFDRCxXQUFLLHVCQURKO0FBRUQsYUFBTyxTQUFTLHdCQUFULEdBQW9DO0FBQ3pDLGVBQU8sc0JBQXNCLElBQXRCLENBQTJCLElBQTNCLENBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBTUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWkMsS0FmbUIsQ0FBdEI7QUE2Q0EsV0FBTyxNQUFQO0FBQ0QsR0E3SFksRUFBYjs7QUErSEE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLFNBQU8sS0FBUCxHQUFlLENBQUMsT0FBTyxNQUFQLEtBQWtCLFdBQWxCLEdBQWdDLE1BQWhDLEdBQXlDLE1BQTFDLEVBQWtELFdBQWpFO0FBQ0EsU0FBTyxVQUFQLEdBQW9CLFVBQXBCO0FBQ0EsU0FBTyxRQUFQLEdBQWtCLFFBQWxCOztBQUVBOzs7Ozs7QUFNQSxXQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0I7QUFDdEIsU0FBSyxPQUFPLFlBQVo7QUFDRDs7QUFFRDs7Ozs7Ozs7QUFRQSxXQUFTLG9CQUFULENBQThCLGNBQTlCLEVBQThDLFFBQTlDLEVBQXdELG1CQUF4RCxFQUE2RTtBQUMzRSxRQUFJLFNBQVMsZUFBZSxNQUE1QjtBQUFBLFFBQ0ksVUFBVSxlQUFlLE9BRDdCOztBQUdBLFFBQUksV0FBVyxRQUFRLFFBQXZCO0FBQ0EsUUFBSSxXQUFXLFFBQVEsUUFBdkI7O0FBRUEsWUFBUSxRQUFSLEdBQW1CLFFBQVEsUUFBUixHQUFtQixZQUFZO0FBQ2hELGFBQU8sTUFBUCxHQUFnQixZQUFZLFVBQTVCLEVBQXdDLFVBQXhDO0FBQ0EsY0FBUSxRQUFSLEdBQW1CLFFBQW5CO0FBQ0EsY0FBUSxRQUFSLEdBQW1CLFFBQW5CO0FBQ0QsS0FKRDs7QUFNQSxRQUFJLENBQUMsbUJBQUwsRUFBMEI7QUFDeEIscUJBQWUsY0FBZjtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7O0FBS0EsV0FBUyxrQkFBVCxDQUE0QixNQUE1QixFQUFvQztBQUNsQyxXQUFPLE9BQU8sWUFBUCxDQUFvQixhQUFwQixFQUFtQyxPQUFuQyxDQUEyQyxLQUEzQyxFQUFrRCxFQUFsRCxDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxXQUFTLGdDQUFULENBQTBDLEtBQTFDLEVBQWlELE1BQWpELEVBQXlELE9BQXpELEVBQWtFO0FBQ2hFLFFBQUksQ0FBQyxPQUFPLFlBQVAsQ0FBb0IsYUFBcEIsQ0FBTCxFQUF5QyxPQUFPLElBQVA7O0FBRXpDLFFBQUksSUFBSSxNQUFNLE9BQWQ7QUFBQSxRQUNJLElBQUksTUFBTSxPQURkO0FBRUEsUUFBSSxvQkFBb0IsUUFBUSxpQkFBaEM7QUFBQSxRQUNJLFdBQVcsUUFBUSxRQUR2Qjs7QUFJQSxRQUFJLE9BQU8sT0FBTyxxQkFBUCxFQUFYO0FBQ0EsUUFBSSxZQUFZLG1CQUFtQixNQUFuQixDQUFoQjtBQUNBLFFBQUkscUJBQXFCLG9CQUFvQixRQUE3Qzs7QUFFQSxRQUFJLFVBQVU7QUFDWixXQUFLLEtBQUssR0FBTCxHQUFXLENBQVgsR0FBZSxpQkFEUjtBQUVaLGNBQVEsSUFBSSxLQUFLLE1BQVQsR0FBa0IsaUJBRmQ7QUFHWixZQUFNLEtBQUssSUFBTCxHQUFZLENBQVosR0FBZ0IsaUJBSFY7QUFJWixhQUFPLElBQUksS0FBSyxLQUFULEdBQWlCO0FBSlosS0FBZDs7QUFPQSxZQUFRLFNBQVI7QUFDRSxXQUFLLEtBQUw7QUFDRSxnQkFBUSxHQUFSLEdBQWMsS0FBSyxHQUFMLEdBQVcsQ0FBWCxHQUFlLGtCQUE3QjtBQUNBO0FBQ0YsV0FBSyxRQUFMO0FBQ0UsZ0JBQVEsTUFBUixHQUFpQixJQUFJLEtBQUssTUFBVCxHQUFrQixrQkFBbkM7QUFDQTtBQUNGLFdBQUssTUFBTDtBQUNFLGdCQUFRLElBQVIsR0FBZSxLQUFLLElBQUwsR0FBWSxDQUFaLEdBQWdCLGtCQUEvQjtBQUNBO0FBQ0YsV0FBSyxPQUFMO0FBQ0UsZ0JBQVEsS0FBUixHQUFnQixJQUFJLEtBQUssS0FBVCxHQUFpQixrQkFBakM7QUFDQTtBQVpKOztBQWVBLFdBQU8sUUFBUSxHQUFSLElBQWUsUUFBUSxNQUF2QixJQUFpQyxRQUFRLElBQXpDLElBQWlELFFBQVEsS0FBaEU7QUFDRDs7QUFFRDs7Ozs7Ozs7QUFRQSxXQUFTLG9DQUFULENBQThDLElBQTlDLEVBQW9ELE9BQXBELEVBQTZELFVBQTdELEVBQXlFLFNBQXpFLEVBQW9GO0FBQ2xGLFFBQUksQ0FBQyxRQUFRLE1BQWIsRUFBcUIsT0FBTyxFQUFQOztBQUVyQixRQUFJLGFBQWE7QUFDZixhQUFPLFlBQVk7QUFDakIsWUFBSSxRQUFRLE1BQVIsS0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsaUJBQU8sS0FBSyxRQUFRLENBQVIsQ0FBWjtBQUNELFNBRkQsTUFFTztBQUNMLGlCQUFPLGFBQWEsUUFBUSxDQUFSLElBQWEsSUFBYixHQUFvQixRQUFRLENBQVIsQ0FBakMsR0FBOEMsUUFBUSxDQUFSLElBQWEsSUFBYixHQUFvQixRQUFRLENBQVIsQ0FBekU7QUFDRDtBQUNGLE9BTk0sRUFEUTtBQVFmLGlCQUFXLFlBQVk7QUFDckIsWUFBSSxRQUFRLE1BQVIsS0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsaUJBQU8sWUFBWSxDQUFDLFFBQVEsQ0FBUixDQUFELEdBQWMsSUFBMUIsR0FBaUMsUUFBUSxDQUFSLElBQWEsSUFBckQ7QUFDRCxTQUZELE1BRU87QUFDTCxjQUFJLFVBQUosRUFBZ0I7QUFDZCxtQkFBTyxZQUFZLFFBQVEsQ0FBUixJQUFhLE1BQWIsR0FBc0IsQ0FBQyxRQUFRLENBQVIsQ0FBdkIsR0FBb0MsSUFBaEQsR0FBdUQsUUFBUSxDQUFSLElBQWEsTUFBYixHQUFzQixRQUFRLENBQVIsQ0FBdEIsR0FBbUMsSUFBakc7QUFDRCxXQUZELE1BRU87QUFDTCxtQkFBTyxZQUFZLENBQUMsUUFBUSxDQUFSLENBQUQsR0FBYyxNQUFkLEdBQXVCLFFBQVEsQ0FBUixDQUF2QixHQUFvQyxJQUFoRCxHQUF1RCxRQUFRLENBQVIsSUFBYSxNQUFiLEdBQXNCLFFBQVEsQ0FBUixDQUF0QixHQUFtQyxJQUFqRztBQUNEO0FBQ0Y7QUFDRixPQVZVO0FBUkksS0FBakI7O0FBcUJBLFdBQU8sV0FBVyxJQUFYLENBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsV0FBUyxhQUFULENBQXVCLElBQXZCLEVBQTZCLFVBQTdCLEVBQXlDO0FBQ3ZDLFFBQUksQ0FBQyxJQUFMLEVBQVcsT0FBTyxFQUFQO0FBQ1gsUUFBSSxNQUFNO0FBQ1IsU0FBRyxHQURLO0FBRVIsU0FBRztBQUZLLEtBQVY7QUFJQSxXQUFPLGFBQWEsSUFBYixHQUFvQixJQUFJLElBQUosQ0FBM0I7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsV0FBUyxxQkFBVCxDQUErQixNQUEvQixFQUF1QyxLQUF2QyxFQUE4QyxjQUE5QyxFQUE4RDtBQUM1RCxRQUFJLFlBQVksbUJBQW1CLE1BQW5CLENBQWhCO0FBQ0EsUUFBSSxhQUFhLGNBQWMsS0FBZCxJQUF1QixjQUFjLFFBQXREO0FBQ0EsUUFBSSxZQUFZLGNBQWMsT0FBZCxJQUF5QixjQUFjLFFBQXZEOztBQUVBLFFBQUksVUFBVSxTQUFTLE9BQVQsQ0FBaUIsRUFBakIsRUFBcUI7QUFDakMsVUFBSSxRQUFRLGVBQWUsS0FBZixDQUFxQixFQUFyQixDQUFaO0FBQ0EsYUFBTyxRQUFRLE1BQU0sQ0FBTixDQUFSLEdBQW1CLEVBQTFCO0FBQ0QsS0FIRDs7QUFLQSxRQUFJLGFBQWEsU0FBUyxVQUFULENBQW9CLEVBQXBCLEVBQXdCO0FBQ3ZDLFVBQUksUUFBUSxlQUFlLEtBQWYsQ0FBcUIsRUFBckIsQ0FBWjtBQUNBLGFBQU8sUUFBUSxNQUFNLENBQU4sRUFBUyxLQUFULENBQWUsR0FBZixFQUFvQixHQUFwQixDQUF3QixVQUF4QixDQUFSLEdBQThDLEVBQXJEO0FBQ0QsS0FIRDs7QUFLQSxRQUFJLEtBQUs7QUFDUCxpQkFBVywwQkFESjtBQUVQLGFBQU87QUFGQSxLQUFUOztBQUtBLFFBQUksVUFBVTtBQUNaLGlCQUFXO0FBQ1QsY0FBTSxRQUFRLGlCQUFSLENBREc7QUFFVCxpQkFBUyxXQUFXLEdBQUcsU0FBZDtBQUZBLE9BREM7QUFLWixhQUFPO0FBQ0wsY0FBTSxRQUFRLGFBQVIsQ0FERDtBQUVMLGlCQUFTLFdBQVcsR0FBRyxLQUFkO0FBRko7QUFMSyxLQUFkOztBQVdBLFFBQUksb0JBQW9CLGVBQWUsT0FBZixDQUF1QixHQUFHLFNBQTFCLEVBQXFDLGNBQWMsY0FBYyxRQUFRLFNBQVIsQ0FBa0IsSUFBaEMsRUFBc0MsVUFBdEMsQ0FBZCxHQUFrRSxHQUFsRSxHQUF3RSxxQ0FBcUMsV0FBckMsRUFBa0QsUUFBUSxTQUFSLENBQWtCLE9BQXBFLEVBQTZFLFVBQTdFLEVBQXlGLFNBQXpGLENBQXhFLEdBQThLLEdBQW5OLEVBQXdOLE9BQXhOLENBQWdPLEdBQUcsS0FBbk8sRUFBME8sVUFBVSxjQUFjLFFBQVEsS0FBUixDQUFjLElBQTVCLEVBQWtDLFVBQWxDLENBQVYsR0FBMEQsR0FBMUQsR0FBZ0UscUNBQXFDLE9BQXJDLEVBQThDLFFBQVEsS0FBUixDQUFjLE9BQTVELEVBQXFFLFVBQXJFLEVBQWlGLFNBQWpGLENBQWhFLEdBQThKLEdBQXhZLENBQXhCOztBQUVBLFVBQU0sS0FBTixDQUFZLE9BQU8sV0FBUCxDQUFaLElBQW1DLGlCQUFuQztBQUNEOztBQUVEOzs7Ozs7QUFNQSxXQUFTLHFCQUFULENBQStCLFFBQS9CLEVBQXlDO0FBQ3ZDLFdBQU8sRUFBRSxXQUFXLFNBQVMsUUFBdEIsSUFBa0MsSUFBekM7QUFDRDs7QUFFRDs7OztBQUlBLFdBQVMsS0FBVCxDQUFlLEVBQWYsRUFBbUI7QUFDakIsMEJBQXNCLFlBQVk7QUFDaEMsaUJBQVcsRUFBWCxFQUFlLENBQWY7QUFDRCxLQUZEO0FBR0Q7O0FBRUQsTUFBSSxVQUFVLEVBQWQ7O0FBRUEsTUFBSSxTQUFKLEVBQWU7QUFDYixRQUFJLElBQUksUUFBUSxTQUFoQjtBQUNBLGNBQVUsRUFBRSxPQUFGLElBQWEsRUFBRSxlQUFmLElBQWtDLEVBQUUscUJBQXBDLElBQTZELEVBQUUsa0JBQS9ELElBQXFGLEVBQUUsaUJBQXZGLElBQTRHLFVBQVUsQ0FBVixFQUFhO0FBQ2pJLFVBQUksVUFBVSxDQUFDLEtBQUssUUFBTCxJQUFpQixLQUFLLGFBQXZCLEVBQXNDLGdCQUF0QyxDQUF1RCxDQUF2RCxDQUFkO0FBQ0EsVUFBSSxJQUFJLFFBQVEsTUFBaEI7QUFDQSxhQUFPLEVBQUUsQ0FBRixJQUFPLENBQVAsSUFBWSxRQUFRLElBQVIsQ0FBYSxDQUFiLE1BQW9CLElBQXZDLEVBQTZDLENBQUUsQ0FIa0YsQ0FHakY7QUFDaEQsYUFBTyxJQUFJLENBQUMsQ0FBWjtBQUNELEtBTEQ7QUFNRDs7QUFFRCxNQUFJLFlBQVksT0FBaEI7O0FBRUE7Ozs7OztBQU1BLFdBQVMsT0FBVCxDQUFpQixPQUFqQixFQUEwQixjQUExQixFQUEwQztBQUN4QyxRQUFJLEtBQUssUUFBUSxTQUFSLENBQWtCLE9BQWxCLElBQTZCLFVBQVUsUUFBVixFQUFvQjtBQUN4RCxVQUFJLEtBQUssSUFBVDtBQUNBLGFBQU8sRUFBUCxFQUFXO0FBQ1QsWUFBSSxVQUFVLElBQVYsQ0FBZSxFQUFmLEVBQW1CLFFBQW5CLENBQUosRUFBa0M7QUFDaEMsaUJBQU8sRUFBUDtBQUNEO0FBQ0QsYUFBSyxHQUFHLGFBQVI7QUFDRDtBQUNGLEtBUkQ7O0FBVUEsV0FBTyxHQUFHLElBQUgsQ0FBUSxPQUFSLEVBQWlCLGNBQWpCLENBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsV0FBUyxRQUFULENBQWtCLEtBQWxCLEVBQXlCLEtBQXpCLEVBQWdDO0FBQzlCLFdBQU8sTUFBTSxPQUFOLENBQWMsS0FBZCxJQUF1QixNQUFNLEtBQU4sQ0FBdkIsR0FBc0MsS0FBN0M7QUFDRDs7QUFFRDs7Ozs7QUFLQSxXQUFTLGtCQUFULENBQTRCLEdBQTVCLEVBQWlDLElBQWpDLEVBQXVDO0FBQ3JDLFFBQUksT0FBSixDQUFZLFVBQVUsRUFBVixFQUFjO0FBQ3hCLFVBQUksQ0FBQyxFQUFMLEVBQVM7QUFDVCxTQUFHLFlBQUgsQ0FBZ0IsWUFBaEIsRUFBOEIsSUFBOUI7QUFDRCxLQUhEO0FBSUQ7O0FBRUQ7Ozs7O0FBS0EsV0FBUyx1QkFBVCxDQUFpQyxHQUFqQyxFQUFzQyxLQUF0QyxFQUE2QztBQUMzQyxRQUFJLE1BQUosQ0FBVyxPQUFYLEVBQW9CLE9BQXBCLENBQTRCLFVBQVUsRUFBVixFQUFjO0FBQ3hDLFNBQUcsS0FBSCxDQUFTLE9BQU8sb0JBQVAsQ0FBVCxJQUF5QyxRQUFRLElBQWpEO0FBQ0QsS0FGRDtBQUdEOztBQUVEOzs7O0FBSUEsV0FBUyxLQUFULENBQWUsRUFBZixFQUFtQjtBQUNqQixRQUFJLElBQUksT0FBTyxPQUFQLElBQWtCLE9BQU8sV0FBakM7QUFDQSxRQUFJLElBQUksT0FBTyxPQUFQLElBQWtCLE9BQU8sV0FBakM7QUFDQSxPQUFHLEtBQUg7QUFDQSxXQUFPLENBQVAsRUFBVSxDQUFWO0FBQ0Q7O0FBRUQsTUFBSSxNQUFNLEVBQVY7QUFDQSxNQUFJLFFBQVEsU0FBUyxLQUFULENBQWUsSUFBZixFQUFxQjtBQUMvQixXQUFPLFVBQVUsQ0FBVixFQUFhO0FBQ2xCLGFBQU8sTUFBTSxHQUFOLElBQWEsSUFBcEI7QUFDRCxLQUZEO0FBR0QsR0FKRDs7QUFNQSxNQUFJLFFBQVEsWUFBWTtBQUN0QixhQUFTLEtBQVQsQ0FBZSxNQUFmLEVBQXVCO0FBQ3JCLHFCQUFlLElBQWYsRUFBcUIsS0FBckI7O0FBRUEsV0FBSyxJQUFJLElBQVQsSUFBaUIsTUFBakIsRUFBeUI7QUFDdkIsYUFBSyxJQUFMLElBQWEsT0FBTyxJQUFQLENBQWI7QUFDRDs7QUFFRCxXQUFLLEtBQUwsR0FBYTtBQUNYLG1CQUFXLEtBREE7QUFFWCxpQkFBUyxLQUZFO0FBR1gsaUJBQVM7QUFIRSxPQUFiOztBQU1BLFdBQUssQ0FBTCxHQUFTLE1BQU07QUFDYiwyQkFBbUI7QUFETixPQUFOLENBQVQ7QUFHRDs7QUFFRDs7Ozs7O0FBT0EsZ0JBQVksS0FBWixFQUFtQixDQUFDO0FBQ2xCLFdBQUssUUFEYTtBQUVsQixhQUFPLFNBQVMsTUFBVCxHQUFrQjtBQUN2QixhQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLElBQXJCO0FBQ0Q7O0FBRUQ7Ozs7OztBQU5rQixLQUFELEVBWWhCO0FBQ0QsV0FBSyxTQURKO0FBRUQsYUFBTyxTQUFTLE9BQVQsR0FBbUI7QUFDeEIsYUFBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixLQUFyQjtBQUNEOztBQUVEOzs7Ozs7O0FBTkMsS0FaZ0IsRUF5QmhCO0FBQ0QsV0FBSyxNQURKO0FBRUQsYUFBTyxTQUFTLElBQVQsQ0FBYyxRQUFkLEVBQXdCO0FBQzdCLFlBQUksUUFBUSxJQUFaOztBQUVBLFlBQUksS0FBSyxLQUFMLENBQVcsU0FBWCxJQUF3QixDQUFDLEtBQUssS0FBTCxDQUFXLE9BQXhDLEVBQWlEOztBQUVqRCxZQUFJLFNBQVMsS0FBSyxNQUFsQjtBQUFBLFlBQ0ksWUFBWSxLQUFLLFNBRHJCO0FBQUEsWUFFSSxVQUFVLEtBQUssT0FGbkI7O0FBSUEsWUFBSSxvQkFBb0IsaUJBQWlCLE1BQWpCLENBQXhCO0FBQUEsWUFDSSxVQUFVLGtCQUFrQixPQURoQztBQUFBLFlBRUksV0FBVyxrQkFBa0IsUUFGakM7QUFBQSxZQUdJLFVBQVUsa0JBQWtCLE9BSGhDOztBQUtBO0FBQ0E7QUFDQTs7O0FBR0EsWUFBSSxRQUFRLFlBQVIsSUFBd0IsQ0FBQyxVQUFVLFlBQVYsQ0FBdUIscUJBQXZCLENBQTdCLEVBQTRFO0FBQzFFO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFJLFVBQVUsWUFBVixDQUF1QixVQUF2QixDQUFKLEVBQXdDOztBQUV4QztBQUNBLFlBQUksQ0FBQyxVQUFVLE1BQVgsSUFBcUIsQ0FBQyxTQUFTLGVBQVQsQ0FBeUIsUUFBekIsQ0FBa0MsU0FBbEMsQ0FBMUIsRUFBd0U7QUFDdEUsZUFBSyxPQUFMO0FBQ0E7QUFDRDs7QUFFRCxnQkFBUSxNQUFSLENBQWUsSUFBZixDQUFvQixNQUFwQixFQUE0QixJQUE1Qjs7QUFFQSxtQkFBVyxTQUFTLGFBQWEsU0FBYixHQUF5QixRQUF6QixHQUFvQyxRQUFRLFFBQXJELEVBQStELENBQS9ELENBQVg7O0FBRUE7QUFDQSxnQ0FBd0IsQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixRQUFsQixDQUF4QixFQUFxRCxDQUFyRDs7QUFFQSxlQUFPLEtBQVAsQ0FBYSxVQUFiLEdBQTBCLFNBQTFCO0FBQ0EsYUFBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixJQUFyQjs7QUFFQSxlQUFPLElBQVAsQ0FBWSxJQUFaLEVBQWtCLFlBQVk7QUFDNUIsY0FBSSxDQUFDLE1BQU0sS0FBTixDQUFZLE9BQWpCLEVBQTBCOztBQUUxQixjQUFJLENBQUMseUJBQXlCLElBQXpCLENBQThCLEtBQTlCLENBQUwsRUFBMkM7QUFDekM7QUFDQSxrQkFBTSxjQUFOLENBQXFCLGNBQXJCO0FBQ0Q7O0FBRUQ7QUFDQSxjQUFJLHlCQUF5QixJQUF6QixDQUE4QixLQUE5QixDQUFKLEVBQTBDO0FBQ3hDLGtCQUFNLGNBQU4sQ0FBcUIscUJBQXJCO0FBQ0EsZ0JBQUksUUFBUSxTQUFTLFFBQVEsS0FBakIsRUFBd0IsQ0FBeEIsQ0FBWjtBQUNBLGdCQUFJLG1CQUFtQixNQUFNLENBQU4sQ0FBUSxHQUFSLEVBQWEsZ0JBQXBDO0FBQ0EsZ0JBQUksZ0JBQUosRUFBc0I7QUFDcEIsb0JBQU0sQ0FBTixDQUFRLEdBQVIsRUFBYSxvQkFBYixDQUFrQyxTQUFTLE1BQU0sQ0FBTixDQUFRLEdBQVIsRUFBYSxrQkFBdEIsR0FBMkMsTUFBTSxDQUFOLENBQVEsR0FBUixFQUFhLGtCQUF4RCxHQUE2RSxnQkFBL0c7QUFDRDtBQUNGOztBQUVEO0FBQ0Esa0NBQXdCLENBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsV0FBVyxPQUFYLEdBQXFCLElBQXpDLENBQXhCLEVBQXdFLFFBQXhFOztBQUVBLGNBQUksUUFBSixFQUFjO0FBQ1osNkJBQWlCLFFBQWpCLEVBQTJCLE9BQU8sV0FBUCxDQUEzQjtBQUNEOztBQUVELGNBQUksUUFBUSxXQUFaLEVBQXlCO0FBQ3ZCLHNCQUFVLFNBQVYsQ0FBb0IsR0FBcEIsQ0FBd0IsY0FBeEI7QUFDRDs7QUFFRCxjQUFJLFFBQVEsTUFBWixFQUFvQjtBQUNsQix3QkFBWSxJQUFaLENBQWlCLEtBQWpCO0FBQ0Q7O0FBRUQsNkJBQW1CLENBQUMsT0FBRCxFQUFVLFFBQVYsQ0FBbkIsRUFBd0MsU0FBeEM7O0FBRUEsMkJBQWlCLElBQWpCLENBQXNCLEtBQXRCLEVBQTZCLFFBQTdCLEVBQXVDLFlBQVk7QUFDakQsZ0JBQUksQ0FBQyxRQUFRLGNBQWIsRUFBNkI7QUFDM0Isc0JBQVEsU0FBUixDQUFrQixHQUFsQixDQUFzQixvQkFBdEI7QUFDRDs7QUFFRCxnQkFBSSxRQUFRLFdBQVosRUFBeUI7QUFDdkIsb0JBQU0sTUFBTjtBQUNEOztBQUVELHNCQUFVLFlBQVYsQ0FBdUIsa0JBQXZCLEVBQTJDLFdBQVcsTUFBTSxFQUE1RDs7QUFFQSxvQkFBUSxPQUFSLENBQWdCLElBQWhCLENBQXFCLE1BQXJCLEVBQTZCLEtBQTdCO0FBQ0QsV0FaRDtBQWFELFNBaEREO0FBaUREOztBQUVEOzs7Ozs7O0FBL0ZDLEtBekJnQixFQStIaEI7QUFDRCxXQUFLLE1BREo7QUFFRCxhQUFPLFNBQVMsSUFBVCxDQUFjLFFBQWQsRUFBd0I7QUFDN0IsWUFBSSxTQUFTLElBQWI7O0FBRUEsWUFBSSxLQUFLLEtBQUwsQ0FBVyxTQUFYLElBQXdCLENBQUMsS0FBSyxLQUFMLENBQVcsT0FBeEMsRUFBaUQ7O0FBRWpELFlBQUksU0FBUyxLQUFLLE1BQWxCO0FBQUEsWUFDSSxZQUFZLEtBQUssU0FEckI7QUFBQSxZQUVJLFVBQVUsS0FBSyxPQUZuQjs7QUFJQSxZQUFJLHFCQUFxQixpQkFBaUIsTUFBakIsQ0FBekI7QUFBQSxZQUNJLFVBQVUsbUJBQW1CLE9BRGpDO0FBQUEsWUFFSSxXQUFXLG1CQUFtQixRQUZsQztBQUFBLFlBR0ksVUFBVSxtQkFBbUIsT0FIakM7O0FBS0EsZ0JBQVEsTUFBUixDQUFlLElBQWYsQ0FBb0IsTUFBcEIsRUFBNEIsSUFBNUI7O0FBRUEsbUJBQVcsU0FBUyxhQUFhLFNBQWIsR0FBeUIsUUFBekIsR0FBb0MsUUFBUSxRQUFyRCxFQUErRCxDQUEvRCxDQUFYOztBQUVBLFlBQUksQ0FBQyxRQUFRLGNBQWIsRUFBNkI7QUFDM0Isa0JBQVEsU0FBUixDQUFrQixNQUFsQixDQUF5QixvQkFBekI7QUFDRDs7QUFFRCxZQUFJLFFBQVEsV0FBWixFQUF5QjtBQUN2QixvQkFBVSxTQUFWLENBQW9CLE1BQXBCLENBQTJCLGNBQTNCO0FBQ0Q7O0FBRUQsZUFBTyxLQUFQLENBQWEsVUFBYixHQUEwQixRQUExQjtBQUNBLGFBQUssS0FBTCxDQUFXLE9BQVgsR0FBcUIsS0FBckI7O0FBRUEsZ0NBQXdCLENBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsV0FBVyxPQUFYLEdBQXFCLElBQXpDLENBQXhCLEVBQXdFLFFBQXhFOztBQUVBLDJCQUFtQixDQUFDLE9BQUQsRUFBVSxRQUFWLENBQW5CLEVBQXdDLFFBQXhDOztBQUVBLFlBQUksUUFBUSxXQUFSLElBQXVCLFFBQVEsT0FBUixDQUFnQixPQUFoQixDQUF3QixPQUF4QixJQUFtQyxDQUFDLENBQS9ELEVBQWtFO0FBQ2hFLGdCQUFNLFNBQU47QUFDRDs7QUFFRDs7Ozs7O0FBTUEsY0FBTSxZQUFZO0FBQ2hCLDJCQUFpQixJQUFqQixDQUFzQixNQUF0QixFQUE4QixRQUE5QixFQUF3QyxZQUFZO0FBQ2xELGdCQUFJLE9BQU8sS0FBUCxDQUFhLE9BQWIsSUFBd0IsQ0FBQyxRQUFRLFFBQVIsQ0FBaUIsUUFBakIsQ0FBMEIsTUFBMUIsQ0FBN0IsRUFBZ0U7O0FBRWhFLGdCQUFJLENBQUMsT0FBTyxDQUFQLENBQVMsR0FBVCxFQUFjLGlCQUFuQixFQUFzQztBQUNwQyx1QkFBUyxtQkFBVCxDQUE2QixXQUE3QixFQUEwQyxPQUFPLENBQVAsQ0FBUyxHQUFULEVBQWMsb0JBQXhEO0FBQ0EscUJBQU8sQ0FBUCxDQUFTLEdBQVQsRUFBYyxrQkFBZCxHQUFtQyxJQUFuQztBQUNEOztBQUVELGdCQUFJLE9BQU8sY0FBWCxFQUEyQjtBQUN6QixxQkFBTyxjQUFQLENBQXNCLHFCQUF0QjtBQUNEOztBQUVELHNCQUFVLGVBQVYsQ0FBMEIsa0JBQTFCOztBQUVBLG9CQUFRLFFBQVIsQ0FBaUIsV0FBakIsQ0FBNkIsTUFBN0I7O0FBRUEsb0JBQVEsUUFBUixDQUFpQixJQUFqQixDQUFzQixNQUF0QixFQUE4QixNQUE5QjtBQUNELFdBakJEO0FBa0JELFNBbkJEO0FBb0JEOztBQUVEOzs7Ozs7O0FBbkVDLEtBL0hnQixFQXlNaEI7QUFDRCxXQUFLLFNBREo7QUFFRCxhQUFPLFNBQVMsT0FBVCxHQUFtQjtBQUN4QixZQUFJLFNBQVMsSUFBYjs7QUFFQSxZQUFJLHlCQUF5QixVQUFVLE1BQVYsR0FBbUIsQ0FBbkIsSUFBd0IsVUFBVSxDQUFWLE1BQWlCLFNBQXpDLEdBQXFELFVBQVUsQ0FBVixDQUFyRCxHQUFvRSxJQUFqRzs7QUFFQSxZQUFJLEtBQUssS0FBTCxDQUFXLFNBQWYsRUFBMEI7O0FBRTFCO0FBQ0EsWUFBSSxLQUFLLEtBQUwsQ0FBVyxPQUFmLEVBQXdCO0FBQ3RCLGVBQUssSUFBTCxDQUFVLENBQVY7QUFDRDs7QUFFRCxhQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLFVBQVUsUUFBVixFQUFvQjtBQUN6QyxpQkFBTyxTQUFQLENBQWlCLG1CQUFqQixDQUFxQyxTQUFTLEtBQTlDLEVBQXFELFNBQVMsT0FBOUQ7QUFDRCxTQUZEOztBQUlBO0FBQ0EsWUFBSSxLQUFLLEtBQVQsRUFBZ0I7QUFDZCxlQUFLLFNBQUwsQ0FBZSxZQUFmLENBQTRCLE9BQTVCLEVBQXFDLEtBQUssS0FBMUM7QUFDRDs7QUFFRCxlQUFPLEtBQUssU0FBTCxDQUFlLE1BQXRCOztBQUVBLFlBQUksYUFBYSxDQUFDLHFCQUFELEVBQXdCLFlBQXhCLEVBQXNDLHFCQUF0QyxDQUFqQjtBQUNBLG1CQUFXLE9BQVgsQ0FBbUIsVUFBVSxJQUFWLEVBQWdCO0FBQ2pDLGlCQUFPLFNBQVAsQ0FBaUIsZUFBakIsQ0FBaUMsSUFBakM7QUFDRCxTQUZEOztBQUlBLFlBQUksS0FBSyxPQUFMLENBQWEsTUFBYixJQUF1QixzQkFBM0IsRUFBbUQ7QUFDakQsa0JBQVEsS0FBSyxTQUFMLENBQWUsZ0JBQWYsQ0FBZ0MsS0FBSyxPQUFMLENBQWEsTUFBN0MsQ0FBUixFQUE4RCxPQUE5RCxDQUFzRSxVQUFVLEtBQVYsRUFBaUI7QUFDckYsbUJBQU8sTUFBTSxNQUFOLElBQWdCLE1BQU0sTUFBTixDQUFhLE9BQWIsRUFBdkI7QUFDRCxXQUZEO0FBR0Q7O0FBRUQsWUFBSSxLQUFLLGNBQVQsRUFBeUI7QUFDdkIsZUFBSyxjQUFMLENBQW9CLE9BQXBCO0FBQ0Q7O0FBRUQsYUFBSyxDQUFMLENBQU8sR0FBUCxFQUFZLGlCQUFaLENBQThCLE9BQTlCLENBQXNDLFVBQVUsUUFBVixFQUFvQjtBQUN4RCxtQkFBUyxVQUFUO0FBQ0QsU0FGRDs7QUFJQSxhQUFLLEtBQUwsQ0FBVyxTQUFYLEdBQXVCLElBQXZCO0FBQ0Q7QUE3Q0EsS0F6TWdCLENBQW5CO0FBd1BBLFdBQU8sS0FBUDtBQUNELEdBblJXLEVBQVo7O0FBcVJBOzs7Ozs7OztBQVFBOzs7Ozs7QUFNQSxXQUFTLHdCQUFULEdBQW9DO0FBQ2xDLFFBQUksbUJBQW1CLEtBQUssQ0FBTCxDQUFPLEdBQVAsRUFBWSxnQkFBbkM7QUFDQSxXQUFPLEtBQUssT0FBTCxDQUFhLFlBQWIsSUFBNkIsQ0FBQyxRQUFRLFVBQXRDLElBQW9ELGdCQUFwRCxJQUF3RSxpQkFBaUIsSUFBakIsS0FBMEIsT0FBekc7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsV0FBUyx5QkFBVCxDQUFtQyxLQUFuQyxFQUEwQztBQUN4QyxRQUFJLFdBQVcsUUFBUSxNQUFNLE1BQWQsRUFBc0IsS0FBSyxPQUFMLENBQWEsTUFBbkMsQ0FBZjtBQUNBLFFBQUksWUFBWSxDQUFDLFNBQVMsTUFBMUIsRUFBa0M7QUFDaEMsVUFBSSxRQUFRLFNBQVMsWUFBVCxDQUFzQixPQUF0QixLQUFrQyxLQUFLLEtBQW5EO0FBQ0EsVUFBSSxLQUFKLEVBQVc7QUFDVCxpQkFBUyxZQUFULENBQXNCLE9BQXRCLEVBQStCLEtBQS9CO0FBQ0EsZ0JBQVEsUUFBUixFQUFrQixTQUFTLEVBQVQsRUFBYSxLQUFLLE9BQWxCLEVBQTJCLEVBQUUsUUFBUSxJQUFWLEVBQTNCLENBQWxCO0FBQ0EsZUFBTyxJQUFQLENBQVksU0FBUyxNQUFyQixFQUE2QixLQUE3QjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRDs7Ozs7OztBQU9BLFdBQVMsTUFBVCxDQUFnQixLQUFoQixFQUF1QjtBQUNyQixRQUFJLFNBQVMsSUFBYjs7QUFFQSxRQUFJLFVBQVUsS0FBSyxPQUFuQjs7QUFHQSx3QkFBb0IsSUFBcEIsQ0FBeUIsSUFBekI7O0FBRUEsUUFBSSxLQUFLLEtBQUwsQ0FBVyxPQUFmLEVBQXdCOztBQUV4QjtBQUNBLFFBQUksUUFBUSxNQUFaLEVBQW9CO0FBQ2xCLGdDQUEwQixJQUExQixDQUErQixJQUEvQixFQUFxQyxLQUFyQztBQUNBO0FBQ0Q7O0FBRUQsU0FBSyxDQUFMLENBQU8sR0FBUCxFQUFZLGlCQUFaLEdBQWdDLElBQWhDOztBQUVBLFFBQUksUUFBUSxJQUFaLEVBQWtCO0FBQ2hCLGNBQVEsSUFBUixDQUFhLElBQWIsQ0FBa0IsS0FBSyxNQUF2QixFQUErQixLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsSUFBZixDQUEvQixFQUFxRCxLQUFyRDtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBLFFBQUkseUJBQXlCLElBQXpCLENBQThCLElBQTlCLENBQUosRUFBeUM7QUFDdkMsVUFBSSxDQUFDLEtBQUssQ0FBTCxDQUFPLEdBQVAsRUFBWSxvQkFBakIsRUFBdUM7QUFDckMsaUNBQXlCLElBQXpCLENBQThCLElBQTlCO0FBQ0Q7O0FBRUQsVUFBSSxxQkFBcUIsaUJBQWlCLEtBQUssTUFBdEIsQ0FBekI7QUFBQSxVQUNJLFFBQVEsbUJBQW1CLEtBRC9COztBQUdBLFVBQUksS0FBSixFQUFXLE1BQU0sS0FBTixDQUFZLE1BQVosR0FBcUIsR0FBckI7QUFDWCxlQUFTLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDLEtBQUssQ0FBTCxDQUFPLEdBQVAsRUFBWSxvQkFBbkQ7QUFDRDs7QUFFRCxRQUFJLFFBQVEsU0FBUyxRQUFRLEtBQWpCLEVBQXdCLENBQXhCLENBQVo7O0FBRUEsUUFBSSxLQUFKLEVBQVc7QUFDVCxXQUFLLENBQUwsQ0FBTyxHQUFQLEVBQVksV0FBWixHQUEwQixXQUFXLFlBQVk7QUFDL0MsZUFBTyxJQUFQO0FBQ0QsT0FGeUIsRUFFdkIsS0FGdUIsQ0FBMUI7QUFHRCxLQUpELE1BSU87QUFDTCxXQUFLLElBQUw7QUFDRDtBQUNGOztBQUVEOzs7OztBQUtBLFdBQVMsTUFBVCxHQUFrQjtBQUNoQixRQUFJLFNBQVMsSUFBYjs7QUFFQSx3QkFBb0IsSUFBcEIsQ0FBeUIsSUFBekI7O0FBRUEsUUFBSSxDQUFDLEtBQUssS0FBTCxDQUFXLE9BQWhCLEVBQXlCOztBQUV6QixTQUFLLENBQUwsQ0FBTyxHQUFQLEVBQVksaUJBQVosR0FBZ0MsS0FBaEM7O0FBRUEsUUFBSSxRQUFRLFNBQVMsS0FBSyxPQUFMLENBQWEsS0FBdEIsRUFBNkIsQ0FBN0IsQ0FBWjs7QUFFQSxRQUFJLEtBQUosRUFBVztBQUNULFdBQUssQ0FBTCxDQUFPLEdBQVAsRUFBWSxXQUFaLEdBQTBCLFdBQVcsWUFBWTtBQUMvQyxZQUFJLE9BQU8sS0FBUCxDQUFhLE9BQWpCLEVBQTBCO0FBQ3hCLGlCQUFPLElBQVA7QUFDRDtBQUNGLE9BSnlCLEVBSXZCLEtBSnVCLENBQTFCO0FBS0QsS0FORCxNQU1PO0FBQ0wsV0FBSyxJQUFMO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7O0FBTUEsV0FBUyxrQkFBVCxHQUE4QjtBQUM1QixRQUFJLFNBQVMsSUFBYjs7QUFFQSxRQUFJLFlBQVksU0FBUyxTQUFULENBQW1CLEtBQW5CLEVBQTBCO0FBQ3hDLFVBQUksQ0FBQyxPQUFPLEtBQVAsQ0FBYSxPQUFsQixFQUEyQjs7QUFFM0IsVUFBSSxrQkFBa0IsUUFBUSxhQUFSLElBQXlCLFFBQVEsVUFBakMsSUFBK0MsQ0FBQyxZQUFELEVBQWUsV0FBZixFQUE0QixPQUE1QixFQUFxQyxPQUFyQyxDQUE2QyxNQUFNLElBQW5ELElBQTJELENBQUMsQ0FBakk7O0FBRUEsVUFBSSxtQkFBbUIsT0FBTyxPQUFQLENBQWUsU0FBdEMsRUFBaUQ7O0FBRWpELGFBQU8sQ0FBUCxDQUFTLEdBQVQsRUFBYyxnQkFBZCxHQUFpQyxLQUFqQzs7QUFFQTtBQUNBLFVBQUksTUFBTSxJQUFOLEtBQWUsT0FBZixJQUEwQixPQUFPLE9BQVAsQ0FBZSxXQUFmLEtBQStCLFlBQXpELElBQXlFLE9BQU8sS0FBUCxDQUFhLE9BQTFGLEVBQW1HO0FBQ2pHLGVBQU8sSUFBUCxDQUFZLE1BQVo7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPLElBQVAsQ0FBWSxNQUFaLEVBQW9CLEtBQXBCO0FBQ0Q7QUFDRixLQWZEOztBQWlCQSxRQUFJLGVBQWUsU0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQTZCO0FBQzlDLFVBQUksQ0FBQyxZQUFELEVBQWUsVUFBZixFQUEyQixPQUEzQixDQUFtQyxNQUFNLElBQXpDLElBQWlELENBQUMsQ0FBbEQsSUFBdUQsUUFBUSxhQUEvRCxJQUFnRixRQUFRLFVBQXhGLElBQXNHLE9BQU8sT0FBUCxDQUFlLFNBQXpILEVBQW9JOztBQUVwSSxVQUFJLE9BQU8sT0FBUCxDQUFlLFdBQW5CLEVBQWdDO0FBQzlCLFlBQUksT0FBTyxPQUFPLElBQVAsQ0FBWSxNQUFaLENBQVg7O0FBRUEsWUFBSSxjQUFjLFNBQVMsV0FBVCxDQUFxQixLQUFyQixFQUE0QjtBQUM1QyxjQUFJLHdCQUF3QixRQUFRLE1BQU0sTUFBZCxFQUFzQixVQUFVLFNBQWhDLENBQTVCO0FBQ0EsY0FBSSxxQkFBcUIsUUFBUSxNQUFNLE1BQWQsRUFBc0IsVUFBVSxNQUFoQyxNQUE0QyxPQUFPLE1BQTVFO0FBQ0EsY0FBSSx3QkFBd0IsMEJBQTBCLE9BQU8sU0FBN0Q7O0FBRUEsY0FBSSxzQkFBc0IscUJBQTFCLEVBQWlEOztBQUVqRCxjQUFJLGlDQUFpQyxLQUFqQyxFQUF3QyxPQUFPLE1BQS9DLEVBQXVELE9BQU8sT0FBOUQsQ0FBSixFQUE0RTtBQUMxRSxxQkFBUyxJQUFULENBQWMsbUJBQWQsQ0FBa0MsWUFBbEMsRUFBZ0QsSUFBaEQ7QUFDQSxxQkFBUyxtQkFBVCxDQUE2QixXQUE3QixFQUEwQyxXQUExQzs7QUFFQSxtQkFBTyxJQUFQLENBQVksTUFBWixFQUFvQixXQUFwQjtBQUNEO0FBQ0YsU0FiRDs7QUFlQSxpQkFBUyxJQUFULENBQWMsZ0JBQWQsQ0FBK0IsWUFBL0IsRUFBNkMsSUFBN0M7QUFDQSxpQkFBUyxnQkFBVCxDQUEwQixXQUExQixFQUF1QyxXQUF2QztBQUNBO0FBQ0Q7O0FBRUQsYUFBTyxJQUFQLENBQVksTUFBWjtBQUNELEtBM0JEOztBQTZCQSxRQUFJLFNBQVMsU0FBUyxNQUFULENBQWdCLEtBQWhCLEVBQXVCO0FBQ2xDLFVBQUksTUFBTSxNQUFOLEtBQWlCLE9BQU8sU0FBeEIsSUFBcUMsUUFBUSxVQUFqRCxFQUE2RDs7QUFFN0QsVUFBSSxPQUFPLE9BQVAsQ0FBZSxXQUFuQixFQUFnQztBQUM5QixZQUFJLENBQUMsTUFBTSxhQUFYLEVBQTBCO0FBQzFCLFlBQUksUUFBUSxNQUFNLGFBQWQsRUFBNkIsVUFBVSxNQUF2QyxDQUFKLEVBQW9EO0FBQ3JEOztBQUVELGFBQU8sSUFBUCxDQUFZLE1BQVo7QUFDRCxLQVREOztBQVdBLFFBQUksaUJBQWlCLFNBQVMsY0FBVCxDQUF3QixLQUF4QixFQUErQjtBQUNsRCxVQUFJLFFBQVEsTUFBTSxNQUFkLEVBQXNCLE9BQU8sT0FBUCxDQUFlLE1BQXJDLENBQUosRUFBa0Q7QUFDaEQsZUFBTyxJQUFQLENBQVksTUFBWixFQUFvQixLQUFwQjtBQUNEO0FBQ0YsS0FKRDs7QUFNQSxRQUFJLGlCQUFpQixTQUFTLGNBQVQsQ0FBd0IsS0FBeEIsRUFBK0I7QUFDbEQsVUFBSSxRQUFRLE1BQU0sTUFBZCxFQUFzQixPQUFPLE9BQVAsQ0FBZSxNQUFyQyxDQUFKLEVBQWtEO0FBQ2hELGVBQU8sSUFBUCxDQUFZLE1BQVo7QUFDRDtBQUNGLEtBSkQ7O0FBTUEsV0FBTztBQUNMLGlCQUFXLFNBRE47QUFFTCxvQkFBYyxZQUZUO0FBR0wsY0FBUSxNQUhIO0FBSUwsc0JBQWdCLGNBSlg7QUFLTCxzQkFBZ0I7QUFMWCxLQUFQO0FBT0Q7O0FBRUQ7Ozs7OztBQU1BLFdBQVMscUJBQVQsR0FBaUM7QUFDL0IsUUFBSSxTQUFTLElBQWI7O0FBRUEsUUFBSSxTQUFTLEtBQUssTUFBbEI7QUFBQSxRQUNJLFlBQVksS0FBSyxTQURyQjtBQUFBLFFBRUksVUFBVSxLQUFLLE9BRm5COztBQUlBLFFBQUkscUJBQXFCLGlCQUFpQixNQUFqQixDQUF6QjtBQUFBLFFBQ0ksVUFBVSxtQkFBbUIsT0FEakM7O0FBR0EsUUFBSSxnQkFBZ0IsUUFBUSxhQUE1Qjs7QUFFQSxRQUFJLGdCQUFnQixRQUFRLFNBQVIsS0FBc0IsT0FBdEIsR0FBZ0MsVUFBVSxXQUExQyxHQUF3RCxVQUFVLEtBQXRGO0FBQ0EsUUFBSSxRQUFRLFFBQVEsYUFBUixDQUFzQixhQUF0QixDQUFaOztBQUVBLFFBQUksU0FBUyxTQUFTO0FBQ3BCLGlCQUFXLFFBQVE7QUFEQyxLQUFULEVBRVYsaUJBQWlCLEVBRlAsRUFFVztBQUN0QixpQkFBVyxTQUFTLEVBQVQsRUFBYSxnQkFBZ0IsY0FBYyxTQUE5QixHQUEwQyxFQUF2RCxFQUEyRDtBQUNwRSxlQUFPLFNBQVM7QUFDZCxtQkFBUztBQURLLFNBQVQsRUFFSixpQkFBaUIsY0FBYyxTQUEvQixHQUEyQyxjQUFjLFNBQWQsQ0FBd0IsS0FBbkUsR0FBMkUsRUFGdkUsQ0FENkQ7QUFJcEUsY0FBTSxTQUFTO0FBQ2IsbUJBQVMsUUFBUSxJQURKO0FBRWIsbUJBQVMsUUFBUSxRQUFSLEdBQW1CLENBRmYsQ0FFaUI7QUFGakIsWUFHWCxVQUFVLFFBQVE7QUFIUCxTQUFULEVBSUgsaUJBQWlCLGNBQWMsU0FBL0IsR0FBMkMsY0FBYyxTQUFkLENBQXdCLElBQW5FLEdBQTBFLEVBSnZFLENBSjhEO0FBU3BFLGdCQUFRLFNBQVM7QUFDZixrQkFBUSxRQUFRO0FBREQsU0FBVCxFQUVMLGlCQUFpQixjQUFjLFNBQS9CLEdBQTJDLGNBQWMsU0FBZCxDQUF3QixNQUFuRSxHQUE0RSxFQUZ2RTtBQVQ0RCxPQUEzRCxDQURXO0FBY3RCLGdCQUFVLFNBQVMsUUFBVCxHQUFvQjtBQUM1QixnQkFBUSxLQUFSLENBQWMsbUJBQW1CLE1BQW5CLENBQWQsSUFBNEMsc0JBQXNCLFFBQVEsUUFBOUIsQ0FBNUM7O0FBRUEsWUFBSSxTQUFTLFFBQVEsY0FBckIsRUFBcUM7QUFDbkMsZ0NBQXNCLE1BQXRCLEVBQThCLEtBQTlCLEVBQXFDLFFBQVEsY0FBN0M7QUFDRDtBQUNGLE9BcEJxQjtBQXFCdEIsZ0JBQVUsU0FBUyxRQUFULEdBQW9CO0FBQzVCLFlBQUksU0FBUyxRQUFRLEtBQXJCO0FBQ0EsZUFBTyxHQUFQLEdBQWEsRUFBYjtBQUNBLGVBQU8sTUFBUCxHQUFnQixFQUFoQjtBQUNBLGVBQU8sSUFBUCxHQUFjLEVBQWQ7QUFDQSxlQUFPLEtBQVAsR0FBZSxFQUFmO0FBQ0EsZUFBTyxtQkFBbUIsTUFBbkIsQ0FBUCxJQUFxQyxzQkFBc0IsUUFBUSxRQUE5QixDQUFyQzs7QUFFQSxZQUFJLFNBQVMsUUFBUSxjQUFyQixFQUFxQztBQUNuQyxnQ0FBc0IsTUFBdEIsRUFBOEIsS0FBOUIsRUFBcUMsUUFBUSxjQUE3QztBQUNEO0FBQ0Y7QUFoQ3FCLEtBRlgsQ0FBYjs7QUFxQ0EseUJBQXFCLElBQXJCLENBQTBCLElBQTFCLEVBQWdDO0FBQzlCLGNBQVEsTUFEc0I7QUFFOUIsZ0JBQVUsU0FBUyxRQUFULEdBQW9CO0FBQzVCLGVBQU8sY0FBUCxDQUFzQixNQUF0QjtBQUNELE9BSjZCO0FBSzlCLGVBQVM7QUFDUCxtQkFBVyxJQURKO0FBRVAsaUJBQVMsSUFGRjtBQUdQLHVCQUFlO0FBSFI7QUFMcUIsS0FBaEM7O0FBWUEsV0FBTyxJQUFJLE1BQUosQ0FBVyxTQUFYLEVBQXNCLE1BQXRCLEVBQThCLE1BQTlCLENBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsV0FBUyxNQUFULENBQWdCLFFBQWhCLEVBQTBCO0FBQ3hCLFFBQUksVUFBVSxLQUFLLE9BQW5COztBQUdBLFFBQUksQ0FBQyxLQUFLLGNBQVYsRUFBMEI7QUFDeEIsV0FBSyxjQUFMLEdBQXNCLHNCQUFzQixJQUF0QixDQUEyQixJQUEzQixDQUF0QjtBQUNBLFVBQUksQ0FBQyxRQUFRLGFBQWIsRUFBNEI7QUFDMUIsYUFBSyxjQUFMLENBQW9CLHFCQUFwQjtBQUNEO0FBQ0YsS0FMRCxNQUtPO0FBQ0wsV0FBSyxjQUFMLENBQW9CLGNBQXBCO0FBQ0EsVUFBSSxRQUFRLGFBQVIsSUFBeUIsQ0FBQyx5QkFBeUIsSUFBekIsQ0FBOEIsSUFBOUIsQ0FBOUIsRUFBbUU7QUFDakUsYUFBSyxjQUFMLENBQW9CLG9CQUFwQjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQTtBQUNBLFFBQUksQ0FBQyx5QkFBeUIsSUFBekIsQ0FBOEIsSUFBOUIsQ0FBTCxFQUEwQztBQUN4QyxVQUFJLHFCQUFxQixpQkFBaUIsS0FBSyxNQUF0QixDQUF6QjtBQUFBLFVBQ0ksUUFBUSxtQkFBbUIsS0FEL0I7O0FBR0EsVUFBSSxLQUFKLEVBQVcsTUFBTSxLQUFOLENBQVksTUFBWixHQUFxQixFQUFyQjtBQUNYLFdBQUssY0FBTCxDQUFvQixTQUFwQixHQUFnQyxLQUFLLFNBQXJDO0FBQ0Q7O0FBRUQseUJBQXFCLEtBQUssY0FBMUIsRUFBMEMsUUFBMUMsRUFBb0QsSUFBcEQ7O0FBRUEsUUFBSSxDQUFDLFFBQVEsUUFBUixDQUFpQixRQUFqQixDQUEwQixLQUFLLE1BQS9CLENBQUwsRUFBNkM7QUFDM0MsY0FBUSxRQUFSLENBQWlCLFdBQWpCLENBQTZCLEtBQUssTUFBbEM7QUFDRDtBQUNGOztBQUVEOzs7OztBQUtBLFdBQVMsbUJBQVQsR0FBK0I7QUFDN0IsUUFBSSxPQUFPLEtBQUssQ0FBTCxDQUFPLEdBQVAsQ0FBWDtBQUFBLFFBQ0ksY0FBYyxLQUFLLFdBRHZCO0FBQUEsUUFFSSxjQUFjLEtBQUssV0FGdkI7O0FBSUEsaUJBQWEsV0FBYjtBQUNBLGlCQUFhLFdBQWI7QUFDRDs7QUFFRDs7Ozs7QUFLQSxXQUFTLHdCQUFULEdBQW9DO0FBQ2xDLFFBQUksU0FBUyxJQUFiOztBQUVBLFNBQUssQ0FBTCxDQUFPLEdBQVAsRUFBWSxvQkFBWixHQUFtQyxVQUFVLEtBQVYsRUFBaUI7QUFDbEQsVUFBSSx1QkFBdUIsT0FBTyxDQUFQLENBQVMsR0FBVCxFQUFjLGtCQUFkLEdBQW1DLEtBQTlEO0FBQUEsVUFDSSxVQUFVLHFCQUFxQixPQURuQztBQUFBLFVBRUksVUFBVSxxQkFBcUIsT0FGbkM7O0FBSUEsVUFBSSxDQUFDLE9BQU8sY0FBWixFQUE0Qjs7QUFFNUIsYUFBTyxjQUFQLENBQXNCLFNBQXRCLEdBQWtDO0FBQ2hDLCtCQUF1QixTQUFTLHFCQUFULEdBQWlDO0FBQ3RELGlCQUFPO0FBQ0wsbUJBQU8sQ0FERjtBQUVMLG9CQUFRLENBRkg7QUFHTCxpQkFBSyxPQUhBO0FBSUwsa0JBQU0sT0FKRDtBQUtMLG1CQUFPLE9BTEY7QUFNTCxvQkFBUTtBQU5ILFdBQVA7QUFRRCxTQVYrQjtBQVdoQyxxQkFBYSxDQVhtQjtBQVloQyxzQkFBYztBQVprQixPQUFsQzs7QUFlQSxhQUFPLGNBQVAsQ0FBc0IsY0FBdEI7QUFDRCxLQXZCRDtBQXdCRDs7QUFFRDs7Ozs7QUFLQSxXQUFTLFdBQVQsR0FBdUI7QUFDckIsUUFBSSxTQUFTLElBQWI7O0FBRUEsUUFBSSw2QkFBNkIsU0FBUywwQkFBVCxHQUFzQztBQUNyRSxhQUFPLE1BQVAsQ0FBYyxLQUFkLENBQW9CLE9BQU8sb0JBQVAsQ0FBcEIsSUFBb0QsT0FBTyxPQUFQLENBQWUsY0FBZixHQUFnQyxJQUFwRjtBQUNELEtBRkQ7O0FBSUEsUUFBSSwyQkFBMkIsU0FBUyx3QkFBVCxHQUFvQztBQUNqRSxhQUFPLE1BQVAsQ0FBYyxLQUFkLENBQW9CLE9BQU8sb0JBQVAsQ0FBcEIsSUFBb0QsRUFBcEQ7QUFDRCxLQUZEOztBQUlBLFFBQUksaUJBQWlCLFNBQVMsY0FBVCxHQUEwQjtBQUM3QyxVQUFJLE9BQU8sY0FBWCxFQUEyQjtBQUN6QixlQUFPLGNBQVAsQ0FBc0IsTUFBdEI7QUFDRDs7QUFFRDs7QUFFQSxVQUFJLE9BQU8sS0FBUCxDQUFhLE9BQWpCLEVBQTBCO0FBQ3hCLDhCQUFzQixjQUF0QjtBQUNELE9BRkQsTUFFTztBQUNMO0FBQ0Q7QUFDRixLQVpEOztBQWNBO0FBQ0Q7O0FBRUQ7Ozs7OztBQU1BLFdBQVMsb0JBQVQsQ0FBOEIsS0FBOUIsRUFBcUM7QUFDbkMsUUFBSSxTQUFTLE1BQU0sTUFBbkI7QUFBQSxRQUNJLFdBQVcsTUFBTSxRQURyQjtBQUFBLFFBRUksVUFBVSxNQUFNLE9BRnBCOztBQUlBLFFBQUksQ0FBQyxPQUFPLGdCQUFaLEVBQThCOztBQUU5QixRQUFJLFdBQVcsSUFBSSxnQkFBSixDQUFxQixRQUFyQixDQUFmO0FBQ0EsYUFBUyxPQUFULENBQWlCLE1BQWpCLEVBQXlCLE9BQXpCOztBQUVBLFNBQUssQ0FBTCxDQUFPLEdBQVAsRUFBWSxpQkFBWixDQUE4QixJQUE5QixDQUFtQyxRQUFuQztBQUNEOztBQUVEOzs7Ozs7O0FBT0EsV0FBUyxnQkFBVCxDQUEwQixRQUExQixFQUFvQyxRQUFwQyxFQUE4QztBQUM1QztBQUNBLFFBQUksQ0FBQyxRQUFMLEVBQWU7QUFDYixhQUFPLFVBQVA7QUFDRDs7QUFFRCxRQUFJLHFCQUFxQixpQkFBaUIsS0FBSyxNQUF0QixDQUF6QjtBQUFBLFFBQ0ksVUFBVSxtQkFBbUIsT0FEakM7O0FBR0EsUUFBSSxrQkFBa0IsU0FBUyxlQUFULENBQXlCLE1BQXpCLEVBQWlDLFFBQWpDLEVBQTJDO0FBQy9ELFVBQUksQ0FBQyxRQUFMLEVBQWU7QUFDZixjQUFRLFNBQVMsZUFBakIsRUFBa0MscUJBQXFCLE1BQXJCLEdBQThCLGVBQTlCLEdBQWdELHFCQUFsRixFQUF5RyxRQUF6RztBQUNELEtBSEQ7O0FBS0EsUUFBSSxXQUFXLFNBQVMsUUFBVCxDQUFrQixDQUFsQixFQUFxQjtBQUNsQyxVQUFJLEVBQUUsTUFBRixLQUFhLE9BQWpCLEVBQTBCO0FBQ3hCLHdCQUFnQixRQUFoQixFQUEwQixRQUExQjtBQUNBO0FBQ0Q7QUFDRixLQUxEOztBQU9BLG9CQUFnQixRQUFoQixFQUEwQixLQUFLLENBQUwsQ0FBTyxHQUFQLEVBQVkscUJBQXRDO0FBQ0Esb0JBQWdCLEtBQWhCLEVBQXVCLFFBQXZCOztBQUVBLFNBQUssQ0FBTCxDQUFPLEdBQVAsRUFBWSxxQkFBWixHQUFvQyxRQUFwQztBQUNEOztBQUVELE1BQUksWUFBWSxDQUFoQjs7QUFFQTs7Ozs7O0FBTUEsV0FBUyxjQUFULENBQXdCLEdBQXhCLEVBQTZCLE1BQTdCLEVBQXFDO0FBQ25DLFdBQU8sSUFBSSxNQUFKLENBQVcsVUFBVSxHQUFWLEVBQWUsU0FBZixFQUEwQjtBQUMxQyxVQUFJLEtBQUssU0FBVDs7QUFFQSxVQUFJLFVBQVUsZ0JBQWdCLFNBQWhCLEVBQTJCLE9BQU8sV0FBUCxHQUFxQixNQUFyQixHQUE4QixxQkFBcUIsU0FBckIsRUFBZ0MsTUFBaEMsQ0FBekQsQ0FBZDs7QUFFQSxVQUFJLFFBQVEsVUFBVSxZQUFWLENBQXVCLE9BQXZCLENBQVo7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQUksQ0FBQyxLQUFELElBQVUsQ0FBQyxRQUFRLE1BQW5CLElBQTZCLENBQUMsUUFBUSxJQUF0QyxJQUE4QyxDQUFDLFFBQVEsWUFBM0QsRUFBeUU7QUFDdkUsZUFBTyxHQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxnQkFBVSxZQUFWLENBQXVCLFFBQVEsTUFBUixHQUFpQixxQkFBakIsR0FBeUMsWUFBaEUsRUFBOEUsRUFBOUU7O0FBRUEsa0JBQVksU0FBWjs7QUFFQSxVQUFJLFNBQVMsb0JBQW9CLEVBQXBCLEVBQXdCLEtBQXhCLEVBQStCLE9BQS9CLENBQWI7O0FBRUEsVUFBSSxRQUFRLElBQUksS0FBSixDQUFVO0FBQ3BCLFlBQUksRUFEZ0I7QUFFcEIsbUJBQVcsU0FGUztBQUdwQixnQkFBUSxNQUhZO0FBSXBCLGlCQUFTLE9BSlc7QUFLcEIsZUFBTyxLQUxhO0FBTXBCLHdCQUFnQjtBQU5JLE9BQVYsQ0FBWjs7QUFTQSxVQUFJLFFBQVEsMEJBQVosRUFBd0M7QUFDdEMsY0FBTSxjQUFOLEdBQXVCLHNCQUFzQixJQUF0QixDQUEyQixLQUEzQixDQUF2QjtBQUNBLGNBQU0sY0FBTixDQUFxQixxQkFBckI7QUFDRDs7QUFFRCxVQUFJLFlBQVksbUJBQW1CLElBQW5CLENBQXdCLEtBQXhCLENBQWhCO0FBQ0EsWUFBTSxTQUFOLEdBQWtCLFFBQVEsT0FBUixDQUFnQixJQUFoQixHQUF1QixLQUF2QixDQUE2QixHQUE3QixFQUFrQyxNQUFsQyxDQUF5QyxVQUFVLEdBQVYsRUFBZSxTQUFmLEVBQTBCO0FBQ25GLGVBQU8sSUFBSSxNQUFKLENBQVcsY0FBYyxTQUFkLEVBQXlCLFNBQXpCLEVBQW9DLFNBQXBDLEVBQStDLE9BQS9DLENBQVgsQ0FBUDtBQUNELE9BRmlCLEVBRWYsRUFGZSxDQUFsQjs7QUFJQTtBQUNBLFVBQUksUUFBUSxZQUFaLEVBQTBCO0FBQ3hCLDZCQUFxQixJQUFyQixDQUEwQixLQUExQixFQUFpQztBQUMvQixrQkFBUSxTQUR1QjtBQUUvQixvQkFBVSxTQUFTLFFBQVQsR0FBb0I7QUFDNUIsZ0JBQUksb0JBQW9CLGlCQUFpQixNQUFqQixDQUF4QjtBQUFBLGdCQUNJLFVBQVUsa0JBQWtCLE9BRGhDOztBQUdBLGdCQUFJLFFBQVEsVUFBVSxZQUFWLENBQXVCLE9BQXZCLENBQVo7QUFDQSxnQkFBSSxLQUFKLEVBQVc7QUFDVCxzQkFBUSxRQUFRLGNBQVIsR0FBeUIsV0FBekIsR0FBdUMsYUFBL0MsSUFBZ0UsTUFBTSxLQUFOLEdBQWMsS0FBOUU7QUFDQSwwQkFBWSxTQUFaO0FBQ0Q7QUFDRixXQVg4Qjs7QUFhL0IsbUJBQVM7QUFDUCx3QkFBWTtBQURMO0FBYnNCLFNBQWpDO0FBaUJEOztBQUVEO0FBQ0EsZ0JBQVUsTUFBVixHQUFtQixLQUFuQjtBQUNBLGFBQU8sTUFBUCxHQUFnQixLQUFoQjtBQUNBLGFBQU8sVUFBUCxHQUFvQixTQUFwQjs7QUFFQSxVQUFJLElBQUosQ0FBUyxLQUFUOztBQUVBOztBQUVBLGFBQU8sR0FBUDtBQUNELEtBekVNLEVBeUVKLEVBekVJLENBQVA7QUEwRUQ7O0FBRUQ7Ozs7QUFJQSxXQUFTLGNBQVQsQ0FBd0IsWUFBeEIsRUFBc0M7QUFDcEMsUUFBSSxVQUFVLFFBQVEsU0FBUyxnQkFBVCxDQUEwQixVQUFVLE1BQXBDLENBQVIsQ0FBZDs7QUFFQSxZQUFRLE9BQVIsQ0FBZ0IsVUFBVSxNQUFWLEVBQWtCO0FBQ2hDLFVBQUksUUFBUSxPQUFPLE1BQW5CO0FBQ0EsVUFBSSxDQUFDLEtBQUwsRUFBWTs7QUFFWixVQUFJLFVBQVUsTUFBTSxPQUFwQjs7QUFHQSxVQUFJLENBQUMsUUFBUSxXQUFSLEtBQXdCLElBQXhCLElBQWdDLFFBQVEsT0FBUixDQUFnQixPQUFoQixDQUF3QixPQUF4QixJQUFtQyxDQUFDLENBQXJFLE1BQTRFLENBQUMsWUFBRCxJQUFpQixXQUFXLGFBQWEsTUFBckgsQ0FBSixFQUFrSTtBQUNoSSxjQUFNLElBQU47QUFDRDtBQUNGLEtBVkQ7QUFXRDs7QUFFRDs7O0FBR0EsV0FBUyxrQkFBVCxHQUE4QjtBQUM1QixRQUFJLGtCQUFrQixTQUFTLGVBQVQsR0FBMkI7QUFDL0MsVUFBSSxRQUFRLFVBQVosRUFBd0I7O0FBRXhCLGNBQVEsVUFBUixHQUFxQixJQUFyQjs7QUFFQSxVQUFJLFFBQVEsR0FBWixFQUFpQjtBQUNmLGlCQUFTLElBQVQsQ0FBYyxTQUFkLENBQXdCLEdBQXhCLENBQTRCLGFBQTVCO0FBQ0Q7O0FBRUQsVUFBSSxRQUFRLHFCQUFSLElBQWlDLE9BQU8sV0FBNUMsRUFBeUQ7QUFDdkQsaUJBQVMsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUMsbUJBQXZDO0FBQ0Q7O0FBRUQsY0FBUSxpQkFBUixDQUEwQixPQUExQjtBQUNELEtBZEQ7O0FBZ0JBLFFBQUksc0JBQXNCLFlBQVk7QUFDcEMsVUFBSSxPQUFPLEtBQUssQ0FBaEI7O0FBRUEsYUFBTyxZQUFZO0FBQ2pCLFlBQUksTUFBTSxZQUFZLEdBQVosRUFBVjs7QUFFQTtBQUNBLFlBQUksTUFBTSxJQUFOLEdBQWEsRUFBakIsRUFBcUI7QUFDbkIsa0JBQVEsVUFBUixHQUFxQixLQUFyQjtBQUNBLG1CQUFTLG1CQUFULENBQTZCLFdBQTdCLEVBQTBDLG1CQUExQztBQUNBLGNBQUksQ0FBQyxRQUFRLEdBQWIsRUFBa0I7QUFDaEIscUJBQVMsSUFBVCxDQUFjLFNBQWQsQ0FBd0IsTUFBeEIsQ0FBK0IsYUFBL0I7QUFDRDtBQUNELGtCQUFRLGlCQUFSLENBQTBCLE9BQTFCO0FBQ0Q7O0FBRUQsZUFBTyxHQUFQO0FBQ0QsT0FkRDtBQWVELEtBbEJ5QixFQUExQjs7QUFvQkEsUUFBSSxrQkFBa0IsU0FBUyxlQUFULENBQXlCLEtBQXpCLEVBQWdDO0FBQ3BEO0FBQ0EsVUFBSSxFQUFFLE1BQU0sTUFBTixZQUF3QixPQUExQixDQUFKLEVBQXdDO0FBQ3RDLGVBQU8sZ0JBQVA7QUFDRDs7QUFFRCxVQUFJLFlBQVksUUFBUSxNQUFNLE1BQWQsRUFBc0IsVUFBVSxTQUFoQyxDQUFoQjtBQUNBLFVBQUksU0FBUyxRQUFRLE1BQU0sTUFBZCxFQUFzQixVQUFVLE1BQWhDLENBQWI7O0FBRUEsVUFBSSxVQUFVLE9BQU8sTUFBakIsSUFBMkIsT0FBTyxNQUFQLENBQWMsT0FBZCxDQUFzQixXQUFyRCxFQUFrRTtBQUNoRTtBQUNEOztBQUVELFVBQUksYUFBYSxVQUFVLE1BQTNCLEVBQW1DO0FBQ2pDLFlBQUksVUFBVSxVQUFVLE1BQVYsQ0FBaUIsT0FBL0I7O0FBRUEsWUFBSSxpQkFBaUIsUUFBUSxPQUFSLENBQWdCLE9BQWhCLENBQXdCLE9BQXhCLElBQW1DLENBQUMsQ0FBekQ7QUFDQSxZQUFJLGFBQWEsUUFBUSxRQUF6Qjs7QUFFQTtBQUNBLFlBQUksQ0FBQyxVQUFELElBQWUsUUFBUSxVQUF2QixJQUFxQyxDQUFDLFVBQUQsSUFBZSxjQUF4RCxFQUF3RTtBQUN0RSxpQkFBTyxlQUFlLFVBQVUsTUFBekIsQ0FBUDtBQUNEOztBQUVELFlBQUksUUFBUSxXQUFSLEtBQXdCLElBQXhCLElBQWdDLGNBQXBDLEVBQW9EO0FBQ2xEO0FBQ0Q7QUFDRjs7QUFFRDtBQUNELEtBOUJEOztBQWdDQSxRQUFJLGVBQWUsU0FBUyxZQUFULEdBQXdCO0FBQ3pDLFVBQUksWUFBWSxRQUFoQjtBQUFBLFVBQ0ksS0FBSyxVQUFVLGFBRG5COztBQUdBLFVBQUksTUFBTSxHQUFHLElBQVQsSUFBaUIsVUFBVSxJQUFWLENBQWUsRUFBZixFQUFtQixVQUFVLFNBQTdCLENBQXJCLEVBQThEO0FBQzVELFdBQUcsSUFBSDtBQUNEO0FBQ0YsS0FQRDs7QUFTQSxRQUFJLGlCQUFpQixTQUFTLGNBQVQsR0FBMEI7QUFDN0MsY0FBUSxTQUFTLGdCQUFULENBQTBCLFVBQVUsTUFBcEMsQ0FBUixFQUFxRCxPQUFyRCxDQUE2RCxVQUFVLE1BQVYsRUFBa0I7QUFDN0UsWUFBSSxnQkFBZ0IsT0FBTyxNQUEzQjtBQUNBLFlBQUksaUJBQWlCLENBQUMsY0FBYyxPQUFkLENBQXNCLGFBQTVDLEVBQTJEO0FBQ3pELHdCQUFjLGNBQWQsQ0FBNkIsY0FBN0I7QUFDRDtBQUNGLE9BTEQ7QUFNRCxLQVBEOztBQVNBLGFBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsZUFBbkM7QUFDQSxhQUFTLGdCQUFULENBQTBCLFlBQTFCLEVBQXdDLGVBQXhDO0FBQ0EsV0FBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxZQUFoQztBQUNBLFdBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsY0FBbEM7O0FBRUEsUUFBSSxDQUFDLFFBQVEsYUFBVCxLQUEyQixVQUFVLGNBQVYsSUFBNEIsVUFBVSxnQkFBakUsQ0FBSixFQUF3RjtBQUN0RixlQUFTLGdCQUFULENBQTBCLGFBQTFCLEVBQXlDLGVBQXpDO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJLHNCQUFzQixLQUExQjs7QUFFQTs7Ozs7OztBQU9BLFdBQVMsT0FBVCxDQUFpQixRQUFqQixFQUEyQixPQUEzQixFQUFvQyxHQUFwQyxFQUF5QztBQUN2QyxRQUFJLFFBQVEsU0FBUixJQUFxQixDQUFDLG1CQUExQixFQUErQztBQUM3QztBQUNBLDRCQUFzQixJQUF0QjtBQUNEOztBQUVELFFBQUksZ0JBQWdCLFFBQWhCLENBQUosRUFBK0I7QUFDN0Isb0NBQThCLFFBQTlCO0FBQ0Q7O0FBRUQsY0FBVSxTQUFTLEVBQVQsRUFBYSxRQUFiLEVBQXVCLE9BQXZCLENBQVY7O0FBRUEsUUFBSSxhQUFhLG1CQUFtQixRQUFuQixDQUFqQjtBQUNBLFFBQUksaUJBQWlCLFdBQVcsQ0FBWCxDQUFyQjs7QUFFQSxXQUFPO0FBQ0wsZ0JBQVUsUUFETDtBQUVMLGVBQVMsT0FGSjtBQUdMLGdCQUFVLFFBQVEsU0FBUixHQUFvQixlQUFlLE9BQU8sY0FBUCxHQUF3QixDQUFDLGNBQUQsQ0FBeEIsR0FBMkMsVUFBMUQsRUFBc0UsT0FBdEUsQ0FBcEIsR0FBcUcsRUFIMUc7QUFJTCxrQkFBWSxTQUFTLFVBQVQsR0FBc0I7QUFDaEMsYUFBSyxRQUFMLENBQWMsT0FBZCxDQUFzQixVQUFVLE9BQVYsRUFBbUI7QUFDdkMsaUJBQU8sUUFBUSxPQUFSLEVBQVA7QUFDRCxTQUZEO0FBR0EsYUFBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0Q7QUFUSSxLQUFQO0FBV0Q7O0FBRUQsVUFBUSxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsVUFBUSxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsVUFBUSxRQUFSLEdBQW1CLFFBQW5CO0FBQ0EsVUFBUSxHQUFSLEdBQWMsVUFBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCO0FBQ3pDLFdBQU8sUUFBUSxRQUFSLEVBQWtCLE9BQWxCLEVBQTJCLElBQTNCLEVBQWlDLFFBQWpDLENBQTBDLENBQTFDLENBQVA7QUFDRCxHQUZEO0FBR0EsVUFBUSxpQkFBUixHQUE0QixZQUFZO0FBQ3RDLGFBQVMsY0FBVCxHQUEwQixTQUFTLFFBQVQsR0FBb0IsQ0FBOUM7QUFDQSxhQUFTLFdBQVQsR0FBdUIsS0FBdkI7QUFDRCxHQUhEOztBQUtBLFNBQU8sT0FBUDtBQUVDLENBN3BJQSxDQUFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXG4vKipcbiAqIEFycmF5I2ZpbHRlci5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge09iamVjdD19IHNlbGZcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQHRocm93IFR5cGVFcnJvclxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyciwgZm4sIHNlbGYpIHtcbiAgaWYgKGFyci5maWx0ZXIpIHJldHVybiBhcnIuZmlsdGVyKGZuLCBzZWxmKTtcbiAgaWYgKHZvaWQgMCA9PT0gYXJyIHx8IG51bGwgPT09IGFycikgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgaWYgKCdmdW5jdGlvbicgIT0gdHlwZW9mIGZuKSB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICB2YXIgcmV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCFoYXNPd24uY2FsbChhcnIsIGkpKSBjb250aW51ZTtcbiAgICB2YXIgdmFsID0gYXJyW2ldO1xuICAgIGlmIChmbi5jYWxsKHNlbGYsIHZhbCwgaSwgYXJyKSkgcmV0LnB1c2godmFsKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4iLCIvKipcbiAqIGFycmF5LWZvcmVhY2hcbiAqICAgQXJyYXkjZm9yRWFjaCBwb255ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnNcbiAqICAgKFBvbnlmaWxsOiBBIHBvbHlmaWxsIHRoYXQgZG9lc24ndCBvdmVyd3JpdGUgdGhlIG5hdGl2ZSBtZXRob2QpXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LTIwMTYgVGFrdXRvIFdhZGFcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2gvYmxvYi9tYXN0ZXIvTUlULUxJQ0VOU0VcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2ggKGFyeSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBpZiAoYXJ5LmZvckVhY2gpIHtcbiAgICAgICAgYXJ5LmZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSs9MSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGFyeVtpXSwgaSwgYXJ5KTtcbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSmZaVzF3ZEhrdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXMTE5IiwiLypcbiAqIGNsYXNzTGlzdC5qczogQ3Jvc3MtYnJvd3NlciBmdWxsIGVsZW1lbnQuY2xhc3NMaXN0IGltcGxlbWVudGF0aW9uLlxuICogMS4xLjIwMTcwNDI3XG4gKlxuICogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxuICogTGljZW5zZTogRGVkaWNhdGVkIHRvIHRoZSBwdWJsaWMgZG9tYWluLlxuICogICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG4vKmdsb2JhbCBzZWxmLCBkb2N1bWVudCwgRE9NRXhjZXB0aW9uICovXG5cbi8qISBAc291cmNlIGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvY2xhc3NMaXN0LmpzICovXG5cbmlmIChcImRvY3VtZW50XCIgaW4gd2luZG93LnNlbGYpIHtcblxuLy8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxuLy8gSW5jbHVkaW5nIElFIDwgRWRnZSBtaXNzaW5nIFNWR0VsZW1lbnQuY2xhc3NMaXN0XG5pZiAoIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpKSBcblx0fHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKSkpIHtcblxuKGZ1bmN0aW9uICh2aWV3KSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5pZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcblxudmFyXG5cdCAgY2xhc3NMaXN0UHJvcCA9IFwiY2xhc3NMaXN0XCJcblx0LCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG5cdCwgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF1cblx0LCBvYmpDdHIgPSBPYmplY3Rcblx0LCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIik7XG5cdH1cblx0LCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIGkgPSAwXG5cdFx0XHQsIGxlbiA9IHRoaXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cdC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xuXHQsIERPTUV4ID0gZnVuY3Rpb24gKHR5cGUsIG1lc3NhZ2UpIHtcblx0XHR0aGlzLm5hbWUgPSB0eXBlO1xuXHRcdHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9XG5cdCwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcblx0XHRpZiAodG9rZW4gPT09IFwiXCIpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIlNZTlRBWF9FUlJcIlxuXHRcdFx0XHQsIFwiQW4gaW52YWxpZCBvciBpbGxlZ2FsIHN0cmluZyB3YXMgc3BlY2lmaWVkXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCJcblx0XHRcdFx0LCBcIlN0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3RlclwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xuXHR9XG5cdCwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxuXHRcdFx0LCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cblx0XHRcdCwgaSA9IDBcblx0XHRcdCwgbGVuID0gY2xhc3Nlcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0dGhpcy5wdXNoKGNsYXNzZXNbaV0pO1xuXHRcdH1cblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMudG9TdHJpbmcoKSk7XG5cdFx0fTtcblx0fVxuXHQsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxuXHQsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IENsYXNzTGlzdCh0aGlzKTtcblx0fVxuO1xuLy8gTW9zdCBET01FeGNlcHRpb24gaW1wbGVtZW50YXRpb25zIGRvbid0IGFsbG93IGNhbGxpbmcgRE9NRXhjZXB0aW9uJ3MgdG9TdHJpbmcoKVxuLy8gb24gbm9uLURPTUV4Y2VwdGlvbnMuIEVycm9yJ3MgdG9TdHJpbmcoKSBpcyBzdWZmaWNpZW50IGhlcmUuXG5ET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcbmNsYXNzTGlzdFByb3RvLml0ZW0gPSBmdW5jdGlvbiAoaSkge1xuXHRyZXR1cm4gdGhpc1tpXSB8fCBudWxsO1xufTtcbmNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cdHJldHVybiBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pICE9PSAtMTtcbn07XG5jbGFzc0xpc3RQcm90by5hZGQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xuXHRcdFx0dGhpcy5wdXNoKHRva2VuKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHRcdCwgaW5kZXhcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR3aGlsZSAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHR0aGlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cblx0dmFyXG5cdFx0ICByZXN1bHQgPSB0aGlzLmNvbnRhaW5zKHRva2VuKVxuXHRcdCwgbWV0aG9kID0gcmVzdWx0ID9cblx0XHRcdGZvcmNlICE9PSB0cnVlICYmIFwicmVtb3ZlXCJcblx0XHQ6XG5cdFx0XHRmb3JjZSAhPT0gZmFsc2UgJiYgXCJhZGRcIlxuXHQ7XG5cblx0aWYgKG1ldGhvZCkge1xuXHRcdHRoaXNbbWV0aG9kXSh0b2tlbik7XG5cdH1cblxuXHRpZiAoZm9yY2UgPT09IHRydWUgfHwgZm9yY2UgPT09IGZhbHNlKSB7XG5cdFx0cmV0dXJuIGZvcmNlO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiAhcmVzdWx0O1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmpvaW4oXCIgXCIpO1xufTtcblxuaWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xuXHR2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XG5cdFx0ICBnZXQ6IGNsYXNzTGlzdEdldHRlclxuXHRcdCwgZW51bWVyYWJsZTogdHJ1ZVxuXHRcdCwgY29uZmlndXJhYmxlOiB0cnVlXG5cdH07XG5cdHRyeSB7XG5cdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHR9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcblx0XHQvLyBhZGRpbmcgdW5kZWZpbmVkIHRvIGZpZ2h0IHRoaXMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2lzc3Vlcy8zNlxuXHRcdC8vIG1vZGVybmllIElFOC1NU1c3IG1hY2hpbmUgaGFzIElFOCA4LjAuNjAwMS4xODcwMiBhbmQgaXMgYWZmZWN0ZWRcblx0XHRpZiAoZXgubnVtYmVyID09PSB1bmRlZmluZWQgfHwgZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xuXHRcdFx0Y2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuXHRcdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHRcdH1cblx0fVxufSBlbHNlIGlmIChvYmpDdHJbcHJvdG9Qcm9wXS5fX2RlZmluZUdldHRlcl9fKSB7XG5cdGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XG59XG5cbn0od2luZG93LnNlbGYpKTtcblxufVxuXG4vLyBUaGVyZSBpcyBmdWxsIG9yIHBhcnRpYWwgbmF0aXZlIGNsYXNzTGlzdCBzdXBwb3J0LCBzbyBqdXN0IGNoZWNrIGlmIHdlIG5lZWRcbi8vIHRvIG5vcm1hbGl6ZSB0aGUgYWRkL3JlbW92ZSBhbmQgdG9nZ2xlIEFQSXMuXG5cbihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpO1xuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjMVwiLCBcImMyXCIpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMC8xMSBhbmQgRmlyZWZveCA8MjYsIHdoZXJlIGNsYXNzTGlzdC5hZGQgYW5kXG5cdC8vIGNsYXNzTGlzdC5yZW1vdmUgZXhpc3QgYnV0IHN1cHBvcnQgb25seSBvbmUgYXJndW1lbnQgYXQgYSB0aW1lLlxuXHRpZiAoIXRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMyXCIpKSB7XG5cdFx0dmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdO1xuXG5cdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih0b2tlbikge1xuXHRcdFx0XHR2YXIgaSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0XHR0b2tlbiA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdFx0XHRvcmlnaW5hbC5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdGNyZWF0ZU1ldGhvZCgnYWRkJyk7XG5cdFx0Y3JlYXRlTWV0aG9kKCdyZW1vdmUnKTtcblx0fVxuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJjM1wiLCBmYWxzZSk7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwIGFuZCBGaXJlZm94IDwyNCwgd2hlcmUgY2xhc3NMaXN0LnRvZ2dsZSBkb2VzIG5vdFxuXHQvLyBzdXBwb3J0IHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdGlmICh0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjM1wiKSkge1xuXHRcdHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XG5cblx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKHRva2VuLCBmb3JjZSkge1xuXHRcdFx0aWYgKDEgaW4gYXJndW1lbnRzICYmICF0aGlzLmNvbnRhaW5zKHRva2VuKSA9PT0gIWZvcmNlKSB7XG5cdFx0XHRcdHJldHVybiBmb3JjZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBfdG9nZ2xlLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fVxuXG5cdHRlc3RFbGVtZW50ID0gbnVsbDtcbn0oKSk7XG5cbn1cbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuQXJyYXkuZnJvbTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5hc3NpZ247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjUuNycgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBpbmRleCwgdmFsdWUpIHtcbiAgaWYgKGluZGV4IGluIG9iamVjdCkgJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV07XG4gIHZhciBleHBvcnRzID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XG4gIHZhciBleHBQcm90byA9IGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pO1xuICB2YXIga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZiAoSVNfR0xPQkFMKSBzb3VyY2UgPSBuYW1lO1xuICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGV4cCA9IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICBpZiAodGFyZ2V0KSByZWRlZmluZSh0YXJnZXQsIGtleSwgb3V0LCB0eXBlICYgJGV4cG9ydC5VKTtcbiAgICAvLyBleHBvcnRcbiAgICBpZiAoZXhwb3J0c1trZXldICE9IG91dCkgaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYgKElTX1BST1RPICYmIGV4cFByb3RvW2tleV0gIT0gb3V0KSBleHBQcm90b1trZXldID0gb3V0O1xuICB9XG59O1xuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTtcbiIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyICRpdGVyQ3JlYXRlID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBCVUdHWSA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKTsgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxudmFyIEZGX0lURVJBVE9SID0gJ0BAaXRlcmF0b3InO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgaWYgKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKSByZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgdmFyIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFUztcbiAgdmFyIFZBTFVFU19CVUcgPSBmYWxzZTtcbiAgdmFyIHByb3RvID0gQmFzZS5wcm90b3R5cGU7XG4gIHZhciAkbmF0aXZlID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdO1xuICB2YXIgJGRlZmF1bHQgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKTtcbiAgdmFyICRlbnRyaWVzID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZDtcbiAgdmFyICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlO1xuICB2YXIgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZiAoJGFueU5hdGl2ZSkge1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUgJiYgSXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmICghTElCUkFSWSAmJiB0eXBlb2YgSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdICE9ICdmdW5jdGlvbicpIGhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSkge1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gPSByZXR1cm5UaGlzO1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChrZXkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKCEoa2V5IGluIHByb3RvKSkgcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcbiIsInZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uICgpIHsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRocm93LWxpdGVyYWxcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjLCBza2lwQ2xvc2luZykge1xuICBpZiAoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gWzddO1xuICAgIHZhciBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgZG9uZTogc2FmZSA9IHRydWUgfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyICRhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgUyA9IFN5bWJvbCgpO1xuICB2YXIgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUID0gdG9PYmplY3QodGFyZ2V0KTtcbiAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAxO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgdmFyIGlzRW51bSA9IHBJRS5mO1xuICB3aGlsZSAoYUxlbiA+IGluZGV4KSB7XG4gICAgdmFyIFMgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgdmFyIGtleXMgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikgaWYgKGlzRW51bS5jYWxsKFMsIGtleSA9IGtleXNbaisrXSkpIFRba2V5XSA9IFNba2V5XTtcbiAgfSByZXR1cm4gVDtcbn0gOiAkYXNzaWduO1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IGdldEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgUDtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFNSQyA9IHJlcXVpcmUoJy4vX3VpZCcpKCdzcmMnKTtcbnZhciBUT19TVFJJTkcgPSAndG9TdHJpbmcnO1xudmFyICR0b1N0cmluZyA9IEZ1bmN0aW9uW1RPX1NUUklOR107XG52YXIgVFBMID0gKCcnICsgJHRvU3RyaW5nKS5zcGxpdChUT19TVFJJTkcpO1xuXG5yZXF1aXJlKCcuL19jb3JlJykuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsLCBzYWZlKSB7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgJ25hbWUnKSB8fCBoaWRlKHZhbCwgJ25hbWUnLCBrZXkpO1xuICBpZiAoT1trZXldID09PSB2YWwpIHJldHVybjtcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsIFNSQykgfHwgaGlkZSh2YWwsIFNSQywgT1trZXldID8gJycgKyBPW2tleV0gOiBUUEwuam9pbihTdHJpbmcoa2V5KSkpO1xuICBpZiAoTyA9PT0gZ2xvYmFsKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKCFzYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfSBlbHNlIGlmIChPW2tleV0pIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzW1NSQ10gfHwgJHRvU3RyaW5nLmNhbGwodGhpcyk7XG59KTtcbiIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgdGFnLCBzdGF0KSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSBkZWYoaXQsIFRBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWcgfSk7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246IGNvcmUudmVyc2lvbixcbiAgbW9kZTogcmVxdWlyZSgnLi9fbGlicmFyeScpID8gJ3B1cmUnIDogJ2dsb2JhbCcsXG4gIGNvcHlyaWdodDogJ8KpIDIwMTggRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknXG59KTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikgeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgbWFwZm4gPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYgKG1hcHBpbmcpIG1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYgKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDKCk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvciAocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHsgYXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJykgfSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIi8qIVxuICAqIGRvbXJlYWR5IChjKSBEdXN0aW4gRGlheiAyMDE0IC0gTGljZW5zZSBNSVRcbiAgKi9cbiFmdW5jdGlvbiAobmFtZSwgZGVmaW5pdGlvbikge1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIHRoaXNbbmFtZV0gPSBkZWZpbml0aW9uKClcblxufSgnZG9tcmVhZHknLCBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGZucyA9IFtdLCBsaXN0ZW5lclxuICAgICwgZG9jID0gZG9jdW1lbnRcbiAgICAsIGhhY2sgPSBkb2MuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsXG4gICAgLCBkb21Db250ZW50TG9hZGVkID0gJ0RPTUNvbnRlbnRMb2FkZWQnXG4gICAgLCBsb2FkZWQgPSAoaGFjayA/IC9ebG9hZGVkfF5jLyA6IC9ebG9hZGVkfF5pfF5jLykudGVzdChkb2MucmVhZHlTdGF0ZSlcblxuXG4gIGlmICghbG9hZGVkKVxuICBkb2MuYWRkRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2MucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb21Db250ZW50TG9hZGVkLCBsaXN0ZW5lcilcbiAgICBsb2FkZWQgPSAxXG4gICAgd2hpbGUgKGxpc3RlbmVyID0gZm5zLnNoaWZ0KCkpIGxpc3RlbmVyKClcbiAgfSlcblxuICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgbG9hZGVkID8gc2V0VGltZW91dChmbiwgMCkgOiBmbnMucHVzaChmbilcbiAgfVxuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gPDMgTW9kZXJuaXpyXG4vLyBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vTW9kZXJuaXpyL01vZGVybml6ci9tYXN0ZXIvZmVhdHVyZS1kZXRlY3RzL2RvbS9kYXRhc2V0LmpzXG5cbmZ1bmN0aW9uIHVzZU5hdGl2ZSgpIHtcblx0dmFyIGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0ZWxlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtYS1iJywgJ2MnKTtcblxuXHRyZXR1cm4gQm9vbGVhbihlbGVtLmRhdGFzZXQgJiYgZWxlbS5kYXRhc2V0LmFCID09PSAnYycpO1xufVxuXG5mdW5jdGlvbiBuYXRpdmVEYXRhc2V0KGVsZW1lbnQpIHtcblx0cmV0dXJuIGVsZW1lbnQuZGF0YXNldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1c2VOYXRpdmUoKSA/IG5hdGl2ZURhdGFzZXQgOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHR2YXIgbWFwID0ge307XG5cdHZhciBhdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzO1xuXG5cdGZ1bmN0aW9uIGdldHRlcigpIHtcblx0XHRyZXR1cm4gdGhpcy52YWx1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldHRlcihuYW1lLCB2YWx1ZSkge1xuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHR0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuXHRcdH1cblx0fVxuXG5cdGZvciAodmFyIGkgPSAwLCBqID0gYXR0cmlidXRlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcblx0XHR2YXIgYXR0cmlidXRlID0gYXR0cmlidXRlc1tpXTtcblxuXHRcdGlmIChhdHRyaWJ1dGUpIHtcblx0XHRcdHZhciBuYW1lID0gYXR0cmlidXRlLm5hbWU7XG5cblx0XHRcdGlmIChuYW1lLmluZGV4T2YoJ2RhdGEtJykgPT09IDApIHtcblx0XHRcdFx0dmFyIHByb3AgPSBuYW1lLnNsaWNlKDUpLnJlcGxhY2UoLy0uL2csIGZ1bmN0aW9uICh1KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHUuY2hhckF0KDEpLnRvVXBwZXJDYXNlKCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciB2YWx1ZSA9IGF0dHJpYnV0ZS52YWx1ZTtcblxuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobWFwLCBwcm9wLCB7XG5cdFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRnZXQ6IGdldHRlci5iaW5kKHsgdmFsdWU6IHZhbHVlIHx8ICcnIH0pLFxuXHRcdFx0XHRcdHNldDogc2V0dGVyLmJpbmQoZWxlbWVudCwgbmFtZSlcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG1hcDtcbn07XG5cbiIsIi8vIGVsZW1lbnQtY2xvc2VzdCB8IENDMC0xLjAgfCBnaXRodWIuY29tL2pvbmF0aGFudG5lYWwvY2xvc2VzdFxuXG4oZnVuY3Rpb24gKEVsZW1lbnRQcm90bykge1xuXHRpZiAodHlwZW9mIEVsZW1lbnRQcm90by5tYXRjaGVzICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0RWxlbWVudFByb3RvLm1hdGNoZXMgPSBFbGVtZW50UHJvdG8ubXNNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudFByb3RvLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50UHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGZ1bmN0aW9uIG1hdGNoZXMoc2VsZWN0b3IpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gdGhpcztcblx0XHRcdHZhciBlbGVtZW50cyA9IChlbGVtZW50LmRvY3VtZW50IHx8IGVsZW1lbnQub3duZXJEb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdFx0XHR2YXIgaW5kZXggPSAwO1xuXG5cdFx0XHR3aGlsZSAoZWxlbWVudHNbaW5kZXhdICYmIGVsZW1lbnRzW2luZGV4XSAhPT0gZWxlbWVudCkge1xuXHRcdFx0XHQrK2luZGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gQm9vbGVhbihlbGVtZW50c1tpbmRleF0pO1xuXHRcdH07XG5cdH1cblxuXHRpZiAodHlwZW9mIEVsZW1lbnRQcm90by5jbG9zZXN0ICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0RWxlbWVudFByb3RvLmNsb3Nlc3QgPSBmdW5jdGlvbiBjbG9zZXN0KHNlbGVjdG9yKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IHRoaXM7XG5cblx0XHRcdHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IDEpIHtcblx0XHRcdFx0aWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH07XG5cdH1cbn0pKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSk7XG4iLCIvKipcbiAqIGxvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIEdldHMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZVxuICogdGhlIFVuaXggZXBvY2ggKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IERhdGVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVzdGFtcC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBMb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBpbnZvY2F0aW9uLlxuICovXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiByb290LkRhdGUubm93KCk7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHJlc3VsdCA9IHdhaXQgLSB0aW1lU2luY2VMYXN0Q2FsbDtcblxuICAgIHJldHVybiBtYXhpbmcgPyBuYXRpdmVNaW4ocmVzdWx0LCBtYXhXYWl0IC0gdGltZVNpbmNlTGFzdEludm9rZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzaG91bGRJbnZva2UodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWU7XG5cbiAgICAvLyBFaXRoZXIgdGhpcyBpcyB0aGUgZmlyc3QgY2FsbCwgYWN0aXZpdHkgaGFzIHN0b3BwZWQgYW5kIHdlJ3JlIGF0IHRoZVxuICAgIC8vIHRyYWlsaW5nIGVkZ2UsIHRoZSBzeXN0ZW0gdGltZSBoYXMgZ29uZSBiYWNrd2FyZHMgYW5kIHdlJ3JlIHRyZWF0aW5nXG4gICAgLy8gaXQgYXMgdGhlIHRyYWlsaW5nIGVkZ2UsIG9yIHdlJ3ZlIGhpdCB0aGUgYG1heFdhaXRgIGxpbWl0LlxuICAgIHJldHVybiAobGFzdENhbGxUaW1lID09PSB1bmRlZmluZWQgfHwgKHRpbWVTaW5jZUxhc3RDYWxsID49IHdhaXQpIHx8XG4gICAgICAodGltZVNpbmNlTGFzdENhbGwgPCAwKSB8fCAobWF4aW5nICYmIHRpbWVTaW5jZUxhc3RJbnZva2UgPj0gbWF4V2FpdCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGltZXJFeHBpcmVkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCk7XG4gICAgaWYgKHNob3VsZEludm9rZSh0aW1lKSkge1xuICAgICAgcmV0dXJuIHRyYWlsaW5nRWRnZSh0aW1lKTtcbiAgICB9XG4gICAgLy8gUmVzdGFydCB0aGUgdGltZXIuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCByZW1haW5pbmdXYWl0KHRpbWUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYWlsaW5nRWRnZSh0aW1lKSB7XG4gICAgdGltZXJJZCA9IHVuZGVmaW5lZDtcblxuICAgIC8vIE9ubHkgaW52b2tlIGlmIHdlIGhhdmUgYGxhc3RBcmdzYCB3aGljaCBtZWFucyBgZnVuY2AgaGFzIGJlZW5cbiAgICAvLyBkZWJvdW5jZWQgYXQgbGVhc3Qgb25jZS5cbiAgICBpZiAodHJhaWxpbmcgJiYgbGFzdEFyZ3MpIHtcbiAgICAgIHJldHVybiBpbnZva2VGdW5jKHRpbWUpO1xuICAgIH1cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKHRpbWVySWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgIH1cbiAgICBsYXN0SW52b2tlVGltZSA9IDA7XG4gICAgbGFzdEFyZ3MgPSBsYXN0Q2FsbFRpbWUgPSBsYXN0VGhpcyA9IHRpbWVySWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICByZXR1cm4gdGltZXJJZCA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogdHJhaWxpbmdFZGdlKG5vdygpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpLFxuICAgICAgICBpc0ludm9raW5nID0gc2hvdWxkSW52b2tlKHRpbWUpO1xuXG4gICAgbGFzdEFyZ3MgPSBhcmd1bWVudHM7XG4gICAgbGFzdFRoaXMgPSB0aGlzO1xuICAgIGxhc3RDYWxsVGltZSA9IHRpbWU7XG5cbiAgICBpZiAoaXNJbnZva2luZykge1xuICAgICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbGVhZGluZ0VkZ2UobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXhpbmcpIHtcbiAgICAgICAgLy8gSGFuZGxlIGludm9jYXRpb25zIGluIGEgdGlnaHQgbG9vcC5cbiAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAgICAgcmV0dXJuIGludm9rZUZ1bmMobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBkZWJvdW5jZWQuY2FuY2VsID0gY2FuY2VsO1xuICBkZWJvdW5jZWQuZmx1c2ggPSBmbHVzaDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuY29uc3QgZGVsZWdhdGUgPSByZXF1aXJlKCcuLi9kZWxlZ2F0ZScpO1xuY29uc3QgZGVsZWdhdGVBbGwgPSByZXF1aXJlKCcuLi9kZWxlZ2F0ZUFsbCcpO1xuXG5jb25zdCBERUxFR0FURV9QQVRURVJOID0gL14oLispOmRlbGVnYXRlXFwoKC4rKVxcKSQvO1xuY29uc3QgU1BBQ0UgPSAnICc7XG5cbmNvbnN0IGdldExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgdmFyIG1hdGNoID0gdHlwZS5tYXRjaChERUxFR0FURV9QQVRURVJOKTtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAobWF0Y2gpIHtcbiAgICB0eXBlID0gbWF0Y2hbMV07XG4gICAgc2VsZWN0b3IgPSBtYXRjaFsyXTtcbiAgfVxuXG4gIHZhciBvcHRpb25zO1xuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGNhcHR1cmU6IHBvcEtleShoYW5kbGVyLCAnY2FwdHVyZScpLFxuICAgICAgcGFzc2l2ZTogcG9wS2V5KGhhbmRsZXIsICdwYXNzaXZlJylcbiAgICB9O1xuICB9XG5cbiAgdmFyIGxpc3RlbmVyID0ge1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICBkZWxlZ2F0ZTogKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0JylcbiAgICAgID8gZGVsZWdhdGVBbGwoaGFuZGxlcilcbiAgICAgIDogc2VsZWN0b3JcbiAgICAgICAgPyBkZWxlZ2F0ZShzZWxlY3RvciwgaGFuZGxlcilcbiAgICAgICAgOiBoYW5kbGVyLFxuICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgfTtcblxuICBpZiAodHlwZS5pbmRleE9mKFNQQUNFKSA+IC0xKSB7XG4gICAgcmV0dXJuIHR5cGUuc3BsaXQoU1BBQ0UpLm1hcChmdW5jdGlvbihfdHlwZSkge1xuICAgICAgcmV0dXJuIGFzc2lnbih7dHlwZTogX3R5cGV9LCBsaXN0ZW5lcik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdGVuZXIudHlwZSA9IHR5cGU7XG4gICAgcmV0dXJuIFtsaXN0ZW5lcl07XG4gIH1cbn07XG5cbnZhciBwb3BLZXkgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgZGVsZXRlIG9ialtrZXldO1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJlaGF2aW9yKGV2ZW50cywgcHJvcHMpIHtcbiAgY29uc3QgbGlzdGVuZXJzID0gT2JqZWN0LmtleXMoZXZlbnRzKVxuICAgIC5yZWR1Y2UoZnVuY3Rpb24obWVtbywgdHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycyA9IGdldExpc3RlbmVycyh0eXBlLCBldmVudHNbdHlwZV0pO1xuICAgICAgcmV0dXJuIG1lbW8uY29uY2F0KGxpc3RlbmVycyk7XG4gICAgfSwgW10pO1xuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIGFkZDogZnVuY3Rpb24gYWRkQmVoYXZpb3IoZWxlbWVudCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGxpc3RlbmVyLnR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIuZGVsZWdhdGUsXG4gICAgICAgICAgbGlzdGVuZXIub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZUJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgcHJvcHMpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcG9zZShmdW5jdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25zLnNvbWUoZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpID09PSBmYWxzZTtcbiAgICB9LCB0aGlzKTtcbiAgfTtcbn07XG4iLCJjb25zdCBkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4uL2RlbGVnYXRlJyk7XG5jb25zdCBjb21wb3NlID0gcmVxdWlyZSgnLi4vY29tcG9zZScpO1xuXG5jb25zdCBTUExBVCA9ICcqJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZUFsbChzZWxlY3RvcnMpIHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHNlbGVjdG9ycylcblxuICAvLyBYWFggb3B0aW1pemF0aW9uOiBpZiB0aGVyZSBpcyBvbmx5IG9uZSBoYW5kbGVyIGFuZCBpdCBhcHBsaWVzIHRvXG4gIC8vIGFsbCBlbGVtZW50cyAodGhlIFwiKlwiIENTUyBzZWxlY3RvciksIHRoZW4ganVzdCByZXR1cm4gdGhhdFxuICAvLyBoYW5kbGVyXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMSAmJiBrZXlzWzBdID09PSBTUExBVCkge1xuICAgIHJldHVybiBzZWxlY3RvcnNbU1BMQVRdO1xuICB9XG5cbiAgY29uc3QgZGVsZWdhdGVzID0ga2V5cy5yZWR1Y2UoZnVuY3Rpb24obWVtbywgc2VsZWN0b3IpIHtcbiAgICBtZW1vLnB1c2goZGVsZWdhdGUoc2VsZWN0b3IsIHNlbGVjdG9yc1tzZWxlY3Rvcl0pKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfSwgW10pO1xuICByZXR1cm4gY29tcG9zZShkZWxlZ2F0ZXMpO1xufTtcbiIsIi8vIHBvbHlmaWxsIEVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3RcbnJlcXVpcmUoJ2VsZW1lbnQtY2xvc2VzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlKHNlbGVjdG9yLCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZGVsZWdhdGlvbihldmVudCkge1xuICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdChzZWxlY3Rvcik7XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGFyZ2V0LCBldmVudCk7XG4gICAgfVxuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbmNlKGxpc3RlbmVyLCBvcHRpb25zKSB7XG4gIHZhciB3cmFwcGVkID0gZnVuY3Rpb24gd3JhcHBlZE9uY2UoZSkge1xuICAgIGUuY3VycmVudFRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGUudHlwZSwgd3JhcHBlZCwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIGxpc3RlbmVyLmNhbGwodGhpcywgZSk7XG4gIH07XG4gIHJldHVybiB3cmFwcGVkO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xuY29uc3QgZmlsdGVyID0gcmVxdWlyZSgnYXJyYXktZmlsdGVyJyk7XG5jb25zdCBmb3JFYWNoID0gcmVxdWlyZSgnYXJyYXktZm9yZWFjaCcpO1xuY29uc3QgdG9nZ2xlID0gcmVxdWlyZSgnLi4vdXRpbHMvdG9nZ2xlJyk7XG5jb25zdCBpc0VsZW1lbnRJblZpZXdwb3J0ID0gcmVxdWlyZSgnLi4vdXRpbHMvaXMtaW4tdmlld3BvcnQnKTtcblxuY29uc3QgQ0xJQ0sgPSByZXF1aXJlKCcuLi9ldmVudHMnKS5DTElDSztcbmNvbnN0IFBSRUZJWCA9IHJlcXVpcmUoJy4uL2NvbmZpZycpLnByZWZpeDtcblxuLy8gWFhYIG1hdGNoIC5hY2NvcmRpb24gYW5kIC5hY2NvcmRpb24tYm9yZGVyZWRcbmNvbnN0IEFDQ09SRElPTiA9IGAuJHtQUkVGSVh9YWNjb3JkaW9uLCAuJHtQUkVGSVh9YWNjb3JkaW9uLWJvcmRlcmVkYDtcbmNvbnN0IEJVVFRPTiA9IGAuJHtQUkVGSVh9YWNjb3JkaW9uLWJ1dHRvblthcmlhLWNvbnRyb2xzXWA7XG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcbmNvbnN0IE1VTFRJU0VMRUNUQUJMRSA9ICdhcmlhLW11bHRpc2VsZWN0YWJsZSc7XG5cbi8qKlxuICogVG9nZ2xlIGEgYnV0dG9uJ3MgXCJwcmVzc2VkXCIgc3RhdGUsIG9wdGlvbmFsbHkgcHJvdmlkaW5nIGEgdGFyZ2V0XG4gKiBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGV4cGFuZGVkIElmIG5vIHN0YXRlIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudFxuICogc3RhdGUgd2lsbCBiZSB0b2dnbGVkIChmcm9tIGZhbHNlIHRvIHRydWUsIGFuZCB2aWNlLXZlcnNhKS5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRoZSByZXN1bHRpbmcgc3RhdGVcbiAqL1xuY29uc3QgdG9nZ2xlQnV0dG9uID0gKGJ1dHRvbiwgZXhwYW5kZWQpID0+IHtcbiAgdmFyIGFjY29yZGlvbiA9IGJ1dHRvbi5jbG9zZXN0KEFDQ09SRElPTik7XG4gIGlmICghYWNjb3JkaW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAke0JVVFRPTn0gaXMgbWlzc2luZyBvdXRlciAke0FDQ09SRElPTn1gKTtcbiAgfVxuXG4gIGV4cGFuZGVkID0gdG9nZ2xlKGJ1dHRvbiwgZXhwYW5kZWQpO1xuICAvLyBYWFggbXVsdGlzZWxlY3RhYmxlIGlzIG9wdC1pbiwgdG8gcHJlc2VydmUgbGVnYWN5IGJlaGF2aW9yXG4gIGNvbnN0IG11bHRpc2VsZWN0YWJsZSA9IGFjY29yZGlvbi5nZXRBdHRyaWJ1dGUoTVVMVElTRUxFQ1RBQkxFKSA9PT0gJ3RydWUnO1xuXG4gIGlmIChleHBhbmRlZCAmJiAhbXVsdGlzZWxlY3RhYmxlKSB7XG4gICAgZm9yRWFjaChnZXRBY2NvcmRpb25CdXR0b25zKGFjY29yZGlvbiksIG90aGVyID0+IHtcbiAgICAgIGlmIChvdGhlciAhPT0gYnV0dG9uKSB7XG4gICAgICAgIHRvZ2dsZShvdGhlciwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZVxuICovXG5jb25zdCBzaG93QnV0dG9uID0gYnV0dG9uID0+IHRvZ2dsZUJ1dHRvbihidXR0b24sIHRydWUpO1xuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxuICogQHJldHVybiB7Ym9vbGVhbn0gZmFsc2VcbiAqL1xuY29uc3QgaGlkZUJ1dHRvbiA9IGJ1dHRvbiA9PiB0b2dnbGVCdXR0b24oYnV0dG9uLCBmYWxzZSk7XG5cbi8qKlxuICogR2V0IGFuIEFycmF5IG9mIGJ1dHRvbiBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXG4gKiBhY2NvcmRpb24gZWxlbWVudC5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGFjY29yZGlvblxuICogQHJldHVybiB7YXJyYXk8SFRNTEJ1dHRvbkVsZW1lbnQ+fVxuICovXG5jb25zdCBnZXRBY2NvcmRpb25CdXR0b25zID0gYWNjb3JkaW9uID0+IHtcbiAgcmV0dXJuIGZpbHRlcihhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pLCBidXR0b24gPT4ge1xuICAgIHJldHVybiBidXR0b24uY2xvc2VzdChBQ0NPUkRJT04pID09PSBhY2NvcmRpb247XG4gIH0pO1xufTtcblxuY29uc3QgYWNjb3JkaW9uID0gYmVoYXZpb3Ioe1xuICBbIENMSUNLIF06IHtcbiAgICBbIEJVVFRPTiBdOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0b2dnbGVCdXR0b24odGhpcyk7XG5cbiAgICAgIGlmICh0aGlzLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJykge1xuICAgICAgICAvLyBXZSB3ZXJlIGp1c3QgZXhwYW5kZWQsIGJ1dCBpZiBhbm90aGVyIGFjY29yZGlvbiB3YXMgYWxzbyBqdXN0XG4gICAgICAgIC8vIGNvbGxhcHNlZCwgd2UgbWF5IG5vIGxvbmdlciBiZSBpbiB0aGUgdmlld3BvcnQuIFRoaXMgZW5zdXJlc1xuICAgICAgICAvLyB0aGF0IHdlIGFyZSBzdGlsbCB2aXNpYmxlLCBzbyB0aGUgdXNlciBpc24ndCBjb25mdXNlZC5cbiAgICAgICAgaWYgKCFpc0VsZW1lbnRJblZpZXdwb3J0KHRoaXMpKSB0aGlzLnNjcm9sbEludG9WaWV3KCk7XG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn0sIHtcbiAgaW5pdDogcm9vdCA9PiB7XG4gICAgZm9yRWFjaChyb290LnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKSwgYnV0dG9uID0+IHtcbiAgICAgIGNvbnN0IGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJztcbiAgICAgIHRvZ2dsZUJ1dHRvbihidXR0b24sIGV4cGFuZGVkKTtcbiAgICB9KTtcbiAgfSxcbiAgQUNDT1JESU9OLFxuICBCVVRUT04sXG4gIHNob3c6IHNob3dCdXR0b24sXG4gIGhpZGU6IGhpZGVCdXR0b24sXG4gIHRvZ2dsZTogdG9nZ2xlQnV0dG9uLFxuICBnZXRCdXR0b25zOiBnZXRBY2NvcmRpb25CdXR0b25zLFxufSk7XG5cbi8qKlxuICogVE9ETzogZm9yIDIuMCwgcmVtb3ZlIGV2ZXJ5dGhpbmcgYmVsb3cgdGhpcyBjb21tZW50IGFuZCBleHBvcnQgdGhlXG4gKiBiZWhhdmlvciBkaXJlY3RseTpcbiAqXG4gKiBtb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHsuLi59KTtcbiAqL1xuY29uc3QgQWNjb3JkaW9uID0gZnVuY3Rpb24gKHJvb3QpIHtcbiAgdGhpcy5yb290ID0gcm9vdDtcbiAgYWNjb3JkaW9uLm9uKHRoaXMucm9vdCk7XG59O1xuXG4vLyBjb3B5IGFsbCBvZiB0aGUgYmVoYXZpb3IgbWV0aG9kcyBhbmQgcHJvcHMgdG8gQWNjb3JkaW9uXG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5hc3NpZ24oQWNjb3JkaW9uLCBhY2NvcmRpb24pO1xuXG5BY2NvcmRpb24ucHJvdG90eXBlLnNob3cgPSBzaG93QnV0dG9uO1xuQWNjb3JkaW9uLnByb3RvdHlwZS5oaWRlID0gaGlkZUJ1dHRvbjtcblxuQWNjb3JkaW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gIGFjY29yZGlvbi5vZmYodGhpcy5yb290KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQWNjb3JkaW9uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XG5jb25zdCBjbG9zZXN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvY2xvc2VzdCcpO1xuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcblxuXG5jbGFzcyBjaGVja2JveFRvZ2dsZUNvbnRlbnR7XG4gICAgY29uc3RydWN0b3IoZWwpe1xuICAgICAgICB0aGlzLmpzVG9nZ2xlVHJpZ2dlciA9IFwiLmpzLWNoZWNrYm94LXRvZ2dsZS1jb250ZW50XCI7XG4gICAgICAgIHRoaXMuanNUb2dnbGVUYXJnZXQgPSBcImRhdGEtanMtdGFyZ2V0XCI7XG5cbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XG4gICAgICAgIHRoaXMuY2hlY2tib3hFbCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5pbml0KGVsKTtcbiAgICB9XG5cbiAgICBpbml0KGVsKXtcbiAgICAgICAgdGhpcy5jaGVja2JveEVsID0gZWw7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGVja2JveEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgdGhhdC50b2dnbGUodGhhdC5jaGVja2JveEVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudG9nZ2xlKHRoaXMuY2hlY2tib3hFbCk7XG4gICAgfVxuXG4gICAgdG9nZ2xlKHRyaWdnZXJFbCl7XG4gICAgICAgIHZhciB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZSh0aGlzLmpzVG9nZ2xlVGFyZ2V0KVxuICAgICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0RWwgPSBzZWxlY3QodGFyZ2V0QXR0ciwgJ2JvZHknKTtcbiAgICAgICAgICAgIGlmKHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwubGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAgICAgaWYodHJpZ2dlckVsLmNoZWNrZWQpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbFswXSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbFswXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZShcImNvbGxhcHNlZFwiKTtcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwiZmFsc2VcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCl7XG4gICAgICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIik7XG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKFwiY29sbGFwc2VkXCIpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrYm94VG9nZ2xlQ29udGVudDsiLCIvKipcclxuICogQ29sbGFwc2UvZXhwYW5kLlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xyXG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuY29uc3QgY2xvc2VzdCA9IHJlcXVpcmUoJy4uL3V0aWxzL2Nsb3Nlc3QnKTtcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuXHJcbmNvbnN0IGpzQ29sbGFwc2VUcmlnZ2VyID0gXCIuanMtY29sbGFwc2VcIjtcclxuY29uc3QganNDb2xsYXBzZVRhcmdldCA9IFwiZGF0YS1qcy10YXJnZXRcIjtcclxuXHJcbmNvbnN0IHRvZ2dsZUNvbGxhcHNlID0gZnVuY3Rpb24gKHRyaWdnZXJFbCwgZm9yY2VDbG9zZSkge1xyXG4gICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICB2YXIgdGFyZ2V0QXR0ciA9IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoanNDb2xsYXBzZVRhcmdldClcclxuICAgICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRFbCA9IHNlbGVjdCh0YXJnZXRBdHRyLCAnYm9keScpO1xyXG4gICAgICAgICAgICBpZih0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgLy90YXJnZXQgZm91bmQsIGNoZWNrIHN0YXRlXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRFbCA9IHRhcmdldEVsWzBdO1xyXG4gICAgICAgICAgICAgICAgLy9jaGFuZ2Ugc3RhdGVcclxuICAgICAgICAgICAgICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIpID09IFwidHJ1ZVwiIHx8IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIpID09IHVuZGVmaW5lZCB8fCBmb3JjZUNsb3NlICl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jbG9zZVxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVDb2xsYXBzZSh0YXJnZXRFbCwgdHJpZ2dlckVsKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIC8vb3BlblxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVFeHBhbmQodGFyZ2V0RWwsIHRyaWdnZXJFbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ICAgICAgIFxyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgdG9nZ2xlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgdHJpZ2dlckVsbSA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBqc0NvbGxhcHNlVHJpZ2dlcik7XHJcbiAgICBpZih0cmlnZ2VyRWxtICE9PSBudWxsICYmIHRyaWdnZXJFbG0gIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgdG9nZ2xlQ29sbGFwc2UodHJpZ2dlckVsbSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG52YXIgYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcclxuXHJcbmZ1bmN0aW9uIGFuaW1hdGVDb2xsYXBzZSh0YXJnZXRFbCwgdHJpZ2dlckVsKSB7XHJcbiAgICBpZighYW5pbWF0ZUluUHJvZ3Jlc3Mpe1xyXG4gICAgICAgIGFuaW1hdGVJblByb2dyZXNzID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSB0YXJnZXRFbC5jbGllbnRIZWlnaHQrIFwicHhcIjtcclxuICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKFwiY29sbGFwc2UtdHJhbnNpdGlvbi1jb2xsYXBzZVwiKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IFxyXG4gICAgICAgICAgICB0YXJnZXRFbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcclxuICAgICAgICB9LCA1KTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IFxyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKFwiY29sbGFwc2VkXCIpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKFwiY29sbGFwc2UtdHJhbnNpdGlvbi1jb2xsYXBzZVwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwiZmFsc2VcIik7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICAgYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcclxuICAgICAgICB9LCAyMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBhbmltYXRlRXhwYW5kKHRhcmdldEVsLCB0cmlnZ2VyRWwpIHtcclxuICAgIGlmKCFhbmltYXRlSW5Qcm9ncmVzcyl7XHJcbiAgICAgICAgYW5pbWF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xyXG4gICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJjb2xsYXBzZWRcIik7XHJcbiAgICAgICAgdmFyIGV4cGFuZGVkSGVpZ2h0ID0gdGFyZ2V0RWwuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmhlaWdodCA9IFwiMHB4XCI7XHJcbiAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZChcImNvbGxhcHNlLXRyYW5zaXRpb24tZXhwYW5kXCIpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgXHJcbiAgICAgICAgICAgIHRhcmdldEVsLnN0eWxlLmhlaWdodCA9IGV4cGFuZGVkSGVpZ2h0KyBcInB4XCI7XHJcbiAgICAgICAgfSwgNSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZShcImNvbGxhcHNlLXRyYW5zaXRpb24tZXhwYW5kXCIpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcclxuXHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwiZmFsc2VcIik7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICAgYW5pbWF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcclxuICAgICAgICB9LCAyMDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHtcclxuICBbJ2NsaWNrJ106IHtcclxuICAgIFsganNDb2xsYXBzZVRyaWdnZXIgXTogdG9nZ2xlXHJcbiAgfSxcclxufSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IFBpa2FkYXkgPSByZXF1aXJlKFwiLi4vLi4vdmVuZG9yL3Bpa2FkYXkuanNcIik7XG5jb25zdCBiZWhhdmlvciA9IHJlcXVpcmUoJy4uL3V0aWxzL2JlaGF2aW9yJyk7XG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcbmNvbnN0IGNsb3Nlc3QgPSByZXF1aXJlKCcuLi91dGlscy9jbG9zZXN0Jyk7XG5cbmNvbnN0IGpzRGF0ZXBpY2tlclNlbGVjdG9yID0gJy5qcy1jYWxlbmRhci1kYXRlcGlja2VyJztcbmNvbnN0IGpzRGF5SW5wdXQgPSAnLmpzLWNhbGVuZGFyLWRheS1pbnB1dCc7XG5jb25zdCBqc01vbnRoSW5wdXQgPSAnLmpzLWNhbGVuZGFyLW1vbnRoLWlucHV0JztcbmNvbnN0IGpzWWVhcklucHV0ID0gJy5qcy1jYWxlbmRhci15ZWFyLWlucHV0JztcblxuY2xhc3MgZGF0ZXBpY2tlckdyb3VwIHtcbiAgY29uc3RydWN0b3IoZWwpe1xuICAgIFxuICAgIHRoaXMucGlrYWRheUluc3RhbmNlID0gbnVsbDtcbiAgICB0aGlzLmRhdGVwaWNrZXJFbGVtZW50ID0gc2VsZWN0KGpzRGF0ZXBpY2tlclNlbGVjdG9yLCBlbCk7XG4gICAgdGhpcy5kYXRlR3JvdXAgPSBlbDtcbiAgICB0aGlzLmZvcm1Hcm91cCA9IGNsb3Nlc3QoZWwsICcuZm9ybS1ncm91cCcpO1xuICAgIHRoaXMuZGF5SW5wdXRFbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLm1vbnRoSW5wdXRFbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLnllYXJJbnB1dEVsZW1lbnQgPSBudWxsOyAgIFxuXG4gICAgdGhpcy5pbml0RGF0ZUlucHV0cygpO1xuICAgIHRoaXMuaW5pdERhdGVwaWNrZXIodGhpcy5kYXRlcGlja2VyRWxlbWVudFswXSk7XG4gIH1cblxuICBpbml0RGF0ZUlucHV0cygpe1xuICAgIHRoaXMuZGF5SW5wdXRFbGVtZW50ID0gc2VsZWN0KGpzRGF5SW5wdXQsIHRoaXMuZGF0ZUdyb3VwKVswXVxuICAgIHRoaXMubW9udGhJbnB1dEVsZW1lbnQgPSBzZWxlY3QoanNNb250aElucHV0LCB0aGlzLmRhdGVHcm91cClbMF07XG4gICAgdGhpcy55ZWFySW5wdXRFbGVtZW50ID0gc2VsZWN0KGpzWWVhcklucHV0LCB0aGlzLmRhdGVHcm91cClbMF07XG5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgXG4gICAgdGhpcy5kYXlJbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgZnVuY3Rpb24oKXtcbiAgICAgIHRoYXQuZm9ybWF0SW5wdXRzKCk7XG4gICAgICB0aGF0LnZhbGlkYXRlSW5wdXRzKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm1vbnRoSW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIGZ1bmN0aW9uKCl7XG4gICAgICB0aGF0LmZvcm1hdElucHV0cygpO1xuICAgICAgdGhhdC52YWxpZGF0ZUlucHV0cygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy55ZWFySW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIGZ1bmN0aW9uKCl7XG4gICAgICB0aGF0LmZvcm1hdElucHV0cygpO1xuICAgICAgdGhhdC52YWxpZGF0ZUlucHV0cygpO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdERhdGVwaWNrZXIoZWwpe1xuICAgIGlmKGVsKXtcbiAgICAgIC8vTm90ZTogZWwgbWF5IG5vdCBiZSBhIDxzdmc+LCBJRTExIGRvZXMgbm90IGFkZCAuYmx1cigpIG1ldGhvZCB0byBzdmcgZWxlbWVudHMgKC0tPiBlc2MgYW5kIGVudGVyIGRvZXMgbm90IGRpc21pc3MgcGlrYWRheSkuIFxuICAgICAgdGhpcy5pbml0RG9uZSA9IGZhbHNlO1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICB0aGlzLnBpa2FkYXlJbnN0YW5jZSA9IG5ldyBQaWthZGF5KHtcbiAgICAgICAgZmllbGQ6IGVsLFxuICAgICAgICBmb3JtYXQ6ICdERC9NTS9ZWVlZJyxcbiAgICAgICAgZmlyc3REYXk6IDEsIC8vbWFuZGFnXG4gICAgICAgIGkxOG46IHtcbiAgICAgICAgICBwcmV2aW91c01vbnRoIDogJ0ZvcnJpZ2UgbcOlbmVkJyxcbiAgICAgICAgICBuZXh0TW9udGggICAgIDogJ07DpnN0ZSBtw6VuZWQnLFxuICAgICAgICAgIG1vbnRocyAgICAgICAgOiBbJ0phbnVhcicsJ0ZlYnJ1YXInLCdNYXJ0aCcsJ0FwcmlsJywnTWFqJywnSnVuaScsJ0p1bHknLCdBdWd1c3QnLCdTZXB0ZW1iZXInLCdPa3RvYmVyJywnTm92ZW1iZXInLCdEZWNlbWJlciddLFxuICAgICAgICAgIHdlZWtkYXlzICAgICAgOiBbJ1PDuG5kYWcnLCdNYW5kYWcnLCdUaXJzZGFnJywnT25zZGFnJywnVG9yc2RhZycsJ0ZyZWRhZycsJ0zDuHJkYWcnXSxcbiAgICAgICAgICB3ZWVrZGF5c1Nob3J0IDogWydTw7huJywnTWFuJywnVGlyJywnT25zJywnVG9yJywnRnJlJywnTMO4ciddXG4gICAgICAgIH0sXG4gICAgICAgIG9uU2VsZWN0OiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgLy9zZWxlY3RlZCBuZXcgZGF0ZSBpbiBwaWthZGF5LCB1cGRhdGUgaW5wdXQgZmllbGRzLiBcbiAgICAgICAgICBpZih0aGF0LmluaXREb25lKXtcbiAgICAgICAgICAgIHRoYXQudXBkYXRlRGF0ZUlucHV0cyhkYXRlKTtcbiAgICAgICAgICAgIHRoYXQudmFsaWRhdGVJbnB1dHMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9uT3BlbjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAvL3VwZGF0ZSBwaWthZGF5IHdpdGggdmFsdWVzIGZyb20gaW5wdXQgZmllbGRzXG4gICAgICAgICAgdmFyIGRheSA9IHBhcnNlSW50KHRoYXQuZGF5SW5wdXRFbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICB2YXIgbW9udGggPSBwYXJzZUludCh0aGF0Lm1vbnRoSW5wdXRFbGVtZW50LnZhbHVlKSAtMTtcbiAgICAgICAgICB2YXIgeWVhciA9IHBhcnNlSW50KHRoYXQueWVhcklucHV0RWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgdmFyIG5ld0RhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgZGF5KTtcbiAgICAgICAgICBpZih0aGF0LnZhbGlkYXRlSW5wdXRzKCkpe1xuICAgICAgICAgICAgdGhhdC51cGRhdGVEYXRlcGlja2VyRGF0ZShuZXdEYXRlKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBpbml0RGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICB0aGlzLnBpa2FkYXlJbnN0YW5jZS5zZXREYXRlKGluaXREYXRlKTtcbiAgICAgIC8vdGhpcy51cGRhdGVEYXRlSW5wdXRzKGluaXREYXRlKTtcbiAgICAgIHRoaXMuaW5pdERvbmUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHZhbGlkYXRlSW5wdXRzKCl7XG4gICAgdmFyIGRheSA9IHBhcnNlSW50KHRoaXMuZGF5SW5wdXRFbGVtZW50LnZhbHVlKVxuICAgIHZhciBtb250aCA9IHBhcnNlSW50KHRoaXMubW9udGhJbnB1dEVsZW1lbnQudmFsdWUpO1xuICAgIHZhciB5ZWFyID0gcGFyc2VJbnQodGhpcy55ZWFySW5wdXRFbGVtZW50LnZhbHVlKTtcbiAgICB2YXIgbWF4RGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcblxuICAgIHZhciBtc2cgPSBcIlwiO1xuICAgIHZhciBpc1ZhbGlkID0gdHJ1ZTsgXG4gICAgaWYoZGF5ID4gbWF4RGF5KXtcbiAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgIG1zZyA9IFwiSG92LCBkZW4gZGFnIGZpbmRlcyBpa2tlIGkgZGVuIHZhbGd0ZSBtw6VuZWQuXCJcbiAgICAgIHRoaXMuc2hvd0Vycm9yKG1zZyk7XG4gICAgfWVsc2UgaWYobW9udGggPiAxMil7XG4gICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICBtc2cgPSBcIkhvdiwgZGVuIG3DpW5lZCBmaW5kZXMgaWtrZS5cIlxuICAgICAgdGhpcy5zaG93RXJyb3IobXNnKTtcbiAgICB9XG5cbiAgICBpZihpc1ZhbGlkKXtcbiAgICAgIHRoaXMucmVtb3ZlRXJyb3IoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXNWYWxpZDtcbiAgfVxuXG4gIHNob3dFcnJvcihtc2cpe1xuICAgIHRoaXMuZm9ybUdyb3VwLmNsYXNzTGlzdC5hZGQoXCJpbnB1dC1lcnJvclwiKTtcbiAgICBzZWxlY3QoXCIuaW5wdXQtZXJyb3ItbWVzc2FnZVwiLCAgdGhpcy5mb3JtR3JvdXApWzBdLnRleHRDb250ZW50ID0gbXNnO1xuICB9XG4gIHJlbW92ZUVycm9yKCl7XG4gICAgdGhpcy5mb3JtR3JvdXAuY2xhc3NMaXN0LnJlbW92ZShcImlucHV0LWVycm9yXCIpO1xuICAgIHNlbGVjdChcIi5pbnB1dC1lcnJvci1tZXNzYWdlXCIsICB0aGlzLmZvcm1Hcm91cClbMF0udGV4dENvbnRlbnQgPSBcIlwiO1xuICB9XG5cbiAgdXBkYXRlRGF0ZUlucHV0cyhkYXRlKXtcbiAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgdmFyIG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICB2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICBcbiAgICB0aGlzLmRheUlucHV0RWxlbWVudC52YWx1ZSA9IHRoaXMuZGF5Rm9ybWF0KGRheSk7XG4gICAgdGhpcy5tb250aElucHV0RWxlbWVudC52YWx1ZSA9IHRoaXMubW9udGhGb3JtYXQobW9udGgpO1xuICAgIHRoaXMueWVhcklucHV0RWxlbWVudC52YWx1ZSA9IHllYXI7XG4gIH1cblxuICAvL2FkZHMgMCBhdCB0aGUgZnJvbnQgb2YgZGF5IG51bWJlclxuICBkYXlGb3JtYXQoZGF5KXtcbiAgICByZXR1cm4gKFwiMFwiICsgZGF5KS5zbGljZSgtMik7XG4gIH1cbiAgbW9udGhGb3JtYXQobW9udGgpe1xuICAgIHJldHVybiAoXCIwXCIgKyBtb250aCkuc2xpY2UoLTIpO1xuICB9XG4gIGZvcm1hdElucHV0cygpe1xuICAgIHZhciBkYXkgPSBwYXJzZUludCh0aGlzLmRheUlucHV0RWxlbWVudC52YWx1ZSlcbiAgICB2YXIgbW9udGggPSBwYXJzZUludCh0aGlzLm1vbnRoSW5wdXRFbGVtZW50LnZhbHVlKTtcbiAgICBpZighaXNOYU4oZGF5KSApIHtcbiAgICAgIHRoaXMuZGF5SW5wdXRFbGVtZW50LnZhbHVlID0gdGhpcy5kYXlGb3JtYXQoZGF5KTtcbiAgICB9IFxuICAgIGlmKCFpc05hTihtb250aCkpe1xuICAgICAgdGhpcy5tb250aElucHV0RWxlbWVudC52YWx1ZSA9IHRoaXMubW9udGhGb3JtYXQobW9udGgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZURhdGVwaWNrZXJEYXRlKG5ld0RhdGUpe1xuICAgIHRoaXMucGlrYWRheUluc3RhbmNlLnNldERhdGUobmV3RGF0ZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkYXRlcGlja2VyR3JvdXA7IiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XG5jb25zdCBjbG9zZXN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvY2xvc2VzdCcpO1xuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcblxuXG5jbGFzcyBkcm9wZG93biB7XG4gICAgY29uc3RydWN0b3IoZWwpe1xuICAgICAgICB0aGlzLmpzRHJvcGRvd25UcmlnZ2VyID0gXCIuanMtZHJvcGRvd25cIjtcbiAgICAgICAgdGhpcy5qc0Ryb3Bkb3duVGFyZ2V0ID0gXCJkYXRhLWpzLXRhcmdldFwiO1xuICAgICAgICBcbiAgICAgICAgLy9vcHRpb246IG1ha2UgZHJvcGRvd24gYmVoYXZlIGFzIHRoZSBjb2xsYXBzZSBjb21wb25lbnQgd2hlbiBvbiBzbWFsbCBzY3JlZW5zICh1c2VkIGJ5IHN1Ym1lbnVzIGluIHRoZSBoZWFkZXIgYW5kIHN0ZXAtZHJvcGRvd24pLiBcbiAgICAgICAgdGhpcy5uYXZSZXNwb25zaXZlQnJlYWtwb2ludCA9IDk5MjsgLy9zYW1lIGFzICRuYXYtcmVzcG9uc2l2ZS1icmVha3BvaW50IGZyb20gdGhlIHNjc3MuXG4gICAgICAgIHRoaXMuanNSZXNwb25zaXZlQ29sbGFwc2VNb2RpZmllciA9IFwiLmpzLWRyb3Bkb3duLS1yZXNwb25zaXZlLWNvbGxhcHNlXCJcbiAgICAgICAgdGhpcy5yZXNwb25zaXZlQ29sbGFwc2VFbmFibGVkID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy50cmlnZ2VyRWwgPSBudWxsO1xuICAgICAgICB0aGlzLnRhcmdldEVsID0gbnVsbDtcblxuICAgICAgICB0aGlzLmluaXQoZWwpO1xuXG4gICAgICAgIGlmKHRoaXMudHJpZ2dlckVsICE9PSBudWxsICYmIHRoaXMudHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGhpcy50YXJnZXRFbCAhPT0gbnVsbCAmJiB0aGlzLnRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICAgICAvL0NsaWNrZWQgb3V0c2lkZSBkcm9wZG93biAtPiBjbG9zZSBpdFxuICAgICAgICAgICAgc2VsZWN0KCdib2R5JylbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICB0aGF0Lm91dHNpZGVDbG9zZShldmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9DbGlja2VkIG9uIGRyb3Bkb3duIG9wZW4gYnV0dG9uIC0tPiB0b2dnbGUgaXRcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTsvL3ByZXZlbnRzIG91c2lkZSBjbGljayBsaXN0ZW5lciBmcm9tIHRyaWdnZXJpbmcuIFxuICAgICAgICAgICAgICAgIHRoYXQudG9nZ2xlRHJvcGRvd24oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ICAgICAgIFxuICAgIH1cblxuICAgIGluaXQoZWwpe1xuICAgICAgICB0aGlzLnRyaWdnZXJFbCA9IGVsO1xuICAgICAgICBpZih0aGlzLnRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0aGlzLnRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHZhciB0YXJnZXRBdHRyID0gdGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNEcm9wZG93blRhcmdldClcbiAgICAgICAgICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0RWwgPSBzZWxlY3QodGFyZ2V0QXR0ciwgJ2JvZHknKTtcbiAgICAgICAgICAgICAgICBpZih0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldEVsID0gdGFyZ2V0RWxbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy50cmlnZ2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy1kcm9wZG93bi0tcmVzcG9uc2l2ZS1jb2xsYXBzZScpKXtcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2l2ZUNvbGxhcHNlRW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBcbiAgICB0b2dnbGVEcm9wZG93bihmb3JjZUNsb3NlKSB7XG4gICAgICAgIGlmKHRoaXMudHJpZ2dlckVsICE9PSBudWxsICYmIHRoaXMudHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGhpcy50YXJnZXRFbCAhPT0gbnVsbCAmJiB0aGlzLnRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgLy9jaGFuZ2Ugc3RhdGVcbiAgICAgICAgICAgIGlmKHRoaXMudHJpZ2dlckVsLmdldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIikgPT0gXCJ0cnVlXCIgfHwgZm9yY2VDbG9zZSl7XG4gICAgICAgICAgICAgICAgLy9jbG9zZVxuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckVsLnNldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5hZGQoXCJjb2xsYXBzZWRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAvL29wZW5cbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJjb2xsYXBzZWRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIG91dHNpZGVDbG9zZShldmVudCl7XG4gICAgICAgIGlmKCF0aGlzLmRvUmVzcG9uc2l2ZUNvbGxhcHNlKCkpe1xuICAgICAgICAgICAgLy9jbG9zZXMgZHJvcGRvd24gd2hlbiBjbGlja2VkIG91dHNpZGUuIFxuICAgICAgICAgICAgdmFyIGRyb3Bkb3duRWxtID0gY2xvc2VzdChldmVudC50YXJnZXQsIHRoaXMudGFyZ2V0RWwuaWQpO1xuICAgICAgICAgICAgaWYoKGRyb3Bkb3duRWxtID09PSBudWxsIHx8IGRyb3Bkb3duRWxtID09PSB1bmRlZmluZWQpICYmIChldmVudC50YXJnZXQgIT09IHRoaXMudHJpZ2dlckVsKSl7XG4gICAgICAgICAgICAgICAgLy9jbGlja2VkIG91dHNpZGUgdHJpZ2dlciwgZm9yY2UgY2xvc2VcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZURyb3Bkb3duKHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGRvUmVzcG9uc2l2ZUNvbGxhcHNlKCl7XG4gICAgICAgIC8vcmV0dXJucyB0cnVlIGlmIHJlc3BvbnNpdmUgY29sbGFwc2UgaXMgZW5hYmxlZCBhbmQgd2UgYXJlIG9uIGEgc21hbGwgc2NyZWVuLiBcbiAgICAgICAgaWYodGhpcy5yZXNwb25zaXZlQ29sbGFwc2VFbmFibGVkICYmIHdpbmRvdy5pbm5lcldpZHRoIDw9IHRoaXMubmF2UmVzcG9uc2l2ZUJyZWFrcG9pbnQpe1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkcm9wZG93bjsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWNjb3JkaW9uOiAgcmVxdWlyZSgnLi9hY2NvcmRpb24nKSxcbiAgbmF2aWdhdGlvbjogcmVxdWlyZSgnLi9uYXZpZ2F0aW9uJyksXG4gIHNraXBuYXY6ICAgIHJlcXVpcmUoJy4vc2tpcG5hdicpLFxuICB2YWxpZGF0b3I6ICByZXF1aXJlKCcuL3ZhbGlkYXRvcicpLFxuICByZWdleG1hc2s6ICByZXF1aXJlKCcuL3JlZ2V4LWlucHV0LW1hc2snKSxcbiAgY29sbGFwc2U6ICAgcmVxdWlyZSgnLi9jb2xsYXBzZScpXG59O1xuIiwiXG5jb25zdCBkb21yZWFkeSA9IHJlcXVpcmUoJ2RvbXJlYWR5Jyk7XG5cbi8qKlxuICogSW1wb3J0IG1vZGFsIGxpYi5cbiAqIGh0dHBzOi8vbWljcm9tb2RhbC5ub3cuc2hcbiAqL1xuY29uc3QgbWljcm9Nb2RhbCA9IHJlcXVpcmUoXCIuLi8uLi92ZW5kb3IvbWljcm9tb2RhbC5qc1wiKTtcbmRvbXJlYWR5KCgpID0+IHtcblx0bWljcm9Nb2RhbC5pbml0KCk7IC8vaW5pdCBhbGwgbW9kYWxzXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZSgnLi4vdXRpbHMvYmVoYXZpb3InKTtcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcbmNvbnN0IGFjY29yZGlvbiA9IHJlcXVpcmUoJy4vYWNjb3JkaW9uJyk7XG5cbmNvbnN0IENMSUNLID0gcmVxdWlyZSgnLi4vZXZlbnRzJykuQ0xJQ0s7XG5jb25zdCBQUkVGSVggPSByZXF1aXJlKCcuLi9jb25maWcnKS5wcmVmaXg7XG5cbmNvbnN0IE5BViA9IGAubmF2YDtcbmNvbnN0IE5BVl9MSU5LUyA9IGAke05BVn0gYWA7XG5jb25zdCBPUEVORVJTID0gYC5qcy1tZW51LW9wZW5gO1xuY29uc3QgQ0xPU0VfQlVUVE9OID0gYC5qcy1tZW51LWNsb3NlYDtcbmNvbnN0IE9WRVJMQVkgPSBgLm92ZXJsYXlgO1xuY29uc3QgQ0xPU0VSUyA9IGAke0NMT1NFX0JVVFRPTn0sIC5vdmVybGF5YDtcbmNvbnN0IFRPR0dMRVMgPSBbIE5BViwgT1ZFUkxBWSBdLmpvaW4oJywgJyk7XG5cbmNvbnN0IEFDVElWRV9DTEFTUyA9ICdtb2JpbGVfbmF2LWFjdGl2ZSc7XG5jb25zdCBWSVNJQkxFX0NMQVNTID0gJ2lzLXZpc2libGUnO1xuXG5jb25zdCBpc0FjdGl2ZSA9ICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUyk7XG5cbmNvbnN0IF9mb2N1c1RyYXAgPSAodHJhcENvbnRhaW5lcikgPT4ge1xuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cbiAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0nO1xuICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IHRyYXBDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XG4gIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWyAwIF07XG4gIGNvbnN0IGxhc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbIGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDEgXTtcblxuICBmdW5jdGlvbiB0cmFwVGFiS2V5IChlKSB7XG4gICAgLy8gQ2hlY2sgZm9yIFRBQiBrZXkgcHJlc3NcbiAgICBpZiAoZS5rZXlDb2RlID09PSA5KSB7XG5cbiAgICAgIC8vIFNISUZUICsgVEFCXG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RUYWJTdG9wKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XG4gICAgICAgIH1cblxuICAgICAgLy8gVEFCXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdFRhYlN0b3ApIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFU0NBUEVcbiAgICBpZiAoZS5rZXlDb2RlID09PSAyNykge1xuICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZvY3VzIGZpcnN0IGNoaWxkXG4gIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xuXG4gIHJldHVybiB7XG4gICAgZW5hYmxlICgpIHtcbiAgICAgIC8vIExpc3RlbiBmb3IgYW5kIHRyYXAgdGhlIGtleWJvYXJkXG4gICAgICB0cmFwQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcbiAgICB9LFxuXG4gICAgcmVsZWFzZSAoKSB7XG4gICAgICB0cmFwQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcbiAgICB9LFxuICB9O1xufTtcblxubGV0IGZvY3VzVHJhcDtcblxuY29uc3QgdG9nZ2xlTmF2ID0gZnVuY3Rpb24gKGFjdGl2ZSkge1xuICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgaWYgKHR5cGVvZiBhY3RpdmUgIT09ICdib29sZWFuJykge1xuICAgIGFjdGl2ZSA9ICFpc0FjdGl2ZSgpO1xuICB9XG4gIGJvZHkuY2xhc3NMaXN0LnRvZ2dsZShBQ1RJVkVfQ0xBU1MsIGFjdGl2ZSk7XG5cbiAgZm9yRWFjaChzZWxlY3QoVE9HR0xFUyksIGVsID0+IHtcbiAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKFZJU0lCTEVfQ0xBU1MsIGFjdGl2ZSk7XG4gIH0pO1xuXG4gIGlmIChhY3RpdmUpIHtcbiAgICBmb2N1c1RyYXAuZW5hYmxlKCk7XG4gIH0gZWxzZSB7XG4gICAgZm9jdXNUcmFwLnJlbGVhc2UoKTtcbiAgfVxuXG4gIGNvbnN0IGNsb3NlQnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XG4gIGNvbnN0IG1lbnVCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoT1BFTkVSUyk7XG5cbiAgaWYgKGFjdGl2ZSAmJiBjbG9zZUJ1dHRvbikge1xuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGFjdGl2YXRlZCwgc28gZm9jdXMgb24gdGhlIGNsb3NlIGJ1dHRvbixcbiAgICAvLyB3aGljaCBpcyBqdXN0IGJlZm9yZSBhbGwgdGhlIG5hdiBlbGVtZW50cyBpbiB0aGUgdGFiIG9yZGVyLlxuICAgIGNsb3NlQnV0dG9uLmZvY3VzKCk7XG4gIH0gZWxzZSBpZiAoIWFjdGl2ZSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBjbG9zZUJ1dHRvbiAmJlxuICAgICAgICAgICAgIG1lbnVCdXR0b24pIHtcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBkZWFjdGl2YXRlZCwgYW5kIGZvY3VzIHdhcyBvbiB0aGUgY2xvc2VcbiAgICAvLyBidXR0b24sIHdoaWNoIGlzIG5vIGxvbmdlciB2aXNpYmxlLiBXZSBkb24ndCB3YW50IHRoZSBmb2N1cyB0b1xuICAgIC8vIGRpc2FwcGVhciBpbnRvIHRoZSB2b2lkLCBzbyBmb2N1cyBvbiB0aGUgbWVudSBidXR0b24gaWYgaXQnc1xuICAgIC8vIHZpc2libGUgKHRoaXMgbWF5IGhhdmUgYmVlbiB3aGF0IHRoZSB1c2VyIHdhcyBqdXN0IGZvY3VzZWQgb24sXG4gICAgLy8gaWYgdGhleSB0cmlnZ2VyZWQgdGhlIG1vYmlsZSBuYXYgYnkgbWlzdGFrZSkuXG4gICAgbWVudUJ1dHRvbi5mb2N1cygpO1xuICB9XG5cbiAgcmV0dXJuIGFjdGl2ZTtcbn07XG5cbmNvbnN0IHJlc2l6ZSA9ICgpID0+IHtcbiAgY29uc3QgY2xvc2VyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XG5cbiAgaWYgKGlzQWN0aXZlKCkgJiYgY2xvc2VyICYmIGNsb3Nlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCA9PT0gMCkge1xuICAgIC8vIFRoZSBtb2JpbGUgbmF2IGlzIGFjdGl2ZSwgYnV0IHRoZSBjbG9zZSBib3ggaXNuJ3QgdmlzaWJsZSwgd2hpY2hcbiAgICAvLyBtZWFucyB0aGUgdXNlcidzIHZpZXdwb3J0IGhhcyBiZWVuIHJlc2l6ZWQgc28gdGhhdCBpdCBpcyBubyBsb25nZXJcbiAgICAvLyBpbiBtb2JpbGUgbW9kZS4gTGV0J3MgbWFrZSB0aGUgcGFnZSBzdGF0ZSBjb25zaXN0ZW50IGJ5XG4gICAgLy8gZGVhY3RpdmF0aW5nIHRoZSBtb2JpbGUgbmF2LlxuICAgIHRvZ2dsZU5hdi5jYWxsKGNsb3NlciwgZmFsc2UpO1xuICB9XG59O1xuXG5jb25zdCBuYXZpZ2F0aW9uID0gYmVoYXZpb3Ioe1xuICBbIENMSUNLIF06IHtcbiAgICBbIE9QRU5FUlMgXTogdG9nZ2xlTmF2LFxuICAgIFsgQ0xPU0VSUyBdOiB0b2dnbGVOYXYsXG4gICAgWyBOQVZfTElOS1MgXTogZnVuY3Rpb24gKCkge1xuICAgICAgLy8gQSBuYXZpZ2F0aW9uIGxpbmsgaGFzIGJlZW4gY2xpY2tlZCEgV2Ugd2FudCB0byBjb2xsYXBzZSBhbnlcbiAgICAgIC8vIGhpZXJhcmNoaWNhbCBuYXZpZ2F0aW9uIFVJIGl0J3MgYSBwYXJ0IG9mLCBzbyB0aGF0IHRoZSB1c2VyXG4gICAgICAvLyBjYW4gZm9jdXMgb24gd2hhdGV2ZXIgdGhleSd2ZSBqdXN0IHNlbGVjdGVkLlxuXG4gICAgICAvLyBTb21lIG5hdmlnYXRpb24gbGlua3MgYXJlIGluc2lkZSBhY2NvcmRpb25zOyB3aGVuIHRoZXkncmVcbiAgICAgIC8vIGNsaWNrZWQsIHdlIHdhbnQgdG8gY29sbGFwc2UgdGhvc2UgYWNjb3JkaW9ucy5cbiAgICAgIGNvbnN0IGFjYyA9IHRoaXMuY2xvc2VzdChhY2NvcmRpb24uQUNDT1JESU9OKTtcbiAgICAgIGlmIChhY2MpIHtcbiAgICAgICAgYWNjb3JkaW9uLmdldEJ1dHRvbnMoYWNjKS5mb3JFYWNoKGJ0biA9PiBhY2NvcmRpb24uaGlkZShidG4pKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlIG1vYmlsZSBuYXZpZ2F0aW9uIG1lbnUgaXMgYWN0aXZlLCB3ZSB3YW50IHRvIGhpZGUgaXQuXG4gICAgICBpZiAoaXNBY3RpdmUoKSkge1xuICAgICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn0sIHtcbiAgaW5pdCAoKSB7XG4gICAgY29uc3QgdHJhcENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoTkFWKTtcblxuICAgIGlmICh0cmFwQ29udGFpbmVyKSB7XG4gICAgICBmb2N1c1RyYXAgPSBfZm9jdXNUcmFwKHRyYXBDb250YWluZXIpO1xuICAgIH1cblxuICAgIHJlc2l6ZSgpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcbiAgfSxcbiAgdGVhcmRvd24gKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcbiAgfSxcbn0pO1xuXG4vKipcbiAqIFRPRE8gZm9yIDIuMCwgcmVtb3ZlIHRoaXMgc3RhdGVtZW50IGFuZCBleHBvcnQgYG5hdmlnYXRpb25gIGRpcmVjdGx5OlxuICpcbiAqIG1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3Ioey4uLn0pO1xuICovXG5jb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbihcbiAgZWwgPT4gbmF2aWdhdGlvbi5vbihlbCksXG4gIG5hdmlnYXRpb25cbik7IiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XG5jb25zdCBjbG9zZXN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvY2xvc2VzdCcpO1xuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcblxuXG5jbGFzcyByYWRpb1RvZ2dsZUdyb3Vwe1xuICAgIGNvbnN0cnVjdG9yKGVsKXtcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRyaWdnZXIgPSBcIi5qcy1yYWRpby10b2dnbGUtZ3JvdXBcIjtcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRhcmdldCA9IFwiZGF0YS1qcy10YXJnZXRcIjtcblxuICAgICAgICB0aGlzLnJhZGlvRWxzID0gbnVsbDtcbiAgICAgICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5pbml0KGVsKTtcbiAgICB9XG5cbiAgICBpbml0KGVsKXtcbiAgICAgICAgdGhpcy5yYWRpb0dyb3VwID0gZWw7XG4gICAgICAgIHRoaXMucmFkaW9FbHMgPSBzZWxlY3QoXCJpbnB1dFt0eXBlPSdyYWRpbyddXCIsIHRoaXMucmFkaW9Hcm91cCk7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICBmb3JFYWNoKHRoaXMucmFkaW9FbHMsIHJhZGlvID0+IHtcbiAgICAgICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIGZvckVhY2godGhhdC5yYWRpb0VscywgcmFkaW8gPT4geyBcbiAgICAgICAgICAgICAgICAgICAgdGhhdC50b2dnbGUocmFkaW8pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMudG9nZ2xlKHJhZGlvKTsgLy9Jbml0aWFsIHZhbHVlO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHRvZ2dsZSh0cmlnZ2VyRWwpe1xuICAgICAgICB2YXIgdGFyZ2V0QXR0ciA9IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUodGhpcy5qc1RvZ2dsZVRhcmdldClcbiAgICAgICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdmFyIHRhcmdldEVsID0gc2VsZWN0KHRhcmdldEF0dHIsICdib2R5Jyk7XG4gICAgICAgICAgICBpZih0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgIGlmKHRyaWdnZXJFbC5jaGVja2VkKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuKHRyaWdnZXJFbCwgdGFyZ2V0RWxbMF0pO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKHRyaWdnZXJFbCwgdGFyZ2V0RWxbMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbCl7XG4gICAgICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWV4cGFuZGVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoXCJjb2xsYXBzZWRcIik7XG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcImZhbHNlXCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNsb3NlKHRyaWdnZXJFbCwgdGFyZ2V0RWwpe1xuICAgICAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZChcImNvbGxhcHNlZFwiKTtcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByYWRpb1RvZ2dsZUdyb3VwOyIsIlxuLypcbiogUHJldmVudHMgdGhlIHVzZXIgZnJvbSBpbnB1dHRpbmcgYmFzZWQgb24gYSByZWdleC5cbiogRG9lcyBub3Qgd29yayB0aGUgc2FtZSB3YXkgYWYgPGlucHV0IHBhdHRlcm49XCJcIj4sIHRoaXMgcGF0dGVybiBpcyBvbmx5IHVzZWQgZm9yIHZhbGlkYXRpb24sIG5vdCB0byBwcmV2ZW50IGlucHV0LiBcbiogVXNlY2FzZTogbnVtYmVyIGlucHV0IGZvciBkYXRlLWNvbXBvbmVudC5cbiogRXhhbXBsZSAtIG51bWJlciBvbmx5OiA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWlucHV0LXJlZ2V4PVwiXlxcZCokXCI+XG4qL1xuJ3VzZSBzdHJpY3QnO1xuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xuXG5jb25zdCBtb2RpZmllclN0YXRlID0ge1xuICBzaGlmdDogZmFsc2UsXG4gIGFsdDogZmFsc2UsXG4gIGN0cmw6IGZhbHNlLFxuICBjb21tYW5kOiBmYWxzZVxufTtcblxuZnVuY3Rpb24gaW5wdXRSZWdleE1hc2soZXZlbnQpIHtcblxuICAgIGlmKG1vZGlmaWVyU3RhdGUuY3RybCB8fCBtb2RpZmllclN0YXRlLmNvbW1hbmQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgbmV3Q2hhciA9IG51bGw7XG4gICAgaWYodHlwZW9mIGV2ZW50LmtleSAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgIGlmKGV2ZW50LmtleS5sZW5ndGggPT09IDEpe1xuICAgICAgICAgICAgbmV3Q2hhciA9IGV2ZW50LmtleTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCFldmVudC5jaGFyQ29kZSl7XG4gICAgICAgICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5rZXlDb2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmNoYXJDb2RlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgZWxlbWVudCA9IG51bGw7XG4gICAgaWYoZXZlbnQudGFyZ2V0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgICBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICAgIH1cbiAgICBpZihuZXdDaGFyICE9PSBudWxsICYmIGVsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgICAgaWYobmV3Q2hhci5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIGlmKGVsZW1lbnQudHlwZSA9PT0gXCJudW1iZXJcIil7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTsvL05vdGUgaW5wdXRbdHlwZT1udW1iZXJdIGRvZXMgbm90IGhhdmUgLnNlbGVjdGlvblN0YXJ0L0VuZCAoQ2hyb21lKS5cbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMudmFsdWUuc2xpY2UoMCwgZWxlbWVudC5zZWxlY3Rpb25TdGFydCkgKyB0aGlzLnZhbHVlLnNsaWNlKGVsZW1lbnQuc2VsZWN0aW9uRW5kKSArIG5ld0NoYXI7IC8vcmVtb3ZlcyB0aGUgbnVtYmVycyBzZWxlY3RlZCBieSB0aGUgdXNlciwgdGhlbiBhZGRzIG5ldyBjaGFyLiBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHJlZ2V4U3RyID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJkYXRhLWlucHV0LXJlZ2V4XCIpO1xuICAgICAgICAgICAgdmFyIHIgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyKTtcbiAgICAgICAgICAgIGlmKHIuZXhlYyhuZXdWYWx1ZSkgPT09IG51bGwpe1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3Ioe1xuICAna2V5cHJlc3MgcGFzdGUnOiB7XG4gICAgJ2lucHV0W2RhdGEtaW5wdXQtcmVnZXhdJzogaW5wdXRSZWdleE1hc2ssXG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xuY29uc3Qgb25jZSA9IHJlcXVpcmUoJ3JlY2VwdG9yL29uY2UnKTtcblxuY29uc3QgQ0xJQ0sgPSByZXF1aXJlKCcuLi9ldmVudHMnKS5DTElDSztcbmNvbnN0IFBSRUZJWCA9IHJlcXVpcmUoJy4uL2NvbmZpZycpLnByZWZpeDtcbmNvbnN0IExJTksgPSBgLiR7UFJFRklYfXNraXBuYXZbaHJlZl49XCIjXCJdYDtcblxuY29uc3Qgc2V0VGFiaW5kZXggPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgLy8gTkI6IHdlIGtub3cgYmVjYXVzZSBvZiB0aGUgc2VsZWN0b3Igd2UncmUgZGVsZWdhdGluZyB0byBiZWxvdyB0aGF0IHRoZVxuICAvLyBocmVmIGFscmVhZHkgYmVnaW5zIHdpdGggJyMnXG4gIGNvbnN0IGlkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zbGljZSgxKTtcbiAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICBpZiAodGFyZ2V0KSB7XG4gICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uY2UoZXZlbnQgPT4ge1xuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSk7XG4gICAgfSkpO1xuICB9IGVsc2Uge1xuICAgIC8vIHRocm93IGFuIGVycm9yP1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHtcbiAgWyBDTElDSyBdOiB7XG4gICAgWyBMSU5LIF06IHNldFRhYmluZGV4LFxuICB9LFxufSk7XG4iLCJjb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcbmNvbnN0IGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKTtcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XG5cbmRvbXJlYWR5KCgpID0+IHtcblx0bmV3IFJlc3BvbnNpdmVUYWJsZXMoKTsgXG59KTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc3BvbnNpdmVUYWJsZXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjb25zdCBhbGxUYWJsZXMgPSBzZWxlY3QoJ3RhYmxlOm5vdCguZGF0YVRhYmxlKScpO1xuICAgICAgICBmb3JFYWNoKGFsbFRhYmxlcywgdGFibGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbnNlcnRIZWFkZXJBc0F0dHJpYnV0ZXModGFibGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgZGF0YSBhdHRyaWJ1dGVzIG5lZWRlZCBmb3IgcmVzcG9uc2l2ZSBtb2RlLlxuICAgIGluc2VydEhlYWRlckFzQXR0cmlidXRlcyh0YWJsZUVsKXtcbiAgICAgICAgaWYgKCF0YWJsZUVsKSByZXR1cm5cblxuICAgICAgICBjb25zdCBoZWFkZXJDZWxsRWxzID0gIHNlbGVjdCgndGhlYWQgdGgsIHRoZWFkIHRkJywgdGFibGVFbCk7XG5cbiAgICAgICAgLy9jb25zdCBoZWFkZXJDZWxsRWxzID0gc2VsZWN0KGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RoZWFkIHRoLCB0aGVhZCB0ZCcpO1xuICAgIFxuICAgICAgICBpZiAoaGVhZGVyQ2VsbEVscy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGJvZHlSb3dFbHMgPSBzZWxlY3QoJ3Rib2R5IHRyJywgdGFibGVFbCk7XG4gICAgICAgICAgICBBcnJheS5mcm9tKGJvZHlSb3dFbHMpLmZvckVhY2gocm93RWwgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBjZWxsRWxzID0gcm93RWwuY2hpbGRyZW5cbiAgICAgICAgICAgICAgICBpZiAoY2VsbEVscy5sZW5ndGggPT09IGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oaGVhZGVyQ2VsbEVscykuZm9yRWFjaCgoaGVhZGVyQ2VsbEVsLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHcmFiIGhlYWRlciBjZWxsIHRleHQgYW5kIHVzZSBpdCBib2R5IGNlbGwgZGF0YSB0aXRsZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNlbGxFbHNbaV0uc2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJywgaGVhZGVyQ2VsbEVsLnRleHRDb250ZW50KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59IiwiXHJcbmNvbnN0IGRvbXJlYWR5ID0gcmVxdWlyZSgnZG9tcmVhZHknKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcbi8vSW1wb3J0IHRpcHB5LmpzIChodHRwczovL2F0b21pa3MuZ2l0aHViLmlvL3RpcHB5anMvKVxyXG5jb25zdCB0aXBweSA9IHJlcXVpcmUoXCIuLi8uLi92ZW5kb3IvdGlwcHlqcy90aXBweS5qc1wiKTtcclxuXHJcbnZhciBpbml0VGlwcHkgPSBmdW5jdGlvbigpe1xyXG4gICAgLy9pbml0IHRvb2x0aXAgb24gZWxlbWVudHMgd2l0aCB0aGUgLmpzLXRvb2x0aXAgY2xhc3NcclxuICAgIHRpcHB5KCcuanMtdG9vbHRpcCcsIHsgXHJcbiAgICAgICAgZHVyYXRpb246IDAsXHJcbiAgICAgICAgYXJyb3c6IHRydWVcclxuICAgIH0pIFxyXG59XHJcblxyXG5kb21yZWFkeSgoKSA9PiB7XHJcbiAgICBpbml0VGlwcHkoKTtcclxufSk7XHJcblxyXG52YXIgYm9keSA9IHNlbGVjdCgnYm9keScpWzBdO1xyXG5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2luaXQtdG9vbHRpcHMnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgaW5pdFRpcHB5KCk7XHJcbn0sIGZhbHNlKTtcclxuXHJcblxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKCcuLi91dGlscy9iZWhhdmlvcicpO1xuY29uc3QgdmFsaWRhdGUgPSByZXF1aXJlKCcuLi91dGlscy92YWxpZGF0ZS1pbnB1dCcpO1xuY29uc3QgZGVib3VuY2UgPSByZXF1aXJlKCdsb2Rhc2guZGVib3VuY2UnKTtcblxuY29uc3QgY2hhbmdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIHJldHVybiB2YWxpZGF0ZSh0aGlzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmVoYXZpb3Ioe1xuICAna2V5dXAgY2hhbmdlJzoge1xuICAgICdpbnB1dFtkYXRhLXZhbGlkYXRpb24tZWxlbWVudF0nOiBjaGFuZ2UsXG4gIH0sXG59KTtcblxuLyoqXG4gKiBUT0RPIGZvciAyLjAsIHJlbW92ZSB0aGlzIHN0YXRlbWVudCBhbmQgZXhwb3J0IGBuYXZpZ2F0aW9uYCBkaXJlY3RseTpcbiAqXG4gKiBtb2R1bGUuZXhwb3J0cyA9IGJlaGF2aW9yKHsuLi59KTtcbiAqL1xuLypjb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbihcbiAgZWwgPT4gdmFsaWRhdG9yLm9uKGVsKSxcbiAgdmFsaWRhdG9yXG4pOyovXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHJlZml4OiAnJyxcbn07XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBkb21yZWFkeSA9IHJlcXVpcmUoJ2RvbXJlYWR5Jyk7XG5jb25zdCBmb3JFYWNoID0gcmVxdWlyZSgnYXJyYXktZm9yZWFjaCcpO1xuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi91dGlscy9zZWxlY3QnKTtcbmNvbnN0IGRhdGVwaWNrZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGF0ZXBpY2tlcicpO1xuY29uc3QgbW9kYWwgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvbW9kYWwnKTtcbmNvbnN0IHRhYmxlID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3RhYmxlJyk7XG5jb25zdCB0b29sdGlwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3Rvb2x0aXAnKTtcbmNvbnN0IGRyb3Bkb3duID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Ryb3Bkb3duJyk7XG5jb25zdCByYWRpb1RvZ2dsZUNvbnRlbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcmFkaW8tdG9nZ2xlLWNvbnRlbnQnKTtcbmNvbnN0IGNoZWNrYm94VG9nZ2xlQ29udGVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudCcpO1xuXG5cbi8qKlxuICogVGhlICdwb2x5ZmlsbHMnIGRlZmluZSBrZXkgRUNNQVNjcmlwdCA1IG1ldGhvZHMgdGhhdCBtYXkgYmUgbWlzc2luZyBmcm9tXG4gKiBvbGRlciBicm93c2Vycywgc28gbXVzdCBiZSBsb2FkZWQgZmlyc3QuXG4gKi9cbnJlcXVpcmUoJy4vcG9seWZpbGxzJyk7XG5cbmNvbnN0IGRrZmRzID0gcmVxdWlyZSgnLi9jb25maWcnKTtcblxuY29uc3QgY29tcG9uZW50cyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cycpO1xuZGtmZHMuY29tcG9uZW50cyA9IGNvbXBvbmVudHM7XG5cbmRvbXJlYWR5KCgpID0+IHtcbiAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuYm9keTtcbiAgZm9yIChsZXQgbmFtZSBpbiBjb21wb25lbnRzKSB7XG4gICAgY29uc3QgYmVoYXZpb3IgPSBjb21wb25lbnRzWyBuYW1lIF07XG4gICAgYmVoYXZpb3Iub24odGFyZ2V0KTtcbiAgfVxuXG4gIC8vSW5pdCBkYXRlcGlja2VyLiAgKE5vdGU6IGFib3ZlICdiZWhhdmlvci5vbicgZG9lcyBub3Qgd29yayB3aXRoIHBpa2FkYXkgLT4gc2VwZXJhdGUgaW5pdGlhbGl6YXRpb24pXG4gIGNvbnN0IGpzU2VsZWN0b3JEYXRlcGlja2VyID0gJy5qcy1jYWxlbmRhci1ncm91cCc7XG4gIGZvckVhY2goc2VsZWN0KGpzU2VsZWN0b3JEYXRlcGlja2VyKSwgY2FsZW5kYXJHcm91cEVsZW1lbnQgPT4ge1xuICAgIG5ldyBkYXRlcGlja2VyKGNhbGVuZGFyR3JvdXBFbGVtZW50KTtcbiAgfSk7XG5cbiAgY29uc3QganNTZWxlY3RvckRyb3Bkb3duID0gJy5qcy1kcm9wZG93bic7XG4gIGZvckVhY2goc2VsZWN0KGpzU2VsZWN0b3JEcm9wZG93biksIGRyb3Bkb3duRWxlbWVudCA9PiB7XG4gICAgbmV3IGRyb3Bkb3duKGRyb3Bkb3duRWxlbWVudCk7XG4gIH0pO1xuXG4gIGNvbnN0IGpzUmFkaW9Ub2dnbGVHcm91cCA9ICcuanMtcmFkaW8tdG9nZ2xlLWdyb3VwJztcbiAgZm9yRWFjaChzZWxlY3QoanNSYWRpb1RvZ2dsZUdyb3VwKSwgdG9nZ2xlRWxlbWVudCA9PiB7XG4gICAgbmV3IHJhZGlvVG9nZ2xlQ29udGVudCh0b2dnbGVFbGVtZW50KTtcbiAgfSk7XG5cbiAgY29uc3QganNDaGVja2JveFRvZ2dsZUNvbnRlbnQgPSAnLmpzLWNoZWNrYm94LXRvZ2dsZS1jb250ZW50JztcbiAgZm9yRWFjaChzZWxlY3QoanNDaGVja2JveFRvZ2dsZUNvbnRlbnQpLCB0b2dnbGVFbGVtZW50ID0+IHtcbiAgICBuZXcgY2hlY2tib3hUb2dnbGVDb250ZW50KHRvZ2dsZUVsZW1lbnQpO1xuICB9KTtcblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGtmZHM7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gVGhpcyB1c2VkIHRvIGJlIGNvbmRpdGlvbmFsbHkgZGVwZW5kZW50IG9uIHdoZXRoZXIgdGhlXG4gIC8vIGJyb3dzZXIgc3VwcG9ydGVkIHRvdWNoIGV2ZW50czsgaWYgaXQgZGlkLCBgQ0xJQ0tgIHdhcyBzZXQgdG9cbiAgLy8gYHRvdWNoc3RhcnRgLiAgSG93ZXZlciwgdGhpcyBoYWQgZG93bnNpZGVzOlxuICAvL1xuICAvLyAqIEl0IHByZS1lbXB0ZWQgbW9iaWxlIGJyb3dzZXJzJyBkZWZhdWx0IGJlaGF2aW9yIG9mIGRldGVjdGluZ1xuICAvLyAgIHdoZXRoZXIgYSB0b3VjaCB0dXJuZWQgaW50byBhIHNjcm9sbCwgdGhlcmVieSBwcmV2ZW50aW5nXG4gIC8vICAgdXNlcnMgZnJvbSB1c2luZyBzb21lIG9mIG91ciBjb21wb25lbnRzIGFzIHNjcm9sbCBzdXJmYWNlcy5cbiAgLy9cbiAgLy8gKiBTb21lIGRldmljZXMsIHN1Y2ggYXMgdGhlIE1pY3Jvc29mdCBTdXJmYWNlIFBybywgc3VwcG9ydCAqYm90aCpcbiAgLy8gICB0b3VjaCBhbmQgY2xpY2tzLiBUaGlzIG1lYW50IHRoZSBjb25kaXRpb25hbCBlZmZlY3RpdmVseSBkcm9wcGVkXG4gIC8vICAgc3VwcG9ydCBmb3IgdGhlIHVzZXIncyBtb3VzZSwgZnJ1c3RyYXRpbmcgdXNlcnMgd2hvIHByZWZlcnJlZFxuICAvLyAgIGl0IG9uIHRob3NlIHN5c3RlbXMuXG4gIENMSUNLOiAnY2xpY2snLFxufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGVscHJvdG8gPSB3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlO1xuY29uc3QgSElEREVOID0gJ2hpZGRlbic7XG5cbmlmICghKEhJRERFTiBpbiBlbHByb3RvKSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxwcm90bywgSElEREVOLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoSElEREVOKTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoSElEREVOLCAnJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShISURERU4pO1xuICAgICAgfVxuICAgIH0sXG4gIH0pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jbGFzc0xpc3QgYW5kIERPTVRva2VuTGlzdFxucmVxdWlyZSgnY2xhc3NsaXN0LXBvbHlmaWxsJyk7XG4vLyBwb2x5ZmlsbHMgSFRNTEVsZW1lbnQucHJvdG90eXBlLmhpZGRlblxucmVxdWlyZSgnLi9lbGVtZW50LWhpZGRlbicpO1xuXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24nKTtcbnJlcXVpcmUoJ2NvcmUtanMvZm4vYXJyYXkvZnJvbScpOyIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XG5jb25zdCBCZWhhdmlvciA9IHJlcXVpcmUoJ3JlY2VwdG9yL2JlaGF2aW9yJyk7XG5cbmNvbnN0IHNlcXVlbmNlID0gZnVuY3Rpb24gKCkge1xuICBjb25zdCBzZXEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IGRvY3VtZW50LmJvZHk7XG4gICAgfVxuICAgIGZvckVhY2goc2VxLCBtZXRob2QgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzWyBtZXRob2QgXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzWyBtZXRob2QgXS5jYWxsKHRoaXMsIHRhcmdldCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59O1xuXG4vKipcbiAqIEBuYW1lIGJlaGF2aW9yXG4gKiBAcGFyYW0ge29iamVjdH0gZXZlbnRzXG4gKiBAcGFyYW0ge29iamVjdD99IHByb3BzXG4gKiBAcmV0dXJuIHtyZWNlcHRvci5iZWhhdmlvcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZXZlbnRzLCBwcm9wcykgPT4ge1xuICByZXR1cm4gQmVoYXZpb3IoZXZlbnRzLCBhc3NpZ24oe1xuICAgIG9uOiAgIHNlcXVlbmNlKCdpbml0JywgJ2FkZCcpLFxuICAgIG9mZjogIHNlcXVlbmNlKCd0ZWFyZG93bicsICdyZW1vdmUnKSxcbiAgfSwgcHJvcHMpKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5hbWUgY2xvc2VzdFxuICogQGRlc2MgZ2V0IG5lYXJlc3QgcGFyZW50IGVsZW1lbnQgbWF0Y2hpbmcgc2VsZWN0b3IuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIFRoZSBIVE1MIGVsZW1lbnQgd2hlcmUgdGhlIHNlYXJjaCBzdGFydHMuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBTZWxlY3RvciB0byBiZSBmb3VuZC5cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSAtIE5lYXJlc3QgcGFyZW50IGVsZW1lbnQgbWF0Y2hpbmcgc2VsZWN0b3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2xvc2VzdCAoZWwsIHNlbGVjdG9yKSB7XG4gIHZhciBtYXRjaGVzU2VsZWN0b3IgPSBlbC5tYXRjaGVzIHx8IGVsLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBlbC5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgZWwubXNNYXRjaGVzU2VsZWN0b3I7XG5cbiAgd2hpbGUgKGVsKSB7XG4gICAgICBpZiAobWF0Y2hlc1NlbGVjdG9yLmNhbGwoZWwsIHNlbGVjdG9yKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiBlbDtcbn07XG4iLCIvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzU1NzQzM1xuZnVuY3Rpb24gaXNFbGVtZW50SW5WaWV3cG9ydCAoZWwsIHdpbj13aW5kb3csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2NFbD1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICByZXR1cm4gKFxuICAgIHJlY3QudG9wID49IDAgJiZcbiAgICByZWN0LmxlZnQgPj0gMCAmJlxuICAgIHJlY3QuYm90dG9tIDw9ICh3aW4uaW5uZXJIZWlnaHQgfHwgZG9jRWwuY2xpZW50SGVpZ2h0KSAmJlxuICAgIHJlY3QucmlnaHQgPD0gKHdpbi5pbm5lcldpZHRoIHx8IGRvY0VsLmNsaWVudFdpZHRoKVxuICApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudEluVmlld3BvcnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQG5hbWUgaXNFbGVtZW50XG4gKiBAZGVzYyByZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIERPTSBlbGVtZW50LlxuICogQHBhcmFtIHthbnl9IHZhbHVlXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5jb25zdCBpc0VsZW1lbnQgPSB2YWx1ZSA9PiB7XG4gIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLm5vZGVUeXBlID09PSAxO1xufTtcblxuLyoqXG4gKiBAbmFtZSBzZWxlY3RcbiAqIEBkZXNjIHNlbGVjdHMgZWxlbWVudHMgZnJvbSB0aGUgRE9NIGJ5IGNsYXNzIHNlbGVjdG9yIG9yIElEIHNlbGVjdG9yLlxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gVGhlIHNlbGVjdG9yIHRvIHRyYXZlcnNlIHRoZSBET00gd2l0aC5cbiAqIEBwYXJhbSB7RG9jdW1lbnR8SFRNTEVsZW1lbnQ/fSBjb250ZXh0IC0gVGhlIGNvbnRleHQgdG8gdHJhdmVyc2UgdGhlIERPTVxuICogICBpbi4gSWYgbm90IHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byB0aGUgZG9jdW1lbnQuXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudFtdfSAtIEFuIGFycmF5IG9mIERPTSBub2RlcyBvciBhbiBlbXB0eSBhcnJheS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZWxlY3QgKHNlbGVjdG9yLCBjb250ZXh0KSB7XG5cbiAgaWYgKHR5cGVvZiBzZWxlY3RvciAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpZiAoIWNvbnRleHQgfHwgIWlzRWxlbWVudChjb250ZXh0KSkge1xuICAgIGNvbnRleHQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gIH1cblxuICBjb25zdCBzZWxlY3Rpb24gPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc2VsZWN0aW9uKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcbmNvbnN0IENPTlRST0xTID0gJ2FyaWEtY29udHJvbHMnO1xuY29uc3QgSElEREVOID0gJ2FyaWEtaGlkZGVuJztcblxubW9kdWxlLmV4cG9ydHMgPSAoYnV0dG9uLCBleHBhbmRlZCkgPT4ge1xuXG4gIGlmICh0eXBlb2YgZXhwYW5kZWQgIT09ICdib29sZWFuJykge1xuICAgIGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICdmYWxzZSc7XG4gIH1cbiAgYnV0dG9uLnNldEF0dHJpYnV0ZShFWFBBTkRFRCwgZXhwYW5kZWQpO1xuXG4gIGNvbnN0IGlkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShDT05UUk9MUyk7XG4gIGNvbnN0IGNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICBpZiAoIWNvbnRyb2xzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ05vIHRvZ2dsZSB0YXJnZXQgZm91bmQgd2l0aCBpZDogXCInICsgaWQgKyAnXCInXG4gICAgKTtcbiAgfVxuXG4gIGNvbnRyb2xzLnNldEF0dHJpYnV0ZShISURERU4sICFleHBhbmRlZCk7XG4gIHJldHVybiBleHBhbmRlZDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBkYXRhc2V0ID0gcmVxdWlyZSgnZWxlbS1kYXRhc2V0Jyk7XG5cbmNvbnN0IFBSRUZJWCA9IHJlcXVpcmUoJy4uL2NvbmZpZycpLnByZWZpeDtcbmNvbnN0IENIRUNLRUQgPSAnYXJpYS1jaGVja2VkJztcbmNvbnN0IENIRUNLRURfQ0xBU1MgPSBgJHtQUkVGSVh9Y2hlY2tsaXN0LWNoZWNrZWRgO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHZhbGlkYXRlIChlbCkge1xuICBjb25zdCBkYXRhID0gZGF0YXNldChlbCk7XG4gIGNvbnN0IGlkID0gZGF0YS52YWxpZGF0aW9uRWxlbWVudDtcbiAgY29uc3QgY2hlY2tMaXN0ID0gaWQuY2hhckF0KDApID09PSAnIydcbiAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaWQpXG4gICAgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cbiAgaWYgKCFjaGVja0xpc3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgTm8gdmFsaWRhdGlvbiBlbGVtZW50IGZvdW5kIHdpdGggaWQ6IFwiJHtpZH1cImBcbiAgICApO1xuICB9XG5cbiAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSkge1xuICAgIGlmIChrZXkuc3RhcnRzV2l0aCgndmFsaWRhdGUnKSkge1xuICAgICAgY29uc3QgdmFsaWRhdG9yTmFtZSA9IGtleS5zdWJzdHIoJ3ZhbGlkYXRlJy5sZW5ndGgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCB2YWxpZGF0b3JQYXR0ZXJuID0gbmV3IFJlZ0V4cChkYXRhWyBrZXkgXSk7XG4gICAgICBjb25zdCB2YWxpZGF0b3JTZWxlY3RvciA9IGBbZGF0YS12YWxpZGF0b3I9XCIke3ZhbGlkYXRvck5hbWV9XCJdYDtcbiAgICAgIGNvbnN0IHZhbGlkYXRvckNoZWNrYm94ID0gY2hlY2tMaXN0LnF1ZXJ5U2VsZWN0b3IodmFsaWRhdG9yU2VsZWN0b3IpO1xuICAgICAgaWYgKCF2YWxpZGF0b3JDaGVja2JveCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYE5vIHZhbGlkYXRvciBjaGVja2JveCBmb3VuZCBmb3I6IFwiJHt2YWxpZGF0b3JOYW1lfVwiYFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGVja2VkID0gdmFsaWRhdG9yUGF0dGVybi50ZXN0KGVsLnZhbHVlKTtcbiAgICAgIHZhbGlkYXRvckNoZWNrYm94LmNsYXNzTGlzdC50b2dnbGUoQ0hFQ0tFRF9DTEFTUywgY2hlY2tlZCk7XG4gICAgICB2YWxpZGF0b3JDaGVja2JveC5zZXRBdHRyaWJ1dGUoQ0hFQ0tFRCwgY2hlY2tlZCk7XG4gICAgfVxuICB9XG59OyIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcblx0KGdsb2JhbC5NaWNyb01vZGFsID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgdmVyc2lvbiA9IFwiMC4zLjFcIjtcblxudmFyIGNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbnZhciBjcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfTtcbn0oKTtcblxudmFyIHRvQ29uc3VtYWJsZUFycmF5ID0gZnVuY3Rpb24gKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcblxuICAgIHJldHVybiBhcnIyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFycik7XG4gIH1cbn07XG5cbnZhciBNaWNyb01vZGFsID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBGT0NVU0FCTEVfRUxFTUVOVFMgPSBbJ2FbaHJlZl0nLCAnYXJlYVtocmVmXScsICdpbnB1dDpub3QoW2Rpc2FibGVkXSk6bm90KFt0eXBlPVwiaGlkZGVuXCJdKTpub3QoW2FyaWEtaGlkZGVuXSknLCAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuXSknLCAndGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW5dKScsICdidXR0b246bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW5dKScsICdpZnJhbWUnLCAnb2JqZWN0JywgJ2VtYmVkJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t0YWJpbmRleF06bm90KFt0YWJpbmRleF49XCItXCJdKSddO1xuXG4gIHZhciBNb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNb2RhbChfcmVmKSB7XG4gICAgICB2YXIgdGFyZ2V0TW9kYWwgPSBfcmVmLnRhcmdldE1vZGFsLFxuICAgICAgICAgIF9yZWYkdHJpZ2dlcnMgPSBfcmVmLnRyaWdnZXJzLFxuICAgICAgICAgIHRyaWdnZXJzID0gX3JlZiR0cmlnZ2VycyA9PT0gdW5kZWZpbmVkID8gW10gOiBfcmVmJHRyaWdnZXJzLFxuICAgICAgICAgIF9yZWYkb25TaG93ID0gX3JlZi5vblNob3csXG4gICAgICAgICAgb25TaG93ID0gX3JlZiRvblNob3cgPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uICgpIHt9IDogX3JlZiRvblNob3csXG4gICAgICAgICAgX3JlZiRvbkNsb3NlID0gX3JlZi5vbkNsb3NlLFxuICAgICAgICAgIG9uQ2xvc2UgPSBfcmVmJG9uQ2xvc2UgPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uICgpIHt9IDogX3JlZiRvbkNsb3NlLFxuICAgICAgICAgIF9yZWYkb3BlblRyaWdnZXIgPSBfcmVmLm9wZW5UcmlnZ2VyLFxuICAgICAgICAgIG9wZW5UcmlnZ2VyID0gX3JlZiRvcGVuVHJpZ2dlciA9PT0gdW5kZWZpbmVkID8gJ2RhdGEtbWljcm9tb2RhbC10cmlnZ2VyJyA6IF9yZWYkb3BlblRyaWdnZXIsXG4gICAgICAgICAgX3JlZiRjbG9zZVRyaWdnZXIgPSBfcmVmLmNsb3NlVHJpZ2dlcixcbiAgICAgICAgICBjbG9zZVRyaWdnZXIgPSBfcmVmJGNsb3NlVHJpZ2dlciA9PT0gdW5kZWZpbmVkID8gJ2RhdGEtbWljcm9tb2RhbC1jbG9zZScgOiBfcmVmJGNsb3NlVHJpZ2dlcixcbiAgICAgICAgICBfcmVmJGRpc2FibGVTY3JvbGwgPSBfcmVmLmRpc2FibGVTY3JvbGwsXG4gICAgICAgICAgZGlzYWJsZVNjcm9sbCA9IF9yZWYkZGlzYWJsZVNjcm9sbCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJGRpc2FibGVTY3JvbGwsXG4gICAgICAgICAgX3JlZiRkaXNhYmxlRm9jdXMgPSBfcmVmLmRpc2FibGVGb2N1cyxcbiAgICAgICAgICBkaXNhYmxlRm9jdXMgPSBfcmVmJGRpc2FibGVGb2N1cyA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJGRpc2FibGVGb2N1cyxcbiAgICAgICAgICBfcmVmJGF3YWl0Q2xvc2VBbmltYXQgPSBfcmVmLmF3YWl0Q2xvc2VBbmltYXRpb24sXG4gICAgICAgICAgYXdhaXRDbG9zZUFuaW1hdGlvbiA9IF9yZWYkYXdhaXRDbG9zZUFuaW1hdCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJGF3YWl0Q2xvc2VBbmltYXQsXG4gICAgICAgICAgX3JlZiRkZWJ1Z01vZGUgPSBfcmVmLmRlYnVnTW9kZSxcbiAgICAgICAgICBkZWJ1Z01vZGUgPSBfcmVmJGRlYnVnTW9kZSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBfcmVmJGRlYnVnTW9kZTtcbiAgICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIE1vZGFsKTtcblxuICAgICAgLy8gU2F2ZSBhIHJlZmVyZW5jZSBvZiB0aGUgbW9kYWxcbiAgICAgIHRoaXMubW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRNb2RhbCk7XG5cbiAgICAgIC8vIFNhdmUgYSByZWZlcmVuY2UgdG8gdGhlIHBhc3NlZCBjb25maWdcbiAgICAgIHRoaXMuY29uZmlnID0geyBkZWJ1Z01vZGU6IGRlYnVnTW9kZSwgZGlzYWJsZVNjcm9sbDogZGlzYWJsZVNjcm9sbCwgb3BlblRyaWdnZXI6IG9wZW5UcmlnZ2VyLCBjbG9zZVRyaWdnZXI6IGNsb3NlVHJpZ2dlciwgb25TaG93OiBvblNob3csIG9uQ2xvc2U6IG9uQ2xvc2UsIGF3YWl0Q2xvc2VBbmltYXRpb246IGF3YWl0Q2xvc2VBbmltYXRpb24sIGRpc2FibGVGb2N1czogZGlzYWJsZUZvY3VzXG5cbiAgICAgICAgLy8gUmVnaXN0ZXIgY2xpY2sgZXZlbnRzIG9ubHkgaWYgcHJlYmluZGluZyBldmVudExpc3RlbmVyc1xuICAgICAgfTtpZiAodHJpZ2dlcnMubGVuZ3RoID4gMCkgdGhpcy5yZWdpc3RlclRyaWdnZXJzLmFwcGx5KHRoaXMsIHRvQ29uc3VtYWJsZUFycmF5KHRyaWdnZXJzKSk7XG5cbiAgICAgIC8vIHByZWJpbmQgZnVuY3Rpb25zIGZvciBldmVudCBsaXN0ZW5lcnNcbiAgICAgIHRoaXMub25DbGljayA9IHRoaXMub25DbGljay5iaW5kKHRoaXMpO1xuICAgICAgdGhpcy5vbktleWRvd24gPSB0aGlzLm9uS2V5ZG93bi5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvb3BzIHRocm91Z2ggYWxsIG9wZW5UcmlnZ2VycyBhbmQgYmluZHMgY2xpY2sgZXZlbnRcbiAgICAgKiBAcGFyYW0gIHthcnJheX0gdHJpZ2dlcnMgW0FycmF5IG9mIG5vZGUgZWxlbWVudHNdXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cblxuXG4gICAgY3JlYXRlQ2xhc3MoTW9kYWwsIFt7XG4gICAgICBrZXk6ICdyZWdpc3RlclRyaWdnZXJzJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZWdpc3RlclRyaWdnZXJzKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCB0cmlnZ2VycyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICAgIHRyaWdnZXJzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJpZ2dlcnMuZm9yRWFjaChmdW5jdGlvbiAodHJpZ2dlcikge1xuICAgICAgICAgIHRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuc2hvd01vZGFsKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ3Nob3dNb2RhbCcsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc2hvd01vZGFsKCkge1xuICAgICAgICB0aGlzLmFjdGl2ZUVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgICB0aGlzLm1vZGFsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcbiAgICAgICAgdGhpcy5tb2RhbC5jbGFzc0xpc3QuYWRkKCdpcy1vcGVuJyk7XG4gICAgICAgIHRoaXMuc2V0Rm9jdXNUb0ZpcnN0Tm9kZSgpO1xuICAgICAgICB0aGlzLnNjcm9sbEJlaGF2aW91cignZGlzYWJsZScpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuY29uZmlnLm9uU2hvdyh0aGlzLm1vZGFsKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjbG9zZU1vZGFsJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuICAgICAgICB2YXIgbW9kYWwgPSB0aGlzLm1vZGFsO1xuICAgICAgICB0aGlzLm1vZGFsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuc2Nyb2xsQmVoYXZpb3VyKCdlbmFibGUnKTtcbiAgICAgICAgdGhpcy5hY3RpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIHRoaXMuY29uZmlnLm9uQ2xvc2UodGhpcy5tb2RhbCk7XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmF3YWl0Q2xvc2VBbmltYXRpb24pIHtcbiAgICAgICAgICB0aGlzLm1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG4gICAgICAgICAgICBtb2RhbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJyk7XG4gICAgICAgICAgICBtb2RhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLW9wZW4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ3Njcm9sbEJlaGF2aW91cicsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc2Nyb2xsQmVoYXZpb3VyKHRvZ2dsZSkge1xuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmRpc2FibGVTY3JvbGwpIHJldHVybjtcbiAgICAgICAgdmFyIGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG4gICAgICAgIHN3aXRjaCAodG9nZ2xlKSB7XG4gICAgICAgICAgY2FzZSAnZW5hYmxlJzpcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oYm9keS5zdHlsZSwgeyBvdmVyZmxvdzogJ2luaXRpYWwnLCBoZWlnaHQ6ICdpbml0aWFsJyB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2Rpc2FibGUnOlxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihib2R5LnN0eWxlLCB7IG92ZXJmbG93OiAnaGlkZGVuJywgaGVpZ2h0OiAnMTAwdmgnIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2FkZEV2ZW50TGlzdGVuZXJzJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5tb2RhbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5vbkNsaWNrKTtcbiAgICAgICAgdGhpcy5tb2RhbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljayk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLm9uS2V5ZG93bik7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAncmVtb3ZlRXZlbnRMaXN0ZW5lcnMnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLm1vZGFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uQ2xpY2spO1xuICAgICAgICB0aGlzLm1vZGFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsaWNrKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25LZXlkb3duKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdvbkNsaWNrJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQuaGFzQXR0cmlidXRlKHRoaXMuY29uZmlnLmNsb3NlVHJpZ2dlcikpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnb25LZXlkb3duJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBvbktleWRvd24oZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDI3KSB0aGlzLmNsb3NlTW9kYWwoZXZlbnQpO1xuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gOSkgdGhpcy5tYWludGFpbkZvY3VzKGV2ZW50KTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdnZXRGb2N1c2FibGVOb2RlcycsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0Rm9jdXNhYmxlTm9kZXMoKSB7XG4gICAgICAgIHZhciBub2RlcyA9IHRoaXMubW9kYWwucXVlcnlTZWxlY3RvckFsbChGT0NVU0FCTEVfRUxFTUVOVFMpO1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMobm9kZXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgcmV0dXJuIG5vZGVzW2tleV07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ3NldEZvY3VzVG9GaXJzdE5vZGUnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNldEZvY3VzVG9GaXJzdE5vZGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5kaXNhYmxlRm9jdXMpIHJldHVybjtcbiAgICAgICAgdmFyIGZvY3VzYWJsZU5vZGVzID0gdGhpcy5nZXRGb2N1c2FibGVOb2RlcygpO1xuICAgICAgICBpZiAoZm9jdXNhYmxlTm9kZXMubGVuZ3RoKSBmb2N1c2FibGVOb2Rlc1swXS5mb2N1cygpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ21haW50YWluRm9jdXMnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIG1haW50YWluRm9jdXMoZXZlbnQpIHtcbiAgICAgICAgdmFyIGZvY3VzYWJsZU5vZGVzID0gdGhpcy5nZXRGb2N1c2FibGVOb2RlcygpO1xuXG4gICAgICAgIC8vIGlmIGRpc2FibGVGb2N1cyBpcyB0cnVlXG4gICAgICAgIGlmICghdGhpcy5tb2RhbC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgICAgIGZvY3VzYWJsZU5vZGVzWzBdLmZvY3VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGZvY3VzZWRJdGVtSW5kZXggPSBmb2N1c2FibGVOb2Rlcy5pbmRleE9mKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xuXG4gICAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5ICYmIGZvY3VzZWRJdGVtSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIGZvY3VzYWJsZU5vZGVzW2ZvY3VzYWJsZU5vZGVzLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghZXZlbnQuc2hpZnRLZXkgJiYgZm9jdXNlZEl0ZW1JbmRleCA9PT0gZm9jdXNhYmxlTm9kZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgZm9jdXNhYmxlTm9kZXNbMF0uZm9jdXMoKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBNb2RhbDtcbiAgfSgpO1xuXG4gIC8qKlxuICAgKiBNb2RhbCBwcm90b3R5cGUgZW5kcy5cbiAgICogSGVyZSBvbiBjb2RlIGlzIHJlcG9zaWJsZSBmb3IgZGV0ZWN0aW5nIGFuZFxuICAgKiBhdXRvYmluZGluZyBldmVudCBoYW5kbGVycyBvbiBtb2RhbCB0cmlnZ2Vyc1xuICAgKi9cblxuICAvLyBLZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBvcGVuZWQgbW9kYWxcblxuXG4gIHZhciBhY3RpdmVNb2RhbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhbiBhc3NvY2lhdGl2ZSBhcnJheSBvZiBtb2RhbHMgYW5kIGl0J3NcbiAgICogcmVzcGVjdGl2ZSB0cmlnZ2Vyc1xuICAgKiBAcGFyYW0gIHthcnJheX0gdHJpZ2dlcnMgICAgIEFuIGFycmF5IG9mIGFsbCB0cmlnZ2Vyc1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRyaWdnZXJBdHRyIFRoZSBkYXRhLWF0dHJpYnV0ZSB3aGljaCB0cmlnZ2VycyB0aGUgbW9kdWxlXG4gICAqIEByZXR1cm4ge2FycmF5fVxuICAgKi9cbiAgdmFyIGdlbmVyYXRlVHJpZ2dlck1hcCA9IGZ1bmN0aW9uIGdlbmVyYXRlVHJpZ2dlck1hcCh0cmlnZ2VycywgdHJpZ2dlckF0dHIpIHtcbiAgICB2YXIgdHJpZ2dlck1hcCA9IFtdO1xuXG4gICAgdHJpZ2dlcnMuZm9yRWFjaChmdW5jdGlvbiAodHJpZ2dlcikge1xuICAgICAgdmFyIHRhcmdldE1vZGFsID0gdHJpZ2dlci5hdHRyaWJ1dGVzW3RyaWdnZXJBdHRyXS52YWx1ZTtcbiAgICAgIGlmICh0cmlnZ2VyTWFwW3RhcmdldE1vZGFsXSA9PT0gdW5kZWZpbmVkKSB0cmlnZ2VyTWFwW3RhcmdldE1vZGFsXSA9IFtdO1xuICAgICAgdHJpZ2dlck1hcFt0YXJnZXRNb2RhbF0ucHVzaCh0cmlnZ2VyKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0cmlnZ2VyTWFwO1xuICB9O1xuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgd2hldGhlciBhIG1vZGFsIG9mIHRoZSBnaXZlbiBpZCBleGlzdHNcbiAgICogaW4gdGhlIERPTVxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGlkICBUaGUgaWQgb2YgdGhlIG1vZGFsXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICB2YXIgdmFsaWRhdGVNb2RhbFByZXNlbmNlID0gZnVuY3Rpb24gdmFsaWRhdGVNb2RhbFByZXNlbmNlKGlkKSB7XG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpIHtcbiAgICAgIGNvbnNvbGUud2FybignTWljcm9Nb2RhbCB2JyArIHZlcnNpb24gKyAnOiBcXHUyNzU3U2VlbXMgbGlrZSB5b3UgaGF2ZSBtaXNzZWQgJWNcXCcnICsgaWQgKyAnXFwnJywgJ2JhY2tncm91bmQtY29sb3I6ICNmOGY5ZmE7Y29sb3I6ICM1MDU5NmM7Zm9udC13ZWlnaHQ6IGJvbGQ7JywgJ0lEIHNvbWV3aGVyZSBpbiB5b3VyIGNvZGUuIFJlZmVyIGV4YW1wbGUgYmVsb3cgdG8gcmVzb2x2ZSBpdC4nKTtcbiAgICAgIGNvbnNvbGUud2FybignJWNFeGFtcGxlOicsICdiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmOWZhO2NvbG9yOiAjNTA1OTZjO2ZvbnQtd2VpZ2h0OiBib2xkOycsICc8ZGl2IGNsYXNzPVwibW9kYWxcIiBpZD1cIicgKyBpZCArICdcIj48L2Rpdj4nKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyBpZiB0aGVyZSBhcmUgbW9kYWwgdHJpZ2dlcnMgcHJlc2VudFxuICAgKiBpbiB0aGUgRE9NXG4gICAqIEBwYXJhbSAge2FycmF5fSB0cmlnZ2VycyBBbiBhcnJheSBvZiBkYXRhLXRyaWdnZXJzXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICB2YXIgdmFsaWRhdGVUcmlnZ2VyUHJlc2VuY2UgPSBmdW5jdGlvbiB2YWxpZGF0ZVRyaWdnZXJQcmVzZW5jZSh0cmlnZ2Vycykge1xuICAgIGlmICh0cmlnZ2Vycy5sZW5ndGggPD0gMCkge1xuICAgICAgY29uc29sZS53YXJuKCdNaWNyb01vZGFsIHYnICsgdmVyc2lvbiArICc6IFxcdTI3NTdQbGVhc2Ugc3BlY2lmeSBhdCBsZWFzdCBvbmUgJWNcXCdtaWNyb21vZGFsLXRyaWdnZXJcXCcnLCAnYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjlmYTtjb2xvcjogIzUwNTk2Yztmb250LXdlaWdodDogYm9sZDsnLCAnZGF0YSBhdHRyaWJ1dGUuJyk7XG4gICAgICBjb25zb2xlLndhcm4oJyVjRXhhbXBsZTonLCAnYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjlmYTtjb2xvcjogIzUwNTk2Yztmb250LXdlaWdodDogYm9sZDsnLCAnPGEgaHJlZj1cIiNcIiBkYXRhLW1pY3JvbW9kYWwtdHJpZ2dlcj1cIm15LW1vZGFsXCI+PC9hPicpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRyaWdnZXJzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIG1vZGFsc1xuICAgKiBhcmUgcHJlc2VudCBpbiB0aGUgRE9NXG4gICAqIEBwYXJhbSAge2FycmF5fSB0cmlnZ2VycyAgIEFycmF5IG9mIERPTSBub2RlcyB3aGljaCBoYXZlIGRhdGEtdHJpZ2dlcnNcbiAgICogQHBhcmFtICB7YXJyYXl9IHRyaWdnZXJNYXAgQXNzb2NpYXRpdmUgYXJyYXkgb2YgbW9kYWxzIGFuZCB0aGllciB0cmlnZ2Vyc1xuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgdmFyIHZhbGlkYXRlQXJncyA9IGZ1bmN0aW9uIHZhbGlkYXRlQXJncyh0cmlnZ2VycywgdHJpZ2dlck1hcCkge1xuICAgIHZhbGlkYXRlVHJpZ2dlclByZXNlbmNlKHRyaWdnZXJzKTtcbiAgICBpZiAoIXRyaWdnZXJNYXApIHJldHVybiB0cnVlO1xuICAgIGZvciAodmFyIGlkIGluIHRyaWdnZXJNYXApIHtcbiAgICAgIHZhbGlkYXRlTW9kYWxQcmVzZW5jZShpZCk7XG4gICAgfXJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBCaW5kcyBjbGljayBoYW5kbGVycyB0byBhbGwgbW9kYWwgdHJpZ2dlcnNcbiAgICogQHBhcmFtICB7b2JqZWN0fSBjb25maWcgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHZvaWRcbiAgICovXG4gIHZhciBpbml0ID0gZnVuY3Rpb24gaW5pdChjb25maWcpIHtcbiAgICAvLyBDcmVhdGUgYW4gY29uZmlnIG9iamVjdCB3aXRoIGRlZmF1bHQgb3BlblRyaWdnZXJcbiAgICB2YXIgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHsgb3BlblRyaWdnZXI6ICdkYXRhLW1pY3JvbW9kYWwtdHJpZ2dlcicgfSwgY29uZmlnKTtcblxuICAgIC8vIENvbGxlY3RzIGFsbCB0aGUgbm9kZXMgd2l0aCB0aGUgdHJpZ2dlclxuICAgIHZhciB0cmlnZ2VycyA9IFtdLmNvbmNhdCh0b0NvbnN1bWFibGVBcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbJyArIG9wdGlvbnMub3BlblRyaWdnZXIgKyAnXScpKSk7XG5cbiAgICAvLyBNYWtlcyBhIG1hcHBpbmdzIG9mIG1vZGFscyB3aXRoIHRoZWlyIHRyaWdnZXIgbm9kZXNcbiAgICB2YXIgdHJpZ2dlck1hcCA9IGdlbmVyYXRlVHJpZ2dlck1hcCh0cmlnZ2Vycywgb3B0aW9ucy5vcGVuVHJpZ2dlcik7XG5cbiAgICAvLyBDaGVja3MgaWYgbW9kYWxzIGFuZCB0cmlnZ2VycyBleGlzdCBpbiBkb21cbiAgICBpZiAob3B0aW9ucy5kZWJ1Z01vZGUgPT09IHRydWUgJiYgdmFsaWRhdGVBcmdzKHRyaWdnZXJzLCB0cmlnZ2VyTWFwKSA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgIC8vIEZvciBldmVyeSB0YXJnZXQgbW9kYWwgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZVxuICAgIGZvciAodmFyIGtleSBpbiB0cmlnZ2VyTWFwKSB7XG4gICAgICB2YXIgdmFsdWUgPSB0cmlnZ2VyTWFwW2tleV07XG4gICAgICBvcHRpb25zLnRhcmdldE1vZGFsID0ga2V5O1xuICAgICAgb3B0aW9ucy50cmlnZ2VycyA9IFtdLmNvbmNhdCh0b0NvbnN1bWFibGVBcnJheSh2YWx1ZSkpO1xuICAgICAgbmV3IE1vZGFsKG9wdGlvbnMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2hvd3MgYSBwYXJ0aWN1bGFyIG1vZGFsXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGFyZ2V0TW9kYWwgW1RoZSBpZCBvZiB0aGUgbW9kYWwgdG8gZGlzcGxheV1cbiAgICogQHBhcmFtICB7b2JqZWN0fSBjb25maWcgW1RoZSBjb25maWd1cmF0aW9uIG9iamVjdCB0byBwYXNzXVxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgdmFyIHNob3cgPSBmdW5jdGlvbiBzaG93KHRhcmdldE1vZGFsLCBjb25maWcpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGNvbmZpZyB8fCB7fTtcbiAgICBvcHRpb25zLnRhcmdldE1vZGFsID0gdGFyZ2V0TW9kYWw7XG5cbiAgICAvLyBDaGVja3MgaWYgbW9kYWxzIGFuZCB0cmlnZ2VycyBleGlzdCBpbiBkb21cbiAgICBpZiAob3B0aW9ucy5kZWJ1Z01vZGUgPT09IHRydWUgJiYgdmFsaWRhdGVNb2RhbFByZXNlbmNlKHRhcmdldE1vZGFsKSA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgIC8vIHN0b3JlcyByZWZlcmVuY2UgdG8gYWN0aXZlIG1vZGFsXG4gICAgYWN0aXZlTW9kYWwgPSBuZXcgTW9kYWwob3B0aW9ucyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgYWN0aXZlTW9kYWwuc2hvd01vZGFsKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgYWN0aXZlIG1vZGFsXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICB2YXIgY2xvc2UgPSBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBhY3RpdmVNb2RhbC5jbG9zZU1vZGFsKCk7XG4gIH07XG5cbiAgcmV0dXJuIHsgaW5pdDogaW5pdCwgc2hvdzogc2hvdywgY2xvc2U6IGNsb3NlIH07XG59KCk7XG5cbnJldHVybiBNaWNyb01vZGFsO1xuXG59KSkpO1xuIiwiLyohXG4gKiBQaWthZGF5XG4gKlxuICogQ29weXJpZ2h0IMKpIDIwMTQgRGF2aWQgQnVzaGVsbCB8IEJTRCAmIE1JVCBsaWNlbnNlIHwgaHR0cHM6Ly9naXRodWIuY29tL2RidXNoZWxsL1Bpa2FkYXlcbiAqL1xuXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpXG57XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIG1vbWVudDtcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIENvbW1vbkpTIG1vZHVsZVxuICAgICAgICAvLyBMb2FkIG1vbWVudC5qcyBhcyBhbiBvcHRpb25hbCBkZXBlbmRlbmN5XG4gICAgICAgIHRyeSB7IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpOyB9IGNhdGNoIChlKSB7fVxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkobW9tZW50KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAocmVxKVxuICAgICAgICB7XG4gICAgICAgICAgICAvLyBMb2FkIG1vbWVudC5qcyBhcyBhbiBvcHRpb25hbCBkZXBlbmRlbmN5XG4gICAgICAgICAgICB2YXIgaWQgPSAnbW9tZW50JztcbiAgICAgICAgICAgIHRyeSB7IG1vbWVudCA9IHJlcShpZCk7IH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeShtb21lbnQpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LlBpa2FkYXkgPSBmYWN0b3J5KHJvb3QubW9tZW50KTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIChtb21lbnQpXG57XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqXG4gICAgICogZmVhdHVyZSBkZXRlY3Rpb24gYW5kIGhlbHBlciBmdW5jdGlvbnNcbiAgICAgKi9cbiAgICB2YXIgaGFzTW9tZW50ID0gdHlwZW9mIG1vbWVudCA9PT0gJ2Z1bmN0aW9uJyxcblxuICAgIGhhc0V2ZW50TGlzdGVuZXJzID0gISF3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcixcblxuICAgIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuXG4gICAgc3RvID0gd2luZG93LnNldFRpbWVvdXQsXG5cbiAgICBhZGRFdmVudCA9IGZ1bmN0aW9uKGVsLCBlLCBjYWxsYmFjaywgY2FwdHVyZSlcbiAgICB7XG4gICAgICAgIGlmIChoYXNFdmVudExpc3RlbmVycykge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihlLCBjYWxsYmFjaywgISFjYXB0dXJlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLmF0dGFjaEV2ZW50KCdvbicgKyBlLCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVtb3ZlRXZlbnQgPSBmdW5jdGlvbihlbCwgZSwgY2FsbGJhY2ssIGNhcHR1cmUpXG4gICAge1xuICAgICAgICBpZiAoaGFzRXZlbnRMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZSwgY2FsbGJhY2ssICEhY2FwdHVyZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5kZXRhY2hFdmVudCgnb24nICsgZSwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRyaW0gPSBmdW5jdGlvbihzdHIpXG4gICAge1xuICAgICAgICByZXR1cm4gc3RyLnRyaW0gPyBzdHIudHJpbSgpIDogc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csJycpO1xuICAgIH0sXG5cbiAgICBoYXNDbGFzcyA9IGZ1bmN0aW9uKGVsLCBjbilcbiAgICB7XG4gICAgICAgIHJldHVybiAoJyAnICsgZWwuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCcgJyArIGNuICsgJyAnKSAhPT0gLTE7XG4gICAgfSxcblxuICAgIGFkZENsYXNzID0gZnVuY3Rpb24oZWwsIGNuKVxuICAgIHtcbiAgICAgICAgaWYgKCFoYXNDbGFzcyhlbCwgY24pKSB7XG4gICAgICAgICAgICBlbC5jbGFzc05hbWUgPSAoZWwuY2xhc3NOYW1lID09PSAnJykgPyBjbiA6IGVsLmNsYXNzTmFtZSArICcgJyArIGNuO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZWwsIGNuKVxuICAgIHtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gdHJpbSgoJyAnICsgZWwuY2xhc3NOYW1lICsgJyAnKS5yZXBsYWNlKCcgJyArIGNuICsgJyAnLCAnICcpKTtcbiAgICB9LFxuXG4gICAgaXNBcnJheSA9IGZ1bmN0aW9uKG9iailcbiAgICB7XG4gICAgICAgIHJldHVybiAoL0FycmF5LykudGVzdChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSk7XG4gICAgfSxcblxuICAgIGlzRGF0ZSA9IGZ1bmN0aW9uKG9iailcbiAgICB7XG4gICAgICAgIHJldHVybiAoL0RhdGUvKS50ZXN0KE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopKSAmJiAhaXNOYU4ob2JqLmdldFRpbWUoKSk7XG4gICAgfSxcblxuICAgIGlzV2Vla2VuZCA9IGZ1bmN0aW9uKGRhdGUpXG4gICAge1xuICAgICAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXkoKTtcbiAgICAgICAgcmV0dXJuIGRheSA9PT0gMCB8fCBkYXkgPT09IDY7XG4gICAgfSxcblxuICAgIGlzTGVhcFllYXIgPSBmdW5jdGlvbih5ZWFyKVxuICAgIHtcbiAgICAgICAgLy8gc29sdXRpb24gYnkgTWF0dGkgVmlya2t1bmVuOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80ODgxOTUxXG4gICAgICAgIHJldHVybiB5ZWFyICUgNCA9PT0gMCAmJiB5ZWFyICUgMTAwICE9PSAwIHx8IHllYXIgJSA0MDAgPT09IDA7XG4gICAgfSxcblxuICAgIGdldERheXNJbk1vbnRoID0gZnVuY3Rpb24oeWVhciwgbW9udGgpXG4gICAge1xuICAgICAgICByZXR1cm4gWzMxLCBpc0xlYXBZZWFyKHllYXIpID8gMjkgOiAyOCwgMzEsIDMwLCAzMSwgMzAsIDMxLCAzMSwgMzAsIDMxLCAzMCwgMzFdW21vbnRoXTtcbiAgICB9LFxuXG4gICAgc2V0VG9TdGFydE9mRGF5ID0gZnVuY3Rpb24oZGF0ZSlcbiAgICB7XG4gICAgICAgIGlmIChpc0RhdGUoZGF0ZSkpIGRhdGUuc2V0SG91cnMoMCwwLDAsMCk7XG4gICAgfSxcblxuICAgIGNvbXBhcmVEYXRlcyA9IGZ1bmN0aW9uKGEsYilcbiAgICB7XG4gICAgICAgIC8vIHdlYWsgZGF0ZSBjb21wYXJpc29uICh1c2Ugc2V0VG9TdGFydE9mRGF5KGRhdGUpIHRvIGVuc3VyZSBjb3JyZWN0IHJlc3VsdClcbiAgICAgICAgcmV0dXJuIGEuZ2V0VGltZSgpID09PSBiLmdldFRpbWUoKTtcbiAgICB9LFxuXG4gICAgZXh0ZW5kID0gZnVuY3Rpb24odG8sIGZyb20sIG92ZXJ3cml0ZSlcbiAgICB7XG4gICAgICAgIHZhciBwcm9wLCBoYXNQcm9wO1xuICAgICAgICBmb3IgKHByb3AgaW4gZnJvbSkge1xuICAgICAgICAgICAgaGFzUHJvcCA9IHRvW3Byb3BdICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoaGFzUHJvcCAmJiB0eXBlb2YgZnJvbVtwcm9wXSA9PT0gJ29iamVjdCcgJiYgZnJvbVtwcm9wXSAhPT0gbnVsbCAmJiBmcm9tW3Byb3BdLm5vZGVOYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNEYXRlKGZyb21bcHJvcF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdmVyd3JpdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvW3Byb3BdID0gbmV3IERhdGUoZnJvbVtwcm9wXS5nZXRUaW1lKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzQXJyYXkoZnJvbVtwcm9wXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJ3cml0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9bcHJvcF0gPSBmcm9tW3Byb3BdLnNsaWNlKDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG9bcHJvcF0gPSBleHRlbmQoe30sIGZyb21bcHJvcF0sIG92ZXJ3cml0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChvdmVyd3JpdGUgfHwgIWhhc1Byb3ApIHtcbiAgICAgICAgICAgICAgICB0b1twcm9wXSA9IGZyb21bcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH0sXG5cbiAgICBmaXJlRXZlbnQgPSBmdW5jdGlvbihlbCwgZXZlbnROYW1lLCBkYXRhKVxuICAgIHtcbiAgICAgICAgdmFyIGV2O1xuXG4gICAgICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCkge1xuICAgICAgICAgICAgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xuICAgICAgICAgICAgZXYuaW5pdEV2ZW50KGV2ZW50TmFtZSwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgZXYgPSBleHRlbmQoZXYsIGRhdGEpO1xuICAgICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChldik7XG4gICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QpIHtcbiAgICAgICAgICAgIGV2ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgICAgICAgICAgIGV2ID0gZXh0ZW5kKGV2LCBkYXRhKTtcbiAgICAgICAgICAgIGVsLmZpcmVFdmVudCgnb24nICsgZXZlbnROYW1lLCBldik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYWRqdXN0Q2FsZW5kYXIgPSBmdW5jdGlvbihjYWxlbmRhcikge1xuICAgICAgICBpZiAoY2FsZW5kYXIubW9udGggPCAwKSB7XG4gICAgICAgICAgICBjYWxlbmRhci55ZWFyIC09IE1hdGguY2VpbChNYXRoLmFicyhjYWxlbmRhci5tb250aCkvMTIpO1xuICAgICAgICAgICAgY2FsZW5kYXIubW9udGggKz0gMTI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhbGVuZGFyLm1vbnRoID4gMTEpIHtcbiAgICAgICAgICAgIGNhbGVuZGFyLnllYXIgKz0gTWF0aC5mbG9vcihNYXRoLmFicyhjYWxlbmRhci5tb250aCkvMTIpO1xuICAgICAgICAgICAgY2FsZW5kYXIubW9udGggLT0gMTI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhbGVuZGFyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBkZWZhdWx0cyBhbmQgbG9jYWxpc2F0aW9uXG4gICAgICovXG4gICAgZGVmYXVsdHMgPSB7XG5cbiAgICAgICAgLy8gYmluZCB0aGUgcGlja2VyIHRvIGEgZm9ybSBmaWVsZFxuICAgICAgICBmaWVsZDogbnVsbCxcblxuICAgICAgICAvLyBhdXRvbWF0aWNhbGx5IHNob3cvaGlkZSB0aGUgcGlja2VyIG9uIGBmaWVsZGAgZm9jdXMgKGRlZmF1bHQgYHRydWVgIGlmIGBmaWVsZGAgaXMgc2V0KVxuICAgICAgICBib3VuZDogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8vIHBvc2l0aW9uIG9mIHRoZSBkYXRlcGlja2VyLCByZWxhdGl2ZSB0byB0aGUgZmllbGQgKGRlZmF1bHQgdG8gYm90dG9tICYgbGVmdClcbiAgICAgICAgLy8gKCdib3R0b20nICYgJ2xlZnQnIGtleXdvcmRzIGFyZSBub3QgdXNlZCwgJ3RvcCcgJiAncmlnaHQnIGFyZSBtb2RpZmllciBvbiB0aGUgYm90dG9tL2xlZnQgcG9zaXRpb24pXG4gICAgICAgIHBvc2l0aW9uOiAnYm90dG9tIGxlZnQnLFxuXG4gICAgICAgIC8vIGF1dG9tYXRpY2FsbHkgZml0IGluIHRoZSB2aWV3cG9ydCBldmVuIGlmIGl0IG1lYW5zIHJlcG9zaXRpb25pbmcgZnJvbSB0aGUgcG9zaXRpb24gb3B0aW9uXG4gICAgICAgIHJlcG9zaXRpb246IHRydWUsXG5cbiAgICAgICAgLy8gdGhlIGRlZmF1bHQgb3V0cHV0IGZvcm1hdCBmb3IgYC50b1N0cmluZygpYCBhbmQgYGZpZWxkYCB2YWx1ZVxuICAgICAgICBmb3JtYXQ6ICdZWVlZLU1NLUREJyxcblxuICAgICAgICAvLyB0aGUgdG9TdHJpbmcgZnVuY3Rpb24gd2hpY2ggZ2V0cyBwYXNzZWQgYSBjdXJyZW50IGRhdGUgb2JqZWN0IGFuZCBmb3JtYXRcbiAgICAgICAgLy8gYW5kIHJldHVybnMgYSBzdHJpbmdcbiAgICAgICAgdG9TdHJpbmc6IG51bGwsXG5cbiAgICAgICAgLy8gdXNlZCB0byBjcmVhdGUgZGF0ZSBvYmplY3QgZnJvbSBjdXJyZW50IGlucHV0IHN0cmluZ1xuICAgICAgICBwYXJzZTogbnVsbCxcblxuICAgICAgICAvLyB0aGUgaW5pdGlhbCBkYXRlIHRvIHZpZXcgd2hlbiBmaXJzdCBvcGVuZWRcbiAgICAgICAgZGVmYXVsdERhdGU6IG51bGwsXG5cbiAgICAgICAgLy8gbWFrZSB0aGUgYGRlZmF1bHREYXRlYCB0aGUgaW5pdGlhbCBzZWxlY3RlZCB2YWx1ZVxuICAgICAgICBzZXREZWZhdWx0RGF0ZTogZmFsc2UsXG5cbiAgICAgICAgLy8gZmlyc3QgZGF5IG9mIHdlZWsgKDA6IFN1bmRheSwgMTogTW9uZGF5IGV0YylcbiAgICAgICAgZmlyc3REYXk6IDAsXG5cbiAgICAgICAgLy8gdGhlIGRlZmF1bHQgZmxhZyBmb3IgbW9tZW50J3Mgc3RyaWN0IGRhdGUgcGFyc2luZ1xuICAgICAgICBmb3JtYXRTdHJpY3Q6IGZhbHNlLFxuXG4gICAgICAgIC8vIHRoZSBtaW5pbXVtL2VhcmxpZXN0IGRhdGUgdGhhdCBjYW4gYmUgc2VsZWN0ZWRcbiAgICAgICAgbWluRGF0ZTogbnVsbCxcbiAgICAgICAgLy8gdGhlIG1heGltdW0vbGF0ZXN0IGRhdGUgdGhhdCBjYW4gYmUgc2VsZWN0ZWRcbiAgICAgICAgbWF4RGF0ZTogbnVsbCxcblxuICAgICAgICAvLyBudW1iZXIgb2YgeWVhcnMgZWl0aGVyIHNpZGUsIG9yIGFycmF5IG9mIHVwcGVyL2xvd2VyIHJhbmdlXG4gICAgICAgIHllYXJSYW5nZTogMTAsXG5cbiAgICAgICAgLy8gc2hvdyB3ZWVrIG51bWJlcnMgYXQgaGVhZCBvZiByb3dcbiAgICAgICAgc2hvd1dlZWtOdW1iZXI6IGZhbHNlLFxuXG4gICAgICAgIC8vIFdlZWsgcGlja2VyIG1vZGVcbiAgICAgICAgcGlja1dob2xlV2VlazogZmFsc2UsXG5cbiAgICAgICAgLy8gdXNlZCBpbnRlcm5hbGx5IChkb24ndCBjb25maWcgb3V0c2lkZSlcbiAgICAgICAgbWluWWVhcjogMCxcbiAgICAgICAgbWF4WWVhcjogOTk5OSxcbiAgICAgICAgbWluTW9udGg6IHVuZGVmaW5lZCxcbiAgICAgICAgbWF4TW9udGg6IHVuZGVmaW5lZCxcblxuICAgICAgICBzdGFydFJhbmdlOiBudWxsLFxuICAgICAgICBlbmRSYW5nZTogbnVsbCxcblxuICAgICAgICBpc1JUTDogZmFsc2UsXG5cbiAgICAgICAgLy8gQWRkaXRpb25hbCB0ZXh0IHRvIGFwcGVuZCB0byB0aGUgeWVhciBpbiB0aGUgY2FsZW5kYXIgdGl0bGVcbiAgICAgICAgeWVhclN1ZmZpeDogJycsXG5cbiAgICAgICAgLy8gUmVuZGVyIHRoZSBtb250aCBhZnRlciB5ZWFyIGluIHRoZSBjYWxlbmRhciB0aXRsZVxuICAgICAgICBzaG93TW9udGhBZnRlclllYXI6IGZhbHNlLFxuXG4gICAgICAgIC8vIFJlbmRlciBkYXlzIG9mIHRoZSBjYWxlbmRhciBncmlkIHRoYXQgZmFsbCBpbiB0aGUgbmV4dCBvciBwcmV2aW91cyBtb250aFxuICAgICAgICBzaG93RGF5c0luTmV4dEFuZFByZXZpb3VzTW9udGhzOiBmYWxzZSxcblxuICAgICAgICAvLyBBbGxvd3MgdXNlciB0byBzZWxlY3QgZGF5cyB0aGF0IGZhbGwgaW4gdGhlIG5leHQgb3IgcHJldmlvdXMgbW9udGhcbiAgICAgICAgZW5hYmxlU2VsZWN0aW9uRGF5c0luTmV4dEFuZFByZXZpb3VzTW9udGhzOiBmYWxzZSxcblxuICAgICAgICAvLyBob3cgbWFueSBtb250aHMgYXJlIHZpc2libGVcbiAgICAgICAgbnVtYmVyT2ZNb250aHM6IDEsXG5cbiAgICAgICAgLy8gd2hlbiBudW1iZXJPZk1vbnRocyBpcyB1c2VkLCB0aGlzIHdpbGwgaGVscCB5b3UgdG8gY2hvb3NlIHdoZXJlIHRoZSBtYWluIGNhbGVuZGFyIHdpbGwgYmUgKGRlZmF1bHQgYGxlZnRgLCBjYW4gYmUgc2V0IHRvIGByaWdodGApXG4gICAgICAgIC8vIG9ubHkgdXNlZCBmb3IgdGhlIGZpcnN0IGRpc3BsYXkgb3Igd2hlbiBhIHNlbGVjdGVkIGRhdGUgaXMgbm90IHZpc2libGVcbiAgICAgICAgbWFpbkNhbGVuZGFyOiAnbGVmdCcsXG5cbiAgICAgICAgLy8gU3BlY2lmeSBhIERPTSBlbGVtZW50IHRvIHJlbmRlciB0aGUgY2FsZW5kYXIgaW5cbiAgICAgICAgY29udGFpbmVyOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLy8gQmx1ciBmaWVsZCB3aGVuIGRhdGUgaXMgc2VsZWN0ZWRcbiAgICAgICAgYmx1ckZpZWxkT25TZWxlY3QgOiB0cnVlLFxuXG4gICAgICAgIC8vIGludGVybmF0aW9uYWxpemF0aW9uXG4gICAgICAgIGkxOG46IHtcbiAgICAgICAgICAgIHByZXZpb3VzTW9udGggOiAnUHJldmlvdXMgTW9udGgnLFxuICAgICAgICAgICAgbmV4dE1vbnRoICAgICA6ICdOZXh0IE1vbnRoJyxcbiAgICAgICAgICAgIG1vbnRocyAgICAgICAgOiBbJ0phbnVhcnknLCdGZWJydWFyeScsJ01hcmNoJywnQXByaWwnLCdNYXknLCdKdW5lJywnSnVseScsJ0F1Z3VzdCcsJ1NlcHRlbWJlcicsJ09jdG9iZXInLCdOb3ZlbWJlcicsJ0RlY2VtYmVyJ10sXG4gICAgICAgICAgICB3ZWVrZGF5cyAgICAgIDogWydTdW5kYXknLCdNb25kYXknLCdUdWVzZGF5JywnV2VkbmVzZGF5JywnVGh1cnNkYXknLCdGcmlkYXknLCdTYXR1cmRheSddLFxuICAgICAgICAgICAgd2Vla2RheXNTaG9ydCA6IFsnU3VuJywnTW9uJywnVHVlJywnV2VkJywnVGh1JywnRnJpJywnU2F0J11cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUaGVtZSBDbGFzc25hbWVcbiAgICAgICAgdGhlbWU6IG51bGwsXG5cbiAgICAgICAgLy8gZXZlbnRzIGFycmF5XG4gICAgICAgIGV2ZW50czogW10sXG5cbiAgICAgICAgLy8gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgICAgb25TZWxlY3Q6IG51bGwsXG4gICAgICAgIG9uT3BlbjogbnVsbCxcbiAgICAgICAgb25DbG9zZTogbnVsbCxcbiAgICAgICAgb25EcmF3OiBudWxsLFxuXG4gICAgICAgIC8vIEVuYWJsZSBrZXlib2FyZCBpbnB1dFxuICAgICAgICBrZXlib2FyZElucHV0OiB0cnVlXG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogdGVtcGxhdGluZyBmdW5jdGlvbnMgdG8gYWJzdHJhY3QgSFRNTCByZW5kZXJpbmdcbiAgICAgKi9cbiAgICByZW5kZXJEYXlOYW1lID0gZnVuY3Rpb24ob3B0cywgZGF5LCBhYmJyKVxuICAgIHtcbiAgICAgICAgZGF5ICs9IG9wdHMuZmlyc3REYXk7XG4gICAgICAgIHdoaWxlIChkYXkgPj0gNykge1xuICAgICAgICAgICAgZGF5IC09IDc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFiYnIgPyBvcHRzLmkxOG4ud2Vla2RheXNTaG9ydFtkYXldIDogb3B0cy5pMThuLndlZWtkYXlzW2RheV07XG4gICAgfSxcblxuICAgIHJlbmRlckRheSA9IGZ1bmN0aW9uKG9wdHMpXG4gICAge1xuICAgICAgICB2YXIgYXJyID0gW107XG4gICAgICAgIHZhciBhcmlhU2VsZWN0ZWQgPSAnZmFsc2UnO1xuICAgICAgICBpZiAob3B0cy5pc0VtcHR5KSB7XG4gICAgICAgICAgICBpZiAob3B0cy5zaG93RGF5c0luTmV4dEFuZFByZXZpb3VzTW9udGhzKSB7XG4gICAgICAgICAgICAgICAgYXJyLnB1c2goJ2lzLW91dHNpZGUtY3VycmVudC1tb250aCcpO1xuXG4gICAgICAgICAgICAgICAgaWYoIW9wdHMuZW5hYmxlU2VsZWN0aW9uRGF5c0luTmV4dEFuZFByZXZpb3VzTW9udGhzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKCdpcy1zZWxlY3Rpb24tZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICc8dGQgY2xhc3M9XCJpcy1lbXB0eVwiPjwvdGQ+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0cy5pc0Rpc2FibGVkKSB7XG4gICAgICAgICAgICBhcnIucHVzaCgnaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0cy5pc1RvZGF5KSB7XG4gICAgICAgICAgICBhcnIucHVzaCgnaXMtdG9kYXknKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0cy5pc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICBhcnIucHVzaCgnaXMtc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgIGFyaWFTZWxlY3RlZCA9ICd0cnVlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0cy5oYXNFdmVudCkge1xuICAgICAgICAgICAgYXJyLnB1c2goJ2hhcy1ldmVudCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRzLmlzSW5SYW5nZSkge1xuICAgICAgICAgICAgYXJyLnB1c2goJ2lzLWlucmFuZ2UnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0cy5pc1N0YXJ0UmFuZ2UpIHtcbiAgICAgICAgICAgIGFyci5wdXNoKCdpcy1zdGFydHJhbmdlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdHMuaXNFbmRSYW5nZSkge1xuICAgICAgICAgICAgYXJyLnB1c2goJ2lzLWVuZHJhbmdlJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICc8dGQgZGF0YS1kYXk9XCInICsgb3B0cy5kYXkgKyAnXCIgY2xhc3M9XCInICsgYXJyLmpvaW4oJyAnKSArICdcIiBhcmlhLXNlbGVjdGVkPVwiJyArIGFyaWFTZWxlY3RlZCArICdcIj4nICtcbiAgICAgICAgICAgICAgICAgJzxidXR0b24gY2xhc3M9XCJwaWthLWJ1dHRvbiBwaWthLWRheVwiIHR5cGU9XCJidXR0b25cIiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2RhdGEtcGlrYS15ZWFyPVwiJyArIG9wdHMueWVhciArICdcIiBkYXRhLXBpa2EtbW9udGg9XCInICsgb3B0cy5tb250aCArICdcIiBkYXRhLXBpa2EtZGF5PVwiJyArIG9wdHMuZGF5ICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kYXkgK1xuICAgICAgICAgICAgICAgICAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAnPC90ZD4nO1xuICAgIH0sXG5cbiAgICByZW5kZXJXZWVrID0gZnVuY3Rpb24gKGQsIG0sIHkpIHtcbiAgICAgICAgLy8gTGlmdGVkIGZyb20gaHR0cDovL2phdmFzY3JpcHQuYWJvdXQuY29tL2xpYnJhcnkvYmx3ZWVreWVhci5odG0sIGxpZ2h0bHkgbW9kaWZpZWQuXG4gICAgICAgIHZhciBvbmVqYW4gPSBuZXcgRGF0ZSh5LCAwLCAxKSxcbiAgICAgICAgICAgIHdlZWtOdW0gPSBNYXRoLmNlaWwoKCgobmV3IERhdGUoeSwgbSwgZCkgLSBvbmVqYW4pIC8gODY0MDAwMDApICsgb25lamFuLmdldERheSgpKzEpLzcpO1xuICAgICAgICByZXR1cm4gJzx0ZCBjbGFzcz1cInBpa2Etd2Vla1wiPicgKyB3ZWVrTnVtICsgJzwvdGQ+JztcbiAgICB9LFxuXG4gICAgcmVuZGVyUm93ID0gZnVuY3Rpb24oZGF5cywgaXNSVEwsIHBpY2tXaG9sZVdlZWssIGlzUm93U2VsZWN0ZWQpXG4gICAge1xuICAgICAgICByZXR1cm4gJzx0ciBjbGFzcz1cInBpa2Etcm93JyArIChwaWNrV2hvbGVXZWVrID8gJyBwaWNrLXdob2xlLXdlZWsnIDogJycpICsgKGlzUm93U2VsZWN0ZWQgPyAnIGlzLXNlbGVjdGVkJyA6ICcnKSArICdcIj4nICsgKGlzUlRMID8gZGF5cy5yZXZlcnNlKCkgOiBkYXlzKS5qb2luKCcnKSArICc8L3RyPic7XG4gICAgfSxcblxuICAgIHJlbmRlckJvZHkgPSBmdW5jdGlvbihyb3dzKVxuICAgIHtcbiAgICAgICAgcmV0dXJuICc8dGJvZHk+JyArIHJvd3Muam9pbignJykgKyAnPC90Ym9keT4nO1xuICAgIH0sXG5cbiAgICByZW5kZXJIZWFkID0gZnVuY3Rpb24ob3B0cylcbiAgICB7XG4gICAgICAgIHZhciBpLCBhcnIgPSBbXTtcbiAgICAgICAgaWYgKG9wdHMuc2hvd1dlZWtOdW1iZXIpIHtcbiAgICAgICAgICAgIGFyci5wdXNoKCc8dGg+PC90aD4nKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICBhcnIucHVzaCgnPHRoIHNjb3BlPVwiY29sXCI+PGFiYnIgdGl0bGU9XCInICsgcmVuZGVyRGF5TmFtZShvcHRzLCBpKSArICdcIj4nICsgcmVuZGVyRGF5TmFtZShvcHRzLCBpLCB0cnVlKSArICc8L2FiYnI+PC90aD4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJzx0aGVhZD48dHI+JyArIChvcHRzLmlzUlRMID8gYXJyLnJldmVyc2UoKSA6IGFycikuam9pbignJykgKyAnPC90cj48L3RoZWFkPic7XG4gICAgfSxcblxuICAgIHJlbmRlclRpdGxlID0gZnVuY3Rpb24oaW5zdGFuY2UsIGMsIHllYXIsIG1vbnRoLCByZWZZZWFyLCByYW5kSWQpXG4gICAge1xuICAgICAgICB2YXIgaSwgaiwgYXJyLFxuICAgICAgICAgICAgb3B0cyA9IGluc3RhbmNlLl9vLFxuICAgICAgICAgICAgaXNNaW5ZZWFyID0geWVhciA9PT0gb3B0cy5taW5ZZWFyLFxuICAgICAgICAgICAgaXNNYXhZZWFyID0geWVhciA9PT0gb3B0cy5tYXhZZWFyLFxuICAgICAgICAgICAgaHRtbCA9ICc8ZGl2IGlkPVwiJyArIHJhbmRJZCArICdcIiBjbGFzcz1cInBpa2EtdGl0bGVcIiByb2xlPVwiaGVhZGluZ1wiIGFyaWEtbGl2ZT1cImFzc2VydGl2ZVwiPicsXG4gICAgICAgICAgICBtb250aEh0bWwsXG4gICAgICAgICAgICB5ZWFySHRtbCxcbiAgICAgICAgICAgIHByZXYgPSB0cnVlLFxuICAgICAgICAgICAgbmV4dCA9IHRydWU7XG5cbiAgICAgICAgZm9yIChhcnIgPSBbXSwgaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICBhcnIucHVzaCgnPG9wdGlvbiB2YWx1ZT1cIicgKyAoeWVhciA9PT0gcmVmWWVhciA/IGkgLSBjIDogMTIgKyBpIC0gYykgKyAnXCInICtcbiAgICAgICAgICAgICAgICAoaSA9PT0gbW9udGggPyAnIHNlbGVjdGVkPVwic2VsZWN0ZWRcIic6ICcnKSArXG4gICAgICAgICAgICAgICAgKChpc01pblllYXIgJiYgaSA8IG9wdHMubWluTW9udGgpIHx8IChpc01heFllYXIgJiYgaSA+IG9wdHMubWF4TW9udGgpID8gJ2Rpc2FibGVkPVwiZGlzYWJsZWRcIicgOiAnJykgKyAnPicgK1xuICAgICAgICAgICAgICAgIG9wdHMuaTE4bi5tb250aHNbaV0gKyAnPC9vcHRpb24+Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBtb250aEh0bWwgPSAnPGRpdiBjbGFzcz1cInBpa2EtbGFiZWxcIj4nICsgb3B0cy5pMThuLm1vbnRoc1ttb250aF0gKyAnPHNlbGVjdCBjbGFzcz1cInBpa2Etc2VsZWN0IHBpa2Etc2VsZWN0LW1vbnRoXCIgdGFiaW5kZXg9XCItMVwiPicgKyBhcnIuam9pbignJykgKyAnPC9zZWxlY3Q+PC9kaXY+JztcblxuICAgICAgICBpZiAoaXNBcnJheShvcHRzLnllYXJSYW5nZSkpIHtcbiAgICAgICAgICAgIGkgPSBvcHRzLnllYXJSYW5nZVswXTtcbiAgICAgICAgICAgIGogPSBvcHRzLnllYXJSYW5nZVsxXSArIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpID0geWVhciAtIG9wdHMueWVhclJhbmdlO1xuICAgICAgICAgICAgaiA9IDEgKyB5ZWFyICsgb3B0cy55ZWFyUmFuZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGFyciA9IFtdOyBpIDwgaiAmJiBpIDw9IG9wdHMubWF4WWVhcjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSA+PSBvcHRzLm1pblllYXIpIHtcbiAgICAgICAgICAgICAgICBhcnIucHVzaCgnPG9wdGlvbiB2YWx1ZT1cIicgKyBpICsgJ1wiJyArIChpID09PSB5ZWFyID8gJyBzZWxlY3RlZD1cInNlbGVjdGVkXCInOiAnJykgKyAnPicgKyAoaSkgKyAnPC9vcHRpb24+Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgeWVhckh0bWwgPSAnPGRpdiBjbGFzcz1cInBpa2EtbGFiZWxcIj4nICsgeWVhciArIG9wdHMueWVhclN1ZmZpeCArICc8c2VsZWN0IGNsYXNzPVwicGlrYS1zZWxlY3QgcGlrYS1zZWxlY3QteWVhclwiIHRhYmluZGV4PVwiLTFcIj4nICsgYXJyLmpvaW4oJycpICsgJzwvc2VsZWN0PjwvZGl2Pic7XG5cbiAgICAgICAgaWYgKG9wdHMuc2hvd01vbnRoQWZ0ZXJZZWFyKSB7XG4gICAgICAgICAgICBodG1sICs9IHllYXJIdG1sICsgbW9udGhIdG1sO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaHRtbCArPSBtb250aEh0bWwgKyB5ZWFySHRtbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc01pblllYXIgJiYgKG1vbnRoID09PSAwIHx8IG9wdHMubWluTW9udGggPj0gbW9udGgpKSB7XG4gICAgICAgICAgICBwcmV2ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNNYXhZZWFyICYmIChtb250aCA9PT0gMTEgfHwgb3B0cy5tYXhNb250aCA8PSBtb250aCkpIHtcbiAgICAgICAgICAgIG5leHQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjID09PSAwKSB7XG4gICAgICAgICAgICBodG1sICs9ICc8YnV0dG9uIGNsYXNzPVwicGlrYS1wcmV2JyArIChwcmV2ID8gJycgOiAnIGlzLWRpc2FibGVkJykgKyAnXCIgdHlwZT1cImJ1dHRvblwiPicgKyBvcHRzLmkxOG4ucHJldmlvdXNNb250aCArICc8L2J1dHRvbj4nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjID09PSAoaW5zdGFuY2UuX28ubnVtYmVyT2ZNb250aHMgLSAxKSApIHtcbiAgICAgICAgICAgIGh0bWwgKz0gJzxidXR0b24gY2xhc3M9XCJwaWthLW5leHQnICsgKG5leHQgPyAnJyA6ICcgaXMtZGlzYWJsZWQnKSArICdcIiB0eXBlPVwiYnV0dG9uXCI+JyArIG9wdHMuaTE4bi5uZXh0TW9udGggKyAnPC9idXR0b24+JztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBodG1sICs9ICc8L2Rpdj4nO1xuICAgIH0sXG5cbiAgICByZW5kZXJUYWJsZSA9IGZ1bmN0aW9uKG9wdHMsIGRhdGEsIHJhbmRJZClcbiAgICB7XG4gICAgICAgIHJldHVybiAnPHRhYmxlIGNlbGxwYWRkaW5nPVwiMFwiIGNlbGxzcGFjaW5nPVwiMFwiIGNsYXNzPVwicGlrYS10YWJsZVwiIHJvbGU9XCJncmlkXCIgYXJpYS1sYWJlbGxlZGJ5PVwiJyArIHJhbmRJZCArICdcIj4nICsgcmVuZGVySGVhZChvcHRzKSArIHJlbmRlckJvZHkoZGF0YSkgKyAnPC90YWJsZT4nO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIFBpa2FkYXkgY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBQaWthZGF5ID0gZnVuY3Rpb24ob3B0aW9ucylcbiAgICB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIG9wdHMgPSBzZWxmLmNvbmZpZyhvcHRpb25zKTtcblxuICAgICAgICBzZWxmLl9vbk1vdXNlRG93biA9IGZ1bmN0aW9uKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICghc2VsZi5fdikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XG4gICAgICAgICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFoYXNDbGFzcyh0YXJnZXQsICdpcy1kaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhc0NsYXNzKHRhcmdldCwgJ3Bpa2EtYnV0dG9uJykgJiYgIWhhc0NsYXNzKHRhcmdldCwgJ2lzLWVtcHR5JykgJiYgIWhhc0NsYXNzKHRhcmdldC5wYXJlbnROb2RlLCAnaXMtZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldERhdGUobmV3IERhdGUodGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1waWthLXllYXInKSwgdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1waWthLW1vbnRoJyksIHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGlrYS1kYXknKSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5ib3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmJsdXJGaWVsZE9uU2VsZWN0ICYmIG9wdHMuZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5maWVsZC5ibHVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChoYXNDbGFzcyh0YXJnZXQsICdwaWthLXByZXYnKSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnByZXZNb250aCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChoYXNDbGFzcyh0YXJnZXQsICdwaWthLW5leHQnKSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm5leHRNb250aCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaGFzQ2xhc3ModGFyZ2V0LCAncGlrYS1zZWxlY3QnKSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgdG91Y2ggZXZlbnQgcHJldmVudCBtb3VzZSBldmVudHMgZW11bGF0aW9uXG4gICAgICAgICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fYyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5fb25DaGFuZ2UgPSBmdW5jdGlvbihlKVxuICAgICAgICB7XG4gICAgICAgICAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xuICAgICAgICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzQ2xhc3ModGFyZ2V0LCAncGlrYS1zZWxlY3QtbW9udGgnKSkge1xuICAgICAgICAgICAgICAgIHNlbGYuZ290b01vbnRoKHRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChoYXNDbGFzcyh0YXJnZXQsICdwaWthLXNlbGVjdC15ZWFyJykpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmdvdG9ZZWFyKHRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5fb25LZXlDaGFuZ2UgPSBmdW5jdGlvbihlKVxuICAgICAgICB7XG4gICAgICAgICAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLmlzVmlzaWJsZSgpKSB7XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2goZS5rZXlDb2RlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5maWVsZC5ibHVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzNzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWRqdXN0RGF0ZSgnc3VidHJhY3QnLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGp1c3REYXRlKCdzdWJ0cmFjdCcsIDcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMzk6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFkanVzdERhdGUoJ2FkZCcsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFkanVzdERhdGUoJ2FkZCcsIDcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuX29uSW5wdXRDaGFuZ2UgPSBmdW5jdGlvbihlKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgZGF0ZTtcblxuICAgICAgICAgICAgaWYgKGUuZmlyZWRCeSA9PT0gc2VsZikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRzLnBhcnNlKSB7XG4gICAgICAgICAgICAgICAgZGF0ZSA9IG9wdHMucGFyc2Uob3B0cy5maWVsZC52YWx1ZSwgb3B0cy5mb3JtYXQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNNb21lbnQpIHtcbiAgICAgICAgICAgICAgICBkYXRlID0gbW9tZW50KG9wdHMuZmllbGQudmFsdWUsIG9wdHMuZm9ybWF0LCBvcHRzLmZvcm1hdFN0cmljdCk7XG4gICAgICAgICAgICAgICAgZGF0ZSA9IChkYXRlICYmIGRhdGUuaXNWYWxpZCgpKSA/IGRhdGUudG9EYXRlKCkgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKERhdGUucGFyc2Uob3B0cy5maWVsZC52YWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzRGF0ZShkYXRlKSkge1xuICAgICAgICAgICAgICBzZWxmLnNldERhdGUoZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXNlbGYuX3YpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLl9vbklucHV0Rm9jdXMgPSBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNlbGYuc2hvdygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuX29uSW5wdXRDbGljayA9IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgc2VsZi5zaG93KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2VsZi5fb25JbnB1dEJsdXIgPSBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIElFIGFsbG93cyBwaWthIGRpdiB0byBnYWluIGZvY3VzOyBjYXRjaCBibHVyIHRoZSBpbnB1dCBmaWVsZFxuICAgICAgICAgICAgdmFyIHBFbCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGhhc0NsYXNzKHBFbCwgJ3Bpa2Etc2luZ2xlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlICgocEVsID0gcEVsLnBhcmVudE5vZGUpKTtcblxuICAgICAgICAgICAgaWYgKCFzZWxmLl9jKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fYiA9IHN0byhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5fYyA9IGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuX29uQ2xpY2sgPSBmdW5jdGlvbihlKVxuICAgICAgICB7XG4gICAgICAgICAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50LFxuICAgICAgICAgICAgICAgIHBFbCA9IHRhcmdldDtcbiAgICAgICAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFoYXNFdmVudExpc3RlbmVycyAmJiBoYXNDbGFzcyh0YXJnZXQsICdwaWthLXNlbGVjdCcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0YXJnZXQub25jaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgnb25jaGFuZ2UnLCAncmV0dXJuOycpO1xuICAgICAgICAgICAgICAgICAgICBhZGRFdmVudCh0YXJnZXQsICdjaGFuZ2UnLCBzZWxmLl9vbkNoYW5nZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGlmIChoYXNDbGFzcyhwRWwsICdwaWthLXNpbmdsZScpIHx8IHBFbCA9PT0gb3B0cy50cmlnZ2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAoKHBFbCA9IHBFbC5wYXJlbnROb2RlKSk7XG4gICAgICAgICAgICBpZiAoc2VsZi5fdiAmJiB0YXJnZXQgIT09IG9wdHMudHJpZ2dlciAmJiBwRWwgIT09IG9wdHMudHJpZ2dlcikge1xuICAgICAgICAgICAgICAgIHNlbGYuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc2VsZi5lbC5jbGFzc05hbWUgPSAncGlrYS1zaW5nbGUnICsgKG9wdHMuaXNSVEwgPyAnIGlzLXJ0bCcgOiAnJykgKyAob3B0cy50aGVtZSA/ICcgJyArIG9wdHMudGhlbWUgOiAnJyk7XG5cbiAgICAgICAgYWRkRXZlbnQoc2VsZi5lbCwgJ21vdXNlZG93bicsIHNlbGYuX29uTW91c2VEb3duLCB0cnVlKTtcbiAgICAgICAgYWRkRXZlbnQoc2VsZi5lbCwgJ3RvdWNoZW5kJywgc2VsZi5fb25Nb3VzZURvd24sIHRydWUpO1xuICAgICAgICBhZGRFdmVudChzZWxmLmVsLCAnY2hhbmdlJywgc2VsZi5fb25DaGFuZ2UpO1xuXG4gICAgICAgIGlmIChvcHRzLmtleWJvYXJkSW5wdXQpIHtcbiAgICAgICAgICAgIGFkZEV2ZW50KGRvY3VtZW50LCAna2V5ZG93bicsIHNlbGYuX29uS2V5Q2hhbmdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRzLmZpZWxkKSB7XG4gICAgICAgICAgICBpZiAob3B0cy5jb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICBvcHRzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWxmLmVsKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0cy5ib3VuZCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2VsZi5lbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wdHMuZmllbGQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc2VsZi5lbCwgb3B0cy5maWVsZC5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRFdmVudChvcHRzLmZpZWxkLCAnY2hhbmdlJywgc2VsZi5fb25JbnB1dENoYW5nZSk7XG5cbiAgICAgICAgICAgIGlmICghb3B0cy5kZWZhdWx0RGF0ZSkge1xuICAgICAgICAgICAgICAgIGlmIChoYXNNb21lbnQgJiYgb3B0cy5maWVsZC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRzLmRlZmF1bHREYXRlID0gbW9tZW50KG9wdHMuZmllbGQudmFsdWUsIG9wdHMuZm9ybWF0KS50b0RhdGUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvcHRzLmRlZmF1bHREYXRlID0gbmV3IERhdGUoRGF0ZS5wYXJzZShvcHRzLmZpZWxkLnZhbHVlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9wdHMuc2V0RGVmYXVsdERhdGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlZkRhdGUgPSBvcHRzLmRlZmF1bHREYXRlO1xuXG4gICAgICAgIGlmIChpc0RhdGUoZGVmRGF0ZSkpIHtcbiAgICAgICAgICAgIGlmIChvcHRzLnNldERlZmF1bHREYXRlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZXREYXRlKGRlZkRhdGUsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLmdvdG9EYXRlKGRlZkRhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5nb3RvRGF0ZShuZXcgRGF0ZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRzLmJvdW5kKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgIHNlbGYuZWwuY2xhc3NOYW1lICs9ICcgaXMtYm91bmQnO1xuICAgICAgICAgICAgYWRkRXZlbnQob3B0cy50cmlnZ2VyLCAnY2xpY2snLCBzZWxmLl9vbklucHV0Q2xpY2spO1xuICAgICAgICAgICAgYWRkRXZlbnQob3B0cy50cmlnZ2VyLCAnZm9jdXMnLCBzZWxmLl9vbklucHV0Rm9jdXMpO1xuICAgICAgICAgICAgYWRkRXZlbnQob3B0cy50cmlnZ2VyLCAnYmx1cicsIHNlbGYuX29uSW5wdXRCbHVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogcHVibGljIFBpa2FkYXkgQVBJXG4gICAgICovXG4gICAgUGlrYWRheS5wcm90b3R5cGUgPSB7XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogY29uZmlndXJlIGZ1bmN0aW9uYWxpdHlcbiAgICAgICAgICovXG4gICAgICAgIGNvbmZpZzogZnVuY3Rpb24ob3B0aW9ucylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9vKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbyA9IGV4dGVuZCh7fSwgZGVmYXVsdHMsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgb3B0cyA9IGV4dGVuZCh0aGlzLl9vLCBvcHRpb25zLCB0cnVlKTtcblxuICAgICAgICAgICAgb3B0cy5pc1JUTCA9ICEhb3B0cy5pc1JUTDtcblxuICAgICAgICAgICAgb3B0cy5maWVsZCA9IChvcHRzLmZpZWxkICYmIG9wdHMuZmllbGQubm9kZU5hbWUpID8gb3B0cy5maWVsZCA6IG51bGw7XG5cbiAgICAgICAgICAgIG9wdHMudGhlbWUgPSAodHlwZW9mIG9wdHMudGhlbWUpID09PSAnc3RyaW5nJyAmJiBvcHRzLnRoZW1lID8gb3B0cy50aGVtZSA6IG51bGw7XG5cbiAgICAgICAgICAgIG9wdHMuYm91bmQgPSAhIShvcHRzLmJvdW5kICE9PSB1bmRlZmluZWQgPyBvcHRzLmZpZWxkICYmIG9wdHMuYm91bmQgOiBvcHRzLmZpZWxkKTtcblxuICAgICAgICAgICAgb3B0cy50cmlnZ2VyID0gKG9wdHMudHJpZ2dlciAmJiBvcHRzLnRyaWdnZXIubm9kZU5hbWUpID8gb3B0cy50cmlnZ2VyIDogb3B0cy5maWVsZDtcblxuICAgICAgICAgICAgb3B0cy5kaXNhYmxlV2Vla2VuZHMgPSAhIW9wdHMuZGlzYWJsZVdlZWtlbmRzO1xuXG4gICAgICAgICAgICBvcHRzLmRpc2FibGVEYXlGbiA9ICh0eXBlb2Ygb3B0cy5kaXNhYmxlRGF5Rm4pID09PSAnZnVuY3Rpb24nID8gb3B0cy5kaXNhYmxlRGF5Rm4gOiBudWxsO1xuXG4gICAgICAgICAgICB2YXIgbm9tID0gcGFyc2VJbnQob3B0cy5udW1iZXJPZk1vbnRocywgMTApIHx8IDE7XG4gICAgICAgICAgICBvcHRzLm51bWJlck9mTW9udGhzID0gbm9tID4gNCA/IDQgOiBub207XG5cbiAgICAgICAgICAgIGlmICghaXNEYXRlKG9wdHMubWluRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBvcHRzLm1pbkRhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNEYXRlKG9wdHMubWF4RGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBvcHRzLm1heERhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgob3B0cy5taW5EYXRlICYmIG9wdHMubWF4RGF0ZSkgJiYgb3B0cy5tYXhEYXRlIDwgb3B0cy5taW5EYXRlKSB7XG4gICAgICAgICAgICAgICAgb3B0cy5tYXhEYXRlID0gb3B0cy5taW5EYXRlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0cy5taW5EYXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRNaW5EYXRlKG9wdHMubWluRGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0cy5tYXhEYXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRNYXhEYXRlKG9wdHMubWF4RGF0ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc0FycmF5KG9wdHMueWVhclJhbmdlKSkge1xuICAgICAgICAgICAgICAgIHZhciBmYWxsYmFjayA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSAtIDEwO1xuICAgICAgICAgICAgICAgIG9wdHMueWVhclJhbmdlWzBdID0gcGFyc2VJbnQob3B0cy55ZWFyUmFuZ2VbMF0sIDEwKSB8fCBmYWxsYmFjaztcbiAgICAgICAgICAgICAgICBvcHRzLnllYXJSYW5nZVsxXSA9IHBhcnNlSW50KG9wdHMueWVhclJhbmdlWzFdLCAxMCkgfHwgZmFsbGJhY2s7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wdHMueWVhclJhbmdlID0gTWF0aC5hYnMocGFyc2VJbnQob3B0cy55ZWFyUmFuZ2UsIDEwKSkgfHwgZGVmYXVsdHMueWVhclJhbmdlO1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLnllYXJSYW5nZSA+IDEwMCkge1xuICAgICAgICAgICAgICAgICAgICBvcHRzLnllYXJSYW5nZSA9IDEwMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBvcHRzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiByZXR1cm4gYSBmb3JtYXR0ZWQgc3RyaW5nIG9mIHRoZSBjdXJyZW50IHNlbGVjdGlvbiAodXNpbmcgTW9tZW50LmpzIGlmIGF2YWlsYWJsZSlcbiAgICAgICAgICovXG4gICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbihmb3JtYXQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCB0aGlzLl9vLmZvcm1hdDtcbiAgICAgICAgICAgIGlmICghaXNEYXRlKHRoaXMuX2QpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX28udG9TdHJpbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX28udG9TdHJpbmcodGhpcy5fZCwgZm9ybWF0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNNb21lbnQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1vbWVudCh0aGlzLl9kKS5mb3JtYXQoZm9ybWF0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kLnRvRGF0ZVN0cmluZygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiByZXR1cm4gYSBNb21lbnQuanMgb2JqZWN0IG9mIHRoZSBjdXJyZW50IHNlbGVjdGlvbiAoaWYgYXZhaWxhYmxlKVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0TW9tZW50OiBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBoYXNNb21lbnQgPyBtb21lbnQodGhpcy5fZCkgOiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzZXQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGZyb20gYSBNb21lbnQuanMgb2JqZWN0IChpZiBhdmFpbGFibGUpXG4gICAgICAgICAqL1xuICAgICAgICBzZXRNb21lbnQ6IGZ1bmN0aW9uKGRhdGUsIHByZXZlbnRPblNlbGVjdClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKGhhc01vbWVudCAmJiBtb21lbnQuaXNNb21lbnQoZGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGUoZGF0ZS50b0RhdGUoKSwgcHJldmVudE9uU2VsZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogcmV0dXJuIGEgRGF0ZSBvYmplY3Qgb2YgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBnZXREYXRlOiBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBpc0RhdGUodGhpcy5fZCkgPyBuZXcgRGF0ZSh0aGlzLl9kLmdldFRpbWUoKSkgOiBudWxsO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzZXQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBzZXREYXRlOiBmdW5jdGlvbihkYXRlLCBwcmV2ZW50T25TZWxlY3QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICghZGF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2QgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX28uZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fby5maWVsZC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBmaXJlRXZlbnQodGhpcy5fby5maWVsZCwgJ2NoYW5nZScsIHsgZmlyZWRCeTogdGhpcyB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kcmF3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKERhdGUucGFyc2UoZGF0ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc0RhdGUoZGF0ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtaW4gPSB0aGlzLl9vLm1pbkRhdGUsXG4gICAgICAgICAgICAgICAgbWF4ID0gdGhpcy5fby5tYXhEYXRlO1xuXG4gICAgICAgICAgICBpZiAoaXNEYXRlKG1pbikgJiYgZGF0ZSA8IG1pbikge1xuICAgICAgICAgICAgICAgIGRhdGUgPSBtaW47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzRGF0ZShtYXgpICYmIGRhdGUgPiBtYXgpIHtcbiAgICAgICAgICAgICAgICBkYXRlID0gbWF4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9kID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xuICAgICAgICAgICAgc2V0VG9TdGFydE9mRGF5KHRoaXMuX2QpO1xuICAgICAgICAgICAgdGhpcy5nb3RvRGF0ZSh0aGlzLl9kKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX28uZmllbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vLmZpZWxkLnZhbHVlID0gdGhpcy50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIGZpcmVFdmVudCh0aGlzLl9vLmZpZWxkLCAnY2hhbmdlJywgeyBmaXJlZEJ5OiB0aGlzIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFwcmV2ZW50T25TZWxlY3QgJiYgdHlwZW9mIHRoaXMuX28ub25TZWxlY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vLm9uU2VsZWN0LmNhbGwodGhpcywgdGhpcy5nZXREYXRlKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBjaGFuZ2UgdmlldyB0byBhIHNwZWNpZmljIGRhdGVcbiAgICAgICAgICovXG4gICAgICAgIGdvdG9EYXRlOiBmdW5jdGlvbihkYXRlKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbmV3Q2FsZW5kYXIgPSB0cnVlO1xuXG4gICAgICAgICAgICBpZiAoIWlzRGF0ZShkYXRlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuY2FsZW5kYXJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpcnN0VmlzaWJsZURhdGUgPSBuZXcgRGF0ZSh0aGlzLmNhbGVuZGFyc1swXS55ZWFyLCB0aGlzLmNhbGVuZGFyc1swXS5tb250aCwgMSksXG4gICAgICAgICAgICAgICAgICAgIGxhc3RWaXNpYmxlRGF0ZSA9IG5ldyBEYXRlKHRoaXMuY2FsZW5kYXJzW3RoaXMuY2FsZW5kYXJzLmxlbmd0aC0xXS55ZWFyLCB0aGlzLmNhbGVuZGFyc1t0aGlzLmNhbGVuZGFycy5sZW5ndGgtMV0ubW9udGgsIDEpLFxuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlRGF0ZSA9IGRhdGUuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgZW5kIG9mIHRoZSBtb250aFxuICAgICAgICAgICAgICAgIGxhc3RWaXNpYmxlRGF0ZS5zZXRNb250aChsYXN0VmlzaWJsZURhdGUuZ2V0TW9udGgoKSsxKTtcbiAgICAgICAgICAgICAgICBsYXN0VmlzaWJsZURhdGUuc2V0RGF0ZShsYXN0VmlzaWJsZURhdGUuZ2V0RGF0ZSgpLTEpO1xuICAgICAgICAgICAgICAgIG5ld0NhbGVuZGFyID0gKHZpc2libGVEYXRlIDwgZmlyc3RWaXNpYmxlRGF0ZS5nZXRUaW1lKCkgfHwgbGFzdFZpc2libGVEYXRlLmdldFRpbWUoKSA8IHZpc2libGVEYXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5ld0NhbGVuZGFyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxlbmRhcnMgPSBbe1xuICAgICAgICAgICAgICAgICAgICBtb250aDogZGF0ZS5nZXRNb250aCgpLFxuICAgICAgICAgICAgICAgICAgICB5ZWFyOiBkYXRlLmdldEZ1bGxZZWFyKClcbiAgICAgICAgICAgICAgICB9XTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fby5tYWluQ2FsZW5kYXIgPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxlbmRhcnNbMF0ubW9udGggKz0gMSAtIHRoaXMuX28ubnVtYmVyT2ZNb250aHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmFkanVzdENhbGVuZGFycygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkanVzdERhdGU6IGZ1bmN0aW9uKHNpZ24sIGRheXMpIHtcblxuICAgICAgICAgICAgdmFyIGRheSA9IHRoaXMuZ2V0RGF0ZSgpIHx8IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgZGlmZmVyZW5jZSA9IHBhcnNlSW50KGRheXMpKjI0KjYwKjYwKjEwMDA7XG5cbiAgICAgICAgICAgIHZhciBuZXdEYXk7XG5cbiAgICAgICAgICAgIGlmIChzaWduID09PSAnYWRkJykge1xuICAgICAgICAgICAgICAgIG5ld0RheSA9IG5ldyBEYXRlKGRheS52YWx1ZU9mKCkgKyBkaWZmZXJlbmNlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2lnbiA9PT0gJ3N1YnRyYWN0Jykge1xuICAgICAgICAgICAgICAgIG5ld0RheSA9IG5ldyBEYXRlKGRheS52YWx1ZU9mKCkgLSBkaWZmZXJlbmNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXREYXRlKG5ld0RheSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRqdXN0Q2FsZW5kYXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsZW5kYXJzWzBdID0gYWRqdXN0Q2FsZW5kYXIodGhpcy5jYWxlbmRhcnNbMF0pO1xuICAgICAgICAgICAgZm9yICh2YXIgYyA9IDE7IGMgPCB0aGlzLl9vLm51bWJlck9mTW9udGhzOyBjKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGVuZGFyc1tjXSA9IGFkanVzdENhbGVuZGFyKHtcbiAgICAgICAgICAgICAgICAgICAgbW9udGg6IHRoaXMuY2FsZW5kYXJzWzBdLm1vbnRoICsgYyxcbiAgICAgICAgICAgICAgICAgICAgeWVhcjogdGhpcy5jYWxlbmRhcnNbMF0ueWVhclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ290b1RvZGF5OiBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuZ290b0RhdGUobmV3IERhdGUoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGNoYW5nZSB2aWV3IHRvIGEgc3BlY2lmaWMgbW9udGggKHplcm8taW5kZXgsIGUuZy4gMDogSmFudWFyeSlcbiAgICAgICAgICovXG4gICAgICAgIGdvdG9Nb250aDogZnVuY3Rpb24obW9udGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICghaXNOYU4obW9udGgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxlbmRhcnNbMF0ubW9udGggPSBwYXJzZUludChtb250aCwgMTApO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRqdXN0Q2FsZW5kYXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbmV4dE1vbnRoOiBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuY2FsZW5kYXJzWzBdLm1vbnRoKys7XG4gICAgICAgICAgICB0aGlzLmFkanVzdENhbGVuZGFycygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHByZXZNb250aDogZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmNhbGVuZGFyc1swXS5tb250aC0tO1xuICAgICAgICAgICAgdGhpcy5hZGp1c3RDYWxlbmRhcnMoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogY2hhbmdlIHZpZXcgdG8gYSBzcGVjaWZpYyBmdWxsIHllYXIgKGUuZy4gXCIyMDEyXCIpXG4gICAgICAgICAqL1xuICAgICAgICBnb3RvWWVhcjogZnVuY3Rpb24oeWVhcilcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCFpc05hTih5ZWFyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsZW5kYXJzWzBdLnllYXIgPSBwYXJzZUludCh5ZWFyLCAxMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGp1c3RDYWxlbmRhcnMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogY2hhbmdlIHRoZSBtaW5EYXRlXG4gICAgICAgICAqL1xuICAgICAgICBzZXRNaW5EYXRlOiBmdW5jdGlvbih2YWx1ZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgc2V0VG9TdGFydE9mRGF5KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vLm1pbkRhdGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vLm1pblllYXIgID0gdmFsdWUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vLm1pbk1vbnRoID0gdmFsdWUuZ2V0TW9udGgoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fby5taW5EYXRlID0gZGVmYXVsdHMubWluRGF0ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vLm1pblllYXIgID0gZGVmYXVsdHMubWluWWVhcjtcbiAgICAgICAgICAgICAgICB0aGlzLl9vLm1pbk1vbnRoID0gZGVmYXVsdHMubWluTW9udGg7XG4gICAgICAgICAgICAgICAgdGhpcy5fby5zdGFydFJhbmdlID0gZGVmYXVsdHMuc3RhcnRSYW5nZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGNoYW5nZSB0aGUgbWF4RGF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgc2V0TWF4RGF0ZTogZnVuY3Rpb24odmFsdWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgIHNldFRvU3RhcnRPZkRheSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fby5tYXhEYXRlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fby5tYXhZZWFyID0gdmFsdWUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vLm1heE1vbnRoID0gdmFsdWUuZ2V0TW9udGgoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fby5tYXhEYXRlID0gZGVmYXVsdHMubWF4RGF0ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vLm1heFllYXIgPSBkZWZhdWx0cy5tYXhZZWFyO1xuICAgICAgICAgICAgICAgIHRoaXMuX28ubWF4TW9udGggPSBkZWZhdWx0cy5tYXhNb250aDtcbiAgICAgICAgICAgICAgICB0aGlzLl9vLmVuZFJhbmdlID0gZGVmYXVsdHMuZW5kUmFuZ2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZHJhdygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldFN0YXJ0UmFuZ2U6IGZ1bmN0aW9uKHZhbHVlKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLl9vLnN0YXJ0UmFuZ2UgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRFbmRSYW5nZTogZnVuY3Rpb24odmFsdWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuX28uZW5kUmFuZ2UgPSB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogcmVmcmVzaCB0aGUgSFRNTFxuICAgICAgICAgKi9cbiAgICAgICAgZHJhdzogZnVuY3Rpb24oZm9yY2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fdiAmJiAhZm9yY2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgb3B0cyA9IHRoaXMuX28sXG4gICAgICAgICAgICAgICAgbWluWWVhciA9IG9wdHMubWluWWVhcixcbiAgICAgICAgICAgICAgICBtYXhZZWFyID0gb3B0cy5tYXhZZWFyLFxuICAgICAgICAgICAgICAgIG1pbk1vbnRoID0gb3B0cy5taW5Nb250aCxcbiAgICAgICAgICAgICAgICBtYXhNb250aCA9IG9wdHMubWF4TW9udGgsXG4gICAgICAgICAgICAgICAgaHRtbCA9ICcnLFxuICAgICAgICAgICAgICAgIHJhbmRJZDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX3kgPD0gbWluWWVhcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3kgPSBtaW5ZZWFyO1xuICAgICAgICAgICAgICAgIGlmICghaXNOYU4obWluTW9udGgpICYmIHRoaXMuX20gPCBtaW5Nb250aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tID0gbWluTW9udGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX3kgPj0gbWF4WWVhcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3kgPSBtYXhZZWFyO1xuICAgICAgICAgICAgICAgIGlmICghaXNOYU4obWF4TW9udGgpICYmIHRoaXMuX20gPiBtYXhNb250aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tID0gbWF4TW9udGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByYW5kSWQgPSAncGlrYS10aXRsZS0nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikucmVwbGFjZSgvW15hLXpdKy9nLCAnJykuc3Vic3RyKDAsIDIpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IG9wdHMubnVtYmVyT2ZNb250aHM7IGMrKykge1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gJzxkaXYgY2xhc3M9XCJwaWthLWxlbmRhclwiPicgKyByZW5kZXJUaXRsZSh0aGlzLCBjLCB0aGlzLmNhbGVuZGFyc1tjXS55ZWFyLCB0aGlzLmNhbGVuZGFyc1tjXS5tb250aCwgdGhpcy5jYWxlbmRhcnNbMF0ueWVhciwgcmFuZElkKSArIHRoaXMucmVuZGVyKHRoaXMuY2FsZW5kYXJzW2NdLnllYXIsIHRoaXMuY2FsZW5kYXJzW2NdLm1vbnRoLCByYW5kSWQpICsgJzwvZGl2Pic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gaHRtbDtcblxuICAgICAgICAgICAgaWYgKG9wdHMuYm91bmQpIHtcbiAgICAgICAgICAgICAgICBpZihvcHRzLmZpZWxkLnR5cGUgIT09ICdoaWRkZW4nKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0byhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMudHJpZ2dlci5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5fby5vbkRyYXcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vLm9uRHJhdyh0aGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdHMuYm91bmQpIHtcbiAgICAgICAgICAgICAgICAvLyBsZXQgdGhlIHNjcmVlbiByZWFkZXIgdXNlciBrbm93IHRvIHVzZSBhcnJvdyBrZXlzXG4gICAgICAgICAgICAgICAgb3B0cy5maWVsZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnVXNlIHRoZSBhcnJvdyBrZXlzIHRvIHBpY2sgYSBkYXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRqdXN0UG9zaXRpb246IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGZpZWxkLCBwRWwsIHdpZHRoLCBoZWlnaHQsIHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBzY3JvbGxUb3AsIGxlZnQsIHRvcCwgY2xpZW50UmVjdDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX28uY29udGFpbmVyKSByZXR1cm47XG5cbiAgICAgICAgICAgIHRoaXMuZWwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXG4gICAgICAgICAgICBmaWVsZCA9IHRoaXMuX28udHJpZ2dlcjtcbiAgICAgICAgICAgIHBFbCA9IGZpZWxkO1xuICAgICAgICAgICAgd2lkdGggPSB0aGlzLmVsLm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgaGVpZ2h0ID0gdGhpcy5lbC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB2aWV3cG9ydFdpZHRoID0gd2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgdmlld3BvcnRIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGZpZWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGNsaWVudFJlY3QgPSBmaWVsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gY2xpZW50UmVjdC5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0O1xuICAgICAgICAgICAgICAgIHRvcCA9IGNsaWVudFJlY3QuYm90dG9tICsgd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gcEVsLm9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgdG9wICA9IHBFbC5vZmZzZXRUb3AgKyBwRWwub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHdoaWxlKChwRWwgPSBwRWwub2Zmc2V0UGFyZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0ICs9IHBFbC5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgICAgICAgICB0b3AgICs9IHBFbC5vZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBkZWZhdWx0IHBvc2l0aW9uIGlzIGJvdHRvbSAmIGxlZnRcbiAgICAgICAgICAgIGlmICgodGhpcy5fby5yZXBvc2l0aW9uICYmIGxlZnQgKyB3aWR0aCA+IHZpZXdwb3J0V2lkdGgpIHx8XG4gICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vLnBvc2l0aW9uLmluZGV4T2YoJ3JpZ2h0JykgPiAtMSAmJlxuICAgICAgICAgICAgICAgICAgICBsZWZ0IC0gd2lkdGggKyBmaWVsZC5vZmZzZXRXaWR0aCA+IDBcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbGVmdCAtIHdpZHRoICsgZmllbGQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHRoaXMuX28ucmVwb3NpdGlvbiAmJiB0b3AgKyBoZWlnaHQgPiB2aWV3cG9ydEhlaWdodCArIHNjcm9sbFRvcCkgfHxcbiAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX28ucG9zaXRpb24uaW5kZXhPZigndG9wJykgPiAtMSAmJlxuICAgICAgICAgICAgICAgICAgICB0b3AgLSBoZWlnaHQgLSBmaWVsZC5vZmZzZXRIZWlnaHQgPiAwXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdG9wID0gdG9wIC0gaGVpZ2h0IC0gZmllbGQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmVsLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgIHRoaXMuZWwuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogcmVuZGVyIEhUTUwgZm9yIGEgcGFydGljdWxhciBtb250aFxuICAgICAgICAgKi9cbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbih5ZWFyLCBtb250aCwgcmFuZElkKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgb3B0cyAgID0gdGhpcy5fbyxcbiAgICAgICAgICAgICAgICBub3cgICAgPSBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICAgIGRheXMgICA9IGdldERheXNJbk1vbnRoKHllYXIsIG1vbnRoKSxcbiAgICAgICAgICAgICAgICBiZWZvcmUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMSkuZ2V0RGF5KCksXG4gICAgICAgICAgICAgICAgZGF0YSAgID0gW10sXG4gICAgICAgICAgICAgICAgcm93ICAgID0gW107XG4gICAgICAgICAgICBzZXRUb1N0YXJ0T2ZEYXkobm93KTtcbiAgICAgICAgICAgIGlmIChvcHRzLmZpcnN0RGF5ID4gMCkge1xuICAgICAgICAgICAgICAgIGJlZm9yZSAtPSBvcHRzLmZpcnN0RGF5O1xuICAgICAgICAgICAgICAgIGlmIChiZWZvcmUgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZSArPSA3O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwcmV2aW91c01vbnRoID0gbW9udGggPT09IDAgPyAxMSA6IG1vbnRoIC0gMSxcbiAgICAgICAgICAgICAgICBuZXh0TW9udGggPSBtb250aCA9PT0gMTEgPyAwIDogbW9udGggKyAxLFxuICAgICAgICAgICAgICAgIHllYXJPZlByZXZpb3VzTW9udGggPSBtb250aCA9PT0gMCA/IHllYXIgLSAxIDogeWVhcixcbiAgICAgICAgICAgICAgICB5ZWFyT2ZOZXh0TW9udGggPSBtb250aCA9PT0gMTEgPyB5ZWFyICsgMSA6IHllYXIsXG4gICAgICAgICAgICAgICAgZGF5c0luUHJldmlvdXNNb250aCA9IGdldERheXNJbk1vbnRoKHllYXJPZlByZXZpb3VzTW9udGgsIHByZXZpb3VzTW9udGgpO1xuICAgICAgICAgICAgdmFyIGNlbGxzID0gZGF5cyArIGJlZm9yZSxcbiAgICAgICAgICAgICAgICBhZnRlciA9IGNlbGxzO1xuICAgICAgICAgICAgd2hpbGUoYWZ0ZXIgPiA3KSB7XG4gICAgICAgICAgICAgICAgYWZ0ZXIgLT0gNztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNlbGxzICs9IDcgLSBhZnRlcjtcbiAgICAgICAgICAgIHZhciBpc1dlZWtTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIHIgPSAwOyBpIDwgY2VsbHM7IGkrKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF5ID0gbmV3IERhdGUoeWVhciwgbW9udGgsIDEgKyAoaSAtIGJlZm9yZSkpLFxuICAgICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkID0gaXNEYXRlKHRoaXMuX2QpID8gY29tcGFyZURhdGVzKGRheSwgdGhpcy5fZCkgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaXNUb2RheSA9IGNvbXBhcmVEYXRlcyhkYXksIG5vdyksXG4gICAgICAgICAgICAgICAgICAgIGhhc0V2ZW50ID0gb3B0cy5ldmVudHMuaW5kZXhPZihkYXkudG9EYXRlU3RyaW5nKCkpICE9PSAtMSA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaXNFbXB0eSA9IGkgPCBiZWZvcmUgfHwgaSA+PSAoZGF5cyArIGJlZm9yZSksXG4gICAgICAgICAgICAgICAgICAgIGRheU51bWJlciA9IDEgKyAoaSAtIGJlZm9yZSksXG4gICAgICAgICAgICAgICAgICAgIG1vbnRoTnVtYmVyID0gbW9udGgsXG4gICAgICAgICAgICAgICAgICAgIHllYXJOdW1iZXIgPSB5ZWFyLFxuICAgICAgICAgICAgICAgICAgICBpc1N0YXJ0UmFuZ2UgPSBvcHRzLnN0YXJ0UmFuZ2UgJiYgY29tcGFyZURhdGVzKG9wdHMuc3RhcnRSYW5nZSwgZGF5KSxcbiAgICAgICAgICAgICAgICAgICAgaXNFbmRSYW5nZSA9IG9wdHMuZW5kUmFuZ2UgJiYgY29tcGFyZURhdGVzKG9wdHMuZW5kUmFuZ2UsIGRheSksXG4gICAgICAgICAgICAgICAgICAgIGlzSW5SYW5nZSA9IG9wdHMuc3RhcnRSYW5nZSAmJiBvcHRzLmVuZFJhbmdlICYmIG9wdHMuc3RhcnRSYW5nZSA8IGRheSAmJiBkYXkgPCBvcHRzLmVuZFJhbmdlLFxuICAgICAgICAgICAgICAgICAgICBpc0Rpc2FibGVkID0gKG9wdHMubWluRGF0ZSAmJiBkYXkgPCBvcHRzLm1pbkRhdGUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob3B0cy5tYXhEYXRlICYmIGRheSA+IG9wdHMubWF4RGF0ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvcHRzLmRpc2FibGVXZWVrZW5kcyAmJiBpc1dlZWtlbmQoZGF5KSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvcHRzLmRpc2FibGVEYXlGbiAmJiBvcHRzLmRpc2FibGVEYXlGbihkYXkpKTtcblxuICAgICAgICAgICAgICAgIGlmIChpc0VtcHR5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpIDwgYmVmb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXlOdW1iZXIgPSBkYXlzSW5QcmV2aW91c01vbnRoICsgZGF5TnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGhOdW1iZXIgPSBwcmV2aW91c01vbnRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgeWVhck51bWJlciA9IHllYXJPZlByZXZpb3VzTW9udGg7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXlOdW1iZXIgPSBkYXlOdW1iZXIgLSBkYXlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGhOdW1iZXIgPSBuZXh0TW9udGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyTnVtYmVyID0geWVhck9mTmV4dE1vbnRoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGRheUNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRheTogZGF5TnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IG1vbnRoTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgeWVhcjogeWVhck51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0V2ZW50OiBoYXNFdmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzU2VsZWN0ZWQ6IGlzU2VsZWN0ZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1RvZGF5OiBpc1RvZGF5LFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEaXNhYmxlZDogaXNEaXNhYmxlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRW1wdHk6IGlzRW1wdHksXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1N0YXJ0UmFuZ2U6IGlzU3RhcnRSYW5nZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRW5kUmFuZ2U6IGlzRW5kUmFuZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0luUmFuZ2U6IGlzSW5SYW5nZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dEYXlzSW5OZXh0QW5kUHJldmlvdXNNb250aHM6IG9wdHMuc2hvd0RheXNJbk5leHRBbmRQcmV2aW91c01vbnRocyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZVNlbGVjdGlvbkRheXNJbk5leHRBbmRQcmV2aW91c01vbnRoczogb3B0cy5lbmFibGVTZWxlY3Rpb25EYXlzSW5OZXh0QW5kUHJldmlvdXNNb250aHNcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnBpY2tXaG9sZVdlZWsgJiYgaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBpc1dlZWtTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcm93LnB1c2gocmVuZGVyRGF5KGRheUNvbmZpZykpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCsrciA9PT0gNykge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5zaG93V2Vla051bWJlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm93LnVuc2hpZnQocmVuZGVyV2VlayhpIC0gYmVmb3JlLCBtb250aCwgeWVhcikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRhdGEucHVzaChyZW5kZXJSb3cocm93LCBvcHRzLmlzUlRMLCBvcHRzLnBpY2tXaG9sZVdlZWssIGlzV2Vla1NlbGVjdGVkKSk7XG4gICAgICAgICAgICAgICAgICAgIHJvdyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICByID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaXNXZWVrU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyVGFibGUob3B0cywgZGF0YSwgcmFuZElkKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1Zpc2libGU6IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Y7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2hvdzogZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNWaXNpYmxlKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl92ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXcoKTtcbiAgICAgICAgICAgICAgICByZW1vdmVDbGFzcyh0aGlzLmVsLCAnaXMtaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX28uYm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkRXZlbnQoZG9jdW1lbnQsICdjbGljaycsIHRoaXMuX29uQ2xpY2spO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkanVzdFBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5fby5vbk9wZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fby5vbk9wZW4uY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGlkZTogZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgdiA9IHRoaXMuX3Y7XG4gICAgICAgICAgICBpZiAodiAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fby5ib3VuZCkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVFdmVudChkb2N1bWVudCwgJ2NsaWNrJywgdGhpcy5fb25DbGljayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZWwuc3R5bGUucG9zaXRpb24gPSAnc3RhdGljJzsgLy8gcmVzZXRcbiAgICAgICAgICAgICAgICB0aGlzLmVsLnN0eWxlLmxlZnQgPSAnYXV0byc7XG4gICAgICAgICAgICAgICAgdGhpcy5lbC5zdHlsZS50b3AgPSAnYXV0byc7XG4gICAgICAgICAgICAgICAgYWRkQ2xhc3ModGhpcy5lbCwgJ2lzLWhpZGRlbicpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3YgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAodiAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB0aGlzLl9vLm9uQ2xvc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fby5vbkNsb3NlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHQU1FIE9WRVJcbiAgICAgICAgICovXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIG9wdHMgPSB0aGlzLl9vO1xuXG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgIHJlbW92ZUV2ZW50KHRoaXMuZWwsICdtb3VzZWRvd24nLCB0aGlzLl9vbk1vdXNlRG93biwgdHJ1ZSk7XG4gICAgICAgICAgICByZW1vdmVFdmVudCh0aGlzLmVsLCAndG91Y2hlbmQnLCB0aGlzLl9vbk1vdXNlRG93biwgdHJ1ZSk7XG4gICAgICAgICAgICByZW1vdmVFdmVudCh0aGlzLmVsLCAnY2hhbmdlJywgdGhpcy5fb25DaGFuZ2UpO1xuICAgICAgICAgICAgaWYgKG9wdHMua2V5Ym9hcmRJbnB1dCkge1xuICAgICAgICAgICAgICAgIHJlbW92ZUV2ZW50KGRvY3VtZW50LCAna2V5ZG93bicsIHRoaXMuX29uS2V5Q2hhbmdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRzLmZpZWxkKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlRXZlbnQob3B0cy5maWVsZCwgJ2NoYW5nZScsIHRoaXMuX29uSW5wdXRDaGFuZ2UpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLmJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUV2ZW50KG9wdHMudHJpZ2dlciwgJ2NsaWNrJywgdGhpcy5fb25JbnB1dENsaWNrKTtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRXZlbnQob3B0cy50cmlnZ2VyLCAnZm9jdXMnLCB0aGlzLl9vbklucHV0Rm9jdXMpO1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVFdmVudChvcHRzLnRyaWdnZXIsICdibHVyJywgdGhpcy5fb25JbnB1dEJsdXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5lbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICByZXR1cm4gUGlrYWRheTtcbn0pKTtcbiIsIi8qIVxuKiBUaXBweS5qcyB2Mi41LjNcbiogKGMpIDIwMTctMjAxOCBhdG9taWtzXG4qIE1JVFxuKi9cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcblx0KGdsb2JhbC50aXBweSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxudmFyIHZlcnNpb24gPSBcIjIuNS4zXCI7XG5cbnZhciBpc0Jyb3dzZXIgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcblxudmFyIGlzSUUgPSBpc0Jyb3dzZXIgJiYgL01TSUUgfFRyaWRlbnRcXC8vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbnZhciBicm93c2VyID0ge307XG5cbmlmIChpc0Jyb3dzZXIpIHtcbiAgYnJvd3Nlci5zdXBwb3J0ZWQgPSAncmVxdWVzdEFuaW1hdGlvbkZyYW1lJyBpbiB3aW5kb3c7XG4gIGJyb3dzZXIuc3VwcG9ydHNUb3VjaCA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdztcbiAgYnJvd3Nlci51c2luZ1RvdWNoID0gZmFsc2U7XG4gIGJyb3dzZXIuZHluYW1pY0lucHV0RGV0ZWN0aW9uID0gdHJ1ZTtcbiAgYnJvd3Nlci5pT1MgPSAvaVBob25lfGlQYWR8aVBvZC8udGVzdChuYXZpZ2F0b3IucGxhdGZvcm0pICYmICF3aW5kb3cuTVNTdHJlYW07XG4gIGJyb3dzZXIub25Vc2VySW5wdXRDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7fTtcbn1cblxuLyoqXG4gKiBTZWxlY3RvciBjb25zdGFudHMgdXNlZCBmb3IgZ3JhYmJpbmcgZWxlbWVudHNcbiAqL1xudmFyIHNlbGVjdG9ycyA9IHtcbiAgUE9QUEVSOiAnLnRpcHB5LXBvcHBlcicsXG4gIFRPT0xUSVA6ICcudGlwcHktdG9vbHRpcCcsXG4gIENPTlRFTlQ6ICcudGlwcHktY29udGVudCcsXG4gIEJBQ0tEUk9QOiAnLnRpcHB5LWJhY2tkcm9wJyxcbiAgQVJST1c6ICcudGlwcHktYXJyb3cnLFxuICBST1VORF9BUlJPVzogJy50aXBweS1yb3VuZGFycm93JyxcbiAgUkVGRVJFTkNFOiAnW2RhdGEtdGlwcHldJ1xufTtcblxudmFyIGRlZmF1bHRzID0ge1xuICBwbGFjZW1lbnQ6ICd0b3AnLFxuICBsaXZlUGxhY2VtZW50OiB0cnVlLFxuICB0cmlnZ2VyOiAnbW91c2VlbnRlciBmb2N1cycsXG4gIGFuaW1hdGlvbjogJ3NoaWZ0LWF3YXknLFxuICBodG1sOiBmYWxzZSxcbiAgYW5pbWF0ZUZpbGw6IHRydWUsXG4gIGFycm93OiBmYWxzZSxcbiAgZGVsYXk6IDAsXG4gIGR1cmF0aW9uOiBbMzUwLCAzMDBdLFxuICBpbnRlcmFjdGl2ZTogZmFsc2UsXG4gIGludGVyYWN0aXZlQm9yZGVyOiAyLFxuICB0aGVtZTogJ2RhcmsnLFxuICBzaXplOiAncmVndWxhcicsXG4gIGRpc3RhbmNlOiAxMCxcbiAgb2Zmc2V0OiAwLFxuICBoaWRlT25DbGljazogdHJ1ZSxcbiAgbXVsdGlwbGU6IGZhbHNlLFxuICBmb2xsb3dDdXJzb3I6IGZhbHNlLFxuICBpbmVydGlhOiBmYWxzZSxcbiAgdXBkYXRlRHVyYXRpb246IDM1MCxcbiAgc3RpY2t5OiBmYWxzZSxcbiAgYXBwZW5kVG86IGZ1bmN0aW9uIGFwcGVuZFRvKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5ib2R5O1xuICB9LFxuICB6SW5kZXg6IDk5OTksXG4gIHRvdWNoSG9sZDogZmFsc2UsXG4gIHBlcmZvcm1hbmNlOiBmYWxzZSxcbiAgZHluYW1pY1RpdGxlOiBmYWxzZSxcbiAgZmxpcDogdHJ1ZSxcbiAgZmxpcEJlaGF2aW9yOiAnZmxpcCcsXG4gIGFycm93VHlwZTogJ3NoYXJwJyxcbiAgYXJyb3dUcmFuc2Zvcm06ICcnLFxuICBtYXhXaWR0aDogJycsXG4gIHRhcmdldDogbnVsbCxcbiAgYWxsb3dUaXRsZUhUTUw6IHRydWUsXG4gIHBvcHBlck9wdGlvbnM6IHt9LFxuICBjcmVhdGVQb3BwZXJJbnN0YW5jZU9uSW5pdDogZmFsc2UsXG4gIG9uU2hvdzogZnVuY3Rpb24gb25TaG93KCkge30sXG4gIG9uU2hvd246IGZ1bmN0aW9uIG9uU2hvd24oKSB7fSxcbiAgb25IaWRlOiBmdW5jdGlvbiBvbkhpZGUoKSB7fSxcbiAgb25IaWRkZW46IGZ1bmN0aW9uIG9uSGlkZGVuKCkge31cbn07XG5cbi8qKlxuICogVGhlIGtleXMgb2YgdGhlIGRlZmF1bHRzIG9iamVjdCBmb3IgcmVkdWNpbmcgZG93biBpbnRvIGEgbmV3IG9iamVjdFxuICogVXNlZCBpbiBgZ2V0SW5kaXZpZHVhbE9wdGlvbnMoKWBcbiAqL1xudmFyIGRlZmF1bHRzS2V5cyA9IGJyb3dzZXIuc3VwcG9ydGVkICYmIE9iamVjdC5rZXlzKGRlZmF1bHRzKTtcblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgYW4gb2JqZWN0IGxpdGVyYWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGl0ZXJhbCh2YWx1ZSkge1xuICByZXR1cm4ge30udG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuXG4vKipcbiAqIFBvbnlmaWxsIGZvciBBcnJheS5mcm9tXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuZnVuY3Rpb24gdG9BcnJheSh2YWx1ZSkge1xuICByZXR1cm4gW10uc2xpY2UuY2FsbCh2YWx1ZSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSBvZiBlbGVtZW50cyBiYXNlZCBvbiB0aGUgc2VsZWN0b3IgaW5wdXRcbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR8RWxlbWVudFtdfE5vZGVMaXN0fE9iamVjdH0gc2VsZWN0b3JcbiAqIEByZXR1cm4ge0VsZW1lbnRbXX1cbiAqL1xuZnVuY3Rpb24gZ2V0QXJyYXlPZkVsZW1lbnRzKHNlbGVjdG9yKSB7XG4gIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIEVsZW1lbnQgfHwgaXNPYmplY3RMaXRlcmFsKHNlbGVjdG9yKSkge1xuICAgIHJldHVybiBbc2VsZWN0b3JdO1xuICB9XG5cbiAgaWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICByZXR1cm4gdG9BcnJheShzZWxlY3Rvcik7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShzZWxlY3RvcikpIHtcbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cblxuICB0cnkge1xuICAgIHJldHVybiB0b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG4vKipcbiAqIFBvbHlmaWxscyBuZWVkZWQgcHJvcHMvbWV0aG9kcyBmb3IgYSB2aXJ0dWFsIHJlZmVyZW5jZSBvYmplY3RcbiAqIE5PVEU6IGluIHYzLjAgdGhpcyB3aWxsIGJlIHB1cmVcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWZlcmVuY2VcbiAqL1xuZnVuY3Rpb24gcG9seWZpbGxWaXJ0dWFsUmVmZXJlbmNlUHJvcHMocmVmZXJlbmNlKSB7XG4gIHJlZmVyZW5jZS5yZWZPYmogPSB0cnVlO1xuICByZWZlcmVuY2UuYXR0cmlidXRlcyA9IHJlZmVyZW5jZS5hdHRyaWJ1dGVzIHx8IHt9O1xuICByZWZlcmVuY2Uuc2V0QXR0cmlidXRlID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgcmVmZXJlbmNlLmF0dHJpYnV0ZXNba2V5XSA9IHZhbDtcbiAgfTtcbiAgcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gcmVmZXJlbmNlLmF0dHJpYnV0ZXNba2V5XTtcbiAgfTtcbiAgcmVmZXJlbmNlLnJlbW92ZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBkZWxldGUgcmVmZXJlbmNlLmF0dHJpYnV0ZXNba2V5XTtcbiAgfTtcbiAgcmVmZXJlbmNlLmhhc0F0dHJpYnV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4ga2V5IGluIHJlZmVyZW5jZS5hdHRyaWJ1dGVzO1xuICB9O1xuICByZWZlcmVuY2UuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHt9O1xuICByZWZlcmVuY2UucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHt9O1xuICByZWZlcmVuY2UuY2xhc3NMaXN0ID0ge1xuICAgIGNsYXNzTmFtZXM6IHt9LFxuICAgIGFkZDogZnVuY3Rpb24gYWRkKGtleSkge1xuICAgICAgcmV0dXJuIHJlZmVyZW5jZS5jbGFzc0xpc3QuY2xhc3NOYW1lc1trZXldID0gdHJ1ZTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKGtleSkge1xuICAgICAgZGVsZXRlIHJlZmVyZW5jZS5jbGFzc0xpc3QuY2xhc3NOYW1lc1trZXldO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBjb250YWluczogZnVuY3Rpb24gY29udGFpbnMoa2V5KSB7XG4gICAgICByZXR1cm4ga2V5IGluIHJlZmVyZW5jZS5jbGFzc0xpc3QuY2xhc3NOYW1lcztcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgc3VwcG9ydGVkIHByZWZpeGVkIHByb3BlcnR5IC0gb25seSBgd2Via2l0YCBpcyBuZWVkZWQsIGBtb3pgLCBgbXNgIGFuZCBgb2AgYXJlIG9ic29sZXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlcbiAqIEByZXR1cm4ge1N0cmluZ30gLSBicm93c2VyIHN1cHBvcnRlZCBwcmVmaXhlZCBwcm9wZXJ0eVxuICovXG5mdW5jdGlvbiBwcmVmaXgocHJvcGVydHkpIHtcbiAgdmFyIHByZWZpeGVzID0gWycnLCAnd2Via2l0J107XG4gIHZhciB1cHBlclByb3AgPSBwcm9wZXJ0eS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnNsaWNlKDEpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgX3ByZWZpeCA9IHByZWZpeGVzW2ldO1xuICAgIHZhciBwcmVmaXhlZFByb3AgPSBfcHJlZml4ID8gX3ByZWZpeCArIHVwcGVyUHJvcCA6IHByb3BlcnR5O1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuYm9keS5zdHlsZVtwcmVmaXhlZFByb3BdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIHByZWZpeGVkUHJvcDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZGl2IGVsZW1lbnRcbiAqIEByZXR1cm4ge0VsZW1lbnR9XG4gKi9cbmZ1bmN0aW9uIGRpdigpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBwb3BwZXIgZWxlbWVudCB0aGVuIHJldHVybnMgaXRcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCAtIHRoZSBwb3BwZXIgaWRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0aXRsZSAtIHRoZSB0b29sdGlwJ3MgYHRpdGxlYCBhdHRyaWJ1dGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gaW5kaXZpZHVhbCBvcHRpb25zXG4gKiBAcmV0dXJuIHtFbGVtZW50fSAtIHRoZSBwb3BwZXIgZWxlbWVudFxuICovXG5mdW5jdGlvbiBjcmVhdGVQb3BwZXJFbGVtZW50KGlkLCB0aXRsZSwgb3B0aW9ucykge1xuICB2YXIgcG9wcGVyID0gZGl2KCk7XG4gIHBvcHBlci5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RpcHB5LXBvcHBlcicpO1xuICBwb3BwZXIuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Rvb2x0aXAnKTtcbiAgcG9wcGVyLnNldEF0dHJpYnV0ZSgnaWQnLCAndGlwcHktJyArIGlkKTtcbiAgcG9wcGVyLnN0eWxlLnpJbmRleCA9IG9wdGlvbnMuekluZGV4O1xuICBwb3BwZXIuc3R5bGUubWF4V2lkdGggPSBvcHRpb25zLm1heFdpZHRoO1xuXG4gIHZhciB0b29sdGlwID0gZGl2KCk7XG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdjbGFzcycsICd0aXBweS10b29sdGlwJyk7XG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLXNpemUnLCBvcHRpb25zLnNpemUpO1xuICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnZGF0YS1hbmltYXRpb24nLCBvcHRpb25zLmFuaW1hdGlvbik7XG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLXN0YXRlJywgJ2hpZGRlbicpO1xuICBvcHRpb25zLnRoZW1lLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgIHRvb2x0aXAuY2xhc3NMaXN0LmFkZCh0ICsgJy10aGVtZScpO1xuICB9KTtcblxuICB2YXIgY29udGVudCA9IGRpdigpO1xuICBjb250ZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAndGlwcHktY29udGVudCcpO1xuXG4gIGlmIChvcHRpb25zLmFycm93KSB7XG4gICAgdmFyIGFycm93ID0gZGl2KCk7XG4gICAgYXJyb3cuc3R5bGVbcHJlZml4KCd0cmFuc2Zvcm0nKV0gPSBvcHRpb25zLmFycm93VHJhbnNmb3JtO1xuXG4gICAgaWYgKG9wdGlvbnMuYXJyb3dUeXBlID09PSAncm91bmQnKSB7XG4gICAgICBhcnJvdy5jbGFzc0xpc3QuYWRkKCd0aXBweS1yb3VuZGFycm93Jyk7XG4gICAgICBhcnJvdy5pbm5lckhUTUwgPSAnPHN2ZyB2aWV3Qm94PVwiMCAwIDI0IDhcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+PHBhdGggZD1cIk0zIDhzMi4wMjEtLjAxNSA1LjI1My00LjIxOEM5LjU4NCAyLjA1MSAxMC43OTcgMS4wMDcgMTIgMWMxLjIwMy0uMDA3IDIuNDE2IDEuMDM1IDMuNzYxIDIuNzgyQzE5LjAxMiA4LjAwNSAyMSA4IDIxIDhIM3pcIi8+PC9zdmc+JztcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyb3cuY2xhc3NMaXN0LmFkZCgndGlwcHktYXJyb3cnKTtcbiAgICB9XG5cbiAgICB0b29sdGlwLmFwcGVuZENoaWxkKGFycm93KTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmFuaW1hdGVGaWxsKSB7XG4gICAgLy8gQ3JlYXRlIGFuaW1hdGVGaWxsIGNpcmNsZSBlbGVtZW50IGZvciBhbmltYXRpb25cbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnZGF0YS1hbmltYXRlZmlsbCcsICcnKTtcbiAgICB2YXIgYmFja2Ryb3AgPSBkaXYoKTtcbiAgICBiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCd0aXBweS1iYWNrZHJvcCcpO1xuICAgIGJhY2tkcm9wLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0ZScsICdoaWRkZW4nKTtcbiAgICB0b29sdGlwLmFwcGVuZENoaWxkKGJhY2tkcm9wKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmluZXJ0aWEpIHtcbiAgICAvLyBDaGFuZ2UgdHJhbnNpdGlvbiB0aW1pbmcgZnVuY3Rpb24gY3ViaWMgYmV6aWVyXG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5lcnRpYScsICcnKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmludGVyYWN0aXZlKSB7XG4gICAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW50ZXJhY3RpdmUnLCAnJyk7XG4gIH1cblxuICB2YXIgaHRtbCA9IG9wdGlvbnMuaHRtbDtcbiAgaWYgKGh0bWwpIHtcbiAgICB2YXIgdGVtcGxhdGVJZCA9IHZvaWQgMDtcblxuICAgIGlmIChodG1sIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgY29udGVudC5hcHBlbmRDaGlsZChodG1sKTtcbiAgICAgIHRlbXBsYXRlSWQgPSAnIycgKyAoaHRtbC5pZCB8fCAndGlwcHktaHRtbC10ZW1wbGF0ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB0cmljayBsaW50ZXJzOiBodHRwczovL2dpdGh1Yi5jb20vYXRvbWlrcy90aXBweWpzL2lzc3Vlcy8xOTdcbiAgICAgIGNvbnRlbnRbdHJ1ZSAmJiAnaW5uZXJIVE1MJ10gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGh0bWwpW3RydWUgJiYgJ2lubmVySFRNTCddO1xuICAgICAgdGVtcGxhdGVJZCA9IGh0bWw7XG4gICAgfVxuXG4gICAgcG9wcGVyLnNldEF0dHJpYnV0ZSgnZGF0YS1odG1sJywgJycpO1xuICAgIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdkYXRhLXRlbXBsYXRlLWlkJywgdGVtcGxhdGVJZCk7XG5cbiAgICBpZiAob3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xuICAgICAgcG9wcGVyLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29udGVudFtvcHRpb25zLmFsbG93VGl0bGVIVE1MID8gJ2lubmVySFRNTCcgOiAndGV4dENvbnRlbnQnXSA9IHRpdGxlO1xuICB9XG5cbiAgdG9vbHRpcC5hcHBlbmRDaGlsZChjb250ZW50KTtcbiAgcG9wcGVyLmFwcGVuZENoaWxkKHRvb2x0aXApO1xuXG4gIHJldHVybiBwb3BwZXI7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRyaWdnZXIgYnkgYWRkaW5nIHRoZSBuZWNlc3NhcnkgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSByZWZlcmVuY2UgZWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50VHlwZSAtIHRoZSBjdXN0b20gZXZlbnQgc3BlY2lmaWVkIGluIHRoZSBgdHJpZ2dlcmAgc2V0dGluZ1xuICogQHBhcmFtIHtFbGVtZW50fSByZWZlcmVuY2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYW5kbGVycyAtIHRoZSBoYW5kbGVycyBmb3IgZWFjaCBldmVudFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0FycmF5fSAtIGFycmF5IG9mIGxpc3RlbmVyIG9iamVjdHNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlVHJpZ2dlcihldmVudFR5cGUsIHJlZmVyZW5jZSwgaGFuZGxlcnMsIG9wdGlvbnMpIHtcbiAgdmFyIG9uVHJpZ2dlciA9IGhhbmRsZXJzLm9uVHJpZ2dlcixcbiAgICAgIG9uTW91c2VMZWF2ZSA9IGhhbmRsZXJzLm9uTW91c2VMZWF2ZSxcbiAgICAgIG9uQmx1ciA9IGhhbmRsZXJzLm9uQmx1cixcbiAgICAgIG9uRGVsZWdhdGVTaG93ID0gaGFuZGxlcnMub25EZWxlZ2F0ZVNob3csXG4gICAgICBvbkRlbGVnYXRlSGlkZSA9IGhhbmRsZXJzLm9uRGVsZWdhdGVIaWRlO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSBbXTtcblxuICBpZiAoZXZlbnRUeXBlID09PSAnbWFudWFsJykgcmV0dXJuIGxpc3RlbmVycztcblxuICB2YXIgb24gPSBmdW5jdGlvbiBvbihldmVudFR5cGUsIGhhbmRsZXIpIHtcbiAgICByZWZlcmVuY2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGhhbmRsZXIpO1xuICAgIGxpc3RlbmVycy5wdXNoKHsgZXZlbnQ6IGV2ZW50VHlwZSwgaGFuZGxlcjogaGFuZGxlciB9KTtcbiAgfTtcblxuICBpZiAoIW9wdGlvbnMudGFyZ2V0KSB7XG4gICAgb24oZXZlbnRUeXBlLCBvblRyaWdnZXIpO1xuXG4gICAgaWYgKGJyb3dzZXIuc3VwcG9ydHNUb3VjaCAmJiBvcHRpb25zLnRvdWNoSG9sZCkge1xuICAgICAgb24oJ3RvdWNoc3RhcnQnLCBvblRyaWdnZXIpO1xuICAgICAgb24oJ3RvdWNoZW5kJywgb25Nb3VzZUxlYXZlKTtcbiAgICB9XG4gICAgaWYgKGV2ZW50VHlwZSA9PT0gJ21vdXNlZW50ZXInKSB7XG4gICAgICBvbignbW91c2VsZWF2ZScsIG9uTW91c2VMZWF2ZSk7XG4gICAgfVxuICAgIGlmIChldmVudFR5cGUgPT09ICdmb2N1cycpIHtcbiAgICAgIG9uKGlzSUUgPyAnZm9jdXNvdXQnIDogJ2JsdXInLCBvbkJsdXIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYnJvd3Nlci5zdXBwb3J0c1RvdWNoICYmIG9wdGlvbnMudG91Y2hIb2xkKSB7XG4gICAgICBvbigndG91Y2hzdGFydCcsIG9uRGVsZWdhdGVTaG93KTtcbiAgICAgIG9uKCd0b3VjaGVuZCcsIG9uRGVsZWdhdGVIaWRlKTtcbiAgICB9XG4gICAgaWYgKGV2ZW50VHlwZSA9PT0gJ21vdXNlZW50ZXInKSB7XG4gICAgICBvbignbW91c2VvdmVyJywgb25EZWxlZ2F0ZVNob3cpO1xuICAgICAgb24oJ21vdXNlb3V0Jywgb25EZWxlZ2F0ZUhpZGUpO1xuICAgIH1cbiAgICBpZiAoZXZlbnRUeXBlID09PSAnZm9jdXMnKSB7XG4gICAgICBvbignZm9jdXNpbicsIG9uRGVsZWdhdGVTaG93KTtcbiAgICAgIG9uKCdmb2N1c291dCcsIG9uRGVsZWdhdGVIaWRlKTtcbiAgICB9XG4gICAgaWYgKGV2ZW50VHlwZSA9PT0gJ2NsaWNrJykge1xuICAgICAgb24oJ2NsaWNrJywgb25EZWxlZ2F0ZVNob3cpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsaXN0ZW5lcnM7XG59XG5cbnZhciBjbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59O1xuXG52YXIgY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KCk7XG5cblxuXG5cblxuXG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYW4gb2JqZWN0IG9mIHNldHRpbmdzIHRvIG92ZXJyaWRlIGdsb2JhbCBzZXR0aW5nc1xuICogQHBhcmFtIHtFbGVtZW50fSByZWZlcmVuY2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnN0YW5jZU9wdGlvbnNcbiAqIEByZXR1cm4ge09iamVjdH0gLSBpbmRpdmlkdWFsIG9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gZ2V0SW5kaXZpZHVhbE9wdGlvbnMocmVmZXJlbmNlLCBpbnN0YW5jZU9wdGlvbnMpIHtcbiAgdmFyIG9wdGlvbnMgPSBkZWZhdWx0c0tleXMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGtleSkge1xuICAgIHZhciB2YWwgPSByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCdkYXRhLXRpcHB5LScgKyBrZXkudG9Mb3dlckNhc2UoKSkgfHwgaW5zdGFuY2VPcHRpb25zW2tleV07XG5cbiAgICAvLyBDb252ZXJ0IHN0cmluZ3MgdG8gYm9vbGVhbnNcbiAgICBpZiAodmFsID09PSAnZmFsc2UnKSB2YWwgPSBmYWxzZTtcbiAgICBpZiAodmFsID09PSAndHJ1ZScpIHZhbCA9IHRydWU7XG5cbiAgICAvLyBDb252ZXJ0IG51bWJlciBzdHJpbmdzIHRvIHRydWUgbnVtYmVyc1xuICAgIGlmIChpc0Zpbml0ZSh2YWwpICYmICFpc05hTihwYXJzZUZsb2F0KHZhbCkpKSB7XG4gICAgICB2YWwgPSBwYXJzZUZsb2F0KHZhbCk7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBhcnJheSBzdHJpbmdzIHRvIGFjdHVhbCBhcnJheXNcbiAgICBpZiAoa2V5ICE9PSAndGFyZ2V0JyAmJiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyAmJiB2YWwudHJpbSgpLmNoYXJBdCgwKSA9PT0gJ1snKSB7XG4gICAgICB2YWwgPSBKU09OLnBhcnNlKHZhbCk7XG4gICAgfVxuXG4gICAgYWNjW2tleV0gPSB2YWw7XG5cbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG5cbiAgcmV0dXJuIF9leHRlbmRzKHt9LCBpbnN0YW5jZU9wdGlvbnMsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIEV2YWx1YXRlcy9tb2RpZmllcyB0aGUgb3B0aW9ucyBvYmplY3QgZm9yIGFwcHJvcHJpYXRlIGJlaGF2aW9yXG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSByZWZlcmVuY2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtPYmplY3R9IG1vZGlmaWVkL2V2YWx1YXRlZCBvcHRpb25zXG4gKi9cbmZ1bmN0aW9uIGV2YWx1YXRlT3B0aW9ucyhyZWZlcmVuY2UsIG9wdGlvbnMpIHtcbiAgLy8gYW5pbWF0ZUZpbGwgaXMgZGlzYWJsZWQgaWYgYW4gYXJyb3cgaXMgdHJ1ZVxuICBpZiAob3B0aW9ucy5hcnJvdykge1xuICAgIG9wdGlvbnMuYW5pbWF0ZUZpbGwgPSBmYWxzZTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmFwcGVuZFRvICYmIHR5cGVvZiBvcHRpb25zLmFwcGVuZFRvID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0aW9ucy5hcHBlbmRUbyA9IG9wdGlvbnMuYXBwZW5kVG8oKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5odG1sID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0aW9ucy5odG1sID0gb3B0aW9ucy5odG1sKHJlZmVyZW5jZSk7XG4gIH1cblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGlubmVyIGVsZW1lbnRzIG9mIHRoZSBwb3BwZXIgZWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gZ2V0SW5uZXJFbGVtZW50cyhwb3BwZXIpIHtcbiAgdmFyIHNlbGVjdCA9IGZ1bmN0aW9uIHNlbGVjdChzKSB7XG4gICAgcmV0dXJuIHBvcHBlci5xdWVyeVNlbGVjdG9yKHMpO1xuICB9O1xuICByZXR1cm4ge1xuICAgIHRvb2x0aXA6IHNlbGVjdChzZWxlY3RvcnMuVE9PTFRJUCksXG4gICAgYmFja2Ryb3A6IHNlbGVjdChzZWxlY3RvcnMuQkFDS0RST1ApLFxuICAgIGNvbnRlbnQ6IHNlbGVjdChzZWxlY3RvcnMuQ09OVEVOVCksXG4gICAgYXJyb3c6IHNlbGVjdChzZWxlY3RvcnMuQVJST1cpIHx8IHNlbGVjdChzZWxlY3RvcnMuUk9VTkRfQVJST1cpXG4gIH07XG59XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgdGl0bGUgZnJvbSBhbiBlbGVtZW50LCBzZXR0aW5nIGBkYXRhLW9yaWdpbmFsLXRpdGxlYFxuICogYXBwcm9wcmlhdGVseVxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICovXG5mdW5jdGlvbiByZW1vdmVUaXRsZShlbCkge1xuICB2YXIgdGl0bGUgPSBlbC5nZXRBdHRyaWJ1dGUoJ3RpdGxlJyk7XG4gIC8vIE9ubHkgc2V0IGBkYXRhLW9yaWdpbmFsLXRpdGxlYCBhdHRyIGlmIHRoZXJlIGlzIGEgdGl0bGVcbiAgaWYgKHRpdGxlKSB7XG4gICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLW9yaWdpbmFsLXRpdGxlJywgdGl0bGUpO1xuICB9XG4gIGVsLnJlbW92ZUF0dHJpYnV0ZSgndGl0bGUnKTtcbn1cblxuLyoqIVxuICogQGZpbGVPdmVydmlldyBLaWNrYXNzIGxpYnJhcnkgdG8gY3JlYXRlIGFuZCBwbGFjZSBwb3BwZXJzIG5lYXIgdGhlaXIgcmVmZXJlbmNlIGVsZW1lbnRzLlxuICogQHZlcnNpb24gMS4xNC4zXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IChjKSAyMDE2IEZlZGVyaWNvIFppdm9sbyBhbmQgY29udHJpYnV0b3JzXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuICogaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gKiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuICogY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiBTT0ZUV0FSRS5cbiAqL1xudmFyIGlzQnJvd3NlciQxID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJztcblxudmFyIGxvbmdlclRpbWVvdXRCcm93c2VycyA9IFsnRWRnZScsICdUcmlkZW50JywgJ0ZpcmVmb3gnXTtcbnZhciB0aW1lb3V0RHVyYXRpb24gPSAwO1xuZm9yICh2YXIgaSA9IDA7IGkgPCBsb25nZXJUaW1lb3V0QnJvd3NlcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgaWYgKGlzQnJvd3NlciQxICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihsb25nZXJUaW1lb3V0QnJvd3NlcnNbaV0pID49IDApIHtcbiAgICB0aW1lb3V0RHVyYXRpb24gPSAxO1xuICAgIGJyZWFrO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1pY3JvdGFza0RlYm91bmNlKGZuKSB7XG4gIHZhciBjYWxsZWQgPSBmYWxzZTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY2FsbGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNhbGxlZCA9IHRydWU7XG4gICAgd2luZG93LlByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgY2FsbGVkID0gZmFsc2U7XG4gICAgICBmbigpO1xuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0YXNrRGVib3VuY2UoZm4pIHtcbiAgdmFyIHNjaGVkdWxlZCA9IGZhbHNlO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmICghc2NoZWR1bGVkKSB7XG4gICAgICBzY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNjaGVkdWxlZCA9IGZhbHNlO1xuICAgICAgICBmbigpO1xuICAgICAgfSwgdGltZW91dER1cmF0aW9uKTtcbiAgICB9XG4gIH07XG59XG5cbnZhciBzdXBwb3J0c01pY3JvVGFza3MgPSBpc0Jyb3dzZXIkMSAmJiB3aW5kb3cuUHJvbWlzZTtcblxuLyoqXG4qIENyZWF0ZSBhIGRlYm91bmNlZCB2ZXJzaW9uIG9mIGEgbWV0aG9kLCB0aGF0J3MgYXN5bmNocm9ub3VzbHkgZGVmZXJyZWRcbiogYnV0IGNhbGxlZCBpbiB0aGUgbWluaW11bSB0aW1lIHBvc3NpYmxlLlxuKlxuKiBAbWV0aG9kXG4qIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiogQGFyZ3VtZW50IHtGdW5jdGlvbn0gZm5cbiogQHJldHVybnMge0Z1bmN0aW9ufVxuKi9cbnZhciBkZWJvdW5jZSA9IHN1cHBvcnRzTWljcm9UYXNrcyA/IG1pY3JvdGFza0RlYm91bmNlIDogdGFza0RlYm91bmNlO1xuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhIGZ1bmN0aW9uXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge0FueX0gZnVuY3Rpb25Ub0NoZWNrIC0gdmFyaWFibGUgdG8gY2hlY2tcbiAqIEByZXR1cm5zIHtCb29sZWFufSBhbnN3ZXIgdG86IGlzIGEgZnVuY3Rpb24/XG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZnVuY3Rpb25Ub0NoZWNrKSB7XG4gIHZhciBnZXRUeXBlID0ge307XG4gIHJldHVybiBmdW5jdGlvblRvQ2hlY2sgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKGZ1bmN0aW9uVG9DaGVjaykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG5cbi8qKlxuICogR2V0IENTUyBjb21wdXRlZCBwcm9wZXJ0eSBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtFZW1lbnR9IGVsZW1lbnRcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwcm9wZXJ0eVxuICovXG5mdW5jdGlvbiBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCwgcHJvcGVydHkpIHtcbiAgaWYgKGVsZW1lbnQubm9kZVR5cGUgIT09IDEpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcbiAgdmFyIGNzcyA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7XG4gIHJldHVybiBwcm9wZXJ0eSA/IGNzc1twcm9wZXJ0eV0gOiBjc3M7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcGFyZW50Tm9kZSBvciB0aGUgaG9zdCBvZiB0aGUgZWxlbWVudFxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudH0gcGFyZW50XG4gKi9cbmZ1bmN0aW9uIGdldFBhcmVudE5vZGUoZWxlbWVudCkge1xuICBpZiAoZWxlbWVudC5ub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cbiAgcmV0dXJuIGVsZW1lbnQucGFyZW50Tm9kZSB8fCBlbGVtZW50Lmhvc3Q7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgc2Nyb2xsaW5nIHBhcmVudCBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudH0gc2Nyb2xsIHBhcmVudFxuICovXG5mdW5jdGlvbiBnZXRTY3JvbGxQYXJlbnQoZWxlbWVudCkge1xuICAvLyBSZXR1cm4gYm9keSwgYGdldFNjcm9sbGAgd2lsbCB0YWtlIGNhcmUgdG8gZ2V0IHRoZSBjb3JyZWN0IGBzY3JvbGxUb3BgIGZyb20gaXRcbiAgaWYgKCFlbGVtZW50KSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmJvZHk7XG4gIH1cblxuICBzd2l0Y2ggKGVsZW1lbnQubm9kZU5hbWUpIHtcbiAgICBjYXNlICdIVE1MJzpcbiAgICBjYXNlICdCT0RZJzpcbiAgICAgIHJldHVybiBlbGVtZW50Lm93bmVyRG9jdW1lbnQuYm9keTtcbiAgICBjYXNlICcjZG9jdW1lbnQnOlxuICAgICAgcmV0dXJuIGVsZW1lbnQuYm9keTtcbiAgfVxuXG4gIC8vIEZpcmVmb3ggd2FudCB1cyB0byBjaGVjayBgLXhgIGFuZCBgLXlgIHZhcmlhdGlvbnMgYXMgd2VsbFxuXG4gIHZhciBfZ2V0U3R5bGVDb21wdXRlZFByb3AgPSBnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCksXG4gICAgICBvdmVyZmxvdyA9IF9nZXRTdHlsZUNvbXB1dGVkUHJvcC5vdmVyZmxvdyxcbiAgICAgIG92ZXJmbG93WCA9IF9nZXRTdHlsZUNvbXB1dGVkUHJvcC5vdmVyZmxvd1gsXG4gICAgICBvdmVyZmxvd1kgPSBfZ2V0U3R5bGVDb21wdXRlZFByb3Aub3ZlcmZsb3dZO1xuXG4gIGlmICgvKGF1dG98c2Nyb2xsfG92ZXJsYXkpLy50ZXN0KG92ZXJmbG93ICsgb3ZlcmZsb3dZICsgb3ZlcmZsb3dYKSkge1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgcmV0dXJuIGdldFNjcm9sbFBhcmVudChnZXRQYXJlbnROb2RlKGVsZW1lbnQpKTtcbn1cblxudmFyIGlzSUUxMSA9IGlzQnJvd3NlciQxICYmICEhKHdpbmRvdy5NU0lucHV0TWV0aG9kQ29udGV4dCAmJiBkb2N1bWVudC5kb2N1bWVudE1vZGUpO1xudmFyIGlzSUUxMCA9IGlzQnJvd3NlciQxICYmIC9NU0lFIDEwLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG4vKipcbiAqIERldGVybWluZXMgaWYgdGhlIGJyb3dzZXIgaXMgSW50ZXJuZXQgRXhwbG9yZXJcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBwYXJhbSB7TnVtYmVyfSB2ZXJzaW9uIHRvIGNoZWNrXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gaXNJRVxuICovXG5mdW5jdGlvbiBpc0lFJDEodmVyc2lvbikge1xuICBpZiAodmVyc2lvbiA9PT0gMTEpIHtcbiAgICByZXR1cm4gaXNJRTExO1xuICB9XG4gIGlmICh2ZXJzaW9uID09PSAxMCkge1xuICAgIHJldHVybiBpc0lFMTA7XG4gIH1cbiAgcmV0dXJuIGlzSUUxMSB8fCBpc0lFMTA7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgb2Zmc2V0IHBhcmVudCBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJucyB7RWxlbWVudH0gb2Zmc2V0IHBhcmVudFxuICovXG5mdW5jdGlvbiBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudCkge1xuICBpZiAoIWVsZW1lbnQpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB9XG5cbiAgdmFyIG5vT2Zmc2V0UGFyZW50ID0gaXNJRSQxKDEwKSA/IGRvY3VtZW50LmJvZHkgOiBudWxsO1xuXG4gIC8vIE5PVEU6IDEgRE9NIGFjY2VzcyBoZXJlXG4gIHZhciBvZmZzZXRQYXJlbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcbiAgLy8gU2tpcCBoaWRkZW4gZWxlbWVudHMgd2hpY2ggZG9uJ3QgaGF2ZSBhbiBvZmZzZXRQYXJlbnRcbiAgd2hpbGUgKG9mZnNldFBhcmVudCA9PT0gbm9PZmZzZXRQYXJlbnQgJiYgZWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcpIHtcbiAgICBvZmZzZXRQYXJlbnQgPSAoZWxlbWVudCA9IGVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nKS5vZmZzZXRQYXJlbnQ7XG4gIH1cblxuICB2YXIgbm9kZU5hbWUgPSBvZmZzZXRQYXJlbnQgJiYgb2Zmc2V0UGFyZW50Lm5vZGVOYW1lO1xuXG4gIGlmICghbm9kZU5hbWUgfHwgbm9kZU5hbWUgPT09ICdCT0RZJyB8fCBub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQgPyBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB9XG5cbiAgLy8gLm9mZnNldFBhcmVudCB3aWxsIHJldHVybiB0aGUgY2xvc2VzdCBURCBvciBUQUJMRSBpbiBjYXNlXG4gIC8vIG5vIG9mZnNldFBhcmVudCBpcyBwcmVzZW50LCBJIGhhdGUgdGhpcyBqb2IuLi5cbiAgaWYgKFsnVEQnLCAnVEFCTEUnXS5pbmRleE9mKG9mZnNldFBhcmVudC5ub2RlTmFtZSkgIT09IC0xICYmIGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShvZmZzZXRQYXJlbnQsICdwb3NpdGlvbicpID09PSAnc3RhdGljJykge1xuICAgIHJldHVybiBnZXRPZmZzZXRQYXJlbnQob2Zmc2V0UGFyZW50KTtcbiAgfVxuXG4gIHJldHVybiBvZmZzZXRQYXJlbnQ7XG59XG5cbmZ1bmN0aW9uIGlzT2Zmc2V0Q29udGFpbmVyKGVsZW1lbnQpIHtcbiAgdmFyIG5vZGVOYW1lID0gZWxlbWVudC5ub2RlTmFtZTtcblxuICBpZiAobm9kZU5hbWUgPT09ICdCT0RZJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gbm9kZU5hbWUgPT09ICdIVE1MJyB8fCBnZXRPZmZzZXRQYXJlbnQoZWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZCkgPT09IGVsZW1lbnQ7XG59XG5cbi8qKlxuICogRmluZHMgdGhlIHJvb3Qgbm9kZSAoZG9jdW1lbnQsIHNoYWRvd0RPTSByb290KSBvZiB0aGUgZ2l2ZW4gZWxlbWVudFxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtFbGVtZW50fSBub2RlXG4gKiBAcmV0dXJucyB7RWxlbWVudH0gcm9vdCBub2RlXG4gKi9cbmZ1bmN0aW9uIGdldFJvb3Qobm9kZSkge1xuICBpZiAobm9kZS5wYXJlbnROb2RlICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGdldFJvb3Qobm9kZS5wYXJlbnROb2RlKTtcbiAgfVxuXG4gIHJldHVybiBub2RlO1xufVxuXG4vKipcbiAqIEZpbmRzIHRoZSBvZmZzZXQgcGFyZW50IGNvbW1vbiB0byB0aGUgdHdvIHByb3ZpZGVkIG5vZGVzXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnQxXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnQyXG4gKiBAcmV0dXJucyB7RWxlbWVudH0gY29tbW9uIG9mZnNldCBwYXJlbnRcbiAqL1xuZnVuY3Rpb24gZmluZENvbW1vbk9mZnNldFBhcmVudChlbGVtZW50MSwgZWxlbWVudDIpIHtcbiAgLy8gVGhpcyBjaGVjayBpcyBuZWVkZWQgdG8gYXZvaWQgZXJyb3JzIGluIGNhc2Ugb25lIG9mIHRoZSBlbGVtZW50cyBpc24ndCBkZWZpbmVkIGZvciBhbnkgcmVhc29uXG4gIGlmICghZWxlbWVudDEgfHwgIWVsZW1lbnQxLm5vZGVUeXBlIHx8ICFlbGVtZW50MiB8fCAhZWxlbWVudDIubm9kZVR5cGUpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB9XG5cbiAgLy8gSGVyZSB3ZSBtYWtlIHN1cmUgdG8gZ2l2ZSBhcyBcInN0YXJ0XCIgdGhlIGVsZW1lbnQgdGhhdCBjb21lcyBmaXJzdCBpbiB0aGUgRE9NXG4gIHZhciBvcmRlciA9IGVsZW1lbnQxLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGVsZW1lbnQyKSAmIE5vZGUuRE9DVU1FTlRfUE9TSVRJT05fRk9MTE9XSU5HO1xuICB2YXIgc3RhcnQgPSBvcmRlciA/IGVsZW1lbnQxIDogZWxlbWVudDI7XG4gIHZhciBlbmQgPSBvcmRlciA/IGVsZW1lbnQyIDogZWxlbWVudDE7XG5cbiAgLy8gR2V0IGNvbW1vbiBhbmNlc3RvciBjb250YWluZXJcbiAgdmFyIHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgcmFuZ2Uuc2V0U3RhcnQoc3RhcnQsIDApO1xuICByYW5nZS5zZXRFbmQoZW5kLCAwKTtcbiAgdmFyIGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyID0gcmFuZ2UuY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG5cbiAgLy8gQm90aCBub2RlcyBhcmUgaW5zaWRlICNkb2N1bWVudFxuXG4gIGlmIChlbGVtZW50MSAhPT0gY29tbW9uQW5jZXN0b3JDb250YWluZXIgJiYgZWxlbWVudDIgIT09IGNvbW1vbkFuY2VzdG9yQ29udGFpbmVyIHx8IHN0YXJ0LmNvbnRhaW5zKGVuZCkpIHtcbiAgICBpZiAoaXNPZmZzZXRDb250YWluZXIoY29tbW9uQW5jZXN0b3JDb250YWluZXIpKSB7XG4gICAgICByZXR1cm4gY29tbW9uQW5jZXN0b3JDb250YWluZXI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldE9mZnNldFBhcmVudChjb21tb25BbmNlc3RvckNvbnRhaW5lcik7XG4gIH1cblxuICAvLyBvbmUgb2YgdGhlIG5vZGVzIGlzIGluc2lkZSBzaGFkb3dET00sIGZpbmQgd2hpY2ggb25lXG4gIHZhciBlbGVtZW50MXJvb3QgPSBnZXRSb290KGVsZW1lbnQxKTtcbiAgaWYgKGVsZW1lbnQxcm9vdC5ob3N0KSB7XG4gICAgcmV0dXJuIGZpbmRDb21tb25PZmZzZXRQYXJlbnQoZWxlbWVudDFyb290Lmhvc3QsIGVsZW1lbnQyKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmluZENvbW1vbk9mZnNldFBhcmVudChlbGVtZW50MSwgZ2V0Um9vdChlbGVtZW50MikuaG9zdCk7XG4gIH1cbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBzY3JvbGwgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQgaW4gdGhlIGdpdmVuIHNpZGUgKHRvcCBhbmQgbGVmdClcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxuICogQGFyZ3VtZW50IHtTdHJpbmd9IHNpZGUgYHRvcGAgb3IgYGxlZnRgXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBhbW91bnQgb2Ygc2Nyb2xsZWQgcGl4ZWxzXG4gKi9cbmZ1bmN0aW9uIGdldFNjcm9sbChlbGVtZW50KSB7XG4gIHZhciBzaWRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAndG9wJztcblxuICB2YXIgdXBwZXJTaWRlID0gc2lkZSA9PT0gJ3RvcCcgPyAnc2Nyb2xsVG9wJyA6ICdzY3JvbGxMZWZ0JztcbiAgdmFyIG5vZGVOYW1lID0gZWxlbWVudC5ub2RlTmFtZTtcblxuICBpZiAobm9kZU5hbWUgPT09ICdCT0RZJyB8fCBub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XG4gICAgdmFyIGh0bWwgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIHZhciBzY3JvbGxpbmdFbGVtZW50ID0gZWxlbWVudC5vd25lckRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQgfHwgaHRtbDtcbiAgICByZXR1cm4gc2Nyb2xsaW5nRWxlbWVudFt1cHBlclNpZGVdO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnRbdXBwZXJTaWRlXTtcbn1cblxuLypcbiAqIFN1bSBvciBzdWJ0cmFjdCB0aGUgZWxlbWVudCBzY3JvbGwgdmFsdWVzIChsZWZ0IGFuZCB0b3ApIGZyb20gYSBnaXZlbiByZWN0IG9iamVjdFxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQHBhcmFtIHtPYmplY3R9IHJlY3QgLSBSZWN0IG9iamVjdCB5b3Ugd2FudCB0byBjaGFuZ2VcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgZWxlbWVudCBmcm9tIHRoZSBmdW5jdGlvbiByZWFkcyB0aGUgc2Nyb2xsIHZhbHVlc1xuICogQHBhcmFtIHtCb29sZWFufSBzdWJ0cmFjdCAtIHNldCB0byB0cnVlIGlmIHlvdSB3YW50IHRvIHN1YnRyYWN0IHRoZSBzY3JvbGwgdmFsdWVzXG4gKiBAcmV0dXJuIHtPYmplY3R9IHJlY3QgLSBUaGUgbW9kaWZpZXIgcmVjdCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gaW5jbHVkZVNjcm9sbChyZWN0LCBlbGVtZW50KSB7XG4gIHZhciBzdWJ0cmFjdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XG5cbiAgdmFyIHNjcm9sbFRvcCA9IGdldFNjcm9sbChlbGVtZW50LCAndG9wJyk7XG4gIHZhciBzY3JvbGxMZWZ0ID0gZ2V0U2Nyb2xsKGVsZW1lbnQsICdsZWZ0Jyk7XG4gIHZhciBtb2RpZmllciA9IHN1YnRyYWN0ID8gLTEgOiAxO1xuICByZWN0LnRvcCArPSBzY3JvbGxUb3AgKiBtb2RpZmllcjtcbiAgcmVjdC5ib3R0b20gKz0gc2Nyb2xsVG9wICogbW9kaWZpZXI7XG4gIHJlY3QubGVmdCArPSBzY3JvbGxMZWZ0ICogbW9kaWZpZXI7XG4gIHJlY3QucmlnaHQgKz0gc2Nyb2xsTGVmdCAqIG1vZGlmaWVyO1xuICByZXR1cm4gcmVjdDtcbn1cblxuLypcbiAqIEhlbHBlciB0byBkZXRlY3QgYm9yZGVycyBvZiBhIGdpdmVuIGVsZW1lbnRcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBwYXJhbSB7Q1NTU3R5bGVEZWNsYXJhdGlvbn0gc3R5bGVzXG4gKiBSZXN1bHQgb2YgYGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eWAgb24gdGhlIGdpdmVuIGVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBheGlzIC0gYHhgIG9yIGB5YFxuICogQHJldHVybiB7bnVtYmVyfSBib3JkZXJzIC0gVGhlIGJvcmRlcnMgc2l6ZSBvZiB0aGUgZ2l2ZW4gYXhpc1xuICovXG5cbmZ1bmN0aW9uIGdldEJvcmRlcnNTaXplKHN0eWxlcywgYXhpcykge1xuICB2YXIgc2lkZUEgPSBheGlzID09PSAneCcgPyAnTGVmdCcgOiAnVG9wJztcbiAgdmFyIHNpZGVCID0gc2lkZUEgPT09ICdMZWZ0JyA/ICdSaWdodCcgOiAnQm90dG9tJztcblxuICByZXR1cm4gcGFyc2VGbG9hdChzdHlsZXNbJ2JvcmRlcicgKyBzaWRlQSArICdXaWR0aCddLCAxMCkgKyBwYXJzZUZsb2F0KHN0eWxlc1snYm9yZGVyJyArIHNpZGVCICsgJ1dpZHRoJ10sIDEwKTtcbn1cblxuZnVuY3Rpb24gZ2V0U2l6ZShheGlzLCBib2R5LCBodG1sLCBjb21wdXRlZFN0eWxlKSB7XG4gIHJldHVybiBNYXRoLm1heChib2R5WydvZmZzZXQnICsgYXhpc10sIGJvZHlbJ3Njcm9sbCcgKyBheGlzXSwgaHRtbFsnY2xpZW50JyArIGF4aXNdLCBodG1sWydvZmZzZXQnICsgYXhpc10sIGh0bWxbJ3Njcm9sbCcgKyBheGlzXSwgaXNJRSQxKDEwKSA/IGh0bWxbJ29mZnNldCcgKyBheGlzXSArIGNvbXB1dGVkU3R5bGVbJ21hcmdpbicgKyAoYXhpcyA9PT0gJ0hlaWdodCcgPyAnVG9wJyA6ICdMZWZ0JyldICsgY29tcHV0ZWRTdHlsZVsnbWFyZ2luJyArIChheGlzID09PSAnSGVpZ2h0JyA/ICdCb3R0b20nIDogJ1JpZ2h0JyldIDogMCk7XG59XG5cbmZ1bmN0aW9uIGdldFdpbmRvd1NpemVzKCkge1xuICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gIHZhciBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB2YXIgY29tcHV0ZWRTdHlsZSA9IGlzSUUkMSgxMCkgJiYgZ2V0Q29tcHV0ZWRTdHlsZShodG1sKTtcblxuICByZXR1cm4ge1xuICAgIGhlaWdodDogZ2V0U2l6ZSgnSGVpZ2h0JywgYm9keSwgaHRtbCwgY29tcHV0ZWRTdHlsZSksXG4gICAgd2lkdGg6IGdldFNpemUoJ1dpZHRoJywgYm9keSwgaHRtbCwgY29tcHV0ZWRTdHlsZSlcbiAgfTtcbn1cblxudmFyIGNsYXNzQ2FsbENoZWNrJDEgPSBmdW5jdGlvbiBjbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59O1xuXG52YXIgY3JlYXRlQ2xhc3MkMSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfTtcbn0oKTtcblxudmFyIGRlZmluZVByb3BlcnR5JDEgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufTtcblxudmFyIF9leHRlbmRzJDEgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxuLyoqXG4gKiBHaXZlbiBlbGVtZW50IG9mZnNldHMsIGdlbmVyYXRlIGFuIG91dHB1dCBzaW1pbGFyIHRvIGdldEJvdW5kaW5nQ2xpZW50UmVjdFxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtPYmplY3R9IG9mZnNldHNcbiAqIEByZXR1cm5zIHtPYmplY3R9IENsaWVudFJlY3QgbGlrZSBvdXRwdXRcbiAqL1xuZnVuY3Rpb24gZ2V0Q2xpZW50UmVjdChvZmZzZXRzKSB7XG4gIHJldHVybiBfZXh0ZW5kcyQxKHt9LCBvZmZzZXRzLCB7XG4gICAgcmlnaHQ6IG9mZnNldHMubGVmdCArIG9mZnNldHMud2lkdGgsXG4gICAgYm90dG9tOiBvZmZzZXRzLnRvcCArIG9mZnNldHMuaGVpZ2h0XG4gIH0pO1xufVxuXG4vKipcbiAqIEdldCBib3VuZGluZyBjbGllbnQgcmVjdCBvZiBnaXZlbiBlbGVtZW50XG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJuIHtPYmplY3R9IGNsaWVudCByZWN0XG4gKi9cbmZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50KSB7XG4gIHZhciByZWN0ID0ge307XG5cbiAgLy8gSUUxMCAxMCBGSVg6IFBsZWFzZSwgZG9uJ3QgYXNrLCB0aGUgZWxlbWVudCBpc24ndFxuICAvLyBjb25zaWRlcmVkIGluIERPTSBpbiBzb21lIGNpcmN1bXN0YW5jZXMuLi5cbiAgLy8gVGhpcyBpc24ndCByZXByb2R1Y2libGUgaW4gSUUxMCBjb21wYXRpYmlsaXR5IG1vZGUgb2YgSUUxMVxuICB0cnkge1xuICAgIGlmIChpc0lFJDEoMTApKSB7XG4gICAgICByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHZhciBzY3JvbGxUb3AgPSBnZXRTY3JvbGwoZWxlbWVudCwgJ3RvcCcpO1xuICAgICAgdmFyIHNjcm9sbExlZnQgPSBnZXRTY3JvbGwoZWxlbWVudCwgJ2xlZnQnKTtcbiAgICAgIHJlY3QudG9wICs9IHNjcm9sbFRvcDtcbiAgICAgIHJlY3QubGVmdCArPSBzY3JvbGxMZWZ0O1xuICAgICAgcmVjdC5ib3R0b20gKz0gc2Nyb2xsVG9wO1xuICAgICAgcmVjdC5yaWdodCArPSBzY3JvbGxMZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBsZWZ0OiByZWN0LmxlZnQsXG4gICAgdG9wOiByZWN0LnRvcCxcbiAgICB3aWR0aDogcmVjdC5yaWdodCAtIHJlY3QubGVmdCxcbiAgICBoZWlnaHQ6IHJlY3QuYm90dG9tIC0gcmVjdC50b3BcbiAgfTtcblxuICAvLyBzdWJ0cmFjdCBzY3JvbGxiYXIgc2l6ZSBmcm9tIHNpemVzXG4gIHZhciBzaXplcyA9IGVsZW1lbnQubm9kZU5hbWUgPT09ICdIVE1MJyA/IGdldFdpbmRvd1NpemVzKCkgOiB7fTtcbiAgdmFyIHdpZHRoID0gc2l6ZXMud2lkdGggfHwgZWxlbWVudC5jbGllbnRXaWR0aCB8fCByZXN1bHQucmlnaHQgLSByZXN1bHQubGVmdDtcbiAgdmFyIGhlaWdodCA9IHNpemVzLmhlaWdodCB8fCBlbGVtZW50LmNsaWVudEhlaWdodCB8fCByZXN1bHQuYm90dG9tIC0gcmVzdWx0LnRvcDtcblxuICB2YXIgaG9yaXpTY3JvbGxiYXIgPSBlbGVtZW50Lm9mZnNldFdpZHRoIC0gd2lkdGg7XG4gIHZhciB2ZXJ0U2Nyb2xsYmFyID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgLSBoZWlnaHQ7XG5cbiAgLy8gaWYgYW4gaHlwb3RoZXRpY2FsIHNjcm9sbGJhciBpcyBkZXRlY3RlZCwgd2UgbXVzdCBiZSBzdXJlIGl0J3Mgbm90IGEgYGJvcmRlcmBcbiAgLy8gd2UgbWFrZSB0aGlzIGNoZWNrIGNvbmRpdGlvbmFsIGZvciBwZXJmb3JtYW5jZSByZWFzb25zXG4gIGlmIChob3JpelNjcm9sbGJhciB8fCB2ZXJ0U2Nyb2xsYmFyKSB7XG4gICAgdmFyIHN0eWxlcyA9IGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShlbGVtZW50KTtcbiAgICBob3JpelNjcm9sbGJhciAtPSBnZXRCb3JkZXJzU2l6ZShzdHlsZXMsICd4Jyk7XG4gICAgdmVydFNjcm9sbGJhciAtPSBnZXRCb3JkZXJzU2l6ZShzdHlsZXMsICd5Jyk7XG5cbiAgICByZXN1bHQud2lkdGggLT0gaG9yaXpTY3JvbGxiYXI7XG4gICAgcmVzdWx0LmhlaWdodCAtPSB2ZXJ0U2Nyb2xsYmFyO1xuICB9XG5cbiAgcmV0dXJuIGdldENsaWVudFJlY3QocmVzdWx0KTtcbn1cblxuZnVuY3Rpb24gZ2V0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcmJpdHJhcnlOb2RlKGNoaWxkcmVuLCBwYXJlbnQpIHtcbiAgdmFyIGZpeGVkUG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IGZhbHNlO1xuXG4gIHZhciBpc0lFMTAgPSBpc0lFJDEoMTApO1xuICB2YXIgaXNIVE1MID0gcGFyZW50Lm5vZGVOYW1lID09PSAnSFRNTCc7XG4gIHZhciBjaGlsZHJlblJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QoY2hpbGRyZW4pO1xuICB2YXIgcGFyZW50UmVjdCA9IGdldEJvdW5kaW5nQ2xpZW50UmVjdChwYXJlbnQpO1xuICB2YXIgc2Nyb2xsUGFyZW50ID0gZ2V0U2Nyb2xsUGFyZW50KGNoaWxkcmVuKTtcblxuICB2YXIgc3R5bGVzID0gZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KHBhcmVudCk7XG4gIHZhciBib3JkZXJUb3BXaWR0aCA9IHBhcnNlRmxvYXQoc3R5bGVzLmJvcmRlclRvcFdpZHRoLCAxMCk7XG4gIHZhciBib3JkZXJMZWZ0V2lkdGggPSBwYXJzZUZsb2F0KHN0eWxlcy5ib3JkZXJMZWZ0V2lkdGgsIDEwKTtcblxuICAvLyBJbiBjYXNlcyB3aGVyZSB0aGUgcGFyZW50IGlzIGZpeGVkLCB3ZSBtdXN0IGlnbm9yZSBuZWdhdGl2ZSBzY3JvbGwgaW4gb2Zmc2V0IGNhbGNcbiAgaWYgKGZpeGVkUG9zaXRpb24gJiYgcGFyZW50Lm5vZGVOYW1lID09PSAnSFRNTCcpIHtcbiAgICBwYXJlbnRSZWN0LnRvcCA9IE1hdGgubWF4KHBhcmVudFJlY3QudG9wLCAwKTtcbiAgICBwYXJlbnRSZWN0LmxlZnQgPSBNYXRoLm1heChwYXJlbnRSZWN0LmxlZnQsIDApO1xuICB9XG4gIHZhciBvZmZzZXRzID0gZ2V0Q2xpZW50UmVjdCh7XG4gICAgdG9wOiBjaGlsZHJlblJlY3QudG9wIC0gcGFyZW50UmVjdC50b3AgLSBib3JkZXJUb3BXaWR0aCxcbiAgICBsZWZ0OiBjaGlsZHJlblJlY3QubGVmdCAtIHBhcmVudFJlY3QubGVmdCAtIGJvcmRlckxlZnRXaWR0aCxcbiAgICB3aWR0aDogY2hpbGRyZW5SZWN0LndpZHRoLFxuICAgIGhlaWdodDogY2hpbGRyZW5SZWN0LmhlaWdodFxuICB9KTtcbiAgb2Zmc2V0cy5tYXJnaW5Ub3AgPSAwO1xuICBvZmZzZXRzLm1hcmdpbkxlZnQgPSAwO1xuXG4gIC8vIFN1YnRyYWN0IG1hcmdpbnMgb2YgZG9jdW1lbnRFbGVtZW50IGluIGNhc2UgaXQncyBiZWluZyB1c2VkIGFzIHBhcmVudFxuICAvLyB3ZSBkbyB0aGlzIG9ubHkgb24gSFRNTCBiZWNhdXNlIGl0J3MgdGhlIG9ubHkgZWxlbWVudCB0aGF0IGJlaGF2ZXNcbiAgLy8gZGlmZmVyZW50bHkgd2hlbiBtYXJnaW5zIGFyZSBhcHBsaWVkIHRvIGl0LiBUaGUgbWFyZ2lucyBhcmUgaW5jbHVkZWQgaW5cbiAgLy8gdGhlIGJveCBvZiB0aGUgZG9jdW1lbnRFbGVtZW50LCBpbiB0aGUgb3RoZXIgY2FzZXMgbm90LlxuICBpZiAoIWlzSUUxMCAmJiBpc0hUTUwpIHtcbiAgICB2YXIgbWFyZ2luVG9wID0gcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luVG9wLCAxMCk7XG4gICAgdmFyIG1hcmdpbkxlZnQgPSBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5MZWZ0LCAxMCk7XG5cbiAgICBvZmZzZXRzLnRvcCAtPSBib3JkZXJUb3BXaWR0aCAtIG1hcmdpblRvcDtcbiAgICBvZmZzZXRzLmJvdHRvbSAtPSBib3JkZXJUb3BXaWR0aCAtIG1hcmdpblRvcDtcbiAgICBvZmZzZXRzLmxlZnQgLT0gYm9yZGVyTGVmdFdpZHRoIC0gbWFyZ2luTGVmdDtcbiAgICBvZmZzZXRzLnJpZ2h0IC09IGJvcmRlckxlZnRXaWR0aCAtIG1hcmdpbkxlZnQ7XG5cbiAgICAvLyBBdHRhY2ggbWFyZ2luVG9wIGFuZCBtYXJnaW5MZWZ0IGJlY2F1c2UgaW4gc29tZSBjaXJjdW1zdGFuY2VzIHdlIG1heSBuZWVkIHRoZW1cbiAgICBvZmZzZXRzLm1hcmdpblRvcCA9IG1hcmdpblRvcDtcbiAgICBvZmZzZXRzLm1hcmdpbkxlZnQgPSBtYXJnaW5MZWZ0O1xuICB9XG5cbiAgaWYgKGlzSUUxMCAmJiAhZml4ZWRQb3NpdGlvbiA/IHBhcmVudC5jb250YWlucyhzY3JvbGxQYXJlbnQpIDogcGFyZW50ID09PSBzY3JvbGxQYXJlbnQgJiYgc2Nyb2xsUGFyZW50Lm5vZGVOYW1lICE9PSAnQk9EWScpIHtcbiAgICBvZmZzZXRzID0gaW5jbHVkZVNjcm9sbChvZmZzZXRzLCBwYXJlbnQpO1xuICB9XG5cbiAgcmV0dXJuIG9mZnNldHM7XG59XG5cbmZ1bmN0aW9uIGdldFZpZXdwb3J0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcnRiaXRyYXJ5Tm9kZShlbGVtZW50KSB7XG4gIHZhciBleGNsdWRlU2Nyb2xsID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBmYWxzZTtcblxuICB2YXIgaHRtbCA9IGVsZW1lbnQub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIHZhciByZWxhdGl2ZU9mZnNldCA9IGdldE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJiaXRyYXJ5Tm9kZShlbGVtZW50LCBodG1sKTtcbiAgdmFyIHdpZHRoID0gTWF0aC5tYXgoaHRtbC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XG4gIHZhciBoZWlnaHQgPSBNYXRoLm1heChodG1sLmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApO1xuXG4gIHZhciBzY3JvbGxUb3AgPSAhZXhjbHVkZVNjcm9sbCA/IGdldFNjcm9sbChodG1sKSA6IDA7XG4gIHZhciBzY3JvbGxMZWZ0ID0gIWV4Y2x1ZGVTY3JvbGwgPyBnZXRTY3JvbGwoaHRtbCwgJ2xlZnQnKSA6IDA7XG5cbiAgdmFyIG9mZnNldCA9IHtcbiAgICB0b3A6IHNjcm9sbFRvcCAtIHJlbGF0aXZlT2Zmc2V0LnRvcCArIHJlbGF0aXZlT2Zmc2V0Lm1hcmdpblRvcCxcbiAgICBsZWZ0OiBzY3JvbGxMZWZ0IC0gcmVsYXRpdmVPZmZzZXQubGVmdCArIHJlbGF0aXZlT2Zmc2V0Lm1hcmdpbkxlZnQsXG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0XG4gIH07XG5cbiAgcmV0dXJuIGdldENsaWVudFJlY3Qob2Zmc2V0KTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBmaXhlZCBvciBpcyBpbnNpZGUgYSBmaXhlZCBwYXJlbnRcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxuICogQGFyZ3VtZW50IHtFbGVtZW50fSBjdXN0b21Db250YWluZXJcbiAqIEByZXR1cm5zIHtCb29sZWFufSBhbnN3ZXIgdG8gXCJpc0ZpeGVkP1wiXG4gKi9cbmZ1bmN0aW9uIGlzRml4ZWQoZWxlbWVudCkge1xuICB2YXIgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lO1xuICBpZiAobm9kZU5hbWUgPT09ICdCT0RZJyB8fCBub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChnZXRTdHlsZUNvbXB1dGVkUHJvcGVydHkoZWxlbWVudCwgJ3Bvc2l0aW9uJykgPT09ICdmaXhlZCcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gaXNGaXhlZChnZXRQYXJlbnROb2RlKGVsZW1lbnQpKTtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgZmlyc3QgcGFyZW50IG9mIGFuIGVsZW1lbnQgdGhhdCBoYXMgYSB0cmFuc2Zvcm1lZCBwcm9wZXJ0eSBkZWZpbmVkXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEByZXR1cm5zIHtFbGVtZW50fSBmaXJzdCB0cmFuc2Zvcm1lZCBwYXJlbnQgb3IgZG9jdW1lbnRFbGVtZW50XG4gKi9cblxuZnVuY3Rpb24gZ2V0Rml4ZWRQb3NpdGlvbk9mZnNldFBhcmVudChlbGVtZW50KSB7XG4gIC8vIFRoaXMgY2hlY2sgaXMgbmVlZGVkIHRvIGF2b2lkIGVycm9ycyBpbiBjYXNlIG9uZSBvZiB0aGUgZWxlbWVudHMgaXNuJ3QgZGVmaW5lZCBmb3IgYW55IHJlYXNvblxuICBpZiAoIWVsZW1lbnQgfHwgIWVsZW1lbnQucGFyZW50RWxlbWVudCB8fCBpc0lFJDEoKSkge1xuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIH1cbiAgdmFyIGVsID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICB3aGlsZSAoZWwgJiYgZ2V0U3R5bGVDb21wdXRlZFByb3BlcnR5KGVsLCAndHJhbnNmb3JtJykgPT09ICdub25lJykge1xuICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcbiAgfVxuICByZXR1cm4gZWwgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xufVxuXG4vKipcbiAqIENvbXB1dGVkIHRoZSBib3VuZGFyaWVzIGxpbWl0cyBhbmQgcmV0dXJuIHRoZW1cbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHBlclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcmVmZXJlbmNlXG4gKiBAcGFyYW0ge251bWJlcn0gcGFkZGluZ1xuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gYm91bmRhcmllc0VsZW1lbnQgLSBFbGVtZW50IHVzZWQgdG8gZGVmaW5lIHRoZSBib3VuZGFyaWVzXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGZpeGVkUG9zaXRpb24gLSBJcyBpbiBmaXhlZCBwb3NpdGlvbiBtb2RlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBDb29yZGluYXRlcyBvZiB0aGUgYm91bmRhcmllc1xuICovXG5mdW5jdGlvbiBnZXRCb3VuZGFyaWVzKHBvcHBlciwgcmVmZXJlbmNlLCBwYWRkaW5nLCBib3VuZGFyaWVzRWxlbWVudCkge1xuICB2YXIgZml4ZWRQb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogZmFsc2U7XG5cbiAgLy8gTk9URTogMSBET00gYWNjZXNzIGhlcmVcblxuICB2YXIgYm91bmRhcmllcyA9IHsgdG9wOiAwLCBsZWZ0OiAwIH07XG4gIHZhciBvZmZzZXRQYXJlbnQgPSBmaXhlZFBvc2l0aW9uID8gZ2V0Rml4ZWRQb3NpdGlvbk9mZnNldFBhcmVudChwb3BwZXIpIDogZmluZENvbW1vbk9mZnNldFBhcmVudChwb3BwZXIsIHJlZmVyZW5jZSk7XG5cbiAgLy8gSGFuZGxlIHZpZXdwb3J0IGNhc2VcbiAgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAndmlld3BvcnQnKSB7XG4gICAgYm91bmRhcmllcyA9IGdldFZpZXdwb3J0T2Zmc2V0UmVjdFJlbGF0aXZlVG9BcnRiaXRyYXJ5Tm9kZShvZmZzZXRQYXJlbnQsIGZpeGVkUG9zaXRpb24pO1xuICB9IGVsc2Uge1xuICAgIC8vIEhhbmRsZSBvdGhlciBjYXNlcyBiYXNlZCBvbiBET00gZWxlbWVudCB1c2VkIGFzIGJvdW5kYXJpZXNcbiAgICB2YXIgYm91bmRhcmllc05vZGUgPSB2b2lkIDA7XG4gICAgaWYgKGJvdW5kYXJpZXNFbGVtZW50ID09PSAnc2Nyb2xsUGFyZW50Jykge1xuICAgICAgYm91bmRhcmllc05vZGUgPSBnZXRTY3JvbGxQYXJlbnQoZ2V0UGFyZW50Tm9kZShyZWZlcmVuY2UpKTtcbiAgICAgIGlmIChib3VuZGFyaWVzTm9kZS5ub2RlTmFtZSA9PT0gJ0JPRFknKSB7XG4gICAgICAgIGJvdW5kYXJpZXNOb2RlID0gcG9wcGVyLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYm91bmRhcmllc0VsZW1lbnQgPT09ICd3aW5kb3cnKSB7XG4gICAgICBib3VuZGFyaWVzTm9kZSA9IHBvcHBlci5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgYm91bmRhcmllc05vZGUgPSBib3VuZGFyaWVzRWxlbWVudDtcbiAgICB9XG5cbiAgICB2YXIgb2Zmc2V0cyA9IGdldE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJiaXRyYXJ5Tm9kZShib3VuZGFyaWVzTm9kZSwgb2Zmc2V0UGFyZW50LCBmaXhlZFBvc2l0aW9uKTtcblxuICAgIC8vIEluIGNhc2Ugb2YgSFRNTCwgd2UgbmVlZCBhIGRpZmZlcmVudCBjb21wdXRhdGlvblxuICAgIGlmIChib3VuZGFyaWVzTm9kZS5ub2RlTmFtZSA9PT0gJ0hUTUwnICYmICFpc0ZpeGVkKG9mZnNldFBhcmVudCkpIHtcbiAgICAgIHZhciBfZ2V0V2luZG93U2l6ZXMgPSBnZXRXaW5kb3dTaXplcygpLFxuICAgICAgICAgIGhlaWdodCA9IF9nZXRXaW5kb3dTaXplcy5oZWlnaHQsXG4gICAgICAgICAgd2lkdGggPSBfZ2V0V2luZG93U2l6ZXMud2lkdGg7XG5cbiAgICAgIGJvdW5kYXJpZXMudG9wICs9IG9mZnNldHMudG9wIC0gb2Zmc2V0cy5tYXJnaW5Ub3A7XG4gICAgICBib3VuZGFyaWVzLmJvdHRvbSA9IGhlaWdodCArIG9mZnNldHMudG9wO1xuICAgICAgYm91bmRhcmllcy5sZWZ0ICs9IG9mZnNldHMubGVmdCAtIG9mZnNldHMubWFyZ2luTGVmdDtcbiAgICAgIGJvdW5kYXJpZXMucmlnaHQgPSB3aWR0aCArIG9mZnNldHMubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZm9yIGFsbCB0aGUgb3RoZXIgRE9NIGVsZW1lbnRzLCB0aGlzIG9uZSBpcyBnb29kXG4gICAgICBib3VuZGFyaWVzID0gb2Zmc2V0cztcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgcGFkZGluZ3NcbiAgYm91bmRhcmllcy5sZWZ0ICs9IHBhZGRpbmc7XG4gIGJvdW5kYXJpZXMudG9wICs9IHBhZGRpbmc7XG4gIGJvdW5kYXJpZXMucmlnaHQgLT0gcGFkZGluZztcbiAgYm91bmRhcmllcy5ib3R0b20gLT0gcGFkZGluZztcblxuICByZXR1cm4gYm91bmRhcmllcztcbn1cblxuZnVuY3Rpb24gZ2V0QXJlYShfcmVmKSB7XG4gIHZhciB3aWR0aCA9IF9yZWYud2lkdGgsXG4gICAgICBoZWlnaHQgPSBfcmVmLmhlaWdodDtcblxuICByZXR1cm4gd2lkdGggKiBoZWlnaHQ7XG59XG5cbi8qKlxuICogVXRpbGl0eSB1c2VkIHRvIHRyYW5zZm9ybSB0aGUgYGF1dG9gIHBsYWNlbWVudCB0byB0aGUgcGxhY2VtZW50IHdpdGggbW9yZVxuICogYXZhaWxhYmxlIHNwYWNlLlxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IHVwZGF0ZSBtZXRob2RcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcbiAqL1xuZnVuY3Rpb24gY29tcHV0ZUF1dG9QbGFjZW1lbnQocGxhY2VtZW50LCByZWZSZWN0LCBwb3BwZXIsIHJlZmVyZW5jZSwgYm91bmRhcmllc0VsZW1lbnQpIHtcbiAgdmFyIHBhZGRpbmcgPSBhcmd1bWVudHMubGVuZ3RoID4gNSAmJiBhcmd1bWVudHNbNV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s1XSA6IDA7XG5cbiAgaWYgKHBsYWNlbWVudC5pbmRleE9mKCdhdXRvJykgPT09IC0xKSB7XG4gICAgcmV0dXJuIHBsYWNlbWVudDtcbiAgfVxuXG4gIHZhciBib3VuZGFyaWVzID0gZ2V0Qm91bmRhcmllcyhwb3BwZXIsIHJlZmVyZW5jZSwgcGFkZGluZywgYm91bmRhcmllc0VsZW1lbnQpO1xuXG4gIHZhciByZWN0cyA9IHtcbiAgICB0b3A6IHtcbiAgICAgIHdpZHRoOiBib3VuZGFyaWVzLndpZHRoLFxuICAgICAgaGVpZ2h0OiByZWZSZWN0LnRvcCAtIGJvdW5kYXJpZXMudG9wXG4gICAgfSxcbiAgICByaWdodDoge1xuICAgICAgd2lkdGg6IGJvdW5kYXJpZXMucmlnaHQgLSByZWZSZWN0LnJpZ2h0LFxuICAgICAgaGVpZ2h0OiBib3VuZGFyaWVzLmhlaWdodFxuICAgIH0sXG4gICAgYm90dG9tOiB7XG4gICAgICB3aWR0aDogYm91bmRhcmllcy53aWR0aCxcbiAgICAgIGhlaWdodDogYm91bmRhcmllcy5ib3R0b20gLSByZWZSZWN0LmJvdHRvbVxuICAgIH0sXG4gICAgbGVmdDoge1xuICAgICAgd2lkdGg6IHJlZlJlY3QubGVmdCAtIGJvdW5kYXJpZXMubGVmdCxcbiAgICAgIGhlaWdodDogYm91bmRhcmllcy5oZWlnaHRcbiAgICB9XG4gIH07XG5cbiAgdmFyIHNvcnRlZEFyZWFzID0gT2JqZWN0LmtleXMocmVjdHMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIF9leHRlbmRzJDEoe1xuICAgICAga2V5OiBrZXlcbiAgICB9LCByZWN0c1trZXldLCB7XG4gICAgICBhcmVhOiBnZXRBcmVhKHJlY3RzW2tleV0pXG4gICAgfSk7XG4gIH0pLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gYi5hcmVhIC0gYS5hcmVhO1xuICB9KTtcblxuICB2YXIgZmlsdGVyZWRBcmVhcyA9IHNvcnRlZEFyZWFzLmZpbHRlcihmdW5jdGlvbiAoX3JlZjIpIHtcbiAgICB2YXIgd2lkdGggPSBfcmVmMi53aWR0aCxcbiAgICAgICAgaGVpZ2h0ID0gX3JlZjIuaGVpZ2h0O1xuICAgIHJldHVybiB3aWR0aCA+PSBwb3BwZXIuY2xpZW50V2lkdGggJiYgaGVpZ2h0ID49IHBvcHBlci5jbGllbnRIZWlnaHQ7XG4gIH0pO1xuXG4gIHZhciBjb21wdXRlZFBsYWNlbWVudCA9IGZpbHRlcmVkQXJlYXMubGVuZ3RoID4gMCA/IGZpbHRlcmVkQXJlYXNbMF0ua2V5IDogc29ydGVkQXJlYXNbMF0ua2V5O1xuXG4gIHZhciB2YXJpYXRpb24gPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVsxXTtcblxuICByZXR1cm4gY29tcHV0ZWRQbGFjZW1lbnQgKyAodmFyaWF0aW9uID8gJy0nICsgdmFyaWF0aW9uIDogJycpO1xufVxuXG4vKipcbiAqIEdldCBvZmZzZXRzIHRvIHRoZSByZWZlcmVuY2UgZWxlbWVudFxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBvcHBlciAtIHRoZSBwb3BwZXIgZWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50fSByZWZlcmVuY2UgLSB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgKHRoZSBwb3BwZXIgd2lsbCBiZSByZWxhdGl2ZSB0byB0aGlzKVxuICogQHBhcmFtIHtFbGVtZW50fSBmaXhlZFBvc2l0aW9uIC0gaXMgaW4gZml4ZWQgcG9zaXRpb24gbW9kZVxuICogQHJldHVybnMge09iamVjdH0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9mZnNldHMgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXJcbiAqL1xuZnVuY3Rpb24gZ2V0UmVmZXJlbmNlT2Zmc2V0cyhzdGF0ZSwgcG9wcGVyLCByZWZlcmVuY2UpIHtcbiAgdmFyIGZpeGVkUG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IG51bGw7XG5cbiAgdmFyIGNvbW1vbk9mZnNldFBhcmVudCA9IGZpeGVkUG9zaXRpb24gPyBnZXRGaXhlZFBvc2l0aW9uT2Zmc2V0UGFyZW50KHBvcHBlcikgOiBmaW5kQ29tbW9uT2Zmc2V0UGFyZW50KHBvcHBlciwgcmVmZXJlbmNlKTtcbiAgcmV0dXJuIGdldE9mZnNldFJlY3RSZWxhdGl2ZVRvQXJiaXRyYXJ5Tm9kZShyZWZlcmVuY2UsIGNvbW1vbk9mZnNldFBhcmVudCwgZml4ZWRQb3NpdGlvbik7XG59XG5cbi8qKlxuICogR2V0IHRoZSBvdXRlciBzaXplcyBvZiB0aGUgZ2l2ZW4gZWxlbWVudCAob2Zmc2V0IHNpemUgKyBtYXJnaW5zKVxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBvYmplY3QgY29udGFpbmluZyB3aWR0aCBhbmQgaGVpZ2h0IHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gZ2V0T3V0ZXJTaXplcyhlbGVtZW50KSB7XG4gIHZhciBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICB2YXIgeCA9IHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpblRvcCkgKyBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5Cb3R0b20pO1xuICB2YXIgeSA9IHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpbkxlZnQpICsgcGFyc2VGbG9hdChzdHlsZXMubWFyZ2luUmlnaHQpO1xuICB2YXIgcmVzdWx0ID0ge1xuICAgIHdpZHRoOiBlbGVtZW50Lm9mZnNldFdpZHRoICsgeSxcbiAgICBoZWlnaHQ6IGVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgeFxuICB9O1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldCB0aGUgb3Bwb3NpdGUgcGxhY2VtZW50IG9mIHRoZSBnaXZlbiBvbmVcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwbGFjZW1lbnRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IGZsaXBwZWQgcGxhY2VtZW50XG4gKi9cbmZ1bmN0aW9uIGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCkge1xuICB2YXIgaGFzaCA9IHsgbGVmdDogJ3JpZ2h0JywgcmlnaHQ6ICdsZWZ0JywgYm90dG9tOiAndG9wJywgdG9wOiAnYm90dG9tJyB9O1xuICByZXR1cm4gcGxhY2VtZW50LnJlcGxhY2UoL2xlZnR8cmlnaHR8Ym90dG9tfHRvcC9nLCBmdW5jdGlvbiAobWF0Y2hlZCkge1xuICAgIHJldHVybiBoYXNoW21hdGNoZWRdO1xuICB9KTtcbn1cblxuLyoqXG4gKiBHZXQgb2Zmc2V0cyB0byB0aGUgcG9wcGVyXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAcGFyYW0ge09iamVjdH0gcG9zaXRpb24gLSBDU1MgcG9zaXRpb24gdGhlIFBvcHBlciB3aWxsIGdldCBhcHBsaWVkXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwb3BwZXIgLSB0aGUgcG9wcGVyIGVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWZlcmVuY2VPZmZzZXRzIC0gdGhlIHJlZmVyZW5jZSBvZmZzZXRzICh0aGUgcG9wcGVyIHdpbGwgYmUgcmVsYXRpdmUgdG8gdGhpcylcbiAqIEBwYXJhbSB7U3RyaW5nfSBwbGFjZW1lbnQgLSBvbmUgb2YgdGhlIHZhbGlkIHBsYWNlbWVudCBvcHRpb25zXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBwb3BwZXJPZmZzZXRzIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9mZnNldHMgd2hpY2ggd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXJcbiAqL1xuZnVuY3Rpb24gZ2V0UG9wcGVyT2Zmc2V0cyhwb3BwZXIsIHJlZmVyZW5jZU9mZnNldHMsIHBsYWNlbWVudCkge1xuICBwbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcblxuICAvLyBHZXQgcG9wcGVyIG5vZGUgc2l6ZXNcbiAgdmFyIHBvcHBlclJlY3QgPSBnZXRPdXRlclNpemVzKHBvcHBlcik7XG5cbiAgLy8gQWRkIHBvc2l0aW9uLCB3aWR0aCBhbmQgaGVpZ2h0IHRvIG91ciBvZmZzZXRzIG9iamVjdFxuICB2YXIgcG9wcGVyT2Zmc2V0cyA9IHtcbiAgICB3aWR0aDogcG9wcGVyUmVjdC53aWR0aCxcbiAgICBoZWlnaHQ6IHBvcHBlclJlY3QuaGVpZ2h0XG4gIH07XG5cbiAgLy8gZGVwZW5kaW5nIGJ5IHRoZSBwb3BwZXIgcGxhY2VtZW50IHdlIGhhdmUgdG8gY29tcHV0ZSBpdHMgb2Zmc2V0cyBzbGlnaHRseSBkaWZmZXJlbnRseVxuICB2YXIgaXNIb3JpeiA9IFsncmlnaHQnLCAnbGVmdCddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTE7XG4gIHZhciBtYWluU2lkZSA9IGlzSG9yaXogPyAndG9wJyA6ICdsZWZ0JztcbiAgdmFyIHNlY29uZGFyeVNpZGUgPSBpc0hvcml6ID8gJ2xlZnQnIDogJ3RvcCc7XG4gIHZhciBtZWFzdXJlbWVudCA9IGlzSG9yaXogPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG4gIHZhciBzZWNvbmRhcnlNZWFzdXJlbWVudCA9ICFpc0hvcml6ID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuXG4gIHBvcHBlck9mZnNldHNbbWFpblNpZGVdID0gcmVmZXJlbmNlT2Zmc2V0c1ttYWluU2lkZV0gKyByZWZlcmVuY2VPZmZzZXRzW21lYXN1cmVtZW50XSAvIDIgLSBwb3BwZXJSZWN0W21lYXN1cmVtZW50XSAvIDI7XG4gIGlmIChwbGFjZW1lbnQgPT09IHNlY29uZGFyeVNpZGUpIHtcbiAgICBwb3BwZXJPZmZzZXRzW3NlY29uZGFyeVNpZGVdID0gcmVmZXJlbmNlT2Zmc2V0c1tzZWNvbmRhcnlTaWRlXSAtIHBvcHBlclJlY3Rbc2Vjb25kYXJ5TWVhc3VyZW1lbnRdO1xuICB9IGVsc2Uge1xuICAgIHBvcHBlck9mZnNldHNbc2Vjb25kYXJ5U2lkZV0gPSByZWZlcmVuY2VPZmZzZXRzW2dldE9wcG9zaXRlUGxhY2VtZW50KHNlY29uZGFyeVNpZGUpXTtcbiAgfVxuXG4gIHJldHVybiBwb3BwZXJPZmZzZXRzO1xufVxuXG4vKipcbiAqIE1pbWljcyB0aGUgYGZpbmRgIG1ldGhvZCBvZiBBcnJheVxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtBcnJheX0gYXJyXG4gKiBAYXJndW1lbnQgcHJvcFxuICogQGFyZ3VtZW50IHZhbHVlXG4gKiBAcmV0dXJucyBpbmRleCBvciAtMVxuICovXG5mdW5jdGlvbiBmaW5kKGFyciwgY2hlY2spIHtcbiAgLy8gdXNlIG5hdGl2ZSBmaW5kIGlmIHN1cHBvcnRlZFxuICBpZiAoQXJyYXkucHJvdG90eXBlLmZpbmQpIHtcbiAgICByZXR1cm4gYXJyLmZpbmQoY2hlY2spO1xuICB9XG5cbiAgLy8gdXNlIGBmaWx0ZXJgIHRvIG9idGFpbiB0aGUgc2FtZSBiZWhhdmlvciBvZiBgZmluZGBcbiAgcmV0dXJuIGFyci5maWx0ZXIoY2hlY2spWzBdO1xufVxuXG4vKipcbiAqIFJldHVybiB0aGUgaW5kZXggb2YgdGhlIG1hdGNoaW5nIG9iamVjdFxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtBcnJheX0gYXJyXG4gKiBAYXJndW1lbnQgcHJvcFxuICogQGFyZ3VtZW50IHZhbHVlXG4gKiBAcmV0dXJucyBpbmRleCBvciAtMVxuICovXG5mdW5jdGlvbiBmaW5kSW5kZXgoYXJyLCBwcm9wLCB2YWx1ZSkge1xuICAvLyB1c2UgbmF0aXZlIGZpbmRJbmRleCBpZiBzdXBwb3J0ZWRcbiAgaWYgKEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgpIHtcbiAgICByZXR1cm4gYXJyLmZpbmRJbmRleChmdW5jdGlvbiAoY3VyKSB7XG4gICAgICByZXR1cm4gY3VyW3Byb3BdID09PSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHVzZSBgZmluZGAgKyBgaW5kZXhPZmAgaWYgYGZpbmRJbmRleGAgaXNuJ3Qgc3VwcG9ydGVkXG4gIHZhciBtYXRjaCA9IGZpbmQoYXJyLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIG9ialtwcm9wXSA9PT0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gYXJyLmluZGV4T2YobWF0Y2gpO1xufVxuXG4vKipcbiAqIExvb3AgdHJvdWdoIHRoZSBsaXN0IG9mIG1vZGlmaWVycyBhbmQgcnVuIHRoZW0gaW4gb3JkZXIsXG4gKiBlYWNoIG9mIHRoZW0gd2lsbCB0aGVuIGVkaXQgdGhlIGRhdGEgb2JqZWN0LlxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQHBhcmFtIHtkYXRhT2JqZWN0fSBkYXRhXG4gKiBAcGFyYW0ge0FycmF5fSBtb2RpZmllcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBlbmRzIC0gT3B0aW9uYWwgbW9kaWZpZXIgbmFtZSB1c2VkIGFzIHN0b3BwZXJcbiAqIEByZXR1cm5zIHtkYXRhT2JqZWN0fVxuICovXG5mdW5jdGlvbiBydW5Nb2RpZmllcnMobW9kaWZpZXJzLCBkYXRhLCBlbmRzKSB7XG4gIHZhciBtb2RpZmllcnNUb1J1biA9IGVuZHMgPT09IHVuZGVmaW5lZCA/IG1vZGlmaWVycyA6IG1vZGlmaWVycy5zbGljZSgwLCBmaW5kSW5kZXgobW9kaWZpZXJzLCAnbmFtZScsIGVuZHMpKTtcblxuICBtb2RpZmllcnNUb1J1bi5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIGlmIChtb2RpZmllclsnZnVuY3Rpb24nXSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBkb3Qtbm90YXRpb25cbiAgICAgIGNvbnNvbGUud2FybignYG1vZGlmaWVyLmZ1bmN0aW9uYCBpcyBkZXByZWNhdGVkLCB1c2UgYG1vZGlmaWVyLmZuYCEnKTtcbiAgICB9XG4gICAgdmFyIGZuID0gbW9kaWZpZXJbJ2Z1bmN0aW9uJ10gfHwgbW9kaWZpZXIuZm47IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZG90LW5vdGF0aW9uXG4gICAgaWYgKG1vZGlmaWVyLmVuYWJsZWQgJiYgaXNGdW5jdGlvbihmbikpIHtcbiAgICAgIC8vIEFkZCBwcm9wZXJ0aWVzIHRvIG9mZnNldHMgdG8gbWFrZSB0aGVtIGEgY29tcGxldGUgY2xpZW50UmVjdCBvYmplY3RcbiAgICAgIC8vIHdlIGRvIHRoaXMgYmVmb3JlIGVhY2ggbW9kaWZpZXIgdG8gbWFrZSBzdXJlIHRoZSBwcmV2aW91cyBvbmUgZG9lc24ndFxuICAgICAgLy8gbWVzcyB3aXRoIHRoZXNlIHZhbHVlc1xuICAgICAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IGdldENsaWVudFJlY3QoZGF0YS5vZmZzZXRzLnBvcHBlcik7XG4gICAgICBkYXRhLm9mZnNldHMucmVmZXJlbmNlID0gZ2V0Q2xpZW50UmVjdChkYXRhLm9mZnNldHMucmVmZXJlbmNlKTtcblxuICAgICAgZGF0YSA9IGZuKGRhdGEsIG1vZGlmaWVyKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBwb3BwZXIsIGNvbXB1dGluZyB0aGUgbmV3IG9mZnNldHMgYW5kIGFwcGx5aW5nXG4gKiB0aGUgbmV3IHN0eWxlLjxiciAvPlxuICogUHJlZmVyIGBzY2hlZHVsZVVwZGF0ZWAgb3ZlciBgdXBkYXRlYCBiZWNhdXNlIG9mIHBlcmZvcm1hbmNlIHJlYXNvbnMuXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgLy8gaWYgcG9wcGVyIGlzIGRlc3Ryb3llZCwgZG9uJ3QgcGVyZm9ybSBhbnkgZnVydGhlciB1cGRhdGVcbiAgaWYgKHRoaXMuc3RhdGUuaXNEZXN0cm95ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgZGF0YSA9IHtcbiAgICBpbnN0YW5jZTogdGhpcyxcbiAgICBzdHlsZXM6IHt9LFxuICAgIGFycm93U3R5bGVzOiB7fSxcbiAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICBmbGlwcGVkOiBmYWxzZSxcbiAgICBvZmZzZXRzOiB7fVxuICB9O1xuXG4gIC8vIGNvbXB1dGUgcmVmZXJlbmNlIGVsZW1lbnQgb2Zmc2V0c1xuICBkYXRhLm9mZnNldHMucmVmZXJlbmNlID0gZ2V0UmVmZXJlbmNlT2Zmc2V0cyh0aGlzLnN0YXRlLCB0aGlzLnBvcHBlciwgdGhpcy5yZWZlcmVuY2UsIHRoaXMub3B0aW9ucy5wb3NpdGlvbkZpeGVkKTtcblxuICAvLyBjb21wdXRlIGF1dG8gcGxhY2VtZW50LCBzdG9yZSBwbGFjZW1lbnQgaW5zaWRlIHRoZSBkYXRhIG9iamVjdCxcbiAgLy8gbW9kaWZpZXJzIHdpbGwgYmUgYWJsZSB0byBlZGl0IGBwbGFjZW1lbnRgIGlmIG5lZWRlZFxuICAvLyBhbmQgcmVmZXIgdG8gb3JpZ2luYWxQbGFjZW1lbnQgdG8ga25vdyB0aGUgb3JpZ2luYWwgdmFsdWVcbiAgZGF0YS5wbGFjZW1lbnQgPSBjb21wdXRlQXV0b1BsYWNlbWVudCh0aGlzLm9wdGlvbnMucGxhY2VtZW50LCBkYXRhLm9mZnNldHMucmVmZXJlbmNlLCB0aGlzLnBvcHBlciwgdGhpcy5yZWZlcmVuY2UsIHRoaXMub3B0aW9ucy5tb2RpZmllcnMuZmxpcC5ib3VuZGFyaWVzRWxlbWVudCwgdGhpcy5vcHRpb25zLm1vZGlmaWVycy5mbGlwLnBhZGRpbmcpO1xuXG4gIC8vIHN0b3JlIHRoZSBjb21wdXRlZCBwbGFjZW1lbnQgaW5zaWRlIGBvcmlnaW5hbFBsYWNlbWVudGBcbiAgZGF0YS5vcmlnaW5hbFBsYWNlbWVudCA9IGRhdGEucGxhY2VtZW50O1xuXG4gIGRhdGEucG9zaXRpb25GaXhlZCA9IHRoaXMub3B0aW9ucy5wb3NpdGlvbkZpeGVkO1xuXG4gIC8vIGNvbXB1dGUgdGhlIHBvcHBlciBvZmZzZXRzXG4gIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBnZXRQb3BwZXJPZmZzZXRzKHRoaXMucG9wcGVyLCBkYXRhLm9mZnNldHMucmVmZXJlbmNlLCBkYXRhLnBsYWNlbWVudCk7XG5cbiAgZGF0YS5vZmZzZXRzLnBvcHBlci5wb3NpdGlvbiA9IHRoaXMub3B0aW9ucy5wb3NpdGlvbkZpeGVkID8gJ2ZpeGVkJyA6ICdhYnNvbHV0ZSc7XG5cbiAgLy8gcnVuIHRoZSBtb2RpZmllcnNcbiAgZGF0YSA9IHJ1bk1vZGlmaWVycyh0aGlzLm1vZGlmaWVycywgZGF0YSk7XG5cbiAgLy8gdGhlIGZpcnN0IGB1cGRhdGVgIHdpbGwgY2FsbCBgb25DcmVhdGVgIGNhbGxiYWNrXG4gIC8vIHRoZSBvdGhlciBvbmVzIHdpbGwgY2FsbCBgb25VcGRhdGVgIGNhbGxiYWNrXG4gIGlmICghdGhpcy5zdGF0ZS5pc0NyZWF0ZWQpIHtcbiAgICB0aGlzLnN0YXRlLmlzQ3JlYXRlZCA9IHRydWU7XG4gICAgdGhpcy5vcHRpb25zLm9uQ3JlYXRlKGRhdGEpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMub3B0aW9ucy5vblVwZGF0ZShkYXRhKTtcbiAgfVxufVxuXG4vKipcbiAqIEhlbHBlciB1c2VkIHRvIGtub3cgaWYgdGhlIGdpdmVuIG1vZGlmaWVyIGlzIGVuYWJsZWQuXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNNb2RpZmllckVuYWJsZWQobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpIHtcbiAgcmV0dXJuIG1vZGlmaWVycy5zb21lKGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgdmFyIG5hbWUgPSBfcmVmLm5hbWUsXG4gICAgICAgIGVuYWJsZWQgPSBfcmVmLmVuYWJsZWQ7XG4gICAgcmV0dXJuIGVuYWJsZWQgJiYgbmFtZSA9PT0gbW9kaWZpZXJOYW1lO1xuICB9KTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHByZWZpeGVkIHN1cHBvcnRlZCBwcm9wZXJ0eSBuYW1lXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge1N0cmluZ30gcHJvcGVydHkgKGNhbWVsQ2FzZSlcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHByZWZpeGVkIHByb3BlcnR5IChjYW1lbENhc2Ugb3IgUGFzY2FsQ2FzZSwgZGVwZW5kaW5nIG9uIHRoZSB2ZW5kb3IgcHJlZml4KVxuICovXG5mdW5jdGlvbiBnZXRTdXBwb3J0ZWRQcm9wZXJ0eU5hbWUocHJvcGVydHkpIHtcbiAgdmFyIHByZWZpeGVzID0gW2ZhbHNlLCAnbXMnLCAnV2Via2l0JywgJ01veicsICdPJ107XG4gIHZhciB1cHBlclByb3AgPSBwcm9wZXJ0eS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnNsaWNlKDEpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcHJlZml4ID0gcHJlZml4ZXNbaV07XG4gICAgdmFyIHRvQ2hlY2sgPSBwcmVmaXggPyAnJyArIHByZWZpeCArIHVwcGVyUHJvcCA6IHByb3BlcnR5O1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuYm9keS5zdHlsZVt0b0NoZWNrXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB0b0NoZWNrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBEZXN0cm95IHRoZSBwb3BwZXJcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXJcbiAqL1xuZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgdGhpcy5zdGF0ZS5pc0Rlc3Ryb3llZCA9IHRydWU7XG5cbiAgLy8gdG91Y2ggRE9NIG9ubHkgaWYgYGFwcGx5U3R5bGVgIG1vZGlmaWVyIGlzIGVuYWJsZWRcbiAgaWYgKGlzTW9kaWZpZXJFbmFibGVkKHRoaXMubW9kaWZpZXJzLCAnYXBwbHlTdHlsZScpKSB7XG4gICAgdGhpcy5wb3BwZXIucmVtb3ZlQXR0cmlidXRlKCd4LXBsYWNlbWVudCcpO1xuICAgIHRoaXMucG9wcGVyLnN0eWxlLnBvc2l0aW9uID0gJyc7XG4gICAgdGhpcy5wb3BwZXIuc3R5bGUudG9wID0gJyc7XG4gICAgdGhpcy5wb3BwZXIuc3R5bGUubGVmdCA9ICcnO1xuICAgIHRoaXMucG9wcGVyLnN0eWxlLnJpZ2h0ID0gJyc7XG4gICAgdGhpcy5wb3BwZXIuc3R5bGUuYm90dG9tID0gJyc7XG4gICAgdGhpcy5wb3BwZXIuc3R5bGUud2lsbENoYW5nZSA9ICcnO1xuICAgIHRoaXMucG9wcGVyLnN0eWxlW2dldFN1cHBvcnRlZFByb3BlcnR5TmFtZSgndHJhbnNmb3JtJyldID0gJyc7XG4gIH1cblxuICB0aGlzLmRpc2FibGVFdmVudExpc3RlbmVycygpO1xuXG4gIC8vIHJlbW92ZSB0aGUgcG9wcGVyIGlmIHVzZXIgZXhwbGljaXR5IGFza2VkIGZvciB0aGUgZGVsZXRpb24gb24gZGVzdHJveVxuICAvLyBkbyBub3QgdXNlIGByZW1vdmVgIGJlY2F1c2UgSUUxMSBkb2Vzbid0IHN1cHBvcnQgaXRcbiAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdmVPbkRlc3Ryb3kpIHtcbiAgICB0aGlzLnBvcHBlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMucG9wcGVyKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHdpbmRvdyBhc3NvY2lhdGVkIHdpdGggdGhlIGVsZW1lbnRcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybnMge1dpbmRvd31cbiAqL1xuZnVuY3Rpb24gZ2V0V2luZG93KGVsZW1lbnQpIHtcbiAgdmFyIG93bmVyRG9jdW1lbnQgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQ7XG4gIHJldHVybiBvd25lckRvY3VtZW50ID8gb3duZXJEb2N1bWVudC5kZWZhdWx0VmlldyA6IHdpbmRvdztcbn1cblxuZnVuY3Rpb24gYXR0YWNoVG9TY3JvbGxQYXJlbnRzKHNjcm9sbFBhcmVudCwgZXZlbnQsIGNhbGxiYWNrLCBzY3JvbGxQYXJlbnRzKSB7XG4gIHZhciBpc0JvZHkgPSBzY3JvbGxQYXJlbnQubm9kZU5hbWUgPT09ICdCT0RZJztcbiAgdmFyIHRhcmdldCA9IGlzQm9keSA/IHNjcm9sbFBhcmVudC5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IDogc2Nyb2xsUGFyZW50O1xuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2ssIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcblxuICBpZiAoIWlzQm9keSkge1xuICAgIGF0dGFjaFRvU2Nyb2xsUGFyZW50cyhnZXRTY3JvbGxQYXJlbnQodGFyZ2V0LnBhcmVudE5vZGUpLCBldmVudCwgY2FsbGJhY2ssIHNjcm9sbFBhcmVudHMpO1xuICB9XG4gIHNjcm9sbFBhcmVudHMucHVzaCh0YXJnZXQpO1xufVxuXG4vKipcbiAqIFNldHVwIG5lZWRlZCBldmVudCBsaXN0ZW5lcnMgdXNlZCB0byB1cGRhdGUgdGhlIHBvcHBlciBwb3NpdGlvblxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gc2V0dXBFdmVudExpc3RlbmVycyhyZWZlcmVuY2UsIG9wdGlvbnMsIHN0YXRlLCB1cGRhdGVCb3VuZCkge1xuICAvLyBSZXNpemUgZXZlbnQgbGlzdGVuZXIgb24gd2luZG93XG4gIHN0YXRlLnVwZGF0ZUJvdW5kID0gdXBkYXRlQm91bmQ7XG4gIGdldFdpbmRvdyhyZWZlcmVuY2UpLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHN0YXRlLnVwZGF0ZUJvdW5kLCB7IHBhc3NpdmU6IHRydWUgfSk7XG5cbiAgLy8gU2Nyb2xsIGV2ZW50IGxpc3RlbmVyIG9uIHNjcm9sbCBwYXJlbnRzXG4gIHZhciBzY3JvbGxFbGVtZW50ID0gZ2V0U2Nyb2xsUGFyZW50KHJlZmVyZW5jZSk7XG4gIGF0dGFjaFRvU2Nyb2xsUGFyZW50cyhzY3JvbGxFbGVtZW50LCAnc2Nyb2xsJywgc3RhdGUudXBkYXRlQm91bmQsIHN0YXRlLnNjcm9sbFBhcmVudHMpO1xuICBzdGF0ZS5zY3JvbGxFbGVtZW50ID0gc2Nyb2xsRWxlbWVudDtcbiAgc3RhdGUuZXZlbnRzRW5hYmxlZCA9IHRydWU7XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuXG4vKipcbiAqIEl0IHdpbGwgYWRkIHJlc2l6ZS9zY3JvbGwgZXZlbnRzIGFuZCBzdGFydCByZWNhbGN1bGF0aW5nXG4gKiBwb3NpdGlvbiBvZiB0aGUgcG9wcGVyIGVsZW1lbnQgd2hlbiB0aGV5IGFyZSB0cmlnZ2VyZWQuXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyXG4gKi9cbmZ1bmN0aW9uIGVuYWJsZUV2ZW50TGlzdGVuZXJzKCkge1xuICBpZiAoIXRoaXMuc3RhdGUuZXZlbnRzRW5hYmxlZCkge1xuICAgIHRoaXMuc3RhdGUgPSBzZXR1cEV2ZW50TGlzdGVuZXJzKHRoaXMucmVmZXJlbmNlLCB0aGlzLm9wdGlvbnMsIHRoaXMuc3RhdGUsIHRoaXMuc2NoZWR1bGVVcGRhdGUpO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyB1c2VkIHRvIHVwZGF0ZSB0aGUgcG9wcGVyIHBvc2l0aW9uXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycyhyZWZlcmVuY2UsIHN0YXRlKSB7XG4gIC8vIFJlbW92ZSByZXNpemUgZXZlbnQgbGlzdGVuZXIgb24gd2luZG93XG4gIGdldFdpbmRvdyhyZWZlcmVuY2UpLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHN0YXRlLnVwZGF0ZUJvdW5kKTtcblxuICAvLyBSZW1vdmUgc2Nyb2xsIGV2ZW50IGxpc3RlbmVyIG9uIHNjcm9sbCBwYXJlbnRzXG4gIHN0YXRlLnNjcm9sbFBhcmVudHMuZm9yRWFjaChmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHN0YXRlLnVwZGF0ZUJvdW5kKTtcbiAgfSk7XG5cbiAgLy8gUmVzZXQgc3RhdGVcbiAgc3RhdGUudXBkYXRlQm91bmQgPSBudWxsO1xuICBzdGF0ZS5zY3JvbGxQYXJlbnRzID0gW107XG4gIHN0YXRlLnNjcm9sbEVsZW1lbnQgPSBudWxsO1xuICBzdGF0ZS5ldmVudHNFbmFibGVkID0gZmFsc2U7XG4gIHJldHVybiBzdGF0ZTtcbn1cblxuLyoqXG4gKiBJdCB3aWxsIHJlbW92ZSByZXNpemUvc2Nyb2xsIGV2ZW50cyBhbmQgd29uJ3QgcmVjYWxjdWxhdGUgcG9wcGVyIHBvc2l0aW9uXG4gKiB3aGVuIHRoZXkgYXJlIHRyaWdnZXJlZC4gSXQgYWxzbyB3b24ndCB0cmlnZ2VyIG9uVXBkYXRlIGNhbGxiYWNrIGFueW1vcmUsXG4gKiB1bmxlc3MgeW91IGNhbGwgYHVwZGF0ZWAgbWV0aG9kIG1hbnVhbGx5LlxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlclxuICovXG5mdW5jdGlvbiBkaXNhYmxlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gIGlmICh0aGlzLnN0YXRlLmV2ZW50c0VuYWJsZWQpIHtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnNjaGVkdWxlVXBkYXRlKTtcbiAgICB0aGlzLnN0YXRlID0gcmVtb3ZlRXZlbnRMaXN0ZW5lcnModGhpcy5yZWZlcmVuY2UsIHRoaXMuc3RhdGUpO1xuICB9XG59XG5cbi8qKlxuICogVGVsbHMgaWYgYSBnaXZlbiBpbnB1dCBpcyBhIG51bWJlclxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQHBhcmFtIHsqfSBpbnB1dCB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaXNOdW1lcmljKG4pIHtcbiAgcmV0dXJuIG4gIT09ICcnICYmICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbn1cblxuLyoqXG4gKiBTZXQgdGhlIHN0eWxlIHRvIHRoZSBnaXZlbiBwb3BwZXJcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBhcmd1bWVudCB7RWxlbWVudH0gZWxlbWVudCAtIEVsZW1lbnQgdG8gYXBwbHkgdGhlIHN0eWxlIHRvXG4gKiBAYXJndW1lbnQge09iamVjdH0gc3R5bGVzXG4gKiBPYmplY3Qgd2l0aCBhIGxpc3Qgb2YgcHJvcGVydGllcyBhbmQgdmFsdWVzIHdoaWNoIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZWxlbWVudFxuICovXG5mdW5jdGlvbiBzZXRTdHlsZXMoZWxlbWVudCwgc3R5bGVzKSB7XG4gIE9iamVjdC5rZXlzKHN0eWxlcykuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgIHZhciB1bml0ID0gJyc7XG4gICAgLy8gYWRkIHVuaXQgaWYgdGhlIHZhbHVlIGlzIG51bWVyaWMgYW5kIGlzIG9uZSBvZiB0aGUgZm9sbG93aW5nXG4gICAgaWYgKFsnd2lkdGgnLCAnaGVpZ2h0JywgJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddLmluZGV4T2YocHJvcCkgIT09IC0xICYmIGlzTnVtZXJpYyhzdHlsZXNbcHJvcF0pKSB7XG4gICAgICB1bml0ID0gJ3B4JztcbiAgICB9XG4gICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IHN0eWxlc1twcm9wXSArIHVuaXQ7XG4gIH0pO1xufVxuXG4vKipcbiAqIFNldCB0aGUgYXR0cmlidXRlcyB0byB0aGUgZ2l2ZW4gcG9wcGVyXG4gKiBAbWV0aG9kXG4gKiBAbWVtYmVyb2YgUG9wcGVyLlV0aWxzXG4gKiBAYXJndW1lbnQge0VsZW1lbnR9IGVsZW1lbnQgLSBFbGVtZW50IHRvIGFwcGx5IHRoZSBhdHRyaWJ1dGVzIHRvXG4gKiBAYXJndW1lbnQge09iamVjdH0gc3R5bGVzXG4gKiBPYmplY3Qgd2l0aCBhIGxpc3Qgb2YgcHJvcGVydGllcyBhbmQgdmFsdWVzIHdoaWNoIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgZWxlbWVudFxuICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcbiAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgIHZhciB2YWx1ZSA9IGF0dHJpYnV0ZXNbcHJvcF07XG4gICAgaWYgKHZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cmlidXRlc1twcm9wXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKHByb3ApO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YS5zdHlsZXMgLSBMaXN0IG9mIHN0eWxlIHByb3BlcnRpZXMgLSB2YWx1ZXMgdG8gYXBwbHkgdG8gcG9wcGVyIGVsZW1lbnRcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhLmF0dHJpYnV0ZXMgLSBMaXN0IG9mIGF0dHJpYnV0ZSBwcm9wZXJ0aWVzIC0gdmFsdWVzIHRvIGFwcGx5IHRvIHBvcHBlciBlbGVtZW50XG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgc2FtZSBkYXRhIG9iamVjdFxuICovXG5mdW5jdGlvbiBhcHBseVN0eWxlKGRhdGEpIHtcbiAgLy8gYW55IHByb3BlcnR5IHByZXNlbnQgaW4gYGRhdGEuc3R5bGVzYCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlcixcbiAgLy8gaW4gdGhpcyB3YXkgd2UgY2FuIG1ha2UgdGhlIDNyZCBwYXJ0eSBtb2RpZmllcnMgYWRkIGN1c3RvbSBzdHlsZXMgdG8gaXRcbiAgLy8gQmUgYXdhcmUsIG1vZGlmaWVycyBjb3VsZCBvdmVycmlkZSB0aGUgcHJvcGVydGllcyBkZWZpbmVkIGluIHRoZSBwcmV2aW91c1xuICAvLyBsaW5lcyBvZiB0aGlzIG1vZGlmaWVyIVxuICBzZXRTdHlsZXMoZGF0YS5pbnN0YW5jZS5wb3BwZXIsIGRhdGEuc3R5bGVzKTtcblxuICAvLyBhbnkgcHJvcGVydHkgcHJlc2VudCBpbiBgZGF0YS5hdHRyaWJ1dGVzYCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlcixcbiAgLy8gdGhleSB3aWxsIGJlIHNldCBhcyBIVE1MIGF0dHJpYnV0ZXMgb2YgdGhlIGVsZW1lbnRcbiAgc2V0QXR0cmlidXRlcyhkYXRhLmluc3RhbmNlLnBvcHBlciwgZGF0YS5hdHRyaWJ1dGVzKTtcblxuICAvLyBpZiBhcnJvd0VsZW1lbnQgaXMgZGVmaW5lZCBhbmQgYXJyb3dTdHlsZXMgaGFzIHNvbWUgcHJvcGVydGllc1xuICBpZiAoZGF0YS5hcnJvd0VsZW1lbnQgJiYgT2JqZWN0LmtleXMoZGF0YS5hcnJvd1N0eWxlcykubGVuZ3RoKSB7XG4gICAgc2V0U3R5bGVzKGRhdGEuYXJyb3dFbGVtZW50LCBkYXRhLmFycm93U3R5bGVzKTtcbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIFNldCB0aGUgeC1wbGFjZW1lbnQgYXR0cmlidXRlIGJlZm9yZSBldmVyeXRoaW5nIGVsc2UgYmVjYXVzZSBpdCBjb3VsZCBiZSB1c2VkXG4gKiB0byBhZGQgbWFyZ2lucyB0byB0aGUgcG9wcGVyIG1hcmdpbnMgbmVlZHMgdG8gYmUgY2FsY3VsYXRlZCB0byBnZXQgdGhlXG4gKiBjb3JyZWN0IHBvcHBlciBvZmZzZXRzLlxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5tb2RpZmllcnNcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHJlZmVyZW5jZSAtIFRoZSByZWZlcmVuY2UgZWxlbWVudCB1c2VkIHRvIHBvc2l0aW9uIHRoZSBwb3BwZXJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHBlciAtIFRoZSBIVE1MIGVsZW1lbnQgdXNlZCBhcyBwb3BwZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gUG9wcGVyLmpzIG9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gYXBwbHlTdHlsZU9uTG9hZChyZWZlcmVuY2UsIHBvcHBlciwgb3B0aW9ucywgbW9kaWZpZXJPcHRpb25zLCBzdGF0ZSkge1xuICAvLyBjb21wdXRlIHJlZmVyZW5jZSBlbGVtZW50IG9mZnNldHNcbiAgdmFyIHJlZmVyZW5jZU9mZnNldHMgPSBnZXRSZWZlcmVuY2VPZmZzZXRzKHN0YXRlLCBwb3BwZXIsIHJlZmVyZW5jZSwgb3B0aW9ucy5wb3NpdGlvbkZpeGVkKTtcblxuICAvLyBjb21wdXRlIGF1dG8gcGxhY2VtZW50LCBzdG9yZSBwbGFjZW1lbnQgaW5zaWRlIHRoZSBkYXRhIG9iamVjdCxcbiAgLy8gbW9kaWZpZXJzIHdpbGwgYmUgYWJsZSB0byBlZGl0IGBwbGFjZW1lbnRgIGlmIG5lZWRlZFxuICAvLyBhbmQgcmVmZXIgdG8gb3JpZ2luYWxQbGFjZW1lbnQgdG8ga25vdyB0aGUgb3JpZ2luYWwgdmFsdWVcbiAgdmFyIHBsYWNlbWVudCA9IGNvbXB1dGVBdXRvUGxhY2VtZW50KG9wdGlvbnMucGxhY2VtZW50LCByZWZlcmVuY2VPZmZzZXRzLCBwb3BwZXIsIHJlZmVyZW5jZSwgb3B0aW9ucy5tb2RpZmllcnMuZmxpcC5ib3VuZGFyaWVzRWxlbWVudCwgb3B0aW9ucy5tb2RpZmllcnMuZmxpcC5wYWRkaW5nKTtcblxuICBwb3BwZXIuc2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcsIHBsYWNlbWVudCk7XG5cbiAgLy8gQXBwbHkgYHBvc2l0aW9uYCB0byBwb3BwZXIgYmVmb3JlIGFueXRoaW5nIGVsc2UgYmVjYXVzZVxuICAvLyB3aXRob3V0IHRoZSBwb3NpdGlvbiBhcHBsaWVkIHdlIGNhbid0IGd1YXJhbnRlZSBjb3JyZWN0IGNvbXB1dGF0aW9uc1xuICBzZXRTdHlsZXMocG9wcGVyLCB7IHBvc2l0aW9uOiBvcHRpb25zLnBvc2l0aW9uRml4ZWQgPyAnZml4ZWQnIDogJ2Fic29sdXRlJyB9KTtcblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBgdXBkYXRlYCBtZXRob2RcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcbiAqL1xuZnVuY3Rpb24gY29tcHV0ZVN0eWxlKGRhdGEsIG9wdGlvbnMpIHtcbiAgdmFyIHggPSBvcHRpb25zLngsXG4gICAgICB5ID0gb3B0aW9ucy55O1xuICB2YXIgcG9wcGVyID0gZGF0YS5vZmZzZXRzLnBvcHBlcjtcblxuICAvLyBSZW1vdmUgdGhpcyBsZWdhY3kgc3VwcG9ydCBpbiBQb3BwZXIuanMgdjJcblxuICB2YXIgbGVnYWN5R3B1QWNjZWxlcmF0aW9uT3B0aW9uID0gZmluZChkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgcmV0dXJuIG1vZGlmaWVyLm5hbWUgPT09ICdhcHBseVN0eWxlJztcbiAgfSkuZ3B1QWNjZWxlcmF0aW9uO1xuICBpZiAobGVnYWN5R3B1QWNjZWxlcmF0aW9uT3B0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zb2xlLndhcm4oJ1dBUk5JTkc6IGBncHVBY2NlbGVyYXRpb25gIG9wdGlvbiBtb3ZlZCB0byBgY29tcHV0ZVN0eWxlYCBtb2RpZmllciBhbmQgd2lsbCBub3QgYmUgc3VwcG9ydGVkIGluIGZ1dHVyZSB2ZXJzaW9ucyBvZiBQb3BwZXIuanMhJyk7XG4gIH1cbiAgdmFyIGdwdUFjY2VsZXJhdGlvbiA9IGxlZ2FjeUdwdUFjY2VsZXJhdGlvbk9wdGlvbiAhPT0gdW5kZWZpbmVkID8gbGVnYWN5R3B1QWNjZWxlcmF0aW9uT3B0aW9uIDogb3B0aW9ucy5ncHVBY2NlbGVyYXRpb247XG5cbiAgdmFyIG9mZnNldFBhcmVudCA9IGdldE9mZnNldFBhcmVudChkYXRhLmluc3RhbmNlLnBvcHBlcik7XG4gIHZhciBvZmZzZXRQYXJlbnRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KG9mZnNldFBhcmVudCk7XG5cbiAgLy8gU3R5bGVzXG4gIHZhciBzdHlsZXMgPSB7XG4gICAgcG9zaXRpb246IHBvcHBlci5wb3NpdGlvblxuICB9O1xuXG4gIC8vIEF2b2lkIGJsdXJyeSB0ZXh0IGJ5IHVzaW5nIGZ1bGwgcGl4ZWwgaW50ZWdlcnMuXG4gIC8vIEZvciBwaXhlbC1wZXJmZWN0IHBvc2l0aW9uaW5nLCB0b3AvYm90dG9tIHByZWZlcnMgcm91bmRlZFxuICAvLyB2YWx1ZXMsIHdoaWxlIGxlZnQvcmlnaHQgcHJlZmVycyBmbG9vcmVkIHZhbHVlcy5cbiAgdmFyIG9mZnNldHMgPSB7XG4gICAgbGVmdDogTWF0aC5mbG9vcihwb3BwZXIubGVmdCksXG4gICAgdG9wOiBNYXRoLnJvdW5kKHBvcHBlci50b3ApLFxuICAgIGJvdHRvbTogTWF0aC5yb3VuZChwb3BwZXIuYm90dG9tKSxcbiAgICByaWdodDogTWF0aC5mbG9vcihwb3BwZXIucmlnaHQpXG4gIH07XG5cbiAgdmFyIHNpZGVBID0geCA9PT0gJ2JvdHRvbScgPyAndG9wJyA6ICdib3R0b20nO1xuICB2YXIgc2lkZUIgPSB5ID09PSAncmlnaHQnID8gJ2xlZnQnIDogJ3JpZ2h0JztcblxuICAvLyBpZiBncHVBY2NlbGVyYXRpb24gaXMgc2V0IHRvIGB0cnVlYCBhbmQgdHJhbnNmb3JtIGlzIHN1cHBvcnRlZCxcbiAgLy8gIHdlIHVzZSBgdHJhbnNsYXRlM2RgIHRvIGFwcGx5IHRoZSBwb3NpdGlvbiB0byB0aGUgcG9wcGVyIHdlXG4gIC8vIGF1dG9tYXRpY2FsbHkgdXNlIHRoZSBzdXBwb3J0ZWQgcHJlZml4ZWQgdmVyc2lvbiBpZiBuZWVkZWRcbiAgdmFyIHByZWZpeGVkUHJvcGVydHkgPSBnZXRTdXBwb3J0ZWRQcm9wZXJ0eU5hbWUoJ3RyYW5zZm9ybScpO1xuXG4gIC8vIG5vdywgbGV0J3MgbWFrZSBhIHN0ZXAgYmFjayBhbmQgbG9vayBhdCB0aGlzIGNvZGUgY2xvc2VseSAod3RmPylcbiAgLy8gSWYgdGhlIGNvbnRlbnQgb2YgdGhlIHBvcHBlciBncm93cyBvbmNlIGl0J3MgYmVlbiBwb3NpdGlvbmVkLCBpdFxuICAvLyBtYXkgaGFwcGVuIHRoYXQgdGhlIHBvcHBlciBnZXRzIG1pc3BsYWNlZCBiZWNhdXNlIG9mIHRoZSBuZXcgY29udGVudFxuICAvLyBvdmVyZmxvd2luZyBpdHMgcmVmZXJlbmNlIGVsZW1lbnRcbiAgLy8gVG8gYXZvaWQgdGhpcyBwcm9ibGVtLCB3ZSBwcm92aWRlIHR3byBvcHRpb25zICh4IGFuZCB5KSwgd2hpY2ggYWxsb3dcbiAgLy8gdGhlIGNvbnN1bWVyIHRvIGRlZmluZSB0aGUgb2Zmc2V0IG9yaWdpbi5cbiAgLy8gSWYgd2UgcG9zaXRpb24gYSBwb3BwZXIgb24gdG9wIG9mIGEgcmVmZXJlbmNlIGVsZW1lbnQsIHdlIGNhbiBzZXRcbiAgLy8gYHhgIHRvIGB0b3BgIHRvIG1ha2UgdGhlIHBvcHBlciBncm93IHRvd2FyZHMgaXRzIHRvcCBpbnN0ZWFkIG9mXG4gIC8vIGl0cyBib3R0b20uXG4gIHZhciBsZWZ0ID0gdm9pZCAwLFxuICAgICAgdG9wID0gdm9pZCAwO1xuICBpZiAoc2lkZUEgPT09ICdib3R0b20nKSB7XG4gICAgdG9wID0gLW9mZnNldFBhcmVudFJlY3QuaGVpZ2h0ICsgb2Zmc2V0cy5ib3R0b207XG4gIH0gZWxzZSB7XG4gICAgdG9wID0gb2Zmc2V0cy50b3A7XG4gIH1cbiAgaWYgKHNpZGVCID09PSAncmlnaHQnKSB7XG4gICAgbGVmdCA9IC1vZmZzZXRQYXJlbnRSZWN0LndpZHRoICsgb2Zmc2V0cy5yaWdodDtcbiAgfSBlbHNlIHtcbiAgICBsZWZ0ID0gb2Zmc2V0cy5sZWZ0O1xuICB9XG4gIGlmIChncHVBY2NlbGVyYXRpb24gJiYgcHJlZml4ZWRQcm9wZXJ0eSkge1xuICAgIHN0eWxlc1twcmVmaXhlZFByb3BlcnR5XSA9ICd0cmFuc2xhdGUzZCgnICsgbGVmdCArICdweCwgJyArIHRvcCArICdweCwgMCknO1xuICAgIHN0eWxlc1tzaWRlQV0gPSAwO1xuICAgIHN0eWxlc1tzaWRlQl0gPSAwO1xuICAgIHN0eWxlcy53aWxsQ2hhbmdlID0gJ3RyYW5zZm9ybSc7XG4gIH0gZWxzZSB7XG4gICAgLy8gb3Rod2VyaXNlLCB3ZSB1c2UgdGhlIHN0YW5kYXJkIGB0b3BgLCBgbGVmdGAsIGBib3R0b21gIGFuZCBgcmlnaHRgIHByb3BlcnRpZXNcbiAgICB2YXIgaW52ZXJ0VG9wID0gc2lkZUEgPT09ICdib3R0b20nID8gLTEgOiAxO1xuICAgIHZhciBpbnZlcnRMZWZ0ID0gc2lkZUIgPT09ICdyaWdodCcgPyAtMSA6IDE7XG4gICAgc3R5bGVzW3NpZGVBXSA9IHRvcCAqIGludmVydFRvcDtcbiAgICBzdHlsZXNbc2lkZUJdID0gbGVmdCAqIGludmVydExlZnQ7XG4gICAgc3R5bGVzLndpbGxDaGFuZ2UgPSBzaWRlQSArICcsICcgKyBzaWRlQjtcbiAgfVxuXG4gIC8vIEF0dHJpYnV0ZXNcbiAgdmFyIGF0dHJpYnV0ZXMgPSB7XG4gICAgJ3gtcGxhY2VtZW50JzogZGF0YS5wbGFjZW1lbnRcbiAgfTtcblxuICAvLyBVcGRhdGUgYGRhdGFgIGF0dHJpYnV0ZXMsIHN0eWxlcyBhbmQgYXJyb3dTdHlsZXNcbiAgZGF0YS5hdHRyaWJ1dGVzID0gX2V4dGVuZHMkMSh7fSwgYXR0cmlidXRlcywgZGF0YS5hdHRyaWJ1dGVzKTtcbiAgZGF0YS5zdHlsZXMgPSBfZXh0ZW5kcyQxKHt9LCBzdHlsZXMsIGRhdGEuc3R5bGVzKTtcbiAgZGF0YS5hcnJvd1N0eWxlcyA9IF9leHRlbmRzJDEoe30sIGRhdGEub2Zmc2V0cy5hcnJvdywgZGF0YS5hcnJvd1N0eWxlcyk7XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbi8qKlxuICogSGVscGVyIHVzZWQgdG8ga25vdyBpZiB0aGUgZ2l2ZW4gbW9kaWZpZXIgZGVwZW5kcyBmcm9tIGFub3RoZXIgb25lLjxiciAvPlxuICogSXQgY2hlY2tzIGlmIHRoZSBuZWVkZWQgbW9kaWZpZXIgaXMgbGlzdGVkIGFuZCBlbmFibGVkLlxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQHBhcmFtIHtBcnJheX0gbW9kaWZpZXJzIC0gbGlzdCBvZiBtb2RpZmllcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSByZXF1ZXN0aW5nTmFtZSAtIG5hbWUgb2YgcmVxdWVzdGluZyBtb2RpZmllclxuICogQHBhcmFtIHtTdHJpbmd9IHJlcXVlc3RlZE5hbWUgLSBuYW1lIG9mIHJlcXVlc3RlZCBtb2RpZmllclxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzTW9kaWZpZXJSZXF1aXJlZChtb2RpZmllcnMsIHJlcXVlc3RpbmdOYW1lLCByZXF1ZXN0ZWROYW1lKSB7XG4gIHZhciByZXF1ZXN0aW5nID0gZmluZChtb2RpZmllcnMsIGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgdmFyIG5hbWUgPSBfcmVmLm5hbWU7XG4gICAgcmV0dXJuIG5hbWUgPT09IHJlcXVlc3RpbmdOYW1lO1xuICB9KTtcblxuICB2YXIgaXNSZXF1aXJlZCA9ICEhcmVxdWVzdGluZyAmJiBtb2RpZmllcnMuc29tZShmdW5jdGlvbiAobW9kaWZpZXIpIHtcbiAgICByZXR1cm4gbW9kaWZpZXIubmFtZSA9PT0gcmVxdWVzdGVkTmFtZSAmJiBtb2RpZmllci5lbmFibGVkICYmIG1vZGlmaWVyLm9yZGVyIDwgcmVxdWVzdGluZy5vcmRlcjtcbiAgfSk7XG5cbiAgaWYgKCFpc1JlcXVpcmVkKSB7XG4gICAgdmFyIF9yZXF1ZXN0aW5nID0gJ2AnICsgcmVxdWVzdGluZ05hbWUgKyAnYCc7XG4gICAgdmFyIHJlcXVlc3RlZCA9ICdgJyArIHJlcXVlc3RlZE5hbWUgKyAnYCc7XG4gICAgY29uc29sZS53YXJuKHJlcXVlc3RlZCArICcgbW9kaWZpZXIgaXMgcmVxdWlyZWQgYnkgJyArIF9yZXF1ZXN0aW5nICsgJyBtb2RpZmllciBpbiBvcmRlciB0byB3b3JrLCBiZSBzdXJlIHRvIGluY2x1ZGUgaXQgYmVmb3JlICcgKyBfcmVxdWVzdGluZyArICchJyk7XG4gIH1cbiAgcmV0dXJuIGlzUmVxdWlyZWQ7XG59XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxuICovXG5mdW5jdGlvbiBhcnJvdyhkYXRhLCBvcHRpb25zKSB7XG4gIHZhciBfZGF0YSRvZmZzZXRzJGFycm93O1xuXG4gIC8vIGFycm93IGRlcGVuZHMgb24ga2VlcFRvZ2V0aGVyIGluIG9yZGVyIHRvIHdvcmtcbiAgaWYgKCFpc01vZGlmaWVyUmVxdWlyZWQoZGF0YS5pbnN0YW5jZS5tb2RpZmllcnMsICdhcnJvdycsICdrZWVwVG9nZXRoZXInKSkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgdmFyIGFycm93RWxlbWVudCA9IG9wdGlvbnMuZWxlbWVudDtcblxuICAvLyBpZiBhcnJvd0VsZW1lbnQgaXMgYSBzdHJpbmcsIHN1cHBvc2UgaXQncyBhIENTUyBzZWxlY3RvclxuICBpZiAodHlwZW9mIGFycm93RWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICBhcnJvd0VsZW1lbnQgPSBkYXRhLmluc3RhbmNlLnBvcHBlci5xdWVyeVNlbGVjdG9yKGFycm93RWxlbWVudCk7XG5cbiAgICAvLyBpZiBhcnJvd0VsZW1lbnQgaXMgbm90IGZvdW5kLCBkb24ndCBydW4gdGhlIG1vZGlmaWVyXG4gICAgaWYgKCFhcnJvd0VsZW1lbnQpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBpZiB0aGUgYXJyb3dFbGVtZW50IGlzbid0IGEgcXVlcnkgc2VsZWN0b3Igd2UgbXVzdCBjaGVjayB0aGF0IHRoZVxuICAgIC8vIHByb3ZpZGVkIERPTSBub2RlIGlzIGNoaWxkIG9mIGl0cyBwb3BwZXIgbm9kZVxuICAgIGlmICghZGF0YS5pbnN0YW5jZS5wb3BwZXIuY29udGFpbnMoYXJyb3dFbGVtZW50KSkge1xuICAgICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiBgYXJyb3cuZWxlbWVudGAgbXVzdCBiZSBjaGlsZCBvZiBpdHMgcG9wcGVyIGVsZW1lbnQhJyk7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gIH1cblxuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcbiAgdmFyIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXG4gICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcixcbiAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlO1xuXG4gIHZhciBpc1ZlcnRpY2FsID0gWydsZWZ0JywgJ3JpZ2h0J10uaW5kZXhPZihwbGFjZW1lbnQpICE9PSAtMTtcblxuICB2YXIgbGVuID0gaXNWZXJ0aWNhbCA/ICdoZWlnaHQnIDogJ3dpZHRoJztcbiAgdmFyIHNpZGVDYXBpdGFsaXplZCA9IGlzVmVydGljYWwgPyAnVG9wJyA6ICdMZWZ0JztcbiAgdmFyIHNpZGUgPSBzaWRlQ2FwaXRhbGl6ZWQudG9Mb3dlckNhc2UoKTtcbiAgdmFyIGFsdFNpZGUgPSBpc1ZlcnRpY2FsID8gJ2xlZnQnIDogJ3RvcCc7XG4gIHZhciBvcFNpZGUgPSBpc1ZlcnRpY2FsID8gJ2JvdHRvbScgOiAncmlnaHQnO1xuICB2YXIgYXJyb3dFbGVtZW50U2l6ZSA9IGdldE91dGVyU2l6ZXMoYXJyb3dFbGVtZW50KVtsZW5dO1xuXG4gIC8vXG4gIC8vIGV4dGVuZHMga2VlcFRvZ2V0aGVyIGJlaGF2aW9yIG1ha2luZyBzdXJlIHRoZSBwb3BwZXIgYW5kIGl0c1xuICAvLyByZWZlcmVuY2UgaGF2ZSBlbm91Z2ggcGl4ZWxzIGluIGNvbmp1Y3Rpb25cbiAgLy9cblxuICAvLyB0b3AvbGVmdCBzaWRlXG4gIGlmIChyZWZlcmVuY2Vbb3BTaWRlXSAtIGFycm93RWxlbWVudFNpemUgPCBwb3BwZXJbc2lkZV0pIHtcbiAgICBkYXRhLm9mZnNldHMucG9wcGVyW3NpZGVdIC09IHBvcHBlcltzaWRlXSAtIChyZWZlcmVuY2Vbb3BTaWRlXSAtIGFycm93RWxlbWVudFNpemUpO1xuICB9XG4gIC8vIGJvdHRvbS9yaWdodCBzaWRlXG4gIGlmIChyZWZlcmVuY2Vbc2lkZV0gKyBhcnJvd0VsZW1lbnRTaXplID4gcG9wcGVyW29wU2lkZV0pIHtcbiAgICBkYXRhLm9mZnNldHMucG9wcGVyW3NpZGVdICs9IHJlZmVyZW5jZVtzaWRlXSArIGFycm93RWxlbWVudFNpemUgLSBwb3BwZXJbb3BTaWRlXTtcbiAgfVxuICBkYXRhLm9mZnNldHMucG9wcGVyID0gZ2V0Q2xpZW50UmVjdChkYXRhLm9mZnNldHMucG9wcGVyKTtcblxuICAvLyBjb21wdXRlIGNlbnRlciBvZiB0aGUgcG9wcGVyXG4gIHZhciBjZW50ZXIgPSByZWZlcmVuY2Vbc2lkZV0gKyByZWZlcmVuY2VbbGVuXSAvIDIgLSBhcnJvd0VsZW1lbnRTaXplIC8gMjtcblxuICAvLyBDb21wdXRlIHRoZSBzaWRlVmFsdWUgdXNpbmcgdGhlIHVwZGF0ZWQgcG9wcGVyIG9mZnNldHNcbiAgLy8gdGFrZSBwb3BwZXIgbWFyZ2luIGluIGFjY291bnQgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIHRoaXMgaW5mbyBhdmFpbGFibGVcbiAgdmFyIGNzcyA9IGdldFN0eWxlQ29tcHV0ZWRQcm9wZXJ0eShkYXRhLmluc3RhbmNlLnBvcHBlcik7XG4gIHZhciBwb3BwZXJNYXJnaW5TaWRlID0gcGFyc2VGbG9hdChjc3NbJ21hcmdpbicgKyBzaWRlQ2FwaXRhbGl6ZWRdLCAxMCk7XG4gIHZhciBwb3BwZXJCb3JkZXJTaWRlID0gcGFyc2VGbG9hdChjc3NbJ2JvcmRlcicgKyBzaWRlQ2FwaXRhbGl6ZWQgKyAnV2lkdGgnXSwgMTApO1xuICB2YXIgc2lkZVZhbHVlID0gY2VudGVyIC0gZGF0YS5vZmZzZXRzLnBvcHBlcltzaWRlXSAtIHBvcHBlck1hcmdpblNpZGUgLSBwb3BwZXJCb3JkZXJTaWRlO1xuXG4gIC8vIHByZXZlbnQgYXJyb3dFbGVtZW50IGZyb20gYmVpbmcgcGxhY2VkIG5vdCBjb250aWd1b3VzbHkgdG8gaXRzIHBvcHBlclxuICBzaWRlVmFsdWUgPSBNYXRoLm1heChNYXRoLm1pbihwb3BwZXJbbGVuXSAtIGFycm93RWxlbWVudFNpemUsIHNpZGVWYWx1ZSksIDApO1xuXG4gIGRhdGEuYXJyb3dFbGVtZW50ID0gYXJyb3dFbGVtZW50O1xuICBkYXRhLm9mZnNldHMuYXJyb3cgPSAoX2RhdGEkb2Zmc2V0cyRhcnJvdyA9IHt9LCBkZWZpbmVQcm9wZXJ0eSQxKF9kYXRhJG9mZnNldHMkYXJyb3csIHNpZGUsIE1hdGgucm91bmQoc2lkZVZhbHVlKSksIGRlZmluZVByb3BlcnR5JDEoX2RhdGEkb2Zmc2V0cyRhcnJvdywgYWx0U2lkZSwgJycpLCBfZGF0YSRvZmZzZXRzJGFycm93KTtcblxuICByZXR1cm4gZGF0YTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIG9wcG9zaXRlIHBsYWNlbWVudCB2YXJpYXRpb24gb2YgdGhlIGdpdmVuIG9uZVxuICogQG1ldGhvZFxuICogQG1lbWJlcm9mIFBvcHBlci5VdGlsc1xuICogQGFyZ3VtZW50IHtTdHJpbmd9IHBsYWNlbWVudCB2YXJpYXRpb25cbiAqIEByZXR1cm5zIHtTdHJpbmd9IGZsaXBwZWQgcGxhY2VtZW50IHZhcmlhdGlvblxuICovXG5mdW5jdGlvbiBnZXRPcHBvc2l0ZVZhcmlhdGlvbih2YXJpYXRpb24pIHtcbiAgaWYgKHZhcmlhdGlvbiA9PT0gJ2VuZCcpIHtcbiAgICByZXR1cm4gJ3N0YXJ0JztcbiAgfSBlbHNlIGlmICh2YXJpYXRpb24gPT09ICdzdGFydCcpIHtcbiAgICByZXR1cm4gJ2VuZCc7XG4gIH1cbiAgcmV0dXJuIHZhcmlhdGlvbjtcbn1cblxuLyoqXG4gKiBMaXN0IG9mIGFjY2VwdGVkIHBsYWNlbWVudHMgdG8gdXNlIGFzIHZhbHVlcyBvZiB0aGUgYHBsYWNlbWVudGAgb3B0aW9uLjxiciAvPlxuICogVmFsaWQgcGxhY2VtZW50cyBhcmU6XG4gKiAtIGBhdXRvYFxuICogLSBgdG9wYFxuICogLSBgcmlnaHRgXG4gKiAtIGBib3R0b21gXG4gKiAtIGBsZWZ0YFxuICpcbiAqIEVhY2ggcGxhY2VtZW50IGNhbiBoYXZlIGEgdmFyaWF0aW9uIGZyb20gdGhpcyBsaXN0OlxuICogLSBgLXN0YXJ0YFxuICogLSBgLWVuZGBcbiAqXG4gKiBWYXJpYXRpb25zIGFyZSBpbnRlcnByZXRlZCBlYXNpbHkgaWYgeW91IHRoaW5rIG9mIHRoZW0gYXMgdGhlIGxlZnQgdG8gcmlnaHRcbiAqIHdyaXR0ZW4gbGFuZ3VhZ2VzLiBIb3Jpem9udGFsbHkgKGB0b3BgIGFuZCBgYm90dG9tYCksIGBzdGFydGAgaXMgbGVmdCBhbmQgYGVuZGBcbiAqIGlzIHJpZ2h0LjxiciAvPlxuICogVmVydGljYWxseSAoYGxlZnRgIGFuZCBgcmlnaHRgKSwgYHN0YXJ0YCBpcyB0b3AgYW5kIGBlbmRgIGlzIGJvdHRvbS5cbiAqXG4gKiBTb21lIHZhbGlkIGV4YW1wbGVzIGFyZTpcbiAqIC0gYHRvcC1lbmRgIChvbiB0b3Agb2YgcmVmZXJlbmNlLCByaWdodCBhbGlnbmVkKVxuICogLSBgcmlnaHQtc3RhcnRgIChvbiByaWdodCBvZiByZWZlcmVuY2UsIHRvcCBhbGlnbmVkKVxuICogLSBgYm90dG9tYCAob24gYm90dG9tLCBjZW50ZXJlZClcbiAqIC0gYGF1dG8tcmlnaHRgIChvbiB0aGUgc2lkZSB3aXRoIG1vcmUgc3BhY2UgYXZhaWxhYmxlLCBhbGlnbm1lbnQgZGVwZW5kcyBieSBwbGFjZW1lbnQpXG4gKlxuICogQHN0YXRpY1xuICogQHR5cGUge0FycmF5fVxuICogQGVudW0ge1N0cmluZ31cbiAqIEByZWFkb25seVxuICogQG1ldGhvZCBwbGFjZW1lbnRzXG4gKiBAbWVtYmVyb2YgUG9wcGVyXG4gKi9cbnZhciBwbGFjZW1lbnRzID0gWydhdXRvLXN0YXJ0JywgJ2F1dG8nLCAnYXV0by1lbmQnLCAndG9wLXN0YXJ0JywgJ3RvcCcsICd0b3AtZW5kJywgJ3JpZ2h0LXN0YXJ0JywgJ3JpZ2h0JywgJ3JpZ2h0LWVuZCcsICdib3R0b20tZW5kJywgJ2JvdHRvbScsICdib3R0b20tc3RhcnQnLCAnbGVmdC1lbmQnLCAnbGVmdCcsICdsZWZ0LXN0YXJ0J107XG5cbi8vIEdldCByaWQgb2YgYGF1dG9gIGBhdXRvLXN0YXJ0YCBhbmQgYGF1dG8tZW5kYFxudmFyIHZhbGlkUGxhY2VtZW50cyA9IHBsYWNlbWVudHMuc2xpY2UoMyk7XG5cbi8qKlxuICogR2l2ZW4gYW4gaW5pdGlhbCBwbGFjZW1lbnQsIHJldHVybnMgYWxsIHRoZSBzdWJzZXF1ZW50IHBsYWNlbWVudHNcbiAqIGNsb2Nrd2lzZSAob3IgY291bnRlci1jbG9ja3dpc2UpLlxuICpcbiAqIEBtZXRob2RcbiAqIEBtZW1iZXJvZiBQb3BwZXIuVXRpbHNcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBwbGFjZW1lbnQgLSBBIHZhbGlkIHBsYWNlbWVudCAoaXQgYWNjZXB0cyB2YXJpYXRpb25zKVxuICogQGFyZ3VtZW50IHtCb29sZWFufSBjb3VudGVyIC0gU2V0IHRvIHRydWUgdG8gd2FsayB0aGUgcGxhY2VtZW50cyBjb3VudGVyY2xvY2t3aXNlXG4gKiBAcmV0dXJucyB7QXJyYXl9IHBsYWNlbWVudHMgaW5jbHVkaW5nIHRoZWlyIHZhcmlhdGlvbnNcbiAqL1xuZnVuY3Rpb24gY2xvY2t3aXNlKHBsYWNlbWVudCkge1xuICB2YXIgY291bnRlciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogZmFsc2U7XG5cbiAgdmFyIGluZGV4ID0gdmFsaWRQbGFjZW1lbnRzLmluZGV4T2YocGxhY2VtZW50KTtcbiAgdmFyIGFyciA9IHZhbGlkUGxhY2VtZW50cy5zbGljZShpbmRleCArIDEpLmNvbmNhdCh2YWxpZFBsYWNlbWVudHMuc2xpY2UoMCwgaW5kZXgpKTtcbiAgcmV0dXJuIGNvdW50ZXIgPyBhcnIucmV2ZXJzZSgpIDogYXJyO1xufVxuXG52YXIgQkVIQVZJT1JTID0ge1xuICBGTElQOiAnZmxpcCcsXG4gIENMT0NLV0lTRTogJ2Nsb2Nrd2lzZScsXG4gIENPVU5URVJDTE9DS1dJU0U6ICdjb3VudGVyY2xvY2t3aXNlJ1xufTtcblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXG4gKi9cbmZ1bmN0aW9uIGZsaXAoZGF0YSwgb3B0aW9ucykge1xuICAvLyBpZiBgaW5uZXJgIG1vZGlmaWVyIGlzIGVuYWJsZWQsIHdlIGNhbid0IHVzZSB0aGUgYGZsaXBgIG1vZGlmaWVyXG4gIGlmIChpc01vZGlmaWVyRW5hYmxlZChkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgJ2lubmVyJykpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGlmIChkYXRhLmZsaXBwZWQgJiYgZGF0YS5wbGFjZW1lbnQgPT09IGRhdGEub3JpZ2luYWxQbGFjZW1lbnQpIHtcbiAgICAvLyBzZWVtcyBsaWtlIGZsaXAgaXMgdHJ5aW5nIHRvIGxvb3AsIHByb2JhYmx5IHRoZXJlJ3Mgbm90IGVub3VnaCBzcGFjZSBvbiBhbnkgb2YgdGhlIGZsaXBwYWJsZSBzaWRlc1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgdmFyIGJvdW5kYXJpZXMgPSBnZXRCb3VuZGFyaWVzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLmluc3RhbmNlLnJlZmVyZW5jZSwgb3B0aW9ucy5wYWRkaW5nLCBvcHRpb25zLmJvdW5kYXJpZXNFbGVtZW50LCBkYXRhLnBvc2l0aW9uRml4ZWQpO1xuXG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xuICB2YXIgcGxhY2VtZW50T3Bwb3NpdGUgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuICB2YXIgdmFyaWF0aW9uID0gZGF0YS5wbGFjZW1lbnQuc3BsaXQoJy0nKVsxXSB8fCAnJztcblxuICB2YXIgZmxpcE9yZGVyID0gW107XG5cbiAgc3dpdGNoIChvcHRpb25zLmJlaGF2aW9yKSB7XG4gICAgY2FzZSBCRUhBVklPUlMuRkxJUDpcbiAgICAgIGZsaXBPcmRlciA9IFtwbGFjZW1lbnQsIHBsYWNlbWVudE9wcG9zaXRlXTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQkVIQVZJT1JTLkNMT0NLV0lTRTpcbiAgICAgIGZsaXBPcmRlciA9IGNsb2Nrd2lzZShwbGFjZW1lbnQpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBCRUhBVklPUlMuQ09VTlRFUkNMT0NLV0lTRTpcbiAgICAgIGZsaXBPcmRlciA9IGNsb2Nrd2lzZShwbGFjZW1lbnQsIHRydWUpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGZsaXBPcmRlciA9IG9wdGlvbnMuYmVoYXZpb3I7XG4gIH1cblxuICBmbGlwT3JkZXIuZm9yRWFjaChmdW5jdGlvbiAoc3RlcCwgaW5kZXgpIHtcbiAgICBpZiAocGxhY2VtZW50ICE9PSBzdGVwIHx8IGZsaXBPcmRlci5sZW5ndGggPT09IGluZGV4ICsgMSkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcbiAgICBwbGFjZW1lbnRPcHBvc2l0ZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XG5cbiAgICB2YXIgcG9wcGVyT2Zmc2V0cyA9IGRhdGEub2Zmc2V0cy5wb3BwZXI7XG4gICAgdmFyIHJlZk9mZnNldHMgPSBkYXRhLm9mZnNldHMucmVmZXJlbmNlO1xuXG4gICAgLy8gdXNpbmcgZmxvb3IgYmVjYXVzZSB0aGUgcmVmZXJlbmNlIG9mZnNldHMgbWF5IGNvbnRhaW4gZGVjaW1hbHMgd2UgYXJlIG5vdCBnb2luZyB0byBjb25zaWRlciBoZXJlXG4gICAgdmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbiAgICB2YXIgb3ZlcmxhcHNSZWYgPSBwbGFjZW1lbnQgPT09ICdsZWZ0JyAmJiBmbG9vcihwb3BwZXJPZmZzZXRzLnJpZ2h0KSA+IGZsb29yKHJlZk9mZnNldHMubGVmdCkgfHwgcGxhY2VtZW50ID09PSAncmlnaHQnICYmIGZsb29yKHBvcHBlck9mZnNldHMubGVmdCkgPCBmbG9vcihyZWZPZmZzZXRzLnJpZ2h0KSB8fCBwbGFjZW1lbnQgPT09ICd0b3AnICYmIGZsb29yKHBvcHBlck9mZnNldHMuYm90dG9tKSA+IGZsb29yKHJlZk9mZnNldHMudG9wKSB8fCBwbGFjZW1lbnQgPT09ICdib3R0b20nICYmIGZsb29yKHBvcHBlck9mZnNldHMudG9wKSA8IGZsb29yKHJlZk9mZnNldHMuYm90dG9tKTtcblxuICAgIHZhciBvdmVyZmxvd3NMZWZ0ID0gZmxvb3IocG9wcGVyT2Zmc2V0cy5sZWZ0KSA8IGZsb29yKGJvdW5kYXJpZXMubGVmdCk7XG4gICAgdmFyIG92ZXJmbG93c1JpZ2h0ID0gZmxvb3IocG9wcGVyT2Zmc2V0cy5yaWdodCkgPiBmbG9vcihib3VuZGFyaWVzLnJpZ2h0KTtcbiAgICB2YXIgb3ZlcmZsb3dzVG9wID0gZmxvb3IocG9wcGVyT2Zmc2V0cy50b3ApIDwgZmxvb3IoYm91bmRhcmllcy50b3ApO1xuICAgIHZhciBvdmVyZmxvd3NCb3R0b20gPSBmbG9vcihwb3BwZXJPZmZzZXRzLmJvdHRvbSkgPiBmbG9vcihib3VuZGFyaWVzLmJvdHRvbSk7XG5cbiAgICB2YXIgb3ZlcmZsb3dzQm91bmRhcmllcyA9IHBsYWNlbWVudCA9PT0gJ2xlZnQnICYmIG92ZXJmbG93c0xlZnQgfHwgcGxhY2VtZW50ID09PSAncmlnaHQnICYmIG92ZXJmbG93c1JpZ2h0IHx8IHBsYWNlbWVudCA9PT0gJ3RvcCcgJiYgb3ZlcmZsb3dzVG9wIHx8IHBsYWNlbWVudCA9PT0gJ2JvdHRvbScgJiYgb3ZlcmZsb3dzQm90dG9tO1xuXG4gICAgLy8gZmxpcCB0aGUgdmFyaWF0aW9uIGlmIHJlcXVpcmVkXG4gICAgdmFyIGlzVmVydGljYWwgPSBbJ3RvcCcsICdib3R0b20nXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xO1xuICAgIHZhciBmbGlwcGVkVmFyaWF0aW9uID0gISFvcHRpb25zLmZsaXBWYXJpYXRpb25zICYmIChpc1ZlcnRpY2FsICYmIHZhcmlhdGlvbiA9PT0gJ3N0YXJ0JyAmJiBvdmVyZmxvd3NMZWZ0IHx8IGlzVmVydGljYWwgJiYgdmFyaWF0aW9uID09PSAnZW5kJyAmJiBvdmVyZmxvd3NSaWdodCB8fCAhaXNWZXJ0aWNhbCAmJiB2YXJpYXRpb24gPT09ICdzdGFydCcgJiYgb3ZlcmZsb3dzVG9wIHx8ICFpc1ZlcnRpY2FsICYmIHZhcmlhdGlvbiA9PT0gJ2VuZCcgJiYgb3ZlcmZsb3dzQm90dG9tKTtcblxuICAgIGlmIChvdmVybGFwc1JlZiB8fCBvdmVyZmxvd3NCb3VuZGFyaWVzIHx8IGZsaXBwZWRWYXJpYXRpb24pIHtcbiAgICAgIC8vIHRoaXMgYm9vbGVhbiB0byBkZXRlY3QgYW55IGZsaXAgbG9vcFxuICAgICAgZGF0YS5mbGlwcGVkID0gdHJ1ZTtcblxuICAgICAgaWYgKG92ZXJsYXBzUmVmIHx8IG92ZXJmbG93c0JvdW5kYXJpZXMpIHtcbiAgICAgICAgcGxhY2VtZW50ID0gZmxpcE9yZGVyW2luZGV4ICsgMV07XG4gICAgICB9XG5cbiAgICAgIGlmIChmbGlwcGVkVmFyaWF0aW9uKSB7XG4gICAgICAgIHZhcmlhdGlvbiA9IGdldE9wcG9zaXRlVmFyaWF0aW9uKHZhcmlhdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGRhdGEucGxhY2VtZW50ID0gcGxhY2VtZW50ICsgKHZhcmlhdGlvbiA/ICctJyArIHZhcmlhdGlvbiA6ICcnKTtcblxuICAgICAgLy8gdGhpcyBvYmplY3QgY29udGFpbnMgYHBvc2l0aW9uYCwgd2Ugd2FudCB0byBwcmVzZXJ2ZSBpdCBhbG9uZyB3aXRoXG4gICAgICAvLyBhbnkgYWRkaXRpb25hbCBwcm9wZXJ0eSB3ZSBtYXkgYWRkIGluIHRoZSBmdXR1cmVcbiAgICAgIGRhdGEub2Zmc2V0cy5wb3BwZXIgPSBfZXh0ZW5kcyQxKHt9LCBkYXRhLm9mZnNldHMucG9wcGVyLCBnZXRQb3BwZXJPZmZzZXRzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLm9mZnNldHMucmVmZXJlbmNlLCBkYXRhLnBsYWNlbWVudCkpO1xuXG4gICAgICBkYXRhID0gcnVuTW9kaWZpZXJzKGRhdGEuaW5zdGFuY2UubW9kaWZpZXJzLCBkYXRhLCAnZmxpcCcpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IHVwZGF0ZSBtZXRob2RcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcbiAqL1xuZnVuY3Rpb24ga2VlcFRvZ2V0aGVyKGRhdGEpIHtcbiAgdmFyIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXG4gICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcixcbiAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlO1xuXG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xuICB2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xuICB2YXIgaXNWZXJ0aWNhbCA9IFsndG9wJywgJ2JvdHRvbSddLmluZGV4T2YocGxhY2VtZW50KSAhPT0gLTE7XG4gIHZhciBzaWRlID0gaXNWZXJ0aWNhbCA/ICdyaWdodCcgOiAnYm90dG9tJztcbiAgdmFyIG9wU2lkZSA9IGlzVmVydGljYWwgPyAnbGVmdCcgOiAndG9wJztcbiAgdmFyIG1lYXN1cmVtZW50ID0gaXNWZXJ0aWNhbCA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcblxuICBpZiAocG9wcGVyW3NpZGVdIDwgZmxvb3IocmVmZXJlbmNlW29wU2lkZV0pKSB7XG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlcltvcFNpZGVdID0gZmxvb3IocmVmZXJlbmNlW29wU2lkZV0pIC0gcG9wcGVyW21lYXN1cmVtZW50XTtcbiAgfVxuICBpZiAocG9wcGVyW29wU2lkZV0gPiBmbG9vcihyZWZlcmVuY2Vbc2lkZV0pKSB7XG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlcltvcFNpZGVdID0gZmxvb3IocmVmZXJlbmNlW3NpZGVdKTtcbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgc3RyaW5nIGNvbnRhaW5pbmcgdmFsdWUgKyB1bml0IGludG8gYSBweCB2YWx1ZSBudW1iZXJcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlcm9mIHttb2RpZmllcnN+b2Zmc2V0fVxuICogQHByaXZhdGVcbiAqIEBhcmd1bWVudCB7U3RyaW5nfSBzdHIgLSBWYWx1ZSArIHVuaXQgc3RyaW5nXG4gKiBAYXJndW1lbnQge1N0cmluZ30gbWVhc3VyZW1lbnQgLSBgaGVpZ2h0YCBvciBgd2lkdGhgXG4gKiBAYXJndW1lbnQge09iamVjdH0gcG9wcGVyT2Zmc2V0c1xuICogQGFyZ3VtZW50IHtPYmplY3R9IHJlZmVyZW5jZU9mZnNldHNcbiAqIEByZXR1cm5zIHtOdW1iZXJ8U3RyaW5nfVxuICogVmFsdWUgaW4gcGl4ZWxzLCBvciBvcmlnaW5hbCBzdHJpbmcgaWYgbm8gdmFsdWVzIHdlcmUgZXh0cmFjdGVkXG4gKi9cbmZ1bmN0aW9uIHRvVmFsdWUoc3RyLCBtZWFzdXJlbWVudCwgcG9wcGVyT2Zmc2V0cywgcmVmZXJlbmNlT2Zmc2V0cykge1xuICAvLyBzZXBhcmF0ZSB2YWx1ZSBmcm9tIHVuaXRcbiAgdmFyIHNwbGl0ID0gc3RyLm1hdGNoKC8oKD86XFwtfFxcKyk/XFxkKlxcLj9cXGQqKSguKikvKTtcbiAgdmFyIHZhbHVlID0gK3NwbGl0WzFdO1xuICB2YXIgdW5pdCA9IHNwbGl0WzJdO1xuXG4gIC8vIElmIGl0J3Mgbm90IGEgbnVtYmVyIGl0J3MgYW4gb3BlcmF0b3IsIEkgZ3Vlc3NcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiBzdHI7XG4gIH1cblxuICBpZiAodW5pdC5pbmRleE9mKCclJykgPT09IDApIHtcbiAgICB2YXIgZWxlbWVudCA9IHZvaWQgMDtcbiAgICBzd2l0Y2ggKHVuaXQpIHtcbiAgICAgIGNhc2UgJyVwJzpcbiAgICAgICAgZWxlbWVudCA9IHBvcHBlck9mZnNldHM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnJSc6XG4gICAgICBjYXNlICclcic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBlbGVtZW50ID0gcmVmZXJlbmNlT2Zmc2V0cztcbiAgICB9XG5cbiAgICB2YXIgcmVjdCA9IGdldENsaWVudFJlY3QoZWxlbWVudCk7XG4gICAgcmV0dXJuIHJlY3RbbWVhc3VyZW1lbnRdIC8gMTAwICogdmFsdWU7XG4gIH0gZWxzZSBpZiAodW5pdCA9PT0gJ3ZoJyB8fCB1bml0ID09PSAndncnKSB7XG4gICAgLy8gaWYgaXMgYSB2aCBvciB2dywgd2UgY2FsY3VsYXRlIHRoZSBzaXplIGJhc2VkIG9uIHRoZSB2aWV3cG9ydFxuICAgIHZhciBzaXplID0gdm9pZCAwO1xuICAgIGlmICh1bml0ID09PSAndmgnKSB7XG4gICAgICBzaXplID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaXplID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKTtcbiAgICB9XG4gICAgcmV0dXJuIHNpemUgLyAxMDAgKiB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICAvLyBpZiBpcyBhbiBleHBsaWNpdCBwaXhlbCB1bml0LCB3ZSBnZXQgcmlkIG9mIHRoZSB1bml0IGFuZCBrZWVwIHRoZSB2YWx1ZVxuICAgIC8vIGlmIGlzIGFuIGltcGxpY2l0IHVuaXQsIGl0J3MgcHgsIGFuZCB3ZSByZXR1cm4ganVzdCB0aGUgdmFsdWVcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cblxuLyoqXG4gKiBQYXJzZSBhbiBgb2Zmc2V0YCBzdHJpbmcgdG8gZXh0cmFwb2xhdGUgYHhgIGFuZCBgeWAgbnVtZXJpYyBvZmZzZXRzLlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyb2Yge21vZGlmaWVyc35vZmZzZXR9XG4gKiBAcHJpdmF0ZVxuICogQGFyZ3VtZW50IHtTdHJpbmd9IG9mZnNldFxuICogQGFyZ3VtZW50IHtPYmplY3R9IHBvcHBlck9mZnNldHNcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSByZWZlcmVuY2VPZmZzZXRzXG4gKiBAYXJndW1lbnQge1N0cmluZ30gYmFzZVBsYWNlbWVudFxuICogQHJldHVybnMge0FycmF5fSBhIHR3byBjZWxscyBhcnJheSB3aXRoIHggYW5kIHkgb2Zmc2V0cyBpbiBudW1iZXJzXG4gKi9cbmZ1bmN0aW9uIHBhcnNlT2Zmc2V0KG9mZnNldCwgcG9wcGVyT2Zmc2V0cywgcmVmZXJlbmNlT2Zmc2V0cywgYmFzZVBsYWNlbWVudCkge1xuICB2YXIgb2Zmc2V0cyA9IFswLCAwXTtcblxuICAvLyBVc2UgaGVpZ2h0IGlmIHBsYWNlbWVudCBpcyBsZWZ0IG9yIHJpZ2h0IGFuZCBpbmRleCBpcyAwIG90aGVyd2lzZSB1c2Ugd2lkdGhcbiAgLy8gaW4gdGhpcyB3YXkgdGhlIGZpcnN0IG9mZnNldCB3aWxsIHVzZSBhbiBheGlzIGFuZCB0aGUgc2Vjb25kIG9uZVxuICAvLyB3aWxsIHVzZSB0aGUgb3RoZXIgb25lXG4gIHZhciB1c2VIZWlnaHQgPSBbJ3JpZ2h0JywgJ2xlZnQnXS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpICE9PSAtMTtcblxuICAvLyBTcGxpdCB0aGUgb2Zmc2V0IHN0cmluZyB0byBvYnRhaW4gYSBsaXN0IG9mIHZhbHVlcyBhbmQgb3BlcmFuZHNcbiAgLy8gVGhlIHJlZ2V4IGFkZHJlc3NlcyB2YWx1ZXMgd2l0aCB0aGUgcGx1cyBvciBtaW51cyBzaWduIGluIGZyb250ICgrMTAsIC0yMCwgZXRjKVxuICB2YXIgZnJhZ21lbnRzID0gb2Zmc2V0LnNwbGl0KC8oXFwrfFxcLSkvKS5tYXAoZnVuY3Rpb24gKGZyYWcpIHtcbiAgICByZXR1cm4gZnJhZy50cmltKCk7XG4gIH0pO1xuXG4gIC8vIERldGVjdCBpZiB0aGUgb2Zmc2V0IHN0cmluZyBjb250YWlucyBhIHBhaXIgb2YgdmFsdWVzIG9yIGEgc2luZ2xlIG9uZVxuICAvLyB0aGV5IGNvdWxkIGJlIHNlcGFyYXRlZCBieSBjb21tYSBvciBzcGFjZVxuICB2YXIgZGl2aWRlciA9IGZyYWdtZW50cy5pbmRleE9mKGZpbmQoZnJhZ21lbnRzLCBmdW5jdGlvbiAoZnJhZykge1xuICAgIHJldHVybiBmcmFnLnNlYXJjaCgvLHxcXHMvKSAhPT0gLTE7XG4gIH0pKTtcblxuICBpZiAoZnJhZ21lbnRzW2RpdmlkZXJdICYmIGZyYWdtZW50c1tkaXZpZGVyXS5pbmRleE9mKCcsJykgPT09IC0xKSB7XG4gICAgY29uc29sZS53YXJuKCdPZmZzZXRzIHNlcGFyYXRlZCBieSB3aGl0ZSBzcGFjZShzKSBhcmUgZGVwcmVjYXRlZCwgdXNlIGEgY29tbWEgKCwpIGluc3RlYWQuJyk7XG4gIH1cblxuICAvLyBJZiBkaXZpZGVyIGlzIGZvdW5kLCB3ZSBkaXZpZGUgdGhlIGxpc3Qgb2YgdmFsdWVzIGFuZCBvcGVyYW5kcyB0byBkaXZpZGVcbiAgLy8gdGhlbSBieSBvZnNldCBYIGFuZCBZLlxuICB2YXIgc3BsaXRSZWdleCA9IC9cXHMqLFxccyp8XFxzKy87XG4gIHZhciBvcHMgPSBkaXZpZGVyICE9PSAtMSA/IFtmcmFnbWVudHMuc2xpY2UoMCwgZGl2aWRlcikuY29uY2F0KFtmcmFnbWVudHNbZGl2aWRlcl0uc3BsaXQoc3BsaXRSZWdleClbMF1dKSwgW2ZyYWdtZW50c1tkaXZpZGVyXS5zcGxpdChzcGxpdFJlZ2V4KVsxXV0uY29uY2F0KGZyYWdtZW50cy5zbGljZShkaXZpZGVyICsgMSkpXSA6IFtmcmFnbWVudHNdO1xuXG4gIC8vIENvbnZlcnQgdGhlIHZhbHVlcyB3aXRoIHVuaXRzIHRvIGFic29sdXRlIHBpeGVscyB0byBhbGxvdyBvdXIgY29tcHV0YXRpb25zXG4gIG9wcyA9IG9wcy5tYXAoZnVuY3Rpb24gKG9wLCBpbmRleCkge1xuICAgIC8vIE1vc3Qgb2YgdGhlIHVuaXRzIHJlbHkgb24gdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBwb3BwZXJcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSAoaW5kZXggPT09IDEgPyAhdXNlSGVpZ2h0IDogdXNlSGVpZ2h0KSA/ICdoZWlnaHQnIDogJ3dpZHRoJztcbiAgICB2YXIgbWVyZ2VXaXRoUHJldmlvdXMgPSBmYWxzZTtcbiAgICByZXR1cm4gb3BcbiAgICAvLyBUaGlzIGFnZ3JlZ2F0ZXMgYW55IGArYCBvciBgLWAgc2lnbiB0aGF0IGFyZW4ndCBjb25zaWRlcmVkIG9wZXJhdG9yc1xuICAgIC8vIGUuZy46IDEwICsgKzUgPT4gWzEwLCArLCArNV1cbiAgICAucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICBpZiAoYVthLmxlbmd0aCAtIDFdID09PSAnJyAmJiBbJysnLCAnLSddLmluZGV4T2YoYikgIT09IC0xKSB7XG4gICAgICAgIGFbYS5sZW5ndGggLSAxXSA9IGI7XG4gICAgICAgIG1lcmdlV2l0aFByZXZpb3VzID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgICB9IGVsc2UgaWYgKG1lcmdlV2l0aFByZXZpb3VzKSB7XG4gICAgICAgIGFbYS5sZW5ndGggLSAxXSArPSBiO1xuICAgICAgICBtZXJnZVdpdGhQcmV2aW91cyA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gYTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhLmNvbmNhdChiKTtcbiAgICAgIH1cbiAgICB9LCBbXSlcbiAgICAvLyBIZXJlIHdlIGNvbnZlcnQgdGhlIHN0cmluZyB2YWx1ZXMgaW50byBudW1iZXIgdmFsdWVzIChpbiBweClcbiAgICAubWFwKGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgIHJldHVybiB0b1ZhbHVlKHN0ciwgbWVhc3VyZW1lbnQsIHBvcHBlck9mZnNldHMsIHJlZmVyZW5jZU9mZnNldHMpO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBMb29wIHRyb3VnaCB0aGUgb2Zmc2V0cyBhcnJheXMgYW5kIGV4ZWN1dGUgdGhlIG9wZXJhdGlvbnNcbiAgb3BzLmZvckVhY2goZnVuY3Rpb24gKG9wLCBpbmRleCkge1xuICAgIG9wLmZvckVhY2goZnVuY3Rpb24gKGZyYWcsIGluZGV4Mikge1xuICAgICAgaWYgKGlzTnVtZXJpYyhmcmFnKSkge1xuICAgICAgICBvZmZzZXRzW2luZGV4XSArPSBmcmFnICogKG9wW2luZGV4MiAtIDFdID09PSAnLScgPyAtMSA6IDEpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIG9mZnNldHM7XG59XG5cbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAbWVtYmVyb2YgTW9kaWZpZXJzXG4gKiBAYXJndW1lbnQge09iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgdXBkYXRlIG1ldGhvZFxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xuICogQGFyZ3VtZW50IHtOdW1iZXJ8U3RyaW5nfSBvcHRpb25zLm9mZnNldD0wXG4gKiBUaGUgb2Zmc2V0IHZhbHVlIGFzIGRlc2NyaWJlZCBpbiB0aGUgbW9kaWZpZXIgZGVzY3JpcHRpb25cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcbiAqL1xuZnVuY3Rpb24gb2Zmc2V0KGRhdGEsIF9yZWYpIHtcbiAgdmFyIG9mZnNldCA9IF9yZWYub2Zmc2V0O1xuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQsXG4gICAgICBfZGF0YSRvZmZzZXRzID0gZGF0YS5vZmZzZXRzLFxuICAgICAgcG9wcGVyID0gX2RhdGEkb2Zmc2V0cy5wb3BwZXIsXG4gICAgICByZWZlcmVuY2UgPSBfZGF0YSRvZmZzZXRzLnJlZmVyZW5jZTtcblxuICB2YXIgYmFzZVBsYWNlbWVudCA9IHBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xuXG4gIHZhciBvZmZzZXRzID0gdm9pZCAwO1xuICBpZiAoaXNOdW1lcmljKCtvZmZzZXQpKSB7XG4gICAgb2Zmc2V0cyA9IFsrb2Zmc2V0LCAwXTtcbiAgfSBlbHNlIHtcbiAgICBvZmZzZXRzID0gcGFyc2VPZmZzZXQob2Zmc2V0LCBwb3BwZXIsIHJlZmVyZW5jZSwgYmFzZVBsYWNlbWVudCk7XG4gIH1cblxuICBpZiAoYmFzZVBsYWNlbWVudCA9PT0gJ2xlZnQnKSB7XG4gICAgcG9wcGVyLnRvcCArPSBvZmZzZXRzWzBdO1xuICAgIHBvcHBlci5sZWZ0IC09IG9mZnNldHNbMV07XG4gIH0gZWxzZSBpZiAoYmFzZVBsYWNlbWVudCA9PT0gJ3JpZ2h0Jykge1xuICAgIHBvcHBlci50b3AgKz0gb2Zmc2V0c1swXTtcbiAgICBwb3BwZXIubGVmdCArPSBvZmZzZXRzWzFdO1xuICB9IGVsc2UgaWYgKGJhc2VQbGFjZW1lbnQgPT09ICd0b3AnKSB7XG4gICAgcG9wcGVyLmxlZnQgKz0gb2Zmc2V0c1swXTtcbiAgICBwb3BwZXIudG9wIC09IG9mZnNldHNbMV07XG4gIH0gZWxzZSBpZiAoYmFzZVBsYWNlbWVudCA9PT0gJ2JvdHRvbScpIHtcbiAgICBwb3BwZXIubGVmdCArPSBvZmZzZXRzWzBdO1xuICAgIHBvcHBlci50b3AgKz0gb2Zmc2V0c1sxXTtcbiAgfVxuXG4gIGRhdGEucG9wcGVyID0gcG9wcGVyO1xuICByZXR1cm4gZGF0YTtcbn1cblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBgdXBkYXRlYCBtZXRob2RcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcbiAqL1xuZnVuY3Rpb24gcHJldmVudE92ZXJmbG93KGRhdGEsIG9wdGlvbnMpIHtcbiAgdmFyIGJvdW5kYXJpZXNFbGVtZW50ID0gb3B0aW9ucy5ib3VuZGFyaWVzRWxlbWVudCB8fCBnZXRPZmZzZXRQYXJlbnQoZGF0YS5pbnN0YW5jZS5wb3BwZXIpO1xuXG4gIC8vIElmIG9mZnNldFBhcmVudCBpcyB0aGUgcmVmZXJlbmNlIGVsZW1lbnQsIHdlIHJlYWxseSB3YW50IHRvXG4gIC8vIGdvIG9uZSBzdGVwIHVwIGFuZCB1c2UgdGhlIG5leHQgb2Zmc2V0UGFyZW50IGFzIHJlZmVyZW5jZSB0b1xuICAvLyBhdm9pZCB0byBtYWtlIHRoaXMgbW9kaWZpZXIgY29tcGxldGVseSB1c2VsZXNzIGFuZCBsb29rIGxpa2UgYnJva2VuXG4gIGlmIChkYXRhLmluc3RhbmNlLnJlZmVyZW5jZSA9PT0gYm91bmRhcmllc0VsZW1lbnQpIHtcbiAgICBib3VuZGFyaWVzRWxlbWVudCA9IGdldE9mZnNldFBhcmVudChib3VuZGFyaWVzRWxlbWVudCk7XG4gIH1cblxuICAvLyBOT1RFOiBET00gYWNjZXNzIGhlcmVcbiAgLy8gcmVzZXRzIHRoZSBwb3BwZXIncyBwb3NpdGlvbiBzbyB0aGF0IHRoZSBkb2N1bWVudCBzaXplIGNhbiBiZSBjYWxjdWxhdGVkIGV4Y2x1ZGluZ1xuICAvLyB0aGUgc2l6ZSBvZiB0aGUgcG9wcGVyIGVsZW1lbnQgaXRzZWxmXG4gIHZhciB0cmFuc2Zvcm1Qcm9wID0gZ2V0U3VwcG9ydGVkUHJvcGVydHlOYW1lKCd0cmFuc2Zvcm0nKTtcbiAgdmFyIHBvcHBlclN0eWxlcyA9IGRhdGEuaW5zdGFuY2UucG9wcGVyLnN0eWxlOyAvLyBhc3NpZ25tZW50IHRvIGhlbHAgbWluaWZpY2F0aW9uXG4gIHZhciB0b3AgPSBwb3BwZXJTdHlsZXMudG9wLFxuICAgICAgbGVmdCA9IHBvcHBlclN0eWxlcy5sZWZ0LFxuICAgICAgdHJhbnNmb3JtID0gcG9wcGVyU3R5bGVzW3RyYW5zZm9ybVByb3BdO1xuXG4gIHBvcHBlclN0eWxlcy50b3AgPSAnJztcbiAgcG9wcGVyU3R5bGVzLmxlZnQgPSAnJztcbiAgcG9wcGVyU3R5bGVzW3RyYW5zZm9ybVByb3BdID0gJyc7XG5cbiAgdmFyIGJvdW5kYXJpZXMgPSBnZXRCb3VuZGFyaWVzKGRhdGEuaW5zdGFuY2UucG9wcGVyLCBkYXRhLmluc3RhbmNlLnJlZmVyZW5jZSwgb3B0aW9ucy5wYWRkaW5nLCBib3VuZGFyaWVzRWxlbWVudCwgZGF0YS5wb3NpdGlvbkZpeGVkKTtcblxuICAvLyBOT1RFOiBET00gYWNjZXNzIGhlcmVcbiAgLy8gcmVzdG9yZXMgdGhlIG9yaWdpbmFsIHN0eWxlIHByb3BlcnRpZXMgYWZ0ZXIgdGhlIG9mZnNldHMgaGF2ZSBiZWVuIGNvbXB1dGVkXG4gIHBvcHBlclN0eWxlcy50b3AgPSB0b3A7XG4gIHBvcHBlclN0eWxlcy5sZWZ0ID0gbGVmdDtcbiAgcG9wcGVyU3R5bGVzW3RyYW5zZm9ybVByb3BdID0gdHJhbnNmb3JtO1xuXG4gIG9wdGlvbnMuYm91bmRhcmllcyA9IGJvdW5kYXJpZXM7XG5cbiAgdmFyIG9yZGVyID0gb3B0aW9ucy5wcmlvcml0eTtcbiAgdmFyIHBvcHBlciA9IGRhdGEub2Zmc2V0cy5wb3BwZXI7XG5cbiAgdmFyIGNoZWNrID0ge1xuICAgIHByaW1hcnk6IGZ1bmN0aW9uIHByaW1hcnkocGxhY2VtZW50KSB7XG4gICAgICB2YXIgdmFsdWUgPSBwb3BwZXJbcGxhY2VtZW50XTtcbiAgICAgIGlmIChwb3BwZXJbcGxhY2VtZW50XSA8IGJvdW5kYXJpZXNbcGxhY2VtZW50XSAmJiAhb3B0aW9ucy5lc2NhcGVXaXRoUmVmZXJlbmNlKSB7XG4gICAgICAgIHZhbHVlID0gTWF0aC5tYXgocG9wcGVyW3BsYWNlbWVudF0sIGJvdW5kYXJpZXNbcGxhY2VtZW50XSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkkMSh7fSwgcGxhY2VtZW50LCB2YWx1ZSk7XG4gICAgfSxcbiAgICBzZWNvbmRhcnk6IGZ1bmN0aW9uIHNlY29uZGFyeShwbGFjZW1lbnQpIHtcbiAgICAgIHZhciBtYWluU2lkZSA9IHBsYWNlbWVudCA9PT0gJ3JpZ2h0JyA/ICdsZWZ0JyA6ICd0b3AnO1xuICAgICAgdmFyIHZhbHVlID0gcG9wcGVyW21haW5TaWRlXTtcbiAgICAgIGlmIChwb3BwZXJbcGxhY2VtZW50XSA+IGJvdW5kYXJpZXNbcGxhY2VtZW50XSAmJiAhb3B0aW9ucy5lc2NhcGVXaXRoUmVmZXJlbmNlKSB7XG4gICAgICAgIHZhbHVlID0gTWF0aC5taW4ocG9wcGVyW21haW5TaWRlXSwgYm91bmRhcmllc1twbGFjZW1lbnRdIC0gKHBsYWNlbWVudCA9PT0gJ3JpZ2h0JyA/IHBvcHBlci53aWR0aCA6IHBvcHBlci5oZWlnaHQpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eSQxKHt9LCBtYWluU2lkZSwgdmFsdWUpO1xuICAgIH1cbiAgfTtcblxuICBvcmRlci5mb3JFYWNoKGZ1bmN0aW9uIChwbGFjZW1lbnQpIHtcbiAgICB2YXIgc2lkZSA9IFsnbGVmdCcsICd0b3AnXS5pbmRleE9mKHBsYWNlbWVudCkgIT09IC0xID8gJ3ByaW1hcnknIDogJ3NlY29uZGFyeSc7XG4gICAgcG9wcGVyID0gX2V4dGVuZHMkMSh7fSwgcG9wcGVyLCBjaGVja1tzaWRlXShwbGFjZW1lbnQpKTtcbiAgfSk7XG5cbiAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IHBvcHBlcjtcblxuICByZXR1cm4gZGF0YTtcbn1cblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSBgdXBkYXRlYCBtZXRob2RcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBvcHRpb25zIC0gTW9kaWZpZXJzIGNvbmZpZ3VyYXRpb24gYW5kIG9wdGlvbnNcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBkYXRhIG9iamVjdCwgcHJvcGVybHkgbW9kaWZpZWRcbiAqL1xuZnVuY3Rpb24gc2hpZnQoZGF0YSkge1xuICB2YXIgcGxhY2VtZW50ID0gZGF0YS5wbGFjZW1lbnQ7XG4gIHZhciBiYXNlUGxhY2VtZW50ID0gcGxhY2VtZW50LnNwbGl0KCctJylbMF07XG4gIHZhciBzaGlmdHZhcmlhdGlvbiA9IHBsYWNlbWVudC5zcGxpdCgnLScpWzFdO1xuXG4gIC8vIGlmIHNoaWZ0IHNoaWZ0dmFyaWF0aW9uIGlzIHNwZWNpZmllZCwgcnVuIHRoZSBtb2RpZmllclxuICBpZiAoc2hpZnR2YXJpYXRpb24pIHtcbiAgICB2YXIgX2RhdGEkb2Zmc2V0cyA9IGRhdGEub2Zmc2V0cyxcbiAgICAgICAgcmVmZXJlbmNlID0gX2RhdGEkb2Zmc2V0cy5yZWZlcmVuY2UsXG4gICAgICAgIHBvcHBlciA9IF9kYXRhJG9mZnNldHMucG9wcGVyO1xuXG4gICAgdmFyIGlzVmVydGljYWwgPSBbJ2JvdHRvbScsICd0b3AnXS5pbmRleE9mKGJhc2VQbGFjZW1lbnQpICE9PSAtMTtcbiAgICB2YXIgc2lkZSA9IGlzVmVydGljYWwgPyAnbGVmdCcgOiAndG9wJztcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSBpc1ZlcnRpY2FsID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xuXG4gICAgdmFyIHNoaWZ0T2Zmc2V0cyA9IHtcbiAgICAgIHN0YXJ0OiBkZWZpbmVQcm9wZXJ0eSQxKHt9LCBzaWRlLCByZWZlcmVuY2Vbc2lkZV0pLFxuICAgICAgZW5kOiBkZWZpbmVQcm9wZXJ0eSQxKHt9LCBzaWRlLCByZWZlcmVuY2Vbc2lkZV0gKyByZWZlcmVuY2VbbWVhc3VyZW1lbnRdIC0gcG9wcGVyW21lYXN1cmVtZW50XSlcbiAgICB9O1xuXG4gICAgZGF0YS5vZmZzZXRzLnBvcHBlciA9IF9leHRlbmRzJDEoe30sIHBvcHBlciwgc2hpZnRPZmZzZXRzW3NoaWZ0dmFyaWF0aW9uXSk7XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn1cblxuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBtZW1iZXJvZiBNb2RpZmllcnNcbiAqIEBhcmd1bWVudCB7T2JqZWN0fSBkYXRhIC0gVGhlIGRhdGEgb2JqZWN0IGdlbmVyYXRlZCBieSB1cGRhdGUgbWV0aG9kXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgZGF0YSBvYmplY3QsIHByb3Blcmx5IG1vZGlmaWVkXG4gKi9cbmZ1bmN0aW9uIGhpZGUoZGF0YSkge1xuICBpZiAoIWlzTW9kaWZpZXJSZXF1aXJlZChkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgJ2hpZGUnLCAncHJldmVudE92ZXJmbG93JykpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHZhciByZWZSZWN0ID0gZGF0YS5vZmZzZXRzLnJlZmVyZW5jZTtcbiAgdmFyIGJvdW5kID0gZmluZChkYXRhLmluc3RhbmNlLm1vZGlmaWVycywgZnVuY3Rpb24gKG1vZGlmaWVyKSB7XG4gICAgcmV0dXJuIG1vZGlmaWVyLm5hbWUgPT09ICdwcmV2ZW50T3ZlcmZsb3cnO1xuICB9KS5ib3VuZGFyaWVzO1xuXG4gIGlmIChyZWZSZWN0LmJvdHRvbSA8IGJvdW5kLnRvcCB8fCByZWZSZWN0LmxlZnQgPiBib3VuZC5yaWdodCB8fCByZWZSZWN0LnRvcCA+IGJvdW5kLmJvdHRvbSB8fCByZWZSZWN0LnJpZ2h0IDwgYm91bmQubGVmdCkge1xuICAgIC8vIEF2b2lkIHVubmVjZXNzYXJ5IERPTSBhY2Nlc3MgaWYgdmlzaWJpbGl0eSBoYXNuJ3QgY2hhbmdlZFxuICAgIGlmIChkYXRhLmhpZGUgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIGRhdGEuaGlkZSA9IHRydWU7XG4gICAgZGF0YS5hdHRyaWJ1dGVzWyd4LW91dC1vZi1ib3VuZGFyaWVzJ10gPSAnJztcbiAgfSBlbHNlIHtcbiAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBET00gYWNjZXNzIGlmIHZpc2liaWxpdHkgaGFzbid0IGNoYW5nZWRcbiAgICBpZiAoZGF0YS5oaWRlID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgZGF0YS5oaWRlID0gZmFsc2U7XG4gICAgZGF0YS5hdHRyaWJ1dGVzWyd4LW91dC1vZi1ib3VuZGFyaWVzJ10gPSBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIEBmdW5jdGlvblxuICogQG1lbWJlcm9mIE1vZGlmaWVyc1xuICogQGFyZ3VtZW50IHtPYmplY3R9IGRhdGEgLSBUaGUgZGF0YSBvYmplY3QgZ2VuZXJhdGVkIGJ5IGB1cGRhdGVgIG1ldGhvZFxuICogQGFyZ3VtZW50IHtPYmplY3R9IG9wdGlvbnMgLSBNb2RpZmllcnMgY29uZmlndXJhdGlvbiBhbmQgb3B0aW9uc1xuICogQHJldHVybnMge09iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxuICovXG5mdW5jdGlvbiBpbm5lcihkYXRhKSB7XG4gIHZhciBwbGFjZW1lbnQgPSBkYXRhLnBsYWNlbWVudDtcbiAgdmFyIGJhc2VQbGFjZW1lbnQgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXTtcbiAgdmFyIF9kYXRhJG9mZnNldHMgPSBkYXRhLm9mZnNldHMsXG4gICAgICBwb3BwZXIgPSBfZGF0YSRvZmZzZXRzLnBvcHBlcixcbiAgICAgIHJlZmVyZW5jZSA9IF9kYXRhJG9mZnNldHMucmVmZXJlbmNlO1xuXG4gIHZhciBpc0hvcml6ID0gWydsZWZ0JywgJ3JpZ2h0J10uaW5kZXhPZihiYXNlUGxhY2VtZW50KSAhPT0gLTE7XG5cbiAgdmFyIHN1YnRyYWN0TGVuZ3RoID0gWyd0b3AnLCAnbGVmdCddLmluZGV4T2YoYmFzZVBsYWNlbWVudCkgPT09IC0xO1xuXG4gIHBvcHBlcltpc0hvcml6ID8gJ2xlZnQnIDogJ3RvcCddID0gcmVmZXJlbmNlW2Jhc2VQbGFjZW1lbnRdIC0gKHN1YnRyYWN0TGVuZ3RoID8gcG9wcGVyW2lzSG9yaXogPyAnd2lkdGgnIDogJ2hlaWdodCddIDogMCk7XG5cbiAgZGF0YS5wbGFjZW1lbnQgPSBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpO1xuICBkYXRhLm9mZnNldHMucG9wcGVyID0gZ2V0Q2xpZW50UmVjdChwb3BwZXIpO1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIE1vZGlmaWVyIGZ1bmN0aW9uLCBlYWNoIG1vZGlmaWVyIGNhbiBoYXZlIGEgZnVuY3Rpb24gb2YgdGhpcyB0eXBlIGFzc2lnbmVkXG4gKiB0byBpdHMgYGZuYCBwcm9wZXJ0eS48YnIgLz5cbiAqIFRoZXNlIGZ1bmN0aW9ucyB3aWxsIGJlIGNhbGxlZCBvbiBlYWNoIHVwZGF0ZSwgdGhpcyBtZWFucyB0aGF0IHlvdSBtdXN0XG4gKiBtYWtlIHN1cmUgdGhleSBhcmUgcGVyZm9ybWFudCBlbm91Z2ggdG8gYXZvaWQgcGVyZm9ybWFuY2UgYm90dGxlbmVja3MuXG4gKlxuICogQGZ1bmN0aW9uIE1vZGlmaWVyRm5cbiAqIEBhcmd1bWVudCB7ZGF0YU9iamVjdH0gZGF0YSAtIFRoZSBkYXRhIG9iamVjdCBnZW5lcmF0ZWQgYnkgYHVwZGF0ZWAgbWV0aG9kXG4gKiBAYXJndW1lbnQge09iamVjdH0gb3B0aW9ucyAtIE1vZGlmaWVycyBjb25maWd1cmF0aW9uIGFuZCBvcHRpb25zXG4gKiBAcmV0dXJucyB7ZGF0YU9iamVjdH0gVGhlIGRhdGEgb2JqZWN0LCBwcm9wZXJseSBtb2RpZmllZFxuICovXG5cbi8qKlxuICogTW9kaWZpZXJzIGFyZSBwbHVnaW5zIHVzZWQgdG8gYWx0ZXIgdGhlIGJlaGF2aW9yIG9mIHlvdXIgcG9wcGVycy48YnIgLz5cbiAqIFBvcHBlci5qcyB1c2VzIGEgc2V0IG9mIDkgbW9kaWZpZXJzIHRvIHByb3ZpZGUgYWxsIHRoZSBiYXNpYyBmdW5jdGlvbmFsaXRpZXNcbiAqIG5lZWRlZCBieSB0aGUgbGlicmFyeS5cbiAqXG4gKiBVc3VhbGx5IHlvdSBkb24ndCB3YW50IHRvIG92ZXJyaWRlIHRoZSBgb3JkZXJgLCBgZm5gIGFuZCBgb25Mb2FkYCBwcm9wcy5cbiAqIEFsbCB0aGUgb3RoZXIgcHJvcGVydGllcyBhcmUgY29uZmlndXJhdGlvbnMgdGhhdCBjb3VsZCBiZSB0d2Vha2VkLlxuICogQG5hbWVzcGFjZSBtb2RpZmllcnNcbiAqL1xudmFyIG1vZGlmaWVycyA9IHtcbiAgLyoqXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gc2hpZnQgdGhlIHBvcHBlciBvbiB0aGUgc3RhcnQgb3IgZW5kIG9mIGl0cyByZWZlcmVuY2VcbiAgICogZWxlbWVudC48YnIgLz5cbiAgICogSXQgd2lsbCByZWFkIHRoZSB2YXJpYXRpb24gb2YgdGhlIGBwbGFjZW1lbnRgIHByb3BlcnR5LjxiciAvPlxuICAgKiBJdCBjYW4gYmUgb25lIGVpdGhlciBgLWVuZGAgb3IgYC1zdGFydGAuXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcbiAgICogQGlubmVyXG4gICAqL1xuICBzaGlmdDoge1xuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj0xMDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXG4gICAgb3JkZXI6IDEwMCxcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXG4gICAgZm46IHNoaWZ0XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoZSBgb2Zmc2V0YCBtb2RpZmllciBjYW4gc2hpZnQgeW91ciBwb3BwZXIgb24gYm90aCBpdHMgYXhpcy5cbiAgICpcbiAgICogSXQgYWNjZXB0cyB0aGUgZm9sbG93aW5nIHVuaXRzOlxuICAgKiAtIGBweGAgb3IgdW5pdGxlc3MsIGludGVycHJldGVkIGFzIHBpeGVsc1xuICAgKiAtIGAlYCBvciBgJXJgLCBwZXJjZW50YWdlIHJlbGF0aXZlIHRvIHRoZSBsZW5ndGggb2YgdGhlIHJlZmVyZW5jZSBlbGVtZW50XG4gICAqIC0gYCVwYCwgcGVyY2VudGFnZSByZWxhdGl2ZSB0byB0aGUgbGVuZ3RoIG9mIHRoZSBwb3BwZXIgZWxlbWVudFxuICAgKiAtIGB2d2AsIENTUyB2aWV3cG9ydCB3aWR0aCB1bml0XG4gICAqIC0gYHZoYCwgQ1NTIHZpZXdwb3J0IGhlaWdodCB1bml0XG4gICAqXG4gICAqIEZvciBsZW5ndGggaXMgaW50ZW5kZWQgdGhlIG1haW4gYXhpcyByZWxhdGl2ZSB0byB0aGUgcGxhY2VtZW50IG9mIHRoZSBwb3BwZXIuPGJyIC8+XG4gICAqIFRoaXMgbWVhbnMgdGhhdCBpZiB0aGUgcGxhY2VtZW50IGlzIGB0b3BgIG9yIGBib3R0b21gLCB0aGUgbGVuZ3RoIHdpbGwgYmUgdGhlXG4gICAqIGB3aWR0aGAuIEluIGNhc2Ugb2YgYGxlZnRgIG9yIGByaWdodGAsIGl0IHdpbGwgYmUgdGhlIGhlaWdodC5cbiAgICpcbiAgICogWW91IGNhbiBwcm92aWRlIGEgc2luZ2xlIHZhbHVlIChhcyBgTnVtYmVyYCBvciBgU3RyaW5nYCksIG9yIGEgcGFpciBvZiB2YWx1ZXNcbiAgICogYXMgYFN0cmluZ2AgZGl2aWRlZCBieSBhIGNvbW1hIG9yIG9uZSAob3IgbW9yZSkgd2hpdGUgc3BhY2VzLjxiciAvPlxuICAgKiBUaGUgbGF0dGVyIGlzIGEgZGVwcmVjYXRlZCBtZXRob2QgYmVjYXVzZSBpdCBsZWFkcyB0byBjb25mdXNpb24gYW5kIHdpbGwgYmVcbiAgICogcmVtb3ZlZCBpbiB2Mi48YnIgLz5cbiAgICogQWRkaXRpb25hbGx5LCBpdCBhY2NlcHRzIGFkZGl0aW9ucyBhbmQgc3VidHJhY3Rpb25zIGJldHdlZW4gZGlmZmVyZW50IHVuaXRzLlxuICAgKiBOb3RlIHRoYXQgbXVsdGlwbGljYXRpb25zIGFuZCBkaXZpc2lvbnMgYXJlbid0IHN1cHBvcnRlZC5cbiAgICpcbiAgICogVmFsaWQgZXhhbXBsZXMgYXJlOlxuICAgKiBgYGBcbiAgICogMTBcbiAgICogJzEwJSdcbiAgICogJzEwLCAxMCdcbiAgICogJzEwJSwgMTAnXG4gICAqICcxMCArIDEwJSdcbiAgICogJzEwIC0gNXZoICsgMyUnXG4gICAqICctMTBweCArIDV2aCwgNXB4IC0gNiUnXG4gICAqIGBgYFxuICAgKiA+ICoqTkIqKjogSWYgeW91IGRlc2lyZSB0byBhcHBseSBvZmZzZXRzIHRvIHlvdXIgcG9wcGVycyBpbiBhIHdheSB0aGF0IG1heSBtYWtlIHRoZW0gb3ZlcmxhcFxuICAgKiA+IHdpdGggdGhlaXIgcmVmZXJlbmNlIGVsZW1lbnQsIHVuZm9ydHVuYXRlbHksIHlvdSB3aWxsIGhhdmUgdG8gZGlzYWJsZSB0aGUgYGZsaXBgIG1vZGlmaWVyLlxuICAgKiA+IE1vcmUgb24gdGhpcyBbcmVhZGluZyB0aGlzIGlzc3VlXShodHRwczovL2dpdGh1Yi5jb20vRmV6VnJhc3RhL3BvcHBlci5qcy9pc3N1ZXMvMzczKVxuICAgKlxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXG4gICAqIEBpbm5lclxuICAgKi9cbiAgb2Zmc2V0OiB7XG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTIwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cbiAgICBvcmRlcjogMjAwLFxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cbiAgICBmbjogb2Zmc2V0LFxuICAgIC8qKiBAcHJvcCB7TnVtYmVyfFN0cmluZ30gb2Zmc2V0PTBcbiAgICAgKiBUaGUgb2Zmc2V0IHZhbHVlIGFzIGRlc2NyaWJlZCBpbiB0aGUgbW9kaWZpZXIgZGVzY3JpcHRpb25cbiAgICAgKi9cbiAgICBvZmZzZXQ6IDBcbiAgfSxcblxuICAvKipcbiAgICogTW9kaWZpZXIgdXNlZCB0byBwcmV2ZW50IHRoZSBwb3BwZXIgZnJvbSBiZWluZyBwb3NpdGlvbmVkIG91dHNpZGUgdGhlIGJvdW5kYXJ5LlxuICAgKlxuICAgKiBBbiBzY2VuYXJpbyBleGlzdHMgd2hlcmUgdGhlIHJlZmVyZW5jZSBpdHNlbGYgaXMgbm90IHdpdGhpbiB0aGUgYm91bmRhcmllcy48YnIgLz5cbiAgICogV2UgY2FuIHNheSBpdCBoYXMgXCJlc2NhcGVkIHRoZSBib3VuZGFyaWVzXCIg4oCUIG9yIGp1c3QgXCJlc2NhcGVkXCIuPGJyIC8+XG4gICAqIEluIHRoaXMgY2FzZSB3ZSBuZWVkIHRvIGRlY2lkZSB3aGV0aGVyIHRoZSBwb3BwZXIgc2hvdWxkIGVpdGhlcjpcbiAgICpcbiAgICogLSBkZXRhY2ggZnJvbSB0aGUgcmVmZXJlbmNlIGFuZCByZW1haW4gXCJ0cmFwcGVkXCIgaW4gdGhlIGJvdW5kYXJpZXMsIG9yXG4gICAqIC0gaWYgaXQgc2hvdWxkIGlnbm9yZSB0aGUgYm91bmRhcnkgYW5kIFwiZXNjYXBlIHdpdGggaXRzIHJlZmVyZW5jZVwiXG4gICAqXG4gICAqIFdoZW4gYGVzY2FwZVdpdGhSZWZlcmVuY2VgIGlzIHNldCB0b2B0cnVlYCBhbmQgcmVmZXJlbmNlIGlzIGNvbXBsZXRlbHlcbiAgICogb3V0c2lkZSBpdHMgYm91bmRhcmllcywgdGhlIHBvcHBlciB3aWxsIG92ZXJmbG93IChvciBjb21wbGV0ZWx5IGxlYXZlKVxuICAgKiB0aGUgYm91bmRhcmllcyBpbiBvcmRlciB0byByZW1haW4gYXR0YWNoZWQgdG8gdGhlIGVkZ2Ugb2YgdGhlIHJlZmVyZW5jZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xuICAgKiBAaW5uZXJcbiAgICovXG4gIHByZXZlbnRPdmVyZmxvdzoge1xuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj0zMDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXG4gICAgb3JkZXI6IDMwMCxcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXG4gICAgZm46IHByZXZlbnRPdmVyZmxvdyxcbiAgICAvKipcbiAgICAgKiBAcHJvcCB7QXJyYXl9IFtwcmlvcml0eT1bJ2xlZnQnLCdyaWdodCcsJ3RvcCcsJ2JvdHRvbSddXVxuICAgICAqIFBvcHBlciB3aWxsIHRyeSB0byBwcmV2ZW50IG92ZXJmbG93IGZvbGxvd2luZyB0aGVzZSBwcmlvcml0aWVzIGJ5IGRlZmF1bHQsXG4gICAgICogdGhlbiwgaXQgY291bGQgb3ZlcmZsb3cgb24gdGhlIGxlZnQgYW5kIG9uIHRvcCBvZiB0aGUgYGJvdW5kYXJpZXNFbGVtZW50YFxuICAgICAqL1xuICAgIHByaW9yaXR5OiBbJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbSddLFxuICAgIC8qKlxuICAgICAqIEBwcm9wIHtudW1iZXJ9IHBhZGRpbmc9NVxuICAgICAqIEFtb3VudCBvZiBwaXhlbCB1c2VkIHRvIGRlZmluZSBhIG1pbmltdW0gZGlzdGFuY2UgYmV0d2VlbiB0aGUgYm91bmRhcmllc1xuICAgICAqIGFuZCB0aGUgcG9wcGVyIHRoaXMgbWFrZXMgc3VyZSB0aGUgcG9wcGVyIGhhcyBhbHdheXMgYSBsaXR0bGUgcGFkZGluZ1xuICAgICAqIGJldHdlZW4gdGhlIGVkZ2VzIG9mIGl0cyBjb250YWluZXJcbiAgICAgKi9cbiAgICBwYWRkaW5nOiA1LFxuICAgIC8qKlxuICAgICAqIEBwcm9wIHtTdHJpbmd8SFRNTEVsZW1lbnR9IGJvdW5kYXJpZXNFbGVtZW50PSdzY3JvbGxQYXJlbnQnXG4gICAgICogQm91bmRhcmllcyB1c2VkIGJ5IHRoZSBtb2RpZmllciwgY2FuIGJlIGBzY3JvbGxQYXJlbnRgLCBgd2luZG93YCxcbiAgICAgKiBgdmlld3BvcnRgIG9yIGFueSBET00gZWxlbWVudC5cbiAgICAgKi9cbiAgICBib3VuZGFyaWVzRWxlbWVudDogJ3Njcm9sbFBhcmVudCdcbiAgfSxcblxuICAvKipcbiAgICogTW9kaWZpZXIgdXNlZCB0byBtYWtlIHN1cmUgdGhlIHJlZmVyZW5jZSBhbmQgaXRzIHBvcHBlciBzdGF5IG5lYXIgZWFjaG90aGVyc1xuICAgKiB3aXRob3V0IGxlYXZpbmcgYW55IGdhcCBiZXR3ZWVuIHRoZSB0d28uIEV4cGVjaWFsbHkgdXNlZnVsIHdoZW4gdGhlIGFycm93IGlzXG4gICAqIGVuYWJsZWQgYW5kIHlvdSB3YW50IHRvIGFzc3VyZSBpdCB0byBwb2ludCB0byBpdHMgcmVmZXJlbmNlIGVsZW1lbnQuXG4gICAqIEl0IGNhcmVzIG9ubHkgYWJvdXQgdGhlIGZpcnN0IGF4aXMsIHlvdSBjYW4gc3RpbGwgaGF2ZSBwb3BwZXJzIHdpdGggbWFyZ2luXG4gICAqIGJldHdlZW4gdGhlIHBvcHBlciBhbmQgaXRzIHJlZmVyZW5jZSBlbGVtZW50LlxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXG4gICAqIEBpbm5lclxuICAgKi9cbiAga2VlcFRvZ2V0aGVyOiB7XG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTQwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cbiAgICBvcmRlcjogNDAwLFxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cbiAgICBmbjoga2VlcFRvZ2V0aGVyXG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoaXMgbW9kaWZpZXIgaXMgdXNlZCB0byBtb3ZlIHRoZSBgYXJyb3dFbGVtZW50YCBvZiB0aGUgcG9wcGVyIHRvIG1ha2VcbiAgICogc3VyZSBpdCBpcyBwb3NpdGlvbmVkIGJldHdlZW4gdGhlIHJlZmVyZW5jZSBlbGVtZW50IGFuZCBpdHMgcG9wcGVyIGVsZW1lbnQuXG4gICAqIEl0IHdpbGwgcmVhZCB0aGUgb3V0ZXIgc2l6ZSBvZiB0aGUgYGFycm93RWxlbWVudGAgbm9kZSB0byBkZXRlY3QgaG93IG1hbnlcbiAgICogcGl4ZWxzIG9mIGNvbmp1Y3Rpb24gYXJlIG5lZWRlZC5cbiAgICpcbiAgICogSXQgaGFzIG5vIGVmZmVjdCBpZiBubyBgYXJyb3dFbGVtZW50YCBpcyBwcm92aWRlZC5cbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xuICAgKiBAaW5uZXJcbiAgICovXG4gIGFycm93OiB7XG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTUwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cbiAgICBvcmRlcjogNTAwLFxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cbiAgICBmbjogYXJyb3csXG4gICAgLyoqIEBwcm9wIHtTdHJpbmd8SFRNTEVsZW1lbnR9IGVsZW1lbnQ9J1t4LWFycm93XScgLSBTZWxlY3RvciBvciBub2RlIHVzZWQgYXMgYXJyb3cgKi9cbiAgICBlbGVtZW50OiAnW3gtYXJyb3ddJ1xuICB9LFxuXG4gIC8qKlxuICAgKiBNb2RpZmllciB1c2VkIHRvIGZsaXAgdGhlIHBvcHBlcidzIHBsYWNlbWVudCB3aGVuIGl0IHN0YXJ0cyB0byBvdmVybGFwIGl0c1xuICAgKiByZWZlcmVuY2UgZWxlbWVudC5cbiAgICpcbiAgICogUmVxdWlyZXMgdGhlIGBwcmV2ZW50T3ZlcmZsb3dgIG1vZGlmaWVyIGJlZm9yZSBpdCBpbiBvcmRlciB0byB3b3JrLlxuICAgKlxuICAgKiAqKk5PVEU6KiogdGhpcyBtb2RpZmllciB3aWxsIGludGVycnVwdCB0aGUgY3VycmVudCB1cGRhdGUgY3ljbGUgYW5kIHdpbGxcbiAgICogcmVzdGFydCBpdCBpZiBpdCBkZXRlY3RzIHRoZSBuZWVkIHRvIGZsaXAgdGhlIHBsYWNlbWVudC5cbiAgICogQG1lbWJlcm9mIG1vZGlmaWVyc1xuICAgKiBAaW5uZXJcbiAgICovXG4gIGZsaXA6IHtcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9NjAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xuICAgIG9yZGVyOiA2MDAsXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xuICAgIGZuOiBmbGlwLFxuICAgIC8qKlxuICAgICAqIEBwcm9wIHtTdHJpbmd8QXJyYXl9IGJlaGF2aW9yPSdmbGlwJ1xuICAgICAqIFRoZSBiZWhhdmlvciB1c2VkIHRvIGNoYW5nZSB0aGUgcG9wcGVyJ3MgcGxhY2VtZW50LiBJdCBjYW4gYmUgb25lIG9mXG4gICAgICogYGZsaXBgLCBgY2xvY2t3aXNlYCwgYGNvdW50ZXJjbG9ja3dpc2VgIG9yIGFuIGFycmF5IHdpdGggYSBsaXN0IG9mIHZhbGlkXG4gICAgICogcGxhY2VtZW50cyAod2l0aCBvcHRpb25hbCB2YXJpYXRpb25zKS5cbiAgICAgKi9cbiAgICBiZWhhdmlvcjogJ2ZsaXAnLFxuICAgIC8qKlxuICAgICAqIEBwcm9wIHtudW1iZXJ9IHBhZGRpbmc9NVxuICAgICAqIFRoZSBwb3BwZXIgd2lsbCBmbGlwIGlmIGl0IGhpdHMgdGhlIGVkZ2VzIG9mIHRoZSBgYm91bmRhcmllc0VsZW1lbnRgXG4gICAgICovXG4gICAgcGFkZGluZzogNSxcbiAgICAvKipcbiAgICAgKiBAcHJvcCB7U3RyaW5nfEhUTUxFbGVtZW50fSBib3VuZGFyaWVzRWxlbWVudD0ndmlld3BvcnQnXG4gICAgICogVGhlIGVsZW1lbnQgd2hpY2ggd2lsbCBkZWZpbmUgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIHBvcHBlciBwb3NpdGlvbixcbiAgICAgKiB0aGUgcG9wcGVyIHdpbGwgbmV2ZXIgYmUgcGxhY2VkIG91dHNpZGUgb2YgdGhlIGRlZmluZWQgYm91bmRhcmllc1xuICAgICAqIChleGNlcHQgaWYga2VlcFRvZ2V0aGVyIGlzIGVuYWJsZWQpXG4gICAgICovXG4gICAgYm91bmRhcmllc0VsZW1lbnQ6ICd2aWV3cG9ydCdcbiAgfSxcblxuICAvKipcbiAgICogTW9kaWZpZXIgdXNlZCB0byBtYWtlIHRoZSBwb3BwZXIgZmxvdyB0b3dhcmQgdGhlIGlubmVyIG9mIHRoZSByZWZlcmVuY2UgZWxlbWVudC5cbiAgICogQnkgZGVmYXVsdCwgd2hlbiB0aGlzIG1vZGlmaWVyIGlzIGRpc2FibGVkLCB0aGUgcG9wcGVyIHdpbGwgYmUgcGxhY2VkIG91dHNpZGVcbiAgICogdGhlIHJlZmVyZW5jZSBlbGVtZW50LlxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXG4gICAqIEBpbm5lclxuICAgKi9cbiAgaW5uZXI6IHtcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9NzAwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xuICAgIG9yZGVyOiA3MDAsXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPWZhbHNlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXG4gICAgZm46IGlubmVyXG4gIH0sXG5cbiAgLyoqXG4gICAqIE1vZGlmaWVyIHVzZWQgdG8gaGlkZSB0aGUgcG9wcGVyIHdoZW4gaXRzIHJlZmVyZW5jZSBlbGVtZW50IGlzIG91dHNpZGUgb2YgdGhlXG4gICAqIHBvcHBlciBib3VuZGFyaWVzLiBJdCB3aWxsIHNldCBhIGB4LW91dC1vZi1ib3VuZGFyaWVzYCBhdHRyaWJ1dGUgd2hpY2ggY2FuXG4gICAqIGJlIHVzZWQgdG8gaGlkZSB3aXRoIGEgQ1NTIHNlbGVjdG9yIHRoZSBwb3BwZXIgd2hlbiBpdHMgcmVmZXJlbmNlIGlzXG4gICAqIG91dCBvZiBib3VuZGFyaWVzLlxuICAgKlxuICAgKiBSZXF1aXJlcyB0aGUgYHByZXZlbnRPdmVyZmxvd2AgbW9kaWZpZXIgYmVmb3JlIGl0IGluIG9yZGVyIHRvIHdvcmsuXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcbiAgICogQGlubmVyXG4gICAqL1xuICBoaWRlOiB7XG4gICAgLyoqIEBwcm9wIHtudW1iZXJ9IG9yZGVyPTgwMCAtIEluZGV4IHVzZWQgdG8gZGVmaW5lIHRoZSBvcmRlciBvZiBleGVjdXRpb24gKi9cbiAgICBvcmRlcjogODAwLFxuICAgIC8qKiBAcHJvcCB7Qm9vbGVhbn0gZW5hYmxlZD10cnVlIC0gV2hldGhlciB0aGUgbW9kaWZpZXIgaXMgZW5hYmxlZCBvciBub3QgKi9cbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIC8qKiBAcHJvcCB7TW9kaWZpZXJGbn0gKi9cbiAgICBmbjogaGlkZVxuICB9LFxuXG4gIC8qKlxuICAgKiBDb21wdXRlcyB0aGUgc3R5bGUgdGhhdCB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlciBlbGVtZW50IHRvIGdldHNcbiAgICogcHJvcGVybHkgcG9zaXRpb25lZC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoaXMgbW9kaWZpZXIgd2lsbCBub3QgdG91Y2ggdGhlIERPTSwgaXQganVzdCBwcmVwYXJlcyB0aGUgc3R5bGVzXG4gICAqIHNvIHRoYXQgYGFwcGx5U3R5bGVgIG1vZGlmaWVyIGNhbiBhcHBseSBpdC4gVGhpcyBzZXBhcmF0aW9uIGlzIHVzZWZ1bFxuICAgKiBpbiBjYXNlIHlvdSBuZWVkIHRvIHJlcGxhY2UgYGFwcGx5U3R5bGVgIHdpdGggYSBjdXN0b20gaW1wbGVtZW50YXRpb24uXG4gICAqXG4gICAqIFRoaXMgbW9kaWZpZXIgaGFzIGA4NTBgIGFzIGBvcmRlcmAgdmFsdWUgdG8gbWFpbnRhaW4gYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgKiB3aXRoIHByZXZpb3VzIHZlcnNpb25zIG9mIFBvcHBlci5qcy4gRXhwZWN0IHRoZSBtb2RpZmllcnMgb3JkZXJpbmcgbWV0aG9kXG4gICAqIHRvIGNoYW5nZSBpbiBmdXR1cmUgbWFqb3IgdmVyc2lvbnMgb2YgdGhlIGxpYnJhcnkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBtb2RpZmllcnNcbiAgICogQGlubmVyXG4gICAqL1xuICBjb21wdXRlU3R5bGU6IHtcbiAgICAvKiogQHByb3Age251bWJlcn0gb3JkZXI9ODUwIC0gSW5kZXggdXNlZCB0byBkZWZpbmUgdGhlIG9yZGVyIG9mIGV4ZWN1dGlvbiAqL1xuICAgIG9yZGVyOiA4NTAsXG4gICAgLyoqIEBwcm9wIHtCb29sZWFufSBlbmFibGVkPXRydWUgLSBXaGV0aGVyIHRoZSBtb2RpZmllciBpcyBlbmFibGVkIG9yIG5vdCAqL1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgLyoqIEBwcm9wIHtNb2RpZmllckZufSAqL1xuICAgIGZuOiBjb21wdXRlU3R5bGUsXG4gICAgLyoqXG4gICAgICogQHByb3Age0Jvb2xlYW59IGdwdUFjY2VsZXJhdGlvbj10cnVlXG4gICAgICogSWYgdHJ1ZSwgaXQgdXNlcyB0aGUgQ1NTIDNkIHRyYW5zZm9ybWF0aW9uIHRvIHBvc2l0aW9uIHRoZSBwb3BwZXIuXG4gICAgICogT3RoZXJ3aXNlLCBpdCB3aWxsIHVzZSB0aGUgYHRvcGAgYW5kIGBsZWZ0YCBwcm9wZXJ0aWVzLlxuICAgICAqL1xuICAgIGdwdUFjY2VsZXJhdGlvbjogdHJ1ZSxcbiAgICAvKipcbiAgICAgKiBAcHJvcCB7c3RyaW5nfSBbeD0nYm90dG9tJ11cbiAgICAgKiBXaGVyZSB0byBhbmNob3IgdGhlIFggYXhpcyAoYGJvdHRvbWAgb3IgYHRvcGApLiBBS0EgWCBvZmZzZXQgb3JpZ2luLlxuICAgICAqIENoYW5nZSB0aGlzIGlmIHlvdXIgcG9wcGVyIHNob3VsZCBncm93IGluIGEgZGlyZWN0aW9uIGRpZmZlcmVudCBmcm9tIGBib3R0b21gXG4gICAgICovXG4gICAgeDogJ2JvdHRvbScsXG4gICAgLyoqXG4gICAgICogQHByb3Age3N0cmluZ30gW3g9J2xlZnQnXVxuICAgICAqIFdoZXJlIHRvIGFuY2hvciB0aGUgWSBheGlzIChgbGVmdGAgb3IgYHJpZ2h0YCkuIEFLQSBZIG9mZnNldCBvcmlnaW4uXG4gICAgICogQ2hhbmdlIHRoaXMgaWYgeW91ciBwb3BwZXIgc2hvdWxkIGdyb3cgaW4gYSBkaXJlY3Rpb24gZGlmZmVyZW50IGZyb20gYHJpZ2h0YFxuICAgICAqL1xuICAgIHk6ICdyaWdodCdcbiAgfSxcblxuICAvKipcbiAgICogQXBwbGllcyB0aGUgY29tcHV0ZWQgc3R5bGVzIHRvIHRoZSBwb3BwZXIgZWxlbWVudC5cbiAgICpcbiAgICogQWxsIHRoZSBET00gbWFuaXB1bGF0aW9ucyBhcmUgbGltaXRlZCB0byB0aGlzIG1vZGlmaWVyLiBUaGlzIGlzIHVzZWZ1bCBpbiBjYXNlXG4gICAqIHlvdSB3YW50IHRvIGludGVncmF0ZSBQb3BwZXIuanMgaW5zaWRlIGEgZnJhbWV3b3JrIG9yIHZpZXcgbGlicmFyeSBhbmQgeW91XG4gICAqIHdhbnQgdG8gZGVsZWdhdGUgYWxsIHRoZSBET00gbWFuaXB1bGF0aW9ucyB0byBpdC5cbiAgICpcbiAgICogTm90ZSB0aGF0IGlmIHlvdSBkaXNhYmxlIHRoaXMgbW9kaWZpZXIsIHlvdSBtdXN0IG1ha2Ugc3VyZSB0aGUgcG9wcGVyIGVsZW1lbnRcbiAgICogaGFzIGl0cyBwb3NpdGlvbiBzZXQgdG8gYGFic29sdXRlYCBiZWZvcmUgUG9wcGVyLmpzIGNhbiBkbyBpdHMgd29yayFcbiAgICpcbiAgICogSnVzdCBkaXNhYmxlIHRoaXMgbW9kaWZpZXIgYW5kIGRlZmluZSB5b3Ugb3duIHRvIGFjaGlldmUgdGhlIGRlc2lyZWQgZWZmZWN0LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgbW9kaWZpZXJzXG4gICAqIEBpbm5lclxuICAgKi9cbiAgYXBwbHlTdHlsZToge1xuICAgIC8qKiBAcHJvcCB7bnVtYmVyfSBvcmRlcj05MDAgLSBJbmRleCB1c2VkIHRvIGRlZmluZSB0aGUgb3JkZXIgb2YgZXhlY3V0aW9uICovXG4gICAgb3JkZXI6IDkwMCxcbiAgICAvKiogQHByb3Age0Jvb2xlYW59IGVuYWJsZWQ9dHJ1ZSAtIFdoZXRoZXIgdGhlIG1vZGlmaWVyIGlzIGVuYWJsZWQgb3Igbm90ICovXG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAvKiogQHByb3Age01vZGlmaWVyRm59ICovXG4gICAgZm46IGFwcGx5U3R5bGUsXG4gICAgLyoqIEBwcm9wIHtGdW5jdGlvbn0gKi9cbiAgICBvbkxvYWQ6IGFwcGx5U3R5bGVPbkxvYWQsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAxLjEwLjAsIHRoZSBwcm9wZXJ0eSBtb3ZlZCB0byBgY29tcHV0ZVN0eWxlYCBtb2RpZmllclxuICAgICAqIEBwcm9wIHtCb29sZWFufSBncHVBY2NlbGVyYXRpb249dHJ1ZVxuICAgICAqIElmIHRydWUsIGl0IHVzZXMgdGhlIENTUyAzZCB0cmFuc2Zvcm1hdGlvbiB0byBwb3NpdGlvbiB0aGUgcG9wcGVyLlxuICAgICAqIE90aGVyd2lzZSwgaXQgd2lsbCB1c2UgdGhlIGB0b3BgIGFuZCBgbGVmdGAgcHJvcGVydGllcy5cbiAgICAgKi9cbiAgICBncHVBY2NlbGVyYXRpb246IHVuZGVmaW5lZFxuICB9XG59O1xuXG4vKipcbiAqIFRoZSBgZGF0YU9iamVjdGAgaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSBpbmZvcm1hdGlvbnMgdXNlZCBieSBQb3BwZXIuanNcbiAqIHRoaXMgb2JqZWN0IGdldCBwYXNzZWQgdG8gbW9kaWZpZXJzIGFuZCB0byB0aGUgYG9uQ3JlYXRlYCBhbmQgYG9uVXBkYXRlYCBjYWxsYmFja3MuXG4gKiBAbmFtZSBkYXRhT2JqZWN0XG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5pbnN0YW5jZSBUaGUgUG9wcGVyLmpzIGluc3RhbmNlXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZGF0YS5wbGFjZW1lbnQgUGxhY2VtZW50IGFwcGxpZWQgdG8gcG9wcGVyXG4gKiBAcHJvcGVydHkge1N0cmluZ30gZGF0YS5vcmlnaW5hbFBsYWNlbWVudCBQbGFjZW1lbnQgb3JpZ2luYWxseSBkZWZpbmVkIG9uIGluaXRcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGF0YS5mbGlwcGVkIFRydWUgaWYgcG9wcGVyIGhhcyBiZWVuIGZsaXBwZWQgYnkgZmxpcCBtb2RpZmllclxuICogQHByb3BlcnR5IHtCb29sZWFufSBkYXRhLmhpZGUgVHJ1ZSBpZiB0aGUgcmVmZXJlbmNlIGVsZW1lbnQgaXMgb3V0IG9mIGJvdW5kYXJpZXMsIHVzZWZ1bCB0byBrbm93IHdoZW4gdG8gaGlkZSB0aGUgcG9wcGVyLlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZGF0YS5hcnJvd0VsZW1lbnQgTm9kZSB1c2VkIGFzIGFycm93IGJ5IGFycm93IG1vZGlmaWVyXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5zdHlsZXMgQW55IENTUyBwcm9wZXJ0eSBkZWZpbmVkIGhlcmUgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBwb3BwZXIsIGl0IGV4cGVjdHMgdGhlIEphdmFTY3JpcHQgbm9tZW5jbGF0dXJlIChlZy4gYG1hcmdpbkJvdHRvbWApXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5hcnJvd1N0eWxlcyBBbnkgQ1NTIHByb3BlcnR5IGRlZmluZWQgaGVyZSB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlciBhcnJvdywgaXQgZXhwZWN0cyB0aGUgSmF2YVNjcmlwdCBub21lbmNsYXR1cmUgKGVnLiBgbWFyZ2luQm90dG9tYClcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLmJvdW5kYXJpZXMgT2Zmc2V0cyBvZiB0aGUgcG9wcGVyIGJvdW5kYXJpZXNcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLm9mZnNldHMgVGhlIG1lYXN1cmVtZW50cyBvZiBwb3BwZXIsIHJlZmVyZW5jZSBhbmQgYXJyb3cgZWxlbWVudHMuXG4gKiBAcHJvcGVydHkge09iamVjdH0gZGF0YS5vZmZzZXRzLnBvcHBlciBgdG9wYCwgYGxlZnRgLCBgd2lkdGhgLCBgaGVpZ2h0YCB2YWx1ZXNcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhLm9mZnNldHMucmVmZXJlbmNlIGB0b3BgLCBgbGVmdGAsIGB3aWR0aGAsIGBoZWlnaHRgIHZhbHVlc1xuICogQHByb3BlcnR5IHtPYmplY3R9IGRhdGEub2Zmc2V0cy5hcnJvd10gYHRvcGAgYW5kIGBsZWZ0YCBvZmZzZXRzLCBvbmx5IG9uZSBvZiB0aGVtIHdpbGwgYmUgZGlmZmVyZW50IGZyb20gMFxuICovXG5cbi8qKlxuICogRGVmYXVsdCBvcHRpb25zIHByb3ZpZGVkIHRvIFBvcHBlci5qcyBjb25zdHJ1Y3Rvci48YnIgLz5cbiAqIFRoZXNlIGNhbiBiZSBvdmVycmlkZW4gdXNpbmcgdGhlIGBvcHRpb25zYCBhcmd1bWVudCBvZiBQb3BwZXIuanMuPGJyIC8+XG4gKiBUbyBvdmVycmlkZSBhbiBvcHRpb24sIHNpbXBseSBwYXNzIGFzIDNyZCBhcmd1bWVudCBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZVxuICogc3RydWN0dXJlIG9mIHRoaXMgb2JqZWN0LCBleGFtcGxlOlxuICogYGBgXG4gKiBuZXcgUG9wcGVyKHJlZiwgcG9wLCB7XG4gKiAgIG1vZGlmaWVyczoge1xuICogICAgIHByZXZlbnRPdmVyZmxvdzogeyBlbmFibGVkOiBmYWxzZSB9XG4gKiAgIH1cbiAqIH0pXG4gKiBgYGBcbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyb2YgUG9wcGVyXG4gKi9cbnZhciBEZWZhdWx0cyA9IHtcbiAgLyoqXG4gICAqIFBvcHBlcidzIHBsYWNlbWVudFxuICAgKiBAcHJvcCB7UG9wcGVyLnBsYWNlbWVudHN9IHBsYWNlbWVudD0nYm90dG9tJ1xuICAgKi9cbiAgcGxhY2VtZW50OiAnYm90dG9tJyxcblxuICAvKipcbiAgICogU2V0IHRoaXMgdG8gdHJ1ZSBpZiB5b3Ugd2FudCBwb3BwZXIgdG8gcG9zaXRpb24gaXQgc2VsZiBpbiAnZml4ZWQnIG1vZGVcbiAgICogQHByb3Age0Jvb2xlYW59IHBvc2l0aW9uRml4ZWQ9ZmFsc2VcbiAgICovXG4gIHBvc2l0aW9uRml4ZWQ6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGV2ZW50cyAocmVzaXplLCBzY3JvbGwpIGFyZSBpbml0aWFsbHkgZW5hYmxlZFxuICAgKiBAcHJvcCB7Qm9vbGVhbn0gZXZlbnRzRW5hYmxlZD10cnVlXG4gICAqL1xuICBldmVudHNFbmFibGVkOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBTZXQgdG8gdHJ1ZSBpZiB5b3Ugd2FudCB0byBhdXRvbWF0aWNhbGx5IHJlbW92ZSB0aGUgcG9wcGVyIHdoZW5cbiAgICogeW91IGNhbGwgdGhlIGBkZXN0cm95YCBtZXRob2QuXG4gICAqIEBwcm9wIHtCb29sZWFufSByZW1vdmVPbkRlc3Ryb3k9ZmFsc2VcbiAgICovXG4gIHJlbW92ZU9uRGVzdHJveTogZmFsc2UsXG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGNhbGxlZCB3aGVuIHRoZSBwb3BwZXIgaXMgY3JlYXRlZC48YnIgLz5cbiAgICogQnkgZGVmYXVsdCwgaXMgc2V0IHRvIG5vLW9wLjxiciAvPlxuICAgKiBBY2Nlc3MgUG9wcGVyLmpzIGluc3RhbmNlIHdpdGggYGRhdGEuaW5zdGFuY2VgLlxuICAgKiBAcHJvcCB7b25DcmVhdGV9XG4gICAqL1xuICBvbkNyZWF0ZTogZnVuY3Rpb24gb25DcmVhdGUoKSB7fSxcblxuICAvKipcbiAgICogQ2FsbGJhY2sgY2FsbGVkIHdoZW4gdGhlIHBvcHBlciBpcyB1cGRhdGVkLCB0aGlzIGNhbGxiYWNrIGlzIG5vdCBjYWxsZWRcbiAgICogb24gdGhlIGluaXRpYWxpemF0aW9uL2NyZWF0aW9uIG9mIHRoZSBwb3BwZXIsIGJ1dCBvbmx5IG9uIHN1YnNlcXVlbnRcbiAgICogdXBkYXRlcy48YnIgLz5cbiAgICogQnkgZGVmYXVsdCwgaXMgc2V0IHRvIG5vLW9wLjxiciAvPlxuICAgKiBBY2Nlc3MgUG9wcGVyLmpzIGluc3RhbmNlIHdpdGggYGRhdGEuaW5zdGFuY2VgLlxuICAgKiBAcHJvcCB7b25VcGRhdGV9XG4gICAqL1xuICBvblVwZGF0ZTogZnVuY3Rpb24gb25VcGRhdGUoKSB7fSxcblxuICAvKipcbiAgICogTGlzdCBvZiBtb2RpZmllcnMgdXNlZCB0byBtb2RpZnkgdGhlIG9mZnNldHMgYmVmb3JlIHRoZXkgYXJlIGFwcGxpZWQgdG8gdGhlIHBvcHBlci5cbiAgICogVGhleSBwcm92aWRlIG1vc3Qgb2YgdGhlIGZ1bmN0aW9uYWxpdGllcyBvZiBQb3BwZXIuanNcbiAgICogQHByb3Age21vZGlmaWVyc31cbiAgICovXG4gIG1vZGlmaWVyczogbW9kaWZpZXJzXG59O1xuXG4vKipcbiAqIEBjYWxsYmFjayBvbkNyZWF0ZVxuICogQHBhcmFtIHtkYXRhT2JqZWN0fSBkYXRhXG4gKi9cblxuLyoqXG4gKiBAY2FsbGJhY2sgb25VcGRhdGVcbiAqIEBwYXJhbSB7ZGF0YU9iamVjdH0gZGF0YVxuICovXG5cbi8vIFV0aWxzXG4vLyBNZXRob2RzXG52YXIgUG9wcGVyID0gZnVuY3Rpb24gKCkge1xuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IFBvcHBlci5qcyBpbnN0YW5jZVxuICAgKiBAY2xhc3MgUG9wcGVyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8cmVmZXJlbmNlT2JqZWN0fSByZWZlcmVuY2UgLSBUaGUgcmVmZXJlbmNlIGVsZW1lbnQgdXNlZCB0byBwb3NpdGlvbiB0aGUgcG9wcGVyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBvcHBlciAtIFRoZSBIVE1MIGVsZW1lbnQgdXNlZCBhcyBwb3BwZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gWW91ciBjdXN0b20gb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgb25lcyBkZWZpbmVkIGluIFtEZWZhdWx0c10oI2RlZmF1bHRzKVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IGluc3RhbmNlIC0gVGhlIGdlbmVyYXRlZCBQb3BwZXIuanMgaW5zdGFuY2VcbiAgICovXG4gIGZ1bmN0aW9uIFBvcHBlcihyZWZlcmVuY2UsIHBvcHBlcikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG4gICAgY2xhc3NDYWxsQ2hlY2skMSh0aGlzLCBQb3BwZXIpO1xuXG4gICAgdGhpcy5zY2hlZHVsZVVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoX3RoaXMudXBkYXRlKTtcbiAgICB9O1xuXG4gICAgLy8gbWFrZSB1cGRhdGUoKSBkZWJvdW5jZWQsIHNvIHRoYXQgaXQgb25seSBydW5zIGF0IG1vc3Qgb25jZS1wZXItdGlja1xuICAgIHRoaXMudXBkYXRlID0gZGVib3VuY2UodGhpcy51cGRhdGUuYmluZCh0aGlzKSk7XG5cbiAgICAvLyB3aXRoIHt9IHdlIGNyZWF0ZSBhIG5ldyBvYmplY3Qgd2l0aCB0aGUgb3B0aW9ucyBpbnNpZGUgaXRcbiAgICB0aGlzLm9wdGlvbnMgPSBfZXh0ZW5kcyQxKHt9LCBQb3BwZXIuRGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgLy8gaW5pdCBzdGF0ZVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc0Rlc3Ryb3llZDogZmFsc2UsXG4gICAgICBpc0NyZWF0ZWQ6IGZhbHNlLFxuICAgICAgc2Nyb2xsUGFyZW50czogW11cbiAgICB9O1xuXG4gICAgLy8gZ2V0IHJlZmVyZW5jZSBhbmQgcG9wcGVyIGVsZW1lbnRzIChhbGxvdyBqUXVlcnkgd3JhcHBlcnMpXG4gICAgdGhpcy5yZWZlcmVuY2UgPSByZWZlcmVuY2UgJiYgcmVmZXJlbmNlLmpxdWVyeSA/IHJlZmVyZW5jZVswXSA6IHJlZmVyZW5jZTtcbiAgICB0aGlzLnBvcHBlciA9IHBvcHBlciAmJiBwb3BwZXIuanF1ZXJ5ID8gcG9wcGVyWzBdIDogcG9wcGVyO1xuXG4gICAgLy8gRGVlcCBtZXJnZSBtb2RpZmllcnMgb3B0aW9uc1xuICAgIHRoaXMub3B0aW9ucy5tb2RpZmllcnMgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhfZXh0ZW5kcyQxKHt9LCBQb3BwZXIuRGVmYXVsdHMubW9kaWZpZXJzLCBvcHRpb25zLm1vZGlmaWVycykpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIF90aGlzLm9wdGlvbnMubW9kaWZpZXJzW25hbWVdID0gX2V4dGVuZHMkMSh7fSwgUG9wcGVyLkRlZmF1bHRzLm1vZGlmaWVyc1tuYW1lXSB8fCB7fSwgb3B0aW9ucy5tb2RpZmllcnMgPyBvcHRpb25zLm1vZGlmaWVyc1tuYW1lXSA6IHt9KTtcbiAgICB9KTtcblxuICAgIC8vIFJlZmFjdG9yaW5nIG1vZGlmaWVycycgbGlzdCAoT2JqZWN0ID0+IEFycmF5KVxuICAgIHRoaXMubW9kaWZpZXJzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLm1vZGlmaWVycykubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICByZXR1cm4gX2V4dGVuZHMkMSh7XG4gICAgICAgIG5hbWU6IG5hbWVcbiAgICAgIH0sIF90aGlzLm9wdGlvbnMubW9kaWZpZXJzW25hbWVdKTtcbiAgICB9KVxuICAgIC8vIHNvcnQgdGhlIG1vZGlmaWVycyBieSBvcmRlclxuICAgIC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gYS5vcmRlciAtIGIub3JkZXI7XG4gICAgfSk7XG5cbiAgICAvLyBtb2RpZmllcnMgaGF2ZSB0aGUgYWJpbGl0eSB0byBleGVjdXRlIGFyYml0cmFyeSBjb2RlIHdoZW4gUG9wcGVyLmpzIGdldCBpbml0ZWRcbiAgICAvLyBzdWNoIGNvZGUgaXMgZXhlY3V0ZWQgaW4gdGhlIHNhbWUgb3JkZXIgb2YgaXRzIG1vZGlmaWVyXG4gICAgLy8gdGhleSBjb3VsZCBhZGQgbmV3IHByb3BlcnRpZXMgdG8gdGhlaXIgb3B0aW9ucyBjb25maWd1cmF0aW9uXG4gICAgLy8gQkUgQVdBUkU6IGRvbid0IGFkZCBvcHRpb25zIHRvIGBvcHRpb25zLm1vZGlmaWVycy5uYW1lYCBidXQgdG8gYG1vZGlmaWVyT3B0aW9uc2AhXG4gICAgdGhpcy5tb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAobW9kaWZpZXJPcHRpb25zKSB7XG4gICAgICBpZiAobW9kaWZpZXJPcHRpb25zLmVuYWJsZWQgJiYgaXNGdW5jdGlvbihtb2RpZmllck9wdGlvbnMub25Mb2FkKSkge1xuICAgICAgICBtb2RpZmllck9wdGlvbnMub25Mb2FkKF90aGlzLnJlZmVyZW5jZSwgX3RoaXMucG9wcGVyLCBfdGhpcy5vcHRpb25zLCBtb2RpZmllck9wdGlvbnMsIF90aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGZpcmUgdGhlIGZpcnN0IHVwZGF0ZSB0byBwb3NpdGlvbiB0aGUgcG9wcGVyIGluIHRoZSByaWdodCBwbGFjZVxuICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICB2YXIgZXZlbnRzRW5hYmxlZCA9IHRoaXMub3B0aW9ucy5ldmVudHNFbmFibGVkO1xuICAgIGlmIChldmVudHNFbmFibGVkKSB7XG4gICAgICAvLyBzZXR1cCBldmVudCBsaXN0ZW5lcnMsIHRoZXkgd2lsbCB0YWtlIGNhcmUgb2YgdXBkYXRlIHRoZSBwb3NpdGlvbiBpbiBzcGVjaWZpYyBzaXR1YXRpb25zXG4gICAgICB0aGlzLmVuYWJsZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZS5ldmVudHNFbmFibGVkID0gZXZlbnRzRW5hYmxlZDtcbiAgfVxuXG4gIC8vIFdlIGNhbid0IHVzZSBjbGFzcyBwcm9wZXJ0aWVzIGJlY2F1c2UgdGhleSBkb24ndCBnZXQgbGlzdGVkIGluIHRoZVxuICAvLyBjbGFzcyBwcm90b3R5cGUgYW5kIGJyZWFrIHN0dWZmIGxpa2UgU2lub24gc3R1YnNcblxuXG4gIGNyZWF0ZUNsYXNzJDEoUG9wcGVyLCBbe1xuICAgIGtleTogJ3VwZGF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZSQkMSgpIHtcbiAgICAgIHJldHVybiB1cGRhdGUuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdkZXN0cm95JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSQkMSgpIHtcbiAgICAgIHJldHVybiBkZXN0cm95LmNhbGwodGhpcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZW5hYmxlRXZlbnRMaXN0ZW5lcnMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbmFibGVFdmVudExpc3RlbmVycyQkMSgpIHtcbiAgICAgIHJldHVybiBlbmFibGVFdmVudExpc3RlbmVycy5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2Rpc2FibGVFdmVudExpc3RlbmVycycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc2FibGVFdmVudExpc3RlbmVycyQkMSgpIHtcbiAgICAgIHJldHVybiBkaXNhYmxlRXZlbnRMaXN0ZW5lcnMuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTY2hlZHVsZSBhbiB1cGRhdGUsIGl0IHdpbGwgcnVuIG9uIHRoZSBuZXh0IFVJIHVwZGF0ZSBhdmFpbGFibGVcbiAgICAgKiBAbWV0aG9kIHNjaGVkdWxlVXBkYXRlXG4gICAgICogQG1lbWJlcm9mIFBvcHBlclxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQ29sbGVjdGlvbiBvZiB1dGlsaXRpZXMgdXNlZnVsIHdoZW4gd3JpdGluZyBjdXN0b20gbW9kaWZpZXJzLlxuICAgICAqIFN0YXJ0aW5nIGZyb20gdmVyc2lvbiAxLjcsIHRoaXMgbWV0aG9kIGlzIGF2YWlsYWJsZSBvbmx5IGlmIHlvdVxuICAgICAqIGluY2x1ZGUgYHBvcHBlci11dGlscy5qc2AgYmVmb3JlIGBwb3BwZXIuanNgLlxuICAgICAqXG4gICAgICogKipERVBSRUNBVElPTioqOiBUaGlzIHdheSB0byBhY2Nlc3MgUG9wcGVyVXRpbHMgaXMgZGVwcmVjYXRlZFxuICAgICAqIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdjIhIFVzZSB0aGUgUG9wcGVyVXRpbHMgbW9kdWxlIGRpcmVjdGx5IGluc3RlYWQuXG4gICAgICogRHVlIHRvIHRoZSBoaWdoIGluc3RhYmlsaXR5IG9mIHRoZSBtZXRob2RzIGNvbnRhaW5lZCBpbiBVdGlscywgd2UgY2FuJ3RcbiAgICAgKiBndWFyYW50ZWUgdGhlbSB0byBmb2xsb3cgc2VtdmVyLiBVc2UgdGhlbSBhdCB5b3VyIG93biByaXNrIVxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAxLjhcbiAgICAgKiBAbWVtYmVyIFV0aWxzXG4gICAgICogQG1lbWJlcm9mIFBvcHBlclxuICAgICAqL1xuXG4gIH1dKTtcbiAgcmV0dXJuIFBvcHBlcjtcbn0oKTtcblxuLyoqXG4gKiBUaGUgYHJlZmVyZW5jZU9iamVjdGAgaXMgYW4gb2JqZWN0IHRoYXQgcHJvdmlkZXMgYW4gaW50ZXJmYWNlIGNvbXBhdGlibGUgd2l0aCBQb3BwZXIuanNcbiAqIGFuZCBsZXRzIHlvdSB1c2UgaXQgYXMgcmVwbGFjZW1lbnQgb2YgYSByZWFsIERPTSBub2RlLjxiciAvPlxuICogWW91IGNhbiB1c2UgdGhpcyBtZXRob2QgdG8gcG9zaXRpb24gYSBwb3BwZXIgcmVsYXRpdmVseSB0byBhIHNldCBvZiBjb29yZGluYXRlc1xuICogaW4gY2FzZSB5b3UgZG9uJ3QgaGF2ZSBhIERPTSBub2RlIHRvIHVzZSBhcyByZWZlcmVuY2UuXG4gKlxuICogYGBgXG4gKiBuZXcgUG9wcGVyKHJlZmVyZW5jZU9iamVjdCwgcG9wcGVyTm9kZSk7XG4gKiBgYGBcbiAqXG4gKiBOQjogVGhpcyBmZWF0dXJlIGlzbid0IHN1cHBvcnRlZCBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMFxuICogQG5hbWUgcmVmZXJlbmNlT2JqZWN0XG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBkYXRhLmdldEJvdW5kaW5nQ2xpZW50UmVjdFxuICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzZXQgb2YgY29vcmRpbmF0ZXMgY29tcGF0aWJsZSB3aXRoIHRoZSBuYXRpdmUgYGdldEJvdW5kaW5nQ2xpZW50UmVjdGAgbWV0aG9kLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGRhdGEuY2xpZW50V2lkdGhcbiAqIEFuIEVTNiBnZXR0ZXIgdGhhdCB3aWxsIHJldHVybiB0aGUgd2lkdGggb2YgdGhlIHZpcnR1YWwgcmVmZXJlbmNlIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge251bWJlcn0gZGF0YS5jbGllbnRIZWlnaHRcbiAqIEFuIEVTNiBnZXR0ZXIgdGhhdCB3aWxsIHJldHVybiB0aGUgaGVpZ2h0IG9mIHRoZSB2aXJ0dWFsIHJlZmVyZW5jZSBlbGVtZW50LlxuICovXG5cblBvcHBlci5VdGlscyA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbCkuUG9wcGVyVXRpbHM7XG5Qb3BwZXIucGxhY2VtZW50cyA9IHBsYWNlbWVudHM7XG5Qb3BwZXIuRGVmYXVsdHMgPSBEZWZhdWx0cztcblxuLyoqXG4gKiBUcmlnZ2VycyBkb2N1bWVudCByZWZsb3cuXG4gKiBVc2Ugdm9pZCBiZWNhdXNlIHNvbWUgbWluaWZpZXJzIG9yIGVuZ2luZXMgdGhpbmsgc2ltcGx5IGFjY2Vzc2luZyB0aGUgcHJvcGVydHlcbiAqIGlzIHVubmVjZXNzYXJ5LlxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcbiAqL1xuZnVuY3Rpb24gcmVmbG93KHBvcHBlcikge1xuICB2b2lkIHBvcHBlci5vZmZzZXRIZWlnaHQ7XG59XG5cbi8qKlxuICogV3JhcHBlciB1dGlsIGZvciBwb3BwZXIgcG9zaXRpb24gdXBkYXRpbmcuXG4gKiBVcGRhdGVzIHRoZSBwb3BwZXIncyBwb3NpdGlvbiBhbmQgaW52b2tlcyB0aGUgY2FsbGJhY2sgb24gdXBkYXRlLlxuICogSGFja2lzaCB3b3JrYXJvdW5kIHVudGlsIFBvcHBlciAyLjAncyB1cGRhdGUoKSBiZWNvbWVzIHN5bmMuXG4gKiBAcGFyYW0ge1BvcHBlcn0gcG9wcGVySW5zdGFuY2VcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrOiB0byBydW4gb25jZSBwb3BwZXIncyBwb3NpdGlvbiB3YXMgdXBkYXRlZFxuICogQHBhcmFtIHtCb29sZWFufSB1cGRhdGVBbHJlYWR5Q2FsbGVkOiB3YXMgc2NoZWR1bGVVcGRhdGUoKSBhbHJlYWR5IGNhbGxlZD9cbiAqL1xuZnVuY3Rpb24gdXBkYXRlUG9wcGVyUG9zaXRpb24ocG9wcGVySW5zdGFuY2UsIGNhbGxiYWNrLCB1cGRhdGVBbHJlYWR5Q2FsbGVkKSB7XG4gIHZhciBwb3BwZXIgPSBwb3BwZXJJbnN0YW5jZS5wb3BwZXIsXG4gICAgICBvcHRpb25zID0gcG9wcGVySW5zdGFuY2Uub3B0aW9ucztcblxuICB2YXIgb25DcmVhdGUgPSBvcHRpb25zLm9uQ3JlYXRlO1xuICB2YXIgb25VcGRhdGUgPSBvcHRpb25zLm9uVXBkYXRlO1xuXG4gIG9wdGlvbnMub25DcmVhdGUgPSBvcHRpb25zLm9uVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHJlZmxvdyhwb3BwZXIpLCBjYWxsYmFjayAmJiBjYWxsYmFjaygpLCBvblVwZGF0ZSgpO1xuICAgIG9wdGlvbnMub25DcmVhdGUgPSBvbkNyZWF0ZTtcbiAgICBvcHRpb25zLm9uVXBkYXRlID0gb25VcGRhdGU7XG4gIH07XG5cbiAgaWYgKCF1cGRhdGVBbHJlYWR5Q2FsbGVkKSB7XG4gICAgcG9wcGVySW5zdGFuY2Uuc2NoZWR1bGVVcGRhdGUoKTtcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGNvcmUgcGxhY2VtZW50ICgndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0Jykgb2YgYSBwb3BwZXJcbiAqIEBwYXJhbSB7RWxlbWVudH0gcG9wcGVyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldFBvcHBlclBsYWNlbWVudChwb3BwZXIpIHtcbiAgcmV0dXJuIHBvcHBlci5nZXRBdHRyaWJ1dGUoJ3gtcGxhY2VtZW50JykucmVwbGFjZSgvLS4rLywgJycpO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgaWYgdGhlIG1vdXNlJ3MgY3Vyc29yIGlzIG91dHNpZGUgdGhlIGludGVyYWN0aXZlIGJvcmRlclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudFxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBjdXJzb3JJc091dHNpZGVJbnRlcmFjdGl2ZUJvcmRlcihldmVudCwgcG9wcGVyLCBvcHRpb25zKSB7XG4gIGlmICghcG9wcGVyLmdldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnKSkgcmV0dXJuIHRydWU7XG5cbiAgdmFyIHggPSBldmVudC5jbGllbnRYLFxuICAgICAgeSA9IGV2ZW50LmNsaWVudFk7XG4gIHZhciBpbnRlcmFjdGl2ZUJvcmRlciA9IG9wdGlvbnMuaW50ZXJhY3RpdmVCb3JkZXIsXG4gICAgICBkaXN0YW5jZSA9IG9wdGlvbnMuZGlzdGFuY2U7XG5cblxuICB2YXIgcmVjdCA9IHBvcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdmFyIHBsYWNlbWVudCA9IGdldFBvcHBlclBsYWNlbWVudChwb3BwZXIpO1xuICB2YXIgYm9yZGVyV2l0aERpc3RhbmNlID0gaW50ZXJhY3RpdmVCb3JkZXIgKyBkaXN0YW5jZTtcblxuICB2YXIgZXhjZWVkcyA9IHtcbiAgICB0b3A6IHJlY3QudG9wIC0geSA+IGludGVyYWN0aXZlQm9yZGVyLFxuICAgIGJvdHRvbTogeSAtIHJlY3QuYm90dG9tID4gaW50ZXJhY3RpdmVCb3JkZXIsXG4gICAgbGVmdDogcmVjdC5sZWZ0IC0geCA+IGludGVyYWN0aXZlQm9yZGVyLFxuICAgIHJpZ2h0OiB4IC0gcmVjdC5yaWdodCA+IGludGVyYWN0aXZlQm9yZGVyXG4gIH07XG5cbiAgc3dpdGNoIChwbGFjZW1lbnQpIHtcbiAgICBjYXNlICd0b3AnOlxuICAgICAgZXhjZWVkcy50b3AgPSByZWN0LnRvcCAtIHkgPiBib3JkZXJXaXRoRGlzdGFuY2U7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdib3R0b20nOlxuICAgICAgZXhjZWVkcy5ib3R0b20gPSB5IC0gcmVjdC5ib3R0b20gPiBib3JkZXJXaXRoRGlzdGFuY2U7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdsZWZ0JzpcbiAgICAgIGV4Y2VlZHMubGVmdCA9IHJlY3QubGVmdCAtIHggPiBib3JkZXJXaXRoRGlzdGFuY2U7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdyaWdodCc6XG4gICAgICBleGNlZWRzLnJpZ2h0ID0geCAtIHJlY3QucmlnaHQgPiBib3JkZXJXaXRoRGlzdGFuY2U7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBleGNlZWRzLnRvcCB8fCBleGNlZWRzLmJvdHRvbSB8fCBleGNlZWRzLmxlZnQgfHwgZXhjZWVkcy5yaWdodDtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSBgYXJyb3dUcmFuc2Zvcm1gIG51bWJlcnMgYmFzZWQgb24gdGhlIHBsYWNlbWVudCBheGlzXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAnc2NhbGUnIG9yICd0cmFuc2xhdGUnXG4gKiBAcGFyYW0ge051bWJlcltdfSBudW1iZXJzXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzVmVydGljYWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNSZXZlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHRyYW5zZm9ybU51bWJlcnNCYXNlZE9uUGxhY2VtZW50QXhpcyh0eXBlLCBudW1iZXJzLCBpc1ZlcnRpY2FsLCBpc1JldmVyc2UpIHtcbiAgaWYgKCFudW1iZXJzLmxlbmd0aCkgcmV0dXJuICcnO1xuXG4gIHZhciB0cmFuc2Zvcm1zID0ge1xuICAgIHNjYWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAobnVtYmVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuICcnICsgbnVtYmVyc1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpc1ZlcnRpY2FsID8gbnVtYmVyc1swXSArICcsICcgKyBudW1iZXJzWzFdIDogbnVtYmVyc1sxXSArICcsICcgKyBudW1iZXJzWzBdO1xuICAgICAgfVxuICAgIH0oKSxcbiAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChudW1iZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gaXNSZXZlcnNlID8gLW51bWJlcnNbMF0gKyAncHgnIDogbnVtYmVyc1swXSArICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgICAgIHJldHVybiBpc1JldmVyc2UgPyBudW1iZXJzWzBdICsgJ3B4LCAnICsgLW51bWJlcnNbMV0gKyAncHgnIDogbnVtYmVyc1swXSArICdweCwgJyArIG51bWJlcnNbMV0gKyAncHgnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBpc1JldmVyc2UgPyAtbnVtYmVyc1sxXSArICdweCwgJyArIG51bWJlcnNbMF0gKyAncHgnIDogbnVtYmVyc1sxXSArICdweCwgJyArIG51bWJlcnNbMF0gKyAncHgnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSgpXG4gIH07XG5cbiAgcmV0dXJuIHRyYW5zZm9ybXNbdHlwZV07XG59XG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgYGFycm93VHJhbnNmb3JtYCB4IG9yIHkgYXhpcyBiYXNlZCBvbiB0aGUgcGxhY2VtZW50IGF4aXNcbiAqIEBwYXJhbSB7U3RyaW5nfSBheGlzICdYJywgJ1knLCAnJ1xuICogQHBhcmFtIHtCb29sZWFufSBpc1ZlcnRpY2FsXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHRyYW5zZm9ybUF4aXMoYXhpcywgaXNWZXJ0aWNhbCkge1xuICBpZiAoIWF4aXMpIHJldHVybiAnJztcbiAgdmFyIG1hcCA9IHtcbiAgICBYOiAnWScsXG4gICAgWTogJ1gnXG4gIH07XG4gIHJldHVybiBpc1ZlcnRpY2FsID8gYXhpcyA6IG1hcFtheGlzXTtcbn1cblxuLyoqXG4gKiBDb21wdXRlcyBhbmQgYXBwbGllcyB0aGUgbmVjZXNzYXJ5IGFycm93IHRyYW5zZm9ybVxuICogQHBhcmFtIHtFbGVtZW50fSBwb3BwZXJcbiAqIEBwYXJhbSB7RWxlbWVudH0gYXJyb3dcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcnJvd1RyYW5zZm9ybVxuICovXG5mdW5jdGlvbiBjb21wdXRlQXJyb3dUcmFuc2Zvcm0ocG9wcGVyLCBhcnJvdywgYXJyb3dUcmFuc2Zvcm0pIHtcbiAgdmFyIHBsYWNlbWVudCA9IGdldFBvcHBlclBsYWNlbWVudChwb3BwZXIpO1xuICB2YXIgaXNWZXJ0aWNhbCA9IHBsYWNlbWVudCA9PT0gJ3RvcCcgfHwgcGxhY2VtZW50ID09PSAnYm90dG9tJztcbiAgdmFyIGlzUmV2ZXJzZSA9IHBsYWNlbWVudCA9PT0gJ3JpZ2h0JyB8fCBwbGFjZW1lbnQgPT09ICdib3R0b20nO1xuXG4gIHZhciBnZXRBeGlzID0gZnVuY3Rpb24gZ2V0QXhpcyhyZSkge1xuICAgIHZhciBtYXRjaCA9IGFycm93VHJhbnNmb3JtLm1hdGNoKHJlKTtcbiAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXSA6ICcnO1xuICB9O1xuXG4gIHZhciBnZXROdW1iZXJzID0gZnVuY3Rpb24gZ2V0TnVtYmVycyhyZSkge1xuICAgIHZhciBtYXRjaCA9IGFycm93VHJhbnNmb3JtLm1hdGNoKHJlKTtcbiAgICByZXR1cm4gbWF0Y2ggPyBtYXRjaFsxXS5zcGxpdCgnLCcpLm1hcChwYXJzZUZsb2F0KSA6IFtdO1xuICB9O1xuXG4gIHZhciByZSA9IHtcbiAgICB0cmFuc2xhdGU6IC90cmFuc2xhdGVYP1k/XFwoKFteKV0rKVxcKS8sXG4gICAgc2NhbGU6IC9zY2FsZVg/WT9cXCgoW14pXSspXFwpL1xuICB9O1xuXG4gIHZhciBtYXRjaGVzID0ge1xuICAgIHRyYW5zbGF0ZToge1xuICAgICAgYXhpczogZ2V0QXhpcygvdHJhbnNsYXRlKFtYWV0pLyksXG4gICAgICBudW1iZXJzOiBnZXROdW1iZXJzKHJlLnRyYW5zbGF0ZSlcbiAgICB9LFxuICAgIHNjYWxlOiB7XG4gICAgICBheGlzOiBnZXRBeGlzKC9zY2FsZShbWFldKS8pLFxuICAgICAgbnVtYmVyczogZ2V0TnVtYmVycyhyZS5zY2FsZSlcbiAgICB9XG4gIH07XG5cbiAgdmFyIGNvbXB1dGVkVHJhbnNmb3JtID0gYXJyb3dUcmFuc2Zvcm0ucmVwbGFjZShyZS50cmFuc2xhdGUsICd0cmFuc2xhdGUnICsgdHJhbnNmb3JtQXhpcyhtYXRjaGVzLnRyYW5zbGF0ZS5heGlzLCBpc1ZlcnRpY2FsKSArICcoJyArIHRyYW5zZm9ybU51bWJlcnNCYXNlZE9uUGxhY2VtZW50QXhpcygndHJhbnNsYXRlJywgbWF0Y2hlcy50cmFuc2xhdGUubnVtYmVycywgaXNWZXJ0aWNhbCwgaXNSZXZlcnNlKSArICcpJykucmVwbGFjZShyZS5zY2FsZSwgJ3NjYWxlJyArIHRyYW5zZm9ybUF4aXMobWF0Y2hlcy5zY2FsZS5heGlzLCBpc1ZlcnRpY2FsKSArICcoJyArIHRyYW5zZm9ybU51bWJlcnNCYXNlZE9uUGxhY2VtZW50QXhpcygnc2NhbGUnLCBtYXRjaGVzLnNjYWxlLm51bWJlcnMsIGlzVmVydGljYWwsIGlzUmV2ZXJzZSkgKyAnKScpO1xuXG4gIGFycm93LnN0eWxlW3ByZWZpeCgndHJhbnNmb3JtJyldID0gY29tcHV0ZWRUcmFuc2Zvcm07XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZGlzdGFuY2UgdGFraW5nIGludG8gYWNjb3VudCB0aGUgZGVmYXVsdCBkaXN0YW5jZSBkdWUgdG9cbiAqIHRoZSB0cmFuc2Zvcm06IHRyYW5zbGF0ZSBzZXR0aW5nIGluIENTU1xuICogQHBhcmFtIHtOdW1iZXJ9IGRpc3RhbmNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldE9mZnNldERpc3RhbmNlSW5QeChkaXN0YW5jZSkge1xuICByZXR1cm4gLShkaXN0YW5jZSAtIGRlZmF1bHRzLmRpc3RhbmNlKSArICdweCc7XG59XG5cbi8qKlxuICogV2FpdHMgdW50aWwgbmV4dCByZXBhaW50IHRvIGV4ZWN1dGUgYSBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuZnVuY3Rpb24gZGVmZXIoZm4pIHtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KGZuLCAxKTtcbiAgfSk7XG59XG5cbnZhciBtYXRjaGVzID0ge307XG5cbmlmIChpc0Jyb3dzZXIpIHtcbiAgdmFyIGUgPSBFbGVtZW50LnByb3RvdHlwZTtcbiAgbWF0Y2hlcyA9IGUubWF0Y2hlcyB8fCBlLm1hdGNoZXNTZWxlY3RvciB8fCBlLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBlLm1vek1hdGNoZXNTZWxlY3RvciB8fCBlLm1zTWF0Y2hlc1NlbGVjdG9yIHx8IGZ1bmN0aW9uIChzKSB7XG4gICAgdmFyIG1hdGNoZXMgPSAodGhpcy5kb2N1bWVudCB8fCB0aGlzLm93bmVyRG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwocyk7XG4gICAgdmFyIGkgPSBtYXRjaGVzLmxlbmd0aDtcbiAgICB3aGlsZSAoLS1pID49IDAgJiYgbWF0Y2hlcy5pdGVtKGkpICE9PSB0aGlzKSB7fSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWVtcHR5XG4gICAgcmV0dXJuIGkgPiAtMTtcbiAgfTtcbn1cblxudmFyIG1hdGNoZXMkMSA9IG1hdGNoZXM7XG5cbi8qKlxuICogUG9ueWZpbGwgdG8gZ2V0IHRoZSBjbG9zZXN0IHBhcmVudCBlbGVtZW50XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgLSBjaGlsZCBvZiBwYXJlbnQgdG8gYmUgcmV0dXJuZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXJlbnRTZWxlY3RvciAtIHNlbGVjdG9yIHRvIG1hdGNoIHRoZSBwYXJlbnQgaWYgZm91bmRcbiAqIEByZXR1cm4ge0VsZW1lbnR9XG4gKi9cbmZ1bmN0aW9uIGNsb3Nlc3QoZWxlbWVudCwgcGFyZW50U2VsZWN0b3IpIHtcbiAgdmFyIGZuID0gRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCB8fCBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICB2YXIgZWwgPSB0aGlzO1xuICAgIHdoaWxlIChlbCkge1xuICAgICAgaWYgKG1hdGNoZXMkMS5jYWxsKGVsLCBzZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfVxuICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gZm4uY2FsbChlbGVtZW50LCBwYXJlbnRTZWxlY3Rvcik7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdmFsdWUgdGFraW5nIGludG8gYWNjb3VudCB0aGUgdmFsdWUgYmVpbmcgZWl0aGVyIGEgbnVtYmVyIG9yIGFycmF5XG4gKiBAcGFyYW0ge051bWJlcnxBcnJheX0gdmFsdWVcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZSh2YWx1ZSwgaW5kZXgpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWVbaW5kZXhdIDogdmFsdWU7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgdmlzaWJpbGl0eSBzdGF0ZSBvZiBhbiBlbGVtZW50IGZvciB0cmFuc2l0aW9uIHRvIGJlZ2luXG4gKiBAcGFyYW0ge0VsZW1lbnRbXX0gZWxzIC0gYXJyYXkgb2YgZWxlbWVudHNcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gJ3Zpc2libGUnIG9yICdoaWRkZW4nXG4gKi9cbmZ1bmN0aW9uIHNldFZpc2liaWxpdHlTdGF0ZShlbHMsIHR5cGUpIHtcbiAgZWxzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgaWYgKCFlbCkgcmV0dXJuO1xuICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1zdGF0ZScsIHR5cGUpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSB0cmFuc2l0aW9uIHByb3BlcnR5IHRvIGVhY2ggZWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50W119IGVscyAtIEFycmF5IG9mIGVsZW1lbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAqL1xuZnVuY3Rpb24gYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24oZWxzLCB2YWx1ZSkge1xuICBlbHMuZmlsdGVyKEJvb2xlYW4pLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgZWwuc3R5bGVbcHJlZml4KCd0cmFuc2l0aW9uRHVyYXRpb24nKV0gPSB2YWx1ZSArICdtcyc7XG4gIH0pO1xufVxuXG4vKipcbiAqIEZvY3VzZXMgYW4gZWxlbWVudCB3aGlsZSBwcmV2ZW50aW5nIGEgc2Nyb2xsIGp1bXAgaWYgaXQncyBub3QgZW50aXJlbHkgd2l0aGluIHRoZSB2aWV3cG9ydFxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICovXG5mdW5jdGlvbiBmb2N1cyhlbCkge1xuICB2YXIgeCA9IHdpbmRvdy5zY3JvbGxYIHx8IHdpbmRvdy5wYWdlWE9mZnNldDtcbiAgdmFyIHkgPSB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gIGVsLmZvY3VzKCk7XG4gIHNjcm9sbCh4LCB5KTtcbn1cblxudmFyIGtleSA9IHt9O1xudmFyIHN0b3JlID0gZnVuY3Rpb24gc3RvcmUoZGF0YSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGspIHtcbiAgICByZXR1cm4gayA9PT0ga2V5ICYmIGRhdGE7XG4gIH07XG59O1xuXG52YXIgVGlwcHkgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFRpcHB5KGNvbmZpZykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFRpcHB5KTtcblxuICAgIGZvciAodmFyIF9rZXkgaW4gY29uZmlnKSB7XG4gICAgICB0aGlzW19rZXldID0gY29uZmlnW19rZXldO1xuICAgIH1cblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBkZXN0cm95ZWQ6IGZhbHNlLFxuICAgICAgdmlzaWJsZTogZmFsc2UsXG4gICAgICBlbmFibGVkOiB0cnVlXG4gICAgfTtcblxuICAgIHRoaXMuXyA9IHN0b3JlKHtcbiAgICAgIG11dGF0aW9uT2JzZXJ2ZXJzOiBbXVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgdGhlIHRvb2x0aXAgdG8gYWxsb3cgaXQgdG8gc2hvdyBvciBoaWRlXG4gICAqIEBtZW1iZXJvZiBUaXBweVxuICAgKiBAcHVibGljXG4gICAqL1xuXG5cbiAgY3JlYXRlQ2xhc3MoVGlwcHksIFt7XG4gICAga2V5OiAnZW5hYmxlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW5hYmxlKCkge1xuICAgICAgdGhpcy5zdGF0ZS5lbmFibGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXNhYmxlcyB0aGUgdG9vbHRpcCBmcm9tIHNob3dpbmcgb3IgaGlkaW5nLCBidXQgZG9lcyBub3QgZGVzdHJveSBpdFxuICAgICAqIEBtZW1iZXJvZiBUaXBweVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZGlzYWJsZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gICAgICB0aGlzLnN0YXRlLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93cyB0aGUgdG9vbHRpcFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHNcbiAgICAgKiBAbWVtYmVyb2YgVGlwcHlcbiAgICAgKiBAcHVibGljXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3Nob3cnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzaG93KGR1cmF0aW9uKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICBpZiAodGhpcy5zdGF0ZS5kZXN0cm95ZWQgfHwgIXRoaXMuc3RhdGUuZW5hYmxlZCkgcmV0dXJuO1xuXG4gICAgICB2YXIgcG9wcGVyID0gdGhpcy5wb3BwZXIsXG4gICAgICAgICAgcmVmZXJlbmNlID0gdGhpcy5yZWZlcmVuY2UsXG4gICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgdmFyIF9nZXRJbm5lckVsZW1lbnRzID0gZ2V0SW5uZXJFbGVtZW50cyhwb3BwZXIpLFxuICAgICAgICAgIHRvb2x0aXAgPSBfZ2V0SW5uZXJFbGVtZW50cy50b29sdGlwLFxuICAgICAgICAgIGJhY2tkcm9wID0gX2dldElubmVyRWxlbWVudHMuYmFja2Ryb3AsXG4gICAgICAgICAgY29udGVudCA9IF9nZXRJbm5lckVsZW1lbnRzLmNvbnRlbnQ7XG5cbiAgICAgIC8vIElmIHRoZSBgZHluYW1pY1RpdGxlYCBvcHRpb24gaXMgdHJ1ZSwgdGhlIGluc3RhbmNlIGlzIGFsbG93ZWRcbiAgICAgIC8vIHRvIGJlIGNyZWF0ZWQgd2l0aCBhbiBlbXB0eSB0aXRsZS4gTWFrZSBzdXJlIHRoYXQgdGhlIHRvb2x0aXBcbiAgICAgIC8vIGNvbnRlbnQgaXMgbm90IGVtcHR5IGJlZm9yZSBzaG93aW5nIGl0XG5cblxuICAgICAgaWYgKG9wdGlvbnMuZHluYW1pY1RpdGxlICYmICFyZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCdkYXRhLW9yaWdpbmFsLXRpdGxlJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBEbyBub3Qgc2hvdyB0b29sdGlwIGlmIHJlZmVyZW5jZSBjb250YWlucyAnZGlzYWJsZWQnIGF0dHJpYnV0ZS4gRkYgZml4IGZvciAjMjIxXG4gICAgICBpZiAocmVmZXJlbmNlLmhhc0F0dHJpYnV0ZSgnZGlzYWJsZWQnKSkgcmV0dXJuO1xuXG4gICAgICAvLyBEZXN0cm95IHRvb2x0aXAgaWYgdGhlIHJlZmVyZW5jZSBlbGVtZW50IGlzIG5vIGxvbmdlciBvbiB0aGUgRE9NXG4gICAgICBpZiAoIXJlZmVyZW5jZS5yZWZPYmogJiYgIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jb250YWlucyhyZWZlcmVuY2UpKSB7XG4gICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMub25TaG93LmNhbGwocG9wcGVyLCB0aGlzKTtcblxuICAgICAgZHVyYXRpb24gPSBnZXRWYWx1ZShkdXJhdGlvbiAhPT0gdW5kZWZpbmVkID8gZHVyYXRpb24gOiBvcHRpb25zLmR1cmF0aW9uLCAwKTtcblxuICAgICAgLy8gUHJldmVudCBhIHRyYW5zaXRpb24gd2hlbiBwb3BwZXIgY2hhbmdlcyBwb3NpdGlvblxuICAgICAgYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24oW3BvcHBlciwgdG9vbHRpcCwgYmFja2Ryb3BdLCAwKTtcblxuICAgICAgcG9wcGVyLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgICB0aGlzLnN0YXRlLnZpc2libGUgPSB0cnVlO1xuXG4gICAgICBfbW91bnQuY2FsbCh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghX3RoaXMuc3RhdGUudmlzaWJsZSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICghX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yLmNhbGwoX3RoaXMpKSB7XG4gICAgICAgICAgLy8gRklYOiBBcnJvdyB3aWxsIHNvbWV0aW1lcyBub3QgYmUgcG9zaXRpb25lZCBjb3JyZWN0bHkuIEZvcmNlIGFub3RoZXIgdXBkYXRlLlxuICAgICAgICAgIF90aGlzLnBvcHBlckluc3RhbmNlLnNjaGVkdWxlVXBkYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgaW5pdGlhbCBwb3NpdGlvbiBuZWFyIHRoZSBjdXJzb3JcbiAgICAgICAgaWYgKF9oYXNGb2xsb3dDdXJzb3JCZWhhdmlvci5jYWxsKF90aGlzKSkge1xuICAgICAgICAgIF90aGlzLnBvcHBlckluc3RhbmNlLmRpc2FibGVFdmVudExpc3RlbmVycygpO1xuICAgICAgICAgIHZhciBkZWxheSA9IGdldFZhbHVlKG9wdGlvbnMuZGVsYXksIDApO1xuICAgICAgICAgIHZhciBsYXN0VHJpZ2dlckV2ZW50ID0gX3RoaXMuXyhrZXkpLmxhc3RUcmlnZ2VyRXZlbnQ7XG4gICAgICAgICAgaWYgKGxhc3RUcmlnZ2VyRXZlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLl8oa2V5KS5mb2xsb3dDdXJzb3JMaXN0ZW5lcihkZWxheSAmJiBfdGhpcy5fKGtleSkubGFzdE1vdXNlTW92ZUV2ZW50ID8gX3RoaXMuXyhrZXkpLmxhc3RNb3VzZU1vdmVFdmVudCA6IGxhc3RUcmlnZ2VyRXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlLWFwcGx5IHRyYW5zaXRpb24gZHVyYXRpb25zXG4gICAgICAgIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uKFt0b29sdGlwLCBiYWNrZHJvcCwgYmFja2Ryb3AgPyBjb250ZW50IDogbnVsbF0sIGR1cmF0aW9uKTtcblxuICAgICAgICBpZiAoYmFja2Ryb3ApIHtcbiAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGJhY2tkcm9wKVtwcmVmaXgoJ3RyYW5zZm9ybScpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLmludGVyYWN0aXZlKSB7XG4gICAgICAgICAgcmVmZXJlbmNlLmNsYXNzTGlzdC5hZGQoJ3RpcHB5LWFjdGl2ZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuc3RpY2t5KSB7XG4gICAgICAgICAgX21ha2VTdGlja3kuY2FsbChfdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRWaXNpYmlsaXR5U3RhdGUoW3Rvb2x0aXAsIGJhY2tkcm9wXSwgJ3Zpc2libGUnKTtcblxuICAgICAgICBfb25UcmFuc2l0aW9uRW5kLmNhbGwoX3RoaXMsIGR1cmF0aW9uLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFvcHRpb25zLnVwZGF0ZUR1cmF0aW9uKSB7XG4gICAgICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQoJ3RpcHB5LW5vdHJhbnNpdGlvbicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChvcHRpb25zLmludGVyYWN0aXZlKSB7XG4gICAgICAgICAgICBmb2N1cyhwb3BwZXIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlZmVyZW5jZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCAndGlwcHktJyArIF90aGlzLmlkKTtcblxuICAgICAgICAgIG9wdGlvbnMub25TaG93bi5jYWxsKHBvcHBlciwgX3RoaXMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhpZGVzIHRoZSB0b29sdGlwXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kc1xuICAgICAqIEBtZW1iZXJvZiBUaXBweVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnaGlkZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhpZGUoZHVyYXRpb24pIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICBpZiAodGhpcy5zdGF0ZS5kZXN0cm95ZWQgfHwgIXRoaXMuc3RhdGUuZW5hYmxlZCkgcmV0dXJuO1xuXG4gICAgICB2YXIgcG9wcGVyID0gdGhpcy5wb3BwZXIsXG4gICAgICAgICAgcmVmZXJlbmNlID0gdGhpcy5yZWZlcmVuY2UsXG4gICAgICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgdmFyIF9nZXRJbm5lckVsZW1lbnRzMiA9IGdldElubmVyRWxlbWVudHMocG9wcGVyKSxcbiAgICAgICAgICB0b29sdGlwID0gX2dldElubmVyRWxlbWVudHMyLnRvb2x0aXAsXG4gICAgICAgICAgYmFja2Ryb3AgPSBfZ2V0SW5uZXJFbGVtZW50czIuYmFja2Ryb3AsXG4gICAgICAgICAgY29udGVudCA9IF9nZXRJbm5lckVsZW1lbnRzMi5jb250ZW50O1xuXG4gICAgICBvcHRpb25zLm9uSGlkZS5jYWxsKHBvcHBlciwgdGhpcyk7XG5cbiAgICAgIGR1cmF0aW9uID0gZ2V0VmFsdWUoZHVyYXRpb24gIT09IHVuZGVmaW5lZCA/IGR1cmF0aW9uIDogb3B0aW9ucy5kdXJhdGlvbiwgMSk7XG5cbiAgICAgIGlmICghb3B0aW9ucy51cGRhdGVEdXJhdGlvbikge1xuICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoJ3RpcHB5LW5vdHJhbnNpdGlvbicpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5pbnRlcmFjdGl2ZSkge1xuICAgICAgICByZWZlcmVuY2UuY2xhc3NMaXN0LnJlbW92ZSgndGlwcHktYWN0aXZlJyk7XG4gICAgICB9XG5cbiAgICAgIHBvcHBlci5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICB0aGlzLnN0YXRlLnZpc2libGUgPSBmYWxzZTtcblxuICAgICAgYXBwbHlUcmFuc2l0aW9uRHVyYXRpb24oW3Rvb2x0aXAsIGJhY2tkcm9wLCBiYWNrZHJvcCA/IGNvbnRlbnQgOiBudWxsXSwgZHVyYXRpb24pO1xuXG4gICAgICBzZXRWaXNpYmlsaXR5U3RhdGUoW3Rvb2x0aXAsIGJhY2tkcm9wXSwgJ2hpZGRlbicpO1xuXG4gICAgICBpZiAob3B0aW9ucy5pbnRlcmFjdGl2ZSAmJiBvcHRpb25zLnRyaWdnZXIuaW5kZXhPZignY2xpY2snKSA+IC0xKSB7XG4gICAgICAgIGZvY3VzKHJlZmVyZW5jZSk7XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICAqIFRoaXMgY2FsbCBpcyBkZWZlcnJlZCBiZWNhdXNlIHNvbWV0aW1lcyB3aGVuIHRoZSB0b29sdGlwIGlzIHN0aWxsIHRyYW5zaXRpb25pbmcgaW4gYnV0IGhpZGUoKVxuICAgICAgKiBpcyBjYWxsZWQgYmVmb3JlIGl0IGZpbmlzaGVzLCB0aGUgQ1NTIHRyYW5zaXRpb24gd29uJ3QgcmV2ZXJzZSBxdWlja2x5IGVub3VnaCwgbWVhbmluZ1xuICAgICAgKiB0aGUgQ1NTIHRyYW5zaXRpb24gd2lsbCBmaW5pc2ggMS0yIGZyYW1lcyBsYXRlciwgYW5kIG9uSGlkZGVuKCkgd2lsbCBydW4gc2luY2UgdGhlIEpTIHNldCBpdFxuICAgICAgKiBtb3JlIHF1aWNrbHkuIEl0IHNob3VsZCBhY3R1YWxseSBiZSBvblNob3duKCkuIFNlZW1zIHRvIGJlIHNvbWV0aGluZyBDaHJvbWUgZG9lcywgbm90IFNhZmFyaVxuICAgICAgKi9cbiAgICAgIGRlZmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX29uVHJhbnNpdGlvbkVuZC5jYWxsKF90aGlzMiwgZHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoX3RoaXMyLnN0YXRlLnZpc2libGUgfHwgIW9wdGlvbnMuYXBwZW5kVG8uY29udGFpbnMocG9wcGVyKSkgcmV0dXJuO1xuXG4gICAgICAgICAgaWYgKCFfdGhpczIuXyhrZXkpLmlzUHJlcGFyaW5nVG9TaG93KSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfdGhpczIuXyhrZXkpLmZvbGxvd0N1cnNvckxpc3RlbmVyKTtcbiAgICAgICAgICAgIF90aGlzMi5fKGtleSkubGFzdE1vdXNlTW92ZUV2ZW50ID0gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoX3RoaXMyLnBvcHBlckluc3RhbmNlKSB7XG4gICAgICAgICAgICBfdGhpczIucG9wcGVySW5zdGFuY2UuZGlzYWJsZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVmZXJlbmNlLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuXG4gICAgICAgICAgb3B0aW9ucy5hcHBlbmRUby5yZW1vdmVDaGlsZChwb3BwZXIpO1xuXG4gICAgICAgICAgb3B0aW9ucy5vbkhpZGRlbi5jYWxsKHBvcHBlciwgX3RoaXMyKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95cyB0aGUgdG9vbHRpcCBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVzdHJveVRhcmdldEluc3RhbmNlcyAtIHJlbGV2YW50IG9ubHkgd2hlbiBkZXN0cm95aW5nIGRlbGVnYXRlc1xuICAgICAqIEBtZW1iZXJvZiBUaXBweVxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZGVzdHJveScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIGRlc3Ryb3lUYXJnZXRJbnN0YW5jZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHRydWU7XG5cbiAgICAgIGlmICh0aGlzLnN0YXRlLmRlc3Ryb3llZCkgcmV0dXJuO1xuXG4gICAgICAvLyBFbnN1cmUgdGhlIHBvcHBlciBpcyBoaWRkZW5cbiAgICAgIGlmICh0aGlzLnN0YXRlLnZpc2libGUpIHtcbiAgICAgICAgdGhpcy5oaWRlKDApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICBfdGhpczMucmVmZXJlbmNlLnJlbW92ZUV2ZW50TGlzdGVuZXIobGlzdGVuZXIuZXZlbnQsIGxpc3RlbmVyLmhhbmRsZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFJlc3RvcmUgdGl0bGVcbiAgICAgIGlmICh0aGlzLnRpdGxlKSB7XG4gICAgICAgIHRoaXMucmVmZXJlbmNlLnNldEF0dHJpYnV0ZSgndGl0bGUnLCB0aGlzLnRpdGxlKTtcbiAgICAgIH1cblxuICAgICAgZGVsZXRlIHRoaXMucmVmZXJlbmNlLl90aXBweTtcblxuICAgICAgdmFyIGF0dHJpYnV0ZXMgPSBbJ2RhdGEtb3JpZ2luYWwtdGl0bGUnLCAnZGF0YS10aXBweScsICdkYXRhLXRpcHB5LWRlbGVnYXRlJ107XG4gICAgICBhdHRyaWJ1dGVzLmZvckVhY2goZnVuY3Rpb24gKGF0dHIpIHtcbiAgICAgICAgX3RoaXMzLnJlZmVyZW5jZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy50YXJnZXQgJiYgZGVzdHJveVRhcmdldEluc3RhbmNlcykge1xuICAgICAgICB0b0FycmF5KHRoaXMucmVmZXJlbmNlLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5vcHRpb25zLnRhcmdldCkpLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkLl90aXBweSAmJiBjaGlsZC5fdGlwcHkuZGVzdHJveSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucG9wcGVySW5zdGFuY2UpIHtcbiAgICAgICAgdGhpcy5wb3BwZXJJbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuXyhrZXkpLm11dGF0aW9uT2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24gKG9ic2VydmVyKSB7XG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnN0YXRlLmRlc3Ryb3llZCA9IHRydWU7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBUaXBweTtcbn0oKTtcblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFByaXZhdGUgbWV0aG9kc1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBTdGFuZGFsb25lIGZ1bmN0aW9ucyB0byBiZSBjYWxsZWQgd2l0aCB0aGUgaW5zdGFuY2UncyBgdGhpc2AgY29udGV4dCB0byBtYWtlXG4gKiB0aGVtIHRydWx5IHByaXZhdGUgYW5kIG5vdCBhY2Nlc3NpYmxlIG9uIHRoZSBwcm90b3R5cGVcbiAqL1xuXG4vKipcbiAqIERldGVybWluZXMgaWYgdGhlIHRvb2x0aXAgaW5zdGFuY2UgaGFzIGZvbGxvd0N1cnNvciBiZWhhdmlvclxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBtZW1iZXJvZiBUaXBweVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yKCkge1xuICB2YXIgbGFzdFRyaWdnZXJFdmVudCA9IHRoaXMuXyhrZXkpLmxhc3RUcmlnZ2VyRXZlbnQ7XG4gIHJldHVybiB0aGlzLm9wdGlvbnMuZm9sbG93Q3Vyc29yICYmICFicm93c2VyLnVzaW5nVG91Y2ggJiYgbGFzdFRyaWdnZXJFdmVudCAmJiBsYXN0VHJpZ2dlckV2ZW50LnR5cGUgIT09ICdmb2N1cyc7XG59XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgVGlwcHkgaW5zdGFuY2UgZm9yIHRoZSBjaGlsZCB0YXJnZXQgb2YgdGhlIGRlbGVnYXRlIGNvbnRhaW5lclxuICogQHBhcmFtIHtFdmVudH0gZXZlbnRcbiAqIEBtZW1iZXJvZiBUaXBweVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX2NyZWF0ZURlbGVnYXRlQ2hpbGRUaXBweShldmVudCkge1xuICB2YXIgdGFyZ2V0RWwgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgdGhpcy5vcHRpb25zLnRhcmdldCk7XG4gIGlmICh0YXJnZXRFbCAmJiAhdGFyZ2V0RWwuX3RpcHB5KSB7XG4gICAgdmFyIHRpdGxlID0gdGFyZ2V0RWwuZ2V0QXR0cmlidXRlKCd0aXRsZScpIHx8IHRoaXMudGl0bGU7XG4gICAgaWYgKHRpdGxlKSB7XG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgdGl0bGUpO1xuICAgICAgdGlwcHkkMSh0YXJnZXRFbCwgX2V4dGVuZHMoe30sIHRoaXMub3B0aW9ucywgeyB0YXJnZXQ6IG51bGwgfSkpO1xuICAgICAgX2VudGVyLmNhbGwodGFyZ2V0RWwuX3RpcHB5LCBldmVudCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTWV0aG9kIHVzZWQgYnkgZXZlbnQgbGlzdGVuZXJzIHRvIGludm9rZSB0aGUgc2hvdyBtZXRob2QsIHRha2luZyBpbnRvIGFjY291bnQgZGVsYXlzIGFuZFxuICogdGhlIGB3YWl0YCBvcHRpb25cbiAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG4gKiBAbWVtYmVyb2YgVGlwcHlcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9lbnRlcihldmVudCkge1xuICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuXG4gIF9jbGVhckRlbGF5VGltZW91dHMuY2FsbCh0aGlzKTtcblxuICBpZiAodGhpcy5zdGF0ZS52aXNpYmxlKSByZXR1cm47XG5cbiAgLy8gSXMgYSBkZWxlZ2F0ZSwgY3JlYXRlIFRpcHB5IGluc3RhbmNlIGZvciB0aGUgY2hpbGQgdGFyZ2V0XG4gIGlmIChvcHRpb25zLnRhcmdldCkge1xuICAgIF9jcmVhdGVEZWxlZ2F0ZUNoaWxkVGlwcHkuY2FsbCh0aGlzLCBldmVudCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5fKGtleSkuaXNQcmVwYXJpbmdUb1Nob3cgPSB0cnVlO1xuXG4gIGlmIChvcHRpb25zLndhaXQpIHtcbiAgICBvcHRpb25zLndhaXQuY2FsbCh0aGlzLnBvcHBlciwgdGhpcy5zaG93LmJpbmQodGhpcyksIGV2ZW50KTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBJZiB0aGUgdG9vbHRpcCBoYXMgYSBkZWxheSwgd2UgbmVlZCB0byBiZSBsaXN0ZW5pbmcgdG8gdGhlIG1vdXNlbW92ZSBhcyBzb29uIGFzIHRoZSB0cmlnZ2VyXG4gIC8vIGV2ZW50IGlzIGZpcmVkIHNvIHRoYXQgaXQncyBpbiB0aGUgY29ycmVjdCBwb3NpdGlvbiB1cG9uIG1vdW50LlxuICBpZiAoX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yLmNhbGwodGhpcykpIHtcbiAgICBpZiAoIXRoaXMuXyhrZXkpLmZvbGxvd0N1cnNvckxpc3RlbmVyKSB7XG4gICAgICBfc2V0Rm9sbG93Q3Vyc29yTGlzdGVuZXIuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICB2YXIgX2dldElubmVyRWxlbWVudHMzID0gZ2V0SW5uZXJFbGVtZW50cyh0aGlzLnBvcHBlciksXG4gICAgICAgIGFycm93ID0gX2dldElubmVyRWxlbWVudHMzLmFycm93O1xuXG4gICAgaWYgKGFycm93KSBhcnJvdy5zdHlsZS5tYXJnaW4gPSAnMCc7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fKGtleSkuZm9sbG93Q3Vyc29yTGlzdGVuZXIpO1xuICB9XG5cbiAgdmFyIGRlbGF5ID0gZ2V0VmFsdWUob3B0aW9ucy5kZWxheSwgMCk7XG5cbiAgaWYgKGRlbGF5KSB7XG4gICAgdGhpcy5fKGtleSkuc2hvd1RpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzNC5zaG93KCk7XG4gICAgfSwgZGVsYXkpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuc2hvdygpO1xuICB9XG59XG5cbi8qKlxuICogTWV0aG9kIHVzZWQgYnkgZXZlbnQgbGlzdGVuZXJzIHRvIGludm9rZSB0aGUgaGlkZSBtZXRob2QsIHRha2luZyBpbnRvIGFjY291bnQgZGVsYXlzXG4gKiBAbWVtYmVyb2YgVGlwcHlcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9sZWF2ZSgpIHtcbiAgdmFyIF90aGlzNSA9IHRoaXM7XG5cbiAgX2NsZWFyRGVsYXlUaW1lb3V0cy5jYWxsKHRoaXMpO1xuXG4gIGlmICghdGhpcy5zdGF0ZS52aXNpYmxlKSByZXR1cm47XG5cbiAgdGhpcy5fKGtleSkuaXNQcmVwYXJpbmdUb1Nob3cgPSBmYWxzZTtcblxuICB2YXIgZGVsYXkgPSBnZXRWYWx1ZSh0aGlzLm9wdGlvbnMuZGVsYXksIDEpO1xuXG4gIGlmIChkZWxheSkge1xuICAgIHRoaXMuXyhrZXkpLmhpZGVUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoX3RoaXM1LnN0YXRlLnZpc2libGUpIHtcbiAgICAgICAgX3RoaXM1LmhpZGUoKTtcbiAgICAgIH1cbiAgICB9LCBkZWxheSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHJlbGV2YW50IGxpc3RlbmVycyBmb3IgdGhlIGluc3RhbmNlXG4gKiBAcmV0dXJuIHtPYmplY3R9IG9mIGxpc3RlbmVyc1xuICogQG1lbWJlcm9mIFRpcHB5XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfZ2V0RXZlbnRMaXN0ZW5lcnMoKSB7XG4gIHZhciBfdGhpczYgPSB0aGlzO1xuXG4gIHZhciBvblRyaWdnZXIgPSBmdW5jdGlvbiBvblRyaWdnZXIoZXZlbnQpIHtcbiAgICBpZiAoIV90aGlzNi5zdGF0ZS5lbmFibGVkKSByZXR1cm47XG5cbiAgICB2YXIgc2hvdWxkU3RvcEV2ZW50ID0gYnJvd3Nlci5zdXBwb3J0c1RvdWNoICYmIGJyb3dzZXIudXNpbmdUb3VjaCAmJiBbJ21vdXNlZW50ZXInLCAnbW91c2VvdmVyJywgJ2ZvY3VzJ10uaW5kZXhPZihldmVudC50eXBlKSA+IC0xO1xuXG4gICAgaWYgKHNob3VsZFN0b3BFdmVudCAmJiBfdGhpczYub3B0aW9ucy50b3VjaEhvbGQpIHJldHVybjtcblxuICAgIF90aGlzNi5fKGtleSkubGFzdFRyaWdnZXJFdmVudCA9IGV2ZW50O1xuXG4gICAgLy8gVG9nZ2xlIHNob3cvaGlkZSB3aGVuIGNsaWNraW5nIGNsaWNrLXRyaWdnZXJlZCB0b29sdGlwc1xuICAgIGlmIChldmVudC50eXBlID09PSAnY2xpY2snICYmIF90aGlzNi5vcHRpb25zLmhpZGVPbkNsaWNrICE9PSAncGVyc2lzdGVudCcgJiYgX3RoaXM2LnN0YXRlLnZpc2libGUpIHtcbiAgICAgIF9sZWF2ZS5jYWxsKF90aGlzNik7XG4gICAgfSBlbHNlIHtcbiAgICAgIF9lbnRlci5jYWxsKF90aGlzNiwgZXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgb25Nb3VzZUxlYXZlID0gZnVuY3Rpb24gb25Nb3VzZUxlYXZlKGV2ZW50KSB7XG4gICAgaWYgKFsnbW91c2VsZWF2ZScsICdtb3VzZW91dCddLmluZGV4T2YoZXZlbnQudHlwZSkgPiAtMSAmJiBicm93c2VyLnN1cHBvcnRzVG91Y2ggJiYgYnJvd3Nlci51c2luZ1RvdWNoICYmIF90aGlzNi5vcHRpb25zLnRvdWNoSG9sZCkgcmV0dXJuO1xuXG4gICAgaWYgKF90aGlzNi5vcHRpb25zLmludGVyYWN0aXZlKSB7XG4gICAgICB2YXIgaGlkZSA9IF9sZWF2ZS5iaW5kKF90aGlzNik7XG5cbiAgICAgIHZhciBvbk1vdXNlTW92ZSA9IGZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgICAgIHZhciByZWZlcmVuY2VDdXJzb3JJc092ZXIgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgc2VsZWN0b3JzLlJFRkVSRU5DRSk7XG4gICAgICAgIHZhciBjdXJzb3JJc092ZXJQb3BwZXIgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgc2VsZWN0b3JzLlBPUFBFUikgPT09IF90aGlzNi5wb3BwZXI7XG4gICAgICAgIHZhciBjdXJzb3JJc092ZXJSZWZlcmVuY2UgPSByZWZlcmVuY2VDdXJzb3JJc092ZXIgPT09IF90aGlzNi5yZWZlcmVuY2U7XG5cbiAgICAgICAgaWYgKGN1cnNvcklzT3ZlclBvcHBlciB8fCBjdXJzb3JJc092ZXJSZWZlcmVuY2UpIHJldHVybjtcblxuICAgICAgICBpZiAoY3Vyc29ySXNPdXRzaWRlSW50ZXJhY3RpdmVCb3JkZXIoZXZlbnQsIF90aGlzNi5wb3BwZXIsIF90aGlzNi5vcHRpb25zKSkge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGhpZGUpO1xuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcblxuICAgICAgICAgIF9sZWF2ZS5jYWxsKF90aGlzNiwgb25Nb3VzZU1vdmUpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoaWRlKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBfbGVhdmUuY2FsbChfdGhpczYpO1xuICB9O1xuXG4gIHZhciBvbkJsdXIgPSBmdW5jdGlvbiBvbkJsdXIoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0ICE9PSBfdGhpczYucmVmZXJlbmNlIHx8IGJyb3dzZXIudXNpbmdUb3VjaCkgcmV0dXJuO1xuXG4gICAgaWYgKF90aGlzNi5vcHRpb25zLmludGVyYWN0aXZlKSB7XG4gICAgICBpZiAoIWV2ZW50LnJlbGF0ZWRUYXJnZXQpIHJldHVybjtcbiAgICAgIGlmIChjbG9zZXN0KGV2ZW50LnJlbGF0ZWRUYXJnZXQsIHNlbGVjdG9ycy5QT1BQRVIpKSByZXR1cm47XG4gICAgfVxuXG4gICAgX2xlYXZlLmNhbGwoX3RoaXM2KTtcbiAgfTtcblxuICB2YXIgb25EZWxlZ2F0ZVNob3cgPSBmdW5jdGlvbiBvbkRlbGVnYXRlU2hvdyhldmVudCkge1xuICAgIGlmIChjbG9zZXN0KGV2ZW50LnRhcmdldCwgX3RoaXM2Lm9wdGlvbnMudGFyZ2V0KSkge1xuICAgICAgX2VudGVyLmNhbGwoX3RoaXM2LCBldmVudCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvbkRlbGVnYXRlSGlkZSA9IGZ1bmN0aW9uIG9uRGVsZWdhdGVIaWRlKGV2ZW50KSB7XG4gICAgaWYgKGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBfdGhpczYub3B0aW9ucy50YXJnZXQpKSB7XG4gICAgICBfbGVhdmUuY2FsbChfdGhpczYpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG9uVHJpZ2dlcjogb25UcmlnZ2VyLFxuICAgIG9uTW91c2VMZWF2ZTogb25Nb3VzZUxlYXZlLFxuICAgIG9uQmx1cjogb25CbHVyLFxuICAgIG9uRGVsZWdhdGVTaG93OiBvbkRlbGVnYXRlU2hvdyxcbiAgICBvbkRlbGVnYXRlSGlkZTogb25EZWxlZ2F0ZUhpZGVcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgbmV3IHBvcHBlciBpbnN0YW5jZVxuICogQHJldHVybiB7UG9wcGVyfVxuICogQG1lbWJlcm9mIFRpcHB5XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfY3JlYXRlUG9wcGVySW5zdGFuY2UoKSB7XG4gIHZhciBfdGhpczcgPSB0aGlzO1xuXG4gIHZhciBwb3BwZXIgPSB0aGlzLnBvcHBlcixcbiAgICAgIHJlZmVyZW5jZSA9IHRoaXMucmVmZXJlbmNlLFxuICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICB2YXIgX2dldElubmVyRWxlbWVudHM0ID0gZ2V0SW5uZXJFbGVtZW50cyhwb3BwZXIpLFxuICAgICAgdG9vbHRpcCA9IF9nZXRJbm5lckVsZW1lbnRzNC50b29sdGlwO1xuXG4gIHZhciBwb3BwZXJPcHRpb25zID0gb3B0aW9ucy5wb3BwZXJPcHRpb25zO1xuXG4gIHZhciBhcnJvd1NlbGVjdG9yID0gb3B0aW9ucy5hcnJvd1R5cGUgPT09ICdyb3VuZCcgPyBzZWxlY3RvcnMuUk9VTkRfQVJST1cgOiBzZWxlY3RvcnMuQVJST1c7XG4gIHZhciBhcnJvdyA9IHRvb2x0aXAucXVlcnlTZWxlY3RvcihhcnJvd1NlbGVjdG9yKTtcblxuICB2YXIgY29uZmlnID0gX2V4dGVuZHMoe1xuICAgIHBsYWNlbWVudDogb3B0aW9ucy5wbGFjZW1lbnRcbiAgfSwgcG9wcGVyT3B0aW9ucyB8fCB7fSwge1xuICAgIG1vZGlmaWVyczogX2V4dGVuZHMoe30sIHBvcHBlck9wdGlvbnMgPyBwb3BwZXJPcHRpb25zLm1vZGlmaWVycyA6IHt9LCB7XG4gICAgICBhcnJvdzogX2V4dGVuZHMoe1xuICAgICAgICBlbGVtZW50OiBhcnJvd1NlbGVjdG9yXG4gICAgICB9LCBwb3BwZXJPcHRpb25zICYmIHBvcHBlck9wdGlvbnMubW9kaWZpZXJzID8gcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMuYXJyb3cgOiB7fSksXG4gICAgICBmbGlwOiBfZXh0ZW5kcyh7XG4gICAgICAgIGVuYWJsZWQ6IG9wdGlvbnMuZmxpcCxcbiAgICAgICAgcGFkZGluZzogb3B0aW9ucy5kaXN0YW5jZSArIDUgLyogNXB4IGZyb20gdmlld3BvcnQgYm91bmRhcnkgKi9cbiAgICAgICAgLCBiZWhhdmlvcjogb3B0aW9ucy5mbGlwQmVoYXZpb3JcbiAgICAgIH0sIHBvcHBlck9wdGlvbnMgJiYgcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMgPyBwb3BwZXJPcHRpb25zLm1vZGlmaWVycy5mbGlwIDoge30pLFxuICAgICAgb2Zmc2V0OiBfZXh0ZW5kcyh7XG4gICAgICAgIG9mZnNldDogb3B0aW9ucy5vZmZzZXRcbiAgICAgIH0sIHBvcHBlck9wdGlvbnMgJiYgcG9wcGVyT3B0aW9ucy5tb2RpZmllcnMgPyBwb3BwZXJPcHRpb25zLm1vZGlmaWVycy5vZmZzZXQgOiB7fSlcbiAgICB9KSxcbiAgICBvbkNyZWF0ZTogZnVuY3Rpb24gb25DcmVhdGUoKSB7XG4gICAgICB0b29sdGlwLnN0eWxlW2dldFBvcHBlclBsYWNlbWVudChwb3BwZXIpXSA9IGdldE9mZnNldERpc3RhbmNlSW5QeChvcHRpb25zLmRpc3RhbmNlKTtcblxuICAgICAgaWYgKGFycm93ICYmIG9wdGlvbnMuYXJyb3dUcmFuc2Zvcm0pIHtcbiAgICAgICAgY29tcHV0ZUFycm93VHJhbnNmb3JtKHBvcHBlciwgYXJyb3csIG9wdGlvbnMuYXJyb3dUcmFuc2Zvcm0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgb25VcGRhdGU6IGZ1bmN0aW9uIG9uVXBkYXRlKCkge1xuICAgICAgdmFyIHN0eWxlcyA9IHRvb2x0aXAuc3R5bGU7XG4gICAgICBzdHlsZXMudG9wID0gJyc7XG4gICAgICBzdHlsZXMuYm90dG9tID0gJyc7XG4gICAgICBzdHlsZXMubGVmdCA9ICcnO1xuICAgICAgc3R5bGVzLnJpZ2h0ID0gJyc7XG4gICAgICBzdHlsZXNbZ2V0UG9wcGVyUGxhY2VtZW50KHBvcHBlcildID0gZ2V0T2Zmc2V0RGlzdGFuY2VJblB4KG9wdGlvbnMuZGlzdGFuY2UpO1xuXG4gICAgICBpZiAoYXJyb3cgJiYgb3B0aW9ucy5hcnJvd1RyYW5zZm9ybSkge1xuICAgICAgICBjb21wdXRlQXJyb3dUcmFuc2Zvcm0ocG9wcGVyLCBhcnJvdywgb3B0aW9ucy5hcnJvd1RyYW5zZm9ybSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBfYWRkTXV0YXRpb25PYnNlcnZlci5jYWxsKHRoaXMsIHtcbiAgICB0YXJnZXQ6IHBvcHBlcixcbiAgICBjYWxsYmFjazogZnVuY3Rpb24gY2FsbGJhY2soKSB7XG4gICAgICBfdGhpczcucG9wcGVySW5zdGFuY2UudXBkYXRlKCk7XG4gICAgfSxcbiAgICBvcHRpb25zOiB7XG4gICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgY2hhcmFjdGVyRGF0YTogdHJ1ZVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG5ldyBQb3BwZXIocmVmZXJlbmNlLCBwb3BwZXIsIGNvbmZpZyk7XG59XG5cbi8qKlxuICogQXBwZW5kcyB0aGUgcG9wcGVyIGVsZW1lbnQgdG8gdGhlIERPTSwgdXBkYXRpbmcgb3IgY3JlYXRpbmcgdGhlIHBvcHBlciBpbnN0YW5jZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBUaXBweVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX21vdW50KGNhbGxiYWNrKSB7XG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG5cbiAgaWYgKCF0aGlzLnBvcHBlckluc3RhbmNlKSB7XG4gICAgdGhpcy5wb3BwZXJJbnN0YW5jZSA9IF9jcmVhdGVQb3BwZXJJbnN0YW5jZS5jYWxsKHRoaXMpO1xuICAgIGlmICghb3B0aW9ucy5saXZlUGxhY2VtZW50KSB7XG4gICAgICB0aGlzLnBvcHBlckluc3RhbmNlLmRpc2FibGVFdmVudExpc3RlbmVycygpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLnBvcHBlckluc3RhbmNlLnNjaGVkdWxlVXBkYXRlKCk7XG4gICAgaWYgKG9wdGlvbnMubGl2ZVBsYWNlbWVudCAmJiAhX2hhc0ZvbGxvd0N1cnNvckJlaGF2aW9yLmNhbGwodGhpcykpIHtcbiAgICAgIHRoaXMucG9wcGVySW5zdGFuY2UuZW5hYmxlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBJZiB0aGUgaW5zdGFuY2UgcHJldmlvdXNseSBoYWQgZm9sbG93Q3Vyc29yIGJlaGF2aW9yLCBpdCB3aWxsIGJlIHBvc2l0aW9uZWQgaW5jb3JyZWN0bHlcbiAgLy8gaWYgdHJpZ2dlcmVkIGJ5IGBmb2N1c2AgYWZ0ZXJ3YXJkcyAtIHVwZGF0ZSB0aGUgcmVmZXJlbmNlIGJhY2sgdG8gdGhlIHJlYWwgRE9NIGVsZW1lbnRcbiAgaWYgKCFfaGFzRm9sbG93Q3Vyc29yQmVoYXZpb3IuY2FsbCh0aGlzKSkge1xuICAgIHZhciBfZ2V0SW5uZXJFbGVtZW50czUgPSBnZXRJbm5lckVsZW1lbnRzKHRoaXMucG9wcGVyKSxcbiAgICAgICAgYXJyb3cgPSBfZ2V0SW5uZXJFbGVtZW50czUuYXJyb3c7XG5cbiAgICBpZiAoYXJyb3cpIGFycm93LnN0eWxlLm1hcmdpbiA9ICcnO1xuICAgIHRoaXMucG9wcGVySW5zdGFuY2UucmVmZXJlbmNlID0gdGhpcy5yZWZlcmVuY2U7XG4gIH1cblxuICB1cGRhdGVQb3BwZXJQb3NpdGlvbih0aGlzLnBvcHBlckluc3RhbmNlLCBjYWxsYmFjaywgdHJ1ZSk7XG5cbiAgaWYgKCFvcHRpb25zLmFwcGVuZFRvLmNvbnRhaW5zKHRoaXMucG9wcGVyKSkge1xuICAgIG9wdGlvbnMuYXBwZW5kVG8uYXBwZW5kQ2hpbGQodGhpcy5wb3BwZXIpO1xuICB9XG59XG5cbi8qKlxuICogQ2xlYXJzIHRoZSBzaG93IGFuZCBoaWRlIGRlbGF5IHRpbWVvdXRzXG4gKiBAbWVtYmVyb2YgVGlwcHlcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9jbGVhckRlbGF5VGltZW91dHMoKSB7XG4gIHZhciBfcmVmID0gdGhpcy5fKGtleSksXG4gICAgICBzaG93VGltZW91dCA9IF9yZWYuc2hvd1RpbWVvdXQsXG4gICAgICBoaWRlVGltZW91dCA9IF9yZWYuaGlkZVRpbWVvdXQ7XG5cbiAgY2xlYXJUaW1lb3V0KHNob3dUaW1lb3V0KTtcbiAgY2xlYXJUaW1lb3V0KGhpZGVUaW1lb3V0KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBtb3VzZW1vdmUgZXZlbnQgbGlzdGVuZXIgZnVuY3Rpb24gZm9yIGBmb2xsb3dDdXJzb3JgIG9wdGlvblxuICogQG1lbWJlcm9mIFRpcHB5XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfc2V0Rm9sbG93Q3Vyc29yTGlzdGVuZXIoKSB7XG4gIHZhciBfdGhpczggPSB0aGlzO1xuXG4gIHRoaXMuXyhrZXkpLmZvbGxvd0N1cnNvckxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIF8kbGFzdE1vdXNlTW92ZUV2ZW50ID0gX3RoaXM4Ll8oa2V5KS5sYXN0TW91c2VNb3ZlRXZlbnQgPSBldmVudCxcbiAgICAgICAgY2xpZW50WCA9IF8kbGFzdE1vdXNlTW92ZUV2ZW50LmNsaWVudFgsXG4gICAgICAgIGNsaWVudFkgPSBfJGxhc3RNb3VzZU1vdmVFdmVudC5jbGllbnRZO1xuXG4gICAgaWYgKCFfdGhpczgucG9wcGVySW5zdGFuY2UpIHJldHVybjtcblxuICAgIF90aGlzOC5wb3BwZXJJbnN0YW5jZS5yZWZlcmVuY2UgPSB7XG4gICAgICBnZXRCb3VuZGluZ0NsaWVudFJlY3Q6IGZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgdG9wOiBjbGllbnRZLFxuICAgICAgICAgIGxlZnQ6IGNsaWVudFgsXG4gICAgICAgICAgcmlnaHQ6IGNsaWVudFgsXG4gICAgICAgICAgYm90dG9tOiBjbGllbnRZXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgY2xpZW50V2lkdGg6IDAsXG4gICAgICBjbGllbnRIZWlnaHQ6IDBcbiAgICB9O1xuXG4gICAgX3RoaXM4LnBvcHBlckluc3RhbmNlLnNjaGVkdWxlVXBkYXRlKCk7XG4gIH07XG59XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgcG9wcGVyJ3MgcG9zaXRpb24gb24gZWFjaCBhbmltYXRpb24gZnJhbWVcbiAqIEBtZW1iZXJvZiBUaXBweVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX21ha2VTdGlja3koKSB7XG4gIHZhciBfdGhpczkgPSB0aGlzO1xuXG4gIHZhciBhcHBseVRyYW5zaXRpb25EdXJhdGlvbiQkMSA9IGZ1bmN0aW9uIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uJCQxKCkge1xuICAgIF90aGlzOS5wb3BwZXIuc3R5bGVbcHJlZml4KCd0cmFuc2l0aW9uRHVyYXRpb24nKV0gPSBfdGhpczkub3B0aW9ucy51cGRhdGVEdXJhdGlvbiArICdtcyc7XG4gIH07XG5cbiAgdmFyIHJlbW92ZVRyYW5zaXRpb25EdXJhdGlvbiA9IGZ1bmN0aW9uIHJlbW92ZVRyYW5zaXRpb25EdXJhdGlvbigpIHtcbiAgICBfdGhpczkucG9wcGVyLnN0eWxlW3ByZWZpeCgndHJhbnNpdGlvbkR1cmF0aW9uJyldID0gJyc7XG4gIH07XG5cbiAgdmFyIHVwZGF0ZVBvc2l0aW9uID0gZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24oKSB7XG4gICAgaWYgKF90aGlzOS5wb3BwZXJJbnN0YW5jZSkge1xuICAgICAgX3RoaXM5LnBvcHBlckluc3RhbmNlLnVwZGF0ZSgpO1xuICAgIH1cblxuICAgIGFwcGx5VHJhbnNpdGlvbkR1cmF0aW9uJCQxKCk7XG5cbiAgICBpZiAoX3RoaXM5LnN0YXRlLnZpc2libGUpIHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGVQb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlbW92ZVRyYW5zaXRpb25EdXJhdGlvbigpO1xuICAgIH1cbiAgfTtcblxuICB1cGRhdGVQb3NpdGlvbigpO1xufVxuXG4vKipcbiAqIEFkZHMgYSBtdXRhdGlvbiBvYnNlcnZlciB0byBhbiBlbGVtZW50IGFuZCBzdG9yZXMgaXQgaW4gdGhlIGluc3RhbmNlXG4gKiBAcGFyYW0ge09iamVjdH1cbiAqIEBtZW1iZXJvZiBUaXBweVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX2FkZE11dGF0aW9uT2JzZXJ2ZXIoX3JlZjIpIHtcbiAgdmFyIHRhcmdldCA9IF9yZWYyLnRhcmdldCxcbiAgICAgIGNhbGxiYWNrID0gX3JlZjIuY2FsbGJhY2ssXG4gICAgICBvcHRpb25zID0gX3JlZjIub3B0aW9ucztcblxuICBpZiAoIXdpbmRvdy5NdXRhdGlvbk9ic2VydmVyKSByZXR1cm47XG5cbiAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICBvYnNlcnZlci5vYnNlcnZlKHRhcmdldCwgb3B0aW9ucyk7XG5cbiAgdGhpcy5fKGtleSkubXV0YXRpb25PYnNlcnZlcnMucHVzaChvYnNlcnZlcik7XG59XG5cbi8qKlxuICogRmlyZXMgdGhlIGNhbGxiYWNrIGZ1bmN0aW9ucyBvbmNlIHRoZSBDU1MgdHJhbnNpdGlvbiBlbmRzIGZvciBgc2hvd2AgYW5kIGBoaWRlYCBtZXRob2RzXG4gKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gZmlyZSBvbmNlIHRyYW5zaXRpb24gY29tcGxldGVzXG4gKiBAbWVtYmVyb2YgVGlwcHlcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9vblRyYW5zaXRpb25FbmQoZHVyYXRpb24sIGNhbGxiYWNrKSB7XG4gIC8vIE1ha2UgY2FsbGJhY2sgc3luY2hyb25vdXMgaWYgZHVyYXRpb24gaXMgMFxuICBpZiAoIWR1cmF0aW9uKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIH1cblxuICB2YXIgX2dldElubmVyRWxlbWVudHM2ID0gZ2V0SW5uZXJFbGVtZW50cyh0aGlzLnBvcHBlciksXG4gICAgICB0b29sdGlwID0gX2dldElubmVyRWxlbWVudHM2LnRvb2x0aXA7XG5cbiAgdmFyIHRvZ2dsZUxpc3RlbmVycyA9IGZ1bmN0aW9uIHRvZ2dsZUxpc3RlbmVycyhhY3Rpb24sIGxpc3RlbmVyKSB7XG4gICAgaWYgKCFsaXN0ZW5lcikgcmV0dXJuO1xuICAgIHRvb2x0aXBbYWN0aW9uICsgJ0V2ZW50TGlzdGVuZXInXSgnb250cmFuc2l0aW9uZW5kJyBpbiB3aW5kb3cgPyAndHJhbnNpdGlvbmVuZCcgOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsIGxpc3RlbmVyKTtcbiAgfTtcblxuICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiBsaXN0ZW5lcihlKSB7XG4gICAgaWYgKGUudGFyZ2V0ID09PSB0b29sdGlwKSB7XG4gICAgICB0b2dnbGVMaXN0ZW5lcnMoJ3JlbW92ZScsIGxpc3RlbmVyKTtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9O1xuXG4gIHRvZ2dsZUxpc3RlbmVycygncmVtb3ZlJywgdGhpcy5fKGtleSkudHJhbnNpdGlvbmVuZExpc3RlbmVyKTtcbiAgdG9nZ2xlTGlzdGVuZXJzKCdhZGQnLCBsaXN0ZW5lcik7XG5cbiAgdGhpcy5fKGtleSkudHJhbnNpdGlvbmVuZExpc3RlbmVyID0gbGlzdGVuZXI7XG59XG5cbnZhciBpZENvdW50ZXIgPSAxO1xuXG4vKipcbiAqIENyZWF0ZXMgdG9vbHRpcHMgZm9yIGVhY2ggcmVmZXJlbmNlIGVsZW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudFtdfSBlbHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqIEByZXR1cm4ge1RpcHB5W119IEFycmF5IG9mIFRpcHB5IGluc3RhbmNlc1xuICovXG5mdW5jdGlvbiBjcmVhdGVUb29sdGlwcyhlbHMsIGNvbmZpZykge1xuICByZXR1cm4gZWxzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCByZWZlcmVuY2UpIHtcbiAgICB2YXIgaWQgPSBpZENvdW50ZXI7XG5cbiAgICB2YXIgb3B0aW9ucyA9IGV2YWx1YXRlT3B0aW9ucyhyZWZlcmVuY2UsIGNvbmZpZy5wZXJmb3JtYW5jZSA/IGNvbmZpZyA6IGdldEluZGl2aWR1YWxPcHRpb25zKHJlZmVyZW5jZSwgY29uZmlnKSk7XG5cbiAgICB2YXIgdGl0bGUgPSByZWZlcmVuY2UuZ2V0QXR0cmlidXRlKCd0aXRsZScpO1xuXG4gICAgLy8gRG9uJ3QgY3JlYXRlIGFuIGluc3RhbmNlIHdoZW46XG4gICAgLy8gKiB0aGUgYHRpdGxlYCBhdHRyaWJ1dGUgaXMgZmFsc3kgKG51bGwgb3IgZW1wdHkgc3RyaW5nKSwgYW5kXG4gICAgLy8gKiBpdCdzIG5vdCBhIGRlbGVnYXRlIGZvciB0b29sdGlwcywgYW5kXG4gICAgLy8gKiB0aGVyZSBpcyBubyBodG1sIHRlbXBsYXRlIHNwZWNpZmllZCwgYW5kXG4gICAgLy8gKiBgZHluYW1pY1RpdGxlYCBvcHRpb24gaXMgZmFsc2VcbiAgICBpZiAoIXRpdGxlICYmICFvcHRpb25zLnRhcmdldCAmJiAhb3B0aW9ucy5odG1sICYmICFvcHRpb25zLmR5bmFtaWNUaXRsZSkge1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9XG5cbiAgICAvLyBEZWxlZ2F0ZXMgc2hvdWxkIGJlIGhpZ2hsaWdodGVkIGFzIGRpZmZlcmVudFxuICAgIHJlZmVyZW5jZS5zZXRBdHRyaWJ1dGUob3B0aW9ucy50YXJnZXQgPyAnZGF0YS10aXBweS1kZWxlZ2F0ZScgOiAnZGF0YS10aXBweScsICcnKTtcblxuICAgIHJlbW92ZVRpdGxlKHJlZmVyZW5jZSk7XG5cbiAgICB2YXIgcG9wcGVyID0gY3JlYXRlUG9wcGVyRWxlbWVudChpZCwgdGl0bGUsIG9wdGlvbnMpO1xuXG4gICAgdmFyIHRpcHB5ID0gbmV3IFRpcHB5KHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHJlZmVyZW5jZTogcmVmZXJlbmNlLFxuICAgICAgcG9wcGVyOiBwb3BwZXIsXG4gICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgcG9wcGVySW5zdGFuY2U6IG51bGxcbiAgICB9KTtcblxuICAgIGlmIChvcHRpb25zLmNyZWF0ZVBvcHBlckluc3RhbmNlT25Jbml0KSB7XG4gICAgICB0aXBweS5wb3BwZXJJbnN0YW5jZSA9IF9jcmVhdGVQb3BwZXJJbnN0YW5jZS5jYWxsKHRpcHB5KTtcbiAgICAgIHRpcHB5LnBvcHBlckluc3RhbmNlLmRpc2FibGVFdmVudExpc3RlbmVycygpO1xuICAgIH1cblxuICAgIHZhciBsaXN0ZW5lcnMgPSBfZ2V0RXZlbnRMaXN0ZW5lcnMuY2FsbCh0aXBweSk7XG4gICAgdGlwcHkubGlzdGVuZXJzID0gb3B0aW9ucy50cmlnZ2VyLnRyaW0oKS5zcGxpdCgnICcpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBldmVudFR5cGUpIHtcbiAgICAgIHJldHVybiBhY2MuY29uY2F0KGNyZWF0ZVRyaWdnZXIoZXZlbnRUeXBlLCByZWZlcmVuY2UsIGxpc3RlbmVycywgb3B0aW9ucykpO1xuICAgIH0sIFtdKTtcblxuICAgIC8vIFVwZGF0ZSB0b29sdGlwIGNvbnRlbnQgd2hlbmV2ZXIgdGhlIHRpdGxlIGF0dHJpYnV0ZSBvbiB0aGUgcmVmZXJlbmNlIGNoYW5nZXNcbiAgICBpZiAob3B0aW9ucy5keW5hbWljVGl0bGUpIHtcbiAgICAgIF9hZGRNdXRhdGlvbk9ic2VydmVyLmNhbGwodGlwcHksIHtcbiAgICAgICAgdGFyZ2V0OiByZWZlcmVuY2UsXG4gICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiBjYWxsYmFjaygpIHtcbiAgICAgICAgICB2YXIgX2dldElubmVyRWxlbWVudHMgPSBnZXRJbm5lckVsZW1lbnRzKHBvcHBlciksXG4gICAgICAgICAgICAgIGNvbnRlbnQgPSBfZ2V0SW5uZXJFbGVtZW50cy5jb250ZW50O1xuXG4gICAgICAgICAgdmFyIHRpdGxlID0gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSgndGl0bGUnKTtcbiAgICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICAgIGNvbnRlbnRbb3B0aW9ucy5hbGxvd1RpdGxlSFRNTCA/ICdpbm5lckhUTUwnIDogJ3RleHRDb250ZW50J10gPSB0aXBweS50aXRsZSA9IHRpdGxlO1xuICAgICAgICAgICAgcmVtb3ZlVGl0bGUocmVmZXJlbmNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2hvcnRjdXRzXG4gICAgcmVmZXJlbmNlLl90aXBweSA9IHRpcHB5O1xuICAgIHBvcHBlci5fdGlwcHkgPSB0aXBweTtcbiAgICBwb3BwZXIuX3JlZmVyZW5jZSA9IHJlZmVyZW5jZTtcblxuICAgIGFjYy5wdXNoKHRpcHB5KTtcblxuICAgIGlkQ291bnRlcisrO1xuXG4gICAgcmV0dXJuIGFjYztcbiAgfSwgW10pO1xufVxuXG4vKipcbiAqIEhpZGVzIGFsbCBwb3BwZXJzXG4gKiBAcGFyYW0ge1RpcHB5fSBleGNsdWRlVGlwcHkgLSB0aXBweSB0byBleGNsdWRlIGlmIG5lZWRlZFxuICovXG5mdW5jdGlvbiBoaWRlQWxsUG9wcGVycyhleGNsdWRlVGlwcHkpIHtcbiAgdmFyIHBvcHBlcnMgPSB0b0FycmF5KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzLlBPUFBFUikpO1xuXG4gIHBvcHBlcnMuZm9yRWFjaChmdW5jdGlvbiAocG9wcGVyKSB7XG4gICAgdmFyIHRpcHB5ID0gcG9wcGVyLl90aXBweTtcbiAgICBpZiAoIXRpcHB5KSByZXR1cm47XG5cbiAgICB2YXIgb3B0aW9ucyA9IHRpcHB5Lm9wdGlvbnM7XG5cblxuICAgIGlmICgob3B0aW9ucy5oaWRlT25DbGljayA9PT0gdHJ1ZSB8fCBvcHRpb25zLnRyaWdnZXIuaW5kZXhPZignZm9jdXMnKSA+IC0xKSAmJiAoIWV4Y2x1ZGVUaXBweSB8fCBwb3BwZXIgIT09IGV4Y2x1ZGVUaXBweS5wb3BwZXIpKSB7XG4gICAgICB0aXBweS5oaWRlKCk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBBZGRzIHRoZSBuZWVkZWQgZXZlbnQgbGlzdGVuZXJzXG4gKi9cbmZ1bmN0aW9uIGJpbmRFdmVudExpc3RlbmVycygpIHtcbiAgdmFyIG9uRG9jdW1lbnRUb3VjaCA9IGZ1bmN0aW9uIG9uRG9jdW1lbnRUb3VjaCgpIHtcbiAgICBpZiAoYnJvd3Nlci51c2luZ1RvdWNoKSByZXR1cm47XG5cbiAgICBicm93c2VyLnVzaW5nVG91Y2ggPSB0cnVlO1xuXG4gICAgaWYgKGJyb3dzZXIuaU9TKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ3RpcHB5LXRvdWNoJyk7XG4gICAgfVxuXG4gICAgaWYgKGJyb3dzZXIuZHluYW1pY0lucHV0RGV0ZWN0aW9uICYmIHdpbmRvdy5wZXJmb3JtYW5jZSkge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Eb2N1bWVudE1vdXNlTW92ZSk7XG4gICAgfVxuXG4gICAgYnJvd3Nlci5vblVzZXJJbnB1dENoYW5nZSgndG91Y2gnKTtcbiAgfTtcblxuICB2YXIgb25Eb2N1bWVudE1vdXNlTW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGltZSA9IHZvaWQgMDtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgICAgIC8vIENocm9tZSA2MCsgaXMgMSBtb3VzZW1vdmUgcGVyIGFuaW1hdGlvbiBmcmFtZSwgdXNlIDIwbXMgdGltZSBkaWZmZXJlbmNlXG4gICAgICBpZiAobm93IC0gdGltZSA8IDIwKSB7XG4gICAgICAgIGJyb3dzZXIudXNpbmdUb3VjaCA9IGZhbHNlO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBvbkRvY3VtZW50TW91c2VNb3ZlKTtcbiAgICAgICAgaWYgKCFicm93c2VyLmlPUykge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgndGlwcHktdG91Y2gnKTtcbiAgICAgICAgfVxuICAgICAgICBicm93c2VyLm9uVXNlcklucHV0Q2hhbmdlKCdtb3VzZScpO1xuICAgICAgfVxuXG4gICAgICB0aW1lID0gbm93O1xuICAgIH07XG4gIH0oKTtcblxuICB2YXIgb25Eb2N1bWVudENsaWNrID0gZnVuY3Rpb24gb25Eb2N1bWVudENsaWNrKGV2ZW50KSB7XG4gICAgLy8gU2ltdWxhdGVkIGV2ZW50cyBkaXNwYXRjaGVkIG9uIHRoZSBkb2N1bWVudFxuICAgIGlmICghKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gaGlkZUFsbFBvcHBlcnMoKTtcbiAgICB9XG5cbiAgICB2YXIgcmVmZXJlbmNlID0gY2xvc2VzdChldmVudC50YXJnZXQsIHNlbGVjdG9ycy5SRUZFUkVOQ0UpO1xuICAgIHZhciBwb3BwZXIgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgc2VsZWN0b3JzLlBPUFBFUik7XG5cbiAgICBpZiAocG9wcGVyICYmIHBvcHBlci5fdGlwcHkgJiYgcG9wcGVyLl90aXBweS5vcHRpb25zLmludGVyYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHJlZmVyZW5jZSAmJiByZWZlcmVuY2UuX3RpcHB5KSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHJlZmVyZW5jZS5fdGlwcHkub3B0aW9ucztcblxuICAgICAgdmFyIGlzQ2xpY2tUcmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyLmluZGV4T2YoJ2NsaWNrJykgPiAtMTtcbiAgICAgIHZhciBpc011bHRpcGxlID0gb3B0aW9ucy5tdWx0aXBsZTtcblxuICAgICAgLy8gSGlkZSBhbGwgcG9wcGVycyBleGNlcHQgdGhlIG9uZSBiZWxvbmdpbmcgdG8gdGhlIGVsZW1lbnQgdGhhdCB3YXMgY2xpY2tlZFxuICAgICAgaWYgKCFpc011bHRpcGxlICYmIGJyb3dzZXIudXNpbmdUb3VjaCB8fCAhaXNNdWx0aXBsZSAmJiBpc0NsaWNrVHJpZ2dlcikge1xuICAgICAgICByZXR1cm4gaGlkZUFsbFBvcHBlcnMocmVmZXJlbmNlLl90aXBweSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmhpZGVPbkNsaWNrICE9PSB0cnVlIHx8IGlzQ2xpY2tUcmlnZ2VyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoaWRlQWxsUG9wcGVycygpO1xuICB9O1xuXG4gIHZhciBvbldpbmRvd0JsdXIgPSBmdW5jdGlvbiBvbldpbmRvd0JsdXIoKSB7XG4gICAgdmFyIF9kb2N1bWVudCA9IGRvY3VtZW50LFxuICAgICAgICBlbCA9IF9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgaWYgKGVsICYmIGVsLmJsdXIgJiYgbWF0Y2hlcyQxLmNhbGwoZWwsIHNlbGVjdG9ycy5SRUZFUkVOQ0UpKSB7XG4gICAgICBlbC5ibHVyKCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBvbldpbmRvd1Jlc2l6ZSA9IGZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICAgIHRvQXJyYXkoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcnMuUE9QUEVSKSkuZm9yRWFjaChmdW5jdGlvbiAocG9wcGVyKSB7XG4gICAgICB2YXIgdGlwcHlJbnN0YW5jZSA9IHBvcHBlci5fdGlwcHk7XG4gICAgICBpZiAodGlwcHlJbnN0YW5jZSAmJiAhdGlwcHlJbnN0YW5jZS5vcHRpb25zLmxpdmVQbGFjZW1lbnQpIHtcbiAgICAgICAgdGlwcHlJbnN0YW5jZS5wb3BwZXJJbnN0YW5jZS5zY2hlZHVsZVVwZGF0ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Eb2N1bWVudENsaWNrKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uRG9jdW1lbnRUb3VjaCk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgb25XaW5kb3dCbHVyKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplKTtcblxuICBpZiAoIWJyb3dzZXIuc3VwcG9ydHNUb3VjaCAmJiAobmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzIHx8IG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzKSkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgb25Eb2N1bWVudFRvdWNoKTtcbiAgfVxufVxuXG52YXIgZXZlbnRMaXN0ZW5lcnNCb3VuZCA9IGZhbHNlO1xuXG4vKipcbiAqIEV4cG9ydGVkIG1vZHVsZVxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudHxFbGVtZW50W118Tm9kZUxpc3R8T2JqZWN0fSBzZWxlY3RvclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25lIC0gY3JlYXRlIG9uZSB0b29sdGlwXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIHRpcHB5JDEoc2VsZWN0b3IsIG9wdGlvbnMsIG9uZSkge1xuICBpZiAoYnJvd3Nlci5zdXBwb3J0ZWQgJiYgIWV2ZW50TGlzdGVuZXJzQm91bmQpIHtcbiAgICBiaW5kRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICBldmVudExpc3RlbmVyc0JvdW5kID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChpc09iamVjdExpdGVyYWwoc2VsZWN0b3IpKSB7XG4gICAgcG9seWZpbGxWaXJ0dWFsUmVmZXJlbmNlUHJvcHMoc2VsZWN0b3IpO1xuICB9XG5cbiAgb3B0aW9ucyA9IF9leHRlbmRzKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgdmFyIHJlZmVyZW5jZXMgPSBnZXRBcnJheU9mRWxlbWVudHMoc2VsZWN0b3IpO1xuICB2YXIgZmlyc3RSZWZlcmVuY2UgPSByZWZlcmVuY2VzWzBdO1xuXG4gIHJldHVybiB7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgdG9vbHRpcHM6IGJyb3dzZXIuc3VwcG9ydGVkID8gY3JlYXRlVG9vbHRpcHMob25lICYmIGZpcnN0UmVmZXJlbmNlID8gW2ZpcnN0UmVmZXJlbmNlXSA6IHJlZmVyZW5jZXMsIG9wdGlvbnMpIDogW10sXG4gICAgZGVzdHJveUFsbDogZnVuY3Rpb24gZGVzdHJveUFsbCgpIHtcbiAgICAgIHRoaXMudG9vbHRpcHMuZm9yRWFjaChmdW5jdGlvbiAodG9vbHRpcCkge1xuICAgICAgICByZXR1cm4gdG9vbHRpcC5kZXN0cm95KCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMudG9vbHRpcHMgPSBbXTtcbiAgICB9XG4gIH07XG59XG5cbnRpcHB5JDEudmVyc2lvbiA9IHZlcnNpb247XG50aXBweSQxLmJyb3dzZXIgPSBicm93c2VyO1xudGlwcHkkMS5kZWZhdWx0cyA9IGRlZmF1bHRzO1xudGlwcHkkMS5vbmUgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHRpcHB5JDEoc2VsZWN0b3IsIG9wdGlvbnMsIHRydWUpLnRvb2x0aXBzWzBdO1xufTtcbnRpcHB5JDEuZGlzYWJsZUFuaW1hdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIGRlZmF1bHRzLnVwZGF0ZUR1cmF0aW9uID0gZGVmYXVsdHMuZHVyYXRpb24gPSAwO1xuICBkZWZhdWx0cy5hbmltYXRlRmlsbCA9IGZhbHNlO1xufTtcblxucmV0dXJuIHRpcHB5JDE7XG5cbn0pKSk7XG4iXX0=
