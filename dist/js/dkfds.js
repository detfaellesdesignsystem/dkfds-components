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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var toggle = require('../utils/toggle');

var isElementInViewport = require('../utils/is-in-viewport');

var BUTTON = ".accordion-button[aria-controls]";
var EXPANDED = 'aria-expanded';
var MULTISELECTABLE = 'aria-multiselectable';
var MULTISELECTABLE_CLASS = 'accordion-multiselectable';
var BULK_FUNCTION_OPEN_TEXT = "Åbn alle";
var BULK_FUNCTION_CLOSE_TEXT = "Luk alle";
var BULK_FUNCTION_ACTION_ATTRIBUTE = "data-accordion-bulk-expand";

var Accordion = /*#__PURE__*/function () {
  function Accordion(accordion) {
    _classCallCheck(this, Accordion);

    if (!accordion) {
      throw new Error("Missing accordion group element");
    }

    this.accordion = accordion;
    var prevSibling = accordion.previousElementSibling;

    if (prevSibling !== null && prevSibling.classList.contains('accordion-bulk-button')) {
      this.bulkFunctionButton = prevSibling;
    }

    this.buttons = accordion.querySelectorAll(BUTTON);

    if (this.buttons.length == 0) {
      throw new Error("Missing accordion buttons");
    } else {
      this.eventClose = document.createEvent('Event');
      this.eventClose.initEvent('fds.accordion.close', true, true);
      this.eventOpen = document.createEvent('Event');
      this.eventOpen.initEvent('fds.accordion.open', true, true);
      this.init();
    }
  }

  _createClass(Accordion, [{
    key: "init",
    value: function init() {
      for (var i = 0; i < this.buttons.length; i++) {
        var currentButton = this.buttons[i]; // Verify state on button and state on panel

        var expanded = currentButton.getAttribute(EXPANDED) === 'true';
        toggleButton(currentButton, expanded);
        var that = this;
        currentButton.removeEventListener('click', that.eventOnClick, false);
        currentButton.addEventListener('click', that.eventOnClick, false);
        this.enableBulkFunction();
      }
    }
  }, {
    key: "enableBulkFunction",
    value: function enableBulkFunction() {
      if (this.bulkFunctionButton !== undefined) {
        this.bulkFunctionButton.addEventListener('click', function () {
          var accordion = this.nextElementSibling;
          var buttons = accordion.querySelectorAll(BUTTON);

          if (!accordion.classList.contains('accordion')) {
            throw new Error("Could not find accordion.");
          }

          if (buttons.length == 0) {
            throw new Error("Missing accordion buttons");
          }

          var expand = true;

          if (this.getAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE) === "false") {
            expand = false;
          }

          for (var i = 0; i < buttons.length; i++) {
            toggleButton(buttons[i], expand);
          }

          this.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, !expand);

          if (!expand === true) {
            this.innerText = BULK_FUNCTION_OPEN_TEXT;
          } else {
            this.innerText = BULK_FUNCTION_CLOSE_TEXT;
          }
        });
      }
    }
  }, {
    key: "eventOnClick",
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
  } else if (button.parentNode.parentNode.parentNode.classList.contains('accordion')) {
    accordion = button.parentNode.parentNode.parentNode;
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

  var multiselectable = false;

  if (accordion !== null && (accordion.getAttribute(MULTISELECTABLE) === 'true' || accordion.classList.contains(MULTISELECTABLE_CLASS))) {
    multiselectable = true;
    var bulkFunction = accordion.previousElementSibling;

    if (bulkFunction !== null && bulkFunction.classList.contains('accordion-bulk-button')) {
      var status = bulkFunction.getAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE);
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

      if (currentButtton !== button) {
        toggle(currentButtton, false);
        currentButtton.dispatchEvent(eventClose);
      }
    }
  }
};

module.exports = Accordion;

},{"../utils/is-in-viewport":99,"../utils/toggle":102}],73:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CheckboxToggleContent = /*#__PURE__*/function () {
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
    key: "init",
    value: function init(el) {
      this.checkboxEl = el;
      var that = this;
      this.checkboxEl.addEventListener('change', function (event) {
        that.toggle(that.checkboxEl);
      });
      this.toggle(this.checkboxEl);
    }
  }, {
    key: "toggle",
    value: function toggle(triggerEl) {
      var targetAttr = triggerEl.getAttribute(this.jsToggleTarget);
      var targetEl = document.getElementById(targetAttr);

      if (targetEl === null || targetEl === undefined) {
        throw new Error("Could not find panel element. Verify value of attribute " + this.jsToggleTarget);
      }

      if (triggerEl.checked) {
        this.open(triggerEl, targetEl);
      } else {
        this.close(triggerEl, targetEl);
      }
    }
  }, {
    key: "open",
    value: function open(triggerEl, targetEl) {
      if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
        triggerEl.setAttribute('data-aria-expanded', 'true');
        targetEl.classList.remove('collapsed');
        targetEl.setAttribute('aria-hidden', 'false');
        triggerEl.dispatchEvent(this.eventOpen);
      }
    }
  }, {
    key: "close",
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

},{}],74:[function(require,module,exports){
/**
 * Collapse/expand.
 */
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Collapse = /*#__PURE__*/function () {
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
    key: "toggleCollapse",
    value: function toggleCollapse(forceClose) {
      var targetAttr = this.triggerEl.getAttribute(this.jsCollapseTarget);
      this.targetEl = document.querySelector(targetAttr);

      if (this.targetEl === null || this.targetEl == undefined) {
        throw new Error("Could not find panel element. Verify value of attribute " + this.jsCollapseTarget);
      } //change state


      if (this.triggerEl.getAttribute('aria-expanded') === 'true' || this.triggerEl.getAttribute('aria-expanded') === undefined || forceClose) {
        //close
        this.animateCollapse();
      } else {
        //open
        this.animateExpand();
      }
    }
  }, {
    key: "toggle",
    value: function toggle() {
      if (this.triggerEl !== null && this.triggerEl !== undefined) {
        this.toggleCollapse();
      }
    }
  }, {
    key: "animateCollapse",
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
    key: "animateExpand",
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

},{}],75:[function(require,module,exports){
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

console.log();

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

},{"../config":89,"../events":91,"../utils/active-element":96,"../utils/behavior":97,"../utils/is-ios-device":100,"../utils/select":101,"receptor":64}],76:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Dropdown = require('./dropdown');

function DropdownSort(container) {
  this.container = container;
  this.button = container.getElementsByClassName('button-overflow-menu')[0]; // if no value is selected, choose first option

  if (!this.container.querySelector('.overflow-list li[aria-selected="true"]')) {
    this.container.querySelectorAll('.overflow-list li')[0].setAttribute('aria-selected', "true");
  }

  updateSelectedValue(this.container);
}

DropdownSort.prototype.init = function () {
  this.overflowMenu = new Dropdown(this.button);
  var sortingOptions = this.container.querySelectorAll('.overflow-list li button');

  for (var s = 0; s < sortingOptions.length; s++) {
    var option = sortingOptions[s];
    option.addEventListener('click', onOptionClick);
  }
};

var updateSelectedValue = function updateSelectedValue(container) {
  var selectedItem = container.querySelector('.overflow-list li[aria-selected="true"]');
  container.getElementsByClassName('button-overflow-menu')[0].getElementsByClassName('selected-value')[0].innerText = selectedItem.innerText;
};

var onOptionClick = function onOptionClick(event) {
  var li = this.parentNode;
  li.parentNode.querySelector('li[aria-selected="true"]').removeAttribute('aria-selected');
  li.setAttribute('aria-selected', 'true');
  var button = li.parentNode.parentNode.parentNode.getElementsByClassName('button-overflow-menu')[0];
  var eventSelected = new Event('fds.dropdown.selected');
  eventSelected.detail = this;
  button.dispatchEvent(eventSelected);
  updateSelectedValue(li.parentNode.parentNode.parentNode);
  var overflowMenu = new Dropdown(button);
  overflowMenu.hide();
};

var _default = DropdownSort;
exports["default"] = _default;

},{"./dropdown":77}],77:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var breakpoints = require('../utils/breakpoints');

var BUTTON = '.js-dropdown';
var jsDropdownCollapseModifier = 'js-dropdown--responsive-collapse'; //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).

var TARGET = 'data-js-target';
var eventCloseName = 'fds.dropdown.close';
var eventOpenName = 'fds.dropdown.open';

var Dropdown = /*#__PURE__*/function () {
  function Dropdown(el) {
    _classCallCheck(this, Dropdown);

    this.responsiveListCollapseEnabled = false;
    this.triggerEl = el;
    this.targetEl = null;
    this.init();

    if (this.triggerEl !== null && this.triggerEl !== undefined && this.targetEl !== null && this.targetEl !== undefined) {
      var that = this;

      if (this.triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive') || this.triggerEl.parentNode.classList.contains('overflow-menu--lg-no-responsive')) {
        this.responsiveListCollapseEnabled = true;
      } //Clicked outside dropdown -> close it


      document.getElementsByTagName('body')[0].removeEventListener('click', outsideClose);
      document.getElementsByTagName('body')[0].addEventListener('click', outsideClose); //Clicked on dropdown open button --> toggle it

      this.triggerEl.removeEventListener('click', toggleDropdown);
      this.triggerEl.addEventListener('click', toggleDropdown); // set aria-hidden correctly for screenreaders (Tringuide responsive)

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

      document.addEventListener('keyup', function (event) {
        var key = event.which || event.keyCode;

        if (key === 27) {
          closeAll(event);
        }
      });
    }
  }

  _createClass(Dropdown, [{
    key: "init",
    value: function init() {
      if (this.triggerEl === null || this.triggerEl === undefined) {
        throw new Error("Could not find button for Details component.");
      }

      var targetAttr = this.triggerEl.getAttribute(TARGET);

      if (targetAttr === null || targetAttr === undefined) {
        throw new Error('Attribute could not be found on details component: ' + TARGET);
      }

      var targetEl = document.getElementById(targetAttr.replace('#', ''));

      if (targetEl === null || targetEl === undefined) {
        throw new Error('Panel for Details component could not be found.');
      }

      this.targetEl = targetEl;
    }
  }, {
    key: "hide",
    value: function hide() {
      toggle(this.triggerEl);
    }
  }, {
    key: "show",
    value: function show() {
      toggle(this.triggerEl);
    }
  }]);

  return Dropdown;
}();
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
  var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var changed = false;
  var eventClose = document.createEvent('Event');
  eventClose.initEvent(eventCloseName, true, true);
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
  var eventClose = document.createEvent('Event');
  eventClose.initEvent(eventCloseName, true, true);
  var eventOpen = document.createEvent('Event');
  eventOpen.initEvent(eventOpenName, true, true);
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
      triggerEl.dispatchEvent(eventClose);
    } else {
      closeAll(); //open

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
  if (document.querySelector('body.mobile_nav-active') === null) {
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

},{"../utils/breakpoints":98}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ErrorSummary($module) {
  this.$module = $module;
}

ErrorSummary.prototype.init = function () {
  var $module = this.$module;

  if (!$module) {
    return;
  }

  $module.focus();
  $module.addEventListener('click', this.handleClick.bind(this));
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function Modal($modal) {
  this.$modal = $modal;
  var id = this.$modal.getAttribute('id');
  this.triggers = document.querySelectorAll('[data-module="modal"][data-target="' + id + '"]');
  window.modal = {
    "lastFocus": document.activeElement,
    "ignoreUtilFocusChanges": false
  };
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
  var modalElement = document.querySelector('.fds-modal[aria-hidden=false]');
  var currentModal = new Modal(document.querySelector('.fds-modal[aria-hidden=false]'));

  if (key === 27) {
    var possibleOverflowMenus = modalElement.querySelectorAll('.button-overflow-menu[aria-expanded="true"]');

    if (possibleOverflowMenus.length === 0) {
      currentModal.hide();
    }
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

var _default = Modal;
exports["default"] = _default;

},{}],80:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var forEach = require('array-foreach');

var select = require('../utils/select');

var dropdown = require('./dropdown');

var NAV = ".nav";
var NAV_LINKS = "".concat(NAV, " a");
var OPENERS = ".js-menu-open";
var CLOSE_BUTTON = ".js-menu-close";
var OVERLAY = ".overlay";
var CLOSERS = "".concat(CLOSE_BUTTON, ", .overlay");
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

var Navigation = /*#__PURE__*/function () {
  function Navigation() {
    _classCallCheck(this, Navigation);

    this.init();
    window.addEventListener('resize', resize, false);
  }

  _createClass(Navigation, [{
    key: "init",
    value: function init() {
      resize();
    }
  }, {
    key: "teardown",
    value: function teardown() {
      window.removeEventListener('resize', resize, false);
    }
  }]);

  return Navigation;
}();

module.exports = Navigation;

},{"../utils/select":101,"./dropdown":77,"array-foreach":1}],81:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RadioToggleGroup = /*#__PURE__*/function () {
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
    key: "init",
    value: function init(el) {
      this.radioGroup = el;
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
    }
  }, {
    key: "toggle",
    value: function toggle(triggerEl) {
      var targetAttr = triggerEl.getAttribute(this.jsToggleTarget);

      if (targetAttr !== null && targetAttr !== undefined && targetAttr !== "") {
        var targetEl = document.querySelector(targetAttr);

        if (targetEl === null || targetEl === undefined) {
          throw new Error("Could not find panel element. Verify value of attribute " + this.jsToggleTarget);
        }

        if (triggerEl.checked) {
          this.open(triggerEl, targetEl);
        } else {
          this.close(triggerEl, targetEl);
        }
      }
    }
  }, {
    key: "open",
    value: function open(triggerEl, targetEl) {
      if (triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined) {
        triggerEl.setAttribute('aria-expanded', 'true');
        targetEl.classList.remove('collapsed');
        targetEl.setAttribute('aria-hidden', 'false');
        triggerEl.dispatchEvent(this.eventOpen);
      }
    }
  }, {
    key: "close",
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

},{}],82:[function(require,module,exports){
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

},{}],83:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var dk = {
  "select_row": "Vælg række",
  "unselect_row": "Fravælg række",
  "select_all_rows": "Vælg alle rækker",
  "unselect_all_rows": "Fravælg alle rækker"
};

var TableSelectableRows = /*#__PURE__*/function () {
  function TableSelectableRows(table) {
    var strings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : dk;

    _classCallCheck(this, TableSelectableRows);

    this.table = table;
    dk = strings;
  }
  /**
   * Initialize eventlisteners for checkboxes in table
   */


  _createClass(TableSelectableRows, [{
    key: "init",
    value: function init() {
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
    }
    /**
     * Get group checkbox in table header
     * @returns element on true - false if not found
     */

  }, {
    key: "getGroupCheckbox",
    value: function getGroupCheckbox() {
      var checkbox = this.table.getElementsByTagName('thead')[0].getElementsByClassName('form-checkbox');

      if (checkbox.length === 0) {
        return false;
      }

      return checkbox[0];
    }
    /**
     * Get table body checkboxes
     * @returns HTMLCollection
     */

  }, {
    key: "getCheckboxList",
    value: function getCheckboxList() {
      return this.table.getElementsByTagName('tbody')[0].getElementsByClassName('form-checkbox');
    }
  }]);

  return TableSelectableRows;
}();
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

module.exports = TableSelectableRows;

},{}],84:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var receptor = require('receptor');

var SetTabIndex = function SetTabIndex(element) {
  _classCallCheck(this, SetTabIndex);

  element.addEventListener('click', function () {
    // NB: we know because of the selector we're delegating to below that the
    // href already begins with '#'
    var id = this.getAttribute('href').slice(1);
    var target = document.getElementById(id);

    if (target) {
      target.setAttribute('tabindex', 0);
      target.addEventListener('blur', receptor.once(function (event) {
        target.setAttribute('tabindex', -1);
      }));
    } else {// throw an error?
    }
  });
};

module.exports = SetTabIndex;

},{"receptor":64}],85:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var select = require('../utils/select');

var ResponsiveTable = /*#__PURE__*/function () {
  function ResponsiveTable(table) {
    _classCallCheck(this, ResponsiveTable);

    this.insertHeaderAsAttributes(table);
  } // Add data attributes needed for responsive mode.


  _createClass(ResponsiveTable, [{
    key: "insertHeaderAsAttributes",
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
                if (!cellEls[i].hasAttribute('data-title')) {
                  cellEls[i].setAttribute('data-title', headerCellEl.textContent);
                }
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

},{"../utils/select":101}],86:[function(require,module,exports){
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


    activateTab(tab, false);
  } // add eventlisteners on buttons


  for (var t = 0; t < this.tabs.length; t++) {
    addListeners(this.tabs[t]);
  }
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

function addListeners(tab) {
  tab.addEventListener('click', clickEventListener);
  tab.addEventListener('keydown', keydownEventListener);
  tab.addEventListener('keyup', keyupEventListener);
} // When a tab is clicked, activateTab is fired to activate it


function clickEventListener(event) {
  var tab = this;
  activateTab(tab, false);
} // Handle keydown on tabs


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
} // Handle keyup on tabs


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
      activateTab(event.target, true);
      break;
  }
} // When a tablist aria-orientation is set to vertical,
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
} // Either focus the next, previous, first, or last tab
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

  if (tabpanel === null) {
    throw new Error("Could not find accordion panel.");
  }

  tab.setAttribute('aria-selected', 'true');
  tabpanel.setAttribute('aria-hidden', 'false');
  tab.removeAttribute('tabindex'); // Set focus when required

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
    var tabpanelID = tab.getAttribute('aria-controls');
    var tabpanel = document.getElementById(tabpanelID);

    if (tabpanel === null) {
      throw new Error("Could not find tabpanel.");
    }

    tabpanel.setAttribute('aria-hidden', 'true');
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
} // Make a guess


function focusFirstTab(tab) {
  getAllTabsInList(tab)[0].focus();
} // Make a guess


function focusLastTab(tab) {
  var tabs = getAllTabsInList(tab);
  tabs[tabs.length - 1].focus();
}

module.exports = Tabnav;

},{}],87:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Toast = /*#__PURE__*/function () {
  function Toast(element) {
    _classCallCheck(this, Toast);

    this.element = element;
  }

  _createClass(Toast, [{
    key: "show",
    value: function show() {
      this.element.classList.remove('hide');
      this.element.classList.add('showing');
      this.element.getElementsByClassName('toast-close')[0].addEventListener('click', function () {
        var toast = this.parentNode.parentNode;
        new Toast(toast).hide();
      });
      requestAnimationFrame(showToast);
    }
  }, {
    key: "hide",
    value: function hide() {
      this.element.classList.remove('show');
      this.element.classList.add('hide');
    }
  }]);

  return Toast;
}();

function showToast() {
  var toasts = document.querySelectorAll('.toast.showing');

  for (var t = 0; t < toasts.length; t++) {
    var toast = toasts[t];
    toast.classList.remove('showing');
    toast.classList.add('show');
  }
}

module.exports = Toast;

},{}],88:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tooltip = /*#__PURE__*/function () {
  function Tooltip(element) {
    _classCallCheck(this, Tooltip);

    this.element = element;

    if (this.element.getAttribute('data-tooltip') === null) {
      throw new Error("Tooltip text is missing. Add attribute data-tooltip and the content of the tooltip as value.");
    }

    this.setEvents();
  }

  _createClass(Tooltip, [{
    key: "setEvents",
    value: function setEvents() {
      var that = this;
      this.element.addEventListener('mouseenter', function (e) {
        e.target.classList.add('tooltip-hover');
        setTimeout(function () {
          if (e.target.classList.contains('tooltip-hover')) {
            var element = e.target;
            if (element.getAttribute('aria-describedby') !== null) return;
            e.preventDefault();
            var pos = element.getAttribute('data-tooltip-position') || 'top';
            var tooltip = that.createTooltip(element, pos);
            document.body.appendChild(tooltip);
            that.positionAt(element, tooltip, pos);
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
        this.classList.remove('active');
      });

      if (this.element.getAttribute('data-tooltip-trigger') === 'click') {
        this.element.addEventListener('click', function (e) {
          var element = this;

          if (element.getAttribute('aria-describedby') === null) {
            var pos = element.getAttribute('data-tooltip-position') || 'top';
            var tooltip = that.createTooltip(element, pos);
            document.body.appendChild(tooltip);
            that.positionAt(element, tooltip, pos);
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
          that.closeAll();
        }
      });
    }
  }, {
    key: "closeAll",
    value: function closeAll() {
      var elements = document.querySelectorAll('.js-tooltip[aria-describedby]');

      for (var i = 0; i < elements.length; i++) {
        var popper = elements[i].getAttribute('aria-describedby');
        elements[i].removeAttribute('aria-describedby');
        document.body.removeChild(document.getElementById(popper));
      }
    }
  }, {
    key: "createTooltip",
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

  }, {
    key: "positionAt",
    value: function positionAt(parent, tooltip, pos) {
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
  }]);

  return Tooltip;
}();

module.exports = Tooltip;

},{}],89:[function(require,module,exports){
"use strict";

module.exports = {
  prefix: ''
};

},{}],90:[function(require,module,exports){
'use strict';

var _modal = _interopRequireDefault(require("./components/modal"));

var _dropdownSort = _interopRequireDefault(require("./components/dropdown-sort"));

var _errorSummary = _interopRequireDefault(require("./components/error-summary"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Collapse = require('./components/collapse');

var RadioToggleGroup = require('./components/radio-toggle-content');

var CheckboxToggleContent = require('./components/checkbox-toggle-content');

var Dropdown = require('./components/dropdown');

var Accordion = require('./components/accordion');

var Toast = require('./components/toast');

var ResponsiveTable = require('./components/table');

var TableSelectableRows = require('./components/selectable-table');

var Tabnav = require('./components/tabnav'); //const Details = require('./components/details');


var Tooltip = require('./components/tooltip');

var SetTabIndex = require('./components/skipnav');

var Navigation = require('./components/navigation');

var InputRegexMask = require('./components/regex-input-mask');

var datePicker = require('./components/date-picker');
/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */


require('./polyfills');

var init = function init(options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {}; // Allow the user to initialise FDS in only certain sections of the page
  // Defaults to the entire document if nothing is set.

  var scope = typeof options.scope !== 'undefined' ? options.scope : document;
  datePicker.on(scope);
  var jsSelectorRegex = scope.querySelectorAll('input[data-input-regex]');

  for (var c = 0; c < jsSelectorRegex.length; c++) {
    new InputRegexMask(jsSelectorRegex[c]);
  }

  var jsSelectorTabindex = scope.querySelectorAll('.skipnav[href^="#"]');

  for (var _c = 0; _c < jsSelectorTabindex.length; _c++) {
    new SetTabIndex(jsSelectorTabindex[_c]);
  }

  var jsSelectorTooltip = scope.getElementsByClassName('js-tooltip');

  for (var _c2 = 0; _c2 < jsSelectorTooltip.length; _c2++) {
    new Tooltip(jsSelectorTooltip[_c2]);
  }

  var jsSelectorTabnav = scope.getElementsByClassName('tabnav');

  for (var _c3 = 0; _c3 < jsSelectorTabnav.length; _c3++) {
    new Tabnav(jsSelectorTabnav[_c3]);
  }

  var jsSelectorAccordion = scope.getElementsByClassName('accordion');

  for (var _c4 = 0; _c4 < jsSelectorAccordion.length; _c4++) {
    new Accordion(jsSelectorAccordion[_c4]);
  }

  var jsSelectorAccordionBordered = scope.querySelectorAll('.accordion-bordered:not(.accordion)');

  for (var _c5 = 0; _c5 < jsSelectorAccordionBordered.length; _c5++) {
    new Accordion(jsSelectorAccordionBordered[_c5]);
  }

  var jsSelectableTable = scope.querySelectorAll('table.table--selectable');

  for (var _c6 = 0; _c6 < jsSelectableTable.length; _c6++) {
    new TableSelectableRows(jsSelectableTable[_c6]).init();
  }

  var jsSelectorTable = scope.querySelectorAll('table:not(.dataTable)');

  for (var _c7 = 0; _c7 < jsSelectorTable.length; _c7++) {
    new ResponsiveTable(jsSelectorTable[_c7]);
  }

  var jsSelectorCollapse = scope.getElementsByClassName('js-collapse');

  for (var _c8 = 0; _c8 < jsSelectorCollapse.length; _c8++) {
    new Collapse(jsSelectorCollapse[_c8]);
  }

  var jsSelectorRadioCollapse = scope.getElementsByClassName('js-radio-toggle-group');

  for (var _c9 = 0; _c9 < jsSelectorRadioCollapse.length; _c9++) {
    new RadioToggleGroup(jsSelectorRadioCollapse[_c9]);
  }

  var jsSelectorCheckboxCollapse = scope.getElementsByClassName('js-checkbox-toggle-content');

  for (var _c10 = 0; _c10 < jsSelectorCheckboxCollapse.length; _c10++) {
    new CheckboxToggleContent(jsSelectorCheckboxCollapse[_c10]);
  }

  var jsSelectorDropdownSort = scope.getElementsByClassName('overflow-menu--sort');

  for (var _c11 = 0; _c11 < jsSelectorDropdownSort.length; _c11++) {
    new _dropdownSort["default"](jsSelectorDropdownSort[_c11]).init();
  }

  var jsSelectorDropdown = scope.getElementsByClassName('js-dropdown');

  for (var _c12 = 0; _c12 < jsSelectorDropdown.length; _c12++) {
    new Dropdown(jsSelectorDropdown[_c12]);
  }

  var modals = scope.querySelectorAll('.fds-modal');

  for (var d = 0; d < modals.length; d++) {
    new _modal["default"](modals[d]).init();
  } // Find first error summary module to enhance.


  var $errorSummary = scope.querySelector('[data-module="error-summary"]');
  new _errorSummary["default"]($errorSummary).init();
  new Navigation();
};

module.exports = {
  init: init,
  Collapse: Collapse,
  RadioToggleGroup: RadioToggleGroup,
  CheckboxToggleContent: CheckboxToggleContent,
  Dropdown: Dropdown,
  DropdownSort: _dropdownSort["default"],
  ResponsiveTable: ResponsiveTable,
  Accordion: Accordion,
  Tabnav: Tabnav,
  Tooltip: Tooltip,
  SetTabIndex: SetTabIndex,
  Navigation: Navigation,
  InputRegexMask: InputRegexMask,
  Modal: _modal["default"],
  datePicker: datePicker,
  Toast: Toast,
  TableSelectableRows: TableSelectableRows,
  ErrorSummary: _errorSummary["default"]
};

},{"./components/accordion":72,"./components/checkbox-toggle-content":73,"./components/collapse":74,"./components/date-picker":75,"./components/dropdown":77,"./components/dropdown-sort":76,"./components/error-summary":78,"./components/modal":79,"./components/navigation":80,"./components/radio-toggle-content":81,"./components/regex-input-mask":82,"./components/selectable-table":83,"./components/skipnav":84,"./components/table":85,"./components/tabnav":86,"./components/toast":87,"./components/tooltip":88,"./polyfills":94}],91:[function(require,module,exports){
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

},{}],92:[function(require,module,exports){
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

},{}],93:[function(require,module,exports){
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

},{}],94:[function(require,module,exports){
'use strict'; // polyfills HTMLElement.prototype.classList and DOMTokenList

require('classlist-polyfill'); // polyfills HTMLElement.prototype.hidden


require('./element-hidden'); // polyfills Number.isNaN()


require("./number-is-nan"); // polyfills CustomEvent


require("./custom-event");

require('core-js/fn/object/assign');

require('core-js/fn/array/from');

},{"./custom-event":92,"./element-hidden":93,"./number-is-nan":95,"classlist-polyfill":2,"core-js/fn/array/from":3,"core-js/fn/object/assign":4}],95:[function(require,module,exports){
"use strict";

Number.isNaN = Number.isNaN || function isNaN(input) {
  // eslint-disable-next-line no-self-compare
  return typeof input === "number" && input !== input;
};

},{}],96:[function(require,module,exports){
"use strict";

module.exports = function () {
  var htmlDocument = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  return htmlDocument.activeElement;
};

},{}],97:[function(require,module,exports){
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

},{"object-assign":63,"receptor":64}],98:[function(require,module,exports){
'use strict';

var breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};
module.exports = breakpoints;

},{}],99:[function(require,module,exports){
"use strict";

// https://stackoverflow.com/a/7557433
function isElementInViewport(el) {
  var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  var docEl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.documentElement;
  var rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (win.innerHeight || docEl.clientHeight) && rect.right <= (win.innerWidth || docEl.clientWidth);
}

module.exports = isElementInViewport;

},{}],100:[function(require,module,exports){
"use strict";

// iOS detection from: http://stackoverflow.com/a/9039885/177710
function isIosDevice() {
  return typeof navigator !== "undefined" && (navigator.userAgent.match(/(iPod|iPhone|iPad)/g) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
}

module.exports = isIosDevice;

},{}],101:[function(require,module,exports){
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

},{}],102:[function(require,module,exports){
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

},{}]},{},[90])(90)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mdW5jdGlvbi10by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9lbGVtZW50LWNsb3Nlc3QvZWxlbWVudC1jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3Ivc3JjL2JlaGF2aW9yLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL3NyYy9jb21wb3NlLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL3NyYy9kZWxlZ2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9zcmMvZGVsZWdhdGVBbGwuanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3Ivc3JjL2lnbm9yZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9zcmMva2V5bWFwLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL3NyYy9vbmNlLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWNjb3JkaW9uLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jb2xsYXBzZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RhdGUtcGlja2VyLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZHJvcGRvd24tc29ydC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeS5qcyIsInNyYy9qcy9jb21wb25lbnRzL21vZGFsLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbmF2aWdhdGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzay5qcyIsInNyYy9qcy9jb21wb25lbnRzL3NlbGVjdGFibGUtdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy9za2lwbmF2LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJuYXYuanMiLCJzcmMvanMvY29tcG9uZW50cy90b2FzdC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3Rvb2x0aXAuanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2RrZmRzLmpzIiwic3JjL2pzL2V2ZW50cy5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvY3VzdG9tLWV2ZW50LmpzIiwic3JjL2pzL3BvbHlmaWxscy9lbGVtZW50LWhpZGRlbi5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvaW5kZXguanMiLCJzcmMvanMvcG9seWZpbGxzL251bWJlci1pcy1uYW4uanMiLCJzcmMvanMvdXRpbHMvYWN0aXZlLWVsZW1lbnQuanMiLCJzcmMvanMvdXRpbHMvYmVoYXZpb3IuanMiLCJzcmMvanMvdXRpbHMvYnJlYWtwb2ludHMuanMiLCJzcmMvanMvdXRpbHMvaXMtaW4tdmlld3BvcnQuanMiLCJzcmMvanMvdXRpbHMvaXMtaW9zLWRldmljZS5qcyIsInNyYy9qcy91dGlscy9zZWxlY3QuanMiLCJzcmMvanMvdXRpbHMvdG9nZ2xlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQVMsT0FBVCxDQUFrQixHQUFsQixFQUF1QixRQUF2QixFQUFpQyxPQUFqQyxFQUEwQztBQUN2RCxNQUFJLEdBQUcsQ0FBQyxPQUFSLEVBQWlCO0FBQ2IsSUFBQSxHQUFHLENBQUMsT0FBSixDQUFZLFFBQVosRUFBc0IsT0FBdEI7QUFDQTtBQUNIOztBQUNELE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQXhCLEVBQWdDLENBQUMsSUFBRSxDQUFuQyxFQUFzQztBQUNsQyxJQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsT0FBZCxFQUF1QixHQUFHLENBQUMsQ0FBRCxDQUExQixFQUErQixDQUEvQixFQUFrQyxHQUFsQztBQUNIO0FBQ0osQ0FSRDs7Ozs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBRUEsSUFBSSxjQUFjLE1BQU0sQ0FBQyxJQUF6QixFQUErQjtBQUUvQjtBQUNBO0FBQ0EsTUFBSSxFQUFFLGVBQWUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBakIsS0FDQSxRQUFRLENBQUMsZUFBVCxJQUE0QixFQUFFLGVBQWUsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsNEJBQXpCLEVBQXNELEdBQXRELENBQWpCLENBRGhDLEVBQzhHO0FBRTdHLGVBQVUsSUFBVixFQUFnQjtBQUVqQjs7QUFFQSxVQUFJLEVBQUUsYUFBYSxJQUFmLENBQUosRUFBMEI7O0FBRTFCLFVBQ0csYUFBYSxHQUFHLFdBRG5CO0FBQUEsVUFFRyxTQUFTLEdBQUcsV0FGZjtBQUFBLFVBR0csWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixDQUhsQjtBQUFBLFVBSUcsTUFBTSxHQUFHLE1BSlo7QUFBQSxVQUtHLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBRCxDQUFOLENBQWtCLElBQWxCLElBQTBCLFlBQVk7QUFDakQsZUFBTyxLQUFLLE9BQUwsQ0FBYSxZQUFiLEVBQTJCLEVBQTNCLENBQVA7QUFDQSxPQVBGO0FBQUEsVUFRRyxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQUQsQ0FBTCxDQUFpQixPQUFqQixJQUE0QixVQUFVLElBQVYsRUFBZ0I7QUFDMUQsWUFDRyxDQUFDLEdBQUcsQ0FEUDtBQUFBLFlBRUcsR0FBRyxHQUFHLEtBQUssTUFGZDs7QUFJQSxlQUFPLENBQUMsR0FBRyxHQUFYLEVBQWdCLENBQUMsRUFBakIsRUFBcUI7QUFDcEIsY0FBSSxDQUFDLElBQUksSUFBTCxJQUFhLEtBQUssQ0FBTCxNQUFZLElBQTdCLEVBQW1DO0FBQ2xDLG1CQUFPLENBQVA7QUFDQTtBQUNEOztBQUNELGVBQU8sQ0FBQyxDQUFSO0FBQ0EsT0FuQkYsQ0FvQkM7QUFwQkQ7QUFBQSxVQXFCRyxLQUFLLEdBQUcsU0FBUixLQUFRLENBQVUsSUFBVixFQUFnQixPQUFoQixFQUF5QjtBQUNsQyxhQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsYUFBSyxJQUFMLEdBQVksWUFBWSxDQUFDLElBQUQsQ0FBeEI7QUFDQSxhQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0EsT0F6QkY7QUFBQSxVQTBCRyxxQkFBcUIsR0FBRyxTQUF4QixxQkFBd0IsQ0FBVSxTQUFWLEVBQXFCLEtBQXJCLEVBQTRCO0FBQ3JELFlBQUksS0FBSyxLQUFLLEVBQWQsRUFBa0I7QUFDakIsZ0JBQU0sSUFBSSxLQUFKLENBQ0gsWUFERyxFQUVILDRDQUZHLENBQU47QUFJQTs7QUFDRCxZQUFJLEtBQUssSUFBTCxDQUFVLEtBQVYsQ0FBSixFQUFzQjtBQUNyQixnQkFBTSxJQUFJLEtBQUosQ0FDSCx1QkFERyxFQUVILHNDQUZHLENBQU47QUFJQTs7QUFDRCxlQUFPLFVBQVUsQ0FBQyxJQUFYLENBQWdCLFNBQWhCLEVBQTJCLEtBQTNCLENBQVA7QUFDQSxPQXhDRjtBQUFBLFVBeUNHLFNBQVMsR0FBRyxTQUFaLFNBQVksQ0FBVSxJQUFWLEVBQWdCO0FBQzdCLFlBQ0csY0FBYyxHQUFHLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsT0FBbEIsS0FBOEIsRUFBM0MsQ0FEcEI7QUFBQSxZQUVHLE9BQU8sR0FBRyxjQUFjLEdBQUcsY0FBYyxDQUFDLEtBQWYsQ0FBcUIsS0FBckIsQ0FBSCxHQUFpQyxFQUY1RDtBQUFBLFlBR0csQ0FBQyxHQUFHLENBSFA7QUFBQSxZQUlHLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFKakI7O0FBTUEsZUFBTyxDQUFDLEdBQUcsR0FBWCxFQUFnQixDQUFDLEVBQWpCLEVBQXFCO0FBQ3BCLGVBQUssSUFBTCxDQUFVLE9BQU8sQ0FBQyxDQUFELENBQWpCO0FBQ0E7O0FBQ0QsYUFBSyxnQkFBTCxHQUF3QixZQUFZO0FBQ25DLFVBQUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsT0FBbEIsRUFBMkIsS0FBSyxRQUFMLEVBQTNCO0FBQ0EsU0FGRDtBQUdBLE9BdERGO0FBQUEsVUF1REcsY0FBYyxHQUFHLFNBQVMsQ0FBQyxTQUFELENBQVQsR0FBdUIsRUF2RDNDO0FBQUEsVUF3REcsZUFBZSxHQUFHLFNBQWxCLGVBQWtCLEdBQVk7QUFDL0IsZUFBTyxJQUFJLFNBQUosQ0FBYyxJQUFkLENBQVA7QUFDQSxPQTFERixDQU5pQixDQWtFakI7QUFDQTs7O0FBQ0EsTUFBQSxLQUFLLENBQUMsU0FBRCxDQUFMLEdBQW1CLEtBQUssQ0FBQyxTQUFELENBQXhCOztBQUNBLE1BQUEsY0FBYyxDQUFDLElBQWYsR0FBc0IsVUFBVSxDQUFWLEVBQWE7QUFDbEMsZUFBTyxLQUFLLENBQUwsS0FBVyxJQUFsQjtBQUNBLE9BRkQ7O0FBR0EsTUFBQSxjQUFjLENBQUMsUUFBZixHQUEwQixVQUFVLEtBQVYsRUFBaUI7QUFDMUMsUUFBQSxLQUFLLElBQUksRUFBVDtBQUNBLGVBQU8scUJBQXFCLENBQUMsSUFBRCxFQUFPLEtBQVAsQ0FBckIsS0FBdUMsQ0FBQyxDQUEvQztBQUNBLE9BSEQ7O0FBSUEsTUFBQSxjQUFjLENBQUMsR0FBZixHQUFxQixZQUFZO0FBQ2hDLFlBQ0csTUFBTSxHQUFHLFNBRFo7QUFBQSxZQUVHLENBQUMsR0FBRyxDQUZQO0FBQUEsWUFHRyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BSGQ7QUFBQSxZQUlHLEtBSkg7QUFBQSxZQUtHLE9BQU8sR0FBRyxLQUxiOztBQU9BLFdBQUc7QUFDRixVQUFBLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBRCxDQUFOLEdBQVksRUFBcEI7O0FBQ0EsY0FBSSxxQkFBcUIsQ0FBQyxJQUFELEVBQU8sS0FBUCxDQUFyQixLQUF1QyxDQUFDLENBQTVDLEVBQStDO0FBQzlDLGlCQUFLLElBQUwsQ0FBVSxLQUFWO0FBQ0EsWUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBO0FBQ0QsU0FORCxRQU9PLEVBQUUsQ0FBRixHQUFNLENBUGI7O0FBU0EsWUFBSSxPQUFKLEVBQWE7QUFDWixlQUFLLGdCQUFMO0FBQ0E7QUFDRCxPQXBCRDs7QUFxQkEsTUFBQSxjQUFjLENBQUMsTUFBZixHQUF3QixZQUFZO0FBQ25DLFlBQ0csTUFBTSxHQUFHLFNBRFo7QUFBQSxZQUVHLENBQUMsR0FBRyxDQUZQO0FBQUEsWUFHRyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BSGQ7QUFBQSxZQUlHLEtBSkg7QUFBQSxZQUtHLE9BQU8sR0FBRyxLQUxiO0FBQUEsWUFNRyxLQU5IOztBQVFBLFdBQUc7QUFDRixVQUFBLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBRCxDQUFOLEdBQVksRUFBcEI7QUFDQSxVQUFBLEtBQUssR0FBRyxxQkFBcUIsQ0FBQyxJQUFELEVBQU8sS0FBUCxDQUE3Qjs7QUFDQSxpQkFBTyxLQUFLLEtBQUssQ0FBQyxDQUFsQixFQUFxQjtBQUNwQixpQkFBSyxNQUFMLENBQVksS0FBWixFQUFtQixDQUFuQjtBQUNBLFlBQUEsT0FBTyxHQUFHLElBQVY7QUFDQSxZQUFBLEtBQUssR0FBRyxxQkFBcUIsQ0FBQyxJQUFELEVBQU8sS0FBUCxDQUE3QjtBQUNBO0FBQ0QsU0FSRCxRQVNPLEVBQUUsQ0FBRixHQUFNLENBVGI7O0FBV0EsWUFBSSxPQUFKLEVBQWE7QUFDWixlQUFLLGdCQUFMO0FBQ0E7QUFDRCxPQXZCRDs7QUF3QkEsTUFBQSxjQUFjLENBQUMsTUFBZixHQUF3QixVQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBd0I7QUFDL0MsUUFBQSxLQUFLLElBQUksRUFBVDtBQUVBLFlBQ0csTUFBTSxHQUFHLEtBQUssUUFBTCxDQUFjLEtBQWQsQ0FEWjtBQUFBLFlBRUcsTUFBTSxHQUFHLE1BQU0sR0FDaEIsS0FBSyxLQUFLLElBQVYsSUFBa0IsUUFERixHQUdoQixLQUFLLEtBQUssS0FBVixJQUFtQixLQUxyQjs7QUFRQSxZQUFJLE1BQUosRUFBWTtBQUNYLGVBQUssTUFBTCxFQUFhLEtBQWI7QUFDQTs7QUFFRCxZQUFJLEtBQUssS0FBSyxJQUFWLElBQWtCLEtBQUssS0FBSyxLQUFoQyxFQUF1QztBQUN0QyxpQkFBTyxLQUFQO0FBQ0EsU0FGRCxNQUVPO0FBQ04saUJBQU8sQ0FBQyxNQUFSO0FBQ0E7QUFDRCxPQXBCRDs7QUFxQkEsTUFBQSxjQUFjLENBQUMsUUFBZixHQUEwQixZQUFZO0FBQ3JDLGVBQU8sS0FBSyxJQUFMLENBQVUsR0FBVixDQUFQO0FBQ0EsT0FGRDs7QUFJQSxVQUFJLE1BQU0sQ0FBQyxjQUFYLEVBQTJCO0FBQzFCLFlBQUksaUJBQWlCLEdBQUc7QUFDckIsVUFBQSxHQUFHLEVBQUUsZUFEZ0I7QUFFckIsVUFBQSxVQUFVLEVBQUUsSUFGUztBQUdyQixVQUFBLFlBQVksRUFBRTtBQUhPLFNBQXhCOztBQUtBLFlBQUk7QUFDSCxVQUFBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLFlBQXRCLEVBQW9DLGFBQXBDLEVBQW1ELGlCQUFuRDtBQUNBLFNBRkQsQ0FFRSxPQUFPLEVBQVAsRUFBVztBQUFFO0FBQ2Q7QUFDQTtBQUNBLGNBQUksRUFBRSxDQUFDLE1BQUgsS0FBYyxTQUFkLElBQTJCLEVBQUUsQ0FBQyxNQUFILEtBQWMsQ0FBQyxVQUE5QyxFQUEwRDtBQUN6RCxZQUFBLGlCQUFpQixDQUFDLFVBQWxCLEdBQStCLEtBQS9CO0FBQ0EsWUFBQSxNQUFNLENBQUMsY0FBUCxDQUFzQixZQUF0QixFQUFvQyxhQUFwQyxFQUFtRCxpQkFBbkQ7QUFDQTtBQUNEO0FBQ0QsT0FoQkQsTUFnQk8sSUFBSSxNQUFNLENBQUMsU0FBRCxDQUFOLENBQWtCLGdCQUF0QixFQUF3QztBQUM5QyxRQUFBLFlBQVksQ0FBQyxnQkFBYixDQUE4QixhQUE5QixFQUE2QyxlQUE3QztBQUNBO0FBRUEsS0F0S0EsRUFzS0MsTUFBTSxDQUFDLElBdEtSLENBQUQ7QUF3S0MsR0EvSzhCLENBaUwvQjtBQUNBOzs7QUFFQyxlQUFZO0FBQ1o7O0FBRUEsUUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBbEI7QUFFQSxJQUFBLFdBQVcsQ0FBQyxTQUFaLENBQXNCLEdBQXRCLENBQTBCLElBQTFCLEVBQWdDLElBQWhDLEVBTFksQ0FPWjtBQUNBOztBQUNBLFFBQUksQ0FBQyxXQUFXLENBQUMsU0FBWixDQUFzQixRQUF0QixDQUErQixJQUEvQixDQUFMLEVBQTJDO0FBQzFDLFVBQUksWUFBWSxHQUFHLFNBQWYsWUFBZSxDQUFTLE1BQVQsRUFBaUI7QUFDbkMsWUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsTUFBdkIsQ0FBZjs7QUFFQSxRQUFBLFlBQVksQ0FBQyxTQUFiLENBQXVCLE1BQXZCLElBQWlDLFVBQVMsS0FBVCxFQUFnQjtBQUNoRCxjQUFJLENBQUo7QUFBQSxjQUFPLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBdkI7O0FBRUEsZUFBSyxDQUFDLEdBQUcsQ0FBVCxFQUFZLENBQUMsR0FBRyxHQUFoQixFQUFxQixDQUFDLEVBQXRCLEVBQTBCO0FBQ3pCLFlBQUEsS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFELENBQWpCO0FBQ0EsWUFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLElBQWQsRUFBb0IsS0FBcEI7QUFDQTtBQUNELFNBUEQ7QUFRQSxPQVhEOztBQVlBLE1BQUEsWUFBWSxDQUFDLEtBQUQsQ0FBWjtBQUNBLE1BQUEsWUFBWSxDQUFDLFFBQUQsQ0FBWjtBQUNBOztBQUVELElBQUEsV0FBVyxDQUFDLFNBQVosQ0FBc0IsTUFBdEIsQ0FBNkIsSUFBN0IsRUFBbUMsS0FBbkMsRUExQlksQ0E0Qlo7QUFDQTs7QUFDQSxRQUFJLFdBQVcsQ0FBQyxTQUFaLENBQXNCLFFBQXRCLENBQStCLElBQS9CLENBQUosRUFBMEM7QUFDekMsVUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsTUFBckM7O0FBRUEsTUFBQSxZQUFZLENBQUMsU0FBYixDQUF1QixNQUF2QixHQUFnQyxVQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUI7QUFDdEQsWUFBSSxLQUFLLFNBQUwsSUFBa0IsQ0FBQyxLQUFLLFFBQUwsQ0FBYyxLQUFkLENBQUQsS0FBMEIsQ0FBQyxLQUFqRCxFQUF3RDtBQUN2RCxpQkFBTyxLQUFQO0FBQ0EsU0FGRCxNQUVPO0FBQ04saUJBQU8sT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFiLEVBQW1CLEtBQW5CLENBQVA7QUFDQTtBQUNELE9BTkQ7QUFRQTs7QUFFRCxJQUFBLFdBQVcsR0FBRyxJQUFkO0FBQ0EsR0E1Q0EsR0FBRDtBQThDQzs7Ozs7QUMvT0QsT0FBTyxDQUFDLG1DQUFELENBQVA7O0FBQ0EsT0FBTyxDQUFDLDhCQUFELENBQVA7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBTyxDQUFDLHFCQUFELENBQVAsQ0FBK0IsS0FBL0IsQ0FBcUMsSUFBdEQ7Ozs7O0FDRkEsT0FBTyxDQUFDLGlDQUFELENBQVA7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBTyxDQUFDLHFCQUFELENBQVAsQ0FBK0IsTUFBL0IsQ0FBc0MsTUFBdkQ7Ozs7O0FDREEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWM7QUFDN0IsTUFBSSxPQUFPLEVBQVAsSUFBYSxVQUFqQixFQUE2QixNQUFNLFNBQVMsQ0FBQyxFQUFFLEdBQUcscUJBQU4sQ0FBZjtBQUM3QixTQUFPLEVBQVA7QUFDRCxDQUhEOzs7OztBQ0FBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXRCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjO0FBQzdCLE1BQUksQ0FBQyxRQUFRLENBQUMsRUFBRCxDQUFiLEVBQW1CLE1BQU0sU0FBUyxDQUFDLEVBQUUsR0FBRyxvQkFBTixDQUFmO0FBQ25CLFNBQU8sRUFBUDtBQUNELENBSEQ7Ozs7O0FDREE7QUFDQTtBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQXZCOztBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXRCOztBQUNBLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyxzQkFBRCxDQUE3Qjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLFdBQVYsRUFBdUI7QUFDdEMsU0FBTyxVQUFVLEtBQVYsRUFBaUIsRUFBakIsRUFBcUIsU0FBckIsRUFBZ0M7QUFDckMsUUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUQsQ0FBakI7QUFDQSxRQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQUgsQ0FBckI7QUFDQSxRQUFJLEtBQUssR0FBRyxlQUFlLENBQUMsU0FBRCxFQUFZLE1BQVosQ0FBM0I7QUFDQSxRQUFJLEtBQUosQ0FKcUMsQ0FLckM7QUFDQTs7QUFDQSxRQUFJLFdBQVcsSUFBSSxFQUFFLElBQUksRUFBekIsRUFBNkIsT0FBTyxNQUFNLEdBQUcsS0FBaEIsRUFBdUI7QUFDbEQsTUFBQSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBTixDQUFULENBRGtELENBRWxEOztBQUNBLFVBQUksS0FBSyxJQUFJLEtBQWIsRUFBb0IsT0FBTyxJQUFQLENBSDhCLENBSXBEO0FBQ0MsS0FMRCxNQUtPLE9BQU0sTUFBTSxHQUFHLEtBQWYsRUFBc0IsS0FBSyxFQUEzQjtBQUErQixVQUFJLFdBQVcsSUFBSSxLQUFLLElBQUksQ0FBNUIsRUFBK0I7QUFDbkUsWUFBSSxDQUFDLENBQUMsS0FBRCxDQUFELEtBQWEsRUFBakIsRUFBcUIsT0FBTyxXQUFXLElBQUksS0FBZixJQUF3QixDQUEvQjtBQUN0QjtBQUZNO0FBRUwsV0FBTyxDQUFDLFdBQUQsSUFBZ0IsQ0FBQyxDQUF4QjtBQUNILEdBZkQ7QUFnQkQsQ0FqQkQ7Ozs7O0FDTEE7QUFDQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBRCxDQUFqQjs7QUFDQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBRCxDQUFQLENBQWtCLGFBQWxCLENBQVYsQyxDQUNBOzs7QUFDQSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsWUFBWTtBQUFFLFNBQU8sU0FBUDtBQUFtQixDQUFqQyxFQUFELENBQUgsSUFBNEMsV0FBdEQsQyxDQUVBOztBQUNBLElBQUksTUFBTSxHQUFHLFNBQVQsTUFBUyxDQUFVLEVBQVYsRUFBYyxHQUFkLEVBQW1CO0FBQzlCLE1BQUk7QUFDRixXQUFPLEVBQUUsQ0FBQyxHQUFELENBQVQ7QUFDRCxHQUZELENBRUUsT0FBTyxDQUFQLEVBQVU7QUFBRTtBQUFhO0FBQzVCLENBSkQ7O0FBTUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWM7QUFDN0IsTUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVY7QUFDQSxTQUFPLEVBQUUsS0FBSyxTQUFQLEdBQW1CLFdBQW5CLEdBQWlDLEVBQUUsS0FBSyxJQUFQLEdBQWMsTUFBZCxDQUN0QztBQURzQyxJQUVwQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFELENBQVgsRUFBaUIsR0FBakIsQ0FBbEIsS0FBNEMsUUFBNUMsR0FBdUQsQ0FBdkQsQ0FDRjtBQURFLElBRUEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFELENBQU4sQ0FDTDtBQURLLElBRUgsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUQsQ0FBUixLQUFnQixRQUFoQixJQUE0QixPQUFPLENBQUMsQ0FBQyxNQUFULElBQW1CLFVBQS9DLEdBQTRELFdBQTVELEdBQTBFLENBTjlFO0FBT0QsQ0FURDs7Ozs7QUNiQSxJQUFJLFFBQVEsR0FBRyxHQUFHLFFBQWxCOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjO0FBQzdCLFNBQU8sUUFBUSxDQUFDLElBQVQsQ0FBYyxFQUFkLEVBQWtCLEtBQWxCLENBQXdCLENBQXhCLEVBQTJCLENBQUMsQ0FBNUIsQ0FBUDtBQUNELENBRkQ7Ozs7O0FDRkEsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBRSxFQUFBLE9BQU8sRUFBRTtBQUFYLENBQTVCO0FBQ0EsSUFBSSxPQUFPLEdBQVAsSUFBYyxRQUFsQixFQUE0QixHQUFHLEdBQUcsSUFBTixDLENBQVk7OztBQ0R4Qzs7QUFDQSxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsY0FBRCxDQUE3Qjs7QUFDQSxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsa0JBQUQsQ0FBeEI7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxNQUFWLEVBQWtCLEtBQWxCLEVBQXlCLEtBQXpCLEVBQWdDO0FBQy9DLE1BQUksS0FBSyxJQUFJLE1BQWIsRUFBcUIsZUFBZSxDQUFDLENBQWhCLENBQWtCLE1BQWxCLEVBQTBCLEtBQTFCLEVBQWlDLFVBQVUsQ0FBQyxDQUFELEVBQUksS0FBSixDQUEzQyxFQUFyQixLQUNLLE1BQU0sQ0FBQyxLQUFELENBQU4sR0FBZ0IsS0FBaEI7QUFDTixDQUhEOzs7OztBQ0pBO0FBQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGVBQUQsQ0FBdkI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWMsSUFBZCxFQUFvQixNQUFwQixFQUE0QjtBQUMzQyxFQUFBLFNBQVMsQ0FBQyxFQUFELENBQVQ7QUFDQSxNQUFJLElBQUksS0FBSyxTQUFiLEVBQXdCLE9BQU8sRUFBUDs7QUFDeEIsVUFBUSxNQUFSO0FBQ0UsU0FBSyxDQUFMO0FBQVEsYUFBTyxVQUFVLENBQVYsRUFBYTtBQUMxQixlQUFPLEVBQUUsQ0FBQyxJQUFILENBQVEsSUFBUixFQUFjLENBQWQsQ0FBUDtBQUNELE9BRk87O0FBR1IsU0FBSyxDQUFMO0FBQVEsYUFBTyxVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQzdCLGVBQU8sRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixDQUFQO0FBQ0QsT0FGTzs7QUFHUixTQUFLLENBQUw7QUFBUSxhQUFPLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUI7QUFDaEMsZUFBTyxFQUFFLENBQUMsSUFBSCxDQUFRLElBQVIsRUFBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLENBQXBCLENBQVA7QUFDRCxPQUZPO0FBUFY7O0FBV0EsU0FBTztBQUFVO0FBQVYsS0FBeUI7QUFDOUIsV0FBTyxFQUFFLENBQUMsS0FBSCxDQUFTLElBQVQsRUFBZSxTQUFmLENBQVA7QUFDRCxHQUZEO0FBR0QsQ0FqQkQ7Ozs7O0FDRkE7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYztBQUM3QixNQUFJLEVBQUUsSUFBSSxTQUFWLEVBQXFCLE1BQU0sU0FBUyxDQUFDLDJCQUEyQixFQUE1QixDQUFmO0FBQ3JCLFNBQU8sRUFBUDtBQUNELENBSEQ7Ozs7O0FDREE7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFELENBQVAsQ0FBb0IsWUFBWTtBQUNoRCxTQUFPLE1BQU0sQ0FBQyxjQUFQLENBQXNCLEVBQXRCLEVBQTBCLEdBQTFCLEVBQStCO0FBQUUsSUFBQSxHQUFHLEVBQUUsZUFBWTtBQUFFLGFBQU8sQ0FBUDtBQUFXO0FBQWhDLEdBQS9CLEVBQW1FLENBQW5FLElBQXdFLENBQS9FO0FBQ0QsQ0FGaUIsQ0FBbEI7Ozs7O0FDREEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdEI7O0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQUQsQ0FBUCxDQUFxQixRQUFwQyxDLENBQ0E7OztBQUNBLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxRQUFELENBQVIsSUFBc0IsUUFBUSxDQUFDLFFBQVEsQ0FBQyxhQUFWLENBQXZDOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjO0FBQzdCLFNBQU8sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEVBQXZCLENBQUgsR0FBZ0MsRUFBekM7QUFDRCxDQUZEOzs7OztBQ0pBO0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FDRSwrRkFEZSxDQUVmLEtBRmUsQ0FFVCxHQUZTLENBQWpCOzs7OztBQ0RBLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFELENBQXBCOztBQUNBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFELENBQWxCOztBQUNBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFELENBQWxCOztBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFELENBQXRCOztBQUNBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFELENBQWpCOztBQUNBLElBQUksU0FBUyxHQUFHLFdBQWhCOztBQUVBLElBQUksT0FBTyxHQUFHLFNBQVYsT0FBVSxDQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsTUFBdEIsRUFBOEI7QUFDMUMsTUFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUEvQjtBQUNBLE1BQUksU0FBUyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBL0I7QUFDQSxNQUFJLFNBQVMsR0FBRyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQS9CO0FBQ0EsTUFBSSxRQUFRLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUE5QjtBQUNBLE1BQUksT0FBTyxHQUFHLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBN0I7QUFDQSxNQUFJLE1BQU0sR0FBRyxTQUFTLEdBQUcsTUFBSCxHQUFZLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBRCxDQUFOLEtBQWlCLE1BQU0sQ0FBQyxJQUFELENBQU4sR0FBZSxFQUFoQyxDQUFILEdBQXlDLENBQUMsTUFBTSxDQUFDLElBQUQsQ0FBTixJQUFnQixFQUFqQixFQUFxQixTQUFyQixDQUFwRjtBQUNBLE1BQUksT0FBTyxHQUFHLFNBQVMsR0FBRyxJQUFILEdBQVUsSUFBSSxDQUFDLElBQUQsQ0FBSixLQUFlLElBQUksQ0FBQyxJQUFELENBQUosR0FBYSxFQUE1QixDQUFqQztBQUNBLE1BQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFELENBQVAsS0FBdUIsT0FBTyxDQUFDLFNBQUQsQ0FBUCxHQUFxQixFQUE1QyxDQUFmO0FBQ0EsTUFBSSxHQUFKLEVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsR0FBbkI7QUFDQSxNQUFJLFNBQUosRUFBZSxNQUFNLEdBQUcsSUFBVDs7QUFDZixPQUFLLEdBQUwsSUFBWSxNQUFaLEVBQW9CO0FBQ2xCO0FBQ0EsSUFBQSxHQUFHLEdBQUcsQ0FBQyxTQUFELElBQWMsTUFBZCxJQUF3QixNQUFNLENBQUMsR0FBRCxDQUFOLEtBQWdCLFNBQTlDLENBRmtCLENBR2xCOztBQUNBLElBQUEsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLE1BQUgsR0FBWSxNQUFoQixFQUF3QixHQUF4QixDQUFOLENBSmtCLENBS2xCOztBQUNBLElBQUEsR0FBRyxHQUFHLE9BQU8sSUFBSSxHQUFYLEdBQWlCLEdBQUcsQ0FBQyxHQUFELEVBQU0sTUFBTixDQUFwQixHQUFvQyxRQUFRLElBQUksT0FBTyxHQUFQLElBQWMsVUFBMUIsR0FBdUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFWLEVBQWdCLEdBQWhCLENBQTFDLEdBQWlFLEdBQTNHLENBTmtCLENBT2xCOztBQUNBLFFBQUksTUFBSixFQUFZLFFBQVEsQ0FBQyxNQUFELEVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFsQyxDQUFSLENBUk0sQ0FTbEI7O0FBQ0EsUUFBSSxPQUFPLENBQUMsR0FBRCxDQUFQLElBQWdCLEdBQXBCLEVBQXlCLElBQUksQ0FBQyxPQUFELEVBQVUsR0FBVixFQUFlLEdBQWYsQ0FBSjtBQUN6QixRQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsR0FBRCxDQUFSLElBQWlCLEdBQWpDLEVBQXNDLFFBQVEsQ0FBQyxHQUFELENBQVIsR0FBZ0IsR0FBaEI7QUFDdkM7QUFDRixDQXhCRDs7QUF5QkEsTUFBTSxDQUFDLElBQVAsR0FBYyxJQUFkLEMsQ0FDQTs7QUFDQSxPQUFPLENBQUMsQ0FBUixHQUFZLENBQVosQyxDQUFpQjs7QUFDakIsT0FBTyxDQUFDLENBQVIsR0FBWSxDQUFaLEMsQ0FBaUI7O0FBQ2pCLE9BQU8sQ0FBQyxDQUFSLEdBQVksQ0FBWixDLENBQWlCOztBQUNqQixPQUFPLENBQUMsQ0FBUixHQUFZLENBQVosQyxDQUFpQjs7QUFDakIsT0FBTyxDQUFDLENBQVIsR0FBWSxFQUFaLEMsQ0FBaUI7O0FBQ2pCLE9BQU8sQ0FBQyxDQUFSLEdBQVksRUFBWixDLENBQWlCOztBQUNqQixPQUFPLENBQUMsQ0FBUixHQUFZLEVBQVosQyxDQUFpQjs7QUFDakIsT0FBTyxDQUFDLENBQVIsR0FBWSxHQUFaLEMsQ0FBaUI7O0FBQ2pCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQWpCOzs7OztBQzFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLElBQVYsRUFBZ0I7QUFDL0IsTUFBSTtBQUNGLFdBQU8sQ0FBQyxDQUFDLElBQUksRUFBYjtBQUNELEdBRkQsQ0FFRSxPQUFPLENBQVAsRUFBVTtBQUNWLFdBQU8sSUFBUDtBQUNEO0FBQ0YsQ0FORDs7Ozs7QUNBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFPLENBQUMsV0FBRCxDQUFQLENBQXFCLDJCQUFyQixFQUFrRCxRQUFRLENBQUMsUUFBM0QsQ0FBakI7Ozs7O0FDQUE7QUFDQSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFPLE1BQVAsSUFBaUIsV0FBakIsSUFBZ0MsTUFBTSxDQUFDLElBQVAsSUFBZSxJQUEvQyxHQUMxQixNQUQwQixHQUNqQixPQUFPLElBQVAsSUFBZSxXQUFmLElBQThCLElBQUksQ0FBQyxJQUFMLElBQWEsSUFBM0MsR0FBa0QsSUFBbEQsQ0FDWDtBQURXLEVBRVQsUUFBUSxDQUFDLGFBQUQsQ0FBUixFQUhKO0FBSUEsSUFBSSxPQUFPLEdBQVAsSUFBYyxRQUFsQixFQUE0QixHQUFHLEdBQUcsTUFBTixDLENBQWM7Ozs7O0FDTDFDLElBQUksY0FBYyxHQUFHLEdBQUcsY0FBeEI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWMsR0FBZCxFQUFtQjtBQUNsQyxTQUFPLGNBQWMsQ0FBQyxJQUFmLENBQW9CLEVBQXBCLEVBQXdCLEdBQXhCLENBQVA7QUFDRCxDQUZEOzs7OztBQ0RBLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQWhCOztBQUNBLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxrQkFBRCxDQUF4Qjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFPLENBQUMsZ0JBQUQsQ0FBUCxHQUE0QixVQUFVLE1BQVYsRUFBa0IsR0FBbEIsRUFBdUIsS0FBdkIsRUFBOEI7QUFDekUsU0FBTyxFQUFFLENBQUMsQ0FBSCxDQUFLLE1BQUwsRUFBYSxHQUFiLEVBQWtCLFVBQVUsQ0FBQyxDQUFELEVBQUksS0FBSixDQUE1QixDQUFQO0FBQ0QsQ0FGZ0IsR0FFYixVQUFVLE1BQVYsRUFBa0IsR0FBbEIsRUFBdUIsS0FBdkIsRUFBOEI7QUFDaEMsRUFBQSxNQUFNLENBQUMsR0FBRCxDQUFOLEdBQWMsS0FBZDtBQUNBLFNBQU8sTUFBUDtBQUNELENBTEQ7Ozs7O0FDRkEsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQUQsQ0FBUCxDQUFxQixRQUFwQzs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFRLElBQUksUUFBUSxDQUFDLGVBQXRDOzs7OztBQ0RBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLENBQUMsT0FBTyxDQUFDLGdCQUFELENBQVIsSUFBOEIsQ0FBQyxPQUFPLENBQUMsVUFBRCxDQUFQLENBQW9CLFlBQVk7QUFDOUUsU0FBTyxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUFPLENBQUMsZUFBRCxDQUFQLENBQXlCLEtBQXpCLENBQXRCLEVBQXVELEdBQXZELEVBQTREO0FBQUUsSUFBQSxHQUFHLEVBQUUsZUFBWTtBQUFFLGFBQU8sQ0FBUDtBQUFXO0FBQWhDLEdBQTVELEVBQWdHLENBQWhHLElBQXFHLENBQTVHO0FBQ0QsQ0FGK0MsQ0FBaEQ7Ozs7O0FDQUE7QUFDQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBRCxDQUFqQixDLENBQ0E7OztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BQU0sQ0FBQyxHQUFELENBQU4sQ0FBWSxvQkFBWixDQUFpQyxDQUFqQyxJQUFzQyxNQUF0QyxHQUErQyxVQUFVLEVBQVYsRUFBYztBQUM1RSxTQUFPLEdBQUcsQ0FBQyxFQUFELENBQUgsSUFBVyxRQUFYLEdBQXNCLEVBQUUsQ0FBQyxLQUFILENBQVMsRUFBVCxDQUF0QixHQUFxQyxNQUFNLENBQUMsRUFBRCxDQUFsRDtBQUNELENBRkQ7Ozs7O0FDSEE7QUFDQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBRCxDQUF2Qjs7QUFDQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBRCxDQUFQLENBQWtCLFVBQWxCLENBQWY7O0FBQ0EsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQXZCOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjO0FBQzdCLFNBQU8sRUFBRSxLQUFLLFNBQVAsS0FBcUIsU0FBUyxDQUFDLEtBQVYsS0FBb0IsRUFBcEIsSUFBMEIsVUFBVSxDQUFDLFFBQUQsQ0FBVixLQUF5QixFQUF4RSxDQUFQO0FBQ0QsQ0FGRDs7Ozs7OztBQ0xBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjO0FBQzdCLFNBQU8sUUFBTyxFQUFQLE1BQWMsUUFBZCxHQUF5QixFQUFFLEtBQUssSUFBaEMsR0FBdUMsT0FBTyxFQUFQLEtBQWMsVUFBNUQ7QUFDRCxDQUZEOzs7OztBQ0FBO0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdEI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxRQUFWLEVBQW9CLEVBQXBCLEVBQXdCLEtBQXhCLEVBQStCLE9BQS9CLEVBQXdDO0FBQ3ZELE1BQUk7QUFDRixXQUFPLE9BQU8sR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUQsQ0FBUixDQUFnQixDQUFoQixDQUFELEVBQXFCLEtBQUssQ0FBQyxDQUFELENBQTFCLENBQUwsR0FBc0MsRUFBRSxDQUFDLEtBQUQsQ0FBdEQsQ0FERSxDQUVKO0FBQ0MsR0FIRCxDQUdFLE9BQU8sQ0FBUCxFQUFVO0FBQ1YsUUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLFFBQUQsQ0FBbEI7QUFDQSxRQUFJLEdBQUcsS0FBSyxTQUFaLEVBQXVCLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSixDQUFTLFFBQVQsQ0FBRCxDQUFSO0FBQ3ZCLFVBQU0sQ0FBTjtBQUNEO0FBQ0YsQ0FURDs7O0FDRkE7O0FBQ0EsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGtCQUFELENBQXBCOztBQUNBLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxrQkFBRCxDQUF4Qjs7QUFDQSxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsc0JBQUQsQ0FBNUI7O0FBQ0EsSUFBSSxpQkFBaUIsR0FBRyxFQUF4QixDLENBRUE7O0FBQ0EsT0FBTyxDQUFDLFNBQUQsQ0FBUCxDQUFtQixpQkFBbkIsRUFBc0MsT0FBTyxDQUFDLFFBQUQsQ0FBUCxDQUFrQixVQUFsQixDQUF0QyxFQUFxRSxZQUFZO0FBQUUsU0FBTyxJQUFQO0FBQWMsQ0FBakc7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxXQUFWLEVBQXVCLElBQXZCLEVBQTZCLElBQTdCLEVBQW1DO0FBQ2xELEVBQUEsV0FBVyxDQUFDLFNBQVosR0FBd0IsTUFBTSxDQUFDLGlCQUFELEVBQW9CO0FBQUUsSUFBQSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUQsRUFBSSxJQUFKO0FBQWxCLEdBQXBCLENBQTlCO0FBQ0EsRUFBQSxjQUFjLENBQUMsV0FBRCxFQUFjLElBQUksR0FBRyxXQUFyQixDQUFkO0FBQ0QsQ0FIRDs7O0FDVEE7O0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQUQsQ0FBckI7O0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQUQsQ0FBckI7O0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGFBQUQsQ0FBdEI7O0FBQ0EsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQUQsQ0FBbEI7O0FBQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdkI7O0FBQ0EsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGdCQUFELENBQXpCOztBQUNBLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxzQkFBRCxDQUE1Qjs7QUFDQSxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsZUFBRCxDQUE1Qjs7QUFDQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBRCxDQUFQLENBQWtCLFVBQWxCLENBQWY7O0FBQ0EsSUFBSSxLQUFLLEdBQUcsRUFBRSxHQUFHLElBQUgsSUFBVyxVQUFVLEdBQUcsSUFBSCxFQUF2QixDQUFaLEMsQ0FBK0M7O0FBQy9DLElBQUksV0FBVyxHQUFHLFlBQWxCO0FBQ0EsSUFBSSxJQUFJLEdBQUcsTUFBWDtBQUNBLElBQUksTUFBTSxHQUFHLFFBQWI7O0FBRUEsSUFBSSxVQUFVLEdBQUcsU0FBYixVQUFhLEdBQVk7QUFBRSxTQUFPLElBQVA7QUFBYyxDQUE3Qzs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsV0FBdEIsRUFBbUMsSUFBbkMsRUFBeUMsT0FBekMsRUFBa0QsTUFBbEQsRUFBMEQsTUFBMUQsRUFBa0U7QUFDakYsRUFBQSxXQUFXLENBQUMsV0FBRCxFQUFjLElBQWQsRUFBb0IsSUFBcEIsQ0FBWDs7QUFDQSxNQUFJLFNBQVMsR0FBRyxTQUFaLFNBQVksQ0FBVSxJQUFWLEVBQWdCO0FBQzlCLFFBQUksQ0FBQyxLQUFELElBQVUsSUFBSSxJQUFJLEtBQXRCLEVBQTZCLE9BQU8sS0FBSyxDQUFDLElBQUQsQ0FBWjs7QUFDN0IsWUFBUSxJQUFSO0FBQ0UsV0FBSyxJQUFMO0FBQVcsZUFBTyxTQUFTLElBQVQsR0FBZ0I7QUFBRSxpQkFBTyxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsQ0FBUDtBQUFxQyxTQUE5RDs7QUFDWCxXQUFLLE1BQUw7QUFBYSxlQUFPLFNBQVMsTUFBVCxHQUFrQjtBQUFFLGlCQUFPLElBQUksV0FBSixDQUFnQixJQUFoQixFQUFzQixJQUF0QixDQUFQO0FBQXFDLFNBQWhFO0FBRmY7O0FBR0UsV0FBTyxTQUFTLE9BQVQsR0FBbUI7QUFBRSxhQUFPLElBQUksV0FBSixDQUFnQixJQUFoQixFQUFzQixJQUF0QixDQUFQO0FBQXFDLEtBQWpFO0FBQ0gsR0FORDs7QUFPQSxNQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsV0FBakI7QUFDQSxNQUFJLFVBQVUsR0FBRyxPQUFPLElBQUksTUFBNUI7QUFDQSxNQUFJLFVBQVUsR0FBRyxLQUFqQjtBQUNBLE1BQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFqQjtBQUNBLE1BQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxRQUFELENBQUwsSUFBbUIsS0FBSyxDQUFDLFdBQUQsQ0FBeEIsSUFBeUMsT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFELENBQXZFO0FBQ0EsTUFBSSxRQUFRLEdBQUcsT0FBTyxJQUFJLFNBQVMsQ0FBQyxPQUFELENBQW5DO0FBQ0EsTUFBSSxRQUFRLEdBQUcsT0FBTyxHQUFHLENBQUMsVUFBRCxHQUFjLFFBQWQsR0FBeUIsU0FBUyxDQUFDLFNBQUQsQ0FBckMsR0FBbUQsU0FBekU7QUFDQSxNQUFJLFVBQVUsR0FBRyxJQUFJLElBQUksT0FBUixHQUFrQixLQUFLLENBQUMsT0FBTixJQUFpQixPQUFuQyxHQUE2QyxPQUE5RDtBQUNBLE1BQUksT0FBSixFQUFhLEdBQWIsRUFBa0IsaUJBQWxCLENBakJpRixDQWtCakY7O0FBQ0EsTUFBSSxVQUFKLEVBQWdCO0FBQ2QsSUFBQSxpQkFBaUIsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsSUFBSSxJQUFKLEVBQWhCLENBQUQsQ0FBbEM7O0FBQ0EsUUFBSSxpQkFBaUIsS0FBSyxNQUFNLENBQUMsU0FBN0IsSUFBMEMsaUJBQWlCLENBQUMsSUFBaEUsRUFBc0U7QUFDcEU7QUFDQSxNQUFBLGNBQWMsQ0FBQyxpQkFBRCxFQUFvQixHQUFwQixFQUF5QixJQUF6QixDQUFkLENBRm9FLENBR3BFOztBQUNBLFVBQUksQ0FBQyxPQUFELElBQVksT0FBTyxpQkFBaUIsQ0FBQyxRQUFELENBQXhCLElBQXNDLFVBQXRELEVBQWtFLElBQUksQ0FBQyxpQkFBRCxFQUFvQixRQUFwQixFQUE4QixVQUE5QixDQUFKO0FBQ25FO0FBQ0YsR0EzQmdGLENBNEJqRjs7O0FBQ0EsTUFBSSxVQUFVLElBQUksT0FBZCxJQUF5QixPQUFPLENBQUMsSUFBUixLQUFpQixNQUE5QyxFQUFzRDtBQUNwRCxJQUFBLFVBQVUsR0FBRyxJQUFiOztBQUNBLElBQUEsUUFBUSxHQUFHLFNBQVMsTUFBVCxHQUFrQjtBQUFFLGFBQU8sT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFiLENBQVA7QUFBNEIsS0FBM0Q7QUFDRCxHQWhDZ0YsQ0FpQ2pGOzs7QUFDQSxNQUFJLENBQUMsQ0FBQyxPQUFELElBQVksTUFBYixNQUF5QixLQUFLLElBQUksVUFBVCxJQUF1QixDQUFDLEtBQUssQ0FBQyxRQUFELENBQXRELENBQUosRUFBdUU7QUFDckUsSUFBQSxJQUFJLENBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsUUFBbEIsQ0FBSjtBQUNELEdBcENnRixDQXFDakY7OztBQUNBLEVBQUEsU0FBUyxDQUFDLElBQUQsQ0FBVCxHQUFrQixRQUFsQjtBQUNBLEVBQUEsU0FBUyxDQUFDLEdBQUQsQ0FBVCxHQUFpQixVQUFqQjs7QUFDQSxNQUFJLE9BQUosRUFBYTtBQUNYLElBQUEsT0FBTyxHQUFHO0FBQ1IsTUFBQSxNQUFNLEVBQUUsVUFBVSxHQUFHLFFBQUgsR0FBYyxTQUFTLENBQUMsTUFBRCxDQURqQztBQUVSLE1BQUEsSUFBSSxFQUFFLE1BQU0sR0FBRyxRQUFILEdBQWMsU0FBUyxDQUFDLElBQUQsQ0FGM0I7QUFHUixNQUFBLE9BQU8sRUFBRTtBQUhELEtBQVY7QUFLQSxRQUFJLE1BQUosRUFBWSxLQUFLLEdBQUwsSUFBWSxPQUFaLEVBQXFCO0FBQy9CLFVBQUksRUFBRSxHQUFHLElBQUksS0FBVCxDQUFKLEVBQXFCLFFBQVEsQ0FBQyxLQUFELEVBQVEsR0FBUixFQUFhLE9BQU8sQ0FBQyxHQUFELENBQXBCLENBQVI7QUFDdEIsS0FGRCxNQUVPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBUixHQUFZLE9BQU8sQ0FBQyxDQUFSLElBQWEsS0FBSyxJQUFJLFVBQXRCLENBQWIsRUFBZ0QsSUFBaEQsRUFBc0QsT0FBdEQsQ0FBUDtBQUNSOztBQUNELFNBQU8sT0FBUDtBQUNELENBbkREOzs7OztBQ2pCQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBRCxDQUFQLENBQWtCLFVBQWxCLENBQWY7O0FBQ0EsSUFBSSxZQUFZLEdBQUcsS0FBbkI7O0FBRUEsSUFBSTtBQUNGLE1BQUksS0FBSyxHQUFHLENBQUMsQ0FBRCxFQUFJLFFBQUosR0FBWjs7QUFDQSxFQUFBLEtBQUssQ0FBQyxRQUFELENBQUwsR0FBa0IsWUFBWTtBQUFFLElBQUEsWUFBWSxHQUFHLElBQWY7QUFBc0IsR0FBdEQsQ0FGRSxDQUdGOzs7QUFDQSxFQUFBLEtBQUssQ0FBQyxJQUFOLENBQVcsS0FBWCxFQUFrQixZQUFZO0FBQUUsVUFBTSxDQUFOO0FBQVUsR0FBMUM7QUFDRCxDQUxELENBS0UsT0FBTyxDQUFQLEVBQVU7QUFBRTtBQUFhOztBQUUzQixNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLElBQVYsRUFBZ0IsV0FBaEIsRUFBNkI7QUFDNUMsTUFBSSxDQUFDLFdBQUQsSUFBZ0IsQ0FBQyxZQUFyQixFQUFtQyxPQUFPLEtBQVA7QUFDbkMsTUFBSSxJQUFJLEdBQUcsS0FBWDs7QUFDQSxNQUFJO0FBQ0YsUUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFELENBQVY7QUFDQSxRQUFJLElBQUksR0FBRyxHQUFHLENBQUMsUUFBRCxDQUFILEVBQVg7O0FBQ0EsSUFBQSxJQUFJLENBQUMsSUFBTCxHQUFZLFlBQVk7QUFBRSxhQUFPO0FBQUUsUUFBQSxJQUFJLEVBQUUsSUFBSSxHQUFHO0FBQWYsT0FBUDtBQUErQixLQUF6RDs7QUFDQSxJQUFBLEdBQUcsQ0FBQyxRQUFELENBQUgsR0FBZ0IsWUFBWTtBQUFFLGFBQU8sSUFBUDtBQUFjLEtBQTVDOztBQUNBLElBQUEsSUFBSSxDQUFDLEdBQUQsQ0FBSjtBQUNELEdBTkQsQ0FNRSxPQUFPLENBQVAsRUFBVTtBQUFFO0FBQWE7O0FBQzNCLFNBQU8sSUFBUDtBQUNELENBWEQ7Ozs7O0FDVkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsRUFBakI7Ozs7O0FDQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0FBakI7OztBQ0FBLGEsQ0FDQTs7QUFDQSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQUQsQ0FBekI7O0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFELENBQXJCOztBQUNBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBRCxDQUFsQjs7QUFDQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsZUFBRCxDQUFqQjs7QUFDQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsY0FBRCxDQUF0Qjs7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBRCxDQUFyQjs7QUFDQSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBckIsQyxDQUVBOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLENBQUMsT0FBRCxJQUFZLE9BQU8sQ0FBQyxVQUFELENBQVAsQ0FBb0IsWUFBWTtBQUMzRCxNQUFJLENBQUMsR0FBRyxFQUFSO0FBQ0EsTUFBSSxDQUFDLEdBQUcsRUFBUixDQUYyRCxDQUczRDs7QUFDQSxNQUFJLENBQUMsR0FBRyxNQUFNLEVBQWQ7QUFDQSxNQUFJLENBQUMsR0FBRyxzQkFBUjtBQUNBLEVBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLENBQVA7QUFDQSxFQUFBLENBQUMsQ0FBQyxLQUFGLENBQVEsRUFBUixFQUFZLE9BQVosQ0FBb0IsVUFBVSxDQUFWLEVBQWE7QUFBRSxJQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTyxDQUFQO0FBQVcsR0FBOUM7QUFDQSxTQUFPLE9BQU8sQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFQLENBQWUsQ0FBZixLQUFxQixDQUFyQixJQUEwQixNQUFNLENBQUMsSUFBUCxDQUFZLE9BQU8sQ0FBQyxFQUFELEVBQUssQ0FBTCxDQUFuQixFQUE0QixJQUE1QixDQUFpQyxFQUFqQyxLQUF3QyxDQUF6RTtBQUNELENBVDRCLENBQVosR0FTWixTQUFTLE1BQVQsQ0FBZ0IsTUFBaEIsRUFBd0IsTUFBeEIsRUFBZ0M7QUFBRTtBQUNyQyxNQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBRCxDQUFoQjtBQUNBLE1BQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxNQUFyQjtBQUNBLE1BQUksS0FBSyxHQUFHLENBQVo7QUFDQSxNQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBdEI7QUFDQSxNQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBakI7O0FBQ0EsU0FBTyxJQUFJLEdBQUcsS0FBZCxFQUFxQjtBQUNuQixRQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBTixDQUFWLENBQWY7QUFDQSxRQUFJLElBQUksR0FBRyxVQUFVLEdBQUcsT0FBTyxDQUFDLENBQUQsQ0FBUCxDQUFXLE1BQVgsQ0FBa0IsVUFBVSxDQUFDLENBQUQsQ0FBNUIsQ0FBSCxHQUFzQyxPQUFPLENBQUMsQ0FBRCxDQUFsRTtBQUNBLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFsQjtBQUNBLFFBQUksQ0FBQyxHQUFHLENBQVI7QUFDQSxRQUFJLEdBQUo7O0FBQ0EsV0FBTyxNQUFNLEdBQUcsQ0FBaEIsRUFBbUI7QUFDakIsTUFBQSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRixDQUFWO0FBQ0EsVUFBSSxDQUFDLFdBQUQsSUFBZ0IsTUFBTSxDQUFDLElBQVAsQ0FBWSxDQUFaLEVBQWUsR0FBZixDQUFwQixFQUF5QyxDQUFDLENBQUMsR0FBRCxDQUFELEdBQVMsQ0FBQyxDQUFDLEdBQUQsQ0FBVjtBQUMxQztBQUNGOztBQUFDLFNBQU8sQ0FBUDtBQUNILENBMUJnQixHQTBCYixPQTFCSjs7Ozs7QUNYQTtBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXRCOztBQUNBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQWpCOztBQUNBLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxrQkFBRCxDQUF6Qjs7QUFDQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsZUFBRCxDQUFQLENBQXlCLFVBQXpCLENBQWY7O0FBQ0EsSUFBSSxLQUFLLEdBQUcsU0FBUixLQUFRLEdBQVk7QUFBRTtBQUFhLENBQXZDOztBQUNBLElBQUksU0FBUyxHQUFHLFdBQWhCLEMsQ0FFQTs7QUFDQSxJQUFJLFdBQVUsR0FBRyxzQkFBWTtBQUMzQjtBQUNBLE1BQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQVAsQ0FBeUIsUUFBekIsQ0FBYjs7QUFDQSxNQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBcEI7QUFDQSxNQUFJLEVBQUUsR0FBRyxHQUFUO0FBQ0EsTUFBSSxFQUFFLEdBQUcsR0FBVDtBQUNBLE1BQUksY0FBSjtBQUNBLEVBQUEsTUFBTSxDQUFDLEtBQVAsQ0FBYSxPQUFiLEdBQXVCLE1BQXZCOztBQUNBLEVBQUEsT0FBTyxDQUFDLFNBQUQsQ0FBUCxDQUFtQixXQUFuQixDQUErQixNQUEvQjs7QUFDQSxFQUFBLE1BQU0sQ0FBQyxHQUFQLEdBQWEsYUFBYixDQVQyQixDQVNDO0FBQzVCO0FBQ0E7O0FBQ0EsRUFBQSxjQUFjLEdBQUcsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsUUFBdEM7QUFDQSxFQUFBLGNBQWMsQ0FBQyxJQUFmO0FBQ0EsRUFBQSxjQUFjLENBQUMsS0FBZixDQUFxQixFQUFFLEdBQUcsUUFBTCxHQUFnQixFQUFoQixHQUFxQixtQkFBckIsR0FBMkMsRUFBM0MsR0FBZ0QsU0FBaEQsR0FBNEQsRUFBakY7QUFDQSxFQUFBLGNBQWMsQ0FBQyxLQUFmO0FBQ0EsRUFBQSxXQUFVLEdBQUcsY0FBYyxDQUFDLENBQTVCOztBQUNBLFNBQU8sQ0FBQyxFQUFSO0FBQVksV0FBTyxXQUFVLENBQUMsU0FBRCxDQUFWLENBQXNCLFdBQVcsQ0FBQyxDQUFELENBQWpDLENBQVA7QUFBWjs7QUFDQSxTQUFPLFdBQVUsRUFBakI7QUFDRCxDQW5CRDs7QUFxQkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBTSxDQUFDLE1BQVAsSUFBaUIsU0FBUyxNQUFULENBQWdCLENBQWhCLEVBQW1CLFVBQW5CLEVBQStCO0FBQy9ELE1BQUksTUFBSjs7QUFDQSxNQUFJLENBQUMsS0FBSyxJQUFWLEVBQWdCO0FBQ2QsSUFBQSxLQUFLLENBQUMsU0FBRCxDQUFMLEdBQW1CLFFBQVEsQ0FBQyxDQUFELENBQTNCO0FBQ0EsSUFBQSxNQUFNLEdBQUcsSUFBSSxLQUFKLEVBQVQ7QUFDQSxJQUFBLEtBQUssQ0FBQyxTQUFELENBQUwsR0FBbUIsSUFBbkIsQ0FIYyxDQUlkOztBQUNBLElBQUEsTUFBTSxDQUFDLFFBQUQsQ0FBTixHQUFtQixDQUFuQjtBQUNELEdBTkQsTUFNTyxNQUFNLEdBQUcsV0FBVSxFQUFuQjs7QUFDUCxTQUFPLFVBQVUsS0FBSyxTQUFmLEdBQTJCLE1BQTNCLEdBQW9DLEdBQUcsQ0FBQyxNQUFELEVBQVMsVUFBVCxDQUE5QztBQUNELENBVkQ7Ozs7O0FDOUJBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXRCOztBQUNBLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxtQkFBRCxDQUE1Qjs7QUFDQSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsaUJBQUQsQ0FBekI7O0FBQ0EsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLGNBQWhCO0FBRUEsT0FBTyxDQUFDLENBQVIsR0FBWSxPQUFPLENBQUMsZ0JBQUQsQ0FBUCxHQUE0QixNQUFNLENBQUMsY0FBbkMsR0FBb0QsU0FBUyxjQUFULENBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCLFVBQTlCLEVBQTBDO0FBQ3hHLEVBQUEsUUFBUSxDQUFDLENBQUQsQ0FBUjtBQUNBLEVBQUEsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFELEVBQUksSUFBSixDQUFmO0FBQ0EsRUFBQSxRQUFRLENBQUMsVUFBRCxDQUFSO0FBQ0EsTUFBSSxjQUFKLEVBQW9CLElBQUk7QUFDdEIsV0FBTyxFQUFFLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxVQUFQLENBQVQ7QUFDRCxHQUZtQixDQUVsQixPQUFPLENBQVAsRUFBVTtBQUFFO0FBQWE7QUFDM0IsTUFBSSxTQUFTLFVBQVQsSUFBdUIsU0FBUyxVQUFwQyxFQUFnRCxNQUFNLFNBQVMsQ0FBQywwQkFBRCxDQUFmO0FBQ2hELE1BQUksV0FBVyxVQUFmLEVBQTJCLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTyxVQUFVLENBQUMsS0FBbEI7QUFDM0IsU0FBTyxDQUFQO0FBQ0QsQ0FWRDs7Ozs7QUNMQSxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsY0FBRCxDQUFoQjs7QUFDQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsY0FBRCxDQUF0Qjs7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQUQsQ0FBckI7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBTyxDQUFDLGdCQUFELENBQVAsR0FBNEIsTUFBTSxDQUFDLGdCQUFuQyxHQUFzRCxTQUFTLGdCQUFULENBQTBCLENBQTFCLEVBQTZCLFVBQTdCLEVBQXlDO0FBQzlHLEVBQUEsUUFBUSxDQUFDLENBQUQsQ0FBUjtBQUNBLE1BQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxVQUFELENBQWxCO0FBQ0EsTUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQWxCO0FBQ0EsTUFBSSxDQUFDLEdBQUcsQ0FBUjtBQUNBLE1BQUksQ0FBSjs7QUFDQSxTQUFPLE1BQU0sR0FBRyxDQUFoQjtBQUFtQixJQUFBLEVBQUUsQ0FBQyxDQUFILENBQUssQ0FBTCxFQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFGLENBQWhCLEVBQXVCLFVBQVUsQ0FBQyxDQUFELENBQWpDO0FBQW5COztBQUNBLFNBQU8sQ0FBUDtBQUNELENBUkQ7Ozs7O0FDSkEsT0FBTyxDQUFDLENBQVIsR0FBWSxNQUFNLENBQUMscUJBQW5COzs7OztBQ0FBO0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQUQsQ0FBakI7O0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdEI7O0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGVBQUQsQ0FBUCxDQUF5QixVQUF6QixDQUFmOztBQUNBLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxTQUF6Qjs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixNQUFNLENBQUMsY0FBUCxJQUF5QixVQUFVLENBQVYsRUFBYTtBQUNyRCxFQUFBLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBRCxDQUFaO0FBQ0EsTUFBSSxHQUFHLENBQUMsQ0FBRCxFQUFJLFFBQUosQ0FBUCxFQUFzQixPQUFPLENBQUMsQ0FBQyxRQUFELENBQVI7O0FBQ3RCLE1BQUksT0FBTyxDQUFDLENBQUMsV0FBVCxJQUF3QixVQUF4QixJQUFzQyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQXpELEVBQXNFO0FBQ3BFLFdBQU8sQ0FBQyxDQUFDLFdBQUYsQ0FBYyxTQUFyQjtBQUNEOztBQUFDLFNBQU8sQ0FBQyxZQUFZLE1BQWIsR0FBc0IsV0FBdEIsR0FBb0MsSUFBM0M7QUFDSCxDQU5EOzs7OztBQ05BLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFELENBQWpCOztBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQXZCOztBQUNBLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxtQkFBRCxDQUFQLENBQTZCLEtBQTdCLENBQW5COztBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQVAsQ0FBeUIsVUFBekIsQ0FBZjs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLE1BQVYsRUFBa0IsS0FBbEIsRUFBeUI7QUFDeEMsTUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQUQsQ0FBakI7QUFDQSxNQUFJLENBQUMsR0FBRyxDQUFSO0FBQ0EsTUFBSSxNQUFNLEdBQUcsRUFBYjtBQUNBLE1BQUksR0FBSjs7QUFDQSxPQUFLLEdBQUwsSUFBWSxDQUFaO0FBQWUsUUFBSSxHQUFHLElBQUksUUFBWCxFQUFxQixHQUFHLENBQUMsQ0FBRCxFQUFJLEdBQUosQ0FBSCxJQUFlLE1BQU0sQ0FBQyxJQUFQLENBQVksR0FBWixDQUFmO0FBQXBDLEdBTHdDLENBTXhDOzs7QUFDQSxTQUFPLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBdEI7QUFBeUIsUUFBSSxHQUFHLENBQUMsQ0FBRCxFQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFGLENBQWYsQ0FBUCxFQUE4QjtBQUNyRCxPQUFDLFlBQVksQ0FBQyxNQUFELEVBQVMsR0FBVCxDQUFiLElBQThCLE1BQU0sQ0FBQyxJQUFQLENBQVksR0FBWixDQUE5QjtBQUNEO0FBRkQ7O0FBR0EsU0FBTyxNQUFQO0FBQ0QsQ0FYRDs7Ozs7QUNMQTtBQUNBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyx5QkFBRCxDQUFuQjs7QUFDQSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsa0JBQUQsQ0FBekI7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBTSxDQUFDLElBQVAsSUFBZSxTQUFTLElBQVQsQ0FBYyxDQUFkLEVBQWlCO0FBQy9DLFNBQU8sS0FBSyxDQUFDLENBQUQsRUFBSSxXQUFKLENBQVo7QUFDRCxDQUZEOzs7OztBQ0pBLE9BQU8sQ0FBQyxDQUFSLEdBQVksR0FBRyxvQkFBZjs7Ozs7QUNBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLE1BQVYsRUFBa0IsS0FBbEIsRUFBeUI7QUFDeEMsU0FBTztBQUNMLElBQUEsVUFBVSxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQVgsQ0FEUDtBQUVMLElBQUEsWUFBWSxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQVgsQ0FGVDtBQUdMLElBQUEsUUFBUSxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQVgsQ0FITDtBQUlMLElBQUEsS0FBSyxFQUFFO0FBSkYsR0FBUDtBQU1ELENBUEQ7Ozs7O0FDQUEsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFdBQUQsQ0FBcEI7O0FBQ0EsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQUQsQ0FBbEI7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQUQsQ0FBakI7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQUQsQ0FBUCxDQUFrQixLQUFsQixDQUFWOztBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyx1QkFBRCxDQUF2Qjs7QUFDQSxJQUFJLFNBQVMsR0FBRyxVQUFoQjtBQUNBLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxTQUFOLEVBQWlCLEtBQWpCLENBQXVCLFNBQXZCLENBQVY7O0FBRUEsT0FBTyxDQUFDLFNBQUQsQ0FBUCxDQUFtQixhQUFuQixHQUFtQyxVQUFVLEVBQVYsRUFBYztBQUMvQyxTQUFPLFNBQVMsQ0FBQyxJQUFWLENBQWUsRUFBZixDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxDQUFDLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsQ0FBVixFQUFhLEdBQWIsRUFBa0IsR0FBbEIsRUFBdUIsSUFBdkIsRUFBNkI7QUFDN0MsTUFBSSxVQUFVLEdBQUcsT0FBTyxHQUFQLElBQWMsVUFBL0I7QUFDQSxNQUFJLFVBQUosRUFBZ0IsR0FBRyxDQUFDLEdBQUQsRUFBTSxNQUFOLENBQUgsSUFBb0IsSUFBSSxDQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsR0FBZCxDQUF4QjtBQUNoQixNQUFJLENBQUMsQ0FBQyxHQUFELENBQUQsS0FBVyxHQUFmLEVBQW9CO0FBQ3BCLE1BQUksVUFBSixFQUFnQixHQUFHLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FBSCxJQUFpQixJQUFJLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxDQUFDLENBQUMsR0FBRCxDQUFELEdBQVMsS0FBSyxDQUFDLENBQUMsR0FBRCxDQUFmLEdBQXVCLEdBQUcsQ0FBQyxJQUFKLENBQVMsTUFBTSxDQUFDLEdBQUQsQ0FBZixDQUFsQyxDQUFyQjs7QUFDaEIsTUFBSSxDQUFDLEtBQUssTUFBVixFQUFrQjtBQUNoQixJQUFBLENBQUMsQ0FBQyxHQUFELENBQUQsR0FBUyxHQUFUO0FBQ0QsR0FGRCxNQUVPLElBQUksQ0FBQyxJQUFMLEVBQVc7QUFDaEIsV0FBTyxDQUFDLENBQUMsR0FBRCxDQUFSO0FBQ0EsSUFBQSxJQUFJLENBQUMsQ0FBRCxFQUFJLEdBQUosRUFBUyxHQUFULENBQUo7QUFDRCxHQUhNLE1BR0EsSUFBSSxDQUFDLENBQUMsR0FBRCxDQUFMLEVBQVk7QUFDakIsSUFBQSxDQUFDLENBQUMsR0FBRCxDQUFELEdBQVMsR0FBVDtBQUNELEdBRk0sTUFFQTtBQUNMLElBQUEsSUFBSSxDQUFDLENBQUQsRUFBSSxHQUFKLEVBQVMsR0FBVCxDQUFKO0FBQ0QsR0FkNEMsQ0FlL0M7O0FBQ0MsQ0FoQkQsRUFnQkcsUUFBUSxDQUFDLFNBaEJaLEVBZ0J1QixTQWhCdkIsRUFnQmtDLFNBQVMsUUFBVCxHQUFvQjtBQUNwRCxTQUFPLE9BQU8sSUFBUCxJQUFlLFVBQWYsSUFBNkIsS0FBSyxHQUFMLENBQTdCLElBQTBDLFNBQVMsQ0FBQyxJQUFWLENBQWUsSUFBZixDQUFqRDtBQUNELENBbEJEOzs7OztBQ1pBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0IsQ0FBbEM7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQUQsQ0FBakI7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQUQsQ0FBUCxDQUFrQixhQUFsQixDQUFWOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjLEdBQWQsRUFBbUIsSUFBbkIsRUFBeUI7QUFDeEMsTUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksR0FBRyxFQUFILEdBQVEsRUFBRSxDQUFDLFNBQXJCLEVBQWdDLEdBQWhDLENBQWQsRUFBb0QsR0FBRyxDQUFDLEVBQUQsRUFBSyxHQUFMLEVBQVU7QUFBRSxJQUFBLFlBQVksRUFBRSxJQUFoQjtBQUFzQixJQUFBLEtBQUssRUFBRTtBQUE3QixHQUFWLENBQUg7QUFDckQsQ0FGRDs7Ozs7QUNKQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBRCxDQUFQLENBQXFCLE1BQXJCLENBQWI7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQUQsQ0FBakI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxHQUFWLEVBQWU7QUFDOUIsU0FBTyxNQUFNLENBQUMsR0FBRCxDQUFOLEtBQWdCLE1BQU0sQ0FBQyxHQUFELENBQU4sR0FBYyxHQUFHLENBQUMsR0FBRCxDQUFqQyxDQUFQO0FBQ0QsQ0FGRDs7Ozs7QUNGQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBRCxDQUFsQjs7QUFDQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBRCxDQUFwQjs7QUFDQSxJQUFJLE1BQU0sR0FBRyxvQkFBYjtBQUNBLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFELENBQU4sS0FBbUIsTUFBTSxDQUFDLE1BQUQsQ0FBTixHQUFpQixFQUFwQyxDQUFaO0FBRUEsQ0FBQyxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCO0FBQ3RDLFNBQU8sS0FBSyxDQUFDLEdBQUQsQ0FBTCxLQUFlLEtBQUssQ0FBQyxHQUFELENBQUwsR0FBYSxLQUFLLEtBQUssU0FBVixHQUFzQixLQUF0QixHQUE4QixFQUExRCxDQUFQO0FBQ0QsQ0FGRCxFQUVHLFVBRkgsRUFFZSxFQUZmLEVBRW1CLElBRm5CLENBRXdCO0FBQ3RCLEVBQUEsT0FBTyxFQUFFLElBQUksQ0FBQyxPQURRO0FBRXRCLEVBQUEsSUFBSSxFQUFFLE9BQU8sQ0FBQyxZQUFELENBQVAsR0FBd0IsTUFBeEIsR0FBaUMsUUFGakI7QUFHdEIsRUFBQSxTQUFTLEVBQUU7QUFIVyxDQUZ4Qjs7Ozs7QUNMQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsZUFBRCxDQUF2Qjs7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBRCxDQUFyQixDLENBQ0E7QUFDQTs7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxTQUFWLEVBQXFCO0FBQ3BDLFNBQU8sVUFBVSxJQUFWLEVBQWdCLEdBQWhCLEVBQXFCO0FBQzFCLFFBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBRCxDQUFSLENBQWQ7QUFDQSxRQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRCxDQUFqQjtBQUNBLFFBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFWO0FBQ0EsUUFBSSxDQUFKLEVBQU8sQ0FBUDtBQUNBLFFBQUksQ0FBQyxHQUFHLENBQUosSUFBUyxDQUFDLElBQUksQ0FBbEIsRUFBcUIsT0FBTyxTQUFTLEdBQUcsRUFBSCxHQUFRLFNBQXhCO0FBQ3JCLElBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFGLENBQWEsQ0FBYixDQUFKO0FBQ0EsV0FBTyxDQUFDLEdBQUcsTUFBSixJQUFjLENBQUMsR0FBRyxNQUFsQixJQUE0QixDQUFDLEdBQUcsQ0FBSixLQUFVLENBQXRDLElBQTJDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFGLENBQWEsQ0FBQyxHQUFHLENBQWpCLENBQUwsSUFBNEIsTUFBdkUsSUFBaUYsQ0FBQyxHQUFHLE1BQXJGLEdBQ0gsU0FBUyxHQUFHLENBQUMsQ0FBQyxNQUFGLENBQVMsQ0FBVCxDQUFILEdBQWlCLENBRHZCLEdBRUgsU0FBUyxHQUFHLENBQUMsQ0FBQyxLQUFGLENBQVEsQ0FBUixFQUFXLENBQUMsR0FBRyxDQUFmLENBQUgsR0FBdUIsQ0FBQyxDQUFDLEdBQUcsTUFBSixJQUFjLEVBQWYsS0FBc0IsQ0FBQyxHQUFHLE1BQTFCLElBQW9DLE9BRnhFO0FBR0QsR0FWRDtBQVdELENBWkQ7Ozs7O0FDSkEsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGVBQUQsQ0FBdkI7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQWY7QUFDQSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBZjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLEtBQVYsRUFBaUIsTUFBakIsRUFBeUI7QUFDeEMsRUFBQSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUQsQ0FBakI7QUFDQSxTQUFPLEtBQUssR0FBRyxDQUFSLEdBQVksR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFULEVBQWlCLENBQWpCLENBQWYsR0FBcUMsR0FBRyxDQUFDLEtBQUQsRUFBUSxNQUFSLENBQS9DO0FBQ0QsQ0FIRDs7Ozs7QUNIQTtBQUNBLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFoQjtBQUNBLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFqQjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYztBQUM3QixTQUFPLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFQLENBQUwsR0FBa0IsQ0FBbEIsR0FBc0IsQ0FBQyxFQUFFLEdBQUcsQ0FBTCxHQUFTLEtBQVQsR0FBaUIsSUFBbEIsRUFBd0IsRUFBeEIsQ0FBN0I7QUFDRCxDQUZEOzs7OztBQ0hBO0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQUQsQ0FBckI7O0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQUQsQ0FBckI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWM7QUFDN0IsU0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUQsQ0FBUixDQUFkO0FBQ0QsQ0FGRDs7Ozs7QUNIQTtBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxlQUFELENBQXZCOztBQUNBLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFmOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsRUFBVixFQUFjO0FBQzdCLFNBQU8sRUFBRSxHQUFHLENBQUwsR0FBUyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUQsQ0FBVixFQUFnQixnQkFBaEIsQ0FBWixHQUFnRCxDQUF2RCxDQUQ2QixDQUM2QjtBQUMzRCxDQUZEOzs7OztBQ0hBO0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQUQsQ0FBckI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBVSxFQUFWLEVBQWM7QUFDN0IsU0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUQsQ0FBUixDQUFiO0FBQ0QsQ0FGRDs7Ozs7QUNGQTtBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXRCLEMsQ0FDQTtBQUNBOzs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFVLEVBQVYsRUFBYyxDQUFkLEVBQWlCO0FBQ2hDLE1BQUksQ0FBQyxRQUFRLENBQUMsRUFBRCxDQUFiLEVBQW1CLE9BQU8sRUFBUDtBQUNuQixNQUFJLEVBQUosRUFBUSxHQUFSO0FBQ0EsTUFBSSxDQUFDLElBQUksUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQWhCLEtBQTZCLFVBQWxDLElBQWdELENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSCxDQUFRLEVBQVIsQ0FBUCxDQUE3RCxFQUFrRixPQUFPLEdBQVA7QUFDbEYsTUFBSSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBaEIsS0FBNEIsVUFBNUIsSUFBMEMsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFILENBQVEsRUFBUixDQUFQLENBQXZELEVBQTRFLE9BQU8sR0FBUDtBQUM1RSxNQUFJLENBQUMsQ0FBRCxJQUFNLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFoQixLQUE2QixVQUFuQyxJQUFpRCxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUgsQ0FBUSxFQUFSLENBQVAsQ0FBOUQsRUFBbUYsT0FBTyxHQUFQO0FBQ25GLFFBQU0sU0FBUyxDQUFDLHlDQUFELENBQWY7QUFDRCxDQVBEOzs7OztBQ0pBLElBQUksRUFBRSxHQUFHLENBQVQ7QUFDQSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTCxFQUFUOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsR0FBVixFQUFlO0FBQzlCLFNBQU8sVUFBVSxNQUFWLENBQWlCLEdBQUcsS0FBSyxTQUFSLEdBQW9CLEVBQXBCLEdBQXlCLEdBQTFDLEVBQStDLElBQS9DLEVBQXFELENBQUMsRUFBRSxFQUFGLEdBQU8sRUFBUixFQUFZLFFBQVosQ0FBcUIsRUFBckIsQ0FBckQsQ0FBUDtBQUNELENBRkQ7Ozs7O0FDRkEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFdBQUQsQ0FBUCxDQUFxQixLQUFyQixDQUFaOztBQUNBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxRQUFELENBQWpCOztBQUNBLElBQUksT0FBTSxHQUFHLE9BQU8sQ0FBQyxXQUFELENBQVAsQ0FBcUIsTUFBbEM7O0FBQ0EsSUFBSSxVQUFVLEdBQUcsT0FBTyxPQUFQLElBQWlCLFVBQWxDOztBQUVBLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQVUsSUFBVixFQUFnQjtBQUM5QyxTQUFPLEtBQUssQ0FBQyxJQUFELENBQUwsS0FBZ0IsS0FBSyxDQUFDLElBQUQsQ0FBTCxHQUNyQixVQUFVLElBQUksT0FBTSxDQUFDLElBQUQsQ0FBcEIsSUFBOEIsQ0FBQyxVQUFVLEdBQUcsT0FBSCxHQUFZLEdBQXZCLEVBQTRCLFlBQVksSUFBeEMsQ0FEekIsQ0FBUDtBQUVELENBSEQ7O0FBS0EsUUFBUSxDQUFDLEtBQVQsR0FBaUIsS0FBakI7Ozs7O0FDVkEsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQUQsQ0FBckI7O0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQUQsQ0FBUCxDQUFrQixVQUFsQixDQUFmOztBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXZCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQU8sQ0FBQyxTQUFELENBQVAsQ0FBbUIsaUJBQW5CLEdBQXVDLFVBQVUsRUFBVixFQUFjO0FBQ3BFLE1BQUksRUFBRSxJQUFJLFNBQVYsRUFBcUIsT0FBTyxFQUFFLENBQUMsUUFBRCxDQUFGLElBQ3ZCLEVBQUUsQ0FBQyxZQUFELENBRHFCLElBRXZCLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRCxDQUFSLENBRk87QUFHdEIsQ0FKRDs7O0FDSEE7O0FBQ0EsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQUQsQ0FBakI7O0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQUQsQ0FBckI7O0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBdEI7O0FBQ0EsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBbEI7O0FBQ0EsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGtCQUFELENBQXpCOztBQUNBLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXRCOztBQUNBLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxvQkFBRCxDQUE1Qjs7QUFDQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsNEJBQUQsQ0FBdkI7O0FBRUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFSLEdBQVksT0FBTyxDQUFDLENBQVIsR0FBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBRCxDQUFQLENBQTBCLFVBQVUsSUFBVixFQUFnQjtBQUFFLEVBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYO0FBQW1CLENBQS9ELENBQTFCLEVBQTRGLE9BQTVGLEVBQXFHO0FBQzFHO0FBQ0EsRUFBQSxJQUFJLEVBQUUsU0FBUyxJQUFULENBQWM7QUFBVTtBQUF4QixJQUF3RTtBQUM1RSxRQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsU0FBRCxDQUFoQjtBQUNBLFFBQUksQ0FBQyxHQUFHLE9BQU8sSUFBUCxJQUFlLFVBQWYsR0FBNEIsSUFBNUIsR0FBbUMsS0FBM0M7QUFDQSxRQUFJLElBQUksR0FBRyxTQUFTLENBQUMsTUFBckI7QUFDQSxRQUFJLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBUCxHQUFXLFNBQVMsQ0FBQyxDQUFELENBQXBCLEdBQTBCLFNBQXRDO0FBQ0EsUUFBSSxPQUFPLEdBQUcsS0FBSyxLQUFLLFNBQXhCO0FBQ0EsUUFBSSxLQUFLLEdBQUcsQ0FBWjtBQUNBLFFBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFELENBQXRCO0FBQ0EsUUFBSSxNQUFKLEVBQVksTUFBWixFQUFvQixJQUFwQixFQUEwQixRQUExQjtBQUNBLFFBQUksT0FBSixFQUFhLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBRCxFQUFRLElBQUksR0FBRyxDQUFQLEdBQVcsU0FBUyxDQUFDLENBQUQsQ0FBcEIsR0FBMEIsU0FBbEMsRUFBNkMsQ0FBN0MsQ0FBWCxDQVQrRCxDQVU1RTs7QUFDQSxRQUFJLE1BQU0sSUFBSSxTQUFWLElBQXVCLEVBQUUsQ0FBQyxJQUFJLEtBQUwsSUFBYyxXQUFXLENBQUMsTUFBRCxDQUEzQixDQUEzQixFQUFpRTtBQUMvRCxXQUFLLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBUCxDQUFZLENBQVosQ0FBWCxFQUEyQixNQUFNLEdBQUcsSUFBSSxDQUFKLEVBQXpDLEVBQWtELENBQUMsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQVQsRUFBUixFQUF5QixJQUE1RSxFQUFrRixLQUFLLEVBQXZGLEVBQTJGO0FBQ3pGLFFBQUEsY0FBYyxDQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBRCxFQUFXLEtBQVgsRUFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBTixFQUFhLEtBQWIsQ0FBbEIsRUFBdUMsSUFBdkMsQ0FBUCxHQUFzRCxJQUFJLENBQUMsS0FBbEYsQ0FBZDtBQUNEO0FBQ0YsS0FKRCxNQUlPO0FBQ0wsTUFBQSxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFILENBQWpCOztBQUNBLFdBQUssTUFBTSxHQUFHLElBQUksQ0FBSixDQUFNLE1BQU4sQ0FBZCxFQUE2QixNQUFNLEdBQUcsS0FBdEMsRUFBNkMsS0FBSyxFQUFsRCxFQUFzRDtBQUNwRCxRQUFBLGNBQWMsQ0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFELENBQUYsRUFBVyxLQUFYLENBQVIsR0FBNEIsQ0FBQyxDQUFDLEtBQUQsQ0FBcEQsQ0FBZDtBQUNEO0FBQ0Y7O0FBQ0QsSUFBQSxNQUFNLENBQUMsTUFBUCxHQUFnQixLQUFoQjtBQUNBLFdBQU8sTUFBUDtBQUNEO0FBekJ5RyxDQUFyRyxDQUFQOzs7OztBQ1ZBO0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQUQsQ0FBckI7O0FBRUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFSLEdBQVksT0FBTyxDQUFDLENBQXJCLEVBQXdCLFFBQXhCLEVBQWtDO0FBQUUsRUFBQSxNQUFNLEVBQUUsT0FBTyxDQUFDLGtCQUFEO0FBQWpCLENBQWxDLENBQVA7OztBQ0hBOztBQUNBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQVAsQ0FBd0IsSUFBeEIsQ0FBVixDLENBRUE7OztBQUNBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQLENBQTBCLE1BQTFCLEVBQWtDLFFBQWxDLEVBQTRDLFVBQVUsUUFBVixFQUFvQjtBQUM5RCxPQUFLLEVBQUwsR0FBVSxNQUFNLENBQUMsUUFBRCxDQUFoQixDQUQ4RCxDQUNsQzs7QUFDNUIsT0FBSyxFQUFMLEdBQVUsQ0FBVixDQUY4RCxDQUVsQztBQUM5QjtBQUNDLENBSkQsRUFJRyxZQUFZO0FBQ2IsTUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFiO0FBQ0EsTUFBSSxLQUFLLEdBQUcsS0FBSyxFQUFqQjtBQUNBLE1BQUksS0FBSjtBQUNBLE1BQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxNQUFmLEVBQXVCLE9BQU87QUFBRSxJQUFBLEtBQUssRUFBRSxTQUFUO0FBQW9CLElBQUEsSUFBSSxFQUFFO0FBQTFCLEdBQVA7QUFDdkIsRUFBQSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUQsRUFBSSxLQUFKLENBQVg7QUFDQSxPQUFLLEVBQUwsSUFBVyxLQUFLLENBQUMsTUFBakI7QUFDQSxTQUFPO0FBQUUsSUFBQSxLQUFLLEVBQUUsS0FBVDtBQUFnQixJQUFBLElBQUksRUFBRTtBQUF0QixHQUFQO0FBQ0QsQ0FaRDs7Ozs7QUNKQTtBQUVBLENBQUMsVUFBVSxZQUFWLEVBQXdCO0FBQ3hCLE1BQUksT0FBTyxZQUFZLENBQUMsT0FBcEIsS0FBZ0MsVUFBcEMsRUFBZ0Q7QUFDL0MsSUFBQSxZQUFZLENBQUMsT0FBYixHQUF1QixZQUFZLENBQUMsaUJBQWIsSUFBa0MsWUFBWSxDQUFDLGtCQUEvQyxJQUFxRSxZQUFZLENBQUMscUJBQWxGLElBQTJHLFNBQVMsT0FBVCxDQUFpQixRQUFqQixFQUEyQjtBQUM1SixVQUFJLE9BQU8sR0FBRyxJQUFkO0FBQ0EsVUFBSSxRQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUixJQUFvQixPQUFPLENBQUMsYUFBN0IsRUFBNEMsZ0JBQTVDLENBQTZELFFBQTdELENBQWY7QUFDQSxVQUFJLEtBQUssR0FBRyxDQUFaOztBQUVBLGFBQU8sUUFBUSxDQUFDLEtBQUQsQ0FBUixJQUFtQixRQUFRLENBQUMsS0FBRCxDQUFSLEtBQW9CLE9BQTlDLEVBQXVEO0FBQ3RELFVBQUUsS0FBRjtBQUNBOztBQUVELGFBQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFELENBQVQsQ0FBZDtBQUNBLEtBVkQ7QUFXQTs7QUFFRCxNQUFJLE9BQU8sWUFBWSxDQUFDLE9BQXBCLEtBQWdDLFVBQXBDLEVBQWdEO0FBQy9DLElBQUEsWUFBWSxDQUFDLE9BQWIsR0FBdUIsU0FBUyxPQUFULENBQWlCLFFBQWpCLEVBQTJCO0FBQ2pELFVBQUksT0FBTyxHQUFHLElBQWQ7O0FBRUEsYUFBTyxPQUFPLElBQUksT0FBTyxDQUFDLFFBQVIsS0FBcUIsQ0FBdkMsRUFBMEM7QUFDekMsWUFBSSxPQUFPLENBQUMsT0FBUixDQUFnQixRQUFoQixDQUFKLEVBQStCO0FBQzlCLGlCQUFPLE9BQVA7QUFDQTs7QUFFRCxRQUFBLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBbEI7QUFDQTs7QUFFRCxhQUFPLElBQVA7QUFDQSxLQVpEO0FBYUE7QUFDRCxDQTlCRCxFQThCRyxNQUFNLENBQUMsT0FBUCxDQUFlLFNBOUJsQjs7Ozs7QUNGQTtBQUVBLENBQUMsWUFBWTtBQUVYLE1BQUksd0JBQXdCLEdBQUc7QUFDN0IsSUFBQSxRQUFRLEVBQUUsUUFEbUI7QUFFN0IsSUFBQSxJQUFJLEVBQUU7QUFDSixTQUFHLFFBREM7QUFFSixTQUFHLE1BRkM7QUFHSixTQUFHLFdBSEM7QUFJSixTQUFHLEtBSkM7QUFLSixVQUFJLE9BTEE7QUFNSixVQUFJLE9BTkE7QUFPSixVQUFJLE9BUEE7QUFRSixVQUFJLFNBUkE7QUFTSixVQUFJLEtBVEE7QUFVSixVQUFJLE9BVkE7QUFXSixVQUFJLFVBWEE7QUFZSixVQUFJLFFBWkE7QUFhSixVQUFJLFNBYkE7QUFjSixVQUFJLFlBZEE7QUFlSixVQUFJLFFBZkE7QUFnQkosVUFBSSxZQWhCQTtBQWlCSixVQUFJLEdBakJBO0FBa0JKLFVBQUksUUFsQkE7QUFtQkosVUFBSSxVQW5CQTtBQW9CSixVQUFJLEtBcEJBO0FBcUJKLFVBQUksTUFyQkE7QUFzQkosVUFBSSxXQXRCQTtBQXVCSixVQUFJLFNBdkJBO0FBd0JKLFVBQUksWUF4QkE7QUF5QkosVUFBSSxXQXpCQTtBQTBCSixVQUFJLFFBMUJBO0FBMkJKLFVBQUksT0EzQkE7QUE0QkosVUFBSSxTQTVCQTtBQTZCSixVQUFJLGFBN0JBO0FBOEJKLFVBQUksUUE5QkE7QUErQkosVUFBSSxRQS9CQTtBQWdDSixVQUFJLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FoQ0E7QUFpQ0osVUFBSSxDQUFDLEdBQUQsRUFBTSxHQUFOLENBakNBO0FBa0NKLFVBQUksQ0FBQyxHQUFELEVBQU0sR0FBTixDQWxDQTtBQW1DSixVQUFJLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FuQ0E7QUFvQ0osVUFBSSxDQUFDLEdBQUQsRUFBTSxHQUFOLENBcENBO0FBcUNKLFVBQUksQ0FBQyxHQUFELEVBQU0sR0FBTixDQXJDQTtBQXNDSixVQUFJLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0F0Q0E7QUF1Q0osVUFBSSxDQUFDLEdBQUQsRUFBTSxHQUFOLENBdkNBO0FBd0NKLFVBQUksQ0FBQyxHQUFELEVBQU0sR0FBTixDQXhDQTtBQXlDSixVQUFJLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0F6Q0E7QUEwQ0osVUFBSSxJQTFDQTtBQTJDSixVQUFJLGFBM0NBO0FBNENKLFdBQUssU0E1Q0Q7QUE2Q0osV0FBSyxZQTdDRDtBQThDSixXQUFLLFlBOUNEO0FBK0NKLFdBQUssWUEvQ0Q7QUFnREosV0FBSyxVQWhERDtBQWlESixXQUFLLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FqREQ7QUFrREosV0FBSyxDQUFDLEdBQUQsRUFBTSxHQUFOLENBbEREO0FBbURKLFdBQUssQ0FBQyxHQUFELEVBQU0sR0FBTixDQW5ERDtBQW9ESixXQUFLLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FwREQ7QUFxREosV0FBSyxDQUFDLEdBQUQsRUFBTSxHQUFOLENBckREO0FBc0RKLFdBQUssQ0FBQyxHQUFELEVBQU0sR0FBTixDQXRERDtBQXVESixXQUFLLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0F2REQ7QUF3REosV0FBSyxDQUFDLEdBQUQsRUFBTSxHQUFOLENBeEREO0FBeURKLFdBQUssQ0FBQyxJQUFELEVBQU8sR0FBUCxDQXpERDtBQTBESixXQUFLLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0ExREQ7QUEyREosV0FBSyxDQUFDLEdBQUQsRUFBTSxHQUFOLENBM0REO0FBNERKLFdBQUssTUE1REQ7QUE2REosV0FBSyxVQTdERDtBQThESixXQUFLLE1BOUREO0FBK0RKLFdBQUssT0EvREQ7QUFnRUosV0FBSyxPQWhFRDtBQWlFSixXQUFLLFVBakVEO0FBa0VKLFdBQUssTUFsRUQ7QUFtRUosV0FBSztBQW5FRDtBQUZ1QixHQUEvQixDQUZXLENBMkVYOztBQUNBLE1BQUksQ0FBSjs7QUFDQSxPQUFLLENBQUMsR0FBRyxDQUFULEVBQVksQ0FBQyxHQUFHLEVBQWhCLEVBQW9CLENBQUMsRUFBckIsRUFBeUI7QUFDdkIsSUFBQSx3QkFBd0IsQ0FBQyxJQUF6QixDQUE4QixNQUFNLENBQXBDLElBQXlDLE1BQU0sQ0FBL0M7QUFDRCxHQS9FVSxDQWlGWDs7O0FBQ0EsTUFBSSxNQUFNLEdBQUcsRUFBYjs7QUFDQSxPQUFLLENBQUMsR0FBRyxFQUFULEVBQWEsQ0FBQyxHQUFHLEVBQWpCLEVBQXFCLENBQUMsRUFBdEIsRUFBMEI7QUFDeEIsSUFBQSxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsQ0FBcEIsQ0FBVDtBQUNBLElBQUEsd0JBQXdCLENBQUMsSUFBekIsQ0FBOEIsQ0FBOUIsSUFBbUMsQ0FBQyxNQUFNLENBQUMsV0FBUCxFQUFELEVBQXVCLE1BQU0sQ0FBQyxXQUFQLEVBQXZCLENBQW5DO0FBQ0Q7O0FBRUQsV0FBUyxRQUFULEdBQXFCO0FBQ25CLFFBQUksRUFBRSxtQkFBbUIsTUFBckIsS0FDQSxTQUFTLGFBQWEsQ0FBQyxTQUQzQixFQUNzQztBQUNwQyxhQUFPLEtBQVA7QUFDRCxLQUprQixDQU1uQjs7O0FBQ0EsUUFBSSxLQUFLLEdBQUc7QUFDVixNQUFBLEdBQUcsRUFBRSxhQUFVLENBQVYsRUFBYTtBQUNoQixZQUFJLEdBQUcsR0FBRyx3QkFBd0IsQ0FBQyxJQUF6QixDQUE4QixLQUFLLEtBQUwsSUFBYyxLQUFLLE9BQWpELENBQVY7O0FBRUEsWUFBSSxLQUFLLENBQUMsT0FBTixDQUFjLEdBQWQsQ0FBSixFQUF3QjtBQUN0QixVQUFBLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLFFBQVAsQ0FBVDtBQUNEOztBQUVELGVBQU8sR0FBUDtBQUNEO0FBVFMsS0FBWjtBQVdBLElBQUEsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsYUFBYSxDQUFDLFNBQXBDLEVBQStDLEtBQS9DLEVBQXNELEtBQXREO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsTUFBSSxPQUFPLE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0MsTUFBTSxDQUFDLEdBQTNDLEVBQWdEO0FBQzlDLElBQUEsTUFBTSxDQUFDLDRCQUFELEVBQStCLHdCQUEvQixDQUFOO0FBQ0QsR0FGRCxNQUVPLElBQUksT0FBTyxPQUFQLEtBQW1CLFdBQW5CLElBQWtDLE9BQU8sTUFBUCxLQUFrQixXQUF4RCxFQUFxRTtBQUMxRSxJQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLHdCQUFqQjtBQUNELEdBRk0sTUFFQSxJQUFJLE1BQUosRUFBWTtBQUNqQixJQUFBLE1BQU0sQ0FBQyx3QkFBUCxHQUFrQyx3QkFBbEM7QUFDRDtBQUVGLENBdEhEOzs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFDQSxJQUFJLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxxQkFBbkM7QUFDQSxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsU0FBUCxDQUFpQixjQUF0QztBQUNBLElBQUksZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsb0JBQXhDOztBQUVBLFNBQVMsUUFBVCxDQUFrQixHQUFsQixFQUF1QjtBQUN0QixNQUFJLEdBQUcsS0FBSyxJQUFSLElBQWdCLEdBQUcsS0FBSyxTQUE1QixFQUF1QztBQUN0QyxVQUFNLElBQUksU0FBSixDQUFjLHVEQUFkLENBQU47QUFDQTs7QUFFRCxTQUFPLE1BQU0sQ0FBQyxHQUFELENBQWI7QUFDQTs7QUFFRCxTQUFTLGVBQVQsR0FBMkI7QUFDMUIsTUFBSTtBQUNILFFBQUksQ0FBQyxNQUFNLENBQUMsTUFBWixFQUFvQjtBQUNuQixhQUFPLEtBQVA7QUFDQSxLQUhFLENBS0g7QUFFQTs7O0FBQ0EsUUFBSSxLQUFLLEdBQUcsSUFBSSxNQUFKLENBQVcsS0FBWCxDQUFaLENBUkcsQ0FRNkI7O0FBQ2hDLElBQUEsS0FBSyxDQUFDLENBQUQsQ0FBTCxHQUFXLElBQVg7O0FBQ0EsUUFBSSxNQUFNLENBQUMsbUJBQVAsQ0FBMkIsS0FBM0IsRUFBa0MsQ0FBbEMsTUFBeUMsR0FBN0MsRUFBa0Q7QUFDakQsYUFBTyxLQUFQO0FBQ0EsS0FaRSxDQWNIOzs7QUFDQSxRQUFJLEtBQUssR0FBRyxFQUFaOztBQUNBLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsRUFBcEIsRUFBd0IsQ0FBQyxFQUF6QixFQUE2QjtBQUM1QixNQUFBLEtBQUssQ0FBQyxNQUFNLE1BQU0sQ0FBQyxZQUFQLENBQW9CLENBQXBCLENBQVAsQ0FBTCxHQUFzQyxDQUF0QztBQUNBOztBQUNELFFBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixLQUEzQixFQUFrQyxHQUFsQyxDQUFzQyxVQUFVLENBQVYsRUFBYTtBQUMvRCxhQUFPLEtBQUssQ0FBQyxDQUFELENBQVo7QUFDQSxLQUZZLENBQWI7O0FBR0EsUUFBSSxNQUFNLENBQUMsSUFBUCxDQUFZLEVBQVosTUFBb0IsWUFBeEIsRUFBc0M7QUFDckMsYUFBTyxLQUFQO0FBQ0EsS0F4QkUsQ0EwQkg7OztBQUNBLFFBQUksS0FBSyxHQUFHLEVBQVo7QUFDQSwyQkFBdUIsS0FBdkIsQ0FBNkIsRUFBN0IsRUFBaUMsT0FBakMsQ0FBeUMsVUFBVSxNQUFWLEVBQWtCO0FBQzFELE1BQUEsS0FBSyxDQUFDLE1BQUQsQ0FBTCxHQUFnQixNQUFoQjtBQUNBLEtBRkQ7O0FBR0EsUUFBSSxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQU0sQ0FBQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFsQixDQUFaLEVBQXNDLElBQXRDLENBQTJDLEVBQTNDLE1BQ0Ysc0JBREYsRUFDMEI7QUFDekIsYUFBTyxLQUFQO0FBQ0E7O0FBRUQsV0FBTyxJQUFQO0FBQ0EsR0FyQ0QsQ0FxQ0UsT0FBTyxHQUFQLEVBQVk7QUFDYjtBQUNBLFdBQU8sS0FBUDtBQUNBO0FBQ0Q7O0FBRUQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsZUFBZSxLQUFLLE1BQU0sQ0FBQyxNQUFaLEdBQXFCLFVBQVUsTUFBVixFQUFrQixNQUFsQixFQUEwQjtBQUM5RSxNQUFJLElBQUo7QUFDQSxNQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsTUFBRCxDQUFqQjtBQUNBLE1BQUksT0FBSjs7QUFFQSxPQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUE5QixFQUFzQyxDQUFDLEVBQXZDLEVBQTJDO0FBQzFDLElBQUEsSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBRCxDQUFWLENBQWI7O0FBRUEsU0FBSyxJQUFJLEdBQVQsSUFBZ0IsSUFBaEIsRUFBc0I7QUFDckIsVUFBSSxjQUFjLENBQUMsSUFBZixDQUFvQixJQUFwQixFQUEwQixHQUExQixDQUFKLEVBQW9DO0FBQ25DLFFBQUEsRUFBRSxDQUFDLEdBQUQsQ0FBRixHQUFVLElBQUksQ0FBQyxHQUFELENBQWQ7QUFDQTtBQUNEOztBQUVELFFBQUkscUJBQUosRUFBMkI7QUFDMUIsTUFBQSxPQUFPLEdBQUcscUJBQXFCLENBQUMsSUFBRCxDQUEvQjs7QUFDQSxXQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUE1QixFQUFvQyxDQUFDLEVBQXJDLEVBQXlDO0FBQ3hDLFlBQUksZ0JBQWdCLENBQUMsSUFBakIsQ0FBc0IsSUFBdEIsRUFBNEIsT0FBTyxDQUFDLENBQUQsQ0FBbkMsQ0FBSixFQUE2QztBQUM1QyxVQUFBLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBRCxDQUFSLENBQUYsR0FBaUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFELENBQVIsQ0FBckI7QUFDQTtBQUNEO0FBQ0Q7QUFDRDs7QUFFRCxTQUFPLEVBQVA7QUFDQSxDQXpCRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUNMQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxnQkFBZ0IsR0FBRyx5QkFBekI7QUFDQSxJQUFNLEtBQUssR0FBRyxHQUFkOztBQUVBLElBQU0sWUFBWSxHQUFHLFNBQWYsWUFBZSxDQUFDLElBQUQsRUFBTyxPQUFQLEVBQW1CO0FBQ3RDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsZ0JBQVgsQ0FBZDtBQUNBLE1BQUksUUFBSjs7QUFDQSxNQUFJLEtBQUosRUFBVztBQUNULElBQUEsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFELENBQVo7QUFDQSxJQUFBLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBRCxDQUFoQjtBQUNEOztBQUVELE1BQUksT0FBSjs7QUFDQSxNQUFJLFFBQU8sT0FBUCxNQUFtQixRQUF2QixFQUFpQztBQUMvQixJQUFBLE9BQU8sR0FBRztBQUNSLE1BQUEsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFELEVBQVUsU0FBVixDQURQO0FBRVIsTUFBQSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQUQsRUFBVSxTQUFWO0FBRlAsS0FBVjtBQUlEOztBQUVELE1BQU0sUUFBUSxHQUFHO0FBQ2YsSUFBQSxRQUFRLEVBQVIsUUFEZTtBQUVmLElBQUEsT0FBTyxFQUFQLE9BRmU7QUFHZixJQUFBLFFBQVEsRUFBRSxRQUFPLE9BQVAsTUFBbUIsUUFBbkIsR0FBOEIsNkJBQVksT0FBWixDQUE5QixHQUFxRCxRQUFRLEdBQUcsMEJBQVMsUUFBVCxFQUFtQixPQUFuQixDQUFILEdBQWlDO0FBSHpGLEdBQWpCOztBQU1BLE1BQUksSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLElBQXNCLENBQUMsQ0FBM0IsRUFBOEI7QUFDNUIsV0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsRUFBa0IsR0FBbEIsQ0FBc0IsVUFBQSxLQUFLLEVBQUk7QUFDcEMsYUFBTyw4QkFBTztBQUFDLFFBQUEsSUFBSSxFQUFFO0FBQVAsT0FBUCxFQUFzQixRQUF0QixDQUFQO0FBQ0QsS0FGTSxDQUFQO0FBR0QsR0FKRCxNQUlPO0FBQ0wsSUFBQSxRQUFRLENBQUMsSUFBVCxHQUFnQixJQUFoQjtBQUNBLFdBQU8sQ0FBQyxRQUFELENBQVA7QUFDRDtBQUNGLENBOUJEOztBQWdDQSxJQUFNLE1BQU0sR0FBRyxTQUFULE1BQVMsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQzNCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFELENBQWpCO0FBQ0EsU0FBTyxHQUFHLENBQUMsR0FBRCxDQUFWO0FBQ0EsU0FBTyxLQUFQO0FBQ0QsQ0FKRDs7QUFNZSxTQUFTLFFBQVQsQ0FBa0IsTUFBbEIsRUFBMEIsS0FBMUIsRUFBaUM7QUFDOUMsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaLEVBQW9CLE1BQXBCLENBQTJCLFVBQUMsSUFBRCxFQUFPLElBQVAsRUFBZ0I7QUFDM0QsUUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLElBQUQsRUFBTyxNQUFNLENBQUMsSUFBRCxDQUFiLENBQTlCO0FBQ0EsV0FBTyxJQUFJLENBQUMsTUFBTCxDQUFZLFNBQVosQ0FBUDtBQUNELEdBSGlCLEVBR2YsRUFIZSxDQUFsQjtBQUtBLFNBQU8sOEJBQ0w7QUFDRSxJQUFBLEdBQUcsRUFBRSxhQUFBLE9BQU8sRUFBSTtBQUFBLGlEQUNTLFNBRFQ7QUFBQTs7QUFBQTtBQUNkLDREQUFrQztBQUFBLGNBQXZCLFFBQXVCO0FBQ2hDLFVBQUEsT0FBTyxDQUFDLGdCQUFSLENBQXlCLFFBQVEsQ0FBQyxJQUFsQyxFQUF3QyxRQUFRLENBQUMsUUFBakQsRUFBMkQsUUFBUSxDQUFDLE9BQXBFO0FBQ0Q7QUFIYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSWYsS0FMSDtBQU1FLElBQUEsTUFBTSxFQUFFLGdCQUFBLE9BQU8sRUFBSTtBQUFBLGtEQUNNLFNBRE47QUFBQTs7QUFBQTtBQUNqQiwrREFBa0M7QUFBQSxjQUF2QixRQUF1QjtBQUNoQyxVQUFBLE9BQU8sQ0FBQyxtQkFBUixDQUE0QixRQUFRLENBQUMsSUFBckMsRUFBMkMsUUFBUSxDQUFDLFFBQXBELEVBQThELFFBQVEsQ0FBQyxPQUF2RTtBQUNEO0FBSGdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJbEI7QUFWSCxHQURLLEVBYUwsS0FiSyxDQUFQO0FBZUQ7Ozs7Ozs7Ozs7QUNsRWMsU0FBUyxPQUFULENBQWlCLFNBQWpCLEVBQTRCO0FBQ3pDLFNBQU8sVUFBUyxDQUFULEVBQVk7QUFBQTs7QUFDakIsV0FBTyxTQUFTLENBQUMsSUFBVixDQUFlLFVBQUEsRUFBRSxFQUFJO0FBQzFCLGFBQU8sRUFBRSxDQUFDLElBQUgsQ0FBUSxLQUFSLEVBQWMsQ0FBZCxNQUFxQixLQUE1QjtBQUNELEtBRk0sQ0FBUDtBQUdELEdBSkQ7QUFLRDs7Ozs7Ozs7OztBQ0xEOztBQURBO0FBR2UsU0FBUyxRQUFULENBQWtCLFFBQWxCLEVBQTRCLEVBQTVCLEVBQWdDO0FBQzdDLFNBQU8sVUFBQSxLQUFLLEVBQUk7QUFDZCxRQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTixDQUFhLE9BQWIsQ0FBcUIsUUFBckIsQ0FBZjs7QUFDQSxRQUFJLE1BQUosRUFBWTtBQUNWLGFBQU8sRUFBRSxDQUFDLElBQUgsQ0FBUSxNQUFSLEVBQWdCLEtBQWhCLENBQVA7QUFDRDtBQUNGLEdBTEQ7QUFNRDs7Ozs7Ozs7OztBQ1ZEOztBQUNBOzs7O0FBRUEsSUFBTSxLQUFLLEdBQUcsR0FBZDs7QUFFZSxTQUFTLFdBQVQsQ0FBcUIsU0FBckIsRUFBZ0M7QUFDN0MsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxTQUFaLENBQWIsQ0FENkMsQ0FHN0M7QUFDQTtBQUNBOztBQUNBLE1BQUksSUFBSSxDQUFDLE1BQUwsS0FBZ0IsQ0FBaEIsSUFBcUIsSUFBSSxDQUFDLENBQUQsQ0FBSixLQUFZLEtBQXJDLEVBQTRDO0FBQzFDLFdBQU8sU0FBUyxDQUFDLEtBQUQsQ0FBaEI7QUFDRDs7QUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTCxDQUFZLFVBQVMsSUFBVCxFQUFlLFFBQWYsRUFBeUI7QUFDckQsSUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLDBCQUFTLFFBQVQsRUFBbUIsU0FBUyxDQUFDLFFBQUQsQ0FBNUIsQ0FBVjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBSGlCLEVBR2YsRUFIZSxDQUFsQjtBQUlBLFNBQU8seUJBQVEsU0FBUixDQUFQO0FBQ0Q7Ozs7Ozs7Ozs7QUNwQmMsU0FBUyxNQUFULENBQWdCLE9BQWhCLEVBQXlCLEVBQXpCLEVBQTZCO0FBQzFDLFNBQU8sU0FBUyxTQUFULENBQW1CLENBQW5CLEVBQXNCO0FBQzNCLFFBQUksT0FBTyxLQUFLLENBQUMsQ0FBQyxNQUFkLElBQXdCLENBQUMsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsQ0FBQyxDQUFDLE1BQW5CLENBQTdCLEVBQXlEO0FBQ3ZELGFBQU8sRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSLEVBQWMsQ0FBZCxDQUFQO0FBQ0Q7QUFDRixHQUpEO0FBS0Q7Ozs7Ozs7Ozs7O0FDTkQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBTSxTQUFTLEdBQUc7QUFDaEIsRUFBQSxHQUFHLEVBQUUsUUFEVztBQUVoQixFQUFBLE9BQU8sRUFBRSxTQUZPO0FBR2hCLEVBQUEsSUFBSSxFQUFFLFNBSFU7QUFJaEIsRUFBQSxLQUFLLEVBQUU7QUFKUyxDQUFsQjs7QUFPQSxJQUFNLGtCQUFrQixHQUFHLEdBQTNCOztBQUVBLFNBQVMsV0FBVCxDQUFxQixLQUFyQixFQUE0QixZQUE1QixFQUEwQztBQUN4QyxNQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBaEI7O0FBQ0EsTUFBSSxZQUFKLEVBQWtCO0FBQ2hCLFNBQUssSUFBTSxRQUFYLElBQXVCLFNBQXZCLEVBQWtDO0FBQ2hDLFVBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFELENBQVYsQ0FBTCxLQUErQixJQUFuQyxFQUF5QztBQUN2QyxRQUFBLEdBQUcsR0FBRyxDQUFDLFFBQUQsRUFBVyxHQUFYLEVBQWdCLElBQWhCLENBQXFCLGtCQUFyQixDQUFOO0FBQ0Q7QUFDRjtBQUNGOztBQUNELFNBQU8sR0FBUDtBQUNEOztBQUVjLFNBQVMsTUFBVCxDQUFnQixJQUFoQixFQUFzQjtBQUNuQyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosRUFBa0IsSUFBbEIsQ0FBdUIsVUFBQSxHQUFHLEVBQUk7QUFDakQsV0FBTyxHQUFHLENBQUMsT0FBSixDQUFZLGtCQUFaLElBQWtDLENBQUMsQ0FBMUM7QUFDRCxHQUZvQixDQUFyQjtBQUdBLFNBQU8sU0FBUyxTQUFULENBQW1CLEtBQW5CLEVBQTBCO0FBQUE7O0FBQy9CLFFBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxLQUFELEVBQVEsWUFBUixDQUF2QjtBQUNBLFdBQU8sQ0FBQyxHQUFELEVBQU0sR0FBRyxDQUFDLFdBQUosRUFBTixFQUF5QixNQUF6QixDQUFnQyxVQUFDLE1BQUQsRUFBUyxJQUFULEVBQWtCO0FBQ3ZELFVBQUksSUFBSSxJQUFJLElBQVosRUFBa0I7QUFDaEIsZUFBTyxJQUFJLENBQUMsR0FBRCxDQUFKLENBQVUsSUFBVixDQUFlLEtBQWYsRUFBcUIsS0FBckIsQ0FBUDtBQUNEOztBQUNELGFBQU8sTUFBUDtBQUNELEtBTE0sQ0FBUDtBQU1ELEdBUkQ7QUFTRDs7Ozs7Ozs7OztBQ3ZDYyxTQUFTLElBQVQsQ0FBYyxRQUFkLEVBQXdCLE9BQXhCLEVBQWlDO0FBQzlDLFNBQU8sU0FBUyxXQUFULENBQXFCLENBQXJCLEVBQXdCO0FBQzdCLElBQUEsQ0FBQyxDQUFDLGFBQUYsQ0FBZ0IsbUJBQWhCLENBQW9DLENBQUMsQ0FBQyxJQUF0QyxFQUE0QyxXQUE1QyxFQUF5RCxPQUF6RDtBQUNBLFdBQU8sUUFBUSxDQUFDLElBQVQsQ0FBYyxJQUFkLEVBQW9CLENBQXBCLENBQVA7QUFDRCxHQUhEO0FBSUQ7OztBQ0xEOzs7Ozs7OztBQUNBLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBRCxDQUF0Qjs7QUFDQSxJQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyx5QkFBRCxDQUFuQzs7QUFDQSxJQUFNLE1BQU0scUNBQVo7QUFDQSxJQUFNLFFBQVEsR0FBRyxlQUFqQjtBQUNBLElBQU0sZUFBZSxHQUFHLHNCQUF4QjtBQUNBLElBQU0scUJBQXFCLEdBQUcsMkJBQTlCO0FBQ0EsSUFBTSx1QkFBdUIsR0FBRyxVQUFoQztBQUNBLElBQU0sd0JBQXdCLEdBQUcsVUFBakM7QUFDQSxJQUFNLDhCQUE4QixHQUFHLDRCQUF2Qzs7SUFFTSxTO0FBQ0oscUJBQWEsU0FBYixFQUF1QjtBQUFBOztBQUNyQixRQUFHLENBQUMsU0FBSixFQUFjO0FBQ1osWUFBTSxJQUFJLEtBQUosbUNBQU47QUFDRDs7QUFDRCxTQUFLLFNBQUwsR0FBaUIsU0FBakI7QUFDQSxRQUFJLFdBQVcsR0FBRyxTQUFTLENBQUMsc0JBQTVCOztBQUNBLFFBQUcsV0FBVyxLQUFLLElBQWhCLElBQXdCLFdBQVcsQ0FBQyxTQUFaLENBQXNCLFFBQXRCLENBQStCLHVCQUEvQixDQUEzQixFQUFtRjtBQUNqRixXQUFLLGtCQUFMLEdBQTBCLFdBQTFCO0FBQ0Q7O0FBQ0QsU0FBSyxPQUFMLEdBQWUsU0FBUyxDQUFDLGdCQUFWLENBQTJCLE1BQTNCLENBQWY7O0FBQ0EsUUFBRyxLQUFLLE9BQUwsQ0FBYSxNQUFiLElBQXVCLENBQTFCLEVBQTRCO0FBQzFCLFlBQU0sSUFBSSxLQUFKLDZCQUFOO0FBQ0QsS0FGRCxNQUVNO0FBQ0osV0FBSyxVQUFMLEdBQWtCLFFBQVEsQ0FBQyxXQUFULENBQXFCLE9BQXJCLENBQWxCO0FBQ0EsV0FBSyxVQUFMLENBQWdCLFNBQWhCLENBQTBCLHFCQUExQixFQUFpRCxJQUFqRCxFQUF1RCxJQUF2RDtBQUNBLFdBQUssU0FBTCxHQUFpQixRQUFRLENBQUMsV0FBVCxDQUFxQixPQUFyQixDQUFqQjtBQUNBLFdBQUssU0FBTCxDQUFlLFNBQWYsQ0FBeUIsb0JBQXpCLEVBQStDLElBQS9DLEVBQXFELElBQXJEO0FBQ0EsV0FBSyxJQUFMO0FBQ0Q7QUFDRjs7OztXQUVELGdCQUFPO0FBQ0wsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxLQUFLLE9BQUwsQ0FBYSxNQUFqQyxFQUF5QyxDQUFDLEVBQTFDLEVBQTZDO0FBQzNDLFlBQUksYUFBYSxHQUFHLEtBQUssT0FBTCxDQUFhLENBQWIsQ0FBcEIsQ0FEMkMsQ0FHM0M7O0FBQ0EsWUFBSSxRQUFRLEdBQUcsYUFBYSxDQUFDLFlBQWQsQ0FBMkIsUUFBM0IsTUFBeUMsTUFBeEQ7QUFDQSxRQUFBLFlBQVksQ0FBQyxhQUFELEVBQWdCLFFBQWhCLENBQVo7QUFFQSxZQUFNLElBQUksR0FBRyxJQUFiO0FBQ0EsUUFBQSxhQUFhLENBQUMsbUJBQWQsQ0FBa0MsT0FBbEMsRUFBMkMsSUFBSSxDQUFDLFlBQWhELEVBQThELEtBQTlEO0FBQ0EsUUFBQSxhQUFhLENBQUMsZ0JBQWQsQ0FBK0IsT0FBL0IsRUFBd0MsSUFBSSxDQUFDLFlBQTdDLEVBQTJELEtBQTNEO0FBQ0EsYUFBSyxrQkFBTDtBQUNEO0FBQ0Y7OztXQUVELDhCQUFvQjtBQUNsQixVQUFHLEtBQUssa0JBQUwsS0FBNEIsU0FBL0IsRUFBeUM7QUFDdkMsYUFBSyxrQkFBTCxDQUF3QixnQkFBeEIsQ0FBeUMsT0FBekMsRUFBa0QsWUFBVTtBQUMxRCxjQUFJLFNBQVMsR0FBRyxLQUFLLGtCQUFyQjtBQUNBLGNBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxnQkFBVixDQUEyQixNQUEzQixDQUFkOztBQUNBLGNBQUcsQ0FBQyxTQUFTLENBQUMsU0FBVixDQUFvQixRQUFwQixDQUE2QixXQUE3QixDQUFKLEVBQThDO0FBQzVDLGtCQUFNLElBQUksS0FBSiw2QkFBTjtBQUNEOztBQUNELGNBQUcsT0FBTyxDQUFDLE1BQVIsSUFBa0IsQ0FBckIsRUFBdUI7QUFDckIsa0JBQU0sSUFBSSxLQUFKLDZCQUFOO0FBQ0Q7O0FBRUQsY0FBSSxNQUFNLEdBQUcsSUFBYjs7QUFDQSxjQUFHLEtBQUssWUFBTCxDQUFrQiw4QkFBbEIsTUFBc0QsT0FBekQsRUFBa0U7QUFDaEUsWUFBQSxNQUFNLEdBQUcsS0FBVDtBQUNEOztBQUNELGVBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQTVCLEVBQW9DLENBQUMsRUFBckMsRUFBd0M7QUFDdEMsWUFBQSxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUQsQ0FBUixFQUFhLE1BQWIsQ0FBWjtBQUNEOztBQUVELGVBQUssWUFBTCxDQUFrQiw4QkFBbEIsRUFBa0QsQ0FBQyxNQUFuRDs7QUFDQSxjQUFHLENBQUMsTUFBRCxLQUFZLElBQWYsRUFBb0I7QUFDbEIsaUJBQUssU0FBTCxHQUFpQix1QkFBakI7QUFDRCxXQUZELE1BRU07QUFDSixpQkFBSyxTQUFMLEdBQWlCLHdCQUFqQjtBQUNEO0FBQ0YsU0F4QkQ7QUF5QkQ7QUFDRjs7O1dBR0Qsc0JBQWMsS0FBZCxFQUFvQjtBQUNsQixNQUFBLEtBQUssQ0FBQyxlQUFOO0FBQ0EsVUFBSSxNQUFNLEdBQUcsSUFBYjtBQUNBLE1BQUEsS0FBSyxDQUFDLGNBQU47QUFDQSxNQUFBLFlBQVksQ0FBQyxNQUFELENBQVo7O0FBQ0EsVUFBSSxNQUFNLENBQUMsWUFBUCxDQUFvQixRQUFwQixNQUFrQyxNQUF0QyxFQUE4QztBQUM1QztBQUNBO0FBQ0E7QUFDQSxZQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBRCxDQUF4QixFQUFrQyxNQUFNLENBQUMsY0FBUDtBQUNuQztBQUNGO0FBR0Q7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBR0EsSUFBSSxZQUFZLEdBQUksU0FBaEIsWUFBZ0IsQ0FBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCO0FBQzlDLE1BQUksU0FBUyxHQUFHLElBQWhCOztBQUNBLE1BQUcsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsVUFBbEIsQ0FBNkIsU0FBN0IsQ0FBdUMsUUFBdkMsQ0FBZ0QsV0FBaEQsQ0FBSCxFQUFnRTtBQUM5RCxJQUFBLFNBQVMsR0FBRyxNQUFNLENBQUMsVUFBUCxDQUFrQixVQUE5QjtBQUNELEdBRkQsTUFFTyxJQUFHLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFVBQWxCLENBQTZCLFVBQTdCLENBQXdDLFNBQXhDLENBQWtELFFBQWxELENBQTJELFdBQTNELENBQUgsRUFBMkU7QUFDaEYsSUFBQSxTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsVUFBbEIsQ0FBNkIsVUFBekM7QUFDRDs7QUFFRCxNQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsV0FBVCxDQUFxQixPQUFyQixDQUFqQjtBQUNBLEVBQUEsVUFBVSxDQUFDLFNBQVgsQ0FBcUIscUJBQXJCLEVBQTRDLElBQTVDLEVBQWtELElBQWxEO0FBQ0EsTUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsT0FBckIsQ0FBaEI7QUFDQSxFQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLG9CQUFwQixFQUEwQyxJQUExQyxFQUFnRCxJQUFoRDtBQUNBLEVBQUEsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFELEVBQVMsUUFBVCxDQUFqQjs7QUFFQSxNQUFHLFFBQUgsRUFBWTtBQUNWLElBQUEsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsU0FBckI7QUFDRCxHQUZELE1BRU07QUFDSixJQUFBLE1BQU0sQ0FBQyxhQUFQLENBQXFCLFVBQXJCO0FBQ0Q7O0FBRUQsTUFBSSxlQUFlLEdBQUcsS0FBdEI7O0FBQ0EsTUFBRyxTQUFTLEtBQUssSUFBZCxLQUF1QixTQUFTLENBQUMsWUFBVixDQUF1QixlQUF2QixNQUE0QyxNQUE1QyxJQUFzRCxTQUFTLENBQUMsU0FBVixDQUFvQixRQUFwQixDQUE2QixxQkFBN0IsQ0FBN0UsQ0FBSCxFQUFxSTtBQUNuSSxJQUFBLGVBQWUsR0FBRyxJQUFsQjtBQUNBLFFBQUksWUFBWSxHQUFHLFNBQVMsQ0FBQyxzQkFBN0I7O0FBQ0EsUUFBRyxZQUFZLEtBQUssSUFBakIsSUFBeUIsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsUUFBdkIsQ0FBZ0MsdUJBQWhDLENBQTVCLEVBQXFGO0FBQ25GLFVBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxZQUFiLENBQTBCLDhCQUExQixDQUFiO0FBQ0EsVUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLGdCQUFWLENBQTJCLE1BQTNCLENBQWQ7QUFDQSxVQUFJLFdBQVcsR0FBRyxTQUFTLENBQUMsZ0JBQVYsQ0FBMkIsTUFBTSxHQUFDLHdCQUFsQyxDQUFsQjtBQUNBLFVBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxnQkFBVixDQUEyQixNQUFNLEdBQUMseUJBQWxDLENBQXBCO0FBQ0EsVUFBSSxTQUFTLEdBQUcsSUFBaEI7O0FBQ0EsVUFBRyxPQUFPLENBQUMsTUFBUixLQUFtQixXQUFXLENBQUMsTUFBbEMsRUFBeUM7QUFDdkMsUUFBQSxTQUFTLEdBQUcsS0FBWjtBQUNEOztBQUNELFVBQUcsT0FBTyxDQUFDLE1BQVIsS0FBbUIsYUFBYSxDQUFDLE1BQXBDLEVBQTJDO0FBQ3pDLFFBQUEsU0FBUyxHQUFHLElBQVo7QUFDRDs7QUFDRCxNQUFBLFlBQVksQ0FBQyxZQUFiLENBQTBCLDhCQUExQixFQUEwRCxTQUExRDs7QUFDQSxVQUFHLFNBQVMsS0FBSyxJQUFqQixFQUFzQjtBQUNwQixRQUFBLFlBQVksQ0FBQyxTQUFiLEdBQXlCLHVCQUF6QjtBQUNELE9BRkQsTUFFTTtBQUNKLFFBQUEsWUFBWSxDQUFDLFNBQWIsR0FBeUIsd0JBQXpCO0FBQ0Q7QUFFRjtBQUNGOztBQUVELE1BQUksUUFBUSxJQUFJLENBQUMsZUFBakIsRUFBa0M7QUFDaEMsUUFBSSxRQUFPLEdBQUcsQ0FBRSxNQUFGLENBQWQ7O0FBQ0EsUUFBRyxTQUFTLEtBQUssSUFBakIsRUFBdUI7QUFDckIsTUFBQSxRQUFPLEdBQUcsU0FBUyxDQUFDLGdCQUFWLENBQTJCLE1BQTNCLENBQVY7QUFDRDs7QUFDRCxTQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsUUFBTyxDQUFDLE1BQTNCLEVBQW1DLENBQUMsRUFBcEMsRUFBd0M7QUFDdEMsVUFBSSxjQUFjLEdBQUcsUUFBTyxDQUFDLENBQUQsQ0FBNUI7O0FBQ0EsVUFBSSxjQUFjLEtBQUssTUFBdkIsRUFBK0I7QUFDN0IsUUFBQSxNQUFNLENBQUMsY0FBRCxFQUFpQixLQUFqQixDQUFOO0FBQ0EsUUFBQSxjQUFjLENBQUMsYUFBZixDQUE2QixVQUE3QjtBQUNEO0FBQ0Y7QUFDRjtBQUNGLENBM0REOztBQThEQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFqQjs7O0FDdEtBOzs7Ozs7OztJQUNNLHFCO0FBQ0YsaUNBQVksRUFBWixFQUFlO0FBQUE7O0FBQ1gsU0FBSyxlQUFMLEdBQXVCLDZCQUF2QjtBQUNBLFNBQUssY0FBTCxHQUFzQixvQkFBdEI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsT0FBckIsQ0FBbEI7QUFDQSxTQUFLLFVBQUwsQ0FBZ0IsU0FBaEIsQ0FBMEIsb0JBQTFCLEVBQWdELElBQWhELEVBQXNELElBQXREO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLFFBQVEsQ0FBQyxXQUFULENBQXFCLE9BQXJCLENBQWpCO0FBQ0EsU0FBSyxTQUFMLENBQWUsU0FBZixDQUF5QixtQkFBekIsRUFBOEMsSUFBOUMsRUFBb0QsSUFBcEQ7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsSUFBbEI7QUFFQSxTQUFLLElBQUwsQ0FBVSxFQUFWO0FBQ0g7Ozs7V0FFRCxjQUFLLEVBQUwsRUFBUTtBQUNKLFdBQUssVUFBTCxHQUFrQixFQUFsQjtBQUNBLFVBQUksSUFBSSxHQUFHLElBQVg7QUFDQSxXQUFLLFVBQUwsQ0FBZ0IsZ0JBQWhCLENBQWlDLFFBQWpDLEVBQTJDLFVBQVUsS0FBVixFQUFnQjtBQUN2RCxRQUFBLElBQUksQ0FBQyxNQUFMLENBQVksSUFBSSxDQUFDLFVBQWpCO0FBQ0gsT0FGRDtBQUdBLFdBQUssTUFBTCxDQUFZLEtBQUssVUFBakI7QUFDSDs7O1dBRUQsZ0JBQU8sU0FBUCxFQUFpQjtBQUNiLFVBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxZQUFWLENBQXVCLEtBQUssY0FBNUIsQ0FBakI7QUFDQSxVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixVQUF4QixDQUFmOztBQUNBLFVBQUcsUUFBUSxLQUFLLElBQWIsSUFBcUIsUUFBUSxLQUFLLFNBQXJDLEVBQStDO0FBQzNDLGNBQU0sSUFBSSxLQUFKLENBQVUsNkRBQTRELEtBQUssY0FBM0UsQ0FBTjtBQUNIOztBQUNELFVBQUcsU0FBUyxDQUFDLE9BQWIsRUFBcUI7QUFDakIsYUFBSyxJQUFMLENBQVUsU0FBVixFQUFxQixRQUFyQjtBQUNILE9BRkQsTUFFSztBQUNELGFBQUssS0FBTCxDQUFXLFNBQVgsRUFBc0IsUUFBdEI7QUFDSDtBQUNKOzs7V0FFRCxjQUFLLFNBQUwsRUFBZ0IsUUFBaEIsRUFBeUI7QUFDckIsVUFBRyxTQUFTLEtBQUssSUFBZCxJQUFzQixTQUFTLEtBQUssU0FBcEMsSUFBaUQsUUFBUSxLQUFLLElBQTlELElBQXNFLFFBQVEsS0FBSyxTQUF0RixFQUFnRztBQUM1RixRQUFBLFNBQVMsQ0FBQyxZQUFWLENBQXVCLG9CQUF2QixFQUE2QyxNQUE3QztBQUNBLFFBQUEsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsTUFBbkIsQ0FBMEIsV0FBMUI7QUFDQSxRQUFBLFFBQVEsQ0FBQyxZQUFULENBQXNCLGFBQXRCLEVBQXFDLE9BQXJDO0FBQ0EsUUFBQSxTQUFTLENBQUMsYUFBVixDQUF3QixLQUFLLFNBQTdCO0FBQ0g7QUFDSjs7O1dBQ0QsZUFBTSxTQUFOLEVBQWlCLFFBQWpCLEVBQTBCO0FBQ3RCLFVBQUcsU0FBUyxLQUFLLElBQWQsSUFBc0IsU0FBUyxLQUFLLFNBQXBDLElBQWlELFFBQVEsS0FBSyxJQUE5RCxJQUFzRSxRQUFRLEtBQUssU0FBdEYsRUFBZ0c7QUFDNUYsUUFBQSxTQUFTLENBQUMsWUFBVixDQUF1QixvQkFBdkIsRUFBNkMsT0FBN0M7QUFDQSxRQUFBLFFBQVEsQ0FBQyxTQUFULENBQW1CLEdBQW5CLENBQXVCLFdBQXZCO0FBQ0EsUUFBQSxRQUFRLENBQUMsWUFBVCxDQUFzQixhQUF0QixFQUFxQyxNQUFyQztBQUNBLFFBQUEsU0FBUyxDQUFDLGFBQVYsQ0FBd0IsS0FBSyxVQUE3QjtBQUNIO0FBQ0o7Ozs7OztBQUdMLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLHFCQUFqQjs7O0FDdkRBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7OztJQUVNLFE7QUFDSixvQkFBYSxPQUFiLEVBQXdDO0FBQUEsUUFBbEIsTUFBa0IsdUVBQVQsUUFBUzs7QUFBQTs7QUFDdEMsU0FBSyxnQkFBTCxHQUF3QixnQkFBeEI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsT0FBakI7QUFDQSxTQUFLLFFBQUw7QUFDQSxTQUFLLGlCQUFMLEdBQXlCLEtBQXpCO0FBQ0EsUUFBSSxJQUFJLEdBQUcsSUFBWDtBQUNBLFNBQUssVUFBTCxHQUFrQixRQUFRLENBQUMsV0FBVCxDQUFxQixPQUFyQixDQUFsQjtBQUNBLFNBQUssVUFBTCxDQUFnQixTQUFoQixDQUEwQixvQkFBMUIsRUFBZ0QsSUFBaEQsRUFBc0QsSUFBdEQ7QUFDQSxTQUFLLFNBQUwsR0FBaUIsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsT0FBckIsQ0FBakI7QUFDQSxTQUFLLFNBQUwsQ0FBZSxTQUFmLENBQXlCLG1CQUF6QixFQUE4QyxJQUE5QyxFQUFvRCxJQUFwRDtBQUNBLFNBQUssU0FBTCxDQUFlLGdCQUFmLENBQWdDLE9BQWhDLEVBQXlDLFlBQVc7QUFDbEQsTUFBQSxJQUFJLENBQUMsTUFBTDtBQUNELEtBRkQ7QUFHRDs7OztXQUVELHdCQUFnQixVQUFoQixFQUE0QjtBQUMxQixVQUFJLFVBQVUsR0FBRyxLQUFLLFNBQUwsQ0FBZSxZQUFmLENBQTRCLEtBQUssZ0JBQWpDLENBQWpCO0FBQ0EsV0FBSyxRQUFMLEdBQWdCLFFBQVEsQ0FBQyxhQUFULENBQXVCLFVBQXZCLENBQWhCOztBQUNBLFVBQUcsS0FBSyxRQUFMLEtBQWtCLElBQWxCLElBQTBCLEtBQUssUUFBTCxJQUFpQixTQUE5QyxFQUF3RDtBQUN0RCxjQUFNLElBQUksS0FBSixDQUFVLDZEQUE0RCxLQUFLLGdCQUEzRSxDQUFOO0FBQ0QsT0FMeUIsQ0FNMUI7OztBQUNBLFVBQUcsS0FBSyxTQUFMLENBQWUsWUFBZixDQUE0QixlQUE1QixNQUFpRCxNQUFqRCxJQUEyRCxLQUFLLFNBQUwsQ0FBZSxZQUFmLENBQTRCLGVBQTVCLE1BQWlELFNBQTVHLElBQXlILFVBQTVILEVBQXdJO0FBQ3RJO0FBQ0EsYUFBSyxlQUFMO0FBQ0QsT0FIRCxNQUdLO0FBQ0g7QUFDQSxhQUFLLGFBQUw7QUFDRDtBQUNGOzs7V0FFRCxrQkFBUztBQUNQLFVBQUcsS0FBSyxTQUFMLEtBQW1CLElBQW5CLElBQTJCLEtBQUssU0FBTCxLQUFtQixTQUFqRCxFQUEyRDtBQUN6RCxhQUFLLGNBQUw7QUFDRDtBQUNGOzs7V0FHRCwyQkFBbUI7QUFDakIsVUFBRyxDQUFDLEtBQUssaUJBQVQsRUFBMkI7QUFDekIsYUFBSyxpQkFBTCxHQUF5QixJQUF6QjtBQUVBLGFBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsTUFBcEIsR0FBNkIsS0FBSyxRQUFMLENBQWMsWUFBZCxHQUE0QixJQUF6RDtBQUNBLGFBQUssUUFBTCxDQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBNEIsOEJBQTVCO0FBQ0EsWUFBSSxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUEsVUFBVSxDQUFDLFlBQVc7QUFDcEIsVUFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLGVBQWQsQ0FBOEIsT0FBOUI7QUFDRCxTQUZTLEVBRVAsQ0FGTyxDQUFWO0FBR0EsUUFBQSxVQUFVLENBQUMsWUFBVztBQUNwQixVQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsU0FBZCxDQUF3QixHQUF4QixDQUE0QixXQUE1QjtBQUNBLFVBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxTQUFkLENBQXdCLE1BQXhCLENBQStCLDhCQUEvQjtBQUVBLFVBQUEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxZQUFmLENBQTRCLGVBQTVCLEVBQTZDLE9BQTdDO0FBQ0EsVUFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLFlBQWQsQ0FBMkIsYUFBM0IsRUFBMEMsTUFBMUM7QUFDQSxVQUFBLElBQUksQ0FBQyxpQkFBTCxHQUF5QixLQUF6QjtBQUNBLFVBQUEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxhQUFmLENBQTZCLElBQUksQ0FBQyxVQUFsQztBQUNELFNBUlMsRUFRUCxHQVJPLENBQVY7QUFTRDtBQUNGOzs7V0FFRCx5QkFBaUI7QUFDZixVQUFHLENBQUMsS0FBSyxpQkFBVCxFQUEyQjtBQUN6QixhQUFLLGlCQUFMLEdBQXlCLElBQXpCO0FBQ0EsYUFBSyxRQUFMLENBQWMsU0FBZCxDQUF3QixNQUF4QixDQUErQixXQUEvQjtBQUNBLFlBQUksY0FBYyxHQUFHLEtBQUssUUFBTCxDQUFjLFlBQW5DO0FBQ0EsYUFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixNQUFwQixHQUE2QixLQUE3QjtBQUNBLGFBQUssUUFBTCxDQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBNEIsNEJBQTVCO0FBQ0EsWUFBSSxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUEsVUFBVSxDQUFDLFlBQVc7QUFDcEIsVUFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLEtBQWQsQ0FBb0IsTUFBcEIsR0FBNkIsY0FBYyxHQUFFLElBQTdDO0FBQ0QsU0FGUyxFQUVQLENBRk8sQ0FBVjtBQUlBLFFBQUEsVUFBVSxDQUFDLFlBQVc7QUFDcEIsVUFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLFNBQWQsQ0FBd0IsTUFBeEIsQ0FBK0IsNEJBQS9CO0FBQ0EsVUFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLGVBQWQsQ0FBOEIsT0FBOUI7QUFFQSxVQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsWUFBZCxDQUEyQixhQUEzQixFQUEwQyxPQUExQztBQUNBLFVBQUEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxZQUFmLENBQTRCLGVBQTVCLEVBQTZDLE1BQTdDO0FBQ0EsVUFBQSxJQUFJLENBQUMsaUJBQUwsR0FBeUIsS0FBekI7QUFDQSxVQUFBLElBQUksQ0FBQyxTQUFMLENBQWUsYUFBZixDQUE2QixJQUFJLENBQUMsU0FBbEM7QUFDRCxTQVJTLEVBUVAsR0FSTyxDQUFWO0FBU0Q7QUFDRjs7Ozs7O0FBR0gsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBakI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVGQSxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBRCxDQUF4Qjs7QUFDQSxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsbUJBQUQsQ0FBeEI7O0FBQ0EsT0FBTyxDQUFDLEdBQVI7O0FBQ0EsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGlCQUFELENBQXRCOztBQUNBLGVBQTJCLE9BQU8sQ0FBQyxXQUFELENBQWxDO0FBQUEsSUFBZ0IsTUFBaEIsWUFBUSxNQUFSOztBQUNBLGdCQUFrQixPQUFPLENBQUMsV0FBRCxDQUF6QjtBQUFBLElBQVEsS0FBUixhQUFRLEtBQVI7O0FBQ0EsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLHlCQUFELENBQTdCOztBQUNBLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyx3QkFBRCxDQUEzQjs7QUFFQSxJQUFNLGlCQUFpQixnQkFBdkI7QUFDQSxJQUFNLHlCQUF5QixhQUFNLGlCQUFOLGNBQS9CO0FBQ0EsSUFBTSw2QkFBNkIsYUFBTSxpQkFBTixrQkFBbkM7QUFDQSxJQUFNLHdCQUF3QixhQUFNLGlCQUFOLGFBQTlCO0FBQ0EsSUFBTSxnQ0FBZ0MsYUFBTSxpQkFBTixxQkFBdEM7QUFDQSxJQUFNLGdDQUFnQyxhQUFNLGlCQUFOLHFCQUF0QztBQUNBLElBQU0sd0JBQXdCLGFBQU0saUJBQU4sYUFBOUI7QUFDQSxJQUFNLDBCQUEwQixhQUFNLGlCQUFOLGVBQWhDO0FBQ0EsSUFBTSx3QkFBd0IsYUFBTSxpQkFBTixhQUE5QjtBQUNBLElBQU0sbUJBQW1CLGFBQU0sMEJBQU4sV0FBekI7QUFFQSxJQUFNLDJCQUEyQixhQUFNLG1CQUFOLGNBQWpDO0FBQ0EsSUFBTSw0QkFBNEIsYUFBTSxtQkFBTixlQUFsQztBQUNBLElBQU0sa0NBQWtDLGFBQU0sbUJBQU4scUJBQXhDO0FBQ0EsSUFBTSxpQ0FBaUMsYUFBTSxtQkFBTixvQkFBdkM7QUFDQSxJQUFNLDhCQUE4QixhQUFNLG1CQUFOLGlCQUFwQztBQUNBLElBQU0sOEJBQThCLGFBQU0sbUJBQU4saUJBQXBDO0FBQ0EsSUFBTSx5QkFBeUIsYUFBTSxtQkFBTixZQUEvQjtBQUNBLElBQU0sb0NBQW9DLGFBQU0sbUJBQU4sdUJBQTFDO0FBQ0EsSUFBTSxrQ0FBa0MsYUFBTSxtQkFBTixxQkFBeEM7QUFDQSxJQUFNLGdDQUFnQyxhQUFNLG1CQUFOLG1CQUF0QztBQUNBLElBQU0sNEJBQTRCLGFBQU0sMEJBQU4sb0JBQWxDO0FBQ0EsSUFBTSw2QkFBNkIsYUFBTSwwQkFBTixxQkFBbkM7QUFDQSxJQUFNLHdCQUF3QixhQUFNLDBCQUFOLGdCQUE5QjtBQUNBLElBQU0seUJBQXlCLGFBQU0sMEJBQU4saUJBQS9CO0FBQ0EsSUFBTSw4QkFBOEIsYUFBTSwwQkFBTixzQkFBcEM7QUFDQSxJQUFNLDZCQUE2QixhQUFNLDBCQUFOLHFCQUFuQztBQUNBLElBQU0sb0JBQW9CLGFBQU0sMEJBQU4sWUFBMUI7QUFDQSxJQUFNLDRCQUE0QixhQUFNLG9CQUFOLGNBQWxDO0FBQ0EsSUFBTSw2QkFBNkIsYUFBTSxvQkFBTixlQUFuQztBQUNBLElBQU0sbUJBQW1CLGFBQU0sMEJBQU4sV0FBekI7QUFDQSxJQUFNLDJCQUEyQixhQUFNLG1CQUFOLGNBQWpDO0FBQ0EsSUFBTSw0QkFBNEIsYUFBTSxtQkFBTixlQUFsQztBQUNBLElBQU0sa0NBQWtDLGFBQU0sMEJBQU4sMEJBQXhDO0FBQ0EsSUFBTSw4QkFBOEIsYUFBTSwwQkFBTixzQkFBcEM7QUFDQSxJQUFNLDBCQUEwQixhQUFNLDBCQUFOLGtCQUFoQztBQUNBLElBQU0sMkJBQTJCLGFBQU0sMEJBQU4sbUJBQWpDO0FBQ0EsSUFBTSwwQkFBMEIsYUFBTSwwQkFBTixrQkFBaEM7QUFDQSxJQUFNLG9CQUFvQixhQUFNLDBCQUFOLFlBQTFCO0FBQ0EsSUFBTSxrQkFBa0IsYUFBTSwwQkFBTixVQUF4QjtBQUNBLElBQU0sbUJBQW1CLGFBQU0sMEJBQU4sV0FBekI7QUFDQSxJQUFNLGdDQUFnQyxhQUFNLG1CQUFOLG1CQUF0QztBQUNBLElBQU0sMEJBQTBCLGFBQU0sMEJBQU4sa0JBQWhDO0FBQ0EsSUFBTSwwQkFBMEIsYUFBTSwwQkFBTixrQkFBaEM7QUFFQSxJQUFNLFdBQVcsY0FBTyxpQkFBUCxDQUFqQjtBQUNBLElBQU0sa0JBQWtCLGNBQU8sd0JBQVAsQ0FBeEI7QUFDQSxJQUFNLDBCQUEwQixjQUFPLGdDQUFQLENBQWhDO0FBQ0EsSUFBTSwwQkFBMEIsY0FBTyxnQ0FBUCxDQUFoQztBQUNBLElBQU0sb0JBQW9CLGNBQU8sMEJBQVAsQ0FBMUI7QUFDQSxJQUFNLGtCQUFrQixjQUFPLHdCQUFQLENBQXhCO0FBQ0EsSUFBTSxhQUFhLGNBQU8sbUJBQVAsQ0FBbkI7QUFDQSxJQUFNLHFCQUFxQixjQUFPLDJCQUFQLENBQTNCO0FBQ0EsSUFBTSwyQkFBMkIsY0FBTyxpQ0FBUCxDQUFqQztBQUNBLElBQU0sc0JBQXNCLGNBQU8sNEJBQVAsQ0FBNUI7QUFDQSxJQUFNLHVCQUF1QixjQUFPLDZCQUFQLENBQTdCO0FBQ0EsSUFBTSxrQkFBa0IsY0FBTyx3QkFBUCxDQUF4QjtBQUNBLElBQU0sbUJBQW1CLGNBQU8seUJBQVAsQ0FBekI7QUFDQSxJQUFNLHVCQUF1QixjQUFPLDZCQUFQLENBQTdCO0FBQ0EsSUFBTSx3QkFBd0IsY0FBTyw4QkFBUCxDQUE5QjtBQUNBLElBQU0sY0FBYyxjQUFPLG9CQUFQLENBQXBCO0FBQ0EsSUFBTSxhQUFhLGNBQU8sbUJBQVAsQ0FBbkI7QUFDQSxJQUFNLDRCQUE0QixjQUFPLGtDQUFQLENBQWxDO0FBQ0EsSUFBTSx3QkFBd0IsY0FBTyw4QkFBUCxDQUE5QjtBQUNBLElBQU0sb0JBQW9CLGNBQU8sMEJBQVAsQ0FBMUI7QUFDQSxJQUFNLHFCQUFxQixjQUFPLDJCQUFQLENBQTNCO0FBQ0EsSUFBTSxvQkFBb0IsY0FBTywwQkFBUCxDQUExQjtBQUNBLElBQU0sc0JBQXNCLGNBQU8sNEJBQVAsQ0FBNUI7QUFDQSxJQUFNLHFCQUFxQixjQUFPLDJCQUFQLENBQTNCO0FBRUEsSUFBTSxrQkFBa0IsR0FBRyxpQ0FBM0I7QUFFQSxJQUFNLFlBQVksR0FBRyxDQUNuQixRQURtQixFQUVuQixTQUZtQixFQUduQixPQUhtQixFQUluQixPQUptQixFQUtuQixLQUxtQixFQU1uQixNQU5tQixFQU9uQixNQVBtQixFQVFuQixRQVJtQixFQVNuQixXQVRtQixFQVVuQixTQVZtQixFQVduQixVQVhtQixFQVluQixVQVptQixDQUFyQjtBQWVBLElBQU0sa0JBQWtCLEdBQUcsQ0FDekIsUUFEeUIsRUFFekIsU0FGeUIsRUFHekIsUUFIeUIsRUFJekIsU0FKeUIsRUFLekIsUUFMeUIsRUFNekIsUUFOeUIsRUFPekIsUUFQeUIsQ0FBM0I7QUFVQSxJQUFNLGFBQWEsR0FBRyxFQUF0QjtBQUVBLElBQU0sVUFBVSxHQUFHLEVBQW5CO0FBRUEsSUFBTSxnQkFBZ0IsR0FBRyxZQUF6QjtBQUNBLElBQU0sNEJBQTRCLEdBQUcsWUFBckM7QUFDQSxJQUFNLG9CQUFvQixHQUFHLFlBQTdCO0FBRUEsSUFBTSxxQkFBcUIsR0FBRyxrQkFBOUI7O0FBRUEsSUFBTSx5QkFBeUIsR0FBRyxTQUE1Qix5QkFBNEI7QUFBQSxvQ0FBSSxTQUFKO0FBQUksSUFBQSxTQUFKO0FBQUE7O0FBQUEsU0FDaEMsU0FBUyxDQUFDLEdBQVYsQ0FBYyxVQUFDLEtBQUQ7QUFBQSxXQUFXLEtBQUssR0FBRyxxQkFBbkI7QUFBQSxHQUFkLEVBQXdELElBQXhELENBQTZELElBQTdELENBRGdDO0FBQUEsQ0FBbEM7O0FBR0EsSUFBTSxxQkFBcUIsR0FBRyx5QkFBeUIsQ0FDckQsc0JBRHFELEVBRXJELHVCQUZxRCxFQUdyRCx1QkFIcUQsRUFJckQsd0JBSnFELEVBS3JELGtCQUxxRCxFQU1yRCxtQkFOcUQsRUFPckQscUJBUHFELENBQXZEO0FBVUEsSUFBTSxzQkFBc0IsR0FBRyx5QkFBeUIsQ0FDdEQsc0JBRHNELENBQXhEO0FBSUEsSUFBTSxxQkFBcUIsR0FBRyx5QkFBeUIsQ0FDckQsNEJBRHFELEVBRXJELHdCQUZxRCxFQUdyRCxxQkFIcUQsQ0FBdkQsQyxDQU1BOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sbUJBQW1CLEdBQUcsU0FBdEIsbUJBQXNCLENBQUMsV0FBRCxFQUFjLEtBQWQsRUFBd0I7QUFDbEQsTUFBSSxLQUFLLEtBQUssV0FBVyxDQUFDLFFBQVosRUFBZCxFQUFzQztBQUNwQyxJQUFBLFdBQVcsQ0FBQyxPQUFaLENBQW9CLENBQXBCO0FBQ0Q7O0FBRUQsU0FBTyxXQUFQO0FBQ0QsQ0FORDtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBVSxDQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsSUFBZCxFQUF1QjtBQUNyQyxNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUosQ0FBUyxDQUFULENBQWhCO0FBQ0EsRUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixJQUFwQixFQUEwQixLQUExQixFQUFpQyxJQUFqQztBQUNBLFNBQU8sT0FBUDtBQUNELENBSkQ7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLEtBQUssR0FBRyxTQUFSLEtBQVEsR0FBTTtBQUNsQixNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUosRUFBaEI7QUFDQSxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBUixFQUFaO0FBQ0EsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVIsRUFBZDtBQUNBLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFSLEVBQWI7QUFDQSxTQUFPLE9BQU8sQ0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLEdBQWQsQ0FBZDtBQUNELENBTkQ7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sWUFBWSxHQUFHLFNBQWYsWUFBZSxDQUFDLElBQUQsRUFBVTtBQUM3QixNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUosQ0FBUyxDQUFULENBQWhCO0FBQ0EsRUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixJQUFJLENBQUMsV0FBTCxFQUFwQixFQUF3QyxJQUFJLENBQUMsUUFBTCxFQUF4QyxFQUF5RCxDQUF6RDtBQUNBLFNBQU8sT0FBUDtBQUNELENBSkQ7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWlCLENBQUMsSUFBRCxFQUFVO0FBQy9CLE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSixDQUFTLENBQVQsQ0FBaEI7QUFDQSxFQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLElBQUksQ0FBQyxXQUFMLEVBQXBCLEVBQXdDLElBQUksQ0FBQyxRQUFMLEtBQWtCLENBQTFELEVBQTZELENBQTdEO0FBQ0EsU0FBTyxPQUFQO0FBQ0QsQ0FKRDtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLE9BQU8sR0FBRyxTQUFWLE9BQVUsQ0FBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNsQyxNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUosQ0FBUyxLQUFLLENBQUMsT0FBTixFQUFULENBQWhCO0FBQ0EsRUFBQSxPQUFPLENBQUMsT0FBUixDQUFnQixPQUFPLENBQUMsT0FBUixLQUFvQixPQUFwQztBQUNBLFNBQU8sT0FBUDtBQUNELENBSkQ7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFVLENBQUMsS0FBRCxFQUFRLE9BQVI7QUFBQSxTQUFvQixPQUFPLENBQUMsS0FBRCxFQUFRLENBQUMsT0FBVCxDQUEzQjtBQUFBLENBQWhCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBVyxDQUFDLEtBQUQsRUFBUSxRQUFSO0FBQUEsU0FBcUIsT0FBTyxDQUFDLEtBQUQsRUFBUSxRQUFRLEdBQUcsQ0FBbkIsQ0FBNUI7QUFBQSxDQUFqQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVcsQ0FBQyxLQUFELEVBQVEsUUFBUjtBQUFBLFNBQXFCLFFBQVEsQ0FBQyxLQUFELEVBQVEsQ0FBQyxRQUFULENBQTdCO0FBQUEsQ0FBakI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sV0FBVyxHQUFHLFNBQWQsV0FBYyxDQUFDLEtBQUQsRUFBVztBQUM3QixNQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTixLQUFlLENBQS9COztBQUNBLE1BQUcsU0FBUyxLQUFLLENBQUMsQ0FBbEIsRUFBb0I7QUFDbEIsSUFBQSxTQUFTLEdBQUcsQ0FBWjtBQUNEOztBQUNELFNBQU8sT0FBTyxDQUFDLEtBQUQsRUFBUSxTQUFSLENBQWQ7QUFDRCxDQU5EO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBWSxDQUFDLEtBQUQsRUFBVztBQUMzQixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTixFQUFsQjs7QUFDQSxTQUFPLE9BQU8sQ0FBQyxLQUFELEVBQVEsSUFBSSxTQUFaLENBQWQ7QUFDRCxDQUhEO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBWSxDQUFDLEtBQUQsRUFBUSxTQUFSLEVBQXNCO0FBQ3RDLE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSixDQUFTLEtBQUssQ0FBQyxPQUFOLEVBQVQsQ0FBaEI7QUFFQSxNQUFNLFNBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFSLEtBQXFCLEVBQXJCLEdBQTBCLFNBQTNCLElBQXdDLEVBQTFEO0FBQ0EsRUFBQSxPQUFPLENBQUMsUUFBUixDQUFpQixPQUFPLENBQUMsUUFBUixLQUFxQixTQUF0QztBQUNBLEVBQUEsbUJBQW1CLENBQUMsT0FBRCxFQUFVLFNBQVYsQ0FBbkI7QUFFQSxTQUFPLE9BQVA7QUFDRCxDQVJEO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBWSxDQUFDLEtBQUQsRUFBUSxTQUFSO0FBQUEsU0FBc0IsU0FBUyxDQUFDLEtBQUQsRUFBUSxDQUFDLFNBQVQsQ0FBL0I7QUFBQSxDQUFsQjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVcsQ0FBQyxLQUFELEVBQVEsUUFBUjtBQUFBLFNBQXFCLFNBQVMsQ0FBQyxLQUFELEVBQVEsUUFBUSxHQUFHLEVBQW5CLENBQTlCO0FBQUEsQ0FBakI7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFXLENBQUMsS0FBRCxFQUFRLFFBQVI7QUFBQSxTQUFxQixRQUFRLENBQUMsS0FBRCxFQUFRLENBQUMsUUFBVCxDQUE3QjtBQUFBLENBQWpCO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBVyxDQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWtCO0FBQ2pDLE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSixDQUFTLEtBQUssQ0FBQyxPQUFOLEVBQVQsQ0FBaEI7QUFFQSxFQUFBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLEtBQWpCO0FBQ0EsRUFBQSxtQkFBbUIsQ0FBQyxPQUFELEVBQVUsS0FBVixDQUFuQjtBQUVBLFNBQU8sT0FBUDtBQUNELENBUEQ7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFVLENBQUMsS0FBRCxFQUFRLElBQVIsRUFBaUI7QUFDL0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFKLENBQVMsS0FBSyxDQUFDLE9BQU4sRUFBVCxDQUFoQjtBQUVBLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFSLEVBQWQ7QUFDQSxFQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLElBQXBCO0FBQ0EsRUFBQSxtQkFBbUIsQ0FBQyxPQUFELEVBQVUsS0FBVixDQUFuQjtBQUVBLFNBQU8sT0FBUDtBQUNELENBUkQ7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxHQUFHLEdBQUcsU0FBTixHQUFNLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBa0I7QUFDNUIsTUFBSSxPQUFPLEdBQUcsS0FBZDs7QUFFQSxNQUFJLEtBQUssR0FBRyxLQUFaLEVBQW1CO0FBQ2pCLElBQUEsT0FBTyxHQUFHLEtBQVY7QUFDRDs7QUFFRCxTQUFPLElBQUksSUFBSixDQUFTLE9BQU8sQ0FBQyxPQUFSLEVBQVQsQ0FBUDtBQUNELENBUkQ7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxHQUFHLEdBQUcsU0FBTixHQUFNLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBa0I7QUFDNUIsTUFBSSxPQUFPLEdBQUcsS0FBZDs7QUFFQSxNQUFJLEtBQUssR0FBRyxLQUFaLEVBQW1CO0FBQ2pCLElBQUEsT0FBTyxHQUFHLEtBQVY7QUFDRDs7QUFFRCxTQUFPLElBQUksSUFBSixDQUFTLE9BQU8sQ0FBQyxPQUFSLEVBQVQsQ0FBUDtBQUNELENBUkQ7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFhLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBa0I7QUFDbkMsU0FBTyxLQUFLLElBQUksS0FBVCxJQUFrQixLQUFLLENBQUMsV0FBTixPQUF3QixLQUFLLENBQUMsV0FBTixFQUFqRDtBQUNELENBRkQ7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxXQUFXLEdBQUcsU0FBZCxXQUFjLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBa0I7QUFDcEMsU0FBTyxVQUFVLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBVixJQUE0QixLQUFLLENBQUMsUUFBTixPQUFxQixLQUFLLENBQUMsUUFBTixFQUF4RDtBQUNELENBRkQ7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxTQUFTLEdBQUcsU0FBWixTQUFZLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBa0I7QUFDbEMsU0FBTyxXQUFXLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBWCxJQUE2QixLQUFLLENBQUMsT0FBTixPQUFvQixLQUFLLENBQUMsT0FBTixFQUF4RDtBQUNELENBRkQ7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLHdCQUF3QixHQUFHLFNBQTNCLHdCQUEyQixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLEVBQTRCO0FBQzNELE1BQUksT0FBTyxHQUFHLElBQWQ7O0FBRUEsTUFBSSxJQUFJLEdBQUcsT0FBWCxFQUFvQjtBQUNsQixJQUFBLE9BQU8sR0FBRyxPQUFWO0FBQ0QsR0FGRCxNQUVPLElBQUksT0FBTyxJQUFJLElBQUksR0FBRyxPQUF0QixFQUErQjtBQUNwQyxJQUFBLE9BQU8sR0FBRyxPQUFWO0FBQ0Q7O0FBRUQsU0FBTyxJQUFJLElBQUosQ0FBUyxPQUFPLENBQUMsT0FBUixFQUFULENBQVA7QUFDRCxDQVZEO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxxQkFBcUIsR0FBRyxTQUF4QixxQkFBd0IsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQjtBQUFBLFNBQzVCLElBQUksSUFBSSxPQUFSLEtBQW9CLENBQUMsT0FBRCxJQUFZLElBQUksSUFBSSxPQUF4QyxDQUQ0QjtBQUFBLENBQTlCO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSwyQkFBMkIsR0FBRyxTQUE5QiwyQkFBOEIsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixFQUE0QjtBQUM5RCxTQUNFLGNBQWMsQ0FBQyxJQUFELENBQWQsR0FBdUIsT0FBdkIsSUFBbUMsT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFELENBQVosR0FBcUIsT0FEckU7QUFHRCxDQUpEO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSwwQkFBMEIsR0FBRyxTQUE3QiwwQkFBNkIsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixFQUE0QjtBQUM3RCxTQUNFLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBVCxDQUFkLEdBQXFDLE9BQXJDLElBQ0MsT0FBTyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBRCxFQUFPLENBQVAsQ0FBVCxDQUFaLEdBQWtDLE9BRmhEO0FBSUQsQ0FMRDtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sZUFBZSxHQUFHLFNBQWxCLGVBQWtCLENBQ3RCLFVBRHNCLEVBSW5CO0FBQUEsTUFGSCxVQUVHLHVFQUZVLG9CQUVWO0FBQUEsTUFESCxVQUNHLHVFQURVLEtBQ1Y7QUFDSCxNQUFJLElBQUo7QUFDQSxNQUFJLEtBQUo7QUFDQSxNQUFJLEdBQUo7QUFDQSxNQUFJLElBQUo7QUFDQSxNQUFJLE1BQUo7O0FBRUEsTUFBSSxVQUFKLEVBQWdCO0FBQ2QsUUFBSSxRQUFKLEVBQWMsTUFBZCxFQUFzQixPQUF0Qjs7QUFDQSxRQUFJLFVBQVUsS0FBSyw0QkFBbkIsRUFBaUQ7QUFBQSw4QkFDakIsVUFBVSxDQUFDLEtBQVgsQ0FBaUIsR0FBakIsQ0FEaUI7O0FBQUE7O0FBQzlDLE1BQUEsTUFEOEM7QUFDdEMsTUFBQSxRQURzQztBQUM1QixNQUFBLE9BRDRCO0FBRWhELEtBRkQsTUFFTztBQUFBLCtCQUN5QixVQUFVLENBQUMsS0FBWCxDQUFpQixHQUFqQixDQUR6Qjs7QUFBQTs7QUFDSixNQUFBLE9BREk7QUFDSyxNQUFBLFFBREw7QUFDZSxNQUFBLE1BRGY7QUFFTjs7QUFFRCxRQUFJLE9BQUosRUFBYTtBQUNYLE1BQUEsTUFBTSxHQUFHLFFBQVEsQ0FBQyxPQUFELEVBQVUsRUFBVixDQUFqQjs7QUFDQSxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQVAsQ0FBYSxNQUFiLENBQUwsRUFBMkI7QUFDekIsUUFBQSxJQUFJLEdBQUcsTUFBUDs7QUFDQSxZQUFJLFVBQUosRUFBZ0I7QUFDZCxVQUFBLElBQUksR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFaLENBQVA7O0FBQ0EsY0FBSSxPQUFPLENBQUMsTUFBUixHQUFpQixDQUFyQixFQUF3QjtBQUN0QixnQkFBTSxXQUFXLEdBQUcsS0FBSyxHQUFHLFdBQVIsRUFBcEI7QUFDQSxnQkFBTSxlQUFlLEdBQ25CLFdBQVcsR0FBSSxXQUFXLFlBQUcsRUFBSCxFQUFTLE9BQU8sQ0FBQyxNQUFqQixDQUQ1QjtBQUVBLFlBQUEsSUFBSSxHQUFHLGVBQWUsR0FBRyxNQUF6QjtBQUNEO0FBQ0Y7QUFDRjtBQUNGOztBQUVELFFBQUksUUFBSixFQUFjO0FBQ1osTUFBQSxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQUQsRUFBVyxFQUFYLENBQWpCOztBQUNBLFVBQUksQ0FBQyxNQUFNLENBQUMsS0FBUCxDQUFhLE1BQWIsQ0FBTCxFQUEyQjtBQUN6QixRQUFBLEtBQUssR0FBRyxNQUFSOztBQUNBLFlBQUksVUFBSixFQUFnQjtBQUNkLFVBQUEsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLEtBQVosQ0FBUjtBQUNBLFVBQUEsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsRUFBVCxFQUFhLEtBQWIsQ0FBUjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxRQUFJLEtBQUssSUFBSSxNQUFULElBQW1CLElBQUksSUFBSSxJQUEvQixFQUFxQztBQUNuQyxNQUFBLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBRCxFQUFTLEVBQVQsQ0FBakI7O0FBQ0EsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBYixDQUFMLEVBQTJCO0FBQ3pCLFFBQUEsR0FBRyxHQUFHLE1BQU47O0FBQ0EsWUFBSSxVQUFKLEVBQWdCO0FBQ2QsY0FBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxDQUFkLENBQVAsQ0FBd0IsT0FBeEIsRUFBMUI7QUFDQSxVQUFBLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxHQUFaLENBQU47QUFDQSxVQUFBLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLGlCQUFULEVBQTRCLEdBQTVCLENBQU47QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsUUFBSSxLQUFLLElBQUksR0FBVCxJQUFnQixJQUFJLElBQUksSUFBNUIsRUFBa0M7QUFDaEMsTUFBQSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUQsRUFBTyxLQUFLLEdBQUcsQ0FBZixFQUFrQixHQUFsQixDQUFkO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPLElBQVA7QUFDRCxDQWhFRDtBQWtFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxVQUFVLEdBQUcsU0FBYixVQUFhLENBQUMsSUFBRCxFQUE2QztBQUFBLE1BQXRDLFVBQXNDLHVFQUF6QixvQkFBeUI7O0FBQzlELE1BQU0sUUFBUSxHQUFHLFNBQVgsUUFBVyxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQW1CO0FBQ2xDLFdBQU8sY0FBTyxLQUFQLEVBQWUsS0FBZixDQUFxQixDQUFDLE1BQXRCLENBQVA7QUFDRCxHQUZEOztBQUlBLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFMLEtBQWtCLENBQWhDO0FBQ0EsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQUwsRUFBWjtBQUNBLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFMLEVBQWI7O0FBRUEsTUFBSSxVQUFVLEtBQUssNEJBQW5CLEVBQWlEO0FBQy9DLFdBQU8sQ0FBQyxRQUFRLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FBVCxFQUFtQixRQUFRLENBQUMsS0FBRCxFQUFRLENBQVIsQ0FBM0IsRUFBdUMsUUFBUSxDQUFDLElBQUQsRUFBTyxDQUFQLENBQS9DLEVBQTBELElBQTFELENBQStELEdBQS9ELENBQVA7QUFDRDs7QUFFRCxTQUFPLENBQUMsUUFBUSxDQUFDLElBQUQsRUFBTyxDQUFQLENBQVQsRUFBb0IsUUFBUSxDQUFDLEtBQUQsRUFBUSxDQUFSLENBQTVCLEVBQXdDLFFBQVEsQ0FBQyxHQUFELEVBQU0sQ0FBTixDQUFoRCxFQUEwRCxJQUExRCxDQUErRCxHQUEvRCxDQUFQO0FBQ0QsQ0FkRCxDLENBZ0JBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFpQixDQUFDLFNBQUQsRUFBWSxPQUFaLEVBQXdCO0FBQzdDLE1BQU0sSUFBSSxHQUFHLEVBQWI7QUFDQSxNQUFJLEdBQUcsR0FBRyxFQUFWO0FBRUEsTUFBSSxDQUFDLEdBQUcsQ0FBUjs7QUFDQSxTQUFPLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBckIsRUFBNkI7QUFDM0IsSUFBQSxHQUFHLEdBQUcsRUFBTjs7QUFDQSxXQUFPLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBZCxJQUF3QixHQUFHLENBQUMsTUFBSixHQUFhLE9BQTVDLEVBQXFEO0FBQ25ELE1BQUEsR0FBRyxDQUFDLElBQUosZUFBZ0IsU0FBUyxDQUFDLENBQUQsQ0FBekI7QUFDQSxNQUFBLENBQUMsSUFBSSxDQUFMO0FBQ0Q7O0FBQ0QsSUFBQSxJQUFJLENBQUMsSUFBTCxlQUFpQixHQUFHLENBQUMsSUFBSixDQUFTLEVBQVQsQ0FBakI7QUFDRDs7QUFFRCxTQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsRUFBVixDQUFQO0FBQ0QsQ0FmRDtBQWlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sa0JBQWtCLEdBQUcsU0FBckIsa0JBQXFCLENBQUMsRUFBRCxFQUFvQjtBQUFBLE1BQWYsS0FBZSx1RUFBUCxFQUFPO0FBQzdDLE1BQU0sZUFBZSxHQUFHLEVBQXhCO0FBQ0EsRUFBQSxlQUFlLENBQUMsS0FBaEIsR0FBd0IsS0FBeEI7QUFFQSxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUosQ0FBZ0IsUUFBaEIsRUFBMEI7QUFDdEMsSUFBQSxPQUFPLEVBQUUsSUFENkI7QUFFdEMsSUFBQSxVQUFVLEVBQUUsSUFGMEI7QUFHdEMsSUFBQSxNQUFNLEVBQUU7QUFBRSxNQUFBLEtBQUssRUFBTDtBQUFGO0FBSDhCLEdBQTFCLENBQWQ7QUFLQSxFQUFBLGVBQWUsQ0FBQyxhQUFoQixDQUE4QixLQUE5QjtBQUNELENBVkQ7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxvQkFBb0IsR0FBRyxTQUF2QixvQkFBdUIsQ0FBQyxFQUFELEVBQVE7QUFDbkMsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLE9BQUgsQ0FBVyxXQUFYLENBQXJCOztBQUVBLE1BQUksQ0FBQyxZQUFMLEVBQW1CO0FBQ2pCLFVBQU0sSUFBSSxLQUFKLG9DQUFzQyxXQUF0QyxFQUFOO0FBQ0Q7O0FBRUQsTUFBTSxlQUFlLEdBQUcsWUFBWSxDQUFDLGFBQWIsQ0FDdEIsMEJBRHNCLENBQXhCO0FBR0EsTUFBTSxlQUFlLEdBQUcsWUFBWSxDQUFDLGFBQWIsQ0FDdEIsMEJBRHNCLENBQXhCO0FBR0EsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLGFBQWIsQ0FBMkIsb0JBQTNCLENBQW5CO0FBQ0EsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLGFBQWIsQ0FBMkIsa0JBQTNCLENBQXBCO0FBQ0EsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLGFBQWIsQ0FBMkIsa0JBQTNCLENBQWpCO0FBQ0EsTUFBTSxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsYUFBYixDQUEyQixhQUEzQixDQUF6QjtBQUVBLE1BQU0sU0FBUyxHQUFHLGVBQWUsQ0FDL0IsZUFBZSxDQUFDLEtBRGUsRUFFL0IsNEJBRitCLEVBRy9CLElBSCtCLENBQWpDO0FBS0EsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLGVBQWUsQ0FBQyxLQUFqQixDQUFwQztBQUVBLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBWCxDQUFtQixLQUFwQixDQUFwQztBQUNBLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsT0FBYixDQUFxQixPQUF0QixDQUEvQjtBQUNBLE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsT0FBYixDQUFxQixPQUF0QixDQUEvQjtBQUNBLE1BQU0sU0FBUyxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsT0FBYixDQUFxQixTQUF0QixDQUFqQztBQUNBLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsT0FBYixDQUFxQixXQUF0QixDQUFuQzs7QUFFQSxNQUFJLE9BQU8sSUFBSSxPQUFYLElBQXNCLE9BQU8sR0FBRyxPQUFwQyxFQUE2QztBQUMzQyxVQUFNLElBQUksS0FBSixDQUFVLDJDQUFWLENBQU47QUFDRDs7QUFFRCxTQUFPO0FBQ0wsSUFBQSxZQUFZLEVBQVosWUFESztBQUVMLElBQUEsT0FBTyxFQUFQLE9BRks7QUFHTCxJQUFBLFdBQVcsRUFBWCxXQUhLO0FBSUwsSUFBQSxZQUFZLEVBQVosWUFKSztBQUtMLElBQUEsT0FBTyxFQUFQLE9BTEs7QUFNTCxJQUFBLGdCQUFnQixFQUFoQixnQkFOSztBQU9MLElBQUEsWUFBWSxFQUFaLFlBUEs7QUFRTCxJQUFBLFNBQVMsRUFBVCxTQVJLO0FBU0wsSUFBQSxlQUFlLEVBQWYsZUFUSztBQVVMLElBQUEsZUFBZSxFQUFmLGVBVks7QUFXTCxJQUFBLFVBQVUsRUFBVixVQVhLO0FBWUwsSUFBQSxTQUFTLEVBQVQsU0FaSztBQWFMLElBQUEsV0FBVyxFQUFYLFdBYks7QUFjTCxJQUFBLFFBQVEsRUFBUjtBQWRLLEdBQVA7QUFnQkQsQ0FuREQ7QUFxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFVLENBQUMsRUFBRCxFQUFRO0FBQ3RCLDhCQUF5QyxvQkFBb0IsQ0FBQyxFQUFELENBQTdEO0FBQUEsTUFBUSxlQUFSLHlCQUFRLGVBQVI7QUFBQSxNQUF5QixXQUF6Qix5QkFBeUIsV0FBekI7O0FBRUEsRUFBQSxXQUFXLENBQUMsUUFBWixHQUF1QixJQUF2QjtBQUNBLEVBQUEsZUFBZSxDQUFDLFFBQWhCLEdBQTJCLElBQTNCO0FBQ0QsQ0FMRDtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sTUFBTSxHQUFHLFNBQVQsTUFBUyxDQUFDLEVBQUQsRUFBUTtBQUNyQiwrQkFBeUMsb0JBQW9CLENBQUMsRUFBRCxDQUE3RDtBQUFBLE1BQVEsZUFBUiwwQkFBUSxlQUFSO0FBQUEsTUFBeUIsV0FBekIsMEJBQXlCLFdBQXpCOztBQUVBLEVBQUEsV0FBVyxDQUFDLFFBQVosR0FBdUIsS0FBdkI7QUFDQSxFQUFBLGVBQWUsQ0FBQyxRQUFoQixHQUEyQixLQUEzQjtBQUNELENBTEQsQyxDQU9BOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sa0JBQWtCLEdBQUcsU0FBckIsa0JBQXFCLENBQUMsRUFBRCxFQUFRO0FBQ2pDLCtCQUE4QyxvQkFBb0IsQ0FBQyxFQUFELENBQWxFO0FBQUEsTUFBUSxlQUFSLDBCQUFRLGVBQVI7QUFBQSxNQUF5QixPQUF6QiwwQkFBeUIsT0FBekI7QUFBQSxNQUFrQyxPQUFsQywwQkFBa0MsT0FBbEM7O0FBRUEsTUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDLEtBQW5DO0FBQ0EsTUFBSSxTQUFTLEdBQUcsS0FBaEI7O0FBRUEsTUFBSSxVQUFKLEVBQWdCO0FBQ2QsSUFBQSxTQUFTLEdBQUcsSUFBWjtBQUVBLFFBQU0sZUFBZSxHQUFHLFVBQVUsQ0FBQyxLQUFYLENBQWlCLEdBQWpCLENBQXhCOztBQUNBLCtCQUEyQixlQUFlLENBQUMsR0FBaEIsQ0FBb0IsVUFBQyxHQUFELEVBQVM7QUFDdEQsVUFBSSxLQUFKO0FBQ0EsVUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLEdBQUQsRUFBTSxFQUFOLENBQXZCO0FBQ0EsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFQLENBQWEsTUFBYixDQUFMLEVBQTJCLEtBQUssR0FBRyxNQUFSO0FBQzNCLGFBQU8sS0FBUDtBQUNELEtBTDBCLENBQTNCO0FBQUE7QUFBQSxRQUFPLEdBQVA7QUFBQSxRQUFZLEtBQVo7QUFBQSxRQUFtQixJQUFuQjs7QUFPQSxRQUFJLEtBQUssSUFBSSxHQUFULElBQWdCLElBQUksSUFBSSxJQUE1QixFQUFrQztBQUNoQyxVQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsSUFBRCxFQUFPLEtBQUssR0FBRyxDQUFmLEVBQWtCLEdBQWxCLENBQXpCOztBQUVBLFVBQ0UsU0FBUyxDQUFDLFFBQVYsT0FBeUIsS0FBSyxHQUFHLENBQWpDLElBQ0EsU0FBUyxDQUFDLE9BQVYsT0FBd0IsR0FEeEIsSUFFQSxTQUFTLENBQUMsV0FBVixPQUE0QixJQUY1QixJQUdBLGVBQWUsQ0FBQyxDQUFELENBQWYsQ0FBbUIsTUFBbkIsS0FBOEIsQ0FIOUIsSUFJQSxxQkFBcUIsQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixPQUFyQixDQUx2QixFQU1FO0FBQ0EsUUFBQSxTQUFTLEdBQUcsS0FBWjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPLFNBQVA7QUFDRCxDQWpDRDtBQW1DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFvQixDQUFDLEVBQUQsRUFBUTtBQUNoQywrQkFBNEIsb0JBQW9CLENBQUMsRUFBRCxDQUFoRDtBQUFBLE1BQVEsZUFBUiwwQkFBUSxlQUFSOztBQUNBLE1BQU0sU0FBUyxHQUFHLGtCQUFrQixDQUFDLGVBQUQsQ0FBcEM7O0FBRUEsTUFBSSxTQUFTLElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWxDLEVBQXFEO0FBQ25ELElBQUEsZUFBZSxDQUFDLGlCQUFoQixDQUFrQyxrQkFBbEM7QUFDRDs7QUFFRCxNQUFJLENBQUMsU0FBRCxJQUFjLGVBQWUsQ0FBQyxpQkFBaEIsS0FBc0Msa0JBQXhELEVBQTRFO0FBQzFFLElBQUEsZUFBZSxDQUFDLGlCQUFoQixDQUFrQyxFQUFsQztBQUNEO0FBQ0YsQ0FYRCxDLENBYUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxvQkFBb0IsR0FBRyxTQUF2QixvQkFBdUIsQ0FBQyxFQUFELEVBQVE7QUFDbkMsK0JBQXVDLG9CQUFvQixDQUFDLEVBQUQsQ0FBM0Q7QUFBQSxNQUFRLGVBQVIsMEJBQVEsZUFBUjtBQUFBLE1BQXlCLFNBQXpCLDBCQUF5QixTQUF6Qjs7QUFDQSxNQUFJLFFBQVEsR0FBRyxFQUFmOztBQUVBLE1BQUksU0FBUyxJQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRCxDQUFwQyxFQUEwQztBQUN4QyxJQUFBLFFBQVEsR0FBRyxVQUFVLENBQUMsU0FBRCxDQUFyQjtBQUNEOztBQUVELE1BQUksZUFBZSxDQUFDLEtBQWhCLEtBQTBCLFFBQTlCLEVBQXdDO0FBQ3RDLElBQUEsa0JBQWtCLENBQUMsZUFBRCxFQUFrQixRQUFsQixDQUFsQjtBQUNEO0FBQ0YsQ0FYRDtBQWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBbUIsQ0FBQyxFQUFELEVBQUssVUFBTCxFQUFvQjtBQUMzQyxNQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMsVUFBRCxDQUFsQzs7QUFFQSxNQUFJLFVBQUosRUFBZ0I7QUFDZCxRQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsVUFBRCxFQUFhLDRCQUFiLENBQWhDOztBQUVBLGlDQUlJLG9CQUFvQixDQUFDLEVBQUQsQ0FKeEI7QUFBQSxRQUNFLFlBREYsMEJBQ0UsWUFERjtBQUFBLFFBRUUsZUFGRiwwQkFFRSxlQUZGO0FBQUEsUUFHRSxlQUhGLDBCQUdFLGVBSEY7O0FBTUEsSUFBQSxrQkFBa0IsQ0FBQyxlQUFELEVBQWtCLFVBQWxCLENBQWxCO0FBQ0EsSUFBQSxrQkFBa0IsQ0FBQyxlQUFELEVBQWtCLGFBQWxCLENBQWxCO0FBRUEsSUFBQSxpQkFBaUIsQ0FBQyxZQUFELENBQWpCO0FBQ0Q7QUFDRixDQWpCRDtBQW1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFvQixDQUFDLEVBQUQsRUFBUTtBQUNoQyxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsT0FBSCxDQUFXLFdBQVgsQ0FBckI7QUFDQSxNQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsT0FBYixDQUFxQixZQUExQztBQUVBLE1BQU0sZUFBZSxHQUFHLFlBQVksQ0FBQyxhQUFiLFNBQXhCOztBQUVBLE1BQUksQ0FBQyxlQUFMLEVBQXNCO0FBQ3BCLFVBQU0sSUFBSSxLQUFKLFdBQWEsV0FBYiw2QkFBTjtBQUNEOztBQUdELE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FDN0IsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsT0FBckIsSUFBZ0MsZUFBZSxDQUFDLFlBQWhCLENBQTZCLEtBQTdCLENBREgsQ0FBL0I7QUFHQSxFQUFBLFlBQVksQ0FBQyxPQUFiLENBQXFCLE9BQXJCLEdBQStCLE9BQU8sR0FDbEMsVUFBVSxDQUFDLE9BQUQsQ0FEd0IsR0FFbEMsZ0JBRko7QUFJQSxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQzdCLFlBQVksQ0FBQyxPQUFiLENBQXFCLE9BQXJCLElBQWdDLGVBQWUsQ0FBQyxZQUFoQixDQUE2QixLQUE3QixDQURILENBQS9COztBQUdBLE1BQUksT0FBSixFQUFhO0FBQ1gsSUFBQSxZQUFZLENBQUMsT0FBYixDQUFxQixPQUFyQixHQUErQixVQUFVLENBQUMsT0FBRCxDQUF6QztBQUNEOztBQUVELE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQXhCO0FBQ0EsRUFBQSxlQUFlLENBQUMsU0FBaEIsQ0FBMEIsR0FBMUIsQ0FBOEIseUJBQTlCO0FBQ0EsRUFBQSxlQUFlLENBQUMsUUFBaEIsR0FBMkIsSUFBM0I7QUFFQSxNQUFNLGVBQWUsR0FBRyxlQUFlLENBQUMsU0FBaEIsRUFBeEI7QUFDQSxFQUFBLGVBQWUsQ0FBQyxTQUFoQixDQUEwQixHQUExQixDQUE4QixnQ0FBOUI7QUFDQSxFQUFBLGVBQWUsQ0FBQyxJQUFoQixHQUF1QixNQUF2QjtBQUNBLEVBQUEsZUFBZSxDQUFDLElBQWhCLEdBQXVCLEVBQXZCO0FBRUEsRUFBQSxlQUFlLENBQUMsV0FBaEIsQ0FBNEIsZUFBNUI7QUFDQSxFQUFBLGVBQWUsQ0FBQyxrQkFBaEIsQ0FDRSxXQURGLEVBRUUsMkNBQ2tDLHdCQURsQyxzR0FFaUIsMEJBRmpCLDBGQUd5Qix3QkFIekIscURBSUUsSUFKRixDQUlPLEVBSlAsQ0FGRjtBQVNBLEVBQUEsZUFBZSxDQUFDLFlBQWhCLENBQTZCLGFBQTdCLEVBQTRDLE1BQTVDO0FBQ0EsRUFBQSxlQUFlLENBQUMsWUFBaEIsQ0FBNkIsVUFBN0IsRUFBeUMsSUFBekM7QUFDQSxFQUFBLGVBQWUsQ0FBQyxTQUFoQixDQUEwQixHQUExQixDQUNFLFNBREYsRUFFRSxnQ0FGRjtBQUlBLEVBQUEsZUFBZSxDQUFDLGVBQWhCLENBQWdDLElBQWhDO0FBQ0EsRUFBQSxlQUFlLENBQUMsUUFBaEIsR0FBMkIsS0FBM0I7QUFFQSxFQUFBLFlBQVksQ0FBQyxXQUFiLENBQXlCLGVBQXpCO0FBQ0EsRUFBQSxZQUFZLENBQUMsU0FBYixDQUF1QixHQUF2QixDQUEyQiw2QkFBM0I7O0FBRUEsTUFBSSxZQUFKLEVBQWtCO0FBQ2hCLElBQUEsZ0JBQWdCLENBQUMsWUFBRCxFQUFlLFlBQWYsQ0FBaEI7QUFDRDs7QUFFRCxNQUFJLGVBQWUsQ0FBQyxRQUFwQixFQUE4QjtBQUM1QixJQUFBLE9BQU8sQ0FBQyxZQUFELENBQVA7QUFDQSxJQUFBLGVBQWUsQ0FBQyxRQUFoQixHQUEyQixLQUEzQjtBQUNEOztBQUVELE1BQUksZUFBZSxDQUFDLEtBQXBCLEVBQTJCO0FBQ3pCLElBQUEsaUJBQWlCLENBQUMsZUFBRCxDQUFqQjtBQUNEO0FBQ0YsQ0FwRUQsQyxDQXNFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBaUIsQ0FBQyxFQUFELEVBQUssY0FBTCxFQUF3QjtBQUM3QywrQkFRSSxvQkFBb0IsQ0FBQyxFQUFELENBUnhCO0FBQUEsTUFDRSxZQURGLDBCQUNFLFlBREY7QUFBQSxNQUVFLFVBRkYsMEJBRUUsVUFGRjtBQUFBLE1BR0UsUUFIRiwwQkFHRSxRQUhGO0FBQUEsTUFJRSxZQUpGLDBCQUlFLFlBSkY7QUFBQSxNQUtFLE9BTEYsMEJBS0UsT0FMRjtBQUFBLE1BTUUsT0FORiwwQkFNRSxPQU5GO0FBQUEsTUFPRSxTQVBGLDBCQU9FLFNBUEY7O0FBU0EsTUFBTSxVQUFVLEdBQUcsS0FBSyxFQUF4QjtBQUNBLE1BQUksYUFBYSxHQUFHLGNBQWMsSUFBSSxVQUF0QztBQUVBLE1BQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLE1BQXJDO0FBRUEsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQUQsRUFBZ0IsQ0FBaEIsQ0FBM0I7QUFDQSxNQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsUUFBZCxFQUFyQjtBQUNBLE1BQU0sV0FBVyxHQUFHLGFBQWEsQ0FBQyxXQUFkLEVBQXBCO0FBRUEsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLGFBQUQsRUFBZ0IsQ0FBaEIsQ0FBM0I7QUFDQSxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsYUFBRCxFQUFnQixDQUFoQixDQUEzQjtBQUVBLE1BQU0sb0JBQW9CLEdBQUcsVUFBVSxDQUFDLGFBQUQsQ0FBdkM7QUFFQSxNQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsYUFBRCxDQUFqQztBQUNBLE1BQU0sbUJBQW1CLEdBQUcsV0FBVyxDQUFDLGFBQUQsRUFBZ0IsT0FBaEIsQ0FBdkM7QUFDQSxNQUFNLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxhQUFELEVBQWdCLE9BQWhCLENBQXZDO0FBRUEsTUFBTSxtQkFBbUIsR0FBRyxZQUFZLElBQUksYUFBNUM7QUFDQSxNQUFNLGNBQWMsR0FBRyxTQUFTLElBQUksR0FBRyxDQUFDLG1CQUFELEVBQXNCLFNBQXRCLENBQXZDO0FBQ0EsTUFBTSxZQUFZLEdBQUcsU0FBUyxJQUFJLEdBQUcsQ0FBQyxtQkFBRCxFQUFzQixTQUF0QixDQUFyQztBQUVBLE1BQU0sb0JBQW9CLEdBQUcsU0FBUyxJQUFJLE9BQU8sQ0FBQyxjQUFELEVBQWlCLENBQWpCLENBQWpEO0FBQ0EsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLElBQUksT0FBTyxDQUFDLFlBQUQsRUFBZSxDQUFmLENBQS9DO0FBRUEsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLFlBQUQsQ0FBL0I7O0FBRUEsTUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBbUIsQ0FBQyxZQUFELEVBQWtCO0FBQ3pDLFFBQU0sT0FBTyxHQUFHLENBQUMsbUJBQUQsQ0FBaEI7QUFDQSxRQUFNLEdBQUcsR0FBRyxZQUFZLENBQUMsT0FBYixFQUFaO0FBQ0EsUUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLFFBQWIsRUFBZDtBQUNBLFFBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxXQUFiLEVBQWI7QUFDQSxRQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsTUFBYixFQUFsQjtBQUVBLFFBQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxZQUFELENBQWhDO0FBRUEsUUFBSSxRQUFRLEdBQUcsSUFBZjtBQUVBLFFBQU0sVUFBVSxHQUFHLENBQUMscUJBQXFCLENBQUMsWUFBRCxFQUFlLE9BQWYsRUFBd0IsT0FBeEIsQ0FBekM7QUFDQSxRQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsWUFBRCxFQUFlLFlBQWYsQ0FBNUI7O0FBRUEsUUFBSSxXQUFXLENBQUMsWUFBRCxFQUFlLFNBQWYsQ0FBZixFQUEwQztBQUN4QyxNQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsa0NBQWI7QUFDRDs7QUFFRCxRQUFJLFdBQVcsQ0FBQyxZQUFELEVBQWUsV0FBZixDQUFmLEVBQTRDO0FBQzFDLE1BQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxpQ0FBYjtBQUNEOztBQUVELFFBQUksV0FBVyxDQUFDLFlBQUQsRUFBZSxTQUFmLENBQWYsRUFBMEM7QUFDeEMsTUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLDhCQUFiO0FBQ0Q7O0FBRUQsUUFBSSxVQUFKLEVBQWdCO0FBQ2QsTUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLDRCQUFiO0FBQ0Q7O0FBRUQsUUFBSSxTQUFTLENBQUMsWUFBRCxFQUFlLFVBQWYsQ0FBYixFQUF5QztBQUN2QyxNQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEseUJBQWI7QUFDRDs7QUFFRCxRQUFJLFNBQUosRUFBZTtBQUNiLFVBQUksU0FBUyxDQUFDLFlBQUQsRUFBZSxTQUFmLENBQWIsRUFBd0M7QUFDdEMsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLDhCQUFiO0FBQ0Q7O0FBRUQsVUFBSSxTQUFTLENBQUMsWUFBRCxFQUFlLGNBQWYsQ0FBYixFQUE2QztBQUMzQyxRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsb0NBQWI7QUFDRDs7QUFFRCxVQUFJLFNBQVMsQ0FBQyxZQUFELEVBQWUsWUFBZixDQUFiLEVBQTJDO0FBQ3pDLFFBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxrQ0FBYjtBQUNEOztBQUVELFVBQ0UscUJBQXFCLENBQ25CLFlBRG1CLEVBRW5CLG9CQUZtQixFQUduQixrQkFIbUIsQ0FEdkIsRUFNRTtBQUNBLFFBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxnQ0FBYjtBQUNEO0FBQ0Y7O0FBRUQsUUFBSSxTQUFTLENBQUMsWUFBRCxFQUFlLFdBQWYsQ0FBYixFQUEwQztBQUN4QyxNQUFBLFFBQVEsR0FBRyxHQUFYO0FBQ0EsTUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLDJCQUFiO0FBQ0Q7O0FBRUQsUUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLEtBQUQsQ0FBN0I7QUFDQSxRQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxTQUFELENBQWpDO0FBRUEsc0VBRWMsUUFGZCwrQkFHVyxPQUFPLENBQUMsSUFBUixDQUFhLEdBQWIsQ0FIWCxtQ0FJYyxHQUpkLHFDQUtnQixLQUFLLEdBQUcsQ0FMeEIsb0NBTWUsSUFOZixxQ0FPZ0IsYUFQaEIsb0NBUWdCLE1BUmhCLGtCQVE4QixHQVI5QixjQVFxQyxRQVJyQyxjQVFpRCxJQVJqRCx3Q0FTbUIsVUFBVSxHQUFHLE1BQUgsR0FBWSxPQVR6Qyx1QkFVSSxVQUFVLDZCQUEyQixFQVZ6QyxvQkFXRyxHQVhIO0FBWUQsR0E5RUQsQ0FyQzZDLENBb0g3Qzs7O0FBQ0EsRUFBQSxhQUFhLEdBQUcsV0FBVyxDQUFDLFlBQUQsQ0FBM0I7QUFFQSxNQUFNLElBQUksR0FBRyxFQUFiOztBQUVBLFNBQ0UsSUFBSSxDQUFDLE1BQUwsR0FBYyxFQUFkLElBQ0EsYUFBYSxDQUFDLFFBQWQsT0FBNkIsWUFEN0IsSUFFQSxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWQsS0FBb0IsQ0FIdEIsRUFJRTtBQUNBLElBQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxnQkFBZ0IsQ0FBQyxhQUFELENBQTFCO0FBQ0EsSUFBQSxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQUQsRUFBZ0IsQ0FBaEIsQ0FBdkI7QUFDRDs7QUFDRCxNQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsSUFBRCxFQUFPLENBQVAsQ0FBaEM7QUFFQSxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsU0FBWCxFQUFwQjtBQUNBLEVBQUEsV0FBVyxDQUFDLE9BQVosQ0FBb0IsS0FBcEIsR0FBNEIsb0JBQTVCO0FBQ0EsRUFBQSxXQUFXLENBQUMsS0FBWixDQUFrQixHQUFsQixhQUEyQixZQUFZLENBQUMsWUFBeEM7QUFDQSxFQUFBLFdBQVcsQ0FBQyxNQUFaLEdBQXFCLEtBQXJCO0FBQ0EsTUFBSSxPQUFPLDBDQUFnQywwQkFBaEMscUNBQ08sa0JBRFAsdUNBRVMsbUJBRlQsY0FFZ0MsZ0NBRmhDLHVGQUtRLDRCQUxSLHdGQU9DLG1CQUFtQiw2QkFBMkIsRUFQL0MsZ0ZBVVMsbUJBVlQsY0FVZ0MsZ0NBVmhDLHVGQWFRLDZCQWJSLHdGQWVDLG1CQUFtQiw2QkFBMkIsRUFmL0MsZ0ZBa0JTLG1CQWxCVCxjQWtCZ0MsMEJBbEJoQyx1RkFxQlEsOEJBckJSLDZCQXFCdUQsVUFyQnZELCtDQXNCQSxVQXRCQSw2RkF5QlEsNkJBekJSLDZCQXlCc0QsV0F6QnRELDRDQTBCQSxXQTFCQSw2REE0QlMsbUJBNUJULGNBNEJnQyxnQ0E1QmhDLHVGQStCUSx5QkEvQlIsd0ZBaUNDLG1CQUFtQiw2QkFBMkIsRUFqQy9DLGdGQW9DUyxtQkFwQ1QsY0FvQ2dDLGdDQXBDaEMsdUZBdUNRLHdCQXZDUixzRkF5Q0MsbUJBQW1CLDZCQUEyQixFQXpDL0MsOEZBNkNTLG9CQTdDVCwrREFBWDs7QUFnREEsT0FBSSxJQUFJLENBQVIsSUFBYSxrQkFBYixFQUFnQztBQUM5QixJQUFBLE9BQU8sMEJBQWtCLDBCQUFsQiwyQ0FBeUUsa0JBQWtCLENBQUMsQ0FBRCxDQUEzRixnQkFBbUcsa0JBQWtCLENBQUMsQ0FBRCxDQUFsQixDQUFzQixNQUF0QixDQUE2QixDQUE3QixDQUFuRyxVQUFQO0FBQ0Q7O0FBQ0QsRUFBQSxPQUFPLGtFQUdHLFNBSEgsbURBQVA7QUFPQSxFQUFBLFdBQVcsQ0FBQyxTQUFaLEdBQXdCLE9BQXhCO0FBQ0EsRUFBQSxVQUFVLENBQUMsVUFBWCxDQUFzQixZQUF0QixDQUFtQyxXQUFuQyxFQUFnRCxVQUFoRDtBQUVBLEVBQUEsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsR0FBdkIsQ0FBMkIsd0JBQTNCO0FBRUEsTUFBTSxRQUFRLEdBQUcsRUFBakI7O0FBRUEsTUFBSSxTQUFTLENBQUMsWUFBRCxFQUFlLFdBQWYsQ0FBYixFQUEwQztBQUN4QyxJQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsZUFBZDtBQUNEOztBQUVELE1BQUksaUJBQUosRUFBdUI7QUFDckIsSUFBQSxRQUFRLENBQUMsSUFBVCxDQUNFLHVFQURGLEVBRUUseUNBRkYsRUFHRSxxREFIRixFQUlFLG1EQUpGLEVBS0Usa0VBTEY7QUFPQSxJQUFBLFFBQVEsQ0FBQyxXQUFULEdBQXVCLEVBQXZCO0FBQ0QsR0FURCxNQVNPO0FBQ0wsSUFBQSxRQUFRLENBQUMsSUFBVCxXQUFpQixVQUFqQixjQUErQixXQUEvQjtBQUNEOztBQUNELEVBQUEsUUFBUSxDQUFDLFdBQVQsR0FBdUIsUUFBUSxDQUFDLElBQVQsQ0FBYyxJQUFkLENBQXZCO0FBRUEsU0FBTyxXQUFQO0FBQ0QsQ0EzTkQ7QUE2TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBc0IsQ0FBQyxTQUFELEVBQWU7QUFDekMsTUFBSSxTQUFTLENBQUMsUUFBZCxFQUF3Qjs7QUFDeEIsK0JBQXVELG9CQUFvQixDQUN6RSxTQUR5RSxDQUEzRTtBQUFBLE1BQVEsVUFBUiwwQkFBUSxVQUFSO0FBQUEsTUFBb0IsWUFBcEIsMEJBQW9CLFlBQXBCO0FBQUEsTUFBa0MsT0FBbEMsMEJBQWtDLE9BQWxDO0FBQUEsTUFBMkMsT0FBM0MsMEJBQTJDLE9BQTNDOztBQUdBLE1BQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxZQUFELEVBQWUsQ0FBZixDQUFuQjtBQUNBLEVBQUEsSUFBSSxHQUFHLHdCQUF3QixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLENBQS9CO0FBQ0EsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQUQsRUFBYSxJQUFiLENBQWxDO0FBRUEsTUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQVosQ0FBMEIsc0JBQTFCLENBQWxCOztBQUNBLE1BQUksV0FBVyxDQUFDLFFBQWhCLEVBQTBCO0FBQ3hCLElBQUEsV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFaLENBQTBCLG9CQUExQixDQUFkO0FBQ0Q7O0FBQ0QsRUFBQSxXQUFXLENBQUMsS0FBWjtBQUNELENBZEQ7QUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxvQkFBb0IsR0FBRyxTQUF2QixvQkFBdUIsQ0FBQyxTQUFELEVBQWU7QUFDMUMsTUFBSSxTQUFTLENBQUMsUUFBZCxFQUF3Qjs7QUFDeEIsK0JBQXVELG9CQUFvQixDQUN6RSxTQUR5RSxDQUEzRTtBQUFBLE1BQVEsVUFBUiwwQkFBUSxVQUFSO0FBQUEsTUFBb0IsWUFBcEIsMEJBQW9CLFlBQXBCO0FBQUEsTUFBa0MsT0FBbEMsMEJBQWtDLE9BQWxDO0FBQUEsTUFBMkMsT0FBM0MsMEJBQTJDLE9BQTNDOztBQUdBLE1BQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxZQUFELEVBQWUsQ0FBZixDQUFwQjtBQUNBLEVBQUEsSUFBSSxHQUFHLHdCQUF3QixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLENBQS9CO0FBQ0EsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQUQsRUFBYSxJQUFiLENBQWxDO0FBRUEsTUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQVosQ0FBMEIsdUJBQTFCLENBQWxCOztBQUNBLE1BQUksV0FBVyxDQUFDLFFBQWhCLEVBQTBCO0FBQ3hCLElBQUEsV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFaLENBQTBCLG9CQUExQixDQUFkO0FBQ0Q7O0FBQ0QsRUFBQSxXQUFXLENBQUMsS0FBWjtBQUNELENBZEQ7QUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBbUIsQ0FBQyxTQUFELEVBQWU7QUFDdEMsTUFBSSxTQUFTLENBQUMsUUFBZCxFQUF3Qjs7QUFDeEIsZ0NBQXVELG9CQUFvQixDQUN6RSxTQUR5RSxDQUEzRTtBQUFBLE1BQVEsVUFBUiwyQkFBUSxVQUFSO0FBQUEsTUFBb0IsWUFBcEIsMkJBQW9CLFlBQXBCO0FBQUEsTUFBa0MsT0FBbEMsMkJBQWtDLE9BQWxDO0FBQUEsTUFBMkMsT0FBM0MsMkJBQTJDLE9BQTNDOztBQUdBLE1BQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxZQUFELEVBQWUsQ0FBZixDQUFwQjtBQUNBLEVBQUEsSUFBSSxHQUFHLHdCQUF3QixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLENBQS9CO0FBQ0EsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQUQsRUFBYSxJQUFiLENBQWxDO0FBRUEsTUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQVosQ0FBMEIsbUJBQTFCLENBQWxCOztBQUNBLE1BQUksV0FBVyxDQUFDLFFBQWhCLEVBQTBCO0FBQ3hCLElBQUEsV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFaLENBQTBCLG9CQUExQixDQUFkO0FBQ0Q7O0FBQ0QsRUFBQSxXQUFXLENBQUMsS0FBWjtBQUNELENBZEQ7QUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBa0IsQ0FBQyxTQUFELEVBQWU7QUFDckMsTUFBSSxTQUFTLENBQUMsUUFBZCxFQUF3Qjs7QUFDeEIsZ0NBQXVELG9CQUFvQixDQUN6RSxTQUR5RSxDQUEzRTtBQUFBLE1BQVEsVUFBUiwyQkFBUSxVQUFSO0FBQUEsTUFBb0IsWUFBcEIsMkJBQW9CLFlBQXBCO0FBQUEsTUFBa0MsT0FBbEMsMkJBQWtDLE9BQWxDO0FBQUEsTUFBMkMsT0FBM0MsMkJBQTJDLE9BQTNDOztBQUdBLE1BQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxZQUFELEVBQWUsQ0FBZixDQUFuQjtBQUNBLEVBQUEsSUFBSSxHQUFHLHdCQUF3QixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLENBQS9CO0FBQ0EsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQUQsRUFBYSxJQUFiLENBQWxDO0FBRUEsTUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQVosQ0FBMEIsa0JBQTFCLENBQWxCOztBQUNBLE1BQUksV0FBVyxDQUFDLFFBQWhCLEVBQTBCO0FBQ3hCLElBQUEsV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFaLENBQTBCLG9CQUExQixDQUFkO0FBQ0Q7O0FBQ0QsRUFBQSxXQUFXLENBQUMsS0FBWjtBQUNELENBZEQ7QUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxZQUFZLEdBQUcsU0FBZixZQUFlLENBQUMsRUFBRCxFQUFRO0FBQzNCLGdDQUErQyxvQkFBb0IsQ0FBQyxFQUFELENBQW5FO0FBQUEsTUFBUSxZQUFSLDJCQUFRLFlBQVI7QUFBQSxNQUFzQixVQUF0QiwyQkFBc0IsVUFBdEI7QUFBQSxNQUFrQyxRQUFsQywyQkFBa0MsUUFBbEM7O0FBRUEsRUFBQSxZQUFZLENBQUMsU0FBYixDQUF1QixNQUF2QixDQUE4Qix3QkFBOUI7QUFDQSxFQUFBLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLElBQXBCO0FBQ0EsRUFBQSxRQUFRLENBQUMsV0FBVCxHQUF1QixFQUF2QjtBQUNELENBTkQ7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQWEsQ0FBQyxjQUFELEVBQW9CO0FBQ3JDLE1BQUksY0FBYyxDQUFDLFFBQW5CLEVBQTZCOztBQUU3QixnQ0FBMEMsb0JBQW9CLENBQzVELGNBRDRELENBQTlEO0FBQUEsTUFBUSxZQUFSLDJCQUFRLFlBQVI7QUFBQSxNQUFzQixlQUF0QiwyQkFBc0IsZUFBdEI7O0FBR0EsRUFBQSxnQkFBZ0IsQ0FBQyxjQUFELEVBQWlCLGNBQWMsQ0FBQyxPQUFmLENBQXVCLEtBQXhDLENBQWhCO0FBQ0EsRUFBQSxZQUFZLENBQUMsWUFBRCxDQUFaO0FBRUEsRUFBQSxlQUFlLENBQUMsS0FBaEI7QUFDRCxDQVZEO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBaUIsQ0FBQyxFQUFELEVBQVE7QUFDN0IsTUFBSSxFQUFFLENBQUMsUUFBUCxFQUFpQjs7QUFDakIsZ0NBTUksb0JBQW9CLENBQUMsRUFBRCxDQU54QjtBQUFBLE1BQ0UsVUFERiwyQkFDRSxVQURGO0FBQUEsTUFFRSxTQUZGLDJCQUVFLFNBRkY7QUFBQSxNQUdFLE9BSEYsMkJBR0UsT0FIRjtBQUFBLE1BSUUsT0FKRiwyQkFJRSxPQUpGO0FBQUEsTUFLRSxXQUxGLDJCQUtFLFdBTEY7O0FBUUEsTUFBSSxVQUFVLENBQUMsTUFBZixFQUF1QjtBQUNyQixRQUFNLGFBQWEsR0FBRyx3QkFBd0IsQ0FDNUMsU0FBUyxJQUFJLFdBQWIsSUFBNEIsS0FBSyxFQURXLEVBRTVDLE9BRjRDLEVBRzVDLE9BSDRDLENBQTlDO0FBS0EsUUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLFVBQUQsRUFBYSxhQUFiLENBQWxDO0FBQ0EsSUFBQSxXQUFXLENBQUMsYUFBWixDQUEwQixxQkFBMUIsRUFBaUQsS0FBakQ7QUFDRCxHQVJELE1BUU87QUFDTCxJQUFBLFlBQVksQ0FBQyxFQUFELENBQVo7QUFDRDtBQUNGLENBckJEO0FBdUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sdUJBQXVCLEdBQUcsU0FBMUIsdUJBQTBCLENBQUMsRUFBRCxFQUFRO0FBQ3RDLGdDQUFvRCxvQkFBb0IsQ0FBQyxFQUFELENBQXhFO0FBQUEsTUFBUSxVQUFSLDJCQUFRLFVBQVI7QUFBQSxNQUFvQixTQUFwQiwyQkFBb0IsU0FBcEI7QUFBQSxNQUErQixPQUEvQiwyQkFBK0IsT0FBL0I7QUFBQSxNQUF3QyxPQUF4QywyQkFBd0MsT0FBeEM7O0FBQ0EsTUFBTSxhQUFhLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBbEM7O0FBRUEsTUFBSSxhQUFhLElBQUksU0FBckIsRUFBZ0M7QUFDOUIsUUFBTSxhQUFhLEdBQUcsd0JBQXdCLENBQUMsU0FBRCxFQUFZLE9BQVosRUFBcUIsT0FBckIsQ0FBOUM7QUFDQSxJQUFBLGNBQWMsQ0FBQyxVQUFELEVBQWEsYUFBYixDQUFkO0FBQ0Q7QUFDRixDQVJELEMsQ0FVQTtBQUVBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxxQkFBcUIsR0FBRyxTQUF4QixxQkFBd0IsQ0FBQyxFQUFELEVBQUssY0FBTCxFQUF3QjtBQUNwRCxnQ0FNSSxvQkFBb0IsQ0FBQyxFQUFELENBTnhCO0FBQUEsTUFDRSxVQURGLDJCQUNFLFVBREY7QUFBQSxNQUVFLFFBRkYsMkJBRUUsUUFGRjtBQUFBLE1BR0UsWUFIRiwyQkFHRSxZQUhGO0FBQUEsTUFJRSxPQUpGLDJCQUlFLE9BSkY7QUFBQSxNQUtFLE9BTEYsMkJBS0UsT0FMRjs7QUFRQSxNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsUUFBYixFQUF0QjtBQUNBLE1BQU0sWUFBWSxHQUFHLGNBQWMsSUFBSSxJQUFsQixHQUF5QixhQUF6QixHQUF5QyxjQUE5RDtBQUVBLE1BQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxHQUFiLENBQWlCLFVBQUMsS0FBRCxFQUFRLEtBQVIsRUFBa0I7QUFDaEQsUUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFlBQUQsRUFBZSxLQUFmLENBQTdCO0FBRUEsUUFBTSxVQUFVLEdBQUcsMkJBQTJCLENBQzVDLFlBRDRDLEVBRTVDLE9BRjRDLEVBRzVDLE9BSDRDLENBQTlDO0FBTUEsUUFBSSxRQUFRLEdBQUcsSUFBZjtBQUVBLFFBQU0sT0FBTyxHQUFHLENBQUMsb0JBQUQsQ0FBaEI7QUFDQSxRQUFNLFVBQVUsR0FBRyxLQUFLLEtBQUssYUFBN0I7O0FBRUEsUUFBSSxLQUFLLEtBQUssWUFBZCxFQUE0QjtBQUMxQixNQUFBLFFBQVEsR0FBRyxHQUFYO0FBQ0EsTUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLDRCQUFiO0FBQ0Q7O0FBRUQsUUFBSSxVQUFKLEVBQWdCO0FBQ2QsTUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLDZCQUFiO0FBQ0Q7O0FBRUQsMkVBRWdCLFFBRmhCLGlDQUdhLE9BQU8sQ0FBQyxJQUFSLENBQWEsR0FBYixDQUhiLHVDQUlrQixLQUpsQixzQ0FLa0IsS0FMbEIseUNBTXFCLFVBQVUsR0FBRyxNQUFILEdBQVksT0FOM0MseUJBT00sVUFBVSw2QkFBMkIsRUFQM0Msc0JBUUssS0FSTDtBQVNELEdBaENjLENBQWY7QUFrQ0EsTUFBTSxVQUFVLDBDQUFnQywyQkFBaEMscUNBQ0Usb0JBREYsK0RBR1IsY0FBYyxDQUFDLE1BQUQsRUFBUyxDQUFULENBSE4sNkNBQWhCO0FBUUEsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLFNBQVgsRUFBcEI7QUFDQSxFQUFBLFdBQVcsQ0FBQyxTQUFaLEdBQXdCLFVBQXhCO0FBQ0EsRUFBQSxVQUFVLENBQUMsVUFBWCxDQUFzQixZQUF0QixDQUFtQyxXQUFuQyxFQUFnRCxVQUFoRDtBQUVBLEVBQUEsUUFBUSxDQUFDLFdBQVQsR0FBdUIsaUJBQXZCO0FBRUEsU0FBTyxXQUFQO0FBQ0QsQ0E3REQ7QUErREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxXQUFXLEdBQUcsU0FBZCxXQUFjLENBQUMsT0FBRCxFQUFhO0FBQy9CLE1BQUksT0FBTyxDQUFDLFFBQVosRUFBc0I7O0FBQ3RCLGdDQUF1RCxvQkFBb0IsQ0FDekUsT0FEeUUsQ0FBM0U7QUFBQSxNQUFRLFVBQVIsMkJBQVEsVUFBUjtBQUFBLE1BQW9CLFlBQXBCLDJCQUFvQixZQUFwQjtBQUFBLE1BQWtDLE9BQWxDLDJCQUFrQyxPQUFsQztBQUFBLE1BQTJDLE9BQTNDLDJCQUEyQyxPQUEzQzs7QUFHQSxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsS0FBakIsRUFBd0IsRUFBeEIsQ0FBOUI7QUFDQSxNQUFJLElBQUksR0FBRyxRQUFRLENBQUMsWUFBRCxFQUFlLGFBQWYsQ0FBbkI7QUFDQSxFQUFBLElBQUksR0FBRyx3QkFBd0IsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixDQUEvQjtBQUNBLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFELEVBQWEsSUFBYixDQUFsQztBQUNBLEVBQUEsV0FBVyxDQUFDLGFBQVosQ0FBMEIscUJBQTFCLEVBQWlELEtBQWpEO0FBQ0QsQ0FWRCxDLENBWUE7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxvQkFBb0IsR0FBRyxTQUF2QixvQkFBdUIsQ0FBQyxFQUFELEVBQUssYUFBTCxFQUF1QjtBQUNsRCxnQ0FNSSxvQkFBb0IsQ0FBQyxFQUFELENBTnhCO0FBQUEsTUFDRSxVQURGLDJCQUNFLFVBREY7QUFBQSxNQUVFLFFBRkYsMkJBRUUsUUFGRjtBQUFBLE1BR0UsWUFIRiwyQkFHRSxZQUhGO0FBQUEsTUFJRSxPQUpGLDJCQUlFLE9BSkY7QUFBQSxNQUtFLE9BTEYsMkJBS0UsT0FMRjs7QUFRQSxNQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsV0FBYixFQUFyQjtBQUNBLE1BQU0sV0FBVyxHQUFHLGFBQWEsSUFBSSxJQUFqQixHQUF3QixZQUF4QixHQUF1QyxhQUEzRDtBQUVBLE1BQUksV0FBVyxHQUFHLFdBQWxCO0FBQ0EsRUFBQSxXQUFXLElBQUksV0FBVyxHQUFHLFVBQTdCO0FBQ0EsRUFBQSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksV0FBWixDQUFkO0FBRUEsTUFBTSxxQkFBcUIsR0FBRywwQkFBMEIsQ0FDdEQsT0FBTyxDQUFDLFlBQUQsRUFBZSxXQUFXLEdBQUcsQ0FBN0IsQ0FEK0MsRUFFdEQsT0FGc0QsRUFHdEQsT0FIc0QsQ0FBeEQ7QUFNQSxNQUFNLHFCQUFxQixHQUFHLDBCQUEwQixDQUN0RCxPQUFPLENBQUMsWUFBRCxFQUFlLFdBQVcsR0FBRyxVQUE3QixDQUQrQyxFQUV0RCxPQUZzRCxFQUd0RCxPQUhzRCxDQUF4RDtBQU1BLE1BQU0sS0FBSyxHQUFHLEVBQWQ7QUFDQSxNQUFJLFNBQVMsR0FBRyxXQUFoQjs7QUFDQSxTQUFPLEtBQUssQ0FBQyxNQUFOLEdBQWUsVUFBdEIsRUFBa0M7QUFDaEMsUUFBTSxVQUFVLEdBQUcsMEJBQTBCLENBQzNDLE9BQU8sQ0FBQyxZQUFELEVBQWUsU0FBZixDQURvQyxFQUUzQyxPQUYyQyxFQUczQyxPQUgyQyxDQUE3QztBQU1BLFFBQUksUUFBUSxHQUFHLElBQWY7QUFFQSxRQUFNLE9BQU8sR0FBRyxDQUFDLG1CQUFELENBQWhCO0FBQ0EsUUFBTSxVQUFVLEdBQUcsU0FBUyxLQUFLLFlBQWpDOztBQUVBLFFBQUksU0FBUyxLQUFLLFdBQWxCLEVBQStCO0FBQzdCLE1BQUEsUUFBUSxHQUFHLEdBQVg7QUFDQSxNQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsMkJBQWI7QUFDRDs7QUFFRCxRQUFJLFVBQUosRUFBZ0I7QUFDZCxNQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsNEJBQWI7QUFDRDs7QUFFRCxJQUFBLEtBQUssQ0FBQyxJQUFOLGlFQUdnQixRQUhoQixpQ0FJYSxPQUFPLENBQUMsSUFBUixDQUFhLEdBQWIsQ0FKYix1Q0FLa0IsU0FMbEIseUNBTXFCLFVBQVUsR0FBRyxNQUFILEdBQVksT0FOM0MseUJBT00sVUFBVSw2QkFBMkIsRUFQM0Msc0JBUUssU0FSTDtBQVVBLElBQUEsU0FBUyxJQUFJLENBQWI7QUFDRDs7QUFFRCxNQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsS0FBRCxFQUFRLENBQVIsQ0FBaEM7QUFFQSxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsU0FBWCxFQUFwQjtBQUNBLEVBQUEsV0FBVyxDQUFDLFNBQVosMENBQXFELDBCQUFyRCxxQ0FDa0Isb0JBRGxCLDJLQU91QixrQ0FQdkIsMERBUW9DLFVBUnBDLCtDQVNnQixxQkFBcUIsNkJBQTJCLEVBVGhFLCtIQWE0QixvQkFiNUIsbUZBZWtCLFNBZmxCLHNMQXNCdUIsOEJBdEJ2QiwwREF1Qm9DLFVBdkJwQyw0Q0F3QmdCLHFCQUFxQiw2QkFBMkIsRUF4QmhFO0FBK0JBLEVBQUEsVUFBVSxDQUFDLFVBQVgsQ0FBc0IsWUFBdEIsQ0FBbUMsV0FBbkMsRUFBZ0QsVUFBaEQ7QUFFQSxFQUFBLFFBQVEsQ0FBQyxXQUFULDJCQUF3QyxXQUF4QyxpQkFDRSxXQUFXLEdBQUcsVUFBZCxHQUEyQixDQUQ3QjtBQUlBLFNBQU8sV0FBUDtBQUNELENBekdEO0FBMkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sd0JBQXdCLEdBQUcsU0FBM0Isd0JBQTJCLENBQUMsRUFBRCxFQUFRO0FBQ3ZDLE1BQUksRUFBRSxDQUFDLFFBQVAsRUFBaUI7O0FBRWpCLGdDQUF1RCxvQkFBb0IsQ0FDekUsRUFEeUUsQ0FBM0U7QUFBQSxNQUFRLFVBQVIsMkJBQVEsVUFBUjtBQUFBLE1BQW9CLFlBQXBCLDJCQUFvQixZQUFwQjtBQUFBLE1BQWtDLE9BQWxDLDJCQUFrQyxPQUFsQztBQUFBLE1BQTJDLE9BQTNDLDJCQUEyQyxPQUEzQzs7QUFHQSxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsYUFBWCxDQUF5QixxQkFBekIsQ0FBZjtBQUNBLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBUixFQUFxQixFQUFyQixDQUE3QjtBQUVBLE1BQUksWUFBWSxHQUFHLFlBQVksR0FBRyxVQUFsQztBQUNBLEVBQUEsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLFlBQVosQ0FBZjtBQUVBLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxZQUFELEVBQWUsWUFBZixDQUFwQjtBQUNBLE1BQU0sVUFBVSxHQUFHLHdCQUF3QixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLENBQTNDO0FBQ0EsTUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQ3RDLFVBRHNDLEVBRXRDLFVBQVUsQ0FBQyxXQUFYLEVBRnNDLENBQXhDO0FBS0EsTUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQVosQ0FBMEIsNEJBQTFCLENBQWxCOztBQUNBLE1BQUksV0FBVyxDQUFDLFFBQWhCLEVBQTBCO0FBQ3hCLElBQUEsV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFaLENBQTBCLG9CQUExQixDQUFkO0FBQ0Q7O0FBQ0QsRUFBQSxXQUFXLENBQUMsS0FBWjtBQUNELENBeEJEO0FBMEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sb0JBQW9CLEdBQUcsU0FBdkIsb0JBQXVCLENBQUMsRUFBRCxFQUFRO0FBQ25DLE1BQUksRUFBRSxDQUFDLFFBQVAsRUFBaUI7O0FBRWpCLGdDQUF1RCxvQkFBb0IsQ0FDekUsRUFEeUUsQ0FBM0U7QUFBQSxNQUFRLFVBQVIsMkJBQVEsVUFBUjtBQUFBLE1BQW9CLFlBQXBCLDJCQUFvQixZQUFwQjtBQUFBLE1BQWtDLE9BQWxDLDJCQUFrQyxPQUFsQztBQUFBLE1BQTJDLE9BQTNDLDJCQUEyQyxPQUEzQzs7QUFHQSxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsYUFBWCxDQUF5QixxQkFBekIsQ0FBZjtBQUNBLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBUixFQUFxQixFQUFyQixDQUE3QjtBQUVBLE1BQUksWUFBWSxHQUFHLFlBQVksR0FBRyxVQUFsQztBQUNBLEVBQUEsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLFlBQVosQ0FBZjtBQUVBLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxZQUFELEVBQWUsWUFBZixDQUFwQjtBQUNBLE1BQU0sVUFBVSxHQUFHLHdCQUF3QixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLENBQTNDO0FBQ0EsTUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQ3RDLFVBRHNDLEVBRXRDLFVBQVUsQ0FBQyxXQUFYLEVBRnNDLENBQXhDO0FBS0EsTUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDLGFBQVosQ0FBMEIsd0JBQTFCLENBQWxCOztBQUNBLE1BQUksV0FBVyxDQUFDLFFBQWhCLEVBQTBCO0FBQ3hCLElBQUEsV0FBVyxHQUFHLFdBQVcsQ0FBQyxhQUFaLENBQTBCLG9CQUExQixDQUFkO0FBQ0Q7O0FBQ0QsRUFBQSxXQUFXLENBQUMsS0FBWjtBQUNELENBeEJEO0FBMEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBYSxDQUFDLE1BQUQsRUFBWTtBQUM3QixNQUFJLE1BQU0sQ0FBQyxRQUFYLEVBQXFCOztBQUNyQixnQ0FBdUQsb0JBQW9CLENBQ3pFLE1BRHlFLENBQTNFO0FBQUEsTUFBUSxVQUFSLDJCQUFRLFVBQVI7QUFBQSxNQUFvQixZQUFwQiwyQkFBb0IsWUFBcEI7QUFBQSxNQUFrQyxPQUFsQywyQkFBa0MsT0FBbEM7QUFBQSxNQUEyQyxPQUEzQywyQkFBMkMsT0FBM0M7O0FBR0EsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFSLEVBQW1CLEVBQW5CLENBQTdCO0FBQ0EsTUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFlBQUQsRUFBZSxZQUFmLENBQWxCO0FBQ0EsRUFBQSxJQUFJLEdBQUcsd0JBQXdCLENBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsT0FBaEIsQ0FBL0I7QUFDQSxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsVUFBRCxFQUFhLElBQWIsQ0FBbEM7QUFDQSxFQUFBLFdBQVcsQ0FBQyxhQUFaLENBQTBCLHFCQUExQixFQUFpRCxLQUFqRDtBQUNELENBVkQsQyxDQVlBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSx3QkFBd0IsR0FBRyxTQUEzQix3QkFBMkIsQ0FBQyxLQUFELEVBQVc7QUFDMUMsZ0NBQTBDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxNQUFQLENBQTlEO0FBQUEsTUFBUSxZQUFSLDJCQUFRLFlBQVI7QUFBQSxNQUFzQixlQUF0QiwyQkFBc0IsZUFBdEI7O0FBRUEsRUFBQSxZQUFZLENBQUMsWUFBRCxDQUFaO0FBQ0EsRUFBQSxlQUFlLENBQUMsS0FBaEI7QUFFQSxFQUFBLEtBQUssQ0FBQyxjQUFOO0FBQ0QsQ0FQRCxDLENBU0E7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLGNBQWMsR0FBRyxTQUFqQixjQUFpQixDQUFDLFlBQUQsRUFBa0I7QUFDdkMsU0FBTyxVQUFDLEtBQUQsRUFBVztBQUNoQixrQ0FBdUQsb0JBQW9CLENBQ3pFLEtBQUssQ0FBQyxNQURtRSxDQUEzRTtBQUFBLFFBQVEsVUFBUiwyQkFBUSxVQUFSO0FBQUEsUUFBb0IsWUFBcEIsMkJBQW9CLFlBQXBCO0FBQUEsUUFBa0MsT0FBbEMsMkJBQWtDLE9BQWxDO0FBQUEsUUFBMkMsT0FBM0MsMkJBQTJDLE9BQTNDOztBQUlBLFFBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxZQUFELENBQXpCO0FBRUEsUUFBTSxVQUFVLEdBQUcsd0JBQXdCLENBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsT0FBaEIsQ0FBM0M7O0FBQ0EsUUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFELEVBQWUsVUFBZixDQUFkLEVBQTBDO0FBQ3hDLFVBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxVQUFELEVBQWEsVUFBYixDQUFsQztBQUNBLE1BQUEsV0FBVyxDQUFDLGFBQVosQ0FBMEIscUJBQTFCLEVBQWlELEtBQWpEO0FBQ0Q7O0FBQ0QsSUFBQSxLQUFLLENBQUMsY0FBTjtBQUNELEdBYkQ7QUFjRCxDQWZEO0FBaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sZ0JBQWdCLEdBQUcsY0FBYyxDQUFDLFVBQUMsSUFBRDtBQUFBLFNBQVUsUUFBUSxDQUFDLElBQUQsRUFBTyxDQUFQLENBQWxCO0FBQUEsQ0FBRCxDQUF2QztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFEO0FBQUEsU0FBVSxRQUFRLENBQUMsSUFBRCxFQUFPLENBQVAsQ0FBbEI7QUFBQSxDQUFELENBQXpDO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQyxVQUFDLElBQUQ7QUFBQSxTQUFVLE9BQU8sQ0FBQyxJQUFELEVBQU8sQ0FBUCxDQUFqQjtBQUFBLENBQUQsQ0FBekM7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sbUJBQW1CLEdBQUcsY0FBYyxDQUFDLFVBQUMsSUFBRDtBQUFBLFNBQVUsT0FBTyxDQUFDLElBQUQsRUFBTyxDQUFQLENBQWpCO0FBQUEsQ0FBRCxDQUExQztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFEO0FBQUEsU0FBVSxXQUFXLENBQUMsSUFBRCxDQUFyQjtBQUFBLENBQUQsQ0FBekM7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0saUJBQWlCLEdBQUcsY0FBYyxDQUFDLFVBQUMsSUFBRDtBQUFBLFNBQVUsU0FBUyxDQUFDLElBQUQsQ0FBbkI7QUFBQSxDQUFELENBQXhDO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLHNCQUFzQixHQUFHLGNBQWMsQ0FBQyxVQUFDLElBQUQ7QUFBQSxTQUFVLFNBQVMsQ0FBQyxJQUFELEVBQU8sQ0FBUCxDQUFuQjtBQUFBLENBQUQsQ0FBN0M7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sb0JBQW9CLEdBQUcsY0FBYyxDQUFDLFVBQUMsSUFBRDtBQUFBLFNBQVUsU0FBUyxDQUFDLElBQUQsRUFBTyxDQUFQLENBQW5CO0FBQUEsQ0FBRCxDQUEzQztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSwyQkFBMkIsR0FBRyxjQUFjLENBQUMsVUFBQyxJQUFEO0FBQUEsU0FBVSxRQUFRLENBQUMsSUFBRCxFQUFPLENBQVAsQ0FBbEI7QUFBQSxDQUFELENBQWxEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLHlCQUF5QixHQUFHLGNBQWMsQ0FBQyxVQUFDLElBQUQ7QUFBQSxTQUFVLFFBQVEsQ0FBQyxJQUFELEVBQU8sQ0FBUCxDQUFsQjtBQUFBLENBQUQsQ0FBaEQ7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSx1QkFBdUIsR0FBRyxTQUExQix1QkFBMEIsQ0FBQyxNQUFELEVBQVk7QUFDMUMsTUFBSSxNQUFNLENBQUMsUUFBWCxFQUFxQjtBQUVyQixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBUCxDQUFlLG9CQUFmLENBQW5CO0FBRUEsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsT0FBWCxDQUFtQixLQUEvQztBQUNBLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBakM7QUFFQSxNQUFJLFNBQVMsS0FBSyxtQkFBbEIsRUFBdUM7QUFFdkMsTUFBTSxhQUFhLEdBQUcsZUFBZSxDQUFDLFNBQUQsQ0FBckM7QUFDQSxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsVUFBRCxFQUFhLGFBQWIsQ0FBbEM7QUFDQSxFQUFBLFdBQVcsQ0FBQyxhQUFaLENBQTBCLHFCQUExQixFQUFpRCxLQUFqRDtBQUNELENBYkQsQyxDQWVBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSwwQkFBMEIsR0FBRyxTQUE3QiwwQkFBNkIsQ0FBQyxhQUFELEVBQW1CO0FBQ3BELFNBQU8sVUFBQyxLQUFELEVBQVc7QUFDaEIsUUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQXRCO0FBQ0EsUUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEtBQWpCLEVBQXdCLEVBQXhCLENBQTlCOztBQUNBLGtDQUF1RCxvQkFBb0IsQ0FDekUsT0FEeUUsQ0FBM0U7QUFBQSxRQUFRLFVBQVIsMkJBQVEsVUFBUjtBQUFBLFFBQW9CLFlBQXBCLDJCQUFvQixZQUFwQjtBQUFBLFFBQWtDLE9BQWxDLDJCQUFrQyxPQUFsQztBQUFBLFFBQTJDLE9BQTNDLDJCQUEyQyxPQUEzQzs7QUFHQSxRQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsWUFBRCxFQUFlLGFBQWYsQ0FBNUI7QUFFQSxRQUFJLGFBQWEsR0FBRyxhQUFhLENBQUMsYUFBRCxDQUFqQztBQUNBLElBQUEsYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUksQ0FBQyxHQUFMLENBQVMsRUFBVCxFQUFhLGFBQWIsQ0FBWixDQUFoQjtBQUVBLFFBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxZQUFELEVBQWUsYUFBZixDQUFyQjtBQUNBLFFBQU0sVUFBVSxHQUFHLHdCQUF3QixDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE9BQWhCLENBQTNDOztBQUNBLFFBQUksQ0FBQyxXQUFXLENBQUMsV0FBRCxFQUFjLFVBQWQsQ0FBaEIsRUFBMkM7QUFDekMsVUFBTSxXQUFXLEdBQUcscUJBQXFCLENBQ3ZDLFVBRHVDLEVBRXZDLFVBQVUsQ0FBQyxRQUFYLEVBRnVDLENBQXpDO0FBSUEsTUFBQSxXQUFXLENBQUMsYUFBWixDQUEwQixzQkFBMUIsRUFBa0QsS0FBbEQ7QUFDRDs7QUFDRCxJQUFBLEtBQUssQ0FBQyxjQUFOO0FBQ0QsR0FyQkQ7QUFzQkQsQ0F2QkQ7QUF5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSxpQkFBaUIsR0FBRywwQkFBMEIsQ0FBQyxVQUFDLEtBQUQ7QUFBQSxTQUFXLEtBQUssR0FBRyxDQUFuQjtBQUFBLENBQUQsQ0FBcEQ7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sbUJBQW1CLEdBQUcsMEJBQTBCLENBQUMsVUFBQyxLQUFEO0FBQUEsU0FBVyxLQUFLLEdBQUcsQ0FBbkI7QUFBQSxDQUFELENBQXREO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLG1CQUFtQixHQUFHLDBCQUEwQixDQUFDLFVBQUMsS0FBRDtBQUFBLFNBQVcsS0FBSyxHQUFHLENBQW5CO0FBQUEsQ0FBRCxDQUF0RDtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSxvQkFBb0IsR0FBRywwQkFBMEIsQ0FBQyxVQUFDLEtBQUQ7QUFBQSxTQUFXLEtBQUssR0FBRyxDQUFuQjtBQUFBLENBQUQsQ0FBdkQ7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sbUJBQW1CLEdBQUcsMEJBQTBCLENBQ3BELFVBQUMsS0FBRDtBQUFBLFNBQVcsS0FBSyxHQUFJLEtBQUssR0FBRyxDQUE1QjtBQUFBLENBRG9ELENBQXREO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLGtCQUFrQixHQUFHLDBCQUEwQixDQUNuRCxVQUFDLEtBQUQ7QUFBQSxTQUFXLEtBQUssR0FBRyxDQUFSLEdBQWEsS0FBSyxHQUFHLENBQWhDO0FBQUEsQ0FEbUQsQ0FBckQ7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sdUJBQXVCLEdBQUcsMEJBQTBCLENBQUM7QUFBQSxTQUFNLEVBQU47QUFBQSxDQUFELENBQTFEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLHFCQUFxQixHQUFHLDBCQUEwQixDQUFDO0FBQUEsU0FBTSxDQUFOO0FBQUEsQ0FBRCxDQUF4RDtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLHdCQUF3QixHQUFHLFNBQTNCLHdCQUEyQixDQUFDLE9BQUQsRUFBYTtBQUM1QyxNQUFJLE9BQU8sQ0FBQyxRQUFaLEVBQXNCO0FBQ3RCLE1BQUksT0FBTyxDQUFDLFNBQVIsQ0FBa0IsUUFBbEIsQ0FBMkIsNEJBQTNCLENBQUosRUFBOEQ7QUFFOUQsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEtBQWpCLEVBQXdCLEVBQXhCLENBQTNCO0FBRUEsTUFBTSxXQUFXLEdBQUcscUJBQXFCLENBQUMsT0FBRCxFQUFVLFVBQVYsQ0FBekM7QUFDQSxFQUFBLFdBQVcsQ0FBQyxhQUFaLENBQTBCLHNCQUExQixFQUFrRCxLQUFsRDtBQUNELENBUkQsQyxDQVVBO0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsSUFBTSx5QkFBeUIsR0FBRyxTQUE1Qix5QkFBNEIsQ0FBQyxZQUFELEVBQWtCO0FBQ2xELFNBQU8sVUFBQyxLQUFELEVBQVc7QUFDaEIsUUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQXJCO0FBQ0EsUUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBaEIsRUFBdUIsRUFBdkIsQ0FBN0I7O0FBQ0Esa0NBQXVELG9CQUFvQixDQUN6RSxNQUR5RSxDQUEzRTtBQUFBLFFBQVEsVUFBUiwyQkFBUSxVQUFSO0FBQUEsUUFBb0IsWUFBcEIsMkJBQW9CLFlBQXBCO0FBQUEsUUFBa0MsT0FBbEMsMkJBQWtDLE9BQWxDO0FBQUEsUUFBMkMsT0FBM0MsMkJBQTJDLE9BQTNDOztBQUdBLFFBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxZQUFELEVBQWUsWUFBZixDQUEzQjtBQUVBLFFBQUksWUFBWSxHQUFHLFlBQVksQ0FBQyxZQUFELENBQS9CO0FBQ0EsSUFBQSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksWUFBWixDQUFmO0FBRUEsUUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFlBQUQsRUFBZSxZQUFmLENBQXBCO0FBQ0EsUUFBTSxVQUFVLEdBQUcsd0JBQXdCLENBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsT0FBaEIsQ0FBM0M7O0FBQ0EsUUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFELEVBQWMsVUFBZCxDQUFmLEVBQTBDO0FBQ3hDLFVBQU0sV0FBVyxHQUFHLG9CQUFvQixDQUN0QyxVQURzQyxFQUV0QyxVQUFVLENBQUMsV0FBWCxFQUZzQyxDQUF4QztBQUlBLE1BQUEsV0FBVyxDQUFDLGFBQVosQ0FBMEIscUJBQTFCLEVBQWlELEtBQWpEO0FBQ0Q7O0FBQ0QsSUFBQSxLQUFLLENBQUMsY0FBTjtBQUNELEdBckJEO0FBc0JELENBdkJEO0FBeUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLElBQU0sZ0JBQWdCLEdBQUcseUJBQXlCLENBQUMsVUFBQyxJQUFEO0FBQUEsU0FBVSxJQUFJLEdBQUcsQ0FBakI7QUFBQSxDQUFELENBQWxEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLGtCQUFrQixHQUFHLHlCQUF5QixDQUFDLFVBQUMsSUFBRDtBQUFBLFNBQVUsSUFBSSxHQUFHLENBQWpCO0FBQUEsQ0FBRCxDQUFwRDtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSxrQkFBa0IsR0FBRyx5QkFBeUIsQ0FBQyxVQUFDLElBQUQ7QUFBQSxTQUFVLElBQUksR0FBRyxDQUFqQjtBQUFBLENBQUQsQ0FBcEQ7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sbUJBQW1CLEdBQUcseUJBQXlCLENBQUMsVUFBQyxJQUFEO0FBQUEsU0FBVSxJQUFJLEdBQUcsQ0FBakI7QUFBQSxDQUFELENBQXJEO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLGtCQUFrQixHQUFHLHlCQUF5QixDQUNsRCxVQUFDLElBQUQ7QUFBQSxTQUFVLElBQUksR0FBSSxJQUFJLEdBQUcsQ0FBekI7QUFBQSxDQURrRCxDQUFwRDtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsSUFBTSxpQkFBaUIsR0FBRyx5QkFBeUIsQ0FDakQsVUFBQyxJQUFEO0FBQUEsU0FBVSxJQUFJLEdBQUcsQ0FBUCxHQUFZLElBQUksR0FBRyxDQUE3QjtBQUFBLENBRGlELENBQW5EO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLG9CQUFvQixHQUFHLHlCQUF5QixDQUNwRCxVQUFDLElBQUQ7QUFBQSxTQUFVLElBQUksR0FBRyxVQUFqQjtBQUFBLENBRG9ELENBQXREO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxJQUFNLHNCQUFzQixHQUFHLHlCQUF5QixDQUN0RCxVQUFDLElBQUQ7QUFBQSxTQUFVLElBQUksR0FBRyxVQUFqQjtBQUFBLENBRHNELENBQXhEO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sdUJBQXVCLEdBQUcsU0FBMUIsdUJBQTBCLENBQUMsTUFBRCxFQUFZO0FBQzFDLE1BQUksTUFBTSxDQUFDLFFBQVgsRUFBcUI7QUFDckIsTUFBSSxNQUFNLENBQUMsU0FBUCxDQUFpQixRQUFqQixDQUEwQiwyQkFBMUIsQ0FBSixFQUE0RDtBQUU1RCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQVAsQ0FBZSxLQUFoQixFQUF1QixFQUF2QixDQUExQjtBQUVBLE1BQU0sV0FBVyxHQUFHLG9CQUFvQixDQUFDLE1BQUQsRUFBUyxTQUFULENBQXhDO0FBQ0EsRUFBQSxXQUFXLENBQUMsYUFBWixDQUEwQixxQkFBMUIsRUFBaUQsS0FBakQ7QUFDRCxDQVJELEMsQ0FVQTtBQUVBOzs7QUFFQSxJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQWEsQ0FBQyxTQUFELEVBQWU7QUFDaEMsTUFBTSxtQkFBbUIsR0FBRyxTQUF0QixtQkFBc0IsQ0FBQyxFQUFELEVBQVE7QUFDbEMsa0NBQXVCLG9CQUFvQixDQUFDLEVBQUQsQ0FBM0M7QUFBQSxRQUFRLFVBQVIsMkJBQVEsVUFBUjs7QUFDQSxRQUFNLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxTQUFELEVBQVksVUFBWixDQUFoQztBQUVBLFFBQU0sYUFBYSxHQUFHLENBQXRCO0FBQ0EsUUFBTSxZQUFZLEdBQUcsaUJBQWlCLENBQUMsTUFBbEIsR0FBMkIsQ0FBaEQ7QUFDQSxRQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxhQUFELENBQXRDO0FBQ0EsUUFBTSxXQUFXLEdBQUcsaUJBQWlCLENBQUMsWUFBRCxDQUFyQztBQUNBLFFBQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDLE9BQWxCLENBQTBCLGFBQWEsRUFBdkMsQ0FBbkI7QUFFQSxRQUFNLFNBQVMsR0FBRyxVQUFVLEtBQUssWUFBakM7QUFDQSxRQUFNLFVBQVUsR0FBRyxVQUFVLEtBQUssYUFBbEM7QUFDQSxRQUFNLFVBQVUsR0FBRyxVQUFVLEtBQUssQ0FBQyxDQUFuQztBQUVBLFdBQU87QUFDTCxNQUFBLGlCQUFpQixFQUFqQixpQkFESztBQUVMLE1BQUEsVUFBVSxFQUFWLFVBRks7QUFHTCxNQUFBLFlBQVksRUFBWixZQUhLO0FBSUwsTUFBQSxVQUFVLEVBQVYsVUFKSztBQUtMLE1BQUEsV0FBVyxFQUFYLFdBTEs7QUFNTCxNQUFBLFNBQVMsRUFBVDtBQU5LLEtBQVA7QUFRRCxHQXRCRDs7QUF3QkEsU0FBTztBQUNMLElBQUEsUUFESyxvQkFDSSxLQURKLEVBQ1c7QUFDZCxpQ0FBZ0QsbUJBQW1CLENBQ2pFLEtBQUssQ0FBQyxNQUQyRCxDQUFuRTtBQUFBLFVBQVEsWUFBUix3QkFBUSxZQUFSO0FBQUEsVUFBc0IsU0FBdEIsd0JBQXNCLFNBQXRCO0FBQUEsVUFBaUMsVUFBakMsd0JBQWlDLFVBQWpDOztBQUlBLFVBQUksU0FBUyxJQUFJLFVBQWpCLEVBQTZCO0FBQzNCLFFBQUEsS0FBSyxDQUFDLGNBQU47QUFDQSxRQUFBLFlBQVksQ0FBQyxLQUFiO0FBQ0Q7QUFDRixLQVZJO0FBV0wsSUFBQSxPQVhLLG1CQVdHLEtBWEgsRUFXVTtBQUNiLGtDQUFnRCxtQkFBbUIsQ0FDakUsS0FBSyxDQUFDLE1BRDJELENBQW5FO0FBQUEsVUFBUSxXQUFSLHlCQUFRLFdBQVI7QUFBQSxVQUFxQixVQUFyQix5QkFBcUIsVUFBckI7QUFBQSxVQUFpQyxVQUFqQyx5QkFBaUMsVUFBakM7O0FBSUEsVUFBSSxVQUFVLElBQUksVUFBbEIsRUFBOEI7QUFDNUIsUUFBQSxLQUFLLENBQUMsY0FBTjtBQUNBLFFBQUEsV0FBVyxDQUFDLEtBQVo7QUFDRDtBQUNGO0FBcEJJLEdBQVA7QUFzQkQsQ0EvQ0Q7O0FBaURBLElBQU0seUJBQXlCLEdBQUcsVUFBVSxDQUFDLHFCQUFELENBQTVDO0FBQ0EsSUFBTSwwQkFBMEIsR0FBRyxVQUFVLENBQUMsc0JBQUQsQ0FBN0M7QUFDQSxJQUFNLHlCQUF5QixHQUFHLFVBQVUsQ0FBQyxxQkFBRCxDQUE1QyxDLENBRUE7QUFFQTs7QUFFQSxJQUFNLGdCQUFnQiwrREFDbkIsS0FEbUIsd0NBRWpCLGtCQUZpQixjQUVLO0FBQ3JCLEVBQUEsY0FBYyxDQUFDLElBQUQsQ0FBZDtBQUNELENBSmlCLDJCQUtqQixhQUxpQixjQUtBO0FBQ2hCLEVBQUEsVUFBVSxDQUFDLElBQUQsQ0FBVjtBQUNELENBUGlCLDJCQVFqQixjQVJpQixjQVFDO0FBQ2pCLEVBQUEsV0FBVyxDQUFDLElBQUQsQ0FBWDtBQUNELENBVmlCLDJCQVdqQixhQVhpQixjQVdBO0FBQ2hCLEVBQUEsVUFBVSxDQUFDLElBQUQsQ0FBVjtBQUNELENBYmlCLDJCQWNqQix1QkFkaUIsY0FjVTtBQUMxQixFQUFBLG9CQUFvQixDQUFDLElBQUQsQ0FBcEI7QUFDRCxDQWhCaUIsMkJBaUJqQixtQkFqQmlCLGNBaUJNO0FBQ3RCLEVBQUEsZ0JBQWdCLENBQUMsSUFBRCxDQUFoQjtBQUNELENBbkJpQiwyQkFvQmpCLHNCQXBCaUIsY0FvQlM7QUFDekIsRUFBQSxtQkFBbUIsQ0FBQyxJQUFELENBQW5CO0FBQ0QsQ0F0QmlCLDJCQXVCakIsa0JBdkJpQixjQXVCSztBQUNyQixFQUFBLGVBQWUsQ0FBQyxJQUFELENBQWY7QUFDRCxDQXpCaUIsMkJBMEJqQiw0QkExQmlCLGNBMEJlO0FBQy9CLEVBQUEsd0JBQXdCLENBQUMsSUFBRCxDQUF4QjtBQUNELENBNUJpQiwyQkE2QmpCLHdCQTdCaUIsY0E2Qlc7QUFDM0IsRUFBQSxvQkFBb0IsQ0FBQyxJQUFELENBQXBCO0FBQ0QsQ0EvQmlCLDJCQWdDakIsd0JBaENpQixjQWdDVztBQUMzQixNQUFNLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQyxJQUFELENBQXpDO0FBQ0EsRUFBQSxXQUFXLENBQUMsYUFBWixDQUEwQixzQkFBMUIsRUFBa0QsS0FBbEQ7QUFDRCxDQW5DaUIsMkJBb0NqQix1QkFwQ2lCLGNBb0NVO0FBQzFCLE1BQU0sV0FBVyxHQUFHLG9CQUFvQixDQUFDLElBQUQsQ0FBeEM7QUFDQSxFQUFBLFdBQVcsQ0FBQyxhQUFaLENBQTBCLHFCQUExQixFQUFpRCxLQUFqRDtBQUNELENBdkNpQiw2RUEwQ2pCLG9CQTFDaUIsWUEwQ0ssS0ExQ0wsRUEwQ1k7QUFDNUIsTUFBTSxPQUFPLEdBQUcsS0FBSyxPQUFMLENBQWEsY0FBN0I7O0FBQ0EsTUFBSSxVQUFHLEtBQUssQ0FBQyxPQUFULE1BQXVCLE9BQTNCLEVBQW9DO0FBQ2xDLElBQUEsS0FBSyxDQUFDLGNBQU47QUFDRDtBQUNGLENBL0NpQiw0RkFrRGpCLDBCQWxEaUIsWUFrRFcsS0FsRFgsRUFrRGtCO0FBQ2xDLE1BQUksS0FBSyxDQUFDLE9BQU4sS0FBa0IsYUFBdEIsRUFBcUM7QUFDbkMsSUFBQSxpQkFBaUIsQ0FBQyxJQUFELENBQWpCO0FBQ0Q7QUFDRixDQXREaUIsNkJBdURqQixhQXZEaUIsRUF1REQsUUFBUSxDQUFDLE1BQVQsQ0FBZ0I7QUFDL0IsRUFBQSxFQUFFLEVBQUUsZ0JBRDJCO0FBRS9CLEVBQUEsT0FBTyxFQUFFLGdCQUZzQjtBQUcvQixFQUFBLElBQUksRUFBRSxrQkFIeUI7QUFJL0IsRUFBQSxTQUFTLEVBQUUsa0JBSm9CO0FBSy9CLEVBQUEsSUFBSSxFQUFFLGtCQUx5QjtBQU0vQixFQUFBLFNBQVMsRUFBRSxrQkFOb0I7QUFPL0IsRUFBQSxLQUFLLEVBQUUsbUJBUHdCO0FBUS9CLEVBQUEsVUFBVSxFQUFFLG1CQVJtQjtBQVMvQixFQUFBLElBQUksRUFBRSxrQkFUeUI7QUFVL0IsRUFBQSxHQUFHLEVBQUUsaUJBVjBCO0FBVy9CLEVBQUEsUUFBUSxFQUFFLHNCQVhxQjtBQVkvQixFQUFBLE1BQU0sRUFBRSxvQkFadUI7QUFhL0Isb0JBQWtCLDJCQWJhO0FBYy9CLGtCQUFnQjtBQWRlLENBQWhCLENBdkRDLDZCQXVFakIsb0JBdkVpQixFQXVFTSxRQUFRLENBQUMsTUFBVCxDQUFnQjtBQUN0QyxFQUFBLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxRQURPO0FBRXRDLGVBQWEseUJBQXlCLENBQUM7QUFGRCxDQUFoQixDQXZFTiw2QkEyRWpCLGNBM0VpQixFQTJFQSxRQUFRLENBQUMsTUFBVCxDQUFnQjtBQUNoQyxFQUFBLEVBQUUsRUFBRSxpQkFENEI7QUFFaEMsRUFBQSxPQUFPLEVBQUUsaUJBRnVCO0FBR2hDLEVBQUEsSUFBSSxFQUFFLG1CQUgwQjtBQUloQyxFQUFBLFNBQVMsRUFBRSxtQkFKcUI7QUFLaEMsRUFBQSxJQUFJLEVBQUUsbUJBTDBCO0FBTWhDLEVBQUEsU0FBUyxFQUFFLG1CQU5xQjtBQU9oQyxFQUFBLEtBQUssRUFBRSxvQkFQeUI7QUFRaEMsRUFBQSxVQUFVLEVBQUUsb0JBUm9CO0FBU2hDLEVBQUEsSUFBSSxFQUFFLG1CQVQwQjtBQVVoQyxFQUFBLEdBQUcsRUFBRSxrQkFWMkI7QUFXaEMsRUFBQSxRQUFRLEVBQUUsdUJBWHNCO0FBWWhDLEVBQUEsTUFBTSxFQUFFO0FBWndCLENBQWhCLENBM0VBLDZCQXlGakIscUJBekZpQixFQXlGTyxRQUFRLENBQUMsTUFBVCxDQUFnQjtBQUN2QyxFQUFBLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxRQURPO0FBRXZDLGVBQWEsMEJBQTBCLENBQUM7QUFGRCxDQUFoQixDQXpGUCw2QkE2RmpCLGFBN0ZpQixFQTZGRCxRQUFRLENBQUMsTUFBVCxDQUFnQjtBQUMvQixFQUFBLEVBQUUsRUFBRSxnQkFEMkI7QUFFL0IsRUFBQSxPQUFPLEVBQUUsZ0JBRnNCO0FBRy9CLEVBQUEsSUFBSSxFQUFFLGtCQUh5QjtBQUkvQixFQUFBLFNBQVMsRUFBRSxrQkFKb0I7QUFLL0IsRUFBQSxJQUFJLEVBQUUsa0JBTHlCO0FBTS9CLEVBQUEsU0FBUyxFQUFFLGtCQU5vQjtBQU8vQixFQUFBLEtBQUssRUFBRSxtQkFQd0I7QUFRL0IsRUFBQSxVQUFVLEVBQUUsbUJBUm1CO0FBUy9CLEVBQUEsSUFBSSxFQUFFLGtCQVR5QjtBQVUvQixFQUFBLEdBQUcsRUFBRSxpQkFWMEI7QUFXL0IsRUFBQSxRQUFRLEVBQUUsc0JBWHFCO0FBWS9CLEVBQUEsTUFBTSxFQUFFO0FBWnVCLENBQWhCLENBN0ZDLDZCQTJHakIsb0JBM0dpQixFQTJHTSxRQUFRLENBQUMsTUFBVCxDQUFnQjtBQUN0QyxFQUFBLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxRQURPO0FBRXRDLGVBQWEseUJBQXlCLENBQUM7QUFGRCxDQUFoQixDQTNHTiw2QkErR2pCLG9CQS9HaUIsWUErR0ssS0EvR0wsRUErR1k7QUFDNUIsT0FBSyxPQUFMLENBQWEsY0FBYixHQUE4QixLQUFLLENBQUMsT0FBcEM7QUFDRCxDQWpIaUIsNkJBa0hqQixXQWxIaUIsWUFrSEosS0FsSEksRUFrSEc7QUFDbkIsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQVQsQ0FBZ0I7QUFDN0IsSUFBQSxNQUFNLEVBQUU7QUFEcUIsR0FBaEIsQ0FBZjtBQUlBLEVBQUEsTUFBTSxDQUFDLEtBQUQsQ0FBTjtBQUNELENBeEhpQiwwR0EySGpCLDBCQTNIaUIsY0EySGE7QUFDN0IsRUFBQSxpQkFBaUIsQ0FBQyxJQUFELENBQWpCO0FBQ0QsQ0E3SGlCLDhCQThIakIsV0E5SGlCLFlBOEhKLEtBOUhJLEVBOEhHO0FBQ25CLE1BQUksQ0FBQyxLQUFLLFFBQUwsQ0FBYyxLQUFLLENBQUMsYUFBcEIsQ0FBTCxFQUF5QztBQUN2QyxJQUFBLFlBQVksQ0FBQyxJQUFELENBQVo7QUFDRDtBQUNGLENBbElpQixnRkFxSWpCLDBCQXJJaUIsY0FxSWE7QUFDN0IsRUFBQSxvQkFBb0IsQ0FBQyxJQUFELENBQXBCO0FBQ0EsRUFBQSx1QkFBdUIsQ0FBQyxJQUFELENBQXZCO0FBQ0QsQ0F4SWlCLHNCQUF0Qjs7QUE0SUEsSUFBSSxDQUFDLFdBQVcsRUFBaEIsRUFBb0I7QUFBQTs7QUFDbEIsRUFBQSxnQkFBZ0IsQ0FBQyxTQUFqQix1RUFDRywyQkFESCxjQUNrQztBQUM5QixJQUFBLHVCQUF1QixDQUFDLElBQUQsQ0FBdkI7QUFDRCxHQUhILDBDQUlHLGNBSkgsY0FJcUI7QUFDakIsSUFBQSx3QkFBd0IsQ0FBQyxJQUFELENBQXhCO0FBQ0QsR0FOSCwwQ0FPRyxhQVBILGNBT29CO0FBQ2hCLElBQUEsdUJBQXVCLENBQUMsSUFBRCxDQUF2QjtBQUNELEdBVEg7QUFXRDs7QUFFRCxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsZ0JBQUQsRUFBbUI7QUFDNUMsRUFBQSxJQUQ0QyxnQkFDdkMsSUFEdUMsRUFDakM7QUFDVCxJQUFBLE1BQU0sQ0FBQyxXQUFELEVBQWMsSUFBZCxDQUFOLENBQTBCLE9BQTFCLENBQWtDLFVBQUMsWUFBRCxFQUFrQjtBQUNsRCxVQUFHLENBQUMsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsUUFBdkIsQ0FBZ0MsNkJBQWhDLENBQUosRUFBbUU7QUFDakUsUUFBQSxpQkFBaUIsQ0FBQyxZQUFELENBQWpCO0FBQ0Q7QUFDRixLQUpEO0FBS0QsR0FQMkM7QUFRNUMsRUFBQSxvQkFBb0IsRUFBcEIsb0JBUjRDO0FBUzVDLEVBQUEsT0FBTyxFQUFQLE9BVDRDO0FBVTVDLEVBQUEsTUFBTSxFQUFOLE1BVjRDO0FBVzVDLEVBQUEsa0JBQWtCLEVBQWxCLGtCQVg0QztBQVk1QyxFQUFBLGdCQUFnQixFQUFoQixnQkFaNEM7QUFhNUMsRUFBQSxpQkFBaUIsRUFBakIsaUJBYjRDO0FBYzVDLEVBQUEsY0FBYyxFQUFkLGNBZDRDO0FBZTVDLEVBQUEsdUJBQXVCLEVBQXZCO0FBZjRDLENBQW5CLENBQTNCLEMsQ0FrQkE7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBakI7OztBQ3RuRUE7Ozs7Ozs7QUFDQSxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBRCxDQUF4Qjs7QUFDQSxTQUFTLFlBQVQsQ0FBdUIsU0FBdkIsRUFBaUM7QUFDN0IsT0FBSyxTQUFMLEdBQWlCLFNBQWpCO0FBQ0EsT0FBSyxNQUFMLEdBQWMsU0FBUyxDQUFDLHNCQUFWLENBQWlDLHNCQUFqQyxFQUF5RCxDQUF6RCxDQUFkLENBRjZCLENBSTdCOztBQUNBLE1BQUcsQ0FBQyxLQUFLLFNBQUwsQ0FBZSxhQUFmLENBQTZCLHlDQUE3QixDQUFKLEVBQTRFO0FBQ3hFLFNBQUssU0FBTCxDQUFlLGdCQUFmLENBQWdDLG1CQUFoQyxFQUFxRCxDQUFyRCxFQUF3RCxZQUF4RCxDQUFxRSxlQUFyRSxFQUFzRixNQUF0RjtBQUNIOztBQUVELEVBQUEsbUJBQW1CLENBQUMsS0FBSyxTQUFOLENBQW5CO0FBQ0g7O0FBQ0QsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsSUFBdkIsR0FBOEIsWUFBVTtBQUNwQyxPQUFLLFlBQUwsR0FBb0IsSUFBSSxRQUFKLENBQWEsS0FBSyxNQUFsQixDQUFwQjtBQUVBLE1BQUksY0FBYyxHQUFHLEtBQUssU0FBTCxDQUFlLGdCQUFmLENBQWdDLDBCQUFoQyxDQUFyQjs7QUFDQSxPQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQWxDLEVBQTBDLENBQUMsRUFBM0MsRUFBOEM7QUFDMUMsUUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDLENBQUQsQ0FBM0I7QUFDQSxJQUFBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixPQUF4QixFQUFpQyxhQUFqQztBQUNIO0FBQ0osQ0FSRDs7QUFTQSxJQUFJLG1CQUFtQixHQUFHLFNBQXRCLG1CQUFzQixDQUFTLFNBQVQsRUFBbUI7QUFDekMsTUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLGFBQVYsQ0FBd0IseUNBQXhCLENBQW5CO0FBQ0EsRUFBQSxTQUFTLENBQUMsc0JBQVYsQ0FBaUMsc0JBQWpDLEVBQXlELENBQXpELEVBQTRELHNCQUE1RCxDQUFtRixnQkFBbkYsRUFBcUcsQ0FBckcsRUFBd0csU0FBeEcsR0FBb0gsWUFBWSxDQUFDLFNBQWpJO0FBQ0gsQ0FIRDs7QUFLQSxJQUFJLGFBQWEsR0FBRyxTQUFoQixhQUFnQixDQUFTLEtBQVQsRUFBZTtBQUMvQixNQUFJLEVBQUUsR0FBRyxLQUFLLFVBQWQ7QUFDQSxFQUFBLEVBQUUsQ0FBQyxVQUFILENBQWMsYUFBZCxDQUE0QiwwQkFBNUIsRUFBd0QsZUFBeEQsQ0FBd0UsZUFBeEU7QUFDQSxFQUFBLEVBQUUsQ0FBQyxZQUFILENBQWdCLGVBQWhCLEVBQWlDLE1BQWpDO0FBRUEsTUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLFVBQUgsQ0FBYyxVQUFkLENBQXlCLFVBQXpCLENBQW9DLHNCQUFwQyxDQUEyRCxzQkFBM0QsRUFBbUYsQ0FBbkYsQ0FBYjtBQUNBLE1BQUksYUFBYSxHQUFHLElBQUksS0FBSixDQUFVLHVCQUFWLENBQXBCO0FBQ0EsRUFBQSxhQUFhLENBQUMsTUFBZCxHQUF1QixJQUF2QjtBQUNBLEVBQUEsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsYUFBckI7QUFDQSxFQUFBLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxVQUFILENBQWMsVUFBZCxDQUF5QixVQUExQixDQUFuQjtBQUdBLE1BQUksWUFBWSxHQUFHLElBQUksUUFBSixDQUFhLE1BQWIsQ0FBbkI7QUFDQSxFQUFBLFlBQVksQ0FBQyxJQUFiO0FBQ0gsQ0FkRDs7ZUFnQmUsWTs7OztBQzNDZjs7Ozs7Ozs7QUFDQSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsc0JBQUQsQ0FBM0I7O0FBQ0EsSUFBTSxNQUFNLEdBQUcsY0FBZjtBQUNBLElBQU0sMEJBQTBCLEdBQUcsa0NBQW5DLEMsQ0FBdUU7O0FBQ3ZFLElBQU0sTUFBTSxHQUFHLGdCQUFmO0FBQ0EsSUFBTSxjQUFjLEdBQUcsb0JBQXZCO0FBQ0EsSUFBTSxhQUFhLEdBQUcsbUJBQXRCOztJQUVNLFE7QUFDSixvQkFBYSxFQUFiLEVBQWdCO0FBQUE7O0FBQ2QsU0FBSyw2QkFBTCxHQUFxQyxLQUFyQztBQUVBLFNBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFNBQUssUUFBTCxHQUFnQixJQUFoQjtBQUVBLFNBQUssSUFBTDs7QUFFQSxRQUFHLEtBQUssU0FBTCxLQUFtQixJQUFuQixJQUEyQixLQUFLLFNBQUwsS0FBbUIsU0FBOUMsSUFBMkQsS0FBSyxRQUFMLEtBQWtCLElBQTdFLElBQXFGLEtBQUssUUFBTCxLQUFrQixTQUExRyxFQUFvSDtBQUNsSCxVQUFJLElBQUksR0FBRyxJQUFYOztBQUdBLFVBQUcsS0FBSyxTQUFMLENBQWUsVUFBZixDQUEwQixTQUExQixDQUFvQyxRQUFwQyxDQUE2QyxpQ0FBN0MsS0FBbUYsS0FBSyxTQUFMLENBQWUsVUFBZixDQUEwQixTQUExQixDQUFvQyxRQUFwQyxDQUE2QyxpQ0FBN0MsQ0FBdEYsRUFBc0s7QUFDcEssYUFBSyw2QkFBTCxHQUFxQyxJQUFyQztBQUNELE9BTmlILENBUWxIOzs7QUFDQSxNQUFBLFFBQVEsQ0FBQyxvQkFBVCxDQUE4QixNQUE5QixFQUF1QyxDQUF2QyxFQUEyQyxtQkFBM0MsQ0FBK0QsT0FBL0QsRUFBd0UsWUFBeEU7QUFDQSxNQUFBLFFBQVEsQ0FBQyxvQkFBVCxDQUE4QixNQUE5QixFQUF1QyxDQUF2QyxFQUEyQyxnQkFBM0MsQ0FBNEQsT0FBNUQsRUFBcUUsWUFBckUsRUFWa0gsQ0FXbEg7O0FBQ0EsV0FBSyxTQUFMLENBQWUsbUJBQWYsQ0FBbUMsT0FBbkMsRUFBNEMsY0FBNUM7QUFDQSxXQUFLLFNBQUwsQ0FBZSxnQkFBZixDQUFnQyxPQUFoQyxFQUF5QyxjQUF6QyxFQWJrSCxDQWVsSDs7QUFDQSxVQUFHLEtBQUssNkJBQVIsRUFBdUM7QUFDckMsWUFBSSxPQUFPLEdBQUcsS0FBSyxTQUFuQjs7QUFDQSxZQUFJLE1BQU0sQ0FBQyxvQkFBWCxFQUFpQztBQUMvQjtBQUNBLGNBQUksUUFBUSxHQUFHLElBQUksb0JBQUosQ0FBeUIsVUFBVSxPQUFWLEVBQW1CO0FBQ3pEO0FBQ0EsZ0JBQUksT0FBTyxDQUFFLENBQUYsQ0FBUCxDQUFhLGlCQUFqQixFQUFvQztBQUNsQyxrQkFBSSxPQUFPLENBQUMsWUFBUixDQUFxQixlQUFyQixNQUEwQyxPQUE5QyxFQUF1RDtBQUNyRCxnQkFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLFlBQWQsQ0FBMkIsYUFBM0IsRUFBMEMsTUFBMUM7QUFDRDtBQUNGLGFBSkQsTUFJTztBQUNMO0FBQ0Esa0JBQUksSUFBSSxDQUFDLFFBQUwsQ0FBYyxZQUFkLENBQTJCLGFBQTNCLE1BQThDLE1BQWxELEVBQTBEO0FBQ3hELGdCQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsWUFBZCxDQUEyQixhQUEzQixFQUEwQyxPQUExQztBQUNEO0FBQ0Y7QUFDRixXQVpjLEVBWVo7QUFDRCxZQUFBLElBQUksRUFBRSxRQUFRLENBQUM7QUFEZCxXQVpZLENBQWY7QUFlQSxVQUFBLFFBQVEsQ0FBQyxPQUFULENBQWlCLE9BQWpCO0FBQ0QsU0FsQkQsTUFrQk87QUFDTDtBQUNBLGNBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQU4sQ0FBeEIsRUFBMEM7QUFDeEM7QUFDQSxnQkFBSSxPQUFPLENBQUMsWUFBUixDQUFxQixlQUFyQixNQUEwQyxPQUE5QyxFQUF1RDtBQUNyRCxjQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsWUFBZCxDQUEyQixhQUEzQixFQUEwQyxNQUExQztBQUNELGFBRkQsTUFFTTtBQUNKLGNBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxZQUFkLENBQTJCLGFBQTNCLEVBQTBDLE9BQTFDO0FBQ0Q7QUFDRixXQVBELE1BT087QUFDTDtBQUNBLFlBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxZQUFkLENBQTJCLGFBQTNCLEVBQTBDLE9BQTFDO0FBQ0Q7O0FBQ0QsVUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBWTtBQUM1QyxnQkFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsU0FBTixDQUF4QixFQUEwQztBQUN4QyxrQkFBSSxPQUFPLENBQUMsWUFBUixDQUFxQixlQUFyQixNQUEwQyxPQUE5QyxFQUF1RDtBQUNyRCxnQkFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLFlBQWQsQ0FBMkIsYUFBM0IsRUFBMEMsTUFBMUM7QUFDRCxlQUZELE1BRU07QUFDSixnQkFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLFlBQWQsQ0FBMkIsYUFBM0IsRUFBMEMsT0FBMUM7QUFDRDtBQUNGLGFBTkQsTUFNTztBQUNMLGNBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxZQUFkLENBQTJCLGFBQTNCLEVBQTBDLE9BQTFDO0FBQ0Q7QUFDRixXQVZEO0FBV0Q7QUFDRjs7QUFHRCxNQUFBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxVQUFTLEtBQVQsRUFBZTtBQUNoRCxZQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBTixJQUFlLEtBQUssQ0FBQyxPQUEvQjs7QUFDQSxZQUFJLEdBQUcsS0FBSyxFQUFaLEVBQWdCO0FBQ2QsVUFBQSxRQUFRLENBQUMsS0FBRCxDQUFSO0FBQ0Q7QUFDRixPQUxEO0FBTUQ7QUFDRjs7OztXQUVELGdCQUFPO0FBQ0wsVUFBRyxLQUFLLFNBQUwsS0FBbUIsSUFBbkIsSUFBMEIsS0FBSyxTQUFMLEtBQW1CLFNBQWhELEVBQTBEO0FBQ3hELGNBQU0sSUFBSSxLQUFKLGdEQUFOO0FBQ0Q7O0FBQ0QsVUFBSSxVQUFVLEdBQUcsS0FBSyxTQUFMLENBQWUsWUFBZixDQUE0QixNQUE1QixDQUFqQjs7QUFDQSxVQUFHLFVBQVUsS0FBSyxJQUFmLElBQXVCLFVBQVUsS0FBSyxTQUF6QyxFQUFtRDtBQUNqRCxjQUFNLElBQUksS0FBSixDQUFVLHdEQUFzRCxNQUFoRSxDQUFOO0FBQ0Q7O0FBQ0QsVUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsR0FBbkIsRUFBd0IsRUFBeEIsQ0FBeEIsQ0FBZjs7QUFDQSxVQUFHLFFBQVEsS0FBSyxJQUFiLElBQXFCLFFBQVEsS0FBSyxTQUFyQyxFQUErQztBQUM3QyxjQUFNLElBQUksS0FBSixDQUFVLGlEQUFWLENBQU47QUFDRDs7QUFFRCxXQUFLLFFBQUwsR0FBZ0IsUUFBaEI7QUFDRDs7O1dBRUQsZ0JBQU07QUFDSixNQUFBLE1BQU0sQ0FBQyxLQUFLLFNBQU4sQ0FBTjtBQUNEOzs7V0FFRCxnQkFBTTtBQUNKLE1BQUEsTUFBTSxDQUFDLEtBQUssU0FBTixDQUFOO0FBQ0Q7Ozs7O0FBSUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFJLFVBQVUsR0FBRyxTQUFiLFVBQWEsQ0FBVSxNQUFWLEVBQWtCO0FBQ2pDLFNBQU8sTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQXhCLENBQVA7QUFDRCxDQUZEOztBQUlBLElBQUksUUFBUSxHQUFHLFNBQVgsUUFBVyxHQUF1QjtBQUFBLE1BQWIsS0FBYSx1RUFBTCxJQUFLO0FBQ3BDLE1BQUksT0FBTyxHQUFHLEtBQWQ7QUFFQSxNQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsV0FBVCxDQUFxQixPQUFyQixDQUFqQjtBQUNBLEVBQUEsVUFBVSxDQUFDLFNBQVgsQ0FBcUIsY0FBckIsRUFBcUMsSUFBckMsRUFBMkMsSUFBM0M7QUFFQSxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQUFiO0FBRUEsTUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLHNCQUFULENBQWdDLGVBQWhDLENBQXJCOztBQUNBLE9BQUssSUFBSSxFQUFFLEdBQUcsQ0FBZCxFQUFpQixFQUFFLEdBQUcsY0FBYyxDQUFDLE1BQXJDLEVBQTZDLEVBQUUsRUFBL0MsRUFBbUQ7QUFDakQsUUFBSSxxQkFBcUIsR0FBRyxjQUFjLENBQUUsRUFBRixDQUExQztBQUNBLFFBQUksU0FBUyxHQUFHLHFCQUFxQixDQUFDLGFBQXRCLENBQW9DLE1BQU0sR0FBQyx3QkFBM0MsQ0FBaEI7O0FBQ0EsUUFBRyxTQUFTLEtBQUssSUFBakIsRUFBc0I7QUFDcEIsTUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNBLFVBQUksUUFBUSxHQUFHLHFCQUFxQixDQUFDLGFBQXRCLENBQW9DLE1BQUksU0FBUyxDQUFDLFlBQVYsQ0FBdUIsTUFBdkIsRUFBK0IsT0FBL0IsQ0FBdUMsR0FBdkMsRUFBNEMsRUFBNUMsQ0FBeEMsQ0FBZjs7QUFFRSxVQUFJLFFBQVEsS0FBSyxJQUFiLElBQXFCLFNBQVMsS0FBSyxJQUF2QyxFQUE2QztBQUMzQyxZQUFHLG9CQUFvQixDQUFDLFNBQUQsQ0FBdkIsRUFBbUM7QUFDakMsY0FBRyxTQUFTLENBQUMsWUFBVixDQUF1QixlQUF2QixNQUE0QyxJQUEvQyxFQUFvRDtBQUNsRCxZQUFBLFNBQVMsQ0FBQyxhQUFWLENBQXdCLFVBQXhCO0FBQ0Q7O0FBQ0QsVUFBQSxTQUFTLENBQUMsWUFBVixDQUF1QixlQUF2QixFQUF3QyxPQUF4QztBQUNBLFVBQUEsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsV0FBdkI7QUFDQSxVQUFBLFFBQVEsQ0FBQyxZQUFULENBQXNCLGFBQXRCLEVBQXFDLE1BQXJDO0FBQ0Q7QUFDRjtBQUNKO0FBQ0Y7O0FBRUQsTUFBRyxPQUFPLElBQUksS0FBSyxLQUFLLElBQXhCLEVBQTZCO0FBQzNCLElBQUEsS0FBSyxDQUFDLHdCQUFOO0FBQ0Q7QUFDRixDQWhDRDs7QUFpQ0EsSUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFTLENBQVUsRUFBVixFQUFjO0FBQ3pCLE1BQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxxQkFBSCxFQUFYO0FBQUEsTUFDRSxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVAsSUFBc0IsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsVUFEOUQ7QUFBQSxNQUVFLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBUCxJQUFzQixRQUFRLENBQUMsZUFBVCxDQUF5QixTQUY3RDtBQUdBLFNBQU87QUFBRSxJQUFBLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBTCxHQUFXLFNBQWxCO0FBQTZCLElBQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFMLEdBQVk7QUFBL0MsR0FBUDtBQUNELENBTEQ7O0FBT0EsSUFBSSxjQUFjLEdBQUcsU0FBakIsY0FBaUIsQ0FBVSxLQUFWLEVBQXFDO0FBQUEsTUFBcEIsVUFBb0IsdUVBQVAsS0FBTztBQUN4RCxFQUFBLEtBQUssQ0FBQyxlQUFOO0FBQ0EsRUFBQSxLQUFLLENBQUMsY0FBTjtBQUVBLEVBQUEsTUFBTSxDQUFDLElBQUQsRUFBTyxVQUFQLENBQU47QUFFRCxDQU5EOztBQVFBLElBQUksTUFBTSxHQUFHLFNBQVQsTUFBUyxDQUFTLE1BQVQsRUFBb0M7QUFBQSxNQUFuQixVQUFtQix1RUFBTixLQUFNO0FBRS9DLE1BQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxXQUFULENBQXFCLE9BQXJCLENBQWpCO0FBQ0EsRUFBQSxVQUFVLENBQUMsU0FBWCxDQUFxQixjQUFyQixFQUFxQyxJQUFyQyxFQUEyQyxJQUEzQztBQUVBLE1BQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxXQUFULENBQXFCLE9BQXJCLENBQWhCO0FBQ0EsRUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixhQUFwQixFQUFtQyxJQUFuQyxFQUF5QyxJQUF6QztBQUNBLE1BQUksU0FBUyxHQUFHLE1BQWhCO0FBQ0EsTUFBSSxRQUFRLEdBQUcsSUFBZjs7QUFDQSxNQUFHLFNBQVMsS0FBSyxJQUFkLElBQXNCLFNBQVMsS0FBSyxTQUF2QyxFQUFpRDtBQUMvQyxRQUFJLFVBQVUsR0FBRyxTQUFTLENBQUMsWUFBVixDQUF1QixNQUF2QixDQUFqQjs7QUFDQSxRQUFHLFVBQVUsS0FBSyxJQUFmLElBQXVCLFVBQVUsS0FBSyxTQUF6QyxFQUFtRDtBQUNqRCxNQUFBLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixVQUFVLENBQUMsT0FBWCxDQUFtQixHQUFuQixFQUF3QixFQUF4QixDQUF4QixDQUFYO0FBQ0Q7QUFDRjs7QUFDRCxNQUFHLFNBQVMsS0FBSyxJQUFkLElBQXNCLFNBQVMsS0FBSyxTQUFwQyxJQUFpRCxRQUFRLEtBQUssSUFBOUQsSUFBc0UsUUFBUSxLQUFLLFNBQXRGLEVBQWdHO0FBQzlGO0FBRUEsSUFBQSxRQUFRLENBQUMsS0FBVCxDQUFlLElBQWYsR0FBc0IsSUFBdEI7QUFDQSxJQUFBLFFBQVEsQ0FBQyxLQUFULENBQWUsS0FBZixHQUF1QixJQUF2Qjs7QUFFQSxRQUFHLFNBQVMsQ0FBQyxZQUFWLENBQXVCLGVBQXZCLE1BQTRDLE1BQTVDLElBQXNELFVBQXpELEVBQW9FO0FBQ2xFO0FBQ0EsTUFBQSxTQUFTLENBQUMsWUFBVixDQUF1QixlQUF2QixFQUF3QyxPQUF4QztBQUNBLE1BQUEsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsV0FBdkI7QUFDQSxNQUFBLFFBQVEsQ0FBQyxZQUFULENBQXNCLGFBQXRCLEVBQXFDLE1BQXJDO0FBQ0EsTUFBQSxTQUFTLENBQUMsYUFBVixDQUF3QixVQUF4QjtBQUNELEtBTkQsTUFNSztBQUNILE1BQUEsUUFBUSxHQURMLENBRUg7O0FBQ0EsTUFBQSxTQUFTLENBQUMsWUFBVixDQUF1QixlQUF2QixFQUF3QyxNQUF4QztBQUNBLE1BQUEsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsTUFBbkIsQ0FBMEIsV0FBMUI7QUFDQSxNQUFBLFFBQVEsQ0FBQyxZQUFULENBQXNCLGFBQXRCLEVBQXFDLE9BQXJDO0FBQ0EsTUFBQSxTQUFTLENBQUMsYUFBVixDQUF3QixTQUF4QjtBQUNBLFVBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxRQUFELENBQXpCOztBQUVBLFVBQUcsWUFBWSxDQUFDLElBQWIsR0FBb0IsQ0FBdkIsRUFBeUI7QUFDdkIsUUFBQSxRQUFRLENBQUMsS0FBVCxDQUFlLElBQWYsR0FBc0IsS0FBdEI7QUFDQSxRQUFBLFFBQVEsQ0FBQyxLQUFULENBQWUsS0FBZixHQUF1QixNQUF2QjtBQUNEOztBQUNELFVBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxJQUFiLEdBQW9CLFFBQVEsQ0FBQyxXQUF6Qzs7QUFDQSxVQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBbEIsRUFBNkI7QUFDM0IsUUFBQSxRQUFRLENBQUMsS0FBVCxDQUFlLElBQWYsR0FBc0IsTUFBdEI7QUFDQSxRQUFBLFFBQVEsQ0FBQyxLQUFULENBQWUsS0FBZixHQUF1QixLQUF2QjtBQUNEOztBQUVELFVBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxRQUFELENBQXhCOztBQUVBLFVBQUcsV0FBVyxDQUFDLElBQVosR0FBbUIsQ0FBdEIsRUFBd0I7QUFFdEIsUUFBQSxRQUFRLENBQUMsS0FBVCxDQUFlLElBQWYsR0FBc0IsS0FBdEI7QUFDQSxRQUFBLFFBQVEsQ0FBQyxLQUFULENBQWUsS0FBZixHQUF1QixNQUF2QjtBQUNEOztBQUNELE1BQUEsS0FBSyxHQUFHLFdBQVcsQ0FBQyxJQUFaLEdBQW1CLFFBQVEsQ0FBQyxXQUFwQzs7QUFDQSxVQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBbEIsRUFBNkI7QUFFM0IsUUFBQSxRQUFRLENBQUMsS0FBVCxDQUFlLElBQWYsR0FBc0IsTUFBdEI7QUFDQSxRQUFBLFFBQVEsQ0FBQyxLQUFULENBQWUsS0FBZixHQUF1QixLQUF2QjtBQUNEO0FBQ0Y7QUFFRjtBQUNGLENBOUREOztBQWdFQSxJQUFJLFNBQVMsR0FBRyxTQUFaLFNBQVksQ0FBVSxLQUFWLEVBQWlCLGFBQWpCLEVBQStCO0FBQzdDLE1BQUcsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsT0FBakIsS0FBNkIsYUFBaEMsRUFBOEM7QUFDNUMsV0FBTyxJQUFQO0FBQ0QsR0FGRCxNQUVPLElBQUcsYUFBYSxLQUFLLE1BQWxCLElBQTRCLEtBQUssQ0FBQyxVQUFOLENBQWlCLE9BQWpCLEtBQTZCLE1BQTVELEVBQW1FO0FBQ3hFLFdBQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxVQUFQLEVBQW1CLGFBQW5CLENBQWhCO0FBQ0QsR0FGTSxNQUVGO0FBQ0gsV0FBTyxLQUFQO0FBQ0Q7QUFDRixDQVJEOztBQVVBLElBQUksWUFBWSxHQUFHLFNBQWYsWUFBZSxDQUFVLEdBQVYsRUFBYztBQUMvQixNQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLHdCQUF2QixNQUFxRCxJQUF4RCxFQUE4RDtBQUM1RCxRQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsa0NBQTFCLENBQXBCOztBQUNBLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQWxDLEVBQTBDLENBQUMsRUFBM0MsRUFBK0M7QUFDN0MsVUFBSSxTQUFTLEdBQUcsYUFBYSxDQUFDLENBQUQsQ0FBN0I7QUFDQSxVQUFJLFFBQVEsR0FBRyxJQUFmO0FBQ0EsVUFBSSxVQUFVLEdBQUcsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsTUFBdkIsQ0FBakI7O0FBQ0EsVUFBSSxVQUFVLEtBQUssSUFBZixJQUF1QixVQUFVLEtBQUssU0FBMUMsRUFBcUQ7QUFDbkQsWUFBRyxVQUFVLENBQUMsT0FBWCxDQUFtQixHQUFuQixNQUE0QixDQUFDLENBQWhDLEVBQWtDO0FBQ2hDLFVBQUEsVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFYLENBQW1CLEdBQW5CLEVBQXdCLEVBQXhCLENBQWI7QUFDRDs7QUFDRCxRQUFBLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixVQUF4QixDQUFYO0FBQ0Q7O0FBQ0QsVUFBSSxvQkFBb0IsQ0FBQyxTQUFELENBQXBCLElBQW9DLFNBQVMsQ0FBQyxTQUFELEVBQVksUUFBWixDQUFULElBQWtDLENBQUMsR0FBRyxDQUFDLE1BQUosQ0FBVyxTQUFYLENBQXFCLFFBQXJCLENBQThCLFNBQTlCLENBQTNFLEVBQXNIO0FBQ3BIO0FBQ0EsWUFBSSxHQUFHLENBQUMsTUFBSixLQUFlLFNBQW5CLEVBQThCO0FBQzVCO0FBQ0EsVUFBQSxTQUFTLENBQUMsWUFBVixDQUF1QixlQUF2QixFQUF3QyxPQUF4QztBQUNBLFVBQUEsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsV0FBdkI7QUFDQSxVQUFBLFFBQVEsQ0FBQyxZQUFULENBQXNCLGFBQXRCLEVBQXFDLE1BQXJDO0FBRUEsY0FBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsT0FBckIsQ0FBakI7QUFDQSxVQUFBLFVBQVUsQ0FBQyxTQUFYLENBQXFCLGNBQXJCLEVBQXFDLElBQXJDLEVBQTJDLElBQTNDO0FBQ0EsVUFBQSxTQUFTLENBQUMsYUFBVixDQUF3QixVQUF4QjtBQUNEO0FBQ0Y7QUFDRjtBQUNGO0FBQ0YsQ0E1QkQ7O0FBOEJBLElBQUksb0JBQW9CLEdBQUcsU0FBdkIsb0JBQXVCLENBQVUsU0FBVixFQUFvQjtBQUM3QyxNQUFHLENBQUMsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsUUFBcEIsQ0FBNkIsMEJBQTdCLENBQUosRUFBNkQ7QUFDM0Q7QUFDQSxRQUFHLFNBQVMsQ0FBQyxVQUFWLENBQXFCLFNBQXJCLENBQStCLFFBQS9CLENBQXdDLGlDQUF4QyxLQUE4RSxTQUFTLENBQUMsVUFBVixDQUFxQixTQUFyQixDQUErQixRQUEvQixDQUF3QyxpQ0FBeEMsQ0FBakYsRUFBNko7QUFDM0o7QUFDQSxVQUFJLE1BQU0sQ0FBQyxVQUFQLElBQXFCLHNCQUFzQixDQUFDLFNBQUQsQ0FBL0MsRUFBNEQ7QUFDMUQ7QUFDQSxlQUFPLElBQVA7QUFDRDtBQUNGLEtBTkQsTUFNTTtBQUNKO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPLEtBQVA7QUFDRCxDQWhCRDs7QUFrQkEsSUFBSSxzQkFBc0IsR0FBRyxTQUF6QixzQkFBeUIsQ0FBVSxNQUFWLEVBQWlCO0FBQzVDLE1BQUcsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsU0FBbEIsQ0FBNEIsUUFBNUIsQ0FBcUMsaUNBQXJDLENBQUgsRUFBMkU7QUFDekUsV0FBTyxXQUFXLENBQUMsRUFBbkI7QUFDRDs7QUFDRCxNQUFHLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFNBQWxCLENBQTRCLFFBQTVCLENBQXFDLGlDQUFyQyxDQUFILEVBQTJFO0FBQ3pFLFdBQU8sV0FBVyxDQUFDLEVBQW5CO0FBQ0Q7QUFDRixDQVBEOztBQVNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQWpCOzs7Ozs7Ozs7O0FDL1NBLFNBQVMsWUFBVCxDQUF1QixPQUF2QixFQUFnQztBQUM5QixPQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0Q7O0FBRUQsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsSUFBdkIsR0FBOEIsWUFBWTtBQUN4QyxNQUFJLE9BQU8sR0FBRyxLQUFLLE9BQW5COztBQUNBLE1BQUksQ0FBQyxPQUFMLEVBQWM7QUFDWjtBQUNEOztBQUNELEVBQUEsT0FBTyxDQUFDLEtBQVI7QUFFQSxFQUFBLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixPQUF6QixFQUFrQyxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBbEM7QUFDRCxDQVJEO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsV0FBdkIsR0FBcUMsVUFBVSxLQUFWLEVBQWlCO0FBQ3BELE1BQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFuQjs7QUFDQSxNQUFJLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUFKLEVBQThCO0FBQzVCLElBQUEsS0FBSyxDQUFDLGNBQU47QUFDRDtBQUNGLENBTEQ7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFlBQVksQ0FBQyxTQUFiLENBQXVCLFdBQXZCLEdBQXFDLFVBQVUsT0FBVixFQUFtQjtBQUN0RDtBQUNBLE1BQUksT0FBTyxDQUFDLE9BQVIsS0FBb0IsR0FBcEIsSUFBMkIsT0FBTyxDQUFDLElBQVIsS0FBaUIsS0FBaEQsRUFBdUQ7QUFDckQsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsTUFBSSxPQUFPLEdBQUcsS0FBSyxrQkFBTCxDQUF3QixPQUFPLENBQUMsSUFBaEMsQ0FBZDtBQUNBLE1BQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLE9BQXhCLENBQWI7O0FBQ0EsTUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNYLFdBQU8sS0FBUDtBQUNEOztBQUVELE1BQUksY0FBYyxHQUFHLEtBQUssMEJBQUwsQ0FBZ0MsTUFBaEMsQ0FBckI7O0FBQ0EsTUFBSSxDQUFDLGNBQUwsRUFBcUI7QUFDbkIsV0FBTyxLQUFQO0FBQ0QsR0FmcUQsQ0FpQnREO0FBQ0E7QUFDQTs7O0FBQ0EsRUFBQSxjQUFjLENBQUMsY0FBZjtBQUNBLEVBQUEsTUFBTSxDQUFDLEtBQVAsQ0FBYTtBQUFFLElBQUEsYUFBYSxFQUFFO0FBQWpCLEdBQWI7QUFFQSxTQUFPLElBQVA7QUFDRCxDQXhCRDtBQTBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFlBQVksQ0FBQyxTQUFiLENBQXVCLGtCQUF2QixHQUE0QyxVQUFVLEdBQVYsRUFBZTtBQUN6RCxNQUFJLEdBQUcsQ0FBQyxPQUFKLENBQVksR0FBWixNQUFxQixDQUFDLENBQTFCLEVBQTZCO0FBQzNCLFdBQU8sS0FBUDtBQUNEOztBQUVELFNBQU8sR0FBRyxDQUFDLEtBQUosQ0FBVSxHQUFWLEVBQWUsR0FBZixFQUFQO0FBQ0QsQ0FORDtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsMEJBQXZCLEdBQW9ELFVBQVUsTUFBVixFQUFrQjtBQUNwRSxNQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsT0FBUCxDQUFlLFVBQWYsQ0FBaEI7O0FBRUEsTUFBSSxTQUFKLEVBQWU7QUFDYixRQUFJLE9BQU8sR0FBRyxTQUFTLENBQUMsb0JBQVYsQ0FBK0IsUUFBL0IsQ0FBZDs7QUFFQSxRQUFJLE9BQU8sQ0FBQyxNQUFaLEVBQW9CO0FBQ2xCLFVBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLENBQUQsQ0FBOUIsQ0FEa0IsQ0FHbEI7QUFDQTs7QUFDQSxVQUFJLE1BQU0sQ0FBQyxJQUFQLEtBQWdCLFVBQWhCLElBQThCLE1BQU0sQ0FBQyxJQUFQLEtBQWdCLE9BQWxELEVBQTJEO0FBQ3pELGVBQU8sZ0JBQVA7QUFDRCxPQVBpQixDQVNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFVBQUksU0FBUyxHQUFHLGdCQUFnQixDQUFDLHFCQUFqQixHQUF5QyxHQUF6RDtBQUNBLFVBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxxQkFBUCxFQUFoQixDQWhCa0IsQ0FrQmxCO0FBQ0E7O0FBQ0EsVUFBSSxTQUFTLENBQUMsTUFBVixJQUFvQixNQUFNLENBQUMsV0FBL0IsRUFBNEM7QUFDMUMsWUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDLEdBQVYsR0FBZ0IsU0FBUyxDQUFDLE1BQTVDOztBQUVBLFlBQUksV0FBVyxHQUFHLFNBQWQsR0FBMEIsTUFBTSxDQUFDLFdBQVAsR0FBcUIsQ0FBbkQsRUFBc0Q7QUFDcEQsaUJBQU8sZ0JBQVA7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUFnQixNQUFNLENBQUMsWUFBUCxDQUFvQixJQUFwQixDQUFoQixHQUE0QyxJQUFuRSxLQUNMLE1BQU0sQ0FBQyxPQUFQLENBQWUsT0FBZixDQURGO0FBRUQsQ0F0Q0Q7O2VBd0NlLFk7Ozs7Ozs7Ozs7O0FDL0lmLFNBQVMsS0FBVCxDQUFnQixNQUFoQixFQUF1QjtBQUNyQixPQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsTUFBSSxFQUFFLEdBQUcsS0FBSyxNQUFMLENBQVksWUFBWixDQUF5QixJQUF6QixDQUFUO0FBQ0EsT0FBSyxRQUFMLEdBQWdCLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQix3Q0FBc0MsRUFBdEMsR0FBeUMsSUFBbkUsQ0FBaEI7QUFDQSxFQUFBLE1BQU0sQ0FBQyxLQUFQLEdBQWU7QUFBQyxpQkFBYSxRQUFRLENBQUMsYUFBdkI7QUFBc0MsOEJBQTBCO0FBQWhFLEdBQWY7QUFDRDs7QUFFRCxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFoQixHQUF1QixZQUFZO0FBQ2pDLE1BQUksUUFBUSxHQUFHLEtBQUssUUFBcEI7O0FBQ0EsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBN0IsRUFBcUMsQ0FBQyxFQUF0QyxFQUF5QztBQUN2QyxRQUFJLE9BQU8sR0FBRyxRQUFRLENBQUUsQ0FBRixDQUF0QjtBQUNBLElBQUEsT0FBTyxDQUFDLGdCQUFSLENBQXlCLE9BQXpCLEVBQWtDLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQWxDO0FBQ0Q7O0FBQ0QsTUFBSSxPQUFPLEdBQUcsS0FBSyxNQUFMLENBQVksZ0JBQVosQ0FBNkIsb0JBQTdCLENBQWQ7O0FBQ0EsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBNUIsRUFBb0MsQ0FBQyxFQUFyQyxFQUF3QztBQUN0QyxRQUFJLE1BQU0sR0FBRyxPQUFPLENBQUUsQ0FBRixDQUFwQjtBQUNBLElBQUEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxJQUFmLENBQWpDO0FBQ0Q7QUFDRixDQVhEOztBQWFBLEtBQUssQ0FBQyxTQUFOLENBQWdCLElBQWhCLEdBQXVCLFlBQVc7QUFDaEMsTUFBSSxZQUFZLEdBQUcsS0FBSyxNQUF4Qjs7QUFDQSxNQUFHLFlBQVksS0FBSyxJQUFwQixFQUF5QjtBQUN2QixJQUFBLFlBQVksQ0FBQyxZQUFiLENBQTBCLGFBQTFCLEVBQXlDLE1BQXpDO0FBRUEsUUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsT0FBckIsQ0FBakI7QUFDQSxJQUFBLFVBQVUsQ0FBQyxTQUFYLENBQXFCLGtCQUFyQixFQUF5QyxJQUF6QyxFQUErQyxJQUEvQztBQUNBLElBQUEsWUFBWSxDQUFDLGFBQWIsQ0FBMkIsVUFBM0I7QUFFQSxRQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixpQkFBdkIsQ0FBaEI7QUFDQSxJQUFBLFNBQVMsQ0FBQyxVQUFWLENBQXFCLFdBQXJCLENBQWlDLFNBQWpDO0FBRUEsSUFBQSxRQUFRLENBQUMsb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsRUFBeUMsU0FBekMsQ0FBbUQsTUFBbkQsQ0FBMEQsWUFBMUQ7QUFDQSxJQUFBLFFBQVEsQ0FBQyxtQkFBVCxDQUE2QixPQUE3QixFQUFzQyxLQUFLLFNBQTNDLEVBQXNELElBQXREO0FBRUEsSUFBQSxRQUFRLENBQUMsbUJBQVQsQ0FBNkIsT0FBN0IsRUFBc0MsWUFBdEM7QUFDRDtBQUNGLENBakJEOztBQW9CQSxLQUFLLENBQUMsU0FBTixDQUFnQixJQUFoQixHQUF1QixZQUFXO0FBQ2hDLE1BQUksWUFBWSxHQUFHLEtBQUssTUFBeEI7O0FBQ0EsTUFBRyxZQUFZLEtBQUssSUFBcEIsRUFBeUI7QUFDdkIsSUFBQSxZQUFZLENBQUMsWUFBYixDQUEwQixhQUExQixFQUF5QyxPQUF6QztBQUNBLElBQUEsWUFBWSxDQUFDLFlBQWIsQ0FBMEIsVUFBMUIsRUFBc0MsSUFBdEM7QUFFQSxRQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsV0FBVCxDQUFxQixPQUFyQixDQUFoQjtBQUNBLElBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsaUJBQXBCLEVBQXVDLElBQXZDLEVBQTZDLElBQTdDO0FBQ0EsSUFBQSxZQUFZLENBQUMsYUFBYixDQUEyQixTQUEzQjtBQUVBLFFBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQWhCO0FBQ0EsSUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixHQUFwQixDQUF3QixnQkFBeEI7QUFDQSxJQUFBLFNBQVMsQ0FBQyxZQUFWLENBQXVCLElBQXZCLEVBQTZCLGdCQUE3QjtBQUNBLElBQUEsUUFBUSxDQUFDLG9CQUFULENBQThCLE1BQTlCLEVBQXNDLENBQXRDLEVBQXlDLFdBQXpDLENBQXFELFNBQXJEO0FBRUEsSUFBQSxRQUFRLENBQUMsb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsRUFBeUMsU0FBekMsQ0FBbUQsR0FBbkQsQ0FBdUQsWUFBdkQ7QUFFQSxJQUFBLFlBQVksQ0FBQyxLQUFiO0FBQ0EsSUFBQSxNQUFNLENBQUMsS0FBUCxDQUFhLFNBQWIsR0FBeUIsUUFBUSxDQUFDLGFBQWxDO0FBRUEsSUFBQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsS0FBSyxTQUF4QyxFQUFtRCxJQUFuRDtBQUVBLElBQUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLFlBQW5DO0FBRUQ7QUFDRixDQXpCRDs7QUEyQkEsSUFBSSxZQUFZLEdBQUcsU0FBZixZQUFlLENBQVUsS0FBVixFQUFpQjtBQUNsQyxNQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBTixJQUFlLEtBQUssQ0FBQyxPQUEvQjtBQUNBLE1BQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLCtCQUF2QixDQUFuQjtBQUNBLE1BQUksWUFBWSxHQUFHLElBQUksS0FBSixDQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLCtCQUF2QixDQUFWLENBQW5COztBQUNBLE1BQUksR0FBRyxLQUFLLEVBQVosRUFBZTtBQUNiLFFBQUkscUJBQXFCLEdBQUcsWUFBWSxDQUFDLGdCQUFiLENBQThCLDZDQUE5QixDQUE1Qjs7QUFDQSxRQUFHLHFCQUFxQixDQUFDLE1BQXRCLEtBQWlDLENBQXBDLEVBQXNDO0FBQ3BDLE1BQUEsWUFBWSxDQUFDLElBQWI7QUFDRDtBQUNGO0FBQ0YsQ0FWRDs7QUFhQSxLQUFLLENBQUMsU0FBTixDQUFnQixTQUFoQixHQUE0QixVQUFTLEtBQVQsRUFBZTtBQUN2QyxNQUFJLE1BQU0sQ0FBQyxLQUFQLENBQWEsc0JBQWpCLEVBQXlDO0FBQ3ZDO0FBQ0Q7O0FBQ0QsTUFBSSxhQUFhLEdBQUcsSUFBSSxLQUFKLENBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsK0JBQXZCLENBQVYsQ0FBcEI7O0FBQ0EsTUFBSSxhQUFhLENBQUMsTUFBZCxDQUFxQixzQkFBckIsQ0FBNEMsZUFBNUMsRUFBNkQsQ0FBN0QsRUFBZ0UsUUFBaEUsQ0FBeUUsS0FBSyxDQUFDLE1BQS9FLEtBQTBGLGFBQWEsQ0FBQyxNQUFkLElBQXdCLEtBQUssQ0FBQyxNQUE1SCxFQUFvSTtBQUNsSSxJQUFBLE1BQU0sQ0FBQyxLQUFQLENBQWEsU0FBYixHQUF5QixLQUFLLENBQUMsTUFBL0I7QUFDRCxHQUZELE1BR0s7QUFDSCxJQUFBLGFBQWEsQ0FBQyxvQkFBZCxDQUFtQyxhQUFhLENBQUMsTUFBakQ7O0FBQ0EsUUFBSSxNQUFNLENBQUMsS0FBUCxDQUFhLFNBQWIsSUFBMEIsUUFBUSxDQUFDLGFBQXZDLEVBQXNEO0FBQ3BELE1BQUEsYUFBYSxDQUFDLG1CQUFkLENBQWtDLGFBQWEsQ0FBQyxNQUFoRDtBQUNEOztBQUNELElBQUEsTUFBTSxDQUFDLEtBQVAsQ0FBYSxTQUFiLEdBQXlCLFFBQVEsQ0FBQyxhQUFsQztBQUNEO0FBQ0osQ0FmRDs7QUFpQkEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsV0FBaEIsR0FBOEIsVUFBVSxPQUFWLEVBQW1CO0FBQy9DLE1BQUksT0FBTyxDQUFDLFFBQVIsR0FBbUIsQ0FBbkIsSUFBeUIsT0FBTyxDQUFDLFFBQVIsS0FBcUIsQ0FBckIsSUFBMEIsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsVUFBckIsTUFBcUMsSUFBNUYsRUFBbUc7QUFDakcsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsTUFBSSxPQUFPLENBQUMsUUFBWixFQUFzQjtBQUNwQixXQUFPLEtBQVA7QUFDRDs7QUFFRCxVQUFRLE9BQU8sQ0FBQyxRQUFoQjtBQUNFLFNBQUssR0FBTDtBQUNFLGFBQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFWLElBQWtCLE9BQU8sQ0FBQyxHQUFSLElBQWUsUUFBeEM7O0FBQ0YsU0FBSyxPQUFMO0FBQ0UsYUFBTyxPQUFPLENBQUMsSUFBUixJQUFnQixRQUFoQixJQUE0QixPQUFPLENBQUMsSUFBUixJQUFnQixNQUFuRDs7QUFDRixTQUFLLFFBQUw7QUFDQSxTQUFLLFFBQUw7QUFDQSxTQUFLLFVBQUw7QUFDRSxhQUFPLElBQVA7O0FBQ0Y7QUFDRSxhQUFPLEtBQVA7QUFWSjtBQVlELENBckJEOztBQXdCQSxLQUFLLENBQUMsU0FBTixDQUFnQixvQkFBaEIsR0FBdUMsVUFBVSxPQUFWLEVBQW1CO0FBQ3hELE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsT0FBTyxDQUFDLFVBQVIsQ0FBbUIsTUFBdkMsRUFBK0MsQ0FBQyxFQUFoRCxFQUFvRDtBQUNsRCxRQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsVUFBUixDQUFtQixDQUFuQixDQUFaOztBQUNBLFFBQUksS0FBSyxZQUFMLENBQWtCLEtBQWxCLEtBQ0YsS0FBSyxvQkFBTCxDQUEwQixLQUExQixDQURGLEVBQ29DO0FBQ2xDLGFBQU8sSUFBUDtBQUVEO0FBQ0Y7O0FBQ0QsU0FBTyxLQUFQO0FBQ0QsQ0FWRDs7QUFZQSxLQUFLLENBQUMsU0FBTixDQUFnQixtQkFBaEIsR0FBc0MsVUFBVSxPQUFWLEVBQW1CO0FBQ3ZELE9BQUssSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFVBQVIsQ0FBbUIsTUFBbkIsR0FBNEIsQ0FBekMsRUFBNEMsQ0FBQyxJQUFJLENBQWpELEVBQW9ELENBQUMsRUFBckQsRUFBeUQ7QUFDdkQsUUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFVBQVIsQ0FBbUIsQ0FBbkIsQ0FBWjs7QUFDQSxRQUFJLEtBQUssWUFBTCxDQUFrQixLQUFsQixLQUNGLEtBQUssbUJBQUwsQ0FBeUIsS0FBekIsQ0FERixFQUNtQztBQUNqQyxhQUFPLElBQVA7QUFDRDtBQUNGOztBQUNELFNBQU8sS0FBUDtBQUNELENBVEQ7O0FBV0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsWUFBaEIsR0FBK0IsVUFBVSxPQUFWLEVBQW1CO0FBQ2hELE1BQUksQ0FBQyxLQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBTCxFQUFnQztBQUM5QixXQUFPLEtBQVA7QUFDRDs7QUFFRCxFQUFBLE1BQU0sQ0FBQyxLQUFQLENBQWEsc0JBQWIsR0FBc0MsSUFBdEM7O0FBQ0EsTUFBSTtBQUNGLElBQUEsT0FBTyxDQUFDLEtBQVI7QUFDRCxHQUZELENBR0EsT0FBTyxDQUFQLEVBQVUsQ0FDVDs7QUFDRCxFQUFBLE1BQU0sQ0FBQyxLQUFQLENBQWEsc0JBQWIsR0FBc0MsS0FBdEM7QUFDQSxTQUFRLFFBQVEsQ0FBQyxhQUFULEtBQTJCLE9BQW5DO0FBQ0QsQ0FiRDs7ZUFnQmUsSzs7OztBQ2pLZjs7Ozs7Ozs7QUFDQSxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZUFBRCxDQUF2Qjs7QUFDQSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQUQsQ0FBdEI7O0FBQ0EsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQUQsQ0FBeEI7O0FBRUEsSUFBTSxHQUFHLFNBQVQ7QUFDQSxJQUFNLFNBQVMsYUFBTSxHQUFOLE9BQWY7QUFDQSxJQUFNLE9BQU8sa0JBQWI7QUFDQSxJQUFNLFlBQVksbUJBQWxCO0FBQ0EsSUFBTSxPQUFPLGFBQWI7QUFDQSxJQUFNLE9BQU8sYUFBTSxZQUFOLGVBQWI7QUFDQSxJQUFNLE9BQU8sR0FBRyxDQUFFLEdBQUYsRUFBTyxPQUFQLEVBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQWhCO0FBRUEsSUFBTSxZQUFZLEdBQUcsbUJBQXJCO0FBQ0EsSUFBTSxhQUFhLEdBQUcsWUFBdEI7O0FBRUEsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFXO0FBQUEsU0FBTSxRQUFRLENBQUMsSUFBVCxDQUFjLFNBQWQsQ0FBd0IsUUFBeEIsQ0FBaUMsWUFBakMsQ0FBTjtBQUFBLENBQWpCOztBQUVBLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBYSxDQUFDLGFBQUQsRUFBbUI7QUFFcEM7QUFDQSxNQUFNLHVCQUF1QixHQUFHLGdMQUFoQztBQUNBLE1BQUksaUJBQWlCLEdBQUcsYUFBYSxDQUFDLGdCQUFkLENBQStCLHVCQUEvQixDQUF4QjtBQUNBLE1BQUksWUFBWSxHQUFHLGlCQUFpQixDQUFFLENBQUYsQ0FBcEM7O0FBRUEsV0FBUyxVQUFULENBQXFCLENBQXJCLEVBQXdCO0FBQ3RCLFFBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFOLElBQWUsS0FBSyxDQUFDLE9BQS9CLENBRHNCLENBRXRCOztBQUNBLFFBQUksR0FBRyxLQUFLLENBQVosRUFBZTtBQUViLFVBQUksV0FBVyxHQUFHLElBQWxCOztBQUNBLFdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFyQyxFQUE2QyxDQUFDLEVBQTlDLEVBQWlEO0FBQy9DLFlBQUksTUFBTSxHQUFHLGlCQUFpQixDQUFDLE1BQWxCLEdBQTJCLENBQXhDO0FBQ0EsWUFBSSxPQUFPLEdBQUcsaUJBQWlCLENBQUUsTUFBTSxHQUFHLENBQVgsQ0FBL0I7O0FBQ0EsWUFBSSxPQUFPLENBQUMsV0FBUixHQUFzQixDQUF0QixJQUEyQixPQUFPLENBQUMsWUFBUixHQUF1QixDQUF0RCxFQUF5RDtBQUN2RCxVQUFBLFdBQVcsR0FBRyxPQUFkO0FBQ0E7QUFDRDtBQUNGLE9BVlksQ0FZYjs7O0FBQ0EsVUFBSSxDQUFDLENBQUMsUUFBTixFQUFnQjtBQUNkLFlBQUksUUFBUSxDQUFDLGFBQVQsS0FBMkIsWUFBL0IsRUFBNkM7QUFDM0MsVUFBQSxDQUFDLENBQUMsY0FBRjtBQUNBLFVBQUEsV0FBVyxDQUFDLEtBQVo7QUFDRCxTQUphLENBTWhCOztBQUNDLE9BUEQsTUFPTztBQUNMLFlBQUksUUFBUSxDQUFDLGFBQVQsS0FBMkIsV0FBL0IsRUFBNEM7QUFDMUMsVUFBQSxDQUFDLENBQUMsY0FBRjtBQUNBLFVBQUEsWUFBWSxDQUFDLEtBQWI7QUFDRDtBQUNGO0FBQ0YsS0E3QnFCLENBK0J0Qjs7O0FBQ0EsUUFBSSxDQUFDLENBQUMsR0FBRixLQUFVLFFBQWQsRUFBd0I7QUFDdEIsTUFBQSxTQUFTLENBQUMsSUFBVixDQUFlLElBQWYsRUFBcUIsS0FBckI7QUFDRDtBQUNGOztBQUVELFNBQU87QUFDTCxJQUFBLE1BREssb0JBQ0s7QUFDTjtBQUNBLE1BQUEsWUFBWSxDQUFDLEtBQWIsR0FGTSxDQUdSOztBQUNBLE1BQUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLFVBQXJDO0FBQ0QsS0FOSTtBQVFMLElBQUEsT0FSSyxxQkFRTTtBQUNULE1BQUEsUUFBUSxDQUFDLG1CQUFULENBQTZCLFNBQTdCLEVBQXdDLFVBQXhDO0FBQ0Q7QUFWSSxHQUFQO0FBWUQsQ0F4REQ7O0FBMERBLElBQUksU0FBSjs7QUFFQSxJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVksQ0FBVSxNQUFWLEVBQWtCO0FBQ2xDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUF0Qjs7QUFDQSxNQUFJLE9BQU8sTUFBUCxLQUFrQixTQUF0QixFQUFpQztBQUMvQixJQUFBLE1BQU0sR0FBRyxDQUFDLFFBQVEsRUFBbEI7QUFDRDs7QUFDRCxFQUFBLElBQUksQ0FBQyxTQUFMLENBQWUsTUFBZixDQUFzQixZQUF0QixFQUFvQyxNQUFwQztBQUVBLEVBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFELENBQVAsRUFBa0IsVUFBQSxFQUFFLEVBQUk7QUFDN0IsSUFBQSxFQUFFLENBQUMsU0FBSCxDQUFhLE1BQWIsQ0FBb0IsYUFBcEIsRUFBbUMsTUFBbkM7QUFDRCxHQUZNLENBQVA7O0FBR0EsTUFBSSxNQUFKLEVBQVk7QUFDVixJQUFBLFNBQVMsQ0FBQyxNQUFWO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsSUFBQSxTQUFTLENBQUMsT0FBVjtBQUNEOztBQUVELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFMLENBQW1CLFlBQW5CLENBQXBCO0FBQ0EsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsT0FBbkIsQ0FBbkI7O0FBRUEsTUFBSSxNQUFNLElBQUksV0FBZCxFQUEyQjtBQUN6QjtBQUNBO0FBQ0EsSUFBQSxXQUFXLENBQUMsS0FBWjtBQUNELEdBSkQsTUFJTyxJQUFJLENBQUMsTUFBRCxJQUFXLFFBQVEsQ0FBQyxhQUFULEtBQTJCLFdBQXRDLElBQ0EsVUFESixFQUNnQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBQSxVQUFVLENBQUMsS0FBWDtBQUNEOztBQUVELFNBQU8sTUFBUDtBQUNELENBbENEOztBQW9DQSxJQUFNLE1BQU0sR0FBRyxTQUFULE1BQVMsR0FBTTtBQUVuQixNQUFJLE1BQU0sR0FBRyxLQUFiO0FBQ0EsTUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGdCQUFULENBQTBCLE9BQTFCLENBQWQ7O0FBQ0EsT0FBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUEzQixFQUFtQyxDQUFDLEVBQXBDLEVBQXdDO0FBQ3RDLFFBQUcsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE9BQU8sQ0FBQyxDQUFELENBQS9CLEVBQW9DLElBQXBDLEVBQTBDLE9BQTFDLEtBQXNELE1BQXpELEVBQWlFO0FBQy9ELE1BQUEsT0FBTyxDQUFDLENBQUQsQ0FBUCxDQUFXLGdCQUFYLENBQTRCLE9BQTVCLEVBQXFDLFNBQXJDO0FBQ0EsTUFBQSxNQUFNLEdBQUcsSUFBVDtBQUNEO0FBQ0Y7O0FBRUQsTUFBRyxNQUFILEVBQVU7QUFDUixRQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsT0FBMUIsQ0FBZDs7QUFDQSxTQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQTNCLEVBQW1DLENBQUMsRUFBcEMsRUFBd0M7QUFDdEMsTUFBQSxPQUFPLENBQUUsQ0FBRixDQUFQLENBQWEsZ0JBQWIsQ0FBOEIsT0FBOUIsRUFBdUMsU0FBdkM7QUFDRDs7QUFFRCxRQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsU0FBMUIsQ0FBZjs7QUFDQSxTQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQTVCLEVBQW9DLENBQUMsRUFBckMsRUFBeUM7QUFDdkMsTUFBQSxRQUFRLENBQUUsQ0FBRixDQUFSLENBQWMsZ0JBQWQsQ0FBK0IsT0FBL0IsRUFBd0MsWUFBVTtBQUNoRDtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQSxZQUFJLFFBQVEsRUFBWixFQUFnQjtBQUNkLFVBQUEsU0FBUyxDQUFDLElBQVYsQ0FBZSxJQUFmLEVBQXFCLEtBQXJCO0FBQ0Q7QUFDRixPQWJEO0FBY0Q7O0FBRUQsUUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGdCQUFULENBQTBCLEdBQTFCLENBQXZCOztBQUNBLFNBQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBbEMsRUFBMEMsQ0FBQyxFQUEzQyxFQUE4QztBQUM1QyxNQUFBLFNBQVMsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUQsQ0FBZixDQUF0QjtBQUNEO0FBRUY7O0FBRUQsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQVQsQ0FBYyxhQUFkLENBQTRCLFlBQTVCLENBQWY7O0FBRUEsTUFBSSxRQUFRLE1BQU0sTUFBZCxJQUF3QixNQUFNLENBQUMscUJBQVAsR0FBK0IsS0FBL0IsS0FBeUMsQ0FBckUsRUFBd0U7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFBLFNBQVMsQ0FBQyxJQUFWLENBQWUsTUFBZixFQUF1QixLQUF2QjtBQUNEO0FBQ0YsQ0FuREQ7O0lBcURNLFU7QUFDSix3QkFBYztBQUFBOztBQUNaLFNBQUssSUFBTDtBQUVBLElBQUEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLE1BQWxDLEVBQTBDLEtBQTFDO0FBR0Q7Ozs7V0FFRCxnQkFBUTtBQUVOLE1BQUEsTUFBTTtBQUNQOzs7V0FFRCxvQkFBWTtBQUNWLE1BQUEsTUFBTSxDQUFDLG1CQUFQLENBQTJCLFFBQTNCLEVBQXFDLE1BQXJDLEVBQTZDLEtBQTdDO0FBQ0Q7Ozs7OztBQUdILE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBQWpCOzs7QUMxTEE7Ozs7Ozs7O0lBRU0sZ0I7QUFDRiw0QkFBWSxFQUFaLEVBQWU7QUFBQTs7QUFDWCxTQUFLLGVBQUwsR0FBdUIsd0JBQXZCO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLGdCQUF0QjtBQUVBLFNBQUssVUFBTCxHQUFrQixRQUFRLENBQUMsV0FBVCxDQUFxQixPQUFyQixDQUFsQjtBQUNBLFNBQUssVUFBTCxDQUFnQixTQUFoQixDQUEwQixvQkFBMUIsRUFBZ0QsSUFBaEQsRUFBc0QsSUFBdEQ7QUFFQSxTQUFLLFNBQUwsR0FBaUIsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsT0FBckIsQ0FBakI7QUFDQSxTQUFLLFNBQUwsQ0FBZSxTQUFmLENBQXlCLG1CQUF6QixFQUE4QyxJQUE5QyxFQUFvRCxJQUFwRDtBQUNBLFNBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNBLFNBQUssUUFBTCxHQUFnQixJQUFoQjtBQUVBLFNBQUssSUFBTCxDQUFVLEVBQVY7QUFDSDs7OztXQUVELGNBQU0sRUFBTixFQUFTO0FBQ0wsV0FBSyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsV0FBSyxRQUFMLEdBQWdCLEtBQUssVUFBTCxDQUFnQixnQkFBaEIsQ0FBaUMscUJBQWpDLENBQWhCOztBQUNBLFVBQUcsS0FBSyxRQUFMLENBQWMsTUFBZCxLQUF5QixDQUE1QixFQUE4QjtBQUMxQixjQUFNLElBQUksS0FBSixDQUFVLDZDQUFWLENBQU47QUFDSDs7QUFDRCxVQUFJLElBQUksR0FBRyxJQUFYOztBQUVBLFdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxLQUFLLFFBQUwsQ0FBYyxNQUFqQyxFQUF5QyxDQUFDLEVBQTFDLEVBQTZDO0FBQ3pDLFlBQUksS0FBSyxHQUFHLEtBQUssUUFBTCxDQUFlLENBQWYsQ0FBWjtBQUVBLFFBQUEsS0FBSyxDQUFDLGdCQUFOLENBQXVCLFFBQXZCLEVBQWlDLFlBQVc7QUFDeEMsZUFBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFMLENBQWMsTUFBakMsRUFBeUMsQ0FBQyxFQUExQyxFQUE4QztBQUMxQyxZQUFBLElBQUksQ0FBQyxNQUFMLENBQVksSUFBSSxDQUFDLFFBQUwsQ0FBZSxDQUFmLENBQVo7QUFDSDtBQUNKLFNBSkQ7QUFLQSxhQUFLLE1BQUwsQ0FBWSxLQUFaO0FBQ0g7QUFDSjs7O1dBRUQsZ0JBQVEsU0FBUixFQUFrQjtBQUNkLFVBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxZQUFWLENBQXVCLEtBQUssY0FBNUIsQ0FBakI7O0FBQ0EsVUFBRyxVQUFVLEtBQUssSUFBZixJQUF1QixVQUFVLEtBQUssU0FBdEMsSUFBbUQsVUFBVSxLQUFLLEVBQXJFLEVBQXdFO0FBQ3BFLFlBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLFVBQXZCLENBQWY7O0FBQ0EsWUFBRyxRQUFRLEtBQUssSUFBYixJQUFxQixRQUFRLEtBQUssU0FBckMsRUFBK0M7QUFDM0MsZ0JBQU0sSUFBSSxLQUFKLENBQVUsNkRBQTRELEtBQUssY0FBM0UsQ0FBTjtBQUNIOztBQUNELFlBQUcsU0FBUyxDQUFDLE9BQWIsRUFBcUI7QUFDakIsZUFBSyxJQUFMLENBQVUsU0FBVixFQUFxQixRQUFyQjtBQUNILFNBRkQsTUFFSztBQUNELGVBQUssS0FBTCxDQUFXLFNBQVgsRUFBc0IsUUFBdEI7QUFDSDtBQUNKO0FBQ0o7OztXQUVELGNBQUssU0FBTCxFQUFnQixRQUFoQixFQUF5QjtBQUNyQixVQUFHLFNBQVMsS0FBSyxJQUFkLElBQXNCLFNBQVMsS0FBSyxTQUFwQyxJQUFpRCxRQUFRLEtBQUssSUFBOUQsSUFBc0UsUUFBUSxLQUFLLFNBQXRGLEVBQWdHO0FBQzVGLFFBQUEsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsZUFBdkIsRUFBd0MsTUFBeEM7QUFDQSxRQUFBLFFBQVEsQ0FBQyxTQUFULENBQW1CLE1BQW5CLENBQTBCLFdBQTFCO0FBQ0EsUUFBQSxRQUFRLENBQUMsWUFBVCxDQUFzQixhQUF0QixFQUFxQyxPQUFyQztBQUNBLFFBQUEsU0FBUyxDQUFDLGFBQVYsQ0FBd0IsS0FBSyxTQUE3QjtBQUNIO0FBQ0o7OztXQUNELGVBQU0sU0FBTixFQUFpQixRQUFqQixFQUEwQjtBQUN0QixVQUFHLFNBQVMsS0FBSyxJQUFkLElBQXNCLFNBQVMsS0FBSyxTQUFwQyxJQUFpRCxRQUFRLEtBQUssSUFBOUQsSUFBc0UsUUFBUSxLQUFLLFNBQXRGLEVBQWdHO0FBQzVGLFFBQUEsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsZUFBdkIsRUFBd0MsT0FBeEM7QUFDQSxRQUFBLFFBQVEsQ0FBQyxTQUFULENBQW1CLEdBQW5CLENBQXVCLFdBQXZCO0FBQ0EsUUFBQSxRQUFRLENBQUMsWUFBVCxDQUFzQixhQUF0QixFQUFxQyxNQUFyQztBQUNBLFFBQUEsU0FBUyxDQUFDLGFBQVYsQ0FBd0IsS0FBSyxVQUE3QjtBQUNIO0FBQ0o7Ozs7OztBQUdMLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGdCQUFqQjs7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBRUEsSUFBTSxhQUFhLEdBQUc7QUFDcEIsRUFBQSxLQUFLLEVBQUUsS0FEYTtBQUVwQixFQUFBLEdBQUcsRUFBRSxLQUZlO0FBR3BCLEVBQUEsSUFBSSxFQUFFLEtBSGM7QUFJcEIsRUFBQSxPQUFPLEVBQUU7QUFKVyxDQUF0Qjs7SUFPTSxjLEdBQ0osd0JBQWEsT0FBYixFQUFxQjtBQUFBOztBQUNuQixFQUFBLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixPQUF6QixFQUFrQyxTQUFsQztBQUNBLEVBQUEsT0FBTyxDQUFDLGdCQUFSLENBQXlCLFNBQXpCLEVBQW9DLFNBQXBDO0FBQ0QsQzs7QUFFSCxJQUFJLFNBQVMsR0FBRyxTQUFaLFNBQVksQ0FBVSxLQUFWLEVBQWlCO0FBQy9CLE1BQUcsYUFBYSxDQUFDLElBQWQsSUFBc0IsYUFBYSxDQUFDLE9BQXZDLEVBQWdEO0FBQzlDO0FBQ0Q7O0FBQ0QsTUFBSSxPQUFPLEdBQUcsSUFBZDs7QUFDQSxNQUFHLE9BQU8sS0FBSyxDQUFDLEdBQWIsS0FBcUIsV0FBeEIsRUFBb0M7QUFDbEMsUUFBRyxLQUFLLENBQUMsR0FBTixDQUFVLE1BQVYsS0FBcUIsQ0FBeEIsRUFBMEI7QUFDeEIsTUFBQSxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQWhCO0FBQ0Q7QUFDRixHQUpELE1BSU87QUFDTCxRQUFHLENBQUMsS0FBSyxDQUFDLFFBQVYsRUFBbUI7QUFDakIsTUFBQSxPQUFPLEdBQUcsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsS0FBSyxDQUFDLE9BQTFCLENBQVY7QUFDRCxLQUZELE1BRU87QUFDTCxNQUFBLE9BQU8sR0FBRyxNQUFNLENBQUMsWUFBUCxDQUFvQixLQUFLLENBQUMsUUFBMUIsQ0FBVjtBQUNEO0FBQ0Y7O0FBRUQsTUFBSSxRQUFRLEdBQUcsS0FBSyxZQUFMLENBQWtCLGtCQUFsQixDQUFmOztBQUVBLE1BQUcsS0FBSyxDQUFDLElBQU4sS0FBZSxTQUFmLElBQTRCLEtBQUssQ0FBQyxJQUFOLEtBQWUsT0FBOUMsRUFBc0Q7QUFDcEQsSUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQVo7QUFDRCxHQUZELE1BRU07QUFDSixRQUFJLE9BQU8sR0FBRyxJQUFkOztBQUNBLFFBQUcsS0FBSyxDQUFDLE1BQU4sS0FBaUIsU0FBcEIsRUFBOEI7QUFDNUIsTUFBQSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQWhCO0FBQ0Q7O0FBQ0QsUUFBRyxPQUFPLEtBQUssSUFBWixJQUFvQixPQUFPLEtBQUssSUFBbkMsRUFBeUM7QUFDdkMsVUFBRyxPQUFPLENBQUMsTUFBUixHQUFpQixDQUFwQixFQUFzQjtBQUNwQixZQUFJLFFBQVEsR0FBRyxLQUFLLEtBQXBCOztBQUNBLFlBQUcsT0FBTyxDQUFDLElBQVIsS0FBaUIsUUFBcEIsRUFBNkI7QUFDM0IsVUFBQSxRQUFRLEdBQUcsS0FBSyxLQUFoQixDQUQyQixDQUNMO0FBQ3ZCLFNBRkQsTUFFSztBQUNILFVBQUEsUUFBUSxHQUFHLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsQ0FBakIsRUFBb0IsT0FBTyxDQUFDLGNBQTVCLElBQThDLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsT0FBTyxDQUFDLFlBQXpCLENBQTlDLEdBQXVGLE9BQWxHLENBREcsQ0FDd0c7QUFDNUc7O0FBRUQsWUFBSSxDQUFDLEdBQUcsSUFBSSxNQUFKLENBQVcsUUFBWCxDQUFSOztBQUNBLFlBQUcsQ0FBQyxDQUFDLElBQUYsQ0FBTyxRQUFQLE1BQXFCLElBQXhCLEVBQTZCO0FBQzNCLGNBQUksS0FBSyxDQUFDLGNBQVYsRUFBMEI7QUFDeEIsWUFBQSxLQUFLLENBQUMsY0FBTjtBQUNELFdBRkQsTUFFTztBQUNMLFlBQUEsS0FBSyxDQUFDLFdBQU4sR0FBb0IsS0FBcEI7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQUNGO0FBQ0YsQ0E5Q0Q7O0FBZ0RBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGNBQWpCOzs7Ozs7Ozs7OztBQ3JFQSxJQUFJLEVBQUUsR0FBRztBQUNQLGdCQUFjLFlBRFA7QUFFUCxrQkFBZ0IsZUFGVDtBQUdQLHFCQUFtQixrQkFIWjtBQUlQLHVCQUFxQjtBQUpkLENBQVQ7O0lBT00sbUI7QUFDSiwrQkFBYSxLQUFiLEVBQWtDO0FBQUEsUUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ2hDLFNBQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxJQUFBLEVBQUUsR0FBRyxPQUFMO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7Ozs7O1dBQ0UsZ0JBQU07QUFDSixXQUFLLGFBQUwsR0FBcUIsS0FBSyxnQkFBTCxFQUFyQjtBQUNBLFdBQUssaUJBQUwsR0FBeUIsS0FBSyxlQUFMLEVBQXpCOztBQUNBLFVBQUcsS0FBSyxpQkFBTCxDQUF1QixNQUF2QixLQUFrQyxDQUFyQyxFQUF1QztBQUNyQyxhQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsS0FBSyxpQkFBTCxDQUF1QixNQUExQyxFQUFrRCxDQUFDLEVBQW5ELEVBQXNEO0FBQ3BELGNBQUksUUFBUSxHQUFHLEtBQUssaUJBQUwsQ0FBdUIsQ0FBdkIsQ0FBZjtBQUNBLFVBQUEsUUFBUSxDQUFDLG1CQUFULENBQTZCLFFBQTdCLEVBQXVDLGdCQUF2QztBQUNBLFVBQUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLFFBQTFCLEVBQW9DLGdCQUFwQztBQUNEO0FBQ0Y7O0FBQ0QsVUFBRyxLQUFLLGFBQUwsS0FBdUIsS0FBMUIsRUFBZ0M7QUFDOUIsYUFBSyxhQUFMLENBQW1CLG1CQUFuQixDQUF1QyxRQUF2QyxFQUFpRCxrQkFBakQ7QUFDQSxhQUFLLGFBQUwsQ0FBbUIsZ0JBQW5CLENBQW9DLFFBQXBDLEVBQThDLGtCQUE5QztBQUNEO0FBQ0Y7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7OztXQUNFLDRCQUFrQjtBQUNoQixVQUFJLFFBQVEsR0FBRyxLQUFLLEtBQUwsQ0FBVyxvQkFBWCxDQUFnQyxPQUFoQyxFQUF5QyxDQUF6QyxFQUE0QyxzQkFBNUMsQ0FBbUUsZUFBbkUsQ0FBZjs7QUFDQSxVQUFHLFFBQVEsQ0FBQyxNQUFULEtBQW9CLENBQXZCLEVBQXlCO0FBQ3ZCLGVBQU8sS0FBUDtBQUNEOztBQUNELGFBQU8sUUFBUSxDQUFDLENBQUQsQ0FBZjtBQUNEO0FBQ0Q7QUFDRjtBQUNBO0FBQ0E7Ozs7V0FDRSwyQkFBaUI7QUFDZixhQUFPLEtBQUssS0FBTCxDQUFXLG9CQUFYLENBQWdDLE9BQWhDLEVBQXlDLENBQXpDLEVBQTRDLHNCQUE1QyxDQUFtRSxlQUFuRSxDQUFQO0FBQ0Q7Ozs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVMsa0JBQVQsQ0FBNEIsQ0FBNUIsRUFBOEI7QUFDNUIsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQWpCO0FBQ0EsRUFBQSxRQUFRLENBQUMsZUFBVCxDQUF5QixjQUF6QjtBQUNBLE1BQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFGLENBQVMsVUFBVCxDQUFvQixVQUFwQixDQUErQixVQUEvQixDQUEwQyxVQUF0RDtBQUNBLE1BQUksbUJBQW1CLEdBQUcsSUFBSSxtQkFBSixDQUF3QixLQUF4QixDQUExQjtBQUNBLE1BQUksWUFBWSxHQUFHLG1CQUFtQixDQUFDLGVBQXBCLEVBQW5CO0FBQ0EsTUFBSSxhQUFhLEdBQUcsQ0FBcEI7O0FBQ0EsTUFBRyxRQUFRLENBQUMsT0FBWixFQUFvQjtBQUNsQixTQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQWhDLEVBQXdDLENBQUMsRUFBekMsRUFBNEM7QUFDMUMsTUFBQSxZQUFZLENBQUMsQ0FBRCxDQUFaLENBQWdCLE9BQWhCLEdBQTBCLElBQTFCO0FBQ0EsTUFBQSxZQUFZLENBQUMsQ0FBRCxDQUFaLENBQWdCLFVBQWhCLENBQTJCLFVBQTNCLENBQXNDLFNBQXRDLENBQWdELEdBQWhELENBQW9ELG9CQUFwRDtBQUNBLE1BQUEsWUFBWSxDQUFDLENBQUQsQ0FBWixDQUFnQixrQkFBaEIsQ0FBbUMsWUFBbkMsQ0FBZ0QsWUFBaEQsRUFBOEQsRUFBRSxDQUFDLFlBQWpFO0FBQ0Q7O0FBRUQsSUFBQSxhQUFhLEdBQUcsWUFBWSxDQUFDLE1BQTdCO0FBQ0EsSUFBQSxRQUFRLENBQUMsa0JBQVQsQ0FBNEIsWUFBNUIsQ0FBeUMsWUFBekMsRUFBdUQsRUFBRSxDQUFDLGlCQUExRDtBQUNELEdBVEQsTUFTTTtBQUNKLFNBQUksSUFBSSxFQUFDLEdBQUcsQ0FBWixFQUFlLEVBQUMsR0FBRyxZQUFZLENBQUMsTUFBaEMsRUFBd0MsRUFBQyxFQUF6QyxFQUE0QztBQUMxQyxNQUFBLFlBQVksQ0FBQyxFQUFELENBQVosQ0FBZ0IsT0FBaEIsR0FBMEIsS0FBMUI7O0FBQ0EsTUFBQSxZQUFZLENBQUMsRUFBRCxDQUFaLENBQWdCLFVBQWhCLENBQTJCLFVBQTNCLENBQXNDLFNBQXRDLENBQWdELE1BQWhELENBQXVELG9CQUF2RDs7QUFDQSxNQUFBLFlBQVksQ0FBQyxFQUFELENBQVosQ0FBZ0Isa0JBQWhCLENBQW1DLFlBQW5DLENBQWdELFlBQWhELEVBQThELEVBQUUsQ0FBQyxVQUFqRTtBQUNEOztBQUNELElBQUEsUUFBUSxDQUFDLGtCQUFULENBQTRCLFlBQTVCLENBQXlDLFlBQXpDLEVBQXVELEVBQUUsQ0FBQyxlQUExRDtBQUNEOztBQUVELE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSixDQUFnQiw4QkFBaEIsRUFBZ0Q7QUFDNUQsSUFBQSxPQUFPLEVBQUUsSUFEbUQ7QUFFNUQsSUFBQSxVQUFVLEVBQUUsSUFGZ0Q7QUFHNUQsSUFBQSxNQUFNLEVBQUU7QUFBQyxNQUFBLGFBQWEsRUFBYjtBQUFEO0FBSG9ELEdBQWhELENBQWQ7QUFLQSxFQUFBLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQXBCO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyxnQkFBVCxDQUEwQixDQUExQixFQUE0QjtBQUMxQjtBQUNBLE1BQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxPQUFaLEVBQW9CO0FBQ2xCLElBQUEsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxVQUFULENBQW9CLFVBQXBCLENBQStCLFNBQS9CLENBQXlDLEdBQXpDLENBQTZDLG9CQUE3QztBQUNBLElBQUEsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxrQkFBVCxDQUE0QixZQUE1QixDQUF5QyxZQUF6QyxFQUF1RCxFQUFFLENBQUMsWUFBMUQ7QUFDRCxHQUhELE1BR007QUFDSixJQUFBLENBQUMsQ0FBQyxNQUFGLENBQVMsVUFBVCxDQUFvQixVQUFwQixDQUErQixTQUEvQixDQUF5QyxNQUF6QyxDQUFnRCxvQkFBaEQ7QUFDQSxJQUFBLENBQUMsQ0FBQyxNQUFGLENBQVMsa0JBQVQsQ0FBNEIsWUFBNUIsQ0FBeUMsWUFBekMsRUFBdUQsRUFBRSxDQUFDLFVBQTFEO0FBQ0Q7O0FBQ0QsTUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxVQUFULENBQW9CLFVBQXBCLENBQStCLFVBQS9CLENBQTBDLFVBQXREO0FBQ0EsTUFBSSxtQkFBbUIsR0FBRyxJQUFJLG1CQUFKLENBQXdCLEtBQXhCLENBQTFCO0FBQ0EsTUFBSSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsZ0JBQXBCLEVBQXBCOztBQUNBLE1BQUcsYUFBYSxLQUFLLEtBQXJCLEVBQTJCO0FBQ3pCLFFBQUksWUFBWSxHQUFHLG1CQUFtQixDQUFDLGVBQXBCLEVBQW5CLENBRHlCLENBR3pCOztBQUNBLFFBQUksYUFBYSxHQUFHLENBQXBCOztBQUNBLFNBQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBaEMsRUFBd0MsQ0FBQyxFQUF6QyxFQUE0QztBQUMxQyxVQUFJLGNBQWMsR0FBRyxZQUFZLENBQUMsQ0FBRCxDQUFqQzs7QUFDQSxVQUFHLGNBQWMsQ0FBQyxPQUFsQixFQUEwQjtBQUN4QixRQUFBLGFBQWE7QUFDZDtBQUNGOztBQUVELFFBQUcsYUFBYSxLQUFLLFlBQVksQ0FBQyxNQUFsQyxFQUF5QztBQUFFO0FBQ3pDLE1BQUEsYUFBYSxDQUFDLGVBQWQsQ0FBOEIsY0FBOUI7QUFDQSxNQUFBLGFBQWEsQ0FBQyxPQUFkLEdBQXdCLElBQXhCO0FBQ0EsTUFBQSxhQUFhLENBQUMsa0JBQWQsQ0FBaUMsWUFBakMsQ0FBOEMsWUFBOUMsRUFBNEQsRUFBRSxDQUFDLGlCQUEvRDtBQUNELEtBSkQsTUFJTyxJQUFHLGFBQWEsSUFBSSxDQUFwQixFQUFzQjtBQUFFO0FBQzdCLE1BQUEsYUFBYSxDQUFDLGVBQWQsQ0FBOEIsY0FBOUI7QUFDQSxNQUFBLGFBQWEsQ0FBQyxPQUFkLEdBQXdCLEtBQXhCO0FBQ0EsTUFBQSxhQUFhLENBQUMsa0JBQWQsQ0FBaUMsWUFBakMsQ0FBOEMsWUFBOUMsRUFBNEQsRUFBRSxDQUFDLGVBQS9EO0FBQ0QsS0FKTSxNQUlEO0FBQUU7QUFDTixNQUFBLGFBQWEsQ0FBQyxZQUFkLENBQTJCLGNBQTNCLEVBQTJDLE9BQTNDO0FBQ0EsTUFBQSxhQUFhLENBQUMsT0FBZCxHQUF3QixLQUF4QjtBQUNBLE1BQUEsYUFBYSxDQUFDLGtCQUFkLENBQWlDLFlBQWpDLENBQThDLFlBQTlDLEVBQTRELEVBQUUsQ0FBQyxlQUEvRDtBQUNEOztBQUNELFFBQU0sS0FBSyxHQUFHLElBQUksV0FBSixDQUFnQiw4QkFBaEIsRUFBZ0Q7QUFDNUQsTUFBQSxPQUFPLEVBQUUsSUFEbUQ7QUFFNUQsTUFBQSxVQUFVLEVBQUUsSUFGZ0Q7QUFHNUQsTUFBQSxNQUFNLEVBQUU7QUFBQyxRQUFBLGFBQWEsRUFBYjtBQUFEO0FBSG9ELEtBQWhELENBQWQ7QUFLQSxJQUFBLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQXBCO0FBQ0Q7QUFDRjs7QUFFRCxNQUFNLENBQUMsT0FBUCxHQUFpQixtQkFBakI7OztBQzNJQTs7OztBQUNBLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFELENBQXhCOztJQUVNLFcsR0FDSixxQkFBYSxPQUFiLEVBQXFCO0FBQUE7O0FBQ25CLEVBQUEsT0FBTyxDQUFDLGdCQUFSLENBQXlCLE9BQXpCLEVBQWtDLFlBQVc7QUFDM0M7QUFDQTtBQUNBLFFBQU0sRUFBRSxHQUFHLEtBQUssWUFBTCxDQUFrQixNQUFsQixFQUEwQixLQUExQixDQUFnQyxDQUFoQyxDQUFYO0FBQ0EsUUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsRUFBeEIsQ0FBZjs7QUFDQSxRQUFJLE1BQUosRUFBWTtBQUNWLE1BQUEsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsVUFBcEIsRUFBZ0MsQ0FBaEM7QUFDQSxNQUFBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxRQUFRLENBQUMsSUFBVCxDQUFjLFVBQUEsS0FBSyxFQUFJO0FBQ3JELFFBQUEsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsVUFBcEIsRUFBZ0MsQ0FBQyxDQUFqQztBQUNELE9BRitCLENBQWhDO0FBR0QsS0FMRCxNQUtPLENBQ0w7QUFDRDtBQUNGLEdBYkQ7QUFjRCxDOztBQUdILE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFdBQWpCOzs7Ozs7Ozs7OztBQ3RCQSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQUQsQ0FBdEI7O0lBRU0sZTtBQUNGLDJCQUFhLEtBQWIsRUFBb0I7QUFBQTs7QUFDaEIsU0FBSyx3QkFBTCxDQUE4QixLQUE5QjtBQUNILEcsQ0FFRDs7Ozs7V0FDQSxrQ0FBMEIsT0FBMUIsRUFBa0M7QUFDOUIsVUFBSSxDQUFDLE9BQUwsRUFBYztBQUVkLFVBQUksTUFBTSxHQUFJLE9BQU8sQ0FBQyxvQkFBUixDQUE2QixPQUE3QixDQUFkOztBQUNBLFVBQUcsTUFBTSxDQUFDLE1BQVAsS0FBa0IsQ0FBckIsRUFBd0I7QUFDdEIsWUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFFLENBQUYsQ0FBTixDQUFZLG9CQUFaLENBQWlDLElBQWpDLENBQXBCOztBQUNBLFlBQUksYUFBYSxDQUFDLE1BQWQsSUFBd0IsQ0FBNUIsRUFBK0I7QUFDN0IsVUFBQSxhQUFhLEdBQUcsTUFBTSxDQUFFLENBQUYsQ0FBTixDQUFZLG9CQUFaLENBQWlDLElBQWpDLENBQWhCO0FBQ0Q7O0FBRUQsWUFBSSxhQUFhLENBQUMsTUFBbEIsRUFBMEI7QUFDeEIsY0FBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQUQsRUFBYSxPQUFiLENBQXpCO0FBQ0EsVUFBQSxLQUFLLENBQUMsSUFBTixDQUFXLFVBQVgsRUFBdUIsT0FBdkIsQ0FBK0IsVUFBQSxLQUFLLEVBQUk7QUFDdEMsZ0JBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxRQUFwQjs7QUFDQSxnQkFBSSxPQUFPLENBQUMsTUFBUixLQUFtQixhQUFhLENBQUMsTUFBckMsRUFBNkM7QUFDM0MsY0FBQSxLQUFLLENBQUMsSUFBTixDQUFXLGFBQVgsRUFBMEIsT0FBMUIsQ0FBa0MsVUFBQyxZQUFELEVBQWUsQ0FBZixFQUFxQjtBQUNyRDtBQUNBLG9CQUFHLENBQUMsT0FBTyxDQUFFLENBQUYsQ0FBUCxDQUFhLFlBQWIsQ0FBMEIsWUFBMUIsQ0FBSixFQUE2QztBQUMzQyxrQkFBQSxPQUFPLENBQUUsQ0FBRixDQUFQLENBQWEsWUFBYixDQUEwQixZQUExQixFQUF3QyxZQUFZLENBQUMsV0FBckQ7QUFDRDtBQUNGLGVBTEQ7QUFNRDtBQUNGLFdBVkQ7QUFXRDtBQUNGO0FBQ0o7Ozs7OztBQUdMLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGVBQWpCOzs7QUNwQ0E7Ozs7QUFDQSxJQUFJLFdBQVcsR0FBRztBQUNoQixRQUFNLENBRFU7QUFFaEIsUUFBTSxHQUZVO0FBR2hCLFFBQU0sR0FIVTtBQUloQixRQUFNLEdBSlU7QUFLaEIsUUFBTTtBQUxVLENBQWxCOztJQU9NLE0sR0FFSixnQkFBYSxNQUFiLEVBQXFCO0FBQUE7O0FBQ25CLE9BQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxPQUFLLElBQUwsR0FBWSxLQUFLLE1BQUwsQ0FBWSxnQkFBWixDQUE2QixvQkFBN0IsQ0FBWjs7QUFDQSxNQUFHLEtBQUssSUFBTCxDQUFVLE1BQVYsS0FBcUIsQ0FBeEIsRUFBMEI7QUFDeEIsVUFBTSxJQUFJLEtBQUosOEhBQU47QUFDRCxHQUxrQixDQU9uQjs7O0FBQ0EsTUFBSSxDQUFDLGdCQUFnQixFQUFyQixFQUF5QjtBQUN2QjtBQUNBLFFBQUksR0FBRyxHQUFHLEtBQUssSUFBTCxDQUFXLENBQVgsQ0FBVixDQUZ1QixDQUl2Qjs7QUFDQSxRQUFJLGFBQWEsR0FBRyxhQUFhLENBQUMsS0FBSyxNQUFOLENBQWpDOztBQUNBLFFBQUksYUFBYSxDQUFDLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUIsTUFBQSxHQUFHLEdBQUcsYUFBYSxDQUFFLENBQUYsQ0FBbkI7QUFDRCxLQVJzQixDQVV2Qjs7O0FBQ0EsSUFBQSxXQUFXLENBQUMsR0FBRCxFQUFNLEtBQU4sQ0FBWDtBQUNELEdBcEJrQixDQXNCbkI7OztBQUNBLE9BQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxLQUFLLElBQUwsQ0FBVSxNQUE3QixFQUFxQyxDQUFDLEVBQXRDLEVBQTBDO0FBQ3hDLElBQUEsWUFBWSxDQUFDLEtBQUssSUFBTCxDQUFXLENBQVgsQ0FBRCxDQUFaO0FBQ0Q7QUFDRixDLEVBR0g7OztBQUNBLElBQUksSUFBSSxHQUFHO0FBQ1QsRUFBQSxHQUFHLEVBQUUsRUFESTtBQUVULEVBQUEsSUFBSSxFQUFFLEVBRkc7QUFHVCxFQUFBLElBQUksRUFBRSxFQUhHO0FBSVQsRUFBQSxFQUFFLEVBQUUsRUFKSztBQUtULEVBQUEsS0FBSyxFQUFFLEVBTEU7QUFNVCxFQUFBLElBQUksRUFBRSxFQU5HO0FBT1QsWUFBUTtBQVBDLENBQVgsQyxDQVVBOztBQUNBLElBQUksU0FBUyxHQUFHO0FBQ2QsTUFBSSxDQUFDLENBRFM7QUFFZCxNQUFJLENBQUMsQ0FGUztBQUdkLE1BQUksQ0FIVTtBQUlkLE1BQUk7QUFKVSxDQUFoQjs7QUFRQSxTQUFTLFlBQVQsQ0FBdUIsR0FBdkIsRUFBNEI7QUFDMUIsRUFBQSxHQUFHLENBQUMsZ0JBQUosQ0FBcUIsT0FBckIsRUFBOEIsa0JBQTlCO0FBQ0EsRUFBQSxHQUFHLENBQUMsZ0JBQUosQ0FBcUIsU0FBckIsRUFBZ0Msb0JBQWhDO0FBQ0EsRUFBQSxHQUFHLENBQUMsZ0JBQUosQ0FBcUIsT0FBckIsRUFBOEIsa0JBQTlCO0FBQ0QsQyxDQUVEOzs7QUFDQSxTQUFTLGtCQUFULENBQTZCLEtBQTdCLEVBQW9DO0FBQ2xDLE1BQUksR0FBRyxHQUFHLElBQVY7QUFDQSxFQUFBLFdBQVcsQ0FBQyxHQUFELEVBQU0sS0FBTixDQUFYO0FBQ0QsQyxDQUdEOzs7QUFDQSxTQUFTLG9CQUFULENBQStCLEtBQS9CLEVBQXNDO0FBQ3BDLE1BQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFoQjs7QUFFQSxVQUFRLEdBQVI7QUFDRSxTQUFLLElBQUksQ0FBQyxHQUFWO0FBQ0UsTUFBQSxLQUFLLENBQUMsY0FBTixHQURGLENBRUU7O0FBQ0EsTUFBQSxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQVAsQ0FBWjtBQUNBOztBQUNGLFNBQUssSUFBSSxDQUFDLElBQVY7QUFDRSxNQUFBLEtBQUssQ0FBQyxjQUFOLEdBREYsQ0FFRTs7QUFDQSxNQUFBLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBUCxDQUFiO0FBQ0E7QUFDRjtBQUNBOztBQUNBLFNBQUssSUFBSSxDQUFDLEVBQVY7QUFDQSxTQUFLLElBQUksQ0FBQyxJQUFWO0FBQ0UsTUFBQSxvQkFBb0IsQ0FBQyxLQUFELENBQXBCO0FBQ0E7QUFoQko7QUFrQkQsQyxDQUVEOzs7QUFDQSxTQUFTLGtCQUFULENBQTZCLEtBQTdCLEVBQW9DO0FBQ2xDLE1BQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFoQjs7QUFFQSxVQUFRLEdBQVI7QUFDRSxTQUFLLElBQUksQ0FBQyxJQUFWO0FBQ0EsU0FBSyxJQUFJLENBQUMsS0FBVjtBQUNFLE1BQUEsb0JBQW9CLENBQUMsS0FBRCxDQUFwQjtBQUNBOztBQUNGLFNBQUssSUFBSSxVQUFUO0FBQ0U7O0FBQ0YsU0FBSyxJQUFJLENBQUMsS0FBVjtBQUNBLFNBQUssSUFBSSxDQUFDLEtBQVY7QUFDRSxNQUFBLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBUCxFQUFlLElBQWYsQ0FBWDtBQUNBO0FBVko7QUFZRCxDLENBSUQ7QUFDQTtBQUNBOzs7QUFDQSxTQUFTLG9CQUFULENBQStCLEtBQS9CLEVBQXNDO0FBQ3BDLE1BQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFoQjtBQUVBLE1BQUksQ0FBQyxHQUFDLE1BQU47QUFBQSxNQUNFLENBQUMsR0FBQyxRQURKO0FBQUEsTUFFRSxDQUFDLEdBQUMsQ0FBQyxDQUFDLGVBRk47QUFBQSxNQUdFLENBQUMsR0FBQyxDQUFDLENBQUMsb0JBQUYsQ0FBdUIsTUFBdkIsRUFBZ0MsQ0FBaEMsQ0FISjtBQUFBLE1BSUUsQ0FBQyxHQUFDLENBQUMsQ0FBQyxVQUFGLElBQWMsQ0FBQyxDQUFDLFdBQWhCLElBQTZCLENBQUMsQ0FBQyxXQUpuQztBQUFBLE1BS0UsQ0FBQyxHQUFDLENBQUMsQ0FBQyxXQUFGLElBQWUsQ0FBQyxDQUFDLFlBQWpCLElBQStCLENBQUMsQ0FBQyxZQUxyQztBQU9BLE1BQUksUUFBUSxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsRUFBL0I7QUFDQSxNQUFJLE9BQU8sR0FBRyxLQUFkOztBQUVBLE1BQUksUUFBSixFQUFjO0FBQ1osUUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLEVBQWIsSUFBbUIsR0FBRyxLQUFLLElBQUksQ0FBQyxJQUFwQyxFQUEwQztBQUN4QyxNQUFBLEtBQUssQ0FBQyxjQUFOO0FBQ0EsTUFBQSxPQUFPLEdBQUcsSUFBVjtBQUNEO0FBQ0YsR0FMRCxNQU1LO0FBQ0gsUUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLElBQWIsSUFBcUIsR0FBRyxLQUFLLElBQUksQ0FBQyxLQUF0QyxFQUE2QztBQUMzQyxNQUFBLE9BQU8sR0FBRyxJQUFWO0FBQ0Q7QUFDRjs7QUFDRCxNQUFJLE9BQUosRUFBYTtBQUNYLElBQUEscUJBQXFCLENBQUMsS0FBRCxDQUFyQjtBQUNEO0FBQ0YsQyxDQUVEO0FBQ0E7OztBQUNBLFNBQVMscUJBQVQsQ0FBZ0MsS0FBaEMsRUFBdUM7QUFDckMsTUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQXBCOztBQUNBLE1BQUksU0FBUyxDQUFFLE9BQUYsQ0FBYixFQUEwQjtBQUN4QixRQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBbkI7QUFDQSxRQUFJLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxNQUFELENBQTNCO0FBQ0EsUUFBSSxLQUFLLEdBQUcsdUJBQXVCLENBQUMsTUFBRCxFQUFTLElBQVQsQ0FBbkM7O0FBQ0EsUUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFmLEVBQWtCO0FBQ2hCLFVBQUksSUFBSSxDQUFFLEtBQUssR0FBRyxTQUFTLENBQUUsT0FBRixDQUFuQixDQUFSLEVBQTBDO0FBQ3hDLFFBQUEsSUFBSSxDQUFFLEtBQUssR0FBRyxTQUFTLENBQUUsT0FBRixDQUFuQixDQUFKLENBQXFDLEtBQXJDO0FBQ0QsT0FGRCxNQUdLLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFqQixJQUF5QixPQUFPLEtBQUssSUFBSSxDQUFDLEVBQTlDLEVBQWtEO0FBQ3JELFFBQUEsWUFBWSxDQUFDLE1BQUQsQ0FBWjtBQUNELE9BRkksTUFHQSxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsS0FBakIsSUFBMEIsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUE5QyxFQUFvRDtBQUN2RCxRQUFBLGFBQWEsQ0FBQyxNQUFELENBQWI7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVMsYUFBVCxDQUF3QixNQUF4QixFQUFnQztBQUM5QixTQUFPLE1BQU0sQ0FBQyxnQkFBUCxDQUF3Qix3Q0FBeEIsQ0FBUDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyxnQkFBVCxDQUEyQixHQUEzQixFQUFnQztBQUM5QixNQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBckI7O0FBQ0EsTUFBSSxVQUFVLENBQUMsU0FBWCxDQUFxQixRQUFyQixDQUE4QixRQUE5QixDQUFKLEVBQTZDO0FBQzNDLFdBQU8sVUFBVSxDQUFDLGdCQUFYLENBQTRCLG9CQUE1QixDQUFQO0FBQ0Q7O0FBQ0QsU0FBTyxFQUFQO0FBQ0Q7O0FBRUQsU0FBUyx1QkFBVCxDQUFrQyxPQUFsQyxFQUEyQyxJQUEzQyxFQUFnRDtBQUM5QyxNQUFJLEtBQUssR0FBRyxDQUFDLENBQWI7O0FBQ0EsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBekIsRUFBaUMsQ0FBQyxFQUFsQyxFQUFzQztBQUNwQyxRQUFHLElBQUksQ0FBRSxDQUFGLENBQUosS0FBYyxPQUFqQixFQUF5QjtBQUN2QixNQUFBLEtBQUssR0FBRyxDQUFSO0FBQ0E7QUFDRDtBQUNGOztBQUVELFNBQU8sS0FBUDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVMsZ0JBQVQsR0FBNkI7QUFDM0IsTUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQVQsQ0FBYyxPQUFkLENBQXNCLEdBQXRCLEVBQTJCLEVBQTNCLENBQVg7O0FBQ0EsTUFBSSxJQUFJLEtBQUssRUFBYixFQUFpQjtBQUNmLFFBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLHdDQUF3QyxJQUF4QyxHQUErQyxJQUF0RSxDQUFWOztBQUNBLFFBQUksR0FBRyxLQUFLLElBQVosRUFBa0I7QUFDaEIsTUFBQSxXQUFXLENBQUMsR0FBRCxFQUFNLEtBQU4sQ0FBWDtBQUNBLGFBQU8sSUFBUDtBQUNEO0FBQ0Y7O0FBQ0QsU0FBTyxLQUFQO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyxXQUFULENBQXNCLEdBQXRCLEVBQTJCLFFBQTNCLEVBQXFDO0FBQ25DLEVBQUEsdUJBQXVCLENBQUMsR0FBRCxDQUF2QjtBQUVBLE1BQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxZQUFKLENBQWlCLGVBQWpCLENBQWpCO0FBQ0EsTUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsVUFBeEIsQ0FBZjs7QUFDQSxNQUFHLFFBQVEsS0FBSyxJQUFoQixFQUFxQjtBQUNuQixVQUFNLElBQUksS0FBSixtQ0FBTjtBQUNEOztBQUVELEVBQUEsR0FBRyxDQUFDLFlBQUosQ0FBaUIsZUFBakIsRUFBa0MsTUFBbEM7QUFDQSxFQUFBLFFBQVEsQ0FBQyxZQUFULENBQXNCLGFBQXRCLEVBQXFDLE9BQXJDO0FBQ0EsRUFBQSxHQUFHLENBQUMsZUFBSixDQUFvQixVQUFwQixFQVhtQyxDQWFuQzs7QUFDQSxNQUFJLFFBQUosRUFBYztBQUNaLElBQUEsR0FBRyxDQUFDLEtBQUo7QUFDRDs7QUFFRCxFQUFBLFdBQVcsQ0FBQyxHQUFELEVBQU0sb0JBQU4sQ0FBWDtBQUNBLEVBQUEsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFMLEVBQWlCLGlCQUFqQixDQUFYO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBUyx1QkFBVCxDQUFrQyxTQUFsQyxFQUE2QztBQUMzQyxNQUFJLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxTQUFELENBQTNCOztBQUVBLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQXpCLEVBQWlDLENBQUMsRUFBbEMsRUFBc0M7QUFDcEMsUUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFFLENBQUYsQ0FBZDs7QUFDQSxRQUFJLEdBQUcsS0FBSyxTQUFaLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBRUQsUUFBSSxHQUFHLENBQUMsWUFBSixDQUFpQixlQUFqQixNQUFzQyxNQUExQyxFQUFrRDtBQUNoRCxNQUFBLFdBQVcsQ0FBQyxHQUFELEVBQU0sa0JBQU4sQ0FBWDtBQUNEOztBQUVELElBQUEsR0FBRyxDQUFDLFlBQUosQ0FBaUIsVUFBakIsRUFBNkIsSUFBN0I7QUFDQSxJQUFBLEdBQUcsQ0FBQyxZQUFKLENBQWlCLGVBQWpCLEVBQWtDLE9BQWxDO0FBQ0EsUUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLFlBQUosQ0FBaUIsZUFBakIsQ0FBakI7QUFDQSxRQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixVQUF4QixDQUFmOztBQUNBLFFBQUcsUUFBUSxLQUFLLElBQWhCLEVBQXFCO0FBQ25CLFlBQU0sSUFBSSxLQUFKLDRCQUFOO0FBQ0Q7O0FBQ0QsSUFBQSxRQUFRLENBQUMsWUFBVCxDQUFzQixhQUF0QixFQUFxQyxNQUFyQztBQUNEO0FBQ0Y7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxTQUFTLFdBQVQsQ0FBc0IsT0FBdEIsRUFBK0IsU0FBL0IsRUFBMEM7QUFDeEMsTUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsT0FBckIsQ0FBWjtBQUNBLEVBQUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsU0FBaEIsRUFBMkIsSUFBM0IsRUFBaUMsSUFBakM7QUFDQSxFQUFBLE9BQU8sQ0FBQyxhQUFSLENBQXNCLEtBQXRCO0FBQ0QsQyxDQUVEOzs7QUFDQSxTQUFTLGFBQVQsQ0FBd0IsR0FBeEIsRUFBNkI7QUFDM0IsRUFBQSxnQkFBZ0IsQ0FBQyxHQUFELENBQWhCLENBQXVCLENBQXZCLEVBQTJCLEtBQTNCO0FBQ0QsQyxDQUVEOzs7QUFDQSxTQUFTLFlBQVQsQ0FBdUIsR0FBdkIsRUFBNEI7QUFDMUIsTUFBSSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsR0FBRCxDQUEzQjtBQUNBLEVBQUEsSUFBSSxDQUFFLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBaEIsQ0FBSixDQUF3QixLQUF4QjtBQUNEOztBQUdELE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BQWpCOzs7Ozs7Ozs7OztJQ3pTTSxLO0FBRUYsaUJBQVksT0FBWixFQUFvQjtBQUFBOztBQUNoQixTQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0g7Ozs7V0FFRCxnQkFBTTtBQUNGLFdBQUssT0FBTCxDQUFhLFNBQWIsQ0FBdUIsTUFBdkIsQ0FBOEIsTUFBOUI7QUFDQSxXQUFLLE9BQUwsQ0FBYSxTQUFiLENBQXVCLEdBQXZCLENBQTJCLFNBQTNCO0FBQ0EsV0FBSyxPQUFMLENBQWEsc0JBQWIsQ0FBb0MsYUFBcEMsRUFBbUQsQ0FBbkQsRUFBc0QsZ0JBQXRELENBQXVFLE9BQXZFLEVBQWdGLFlBQVU7QUFDdEYsWUFBSSxLQUFLLEdBQUcsS0FBSyxVQUFMLENBQWdCLFVBQTVCO0FBQ0EsWUFBSSxLQUFKLENBQVUsS0FBVixFQUFpQixJQUFqQjtBQUNILE9BSEQ7QUFJQSxNQUFBLHFCQUFxQixDQUFDLFNBQUQsQ0FBckI7QUFDSDs7O1dBRUQsZ0JBQU07QUFDRixXQUFLLE9BQUwsQ0FBYSxTQUFiLENBQXVCLE1BQXZCLENBQThCLE1BQTlCO0FBQ0EsV0FBSyxPQUFMLENBQWEsU0FBYixDQUF1QixHQUF2QixDQUEyQixNQUEzQjtBQUVIOzs7Ozs7QUFHTCxTQUFTLFNBQVQsR0FBb0I7QUFDaEIsTUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGdCQUFULENBQTBCLGdCQUExQixDQUFiOztBQUNBLE9BQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBMUIsRUFBa0MsQ0FBQyxFQUFuQyxFQUFzQztBQUNsQyxRQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBRCxDQUFsQjtBQUNBLElBQUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsTUFBaEIsQ0FBdUIsU0FBdkI7QUFDQSxJQUFBLEtBQUssQ0FBQyxTQUFOLENBQWdCLEdBQWhCLENBQW9CLE1BQXBCO0FBQ0g7QUFDSjs7QUFFRCxNQUFNLENBQUMsT0FBUCxHQUFpQixLQUFqQjs7Ozs7Ozs7Ozs7SUNoQ00sTztBQUNKLG1CQUFZLE9BQVosRUFBb0I7QUFBQTs7QUFDbEIsU0FBSyxPQUFMLEdBQWUsT0FBZjs7QUFDQSxRQUFHLEtBQUssT0FBTCxDQUFhLFlBQWIsQ0FBMEIsY0FBMUIsTUFBOEMsSUFBakQsRUFBc0Q7QUFDcEQsWUFBTSxJQUFJLEtBQUosZ0dBQU47QUFDRDs7QUFDRCxTQUFLLFNBQUw7QUFDRDs7OztXQUVELHFCQUFZO0FBQ1YsVUFBSSxJQUFJLEdBQUcsSUFBWDtBQUNFLFdBQUssT0FBTCxDQUFhLGdCQUFiLENBQThCLFlBQTlCLEVBQTRDLFVBQVUsQ0FBVixFQUFhO0FBRXZELFFBQUEsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxTQUFULENBQW1CLEdBQW5CLENBQXVCLGVBQXZCO0FBQ0EsUUFBQSxVQUFVLENBQUMsWUFBVTtBQUNuQixjQUFHLENBQUMsQ0FBQyxNQUFGLENBQVMsU0FBVCxDQUFtQixRQUFuQixDQUE0QixlQUE1QixDQUFILEVBQWdEO0FBQzlDLGdCQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBaEI7QUFFQSxnQkFBSSxPQUFPLENBQUMsWUFBUixDQUFxQixrQkFBckIsTUFBNkMsSUFBakQsRUFBdUQ7QUFDdkQsWUFBQSxDQUFDLENBQUMsY0FBRjtBQUVBLGdCQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsWUFBUixDQUFxQix1QkFBckIsS0FBaUQsS0FBM0Q7QUFFQSxnQkFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsT0FBbkIsRUFBNEIsR0FBNUIsQ0FBZDtBQUVBLFlBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxXQUFkLENBQTBCLE9BQTFCO0FBRUEsWUFBQSxJQUFJLENBQUMsVUFBTCxDQUFnQixPQUFoQixFQUF5QixPQUF6QixFQUFrQyxHQUFsQztBQUNEO0FBQ0YsU0FmUyxFQWVQLEdBZk8sQ0FBVjtBQWlCRCxPQXBCRDtBQXNCQSxXQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUE4QixZQUE5QixFQUE0QyxVQUFVLENBQVYsRUFBYTtBQUN2RCxZQUFJLE9BQU8sR0FBRyxJQUFkO0FBQ0EsUUFBQSxPQUFPLENBQUMsU0FBUixDQUFrQixNQUFsQixDQUF5QixlQUF6Qjs7QUFDQSxZQUFHLENBQUMsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsUUFBbEIsQ0FBMkIsUUFBM0IsQ0FBSixFQUF5QztBQUN2QyxjQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBUixDQUFxQixrQkFBckIsQ0FBZDs7QUFDQSxjQUFHLE9BQU8sS0FBSyxJQUFaLElBQW9CLFFBQVEsQ0FBQyxjQUFULENBQXdCLE9BQXhCLE1BQXFDLElBQTVELEVBQWlFO0FBQy9ELFlBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxXQUFkLENBQTBCLFFBQVEsQ0FBQyxjQUFULENBQXdCLE9BQXhCLENBQTFCO0FBQ0Q7O0FBQ0QsVUFBQSxPQUFPLENBQUMsZUFBUixDQUF3QixrQkFBeEI7QUFDRDtBQUNGLE9BVkQ7QUFZQSxXQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUE4QixPQUE5QixFQUF1QyxVQUFTLEtBQVQsRUFBZTtBQUNwRCxZQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBTixJQUFlLEtBQUssQ0FBQyxPQUEvQjs7QUFDQSxZQUFJLEdBQUcsS0FBSyxFQUFaLEVBQWdCO0FBQ2QsY0FBSSxPQUFPLEdBQUcsS0FBSyxZQUFMLENBQWtCLGtCQUFsQixDQUFkOztBQUNBLGNBQUcsT0FBTyxLQUFLLElBQVosSUFBb0IsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsT0FBeEIsTUFBcUMsSUFBNUQsRUFBaUU7QUFDL0QsWUFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsT0FBeEIsQ0FBMUI7QUFDRDs7QUFDRCxlQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLFFBQXRCO0FBQ0EsZUFBSyxlQUFMLENBQXFCLGtCQUFyQjtBQUNEO0FBQ0YsT0FWRDtBQVlBLFdBQUssT0FBTCxDQUFhLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLFVBQVUsQ0FBVixFQUFhO0FBQ2xELFlBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFoQjtBQUVBLFlBQUksT0FBTyxDQUFDLFlBQVIsQ0FBcUIsa0JBQXJCLE1BQTZDLElBQWpELEVBQXVEO0FBQ3ZELFFBQUEsQ0FBQyxDQUFDLGNBQUY7QUFFQSxZQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsWUFBUixDQUFxQix1QkFBckIsS0FBaUQsS0FBM0Q7QUFFQSxZQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBTCxDQUFtQixPQUFuQixFQUE0QixHQUE1QixDQUFkO0FBRUEsUUFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsT0FBMUI7QUFFQSxRQUFBLElBQUksQ0FBQyxVQUFMLENBQWdCLE9BQWhCLEVBQXlCLE9BQXpCLEVBQWtDLEdBQWxDO0FBRUQsT0FkRDtBQWdCQSxXQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUE4QixNQUE5QixFQUFzQyxVQUFVLENBQVYsRUFBYTtBQUNqRCxZQUFJLE9BQU8sR0FBRyxLQUFLLFlBQUwsQ0FBa0Isa0JBQWxCLENBQWQ7O0FBQ0EsWUFBRyxPQUFPLEtBQUssSUFBWixJQUFvQixRQUFRLENBQUMsY0FBVCxDQUF3QixPQUF4QixNQUFxQyxJQUE1RCxFQUFpRTtBQUMvRCxVQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsV0FBZCxDQUEwQixRQUFRLENBQUMsY0FBVCxDQUF3QixPQUF4QixDQUExQjtBQUNEOztBQUNELGFBQUssZUFBTCxDQUFxQixrQkFBckI7QUFDQSxhQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLFFBQXRCO0FBQ0QsT0FQRDs7QUFTRixVQUFHLEtBQUssT0FBTCxDQUFhLFlBQWIsQ0FBMEIsc0JBQTFCLE1BQXNELE9BQXpELEVBQWlFO0FBQy9ELGFBQUssT0FBTCxDQUFhLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLFVBQVUsQ0FBVixFQUFhO0FBQ2xELGNBQUksT0FBTyxHQUFHLElBQWQ7O0FBQ0EsY0FBSSxPQUFPLENBQUMsWUFBUixDQUFxQixrQkFBckIsTUFBNkMsSUFBakQsRUFBdUQ7QUFDckQsZ0JBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxZQUFSLENBQXFCLHVCQUFyQixLQUFpRCxLQUEzRDtBQUNBLGdCQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBTCxDQUFtQixPQUFuQixFQUE0QixHQUE1QixDQUFkO0FBQ0EsWUFBQSxRQUFRLENBQUMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsT0FBMUI7QUFDQSxZQUFBLElBQUksQ0FBQyxVQUFMLENBQWdCLE9BQWhCLEVBQXlCLE9BQXpCLEVBQWtDLEdBQWxDO0FBQ0QsV0FMRCxNQUtPO0FBQ0wsZ0JBQUcsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsUUFBbEIsQ0FBMkIsUUFBM0IsQ0FBSCxFQUF3QztBQUN0QyxrQkFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsa0JBQXJCLENBQWI7QUFDQSxjQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsV0FBZCxDQUEwQixRQUFRLENBQUMsY0FBVCxDQUF3QixNQUF4QixDQUExQjtBQUNBLGNBQUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsTUFBbEIsQ0FBeUIsUUFBekI7QUFDQSxjQUFBLE9BQU8sQ0FBQyxlQUFSLENBQXdCLGtCQUF4QjtBQUNELGFBTEQsTUFLTTtBQUNKLGNBQUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsR0FBbEIsQ0FBc0IsUUFBdEI7QUFDRDtBQUNGO0FBQ0YsU0FqQkQ7QUFrQkQ7O0FBRUQsTUFBQSxRQUFRLENBQUMsb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsRUFBeUMsZ0JBQXpDLENBQTBELE9BQTFELEVBQW1FLFVBQVUsS0FBVixFQUFpQjtBQUNsRixZQUFJLENBQUMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxTQUFiLENBQXVCLFFBQXZCLENBQWdDLFlBQWhDLENBQUQsSUFBa0QsQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLFNBQWIsQ0FBdUIsUUFBdkIsQ0FBZ0MsU0FBaEMsQ0FBbkQsSUFBaUcsQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFhLFNBQWIsQ0FBdUIsUUFBdkIsQ0FBZ0MsaUJBQWhDLENBQXRHLEVBQTBKO0FBQ3hKLFVBQUEsSUFBSSxDQUFDLFFBQUw7QUFDRDtBQUNGLE9BSkQ7QUFNRDs7O1dBRUQsb0JBQVc7QUFDVCxVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsK0JBQTFCLENBQWY7O0FBQ0EsV0FBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUE1QixFQUFvQyxDQUFDLEVBQXJDLEVBQXlDO0FBQ3ZDLFlBQUksTUFBTSxHQUFHLFFBQVEsQ0FBRSxDQUFGLENBQVIsQ0FBYyxZQUFkLENBQTJCLGtCQUEzQixDQUFiO0FBQ0EsUUFBQSxRQUFRLENBQUUsQ0FBRixDQUFSLENBQWMsZUFBZCxDQUE4QixrQkFBOUI7QUFDQSxRQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsV0FBZCxDQUEwQixRQUFRLENBQUMsY0FBVCxDQUF3QixNQUF4QixDQUExQjtBQUNEO0FBQ0Y7OztXQUNELHVCQUFlLE9BQWYsRUFBd0IsR0FBeEIsRUFBNkI7QUFDM0IsVUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBZDtBQUNBLE1BQUEsT0FBTyxDQUFDLFNBQVIsR0FBb0IsZ0JBQXBCO0FBQ0EsVUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLHNCQUFULENBQWdDLGdCQUFoQyxDQUFkO0FBQ0EsVUFBSSxFQUFFLEdBQUcsYUFBVyxPQUFPLENBQUMsTUFBbkIsR0FBMEIsQ0FBbkM7QUFDQSxNQUFBLE9BQU8sQ0FBQyxZQUFSLENBQXFCLElBQXJCLEVBQTJCLEVBQTNCO0FBQ0EsTUFBQSxPQUFPLENBQUMsWUFBUixDQUFxQixNQUFyQixFQUE2QixTQUE3QjtBQUNBLE1BQUEsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsYUFBckIsRUFBb0MsR0FBcEM7QUFDQSxNQUFBLE9BQU8sQ0FBQyxZQUFSLENBQXFCLGtCQUFyQixFQUF5QyxFQUF6QztBQUVBLFVBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQW5CO0FBQ0EsTUFBQSxZQUFZLENBQUMsU0FBYixHQUF5QixTQUF6QjtBQUVBLFVBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBQW5CO0FBQ0EsTUFBQSxZQUFZLENBQUMsU0FBYixHQUF5QixlQUF6QjtBQUNBLE1BQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsWUFBekI7QUFFQSxVQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFyQjtBQUNBLE1BQUEsY0FBYyxDQUFDLFNBQWYsR0FBMkIsaUJBQTNCO0FBQ0EsTUFBQSxjQUFjLENBQUMsU0FBZixHQUEyQixPQUFPLENBQUMsWUFBUixDQUFxQixjQUFyQixDQUEzQjtBQUNBLE1BQUEsWUFBWSxDQUFDLFdBQWIsQ0FBeUIsY0FBekI7QUFDQSxNQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLFlBQXBCO0FBRUEsYUFBTyxPQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7V0FDRSxvQkFBWSxNQUFaLEVBQW9CLE9BQXBCLEVBQTZCLEdBQTdCLEVBQWtDO0FBQ2hDLFVBQUksT0FBTyxHQUFHLE1BQWQ7QUFDQSxVQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsc0JBQVIsQ0FBK0IsZUFBL0IsRUFBZ0QsQ0FBaEQsQ0FBWjtBQUNBLFVBQUksZUFBZSxHQUFHLE1BQU0sQ0FBQyxxQkFBUCxFQUF0QjtBQUVBLFVBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxxQkFBUCxFQUFuQjtBQUFBLFVBQW1ELElBQW5EO0FBQUEsVUFBeUQsR0FBekQ7QUFFQSxVQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsV0FBM0I7QUFFQSxVQUFJLElBQUksR0FBRyxFQUFYO0FBQ0EsVUFBSSxjQUFjLEdBQUcsTUFBckI7QUFDQSxNQUFBLElBQUksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQWQsQ0FBUixHQUErQixDQUFDLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLE9BQU8sQ0FBQyxXQUE5QixJQUE2QyxDQUFuRjs7QUFFQSxjQUFRLEdBQVI7QUFDRSxhQUFLLFFBQUw7QUFDRSxVQUFBLEdBQUcsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQWQsQ0FBUixHQUFnQyxJQUF0QztBQUNBLFVBQUEsY0FBYyxHQUFHLElBQWpCO0FBQ0E7O0FBRUY7QUFDQSxhQUFLLEtBQUw7QUFDRSxVQUFBLEdBQUcsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQWQsQ0FBUixHQUE2QixPQUFPLENBQUMsWUFBckMsR0FBb0QsSUFBMUQ7QUFSSixPQWJnQyxDQXdCaEM7OztBQUNBLFVBQUcsSUFBSSxHQUFHLENBQVYsRUFBYTtBQUNYLFFBQUEsSUFBSSxHQUFHLElBQVA7QUFDQSxZQUFJLGlCQUFpQixHQUFHLGVBQWUsQ0FBQyxJQUFoQixHQUF3QixPQUFPLENBQUMsV0FBUixHQUFzQixDQUF0RTtBQUNBLFlBQUkscUJBQXFCLEdBQUcsQ0FBNUI7QUFDQSxZQUFJLGlCQUFpQixHQUFHLGlCQUFpQixHQUFHLElBQXBCLEdBQTJCLHFCQUFuRDtBQUNBLFFBQUEsT0FBTyxDQUFDLHNCQUFSLENBQStCLGVBQS9CLEVBQWdELENBQWhELEVBQW1ELEtBQW5ELENBQXlELElBQXpELEdBQWdFLGlCQUFpQixHQUFDLElBQWxGO0FBQ0QsT0EvQitCLENBaUNoQzs7O0FBQ0EsVUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQWYsSUFBZ0MsTUFBTSxDQUFDLFdBQTFDLEVBQXNEO0FBQ3BELFFBQUEsR0FBRyxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBZCxDQUFSLEdBQTZCLE9BQU8sQ0FBQyxZQUFyQyxHQUFvRCxJQUExRDtBQUNBLFFBQUEsY0FBYyxHQUFHLElBQWpCO0FBQ0Q7O0FBRUQsVUFBRyxHQUFHLEdBQUcsQ0FBVCxFQUFZO0FBQ1YsUUFBQSxHQUFHLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFkLENBQVIsR0FBZ0MsSUFBdEM7QUFDQSxRQUFBLGNBQWMsR0FBRyxJQUFqQjtBQUNEOztBQUNELFVBQUcsTUFBTSxDQUFDLFVBQVAsR0FBcUIsSUFBSSxHQUFHLFlBQS9CLEVBQTZDO0FBQzNDLFFBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxLQUFkLEdBQXNCLElBQUksR0FBRyxJQUE3Qjs7QUFDQSxZQUFJLGtCQUFpQixHQUFHLGVBQWUsQ0FBQyxLQUFoQixHQUF5QixPQUFPLENBQUMsV0FBUixHQUFzQixDQUF2RTs7QUFDQSxZQUFJLHNCQUFxQixHQUFHLENBQTVCO0FBQ0EsWUFBSSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsVUFBUCxHQUFvQixrQkFBcEIsR0FBd0MsSUFBeEMsR0FBK0Msc0JBQXhFO0FBQ0EsUUFBQSxPQUFPLENBQUMsc0JBQVIsQ0FBK0IsZUFBL0IsRUFBZ0QsQ0FBaEQsRUFBbUQsS0FBbkQsQ0FBeUQsS0FBekQsR0FBaUUsa0JBQWtCLEdBQUMsSUFBcEY7QUFDQSxRQUFBLE9BQU8sQ0FBQyxzQkFBUixDQUErQixlQUEvQixFQUFnRCxDQUFoRCxFQUFtRCxLQUFuRCxDQUF5RCxJQUF6RCxHQUFnRSxNQUFoRTtBQUNELE9BUEQsTUFPTztBQUNMLFFBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxJQUFkLEdBQXFCLElBQUksR0FBRyxJQUE1QjtBQUNEOztBQUNELE1BQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxHQUFkLEdBQXFCLEdBQUcsR0FBRyxXQUFOLEdBQW9CLElBQXpDO0FBQ0EsTUFBQSxPQUFPLENBQUMsc0JBQVIsQ0FBK0IsZUFBL0IsRUFBZ0QsQ0FBaEQsRUFBbUQsU0FBbkQsQ0FBNkQsR0FBN0QsQ0FBaUUsY0FBakU7QUFDRDs7Ozs7O0FBR0gsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBakI7Ozs7O0FDcE5BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQ2YsRUFBQSxNQUFNLEVBQUU7QUFETyxDQUFqQjs7O0FDQUE7O0FBZUE7O0FBQ0E7O0FBQ0E7Ozs7QUFoQkEsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLHVCQUFELENBQXhCOztBQUNBLElBQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLG1DQUFELENBQWhDOztBQUNBLElBQU0scUJBQXFCLEdBQUcsT0FBTyxDQUFDLHNDQUFELENBQXJDOztBQUNBLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyx1QkFBRCxDQUF4Qjs7QUFDQSxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsd0JBQUQsQ0FBekI7O0FBQ0EsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLG9CQUFELENBQXJCOztBQUNBLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxvQkFBRCxDQUEvQjs7QUFDQSxJQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQywrQkFBRCxDQUFuQzs7QUFDQSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQUQsQ0FBdEIsQyxDQUNBOzs7QUFDQSxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsc0JBQUQsQ0FBdkI7O0FBQ0EsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHNCQUFELENBQTNCOztBQUNBLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyx5QkFBRCxDQUExQjs7QUFDQSxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsK0JBQUQsQ0FBOUI7O0FBSUEsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLDBCQUFELENBQTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLE9BQU8sQ0FBQyxhQUFELENBQVA7O0FBRUEsSUFBSSxJQUFJLEdBQUcsU0FBUCxJQUFPLENBQVUsT0FBVixFQUFtQjtBQUM1QjtBQUNBLEVBQUEsT0FBTyxHQUFHLE9BQU8sT0FBUCxLQUFtQixXQUFuQixHQUFpQyxPQUFqQyxHQUEyQyxFQUFyRCxDQUY0QixDQUk1QjtBQUNBOztBQUNBLE1BQUksS0FBSyxHQUFHLE9BQU8sT0FBTyxDQUFDLEtBQWYsS0FBeUIsV0FBekIsR0FBdUMsT0FBTyxDQUFDLEtBQS9DLEdBQXVELFFBQW5FO0FBRUEsRUFBQSxVQUFVLENBQUMsRUFBWCxDQUFjLEtBQWQ7QUFFQSxNQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIseUJBQXZCLENBQXhCOztBQUNBLE9BQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxlQUFlLENBQUMsTUFBbkMsRUFBMkMsQ0FBQyxFQUE1QyxFQUErQztBQUM3QyxRQUFJLGNBQUosQ0FBbUIsZUFBZSxDQUFFLENBQUYsQ0FBbEM7QUFDRDs7QUFDRCxNQUFNLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxnQkFBTixDQUF1QixxQkFBdkIsQ0FBM0I7O0FBQ0EsT0FBSSxJQUFJLEVBQUMsR0FBRyxDQUFaLEVBQWUsRUFBQyxHQUFHLGtCQUFrQixDQUFDLE1BQXRDLEVBQThDLEVBQUMsRUFBL0MsRUFBa0Q7QUFDaEQsUUFBSSxXQUFKLENBQWdCLGtCQUFrQixDQUFFLEVBQUYsQ0FBbEM7QUFDRDs7QUFDRCxNQUFNLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxzQkFBTixDQUE2QixZQUE3QixDQUExQjs7QUFDQSxPQUFJLElBQUksR0FBQyxHQUFHLENBQVosRUFBZSxHQUFDLEdBQUcsaUJBQWlCLENBQUMsTUFBckMsRUFBNkMsR0FBQyxFQUE5QyxFQUFpRDtBQUMvQyxRQUFJLE9BQUosQ0FBWSxpQkFBaUIsQ0FBRSxHQUFGLENBQTdCO0FBQ0Q7O0FBQ0QsTUFBTSxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsc0JBQU4sQ0FBNkIsUUFBN0IsQ0FBekI7O0FBQ0EsT0FBSSxJQUFJLEdBQUMsR0FBRyxDQUFaLEVBQWUsR0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQXBDLEVBQTRDLEdBQUMsRUFBN0MsRUFBZ0Q7QUFDOUMsUUFBSSxNQUFKLENBQVcsZ0JBQWdCLENBQUUsR0FBRixDQUEzQjtBQUNEOztBQUVELE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxDQUFDLHNCQUFOLENBQTZCLFdBQTdCLENBQTVCOztBQUNBLE9BQUksSUFBSSxHQUFDLEdBQUcsQ0FBWixFQUFlLEdBQUMsR0FBRyxtQkFBbUIsQ0FBQyxNQUF2QyxFQUErQyxHQUFDLEVBQWhELEVBQW1EO0FBQ2pELFFBQUksU0FBSixDQUFjLG1CQUFtQixDQUFFLEdBQUYsQ0FBakM7QUFDRDs7QUFDRCxNQUFNLDJCQUEyQixHQUFHLEtBQUssQ0FBQyxnQkFBTixDQUF1QixxQ0FBdkIsQ0FBcEM7O0FBQ0EsT0FBSSxJQUFJLEdBQUMsR0FBRyxDQUFaLEVBQWUsR0FBQyxHQUFHLDJCQUEyQixDQUFDLE1BQS9DLEVBQXVELEdBQUMsRUFBeEQsRUFBMkQ7QUFDekQsUUFBSSxTQUFKLENBQWMsMkJBQTJCLENBQUUsR0FBRixDQUF6QztBQUNEOztBQUVELE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLGdCQUFOLENBQXVCLHlCQUF2QixDQUExQjs7QUFDQSxPQUFJLElBQUksR0FBQyxHQUFHLENBQVosRUFBZSxHQUFDLEdBQUcsaUJBQWlCLENBQUMsTUFBckMsRUFBNkMsR0FBQyxFQUE5QyxFQUFpRDtBQUMvQyxRQUFJLG1CQUFKLENBQXdCLGlCQUFpQixDQUFFLEdBQUYsQ0FBekMsRUFBZ0QsSUFBaEQ7QUFDRDs7QUFFRCxNQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsdUJBQXZCLENBQXhCOztBQUNBLE9BQUksSUFBSSxHQUFDLEdBQUcsQ0FBWixFQUFlLEdBQUMsR0FBRyxlQUFlLENBQUMsTUFBbkMsRUFBMkMsR0FBQyxFQUE1QyxFQUErQztBQUM3QyxRQUFJLGVBQUosQ0FBb0IsZUFBZSxDQUFFLEdBQUYsQ0FBbkM7QUFDRDs7QUFFRCxNQUFNLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxzQkFBTixDQUE2QixhQUE3QixDQUEzQjs7QUFDQSxPQUFJLElBQUksR0FBQyxHQUFHLENBQVosRUFBZSxHQUFDLEdBQUcsa0JBQWtCLENBQUMsTUFBdEMsRUFBOEMsR0FBQyxFQUEvQyxFQUFrRDtBQUNoRCxRQUFJLFFBQUosQ0FBYSxrQkFBa0IsQ0FBRSxHQUFGLENBQS9CO0FBQ0Q7O0FBRUQsTUFBTSx1QkFBdUIsR0FBRyxLQUFLLENBQUMsc0JBQU4sQ0FBNkIsdUJBQTdCLENBQWhDOztBQUNBLE9BQUksSUFBSSxHQUFDLEdBQUcsQ0FBWixFQUFlLEdBQUMsR0FBRyx1QkFBdUIsQ0FBQyxNQUEzQyxFQUFtRCxHQUFDLEVBQXBELEVBQXVEO0FBQ3JELFFBQUksZ0JBQUosQ0FBcUIsdUJBQXVCLENBQUUsR0FBRixDQUE1QztBQUNEOztBQUVELE1BQU0sMEJBQTBCLEdBQUcsS0FBSyxDQUFDLHNCQUFOLENBQTZCLDRCQUE3QixDQUFuQzs7QUFDQSxPQUFJLElBQUksSUFBQyxHQUFHLENBQVosRUFBZSxJQUFDLEdBQUcsMEJBQTBCLENBQUMsTUFBOUMsRUFBc0QsSUFBQyxFQUF2RCxFQUEwRDtBQUN4RCxRQUFJLHFCQUFKLENBQTBCLDBCQUEwQixDQUFFLElBQUYsQ0FBcEQ7QUFDRDs7QUFFRCxNQUFNLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxzQkFBTixDQUE2QixxQkFBN0IsQ0FBL0I7O0FBQ0EsT0FBSSxJQUFJLElBQUMsR0FBRyxDQUFaLEVBQWUsSUFBQyxHQUFHLHNCQUFzQixDQUFDLE1BQTFDLEVBQWtELElBQUMsRUFBbkQsRUFBc0Q7QUFDcEQsUUFBSSx3QkFBSixDQUFpQixzQkFBc0IsQ0FBRSxJQUFGLENBQXZDLEVBQThDLElBQTlDO0FBQ0Q7O0FBRUQsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsc0JBQU4sQ0FBNkIsYUFBN0IsQ0FBM0I7O0FBQ0EsT0FBSSxJQUFJLElBQUMsR0FBRyxDQUFaLEVBQWUsSUFBQyxHQUFHLGtCQUFrQixDQUFDLE1BQXRDLEVBQThDLElBQUMsRUFBL0MsRUFBa0Q7QUFDaEQsUUFBSSxRQUFKLENBQWEsa0JBQWtCLENBQUUsSUFBRixDQUEvQjtBQUNEOztBQUVELE1BQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxnQkFBTixDQUF1QixZQUF2QixDQUFiOztBQUNBLE9BQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBMUIsRUFBa0MsQ0FBQyxFQUFuQyxFQUF1QztBQUNyQyxRQUFJLGlCQUFKLENBQVUsTUFBTSxDQUFDLENBQUQsQ0FBaEIsRUFBcUIsSUFBckI7QUFDRCxHQTFFMkIsQ0E0RTVCOzs7QUFDQSxNQUFJLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBTixDQUFvQiwrQkFBcEIsQ0FBcEI7QUFDQSxNQUFJLHdCQUFKLENBQWlCLGFBQWpCLEVBQWdDLElBQWhDO0FBRUEsTUFBSSxVQUFKO0FBRUQsQ0FsRkQ7O0FBb0ZBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUUsRUFBQSxJQUFJLEVBQUosSUFBRjtBQUFRLEVBQUEsUUFBUSxFQUFSLFFBQVI7QUFBa0IsRUFBQSxnQkFBZ0IsRUFBaEIsZ0JBQWxCO0FBQW9DLEVBQUEscUJBQXFCLEVBQXJCLHFCQUFwQztBQUEyRCxFQUFBLFFBQVEsRUFBUixRQUEzRDtBQUFxRSxFQUFBLFlBQVksRUFBWix3QkFBckU7QUFBbUYsRUFBQSxlQUFlLEVBQWYsZUFBbkY7QUFBb0csRUFBQSxTQUFTLEVBQVQsU0FBcEc7QUFBK0csRUFBQSxNQUFNLEVBQU4sTUFBL0c7QUFBdUgsRUFBQSxPQUFPLEVBQVAsT0FBdkg7QUFBZ0ksRUFBQSxXQUFXLEVBQVgsV0FBaEk7QUFBNkksRUFBQSxVQUFVLEVBQVYsVUFBN0k7QUFBeUosRUFBQSxjQUFjLEVBQWQsY0FBeko7QUFBeUssRUFBQSxLQUFLLEVBQUwsaUJBQXpLO0FBQWdMLEVBQUEsVUFBVSxFQUFWLFVBQWhMO0FBQTRMLEVBQUEsS0FBSyxFQUFMLEtBQTVMO0FBQW1NLEVBQUEsbUJBQW1CLEVBQW5CLG1CQUFuTTtBQUF3TixFQUFBLFlBQVksRUFBWjtBQUF4TixDQUFqQjs7Ozs7QUM3R0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFBLEtBQUssRUFBRTtBQWJRLENBQWpCOzs7OztBQ0FBOztBQUNBO0FBQ0EsQ0FBQyxZQUFZO0FBQ1gsTUFBSSxPQUFPLE1BQU0sQ0FBQyxXQUFkLEtBQThCLFVBQWxDLEVBQThDLE9BQU8sS0FBUDs7QUFFOUMsV0FBUyxXQUFULENBQXFCLEtBQXJCLEVBQTRCLE9BQTVCLEVBQXFDO0FBQ25DLFFBQU0sTUFBTSxHQUFHLE9BQU8sSUFBSTtBQUN4QixNQUFBLE9BQU8sRUFBRSxLQURlO0FBRXhCLE1BQUEsVUFBVSxFQUFFLEtBRlk7QUFHeEIsTUFBQSxNQUFNLEVBQUU7QUFIZ0IsS0FBMUI7QUFLQSxRQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsV0FBVCxDQUFxQixhQUFyQixDQUFaO0FBQ0EsSUFBQSxHQUFHLENBQUMsZUFBSixDQUNFLEtBREYsRUFFRSxNQUFNLENBQUMsT0FGVCxFQUdFLE1BQU0sQ0FBQyxVQUhULEVBSUUsTUFBTSxDQUFDLE1BSlQ7QUFNQSxXQUFPLEdBQVA7QUFDRDs7QUFFRCxFQUFBLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLFdBQXJCO0FBQ0QsQ0FwQkQ7OztBQ0ZBOztBQUNBLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxXQUFQLENBQW1CLFNBQW5DO0FBQ0EsSUFBTSxNQUFNLEdBQUcsUUFBZjs7QUFFQSxJQUFJLEVBQUUsTUFBTSxJQUFJLE9BQVosQ0FBSixFQUEwQjtBQUN4QixFQUFBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLE1BQS9CLEVBQXVDO0FBQ3JDLElBQUEsR0FBRyxFQUFFLGVBQVk7QUFDZixhQUFPLEtBQUssWUFBTCxDQUFrQixNQUFsQixDQUFQO0FBQ0QsS0FIb0M7QUFJckMsSUFBQSxHQUFHLEVBQUUsYUFBVSxLQUFWLEVBQWlCO0FBQ3BCLFVBQUksS0FBSixFQUFXO0FBQ1QsYUFBSyxZQUFMLENBQWtCLE1BQWxCLEVBQTBCLEVBQTFCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBSyxlQUFMLENBQXFCLE1BQXJCO0FBQ0Q7QUFDRjtBQVZvQyxHQUF2QztBQVlEOzs7QUNqQkQsYSxDQUNBOztBQUNBLE9BQU8sQ0FBQyxvQkFBRCxDQUFQLEMsQ0FDQTs7O0FBQ0EsT0FBTyxDQUFDLGtCQUFELENBQVAsQyxDQUVBOzs7QUFDQSxPQUFPLENBQUMsaUJBQUQsQ0FBUCxDLENBRUE7OztBQUNBLE9BQU8sQ0FBQyxnQkFBRCxDQUFQOztBQUVBLE9BQU8sQ0FBQywwQkFBRCxDQUFQOztBQUNBLE9BQU8sQ0FBQyx1QkFBRCxDQUFQOzs7OztBQ2JBLE1BQU0sQ0FBQyxLQUFQLEdBQ0UsTUFBTSxDQUFDLEtBQVAsSUFDQSxTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCO0FBQ3BCO0FBQ0EsU0FBTyxPQUFPLEtBQVAsS0FBaUIsUUFBakIsSUFBNkIsS0FBSyxLQUFLLEtBQTlDO0FBQ0QsQ0FMSDs7Ozs7QUNBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLE1BQUMsWUFBRCx1RUFBZ0IsUUFBaEI7QUFBQSxTQUE2QixZQUFZLENBQUMsYUFBMUM7QUFBQSxDQUFqQjs7Ozs7QUNBQSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBRCxDQUF0Qjs7QUFDQSxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBRCxDQUF4QjtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVc7QUFBQSxvQ0FBSSxHQUFKO0FBQUksSUFBQSxHQUFKO0FBQUE7O0FBQUEsU0FDZixTQUFTLFNBQVQsR0FBMkM7QUFBQTs7QUFBQSxRQUF4QixNQUF3Qix1RUFBZixRQUFRLENBQUMsSUFBTTtBQUN6QyxJQUFBLEdBQUcsQ0FBQyxPQUFKLENBQVksVUFBQyxNQUFELEVBQVk7QUFDdEIsVUFBSSxPQUFPLEtBQUksQ0FBQyxNQUFELENBQVgsS0FBd0IsVUFBNUIsRUFBd0M7QUFDdEMsUUFBQSxLQUFJLENBQUMsTUFBRCxDQUFKLENBQWEsSUFBYixDQUFrQixLQUFsQixFQUF3QixNQUF4QjtBQUNEO0FBQ0YsS0FKRDtBQUtELEdBUGM7QUFBQSxDQUFqQjtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBQyxNQUFELEVBQVMsS0FBVDtBQUFBLFNBQ2YsUUFBUSxDQUFDLFFBQVQsQ0FDRSxNQURGLEVBRUUsTUFBTSxDQUNKO0FBQ0UsSUFBQSxFQUFFLEVBQUUsUUFBUSxDQUFDLE1BQUQsRUFBUyxLQUFULENBRGQ7QUFFRSxJQUFBLEdBQUcsRUFBRSxRQUFRLENBQUMsVUFBRCxFQUFhLFFBQWI7QUFGZixHQURJLEVBS0osS0FMSSxDQUZSLENBRGU7QUFBQSxDQUFqQjs7O0FDekJBOztBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2hCLFFBQU0sQ0FEVTtBQUVoQixRQUFNLEdBRlU7QUFHaEIsUUFBTSxHQUhVO0FBSWhCLFFBQU0sR0FKVTtBQUtoQixRQUFNO0FBTFUsQ0FBbEI7QUFRQSxNQUFNLENBQUMsT0FBUCxHQUFpQixXQUFqQjs7Ozs7QUNUQTtBQUNBLFNBQVMsbUJBQVQsQ0FBOEIsRUFBOUIsRUFDOEQ7QUFBQSxNQUQ1QixHQUM0Qix1RUFEeEIsTUFDd0I7QUFBQSxNQUFoQyxLQUFnQyx1RUFBMUIsUUFBUSxDQUFDLGVBQWlCO0FBQzVELE1BQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxxQkFBSCxFQUFYO0FBRUEsU0FDRSxJQUFJLENBQUMsR0FBTCxJQUFZLENBQVosSUFDQSxJQUFJLENBQUMsSUFBTCxJQUFhLENBRGIsSUFFQSxJQUFJLENBQUMsTUFBTCxLQUFnQixHQUFHLENBQUMsV0FBSixJQUFtQixLQUFLLENBQUMsWUFBekMsQ0FGQSxJQUdBLElBQUksQ0FBQyxLQUFMLEtBQWUsR0FBRyxDQUFDLFVBQUosSUFBa0IsS0FBSyxDQUFDLFdBQXZDLENBSkY7QUFNRDs7QUFFRCxNQUFNLENBQUMsT0FBUCxHQUFpQixtQkFBakI7Ozs7O0FDYkE7QUFDQSxTQUFTLFdBQVQsR0FBdUI7QUFDckIsU0FDRSxPQUFPLFNBQVAsS0FBcUIsV0FBckIsS0FDQyxTQUFTLENBQUMsU0FBVixDQUFvQixLQUFwQixDQUEwQixxQkFBMUIsS0FDRSxTQUFTLENBQUMsUUFBVixLQUF1QixVQUF2QixJQUFxQyxTQUFTLENBQUMsY0FBVixHQUEyQixDQUZuRSxLQUdBLENBQUMsTUFBTSxDQUFDLFFBSlY7QUFNRDs7QUFFRCxNQUFNLENBQUMsT0FBUCxHQUFpQixXQUFqQjs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBWSxDQUFDLEtBQUQ7QUFBQSxTQUNoQixLQUFLLElBQUksUUFBTyxLQUFQLE1BQWlCLFFBQTFCLElBQXNDLEtBQUssQ0FBQyxRQUFOLEtBQW1CLENBRHpDO0FBQUEsQ0FBbEI7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFDLFFBQUQsRUFBVyxPQUFYLEVBQXVCO0FBQ3RDLE1BQUksT0FBTyxRQUFQLEtBQW9CLFFBQXhCLEVBQWtDO0FBQ2hDLFdBQU8sRUFBUDtBQUNEOztBQUVELE1BQUksQ0FBQyxPQUFELElBQVksQ0FBQyxTQUFTLENBQUMsT0FBRCxDQUExQixFQUFxQztBQUNuQyxJQUFBLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBakIsQ0FEbUMsQ0FDUjtBQUM1Qjs7QUFFRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsUUFBekIsQ0FBbEI7QUFDQSxTQUFPLEtBQUssQ0FBQyxTQUFOLENBQWdCLEtBQWhCLENBQXNCLElBQXRCLENBQTJCLFNBQTNCLENBQVA7QUFDRCxDQVhEOzs7QUNqQkE7O0FBQ0EsSUFBTSxRQUFRLEdBQUcsZUFBakI7QUFDQSxJQUFNLFFBQVEsR0FBRyxlQUFqQjtBQUNBLElBQU0sTUFBTSxHQUFHLGFBQWY7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBQyxNQUFELEVBQVMsUUFBVCxFQUFzQjtBQUVyQyxNQUFJLE9BQU8sUUFBUCxLQUFvQixTQUF4QixFQUFtQztBQUNqQyxJQUFBLFFBQVEsR0FBRyxNQUFNLENBQUMsWUFBUCxDQUFvQixRQUFwQixNQUFrQyxPQUE3QztBQUNEOztBQUNELEVBQUEsTUFBTSxDQUFDLFlBQVAsQ0FBb0IsUUFBcEIsRUFBOEIsUUFBOUI7QUFDQSxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsWUFBUCxDQUFvQixRQUFwQixDQUFYO0FBQ0EsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsRUFBeEIsQ0FBakI7O0FBQ0EsTUFBSSxDQUFDLFFBQUwsRUFBZTtBQUNiLFVBQU0sSUFBSSxLQUFKLENBQ0osc0NBQXNDLEVBQXRDLEdBQTJDLEdBRHZDLENBQU47QUFHRDs7QUFFRCxFQUFBLFFBQVEsQ0FBQyxZQUFULENBQXNCLE1BQXRCLEVBQThCLENBQUMsUUFBL0I7QUFDQSxTQUFPLFFBQVA7QUFDRCxDQWhCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogYXJyYXktZm9yZWFjaFxuICogICBBcnJheSNmb3JFYWNoIHBvbnlmaWxsIGZvciBvbGRlciBicm93c2Vyc1xuICogICAoUG9ueWZpbGw6IEEgcG9seWZpbGwgdGhhdCBkb2Vzbid0IG92ZXJ3cml0ZSB0aGUgbmF0aXZlIG1ldGhvZClcbiAqIFxuICogaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2hcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtMjAxNiBUYWt1dG8gV2FkYVxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogICBodHRwczovL2dpdGh1Yi5jb20vdHdhZGEvYXJyYXktZm9yZWFjaC9ibG9iL21hc3Rlci9NSVQtTElDRU5TRVxuICovXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZm9yRWFjaCAoYXJ5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGlmIChhcnkuZm9yRWFjaCkge1xuICAgICAgICBhcnkuZm9yRWFjaChjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnkubGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgYXJ5W2ldLCBpLCBhcnkpO1xuICAgIH1cbn07XG4iLCIvKlxuICogY2xhc3NMaXN0LmpzOiBDcm9zcy1icm93c2VyIGZ1bGwgZWxlbWVudC5jbGFzc0xpc3QgaW1wbGVtZW50YXRpb24uXG4gKiAxLjEuMjAxNzA0MjdcbiAqXG4gKiBCeSBFbGkgR3JleSwgaHR0cDovL2VsaWdyZXkuY29tXG4gKiBMaWNlbnNlOiBEZWRpY2F0ZWQgdG8gdGhlIHB1YmxpYyBkb21haW4uXG4gKiAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuICovXG5cbi8qZ2xvYmFsIHNlbGYsIGRvY3VtZW50LCBET01FeGNlcHRpb24gKi9cblxuLyohIEBzb3VyY2UgaHR0cDovL3B1cmwuZWxpZ3JleS5jb20vZ2l0aHViL2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9jbGFzc0xpc3QuanMgKi9cblxuaWYgKFwiZG9jdW1lbnRcIiBpbiB3aW5kb3cuc2VsZikge1xuXG4vLyBGdWxsIHBvbHlmaWxsIGZvciBicm93c2VycyB3aXRoIG5vIGNsYXNzTGlzdCBzdXBwb3J0XG4vLyBJbmNsdWRpbmcgSUUgPCBFZGdlIG1pc3NpbmcgU1ZHRWxlbWVudC5jbGFzc0xpc3RcbmlmICghKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIikpIFxuXHR8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgJiYgIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpKSkge1xuXG4oZnVuY3Rpb24gKHZpZXcpIHtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmlmICghKCdFbGVtZW50JyBpbiB2aWV3KSkgcmV0dXJuO1xuXG52YXJcblx0ICBjbGFzc0xpc3RQcm9wID0gXCJjbGFzc0xpc3RcIlxuXHQsIHByb3RvUHJvcCA9IFwicHJvdG90eXBlXCJcblx0LCBlbGVtQ3RyUHJvdG8gPSB2aWV3LkVsZW1lbnRbcHJvdG9Qcm9wXVxuXHQsIG9iakN0ciA9IE9iamVjdFxuXHQsIHN0clRyaW0gPSBTdHJpbmdbcHJvdG9Qcm9wXS50cmltIHx8IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKTtcblx0fVxuXHQsIGFyckluZGV4T2YgPSBBcnJheVtwcm90b1Byb3BdLmluZGV4T2YgfHwgZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgaSA9IDBcblx0XHRcdCwgbGVuID0gdGhpcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gLTE7XG5cdH1cblx0Ly8gVmVuZG9yczogcGxlYXNlIGFsbG93IGNvbnRlbnQgY29kZSB0byBpbnN0YW50aWF0ZSBET01FeGNlcHRpb25zXG5cdCwgRE9NRXggPSBmdW5jdGlvbiAodHlwZSwgbWVzc2FnZSkge1xuXHRcdHRoaXMubmFtZSA9IHR5cGU7XG5cdFx0dGhpcy5jb2RlID0gRE9NRXhjZXB0aW9uW3R5cGVdO1xuXHRcdHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG5cdH1cblx0LCBjaGVja1Rva2VuQW5kR2V0SW5kZXggPSBmdW5jdGlvbiAoY2xhc3NMaXN0LCB0b2tlbikge1xuXHRcdGlmICh0b2tlbiA9PT0gXCJcIikge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiU1lOVEFYX0VSUlwiXG5cdFx0XHRcdCwgXCJBbiBpbnZhbGlkIG9yIGlsbGVnYWwgc3RyaW5nIHdhcyBzcGVjaWZpZWRcIlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0aWYgKC9cXHMvLnRlc3QodG9rZW4pKSB7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdCAgXCJJTlZBTElEX0NIQVJBQ1RFUl9FUlJcIlxuXHRcdFx0XHQsIFwiU3RyaW5nIGNvbnRhaW5zIGFuIGludmFsaWQgY2hhcmFjdGVyXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiBhcnJJbmRleE9mLmNhbGwoY2xhc3NMaXN0LCB0b2tlbik7XG5cdH1cblx0LCBDbGFzc0xpc3QgPSBmdW5jdGlvbiAoZWxlbSkge1xuXHRcdHZhclxuXHRcdFx0ICB0cmltbWVkQ2xhc3NlcyA9IHN0clRyaW0uY2FsbChlbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpXG5cdFx0XHQsIGNsYXNzZXMgPSB0cmltbWVkQ2xhc3NlcyA/IHRyaW1tZWRDbGFzc2VzLnNwbGl0KC9cXHMrLykgOiBbXVxuXHRcdFx0LCBpID0gMFxuXHRcdFx0LCBsZW4gPSBjbGFzc2VzLmxlbmd0aFxuXHRcdDtcblx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHR0aGlzLnB1c2goY2xhc3Nlc1tpXSk7XG5cdFx0fVxuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGVsZW0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy50b1N0cmluZygpKTtcblx0XHR9O1xuXHR9XG5cdCwgY2xhc3NMaXN0UHJvdG8gPSBDbGFzc0xpc3RbcHJvdG9Qcm9wXSA9IFtdXG5cdCwgY2xhc3NMaXN0R2V0dGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBuZXcgQ2xhc3NMaXN0KHRoaXMpO1xuXHR9XG47XG4vLyBNb3N0IERPTUV4Y2VwdGlvbiBpbXBsZW1lbnRhdGlvbnMgZG9uJ3QgYWxsb3cgY2FsbGluZyBET01FeGNlcHRpb24ncyB0b1N0cmluZygpXG4vLyBvbiBub24tRE9NRXhjZXB0aW9ucy4gRXJyb3IncyB0b1N0cmluZygpIGlzIHN1ZmZpY2llbnQgaGVyZS5cbkRPTUV4W3Byb3RvUHJvcF0gPSBFcnJvcltwcm90b1Byb3BdO1xuY2xhc3NMaXN0UHJvdG8uaXRlbSA9IGZ1bmN0aW9uIChpKSB7XG5cdHJldHVybiB0aGlzW2ldIHx8IG51bGw7XG59O1xuY2xhc3NMaXN0UHJvdG8uY29udGFpbnMgPSBmdW5jdGlvbiAodG9rZW4pIHtcblx0dG9rZW4gKz0gXCJcIjtcblx0cmV0dXJuIGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgIT09IC0xO1xufTtcbmNsYXNzTGlzdFByb3RvLmFkZCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHQ7XG5cdGRvIHtcblx0XHR0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG5cdFx0aWYgKGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgPT09IC0xKSB7XG5cdFx0XHR0aGlzLnB1c2godG9rZW4pO1xuXHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0fVxuXHR9XG5cdHdoaWxlICgrK2kgPCBsKTtcblxuXHRpZiAodXBkYXRlZCkge1xuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHR2YXJcblx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdCwgaSA9IDBcblx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0LCB0b2tlblxuXHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdFx0LCBpbmRleFxuXHQ7XG5cdGRvIHtcblx0XHR0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG5cdFx0aW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xuXHRcdHdoaWxlIChpbmRleCAhPT0gLTEpIHtcblx0XHRcdHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdFx0aW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnRvZ2dsZSA9IGZ1bmN0aW9uICh0b2tlbiwgZm9yY2UpIHtcblx0dG9rZW4gKz0gXCJcIjtcblxuXHR2YXJcblx0XHQgIHJlc3VsdCA9IHRoaXMuY29udGFpbnModG9rZW4pXG5cdFx0LCBtZXRob2QgPSByZXN1bHQgP1xuXHRcdFx0Zm9yY2UgIT09IHRydWUgJiYgXCJyZW1vdmVcIlxuXHRcdDpcblx0XHRcdGZvcmNlICE9PSBmYWxzZSAmJiBcImFkZFwiXG5cdDtcblxuXHRpZiAobWV0aG9kKSB7XG5cdFx0dGhpc1ttZXRob2RdKHRva2VuKTtcblx0fVxuXG5cdGlmIChmb3JjZSA9PT0gdHJ1ZSB8fCBmb3JjZSA9PT0gZmFsc2UpIHtcblx0XHRyZXR1cm4gZm9yY2U7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuICFyZXN1bHQ7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMuam9pbihcIiBcIik7XG59O1xuXG5pZiAob2JqQ3RyLmRlZmluZVByb3BlcnR5KSB7XG5cdHZhciBjbGFzc0xpc3RQcm9wRGVzYyA9IHtcblx0XHQgIGdldDogY2xhc3NMaXN0R2V0dGVyXG5cdFx0LCBlbnVtZXJhYmxlOiB0cnVlXG5cdFx0LCBjb25maWd1cmFibGU6IHRydWVcblx0fTtcblx0dHJ5IHtcblx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdH0gY2F0Y2ggKGV4KSB7IC8vIElFIDggZG9lc24ndCBzdXBwb3J0IGVudW1lcmFibGU6dHJ1ZVxuXHRcdC8vIGFkZGluZyB1bmRlZmluZWQgdG8gZmlnaHQgdGhpcyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvaXNzdWVzLzM2XG5cdFx0Ly8gbW9kZXJuaWUgSUU4LU1TVzcgbWFjaGluZSBoYXMgSUU4IDguMC42MDAxLjE4NzAyIGFuZCBpcyBhZmZlY3RlZFxuXHRcdGlmIChleC5udW1iZXIgPT09IHVuZGVmaW5lZCB8fCBleC5udW1iZXIgPT09IC0weDdGRjVFQzU0KSB7XG5cdFx0XHRjbGFzc0xpc3RQcm9wRGVzYy5lbnVtZXJhYmxlID0gZmFsc2U7XG5cdFx0XHRvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG5cdFx0fVxuXHR9XG59IGVsc2UgaWYgKG9iakN0cltwcm90b1Byb3BdLl9fZGVmaW5lR2V0dGVyX18pIHtcblx0ZWxlbUN0clByb3RvLl9fZGVmaW5lR2V0dGVyX18oY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0R2V0dGVyKTtcbn1cblxufSh3aW5kb3cuc2VsZikpO1xuXG59XG5cbi8vIFRoZXJlIGlzIGZ1bGwgb3IgcGFydGlhbCBuYXRpdmUgY2xhc3NMaXN0IHN1cHBvcnQsIHNvIGp1c3QgY2hlY2sgaWYgd2UgbmVlZFxuLy8gdG8gbm9ybWFsaXplIHRoZSBhZGQvcmVtb3ZlIGFuZCB0b2dnbGUgQVBJcy5cblxuKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIl9cIik7XG5cblx0dGVzdEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImMxXCIsIFwiYzJcIik7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwLzExIGFuZCBGaXJlZm94IDwyNiwgd2hlcmUgY2xhc3NMaXN0LmFkZCBhbmRcblx0Ly8gY2xhc3NMaXN0LnJlbW92ZSBleGlzdCBidXQgc3VwcG9ydCBvbmx5IG9uZSBhcmd1bWVudCBhdCBhIHRpbWUuXG5cdGlmICghdGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzJcIikpIHtcblx0XHR2YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24obWV0aG9kKSB7XG5cdFx0XHR2YXIgb3JpZ2luYWwgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF07XG5cblx0XHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHRva2VuKSB7XG5cdFx0XHRcdHZhciBpLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRcdHRva2VuID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0XHRcdG9yaWdpbmFsLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0Y3JlYXRlTWV0aG9kKCdhZGQnKTtcblx0XHRjcmVhdGVNZXRob2QoJ3JlbW92ZScpO1xuXHR9XG5cblx0dGVzdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcImMzXCIsIGZhbHNlKTtcblxuXHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAgYW5kIEZpcmVmb3ggPDI0LCB3aGVyZSBjbGFzc0xpc3QudG9nZ2xlIGRvZXMgbm90XG5cdC8vIHN1cHBvcnQgdGhlIHNlY29uZCBhcmd1bWVudC5cblx0aWYgKHRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMzXCIpKSB7XG5cdFx0dmFyIF90b2dnbGUgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZTtcblxuXHRcdERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24odG9rZW4sIGZvcmNlKSB7XG5cdFx0XHRpZiAoMSBpbiBhcmd1bWVudHMgJiYgIXRoaXMuY29udGFpbnModG9rZW4pID09PSAhZm9yY2UpIHtcblx0XHRcdFx0cmV0dXJuIGZvcmNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIF90b2dnbGUuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHR9XG5cblx0dGVzdEVsZW1lbnQgPSBudWxsO1xufSgpKTtcblxufVxuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5hcnJheS5mcm9tJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5BcnJheS5mcm9tO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmFzc2lnbjtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICh0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuIiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcbi8vIEVTMyB3cm9uZyBoZXJlXG52YXIgQVJHID0gY29mKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59O1xuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHsgdmVyc2lvbjogJzIuNi4xMicgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBpbmRleCwgdmFsdWUpIHtcbiAgaWYgKGluZGV4IGluIG9iamVjdCkgJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV07XG4gIHZhciBleHBvcnRzID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XG4gIHZhciBleHBQcm90byA9IGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pO1xuICB2YXIga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZiAoSVNfR0xPQkFMKSBzb3VyY2UgPSBuYW1lO1xuICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGV4cCA9IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICBpZiAodGFyZ2V0KSByZWRlZmluZSh0YXJnZXQsIGtleSwgb3V0LCB0eXBlICYgJGV4cG9ydC5VKTtcbiAgICAvLyBleHBvcnRcbiAgICBpZiAoZXhwb3J0c1trZXldICE9IG91dCkgaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYgKElTX1BST1RPICYmIGV4cFByb3RvW2tleV0gIT0gb3V0KSBleHBQcm90b1trZXldID0gb3V0O1xuICB9XG59O1xuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnbmF0aXZlLWZ1bmN0aW9uLXRvLXN0cmluZycsIEZ1bmN0aW9uLnRvU3RyaW5nKTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgdHlwZW9mIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXSAhPSAnZnVuY3Rpb24nKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyIHBJRSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgJGFzc2lnbiA9IE9iamVjdC5hc3NpZ247XG5cbi8vIHNob3VsZCB3b3JrIHdpdGggc3ltYm9scyBhbmQgc2hvdWxkIGhhdmUgZGV0ZXJtaW5pc3RpYyBwcm9wZXJ0eSBvcmRlciAoVjggYnVnKVxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgdmFyIEEgPSB7fTtcbiAgdmFyIEIgPSB7fTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHZhciBTID0gU3ltYm9sKCk7XG4gIHZhciBLID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtTXSA9IDc7XG4gIEsuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGspIHsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgPSB0b09iamVjdCh0YXJnZXQpO1xuICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDE7XG4gIHZhciBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICB2YXIgaXNFbnVtID0gcElFLmY7XG4gIHdoaWxlIChhTGVuID4gaW5kZXgpIHtcbiAgICB2YXIgUyA9IElPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICB2YXIga2V5cyA9IGdldFN5bWJvbHMgPyBnZXRLZXlzKFMpLmNvbmNhdChnZXRTeW1ib2xzKFMpKSA6IGdldEtleXMoUyk7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBqID0gMDtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChsZW5ndGggPiBqKSB7XG4gICAgICBrZXkgPSBrZXlzW2orK107XG4gICAgICBpZiAoIURFU0NSSVBUT1JTIHx8IGlzRW51bS5jYWxsKFMsIGtleSkpIFRba2V5XSA9IFNba2V5XTtcbiAgICB9XG4gIH0gcmV0dXJuIFQ7XG59IDogJGFzc2lnbjtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBTUkMgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJyk7XG52YXIgJHRvU3RyaW5nID0gcmVxdWlyZSgnLi9fZnVuY3Rpb24tdG8tc3RyaW5nJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciBUUEwgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vX2NvcmUnKS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiAkdG9TdHJpbmcuY2FsbChpdCk7XG59O1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWwsIHNhZmUpIHtcbiAgdmFyIGlzRnVuY3Rpb24gPSB0eXBlb2YgdmFsID09ICdmdW5jdGlvbic7XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCAnbmFtZScpIHx8IGhpZGUodmFsLCAnbmFtZScsIGtleSk7XG4gIGlmIChPW2tleV0gPT09IHZhbCkgcmV0dXJuO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgU1JDKSB8fCBoaWRlKHZhbCwgU1JDLCBPW2tleV0gPyAnJyArIE9ba2V5XSA6IFRQTC5qb2luKFN0cmluZyhrZXkpKSk7XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoIXNhZmUpIHtcbiAgICBkZWxldGUgT1trZXldO1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9IGVsc2UgaWYgKE9ba2V5XSkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIHtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfVxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIHRoaXNbU1JDXSB8fCAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pO1xuIiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCB0YWcsIHN0YXQpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpIGRlZihpdCwgVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZyB9KTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTtcbiIsInZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogY29yZS52ZXJzaW9uLFxuICBtb2RlOiByZXF1aXJlKCcuL19saWJyYXJ5JykgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAyMCBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRPX1NUUklORykge1xuICByZXR1cm4gZnVuY3Rpb24gKHRoYXQsIHBvcykge1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpO1xuICAgIHZhciBpID0gdG9JbnRlZ2VyKHBvcyk7XG4gICAgdmFyIGwgPSBzLmxlbmd0aDtcbiAgICB2YXIgYSwgYjtcbiAgICBpZiAoaSA8IDAgfHwgaSA+PSBsKSByZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbmRleCwgbGVuZ3RoKSB7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59O1xuIiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07XG4iLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBTKSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciBpZCA9IDA7XG52YXIgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59O1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbDtcbnZhciBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uIChpdGVyKSB7IEFycmF5LmZyb20oaXRlcik7IH0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UgLyogLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCAqLykge1xuICAgIHZhciBPID0gdG9PYmplY3QoYXJyYXlMaWtlKTtcbiAgICB2YXIgQyA9IHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXk7XG4gICAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBtYXBmbiA9IGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBpdGVyRm4gPSBnZXRJdGVyRm4oTyk7XG4gICAgdmFyIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZiAobWFwcGluZykgbWFwZm4gPSBjdHgobWFwZm4sIGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkLCAyKTtcbiAgICAvLyBpZiBvYmplY3QgaXNuJ3QgaXRlcmFibGUgb3IgaXQncyBhcnJheSB3aXRoIGRlZmF1bHQgaXRlcmF0b3IgLSB1c2Ugc2ltcGxlIGNhc2VcbiAgICBpZiAoaXRlckZuICE9IHVuZGVmaW5lZCAmJiAhKEMgPT0gQXJyYXkgJiYgaXNBcnJheUl0ZXIoaXRlckZuKSkpIHtcbiAgICAgIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChPKSwgcmVzdWx0ID0gbmV3IEMoKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBtYXBmbiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgICAgZm9yIChyZXN1bHQgPSBuZXcgQyhsZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0JywgeyBhc3NpZ246IHJlcXVpcmUoJy4vX29iamVjdC1hc3NpZ24nKSB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbiAoaXRlcmF0ZWQpIHtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24gKCkge1xuICB2YXIgTyA9IHRoaXMuX3Q7XG4gIHZhciBpbmRleCA9IHRoaXMuX2k7XG4gIHZhciBwb2ludDtcbiAgaWYgKGluZGV4ID49IE8ubGVuZ3RoKSByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7IHZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2UgfTtcbn0pO1xuIiwiLy8gZWxlbWVudC1jbG9zZXN0IHwgQ0MwLTEuMCB8IGdpdGh1Yi5jb20vam9uYXRoYW50bmVhbC9jbG9zZXN0XG5cbihmdW5jdGlvbiAoRWxlbWVudFByb3RvKSB7XG5cdGlmICh0eXBlb2YgRWxlbWVudFByb3RvLm1hdGNoZXMgIT09ICdmdW5jdGlvbicpIHtcblx0XHRFbGVtZW50UHJvdG8ubWF0Y2hlcyA9IEVsZW1lbnRQcm90by5tc01hdGNoZXNTZWxlY3RvciB8fCBFbGVtZW50UHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yIHx8IEVsZW1lbnRQcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHwgZnVuY3Rpb24gbWF0Y2hlcyhzZWxlY3Rvcikge1xuXHRcdFx0dmFyIGVsZW1lbnQgPSB0aGlzO1xuXHRcdFx0dmFyIGVsZW1lbnRzID0gKGVsZW1lbnQuZG9jdW1lbnQgfHwgZWxlbWVudC5vd25lckRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblx0XHRcdHZhciBpbmRleCA9IDA7XG5cblx0XHRcdHdoaWxlIChlbGVtZW50c1tpbmRleF0gJiYgZWxlbWVudHNbaW5kZXhdICE9PSBlbGVtZW50KSB7XG5cdFx0XHRcdCsraW5kZXg7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBCb29sZWFuKGVsZW1lbnRzW2luZGV4XSk7XG5cdFx0fTtcblx0fVxuXG5cdGlmICh0eXBlb2YgRWxlbWVudFByb3RvLmNsb3Nlc3QgIT09ICdmdW5jdGlvbicpIHtcblx0XHRFbGVtZW50UHJvdG8uY2xvc2VzdCA9IGZ1bmN0aW9uIGNsb3Nlc3Qoc2VsZWN0b3IpIHtcblx0XHRcdHZhciBlbGVtZW50ID0gdGhpcztcblxuXHRcdFx0d2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudC5ub2RlVHlwZSA9PT0gMSkge1xuXHRcdFx0XHRpZiAoZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSkge1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fTtcblx0fVxufSkod2luZG93LkVsZW1lbnQucHJvdG90eXBlKTtcbiIsIi8qIGdsb2JhbCBkZWZpbmUsIEtleWJvYXJkRXZlbnQsIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gIHZhciBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSB7XG4gICAgcG9seWZpbGw6IHBvbHlmaWxsLFxuICAgIGtleXM6IHtcbiAgICAgIDM6ICdDYW5jZWwnLFxuICAgICAgNjogJ0hlbHAnLFxuICAgICAgODogJ0JhY2tzcGFjZScsXG4gICAgICA5OiAnVGFiJyxcbiAgICAgIDEyOiAnQ2xlYXInLFxuICAgICAgMTM6ICdFbnRlcicsXG4gICAgICAxNjogJ1NoaWZ0JyxcbiAgICAgIDE3OiAnQ29udHJvbCcsXG4gICAgICAxODogJ0FsdCcsXG4gICAgICAxOTogJ1BhdXNlJyxcbiAgICAgIDIwOiAnQ2Fwc0xvY2snLFxuICAgICAgMjc6ICdFc2NhcGUnLFxuICAgICAgMjg6ICdDb252ZXJ0JyxcbiAgICAgIDI5OiAnTm9uQ29udmVydCcsXG4gICAgICAzMDogJ0FjY2VwdCcsXG4gICAgICAzMTogJ01vZGVDaGFuZ2UnLFxuICAgICAgMzI6ICcgJyxcbiAgICAgIDMzOiAnUGFnZVVwJyxcbiAgICAgIDM0OiAnUGFnZURvd24nLFxuICAgICAgMzU6ICdFbmQnLFxuICAgICAgMzY6ICdIb21lJyxcbiAgICAgIDM3OiAnQXJyb3dMZWZ0JyxcbiAgICAgIDM4OiAnQXJyb3dVcCcsXG4gICAgICAzOTogJ0Fycm93UmlnaHQnLFxuICAgICAgNDA6ICdBcnJvd0Rvd24nLFxuICAgICAgNDE6ICdTZWxlY3QnLFxuICAgICAgNDI6ICdQcmludCcsXG4gICAgICA0MzogJ0V4ZWN1dGUnLFxuICAgICAgNDQ6ICdQcmludFNjcmVlbicsXG4gICAgICA0NTogJ0luc2VydCcsXG4gICAgICA0NjogJ0RlbGV0ZScsXG4gICAgICA0ODogWycwJywgJyknXSxcbiAgICAgIDQ5OiBbJzEnLCAnISddLFxuICAgICAgNTA6IFsnMicsICdAJ10sXG4gICAgICA1MTogWyczJywgJyMnXSxcbiAgICAgIDUyOiBbJzQnLCAnJCddLFxuICAgICAgNTM6IFsnNScsICclJ10sXG4gICAgICA1NDogWyc2JywgJ14nXSxcbiAgICAgIDU1OiBbJzcnLCAnJiddLFxuICAgICAgNTY6IFsnOCcsICcqJ10sXG4gICAgICA1NzogWyc5JywgJygnXSxcbiAgICAgIDkxOiAnT1MnLFxuICAgICAgOTM6ICdDb250ZXh0TWVudScsXG4gICAgICAxNDQ6ICdOdW1Mb2NrJyxcbiAgICAgIDE0NTogJ1Njcm9sbExvY2snLFxuICAgICAgMTgxOiAnVm9sdW1lTXV0ZScsXG4gICAgICAxODI6ICdWb2x1bWVEb3duJyxcbiAgICAgIDE4MzogJ1ZvbHVtZVVwJyxcbiAgICAgIDE4NjogWyc7JywgJzonXSxcbiAgICAgIDE4NzogWyc9JywgJysnXSxcbiAgICAgIDE4ODogWycsJywgJzwnXSxcbiAgICAgIDE4OTogWyctJywgJ18nXSxcbiAgICAgIDE5MDogWycuJywgJz4nXSxcbiAgICAgIDE5MTogWycvJywgJz8nXSxcbiAgICAgIDE5MjogWydgJywgJ34nXSxcbiAgICAgIDIxOTogWydbJywgJ3snXSxcbiAgICAgIDIyMDogWydcXFxcJywgJ3wnXSxcbiAgICAgIDIyMTogWyddJywgJ30nXSxcbiAgICAgIDIyMjogW1wiJ1wiLCAnXCInXSxcbiAgICAgIDIyNDogJ01ldGEnLFxuICAgICAgMjI1OiAnQWx0R3JhcGgnLFxuICAgICAgMjQ2OiAnQXR0bicsXG4gICAgICAyNDc6ICdDclNlbCcsXG4gICAgICAyNDg6ICdFeFNlbCcsXG4gICAgICAyNDk6ICdFcmFzZUVvZicsXG4gICAgICAyNTA6ICdQbGF5JyxcbiAgICAgIDI1MTogJ1pvb21PdXQnXG4gICAgfVxuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIGtleXMgKEYxLTI0KS5cbiAgdmFyIGk7XG4gIGZvciAoaSA9IDE7IGkgPCAyNTsgaSsrKSB7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbMTExICsgaV0gPSAnRicgKyBpO1xuICB9XG5cbiAgLy8gUHJpbnRhYmxlIEFTQ0lJIGNoYXJhY3RlcnMuXG4gIHZhciBsZXR0ZXIgPSAnJztcbiAgZm9yIChpID0gNjU7IGkgPCA5MTsgaSsrKSB7XG4gICAgbGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1tpXSA9IFtsZXR0ZXIudG9Mb3dlckNhc2UoKSwgbGV0dGVyLnRvVXBwZXJDYXNlKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gcG9seWZpbGwgKCkge1xuICAgIGlmICghKCdLZXlib2FyZEV2ZW50JyBpbiB3aW5kb3cpIHx8XG4gICAgICAgICdrZXknIGluIEtleWJvYXJkRXZlbnQucHJvdG90eXBlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gUG9seWZpbGwgYGtleWAgb24gYEtleWJvYXJkRXZlbnRgLlxuICAgIHZhciBwcm90byA9IHtcbiAgICAgIGdldDogZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW3RoaXMud2hpY2ggfHwgdGhpcy5rZXlDb2RlXTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAga2V5ID0ga2V5Wyt0aGlzLnNoaWZ0S2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgICB9XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUsICdrZXknLCBwcm90byk7XG4gICAgcmV0dXJuIHByb3RvO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgna2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwnLCBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9IGVsc2UgaWYgKHdpbmRvdykge1xuICAgIHdpbmRvdy5rZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH1cblxufSkoKTtcbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJpbXBvcnQgYmVoYXZpb3IgZnJvbSAnLi9zcmMvYmVoYXZpb3InXG5pbXBvcnQgZGVsZWdhdGUgZnJvbSAnLi9zcmMvZGVsZWdhdGUnXG5pbXBvcnQgZGVsZWdhdGVBbGwgZnJvbSAnLi9zcmMvZGVsZWdhdGVBbGwnXG5pbXBvcnQgaWdub3JlIGZyb20gJy4vc3JjL2lnbm9yZSdcbmltcG9ydCBrZXltYXAgZnJvbSAnLi9zcmMva2V5bWFwJ1xuaW1wb3J0IG9uY2UgZnJvbSAnLi9zcmMvb25jZSdcblxuZXhwb3J0IHtiZWhhdmlvciwgZGVsZWdhdGUsIGRlbGVnYXRlQWxsLCBpZ25vcmUsIGtleW1hcCwgb25jZX1cbiIsImltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbidcbmltcG9ydCBkZWxlZ2F0ZSBmcm9tICcuL2RlbGVnYXRlJ1xuaW1wb3J0IGRlbGVnYXRlQWxsIGZyb20gJy4vZGVsZWdhdGVBbGwnXG5cbmNvbnN0IERFTEVHQVRFX1BBVFRFUk4gPSAvXiguKyk6ZGVsZWdhdGVcXCgoLispXFwpJC9cbmNvbnN0IFNQQUNFID0gJyAnXG5cbmNvbnN0IGdldExpc3RlbmVycyA9ICh0eXBlLCBoYW5kbGVyKSA9PiB7XG4gIGNvbnN0IG1hdGNoID0gdHlwZS5tYXRjaChERUxFR0FURV9QQVRURVJOKVxuICBsZXQgc2VsZWN0b3JcbiAgaWYgKG1hdGNoKSB7XG4gICAgdHlwZSA9IG1hdGNoWzFdXG4gICAgc2VsZWN0b3IgPSBtYXRjaFsyXVxuICB9XG5cbiAgbGV0IG9wdGlvbnNcbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0Jykge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBjYXB0dXJlOiBwb3BLZXkoaGFuZGxlciwgJ2NhcHR1cmUnKSxcbiAgICAgIHBhc3NpdmU6IHBvcEtleShoYW5kbGVyLCAncGFzc2l2ZScpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgbGlzdGVuZXIgPSB7XG4gICAgc2VsZWN0b3IsXG4gICAgb3B0aW9ucyxcbiAgICBkZWxlZ2F0ZTogdHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnID8gZGVsZWdhdGVBbGwoaGFuZGxlcikgOiBzZWxlY3RvciA/IGRlbGVnYXRlKHNlbGVjdG9yLCBoYW5kbGVyKSA6IGhhbmRsZXJcbiAgfVxuXG4gIGlmICh0eXBlLmluZGV4T2YoU1BBQ0UpID4gLTEpIHtcbiAgICByZXR1cm4gdHlwZS5zcGxpdChTUEFDRSkubWFwKF90eXBlID0+IHtcbiAgICAgIHJldHVybiBhc3NpZ24oe3R5cGU6IF90eXBlfSwgbGlzdGVuZXIpXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICBsaXN0ZW5lci50eXBlID0gdHlwZVxuICAgIHJldHVybiBbbGlzdGVuZXJdXG4gIH1cbn1cblxuY29uc3QgcG9wS2V5ID0gKG9iaiwga2V5KSA9PiB7XG4gIGNvbnN0IHZhbHVlID0gb2JqW2tleV1cbiAgZGVsZXRlIG9ialtrZXldXG4gIHJldHVybiB2YWx1ZVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiZWhhdmlvcihldmVudHMsIHByb3BzKSB7XG4gIGNvbnN0IGxpc3RlbmVycyA9IE9iamVjdC5rZXlzKGV2ZW50cykucmVkdWNlKChtZW1vLCB0eXBlKSA9PiB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gZ2V0TGlzdGVuZXJzKHR5cGUsIGV2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gbWVtby5jb25jYXQobGlzdGVuZXJzKVxuICB9LCBbXSlcblxuICByZXR1cm4gYXNzaWduKFxuICAgIHtcbiAgICAgIGFkZDogZWxlbWVudCA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgbGlzdGVuZXJzKSB7XG4gICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGxpc3RlbmVyLnR5cGUsIGxpc3RlbmVyLmRlbGVnYXRlLCBsaXN0ZW5lci5vcHRpb25zKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcmVtb3ZlOiBlbGVtZW50ID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIobGlzdGVuZXIudHlwZSwgbGlzdGVuZXIuZGVsZWdhdGUsIGxpc3RlbmVyLm9wdGlvbnMpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHByb3BzXG4gIClcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbXBvc2UoZnVuY3Rpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5zb21lKGZuID0+IHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpID09PSBmYWxzZVxuICAgIH0pXG4gIH1cbn1cbiIsIi8vIHBvbHlmaWxsIEVsZW1lbnQucHJvdG90eXBlLmNsb3Nlc3RcbmltcG9ydCAnZWxlbWVudC1jbG9zZXN0J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWxlZ2F0ZShzZWxlY3RvciwgZm4pIHtcbiAgcmV0dXJuIGV2ZW50ID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQuY2xvc2VzdChzZWxlY3RvcilcbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0YXJnZXQsIGV2ZW50KVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IGRlbGVnYXRlIGZyb20gJy4vZGVsZWdhdGUnXG5pbXBvcnQgY29tcG9zZSBmcm9tICcuL2NvbXBvc2UnXG5cbmNvbnN0IFNQTEFUID0gJyonXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRlbGVnYXRlQWxsKHNlbGVjdG9ycykge1xuICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoc2VsZWN0b3JzKVxuXG4gIC8vIFhYWCBvcHRpbWl6YXRpb246IGlmIHRoZXJlIGlzIG9ubHkgb25lIGhhbmRsZXIgYW5kIGl0IGFwcGxpZXMgdG9cbiAgLy8gYWxsIGVsZW1lbnRzICh0aGUgXCIqXCIgQ1NTIHNlbGVjdG9yKSwgdGhlbiBqdXN0IHJldHVybiB0aGF0XG4gIC8vIGhhbmRsZXJcbiAgaWYgKGtleXMubGVuZ3RoID09PSAxICYmIGtleXNbMF0gPT09IFNQTEFUKSB7XG4gICAgcmV0dXJuIHNlbGVjdG9yc1tTUExBVF1cbiAgfVxuXG4gIGNvbnN0IGRlbGVnYXRlcyA9IGtleXMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHNlbGVjdG9yKSB7XG4gICAgbWVtby5wdXNoKGRlbGVnYXRlKHNlbGVjdG9yLCBzZWxlY3RvcnNbc2VsZWN0b3JdKSlcbiAgICByZXR1cm4gbWVtb1xuICB9LCBbXSlcbiAgcmV0dXJuIGNvbXBvc2UoZGVsZWdhdGVzKVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaWdub3JlKGVsZW1lbnQsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBpZ25vcmFuY2UoZSkge1xuICAgIGlmIChlbGVtZW50ICE9PSBlLnRhcmdldCAmJiAhZWxlbWVudC5jb250YWlucyhlLnRhcmdldCkpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgJ2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsJ1xuXG4vLyB0aGVzZSBhcmUgdGhlIG9ubHkgcmVsZXZhbnQgbW9kaWZpZXJzIHN1cHBvcnRlZCBvbiBhbGwgcGxhdGZvcm1zLFxuLy8gYWNjb3JkaW5nIHRvIE1ETjpcbi8vIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudC9nZXRNb2RpZmllclN0YXRlPlxuY29uc3QgTU9ESUZJRVJTID0ge1xuICBBbHQ6ICdhbHRLZXknLFxuICBDb250cm9sOiAnY3RybEtleScsXG4gIEN0cmw6ICdjdHJsS2V5JyxcbiAgU2hpZnQ6ICdzaGlmdEtleSdcbn1cblxuY29uc3QgTU9ESUZJRVJfU0VQQVJBVE9SID0gJysnXG5cbmZ1bmN0aW9uIGdldEV2ZW50S2V5KGV2ZW50LCBoYXNNb2RpZmllcnMpIHtcbiAgbGV0IGtleSA9IGV2ZW50LmtleVxuICBpZiAoaGFzTW9kaWZpZXJzKSB7XG4gICAgZm9yIChjb25zdCBtb2RpZmllciBpbiBNT0RJRklFUlMpIHtcbiAgICAgIGlmIChldmVudFtNT0RJRklFUlNbbW9kaWZpZXJdXSA9PT0gdHJ1ZSkge1xuICAgICAgICBrZXkgPSBbbW9kaWZpZXIsIGtleV0uam9pbihNT0RJRklFUl9TRVBBUkFUT1IpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBrZXlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ga2V5bWFwKGtleXMpIHtcbiAgY29uc3QgaGFzTW9kaWZpZXJzID0gT2JqZWN0LmtleXMoa2V5cykuc29tZShrZXkgPT4ge1xuICAgIHJldHVybiBrZXkuaW5kZXhPZihNT0RJRklFUl9TRVBBUkFUT1IpID4gLTFcbiAgfSlcbiAgcmV0dXJuIGZ1bmN0aW9uIGtleW1hcHBlcihldmVudCkge1xuICAgIGNvbnN0IGtleSA9IGdldEV2ZW50S2V5KGV2ZW50LCBoYXNNb2RpZmllcnMpXG4gICAgcmV0dXJuIFtrZXksIGtleS50b0xvd2VyQ2FzZSgpXS5yZWR1Y2UoKHJlc3VsdCwgX2tleSkgPT4ge1xuICAgICAgaWYgKF9rZXkgaW4ga2V5cykge1xuICAgICAgICByZXR1cm4ga2V5c1trZXldLmNhbGwodGhpcywgZXZlbnQpXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQge01PRElGSUVSU31cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9uY2UobGlzdGVuZXIsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBwZWRPbmNlKGUpIHtcbiAgICBlLmN1cnJlbnRUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLnR5cGUsIHdyYXBwZWRPbmNlLCBvcHRpb25zKVxuICAgIHJldHVybiBsaXN0ZW5lci5jYWxsKHRoaXMsIGUpXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgdG9nZ2xlID0gcmVxdWlyZSgnLi4vdXRpbHMvdG9nZ2xlJyk7XHJcbmNvbnN0IGlzRWxlbWVudEluVmlld3BvcnQgPSByZXF1aXJlKCcuLi91dGlscy9pcy1pbi12aWV3cG9ydCcpO1xyXG5jb25zdCBCVVRUT04gPSBgLmFjY29yZGlvbi1idXR0b25bYXJpYS1jb250cm9sc11gO1xyXG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcclxuY29uc3QgTVVMVElTRUxFQ1RBQkxFID0gJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJztcclxuY29uc3QgTVVMVElTRUxFQ1RBQkxFX0NMQVNTID0gJ2FjY29yZGlvbi1tdWx0aXNlbGVjdGFibGUnO1xyXG5jb25zdCBCVUxLX0ZVTkNUSU9OX09QRU5fVEVYVCA9IFwiw4VibiBhbGxlXCI7XHJcbmNvbnN0IEJVTEtfRlVOQ1RJT05fQ0xPU0VfVEVYVCA9IFwiTHVrIGFsbGVcIjtcclxuY29uc3QgQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFID0gXCJkYXRhLWFjY29yZGlvbi1idWxrLWV4cGFuZFwiO1xyXG5cclxuY2xhc3MgQWNjb3JkaW9ue1xyXG4gIGNvbnN0cnVjdG9yIChhY2NvcmRpb24pe1xyXG4gICAgaWYoIWFjY29yZGlvbil7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBhY2NvcmRpb24gZ3JvdXAgZWxlbWVudGApO1xyXG4gICAgfVxyXG4gICAgdGhpcy5hY2NvcmRpb24gPSBhY2NvcmRpb247XHJcbiAgICBsZXQgcHJldlNpYmxpbmcgPSBhY2NvcmRpb24ucHJldmlvdXNFbGVtZW50U2libGluZyA7XHJcbiAgICBpZihwcmV2U2libGluZyAhPT0gbnVsbCAmJiBwcmV2U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbi1idWxrLWJ1dHRvbicpKXtcclxuICAgICAgdGhpcy5idWxrRnVuY3Rpb25CdXR0b24gPSBwcmV2U2libGluZztcclxuICAgIH1cclxuICAgIHRoaXMuYnV0dG9ucyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbiAgICBpZih0aGlzLmJ1dHRvbnMubGVuZ3RoID09IDApe1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgYWNjb3JkaW9uIGJ1dHRvbnNgKTtcclxuICAgIH0gZWxzZXtcclxuICAgICAgdGhpcy5ldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICAgIHRoaXMuZXZlbnRDbG9zZS5pbml0RXZlbnQoJ2Zkcy5hY2NvcmRpb24uY2xvc2UnLCB0cnVlLCB0cnVlKTtcclxuICAgICAgdGhpcy5ldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgICAgdGhpcy5ldmVudE9wZW4uaW5pdEV2ZW50KCdmZHMuYWNjb3JkaW9uLm9wZW4nLCB0cnVlLCB0cnVlKTtcclxuICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0ICgpe1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspe1xyXG4gICAgICBsZXQgY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9uc1tpXTtcclxuICAgICAgXHJcbiAgICAgIC8vIFZlcmlmeSBzdGF0ZSBvbiBidXR0b24gYW5kIHN0YXRlIG9uIHBhbmVsXHJcbiAgICAgIGxldCBleHBhbmRlZCA9IGN1cnJlbnRCdXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnO1xyXG4gICAgICB0b2dnbGVCdXR0b24oY3VycmVudEJ1dHRvbiwgZXhwYW5kZWQpO1xyXG5cclxuICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgIGN1cnJlbnRCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGF0LmV2ZW50T25DbGljaywgZmFsc2UpO1xyXG4gICAgICBjdXJyZW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhhdC5ldmVudE9uQ2xpY2ssIGZhbHNlKTtcclxuICAgICAgdGhpcy5lbmFibGVCdWxrRnVuY3Rpb24oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGVuYWJsZUJ1bGtGdW5jdGlvbigpe1xyXG4gICAgaWYodGhpcy5idWxrRnVuY3Rpb25CdXR0b24gIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHRoaXMuYnVsa0Z1bmN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBsZXQgYWNjb3JkaW9uID0gdGhpcy5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgbGV0IGJ1dHRvbnMgPSBhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xyXG4gICAgICAgIGlmKCFhY2NvcmRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24nKSl7ICBcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYWNjb3JkaW9uLmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihidXR0b25zLmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBhY2NvcmRpb24gYnV0dG9uc2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgXHJcbiAgICAgICAgbGV0IGV4cGFuZCA9IHRydWU7XHJcbiAgICAgICAgaWYodGhpcy5nZXRBdHRyaWJ1dGUoQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFKSA9PT0gXCJmYWxzZVwiKSB7XHJcbiAgICAgICAgICBleHBhbmQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgIHRvZ2dsZUJ1dHRvbihidXR0b25zW2ldLCBleHBhbmQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUsICFleHBhbmQpO1xyXG4gICAgICAgIGlmKCFleHBhbmQgPT09IHRydWUpe1xyXG4gICAgICAgICAgdGhpcy5pbm5lclRleHQgPSBCVUxLX0ZVTkNUSU9OX09QRU5fVEVYVDtcclxuICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICB0aGlzLmlubmVyVGV4dCA9IEJVTEtfRlVOQ1RJT05fQ0xPU0VfVEVYVDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgXHJcbiAgZXZlbnRPbkNsaWNrIChldmVudCl7XHJcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIGxldCBidXR0b24gPSB0aGlzO1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIHRvZ2dsZUJ1dHRvbihidXR0b24pO1xyXG4gICAgaWYgKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSAndHJ1ZScpIHtcclxuICAgICAgLy8gV2Ugd2VyZSBqdXN0IGV4cGFuZGVkLCBidXQgaWYgYW5vdGhlciBhY2NvcmRpb24gd2FzIGFsc28ganVzdFxyXG4gICAgICAvLyBjb2xsYXBzZWQsIHdlIG1heSBubyBsb25nZXIgYmUgaW4gdGhlIHZpZXdwb3J0LiBUaGlzIGVuc3VyZXNcclxuICAgICAgLy8gdGhhdCB3ZSBhcmUgc3RpbGwgdmlzaWJsZSwgc28gdGhlIHVzZXIgaXNuJ3QgY29uZnVzZWQuXHJcbiAgICAgIGlmICghaXNFbGVtZW50SW5WaWV3cG9ydChidXR0b24pKSBidXR0b24uc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBUb2dnbGUgYSBidXR0b24ncyBcInByZXNzZWRcIiBzdGF0ZSwgb3B0aW9uYWxseSBwcm92aWRpbmcgYSB0YXJnZXRcclxuICAgKiBzdGF0ZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbj99IGV4cGFuZGVkIElmIG5vIHN0YXRlIGlzIHByb3ZpZGVkLCB0aGUgY3VycmVudFxyXG4gICAqIHN0YXRlIHdpbGwgYmUgdG9nZ2xlZCAoZnJvbSBmYWxzZSB0byB0cnVlLCBhbmQgdmljZS12ZXJzYSkuXHJcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gdGhlIHJlc3VsdGluZyBzdGF0ZVxyXG4gICAqL1xyXG59XHJcblxyXG52YXIgdG9nZ2xlQnV0dG9uICA9IGZ1bmN0aW9uIChidXR0b24sIGV4cGFuZGVkKSB7XHJcbiAgbGV0IGFjY29yZGlvbiA9IG51bGw7XHJcbiAgaWYoYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbicpKXtcclxuICAgIGFjY29yZGlvbiA9IGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgfSBlbHNlIGlmKGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbicpKXtcclxuICAgIGFjY29yZGlvbiA9IGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICB9XHJcblxyXG4gIGxldCBldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgZXZlbnRDbG9zZS5pbml0RXZlbnQoJ2Zkcy5hY2NvcmRpb24uY2xvc2UnLCB0cnVlLCB0cnVlKTtcclxuICBsZXQgZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgZXZlbnRPcGVuLmluaXRFdmVudCgnZmRzLmFjY29yZGlvbi5vcGVuJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgZXhwYW5kZWQgPSB0b2dnbGUoYnV0dG9uLCBleHBhbmRlZCk7XHJcblxyXG4gIGlmKGV4cGFuZGVkKXtcclxuICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgfSBlbHNle1xyXG4gICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgfVxyXG5cclxuICBsZXQgbXVsdGlzZWxlY3RhYmxlID0gZmFsc2U7XHJcbiAgaWYoYWNjb3JkaW9uICE9PSBudWxsICYmIChhY2NvcmRpb24uZ2V0QXR0cmlidXRlKE1VTFRJU0VMRUNUQUJMRSkgPT09ICd0cnVlJyB8fCBhY2NvcmRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKE1VTFRJU0VMRUNUQUJMRV9DTEFTUykpKXtcclxuICAgIG11bHRpc2VsZWN0YWJsZSA9IHRydWU7XHJcbiAgICBsZXQgYnVsa0Z1bmN0aW9uID0gYWNjb3JkaW9uLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICBpZihidWxrRnVuY3Rpb24gIT09IG51bGwgJiYgYnVsa0Z1bmN0aW9uLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uLWJ1bGstYnV0dG9uJykpe1xyXG4gICAgICBsZXQgc3RhdHVzID0gYnVsa0Z1bmN0aW9uLmdldEF0dHJpYnV0ZShCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUpO1xyXG4gICAgICBsZXQgYnV0dG9ucyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbiAgICAgIGxldCBidXR0b25zT3BlbiA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTisnW2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICAgIGxldCBidXR0b25zQ2xvc2VkID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKydbYXJpYS1leHBhbmRlZD1cImZhbHNlXCJdJyk7XHJcbiAgICAgIGxldCBuZXdTdGF0dXMgPSB0cnVlO1xyXG4gICAgICBpZihidXR0b25zLmxlbmd0aCA9PT0gYnV0dG9uc09wZW4ubGVuZ3RoKXtcclxuICAgICAgICBuZXdTdGF0dXMgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBpZihidXR0b25zLmxlbmd0aCA9PT0gYnV0dG9uc0Nsb3NlZC5sZW5ndGgpe1xyXG4gICAgICAgIG5ld1N0YXR1cyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgYnVsa0Z1bmN0aW9uLnNldEF0dHJpYnV0ZShCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUsIG5ld1N0YXR1cyk7XHJcbiAgICAgIGlmKG5ld1N0YXR1cyA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgYnVsa0Z1bmN0aW9uLmlubmVyVGV4dCA9IEJVTEtfRlVOQ1RJT05fT1BFTl9URVhUO1xyXG4gICAgICB9IGVsc2V7XHJcbiAgICAgICAgYnVsa0Z1bmN0aW9uLmlubmVyVGV4dCA9IEJVTEtfRlVOQ1RJT05fQ0xPU0VfVEVYVDtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChleHBhbmRlZCAmJiAhbXVsdGlzZWxlY3RhYmxlKSB7XHJcbiAgICBsZXQgYnV0dG9ucyA9IFsgYnV0dG9uIF07XHJcbiAgICBpZihhY2NvcmRpb24gIT09IG51bGwpIHtcclxuICAgICAgYnV0dG9ucyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYnV0dG9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgY3VycmVudEJ1dHR0b24gPSBidXR0b25zW2ldO1xyXG4gICAgICBpZiAoY3VycmVudEJ1dHR0b24gIT09IGJ1dHRvbikge1xyXG4gICAgICAgIHRvZ2dsZShjdXJyZW50QnV0dHRvbiwgZmFsc2UpO1xyXG4gICAgICAgIGN1cnJlbnRCdXR0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBY2NvcmRpb247XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY2xhc3MgQ2hlY2tib3hUb2dnbGVDb250ZW50e1xyXG4gICAgY29uc3RydWN0b3IoZWwpe1xyXG4gICAgICAgIHRoaXMuanNUb2dnbGVUcmlnZ2VyID0gJy5qcy1jaGVja2JveC10b2dnbGUtY29udGVudCc7XHJcbiAgICAgICAgdGhpcy5qc1RvZ2dsZVRhcmdldCA9ICdkYXRhLWFyaWEtY29udHJvbHMnO1xyXG4gICAgICAgIHRoaXMuZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRDbG9zZS5pbml0RXZlbnQoJ2Zkcy5jb2xsYXBzZS5jbG9zZScsIHRydWUsIHRydWUpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICAgICAgdGhpcy5ldmVudE9wZW4uaW5pdEV2ZW50KCdmZHMuY29sbGFwc2Uub3BlbicsIHRydWUsIHRydWUpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY2hlY2tib3hFbCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdChlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdChlbCl7XHJcbiAgICAgICAgdGhpcy5jaGVja2JveEVsID0gZWw7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2hlY2tib3hFbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoZXZlbnQpe1xyXG4gICAgICAgICAgICB0aGF0LnRvZ2dsZSh0aGF0LmNoZWNrYm94RWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlKHRoaXMuY2hlY2tib3hFbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlKHRyaWdnZXJFbCl7XHJcbiAgICAgICAgdmFyIHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKHRoaXMuanNUb2dnbGVUYXJnZXQpXHJcbiAgICAgICAgdmFyIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0cik7XHJcbiAgICAgICAgaWYodGFyZ2V0RWwgPT09IG51bGwgfHwgdGFyZ2V0RWwgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgcGFuZWwgZWxlbWVudC4gVmVyaWZ5IHZhbHVlIG9mIGF0dHJpYnV0ZSBgKyB0aGlzLmpzVG9nZ2xlVGFyZ2V0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodHJpZ2dlckVsLmNoZWNrZWQpe1xyXG4gICAgICAgICAgICB0aGlzLm9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9wZW4odHJpZ2dlckVsLCB0YXJnZXRFbCl7XHJcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdkYXRhLWFyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50T3Blbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCl7XHJcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdkYXRhLWFyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50Q2xvc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDaGVja2JveFRvZ2dsZUNvbnRlbnQ7XHJcbiIsIi8qKlxyXG4gKiBDb2xsYXBzZS9leHBhbmQuXHJcbiAqL1xyXG5cclxuJ3VzZSBzdHJpY3QnXHJcblxyXG5jbGFzcyBDb2xsYXBzZSB7XHJcbiAgY29uc3RydWN0b3IgKGVsZW1lbnQsIGFjdGlvbiA9ICd0b2dnbGUnKXtcclxuICAgIHRoaXMuanNDb2xsYXBzZVRhcmdldCA9ICdkYXRhLWpzLXRhcmdldCc7XHJcbiAgICB0aGlzLnRyaWdnZXJFbCA9IGVsZW1lbnQ7XHJcbiAgICB0aGlzLnRhcmdldEVsO1xyXG4gICAgdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xyXG4gICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgdGhpcy5ldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICB0aGlzLmV2ZW50Q2xvc2UuaW5pdEV2ZW50KCdmZHMuY29sbGFwc2UuY2xvc2UnLCB0cnVlLCB0cnVlKTtcclxuICAgIHRoaXMuZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICB0aGlzLmV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5jb2xsYXBzZS5vcGVuJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICB0aGlzLnRyaWdnZXJFbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpe1xyXG4gICAgICB0aGF0LnRvZ2dsZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVDb2xsYXBzZSAoZm9yY2VDbG9zZSkge1xyXG4gICAgbGV0IHRhcmdldEF0dHIgPSB0aGlzLnRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUodGhpcy5qc0NvbGxhcHNlVGFyZ2V0KTtcclxuICAgIHRoaXMudGFyZ2V0RWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldEF0dHIpO1xyXG4gICAgaWYodGhpcy50YXJnZXRFbCA9PT0gbnVsbCB8fCB0aGlzLnRhcmdldEVsID09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgcGFuZWwgZWxlbWVudC4gVmVyaWZ5IHZhbHVlIG9mIGF0dHJpYnV0ZSBgKyB0aGlzLmpzQ29sbGFwc2VUYXJnZXQpO1xyXG4gICAgfVxyXG4gICAgLy9jaGFuZ2Ugc3RhdGVcclxuICAgIGlmKHRoaXMudHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgfHwgdGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09IHVuZGVmaW5lZCB8fCBmb3JjZUNsb3NlICl7XHJcbiAgICAgIC8vY2xvc2VcclxuICAgICAgdGhpcy5hbmltYXRlQ29sbGFwc2UoKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAvL29wZW5cclxuICAgICAgdGhpcy5hbmltYXRlRXhwYW5kKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0b2dnbGUgKCl7XHJcbiAgICBpZih0aGlzLnRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0aGlzLnRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGhpcy50b2dnbGVDb2xsYXBzZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIGFuaW1hdGVDb2xsYXBzZSAoKSB7XHJcbiAgICBpZighdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyl7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSB0aGlzLnRhcmdldEVsLmNsaWVudEhlaWdodCsgJ3B4JztcclxuICAgICAgdGhpcy50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZS10cmFuc2l0aW9uLWNvbGxhcHNlJyk7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKXtcclxuICAgICAgICB0aGF0LnRhcmdldEVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcclxuICAgICAgfSwgNSk7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgdGhhdC50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICB0aGF0LnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlLXRyYW5zaXRpb24tY29sbGFwc2UnKTtcclxuXHJcbiAgICAgICAgdGhhdC50cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICB0aGF0LmFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XHJcbiAgICAgICAgdGhhdC50cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGF0LmV2ZW50Q2xvc2UpO1xyXG4gICAgICB9LCAyMDApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYW5pbWF0ZUV4cGFuZCAoKSB7XHJcbiAgICBpZighdGhpcy5hbmltYXRlSW5Qcm9ncmVzcyl7XHJcbiAgICAgIHRoaXMuYW5pbWF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xyXG4gICAgICB0aGlzLnRhcmdldEVsLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICBsZXQgZXhwYW5kZWRIZWlnaHQgPSB0aGlzLnRhcmdldEVsLmNsaWVudEhlaWdodDtcclxuICAgICAgdGhpcy50YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSAnMHB4JztcclxuICAgICAgdGhpcy50YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZS10cmFuc2l0aW9uLWV4cGFuZCcpO1xyXG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgdGhhdC50YXJnZXRFbC5zdHlsZS5oZWlnaHQgPSBleHBhbmRlZEhlaWdodCsgJ3B4JztcclxuICAgICAgfSwgNSk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpe1xyXG4gICAgICAgIHRoYXQudGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2UtdHJhbnNpdGlvbi1leHBhbmQnKTtcclxuICAgICAgICB0aGF0LnRhcmdldEVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcclxuXHJcbiAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgdGhhdC50cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgICB0aGF0LmFuaW1hdGVJblByb2dyZXNzID0gZmFsc2U7XHJcbiAgICAgICAgdGhhdC50cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGF0LmV2ZW50T3Blbik7XHJcbiAgICAgIH0sIDIwMCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxhcHNlO1xyXG4iLCJjb25zdCByZWNlcHRvciA9IHJlcXVpcmUoXCJyZWNlcHRvclwiKTtcclxuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKFwiLi4vdXRpbHMvYmVoYXZpb3JcIik7XHJcbmNvbnNvbGUubG9nKCk7XHJcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoXCIuLi91dGlscy9zZWxlY3RcIik7XHJcbmNvbnN0IHsgcHJlZml4OiBQUkVGSVggfSA9IHJlcXVpcmUoXCIuLi9jb25maWdcIik7XHJcbmNvbnN0IHsgQ0xJQ0sgfSA9IHJlcXVpcmUoXCIuLi9ldmVudHNcIik7XHJcbmNvbnN0IGFjdGl2ZUVsZW1lbnQgPSByZXF1aXJlKFwiLi4vdXRpbHMvYWN0aXZlLWVsZW1lbnRcIik7XHJcbmNvbnN0IGlzSW9zRGV2aWNlID0gcmVxdWlyZShcIi4uL3V0aWxzL2lzLWlvcy1kZXZpY2VcIik7XHJcblxyXG5jb25zdCBEQVRFX1BJQ0tFUl9DTEFTUyA9IGBkYXRlLXBpY2tlcmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX1dSQVBQRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX3dyYXBwZXJgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfS0taW5pdGlhbGl6ZWRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU30tLWFjdGl2ZWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19pbnRlcm5hbC1pbnB1dGA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19leHRlcm5hbC1pbnB1dGA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0JVVFRPTl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fYnV0dG9uYDtcclxuY29uc3QgREFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2NhbGVuZGFyYDtcclxuY29uc3QgREFURV9QSUNLRVJfU1RBVFVTX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19zdGF0dXNgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19kYXRlYDtcclxuXHJcbmNvbnN0IENBTEVOREFSX0RBVEVfRk9DVVNFRF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1mb2N1c2VkYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9TRUxFQ1RFRF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1zZWxlY3RlZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUFJFVklPVVNfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcHJldmlvdXMtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tY3VycmVudC1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfTkVYVF9NT05USF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1uZXh0LW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGVgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1RPREFZX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXRvZGF5YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX1NUQVJUX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGUtc3RhcnRgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfRU5EX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGUtZW5kYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9XSVRISU5fUkFOR0VfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0td2l0aGluLXJhbmdlYDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMteWVhcmA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19wcmV2aW91cy1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC15ZWFyYDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9NT05USF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtc2VsZWN0aW9uYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3llYXItc2VsZWN0aW9uYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRF9DTEFTUyA9IGAke0NBTEVOREFSX01PTlRIX0NMQVNTfS0tZm9jdXNlZGA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9LS1zZWxlY3RlZGA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3llYXJgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfS0tZm9jdXNlZGA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNURURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19wcmV2aW91cy15ZWFyLWNodW5rYDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19uZXh0LXllYXItY2h1bmtgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF0ZS1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoLXBpY2tlcmA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfUElDS0VSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyLXBpY2tlcmA7XHJcbmNvbnN0IENBTEVOREFSX1RBQkxFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X190YWJsZWA7XHJcbmNvbnN0IENBTEVOREFSX1JPV19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcm93YDtcclxuY29uc3QgQ0FMRU5EQVJfQ0VMTF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fY2VsbGA7XHJcbmNvbnN0IENBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTID0gYCR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30tLWNlbnRlci1pdGVtc2A7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0xBQkVMX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aC1sYWJlbGA7XHJcbmNvbnN0IENBTEVOREFSX0RBWV9PRl9XRUVLX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19kYXktb2Ytd2Vla2A7XHJcblxyXG5jb25zdCBEQVRFX1BJQ0tFUiA9IGAuJHtEQVRFX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9CVVRUT04gPSBgLiR7REFURV9QSUNLRVJfQlVUVE9OX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUID0gYC4ke0RBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUID0gYC4ke0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0NBTEVOREFSID0gYC4ke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX1NUQVRVUyA9IGAuJHtEQVRFX1BJQ0tFUl9TVEFUVVNfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURSA9IGAuJHtDQUxFTkRBUl9EQVRFX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIID0gYC4ke0NBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEggPSBgLiR7Q0FMRU5EQVJfUFJFVklPVVNfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSID0gYC4ke0NBTEVOREFSX05FWFRfWUVBUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX01PTlRIID0gYC4ke0NBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT04gPSBgLiR7Q0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05fQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OID0gYC4ke0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USCA9IGAuJHtDQUxFTkRBUl9NT05USF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSID0gYC4ke0NBTEVOREFSX1lFQVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyA9IGAuJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9QSUNLRVIgPSBgLiR7Q0FMRU5EQVJfREFURV9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfUElDS0VSID0gYC4ke0NBTEVOREFSX01PTlRIX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1BJQ0tFUiA9IGAuJHtDQUxFTkRBUl9ZRUFSX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9GT0NVU0VEID0gYC4ke0NBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEID0gYC4ke0NBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTU31gO1xyXG5cclxuY29uc3QgVkFMSURBVElPTl9NRVNTQUdFID0gXCJJbmR0YXN0IHZlbmxpZ3N0IGVuIGd5bGRpZyBkYXRvXCI7XHJcblxyXG5jb25zdCBNT05USF9MQUJFTFMgPSBbXHJcbiAgXCJKYW51YXJcIixcclxuICBcIkZlYnJ1YXJcIixcclxuICBcIk1hcnRzXCIsXHJcbiAgXCJBcHJpbFwiLFxyXG4gIFwiTWFqXCIsXHJcbiAgXCJKdW5pXCIsXHJcbiAgXCJKdWxpXCIsXHJcbiAgXCJBdWd1c3RcIixcclxuICBcIlNlcHRlbWJlclwiLFxyXG4gIFwiT2t0b2JlclwiLFxyXG4gIFwiTm92ZW1iZXJcIixcclxuICBcIkRlY2VtYmVyXCIsXHJcbl07XHJcblxyXG5jb25zdCBEQVlfT0ZfV0VFS19MQUJFTFMgPSBbXHJcbiAgXCJNYW5kYWdcIixcclxuICBcIlRpcnNkYWdcIixcclxuICBcIk9uc2RhZ1wiLFxyXG4gIFwiVG9yc2RhZ1wiLFxyXG4gIFwiRnJlZGFnXCIsXHJcbiAgXCJMw7hyZGFnXCIsXHJcbiAgXCJTw7huZGFnXCIsXHJcbl07XHJcblxyXG5jb25zdCBFTlRFUl9LRVlDT0RFID0gMTM7XHJcblxyXG5jb25zdCBZRUFSX0NIVU5LID0gMTI7XHJcblxyXG5jb25zdCBERUZBVUxUX01JTl9EQVRFID0gXCIwMDAwLTAxLTAxXCI7XHJcbmNvbnN0IERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQgPSBcIkREL01NL1lZWVlcIjtcclxuY29uc3QgSU5URVJOQUxfREFURV9GT1JNQVQgPSBcIllZWVktTU0tRERcIjtcclxuXHJcbmNvbnN0IE5PVF9ESVNBQkxFRF9TRUxFQ1RPUiA9IFwiOm5vdChbZGlzYWJsZWRdKVwiO1xyXG5cclxuY29uc3QgcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyA9ICguLi5zZWxlY3RvcnMpID0+XHJcbiAgc2VsZWN0b3JzLm1hcCgocXVlcnkpID0+IHF1ZXJ5ICsgTk9UX0RJU0FCTEVEX1NFTEVDVE9SKS5qb2luKFwiLCBcIik7XHJcblxyXG5jb25zdCBEQVRFX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxyXG4gIENBTEVOREFSX1BSRVZJT1VTX1lFQVIsXHJcbiAgQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEgsXHJcbiAgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT04sXHJcbiAgQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OLFxyXG4gIENBTEVOREFSX05FWFRfWUVBUixcclxuICBDQUxFTkRBUl9ORVhUX01PTlRILFxyXG4gIENBTEVOREFSX0RBVEVfRk9DVVNFRFxyXG4pO1xyXG5cclxuY29uc3QgTU9OVEhfUElDS0VSX0ZPQ1VTQUJMRSA9IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMoXHJcbiAgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRFxyXG4pO1xyXG5cclxuY29uc3QgWUVBUl9QSUNLRVJfRk9DVVNBQkxFID0gcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyhcclxuICBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LLFxyXG4gIENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyxcclxuICBDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURcclxuKTtcclxuXHJcbi8vICNyZWdpb24gRGF0ZSBNYW5pcHVsYXRpb24gRnVuY3Rpb25zXHJcblxyXG4vKipcclxuICogS2VlcCBkYXRlIHdpdGhpbiBtb250aC4gTW9udGggd291bGQgb25seSBiZSBvdmVyIGJ5IDEgdG8gMyBkYXlzXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZVRvQ2hlY2sgdGhlIGRhdGUgb2JqZWN0IHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCB0aGUgY29ycmVjdCBtb250aFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGRhdGUsIGNvcnJlY3RlZCBpZiBuZWVkZWRcclxuICovXHJcbmNvbnN0IGtlZXBEYXRlV2l0aGluTW9udGggPSAoZGF0ZVRvQ2hlY2ssIG1vbnRoKSA9PiB7XHJcbiAgaWYgKG1vbnRoICE9PSBkYXRlVG9DaGVjay5nZXRNb250aCgpKSB7XHJcbiAgICBkYXRlVG9DaGVjay5zZXREYXRlKDApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGVUb0NoZWNrO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIGZyb20gbW9udGggZGF5IHllYXJcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHllYXIgdGhlIHllYXIgdG8gc2V0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCB0aGUgbW9udGggdG8gc2V0ICh6ZXJvLWluZGV4ZWQpXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIHNldFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIHNldCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXREYXRlID0gKHllYXIsIG1vbnRoLCBkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoeWVhciwgbW9udGgsIGRhdGUpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHRvZGF5cyBkYXRlXHJcbiAqXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0b2RheXMgZGF0ZVxyXG4gKi9cclxuY29uc3QgdG9kYXkgPSAoKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgY29uc3QgZGF5ID0gbmV3RGF0ZS5nZXREYXRlKCk7XHJcbiAgY29uc3QgbW9udGggPSBuZXdEYXRlLmdldE1vbnRoKCk7XHJcbiAgY29uc3QgeWVhciA9IG5ld0RhdGUuZ2V0RnVsbFllYXIoKTtcclxuICByZXR1cm4gc2V0RGF0ZSh5ZWFyLCBtb250aCwgZGF5KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byBmaXJzdCBkYXkgb2YgdGhlIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN0YXJ0T2ZNb250aCA9IChkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIDEpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIGxhc3QgZGF5IG9mIHRoZSBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBsYXN0RGF5T2ZNb250aCA9IChkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCkgKyAxLCAwKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgZGF5cyB0byBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1EYXlzIHRoZSBkaWZmZXJlbmNlIGluIGRheXNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGREYXlzID0gKF9kYXRlLCBudW1EYXlzKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcbiAgbmV3RGF0ZS5zZXREYXRlKG5ld0RhdGUuZ2V0RGF0ZSgpICsgbnVtRGF5cyk7XHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU3VidHJhY3QgZGF5cyBmcm9tIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bURheXMgdGhlIGRpZmZlcmVuY2UgaW4gZGF5c1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1YkRheXMgPSAoX2RhdGUsIG51bURheXMpID0+IGFkZERheXMoX2RhdGUsIC1udW1EYXlzKTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgd2Vla3MgdG8gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGRXZWVrcyA9IChfZGF0ZSwgbnVtV2Vla3MpID0+IGFkZERheXMoX2RhdGUsIG51bVdlZWtzICogNyk7XHJcblxyXG4vKipcclxuICogU3VidHJhY3Qgd2Vla3MgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1XZWVrcyB0aGUgZGlmZmVyZW5jZSBpbiB3ZWVrc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1YldlZWtzID0gKF9kYXRlLCBudW1XZWVrcykgPT4gYWRkV2Vla3MoX2RhdGUsIC1udW1XZWVrcyk7XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSB3ZWVrIChNb25kYXkpXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3RhcnRPZldlZWsgPSAoX2RhdGUpID0+IHtcclxuICBsZXQgZGF5T2ZXZWVrID0gX2RhdGUuZ2V0RGF5KCktMTtcclxuICBpZihkYXlPZldlZWsgPT09IC0xKXtcclxuICAgIGRheU9mV2VlayA9IDY7XHJcbiAgfVxyXG4gIHJldHVybiBzdWJEYXlzKF9kYXRlLCBkYXlPZldlZWspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHdlZWsgKFN1bmRheSlcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVdlZWtzIHRoZSBkaWZmZXJlbmNlIGluIHdlZWtzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgZW5kT2ZXZWVrID0gKF9kYXRlKSA9PiB7XHJcbiAgY29uc3QgZGF5T2ZXZWVrID0gX2RhdGUuZ2V0RGF5KCk7XHJcbiAgcmV0dXJuIGFkZERheXMoX2RhdGUsIDcgLSBkYXlPZldlZWspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBtb250aHMgdG8gZGF0ZSBhbmQga2VlcCBkYXRlIHdpdGhpbiBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtTW9udGhzIHRoZSBkaWZmZXJlbmNlIGluIG1vbnRoc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkZE1vbnRocyA9IChfZGF0ZSwgbnVtTW9udGhzKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcblxyXG4gIGNvbnN0IGRhdGVNb250aCA9IChuZXdEYXRlLmdldE1vbnRoKCkgKyAxMiArIG51bU1vbnRocykgJSAxMjtcclxuICBuZXdEYXRlLnNldE1vbnRoKG5ld0RhdGUuZ2V0TW9udGgoKSArIG51bU1vbnRocyk7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBkYXRlTW9udGgpO1xyXG5cclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTdWJ0cmFjdCBtb250aHMgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1Nb250aHMgdGhlIGRpZmZlcmVuY2UgaW4gbW9udGhzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3ViTW9udGhzID0gKF9kYXRlLCBudW1Nb250aHMpID0+IGFkZE1vbnRocyhfZGF0ZSwgLW51bU1vbnRocyk7XHJcblxyXG4vKipcclxuICogQWRkIHllYXJzIHRvIGRhdGUgYW5kIGtlZXAgZGF0ZSB3aXRoaW4gbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVllYXJzIHRoZSBkaWZmZXJlbmNlIGluIHllYXJzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkWWVhcnMgPSAoX2RhdGUsIG51bVllYXJzKSA9PiBhZGRNb250aHMoX2RhdGUsIG51bVllYXJzICogMTIpO1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IHllYXJzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtWWVhcnMgdGhlIGRpZmZlcmVuY2UgaW4geWVhcnNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJZZWFycyA9IChfZGF0ZSwgbnVtWWVhcnMpID0+IGFkZFllYXJzKF9kYXRlLCAtbnVtWWVhcnMpO1xyXG5cclxuLyoqXHJcbiAqIFNldCBtb250aHMgb2YgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGggemVyby1pbmRleGVkIG1vbnRoIHRvIHNldFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHNldE1vbnRoID0gKF9kYXRlLCBtb250aCkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG5cclxuICBuZXdEYXRlLnNldE1vbnRoKG1vbnRoKTtcclxuICBrZWVwRGF0ZVdpdGhpbk1vbnRoKG5ld0RhdGUsIG1vbnRoKTtcclxuXHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IHllYXIgb2YgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0geWVhciB0aGUgeWVhciB0byBzZXRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXRZZWFyID0gKF9kYXRlLCB5ZWFyKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoID0gbmV3RGF0ZS5nZXRNb250aCgpO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoeWVhcik7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBtb250aCk7XHJcblxyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0aGUgZWFybGllc3QgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGVhcmxpZXN0IGRhdGVcclxuICovXHJcbmNvbnN0IG1pbiA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICBsZXQgbmV3RGF0ZSA9IGRhdGVBO1xyXG5cclxuICBpZiAoZGF0ZUIgPCBkYXRlQSkge1xyXG4gICAgbmV3RGF0ZSA9IGRhdGVCO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGxhdGVzdCBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgbGF0ZXN0IGRhdGVcclxuICovXHJcbmNvbnN0IG1heCA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICBsZXQgbmV3RGF0ZSA9IGRhdGVBO1xyXG5cclxuICBpZiAoZGF0ZUIgPiBkYXRlQSkge1xyXG4gICAgbmV3RGF0ZSA9IGRhdGVCO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIGluIHRoZSBzYW1lIHllYXJcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyBpbiB0aGUgc2FtZSB5ZWFyXHJcbiAqL1xyXG5jb25zdCBpc1NhbWVZZWFyID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIHJldHVybiBkYXRlQSAmJiBkYXRlQiAmJiBkYXRlQS5nZXRGdWxsWWVhcigpID09PSBkYXRlQi5nZXRGdWxsWWVhcigpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgaW4gdGhlIHNhbWUgbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyBpbiB0aGUgc2FtZSBtb250aFxyXG4gKi9cclxuY29uc3QgaXNTYW1lTW9udGggPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgcmV0dXJuIGlzU2FtZVllYXIoZGF0ZUEsIGRhdGVCKSAmJiBkYXRlQS5nZXRNb250aCgpID09PSBkYXRlQi5nZXRNb250aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgc2FtZSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgdGhlIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIHRoZSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyB0aGUgc2FtZSBkYXRlXHJcbiAqL1xyXG5jb25zdCBpc1NhbWVEYXkgPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgcmV0dXJuIGlzU2FtZU1vbnRoKGRhdGVBLCBkYXRlQikgJiYgZGF0ZUEuZ2V0RGF0ZSgpID09PSBkYXRlQi5nZXREYXRlKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogcmV0dXJuIGEgbmV3IGRhdGUgd2l0aGluIG1pbmltdW0gYW5kIG1heGltdW0gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBkYXRlIGJldHdlZW4gbWluIGFuZCBtYXhcclxuICovXHJcbmNvbnN0IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgbGV0IG5ld0RhdGUgPSBkYXRlO1xyXG5cclxuICBpZiAoZGF0ZSA8IG1pbkRhdGUpIHtcclxuICAgIG5ld0RhdGUgPSBtaW5EYXRlO1xyXG4gIH0gZWxzZSBpZiAobWF4RGF0ZSAmJiBkYXRlID4gbWF4RGF0ZSkge1xyXG4gICAgbmV3RGF0ZSA9IG1heERhdGU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IERhdGUobmV3RGF0ZS5nZXRUaW1lKCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGlzIHZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlcmUgYSBkYXkgd2l0aGluIHRoZSBtb250aCB3aXRoaW4gbWluIGFuZCBtYXggZGF0ZXNcclxuICovXHJcbmNvbnN0IGlzRGF0ZVdpdGhpbk1pbkFuZE1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PlxyXG4gIGRhdGUgPj0gbWluRGF0ZSAmJiAoIW1heERhdGUgfHwgZGF0ZSA8PSBtYXhEYXRlKTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBtb250aCBpcyBpbnZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlIG1vbnRoIG91dHNpZGUgbWluIG9yIG1heCBkYXRlc1xyXG4gKi9cclxuY29uc3QgaXNEYXRlc01vbnRoT3V0c2lkZU1pbk9yTWF4ID0gKGRhdGUsIG1pbkRhdGUsIG1heERhdGUpID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgbGFzdERheU9mTW9udGgoZGF0ZSkgPCBtaW5EYXRlIHx8IChtYXhEYXRlICYmIHN0YXJ0T2ZNb250aChkYXRlKSA+IG1heERhdGUpXHJcbiAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyB5ZWFyIGlzIGludmFsaWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBkYXRlIHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWluRGF0ZSBtaW5pbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcmV0dXJuIHtib29sZWFufSBpcyB0aGUgbW9udGggb3V0c2lkZSBtaW4gb3IgbWF4IGRhdGVzXHJcbiAqL1xyXG5jb25zdCBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIGxhc3REYXlPZk1vbnRoKHNldE1vbnRoKGRhdGUsIDExKSkgPCBtaW5EYXRlIHx8XHJcbiAgICAobWF4RGF0ZSAmJiBzdGFydE9mTW9udGgoc2V0TW9udGgoZGF0ZSwgMCkpID4gbWF4RGF0ZSlcclxuICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBhcnNlIGEgZGF0ZSB3aXRoIGZvcm1hdCBNLUQtWVlcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVTdHJpbmcgdGhlIGRhdGUgc3RyaW5nIHRvIHBhcnNlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlRm9ybWF0IHRoZSBmb3JtYXQgb2YgdGhlIGRhdGUgc3RyaW5nXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWRqdXN0RGF0ZSBzaG91bGQgdGhlIGRhdGUgYmUgYWRqdXN0ZWRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBwYXJzZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgcGFyc2VEYXRlU3RyaW5nID0gKFxyXG4gIGRhdGVTdHJpbmcsXHJcbiAgZGF0ZUZvcm1hdCA9IElOVEVSTkFMX0RBVEVfRk9STUFULFxyXG4gIGFkanVzdERhdGUgPSBmYWxzZVxyXG4pID0+IHtcclxuICBsZXQgZGF0ZTtcclxuICBsZXQgbW9udGg7XHJcbiAgbGV0IGRheTtcclxuICBsZXQgeWVhcjtcclxuICBsZXQgcGFyc2VkO1xyXG5cclxuICBpZiAoZGF0ZVN0cmluZykge1xyXG4gICAgbGV0IG1vbnRoU3RyLCBkYXlTdHIsIHllYXJTdHI7XHJcbiAgICBpZiAoZGF0ZUZvcm1hdCA9PT0gREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCkge1xyXG4gICAgICBbZGF5U3RyLCBtb250aFN0ciwgeWVhclN0cl0gPSBkYXRlU3RyaW5nLnNwbGl0KFwiL1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIFt5ZWFyU3RyLCBtb250aFN0ciwgZGF5U3RyXSA9IGRhdGVTdHJpbmcuc3BsaXQoXCItXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh5ZWFyU3RyKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KHllYXJTdHIsIDEwKTtcclxuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xyXG4gICAgICAgIHllYXIgPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIHllYXIgPSBNYXRoLm1heCgwLCB5ZWFyKTtcclxuICAgICAgICAgIGlmICh5ZWFyU3RyLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFllYXIgPSB0b2RheSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyU3R1YiA9XHJcbiAgICAgICAgICAgICAgY3VycmVudFllYXIgLSAoY3VycmVudFllYXIgJSAxMCAqKiB5ZWFyU3RyLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHllYXIgPSBjdXJyZW50WWVhclN0dWIgKyBwYXJzZWQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vbnRoU3RyKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KG1vbnRoU3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICBtb250aCA9IHBhcnNlZDtcclxuICAgICAgICBpZiAoYWRqdXN0RGF0ZSkge1xyXG4gICAgICAgICAgbW9udGggPSBNYXRoLm1heCgxLCBtb250aCk7XHJcbiAgICAgICAgICBtb250aCA9IE1hdGgubWluKDEyLCBtb250aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vbnRoICYmIGRheVN0ciAmJiB5ZWFyICE9IG51bGwpIHtcclxuICAgICAgcGFyc2VkID0gcGFyc2VJbnQoZGF5U3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICBkYXkgPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIGNvbnN0IGxhc3REYXlPZlRoZU1vbnRoID0gc2V0RGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgZGF5ID0gTWF0aC5tYXgoMSwgZGF5KTtcclxuICAgICAgICAgIGRheSA9IE1hdGgubWluKGxhc3REYXlPZlRoZU1vbnRoLCBkYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb250aCAmJiBkYXkgJiYgeWVhciAhPSBudWxsKSB7XHJcbiAgICAgIGRhdGUgPSBzZXREYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZvcm1hdCBhIGRhdGUgdG8gZm9ybWF0IE1NLURELVlZWVlcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIHRoZSBkYXRlIHRvIGZvcm1hdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZUZvcm1hdCB0aGUgZm9ybWF0IG9mIHRoZSBkYXRlIHN0cmluZ1xyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZm9ybWF0dGVkIGRhdGUgc3RyaW5nXHJcbiAqL1xyXG5jb25zdCBmb3JtYXREYXRlID0gKGRhdGUsIGRhdGVGb3JtYXQgPSBJTlRFUk5BTF9EQVRFX0ZPUk1BVCkgPT4ge1xyXG4gIGNvbnN0IHBhZFplcm9zID0gKHZhbHVlLCBsZW5ndGgpID0+IHtcclxuICAgIHJldHVybiBgMDAwMCR7dmFsdWV9YC5zbGljZSgtbGVuZ3RoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XHJcbiAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuXHJcbiAgaWYgKGRhdGVGb3JtYXQgPT09IERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQpIHtcclxuICAgIHJldHVybiBbcGFkWmVyb3MoZGF5LCAyKSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyh5ZWFyLCA0KV0uam9pbihcIi9cIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gW3BhZFplcm9zKHllYXIsIDQpLCBwYWRaZXJvcyhtb250aCwgMiksIHBhZFplcm9zKGRheSwgMildLmpvaW4oXCItXCIpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBEYXRlIE1hbmlwdWxhdGlvbiBGdW5jdGlvbnNcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBncmlkIHN0cmluZyBmcm9tIGFuIGFycmF5IG9mIGh0bWwgc3RyaW5nc1xyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBodG1sQXJyYXkgdGhlIGFycmF5IG9mIGh0bWwgaXRlbXNcclxuICogQHBhcmFtIHtudW1iZXJ9IHJvd1NpemUgdGhlIGxlbmd0aCBvZiBhIHJvd1xyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZ3JpZCBzdHJpbmdcclxuICovXHJcbmNvbnN0IGxpc3RUb0dyaWRIdG1sID0gKGh0bWxBcnJheSwgcm93U2l6ZSkgPT4ge1xyXG4gIGNvbnN0IGdyaWQgPSBbXTtcclxuICBsZXQgcm93ID0gW107XHJcblxyXG4gIGxldCBpID0gMDtcclxuICB3aGlsZSAoaSA8IGh0bWxBcnJheS5sZW5ndGgpIHtcclxuICAgIHJvdyA9IFtdO1xyXG4gICAgd2hpbGUgKGkgPCBodG1sQXJyYXkubGVuZ3RoICYmIHJvdy5sZW5ndGggPCByb3dTaXplKSB7XHJcbiAgICAgIHJvdy5wdXNoKGA8dGQ+JHtodG1sQXJyYXlbaV19PC90ZD5gKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgZ3JpZC5wdXNoKGA8dHI+JHtyb3cuam9pbihcIlwiKX08L3RyPmApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGdyaWQuam9pbihcIlwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBzZXQgdGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50IGFuZCBkaXNwYXRjaCBhIGNoYW5nZSBldmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGVsIFRoZSBlbGVtZW50IHRvIHVwZGF0ZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgY2hhbmdlRWxlbWVudFZhbHVlID0gKGVsLCB2YWx1ZSA9IFwiXCIpID0+IHtcclxuICBjb25zdCBlbGVtZW50VG9DaGFuZ2UgPSBlbDtcclxuICBlbGVtZW50VG9DaGFuZ2UudmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJjaGFuZ2VcIiwge1xyXG4gICAgYnViYmxlczogdHJ1ZSxcclxuICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICBkZXRhaWw6IHsgdmFsdWUgfSxcclxuICB9KTtcclxuICBlbGVtZW50VG9DaGFuZ2UuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbn07XHJcblxyXG4vKipcclxuICogVGhlIHByb3BlcnRpZXMgYW5kIGVsZW1lbnRzIHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIuXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IERhdGVQaWNrZXJDb250ZXh0XHJcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IGNhbGVuZGFyRWxcclxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZGF0ZVBpY2tlckVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTElucHV0RWxlbWVudH0gaW50ZXJuYWxJbnB1dEVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTElucHV0RWxlbWVudH0gZXh0ZXJuYWxJbnB1dEVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IHN0YXR1c0VsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTERpdkVsZW1lbnR9IGZpcnN0WWVhckNodW5rRWxcclxuICogQHByb3BlcnR5IHtEYXRlfSBjYWxlbmRhckRhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBtaW5EYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gbWF4RGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IHNlbGVjdGVkRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IHJhbmdlRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IGRlZmF1bHREYXRlXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEdldCBhbiBvYmplY3Qgb2YgdGhlIHByb3BlcnRpZXMgYW5kIGVsZW1lbnRzIGJlbG9uZ2luZyBkaXJlY3RseSB0byB0aGUgZ2l2ZW5cclxuICogZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0aGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyXHJcbiAqIEByZXR1cm5zIHtEYXRlUGlja2VyQ29udGV4dH0gZWxlbWVudHNcclxuICovXHJcbmNvbnN0IGdldERhdGVQaWNrZXJDb250ZXh0ID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgZGF0ZVBpY2tlckVsID0gZWwuY2xvc2VzdChEQVRFX1BJQ0tFUik7XHJcblxyXG4gIGlmICghZGF0ZVBpY2tlckVsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgaXMgbWlzc2luZyBvdXRlciAke0RBVEVfUElDS0VSfWApO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgaW50ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVFxyXG4gICk7XHJcbiAgY29uc3QgZXh0ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICBEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVFxyXG4gICk7XHJcbiAgY29uc3QgY2FsZW5kYXJFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX0NBTEVOREFSKTtcclxuICBjb25zdCB0b2dnbGVCdG5FbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKERBVEVfUElDS0VSX0JVVFRPTik7XHJcbiAgY29uc3Qgc3RhdHVzRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9TVEFUVVMpO1xyXG4gIGNvbnN0IGZpcnN0WWVhckNodW5rRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSKTtcclxuXHJcbiAgY29uc3QgaW5wdXREYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnZhbHVlLFxyXG4gICAgREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCxcclxuICAgIHRydWVcclxuICApO1xyXG4gIGNvbnN0IHNlbGVjdGVkRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhpbnRlcm5hbElucHV0RWwudmFsdWUpO1xyXG5cclxuICBjb25zdCBjYWxlbmRhckRhdGUgPSBwYXJzZURhdGVTdHJpbmcoY2FsZW5kYXJFbC5kYXRhc2V0LnZhbHVlKTtcclxuICBjb25zdCBtaW5EYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1pbkRhdGUpO1xyXG4gIGNvbnN0IG1heERhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQubWF4RGF0ZSk7XHJcbiAgY29uc3QgcmFuZ2VEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0LnJhbmdlRGF0ZSk7XHJcbiAgY29uc3QgZGVmYXVsdERhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVBpY2tlckVsLmRhdGFzZXQuZGVmYXVsdERhdGUpO1xyXG5cclxuICBpZiAobWluRGF0ZSAmJiBtYXhEYXRlICYmIG1pbkRhdGUgPiBtYXhEYXRlKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaW5pbXVtIGRhdGUgY2Fubm90IGJlIGFmdGVyIG1heGltdW0gZGF0ZVwiKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBjYWxlbmRhckRhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgdG9nZ2xlQnRuRWwsXHJcbiAgICBzZWxlY3RlZERhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gICAgZmlyc3RZZWFyQ2h1bmtFbCxcclxuICAgIGRhdGVQaWNrZXJFbCxcclxuICAgIGlucHV0RGF0ZSxcclxuICAgIGludGVybmFsSW5wdXRFbCxcclxuICAgIGV4dGVybmFsSW5wdXRFbCxcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICByYW5nZURhdGUsXHJcbiAgICBkZWZhdWx0RGF0ZSxcclxuICAgIHN0YXR1c0VsLFxyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogRGlzYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc2FibGUgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGV4dGVybmFsSW5wdXRFbCwgdG9nZ2xlQnRuRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgdG9nZ2xlQnRuRWwuZGlzYWJsZWQgPSB0cnVlO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IHRydWU7XHJcbn07XHJcblxyXG4vKipcclxuICogRW5hYmxlIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZW5hYmxlID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIHRvZ2dsZUJ0bkVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIHRvZ2dsZUJ0bkVsLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmRpc2FibGVkID0gZmFsc2U7XHJcbn07XHJcblxyXG4vLyAjcmVnaW9uIFZhbGlkYXRpb25cclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZSB0aGUgdmFsdWUgaW4gdGhlIGlucHV0IGFzIGEgdmFsaWQgZGF0ZSBvZiBmb3JtYXQgTS9EL1lZWVlcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaXNEYXRlSW5wdXRJbnZhbGlkID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgY29uc3QgZGF0ZVN0cmluZyA9IGV4dGVybmFsSW5wdXRFbC52YWx1ZTtcclxuICBsZXQgaXNJbnZhbGlkID0gZmFsc2U7XHJcblxyXG4gIGlmIChkYXRlU3RyaW5nKSB7XHJcbiAgICBpc0ludmFsaWQgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IGRhdGVTdHJpbmdQYXJ0cyA9IGRhdGVTdHJpbmcuc3BsaXQoXCIvXCIpO1xyXG4gICAgY29uc3QgW2RheSwgbW9udGgsIHllYXJdID0gZGF0ZVN0cmluZ1BhcnRzLm1hcCgoc3RyKSA9PiB7XHJcbiAgICAgIGxldCB2YWx1ZTtcclxuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VJbnQoc3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHZhbHVlID0gcGFyc2VkO1xyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAobW9udGggJiYgZGF5ICYmIHllYXIgIT0gbnVsbCkge1xyXG4gICAgICBjb25zdCBjaGVja0RhdGUgPSBzZXREYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KTtcclxuXHJcbiAgICAgIGlmIChcclxuICAgICAgICBjaGVja0RhdGUuZ2V0TW9udGgoKSA9PT0gbW9udGggLSAxICYmXHJcbiAgICAgICAgY2hlY2tEYXRlLmdldERhdGUoKSA9PT0gZGF5ICYmXHJcbiAgICAgICAgY2hlY2tEYXRlLmdldEZ1bGxZZWFyKCkgPT09IHllYXIgJiZcclxuICAgICAgICBkYXRlU3RyaW5nUGFydHNbMl0ubGVuZ3RoID09PSA0ICYmXHJcbiAgICAgICAgaXNEYXRlV2l0aGluTWluQW5kTWF4KGNoZWNrRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgaXNJbnZhbGlkID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBpc0ludmFsaWQ7XHJcbn07XHJcblxyXG4vKipcclxuICogVmFsaWRhdGUgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGRhdGUgb2YgZm9ybWF0IE0vRC9ZWVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHZhbGlkYXRlRGF0ZUlucHV0ID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBjb25zdCBpc0ludmFsaWQgPSBpc0RhdGVJbnB1dEludmFsaWQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuXHJcbiAgaWYgKGlzSW52YWxpZCAmJiAhZXh0ZXJuYWxJbnB1dEVsLnZhbGlkYXRpb25NZXNzYWdlKSB7XHJcbiAgICBleHRlcm5hbElucHV0RWwuc2V0Q3VzdG9tVmFsaWRpdHkoVkFMSURBVElPTl9NRVNTQUdFKTtcclxuICB9XHJcblxyXG4gIGlmICghaXNJbnZhbGlkICYmIGV4dGVybmFsSW5wdXRFbC52YWxpZGF0aW9uTWVzc2FnZSA9PT0gVkFMSURBVElPTl9NRVNTQUdFKSB7XHJcbiAgICBleHRlcm5hbElucHV0RWwuc2V0Q3VzdG9tVmFsaWRpdHkoXCJcIik7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBWYWxpZGF0aW9uXHJcblxyXG4vKipcclxuICogRW5hYmxlIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgcmVjb25jaWxlSW5wdXRWYWx1ZXMgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGludGVybmFsSW5wdXRFbCwgaW5wdXREYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgbGV0IG5ld1ZhbHVlID0gXCJcIjtcclxuXHJcbiAgaWYgKGlucHV0RGF0ZSAmJiAhaXNEYXRlSW5wdXRJbnZhbGlkKGVsKSkge1xyXG4gICAgbmV3VmFsdWUgPSBmb3JtYXREYXRlKGlucHV0RGF0ZSk7XHJcbiAgfVxyXG5cclxuICBpZiAoaW50ZXJuYWxJbnB1dEVsLnZhbHVlICE9PSBuZXdWYWx1ZSkge1xyXG4gICAgY2hhbmdlRWxlbWVudFZhbHVlKGludGVybmFsSW5wdXRFbCwgbmV3VmFsdWUpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZWxlY3QgdGhlIHZhbHVlIG9mIHRoZSBkYXRlIHBpY2tlciBpbnB1dHMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVTdHJpbmcgVGhlIGRhdGUgc3RyaW5nIHRvIHVwZGF0ZSBpbiBZWVlZLU1NLUREIGZvcm1hdFxyXG4gKi9cclxuY29uc3Qgc2V0Q2FsZW5kYXJWYWx1ZSA9IChlbCwgZGF0ZVN0cmluZykgPT4ge1xyXG4gIGNvbnN0IHBhcnNlZERhdGUgPSBwYXJzZURhdGVTdHJpbmcoZGF0ZVN0cmluZyk7XHJcblxyXG4gIGlmIChwYXJzZWREYXRlKSB7XHJcbiAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShwYXJzZWREYXRlLCBERUZBVUxUX0VYVEVSTkFMX0RBVEVfRk9STUFUKTtcclxuXHJcbiAgICBjb25zdCB7XHJcbiAgICAgIGRhdGVQaWNrZXJFbCxcclxuICAgICAgaW50ZXJuYWxJbnB1dEVsLFxyXG4gICAgICBleHRlcm5hbElucHV0RWwsXHJcbiAgICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShpbnRlcm5hbElucHV0RWwsIGRhdGVTdHJpbmcpO1xyXG4gICAgY2hhbmdlRWxlbWVudFZhbHVlKGV4dGVybmFsSW5wdXRFbCwgZm9ybWF0dGVkRGF0ZSk7XHJcblxyXG4gICAgdmFsaWRhdGVEYXRlSW5wdXQoZGF0ZVBpY2tlckVsKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogRW5oYW5jZSBhbiBpbnB1dCB3aXRoIHRoZSBkYXRlIHBpY2tlciBlbGVtZW50c1xyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBUaGUgaW5pdGlhbCB3cmFwcGluZyBlbGVtZW50IG9mIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGVuaGFuY2VEYXRlUGlja2VyID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgZGF0ZVBpY2tlckVsID0gZWwuY2xvc2VzdChEQVRFX1BJQ0tFUik7XHJcbiAgY29uc3QgZGVmYXVsdFZhbHVlID0gZGF0ZVBpY2tlckVsLmRhdGFzZXQuZGVmYXVsdFZhbHVlO1xyXG5cclxuICBjb25zdCBpbnRlcm5hbElucHV0RWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihgaW5wdXRgKTtcclxuXHJcbiAgaWYgKCFpbnRlcm5hbElucHV0RWwpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgJHtEQVRFX1BJQ0tFUn0gaXMgbWlzc2luZyBpbm5lciBpbnB1dGApO1xyXG4gIH1cclxuXHJcblxyXG4gIGNvbnN0IG1pbkRhdGUgPSBwYXJzZURhdGVTdHJpbmcoXHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlIHx8IGludGVybmFsSW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtaW5cIilcclxuICApO1xyXG4gIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1pbkRhdGUgPSBtaW5EYXRlXHJcbiAgICA/IGZvcm1hdERhdGUobWluRGF0ZSlcclxuICAgIDogREVGQVVMVF9NSU5fREFURTtcclxuXHJcbiAgY29uc3QgbWF4RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhcclxuICAgIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGUgfHwgaW50ZXJuYWxJbnB1dEVsLmdldEF0dHJpYnV0ZShcIm1heFwiKVxyXG4gICk7XHJcbiAgaWYgKG1heERhdGUpIHtcclxuICAgIGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGUgPSBmb3JtYXREYXRlKG1heERhdGUpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY2FsZW5kYXJXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICBjYWxlbmRhcldyYXBwZXIuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9XUkFQUEVSX0NMQVNTKTtcclxuICBjYWxlbmRhcldyYXBwZXIudGFiSW5kZXggPSBcIi0xXCI7XHJcblxyXG4gIGNvbnN0IGV4dGVybmFsSW5wdXRFbCA9IGludGVybmFsSW5wdXRFbC5jbG9uZU5vZGUoKTtcclxuICBleHRlcm5hbElucHV0RWwuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF9DTEFTUyk7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLnR5cGUgPSBcInRleHRcIjtcclxuICBleHRlcm5hbElucHV0RWwubmFtZSA9IFwiXCI7XHJcblxyXG4gIGNhbGVuZGFyV3JhcHBlci5hcHBlbmRDaGlsZChleHRlcm5hbElucHV0RWwpO1xyXG4gIGNhbGVuZGFyV3JhcHBlci5pbnNlcnRBZGphY2VudEhUTUwoXHJcbiAgICBcImJlZm9yZWVuZFwiLFxyXG4gICAgW1xyXG4gICAgICBgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCIke0RBVEVfUElDS0VSX0JVVFRPTl9DTEFTU31cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtbGFiZWw9XCLDhWJuIGthbGVuZGVyXCI+Jm5ic3A7PC9idXR0b24+YCxcclxuICAgICAgYDxkaXYgY2xhc3M9XCIke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfVwiIHJvbGU9XCJkaWFsb2dcIiBhcmlhLW1vZGFsPVwidHJ1ZVwiIGhpZGRlbj48L2Rpdj5gLFxyXG4gICAgICBgPGRpdiBjbGFzcz1cInNyLW9ubHkgJHtEQVRFX1BJQ0tFUl9TVEFUVVNfQ0xBU1N9XCIgcm9sZT1cInN0YXR1c1wiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPjwvZGl2PmAsXHJcbiAgICBdLmpvaW4oXCJcIilcclxuICApO1xyXG5cclxuICBpbnRlcm5hbElucHV0RWwuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xyXG4gIGludGVybmFsSW5wdXRFbC5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xyXG4gIGludGVybmFsSW5wdXRFbC5jbGFzc0xpc3QuYWRkKFxyXG4gICAgXCJzci1vbmx5XCIsXHJcbiAgICBEQVRFX1BJQ0tFUl9JTlRFUk5BTF9JTlBVVF9DTEFTU1xyXG4gICk7XHJcbiAgaW50ZXJuYWxJbnB1dEVsLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcclxuICBpbnRlcm5hbElucHV0RWwucmVxdWlyZWQgPSBmYWxzZTtcclxuXHJcbiAgZGF0ZVBpY2tlckVsLmFwcGVuZENoaWxkKGNhbGVuZGFyV3JhcHBlcik7XHJcbiAgZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfSU5JVElBTElaRURfQ0xBU1MpO1xyXG5cclxuICBpZiAoZGVmYXVsdFZhbHVlKSB7XHJcbiAgICBzZXRDYWxlbmRhclZhbHVlKGRhdGVQaWNrZXJFbCwgZGVmYXVsdFZhbHVlKTtcclxuICB9XHJcblxyXG4gIGlmIChpbnRlcm5hbElucHV0RWwuZGlzYWJsZWQpIHtcclxuICAgIGRpc2FibGUoZGF0ZVBpY2tlckVsKTtcclxuICAgIGludGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIH1cclxuICBcclxuICBpZiAoZXh0ZXJuYWxJbnB1dEVsLnZhbHVlKSB7XHJcbiAgICB2YWxpZGF0ZURhdGVJbnB1dChleHRlcm5hbElucHV0RWwpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBEYXRlIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vKipcclxuICogcmVuZGVyIHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlVG9EaXNwbGF5IGEgZGF0ZSB0byByZW5kZXIgb24gdGhlIGNhbGVuZGFyXHJcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gYSByZWZlcmVuY2UgdG8gdGhlIG5ldyBjYWxlbmRhciBlbGVtZW50XHJcbiAqL1xyXG5jb25zdCByZW5kZXJDYWxlbmRhciA9IChlbCwgX2RhdGVUb0Rpc3BsYXkpID0+IHtcclxuICBjb25zdCB7XHJcbiAgICBkYXRlUGlja2VyRWwsXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBzZWxlY3RlZERhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIHJhbmdlRGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGNvbnN0IHRvZGF5c0RhdGUgPSB0b2RheSgpO1xyXG4gIGxldCBkYXRlVG9EaXNwbGF5ID0gX2RhdGVUb0Rpc3BsYXkgfHwgdG9kYXlzRGF0ZTtcclxuXHJcbiAgY29uc3QgY2FsZW5kYXJXYXNIaWRkZW4gPSBjYWxlbmRhckVsLmhpZGRlbjtcclxuXHJcbiAgY29uc3QgZm9jdXNlZERhdGUgPSBhZGREYXlzKGRhdGVUb0Rpc3BsYXksIDApO1xyXG4gIGNvbnN0IGZvY3VzZWRNb250aCA9IGRhdGVUb0Rpc3BsYXkuZ2V0TW9udGgoKTtcclxuICBjb25zdCBmb2N1c2VkWWVhciA9IGRhdGVUb0Rpc3BsYXkuZ2V0RnVsbFllYXIoKTtcclxuXHJcbiAgY29uc3QgcHJldk1vbnRoID0gc3ViTW9udGhzKGRhdGVUb0Rpc3BsYXksIDEpO1xyXG4gIGNvbnN0IG5leHRNb250aCA9IGFkZE1vbnRocyhkYXRlVG9EaXNwbGF5LCAxKTtcclxuXHJcbiAgY29uc3QgY3VycmVudEZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKGRhdGVUb0Rpc3BsYXkpO1xyXG5cclxuICBjb25zdCBmaXJzdE9mTW9udGggPSBzdGFydE9mTW9udGgoZGF0ZVRvRGlzcGxheSk7XHJcbiAgY29uc3QgcHJldkJ1dHRvbnNEaXNhYmxlZCA9IGlzU2FtZU1vbnRoKGRhdGVUb0Rpc3BsYXksIG1pbkRhdGUpO1xyXG4gIGNvbnN0IG5leHRCdXR0b25zRGlzYWJsZWQgPSBpc1NhbWVNb250aChkYXRlVG9EaXNwbGF5LCBtYXhEYXRlKTtcclxuXHJcbiAgY29uc3QgcmFuZ2VDb25jbHVzaW9uRGF0ZSA9IHNlbGVjdGVkRGF0ZSB8fCBkYXRlVG9EaXNwbGF5O1xyXG4gIGNvbnN0IHJhbmdlU3RhcnREYXRlID0gcmFuZ2VEYXRlICYmIG1pbihyYW5nZUNvbmNsdXNpb25EYXRlLCByYW5nZURhdGUpO1xyXG4gIGNvbnN0IHJhbmdlRW5kRGF0ZSA9IHJhbmdlRGF0ZSAmJiBtYXgocmFuZ2VDb25jbHVzaW9uRGF0ZSwgcmFuZ2VEYXRlKTtcclxuXHJcbiAgY29uc3Qgd2l0aGluUmFuZ2VTdGFydERhdGUgPSByYW5nZURhdGUgJiYgYWRkRGF5cyhyYW5nZVN0YXJ0RGF0ZSwgMSk7XHJcbiAgY29uc3Qgd2l0aGluUmFuZ2VFbmREYXRlID0gcmFuZ2VEYXRlICYmIHN1YkRheXMocmFuZ2VFbmREYXRlLCAxKTtcclxuXHJcbiAgY29uc3QgbW9udGhMYWJlbCA9IE1PTlRIX0xBQkVMU1tmb2N1c2VkTW9udGhdO1xyXG5cclxuICBjb25zdCBnZW5lcmF0ZURhdGVIdG1sID0gKGRhdGVUb1JlbmRlcikgPT4ge1xyXG4gICAgY29uc3QgY2xhc3NlcyA9IFtDQUxFTkRBUl9EQVRFX0NMQVNTXTtcclxuICAgIGNvbnN0IGRheSA9IGRhdGVUb1JlbmRlci5nZXREYXRlKCk7XHJcbiAgICBjb25zdCBtb250aCA9IGRhdGVUb1JlbmRlci5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgeWVhciA9IGRhdGVUb1JlbmRlci5nZXRGdWxsWWVhcigpO1xyXG4gICAgY29uc3QgZGF5T2ZXZWVrID0gZGF0ZVRvUmVuZGVyLmdldERheSgpO1xyXG5cclxuICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKGRhdGVUb1JlbmRlcik7XHJcblxyXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xyXG5cclxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSAhaXNEYXRlV2l0aGluTWluQW5kTWF4KGRhdGVUb1JlbmRlciwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgc2VsZWN0ZWREYXRlKTtcclxuXHJcbiAgICBpZiAoaXNTYW1lTW9udGgoZGF0ZVRvUmVuZGVyLCBwcmV2TW9udGgpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1BSRVZJT1VTX01PTlRIX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTYW1lTW9udGgoZGF0ZVRvUmVuZGVyLCBmb2N1c2VkRGF0ZSkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgbmV4dE1vbnRoKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9ORVhUX01PTlRIX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTZWxlY3RlZCkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9TRUxFQ1RFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHRvZGF5c0RhdGUpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1RPREFZX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmFuZ2VEYXRlKSB7XHJcbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZURhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9DTEFTUyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZVN0YXJ0RGF0ZSkpIHtcclxuICAgICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX1NUQVJUX0NMQVNTKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHJhbmdlRW5kRGF0ZSkpIHtcclxuICAgICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0VORF9DTEFTUyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChcclxuICAgICAgICBpc0RhdGVXaXRoaW5NaW5BbmRNYXgoXHJcbiAgICAgICAgICBkYXRlVG9SZW5kZXIsXHJcbiAgICAgICAgICB3aXRoaW5SYW5nZVN0YXJ0RGF0ZSxcclxuICAgICAgICAgIHdpdGhpblJhbmdlRW5kRGF0ZVxyXG4gICAgICAgIClcclxuICAgICAgKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfV0lUSElOX1JBTkdFX0NMQVNTKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCBmb2N1c2VkRGF0ZSkpIHtcclxuICAgICAgdGFiaW5kZXggPSBcIjBcIjtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfRk9DVVNFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbW9udGhTdHIgPSBNT05USF9MQUJFTFNbbW9udGhdO1xyXG4gICAgY29uc3QgZGF5U3RyID0gREFZX09GX1dFRUtfTEFCRUxTW2RheU9mV2Vla107XHJcblxyXG4gICAgcmV0dXJuIGA8YnV0dG9uXHJcbiAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcclxuICAgICAgY2xhc3M9XCIke2NsYXNzZXMuam9pbihcIiBcIil9XCIgXHJcbiAgICAgIGRhdGEtZGF5PVwiJHtkYXl9XCIgXHJcbiAgICAgIGRhdGEtbW9udGg9XCIke21vbnRoICsgMX1cIiBcclxuICAgICAgZGF0YS15ZWFyPVwiJHt5ZWFyfVwiIFxyXG4gICAgICBkYXRhLXZhbHVlPVwiJHtmb3JtYXR0ZWREYXRlfVwiXHJcbiAgICAgIGFyaWEtbGFiZWw9XCIke2RheVN0cn0gZGVuICR7ZGF5fSAke21vbnRoU3RyfSAke3llYXJ9IFwiXHJcbiAgICAgIGFyaWEtc2VsZWN0ZWQ9XCIke2lzU2VsZWN0ZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIn1cIlxyXG4gICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICA+JHtkYXl9PC9idXR0b24+YDtcclxuICB9O1xyXG4gIC8vIHNldCBkYXRlIHRvIGZpcnN0IHJlbmRlcmVkIGRheVxyXG4gIGRhdGVUb0Rpc3BsYXkgPSBzdGFydE9mV2VlayhmaXJzdE9mTW9udGgpO1xyXG5cclxuICBjb25zdCBkYXlzID0gW107XHJcblxyXG4gIHdoaWxlIChcclxuICAgIGRheXMubGVuZ3RoIDwgMjggfHxcclxuICAgIGRhdGVUb0Rpc3BsYXkuZ2V0TW9udGgoKSA9PT0gZm9jdXNlZE1vbnRoIHx8XHJcbiAgICBkYXlzLmxlbmd0aCAlIDcgIT09IDBcclxuICApIHtcclxuICAgIGRheXMucHVzaChnZW5lcmF0ZURhdGVIdG1sKGRhdGVUb0Rpc3BsYXkpKTtcclxuICAgIGRhdGVUb0Rpc3BsYXkgPSBhZGREYXlzKGRhdGVUb0Rpc3BsYXksIDEpOyAgICBcclxuICB9XHJcbiAgY29uc3QgZGF0ZXNIdG1sID0gbGlzdFRvR3JpZEh0bWwoZGF5cywgNyk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gY2FsZW5kYXJFbC5jbG9uZU5vZGUoKTtcclxuICBuZXdDYWxlbmRhci5kYXRhc2V0LnZhbHVlID0gY3VycmVudEZvcm1hdHRlZERhdGU7XHJcbiAgbmV3Q2FsZW5kYXIuc3R5bGUudG9wID0gYCR7ZGF0ZVBpY2tlckVsLm9mZnNldEhlaWdodH1weGA7XHJcbiAgbmV3Q2FsZW5kYXIuaGlkZGVuID0gZmFsc2U7XHJcbiAgbGV0IGNvbnRlbnQgPSBgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCIke0NBTEVOREFSX0RBVEVfUElDS0VSX0NMQVNTfVwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9ST1dfQ0xBU1N9XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgw6l0IMOlciB0aWxiYWdlXCJcclxuICAgICAgICAgICAgJHtwcmV2QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTfVwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJOYXZpZ8OpciDDqXQgw6VyIHRpbGJhZ2VcIlxyXG4gICAgICAgICAgICAke3ByZXZCdXR0b25zRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9NT05USF9MQUJFTF9DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OX0NMQVNTfVwiIGFyaWEtbGFiZWw9XCIke21vbnRoTGFiZWx9LiBWw6ZsZyBtw6VuZWQuXCJcclxuICAgICAgICAgID4ke21vbnRoTGFiZWx9PC9idXR0b24+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OX0NMQVNTfVwiIGFyaWEtbGFiZWw9XCIke2ZvY3VzZWRZZWFyfS4gVsOmbGcgw6VyLlwiXHJcbiAgICAgICAgICA+JHtmb2N1c2VkWWVhcn08L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX01PTlRIX0NMQVNTfVwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJOYXZpZ8OpciDDqW4gbcOlbmVkIGZyZW1cIlxyXG4gICAgICAgICAgICAke25leHRCdXR0b25zRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NMQVNTfVwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJOTmF2aWfDqXIgw6l0IMOlciBmcmVtXCJcclxuICAgICAgICAgICAgJHtuZXh0QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgPHRyPmA7XHJcbiAgZm9yKGxldCBkIGluIERBWV9PRl9XRUVLX0xBQkVMUyl7XHJcbiAgICBjb250ZW50ICs9IGA8dGggY2xhc3M9XCIke0NBTEVOREFSX0RBWV9PRl9XRUVLX0NMQVNTfVwiIHNjb3BlPVwiY29sXCIgYXJpYS1sYWJlbD1cIiR7REFZX09GX1dFRUtfTEFCRUxTW2RdfVwiPiR7REFZX09GX1dFRUtfTEFCRUxTW2RdLmNoYXJBdCgwKX08L3RoPmA7XHJcbiAgfVxyXG4gIGNvbnRlbnQgKz0gYDwvdHI+XHJcbiAgICAgICAgPC90aGVhZD5cclxuICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAke2RhdGVzSHRtbH1cclxuICAgICAgICA8L3Rib2R5PlxyXG4gICAgICA8L3RhYmxlPlxyXG4gICAgPC9kaXY+YDtcclxuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xyXG5cclxuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MpO1xyXG5cclxuICBjb25zdCBzdGF0dXNlcyA9IFtdO1xyXG5cclxuICBpZiAoaXNTYW1lRGF5KHNlbGVjdGVkRGF0ZSwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICBzdGF0dXNlcy5wdXNoKFwiU2VsZWN0ZWQgZGF0ZVwiKTtcclxuICB9XHJcblxyXG4gIGlmIChjYWxlbmRhcldhc0hpZGRlbikge1xyXG4gICAgc3RhdHVzZXMucHVzaChcclxuICAgICAgXCJEdSBrYW4gbmF2aWdlcmUgbWVsbGVtIGRhZ2UgdmVkIGF0IGJydWdlIGjDuGpyZSBvZyB2ZW5zdHJlIHBpbHRhc3RlciwgXCIsXHJcbiAgICAgIFwidWdlciB2ZWQgYXQgYnJ1Z2Ugb3Agb2cgbmVkIHBpbHRhc3RlciwgXCIsXHJcbiAgICAgIFwibcOlbmVkZXIgdmVkIHRhIGJydWdlIHBhZ2UgdXAgb2cgcGFnZSBkb3duIHRhc3Rlcm5lIFwiLFxyXG4gICAgICBcIm9nIMOlciB2ZWQgYXQgYXQgdGFzdGUgc2hpZnQgb2cgcGFnZSB1cCBlbGxlciBuZWQuXCIsXHJcbiAgICAgIFwiSG9tZSBvZyBlbmQgdGFzdGVuIG5hdmlnZXJlciB0aWwgc3RhcnQgZWxsZXIgc2x1dG5pbmcgYWYgZW4gdWdlLlwiXHJcbiAgICApO1xyXG4gICAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBcIlwiO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzdGF0dXNlcy5wdXNoKGAke21vbnRoTGFiZWx9ICR7Zm9jdXNlZFllYXJ9YCk7XHJcbiAgfVxyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gc3RhdHVzZXMuam9pbihcIi4gXCIpO1xyXG5cclxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5UHJldmlvdXNZZWFyID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gc3ViWWVhcnMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfUFJFVklPVVNfWUVBUik7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlQcmV2aW91c01vbnRoID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gc3ViTW9udGhzKGNhbGVuZGFyRGF0ZSwgMSk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX01PTlRIKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU5leHRNb250aCA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IGFkZE1vbnRocyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ORVhUX01PTlRIKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5TmV4dFllYXIgPSAoX2J1dHRvbkVsKSA9PiB7XHJcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIF9idXR0b25FbFxyXG4gICk7XHJcbiAgbGV0IGRhdGUgPSBhZGRZZWFycyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ORVhUX1lFQVIpO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBIaWRlIHRoZSBjYWxlbmRhciBvZiBhIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGlkZUNhbGVuZGFyID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGNhbGVuZGFyRWwsIHN0YXR1c0VsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGRhdGVQaWNrZXJFbC5jbGFzc0xpc3QucmVtb3ZlKERBVEVfUElDS0VSX0FDVElWRV9DTEFTUyk7XHJcbiAgY2FsZW5kYXJFbC5oaWRkZW4gPSB0cnVlO1xyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gXCJcIjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZWxlY3QgYSBkYXRlIHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBjYWxlbmRhckRhdGVFbCBBIGRhdGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3Qgc2VsZWN0RGF0ZSA9IChjYWxlbmRhckRhdGVFbCkgPT4ge1xyXG4gIGlmIChjYWxlbmRhckRhdGVFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCB7IGRhdGVQaWNrZXJFbCwgZXh0ZXJuYWxJbnB1dEVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGNhbGVuZGFyRGF0ZUVsXHJcbiAgKTtcclxuICBzZXRDYWxlbmRhclZhbHVlKGNhbGVuZGFyRGF0ZUVsLCBjYWxlbmRhckRhdGVFbC5kYXRhc2V0LnZhbHVlKTtcclxuICBoaWRlQ2FsZW5kYXIoZGF0ZVBpY2tlckVsKTtcclxuXHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogVG9nZ2xlIHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgdG9nZ2xlQ2FsZW5kYXIgPSAoZWwpID0+IHtcclxuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7XHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgaW5wdXREYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgICBkZWZhdWx0RGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBpZiAoY2FsZW5kYXJFbC5oaWRkZW4pIHtcclxuICAgIGNvbnN0IGRhdGVUb0Rpc3BsYXkgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoXHJcbiAgICAgIGlucHV0RGF0ZSB8fCBkZWZhdWx0RGF0ZSB8fCB0b2RheSgpLFxyXG4gICAgICBtaW5EYXRlLFxyXG4gICAgICBtYXhEYXRlXHJcbiAgICApO1xyXG4gICAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcclxuICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBoaWRlQ2FsZW5kYXIoZWwpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgdGhlIGNhbGVuZGFyIHdoZW4gdmlzaWJsZS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgYW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyXHJcbiAqL1xyXG5jb25zdCB1cGRhdGVDYWxlbmRhcklmVmlzaWJsZSA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgaW5wdXREYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgY29uc3QgY2FsZW5kYXJTaG93biA9ICFjYWxlbmRhckVsLmhpZGRlbjtcclxuXHJcbiAgaWYgKGNhbGVuZGFyU2hvd24gJiYgaW5wdXREYXRlKSB7XHJcbiAgICBjb25zdCBkYXRlVG9EaXNwbGF5ID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGlucHV0RGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIC0gRGF0ZSBTZWxlY3Rpb24gVmlld1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciAtIE1vbnRoIFNlbGVjdGlvbiBWaWV3XHJcbi8qKlxyXG4gKiBEaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuIGluIHRoZSBkYXRlIHBpY2tlci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU1vbnRoU2VsZWN0aW9uID0gKGVsLCBtb250aFRvRGlzcGxheSkgPT4ge1xyXG4gIGNvbnN0IHtcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBzdGF0dXNFbCxcclxuICAgIGNhbGVuZGFyRGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkTW9udGggPSBjYWxlbmRhckRhdGUuZ2V0TW9udGgoKTtcclxuICBjb25zdCBmb2N1c2VkTW9udGggPSBtb250aFRvRGlzcGxheSA9PSBudWxsID8gc2VsZWN0ZWRNb250aCA6IG1vbnRoVG9EaXNwbGF5O1xyXG5cclxuICBjb25zdCBtb250aHMgPSBNT05USF9MQUJFTFMubWFwKChtb250aCwgaW5kZXgpID0+IHtcclxuICAgIGNvbnN0IG1vbnRoVG9DaGVjayA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgaW5kZXgpO1xyXG5cclxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBpc0RhdGVzTW9udGhPdXRzaWRlTWluT3JNYXgoXHJcbiAgICAgIG1vbnRoVG9DaGVjayxcclxuICAgICAgbWluRGF0ZSxcclxuICAgICAgbWF4RGF0ZVxyXG4gICAgKTtcclxuXHJcbiAgICBsZXQgdGFiaW5kZXggPSBcIi0xXCI7XHJcblxyXG4gICAgY29uc3QgY2xhc3NlcyA9IFtDQUxFTkRBUl9NT05USF9DTEFTU107XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gaW5kZXggPT09IHNlbGVjdGVkTW9udGg7XHJcblxyXG4gICAgaWYgKGluZGV4ID09PSBmb2N1c2VkTW9udGgpIHtcclxuICAgICAgdGFiaW5kZXggPSBcIjBcIjtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9NT05USF9TRUxFQ1RFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGA8YnV0dG9uIFxyXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgIHRhYmluZGV4PVwiJHt0YWJpbmRleH1cIlxyXG4gICAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICAgIGRhdGEtdmFsdWU9XCIke2luZGV4fVwiXHJcbiAgICAgICAgZGF0YS1sYWJlbD1cIiR7bW9udGh9XCJcclxuICAgICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgID4ke21vbnRofTwvYnV0dG9uPmA7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoc0h0bWwgPSBgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCIke0NBTEVOREFSX01PTlRIX1BJQ0tFUl9DTEFTU31cIj5cclxuICAgIDx0YWJsZSBjbGFzcz1cIiR7Q0FMRU5EQVJfVEFCTEVfQ0xBU1N9XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICA8dGJvZHk+XHJcbiAgICAgICAgJHtsaXN0VG9HcmlkSHRtbChtb250aHMsIDMpfVxyXG4gICAgICA8L3Rib2R5PlxyXG4gICAgPC90YWJsZT5cclxuICA8L2Rpdj5gO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XHJcbiAgbmV3Q2FsZW5kYXIuaW5uZXJIVE1MID0gbW9udGhzSHRtbDtcclxuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcclxuXHJcbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBcIlNlbGVjdCBhIG1vbnRoLlwiO1xyXG5cclxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgbW9udGggaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gbW9udGhFbCBBbiBtb250aCBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBzZWxlY3RNb250aCA9IChtb250aEVsKSA9PiB7XHJcbiAgaWYgKG1vbnRoRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBtb250aEVsXHJcbiAgKTtcclxuICBjb25zdCBzZWxlY3RlZE1vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgbGV0IGRhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIHNlbGVjdGVkTW9udGgpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBNb250aCBTZWxlY3Rpb24gVmlld1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciAtIFllYXIgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8qKlxyXG4gKiBEaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4gaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyVG9EaXNwbGF5IHllYXIgdG8gZGlzcGxheSBpbiB5ZWFyIHNlbGVjdGlvblxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVllYXJTZWxlY3Rpb24gPSAoZWwsIHllYXJUb0Rpc3BsYXkpID0+IHtcclxuICBjb25zdCB7XHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBjYWxlbmRhckRhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBjYWxlbmRhckRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICBjb25zdCBmb2N1c2VkWWVhciA9IHllYXJUb0Rpc3BsYXkgPT0gbnVsbCA/IHNlbGVjdGVkWWVhciA6IHllYXJUb0Rpc3BsYXk7XHJcblxyXG4gIGxldCB5ZWFyVG9DaHVuayA9IGZvY3VzZWRZZWFyO1xyXG4gIHllYXJUb0NodW5rIC09IHllYXJUb0NodW5rICUgWUVBUl9DSFVOSztcclxuICB5ZWFyVG9DaHVuayA9IE1hdGgubWF4KDAsIHllYXJUb0NodW5rKTtcclxuXHJcbiAgY29uc3QgcHJldlllYXJDaHVua0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgeWVhclRvQ2h1bmsgLSAxKSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgbmV4dFllYXJDaHVua0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgeWVhclRvQ2h1bmsgKyBZRUFSX0NIVU5LKSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgeWVhcnMgPSBbXTtcclxuICBsZXQgeWVhckluZGV4ID0geWVhclRvQ2h1bms7XHJcbiAgd2hpbGUgKHllYXJzLmxlbmd0aCA8IFlFQVJfQ0hVTkspIHtcclxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heChcclxuICAgICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJJbmRleCksXHJcbiAgICAgIG1pbkRhdGUsXHJcbiAgICAgIG1heERhdGVcclxuICAgICk7XHJcblxyXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xyXG5cclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfWUVBUl9DTEFTU107XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0geWVhckluZGV4ID09PSBzZWxlY3RlZFllYXI7XHJcblxyXG4gICAgaWYgKHllYXJJbmRleCA9PT0gZm9jdXNlZFllYXIpIHtcclxuICAgICAgdGFiaW5kZXggPSBcIjBcIjtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX1lFQVJfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIHllYXJzLnB1c2goXHJcbiAgICAgIGA8YnV0dG9uIFxyXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgIHRhYmluZGV4PVwiJHt0YWJpbmRleH1cIlxyXG4gICAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICAgIGRhdGEtdmFsdWU9XCIke3llYXJJbmRleH1cIlxyXG4gICAgICAgIGFyaWEtc2VsZWN0ZWQ9XCIke2lzU2VsZWN0ZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIn1cIlxyXG4gICAgICAgICR7aXNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgPiR7eWVhckluZGV4fTwvYnV0dG9uPmBcclxuICAgICk7XHJcbiAgICB5ZWFySW5kZXggKz0gMTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHllYXJzSHRtbCA9IGxpc3RUb0dyaWRIdG1sKHllYXJzLCAzKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xyXG4gIG5ld0NhbGVuZGFyLmlubmVySFRNTCA9IGA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIiR7Q0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1N9XCI+XHJcbiAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTfVwiIFxyXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk5hdmlnw6lyICR7WUVBUl9DSFVOS30gw6VyIHRpbGJhZ2VcIlxyXG4gICAgICAgICAgICAgICAgJHtwcmV2WWVhckNodW5rRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjNcIj5cclxuICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgJHt5ZWFyc0h0bWx9XHJcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1N9XCIgXHJcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgJHtZRUFSX0NIVU5LfSDDpXIgZnJlbVwiXHJcbiAgICAgICAgICAgICAgICAke25leHRZZWFyQ2h1bmtEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICA8L3RyPlxyXG4gICAgICAgIDwvdGJvZHk+XHJcbiAgICAgIDwvdGFibGU+XHJcbiAgICA8L2Rpdj5gO1xyXG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xyXG5cclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IGBTaG93aW5nIHllYXJzICR7eWVhclRvQ2h1bmt9IHRvICR7XHJcbiAgICB5ZWFyVG9DaHVuayArIFlFQVJfQ0hVTksgLSAxXHJcbiAgfS4gU2VsZWN0IGEgeWVhci5gO1xyXG5cclxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBieSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5UHJldmlvdXNZZWFyQ2h1bmsgPSAoZWwpID0+IHtcclxuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgZWxcclxuICApO1xyXG4gIGNvbnN0IHllYXJFbCA9IGNhbGVuZGFyRWwucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpO1xyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC50ZXh0Q29udGVudCwgMTApO1xyXG5cclxuICBsZXQgYWRqdXN0ZWRZZWFyID0gc2VsZWN0ZWRZZWFyIC0gWUVBUl9DSFVOSztcclxuICBhZGp1c3RlZFllYXIgPSBNYXRoLm1heCgwLCBhZGp1c3RlZFllYXIpO1xyXG5cclxuICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XHJcbiAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxyXG4gICk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgYnkgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU5leHRZZWFyQ2h1bmsgPSAoZWwpID0+IHtcclxuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgZWxcclxuICApO1xyXG4gIGNvbnN0IHllYXJFbCA9IGNhbGVuZGFyRWwucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpO1xyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC50ZXh0Q29udGVudCwgMTApO1xyXG5cclxuICBsZXQgYWRqdXN0ZWRZZWFyID0gc2VsZWN0ZWRZZWFyICsgWUVBUl9DSFVOSztcclxuICBhZGp1c3RlZFllYXIgPSBNYXRoLm1heCgwLCBhZGp1c3RlZFllYXIpO1xyXG5cclxuICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XHJcbiAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxyXG4gICk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgeWVhciBpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB5ZWFyRWwgQSB5ZWFyIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHNlbGVjdFllYXIgPSAoeWVhckVsKSA9PiB7XHJcbiAgaWYgKHllYXJFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIHllYXJFbFxyXG4gICk7XHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gcGFyc2VJbnQoeWVhckVsLmlubmVySFRNTCwgMTApO1xyXG4gIGxldCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIHNlbGVjdGVkWWVhcik7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciAtIFllYXIgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8qKlxyXG4gKiBIaWRlIHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRXNjYXBlRnJvbUNhbGVuZGFyID0gKGV2ZW50KSA9PiB7XHJcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGV4dGVybmFsSW5wdXRFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZXZlbnQudGFyZ2V0KTtcclxuXHJcbiAgaGlkZUNhbGVuZGFyKGRhdGVQaWNrZXJFbCk7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmZvY3VzKCk7XHJcblxyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIERhdGUgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8qKlxyXG4gKiBBZGp1c3QgdGhlIGRhdGUgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyIGlmIG5lZWRlZC5cclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWRqdXN0RGF0ZUZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRqdXN0Q2FsZW5kYXIgPSAoYWRqdXN0RGF0ZUZuKSA9PiB7XHJcbiAgcmV0dXJuIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICBldmVudC50YXJnZXRcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IGFkanVzdERhdGVGbihjYWxlbmRhckRhdGUpO1xyXG5cclxuICAgIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICBpZiAoIWlzU2FtZURheShjYWxlbmRhckRhdGUsIGNhcHBlZERhdGUpKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgY2FwcGVkRGF0ZSk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVVcEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1YldlZWtzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZFdlZWtzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBkYXkgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVMZWZ0RnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViRGF5cyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgZGF5IGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUmlnaHRGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGREYXlzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgc3RhcnQgb2YgdGhlIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVIb21lRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3RhcnRPZldlZWsoZGF0ZSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVFbmRGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBlbmRPZldlZWsoZGF0ZSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRNb250aHMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViTW9udGhzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlU2hpZnRQYWdlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZFllYXJzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlU2hpZnRQYWdlVXBGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJZZWFycyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogZGlzcGxheSB0aGUgY2FsZW5kYXIgZm9yIHRoZSBtb3VzZW1vdmUgZGF0ZS5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGRhdGVFbCBBIGRhdGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbURhdGUgPSAoZGF0ZUVsKSA9PiB7XHJcbiAgaWYgKGRhdGVFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBjYWxlbmRhckVsID0gZGF0ZUVsLmNsb3Nlc3QoREFURV9QSUNLRVJfQ0FMRU5EQVIpO1xyXG5cclxuICBjb25zdCBjdXJyZW50Q2FsZW5kYXJEYXRlID0gY2FsZW5kYXJFbC5kYXRhc2V0LnZhbHVlO1xyXG4gIGNvbnN0IGhvdmVyRGF0ZSA9IGRhdGVFbC5kYXRhc2V0LnZhbHVlO1xyXG5cclxuICBpZiAoaG92ZXJEYXRlID09PSBjdXJyZW50Q2FsZW5kYXJEYXRlKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGRhdGVUb0Rpc3BsYXkgPSBwYXJzZURhdGVTdHJpbmcoaG92ZXJEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGVUb0Rpc3BsYXkpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBEYXRlIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIE1vbnRoIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbiBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFkanVzdE1vbnRoRm4gZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBhZGp1c3RlZCBtb250aFxyXG4gKi9cclxuY29uc3QgYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4gPSAoYWRqdXN0TW9udGhGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IG1vbnRoRWwgPSBldmVudC50YXJnZXQ7XHJcbiAgICBjb25zdCBzZWxlY3RlZE1vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICAgIG1vbnRoRWxcclxuICAgICk7XHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgc2VsZWN0ZWRNb250aCk7XHJcblxyXG4gICAgbGV0IGFkanVzdGVkTW9udGggPSBhZGp1c3RNb250aEZuKHNlbGVjdGVkTW9udGgpO1xyXG4gICAgYWRqdXN0ZWRNb250aCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDExLCBhZGp1c3RlZE1vbnRoKSk7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRNb250aCk7XHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVNb250aChjdXJyZW50RGF0ZSwgY2FwcGVkRGF0ZSkpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24oXHJcbiAgICAgICAgY2FsZW5kYXJFbCxcclxuICAgICAgICBjYXBwZWREYXRlLmdldE1vbnRoKClcclxuICAgICAgKTtcclxuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9NT05USF9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgdGhyZWUgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVVcEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggLSAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIHRocmVlIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRG93bkZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggKyAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTGVmdEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggLSAxKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUmlnaHRGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoICsgMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSByb3cgb2YgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVIb21lRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKG1vbnRoKSA9PiBtb250aCAtIChtb250aCAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIGVuZCBvZiB0aGUgcm93IG9mIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKG1vbnRoKSA9PiBtb250aCArIDIgLSAobW9udGggJSAzKVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBsYXN0IG1vbnRoIChEZWNlbWJlcikgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKCkgPT4gMTEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBmaXJzdCBtb250aCAoSmFudWFyeSkgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKCgpID0+IDApO1xyXG5cclxuLyoqXHJcbiAqIHVwZGF0ZSB0aGUgZm9jdXMgb24gYSBtb250aCB3aGVuIHRoZSBtb3VzZSBtb3Zlcy5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IG1vbnRoRWwgQSBtb250aCBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVNb3VzZW1vdmVGcm9tTW9udGggPSAobW9udGhFbCkgPT4ge1xyXG4gIGlmIChtb250aEVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgaWYgKG1vbnRoRWwuY2xhc3NMaXN0LmNvbnRhaW5zKENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MpKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGZvY3VzTW9udGggPSBwYXJzZUludChtb250aEVsLmRhdGFzZXQudmFsdWUsIDEwKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24obW9udGhFbCwgZm9jdXNNb250aCk7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9NT05USF9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBNb250aCBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBZZWFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4gaWYgbmVlZGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3RZZWFyRm4gZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBhZGp1c3RlZCB5ZWFyXHJcbiAqL1xyXG5jb25zdCBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuID0gKGFkanVzdFllYXJGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IHllYXJFbCA9IGV2ZW50LnRhcmdldDtcclxuICAgIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICAgIHllYXJFbFxyXG4gICAgKTtcclxuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIHNlbGVjdGVkWWVhcik7XHJcblxyXG4gICAgbGV0IGFkanVzdGVkWWVhciA9IGFkanVzdFllYXJGbihzZWxlY3RlZFllYXIpO1xyXG4gICAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVZZWFyKGN1cnJlbnREYXRlLCBjYXBwZWREYXRlKSkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxyXG4gICAgICAgIGNhbGVuZGFyRWwsXHJcbiAgICAgICAgY2FwcGVkRGF0ZS5nZXRGdWxsWWVhcigpXHJcbiAgICAgICk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgdGhyZWUgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgLSAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIHRocmVlIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgKyAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUxlZnRGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgLSAxKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyICsgMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSByb3cgb2YgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciAtICh5ZWFyICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZW5kIG9mIHRoZSByb3cgb2YgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxyXG4gICh5ZWFyKSA9PiB5ZWFyICsgMiAtICh5ZWFyICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byBiYWNrIDEyIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciAtIFlFQVJfQ0hVTktcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIDEyIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxyXG4gICh5ZWFyKSA9PiB5ZWFyICsgWUVBUl9DSFVOS1xyXG4pO1xyXG5cclxuLyoqXHJcbiAqIHVwZGF0ZSB0aGUgZm9jdXMgb24gYSB5ZWFyIHdoZW4gdGhlIG1vdXNlIG1vdmVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IFRoZSBtb3VzZW1vdmUgZXZlbnRcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZGF0ZUVsIEEgeWVhciBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVNb3VzZW1vdmVGcm9tWWVhciA9ICh5ZWFyRWwpID0+IHtcclxuICBpZiAoeWVhckVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgaWYgKHllYXJFbC5jbGFzc0xpc3QuY29udGFpbnMoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTKSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBmb2N1c1llYXIgPSBwYXJzZUludCh5ZWFyRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKHllYXJFbCwgZm9jdXNZZWFyKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgWWVhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBGb2N1cyBIYW5kbGluZyBFdmVudCBIYW5kbGluZ1xyXG5cclxuY29uc3QgdGFiSGFuZGxlciA9IChmb2N1c2FibGUpID0+IHtcclxuICBjb25zdCBnZXRGb2N1c2FibGVDb250ZXh0ID0gKGVsKSA9PiB7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gc2VsZWN0KGZvY3VzYWJsZSwgY2FsZW5kYXJFbCk7XHJcblxyXG4gICAgY29uc3QgZmlyc3RUYWJJbmRleCA9IDA7XHJcbiAgICBjb25zdCBsYXN0VGFiSW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xyXG4gICAgY29uc3QgZmlyc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbZmlyc3RUYWJJbmRleF07XHJcbiAgICBjb25zdCBsYXN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2xhc3RUYWJJbmRleF07XHJcbiAgICBjb25zdCBmb2N1c0luZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMuaW5kZXhPZihhY3RpdmVFbGVtZW50KCkpO1xyXG5cclxuICAgIGNvbnN0IGlzTGFzdFRhYiA9IGZvY3VzSW5kZXggPT09IGxhc3RUYWJJbmRleDtcclxuICAgIGNvbnN0IGlzRmlyc3RUYWIgPSBmb2N1c0luZGV4ID09PSBmaXJzdFRhYkluZGV4O1xyXG4gICAgY29uc3QgaXNOb3RGb3VuZCA9IGZvY3VzSW5kZXggPT09IC0xO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZvY3VzYWJsZUVsZW1lbnRzLFxyXG4gICAgICBpc05vdEZvdW5kLFxyXG4gICAgICBmaXJzdFRhYlN0b3AsXHJcbiAgICAgIGlzRmlyc3RUYWIsXHJcbiAgICAgIGxhc3RUYWJTdG9wLFxyXG4gICAgICBpc0xhc3RUYWIsXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0YWJBaGVhZChldmVudCkge1xyXG4gICAgICBjb25zdCB7IGZpcnN0VGFiU3RvcCwgaXNMYXN0VGFiLCBpc05vdEZvdW5kIH0gPSBnZXRGb2N1c2FibGVDb250ZXh0KFxyXG4gICAgICAgIGV2ZW50LnRhcmdldFxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKGlzTGFzdFRhYiB8fCBpc05vdEZvdW5kKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRhYkJhY2soZXZlbnQpIHtcclxuICAgICAgY29uc3QgeyBsYXN0VGFiU3RvcCwgaXNGaXJzdFRhYiwgaXNOb3RGb3VuZCB9ID0gZ2V0Rm9jdXNhYmxlQ29udGV4dChcclxuICAgICAgICBldmVudC50YXJnZXRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChpc0ZpcnN0VGFiIHx8IGlzTm90Rm91bmQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IGRhdGVQaWNrZXJUYWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKERBVEVfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcbmNvbnN0IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyID0gdGFiSGFuZGxlcihNT05USF9QSUNLRVJfRk9DVVNBQkxFKTtcclxuY29uc3QgeWVhclBpY2tlclRhYkV2ZW50SGFuZGxlciA9IHRhYkhhbmRsZXIoWUVBUl9QSUNLRVJfRk9DVVNBQkxFKTtcclxuXHJcbi8vICNlbmRyZWdpb24gRm9jdXMgSGFuZGxpbmcgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gRGF0ZSBQaWNrZXIgRXZlbnQgRGVsZWdhdGlvbiBSZWdpc3RyYXRpb24gLyBDb21wb25lbnRcclxuXHJcbmNvbnN0IGRhdGVQaWNrZXJFdmVudHMgPSB7XHJcbiAgW0NMSUNLXToge1xyXG4gICAgW0RBVEVfUElDS0VSX0JVVFRPTl0oKSB7XHJcbiAgICAgIHRvZ2dsZUNhbGVuZGFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9EQVRFXSgpIHtcclxuICAgICAgc2VsZWN0RGF0ZSh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdKCkge1xyXG4gICAgICBzZWxlY3RNb250aCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl0oKSB7XHJcbiAgICAgIHNlbGVjdFllYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1BSRVZJT1VTX01PTlRIXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzTW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX05FWFRfTU9OVEhdKCkge1xyXG4gICAgICBkaXNwbGF5TmV4dE1vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzWWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTkVYVF9ZRUFSXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRZZWFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzWWVhckNodW5rKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktdKCkge1xyXG4gICAgICBkaXNwbGF5TmV4dFllYXJDaHVuayh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OXSgpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24odGhpcyk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05dKCkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKHRoaXMpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBrZXl1cDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0NBTEVOREFSXShldmVudCkge1xyXG4gICAgICBjb25zdCBrZXlkb3duID0gdGhpcy5kYXRhc2V0LmtleWRvd25LZXlDb2RlO1xyXG4gICAgICBpZiAoYCR7ZXZlbnQua2V5Q29kZX1gICE9PSBrZXlkb3duKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGtleWRvd246IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF0oZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEVOVEVSX0tFWUNPREUpIHtcclxuICAgICAgICB2YWxpZGF0ZURhdGVJbnB1dCh0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9EQVRFXTogcmVjZXB0b3Iua2V5bWFwKHtcclxuICAgICAgVXA6IGhhbmRsZVVwRnJvbURhdGUsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbURhdGUsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tRGF0ZSxcclxuICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbURhdGUsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tRGF0ZSxcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbURhdGUsXHJcbiAgICAgIFJpZ2h0OiBoYW5kbGVSaWdodEZyb21EYXRlLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21EYXRlLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbURhdGUsXHJcbiAgICAgIEVuZDogaGFuZGxlRW5kRnJvbURhdGUsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21EYXRlLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21EYXRlLFxyXG4gICAgICBcIlNoaWZ0K1BhZ2VEb3duXCI6IGhhbmRsZVNoaWZ0UGFnZURvd25Gcm9tRGF0ZSxcclxuICAgICAgXCJTaGlmdCtQYWdlVXBcIjogaGFuZGxlU2hpZnRQYWdlVXBGcm9tRGF0ZSxcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX0RBVEVfUElDS0VSXTogcmVjZXB0b3Iua2V5bWFwKHtcclxuICAgICAgVGFiOiBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9NT05USF06IHJlY2VwdG9yLmtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21Nb250aCxcclxuICAgICAgQXJyb3dVcDogaGFuZGxlVXBGcm9tTW9udGgsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tTW9udGgsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21Nb250aCxcclxuICAgICAgTGVmdDogaGFuZGxlTGVmdEZyb21Nb250aCxcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbU1vbnRoLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tTW9udGgsXHJcbiAgICAgIEFycm93UmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbU1vbnRoLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbU1vbnRoLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21Nb250aCxcclxuICAgICAgUGFnZURvd246IGhhbmRsZVBhZ2VEb3duRnJvbU1vbnRoLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21Nb250aCxcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX01PTlRIX1BJQ0tFUl06IHJlY2VwdG9yLmtleW1hcCh7XHJcbiAgICAgIFRhYjogbW9udGhQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQWhlYWQsXHJcbiAgICAgIFwiU2hpZnQrVGFiXCI6IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9ZRUFSXTogcmVjZXB0b3Iua2V5bWFwKHtcclxuICAgICAgVXA6IGhhbmRsZVVwRnJvbVllYXIsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbVllYXIsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tWWVhcixcclxuICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbVllYXIsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tWWVhcixcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbVllYXIsXHJcbiAgICAgIFJpZ2h0OiBoYW5kbGVSaWdodEZyb21ZZWFyLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21ZZWFyLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbVllYXIsXHJcbiAgICAgIEVuZDogaGFuZGxlRW5kRnJvbVllYXIsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21ZZWFyLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21ZZWFyLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl9QSUNLRVJdOiByZWNlcHRvci5rZXltYXAoe1xyXG4gICAgICBUYWI6IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQWhlYWQsXHJcbiAgICAgIFwiU2hpZnQrVGFiXCI6IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQmFjayxcclxuICAgIH0pLFxyXG4gICAgW0RBVEVfUElDS0VSX0NBTEVOREFSXShldmVudCkge1xyXG4gICAgICB0aGlzLmRhdGFzZXQua2V5ZG93bktleUNvZGUgPSBldmVudC5rZXlDb2RlO1xyXG4gICAgfSxcclxuICAgIFtEQVRFX1BJQ0tFUl0oZXZlbnQpIHtcclxuICAgICAgY29uc3Qga2V5TWFwID0gcmVjZXB0b3Iua2V5bWFwKHtcclxuICAgICAgICBFc2NhcGU6IGhhbmRsZUVzY2FwZUZyb21DYWxlbmRhcixcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBrZXlNYXAoZXZlbnQpO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIGZvY3Vzb3V0OiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKCkge1xyXG4gICAgICB2YWxpZGF0ZURhdGVJbnB1dCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbREFURV9QSUNLRVJdKGV2ZW50KSB7XHJcbiAgICAgIGlmICghdGhpcy5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0KSkge1xyXG4gICAgICAgIGhpZGVDYWxlbmRhcih0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGlucHV0OiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKCkge1xyXG4gICAgICByZWNvbmNpbGVJbnB1dFZhbHVlcyh0aGlzKTtcclxuICAgICAgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUodGhpcyk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn07XHJcblxyXG5pZiAoIWlzSW9zRGV2aWNlKCkpIHtcclxuICBkYXRlUGlja2VyRXZlbnRzLm1vdXNlbW92ZSA9IHtcclxuICAgIFtDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tRGF0ZSh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tTW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tWWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuY29uc3QgZGF0ZVBpY2tlciA9IGJlaGF2aW9yKGRhdGVQaWNrZXJFdmVudHMsIHtcclxuICBpbml0KHJvb3QpIHtcclxuICAgIHNlbGVjdChEQVRFX1BJQ0tFUiwgcm9vdCkuZm9yRWFjaCgoZGF0ZVBpY2tlckVsKSA9PiB7XHJcbiAgICAgIGlmKCFkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKERBVEVfUElDS0VSX0lOSVRJQUxJWkVEX0NMQVNTKSl7XHJcbiAgICAgICAgZW5oYW5jZURhdGVQaWNrZXIoZGF0ZVBpY2tlckVsKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBnZXREYXRlUGlja2VyQ29udGV4dCxcclxuICBkaXNhYmxlLFxyXG4gIGVuYWJsZSxcclxuICBpc0RhdGVJbnB1dEludmFsaWQsXHJcbiAgc2V0Q2FsZW5kYXJWYWx1ZSxcclxuICB2YWxpZGF0ZURhdGVJbnB1dCxcclxuICByZW5kZXJDYWxlbmRhcixcclxuICB1cGRhdGVDYWxlbmRhcklmVmlzaWJsZSxcclxufSk7XHJcblxyXG4vLyAjZW5kcmVnaW9uIERhdGUgUGlja2VyIEV2ZW50IERlbGVnYXRpb24gUmVnaXN0cmF0aW9uIC8gQ29tcG9uZW50XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGVQaWNrZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgRHJvcGRvd24gPSByZXF1aXJlKCcuL2Ryb3Bkb3duJyk7XHJcbmZ1bmN0aW9uIERyb3Bkb3duU29ydCAoY29udGFpbmVyKXtcclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgdGhpcy5idXR0b24gPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXTtcclxuXHJcbiAgICAvLyBpZiBubyB2YWx1ZSBpcyBzZWxlY3RlZCwgY2hvb3NlIGZpcnN0IG9wdGlvblxyXG4gICAgaWYoIXRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5vdmVyZmxvdy1saXN0IGxpW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJykpe1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5vdmVyZmxvdy1saXN0IGxpJylbMF0uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgXCJ0cnVlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNlbGVjdGVkVmFsdWUodGhpcy5jb250YWluZXIpO1xyXG59XHJcbkRyb3Bkb3duU29ydC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLm92ZXJmbG93TWVudSA9IG5ldyBEcm9wZG93bih0aGlzLmJ1dHRvbik7XHJcblxyXG4gICAgbGV0IHNvcnRpbmdPcHRpb25zID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm92ZXJmbG93LWxpc3QgbGkgYnV0dG9uJyk7XHJcbiAgICBmb3IobGV0IHMgPSAwOyBzIDwgc29ydGluZ09wdGlvbnMubGVuZ3RoOyBzKyspe1xyXG4gICAgICAgIGxldCBvcHRpb24gPSBzb3J0aW5nT3B0aW9uc1tzXTtcclxuICAgICAgICBvcHRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbk9wdGlvbkNsaWNrKTtcclxuICAgIH1cclxufVxyXG5sZXQgdXBkYXRlU2VsZWN0ZWRWYWx1ZSA9IGZ1bmN0aW9uKGNvbnRhaW5lcil7XHJcbiAgICBsZXQgc2VsZWN0ZWRJdGVtID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5vdmVyZmxvdy1saXN0IGxpW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICBjb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZWxlY3RlZC12YWx1ZScpWzBdLmlubmVyVGV4dCA9IHNlbGVjdGVkSXRlbS5pbm5lclRleHQ7XHJcbn1cclxuXHJcbmxldCBvbk9wdGlvbkNsaWNrID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgbGV0IGxpID0gdGhpcy5wYXJlbnROb2RlO1xyXG4gICAgbGkucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCdsaVthcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpO1xyXG4gICAgbGkuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuXHJcbiAgICBsZXQgYnV0dG9uID0gbGkucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXTtcclxuICAgIGxldCBldmVudFNlbGVjdGVkID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uc2VsZWN0ZWQnKTtcclxuICAgIGV2ZW50U2VsZWN0ZWQuZGV0YWlsID0gdGhpcztcclxuICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50U2VsZWN0ZWQpO1xyXG4gICAgdXBkYXRlU2VsZWN0ZWRWYWx1ZShsaS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZSk7XHJcblxyXG4gICAgXHJcbiAgICBsZXQgb3ZlcmZsb3dNZW51ID0gbmV3IERyb3Bkb3duKGJ1dHRvbik7XHJcbiAgICBvdmVyZmxvd01lbnUuaGlkZSgpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEcm9wZG93blNvcnQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgYnJlYWtwb2ludHMgPSByZXF1aXJlKCcuLi91dGlscy9icmVha3BvaW50cycpO1xyXG5jb25zdCBCVVRUT04gPSAnLmpzLWRyb3Bkb3duJztcclxuY29uc3QganNEcm9wZG93bkNvbGxhcHNlTW9kaWZpZXIgPSAnanMtZHJvcGRvd24tLXJlc3BvbnNpdmUtY29sbGFwc2UnOyAvL29wdGlvbjogbWFrZSBkcm9wZG93biBiZWhhdmUgYXMgdGhlIGNvbGxhcHNlIGNvbXBvbmVudCB3aGVuIG9uIHNtYWxsIHNjcmVlbnMgKHVzZWQgYnkgc3VibWVudXMgaW4gdGhlIGhlYWRlciBhbmQgc3RlcC1kcm9wZG93bikuXHJcbmNvbnN0IFRBUkdFVCA9ICdkYXRhLWpzLXRhcmdldCc7XHJcbmNvbnN0IGV2ZW50Q2xvc2VOYW1lID0gJ2Zkcy5kcm9wZG93bi5jbG9zZSc7XHJcbmNvbnN0IGV2ZW50T3Blbk5hbWUgPSAnZmRzLmRyb3Bkb3duLm9wZW4nO1xyXG5cclxuY2xhc3MgRHJvcGRvd24ge1xyXG4gIGNvbnN0cnVjdG9yIChlbCl7XHJcbiAgICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy50cmlnZ2VyRWwgPSBlbDtcclxuICAgIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG5cclxuICAgIGlmKHRoaXMudHJpZ2dlckVsICE9PSBudWxsICYmIHRoaXMudHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGhpcy50YXJnZXRFbCAhPT0gbnVsbCAmJiB0aGlzLnRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcblxyXG5cclxuICAgICAgaWYodGhpcy50cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSB8fCB0aGlzLnRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKXtcclxuICAgICAgICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy9DbGlja2VkIG91dHNpZGUgZHJvcGRvd24gLT4gY2xvc2UgaXRcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3V0c2lkZUNsb3NlKTtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3V0c2lkZUNsb3NlKTtcclxuICAgICAgLy9DbGlja2VkIG9uIGRyb3Bkb3duIG9wZW4gYnV0dG9uIC0tPiB0b2dnbGUgaXRcclxuICAgICAgdGhpcy50cmlnZ2VyRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVEcm9wZG93bik7XHJcbiAgICAgIHRoaXMudHJpZ2dlckVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlRHJvcGRvd24pO1xyXG5cclxuICAgICAgLy8gc2V0IGFyaWEtaGlkZGVuIGNvcnJlY3RseSBmb3Igc2NyZWVucmVhZGVycyAoVHJpbmd1aWRlIHJlc3BvbnNpdmUpXHJcbiAgICAgIGlmKHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQpIHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IHRoaXMudHJpZ2dlckVsO1xyXG4gICAgICAgIGlmICh3aW5kb3cuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpIHtcclxuICAgICAgICAgIC8vIHRyaWdnZXIgZXZlbnQgd2hlbiBidXR0b24gY2hhbmdlcyB2aXNpYmlsaXR5XHJcbiAgICAgICAgICBsZXQgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKGVudHJpZXMpIHtcclxuICAgICAgICAgICAgLy8gYnV0dG9uIGlzIHZpc2libGVcclxuICAgICAgICAgICAgaWYgKGVudHJpZXNbIDAgXS5pbnRlcnNlY3Rpb25SYXRpbykge1xyXG4gICAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAvLyBidXR0b24gaXMgbm90IHZpc2libGVcclxuICAgICAgICAgICAgICBpZiAodGhhdC50YXJnZXRFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJykge1xyXG4gICAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIHJvb3Q6IGRvY3VtZW50LmJvZHlcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbGVtZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gSUU6IEludGVyc2VjdGlvbk9ic2VydmVyIGlzIG5vdCBzdXBwb3J0ZWQsIHNvIHdlIGxpc3RlbiBmb3Igd2luZG93IHJlc2l6ZSBhbmQgZ3JpZCBicmVha3BvaW50IGluc3RlYWRcclxuICAgICAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSh0aGF0LnRyaWdnZXJFbCkpIHtcclxuICAgICAgICAgICAgLy8gc21hbGwgc2NyZWVuXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBMYXJnZSBzY3JlZW5cclxuICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoZG9SZXNwb25zaXZlQ29sbGFwc2UodGhhdC50cmlnZ2VyRWwpKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGhhdC50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoYXQudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFxyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICAgICAgICBpZiAoa2V5ID09PSAyNykge1xyXG4gICAgICAgICAgY2xvc2VBbGwoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0ICgpeyAgICBcclxuICAgIGlmKHRoaXMudHJpZ2dlckVsID09PSBudWxsIHx8dGhpcy50cmlnZ2VyRWwgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYnV0dG9uIGZvciBEZXRhaWxzIGNvbXBvbmVudC5gKTtcclxuICAgIH1cclxuICAgIGxldCB0YXJnZXRBdHRyID0gdGhpcy50cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgICBpZih0YXJnZXRBdHRyID09PSBudWxsIHx8IHRhcmdldEF0dHIgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXR0cmlidXRlIGNvdWxkIG5vdCBiZSBmb3VuZCBvbiBkZXRhaWxzIGNvbXBvbmVudDogJytUQVJHRVQpO1xyXG4gICAgfVxyXG4gICAgbGV0IHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpKTtcclxuICAgIGlmKHRhcmdldEVsID09PSBudWxsIHx8IHRhcmdldEVsID09PSB1bmRlZmluZWQpe1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhbmVsIGZvciBEZXRhaWxzIGNvbXBvbmVudCBjb3VsZCBub3QgYmUgZm91bmQuJyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaXMudGFyZ2V0RWwgPSB0YXJnZXRFbDsgIFxyXG4gIH1cclxuXHJcbiAgaGlkZSgpe1xyXG4gICAgdG9nZ2xlKHRoaXMudHJpZ2dlckVsKTtcclxuICB9XHJcblxyXG4gIHNob3coKXtcclxuICAgIHRvZ2dsZSh0aGlzLnRyaWdnZXJFbCk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBhbiBBcnJheSBvZiBidXR0b24gZWxlbWVudHMgYmVsb25naW5nIGRpcmVjdGx5IHRvIHRoZSBnaXZlblxyXG4gKiBhY2NvcmRpb24gZWxlbWVudC5cclxuICogQHBhcmFtIHBhcmVudCBhY2NvcmRpb24gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7Tm9kZUxpc3RPZjxTVkdFbGVtZW50VGFnTmFtZU1hcFtbc3RyaW5nXV0+IHwgTm9kZUxpc3RPZjxIVE1MRWxlbWVudFRhZ05hbWVNYXBbW3N0cmluZ11dPiB8IE5vZGVMaXN0T2Y8RWxlbWVudD59XHJcbiAqL1xyXG5sZXQgZ2V0QnV0dG9ucyA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcclxuICByZXR1cm4gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxufTtcclxuXHJcbmxldCBjbG9zZUFsbCA9IGZ1bmN0aW9uIChldmVudCA9IG51bGwpe1xyXG4gIGxldCBjaGFuZ2VkID0gZmFsc2U7XHJcblxyXG4gIGxldCBldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgZXZlbnRDbG9zZS5pbml0RXZlbnQoZXZlbnRDbG9zZU5hbWUsIHRydWUsIHRydWUpO1xyXG5cclxuICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG5cclxuICBsZXQgb3ZlcmZsb3dNZW51RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdvdmVyZmxvdy1tZW51Jyk7XHJcbiAgZm9yIChsZXQgb2kgPSAwOyBvaSA8IG92ZXJmbG93TWVudUVsLmxlbmd0aDsgb2krKykge1xyXG4gICAgbGV0IGN1cnJlbnRPdmVyZmxvd01lbnVFTCA9IG92ZXJmbG93TWVudUVsWyBvaSBdO1xyXG4gICAgbGV0IHRyaWdnZXJFbCA9IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5xdWVyeVNlbGVjdG9yKEJVVFRPTisnW2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwpe1xyXG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgbGV0IHRhcmdldEVsID0gY3VycmVudE92ZXJmbG93TWVudUVMLnF1ZXJ5U2VsZWN0b3IoJyMnK3RyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKS5yZXBsYWNlKCcjJywgJycpKTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldEVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYoZG9SZXNwb25zaXZlQ29sbGFwc2UodHJpZ2dlckVsKSl7XHJcbiAgICAgICAgICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYoY2hhbmdlZCAmJiBldmVudCAhPT0gbnVsbCl7XHJcbiAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICB9XHJcbn07XHJcbmxldCBvZmZzZXQgPSBmdW5jdGlvbiAoZWwpIHtcclxuICBsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxyXG4gICAgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcclxuICAgIHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xyXG4gIHJldHVybiB7IHRvcDogcmVjdC50b3AgKyBzY3JvbGxUb3AsIGxlZnQ6IHJlY3QubGVmdCArIHNjcm9sbExlZnQgfTtcclxufTtcclxuXHJcbmxldCB0b2dnbGVEcm9wZG93biA9IGZ1bmN0aW9uIChldmVudCwgZm9yY2VDbG9zZSA9IGZhbHNlKSB7XHJcbiAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgdG9nZ2xlKHRoaXMsIGZvcmNlQ2xvc2UpO1xyXG5cclxufTtcclxuXHJcbmxldCB0b2dnbGUgPSBmdW5jdGlvbihidXR0b24sIGZvcmNlQ2xvc2UgPSBmYWxzZSl7XHJcbiAgXHJcbiAgbGV0IGV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICBldmVudENsb3NlLmluaXRFdmVudChldmVudENsb3NlTmFtZSwgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG4gIGxldCBldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICBldmVudE9wZW4uaW5pdEV2ZW50KGV2ZW50T3Blbk5hbWUsIHRydWUsIHRydWUpO1xyXG4gIGxldCB0cmlnZ2VyRWwgPSBidXR0b247XHJcbiAgbGV0IHRhcmdldEVsID0gbnVsbDtcclxuICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgbGV0IHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgLy9jaGFuZ2Ugc3RhdGVcclxuXHJcbiAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gbnVsbDtcclxuICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gbnVsbDtcclxuXHJcbiAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJyB8fCBmb3JjZUNsb3NlKXtcclxuICAgICAgLy9jbG9zZVxyXG4gICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY2xvc2VBbGwoKTtcclxuICAgICAgLy9vcGVuXHJcbiAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcclxuICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gICAgICBsZXQgdGFyZ2V0T2Zmc2V0ID0gb2Zmc2V0KHRhcmdldEVsKTtcclxuXHJcbiAgICAgIGlmKHRhcmdldE9mZnNldC5sZWZ0IDwgMCl7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCByaWdodCA9IHRhcmdldE9mZnNldC5sZWZ0ICsgdGFyZ2V0RWwub2Zmc2V0V2lkdGg7XHJcbiAgICAgIGlmKHJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpe1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnYXV0byc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnMHB4JztcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IG9mZnNldEFnYWluID0gb2Zmc2V0KHRhcmdldEVsKTtcclxuXHJcbiAgICAgIGlmKG9mZnNldEFnYWluLmxlZnQgPCAwKXtcclxuXHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgICB9XHJcbiAgICAgIHJpZ2h0ID0gb2Zmc2V0QWdhaW4ubGVmdCArIHRhcmdldEVsLm9mZnNldFdpZHRoO1xyXG4gICAgICBpZihyaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKXtcclxuXHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICdhdXRvJztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICcwcHgnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxufVxyXG5cclxubGV0IGhhc1BhcmVudCA9IGZ1bmN0aW9uIChjaGlsZCwgcGFyZW50VGFnTmFtZSl7XHJcbiAgaWYoY2hpbGQucGFyZW50Tm9kZS50YWdOYW1lID09PSBwYXJlbnRUYWdOYW1lKXtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gZWxzZSBpZihwYXJlbnRUYWdOYW1lICE9PSAnQk9EWScgJiYgY2hpbGQucGFyZW50Tm9kZS50YWdOYW1lICE9PSAnQk9EWScpe1xyXG4gICAgcmV0dXJuIGhhc1BhcmVudChjaGlsZC5wYXJlbnROb2RlLCBwYXJlbnRUYWdOYW1lKTtcclxuICB9ZWxzZXtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcblxyXG5sZXQgb3V0c2lkZUNsb3NlID0gZnVuY3Rpb24gKGV2dCl7XHJcbiAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keS5tb2JpbGVfbmF2LWFjdGl2ZScpID09PSBudWxsKSB7XHJcbiAgICBsZXQgb3BlbkRyb3Bkb3ducyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1kcm9wZG93blthcmlhLWV4cGFuZGVkPXRydWVdJyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wZW5Ecm9wZG93bnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IHRyaWdnZXJFbCA9IG9wZW5Ecm9wZG93bnNbaV07XHJcbiAgICAgIGxldCB0YXJnZXRFbCA9IG51bGw7XHJcbiAgICAgIGxldCB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZShUQVJHRVQpO1xyXG4gICAgICBpZiAodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZih0YXJnZXRBdHRyLmluZGV4T2YoJyMnKSAhPT0gLTEpe1xyXG4gICAgICAgICAgdGFyZ2V0QXR0ciA9IHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZG9SZXNwb25zaXZlQ29sbGFwc2UodHJpZ2dlckVsKSB8fCAoaGFzUGFyZW50KHRyaWdnZXJFbCwgJ0hFQURFUicpICYmICFldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmxheScpKSkge1xyXG4gICAgICAgIC8vY2xvc2VzIGRyb3Bkb3duIHdoZW4gY2xpY2tlZCBvdXRzaWRlXHJcbiAgICAgICAgaWYgKGV2dC50YXJnZXQgIT09IHRyaWdnZXJFbCkge1xyXG4gICAgICAgICAgLy9jbGlja2VkIG91dHNpZGUgdHJpZ2dlciwgZm9yY2UgY2xvc2VcclxuICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcblxyXG4gICAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgICAgICAgIGV2ZW50Q2xvc2UuaW5pdEV2ZW50KGV2ZW50Q2xvc2VOYW1lLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmxldCBkb1Jlc3BvbnNpdmVDb2xsYXBzZSA9IGZ1bmN0aW9uICh0cmlnZ2VyRWwpe1xyXG4gIGlmKCF0cmlnZ2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKGpzRHJvcGRvd25Db2xsYXBzZU1vZGlmaWVyKSl7XHJcbiAgICAvLyBub3QgbmF2IG92ZXJmbG93IG1lbnVcclxuICAgIGlmKHRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpIHx8IHRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKSB7XHJcbiAgICAgIC8vIHRyaW5pbmRpa2F0b3Igb3ZlcmZsb3cgbWVudVxyXG4gICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPD0gZ2V0VHJpbmd1aWRlQnJlYWtwb2ludCh0cmlnZ2VyRWwpKSB7XHJcbiAgICAgICAgLy8gb3ZlcmZsb3cgbWVudSBww6UgcmVzcG9uc2l2IHRyaW5ndWlkZSBha3RpdmVyZXRcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNle1xyXG4gICAgICAvLyBub3JtYWwgb3ZlcmZsb3cgbWVudVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbmxldCBnZXRUcmluZ3VpZGVCcmVha3BvaW50ID0gZnVuY3Rpb24gKGJ1dHRvbil7XHJcbiAgaWYoYnV0dG9uLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgcmV0dXJuIGJyZWFrcG9pbnRzLm1kO1xyXG4gIH1cclxuICBpZihidXR0b24ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSl7XHJcbiAgICByZXR1cm4gYnJlYWtwb2ludHMubGc7XHJcbiAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBEcm9wZG93bjtcclxuIiwiXHJcblxyXG5mdW5jdGlvbiBFcnJvclN1bW1hcnkgKCRtb2R1bGUpIHtcclxuICB0aGlzLiRtb2R1bGUgPSAkbW9kdWxlXHJcbn1cclxuXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgJG1vZHVsZSA9IHRoaXMuJG1vZHVsZVxyXG4gIGlmICghJG1vZHVsZSkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gICRtb2R1bGUuZm9jdXMoKVxyXG5cclxuICAkbW9kdWxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpKVxyXG59XHJcblxyXG4vKipcclxuKiBDbGljayBldmVudCBoYW5kbGVyXHJcbipcclxuKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IC0gQ2xpY2sgZXZlbnRcclxuKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5oYW5kbGVDbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXRcclxuICBpZiAodGhpcy5mb2N1c1RhcmdldCh0YXJnZXQpKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogRm9jdXMgdGhlIHRhcmdldCBlbGVtZW50XHJcbiAqXHJcbiAqIEJ5IGRlZmF1bHQsIHRoZSBicm93c2VyIHdpbGwgc2Nyb2xsIHRoZSB0YXJnZXQgaW50byB2aWV3LiBCZWNhdXNlIG91ciBsYWJlbHNcclxuICogb3IgbGVnZW5kcyBhcHBlYXIgYWJvdmUgdGhlIGlucHV0LCB0aGlzIG1lYW5zIHRoZSB1c2VyIHdpbGwgYmUgcHJlc2VudGVkIHdpdGhcclxuICogYW4gaW5wdXQgd2l0aG91dCBhbnkgY29udGV4dCwgYXMgdGhlIGxhYmVsIG9yIGxlZ2VuZCB3aWxsIGJlIG9mZiB0aGUgdG9wIG9mXHJcbiAqIHRoZSBzY3JlZW4uXHJcbiAqXHJcbiAqIE1hbnVhbGx5IGhhbmRsaW5nIHRoZSBjbGljayBldmVudCwgc2Nyb2xsaW5nIHRoZSBxdWVzdGlvbiBpbnRvIHZpZXcgYW5kIHRoZW5cclxuICogZm9jdXNzaW5nIHRoZSBlbGVtZW50IHNvbHZlcyB0aGlzLlxyXG4gKlxyXG4gKiBUaGlzIGFsc28gcmVzdWx0cyBpbiB0aGUgbGFiZWwgYW5kL29yIGxlZ2VuZCBiZWluZyBhbm5vdW5jZWQgY29ycmVjdGx5IGluXHJcbiAqIE5WREEgKGFzIHRlc3RlZCBpbiAyMDE4LjMuMikgLSB3aXRob3V0IHRoaXMgb25seSB0aGUgZmllbGQgdHlwZSBpcyBhbm5vdW5jZWRcclxuICogKGUuZy4gXCJFZGl0LCBoYXMgYXV0b2NvbXBsZXRlXCIpLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkdGFyZ2V0IC0gRXZlbnQgdGFyZ2V0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB0YXJnZXQgd2FzIGFibGUgdG8gYmUgZm9jdXNzZWRcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuZm9jdXNUYXJnZXQgPSBmdW5jdGlvbiAoJHRhcmdldCkge1xyXG4gIC8vIElmIHRoZSBlbGVtZW50IHRoYXQgd2FzIGNsaWNrZWQgd2FzIG5vdCBhIGxpbmssIHJldHVybiBlYXJseVxyXG4gIGlmICgkdGFyZ2V0LnRhZ05hbWUgIT09ICdBJyB8fCAkdGFyZ2V0LmhyZWYgPT09IGZhbHNlKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIHZhciBpbnB1dElkID0gdGhpcy5nZXRGcmFnbWVudEZyb21VcmwoJHRhcmdldC5ocmVmKVxyXG4gIHZhciAkaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dElkKVxyXG4gIGlmICghJGlucHV0KSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIHZhciAkbGVnZW5kT3JMYWJlbCA9IHRoaXMuZ2V0QXNzb2NpYXRlZExlZ2VuZE9yTGFiZWwoJGlucHV0KVxyXG4gIGlmICghJGxlZ2VuZE9yTGFiZWwpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLy8gU2Nyb2xsIHRoZSBsZWdlbmQgb3IgbGFiZWwgaW50byB2aWV3ICpiZWZvcmUqIGNhbGxpbmcgZm9jdXMgb24gdGhlIGlucHV0IHRvXHJcbiAgLy8gYXZvaWQgZXh0cmEgc2Nyb2xsaW5nIGluIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBgcHJldmVudFNjcm9sbGAgKHdoaWNoXHJcbiAgLy8gYXQgdGltZSBvZiB3cml0aW5nIGlzIG1vc3Qgb2YgdGhlbS4uLilcclxuICAkbGVnZW5kT3JMYWJlbC5zY3JvbGxJbnRvVmlldygpXHJcbiAgJGlucHV0LmZvY3VzKHsgcHJldmVudFNjcm9sbDogdHJ1ZSB9KVxyXG5cclxuICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGZyYWdtZW50IGZyb20gVVJMXHJcbiAqXHJcbiAqIEV4dHJhY3QgdGhlIGZyYWdtZW50IChldmVyeXRoaW5nIGFmdGVyIHRoZSBoYXNoKSBmcm9tIGEgVVJMLCBidXQgbm90IGluY2x1ZGluZ1xyXG4gKiB0aGUgaGFzaC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVSTFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBGcmFnbWVudCBmcm9tIFVSTCwgd2l0aG91dCB0aGUgaGFzaFxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5nZXRGcmFnbWVudEZyb21VcmwgPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgaWYgKHVybC5pbmRleE9mKCcjJykgPT09IC0xKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIHJldHVybiB1cmwuc3BsaXQoJyMnKS5wb3AoKVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGFzc29jaWF0ZWQgbGVnZW5kIG9yIGxhYmVsXHJcbiAqXHJcbiAqIFJldHVybnMgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBleGlzdHMgZnJvbSB0aGlzIGxpc3Q6XHJcbiAqXHJcbiAqIC0gVGhlIGA8bGVnZW5kPmAgYXNzb2NpYXRlZCB3aXRoIHRoZSBjbG9zZXN0IGA8ZmllbGRzZXQ+YCBhbmNlc3RvciwgYXMgbG9uZ1xyXG4gKiAgIGFzIHRoZSB0b3Agb2YgaXQgaXMgbm8gbW9yZSB0aGFuIGhhbGYgYSB2aWV3cG9ydCBoZWlnaHQgYXdheSBmcm9tIHRoZVxyXG4gKiAgIGJvdHRvbSBvZiB0aGUgaW5wdXRcclxuICogLSBUaGUgZmlyc3QgYDxsYWJlbD5gIHRoYXQgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dCB1c2luZyBmb3I9XCJpbnB1dElkXCJcclxuICogLSBUaGUgY2xvc2VzdCBwYXJlbnQgYDxsYWJlbD5gXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICRpbnB1dCAtIFRoZSBpbnB1dFxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IEFzc29jaWF0ZWQgbGVnZW5kIG9yIGxhYmVsLCBvciBudWxsIGlmIG5vIGFzc29jaWF0ZWRcclxuICogICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQgb3IgbGFiZWwgY2FuIGJlIGZvdW5kXHJcbiAqL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmdldEFzc29jaWF0ZWRMZWdlbmRPckxhYmVsID0gZnVuY3Rpb24gKCRpbnB1dCkge1xyXG4gIHZhciAkZmllbGRzZXQgPSAkaW5wdXQuY2xvc2VzdCgnZmllbGRzZXQnKVxyXG5cclxuICBpZiAoJGZpZWxkc2V0KSB7XHJcbiAgICB2YXIgbGVnZW5kcyA9ICRmaWVsZHNldC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGVnZW5kJylcclxuXHJcbiAgICBpZiAobGVnZW5kcy5sZW5ndGgpIHtcclxuICAgICAgdmFyICRjYW5kaWRhdGVMZWdlbmQgPSBsZWdlbmRzWzBdXHJcblxyXG4gICAgICAvLyBJZiB0aGUgaW5wdXQgdHlwZSBpcyByYWRpbyBvciBjaGVja2JveCwgYWx3YXlzIHVzZSB0aGUgbGVnZW5kIGlmIHRoZXJlXHJcbiAgICAgIC8vIGlzIG9uZS5cclxuICAgICAgaWYgKCRpbnB1dC50eXBlID09PSAnY2hlY2tib3gnIHx8ICRpbnB1dC50eXBlID09PSAncmFkaW8nKSB7XHJcbiAgICAgICAgcmV0dXJuICRjYW5kaWRhdGVMZWdlbmRcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRm9yIG90aGVyIGlucHV0IHR5cGVzLCBvbmx5IHNjcm9sbCB0byB0aGUgZmllbGRzZXTigJlzIGxlZ2VuZCAoaW5zdGVhZCBvZlxyXG4gICAgICAvLyB0aGUgbGFiZWwgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dCkgaWYgdGhlIGlucHV0IHdvdWxkIGVuZCB1cCBpbiB0aGVcclxuICAgICAgLy8gdG9wIGhhbGYgb2YgdGhlIHNjcmVlbi5cclxuICAgICAgLy9cclxuICAgICAgLy8gVGhpcyBzaG91bGQgYXZvaWQgc2l0dWF0aW9ucyB3aGVyZSB0aGUgaW5wdXQgZWl0aGVyIGVuZHMgdXAgb2ZmIHRoZVxyXG4gICAgICAvLyBzY3JlZW4sIG9yIG9ic2N1cmVkIGJ5IGEgc29mdHdhcmUga2V5Ym9hcmQuXHJcbiAgICAgIHZhciBsZWdlbmRUb3AgPSAkY2FuZGlkYXRlTGVnZW5kLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxyXG4gICAgICB2YXIgaW5wdXRSZWN0ID0gJGlucHV0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcblxyXG4gICAgICAvLyBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHRcclxuICAgICAgLy8gb3Igd2luZG93LmlubmVySGVpZ2h0IChsaWtlIElFOCksIGJhaWwgYW5kIGp1c3QgbGluayB0byB0aGUgbGFiZWwuXHJcbiAgICAgIGlmIChpbnB1dFJlY3QuaGVpZ2h0ICYmIHdpbmRvdy5pbm5lckhlaWdodCkge1xyXG4gICAgICAgIHZhciBpbnB1dEJvdHRvbSA9IGlucHV0UmVjdC50b3AgKyBpbnB1dFJlY3QuaGVpZ2h0XHJcblxyXG4gICAgICAgIGlmIChpbnB1dEJvdHRvbSAtIGxlZ2VuZFRvcCA8IHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIHtcclxuICAgICAgICAgIHJldHVybiAkY2FuZGlkYXRlTGVnZW5kXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImxhYmVsW2Zvcj0nXCIgKyAkaW5wdXQuZ2V0QXR0cmlidXRlKCdpZCcpICsgXCInXVwiKSB8fFxyXG4gICAgJGlucHV0LmNsb3Nlc3QoJ2xhYmVsJylcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXJyb3JTdW1tYXJ5IiwiXHJcbmZ1bmN0aW9uIE1vZGFsICgkbW9kYWwpe1xyXG4gIHRoaXMuJG1vZGFsID0gJG1vZGFsO1xyXG4gIGxldCBpZCA9IHRoaXMuJG1vZGFsLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICB0aGlzLnRyaWdnZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kdWxlPVwibW9kYWxcIl1bZGF0YS10YXJnZXQ9XCInK2lkKydcIl0nKTtcclxuICB3aW5kb3cubW9kYWwgPSB7XCJsYXN0Rm9jdXNcIjogZG9jdW1lbnQuYWN0aXZlRWxlbWVudCwgXCJpZ25vcmVVdGlsRm9jdXNDaGFuZ2VzXCI6IGZhbHNlfTtcclxufVxyXG5cclxuTW9kYWwucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHRyaWdnZXJzID0gdGhpcy50cmlnZ2VycztcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRyaWdnZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgIGxldCB0cmlnZ2VyID0gdHJpZ2dlcnNbIGkgXTtcclxuICAgIHRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNob3cuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG4gIGxldCBjbG9zZXJzID0gdGhpcy4kbW9kYWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kYWwtY2xvc2VdJyk7XHJcbiAgZm9yIChsZXQgYyA9IDA7IGMgPCBjbG9zZXJzLmxlbmd0aDsgYysrKXtcclxuICAgIGxldCBjbG9zZXIgPSBjbG9zZXJzWyBjIF07XHJcbiAgICBjbG9zZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGUuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKXtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gdGhpcy4kbW9kYWw7XHJcbiAgaWYobW9kYWxFbGVtZW50ICE9PSBudWxsKXtcclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcbiAgICBsZXQgZXZlbnRDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgZXZlbnRDbG9zZS5pbml0RXZlbnQoJ2Zkcy5tb2RhbC5oaWRkZW4nLCB0cnVlLCB0cnVlKTtcclxuICAgIG1vZGFsRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG5cclxuICAgIGxldCAkYmFja2Ryb3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbW9kYWwtYmFja2Ryb3AnKTtcclxuICAgICRiYWNrZHJvcC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCRiYWNrZHJvcCk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QucmVtb3ZlKCdtb2RhbC1vcGVuJyk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMudHJhcEZvY3VzLCB0cnVlKTtcclxuXHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUVzY2FwZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuXHJcbk1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKCl7XHJcbiAgbGV0IG1vZGFsRWxlbWVudCA9IHRoaXMuJG1vZGFsO1xyXG4gIGlmKG1vZGFsRWxlbWVudCAhPT0gbnVsbCl7XHJcbiAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgbW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcclxuXHJcbiAgICBsZXQgZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICBldmVudE9wZW4uaW5pdEV2ZW50KCdmZHMubW9kYWwuc2hvd24nLCB0cnVlLCB0cnVlKTtcclxuICAgIG1vZGFsRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcblxyXG4gICAgbGV0ICRiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgJGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ21vZGFsLWJhY2tkcm9wJyk7XHJcbiAgICAkYmFja2Ryb3Auc2V0QXR0cmlidXRlKCdpZCcsIFwibW9kYWwtYmFja2Ryb3BcIik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKCRiYWNrZHJvcCk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJyk7XHJcblxyXG4gICAgbW9kYWxFbGVtZW50LmZvY3VzKCk7XHJcbiAgICB3aW5kb3cubW9kYWwubGFzdEZvY3VzID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMudHJhcEZvY3VzLCB0cnVlKTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUVzY2FwZSk7XHJcblxyXG4gIH1cclxufTtcclxuXHJcbmxldCBoYW5kbGVFc2NhcGUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKTtcclxuICBsZXQgY3VycmVudE1vZGFsID0gbmV3IE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJykpO1xyXG4gIGlmIChrZXkgPT09IDI3KXtcclxuICAgIGxldCBwb3NzaWJsZU92ZXJmbG93TWVudXMgPSBtb2RhbEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJ1dHRvbi1vdmVyZmxvdy1tZW51W2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICBpZihwb3NzaWJsZU92ZXJmbG93TWVudXMubGVuZ3RoID09PSAwKXtcclxuICAgICAgY3VycmVudE1vZGFsLmhpZGUoKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5cclxuTW9kYWwucHJvdG90eXBlLnRyYXBGb2N1cyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgIGlmICh3aW5kb3cubW9kYWwuaWdub3JlVXRpbEZvY3VzQ2hhbmdlcykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgY3VycmVudERpYWxvZyA9IG5ldyBNb2RhbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmRzLW1vZGFsW2FyaWEtaGlkZGVuPWZhbHNlXScpKTtcclxuICAgIGlmIChjdXJyZW50RGlhbG9nLiRtb2RhbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtb2RhbC1jb250ZW50JylbMF0uY29udGFpbnMoZXZlbnQudGFyZ2V0KSB8fCBjdXJyZW50RGlhbG9nLiRtb2RhbCA9PSBldmVudC50YXJnZXQpIHtcclxuICAgICAgd2luZG93Lm1vZGFsLmxhc3RGb2N1cyA9IGV2ZW50LnRhcmdldDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBjdXJyZW50RGlhbG9nLmZvY3VzRmlyc3REZXNjZW5kYW50KGN1cnJlbnREaWFsb2cuJG1vZGFsKTtcclxuICAgICAgaWYgKHdpbmRvdy5tb2RhbC5sYXN0Rm9jdXMgPT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xyXG4gICAgICAgIGN1cnJlbnREaWFsb2cuZm9jdXNMYXN0RGVzY2VuZGFudChjdXJyZW50RGlhbG9nLiRtb2RhbCk7XHJcbiAgICAgIH1cclxuICAgICAgd2luZG93Lm1vZGFsLmxhc3RGb2N1cyA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuaXNGb2N1c2FibGUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gIGlmIChlbGVtZW50LnRhYkluZGV4ID4gMCB8fCAoZWxlbWVudC50YWJJbmRleCA9PT0gMCAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZSgndGFiSW5kZXgnKSAhPT0gbnVsbCkpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgaWYgKGVsZW1lbnQuZGlzYWJsZWQpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHN3aXRjaCAoZWxlbWVudC5ub2RlTmFtZSkge1xyXG4gICAgY2FzZSAnQSc6XHJcbiAgICAgIHJldHVybiAhIWVsZW1lbnQuaHJlZiAmJiBlbGVtZW50LnJlbCAhPSAnaWdub3JlJztcclxuICAgIGNhc2UgJ0lOUFVUJzpcclxuICAgICAgcmV0dXJuIGVsZW1lbnQudHlwZSAhPSAnaGlkZGVuJyAmJiBlbGVtZW50LnR5cGUgIT0gJ2ZpbGUnO1xyXG4gICAgY2FzZSAnQlVUVE9OJzpcclxuICAgIGNhc2UgJ1NFTEVDVCc6XHJcbiAgICBjYXNlICdURVhUQVJFQSc6XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5Nb2RhbC5wcm90b3R5cGUuZm9jdXNGaXJzdERlc2NlbmRhbnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgY2hpbGQgPSBlbGVtZW50LmNoaWxkTm9kZXNbaV07XHJcbiAgICBpZiAodGhpcy5hdHRlbXB0Rm9jdXMoY2hpbGQpIHx8XHJcbiAgICAgIHRoaXMuZm9jdXNGaXJzdERlc2NlbmRhbnQoY2hpbGQpKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLmZvY3VzTGFzdERlc2NlbmRhbnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gIGZvciAodmFyIGkgPSBlbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgIHZhciBjaGlsZCA9IGVsZW1lbnQuY2hpbGROb2Rlc1tpXTtcclxuICAgIGlmICh0aGlzLmF0dGVtcHRGb2N1cyhjaGlsZCkgfHxcclxuICAgICAgdGhpcy5mb2N1c0xhc3REZXNjZW5kYW50KGNoaWxkKSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuTW9kYWwucHJvdG90eXBlLmF0dGVtcHRGb2N1cyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgaWYgKCF0aGlzLmlzRm9jdXNhYmxlKGVsZW1lbnQpKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICB3aW5kb3cubW9kYWwuaWdub3JlVXRpbEZvY3VzQ2hhbmdlcyA9IHRydWU7XHJcbiAgdHJ5IHtcclxuICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICB9XHJcbiAgd2luZG93Lm1vZGFsLmlnbm9yZVV0aWxGb2N1c0NoYW5nZXMgPSBmYWxzZTtcclxuICByZXR1cm4gKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGVsZW1lbnQpO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1vZGFsO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XHJcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xyXG5jb25zdCBkcm9wZG93biA9IHJlcXVpcmUoJy4vZHJvcGRvd24nKTtcclxuXHJcbmNvbnN0IE5BViA9IGAubmF2YDtcclxuY29uc3QgTkFWX0xJTktTID0gYCR7TkFWfSBhYDtcclxuY29uc3QgT1BFTkVSUyA9IGAuanMtbWVudS1vcGVuYDtcclxuY29uc3QgQ0xPU0VfQlVUVE9OID0gYC5qcy1tZW51LWNsb3NlYDtcclxuY29uc3QgT1ZFUkxBWSA9IGAub3ZlcmxheWA7XHJcbmNvbnN0IENMT1NFUlMgPSBgJHtDTE9TRV9CVVRUT059LCAub3ZlcmxheWA7XHJcbmNvbnN0IFRPR0dMRVMgPSBbIE5BViwgT1ZFUkxBWSBdLmpvaW4oJywgJyk7XHJcblxyXG5jb25zdCBBQ1RJVkVfQ0xBU1MgPSAnbW9iaWxlX25hdi1hY3RpdmUnO1xyXG5jb25zdCBWSVNJQkxFX0NMQVNTID0gJ2lzLXZpc2libGUnO1xyXG5cclxuY29uc3QgaXNBY3RpdmUgPSAoKSA9PiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhBQ1RJVkVfQ0xBU1MpO1xyXG5cclxuY29uc3QgX2ZvY3VzVHJhcCA9ICh0cmFwQ29udGFpbmVyKSA9PiB7XHJcblxyXG4gIC8vIEZpbmQgYWxsIGZvY3VzYWJsZSBjaGlsZHJlblxyXG4gIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nID0gJ2FbaHJlZl0sIGFyZWFbaHJlZl0sIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCBpZnJhbWUsIG9iamVjdCwgZW1iZWQsIFt0YWJpbmRleD1cIjBcIl0sIFtjb250ZW50ZWRpdGFibGVdJztcclxuICBsZXQgZm9jdXNhYmxlRWxlbWVudHMgPSB0cmFwQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcpO1xyXG4gIGxldCBmaXJzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1sgMCBdO1xyXG5cclxuICBmdW5jdGlvbiB0cmFwVGFiS2V5IChlKSB7XHJcbiAgICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICAgIC8vIENoZWNrIGZvciBUQUIga2V5IHByZXNzXHJcbiAgICBpZiAoa2V5ID09PSA5KSB7XHJcblxyXG4gICAgICBsZXQgbGFzdFRhYlN0b3AgPSBudWxsO1xyXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIGxldCBudW1iZXIgPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZm9jdXNhYmxlRWxlbWVudHNbIG51bWJlciAtIGkgXTtcclxuICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA+IDAgJiYgZWxlbWVudC5vZmZzZXRIZWlnaHQgPiAwKSB7XHJcbiAgICAgICAgICBsYXN0VGFiU3RvcCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFNISUZUICsgVEFCXHJcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0VGFiU3RvcCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgbGFzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAvLyBUQUJcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdFRhYlN0b3ApIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEVTQ0FQRVxyXG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xyXG4gICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZW5hYmxlICgpIHtcclxuICAgICAgICAvLyBGb2N1cyBmaXJzdCBjaGlsZFxyXG4gICAgICAgIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAvLyBMaXN0ZW4gZm9yIGFuZCB0cmFwIHRoZSBrZXlib2FyZFxyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcFRhYktleSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbGVhc2UgKCkge1xyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcFRhYktleSk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcblxyXG5sZXQgZm9jdXNUcmFwO1xyXG5cclxuY29uc3QgdG9nZ2xlTmF2ID0gZnVuY3Rpb24gKGFjdGl2ZSkge1xyXG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gIGlmICh0eXBlb2YgYWN0aXZlICE9PSAnYm9vbGVhbicpIHtcclxuICAgIGFjdGl2ZSA9ICFpc0FjdGl2ZSgpO1xyXG4gIH1cclxuICBib2R5LmNsYXNzTGlzdC50b2dnbGUoQUNUSVZFX0NMQVNTLCBhY3RpdmUpO1xyXG5cclxuICBmb3JFYWNoKHNlbGVjdChUT0dHTEVTKSwgZWwgPT4ge1xyXG4gICAgZWwuY2xhc3NMaXN0LnRvZ2dsZShWSVNJQkxFX0NMQVNTLCBhY3RpdmUpO1xyXG4gIH0pO1xyXG4gIGlmIChhY3RpdmUpIHtcclxuICAgIGZvY3VzVHJhcC5lbmFibGUoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZm9jdXNUcmFwLnJlbGVhc2UoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNsb3NlQnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcbiAgY29uc3QgbWVudUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihPUEVORVJTKTtcclxuXHJcbiAgaWYgKGFjdGl2ZSAmJiBjbG9zZUJ1dHRvbikge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgYWN0aXZhdGVkLCBzbyBmb2N1cyBvbiB0aGUgY2xvc2UgYnV0dG9uLFxyXG4gICAgLy8gd2hpY2ggaXMganVzdCBiZWZvcmUgYWxsIHRoZSBuYXYgZWxlbWVudHMgaW4gdGhlIHRhYiBvcmRlci5cclxuICAgIGNsb3NlQnV0dG9uLmZvY3VzKCk7XHJcbiAgfSBlbHNlIGlmICghYWN0aXZlICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGNsb3NlQnV0dG9uICYmXHJcbiAgICAgICAgICAgICBtZW51QnV0dG9uKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBkZWFjdGl2YXRlZCwgYW5kIGZvY3VzIHdhcyBvbiB0aGUgY2xvc2VcclxuICAgIC8vIGJ1dHRvbiwgd2hpY2ggaXMgbm8gbG9uZ2VyIHZpc2libGUuIFdlIGRvbid0IHdhbnQgdGhlIGZvY3VzIHRvXHJcbiAgICAvLyBkaXNhcHBlYXIgaW50byB0aGUgdm9pZCwgc28gZm9jdXMgb24gdGhlIG1lbnUgYnV0dG9uIGlmIGl0J3NcclxuICAgIC8vIHZpc2libGUgKHRoaXMgbWF5IGhhdmUgYmVlbiB3aGF0IHRoZSB1c2VyIHdhcyBqdXN0IGZvY3VzZWQgb24sXHJcbiAgICAvLyBpZiB0aGV5IHRyaWdnZXJlZCB0aGUgbW9iaWxlIG5hdiBieSBtaXN0YWtlKS5cclxuICAgIG1lbnVCdXR0b24uZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhY3RpdmU7XHJcbn07XHJcblxyXG5jb25zdCByZXNpemUgPSAoKSA9PiB7XHJcblxyXG4gIGxldCBtb2JpbGUgPSBmYWxzZTtcclxuICBsZXQgb3BlbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoT1BFTkVSUyk7XHJcbiAgZm9yKGxldCBvID0gMDsgbyA8IG9wZW5lcnMubGVuZ3RoOyBvKyspIHtcclxuICAgIGlmKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG9wZW5lcnNbb10sIG51bGwpLmRpc3BsYXkgIT09ICdub25lJykge1xyXG4gICAgICBvcGVuZXJzW29dLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTmF2KTtcclxuICAgICAgbW9iaWxlID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmKG1vYmlsZSl7XHJcbiAgICBsZXQgY2xvc2VycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQ0xPU0VSUyk7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2xvc2Vycy5sZW5ndGg7IGMrKykge1xyXG4gICAgICBjbG9zZXJzWyBjIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVOYXYpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBuYXZMaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoTkFWX0xJTktTKTtcclxuICAgIGZvcihsZXQgbiA9IDA7IG4gPCBuYXZMaW5rcy5sZW5ndGg7IG4rKykge1xyXG4gICAgICBuYXZMaW5rc1sgbiBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyBBIG5hdmlnYXRpb24gbGluayBoYXMgYmVlbiBjbGlja2VkISBXZSB3YW50IHRvIGNvbGxhcHNlIGFueVxyXG4gICAgICAgIC8vIGhpZXJhcmNoaWNhbCBuYXZpZ2F0aW9uIFVJIGl0J3MgYSBwYXJ0IG9mLCBzbyB0aGF0IHRoZSB1c2VyXHJcbiAgICAgICAgLy8gY2FuIGZvY3VzIG9uIHdoYXRldmVyIHRoZXkndmUganVzdCBzZWxlY3RlZC5cclxuXHJcbiAgICAgICAgLy8gU29tZSBuYXZpZ2F0aW9uIGxpbmtzIGFyZSBpbnNpZGUgZHJvcGRvd25zOyB3aGVuIHRoZXkncmVcclxuICAgICAgICAvLyBjbGlja2VkLCB3ZSB3YW50IHRvIGNvbGxhcHNlIHRob3NlIGRyb3Bkb3ducy5cclxuXHJcblxyXG4gICAgICAgIC8vIElmIHRoZSBtb2JpbGUgbmF2aWdhdGlvbiBtZW51IGlzIGFjdGl2ZSwgd2Ugd2FudCB0byBoaWRlIGl0LlxyXG4gICAgICAgIGlmIChpc0FjdGl2ZSgpKSB7XHJcbiAgICAgICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0cmFwQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoTkFWKTtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0cmFwQ29udGFpbmVycy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIGZvY3VzVHJhcCA9IF9mb2N1c1RyYXAodHJhcENvbnRhaW5lcnNbaV0pO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGNvbnN0IGNsb3NlciA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihDTE9TRV9CVVRUT04pO1xyXG5cclxuICBpZiAoaXNBY3RpdmUoKSAmJiBjbG9zZXIgJiYgY2xvc2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoID09PSAwKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiBpcyBhY3RpdmUsIGJ1dCB0aGUgY2xvc2UgYm94IGlzbid0IHZpc2libGUsIHdoaWNoXHJcbiAgICAvLyBtZWFucyB0aGUgdXNlcidzIHZpZXdwb3J0IGhhcyBiZWVuIHJlc2l6ZWQgc28gdGhhdCBpdCBpcyBubyBsb25nZXJcclxuICAgIC8vIGluIG1vYmlsZSBtb2RlLiBMZXQncyBtYWtlIHRoZSBwYWdlIHN0YXRlIGNvbnNpc3RlbnQgYnlcclxuICAgIC8vIGRlYWN0aXZhdGluZyB0aGUgbW9iaWxlIG5hdi5cclxuICAgIHRvZ2dsZU5hdi5jYWxsKGNsb3NlciwgZmFsc2UpO1xyXG4gIH1cclxufTtcclxuXHJcbmNsYXNzIE5hdmlnYXRpb24ge1xyXG4gIGNvbnN0cnVjdG9yICgpe1xyXG4gICAgdGhpcy5pbml0KCk7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSwgZmFsc2UpO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICBpbml0ICgpIHtcclxuXHJcbiAgICByZXNpemUoKTtcclxuICB9XHJcblxyXG4gIHRlYXJkb3duICgpIHtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUsIGZhbHNlKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTmF2aWdhdGlvbjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuY2xhc3MgUmFkaW9Ub2dnbGVHcm91cHtcclxuICAgIGNvbnN0cnVjdG9yKGVsKXtcclxuICAgICAgICB0aGlzLmpzVG9nZ2xlVHJpZ2dlciA9ICcuanMtcmFkaW8tdG9nZ2xlLWdyb3VwJztcclxuICAgICAgICB0aGlzLmpzVG9nZ2xlVGFyZ2V0ID0gJ2RhdGEtanMtdGFyZ2V0JztcclxuXHJcbiAgICAgICAgdGhpcy5ldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICAgICAgdGhpcy5ldmVudENsb3NlLmluaXRFdmVudCgnZmRzLmNvbGxhcHNlLmNsb3NlJywgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICAgICAgdGhpcy5ldmVudE9wZW4uaW5pdEV2ZW50KCdmZHMuY29sbGFwc2Uub3BlbicsIHRydWUsIHRydWUpO1xyXG4gICAgICAgIHRoaXMucmFkaW9FbHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmluaXQoZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQgKGVsKXtcclxuICAgICAgICB0aGlzLnJhZGlvR3JvdXAgPSBlbDtcclxuICAgICAgICB0aGlzLnJhZGlvRWxzID0gdGhpcy5yYWRpb0dyb3VwLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xyXG4gICAgICAgIGlmKHRoaXMucmFkaW9FbHMubGVuZ3RoID09PSAwKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyByYWRpb2J1dHRvbnMgZm91bmQgaW4gcmFkaW9idXR0b24gZ3JvdXAuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMucmFkaW9FbHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICB2YXIgcmFkaW8gPSB0aGlzLnJhZGlvRWxzWyBpIF07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgYSA9IDA7IGEgPCB0aGF0LnJhZGlvRWxzLmxlbmd0aDsgYSsrICl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC50b2dnbGUodGhhdC5yYWRpb0Vsc1sgYSBdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlKHJhZGlvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlICh0cmlnZ2VyRWwpe1xyXG4gICAgICAgIHZhciB0YXJnZXRBdHRyID0gdHJpZ2dlckVsLmdldEF0dHJpYnV0ZSh0aGlzLmpzVG9nZ2xlVGFyZ2V0KTtcclxuICAgICAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXRBdHRyICE9PSBcIlwiKXtcclxuICAgICAgICAgICAgdmFyIHRhcmdldEVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXRBdHRyKTtcclxuICAgICAgICAgICAgaWYodGFyZ2V0RWwgPT09IG51bGwgfHwgdGFyZ2V0RWwgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHBhbmVsIGVsZW1lbnQuIFZlcmlmeSB2YWx1ZSBvZiBhdHRyaWJ1dGUgYCsgdGhpcy5qc1RvZ2dsZVRhcmdldCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodHJpZ2dlckVsLmNoZWNrZWQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuKHRyaWdnZXJFbCwgdGFyZ2V0RWwpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3Blbih0cmlnZ2VyRWwsIHRhcmdldEVsKXtcclxuICAgICAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudCh0aGlzLmV2ZW50T3Blbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xvc2UodHJpZ2dlckVsLCB0YXJnZXRFbCl7XHJcbiAgICAgICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQodGhpcy5ldmVudENsb3NlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmFkaW9Ub2dnbGVHcm91cDtcclxuIiwiLypcclxuKiBQcmV2ZW50cyB0aGUgdXNlciBmcm9tIGlucHV0dGluZyBiYXNlZCBvbiBhIHJlZ2V4LlxyXG4qIERvZXMgbm90IHdvcmsgdGhlIHNhbWUgd2F5IGFmIDxpbnB1dCBwYXR0ZXJuPVwiXCI+LCB0aGlzIHBhdHRlcm4gaXMgb25seSB1c2VkIGZvciB2YWxpZGF0aW9uLCBub3QgdG8gcHJldmVudCBpbnB1dC5cclxuKiBVc2VjYXNlOiBudW1iZXIgaW5wdXQgZm9yIGRhdGUtY29tcG9uZW50LlxyXG4qIEV4YW1wbGUgLSBudW1iZXIgb25seTogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1pbnB1dC1yZWdleD1cIl5cXGQqJFwiPlxyXG4qL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBtb2RpZmllclN0YXRlID0ge1xyXG4gIHNoaWZ0OiBmYWxzZSxcclxuICBhbHQ6IGZhbHNlLFxyXG4gIGN0cmw6IGZhbHNlLFxyXG4gIGNvbW1hbmQ6IGZhbHNlXHJcbn07XHJcblxyXG5jbGFzcyBJbnB1dFJlZ2V4TWFzayB7XHJcbiAgY29uc3RydWN0b3IgKGVsZW1lbnQpe1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIHJlZ2V4TWFzayk7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCByZWdleE1hc2spO1xyXG4gIH1cclxufVxyXG52YXIgcmVnZXhNYXNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgaWYobW9kaWZpZXJTdGF0ZS5jdHJsIHx8IG1vZGlmaWVyU3RhdGUuY29tbWFuZCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgbmV3Q2hhciA9IG51bGw7XHJcbiAgaWYodHlwZW9mIGV2ZW50LmtleSAhPT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgaWYoZXZlbnQua2V5Lmxlbmd0aCA9PT0gMSl7XHJcbiAgICAgIG5ld0NoYXIgPSBldmVudC5rZXk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmKCFldmVudC5jaGFyQ29kZSl7XHJcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmtleUNvZGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV3Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQuY2hhckNvZGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIHJlZ2V4U3RyID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtaW5wdXQtcmVnZXgnKTtcclxuXHJcbiAgaWYoZXZlbnQudHlwZSAhPT0gdW5kZWZpbmVkICYmIGV2ZW50LnR5cGUgPT09ICdwYXN0ZScpe1xyXG4gICAgY29uc29sZS5sb2coJ3Bhc3RlJyk7XHJcbiAgfSBlbHNle1xyXG4gICAgdmFyIGVsZW1lbnQgPSBudWxsO1xyXG4gICAgaWYoZXZlbnQudGFyZ2V0ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgaWYobmV3Q2hhciAhPT0gbnVsbCAmJiBlbGVtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgIGlmKG5ld0NoYXIubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZihlbGVtZW50LnR5cGUgPT09ICdudW1iZXInKXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTsvL05vdGUgaW5wdXRbdHlwZT1udW1iZXJdIGRvZXMgbm90IGhhdmUgLnNlbGVjdGlvblN0YXJ0L0VuZCAoQ2hyb21lKS5cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZS5zbGljZSgwLCBlbGVtZW50LnNlbGVjdGlvblN0YXJ0KSArIHRoaXMudmFsdWUuc2xpY2UoZWxlbWVudC5zZWxlY3Rpb25FbmQpICsgbmV3Q2hhcjsgLy9yZW1vdmVzIHRoZSBudW1iZXJzIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLCB0aGVuIGFkZHMgbmV3IGNoYXIuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgciA9IG5ldyBSZWdFeHAocmVnZXhTdHIpO1xyXG4gICAgICAgIGlmKHIuZXhlYyhuZXdWYWx1ZSkgPT09IG51bGwpe1xyXG4gICAgICAgICAgaWYgKGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5wdXRSZWdleE1hc2s7XHJcbiIsImxldCBkayA9IHtcclxuICBcInNlbGVjdF9yb3dcIjogXCJWw6ZsZyByw6Zra2VcIixcclxuICBcInVuc2VsZWN0X3Jvd1wiOiBcIkZyYXbDpmxnIHLDpmtrZVwiLFxyXG4gIFwic2VsZWN0X2FsbF9yb3dzXCI6IFwiVsOmbGcgYWxsZSByw6Zra2VyXCIsXHJcbiAgXCJ1bnNlbGVjdF9hbGxfcm93c1wiOiBcIkZyYXbDpmxnIGFsbGUgcsOma2tlclwiXHJcbn1cclxuXHJcbmNsYXNzIFRhYmxlU2VsZWN0YWJsZVJvd3Mge1xyXG4gIGNvbnN0cnVjdG9yICh0YWJsZSwgc3RyaW5ncyA9IGRrKSB7XHJcbiAgICB0aGlzLnRhYmxlID0gdGFibGU7XHJcbiAgICBkayA9IHN0cmluZ3M7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbml0aWFsaXplIGV2ZW50bGlzdGVuZXJzIGZvciBjaGVja2JveGVzIGluIHRhYmxlXHJcbiAgICovXHJcbiAgaW5pdCgpe1xyXG4gICAgdGhpcy5ncm91cENoZWNrYm94ID0gdGhpcy5nZXRHcm91cENoZWNrYm94KCk7XHJcbiAgICB0aGlzLnRib2R5Q2hlY2tib3hMaXN0ID0gdGhpcy5nZXRDaGVja2JveExpc3QoKTtcclxuICAgIGlmKHRoaXMudGJvZHlDaGVja2JveExpc3QubGVuZ3RoICE9PSAwKXtcclxuICAgICAgZm9yKGxldCBjID0gMDsgYyA8IHRoaXMudGJvZHlDaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xyXG4gICAgICAgIGxldCBjaGVja2JveCA9IHRoaXMudGJvZHlDaGVja2JveExpc3RbY107XHJcbiAgICAgICAgY2hlY2tib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlR3JvdXBDaGVjayk7XHJcbiAgICAgICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlR3JvdXBDaGVjayk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmKHRoaXMuZ3JvdXBDaGVja2JveCAhPT0gZmFsc2Upe1xyXG4gICAgICB0aGlzLmdyb3VwQ2hlY2tib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlQ2hlY2tib3hMaXN0KTtcclxuICAgICAgdGhpcy5ncm91cENoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUNoZWNrYm94TGlzdCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIC8qKlxyXG4gICAqIEdldCBncm91cCBjaGVja2JveCBpbiB0YWJsZSBoZWFkZXJcclxuICAgKiBAcmV0dXJucyBlbGVtZW50IG9uIHRydWUgLSBmYWxzZSBpZiBub3QgZm91bmRcclxuICAgKi9cclxuICBnZXRHcm91cENoZWNrYm94KCl7XHJcbiAgICBsZXQgY2hlY2tib3ggPSB0aGlzLnRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aGVhZCcpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Zvcm0tY2hlY2tib3gnKTtcclxuICAgIGlmKGNoZWNrYm94Lmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBjaGVja2JveFswXTtcclxuICB9XHJcbiAgLyoqXHJcbiAgICogR2V0IHRhYmxlIGJvZHkgY2hlY2tib3hlc1xyXG4gICAqIEByZXR1cm5zIEhUTUxDb2xsZWN0aW9uXHJcbiAgICovXHJcbiAgZ2V0Q2hlY2tib3hMaXN0KCl7XHJcbiAgICByZXR1cm4gdGhpcy50YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGJvZHknKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JtLWNoZWNrYm94Jyk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlIGNoZWNrYm94ZXMgaW4gdGFibGUgYm9keSB3aGVuIGdyb3VwIGNoZWNrYm94IGlzIGNoYW5nZWRcclxuICogQHBhcmFtIHtFdmVudH0gZSBcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZUNoZWNrYm94TGlzdChlKXtcclxuICBsZXQgY2hlY2tib3ggPSBlLnRhcmdldDtcclxuICBjaGVja2JveC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcpO1xyXG4gIGxldCB0YWJsZSA9IGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgbGV0IHRhYmxlU2VsZWN0YWJsZVJvd3MgPSBuZXcgVGFibGVTZWxlY3RhYmxlUm93cyh0YWJsZSk7XHJcbiAgbGV0IGNoZWNrYm94TGlzdCA9IHRhYmxlU2VsZWN0YWJsZVJvd3MuZ2V0Q2hlY2tib3hMaXN0KCk7XHJcbiAgbGV0IGNoZWNrZWROdW1iZXIgPSAwO1xyXG4gIGlmKGNoZWNrYm94LmNoZWNrZWQpe1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay51bnNlbGVjdF9yb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrZWROdW1iZXIgPSBjaGVja2JveExpc3QubGVuZ3RoO1xyXG4gICAgY2hlY2tib3gubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnVuc2VsZWN0X2FsbF9yb3dzKTtcclxuICB9IGVsc2V7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay5zZWxlY3Rfcm93KTtcclxuICAgIH1cclxuICAgIGNoZWNrYm94Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay5zZWxlY3RfYWxsX3Jvd3MpO1xyXG4gIH1cclxuICBcclxuICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImZkcy50YWJsZS5zZWxlY3RhYmxlLnVwZGF0ZWRcIiwge1xyXG4gICAgYnViYmxlczogdHJ1ZSxcclxuICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICBkZXRhaWw6IHtjaGVja2VkTnVtYmVyfVxyXG4gIH0pO1xyXG4gIHRhYmxlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlIGdyb3VwIGNoZWNrYm94IHdoZW4gY2hlY2tib3ggaW4gdGFibGUgYm9keSBpcyBjaGFuZ2VkXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVHcm91cENoZWNrKGUpe1xyXG4gIC8vIHVwZGF0ZSBsYWJlbCBmb3IgZXZlbnQgY2hlY2tib3hcclxuICBpZihlLnRhcmdldC5jaGVja2VkKXtcclxuICAgIGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICAgIGUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay51bnNlbGVjdF9yb3cpO1xyXG4gIH0gZWxzZXtcclxuICAgIGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICAgIGUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay5zZWxlY3Rfcm93KTtcclxuICB9XHJcbiAgbGV0IHRhYmxlID0gZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICBsZXQgdGFibGVTZWxlY3RhYmxlUm93cyA9IG5ldyBUYWJsZVNlbGVjdGFibGVSb3dzKHRhYmxlKTtcclxuICBsZXQgZ3JvdXBDaGVja2JveCA9IHRhYmxlU2VsZWN0YWJsZVJvd3MuZ2V0R3JvdXBDaGVja2JveCgpO1xyXG4gIGlmKGdyb3VwQ2hlY2tib3ggIT09IGZhbHNlKXtcclxuICAgIGxldCBjaGVja2JveExpc3QgPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldENoZWNrYm94TGlzdCgpO1xyXG5cclxuICAgIC8vIGhvdyBtYW55IHJvdyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgbGV0IGNoZWNrZWROdW1iZXIgPSAwO1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGxldCBsb29wZWRDaGVja2JveCA9IGNoZWNrYm94TGlzdFtjXTtcclxuICAgICAgaWYobG9vcGVkQ2hlY2tib3guY2hlY2tlZCl7XHJcbiAgICAgICAgY2hlY2tlZE51bWJlcisrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKGNoZWNrZWROdW1iZXIgPT09IGNoZWNrYm94TGlzdC5sZW5ndGgpeyAvLyBpZiBhbGwgcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3gubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnVuc2VsZWN0X2FsbF9yb3dzKTtcclxuICAgIH0gZWxzZSBpZihjaGVja2VkTnVtYmVyID09IDApeyAvLyBpZiBubyByb3dzIGhhcyBiZWVuIHNlbGVjdGVkXHJcbiAgICAgIGdyb3VwQ2hlY2tib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3gubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnNlbGVjdF9hbGxfcm93cyk7XHJcbiAgICB9IGVsc2V7IC8vIGlmIHNvbWUgYnV0IG5vdCBhbGwgcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnNldEF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJywgJ21peGVkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICBncm91cENoZWNrYm94Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay5zZWxlY3RfYWxsX3Jvd3MpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJmZHMudGFibGUuc2VsZWN0YWJsZS51cGRhdGVkXCIsIHtcclxuICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgZGV0YWlsOiB7Y2hlY2tlZE51bWJlcn1cclxuICAgIH0pO1xyXG4gICAgdGFibGUuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlU2VsZWN0YWJsZVJvd3M7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgcmVjZXB0b3IgPSByZXF1aXJlKCdyZWNlcHRvcicpO1xyXG5cclxuY2xhc3MgU2V0VGFiSW5kZXgge1xyXG4gIGNvbnN0cnVjdG9yIChlbGVtZW50KXtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKXtcclxuICAgICAgLy8gTkI6IHdlIGtub3cgYmVjYXVzZSBvZiB0aGUgc2VsZWN0b3Igd2UncmUgZGVsZWdhdGluZyB0byBiZWxvdyB0aGF0IHRoZVxyXG4gICAgICAvLyBocmVmIGFscmVhZHkgYmVnaW5zIHdpdGggJyMnXHJcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zbGljZSgxKTtcclxuICAgICAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcclxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHJlY2VwdG9yLm9uY2UoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIHRocm93IGFuIGVycm9yP1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gU2V0VGFiSW5kZXg7XHJcbiIsImNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xyXG5cclxuY2xhc3MgUmVzcG9uc2l2ZVRhYmxlIHtcclxuICAgIGNvbnN0cnVjdG9yICh0YWJsZSkge1xyXG4gICAgICAgIHRoaXMuaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzKHRhYmxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgZGF0YSBhdHRyaWJ1dGVzIG5lZWRlZCBmb3IgcmVzcG9uc2l2ZSBtb2RlLlxyXG4gICAgaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzICh0YWJsZUVsKXtcclxuICAgICAgICBpZiAoIXRhYmxlRWwpIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IGhlYWRlciA9ICB0YWJsZUVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aGVhZCcpO1xyXG4gICAgICAgIGlmKGhlYWRlci5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgIGxldCBoZWFkZXJDZWxsRWxzID0gaGVhZGVyWyAwIF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoJyk7XHJcbiAgICAgICAgICBpZiAoaGVhZGVyQ2VsbEVscy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBoZWFkZXJDZWxsRWxzID0gaGVhZGVyWyAwIF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RkJyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHlSb3dFbHMgPSBzZWxlY3QoJ3Rib2R5IHRyJywgdGFibGVFbCk7XHJcbiAgICAgICAgICAgIEFycmF5LmZyb20oYm9keVJvd0VscykuZm9yRWFjaChyb3dFbCA9PiB7XHJcbiAgICAgICAgICAgICAgbGV0IGNlbGxFbHMgPSByb3dFbC5jaGlsZHJlbjtcclxuICAgICAgICAgICAgICBpZiAoY2VsbEVscy5sZW5ndGggPT09IGhlYWRlckNlbGxFbHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGhlYWRlckNlbGxFbHMpLmZvckVhY2goKGhlYWRlckNlbGxFbCwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAvLyBHcmFiIGhlYWRlciBjZWxsIHRleHQgYW5kIHVzZSBpdCBib2R5IGNlbGwgZGF0YSB0aXRsZS5cclxuICAgICAgICAgICAgICAgICAgaWYoIWNlbGxFbHNbIGkgXS5oYXNBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKSApe1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbGxFbHNbIGkgXS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnLCBoZWFkZXJDZWxsRWwudGV4dENvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZXNwb25zaXZlVGFibGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubGV0IGJyZWFrcG9pbnRzID0ge1xyXG4gICd4cyc6IDAsXHJcbiAgJ3NtJzogNTc2LFxyXG4gICdtZCc6IDc2OCxcclxuICAnbGcnOiA5OTIsXHJcbiAgJ3hsJzogMTIwMFxyXG59O1xyXG5jbGFzcyBUYWJuYXYge1xyXG5cclxuICBjb25zdHJ1Y3RvciAodGFibmF2KSB7XHJcbiAgICB0aGlzLnRhYm5hdiA9IHRhYm5hdjtcclxuICAgIHRoaXMudGFicyA9IHRoaXMudGFibmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xyXG4gICAgaWYodGhpcy50YWJzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGFibmF2IEhUTUwgc2VlbXMgdG8gYmUgbWlzc2luZyB0YWJuYXYtaXRlbS4gQWRkIHRhYm5hdiBpdGVtcyB0byBlbnN1cmUgZWFjaCBwYW5lbCBoYXMgYSBidXR0b24gaW4gdGhlIHRhYm5hdnMgbmF2aWdhdGlvbi5gKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZiBubyBoYXNoIGlzIHNldCBvbiBsb2FkLCBzZXQgYWN0aXZlIHRhYlxyXG4gICAgaWYgKCFzZXRBY3RpdmVIYXNoVGFiKCkpIHtcclxuICAgICAgLy8gc2V0IGZpcnN0IHRhYiBhcyBhY3RpdmVcclxuICAgICAgbGV0IHRhYiA9IHRoaXMudGFic1sgMCBdO1xyXG5cclxuICAgICAgLy8gY2hlY2sgbm8gb3RoZXIgdGFicyBhcyBiZWVuIHNldCBhdCBkZWZhdWx0XHJcbiAgICAgIGxldCBhbHJlYWR5QWN0aXZlID0gZ2V0QWN0aXZlVGFicyh0aGlzLnRhYm5hdik7XHJcbiAgICAgIGlmIChhbHJlYWR5QWN0aXZlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRhYiA9IGFscmVhZHlBY3RpdmVbIDAgXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gYWN0aXZhdGUgYW5kIGRlYWN0aXZhdGUgdGFic1xyXG4gICAgICBhY3RpdmF0ZVRhYih0YWIsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhZGQgZXZlbnRsaXN0ZW5lcnMgb24gYnV0dG9uc1xyXG4gICAgZm9yKGxldCB0ID0gMDsgdCA8IHRoaXMudGFicy5sZW5ndGg7IHQgKyspe1xyXG4gICAgICBhZGRMaXN0ZW5lcnModGhpcy50YWJzWyB0IF0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gRm9yIGVhc3kgcmVmZXJlbmNlXHJcbnZhciBrZXlzID0ge1xyXG4gIGVuZDogMzUsXHJcbiAgaG9tZTogMzYsXHJcbiAgbGVmdDogMzcsXHJcbiAgdXA6IDM4LFxyXG4gIHJpZ2h0OiAzOSxcclxuICBkb3duOiA0MCxcclxuICBkZWxldGU6IDQ2XHJcbn07XHJcblxyXG4vLyBBZGQgb3Igc3Vic3RyYWN0IGRlcGVuZGluZyBvbiBrZXkgcHJlc3NlZFxyXG52YXIgZGlyZWN0aW9uID0ge1xyXG4gIDM3OiAtMSxcclxuICAzODogLTEsXHJcbiAgMzk6IDEsXHJcbiAgNDA6IDFcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnMgKHRhYikge1xyXG4gIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrRXZlbnRMaXN0ZW5lcik7XHJcbiAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duRXZlbnRMaXN0ZW5lcik7XHJcbiAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXBFdmVudExpc3RlbmVyKTtcclxufVxyXG5cclxuLy8gV2hlbiBhIHRhYiBpcyBjbGlja2VkLCBhY3RpdmF0ZVRhYiBpcyBmaXJlZCB0byBhY3RpdmF0ZSBpdFxyXG5mdW5jdGlvbiBjbGlja0V2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XHJcbiAgdmFyIHRhYiA9IHRoaXM7XHJcbiAgYWN0aXZhdGVUYWIodGFiLCBmYWxzZSk7XHJcbn1cclxuXHJcblxyXG4vLyBIYW5kbGUga2V5ZG93biBvbiB0YWJzXHJcbmZ1bmN0aW9uIGtleWRvd25FdmVudExpc3RlbmVyIChldmVudCkge1xyXG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xyXG5cclxuICBzd2l0Y2ggKGtleSkge1xyXG4gICAgY2FzZSBrZXlzLmVuZDpcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gQWN0aXZhdGUgbGFzdCB0YWJcclxuICAgICAgZm9jdXNMYXN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmhvbWU6XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIEFjdGl2YXRlIGZpcnN0IHRhYlxyXG4gICAgICBmb2N1c0ZpcnN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgLy8gVXAgYW5kIGRvd24gYXJlIGluIGtleWRvd25cclxuICAgIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBwcmV2ZW50IHBhZ2Ugc2Nyb2xsID46KVxyXG4gICAgY2FzZSBrZXlzLnVwOlxyXG4gICAgY2FzZSBrZXlzLmRvd246XHJcbiAgICAgIGRldGVybWluZU9yaWVudGF0aW9uKGV2ZW50KTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBIYW5kbGUga2V5dXAgb24gdGFic1xyXG5mdW5jdGlvbiBrZXl1cEV2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIHN3aXRjaCAoa2V5KSB7XHJcbiAgICBjYXNlIGtleXMubGVmdDpcclxuICAgIGNhc2Uga2V5cy5yaWdodDpcclxuICAgICAgZGV0ZXJtaW5lT3JpZW50YXRpb24oZXZlbnQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2Uga2V5cy5kZWxldGU6XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmVudGVyOlxyXG4gICAgY2FzZSBrZXlzLnNwYWNlOlxyXG4gICAgICBhY3RpdmF0ZVRhYihldmVudC50YXJnZXQsIHRydWUpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuLy8gV2hlbiBhIHRhYmxpc3QgYXJpYS1vcmllbnRhdGlvbiBpcyBzZXQgdG8gdmVydGljYWwsXHJcbi8vIG9ubHkgdXAgYW5kIGRvd24gYXJyb3cgc2hvdWxkIGZ1bmN0aW9uLlxyXG4vLyBJbiBhbGwgb3RoZXIgY2FzZXMgb25seSBsZWZ0IGFuZCByaWdodCBhcnJvdyBmdW5jdGlvbi5cclxuZnVuY3Rpb24gZGV0ZXJtaW5lT3JpZW50YXRpb24gKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIGxldCB3PXdpbmRvdyxcclxuICAgIGQ9ZG9jdW1lbnQsXHJcbiAgICBlPWQuZG9jdW1lbnRFbGVtZW50LFxyXG4gICAgZz1kLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXSxcclxuICAgIHg9dy5pbm5lcldpZHRofHxlLmNsaWVudFdpZHRofHxnLmNsaWVudFdpZHRoLFxyXG4gICAgeT13LmlubmVySGVpZ2h0fHxlLmNsaWVudEhlaWdodHx8Zy5jbGllbnRIZWlnaHQ7XHJcblxyXG4gIGxldCB2ZXJ0aWNhbCA9IHggPCBicmVha3BvaW50cy5tZDtcclxuICBsZXQgcHJvY2VlZCA9IGZhbHNlO1xyXG5cclxuICBpZiAodmVydGljYWwpIHtcclxuICAgIGlmIChrZXkgPT09IGtleXMudXAgfHwga2V5ID09PSBrZXlzLmRvd24pIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgcHJvY2VlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgaWYgKGtleSA9PT0ga2V5cy5sZWZ0IHx8IGtleSA9PT0ga2V5cy5yaWdodCkge1xyXG4gICAgICBwcm9jZWVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHByb2NlZWQpIHtcclxuICAgIHN3aXRjaFRhYk9uQXJyb3dQcmVzcyhldmVudCk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBFaXRoZXIgZm9jdXMgdGhlIG5leHQsIHByZXZpb3VzLCBmaXJzdCwgb3IgbGFzdCB0YWJcclxuLy8gZGVwZW5kaW5nIG9uIGtleSBwcmVzc2VkXHJcbmZ1bmN0aW9uIHN3aXRjaFRhYk9uQXJyb3dQcmVzcyAoZXZlbnQpIHtcclxuICB2YXIgcHJlc3NlZCA9IGV2ZW50LmtleUNvZGU7XHJcbiAgaWYgKGRpcmVjdGlvblsgcHJlc3NlZCBdKSB7XHJcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhcmdldCk7XHJcbiAgICBsZXQgaW5kZXggPSBnZXRJbmRleE9mRWxlbWVudEluTGlzdCh0YXJnZXQsIHRhYnMpO1xyXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICBpZiAodGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdKSB7XHJcbiAgICAgICAgdGFic1sgaW5kZXggKyBkaXJlY3Rpb25bIHByZXNzZWQgXSBdLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocHJlc3NlZCA9PT0ga2V5cy5sZWZ0IHx8IHByZXNzZWQgPT09IGtleXMudXApIHtcclxuICAgICAgICBmb2N1c0xhc3RUYWIodGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChwcmVzc2VkID09PSBrZXlzLnJpZ2h0IHx8IHByZXNzZWQgPT0ga2V5cy5kb3duKSB7XHJcbiAgICAgICAgZm9jdXNGaXJzdFRhYih0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGFsbCBhY3RpdmUgdGFicyBpbiBsaXN0XHJcbiAqIEBwYXJhbSB0YWJuYXYgcGFyZW50IC50YWJuYXYgZWxlbWVudFxyXG4gKiBAcmV0dXJucyByZXR1cm5zIGxpc3Qgb2YgYWN0aXZlIHRhYnMgaWYgYW55XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBY3RpdmVUYWJzICh0YWJuYXYpIHtcclxuICByZXR1cm4gdGFibmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbVthcmlhLXNlbGVjdGVkPXRydWVdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYSBsaXN0IG9mIGFsbCBidXR0b24gdGFicyBpbiBjdXJyZW50IHRhYmxpc3RcclxuICogQHBhcmFtIHRhYiBCdXR0b24gdGFiIGVsZW1lbnRcclxuICogQHJldHVybnMgeyp9IHJldHVybiBhcnJheSBvZiB0YWJzXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBbGxUYWJzSW5MaXN0ICh0YWIpIHtcclxuICBsZXQgcGFyZW50Tm9kZSA9IHRhYi5wYXJlbnROb2RlO1xyXG4gIGlmIChwYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndGFibmF2JykpIHtcclxuICAgIHJldHVybiBwYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xyXG4gIH1cclxuICByZXR1cm4gW107XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEluZGV4T2ZFbGVtZW50SW5MaXN0IChlbGVtZW50LCBsaXN0KXtcclxuICBsZXQgaW5kZXggPSAtMTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKysgKXtcclxuICAgIGlmKGxpc3RbIGkgXSA9PT0gZWxlbWVudCl7XHJcbiAgICAgIGluZGV4ID0gaTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaW5kZXg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDaGVja3MgaWYgdGhlcmUgaXMgYSB0YWIgaGFzaCBpbiB0aGUgdXJsIGFuZCBhY3RpdmF0ZXMgdGhlIHRhYiBhY2NvcmRpbmdseVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJucyB0cnVlIGlmIHRhYiBoYXMgYmVlbiBzZXQgLSByZXR1cm5zIGZhbHNlIGlmIG5vIHRhYiBoYXMgYmVlbiBzZXQgdG8gYWN0aXZlXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRBY3RpdmVIYXNoVGFiICgpIHtcclxuICBsZXQgaGFzaCA9IGxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKTtcclxuICBpZiAoaGFzaCAhPT0gJycpIHtcclxuICAgIGxldCB0YWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24udGFibmF2LWl0ZW1bYXJpYS1jb250cm9scz1cIiMnICsgaGFzaCArICdcIl0nKTtcclxuICAgIGlmICh0YWIgIT09IG51bGwpIHtcclxuICAgICAgYWN0aXZhdGVUYWIodGFiLCBmYWxzZSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKipcclxuICogQWN0aXZhdGUvc2hvdyB0YWIgYW5kIGhpZGUgb3RoZXJzXHJcbiAqIEBwYXJhbSB0YWIgYnV0dG9uIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGFjdGl2YXRlVGFiICh0YWIsIHNldEZvY3VzKSB7XHJcbiAgZGVhY3RpdmF0ZUFsbFRhYnNFeGNlcHQodGFiKTtcclxuXHJcbiAgbGV0IHRhYnBhbmVsSUQgPSB0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgbGV0IHRhYnBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFicGFuZWxJRCk7XHJcbiAgaWYodGFicGFuZWwgPT09IG51bGwpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhY2NvcmRpb24gcGFuZWwuYCk7XHJcbiAgfVxyXG5cclxuICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuICB0YWJwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgdGFiLnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcclxuXHJcbiAgLy8gU2V0IGZvY3VzIHdoZW4gcmVxdWlyZWRcclxuICBpZiAoc2V0Rm9jdXMpIHtcclxuICAgIHRhYi5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgb3V0cHV0RXZlbnQodGFiLCAnZmRzLnRhYm5hdi5jaGFuZ2VkJyk7XHJcbiAgb3V0cHV0RXZlbnQodGFiLnBhcmVudE5vZGUsICdmZHMudGFibmF2Lm9wZW4nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIERlYWN0aXZhdGUgYWxsIHRhYnMgaW4gbGlzdCBleGNlcHQgdGhlIG9uZSBwYXNzZWRcclxuICogQHBhcmFtIGFjdGl2ZVRhYiBidXR0b24gdGFiIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGRlYWN0aXZhdGVBbGxUYWJzRXhjZXB0IChhY3RpdmVUYWIpIHtcclxuICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QoYWN0aXZlVGFiKTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgdGFiID0gdGFic1sgaSBdO1xyXG4gICAgaWYgKHRhYiA9PT0gYWN0aXZlVGFiKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykge1xyXG4gICAgICBvdXRwdXRFdmVudCh0YWIsICdmZHMudGFibmF2LmNsb3NlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGFiLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcclxuICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcclxuICAgIGxldCB0YWJwYW5lbElEID0gdGFiLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xyXG4gICAgbGV0IHRhYnBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFicGFuZWxJRClcclxuICAgIGlmKHRhYnBhbmVsID09PSBudWxsKXtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCB0YWJwYW5lbC5gKTtcclxuICAgIH1cclxuICAgIHRhYnBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIG91dHB1dCBhbiBldmVudCBvbiB0aGUgcGFzc2VkIGVsZW1lbnRcclxuICogQHBhcmFtIGVsZW1lbnRcclxuICogQHBhcmFtIGV2ZW50TmFtZVxyXG4gKi9cclxuZnVuY3Rpb24gb3V0cHV0RXZlbnQgKGVsZW1lbnQsIGV2ZW50TmFtZSkge1xyXG4gIGxldCBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gIGV2ZW50LmluaXRFdmVudChldmVudE5hbWUsIHRydWUsIHRydWUpO1xyXG4gIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbn1cclxuXHJcbi8vIE1ha2UgYSBndWVzc1xyXG5mdW5jdGlvbiBmb2N1c0ZpcnN0VGFiICh0YWIpIHtcclxuICBnZXRBbGxUYWJzSW5MaXN0KHRhYilbIDAgXS5mb2N1cygpO1xyXG59XHJcblxyXG4vLyBNYWtlIGEgZ3Vlc3NcclxuZnVuY3Rpb24gZm9jdXNMYXN0VGFiICh0YWIpIHtcclxuICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QodGFiKTtcclxuICB0YWJzWyB0YWJzLmxlbmd0aCAtIDEgXS5mb2N1cygpO1xyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUYWJuYXY7XHJcbiIsImNsYXNzIFRvYXN0e1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpe1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdygpe1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3dpbmcnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9hc3QtY2xvc2UnKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGxldCB0b2FzdCA9IHRoaXMucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICBuZXcgVG9hc3QodG9hc3QpLmhpZGUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc2hvd1RvYXN0KTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCl7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dUb2FzdCgpe1xyXG4gICAgbGV0IHRvYXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50b2FzdC5zaG93aW5nJyk7XHJcbiAgICBmb3IobGV0IHQgPSAwOyB0IDwgdG9hc3RzLmxlbmd0aDsgdCsrKXtcclxuICAgICAgICBsZXQgdG9hc3QgPSB0b2FzdHNbdF07XHJcbiAgICAgICAgdG9hc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvd2luZycpO1xyXG4gICAgICAgIHRvYXN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUb2FzdDtcclxuIiwiY2xhc3MgVG9vbHRpcHtcclxuICBjb25zdHJ1Y3RvcihlbGVtZW50KXtcclxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICBpZih0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAnKSA9PT0gbnVsbCl7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVG9vbHRpcCB0ZXh0IGlzIG1pc3NpbmcuIEFkZCBhdHRyaWJ1dGUgZGF0YS10b29sdGlwIGFuZCB0aGUgY29udGVudCBvZiB0aGUgdG9vbHRpcCBhcyB2YWx1ZS5gKTtcclxuICAgIH1cclxuICAgIHRoaXMuc2V0RXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBzZXRFdmVudHMgKCl7XHJcbiAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBcclxuICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpeyBcclxuICAgICAgICAgIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1ob3ZlcicpKXtcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLXBvc2l0aW9uJykgfHwgJ3RvcCc7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG9vbHRpcCA9IHRoYXQuY3JlYXRlVG9vbHRpcChlbGVtZW50LCBwb3MpO1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b29sdGlwKTtcclxuXHJcbiAgICAgICAgICAgIHRoYXQucG9zaXRpb25BdChlbGVtZW50LCB0b29sdGlwLCBwb3MpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDMwMCk7XHJcblxyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBsZXQgdHJpZ2dlciA9IHRoaXM7XHJcbiAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgICAgaWYoIXRyaWdnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSl7XHJcbiAgICAgICAgICB2YXIgdG9vbHRpcCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgICAgICBpZih0b29sdGlwICE9PSBudWxsICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApICE9PSBudWxsKXtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgdmFyIGtleSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XHJcbiAgICAgICAgaWYgKGtleSA9PT0gMjcpIHtcclxuICAgICAgICAgIHZhciB0b29sdGlwID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgICAgIGlmKHRvb2x0aXAgIT09IG51bGwgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcCkgIT09IG51bGwpe1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB2YXIgcG9zID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC1wb3NpdGlvbicpIHx8ICd0b3AnO1xyXG5cclxuICAgICAgICB2YXIgdG9vbHRpcCA9IHRoYXQuY3JlYXRlVG9vbHRpcChlbGVtZW50LCBwb3MpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xyXG5cclxuICAgICAgICB0aGF0LnBvc2l0aW9uQXQoZWxlbWVudCwgdG9vbHRpcCwgcG9zKTtcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciB0b29sdGlwID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgICBpZih0b29sdGlwICE9PSBudWxsICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApICE9PSBudWxsKXtcclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIGlmKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC10cmlnZ2VyJykgPT09ICdjbGljaycpe1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcztcclxuICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgdmFyIHBvcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcclxuICAgICAgICAgIHZhciB0b29sdGlwID0gdGhhdC5jcmVhdGVUb29sdGlwKGVsZW1lbnQsIHBvcyk7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xyXG4gICAgICAgICAgdGhhdC5wb3NpdGlvbkF0KGVsZW1lbnQsIHRvb2x0aXAsIHBvcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmKGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSl7XHJcbiAgICAgICAgICAgIHZhciBwb3BwZXIgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHBlcikpO1xyXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICBpZiAoIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLXRvb2x0aXAnKSAmJiAhZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcCcpICYmICFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sdGlwLWNvbnRlbnQnKSkge1xyXG4gICAgICAgIHRoYXQuY2xvc2VBbGwoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgY2xvc2VBbGwgKCl7XHJcbiAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdG9vbHRpcFthcmlhLWRlc2NyaWJlZGJ5XScpO1xyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBwb3BwZXIgPSBlbGVtZW50c1sgaSBdLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICBlbGVtZW50c1sgaSBdLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHBvcHBlcikpO1xyXG4gICAgfVxyXG4gIH1cclxuICBjcmVhdGVUb29sdGlwIChlbGVtZW50LCBwb3MpIHtcclxuICAgIHZhciB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b29sdGlwLmNsYXNzTmFtZSA9ICd0b29sdGlwLXBvcHBlcic7XHJcbiAgICB2YXIgcG9wcGVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtcG9wcGVyJyk7XHJcbiAgICB2YXIgaWQgPSAndG9vbHRpcC0nK3BvcHBlcnMubGVuZ3RoKzE7XHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgncm9sZScsICd0b29sdGlwJyk7XHJcbiAgICB0b29sdGlwLnNldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnLCBwb3MpO1xyXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBpZCk7XHJcblxyXG4gICAgdmFyIHRvb2x0aXBJbm5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdG9vbHRpcElubmVyLmNsYXNzTmFtZSA9ICd0b29sdGlwJztcclxuXHJcbiAgICB2YXIgdG9vbHRpcEFycm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b29sdGlwQXJyb3cuY2xhc3NOYW1lID0gJ3Rvb2x0aXAtYXJyb3cnO1xyXG4gICAgdG9vbHRpcElubmVyLmFwcGVuZENoaWxkKHRvb2x0aXBBcnJvdyk7XHJcblxyXG4gICAgdmFyIHRvb2x0aXBDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0b29sdGlwQ29udGVudC5jbGFzc05hbWUgPSAndG9vbHRpcC1jb250ZW50JztcclxuICAgIHRvb2x0aXBDb250ZW50LmlubmVySFRNTCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAnKTtcclxuICAgIHRvb2x0aXBJbm5lci5hcHBlbmRDaGlsZCh0b29sdGlwQ29udGVudCk7XHJcbiAgICB0b29sdGlwLmFwcGVuZENoaWxkKHRvb2x0aXBJbm5lcik7XHJcblxyXG4gICAgcmV0dXJuIHRvb2x0aXA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQb3NpdGlvbnMgdGhlIHRvb2x0aXAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFyZW50IC0gVGhlIHRyaWdnZXIgb2YgdGhlIHRvb2x0aXAuXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IHRvb2x0aXAgLSBUaGUgdG9vbHRpcCBpdHNlbGYuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBvc0hvcml6b250YWwgLSBEZXNpcmVkIGhvcml6b250YWwgcG9zaXRpb24gb2YgdGhlIHRvb2x0aXAgcmVsYXRpdmVseSB0byB0aGUgdHJpZ2dlciAobGVmdC9jZW50ZXIvcmlnaHQpXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBvc1ZlcnRpY2FsIC0gRGVzaXJlZCB2ZXJ0aWNhbCBwb3NpdGlvbiBvZiB0aGUgdG9vbHRpcCByZWxhdGl2ZWx5IHRvIHRoZSB0cmlnZ2VyICh0b3AvY2VudGVyL2JvdHRvbSlcclxuICAgKlxyXG4gICAqL1xyXG4gIHBvc2l0aW9uQXQgKHBhcmVudCwgdG9vbHRpcCwgcG9zKSB7XHJcbiAgICBsZXQgdHJpZ2dlciA9IHBhcmVudDtcclxuICAgIGxldCBhcnJvdyA9IHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdO1xyXG4gICAgbGV0IHRyaWdnZXJQb3NpdGlvbiA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIFxyXG4gICAgdmFyIHBhcmVudENvb3JkcyA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgbGVmdCwgdG9wO1xyXG5cclxuICAgIHZhciB0b29sdGlwV2lkdGggPSB0b29sdGlwLm9mZnNldFdpZHRoO1xyXG5cclxuICAgIHZhciBkaXN0ID0gMTI7XHJcbiAgICBsZXQgYXJyb3dEaXJlY3Rpb24gPSBcImRvd25cIjtcclxuICAgIGxlZnQgPSBwYXJzZUludChwYXJlbnRDb29yZHMubGVmdCkgKyAoKHBhcmVudC5vZmZzZXRXaWR0aCAtIHRvb2x0aXAub2Zmc2V0V2lkdGgpIC8gMik7XHJcblxyXG4gICAgc3dpdGNoIChwb3MpIHtcclxuICAgICAgY2FzZSAnYm90dG9tJzpcclxuICAgICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMuYm90dG9tKSArIGRpc3Q7XHJcbiAgICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICBjYXNlICd0b3AnOlxyXG4gICAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy50b3ApIC0gdG9vbHRpcC5vZmZzZXRIZWlnaHQgLSBkaXN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIHRvb2x0aXAgaXMgb3V0IG9mIGJvdW5kcyBvbiBsZWZ0IHNpZGVcclxuICAgIGlmKGxlZnQgPCAwKSB7XHJcbiAgICAgIGxlZnQgPSBkaXN0O1xyXG4gICAgICBsZXQgZW5kUG9zaXRpb25PblBhZ2UgPSB0cmlnZ2VyUG9zaXRpb24ubGVmdCArICh0cmlnZ2VyLm9mZnNldFdpZHRoIC8gMik7XHJcbiAgICAgIGxldCB0b29sdGlwQXJyb3dIYWxmV2lkdGggPSA4O1xyXG4gICAgICBsZXQgYXJyb3dMZWZ0UG9zaXRpb24gPSBlbmRQb3NpdGlvbk9uUGFnZSAtIGRpc3QgLSB0b29sdGlwQXJyb3dIYWxmV2lkdGg7XHJcbiAgICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLmxlZnQgPSBhcnJvd0xlZnRQb3NpdGlvbisncHgnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFxyXG4gICAgaWYoKHRvcCArIHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSA+PSB3aW5kb3cuaW5uZXJIZWlnaHQpe1xyXG4gICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMudG9wKSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gZGlzdDtcclxuICAgICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKHRvcCA8IDApIHtcclxuICAgICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLmJvdHRvbSkgKyBkaXN0O1xyXG4gICAgICBhcnJvd0RpcmVjdGlvbiA9IFwidXBcIjtcclxuICAgIH1cclxuICAgIGlmKHdpbmRvdy5pbm5lcldpZHRoIDwgKGxlZnQgKyB0b29sdGlwV2lkdGgpKXtcclxuICAgICAgdG9vbHRpcC5zdHlsZS5yaWdodCA9IGRpc3QgKyAncHgnO1xyXG4gICAgICBsZXQgZW5kUG9zaXRpb25PblBhZ2UgPSB0cmlnZ2VyUG9zaXRpb24ucmlnaHQgLSAodHJpZ2dlci5vZmZzZXRXaWR0aCAvIDIpO1xyXG4gICAgICBsZXQgdG9vbHRpcEFycm93SGFsZldpZHRoID0gODtcclxuICAgICAgbGV0IGFycm93UmlnaHRQb3NpdGlvbiA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZW5kUG9zaXRpb25PblBhZ2UgLSBkaXN0IC0gdG9vbHRpcEFycm93SGFsZldpZHRoO1xyXG4gICAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5zdHlsZS5yaWdodCA9IGFycm93UmlnaHRQb3NpdGlvbisncHgnO1xyXG4gICAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdG9vbHRpcC5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XHJcbiAgICB9XHJcbiAgICB0b29sdGlwLnN0eWxlLnRvcCAgPSB0b3AgKyBwYWdlWU9mZnNldCArICdweCc7XHJcbiAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5jbGFzc0xpc3QuYWRkKGFycm93RGlyZWN0aW9uKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVG9vbHRpcDtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgcHJlZml4OiAnJyxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBDb2xsYXBzZSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jb2xsYXBzZScpO1xyXG5jb25zdCBSYWRpb1RvZ2dsZUdyb3VwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50Jyk7XHJcbmNvbnN0IENoZWNrYm94VG9nZ2xlQ29udGVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudCcpO1xyXG5jb25zdCBEcm9wZG93biA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9kcm9wZG93bicpO1xyXG5jb25zdCBBY2NvcmRpb24gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvYWNjb3JkaW9uJyk7XHJcbmNvbnN0IFRvYXN0ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3RvYXN0Jyk7XHJcbmNvbnN0IFJlc3BvbnNpdmVUYWJsZSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy90YWJsZScpO1xyXG5jb25zdCBUYWJsZVNlbGVjdGFibGVSb3dzID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3NlbGVjdGFibGUtdGFibGUnKTtcclxuY29uc3QgVGFibmF2ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3RhYm5hdicpO1xyXG4vL2NvbnN0IERldGFpbHMgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGV0YWlscycpO1xyXG5jb25zdCBUb29sdGlwID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL3Rvb2x0aXAnKTtcclxuY29uc3QgU2V0VGFiSW5kZXggPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvc2tpcG5hdicpO1xyXG5jb25zdCBOYXZpZ2F0aW9uID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL25hdmlnYXRpb24nKTtcclxuY29uc3QgSW5wdXRSZWdleE1hc2sgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzaycpO1xyXG5pbXBvcnQgTW9kYWwgZnJvbSAnLi9jb21wb25lbnRzL21vZGFsJztcclxuaW1wb3J0IERyb3Bkb3duU29ydCBmcm9tICcuL2NvbXBvbmVudHMvZHJvcGRvd24tc29ydCc7XHJcbmltcG9ydCBFcnJvclN1bW1hcnkgZnJvbSAnLi9jb21wb25lbnRzL2Vycm9yLXN1bW1hcnknO1xyXG5jb25zdCBkYXRlUGlja2VyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2RhdGUtcGlja2VyJyk7XHJcbi8qKlxyXG4gKiBUaGUgJ3BvbHlmaWxscycgZGVmaW5lIGtleSBFQ01BU2NyaXB0IDUgbWV0aG9kcyB0aGF0IG1heSBiZSBtaXNzaW5nIGZyb21cclxuICogb2xkZXIgYnJvd3NlcnMsIHNvIG11c3QgYmUgbG9hZGVkIGZpcnN0LlxyXG4gKi9cclxucmVxdWlyZSgnLi9wb2x5ZmlsbHMnKTtcclxuXHJcbnZhciBpbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAvLyBTZXQgdGhlIG9wdGlvbnMgdG8gYW4gZW1wdHkgb2JqZWN0IGJ5IGRlZmF1bHQgaWYgbm8gb3B0aW9ucyBhcmUgcGFzc2VkLlxyXG4gIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zIDoge31cclxuXHJcbiAgLy8gQWxsb3cgdGhlIHVzZXIgdG8gaW5pdGlhbGlzZSBGRFMgaW4gb25seSBjZXJ0YWluIHNlY3Rpb25zIG9mIHRoZSBwYWdlXHJcbiAgLy8gRGVmYXVsdHMgdG8gdGhlIGVudGlyZSBkb2N1bWVudCBpZiBub3RoaW5nIGlzIHNldC5cclxuICB2YXIgc2NvcGUgPSB0eXBlb2Ygb3B0aW9ucy5zY29wZSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnNjb3BlIDogZG9jdW1lbnRcclxuXHJcbiAgZGF0ZVBpY2tlci5vbihzY29wZSk7XHJcblxyXG4gIGNvbnN0IGpzU2VsZWN0b3JSZWdleCA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W2RhdGEtaW5wdXQtcmVnZXhdJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JSZWdleC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgSW5wdXRSZWdleE1hc2soanNTZWxlY3RvclJlZ2V4WyBjIF0pO1xyXG4gIH1cclxuICBjb25zdCBqc1NlbGVjdG9yVGFiaW5kZXggPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCcuc2tpcG5hdltocmVmXj1cIiNcIl0nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRhYmluZGV4Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBTZXRUYWJJbmRleChqc1NlbGVjdG9yVGFiaW5kZXhbIGMgXSk7XHJcbiAgfVxyXG4gIGNvbnN0IGpzU2VsZWN0b3JUb29sdGlwID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtdG9vbHRpcCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVG9vbHRpcC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVG9vbHRpcChqc1NlbGVjdG9yVG9vbHRpcFsgYyBdKTtcclxuICB9XHJcbiAgY29uc3QganNTZWxlY3RvclRhYm5hdiA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhYm5hdicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibmF2Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBUYWJuYXYoanNTZWxlY3RvclRhYm5hdlsgYyBdKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGpzU2VsZWN0b3JBY2NvcmRpb24gPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhY2NvcmRpb24nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckFjY29yZGlvbi5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQWNjb3JkaW9uKGpzU2VsZWN0b3JBY2NvcmRpb25bIGMgXSk7XHJcbiAgfVxyXG4gIGNvbnN0IGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZCA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tYm9yZGVyZWQ6bm90KC5hY2NvcmRpb24pJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQWNjb3JkaW9uKGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZFsgYyBdKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGpzU2VsZWN0YWJsZVRhYmxlID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgndGFibGUudGFibGUtLXNlbGVjdGFibGUnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RhYmxlVGFibGUubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFRhYmxlU2VsZWN0YWJsZVJvd3MoanNTZWxlY3RhYmxlVGFibGVbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QganNTZWxlY3RvclRhYmxlID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgndGFibGU6bm90KC5kYXRhVGFibGUpJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JUYWJsZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgUmVzcG9uc2l2ZVRhYmxlKGpzU2VsZWN0b3JUYWJsZVsgYyBdKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGpzU2VsZWN0b3JDb2xsYXBzZSA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWNvbGxhcHNlJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JDb2xsYXBzZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQ29sbGFwc2UoanNTZWxlY3RvckNvbGxhcHNlWyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3QganNTZWxlY3RvclJhZGlvQ29sbGFwc2UgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1yYWRpby10b2dnbGUtZ3JvdXAnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclJhZGlvQ29sbGFwc2UubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFJhZGlvVG9nZ2xlR3JvdXAoanNTZWxlY3RvclJhZGlvQ29sbGFwc2VbIGMgXSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZSA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWNoZWNrYm94LXRvZ2dsZS1jb250ZW50Jyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBDaGVja2JveFRvZ2dsZUNvbnRlbnQoanNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2VbIGMgXSk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc1NlbGVjdG9yRHJvcGRvd25Tb3J0ID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3ZlcmZsb3ctbWVudS0tc29ydCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yRHJvcGRvd25Tb3J0Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBEcm9wZG93blNvcnQoanNTZWxlY3RvckRyb3Bkb3duU29ydFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBqc1NlbGVjdG9yRHJvcGRvd24gPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1kcm9wZG93bicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yRHJvcGRvd24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IERyb3Bkb3duKGpzU2VsZWN0b3JEcm9wZG93blsgYyBdKTtcclxuICB9XHJcblxyXG4gIHZhciBtb2RhbHMgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCcuZmRzLW1vZGFsJyk7XHJcbiAgZm9yKGxldCBkID0gMDsgZCA8IG1vZGFscy5sZW5ndGg7IGQrKykge1xyXG4gICAgbmV3IE1vZGFsKG1vZGFsc1tkXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gRmluZCBmaXJzdCBlcnJvciBzdW1tYXJ5IG1vZHVsZSB0byBlbmhhbmNlLlxyXG4gIHZhciAkZXJyb3JTdW1tYXJ5ID0gc2NvcGUucXVlcnlTZWxlY3RvcignW2RhdGEtbW9kdWxlPVwiZXJyb3Itc3VtbWFyeVwiXScpXHJcbiAgbmV3IEVycm9yU3VtbWFyeSgkZXJyb3JTdW1tYXJ5KS5pbml0KClcclxuXHJcbiAgbmV3IE5hdmlnYXRpb24oKTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHsgaW5pdCwgQ29sbGFwc2UsIFJhZGlvVG9nZ2xlR3JvdXAsIENoZWNrYm94VG9nZ2xlQ29udGVudCwgRHJvcGRvd24sIERyb3Bkb3duU29ydCwgUmVzcG9uc2l2ZVRhYmxlLCBBY2NvcmRpb24sIFRhYm5hdiwgVG9vbHRpcCwgU2V0VGFiSW5kZXgsIE5hdmlnYXRpb24sIElucHV0UmVnZXhNYXNrLCBNb2RhbCwgZGF0ZVBpY2tlciwgVG9hc3QsIFRhYmxlU2VsZWN0YWJsZVJvd3MsIEVycm9yU3VtbWFyeX07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIC8vIFRoaXMgdXNlZCB0byBiZSBjb25kaXRpb25hbGx5IGRlcGVuZGVudCBvbiB3aGV0aGVyIHRoZVxyXG4gIC8vIGJyb3dzZXIgc3VwcG9ydGVkIHRvdWNoIGV2ZW50czsgaWYgaXQgZGlkLCBgQ0xJQ0tgIHdhcyBzZXQgdG9cclxuICAvLyBgdG91Y2hzdGFydGAuICBIb3dldmVyLCB0aGlzIGhhZCBkb3duc2lkZXM6XHJcbiAgLy9cclxuICAvLyAqIEl0IHByZS1lbXB0ZWQgbW9iaWxlIGJyb3dzZXJzJyBkZWZhdWx0IGJlaGF2aW9yIG9mIGRldGVjdGluZ1xyXG4gIC8vICAgd2hldGhlciBhIHRvdWNoIHR1cm5lZCBpbnRvIGEgc2Nyb2xsLCB0aGVyZWJ5IHByZXZlbnRpbmdcclxuICAvLyAgIHVzZXJzIGZyb20gdXNpbmcgc29tZSBvZiBvdXIgY29tcG9uZW50cyBhcyBzY3JvbGwgc3VyZmFjZXMuXHJcbiAgLy9cclxuICAvLyAqIFNvbWUgZGV2aWNlcywgc3VjaCBhcyB0aGUgTWljcm9zb2Z0IFN1cmZhY2UgUHJvLCBzdXBwb3J0ICpib3RoKlxyXG4gIC8vICAgdG91Y2ggYW5kIGNsaWNrcy4gVGhpcyBtZWFudCB0aGUgY29uZGl0aW9uYWwgZWZmZWN0aXZlbHkgZHJvcHBlZFxyXG4gIC8vICAgc3VwcG9ydCBmb3IgdGhlIHVzZXIncyBtb3VzZSwgZnJ1c3RyYXRpbmcgdXNlcnMgd2hvIHByZWZlcnJlZFxyXG4gIC8vICAgaXQgb24gdGhvc2Ugc3lzdGVtcy5cclxuICBDTElDSzogJ2NsaWNrJyxcclxufTtcclxuIiwiLyogZXNsaW50LWRpc2FibGUgY29uc2lzdGVudC1yZXR1cm4gKi9cclxuLyogZXNsaW50LWRpc2FibGUgZnVuYy1uYW1lcyAqL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIF9wYXJhbXMpIHtcclxuICAgIGNvbnN0IHBhcmFtcyA9IF9wYXJhbXMgfHwge1xyXG4gICAgICBidWJibGVzOiBmYWxzZSxcclxuICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXHJcbiAgICAgIGRldGFpbDogbnVsbCxcclxuICAgIH07XHJcbiAgICBjb25zdCBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIkN1c3RvbUV2ZW50XCIpO1xyXG4gICAgZXZ0LmluaXRDdXN0b21FdmVudChcclxuICAgICAgZXZlbnQsXHJcbiAgICAgIHBhcmFtcy5idWJibGVzLFxyXG4gICAgICBwYXJhbXMuY2FuY2VsYWJsZSxcclxuICAgICAgcGFyYW1zLmRldGFpbFxyXG4gICAgKTtcclxuICAgIHJldHVybiBldnQ7XHJcbiAgfVxyXG5cclxuICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcclxufSkoKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBlbHByb3RvID0gd2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZTtcclxuY29uc3QgSElEREVOID0gJ2hpZGRlbic7XHJcblxyXG5pZiAoIShISURERU4gaW4gZWxwcm90bykpIHtcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxwcm90bywgSElEREVOLCB7XHJcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEhJRERFTik7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoSElEREVOLCAnJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NMaXN0IGFuZCBET01Ub2tlbkxpc3RcclxucmVxdWlyZSgnY2xhc3NsaXN0LXBvbHlmaWxsJyk7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZGVuXHJcbnJlcXVpcmUoJy4vZWxlbWVudC1oaWRkZW4nKTtcclxuXHJcbi8vIHBvbHlmaWxscyBOdW1iZXIuaXNOYU4oKVxyXG5yZXF1aXJlKFwiLi9udW1iZXItaXMtbmFuXCIpO1xyXG5cclxuLy8gcG9seWZpbGxzIEN1c3RvbUV2ZW50XHJcbnJlcXVpcmUoXCIuL2N1c3RvbS1ldmVudFwiKTtcclxuXHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vb2JqZWN0L2Fzc2lnbicpO1xyXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL2FycmF5L2Zyb20nKTsiLCJOdW1iZXIuaXNOYU4gPVxyXG4gIE51bWJlci5pc05hTiB8fFxyXG4gIGZ1bmN0aW9uIGlzTmFOKGlucHV0KSB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXHJcbiAgICByZXR1cm4gdHlwZW9mIGlucHV0ID09PSBcIm51bWJlclwiICYmIGlucHV0ICE9PSBpbnB1dDtcclxuICB9O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChodG1sRG9jdW1lbnQgPSBkb2N1bWVudCkgPT4gaHRtbERvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiIsImNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoXCJvYmplY3QtYXNzaWduXCIpO1xyXG5jb25zdCByZWNlcHRvciA9IHJlcXVpcmUoXCJyZWNlcHRvclwiKTtcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBzZXF1ZW5jZVxyXG4gKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBzZXEgYW4gYXJyYXkgb2YgZnVuY3Rpb25zXHJcbiAqIEByZXR1cm4geyBjbG9zdXJlIH0gY2FsbEhvb2tzXHJcbiAqL1xyXG4vLyBXZSB1c2UgYSBuYW1lZCBmdW5jdGlvbiBoZXJlIGJlY2F1c2Ugd2Ugd2FudCBpdCB0byBpbmhlcml0IGl0cyBsZXhpY2FsIHNjb3BlXHJcbi8vIGZyb20gdGhlIGJlaGF2aW9yIHByb3BzIG9iamVjdCwgbm90IGZyb20gdGhlIG1vZHVsZVxyXG5jb25zdCBzZXF1ZW5jZSA9ICguLi5zZXEpID0+XHJcbiAgZnVuY3Rpb24gY2FsbEhvb2tzKHRhcmdldCA9IGRvY3VtZW50LmJvZHkpIHtcclxuICAgIHNlcS5mb3JFYWNoKChtZXRob2QpID0+IHtcclxuICAgICAgaWYgKHR5cGVvZiB0aGlzW21ldGhvZF0gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIHRoaXNbbWV0aG9kXS5jYWxsKHRoaXMsIHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4vKipcclxuICogQG5hbWUgYmVoYXZpb3JcclxuICogQHBhcmFtIHtvYmplY3R9IGV2ZW50c1xyXG4gKiBAcGFyYW0ge29iamVjdD99IHByb3BzXHJcbiAqIEByZXR1cm4ge3JlY2VwdG9yLmJlaGF2aW9yfVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoZXZlbnRzLCBwcm9wcykgPT5cclxuICByZWNlcHRvci5iZWhhdmlvcihcclxuICAgIGV2ZW50cyxcclxuICAgIGFzc2lnbihcclxuICAgICAge1xyXG4gICAgICAgIG9uOiBzZXF1ZW5jZShcImluaXRcIiwgXCJhZGRcIiksXHJcbiAgICAgICAgb2ZmOiBzZXF1ZW5jZShcInRlYXJkb3duXCIsIFwicmVtb3ZlXCIpLFxyXG4gICAgICB9LFxyXG4gICAgICBwcm9wc1xyXG4gICAgKVxyXG4gICk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubGV0IGJyZWFrcG9pbnRzID0ge1xyXG4gICd4cyc6IDAsXHJcbiAgJ3NtJzogNTc2LFxyXG4gICdtZCc6IDc2OCxcclxuICAnbGcnOiA5OTIsXHJcbiAgJ3hsJzogMTIwMFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBicmVha3BvaW50cztcclxuIiwiLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzNcclxuZnVuY3Rpb24gaXNFbGVtZW50SW5WaWV3cG9ydCAoZWwsIHdpbj13aW5kb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICByZWN0LnRvcCA+PSAwICYmXHJcbiAgICByZWN0LmxlZnQgPj0gMCAmJlxyXG4gICAgcmVjdC5ib3R0b20gPD0gKHdpbi5pbm5lckhlaWdodCB8fCBkb2NFbC5jbGllbnRIZWlnaHQpICYmXHJcbiAgICByZWN0LnJpZ2h0IDw9ICh3aW4uaW5uZXJXaWR0aCB8fCBkb2NFbC5jbGllbnRXaWR0aClcclxuICApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudEluVmlld3BvcnQ7XHJcbiIsIi8vIGlPUyBkZXRlY3Rpb24gZnJvbTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTAzOTg4NS8xNzc3MTBcclxuZnVuY3Rpb24gaXNJb3NEZXZpY2UoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oaVBvZHxpUGhvbmV8aVBhZCkvZykgfHxcclxuICAgICAgKG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gXCJNYWNJbnRlbFwiICYmIG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDEpKSAmJlxyXG4gICAgIXdpbmRvdy5NU1N0cmVhbVxyXG4gICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaXNJb3NEZXZpY2U7XHJcbiIsIi8qKlxyXG4gKiBAbmFtZSBpc0VsZW1lbnRcclxuICogQGRlc2MgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudC5cclxuICogQHBhcmFtIHthbnl9IHZhbHVlXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VsZW1lbnQgPSAodmFsdWUpID0+XHJcbiAgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlLm5vZGVUeXBlID09PSAxO1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIHNlbGVjdFxyXG4gKiBAZGVzYyBzZWxlY3RzIGVsZW1lbnRzIGZyb20gdGhlIERPTSBieSBjbGFzcyBzZWxlY3RvciBvciBJRCBzZWxlY3Rvci5cclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gVGhlIHNlbGVjdG9yIHRvIHRyYXZlcnNlIHRoZSBET00gd2l0aC5cclxuICogQHBhcmFtIHtEb2N1bWVudHxIVE1MRWxlbWVudD99IGNvbnRleHQgLSBUaGUgY29udGV4dCB0byB0cmF2ZXJzZSB0aGUgRE9NXHJcbiAqICAgaW4uIElmIG5vdCBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gdGhlIGRvY3VtZW50LlxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudFtdfSAtIEFuIGFycmF5IG9mIERPTSBub2RlcyBvciBhbiBlbXB0eSBhcnJheS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKHNlbGVjdG9yLCBjb250ZXh0KSA9PiB7XHJcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIikge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFjb250ZXh0IHx8ICFpc0VsZW1lbnQoY29udGV4dCkpIHtcclxuICAgIGNvbnRleHQgPSB3aW5kb3cuZG9jdW1lbnQ7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICB9XHJcblxyXG4gIGNvbnN0IHNlbGVjdGlvbiA9IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGVjdGlvbik7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XHJcbmNvbnN0IENPTlRST0xTID0gJ2FyaWEtY29udHJvbHMnO1xyXG5jb25zdCBISURERU4gPSAnYXJpYS1oaWRkZW4nO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoYnV0dG9uLCBleHBhbmRlZCkgPT4ge1xyXG5cclxuICBpZiAodHlwZW9mIGV4cGFuZGVkICE9PSAnYm9vbGVhbicpIHtcclxuICAgIGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICdmYWxzZSc7XHJcbiAgfVxyXG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoRVhQQU5ERUQsIGV4cGFuZGVkKTtcclxuICBjb25zdCBpZCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoQ09OVFJPTFMpO1xyXG4gIGNvbnN0IGNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gIGlmICghY29udHJvbHMpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgJ05vIHRvZ2dsZSB0YXJnZXQgZm91bmQgd2l0aCBpZDogXCInICsgaWQgKyAnXCInXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29udHJvbHMuc2V0QXR0cmlidXRlKEhJRERFTiwgIWV4cGFuZGVkKTtcclxuICByZXR1cm4gZXhwYW5kZWQ7XHJcbn07XHJcbiJdfQ==
