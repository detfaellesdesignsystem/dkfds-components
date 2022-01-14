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

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "behavior", {
  enumerable: true,
  get: function get() {
    return _behavior["default"];
  }
});
Object.defineProperty(exports, "delegate", {
  enumerable: true,
  get: function get() {
    return _delegate["default"];
  }
});
Object.defineProperty(exports, "delegateAll", {
  enumerable: true,
  get: function get() {
    return _delegateAll["default"];
  }
});
Object.defineProperty(exports, "ignore", {
  enumerable: true,
  get: function get() {
    return _ignore["default"];
  }
});
Object.defineProperty(exports, "keymap", {
  enumerable: true,
  get: function get() {
    return _keymap["default"];
  }
});
Object.defineProperty(exports, "once", {
  enumerable: true,
  get: function get() {
    return _once["default"];
  }
});

var _behavior = _interopRequireDefault(require("./src/behavior"));

var _delegate = _interopRequireDefault(require("./src/delegate"));

var _delegateAll = _interopRequireDefault(require("./src/delegateAll"));

var _ignore = _interopRequireDefault(require("./src/ignore"));

var _keymap = _interopRequireDefault(require("./src/keymap"));

var _once = _interopRequireDefault(require("./src/once"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

},{"./src/behavior":65,"./src/delegate":67,"./src/delegateAll":68,"./src/ignore":69,"./src/keymap":70,"./src/once":71}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = behavior;

var _objectAssign = _interopRequireDefault(require("object-assign"));

var _delegate = _interopRequireDefault(require("./delegate"));

var _delegateAll = _interopRequireDefault(require("./delegateAll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
    options: options,
    delegate: _typeof(handler) === 'object' ? (0, _delegateAll["default"])(handler) : selector ? (0, _delegate["default"])(selector, handler) : handler
  };

  if (type.indexOf(SPACE) > -1) {
    return type.split(SPACE).map(function (_type) {
      return (0, _objectAssign["default"])({
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

function behavior(events, props) {
  var listeners = Object.keys(events).reduce(function (memo, type) {
    var listeners = getListeners(type, events[type]);
    return memo.concat(listeners);
  }, []);
  return (0, _objectAssign["default"])({
    add: function add(element) {
      var _iterator = _createForOfIteratorHelper(listeners),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var listener = _step.value;
          element.addEventListener(listener.type, listener.delegate, listener.options);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    },
    remove: function remove(element) {
      var _iterator2 = _createForOfIteratorHelper(listeners),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var listener = _step2.value;
          element.removeEventListener(listener.type, listener.delegate, listener.options);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, props);
}

},{"./delegate":67,"./delegateAll":68,"object-assign":63}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = compose;

function compose(functions) {
  return function (e) {
    var _this = this;

    return functions.some(function (fn) {
      return fn.call(_this, e) === false;
    });
  };
}

},{}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = delegate;

require("element-closest");

// polyfill Element.prototype.closest
function delegate(selector, fn) {
  return function (event) {
    var target = event.target.closest(selector);

    if (target) {
      return fn.call(target, event);
    }
  };
}

},{"element-closest":61}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = delegateAll;

var _delegate = _interopRequireDefault(require("./delegate"));

var _compose = _interopRequireDefault(require("./compose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SPLAT = '*';

function delegateAll(selectors) {
  var keys = Object.keys(selectors); // XXX optimization: if there is only one handler and it applies to
  // all elements (the "*" CSS selector), then just return that
  // handler

  if (keys.length === 1 && keys[0] === SPLAT) {
    return selectors[SPLAT];
  }

  var delegates = keys.reduce(function (memo, selector) {
    memo.push((0, _delegate["default"])(selector, selectors[selector]));
    return memo;
  }, []);
  return (0, _compose["default"])(delegates);
}

},{"./compose":66,"./delegate":67}],69:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ignore;

function ignore(element, fn) {
  return function ignorance(e) {
    if (element !== e.target && !element.contains(e.target)) {
      return fn.call(this, e);
    }
  };
}

},{}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MODIFIERS = void 0;
exports["default"] = keymap;

require("keyboardevent-key-polyfill");

// these are the only relevant modifiers supported on all platforms,
// according to MDN:
// <https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState>
var MODIFIERS = {
  Alt: 'altKey',
  Control: 'ctrlKey',
  Ctrl: 'ctrlKey',
  Shift: 'shiftKey'
};
exports.MODIFIERS = MODIFIERS;
var MODIFIER_SEPARATOR = '+';

function getEventKey(event, hasModifiers) {
  var key = event.key;

  if (hasModifiers) {
    for (var modifier in MODIFIERS) {
      if (event[MODIFIERS[modifier]] === true) {
        key = [modifier, key].join(MODIFIER_SEPARATOR);
      }
    }
  }

  return key;
}

function keymap(keys) {
  var hasModifiers = Object.keys(keys).some(function (key) {
    return key.indexOf(MODIFIER_SEPARATOR) > -1;
  });
  return function keymapper(event) {
    var _this = this;

    var key = getEventKey(event, hasModifiers);
    return [key, key.toLowerCase()].reduce(function (result, _key) {
      if (_key in keys) {
        return keys[key].call(_this, event);
      }

      return result;
    });
  };
}

},{"keyboardevent-key-polyfill":62}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = once;

function once(listener, options) {
  return function wrappedOnce(e) {
    e.currentTarget.removeEventListener(e.type, wrappedOnce, options);
    return listener.call(this, e);
  };
}

},{}],72:[function(require,module,exports){
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
var BULK_FUNCTION_OPEN_TEXT = "Åbn alle";
var BULK_FUNCTION_CLOSE_TEXT = "Luk alle";
var BULK_FUNCTION_ACTION_ATTRIBUTE = "data-accordion-bulk-expand";
/**
 * Adds click functionality to accordion list
 * @param {HTMLElement} $accordion the accordion ul element
 */

function Accordion($accordion) {
  if (!$accordion) {
    throw new Error("Missing accordion group element");
  }

  this.accordion = $accordion;
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
    currentButton.addEventListener('click', this.eventOnClick.bind(this, currentButton), false); // Set click event on bulk button if present

    var prevSibling = this.accordion.previousElementSibling;

    if (prevSibling !== null && prevSibling.classList.contains('accordion-bulk-button')) {
      this.bulkFunctionButton = prevSibling;
      this.bulkFunctionButton.addEventListener('click', this.bulkEvent.bind(this));
    }
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
    $module.toggleButton($module.buttons[i], expand);
  }

  $module.bulkFunctionButton.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, !expand);

  if (!expand === true) {
    $module.bulkFunctionButton.innerText = BULK_FUNCTION_OPEN_TEXT;
  } else {
    $module.bulkFunctionButton.innerText = BULK_FUNCTION_CLOSE_TEXT;
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
      var buttonsOpen = accordion.querySelectorAll(BUTTON + '[aria-expanded="true"]');
      var buttonsClosed = accordion.querySelectorAll(BUTTON + '[aria-expanded="false"]');
      var newStatus = true;

      if (buttons.length === buttonsOpen.length) {
        newStatus = false;
      }

      if (buttons.length === buttonsClosed.length) {
        newStatus = true;
      }

      bulkFunction.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, newStatus);

      if (newStatus === true) {
        bulkFunction.innerText = BULK_FUNCTION_OPEN_TEXT;
      } else {
        bulkFunction.innerText = BULK_FUNCTION_CLOSE_TEXT;
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

},{"../polyfills/Function/prototype/bind":91,"../utils/is-in-viewport":100,"../utils/toggle":103}],73:[function(require,module,exports){
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

},{"../polyfills/Function/prototype/bind":91}],75:[function(require,module,exports){
"use strict";

var _CLICK, _keydown, _focusout, _datePickerEvents;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var receptor = require("receptor");

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
var VALIDATION_MESSAGE = "Indtast venligst en gyldig dato";
var MONTH_LABELS = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
var DAY_OF_WEEK_LABELS = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
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
 * Parse a date with format M-D-YY
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
  var event = new CustomEvent("change", {
    bubbles: true,
    cancelable: true,
    detail: {
      value: value
    }
  });
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
 * Validate the value in the input as a valid date of format M/D/YYYY
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
  calendarWrapper.insertAdjacentHTML("beforeend", ["<button type=\"button\" class=\"".concat(DATE_PICKER_BUTTON_CLASS, "\" aria-haspopup=\"true\" aria-label=\"\xC5bn kalender\">&nbsp;</button>"), "<div class=\"".concat(DATE_PICKER_CALENDAR_CLASS, "\" role=\"dialog\" aria-modal=\"true\" hidden></div>"), "<div class=\"sr-only ".concat(DATE_PICKER_STATUS_CLASS, "\" role=\"status\" aria-live=\"polite\"></div>")].join(""));
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
    return "<button\n      type=\"button\"\n      tabindex=\"".concat(tabindex, "\"\n      class=\"").concat(classes.join(" "), "\" \n      data-day=\"").concat(day, "\" \n      data-month=\"").concat(month + 1, "\" \n      data-year=\"").concat(year, "\" \n      data-value=\"").concat(formattedDate, "\"\n      aria-label=\"").concat(dayStr, " den ").concat(day, " ").concat(monthStr, " ").concat(year, " \"\n      aria-selected=\"").concat(isSelected ? "true" : "false", "\"\n      ").concat(isDisabled ? "disabled=\"disabled\"" : "", "\n    >").concat(day, "</button>");
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
  var content = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_DATE_PICKER_CLASS, "\">\n      <div class=\"").concat(CALENDAR_ROW_CLASS, "\">\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_YEAR_CLASS, "\"\n            aria-label=\"Navig\xE9r \xE9t \xE5r tilbage\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_MONTH_CLASS, "\"\n            aria-label=\"Navig\xE9r \xE9t \xE5r tilbage\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_MONTH_LABEL_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_MONTH_SELECTION_CLASS, "\" aria-label=\"").concat(monthLabel, ". V\xE6lg m\xE5ned.\"\n          >").concat(monthLabel, "</button>\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_YEAR_SELECTION_CLASS, "\" aria-label=\"").concat(focusedYear, ". V\xE6lg \xE5r.\"\n          >").concat(focusedYear, "</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_MONTH_CLASS, "\"\n            aria-label=\"Navig\xE9r \xE9n m\xE5ned frem\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_YEAR_CLASS, "\"\n            aria-label=\"NNavig\xE9r \xE9t \xE5r frem\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n      </div>\n      <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <thead>\n          <tr>");

  for (var d in DAY_OF_WEEK_LABELS) {
    content += "<th class=\"".concat(CALENDAR_DAY_OF_WEEK_CLASS, "\" scope=\"col\" aria-label=\"").concat(DAY_OF_WEEK_LABELS[d], "\">").concat(DAY_OF_WEEK_LABELS[d].charAt(0), "</th>");
  }

  content += "</tr>\n        </thead>\n        <tbody>\n          ".concat(datesHtml, "\n        </tbody>\n      </table>\n    </div>");
  newCalendar.innerHTML = content;
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  datePickerEl.classList.add(DATE_PICKER_ACTIVE_CLASS);
  var statuses = [];

  if (isSameDay(selectedDate, focusedDate)) {
    statuses.push("Selected date");
  }

  if (calendarWasHidden) {
    statuses.push("Du kan navigere mellem dage ved at bruge højre og venstre piltaster, ", "uger ved at bruge op og ned piltaster, ", "måneder ved ta bruge page up og page down tasterne ", "og år ved at at taste shift og page up eller ned.", "Home og end tasten navigerer til start eller slutning af en uge.");
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
  statusEl.textContent = "Select a month.";
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
  var newCalendar = calendarEl.cloneNode();
  newCalendar.innerHTML = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_YEAR_PICKER_CLASS, "\">\n    <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <tbody>\n          <tr>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_PREVIOUS_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"Navig\xE9r ").concat(YEAR_CHUNK, " \xE5r tilbage\"\n                ").concat(prevYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n            <td colspan=\"3\">\n              <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n                <tbody>\n                  ").concat(yearsHtml, "\n                </tbody>\n              </table>\n            </td>\n            <td>\n              <button\n                type=\"button\"\n                class=\"").concat(CALENDAR_NEXT_YEAR_CHUNK_CLASS, "\" \n                aria-label=\"Navig\xE9r ").concat(YEAR_CHUNK, " \xE5r frem\"\n                ").concat(nextYearChunkDisabled ? "disabled=\"disabled\"" : "", "\n              >&nbsp;</button>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>");
  calendarEl.parentNode.replaceChild(newCalendar, calendarEl);
  statusEl.textContent = "Showing years ".concat(yearToChunk, " to ").concat(yearToChunk + YEAR_CHUNK - 1, ". Select a year.");
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
}), _defineProperty(_keydown, CALENDAR_DATE, receptor.keymap({
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
})), _defineProperty(_keydown, CALENDAR_DATE_PICKER, receptor.keymap({
  Tab: datePickerTabEventHandler.tabAhead,
  "Shift+Tab": datePickerTabEventHandler.tabBack
})), _defineProperty(_keydown, CALENDAR_MONTH, receptor.keymap({
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
})), _defineProperty(_keydown, CALENDAR_MONTH_PICKER, receptor.keymap({
  Tab: monthPickerTabEventHandler.tabAhead,
  "Shift+Tab": monthPickerTabEventHandler.tabBack
})), _defineProperty(_keydown, CALENDAR_YEAR, receptor.keymap({
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
})), _defineProperty(_keydown, CALENDAR_YEAR_PICKER, receptor.keymap({
  Tab: yearPickerTabEventHandler.tabAhead,
  "Shift+Tab": yearPickerTabEventHandler.tabBack
})), _defineProperty(_keydown, DATE_PICKER_CALENDAR, function (event) {
  this.dataset.keydownKeyCode = event.keyCode;
}), _defineProperty(_keydown, DATE_PICKER, function (event) {
  var keyMap = receptor.keymap({
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

},{"../config":88,"../events":90,"../utils/active-element":97,"../utils/behavior":98,"../utils/is-ios-device":101,"../utils/select":102,"receptor":64}],76:[function(require,module,exports){
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

},{"../polyfills/Function/prototype/bind":91,"./dropdown":77}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var breakpoints = require('../utils/breakpoints');

var BUTTON = '.js-dropdown';
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

    document.addEventListener('keyup', function (e) {
      var key = e.which || e.keyCode;

      if (key === 27) {
        closeAll(e);
      }
    });
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
      closeAll(); //open

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
  if (document.querySelector('body.mobile_nav-active') === null && !evt.target.classList.contains('button-menu-close')) {
    var openDropdowns = document.querySelectorAll('.js-dropdown[aria-expanded=true]');

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

},{"../utils/breakpoints":99}],78:[function(require,module,exports){
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

},{}],79:[function(require,module,exports){
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

},{}],80:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

},{"../utils/select":102,"array-foreach":1}],81:[function(require,module,exports){
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

},{}],82:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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

var _default = InputRegexMask;
exports["default"] = _default;

},{}],83:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var dk = {
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
  var strings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : dk;
  this.table = table;
  dk = strings;
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
      checkboxList[c].nextElementSibling.setAttribute('aria-label', dk.unselect_row);
    }

    checkedNumber = checkboxList.length;
    checkbox.nextElementSibling.setAttribute('aria-label', dk.unselect_all_rows);
  } else {
    for (var _c = 0; _c < checkboxList.length; _c++) {
      checkboxList[_c].checked = false;

      checkboxList[_c].parentNode.parentNode.classList.remove('table-row-selected');

      checkboxList[_c].nextElementSibling.setAttribute('aria-label', dk.select_row);
    }

    checkbox.nextElementSibling.setAttribute('aria-label', dk.select_all_rows);
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
    e.target.nextElementSibling.setAttribute('aria-label', dk.unselect_row);
  } else {
    e.target.parentNode.parentNode.classList.remove('table-row-selected');
    e.target.nextElementSibling.setAttribute('aria-label', dk.select_row);
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
      groupCheckbox.nextElementSibling.setAttribute('aria-label', dk.unselect_all_rows);
    } else if (checkedNumber == 0) {
      // if no rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.checked = false;
      groupCheckbox.nextElementSibling.setAttribute('aria-label', dk.select_all_rows);
    } else {
      // if some but not all rows has been selected
      groupCheckbox.setAttribute('aria-checked', 'mixed');
      groupCheckbox.checked = false;
      groupCheckbox.nextElementSibling.setAttribute('aria-label', dk.select_all_rows);
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

},{}],84:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var select = require('../utils/select');
/**
 * Set data-title on cells, where the attribute is missing
 */


var ResponsiveTable = function ResponsiveTable(table) {
  _classCallCheck(this, ResponsiveTable);

  insertHeaderAsAttributes(table);
};
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

},{"../utils/select":102}],85:[function(require,module,exports){
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

},{}],86:[function(require,module,exports){
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

},{}],87:[function(require,module,exports){
'use strict';
/**
 * Set tooltip on element
 * @param {HTMLElement} element Element which has tooltip
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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
  this.element.addEventListener('mouseenter', function (e) {
    e.target.classList.add('tooltip-hover');
    setTimeout(function () {
      if (e.target.classList.contains('tooltip-hover')) {
        var element = e.target;
        if (element.getAttribute('aria-describedby') !== null) return;
        e.preventDefault();
        var pos = element.getAttribute('data-tooltip-position') || 'top';
        var tooltip = createTooltip(element, pos);
        document.body.appendChild(tooltip);
        positionAt(element, tooltip, pos);
      }
    }, 300);
  });
  this.element.addEventListener('mouseleave', function (e) {
    var trigger = this;
    trigger.classList.remove('tooltip-hover');

    if (!trigger.classList.contains('active')) {
      var tooltip = trigger.getAttribute('aria-describedby');

      if (tooltip !== null && document.getElementById(tooltip) !== null) {
        document.body.removeChild(document.getElementById(tooltip));
      }

      trigger.removeAttribute('aria-describedby');
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
  this.element.addEventListener('focus', function (e) {
    var element = e.target;
    if (element.getAttribute('aria-describedby') !== null) return;
    e.preventDefault();
    var pos = element.getAttribute('data-tooltip-position') || 'top';
    var tooltip = createTooltip(element, pos);
    document.body.appendChild(tooltip);
    positionAt(element, tooltip, pos);
  });
  this.element.addEventListener('blur', function (e) {
    var tooltip = this.getAttribute('aria-describedby');

    if (tooltip !== null && document.getElementById(tooltip) !== null) {
      document.body.removeChild(document.getElementById(tooltip));
    }

    this.removeAttribute('aria-describedby');
    this.classList.remove('active');
  });

  if (this.element.getAttribute('data-tooltip-trigger') === 'click') {
    this.element.addEventListener('click', function (e) {
      var element = this;

      if (element.getAttribute('aria-describedby') === null) {
        var pos = element.getAttribute('data-tooltip-position') || 'top';
        var tooltip = createTooltip(element, pos);
        document.body.appendChild(tooltip);
        positionAt(element, tooltip, pos);
      } else {
        if (element.classList.contains('active')) {
          var popper = element.getAttribute('aria-describedby');
          document.body.removeChild(document.getElementById(popper));
          element.classList.remove('active');
          element.removeAttribute('aria-describedby');
        } else {
          element.classList.add('active');
        }
      }
    });
  }

  document.getElementsByTagName('body')[0].addEventListener('click', function (event) {
    if (!event.target.classList.contains('js-tooltip') && !event.target.classList.contains('tooltip') && !event.target.classList.contains('tooltip-content')) {
      closeAll();
    }
  });
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
  } // 


  if (top + tooltip.offsetHeight >= window.innerHeight) {
    top = parseInt(parentCoords.top) - tooltip.offsetHeight - dist;
    arrowDirection = "up";
  }

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

var _default = Tooltip;
exports["default"] = _default;

},{}],88:[function(require,module,exports){
"use strict";

module.exports = {
  prefix: ''
};

},{}],89:[function(require,module,exports){
'use strict';

var _accordion = _interopRequireDefault(require("./components/accordion"));

var _alert = _interopRequireDefault(require("./components/alert"));

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
  Checkbox collapse
  ---------------------
  */


  var jsSelectorCheckboxCollapse = scope.getElementsByClassName('js-checkbox-toggle-content');

  for (var _c3 = 0; _c3 < jsSelectorCheckboxCollapse.length; _c3++) {
    new _checkboxToggleContent["default"](jsSelectorCheckboxCollapse[_c3]).init();
  }
  /*
  ---------------------
  Overflow menu
  ---------------------
  */


  var jsSelectorDropdown = scope.getElementsByClassName('js-dropdown');

  for (var _c4 = 0; _c4 < jsSelectorDropdown.length; _c4++) {
    new _dropdown["default"](jsSelectorDropdown[_c4]).init();
  }
  /*
  ---------------------
  Overflow menu sort
  ---------------------
  */


  var jsSelectorDropdownSort = scope.getElementsByClassName('overflow-menu--sort');

  for (var _c5 = 0; _c5 < jsSelectorDropdownSort.length; _c5++) {
    new _dropdownSort["default"](jsSelectorDropdownSort[_c5]).init();
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

  for (var _c6 = 0; _c6 < jsSelectorRegex.length; _c6++) {
    new _regexInputMask["default"](jsSelectorRegex[_c6]);
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

  for (var _c7 = 0; _c7 < jsSelectorRadioCollapse.length; _c7++) {
    new _radioToggleContent["default"](jsSelectorRadioCollapse[_c7]).init();
  }
  /*
  ---------------------
  Responsive tables
  ---------------------
  */


  var jsSelectorTable = scope.querySelectorAll('table:not(.dataTable)');

  for (var _c8 = 0; _c8 < jsSelectorTable.length; _c8++) {
    new _table["default"](jsSelectorTable[_c8]);
  }
  /*
  ---------------------
  Selectable rows in table
  ---------------------
  */


  var jsSelectableTable = scope.querySelectorAll('table.table--selectable');

  for (var _c9 = 0; _c9 < jsSelectableTable.length; _c9++) {
    new _selectableTable["default"](jsSelectableTable[_c9]).init();
  }
  /*
  ---------------------
  Tabnav
  ---------------------
  */


  var jsSelectorTabnav = scope.getElementsByClassName('tabnav');

  for (var _c10 = 0; _c10 < jsSelectorTabnav.length; _c10++) {
    new _tabnav["default"](jsSelectorTabnav[_c10]).init();
  }
  /*
  ---------------------
  Tooltip
  ---------------------
  */


  var jsSelectorTooltip = scope.getElementsByClassName('js-tooltip');

  for (var _c11 = 0; _c11 < jsSelectorTooltip.length; _c11++) {
    new _tooltip["default"](jsSelectorTooltip[_c11]).init();
  }
};

module.exports = {
  init: init,
  Accordion: _accordion["default"],
  Alert: _alert["default"],
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

},{"./components/accordion":72,"./components/alert":73,"./components/checkbox-toggle-content":74,"./components/date-picker":75,"./components/dropdown":77,"./components/dropdown-sort":76,"./components/error-summary":78,"./components/modal":79,"./components/navigation":80,"./components/radio-toggle-content":81,"./components/regex-input-mask":82,"./components/selectable-table":83,"./components/table":84,"./components/tabnav":85,"./components/toast":86,"./components/tooltip":87,"./polyfills":95}],90:[function(require,module,exports){
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

},{}],91:[function(require,module,exports){
(function (global){(function (){
"use strict";

require("../../Object/defineProperty");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

},{"../../Object/defineProperty":92}],92:[function(require,module,exports){
(function (global){(function (){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

},{}],93:[function(require,module,exports){
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

},{}],94:[function(require,module,exports){
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

},{}],95:[function(require,module,exports){
'use strict'; // polyfills HTMLElement.prototype.classList and DOMTokenList

require('classlist-polyfill'); // polyfills HTMLElement.prototype.hidden


require('./element-hidden'); // polyfills Number.isNaN()


require("./number-is-nan"); // polyfills CustomEvent


require("./custom-event");

require('core-js/fn/object/assign');

require('core-js/fn/array/from');

},{"./custom-event":93,"./element-hidden":94,"./number-is-nan":96,"classlist-polyfill":2,"core-js/fn/array/from":3,"core-js/fn/object/assign":4}],96:[function(require,module,exports){
"use strict";

Number.isNaN = Number.isNaN || function isNaN(input) {
  // eslint-disable-next-line no-self-compare
  return typeof input === "number" && input !== input;
};

},{}],97:[function(require,module,exports){
"use strict";

module.exports = function () {
  var htmlDocument = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  return htmlDocument.activeElement;
};

},{}],98:[function(require,module,exports){
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

},{"object-assign":63,"receptor":64}],99:[function(require,module,exports){
'use strict';

var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};
module.exports = breakpoints;

},{}],100:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;
  var rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}

module.exports = isElementInViewport;

},{}],101:[function(require,module,exports){
"use strict";

// iOS detection from: http://stackoverflow.com/a/9039885/177710
function isIosDevice() {
  return typeof navigator !== "undefined" && (navigator.userAgent.match(/(iPod|iPhone|iPad)/g) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
}

module.exports = isIosDevice;

},{}],102:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

},{}],103:[function(require,module,exports){
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

},{}]},{},[89])(89)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mdW5jdGlvbi10by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9lbGVtZW50LWNsb3Nlc3QvZWxlbWVudC1jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3Ivc3JjL2JlaGF2aW9yLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL3NyYy9jb21wb3NlLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL3NyYy9kZWxlZ2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9zcmMvZGVsZWdhdGVBbGwuanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3Ivc3JjL2lnbm9yZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9zcmMva2V5bWFwLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL3NyYy9vbmNlLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWNjb3JkaW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWxlcnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RhdGUtcGlja2VyLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZHJvcGRvd24tc29ydC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeS5qcyIsInNyYy9qcy9jb21wb25lbnRzL21vZGFsLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbmF2aWdhdGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzay5qcyIsInNyYy9qcy9jb21wb25lbnRzL3NlbGVjdGFibGUtdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYm5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RvYXN0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9vbHRpcC5qcyIsInNyYy9qcy9jb25maWcuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvZXZlbnRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvT2JqZWN0L2RlZmluZVByb3BlcnR5LmpzIiwic3JjL2pzL3BvbHlmaWxscy9jdXN0b20tZXZlbnQuanMiLCJzcmMvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwic3JjL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvbnVtYmVyLWlzLW5hbi5qcyIsInNyYy9qcy91dGlscy9hY3RpdmUtZWxlbWVudC5qcyIsInNyYy9qcy91dGlscy9iZWhhdmlvci5qcyIsInNyYy9qcy91dGlscy9icmVha3BvaW50cy5qcyIsInNyYy9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInNyYy9qcy91dGlscy9pcy1pb3MtZGV2aWNlLmpzIiwic3JjL2pzL3V0aWxzL3NlbGVjdC5qcyIsInNyYy9qcy91dGlscy90b2dnbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxPQUFULENBQWtCLEdBQWxCLEVBQXVCLFFBQXZCLEVBQWlDLE9BQWpDLEVBQTBDO0FBQ3ZELE1BQUksR0FBRyxDQUFDLE9BQVIsRUFB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LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIGFycmF5LWZvcmVhY2hcbiAqICAgQXJyYXkjZm9yRWFjaCBwb255ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnNcbiAqICAgKFBvbnlmaWxsOiBBIHBvbHlmaWxsIHRoYXQgZG9lc24ndCBvdmVyd3JpdGUgdGhlIG5hdGl2ZSBtZXRob2QpXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LTIwMTYgVGFrdXRvIFdhZGFcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2gvYmxvYi9tYXN0ZXIvTUlULUxJQ0VOU0VcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2ggKGFyeSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBpZiAoYXJ5LmZvckVhY2gpIHtcbiAgICAgICAgYXJ5LmZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSs9MSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGFyeVtpXSwgaSwgYXJ5KTtcbiAgICB9XG59O1xuIiwiLypcbiAqIGNsYXNzTGlzdC5qczogQ3Jvc3MtYnJvd3NlciBmdWxsIGVsZW1lbnQuY2xhc3NMaXN0IGltcGxlbWVudGF0aW9uLlxuICogMS4xLjIwMTcwNDI3XG4gKlxuICogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxuICogTGljZW5zZTogRGVkaWNhdGVkIHRvIHRoZSBwdWJsaWMgZG9tYWluLlxuICogICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG4vKmdsb2JhbCBzZWxmLCBkb2N1bWVudCwgRE9NRXhjZXB0aW9uICovXG5cbi8qISBAc291cmNlIGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvY2xhc3NMaXN0LmpzICovXG5cbmlmIChcImRvY3VtZW50XCIgaW4gd2luZG93LnNlbGYpIHtcblxuLy8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxuLy8gSW5jbHVkaW5nIElFIDwgRWRnZSBtaXNzaW5nIFNWR0VsZW1lbnQuY2xhc3NMaXN0XG5pZiAoIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpKSBcblx0fHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKSkpIHtcblxuKGZ1bmN0aW9uICh2aWV3KSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5pZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcblxudmFyXG5cdCAgY2xhc3NMaXN0UHJvcCA9IFwiY2xhc3NMaXN0XCJcblx0LCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG5cdCwgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF1cblx0LCBvYmpDdHIgPSBPYmplY3Rcblx0LCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIik7XG5cdH1cblx0LCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIGkgPSAwXG5cdFx0XHQsIGxlbiA9IHRoaXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cdC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xuXHQsIERPTUV4ID0gZnVuY3Rpb24gKHR5cGUsIG1lc3NhZ2UpIHtcblx0XHR0aGlzLm5hbWUgPSB0eXBlO1xuXHRcdHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9XG5cdCwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcblx0XHRpZiAodG9rZW4gPT09IFwiXCIpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIlNZTlRBWF9FUlJcIlxuXHRcdFx0XHQsIFwiQW4gaW52YWxpZCBvciBpbGxlZ2FsIHN0cmluZyB3YXMgc3BlY2lmaWVkXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCJcblx0XHRcdFx0LCBcIlN0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3RlclwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xuXHR9XG5cdCwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxuXHRcdFx0LCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cblx0XHRcdCwgaSA9IDBcblx0XHRcdCwgbGVuID0gY2xhc3Nlcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0dGhpcy5wdXNoKGNsYXNzZXNbaV0pO1xuXHRcdH1cblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMudG9TdHJpbmcoKSk7XG5cdFx0fTtcblx0fVxuXHQsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxuXHQsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IENsYXNzTGlzdCh0aGlzKTtcblx0fVxuO1xuLy8gTW9zdCBET01FeGNlcHRpb24gaW1wbGVtZW50YXRpb25zIGRvbid0IGFsbG93IGNhbGxpbmcgRE9NRXhjZXB0aW9uJ3MgdG9TdHJpbmcoKVxuLy8gb24gbm9uLURPTUV4Y2VwdGlvbnMuIEVycm9yJ3MgdG9TdHJpbmcoKSBpcyBzdWZmaWNpZW50IGhlcmUuXG5ET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcbmNsYXNzTGlzdFByb3RvLml0ZW0gPSBmdW5jdGlvbiAoaSkge1xuXHRyZXR1cm4gdGhpc1tpXSB8fCBudWxsO1xufTtcbmNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cdHJldHVybiBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pICE9PSAtMTtcbn07XG5jbGFzc0xpc3RQcm90by5hZGQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xuXHRcdFx0dGhpcy5wdXNoKHRva2VuKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHRcdCwgaW5kZXhcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR3aGlsZSAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHR0aGlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cblx0dmFyXG5cdFx0ICByZXN1bHQgPSB0aGlzLmNvbnRhaW5zKHRva2VuKVxuXHRcdCwgbWV0aG9kID0gcmVzdWx0ID9cblx0XHRcdGZvcmNlICE9PSB0cnVlICYmIFwicmVtb3ZlXCJcblx0XHQ6XG5cdFx0XHRmb3JjZSAhPT0gZmFsc2UgJiYgXCJhZGRcIlxuXHQ7XG5cblx0aWYgKG1ldGhvZCkge1xuXHRcdHRoaXNbbWV0aG9kXSh0b2tlbik7XG5cdH1cblxuXHRpZiAoZm9yY2UgPT09IHRydWUgfHwgZm9yY2UgPT09IGZhbHNlKSB7XG5cdFx0cmV0dXJuIGZvcmNlO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiAhcmVzdWx0O1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmpvaW4oXCIgXCIpO1xufTtcblxuaWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xuXHR2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XG5cdFx0ICBnZXQ6IGNsYXNzTGlzdEdldHRlclxuXHRcdCwgZW51bWVyYWJsZTogdHJ1ZVxuXHRcdCwgY29uZmlndXJhYmxlOiB0cnVlXG5cdH07XG5cdHRyeSB7XG5cdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHR9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcblx0XHQvLyBhZGRpbmcgdW5kZWZpbmVkIHRvIGZpZ2h0IHRoaXMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2lzc3Vlcy8zNlxuXHRcdC8vIG1vZGVybmllIElFOC1NU1c3IG1hY2hpbmUgaGFzIElFOCA4LjAuNjAwMS4xODcwMiBhbmQgaXMgYWZmZWN0ZWRcblx0XHRpZiAoZXgubnVtYmVyID09PSB1bmRlZmluZWQgfHwgZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xuXHRcdFx0Y2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuXHRcdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHRcdH1cblx0fVxufSBlbHNlIGlmIChvYmpDdHJbcHJvdG9Qcm9wXS5fX2RlZmluZUdldHRlcl9fKSB7XG5cdGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XG59XG5cbn0od2luZG93LnNlbGYpKTtcblxufVxuXG4vLyBUaGVyZSBpcyBmdWxsIG9yIHBhcnRpYWwgbmF0aXZlIGNsYXNzTGlzdCBzdXBwb3J0LCBzbyBqdXN0IGNoZWNrIGlmIHdlIG5lZWRcbi8vIHRvIG5vcm1hbGl6ZSB0aGUgYWRkL3JlbW92ZSBhbmQgdG9nZ2xlIEFQSXMuXG5cbihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpO1xuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjMVwiLCBcImMyXCIpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMC8xMSBhbmQgRmlyZWZveCA8MjYsIHdoZXJlIGNsYXNzTGlzdC5hZGQgYW5kXG5cdC8vIGNsYXNzTGlzdC5yZW1vdmUgZXhpc3QgYnV0IHN1cHBvcnQgb25seSBvbmUgYXJndW1lbnQgYXQgYSB0aW1lLlxuXHRpZiAoIXRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMyXCIpKSB7XG5cdFx0dmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdO1xuXG5cdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih0b2tlbikge1xuXHRcdFx0XHR2YXIgaSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0XHR0b2tlbiA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdFx0XHRvcmlnaW5hbC5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdGNyZWF0ZU1ldGhvZCgnYWRkJyk7XG5cdFx0Y3JlYXRlTWV0aG9kKCdyZW1vdmUnKTtcblx0fVxuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJjM1wiLCBmYWxzZSk7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwIGFuZCBGaXJlZm94IDwyNCwgd2hlcmUgY2xhc3NMaXN0LnRvZ2dsZSBkb2VzIG5vdFxuXHQvLyBzdXBwb3J0IHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdGlmICh0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjM1wiKSkge1xuXHRcdHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XG5cblx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKHRva2VuLCBmb3JjZSkge1xuXHRcdFx0aWYgKDEgaW4gYXJndW1lbnRzICYmICF0aGlzLmNvbnRhaW5zKHRva2VuKSA9PT0gIWZvcmNlKSB7XG5cdFx0XHRcdHJldHVybiBmb3JjZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBfdG9nZ2xlLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fVxuXG5cdHRlc3RFbGVtZW50ID0gbnVsbDtcbn0oKSk7XG5cbn1cbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuQXJyYXkuZnJvbTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5hc3NpZ247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjYuMTInIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBzb3VyY2UpIHtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkY7XG4gIHZhciBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HO1xuICB2YXIgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuUztcbiAgdmFyIElTX1BST1RPID0gdHlwZSAmICRleHBvcnQuUDtcbiAgdmFyIElTX0JJTkQgPSB0eXBlICYgJGV4cG9ydC5CO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KTtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYgKHRhcmdldCkgcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYgKGV4cG9ydHNba2V5XSAhPSBvdXQpIGhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmIChJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dCkgZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ25hdGl2ZS1mdW5jdGlvbi10by1zdHJpbmcnLCBGdW5jdGlvbi50b1N0cmluZyk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZiAodHlwZW9mIF9fZyA9PSAnbnVtYmVyJykgX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuIiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcykge1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkgYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBkZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KSB7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwgeyBuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpIH0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgJGl0ZXJDcmVhdGUgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpOyAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG52YXIgRkZfSVRFUkFUT1IgPSAnQEBpdGVyYXRvcic7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICBpZiAoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pIHJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTO1xuICB2YXIgVkFMVUVTX0JVRyA9IGZhbHNlO1xuICB2YXIgcHJvdG8gPSBCYXNlLnByb3RvdHlwZTtcbiAgdmFyICRuYXRpdmUgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF07XG4gIHZhciAkZGVmYXVsdCA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpO1xuICB2YXIgJGVudHJpZXMgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkO1xuICB2YXIgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmU7XG4gIHZhciBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmICgkYW55TmF0aXZlKSB7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYgKCFMSUJSQVJZICYmIHR5cGVvZiBJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUl0gIT0gJ2Z1bmN0aW9uJykgaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKSB7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSA9IHJldHVyblRoaXM7XG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoIShrZXkgaW4gcHJvdG8pKSByZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwidmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24gKCkgeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbiAoKSB7IHRocm93IDI7IH0pO1xufSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMsIHNraXBDbG9zaW5nKSB7XG4gIGlmICghc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORykgcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBbN107XG4gICAgdmFyIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geyBkb25lOiBzYWZlID0gdHJ1ZSB9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyICRhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgUyA9IFN5bWJvbCgpO1xuICB2YXIgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUID0gdG9PYmplY3QodGFyZ2V0KTtcbiAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAxO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgdmFyIGlzRW51bSA9IHBJRS5mO1xuICB3aGlsZSAoYUxlbiA+IGluZGV4KSB7XG4gICAgdmFyIFMgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgdmFyIGtleXMgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikge1xuICAgICAga2V5ID0ga2V5c1tqKytdO1xuICAgICAgaWYgKCFERVNDUklQVE9SUyB8fCBpc0VudW0uY2FsbChTLCBrZXkpKSBUW2tleV0gPSBTW2tleV07XG4gICAgfVxuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247XG4iLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGRQcyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBFbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpO1xuICB2YXIgaSA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAoaS0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBkUCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG4gIHZhciBQO1xuICB3aGlsZSAobGVuZ3RoID4gaSkgZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59O1xuIiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIChPKSB7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYgKGhhcyhPLCBJRV9QUk9UTykpIHJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYgKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSU9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgaWYgKGtleSAhPSBJRV9QUk9UTykgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgU1JDID0gcmVxdWlyZSgnLi9fdWlkJykoJ3NyYycpO1xudmFyICR0b1N0cmluZyA9IHJlcXVpcmUoJy4vX2Z1bmN0aW9uLXRvLXN0cmluZycpO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgVFBMID0gKCcnICsgJHRvU3RyaW5nKS5zcGxpdChUT19TVFJJTkcpO1xuXG5yZXF1aXJlKCcuL19jb3JlJykuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsLCBzYWZlKSB7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgJ25hbWUnKSB8fCBoaWRlKHZhbCwgJ25hbWUnLCBrZXkpO1xuICBpZiAoT1trZXldID09PSB2YWwpIHJldHVybjtcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsIFNSQykgfHwgaGlkZSh2YWwsIFNSQywgT1trZXldID8gJycgKyBPW2tleV0gOiBUUEwuam9pbihTdHJpbmcoa2V5KSkpO1xuICBpZiAoTyA9PT0gZ2xvYmFsKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKCFzYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfSBlbHNlIGlmIChPW2tleV0pIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzW1NSQ10gfHwgJHRvU3RyaW5nLmNhbGwodGhpcyk7XG59KTtcbiIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgdGFnLCBzdGF0KSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSBkZWYoaXQsIFRBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWcgfSk7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246IGNvcmUudmVyc2lvbixcbiAgbW9kZTogcmVxdWlyZSgnLi9fbGlicmFyeScpID8gJ3B1cmUnIDogJ2dsb2JhbCcsXG4gIGNvcHlyaWdodDogJ8KpIDIwMjAgRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknXG59KTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikgeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgbWFwZm4gPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYgKG1hcHBpbmcpIG1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYgKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDKCk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvciAocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHsgYXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJykgfSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIi8vIGVsZW1lbnQtY2xvc2VzdCB8IENDMC0xLjAgfCBnaXRodWIuY29tL2pvbmF0aGFudG5lYWwvY2xvc2VzdFxuXG4oZnVuY3Rpb24gKEVsZW1lbnRQcm90bykge1xuXHRpZiAodHlwZW9mIEVsZW1lbnRQcm90by5tYXRjaGVzICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0RWxlbWVudFByb3RvLm1hdGNoZXMgPSBFbGVtZW50UHJvdG8ubXNNYXRjaGVzU2VsZWN0b3IgfHwgRWxlbWVudFByb3RvLm1vek1hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50UHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGZ1bmN0aW9uIG1hdGNoZXMoc2VsZWN0b3IpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gdGhpcztcblx0XHRcdHZhciBlbGVtZW50cyA9IChlbGVtZW50LmRvY3VtZW50IHx8IGVsZW1lbnQub3duZXJEb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cdFx0XHR2YXIgaW5kZXggPSAwO1xuXG5cdFx0XHR3aGlsZSAoZWxlbWVudHNbaW5kZXhdICYmIGVsZW1lbnRzW2luZGV4XSAhPT0gZWxlbWVudCkge1xuXHRcdFx0XHQrK2luZGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gQm9vbGVhbihlbGVtZW50c1tpbmRleF0pO1xuXHRcdH07XG5cdH1cblxuXHRpZiAodHlwZW9mIEVsZW1lbnRQcm90by5jbG9zZXN0ICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0RWxlbWVudFByb3RvLmNsb3Nlc3QgPSBmdW5jdGlvbiBjbG9zZXN0KHNlbGVjdG9yKSB7XG5cdFx0XHR2YXIgZWxlbWVudCA9IHRoaXM7XG5cblx0XHRcdHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IDEpIHtcblx0XHRcdFx0aWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbWVudDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH07XG5cdH1cbn0pKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSk7XG4iLCIvKiBnbG9iYWwgZGVmaW5lLCBLZXlib2FyZEV2ZW50LCBtb2R1bGUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblxuICB2YXIga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsID0ge1xuICAgIHBvbHlmaWxsOiBwb2x5ZmlsbCxcbiAgICBrZXlzOiB7XG4gICAgICAzOiAnQ2FuY2VsJyxcbiAgICAgIDY6ICdIZWxwJyxcbiAgICAgIDg6ICdCYWNrc3BhY2UnLFxuICAgICAgOTogJ1RhYicsXG4gICAgICAxMjogJ0NsZWFyJyxcbiAgICAgIDEzOiAnRW50ZXInLFxuICAgICAgMTY6ICdTaGlmdCcsXG4gICAgICAxNzogJ0NvbnRyb2wnLFxuICAgICAgMTg6ICdBbHQnLFxuICAgICAgMTk6ICdQYXVzZScsXG4gICAgICAyMDogJ0NhcHNMb2NrJyxcbiAgICAgIDI3OiAnRXNjYXBlJyxcbiAgICAgIDI4OiAnQ29udmVydCcsXG4gICAgICAyOTogJ05vbkNvbnZlcnQnLFxuICAgICAgMzA6ICdBY2NlcHQnLFxuICAgICAgMzE6ICdNb2RlQ2hhbmdlJyxcbiAgICAgIDMyOiAnICcsXG4gICAgICAzMzogJ1BhZ2VVcCcsXG4gICAgICAzNDogJ1BhZ2VEb3duJyxcbiAgICAgIDM1OiAnRW5kJyxcbiAgICAgIDM2OiAnSG9tZScsXG4gICAgICAzNzogJ0Fycm93TGVmdCcsXG4gICAgICAzODogJ0Fycm93VXAnLFxuICAgICAgMzk6ICdBcnJvd1JpZ2h0JyxcbiAgICAgIDQwOiAnQXJyb3dEb3duJyxcbiAgICAgIDQxOiAnU2VsZWN0JyxcbiAgICAgIDQyOiAnUHJpbnQnLFxuICAgICAgNDM6ICdFeGVjdXRlJyxcbiAgICAgIDQ0OiAnUHJpbnRTY3JlZW4nLFxuICAgICAgNDU6ICdJbnNlcnQnLFxuICAgICAgNDY6ICdEZWxldGUnLFxuICAgICAgNDg6IFsnMCcsICcpJ10sXG4gICAgICA0OTogWycxJywgJyEnXSxcbiAgICAgIDUwOiBbJzInLCAnQCddLFxuICAgICAgNTE6IFsnMycsICcjJ10sXG4gICAgICA1MjogWyc0JywgJyQnXSxcbiAgICAgIDUzOiBbJzUnLCAnJSddLFxuICAgICAgNTQ6IFsnNicsICdeJ10sXG4gICAgICA1NTogWyc3JywgJyYnXSxcbiAgICAgIDU2OiBbJzgnLCAnKiddLFxuICAgICAgNTc6IFsnOScsICcoJ10sXG4gICAgICA5MTogJ09TJyxcbiAgICAgIDkzOiAnQ29udGV4dE1lbnUnLFxuICAgICAgMTQ0OiAnTnVtTG9jaycsXG4gICAgICAxNDU6ICdTY3JvbGxMb2NrJyxcbiAgICAgIDE4MTogJ1ZvbHVtZU11dGUnLFxuICAgICAgMTgyOiAnVm9sdW1lRG93bicsXG4gICAgICAxODM6ICdWb2x1bWVVcCcsXG4gICAgICAxODY6IFsnOycsICc6J10sXG4gICAgICAxODc6IFsnPScsICcrJ10sXG4gICAgICAxODg6IFsnLCcsICc8J10sXG4gICAgICAxODk6IFsnLScsICdfJ10sXG4gICAgICAxOTA6IFsnLicsICc+J10sXG4gICAgICAxOTE6IFsnLycsICc/J10sXG4gICAgICAxOTI6IFsnYCcsICd+J10sXG4gICAgICAyMTk6IFsnWycsICd7J10sXG4gICAgICAyMjA6IFsnXFxcXCcsICd8J10sXG4gICAgICAyMjE6IFsnXScsICd9J10sXG4gICAgICAyMjI6IFtcIidcIiwgJ1wiJ10sXG4gICAgICAyMjQ6ICdNZXRhJyxcbiAgICAgIDIyNTogJ0FsdEdyYXBoJyxcbiAgICAgIDI0NjogJ0F0dG4nLFxuICAgICAgMjQ3OiAnQ3JTZWwnLFxuICAgICAgMjQ4OiAnRXhTZWwnLFxuICAgICAgMjQ5OiAnRXJhc2VFb2YnLFxuICAgICAgMjUwOiAnUGxheScsXG4gICAgICAyNTE6ICdab29tT3V0J1xuICAgIH1cbiAgfTtcblxuICAvLyBGdW5jdGlvbiBrZXlzIChGMS0yNCkuXG4gIHZhciBpO1xuICBmb3IgKGkgPSAxOyBpIDwgMjU7IGkrKykge1xuICAgIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzWzExMSArIGldID0gJ0YnICsgaTtcbiAgfVxuXG4gIC8vIFByaW50YWJsZSBBU0NJSSBjaGFyYWN0ZXJzLlxuICB2YXIgbGV0dGVyID0gJyc7XG4gIGZvciAoaSA9IDY1OyBpIDwgOTE7IGkrKykge1xuICAgIGxldHRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbaV0gPSBbbGV0dGVyLnRvTG93ZXJDYXNlKCksIGxldHRlci50b1VwcGVyQ2FzZSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBvbHlmaWxsICgpIHtcbiAgICBpZiAoISgnS2V5Ym9hcmRFdmVudCcgaW4gd2luZG93KSB8fFxuICAgICAgICAna2V5JyBpbiBLZXlib2FyZEV2ZW50LnByb3RvdHlwZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFBvbHlmaWxsIGBrZXlgIG9uIGBLZXlib2FyZEV2ZW50YC5cbiAgICB2YXIgcHJvdG8gPSB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1t0aGlzLndoaWNoIHx8IHRoaXMua2V5Q29kZV07XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgIGtleSA9IGtleVsrdGhpcy5zaGlmdEtleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgfVxuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEtleWJvYXJkRXZlbnQucHJvdG90eXBlLCAna2V5JywgcHJvdG8pO1xuICAgIHJldHVybiBwcm90bztcbiAgfVxuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsJywga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcbiAgfSBlbHNlIGlmICh3aW5kb3cpIHtcbiAgICB3aW5kb3cua2V5Ym9hcmRldmVudEtleVBvbHlmaWxsID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9XG5cbn0pKCk7XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiaW1wb3J0IGJlaGF2aW9yIGZyb20gJy4vc3JjL2JlaGF2aW9yJ1xuaW1wb3J0IGRlbGVnYXRlIGZyb20gJy4vc3JjL2RlbGVnYXRlJ1xuaW1wb3J0IGRlbGVnYXRlQWxsIGZyb20gJy4vc3JjL2RlbGVnYXRlQWxsJ1xuaW1wb3J0IGlnbm9yZSBmcm9tICcuL3NyYy9pZ25vcmUnXG5pbXBvcnQga2V5bWFwIGZyb20gJy4vc3JjL2tleW1hcCdcbmltcG9ydCBvbmNlIGZyb20gJy4vc3JjL29uY2UnXG5cbmV4cG9ydCB7YmVoYXZpb3IsIGRlbGVnYXRlLCBkZWxlZ2F0ZUFsbCwgaWdub3JlLCBrZXltYXAsIG9uY2V9XG4iLCJpbXBvcnQgYXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nXG5pbXBvcnQgZGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCBkZWxlZ2F0ZUFsbCBmcm9tICcuL2RlbGVnYXRlQWxsJ1xuXG5jb25zdCBERUxFR0FURV9QQVRURVJOID0gL14oLispOmRlbGVnYXRlXFwoKC4rKVxcKSQvXG5jb25zdCBTUEFDRSA9ICcgJ1xuXG5jb25zdCBnZXRMaXN0ZW5lcnMgPSAodHlwZSwgaGFuZGxlcikgPT4ge1xuICBjb25zdCBtYXRjaCA9IHR5cGUubWF0Y2goREVMRUdBVEVfUEFUVEVSTilcbiAgbGV0IHNlbGVjdG9yXG4gIGlmIChtYXRjaCkge1xuICAgIHR5cGUgPSBtYXRjaFsxXVxuICAgIHNlbGVjdG9yID0gbWF0Y2hbMl1cbiAgfVxuXG4gIGxldCBvcHRpb25zXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zID0ge1xuICAgICAgY2FwdHVyZTogcG9wS2V5KGhhbmRsZXIsICdjYXB0dXJlJyksXG4gICAgICBwYXNzaXZlOiBwb3BLZXkoaGFuZGxlciwgJ3Bhc3NpdmUnKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGxpc3RlbmVyID0ge1xuICAgIHNlbGVjdG9yLFxuICAgIG9wdGlvbnMsXG4gICAgZGVsZWdhdGU6IHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0JyA/IGRlbGVnYXRlQWxsKGhhbmRsZXIpIDogc2VsZWN0b3IgPyBkZWxlZ2F0ZShzZWxlY3RvciwgaGFuZGxlcikgOiBoYW5kbGVyXG4gIH1cblxuICBpZiAodHlwZS5pbmRleE9mKFNQQUNFKSA+IC0xKSB7XG4gICAgcmV0dXJuIHR5cGUuc3BsaXQoU1BBQ0UpLm1hcChfdHlwZSA9PiB7XG4gICAgICByZXR1cm4gYXNzaWduKHt0eXBlOiBfdHlwZX0sIGxpc3RlbmVyKVxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgbGlzdGVuZXIudHlwZSA9IHR5cGVcbiAgICByZXR1cm4gW2xpc3RlbmVyXVxuICB9XG59XG5cbmNvbnN0IHBvcEtleSA9IChvYmosIGtleSkgPT4ge1xuICBjb25zdCB2YWx1ZSA9IG9ialtrZXldXG4gIGRlbGV0ZSBvYmpba2V5XVxuICByZXR1cm4gdmFsdWVcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmVoYXZpb3IoZXZlbnRzLCBwcm9wcykge1xuICBjb25zdCBsaXN0ZW5lcnMgPSBPYmplY3Qua2V5cyhldmVudHMpLnJlZHVjZSgobWVtbywgdHlwZSkgPT4ge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IGdldExpc3RlbmVycyh0eXBlLCBldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIG1lbW8uY29uY2F0KGxpc3RlbmVycylcbiAgfSwgW10pXG5cbiAgcmV0dXJuIGFzc2lnbihcbiAgICB7XG4gICAgICBhZGQ6IGVsZW1lbnQgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIGxpc3RlbmVycykge1xuICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihsaXN0ZW5lci50eXBlLCBsaXN0ZW5lci5kZWxlZ2F0ZSwgbGlzdGVuZXIub3B0aW9ucylcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHJlbW92ZTogZWxlbWVudCA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgbGlzdGVuZXJzKSB7XG4gICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGxpc3RlbmVyLnR5cGUsIGxpc3RlbmVyLmRlbGVnYXRlLCBsaXN0ZW5lci5vcHRpb25zKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBwcm9wc1xuICApXG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb21wb3NlKGZ1bmN0aW9ucykge1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBmdW5jdGlvbnMuc29tZShmbiA9PiB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBlKSA9PT0gZmFsc2VcbiAgICB9KVxuICB9XG59XG4iLCIvLyBwb2x5ZmlsbCBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0XG5pbXBvcnQgJ2VsZW1lbnQtY2xvc2VzdCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGVsZWdhdGUoc2VsZWN0b3IsIGZuKSB7XG4gIHJldHVybiBldmVudCA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3Qoc2VsZWN0b3IpXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGFyZ2V0LCBldmVudClcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBkZWxlZ2F0ZSBmcm9tICcuL2RlbGVnYXRlJ1xuaW1wb3J0IGNvbXBvc2UgZnJvbSAnLi9jb21wb3NlJ1xuXG5jb25zdCBTUExBVCA9ICcqJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWxlZ2F0ZUFsbChzZWxlY3RvcnMpIHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHNlbGVjdG9ycylcblxuICAvLyBYWFggb3B0aW1pemF0aW9uOiBpZiB0aGVyZSBpcyBvbmx5IG9uZSBoYW5kbGVyIGFuZCBpdCBhcHBsaWVzIHRvXG4gIC8vIGFsbCBlbGVtZW50cyAodGhlIFwiKlwiIENTUyBzZWxlY3RvciksIHRoZW4ganVzdCByZXR1cm4gdGhhdFxuICAvLyBoYW5kbGVyXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMSAmJiBrZXlzWzBdID09PSBTUExBVCkge1xuICAgIHJldHVybiBzZWxlY3RvcnNbU1BMQVRdXG4gIH1cblxuICBjb25zdCBkZWxlZ2F0ZXMgPSBrZXlzLnJlZHVjZShmdW5jdGlvbihtZW1vLCBzZWxlY3Rvcikge1xuICAgIG1lbW8ucHVzaChkZWxlZ2F0ZShzZWxlY3Rvciwgc2VsZWN0b3JzW3NlbGVjdG9yXSkpXG4gICAgcmV0dXJuIG1lbW9cbiAgfSwgW10pXG4gIHJldHVybiBjb21wb3NlKGRlbGVnYXRlcylcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlnbm9yZShlbGVtZW50LCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gaWdub3JhbmNlKGUpIHtcbiAgICBpZiAoZWxlbWVudCAhPT0gZS50YXJnZXQgJiYgIWVsZW1lbnQuY29udGFpbnMoZS50YXJnZXQpKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBlKVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0ICdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCdcblxuLy8gdGhlc2UgYXJlIHRoZSBvbmx5IHJlbGV2YW50IG1vZGlmaWVycyBzdXBwb3J0ZWQgb24gYWxsIHBsYXRmb3Jtcyxcbi8vIGFjY29yZGluZyB0byBNRE46XG4vLyA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0tleWJvYXJkRXZlbnQvZ2V0TW9kaWZpZXJTdGF0ZT5cbmNvbnN0IE1PRElGSUVSUyA9IHtcbiAgQWx0OiAnYWx0S2V5JyxcbiAgQ29udHJvbDogJ2N0cmxLZXknLFxuICBDdHJsOiAnY3RybEtleScsXG4gIFNoaWZ0OiAnc2hpZnRLZXknXG59XG5cbmNvbnN0IE1PRElGSUVSX1NFUEFSQVRPUiA9ICcrJ1xuXG5mdW5jdGlvbiBnZXRFdmVudEtleShldmVudCwgaGFzTW9kaWZpZXJzKSB7XG4gIGxldCBrZXkgPSBldmVudC5rZXlcbiAgaWYgKGhhc01vZGlmaWVycykge1xuICAgIGZvciAoY29uc3QgbW9kaWZpZXIgaW4gTU9ESUZJRVJTKSB7XG4gICAgICBpZiAoZXZlbnRbTU9ESUZJRVJTW21vZGlmaWVyXV0gPT09IHRydWUpIHtcbiAgICAgICAga2V5ID0gW21vZGlmaWVyLCBrZXldLmpvaW4oTU9ESUZJRVJfU0VQQVJBVE9SKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4ga2V5XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGtleW1hcChrZXlzKSB7XG4gIGNvbnN0IGhhc01vZGlmaWVycyA9IE9iamVjdC5rZXlzKGtleXMpLnNvbWUoa2V5ID0+IHtcbiAgICByZXR1cm4ga2V5LmluZGV4T2YoTU9ESUZJRVJfU0VQQVJBVE9SKSA+IC0xXG4gIH0pXG4gIHJldHVybiBmdW5jdGlvbiBrZXltYXBwZXIoZXZlbnQpIHtcbiAgICBjb25zdCBrZXkgPSBnZXRFdmVudEtleShldmVudCwgaGFzTW9kaWZpZXJzKVxuICAgIHJldHVybiBba2V5LCBrZXkudG9Mb3dlckNhc2UoKV0ucmVkdWNlKChyZXN1bHQsIF9rZXkpID0+IHtcbiAgICAgIGlmIChfa2V5IGluIGtleXMpIHtcbiAgICAgICAgcmV0dXJuIGtleXNba2V5XS5jYWxsKHRoaXMsIGV2ZW50KVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IHtNT0RJRklFUlN9XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvbmNlKGxpc3RlbmVyLCBvcHRpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwcGVkT25jZShlKSB7XG4gICAgZS5jdXJyZW50VGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZS50eXBlLCB3cmFwcGVkT25jZSwgb3B0aW9ucylcbiAgICByZXR1cm4gbGlzdGVuZXIuY2FsbCh0aGlzLCBlKVxuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCAnLi4vcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kJztcclxuY29uc3QgdG9nZ2xlID0gcmVxdWlyZSgnLi4vdXRpbHMvdG9nZ2xlJyk7XHJcbmNvbnN0IGlzRWxlbWVudEluVmlld3BvcnQgPSByZXF1aXJlKCcuLi91dGlscy9pcy1pbi12aWV3cG9ydCcpO1xyXG5jb25zdCBCVVRUT04gPSBgLmFjY29yZGlvbi1idXR0b25bYXJpYS1jb250cm9sc11gO1xyXG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcclxuY29uc3QgTVVMVElTRUxFQ1RBQkxFID0gJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJztcclxuY29uc3QgTVVMVElTRUxFQ1RBQkxFX0NMQVNTID0gJ2FjY29yZGlvbi1tdWx0aXNlbGVjdGFibGUnO1xyXG5jb25zdCBCVUxLX0ZVTkNUSU9OX09QRU5fVEVYVCA9IFwiw4VibiBhbGxlXCI7XHJcbmNvbnN0IEJVTEtfRlVOQ1RJT05fQ0xPU0VfVEVYVCA9IFwiTHVrIGFsbGVcIjtcclxuY29uc3QgQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFID0gXCJkYXRhLWFjY29yZGlvbi1idWxrLWV4cGFuZFwiO1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgY2xpY2sgZnVuY3Rpb25hbGl0eSB0byBhY2NvcmRpb24gbGlzdFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkYWNjb3JkaW9uIHRoZSBhY2NvcmRpb24gdWwgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gQWNjb3JkaW9uKCRhY2NvcmRpb24pe1xyXG4gIGlmKCEkYWNjb3JkaW9uKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBhY2NvcmRpb24gZ3JvdXAgZWxlbWVudGApO1xyXG4gIH1cclxuICB0aGlzLmFjY29yZGlvbiA9ICRhY2NvcmRpb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRsaXN0ZW5lcnMgb24gY2xpY2sgZWxlbWVudHMgaW4gYWNjb3JkaW9uIGxpc3RcclxuICovXHJcbkFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5idXR0b25zID0gdGhpcy5hY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xyXG4gIGlmKHRoaXMuYnV0dG9ucy5sZW5ndGggPT0gMCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgYWNjb3JkaW9uIGJ1dHRvbnNgKTtcclxuICB9XHJcblxyXG4gIC8vIGxvb3AgYnV0dG9ucyBpbiBsaXN0XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspe1xyXG4gICAgbGV0IGN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnNbaV07XHJcbiAgICBcclxuICAgIC8vIFZlcmlmeSBzdGF0ZSBvbiBidXR0b24gYW5kIHN0YXRlIG9uIHBhbmVsXHJcbiAgICBsZXQgZXhwYW5kZWQgPSBjdXJyZW50QnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJztcclxuICAgIHRoaXMudG9nZ2xlQnV0dG9uKGN1cnJlbnRCdXR0b24sIGV4cGFuZGVkKTtcclxuICAgIFxyXG4gICAgLy8gU2V0IGNsaWNrIGV2ZW50IG9uIGFjY29yZGlvbiBidXR0b25zXHJcbiAgICBjdXJyZW50QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ldmVudE9uQ2xpY2suYmluZCh0aGlzLCBjdXJyZW50QnV0dG9uKSwgZmFsc2UpO1xyXG4gICAgY3VycmVudEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZXZlbnRPbkNsaWNrLmJpbmQodGhpcywgY3VycmVudEJ1dHRvbiksIGZhbHNlKTtcclxuICAgIFxyXG4gICAgLy8gU2V0IGNsaWNrIGV2ZW50IG9uIGJ1bGsgYnV0dG9uIGlmIHByZXNlbnRcclxuICAgIGxldCBwcmV2U2libGluZyA9IHRoaXMuYWNjb3JkaW9uLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgO1xyXG4gICAgaWYocHJldlNpYmxpbmcgIT09IG51bGwgJiYgcHJldlNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24tYnVsay1idXR0b24nKSl7XHJcbiAgICAgIHRoaXMuYnVsa0Z1bmN0aW9uQnV0dG9uID0gcHJldlNpYmxpbmc7XHJcbiAgICAgIHRoaXMuYnVsa0Z1bmN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5idWxrRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQnVsayBldmVudCBoYW5kbGVyOiBUcmlnZ2VyZWQgd2hlbiBjbGlja2luZyBvbiAuYWNjb3JkaW9uLWJ1bGstYnV0dG9uXHJcbiAqL1xyXG5BY2NvcmRpb24ucHJvdG90eXBlLmJ1bGtFdmVudCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyICRtb2R1bGUgPSB0aGlzO1xyXG4gIGlmKCEkbW9kdWxlLmFjY29yZGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbicpKXsgIFxyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhY2NvcmRpb24uYCk7XHJcbiAgfVxyXG4gIGlmKCRtb2R1bGUuYnV0dG9ucy5sZW5ndGggPT0gMCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgYWNjb3JkaW9uIGJ1dHRvbnNgKTtcclxuICB9XHJcbiAgICBcclxuICBsZXQgZXhwYW5kID0gdHJ1ZTtcclxuICBpZigkbW9kdWxlLmJ1bGtGdW5jdGlvbkJ1dHRvbi5nZXRBdHRyaWJ1dGUoQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFKSA9PT0gXCJmYWxzZVwiKSB7XHJcbiAgICBleHBhbmQgPSBmYWxzZTtcclxuICB9XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAkbW9kdWxlLmJ1dHRvbnMubGVuZ3RoOyBpKyspe1xyXG4gICAgJG1vZHVsZS50b2dnbGVCdXR0b24oJG1vZHVsZS5idXR0b25zW2ldLCBleHBhbmQpO1xyXG4gIH1cclxuICBcclxuICAkbW9kdWxlLmJ1bGtGdW5jdGlvbkJ1dHRvbi5zZXRBdHRyaWJ1dGUoQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFLCAhZXhwYW5kKTtcclxuICBpZighZXhwYW5kID09PSB0cnVlKXtcclxuICAgICRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLmlubmVyVGV4dCA9IEJVTEtfRlVOQ1RJT05fT1BFTl9URVhUO1xyXG4gIH0gZWxzZXtcclxuICAgICRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLmlubmVyVGV4dCA9IEJVTEtfRlVOQ1RJT05fQ0xPU0VfVEVYVDtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBY2NvcmRpb24gYnV0dG9uIGV2ZW50IGhhbmRsZXI6IFRvZ2dsZXMgYWNjb3JkaW9uXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9ICRidXR0b24gXHJcbiAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBlIFxyXG4gKi9cclxuQWNjb3JkaW9uLnByb3RvdHlwZS5ldmVudE9uQ2xpY2sgPSBmdW5jdGlvbiAoJGJ1dHRvbiwgZSkge1xyXG4gIHZhciAkbW9kdWxlID0gdGhpcztcclxuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuICAkbW9kdWxlLnRvZ2dsZUJ1dHRvbigkYnV0dG9uKTtcclxuICBpZiAoJGJ1dHRvbi5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSAndHJ1ZScpIHtcclxuICAgIC8vIFdlIHdlcmUganVzdCBleHBhbmRlZCwgYnV0IGlmIGFub3RoZXIgYWNjb3JkaW9uIHdhcyBhbHNvIGp1c3RcclxuICAgIC8vIGNvbGxhcHNlZCwgd2UgbWF5IG5vIGxvbmdlciBiZSBpbiB0aGUgdmlld3BvcnQuIFRoaXMgZW5zdXJlc1xyXG4gICAgLy8gdGhhdCB3ZSBhcmUgc3RpbGwgdmlzaWJsZSwgc28gdGhlIHVzZXIgaXNuJ3QgY29uZnVzZWQuXHJcbiAgICBpZiAoIWlzRWxlbWVudEluVmlld3BvcnQoJGJ1dHRvbikpICRidXR0b24uc2Nyb2xsSW50b1ZpZXcoKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUb2dnbGUgYSBidXR0b24ncyBcInByZXNzZWRcIiBzdGF0ZSwgb3B0aW9uYWxseSBwcm92aWRpbmcgYSB0YXJnZXRcclxuICogc3RhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxyXG4gKiBAcGFyYW0ge2Jvb2xlYW4/fSBleHBhbmRlZCBJZiBubyBzdGF0ZSBpcyBwcm92aWRlZCwgdGhlIGN1cnJlbnRcclxuICogc3RhdGUgd2lsbCBiZSB0b2dnbGVkIChmcm9tIGZhbHNlIHRvIHRydWUsIGFuZCB2aWNlLXZlcnNhKS5cclxuICogQHJldHVybiB7Ym9vbGVhbn0gdGhlIHJlc3VsdGluZyBzdGF0ZVxyXG4gKi9cclxuIEFjY29yZGlvbi5wcm90b3R5cGUudG9nZ2xlQnV0dG9uID0gZnVuY3Rpb24gKGJ1dHRvbiwgZXhwYW5kZWQpIHtcclxuICBsZXQgYWNjb3JkaW9uID0gbnVsbDtcclxuICBpZihidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uJykpe1xyXG4gICAgYWNjb3JkaW9uID0gYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICB9IGVsc2UgaWYoYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uJykpe1xyXG4gICAgYWNjb3JkaW9uID0gYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIH1cclxuXHJcbiAgZXhwYW5kZWQgPSB0b2dnbGUoYnV0dG9uLCBleHBhbmRlZCk7XHJcbiAgaWYoZXhwYW5kZWQpeyAgICBcclxuICAgIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5hY2NvcmRpb24ub3BlbicpO1xyXG4gICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICB9IGVsc2V7XHJcbiAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmFjY29yZGlvbi5jbG9zZScpO1xyXG4gICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgfVxyXG5cclxuICBsZXQgbXVsdGlzZWxlY3RhYmxlID0gZmFsc2U7XHJcbiAgaWYoYWNjb3JkaW9uICE9PSBudWxsICYmIChhY2NvcmRpb24uZ2V0QXR0cmlidXRlKE1VTFRJU0VMRUNUQUJMRSkgPT09ICd0cnVlJyB8fCBhY2NvcmRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKE1VTFRJU0VMRUNUQUJMRV9DTEFTUykpKXtcclxuICAgIG11bHRpc2VsZWN0YWJsZSA9IHRydWU7XHJcbiAgICBsZXQgYnVsa0Z1bmN0aW9uID0gYWNjb3JkaW9uLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICBpZihidWxrRnVuY3Rpb24gIT09IG51bGwgJiYgYnVsa0Z1bmN0aW9uLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uLWJ1bGstYnV0dG9uJykpe1xyXG4gICAgICBsZXQgYnV0dG9ucyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbiAgICAgIGxldCBidXR0b25zT3BlbiA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTisnW2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICAgIGxldCBidXR0b25zQ2xvc2VkID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKydbYXJpYS1leHBhbmRlZD1cImZhbHNlXCJdJyk7XHJcbiAgICAgIGxldCBuZXdTdGF0dXMgPSB0cnVlO1xyXG4gICAgICBpZihidXR0b25zLmxlbmd0aCA9PT0gYnV0dG9uc09wZW4ubGVuZ3RoKXtcclxuICAgICAgICBuZXdTdGF0dXMgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBpZihidXR0b25zLmxlbmd0aCA9PT0gYnV0dG9uc0Nsb3NlZC5sZW5ndGgpe1xyXG4gICAgICAgIG5ld1N0YXR1cyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgYnVsa0Z1bmN0aW9uLnNldEF0dHJpYnV0ZShCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUsIG5ld1N0YXR1cyk7XHJcbiAgICAgIGlmKG5ld1N0YXR1cyA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgYnVsa0Z1bmN0aW9uLmlubmVyVGV4dCA9IEJVTEtfRlVOQ1RJT05fT1BFTl9URVhUO1xyXG4gICAgICB9IGVsc2V7XHJcbiAgICAgICAgYnVsa0Z1bmN0aW9uLmlubmVyVGV4dCA9IEJVTEtfRlVOQ1RJT05fQ0xPU0VfVEVYVDtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChleHBhbmRlZCAmJiAhbXVsdGlzZWxlY3RhYmxlKSB7XHJcbiAgICBsZXQgYnV0dG9ucyA9IFsgYnV0dG9uIF07XHJcbiAgICBpZihhY2NvcmRpb24gIT09IG51bGwpIHtcclxuICAgICAgYnV0dG9ucyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYnV0dG9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgY3VycmVudEJ1dHR0b24gPSBidXR0b25zW2ldO1xyXG4gICAgICBpZiAoY3VycmVudEJ1dHR0b24gIT09IGJ1dHRvbiAmJiBjdXJyZW50QnV0dHRvbi5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnID09PSB0cnVlKSkge1xyXG4gICAgICAgIHRvZ2dsZShjdXJyZW50QnV0dHRvbiwgZmFsc2UpO1xyXG4gICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuYWNjb3JkaW9uLmNsb3NlJyk7XHJcbiAgICAgICAgY3VycmVudEJ1dHR0b24uZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFjY29yZGlvbjsiLCIndXNlIHN0cmljdCc7XHJcbmZ1bmN0aW9uIEFsZXJ0KGFsZXJ0KXtcclxuICAgIHRoaXMuYWxlcnQgPSBhbGVydDtcclxufVxyXG5cclxuQWxlcnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gICAgbGV0IGNsb3NlID0gdGhpcy5hbGVydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhbGVydC1jbG9zZScpO1xyXG4gICAgaWYoY2xvc2UubGVuZ3RoID09PSAxKXtcclxuICAgICAgICBjbG9zZVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuQWxlcnQucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5hbGVydC5jbGFzc0xpc3QuYWRkKCdkLW5vbmUnKTtcclxuICAgIGxldCBldmVudEhpZGUgPSBuZXcgRXZlbnQoJ2Zkcy5hbGVydC5oaWRlJyk7XHJcbiAgICB0aGlzLmFsZXJ0LmRpc3BhdGNoRXZlbnQoZXZlbnRIaWRlKTtcclxufTtcclxuXHJcbkFsZXJ0LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuYWxlcnQuY2xhc3NMaXN0LnJlbW92ZSgnZC1ub25lJyk7XHJcbiAgICBcclxuICAgIGxldCBldmVudFNob3cgPSBuZXcgRXZlbnQoJ2Zkcy5hbGVydC5zaG93Jyk7XHJcbiAgICB0aGlzLmFsZXJ0LmRpc3BhdGNoRXZlbnQoZXZlbnRTaG93KTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFsZXJ0OyIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0ICcuLi9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQnO1xyXG5cclxuY29uc3QgVE9HR0xFX1RBUkdFVF9BVFRSSUJVVEUgPSAnZGF0YS1hcmlhLWNvbnRyb2xzJztcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gY2hlY2tib3ggY29sbGFwc2UgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gY2hlY2tib3hFbGVtZW50IFxyXG4gKi9cclxuZnVuY3Rpb24gQ2hlY2tib3hUb2dnbGVDb250ZW50KGNoZWNrYm94RWxlbWVudCl7XHJcbiAgICB0aGlzLmNoZWNrYm94RWxlbWVudCA9IGNoZWNrYm94RWxlbWVudDtcclxuICAgIHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzIG9uIGNoZWNrYm94IHN0YXRlIGNoYW5nZVxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuY2hlY2tib3hFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMudG9nZ2xlLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy50b2dnbGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSBjaGVja2JveCBjb250ZW50XHJcbiAqL1xyXG5DaGVja2JveFRvZ2dsZUNvbnRlbnQucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgJG1vZHVsZSA9IHRoaXM7XHJcbiAgICB2YXIgdGFyZ2V0QXR0ciA9IHRoaXMuY2hlY2tib3hFbGVtZW50LmdldEF0dHJpYnV0ZShUT0dHTEVfVEFSR0VUX0FUVFJJQlVURSlcclxuICAgIHZhciB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIpO1xyXG4gICAgaWYodGFyZ2V0RWwgPT09IG51bGwgfHwgdGFyZ2V0RWwgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBwYW5lbCBlbGVtZW50LiBWZXJpZnkgdmFsdWUgb2YgYXR0cmlidXRlIGArIFRPR0dMRV9UQVJHRVRfQVRUUklCVVRFKTtcclxuICAgIH1cclxuICAgIGlmKHRoaXMuY2hlY2tib3hFbGVtZW50LmNoZWNrZWQpe1xyXG4gICAgICAgICRtb2R1bGUuZXhwYW5kKHRoaXMuY2hlY2tib3hFbGVtZW50LCB0YXJnZXRFbCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICAkbW9kdWxlLmNvbGxhcHNlKHRoaXMuY2hlY2tib3hFbGVtZW50LCB0YXJnZXRFbCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHBhbmQgY29udGVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGNoZWNrYm94RWxlbWVudCBDaGVja2JveCBpbnB1dCBlbGVtZW50IFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50RWxlbWVudCBDb250ZW50IGNvbnRhaW5lciBlbGVtZW50IFxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS5leHBhbmQgPSBmdW5jdGlvbihjaGVja2JveEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KXtcclxuICAgIGlmKGNoZWNrYm94RWxlbWVudCAhPT0gbnVsbCAmJiBjaGVja2JveEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICBjaGVja2JveEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWFyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2UuZXhwYW5kZWQnKTtcclxuICAgICAgICBjaGVja2JveEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ29sbGFwc2UgY29udGVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGNoZWNrYm94RWxlbWVudCBDaGVja2JveCBpbnB1dCBlbGVtZW50IFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50RWxlbWVudCBDb250ZW50IGNvbnRhaW5lciBlbGVtZW50IFxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS5jb2xsYXBzZSA9IGZ1bmN0aW9uKHRyaWdnZXJFbCwgdGFyZ2V0RWwpe1xyXG4gICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2UuY29sbGFwc2VkJyk7XHJcbiAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENoZWNrYm94VG9nZ2xlQ29udGVudDtcclxuIiwiY29uc3QgcmVjZXB0b3IgPSByZXF1aXJlKFwicmVjZXB0b3JcIik7XHJcbmNvbnN0IGJlaGF2aW9yID0gcmVxdWlyZShcIi4uL3V0aWxzL2JlaGF2aW9yXCIpO1xyXG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKFwiLi4vdXRpbHMvc2VsZWN0XCIpO1xyXG5jb25zdCB7IHByZWZpeDogUFJFRklYIH0gPSByZXF1aXJlKFwiLi4vY29uZmlnXCIpO1xyXG5jb25zdCB7IENMSUNLIH0gPSByZXF1aXJlKFwiLi4vZXZlbnRzXCIpO1xyXG5jb25zdCBhY3RpdmVFbGVtZW50ID0gcmVxdWlyZShcIi4uL3V0aWxzL2FjdGl2ZS1lbGVtZW50XCIpO1xyXG5jb25zdCBpc0lvc0RldmljZSA9IHJlcXVpcmUoXCIuLi91dGlscy9pcy1pb3MtZGV2aWNlXCIpO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVJfQ0xBU1MgPSBgZGF0ZS1waWNrZXJgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9XUkFQUEVSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X193cmFwcGVyYDtcclxuY29uc3QgREFURV9QSUNLRVJfSU5JVElBTElaRURfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU30tLWluaXRpYWxpemVkYDtcclxuY29uc3QgREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9LS1hY3RpdmVgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9faW50ZXJuYWwtaW5wdXRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fZXh0ZXJuYWwtaW5wdXRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2J1dHRvbmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19jYWxlbmRhcmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX1NUQVRVU19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fc3RhdHVzYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF0ZWA7XHJcblxyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tZm9jdXNlZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfU0VMRUNURURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1BSRVZJT1VTX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXByZXZpb3VzLW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLWN1cnJlbnQtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX05FWFRfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tbmV4dC1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9UT0RBWV9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS10b2RheWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9TVEFSVF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlLXN0YXJ0YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0VORF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1yYW5nZS1kYXRlLWVuZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfV0lUSElOX1JBTkdFX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXdpdGhpbi1yYW5nZWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3ByZXZpb3VzLXllYXJgO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQteWVhcmA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX25leHQtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoLXNlbGVjdGlvbmA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyLXNlbGVjdGlvbmA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9NT05USF9DTEFTU30tLWZvY3VzZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9TRUxFQ1RFRF9DTEFTUyA9IGAke0NBTEVOREFSX01PTlRIX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTID0gYCR7Q0FMRU5EQVJfWUVBUl9DTEFTU30tLWZvY3VzZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfWUVBUl9DTEFTU30tLXNlbGVjdGVkYDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMteWVhci1jaHVua2A7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DSFVOS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC15ZWFyLWNodW5rYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9QSUNLRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2RhdGUtcGlja2VyYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfUElDS0VSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aC1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1BJQ0tFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9feWVhci1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9UQUJMRV9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fdGFibGVgO1xyXG5jb25zdCBDQUxFTkRBUl9ST1dfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3Jvd2A7XHJcbmNvbnN0IENBTEVOREFSX0NFTExfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX2NlbGxgO1xyXG5jb25zdCBDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTUyA9IGAke0NBTEVOREFSX0NFTExfQ0xBU1N9LS1jZW50ZXItaXRlbXNgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9MQUJFTF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtbGFiZWxgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVlfT0ZfV0VFS19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF5LW9mLXdlZWtgO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVIgPSBgLiR7REFURV9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgREFURV9QSUNLRVJfQlVUVE9OID0gYC4ke0RBVEVfUElDS0VSX0JVVFRPTl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVCA9IGAuJHtEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVCA9IGAuJHtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9DQUxFTkRBUiA9IGAuJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9TVEFUVVMgPSBgLiR7REFURV9QSUNLRVJfU1RBVFVTX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEUgPSBgLiR7Q0FMRU5EQVJfREFURV9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQgPSBgLiR7Q0FMRU5EQVJfREFURV9GT0NVU0VEX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USCA9IGAuJHtDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUiA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX01PTlRIID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUiA9IGAuJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9NT05USCA9IGAuJHtDQUxFTkRBUl9ORVhUX01PTlRIX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNUSU9OID0gYC4ke0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVElPTiA9IGAuJHtDQUxFTkRBUl9NT05USF9TRUxFQ1RJT05fQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEggPSBgLiR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUiA9IGAuJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTksgPSBgLiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTksgPSBgLiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUElDS0VSID0gYC4ke0NBTEVOREFSX0RBVEVfUElDS0VSX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1BJQ0tFUiA9IGAuJHtDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9QSUNLRVIgPSBgLiR7Q0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1N9YDtcclxuXHJcbmNvbnN0IFZBTElEQVRJT05fTUVTU0FHRSA9IFwiSW5kdGFzdCB2ZW5saWdzdCBlbiBneWxkaWcgZGF0b1wiO1xyXG5cclxuY29uc3QgTU9OVEhfTEFCRUxTID0gW1xyXG4gIFwiSmFudWFyXCIsXHJcbiAgXCJGZWJydWFyXCIsXHJcbiAgXCJNYXJ0c1wiLFxyXG4gIFwiQXByaWxcIixcclxuICBcIk1halwiLFxyXG4gIFwiSnVuaVwiLFxyXG4gIFwiSnVsaVwiLFxyXG4gIFwiQXVndXN0XCIsXHJcbiAgXCJTZXB0ZW1iZXJcIixcclxuICBcIk9rdG9iZXJcIixcclxuICBcIk5vdmVtYmVyXCIsXHJcbiAgXCJEZWNlbWJlclwiLFxyXG5dO1xyXG5cclxuY29uc3QgREFZX09GX1dFRUtfTEFCRUxTID0gW1xyXG4gIFwiTWFuZGFnXCIsXHJcbiAgXCJUaXJzZGFnXCIsXHJcbiAgXCJPbnNkYWdcIixcclxuICBcIlRvcnNkYWdcIixcclxuICBcIkZyZWRhZ1wiLFxyXG4gIFwiTMO4cmRhZ1wiLFxyXG4gIFwiU8O4bmRhZ1wiLFxyXG5dO1xyXG5cclxuY29uc3QgRU5URVJfS0VZQ09ERSA9IDEzO1xyXG5cclxuY29uc3QgWUVBUl9DSFVOSyA9IDEyO1xyXG5cclxuY29uc3QgREVGQVVMVF9NSU5fREFURSA9IFwiMDAwMC0wMS0wMVwiO1xyXG5jb25zdCBERUZBVUxUX0VYVEVSTkFMX0RBVEVfRk9STUFUID0gXCJERC9NTS9ZWVlZXCI7XHJcbmNvbnN0IElOVEVSTkFMX0RBVEVfRk9STUFUID0gXCJZWVlZLU1NLUREXCI7XHJcblxyXG5jb25zdCBOT1RfRElTQUJMRURfU0VMRUNUT1IgPSBcIjpub3QoW2Rpc2FibGVkXSlcIjtcclxuXHJcbmNvbnN0IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMgPSAoLi4uc2VsZWN0b3JzKSA9PlxyXG4gIHNlbGVjdG9ycy5tYXAoKHF1ZXJ5KSA9PiBxdWVyeSArIE5PVF9ESVNBQkxFRF9TRUxFQ1RPUikuam9pbihcIiwgXCIpO1xyXG5cclxuY29uc3QgREFURV9QSUNLRVJfRk9DVVNBQkxFID0gcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyhcclxuICBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSLFxyXG4gIENBTEVOREFSX1BSRVZJT1VTX01PTlRILFxyXG4gIENBTEVOREFSX1lFQVJfU0VMRUNUSU9OLFxyXG4gIENBTEVOREFSX01PTlRIX1NFTEVDVElPTixcclxuICBDQUxFTkRBUl9ORVhUX1lFQVIsXHJcbiAgQ0FMRU5EQVJfTkVYVF9NT05USCxcclxuICBDQUxFTkRBUl9EQVRFX0ZPQ1VTRURcclxuKTtcclxuXHJcbmNvbnN0IE1PTlRIX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxyXG4gIENBTEVOREFSX01PTlRIX0ZPQ1VTRURcclxuKTtcclxuXHJcbmNvbnN0IFlFQVJfUElDS0VSX0ZPQ1VTQUJMRSA9IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMoXHJcbiAgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyxcclxuICBDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTkssXHJcbiAgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEXHJcbik7XHJcblxyXG4vLyAjcmVnaW9uIERhdGUgTWFuaXB1bGF0aW9uIEZ1bmN0aW9uc1xyXG5cclxuLyoqXHJcbiAqIEtlZXAgZGF0ZSB3aXRoaW4gbW9udGguIE1vbnRoIHdvdWxkIG9ubHkgYmUgb3ZlciBieSAxIHRvIDMgZGF5c1xyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVUb0NoZWNrIHRoZSBkYXRlIG9iamVjdCB0byBjaGVja1xyXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGggdGhlIGNvcnJlY3QgbW9udGhcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBkYXRlLCBjb3JyZWN0ZWQgaWYgbmVlZGVkXHJcbiAqL1xyXG5jb25zdCBrZWVwRGF0ZVdpdGhpbk1vbnRoID0gKGRhdGVUb0NoZWNrLCBtb250aCkgPT4ge1xyXG4gIGlmIChtb250aCAhPT0gZGF0ZVRvQ2hlY2suZ2V0TW9udGgoKSkge1xyXG4gICAgZGF0ZVRvQ2hlY2suc2V0RGF0ZSgwKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRlVG9DaGVjaztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSBmcm9tIG1vbnRoIGRheSB5ZWFyXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyIHRoZSB5ZWFyIHRvIHNldFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGggdGhlIG1vbnRoIHRvIHNldCAoemVyby1pbmRleGVkKVxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBzZXRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBzZXQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc2V0RGF0ZSA9ICh5ZWFyLCBtb250aCwgZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKHllYXIsIG1vbnRoLCBkYXRlKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiB0b2RheXMgZGF0ZVxyXG4gKlxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdG9kYXlzIGRhdGVcclxuICovXHJcbmNvbnN0IHRvZGF5ID0gKCkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gIGNvbnN0IGRheSA9IG5ld0RhdGUuZ2V0RGF0ZSgpO1xyXG4gIGNvbnN0IG1vbnRoID0gbmV3RGF0ZS5nZXRNb250aCgpO1xyXG4gIGNvbnN0IHllYXIgPSBuZXdEYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgcmV0dXJuIHNldERhdGUoeWVhciwgbW9udGgsIGRheSk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgdG8gZmlyc3QgZGF5IG9mIHRoZSBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdGFydE9mTW9udGggPSAoZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpLCAxKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byBsYXN0IGRheSBvZiB0aGUgbW9udGhcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IGRhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgbGFzdERheU9mTW9udGggPSAoZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZSgwKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpICsgMSwgMCk7XHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogQWRkIGRheXMgdG8gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtRGF5cyB0aGUgZGlmZmVyZW5jZSBpbiBkYXlzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkRGF5cyA9IChfZGF0ZSwgbnVtRGF5cykgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG4gIG5ld0RhdGUuc2V0RGF0ZShuZXdEYXRlLmdldERhdGUoKSArIG51bURheXMpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IGRheXMgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1EYXlzIHRoZSBkaWZmZXJlbmNlIGluIGRheXNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJEYXlzID0gKF9kYXRlLCBudW1EYXlzKSA9PiBhZGREYXlzKF9kYXRlLCAtbnVtRGF5cyk7XHJcblxyXG4vKipcclxuICogQWRkIHdlZWtzIHRvIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVdlZWtzIHRoZSBkaWZmZXJlbmNlIGluIHdlZWtzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkV2Vla3MgPSAoX2RhdGUsIG51bVdlZWtzKSA9PiBhZGREYXlzKF9kYXRlLCBudW1XZWVrcyAqIDcpO1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IHdlZWtzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJXZWVrcyA9IChfZGF0ZSwgbnVtV2Vla3MpID0+IGFkZFdlZWtzKF9kYXRlLCAtbnVtV2Vla3MpO1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgd2VlayAoTW9uZGF5KVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN0YXJ0T2ZXZWVrID0gKF9kYXRlKSA9PiB7XHJcbiAgbGV0IGRheU9mV2VlayA9IF9kYXRlLmdldERheSgpLTE7XHJcbiAgaWYoZGF5T2ZXZWVrID09PSAtMSl7XHJcbiAgICBkYXlPZldlZWsgPSA2O1xyXG4gIH1cclxuICByZXR1cm4gc3ViRGF5cyhfZGF0ZSwgZGF5T2ZXZWVrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byB0aGUgZW5kIG9mIHRoZSB3ZWVrIChTdW5kYXkpXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1XZWVrcyB0aGUgZGlmZmVyZW5jZSBpbiB3ZWVrc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGVuZE9mV2VlayA9IChfZGF0ZSkgPT4ge1xyXG4gIGNvbnN0IGRheU9mV2VlayA9IF9kYXRlLmdldERheSgpO1xyXG4gIHJldHVybiBhZGREYXlzKF9kYXRlLCA3IC0gZGF5T2ZXZWVrKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgbW9udGhzIHRvIGRhdGUgYW5kIGtlZXAgZGF0ZSB3aXRoaW4gbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bU1vbnRocyB0aGUgZGlmZmVyZW5jZSBpbiBtb250aHNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGRNb250aHMgPSAoX2RhdGUsIG51bU1vbnRocykgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG5cclxuICBjb25zdCBkYXRlTW9udGggPSAobmV3RGF0ZS5nZXRNb250aCgpICsgMTIgKyBudW1Nb250aHMpICUgMTI7XHJcbiAgbmV3RGF0ZS5zZXRNb250aChuZXdEYXRlLmdldE1vbnRoKCkgKyBudW1Nb250aHMpO1xyXG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgZGF0ZU1vbnRoKTtcclxuXHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU3VidHJhY3QgbW9udGhzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtTW9udGhzIHRoZSBkaWZmZXJlbmNlIGluIG1vbnRoc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1Yk1vbnRocyA9IChfZGF0ZSwgbnVtTW9udGhzKSA9PiBhZGRNb250aHMoX2RhdGUsIC1udW1Nb250aHMpO1xyXG5cclxuLyoqXHJcbiAqIEFkZCB5ZWFycyB0byBkYXRlIGFuZCBrZWVwIGRhdGUgd2l0aGluIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1ZZWFycyB0aGUgZGlmZmVyZW5jZSBpbiB5ZWFyc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkZFllYXJzID0gKF9kYXRlLCBudW1ZZWFycykgPT4gYWRkTW9udGhzKF9kYXRlLCBudW1ZZWFycyAqIDEyKTtcclxuXHJcbi8qKlxyXG4gKiBTdWJ0cmFjdCB5ZWFycyBmcm9tIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVllYXJzIHRoZSBkaWZmZXJlbmNlIGluIHllYXJzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3ViWWVhcnMgPSAoX2RhdGUsIG51bVllYXJzKSA9PiBhZGRZZWFycyhfZGF0ZSwgLW51bVllYXJzKTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgbW9udGhzIG9mIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG1vbnRoIHplcm8taW5kZXhlZCBtb250aCB0byBzZXRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXRNb250aCA9IChfZGF0ZSwgbW9udGgpID0+IHtcclxuICBjb25zdCBuZXdEYXRlID0gbmV3IERhdGUoX2RhdGUuZ2V0VGltZSgpKTtcclxuXHJcbiAgbmV3RGF0ZS5zZXRNb250aChtb250aCk7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBtb250aCk7XHJcblxyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCB5ZWFyIG9mIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IHllYXIgdGhlIHllYXIgdG8gc2V0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc2V0WWVhciA9IChfZGF0ZSwgeWVhcikgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG5cclxuICBjb25zdCBtb250aCA9IG5ld0RhdGUuZ2V0TW9udGgoKTtcclxuICBuZXdEYXRlLnNldEZ1bGxZZWFyKHllYXIpO1xyXG4gIGtlZXBEYXRlV2l0aGluTW9udGgobmV3RGF0ZSwgbW9udGgpO1xyXG5cclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGVhcmxpZXN0IGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBlYXJsaWVzdCBkYXRlXHJcbiAqL1xyXG5jb25zdCBtaW4gPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgbGV0IG5ld0RhdGUgPSBkYXRlQTtcclxuXHJcbiAgaWYgKGRhdGVCIDwgZGF0ZUEpIHtcclxuICAgIG5ld0RhdGUgPSBkYXRlQjtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgRGF0ZShuZXdEYXRlLmdldFRpbWUoKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJuIHRoZSBsYXRlc3QgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGxhdGVzdCBkYXRlXHJcbiAqL1xyXG5jb25zdCBtYXggPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgbGV0IG5ld0RhdGUgPSBkYXRlQTtcclxuXHJcbiAgaWYgKGRhdGVCID4gZGF0ZUEpIHtcclxuICAgIG5ld0RhdGUgPSBkYXRlQjtcclxuICB9XHJcblxyXG4gIHJldHVybiBuZXcgRGF0ZShuZXdEYXRlLmdldFRpbWUoKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgYXJlIHRoZSBpbiB0aGUgc2FtZSB5ZWFyXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgaW4gdGhlIHNhbWUgeWVhclxyXG4gKi9cclxuY29uc3QgaXNTYW1lWWVhciA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICByZXR1cm4gZGF0ZUEgJiYgZGF0ZUIgJiYgZGF0ZUEuZ2V0RnVsbFllYXIoKSA9PT0gZGF0ZUIuZ2V0RnVsbFllYXIoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIGluIHRoZSBzYW1lIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgaW4gdGhlIHNhbWUgbW9udGhcclxuICovXHJcbmNvbnN0IGlzU2FtZU1vbnRoID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIHJldHVybiBpc1NhbWVZZWFyKGRhdGVBLCBkYXRlQikgJiYgZGF0ZUEuZ2V0TW9udGgoKSA9PT0gZGF0ZUIuZ2V0TW9udGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIHNhbWUgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIHRoZSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSB0aGUgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBhcmUgZGF0ZXMgdGhlIHNhbWUgZGF0ZVxyXG4gKi9cclxuY29uc3QgaXNTYW1lRGF5ID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIHJldHVybiBpc1NhbWVNb250aChkYXRlQSwgZGF0ZUIpICYmIGRhdGVBLmdldERhdGUoKSA9PT0gZGF0ZUIuZ2V0RGF0ZSgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHJldHVybiBhIG5ldyBkYXRlIHdpdGhpbiBtaW5pbXVtIGFuZCBtYXhpbXVtIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgZGF0ZSBiZXR3ZWVuIG1pbiBhbmQgbWF4XHJcbiAqL1xyXG5jb25zdCBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT4ge1xyXG4gIGxldCBuZXdEYXRlID0gZGF0ZTtcclxuXHJcbiAgaWYgKGRhdGUgPCBtaW5EYXRlKSB7XHJcbiAgICBuZXdEYXRlID0gbWluRGF0ZTtcclxuICB9IGVsc2UgaWYgKG1heERhdGUgJiYgZGF0ZSA+IG1heERhdGUpIHtcclxuICAgIG5ld0RhdGUgPSBtYXhEYXRlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBpcyB2YWxpZC5cclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGlzIHRoZXJlIGEgZGF5IHdpdGhpbiB0aGUgbW9udGggd2l0aGluIG1pbiBhbmQgbWF4IGRhdGVzXHJcbiAqL1xyXG5jb25zdCBpc0RhdGVXaXRoaW5NaW5BbmRNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT5cclxuICBkYXRlID49IG1pbkRhdGUgJiYgKCFtYXhEYXRlIHx8IGRhdGUgPD0gbWF4RGF0ZSk7XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgbW9udGggaXMgaW52YWxpZC5cclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIGRhdGUgdG8gY2hlY2tcclxuICogQHBhcmFtIHtEYXRlfSBtaW5EYXRlIG1pbmltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1heERhdGUgbWF4aW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGlzIHRoZSBtb250aCBvdXRzaWRlIG1pbiBvciBtYXggZGF0ZXNcclxuICovXHJcbmNvbnN0IGlzRGF0ZXNNb250aE91dHNpZGVNaW5Pck1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIGxhc3REYXlPZk1vbnRoKGRhdGUpIDwgbWluRGF0ZSB8fCAobWF4RGF0ZSAmJiBzdGFydE9mTW9udGgoZGF0ZSkgPiBtYXhEYXRlKVxyXG4gICk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgZGF0ZXMgeWVhciBpcyBpbnZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlIG1vbnRoIG91dHNpZGUgbWluIG9yIG1heCBkYXRlc1xyXG4gKi9cclxuY29uc3QgaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXggPSAoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSkgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgICBsYXN0RGF5T2ZNb250aChzZXRNb250aChkYXRlLCAxMSkpIDwgbWluRGF0ZSB8fFxyXG4gICAgKG1heERhdGUgJiYgc3RhcnRPZk1vbnRoKHNldE1vbnRoKGRhdGUsIDApKSA+IG1heERhdGUpXHJcbiAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBQYXJzZSBhIGRhdGUgd2l0aCBmb3JtYXQgTS1ELVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlU3RyaW5nIHRoZSBkYXRlIHN0cmluZyB0byBwYXJzZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZUZvcm1hdCB0aGUgZm9ybWF0IG9mIHRoZSBkYXRlIHN0cmluZ1xyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFkanVzdERhdGUgc2hvdWxkIHRoZSBkYXRlIGJlIGFkanVzdGVkXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgcGFyc2VkIGRhdGVcclxuICovXHJcbmNvbnN0IHBhcnNlRGF0ZVN0cmluZyA9IChcclxuICBkYXRlU3RyaW5nLFxyXG4gIGRhdGVGb3JtYXQgPSBJTlRFUk5BTF9EQVRFX0ZPUk1BVCxcclxuICBhZGp1c3REYXRlID0gZmFsc2VcclxuKSA9PiB7XHJcbiAgbGV0IGRhdGU7XHJcbiAgbGV0IG1vbnRoO1xyXG4gIGxldCBkYXk7XHJcbiAgbGV0IHllYXI7XHJcbiAgbGV0IHBhcnNlZDtcclxuXHJcbiAgaWYgKGRhdGVTdHJpbmcpIHtcclxuICAgIGxldCBtb250aFN0ciwgZGF5U3RyLCB5ZWFyU3RyO1xyXG4gICAgaWYgKGRhdGVGb3JtYXQgPT09IERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQpIHtcclxuICAgICAgW2RheVN0ciwgbW9udGhTdHIsIHllYXJTdHJdID0gZGF0ZVN0cmluZy5zcGxpdChcIi9cIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBbeWVhclN0ciwgbW9udGhTdHIsIGRheVN0cl0gPSBkYXRlU3RyaW5nLnNwbGl0KFwiLVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoeWVhclN0cikge1xyXG4gICAgICBwYXJzZWQgPSBwYXJzZUludCh5ZWFyU3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICB5ZWFyID0gcGFyc2VkO1xyXG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XHJcbiAgICAgICAgICB5ZWFyID0gTWF0aC5tYXgoMCwgeWVhcik7XHJcbiAgICAgICAgICBpZiAoeWVhclN0ci5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gdG9kYXkoKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50WWVhclN0dWIgPVxyXG4gICAgICAgICAgICAgIGN1cnJlbnRZZWFyIC0gKGN1cnJlbnRZZWFyICUgMTAgKiogeWVhclN0ci5sZW5ndGgpO1xyXG4gICAgICAgICAgICB5ZWFyID0gY3VycmVudFllYXJTdHViICsgcGFyc2VkO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb250aFN0cikge1xyXG4gICAgICBwYXJzZWQgPSBwYXJzZUludChtb250aFN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XHJcbiAgICAgICAgbW9udGggPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIG1vbnRoID0gTWF0aC5tYXgoMSwgbW9udGgpO1xyXG4gICAgICAgICAgbW9udGggPSBNYXRoLm1pbigxMiwgbW9udGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb250aCAmJiBkYXlTdHIgJiYgeWVhciAhPSBudWxsKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KGRheVN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB7XHJcbiAgICAgICAgZGF5ID0gcGFyc2VkO1xyXG4gICAgICAgIGlmIChhZGp1c3REYXRlKSB7XHJcbiAgICAgICAgICBjb25zdCBsYXN0RGF5T2ZUaGVNb250aCA9IHNldERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcclxuICAgICAgICAgIGRheSA9IE1hdGgubWF4KDEsIGRheSk7XHJcbiAgICAgICAgICBkYXkgPSBNYXRoLm1pbihsYXN0RGF5T2ZUaGVNb250aCwgZGF5KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAobW9udGggJiYgZGF5ICYmIHllYXIgIT0gbnVsbCkge1xyXG4gICAgICBkYXRlID0gc2V0RGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBGb3JtYXQgYSBkYXRlIHRvIGZvcm1hdCBNTS1ERC1ZWVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSB0aGUgZGF0ZSB0byBmb3JtYXRcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVGb3JtYXQgdGhlIGZvcm1hdCBvZiB0aGUgZGF0ZSBzdHJpbmdcclxuICogQHJldHVybnMge3N0cmluZ30gdGhlIGZvcm1hdHRlZCBkYXRlIHN0cmluZ1xyXG4gKi9cclxuY29uc3QgZm9ybWF0RGF0ZSA9IChkYXRlLCBkYXRlRm9ybWF0ID0gSU5URVJOQUxfREFURV9GT1JNQVQpID0+IHtcclxuICBjb25zdCBwYWRaZXJvcyA9ICh2YWx1ZSwgbGVuZ3RoKSA9PiB7XHJcbiAgICByZXR1cm4gYDAwMDAke3ZhbHVlfWAuc2xpY2UoLWxlbmd0aCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgbW9udGggPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gIGNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xyXG4gIGNvbnN0IHllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcblxyXG4gIGlmIChkYXRlRm9ybWF0ID09PSBERUZBVUxUX0VYVEVSTkFMX0RBVEVfRk9STUFUKSB7XHJcbiAgICByZXR1cm4gW3BhZFplcm9zKGRheSwgMiksIHBhZFplcm9zKG1vbnRoLCAyKSwgcGFkWmVyb3MoeWVhciwgNCldLmpvaW4oXCIvXCIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtwYWRaZXJvcyh5ZWFyLCA0KSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyhkYXksIDIpXS5qb2luKFwiLVwiKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gRGF0ZSBNYW5pcHVsYXRpb24gRnVuY3Rpb25zXHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgZ3JpZCBzdHJpbmcgZnJvbSBhbiBhcnJheSBvZiBodG1sIHN0cmluZ3NcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmdbXX0gaHRtbEFycmF5IHRoZSBhcnJheSBvZiBodG1sIGl0ZW1zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByb3dTaXplIHRoZSBsZW5ndGggb2YgYSByb3dcclxuICogQHJldHVybnMge3N0cmluZ30gdGhlIGdyaWQgc3RyaW5nXHJcbiAqL1xyXG5jb25zdCBsaXN0VG9HcmlkSHRtbCA9IChodG1sQXJyYXksIHJvd1NpemUpID0+IHtcclxuICBjb25zdCBncmlkID0gW107XHJcbiAgbGV0IHJvdyA9IFtdO1xyXG5cclxuICBsZXQgaSA9IDA7XHJcbiAgd2hpbGUgKGkgPCBodG1sQXJyYXkubGVuZ3RoKSB7XHJcbiAgICByb3cgPSBbXTtcclxuICAgIHdoaWxlIChpIDwgaHRtbEFycmF5Lmxlbmd0aCAmJiByb3cubGVuZ3RoIDwgcm93U2l6ZSkge1xyXG4gICAgICByb3cucHVzaChgPHRkPiR7aHRtbEFycmF5W2ldfTwvdGQ+YCk7XHJcbiAgICAgIGkgKz0gMTtcclxuICAgIH1cclxuICAgIGdyaWQucHVzaChgPHRyPiR7cm93LmpvaW4oXCJcIil9PC90cj5gKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBncmlkLmpvaW4oXCJcIik7XHJcbn07XHJcblxyXG4vKipcclxuICogc2V0IHRoZSB2YWx1ZSBvZiB0aGUgZWxlbWVudCBhbmQgZGlzcGF0Y2ggYSBjaGFuZ2UgZXZlbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSBlbCBUaGUgZWxlbWVudCB0byB1cGRhdGVcclxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IGNoYW5nZUVsZW1lbnRWYWx1ZSA9IChlbCwgdmFsdWUgPSBcIlwiKSA9PiB7XHJcbiAgY29uc3QgZWxlbWVudFRvQ2hhbmdlID0gZWw7XHJcbiAgZWxlbWVudFRvQ2hhbmdlLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiY2hhbmdlXCIsIHtcclxuICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgZGV0YWlsOiB7IHZhbHVlIH0sXHJcbiAgfSk7XHJcbiAgZWxlbWVudFRvQ2hhbmdlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBwcm9wZXJ0aWVzIGFuZCBlbGVtZW50cyB3aXRoaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBEYXRlUGlja2VyQ29udGV4dFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBjYWxlbmRhckVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGRhdGVQaWNrZXJFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGludGVybmFsSW5wdXRFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGV4dGVybmFsSW5wdXRFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBzdGF0dXNFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBmaXJzdFllYXJDaHVua0VsXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gY2FsZW5kYXJEYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gbWluRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IG1heERhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBzZWxlY3RlZERhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSByYW5nZURhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBkZWZhdWx0RGF0ZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBHZXQgYW4gb2JqZWN0IG9mIHRoZSBwcm9wZXJ0aWVzIGFuZCBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXHJcbiAqIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGhlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlclxyXG4gKiBAcmV0dXJucyB7RGF0ZVBpY2tlckNvbnRleHR9IGVsZW1lbnRzXHJcbiAqL1xyXG5jb25zdCBnZXREYXRlUGlja2VyQ29udGV4dCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IGRhdGVQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoREFURV9QSUNLRVIpO1xyXG5cclxuICBpZiAoIWRhdGVQaWNrZXJFbCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGlzIG1pc3Npbmcgb3V0ZXIgJHtEQVRFX1BJQ0tFUn1gKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGludGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRcclxuICApO1xyXG4gIGNvbnN0IGV4dGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRcclxuICApO1xyXG4gIGNvbnN0IGNhbGVuZGFyRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9DQUxFTkRBUik7XHJcbiAgY29uc3QgdG9nZ2xlQnRuRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9CVVRUT04pO1xyXG4gIGNvbnN0IHN0YXR1c0VsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoREFURV9QSUNLRVJfU1RBVFVTKTtcclxuICBjb25zdCBmaXJzdFllYXJDaHVua0VsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUik7XHJcblxyXG4gIGNvbnN0IGlucHV0RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhcclxuICAgIGV4dGVybmFsSW5wdXRFbC52YWx1ZSxcclxuICAgIERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQsXHJcbiAgICB0cnVlXHJcbiAgKTtcclxuICBjb25zdCBzZWxlY3RlZERhdGUgPSBwYXJzZURhdGVTdHJpbmcoaW50ZXJuYWxJbnB1dEVsLnZhbHVlKTtcclxuXHJcbiAgY29uc3QgY2FsZW5kYXJEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGNhbGVuZGFyRWwuZGF0YXNldC52YWx1ZSk7XHJcbiAgY29uc3QgbWluRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlKTtcclxuICBjb25zdCBtYXhEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGUpO1xyXG4gIGNvbnN0IHJhbmdlRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5yYW5nZURhdGUpO1xyXG4gIGNvbnN0IGRlZmF1bHREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRlZmF1bHREYXRlKTtcclxuXHJcbiAgaWYgKG1pbkRhdGUgJiYgbWF4RGF0ZSAmJiBtaW5EYXRlID4gbWF4RGF0ZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTWluaW11bSBkYXRlIGNhbm5vdCBiZSBhZnRlciBtYXhpbXVtIGRhdGVcIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgY2FsZW5kYXJEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIHRvZ2dsZUJ0bkVsLFxyXG4gICAgc2VsZWN0ZWREYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIGZpcnN0WWVhckNodW5rRWwsXHJcbiAgICBkYXRlUGlja2VyRWwsXHJcbiAgICBpbnB1dERhdGUsXHJcbiAgICBpbnRlcm5hbElucHV0RWwsXHJcbiAgICBleHRlcm5hbElucHV0RWwsXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgcmFuZ2VEYXRlLFxyXG4gICAgZGVmYXVsdERhdGUsXHJcbiAgICBzdGF0dXNFbCxcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERpc2FibGUgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNhYmxlID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIHRvZ2dsZUJ0bkVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIHRvZ2dsZUJ0bkVsLmRpc2FibGVkID0gdHJ1ZTtcclxuICBleHRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVuYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGVuYWJsZSA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCB0b2dnbGVCdG5FbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICB0b2dnbGVCdG5FbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG59O1xyXG5cclxuLy8gI3JlZ2lvbiBWYWxpZGF0aW9uXHJcblxyXG4vKipcclxuICogVmFsaWRhdGUgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGRhdGUgb2YgZm9ybWF0IE0vRC9ZWVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGlzRGF0ZUlucHV0SW52YWxpZCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGNvbnN0IGRhdGVTdHJpbmcgPSBleHRlcm5hbElucHV0RWwudmFsdWU7XHJcbiAgbGV0IGlzSW52YWxpZCA9IGZhbHNlO1xyXG5cclxuICBpZiAoZGF0ZVN0cmluZykge1xyXG4gICAgaXNJbnZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBkYXRlU3RyaW5nUGFydHMgPSBkYXRlU3RyaW5nLnNwbGl0KFwiL1wiKTtcclxuICAgIGNvbnN0IFtkYXksIG1vbnRoLCB5ZWFyXSA9IGRhdGVTdHJpbmdQYXJ0cy5tYXAoKHN0cikgPT4ge1xyXG4gICAgICBsZXQgdmFsdWU7XHJcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB2YWx1ZSA9IHBhcnNlZDtcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG1vbnRoICYmIGRheSAmJiB5ZWFyICE9IG51bGwpIHtcclxuICAgICAgY29uc3QgY2hlY2tEYXRlID0gc2V0RGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgY2hlY2tEYXRlLmdldE1vbnRoKCkgPT09IG1vbnRoIC0gMSAmJlxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXREYXRlKCkgPT09IGRheSAmJlxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXRGdWxsWWVhcigpID09PSB5ZWFyICYmXHJcbiAgICAgICAgZGF0ZVN0cmluZ1BhcnRzWzJdLmxlbmd0aCA9PT0gNCAmJlxyXG4gICAgICAgIGlzRGF0ZVdpdGhpbk1pbkFuZE1heChjaGVja0RhdGUsIG1pbkRhdGUsIG1heERhdGUpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGlzSW52YWxpZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaXNJbnZhbGlkO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFZhbGlkYXRlIHRoZSB2YWx1ZSBpbiB0aGUgaW5wdXQgYXMgYSB2YWxpZCBkYXRlIG9mIGZvcm1hdCBNL0QvWVlZWVxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCB2YWxpZGF0ZURhdGVJbnB1dCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgY29uc3QgaXNJbnZhbGlkID0gaXNEYXRlSW5wdXRJbnZhbGlkKGV4dGVybmFsSW5wdXRFbCk7XHJcblxyXG4gIGlmIChpc0ludmFsaWQgJiYgIWV4dGVybmFsSW5wdXRFbC52YWxpZGF0aW9uTWVzc2FnZSkge1xyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFZBTElEQVRJT05fTUVTU0FHRSk7XHJcbiAgfVxyXG5cclxuICBpZiAoIWlzSW52YWxpZCAmJiBleHRlcm5hbElucHV0RWwudmFsaWRhdGlvbk1lc3NhZ2UgPT09IFZBTElEQVRJT05fTUVTU0FHRSkge1xyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFwiXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gVmFsaWRhdGlvblxyXG5cclxuLyoqXHJcbiAqIEVuYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHJlY29uY2lsZUlucHV0VmFsdWVzID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBpbnRlcm5hbElucHV0RWwsIGlucHV0RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGxldCBuZXdWYWx1ZSA9IFwiXCI7XHJcblxyXG4gIGlmIChpbnB1dERhdGUgJiYgIWlzRGF0ZUlucHV0SW52YWxpZChlbCkpIHtcclxuICAgIG5ld1ZhbHVlID0gZm9ybWF0RGF0ZShpbnB1dERhdGUpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGludGVybmFsSW5wdXRFbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShpbnRlcm5hbElucHV0RWwsIG5ld1ZhbHVlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IHRoZSB2YWx1ZSBvZiB0aGUgZGF0ZSBwaWNrZXIgaW5wdXRzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlU3RyaW5nIFRoZSBkYXRlIHN0cmluZyB0byB1cGRhdGUgaW4gWVlZWS1NTS1ERCBmb3JtYXRcclxuICovXHJcbmNvbnN0IHNldENhbGVuZGFyVmFsdWUgPSAoZWwsIGRhdGVTdHJpbmcpID0+IHtcclxuICBjb25zdCBwYXJzZWREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVTdHJpbmcpO1xyXG5cclxuICBpZiAocGFyc2VkRGF0ZSkge1xyXG4gICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUocGFyc2VkRGF0ZSwgREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCk7XHJcblxyXG4gICAgY29uc3Qge1xyXG4gICAgICBkYXRlUGlja2VyRWwsXHJcbiAgICAgIGludGVybmFsSW5wdXRFbCxcclxuICAgICAgZXh0ZXJuYWxJbnB1dEVsLFxyXG4gICAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoaW50ZXJuYWxJbnB1dEVsLCBkYXRlU3RyaW5nKTtcclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShleHRlcm5hbElucHV0RWwsIGZvcm1hdHRlZERhdGUpO1xyXG5cclxuICAgIHZhbGlkYXRlRGF0ZUlucHV0KGRhdGVQaWNrZXJFbCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVuaGFuY2UgYW4gaW5wdXQgd2l0aCB0aGUgZGF0ZSBwaWNrZXIgZWxlbWVudHNcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgVGhlIGluaXRpYWwgd3JhcHBpbmcgZWxlbWVudCBvZiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBlbmhhbmNlRGF0ZVBpY2tlciA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IGRhdGVQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoREFURV9QSUNLRVIpO1xyXG4gIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRlZmF1bHRWYWx1ZTtcclxuXHJcbiAgY29uc3QgaW50ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoYGlucHV0YCk7XHJcblxyXG4gIGlmICghaW50ZXJuYWxJbnB1dEVsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7REFURV9QSUNLRVJ9IGlzIG1pc3NpbmcgaW5uZXIgaW5wdXRgKTtcclxuICB9XHJcblxyXG5cclxuICBjb25zdCBtaW5EYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxyXG4gICAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSB8fCBpbnRlcm5hbElucHV0RWwuZ2V0QXR0cmlidXRlKFwibWluXCIpXHJcbiAgKTtcclxuICBkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlID0gbWluRGF0ZVxyXG4gICAgPyBmb3JtYXREYXRlKG1pbkRhdGUpXHJcbiAgICA6IERFRkFVTFRfTUlOX0RBVEU7XHJcblxyXG4gIGNvbnN0IG1heERhdGUgPSBwYXJzZURhdGVTdHJpbmcoXHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlIHx8IGludGVybmFsSW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtYXhcIilcclxuICApO1xyXG4gIGlmIChtYXhEYXRlKSB7XHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlID0gZm9ybWF0RGF0ZShtYXhEYXRlKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfV1JBUFBFUl9DTEFTUyk7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLnRhYkluZGV4ID0gXCItMVwiO1xyXG5cclxuICBjb25zdCBleHRlcm5hbElucHV0RWwgPSBpbnRlcm5hbElucHV0RWwuY2xvbmVOb2RlKCk7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRfQ0xBU1MpO1xyXG4gIGV4dGVybmFsSW5wdXRFbC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLm5hbWUgPSBcIlwiO1xyXG5cclxuICBjYWxlbmRhcldyYXBwZXIuYXBwZW5kQ2hpbGQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuICBjYWxlbmRhcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFxyXG4gICAgXCJiZWZvcmVlbmRcIixcclxuICAgIFtcclxuICAgICAgYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiJHtEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1N9XCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWxhYmVsPVwiw4VibiBrYWxlbmRlclwiPiZuYnNwOzwvYnV0dG9uPmAsXHJcbiAgICAgIGA8ZGl2IGNsYXNzPVwiJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31cIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBoaWRkZW4+PC9kaXY+YCxcclxuICAgICAgYDxkaXYgY2xhc3M9XCJzci1vbmx5ICR7REFURV9QSUNLRVJfU1RBVFVTX0NMQVNTfVwiIHJvbGU9XCJzdGF0dXNcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIj48L2Rpdj5gLFxyXG4gICAgXS5qb2luKFwiXCIpXHJcbiAgKTtcclxuXHJcbiAgaW50ZXJuYWxJbnB1dEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcclxuICBpbnRlcm5hbElucHV0RWwuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcclxuICBpbnRlcm5hbElucHV0RWwuY2xhc3NMaXN0LmFkZChcclxuICAgIFwic3Itb25seVwiLFxyXG4gICAgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRfQ0xBU1NcclxuICApO1xyXG4gIGludGVybmFsSW5wdXRFbC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgaW50ZXJuYWxJbnB1dEVsLnJlcXVpcmVkID0gZmFsc2U7XHJcblxyXG4gIGRhdGVQaWNrZXJFbC5hcHBlbmRDaGlsZChjYWxlbmRhcldyYXBwZXIpO1xyXG4gIGRhdGVQaWNrZXJFbC5jbGFzc0xpc3QuYWRkKERBVEVfUElDS0VSX0lOSVRJQUxJWkVEX0NMQVNTKTtcclxuXHJcbiAgaWYgKGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgc2V0Q2FsZW5kYXJWYWx1ZShkYXRlUGlja2VyRWwsIGRlZmF1bHRWYWx1ZSk7XHJcbiAgfVxyXG5cclxuICBpZiAoaW50ZXJuYWxJbnB1dEVsLmRpc2FibGVkKSB7XHJcbiAgICBkaXNhYmxlKGRhdGVQaWNrZXJFbCk7XHJcbiAgICBpbnRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSBmYWxzZTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKGV4dGVybmFsSW5wdXRFbC52YWx1ZSkge1xyXG4gICAgdmFsaWRhdGVEYXRlSW5wdXQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIC0gRGF0ZSBTZWxlY3Rpb24gVmlld1xyXG5cclxuLyoqXHJcbiAqIHJlbmRlciB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZVRvRGlzcGxheSBhIGRhdGUgdG8gcmVuZGVyIG9uIHRoZSBjYWxlbmRhclxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgcmVuZGVyQ2FsZW5kYXIgPSAoZWwsIF9kYXRlVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgZGF0ZVBpY2tlckVsLFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgc2VsZWN0ZWREYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICByYW5nZURhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBjb25zdCB0b2RheXNEYXRlID0gdG9kYXkoKTtcclxuICBsZXQgZGF0ZVRvRGlzcGxheSA9IF9kYXRlVG9EaXNwbGF5IHx8IHRvZGF5c0RhdGU7XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyV2FzSGlkZGVuID0gY2FsZW5kYXJFbC5oaWRkZW47XHJcblxyXG4gIGNvbnN0IGZvY3VzZWREYXRlID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAwKTtcclxuICBjb25zdCBmb2N1c2VkTW9udGggPSBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCk7XHJcbiAgY29uc3QgZm9jdXNlZFllYXIgPSBkYXRlVG9EaXNwbGF5LmdldEZ1bGxZZWFyKCk7XHJcblxyXG4gIGNvbnN0IHByZXZNb250aCA9IHN1Yk1vbnRocyhkYXRlVG9EaXNwbGF5LCAxKTtcclxuICBjb25zdCBuZXh0TW9udGggPSBhZGRNb250aHMoZGF0ZVRvRGlzcGxheSwgMSk7XHJcblxyXG4gIGNvbnN0IGN1cnJlbnRGb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShkYXRlVG9EaXNwbGF5KTtcclxuXHJcbiAgY29uc3QgZmlyc3RPZk1vbnRoID0gc3RhcnRPZk1vbnRoKGRhdGVUb0Rpc3BsYXkpO1xyXG4gIGNvbnN0IHByZXZCdXR0b25zRGlzYWJsZWQgPSBpc1NhbWVNb250aChkYXRlVG9EaXNwbGF5LCBtaW5EYXRlKTtcclxuICBjb25zdCBuZXh0QnV0dG9uc0Rpc2FibGVkID0gaXNTYW1lTW9udGgoZGF0ZVRvRGlzcGxheSwgbWF4RGF0ZSk7XHJcblxyXG4gIGNvbnN0IHJhbmdlQ29uY2x1c2lvbkRhdGUgPSBzZWxlY3RlZERhdGUgfHwgZGF0ZVRvRGlzcGxheTtcclxuICBjb25zdCByYW5nZVN0YXJ0RGF0ZSA9IHJhbmdlRGF0ZSAmJiBtaW4ocmFuZ2VDb25jbHVzaW9uRGF0ZSwgcmFuZ2VEYXRlKTtcclxuICBjb25zdCByYW5nZUVuZERhdGUgPSByYW5nZURhdGUgJiYgbWF4KHJhbmdlQ29uY2x1c2lvbkRhdGUsIHJhbmdlRGF0ZSk7XHJcblxyXG4gIGNvbnN0IHdpdGhpblJhbmdlU3RhcnREYXRlID0gcmFuZ2VEYXRlICYmIGFkZERheXMocmFuZ2VTdGFydERhdGUsIDEpO1xyXG4gIGNvbnN0IHdpdGhpblJhbmdlRW5kRGF0ZSA9IHJhbmdlRGF0ZSAmJiBzdWJEYXlzKHJhbmdlRW5kRGF0ZSwgMSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoTGFiZWwgPSBNT05USF9MQUJFTFNbZm9jdXNlZE1vbnRoXTtcclxuXHJcbiAgY29uc3QgZ2VuZXJhdGVEYXRlSHRtbCA9IChkYXRlVG9SZW5kZXIpID0+IHtcclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfREFURV9DTEFTU107XHJcbiAgICBjb25zdCBkYXkgPSBkYXRlVG9SZW5kZXIuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgbW9udGggPSBkYXRlVG9SZW5kZXIuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IHllYXIgPSBkYXRlVG9SZW5kZXIuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IGRheU9mV2VlayA9IGRhdGVUb1JlbmRlci5nZXREYXkoKTtcclxuXHJcbiAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShkYXRlVG9SZW5kZXIpO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gIWlzRGF0ZVdpdGhpbk1pbkFuZE1heChkYXRlVG9SZW5kZXIsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHNlbGVjdGVkRGF0ZSk7XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgcHJldk1vbnRoKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9QUkVWSU9VU19NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVNb250aChkYXRlVG9SZW5kZXIsIG5leHRNb250aCkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfTkVYVF9NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCB0b2RheXNEYXRlKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9UT0RBWV9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJhbmdlRGF0ZSkge1xyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VEYXRlKSkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VTdGFydERhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9TVEFSVF9DTEFTUyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZUVuZERhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9FTkRfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgaXNEYXRlV2l0aGluTWluQW5kTWF4KFxyXG4gICAgICAgICAgZGF0ZVRvUmVuZGVyLFxyXG4gICAgICAgICAgd2l0aGluUmFuZ2VTdGFydERhdGUsXHJcbiAgICAgICAgICB3aXRoaW5SYW5nZUVuZERhdGVcclxuICAgICAgICApXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1dJVEhJTl9SQU5HRV9DTEFTUyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1vbnRoU3RyID0gTU9OVEhfTEFCRUxTW21vbnRoXTtcclxuICAgIGNvbnN0IGRheVN0ciA9IERBWV9PRl9XRUVLX0xBQkVMU1tkYXlPZldlZWtdO1xyXG5cclxuICAgIHJldHVybiBgPGJ1dHRvblxyXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgdGFiaW5kZXg9XCIke3RhYmluZGV4fVwiXHJcbiAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICBkYXRhLWRheT1cIiR7ZGF5fVwiIFxyXG4gICAgICBkYXRhLW1vbnRoPVwiJHttb250aCArIDF9XCIgXHJcbiAgICAgIGRhdGEteWVhcj1cIiR7eWVhcn1cIiBcclxuICAgICAgZGF0YS12YWx1ZT1cIiR7Zm9ybWF0dGVkRGF0ZX1cIlxyXG4gICAgICBhcmlhLWxhYmVsPVwiJHtkYXlTdHJ9IGRlbiAke2RheX0gJHttb250aFN0cn0gJHt5ZWFyfSBcIlxyXG4gICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgPiR7ZGF5fTwvYnV0dG9uPmA7XHJcbiAgfTtcclxuICAvLyBzZXQgZGF0ZSB0byBmaXJzdCByZW5kZXJlZCBkYXlcclxuICBkYXRlVG9EaXNwbGF5ID0gc3RhcnRPZldlZWsoZmlyc3RPZk1vbnRoKTtcclxuXHJcbiAgY29uc3QgZGF5cyA9IFtdO1xyXG5cclxuICB3aGlsZSAoXHJcbiAgICBkYXlzLmxlbmd0aCA8IDI4IHx8XHJcbiAgICBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCkgPT09IGZvY3VzZWRNb250aCB8fFxyXG4gICAgZGF5cy5sZW5ndGggJSA3ICE9PSAwXHJcbiAgKSB7XHJcbiAgICBkYXlzLnB1c2goZ2VuZXJhdGVEYXRlSHRtbChkYXRlVG9EaXNwbGF5KSk7XHJcbiAgICBkYXRlVG9EaXNwbGF5ID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAxKTsgICAgXHJcbiAgfVxyXG4gIGNvbnN0IGRhdGVzSHRtbCA9IGxpc3RUb0dyaWRIdG1sKGRheXMsIDcpO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XHJcbiAgbmV3Q2FsZW5kYXIuZGF0YXNldC52YWx1ZSA9IGN1cnJlbnRGb3JtYXR0ZWREYXRlO1xyXG4gIG5ld0NhbGVuZGFyLnN0eWxlLnRvcCA9IGAke2RhdGVQaWNrZXJFbC5vZmZzZXRIZWlnaHR9cHhgO1xyXG4gIG5ld0NhbGVuZGFyLmhpZGRlbiA9IGZhbHNlO1xyXG4gIGxldCBjb250ZW50ID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTU31cIj5cclxuICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfUk9XX0NMQVNTfVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk5hdmlnw6lyIMOpdCDDpXIgdGlsYmFnZVwiXHJcbiAgICAgICAgICAgICR7cHJldkJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgw6l0IMOlciB0aWxiYWdlXCJcclxuICAgICAgICAgICAgJHtwcmV2QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfTU9OVEhfTEFCRUxfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHttb250aExhYmVsfS4gVsOmbGcgbcOlbmVkLlwiXHJcbiAgICAgICAgICA+JHttb250aExhYmVsfTwvYnV0dG9uPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHtmb2N1c2VkWWVhcn0uIFbDpmxnIMOlci5cIlxyXG4gICAgICAgICAgPiR7Zm9jdXNlZFllYXJ9PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9NT05USF9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgw6luIG3DpW5lZCBmcmVtXCJcclxuICAgICAgICAgICAgJHtuZXh0QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX05FWFRfWUVBUl9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTk5hdmlnw6lyIMOpdCDDpXIgZnJlbVwiXHJcbiAgICAgICAgICAgICR7bmV4dEJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDx0YWJsZSBjbGFzcz1cIiR7Q0FMRU5EQVJfVEFCTEVfQ0xBU1N9XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgIDx0cj5gO1xyXG4gIGZvcihsZXQgZCBpbiBEQVlfT0ZfV0VFS19MQUJFTFMpe1xyXG4gICAgY29udGVudCArPSBgPHRoIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVlfT0ZfV0VFS19DTEFTU31cIiBzY29wZT1cImNvbFwiIGFyaWEtbGFiZWw9XCIke0RBWV9PRl9XRUVLX0xBQkVMU1tkXX1cIj4ke0RBWV9PRl9XRUVLX0xBQkVMU1tkXS5jaGFyQXQoMCl9PC90aD5gO1xyXG4gIH1cclxuICBjb250ZW50ICs9IGA8L3RyPlxyXG4gICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgJHtkYXRlc0h0bWx9XHJcbiAgICAgICAgPC90Ym9keT5cclxuICAgICAgPC90YWJsZT5cclxuICAgIDwvZGl2PmA7XHJcbiAgbmV3Q2FsZW5kYXIuaW5uZXJIVE1MID0gY29udGVudDtcclxuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcclxuXHJcbiAgZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTKTtcclxuXHJcbiAgY29uc3Qgc3RhdHVzZXMgPSBbXTtcclxuXHJcbiAgaWYgKGlzU2FtZURheShzZWxlY3RlZERhdGUsIGZvY3VzZWREYXRlKSkge1xyXG4gICAgc3RhdHVzZXMucHVzaChcIlNlbGVjdGVkIGRhdGVcIik7XHJcbiAgfVxyXG5cclxuICBpZiAoY2FsZW5kYXJXYXNIaWRkZW4pIHtcclxuICAgIHN0YXR1c2VzLnB1c2goXHJcbiAgICAgIFwiRHUga2FuIG5hdmlnZXJlIG1lbGxlbSBkYWdlIHZlZCBhdCBicnVnZSBow7hqcmUgb2cgdmVuc3RyZSBwaWx0YXN0ZXIsIFwiLFxyXG4gICAgICBcInVnZXIgdmVkIGF0IGJydWdlIG9wIG9nIG5lZCBwaWx0YXN0ZXIsIFwiLFxyXG4gICAgICBcIm3DpW5lZGVyIHZlZCB0YSBicnVnZSBwYWdlIHVwIG9nIHBhZ2UgZG93biB0YXN0ZXJuZSBcIixcclxuICAgICAgXCJvZyDDpXIgdmVkIGF0IGF0IHRhc3RlIHNoaWZ0IG9nIHBhZ2UgdXAgZWxsZXIgbmVkLlwiLFxyXG4gICAgICBcIkhvbWUgb2cgZW5kIHRhc3RlbiBuYXZpZ2VyZXIgdGlsIHN0YXJ0IGVsbGVyIHNsdXRuaW5nIGFmIGVuIHVnZS5cIlxyXG4gICAgKTtcclxuICAgIHN0YXR1c0VsLnRleHRDb250ZW50ID0gXCJcIjtcclxuICB9IGVsc2Uge1xyXG4gICAgc3RhdHVzZXMucHVzaChgJHttb250aExhYmVsfSAke2ZvY3VzZWRZZWFyfWApO1xyXG4gIH1cclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IHN0YXR1c2VzLmpvaW4oXCIuIFwiKTtcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVByZXZpb3VzWWVhciA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IHN1YlllYXJzKGNhbGVuZGFyRGF0ZSwgMSk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX1lFQVIpO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5UHJldmlvdXNNb250aCA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IHN1Yk1vbnRocyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9QUkVWSU9VU19NT05USCk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlOZXh0TW9udGggPSAoX2J1dHRvbkVsKSA9PiB7XHJcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIF9idXR0b25FbFxyXG4gICk7XHJcbiAgbGV0IGRhdGUgPSBhZGRNb250aHMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9NT05USCk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU5leHRZZWFyID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gYWRkWWVhcnMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9ZRUFSKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogSGlkZSB0aGUgY2FsZW5kYXIgb2YgYSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGhpZGVDYWxlbmRhciA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBjYWxlbmRhckVsLCBzdGF0dXNFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LnJlbW92ZShEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MpO1xyXG4gIGNhbGVuZGFyRWwuaGlkZGVuID0gdHJ1ZTtcclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IFwiXCI7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgZGF0ZSB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gY2FsZW5kYXJEYXRlRWwgQSBkYXRlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHNlbGVjdERhdGUgPSAoY2FsZW5kYXJEYXRlRWwpID0+IHtcclxuICBpZiAoY2FsZW5kYXJEYXRlRWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGV4dGVybmFsSW5wdXRFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBjYWxlbmRhckRhdGVFbFxyXG4gICk7XHJcbiAgc2V0Q2FsZW5kYXJWYWx1ZShjYWxlbmRhckRhdGVFbCwgY2FsZW5kYXJEYXRlRWwuZGF0YXNldC52YWx1ZSk7XHJcbiAgaGlkZUNhbGVuZGFyKGRhdGVQaWNrZXJFbCk7XHJcblxyXG4gIGV4dGVybmFsSW5wdXRFbC5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHRvZ2dsZUNhbGVuZGFyID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3Qge1xyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIGlucHV0RGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gICAgZGVmYXVsdERhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgaWYgKGNhbGVuZGFyRWwuaGlkZGVuKSB7XHJcbiAgICBjb25zdCBkYXRlVG9EaXNwbGF5ID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KFxyXG4gICAgICBpbnB1dERhdGUgfHwgZGVmYXVsdERhdGUgfHwgdG9kYXkoKSxcclxuICAgICAgbWluRGF0ZSxcclxuICAgICAgbWF4RGF0ZVxyXG4gICAgKTtcclxuICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZVRvRGlzcGxheSk7XHJcbiAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgaGlkZUNhbGVuZGFyKGVsKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVXBkYXRlIHRoZSBjYWxlbmRhciB3aGVuIHZpc2libGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIGFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlclxyXG4gKi9cclxuY29uc3QgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGlucHV0RGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGNvbnN0IGNhbGVuZGFyU2hvd24gPSAhY2FsZW5kYXJFbC5oaWRkZW47XHJcblxyXG4gIGlmIChjYWxlbmRhclNob3duICYmIGlucHV0RGF0ZSkge1xyXG4gICAgY29uc3QgZGF0ZVRvRGlzcGxheSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChpbnB1dERhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZVRvRGlzcGxheSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciAtIERhdGUgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBNb250aCBTZWxlY3Rpb24gVmlld1xyXG4vKipcclxuICogRGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbiBpbiB0aGUgZGF0ZSBwaWNrZXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBhIHJlZmVyZW5jZSB0byB0aGUgbmV3IGNhbGVuZGFyIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlNb250aFNlbGVjdGlvbiA9IChlbCwgbW9udGhUb0Rpc3BsYXkpID0+IHtcclxuICBjb25zdCB7XHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBjYWxlbmRhckRhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBjb25zdCBzZWxlY3RlZE1vbnRoID0gY2FsZW5kYXJEYXRlLmdldE1vbnRoKCk7XHJcbiAgY29uc3QgZm9jdXNlZE1vbnRoID0gbW9udGhUb0Rpc3BsYXkgPT0gbnVsbCA/IHNlbGVjdGVkTW9udGggOiBtb250aFRvRGlzcGxheTtcclxuXHJcbiAgY29uc3QgbW9udGhzID0gTU9OVEhfTEFCRUxTLm1hcCgobW9udGgsIGluZGV4KSA9PiB7XHJcbiAgICBjb25zdCBtb250aFRvQ2hlY2sgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIGluZGV4KTtcclxuXHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gaXNEYXRlc01vbnRoT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgICBtb250aFRvQ2hlY2ssXHJcbiAgICAgIG1pbkRhdGUsXHJcbiAgICAgIG1heERhdGVcclxuICAgICk7XHJcblxyXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xyXG5cclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfTU9OVEhfQ0xBU1NdO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGluZGV4ID09PSBzZWxlY3RlZE1vbnRoO1xyXG5cclxuICAgIGlmIChpbmRleCA9PT0gZm9jdXNlZE1vbnRoKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTZWxlY3RlZCkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfTU9OVEhfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBgPGJ1dHRvbiBcclxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcclxuICAgICAgICBjbGFzcz1cIiR7Y2xhc3Nlcy5qb2luKFwiIFwiKX1cIiBcclxuICAgICAgICBkYXRhLXZhbHVlPVwiJHtpbmRleH1cIlxyXG4gICAgICAgIGRhdGEtbGFiZWw9XCIke21vbnRofVwiXHJcbiAgICAgICAgYXJpYS1zZWxlY3RlZD1cIiR7aXNTZWxlY3RlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwifVwiXHJcbiAgICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICA+JHttb250aH08L2J1dHRvbj5gO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBtb250aHNIdG1sID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1N9XCI+XHJcbiAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgPHRib2R5PlxyXG4gICAgICAgICR7bGlzdFRvR3JpZEh0bWwobW9udGhzLCAzKX1cclxuICAgICAgPC90Ym9keT5cclxuICAgIDwvdGFibGU+XHJcbiAgPC9kaXY+YDtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xyXG4gIG5ld0NhbGVuZGFyLmlubmVySFRNTCA9IG1vbnRoc0h0bWw7XHJcbiAgY2FsZW5kYXJFbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdDYWxlbmRhciwgY2FsZW5kYXJFbCk7XHJcblxyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gXCJTZWxlY3QgYSBtb250aC5cIjtcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCBhIG1vbnRoIGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IG1vbnRoRWwgQW4gbW9udGggZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3Qgc2VsZWN0TW9udGggPSAobW9udGhFbCkgPT4ge1xyXG4gIGlmIChtb250aEVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgbW9udGhFbFxyXG4gICk7XHJcbiAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gIGxldCBkYXRlID0gc2V0TW9udGgoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZE1vbnRoKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIC0gTW9udGggU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBZZWFyIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vKipcclxuICogRGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuIGluIHRoZSBkYXRlIHBpY2tlci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge251bWJlcn0geWVhclRvRGlzcGxheSB5ZWFyIHRvIGRpc3BsYXkgaW4geWVhciBzZWxlY3Rpb25cclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBhIHJlZmVyZW5jZSB0byB0aGUgbmV3IGNhbGVuZGFyIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlZZWFyU2VsZWN0aW9uID0gKGVsLCB5ZWFyVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgY2FsZW5kYXJEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gY2FsZW5kYXJEYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgY29uc3QgZm9jdXNlZFllYXIgPSB5ZWFyVG9EaXNwbGF5ID09IG51bGwgPyBzZWxlY3RlZFllYXIgOiB5ZWFyVG9EaXNwbGF5O1xyXG5cclxuICBsZXQgeWVhclRvQ2h1bmsgPSBmb2N1c2VkWWVhcjtcclxuICB5ZWFyVG9DaHVuayAtPSB5ZWFyVG9DaHVuayAlIFlFQVJfQ0hVTks7XHJcbiAgeWVhclRvQ2h1bmsgPSBNYXRoLm1heCgwLCB5ZWFyVG9DaHVuayk7XHJcblxyXG4gIGNvbnN0IHByZXZZZWFyQ2h1bmtEaXNhYmxlZCA9IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJUb0NodW5rIC0gMSksXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IG5leHRZZWFyQ2h1bmtEaXNhYmxlZCA9IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJUb0NodW5rICsgWUVBUl9DSFVOSyksXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IHllYXJzID0gW107XHJcbiAgbGV0IHllYXJJbmRleCA9IHllYXJUb0NodW5rO1xyXG4gIHdoaWxlICh5ZWFycy5sZW5ndGggPCBZRUFSX0NIVU5LKSB7XHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICAgIHNldFllYXIoY2FsZW5kYXJEYXRlLCB5ZWFySW5kZXgpLFxyXG4gICAgICBtaW5EYXRlLFxyXG4gICAgICBtYXhEYXRlXHJcbiAgICApO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBjbGFzc2VzID0gW0NBTEVOREFSX1lFQVJfQ0xBU1NdO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IHllYXJJbmRleCA9PT0gc2VsZWN0ZWRZZWFyO1xyXG5cclxuICAgIGlmICh5ZWFySW5kZXggPT09IGZvY3VzZWRZZWFyKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9ZRUFSX1NFTEVDVEVEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICB5ZWFycy5wdXNoKFxyXG4gICAgICBgPGJ1dHRvbiBcclxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcclxuICAgICAgICBjbGFzcz1cIiR7Y2xhc3Nlcy5qb2luKFwiIFwiKX1cIiBcclxuICAgICAgICBkYXRhLXZhbHVlPVwiJHt5ZWFySW5kZXh9XCJcclxuICAgICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgID4ke3llYXJJbmRleH08L2J1dHRvbj5gXHJcbiAgICApO1xyXG4gICAgeWVhckluZGV4ICs9IDE7XHJcbiAgfVxyXG5cclxuICBjb25zdCB5ZWFyc0h0bWwgPSBsaXN0VG9HcmlkSHRtbCh5ZWFycywgMyk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gY2FsZW5kYXJFbC5jbG9uZU5vZGUoKTtcclxuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCIke0NBTEVOREFSX1lFQVJfUElDS0VSX0NMQVNTfVwiPlxyXG4gICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTU31cIiBcclxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJOYXZpZ8OpciAke1lFQVJfQ0hVTkt9IMOlciB0aWxiYWdlXCJcclxuICAgICAgICAgICAgICAgICR7cHJldlllYXJDaHVua0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIzXCI+XHJcbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICR7eWVhcnNIdG1sfVxyXG4gICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTfVwiIFxyXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk5hdmlnw6lyICR7WUVBUl9DSFVOS30gw6VyIGZyZW1cIlxyXG4gICAgICAgICAgICAgICAgJHtuZXh0WWVhckNodW5rRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgPC90cj5cclxuICAgICAgICA8L3Rib2R5PlxyXG4gICAgICA8L3RhYmxlPlxyXG4gICAgPC9kaXY+YDtcclxuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcclxuXHJcbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBgU2hvd2luZyB5ZWFycyAke3llYXJUb0NodW5rfSB0byAke1xyXG4gICAgeWVhclRvQ2h1bmsgKyBZRUFSX0NIVU5LIC0gMVxyXG4gIH0uIFNlbGVjdCBhIHllYXIuYDtcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgYnkgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVByZXZpb3VzWWVhckNodW5rID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGVsXHJcbiAgKTtcclxuICBjb25zdCB5ZWFyRWwgPSBjYWxlbmRhckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKTtcclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwudGV4dENvbnRlbnQsIDEwKTtcclxuXHJcbiAgbGV0IGFkanVzdGVkWWVhciA9IHNlbGVjdGVkWWVhciAtIFlFQVJfQ0hVTks7XHJcbiAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBjYXBwZWREYXRlLmdldEZ1bGxZZWFyKClcclxuICApO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTkspO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIGJ5IHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlOZXh0WWVhckNodW5rID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGVsXHJcbiAgKTtcclxuICBjb25zdCB5ZWFyRWwgPSBjYWxlbmRhckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKTtcclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwudGV4dENvbnRlbnQsIDEwKTtcclxuXHJcbiAgbGV0IGFkanVzdGVkWWVhciA9IHNlbGVjdGVkWWVhciArIFlFQVJfQ0hVTks7XHJcbiAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBjYXBwZWREYXRlLmdldEZ1bGxZZWFyKClcclxuICApO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCBhIHllYXIgaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0geWVhckVsIEEgeWVhciBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBzZWxlY3RZZWFyID0gKHllYXJFbCkgPT4ge1xyXG4gIGlmICh5ZWFyRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICB5ZWFyRWxcclxuICApO1xyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC5pbm5lckhUTUwsIDEwKTtcclxuICBsZXQgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZFllYXIpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBZZWFyIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogSGlkZSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVzY2FwZUZyb21DYWxlbmRhciA9IChldmVudCkgPT4ge1xyXG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBleHRlcm5hbElucHV0RWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGV2ZW50LnRhcmdldCk7XHJcblxyXG4gIGhpZGVDYWxlbmRhcihkYXRlUGlja2VyRWwpO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5mb2N1cygpO1xyXG5cclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBEYXRlIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSBkYXRlIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhciBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFkanVzdERhdGVGbiBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkanVzdENhbGVuZGFyID0gKGFkanVzdERhdGVGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgICAgZXZlbnQudGFyZ2V0XHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBhZGp1c3REYXRlRm4oY2FsZW5kYXJEYXRlKTtcclxuXHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVEYXkoY2FsZW5kYXJEYXRlLCBjYXBwZWREYXRlKSkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGNhcHBlZERhdGUpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJXZWVrcyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgd2VlayBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRXZWVrcyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgZGF5IGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTGVmdEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1YkRheXMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIGRheSBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkRGF5cyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN0YXJ0T2ZXZWVrKGRhdGUpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZW5kIG9mIHRoZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gZW5kT2ZXZWVrKGRhdGUpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkTW9udGhzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1Yk1vbnRocyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVNoaWZ0UGFnZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRZZWFycyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVNoaWZ0UGFnZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViWWVhcnMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIGRpc3BsYXkgdGhlIGNhbGVuZGFyIGZvciB0aGUgbW91c2Vtb3ZlIGRhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBkYXRlRWwgQSBkYXRlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZU1vdXNlbW92ZUZyb21EYXRlID0gKGRhdGVFbCkgPT4ge1xyXG4gIGlmIChkYXRlRWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgY2FsZW5kYXJFbCA9IGRhdGVFbC5jbG9zZXN0KERBVEVfUElDS0VSX0NBTEVOREFSKTtcclxuXHJcbiAgY29uc3QgY3VycmVudENhbGVuZGFyRGF0ZSA9IGNhbGVuZGFyRWwuZGF0YXNldC52YWx1ZTtcclxuICBjb25zdCBob3ZlckRhdGUgPSBkYXRlRWwuZGF0YXNldC52YWx1ZTtcclxuXHJcbiAgaWYgKGhvdmVyRGF0ZSA9PT0gY3VycmVudENhbGVuZGFyRGF0ZSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBkYXRlVG9EaXNwbGF5ID0gcGFyc2VEYXRlU3RyaW5nKGhvdmVyRGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgRGF0ZSBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBNb250aCBFdmVudCBIYW5kbGluZ1xyXG5cclxuLyoqXHJcbiAqIEFkanVzdCB0aGUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4gaWYgbmVlZGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3RNb250aEZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgbW9udGhcclxuICovXHJcbmNvbnN0IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuID0gKGFkanVzdE1vbnRoRm4pID0+IHtcclxuICByZXR1cm4gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBtb250aEVsID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICBtb250aEVsXHJcbiAgICApO1xyXG4gICAgY29uc3QgY3VycmVudERhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIHNlbGVjdGVkTW9udGgpO1xyXG5cclxuICAgIGxldCBhZGp1c3RlZE1vbnRoID0gYWRqdXN0TW9udGhGbihzZWxlY3RlZE1vbnRoKTtcclxuICAgIGFkanVzdGVkTW9udGggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMSwgYWRqdXN0ZWRNb250aCkpO1xyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIGFkanVzdGVkTW9udGgpO1xyXG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIGlmICghaXNTYW1lTW9udGgoY3VycmVudERhdGUsIGNhcHBlZERhdGUpKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKFxyXG4gICAgICAgIGNhbGVuZGFyRWwsXHJcbiAgICAgICAgY2FwcGVkRGF0ZS5nZXRNb250aCgpXHJcbiAgICAgICk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIHRocmVlIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoIC0gMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCB0aHJlZSBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoICsgMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUxlZnRGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoIC0gMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKG1vbnRoKSA9PiBtb250aCArIDEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgcm93IG9mIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKFxyXG4gIChtb250aCkgPT4gbW9udGggLSAobW9udGggJSAzKVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHJvdyBvZiBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVuZEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKFxyXG4gIChtb250aCkgPT4gbW9udGggKyAyIC0gKG1vbnRoICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgbGFzdCBtb250aCAoRGVjZW1iZXIpIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKCgpID0+IDExKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZmlyc3QgbW9udGggKEphbnVhcnkpIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlVXBGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigoKSA9PiAwKTtcclxuXHJcbi8qKlxyXG4gKiB1cGRhdGUgdGhlIGZvY3VzIG9uIGEgbW9udGggd2hlbiB0aGUgbW91c2UgbW92ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBtb250aEVsIEEgbW9udGggZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbU1vbnRoID0gKG1vbnRoRWwpID0+IHtcclxuICBpZiAobW9udGhFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGlmIChtb250aEVsLmNsYXNzTGlzdC5jb250YWlucyhDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTKSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBmb2N1c01vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKG1vbnRoRWwsIGZvY3VzTW9udGgpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgTW9udGggRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgWWVhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLyoqXHJcbiAqIEFkanVzdCB0aGUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuIGlmIG5lZWRlZC5cclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWRqdXN0WWVhckZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgeWVhclxyXG4gKi9cclxuY29uc3QgYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbiA9IChhZGp1c3RZZWFyRm4pID0+IHtcclxuICByZXR1cm4gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB5ZWFyRWwgPSBldmVudC50YXJnZXQ7XHJcbiAgICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICB5ZWFyRWxcclxuICAgICk7XHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZFllYXIpO1xyXG5cclxuICAgIGxldCBhZGp1c3RlZFllYXIgPSBhZGp1c3RZZWFyRm4oc2VsZWN0ZWRZZWFyKTtcclxuICAgIGFkanVzdGVkWWVhciA9IE1hdGgubWF4KDAsIGFkanVzdGVkWWVhcik7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIGlmICghaXNTYW1lWWVhcihjdXJyZW50RGF0ZSwgY2FwcGVkRGF0ZSkpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgICAgICBjYWxlbmRhckVsLFxyXG4gICAgICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxyXG4gICAgICApO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIHRocmVlIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVVwRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyIC0gMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCB0aHJlZSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVEb3duRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyICsgMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVMZWZ0RnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyIC0gMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVSaWdodEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbigoeWVhcikgPT4geWVhciArIDEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgcm93IG9mIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUhvbWVGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKHllYXIpID0+IHllYXIgLSAoeWVhciAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIGVuZCBvZiB0aGUgcm93IG9mIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVuZEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciArIDIgLSAoeWVhciAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gYmFjayAxMiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlVXBGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKHllYXIpID0+IHllYXIgLSBZRUFSX0NIVU5LXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCAxMiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciArIFlFQVJfQ0hVTktcclxuKTtcclxuXHJcbi8qKlxyXG4gKiB1cGRhdGUgdGhlIGZvY3VzIG9uIGEgeWVhciB3aGVuIHRoZSBtb3VzZSBtb3Zlcy5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGRhdGVFbCBBIHllYXIgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbVllYXIgPSAoeWVhckVsKSA9PiB7XHJcbiAgaWYgKHllYXJFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGlmICh5ZWFyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUykpIHJldHVybjtcclxuXHJcbiAgY29uc3QgZm9jdXNZZWFyID0gcGFyc2VJbnQoeWVhckVsLmRhdGFzZXQudmFsdWUsIDEwKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbih5ZWFyRWwsIGZvY3VzWWVhcik7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIFllYXIgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gRm9jdXMgSGFuZGxpbmcgRXZlbnQgSGFuZGxpbmdcclxuXHJcbmNvbnN0IHRhYkhhbmRsZXIgPSAoZm9jdXNhYmxlKSA9PiB7XHJcbiAgY29uc3QgZ2V0Rm9jdXNhYmxlQ29udGV4dCA9IChlbCkgPT4ge1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IHNlbGVjdChmb2N1c2FibGUsIGNhbGVuZGFyRWwpO1xyXG5cclxuICAgIGNvbnN0IGZpcnN0VGFiSW5kZXggPSAwO1xyXG4gICAgY29uc3QgbGFzdFRhYkluZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMTtcclxuICAgIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2ZpcnN0VGFiSW5kZXhdO1xyXG4gICAgY29uc3QgbGFzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1tsYXN0VGFiSW5kZXhdO1xyXG4gICAgY29uc3QgZm9jdXNJbmRleCA9IGZvY3VzYWJsZUVsZW1lbnRzLmluZGV4T2YoYWN0aXZlRWxlbWVudCgpKTtcclxuXHJcbiAgICBjb25zdCBpc0xhc3RUYWIgPSBmb2N1c0luZGV4ID09PSBsYXN0VGFiSW5kZXg7XHJcbiAgICBjb25zdCBpc0ZpcnN0VGFiID0gZm9jdXNJbmRleCA9PT0gZmlyc3RUYWJJbmRleDtcclxuICAgIGNvbnN0IGlzTm90Rm91bmQgPSBmb2N1c0luZGV4ID09PSAtMTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBmb2N1c2FibGVFbGVtZW50cyxcclxuICAgICAgaXNOb3RGb3VuZCxcclxuICAgICAgZmlyc3RUYWJTdG9wLFxyXG4gICAgICBpc0ZpcnN0VGFiLFxyXG4gICAgICBsYXN0VGFiU3RvcCxcclxuICAgICAgaXNMYXN0VGFiLFxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdGFiQWhlYWQoZXZlbnQpIHtcclxuICAgICAgY29uc3QgeyBmaXJzdFRhYlN0b3AsIGlzTGFzdFRhYiwgaXNOb3RGb3VuZCB9ID0gZ2V0Rm9jdXNhYmxlQ29udGV4dChcclxuICAgICAgICBldmVudC50YXJnZXRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChpc0xhc3RUYWIgfHwgaXNOb3RGb3VuZCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0YWJCYWNrKGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IHsgbGFzdFRhYlN0b3AsIGlzRmlyc3RUYWIsIGlzTm90Rm91bmQgfSA9IGdldEZvY3VzYWJsZUNvbnRleHQoXHJcbiAgICAgICAgZXZlbnQudGFyZ2V0XHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAoaXNGaXJzdFRhYiB8fCBpc05vdEZvdW5kKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyID0gdGFiSGFuZGxlcihEQVRFX1BJQ0tFUl9GT0NVU0FCTEUpO1xyXG5jb25zdCBtb250aFBpY2tlclRhYkV2ZW50SGFuZGxlciA9IHRhYkhhbmRsZXIoTU9OVEhfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcbmNvbnN0IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKFlFQVJfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcblxyXG4vLyAjZW5kcmVnaW9uIEZvY3VzIEhhbmRsaW5nIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIERhdGUgUGlja2VyIEV2ZW50IERlbGVnYXRpb24gUmVnaXN0cmF0aW9uIC8gQ29tcG9uZW50XHJcblxyXG5jb25zdCBkYXRlUGlja2VyRXZlbnRzID0ge1xyXG4gIFtDTElDS106IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9CVVRUT05dKCkge1xyXG4gICAgICB0b2dnbGVDYWxlbmRhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfREFURV0oKSB7XHJcbiAgICAgIHNlbGVjdERhdGUodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIXSgpIHtcclxuICAgICAgc2VsZWN0TW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJdKCkge1xyXG4gICAgICBzZWxlY3RZZWFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19NT05USF0oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c01vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ORVhUX01PTlRIXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRNb250aCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl0oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c1llYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX05FWFRfWUVBUl0oKSB7XHJcbiAgICAgIGRpc3BsYXlOZXh0WWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS10oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c1llYXJDaHVuayh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRZZWFyQ2h1bmsodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl0oKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKHRoaXMpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX01PTlRIX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OXSgpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbih0aGlzKTtcclxuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAga2V5dXA6IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9DQUxFTkRBUl0oZXZlbnQpIHtcclxuICAgICAgY29uc3Qga2V5ZG93biA9IHRoaXMuZGF0YXNldC5rZXlkb3duS2V5Q29kZTtcclxuICAgICAgaWYgKGAke2V2ZW50LmtleUNvZGV9YCAhPT0ga2V5ZG93bikge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBrZXlkb3duOiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBFTlRFUl9LRVlDT0RFKSB7XHJcbiAgICAgICAgdmFsaWRhdGVEYXRlSW5wdXQodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfREFURV06IHJlY2VwdG9yLmtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21EYXRlLFxyXG4gICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21EYXRlLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbURhdGUsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21EYXRlLFxyXG4gICAgICBMZWZ0OiBoYW5kbGVMZWZ0RnJvbURhdGUsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21EYXRlLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tRGF0ZSxcclxuICAgICAgQXJyb3dSaWdodDogaGFuZGxlUmlnaHRGcm9tRGF0ZSxcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21EYXRlLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21EYXRlLFxyXG4gICAgICBQYWdlRG93bjogaGFuZGxlUGFnZURvd25Gcm9tRGF0ZSxcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tRGF0ZSxcclxuICAgICAgXCJTaGlmdCtQYWdlRG93blwiOiBoYW5kbGVTaGlmdFBhZ2VEb3duRnJvbURhdGUsXHJcbiAgICAgIFwiU2hpZnQrUGFnZVVwXCI6IGhhbmRsZVNoaWZ0UGFnZVVwRnJvbURhdGUsXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9EQVRFX1BJQ0tFUl06IHJlY2VwdG9yLmtleW1hcCh7XHJcbiAgICAgIFRhYjogZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJBaGVhZCxcclxuICAgICAgXCJTaGlmdCtUYWJcIjogZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdOiByZWNlcHRvci5rZXltYXAoe1xyXG4gICAgICBVcDogaGFuZGxlVXBGcm9tTW9udGgsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbU1vbnRoLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbU1vbnRoLFxyXG4gICAgICBBcnJvd0Rvd246IGhhbmRsZURvd25Gcm9tTW9udGgsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tTW9udGgsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21Nb250aCxcclxuICAgICAgUmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbU1vbnRoLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21Nb250aCxcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21Nb250aCxcclxuICAgICAgRW5kOiBoYW5kbGVFbmRGcm9tTW9udGgsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21Nb250aCxcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tTW9udGgsXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9NT05USF9QSUNLRVJdOiByZWNlcHRvci5rZXltYXAoe1xyXG4gICAgICBUYWI6IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiBtb250aFBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl06IHJlY2VwdG9yLmtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21ZZWFyLFxyXG4gICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21ZZWFyLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbVllYXIsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21ZZWFyLFxyXG4gICAgICBMZWZ0OiBoYW5kbGVMZWZ0RnJvbVllYXIsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21ZZWFyLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tWWVhcixcclxuICAgICAgQXJyb3dSaWdodDogaGFuZGxlUmlnaHRGcm9tWWVhcixcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21ZZWFyLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21ZZWFyLFxyXG4gICAgICBQYWdlRG93bjogaGFuZGxlUGFnZURvd25Gcm9tWWVhcixcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tWWVhcixcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX1lFQVJfUElDS0VSXTogcmVjZXB0b3Iua2V5bWFwKHtcclxuICAgICAgVGFiOiB5ZWFyUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiB5ZWFyUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtEQVRFX1BJQ0tFUl9DQUxFTkRBUl0oZXZlbnQpIHtcclxuICAgICAgdGhpcy5kYXRhc2V0LmtleWRvd25LZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcclxuICAgIH0sXHJcbiAgICBbREFURV9QSUNLRVJdKGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IGtleU1hcCA9IHJlY2VwdG9yLmtleW1hcCh7XHJcbiAgICAgICAgRXNjYXBlOiBoYW5kbGVFc2NhcGVGcm9tQ2FsZW5kYXIsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAga2V5TWFwKGV2ZW50KTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBmb2N1c291dDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXSgpIHtcclxuICAgICAgdmFsaWRhdGVEYXRlSW5wdXQodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0RBVEVfUElDS0VSXShldmVudCkge1xyXG4gICAgICBpZiAoIXRoaXMuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpIHtcclxuICAgICAgICBoaWRlQ2FsZW5kYXIodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBpbnB1dDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXSgpIHtcclxuICAgICAgcmVjb25jaWxlSW5wdXRWYWx1ZXModGhpcyk7XHJcbiAgICAgIHVwZGF0ZUNhbGVuZGFySWZWaXNpYmxlKHRoaXMpO1xyXG4gICAgfSxcclxuICB9LFxyXG59O1xyXG5cclxuaWYgKCFpc0lvc0RldmljZSgpKSB7XHJcbiAgZGF0ZVBpY2tlckV2ZW50cy5tb3VzZW1vdmUgPSB7XHJcbiAgICBbQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbURhdGUodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbU1vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ZRUFSXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbVllYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmNvbnN0IGRhdGVQaWNrZXIgPSBiZWhhdmlvcihkYXRlUGlja2VyRXZlbnRzLCB7XHJcbiAgaW5pdChyb290KSB7XHJcbiAgICBzZWxlY3QoREFURV9QSUNLRVIsIHJvb3QpLmZvckVhY2goKGRhdGVQaWNrZXJFbCkgPT4ge1xyXG4gICAgICBpZighZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5jb250YWlucyhEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUykpe1xyXG4gICAgICAgIGVuaGFuY2VEYXRlUGlja2VyKGRhdGVQaWNrZXJFbCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgZ2V0RGF0ZVBpY2tlckNvbnRleHQsXHJcbiAgZGlzYWJsZSxcclxuICBlbmFibGUsXHJcbiAgaXNEYXRlSW5wdXRJbnZhbGlkLFxyXG4gIHNldENhbGVuZGFyVmFsdWUsXHJcbiAgdmFsaWRhdGVEYXRlSW5wdXQsXHJcbiAgcmVuZGVyQ2FsZW5kYXIsXHJcbiAgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUsXHJcbn0pO1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBEYXRlIFBpY2tlciBFdmVudCBEZWxlZ2F0aW9uIFJlZ2lzdHJhdGlvbiAvIENvbXBvbmVudFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkYXRlUGlja2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL2Ryb3Bkb3duJztcclxuaW1wb3J0ICcuLi9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQnO1xyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIHNvcnRpbmcgdmFyaWFudCBvZiBPdmVyZmxvdyBtZW51IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLm92ZXJmbG93LW1lbnUgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gRHJvcGRvd25Tb3J0IChjb250YWluZXIpe1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICB0aGlzLmJ1dHRvbiA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24tb3ZlcmZsb3ctbWVudScpWzBdO1xyXG5cclxuICAgIC8vIGlmIG5vIHZhbHVlIGlzIHNlbGVjdGVkLCBjaG9vc2UgZmlyc3Qgb3B0aW9uXHJcbiAgICBpZighdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLm92ZXJmbG93LWxpc3QgbGlbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKSl7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm92ZXJmbG93LWxpc3QgbGknKVswXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBcInRydWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVTZWxlY3RlZFZhbHVlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQgY2xpY2sgZXZlbnRzIG9uIG92ZXJmbG93IG1lbnUgYW5kIG9wdGlvbnMgaW4gbWVudVxyXG4gKi9cclxuRHJvcGRvd25Tb3J0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMub3ZlcmZsb3dNZW51ID0gbmV3IERyb3Bkb3duKHRoaXMuYnV0dG9uKS5pbml0KCk7XHJcblxyXG4gICAgbGV0IHNvcnRpbmdPcHRpb25zID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm92ZXJmbG93LWxpc3QgbGkgYnV0dG9uJyk7XHJcbiAgICBmb3IobGV0IHMgPSAwOyBzIDwgc29ydGluZ09wdGlvbnMubGVuZ3RoOyBzKyspe1xyXG4gICAgICAgIGxldCBvcHRpb24gPSBzb3J0aW5nT3B0aW9uc1tzXTtcclxuICAgICAgICBvcHRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uT3B0aW9uQ2xpY2suYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgYnV0dG9uIHRleHQgdG8gc2VsZWN0ZWQgdmFsdWVcclxuICovXHJcbkRyb3Bkb3duU29ydC5wcm90b3R5cGUudXBkYXRlU2VsZWN0ZWRWYWx1ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgc2VsZWN0ZWRJdGVtID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLm92ZXJmbG93LWxpc3QgbGlbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKTtcclxuICAgIHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbi1vdmVyZmxvdy1tZW51JylbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VsZWN0ZWQtdmFsdWUnKVswXS5pbm5lclRleHQgPSBzZWxlY3RlZEl0ZW0uaW5uZXJUZXh0O1xyXG59XHJcblxyXG4vKipcclxuICogVHJpZ2dlcnMgd2hlbiBjaG9vc2luZyBvcHRpb24gaW4gbWVudVxyXG4gKiBAcGFyYW0ge1BvaW50ZXJFdmVudH0gZVxyXG4gKi9cclxuRHJvcGRvd25Tb3J0LnByb3RvdHlwZS5vbk9wdGlvbkNsaWNrID0gZnVuY3Rpb24oZSl7XHJcbiAgICBsZXQgbGkgPSBlLnRhcmdldC5wYXJlbnROb2RlO1xyXG4gICAgbGkucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCdsaVthcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpO1xyXG4gICAgbGkuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuXHJcbiAgICBsZXQgYnV0dG9uID0gbGkucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXTtcclxuICAgIGxldCBldmVudFNlbGVjdGVkID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uc2VsZWN0ZWQnKTtcclxuICAgIGV2ZW50U2VsZWN0ZWQuZGV0YWlsID0gdGhpcy50YXJnZXQ7XHJcbiAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudFNlbGVjdGVkKTtcclxuICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRWYWx1ZSgpO1xyXG5cclxuICAgIC8vIGhpZGUgbWVudVxyXG4gICAgbGV0IG92ZXJmbG93TWVudSA9IG5ldyBEcm9wZG93bihidXR0b24pO1xyXG4gICAgb3ZlcmZsb3dNZW51LmhpZGUoKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd25Tb3J0O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGJyZWFrcG9pbnRzID0gcmVxdWlyZSgnLi4vdXRpbHMvYnJlYWtwb2ludHMnKTtcclxuY29uc3QgQlVUVE9OID0gJy5qcy1kcm9wZG93bic7XHJcbmNvbnN0IGpzRHJvcGRvd25Db2xsYXBzZU1vZGlmaWVyID0gJ2pzLWRyb3Bkb3duLS1yZXNwb25zaXZlLWNvbGxhcHNlJzsgLy9vcHRpb246IG1ha2UgZHJvcGRvd24gYmVoYXZlIGFzIHRoZSBjb2xsYXBzZSBjb21wb25lbnQgd2hlbiBvbiBzbWFsbCBzY3JlZW5zICh1c2VkIGJ5IHN1Ym1lbnVzIGluIHRoZSBoZWFkZXIgYW5kIHN0ZXAtZHJvcGRvd24pLlxyXG5jb25zdCBUQVJHRVQgPSAnZGF0YS1qcy10YXJnZXQnO1xyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIG92ZXJmbG93IG1lbnUgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvbkVsZW1lbnQgT3ZlcmZsb3cgbWVudSBidXR0b25cclxuICovXHJcbmZ1bmN0aW9uIERyb3Bkb3duIChidXR0b25FbGVtZW50KSB7XHJcbiAgdGhpcy5idXR0b25FbGVtZW50ID0gYnV0dG9uRWxlbWVudDtcclxuICB0aGlzLnRhcmdldEVsID0gbnVsbDtcclxuICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gZmFsc2U7XHJcblxyXG4gIGlmKHRoaXMuYnV0dG9uRWxlbWVudCA9PT0gbnVsbCB8fHRoaXMuYnV0dG9uRWxlbWVudCA9PT0gdW5kZWZpbmVkKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYnV0dG9uIGZvciBvdmVyZmxvdyBtZW51IGNvbXBvbmVudC5gKTtcclxuICB9XHJcbiAgbGV0IHRhcmdldEF0dHIgPSB0aGlzLmJ1dHRvbkVsZW1lbnQuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgaWYodGFyZ2V0QXR0ciA9PT0gbnVsbCB8fCB0YXJnZXRBdHRyID09PSB1bmRlZmluZWQpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdBdHRyaWJ1dGUgY291bGQgbm90IGJlIGZvdW5kIG9uIG92ZXJmbG93IG1lbnUgY29tcG9uZW50OiAnK1RBUkdFVCk7XHJcbiAgfVxyXG4gIGxldCB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKSk7XHJcbiAgaWYodGFyZ2V0RWwgPT09IG51bGwgfHwgdGFyZ2V0RWwgPT09IHVuZGVmaW5lZCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhbmVsIGZvciBvdmVyZmxvdyBtZW51IGNvbXBvbmVudCBjb3VsZCBub3QgYmUgZm91bmQuJyk7XHJcbiAgfVxyXG4gIHRoaXMudGFyZ2V0RWwgPSB0YXJnZXRFbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBjbGljayBldmVudHNcclxuICovXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCl7XHJcbiAgaWYodGhpcy5idXR0b25FbGVtZW50ICE9PSBudWxsICYmIHRoaXMuYnV0dG9uRWxlbWVudCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudGFyZ2V0RWwgIT09IG51bGwgJiYgdGhpcy50YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuXHJcbiAgICBpZih0aGlzLmJ1dHRvbkVsZW1lbnQucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSB8fCB0aGlzLmJ1dHRvbkVsZW1lbnQucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSl7XHJcbiAgICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vQ2xpY2tlZCBvdXRzaWRlIGRyb3Bkb3duIC0+IGNsb3NlIGl0XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xvc2UpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3V0c2lkZUNsb3NlKTtcclxuICAgIC8vQ2xpY2tlZCBvbiBkcm9wZG93biBvcGVuIGJ1dHRvbiAtLT4gdG9nZ2xlIGl0XHJcbiAgICB0aGlzLmJ1dHRvbkVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVEcm9wZG93bik7XHJcbiAgICB0aGlzLmJ1dHRvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVEcm9wZG93bik7XHJcbiAgICBsZXQgJG1vZHVsZSA9IHRoaXM7XHJcbiAgICAvLyBzZXQgYXJpYS1oaWRkZW4gY29ycmVjdGx5IGZvciBzY3JlZW5yZWFkZXJzIChUcmluZ3VpZGUgcmVzcG9uc2l2ZSlcclxuICAgIGlmKHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQpIHtcclxuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgIGlmICh3aW5kb3cuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpIHtcclxuICAgICAgICAvLyB0cmlnZ2VyIGV2ZW50IHdoZW4gYnV0dG9uIGNoYW5nZXMgdmlzaWJpbGl0eVxyXG4gICAgICAgIGxldCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihmdW5jdGlvbiAoZW50cmllcykge1xyXG4gICAgICAgICAgLy8gYnV0dG9uIGlzIHZpc2libGVcclxuICAgICAgICAgIGlmIChlbnRyaWVzWyAwIF0uaW50ZXJzZWN0aW9uUmF0aW8pIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBidXR0b24gaXMgbm90IHZpc2libGVcclxuICAgICAgICAgICAgaWYgKCRtb2R1bGUudGFyZ2V0RWwuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAndHJ1ZScpIHtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgIHJvb3Q6IGRvY3VtZW50LmJvZHlcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIElFOiBJbnRlcnNlY3Rpb25PYnNlcnZlciBpcyBub3Qgc3VwcG9ydGVkLCBzbyB3ZSBsaXN0ZW4gZm9yIHdpbmRvdyByZXNpemUgYW5kIGdyaWQgYnJlYWtwb2ludCBpbnN0ZWFkXHJcbiAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKCRtb2R1bGUudHJpZ2dlckVsKSkge1xyXG4gICAgICAgICAgLy8gc21hbGwgc2NyZWVuXHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gTGFyZ2Ugc2NyZWVuXHJcbiAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSgkbW9kdWxlLnRyaWdnZXJFbCkpIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICB2YXIga2V5ID0gZS53aGljaCB8fCBlLmtleUNvZGU7XHJcbiAgICAgIGlmIChrZXkgPT09IDI3KSB7XHJcbiAgICAgICAgY2xvc2VBbGwoZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEhpZGUgb3ZlcmZsb3cgbWVudVxyXG4gKi9cclxuRHJvcGRvd24ucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpe1xyXG4gIHRvZ2dsZSh0aGlzLmJ1dHRvbkVsZW1lbnQpO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdyBvdmVyZmxvdyBtZW51XHJcbiAqL1xyXG5Ecm9wZG93bi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCl7XHJcbiAgdG9nZ2xlKHRoaXMuYnV0dG9uRWxlbWVudCk7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogR2V0IGFuIEFycmF5IG9mIGJ1dHRvbiBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXHJcbiAqIGFjY29yZGlvbiBlbGVtZW50LlxyXG4gKiBAcGFyYW0gcGFyZW50IGFjY29yZGlvbiBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHtOb2RlTGlzdE9mPFNWR0VsZW1lbnRUYWdOYW1lTWFwW1tzdHJpbmddXT4gfCBOb2RlTGlzdE9mPEhUTUxFbGVtZW50VGFnTmFtZU1hcFtbc3RyaW5nXV0+IHwgTm9kZUxpc3RPZjxFbGVtZW50Pn1cclxuICovXHJcbmxldCBnZXRCdXR0b25zID0gZnVuY3Rpb24gKHBhcmVudCkge1xyXG4gIHJldHVybiBwYXJlbnQucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsb3NlIGFsbCBvdmVyZmxvdyBtZW51c1xyXG4gKiBAcGFyYW0ge2V2ZW50fSBldmVudCBkZWZhdWx0IGlzIG51bGxcclxuICovXHJcbmxldCBjbG9zZUFsbCA9IGZ1bmN0aW9uIChldmVudCA9IG51bGwpe1xyXG4gIGxldCBjaGFuZ2VkID0gZmFsc2U7XHJcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuXHJcbiAgbGV0IG92ZXJmbG93TWVudUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3ZlcmZsb3ctbWVudScpO1xyXG4gIGZvciAobGV0IG9pID0gMDsgb2kgPCBvdmVyZmxvd01lbnVFbC5sZW5ndGg7IG9pKyspIHtcclxuICAgIGxldCBjdXJyZW50T3ZlcmZsb3dNZW51RUwgPSBvdmVyZmxvd01lbnVFbFsgb2kgXTtcclxuICAgIGxldCB0cmlnZ2VyRWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwucXVlcnlTZWxlY3RvcihCVVRUT04rJ1thcmlhLWV4cGFuZGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgaWYodHJpZ2dlckVsICE9PSBudWxsKXtcclxuICAgICAgY2hhbmdlZCA9IHRydWU7XHJcbiAgICAgIGxldCB0YXJnZXRFbCA9IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5xdWVyeVNlbGVjdG9yKCcjJyt0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCkucmVwbGFjZSgnIycsICcnKSk7XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXRFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IG51bGwpIHtcclxuICAgICAgICAgIGlmKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRyaWdnZXJFbCkpe1xyXG4gICAgICAgICAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcclxuICAgICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZihjaGFuZ2VkICYmIGV2ZW50ICE9PSBudWxsKXtcclxuICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gIH1cclxufTtcclxubGV0IG9mZnNldCA9IGZ1bmN0aW9uIChlbCkge1xyXG4gIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXHJcbiAgICBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LFxyXG4gICAgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgcmV0dXJuIHsgdG9wOiByZWN0LnRvcCArIHNjcm9sbFRvcCwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCB9O1xyXG59O1xyXG5cclxubGV0IHRvZ2dsZURyb3Bkb3duID0gZnVuY3Rpb24gKGV2ZW50LCBmb3JjZUNsb3NlID0gZmFsc2UpIHtcclxuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICB0b2dnbGUodGhpcywgZm9yY2VDbG9zZSk7XHJcblxyXG59O1xyXG5cclxubGV0IHRvZ2dsZSA9IGZ1bmN0aW9uKGJ1dHRvbiwgZm9yY2VDbG9zZSA9IGZhbHNlKXtcclxuICBsZXQgdHJpZ2dlckVsID0gYnV0dG9uO1xyXG4gIGxldCB0YXJnZXRFbCA9IG51bGw7XHJcbiAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgIGxldCB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZShUQVJHRVQpO1xyXG4gICAgaWYodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRFbCAhPT0gbnVsbCAmJiB0YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgIC8vY2hhbmdlIHN0YXRlXHJcblxyXG4gICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9IG51bGw7XHJcbiAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9IG51bGw7XHJcblxyXG4gICAgaWYodHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgfHwgZm9yY2VDbG9zZSl7XHJcbiAgICAgIC8vY2xvc2VcclxuICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7ICAgICAgXHJcbiAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcclxuICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY2xvc2VBbGwoKTtcclxuICAgICAgLy9vcGVuXHJcbiAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcclxuICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24ub3BlbicpO1xyXG4gICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gICAgICBsZXQgdGFyZ2V0T2Zmc2V0ID0gb2Zmc2V0KHRhcmdldEVsKTtcclxuXHJcbiAgICAgIGlmKHRhcmdldE9mZnNldC5sZWZ0IDwgMCl7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCByaWdodCA9IHRhcmdldE9mZnNldC5sZWZ0ICsgdGFyZ2V0RWwub2Zmc2V0V2lkdGg7XHJcbiAgICAgIGlmKHJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpe1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnYXV0byc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnMHB4JztcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IG9mZnNldEFnYWluID0gb2Zmc2V0KHRhcmdldEVsKTtcclxuXHJcbiAgICAgIGlmKG9mZnNldEFnYWluLmxlZnQgPCAwKXtcclxuXHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgICB9XHJcbiAgICAgIHJpZ2h0ID0gb2Zmc2V0QWdhaW4ubGVmdCArIHRhcmdldEVsLm9mZnNldFdpZHRoO1xyXG4gICAgICBpZihyaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKXtcclxuXHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICdhdXRvJztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICcwcHgnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxufVxyXG5cclxubGV0IGhhc1BhcmVudCA9IGZ1bmN0aW9uIChjaGlsZCwgcGFyZW50VGFnTmFtZSl7XHJcbiAgaWYoY2hpbGQucGFyZW50Tm9kZS50YWdOYW1lID09PSBwYXJlbnRUYWdOYW1lKXtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gZWxzZSBpZihwYXJlbnRUYWdOYW1lICE9PSAnQk9EWScgJiYgY2hpbGQucGFyZW50Tm9kZS50YWdOYW1lICE9PSAnQk9EWScpe1xyXG4gICAgcmV0dXJuIGhhc1BhcmVudChjaGlsZC5wYXJlbnROb2RlLCBwYXJlbnRUYWdOYW1lKTtcclxuICB9ZWxzZXtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcblxyXG5sZXQgb3V0c2lkZUNsb3NlID0gZnVuY3Rpb24gKGV2dCl7XHJcbiAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keS5tb2JpbGVfbmF2LWFjdGl2ZScpID09PSBudWxsICYmICFldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYnV0dG9uLW1lbnUtY2xvc2UnKSkge1xyXG4gICAgbGV0IG9wZW5Ecm9wZG93bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtZHJvcGRvd25bYXJpYS1leHBhbmRlZD10cnVlXScpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcGVuRHJvcGRvd25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCB0cmlnZ2VyRWwgPSBvcGVuRHJvcGRvd25zW2ldO1xyXG4gICAgICBsZXQgdGFyZ2V0RWwgPSBudWxsO1xyXG4gICAgICBsZXQgdGFyZ2V0QXR0ciA9IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKTtcclxuICAgICAgaWYgKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYodGFyZ2V0QXR0ci5pbmRleE9mKCcjJykgIT09IC0xKXtcclxuICAgICAgICAgIHRhcmdldEF0dHIgPSB0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0cik7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRyaWdnZXJFbCkgfHwgKGhhc1BhcmVudCh0cmlnZ2VyRWwsICdIRUFERVInKSAmJiAhZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJsYXknKSkpIHtcclxuICAgICAgICAvL2Nsb3NlcyBkcm9wZG93biB3aGVuIGNsaWNrZWQgb3V0c2lkZVxyXG4gICAgICAgIGlmIChldnQudGFyZ2V0ICE9PSB0cmlnZ2VyRWwpIHtcclxuICAgICAgICAgIC8vY2xpY2tlZCBvdXRzaWRlIHRyaWdnZXIsIGZvcmNlIGNsb3NlXHJcbiAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAgICAgICAgICBcclxuICAgICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uY2xvc2UnKTtcclxuICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmxldCBkb1Jlc3BvbnNpdmVDb2xsYXBzZSA9IGZ1bmN0aW9uICh0cmlnZ2VyRWwpe1xyXG4gIGlmKCF0cmlnZ2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKGpzRHJvcGRvd25Db2xsYXBzZU1vZGlmaWVyKSl7XHJcbiAgICAvLyBub3QgbmF2IG92ZXJmbG93IG1lbnVcclxuICAgIGlmKHRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpIHx8IHRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKSB7XHJcbiAgICAgIC8vIHRyaW5pbmRpa2F0b3Igb3ZlcmZsb3cgbWVudVxyXG4gICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPD0gZ2V0VHJpbmd1aWRlQnJlYWtwb2ludCh0cmlnZ2VyRWwpKSB7XHJcbiAgICAgICAgLy8gb3ZlcmZsb3cgbWVudSBww6UgcmVzcG9uc2l2IHRyaW5ndWlkZSBha3RpdmVyZXRcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNle1xyXG4gICAgICAvLyBub3JtYWwgb3ZlcmZsb3cgbWVudVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbmxldCBnZXRUcmluZ3VpZGVCcmVha3BvaW50ID0gZnVuY3Rpb24gKGJ1dHRvbil7XHJcbiAgaWYoYnV0dG9uLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgcmV0dXJuIGJyZWFrcG9pbnRzLm1kO1xyXG4gIH1cclxuICBpZihidXR0b24ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSl7XHJcbiAgICByZXR1cm4gYnJlYWtwb2ludHMubGc7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd247IiwiJ3VzZSBzdHJpY3QnO1xyXG4vKipcclxuICogSGFuZGxlIGZvY3VzIG9uIGlucHV0IGVsZW1lbnRzIHVwb24gY2xpY2tpbmcgbGluayBpbiBlcnJvciBtZXNzYWdlXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgRXJyb3Igc3VtbWFyeSBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBFcnJvclN1bW1hcnkgKGVsZW1lbnQpIHtcclxuICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzIG9uIGxpbmtzIGluIGVycm9yIHN1bW1hcnlcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBpZiAoIXRoaXMuZWxlbWVudCkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIHRoaXMuZWxlbWVudC5mb2N1cygpXHJcblxyXG4gIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKSlcclxufVxyXG5cclxuLyoqXHJcbiogQ2xpY2sgZXZlbnQgaGFuZGxlclxyXG4qXHJcbiogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCAtIENsaWNrIGV2ZW50XHJcbiovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuaGFuZGxlQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0XHJcbiAgaWYgKHRoaXMuZm9jdXNUYXJnZXQodGFyZ2V0KSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEZvY3VzIHRoZSB0YXJnZXQgZWxlbWVudFxyXG4gKlxyXG4gKiBCeSBkZWZhdWx0LCB0aGUgYnJvd3NlciB3aWxsIHNjcm9sbCB0aGUgdGFyZ2V0IGludG8gdmlldy4gQmVjYXVzZSBvdXIgbGFiZWxzXHJcbiAqIG9yIGxlZ2VuZHMgYXBwZWFyIGFib3ZlIHRoZSBpbnB1dCwgdGhpcyBtZWFucyB0aGUgdXNlciB3aWxsIGJlIHByZXNlbnRlZCB3aXRoXHJcbiAqIGFuIGlucHV0IHdpdGhvdXQgYW55IGNvbnRleHQsIGFzIHRoZSBsYWJlbCBvciBsZWdlbmQgd2lsbCBiZSBvZmYgdGhlIHRvcCBvZlxyXG4gKiB0aGUgc2NyZWVuLlxyXG4gKlxyXG4gKiBNYW51YWxseSBoYW5kbGluZyB0aGUgY2xpY2sgZXZlbnQsIHNjcm9sbGluZyB0aGUgcXVlc3Rpb24gaW50byB2aWV3IGFuZCB0aGVuXHJcbiAqIGZvY3Vzc2luZyB0aGUgZWxlbWVudCBzb2x2ZXMgdGhpcy5cclxuICpcclxuICogVGhpcyBhbHNvIHJlc3VsdHMgaW4gdGhlIGxhYmVsIGFuZC9vciBsZWdlbmQgYmVpbmcgYW5ub3VuY2VkIGNvcnJlY3RseSBpblxyXG4gKiBOVkRBIChhcyB0ZXN0ZWQgaW4gMjAxOC4zLjIpIC0gd2l0aG91dCB0aGlzIG9ubHkgdGhlIGZpZWxkIHR5cGUgaXMgYW5ub3VuY2VkXHJcbiAqIChlLmcuIFwiRWRpdCwgaGFzIGF1dG9jb21wbGV0ZVwiKS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJHRhcmdldCAtIEV2ZW50IHRhcmdldFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdGFyZ2V0IHdhcyBhYmxlIHRvIGJlIGZvY3Vzc2VkXHJcbiAqL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmZvY3VzVGFyZ2V0ID0gZnVuY3Rpb24gKCR0YXJnZXQpIHtcclxuICAvLyBJZiB0aGUgZWxlbWVudCB0aGF0IHdhcyBjbGlja2VkIHdhcyBub3QgYSBsaW5rLCByZXR1cm4gZWFybHlcclxuICBpZiAoJHRhcmdldC50YWdOYW1lICE9PSAnQScgfHwgJHRhcmdldC5ocmVmID09PSBmYWxzZSkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICB2YXIgaW5wdXRJZCA9IHRoaXMuZ2V0RnJhZ21lbnRGcm9tVXJsKCR0YXJnZXQuaHJlZilcclxuICB2YXIgJGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXRJZClcclxuICBpZiAoISRpbnB1dCkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICB2YXIgJGxlZ2VuZE9yTGFiZWwgPSB0aGlzLmdldEFzc29jaWF0ZWRMZWdlbmRPckxhYmVsKCRpbnB1dClcclxuICBpZiAoISRsZWdlbmRPckxhYmVsKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIC8vIFNjcm9sbCB0aGUgbGVnZW5kIG9yIGxhYmVsIGludG8gdmlldyAqYmVmb3JlKiBjYWxsaW5nIGZvY3VzIG9uIHRoZSBpbnB1dCB0b1xyXG4gIC8vIGF2b2lkIGV4dHJhIHNjcm9sbGluZyBpbiBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgYHByZXZlbnRTY3JvbGxgICh3aGljaFxyXG4gIC8vIGF0IHRpbWUgb2Ygd3JpdGluZyBpcyBtb3N0IG9mIHRoZW0uLi4pXHJcbiAgJGxlZ2VuZE9yTGFiZWwuc2Nyb2xsSW50b1ZpZXcoKVxyXG4gICRpbnB1dC5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSlcclxuXHJcbiAgcmV0dXJuIHRydWVcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBmcmFnbWVudCBmcm9tIFVSTFxyXG4gKlxyXG4gKiBFeHRyYWN0IHRoZSBmcmFnbWVudCAoZXZlcnl0aGluZyBhZnRlciB0aGUgaGFzaCkgZnJvbSBhIFVSTCwgYnV0IG5vdCBpbmNsdWRpbmdcclxuICogdGhlIGhhc2guXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBVUkxcclxuICogQHJldHVybnMge3N0cmluZ30gRnJhZ21lbnQgZnJvbSBVUkwsIHdpdGhvdXQgdGhlIGhhc2hcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuZ2V0RnJhZ21lbnRGcm9tVXJsID0gZnVuY3Rpb24gKHVybCkge1xyXG4gIGlmICh1cmwuaW5kZXhPZignIycpID09PSAtMSkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdXJsLnNwbGl0KCcjJykucG9wKClcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBhc3NvY2lhdGVkIGxlZ2VuZCBvciBsYWJlbFxyXG4gKlxyXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgZXhpc3RzIGZyb20gdGhpcyBsaXN0OlxyXG4gKlxyXG4gKiAtIFRoZSBgPGxlZ2VuZD5gIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2xvc2VzdCBgPGZpZWxkc2V0PmAgYW5jZXN0b3IsIGFzIGxvbmdcclxuICogICBhcyB0aGUgdG9wIG9mIGl0IGlzIG5vIG1vcmUgdGhhbiBoYWxmIGEgdmlld3BvcnQgaGVpZ2h0IGF3YXkgZnJvbSB0aGVcclxuICogICBib3R0b20gb2YgdGhlIGlucHV0XHJcbiAqIC0gVGhlIGZpcnN0IGA8bGFiZWw+YCB0aGF0IGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQgdXNpbmcgZm9yPVwiaW5wdXRJZFwiXHJcbiAqIC0gVGhlIGNsb3Nlc3QgcGFyZW50IGA8bGFiZWw+YFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkaW5wdXQgLSBUaGUgaW5wdXRcclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBBc3NvY2lhdGVkIGxlZ2VuZCBvciBsYWJlbCwgb3IgbnVsbCBpZiBubyBhc3NvY2lhdGVkXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kIG9yIGxhYmVsIGNhbiBiZSBmb3VuZFxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5nZXRBc3NvY2lhdGVkTGVnZW5kT3JMYWJlbCA9IGZ1bmN0aW9uICgkaW5wdXQpIHtcclxuICB2YXIgJGZpZWxkc2V0ID0gJGlucHV0LmNsb3Nlc3QoJ2ZpZWxkc2V0JylcclxuXHJcbiAgaWYgKCRmaWVsZHNldCkge1xyXG4gICAgdmFyIGxlZ2VuZHMgPSAkZmllbGRzZXQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xlZ2VuZCcpXHJcblxyXG4gICAgaWYgKGxlZ2VuZHMubGVuZ3RoKSB7XHJcbiAgICAgIHZhciAkY2FuZGlkYXRlTGVnZW5kID0gbGVnZW5kc1swXVxyXG5cclxuICAgICAgLy8gSWYgdGhlIGlucHV0IHR5cGUgaXMgcmFkaW8gb3IgY2hlY2tib3gsIGFsd2F5cyB1c2UgdGhlIGxlZ2VuZCBpZiB0aGVyZVxyXG4gICAgICAvLyBpcyBvbmUuXHJcbiAgICAgIGlmICgkaW5wdXQudHlwZSA9PT0gJ2NoZWNrYm94JyB8fCAkaW5wdXQudHlwZSA9PT0gJ3JhZGlvJykge1xyXG4gICAgICAgIHJldHVybiAkY2FuZGlkYXRlTGVnZW5kXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEZvciBvdGhlciBpbnB1dCB0eXBlcywgb25seSBzY3JvbGwgdG8gdGhlIGZpZWxkc2V04oCZcyBsZWdlbmQgKGluc3RlYWQgb2ZcclxuICAgICAgLy8gdGhlIGxhYmVsIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQpIGlmIHRoZSBpbnB1dCB3b3VsZCBlbmQgdXAgaW4gdGhlXHJcbiAgICAgIC8vIHRvcCBoYWxmIG9mIHRoZSBzY3JlZW4uXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vIFRoaXMgc2hvdWxkIGF2b2lkIHNpdHVhdGlvbnMgd2hlcmUgdGhlIGlucHV0IGVpdGhlciBlbmRzIHVwIG9mZiB0aGVcclxuICAgICAgLy8gc2NyZWVuLCBvciBvYnNjdXJlZCBieSBhIHNvZnR3YXJlIGtleWJvYXJkLlxyXG4gICAgICB2YXIgbGVnZW5kVG9wID0gJGNhbmRpZGF0ZUxlZ2VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcclxuICAgICAgdmFyIGlucHV0UmVjdCA9ICRpbnB1dC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG5cclxuICAgICAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0XHJcbiAgICAgIC8vIG9yIHdpbmRvdy5pbm5lckhlaWdodCAobGlrZSBJRTgpLCBiYWlsIGFuZCBqdXN0IGxpbmsgdG8gdGhlIGxhYmVsLlxyXG4gICAgICBpZiAoaW5wdXRSZWN0LmhlaWdodCAmJiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuICAgICAgICB2YXIgaW5wdXRCb3R0b20gPSBpbnB1dFJlY3QudG9wICsgaW5wdXRSZWN0LmhlaWdodFxyXG5cclxuICAgICAgICBpZiAoaW5wdXRCb3R0b20gLSBsZWdlbmRUb3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSB7XHJcbiAgICAgICAgICByZXR1cm4gJGNhbmRpZGF0ZUxlZ2VuZFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFtmb3I9J1wiICsgJGlucHV0LmdldEF0dHJpYnV0ZSgnaWQnKSArIFwiJ11cIikgfHxcclxuICAgICRpbnB1dC5jbG9zZXN0KCdsYWJlbCcpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVycm9yU3VtbWFyeTsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gbW9kYWxcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJG1vZGFsIE1vZGFsIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIE1vZGFsICgkbW9kYWwpIHtcclxuICAgIHRoaXMuJG1vZGFsID0gJG1vZGFsO1xyXG4gICAgbGV0IGlkID0gdGhpcy4kbW9kYWwuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgdGhpcy50cmlnZ2VycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZHVsZT1cIm1vZGFsXCJdW2RhdGEtdGFyZ2V0PVwiJytpZCsnXCJdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzXHJcbiAqL1xyXG5Nb2RhbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdHJpZ2dlcnMgPSB0aGlzLnRyaWdnZXJzO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHJpZ2dlcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgbGV0IHRyaWdnZXIgPSB0cmlnZ2Vyc1sgaSBdO1xyXG4gICAgdHJpZ2dlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2hvdy5iaW5kKHRoaXMpKTtcclxuICB9XHJcbiAgbGV0IGNsb3NlcnMgPSB0aGlzLiRtb2RhbC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2RhbC1jbG9zZV0nKTtcclxuICBmb3IgKGxldCBjID0gMDsgYyA8IGNsb3NlcnMubGVuZ3RoOyBjKyspe1xyXG4gICAgbGV0IGNsb3NlciA9IGNsb3NlcnNbIGMgXTtcclxuICAgIGNsb3Nlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogSGlkZSBtb2RhbFxyXG4gKi9cclxuTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKXtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gdGhpcy4kbW9kYWw7XHJcbiAgaWYobW9kYWxFbGVtZW50ICE9PSBudWxsKXtcclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcbiAgICBsZXQgZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgZXZlbnRDbG9zZS5pbml0RXZlbnQoJ2Zkcy5tb2RhbC5oaWRkZW4nLCB0cnVlLCB0cnVlKTtcclxuICAgIG1vZGFsRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG5cclxuICAgIGxldCAkYmFja2Ryb3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbW9kYWwtYmFja2Ryb3AnKTtcclxuICAgICRiYWNrZHJvcC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCRiYWNrZHJvcCk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJyk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcEZvY3VzLCB0cnVlKTtcclxuXHJcbiAgICBpZighaGFzRm9yY2VkQWN0aW9uKG1vZGFsRWxlbWVudCkpe1xyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUVzY2FwZSk7XHJcbiAgICB9XHJcbiAgICBsZXQgZGF0YU1vZGFsT3BlbmVyID0gbW9kYWxFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1tb2RhbC1vcGVuZXInKTtcclxuICAgIGlmKGRhdGFNb2RhbE9wZW5lciAhPT0gbnVsbCl7XHJcbiAgICAgIGxldCBvcGVuZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkYXRhTW9kYWxPcGVuZXIpXHJcbiAgICAgIGlmKG9wZW5lciAhPT0gbnVsbCl7XHJcbiAgICAgICAgb3BlbmVyLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgICAgbW9kYWxFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1tb2RhbC1vcGVuZXInKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogU2hvdyBtb2RhbFxyXG4gKi9cclxuTW9kYWwucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoZSA9IG51bGwpe1xyXG4gIGxldCBtb2RhbEVsZW1lbnQgPSB0aGlzLiRtb2RhbDtcclxuICBpZihtb2RhbEVsZW1lbnQgIT09IG51bGwpe1xyXG4gICAgaWYoZSAhPT0gbnVsbCl7XHJcbiAgICAgIGxldCBvcGVuZXJJZCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgICAgaWYob3BlbmVySWQgPT09IG51bGwpe1xyXG4gICAgICAgIG9wZW5lcklkID0gJ21vZGFsLW9wZW5lci0nK01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg5OTk5IC0gMTAwMCArIDEpICsgMTAwMCk7XHJcbiAgICAgICAgZS50YXJnZXQuc2V0QXR0cmlidXRlKCdpZCcsIG9wZW5lcklkKVxyXG4gICAgICB9XHJcbiAgICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtb3BlbmVyJywgb3BlbmVySWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhpZGUgb3BlbiBtb2RhbHMgLSBGRFMgZG8gbm90IHJlY29tbWVuZCBtb3JlIHRoYW4gb25lIG9wZW4gbW9kYWwgYXQgYSB0aW1lXHJcbiAgICBsZXQgYWN0aXZlTW9kYWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKTtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBhY3RpdmVNb2RhbHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICBuZXcgTW9kYWwoYWN0aXZlTW9kYWxzW2ldKS5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XHJcblxyXG4gICAgbGV0IGV2ZW50T3BlbiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgZXZlbnRPcGVuLmluaXRFdmVudCgnZmRzLm1vZGFsLnNob3duJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICBtb2RhbEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG5cclxuICAgIGxldCAkYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICRiYWNrZHJvcC5jbGFzc0xpc3QuYWRkKCdtb2RhbC1iYWNrZHJvcCcpO1xyXG4gICAgJGJhY2tkcm9wLnNldEF0dHJpYnV0ZSgnaWQnLCBcIm1vZGFsLWJhY2tkcm9wXCIpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZCgkYmFja2Ryb3ApO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LmFkZCgnbW9kYWwtb3BlbicpO1xyXG5cclxuICAgIG1vZGFsRWxlbWVudC5mb2N1cygpO1xyXG5cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwRm9jdXMsIHRydWUpO1xyXG4gICAgaWYoIWhhc0ZvcmNlZEFjdGlvbihtb2RhbEVsZW1lbnQpKXtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVFc2NhcGUpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xvc2UgbW9kYWwgd2hlbiBoaXR0aW5nIEVTQ1xyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IFxyXG4gKi9cclxubGV0IGhhbmRsZUVzY2FwZSA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gIGxldCBtb2RhbEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmRzLW1vZGFsW2FyaWEtaGlkZGVuPWZhbHNlXScpO1xyXG4gIGxldCBjdXJyZW50TW9kYWwgPSBuZXcgTW9kYWwoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKSk7XHJcbiAgaWYgKGtleSA9PT0gMjcpe1xyXG4gICAgbGV0IHBvc3NpYmxlT3ZlcmZsb3dNZW51cyA9IG1vZGFsRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYnV0dG9uLW92ZXJmbG93LW1lbnVbYXJpYS1leHBhbmRlZD1cInRydWVcIl0nKTtcclxuICAgIGlmKHBvc3NpYmxlT3ZlcmZsb3dNZW51cy5sZW5ndGggPT09IDApe1xyXG4gICAgICBjdXJyZW50TW9kYWwuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBUcmFwIGZvY3VzIGluIG1vZGFsIHdoZW4gb3BlblxyXG4gKiBAcGFyYW0ge1BvaW50ZXJFdmVudH0gZVxyXG4gKi9cclxuIGZ1bmN0aW9uIHRyYXBGb2N1cyhlKXtcclxuICB2YXIgY3VycmVudERpYWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJyk7XHJcbiAgaWYoY3VycmVudERpYWxvZyAhPT0gbnVsbCl7XHJcbiAgICB2YXIgZm9jdXNhYmxlRWxlbWVudHMgPSBjdXJyZW50RGlhbG9nLnF1ZXJ5U2VsZWN0b3JBbGwoJ2FbaHJlZl06bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIGlucHV0Om5vdChbdHlwZT1oaWRkZW5dKTpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIGRldGFpbHM6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pJyk7XHJcbiAgICBcclxuICAgIHZhciBmaXJzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1swXTtcclxuICAgIHZhciBsYXN0Rm9jdXNhYmxlRWxlbWVudCA9IGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdO1xyXG5cclxuICAgIHZhciBpc1RhYlByZXNzZWQgPSAoZS5rZXkgPT09ICdUYWInIHx8IGUua2V5Q29kZSA9PT0gOSk7XHJcblxyXG4gICAgaWYgKCFpc1RhYlByZXNzZWQpIHsgXHJcbiAgICAgIHJldHVybjsgXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCBlLnNoaWZ0S2V5ICkgLyogc2hpZnQgKyB0YWIgKi8ge1xyXG4gICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RGb2N1c2FibGVFbGVtZW50KSB7XHJcbiAgICAgICAgbGFzdEZvY3VzYWJsZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIC8qIHRhYiAqLyB7XHJcbiAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0Rm9jdXNhYmxlRWxlbWVudCkge1xyXG4gICAgICAgIGZpcnN0Rm9jdXNhYmxlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gaGFzRm9yY2VkQWN0aW9uIChtb2RhbCl7XHJcbiAgaWYobW9kYWwuZ2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLWZvcmNlZC1hY3Rpb24nKSA9PT0gbnVsbCl7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNb2RhbDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBmb3JFYWNoID0gcmVxdWlyZSgnYXJyYXktZm9yZWFjaCcpO1xyXG5jb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuXHJcbmNvbnN0IE5BViA9IGAubmF2YDtcclxuY29uc3QgTkFWX0xJTktTID0gYCR7TkFWfSBhYDtcclxuY29uc3QgT1BFTkVSUyA9IGAuanMtbWVudS1vcGVuYDtcclxuY29uc3QgQ0xPU0VfQlVUVE9OID0gYC5qcy1tZW51LWNsb3NlYDtcclxuY29uc3QgT1ZFUkxBWSA9IGAub3ZlcmxheWA7XHJcbmNvbnN0IENMT1NFUlMgPSBgJHtDTE9TRV9CVVRUT059LCAub3ZlcmxheWA7XHJcbmNvbnN0IFRPR0dMRVMgPSBbIE5BViwgT1ZFUkxBWSBdLmpvaW4oJywgJyk7XHJcblxyXG5jb25zdCBBQ1RJVkVfQ0xBU1MgPSAnbW9iaWxlX25hdi1hY3RpdmUnO1xyXG5jb25zdCBWSVNJQkxFX0NMQVNTID0gJ2lzLXZpc2libGUnO1xyXG5cclxuLyoqXHJcbiAqIEFkZCBtb2JpbGUgbWVudSBmdW5jdGlvbmFsaXR5XHJcbiAqL1xyXG5jbGFzcyBOYXZpZ2F0aW9uIHtcclxuICAvKipcclxuICAgKiBTZXQgZXZlbnRzXHJcbiAgICovXHJcbiAgaW5pdCAoKSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbW9iaWxlTWVudSwgZmFsc2UpO1xyXG4gICAgbW9iaWxlTWVudSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlIGV2ZW50c1xyXG4gICAqL1xyXG4gIHRlYXJkb3duICgpIHtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBtb2JpbGVNZW51LCBmYWxzZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uYWxpdHkgdG8gbW9iaWxlIG1lbnVcclxuICovXHJcbmNvbnN0IG1vYmlsZU1lbnUgPSBmdW5jdGlvbigpIHtcclxuICBsZXQgbW9iaWxlID0gZmFsc2U7XHJcbiAgbGV0IG9wZW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE9QRU5FUlMpO1xyXG4gIGZvcihsZXQgbyA9IDA7IG8gPCBvcGVuZXJzLmxlbmd0aDsgbysrKSB7XHJcbiAgICBpZih3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShvcGVuZXJzW29dLCBudWxsKS5kaXNwbGF5ICE9PSAnbm9uZScpIHtcclxuICAgICAgb3BlbmVyc1tvXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU5hdik7XHJcbiAgICAgIG1vYmlsZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBpZiBtb2JpbGVcclxuICBpZihtb2JpbGUpe1xyXG4gICAgbGV0IGNsb3NlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKENMT1NFUlMpO1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNsb3NlcnMubGVuZ3RoOyBjKyspIHtcclxuICAgICAgY2xvc2Vyc1sgYyBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTmF2KTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbmF2TGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE5BVl9MSU5LUyk7XHJcbiAgICBmb3IobGV0IG4gPSAwOyBuIDwgbmF2TGlua3MubGVuZ3RoOyBuKyspIHtcclxuICAgICAgbmF2TGlua3NbIG4gXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gQSBuYXZpZ2F0aW9uIGxpbmsgaGFzIGJlZW4gY2xpY2tlZCEgV2Ugd2FudCB0byBjb2xsYXBzZSBhbnlcclxuICAgICAgICAvLyBoaWVyYXJjaGljYWwgbmF2aWdhdGlvbiBVSSBpdCdzIGEgcGFydCBvZiwgc28gdGhhdCB0aGUgdXNlclxyXG4gICAgICAgIC8vIGNhbiBmb2N1cyBvbiB3aGF0ZXZlciB0aGV5J3ZlIGp1c3Qgc2VsZWN0ZWQuXHJcblxyXG4gICAgICAgIC8vIFNvbWUgbmF2aWdhdGlvbiBsaW5rcyBhcmUgaW5zaWRlIGRyb3Bkb3duczsgd2hlbiB0aGV5J3JlXHJcbiAgICAgICAgLy8gY2xpY2tlZCwgd2Ugd2FudCB0byBjb2xsYXBzZSB0aG9zZSBkcm9wZG93bnMuXHJcblxyXG5cclxuICAgICAgICAvLyBJZiB0aGUgbW9iaWxlIG5hdmlnYXRpb24gbWVudSBpcyBhY3RpdmUsIHdlIHdhbnQgdG8gaGlkZSBpdC5cclxuICAgICAgICBpZiAoaXNBY3RpdmUoKSkge1xyXG4gICAgICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdHJhcENvbnRhaW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKE5BVik7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdHJhcENvbnRhaW5lcnMubGVuZ3RoOyBpKyspe1xyXG4gICAgICBmb2N1c1RyYXAgPSBfZm9jdXNUcmFwKHRyYXBDb250YWluZXJzW2ldKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBjb25zdCBjbG9zZXIgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcclxuXHJcbiAgaWYgKGlzQWN0aXZlKCkgJiYgY2xvc2VyICYmIGNsb3Nlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCA9PT0gMCkge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgaXMgYWN0aXZlLCBidXQgdGhlIGNsb3NlIGJveCBpc24ndCB2aXNpYmxlLCB3aGljaFxyXG4gICAgLy8gbWVhbnMgdGhlIHVzZXIncyB2aWV3cG9ydCBoYXMgYmVlbiByZXNpemVkIHNvIHRoYXQgaXQgaXMgbm8gbG9uZ2VyXHJcbiAgICAvLyBpbiBtb2JpbGUgbW9kZS4gTGV0J3MgbWFrZSB0aGUgcGFnZSBzdGF0ZSBjb25zaXN0ZW50IGJ5XHJcbiAgICAvLyBkZWFjdGl2YXRpbmcgdGhlIG1vYmlsZSBuYXYuXHJcbiAgICB0b2dnbGVOYXYuY2FsbChjbG9zZXIsIGZhbHNlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgbW9iaWxlIG1lbnUgaXMgYWN0aXZlXHJcbiAqIEByZXR1cm5zIHRydWUgaWYgbW9iaWxlIG1lbnUgaXMgYWN0aXZlIGFuZCBmYWxzZSBpZiBub3QgYWN0aXZlXHJcbiAqL1xyXG5jb25zdCBpc0FjdGl2ZSA9ICgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKEFDVElWRV9DTEFTUyk7XHJcblxyXG4vKipcclxuICogVHJhcCBmb2N1cyBpbiBtb2JpbGUgbWVudSBpZiBhY3RpdmVcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdHJhcENvbnRhaW5lciBcclxuICovXHJcbmNvbnN0IF9mb2N1c1RyYXAgPSAodHJhcENvbnRhaW5lcikgPT4ge1xyXG5cclxuICAvLyBGaW5kIGFsbCBmb2N1c2FibGUgY2hpbGRyZW5cclxuICBjb25zdCBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9ICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSc7XHJcbiAgbGV0IGZvY3VzYWJsZUVsZW1lbnRzID0gdHJhcENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nKTtcclxuICBsZXQgZmlyc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbIDAgXTtcclxuXHJcbiAgZnVuY3Rpb24gdHJhcFRhYktleSAoZSkge1xyXG4gICAgdmFyIGtleSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XHJcbiAgICAvLyBDaGVjayBmb3IgVEFCIGtleSBwcmVzc1xyXG4gICAgaWYgKGtleSA9PT0gOSkge1xyXG5cclxuICAgICAgbGV0IGxhc3RUYWJTdG9wID0gbnVsbDtcclxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICBsZXQgbnVtYmVyID0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMTtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IGZvY3VzYWJsZUVsZW1lbnRzWyBudW1iZXIgLSBpIF07XHJcbiAgICAgICAgaWYgKGVsZW1lbnQub2Zmc2V0V2lkdGggPiAwICYmIGVsZW1lbnQub2Zmc2V0SGVpZ2h0ID4gMCkge1xyXG4gICAgICAgICAgbGFzdFRhYlN0b3AgPSBlbGVtZW50O1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTSElGVCArIFRBQlxyXG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdFRhYlN0b3ApIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgLy8gVEFCXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3RUYWJTdG9wKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBFU0NBUEVcclxuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcclxuICAgICAgdG9nZ2xlTmF2LmNhbGwodGhpcywgZmFsc2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGVuYWJsZSAoKSB7XHJcbiAgICAgICAgLy8gRm9jdXMgZmlyc3QgY2hpbGRcclxuICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgLy8gTGlzdGVuIGZvciBhbmQgdHJhcCB0aGUga2V5Ym9hcmRcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBUYWJLZXkpO1xyXG4gICAgfSxcclxuXHJcbiAgICByZWxlYXNlICgpIHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBUYWJLZXkpO1xyXG4gICAgfSxcclxuICB9O1xyXG59O1xyXG5cclxubGV0IGZvY3VzVHJhcDtcclxuXHJcbmNvbnN0IHRvZ2dsZU5hdiA9IGZ1bmN0aW9uIChhY3RpdmUpIHtcclxuICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICBpZiAodHlwZW9mIGFjdGl2ZSAhPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICBhY3RpdmUgPSAhaXNBY3RpdmUoKTtcclxuICB9XHJcbiAgYm9keS5jbGFzc0xpc3QudG9nZ2xlKEFDVElWRV9DTEFTUywgYWN0aXZlKTtcclxuXHJcbiAgZm9yRWFjaChzZWxlY3QoVE9HR0xFUyksIGVsID0+IHtcclxuICAgIGVsLmNsYXNzTGlzdC50b2dnbGUoVklTSUJMRV9DTEFTUywgYWN0aXZlKTtcclxuICB9KTtcclxuICBpZiAoYWN0aXZlKSB7XHJcbiAgICBmb2N1c1RyYXAuZW5hYmxlKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGZvY3VzVHJhcC5yZWxlYXNlKCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBjbG9zZUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihDTE9TRV9CVVRUT04pO1xyXG4gIGNvbnN0IG1lbnVCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoT1BFTkVSUyk7XHJcblxyXG4gIGlmIChhY3RpdmUgJiYgY2xvc2VCdXR0b24pIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGFjdGl2YXRlZCwgc28gZm9jdXMgb24gdGhlIGNsb3NlIGJ1dHRvbixcclxuICAgIC8vIHdoaWNoIGlzIGp1c3QgYmVmb3JlIGFsbCB0aGUgbmF2IGVsZW1lbnRzIGluIHRoZSB0YWIgb3JkZXIuXHJcbiAgICBjbG9zZUJ1dHRvbi5mb2N1cygpO1xyXG4gIH0gZWxzZSBpZiAoIWFjdGl2ZSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBjbG9zZUJ1dHRvbiAmJlxyXG4gICAgICAgICAgICAgbWVudUJ1dHRvbikge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgZGVhY3RpdmF0ZWQsIGFuZCBmb2N1cyB3YXMgb24gdGhlIGNsb3NlXHJcbiAgICAvLyBidXR0b24sIHdoaWNoIGlzIG5vIGxvbmdlciB2aXNpYmxlLiBXZSBkb24ndCB3YW50IHRoZSBmb2N1cyB0b1xyXG4gICAgLy8gZGlzYXBwZWFyIGludG8gdGhlIHZvaWQsIHNvIGZvY3VzIG9uIHRoZSBtZW51IGJ1dHRvbiBpZiBpdCdzXHJcbiAgICAvLyB2aXNpYmxlICh0aGlzIG1heSBoYXZlIGJlZW4gd2hhdCB0aGUgdXNlciB3YXMganVzdCBmb2N1c2VkIG9uLFxyXG4gICAgLy8gaWYgdGhleSB0cmlnZ2VyZWQgdGhlIG1vYmlsZSBuYXYgYnkgbWlzdGFrZSkuXHJcbiAgICBtZW51QnV0dG9uLmZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYWN0aXZlO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgTmF2aWdhdGlvbjsiLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IFRPR0dMRV9BVFRSSUJVVEUgPSAnZGF0YS1jb250cm9scyc7XHJcblxyXG4vKipcclxuICogQWRkcyBjbGljayBmdW5jdGlvbmFsaXR5IHRvIHJhZGlvYnV0dG9uIGNvbGxhcHNlIGxpc3RcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyRWxlbWVudCBcclxuICovXHJcbmZ1bmN0aW9uIFJhZGlvVG9nZ2xlR3JvdXAoY29udGFpbmVyRWxlbWVudCl7XHJcbiAgICB0aGlzLnJhZGlvR3JvdXAgPSBjb250YWluZXJFbGVtZW50O1xyXG4gICAgdGhpcy5yYWRpb0VscyA9IG51bGw7XHJcbiAgICB0aGlzLnRhcmdldEVsID0gbnVsbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudHNcclxuICovXHJcblJhZGlvVG9nZ2xlR3JvdXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKXtcclxuICAgIHRoaXMucmFkaW9FbHMgPSB0aGlzLnJhZGlvR3JvdXAucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdJyk7XHJcbiAgICBpZih0aGlzLnJhZGlvRWxzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyByYWRpb2J1dHRvbnMgZm91bmQgaW4gcmFkaW9idXR0b24gZ3JvdXAuJyk7XHJcbiAgICB9XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMucmFkaW9FbHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciByYWRpbyA9IHRoaXMucmFkaW9FbHNbIGkgXTtcclxuICAgICAgICBcclxuICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgICAgZm9yKGxldCBhID0gMDsgYSA8IHRoYXQucmFkaW9FbHMubGVuZ3RoOyBhKysgKXtcclxuICAgICAgICAgICAgICAgIHRoYXQudG9nZ2xlKHRoYXQucmFkaW9FbHNbIGEgXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnRvZ2dsZShyYWRpbyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUb2dnbGUgcmFkaW9idXR0b24gY29udGVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IHJhZGlvSW5wdXRFbGVtZW50IFxyXG4gKi9cclxuUmFkaW9Ub2dnbGVHcm91cC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKHJhZGlvSW5wdXRFbGVtZW50KXtcclxuICAgIHZhciBjb250ZW50SWQgPSByYWRpb0lucHV0RWxlbWVudC5nZXRBdHRyaWJ1dGUoVE9HR0xFX0FUVFJJQlVURSk7XHJcbiAgICBpZihjb250ZW50SWQgIT09IG51bGwgJiYgY29udGVudElkICE9PSB1bmRlZmluZWQgJiYgY29udGVudElkICE9PSBcIlwiKXtcclxuICAgICAgICB2YXIgY29udGVudEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRlbnRJZCk7XHJcbiAgICAgICAgaWYoY29udGVudEVsZW1lbnQgPT09IG51bGwgfHwgY29udGVudEVsZW1lbnQgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgcGFuZWwgZWxlbWVudC4gVmVyaWZ5IHZhbHVlIG9mIGF0dHJpYnV0ZSBgKyBUT0dHTEVfQVRUUklCVVRFKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocmFkaW9JbnB1dEVsZW1lbnQuY2hlY2tlZCl7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuY29sbGFwc2UocmFkaW9JbnB1dEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHBhbmQgcmFkaW8gYnV0dG9uIGNvbnRlbnRcclxuICogQHBhcmFtIHt9IHJhZGlvSW5wdXRFbGVtZW50IFJhZGlvIElucHV0IGVsZW1lbnRcclxuICogQHBhcmFtIHsqfSBjb250ZW50RWxlbWVudCBDb250ZW50IGVsZW1lbnRcclxuICovXHJcblJhZGlvVG9nZ2xlR3JvdXAucHJvdG90eXBlLmV4cGFuZCA9IGZ1bmN0aW9uIChyYWRpb0lucHV0RWxlbWVudCwgY29udGVudEVsZW1lbnQpe1xyXG4gICAgaWYocmFkaW9JbnB1dEVsZW1lbnQgIT09IG51bGwgJiYgcmFkaW9JbnB1dEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICByYWRpb0lucHV0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMucmFkaW8uZXhwYW5kZWQnKTtcclxuICAgICAgICByYWRpb0lucHV0RWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIENvbGxhcHNlIHJhZGlvIGJ1dHRvbiBjb250ZW50XHJcbiAqIEBwYXJhbSB7fSByYWRpb0lucHV0RWxlbWVudCBSYWRpbyBJbnB1dCBlbGVtZW50XHJcbiAqIEBwYXJhbSB7Kn0gY29udGVudEVsZW1lbnQgQ29udGVudCBlbGVtZW50XHJcbiAqL1xyXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS5jb2xsYXBzZSA9IGZ1bmN0aW9uKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCl7XHJcbiAgICBpZihyYWRpb0lucHV0RWxlbWVudCAhPT0gbnVsbCAmJiByYWRpb0lucHV0RWxlbWVudCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnRFbGVtZW50ICE9PSBudWxsICYmIGNvbnRlbnRFbGVtZW50ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHJhZGlvSW5wdXRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMucmFkaW8uY29sbGFwc2VkJyk7XHJcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmFkaW9Ub2dnbGVHcm91cDsiLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IG1vZGlmaWVyU3RhdGUgPSB7XHJcbiAgc2hpZnQ6IGZhbHNlLFxyXG4gIGFsdDogZmFsc2UsXHJcbiAgY3RybDogZmFsc2UsXHJcbiAgY29tbWFuZDogZmFsc2VcclxufTtcclxuLypcclxuKiBQcmV2ZW50cyB0aGUgdXNlciBmcm9tIGlucHV0dGluZyBiYXNlZCBvbiBhIHJlZ2V4LlxyXG4qIERvZXMgbm90IHdvcmsgdGhlIHNhbWUgd2F5IGFmIDxpbnB1dCBwYXR0ZXJuPVwiXCI+LCB0aGlzIHBhdHRlcm4gaXMgb25seSB1c2VkIGZvciB2YWxpZGF0aW9uLCBub3QgdG8gcHJldmVudCBpbnB1dC5cclxuKiBVc2VjYXNlOiBudW1iZXIgaW5wdXQgZm9yIGRhdGUtY29tcG9uZW50LlxyXG4qIEV4YW1wbGUgLSBudW1iZXIgb25seTogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1pbnB1dC1yZWdleD1cIl5cXGQqJFwiPlxyXG4qL1xyXG5jbGFzcyBJbnB1dFJlZ2V4TWFzayB7XHJcbiAgY29uc3RydWN0b3IgKGVsZW1lbnQpe1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIHJlZ2V4TWFzayk7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCByZWdleE1hc2spO1xyXG4gIH1cclxufVxyXG52YXIgcmVnZXhNYXNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgaWYobW9kaWZpZXJTdGF0ZS5jdHJsIHx8IG1vZGlmaWVyU3RhdGUuY29tbWFuZCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgbmV3Q2hhciA9IG51bGw7XHJcbiAgaWYodHlwZW9mIGV2ZW50LmtleSAhPT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgaWYoZXZlbnQua2V5Lmxlbmd0aCA9PT0gMSl7XHJcbiAgICAgIG5ld0NoYXIgPSBldmVudC5rZXk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmKCFldmVudC5jaGFyQ29kZSl7XHJcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmtleUNvZGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV3Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQuY2hhckNvZGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHJlZ2V4U3RyID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5wdXQtcmVnZXgnKTtcclxuXHJcbiAgaWYoZXZlbnQudHlwZSAhPT0gdW5kZWZpbmVkICYmIGV2ZW50LnR5cGUgPT09ICdwYXN0ZScpe1xyXG4gICAgY29uc29sZS5sb2coJ3Bhc3RlJyk7XHJcbiAgfSBlbHNle1xyXG4gICAgdmFyIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgaWYoZXZlbnQudGFyZ2V0ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgaWYobmV3Q2hhciAhPT0gbnVsbCAmJiBlbGVtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgIGlmKG5ld0NoYXIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZihlbGVtZW50LnR5cGUgPT09ICdudW1iZXInKXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTsvL05vdGUgaW5wdXRbdHlwZT1udW1iZXJdIGRvZXMgbm90IGhhdmUgLnNlbGVjdGlvblN0YXJ0L0VuZCAoQ2hyb21lKS5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZS5zbGljZSgwLCBlbGVtZW50LnNlbGVjdGlvblN0YXJ0KSArIHRoaXMudmFsdWUuc2xpY2UoZWxlbWVudC5zZWxlY3Rpb25FbmQpICsgbmV3Q2hhcjsgLy9yZW1vdmVzIHRoZSBudW1iZXJzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCB0aGVuIGFkZHMgbmV3IGNoYXIuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAocmVnZXhTdHIpO1xyXG4gICAgICAgIGlmKHIuZXhlYyhuZXdWYWx1ZSkgPT09IG51bGwpe1xyXG4gICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IElucHV0UmVnZXhNYXNrOyIsIid1c2Ugc3RyaWN0JztcclxubGV0IGRrID0ge1xyXG4gIFwic2VsZWN0X3Jvd1wiOiBcIlbDpmxnIHLDpmtrZVwiLFxyXG4gIFwidW5zZWxlY3Rfcm93XCI6IFwiRnJhdsOmbGcgcsOma2tlXCIsXHJcbiAgXCJzZWxlY3RfYWxsX3Jvd3NcIjogXCJWw6ZsZyBhbGxlIHLDpmtrZXJcIixcclxuICBcInVuc2VsZWN0X2FsbF9yb3dzXCI6IFwiRnJhdsOmbGcgYWxsZSByw6Zra2VyXCJcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKiBAcGFyYW0ge0hUTUxUYWJsZUVsZW1lbnR9IHRhYmxlIFRhYmxlIEVsZW1lbnRcclxuICogQHBhcmFtIHtKU09OfSBzdHJpbmdzIFRyYW5zbGF0ZSBsYWJlbHM6IHtcInNlbGVjdF9yb3dcIjogXCJWw6ZsZyByw6Zra2VcIiwgXCJ1bnNlbGVjdF9yb3dcIjogXCJGcmF2w6ZsZyByw6Zra2VcIiwgXCJzZWxlY3RfYWxsX3Jvd3NcIjogXCJWw6ZsZyBhbGxlIHLDpmtrZXJcIiwgXCJ1bnNlbGVjdF9hbGxfcm93c1wiOiBcIkZyYXbDpmxnIGFsbGUgcsOma2tlclwifVxyXG4gKi9cclxuZnVuY3Rpb24gVGFibGVTZWxlY3RhYmxlUm93cyAodGFibGUsIHN0cmluZ3MgPSBkayl7XHJcbiAgdGhpcy50YWJsZSA9IHRhYmxlO1xyXG4gIGRrID0gc3RyaW5ncztcclxufVxyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgZXZlbnRsaXN0ZW5lcnMgZm9yIGNoZWNrYm94ZXMgaW4gdGFibGVcclxuICovXHJcblRhYmxlU2VsZWN0YWJsZVJvd3MucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMuZ3JvdXBDaGVja2JveCA9IHRoaXMuZ2V0R3JvdXBDaGVja2JveCgpO1xyXG4gIHRoaXMudGJvZHlDaGVja2JveExpc3QgPSB0aGlzLmdldENoZWNrYm94TGlzdCgpO1xyXG4gIGlmKHRoaXMudGJvZHlDaGVja2JveExpc3QubGVuZ3RoICE9PSAwKXtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCB0aGlzLnRib2R5Q2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgbGV0IGNoZWNrYm94ID0gdGhpcy50Ym9keUNoZWNrYm94TGlzdFtjXTtcclxuICAgICAgY2hlY2tib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlR3JvdXBDaGVjayk7XHJcbiAgICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUdyb3VwQ2hlY2spO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZih0aGlzLmdyb3VwQ2hlY2tib3ggIT09IGZhbHNlKXtcclxuICAgIHRoaXMuZ3JvdXBDaGVja2JveC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVDaGVja2JveExpc3QpO1xyXG4gICAgdGhpcy5ncm91cENoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUNoZWNrYm94TGlzdCk7XHJcbiAgfVxyXG59XHJcbiAgXHJcbi8qKlxyXG4gKiBHZXQgZ3JvdXAgY2hlY2tib3ggaW4gdGFibGUgaGVhZGVyXHJcbiAqIEByZXR1cm5zIGVsZW1lbnQgb24gdHJ1ZSAtIGZhbHNlIGlmIG5vdCBmb3VuZFxyXG4gKi9cclxuVGFibGVTZWxlY3RhYmxlUm93cy5wcm90b3R5cGUuZ2V0R3JvdXBDaGVja2JveCA9IGZ1bmN0aW9uKCl7XHJcbiAgbGV0IGNoZWNrYm94ID0gdGhpcy50YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JtLWNoZWNrYm94Jyk7XHJcbiAgaWYoY2hlY2tib3gubGVuZ3RoID09PSAwKXtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIGNoZWNrYm94WzBdO1xyXG59XHJcbi8qKlxyXG4gKiBHZXQgdGFibGUgYm9keSBjaGVja2JveGVzXHJcbiAqIEByZXR1cm5zIEhUTUxDb2xsZWN0aW9uXHJcbiAqL1xyXG5UYWJsZVNlbGVjdGFibGVSb3dzLnByb3RvdHlwZS5nZXRDaGVja2JveExpc3QgPSBmdW5jdGlvbigpe1xyXG4gIHJldHVybiB0aGlzLnRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0Ym9keScpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Zvcm0tY2hlY2tib3gnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBjaGVja2JveGVzIGluIHRhYmxlIGJvZHkgd2hlbiBncm91cCBjaGVja2JveCBpcyBjaGFuZ2VkXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVDaGVja2JveExpc3QoZSl7XHJcbiAgbGV0IGNoZWNrYm94ID0gZS50YXJnZXQ7XHJcbiAgY2hlY2tib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKTtcclxuICBsZXQgdGFibGUgPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIGxldCB0YWJsZVNlbGVjdGFibGVSb3dzID0gbmV3IFRhYmxlU2VsZWN0YWJsZVJvd3ModGFibGUpO1xyXG4gIGxldCBjaGVja2JveExpc3QgPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldENoZWNrYm94TGlzdCgpO1xyXG4gIGxldCBjaGVja2VkTnVtYmVyID0gMDtcclxuICBpZihjaGVja2JveC5jaGVja2VkKXtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xyXG4gICAgICBjaGVja2JveExpc3RbY10uY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsudW5zZWxlY3Rfcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja2VkTnVtYmVyID0gY2hlY2tib3hMaXN0Lmxlbmd0aDtcclxuICAgIGNoZWNrYm94Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay51bnNlbGVjdF9hbGxfcm93cyk7XHJcbiAgfSBlbHNle1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsuc2VsZWN0X3Jvdyk7XHJcbiAgICB9XHJcbiAgICBjaGVja2JveC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsuc2VsZWN0X2FsbF9yb3dzKTtcclxuICB9XHJcbiAgXHJcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJmZHMudGFibGUuc2VsZWN0YWJsZS51cGRhdGVkXCIsIHtcclxuICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgZGV0YWlsOiB7Y2hlY2tlZE51bWJlcn1cclxuICB9KTtcclxuICB0YWJsZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBncm91cCBjaGVja2JveCB3aGVuIGNoZWNrYm94IGluIHRhYmxlIGJvZHkgaXMgY2hhbmdlZFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIFxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlR3JvdXBDaGVjayhlKXtcclxuICAvLyB1cGRhdGUgbGFiZWwgZm9yIGV2ZW50IGNoZWNrYm94XHJcbiAgaWYoZS50YXJnZXQuY2hlY2tlZCl7XHJcbiAgICBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICBlLnRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsudW5zZWxlY3Rfcm93KTtcclxuICB9IGVsc2V7XHJcbiAgICBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgndGFibGUtcm93LXNlbGVjdGVkJyk7XHJcbiAgICBlLnRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsuc2VsZWN0X3Jvdyk7XHJcbiAgfVxyXG4gIGxldCB0YWJsZSA9IGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgbGV0IHRhYmxlU2VsZWN0YWJsZVJvd3MgPSBuZXcgVGFibGVTZWxlY3RhYmxlUm93cyh0YWJsZSk7XHJcbiAgbGV0IGdyb3VwQ2hlY2tib3ggPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldEdyb3VwQ2hlY2tib3goKTtcclxuICBpZihncm91cENoZWNrYm94ICE9PSBmYWxzZSl7XHJcbiAgICBsZXQgY2hlY2tib3hMaXN0ID0gdGFibGVTZWxlY3RhYmxlUm93cy5nZXRDaGVja2JveExpc3QoKTtcclxuXHJcbiAgICAvLyBob3cgbWFueSByb3cgaGFzIGJlZW4gc2VsZWN0ZWRcclxuICAgIGxldCBjaGVja2VkTnVtYmVyID0gMDtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xyXG4gICAgICBsZXQgbG9vcGVkQ2hlY2tib3ggPSBjaGVja2JveExpc3RbY107XHJcbiAgICAgIGlmKGxvb3BlZENoZWNrYm94LmNoZWNrZWQpe1xyXG4gICAgICAgIGNoZWNrZWROdW1iZXIrKztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZihjaGVja2VkTnVtYmVyID09PSBjaGVja2JveExpc3QubGVuZ3RoKXsgLy8gaWYgYWxsIHJvd3MgaGFzIGJlZW4gc2VsZWN0ZWRcclxuICAgICAgZ3JvdXBDaGVja2JveC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcpO1xyXG4gICAgICBncm91cENoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICBncm91cENoZWNrYm94Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay51bnNlbGVjdF9hbGxfcm93cyk7XHJcbiAgICB9IGVsc2UgaWYoY2hlY2tlZE51bWJlciA9PSAwKXsgLy8gaWYgbm8gcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICBncm91cENoZWNrYm94Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay5zZWxlY3RfYWxsX3Jvd3MpO1xyXG4gICAgfSBlbHNleyAvLyBpZiBzb21lIGJ1dCBub3QgYWxsIHJvd3MgaGFzIGJlZW4gc2VsZWN0ZWRcclxuICAgICAgZ3JvdXBDaGVja2JveC5zZXRBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcsICdtaXhlZCcpO1xyXG4gICAgICBncm91cENoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsuc2VsZWN0X2FsbF9yb3dzKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZmRzLnRhYmxlLnNlbGVjdGFibGUudXBkYXRlZFwiLCB7XHJcbiAgICAgIGJ1YmJsZXM6IHRydWUsXHJcbiAgICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICAgIGRldGFpbDoge2NoZWNrZWROdW1iZXJ9XHJcbiAgICB9KTtcclxuICAgIHRhYmxlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGFibGVTZWxlY3RhYmxlUm93czsiLCJjb25zdCBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0YS10aXRsZSBvbiBjZWxscywgd2hlcmUgdGhlIGF0dHJpYnV0ZSBpcyBtaXNzaW5nXHJcbiAqL1xyXG5jbGFzcyBSZXNwb25zaXZlVGFibGUge1xyXG4gICAgY29uc3RydWN0b3IgKHRhYmxlKSB7XHJcbiAgICAgIGluc2VydEhlYWRlckFzQXR0cmlidXRlcyh0YWJsZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQgZGF0YSBhdHRyaWJ1dGVzIG5lZWRlZCBmb3IgcmVzcG9uc2l2ZSBtb2RlLlxyXG4gKiBAcGFyYW0ge0hUTUxUYWJsZUVsZW1lbnR9IHRhYmxlRWwgVGFibGUgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzICh0YWJsZUVsKXtcclxuICBpZiAoIXRhYmxlRWwpIHJldHVybjtcclxuXHJcbiAgbGV0IGhlYWRlciA9ICB0YWJsZUVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aGVhZCcpO1xyXG4gIGlmKGhlYWRlci5sZW5ndGggIT09IDApIHtcclxuICAgIGxldCBoZWFkZXJDZWxsRWxzID0gaGVhZGVyWyAwIF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoJyk7XHJcbiAgICBpZiAoaGVhZGVyQ2VsbEVscy5sZW5ndGggPT0gMCkge1xyXG4gICAgICBoZWFkZXJDZWxsRWxzID0gaGVhZGVyWyAwIF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XHJcbiAgICAgIGNvbnN0IGJvZHlSb3dFbHMgPSBzZWxlY3QoJ3Rib2R5IHRyJywgdGFibGVFbCk7XHJcbiAgICAgIEFycmF5LmZyb20oYm9keVJvd0VscykuZm9yRWFjaChyb3dFbCA9PiB7XHJcbiAgICAgICAgbGV0IGNlbGxFbHMgPSByb3dFbC5jaGlsZHJlbjtcclxuICAgICAgICBpZiAoY2VsbEVscy5sZW5ndGggPT09IGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICBBcnJheS5mcm9tKGhlYWRlckNlbGxFbHMpLmZvckVhY2goKGhlYWRlckNlbGxFbCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBHcmFiIGhlYWRlciBjZWxsIHRleHQgYW5kIHVzZSBpdCBib2R5IGNlbGwgZGF0YSB0aXRsZS5cclxuICAgICAgICAgICAgaWYoIWNlbGxFbHNbIGkgXS5oYXNBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSApe1xyXG4gICAgICAgICAgICAgIGNlbGxFbHNbIGkgXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnLCBoZWFkZXJDZWxsRWwudGV4dENvbnRlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVzcG9uc2l2ZVRhYmxlO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmxldCBicmVha3BvaW50cyA9IHtcclxuICAneHMnOiAwLFxyXG4gICdzbSc6IDU3NixcclxuICAnbWQnOiA3NjgsXHJcbiAgJ2xnJzogOTkyLFxyXG4gICd4bCc6IDEyMDBcclxufTtcclxuXHJcbi8vIEZvciBlYXN5IHJlZmVyZW5jZVxyXG52YXIga2V5cyA9IHtcclxuICBlbmQ6IDM1LFxyXG4gIGhvbWU6IDM2LFxyXG4gIGxlZnQ6IDM3LFxyXG4gIHVwOiAzOCxcclxuICByaWdodDogMzksXHJcbiAgZG93bjogNDAsXHJcbiAgZGVsZXRlOiA0NlxyXG59O1xyXG5cclxuLy8gQWRkIG9yIHN1YnN0cmFjdCBkZXBlbmRpbmcgb24ga2V5IHByZXNzZWRcclxudmFyIGRpcmVjdGlvbiA9IHtcclxuICAzNzogLTEsXHJcbiAgMzg6IC0xLFxyXG4gIDM5OiAxLFxyXG4gIDQwOiAxXHJcbn07XHJcblxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uYWxpdHkgdG8gdGFibmF2IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YWJuYXYgVGFibmF2IGNvbnRhaW5lclxyXG4gKi9cclxuZnVuY3Rpb24gVGFibmF2ICh0YWJuYXYpIHtcclxuICB0aGlzLnRhYm5hdiA9IHRhYm5hdjtcclxuICB0aGlzLnRhYnMgPSB0aGlzLnRhYm5hdi5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24udGFibmF2LWl0ZW0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudCBvbiBjb21wb25lbnRcclxuICovXHJcblRhYm5hdi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgaWYodGhpcy50YWJzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRhYm5hdiBIVE1MIHNlZW1zIHRvIGJlIG1pc3NpbmcgdGFibmF2LWl0ZW0uIEFkZCB0YWJuYXYgaXRlbXMgdG8gZW5zdXJlIGVhY2ggcGFuZWwgaGFzIGEgYnV0dG9uIGluIHRoZSB0YWJuYXZzIG5hdmlnYXRpb24uYCk7XHJcbiAgfVxyXG5cclxuICAvLyBpZiBubyBoYXNoIGlzIHNldCBvbiBsb2FkLCBzZXQgYWN0aXZlIHRhYlxyXG4gIGlmICghc2V0QWN0aXZlSGFzaFRhYigpKSB7XHJcbiAgICAvLyBzZXQgZmlyc3QgdGFiIGFzIGFjdGl2ZVxyXG4gICAgbGV0IHRhYiA9IHRoaXMudGFic1sgMCBdO1xyXG5cclxuICAgIC8vIGNoZWNrIG5vIG90aGVyIHRhYnMgYXMgYmVlbiBzZXQgYXQgZGVmYXVsdFxyXG4gICAgbGV0IGFscmVhZHlBY3RpdmUgPSBnZXRBY3RpdmVUYWJzKHRoaXMudGFibmF2KTtcclxuICAgIGlmIChhbHJlYWR5QWN0aXZlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0YWIgPSBhbHJlYWR5QWN0aXZlWyAwIF07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWN0aXZhdGUgYW5kIGRlYWN0aXZhdGUgdGFic1xyXG4gICAgdGhpcy5hY3RpdmF0ZVRhYih0YWIsIGZhbHNlKTtcclxuICB9XHJcbiAgbGV0ICRtb2R1bGUgPSB0aGlzO1xyXG4gIC8vIGFkZCBldmVudGxpc3RlbmVycyBvbiBidXR0b25zXHJcbiAgZm9yKGxldCB0ID0gMDsgdCA8IHRoaXMudGFicy5sZW5ndGg7IHQgKyspe1xyXG4gICAgdGhpcy50YWJzWyB0IF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpeyRtb2R1bGUuYWN0aXZhdGVUYWIodGhpcywgZmFsc2UpfSk7XHJcbiAgICB0aGlzLnRhYnNbIHQgXS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bkV2ZW50TGlzdGVuZXIpO1xyXG4gICAgdGhpcy50YWJzWyB0IF0uYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBrZXl1cEV2ZW50TGlzdGVuZXIpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqKlxyXG4gKiBTaG93IHRhYiBhbmQgaGlkZSBvdGhlcnNcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gdGFiIGJ1dHRvbiBlbGVtZW50XHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gc2V0Rm9jdXMgVHJ1ZSBpZiB0YWIgYnV0dG9uIHNob3VsZCBiZSBmb2N1c2VkXHJcbiAqL1xyXG4gVGFibmF2LnByb3RvdHlwZS5hY3RpdmF0ZVRhYiA9IGZ1bmN0aW9uKHRhYiwgc2V0Rm9jdXMpIHtcclxuICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QodGFiKTtcclxuXHJcbiAgLy8gY2xvc2UgYWxsIHRhYnMgZXhjZXB0IHNlbGVjdGVkXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRhYnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmICh0YWJzWyBpIF0gPT09IHRhYikge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFic1sgaSBdLmdldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScpIHtcclxuICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy50YWJuYXYuY2xvc2UnKTtcclxuICAgICAgdGFic1sgaSBdLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGFic1sgaSBdLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcclxuICAgIHRhYnNbIGkgXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcclxuICAgIGxldCB0YWJwYW5lbElEID0gdGFic1sgaSBdLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xyXG4gICAgbGV0IHRhYnBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFicGFuZWxJRClcclxuICAgIGlmKHRhYnBhbmVsID09PSBudWxsKXtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCB0YWJwYW5lbC5gKTtcclxuICAgIH1cclxuICAgIHRhYnBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gIH1cclxuICBcclxuICAvLyBTZXQgc2VsZWN0ZWQgdGFiIHRvIGFjdGl2ZVxyXG4gIGxldCB0YWJwYW5lbElEID0gdGFiLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xyXG4gIGxldCB0YWJwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhYnBhbmVsSUQpO1xyXG4gIGlmKHRhYnBhbmVsID09PSBudWxsKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYWNjb3JkaW9uIHBhbmVsLmApO1xyXG4gIH1cclxuXHJcbiAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICd0cnVlJyk7XHJcbiAgdGFicGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gIHRhYi5yZW1vdmVBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XHJcblxyXG4gIC8vIFNldCBmb2N1cyB3aGVuIHJlcXVpcmVkXHJcbiAgaWYgKHNldEZvY3VzKSB7XHJcbiAgICB0YWIuZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIGxldCBldmVudENoYW5nZWQgPSBuZXcgRXZlbnQoJ2Zkcy50YWJuYXYuY2hhbmdlZCcpO1xyXG4gIHRhYi5wYXJlbnROb2RlLmRpc3BhdGNoRXZlbnQoZXZlbnRDaGFuZ2VkKTtcclxuXHJcbiAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLnRhYm5hdi5vcGVuJyk7XHJcbiAgdGFiLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBrZXlkb3duIGV2ZW50cyB0byB0YWJuYXYgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBrZXlkb3duRXZlbnRMaXN0ZW5lciAoZXZlbnQpIHtcclxuICBsZXQga2V5ID0gZXZlbnQua2V5Q29kZTtcclxuXHJcbiAgc3dpdGNoIChrZXkpIHtcclxuICAgIGNhc2Uga2V5cy5lbmQ6XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIEFjdGl2YXRlIGxhc3QgdGFiXHJcbiAgICAgIGZvY3VzTGFzdFRhYihldmVudC50YXJnZXQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2Uga2V5cy5ob21lOlxyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAvLyBBY3RpdmF0ZSBmaXJzdCB0YWJcclxuICAgICAgZm9jdXNGaXJzdFRhYihldmVudC50YXJnZXQpO1xyXG4gICAgICBicmVhaztcclxuICAgIC8vIFVwIGFuZCBkb3duIGFyZSBpbiBrZXlkb3duXHJcbiAgICAvLyBiZWNhdXNlIHdlIG5lZWQgdG8gcHJldmVudCBwYWdlIHNjcm9sbCA+OilcclxuICAgIGNhc2Uga2V5cy51cDpcclxuICAgIGNhc2Uga2V5cy5kb3duOlxyXG4gICAgICBkZXRlcm1pbmVPcmllbnRhdGlvbihldmVudCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBrZXl1cCBldmVudHMgdG8gdGFibmF2IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IFxyXG4gKi9cclxuZnVuY3Rpb24ga2V5dXBFdmVudExpc3RlbmVyIChldmVudCkge1xyXG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xyXG5cclxuICBzd2l0Y2ggKGtleSkge1xyXG4gICAgY2FzZSBrZXlzLmxlZnQ6XHJcbiAgICBjYXNlIGtleXMucmlnaHQ6XHJcbiAgICAgIGRldGVybWluZU9yaWVudGF0aW9uKGV2ZW50KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGtleXMuZGVsZXRlOlxyXG4gICAgICBicmVhaztcclxuICAgIGNhc2Uga2V5cy5lbnRlcjpcclxuICAgIGNhc2Uga2V5cy5zcGFjZTpcclxuICAgICAgbmV3IFRhYm5hdihldmVudC50YXJnZXQucGFyZW50Tm9kZSkuYWN0aXZhdGVUYWIoZXZlbnQudGFyZ2V0LCB0cnVlKTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogV2hlbiBhIHRhYmxpc3QgYXJpYS1vcmllbnRhdGlvbiBpcyBzZXQgdG8gdmVydGljYWwsXHJcbiAqIG9ubHkgdXAgYW5kIGRvd24gYXJyb3cgc2hvdWxkIGZ1bmN0aW9uLlxyXG4gKiBJbiBhbGwgb3RoZXIgY2FzZXMgb25seSBsZWZ0IGFuZCByaWdodCBhcnJvdyBmdW5jdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGRldGVybWluZU9yaWVudGF0aW9uIChldmVudCkge1xyXG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xyXG5cclxuICBsZXQgdz13aW5kb3csXHJcbiAgICBkPWRvY3VtZW50LFxyXG4gICAgZT1kLmRvY3VtZW50RWxlbWVudCxcclxuICAgIGc9ZC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0sXHJcbiAgICB4PXcuaW5uZXJXaWR0aHx8ZS5jbGllbnRXaWR0aHx8Zy5jbGllbnRXaWR0aCxcclxuICAgIHk9dy5pbm5lckhlaWdodHx8ZS5jbGllbnRIZWlnaHR8fGcuY2xpZW50SGVpZ2h0O1xyXG5cclxuICBsZXQgdmVydGljYWwgPSB4IDwgYnJlYWtwb2ludHMubWQ7XHJcbiAgbGV0IHByb2NlZWQgPSBmYWxzZTtcclxuXHJcbiAgaWYgKHZlcnRpY2FsKSB7XHJcbiAgICBpZiAoa2V5ID09PSBrZXlzLnVwIHx8IGtleSA9PT0ga2V5cy5kb3duKSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHByb2NlZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGlmIChrZXkgPT09IGtleXMubGVmdCB8fCBrZXkgPT09IGtleXMucmlnaHQpIHtcclxuICAgICAgcHJvY2VlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChwcm9jZWVkKSB7XHJcbiAgICBzd2l0Y2hUYWJPbkFycm93UHJlc3MoZXZlbnQpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEVpdGhlciBmb2N1cyB0aGUgbmV4dCwgcHJldmlvdXMsIGZpcnN0LCBvciBsYXN0IHRhYlxyXG4gKiBkZXBlbmRpbmcgb24ga2V5IHByZXNzZWRcclxuICovXHJcbmZ1bmN0aW9uIHN3aXRjaFRhYk9uQXJyb3dQcmVzcyAoZXZlbnQpIHtcclxuICB2YXIgcHJlc3NlZCA9IGV2ZW50LmtleUNvZGU7XHJcbiAgaWYgKGRpcmVjdGlvblsgcHJlc3NlZCBdKSB7XHJcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhcmdldCk7XHJcbiAgICBsZXQgaW5kZXggPSBnZXRJbmRleE9mRWxlbWVudEluTGlzdCh0YXJnZXQsIHRhYnMpO1xyXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICBpZiAodGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdKSB7XHJcbiAgICAgICAgdGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocHJlc3NlZCA9PT0ga2V5cy5sZWZ0IHx8IHByZXNzZWQgPT09IGtleXMudXApIHtcclxuICAgICAgICBmb2N1c0xhc3RUYWIodGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChwcmVzc2VkID09PSBrZXlzLnJpZ2h0IHx8IHByZXNzZWQgPT0ga2V5cy5kb3duKSB7XHJcbiAgICAgICAgZm9jdXNGaXJzdFRhYih0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGFsbCBhY3RpdmUgdGFicyBpbiBsaXN0XHJcbiAqIEBwYXJhbSB0YWJuYXYgcGFyZW50IC50YWJuYXYgZWxlbWVudFxyXG4gKiBAcmV0dXJucyByZXR1cm5zIGxpc3Qgb2YgYWN0aXZlIHRhYnMgaWYgYW55XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBY3RpdmVUYWJzICh0YWJuYXYpIHtcclxuICByZXR1cm4gdGFibmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbVthcmlhLXNlbGVjdGVkPXRydWVdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYSBsaXN0IG9mIGFsbCBidXR0b24gdGFicyBpbiBjdXJyZW50IHRhYmxpc3RcclxuICogQHBhcmFtIHRhYiBCdXR0b24gdGFiIGVsZW1lbnRcclxuICogQHJldHVybnMgeyp9IHJldHVybiBhcnJheSBvZiB0YWJzXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBbGxUYWJzSW5MaXN0ICh0YWIpIHtcclxuICBsZXQgcGFyZW50Tm9kZSA9IHRhYi5wYXJlbnROb2RlO1xyXG4gIGlmIChwYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndGFibmF2JykpIHtcclxuICAgIHJldHVybiBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xyXG4gIH1cclxuICByZXR1cm4gW107XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgaW5kZXggb2YgZWxlbWVudCBpbiBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgXHJcbiAqIEBwYXJhbSB7SFRNTENvbGxlY3Rpb259IGxpc3QgXHJcbiAqIEByZXR1cm5zIHtpbmRleH1cclxuICovXHJcbmZ1bmN0aW9uIGdldEluZGV4T2ZFbGVtZW50SW5MaXN0IChlbGVtZW50LCBsaXN0KXtcclxuICBsZXQgaW5kZXggPSAtMTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKysgKXtcclxuICAgIGlmKGxpc3RbIGkgXSA9PT0gZWxlbWVudCl7XHJcbiAgICAgIGluZGV4ID0gaTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaW5kZXg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgdGhlcmUgaXMgYSB0YWIgaGFzaCBpbiB0aGUgdXJsIGFuZCBhY3RpdmF0ZXMgdGhlIHRhYiBhY2NvcmRpbmdseVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJucyB0cnVlIGlmIHRhYiBoYXMgYmVlbiBzZXQgLSByZXR1cm5zIGZhbHNlIGlmIG5vIHRhYiBoYXMgYmVlbiBzZXQgdG8gYWN0aXZlXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRBY3RpdmVIYXNoVGFiICgpIHtcclxuICBsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcclxuICBpZiAoaGFzaCAhPT0gJycpIHtcclxuICAgIGxldCB0YWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24udGFibmF2LWl0ZW1bYXJpYS1jb250cm9scz1cIiMnICsgaGFzaCArICdcIl0nKTtcclxuICAgIGlmICh0YWIgIT09IG51bGwpIHtcclxuICAgICAgYWN0aXZhdGVUYWIodGFiLCBmYWxzZSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgZmlyc3QgdGFiIGJ5IHRhYiBpbiBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IHRhYiBcclxuICovXHJcbmZ1bmN0aW9uIGZvY3VzRmlyc3RUYWIgKHRhYikge1xyXG4gIGdldEFsbFRhYnNJbkxpc3QodGFiKVsgMCBdLmZvY3VzKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgbGFzdCB0YWIgYnkgdGFiIGluIGxpc3RcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gdGFiIFxyXG4gKi9cclxuZnVuY3Rpb24gZm9jdXNMYXN0VGFiICh0YWIpIHtcclxuICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QodGFiKTtcclxuICB0YWJzWyB0YWJzLmxlbmd0aCAtIDEgXS5mb2N1cygpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUYWJuYXY7IiwiJ3VzZSBzdHJpY3QnO1xyXG4vKipcclxuICogU2hvdy9oaWRlIHRvYXN0IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFxyXG4gKi9cclxuZnVuY3Rpb24gVG9hc3QgKGVsZW1lbnQpe1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3cgdG9hc3RcclxuICovXHJcblRvYXN0LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XHJcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvd2luZycpO1xyXG4gICAgdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RvYXN0LWNsb3NlJylbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGxldCB0b2FzdCA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gICAgICAgIG5ldyBUb2FzdCh0b2FzdCkuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc2hvd1RvYXN0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEhpZGUgdG9hc3RcclxuICovXHJcblRvYXN0LnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpOyAgICAgICAgIFxyXG59XHJcblxyXG4vKipcclxuICogQWRkcyBjbGFzc2VzIHRvIG1ha2Ugc2hvdyBhbmltYXRpb25cclxuICovXHJcbmZ1bmN0aW9uIHNob3dUb2FzdCgpe1xyXG4gICAgbGV0IHRvYXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50b2FzdC5zaG93aW5nJyk7XHJcbiAgICBmb3IobGV0IHQgPSAwOyB0IDwgdG9hc3RzLmxlbmd0aDsgdCsrKXtcclxuICAgICAgICBsZXQgdG9hc3QgPSB0b2FzdHNbdF07XHJcbiAgICAgICAgdG9hc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvd2luZycpO1xyXG4gICAgICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVG9hc3Q7IiwiJ3VzZSBzdHJpY3QnO1xyXG4vKipcclxuICogU2V0IHRvb2x0aXAgb24gZWxlbWVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2hpY2ggaGFzIHRvb2x0aXBcclxuICovXHJcbmZ1bmN0aW9uIFRvb2x0aXAoZWxlbWVudCl7XHJcbiAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICBpZih0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAnKSA9PT0gbnVsbCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRvb2x0aXAgdGV4dCBpcyBtaXNzaW5nLiBBZGQgYXR0cmlidXRlIGRhdGEtdG9vbHRpcCBhbmQgdGhlIGNvbnRlbnQgb2YgdGhlIHRvb2x0aXAgYXMgdmFsdWUuYCk7XHJcbiAgfVxyXG59XHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRsaXN0ZW5lcnNcclxuICovXHJcblRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKXtcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgXHJcbiAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBcclxuICAgICAgICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSl7XHJcbiAgICAgICAgICB2YXIgZWxlbWVudCA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgdmFyIHBvcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcclxuXHJcbiAgICAgICAgICB2YXIgdG9vbHRpcCA9IGNyZWF0ZVRvb2x0aXAoZWxlbWVudCwgcG9zKTtcclxuXHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xyXG5cclxuICAgICAgICAgIHBvc2l0aW9uQXQoZWxlbWVudCwgdG9vbHRpcCwgcG9zKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDMwMCk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBsZXQgdHJpZ2dlciA9IHRoaXM7XHJcbiAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1ob3ZlcicpO1xyXG4gICAgICBpZighdHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKXtcclxuICAgICAgICB2YXIgdG9vbHRpcCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgaWYodG9vbHRpcCAhPT0gbnVsbCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSAhPT0gbnVsbCl7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJpZ2dlci5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICAgICAgaWYgKGtleSA9PT0gMjcpIHtcclxuICAgICAgICB2YXIgdG9vbHRpcCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgaWYodG9vbHRpcCAhPT0gbnVsbCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSAhPT0gbnVsbCl7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgZWxlbWVudCA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JykgIT09IG51bGwpIHJldHVybjtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgdmFyIHBvcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcclxuICAgICAgdmFyIHRvb2x0aXAgPSBjcmVhdGVUb29sdGlwKGVsZW1lbnQsIHBvcyk7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XHJcbiAgICAgIHBvc2l0aW9uQXQoZWxlbWVudCwgdG9vbHRpcCwgcG9zKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIHRvb2x0aXAgPSB0aGlzLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICBpZih0b29sdGlwICE9PSBudWxsICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApICE9PSBudWxsKXtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgfSk7XHJcblxyXG4gIGlmKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC10cmlnZ2VyJykgPT09ICdjbGljaycpe1xyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzO1xyXG4gICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSA9PT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBwb3MgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLXBvc2l0aW9uJykgfHwgJ3RvcCc7XHJcbiAgICAgICAgdmFyIHRvb2x0aXAgPSBjcmVhdGVUb29sdGlwKGVsZW1lbnQsIHBvcyk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b29sdGlwKTtcclxuICAgICAgICBwb3NpdGlvbkF0KGVsZW1lbnQsIHRvb2x0aXAsIHBvcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYoZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKXtcclxuICAgICAgICAgIHZhciBwb3BwZXIgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwb3BwZXIpKTtcclxuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGlmICghZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnanMtdG9vbHRpcCcpICYmICFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sdGlwJykgJiYgIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtY29udGVudCcpKSB7XHJcbiAgICAgIGNsb3NlQWxsKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG59XHJcblxyXG4vKipcclxuICogQ2xvc2UgYWxsIHRvb2x0aXBzXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9zZUFsbCAoKXtcclxuICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdG9vbHRpcFthcmlhLWRlc2NyaWJlZGJ5XScpO1xyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHBvcHBlciA9IGVsZW1lbnRzWyBpIF0uZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICBlbGVtZW50c1sgaSBdLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwb3BwZXIpKTtcclxuICB9XHJcbn1cclxuLyoqXHJcbiAqIENyZWF0ZSB0b29sdGlwIGVsZW1lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdoaWNoIHRoZSB0b29sdGlwIGlzIGF0dGFjaGVkXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwb3MgUG9zaXRpb24gb2YgdG9vbHRpcCAodG9wIHwgYm90dG9tKVxyXG4gKiBAcmV0dXJucyBcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXAgKGVsZW1lbnQsIHBvcykge1xyXG4gIHZhciB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgdG9vbHRpcC5jbGFzc05hbWUgPSAndG9vbHRpcC1wb3BwZXInO1xyXG4gIHZhciBwb3BwZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1wb3BwZXInKTtcclxuICB2YXIgaWQgPSAndG9vbHRpcC0nK3BvcHBlcnMubGVuZ3RoKzE7XHJcbiAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xyXG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Rvb2x0aXAnKTtcclxuICB0b29sdGlwLnNldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnLCBwb3MpO1xyXG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgaWQpO1xyXG5cclxuICB2YXIgdG9vbHRpcElubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgdG9vbHRpcElubmVyLmNsYXNzTmFtZSA9ICd0b29sdGlwJztcclxuXHJcbiAgdmFyIHRvb2x0aXBBcnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHRvb2x0aXBBcnJvdy5jbGFzc05hbWUgPSAndG9vbHRpcC1hcnJvdyc7XHJcbiAgdG9vbHRpcElubmVyLmFwcGVuZENoaWxkKHRvb2x0aXBBcnJvdyk7XHJcblxyXG4gIHZhciB0b29sdGlwQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHRvb2x0aXBDb250ZW50LmNsYXNzTmFtZSA9ICd0b29sdGlwLWNvbnRlbnQnO1xyXG4gIHRvb2x0aXBDb250ZW50LmlubmVySFRNTCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAnKTtcclxuICB0b29sdGlwSW5uZXIuYXBwZW5kQ2hpbGQodG9vbHRpcENvbnRlbnQpO1xyXG4gIHRvb2x0aXAuYXBwZW5kQ2hpbGQodG9vbHRpcElubmVyKTtcclxuXHJcbiAgcmV0dXJuIHRvb2x0aXA7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBQb3NpdGlvbnMgdGhlIHRvb2x0aXAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBwYXJlbnQgLSBUaGUgdHJpZ2dlciBvZiB0aGUgdG9vbHRpcC5cclxuICogQHBhcmFtIHtvYmplY3R9IHRvb2x0aXAgLSBUaGUgdG9vbHRpcCBpdHNlbGYuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwb3NIb3Jpem9udGFsIC0gRGVzaXJlZCBob3Jpem9udGFsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKGxlZnQvY2VudGVyL3JpZ2h0KVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcG9zVmVydGljYWwgLSBEZXNpcmVkIHZlcnRpY2FsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKHRvcC9jZW50ZXIvYm90dG9tKVxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gcG9zaXRpb25BdCAocGFyZW50LCB0b29sdGlwLCBwb3MpIHtcclxuICBsZXQgdHJpZ2dlciA9IHBhcmVudDtcclxuICBsZXQgYXJyb3cgPSB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXTtcclxuICBsZXQgdHJpZ2dlclBvc2l0aW9uID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gIFxyXG4gIHZhciBwYXJlbnRDb29yZHMgPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIGxlZnQsIHRvcDtcclxuXHJcbiAgdmFyIHRvb2x0aXBXaWR0aCA9IHRvb2x0aXAub2Zmc2V0V2lkdGg7XHJcblxyXG4gIHZhciBkaXN0ID0gMTI7XHJcbiAgbGV0IGFycm93RGlyZWN0aW9uID0gXCJkb3duXCI7XHJcbiAgbGVmdCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5sZWZ0KSArICgocGFyZW50Lm9mZnNldFdpZHRoIC0gdG9vbHRpcC5vZmZzZXRXaWR0aCkgLyAyKTtcclxuXHJcbiAgc3dpdGNoIChwb3MpIHtcclxuICAgIGNhc2UgJ2JvdHRvbSc6XHJcbiAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5ib3R0b20pICsgZGlzdDtcclxuICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgICAgIGJyZWFrO1xyXG5cclxuICAgIGRlZmF1bHQ6XHJcbiAgICBjYXNlICd0b3AnOlxyXG4gICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMudG9wKSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gZGlzdDtcclxuICB9XHJcblxyXG4gIC8vIGlmIHRvb2x0aXAgaXMgb3V0IG9mIGJvdW5kcyBvbiBsZWZ0IHNpZGVcclxuICBpZihsZWZ0IDwgMCkge1xyXG4gICAgbGVmdCA9IGRpc3Q7XHJcbiAgICBsZXQgZW5kUG9zaXRpb25PblBhZ2UgPSB0cmlnZ2VyUG9zaXRpb24ubGVmdCArICh0cmlnZ2VyLm9mZnNldFdpZHRoIC8gMik7XHJcbiAgICBsZXQgdG9vbHRpcEFycm93SGFsZldpZHRoID0gODtcclxuICAgIGxldCBhcnJvd0xlZnRQb3NpdGlvbiA9IGVuZFBvc2l0aW9uT25QYWdlIC0gZGlzdCAtIHRvb2x0aXBBcnJvd0hhbGZXaWR0aDtcclxuICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLmxlZnQgPSBhcnJvd0xlZnRQb3NpdGlvbisncHgnO1xyXG4gIH1cclxuXHJcbiAgLy8gXHJcbiAgaWYoKHRvcCArIHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSA+PSB3aW5kb3cuaW5uZXJIZWlnaHQpe1xyXG4gICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLnRvcCkgLSB0b29sdGlwLm9mZnNldEhlaWdodCAtIGRpc3Q7XHJcbiAgICBhcnJvd0RpcmVjdGlvbiA9IFwidXBcIjtcclxuICB9XHJcbiAgXHJcbiAgaWYodG9wIDwgMCkge1xyXG4gICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLmJvdHRvbSkgKyBkaXN0O1xyXG4gICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgfVxyXG4gIGlmKHdpbmRvdy5pbm5lcldpZHRoIDwgKGxlZnQgKyB0b29sdGlwV2lkdGgpKXtcclxuICAgIHRvb2x0aXAuc3R5bGUucmlnaHQgPSBkaXN0ICsgJ3B4JztcclxuICAgIGxldCBlbmRQb3NpdGlvbk9uUGFnZSA9IHRyaWdnZXJQb3NpdGlvbi5yaWdodCAtICh0cmlnZ2VyLm9mZnNldFdpZHRoIC8gMik7XHJcbiAgICBsZXQgdG9vbHRpcEFycm93SGFsZldpZHRoID0gODtcclxuICAgIGxldCBhcnJvd1JpZ2h0UG9zaXRpb24gPSB3aW5kb3cuaW5uZXJXaWR0aCAtIGVuZFBvc2l0aW9uT25QYWdlIC0gZGlzdCAtIHRvb2x0aXBBcnJvd0hhbGZXaWR0aDtcclxuICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLnJpZ2h0ID0gYXJyb3dSaWdodFBvc2l0aW9uKydweCc7XHJcbiAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0b29sdGlwLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcclxuICB9XHJcbiAgdG9vbHRpcC5zdHlsZS50b3AgID0gdG9wICsgcGFnZVlPZmZzZXQgKyAncHgnO1xyXG4gIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLmNsYXNzTGlzdC5hZGQoYXJyb3dEaXJlY3Rpb24pO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUb29sdGlwO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBwcmVmaXg6ICcnLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCBBY2NvcmRpb24gZnJvbSAnLi9jb21wb25lbnRzL2FjY29yZGlvbic7XHJcbmltcG9ydCBBbGVydCBmcm9tICcuL2NvbXBvbmVudHMvYWxlcnQnO1xyXG5pbXBvcnQgQ2hlY2tib3hUb2dnbGVDb250ZW50IGZyb20gJy4vY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudCc7XHJcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL2NvbXBvbmVudHMvZHJvcGRvd24nO1xyXG5pbXBvcnQgRHJvcGRvd25Tb3J0IGZyb20gJy4vY29tcG9uZW50cy9kcm9wZG93bi1zb3J0JztcclxuaW1wb3J0IEVycm9yU3VtbWFyeSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeSc7XHJcbmltcG9ydCBJbnB1dFJlZ2V4TWFzayBmcm9tICcuL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzayc7XHJcbmltcG9ydCBNb2RhbCBmcm9tICcuL2NvbXBvbmVudHMvbW9kYWwnO1xyXG5pbXBvcnQgTmF2aWdhdGlvbiBmcm9tICcuL2NvbXBvbmVudHMvbmF2aWdhdGlvbic7XHJcbmltcG9ydCBSYWRpb1RvZ2dsZUdyb3VwIGZyb20gJy4vY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudCc7XHJcbmltcG9ydCBSZXNwb25zaXZlVGFibGUgZnJvbSAnLi9jb21wb25lbnRzL3RhYmxlJztcclxuaW1wb3J0IFRhYm5hdiBmcm9tICAnLi9jb21wb25lbnRzL3RhYm5hdic7XHJcbmltcG9ydCBUYWJsZVNlbGVjdGFibGVSb3dzIGZyb20gJy4vY29tcG9uZW50cy9zZWxlY3RhYmxlLXRhYmxlJztcclxuaW1wb3J0IFRvYXN0IGZyb20gJy4vY29tcG9uZW50cy90b2FzdCc7XHJcbmltcG9ydCBUb29sdGlwIGZyb20gJy4vY29tcG9uZW50cy90b29sdGlwJztcclxuY29uc3QgZGF0ZVBpY2tlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kYXRlLXBpY2tlcicpO1xyXG4vKipcclxuICogVGhlICdwb2x5ZmlsbHMnIGRlZmluZSBrZXkgRUNNQVNjcmlwdCA1IG1ldGhvZHMgdGhhdCBtYXkgYmUgbWlzc2luZyBmcm9tXHJcbiAqIG9sZGVyIGJyb3dzZXJzLCBzbyBtdXN0IGJlIGxvYWRlZCBmaXJzdC5cclxuICovXHJcbnJlcXVpcmUoJy4vcG9seWZpbGxzJyk7XHJcblxyXG4vKipcclxuICogSW5pdCBhbGwgY29tcG9uZW50c1xyXG4gKiBAcGFyYW0ge0pTT059IG9wdGlvbnMge3Njb3BlOiBIVE1MRWxlbWVudH0gLSBJbml0IGFsbCBjb21wb25lbnRzIHdpdGhpbiBzY29wZSAoZGVmYXVsdCBpcyBkb2N1bWVudClcclxuICovXHJcbnZhciBpbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAvLyBTZXQgdGhlIG9wdGlvbnMgdG8gYW4gZW1wdHkgb2JqZWN0IGJ5IGRlZmF1bHQgaWYgbm8gb3B0aW9ucyBhcmUgcGFzc2VkLlxyXG4gIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zIDoge31cclxuXHJcbiAgLy8gQWxsb3cgdGhlIHVzZXIgdG8gaW5pdGlhbGlzZSBGRFMgaW4gb25seSBjZXJ0YWluIHNlY3Rpb25zIG9mIHRoZSBwYWdlXHJcbiAgLy8gRGVmYXVsdHMgdG8gdGhlIGVudGlyZSBkb2N1bWVudCBpZiBub3RoaW5nIGlzIHNldC5cclxuICB2YXIgc2NvcGUgPSB0eXBlb2Ygb3B0aW9ucy5zY29wZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnNjb3BlIDogZG9jdW1lbnRcclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBBY2NvcmRpb25zXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yQWNjb3JkaW9uID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYWNjb3JkaW9uJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JBY2NvcmRpb24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFjY29yZGlvbihqc1NlbGVjdG9yQWNjb3JkaW9uWyBjIF0pLmluaXQoKTtcclxuICB9XHJcbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmFjY29yZGlvbi1ib3JkZXJlZDpub3QoLmFjY29yZGlvbiknKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBBY2NvcmRpb24oanNTZWxlY3RvckFjY29yZGlvbkJvcmRlcmVkWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQWxlcnRzXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuXHJcbiAgY29uc3QgYWxlcnRzV2l0aENsb3NlQnV0dG9uID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnLmFsZXJ0Lmhhcy1jbG9zZScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBhbGVydHNXaXRoQ2xvc2VCdXR0b24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEFsZXJ0KGFsZXJ0c1dpdGhDbG9zZUJ1dHRvblsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQ2hlY2tib3ggY29sbGFwc2VcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2UubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IENoZWNrYm94VG9nZ2xlQ29udGVudChqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZVsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIE92ZXJmbG93IG1lbnVcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JEcm9wZG93biA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWRyb3Bkb3duJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JEcm9wZG93bi5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgRHJvcGRvd24oanNTZWxlY3RvckRyb3Bkb3duWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgT3ZlcmZsb3cgbWVudSBzb3J0XHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yRHJvcGRvd25Tb3J0ID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3ZlcmZsb3ctbWVudS0tc29ydCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yRHJvcGRvd25Tb3J0Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBEcm9wZG93blNvcnQoanNTZWxlY3RvckRyb3Bkb3duU29ydFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIERhdGVwaWNrZXJcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGRhdGVQaWNrZXIub24oc2NvcGUpO1xyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgRXJyb3Igc3VtbWFyeVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgdmFyICRlcnJvclN1bW1hcnkgPSBzY29wZS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1tb2R1bGU9XCJlcnJvci1zdW1tYXJ5XCJdJyk7XHJcbiAgbmV3IEVycm9yU3VtbWFyeSgkZXJyb3JTdW1tYXJ5KS5pbml0KCk7XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgSW5wdXQgUmVnZXggLSB1c2VkIG9uIGRhdGUgZmllbGRzXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yUmVnZXggPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtkYXRhLWlucHV0LXJlZ2V4XScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yUmVnZXgubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IElucHV0UmVnZXhNYXNrKGpzU2VsZWN0b3JSZWdleFsgYyBdKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgTW9kYWxcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IG1vZGFscyA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mZHMtbW9kYWwnKTtcclxuICBmb3IobGV0IGQgPSAwOyBkIDwgbW9kYWxzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICBuZXcgTW9kYWwobW9kYWxzW2RdKS5pbml0KCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgTmF2aWdhdGlvblxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgbmV3IE5hdmlnYXRpb24oKS5pbml0KCk7XHJcbiAgIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgUmFkaW9idXR0b24gZ3JvdXAgY29sbGFwc2VcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtcmFkaW8tdG9nZ2xlLWdyb3VwJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBSYWRpb1RvZ2dsZUdyb3VwKGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgUmVzcG9uc2l2ZSB0YWJsZXNcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JUYWJsZSA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RhYmxlOm5vdCguZGF0YVRhYmxlKScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibGUubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFJlc3BvbnNpdmVUYWJsZShqc1NlbGVjdG9yVGFibGVbIGMgXSk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFNlbGVjdGFibGUgcm93cyBpbiB0YWJsZVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RhYmxlVGFibGUgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZS50YWJsZS0tc2VsZWN0YWJsZScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdGFibGVUYWJsZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVGFibGVTZWxlY3RhYmxlUm93cyhqc1NlbGVjdGFibGVUYWJsZVsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRhYm5hdlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclRhYm5hdiA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhYm5hdicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibmF2Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBUYWJuYXYoanNTZWxlY3RvclRhYm5hdlsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRvb2x0aXBcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JUb29sdGlwID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtdG9vbHRpcCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVG9vbHRpcC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVG9vbHRpcChqc1NlbGVjdG9yVG9vbHRpcFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG4gIFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7IGluaXQsIEFjY29yZGlvbiwgQWxlcnQsIENoZWNrYm94VG9nZ2xlQ29udGVudCwgRHJvcGRvd24sIERyb3Bkb3duU29ydCwgZGF0ZVBpY2tlciwgRXJyb3JTdW1tYXJ5LCBJbnB1dFJlZ2V4TWFzaywgTW9kYWwsIE5hdmlnYXRpb24sIFJhZGlvVG9nZ2xlR3JvdXAsIFJlc3BvbnNpdmVUYWJsZSwgVGFibGVTZWxlY3RhYmxlUm93cywgVGFibmF2LCBUb2FzdCwgVG9vbHRpcH07IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgLy8gVGhpcyB1c2VkIHRvIGJlIGNvbmRpdGlvbmFsbHkgZGVwZW5kZW50IG9uIHdoZXRoZXIgdGhlXHJcbiAgLy8gYnJvd3NlciBzdXBwb3J0ZWQgdG91Y2ggZXZlbnRzOyBpZiBpdCBkaWQsIGBDTElDS2Agd2FzIHNldCB0b1xyXG4gIC8vIGB0b3VjaHN0YXJ0YC4gIEhvd2V2ZXIsIHRoaXMgaGFkIGRvd25zaWRlczpcclxuICAvL1xyXG4gIC8vICogSXQgcHJlLWVtcHRlZCBtb2JpbGUgYnJvd3NlcnMnIGRlZmF1bHQgYmVoYXZpb3Igb2YgZGV0ZWN0aW5nXHJcbiAgLy8gICB3aGV0aGVyIGEgdG91Y2ggdHVybmVkIGludG8gYSBzY3JvbGwsIHRoZXJlYnkgcHJldmVudGluZ1xyXG4gIC8vICAgdXNlcnMgZnJvbSB1c2luZyBzb21lIG9mIG91ciBjb21wb25lbnRzIGFzIHNjcm9sbCBzdXJmYWNlcy5cclxuICAvL1xyXG4gIC8vICogU29tZSBkZXZpY2VzLCBzdWNoIGFzIHRoZSBNaWNyb3NvZnQgU3VyZmFjZSBQcm8sIHN1cHBvcnQgKmJvdGgqXHJcbiAgLy8gICB0b3VjaCBhbmQgY2xpY2tzLiBUaGlzIG1lYW50IHRoZSBjb25kaXRpb25hbCBlZmZlY3RpdmVseSBkcm9wcGVkXHJcbiAgLy8gICBzdXBwb3J0IGZvciB0aGUgdXNlcidzIG1vdXNlLCBmcnVzdHJhdGluZyB1c2VycyB3aG8gcHJlZmVycmVkXHJcbiAgLy8gICBpdCBvbiB0aG9zZSBzeXN0ZW1zLlxyXG4gIENMSUNLOiAnY2xpY2snLFxyXG59O1xyXG4iLCJpbXBvcnQgJy4uLy4uL09iamVjdC9kZWZpbmVQcm9wZXJ0eSdcblxuKGZ1bmN0aW9uKHVuZGVmaW5lZCkge1xuICAvLyBEZXRlY3Rpb24gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLXNlcnZpY2UvYmxvYi9tYXN0ZXIvcGFja2FnZXMvcG9seWZpbGwtbGlicmFyeS9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQvZGV0ZWN0LmpzXG4gIHZhciBkZXRlY3QgPSAnYmluZCcgaW4gRnVuY3Rpb24ucHJvdG90eXBlXG5cbiAgaWYgKGRldGVjdCkgcmV0dXJuXG5cbiAgLy8gUG9seWZpbGwgZnJvbSBodHRwczovL2Nkbi5wb2x5ZmlsbC5pby92Mi9wb2x5ZmlsbC5qcz9mZWF0dXJlcz1GdW5jdGlvbi5wcm90b3R5cGUuYmluZCZmbGFncz1hbHdheXNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ2JpbmQnLCB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYmluZCh0aGF0KSB7IC8vIC5sZW5ndGggaXMgMVxuICAgICAgICAgIC8vIGFkZCBuZWNlc3NhcnkgZXM1LXNoaW0gdXRpbGl0aWVzXG4gICAgICAgICAgdmFyICRBcnJheSA9IEFycmF5O1xuICAgICAgICAgIHZhciAkT2JqZWN0ID0gT2JqZWN0O1xuICAgICAgICAgIHZhciBPYmplY3RQcm90b3R5cGUgPSAkT2JqZWN0LnByb3RvdHlwZTtcbiAgICAgICAgICB2YXIgQXJyYXlQcm90b3R5cGUgPSAkQXJyYXkucHJvdG90eXBlO1xuICAgICAgICAgIHZhciBFbXB0eSA9IGZ1bmN0aW9uIEVtcHR5KCkge307XG4gICAgICAgICAgdmFyIHRvX3N0cmluZyA9IE9iamVjdFByb3RvdHlwZS50b1N0cmluZztcbiAgICAgICAgICB2YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnO1xuICAgICAgICAgIHZhciBpc0NhbGxhYmxlOyAvKiBpbmxpbmVkIGZyb20gaHR0cHM6Ly9ucG1qcy5jb20vaXMtY2FsbGFibGUgKi8gdmFyIGZuVG9TdHIgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcsIHRyeUZ1bmN0aW9uT2JqZWN0ID0gZnVuY3Rpb24gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpIHsgdHJ5IHsgZm5Ub1N0ci5jYWxsKHZhbHVlKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH0sIGZuQ2xhc3MgPSAnW29iamVjdCBGdW5jdGlvbl0nLCBnZW5DbGFzcyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSc7IGlzQ2FsbGFibGUgPSBmdW5jdGlvbiBpc0NhbGxhYmxlKHZhbHVlKSB7IGlmICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIGZhbHNlOyB9IGlmIChoYXNUb1N0cmluZ1RhZykgeyByZXR1cm4gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpOyB9IHZhciBzdHJDbGFzcyA9IHRvX3N0cmluZy5jYWxsKHZhbHVlKTsgcmV0dXJuIHN0ckNsYXNzID09PSBmbkNsYXNzIHx8IHN0ckNsYXNzID09PSBnZW5DbGFzczsgfTtcbiAgICAgICAgICB2YXIgYXJyYXlfc2xpY2UgPSBBcnJheVByb3RvdHlwZS5zbGljZTtcbiAgICAgICAgICB2YXIgYXJyYXlfY29uY2F0ID0gQXJyYXlQcm90b3R5cGUuY29uY2F0O1xuICAgICAgICAgIHZhciBhcnJheV9wdXNoID0gQXJyYXlQcm90b3R5cGUucHVzaDtcbiAgICAgICAgICB2YXIgbWF4ID0gTWF0aC5tYXg7XG4gICAgICAgICAgLy8gL2FkZCBuZWNlc3NhcnkgZXM1LXNoaW0gdXRpbGl0aWVzXG5cbiAgICAgICAgICAvLyAxLiBMZXQgVGFyZ2V0IGJlIHRoZSB0aGlzIHZhbHVlLlxuICAgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzO1xuICAgICAgICAgIC8vIDIuIElmIElzQ2FsbGFibGUoVGFyZ2V0KSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxuICAgICAgICAgIGlmICghaXNDYWxsYWJsZSh0YXJnZXQpKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgJyArIHRhcmdldCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIDMuIExldCBBIGJlIGEgbmV3IChwb3NzaWJseSBlbXB0eSkgaW50ZXJuYWwgbGlzdCBvZiBhbGwgb2YgdGhlXG4gICAgICAgICAgLy8gICBhcmd1bWVudCB2YWx1ZXMgcHJvdmlkZWQgYWZ0ZXIgdGhpc0FyZyAoYXJnMSwgYXJnMiBldGMpLCBpbiBvcmRlci5cbiAgICAgICAgICAvLyBYWFggc2xpY2VkQXJncyB3aWxsIHN0YW5kIGluIGZvciBcIkFcIiBpZiB1c2VkXG4gICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7IC8vIGZvciBub3JtYWwgY2FsbFxuICAgICAgICAgIC8vIDQuIExldCBGIGJlIGEgbmV3IG5hdGl2ZSBFQ01BU2NyaXB0IG9iamVjdC5cbiAgICAgICAgICAvLyAxMS4gU2V0IHRoZSBbW1Byb3RvdHlwZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdGhlIHN0YW5kYXJkXG4gICAgICAgICAgLy8gICBidWlsdC1pbiBGdW5jdGlvbiBwcm90b3R5cGUgb2JqZWN0IGFzIHNwZWNpZmllZCBpbiAxNS4zLjMuMS5cbiAgICAgICAgICAvLyAxMi4gU2V0IHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICAgIC8vICAgMTUuMy40LjUuMS5cbiAgICAgICAgICAvLyAxMy4gU2V0IHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4yLlxuICAgICAgICAgIC8vIDE0LiBTZXQgdGhlIFtbSGFzSW5zdGFuY2VdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICAgIC8vICAgMTUuMy40LjUuMy5cbiAgICAgICAgICB2YXIgYm91bmQ7XG4gICAgICAgICAgdmFyIGJpbmRlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAvLyAxNS4zLjQuNS4yIFtbQ29uc3RydWN0XV1cbiAgICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kIG9mIGEgZnVuY3Rpb24gb2JqZWN0LFxuICAgICAgICAgICAgICAgICAgLy8gRiB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcbiAgICAgICAgICAgICAgICAgIC8vIGxpc3Qgb2YgYXJndW1lbnRzIEV4dHJhQXJncywgdGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XG4gICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dXG4gICAgICAgICAgICAgICAgICAvLyAgIGludGVybmFsIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgLy8gMi4gSWYgdGFyZ2V0IGhhcyBubyBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCwgYVxuICAgICAgICAgICAgICAgICAgLy8gICBUeXBlRXJyb3IgZXhjZXB0aW9uIGlzIHRocm93bi5cbiAgICAgICAgICAgICAgICAgIC8vIDMuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgLy8gNC4gTGV0IGFyZ3MgYmUgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyB0aGVcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAgIC8vICAgdmFsdWVzIGFzIHRoZSBsaXN0IEV4dHJhQXJncyBpbiB0aGUgc2FtZSBvcmRlci5cbiAgICAgICAgICAgICAgICAgIC8vIDUuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAgIC8vICAgbWV0aG9kIG9mIHRhcmdldCBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxuXG4gICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGFyZ2V0LmFwcGx5KFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgYXJyYXlfY29uY2F0LmNhbGwoYXJncywgYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIGlmICgkT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMSBbW0NhbGxdXVxuICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mIGEgZnVuY3Rpb24gb2JqZWN0LCBGLFxuICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggd2FzIGNyZWF0ZWQgdXNpbmcgdGhlIGJpbmQgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggYVxuICAgICAgICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSBhbmQgYSBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmdcbiAgICAgICAgICAgICAgICAgIC8vIHN0ZXBzIGFyZSB0YWtlbjpcbiAgICAgICAgICAgICAgICAgIC8vIDEuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgLy8gMi4gTGV0IGJvdW5kVGhpcyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRUaGlzXV0gaW50ZXJuYWxcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgLy8gNC4gTGV0IGFyZ3MgYmUgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBzYW1lIHZhbHVlcyBhcyB0aGVcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAgIC8vICAgdmFsdWVzIGFzIHRoZSBsaXN0IEV4dHJhQXJncyBpbiB0aGUgc2FtZSBvcmRlci5cbiAgICAgICAgICAgICAgICAgIC8vIDUuIFJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbQ2FsbF1dIGludGVybmFsIG1ldGhvZFxuICAgICAgICAgICAgICAgICAgLy8gICBvZiB0YXJnZXQgcHJvdmlkaW5nIGJvdW5kVGhpcyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvdmlkaW5nIGFyZ3MgYXMgdGhlIGFyZ3VtZW50cy5cblxuICAgICAgICAgICAgICAgICAgLy8gZXF1aXY6IHRhcmdldC5jYWxsKHRoaXMsIC4uLmJvdW5kQXJncywgLi4uYXJncylcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuYXBwbHkoXG4gICAgICAgICAgICAgICAgICAgICAgdGhhdCxcbiAgICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXG4gICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyAxNS4gSWYgdGhlIFtbQ2xhc3NdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBUYXJnZXQgaXMgXCJGdW5jdGlvblwiLCB0aGVuXG4gICAgICAgICAgLy8gICAgIGEuIExldCBMIGJlIHRoZSBsZW5ndGggcHJvcGVydHkgb2YgVGFyZ2V0IG1pbnVzIHRoZSBsZW5ndGggb2YgQS5cbiAgICAgICAgICAvLyAgICAgYi4gU2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gZWl0aGVyIDAgb3IgTCwgd2hpY2hldmVyIGlzXG4gICAgICAgICAgLy8gICAgICAgbGFyZ2VyLlxuICAgICAgICAgIC8vIDE2LiBFbHNlIHNldCB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIDAuXG5cbiAgICAgICAgICB2YXIgYm91bmRMZW5ndGggPSBtYXgoMCwgdGFyZ2V0Lmxlbmd0aCAtIGFyZ3MubGVuZ3RoKTtcblxuICAgICAgICAgIC8vIDE3LiBTZXQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byB0aGUgdmFsdWVzXG4gICAgICAgICAgLy8gICBzcGVjaWZpZWQgaW4gMTUuMy41LjEuXG4gICAgICAgICAgdmFyIGJvdW5kQXJncyA9IFtdO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm91bmRMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBhcnJheV9wdXNoLmNhbGwoYm91bmRBcmdzLCAnJCcgKyBpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBYWFggQnVpbGQgYSBkeW5hbWljIGZ1bmN0aW9uIHdpdGggZGVzaXJlZCBhbW91bnQgb2YgYXJndW1lbnRzIGlzIHRoZSBvbmx5XG4gICAgICAgICAgLy8gd2F5IHRvIHNldCB0aGUgbGVuZ3RoIHByb3BlcnR5IG9mIGEgZnVuY3Rpb24uXG4gICAgICAgICAgLy8gSW4gZW52aXJvbm1lbnRzIHdoZXJlIENvbnRlbnQgU2VjdXJpdHkgUG9saWNpZXMgZW5hYmxlZCAoQ2hyb21lIGV4dGVuc2lvbnMsXG4gICAgICAgICAgLy8gZm9yIGV4LikgYWxsIHVzZSBvZiBldmFsIG9yIEZ1bmN0aW9uIGNvc3RydWN0b3IgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAgICAvLyBIb3dldmVyIGluIGFsbCBvZiB0aGVzZSBlbnZpcm9ubWVudHMgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgZXhpc3RzXG4gICAgICAgICAgLy8gYW5kIHNvIHRoaXMgY29kZSB3aWxsIG5ldmVyIGJlIGV4ZWN1dGVkLlxuICAgICAgICAgIGJvdW5kID0gRnVuY3Rpb24oJ2JpbmRlcicsICdyZXR1cm4gZnVuY3Rpb24gKCcgKyBib3VuZEFyZ3Muam9pbignLCcpICsgJyl7IHJldHVybiBiaW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfScpKGJpbmRlcik7XG5cbiAgICAgICAgICBpZiAodGFyZ2V0LnByb3RvdHlwZSkge1xuICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSB0YXJnZXQucHJvdG90eXBlO1xuICAgICAgICAgICAgICBib3VuZC5wcm90b3R5cGUgPSBuZXcgRW1wdHkoKTtcbiAgICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZGFuZ2xpbmcgcmVmZXJlbmNlcy5cbiAgICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBUT0RPXG4gICAgICAgICAgLy8gMTguIFNldCB0aGUgW1tFeHRlbnNpYmxlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0cnVlLlxuXG4gICAgICAgICAgLy8gVE9ET1xuICAgICAgICAgIC8vIDE5LiBMZXQgdGhyb3dlciBiZSB0aGUgW1tUaHJvd1R5cGVFcnJvcl1dIGZ1bmN0aW9uIE9iamVjdCAoMTMuMi4zKS5cbiAgICAgICAgICAvLyAyMC4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcbiAgICAgICAgICAvLyAgIGFyZ3VtZW50cyBcImNhbGxlclwiLCBQcm9wZXJ0eURlc2NyaXB0b3Ige1tbR2V0XV06IHRocm93ZXIsIFtbU2V0XV06XG4gICAgICAgICAgLy8gICB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSwgYW5kXG4gICAgICAgICAgLy8gICBmYWxzZS5cbiAgICAgICAgICAvLyAyMS4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcbiAgICAgICAgICAvLyAgIGFyZ3VtZW50cyBcImFyZ3VtZW50c1wiLCBQcm9wZXJ0eURlc2NyaXB0b3Ige1tbR2V0XV06IHRocm93ZXIsXG4gICAgICAgICAgLy8gICBbW1NldF1dOiB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSxcbiAgICAgICAgICAvLyAgIGFuZCBmYWxzZS5cblxuICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgICAvLyBOT1RFIEZ1bmN0aW9uIG9iamVjdHMgY3JlYXRlZCB1c2luZyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBkbyBub3RcbiAgICAgICAgICAvLyBoYXZlIGEgcHJvdG90eXBlIHByb3BlcnR5IG9yIHRoZSBbW0NvZGVdXSwgW1tGb3JtYWxQYXJhbWV0ZXJzXV0sIGFuZFxuICAgICAgICAgIC8vIFtbU2NvcGVdXSBpbnRlcm5hbCBwcm9wZXJ0aWVzLlxuICAgICAgICAgIC8vIFhYWCBjYW4ndCBkZWxldGUgcHJvdG90eXBlIGluIHB1cmUtanMuXG5cbiAgICAgICAgICAvLyAyMi4gUmV0dXJuIEYuXG4gICAgICAgICAgcmV0dXJuIGJvdW5kO1xuICAgICAgfVxuICB9KTtcbn0pXG4uY2FsbCgnb2JqZWN0JyA9PT0gdHlwZW9mIHdpbmRvdyAmJiB3aW5kb3cgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBzZWxmICYmIHNlbGYgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBnbG9iYWwgJiYgZ2xvYmFsIHx8IHt9KTtcbiIsIihmdW5jdGlvbih1bmRlZmluZWQpIHtcblxuLy8gRGV0ZWN0aW9uIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0ZpbmFuY2lhbC1UaW1lcy9wb2x5ZmlsbC1zZXJ2aWNlL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL3BvbHlmaWxsLWxpYnJhcnkvcG9seWZpbGxzL09iamVjdC9kZWZpbmVQcm9wZXJ0eS9kZXRlY3QuanNcbnZhciBkZXRlY3QgPSAoXG4gIC8vIEluIElFOCwgZGVmaW5lUHJvcGVydHkgY291bGQgb25seSBhY3Qgb24gRE9NIGVsZW1lbnRzLCBzbyBmdWxsIHN1cHBvcnRcbiAgLy8gZm9yIHRoZSBmZWF0dXJlIHJlcXVpcmVzIHRoZSBhYmlsaXR5IHRvIHNldCBhIHByb3BlcnR5IG9uIGFuIGFyYml0cmFyeSBvYmplY3RcbiAgJ2RlZmluZVByb3BlcnR5JyBpbiBPYmplY3QgJiYgKGZ1bmN0aW9uKCkge1xuICBcdHRyeSB7XG4gIFx0XHR2YXIgYSA9IHt9O1xuICBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsICd0ZXN0Jywge3ZhbHVlOjQyfSk7XG4gIFx0XHRyZXR1cm4gdHJ1ZTtcbiAgXHR9IGNhdGNoKGUpIHtcbiAgXHRcdHJldHVybiBmYWxzZVxuICBcdH1cbiAgfSgpKVxuKVxuXG5pZiAoZGV0ZWN0KSByZXR1cm5cblxuLy8gUG9seWZpbGwgZnJvbSBodHRwczovL2Nkbi5wb2x5ZmlsbC5pby92Mi9wb2x5ZmlsbC5qcz9mZWF0dXJlcz1PYmplY3QuZGVmaW5lUHJvcGVydHkmZmxhZ3M9YWx3YXlzXG4oZnVuY3Rpb24gKG5hdGl2ZURlZmluZVByb3BlcnR5KSB7XG5cblx0dmFyIHN1cHBvcnRzQWNjZXNzb3JzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSgnX19kZWZpbmVHZXR0ZXJfXycpO1xuXHR2YXIgRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEID0gJ0dldHRlcnMgJiBzZXR0ZXJzIGNhbm5vdCBiZSBkZWZpbmVkIG9uIHRoaXMgamF2YXNjcmlwdCBlbmdpbmUnO1xuXHR2YXIgRVJSX1ZBTFVFX0FDQ0VTU09SUyA9ICdBIHByb3BlcnR5IGNhbm5vdCBib3RoIGhhdmUgYWNjZXNzb3JzIGFuZCBiZSB3cml0YWJsZSBvciBoYXZlIGEgdmFsdWUnO1xuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHksIGRlc2NyaXB0b3IpIHtcblxuXHRcdC8vIFdoZXJlIG5hdGl2ZSBzdXBwb3J0IGV4aXN0cywgYXNzdW1lIGl0XG5cdFx0aWYgKG5hdGl2ZURlZmluZVByb3BlcnR5ICYmIChvYmplY3QgPT09IHdpbmRvdyB8fCBvYmplY3QgPT09IGRvY3VtZW50IHx8IG9iamVjdCA9PT0gRWxlbWVudC5wcm90b3R5cGUgfHwgb2JqZWN0IGluc3RhbmNlb2YgRWxlbWVudCkpIHtcblx0XHRcdHJldHVybiBuYXRpdmVEZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKTtcblx0XHR9XG5cblx0XHRpZiAob2JqZWN0ID09PSBudWxsIHx8ICEob2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0IHx8IHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKSkge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKCEoZGVzY3JpcHRvciBpbnN0YW5jZW9mIE9iamVjdCkpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb3BlcnR5IGRlc2NyaXB0aW9uIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG5cdFx0fVxuXG5cdFx0dmFyIHByb3BlcnR5U3RyaW5nID0gU3RyaW5nKHByb3BlcnR5KTtcblx0XHR2YXIgaGFzVmFsdWVPcldyaXRhYmxlID0gJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yIHx8ICd3cml0YWJsZScgaW4gZGVzY3JpcHRvcjtcblx0XHR2YXIgZ2V0dGVyVHlwZSA9ICdnZXQnIGluIGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3IuZ2V0O1xuXHRcdHZhciBzZXR0ZXJUeXBlID0gJ3NldCcgaW4gZGVzY3JpcHRvciAmJiB0eXBlb2YgZGVzY3JpcHRvci5zZXQ7XG5cblx0XHQvLyBoYW5kbGUgZGVzY3JpcHRvci5nZXRcblx0XHRpZiAoZ2V0dGVyVHlwZSkge1xuXHRcdFx0aWYgKGdldHRlclR5cGUgIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignR2V0dGVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaGFzVmFsdWVPcldyaXRhYmxlKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX1ZBTFVFX0FDQ0VTU09SUyk7XG5cdFx0XHR9XG5cdFx0XHRPYmplY3QuX19kZWZpbmVHZXR0ZXJfXy5jYWxsKG9iamVjdCwgcHJvcGVydHlTdHJpbmcsIGRlc2NyaXB0b3IuZ2V0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b2JqZWN0W3Byb3BlcnR5U3RyaW5nXSA9IGRlc2NyaXB0b3IudmFsdWU7XG5cdFx0fVxuXG5cdFx0Ly8gaGFuZGxlIGRlc2NyaXB0b3Iuc2V0XG5cdFx0aWYgKHNldHRlclR5cGUpIHtcblx0XHRcdGlmIChzZXR0ZXJUeXBlICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1NldHRlciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblx0XHRcdH1cblx0XHRcdGlmICghc3VwcG9ydHNBY2Nlc3NvcnMpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfQUNDRVNTT1JTX05PVF9TVVBQT1JURUQpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGhhc1ZhbHVlT3JXcml0YWJsZSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9WQUxVRV9BQ0NFU1NPUlMpO1xuXHRcdFx0fVxuXHRcdFx0T2JqZWN0Ll9fZGVmaW5lU2V0dGVyX18uY2FsbChvYmplY3QsIHByb3BlcnR5U3RyaW5nLCBkZXNjcmlwdG9yLnNldCk7XG5cdFx0fVxuXG5cdFx0Ly8gT0sgdG8gZGVmaW5lIHZhbHVlIHVuY29uZGl0aW9uYWxseSAtIGlmIGEgZ2V0dGVyIGhhcyBiZWVuIHNwZWNpZmllZCBhcyB3ZWxsLCBhbiBlcnJvciB3b3VsZCBiZSB0aHJvd24gYWJvdmVcblx0XHRpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKSB7XG5cdFx0XHRvYmplY3RbcHJvcGVydHlTdHJpbmddID0gZGVzY3JpcHRvci52YWx1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9O1xufShPYmplY3QuZGVmaW5lUHJvcGVydHkpKTtcbn0pXG4uY2FsbCgnb2JqZWN0JyA9PT0gdHlwZW9mIHdpbmRvdyAmJiB3aW5kb3cgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBzZWxmICYmIHNlbGYgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBnbG9iYWwgJiYgZ2xvYmFsIHx8IHt9KTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIGNvbnNpc3RlbnQtcmV0dXJuICovXHJcbi8qIGVzbGludC1kaXNhYmxlIGZ1bmMtbmFtZXMgKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50LCBfcGFyYW1zKSB7XHJcbiAgICBjb25zdCBwYXJhbXMgPSBfcGFyYW1zIHx8IHtcclxuICAgICAgYnViYmxlczogZmFsc2UsXHJcbiAgICAgIGNhbmNlbGFibGU6IGZhbHNlLFxyXG4gICAgICBkZXRhaWw6IG51bGwsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJDdXN0b21FdmVudFwiKTtcclxuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoXHJcbiAgICAgIGV2ZW50LFxyXG4gICAgICBwYXJhbXMuYnViYmxlcyxcclxuICAgICAgcGFyYW1zLmNhbmNlbGFibGUsXHJcbiAgICAgIHBhcmFtcy5kZXRhaWxcclxuICAgICk7XHJcbiAgICByZXR1cm4gZXZ0O1xyXG4gIH1cclxuXHJcbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XHJcbn0pKCk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgZWxwcm90byA9IHdpbmRvdy5IVE1MRWxlbWVudC5wcm90b3R5cGU7XHJcbmNvbnN0IEhJRERFTiA9ICdoaWRkZW4nO1xyXG5cclxuaWYgKCEoSElEREVOIGluIGVscHJvdG8pKSB7XHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVscHJvdG8sIEhJRERFTiwge1xyXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShISURERU4pO1xyXG4gICAgfSxcclxuICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKEhJRERFTiwgJycpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKEhJRERFTik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSk7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG4vLyBwb2x5ZmlsbHMgSFRNTEVsZW1lbnQucHJvdG90eXBlLmNsYXNzTGlzdCBhbmQgRE9NVG9rZW5MaXN0XHJcbnJlcXVpcmUoJ2NsYXNzbGlzdC1wb2x5ZmlsbCcpO1xyXG4vLyBwb2x5ZmlsbHMgSFRNTEVsZW1lbnQucHJvdG90eXBlLmhpZGRlblxyXG5yZXF1aXJlKCcuL2VsZW1lbnQtaGlkZGVuJyk7XHJcblxyXG4vLyBwb2x5ZmlsbHMgTnVtYmVyLmlzTmFOKClcclxucmVxdWlyZShcIi4vbnVtYmVyLWlzLW5hblwiKTtcclxuXHJcbi8vIHBvbHlmaWxscyBDdXN0b21FdmVudFxyXG5yZXF1aXJlKFwiLi9jdXN0b20tZXZlbnRcIik7XHJcblxyXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24nKTtcclxucmVxdWlyZSgnY29yZS1qcy9mbi9hcnJheS9mcm9tJyk7IiwiTnVtYmVyLmlzTmFOID1cclxuICBOdW1iZXIuaXNOYU4gfHxcclxuICBmdW5jdGlvbiBpc05hTihpbnB1dCkge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxyXG4gICAgcmV0dXJuIHR5cGVvZiBpbnB1dCA9PT0gXCJudW1iZXJcIiAmJiBpbnB1dCAhPT0gaW5wdXQ7XHJcbiAgfTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSAoaHRtbERvY3VtZW50ID0gZG9jdW1lbnQpID0+IGh0bWxEb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4iLCJjb25zdCBhc3NpZ24gPSByZXF1aXJlKFwib2JqZWN0LWFzc2lnblwiKTtcclxuY29uc3QgcmVjZXB0b3IgPSByZXF1aXJlKFwicmVjZXB0b3JcIik7XHJcblxyXG4vKipcclxuICogQG5hbWUgc2VxdWVuY2VcclxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gc2VxIGFuIGFycmF5IG9mIGZ1bmN0aW9uc1xyXG4gKiBAcmV0dXJuIHsgY2xvc3VyZSB9IGNhbGxIb29rc1xyXG4gKi9cclxuLy8gV2UgdXNlIGEgbmFtZWQgZnVuY3Rpb24gaGVyZSBiZWNhdXNlIHdlIHdhbnQgaXQgdG8gaW5oZXJpdCBpdHMgbGV4aWNhbCBzY29wZVxyXG4vLyBmcm9tIHRoZSBiZWhhdmlvciBwcm9wcyBvYmplY3QsIG5vdCBmcm9tIHRoZSBtb2R1bGVcclxuY29uc3Qgc2VxdWVuY2UgPSAoLi4uc2VxKSA9PlxyXG4gIGZ1bmN0aW9uIGNhbGxIb29rcyh0YXJnZXQgPSBkb2N1bWVudC5ib2R5KSB7XHJcbiAgICBzZXEuZm9yRWFjaCgobWV0aG9kKSA9PiB7XHJcbiAgICAgIGlmICh0eXBlb2YgdGhpc1ttZXRob2RdID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCB0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIGJlaGF2aW9yXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBldmVudHNcclxuICogQHBhcmFtIHtvYmplY3Q/fSBwcm9wc1xyXG4gKiBAcmV0dXJuIHtyZWNlcHRvci5iZWhhdmlvcn1cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKGV2ZW50cywgcHJvcHMpID0+XHJcbiAgcmVjZXB0b3IuYmVoYXZpb3IoXHJcbiAgICBldmVudHMsXHJcbiAgICBhc3NpZ24oXHJcbiAgICAgIHtcclxuICAgICAgICBvbjogc2VxdWVuY2UoXCJpbml0XCIsIFwiYWRkXCIpLFxyXG4gICAgICAgIG9mZjogc2VxdWVuY2UoXCJ0ZWFyZG93blwiLCBcInJlbW92ZVwiKSxcclxuICAgICAgfSxcclxuICAgICAgcHJvcHNcclxuICAgIClcclxuICApO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmxldCBicmVha3BvaW50cyA9IHtcclxuICAneHMnOiAwLFxyXG4gICdzbSc6IDU3NixcclxuICAnbWQnOiA3NjgsXHJcbiAgJ2xnJzogOTkyLFxyXG4gICd4bCc6IDEyMDBcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYnJlYWtwb2ludHM7XHJcbiIsIi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTU3NDMzXHJcbmZ1bmN0aW9uIGlzRWxlbWVudEluVmlld3BvcnQgKGVsLCB3aW49d2luZG93LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2NFbD1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuICB2YXIgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgcmVjdC50b3AgPj0gMCAmJlxyXG4gICAgcmVjdC5sZWZ0ID49IDAgJiZcclxuICAgIHJlY3QuYm90dG9tIDw9ICh3aW4uaW5uZXJIZWlnaHQgfHwgZG9jRWwuY2xpZW50SGVpZ2h0KSAmJlxyXG4gICAgcmVjdC5yaWdodCA8PSAod2luLmlubmVyV2lkdGggfHwgZG9jRWwuY2xpZW50V2lkdGgpXHJcbiAgKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpc0VsZW1lbnRJblZpZXdwb3J0O1xyXG4iLCIvLyBpT1MgZGV0ZWN0aW9uIGZyb206IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzkwMzk4ODUvMTc3NzEwXHJcbmZ1bmN0aW9uIGlzSW9zRGV2aWNlKCkge1xyXG4gIHJldHVybiAoXHJcbiAgICB0eXBlb2YgbmF2aWdhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmXHJcbiAgICAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKGlQb2R8aVBob25lfGlQYWQpL2cpIHx8XHJcbiAgICAgIChuYXZpZ2F0b3IucGxhdGZvcm0gPT09IFwiTWFjSW50ZWxcIiAmJiBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAxKSkgJiZcclxuICAgICF3aW5kb3cuTVNTdHJlYW1cclxuICApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW9zRGV2aWNlO1xyXG4iLCIvKipcclxuICogQG5hbWUgaXNFbGVtZW50XHJcbiAqIEBkZXNjIHJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIGFyZ3VtZW50IGlzIGEgRE9NIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxyXG4gKiBAcmV0dXJuIHtib29sZWFufVxyXG4gKi9cclxuY29uc3QgaXNFbGVtZW50ID0gKHZhbHVlKSA9PlxyXG4gIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZS5ub2RlVHlwZSA9PT0gMTtcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBzZWxlY3RcclxuICogQGRlc2Mgc2VsZWN0cyBlbGVtZW50cyBmcm9tIHRoZSBET00gYnkgY2xhc3Mgc2VsZWN0b3Igb3IgSUQgc2VsZWN0b3IuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciAtIFRoZSBzZWxlY3RvciB0byB0cmF2ZXJzZSB0aGUgRE9NIHdpdGguXHJcbiAqIEBwYXJhbSB7RG9jdW1lbnR8SFRNTEVsZW1lbnQ/fSBjb250ZXh0IC0gVGhlIGNvbnRleHQgdG8gdHJhdmVyc2UgdGhlIERPTVxyXG4gKiAgIGluLiBJZiBub3QgcHJvdmlkZWQsIGl0IGRlZmF1bHRzIHRvIHRoZSBkb2N1bWVudC5cclxuICogQHJldHVybiB7SFRNTEVsZW1lbnRbXX0gLSBBbiBhcnJheSBvZiBET00gbm9kZXMgb3IgYW4gZW1wdHkgYXJyYXkuXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IChzZWxlY3RvciwgY29udGV4dCkgPT4ge1xyXG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIGlmICghY29udGV4dCB8fCAhaXNFbGVtZW50KGNvbnRleHQpKSB7XHJcbiAgICBjb250ZXh0ID0gd2luZG93LmRvY3VtZW50OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduXHJcbiAgfVxyXG5cclxuICBjb25zdCBzZWxlY3Rpb24gPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChzZWxlY3Rpb24pO1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IEVYUEFOREVEID0gJ2FyaWEtZXhwYW5kZWQnO1xyXG5jb25zdCBDT05UUk9MUyA9ICdhcmlhLWNvbnRyb2xzJztcclxuY29uc3QgSElEREVOID0gJ2FyaWEtaGlkZGVuJztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gKGJ1dHRvbiwgZXhwYW5kZWQpID0+IHtcclxuXHJcbiAgaWYgKHR5cGVvZiBleHBhbmRlZCAhPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICBleHBhbmRlZCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSAnZmFsc2UnO1xyXG4gIH1cclxuICBidXR0b24uc2V0QXR0cmlidXRlKEVYUEFOREVELCBleHBhbmRlZCk7XHJcbiAgY29uc3QgaWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKENPTlRST0xTKTtcclxuICBjb25zdCBjb250cm9scyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICBpZiAoIWNvbnRyb2xzKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICdObyB0b2dnbGUgdGFyZ2V0IGZvdW5kIHdpdGggaWQ6IFwiJyArIGlkICsgJ1wiJ1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGNvbnRyb2xzLnNldEF0dHJpYnV0ZShISURERU4sICFleHBhbmRlZCk7XHJcbiAgcmV0dXJuIGV4cGFuZGVkO1xyXG59O1xyXG4iXX0=
