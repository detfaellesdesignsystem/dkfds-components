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
      } // Vendors: please allow content code to instantiate DOMExceptions
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
      }; // Most DOMException implementations don't allow calling DOMException's toString()
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
  } // There is full or partial native classList support, so just check if we need
  // to normalize the add/remove and toggle APIs.


  (function () {
    "use strict";

    var testElement = document.createElement("_");
    testElement.classList.add("c1", "c2"); // Polyfill for IE 10/11 and Firefox <26, where classList.add and
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

    testElement.classList.toggle("c3", false); // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
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
"use strict";

require('../../modules/es6.string.iterator');

require('../../modules/es6.array.from');

module.exports = require('../../modules/_core').Array.from;

},{"../../modules/_core":10,"../../modules/es6.array.from":58,"../../modules/es6.string.iterator":60}],4:[function(require,module,exports){
"use strict";

require('../../modules/es6.object.assign');

module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/_core":10,"../../modules/es6.object.assign":59}],5:[function(require,module,exports){
"use strict";

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],6:[function(require,module,exports){
"use strict";

var isObject = require('./_is-object');

module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":27}],7:[function(require,module,exports){
"use strict";

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
    var value; // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare

    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++]; // eslint-disable-next-line no-self-compare

      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }
    return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":49,"./_to-iobject":51,"./_to-length":52}],8:[function(require,module,exports){
"use strict";

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');

var TAG = require('./_wks')('toStringTag'); // ES3 wrong here


var ARG = cof(function () {
  return arguments;
}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {
    /* empty */
  }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T // builtinTag case
  : ARG ? cof(O) // ES3 arguments fallback
  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":9,"./_wks":56}],9:[function(require,module,exports){
"use strict";

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],10:[function(require,module,exports){
"use strict";

var core = module.exports = {
  version: '2.6.12'
};
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],11:[function(require,module,exports){
'use strict';

var $defineProperty = require('./_object-dp');

var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));else object[index] = value;
};

},{"./_object-dp":36,"./_property-desc":43}],12:[function(require,module,exports){
"use strict";

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

  return function
    /* ...args */
  () {
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
"use strict";

// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

},{"./_fails":18}],15:[function(require,module,exports){
"use strict";

var isObject = require('./_is-object');

var document = require('./_global').document; // typeof document.createElement is 'object' in old IE


var is = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":20,"./_is-object":27}],16:[function(require,module,exports){
"use strict";

// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

},{}],17:[function(require,module,exports){
"use strict";

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
    own = !IS_FORCED && target && target[key] !== undefined; // export native or passed

    out = (own ? target : source)[key]; // bind timers to global for call from export context

    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out; // extend global

    if (target) redefine(target, key, out, type & $export.U); // export

    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};

global.core = core; // type bitmap

$export.F = 1; // forced

$export.G = 2; // global

$export.S = 4; // static

$export.P = 8; // proto

$export.B = 16; // bind

$export.W = 32; // wrap

$export.U = 64; // safe

$export.R = 128; // real proto method for `library`

module.exports = $export;

},{"./_core":10,"./_ctx":12,"./_global":20,"./_hide":22,"./_redefine":44}],18:[function(require,module,exports){
"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],19:[function(require,module,exports){
"use strict";

module.exports = require('./_shared')('native-function-to-string', Function.toString);

},{"./_shared":47}],20:[function(require,module,exports){
"use strict";

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self // eslint-disable-next-line no-new-func
: Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],21:[function(require,module,exports){
"use strict";

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],22:[function(require,module,exports){
"use strict";

var dP = require('./_object-dp');

var createDesc = require('./_property-desc');

module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":14,"./_object-dp":36,"./_property-desc":43}],23:[function(require,module,exports){
"use strict";

var document = require('./_global').document;

module.exports = document && document.documentElement;

},{"./_global":20}],24:[function(require,module,exports){
"use strict";

module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {
    get: function get() {
      return 7;
    }
  }).a != 7;
});

},{"./_descriptors":14,"./_dom-create":15,"./_fails":18}],25:[function(require,module,exports){
"use strict";

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof'); // eslint-disable-next-line no-prototype-builtins


module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":9}],26:[function(require,module,exports){
"use strict";

// check on default Array iterator
var Iterators = require('./_iterators');

var ITERATOR = require('./_wks')('iterator');

var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":32,"./_wks":56}],27:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

module.exports = function (it) {
  return _typeof(it) === 'object' ? it !== null : typeof it === 'function';
};

},{}],28:[function(require,module,exports){
"use strict";

// call something on iterator step with safe closing on error
var anObject = require('./_an-object');

module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value); // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":6}],29:[function(require,module,exports){
'use strict';

var create = require('./_object-create');

var descriptor = require('./_property-desc');

var setToStringTag = require('./_set-to-string-tag');

var IteratorPrototype = {}; // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()

require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () {
  return this;
});

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, {
    next: descriptor(1, next)
  });
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
    }

    return function entries() {
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
  var methods, key, IteratorPrototype; // Fix native

  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));

    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true); // fix for some old engines

      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  } // fix Array#{values, @@iterator}.name in V8 / FF


  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;

    $default = function values() {
      return $native.call(this);
    };
  } // Define iterator


  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  } // Plug for library


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

},{"./_export":17,"./_hide":22,"./_iter-create":29,"./_iterators":32,"./_library":33,"./_object-gpo":39,"./_redefine":44,"./_set-to-string-tag":45,"./_wks":56}],31:[function(require,module,exports){
"use strict";

var ITERATOR = require('./_wks')('iterator');

var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();

  riter['return'] = function () {
    SAFE_CLOSING = true;
  }; // eslint-disable-next-line no-throw-literal


  Array.from(riter, function () {
    throw 2;
  });
} catch (e) {
  /* empty */
}

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;

  try {
    var arr = [7];
    var iter = arr[ITERATOR]();

    iter.next = function () {
      return {
        done: safe = true
      };
    };

    arr[ITERATOR] = function () {
      return iter;
    };

    exec(arr);
  } catch (e) {
    /* empty */
  }

  return safe;
};

},{"./_wks":56}],32:[function(require,module,exports){
"use strict";

module.exports = {};

},{}],33:[function(require,module,exports){
"use strict";

module.exports = false;

},{}],34:[function(require,module,exports){
'use strict'; // 19.1.2.1 Object.assign(target, source, ...)

var DESCRIPTORS = require('./_descriptors');

var getKeys = require('./_object-keys');

var gOPS = require('./_object-gops');

var pIE = require('./_object-pie');

var toObject = require('./_to-object');

var IObject = require('./_iobject');

var $assign = Object.assign; // should work with symbols and should have deterministic property order (V8 bug)

module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {}; // eslint-disable-next-line no-undef

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
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  }

  return T;
} : $assign;

},{"./_descriptors":14,"./_fails":18,"./_iobject":25,"./_object-gops":38,"./_object-keys":41,"./_object-pie":42,"./_to-object":53}],35:[function(require,module,exports){
"use strict";

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');

var dPs = require('./_object-dps');

var enumBugKeys = require('./_enum-bug-keys');

var IE_PROTO = require('./_shared-key')('IE_PROTO');

var Empty = function Empty() {
  /* empty */
};

var PROTOTYPE = 'prototype'; // Create object with fake `null` prototype: use iframe Object with cleared prototype

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
  }

  return _createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;

  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

    result[IE_PROTO] = O;
  } else result = _createDict();

  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":6,"./_dom-create":15,"./_enum-bug-keys":16,"./_html":23,"./_object-dps":37,"./_shared-key":46}],36:[function(require,module,exports){
"use strict";

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
  } catch (e) {
    /* empty */
  }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_ie8-dom-define":24,"./_to-primitive":54}],37:[function(require,module,exports){
"use strict";

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
  }

  return O;
};

},{"./_an-object":6,"./_descriptors":14,"./_object-dp":36,"./_object-keys":41}],38:[function(require,module,exports){
"use strict";

exports.f = Object.getOwnPropertySymbols;

},{}],39:[function(require,module,exports){
"use strict";

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
  }

  return O instanceof Object ? ObjectProto : null;
};

},{"./_has":21,"./_shared-key":46,"./_to-object":53}],40:[function(require,module,exports){
"use strict";

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
  }

  return result;
};

},{"./_array-includes":7,"./_has":21,"./_shared-key":46,"./_to-iobject":51}],41:[function(require,module,exports){
"use strict";

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');

var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":16,"./_object-keys-internal":40}],42:[function(require,module,exports){
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
"use strict";

var global = require('./_global');

var hide = require('./_hide');

var has = require('./_has');

var SRC = require('./_uid')('src');

var $toString = require('./_function-to-string');

var TO_STRING = 'toString';
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
  } // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative

})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":10,"./_function-to-string":19,"./_global":20,"./_has":21,"./_hide":22,"./_uid":55}],45:[function(require,module,exports){
"use strict";

var def = require('./_object-dp').f;

var has = require('./_has');

var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
    configurable: true,
    value: tag
  });
};

},{"./_has":21,"./_object-dp":36,"./_wks":56}],46:[function(require,module,exports){
"use strict";

var shared = require('./_shared')('keys');

var uid = require('./_uid');

module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":47,"./_uid":55}],47:[function(require,module,exports){
"use strict";

var core = require('./_core');

var global = require('./_global');

var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":10,"./_global":20,"./_library":33}],48:[function(require,module,exports){
"use strict";

var toInteger = require('./_to-integer');

var defined = require('./_defined'); // true  -> String#at
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

},{"./_defined":13,"./_to-integer":50}],49:[function(require,module,exports){
"use strict";

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
"use strict";

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');

var defined = require('./_defined');

module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":13,"./_iobject":25}],52:[function(require,module,exports){
"use strict";

// 7.1.15 ToLength
var toInteger = require('./_to-integer');

var min = Math.min;

module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":50}],53:[function(require,module,exports){
"use strict";

// 7.1.13 ToObject(argument)
var defined = require('./_defined');

module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":13}],54:[function(require,module,exports){
"use strict";

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object'); // instead of the ES6 spec version, we didn't implement @@toPrimitive case
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
"use strict";

var id = 0;
var px = Math.random();

module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],56:[function(require,module,exports){
"use strict";

var store = require('./_shared')('wks');

var uid = require('./_uid');

var _Symbol = require('./_global').Symbol;

var USE_SYMBOL = typeof _Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":20,"./_shared":47,"./_uid":55}],57:[function(require,module,exports){
"use strict";

var classof = require('./_classof');

var ITERATOR = require('./_wks')('iterator');

var Iterators = require('./_iterators');

module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

},{"./_classof":8,"./_core":10,"./_iterators":32,"./_wks":56}],58:[function(require,module,exports){
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
  from: function from(arrayLike
  /* , mapfn = undefined, thisArg = undefined */
  ) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2); // if object isn't iterable or it's array with default iterator - use simple case

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

},{"./_create-property":11,"./_ctx":12,"./_export":17,"./_is-array-iter":26,"./_iter-call":28,"./_iter-detect":31,"./_to-length":52,"./_to-object":53,"./core.get-iterator-method":57}],59:[function(require,module,exports){
"use strict";

// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {
  assign: require('./_object-assign')
});

},{"./_export":17,"./_object-assign":34}],60:[function(require,module,exports){
'use strict';

var $at = require('./_string-at')(true); // 21.1.3.27 String.prototype[@@iterator]()


require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target

  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return {
    value: undefined,
    done: true
  };
  point = $at(O, index);
  this._i += point.length;
  return {
    value: point,
    done: false
  };
});

},{"./_iter-define":30,"./_string-at":48}],61:[function(require,module,exports){
"use strict";

/* global define, KeyboardEvent, module */
(function () {
  var keyboardeventKeyPolyfill = {
    polyfill: polyfill,
    keys: {
      3: 'Cancel',
      6: 'Help',
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      28: 'Convert',
      29: 'NonConvert',
      30: 'Accept',
      31: 'ModeChange',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      41: 'Select',
      42: 'Print',
      43: 'Execute',
      44: 'PrintScreen',
      45: 'Insert',
      46: 'Delete',
      48: ['0', ')'],
      49: ['1', '!'],
      50: ['2', '@'],
      51: ['3', '#'],
      52: ['4', '$'],
      53: ['5', '%'],
      54: ['6', '^'],
      55: ['7', '&'],
      56: ['8', '*'],
      57: ['9', '('],
      91: 'OS',
      93: 'ContextMenu',
      144: 'NumLock',
      145: 'ScrollLock',
      181: 'VolumeMute',
      182: 'VolumeDown',
      183: 'VolumeUp',
      186: [';', ':'],
      187: ['=', '+'],
      188: [',', '<'],
      189: ['-', '_'],
      190: ['.', '>'],
      191: ['/', '?'],
      192: ['`', '~'],
      219: ['[', '{'],
      220: ['\\', '|'],
      221: [']', '}'],
      222: ["'", '"'],
      224: 'Meta',
      225: 'AltGraph',
      246: 'Attn',
      247: 'CrSel',
      248: 'ExSel',
      249: 'EraseEof',
      250: 'Play',
      251: 'ZoomOut'
    }
  }; // Function keys (F1-24).

  var i;

  for (i = 1; i < 25; i++) {
    keyboardeventKeyPolyfill.keys[111 + i] = 'F' + i;
  } // Printable ASCII characters.


  var letter = '';

  for (i = 65; i < 91; i++) {
    letter = String.fromCharCode(i);
    keyboardeventKeyPolyfill.keys[i] = [letter.toLowerCase(), letter.toUpperCase()];
  }

  function polyfill() {
    if (!('KeyboardEvent' in window) || 'key' in KeyboardEvent.prototype) {
      return false;
    } // Polyfill `key` on `KeyboardEvent`.


    var proto = {
      get: function get(x) {
        var key = keyboardeventKeyPolyfill.keys[this.which || this.keyCode];

        if (Array.isArray(key)) {
          key = key[+this.shiftKey];
        }

        return key;
      }
    };
    Object.defineProperty(KeyboardEvent.prototype, 'key', proto);
    return proto;
  }

  if (typeof define === 'function' && define.amd) {
    define('keyboardevent-key-polyfill', keyboardeventKeyPolyfill);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    module.exports = keyboardeventKeyPolyfill;
  } else if (window) {
    window.keyboardeventKeyPolyfill = keyboardeventKeyPolyfill;
  }
})();

},{}],62:[function(require,module,exports){
'use strict';

var proto = typeof Element !== 'undefined' ? Element.prototype : {};
var vendor = proto.matches || proto.matchesSelector || proto.webkitMatchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector;
module.exports = match;
/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] == el) return true;
  }

  return false;
}

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
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


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
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var assign = require('object-assign');

var delegate = require('./delegate');

var delegateAll = require('./delegateAll');

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

  if (_typeof(handler) === 'object') {
    options = {
      capture: popKey(handler, 'capture'),
      passive: popKey(handler, 'passive')
    };
  }

  var listener = {
    selector: selector,
    delegate: _typeof(handler) === 'object' ? delegateAll(handler) : selector ? delegate(selector, handler) : handler,
    options: options
  };

  if (type.indexOf(SPACE) > -1) {
    return type.split(SPACE).map(function (_type) {
      return assign({
        type: _type
      }, listener);
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

},{"./delegate":67,"./delegateAll":68,"object-assign":63}],65:[function(require,module,exports){
"use strict";

var matches = require('matches-selector');

module.exports = function (element, selector) {
  do {
    if (matches(element, selector)) {
      return element;
    }
  } while ((element = element.parentNode) && element.nodeType === 1);
};

},{"matches-selector":62}],66:[function(require,module,exports){
"use strict";

module.exports = function compose(functions) {
  return function (e) {
    return functions.some(function (fn) {
      return fn.call(this, e) === false;
    }, this);
  };
};

},{}],67:[function(require,module,exports){
"use strict";

var closest = require('./closest');

module.exports = function delegate(selector, fn) {
  return function delegation(event) {
    var target = closest(event.target, selector);

    if (target) {
      return fn.call(target, event);
    }
  };
};

},{"./closest":65}],68:[function(require,module,exports){
"use strict";

var delegate = require('./delegate');

var compose = require('./compose');

var SPLAT = '*';

module.exports = function delegateAll(selectors) {
  var keys = Object.keys(selectors); // XXX optimization: if there is only one handler and it applies to
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

},{"./compose":66,"./delegate":67}],69:[function(require,module,exports){
"use strict";

module.exports = function ignore(element, fn) {
  return function ignorance(e) {
    if (element !== e.target && !element.contains(e.target)) {
      return fn.call(this, e);
    }
  };
};

},{}],70:[function(require,module,exports){
'use strict';

module.exports = {
  behavior: require('./behavior'),
  delegate: require('./delegate'),
  delegateAll: require('./delegateAll'),
  ignore: require('./ignore'),
  keymap: require('./keymap')
};

},{"./behavior":64,"./delegate":67,"./delegateAll":68,"./ignore":69,"./keymap":71}],71:[function(require,module,exports){
"use strict";

require('keyboardevent-key-polyfill'); // these are the only relevant modifiers supported on all platforms,
// according to MDN:
// <https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState>


var MODIFIERS = {
  'Alt': 'altKey',
  'Control': 'ctrlKey',
  'Ctrl': 'ctrlKey',
  'Shift': 'shiftKey'
};
var MODIFIER_SEPARATOR = '+';

var getEventKey = function getEventKey(event, hasModifiers) {
  var key = event.key;

  if (hasModifiers) {
    for (var modifier in MODIFIERS) {
      if (event[MODIFIERS[modifier]] === true) {
        key = [modifier, key].join(MODIFIER_SEPARATOR);
      }
    }
  }

  return key;
};

module.exports = function keymap(keys) {
  var hasModifiers = Object.keys(keys).some(function (key) {
    return key.indexOf(MODIFIER_SEPARATOR) > -1;
  });
  return function (event) {
    var key = getEventKey(event, hasModifiers);
    return [key, key.toLowerCase()].reduce(function (result, _key) {
      if (_key in keys) {
        result = keys[key].call(this, event);
      }

      return result;
    }, undefined);
  };
};

module.exports.MODIFIERS = MODIFIERS;

},{"keyboardevent-key-polyfill":61}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("../polyfills/Function/prototype/bind");

var toggle = require('../utils/toggle');

var isElementInViewport = require('../utils/is-in-viewport');

var BUTTON = ".accordion-button[aria-controls]";
var EXPANDED = 'aria-expanded';
var MULTISELECTABLE = 'aria-multiselectable';
var MULTISELECTABLE_CLASS = 'accordion-multiselectable';
var BULK_FUNCTION_ACTION_ATTRIBUTE = "data-accordion-bulk-expand";
var text = {
  "open_all": "Åbn alle",
  "close_all": "Luk alle"
};
/**
 * Adds click functionality to accordion list
 * @param {HTMLElement} $accordion the accordion ul element
 * @param {JSON} strings Translate labels: {"open_all": "Åbn alle", "close_all": "Luk alle"}
 */

function Accordion($accordion) {
  var strings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : text;

  if (!$accordion) {
    throw new Error("Missing accordion group element");
  }

  this.accordion = $accordion;
  text = strings;
}
/**
 * Set eventlisteners on click elements in accordion list
 */


Accordion.prototype.init = function () {
  this.buttons = this.accordion.querySelectorAll(BUTTON);

  if (this.buttons.length == 0) {
    throw new Error("Missing accordion buttons");
  } // loop buttons in list


  for (var i = 0; i < this.buttons.length; i++) {
    var currentButton = this.buttons[i]; // Verify state on button and state on panel

    var expanded = currentButton.getAttribute(EXPANDED) === 'true';
    this.toggleButton(currentButton, expanded); // Set click event on accordion buttons

    currentButton.removeEventListener('click', this.eventOnClick.bind(this, currentButton), false);
    currentButton.addEventListener('click', this.eventOnClick.bind(this, currentButton), false);
  } // Set click event on bulk button if present


  var prevSibling = this.accordion.previousElementSibling;

  if (prevSibling !== null && prevSibling.classList.contains('accordion-bulk-button')) {
    this.bulkFunctionButton = prevSibling;
    this.bulkFunctionButton.addEventListener('click', this.bulkEvent.bind(this));
  }
};
/**
 * Bulk event handler: Triggered when clicking on .accordion-bulk-button
 */


Accordion.prototype.bulkEvent = function () {
  var $module = this;

  if (!$module.accordion.classList.contains('accordion')) {
    throw new Error("Could not find accordion.");
  }

  if ($module.buttons.length == 0) {
    throw new Error("Missing accordion buttons");
  }

  var expand = true;

  if ($module.bulkFunctionButton.getAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE) === "false") {
    expand = false;
  }

  for (var i = 0; i < $module.buttons.length; i++) {
    $module.toggleButton($module.buttons[i], expand, true);
  }

  $module.bulkFunctionButton.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, !expand);

  if (!expand === true) {
    $module.bulkFunctionButton.innerText = text.open_all;
  } else {
    $module.bulkFunctionButton.innerText = text.close_all;
  }
};
/**
 * Accordion button event handler: Toggles accordion
 * @param {HTMLButtonElement} $button 
 * @param {PointerEvent} e 
 */


Accordion.prototype.eventOnClick = function ($button, e) {
  var $module = this;
  e.stopPropagation();
  e.preventDefault();
  $module.toggleButton($button);

  if ($button.getAttribute(EXPANDED) === 'true') {
    // We were just expanded, but if another accordion was also just
    // collapsed, we may no longer be in the viewport. This ensures
    // that we are still visible, so the user isn't confused.
    if (!isElementInViewport($button)) $button.scrollIntoView();
  }
};
/**
 * Toggle a button's "pressed" state, optionally providing a target
 * state.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean?} expanded If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */


Accordion.prototype.toggleButton = function (button, expanded) {
  var bulk = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var accordion = null;

  if (button.parentNode.parentNode.classList.contains('accordion')) {
    accordion = button.parentNode.parentNode;
  } else if (button.parentNode.parentNode.parentNode.classList.contains('accordion')) {
    accordion = button.parentNode.parentNode.parentNode;
  }

  expanded = toggle(button, expanded);

  if (expanded) {
    var eventOpen = new Event('fds.accordion.open');
    button.dispatchEvent(eventOpen);
  } else {
    var eventClose = new Event('fds.accordion.close');
    button.dispatchEvent(eventClose);
  }

  var multiselectable = false;

  if (accordion !== null && (accordion.getAttribute(MULTISELECTABLE) === 'true' || accordion.classList.contains(MULTISELECTABLE_CLASS))) {
    multiselectable = true;
    var bulkFunction = accordion.previousElementSibling;

    if (bulkFunction !== null && bulkFunction.classList.contains('accordion-bulk-button')) {
      var buttons = accordion.querySelectorAll(BUTTON);

      if (bulk === false) {
        var buttonsOpen = accordion.querySelectorAll(BUTTON + '[aria-expanded="true"]');
        var newStatus = true;

        if (buttons.length === buttonsOpen.length) {
          newStatus = false;
        }

        bulkFunction.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, newStatus);

        if (newStatus === true) {
          bulkFunction.innerText = text.open_all;
        } else {
          bulkFunction.innerText = text.close_all;
        }
      }
    }
  }

  if (expanded && !multiselectable) {
    var _buttons = [button];

    if (accordion !== null) {
      _buttons = accordion.querySelectorAll(BUTTON);
    }

    for (var i = 0; i < _buttons.length; i++) {
      var currentButtton = _buttons[i];

      if (currentButtton !== button && currentButtton.getAttribute('aria-expanded' === true)) {
        toggle(currentButtton, false);

        var _eventClose = new Event('fds.accordion.close');

        currentButtton.dispatchEvent(_eventClose);
      }
    }
  }
};

var _default = Accordion;
exports["default"] = _default;

},{"../polyfills/Function/prototype/bind":93,"../utils/is-in-viewport":102,"../utils/toggle":105}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function Alert(alert) {
  this.alert = alert;
}

Alert.prototype.init = function () {
  var close = this.alert.getElementsByClassName('alert-close');

  if (close.length === 1) {
    close[0].addEventListener('click', this.hide.bind(this));
  }
};

Alert.prototype.hide = function () {
  this.alert.classList.add('d-none');
  var eventHide = new Event('fds.alert.hide');
  this.alert.dispatchEvent(eventHide);
};

Alert.prototype.show = function () {
  this.alert.classList.remove('d-none');
  var eventShow = new Event('fds.alert.show');
  this.alert.dispatchEvent(eventShow);
};

var _default = Alert;
exports["default"] = _default;

},{}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function BackToTop(backtotop) {
  this.backtotop = backtotop;
}

BackToTop.prototype.init = function () {
  var backtotopbutton = this.backtotop;
  updateBackToTopButton(backtotopbutton);
  var observer = new MutationObserver(function (list) {
    var evt = new CustomEvent('dom-changed', {
      detail: list
    });
    document.body.dispatchEvent(evt);
  }); // Which mutations to observe

  var config = {
    attributes: true,
    attributeOldValue: false,
    characterData: true,
    characterDataOldValue: false,
    childList: true,
    subtree: true
  }; // DOM changes

  observer.observe(document.body, config);
  document.body.addEventListener('dom-changed', function (e) {
    updateBackToTopButton(backtotopbutton);
  }); // Scroll actions

  window.addEventListener('scroll', function (e) {
    updateBackToTopButton(backtotopbutton);
  }); // Window resizes

  window.addEventListener('resize', function (e) {
    updateBackToTopButton(backtotopbutton);
  });
};

function updateBackToTopButton(button) {
  var docBody = document.body;
  var docElem = document.documentElement;
  var heightOfViewport = Math.max(docElem.clientHeight || 0, window.innerHeight || 0);
  var heightOfPage = Math.max(docBody.scrollHeight, docBody.offsetHeight, docBody.getBoundingClientRect().height, docElem.scrollHeight, docElem.offsetHeight, docElem.getBoundingClientRect().height, docElem.clientHeight);
  var limit = heightOfViewport * 2; // The threshold selected to determine whether a back-to-top-button should be displayed
  // Never show the button if the page is too short

  if (limit > heightOfPage) {
    if (!button.classList.contains('d-none')) {
      button.classList.add('d-none');
    }
  } // If the page is long, calculate when to show the button
  else {
    if (button.classList.contains('d-none')) {
      button.classList.remove('d-none');
    }

    var lastKnownScrollPosition = window.scrollY;
    var footer = document.getElementsByTagName("footer")[0]; // If there are several footers, the code only applies to the first footer
    // Show the button, if the user has scrolled too far down

    if (lastKnownScrollPosition >= limit) {
      if (!isFooterVisible(footer) && button.classList.contains('footer-sticky')) {
        button.classList.remove('footer-sticky');
      } else if (isFooterVisible(footer) && !button.classList.contains('footer-sticky')) {
        button.classList.add('footer-sticky');
      }
    } // If there's a sidenav, we might want to show the button anyway
    else {
      var sidenav = document.querySelector('.sidenav-list'); // Finds side navigations (left menus) and step guides

      if (sidenav && sidenav.offsetParent !== null) {
        var _sidenav$closest, _sidenav$closest$prev, _sidenav$closest2, _sidenav$closest2$pre;

        // Only react to sidenavs, which are always visible (i.e. not opened from overflow-menu buttons)
        if (!(((_sidenav$closest = sidenav.closest(".overflow-menu-inner")) === null || _sidenav$closest === void 0 ? void 0 : (_sidenav$closest$prev = _sidenav$closest.previousElementSibling) === null || _sidenav$closest$prev === void 0 ? void 0 : _sidenav$closest$prev.getAttribute('aria-expanded')) === "true" && ((_sidenav$closest2 = sidenav.closest(".overflow-menu-inner")) === null || _sidenav$closest2 === void 0 ? void 0 : (_sidenav$closest2$pre = _sidenav$closest2.previousElementSibling) === null || _sidenav$closest2$pre === void 0 ? void 0 : _sidenav$closest2$pre.offsetParent) !== null)) {
          var rect = sidenav.getBoundingClientRect();

          if (rect.bottom < 0) {
            if (!isFooterVisible(footer) && button.classList.contains('footer-sticky')) {
              button.classList.remove('footer-sticky');
            } else if (isFooterVisible(footer) && !button.classList.contains('footer-sticky')) {
              button.classList.add('footer-sticky');
            }
          } else {
            if (!button.classList.contains('footer-sticky')) {
              button.classList.add('footer-sticky');
            }
          }
        }
      } // There's no sidenav and we know the user hasn't reached the scroll limit: Ensure the button is hidden
      else {
        if (!button.classList.contains('footer-sticky')) {
          button.classList.add('footer-sticky');
        }
      }
    }
  }
}

function isFooterVisible(footerElement) {
  if (footerElement !== null && footerElement !== void 0 && footerElement.querySelector('.footer')) {
    var rect = footerElement.querySelector('.footer').getBoundingClientRect(); // Footer is visible or partly visible

    if (rect.top < window.innerHeight || rect.top < document.documentElement.clientHeight) {
      return true;
    } // Footer is hidden
    else {
      return false;
    }
  } else {
    return false;
  }
}

var _default = BackToTop;
exports["default"] = _default;

},{}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var MAX_LENGTH = 'data-maxlength';
var text = {
  "character_remaining": "Du har {value} tegn tilbage",
  "characters_remaining": "Du har {value} tegn tilbage",
  "character_too_many": "Du har {value} tegn for meget",
  "characters_too_many": "Du har {value} tegn for meget"
};
/**
 * Number of characters left
 * @param {HTMLElement} containerElement 
 * @param {JSON} strings Translate labels: {"character_remaining": "Du har {value} tegn tilbage", "characters_remaining": "Du har {value} tegn tilbage", "character_too_many": "Du har {value} tegn for meget", "characters_too_many": "Du har {value} tegn for meget"}
 */

function CharacterLimit(containerElement) {
  var strings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : text;
  this.container = containerElement;
  this.input = containerElement.getElementsByClassName('form-input')[0];
  this.maxlength = this.container.getAttribute(MAX_LENGTH);
  this.lastKeyUpTimestamp = null;
  this.oldValue = this.input.value;
  text = strings;
}

CharacterLimit.prototype.init = function () {
  this.input.addEventListener('keyup', this.handleKeyUp.bind(this));
  this.input.addEventListener('focus', this.handleFocus.bind(this));
  this.input.addEventListener('blur', this.handleBlur.bind(this));

  if ('onpageshow' in window) {
    window.addEventListener('pageshow', this.updateMessages.bind(this));
  } else {
    window.addEventListener('DOMContentLoaded', this.updateMessages.bind(this));
  }
};

CharacterLimit.prototype.charactersLeft = function () {
  var current_length = this.input.value.length;
  return this.maxlength - current_length;
};

function characterLimitMessage(characters_left) {
  var count_message = "";

  if (characters_left === -1) {
    var exceeded = Math.abs(characters_left);
    count_message = text.character_too_many.replace(/{value}/, exceeded);
  } else if (characters_left === 1) {
    count_message = text.character_remaining.replace(/{value}/, characters_left);
  } else if (characters_left >= 0) {
    count_message = text.characters_remaining.replace(/{value}/, characters_left);
  } else {
    var _exceeded = Math.abs(characters_left);

    count_message = text.characters_too_many.replace(/{value}/, _exceeded);
  }

  return count_message;
}

CharacterLimit.prototype.updateVisibleMessage = function () {
  var characters_left = this.charactersLeft();
  var count_message = characterLimitMessage(characters_left);
  var character_label = this.container.getElementsByClassName('character-limit')[0];

  if (characters_left < 0) {
    if (!character_label.classList.contains('limit-exceeded')) {
      character_label.classList.add('limit-exceeded');
    }

    if (!this.input.classList.contains('form-limit-error')) {
      this.input.classList.add('form-limit-error');
    }
  } else {
    if (character_label.classList.contains('limit-exceeded')) {
      character_label.classList.remove('limit-exceeded');
    }

    if (this.input.classList.contains('form-limit-error')) {
      this.input.classList.remove('form-limit-error');
    }
  }

  character_label.innerHTML = count_message;
};

CharacterLimit.prototype.updateScreenReaderMessage = function () {
  var characters_left = this.charactersLeft();
  var count_message = characterLimitMessage(characters_left);
  var character_label = this.container.getElementsByClassName('character-limit-sr-only')[0];
  character_label.innerHTML = count_message;
};

CharacterLimit.prototype.resetScreenReaderMessage = function () {
  if (this.input.value !== "") {
    var sr_message = this.container.getElementsByClassName('character-limit-sr-only')[0];
    sr_message.innerHTML = '';
  }
};

CharacterLimit.prototype.updateMessages = function (e) {
  this.updateVisibleMessage();
  this.updateScreenReaderMessage();
};

CharacterLimit.prototype.handleKeyUp = function (e) {
  this.updateVisibleMessage();
  this.lastKeyUpTimestamp = Date.now();
};

CharacterLimit.prototype.handleFocus = function (e) {
  // Reset the screen reader message on focus to force an update of the message.
  // This ensures that a screen reader informs the user of how many characters there is left
  // on focus and not just what the character limit is.
  this.resetScreenReaderMessage();
  this.intervalID = setInterval(function () {
    // Don't update the Screen Reader message unless it's been awhile
    // since the last key up event. Otherwise, the user will be spammed
    // with audio notifications while typing.
    if (!this.lastKeyUpTimestamp || Date.now() - 500 >= this.lastKeyUpTimestamp) {
      var sr_message = this.container.getElementsByClassName('character-limit-sr-only')[0].innerHTML;
      var visible_message = this.container.getElementsByClassName('character-limit')[0].innerHTML; // Don't update the messages unless the value of the textarea/text input has changed or if there
      // is a mismatch between the visible message and the screen reader message.

      if (this.oldValue !== this.input.value || sr_message !== visible_message) {
        this.oldValue = this.input.value;
        this.updateMessages();
      }
    }
  }.bind(this), 1000);
};

CharacterLimit.prototype.handleBlur = function (e) {
  clearInterval(this.intervalID); // Don't update the messages on blur unless the value of the textarea/text input has changed

  if (this.oldValue !== this.input.value) {
    this.oldValue = this.input.value;
    this.updateMessages();
  }
};

var _default = CharacterLimit;
exports["default"] = _default;

},{}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("../polyfills/Function/prototype/bind");

var TOGGLE_TARGET_ATTRIBUTE = 'data-aria-controls';
/**
 * Adds click functionality to checkbox collapse component
 * @param {HTMLInputElement} checkboxElement 
 */

function CheckboxToggleContent(checkboxElement) {
  this.checkboxElement = checkboxElement;
  this.targetElement = null;
}
/**
 * Set events on checkbox state change
 */


CheckboxToggleContent.prototype.init = function () {
  this.checkboxElement.addEventListener('change', this.toggle.bind(this));
  this.toggle();
};
/**
 * Toggle checkbox content
 */


CheckboxToggleContent.prototype.toggle = function () {
  var $module = this;
  var targetAttr = this.checkboxElement.getAttribute(TOGGLE_TARGET_ATTRIBUTE);
  var targetEl = document.getElementById(targetAttr);

  if (targetEl === null || targetEl === undefined) {
    throw new Error("Could not find panel element. Verify value of attribute " + TOGGLE_TARGET_ATTRIBUTE);
  }

  if (this.checkboxElement.checked) {
    $module.expand(this.checkboxElement, targetEl);
  } else {
    $module.collapse(this.checkboxElement, targetEl);
  }
};
/**
 * Expand content
 * @param {HTMLInputElement} checkboxElement Checkbox input element 
 * @param {HTMLElement} contentElement Content container element 
 */


CheckboxToggleContent.prototype.expand = function (checkboxElement, contentElement) {
  if (checkboxElement !== null && checkboxElement !== undefined && contentElement !== null && contentElement !== undefined) {
    checkboxElement.setAttribute('data-aria-expanded', 'true');
    contentElement.classList.remove('collapsed');
    contentElement.setAttribute('aria-hidden', 'false');
    var eventOpen = new Event('fds.collapse.expanded');
    checkboxElement.dispatchEvent(eventOpen);
  }
};
/**
 * Collapse content
 * @param {HTMLInputElement} checkboxElement Checkbox input element 
 * @param {HTMLElement} contentElement Content container element 
 */


CheckboxToggleContent.prototype.collapse = function (triggerEl, targetEl) {
  if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
    triggerEl.setAttribute('data-aria-expanded', 'false');
    targetEl.classList.add('collapsed');
    targetEl.setAttribute('aria-hidden', 'true');
    var eventClose = new Event('fds.collapse.collapsed');
    triggerEl.dispatchEvent(eventClose);
  }
};

var _default = CheckboxToggleContent;
exports["default"] = _default;

},{"../polyfills/Function/prototype/bind":93}],77:[function(require,module,exports){
"use strict";

var _receptor = require("receptor");

var _CLICK, _keydown, _focusout, _datePickerEvents;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var behavior = require("../utils/behavior");

var select = require("../utils/select");

var _require = require("../config"),
    PREFIX = _require.prefix;

var _require2 = require("../events"),
    CLICK = _require2.CLICK;

var activeElement = require("../utils/active-element");

var isIosDevice = require("../utils/is-ios-device");

var DATE_PICKER_CLASS = "date-picker";
var DATE_PICKER_WRAPPER_CLASS = "".concat(DATE_PICKER_CLASS, "__wrapper");
var DATE_PICKER_INITIALIZED_CLASS = "".concat(DATE_PICKER_CLASS, "--initialized");
var DATE_PICKER_ACTIVE_CLASS = "".concat(DATE_PICKER_CLASS, "--active");
var DATE_PICKER_INTERNAL_INPUT_CLASS = "".concat(DATE_PICKER_CLASS, "__internal-input");
var DATE_PICKER_EXTERNAL_INPUT_CLASS = "".concat(DATE_PICKER_CLASS, "__external-input");
var DATE_PICKER_BUTTON_CLASS = "".concat(DATE_PICKER_CLASS, "__button");
var DATE_PICKER_CALENDAR_CLASS = "".concat(DATE_PICKER_CLASS, "__calendar");
var DATE_PICKER_STATUS_CLASS = "".concat(DATE_PICKER_CLASS, "__status");
var CALENDAR_DATE_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__date");
var CALENDAR_DATE_FOCUSED_CLASS = "".concat(CALENDAR_DATE_CLASS, "--focused");
var CALENDAR_DATE_SELECTED_CLASS = "".concat(CALENDAR_DATE_CLASS, "--selected");
var CALENDAR_DATE_PREVIOUS_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--previous-month");
var CALENDAR_DATE_CURRENT_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--current-month");
var CALENDAR_DATE_NEXT_MONTH_CLASS = "".concat(CALENDAR_DATE_CLASS, "--next-month");
var CALENDAR_DATE_RANGE_DATE_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date");
var CALENDAR_DATE_TODAY_CLASS = "".concat(CALENDAR_DATE_CLASS, "--today");
var CALENDAR_DATE_RANGE_DATE_START_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date-start");
var CALENDAR_DATE_RANGE_DATE_END_CLASS = "".concat(CALENDAR_DATE_CLASS, "--range-date-end");
var CALENDAR_DATE_WITHIN_RANGE_CLASS = "".concat(CALENDAR_DATE_CLASS, "--within-range");
var CALENDAR_PREVIOUS_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-year");
var CALENDAR_PREVIOUS_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-month");
var CALENDAR_NEXT_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-year");
var CALENDAR_NEXT_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-month");
var CALENDAR_MONTH_SELECTION_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-selection");
var CALENDAR_YEAR_SELECTION_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year-selection");
var CALENDAR_MONTH_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month");
var CALENDAR_MONTH_FOCUSED_CLASS = "".concat(CALENDAR_MONTH_CLASS, "--focused");
var CALENDAR_MONTH_SELECTED_CLASS = "".concat(CALENDAR_MONTH_CLASS, "--selected");
var CALENDAR_YEAR_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year");
var CALENDAR_YEAR_FOCUSED_CLASS = "".concat(CALENDAR_YEAR_CLASS, "--focused");
var CALENDAR_YEAR_SELECTED_CLASS = "".concat(CALENDAR_YEAR_CLASS, "--selected");
var CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__previous-year-chunk");
var CALENDAR_NEXT_YEAR_CHUNK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__next-year-chunk");
var CALENDAR_DATE_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__date-picker");
var CALENDAR_MONTH_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-picker");
var CALENDAR_YEAR_PICKER_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__year-picker");
var CALENDAR_TABLE_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__table");
var CALENDAR_ROW_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__row");
var CALENDAR_CELL_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__cell");
var CALENDAR_CELL_CENTER_ITEMS_CLASS = "".concat(CALENDAR_CELL_CLASS, "--center-items");
var CALENDAR_MONTH_LABEL_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__month-label");
var CALENDAR_DAY_OF_WEEK_CLASS = "".concat(DATE_PICKER_CALENDAR_CLASS, "__day-of-week");
var DATE_PICKER = ".".concat(DATE_PICKER_CLASS);
var DATE_PICKER_BUTTON = ".".concat(DATE_PICKER_BUTTON_CLASS);
var DATE_PICKER_INTERNAL_INPUT = ".".concat(DATE_PICKER_INTERNAL_INPUT_CLASS);
var DATE_PICKER_EXTERNAL_INPUT = ".".concat(DATE_PICKER_EXTERNAL_INPUT_CLASS);
var DATE_PICKER_CALENDAR = ".".concat(DATE_PICKER_CALENDAR_CLASS);
var DATE_PICKER_STATUS = ".".concat(DATE_PICKER_STATUS_CLASS);
var CALENDAR_DATE = ".".concat(CALENDAR_DATE_CLASS);
var CALENDAR_DATE_FOCUSED = ".".concat(CALENDAR_DATE_FOCUSED_CLASS);
var CALENDAR_DATE_CURRENT_MONTH = ".".concat(CALENDAR_DATE_CURRENT_MONTH_CLASS);
var CALENDAR_PREVIOUS_YEAR = ".".concat(CALENDAR_PREVIOUS_YEAR_CLASS);
var CALENDAR_PREVIOUS_MONTH = ".".concat(CALENDAR_PREVIOUS_MONTH_CLASS);
var CALENDAR_NEXT_YEAR = ".".concat(CALENDAR_NEXT_YEAR_CLASS);
var CALENDAR_NEXT_MONTH = ".".concat(CALENDAR_NEXT_MONTH_CLASS);
var CALENDAR_YEAR_SELECTION = ".".concat(CALENDAR_YEAR_SELECTION_CLASS);
var CALENDAR_MONTH_SELECTION = ".".concat(CALENDAR_MONTH_SELECTION_CLASS);
var CALENDAR_MONTH = ".".concat(CALENDAR_MONTH_CLASS);
var CALENDAR_YEAR = ".".concat(CALENDAR_YEAR_CLASS);
var CALENDAR_PREVIOUS_YEAR_CHUNK = ".".concat(CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS);
var CALENDAR_NEXT_YEAR_CHUNK = ".".concat(CALENDAR_NEXT_YEAR_CHUNK_CLASS);
var CALENDAR_DATE_PICKER = ".".concat(CALENDAR_DATE_PICKER_CLASS);
var CALENDAR_MONTH_PICKER = ".".concat(CALENDAR_MONTH_PICKER_CLASS);
var CALENDAR_YEAR_PICKER = ".".concat(CALENDAR_YEAR_PICKER_CLASS);
var CALENDAR_MONTH_FOCUSED = ".".concat(CALENDAR_MONTH_FOCUSED_CLASS);
var CALENDAR_YEAR_FOCUSED = ".".concat(CALENDAR_YEAR_FOCUSED_CLASS);
var text = {
  "open_calendar": "Åbn kalender",
  "aria_label_date": "{dayStr} den {day}. {monthStr} {year}",
  "previous_year": "Navigér ét år tilbage",
  "previous_month": "Navigér én måned tilbage",
  "next_month": "Navigér én måned frem",
  "next_year": "Navigér ét år frem",
  "select_month": "Vælg måned",
  "select_year": "Vælg år",
  "date_selected": "Dato valgt",
  "previous_years": "Navigér {years} år tilbage",
  "next_years": "Navigér {years} år frem",
  "guide": "Du kan navigere mellem dage ved at bruge højre og venstre piletaster, uger ved at bruge op og ned piletaster, måneder ved at bruge page up og page down-tasterne og år ved at at taste shift og page up eller ned. Home og end-tasten navigerer til start eller slutning af en uge.",
  "months_displayed": "Vælg en måned",
  "years_displayed": "Viser år {start} til {end}. Vælg et år.",
  "january": "januar",
  "february": "februar",
  "march": "marts",
  "april": "april",
  "may": "maj",
  "june": "juni",
  "july": "juli",
  "august": "august",
  "september": "september",
  "october": "oktober",
  "november": "november",
  "december": "december",
  "monday": "mandag",
  "tuesday": "tirsdag",
  "wednesday": "onsdag",
  "thursday": "torsdag",
  "friday": "fredag",
  "saturday": "lørdag",
  "sunday": "søndag"
};
var VALIDATION_MESSAGE = "Indtast venligst en gyldig dato";
var MONTH_LABELS = [text.january, text.february, text.march, text.april, text.may, text.june, text.july, text.august, text.september, text.october, text.november, text.december];
var DAY_OF_WEEK_LABELS = [text.monday, text.tuesday, text.wednesday, text.thursday, text.friday, text.saturday, text.sunday];
var ENTER_KEYCODE = 13;
var YEAR_CHUNK = 12;
var DEFAULT_MIN_DATE = "0000-01-01";
var DEFAULT_EXTERNAL_DATE_FORMAT = "DD/MM/YYYY";
var INTERNAL_DATE_FORMAT = "YYYY-MM-DD";
var NOT_DISABLED_SELECTOR = ":not([disabled])";

var processFocusableSelectors = function processFocusableSelectors() {
  for (var _len = arguments.length, selectors = new Array(_len), _key = 0; _key < _len; _key++) {
    selectors[_key] = arguments[_key];
  }

  return selectors.map(function (query) {
    return query + NOT_DISABLED_SELECTOR;
  }).join(", ");
};

var DATE_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_PREVIOUS_YEAR, CALENDAR_PREVIOUS_MONTH, CALENDAR_YEAR_SELECTION, CALENDAR_MONTH_SELECTION, CALENDAR_NEXT_YEAR, CALENDAR_NEXT_MONTH, CALENDAR_DATE_FOCUSED);
var MONTH_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_MONTH_FOCUSED);
var YEAR_PICKER_FOCUSABLE = processFocusableSelectors(CALENDAR_PREVIOUS_YEAR_CHUNK, CALENDAR_NEXT_YEAR_CHUNK, CALENDAR_YEAR_FOCUSED); // #region Date Manipulation Functions

/**
 * Keep date within month. Month would only be over by 1 to 3 days
 *
 * @param {Date} dateToCheck the date object to check
 * @param {number} month the correct month
 * @returns {Date} the date, corrected if needed
 */

var keepDateWithinMonth = function keepDateWithinMonth(dateToCheck, month) {
  if (month !== dateToCheck.getMonth()) {
    dateToCheck.setDate(0);
  }

  return dateToCheck;
};
/**
 * Set date from month day year
 *
 * @param {number} year the year to set
 * @param {number} month the month to set (zero-indexed)
 * @param {number} date the date to set
 * @returns {Date} the set date
 */


var setDate = function setDate(year, month, date) {
  var newDate = new Date(0);
  newDate.setFullYear(year, month, date);
  return newDate;
};
/**
 * todays date
 *
 * @returns {Date} todays date
 */


var today = function today() {
  var newDate = new Date();
  var day = newDate.getDate();
  var month = newDate.getMonth();
  var year = newDate.getFullYear();
  return setDate(year, month, day);
};
/**
 * Set date to first day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */


var startOfMonth = function startOfMonth(date) {
  var newDate = new Date(0);
  newDate.setFullYear(date.getFullYear(), date.getMonth(), 1);
  return newDate;
};
/**
 * Set date to last day of the month
 *
 * @param {number} date the date to adjust
 * @returns {Date} the adjusted date
 */


var lastDayOfMonth = function lastDayOfMonth(date) {
  var newDate = new Date(0);
  newDate.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
  return newDate;
};
/**
 * Add days to date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numDays the difference in days
 * @returns {Date} the adjusted date
 */


var addDays = function addDays(_date, numDays) {
  var newDate = new Date(_date.getTime());
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};
/**
 * Subtract days from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numDays the difference in days
 * @returns {Date} the adjusted date
 */


var subDays = function subDays(_date, numDays) {
  return addDays(_date, -numDays);
};
/**
 * Add weeks to date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */


var addWeeks = function addWeeks(_date, numWeeks) {
  return addDays(_date, numWeeks * 7);
};
/**
 * Subtract weeks from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */


var subWeeks = function subWeeks(_date, numWeeks) {
  return addWeeks(_date, -numWeeks);
};
/**
 * Set date to the start of the week (Monday)
 *
 * @param {Date} _date the date to adjust
 * @returns {Date} the adjusted date
 */


var startOfWeek = function startOfWeek(_date) {
  var dayOfWeek = _date.getDay() - 1;

  if (dayOfWeek === -1) {
    dayOfWeek = 6;
  }

  return subDays(_date, dayOfWeek);
};
/**
 * Set date to the end of the week (Sunday)
 *
 * @param {Date} _date the date to adjust
 * @param {number} numWeeks the difference in weeks
 * @returns {Date} the adjusted date
 */


var endOfWeek = function endOfWeek(_date) {
  var dayOfWeek = _date.getDay();

  return addDays(_date, 7 - dayOfWeek);
};
/**
 * Add months to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */


var addMonths = function addMonths(_date, numMonths) {
  var newDate = new Date(_date.getTime());
  var dateMonth = (newDate.getMonth() + 12 + numMonths) % 12;
  newDate.setMonth(newDate.getMonth() + numMonths);
  keepDateWithinMonth(newDate, dateMonth);
  return newDate;
};
/**
 * Subtract months from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numMonths the difference in months
 * @returns {Date} the adjusted date
 */


var subMonths = function subMonths(_date, numMonths) {
  return addMonths(_date, -numMonths);
};
/**
 * Add years to date and keep date within month
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */


var addYears = function addYears(_date, numYears) {
  return addMonths(_date, numYears * 12);
};
/**
 * Subtract years from date
 *
 * @param {Date} _date the date to adjust
 * @param {number} numYears the difference in years
 * @returns {Date} the adjusted date
 */


var subYears = function subYears(_date, numYears) {
  return addYears(_date, -numYears);
};
/**
 * Set months of date
 *
 * @param {Date} _date the date to adjust
 * @param {number} month zero-indexed month to set
 * @returns {Date} the adjusted date
 */


var setMonth = function setMonth(_date, month) {
  var newDate = new Date(_date.getTime());
  newDate.setMonth(month);
  keepDateWithinMonth(newDate, month);
  return newDate;
};
/**
 * Set year of date
 *
 * @param {Date} _date the date to adjust
 * @param {number} year the year to set
 * @returns {Date} the adjusted date
 */


var setYear = function setYear(_date, year) {
  var newDate = new Date(_date.getTime());
  var month = newDate.getMonth();
  newDate.setFullYear(year);
  keepDateWithinMonth(newDate, month);
  return newDate;
};
/**
 * Return the earliest date
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {Date} the earliest date
 */


var min = function min(dateA, dateB) {
  var newDate = dateA;

  if (dateB < dateA) {
    newDate = dateB;
  }

  return new Date(newDate.getTime());
};
/**
 * Return the latest date
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {Date} the latest date
 */


var max = function max(dateA, dateB) {
  var newDate = dateA;

  if (dateB > dateA) {
    newDate = dateB;
  }

  return new Date(newDate.getTime());
};
/**
 * Check if dates are the in the same year
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {boolean} are dates in the same year
 */


var isSameYear = function isSameYear(dateA, dateB) {
  return dateA && dateB && dateA.getFullYear() === dateB.getFullYear();
};
/**
 * Check if dates are the in the same month
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {boolean} are dates in the same month
 */


var isSameMonth = function isSameMonth(dateA, dateB) {
  return isSameYear(dateA, dateB) && dateA.getMonth() === dateB.getMonth();
};
/**
 * Check if dates are the same date
 *
 * @param {Date} dateA the date to compare
 * @param {Date} dateA the date to compare
 * @returns {boolean} are dates the same date
 */


var isSameDay = function isSameDay(dateA, dateB) {
  return isSameMonth(dateA, dateB) && dateA.getDate() === dateB.getDate();
};
/**
 * return a new date within minimum and maximum date
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @returns {Date} the date between min and max
 */


var keepDateBetweenMinAndMax = function keepDateBetweenMinAndMax(date, minDate, maxDate) {
  var newDate = date;

  if (date < minDate) {
    newDate = minDate;
  } else if (maxDate && date > maxDate) {
    newDate = maxDate;
  }

  return new Date(newDate.getTime());
};
/**
 * Check if dates is valid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is there a day within the month within min and max dates
 */


var isDateWithinMinAndMax = function isDateWithinMinAndMax(date, minDate, maxDate) {
  return date >= minDate && (!maxDate || date <= maxDate);
};
/**
 * Check if dates month is invalid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is the month outside min or max dates
 */


var isDatesMonthOutsideMinOrMax = function isDatesMonthOutsideMinOrMax(date, minDate, maxDate) {
  return lastDayOfMonth(date) < minDate || maxDate && startOfMonth(date) > maxDate;
};
/**
 * Check if dates year is invalid.
 *
 * @param {Date} date date to check
 * @param {Date} minDate minimum date to allow
 * @param {Date} maxDate maximum date to allow
 * @return {boolean} is the month outside min or max dates
 */


var isDatesYearOutsideMinOrMax = function isDatesYearOutsideMinOrMax(date, minDate, maxDate) {
  return lastDayOfMonth(setMonth(date, 11)) < minDate || maxDate && startOfMonth(setMonth(date, 0)) > maxDate;
};
/**
 * Parse a date with format D-M-YY
 *
 * @param {string} dateString the date string to parse
 * @param {string} dateFormat the format of the date string
 * @param {boolean} adjustDate should the date be adjusted
 * @returns {Date} the parsed date
 */


var parseDateString = function parseDateString(dateString) {
  var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INTERNAL_DATE_FORMAT;
  var adjustDate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var date;
  var month;
  var day;
  var year;
  var parsed;

  if (dateString) {
    var monthStr, dayStr, yearStr;

    if (dateFormat === DEFAULT_EXTERNAL_DATE_FORMAT) {
      var _dateString$split = dateString.split("/");

      var _dateString$split2 = _slicedToArray(_dateString$split, 3);

      dayStr = _dateString$split2[0];
      monthStr = _dateString$split2[1];
      yearStr = _dateString$split2[2];
    } else {
      var _dateString$split3 = dateString.split("-");

      var _dateString$split4 = _slicedToArray(_dateString$split3, 3);

      yearStr = _dateString$split4[0];
      monthStr = _dateString$split4[1];
      dayStr = _dateString$split4[2];
    }

    if (yearStr) {
      parsed = parseInt(yearStr, 10);

      if (!Number.isNaN(parsed)) {
        year = parsed;

        if (adjustDate) {
          year = Math.max(0, year);

          if (yearStr.length < 3) {
            var currentYear = today().getFullYear();
            var currentYearStub = currentYear - currentYear % Math.pow(10, yearStr.length);
            year = currentYearStub + parsed;
          }
        }
      }
    }

    if (monthStr) {
      parsed = parseInt(monthStr, 10);

      if (!Number.isNaN(parsed)) {
        month = parsed;

        if (adjustDate) {
          month = Math.max(1, month);
          month = Math.min(12, month);
        }
      }
    }

    if (month && dayStr && year != null) {
      parsed = parseInt(dayStr, 10);

      if (!Number.isNaN(parsed)) {
        day = parsed;

        if (adjustDate) {
          var lastDayOfTheMonth = setDate(year, month, 0).getDate();
          day = Math.max(1, day);
          day = Math.min(lastDayOfTheMonth, day);
        }
      }
    }

    if (month && day && year != null) {
      date = setDate(year, month - 1, day);
    }
  }

  return date;
};
/**
 * Format a date to format MM-DD-YYYY
 *
 * @param {Date} date the date to format
 * @param {string} dateFormat the format of the date string
 * @returns {string} the formatted date string
 */


var formatDate = function formatDate(date) {
  var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INTERNAL_DATE_FORMAT;

  var padZeros = function padZeros(value, length) {
    return "0000".concat(value).slice(-length);
  };

  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();

  if (dateFormat === DEFAULT_EXTERNAL_DATE_FORMAT) {
    return [padZeros(day, 2), padZeros(month, 2), padZeros(year, 4)].join("/");
  }

  return [padZeros(year, 4), padZeros(month, 2), padZeros(day, 2)].join("-");
}; // #endregion Date Manipulation Functions

/**
 * Create a grid string from an array of html strings
 *
 * @param {string[]} htmlArray the array of html items
 * @param {number} rowSize the length of a row
 * @returns {string} the grid string
 */


var listToGridHtml = function listToGridHtml(htmlArray, rowSize) {
  var grid = [];
  var row = [];
  var i = 0;

  while (i < htmlArray.length) {
    row = [];

    while (i < htmlArray.length && row.length < rowSize) {
      row.push("<td>".concat(htmlArray[i], "</td>"));
      i += 1;
    }

    grid.push("<tr>".concat(row.join(""), "</tr>"));
  }

  return grid.join("");
};
/**
 * set the value of the element and dispatch a change event
 *
 * @param {HTMLInputElement} el The element to update
 * @param {string} value The new value of the element
 */


var changeElementValue = function changeElementValue(el) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var elementToChange = el;
  elementToChange.value = value;
  var event = new Event('change');
  elementToChange.dispatchEvent(event);
};
/**
 * The properties and elements within the date picker.
 * @typedef {Object} DatePickerContext
 * @property {HTMLDivElement} calendarEl
 * @property {HTMLElement} datePickerEl
 * @property {HTMLInputElement} internalInputEl
 * @property {HTMLInputElement} externalInputEl
 * @property {HTMLDivElement} statusEl
 * @property {HTMLDivElement} firstYearChunkEl
 * @property {Date} calendarDate
 * @property {Date} minDate
 * @property {Date} maxDate
 * @property {Date} selectedDate
 * @property {Date} rangeDate
 * @property {Date} defaultDate
 */

/**
 * Get an object of the properties and elements belonging directly to the given
 * date picker component.
 *
 * @param {HTMLElement} el the element within the date picker
 * @returns {DatePickerContext} elements
 */


var getDatePickerContext = function getDatePickerContext(el) {
  var datePickerEl = el.closest(DATE_PICKER);

  if (!datePickerEl) {
    throw new Error("Element is missing outer ".concat(DATE_PICKER));
  }

  var internalInputEl = datePickerEl.querySelector(DATE_PICKER_INTERNAL_INPUT);
  var externalInputEl = datePickerEl.querySelector(DATE_PICKER_EXTERNAL_INPUT);
  var calendarEl = datePickerEl.querySelector(DATE_PICKER_CALENDAR);
  var toggleBtnEl = datePickerEl.querySelector(DATE_PICKER_BUTTON);
  var statusEl = datePickerEl.querySelector(DATE_PICKER_STATUS);
  var firstYearChunkEl = datePickerEl.querySelector(CALENDAR_YEAR);
  var inputDate = parseDateString(externalInputEl.value, DEFAULT_EXTERNAL_DATE_FORMAT, true);
  var selectedDate = parseDateString(internalInputEl.value);
  var calendarDate = parseDateString(calendarEl.dataset.value);
  var minDate = parseDateString(datePickerEl.dataset.minDate);
  var maxDate = parseDateString(datePickerEl.dataset.maxDate);
  var rangeDate = parseDateString(datePickerEl.dataset.rangeDate);
  var defaultDate = parseDateString(datePickerEl.dataset.defaultDate);

  if (minDate && maxDate && minDate > maxDate) {
    throw new Error("Minimum date cannot be after maximum date");
  }

  return {
    calendarDate: calendarDate,
    minDate: minDate,
    toggleBtnEl: toggleBtnEl,
    selectedDate: selectedDate,
    maxDate: maxDate,
    firstYearChunkEl: firstYearChunkEl,
    datePickerEl: datePickerEl,
    inputDate: inputDate,
    internalInputEl: internalInputEl,
    externalInputEl: externalInputEl,
    calendarEl: calendarEl,
    rangeDate: rangeDate,
    defaultDate: defaultDate,
    statusEl: statusEl
  };
};
/**
 * Disable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */


var disable = function disable(el) {
  var _getDatePickerContext = getDatePickerContext(el),
      externalInputEl = _getDatePickerContext.externalInputEl,
      toggleBtnEl = _getDatePickerContext.toggleBtnEl;

  toggleBtnEl.disabled = true;
  externalInputEl.disabled = true;
};
/**
 * Enable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */


var enable = function enable(el) {
  var _getDatePickerContext2 = getDatePickerContext(el),
      externalInputEl = _getDatePickerContext2.externalInputEl,
      toggleBtnEl = _getDatePickerContext2.toggleBtnEl;

  toggleBtnEl.disabled = false;
  externalInputEl.disabled = false;
}; // #region Validation

/**
 * Validate the value in the input as a valid date of format D/M/YYYY
 *
 * @param {HTMLElement} el An element within the date picker component
 */


var isDateInputInvalid = function isDateInputInvalid(el) {
  var _getDatePickerContext3 = getDatePickerContext(el),
      externalInputEl = _getDatePickerContext3.externalInputEl,
      minDate = _getDatePickerContext3.minDate,
      maxDate = _getDatePickerContext3.maxDate;

  var dateString = externalInputEl.value;
  var isInvalid = false;

  if (dateString) {
    isInvalid = true;
    var dateStringParts = dateString.split("/");

    var _dateStringParts$map = dateStringParts.map(function (str) {
      var value;
      var parsed = parseInt(str, 10);
      if (!Number.isNaN(parsed)) value = parsed;
      return value;
    }),
        _dateStringParts$map2 = _slicedToArray(_dateStringParts$map, 3),
        day = _dateStringParts$map2[0],
        month = _dateStringParts$map2[1],
        year = _dateStringParts$map2[2];

    if (month && day && year != null) {
      var checkDate = setDate(year, month - 1, day);

      if (checkDate.getMonth() === month - 1 && checkDate.getDate() === day && checkDate.getFullYear() === year && dateStringParts[2].length === 4 && isDateWithinMinAndMax(checkDate, minDate, maxDate)) {
        isInvalid = false;
      }
    }
  }

  return isInvalid;
};
/**
 * Validate the value in the input as a valid date of format M/D/YYYY
 *
 * @param {HTMLElement} el An element within the date picker component
 */


var validateDateInput = function validateDateInput(el) {
  var _getDatePickerContext4 = getDatePickerContext(el),
      externalInputEl = _getDatePickerContext4.externalInputEl;

  var isInvalid = isDateInputInvalid(externalInputEl);

  if (isInvalid && !externalInputEl.validationMessage) {
    externalInputEl.setCustomValidity(VALIDATION_MESSAGE);
  }

  if (!isInvalid && externalInputEl.validationMessage === VALIDATION_MESSAGE) {
    externalInputEl.setCustomValidity("");
  }
}; // #endregion Validation

/**
 * Enable the date picker component
 *
 * @param {HTMLElement} el An element within the date picker component
 */


var reconcileInputValues = function reconcileInputValues(el) {
  var _getDatePickerContext5 = getDatePickerContext(el),
      internalInputEl = _getDatePickerContext5.internalInputEl,
      inputDate = _getDatePickerContext5.inputDate;

  var newValue = "";

  if (inputDate && !isDateInputInvalid(el)) {
    newValue = formatDate(inputDate);
  }

  if (internalInputEl.value !== newValue) {
    changeElementValue(internalInputEl, newValue);
  }
};
/**
 * Select the value of the date picker inputs.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @param {string} dateString The date string to update in YYYY-MM-DD format
 */


var setCalendarValue = function setCalendarValue(el, dateString) {
  var parsedDate = parseDateString(dateString);

  if (parsedDate) {
    var formattedDate = formatDate(parsedDate, DEFAULT_EXTERNAL_DATE_FORMAT);

    var _getDatePickerContext6 = getDatePickerContext(el),
        datePickerEl = _getDatePickerContext6.datePickerEl,
        internalInputEl = _getDatePickerContext6.internalInputEl,
        externalInputEl = _getDatePickerContext6.externalInputEl;

    changeElementValue(internalInputEl, dateString);
    changeElementValue(externalInputEl, formattedDate);
    validateDateInput(datePickerEl);
  }
};
/**
 * Enhance an input with the date picker elements
 *
 * @param {HTMLElement} el The initial wrapping element of the date picker component
 */


var enhanceDatePicker = function enhanceDatePicker(el) {
  var datePickerEl = el.closest(DATE_PICKER);
  var defaultValue = datePickerEl.dataset.defaultValue;
  var internalInputEl = datePickerEl.querySelector("input");

  if (!internalInputEl) {
    throw new Error("".concat(DATE_PICKER, " is missing inner input"));
  }

  var minDate = parseDateString(datePickerEl.dataset.minDate || internalInputEl.getAttribute("min"));
  datePickerEl.dataset.minDate = minDate ? formatDate(minDate) : DEFAULT_MIN_DATE;
  var maxDate = parseDateString(datePickerEl.dataset.maxDate || internalInputEl.getAttribute("max"));

  if (maxDate) {
    datePickerEl.dataset.maxDate = formatDate(maxDate);
  }

  var calendarWrapper = document.createElement("div");
  calendarWrapper.classList.add(DATE_PICKER_WRAPPER_CLASS);
  calendarWrapper.tabIndex = "-1";
  var externalInputEl = internalInputEl.cloneNode();
  externalInputEl.classList.add(DATE_PICKER_EXTERNAL_INPUT_CLASS);
  externalInputEl.type = "text";
  externalInputEl.name = "";
  calendarWrapper.appendChild(externalInputEl);
  calendarWrapper.insertAdjacentHTML("beforeend", ["<button type=\"button\" class=\"".concat(DATE_PICKER_BUTTON_CLASS, "\" aria-haspopup=\"true\" aria-label=\"").concat(text.open_calendar, "\">&nbsp;</button>"), "<div class=\"".concat(DATE_PICKER_CALENDAR_CLASS, "\" role=\"dialog\" aria-modal=\"true\" hidden></div>"), "<div class=\"sr-only ".concat(DATE_PICKER_STATUS_CLASS, "\" role=\"status\" aria-live=\"polite\"></div>")].join(""));
  internalInputEl.setAttribute("aria-hidden", "true");
  internalInputEl.setAttribute("tabindex", "-1");
  internalInputEl.classList.add("sr-only", DATE_PICKER_INTERNAL_INPUT_CLASS);
  internalInputEl.removeAttribute('id');
  internalInputEl.required = false;
  datePickerEl.appendChild(calendarWrapper);
  datePickerEl.classList.add(DATE_PICKER_INITIALIZED_CLASS);

  if (defaultValue) {
    setCalendarValue(datePickerEl, defaultValue);
  }

  if (internalInputEl.disabled) {
    disable(datePickerEl);
    internalInputEl.disabled = false;
  }

  if (externalInputEl.value) {
    validateDateInput(externalInputEl);
  }
}; // #region Calendar - Date Selection View

/**
 * render the calendar.
 *
 * @param {HTMLElement} el An element within the date picker component
 * @param {Date} _dateToDisplay a date to render on the calendar
 * @returns {HTMLElement} a reference to the new calendar element
 */


var renderCalendar = function renderCalendar(el, _dateToDisplay) {
  var _getDatePickerContext7 = getDatePickerContext(el),
      datePickerEl = _getDatePickerContext7.datePickerEl,
      calendarEl = _getDatePickerContext7.calendarEl,
      statusEl = _getDatePickerContext7.statusEl,
      selectedDate = _getDatePickerContext7.selectedDate,
      maxDate = _getDatePickerContext7.maxDate,
      minDate = _getDatePickerContext7.minDate,
      rangeDate = _getDatePickerContext7.rangeDate;

  var todaysDate = today();
  var dateToDisplay = _dateToDisplay || todaysDate;
  var calendarWasHidden = calendarEl.hidden;
  var focusedDate = addDays(dateToDisplay, 0);
  var focusedMonth = dateToDisplay.getMonth();
  var focusedYear = dateToDisplay.getFullYear();
  var prevMonth = subMonths(dateToDisplay, 1);
  var nextMonth = addMonths(dateToDisplay, 1);
  var currentFormattedDate = formatDate(dateToDisplay);
  var firstOfMonth = startOfMonth(dateToDisplay);
  var prevButtonsDisabled = isSameMonth(dateToDisplay, minDate);
  var nextButtonsDisabled = isSameMonth(dateToDisplay, maxDate);
  var rangeConclusionDate = selectedDate || dateToDisplay;
  var rangeStartDate = rangeDate && min(rangeConclusionDate, rangeDate);
  var rangeEndDate = rangeDate && max(rangeConclusionDate, rangeDate);
  var withinRangeStartDate = rangeDate && addDays(rangeStartDate, 1);
  var withinRangeEndDate = rangeDate && subDays(rangeEndDate, 1);
  var monthLabel = MONTH_LABELS[focusedMonth];

  var generateDateHtml = function generateDateHtml(dateToRender) {
    var classes = [CALENDAR_DATE_CLASS];
    var day = dateToRender.getDate();
    var month = dateToRender.getMonth();
    var year = dateToRender.getFullYear();
    var dayOfWeek = dateToRender.getDay();
    var formattedDate = formatDate(dateToRender);
    var tabindex = "-1";
    var isDisabled = !isDateWithinMinAndMax(dateToRender, minDate, maxDate);
    var isSelected = isSameDay(dateToRender, selectedDate);

    if (isSameMonth(dateToRender, prevMonth)) {
      classes.push(CALENDAR_DATE_PREVIOUS_MONTH_CLASS);
    }

    if (isSameMonth(dateToRender, focusedDate)) {
      classes.push(CALENDAR_DATE_CURRENT_MONTH_CLASS);
    }

    if (isSameMonth(dateToRender, nextMonth)) {
      classes.push(CALENDAR_DATE_NEXT_MONTH_CLASS);
    }

    if (isSelected) {
      classes.push(CALENDAR_DATE_SELECTED_CLASS);
    }

    if (isSameDay(dateToRender, todaysDate)) {
      classes.push(CALENDAR_DATE_TODAY_CLASS);
    }

    if (rangeDate) {
      if (isSameDay(dateToRender, rangeDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_CLASS);
      }

      if (isSameDay(dateToRender, rangeStartDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_START_CLASS);
      }

      if (isSameDay(dateToRender, rangeEndDate)) {
        classes.push(CALENDAR_DATE_RANGE_DATE_END_CLASS);
      }

      if (isDateWithinMinAndMax(dateToRender, withinRangeStartDate, withinRangeEndDate)) {
        classes.push(CALENDAR_DATE_WITHIN_RANGE_CLASS);
      }
    }

    if (isSameDay(dateToRender, focusedDate)) {
      tabindex = "0";
      classes.push(CALENDAR_DATE_FOCUSED_CLASS);
    }

    var monthStr = MONTH_LABELS[month];
    var dayStr = DAY_OF_WEEK_LABELS[dayOfWeek];
    var ariaLabelDate = text.aria_label_date.replace(/{dayStr}/, dayStr).replace(/{day}/, day).replace(/{monthStr}/, monthStr).replace(/{year}/, year);
    return "<button\n      type=\"button\"\n      tabindex=\"".concat(tabindex, "\"\n      class=\"").concat(classes.join(" "), "\" \n      data-day=\"").concat(day, "\" \n      data-month=\"").concat(month + 1, "\" \n      data-year=\"").concat(year, "\" \n      data-value=\"").concat(formattedDate, "\"\n      aria-label=\"").concat(ariaLabelDate, "\"\n      aria-selected=\"").concat(isSelected ? "true" : "false", "\"\n      ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n    >").concat(day, "</button>");
  }; // set date to first rendered day


  dateToDisplay = startOfWeek(firstOfMonth);
  var days = [];

  while (days.length < 28 || dateToDisplay.getMonth() === focusedMonth || days.length % 7 !== 0) {
    days.push(generateDateHtml(dateToDisplay));
    dateToDisplay = addDays(dateToDisplay, 1);
  }

  var datesHtml = listToGridHtml(days, 7);
  var newCalendar = calendarEl.cloneNode();
  newCalendar.dataset.value = currentFormattedDate;
  newCalendar.style.top = "".concat(datePickerEl.offsetHeight, "px");
  newCalendar.hidden = false;
  var content = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_DATE_PICKER_CLASS, "\">\n      <div class=\"").concat(CALENDAR_ROW_CLASS, "\">\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_YEAR_CLASS, "\"\n            aria-label=\"").concat(text.previous_year, "\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_MONTH_CLASS, "\"\n            aria-label=\"").concat(text.previous_month, "\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_MONTH_LABEL_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_MONTH_SELECTION_CLASS, "\" aria-label=\"").concat(monthLabel, ". ").concat(text.select_month, ".\"\n          >").concat(monthLabel, "</button>\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_YEAR_SELECTION_CLASS, "\" aria-label=\"").concat(focusedYear, ". ").concat(text.select_year, ".\"\n          >").concat(focusedYear, "</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_MONTH_CLASS, "\"\n            aria-label=\"").concat(text.next_month, "\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_YEAR_CLASS, "\"\n            aria-label=\"").concat(text.next_year, "\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n      </div>\n      <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <thead>\n          <tr>");

  for (var d in DAY_OF_WEEK_LABELS) {
    content += "<th class=\"".concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"").concat(DAY_OF_WEEK_LABELS[d], "\">").concat(DAY_OF_WEEK_LABELS[d].charAt(0), "</th>");
  }

  content += "</tr>\n        </thead>\n        <tbody>\n          ".concat(datesHtml, "\n        </tbody>\n      </table>\n    </div>");
  newCalendar.innerHTML = content;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  datePickerEl.classList.add(DATE_PICKER_ACTIVE_CLASS);
  var statuses = [];

  if (isSameDay(selectedDate, focusedDate)) {
    statuses.push(text.date_selected);
  }

  if (calendarWasHidden) {
    statuses.push(text.guide);
    statusEl.textContent = "";
  } else {
    statuses.push("".concat(monthLabel, " ").concat(focusedYear));
  }

  statusEl.textContent = statuses.join(". ");
  return newCalendar;
};
/**
 * Navigate back one year and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */


var displayPreviousYear = function displayPreviousYear(_buttonEl) {
  if (_buttonEl.disabled) return;

  var _getDatePickerContext8 = getDatePickerContext(_buttonEl),
      calendarEl = _getDatePickerContext8.calendarEl,
      calendarDate = _getDatePickerContext8.calendarDate,
      minDate = _getDatePickerContext8.minDate,
      maxDate = _getDatePickerContext8.maxDate;

  var date = subYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR);

  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }

  nextToFocus.focus();
};
/**
 * Navigate back one month and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */


var displayPreviousMonth = function displayPreviousMonth(_buttonEl) {
  if (_buttonEl.disabled) return;

  var _getDatePickerContext9 = getDatePickerContext(_buttonEl),
      calendarEl = _getDatePickerContext9.calendarEl,
      calendarDate = _getDatePickerContext9.calendarDate,
      minDate = _getDatePickerContext9.minDate,
      maxDate = _getDatePickerContext9.maxDate;

  var date = subMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_MONTH);

  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }

  nextToFocus.focus();
};
/**
 * Navigate forward one month and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */


var displayNextMonth = function displayNextMonth(_buttonEl) {
  if (_buttonEl.disabled) return;

  var _getDatePickerContext10 = getDatePickerContext(_buttonEl),
      calendarEl = _getDatePickerContext10.calendarEl,
      calendarDate = _getDatePickerContext10.calendarDate,
      minDate = _getDatePickerContext10.minDate,
      maxDate = _getDatePickerContext10.maxDate;

  var date = addMonths(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_MONTH);

  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }

  nextToFocus.focus();
};
/**
 * Navigate forward one year and display the calendar.
 *
 * @param {HTMLButtonElement} _buttonEl An element within the date picker component
 */


var displayNextYear = function displayNextYear(_buttonEl) {
  if (_buttonEl.disabled) return;

  var _getDatePickerContext11 = getDatePickerContext(_buttonEl),
      calendarEl = _getDatePickerContext11.calendarEl,
      calendarDate = _getDatePickerContext11.calendarDate,
      minDate = _getDatePickerContext11.minDate,
      maxDate = _getDatePickerContext11.maxDate;

  var date = addYears(calendarDate, 1);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR);

  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_DATE_PICKER);
  }

  nextToFocus.focus();
};
/**
 * Hide the calendar of a date picker component.
 *
 * @param {HTMLElement} el An element within the date picker component
 */


var hideCalendar = function hideCalendar(el) {
  var _getDatePickerContext12 = getDatePickerContext(el),
      datePickerEl = _getDatePickerContext12.datePickerEl,
      calendarEl = _getDatePickerContext12.calendarEl,
      statusEl = _getDatePickerContext12.statusEl;

  datePickerEl.classList.remove(DATE_PICKER_ACTIVE_CLASS);
  calendarEl.hidden = true;
  statusEl.textContent = "";
};
/**
 * Select a date within the date picker component.
 *
 * @param {HTMLButtonElement} calendarDateEl A date element within the date picker component
 */


var selectDate = function selectDate(calendarDateEl) {
  if (calendarDateEl.disabled) return;

  var _getDatePickerContext13 = getDatePickerContext(calendarDateEl),
      datePickerEl = _getDatePickerContext13.datePickerEl,
      externalInputEl = _getDatePickerContext13.externalInputEl;

  setCalendarValue(calendarDateEl, calendarDateEl.dataset.value);
  hideCalendar(datePickerEl);
  externalInputEl.focus();
};
/**
 * Toggle the calendar.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */


var toggleCalendar = function toggleCalendar(el) {
  if (el.disabled) return;

  var _getDatePickerContext14 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext14.calendarEl,
      inputDate = _getDatePickerContext14.inputDate,
      minDate = _getDatePickerContext14.minDate,
      maxDate = _getDatePickerContext14.maxDate,
      defaultDate = _getDatePickerContext14.defaultDate;

  if (calendarEl.hidden) {
    var dateToDisplay = keepDateBetweenMinAndMax(inputDate || defaultDate || today(), minDate, maxDate);
    var newCalendar = renderCalendar(calendarEl, dateToDisplay);
    newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
  } else {
    hideCalendar(el);
  }
};
/**
 * Update the calendar when visible.
 *
 * @param {HTMLElement} el an element within the date picker
 */


var updateCalendarIfVisible = function updateCalendarIfVisible(el) {
  var _getDatePickerContext15 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext15.calendarEl,
      inputDate = _getDatePickerContext15.inputDate,
      minDate = _getDatePickerContext15.minDate,
      maxDate = _getDatePickerContext15.maxDate;

  var calendarShown = !calendarEl.hidden;

  if (calendarShown && inputDate) {
    var dateToDisplay = keepDateBetweenMinAndMax(inputDate, minDate, maxDate);
    renderCalendar(calendarEl, dateToDisplay);
  }
}; // #endregion Calendar - Date Selection View
// #region Calendar - Month Selection View

/**
 * Display the month selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @returns {HTMLElement} a reference to the new calendar element
 */


var displayMonthSelection = function displayMonthSelection(el, monthToDisplay) {
  var _getDatePickerContext16 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext16.calendarEl,
      statusEl = _getDatePickerContext16.statusEl,
      calendarDate = _getDatePickerContext16.calendarDate,
      minDate = _getDatePickerContext16.minDate,
      maxDate = _getDatePickerContext16.maxDate;

  var selectedMonth = calendarDate.getMonth();
  var focusedMonth = monthToDisplay == null ? selectedMonth : monthToDisplay;
  var months = MONTH_LABELS.map(function (month, index) {
    var monthToCheck = setMonth(calendarDate, index);
    var isDisabled = isDatesMonthOutsideMinOrMax(monthToCheck, minDate, maxDate);
    var tabindex = "-1";
    var classes = [CALENDAR_MONTH_CLASS];
    var isSelected = index === selectedMonth;

    if (index === focusedMonth) {
      tabindex = "0";
      classes.push(CALENDAR_MONTH_FOCUSED_CLASS);
    }

    if (isSelected) {
      classes.push(CALENDAR_MONTH_SELECTED_CLASS);
    }

    return "<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(index, "\"\n        data-label=\"").concat(month, "\"\n        aria-selected=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(month, "</button>");
  });
  var monthsHtml = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_MONTH_PICKER_CLASS, "\">\n    <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n      <tbody>\n        ").concat(listToGridHtml(months, 3), "\n      </tbody>\n    </table>\n  </div>");
  var newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = monthsHtml;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  statusEl.textContent = text.months_displayed;
  return newCalendar;
};
/**
 * Select a month in the date picker component.
 *
 * @param {HTMLButtonElement} monthEl An month element within the date picker component
 */


var selectMonth = function selectMonth(monthEl) {
  if (monthEl.disabled) return;

  var _getDatePickerContext17 = getDatePickerContext(monthEl),
      calendarEl = _getDatePickerContext17.calendarEl,
      calendarDate = _getDatePickerContext17.calendarDate,
      minDate = _getDatePickerContext17.minDate,
      maxDate = _getDatePickerContext17.maxDate;

  var selectedMonth = parseInt(monthEl.dataset.value, 10);
  var date = setMonth(calendarDate, selectedMonth);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
}; // #endregion Calendar - Month Selection View
// #region Calendar - Year Selection View

/**
 * Display the year selection screen in the date picker.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 * @param {number} yearToDisplay year to display in year selection
 * @returns {HTMLElement} a reference to the new calendar element
 */


var displayYearSelection = function displayYearSelection(el, yearToDisplay) {
  var _getDatePickerContext18 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext18.calendarEl,
      statusEl = _getDatePickerContext18.statusEl,
      calendarDate = _getDatePickerContext18.calendarDate,
      minDate = _getDatePickerContext18.minDate,
      maxDate = _getDatePickerContext18.maxDate;

  var selectedYear = calendarDate.getFullYear();
  var focusedYear = yearToDisplay == null ? selectedYear : yearToDisplay;
  var yearToChunk = focusedYear;
  yearToChunk -= yearToChunk % YEAR_CHUNK;
  yearToChunk = Math.max(0, yearToChunk);
  var prevYearChunkDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearToChunk - 1), minDate, maxDate);
  var nextYearChunkDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearToChunk + YEAR_CHUNK), minDate, maxDate);
  var years = [];
  var yearIndex = yearToChunk;

  while (years.length < YEAR_CHUNK) {
    var isDisabled = isDatesYearOutsideMinOrMax(setYear(calendarDate, yearIndex), minDate, maxDate);
    var tabindex = "-1";
    var classes = [CALENDAR_YEAR_CLASS];
    var isSelected = yearIndex === selectedYear;

    if (yearIndex === focusedYear) {
      tabindex = "0";
      classes.push(CALENDAR_YEAR_FOCUSED_CLASS);
    }

    if (isSelected) {
      classes.push(CALENDAR_YEAR_SELECTED_CLASS);
    }

    years.push("<button \n        type=\"button\"\n        tabindex=\"".concat(tabindex, "\"\n        class=\"").concat(classes.join(" "), "\" \n        data-value=\"").concat(yearIndex, "\"\n        aria-selected=\"").concat(isSelected ? "true" : "false", "\"\n        ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n      >").concat(yearIndex, "</button>"));
    yearIndex += 1;
  }

  var yearsHtml = listToGridHtml(years, 3);
  var ariaLabelPreviousYears = text.previous_years.replace(/{years}/, YEAR_CHUNK);
  var ariaLabelNextYears = text.next_years.replace(/{years}/, YEAR_CHUNK);
  var announceYears = text.years_displayed.replace(/{start}/, yearToChunk).replace(/{end}/, yearToChunk + YEAR_CHUNK - 1);
  var newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_YEAR_PICKER_CLASS, "\">\n    <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <tbody>\n          <tr>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"").concat(ariaLabelPreviousYears, "\"\n                ").concat(prevYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n            <td colspan=\"3\">\n              <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n                <tbody>\n                  ").concat(yearsHtml, "\n                </tbody>\n              </table>\n            </td>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_NEXT_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"").concat(ariaLabelNextYears, "\"\n                ").concat(nextYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>");
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  statusEl.textContent = announceYears;
  return newCalendar;
};
/**
 * Navigate back by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */


var displayPreviousYearChunk = function displayPreviousYearChunk(el) {
  if (el.disabled) return;

  var _getDatePickerContext19 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext19.calendarEl,
      calendarDate = _getDatePickerContext19.calendarDate,
      minDate = _getDatePickerContext19.minDate,
      maxDate = _getDatePickerContext19.maxDate;

  var yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
  var selectedYear = parseInt(yearEl.textContent, 10);
  var adjustedYear = selectedYear - YEAR_CHUNK;
  adjustedYear = Math.max(0, adjustedYear);
  var date = setYear(calendarDate, adjustedYear);
  var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
  var nextToFocus = newCalendar.querySelector(CALENDAR_PREVIOUS_YEAR_CHUNK);

  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_YEAR_PICKER);
  }

  nextToFocus.focus();
};
/**
 * Navigate forward by years and display the year selection screen.
 *
 * @param {HTMLButtonElement} el An element within the date picker component
 */


var displayNextYearChunk = function displayNextYearChunk(el) {
  if (el.disabled) return;

  var _getDatePickerContext20 = getDatePickerContext(el),
      calendarEl = _getDatePickerContext20.calendarEl,
      calendarDate = _getDatePickerContext20.calendarDate,
      minDate = _getDatePickerContext20.minDate,
      maxDate = _getDatePickerContext20.maxDate;

  var yearEl = calendarEl.querySelector(CALENDAR_YEAR_FOCUSED);
  var selectedYear = parseInt(yearEl.textContent, 10);
  var adjustedYear = selectedYear + YEAR_CHUNK;
  adjustedYear = Math.max(0, adjustedYear);
  var date = setYear(calendarDate, adjustedYear);
  var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
  var nextToFocus = newCalendar.querySelector(CALENDAR_NEXT_YEAR_CHUNK);

  if (nextToFocus.disabled) {
    nextToFocus = newCalendar.querySelector(CALENDAR_YEAR_PICKER);
  }

  nextToFocus.focus();
};
/**
 * Select a year in the date picker component.
 *
 * @param {HTMLButtonElement} yearEl A year element within the date picker component
 */


var selectYear = function selectYear(yearEl) {
  if (yearEl.disabled) return;

  var _getDatePickerContext21 = getDatePickerContext(yearEl),
      calendarEl = _getDatePickerContext21.calendarEl,
      calendarDate = _getDatePickerContext21.calendarDate,
      minDate = _getDatePickerContext21.minDate,
      maxDate = _getDatePickerContext21.maxDate;

  var selectedYear = parseInt(yearEl.innerHTML, 10);
  var date = setYear(calendarDate, selectedYear);
  date = keepDateBetweenMinAndMax(date, minDate, maxDate);
  var newCalendar = renderCalendar(calendarEl, date);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
}; // #endregion Calendar - Year Selection View
// #region Calendar Event Handling

/**
 * Hide the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */


var handleEscapeFromCalendar = function handleEscapeFromCalendar(event) {
  var _getDatePickerContext22 = getDatePickerContext(event.target),
      datePickerEl = _getDatePickerContext22.datePickerEl,
      externalInputEl = _getDatePickerContext22.externalInputEl;

  hideCalendar(datePickerEl);
  externalInputEl.focus();
  event.preventDefault();
}; // #endregion Calendar Event Handling
// #region Calendar Date Event Handling

/**
 * Adjust the date and display the calendar if needed.
 *
 * @param {function} adjustDateFn function that returns the adjusted date
 */


var adjustCalendar = function adjustCalendar(adjustDateFn) {
  return function (event) {
    var _getDatePickerContext23 = getDatePickerContext(event.target),
        calendarEl = _getDatePickerContext23.calendarEl,
        calendarDate = _getDatePickerContext23.calendarDate,
        minDate = _getDatePickerContext23.minDate,
        maxDate = _getDatePickerContext23.maxDate;

    var date = adjustDateFn(calendarDate);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);

    if (!isSameDay(calendarDate, cappedDate)) {
      var newCalendar = renderCalendar(calendarEl, cappedDate);
      newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
    }

    event.preventDefault();
  };
};
/**
 * Navigate back one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */


var handleUpFromDate = adjustCalendar(function (date) {
  return subWeeks(date, 1);
});
/**
 * Navigate forward one week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleDownFromDate = adjustCalendar(function (date) {
  return addWeeks(date, 1);
});
/**
 * Navigate back one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleLeftFromDate = adjustCalendar(function (date) {
  return subDays(date, 1);
});
/**
 * Navigate forward one day and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleRightFromDate = adjustCalendar(function (date) {
  return addDays(date, 1);
});
/**
 * Navigate to the start of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleHomeFromDate = adjustCalendar(function (date) {
  return startOfWeek(date);
});
/**
 * Navigate to the end of the week and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleEndFromDate = adjustCalendar(function (date) {
  return endOfWeek(date);
});
/**
 * Navigate forward one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handlePageDownFromDate = adjustCalendar(function (date) {
  return addMonths(date, 1);
});
/**
 * Navigate back one month and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handlePageUpFromDate = adjustCalendar(function (date) {
  return subMonths(date, 1);
});
/**
 * Navigate forward one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleShiftPageDownFromDate = adjustCalendar(function (date) {
  return addYears(date, 1);
});
/**
 * Navigate back one year and display the calendar.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleShiftPageUpFromDate = adjustCalendar(function (date) {
  return subYears(date, 1);
});
/**
 * display the calendar for the mousemove date.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} dateEl A date element within the date picker component
 */

var handleMousemoveFromDate = function handleMousemoveFromDate(dateEl) {
  if (dateEl.disabled) return;
  var calendarEl = dateEl.closest(DATE_PICKER_CALENDAR);
  var currentCalendarDate = calendarEl.dataset.value;
  var hoverDate = dateEl.dataset.value;
  if (hoverDate === currentCalendarDate) return;
  var dateToDisplay = parseDateString(hoverDate);
  var newCalendar = renderCalendar(calendarEl, dateToDisplay);
  newCalendar.querySelector(CALENDAR_DATE_FOCUSED).focus();
}; // #endregion Calendar Date Event Handling
// #region Calendar Month Event Handling

/**
 * Adjust the month and display the month selection screen if needed.
 *
 * @param {function} adjustMonthFn function that returns the adjusted month
 */


var adjustMonthSelectionScreen = function adjustMonthSelectionScreen(adjustMonthFn) {
  return function (event) {
    var monthEl = event.target;
    var selectedMonth = parseInt(monthEl.dataset.value, 10);

    var _getDatePickerContext24 = getDatePickerContext(monthEl),
        calendarEl = _getDatePickerContext24.calendarEl,
        calendarDate = _getDatePickerContext24.calendarDate,
        minDate = _getDatePickerContext24.minDate,
        maxDate = _getDatePickerContext24.maxDate;

    var currentDate = setMonth(calendarDate, selectedMonth);
    var adjustedMonth = adjustMonthFn(selectedMonth);
    adjustedMonth = Math.max(0, Math.min(11, adjustedMonth));
    var date = setMonth(calendarDate, adjustedMonth);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);

    if (!isSameMonth(currentDate, cappedDate)) {
      var newCalendar = displayMonthSelection(calendarEl, cappedDate.getMonth());
      newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
    }

    event.preventDefault();
  };
};
/**
 * Navigate back three months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */


var handleUpFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - 3;
});
/**
 * Navigate forward three months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleDownFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 3;
});
/**
 * Navigate back one month and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleLeftFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - 1;
});
/**
 * Navigate forward one month and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleRightFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 1;
});
/**
 * Navigate to the start of the row of months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleHomeFromMonth = adjustMonthSelectionScreen(function (month) {
  return month - month % 3;
});
/**
 * Navigate to the end of the row of months and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleEndFromMonth = adjustMonthSelectionScreen(function (month) {
  return month + 2 - month % 3;
});
/**
 * Navigate to the last month (December) and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handlePageDownFromMonth = adjustMonthSelectionScreen(function () {
  return 11;
});
/**
 * Navigate to the first month (January) and display the month selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handlePageUpFromMonth = adjustMonthSelectionScreen(function () {
  return 0;
});
/**
 * update the focus on a month when the mouse moves.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} monthEl A month element within the date picker component
 */

var handleMousemoveFromMonth = function handleMousemoveFromMonth(monthEl) {
  if (monthEl.disabled) return;
  if (monthEl.classList.contains(CALENDAR_MONTH_FOCUSED_CLASS)) return;
  var focusMonth = parseInt(monthEl.dataset.value, 10);
  var newCalendar = displayMonthSelection(monthEl, focusMonth);
  newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
}; // #endregion Calendar Month Event Handling
// #region Calendar Year Event Handling

/**
 * Adjust the year and display the year selection screen if needed.
 *
 * @param {function} adjustYearFn function that returns the adjusted year
 */


var adjustYearSelectionScreen = function adjustYearSelectionScreen(adjustYearFn) {
  return function (event) {
    var yearEl = event.target;
    var selectedYear = parseInt(yearEl.dataset.value, 10);

    var _getDatePickerContext25 = getDatePickerContext(yearEl),
        calendarEl = _getDatePickerContext25.calendarEl,
        calendarDate = _getDatePickerContext25.calendarDate,
        minDate = _getDatePickerContext25.minDate,
        maxDate = _getDatePickerContext25.maxDate;

    var currentDate = setYear(calendarDate, selectedYear);
    var adjustedYear = adjustYearFn(selectedYear);
    adjustedYear = Math.max(0, adjustedYear);
    var date = setYear(calendarDate, adjustedYear);
    var cappedDate = keepDateBetweenMinAndMax(date, minDate, maxDate);

    if (!isSameYear(currentDate, cappedDate)) {
      var newCalendar = displayYearSelection(calendarEl, cappedDate.getFullYear());
      newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
    }

    event.preventDefault();
  };
};
/**
 * Navigate back three years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */


var handleUpFromYear = adjustYearSelectionScreen(function (year) {
  return year - 3;
});
/**
 * Navigate forward three years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleDownFromYear = adjustYearSelectionScreen(function (year) {
  return year + 3;
});
/**
 * Navigate back one year and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleLeftFromYear = adjustYearSelectionScreen(function (year) {
  return year - 1;
});
/**
 * Navigate forward one year and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleRightFromYear = adjustYearSelectionScreen(function (year) {
  return year + 1;
});
/**
 * Navigate to the start of the row of years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleHomeFromYear = adjustYearSelectionScreen(function (year) {
  return year - year % 3;
});
/**
 * Navigate to the end of the row of years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handleEndFromYear = adjustYearSelectionScreen(function (year) {
  return year + 2 - year % 3;
});
/**
 * Navigate to back 12 years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handlePageUpFromYear = adjustYearSelectionScreen(function (year) {
  return year - YEAR_CHUNK;
});
/**
 * Navigate forward 12 years and display the year selection screen.
 *
 * @param {KeyboardEvent} event the keydown event
 */

var handlePageDownFromYear = adjustYearSelectionScreen(function (year) {
  return year + YEAR_CHUNK;
});
/**
 * update the focus on a year when the mouse moves.
 *
 * @param {MouseEvent} event The mousemove event
 * @param {HTMLButtonElement} dateEl A year element within the date picker component
 */

var handleMousemoveFromYear = function handleMousemoveFromYear(yearEl) {
  if (yearEl.disabled) return;
  if (yearEl.classList.contains(CALENDAR_YEAR_FOCUSED_CLASS)) return;
  var focusYear = parseInt(yearEl.dataset.value, 10);
  var newCalendar = displayYearSelection(yearEl, focusYear);
  newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
}; // #endregion Calendar Year Event Handling
// #region Focus Handling Event Handling


var tabHandler = function tabHandler(focusable) {
  var getFocusableContext = function getFocusableContext(el) {
    var _getDatePickerContext26 = getDatePickerContext(el),
        calendarEl = _getDatePickerContext26.calendarEl;

    var focusableElements = select(focusable, calendarEl);
    var firstTabIndex = 0;
    var lastTabIndex = focusableElements.length - 1;
    var firstTabStop = focusableElements[firstTabIndex];
    var lastTabStop = focusableElements[lastTabIndex];
    var focusIndex = focusableElements.indexOf(activeElement());
    var isLastTab = focusIndex === lastTabIndex;
    var isFirstTab = focusIndex === firstTabIndex;
    var isNotFound = focusIndex === -1;
    return {
      focusableElements: focusableElements,
      isNotFound: isNotFound,
      firstTabStop: firstTabStop,
      isFirstTab: isFirstTab,
      lastTabStop: lastTabStop,
      isLastTab: isLastTab
    };
  };

  return {
    tabAhead: function tabAhead(event) {
      var _getFocusableContext = getFocusableContext(event.target),
          firstTabStop = _getFocusableContext.firstTabStop,
          isLastTab = _getFocusableContext.isLastTab,
          isNotFound = _getFocusableContext.isNotFound;

      if (isLastTab || isNotFound) {
        event.preventDefault();
        firstTabStop.focus();
      }
    },
    tabBack: function tabBack(event) {
      var _getFocusableContext2 = getFocusableContext(event.target),
          lastTabStop = _getFocusableContext2.lastTabStop,
          isFirstTab = _getFocusableContext2.isFirstTab,
          isNotFound = _getFocusableContext2.isNotFound;

      if (isFirstTab || isNotFound) {
        event.preventDefault();
        lastTabStop.focus();
      }
    }
  };
};

var datePickerTabEventHandler = tabHandler(DATE_PICKER_FOCUSABLE);
var monthPickerTabEventHandler = tabHandler(MONTH_PICKER_FOCUSABLE);
var yearPickerTabEventHandler = tabHandler(YEAR_PICKER_FOCUSABLE); // #endregion Focus Handling Event Handling
// #region Date Picker Event Delegation Registration / Component

var datePickerEvents = (_datePickerEvents = {}, _defineProperty(_datePickerEvents, CLICK, (_CLICK = {}, _defineProperty(_CLICK, DATE_PICKER_BUTTON, function () {
  toggleCalendar(this);
}), _defineProperty(_CLICK, CALENDAR_DATE, function () {
  selectDate(this);
}), _defineProperty(_CLICK, CALENDAR_MONTH, function () {
  selectMonth(this);
}), _defineProperty(_CLICK, CALENDAR_YEAR, function () {
  selectYear(this);
}), _defineProperty(_CLICK, CALENDAR_PREVIOUS_MONTH, function () {
  displayPreviousMonth(this);
}), _defineProperty(_CLICK, CALENDAR_NEXT_MONTH, function () {
  displayNextMonth(this);
}), _defineProperty(_CLICK, CALENDAR_PREVIOUS_YEAR, function () {
  displayPreviousYear(this);
}), _defineProperty(_CLICK, CALENDAR_NEXT_YEAR, function () {
  displayNextYear(this);
}), _defineProperty(_CLICK, CALENDAR_PREVIOUS_YEAR_CHUNK, function () {
  displayPreviousYearChunk(this);
}), _defineProperty(_CLICK, CALENDAR_NEXT_YEAR_CHUNK, function () {
  displayNextYearChunk(this);
}), _defineProperty(_CLICK, CALENDAR_MONTH_SELECTION, function () {
  var newCalendar = displayMonthSelection(this);
  newCalendar.querySelector(CALENDAR_MONTH_FOCUSED).focus();
}), _defineProperty(_CLICK, CALENDAR_YEAR_SELECTION, function () {
  var newCalendar = displayYearSelection(this);
  newCalendar.querySelector(CALENDAR_YEAR_FOCUSED).focus();
}), _CLICK)), _defineProperty(_datePickerEvents, "keyup", _defineProperty({}, DATE_PICKER_CALENDAR, function (event) {
  var keydown = this.dataset.keydownKeyCode;

  if ("".concat(event.keyCode) !== keydown) {
    event.preventDefault();
  }
})), _defineProperty(_datePickerEvents, "keydown", (_keydown = {}, _defineProperty(_keydown, DATE_PICKER_EXTERNAL_INPUT, function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    validateDateInput(this);
  }
}), _defineProperty(_keydown, CALENDAR_DATE, (0, _receptor.keymap)({
  Up: handleUpFromDate,
  ArrowUp: handleUpFromDate,
  Down: handleDownFromDate,
  ArrowDown: handleDownFromDate,
  Left: handleLeftFromDate,
  ArrowLeft: handleLeftFromDate,
  Right: handleRightFromDate,
  ArrowRight: handleRightFromDate,
  Home: handleHomeFromDate,
  End: handleEndFromDate,
  PageDown: handlePageDownFromDate,
  PageUp: handlePageUpFromDate,
  "Shift+PageDown": handleShiftPageDownFromDate,
  "Shift+PageUp": handleShiftPageUpFromDate
})), _defineProperty(_keydown, CALENDAR_DATE_PICKER, (0, _receptor.keymap)({
  Tab: datePickerTabEventHandler.tabAhead,
  "Shift+Tab": datePickerTabEventHandler.tabBack
})), _defineProperty(_keydown, CALENDAR_MONTH, (0, _receptor.keymap)({
  Up: handleUpFromMonth,
  ArrowUp: handleUpFromMonth,
  Down: handleDownFromMonth,
  ArrowDown: handleDownFromMonth,
  Left: handleLeftFromMonth,
  ArrowLeft: handleLeftFromMonth,
  Right: handleRightFromMonth,
  ArrowRight: handleRightFromMonth,
  Home: handleHomeFromMonth,
  End: handleEndFromMonth,
  PageDown: handlePageDownFromMonth,
  PageUp: handlePageUpFromMonth
})), _defineProperty(_keydown, CALENDAR_MONTH_PICKER, (0, _receptor.keymap)({
  Tab: monthPickerTabEventHandler.tabAhead,
  "Shift+Tab": monthPickerTabEventHandler.tabBack
})), _defineProperty(_keydown, CALENDAR_YEAR, (0, _receptor.keymap)({
  Up: handleUpFromYear,
  ArrowUp: handleUpFromYear,
  Down: handleDownFromYear,
  ArrowDown: handleDownFromYear,
  Left: handleLeftFromYear,
  ArrowLeft: handleLeftFromYear,
  Right: handleRightFromYear,
  ArrowRight: handleRightFromYear,
  Home: handleHomeFromYear,
  End: handleEndFromYear,
  PageDown: handlePageDownFromYear,
  PageUp: handlePageUpFromYear
})), _defineProperty(_keydown, CALENDAR_YEAR_PICKER, (0, _receptor.keymap)({
  Tab: yearPickerTabEventHandler.tabAhead,
  "Shift+Tab": yearPickerTabEventHandler.tabBack
})), _defineProperty(_keydown, DATE_PICKER_CALENDAR, function (event) {
  this.dataset.keydownKeyCode = event.keyCode;
}), _defineProperty(_keydown, DATE_PICKER, function (event) {
  var keyMap = (0, _receptor.keymap)({
    Escape: handleEscapeFromCalendar
  });
  keyMap(event);
}), _keydown)), _defineProperty(_datePickerEvents, "focusout", (_focusout = {}, _defineProperty(_focusout, DATE_PICKER_EXTERNAL_INPUT, function () {
  validateDateInput(this);
}), _defineProperty(_focusout, DATE_PICKER, function (event) {
  if (!this.contains(event.relatedTarget)) {
    hideCalendar(this);
  }
}), _focusout)), _defineProperty(_datePickerEvents, "input", _defineProperty({}, DATE_PICKER_EXTERNAL_INPUT, function () {
  reconcileInputValues(this);
  updateCalendarIfVisible(this);
})), _datePickerEvents);

if (!isIosDevice()) {
  var _datePickerEvents$mou;

  datePickerEvents.mousemove = (_datePickerEvents$mou = {}, _defineProperty(_datePickerEvents$mou, CALENDAR_DATE_CURRENT_MONTH, function () {
    handleMousemoveFromDate(this);
  }), _defineProperty(_datePickerEvents$mou, CALENDAR_MONTH, function () {
    handleMousemoveFromMonth(this);
  }), _defineProperty(_datePickerEvents$mou, CALENDAR_YEAR, function () {
    handleMousemoveFromYear(this);
  }), _datePickerEvents$mou);
}

var datePicker = behavior(datePickerEvents, {
  init: function init(root) {
    select(DATE_PICKER, root).forEach(function (datePickerEl) {
      if (!datePickerEl.classList.contains(DATE_PICKER_INITIALIZED_CLASS)) {
        enhanceDatePicker(datePickerEl);
      }
    });
  },
  setLanguage: function setLanguage(strings) {
    text = strings;
    MONTH_LABELS = [text.january, text.february, text.march, text.april, text.may, text.june, text.july, text.august, text.september, text.october, text.november, text.december];
    DAY_OF_WEEK_LABELS = [text.monday, text.tuesday, text.wednesday, text.thursday, text.friday, text.saturday, text.sunday];
  },
  getDatePickerContext: getDatePickerContext,
  disable: disable,
  enable: enable,
  isDateInputInvalid: isDateInputInvalid,
  setCalendarValue: setCalendarValue,
  validateDateInput: validateDateInput,
  renderCalendar: renderCalendar,
  updateCalendarIfVisible: updateCalendarIfVisible
}); // #endregion Date Picker Event Delegation Registration / Component

module.exports = datePicker;

},{"../config":90,"../events":92,"../utils/active-element":99,"../utils/behavior":100,"../utils/is-ios-device":103,"../utils/select":104,"receptor":70}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dropdown = _interopRequireDefault(require("./dropdown"));

require("../polyfills/Function/prototype/bind");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Add functionality to sorting variant of Overflow menu component
 * @param {HTMLElement} container .overflow-menu element
 */
function DropdownSort(container) {
  this.container = container;
  this.button = container.getElementsByClassName('button-overflow-menu')[0]; // if no value is selected, choose first option

  if (!this.container.querySelector('.overflow-list li[aria-selected="true"]')) {
    this.container.querySelectorAll('.overflow-list li')[0].setAttribute('aria-selected', "true");
  }

  this.updateSelectedValue();
}
/**
 * Add click events on overflow menu and options in menu
 */


DropdownSort.prototype.init = function () {
  this.overflowMenu = new _dropdown["default"](this.button).init();
  var sortingOptions = this.container.querySelectorAll('.overflow-list li button');

  for (var s = 0; s < sortingOptions.length; s++) {
    var option = sortingOptions[s];
    option.addEventListener('click', this.onOptionClick.bind(this));
  }
};
/**
 * Update button text to selected value
 */


DropdownSort.prototype.updateSelectedValue = function () {
  var selectedItem = this.container.querySelector('.overflow-list li[aria-selected="true"]');
  this.container.getElementsByClassName('button-overflow-menu')[0].getElementsByClassName('selected-value')[0].innerText = selectedItem.innerText;
};
/**
 * Triggers when choosing option in menu
 * @param {PointerEvent} e
 */


DropdownSort.prototype.onOptionClick = function (e) {
  var li = e.target.parentNode;
  li.parentNode.querySelector('li[aria-selected="true"]').removeAttribute('aria-selected');
  li.setAttribute('aria-selected', 'true');
  var button = li.parentNode.parentNode.parentNode.getElementsByClassName('button-overflow-menu')[0];
  var eventSelected = new Event('fds.dropdown.selected');
  eventSelected.detail = this.target;
  button.dispatchEvent(eventSelected);
  this.updateSelectedValue(); // hide menu

  var overflowMenu = new _dropdown["default"](button);
  overflowMenu.hide();
};

var _default = DropdownSort;
exports["default"] = _default;

},{"../polyfills/Function/prototype/bind":93,"./dropdown":79}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var breakpoints = require('../utils/breakpoints');

var BUTTON = '.button-overflow-menu';
var jsDropdownCollapseModifier = 'js-dropdown--responsive-collapse'; //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).

var TARGET = 'data-js-target';
/**
 * Add functionality to overflow menu component
 * @param {HTMLButtonElement} buttonElement Overflow menu button
 */

function Dropdown(buttonElement) {
  this.buttonElement = buttonElement;
  this.targetEl = null;
  this.responsiveListCollapseEnabled = false;

  if (this.buttonElement === null || this.buttonElement === undefined) {
    throw new Error("Could not find button for overflow menu component.");
  }

  var targetAttr = this.buttonElement.getAttribute(TARGET);

  if (targetAttr === null || targetAttr === undefined) {
    throw new Error('Attribute could not be found on overflow menu component: ' + TARGET);
  }

  var targetEl = document.getElementById(targetAttr.replace('#', ''));

  if (targetEl === null || targetEl === undefined) {
    throw new Error('Panel for overflow menu component could not be found.');
  }

  this.targetEl = targetEl;
}
/**
 * Set click events
 */


Dropdown.prototype.init = function () {
  if (this.buttonElement !== null && this.buttonElement !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
    if (this.buttonElement.parentNode.classList.contains('overflow-menu--md-no-responsive') || this.buttonElement.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
      this.responsiveListCollapseEnabled = true;
    } //Clicked outside dropdown -> close it


    document.getElementsByTagName('body')[0].removeEventListener('click', outsideClose);
    document.getElementsByTagName('body')[0].addEventListener('click', outsideClose); //Clicked on dropdown open button --> toggle it

    this.buttonElement.removeEventListener('click', toggleDropdown);
    this.buttonElement.addEventListener('click', toggleDropdown);
    var $module = this; // set aria-hidden correctly for screenreaders (Tringuide responsive)

    if (this.responsiveListCollapseEnabled) {
      var element = this.buttonElement;

      if (window.IntersectionObserver) {
        // trigger event when button changes visibility
        var observer = new IntersectionObserver(function (entries) {
          // button is visible
          if (entries[0].intersectionRatio) {
            if (element.getAttribute('aria-expanded') === 'false') {
              $module.targetEl.setAttribute('aria-hidden', 'true');
            }
          } else {
            // button is not visible
            if ($module.targetEl.getAttribute('aria-hidden') === 'true') {
              $module.targetEl.setAttribute('aria-hidden', 'false');
            }
          }
        }, {
          root: document.body
        });
        observer.observe(element);
      } else {
        // IE: IntersectionObserver is not supported, so we listen for window resize and grid breakpoint instead
        if (doResponsiveCollapse($module.triggerEl)) {
          // small screen
          if (element.getAttribute('aria-expanded') === 'false') {
            $module.targetEl.setAttribute('aria-hidden', 'true');
          } else {
            $module.targetEl.setAttribute('aria-hidden', 'false');
          }
        } else {
          // Large screen
          $module.targetEl.setAttribute('aria-hidden', 'false');
        }

        window.addEventListener('resize', function () {
          if (doResponsiveCollapse($module.triggerEl)) {
            if (element.getAttribute('aria-expanded') === 'false') {
              $module.targetEl.setAttribute('aria-hidden', 'true');
            } else {
              $module.targetEl.setAttribute('aria-hidden', 'false');
            }
          } else {
            $module.targetEl.setAttribute('aria-hidden', 'false');
          }
        });
      }
    }

    document.removeEventListener('keyup', closeOnEscape);
    document.addEventListener('keyup', closeOnEscape);
  }
};
/**
 * Hide overflow menu
 */


Dropdown.prototype.hide = function () {
  toggle(this.buttonElement);
};
/**
 * Show overflow menu
 */


Dropdown.prototype.show = function () {
  toggle(this.buttonElement);
};

var closeOnEscape = function closeOnEscape(event) {
  var key = event.which || event.keyCode;

  if (key === 27) {
    closeAll(event);
  }
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
/**
 * Close all overflow menus
 * @param {event} event default is null
 */


var closeAll = function closeAll() {
  var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var changed = false;
  var body = document.querySelector('body');
  var overflowMenuEl = document.getElementsByClassName('overflow-menu');

  for (var oi = 0; oi < overflowMenuEl.length; oi++) {
    var currentOverflowMenuEL = overflowMenuEl[oi];
    var triggerEl = currentOverflowMenuEL.querySelector(BUTTON + '[aria-expanded="true"]');

    if (triggerEl !== null) {
      changed = true;
      var targetEl = currentOverflowMenuEL.querySelector('#' + triggerEl.getAttribute(TARGET).replace('#', ''));

      if (targetEl !== null && triggerEl !== null) {
        if (doResponsiveCollapse(triggerEl)) {
          if (triggerEl.getAttribute('aria-expanded') === true) {
            var eventClose = new Event('fds.dropdown.close');
            triggerEl.dispatchEvent(eventClose);
          }

          triggerEl.setAttribute('aria-expanded', 'false');
          targetEl.classList.add('collapsed');
          targetEl.setAttribute('aria-hidden', 'true');
        }
      }
    }
  }

  if (changed && event !== null) {
    event.stopImmediatePropagation();
  }
};

var offset = function offset(el) {
  var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};

var toggleDropdown = function toggleDropdown(event) {
  var forceClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  event.stopPropagation();
  event.preventDefault();
  toggle(this, forceClose);
};

var toggle = function toggle(button) {
  var forceClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var triggerEl = button;
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
      var eventClose = new Event('fds.dropdown.close');
      triggerEl.dispatchEvent(eventClose);
    } else {
      if (!document.getElementsByTagName('body')[0].classList.contains('mobile_nav-active')) {
        closeAll();
      } //open


      triggerEl.setAttribute('aria-expanded', 'true');
      targetEl.classList.remove('collapsed');
      targetEl.setAttribute('aria-hidden', 'false');
      var eventOpen = new Event('fds.dropdown.open');
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

var hasParent = function hasParent(child, parentTagName) {
  if (child.parentNode.tagName === parentTagName) {
    return true;
  } else if (parentTagName !== 'BODY' && child.parentNode.tagName !== 'BODY') {
    return hasParent(child.parentNode, parentTagName);
  } else {
    return false;
  }
};

var outsideClose = function outsideClose(evt) {
  if (!document.getElementsByTagName('body')[0].classList.contains('mobile_nav-active')) {
    if (document.querySelector('body.mobile_nav-active') === null && !evt.target.classList.contains('button-menu-close')) {
      var openDropdowns = document.querySelectorAll(BUTTON + '[aria-expanded=true]');

      for (var i = 0; i < openDropdowns.length; i++) {
        var triggerEl = openDropdowns[i];
        var targetEl = null;
        var targetAttr = triggerEl.getAttribute(TARGET);

        if (targetAttr !== null && targetAttr !== undefined) {
          if (targetAttr.indexOf('#') !== -1) {
            targetAttr = targetAttr.replace('#', '');
          }

          targetEl = document.getElementById(targetAttr);
        }

        if (doResponsiveCollapse(triggerEl) || hasParent(triggerEl, 'HEADER') && !evt.target.classList.contains('overlay')) {
          //closes dropdown when clicked outside
          if (evt.target !== triggerEl) {
            //clicked outside trigger, force close
            triggerEl.setAttribute('aria-expanded', 'false');
            targetEl.classList.add('collapsed');
            targetEl.setAttribute('aria-hidden', 'true');
            var eventClose = new Event('fds.dropdown.close');
            triggerEl.dispatchEvent(eventClose);
          }
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

var _default = Dropdown;
exports["default"] = _default;

},{"../utils/breakpoints":101}],80:[function(require,module,exports){
'use strict';
/**
 * Handle focus on input elements upon clicking link in error message
 * @param {HTMLElement} element Error summary element
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ErrorSummary(element) {
  this.element = element;
}
/**
 * Set events on links in error summary
 */


ErrorSummary.prototype.init = function () {
  if (!this.element) {
    return;
  }

  this.element.focus();
  this.element.addEventListener('click', this.handleClick.bind(this));
};
/**
* Click event handler
*
* @param {MouseEvent} event - Click event
*/


ErrorSummary.prototype.handleClick = function (event) {
  var target = event.target;

  if (this.focusTarget(target)) {
    event.preventDefault();
  }
};
/**
 * Focus the target element
 *
 * By default, the browser will scroll the target into view. Because our labels
 * or legends appear above the input, this means the user will be presented with
 * an input without any context, as the label or legend will be off the top of
 * the screen.
 *
 * Manually handling the click event, scrolling the question into view and then
 * focussing the element solves this.
 *
 * This also results in the label and/or legend being announced correctly in
 * NVDA (as tested in 2018.3.2) - without this only the field type is announced
 * (e.g. "Edit, has autocomplete").
 *
 * @param {HTMLElement} $target - Event target
 * @returns {boolean} True if the target was able to be focussed
 */


ErrorSummary.prototype.focusTarget = function ($target) {
  // If the element that was clicked was not a link, return early
  if ($target.tagName !== 'A' || $target.href === false) {
    return false;
  }

  var inputId = this.getFragmentFromUrl($target.href);
  var $input = document.getElementById(inputId);

  if (!$input) {
    return false;
  }

  var $legendOrLabel = this.getAssociatedLegendOrLabel($input);

  if (!$legendOrLabel) {
    return false;
  } // Scroll the legend or label into view *before* calling focus on the input to
  // avoid extra scrolling in browsers that don't support `preventScroll` (which
  // at time of writing is most of them...)


  $legendOrLabel.scrollIntoView();
  $input.focus({
    preventScroll: true
  });
  return true;
};
/**
 * Get fragment from URL
 *
 * Extract the fragment (everything after the hash) from a URL, but not including
 * the hash.
 *
 * @param {string} url - URL
 * @returns {string} Fragment from URL, without the hash
 */


ErrorSummary.prototype.getFragmentFromUrl = function (url) {
  if (url.indexOf('#') === -1) {
    return false;
  }

  return url.split('#').pop();
};
/**
 * Get associated legend or label
 *
 * Returns the first element that exists from this list:
 *
 * - The `<legend>` associated with the closest `<fieldset>` ancestor, as long
 *   as the top of it is no more than half a viewport height away from the
 *   bottom of the input
 * - The first `<label>` that is associated with the input using for="inputId"
 * - The closest parent `<label>`
 *
 * @param {HTMLElement} $input - The input
 * @returns {HTMLElement} Associated legend or label, or null if no associated
 *                        legend or label can be found
 */


ErrorSummary.prototype.getAssociatedLegendOrLabel = function ($input) {
  var $fieldset = $input.closest('fieldset');

  if ($fieldset) {
    var legends = $fieldset.getElementsByTagName('legend');

    if (legends.length) {
      var $candidateLegend = legends[0]; // If the input type is radio or checkbox, always use the legend if there
      // is one.

      if ($input.type === 'checkbox' || $input.type === 'radio') {
        return $candidateLegend;
      } // For other input types, only scroll to the fieldset’s legend (instead of
      // the label associated with the input) if the input would end up in the
      // top half of the screen.
      //
      // This should avoid situations where the input either ends up off the
      // screen, or obscured by a software keyboard.


      var legendTop = $candidateLegend.getBoundingClientRect().top;
      var inputRect = $input.getBoundingClientRect(); // If the browser doesn't support Element.getBoundingClientRect().height
      // or window.innerHeight (like IE8), bail and just link to the label.

      if (inputRect.height && window.innerHeight) {
        var inputBottom = inputRect.top + inputRect.height;

        if (inputBottom - legendTop < window.innerHeight / 2) {
          return $candidateLegend;
        }
      }
    }
  }

  return document.querySelector("label[for='" + $input.getAttribute('id') + "']") || $input.closest('label');
};

var _default = ErrorSummary;
exports["default"] = _default;

},{}],81:[function(require,module,exports){
'use strict';
/**
 * Adds click functionality to modal
 * @param {HTMLElement} $modal Modal element
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function Modal($modal) {
  this.$modal = $modal;
  var id = this.$modal.getAttribute('id');
  this.triggers = document.querySelectorAll('[data-module="modal"][data-target="' + id + '"]');
}
/**
 * Set events
 */


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
/**
 * Hide modal
 */


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
    document.removeEventListener('keydown', trapFocus, true);

    if (!hasForcedAction(modalElement)) {
      document.removeEventListener('keyup', handleEscape);
    }

    var dataModalOpener = modalElement.getAttribute('data-modal-opener');

    if (dataModalOpener !== null) {
      var opener = document.getElementById(dataModalOpener);

      if (opener !== null) {
        opener.focus();
      }

      modalElement.removeAttribute('data-modal-opener');
    }
  }
};
/**
 * Show modal
 */


Modal.prototype.show = function () {
  var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var modalElement = this.$modal;

  if (modalElement !== null) {
    if (e !== null) {
      var openerId = e.target.getAttribute('id');

      if (openerId === null) {
        openerId = 'modal-opener-' + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        e.target.setAttribute('id', openerId);
      }

      modalElement.setAttribute('data-modal-opener', openerId);
    } // Hide open modals - FDS do not recommend more than one open modal at a time


    var activeModals = document.querySelectorAll('.fds-modal[aria-hidden=false]');

    for (var i = 0; i < activeModals.length; i++) {
      new Modal(activeModals[i]).hide();
    }

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
    document.addEventListener('keydown', trapFocus, true);

    if (!hasForcedAction(modalElement)) {
      document.addEventListener('keyup', handleEscape);
    }
  }
};
/**
 * Close modal when hitting ESC
 * @param {KeyboardEvent} event 
 */


var handleEscape = function handleEscape(event) {
  var key = event.which || event.keyCode;
  var modalElement = document.querySelector('.fds-modal[aria-hidden=false]');
  var currentModal = new Modal(document.querySelector('.fds-modal[aria-hidden=false]'));

  if (key === 27) {
    var possibleOverflowMenus = modalElement.querySelectorAll('.button-overflow-menu[aria-expanded="true"]');

    if (possibleOverflowMenus.length === 0) {
      currentModal.hide();
    }
  }
};
/**
 * Trap focus in modal when open
 * @param {PointerEvent} e
 */


function trapFocus(e) {
  var currentDialog = document.querySelector('.fds-modal[aria-hidden=false]');

  if (currentDialog !== null) {
    var focusableElements = currentDialog.querySelectorAll('a[href]:not([disabled]):not([aria-hidden=true]), button:not([disabled]):not([aria-hidden=true]), textarea:not([disabled]):not([aria-hidden=true]), input:not([type=hidden]):not([disabled]):not([aria-hidden=true]), select:not([disabled]):not([aria-hidden=true]), details:not([disabled]):not([aria-hidden=true]), [tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden=true])');
    var firstFocusableElement = focusableElements[0];
    var lastFocusableElement = focusableElements[focusableElements.length - 1];
    var isTabPressed = e.key === 'Tab' || e.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey)
      /* shift + tab */
      {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else
      /* tab */
      {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
  }
}

;

function hasForcedAction(modal) {
  if (modal.getAttribute('data-modal-forced-action') === null) {
    return false;
  }

  return true;
}

var _default = Modal;
exports["default"] = _default;

},{}],82:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var forEach = require('array-foreach');

var select = require('../utils/select');

var NAV = ".nav";
var NAV_LINKS = "".concat(NAV, " a");
var OPENERS = ".js-menu-open";
var CLOSE_BUTTON = ".js-menu-close";
var OVERLAY = ".overlay";
var CLOSERS = "".concat(CLOSE_BUTTON, ", .overlay");
var TOGGLES = [NAV, OVERLAY].join(', ');
var ACTIVE_CLASS = 'mobile_nav-active';
var VISIBLE_CLASS = 'is-visible';
/**
 * Add mobile menu functionality
 */

var Navigation = /*#__PURE__*/function () {
  function Navigation() {
    _classCallCheck(this, Navigation);
  }

  _createClass(Navigation, [{
    key: "init",
    value:
    /**
     * Set events
     */
    function init() {
      window.addEventListener('resize', mobileMenu, false);
      mobileMenu();
    }
    /**
     * Remove events
     */

  }, {
    key: "teardown",
    value: function teardown() {
      window.removeEventListener('resize', mobileMenu, false);
    }
  }]);

  return Navigation;
}();
/**
 * Add functionality to mobile menu
 */


var mobileMenu = function mobileMenu() {
  var mobile = false;
  var openers = document.querySelectorAll(OPENERS);

  for (var o = 0; o < openers.length; o++) {
    if (window.getComputedStyle(openers[o], null).display !== 'none') {
      openers[o].addEventListener('click', toggleNav);
      mobile = true;
    }
  } // if mobile


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
/**
 * Check if mobile menu is active
 * @returns true if mobile menu is active and false if not active
 */


var isActive = function isActive() {
  return document.body.classList.contains(ACTIVE_CLASS);
};
/**
 * Trap focus in mobile menu if active
 * @param {HTMLElement} trapContainer 
 */


var _focusTrap = function _focusTrap(trapContainer) {
  // Find all focusable children
  var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  var focusableElements = trapContainer.querySelectorAll(focusableElementsString);
  var firstTabStop = focusableElements[0];

  function trapTabKey(e) {
    var key = event.which || event.keyCode; // Check for TAB key press

    if (key === 9) {
      var lastTabStop = null;

      for (var i = 0; i < focusableElements.length; i++) {
        var number = focusableElements.length - 1;
        var element = focusableElements[number - i];

        if (element.offsetWidth > 0 && element.offsetHeight > 0) {
          lastTabStop = element;
          break;
        }
      } // SHIFT + TAB


      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        } // TAB

      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    } // ESCAPE


    if (e.key === 'Escape') {
      toggleNav.call(this, false);
    }
  }

  return {
    enable: function enable() {
      // Focus first child
      firstTabStop.focus(); // Listen for and trap the keyboard

      document.addEventListener('keydown', trapTabKey);
    },
    release: function release() {
      document.removeEventListener('keydown', trapTabKey);
    }
  };
};

var focusTrap;

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

var _default = Navigation;
exports["default"] = _default;

},{"../utils/select":104,"array-foreach":1}],83:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var TOGGLE_ATTRIBUTE = 'data-controls';
/**
 * Adds click functionality to radiobutton collapse list
 * @param {HTMLElement} containerElement 
 */

function RadioToggleGroup(containerElement) {
  this.radioGroup = containerElement;
  this.radioEls = null;
  this.targetEl = null;
}
/**
 * Set events
 */


RadioToggleGroup.prototype.init = function () {
  this.radioEls = this.radioGroup.querySelectorAll('input[type="radio"]');

  if (this.radioEls.length === 0) {
    throw new Error('No radiobuttons found in radiobutton group.');
  }

  var that = this;

  for (var i = 0; i < this.radioEls.length; i++) {
    var radio = this.radioEls[i];
    radio.addEventListener('change', function () {
      for (var a = 0; a < that.radioEls.length; a++) {
        that.toggle(that.radioEls[a]);
      }
    });
    this.toggle(radio);
  }
};
/**
 * Toggle radiobutton content
 * @param {HTMLInputElement} radioInputElement 
 */


RadioToggleGroup.prototype.toggle = function (radioInputElement) {
  var contentId = radioInputElement.getAttribute(TOGGLE_ATTRIBUTE);

  if (contentId !== null && contentId !== undefined && contentId !== "") {
    var contentElement = document.querySelector(contentId);

    if (contentElement === null || contentElement === undefined) {
      throw new Error("Could not find panel element. Verify value of attribute " + TOGGLE_ATTRIBUTE);
    }

    if (radioInputElement.checked) {
      this.expand(radioInputElement, contentElement);
    } else {
      this.collapse(radioInputElement, contentElement);
    }
  }
};
/**
 * Expand radio button content
 * @param {} radioInputElement Radio Input element
 * @param {*} contentElement Content element
 */


RadioToggleGroup.prototype.expand = function (radioInputElement, contentElement) {
  if (radioInputElement !== null && radioInputElement !== undefined && contentElement !== null && contentElement !== undefined) {
    radioInputElement.setAttribute('data-expanded', 'true');
    contentElement.setAttribute('aria-hidden', 'false');
    var eventOpen = new Event('fds.radio.expanded');
    radioInputElement.dispatchEvent(eventOpen);
  }
};
/**
 * Collapse radio button content
 * @param {} radioInputElement Radio Input element
 * @param {*} contentElement Content element
 */


RadioToggleGroup.prototype.collapse = function (radioInputElement, contentElement) {
  if (radioInputElement !== null && radioInputElement !== undefined && contentElement !== null && contentElement !== undefined) {
    radioInputElement.setAttribute('data-expanded', 'false');
    contentElement.setAttribute('aria-hidden', 'true');
    var eventClose = new Event('fds.radio.collapsed');
    radioInputElement.dispatchEvent(eventClose);
  }
};

var _default = RadioToggleGroup;
exports["default"] = _default;

},{}],84:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var modifierState = {
  shift: false,
  alt: false,
  ctrl: false,
  command: false
};
/*
* Prevents the user from inputting based on a regex.
* Does not work the same way af <input pattern="">, this pattern is only used for validation, not to prevent input.
* Usecase: number input for date-component.
* Example - number only: <input type="text" data-input-regex="^\d*$">
*/

var InputRegexMask = /*#__PURE__*/_createClass(function InputRegexMask(element) {
  _classCallCheck(this, InputRegexMask);

  element.addEventListener('paste', regexMask);
  element.addEventListener('keydown', regexMask);
});

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

var _default = InputRegexMask;
exports["default"] = _default;

},{}],85:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var text = {
  "select_row": "Vælg række",
  "unselect_row": "Fravælg række",
  "select_all_rows": "Vælg alle rækker",
  "unselect_all_rows": "Fravælg alle rækker"
};
/**
 * 
 * @param {HTMLTableElement} table Table Element
 * @param {JSON} strings Translate labels: {"select_row": "Vælg række", "unselect_row": "Fravælg række", "select_all_rows": "Vælg alle rækker", "unselect_all_rows": "Fravælg alle rækker"}
 */

function TableSelectableRows(table) {
  var strings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : text;
  this.table = table;
  text = strings;
}
/**
 * Initialize eventlisteners for checkboxes in table
 */


TableSelectableRows.prototype.init = function () {
  this.groupCheckbox = this.getGroupCheckbox();
  this.tbodyCheckboxList = this.getCheckboxList();

  if (this.tbodyCheckboxList.length !== 0) {
    for (var c = 0; c < this.tbodyCheckboxList.length; c++) {
      var checkbox = this.tbodyCheckboxList[c];
      checkbox.removeEventListener('change', updateGroupCheck);
      checkbox.addEventListener('change', updateGroupCheck);
    }
  }

  if (this.groupCheckbox !== false) {
    this.groupCheckbox.removeEventListener('change', updateCheckboxList);
    this.groupCheckbox.addEventListener('change', updateCheckboxList);
  }
};
/**
 * Get group checkbox in table header
 * @returns element on true - false if not found
 */


TableSelectableRows.prototype.getGroupCheckbox = function () {
  var checkbox = this.table.getElementsByTagName('thead')[0].getElementsByClassName('form-checkbox');

  if (checkbox.length === 0) {
    return false;
  }

  return checkbox[0];
};
/**
 * Get table body checkboxes
 * @returns HTMLCollection
 */


TableSelectableRows.prototype.getCheckboxList = function () {
  return this.table.getElementsByTagName('tbody')[0].getElementsByClassName('form-checkbox');
};
/**
 * Update checkboxes in table body when group checkbox is changed
 * @param {Event} e 
 */


function updateCheckboxList(e) {
  var checkbox = e.target;
  checkbox.removeAttribute('aria-checked');
  var table = e.target.parentNode.parentNode.parentNode.parentNode;
  var tableSelectableRows = new TableSelectableRows(table);
  var checkboxList = tableSelectableRows.getCheckboxList();
  var checkedNumber = 0;

  if (checkbox.checked) {
    for (var c = 0; c < checkboxList.length; c++) {
      checkboxList[c].checked = true;
      checkboxList[c].parentNode.parentNode.classList.add('table-row-selected');
      checkboxList[c].nextElementSibling.setAttribute('aria-label', text.unselect_row);
    }

    checkedNumber = checkboxList.length;
    checkbox.nextElementSibling.setAttribute('aria-label', text.unselect_all_rows);
  } else {
    for (var _c = 0; _c < checkboxList.length; _c++) {
      checkboxList[_c].checked = false;

      checkboxList[_c].parentNode.parentNode.classList.remove('table-row-selected');

      checkboxList[_c].nextElementSibling.setAttribute('aria-label', text.select_row);
    }

    checkbox.nextElementSibling.setAttribute('aria-label', text.select_all_rows);
  }

  var event = new CustomEvent("fds.table.selectable.updated", {
    bubbles: true,
    cancelable: true,
    detail: {
      checkedNumber: checkedNumber
    }
  });
  table.dispatchEvent(event);
}
/**
 * Update group checkbox when checkbox in table body is changed
 * @param {Event} e 
 */


function updateGroupCheck(e) {
  // update label for event checkbox
  if (e.target.checked) {
    e.target.parentNode.parentNode.classList.add('table-row-selected');
    e.target.nextElementSibling.setAttribute('aria-label', text.unselect_row);
  } else {
    e.target.parentNode.parentNode.classList.remove('table-row-selected');
    e.target.nextElementSibling.setAttribute('aria-label', text.select_row);
  }

  var table = e.target.parentNode.parentNode.parentNode.parentNode;
  var tableSelectableRows = new TableSelectableRows(table);
  var groupCheckbox = tableSelectableRows.getGroupCheckbox();

  if (groupCheckbox !== false) {
    var checkboxList = tableSelectableRows.getCheckboxList(); // how many row has been selected

    var checkedNumber = 0;

    for (var c = 0; c < checkboxList.length; c++) {
      var loopedCheckbox = checkboxList[c];

      if (loopedCheckbox.checked) {
        checkedNumber++;
      }
    }

    if (checkedNumber === checkboxList.length) {
      // if all rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.checked = true;
      groupCheckbox.nextElementSibling.setAttribute('aria-label', text.unselect_all_rows);
    } else if (checkedNumber == 0) {
      // if no rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.checked = false;
      groupCheckbox.nextElementSibling.setAttribute('aria-label', text.select_all_rows);
    } else {
      // if some but not all rows has been selected
      groupCheckbox.setAttribute('aria-checked', 'mixed');
      groupCheckbox.checked = false;
      groupCheckbox.nextElementSibling.setAttribute('aria-label', text.select_all_rows);
    }

    var event = new CustomEvent("fds.table.selectable.updated", {
      bubbles: true,
      cancelable: true,
      detail: {
        checkedNumber: checkedNumber
      }
    });
    table.dispatchEvent(event);
  }
}

var _default = TableSelectableRows;
exports["default"] = _default;

},{}],86:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var select = require('../utils/select');
/**
 * Set data-title on cells, where the attribute is missing
 */


var ResponsiveTable = /*#__PURE__*/_createClass(function ResponsiveTable(table) {
  _classCallCheck(this, ResponsiveTable);

  insertHeaderAsAttributes(table);
});
/**
 * Add data attributes needed for responsive mode.
 * @param {HTMLTableElement} tableEl Table element
 */


function insertHeaderAsAttributes(tableEl) {
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
            if (!cellEls[i].hasAttribute('data-title')) {
              cellEls[i].setAttribute('data-title', headerCellEl.textContent);
            }
          });
        }
      });
    }
  }
}

var _default = ResponsiveTable;
exports["default"] = _default;

},{"../utils/select":104}],87:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
}; // For easy reference

var keys = {
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  "delete": 46
}; // Add or substract depending on key pressed

var direction = {
  37: -1,
  38: -1,
  39: 1,
  40: 1
};
/**
 * Add functionality to tabnav component
 * @param {HTMLElement} tabnav Tabnav container
 */

function Tabnav(tabnav) {
  this.tabnav = tabnav;
  this.tabs = this.tabnav.querySelectorAll('button.tabnav-item');
}
/**
 * Set event on component
 */


Tabnav.prototype.init = function () {
  if (this.tabs.length === 0) {
    throw new Error("Tabnav HTML seems to be missing tabnav-item. Add tabnav items to ensure each panel has a button in the tabnavs navigation.");
  } // if no hash is set on load, set active tab


  if (!setActiveHashTab()) {
    // set first tab as active
    var tab = this.tabs[0]; // check no other tabs as been set at default

    var alreadyActive = getActiveTabs(this.tabnav);

    if (alreadyActive.length === 0) {
      tab = alreadyActive[0];
    } // activate and deactivate tabs


    this.activateTab(tab, false);
  }

  var $module = this; // add eventlisteners on buttons

  for (var t = 0; t < this.tabs.length; t++) {
    this.tabs[t].addEventListener('click', function () {
      $module.activateTab(this, false);
    });
    this.tabs[t].addEventListener('keydown', keydownEventListener);
    this.tabs[t].addEventListener('keyup', keyupEventListener);
  }
};
/***
 * Show tab and hide others
 * @param {HTMLButtonElement} tab button element
 * @param {boolean} setFocus True if tab button should be focused
 */


Tabnav.prototype.activateTab = function (tab, setFocus) {
  var tabs = getAllTabsInList(tab); // close all tabs except selected

  for (var i = 0; i < this.tabs.length; i++) {
    if (tabs[i] === tab) {
      continue;
    }

    if (tabs[i].getAttribute('aria-selected') === 'true') {
      var eventClose = new Event('fds.tabnav.close');
      tabs[i].dispatchEvent(eventClose);
    }

    tabs[i].setAttribute('tabindex', '-1');
    tabs[i].setAttribute('aria-selected', 'false');

    var _tabpanelID = tabs[i].getAttribute('aria-controls');

    var _tabpanel = document.getElementById(_tabpanelID);

    if (_tabpanel === null) {
      throw new Error("Could not find tabpanel.");
    }

    _tabpanel.setAttribute('aria-hidden', 'true');
  } // Set selected tab to active


  var tabpanelID = tab.getAttribute('aria-controls');
  var tabpanel = document.getElementById(tabpanelID);

  if (tabpanel === null) {
    throw new Error("Could not find accordion panel.");
  }

  tab.setAttribute('aria-selected', 'true');
  tabpanel.setAttribute('aria-hidden', 'false');
  tab.removeAttribute('tabindex'); // Set focus when required

  if (setFocus) {
    tab.focus();
  }

  var eventChanged = new Event('fds.tabnav.changed');
  tab.parentNode.dispatchEvent(eventChanged);
  var eventOpen = new Event('fds.tabnav.open');
  tab.dispatchEvent(eventOpen);
};
/**
 * Add keydown events to tabnav component
 * @param {KeyboardEvent} event 
 */


function keydownEventListener(event) {
  var key = event.keyCode;

  switch (key) {
    case keys.end:
      event.preventDefault(); // Activate last tab

      focusLastTab(event.target);
      break;

    case keys.home:
      event.preventDefault(); // Activate first tab

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
/**
 * Add keyup events to tabnav component
 * @param {KeyboardEvent} event 
 */


function keyupEventListener(event) {
  var key = event.keyCode;

  switch (key) {
    case keys.left:
    case keys.right:
      determineOrientation(event);
      break;

    case keys["delete"]:
      break;

    case keys.enter:
    case keys.space:
      new Tabnav(event.target.parentNode).activateTab(event.target, true);
      break;
  }
}
/**
 * When a tablist aria-orientation is set to vertical,
 * only up and down arrow should function.
 * In all other cases only left and right arrow function.
 */


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
/**
 * Either focus the next, previous, first, or last tab
 * depending on key pressed
 */


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
/**
 * Get index of element in list
 * @param {HTMLElement} element 
 * @param {HTMLCollection} list 
 * @returns {index}
 */


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
/**
 * Get first tab by tab in list
 * @param {HTMLButtonElement} tab 
 */


function focusFirstTab(tab) {
  getAllTabsInList(tab)[0].focus();
}
/**
 * Get last tab by tab in list
 * @param {HTMLButtonElement} tab 
 */


function focusLastTab(tab) {
  var tabs = getAllTabsInList(tab);
  tabs[tabs.length - 1].focus();
}

var _default = Tabnav;
exports["default"] = _default;

},{}],88:[function(require,module,exports){
'use strict';
/**
 * Show/hide toast component
 * @param {HTMLElement} element 
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function Toast(element) {
  this.element = element;
}
/**
 * Show toast
 */


Toast.prototype.show = function () {
  this.element.classList.remove('hide');
  this.element.classList.add('showing');
  this.element.getElementsByClassName('toast-close')[0].addEventListener('click', function () {
    var toast = this.parentNode.parentNode;
    new Toast(toast).hide();
  });
  requestAnimationFrame(showToast);
};
/**
 * Hide toast
 */


Toast.prototype.hide = function () {
  this.element.classList.remove('show');
  this.element.classList.add('hide');
};
/**
 * Adds classes to make show animation
 */


function showToast() {
  var toasts = document.querySelectorAll('.toast.showing');

  for (var t = 0; t < toasts.length; t++) {
    var toast = toasts[t];
    toast.classList.remove('showing');
    toast.classList.add('show');
  }
}

var _default = Toast;
exports["default"] = _default;

},{}],89:[function(require,module,exports){
'use strict';
/**
 * Set tooltip on element
 * @param {HTMLElement} element Element which has tooltip
 */

function Tooltip(element) {
  this.element = element;

  if (this.element.getAttribute('data-tooltip') === null) {
    throw new Error("Tooltip text is missing. Add attribute data-tooltip and the content of the tooltip as value.");
  }
}
/**
 * Set eventlisteners
 */


Tooltip.prototype.init = function () {
  var module = this;
  this.element.addEventListener('mouseenter', function (e) {
    var trigger = e.target;

    if (trigger.classList.contains('tooltip-hover') === false && trigger.classList.contains('tooltip-focus') === false) {
      closeAllTooltips(e);
      trigger.classList.add("tooltip-hover");
      setTimeout(function () {
        if (trigger.classList.contains('tooltip-hover')) {
          var element = e.target;
          if (element.getAttribute('aria-describedby') !== null) return;
          addTooltip(element);
        }
      }, 300);
    }
  });
  this.element.addEventListener('mouseleave', function (e) {
    var trigger = e.target;

    if (trigger.classList.contains('tooltip-hover')) {
      trigger.classList.remove('tooltip-hover');
      var tooltipId = trigger.getAttribute('aria-describedby');
      var tooltipElement = document.getElementById(tooltipId);

      if (tooltipElement !== null) {
        closeHoverTooltip(trigger);
      }
    }
  });
  this.element.addEventListener('keyup', function (event) {
    var key = event.which || event.keyCode;

    if (key === 27) {
      var tooltip = this.getAttribute('aria-describedby');

      if (tooltip !== null && document.getElementById(tooltip) !== null) {
        document.body.removeChild(document.getElementById(tooltip));
      }

      this.classList.remove('active');
      this.removeAttribute('aria-describedby');
    }
  });

  if (this.element.getAttribute('data-tooltip-trigger') === 'click') {
    this.element.addEventListener('click', function (e) {
      var trigger = e.target;
      closeAllTooltips(e);
      trigger.classList.add('tooltip-focus');
      trigger.classList.remove('tooltip-hover');
      if (trigger.getAttribute('aria-describedby') !== null) return;
      addTooltip(trigger);
    });
  }

  document.getElementsByTagName('body')[0].removeEventListener('click', closeAllTooltips);
  document.getElementsByTagName('body')[0].addEventListener('click', closeAllTooltips);
};
/**
 * Close all tooltips
 */


function closeAll() {
  var elements = document.querySelectorAll('.js-tooltip[aria-describedby]');

  for (var i = 0; i < elements.length; i++) {
    var popper = elements[i].getAttribute('aria-describedby');
    elements[i].removeAttribute('aria-describedby');
    document.body.removeChild(document.getElementById(popper));
  }
}

function addTooltip(trigger) {
  var pos = trigger.getAttribute('data-tooltip-position') || 'top';
  var tooltip = createTooltip(trigger, pos);
  document.body.appendChild(tooltip);
  positionAt(trigger, tooltip, pos);
}
/**
 * Create tooltip element
 * @param {HTMLElement} element Element which the tooltip is attached
 * @param {string} pos Position of tooltip (top | bottom)
 * @returns 
 */


function createTooltip(element, pos) {
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
  var tooltipArrow = document.createElement('div');
  tooltipArrow.className = 'tooltip-arrow';
  tooltipInner.appendChild(tooltipArrow);
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


function positionAt(parent, tooltip, pos) {
  var trigger = parent;
  var arrow = tooltip.getElementsByClassName('tooltip-arrow')[0];
  var triggerPosition = parent.getBoundingClientRect();
  var parentCoords = parent.getBoundingClientRect(),
      left,
      top;
  var tooltipWidth = tooltip.offsetWidth;
  var dist = 12;
  var arrowDirection = "down";
  left = parseInt(parentCoords.left) + (parent.offsetWidth - tooltip.offsetWidth) / 2;

  switch (pos) {
    case 'bottom':
      top = parseInt(parentCoords.bottom) + dist;
      arrowDirection = "up";
      break;

    default:
    case 'top':
      top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
  } // if tooltip is out of bounds on left side


  if (left < 0) {
    left = dist;
    var endPositionOnPage = triggerPosition.left + trigger.offsetWidth / 2;
    var tooltipArrowHalfWidth = 8;
    var arrowLeftPosition = endPositionOnPage - dist - tooltipArrowHalfWidth;
    tooltip.getElementsByClassName('tooltip-arrow')[0].style.left = arrowLeftPosition + 'px';
  } // if tooltip is out of bounds on the bottom of the page


  if (top + tooltip.offsetHeight >= window.innerHeight) {
    top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
    arrowDirection = "down";
  } // if tooltip is out of bounds on the top of the page


  if (top < 0) {
    top = parseInt(parentCoords.bottom) + dist;
    arrowDirection = "up";
  }

  if (window.innerWidth < left + tooltipWidth) {
    tooltip.style.right = dist + 'px';

    var _endPositionOnPage = triggerPosition.right - trigger.offsetWidth / 2;

    var _tooltipArrowHalfWidth = 8;
    var arrowRightPosition = window.innerWidth - _endPositionOnPage - dist - _tooltipArrowHalfWidth;
    tooltip.getElementsByClassName('tooltip-arrow')[0].style.right = arrowRightPosition + 'px';
    tooltip.getElementsByClassName('tooltip-arrow')[0].style.left = 'auto';
  } else {
    tooltip.style.left = left + 'px';
  }

  tooltip.style.top = top + pageYOffset + 'px';
  tooltip.getElementsByClassName('tooltip-arrow')[0].classList.add(arrowDirection);
}

function closeAllTooltips(event) {
  var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (force || !event.target.classList.contains('js-tooltip') && !event.target.classList.contains('tooltip') && !event.target.classList.contains('tooltip-content')) {
    var elements = document.querySelectorAll('.tooltip-popper');

    for (var i = 0; i < elements.length; i++) {
      var trigger = document.querySelector('[aria-describedby=' + elements[i].getAttribute('id') + ']');
      trigger.removeAttribute('data-tooltip-active');
      trigger.removeAttribute('aria-describedby');
      trigger.classList.remove('tooltip-focus');
      trigger.classList.remove('tooltip-hover');
      document.body.removeChild(elements[i]);
    }
  }
}

function closeHoverTooltip(trigger) {
  var tooltipId = trigger.getAttribute('aria-describedby');
  var tooltipElement = document.getElementById(tooltipId);
  tooltipElement.removeEventListener('mouseenter', onTooltipHover);
  tooltipElement.addEventListener('mouseenter', onTooltipHover);
  setTimeout(function () {
    var tooltipElement = document.getElementById(tooltipId);

    if (tooltipElement !== null) {
      if (!trigger.classList.contains("tooltip-hover")) {
        removeTooltip(trigger);
      }
    }
  }, 300);
}

function onTooltipHover(e) {
  var tooltipElement = this;
  var trigger = document.querySelector('[aria-describedby=' + tooltipElement.getAttribute('id') + ']');
  trigger.classList.add('tooltip-hover');
  tooltipElement.addEventListener('mouseleave', function () {
    var trigger = document.querySelector('[aria-describedby=' + tooltipElement.getAttribute('id') + ']');

    if (trigger !== null) {
      trigger.classList.remove('tooltip-hover');
      closeHoverTooltip(trigger);
    }
  });
}

function removeTooltip(trigger) {
  var tooltipId = trigger.getAttribute('aria-describedby');
  var tooltipElement = document.getElementById(tooltipId);

  if (tooltipId !== null && tooltipElement !== null) {
    document.body.removeChild(tooltipElement);
  }

  trigger.removeAttribute('aria-describedby');
  trigger.classList.remove('tooltip-hover');
  trigger.classList.remove('tooltip-focus');
}

module.exports = Tooltip;

},{}],90:[function(require,module,exports){
"use strict";

module.exports = {
  prefix: ''
};

},{}],91:[function(require,module,exports){
'use strict';

var _accordion = _interopRequireDefault(require("./components/accordion"));

var _alert = _interopRequireDefault(require("./components/alert"));

var _backToTop = _interopRequireDefault(require("./components/back-to-top"));

var _characterLimit = _interopRequireDefault(require("./components/character-limit"));

var _checkboxToggleContent = _interopRequireDefault(require("./components/checkbox-toggle-content"));

var _dropdown = _interopRequireDefault(require("./components/dropdown"));

var _dropdownSort = _interopRequireDefault(require("./components/dropdown-sort"));

var _errorSummary = _interopRequireDefault(require("./components/error-summary"));

var _regexInputMask = _interopRequireDefault(require("./components/regex-input-mask"));

var _modal = _interopRequireDefault(require("./components/modal"));

var _navigation = _interopRequireDefault(require("./components/navigation"));

var _radioToggleContent = _interopRequireDefault(require("./components/radio-toggle-content"));

var _table = _interopRequireDefault(require("./components/table"));

var _tabnav = _interopRequireDefault(require("./components/tabnav"));

var _selectableTable = _interopRequireDefault(require("./components/selectable-table"));

var _toast = _interopRequireDefault(require("./components/toast"));

var _tooltip = _interopRequireDefault(require("./components/tooltip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var datePicker = require('./components/date-picker');
/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */


require('./polyfills');
/**
 * Init all components
 * @param {JSON} options {scope: HTMLElement} - Init all components within scope (default is document)
 */


var init = function init(options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {}; // Allow the user to initialise FDS in only certain sections of the page
  // Defaults to the entire document if nothing is set.

  var scope = typeof options.scope !== 'undefined' ? options.scope : document;
  /*
  ---------------------
  Accordions
  ---------------------
  */

  var jsSelectorAccordion = scope.getElementsByClassName('accordion');

  for (var c = 0; c < jsSelectorAccordion.length; c++) {
    new _accordion["default"](jsSelectorAccordion[c]).init();
  }

  var jsSelectorAccordionBordered = scope.querySelectorAll('.accordion-bordered:not(.accordion)');

  for (var _c = 0; _c < jsSelectorAccordionBordered.length; _c++) {
    new _accordion["default"](jsSelectorAccordionBordered[_c]).init();
  }
  /*
  ---------------------
  Alerts
  ---------------------
  */


  var alertsWithCloseButton = scope.querySelectorAll('.alert.has-close');

  for (var _c2 = 0; _c2 < alertsWithCloseButton.length; _c2++) {
    new _alert["default"](alertsWithCloseButton[_c2]).init();
  }
  /*
  ---------------------
  Back to top button
  ---------------------
  */


  var backToTopButtons = scope.getElementsByClassName('back-to-top-button');

  for (var _c3 = 0; _c3 < backToTopButtons.length; _c3++) {
    new _backToTop["default"](backToTopButtons[_c3]).init();
  }
  /*
  ---------------------
  Character limit
  ---------------------
  */


  var jsCharacterLimit = scope.getElementsByClassName('form-limit');

  for (var _c4 = 0; _c4 < jsCharacterLimit.length; _c4++) {
    new _characterLimit["default"](jsCharacterLimit[_c4]).init();
  }
  /*
  ---------------------
  Checkbox collapse
  ---------------------
  */


  var jsSelectorCheckboxCollapse = scope.getElementsByClassName('js-checkbox-toggle-content');

  for (var _c5 = 0; _c5 < jsSelectorCheckboxCollapse.length; _c5++) {
    new _checkboxToggleContent["default"](jsSelectorCheckboxCollapse[_c5]).init();
  }
  /*
  ---------------------
  Overflow menu
  ---------------------
  */


  var jsSelectorDropdown = scope.getElementsByClassName('js-dropdown');

  for (var _c6 = 0; _c6 < jsSelectorDropdown.length; _c6++) {
    new _dropdown["default"](jsSelectorDropdown[_c6]).init();
  }
  /*
  ---------------------
  Overflow menu sort
  ---------------------
  */


  var jsSelectorDropdownSort = scope.getElementsByClassName('overflow-menu--sort');

  for (var _c7 = 0; _c7 < jsSelectorDropdownSort.length; _c7++) {
    new _dropdownSort["default"](jsSelectorDropdownSort[_c7]).init();
  }
  /*
  ---------------------
  Datepicker
  ---------------------
  */


  datePicker.on(scope);
  /*
  ---------------------
  Error summary
  ---------------------
  */

  var $errorSummary = scope.querySelector('[data-module="error-summary"]');
  new _errorSummary["default"]($errorSummary).init();
  /*
  ---------------------
  Input Regex - used on date fields
  ---------------------
  */

  var jsSelectorRegex = scope.querySelectorAll('input[data-input-regex]');

  for (var _c8 = 0; _c8 < jsSelectorRegex.length; _c8++) {
    new _regexInputMask["default"](jsSelectorRegex[_c8]);
  }
  /*
  ---------------------
  Modal
  ---------------------
  */


  var modals = scope.querySelectorAll('.fds-modal');

  for (var d = 0; d < modals.length; d++) {
    new _modal["default"](modals[d]).init();
  }
  /*
  ---------------------
  Navigation
  ---------------------
  */


  new _navigation["default"]().init();
  /*
  ---------------------
  Radiobutton group collapse
  ---------------------
  */

  var jsSelectorRadioCollapse = scope.getElementsByClassName('js-radio-toggle-group');

  for (var _c9 = 0; _c9 < jsSelectorRadioCollapse.length; _c9++) {
    new _radioToggleContent["default"](jsSelectorRadioCollapse[_c9]).init();
  }
  /*
  ---------------------
  Responsive tables
  ---------------------
  */


  var jsSelectorTable = scope.querySelectorAll('table:not(.dataTable)');

  for (var _c10 = 0; _c10 < jsSelectorTable.length; _c10++) {
    new _table["default"](jsSelectorTable[_c10]);
  }
  /*
  ---------------------
  Selectable rows in table
  ---------------------
  */


  var jsSelectableTable = scope.querySelectorAll('table.table--selectable');

  for (var _c11 = 0; _c11 < jsSelectableTable.length; _c11++) {
    new _selectableTable["default"](jsSelectableTable[_c11]).init();
  }
  /*
  ---------------------
  Tabnav
  ---------------------
  */


  var jsSelectorTabnav = scope.getElementsByClassName('tabnav');

  for (var _c12 = 0; _c12 < jsSelectorTabnav.length; _c12++) {
    new _tabnav["default"](jsSelectorTabnav[_c12]).init();
  }
  /*
  ---------------------
  Tooltip
  ---------------------
  */


  var jsSelectorTooltip = scope.getElementsByClassName('js-tooltip');

  for (var _c13 = 0; _c13 < jsSelectorTooltip.length; _c13++) {
    new _tooltip["default"](jsSelectorTooltip[_c13]).init();
  }
};

module.exports = {
  init: init,
  Accordion: _accordion["default"],
  Alert: _alert["default"],
  BackToTop: _backToTop["default"],
  CharacterLimit: _characterLimit["default"],
  CheckboxToggleContent: _checkboxToggleContent["default"],
  Dropdown: _dropdown["default"],
  DropdownSort: _dropdownSort["default"],
  datePicker: datePicker,
  ErrorSummary: _errorSummary["default"],
  InputRegexMask: _regexInputMask["default"],
  Modal: _modal["default"],
  Navigation: _navigation["default"],
  RadioToggleGroup: _radioToggleContent["default"],
  ResponsiveTable: _table["default"],
  TableSelectableRows: _selectableTable["default"],
  Tabnav: _tabnav["default"],
  Toast: _toast["default"],
  Tooltip: _tooltip["default"]
};

},{"./components/accordion":72,"./components/alert":73,"./components/back-to-top":74,"./components/character-limit":75,"./components/checkbox-toggle-content":76,"./components/date-picker":77,"./components/dropdown":79,"./components/dropdown-sort":78,"./components/error-summary":80,"./components/modal":81,"./components/navigation":82,"./components/radio-toggle-content":83,"./components/regex-input-mask":84,"./components/selectable-table":85,"./components/table":86,"./components/tabnav":87,"./components/toast":88,"./components/tooltip":89,"./polyfills":97}],92:[function(require,module,exports){
"use strict";

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

},{}],93:[function(require,module,exports){
(function (global){(function (){
"use strict";

require("../../Object/defineProperty");

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function (undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Function/prototype/bind/detect.js
  var detect = ('bind' in Function.prototype);
  if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Function.prototype.bind&flags=always

  Object.defineProperty(Function.prototype, 'bind', {
    value: function bind(that) {
      // .length is 1
      // add necessary es5-shim utilities
      var $Array = Array;
      var $Object = Object;
      var ObjectPrototype = $Object.prototype;
      var ArrayPrototype = $Array.prototype;

      var Empty = function Empty() {};

      var to_string = ObjectPrototype.toString;
      var hasToStringTag = typeof Symbol === 'function' && _typeof(Symbol.toStringTag) === 'symbol';
      var isCallable;
      /* inlined from https://npmjs.com/is-callable */

      var fnToStr = Function.prototype.toString,
          tryFunctionObject = function tryFunctionObject(value) {
        try {
          fnToStr.call(value);
          return true;
        } catch (e) {
          return false;
        }
      },
          fnClass = '[object Function]',
          genClass = '[object GeneratorFunction]';

      isCallable = function isCallable(value) {
        if (typeof value !== 'function') {
          return false;
        }

        if (hasToStringTag) {
          return tryFunctionObject(value);
        }

        var strClass = to_string.call(value);
        return strClass === fnClass || strClass === genClass;
      };

      var array_slice = ArrayPrototype.slice;
      var array_concat = ArrayPrototype.concat;
      var array_push = ArrayPrototype.push;
      var max = Math.max; // /add necessary es5-shim utilities
      // 1. Let Target be the this value.

      var target = this; // 2. If IsCallable(Target) is false, throw a TypeError exception.

      if (!isCallable(target)) {
        throw new TypeError('Function.prototype.bind called on incompatible ' + target);
      } // 3. Let A be a new (possibly empty) internal list of all of the
      //   argument values provided after thisArg (arg1, arg2 etc), in order.
      // XXX slicedArgs will stand in for "A" if used


      var args = array_slice.call(arguments, 1); // for normal call
      // 4. Let F be a new native ECMAScript object.
      // 11. Set the [[Prototype]] internal property of F to the standard
      //   built-in Function prototype object as specified in 15.3.3.1.
      // 12. Set the [[Call]] internal property of F as described in
      //   15.3.4.5.1.
      // 13. Set the [[Construct]] internal property of F as described in
      //   15.3.4.5.2.
      // 14. Set the [[HasInstance]] internal property of F as described in
      //   15.3.4.5.3.

      var bound;

      var binder = function binder() {
        if (this instanceof bound) {
          // 15.3.4.5.2 [[Construct]]
          // When the [[Construct]] internal method of a function object,
          // F that was created using the bind function is called with a
          // list of arguments ExtraArgs, the following steps are taken:
          // 1. Let target be the value of F's [[TargetFunction]]
          //   internal property.
          // 2. If target has no [[Construct]] internal method, a
          //   TypeError exception is thrown.
          // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
          //   property.
          // 4. Let args be a new list containing the same values as the
          //   list boundArgs in the same order followed by the same
          //   values as the list ExtraArgs in the same order.
          // 5. Return the result of calling the [[Construct]] internal
          //   method of target providing args as the arguments.
          var result = target.apply(this, array_concat.call(args, array_slice.call(arguments)));

          if ($Object(result) === result) {
            return result;
          }

          return this;
        } else {
          // 15.3.4.5.1 [[Call]]
          // When the [[Call]] internal method of a function object, F,
          // which was created using the bind function is called with a
          // this value and a list of arguments ExtraArgs, the following
          // steps are taken:
          // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
          //   property.
          // 2. Let boundThis be the value of F's [[BoundThis]] internal
          //   property.
          // 3. Let target be the value of F's [[TargetFunction]] internal
          //   property.
          // 4. Let args be a new list containing the same values as the
          //   list boundArgs in the same order followed by the same
          //   values as the list ExtraArgs in the same order.
          // 5. Return the result of calling the [[Call]] internal method
          //   of target providing boundThis as the this value and
          //   providing args as the arguments.
          // equiv: target.call(this, ...boundArgs, ...args)
          return target.apply(that, array_concat.call(args, array_slice.call(arguments)));
        }
      }; // 15. If the [[Class]] internal property of Target is "Function", then
      //     a. Let L be the length property of Target minus the length of A.
      //     b. Set the length own property of F to either 0 or L, whichever is
      //       larger.
      // 16. Else set the length own property of F to 0.


      var boundLength = max(0, target.length - args.length); // 17. Set the attributes of the length own property of F to the values
      //   specified in 15.3.5.1.

      var boundArgs = [];

      for (var i = 0; i < boundLength; i++) {
        array_push.call(boundArgs, '$' + i);
      } // XXX Build a dynamic function with desired amount of arguments is the only
      // way to set the length property of a function.
      // In environments where Content Security Policies enabled (Chrome extensions,
      // for ex.) all use of eval or Function costructor throws an exception.
      // However in all of these environments Function.prototype.bind exists
      // and so this code will never be executed.


      bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

      if (target.prototype) {
        Empty.prototype = target.prototype;
        bound.prototype = new Empty(); // Clean up dangling references.

        Empty.prototype = null;
      } // TODO
      // 18. Set the [[Extensible]] internal property of F to true.
      // TODO
      // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
      // 20. Call the [[DefineOwnProperty]] internal method of F with
      //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
      //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
      //   false.
      // 21. Call the [[DefineOwnProperty]] internal method of F with
      //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
      //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
      //   and false.
      // TODO
      // NOTE Function objects created using Function.prototype.bind do not
      // have a prototype property or the [[Code]], [[FormalParameters]], and
      // [[Scope]] internal properties.
      // XXX can't delete prototype in pure-js.
      // 22. Return F.


      return bound;
    }
  });
}).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof global === "undefined" ? "undefined" : _typeof(global)) && global || {});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../Object/defineProperty":94}],94:[function(require,module,exports){
(function (global){(function (){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function (undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-service/blob/master/packages/polyfill-library/polyfills/Object/defineProperty/detect.js
  var detect = // In IE8, defineProperty could only act on DOM elements, so full support
  // for the feature requires the ability to set a property on an arbitrary object
  'defineProperty' in Object && function () {
    try {
      var a = {};
      Object.defineProperty(a, 'test', {
        value: 42
      });
      return true;
    } catch (e) {
      return false;
    }
  }();

  if (detect) return; // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Object.defineProperty&flags=always

  (function (nativeDefineProperty) {
    var supportsAccessors = Object.prototype.hasOwnProperty('__defineGetter__');
    var ERR_ACCESSORS_NOT_SUPPORTED = 'Getters & setters cannot be defined on this javascript engine';
    var ERR_VALUE_ACCESSORS = 'A property cannot both have accessors and be writable or have a value';

    Object.defineProperty = function defineProperty(object, property, descriptor) {
      // Where native support exists, assume it
      if (nativeDefineProperty && (object === window || object === document || object === Element.prototype || object instanceof Element)) {
        return nativeDefineProperty(object, property, descriptor);
      }

      if (object === null || !(object instanceof Object || _typeof(object) === 'object')) {
        throw new TypeError('Object.defineProperty called on non-object');
      }

      if (!(descriptor instanceof Object)) {
        throw new TypeError('Property description must be an object');
      }

      var propertyString = String(property);
      var hasValueOrWritable = 'value' in descriptor || 'writable' in descriptor;

      var getterType = 'get' in descriptor && _typeof(descriptor.get);

      var setterType = 'set' in descriptor && _typeof(descriptor.set); // handle descriptor.get


      if (getterType) {
        if (getterType !== 'function') {
          throw new TypeError('Getter must be a function');
        }

        if (!supportsAccessors) {
          throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
        }

        if (hasValueOrWritable) {
          throw new TypeError(ERR_VALUE_ACCESSORS);
        }

        Object.__defineGetter__.call(object, propertyString, descriptor.get);
      } else {
        object[propertyString] = descriptor.value;
      } // handle descriptor.set


      if (setterType) {
        if (setterType !== 'function') {
          throw new TypeError('Setter must be a function');
        }

        if (!supportsAccessors) {
          throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
        }

        if (hasValueOrWritable) {
          throw new TypeError(ERR_VALUE_ACCESSORS);
        }

        Object.__defineSetter__.call(object, propertyString, descriptor.set);
      } // OK to define value unconditionally - if a getter has been specified as well, an error would be thrown above


      if ('value' in descriptor) {
        object[propertyString] = descriptor.value;
      }

      return object;
    };
  })(Object.defineProperty);
}).call('object' === (typeof window === "undefined" ? "undefined" : _typeof(window)) && window || 'object' === (typeof self === "undefined" ? "undefined" : _typeof(self)) && self || 'object' === (typeof global === "undefined" ? "undefined" : _typeof(global)) && global || {});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],95:[function(require,module,exports){
"use strict";

/* eslint-disable consistent-return */

/* eslint-disable func-names */
(function () {
  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event, _params) {
    var params = _params || {
      bubbles: false,
      cancelable: false,
      detail: null
    };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  window.CustomEvent = CustomEvent;
})();

},{}],96:[function(require,module,exports){
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

},{}],97:[function(require,module,exports){
'use strict'; // polyfills HTMLElement.prototype.classList and DOMTokenList

require('classlist-polyfill'); // polyfills HTMLElement.prototype.hidden


require('./element-hidden'); // polyfills Number.isNaN()


require("./number-is-nan"); // polyfills CustomEvent


require("./custom-event");

require('core-js/fn/object/assign');

require('core-js/fn/array/from');

},{"./custom-event":95,"./element-hidden":96,"./number-is-nan":98,"classlist-polyfill":2,"core-js/fn/array/from":3,"core-js/fn/object/assign":4}],98:[function(require,module,exports){
"use strict";

Number.isNaN = Number.isNaN || function isNaN(input) {
  // eslint-disable-next-line no-self-compare
  return typeof input === "number" && input !== input;
};

},{}],99:[function(require,module,exports){
"use strict";

module.exports = function () {
  var htmlDocument = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  return htmlDocument.activeElement;
};

},{}],100:[function(require,module,exports){
"use strict";

var assign = require("object-assign");

var receptor = require("receptor");
/**
 * @name sequence
 * @param {...Function} seq an array of functions
 * @return { closure } callHooks
 */
// We use a named function here because we want it to inherit its lexical scope
// from the behavior props object, not from the module


var sequence = function sequence() {
  for (var _len = arguments.length, seq = new Array(_len), _key = 0; _key < _len; _key++) {
    seq[_key] = arguments[_key];
  }

  return function callHooks() {
    var _this = this;

    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
    seq.forEach(function (method) {
      if (typeof _this[method] === "function") {
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
  return receptor.behavior(events, assign({
    on: sequence("init", "add"),
    off: sequence("teardown", "remove")
  }, props));
};

},{"object-assign":63,"receptor":70}],101:[function(require,module,exports){
'use strict';

var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};
module.exports = breakpoints;

},{}],102:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;
  var rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}

module.exports = isElementInViewport;

},{}],103:[function(require,module,exports){
"use strict";

// iOS detection from: http://stackoverflow.com/a/9039885/177710
function isIosDevice() {
  return typeof navigator !== "undefined" && (navigator.userAgent.match(/(iPod|iPhone|iPad)/g) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
}

module.exports = isIosDevice;

},{}],104:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/**
 * @name isElement
 * @desc returns whether or not the given argument is a DOM element.
 * @param {any} value
 * @return {boolean}
 */
var isElement = function isElement(value) {
  return value && _typeof(value) === "object" && value.nodeType === 1;
};
/**
 * @name select
 * @desc selects elements from the DOM by class selector or ID selector.
 * @param {string} selector - The selector to traverse the DOM with.
 * @param {Document|HTMLElement?} context - The context to traverse the DOM
 *   in. If not provided, it defaults to the document.
 * @return {HTMLElement[]} - An array of DOM nodes or an empty array.
 */


module.exports = function (selector, context) {
  if (typeof selector !== "string") {
    return [];
  }

  if (!context || !isElement(context)) {
    context = window.document; // eslint-disable-line no-param-reassign
  }

  var selection = context.querySelectorAll(selector);
  return Array.prototype.slice.call(selection);
};

},{}],105:[function(require,module,exports){
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

},{}]},{},[91])(91)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mdW5jdGlvbi10by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGVzLXNlbGVjdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2JlaGF2aW9yLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jb21wb3NlLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9kZWxlZ2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvZGVsZWdhdGVBbGwuanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2lnbm9yZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2tleW1hcC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FsZXJ0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYmFjay10by10b3AuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGFyYWN0ZXItbGltaXQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RhdGUtcGlja2VyLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZHJvcGRvd24tc29ydC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeS5qcyIsInNyYy9qcy9jb21wb25lbnRzL21vZGFsLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbmF2aWdhdGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzay5qcyIsInNyYy9qcy9jb21wb25lbnRzL3NlbGVjdGFibGUtdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYm5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RvYXN0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9vbHRpcC5qcyIsInNyYy9qcy9jb25maWcuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvZXZlbnRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvT2JqZWN0L2RlZmluZVByb3BlcnR5LmpzIiwic3JjL2pzL3BvbHlmaWxscy9jdXN0b20tZXZlbnQuanMiLCJzcmMvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwic3JjL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvbnVtYmVyLWlzLW5hbi5qcyIsInNyYy9qcy91dGlscy9hY3RpdmUtZWxlbWVudC5qcyIsInNyYy9qcy91dGlscy9iZWhhdmlvci5qcyIsInNyYy9qcy91dGlscy9icmVha3BvaW50cy5qcyIsInNyYy9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInNyYy9qcy91dGlscy9pcy1pb3MtZGV2aWNlLmpzIiwic3JjL2pzL3V0aWxzL3NlbGVjdC5qcyIsInNyYy9qcy91dGlscy90b2dnbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxPQUFU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QixTQUF4QixFQUFtQztJQUNqQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsUUFBcEIsTUFBa0MsT0FBN0M7RUFDRDs7RUFDRCxNQUFNLENBQUMsWUFBUCxDQUFvQixRQUFwQixFQUE4QixRQUE5QjtFQUNBLElBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFFBQXBCLENBQVg7RUFDQSxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixFQUF4QixDQUFqQjs7RUFDQSxJQUFJLENBQUMsUUFBTCxFQUFlO0lBQ2IsTUFBTSxJQUFJLEtBQUosQ0FDSixzQ0FBc0MsRUFBdEMsR0FBMkMsR0FEdkMsQ0FBTjtFQUdEOztFQUVELFFBQVEsQ0FBQyxZQUFULENBQXNCLE1BQXRCLEVBQThCLENBQUMsUUFBL0I7RUFDQSxPQUFPLFFBQVA7QUFDRCxDQWhCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogYXJyYXktZm9yZWFjaFxuICogICBBcnJheSNmb3JFYWNoIHBvbnlmaWxsIGZvciBvbGRlciBicm93c2Vyc1xuICogICAoUG9ueWZpbGw6IEEgcG9seWZpbGwgdGhhdCBkb2Vzbid0IG92ZXJ3cml0ZSB0aGUgbmF0aXZlIG1ldGhvZClcbiAqIFxuICogaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2hcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtMjAxNiBUYWt1dG8gV2FkYVxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogICBodHRwczovL2dpdGh1Yi5jb20vdHdhZGEvYXJyYXktZm9yZWFjaC9ibG9iL21hc3Rlci9NSVQtTElDRU5TRVxuICovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZm9yRWFjaCAoYXJ5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGlmIChhcnkuZm9yRWFjaCkge1xuICAgICAgICBhcnkuZm9yRWFjaChjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnkubGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgYXJ5W2ldLCBpLCBhcnkpO1xuICAgIH1cbn07XG4iLCIvKlxuICogY2xhc3NMaXN0LmpzOiBDcm9zcy1icm93c2VyIGZ1bGwgZWxlbWVudC5jbGFzc0xpc3QgaW1wbGVtZW50YXRpb24uXG4gKiAxLjEuMjAxNzA0MjdcbiAqXG4gKiBCeSBFbGkgR3JleSwgaHR0cDovL2VsaWdyZXkuY29tXG4gKiBMaWNlbnNlOiBEZWRpY2F0ZWQgdG8gdGhlIHB1YmxpYyBkb21haW4uXG4gKiAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuICovXG5cbi8qZ2xvYmFsIHNlbGYsIGRvY3VtZW50LCBET01FeGNlcHRpb24gKi9cblxuLyohIEBzb3VyY2UgaHR0cDovL3B1cmwuZWxpZ3JleS5jb20vZ2l0aHViL2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9jbGFzc0xpc3QuanMgKi9cblxuaWYgKFwiZG9jdW1lbnRcIiBpbiB3aW5kb3cuc2VsZikge1xuXG4vLyBGdWxsIHBvbHlmaWxsIGZvciBicm93c2VycyB3aXRoIG5vIGNsYXNzTGlzdCBzdXBwb3J0XG4vLyBJbmNsdWRpbmcgSUUgPCBFZGdlIG1pc3NpbmcgU1ZHRWxlbWVudC5jbGFzc0xpc3RcbmlmICghKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIikpIFxuXHR8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgJiYgIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpKSkge1xuXG4oZnVuY3Rpb24gKHZpZXcpIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmlmICghKCdFbGVtZW50JyBpbiB2aWV3KSkgcmV0dXJuO1xuXG52YXJcblx0ICBjbGFzc0xpc3RQcm9wID0gXCJjbGFzc0xpc3RcIlxuXHQsIHByb3RvUHJvcCA9IFwicHJvdG90eXBlXCJcblx0LCBlbGVtQ3RyUHJvdG8gPSB2aWV3LkVsZW1lbnRbcHJvdG9Qcm9wXVxuXHQsIG9iakN0ciA9IE9iamVjdFxuXHQsIHN0clRyaW0gPSBTdHJpbmdbcHJvdG9Qcm9wXS50cmltIHx8IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKTtcblx0fVxuXHQsIGFyckluZGV4T2YgPSBBcnJheVtwcm90b1Byb3BdLmluZGV4T2YgfHwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgaSA9IDBcblx0XHRcdCwgbGVuID0gdGhpcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gLTE7XG5cdH1cblx0Ly8gVmVuZG9yczogcGxlYXNlIGFsbG93IGNvbnRlbnQgY29kZSB0byBpbnN0YW50aWF0ZSBET01FeGNlcHRpb25zXG5cdCwgRE9NRXggPSBmdW5jdGlvbiAodHlwZSwgbWVzc2FnZSkge1xuXHRcdHRoaXMubmFtZSA9IHR5cGU7XG5cdFx0dGhpcy5jb2RlID0gRE9NRXhjZXB0aW9uW3R5cGVdO1xuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdH1cblx0LCBjaGVja1Rva2VuQW5kR2V0SW5kZXggPSBmdW5jdGlvbiAoY2xhc3NMaXN0LCB0b2tlbikge1xuXHRcdGlmICh0b2tlbiA9PT0gXCJcIikge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiU1lOVEFYX0VSUlwiXG5cdFx0XHRcdCwgXCJBbiBpbnZhbGlkIG9yIGlsbGVnYWwgc3RyaW5nIHdhcyBzcGVjaWZpZWRcIlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0aWYgKC9cXHMvLnRlc3QodG9rZW4pKSB7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdCAgXCJJTlZBTElEX0NIQVJBQ1RFUl9FUlJcIlxuXHRcdFx0XHQsIFwiU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiBhcnJJbmRleE9mLmNhbGwoY2xhc3NMaXN0LCB0b2tlbik7XG5cdH1cblx0LCBDbGFzc0xpc3QgPSBmdW5jdGlvbiAoZWxlbSkge1xuXHRcdHZhclxuXHRcdFx0ICB0cmltbWVkQ2xhc3NlcyA9IHN0clRyaW0uY2FsbChlbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpXG5cdFx0XHQsIGNsYXNzZXMgPSB0cmltbWVkQ2xhc3NlcyA/IHRyaW1tZWRDbGFzc2VzLnNwbGl0KC9cXHMrLykgOiBbXVxuXHRcdFx0LCBpID0gMFxuXHRcdFx0LCBsZW4gPSBjbGFzc2VzLmxlbmd0aFxuXHRcdDtcblx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHR0aGlzLnB1c2goY2xhc3Nlc1tpXSk7XG5cdFx0fVxuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy50b1N0cmluZygpKTtcblx0XHR9O1xuXHR9XG5cdCwgY2xhc3NMaXN0UHJvdG8gPSBDbGFzc0xpc3RbcHJvdG9Qcm9wXSA9IFtdXG5cdCwgY2xhc3NMaXN0R2V0dGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBuZXcgQ2xhc3NMaXN0KHRoaXMpO1xuXHR9XG47XG4vLyBNb3N0IERPTUV4Y2VwdGlvbiBpbXBsZW1lbnRhdGlvbnMgZG9uJ3QgYWxsb3cgY2FsbGluZyBET01FeGNlcHRpb24ncyB0b1N0cmluZygpXG4vLyBvbiBub24tRE9NRXhjZXB0aW9ucy4gRXJyb3IncyB0b1N0cmluZygpIGlzIHN1ZmZpY2llbnQgaGVyZS5cbkRPTUV4W3Byb3RvUHJvcF0gPSBFcnJvcltwcm90b1Byb3BdO1xuY2xhc3NMaXN0UHJvdG8uaXRlbSA9IGZ1bmN0aW9uIChpKSB7XG5cdHJldHVybiB0aGlzW2ldIHx8IG51bGw7XG59O1xuY2xhc3NMaXN0UHJvdG8uY29udGFpbnMgPSBmdW5jdGlvbiAodG9rZW4pIHtcblx0dG9rZW4gKz0gXCJcIjtcblx0cmV0dXJuIGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgIT09IC0xO1xufTtcbmNsYXNzTGlzdFByb3RvLmFkZCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHQ7XG5cdGRvIHtcblx0XHR0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG5cdFx0aWYgKGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgPT09IC0xKSB7XG5cdFx0XHR0aGlzLnB1c2godG9rZW4pO1xuXHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cdHdoaWxlICgrK2kgPCBsKTtcblxuXHRpZiAodXBkYXRlZCkge1xuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHR2YXJcblx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdCwgaSA9IDBcblx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0LCB0b2tlblxuXHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdFx0LCBpbmRleFxuXHQ7XG5cdGRvIHtcblx0XHR0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG5cdFx0aW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xuXHRcdHdoaWxlIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0aW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnRvZ2dsZSA9IGZ1bmN0aW9uICh0b2tlbiwgZm9yY2UpIHtcblx0dG9rZW4gKz0gXCJcIjtcblxuXHR2YXJcblx0XHQgIHJlc3VsdCA9IHRoaXMuY29udGFpbnModG9rZW4pXG5cdFx0LCBtZXRob2QgPSByZXN1bHQgP1xuXHRcdFx0Zm9yY2UgIT09IHRydWUgJiYgXCJyZW1vdmVcIlxuXHRcdDpcblx0XHRcdGZvcmNlICE9PSBmYWxzZSAmJiBcImFkZFwiXG5cdDtcblxuXHRpZiAobWV0aG9kKSB7XG5cdFx0dGhpc1ttZXRob2RdKHRva2VuKTtcblx0fVxuXG5cdGlmIChmb3JjZSA9PT0gdHJ1ZSB8fCBmb3JjZSA9PT0gZmFsc2UpIHtcblx0XHRyZXR1cm4gZm9yY2U7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuICFyZXN1bHQ7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuam9pbihcIiBcIik7XG59O1xuXG5pZiAob2JqQ3RyLmRlZmluZVByb3BlcnR5KSB7XG5cdHZhciBjbGFzc0xpc3RQcm9wRGVzYyA9IHtcblx0XHQgIGdldDogY2xhc3NMaXN0R2V0dGVyXG5cdFx0LCBlbnVtZXJhYmxlOiB0cnVlXG5cdFx0LCBjb25maWd1cmFibGU6IHRydWVcblx0fTtcblx0dHJ5IHtcblx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdH0gY2F0Y2ggKGV4KSB7IC8vIElFIDggZG9lc24ndCBzdXBwb3J0IGVudW1lcmFibGU6dHJ1ZVxuXHRcdC8vIGFkZGluZyB1bmRlZmluZWQgdG8gZmlnaHQgdGhpcyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvaXNzdWVzLzM2XG5cdFx0Ly8gbW9kZXJuaWUgSUU4LU1TVzcgbWFjaGluZSBoYXMgSUU4IDguMC42MDAxLjE4NzAyIGFuZCBpcyBhZmZlY3RlZFxuXHRcdGlmIChleC5udW1iZXIgPT09IHVuZGVmaW5lZCB8fCBleC5udW1iZXIgPT09IC0weDdGRjVFQzU0KSB7XG5cdFx0XHRjbGFzc0xpc3RQcm9wRGVzYy5lbnVtZXJhYmxlID0gZmFsc2U7XG5cdFx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdFx0fVxuXHR9XG59IGVsc2UgaWYgKG9iakN0cltwcm90b1Byb3BdLl9fZGVmaW5lR2V0dGVyX18pIHtcblx0ZWxlbUN0clByb3RvLl9fZGVmaW5lR2V0dGVyX18oY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0R2V0dGVyKTtcbn1cblxufSh3aW5kb3cuc2VsZikpO1xuXG59XG5cbi8vIFRoZXJlIGlzIGZ1bGwgb3IgcGFydGlhbCBuYXRpdmUgY2xhc3NMaXN0IHN1cHBvcnQsIHNvIGp1c3QgY2hlY2sgaWYgd2UgbmVlZFxuLy8gdG8gbm9ybWFsaXplIHRoZSBhZGQvcmVtb3ZlIGFuZCB0b2dnbGUgQVBJcy5cblxuKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIik7XG5cblx0dGVzdEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImMxXCIsIFwiYzJcIik7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwLzExIGFuZCBGaXJlZm94IDwyNiwgd2hlcmUgY2xhc3NMaXN0LmFkZCBhbmRcblx0Ly8gY2xhc3NMaXN0LnJlbW92ZSBleGlzdCBidXQgc3VwcG9ydCBvbmx5IG9uZSBhcmd1bWVudCBhdCBhIHRpbWUuXG5cdGlmICghdGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzJcIikpIHtcblx0XHR2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24obWV0aG9kKSB7XG5cdFx0XHR2YXIgb3JpZ2luYWwgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF07XG5cblx0XHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHRva2VuKSB7XG5cdFx0XHRcdHZhciBpLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRcdHRva2VuID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0XHRcdG9yaWdpbmFsLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0Y3JlYXRlTWV0aG9kKCdhZGQnKTtcblx0XHRjcmVhdGVNZXRob2QoJ3JlbW92ZScpO1xuXHR9XG5cblx0dGVzdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImMzXCIsIGZhbHNlKTtcblxuXHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAgYW5kIEZpcmVmb3ggPDI0LCB3aGVyZSBjbGFzc0xpc3QudG9nZ2xlIGRvZXMgbm90XG5cdC8vIHN1cHBvcnQgdGhlIHNlY29uZCBhcmd1bWVudC5cblx0aWYgKHRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMzXCIpKSB7XG5cdFx0dmFyIF90b2dnbGUgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZTtcblxuXHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24odG9rZW4sIGZvcmNlKSB7XG5cdFx0XHRpZiAoMSBpbiBhcmd1bWVudHMgJiYgIXRoaXMuY29udGFpbnModG9rZW4pID09PSAhZm9yY2UpIHtcblx0XHRcdFx0cmV0dXJuIGZvcmNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIF90b2dnbGUuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9XG5cblx0dGVzdEVsZW1lbnQgPSBudWxsO1xufSgpKTtcblxufVxuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5hcnJheS5mcm9tJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5BcnJheS5mcm9tO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmFzc2lnbjtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICh0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuIiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcbi8vIEVTMyB3cm9uZyBoZXJlXG52YXIgQVJHID0gY29mKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59O1xuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHsgdmVyc2lvbjogJzIuNi4xMicgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBpbmRleCwgdmFsdWUpIHtcbiAgaWYgKGluZGV4IGluIG9iamVjdCkgJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV07XG4gIHZhciBleHBvcnRzID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XG4gIHZhciBleHBQcm90byA9IGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pO1xuICB2YXIga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZiAoSVNfR0xPQkFMKSBzb3VyY2UgPSBuYW1lO1xuICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGV4cCA9IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICBpZiAodGFyZ2V0KSByZWRlZmluZSh0YXJnZXQsIGtleSwgb3V0LCB0eXBlICYgJGV4cG9ydC5VKTtcbiAgICAvLyBleHBvcnRcbiAgICBpZiAoZXhwb3J0c1trZXldICE9IG91dCkgaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYgKElTX1BST1RPICYmIGV4cFByb3RvW2tleV0gIT0gb3V0KSBleHBQcm90b1trZXldID0gb3V0O1xuICB9XG59O1xuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnbmF0aXZlLWZ1bmN0aW9uLXRvLXN0cmluZycsIEZ1bmN0aW9uLnRvU3RyaW5nKTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgdHlwZW9mIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXSAhPSAnZnVuY3Rpb24nKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyIHBJRSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgJGFzc2lnbiA9IE9iamVjdC5hc3NpZ247XG5cbi8vIHNob3VsZCB3b3JrIHdpdGggc3ltYm9scyBhbmQgc2hvdWxkIGhhdmUgZGV0ZXJtaW5pc3RpYyBwcm9wZXJ0eSBvcmRlciAoVjggYnVnKVxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgdmFyIEEgPSB7fTtcbiAgdmFyIEIgPSB7fTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHZhciBTID0gU3ltYm9sKCk7XG4gIHZhciBLID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtTXSA9IDc7XG4gIEsuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGspIHsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgPSB0b09iamVjdCh0YXJnZXQpO1xuICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDE7XG4gIHZhciBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICB2YXIgaXNFbnVtID0gcElFLmY7XG4gIHdoaWxlIChhTGVuID4gaW5kZXgpIHtcbiAgICB2YXIgUyA9IElPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICB2YXIga2V5cyA9IGdldFN5bWJvbHMgPyBnZXRLZXlzKFMpLmNvbmNhdChnZXRTeW1ib2xzKFMpKSA6IGdldEtleXMoUyk7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBqID0gMDtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChsZW5ndGggPiBqKSB7XG4gICAgICBrZXkgPSBrZXlzW2orK107XG4gICAgICBpZiAoIURFU0NSSVBUT1JTIHx8IGlzRW51bS5jYWxsKFMsIGtleSkpIFRba2V5XSA9IFNba2V5XTtcbiAgICB9XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBTUkMgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJyk7XG52YXIgJHRvU3RyaW5nID0gcmVxdWlyZSgnLi9fZnVuY3Rpb24tdG8tc3RyaW5nJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciBUUEwgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vX2NvcmUnKS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiAkdG9TdHJpbmcuY2FsbChpdCk7XG59O1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWwsIHNhZmUpIHtcbiAgdmFyIGlzRnVuY3Rpb24gPSB0eXBlb2YgdmFsID09ICdmdW5jdGlvbic7XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCAnbmFtZScpIHx8IGhpZGUodmFsLCAnbmFtZScsIGtleSk7XG4gIGlmIChPW2tleV0gPT09IHZhbCkgcmV0dXJuO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgU1JDKSB8fCBoaWRlKHZhbCwgU1JDLCBPW2tleV0gPyAnJyArIE9ba2V5XSA6IFRQTC5qb2luKFN0cmluZyhrZXkpKSk7XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoIXNhZmUpIHtcbiAgICBkZWxldGUgT1trZXldO1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9IGVsc2UgaWYgKE9ba2V5XSkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIHtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfVxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIHRoaXNbU1JDXSB8fCAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pO1xuIiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCB0YWcsIHN0YXQpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpIGRlZihpdCwgVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZyB9KTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTtcbiIsInZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogY29yZS52ZXJzaW9uLFxuICBtb2RlOiByZXF1aXJlKCcuL19saWJyYXJ5JykgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAyMCBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRPX1NUUklORykge1xuICByZXR1cm4gZnVuY3Rpb24gKHRoYXQsIHBvcykge1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpO1xuICAgIHZhciBpID0gdG9JbnRlZ2VyKHBvcyk7XG4gICAgdmFyIGwgPSBzLmxlbmd0aDtcbiAgICB2YXIgYSwgYjtcbiAgICBpZiAoaSA8IDAgfHwgaSA+PSBsKSByZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbmRleCwgbGVuZ3RoKSB7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59O1xuIiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07XG4iLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBTKSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciBpZCA9IDA7XG52YXIgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59O1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbDtcbnZhciBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uIChpdGVyKSB7IEFycmF5LmZyb20oaXRlcik7IH0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UgLyogLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCAqLykge1xuICAgIHZhciBPID0gdG9PYmplY3QoYXJyYXlMaWtlKTtcbiAgICB2YXIgQyA9IHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXk7XG4gICAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBtYXBmbiA9IGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBpdGVyRm4gPSBnZXRJdGVyRm4oTyk7XG4gICAgdmFyIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZiAobWFwcGluZykgbWFwZm4gPSBjdHgobWFwZm4sIGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkLCAyKTtcbiAgICAvLyBpZiBvYmplY3QgaXNuJ3QgaXRlcmFibGUgb3IgaXQncyBhcnJheSB3aXRoIGRlZmF1bHQgaXRlcmF0b3IgLSB1c2Ugc2ltcGxlIGNhc2VcbiAgICBpZiAoaXRlckZuICE9IHVuZGVmaW5lZCAmJiAhKEMgPT0gQXJyYXkgJiYgaXNBcnJheUl0ZXIoaXRlckZuKSkpIHtcbiAgICAgIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChPKSwgcmVzdWx0ID0gbmV3IEMoKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBtYXBmbiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgICAgZm9yIChyZXN1bHQgPSBuZXcgQyhsZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0JywgeyBhc3NpZ246IHJlcXVpcmUoJy4vX29iamVjdC1hc3NpZ24nKSB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbiAoaXRlcmF0ZWQpIHtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24gKCkge1xuICB2YXIgTyA9IHRoaXMuX3Q7XG4gIHZhciBpbmRleCA9IHRoaXMuX2k7XG4gIHZhciBwb2ludDtcbiAgaWYgKGluZGV4ID49IE8ubGVuZ3RoKSByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7IHZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2UgfTtcbn0pO1xuIiwiLyogZ2xvYmFsIGRlZmluZSwgS2V5Ym9hcmRFdmVudCwgbW9kdWxlICovXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IHtcbiAgICBwb2x5ZmlsbDogcG9seWZpbGwsXG4gICAga2V5czoge1xuICAgICAgMzogJ0NhbmNlbCcsXG4gICAgICA2OiAnSGVscCcsXG4gICAgICA4OiAnQmFja3NwYWNlJyxcbiAgICAgIDk6ICdUYWInLFxuICAgICAgMTI6ICdDbGVhcicsXG4gICAgICAxMzogJ0VudGVyJyxcbiAgICAgIDE2OiAnU2hpZnQnLFxuICAgICAgMTc6ICdDb250cm9sJyxcbiAgICAgIDE4OiAnQWx0JyxcbiAgICAgIDE5OiAnUGF1c2UnLFxuICAgICAgMjA6ICdDYXBzTG9jaycsXG4gICAgICAyNzogJ0VzY2FwZScsXG4gICAgICAyODogJ0NvbnZlcnQnLFxuICAgICAgMjk6ICdOb25Db252ZXJ0JyxcbiAgICAgIDMwOiAnQWNjZXB0JyxcbiAgICAgIDMxOiAnTW9kZUNoYW5nZScsXG4gICAgICAzMjogJyAnLFxuICAgICAgMzM6ICdQYWdlVXAnLFxuICAgICAgMzQ6ICdQYWdlRG93bicsXG4gICAgICAzNTogJ0VuZCcsXG4gICAgICAzNjogJ0hvbWUnLFxuICAgICAgMzc6ICdBcnJvd0xlZnQnLFxuICAgICAgMzg6ICdBcnJvd1VwJyxcbiAgICAgIDM5OiAnQXJyb3dSaWdodCcsXG4gICAgICA0MDogJ0Fycm93RG93bicsXG4gICAgICA0MTogJ1NlbGVjdCcsXG4gICAgICA0MjogJ1ByaW50JyxcbiAgICAgIDQzOiAnRXhlY3V0ZScsXG4gICAgICA0NDogJ1ByaW50U2NyZWVuJyxcbiAgICAgIDQ1OiAnSW5zZXJ0JyxcbiAgICAgIDQ2OiAnRGVsZXRlJyxcbiAgICAgIDQ4OiBbJzAnLCAnKSddLFxuICAgICAgNDk6IFsnMScsICchJ10sXG4gICAgICA1MDogWycyJywgJ0AnXSxcbiAgICAgIDUxOiBbJzMnLCAnIyddLFxuICAgICAgNTI6IFsnNCcsICckJ10sXG4gICAgICA1MzogWyc1JywgJyUnXSxcbiAgICAgIDU0OiBbJzYnLCAnXiddLFxuICAgICAgNTU6IFsnNycsICcmJ10sXG4gICAgICA1NjogWyc4JywgJyonXSxcbiAgICAgIDU3OiBbJzknLCAnKCddLFxuICAgICAgOTE6ICdPUycsXG4gICAgICA5MzogJ0NvbnRleHRNZW51JyxcbiAgICAgIDE0NDogJ051bUxvY2snLFxuICAgICAgMTQ1OiAnU2Nyb2xsTG9jaycsXG4gICAgICAxODE6ICdWb2x1bWVNdXRlJyxcbiAgICAgIDE4MjogJ1ZvbHVtZURvd24nLFxuICAgICAgMTgzOiAnVm9sdW1lVXAnLFxuICAgICAgMTg2OiBbJzsnLCAnOiddLFxuICAgICAgMTg3OiBbJz0nLCAnKyddLFxuICAgICAgMTg4OiBbJywnLCAnPCddLFxuICAgICAgMTg5OiBbJy0nLCAnXyddLFxuICAgICAgMTkwOiBbJy4nLCAnPiddLFxuICAgICAgMTkxOiBbJy8nLCAnPyddLFxuICAgICAgMTkyOiBbJ2AnLCAnfiddLFxuICAgICAgMjE5OiBbJ1snLCAneyddLFxuICAgICAgMjIwOiBbJ1xcXFwnLCAnfCddLFxuICAgICAgMjIxOiBbJ10nLCAnfSddLFxuICAgICAgMjIyOiBbXCInXCIsICdcIiddLFxuICAgICAgMjI0OiAnTWV0YScsXG4gICAgICAyMjU6ICdBbHRHcmFwaCcsXG4gICAgICAyNDY6ICdBdHRuJyxcbiAgICAgIDI0NzogJ0NyU2VsJyxcbiAgICAgIDI0ODogJ0V4U2VsJyxcbiAgICAgIDI0OTogJ0VyYXNlRW9mJyxcbiAgICAgIDI1MDogJ1BsYXknLFxuICAgICAgMjUxOiAnWm9vbU91dCdcbiAgICB9XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24ga2V5cyAoRjEtMjQpLlxuICB2YXIgaTtcbiAgZm9yIChpID0gMTsgaSA8IDI1OyBpKyspIHtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1sxMTEgKyBpXSA9ICdGJyArIGk7XG4gIH1cblxuICAvLyBQcmludGFibGUgQVNDSUkgY2hhcmFjdGVycy5cbiAgdmFyIGxldHRlciA9ICcnO1xuICBmb3IgKGkgPSA2NTsgaSA8IDkxOyBpKyspIHtcbiAgICBsZXR0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpO1xuICAgIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW2ldID0gW2xldHRlci50b0xvd2VyQ2FzZSgpLCBsZXR0ZXIudG9VcHBlckNhc2UoKV07XG4gIH1cblxuICBmdW5jdGlvbiBwb2x5ZmlsbCAoKSB7XG4gICAgaWYgKCEoJ0tleWJvYXJkRXZlbnQnIGluIHdpbmRvdykgfHxcbiAgICAgICAgJ2tleScgaW4gS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBQb2x5ZmlsbCBga2V5YCBvbiBgS2V5Ym9hcmRFdmVudGAuXG4gICAgdmFyIHByb3RvID0ge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoeCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbdGhpcy53aGljaCB8fCB0aGlzLmtleUNvZGVdO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICBrZXkgPSBrZXlbK3RoaXMuc2hpZnRLZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgIH1cbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShLZXlib2FyZEV2ZW50LnByb3RvdHlwZSwgJ2tleScsIHByb3RvKTtcbiAgICByZXR1cm4gcHJvdG87XG4gIH1cblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCcsIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH0gZWxzZSBpZiAod2luZG93KSB7XG4gICAgd2luZG93LmtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbCA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcbiAgfVxuXG59KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcHJvdG8gPSB0eXBlb2YgRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBFbGVtZW50LnByb3RvdHlwZSA6IHt9O1xudmFyIHZlbmRvciA9IHByb3RvLm1hdGNoZXNcbiAgfHwgcHJvdG8ubWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ub01hdGNoZXNTZWxlY3RvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaDtcblxuLyoqXG4gKiBNYXRjaCBgZWxgIHRvIGBzZWxlY3RvcmAuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBtYXRjaChlbCwgc2VsZWN0b3IpIHtcbiAgaWYgKCFlbCB8fCBlbC5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuIGZhbHNlO1xuICBpZiAodmVuZG9yKSByZXR1cm4gdmVuZG9yLmNhbGwoZWwsIHNlbGVjdG9yKTtcbiAgdmFyIG5vZGVzID0gZWwucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChub2Rlc1tpXSA9PSBlbCkgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsImNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcbmNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuY29uc3QgZGVsZWdhdGVBbGwgPSByZXF1aXJlKCcuL2RlbGVnYXRlQWxsJyk7XG5cbmNvbnN0IERFTEVHQVRFX1BBVFRFUk4gPSAvXiguKyk6ZGVsZWdhdGVcXCgoLispXFwpJC87XG5jb25zdCBTUEFDRSA9ICcgJztcblxuY29uc3QgZ2V0TGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSwgaGFuZGxlcikge1xuICB2YXIgbWF0Y2ggPSB0eXBlLm1hdGNoKERFTEVHQVRFX1BBVFRFUk4pO1xuICB2YXIgc2VsZWN0b3I7XG4gIGlmIChtYXRjaCkge1xuICAgIHR5cGUgPSBtYXRjaFsxXTtcbiAgICBzZWxlY3RvciA9IG1hdGNoWzJdO1xuICB9XG5cbiAgdmFyIG9wdGlvbnM7XG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zID0ge1xuICAgICAgY2FwdHVyZTogcG9wS2V5KGhhbmRsZXIsICdjYXB0dXJlJyksXG4gICAgICBwYXNzaXZlOiBwb3BLZXkoaGFuZGxlciwgJ3Bhc3NpdmUnKVxuICAgIH07XG4gIH1cblxuICB2YXIgbGlzdGVuZXIgPSB7XG4gICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgIGRlbGVnYXRlOiAodHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnKVxuICAgICAgPyBkZWxlZ2F0ZUFsbChoYW5kbGVyKVxuICAgICAgOiBzZWxlY3RvclxuICAgICAgICA/IGRlbGVnYXRlKHNlbGVjdG9yLCBoYW5kbGVyKVxuICAgICAgICA6IGhhbmRsZXIsXG4gICAgb3B0aW9uczogb3B0aW9uc1xuICB9O1xuXG4gIGlmICh0eXBlLmluZGV4T2YoU1BBQ0UpID4gLTEpIHtcbiAgICByZXR1cm4gdHlwZS5zcGxpdChTUEFDRSkubWFwKGZ1bmN0aW9uKF90eXBlKSB7XG4gICAgICByZXR1cm4gYXNzaWduKHt0eXBlOiBfdHlwZX0sIGxpc3RlbmVyKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0ZW5lci50eXBlID0gdHlwZTtcbiAgICByZXR1cm4gW2xpc3RlbmVyXTtcbiAgfVxufTtcblxudmFyIHBvcEtleSA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICBkZWxldGUgb2JqW2tleV07XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmVoYXZpb3IoZXZlbnRzLCBwcm9wcykge1xuICBjb25zdCBsaXN0ZW5lcnMgPSBPYmplY3Qua2V5cyhldmVudHMpXG4gICAgLnJlZHVjZShmdW5jdGlvbihtZW1vLCB0eXBlKSB7XG4gICAgICB2YXIgbGlzdGVuZXJzID0gZ2V0TGlzdGVuZXJzKHR5cGUsIGV2ZW50c1t0eXBlXSk7XG4gICAgICByZXR1cm4gbWVtby5jb25jYXQobGlzdGVuZXJzKTtcbiAgICB9LCBbXSk7XG5cbiAgcmV0dXJuIGFzc2lnbih7XG4gICAgYWRkOiBmdW5jdGlvbiBhZGRCZWhhdmlvcihlbGVtZW50KSB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgbGlzdGVuZXIudHlwZSxcbiAgICAgICAgICBsaXN0ZW5lci5kZWxlZ2F0ZSxcbiAgICAgICAgICBsaXN0ZW5lci5vcHRpb25zXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlQmVoYXZpb3IoZWxlbWVudCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGxpc3RlbmVyLnR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIuZGVsZWdhdGUsXG4gICAgICAgICAgbGlzdGVuZXIub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCBwcm9wcyk7XG59O1xuIiwiY29uc3QgbWF0Y2hlcyA9IHJlcXVpcmUoJ21hdGNoZXMtc2VsZWN0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbGVtZW50LCBzZWxlY3Rvcikge1xuICBkbyB7XG4gICAgaWYgKG1hdGNoZXMoZWxlbWVudCwgc2VsZWN0b3IpKSB7XG4gICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG4gIH0gd2hpbGUgKChlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSAmJiBlbGVtZW50Lm5vZGVUeXBlID09PSAxKTtcbn07XG5cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcG9zZShmdW5jdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb25zLnNvbWUoZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpID09PSBmYWxzZTtcbiAgICB9LCB0aGlzKTtcbiAgfTtcbn07XG4iLCJjb25zdCBjbG9zZXN0ID0gcmVxdWlyZSgnLi9jbG9zZXN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVsZWdhdGUoc2VsZWN0b3IsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBkZWxlZ2F0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHRhcmdldCA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCBzZWxlY3Rvcik7XG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGFyZ2V0LCBldmVudCk7XG4gICAgfVxuICB9XG59O1xuIiwiY29uc3QgZGVsZWdhdGUgPSByZXF1aXJlKCcuL2RlbGVnYXRlJyk7XG5jb25zdCBjb21wb3NlID0gcmVxdWlyZSgnLi9jb21wb3NlJyk7XG5cbmNvbnN0IFNQTEFUID0gJyonO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlQWxsKHNlbGVjdG9ycykge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoc2VsZWN0b3JzKVxuXG4gIC8vIFhYWCBvcHRpbWl6YXRpb246IGlmIHRoZXJlIGlzIG9ubHkgb25lIGhhbmRsZXIgYW5kIGl0IGFwcGxpZXMgdG9cbiAgLy8gYWxsIGVsZW1lbnRzICh0aGUgXCIqXCIgQ1NTIHNlbGVjdG9yKSwgdGhlbiBqdXN0IHJldHVybiB0aGF0XG4gIC8vIGhhbmRsZXJcbiAgaWYgKGtleXMubGVuZ3RoID09PSAxICYmIGtleXNbMF0gPT09IFNQTEFUKSB7XG4gICAgcmV0dXJuIHNlbGVjdG9yc1tTUExBVF07XG4gIH1cblxuICBjb25zdCBkZWxlZ2F0ZXMgPSBrZXlzLnJlZHVjZShmdW5jdGlvbihtZW1vLCBzZWxlY3Rvcikge1xuICAgIG1lbW8ucHVzaChkZWxlZ2F0ZShzZWxlY3Rvciwgc2VsZWN0b3JzW3NlbGVjdG9yXSkpO1xuICAgIHJldHVybiBtZW1vO1xuICB9LCBbXSk7XG4gIHJldHVybiBjb21wb3NlKGRlbGVnYXRlcyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpZ25vcmUoZWxlbWVudCwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGlnbm9yYW5jZShlKSB7XG4gICAgaWYgKGVsZW1lbnQgIT09IGUudGFyZ2V0ICYmICFlbGVtZW50LmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZSk7XG4gICAgfVxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGJlaGF2aW9yOiByZXF1aXJlKCcuL2JlaGF2aW9yJyksXG4gIGRlbGVnYXRlOiByZXF1aXJlKCcuL2RlbGVnYXRlJyksXG4gIGRlbGVnYXRlQWxsOiByZXF1aXJlKCcuL2RlbGVnYXRlQWxsJyksXG4gIGlnbm9yZTogcmVxdWlyZSgnLi9pZ25vcmUnKSxcbiAga2V5bWFwOiByZXF1aXJlKCcuL2tleW1hcCcpLFxufTtcbiIsInJlcXVpcmUoJ2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsJyk7XG5cbi8vIHRoZXNlIGFyZSB0aGUgb25seSByZWxldmFudCBtb2RpZmllcnMgc3VwcG9ydGVkIG9uIGFsbCBwbGF0Zm9ybXMsXG4vLyBhY2NvcmRpbmcgdG8gTUROOlxuLy8gPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9LZXlib2FyZEV2ZW50L2dldE1vZGlmaWVyU3RhdGU+XG5jb25zdCBNT0RJRklFUlMgPSB7XG4gICdBbHQnOiAgICAgICdhbHRLZXknLFxuICAnQ29udHJvbCc6ICAnY3RybEtleScsXG4gICdDdHJsJzogICAgICdjdHJsS2V5JyxcbiAgJ1NoaWZ0JzogICAgJ3NoaWZ0S2V5J1xufTtcblxuY29uc3QgTU9ESUZJRVJfU0VQQVJBVE9SID0gJysnO1xuXG5jb25zdCBnZXRFdmVudEtleSA9IGZ1bmN0aW9uKGV2ZW50LCBoYXNNb2RpZmllcnMpIHtcbiAgdmFyIGtleSA9IGV2ZW50LmtleTtcbiAgaWYgKGhhc01vZGlmaWVycykge1xuICAgIGZvciAodmFyIG1vZGlmaWVyIGluIE1PRElGSUVSUykge1xuICAgICAgaWYgKGV2ZW50W01PRElGSUVSU1ttb2RpZmllcl1dID09PSB0cnVlKSB7XG4gICAgICAgIGtleSA9IFttb2RpZmllciwga2V5XS5qb2luKE1PRElGSUVSX1NFUEFSQVRPUik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBrZXk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGtleW1hcChrZXlzKSB7XG4gIGNvbnN0IGhhc01vZGlmaWVycyA9IE9iamVjdC5rZXlzKGtleXMpLnNvbWUoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGtleS5pbmRleE9mKE1PRElGSUVSX1NFUEFSQVRPUikgPiAtMTtcbiAgfSk7XG4gIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBrZXkgPSBnZXRFdmVudEtleShldmVudCwgaGFzTW9kaWZpZXJzKTtcbiAgICByZXR1cm4gW2tleSwga2V5LnRvTG93ZXJDYXNlKCldXG4gICAgICAucmVkdWNlKGZ1bmN0aW9uKHJlc3VsdCwgX2tleSkge1xuICAgICAgICBpZiAoX2tleSBpbiBrZXlzKSB7XG4gICAgICAgICAgcmVzdWx0ID0ga2V5c1trZXldLmNhbGwodGhpcywgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9LCB1bmRlZmluZWQpO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMuTU9ESUZJRVJTID0gTU9ESUZJRVJTO1xuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgJy4uL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZCc7XHJcbmNvbnN0IHRvZ2dsZSA9IHJlcXVpcmUoJy4uL3V0aWxzL3RvZ2dsZScpO1xyXG5jb25zdCBpc0VsZW1lbnRJblZpZXdwb3J0ID0gcmVxdWlyZSgnLi4vdXRpbHMvaXMtaW4tdmlld3BvcnQnKTtcclxuY29uc3QgQlVUVE9OID0gYC5hY2NvcmRpb24tYnV0dG9uW2FyaWEtY29udHJvbHNdYDtcclxuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XHJcbmNvbnN0IE1VTFRJU0VMRUNUQUJMRSA9ICdhcmlhLW11bHRpc2VsZWN0YWJsZSc7XHJcbmNvbnN0IE1VTFRJU0VMRUNUQUJMRV9DTEFTUyA9ICdhY2NvcmRpb24tbXVsdGlzZWxlY3RhYmxlJztcclxuY29uc3QgQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFID0gXCJkYXRhLWFjY29yZGlvbi1idWxrLWV4cGFuZFwiO1xyXG5sZXQgdGV4dCA9IHtcclxuICBcIm9wZW5fYWxsXCI6IFwiw4VibiBhbGxlXCIsXHJcbiAgXCJjbG9zZV9hbGxcIjogXCJMdWsgYWxsZVwiXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gYWNjb3JkaW9uIGxpc3RcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJGFjY29yZGlvbiB0aGUgYWNjb3JkaW9uIHVsIGVsZW1lbnRcclxuICogQHBhcmFtIHtKU09OfSBzdHJpbmdzIFRyYW5zbGF0ZSBsYWJlbHM6IHtcIm9wZW5fYWxsXCI6IFwiw4VibiBhbGxlXCIsIFwiY2xvc2VfYWxsXCI6IFwiTHVrIGFsbGVcIn1cclxuICovXHJcbmZ1bmN0aW9uIEFjY29yZGlvbigkYWNjb3JkaW9uLCBzdHJpbmdzID0gdGV4dCkge1xyXG4gIGlmKCEkYWNjb3JkaW9uKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBhY2NvcmRpb24gZ3JvdXAgZWxlbWVudGApO1xyXG4gIH1cclxuICB0aGlzLmFjY29yZGlvbiA9ICRhY2NvcmRpb247XHJcbiAgdGV4dCA9IHN0cmluZ3M7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRsaXN0ZW5lcnMgb24gY2xpY2sgZWxlbWVudHMgaW4gYWNjb3JkaW9uIGxpc3RcclxuICovXHJcbkFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5idXR0b25zID0gdGhpcy5hY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xyXG4gIGlmKHRoaXMuYnV0dG9ucy5sZW5ndGggPT0gMCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgYWNjb3JkaW9uIGJ1dHRvbnNgKTtcclxuICB9XHJcblxyXG4gIC8vIGxvb3AgYnV0dG9ucyBpbiBsaXN0XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspe1xyXG4gICAgbGV0IGN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnNbaV07XHJcbiAgICBcclxuICAgIC8vIFZlcmlmeSBzdGF0ZSBvbiBidXR0b24gYW5kIHN0YXRlIG9uIHBhbmVsXHJcbiAgICBsZXQgZXhwYW5kZWQgPSBjdXJyZW50QnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJztcclxuICAgIHRoaXMudG9nZ2xlQnV0dG9uKGN1cnJlbnRCdXR0b24sIGV4cGFuZGVkKTtcclxuICAgIFxyXG4gICAgLy8gU2V0IGNsaWNrIGV2ZW50IG9uIGFjY29yZGlvbiBidXR0b25zXHJcbiAgICBjdXJyZW50QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ldmVudE9uQ2xpY2suYmluZCh0aGlzLCBjdXJyZW50QnV0dG9uKSwgZmFsc2UpO1xyXG4gICAgY3VycmVudEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZXZlbnRPbkNsaWNrLmJpbmQodGhpcywgY3VycmVudEJ1dHRvbiksIGZhbHNlKTtcclxuICB9XHJcbiAgLy8gU2V0IGNsaWNrIGV2ZW50IG9uIGJ1bGsgYnV0dG9uIGlmIHByZXNlbnRcclxuICBsZXQgcHJldlNpYmxpbmcgPSB0aGlzLmFjY29yZGlvbi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nIDtcclxuICBpZihwcmV2U2libGluZyAhPT0gbnVsbCAmJiBwcmV2U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbi1idWxrLWJ1dHRvbicpKXtcclxuICAgIHRoaXMuYnVsa0Z1bmN0aW9uQnV0dG9uID0gcHJldlNpYmxpbmc7XHJcbiAgICB0aGlzLmJ1bGtGdW5jdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYnVsa0V2ZW50LmJpbmQodGhpcykpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEJ1bGsgZXZlbnQgaGFuZGxlcjogVHJpZ2dlcmVkIHdoZW4gY2xpY2tpbmcgb24gLmFjY29yZGlvbi1idWxrLWJ1dHRvblxyXG4gKi9cclxuQWNjb3JkaW9uLnByb3RvdHlwZS5idWxrRXZlbnQgPSBmdW5jdGlvbigpe1xyXG4gIHZhciAkbW9kdWxlID0gdGhpcztcclxuICBpZighJG1vZHVsZS5hY2NvcmRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24nKSl7ICBcclxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYWNjb3JkaW9uLmApO1xyXG4gIH1cclxuICBpZigkbW9kdWxlLmJ1dHRvbnMubGVuZ3RoID09IDApe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGFjY29yZGlvbiBidXR0b25zYCk7XHJcbiAgfVxyXG4gICAgXHJcbiAgbGV0IGV4cGFuZCA9IHRydWU7XHJcbiAgaWYoJG1vZHVsZS5idWxrRnVuY3Rpb25CdXR0b24uZ2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSkgPT09IFwiZmFsc2VcIikge1xyXG4gICAgZXhwYW5kID0gZmFsc2U7XHJcbiAgfVxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgJG1vZHVsZS5idXR0b25zLmxlbmd0aDsgaSsrKXtcclxuICAgICRtb2R1bGUudG9nZ2xlQnV0dG9uKCRtb2R1bGUuYnV0dG9uc1tpXSwgZXhwYW5kLCB0cnVlKTtcclxuICB9XHJcbiAgXHJcbiAgJG1vZHVsZS5idWxrRnVuY3Rpb25CdXR0b24uc2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSwgIWV4cGFuZCk7XHJcbiAgaWYoIWV4cGFuZCA9PT0gdHJ1ZSl7XHJcbiAgICAkbW9kdWxlLmJ1bGtGdW5jdGlvbkJ1dHRvbi5pbm5lclRleHQgPSB0ZXh0Lm9wZW5fYWxsO1xyXG4gIH0gZWxzZXtcclxuICAgICRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLmlubmVyVGV4dCA9IHRleHQuY2xvc2VfYWxsO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFjY29yZGlvbiBidXR0b24gZXZlbnQgaGFuZGxlcjogVG9nZ2xlcyBhY2NvcmRpb25cclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gJGJ1dHRvbiBcclxuICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGUgXHJcbiAqL1xyXG5BY2NvcmRpb24ucHJvdG90eXBlLmV2ZW50T25DbGljayA9IGZ1bmN0aW9uICgkYnV0dG9uLCBlKSB7XHJcbiAgdmFyICRtb2R1bGUgPSB0aGlzO1xyXG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICRtb2R1bGUudG9nZ2xlQnV0dG9uKCRidXR0b24pO1xyXG4gIGlmICgkYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJykge1xyXG4gICAgLy8gV2Ugd2VyZSBqdXN0IGV4cGFuZGVkLCBidXQgaWYgYW5vdGhlciBhY2NvcmRpb24gd2FzIGFsc28ganVzdFxyXG4gICAgLy8gY29sbGFwc2VkLCB3ZSBtYXkgbm8gbG9uZ2VyIGJlIGluIHRoZSB2aWV3cG9ydC4gVGhpcyBlbnN1cmVzXHJcbiAgICAvLyB0aGF0IHdlIGFyZSBzdGlsbCB2aXNpYmxlLCBzbyB0aGUgdXNlciBpc24ndCBjb25mdXNlZC5cclxuICAgIGlmICghaXNFbGVtZW50SW5WaWV3cG9ydCgkYnV0dG9uKSkgJGJ1dHRvbi5zY3JvbGxJbnRvVmlldygpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSBhIGJ1dHRvbidzIFwicHJlc3NlZFwiIHN0YXRlLCBvcHRpb25hbGx5IHByb3ZpZGluZyBhIHRhcmdldFxyXG4gKiBzdGF0ZS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbj99IGV4cGFuZGVkIElmIG5vIHN0YXRlIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudFxyXG4gKiBzdGF0ZSB3aWxsIGJlIHRvZ2dsZWQgKGZyb20gZmFsc2UgdG8gdHJ1ZSwgYW5kIHZpY2UtdmVyc2EpLlxyXG4gKiBAcmV0dXJuIHtib29sZWFufSB0aGUgcmVzdWx0aW5nIHN0YXRlXHJcbiAqL1xyXG4gQWNjb3JkaW9uLnByb3RvdHlwZS50b2dnbGVCdXR0b24gPSBmdW5jdGlvbiAoYnV0dG9uLCBleHBhbmRlZCwgYnVsayA9IGZhbHNlKSB7XHJcbiAgbGV0IGFjY29yZGlvbiA9IG51bGw7XHJcbiAgaWYoYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbicpKXtcclxuICAgIGFjY29yZGlvbiA9IGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgfSBlbHNlIGlmKGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbicpKXtcclxuICAgIGFjY29yZGlvbiA9IGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICB9XHJcbiAgZXhwYW5kZWQgPSB0b2dnbGUoYnV0dG9uLCBleHBhbmRlZCk7XHJcbiAgaWYoZXhwYW5kZWQpeyAgICBcclxuICAgIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5hY2NvcmRpb24ub3BlbicpO1xyXG4gICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICB9IGVsc2V7XHJcbiAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmFjY29yZGlvbi5jbG9zZScpO1xyXG4gICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgfVxyXG5cclxuICBsZXQgbXVsdGlzZWxlY3RhYmxlID0gZmFsc2U7XHJcbiAgaWYoYWNjb3JkaW9uICE9PSBudWxsICYmIChhY2NvcmRpb24uZ2V0QXR0cmlidXRlKE1VTFRJU0VMRUNUQUJMRSkgPT09ICd0cnVlJyB8fCBhY2NvcmRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKE1VTFRJU0VMRUNUQUJMRV9DTEFTUykpKXtcclxuICAgIG11bHRpc2VsZWN0YWJsZSA9IHRydWU7XHJcbiAgICBsZXQgYnVsa0Z1bmN0aW9uID0gYWNjb3JkaW9uLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICBpZihidWxrRnVuY3Rpb24gIT09IG51bGwgJiYgYnVsa0Z1bmN0aW9uLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uLWJ1bGstYnV0dG9uJykpe1xyXG4gICAgICBsZXQgYnV0dG9ucyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbiAgICAgIGlmKGJ1bGsgPT09IGZhbHNlKXtcclxuICAgICAgICBsZXQgYnV0dG9uc09wZW4gPSBhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04rJ1thcmlhLWV4cGFuZGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgICAgIGxldCBuZXdTdGF0dXMgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZihidXR0b25zLmxlbmd0aCA9PT0gYnV0dG9uc09wZW4ubGVuZ3RoKXtcclxuICAgICAgICAgIG5ld1N0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBidWxrRnVuY3Rpb24uc2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSwgbmV3U3RhdHVzKTtcclxuICAgICAgICBpZihuZXdTdGF0dXMgPT09IHRydWUpe1xyXG4gICAgICAgICAgYnVsa0Z1bmN0aW9uLmlubmVyVGV4dCA9IHRleHQub3Blbl9hbGw7XHJcbiAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgYnVsa0Z1bmN0aW9uLmlubmVyVGV4dCA9IHRleHQuY2xvc2VfYWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGV4cGFuZGVkICYmICFtdWx0aXNlbGVjdGFibGUpIHtcclxuICAgIGxldCBidXR0b25zID0gWyBidXR0b24gXTtcclxuICAgIGlmKGFjY29yZGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICBidXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBjdXJyZW50QnV0dHRvbiA9IGJ1dHRvbnNbaV07XHJcbiAgICAgIGlmIChjdXJyZW50QnV0dHRvbiAhPT0gYnV0dG9uICYmIGN1cnJlbnRCdXR0dG9uLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcgPT09IHRydWUpKSB7XHJcbiAgICAgICAgdG9nZ2xlKGN1cnJlbnRCdXR0dG9uLCBmYWxzZSk7XHJcbiAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5hY2NvcmRpb24uY2xvc2UnKTtcclxuICAgICAgICBjdXJyZW50QnV0dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWNjb3JkaW9uOyIsIid1c2Ugc3RyaWN0JztcclxuZnVuY3Rpb24gQWxlcnQoYWxlcnQpe1xyXG4gICAgdGhpcy5hbGVydCA9IGFsZXJ0O1xyXG59XHJcblxyXG5BbGVydC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgY2xvc2UgPSB0aGlzLmFsZXJ0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FsZXJ0LWNsb3NlJyk7XHJcbiAgICBpZihjbG9zZS5sZW5ndGggPT09IDEpe1xyXG4gICAgICAgIGNsb3NlWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG5BbGVydC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmFsZXJ0LmNsYXNzTGlzdC5hZGQoJ2Qtbm9uZScpO1xyXG4gICAgbGV0IGV2ZW50SGlkZSA9IG5ldyBFdmVudCgnZmRzLmFsZXJ0LmhpZGUnKTtcclxuICAgIHRoaXMuYWxlcnQuZGlzcGF0Y2hFdmVudChldmVudEhpZGUpO1xyXG59O1xyXG5cclxuQWxlcnQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5hbGVydC5jbGFzc0xpc3QucmVtb3ZlKCdkLW5vbmUnKTtcclxuICAgIFxyXG4gICAgbGV0IGV2ZW50U2hvdyA9IG5ldyBFdmVudCgnZmRzLmFsZXJ0LnNob3cnKTtcclxuICAgIHRoaXMuYWxlcnQuZGlzcGF0Y2hFdmVudChldmVudFNob3cpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWxlcnQ7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gQmFja1RvVG9wKGJhY2t0b3RvcCl7XHJcbiAgICB0aGlzLmJhY2t0b3RvcCA9IGJhY2t0b3RvcDtcclxufVxyXG5cclxuQmFja1RvVG9wLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgYmFja3RvdG9wYnV0dG9uID0gdGhpcy5iYWNrdG90b3A7XHJcblxyXG4gICAgdXBkYXRlQmFja1RvVG9wQnV0dG9uKGJhY2t0b3RvcGJ1dHRvbik7XHJcblxyXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlciggbGlzdCA9PiB7XHJcbiAgICAgICAgY29uc3QgZXZ0ID0gbmV3IEN1c3RvbUV2ZW50KCdkb20tY2hhbmdlZCcsIHtkZXRhaWw6IGxpc3R9KTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmRpc3BhdGNoRXZlbnQoZXZ0KVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gV2hpY2ggbXV0YXRpb25zIHRvIG9ic2VydmVcclxuICAgIGxldCBjb25maWcgPSB7XHJcbiAgICAgICAgYXR0cmlidXRlcyAgICAgICAgICAgIDogdHJ1ZSxcclxuICAgICAgICBhdHRyaWJ1dGVPbGRWYWx1ZSAgICAgOiBmYWxzZSxcclxuICAgICAgICBjaGFyYWN0ZXJEYXRhICAgICAgICAgOiB0cnVlLFxyXG4gICAgICAgIGNoYXJhY3RlckRhdGFPbGRWYWx1ZSA6IGZhbHNlLFxyXG4gICAgICAgIGNoaWxkTGlzdCAgICAgICAgICAgICA6IHRydWUsXHJcbiAgICAgICAgc3VidHJlZSAgICAgICAgICAgICAgIDogdHJ1ZVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBET00gY2hhbmdlc1xyXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCBjb25maWcpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdkb20tY2hhbmdlZCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB1cGRhdGVCYWNrVG9Ub3BCdXR0b24oYmFja3RvdG9wYnV0dG9uKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFNjcm9sbCBhY3Rpb25zXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHVwZGF0ZUJhY2tUb1RvcEJ1dHRvbihiYWNrdG90b3BidXR0b24pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gV2luZG93IHJlc2l6ZXNcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdXBkYXRlQmFja1RvVG9wQnV0dG9uKGJhY2t0b3RvcGJ1dHRvbik7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQmFja1RvVG9wQnV0dG9uKGJ1dHRvbikge1xyXG4gICAgbGV0IGRvY0JvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgbGV0IGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICBsZXQgaGVpZ2h0T2ZWaWV3cG9ydCA9IE1hdGgubWF4KGRvY0VsZW0uY2xpZW50SGVpZ2h0IHx8IDAsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKTtcclxuICAgIGxldCBoZWlnaHRPZlBhZ2UgPSBNYXRoLm1heChkb2NCb2R5LnNjcm9sbEhlaWdodCwgZG9jQm9keS5vZmZzZXRIZWlnaHQsIGRvY0JvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsZW0uc2Nyb2xsSGVpZ2h0LCBkb2NFbGVtLm9mZnNldEhlaWdodCwgZG9jRWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsIGRvY0VsZW0uY2xpZW50SGVpZ2h0KTtcclxuICAgIFxyXG4gICAgbGV0IGxpbWl0ID0gaGVpZ2h0T2ZWaWV3cG9ydCAqIDI7IC8vIFRoZSB0aHJlc2hvbGQgc2VsZWN0ZWQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBiYWNrLXRvLXRvcC1idXR0b24gc2hvdWxkIGJlIGRpc3BsYXllZFxyXG4gICAgXHJcbiAgICAvLyBOZXZlciBzaG93IHRoZSBidXR0b24gaWYgdGhlIHBhZ2UgaXMgdG9vIHNob3J0XHJcbiAgICBpZiAobGltaXQgPiBoZWlnaHRPZlBhZ2UpIHtcclxuICAgICAgICBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Qtbm9uZScpKSB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkLW5vbmUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBJZiB0aGUgcGFnZSBpcyBsb25nLCBjYWxjdWxhdGUgd2hlbiB0byBzaG93IHRoZSBidXR0b25cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdkLW5vbmUnKSkge1xyXG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnZC1ub25lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbGFzdEtub3duU2Nyb2xsUG9zaXRpb24gPSB3aW5kb3cuc2Nyb2xsWTtcclxuICAgICAgICBsZXQgZm9vdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJmb290ZXJcIilbMF07IC8vIElmIHRoZXJlIGFyZSBzZXZlcmFsIGZvb3RlcnMsIHRoZSBjb2RlIG9ubHkgYXBwbGllcyB0byB0aGUgZmlyc3QgZm9vdGVyXHJcblxyXG4gICAgICAgIC8vIFNob3cgdGhlIGJ1dHRvbiwgaWYgdGhlIHVzZXIgaGFzIHNjcm9sbGVkIHRvbyBmYXIgZG93blxyXG4gICAgICAgIGlmIChsYXN0S25vd25TY3JvbGxQb3NpdGlvbiA+PSBsaW1pdCkge1xyXG4gICAgICAgICAgICBpZiAoIWlzRm9vdGVyVmlzaWJsZShmb290ZXIpICYmIGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpc0Zvb3RlclZpc2libGUoZm9vdGVyKSAmJiAhYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZm9vdGVyLXN0aWNreScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIHRoZXJlJ3MgYSBzaWRlbmF2LCB3ZSBtaWdodCB3YW50IHRvIHNob3cgdGhlIGJ1dHRvbiBhbnl3YXlcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHNpZGVuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2lkZW5hdi1saXN0Jyk7IC8vIEZpbmRzIHNpZGUgbmF2aWdhdGlvbnMgKGxlZnQgbWVudXMpIGFuZCBzdGVwIGd1aWRlc1xyXG5cclxuICAgICAgICAgICAgaWYgKHNpZGVuYXYgJiYgc2lkZW5hdi5vZmZzZXRQYXJlbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIE9ubHkgcmVhY3QgdG8gc2lkZW5hdnMsIHdoaWNoIGFyZSBhbHdheXMgdmlzaWJsZSAoaS5lLiBub3Qgb3BlbmVkIGZyb20gb3ZlcmZsb3ctbWVudSBidXR0b25zKVxyXG4gICAgICAgICAgICAgICAgaWYgKCEoc2lkZW5hdi5jbG9zZXN0KFwiLm92ZXJmbG93LW1lbnUtaW5uZXJcIik/LnByZXZpb3VzRWxlbWVudFNpYmxpbmc/LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSBcInRydWVcIiAmJlxyXG4gICAgICAgICAgICAgICAgc2lkZW5hdi5jbG9zZXN0KFwiLm92ZXJmbG93LW1lbnUtaW5uZXJcIik/LnByZXZpb3VzRWxlbWVudFNpYmxpbmc/Lm9mZnNldFBhcmVudCAhPT0gbnVsbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVjdCA9IHNpZGVuYXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlY3QuYm90dG9tIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRm9vdGVyVmlzaWJsZShmb290ZXIpICYmIGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpc0Zvb3RlclZpc2libGUoZm9vdGVyKSAmJiAhYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZm9vdGVyLXN0aWNreScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvb3Rlci1zdGlja3knKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gVGhlcmUncyBubyBzaWRlbmF2IGFuZCB3ZSBrbm93IHRoZSB1c2VyIGhhc24ndCByZWFjaGVkIHRoZSBzY3JvbGwgbGltaXQ6IEVuc3VyZSB0aGUgYnV0dG9uIGlzIGhpZGRlblxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZm9vdGVyLXN0aWNreScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Zvb3Rlci1zdGlja3knKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzRm9vdGVyVmlzaWJsZShmb290ZXJFbGVtZW50KSB7XHJcbiAgICBpZiAoZm9vdGVyRWxlbWVudD8ucXVlcnlTZWxlY3RvcignLmZvb3RlcicpKSB7XHJcbiAgICAgICAgbGV0IHJlY3QgPSBmb290ZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXInKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgLy8gRm9vdGVyIGlzIHZpc2libGUgb3IgcGFydGx5IHZpc2libGVcclxuICAgICAgICBpZiAoKHJlY3QudG9wIDwgd2luZG93LmlubmVySGVpZ2h0IHx8IHJlY3QudG9wIDwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEZvb3RlciBpcyBoaWRkZW5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFja1RvVG9wOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmNvbnN0IE1BWF9MRU5HVEggPSAnZGF0YS1tYXhsZW5ndGgnO1xyXG5sZXQgdGV4dCA9IHtcclxuICAgIFwiY2hhcmFjdGVyX3JlbWFpbmluZ1wiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gdGlsYmFnZVwiLFxyXG4gICAgXCJjaGFyYWN0ZXJzX3JlbWFpbmluZ1wiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gdGlsYmFnZVwiLFxyXG4gICAgXCJjaGFyYWN0ZXJfdG9vX21hbnlcIjogXCJEdSBoYXIge3ZhbHVlfSB0ZWduIGZvciBtZWdldFwiLFxyXG4gICAgXCJjaGFyYWN0ZXJzX3Rvb19tYW55XCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiBmb3IgbWVnZXRcIlxyXG59XHJcblxyXG4vKipcclxuICogTnVtYmVyIG9mIGNoYXJhY3RlcnMgbGVmdFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJFbGVtZW50IFxyXG4gKiBAcGFyYW0ge0pTT059IHN0cmluZ3MgVHJhbnNsYXRlIGxhYmVsczoge1wiY2hhcmFjdGVyX3JlbWFpbmluZ1wiOiBcIkR1IGhhciB7dmFsdWV9IHRlZ24gdGlsYmFnZVwiLCBcImNoYXJhY3RlcnNfcmVtYWluaW5nXCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiB0aWxiYWdlXCIsIFwiY2hhcmFjdGVyX3Rvb19tYW55XCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiBmb3IgbWVnZXRcIiwgXCJjaGFyYWN0ZXJzX3Rvb19tYW55XCI6IFwiRHUgaGFyIHt2YWx1ZX0gdGVnbiBmb3IgbWVnZXRcIn1cclxuICovXHJcbiBmdW5jdGlvbiBDaGFyYWN0ZXJMaW1pdChjb250YWluZXJFbGVtZW50LCBzdHJpbmdzID0gdGV4dCkge1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXJFbGVtZW50O1xyXG4gICAgdGhpcy5pbnB1dCA9IGNvbnRhaW5lckVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybS1pbnB1dCcpWzBdO1xyXG4gICAgdGhpcy5tYXhsZW5ndGggPSB0aGlzLmNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoTUFYX0xFTkdUSCk7XHJcbiAgICB0aGlzLmxhc3RLZXlVcFRpbWVzdGFtcCA9IG51bGw7XHJcbiAgICB0aGlzLm9sZFZhbHVlID0gdGhpcy5pbnB1dC52YWx1ZTtcclxuICAgIHRleHQgPSBzdHJpbmdzO1xyXG59XHJcblxyXG5DaGFyYWN0ZXJMaW1pdC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5VXAuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgdGhpcy5oYW5kbGVGb2N1cy5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuaGFuZGxlQmx1ci5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBpZiAoJ29ucGFnZXNob3cnIGluIHdpbmRvdykge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlc2hvdycsIHRoaXMudXBkYXRlTWVzc2FnZXMuYmluZCh0aGlzKSk7XHJcbiAgICB9IFxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCB0aGlzLnVwZGF0ZU1lc3NhZ2VzLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG5DaGFyYWN0ZXJMaW1pdC5wcm90b3R5cGUuY2hhcmFjdGVyc0xlZnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgY3VycmVudF9sZW5ndGggPSB0aGlzLmlucHV0LnZhbHVlLmxlbmd0aDtcclxuICAgIHJldHVybiB0aGlzLm1heGxlbmd0aCAtIGN1cnJlbnRfbGVuZ3RoO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGFyYWN0ZXJMaW1pdE1lc3NhZ2UgKGNoYXJhY3RlcnNfbGVmdCkge1xyXG4gICAgbGV0IGNvdW50X21lc3NhZ2UgPSBcIlwiO1xyXG5cclxuICAgIGlmIChjaGFyYWN0ZXJzX2xlZnQgPT09IC0xKSB7XHJcbiAgICAgICAgbGV0IGV4Y2VlZGVkID0gTWF0aC5hYnMoY2hhcmFjdGVyc19sZWZ0KTtcclxuICAgICAgICBjb3VudF9tZXNzYWdlID0gdGV4dC5jaGFyYWN0ZXJfdG9vX21hbnkucmVwbGFjZSgve3ZhbHVlfS8sIGV4Y2VlZGVkKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGNoYXJhY3RlcnNfbGVmdCA9PT0gMSkge1xyXG4gICAgICAgIGNvdW50X21lc3NhZ2UgPSB0ZXh0LmNoYXJhY3Rlcl9yZW1haW5pbmcucmVwbGFjZSgve3ZhbHVlfS8sIGNoYXJhY3RlcnNfbGVmdCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChjaGFyYWN0ZXJzX2xlZnQgPj0gMCkge1xyXG4gICAgICAgIGNvdW50X21lc3NhZ2UgPSB0ZXh0LmNoYXJhY3RlcnNfcmVtYWluaW5nLnJlcGxhY2UoL3t2YWx1ZX0vLCBjaGFyYWN0ZXJzX2xlZnQpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IGV4Y2VlZGVkID0gTWF0aC5hYnMoY2hhcmFjdGVyc19sZWZ0KTtcclxuICAgICAgICBjb3VudF9tZXNzYWdlID0gdGV4dC5jaGFyYWN0ZXJzX3Rvb19tYW55LnJlcGxhY2UoL3t2YWx1ZX0vLCBleGNlZWRlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvdW50X21lc3NhZ2U7XHJcbn1cclxuXHJcbkNoYXJhY3RlckxpbWl0LnByb3RvdHlwZS51cGRhdGVWaXNpYmxlTWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBjaGFyYWN0ZXJzX2xlZnQgPSB0aGlzLmNoYXJhY3RlcnNMZWZ0KCk7XHJcbiAgICBsZXQgY291bnRfbWVzc2FnZSA9IGNoYXJhY3RlckxpbWl0TWVzc2FnZShjaGFyYWN0ZXJzX2xlZnQpO1xyXG4gICAgbGV0IGNoYXJhY3Rlcl9sYWJlbCA9IHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NoYXJhY3Rlci1saW1pdCcpWzBdO1xyXG5cclxuICAgIGlmIChjaGFyYWN0ZXJzX2xlZnQgPCAwKSB7XHJcbiAgICAgICAgaWYgKCFjaGFyYWN0ZXJfbGFiZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaW1pdC1leGNlZWRlZCcpKSB7XHJcbiAgICAgICAgICAgIGNoYXJhY3Rlcl9sYWJlbC5jbGFzc0xpc3QuYWRkKCdsaW1pdC1leGNlZWRlZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtLWxpbWl0LWVycm9yJykpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dC5jbGFzc0xpc3QuYWRkKCdmb3JtLWxpbWl0LWVycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKGNoYXJhY3Rlcl9sYWJlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2xpbWl0LWV4Y2VlZGVkJykpIHtcclxuICAgICAgICAgICAgY2hhcmFjdGVyX2xhYmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2xpbWl0LWV4Y2VlZGVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlucHV0LmNsYXNzTGlzdC5jb250YWlucygnZm9ybS1saW1pdC1lcnJvcicpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnZm9ybS1saW1pdC1lcnJvcicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGFyYWN0ZXJfbGFiZWwuaW5uZXJIVE1MID0gY291bnRfbWVzc2FnZTtcclxufVxyXG5cclxuQ2hhcmFjdGVyTGltaXQucHJvdG90eXBlLnVwZGF0ZVNjcmVlblJlYWRlck1lc3NhZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgY2hhcmFjdGVyc19sZWZ0ID0gdGhpcy5jaGFyYWN0ZXJzTGVmdCgpO1xyXG4gICAgbGV0IGNvdW50X21lc3NhZ2UgPSBjaGFyYWN0ZXJMaW1pdE1lc3NhZ2UoY2hhcmFjdGVyc19sZWZ0KTtcclxuICAgIGxldCBjaGFyYWN0ZXJfbGFiZWwgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjaGFyYWN0ZXItbGltaXQtc3Itb25seScpWzBdO1xyXG4gICAgY2hhcmFjdGVyX2xhYmVsLmlubmVySFRNTCA9IGNvdW50X21lc3NhZ2U7XHJcbn1cclxuXHJcbkNoYXJhY3RlckxpbWl0LnByb3RvdHlwZS5yZXNldFNjcmVlblJlYWRlck1lc3NhZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5pbnB1dC52YWx1ZSAhPT0gXCJcIikge1xyXG4gICAgICAgIGxldCBzcl9tZXNzYWdlID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0LXNyLW9ubHknKVswXTtcclxuICAgICAgICBzcl9tZXNzYWdlLmlubmVySFRNTCA9ICcnO1xyXG4gICAgfVxyXG59XHJcblxyXG5DaGFyYWN0ZXJMaW1pdC5wcm90b3R5cGUudXBkYXRlTWVzc2FnZXMgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgdGhpcy51cGRhdGVWaXNpYmxlTWVzc2FnZSgpO1xyXG4gICAgdGhpcy51cGRhdGVTY3JlZW5SZWFkZXJNZXNzYWdlKCk7XHJcbn1cclxuXHJcbkNoYXJhY3RlckxpbWl0LnByb3RvdHlwZS5oYW5kbGVLZXlVcCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICB0aGlzLnVwZGF0ZVZpc2libGVNZXNzYWdlKCk7XHJcbiAgICB0aGlzLmxhc3RLZXlVcFRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbn1cclxuXHJcbkNoYXJhY3RlckxpbWl0LnByb3RvdHlwZS5oYW5kbGVGb2N1cyA9IGZ1bmN0aW9uIChlKSB7ICAgIFxyXG4gICAgLy8gUmVzZXQgdGhlIHNjcmVlbiByZWFkZXIgbWVzc2FnZSBvbiBmb2N1cyB0byBmb3JjZSBhbiB1cGRhdGUgb2YgdGhlIG1lc3NhZ2UuXHJcbiAgICAvLyBUaGlzIGVuc3VyZXMgdGhhdCBhIHNjcmVlbiByZWFkZXIgaW5mb3JtcyB0aGUgdXNlciBvZiBob3cgbWFueSBjaGFyYWN0ZXJzIHRoZXJlIGlzIGxlZnRcclxuICAgIC8vIG9uIGZvY3VzIGFuZCBub3QganVzdCB3aGF0IHRoZSBjaGFyYWN0ZXIgbGltaXQgaXMuXHJcbiAgICB0aGlzLnJlc2V0U2NyZWVuUmVhZGVyTWVzc2FnZSgpO1xyXG5cclxuICAgIHRoaXMuaW50ZXJ2YWxJRCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBEb24ndCB1cGRhdGUgdGhlIFNjcmVlbiBSZWFkZXIgbWVzc2FnZSB1bmxlc3MgaXQncyBiZWVuIGF3aGlsZVxyXG4gICAgICAgIC8vIHNpbmNlIHRoZSBsYXN0IGtleSB1cCBldmVudC4gT3RoZXJ3aXNlLCB0aGUgdXNlciB3aWxsIGJlIHNwYW1tZWRcclxuICAgICAgICAvLyB3aXRoIGF1ZGlvIG5vdGlmaWNhdGlvbnMgd2hpbGUgdHlwaW5nLlxyXG4gICAgICAgIGlmICghdGhpcy5sYXN0S2V5VXBUaW1lc3RhbXAgfHwgKERhdGUubm93KCkgLSA1MDApID49IHRoaXMubGFzdEtleVVwVGltZXN0YW1wKSB7XHJcbiAgICAgICAgICAgIGxldCBzcl9tZXNzYWdlID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0LXNyLW9ubHknKVswXS5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgIGxldCB2aXNpYmxlX21lc3NhZ2UgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjaGFyYWN0ZXItbGltaXQnKVswXS5pbm5lckhUTUw7ICAgICBcclxuXHJcbiAgICAgICAgICAgIC8vIERvbid0IHVwZGF0ZSB0aGUgbWVzc2FnZXMgdW5sZXNzIHRoZSB2YWx1ZSBvZiB0aGUgdGV4dGFyZWEvdGV4dCBpbnB1dCBoYXMgY2hhbmdlZCBvciBpZiB0aGVyZVxyXG4gICAgICAgICAgICAvLyBpcyBhIG1pc21hdGNoIGJldHdlZW4gdGhlIHZpc2libGUgbWVzc2FnZSBhbmQgdGhlIHNjcmVlbiByZWFkZXIgbWVzc2FnZS5cclxuICAgICAgICAgICAgaWYgKHRoaXMub2xkVmFsdWUgIT09IHRoaXMuaW5wdXQudmFsdWUgfHwgc3JfbWVzc2FnZSAhPT0gdmlzaWJsZV9tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9sZFZhbHVlID0gdGhpcy5pbnB1dC52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlTWVzc2FnZXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfS5iaW5kKHRoaXMpLCAxMDAwKTtcclxufVxyXG5cclxuQ2hhcmFjdGVyTGltaXQucHJvdG90eXBlLmhhbmRsZUJsdXIgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsSUQpO1xyXG4gICAgLy8gRG9uJ3QgdXBkYXRlIHRoZSBtZXNzYWdlcyBvbiBibHVyIHVubGVzcyB0aGUgdmFsdWUgb2YgdGhlIHRleHRhcmVhL3RleHQgaW5wdXQgaGFzIGNoYW5nZWRcclxuICAgIGlmICh0aGlzLm9sZFZhbHVlICE9PSB0aGlzLmlucHV0LnZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5vbGRWYWx1ZSA9IHRoaXMuaW5wdXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNZXNzYWdlcygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXJMaW1pdDsiLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCAnLi4vcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kJztcclxuXHJcbmNvbnN0IFRPR0dMRV9UQVJHRVRfQVRUUklCVVRFID0gJ2RhdGEtYXJpYS1jb250cm9scyc7XHJcblxyXG4vKipcclxuICogQWRkcyBjbGljayBmdW5jdGlvbmFsaXR5IHRvIGNoZWNrYm94IGNvbGxhcHNlIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGNoZWNrYm94RWxlbWVudCBcclxuICovXHJcbmZ1bmN0aW9uIENoZWNrYm94VG9nZ2xlQ29udGVudChjaGVja2JveEVsZW1lbnQpe1xyXG4gICAgdGhpcy5jaGVja2JveEVsZW1lbnQgPSBjaGVja2JveEVsZW1lbnQ7XHJcbiAgICB0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50cyBvbiBjaGVja2JveCBzdGF0ZSBjaGFuZ2VcclxuICovXHJcbkNoZWNrYm94VG9nZ2xlQ29udGVudC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmNoZWNrYm94RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLnRvZ2dsZS5iaW5kKHRoaXMpKTtcclxuICAgIHRoaXMudG9nZ2xlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUb2dnbGUgY2hlY2tib3ggY29udGVudFxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyICRtb2R1bGUgPSB0aGlzO1xyXG4gICAgdmFyIHRhcmdldEF0dHIgPSB0aGlzLmNoZWNrYm94RWxlbWVudC5nZXRBdHRyaWJ1dGUoVE9HR0xFX1RBUkdFVF9BVFRSSUJVVEUpXHJcbiAgICB2YXIgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyKTtcclxuICAgIGlmKHRhcmdldEVsID09PSBudWxsIHx8IHRhcmdldEVsID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgcGFuZWwgZWxlbWVudC4gVmVyaWZ5IHZhbHVlIG9mIGF0dHJpYnV0ZSBgKyBUT0dHTEVfVEFSR0VUX0FUVFJJQlVURSk7XHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmNoZWNrYm94RWxlbWVudC5jaGVja2VkKXtcclxuICAgICAgICAkbW9kdWxlLmV4cGFuZCh0aGlzLmNoZWNrYm94RWxlbWVudCwgdGFyZ2V0RWwpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgJG1vZHVsZS5jb2xsYXBzZSh0aGlzLmNoZWNrYm94RWxlbWVudCwgdGFyZ2V0RWwpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogRXhwYW5kIGNvbnRlbnRcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBjaGVja2JveEVsZW1lbnQgQ2hlY2tib3ggaW5wdXQgZWxlbWVudCBcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGVudEVsZW1lbnQgQ29udGVudCBjb250YWluZXIgZWxlbWVudCBcclxuICovXHJcbkNoZWNrYm94VG9nZ2xlQ29udGVudC5wcm90b3R5cGUuZXhwYW5kID0gZnVuY3Rpb24oY2hlY2tib3hFbGVtZW50LCBjb250ZW50RWxlbWVudCl7XHJcbiAgICBpZihjaGVja2JveEVsZW1lbnQgIT09IG51bGwgJiYgY2hlY2tib3hFbGVtZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudEVsZW1lbnQgIT09IG51bGwgJiYgY29udGVudEVsZW1lbnQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgY2hlY2tib3hFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1hcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLmV4cGFuZGVkJyk7XHJcbiAgICAgICAgY2hlY2tib3hFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENvbGxhcHNlIGNvbnRlbnRcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBjaGVja2JveEVsZW1lbnQgQ2hlY2tib3ggaW5wdXQgZWxlbWVudCBcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGVudEVsZW1lbnQgQ29udGVudCBjb250YWluZXIgZWxlbWVudCBcclxuICovXHJcbkNoZWNrYm94VG9nZ2xlQ29udGVudC5wcm90b3R5cGUuY29sbGFwc2UgPSBmdW5jdGlvbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcclxuICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdkYXRhLWFyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmNvbGxhcHNlLmNvbGxhcHNlZCcpO1xyXG4gICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaGVja2JveFRvZ2dsZUNvbnRlbnQ7XHJcbiIsImltcG9ydCB7a2V5bWFwfSBmcm9tICdyZWNlcHRvcic7XHJcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZShcIi4uL3V0aWxzL2JlaGF2aW9yXCIpO1xyXG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKFwiLi4vdXRpbHMvc2VsZWN0XCIpO1xyXG5jb25zdCB7IHByZWZpeDogUFJFRklYIH0gPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpO1xyXG5jb25zdCB7IENMSUNLIH0gPSByZXF1aXJlKFwiLi4vZXZlbnRzXCIpO1xyXG5jb25zdCBhY3RpdmVFbGVtZW50ID0gcmVxdWlyZShcIi4uL3V0aWxzL2FjdGl2ZS1lbGVtZW50XCIpO1xyXG5jb25zdCBpc0lvc0RldmljZSA9IHJlcXVpcmUoXCIuLi91dGlscy9pcy1pb3MtZGV2aWNlXCIpO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVJfQ0xBU1MgPSBgZGF0ZS1waWNrZXJgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9XUkFQUEVSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X193cmFwcGVyYDtcclxuY29uc3QgREFURV9QSUNLRVJfSU5JVElBTElaRURfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU30tLWluaXRpYWxpemVkYDtcclxuY29uc3QgREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9LS1hY3RpdmVgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9faW50ZXJuYWwtaW5wdXRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fZXh0ZXJuYWwtaW5wdXRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2J1dHRvbmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19jYWxlbmRhcmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX1NUQVRVU19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fc3RhdHVzYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF0ZWA7XHJcblxyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tZm9jdXNlZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfU0VMRUNURURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1BSRVZJT1VTX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXByZXZpb3VzLW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLWN1cnJlbnQtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX05FWFRfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tbmV4dC1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9UT0RBWV9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS10b2RheWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9TVEFSVF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlLXN0YXJ0YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0VORF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlLWVuZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfV0lUSElOX1JBTkdFX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXdpdGhpbi1yYW5nZWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3ByZXZpb3VzLXllYXJgO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQteWVhcmA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoLXNlbGVjdGlvbmA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyLXNlbGVjdGlvbmA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9NT05USF9DTEFTU30tLWZvY3VzZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RFRF9DTEFTUyA9IGAke0NBTEVOREFSX01PTlRIX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTID0gYCR7Q0FMRU5EQVJfWUVBUl9DTEFTU30tLWZvY3VzZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfWUVBUl9DTEFTU30tLXNlbGVjdGVkYDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMteWVhci1jaHVua2A7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DSFVOS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC15ZWFyLWNodW5rYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9QSUNLRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2RhdGUtcGlja2VyYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfUElDS0VSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aC1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1BJQ0tFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9feWVhci1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9UQUJMRV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fdGFibGVgO1xyXG5jb25zdCBDQUxFTkRBUl9ST1dfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3Jvd2A7XHJcbmNvbnN0IENBTEVOREFSX0NFTExfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2NlbGxgO1xyXG5jb25zdCBDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTUyA9IGAke0NBTEVOREFSX0NFTExfQ0xBU1N9LS1jZW50ZXItaXRlbXNgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9MQUJFTF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtbGFiZWxgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVlfT0ZfV0VFS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF5LW9mLXdlZWtgO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVIgPSBgLiR7REFURV9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfQlVUVE9OID0gYC4ke0RBVEVfUElDS0VSX0JVVFRPTl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVCA9IGAuJHtEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVCA9IGAuJHtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9DQUxFTkRBUiA9IGAuJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9TVEFUVVMgPSBgLiR7REFURV9QSUNLRVJfU1RBVFVTX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEUgPSBgLiR7Q0FMRU5EQVJfREFURV9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQgPSBgLiR7Q0FMRU5EQVJfREFURV9GT0NVU0VEX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USCA9IGAuJHtDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUiA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX01PTlRIID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUiA9IGAuJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9NT05USCA9IGAuJHtDQUxFTkRBUl9ORVhUX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNUSU9OID0gYC4ke0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVElPTiA9IGAuJHtDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEggPSBgLiR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUiA9IGAuJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTksgPSBgLiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTksgPSBgLiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUElDS0VSID0gYC4ke0NBTEVOREFSX0RBVEVfUElDS0VSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1BJQ0tFUiA9IGAuJHtDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9QSUNLRVIgPSBgLiR7Q0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1N9YDtcclxuXHJcbmxldCB0ZXh0ID0ge1xyXG4gIFwib3Blbl9jYWxlbmRhclwiOiBcIsOFYm4ga2FsZW5kZXJcIixcclxuICBcImFyaWFfbGFiZWxfZGF0ZVwiOiBcIntkYXlTdHJ9IGRlbiB7ZGF5fS4ge21vbnRoU3RyfSB7eWVhcn1cIixcclxuICBcInByZXZpb3VzX3llYXJcIjogXCJOYXZpZ8OpciDDqXQgw6VyIHRpbGJhZ2VcIixcclxuICBcInByZXZpb3VzX21vbnRoXCI6IFwiTmF2aWfDqXIgw6luIG3DpW5lZCB0aWxiYWdlXCIsXHJcbiAgXCJuZXh0X21vbnRoXCI6IFwiTmF2aWfDqXIgw6luIG3DpW5lZCBmcmVtXCIsXHJcbiAgXCJuZXh0X3llYXJcIjogXCJOYXZpZ8OpciDDqXQgw6VyIGZyZW1cIixcclxuICBcInNlbGVjdF9tb250aFwiOiBcIlbDpmxnIG3DpW5lZFwiLFxyXG4gIFwic2VsZWN0X3llYXJcIjogXCJWw6ZsZyDDpXJcIixcclxuICBcImRhdGVfc2VsZWN0ZWRcIjogXCJEYXRvIHZhbGd0XCIsXHJcbiAgXCJwcmV2aW91c195ZWFyc1wiOiBcIk5hdmlnw6lyIHt5ZWFyc30gw6VyIHRpbGJhZ2VcIixcclxuICBcIm5leHRfeWVhcnNcIjogXCJOYXZpZ8OpciB7eWVhcnN9IMOlciBmcmVtXCIsXHJcbiAgXCJndWlkZVwiOiBcIkR1IGthbiBuYXZpZ2VyZSBtZWxsZW0gZGFnZSB2ZWQgYXQgYnJ1Z2UgaMO4anJlIG9nIHZlbnN0cmUgcGlsZXRhc3RlciwgdWdlciB2ZWQgYXQgYnJ1Z2Ugb3Agb2cgbmVkIHBpbGV0YXN0ZXIsIG3DpW5lZGVyIHZlZCBhdCBicnVnZSBwYWdlIHVwIG9nIHBhZ2UgZG93bi10YXN0ZXJuZSBvZyDDpXIgdmVkIGF0IGF0IHRhc3RlIHNoaWZ0IG9nIHBhZ2UgdXAgZWxsZXIgbmVkLiBIb21lIG9nIGVuZC10YXN0ZW4gbmF2aWdlcmVyIHRpbCBzdGFydCBlbGxlciBzbHV0bmluZyBhZiBlbiB1Z2UuXCIsXHJcbiAgXCJtb250aHNfZGlzcGxheWVkXCI6IFwiVsOmbGcgZW4gbcOlbmVkXCIsXHJcbiAgXCJ5ZWFyc19kaXNwbGF5ZWRcIjogXCJWaXNlciDDpXIge3N0YXJ0fSB0aWwge2VuZH0uIFbDpmxnIGV0IMOlci5cIixcclxuICBcImphbnVhcnlcIjogXCJqYW51YXJcIixcclxuICBcImZlYnJ1YXJ5XCI6IFwiZmVicnVhclwiLFxyXG4gIFwibWFyY2hcIjogXCJtYXJ0c1wiLFxyXG4gIFwiYXByaWxcIjogXCJhcHJpbFwiLFxyXG4gIFwibWF5XCI6IFwibWFqXCIsXHJcbiAgXCJqdW5lXCI6IFwianVuaVwiLFxyXG4gIFwianVseVwiOiBcImp1bGlcIixcclxuICBcImF1Z3VzdFwiOiBcImF1Z3VzdFwiLFxyXG4gIFwic2VwdGVtYmVyXCI6IFwic2VwdGVtYmVyXCIsXHJcbiAgXCJvY3RvYmVyXCI6IFwib2t0b2JlclwiLFxyXG4gIFwibm92ZW1iZXJcIjogXCJub3ZlbWJlclwiLFxyXG4gIFwiZGVjZW1iZXJcIjogXCJkZWNlbWJlclwiLFxyXG4gIFwibW9uZGF5XCI6IFwibWFuZGFnXCIsXHJcbiAgXCJ0dWVzZGF5XCI6IFwidGlyc2RhZ1wiLFxyXG4gIFwid2VkbmVzZGF5XCI6IFwib25zZGFnXCIsXHJcbiAgXCJ0aHVyc2RheVwiOiBcInRvcnNkYWdcIixcclxuICBcImZyaWRheVwiOiBcImZyZWRhZ1wiLFxyXG4gIFwic2F0dXJkYXlcIjogXCJsw7hyZGFnXCIsXHJcbiAgXCJzdW5kYXlcIjogXCJzw7huZGFnXCJcclxufVxyXG5cclxuY29uc3QgVkFMSURBVElPTl9NRVNTQUdFID0gXCJJbmR0YXN0IHZlbmxpZ3N0IGVuIGd5bGRpZyBkYXRvXCI7XHJcblxyXG5sZXQgTU9OVEhfTEFCRUxTID0gW1xyXG4gIHRleHQuamFudWFyeSxcclxuICB0ZXh0LmZlYnJ1YXJ5LFxyXG4gIHRleHQubWFyY2gsXHJcbiAgdGV4dC5hcHJpbCxcclxuICB0ZXh0Lm1heSxcclxuICB0ZXh0Lmp1bmUsXHJcbiAgdGV4dC5qdWx5LFxyXG4gIHRleHQuYXVndXN0LFxyXG4gIHRleHQuc2VwdGVtYmVyLFxyXG4gIHRleHQub2N0b2JlcixcclxuICB0ZXh0Lm5vdmVtYmVyLFxyXG4gIHRleHQuZGVjZW1iZXJcclxuXTtcclxuXHJcbmxldCBEQVlfT0ZfV0VFS19MQUJFTFMgPSBbXHJcbiAgdGV4dC5tb25kYXksXHJcbiAgdGV4dC50dWVzZGF5LFxyXG4gIHRleHQud2VkbmVzZGF5LFxyXG4gIHRleHQudGh1cnNkYXksXHJcbiAgdGV4dC5mcmlkYXksXHJcbiAgdGV4dC5zYXR1cmRheSxcclxuICB0ZXh0LnN1bmRheVxyXG5dO1xyXG5cclxuY29uc3QgRU5URVJfS0VZQ09ERSA9IDEzO1xyXG5cclxuY29uc3QgWUVBUl9DSFVOSyA9IDEyO1xyXG5cclxuY29uc3QgREVGQVVMVF9NSU5fREFURSA9IFwiMDAwMC0wMS0wMVwiO1xyXG5jb25zdCBERUZBVUxUX0VYVEVSTkFMX0RBVEVfRk9STUFUID0gXCJERC9NTS9ZWVlZXCI7XHJcbmNvbnN0IElOVEVSTkFMX0RBVEVfRk9STUFUID0gXCJZWVlZLU1NLUREXCI7XHJcblxyXG5jb25zdCBOT1RfRElTQUJMRURfU0VMRUNUT1IgPSBcIjpub3QoW2Rpc2FibGVkXSlcIjtcclxuXHJcbmNvbnN0IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMgPSAoLi4uc2VsZWN0b3JzKSA9PlxyXG4gIHNlbGVjdG9ycy5tYXAoKHF1ZXJ5KSA9PiBxdWVyeSArIE5PVF9ESVNBQkxFRF9TRUxFQ1RPUikuam9pbihcIiwgXCIpO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVJfRk9DVVNBQkxFID0gcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyhcclxuICBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSLFxyXG4gIENBTEVOREFSX1BSRVZJT1VTX01PTlRILFxyXG4gIENBTEVOREFSX1lFQVJfU0VMRUNUSU9OLFxyXG4gIENBTEVOREFSX01PTlRIX1NFTEVDVElPTixcclxuICBDQUxFTkRBUl9ORVhUX1lFQVIsXHJcbiAgQ0FMRU5EQVJfTkVYVF9NT05USCxcclxuICBDQUxFTkRBUl9EQVRFX0ZPQ1VTRURcclxuKTtcclxuXHJcbmNvbnN0IE1PTlRIX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxyXG4gIENBTEVOREFSX01PTlRIX0ZPQ1VTRURcclxuKTtcclxuXHJcbmNvbnN0IFlFQVJfUElDS0VSX0ZPQ1VTQUJMRSA9IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMoXHJcbiAgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyxcclxuICBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTkssXHJcbiAgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEXHJcbik7XHJcblxyXG4vLyAjcmVnaW9uIERhdGUgTWFuaXB1bGF0aW9uIEZ1bmN0aW9uc1xyXG5cclxuLyoqXHJcbiAqIEtlZXAgZGF0ZSB3aXRoaW4gbW9udGguIE1vbnRoIHdvdWxkIG9ubHkgYmUgb3ZlciBieSAxIHRvIDMgZGF5c1xyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVUb0NoZWNrIHRoZSBkYXRlIG9iamVjdCB0byBjaGVja1xyXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGggdGhlIGNvcnJlY3QgbW9udGhcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBkYXRlLCBjb3JyZWN0ZWQgaWYgbmVlZGVkXHJcbiAqL1xyXG5jb25zdCBrZWVwRGF0ZVdpdGhpbk1vbnRoID0gKGRhdGVUb0NoZWNrLCBtb250aCkgPT4ge1xyXG4gIGlmIChtb250aCAhPT0gZGF0ZVRvQ2hlY2suZ2V0TW9udGgoKSkge1xyXG4gICAgZGF0ZVRvQ2hlY2suc2V0RGF0ZSgwKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRlVG9DaGVjaztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSBmcm9tIG1vbnRoIGRheSB5ZWFyXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIHRoZSB5ZWFyIHRvIHNldFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGggdGhlIG1vbnRoIHRvIHNldCAoemVyby1pbmRleGVkKVxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBzZXRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBzZXQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc2V0RGF0ZSA9ICh5ZWFyLCBtb250aCwgZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKHllYXIsIG1vbnRoLCBkYXRlKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiB0b2RheXMgZGF0ZVxyXG4gKlxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdG9kYXlzIGRhdGVcclxuICovXHJcbmNvbnN0IHRvZGF5ID0gKCkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gIGNvbnN0IGRheSA9IG5ld0RhdGUuZ2V0RGF0ZSgpO1xyXG4gIGNvbnN0IG1vbnRoID0gbmV3RGF0ZS5nZXRNb250aCgpO1xyXG4gIGNvbnN0IHllYXIgPSBuZXdEYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgcmV0dXJuIHNldERhdGUoeWVhciwgbW9udGgsIGRheSk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgdG8gZmlyc3QgZGF5IG9mIHRoZSBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdGFydE9mTW9udGggPSAoZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpLCAxKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byBsYXN0IGRheSBvZiB0aGUgbW9udGhcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgbGFzdERheU9mTW9udGggPSAoZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpICsgMSwgMCk7XHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogQWRkIGRheXMgdG8gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtRGF5cyB0aGUgZGlmZmVyZW5jZSBpbiBkYXlzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkRGF5cyA9IChfZGF0ZSwgbnVtRGF5cykgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG4gIG5ld0RhdGUuc2V0RGF0ZShuZXdEYXRlLmdldERhdGUoKSArIG51bURheXMpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IGRheXMgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1EYXlzIHRoZSBkaWZmZXJlbmNlIGluIGRheXNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJEYXlzID0gKF9kYXRlLCBudW1EYXlzKSA9PiBhZGREYXlzKF9kYXRlLCAtbnVtRGF5cyk7XHJcblxyXG4vKipcclxuICogQWRkIHdlZWtzIHRvIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVdlZWtzIHRoZSBkaWZmZXJlbmNlIGluIHdlZWtzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkV2Vla3MgPSAoX2RhdGUsIG51bVdlZWtzKSA9PiBhZGREYXlzKF9kYXRlLCBudW1XZWVrcyAqIDcpO1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IHdlZWtzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJXZWVrcyA9IChfZGF0ZSwgbnVtV2Vla3MpID0+IGFkZFdlZWtzKF9kYXRlLCAtbnVtV2Vla3MpO1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgd2VlayAoTW9uZGF5KVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN0YXJ0T2ZXZWVrID0gKF9kYXRlKSA9PiB7XHJcbiAgbGV0IGRheU9mV2VlayA9IF9kYXRlLmdldERheSgpLTE7XHJcbiAgaWYoZGF5T2ZXZWVrID09PSAtMSl7XHJcbiAgICBkYXlPZldlZWsgPSA2O1xyXG4gIH1cclxuICByZXR1cm4gc3ViRGF5cyhfZGF0ZSwgZGF5T2ZXZWVrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byB0aGUgZW5kIG9mIHRoZSB3ZWVrIChTdW5kYXkpXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1XZWVrcyB0aGUgZGlmZmVyZW5jZSBpbiB3ZWVrc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGVuZE9mV2VlayA9IChfZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IGRheU9mV2VlayA9IF9kYXRlLmdldERheSgpO1xyXG4gIHJldHVybiBhZGREYXlzKF9kYXRlLCA3IC0gZGF5T2ZXZWVrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgbW9udGhzIHRvIGRhdGUgYW5kIGtlZXAgZGF0ZSB3aXRoaW4gbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bU1vbnRocyB0aGUgZGlmZmVyZW5jZSBpbiBtb250aHNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGRNb250aHMgPSAoX2RhdGUsIG51bU1vbnRocykgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG5cclxuICBjb25zdCBkYXRlTW9udGggPSAobmV3RGF0ZS5nZXRNb250aCgpICsgMTIgKyBudW1Nb250aHMpICUgMTI7XHJcbiAgbmV3RGF0ZS5zZXRNb250aChuZXdEYXRlLmdldE1vbnRoKCkgKyBudW1Nb250aHMpO1xyXG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgZGF0ZU1vbnRoKTtcclxuXHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU3VidHJhY3QgbW9udGhzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtTW9udGhzIHRoZSBkaWZmZXJlbmNlIGluIG1vbnRoc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1Yk1vbnRocyA9IChfZGF0ZSwgbnVtTW9udGhzKSA9PiBhZGRNb250aHMoX2RhdGUsIC1udW1Nb250aHMpO1xyXG5cclxuLyoqXHJcbiAqIEFkZCB5ZWFycyB0byBkYXRlIGFuZCBrZWVwIGRhdGUgd2l0aGluIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1ZZWFycyB0aGUgZGlmZmVyZW5jZSBpbiB5ZWFyc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkZFllYXJzID0gKF9kYXRlLCBudW1ZZWFycykgPT4gYWRkTW9udGhzKF9kYXRlLCBudW1ZZWFycyAqIDEyKTtcclxuXHJcbi8qKlxyXG4gKiBTdWJ0cmFjdCB5ZWFycyBmcm9tIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVllYXJzIHRoZSBkaWZmZXJlbmNlIGluIHllYXJzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3ViWWVhcnMgPSAoX2RhdGUsIG51bVllYXJzKSA9PiBhZGRZZWFycyhfZGF0ZSwgLW51bVllYXJzKTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgbW9udGhzIG9mIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHplcm8taW5kZXhlZCBtb250aCB0byBzZXRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXRNb250aCA9IChfZGF0ZSwgbW9udGgpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoX2RhdGUuZ2V0VGltZSgpKTtcclxuXHJcbiAgbmV3RGF0ZS5zZXRNb250aChtb250aCk7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBtb250aCk7XHJcblxyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCB5ZWFyIG9mIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IHllYXIgdGhlIHllYXIgdG8gc2V0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc2V0WWVhciA9IChfZGF0ZSwgeWVhcikgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG5cclxuICBjb25zdCBtb250aCA9IG5ld0RhdGUuZ2V0TW9udGgoKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKHllYXIpO1xyXG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgbW9udGgpO1xyXG5cclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGVhcmxpZXN0IGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBlYXJsaWVzdCBkYXRlXHJcbiAqL1xyXG5jb25zdCBtaW4gPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgbGV0IG5ld0RhdGUgPSBkYXRlQTtcclxuXHJcbiAgaWYgKGRhdGVCIDwgZGF0ZUEpIHtcclxuICAgIG5ld0RhdGUgPSBkYXRlQjtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgRGF0ZShuZXdEYXRlLmdldFRpbWUoKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJuIHRoZSBsYXRlc3QgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGxhdGVzdCBkYXRlXHJcbiAqL1xyXG5jb25zdCBtYXggPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgbGV0IG5ld0RhdGUgPSBkYXRlQTtcclxuXHJcbiAgaWYgKGRhdGVCID4gZGF0ZUEpIHtcclxuICAgIG5ld0RhdGUgPSBkYXRlQjtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgRGF0ZShuZXdEYXRlLmdldFRpbWUoKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgYXJlIHRoZSBpbiB0aGUgc2FtZSB5ZWFyXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgaW4gdGhlIHNhbWUgeWVhclxyXG4gKi9cclxuY29uc3QgaXNTYW1lWWVhciA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICByZXR1cm4gZGF0ZUEgJiYgZGF0ZUIgJiYgZGF0ZUEuZ2V0RnVsbFllYXIoKSA9PT0gZGF0ZUIuZ2V0RnVsbFllYXIoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIGluIHRoZSBzYW1lIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgaW4gdGhlIHNhbWUgbW9udGhcclxuICovXHJcbmNvbnN0IGlzU2FtZU1vbnRoID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIHJldHVybiBpc1NhbWVZZWFyKGRhdGVBLCBkYXRlQikgJiYgZGF0ZUEuZ2V0TW9udGgoKSA9PT0gZGF0ZUIuZ2V0TW9udGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIHNhbWUgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIHRoZSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSB0aGUgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgdGhlIHNhbWUgZGF0ZVxyXG4gKi9cclxuY29uc3QgaXNTYW1lRGF5ID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIHJldHVybiBpc1NhbWVNb250aChkYXRlQSwgZGF0ZUIpICYmIGRhdGVBLmdldERhdGUoKSA9PT0gZGF0ZUIuZ2V0RGF0ZSgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHJldHVybiBhIG5ldyBkYXRlIHdpdGhpbiBtaW5pbXVtIGFuZCBtYXhpbXVtIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgZGF0ZSBiZXR3ZWVuIG1pbiBhbmQgbWF4XHJcbiAqL1xyXG5jb25zdCBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT4ge1xyXG4gIGxldCBuZXdEYXRlID0gZGF0ZTtcclxuXHJcbiAgaWYgKGRhdGUgPCBtaW5EYXRlKSB7XHJcbiAgICBuZXdEYXRlID0gbWluRGF0ZTtcclxuICB9IGVsc2UgaWYgKG1heERhdGUgJiYgZGF0ZSA+IG1heERhdGUpIHtcclxuICAgIG5ld0RhdGUgPSBtYXhEYXRlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBpcyB2YWxpZC5cclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGlzIHRoZXJlIGEgZGF5IHdpdGhpbiB0aGUgbW9udGggd2l0aGluIG1pbiBhbmQgbWF4IGRhdGVzXHJcbiAqL1xyXG5jb25zdCBpc0RhdGVXaXRoaW5NaW5BbmRNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT5cclxuICBkYXRlID49IG1pbkRhdGUgJiYgKCFtYXhEYXRlIHx8IGRhdGUgPD0gbWF4RGF0ZSk7XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgbW9udGggaXMgaW52YWxpZC5cclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGlzIHRoZSBtb250aCBvdXRzaWRlIG1pbiBvciBtYXggZGF0ZXNcclxuICovXHJcbmNvbnN0IGlzRGF0ZXNNb250aE91dHNpZGVNaW5Pck1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIGxhc3REYXlPZk1vbnRoKGRhdGUpIDwgbWluRGF0ZSB8fCAobWF4RGF0ZSAmJiBzdGFydE9mTW9udGgoZGF0ZSkgPiBtYXhEYXRlKVxyXG4gICk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgeWVhciBpcyBpbnZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlIG1vbnRoIG91dHNpZGUgbWluIG9yIG1heCBkYXRlc1xyXG4gKi9cclxuY29uc3QgaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBsYXN0RGF5T2ZNb250aChzZXRNb250aChkYXRlLCAxMSkpIDwgbWluRGF0ZSB8fFxyXG4gICAgKG1heERhdGUgJiYgc3RhcnRPZk1vbnRoKHNldE1vbnRoKGRhdGUsIDApKSA+IG1heERhdGUpXHJcbiAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQYXJzZSBhIGRhdGUgd2l0aCBmb3JtYXQgRC1NLVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlU3RyaW5nIHRoZSBkYXRlIHN0cmluZyB0byBwYXJzZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZUZvcm1hdCB0aGUgZm9ybWF0IG9mIHRoZSBkYXRlIHN0cmluZ1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFkanVzdERhdGUgc2hvdWxkIHRoZSBkYXRlIGJlIGFkanVzdGVkXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgcGFyc2VkIGRhdGVcclxuICovXHJcbmNvbnN0IHBhcnNlRGF0ZVN0cmluZyA9IChcclxuICBkYXRlU3RyaW5nLFxyXG4gIGRhdGVGb3JtYXQgPSBJTlRFUk5BTF9EQVRFX0ZPUk1BVCxcclxuICBhZGp1c3REYXRlID0gZmFsc2VcclxuKSA9PiB7XHJcbiAgbGV0IGRhdGU7XHJcbiAgbGV0IG1vbnRoO1xyXG4gIGxldCBkYXk7XHJcbiAgbGV0IHllYXI7XHJcbiAgbGV0IHBhcnNlZDtcclxuXHJcbiAgaWYgKGRhdGVTdHJpbmcpIHtcclxuICAgIGxldCBtb250aFN0ciwgZGF5U3RyLCB5ZWFyU3RyO1xyXG4gICAgaWYgKGRhdGVGb3JtYXQgPT09IERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQpIHtcclxuICAgICAgW2RheVN0ciwgbW9udGhTdHIsIHllYXJTdHJdID0gZGF0ZVN0cmluZy5zcGxpdChcIi9cIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBbeWVhclN0ciwgbW9udGhTdHIsIGRheVN0cl0gPSBkYXRlU3RyaW5nLnNwbGl0KFwiLVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoeWVhclN0cikge1xyXG4gICAgICBwYXJzZWQgPSBwYXJzZUludCh5ZWFyU3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICB5ZWFyID0gcGFyc2VkO1xyXG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XHJcbiAgICAgICAgICB5ZWFyID0gTWF0aC5tYXgoMCwgeWVhcik7XHJcbiAgICAgICAgICBpZiAoeWVhclN0ci5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gdG9kYXkoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50WWVhclN0dWIgPVxyXG4gICAgICAgICAgICAgIGN1cnJlbnRZZWFyIC0gKGN1cnJlbnRZZWFyICUgMTAgKiogeWVhclN0ci5sZW5ndGgpO1xyXG4gICAgICAgICAgICB5ZWFyID0gY3VycmVudFllYXJTdHViICsgcGFyc2VkO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb250aFN0cikge1xyXG4gICAgICBwYXJzZWQgPSBwYXJzZUludChtb250aFN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XHJcbiAgICAgICAgbW9udGggPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIG1vbnRoID0gTWF0aC5tYXgoMSwgbW9udGgpO1xyXG4gICAgICAgICAgbW9udGggPSBNYXRoLm1pbigxMiwgbW9udGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb250aCAmJiBkYXlTdHIgJiYgeWVhciAhPSBudWxsKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KGRheVN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XHJcbiAgICAgICAgZGF5ID0gcGFyc2VkO1xyXG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XHJcbiAgICAgICAgICBjb25zdCBsYXN0RGF5T2ZUaGVNb250aCA9IHNldERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcclxuICAgICAgICAgIGRheSA9IE1hdGgubWF4KDEsIGRheSk7XHJcbiAgICAgICAgICBkYXkgPSBNYXRoLm1pbihsYXN0RGF5T2ZUaGVNb250aCwgZGF5KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobW9udGggJiYgZGF5ICYmIHllYXIgIT0gbnVsbCkge1xyXG4gICAgICBkYXRlID0gc2V0RGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGb3JtYXQgYSBkYXRlIHRvIGZvcm1hdCBNTS1ERC1ZWVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSB0aGUgZGF0ZSB0byBmb3JtYXRcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVGb3JtYXQgdGhlIGZvcm1hdCBvZiB0aGUgZGF0ZSBzdHJpbmdcclxuICogQHJldHVybnMge3N0cmluZ30gdGhlIGZvcm1hdHRlZCBkYXRlIHN0cmluZ1xyXG4gKi9cclxuY29uc3QgZm9ybWF0RGF0ZSA9IChkYXRlLCBkYXRlRm9ybWF0ID0gSU5URVJOQUxfREFURV9GT1JNQVQpID0+IHtcclxuICBjb25zdCBwYWRaZXJvcyA9ICh2YWx1ZSwgbGVuZ3RoKSA9PiB7XHJcbiAgICByZXR1cm4gYDAwMDAke3ZhbHVlfWAuc2xpY2UoLWxlbmd0aCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gIGNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG4gIGNvbnN0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcblxyXG4gIGlmIChkYXRlRm9ybWF0ID09PSBERUZBVUxUX0VYVEVSTkFMX0RBVEVfRk9STUFUKSB7XHJcbiAgICByZXR1cm4gW3BhZFplcm9zKGRheSwgMiksIHBhZFplcm9zKG1vbnRoLCAyKSwgcGFkWmVyb3MoeWVhciwgNCldLmpvaW4oXCIvXCIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtwYWRaZXJvcyh5ZWFyLCA0KSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyhkYXksIDIpXS5qb2luKFwiLVwiKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gRGF0ZSBNYW5pcHVsYXRpb24gRnVuY3Rpb25zXHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgZ3JpZCBzdHJpbmcgZnJvbSBhbiBhcnJheSBvZiBodG1sIHN0cmluZ3NcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmdbXX0gaHRtbEFycmF5IHRoZSBhcnJheSBvZiBodG1sIGl0ZW1zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByb3dTaXplIHRoZSBsZW5ndGggb2YgYSByb3dcclxuICogQHJldHVybnMge3N0cmluZ30gdGhlIGdyaWQgc3RyaW5nXHJcbiAqL1xyXG5jb25zdCBsaXN0VG9HcmlkSHRtbCA9IChodG1sQXJyYXksIHJvd1NpemUpID0+IHtcclxuICBjb25zdCBncmlkID0gW107XHJcbiAgbGV0IHJvdyA9IFtdO1xyXG5cclxuICBsZXQgaSA9IDA7XHJcbiAgd2hpbGUgKGkgPCBodG1sQXJyYXkubGVuZ3RoKSB7XHJcbiAgICByb3cgPSBbXTtcclxuICAgIHdoaWxlIChpIDwgaHRtbEFycmF5Lmxlbmd0aCAmJiByb3cubGVuZ3RoIDwgcm93U2l6ZSkge1xyXG4gICAgICByb3cucHVzaChgPHRkPiR7aHRtbEFycmF5W2ldfTwvdGQ+YCk7XHJcbiAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuICAgIGdyaWQucHVzaChgPHRyPiR7cm93LmpvaW4oXCJcIil9PC90cj5gKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBncmlkLmpvaW4oXCJcIik7XHJcbn07XHJcblxyXG4vKipcclxuICogc2V0IHRoZSB2YWx1ZSBvZiB0aGUgZWxlbWVudCBhbmQgZGlzcGF0Y2ggYSBjaGFuZ2UgZXZlbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBlbCBUaGUgZWxlbWVudCB0byB1cGRhdGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IGNoYW5nZUVsZW1lbnRWYWx1ZSA9IChlbCwgdmFsdWUgPSBcIlwiKSA9PiB7XHJcbiAgY29uc3QgZWxlbWVudFRvQ2hhbmdlID0gZWw7XHJcbiAgZWxlbWVudFRvQ2hhbmdlLnZhbHVlID0gdmFsdWU7XHJcblxyXG5cclxuICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoJ2NoYW5nZScpO1xyXG4gIGVsZW1lbnRUb0NoYW5nZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUaGUgcHJvcGVydGllcyBhbmQgZWxlbWVudHMgd2l0aGluIHRoZSBkYXRlIHBpY2tlci5cclxuICogQHR5cGVkZWYge09iamVjdH0gRGF0ZVBpY2tlckNvbnRleHRcclxuICogQHByb3BlcnR5IHtIVE1MRGl2RWxlbWVudH0gY2FsZW5kYXJFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBkYXRlUGlja2VyRWxcclxuICogQHByb3BlcnR5IHtIVE1MSW5wdXRFbGVtZW50fSBpbnRlcm5hbElucHV0RWxcclxuICogQHByb3BlcnR5IHtIVE1MSW5wdXRFbGVtZW50fSBleHRlcm5hbElucHV0RWxcclxuICogQHByb3BlcnR5IHtIVE1MRGl2RWxlbWVudH0gc3RhdHVzRWxcclxuICogQHByb3BlcnR5IHtIVE1MRGl2RWxlbWVudH0gZmlyc3RZZWFyQ2h1bmtFbFxyXG4gKiBAcHJvcGVydHkge0RhdGV9IGNhbGVuZGFyRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IG1pbkRhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBtYXhEYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gc2VsZWN0ZWREYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gcmFuZ2VEYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gZGVmYXVsdERhdGVcclxuICovXHJcblxyXG4vKipcclxuICogR2V0IGFuIG9iamVjdCBvZiB0aGUgcHJvcGVydGllcyBhbmQgZWxlbWVudHMgYmVsb25naW5nIGRpcmVjdGx5IHRvIHRoZSBnaXZlblxyXG4gKiBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIHRoZSBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXJcclxuICogQHJldHVybnMge0RhdGVQaWNrZXJDb250ZXh0fSBlbGVtZW50c1xyXG4gKi9cclxuY29uc3QgZ2V0RGF0ZVBpY2tlckNvbnRleHQgPSAoZWwpID0+IHtcclxuICBjb25zdCBkYXRlUGlja2VyRWwgPSBlbC5jbG9zZXN0KERBVEVfUElDS0VSKTtcclxuXHJcbiAgaWYgKCFkYXRlUGlja2VyRWwpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgRWxlbWVudCBpcyBtaXNzaW5nIG91dGVyICR7REFURV9QSUNLRVJ9YCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBpbnRlcm5hbElucHV0RWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihcclxuICAgIERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUXHJcbiAgKTtcclxuICBjb25zdCBleHRlcm5hbElucHV0RWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihcclxuICAgIERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXHJcbiAgKTtcclxuICBjb25zdCBjYWxlbmRhckVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoREFURV9QSUNLRVJfQ0FMRU5EQVIpO1xyXG4gIGNvbnN0IHRvZ2dsZUJ0bkVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoREFURV9QSUNLRVJfQlVUVE9OKTtcclxuICBjb25zdCBzdGF0dXNFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX1NUQVRVUyk7XHJcbiAgY29uc3QgZmlyc3RZZWFyQ2h1bmtFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVIpO1xyXG5cclxuICBjb25zdCBpbnB1dERhdGUgPSBwYXJzZURhdGVTdHJpbmcoXHJcbiAgICBleHRlcm5hbElucHV0RWwudmFsdWUsXHJcbiAgICBERUZBVUxUX0VYVEVSTkFMX0RBVEVfRk9STUFULFxyXG4gICAgdHJ1ZVxyXG4gICk7XHJcbiAgY29uc3Qgc2VsZWN0ZWREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGludGVybmFsSW5wdXRFbC52YWx1ZSk7XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhjYWxlbmRhckVsLmRhdGFzZXQudmFsdWUpO1xyXG4gIGNvbnN0IG1pbkRhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSk7XHJcbiAgY29uc3QgbWF4RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlKTtcclxuICBjb25zdCByYW5nZURhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQucmFuZ2VEYXRlKTtcclxuICBjb25zdCBkZWZhdWx0RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5kZWZhdWx0RGF0ZSk7XHJcblxyXG4gIGlmIChtaW5EYXRlICYmIG1heERhdGUgJiYgbWluRGF0ZSA+IG1heERhdGUpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIk1pbmltdW0gZGF0ZSBjYW5ub3QgYmUgYWZ0ZXIgbWF4aW11bSBkYXRlXCIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGNhbGVuZGFyRGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICB0b2dnbGVCdG5FbCxcclxuICAgIHNlbGVjdGVkRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgICBmaXJzdFllYXJDaHVua0VsLFxyXG4gICAgZGF0ZVBpY2tlckVsLFxyXG4gICAgaW5wdXREYXRlLFxyXG4gICAgaW50ZXJuYWxJbnB1dEVsLFxyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHJhbmdlRGF0ZSxcclxuICAgIGRlZmF1bHREYXRlLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEaXNhYmxlIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzYWJsZSA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCB0b2dnbGVCdG5FbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICB0b2dnbGVCdG5FbC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmRpc2FibGVkID0gdHJ1ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBFbmFibGUgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBlbmFibGUgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGV4dGVybmFsSW5wdXRFbCwgdG9nZ2xlQnRuRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgdG9nZ2xlQnRuRWwuZGlzYWJsZWQgPSBmYWxzZTtcclxuICBleHRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSBmYWxzZTtcclxufTtcclxuXHJcbi8vICNyZWdpb24gVmFsaWRhdGlvblxyXG5cclxuLyoqXHJcbiAqIFZhbGlkYXRlIHRoZSB2YWx1ZSBpbiB0aGUgaW5wdXQgYXMgYSB2YWxpZCBkYXRlIG9mIGZvcm1hdCBEL00vWVlZWVxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBpc0RhdGVJbnB1dEludmFsaWQgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGV4dGVybmFsSW5wdXRFbCwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBjb25zdCBkYXRlU3RyaW5nID0gZXh0ZXJuYWxJbnB1dEVsLnZhbHVlO1xyXG4gIGxldCBpc0ludmFsaWQgPSBmYWxzZTtcclxuXHJcbiAgaWYgKGRhdGVTdHJpbmcpIHtcclxuICAgIGlzSW52YWxpZCA9IHRydWU7XHJcblxyXG4gICAgY29uc3QgZGF0ZVN0cmluZ1BhcnRzID0gZGF0ZVN0cmluZy5zcGxpdChcIi9cIik7XHJcbiAgICBjb25zdCBbZGF5LCBtb250aCwgeWVhcl0gPSBkYXRlU3RyaW5nUGFydHMubWFwKChzdHIpID0+IHtcclxuICAgICAgbGV0IHZhbHVlO1xyXG4gICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUludChzdHIsIDEwKTtcclxuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkgdmFsdWUgPSBwYXJzZWQ7XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChtb250aCAmJiBkYXkgJiYgeWVhciAhPSBudWxsKSB7XHJcbiAgICAgIGNvbnN0IGNoZWNrRGF0ZSA9IHNldERhdGUoeWVhciwgbW9udGggLSAxLCBkYXkpO1xyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXRNb250aCgpID09PSBtb250aCAtIDEgJiZcclxuICAgICAgICBjaGVja0RhdGUuZ2V0RGF0ZSgpID09PSBkYXkgJiZcclxuICAgICAgICBjaGVja0RhdGUuZ2V0RnVsbFllYXIoKSA9PT0geWVhciAmJlxyXG4gICAgICAgIGRhdGVTdHJpbmdQYXJ0c1syXS5sZW5ndGggPT09IDQgJiZcclxuICAgICAgICBpc0RhdGVXaXRoaW5NaW5BbmRNYXgoY2hlY2tEYXRlLCBtaW5EYXRlLCBtYXhEYXRlKVxyXG4gICAgICApIHtcclxuICAgICAgICBpc0ludmFsaWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGlzSW52YWxpZDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZSB0aGUgdmFsdWUgaW4gdGhlIGlucHV0IGFzIGEgdmFsaWQgZGF0ZSBvZiBmb3JtYXQgTS9EL1lZWVlcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgdmFsaWRhdGVEYXRlSW5wdXQgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGV4dGVybmFsSW5wdXRFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGNvbnN0IGlzSW52YWxpZCA9IGlzRGF0ZUlucHV0SW52YWxpZChleHRlcm5hbElucHV0RWwpO1xyXG5cclxuICBpZiAoaXNJbnZhbGlkICYmICFleHRlcm5hbElucHV0RWwudmFsaWRhdGlvbk1lc3NhZ2UpIHtcclxuICAgIGV4dGVybmFsSW5wdXRFbC5zZXRDdXN0b21WYWxpZGl0eShWQUxJREFUSU9OX01FU1NBR0UpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFpc0ludmFsaWQgJiYgZXh0ZXJuYWxJbnB1dEVsLnZhbGlkYXRpb25NZXNzYWdlID09PSBWQUxJREFUSU9OX01FU1NBR0UpIHtcclxuICAgIGV4dGVybmFsSW5wdXRFbC5zZXRDdXN0b21WYWxpZGl0eShcIlwiKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIFZhbGlkYXRpb25cclxuXHJcbi8qKlxyXG4gKiBFbmFibGUgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCByZWNvbmNpbGVJbnB1dFZhbHVlcyA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgaW50ZXJuYWxJbnB1dEVsLCBpbnB1dERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBsZXQgbmV3VmFsdWUgPSBcIlwiO1xyXG5cclxuICBpZiAoaW5wdXREYXRlICYmICFpc0RhdGVJbnB1dEludmFsaWQoZWwpKSB7XHJcbiAgICBuZXdWYWx1ZSA9IGZvcm1hdERhdGUoaW5wdXREYXRlKTtcclxuICB9XHJcblxyXG4gIGlmIChpbnRlcm5hbElucHV0RWwudmFsdWUgIT09IG5ld1ZhbHVlKSB7XHJcbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoaW50ZXJuYWxJbnB1dEVsLCBuZXdWYWx1ZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCB0aGUgdmFsdWUgb2YgdGhlIGRhdGUgcGlja2VyIGlucHV0cy5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZVN0cmluZyBUaGUgZGF0ZSBzdHJpbmcgdG8gdXBkYXRlIGluIFlZWVktTU0tREQgZm9ybWF0XHJcbiAqL1xyXG5jb25zdCBzZXRDYWxlbmRhclZhbHVlID0gKGVsLCBkYXRlU3RyaW5nKSA9PiB7XHJcbiAgY29uc3QgcGFyc2VkRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlU3RyaW5nKTtcclxuXHJcbiAgaWYgKHBhcnNlZERhdGUpIHtcclxuICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKHBhcnNlZERhdGUsIERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQpO1xyXG5cclxuICAgIGNvbnN0IHtcclxuICAgICAgZGF0ZVBpY2tlckVsLFxyXG4gICAgICBpbnRlcm5hbElucHV0RWwsXHJcbiAgICAgIGV4dGVybmFsSW5wdXRFbCxcclxuICAgIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gICAgY2hhbmdlRWxlbWVudFZhbHVlKGludGVybmFsSW5wdXRFbCwgZGF0ZVN0cmluZyk7XHJcbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoZXh0ZXJuYWxJbnB1dEVsLCBmb3JtYXR0ZWREYXRlKTtcclxuXHJcbiAgICB2YWxpZGF0ZURhdGVJbnB1dChkYXRlUGlja2VyRWwpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBFbmhhbmNlIGFuIGlucHV0IHdpdGggdGhlIGRhdGUgcGlja2VyIGVsZW1lbnRzXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIFRoZSBpbml0aWFsIHdyYXBwaW5nIGVsZW1lbnQgb2YgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZW5oYW5jZURhdGVQaWNrZXIgPSAoZWwpID0+IHtcclxuICBjb25zdCBkYXRlUGlja2VyRWwgPSBlbC5jbG9zZXN0KERBVEVfUElDS0VSKTtcclxuICBjb25zdCBkZWZhdWx0VmFsdWUgPSBkYXRlUGlja2VyRWwuZGF0YXNldC5kZWZhdWx0VmFsdWU7XHJcblxyXG4gIGNvbnN0IGludGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKGBpbnB1dGApO1xyXG5cclxuICBpZiAoIWludGVybmFsSW5wdXRFbCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGAke0RBVEVfUElDS0VSfSBpcyBtaXNzaW5nIGlubmVyIGlucHV0YCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgY29uc3QgbWluRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhcclxuICAgIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1pbkRhdGUgfHwgaW50ZXJuYWxJbnB1dEVsLmdldEF0dHJpYnV0ZShcIm1pblwiKVxyXG4gICk7XHJcbiAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSA9IG1pbkRhdGVcclxuICAgID8gZm9ybWF0RGF0ZShtaW5EYXRlKVxyXG4gICAgOiBERUZBVUxUX01JTl9EQVRFO1xyXG5cclxuICBjb25zdCBtYXhEYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxyXG4gICAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWF4RGF0ZSB8fCBpbnRlcm5hbElucHV0RWwuZ2V0QXR0cmlidXRlKFwibWF4XCIpXHJcbiAgKTtcclxuICBpZiAobWF4RGF0ZSkge1xyXG4gICAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWF4RGF0ZSA9IGZvcm1hdERhdGUobWF4RGF0ZSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBjYWxlbmRhcldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gIGNhbGVuZGFyV3JhcHBlci5jbGFzc0xpc3QuYWRkKERBVEVfUElDS0VSX1dSQVBQRVJfQ0xBU1MpO1xyXG4gIGNhbGVuZGFyV3JhcHBlci50YWJJbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgY29uc3QgZXh0ZXJuYWxJbnB1dEVsID0gaW50ZXJuYWxJbnB1dEVsLmNsb25lTm9kZSgpO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5jbGFzc0xpc3QuYWRkKERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUX0NMQVNTKTtcclxuICBleHRlcm5hbElucHV0RWwudHlwZSA9IFwidGV4dFwiO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5uYW1lID0gXCJcIjtcclxuXHJcbiAgY2FsZW5kYXJXcmFwcGVyLmFwcGVuZENoaWxkKGV4dGVybmFsSW5wdXRFbCk7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTChcclxuICAgIFwiYmVmb3JlZW5kXCIsXHJcbiAgICBbXHJcbiAgICAgIGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIiR7REFURV9QSUNLRVJfQlVUVE9OX0NMQVNTfVwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1sYWJlbD1cIiR7dGV4dC5vcGVuX2NhbGVuZGFyfVwiPiZuYnNwOzwvYnV0dG9uPmAsXHJcbiAgICAgIGA8ZGl2IGNsYXNzPVwiJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31cIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBoaWRkZW4+PC9kaXY+YCxcclxuICAgICAgYDxkaXYgY2xhc3M9XCJzci1vbmx5ICR7REFURV9QSUNLRVJfU1RBVFVTX0NMQVNTfVwiIHJvbGU9XCJzdGF0dXNcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIj48L2Rpdj5gLFxyXG4gICAgXS5qb2luKFwiXCIpXHJcbiAgKTtcclxuXHJcbiAgaW50ZXJuYWxJbnB1dEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcclxuICBpbnRlcm5hbElucHV0RWwuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcclxuICBpbnRlcm5hbElucHV0RWwuY2xhc3NMaXN0LmFkZChcclxuICAgIFwic3Itb25seVwiLFxyXG4gICAgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRfQ0xBU1NcclxuICApO1xyXG4gIGludGVybmFsSW5wdXRFbC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgaW50ZXJuYWxJbnB1dEVsLnJlcXVpcmVkID0gZmFsc2U7XHJcblxyXG4gIGRhdGVQaWNrZXJFbC5hcHBlbmRDaGlsZChjYWxlbmRhcldyYXBwZXIpO1xyXG4gIGRhdGVQaWNrZXJFbC5jbGFzc0xpc3QuYWRkKERBVEVfUElDS0VSX0lOSVRJQUxJWkVEX0NMQVNTKTtcclxuXHJcbiAgaWYgKGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgc2V0Q2FsZW5kYXJWYWx1ZShkYXRlUGlja2VyRWwsIGRlZmF1bHRWYWx1ZSk7XHJcbiAgfVxyXG5cclxuICBpZiAoaW50ZXJuYWxJbnB1dEVsLmRpc2FibGVkKSB7XHJcbiAgICBkaXNhYmxlKGRhdGVQaWNrZXJFbCk7XHJcbiAgICBpbnRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSBmYWxzZTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKGV4dGVybmFsSW5wdXRFbC52YWx1ZSkge1xyXG4gICAgdmFsaWRhdGVEYXRlSW5wdXQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIC0gRGF0ZSBTZWxlY3Rpb24gVmlld1xyXG5cclxuLyoqXHJcbiAqIHJlbmRlciB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZVRvRGlzcGxheSBhIGRhdGUgdG8gcmVuZGVyIG9uIHRoZSBjYWxlbmRhclxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgcmVuZGVyQ2FsZW5kYXIgPSAoZWwsIF9kYXRlVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgZGF0ZVBpY2tlckVsLFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgc2VsZWN0ZWREYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICByYW5nZURhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBjb25zdCB0b2RheXNEYXRlID0gdG9kYXkoKTtcclxuICBsZXQgZGF0ZVRvRGlzcGxheSA9IF9kYXRlVG9EaXNwbGF5IHx8IHRvZGF5c0RhdGU7XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyV2FzSGlkZGVuID0gY2FsZW5kYXJFbC5oaWRkZW47XHJcblxyXG4gIGNvbnN0IGZvY3VzZWREYXRlID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAwKTtcclxuICBjb25zdCBmb2N1c2VkTW9udGggPSBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCk7XHJcbiAgY29uc3QgZm9jdXNlZFllYXIgPSBkYXRlVG9EaXNwbGF5LmdldEZ1bGxZZWFyKCk7XHJcblxyXG4gIGNvbnN0IHByZXZNb250aCA9IHN1Yk1vbnRocyhkYXRlVG9EaXNwbGF5LCAxKTtcclxuICBjb25zdCBuZXh0TW9udGggPSBhZGRNb250aHMoZGF0ZVRvRGlzcGxheSwgMSk7XHJcblxyXG4gIGNvbnN0IGN1cnJlbnRGb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShkYXRlVG9EaXNwbGF5KTtcclxuXHJcbiAgY29uc3QgZmlyc3RPZk1vbnRoID0gc3RhcnRPZk1vbnRoKGRhdGVUb0Rpc3BsYXkpO1xyXG4gIGNvbnN0IHByZXZCdXR0b25zRGlzYWJsZWQgPSBpc1NhbWVNb250aChkYXRlVG9EaXNwbGF5LCBtaW5EYXRlKTtcclxuICBjb25zdCBuZXh0QnV0dG9uc0Rpc2FibGVkID0gaXNTYW1lTW9udGgoZGF0ZVRvRGlzcGxheSwgbWF4RGF0ZSk7XHJcblxyXG4gIGNvbnN0IHJhbmdlQ29uY2x1c2lvbkRhdGUgPSBzZWxlY3RlZERhdGUgfHwgZGF0ZVRvRGlzcGxheTtcclxuICBjb25zdCByYW5nZVN0YXJ0RGF0ZSA9IHJhbmdlRGF0ZSAmJiBtaW4ocmFuZ2VDb25jbHVzaW9uRGF0ZSwgcmFuZ2VEYXRlKTtcclxuICBjb25zdCByYW5nZUVuZERhdGUgPSByYW5nZURhdGUgJiYgbWF4KHJhbmdlQ29uY2x1c2lvbkRhdGUsIHJhbmdlRGF0ZSk7XHJcblxyXG4gIGNvbnN0IHdpdGhpblJhbmdlU3RhcnREYXRlID0gcmFuZ2VEYXRlICYmIGFkZERheXMocmFuZ2VTdGFydERhdGUsIDEpO1xyXG4gIGNvbnN0IHdpdGhpblJhbmdlRW5kRGF0ZSA9IHJhbmdlRGF0ZSAmJiBzdWJEYXlzKHJhbmdlRW5kRGF0ZSwgMSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoTGFiZWwgPSBNT05USF9MQUJFTFNbZm9jdXNlZE1vbnRoXTtcclxuXHJcbiAgY29uc3QgZ2VuZXJhdGVEYXRlSHRtbCA9IChkYXRlVG9SZW5kZXIpID0+IHtcclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfREFURV9DTEFTU107XHJcbiAgICBjb25zdCBkYXkgPSBkYXRlVG9SZW5kZXIuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgbW9udGggPSBkYXRlVG9SZW5kZXIuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IHllYXIgPSBkYXRlVG9SZW5kZXIuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IGRheU9mV2VlayA9IGRhdGVUb1JlbmRlci5nZXREYXkoKTtcclxuXHJcbiAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShkYXRlVG9SZW5kZXIpO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gIWlzRGF0ZVdpdGhpbk1pbkFuZE1heChkYXRlVG9SZW5kZXIsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHNlbGVjdGVkRGF0ZSk7XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgcHJldk1vbnRoKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9QUkVWSU9VU19NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVNb250aChkYXRlVG9SZW5kZXIsIG5leHRNb250aCkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfTkVYVF9NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCB0b2RheXNEYXRlKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9UT0RBWV9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJhbmdlRGF0ZSkge1xyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VEYXRlKSkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VTdGFydERhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9TVEFSVF9DTEFTUyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZUVuZERhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9FTkRfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgaXNEYXRlV2l0aGluTWluQW5kTWF4KFxyXG4gICAgICAgICAgZGF0ZVRvUmVuZGVyLFxyXG4gICAgICAgICAgd2l0aGluUmFuZ2VTdGFydERhdGUsXHJcbiAgICAgICAgICB3aXRoaW5SYW5nZUVuZERhdGVcclxuICAgICAgICApXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1dJVEhJTl9SQU5HRV9DTEFTUyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1vbnRoU3RyID0gTU9OVEhfTEFCRUxTW21vbnRoXTtcclxuICAgIGNvbnN0IGRheVN0ciA9IERBWV9PRl9XRUVLX0xBQkVMU1tkYXlPZldlZWtdO1xyXG4gICAgY29uc3QgYXJpYUxhYmVsRGF0ZSA9IHRleHQuYXJpYV9sYWJlbF9kYXRlLnJlcGxhY2UoL3tkYXlTdHJ9LywgZGF5U3RyKS5yZXBsYWNlKC97ZGF5fS8sIGRheSkucmVwbGFjZSgve21vbnRoU3RyfS8sIG1vbnRoU3RyKS5yZXBsYWNlKC97eWVhcn0vLCB5ZWFyKTtcclxuXHJcbiAgICByZXR1cm4gYDxidXR0b25cclxuICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgIHRhYmluZGV4PVwiJHt0YWJpbmRleH1cIlxyXG4gICAgICBjbGFzcz1cIiR7Y2xhc3Nlcy5qb2luKFwiIFwiKX1cIiBcclxuICAgICAgZGF0YS1kYXk9XCIke2RheX1cIiBcclxuICAgICAgZGF0YS1tb250aD1cIiR7bW9udGggKyAxfVwiIFxyXG4gICAgICBkYXRhLXllYXI9XCIke3llYXJ9XCIgXHJcbiAgICAgIGRhdGEtdmFsdWU9XCIke2Zvcm1hdHRlZERhdGV9XCJcclxuICAgICAgYXJpYS1sYWJlbD1cIiR7YXJpYUxhYmVsRGF0ZX1cIlxyXG4gICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgPiR7ZGF5fTwvYnV0dG9uPmA7XHJcbiAgfTtcclxuICAvLyBzZXQgZGF0ZSB0byBmaXJzdCByZW5kZXJlZCBkYXlcclxuICBkYXRlVG9EaXNwbGF5ID0gc3RhcnRPZldlZWsoZmlyc3RPZk1vbnRoKTtcclxuXHJcbiAgY29uc3QgZGF5cyA9IFtdO1xyXG5cclxuICB3aGlsZSAoXHJcbiAgICBkYXlzLmxlbmd0aCA8IDI4IHx8XHJcbiAgICBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCkgPT09IGZvY3VzZWRNb250aCB8fFxyXG4gICAgZGF5cy5sZW5ndGggJSA3ICE9PSAwXHJcbiAgKSB7XHJcbiAgICBkYXlzLnB1c2goZ2VuZXJhdGVEYXRlSHRtbChkYXRlVG9EaXNwbGF5KSk7XHJcbiAgICBkYXRlVG9EaXNwbGF5ID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAxKTsgICAgXHJcbiAgfVxyXG4gIGNvbnN0IGRhdGVzSHRtbCA9IGxpc3RUb0dyaWRIdG1sKGRheXMsIDcpO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XHJcbiAgbmV3Q2FsZW5kYXIuZGF0YXNldC52YWx1ZSA9IGN1cnJlbnRGb3JtYXR0ZWREYXRlO1xyXG4gIG5ld0NhbGVuZGFyLnN0eWxlLnRvcCA9IGAke2RhdGVQaWNrZXJFbC5vZmZzZXRIZWlnaHR9cHhgO1xyXG4gIG5ld0NhbGVuZGFyLmhpZGRlbiA9IGZhbHNlO1xyXG4gIGxldCBjb250ZW50ID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTU31cIj5cclxuICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfUk9XX0NMQVNTfVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7dGV4dC5wcmV2aW91c195ZWFyfVwiXHJcbiAgICAgICAgICAgICR7cHJldkJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiJHt0ZXh0LnByZXZpb3VzX21vbnRofVwiXHJcbiAgICAgICAgICAgICR7cHJldkJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX01PTlRIX0xBQkVMX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1N9XCIgYXJpYS1sYWJlbD1cIiR7bW9udGhMYWJlbH0uICR7dGV4dC5zZWxlY3RfbW9udGh9LlwiXHJcbiAgICAgICAgICA+JHttb250aExhYmVsfTwvYnV0dG9uPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHtmb2N1c2VkWWVhcn0uICR7dGV4dC5zZWxlY3RfeWVhcn0uXCJcclxuICAgICAgICAgID4ke2ZvY3VzZWRZZWFyfTwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7dGV4dC5uZXh0X21vbnRofVwiXHJcbiAgICAgICAgICAgICR7bmV4dEJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7dGV4dC5uZXh0X3llYXJ9XCJcclxuICAgICAgICAgICAgJHtuZXh0QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgPHRyPmA7XHJcbiAgZm9yKGxldCBkIGluIERBWV9PRl9XRUVLX0xBQkVMUyl7XHJcbiAgICBjb250ZW50ICs9IGA8dGggY2xhc3M9XCIke0NBTEVOREFSX0RBWV9PRl9XRUVLX0NMQVNTfVwiIHNjb3BlPVwiY29sXCIgYXJpYS1sYWJlbD1cIiR7REFZX09GX1dFRUtfTEFCRUxTW2RdfVwiPiR7REFZX09GX1dFRUtfTEFCRUxTW2RdLmNoYXJBdCgwKX08L3RoPmA7XHJcbiAgfVxyXG4gIGNvbnRlbnQgKz0gYDwvdHI+XHJcbiAgICAgICAgPC90aGVhZD5cclxuICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAke2RhdGVzSHRtbH1cclxuICAgICAgICA8L3Rib2R5PlxyXG4gICAgICA8L3RhYmxlPlxyXG4gICAgPC9kaXY+YDtcclxuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xyXG5cclxuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MpO1xyXG5cclxuICBjb25zdCBzdGF0dXNlcyA9IFtdO1xyXG5cclxuICBpZiAoaXNTYW1lRGF5KHNlbGVjdGVkRGF0ZSwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICBzdGF0dXNlcy5wdXNoKHRleHQuZGF0ZV9zZWxlY3RlZCk7XHJcbiAgfVxyXG5cclxuICBpZiAoY2FsZW5kYXJXYXNIaWRkZW4pIHtcclxuICAgIHN0YXR1c2VzLnB1c2godGV4dC5ndWlkZSk7XHJcbiAgICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IFwiXCI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHN0YXR1c2VzLnB1c2goYCR7bW9udGhMYWJlbH0gJHtmb2N1c2VkWWVhcn1gKTtcclxuICB9XHJcbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBzdGF0dXNlcy5qb2luKFwiLiBcIik7XHJcblxyXG4gIHJldHVybiBuZXdDYWxlbmRhcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlQcmV2aW91c1llYXIgPSAoX2J1dHRvbkVsKSA9PiB7XHJcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIF9idXR0b25FbFxyXG4gICk7XHJcbiAgbGV0IGRhdGUgPSBzdWJZZWFycyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9QUkVWSU9VU19ZRUFSKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVByZXZpb3VzTW9udGggPSAoX2J1dHRvbkVsKSA9PiB7XHJcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIF9idXR0b25FbFxyXG4gICk7XHJcbiAgbGV0IGRhdGUgPSBzdWJNb250aHMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEgpO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5TmV4dE1vbnRoID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gYWRkTW9udGhzKGNhbGVuZGFyRGF0ZSwgMSk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX05FWFRfTU9OVEgpO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlOZXh0WWVhciA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IGFkZFllYXJzKGNhbGVuZGFyRGF0ZSwgMSk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX05FWFRfWUVBUik7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhpZGUgdGhlIGNhbGVuZGFyIG9mIGEgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBoaWRlQ2FsZW5kYXIgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGRhdGVQaWNrZXJFbCwgY2FsZW5kYXJFbCwgc3RhdHVzRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5yZW1vdmUoREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTKTtcclxuICBjYWxlbmRhckVsLmhpZGRlbiA9IHRydWU7XHJcbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBcIlwiO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCBhIGRhdGUgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGNhbGVuZGFyRGF0ZUVsIEEgZGF0ZSBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBzZWxlY3REYXRlID0gKGNhbGVuZGFyRGF0ZUVsKSA9PiB7XHJcbiAgaWYgKGNhbGVuZGFyRGF0ZUVsLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBleHRlcm5hbElucHV0RWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgY2FsZW5kYXJEYXRlRWxcclxuICApO1xyXG4gIHNldENhbGVuZGFyVmFsdWUoY2FsZW5kYXJEYXRlRWwsIGNhbGVuZGFyRGF0ZUVsLmRhdGFzZXQudmFsdWUpO1xyXG4gIGhpZGVDYWxlbmRhcihkYXRlUGlja2VyRWwpO1xyXG5cclxuICBleHRlcm5hbElucHV0RWwuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUb2dnbGUgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCB0b2dnbGVDYWxlbmRhciA9IChlbCkgPT4ge1xyXG4gIGlmIChlbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHtcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBpbnB1dERhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIGRlZmF1bHREYXRlLFxyXG4gIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGlmIChjYWxlbmRhckVsLmhpZGRlbikge1xyXG4gICAgY29uc3QgZGF0ZVRvRGlzcGxheSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChcclxuICAgICAgaW5wdXREYXRlIHx8IGRlZmF1bHREYXRlIHx8IHRvZGF5KCksXHJcbiAgICAgIG1pbkRhdGUsXHJcbiAgICAgIG1heERhdGVcclxuICAgICk7XHJcbiAgICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGVUb0Rpc3BsYXkpO1xyXG4gICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGhpZGVDYWxlbmRhcihlbCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSB0aGUgY2FsZW5kYXIgd2hlbiB2aXNpYmxlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBhbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXJcclxuICovXHJcbmNvbnN0IHVwZGF0ZUNhbGVuZGFySWZWaXNpYmxlID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBpbnB1dERhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBjb25zdCBjYWxlbmRhclNob3duID0gIWNhbGVuZGFyRWwuaGlkZGVuO1xyXG5cclxuICBpZiAoY2FsZW5kYXJTaG93biAmJiBpbnB1dERhdGUpIHtcclxuICAgIGNvbnN0IGRhdGVUb0Rpc3BsYXkgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoaW5wdXREYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGVUb0Rpc3BsYXkpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBEYXRlIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIC0gTW9udGggU2VsZWN0aW9uIFZpZXdcclxuLyoqXHJcbiAqIERpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4gaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gYSByZWZlcmVuY2UgdG8gdGhlIG5ldyBjYWxlbmRhciBlbGVtZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5TW9udGhTZWxlY3Rpb24gPSAoZWwsIG1vbnRoVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgY2FsZW5kYXJEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IGNhbGVuZGFyRGF0ZS5nZXRNb250aCgpO1xyXG4gIGNvbnN0IGZvY3VzZWRNb250aCA9IG1vbnRoVG9EaXNwbGF5ID09IG51bGwgPyBzZWxlY3RlZE1vbnRoIDogbW9udGhUb0Rpc3BsYXk7XHJcblxyXG4gIGNvbnN0IG1vbnRocyA9IE1PTlRIX0xBQkVMUy5tYXAoKG1vbnRoLCBpbmRleCkgPT4ge1xyXG4gICAgY29uc3QgbW9udGhUb0NoZWNrID0gc2V0TW9udGgoY2FsZW5kYXJEYXRlLCBpbmRleCk7XHJcblxyXG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IGlzRGF0ZXNNb250aE91dHNpZGVNaW5Pck1heChcclxuICAgICAgbW9udGhUb0NoZWNrLFxyXG4gICAgICBtaW5EYXRlLFxyXG4gICAgICBtYXhEYXRlXHJcbiAgICApO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBjbGFzc2VzID0gW0NBTEVOREFSX01PTlRIX0NMQVNTXTtcclxuICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBpbmRleCA9PT0gc2VsZWN0ZWRNb250aDtcclxuXHJcbiAgICBpZiAoaW5kZXggPT09IGZvY3VzZWRNb250aCkge1xyXG4gICAgICB0YWJpbmRleCA9IFwiMFwiO1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX01PTlRIX1NFTEVDVEVEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYDxidXR0b24gXHJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgdGFiaW5kZXg9XCIke3RhYmluZGV4fVwiXHJcbiAgICAgICAgY2xhc3M9XCIke2NsYXNzZXMuam9pbihcIiBcIil9XCIgXHJcbiAgICAgICAgZGF0YS12YWx1ZT1cIiR7aW5kZXh9XCJcclxuICAgICAgICBkYXRhLWxhYmVsPVwiJHttb250aH1cIlxyXG4gICAgICAgIGFyaWEtc2VsZWN0ZWQ9XCIke2lzU2VsZWN0ZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIn1cIlxyXG4gICAgICAgICR7aXNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgPiR7bW9udGh9PC9idXR0b24+YDtcclxuICB9KTtcclxuXHJcbiAgY29uc3QgbW9udGhzSHRtbCA9IGA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIiR7Q0FMRU5EQVJfTU9OVEhfUElDS0VSX0NMQVNTfVwiPlxyXG4gICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgIDx0Ym9keT5cclxuICAgICAgICAke2xpc3RUb0dyaWRIdG1sKG1vbnRocywgMyl9XHJcbiAgICAgIDwvdGJvZHk+XHJcbiAgICA8L3RhYmxlPlxyXG4gIDwvZGl2PmA7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gY2FsZW5kYXJFbC5jbG9uZU5vZGUoKTtcclxuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBtb250aHNIdG1sO1xyXG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xyXG5cclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IHRleHQubW9udGhzX2Rpc3BsYXllZDtcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCBhIG1vbnRoIGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IG1vbnRoRWwgQW4gbW9udGggZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3Qgc2VsZWN0TW9udGggPSAobW9udGhFbCkgPT4ge1xyXG4gIGlmIChtb250aEVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgbW9udGhFbFxyXG4gICk7XHJcbiAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gIGxldCBkYXRlID0gc2V0TW9udGgoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZE1vbnRoKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIC0gTW9udGggU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBZZWFyIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vKipcclxuICogRGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuIGluIHRoZSBkYXRlIHBpY2tlci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge251bWJlcn0geWVhclRvRGlzcGxheSB5ZWFyIHRvIGRpc3BsYXkgaW4geWVhciBzZWxlY3Rpb25cclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBhIHJlZmVyZW5jZSB0byB0aGUgbmV3IGNhbGVuZGFyIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlZZWFyU2VsZWN0aW9uID0gKGVsLCB5ZWFyVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgY2FsZW5kYXJEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gY2FsZW5kYXJEYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgY29uc3QgZm9jdXNlZFllYXIgPSB5ZWFyVG9EaXNwbGF5ID09IG51bGwgPyBzZWxlY3RlZFllYXIgOiB5ZWFyVG9EaXNwbGF5O1xyXG5cclxuICBsZXQgeWVhclRvQ2h1bmsgPSBmb2N1c2VkWWVhcjtcclxuICB5ZWFyVG9DaHVuayAtPSB5ZWFyVG9DaHVuayAlIFlFQVJfQ0hVTks7XHJcbiAgeWVhclRvQ2h1bmsgPSBNYXRoLm1heCgwLCB5ZWFyVG9DaHVuayk7XHJcblxyXG4gIGNvbnN0IHByZXZZZWFyQ2h1bmtEaXNhYmxlZCA9IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJUb0NodW5rIC0gMSksXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IG5leHRZZWFyQ2h1bmtEaXNhYmxlZCA9IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJUb0NodW5rICsgWUVBUl9DSFVOSyksXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IHllYXJzID0gW107XHJcbiAgbGV0IHllYXJJbmRleCA9IHllYXJUb0NodW5rO1xyXG4gIHdoaWxlICh5ZWFycy5sZW5ndGggPCBZRUFSX0NIVU5LKSB7XHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICAgIHNldFllYXIoY2FsZW5kYXJEYXRlLCB5ZWFySW5kZXgpLFxyXG4gICAgICBtaW5EYXRlLFxyXG4gICAgICBtYXhEYXRlXHJcbiAgICApO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBjbGFzc2VzID0gW0NBTEVOREFSX1lFQVJfQ0xBU1NdO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IHllYXJJbmRleCA9PT0gc2VsZWN0ZWRZZWFyO1xyXG5cclxuICAgIGlmICh5ZWFySW5kZXggPT09IGZvY3VzZWRZZWFyKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9ZRUFSX1NFTEVDVEVEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICB5ZWFycy5wdXNoKFxyXG4gICAgICBgPGJ1dHRvbiBcclxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcclxuICAgICAgICBjbGFzcz1cIiR7Y2xhc3Nlcy5qb2luKFwiIFwiKX1cIiBcclxuICAgICAgICBkYXRhLXZhbHVlPVwiJHt5ZWFySW5kZXh9XCJcclxuICAgICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgID4ke3llYXJJbmRleH08L2J1dHRvbj5gXHJcbiAgICApO1xyXG4gICAgeWVhckluZGV4ICs9IDE7XHJcbiAgfVxyXG5cclxuICBjb25zdCB5ZWFyc0h0bWwgPSBsaXN0VG9HcmlkSHRtbCh5ZWFycywgMyk7XHJcbiAgY29uc3QgYXJpYUxhYmVsUHJldmlvdXNZZWFycyA9IHRleHQucHJldmlvdXNfeWVhcnMucmVwbGFjZSgve3llYXJzfS8sIFlFQVJfQ0hVTkspO1xyXG4gIGNvbnN0IGFyaWFMYWJlbE5leHRZZWFycyA9IHRleHQubmV4dF95ZWFycy5yZXBsYWNlKC97eWVhcnN9LywgWUVBUl9DSFVOSyk7XHJcbiAgY29uc3QgYW5ub3VuY2VZZWFycyA9IHRleHQueWVhcnNfZGlzcGxheWVkLnJlcGxhY2UoL3tzdGFydH0vLCB5ZWFyVG9DaHVuaykucmVwbGFjZSgve2VuZH0vLCB5ZWFyVG9DaHVuayArIFlFQVJfQ0hVTksgLSAxKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xyXG4gIG5ld0NhbGVuZGFyLmlubmVySFRNTCA9IGA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIiR7Q0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1N9XCI+XHJcbiAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTfVwiIFxyXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIiR7YXJpYUxhYmVsUHJldmlvdXNZZWFyc31cIlxyXG4gICAgICAgICAgICAgICAgJHtwcmV2WWVhckNodW5rRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjNcIj5cclxuICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgJHt5ZWFyc0h0bWx9XHJcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1N9XCIgXHJcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiJHthcmlhTGFiZWxOZXh0WWVhcnN9XCJcclxuICAgICAgICAgICAgICAgICR7bmV4dFllYXJDaHVua0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgPC90Ym9keT5cclxuICAgICAgPC90YWJsZT5cclxuICAgIDwvZGl2PmA7XHJcbiAgY2FsZW5kYXJFbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdDYWxlbmRhciwgY2FsZW5kYXJFbCk7XHJcblxyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gYW5ub3VuY2VZZWFycztcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgYnkgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVByZXZpb3VzWWVhckNodW5rID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGVsXHJcbiAgKTtcclxuICBjb25zdCB5ZWFyRWwgPSBjYWxlbmRhckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKTtcclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwudGV4dENvbnRlbnQsIDEwKTtcclxuXHJcbiAgbGV0IGFkanVzdGVkWWVhciA9IHNlbGVjdGVkWWVhciAtIFlFQVJfQ0hVTks7XHJcbiAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBjYXBwZWREYXRlLmdldEZ1bGxZZWFyKClcclxuICApO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTkspO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIGJ5IHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlOZXh0WWVhckNodW5rID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGVsXHJcbiAgKTtcclxuICBjb25zdCB5ZWFyRWwgPSBjYWxlbmRhckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKTtcclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwudGV4dENvbnRlbnQsIDEwKTtcclxuXHJcbiAgbGV0IGFkanVzdGVkWWVhciA9IHNlbGVjdGVkWWVhciArIFlFQVJfQ0hVTks7XHJcbiAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBjYXBwZWREYXRlLmdldEZ1bGxZZWFyKClcclxuICApO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCBhIHllYXIgaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0geWVhckVsIEEgeWVhciBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBzZWxlY3RZZWFyID0gKHllYXJFbCkgPT4ge1xyXG4gIGlmICh5ZWFyRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICB5ZWFyRWxcclxuICApO1xyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC5pbm5lckhUTUwsIDEwKTtcclxuICBsZXQgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZFllYXIpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBZZWFyIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogSGlkZSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVzY2FwZUZyb21DYWxlbmRhciA9IChldmVudCkgPT4ge1xyXG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBleHRlcm5hbElucHV0RWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGV2ZW50LnRhcmdldCk7XHJcblxyXG4gIGhpZGVDYWxlbmRhcihkYXRlUGlja2VyRWwpO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5mb2N1cygpO1xyXG5cclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBEYXRlIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSBkYXRlIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhciBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFkanVzdERhdGVGbiBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkanVzdENhbGVuZGFyID0gKGFkanVzdERhdGVGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgICAgZXZlbnQudGFyZ2V0XHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBhZGp1c3REYXRlRm4oY2FsZW5kYXJEYXRlKTtcclxuXHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVEYXkoY2FsZW5kYXJEYXRlLCBjYXBwZWREYXRlKSkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGNhcHBlZERhdGUpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJXZWVrcyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgd2VlayBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRXZWVrcyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgZGF5IGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTGVmdEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1YkRheXMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIGRheSBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkRGF5cyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN0YXJ0T2ZXZWVrKGRhdGUpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZW5kIG9mIHRoZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gZW5kT2ZXZWVrKGRhdGUpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkTW9udGhzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1Yk1vbnRocyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVNoaWZ0UGFnZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRZZWFycyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVNoaWZ0UGFnZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViWWVhcnMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIGRpc3BsYXkgdGhlIGNhbGVuZGFyIGZvciB0aGUgbW91c2Vtb3ZlIGRhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBkYXRlRWwgQSBkYXRlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZU1vdXNlbW92ZUZyb21EYXRlID0gKGRhdGVFbCkgPT4ge1xyXG4gIGlmIChkYXRlRWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgY2FsZW5kYXJFbCA9IGRhdGVFbC5jbG9zZXN0KERBVEVfUElDS0VSX0NBTEVOREFSKTtcclxuXHJcbiAgY29uc3QgY3VycmVudENhbGVuZGFyRGF0ZSA9IGNhbGVuZGFyRWwuZGF0YXNldC52YWx1ZTtcclxuICBjb25zdCBob3ZlckRhdGUgPSBkYXRlRWwuZGF0YXNldC52YWx1ZTtcclxuXHJcbiAgaWYgKGhvdmVyRGF0ZSA9PT0gY3VycmVudENhbGVuZGFyRGF0ZSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBkYXRlVG9EaXNwbGF5ID0gcGFyc2VEYXRlU3RyaW5nKGhvdmVyRGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgRGF0ZSBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBNb250aCBFdmVudCBIYW5kbGluZ1xyXG5cclxuLyoqXHJcbiAqIEFkanVzdCB0aGUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4gaWYgbmVlZGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3RNb250aEZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgbW9udGhcclxuICovXHJcbmNvbnN0IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuID0gKGFkanVzdE1vbnRoRm4pID0+IHtcclxuICByZXR1cm4gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBtb250aEVsID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICBtb250aEVsXHJcbiAgICApO1xyXG4gICAgY29uc3QgY3VycmVudERhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIHNlbGVjdGVkTW9udGgpO1xyXG5cclxuICAgIGxldCBhZGp1c3RlZE1vbnRoID0gYWRqdXN0TW9udGhGbihzZWxlY3RlZE1vbnRoKTtcclxuICAgIGFkanVzdGVkTW9udGggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMSwgYWRqdXN0ZWRNb250aCkpO1xyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIGFkanVzdGVkTW9udGgpO1xyXG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIGlmICghaXNTYW1lTW9udGgoY3VycmVudERhdGUsIGNhcHBlZERhdGUpKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKFxyXG4gICAgICAgIGNhbGVuZGFyRWwsXHJcbiAgICAgICAgY2FwcGVkRGF0ZS5nZXRNb250aCgpXHJcbiAgICAgICk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIHRocmVlIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoIC0gMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCB0aHJlZSBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoICsgMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUxlZnRGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoIC0gMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKG1vbnRoKSA9PiBtb250aCArIDEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgcm93IG9mIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKFxyXG4gIChtb250aCkgPT4gbW9udGggLSAobW9udGggJSAzKVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHJvdyBvZiBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVuZEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKFxyXG4gIChtb250aCkgPT4gbW9udGggKyAyIC0gKG1vbnRoICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgbGFzdCBtb250aCAoRGVjZW1iZXIpIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKCgpID0+IDExKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZmlyc3QgbW9udGggKEphbnVhcnkpIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlVXBGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigoKSA9PiAwKTtcclxuXHJcbi8qKlxyXG4gKiB1cGRhdGUgdGhlIGZvY3VzIG9uIGEgbW9udGggd2hlbiB0aGUgbW91c2UgbW92ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBtb250aEVsIEEgbW9udGggZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbU1vbnRoID0gKG1vbnRoRWwpID0+IHtcclxuICBpZiAobW9udGhFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGlmIChtb250aEVsLmNsYXNzTGlzdC5jb250YWlucyhDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTKSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBmb2N1c01vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKG1vbnRoRWwsIGZvY3VzTW9udGgpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgTW9udGggRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgWWVhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLyoqXHJcbiAqIEFkanVzdCB0aGUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuIGlmIG5lZWRlZC5cclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWRqdXN0WWVhckZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgeWVhclxyXG4gKi9cclxuY29uc3QgYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbiA9IChhZGp1c3RZZWFyRm4pID0+IHtcclxuICByZXR1cm4gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB5ZWFyRWwgPSBldmVudC50YXJnZXQ7XHJcbiAgICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICB5ZWFyRWxcclxuICAgICk7XHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZFllYXIpO1xyXG5cclxuICAgIGxldCBhZGp1c3RlZFllYXIgPSBhZGp1c3RZZWFyRm4oc2VsZWN0ZWRZZWFyKTtcclxuICAgIGFkanVzdGVkWWVhciA9IE1hdGgubWF4KDAsIGFkanVzdGVkWWVhcik7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIGlmICghaXNTYW1lWWVhcihjdXJyZW50RGF0ZSwgY2FwcGVkRGF0ZSkpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgICAgICBjYWxlbmRhckVsLFxyXG4gICAgICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxyXG4gICAgICApO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIHRocmVlIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVVwRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyIC0gMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCB0aHJlZSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVEb3duRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyICsgMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVMZWZ0RnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyIC0gMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVSaWdodEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbigoeWVhcikgPT4geWVhciArIDEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgcm93IG9mIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUhvbWVGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKHllYXIpID0+IHllYXIgLSAoeWVhciAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIGVuZCBvZiB0aGUgcm93IG9mIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVuZEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciArIDIgLSAoeWVhciAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gYmFjayAxMiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlVXBGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKHllYXIpID0+IHllYXIgLSBZRUFSX0NIVU5LXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCAxMiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciArIFlFQVJfQ0hVTktcclxuKTtcclxuXHJcbi8qKlxyXG4gKiB1cGRhdGUgdGhlIGZvY3VzIG9uIGEgeWVhciB3aGVuIHRoZSBtb3VzZSBtb3Zlcy5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGRhdGVFbCBBIHllYXIgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbVllYXIgPSAoeWVhckVsKSA9PiB7XHJcbiAgaWYgKHllYXJFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGlmICh5ZWFyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUykpIHJldHVybjtcclxuXHJcbiAgY29uc3QgZm9jdXNZZWFyID0gcGFyc2VJbnQoeWVhckVsLmRhdGFzZXQudmFsdWUsIDEwKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbih5ZWFyRWwsIGZvY3VzWWVhcik7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIFllYXIgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gRm9jdXMgSGFuZGxpbmcgRXZlbnQgSGFuZGxpbmdcclxuXHJcbmNvbnN0IHRhYkhhbmRsZXIgPSAoZm9jdXNhYmxlKSA9PiB7XHJcbiAgY29uc3QgZ2V0Rm9jdXNhYmxlQ29udGV4dCA9IChlbCkgPT4ge1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IHNlbGVjdChmb2N1c2FibGUsIGNhbGVuZGFyRWwpO1xyXG5cclxuICAgIGNvbnN0IGZpcnN0VGFiSW5kZXggPSAwO1xyXG4gICAgY29uc3QgbGFzdFRhYkluZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMTtcclxuICAgIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2ZpcnN0VGFiSW5kZXhdO1xyXG4gICAgY29uc3QgbGFzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1tsYXN0VGFiSW5kZXhdO1xyXG4gICAgY29uc3QgZm9jdXNJbmRleCA9IGZvY3VzYWJsZUVsZW1lbnRzLmluZGV4T2YoYWN0aXZlRWxlbWVudCgpKTtcclxuXHJcbiAgICBjb25zdCBpc0xhc3RUYWIgPSBmb2N1c0luZGV4ID09PSBsYXN0VGFiSW5kZXg7XHJcbiAgICBjb25zdCBpc0ZpcnN0VGFiID0gZm9jdXNJbmRleCA9PT0gZmlyc3RUYWJJbmRleDtcclxuICAgIGNvbnN0IGlzTm90Rm91bmQgPSBmb2N1c0luZGV4ID09PSAtMTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBmb2N1c2FibGVFbGVtZW50cyxcclxuICAgICAgaXNOb3RGb3VuZCxcclxuICAgICAgZmlyc3RUYWJTdG9wLFxyXG4gICAgICBpc0ZpcnN0VGFiLFxyXG4gICAgICBsYXN0VGFiU3RvcCxcclxuICAgICAgaXNMYXN0VGFiLFxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdGFiQWhlYWQoZXZlbnQpIHtcclxuICAgICAgY29uc3QgeyBmaXJzdFRhYlN0b3AsIGlzTGFzdFRhYiwgaXNOb3RGb3VuZCB9ID0gZ2V0Rm9jdXNhYmxlQ29udGV4dChcclxuICAgICAgICBldmVudC50YXJnZXRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChpc0xhc3RUYWIgfHwgaXNOb3RGb3VuZCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0YWJCYWNrKGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IHsgbGFzdFRhYlN0b3AsIGlzRmlyc3RUYWIsIGlzTm90Rm91bmQgfSA9IGdldEZvY3VzYWJsZUNvbnRleHQoXHJcbiAgICAgICAgZXZlbnQudGFyZ2V0XHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAoaXNGaXJzdFRhYiB8fCBpc05vdEZvdW5kKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyID0gdGFiSGFuZGxlcihEQVRFX1BJQ0tFUl9GT0NVU0FCTEUpO1xyXG5jb25zdCBtb250aFBpY2tlclRhYkV2ZW50SGFuZGxlciA9IHRhYkhhbmRsZXIoTU9OVEhfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcbmNvbnN0IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKFlFQVJfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcblxyXG4vLyAjZW5kcmVnaW9uIEZvY3VzIEhhbmRsaW5nIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIERhdGUgUGlja2VyIEV2ZW50IERlbGVnYXRpb24gUmVnaXN0cmF0aW9uIC8gQ29tcG9uZW50XHJcblxyXG5jb25zdCBkYXRlUGlja2VyRXZlbnRzID0ge1xyXG4gIFtDTElDS106IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9CVVRUT05dKCkge1xyXG4gICAgICB0b2dnbGVDYWxlbmRhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfREFURV0oKSB7XHJcbiAgICAgIHNlbGVjdERhdGUodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIXSgpIHtcclxuICAgICAgc2VsZWN0TW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJdKCkge1xyXG4gICAgICBzZWxlY3RZZWFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19NT05USF0oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c01vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ORVhUX01PTlRIXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRNb250aCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl0oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c1llYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX05FWFRfWUVBUl0oKSB7XHJcbiAgICAgIGRpc3BsYXlOZXh0WWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS10oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c1llYXJDaHVuayh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRZZWFyQ2h1bmsodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl0oKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKHRoaXMpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX01PTlRIX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OXSgpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbih0aGlzKTtcclxuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAga2V5dXA6IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9DQUxFTkRBUl0oZXZlbnQpIHtcclxuICAgICAgY29uc3Qga2V5ZG93biA9IHRoaXMuZGF0YXNldC5rZXlkb3duS2V5Q29kZTtcclxuICAgICAgaWYgKGAke2V2ZW50LmtleUNvZGV9YCAhPT0ga2V5ZG93bikge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBrZXlkb3duOiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBFTlRFUl9LRVlDT0RFKSB7XHJcbiAgICAgICAgdmFsaWRhdGVEYXRlSW5wdXQodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfREFURV06IGtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21EYXRlLFxyXG4gICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21EYXRlLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbURhdGUsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21EYXRlLFxyXG4gICAgICBMZWZ0OiBoYW5kbGVMZWZ0RnJvbURhdGUsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21EYXRlLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tRGF0ZSxcclxuICAgICAgQXJyb3dSaWdodDogaGFuZGxlUmlnaHRGcm9tRGF0ZSxcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21EYXRlLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21EYXRlLFxyXG4gICAgICBQYWdlRG93bjogaGFuZGxlUGFnZURvd25Gcm9tRGF0ZSxcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tRGF0ZSxcclxuICAgICAgXCJTaGlmdCtQYWdlRG93blwiOiBoYW5kbGVTaGlmdFBhZ2VEb3duRnJvbURhdGUsXHJcbiAgICAgIFwiU2hpZnQrUGFnZVVwXCI6IGhhbmRsZVNoaWZ0UGFnZVVwRnJvbURhdGUsXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9EQVRFX1BJQ0tFUl06IGtleW1hcCh7XHJcbiAgICAgIFRhYjogZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJBaGVhZCxcclxuICAgICAgXCJTaGlmdCtUYWJcIjogZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdOiBrZXltYXAoe1xyXG4gICAgICBVcDogaGFuZGxlVXBGcm9tTW9udGgsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbU1vbnRoLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbU1vbnRoLFxyXG4gICAgICBBcnJvd0Rvd246IGhhbmRsZURvd25Gcm9tTW9udGgsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tTW9udGgsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21Nb250aCxcclxuICAgICAgUmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbU1vbnRoLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21Nb250aCxcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21Nb250aCxcclxuICAgICAgRW5kOiBoYW5kbGVFbmRGcm9tTW9udGgsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21Nb250aCxcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tTW9udGgsXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9NT05USF9QSUNLRVJdOiBrZXltYXAoe1xyXG4gICAgICBUYWI6IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiBtb250aFBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl06IGtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21ZZWFyLFxyXG4gICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21ZZWFyLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbVllYXIsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21ZZWFyLFxyXG4gICAgICBMZWZ0OiBoYW5kbGVMZWZ0RnJvbVllYXIsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21ZZWFyLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tWWVhcixcclxuICAgICAgQXJyb3dSaWdodDogaGFuZGxlUmlnaHRGcm9tWWVhcixcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21ZZWFyLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21ZZWFyLFxyXG4gICAgICBQYWdlRG93bjogaGFuZGxlUGFnZURvd25Gcm9tWWVhcixcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tWWVhcixcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX1lFQVJfUElDS0VSXToga2V5bWFwKHtcclxuICAgICAgVGFiOiB5ZWFyUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiB5ZWFyUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtEQVRFX1BJQ0tFUl9DQUxFTkRBUl0oZXZlbnQpIHtcclxuICAgICAgdGhpcy5kYXRhc2V0LmtleWRvd25LZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcclxuICAgIH0sXHJcbiAgICBbREFURV9QSUNLRVJdKGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IGtleU1hcCA9IGtleW1hcCh7XHJcbiAgICAgICAgRXNjYXBlOiBoYW5kbGVFc2NhcGVGcm9tQ2FsZW5kYXIsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAga2V5TWFwKGV2ZW50KTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBmb2N1c291dDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXSgpIHtcclxuICAgICAgdmFsaWRhdGVEYXRlSW5wdXQodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0RBVEVfUElDS0VSXShldmVudCkge1xyXG4gICAgICBpZiAoIXRoaXMuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpIHtcclxuICAgICAgICBoaWRlQ2FsZW5kYXIodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBpbnB1dDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXSgpIHtcclxuICAgICAgcmVjb25jaWxlSW5wdXRWYWx1ZXModGhpcyk7XHJcbiAgICAgIHVwZGF0ZUNhbGVuZGFySWZWaXNpYmxlKHRoaXMpO1xyXG4gICAgfSxcclxuICB9LFxyXG59O1xyXG5cclxuaWYgKCFpc0lvc0RldmljZSgpKSB7XHJcbiAgZGF0ZVBpY2tlckV2ZW50cy5tb3VzZW1vdmUgPSB7XHJcbiAgICBbQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbURhdGUodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbU1vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ZRUFSXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbVllYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmNvbnN0IGRhdGVQaWNrZXIgPSBiZWhhdmlvcihkYXRlUGlja2VyRXZlbnRzLCB7XHJcbiAgaW5pdChyb290KSB7XHJcbiAgICBzZWxlY3QoREFURV9QSUNLRVIsIHJvb3QpLmZvckVhY2goKGRhdGVQaWNrZXJFbCkgPT4ge1xyXG4gICAgICBpZighZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5jb250YWlucyhEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUykpe1xyXG4gICAgICAgIGVuaGFuY2VEYXRlUGlja2VyKGRhdGVQaWNrZXJFbCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgc2V0TGFuZ3VhZ2Uoc3RyaW5ncykge1xyXG4gICAgdGV4dCA9IHN0cmluZ3M7XHJcbiAgICBNT05USF9MQUJFTFMgPSBbXHJcbiAgICAgIHRleHQuamFudWFyeSxcclxuICAgICAgdGV4dC5mZWJydWFyeSxcclxuICAgICAgdGV4dC5tYXJjaCxcclxuICAgICAgdGV4dC5hcHJpbCxcclxuICAgICAgdGV4dC5tYXksXHJcbiAgICAgIHRleHQuanVuZSxcclxuICAgICAgdGV4dC5qdWx5LFxyXG4gICAgICB0ZXh0LmF1Z3VzdCxcclxuICAgICAgdGV4dC5zZXB0ZW1iZXIsXHJcbiAgICAgIHRleHQub2N0b2JlcixcclxuICAgICAgdGV4dC5ub3ZlbWJlcixcclxuICAgICAgdGV4dC5kZWNlbWJlclxyXG4gICAgXTtcclxuICAgIERBWV9PRl9XRUVLX0xBQkVMUyA9IFtcclxuICAgICAgdGV4dC5tb25kYXksXHJcbiAgICAgIHRleHQudHVlc2RheSxcclxuICAgICAgdGV4dC53ZWRuZXNkYXksXHJcbiAgICAgIHRleHQudGh1cnNkYXksXHJcbiAgICAgIHRleHQuZnJpZGF5LFxyXG4gICAgICB0ZXh0LnNhdHVyZGF5LFxyXG4gICAgICB0ZXh0LnN1bmRheVxyXG4gICAgXTtcclxuICB9LFxyXG4gIGdldERhdGVQaWNrZXJDb250ZXh0LFxyXG4gIGRpc2FibGUsXHJcbiAgZW5hYmxlLFxyXG4gIGlzRGF0ZUlucHV0SW52YWxpZCxcclxuICBzZXRDYWxlbmRhclZhbHVlLFxyXG4gIHZhbGlkYXRlRGF0ZUlucHV0LFxyXG4gIHJlbmRlckNhbGVuZGFyLFxyXG4gIHVwZGF0ZUNhbGVuZGFySWZWaXNpYmxlLFxyXG59KTtcclxuXHJcbi8vICNlbmRyZWdpb24gRGF0ZSBQaWNrZXIgRXZlbnQgRGVsZWdhdGlvbiBSZWdpc3RyYXRpb24gLyBDb21wb25lbnRcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZGF0ZVBpY2tlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9kcm9wZG93bic7XHJcbmltcG9ydCAnLi4vcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kJztcclxuXHJcbi8qKlxyXG4gKiBBZGQgZnVuY3Rpb25hbGl0eSB0byBzb3J0aW5nIHZhcmlhbnQgb2YgT3ZlcmZsb3cgbWVudSBjb21wb25lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC5vdmVyZmxvdy1tZW51IGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIERyb3Bkb3duU29ydCAoY29udGFpbmVyKXtcclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgdGhpcy5idXR0b24gPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXTtcclxuXHJcbiAgICAvLyBpZiBubyB2YWx1ZSBpcyBzZWxlY3RlZCwgY2hvb3NlIGZpcnN0IG9wdGlvblxyXG4gICAgaWYoIXRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5vdmVyZmxvdy1saXN0IGxpW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJykpe1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5vdmVyZmxvdy1saXN0IGxpJylbMF0uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgXCJ0cnVlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRWYWx1ZSgpO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkIGNsaWNrIGV2ZW50cyBvbiBvdmVyZmxvdyBtZW51IGFuZCBvcHRpb25zIGluIG1lbnVcclxuICovXHJcbkRyb3Bkb3duU29ydC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLm92ZXJmbG93TWVudSA9IG5ldyBEcm9wZG93bih0aGlzLmJ1dHRvbikuaW5pdCgpO1xyXG5cclxuICAgIGxldCBzb3J0aW5nT3B0aW9ucyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5vdmVyZmxvdy1saXN0IGxpIGJ1dHRvbicpO1xyXG4gICAgZm9yKGxldCBzID0gMDsgcyA8IHNvcnRpbmdPcHRpb25zLmxlbmd0aDsgcysrKXtcclxuICAgICAgICBsZXQgb3B0aW9uID0gc29ydGluZ09wdGlvbnNbc107XHJcbiAgICAgICAgb3B0aW9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbk9wdGlvbkNsaWNrLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlIGJ1dHRvbiB0ZXh0IHRvIHNlbGVjdGVkIHZhbHVlXHJcbiAqL1xyXG5Ecm9wZG93blNvcnQucHJvdG90eXBlLnVwZGF0ZVNlbGVjdGVkVmFsdWUgPSBmdW5jdGlvbigpe1xyXG4gICAgbGV0IHNlbGVjdGVkSXRlbSA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5vdmVyZmxvdy1saXN0IGxpW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24tb3ZlcmZsb3ctbWVudScpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlbGVjdGVkLXZhbHVlJylbMF0uaW5uZXJUZXh0ID0gc2VsZWN0ZWRJdGVtLmlubmVyVGV4dDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRyaWdnZXJzIHdoZW4gY2hvb3Npbmcgb3B0aW9uIGluIG1lbnVcclxuICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGVcclxuICovXHJcbkRyb3Bkb3duU29ydC5wcm90b3R5cGUub25PcHRpb25DbGljayA9IGZ1bmN0aW9uKGUpe1xyXG4gICAgbGV0IGxpID0gZS50YXJnZXQucGFyZW50Tm9kZTtcclxuICAgIGxpLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignbGlbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKTtcclxuICAgIGxpLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICd0cnVlJyk7XHJcblxyXG4gICAgbGV0IGJ1dHRvbiA9IGxpLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbi1vdmVyZmxvdy1tZW51JylbMF07XHJcbiAgICBsZXQgZXZlbnRTZWxlY3RlZCA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLnNlbGVjdGVkJyk7XHJcbiAgICBldmVudFNlbGVjdGVkLmRldGFpbCA9IHRoaXMudGFyZ2V0O1xyXG4gICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRTZWxlY3RlZCk7XHJcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkVmFsdWUoKTtcclxuXHJcbiAgICAvLyBoaWRlIG1lbnVcclxuICAgIGxldCBvdmVyZmxvd01lbnUgPSBuZXcgRHJvcGRvd24oYnV0dG9uKTtcclxuICAgIG92ZXJmbG93TWVudS5oaWRlKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERyb3Bkb3duU29ydDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBicmVha3BvaW50cyA9IHJlcXVpcmUoJy4uL3V0aWxzL2JyZWFrcG9pbnRzJyk7XHJcbmNvbnN0IEJVVFRPTiA9ICcuYnV0dG9uLW92ZXJmbG93LW1lbnUnO1xyXG5jb25zdCBqc0Ryb3Bkb3duQ29sbGFwc2VNb2RpZmllciA9ICdqcy1kcm9wZG93bi0tcmVzcG9uc2l2ZS1jb2xsYXBzZSc7IC8vb3B0aW9uOiBtYWtlIGRyb3Bkb3duIGJlaGF2ZSBhcyB0aGUgY29sbGFwc2UgY29tcG9uZW50IHdoZW4gb24gc21hbGwgc2NyZWVucyAodXNlZCBieSBzdWJtZW51cyBpbiB0aGUgaGVhZGVyIGFuZCBzdGVwLWRyb3Bkb3duKS5cclxuY29uc3QgVEFSR0VUID0gJ2RhdGEtanMtdGFyZ2V0JztcclxuXHJcbi8qKlxyXG4gKiBBZGQgZnVuY3Rpb25hbGl0eSB0byBvdmVyZmxvdyBtZW51IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25FbGVtZW50IE92ZXJmbG93IG1lbnUgYnV0dG9uXHJcbiAqL1xyXG5mdW5jdGlvbiBEcm9wZG93biAoYnV0dG9uRWxlbWVudCkge1xyXG4gIHRoaXMuYnV0dG9uRWxlbWVudCA9IGJ1dHRvbkVsZW1lbnQ7XHJcbiAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcbiAgdGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuICBpZih0aGlzLmJ1dHRvbkVsZW1lbnQgPT09IG51bGwgfHx0aGlzLmJ1dHRvbkVsZW1lbnQgPT09IHVuZGVmaW5lZCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGJ1dHRvbiBmb3Igb3ZlcmZsb3cgbWVudSBjb21wb25lbnQuYCk7XHJcbiAgfVxyXG4gIGxldCB0YXJnZXRBdHRyID0gdGhpcy5idXR0b25FbGVtZW50LmdldEF0dHJpYnV0ZShUQVJHRVQpO1xyXG4gIGlmKHRhcmdldEF0dHIgPT09IG51bGwgfHwgdGFyZ2V0QXR0ciA9PT0gdW5kZWZpbmVkKXtcclxuICAgIHRocm93IG5ldyBFcnJvcignQXR0cmlidXRlIGNvdWxkIG5vdCBiZSBmb3VuZCBvbiBvdmVyZmxvdyBtZW51IGNvbXBvbmVudDogJytUQVJHRVQpO1xyXG4gIH1cclxuICBsZXQgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJykpO1xyXG4gIGlmKHRhcmdldEVsID09PSBudWxsIHx8IHRhcmdldEVsID09PSB1bmRlZmluZWQpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdQYW5lbCBmb3Igb3ZlcmZsb3cgbWVudSBjb21wb25lbnQgY291bGQgbm90IGJlIGZvdW5kLicpO1xyXG4gIH1cclxuICB0aGlzLnRhcmdldEVsID0gdGFyZ2V0RWw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgY2xpY2sgZXZlbnRzXHJcbiAqL1xyXG5Ecm9wZG93bi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpe1xyXG4gIGlmKHRoaXMuYnV0dG9uRWxlbWVudCAhPT0gbnVsbCAmJiB0aGlzLmJ1dHRvbkVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnRhcmdldEVsICE9PSBudWxsICYmIHRoaXMudGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcblxyXG4gICAgaWYodGhpcy5idXR0b25FbGVtZW50LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykgfHwgdGhpcy5idXR0b25FbGVtZW50LnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1sZy1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvL0NsaWNrZWQgb3V0c2lkZSBkcm9wZG93biAtPiBjbG9zZSBpdFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3V0c2lkZUNsb3NlKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG91dHNpZGVDbG9zZSk7XHJcbiAgICAvL0NsaWNrZWQgb24gZHJvcGRvd24gb3BlbiBidXR0b24gLS0+IHRvZ2dsZSBpdFxyXG4gICAgdGhpcy5idXR0b25FbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlRHJvcGRvd24pO1xyXG4gICAgdGhpcy5idXR0b25FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlRHJvcGRvd24pO1xyXG4gICAgbGV0ICRtb2R1bGUgPSB0aGlzO1xyXG4gICAgLy8gc2V0IGFyaWEtaGlkZGVuIGNvcnJlY3RseSBmb3Igc2NyZWVucmVhZGVycyAoVHJpbmd1aWRlIHJlc3BvbnNpdmUpXHJcbiAgICBpZih0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkKSB7XHJcbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5idXR0b25FbGVtZW50O1xyXG4gICAgICBpZiAod2luZG93LkludGVyc2VjdGlvbk9ic2VydmVyKSB7XHJcbiAgICAgICAgLy8gdHJpZ2dlciBldmVudCB3aGVuIGJ1dHRvbiBjaGFuZ2VzIHZpc2liaWxpdHlcclxuICAgICAgICBsZXQgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKGVudHJpZXMpIHtcclxuICAgICAgICAgIC8vIGJ1dHRvbiBpcyB2aXNpYmxlXHJcbiAgICAgICAgICBpZiAoZW50cmllc1sgMCBdLmludGVyc2VjdGlvblJhdGlvKSB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gYnV0dG9uIGlzIG5vdCB2aXNpYmxlXHJcbiAgICAgICAgICAgIGlmICgkbW9kdWxlLnRhcmdldEVsLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICByb290OiBkb2N1bWVudC5ib2R5XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBJRTogSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgaXMgbm90IHN1cHBvcnRlZCwgc28gd2UgbGlzdGVuIGZvciB3aW5kb3cgcmVzaXplIGFuZCBncmlkIGJyZWFrcG9pbnQgaW5zdGVhZFxyXG4gICAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSgkbW9kdWxlLnRyaWdnZXJFbCkpIHtcclxuICAgICAgICAgIC8vIHNtYWxsIHNjcmVlblxyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIExhcmdlIHNjcmVlblxyXG4gICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBpZiAoZG9SZXNwb25zaXZlQ29sbGFwc2UoJG1vZHVsZS50cmlnZ2VyRWwpKSB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBjbG9zZU9uRXNjYXBlKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgY2xvc2VPbkVzY2FwZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogSGlkZSBvdmVyZmxvdyBtZW51XHJcbiAqL1xyXG5Ecm9wZG93bi5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdG9nZ2xlKHRoaXMuYnV0dG9uRWxlbWVudCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG93IG92ZXJmbG93IG1lbnVcclxuICovXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKXtcclxuICB0b2dnbGUodGhpcy5idXR0b25FbGVtZW50KTtcclxufVxyXG5cclxubGV0IGNsb3NlT25Fc2NhcGUgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgdmFyIGtleSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XHJcbiAgaWYgKGtleSA9PT0gMjcpIHtcclxuICAgIGNsb3NlQWxsKGV2ZW50KTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0IGFuIEFycmF5IG9mIGJ1dHRvbiBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXHJcbiAqIGFjY29yZGlvbiBlbGVtZW50LlxyXG4gKiBAcGFyYW0gcGFyZW50IGFjY29yZGlvbiBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtOb2RlTGlzdE9mPFNWR0VsZW1lbnRUYWdOYW1lTWFwW1tzdHJpbmddXT4gfCBOb2RlTGlzdE9mPEhUTUxFbGVtZW50VGFnTmFtZU1hcFtbc3RyaW5nXV0+IHwgTm9kZUxpc3RPZjxFbGVtZW50Pn1cclxuICovXHJcbmxldCBnZXRCdXR0b25zID0gZnVuY3Rpb24gKHBhcmVudCkge1xyXG4gIHJldHVybiBwYXJlbnQucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsb3NlIGFsbCBvdmVyZmxvdyBtZW51c1xyXG4gKiBAcGFyYW0ge2V2ZW50fSBldmVudCBkZWZhdWx0IGlzIG51bGxcclxuICovXHJcbmxldCBjbG9zZUFsbCA9IGZ1bmN0aW9uIChldmVudCA9IG51bGwpe1xyXG4gIGxldCBjaGFuZ2VkID0gZmFsc2U7XHJcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuXHJcbiAgbGV0IG92ZXJmbG93TWVudUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3ZlcmZsb3ctbWVudScpO1xyXG4gIGZvciAobGV0IG9pID0gMDsgb2kgPCBvdmVyZmxvd01lbnVFbC5sZW5ndGg7IG9pKyspIHtcclxuICAgIGxldCBjdXJyZW50T3ZlcmZsb3dNZW51RUwgPSBvdmVyZmxvd01lbnVFbFsgb2kgXTtcclxuICAgIGxldCB0cmlnZ2VyRWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwucXVlcnlTZWxlY3RvcihCVVRUT04rJ1thcmlhLWV4cGFuZGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgaWYodHJpZ2dlckVsICE9PSBudWxsKXtcclxuICAgICAgY2hhbmdlZCA9IHRydWU7XHJcbiAgICAgIGxldCB0YXJnZXRFbCA9IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5xdWVyeVNlbGVjdG9yKCcjJyt0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCkucmVwbGFjZSgnIycsICcnKSk7XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXRFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IG51bGwpIHtcclxuICAgICAgICAgIGlmKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRyaWdnZXJFbCkpe1xyXG4gICAgICAgICAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcclxuICAgICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZihjaGFuZ2VkICYmIGV2ZW50ICE9PSBudWxsKXtcclxuICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gIH1cclxufTtcclxubGV0IG9mZnNldCA9IGZ1bmN0aW9uIChlbCkge1xyXG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcbiAgICBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LFxyXG4gICAgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgcmV0dXJuIHsgdG9wOiByZWN0LnRvcCArIHNjcm9sbFRvcCwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCB9O1xyXG59O1xyXG5cclxubGV0IHRvZ2dsZURyb3Bkb3duID0gZnVuY3Rpb24gKGV2ZW50LCBmb3JjZUNsb3NlID0gZmFsc2UpIHtcclxuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICB0b2dnbGUodGhpcywgZm9yY2VDbG9zZSk7XHJcblxyXG59O1xyXG5cclxubGV0IHRvZ2dsZSA9IGZ1bmN0aW9uKGJ1dHRvbiwgZm9yY2VDbG9zZSA9IGZhbHNlKXtcclxuICBsZXQgdHJpZ2dlckVsID0gYnV0dG9uO1xyXG4gIGxldCB0YXJnZXRFbCA9IG51bGw7XHJcbiAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgIGxldCB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZShUQVJHRVQpO1xyXG4gICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgIC8vY2hhbmdlIHN0YXRlXHJcblxyXG4gICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9IG51bGw7XHJcbiAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9IG51bGw7XHJcblxyXG4gICAgaWYodHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgfHwgZm9yY2VDbG9zZSl7XHJcbiAgICAgIC8vY2xvc2VcclxuICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7ICAgICAgXHJcbiAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcclxuICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgXHJcbiAgICAgIGlmKCFkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5jb250YWlucygnbW9iaWxlX25hdi1hY3RpdmUnKSl7XHJcbiAgICAgICAgY2xvc2VBbGwoKTtcclxuICAgICAgfVxyXG4gICAgICAvL29wZW5cclxuICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcbiAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5vcGVuJyk7XHJcbiAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgICAgIGxldCB0YXJnZXRPZmZzZXQgPSBvZmZzZXQodGFyZ2V0RWwpO1xyXG5cclxuICAgICAgaWYodGFyZ2V0T2Zmc2V0LmxlZnQgPCAwKXtcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHJpZ2h0ID0gdGFyZ2V0T2Zmc2V0LmxlZnQgKyB0YXJnZXRFbC5vZmZzZXRXaWR0aDtcclxuICAgICAgaWYocmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCl7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICdhdXRvJztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICcwcHgnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgb2Zmc2V0QWdhaW4gPSBvZmZzZXQodGFyZ2V0RWwpO1xyXG5cclxuICAgICAgaWYob2Zmc2V0QWdhaW4ubGVmdCA8IDApe1xyXG5cclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJzBweCc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnYXV0byc7XHJcbiAgICAgIH1cclxuICAgICAgcmlnaHQgPSBvZmZzZXRBZ2Fpbi5sZWZ0ICsgdGFyZ2V0RWwub2Zmc2V0V2lkdGg7XHJcbiAgICAgIGlmKHJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpe1xyXG5cclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgfVxyXG59XHJcblxyXG5sZXQgaGFzUGFyZW50ID0gZnVuY3Rpb24gKGNoaWxkLCBwYXJlbnRUYWdOYW1lKXtcclxuICBpZihjaGlsZC5wYXJlbnROb2RlLnRhZ05hbWUgPT09IHBhcmVudFRhZ05hbWUpe1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBlbHNlIGlmKHBhcmVudFRhZ05hbWUgIT09ICdCT0RZJyAmJiBjaGlsZC5wYXJlbnROb2RlLnRhZ05hbWUgIT09ICdCT0RZJyl7XHJcbiAgICByZXR1cm4gaGFzUGFyZW50KGNoaWxkLnBhcmVudE5vZGUsIHBhcmVudFRhZ05hbWUpO1xyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbmxldCBvdXRzaWRlQ2xvc2UgPSBmdW5jdGlvbiAoZXZ0KXtcclxuICBpZighZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QuY29udGFpbnMoJ21vYmlsZV9uYXYtYWN0aXZlJykpe1xyXG4gICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keS5tb2JpbGVfbmF2LWFjdGl2ZScpID09PSBudWxsICYmICFldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYnV0dG9uLW1lbnUtY2xvc2UnKSkge1xyXG4gICAgICBsZXQgb3BlbkRyb3Bkb3ducyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKydbYXJpYS1leHBhbmRlZD10cnVlXScpO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wZW5Ecm9wZG93bnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgdHJpZ2dlckVsID0gb3BlbkRyb3Bkb3duc1tpXTtcclxuICAgICAgICBsZXQgdGFyZ2V0RWwgPSBudWxsO1xyXG4gICAgICAgIGxldCB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZShUQVJHRVQpO1xyXG4gICAgICAgIGlmICh0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgaWYodGFyZ2V0QXR0ci5pbmRleE9mKCcjJykgIT09IC0xKXtcclxuICAgICAgICAgICAgdGFyZ2V0QXR0ciA9IHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0cik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSh0cmlnZ2VyRWwpIHx8IChoYXNQYXJlbnQodHJpZ2dlckVsLCAnSEVBREVSJykgJiYgIWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVybGF5JykpKSB7XHJcbiAgICAgICAgICAvL2Nsb3NlcyBkcm9wZG93biB3aGVuIGNsaWNrZWQgb3V0c2lkZVxyXG4gICAgICAgICAgaWYgKGV2dC50YXJnZXQgIT09IHRyaWdnZXJFbCkge1xyXG4gICAgICAgICAgICAvL2NsaWNrZWQgb3V0c2lkZSB0cmlnZ2VyLCBmb3JjZSBjbG9zZVxyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcclxuICAgICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxubGV0IGRvUmVzcG9uc2l2ZUNvbGxhcHNlID0gZnVuY3Rpb24gKHRyaWdnZXJFbCl7XHJcbiAgaWYoIXRyaWdnZXJFbC5jbGFzc0xpc3QuY29udGFpbnMoanNEcm9wZG93bkNvbGxhcHNlTW9kaWZpZXIpKXtcclxuICAgIC8vIG5vdCBuYXYgb3ZlcmZsb3cgbWVudVxyXG4gICAgaWYodHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykgfHwgdHJpZ2dlckVsLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1sZy1uby1yZXNwb25zaXZlJykpIHtcclxuICAgICAgLy8gdHJpbmluZGlrYXRvciBvdmVyZmxvdyBtZW51XHJcbiAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSBnZXRUcmluZ3VpZGVCcmVha3BvaW50KHRyaWdnZXJFbCkpIHtcclxuICAgICAgICAvLyBvdmVyZmxvdyBtZW51IHDDpSByZXNwb25zaXYgdHJpbmd1aWRlIGFrdGl2ZXJldFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2V7XHJcbiAgICAgIC8vIG5vcm1hbCBvdmVyZmxvdyBtZW51XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxubGV0IGdldFRyaW5ndWlkZUJyZWFrcG9pbnQgPSBmdW5jdGlvbiAoYnV0dG9uKXtcclxuICBpZihidXR0b24ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSl7XHJcbiAgICByZXR1cm4gYnJlYWtwb2ludHMubWQ7XHJcbiAgfVxyXG4gIGlmKGJ1dHRvbi5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKXtcclxuICAgIHJldHVybiBicmVha3BvaW50cy5sZztcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEcm9wZG93bjsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBIYW5kbGUgZm9jdXMgb24gaW5wdXQgZWxlbWVudHMgdXBvbiBjbGlja2luZyBsaW5rIGluIGVycm9yIG1lc3NhZ2VcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBFcnJvciBzdW1tYXJ5IGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIEVycm9yU3VtbWFyeSAoZWxlbWVudCkge1xyXG4gIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzIG9uIGxpbmtzIGluIGVycm9yIHN1bW1hcnlcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIHRoaXMuZWxlbWVudC5mb2N1cygpXHJcblxyXG4gIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKSlcclxufVxyXG5cclxuLyoqXHJcbiogQ2xpY2sgZXZlbnQgaGFuZGxlclxyXG4qXHJcbiogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCAtIENsaWNrIGV2ZW50XHJcbiovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuaGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0XHJcbiAgaWYgKHRoaXMuZm9jdXNUYXJnZXQodGFyZ2V0KSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEZvY3VzIHRoZSB0YXJnZXQgZWxlbWVudFxyXG4gKlxyXG4gKiBCeSBkZWZhdWx0LCB0aGUgYnJvd3NlciB3aWxsIHNjcm9sbCB0aGUgdGFyZ2V0IGludG8gdmlldy4gQmVjYXVzZSBvdXIgbGFiZWxzXHJcbiAqIG9yIGxlZ2VuZHMgYXBwZWFyIGFib3ZlIHRoZSBpbnB1dCwgdGhpcyBtZWFucyB0aGUgdXNlciB3aWxsIGJlIHByZXNlbnRlZCB3aXRoXHJcbiAqIGFuIGlucHV0IHdpdGhvdXQgYW55IGNvbnRleHQsIGFzIHRoZSBsYWJlbCBvciBsZWdlbmQgd2lsbCBiZSBvZmYgdGhlIHRvcCBvZlxyXG4gKiB0aGUgc2NyZWVuLlxyXG4gKlxyXG4gKiBNYW51YWxseSBoYW5kbGluZyB0aGUgY2xpY2sgZXZlbnQsIHNjcm9sbGluZyB0aGUgcXVlc3Rpb24gaW50byB2aWV3IGFuZCB0aGVuXHJcbiAqIGZvY3Vzc2luZyB0aGUgZWxlbWVudCBzb2x2ZXMgdGhpcy5cclxuICpcclxuICogVGhpcyBhbHNvIHJlc3VsdHMgaW4gdGhlIGxhYmVsIGFuZC9vciBsZWdlbmQgYmVpbmcgYW5ub3VuY2VkIGNvcnJlY3RseSBpblxyXG4gKiBOVkRBIChhcyB0ZXN0ZWQgaW4gMjAxOC4zLjIpIC0gd2l0aG91dCB0aGlzIG9ubHkgdGhlIGZpZWxkIHR5cGUgaXMgYW5ub3VuY2VkXHJcbiAqIChlLmcuIFwiRWRpdCwgaGFzIGF1dG9jb21wbGV0ZVwiKS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJHRhcmdldCAtIEV2ZW50IHRhcmdldFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdGFyZ2V0IHdhcyBhYmxlIHRvIGJlIGZvY3Vzc2VkXHJcbiAqL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmZvY3VzVGFyZ2V0ID0gZnVuY3Rpb24gKCR0YXJnZXQpIHtcclxuICAvLyBJZiB0aGUgZWxlbWVudCB0aGF0IHdhcyBjbGlja2VkIHdhcyBub3QgYSBsaW5rLCByZXR1cm4gZWFybHlcclxuICBpZiAoJHRhcmdldC50YWdOYW1lICE9PSAnQScgfHwgJHRhcmdldC5ocmVmID09PSBmYWxzZSkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICB2YXIgaW5wdXRJZCA9IHRoaXMuZ2V0RnJhZ21lbnRGcm9tVXJsKCR0YXJnZXQuaHJlZilcclxuICB2YXIgJGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZClcclxuICBpZiAoISRpbnB1dCkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICB2YXIgJGxlZ2VuZE9yTGFiZWwgPSB0aGlzLmdldEFzc29jaWF0ZWRMZWdlbmRPckxhYmVsKCRpbnB1dClcclxuICBpZiAoISRsZWdlbmRPckxhYmVsKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIC8vIFNjcm9sbCB0aGUgbGVnZW5kIG9yIGxhYmVsIGludG8gdmlldyAqYmVmb3JlKiBjYWxsaW5nIGZvY3VzIG9uIHRoZSBpbnB1dCB0b1xyXG4gIC8vIGF2b2lkIGV4dHJhIHNjcm9sbGluZyBpbiBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgYHByZXZlbnRTY3JvbGxgICh3aGljaFxyXG4gIC8vIGF0IHRpbWUgb2Ygd3JpdGluZyBpcyBtb3N0IG9mIHRoZW0uLi4pXHJcbiAgJGxlZ2VuZE9yTGFiZWwuc2Nyb2xsSW50b1ZpZXcoKVxyXG4gICRpbnB1dC5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSlcclxuXHJcbiAgcmV0dXJuIHRydWVcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBmcmFnbWVudCBmcm9tIFVSTFxyXG4gKlxyXG4gKiBFeHRyYWN0IHRoZSBmcmFnbWVudCAoZXZlcnl0aGluZyBhZnRlciB0aGUgaGFzaCkgZnJvbSBhIFVSTCwgYnV0IG5vdCBpbmNsdWRpbmdcclxuICogdGhlIGhhc2guXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBVUkxcclxuICogQHJldHVybnMge3N0cmluZ30gRnJhZ21lbnQgZnJvbSBVUkwsIHdpdGhvdXQgdGhlIGhhc2hcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuZ2V0RnJhZ21lbnRGcm9tVXJsID0gZnVuY3Rpb24gKHVybCkge1xyXG4gIGlmICh1cmwuaW5kZXhPZignIycpID09PSAtMSkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdXJsLnNwbGl0KCcjJykucG9wKClcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBhc3NvY2lhdGVkIGxlZ2VuZCBvciBsYWJlbFxyXG4gKlxyXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgZXhpc3RzIGZyb20gdGhpcyBsaXN0OlxyXG4gKlxyXG4gKiAtIFRoZSBgPGxlZ2VuZD5gIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2xvc2VzdCBgPGZpZWxkc2V0PmAgYW5jZXN0b3IsIGFzIGxvbmdcclxuICogICBhcyB0aGUgdG9wIG9mIGl0IGlzIG5vIG1vcmUgdGhhbiBoYWxmIGEgdmlld3BvcnQgaGVpZ2h0IGF3YXkgZnJvbSB0aGVcclxuICogICBib3R0b20gb2YgdGhlIGlucHV0XHJcbiAqIC0gVGhlIGZpcnN0IGA8bGFiZWw+YCB0aGF0IGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQgdXNpbmcgZm9yPVwiaW5wdXRJZFwiXHJcbiAqIC0gVGhlIGNsb3Nlc3QgcGFyZW50IGA8bGFiZWw+YFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkaW5wdXQgLSBUaGUgaW5wdXRcclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBBc3NvY2lhdGVkIGxlZ2VuZCBvciBsYWJlbCwgb3IgbnVsbCBpZiBubyBhc3NvY2lhdGVkXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kIG9yIGxhYmVsIGNhbiBiZSBmb3VuZFxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5nZXRBc3NvY2lhdGVkTGVnZW5kT3JMYWJlbCA9IGZ1bmN0aW9uICgkaW5wdXQpIHtcclxuICB2YXIgJGZpZWxkc2V0ID0gJGlucHV0LmNsb3Nlc3QoJ2ZpZWxkc2V0JylcclxuXHJcbiAgaWYgKCRmaWVsZHNldCkge1xyXG4gICAgdmFyIGxlZ2VuZHMgPSAkZmllbGRzZXQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xlZ2VuZCcpXHJcblxyXG4gICAgaWYgKGxlZ2VuZHMubGVuZ3RoKSB7XHJcbiAgICAgIHZhciAkY2FuZGlkYXRlTGVnZW5kID0gbGVnZW5kc1swXVxyXG5cclxuICAgICAgLy8gSWYgdGhlIGlucHV0IHR5cGUgaXMgcmFkaW8gb3IgY2hlY2tib3gsIGFsd2F5cyB1c2UgdGhlIGxlZ2VuZCBpZiB0aGVyZVxyXG4gICAgICAvLyBpcyBvbmUuXHJcbiAgICAgIGlmICgkaW5wdXQudHlwZSA9PT0gJ2NoZWNrYm94JyB8fCAkaW5wdXQudHlwZSA9PT0gJ3JhZGlvJykge1xyXG4gICAgICAgIHJldHVybiAkY2FuZGlkYXRlTGVnZW5kXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEZvciBvdGhlciBpbnB1dCB0eXBlcywgb25seSBzY3JvbGwgdG8gdGhlIGZpZWxkc2V04oCZcyBsZWdlbmQgKGluc3RlYWQgb2ZcclxuICAgICAgLy8gdGhlIGxhYmVsIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQpIGlmIHRoZSBpbnB1dCB3b3VsZCBlbmQgdXAgaW4gdGhlXHJcbiAgICAgIC8vIHRvcCBoYWxmIG9mIHRoZSBzY3JlZW4uXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFRoaXMgc2hvdWxkIGF2b2lkIHNpdHVhdGlvbnMgd2hlcmUgdGhlIGlucHV0IGVpdGhlciBlbmRzIHVwIG9mZiB0aGVcclxuICAgICAgLy8gc2NyZWVuLCBvciBvYnNjdXJlZCBieSBhIHNvZnR3YXJlIGtleWJvYXJkLlxyXG4gICAgICB2YXIgbGVnZW5kVG9wID0gJGNhbmRpZGF0ZUxlZ2VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcclxuICAgICAgdmFyIGlucHV0UmVjdCA9ICRpbnB1dC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICAgICAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0XHJcbiAgICAgIC8vIG9yIHdpbmRvdy5pbm5lckhlaWdodCAobGlrZSBJRTgpLCBiYWlsIGFuZCBqdXN0IGxpbmsgdG8gdGhlIGxhYmVsLlxyXG4gICAgICBpZiAoaW5wdXRSZWN0LmhlaWdodCAmJiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuICAgICAgICB2YXIgaW5wdXRCb3R0b20gPSBpbnB1dFJlY3QudG9wICsgaW5wdXRSZWN0LmhlaWdodFxyXG5cclxuICAgICAgICBpZiAoaW5wdXRCb3R0b20gLSBsZWdlbmRUb3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGNhbmRpZGF0ZUxlZ2VuZFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFtmb3I9J1wiICsgJGlucHV0LmdldEF0dHJpYnV0ZSgnaWQnKSArIFwiJ11cIikgfHxcclxuICAgICRpbnB1dC5jbG9zZXN0KCdsYWJlbCcpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVycm9yU3VtbWFyeTsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gbW9kYWxcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJG1vZGFsIE1vZGFsIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIE1vZGFsICgkbW9kYWwpIHtcclxuICAgIHRoaXMuJG1vZGFsID0gJG1vZGFsO1xyXG4gICAgbGV0IGlkID0gdGhpcy4kbW9kYWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgdGhpcy50cmlnZ2VycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZHVsZT1cIm1vZGFsXCJdW2RhdGEtdGFyZ2V0PVwiJytpZCsnXCJdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzXHJcbiAqL1xyXG5Nb2RhbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdHJpZ2dlcnMgPSB0aGlzLnRyaWdnZXJzO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHJpZ2dlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgbGV0IHRyaWdnZXIgPSB0cmlnZ2Vyc1sgaSBdO1xyXG4gICAgdHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2hvdy5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgbGV0IGNsb3NlcnMgPSB0aGlzLiRtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2RhbC1jbG9zZV0nKTtcclxuICBmb3IgKGxldCBjID0gMDsgYyA8IGNsb3NlcnMubGVuZ3RoOyBjKyspe1xyXG4gICAgbGV0IGNsb3NlciA9IGNsb3NlcnNbIGMgXTtcclxuICAgIGNsb3Nlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogSGlkZSBtb2RhbFxyXG4gKi9cclxuTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKXtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gdGhpcy4kbW9kYWw7XHJcbiAgaWYobW9kYWxFbGVtZW50ICE9PSBudWxsKXtcclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcbiAgICBsZXQgZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgZXZlbnRDbG9zZS5pbml0RXZlbnQoJ2Zkcy5tb2RhbC5oaWRkZW4nLCB0cnVlLCB0cnVlKTtcclxuICAgIG1vZGFsRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG5cclxuICAgIGxldCAkYmFja2Ryb3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbW9kYWwtYmFja2Ryb3AnKTtcclxuICAgICRiYWNrZHJvcC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCRiYWNrZHJvcCk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJyk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcEZvY3VzLCB0cnVlKTtcclxuXHJcbiAgICBpZighaGFzRm9yY2VkQWN0aW9uKG1vZGFsRWxlbWVudCkpe1xyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUVzY2FwZSk7XHJcbiAgICB9XHJcbiAgICBsZXQgZGF0YU1vZGFsT3BlbmVyID0gbW9kYWxFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1tb2RhbC1vcGVuZXInKTtcclxuICAgIGlmKGRhdGFNb2RhbE9wZW5lciAhPT0gbnVsbCl7XHJcbiAgICAgIGxldCBvcGVuZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkYXRhTW9kYWxPcGVuZXIpXHJcbiAgICAgIGlmKG9wZW5lciAhPT0gbnVsbCl7XHJcbiAgICAgICAgb3BlbmVyLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgICAgbW9kYWxFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1tb2RhbC1vcGVuZXInKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogU2hvdyBtb2RhbFxyXG4gKi9cclxuTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoZSA9IG51bGwpe1xyXG4gIGxldCBtb2RhbEVsZW1lbnQgPSB0aGlzLiRtb2RhbDtcclxuICBpZihtb2RhbEVsZW1lbnQgIT09IG51bGwpe1xyXG4gICAgaWYoZSAhPT0gbnVsbCl7XHJcbiAgICAgIGxldCBvcGVuZXJJZCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgICAgaWYob3BlbmVySWQgPT09IG51bGwpe1xyXG4gICAgICAgIG9wZW5lcklkID0gJ21vZGFsLW9wZW5lci0nK01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg5OTk5IC0gMTAwMCArIDEpICsgMTAwMCk7XHJcbiAgICAgICAgZS50YXJnZXQuc2V0QXR0cmlidXRlKCdpZCcsIG9wZW5lcklkKVxyXG4gICAgICB9XHJcbiAgICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtb3BlbmVyJywgb3BlbmVySWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhpZGUgb3BlbiBtb2RhbHMgLSBGRFMgZG8gbm90IHJlY29tbWVuZCBtb3JlIHRoYW4gb25lIG9wZW4gbW9kYWwgYXQgYSB0aW1lXHJcbiAgICBsZXQgYWN0aXZlTW9kYWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKTtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBhY3RpdmVNb2RhbHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICBuZXcgTW9kYWwoYWN0aXZlTW9kYWxzW2ldKS5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XHJcblxyXG4gICAgbGV0IGV2ZW50T3BlbiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgZXZlbnRPcGVuLmluaXRFdmVudCgnZmRzLm1vZGFsLnNob3duJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICBtb2RhbEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG5cclxuICAgIGxldCAkYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICRiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1iYWNrZHJvcCcpO1xyXG4gICAgJGJhY2tkcm9wLnNldEF0dHJpYnV0ZSgnaWQnLCBcIm1vZGFsLWJhY2tkcm9wXCIpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCgkYmFja2Ryb3ApO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpO1xyXG5cclxuICAgIG1vZGFsRWxlbWVudC5mb2N1cygpO1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwRm9jdXMsIHRydWUpO1xyXG4gICAgaWYoIWhhc0ZvcmNlZEFjdGlvbihtb2RhbEVsZW1lbnQpKXtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVFc2NhcGUpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xvc2UgbW9kYWwgd2hlbiBoaXR0aW5nIEVTQ1xyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IFxyXG4gKi9cclxubGV0IGhhbmRsZUVzY2FwZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gIGxldCBtb2RhbEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmRzLW1vZGFsW2FyaWEtaGlkZGVuPWZhbHNlXScpO1xyXG4gIGxldCBjdXJyZW50TW9kYWwgPSBuZXcgTW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKSk7XHJcbiAgaWYgKGtleSA9PT0gMjcpe1xyXG4gICAgbGV0IHBvc3NpYmxlT3ZlcmZsb3dNZW51cyA9IG1vZGFsRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnV0dG9uLW92ZXJmbG93LW1lbnVbYXJpYS1leHBhbmRlZD1cInRydWVcIl0nKTtcclxuICAgIGlmKHBvc3NpYmxlT3ZlcmZsb3dNZW51cy5sZW5ndGggPT09IDApe1xyXG4gICAgICBjdXJyZW50TW9kYWwuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBUcmFwIGZvY3VzIGluIG1vZGFsIHdoZW4gb3BlblxyXG4gKiBAcGFyYW0ge1BvaW50ZXJFdmVudH0gZVxyXG4gKi9cclxuIGZ1bmN0aW9uIHRyYXBGb2N1cyhlKXtcclxuICB2YXIgY3VycmVudERpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJyk7XHJcbiAgaWYoY3VycmVudERpYWxvZyAhPT0gbnVsbCl7XHJcbiAgICB2YXIgZm9jdXNhYmxlRWxlbWVudHMgPSBjdXJyZW50RGlhbG9nLnF1ZXJ5U2VsZWN0b3JBbGwoJ2FbaHJlZl06bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIGlucHV0Om5vdChbdHlwZT1oaWRkZW5dKTpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIGRldGFpbHM6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pJyk7XHJcbiAgICBcclxuICAgIHZhciBmaXJzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1swXTtcclxuICAgIHZhciBsYXN0Rm9jdXNhYmxlRWxlbWVudCA9IGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdO1xyXG5cclxuICAgIHZhciBpc1RhYlByZXNzZWQgPSAoZS5rZXkgPT09ICdUYWInIHx8IGUua2V5Q29kZSA9PT0gOSk7XHJcblxyXG4gICAgaWYgKCFpc1RhYlByZXNzZWQpIHsgXHJcbiAgICAgIHJldHVybjsgXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCBlLnNoaWZ0S2V5ICkgLyogc2hpZnQgKyB0YWIgKi8ge1xyXG4gICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RGb2N1c2FibGVFbGVtZW50KSB7XHJcbiAgICAgICAgbGFzdEZvY3VzYWJsZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIC8qIHRhYiAqLyB7XHJcbiAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0Rm9jdXNhYmxlRWxlbWVudCkge1xyXG4gICAgICAgIGZpcnN0Rm9jdXNhYmxlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gaGFzRm9yY2VkQWN0aW9uIChtb2RhbCl7XHJcbiAgaWYobW9kYWwuZ2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLWZvcmNlZC1hY3Rpb24nKSA9PT0gbnVsbCl7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNb2RhbDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBmb3JFYWNoID0gcmVxdWlyZSgnYXJyYXktZm9yZWFjaCcpO1xyXG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuXHJcbmNvbnN0IE5BViA9IGAubmF2YDtcclxuY29uc3QgTkFWX0xJTktTID0gYCR7TkFWfSBhYDtcclxuY29uc3QgT1BFTkVSUyA9IGAuanMtbWVudS1vcGVuYDtcclxuY29uc3QgQ0xPU0VfQlVUVE9OID0gYC5qcy1tZW51LWNsb3NlYDtcclxuY29uc3QgT1ZFUkxBWSA9IGAub3ZlcmxheWA7XHJcbmNvbnN0IENMT1NFUlMgPSBgJHtDTE9TRV9CVVRUT059LCAub3ZlcmxheWA7XHJcbmNvbnN0IFRPR0dMRVMgPSBbIE5BViwgT1ZFUkxBWSBdLmpvaW4oJywgJyk7XHJcblxyXG5jb25zdCBBQ1RJVkVfQ0xBU1MgPSAnbW9iaWxlX25hdi1hY3RpdmUnO1xyXG5jb25zdCBWSVNJQkxFX0NMQVNTID0gJ2lzLXZpc2libGUnO1xyXG5cclxuLyoqXHJcbiAqIEFkZCBtb2JpbGUgbWVudSBmdW5jdGlvbmFsaXR5XHJcbiAqL1xyXG5jbGFzcyBOYXZpZ2F0aW9uIHtcclxuICAvKipcclxuICAgKiBTZXQgZXZlbnRzXHJcbiAgICovXHJcbiAgaW5pdCAoKSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbW9iaWxlTWVudSwgZmFsc2UpO1xyXG4gICAgbW9iaWxlTWVudSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIGV2ZW50c1xyXG4gICAqL1xyXG4gIHRlYXJkb3duICgpIHtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBtb2JpbGVNZW51LCBmYWxzZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uYWxpdHkgdG8gbW9iaWxlIG1lbnVcclxuICovXHJcbmNvbnN0IG1vYmlsZU1lbnUgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgbW9iaWxlID0gZmFsc2U7XHJcbiAgbGV0IG9wZW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE9QRU5FUlMpO1xyXG4gIGZvcihsZXQgbyA9IDA7IG8gPCBvcGVuZXJzLmxlbmd0aDsgbysrKSB7XHJcbiAgICBpZih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShvcGVuZXJzW29dLCBudWxsKS5kaXNwbGF5ICE9PSAnbm9uZScpIHtcclxuICAgICAgb3BlbmVyc1tvXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU5hdik7XHJcbiAgICAgIG1vYmlsZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBpZiBtb2JpbGVcclxuICBpZihtb2JpbGUpe1xyXG4gICAgbGV0IGNsb3NlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKENMT1NFUlMpO1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNsb3NlcnMubGVuZ3RoOyBjKyspIHtcclxuICAgICAgY2xvc2Vyc1sgYyBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTmF2KTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbmF2TGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE5BVl9MSU5LUyk7XHJcbiAgICBmb3IobGV0IG4gPSAwOyBuIDwgbmF2TGlua3MubGVuZ3RoOyBuKyspIHtcclxuICAgICAgbmF2TGlua3NbIG4gXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gQSBuYXZpZ2F0aW9uIGxpbmsgaGFzIGJlZW4gY2xpY2tlZCEgV2Ugd2FudCB0byBjb2xsYXBzZSBhbnlcclxuICAgICAgICAvLyBoaWVyYXJjaGljYWwgbmF2aWdhdGlvbiBVSSBpdCdzIGEgcGFydCBvZiwgc28gdGhhdCB0aGUgdXNlclxyXG4gICAgICAgIC8vIGNhbiBmb2N1cyBvbiB3aGF0ZXZlciB0aGV5J3ZlIGp1c3Qgc2VsZWN0ZWQuXHJcblxyXG4gICAgICAgIC8vIFNvbWUgbmF2aWdhdGlvbiBsaW5rcyBhcmUgaW5zaWRlIGRyb3Bkb3duczsgd2hlbiB0aGV5J3JlXHJcbiAgICAgICAgLy8gY2xpY2tlZCwgd2Ugd2FudCB0byBjb2xsYXBzZSB0aG9zZSBkcm9wZG93bnMuXHJcblxyXG5cclxuICAgICAgICAvLyBJZiB0aGUgbW9iaWxlIG5hdmlnYXRpb24gbWVudSBpcyBhY3RpdmUsIHdlIHdhbnQgdG8gaGlkZSBpdC5cclxuICAgICAgICBpZiAoaXNBY3RpdmUoKSkge1xyXG4gICAgICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdHJhcENvbnRhaW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE5BVik7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdHJhcENvbnRhaW5lcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgICBmb2N1c1RyYXAgPSBfZm9jdXNUcmFwKHRyYXBDb250YWluZXJzW2ldKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBjb25zdCBjbG9zZXIgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcclxuXHJcbiAgaWYgKGlzQWN0aXZlKCkgJiYgY2xvc2VyICYmIGNsb3Nlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCA9PT0gMCkge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgaXMgYWN0aXZlLCBidXQgdGhlIGNsb3NlIGJveCBpc24ndCB2aXNpYmxlLCB3aGljaFxyXG4gICAgLy8gbWVhbnMgdGhlIHVzZXIncyB2aWV3cG9ydCBoYXMgYmVlbiByZXNpemVkIHNvIHRoYXQgaXQgaXMgbm8gbG9uZ2VyXHJcbiAgICAvLyBpbiBtb2JpbGUgbW9kZS4gTGV0J3MgbWFrZSB0aGUgcGFnZSBzdGF0ZSBjb25zaXN0ZW50IGJ5XHJcbiAgICAvLyBkZWFjdGl2YXRpbmcgdGhlIG1vYmlsZSBuYXYuXHJcbiAgICB0b2dnbGVOYXYuY2FsbChjbG9zZXIsIGZhbHNlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgbW9iaWxlIG1lbnUgaXMgYWN0aXZlXHJcbiAqIEByZXR1cm5zIHRydWUgaWYgbW9iaWxlIG1lbnUgaXMgYWN0aXZlIGFuZCBmYWxzZSBpZiBub3QgYWN0aXZlXHJcbiAqL1xyXG5jb25zdCBpc0FjdGl2ZSA9ICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUyk7XHJcblxyXG4vKipcclxuICogVHJhcCBmb2N1cyBpbiBtb2JpbGUgbWVudSBpZiBhY3RpdmVcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdHJhcENvbnRhaW5lciBcclxuICovXHJcbmNvbnN0IF9mb2N1c1RyYXAgPSAodHJhcENvbnRhaW5lcikgPT4ge1xyXG5cclxuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cclxuICBjb25zdCBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9ICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSc7XHJcbiAgbGV0IGZvY3VzYWJsZUVsZW1lbnRzID0gdHJhcENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nKTtcclxuICBsZXQgZmlyc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbIDAgXTtcclxuXHJcbiAgZnVuY3Rpb24gdHJhcFRhYktleSAoZSkge1xyXG4gICAgdmFyIGtleSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XHJcbiAgICAvLyBDaGVjayBmb3IgVEFCIGtleSBwcmVzc1xyXG4gICAgaWYgKGtleSA9PT0gOSkge1xyXG5cclxuICAgICAgbGV0IGxhc3RUYWJTdG9wID0gbnVsbDtcclxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICBsZXQgbnVtYmVyID0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMTtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGZvY3VzYWJsZUVsZW1lbnRzWyBudW1iZXIgLSBpIF07XHJcbiAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0V2lkdGggPiAwICYmIGVsZW1lbnQub2Zmc2V0SGVpZ2h0ID4gMCkge1xyXG4gICAgICAgICAgbGFzdFRhYlN0b3AgPSBlbGVtZW50O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTSElGVCArIFRBQlxyXG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdFRhYlN0b3ApIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgLy8gVEFCXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3RUYWJTdG9wKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBFU0NBUEVcclxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcclxuICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGVuYWJsZSAoKSB7XHJcbiAgICAgICAgLy8gRm9jdXMgZmlyc3QgY2hpbGRcclxuICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgLy8gTGlzdGVuIGZvciBhbmQgdHJhcCB0aGUga2V5Ym9hcmRcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBUYWJLZXkpO1xyXG4gICAgfSxcclxuXHJcbiAgICByZWxlYXNlICgpIHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBUYWJLZXkpO1xyXG4gICAgfSxcclxuICB9O1xyXG59O1xyXG5cclxubGV0IGZvY3VzVHJhcDtcclxuXHJcbmNvbnN0IHRvZ2dsZU5hdiA9IGZ1bmN0aW9uIChhY3RpdmUpIHtcclxuICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICBpZiAodHlwZW9mIGFjdGl2ZSAhPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICBhY3RpdmUgPSAhaXNBY3RpdmUoKTtcclxuICB9XHJcbiAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKEFDVElWRV9DTEFTUywgYWN0aXZlKTtcclxuXHJcbiAgZm9yRWFjaChzZWxlY3QoVE9HR0xFUyksIGVsID0+IHtcclxuICAgIGVsLmNsYXNzTGlzdC50b2dnbGUoVklTSUJMRV9DTEFTUywgYWN0aXZlKTtcclxuICB9KTtcclxuICBpZiAoYWN0aXZlKSB7XHJcbiAgICBmb2N1c1RyYXAuZW5hYmxlKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGZvY3VzVHJhcC5yZWxlYXNlKCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBjbG9zZUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihDTE9TRV9CVVRUT04pO1xyXG4gIGNvbnN0IG1lbnVCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoT1BFTkVSUyk7XHJcblxyXG4gIGlmIChhY3RpdmUgJiYgY2xvc2VCdXR0b24pIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGFjdGl2YXRlZCwgc28gZm9jdXMgb24gdGhlIGNsb3NlIGJ1dHRvbixcclxuICAgIC8vIHdoaWNoIGlzIGp1c3QgYmVmb3JlIGFsbCB0aGUgbmF2IGVsZW1lbnRzIGluIHRoZSB0YWIgb3JkZXIuXHJcbiAgICBjbG9zZUJ1dHRvbi5mb2N1cygpO1xyXG4gIH0gZWxzZSBpZiAoIWFjdGl2ZSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBjbG9zZUJ1dHRvbiAmJlxyXG4gICAgICAgICAgICAgbWVudUJ1dHRvbikge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgZGVhY3RpdmF0ZWQsIGFuZCBmb2N1cyB3YXMgb24gdGhlIGNsb3NlXHJcbiAgICAvLyBidXR0b24sIHdoaWNoIGlzIG5vIGxvbmdlciB2aXNpYmxlLiBXZSBkb24ndCB3YW50IHRoZSBmb2N1cyB0b1xyXG4gICAgLy8gZGlzYXBwZWFyIGludG8gdGhlIHZvaWQsIHNvIGZvY3VzIG9uIHRoZSBtZW51IGJ1dHRvbiBpZiBpdCdzXHJcbiAgICAvLyB2aXNpYmxlICh0aGlzIG1heSBoYXZlIGJlZW4gd2hhdCB0aGUgdXNlciB3YXMganVzdCBmb2N1c2VkIG9uLFxyXG4gICAgLy8gaWYgdGhleSB0cmlnZ2VyZWQgdGhlIG1vYmlsZSBuYXYgYnkgbWlzdGFrZSkuXHJcbiAgICBtZW51QnV0dG9uLmZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYWN0aXZlO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgTmF2aWdhdGlvbjsiLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRPR0dMRV9BVFRSSUJVVEUgPSAnZGF0YS1jb250cm9scyc7XHJcblxyXG4vKipcclxuICogQWRkcyBjbGljayBmdW5jdGlvbmFsaXR5IHRvIHJhZGlvYnV0dG9uIGNvbGxhcHNlIGxpc3RcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyRWxlbWVudCBcclxuICovXHJcbmZ1bmN0aW9uIFJhZGlvVG9nZ2xlR3JvdXAoY29udGFpbmVyRWxlbWVudCl7XHJcbiAgICB0aGlzLnJhZGlvR3JvdXAgPSBjb250YWluZXJFbGVtZW50O1xyXG4gICAgdGhpcy5yYWRpb0VscyA9IG51bGw7XHJcbiAgICB0aGlzLnRhcmdldEVsID0gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudHNcclxuICovXHJcblJhZGlvVG9nZ2xlR3JvdXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKXtcclxuICAgIHRoaXMucmFkaW9FbHMgPSB0aGlzLnJhZGlvR3JvdXAucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdJyk7XHJcbiAgICBpZih0aGlzLnJhZGlvRWxzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyByYWRpb2J1dHRvbnMgZm91bmQgaW4gcmFkaW9idXR0b24gZ3JvdXAuJyk7XHJcbiAgICB9XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMucmFkaW9FbHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciByYWRpbyA9IHRoaXMucmFkaW9FbHNbIGkgXTtcclxuICAgICAgICBcclxuICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgICAgZm9yKGxldCBhID0gMDsgYSA8IHRoYXQucmFkaW9FbHMubGVuZ3RoOyBhKysgKXtcclxuICAgICAgICAgICAgICAgIHRoYXQudG9nZ2xlKHRoYXQucmFkaW9FbHNbIGEgXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRvZ2dsZShyYWRpbyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUb2dnbGUgcmFkaW9idXR0b24gY29udGVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IHJhZGlvSW5wdXRFbGVtZW50IFxyXG4gKi9cclxuUmFkaW9Ub2dnbGVHcm91cC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKHJhZGlvSW5wdXRFbGVtZW50KXtcclxuICAgIHZhciBjb250ZW50SWQgPSByYWRpb0lucHV0RWxlbWVudC5nZXRBdHRyaWJ1dGUoVE9HR0xFX0FUVFJJQlVURSk7XHJcbiAgICBpZihjb250ZW50SWQgIT09IG51bGwgJiYgY29udGVudElkICE9PSB1bmRlZmluZWQgJiYgY29udGVudElkICE9PSBcIlwiKXtcclxuICAgICAgICB2YXIgY29udGVudEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRlbnRJZCk7XHJcbiAgICAgICAgaWYoY29udGVudEVsZW1lbnQgPT09IG51bGwgfHwgY29udGVudEVsZW1lbnQgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgcGFuZWwgZWxlbWVudC4gVmVyaWZ5IHZhbHVlIG9mIGF0dHJpYnV0ZSBgKyBUT0dHTEVfQVRUUklCVVRFKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocmFkaW9JbnB1dEVsZW1lbnQuY2hlY2tlZCl7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuY29sbGFwc2UocmFkaW9JbnB1dEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHBhbmQgcmFkaW8gYnV0dG9uIGNvbnRlbnRcclxuICogQHBhcmFtIHt9IHJhZGlvSW5wdXRFbGVtZW50IFJhZGlvIElucHV0IGVsZW1lbnRcclxuICogQHBhcmFtIHsqfSBjb250ZW50RWxlbWVudCBDb250ZW50IGVsZW1lbnRcclxuICovXHJcblJhZGlvVG9nZ2xlR3JvdXAucHJvdG90eXBlLmV4cGFuZCA9IGZ1bmN0aW9uIChyYWRpb0lucHV0RWxlbWVudCwgY29udGVudEVsZW1lbnQpe1xyXG4gICAgaWYocmFkaW9JbnB1dEVsZW1lbnQgIT09IG51bGwgJiYgcmFkaW9JbnB1dEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICByYWRpb0lucHV0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMucmFkaW8uZXhwYW5kZWQnKTtcclxuICAgICAgICByYWRpb0lucHV0RWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIENvbGxhcHNlIHJhZGlvIGJ1dHRvbiBjb250ZW50XHJcbiAqIEBwYXJhbSB7fSByYWRpb0lucHV0RWxlbWVudCBSYWRpbyBJbnB1dCBlbGVtZW50XHJcbiAqIEBwYXJhbSB7Kn0gY29udGVudEVsZW1lbnQgQ29udGVudCBlbGVtZW50XHJcbiAqL1xyXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS5jb2xsYXBzZSA9IGZ1bmN0aW9uKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCl7XHJcbiAgICBpZihyYWRpb0lucHV0RWxlbWVudCAhPT0gbnVsbCAmJiByYWRpb0lucHV0RWxlbWVudCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnRFbGVtZW50ICE9PSBudWxsICYmIGNvbnRlbnRFbGVtZW50ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHJhZGlvSW5wdXRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMucmFkaW8uY29sbGFwc2VkJyk7XHJcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmFkaW9Ub2dnbGVHcm91cDsiLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IG1vZGlmaWVyU3RhdGUgPSB7XHJcbiAgc2hpZnQ6IGZhbHNlLFxyXG4gIGFsdDogZmFsc2UsXHJcbiAgY3RybDogZmFsc2UsXHJcbiAgY29tbWFuZDogZmFsc2VcclxufTtcclxuLypcclxuKiBQcmV2ZW50cyB0aGUgdXNlciBmcm9tIGlucHV0dGluZyBiYXNlZCBvbiBhIHJlZ2V4LlxyXG4qIERvZXMgbm90IHdvcmsgdGhlIHNhbWUgd2F5IGFmIDxpbnB1dCBwYXR0ZXJuPVwiXCI+LCB0aGlzIHBhdHRlcm4gaXMgb25seSB1c2VkIGZvciB2YWxpZGF0aW9uLCBub3QgdG8gcHJldmVudCBpbnB1dC5cclxuKiBVc2VjYXNlOiBudW1iZXIgaW5wdXQgZm9yIGRhdGUtY29tcG9uZW50LlxyXG4qIEV4YW1wbGUgLSBudW1iZXIgb25seTogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1pbnB1dC1yZWdleD1cIl5cXGQqJFwiPlxyXG4qL1xyXG5jbGFzcyBJbnB1dFJlZ2V4TWFzayB7XHJcbiAgY29uc3RydWN0b3IgKGVsZW1lbnQpe1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIHJlZ2V4TWFzayk7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCByZWdleE1hc2spO1xyXG4gIH1cclxufVxyXG52YXIgcmVnZXhNYXNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgaWYobW9kaWZpZXJTdGF0ZS5jdHJsIHx8IG1vZGlmaWVyU3RhdGUuY29tbWFuZCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgbmV3Q2hhciA9IG51bGw7XHJcbiAgaWYodHlwZW9mIGV2ZW50LmtleSAhPT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgaWYoZXZlbnQua2V5Lmxlbmd0aCA9PT0gMSl7XHJcbiAgICAgIG5ld0NoYXIgPSBldmVudC5rZXk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmKCFldmVudC5jaGFyQ29kZSl7XHJcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmtleUNvZGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV3Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQuY2hhckNvZGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHJlZ2V4U3RyID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5wdXQtcmVnZXgnKTtcclxuXHJcbiAgaWYoZXZlbnQudHlwZSAhPT0gdW5kZWZpbmVkICYmIGV2ZW50LnR5cGUgPT09ICdwYXN0ZScpe1xyXG4gICAgY29uc29sZS5sb2coJ3Bhc3RlJyk7XHJcbiAgfSBlbHNle1xyXG4gICAgdmFyIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgaWYoZXZlbnQudGFyZ2V0ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgaWYobmV3Q2hhciAhPT0gbnVsbCAmJiBlbGVtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgIGlmKG5ld0NoYXIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZihlbGVtZW50LnR5cGUgPT09ICdudW1iZXInKXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTsvL05vdGUgaW5wdXRbdHlwZT1udW1iZXJdIGRvZXMgbm90IGhhdmUgLnNlbGVjdGlvblN0YXJ0L0VuZCAoQ2hyb21lKS5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZS5zbGljZSgwLCBlbGVtZW50LnNlbGVjdGlvblN0YXJ0KSArIHRoaXMudmFsdWUuc2xpY2UoZWxlbWVudC5zZWxlY3Rpb25FbmQpICsgbmV3Q2hhcjsgLy9yZW1vdmVzIHRoZSBudW1iZXJzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCB0aGVuIGFkZHMgbmV3IGNoYXIuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAocmVnZXhTdHIpO1xyXG4gICAgICAgIGlmKHIuZXhlYyhuZXdWYWx1ZSkgPT09IG51bGwpe1xyXG4gICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IElucHV0UmVnZXhNYXNrOyIsIid1c2Ugc3RyaWN0JztcclxubGV0IHRleHQgPSB7XHJcbiAgXCJzZWxlY3Rfcm93XCI6IFwiVsOmbGcgcsOma2tlXCIsXHJcbiAgXCJ1bnNlbGVjdF9yb3dcIjogXCJGcmF2w6ZsZyByw6Zra2VcIixcclxuICBcInNlbGVjdF9hbGxfcm93c1wiOiBcIlbDpmxnIGFsbGUgcsOma2tlclwiLFxyXG4gIFwidW5zZWxlY3RfYWxsX3Jvd3NcIjogXCJGcmF2w6ZsZyBhbGxlIHLDpmtrZXJcIlxyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqIEBwYXJhbSB7SFRNTFRhYmxlRWxlbWVudH0gdGFibGUgVGFibGUgRWxlbWVudFxyXG4gKiBAcGFyYW0ge0pTT059IHN0cmluZ3MgVHJhbnNsYXRlIGxhYmVsczoge1wic2VsZWN0X3Jvd1wiOiBcIlbDpmxnIHLDpmtrZVwiLCBcInVuc2VsZWN0X3Jvd1wiOiBcIkZyYXbDpmxnIHLDpmtrZVwiLCBcInNlbGVjdF9hbGxfcm93c1wiOiBcIlbDpmxnIGFsbGUgcsOma2tlclwiLCBcInVuc2VsZWN0X2FsbF9yb3dzXCI6IFwiRnJhdsOmbGcgYWxsZSByw6Zra2VyXCJ9XHJcbiAqL1xyXG5mdW5jdGlvbiBUYWJsZVNlbGVjdGFibGVSb3dzICh0YWJsZSwgc3RyaW5ncyA9IHRleHQpIHtcclxuICB0aGlzLnRhYmxlID0gdGFibGU7XHJcbiAgdGV4dCA9IHN0cmluZ3M7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIGV2ZW50bGlzdGVuZXJzIGZvciBjaGVja2JveGVzIGluIHRhYmxlXHJcbiAqL1xyXG5UYWJsZVNlbGVjdGFibGVSb3dzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLmdyb3VwQ2hlY2tib3ggPSB0aGlzLmdldEdyb3VwQ2hlY2tib3goKTtcclxuICB0aGlzLnRib2R5Q2hlY2tib3hMaXN0ID0gdGhpcy5nZXRDaGVja2JveExpc3QoKTtcclxuICBpZih0aGlzLnRib2R5Q2hlY2tib3hMaXN0Lmxlbmd0aCAhPT0gMCl7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgdGhpcy50Ym9keUNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGxldCBjaGVja2JveCA9IHRoaXMudGJvZHlDaGVja2JveExpc3RbY107XHJcbiAgICAgIGNoZWNrYm94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUdyb3VwQ2hlY2spO1xyXG4gICAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVHcm91cENoZWNrKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYodGhpcy5ncm91cENoZWNrYm94ICE9PSBmYWxzZSl7XHJcbiAgICB0aGlzLmdyb3VwQ2hlY2tib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlQ2hlY2tib3hMaXN0KTtcclxuICAgIHRoaXMuZ3JvdXBDaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVDaGVja2JveExpc3QpO1xyXG4gIH1cclxufVxyXG4gIFxyXG4vKipcclxuICogR2V0IGdyb3VwIGNoZWNrYm94IGluIHRhYmxlIGhlYWRlclxyXG4gKiBAcmV0dXJucyBlbGVtZW50IG9uIHRydWUgLSBmYWxzZSBpZiBub3QgZm91bmRcclxuICovXHJcblRhYmxlU2VsZWN0YWJsZVJvd3MucHJvdG90eXBlLmdldEdyb3VwQ2hlY2tib3ggPSBmdW5jdGlvbigpe1xyXG4gIGxldCBjaGVja2JveCA9IHRoaXMudGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoZWFkJylbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybS1jaGVja2JveCcpO1xyXG4gIGlmKGNoZWNrYm94Lmxlbmd0aCA9PT0gMCl7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHJldHVybiBjaGVja2JveFswXTtcclxufVxyXG4vKipcclxuICogR2V0IHRhYmxlIGJvZHkgY2hlY2tib3hlc1xyXG4gKiBAcmV0dXJucyBIVE1MQ29sbGVjdGlvblxyXG4gKi9cclxuVGFibGVTZWxlY3RhYmxlUm93cy5wcm90b3R5cGUuZ2V0Q2hlY2tib3hMaXN0ID0gZnVuY3Rpb24oKXtcclxuICByZXR1cm4gdGhpcy50YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGJvZHknKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JtLWNoZWNrYm94Jyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgY2hlY2tib3hlcyBpbiB0YWJsZSBib2R5IHdoZW4gZ3JvdXAgY2hlY2tib3ggaXMgY2hhbmdlZFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIFxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlQ2hlY2tib3hMaXN0KGUpe1xyXG4gIGxldCBjaGVja2JveCA9IGUudGFyZ2V0O1xyXG4gIGNoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgbGV0IHRhYmxlID0gZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICBsZXQgdGFibGVTZWxlY3RhYmxlUm93cyA9IG5ldyBUYWJsZVNlbGVjdGFibGVSb3dzKHRhYmxlKTtcclxuICBsZXQgY2hlY2tib3hMaXN0ID0gdGFibGVTZWxlY3RhYmxlUm93cy5nZXRDaGVja2JveExpc3QoKTtcclxuICBsZXQgY2hlY2tlZE51bWJlciA9IDA7XHJcbiAgaWYoY2hlY2tib3guY2hlY2tlZCl7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICBjaGVja2JveExpc3RbY10ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3RhYmxlLXJvdy1zZWxlY3RlZCcpO1xyXG4gICAgICBjaGVja2JveExpc3RbY10ubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHRleHQudW5zZWxlY3Rfcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja2VkTnVtYmVyID0gY2hlY2tib3hMaXN0Lmxlbmd0aDtcclxuICAgIGNoZWNrYm94Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCB0ZXh0LnVuc2VsZWN0X2FsbF9yb3dzKTtcclxuICB9IGVsc2V7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCB0ZXh0LnNlbGVjdF9yb3cpO1xyXG4gICAgfVxyXG4gICAgY2hlY2tib3gubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHRleHQuc2VsZWN0X2FsbF9yb3dzKTtcclxuICB9XHJcbiAgXHJcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJmZHMudGFibGUuc2VsZWN0YWJsZS51cGRhdGVkXCIsIHtcclxuICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgZGV0YWlsOiB7Y2hlY2tlZE51bWJlcn1cclxuICB9KTtcclxuICB0YWJsZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBncm91cCBjaGVja2JveCB3aGVuIGNoZWNrYm94IGluIHRhYmxlIGJvZHkgaXMgY2hhbmdlZFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIFxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlR3JvdXBDaGVjayhlKXtcclxuICAvLyB1cGRhdGUgbGFiZWwgZm9yIGV2ZW50IGNoZWNrYm94XHJcbiAgaWYoZS50YXJnZXQuY2hlY2tlZCl7XHJcbiAgICBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICBlLnRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgdGV4dC51bnNlbGVjdF9yb3cpO1xyXG4gIH0gZWxzZXtcclxuICAgIGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICAgIGUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCB0ZXh0LnNlbGVjdF9yb3cpO1xyXG4gIH1cclxuICBsZXQgdGFibGUgPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIGxldCB0YWJsZVNlbGVjdGFibGVSb3dzID0gbmV3IFRhYmxlU2VsZWN0YWJsZVJvd3ModGFibGUpO1xyXG4gIGxldCBncm91cENoZWNrYm94ID0gdGFibGVTZWxlY3RhYmxlUm93cy5nZXRHcm91cENoZWNrYm94KCk7XHJcbiAgaWYoZ3JvdXBDaGVja2JveCAhPT0gZmFsc2Upe1xyXG4gICAgbGV0IGNoZWNrYm94TGlzdCA9IHRhYmxlU2VsZWN0YWJsZVJvd3MuZ2V0Q2hlY2tib3hMaXN0KCk7XHJcblxyXG4gICAgLy8gaG93IG1hbnkgcm93IGhhcyBiZWVuIHNlbGVjdGVkXHJcbiAgICBsZXQgY2hlY2tlZE51bWJlciA9IDA7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgbGV0IGxvb3BlZENoZWNrYm94ID0gY2hlY2tib3hMaXN0W2NdO1xyXG4gICAgICBpZihsb29wZWRDaGVja2JveC5jaGVja2VkKXtcclxuICAgICAgICBjaGVja2VkTnVtYmVyKys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYoY2hlY2tlZE51bWJlciA9PT0gY2hlY2tib3hMaXN0Lmxlbmd0aCl7IC8vIGlmIGFsbCByb3dzIGhhcyBiZWVuIHNlbGVjdGVkXHJcbiAgICAgIGdyb3VwQ2hlY2tib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgdGV4dC51bnNlbGVjdF9hbGxfcm93cyk7XHJcbiAgICB9IGVsc2UgaWYoY2hlY2tlZE51bWJlciA9PSAwKXsgLy8gaWYgbm8gcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICBncm91cENoZWNrYm94Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCB0ZXh0LnNlbGVjdF9hbGxfcm93cyk7XHJcbiAgICB9IGVsc2V7IC8vIGlmIHNvbWUgYnV0IG5vdCBhbGwgcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnNldEF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJywgJ21peGVkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICBncm91cENoZWNrYm94Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCB0ZXh0LnNlbGVjdF9hbGxfcm93cyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImZkcy50YWJsZS5zZWxlY3RhYmxlLnVwZGF0ZWRcIiwge1xyXG4gICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICBkZXRhaWw6IHtjaGVja2VkTnVtYmVyfVxyXG4gICAgfSk7XHJcbiAgICB0YWJsZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRhYmxlU2VsZWN0YWJsZVJvd3M7IiwiY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcblxyXG4vKipcclxuICogU2V0IGRhdGEtdGl0bGUgb24gY2VsbHMsIHdoZXJlIHRoZSBhdHRyaWJ1dGUgaXMgbWlzc2luZ1xyXG4gKi9cclxuY2xhc3MgUmVzcG9uc2l2ZVRhYmxlIHtcclxuICAgIGNvbnN0cnVjdG9yICh0YWJsZSkge1xyXG4gICAgICBpbnNlcnRIZWFkZXJBc0F0dHJpYnV0ZXModGFibGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIGRhdGEgYXR0cmlidXRlcyBuZWVkZWQgZm9yIHJlc3BvbnNpdmUgbW9kZS5cclxuICogQHBhcmFtIHtIVE1MVGFibGVFbGVtZW50fSB0YWJsZUVsIFRhYmxlIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGluc2VydEhlYWRlckFzQXR0cmlidXRlcyAodGFibGVFbCl7XHJcbiAgaWYgKCF0YWJsZUVsKSByZXR1cm47XHJcblxyXG4gIGxldCBoZWFkZXIgPSAgdGFibGVFbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKTtcclxuICBpZihoZWFkZXIubGVuZ3RoICE9PSAwKSB7XHJcbiAgICBsZXQgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclsgMCBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aCcpO1xyXG4gICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoID09IDApIHtcclxuICAgICAgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclsgMCBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChoZWFkZXJDZWxsRWxzLmxlbmd0aCkge1xyXG4gICAgICBjb25zdCBib2R5Um93RWxzID0gc2VsZWN0KCd0Ym9keSB0cicsIHRhYmxlRWwpO1xyXG4gICAgICBBcnJheS5mcm9tKGJvZHlSb3dFbHMpLmZvckVhY2gocm93RWwgPT4ge1xyXG4gICAgICAgIGxldCBjZWxsRWxzID0gcm93RWwuY2hpbGRyZW47XHJcbiAgICAgICAgaWYgKGNlbGxFbHMubGVuZ3RoID09PSBoZWFkZXJDZWxsRWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgQXJyYXkuZnJvbShoZWFkZXJDZWxsRWxzKS5mb3JFYWNoKChoZWFkZXJDZWxsRWwsIGkpID0+IHtcclxuICAgICAgICAgICAgLy8gR3JhYiBoZWFkZXIgY2VsbCB0ZXh0IGFuZCB1c2UgaXQgYm9keSBjZWxsIGRhdGEgdGl0bGUuXHJcbiAgICAgICAgICAgIGlmKCFjZWxsRWxzWyBpIF0uaGFzQXR0cmlidXRlKCdkYXRhLXRpdGxlJykgKXtcclxuICAgICAgICAgICAgICBjZWxsRWxzWyBpIF0uc2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJywgaGVhZGVyQ2VsbEVsLnRleHRDb250ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNpdmVUYWJsZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgYnJlYWtwb2ludHMgPSB7XHJcbiAgJ3hzJzogMCxcclxuICAnc20nOiA1NzYsXHJcbiAgJ21kJzogNzY4LFxyXG4gICdsZyc6IDk5MixcclxuICAneGwnOiAxMjAwXHJcbn07XHJcblxyXG4vLyBGb3IgZWFzeSByZWZlcmVuY2VcclxudmFyIGtleXMgPSB7XHJcbiAgZW5kOiAzNSxcclxuICBob21lOiAzNixcclxuICBsZWZ0OiAzNyxcclxuICB1cDogMzgsXHJcbiAgcmlnaHQ6IDM5LFxyXG4gIGRvd246IDQwLFxyXG4gIGRlbGV0ZTogNDZcclxufTtcclxuXHJcbi8vIEFkZCBvciBzdWJzdHJhY3QgZGVwZW5kaW5nIG9uIGtleSBwcmVzc2VkXHJcbnZhciBkaXJlY3Rpb24gPSB7XHJcbiAgMzc6IC0xLFxyXG4gIDM4OiAtMSxcclxuICAzOTogMSxcclxuICA0MDogMVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIHRhYm5hdiBjb21wb25lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFibmF2IFRhYm5hdiBjb250YWluZXJcclxuICovXHJcbmZ1bmN0aW9uIFRhYm5hdiAodGFibmF2KSB7XHJcbiAgdGhpcy50YWJuYXYgPSB0YWJuYXY7XHJcbiAgdGhpcy50YWJzID0gdGhpcy50YWJuYXYucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLnRhYm5hdi1pdGVtJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnQgb24gY29tcG9uZW50XHJcbiAqL1xyXG5UYWJuYXYucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gIGlmKHRoaXMudGFicy5sZW5ndGggPT09IDApe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBUYWJuYXYgSFRNTCBzZWVtcyB0byBiZSBtaXNzaW5nIHRhYm5hdi1pdGVtLiBBZGQgdGFibmF2IGl0ZW1zIHRvIGVuc3VyZSBlYWNoIHBhbmVsIGhhcyBhIGJ1dHRvbiBpbiB0aGUgdGFibmF2cyBuYXZpZ2F0aW9uLmApO1xyXG4gIH1cclxuXHJcbiAgLy8gaWYgbm8gaGFzaCBpcyBzZXQgb24gbG9hZCwgc2V0IGFjdGl2ZSB0YWJcclxuICBpZiAoIXNldEFjdGl2ZUhhc2hUYWIoKSkge1xyXG4gICAgLy8gc2V0IGZpcnN0IHRhYiBhcyBhY3RpdmVcclxuICAgIGxldCB0YWIgPSB0aGlzLnRhYnNbIDAgXTtcclxuXHJcbiAgICAvLyBjaGVjayBubyBvdGhlciB0YWJzIGFzIGJlZW4gc2V0IGF0IGRlZmF1bHRcclxuICAgIGxldCBhbHJlYWR5QWN0aXZlID0gZ2V0QWN0aXZlVGFicyh0aGlzLnRhYm5hdik7XHJcbiAgICBpZiAoYWxyZWFkeUFjdGl2ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGFiID0gYWxyZWFkeUFjdGl2ZVsgMCBdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGFjdGl2YXRlIGFuZCBkZWFjdGl2YXRlIHRhYnNcclxuICAgIHRoaXMuYWN0aXZhdGVUYWIodGFiLCBmYWxzZSk7XHJcbiAgfVxyXG4gIGxldCAkbW9kdWxlID0gdGhpcztcclxuICAvLyBhZGQgZXZlbnRsaXN0ZW5lcnMgb24gYnV0dG9uc1xyXG4gIGZvcihsZXQgdCA9IDA7IHQgPCB0aGlzLnRhYnMubGVuZ3RoOyB0ICsrKXtcclxuICAgIHRoaXMudGFic1sgdCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXskbW9kdWxlLmFjdGl2YXRlVGFiKHRoaXMsIGZhbHNlKX0pO1xyXG4gICAgdGhpcy50YWJzWyB0IF0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd25FdmVudExpc3RlbmVyKTtcclxuICAgIHRoaXMudGFic1sgdCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXBFdmVudExpc3RlbmVyKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKipcclxuICogU2hvdyB0YWIgYW5kIGhpZGUgb3RoZXJzXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IHRhYiBidXR0b24gZWxlbWVudFxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNldEZvY3VzIFRydWUgaWYgdGFiIGJ1dHRvbiBzaG91bGQgYmUgZm9jdXNlZFxyXG4gKi9cclxuIFRhYm5hdi5wcm90b3R5cGUuYWN0aXZhdGVUYWIgPSBmdW5jdGlvbih0YWIsIHNldEZvY3VzKSB7XHJcbiAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhYik7XHJcblxyXG4gIC8vIGNsb3NlIGFsbCB0YWJzIGV4Y2VwdCBzZWxlY3RlZFxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50YWJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAodGFic1sgaSBdID09PSB0YWIpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhYnNbIGkgXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMudGFibmF2LmNsb3NlJyk7XHJcbiAgICAgIHRhYnNbIGkgXS5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHRhYnNbIGkgXS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XHJcbiAgICB0YWJzWyBpIF0uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XHJcbiAgICBsZXQgdGFicGFuZWxJRCA9IHRhYnNbIGkgXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKTtcclxuICAgIGxldCB0YWJwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhYnBhbmVsSUQpXHJcbiAgICBpZih0YWJwYW5lbCA9PT0gbnVsbCl7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgdGFicGFuZWwuYCk7XHJcbiAgICB9XHJcbiAgICB0YWJwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICB9XHJcbiAgXHJcbiAgLy8gU2V0IHNlbGVjdGVkIHRhYiB0byBhY3RpdmVcclxuICBsZXQgdGFicGFuZWxJRCA9IHRhYi5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKTtcclxuICBsZXQgdGFicGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YWJwYW5lbElEKTtcclxuICBpZih0YWJwYW5lbCA9PT0gbnVsbCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGFjY29yZGlvbiBwYW5lbC5gKTtcclxuICB9XHJcblxyXG4gIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xyXG4gIHRhYnBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICB0YWIucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xyXG5cclxuICAvLyBTZXQgZm9jdXMgd2hlbiByZXF1aXJlZFxyXG4gIGlmIChzZXRGb2N1cykge1xyXG4gICAgdGFiLmZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICBsZXQgZXZlbnRDaGFuZ2VkID0gbmV3IEV2ZW50KCdmZHMudGFibmF2LmNoYW5nZWQnKTtcclxuICB0YWIucGFyZW50Tm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50Q2hhbmdlZCk7XHJcblxyXG4gIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy50YWJuYXYub3BlbicpO1xyXG4gIHRhYi5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQga2V5ZG93biBldmVudHMgdG8gdGFibmF2IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IFxyXG4gKi9cclxuZnVuY3Rpb24ga2V5ZG93bkV2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIHN3aXRjaCAoa2V5KSB7XHJcbiAgICBjYXNlIGtleXMuZW5kOlxyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAvLyBBY3RpdmF0ZSBsYXN0IHRhYlxyXG4gICAgICBmb2N1c0xhc3RUYWIoZXZlbnQudGFyZ2V0KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGtleXMuaG9tZTpcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gQWN0aXZhdGUgZmlyc3QgdGFiXHJcbiAgICAgIGZvY3VzRmlyc3RUYWIoZXZlbnQudGFyZ2V0KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICAvLyBVcCBhbmQgZG93biBhcmUgaW4ga2V5ZG93blxyXG4gICAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIHByZXZlbnQgcGFnZSBzY3JvbGwgPjopXHJcbiAgICBjYXNlIGtleXMudXA6XHJcbiAgICBjYXNlIGtleXMuZG93bjpcclxuICAgICAgZGV0ZXJtaW5lT3JpZW50YXRpb24oZXZlbnQpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQga2V5dXAgZXZlbnRzIHRvIHRhYm5hdiBjb21wb25lbnRcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCBcclxuICovXHJcbmZ1bmN0aW9uIGtleXVwRXZlbnRMaXN0ZW5lciAoZXZlbnQpIHtcclxuICBsZXQga2V5ID0gZXZlbnQua2V5Q29kZTtcclxuXHJcbiAgc3dpdGNoIChrZXkpIHtcclxuICAgIGNhc2Uga2V5cy5sZWZ0OlxyXG4gICAgY2FzZSBrZXlzLnJpZ2h0OlxyXG4gICAgICBkZXRlcm1pbmVPcmllbnRhdGlvbihldmVudCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmRlbGV0ZTpcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGtleXMuZW50ZXI6XHJcbiAgICBjYXNlIGtleXMuc3BhY2U6XHJcbiAgICAgIG5ldyBUYWJuYXYoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUpLmFjdGl2YXRlVGFiKGV2ZW50LnRhcmdldCwgdHJ1ZSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFdoZW4gYSB0YWJsaXN0IGFyaWEtb3JpZW50YXRpb24gaXMgc2V0IHRvIHZlcnRpY2FsLFxyXG4gKiBvbmx5IHVwIGFuZCBkb3duIGFycm93IHNob3VsZCBmdW5jdGlvbi5cclxuICogSW4gYWxsIG90aGVyIGNhc2VzIG9ubHkgbGVmdCBhbmQgcmlnaHQgYXJyb3cgZnVuY3Rpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBkZXRlcm1pbmVPcmllbnRhdGlvbiAoZXZlbnQpIHtcclxuICBsZXQga2V5ID0gZXZlbnQua2V5Q29kZTtcclxuXHJcbiAgbGV0IHc9d2luZG93LFxyXG4gICAgZD1kb2N1bWVudCxcclxuICAgIGU9ZC5kb2N1bWVudEVsZW1lbnQsXHJcbiAgICBnPWQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLFxyXG4gICAgeD13LmlubmVyV2lkdGh8fGUuY2xpZW50V2lkdGh8fGcuY2xpZW50V2lkdGgsXHJcbiAgICB5PXcuaW5uZXJIZWlnaHR8fGUuY2xpZW50SGVpZ2h0fHxnLmNsaWVudEhlaWdodDtcclxuXHJcbiAgbGV0IHZlcnRpY2FsID0geCA8IGJyZWFrcG9pbnRzLm1kO1xyXG4gIGxldCBwcm9jZWVkID0gZmFsc2U7XHJcblxyXG4gIGlmICh2ZXJ0aWNhbCkge1xyXG4gICAgaWYgKGtleSA9PT0ga2V5cy51cCB8fCBrZXkgPT09IGtleXMuZG93bikge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBwcm9jZWVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBpZiAoa2V5ID09PSBrZXlzLmxlZnQgfHwga2V5ID09PSBrZXlzLnJpZ2h0KSB7XHJcbiAgICAgIHByb2NlZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAocHJvY2VlZCkge1xyXG4gICAgc3dpdGNoVGFiT25BcnJvd1ByZXNzKGV2ZW50KTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFaXRoZXIgZm9jdXMgdGhlIG5leHQsIHByZXZpb3VzLCBmaXJzdCwgb3IgbGFzdCB0YWJcclxuICogZGVwZW5kaW5nIG9uIGtleSBwcmVzc2VkXHJcbiAqL1xyXG5mdW5jdGlvbiBzd2l0Y2hUYWJPbkFycm93UHJlc3MgKGV2ZW50KSB7XHJcbiAgdmFyIHByZXNzZWQgPSBldmVudC5rZXlDb2RlO1xyXG4gIGlmIChkaXJlY3Rpb25bIHByZXNzZWQgXSkge1xyXG4gICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuICAgIGxldCB0YWJzID0gZ2V0QWxsVGFic0luTGlzdCh0YXJnZXQpO1xyXG4gICAgbGV0IGluZGV4ID0gZ2V0SW5kZXhPZkVsZW1lbnRJbkxpc3QodGFyZ2V0LCB0YWJzKTtcclxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRhYnNbIGluZGV4ICsgZGlyZWN0aW9uWyBwcmVzc2VkIF0gXSkge1xyXG4gICAgICAgIHRhYnNbIGluZGV4ICsgZGlyZWN0aW9uWyBwcmVzc2VkIF0gXS5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHByZXNzZWQgPT09IGtleXMubGVmdCB8fCBwcmVzc2VkID09PSBrZXlzLnVwKSB7XHJcbiAgICAgICAgZm9jdXNMYXN0VGFiKHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocHJlc3NlZCA9PT0ga2V5cy5yaWdodCB8fCBwcmVzc2VkID09IGtleXMuZG93bikge1xyXG4gICAgICAgIGZvY3VzRmlyc3RUYWIodGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBhbGwgYWN0aXZlIHRhYnMgaW4gbGlzdFxyXG4gKiBAcGFyYW0gdGFibmF2IHBhcmVudCAudGFibmF2IGVsZW1lbnRcclxuICogQHJldHVybnMgcmV0dXJucyBsaXN0IG9mIGFjdGl2ZSB0YWJzIGlmIGFueVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QWN0aXZlVGFicyAodGFibmF2KSB7XHJcbiAgcmV0dXJuIHRhYm5hdi5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24udGFibmF2LWl0ZW1bYXJpYS1zZWxlY3RlZD10cnVlXScpO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IGEgbGlzdCBvZiBhbGwgYnV0dG9uIHRhYnMgaW4gY3VycmVudCB0YWJsaXN0XHJcbiAqIEBwYXJhbSB0YWIgQnV0dG9uIHRhYiBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHsqfSByZXR1cm4gYXJyYXkgb2YgdGFic1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QWxsVGFic0luTGlzdCAodGFiKSB7XHJcbiAgbGV0IHBhcmVudE5vZGUgPSB0YWIucGFyZW50Tm9kZTtcclxuICBpZiAocGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3RhYm5hdicpKSB7XHJcbiAgICByZXR1cm4gcGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24udGFibmF2LWl0ZW0nKTtcclxuICB9XHJcbiAgcmV0dXJuIFtdO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IGluZGV4IG9mIGVsZW1lbnQgaW4gbGlzdFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFxyXG4gKiBAcGFyYW0ge0hUTUxDb2xsZWN0aW9ufSBsaXN0IFxyXG4gKiBAcmV0dXJucyB7aW5kZXh9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRJbmRleE9mRWxlbWVudEluTGlzdCAoZWxlbWVudCwgbGlzdCl7XHJcbiAgbGV0IGluZGV4ID0gLTE7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrICl7XHJcbiAgICBpZihsaXN0WyBpIF0gPT09IGVsZW1lbnQpe1xyXG4gICAgICBpbmRleCA9IGk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGluZGV4O1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIHRoZXJlIGlzIGEgdGFiIGhhc2ggaW4gdGhlIHVybCBhbmQgYWN0aXZhdGVzIHRoZSB0YWIgYWNjb3JkaW5nbHlcclxuICogQHJldHVybnMge2Jvb2xlYW59IHJldHVybnMgdHJ1ZSBpZiB0YWIgaGFzIGJlZW4gc2V0IC0gcmV0dXJucyBmYWxzZSBpZiBubyB0YWIgaGFzIGJlZW4gc2V0IHRvIGFjdGl2ZVxyXG4gKi9cclxuZnVuY3Rpb24gc2V0QWN0aXZlSGFzaFRhYiAoKSB7XHJcbiAgbGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XHJcbiAgaWYgKGhhc2ggIT09ICcnKSB7XHJcbiAgICBsZXQgdGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uLnRhYm5hdi1pdGVtW2FyaWEtY29udHJvbHM9XCIjJyArIGhhc2ggKyAnXCJdJyk7XHJcbiAgICBpZiAodGFiICE9PSBudWxsKSB7XHJcbiAgICAgIGFjdGl2YXRlVGFiKHRhYiwgZmFsc2UpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IGZpcnN0IHRhYiBieSB0YWIgaW4gbGlzdFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB0YWIgXHJcbiAqL1xyXG5mdW5jdGlvbiBmb2N1c0ZpcnN0VGFiICh0YWIpIHtcclxuICBnZXRBbGxUYWJzSW5MaXN0KHRhYilbIDAgXS5mb2N1cygpO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IGxhc3QgdGFiIGJ5IHRhYiBpbiBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IHRhYiBcclxuICovXHJcbmZ1bmN0aW9uIGZvY3VzTGFzdFRhYiAodGFiKSB7XHJcbiAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhYik7XHJcbiAgdGFic1sgdGFicy5sZW5ndGggLSAxIF0uZm9jdXMoKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGFibmF2OyIsIid1c2Ugc3RyaWN0JztcclxuLyoqXHJcbiAqIFNob3cvaGlkZSB0b2FzdCBjb21wb25lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBcclxuICovXHJcbmZ1bmN0aW9uIFRvYXN0IChlbGVtZW50KXtcclxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG93IHRvYXN0XHJcbiAqL1xyXG5Ub2FzdC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3dpbmcnKTtcclxuICAgIHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b2FzdC1jbG9zZScpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBsZXQgdG9hc3QgPSB0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICAgICAgICBuZXcgVG9hc3QodG9hc3QpLmhpZGUoKTtcclxuICAgIH0pO1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHNob3dUb2FzdCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIaWRlIHRvYXN0XHJcbiAqL1xyXG5Ub2FzdC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTsgICAgICAgICBcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZHMgY2xhc3NlcyB0byBtYWtlIHNob3cgYW5pbWF0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBzaG93VG9hc3QoKXtcclxuICAgIGxldCB0b2FzdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudG9hc3Quc2hvd2luZycpO1xyXG4gICAgZm9yKGxldCB0ID0gMDsgdCA8IHRvYXN0cy5sZW5ndGg7IHQrKyl7XHJcbiAgICAgICAgbGV0IHRvYXN0ID0gdG9hc3RzW3RdO1xyXG4gICAgICAgIHRvYXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3dpbmcnKTtcclxuICAgICAgICB0b2FzdC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRvYXN0OyIsIid1c2Ugc3RyaWN0JztcclxuLyoqXHJcbiAqIFNldCB0b29sdGlwIG9uIGVsZW1lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdoaWNoIGhhcyB0b29sdGlwXHJcbiAqL1xyXG5mdW5jdGlvbiBUb29sdGlwKGVsZW1lbnQpIHtcclxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICBpZiAodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwJykgPT09IG51bGwpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRvb2x0aXAgdGV4dCBpcyBtaXNzaW5nLiBBZGQgYXR0cmlidXRlIGRhdGEtdG9vbHRpcCBhbmQgdGhlIGNvbnRlbnQgb2YgdGhlIHRvb2x0aXAgYXMgdmFsdWUuYCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRsaXN0ZW5lcnNcclxuICovXHJcblRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgbW9kdWxlID0gdGhpcztcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBsZXQgdHJpZ2dlciA9IGUudGFyZ2V0O1xyXG4gICAgICAgIGlmICh0cmlnZ2VyLmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1ob3ZlcicpID09PSBmYWxzZSAmJiB0cmlnZ2VyLmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1mb2N1cycpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBjbG9zZUFsbFRvb2x0aXBzKGUpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5hZGQoXCJ0b29sdGlwLWhvdmVyXCIpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0cmlnZ2VyLmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1ob3ZlcicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JykgIT09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICBhZGRUb29sdGlwKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBsZXQgdHJpZ2dlciA9IGUudGFyZ2V0O1xyXG4gICAgICAgIGlmICh0cmlnZ2VyLmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1ob3ZlcicpKSB7XHJcbiAgICAgICAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1ob3ZlcicpO1xyXG4gICAgICAgICAgICB2YXIgdG9vbHRpcElkID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgICAgICAgbGV0IHRvb2x0aXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcElkKTtcclxuICAgICAgICAgICAgaWYgKHRvb2x0aXBFbGVtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjbG9zZUhvdmVyVG9vbHRpcCh0cmlnZ2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gICAgICAgIGlmIChrZXkgPT09IDI3KSB7XHJcbiAgICAgICAgICAgIHZhciB0b29sdGlwID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgICAgICAgaWYgKHRvb2x0aXAgIT09IG51bGwgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcCkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC10cmlnZ2VyJykgPT09ICdjbGljaycpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9IGUudGFyZ2V0O1xyXG4gICAgICAgICAgICBjbG9zZUFsbFRvb2x0aXBzKGUpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5hZGQoJ3Rvb2x0aXAtZm9jdXMnKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgICAgICAgIGlmICh0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGFkZFRvb2x0aXAodHJpZ2dlcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlQWxsVG9vbHRpcHMpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlQWxsVG9vbHRpcHMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsb3NlIGFsbCB0b29sdGlwc1xyXG4gKi9cclxuZnVuY3Rpb24gY2xvc2VBbGwoKSB7XHJcbiAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdG9vbHRpcFthcmlhLWRlc2NyaWJlZGJ5XScpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBwb3BwZXIgPSBlbGVtZW50c1tpXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgICBlbGVtZW50c1tpXS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHBlcikpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRUb29sdGlwKHRyaWdnZXIpIHtcclxuICAgIHZhciBwb3MgPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLXBvc2l0aW9uJykgfHwgJ3RvcCc7XHJcblxyXG4gICAgdmFyIHRvb2x0aXAgPSBjcmVhdGVUb29sdGlwKHRyaWdnZXIsIHBvcyk7XHJcblxyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b29sdGlwKTtcclxuXHJcbiAgICBwb3NpdGlvbkF0KHRyaWdnZXIsIHRvb2x0aXAsIHBvcyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgdG9vbHRpcCBlbGVtZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aGljaCB0aGUgdG9vbHRpcCBpcyBhdHRhY2hlZFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcG9zIFBvc2l0aW9uIG9mIHRvb2x0aXAgKHRvcCB8IGJvdHRvbSlcclxuICogQHJldHVybnMgXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVUb29sdGlwKGVsZW1lbnQsIHBvcykge1xyXG4gICAgdmFyIHRvb2x0aXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRvb2x0aXAuY2xhc3NOYW1lID0gJ3Rvb2x0aXAtcG9wcGVyJztcclxuICAgIHZhciBwb3BwZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1wb3BwZXInKTtcclxuICAgIHZhciBpZCA9ICd0b29sdGlwLScgKyBwb3BwZXJzLmxlbmd0aCArIDE7XHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgncm9sZScsICd0b29sdGlwJyk7XHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnLCBwb3MpO1xyXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBpZCk7XHJcblxyXG4gICAgdmFyIHRvb2x0aXBJbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdG9vbHRpcElubmVyLmNsYXNzTmFtZSA9ICd0b29sdGlwJztcclxuXHJcbiAgICB2YXIgdG9vbHRpcEFycm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b29sdGlwQXJyb3cuY2xhc3NOYW1lID0gJ3Rvb2x0aXAtYXJyb3cnO1xyXG4gICAgdG9vbHRpcElubmVyLmFwcGVuZENoaWxkKHRvb2x0aXBBcnJvdyk7XHJcblxyXG4gICAgdmFyIHRvb2x0aXBDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b29sdGlwQ29udGVudC5jbGFzc05hbWUgPSAndG9vbHRpcC1jb250ZW50JztcclxuICAgIHRvb2x0aXBDb250ZW50LmlubmVySFRNTCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAnKTtcclxuICAgIHRvb2x0aXBJbm5lci5hcHBlbmRDaGlsZCh0b29sdGlwQ29udGVudCk7XHJcbiAgICB0b29sdGlwLmFwcGVuZENoaWxkKHRvb2x0aXBJbm5lcik7XHJcblxyXG4gICAgcmV0dXJuIHRvb2x0aXA7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogUG9zaXRpb25zIHRoZSB0b29sdGlwLlxyXG4gKlxyXG4gKiBAcGFyYW0ge29iamVjdH0gcGFyZW50IC0gVGhlIHRyaWdnZXIgb2YgdGhlIHRvb2x0aXAuXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSB0b29sdGlwIC0gVGhlIHRvb2x0aXAgaXRzZWxmLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcG9zSG9yaXpvbnRhbCAtIERlc2lyZWQgaG9yaXpvbnRhbCBwb3NpdGlvbiBvZiB0aGUgdG9vbHRpcCByZWxhdGl2ZWx5IHRvIHRoZSB0cmlnZ2VyIChsZWZ0L2NlbnRlci9yaWdodClcclxuICogQHBhcmFtIHtzdHJpbmd9IHBvc1ZlcnRpY2FsIC0gRGVzaXJlZCB2ZXJ0aWNhbCBwb3NpdGlvbiBvZiB0aGUgdG9vbHRpcCByZWxhdGl2ZWx5IHRvIHRoZSB0cmlnZ2VyICh0b3AvY2VudGVyL2JvdHRvbSlcclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHBvc2l0aW9uQXQocGFyZW50LCB0b29sdGlwLCBwb3MpIHtcclxuICAgIGxldCB0cmlnZ2VyID0gcGFyZW50O1xyXG4gICAgbGV0IGFycm93ID0gdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF07XHJcbiAgICBsZXQgdHJpZ2dlclBvc2l0aW9uID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgIHZhciBwYXJlbnRDb29yZHMgPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIGxlZnQsIHRvcDtcclxuXHJcbiAgICB2YXIgdG9vbHRpcFdpZHRoID0gdG9vbHRpcC5vZmZzZXRXaWR0aDtcclxuXHJcbiAgICB2YXIgZGlzdCA9IDEyO1xyXG4gICAgbGV0IGFycm93RGlyZWN0aW9uID0gXCJkb3duXCI7XHJcbiAgICBsZWZ0ID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLmxlZnQpICsgKChwYXJlbnQub2Zmc2V0V2lkdGggLSB0b29sdGlwLm9mZnNldFdpZHRoKSAvIDIpO1xyXG5cclxuICAgIHN3aXRjaCAocG9zKSB7XHJcbiAgICAgICAgY2FzZSAnYm90dG9tJzpcclxuICAgICAgICAgICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLmJvdHRvbSkgKyBkaXN0O1xyXG4gICAgICAgICAgICBhcnJvd0RpcmVjdGlvbiA9IFwidXBcIjtcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgY2FzZSAndG9wJzpcclxuICAgICAgICAgICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLnRvcCkgLSB0b29sdGlwLm9mZnNldEhlaWdodCAtIGRpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaWYgdG9vbHRpcCBpcyBvdXQgb2YgYm91bmRzIG9uIGxlZnQgc2lkZVxyXG4gICAgaWYgKGxlZnQgPCAwKSB7XHJcbiAgICAgICAgbGVmdCA9IGRpc3Q7XHJcbiAgICAgICAgbGV0IGVuZFBvc2l0aW9uT25QYWdlID0gdHJpZ2dlclBvc2l0aW9uLmxlZnQgKyAodHJpZ2dlci5vZmZzZXRXaWR0aCAvIDIpO1xyXG4gICAgICAgIGxldCB0b29sdGlwQXJyb3dIYWxmV2lkdGggPSA4O1xyXG4gICAgICAgIGxldCBhcnJvd0xlZnRQb3NpdGlvbiA9IGVuZFBvc2l0aW9uT25QYWdlIC0gZGlzdCAtIHRvb2x0aXBBcnJvd0hhbGZXaWR0aDtcclxuICAgICAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5zdHlsZS5sZWZ0ID0gYXJyb3dMZWZ0UG9zaXRpb24gKyAncHgnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIHRvb2x0aXAgaXMgb3V0IG9mIGJvdW5kcyBvbiB0aGUgYm90dG9tIG9mIHRoZSBwYWdlXHJcbiAgICBpZiAoKHRvcCArIHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSA+PSB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMudG9wKSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gZGlzdDtcclxuICAgICAgICBhcnJvd0RpcmVjdGlvbiA9IFwiZG93blwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIHRvb2x0aXAgaXMgb3V0IG9mIGJvdW5kcyBvbiB0aGUgdG9wIG9mIHRoZSBwYWdlXHJcbiAgICBpZiAodG9wIDwgMCkge1xyXG4gICAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5ib3R0b20pICsgZGlzdDtcclxuICAgICAgICBhcnJvd0RpcmVjdGlvbiA9IFwidXBcIjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCAobGVmdCArIHRvb2x0aXBXaWR0aCkpIHtcclxuICAgICAgICB0b29sdGlwLnN0eWxlLnJpZ2h0ID0gZGlzdCArICdweCc7XHJcbiAgICAgICAgbGV0IGVuZFBvc2l0aW9uT25QYWdlID0gdHJpZ2dlclBvc2l0aW9uLnJpZ2h0IC0gKHRyaWdnZXIub2Zmc2V0V2lkdGggLyAyKTtcclxuICAgICAgICBsZXQgdG9vbHRpcEFycm93SGFsZldpZHRoID0gODtcclxuICAgICAgICBsZXQgYXJyb3dSaWdodFBvc2l0aW9uID0gd2luZG93LmlubmVyV2lkdGggLSBlbmRQb3NpdGlvbk9uUGFnZSAtIGRpc3QgLSB0b29sdGlwQXJyb3dIYWxmV2lkdGg7XHJcbiAgICAgICAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uc3R5bGUucmlnaHQgPSBhcnJvd1JpZ2h0UG9zaXRpb24gKyAncHgnO1xyXG4gICAgICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLmxlZnQgPSAnYXV0byc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRvb2x0aXAuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xyXG4gICAgfVxyXG4gICAgdG9vbHRpcC5zdHlsZS50b3AgPSB0b3AgKyBwYWdlWU9mZnNldCArICdweCc7XHJcbiAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5jbGFzc0xpc3QuYWRkKGFycm93RGlyZWN0aW9uKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNsb3NlQWxsVG9vbHRpcHMoZXZlbnQsIGZvcmNlID0gZmFsc2UpIHtcclxuICAgIGlmIChmb3JjZSB8fCAoIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLXRvb2x0aXAnKSAmJiAhZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcCcpICYmICFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sdGlwLWNvbnRlbnQnKSkpIHtcclxuICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudG9vbHRpcC1wb3BwZXInKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCB0cmlnZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2FyaWEtZGVzY3JpYmVkYnk9JyArIGVsZW1lbnRzW2ldLmdldEF0dHJpYnV0ZSgnaWQnKSArICddJyk7XHJcbiAgICAgICAgICAgIHRyaWdnZXIucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHRyaWdnZXIucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1mb2N1cycpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlbGVtZW50c1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjbG9zZUhvdmVyVG9vbHRpcCh0cmlnZ2VyKSB7XHJcbiAgICB2YXIgdG9vbHRpcElkID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgIGxldCB0b29sdGlwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XHJcbiAgICB0b29sdGlwRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgb25Ub29sdGlwSG92ZXIpO1xyXG4gICAgdG9vbHRpcEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIG9uVG9vbHRpcEhvdmVyKTtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCB0b29sdGlwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XHJcbiAgICAgICAgaWYgKHRvb2x0aXBFbGVtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmICghdHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoXCJ0b29sdGlwLWhvdmVyXCIpKSB7XHJcbiAgICAgICAgICAgICAgICByZW1vdmVUb29sdGlwKHRyaWdnZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSwgMzAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25Ub29sdGlwSG92ZXIoZSkge1xyXG4gICAgbGV0IHRvb2x0aXBFbGVtZW50ID0gdGhpcztcclxuXHJcbiAgICBsZXQgdHJpZ2dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWRlc2NyaWJlZGJ5PScgKyB0b29sdGlwRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykgKyAnXScpO1xyXG4gICAgdHJpZ2dlci5jbGFzc0xpc3QuYWRkKCd0b29sdGlwLWhvdmVyJyk7XHJcblxyXG4gICAgdG9vbHRpcEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgdHJpZ2dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWRlc2NyaWJlZGJ5PScgKyB0b29sdGlwRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJykgKyAnXScpO1xyXG4gICAgICAgIGlmICh0cmlnZ2VyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1ob3ZlcicpO1xyXG4gICAgICAgICAgICBjbG9zZUhvdmVyVG9vbHRpcCh0cmlnZ2VyKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlVG9vbHRpcCh0cmlnZ2VyKSB7XHJcbiAgICB2YXIgdG9vbHRpcElkID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgIGxldCB0b29sdGlwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XHJcblxyXG4gICAgaWYgKHRvb2x0aXBJZCAhPT0gbnVsbCAmJiB0b29sdGlwRWxlbWVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodG9vbHRpcEVsZW1lbnQpO1xyXG4gICAgfVxyXG4gICAgdHJpZ2dlci5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1ob3ZlcicpO1xyXG4gICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWZvY3VzJyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVG9vbHRpcDtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgcHJlZml4OiAnJyxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgQWNjb3JkaW9uIGZyb20gJy4vY29tcG9uZW50cy9hY2NvcmRpb24nO1xyXG5pbXBvcnQgQWxlcnQgZnJvbSAnLi9jb21wb25lbnRzL2FsZXJ0JztcclxuaW1wb3J0IEJhY2tUb1RvcCBmcm9tICcuL2NvbXBvbmVudHMvYmFjay10by10b3AnO1xyXG5pbXBvcnQgQ2hhcmFjdGVyTGltaXQgZnJvbSAnLi9jb21wb25lbnRzL2NoYXJhY3Rlci1saW1pdCc7XHJcbmltcG9ydCBDaGVja2JveFRvZ2dsZUNvbnRlbnQgZnJvbSAnLi9jb21wb25lbnRzL2NoZWNrYm94LXRvZ2dsZS1jb250ZW50JztcclxuaW1wb3J0IERyb3Bkb3duIGZyb20gJy4vY29tcG9uZW50cy9kcm9wZG93bic7XHJcbmltcG9ydCBEcm9wZG93blNvcnQgZnJvbSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duLXNvcnQnO1xyXG5pbXBvcnQgRXJyb3JTdW1tYXJ5IGZyb20gJy4vY29tcG9uZW50cy9lcnJvci1zdW1tYXJ5JztcclxuaW1wb3J0IElucHV0UmVnZXhNYXNrIGZyb20gJy4vY29tcG9uZW50cy9yZWdleC1pbnB1dC1tYXNrJztcclxuaW1wb3J0IE1vZGFsIGZyb20gJy4vY29tcG9uZW50cy9tb2RhbCc7XHJcbmltcG9ydCBOYXZpZ2F0aW9uIGZyb20gJy4vY29tcG9uZW50cy9uYXZpZ2F0aW9uJztcclxuaW1wb3J0IFJhZGlvVG9nZ2xlR3JvdXAgZnJvbSAnLi9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50JztcclxuaW1wb3J0IFJlc3BvbnNpdmVUYWJsZSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUnO1xyXG5pbXBvcnQgVGFibmF2IGZyb20gICcuL2NvbXBvbmVudHMvdGFibmF2JztcclxuaW1wb3J0IFRhYmxlU2VsZWN0YWJsZVJvd3MgZnJvbSAnLi9jb21wb25lbnRzL3NlbGVjdGFibGUtdGFibGUnO1xyXG5pbXBvcnQgVG9hc3QgZnJvbSAnLi9jb21wb25lbnRzL3RvYXN0JztcclxuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi9jb21wb25lbnRzL3Rvb2x0aXAnO1xyXG5jb25zdCBkYXRlUGlja2VyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2RhdGUtcGlja2VyJyk7XHJcbi8qKlxyXG4gKiBUaGUgJ3BvbHlmaWxscycgZGVmaW5lIGtleSBFQ01BU2NyaXB0IDUgbWV0aG9kcyB0aGF0IG1heSBiZSBtaXNzaW5nIGZyb21cclxuICogb2xkZXIgYnJvd3NlcnMsIHNvIG11c3QgYmUgbG9hZGVkIGZpcnN0LlxyXG4gKi9cclxucmVxdWlyZSgnLi9wb2x5ZmlsbHMnKTtcclxuXHJcbi8qKlxyXG4gKiBJbml0IGFsbCBjb21wb25lbnRzXHJcbiAqIEBwYXJhbSB7SlNPTn0gb3B0aW9ucyB7c2NvcGU6IEhUTUxFbGVtZW50fSAtIEluaXQgYWxsIGNvbXBvbmVudHMgd2l0aGluIHNjb3BlIChkZWZhdWx0IGlzIGRvY3VtZW50KVxyXG4gKi9cclxudmFyIGluaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gIC8vIFNldCB0aGUgb3B0aW9ucyB0byBhbiBlbXB0eSBvYmplY3QgYnkgZGVmYXVsdCBpZiBubyBvcHRpb25zIGFyZSBwYXNzZWQuXHJcbiAgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMgOiB7fVxyXG5cclxuICAvLyBBbGxvdyB0aGUgdXNlciB0byBpbml0aWFsaXNlIEZEUyBpbiBvbmx5IGNlcnRhaW4gc2VjdGlvbnMgb2YgdGhlIHBhZ2VcclxuICAvLyBEZWZhdWx0cyB0byB0aGUgZW50aXJlIGRvY3VtZW50IGlmIG5vdGhpbmcgaXMgc2V0LlxyXG4gIHZhciBzY29wZSA9IHR5cGVvZiBvcHRpb25zLnNjb3BlICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuc2NvcGUgOiBkb2N1bWVudFxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIEFjY29yZGlvbnNcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JBY2NvcmRpb24gPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhY2NvcmRpb24nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckFjY29yZGlvbi5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQWNjb3JkaW9uKGpzU2VsZWN0b3JBY2NvcmRpb25bIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuICBjb25zdCBqc1NlbGVjdG9yQWNjb3JkaW9uQm9yZGVyZWQgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCcuYWNjb3JkaW9uLWJvcmRlcmVkOm5vdCguYWNjb3JkaW9uKScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQWNjb3JkaW9uQm9yZGVyZWQubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uQm9yZGVyZWRbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBBbGVydHNcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG5cclxuICBjb25zdCBhbGVydHNXaXRoQ2xvc2VCdXR0b24gPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCcuYWxlcnQuaGFzLWNsb3NlJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGFsZXJ0c1dpdGhDbG9zZUJ1dHRvbi5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQWxlcnQoYWxlcnRzV2l0aENsb3NlQnV0dG9uWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQmFjayB0byB0b3AgYnV0dG9uXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuXHJcbiAgY29uc3QgYmFja1RvVG9wQnV0dG9ucyA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2JhY2stdG8tdG9wLWJ1dHRvbicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBiYWNrVG9Ub3BCdXR0b25zLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBCYWNrVG9Ub3AoYmFja1RvVG9wQnV0dG9uc1sgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIENoYXJhY3RlciBsaW1pdFxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNDaGFyYWN0ZXJMaW1pdCA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Zvcm0tbGltaXQnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNDaGFyYWN0ZXJMaW1pdC5sZW5ndGg7IGMrKyl7XHJcblxyXG4gICAgbmV3IENoYXJhY3RlckxpbWl0KGpzQ2hhcmFjdGVyTGltaXRbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuICBcclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIENoZWNrYm94IGNvbGxhcHNlXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZSA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWNoZWNrYm94LXRvZ2dsZS1jb250ZW50Jyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBDaGVja2JveFRvZ2dsZUNvbnRlbnQoanNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2VbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBPdmVyZmxvdyBtZW51XHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yRHJvcGRvd24gPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1kcm9wZG93bicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yRHJvcGRvd24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IERyb3Bkb3duKGpzU2VsZWN0b3JEcm9wZG93blsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBcclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIE92ZXJmbG93IG1lbnUgc29ydFxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvckRyb3Bkb3duU29ydCA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ292ZXJmbG93LW1lbnUtLXNvcnQnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckRyb3Bkb3duU29ydC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgRHJvcGRvd25Tb3J0KGpzU2VsZWN0b3JEcm9wZG93blNvcnRbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBEYXRlcGlja2VyXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBkYXRlUGlja2VyLm9uKHNjb3BlKTtcclxuICBcclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIEVycm9yIHN1bW1hcnlcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIHZhciAkZXJyb3JTdW1tYXJ5ID0gc2NvcGUucXVlcnlTZWxlY3RvcignW2RhdGEtbW9kdWxlPVwiZXJyb3Itc3VtbWFyeVwiXScpO1xyXG4gIG5ldyBFcnJvclN1bW1hcnkoJGVycm9yU3VtbWFyeSkuaW5pdCgpO1xyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIElucHV0IFJlZ2V4IC0gdXNlZCBvbiBkYXRlIGZpZWxkc1xyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclJlZ2V4ID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbZGF0YS1pbnB1dC1yZWdleF0nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclJlZ2V4Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBJbnB1dFJlZ2V4TWFzayhqc1NlbGVjdG9yUmVnZXhbIGMgXSk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIE1vZGFsXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBtb2RhbHMgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCcuZmRzLW1vZGFsJyk7XHJcbiAgZm9yKGxldCBkID0gMDsgZCA8IG1vZGFscy5sZW5ndGg7IGQrKykge1xyXG4gICAgbmV3IE1vZGFsKG1vZGFsc1tkXSkuaW5pdCgpO1xyXG4gIH1cclxuICBcclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIE5hdmlnYXRpb25cclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIG5ldyBOYXZpZ2F0aW9uKCkuaW5pdCgpO1xyXG4gICBcclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFJhZGlvYnV0dG9uIGdyb3VwIGNvbGxhcHNlXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yUmFkaW9Db2xsYXBzZSA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXJhZGlvLXRvZ2dsZS1ncm91cCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yUmFkaW9Db2xsYXBzZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgUmFkaW9Ub2dnbGVHcm91cChqc1NlbGVjdG9yUmFkaW9Db2xsYXBzZVsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFJlc3BvbnNpdmUgdGFibGVzXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yVGFibGUgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZTpub3QoLmRhdGFUYWJsZSknKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRhYmxlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBSZXNwb25zaXZlVGFibGUoanNTZWxlY3RvclRhYmxlWyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBTZWxlY3RhYmxlIHJvd3MgaW4gdGFibGVcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0YWJsZVRhYmxlID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgndGFibGUudGFibGUtLXNlbGVjdGFibGUnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RhYmxlVGFibGUubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFRhYmxlU2VsZWN0YWJsZVJvd3MoanNTZWxlY3RhYmxlVGFibGVbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBUYWJuYXZcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JUYWJuYXYgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWJuYXYnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRhYm5hdi5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVGFibmF2KGpzU2VsZWN0b3JUYWJuYXZbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBUb29sdGlwXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yVG9vbHRpcCA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXRvb2x0aXAnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRvb2x0aXAubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFRvb2x0aXAoanNTZWxlY3RvclRvb2x0aXBbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuICBcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0geyBpbml0LCBBY2NvcmRpb24sIEFsZXJ0LCBCYWNrVG9Ub3AsIENoYXJhY3RlckxpbWl0LCBDaGVja2JveFRvZ2dsZUNvbnRlbnQsIERyb3Bkb3duLCBEcm9wZG93blNvcnQsIGRhdGVQaWNrZXIsIEVycm9yU3VtbWFyeSwgSW5wdXRSZWdleE1hc2ssIE1vZGFsLCBOYXZpZ2F0aW9uLCBSYWRpb1RvZ2dsZUdyb3VwLCBSZXNwb25zaXZlVGFibGUsIFRhYmxlU2VsZWN0YWJsZVJvd3MsIFRhYm5hdiwgVG9hc3QsIFRvb2x0aXB9OyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIC8vIFRoaXMgdXNlZCB0byBiZSBjb25kaXRpb25hbGx5IGRlcGVuZGVudCBvbiB3aGV0aGVyIHRoZVxyXG4gIC8vIGJyb3dzZXIgc3VwcG9ydGVkIHRvdWNoIGV2ZW50czsgaWYgaXQgZGlkLCBgQ0xJQ0tgIHdhcyBzZXQgdG9cclxuICAvLyBgdG91Y2hzdGFydGAuICBIb3dldmVyLCB0aGlzIGhhZCBkb3duc2lkZXM6XHJcbiAgLy9cclxuICAvLyAqIEl0IHByZS1lbXB0ZWQgbW9iaWxlIGJyb3dzZXJzJyBkZWZhdWx0IGJlaGF2aW9yIG9mIGRldGVjdGluZ1xyXG4gIC8vICAgd2hldGhlciBhIHRvdWNoIHR1cm5lZCBpbnRvIGEgc2Nyb2xsLCB0aGVyZWJ5IHByZXZlbnRpbmdcclxuICAvLyAgIHVzZXJzIGZyb20gdXNpbmcgc29tZSBvZiBvdXIgY29tcG9uZW50cyBhcyBzY3JvbGwgc3VyZmFjZXMuXHJcbiAgLy9cclxuICAvLyAqIFNvbWUgZGV2aWNlcywgc3VjaCBhcyB0aGUgTWljcm9zb2Z0IFN1cmZhY2UgUHJvLCBzdXBwb3J0ICpib3RoKlxyXG4gIC8vICAgdG91Y2ggYW5kIGNsaWNrcy4gVGhpcyBtZWFudCB0aGUgY29uZGl0aW9uYWwgZWZmZWN0aXZlbHkgZHJvcHBlZFxyXG4gIC8vICAgc3VwcG9ydCBmb3IgdGhlIHVzZXIncyBtb3VzZSwgZnJ1c3RyYXRpbmcgdXNlcnMgd2hvIHByZWZlcnJlZFxyXG4gIC8vICAgaXQgb24gdGhvc2Ugc3lzdGVtcy5cclxuICBDTElDSzogJ2NsaWNrJyxcclxufTtcclxuIiwiaW1wb3J0ICcuLi8uLi9PYmplY3QvZGVmaW5lUHJvcGVydHknXHJcblxyXG4oZnVuY3Rpb24odW5kZWZpbmVkKSB7XHJcbiAgLy8gRGV0ZWN0aW9uIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0ZpbmFuY2lhbC1UaW1lcy9wb2x5ZmlsbC1zZXJ2aWNlL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL3BvbHlmaWxsLWxpYnJhcnkvcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kL2RldGVjdC5qc1xyXG4gIHZhciBkZXRlY3QgPSAnYmluZCcgaW4gRnVuY3Rpb24ucHJvdG90eXBlXHJcblxyXG4gIGlmIChkZXRlY3QpIHJldHVyblxyXG5cclxuICAvLyBQb2x5ZmlsbCBmcm9tIGh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLmpzP2ZlYXR1cmVzPUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kJmZsYWdzPWFsd2F5c1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdW5jdGlvbi5wcm90b3R5cGUsICdiaW5kJywge1xyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYmluZCh0aGF0KSB7IC8vIC5sZW5ndGggaXMgMVxyXG4gICAgICAgICAgLy8gYWRkIG5lY2Vzc2FyeSBlczUtc2hpbSB1dGlsaXRpZXNcclxuICAgICAgICAgIHZhciAkQXJyYXkgPSBBcnJheTtcclxuICAgICAgICAgIHZhciAkT2JqZWN0ID0gT2JqZWN0O1xyXG4gICAgICAgICAgdmFyIE9iamVjdFByb3RvdHlwZSA9ICRPYmplY3QucHJvdG90eXBlO1xyXG4gICAgICAgICAgdmFyIEFycmF5UHJvdG90eXBlID0gJEFycmF5LnByb3RvdHlwZTtcclxuICAgICAgICAgIHZhciBFbXB0eSA9IGZ1bmN0aW9uIEVtcHR5KCkge307XHJcbiAgICAgICAgICB2YXIgdG9fc3RyaW5nID0gT2JqZWN0UHJvdG90eXBlLnRvU3RyaW5nO1xyXG4gICAgICAgICAgdmFyIGhhc1RvU3RyaW5nVGFnID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJztcclxuICAgICAgICAgIHZhciBpc0NhbGxhYmxlOyAvKiBpbmxpbmVkIGZyb20gaHR0cHM6Ly9ucG1qcy5jb20vaXMtY2FsbGFibGUgKi8gdmFyIGZuVG9TdHIgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcsIHRyeUZ1bmN0aW9uT2JqZWN0ID0gZnVuY3Rpb24gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpIHsgdHJ5IHsgZm5Ub1N0ci5jYWxsKHZhbHVlKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH0sIGZuQ2xhc3MgPSAnW29iamVjdCBGdW5jdGlvbl0nLCBnZW5DbGFzcyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSc7IGlzQ2FsbGFibGUgPSBmdW5jdGlvbiBpc0NhbGxhYmxlKHZhbHVlKSB7IGlmICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIGZhbHNlOyB9IGlmIChoYXNUb1N0cmluZ1RhZykgeyByZXR1cm4gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpOyB9IHZhciBzdHJDbGFzcyA9IHRvX3N0cmluZy5jYWxsKHZhbHVlKTsgcmV0dXJuIHN0ckNsYXNzID09PSBmbkNsYXNzIHx8IHN0ckNsYXNzID09PSBnZW5DbGFzczsgfTtcclxuICAgICAgICAgIHZhciBhcnJheV9zbGljZSA9IEFycmF5UHJvdG90eXBlLnNsaWNlO1xyXG4gICAgICAgICAgdmFyIGFycmF5X2NvbmNhdCA9IEFycmF5UHJvdG90eXBlLmNvbmNhdDtcclxuICAgICAgICAgIHZhciBhcnJheV9wdXNoID0gQXJyYXlQcm90b3R5cGUucHVzaDtcclxuICAgICAgICAgIHZhciBtYXggPSBNYXRoLm1heDtcclxuICAgICAgICAgIC8vIC9hZGQgbmVjZXNzYXJ5IGVzNS1zaGltIHV0aWxpdGllc1xyXG5cclxuICAgICAgICAgIC8vIDEuIExldCBUYXJnZXQgYmUgdGhlIHRoaXMgdmFsdWUuXHJcbiAgICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcztcclxuICAgICAgICAgIC8vIDIuIElmIElzQ2FsbGFibGUoVGFyZ2V0KSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxyXG4gICAgICAgICAgaWYgKCFpc0NhbGxhYmxlKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBjYWxsZWQgb24gaW5jb21wYXRpYmxlICcgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gMy4gTGV0IEEgYmUgYSBuZXcgKHBvc3NpYmx5IGVtcHR5KSBpbnRlcm5hbCBsaXN0IG9mIGFsbCBvZiB0aGVcclxuICAgICAgICAgIC8vICAgYXJndW1lbnQgdmFsdWVzIHByb3ZpZGVkIGFmdGVyIHRoaXNBcmcgKGFyZzEsIGFyZzIgZXRjKSwgaW4gb3JkZXIuXHJcbiAgICAgICAgICAvLyBYWFggc2xpY2VkQXJncyB3aWxsIHN0YW5kIGluIGZvciBcIkFcIiBpZiB1c2VkXHJcbiAgICAgICAgICB2YXIgYXJncyA9IGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTsgLy8gZm9yIG5vcm1hbCBjYWxsXHJcbiAgICAgICAgICAvLyA0LiBMZXQgRiBiZSBhIG5ldyBuYXRpdmUgRUNNQVNjcmlwdCBvYmplY3QuXHJcbiAgICAgICAgICAvLyAxMS4gU2V0IHRoZSBbW1Byb3RvdHlwZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdGhlIHN0YW5kYXJkXHJcbiAgICAgICAgICAvLyAgIGJ1aWx0LWluIEZ1bmN0aW9uIHByb3RvdHlwZSBvYmplY3QgYXMgc3BlY2lmaWVkIGluIDE1LjMuMy4xLlxyXG4gICAgICAgICAgLy8gMTIuIFNldCB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cclxuICAgICAgICAgIC8vICAgMTUuMy40LjUuMS5cclxuICAgICAgICAgIC8vIDEzLiBTZXQgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cclxuICAgICAgICAgIC8vICAgMTUuMy40LjUuMi5cclxuICAgICAgICAgIC8vIDE0LiBTZXQgdGhlIFtbSGFzSW5zdGFuY2VdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxyXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4zLlxyXG4gICAgICAgICAgdmFyIGJvdW5kO1xyXG4gICAgICAgICAgdmFyIGJpbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAvLyAxNS4zLjQuNS4yIFtbQ29uc3RydWN0XV1cclxuICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsXHJcbiAgICAgICAgICAgICAgICAgIC8vIEYgdGhhdCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgYmluZCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhXHJcbiAgICAgICAgICAgICAgICAgIC8vIGxpc3Qgb2YgYXJndW1lbnRzIEV4dHJhQXJncywgdGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XHJcbiAgICAgICAgICAgICAgICAgIC8vIDEuIExldCB0YXJnZXQgYmUgdGhlIHZhbHVlIG9mIEYncyBbW1RhcmdldEZ1bmN0aW9uXV1cclxuICAgICAgICAgICAgICAgICAgLy8gICBpbnRlcm5hbCBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgLy8gMi4gSWYgdGFyZ2V0IGhhcyBubyBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCwgYVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIFR5cGVFcnJvciBleGNlcHRpb24gaXMgdGhyb3duLlxyXG4gICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIGxpc3QgYm91bmRBcmdzIGluIHRoZSBzYW1lIG9yZGVyIGZvbGxvd2VkIGJ5IHRoZSBzYW1lXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgdmFsdWVzIGFzIHRoZSBsaXN0IEV4dHJhQXJncyBpbiB0aGUgc2FtZSBvcmRlci5cclxuICAgICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIG1ldGhvZCBvZiB0YXJnZXQgcHJvdmlkaW5nIGFyZ3MgYXMgdGhlIGFyZ3VtZW50cy5cclxuXHJcbiAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0YXJnZXQuYXBwbHkoXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYXJyYXlfY29uY2F0LmNhbGwoYXJncywgYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMpKVxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoJE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjEgW1tDYWxsXV1cclxuICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mIGEgZnVuY3Rpb24gb2JqZWN0LCBGLFxyXG4gICAgICAgICAgICAgICAgICAvLyB3aGljaCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgYmluZCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhXHJcbiAgICAgICAgICAgICAgICAgIC8vIHRoaXMgdmFsdWUgYW5kIGEgbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nXHJcbiAgICAgICAgICAgICAgICAgIC8vIHN0ZXBzIGFyZSB0YWtlbjpcclxuICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IGJvdW5kQXJncyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRBcmdzXV0gaW50ZXJuYWxcclxuICAgICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgLy8gMi4gTGV0IGJvdW5kVGhpcyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRUaGlzXV0gaW50ZXJuYWxcclxuICAgICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgLy8gMy4gTGV0IHRhcmdldCBiZSB0aGUgdmFsdWUgb2YgRidzIFtbVGFyZ2V0RnVuY3Rpb25dXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIGxpc3QgYm91bmRBcmdzIGluIHRoZSBzYW1lIG9yZGVyIGZvbGxvd2VkIGJ5IHRoZSBzYW1lXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgdmFsdWVzIGFzIHRoZSBsaXN0IEV4dHJhQXJncyBpbiB0aGUgc2FtZSBvcmRlci5cclxuICAgICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgb2YgdGFyZ2V0IHByb3ZpZGluZyBib3VuZFRoaXMgYXMgdGhlIHRoaXMgdmFsdWUgYW5kXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvdmlkaW5nIGFyZ3MgYXMgdGhlIGFyZ3VtZW50cy5cclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIGVxdWl2OiB0YXJnZXQuY2FsbCh0aGlzLCAuLi5ib3VuZEFyZ3MsIC4uLmFyZ3MpXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuYXBwbHkoXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGF0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgYXJyYXlfY29uY2F0LmNhbGwoYXJncywgYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMpKVxyXG4gICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAvLyAxNS4gSWYgdGhlIFtbQ2xhc3NdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBUYXJnZXQgaXMgXCJGdW5jdGlvblwiLCB0aGVuXHJcbiAgICAgICAgICAvLyAgICAgYS4gTGV0IEwgYmUgdGhlIGxlbmd0aCBwcm9wZXJ0eSBvZiBUYXJnZXQgbWludXMgdGhlIGxlbmd0aCBvZiBBLlxyXG4gICAgICAgICAgLy8gICAgIGIuIFNldCB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIGVpdGhlciAwIG9yIEwsIHdoaWNoZXZlciBpc1xyXG4gICAgICAgICAgLy8gICAgICAgbGFyZ2VyLlxyXG4gICAgICAgICAgLy8gMTYuIEVsc2Ugc2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gMC5cclxuXHJcbiAgICAgICAgICB2YXIgYm91bmRMZW5ndGggPSBtYXgoMCwgdGFyZ2V0Lmxlbmd0aCAtIGFyZ3MubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAvLyAxNy4gU2V0IHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gdGhlIHZhbHVlc1xyXG4gICAgICAgICAgLy8gICBzcGVjaWZpZWQgaW4gMTUuMy41LjEuXHJcbiAgICAgICAgICB2YXIgYm91bmRBcmdzID0gW107XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvdW5kTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICBhcnJheV9wdXNoLmNhbGwoYm91bmRBcmdzLCAnJCcgKyBpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBYWFggQnVpbGQgYSBkeW5hbWljIGZ1bmN0aW9uIHdpdGggZGVzaXJlZCBhbW91bnQgb2YgYXJndW1lbnRzIGlzIHRoZSBvbmx5XHJcbiAgICAgICAgICAvLyB3YXkgdG8gc2V0IHRoZSBsZW5ndGggcHJvcGVydHkgb2YgYSBmdW5jdGlvbi5cclxuICAgICAgICAgIC8vIEluIGVudmlyb25tZW50cyB3aGVyZSBDb250ZW50IFNlY3VyaXR5IFBvbGljaWVzIGVuYWJsZWQgKENocm9tZSBleHRlbnNpb25zLFxyXG4gICAgICAgICAgLy8gZm9yIGV4LikgYWxsIHVzZSBvZiBldmFsIG9yIEZ1bmN0aW9uIGNvc3RydWN0b3IgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cclxuICAgICAgICAgIC8vIEhvd2V2ZXIgaW4gYWxsIG9mIHRoZXNlIGVudmlyb25tZW50cyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBleGlzdHNcclxuICAgICAgICAgIC8vIGFuZCBzbyB0aGlzIGNvZGUgd2lsbCBuZXZlciBiZSBleGVjdXRlZC5cclxuICAgICAgICAgIGJvdW5kID0gRnVuY3Rpb24oJ2JpbmRlcicsICdyZXR1cm4gZnVuY3Rpb24gKCcgKyBib3VuZEFyZ3Muam9pbignLCcpICsgJyl7IHJldHVybiBiaW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfScpKGJpbmRlcik7XHJcblxyXG4gICAgICAgICAgaWYgKHRhcmdldC5wcm90b3R5cGUpIHtcclxuICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSB0YXJnZXQucHJvdG90eXBlO1xyXG4gICAgICAgICAgICAgIGJvdW5kLnByb3RvdHlwZSA9IG5ldyBFbXB0eSgpO1xyXG4gICAgICAgICAgICAgIC8vIENsZWFuIHVwIGRhbmdsaW5nIHJlZmVyZW5jZXMuXHJcbiAgICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gbnVsbDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvLyAxOC4gU2V0IHRoZSBbW0V4dGVuc2libGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIHRvIHRydWUuXHJcblxyXG4gICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgLy8gMTkuIExldCB0aHJvd2VyIGJlIHRoZSBbW1Rocm93VHlwZUVycm9yXV0gZnVuY3Rpb24gT2JqZWN0ICgxMy4yLjMpLlxyXG4gICAgICAgICAgLy8gMjAuIENhbGwgdGhlIFtbRGVmaW5lT3duUHJvcGVydHldXSBpbnRlcm5hbCBtZXRob2Qgb2YgRiB3aXRoXHJcbiAgICAgICAgICAvLyAgIGFyZ3VtZW50cyBcImNhbGxlclwiLCBQcm9wZXJ0eURlc2NyaXB0b3Ige1tbR2V0XV06IHRocm93ZXIsIFtbU2V0XV06XHJcbiAgICAgICAgICAvLyAgIHRocm93ZXIsIFtbRW51bWVyYWJsZV1dOiBmYWxzZSwgW1tDb25maWd1cmFibGVdXTogZmFsc2V9LCBhbmRcclxuICAgICAgICAgIC8vICAgZmFsc2UuXHJcbiAgICAgICAgICAvLyAyMS4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcclxuICAgICAgICAgIC8vICAgYXJndW1lbnRzIFwiYXJndW1lbnRzXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlcixcclxuICAgICAgICAgIC8vICAgW1tTZXRdXTogdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sXHJcbiAgICAgICAgICAvLyAgIGFuZCBmYWxzZS5cclxuXHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvLyBOT1RFIEZ1bmN0aW9uIG9iamVjdHMgY3JlYXRlZCB1c2luZyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBkbyBub3RcclxuICAgICAgICAgIC8vIGhhdmUgYSBwcm90b3R5cGUgcHJvcGVydHkgb3IgdGhlIFtbQ29kZV1dLCBbW0Zvcm1hbFBhcmFtZXRlcnNdXSwgYW5kXHJcbiAgICAgICAgICAvLyBbW1Njb3BlXV0gaW50ZXJuYWwgcHJvcGVydGllcy5cclxuICAgICAgICAgIC8vIFhYWCBjYW4ndCBkZWxldGUgcHJvdG90eXBlIGluIHB1cmUtanMuXHJcblxyXG4gICAgICAgICAgLy8gMjIuIFJldHVybiBGLlxyXG4gICAgICAgICAgcmV0dXJuIGJvdW5kO1xyXG4gICAgICB9XHJcbiAgfSk7XHJcbn0pXHJcbi5jYWxsKCdvYmplY3QnID09PSB0eXBlb2Ygd2luZG93ICYmIHdpbmRvdyB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIHNlbGYgJiYgc2VsZiB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIGdsb2JhbCAmJiBnbG9iYWwgfHwge30pO1xyXG4iLCIoZnVuY3Rpb24odW5kZWZpbmVkKSB7XHJcblxyXG4vLyBEZXRlY3Rpb24gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLXNlcnZpY2UvYmxvYi9tYXN0ZXIvcGFja2FnZXMvcG9seWZpbGwtbGlicmFyeS9wb2x5ZmlsbHMvT2JqZWN0L2RlZmluZVByb3BlcnR5L2RldGVjdC5qc1xyXG52YXIgZGV0ZWN0ID0gKFxyXG4gIC8vIEluIElFOCwgZGVmaW5lUHJvcGVydHkgY291bGQgb25seSBhY3Qgb24gRE9NIGVsZW1lbnRzLCBzbyBmdWxsIHN1cHBvcnRcclxuICAvLyBmb3IgdGhlIGZlYXR1cmUgcmVxdWlyZXMgdGhlIGFiaWxpdHkgdG8gc2V0IGEgcHJvcGVydHkgb24gYW4gYXJiaXRyYXJ5IG9iamVjdFxyXG4gICdkZWZpbmVQcm9wZXJ0eScgaW4gT2JqZWN0ICYmIChmdW5jdGlvbigpIHtcclxuICBcdHRyeSB7XHJcbiAgXHRcdHZhciBhID0ge307XHJcbiAgXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhLCAndGVzdCcsIHt2YWx1ZTo0Mn0pO1xyXG4gIFx0XHRyZXR1cm4gdHJ1ZTtcclxuICBcdH0gY2F0Y2goZSkge1xyXG4gIFx0XHRyZXR1cm4gZmFsc2VcclxuICBcdH1cclxuICB9KCkpXHJcbilcclxuXHJcbmlmIChkZXRlY3QpIHJldHVyblxyXG5cclxuLy8gUG9seWZpbGwgZnJvbSBodHRwczovL2Nkbi5wb2x5ZmlsbC5pby92Mi9wb2x5ZmlsbC5qcz9mZWF0dXJlcz1PYmplY3QuZGVmaW5lUHJvcGVydHkmZmxhZ3M9YWx3YXlzXHJcbihmdW5jdGlvbiAobmF0aXZlRGVmaW5lUHJvcGVydHkpIHtcclxuXHJcblx0dmFyIHN1cHBvcnRzQWNjZXNzb3JzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSgnX19kZWZpbmVHZXR0ZXJfXycpO1xyXG5cdHZhciBFUlJfQUNDRVNTT1JTX05PVF9TVVBQT1JURUQgPSAnR2V0dGVycyAmIHNldHRlcnMgY2Fubm90IGJlIGRlZmluZWQgb24gdGhpcyBqYXZhc2NyaXB0IGVuZ2luZSc7XHJcblx0dmFyIEVSUl9WQUxVRV9BQ0NFU1NPUlMgPSAnQSBwcm9wZXJ0eSBjYW5ub3QgYm90aCBoYXZlIGFjY2Vzc29ycyBhbmQgYmUgd3JpdGFibGUgb3IgaGF2ZSBhIHZhbHVlJztcclxuXHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvcikge1xyXG5cclxuXHRcdC8vIFdoZXJlIG5hdGl2ZSBzdXBwb3J0IGV4aXN0cywgYXNzdW1lIGl0XHJcblx0XHRpZiAobmF0aXZlRGVmaW5lUHJvcGVydHkgJiYgKG9iamVjdCA9PT0gd2luZG93IHx8IG9iamVjdCA9PT0gZG9jdW1lbnQgfHwgb2JqZWN0ID09PSBFbGVtZW50LnByb3RvdHlwZSB8fCBvYmplY3QgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xyXG5cdFx0XHRyZXR1cm4gbmF0aXZlRGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG9iamVjdCA9PT0gbnVsbCB8fCAhKG9iamVjdCBpbnN0YW5jZW9mIE9iamVjdCB8fCB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JykpIHtcclxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEoZGVzY3JpcHRvciBpbnN0YW5jZW9mIE9iamVjdCkpIHtcclxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3QnKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgcHJvcGVydHlTdHJpbmcgPSBTdHJpbmcocHJvcGVydHkpO1xyXG5cdFx0dmFyIGhhc1ZhbHVlT3JXcml0YWJsZSA9ICd2YWx1ZScgaW4gZGVzY3JpcHRvciB8fCAnd3JpdGFibGUnIGluIGRlc2NyaXB0b3I7XHJcblx0XHR2YXIgZ2V0dGVyVHlwZSA9ICdnZXQnIGluIGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3IuZ2V0O1xyXG5cdFx0dmFyIHNldHRlclR5cGUgPSAnc2V0JyBpbiBkZXNjcmlwdG9yICYmIHR5cGVvZiBkZXNjcmlwdG9yLnNldDtcclxuXHJcblx0XHQvLyBoYW5kbGUgZGVzY3JpcHRvci5nZXRcclxuXHRcdGlmIChnZXR0ZXJUeXBlKSB7XHJcblx0XHRcdGlmIChnZXR0ZXJUeXBlICE9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignR2V0dGVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghc3VwcG9ydHNBY2Nlc3NvcnMpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGhhc1ZhbHVlT3JXcml0YWJsZSkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX1ZBTFVFX0FDQ0VTU09SUyk7XHJcblx0XHRcdH1cclxuXHRcdFx0T2JqZWN0Ll9fZGVmaW5lR2V0dGVyX18uY2FsbChvYmplY3QsIHByb3BlcnR5U3RyaW5nLCBkZXNjcmlwdG9yLmdldCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRvYmplY3RbcHJvcGVydHlTdHJpbmddID0gZGVzY3JpcHRvci52YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBoYW5kbGUgZGVzY3JpcHRvci5zZXRcclxuXHRcdGlmIChzZXR0ZXJUeXBlKSB7XHJcblx0XHRcdGlmIChzZXR0ZXJUeXBlICE9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignU2V0dGVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghc3VwcG9ydHNBY2Nlc3NvcnMpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGhhc1ZhbHVlT3JXcml0YWJsZSkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX1ZBTFVFX0FDQ0VTU09SUyk7XHJcblx0XHRcdH1cclxuXHRcdFx0T2JqZWN0Ll9fZGVmaW5lU2V0dGVyX18uY2FsbChvYmplY3QsIHByb3BlcnR5U3RyaW5nLCBkZXNjcmlwdG9yLnNldCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gT0sgdG8gZGVmaW5lIHZhbHVlIHVuY29uZGl0aW9uYWxseSAtIGlmIGEgZ2V0dGVyIGhhcyBiZWVuIHNwZWNpZmllZCBhcyB3ZWxsLCBhbiBlcnJvciB3b3VsZCBiZSB0aHJvd24gYWJvdmVcclxuXHRcdGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIHtcclxuXHRcdFx0b2JqZWN0W3Byb3BlcnR5U3RyaW5nXSA9IGRlc2NyaXB0b3IudmFsdWU7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG9iamVjdDtcclxuXHR9O1xyXG59KE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkpO1xyXG59KVxyXG4uY2FsbCgnb2JqZWN0JyA9PT0gdHlwZW9mIHdpbmRvdyAmJiB3aW5kb3cgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBzZWxmICYmIHNlbGYgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBnbG9iYWwgJiYgZ2xvYmFsIHx8IHt9KTtcclxuIiwiLyogZXNsaW50LWRpc2FibGUgY29uc2lzdGVudC1yZXR1cm4gKi9cclxuLyogZXNsaW50LWRpc2FibGUgZnVuYy1uYW1lcyAqL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIF9wYXJhbXMpIHtcclxuICAgIGNvbnN0IHBhcmFtcyA9IF9wYXJhbXMgfHwge1xyXG4gICAgICBidWJibGVzOiBmYWxzZSxcclxuICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXHJcbiAgICAgIGRldGFpbDogbnVsbCxcclxuICAgIH07XHJcbiAgICBjb25zdCBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIkN1c3RvbUV2ZW50XCIpO1xyXG4gICAgZXZ0LmluaXRDdXN0b21FdmVudChcclxuICAgICAgZXZlbnQsXHJcbiAgICAgIHBhcmFtcy5idWJibGVzLFxyXG4gICAgICBwYXJhbXMuY2FuY2VsYWJsZSxcclxuICAgICAgcGFyYW1zLmRldGFpbFxyXG4gICAgKTtcclxuICAgIHJldHVybiBldnQ7XHJcbiAgfVxyXG5cclxuICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcclxufSkoKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBlbHByb3RvID0gd2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZTtcclxuY29uc3QgSElEREVOID0gJ2hpZGRlbic7XHJcblxyXG5pZiAoIShISURERU4gaW4gZWxwcm90bykpIHtcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxwcm90bywgSElEREVOLCB7XHJcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEhJRERFTik7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoSElEREVOLCAnJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NMaXN0IGFuZCBET01Ub2tlbkxpc3RcclxucmVxdWlyZSgnY2xhc3NsaXN0LXBvbHlmaWxsJyk7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZGVuXHJcbnJlcXVpcmUoJy4vZWxlbWVudC1oaWRkZW4nKTtcclxuXHJcbi8vIHBvbHlmaWxscyBOdW1iZXIuaXNOYU4oKVxyXG5yZXF1aXJlKFwiLi9udW1iZXItaXMtbmFuXCIpO1xyXG5cclxuLy8gcG9seWZpbGxzIEN1c3RvbUV2ZW50XHJcbnJlcXVpcmUoXCIuL2N1c3RvbS1ldmVudFwiKTtcclxuXHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vb2JqZWN0L2Fzc2lnbicpO1xyXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL2FycmF5L2Zyb20nKTsiLCJOdW1iZXIuaXNOYU4gPVxyXG4gIE51bWJlci5pc05hTiB8fFxyXG4gIGZ1bmN0aW9uIGlzTmFOKGlucHV0KSB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXHJcbiAgICByZXR1cm4gdHlwZW9mIGlucHV0ID09PSBcIm51bWJlclwiICYmIGlucHV0ICE9PSBpbnB1dDtcclxuICB9O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChodG1sRG9jdW1lbnQgPSBkb2N1bWVudCkgPT4gaHRtbERvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiIsImNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoXCJvYmplY3QtYXNzaWduXCIpO1xyXG5jb25zdCByZWNlcHRvciA9IHJlcXVpcmUoXCJyZWNlcHRvclwiKTtcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBzZXF1ZW5jZVxyXG4gKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBzZXEgYW4gYXJyYXkgb2YgZnVuY3Rpb25zXHJcbiAqIEByZXR1cm4geyBjbG9zdXJlIH0gY2FsbEhvb2tzXHJcbiAqL1xyXG4vLyBXZSB1c2UgYSBuYW1lZCBmdW5jdGlvbiBoZXJlIGJlY2F1c2Ugd2Ugd2FudCBpdCB0byBpbmhlcml0IGl0cyBsZXhpY2FsIHNjb3BlXHJcbi8vIGZyb20gdGhlIGJlaGF2aW9yIHByb3BzIG9iamVjdCwgbm90IGZyb20gdGhlIG1vZHVsZVxyXG5jb25zdCBzZXF1ZW5jZSA9ICguLi5zZXEpID0+XHJcbiAgZnVuY3Rpb24gY2FsbEhvb2tzKHRhcmdldCA9IGRvY3VtZW50LmJvZHkpIHtcclxuICAgIHNlcS5mb3JFYWNoKChtZXRob2QpID0+IHtcclxuICAgICAgaWYgKHR5cGVvZiB0aGlzW21ldGhvZF0gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIHRoaXNbbWV0aG9kXS5jYWxsKHRoaXMsIHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4vKipcclxuICogQG5hbWUgYmVoYXZpb3JcclxuICogQHBhcmFtIHtvYmplY3R9IGV2ZW50c1xyXG4gKiBAcGFyYW0ge29iamVjdD99IHByb3BzXHJcbiAqIEByZXR1cm4ge3JlY2VwdG9yLmJlaGF2aW9yfVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoZXZlbnRzLCBwcm9wcykgPT5cclxuICByZWNlcHRvci5iZWhhdmlvcihcclxuICAgIGV2ZW50cyxcclxuICAgIGFzc2lnbihcclxuICAgICAge1xyXG4gICAgICAgIG9uOiBzZXF1ZW5jZShcImluaXRcIiwgXCJhZGRcIiksXHJcbiAgICAgICAgb2ZmOiBzZXF1ZW5jZShcInRlYXJkb3duXCIsIFwicmVtb3ZlXCIpLFxyXG4gICAgICB9LFxyXG4gICAgICBwcm9wc1xyXG4gICAgKVxyXG4gICk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubGV0IGJyZWFrcG9pbnRzID0ge1xyXG4gICd4cyc6IDAsXHJcbiAgJ3NtJzogNTc2LFxyXG4gICdtZCc6IDc2OCxcclxuICAnbGcnOiA5OTIsXHJcbiAgJ3hsJzogMTIwMFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBicmVha3BvaW50cztcclxuIiwiLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzNcclxuZnVuY3Rpb24gaXNFbGVtZW50SW5WaWV3cG9ydCAoZWwsIHdpbj13aW5kb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICByZWN0LnRvcCA+PSAwICYmXHJcbiAgICByZWN0LmxlZnQgPj0gMCAmJlxyXG4gICAgcmVjdC5ib3R0b20gPD0gKHdpbi5pbm5lckhlaWdodCB8fCBkb2NFbC5jbGllbnRIZWlnaHQpICYmXHJcbiAgICByZWN0LnJpZ2h0IDw9ICh3aW4uaW5uZXJXaWR0aCB8fCBkb2NFbC5jbGllbnRXaWR0aClcclxuICApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudEluVmlld3BvcnQ7XHJcbiIsIi8vIGlPUyBkZXRlY3Rpb24gZnJvbTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTAzOTg4NS8xNzc3MTBcclxuZnVuY3Rpb24gaXNJb3NEZXZpY2UoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oaVBvZHxpUGhvbmV8aVBhZCkvZykgfHxcclxuICAgICAgKG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gXCJNYWNJbnRlbFwiICYmIG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDEpKSAmJlxyXG4gICAgIXdpbmRvdy5NU1N0cmVhbVxyXG4gICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaXNJb3NEZXZpY2U7XHJcbiIsIi8qKlxyXG4gKiBAbmFtZSBpc0VsZW1lbnRcclxuICogQGRlc2MgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudC5cclxuICogQHBhcmFtIHthbnl9IHZhbHVlXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VsZW1lbnQgPSAodmFsdWUpID0+XHJcbiAgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlLm5vZGVUeXBlID09PSAxO1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIHNlbGVjdFxyXG4gKiBAZGVzYyBzZWxlY3RzIGVsZW1lbnRzIGZyb20gdGhlIERPTSBieSBjbGFzcyBzZWxlY3RvciBvciBJRCBzZWxlY3Rvci5cclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gVGhlIHNlbGVjdG9yIHRvIHRyYXZlcnNlIHRoZSBET00gd2l0aC5cclxuICogQHBhcmFtIHtEb2N1bWVudHxIVE1MRWxlbWVudD99IGNvbnRleHQgLSBUaGUgY29udGV4dCB0byB0cmF2ZXJzZSB0aGUgRE9NXHJcbiAqICAgaW4uIElmIG5vdCBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gdGhlIGRvY3VtZW50LlxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudFtdfSAtIEFuIGFycmF5IG9mIERPTSBub2RlcyBvciBhbiBlbXB0eSBhcnJheS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKHNlbGVjdG9yLCBjb250ZXh0KSA9PiB7XHJcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIikge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFjb250ZXh0IHx8ICFpc0VsZW1lbnQoY29udGV4dCkpIHtcclxuICAgIGNvbnRleHQgPSB3aW5kb3cuZG9jdW1lbnQ7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICB9XHJcblxyXG4gIGNvbnN0IHNlbGVjdGlvbiA9IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGVjdGlvbik7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XHJcbmNvbnN0IENPTlRST0xTID0gJ2FyaWEtY29udHJvbHMnO1xyXG5jb25zdCBISURERU4gPSAnYXJpYS1oaWRkZW4nO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoYnV0dG9uLCBleHBhbmRlZCkgPT4ge1xyXG5cclxuICBpZiAodHlwZW9mIGV4cGFuZGVkICE9PSAnYm9vbGVhbicpIHtcclxuICAgIGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICdmYWxzZSc7XHJcbiAgfVxyXG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoRVhQQU5ERUQsIGV4cGFuZGVkKTtcclxuICBjb25zdCBpZCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoQ09OVFJPTFMpO1xyXG4gIGNvbnN0IGNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gIGlmICghY29udHJvbHMpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgJ05vIHRvZ2dsZSB0YXJnZXQgZm91bmQgd2l0aCBpZDogXCInICsgaWQgKyAnXCInXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29udHJvbHMuc2V0QXR0cmlidXRlKEhJRERFTiwgIWV4cGFuZGVkKTtcclxuICByZXR1cm4gZXhwYW5kZWQ7XHJcbn07XHJcbiJdfQ==
