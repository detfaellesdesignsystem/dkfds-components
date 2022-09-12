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
          bulkFunction.innerText = BULK_FUNCTION_OPEN_TEXT;
        } else {
          bulkFunction.innerText = BULK_FUNCTION_CLOSE_TEXT;
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
  window.addEventListener('scroll', function (e) {
    updateBackToTopButton(backtotopbutton);
  });
};

function updateBackToTopButton(button) {
  var lastKnownScrollPosition = window.scrollY;
  var lastKnownWindowHeight = window.innerHeight;
  var sidenav = document.querySelector('.sidenav-list');

  if (sidenav && sidenav.offsetParent !== null) {
    var rect = sidenav.getBoundingClientRect();

    if (rect.bottom < 0 && button.classList.contains('d-none')) {
      button.classList.remove('d-none');
      var eventShow = new Event('fds.backtotop.displayed');
      button.dispatchEvent(eventShow);
    } else if (rect.bottom >= 0 && !button.classList.contains('d-none')) {
      button.classList.add('d-none');
      var eventHide = new Event('fds.backtotop.hidden');
      button.dispatchEvent(eventHide);
    }
  } else {
    var limit = lastKnownWindowHeight * 2; // Defines how far the user must scroll before the button becomes visible

    if (lastKnownScrollPosition >= limit && button.classList.contains('d-none')) {
      button.classList.remove('d-none');

      var _eventShow = new Event('fds.backtotop.displayed');

      button.dispatchEvent(_eventShow);
    } else if (lastKnownScrollPosition < limit && !button.classList.contains('d-none')) {
      button.classList.add('d-none');

      var _eventHide = new Event('fds.backtotop.hidden');

      button.dispatchEvent(_eventHide);
    }
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
var CHARACTERS_REMAINING_MANY_TEXT = "Du har 0 tegn tilbage";
var CHARACTERS_REMAINING_ONE_TEXT = "Du har 1 tegn tilbage";
var CHARACTERS_EXCEEDED_MANY_TEXT = "Du har 0 tegn for meget";
var CHARACTERS_EXCEEDED_ONE_TEXT = "Du har 1 tegn for meget";
/**
 * Number of characters left
 * @param {HTMLElement} containerElement 
 */

function CharacterLimit(containerElement) {
  this.container = containerElement;
  this.input = containerElement.getElementsByClassName('form-input')[0];
  this.maxlength = this.container.getAttribute(MAX_LENGTH);
  this.lastKeyUpTimestamp = null;
  this.oldValue = this.input.value;
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
  var regex = /\d+/;
  var count_message = "";

  if (characters_left === -1) {
    var exceeded = Math.abs(characters_left);
    count_message = CHARACTERS_EXCEEDED_ONE_TEXT.replace(regex, exceeded);
  } else if (characters_left === 1) {
    count_message = CHARACTERS_REMAINING_ONE_TEXT.replace(regex, characters_left);
  } else if (characters_left >= 0) {
    count_message = CHARACTERS_REMAINING_MANY_TEXT.replace(regex, characters_left);
  } else {
    var _exceeded = Math.abs(characters_left);

    count_message = CHARACTERS_EXCEEDED_MANY_TEXT.replace(regex, _exceeded);
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
  var content = "<div tabindex=\"-1\" class=\"".concat(CALENDAR_DATE_PICKER_CLASS, "\">\n      <div class=\"").concat(CALENDAR_ROW_CLASS, "\">\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_YEAR_CLASS, "\"\n            aria-label=\"Navig\xE9r \xE9t \xE5r tilbage\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_PREVIOUS_MONTH_CLASS, "\"\n            aria-label=\"Navig\xE9r \xE9n m\xE5ned tilbage\"\n            ").concat(prevButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_MONTH_LABEL_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_MONTH_SELECTION_CLASS, "\" aria-label=\"").concat(monthLabel, ". V\xE6lg m\xE5ned.\"\n          >").concat(monthLabel, "</button>\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_YEAR_SELECTION_CLASS, "\" aria-label=\"").concat(focusedYear, ". V\xE6lg \xE5r.\"\n          >").concat(focusedYear, "</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_MONTH_CLASS, "\"\n            aria-label=\"Navig\xE9r \xE9n m\xE5ned frem\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n        <div class=\"").concat(CALENDAR_CELL_CLASS, " ").concat(CALENDAR_CELL_CENTER_ITEMS_CLASS, "\">\n          <button \n            type=\"button\"\n            class=\"").concat(CALENDAR_NEXT_YEAR_CLASS, "\"\n            aria-label=\"Navig\xE9r \xE9t \xE5r frem\"\n            ").concat(nextButtonsDisabled ? "disabled=\"disabled\"" : "", "\n          >&nbsp;</button>\n        </div>\n      </div>\n      <table class=\"").concat(CALENDAR_TABLE_CLASS, "\" role=\"presentation\">\n        <thead>\n          <tr>");

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mdW5jdGlvbi10by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGVzLXNlbGVjdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2JlaGF2aW9yLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jb21wb3NlLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9kZWxlZ2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvZGVsZWdhdGVBbGwuanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2lnbm9yZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2tleW1hcC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FsZXJ0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYmFjay10by10b3AuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGFyYWN0ZXItbGltaXQuanMiLCJzcmMvanMvY29tcG9uZW50cy9jaGVja2JveC10b2dnbGUtY29udGVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RhdGUtcGlja2VyLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZHJvcGRvd24tc29ydC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZXJyb3Itc3VtbWFyeS5qcyIsInNyYy9qcy9jb21wb25lbnRzL21vZGFsLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvbmF2aWdhdGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JhZGlvLXRvZ2dsZS1jb250ZW50LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvcmVnZXgtaW5wdXQtbWFzay5qcyIsInNyYy9qcy9jb21wb25lbnRzL3NlbGVjdGFibGUtdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJsZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYm5hdi5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RvYXN0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9vbHRpcC5qcyIsInNyYy9qcy9jb25maWcuanMiLCJzcmMvanMvZGtmZHMuanMiLCJzcmMvanMvZXZlbnRzLmpzIiwic3JjL2pzL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvT2JqZWN0L2RlZmluZVByb3BlcnR5LmpzIiwic3JjL2pzL3BvbHlmaWxscy9jdXN0b20tZXZlbnQuanMiLCJzcmMvanMvcG9seWZpbGxzL2VsZW1lbnQtaGlkZGVuLmpzIiwic3JjL2pzL3BvbHlmaWxscy9pbmRleC5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvbnVtYmVyLWlzLW5hbi5qcyIsInNyYy9qcy91dGlscy9hY3RpdmUtZWxlbWVudC5qcyIsInNyYy9qcy91dGlscy9iZWhhdmlvci5qcyIsInNyYy9qcy91dGlscy9icmVha3BvaW50cy5qcyIsInNyYy9qcy91dGlscy9pcy1pbi12aWV3cG9ydC5qcyIsInNyYy9qcy91dGlscy9pcy1pb3MtZGV2aWNlLmpzIiwic3JjL2pzL3V0aWxzL3NlbGVjdC5qcyIsInNyYy9qcy91dGlscy90b2dnbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBUyxPQUFU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IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIGFycmF5LWZvcmVhY2hcbiAqICAgQXJyYXkjZm9yRWFjaCBwb255ZmlsbCBmb3Igb2xkZXIgYnJvd3NlcnNcbiAqICAgKFBvbnlmaWxsOiBBIHBvbHlmaWxsIHRoYXQgZG9lc24ndCBvdmVyd3JpdGUgdGhlIG5hdGl2ZSBtZXRob2QpXG4gKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LTIwMTYgVGFrdXRvIFdhZGFcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL3R3YWRhL2FycmF5LWZvcmVhY2gvYmxvYi9tYXN0ZXIvTUlULUxJQ0VOU0VcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2ggKGFyeSwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBpZiAoYXJ5LmZvckVhY2gpIHtcbiAgICAgICAgYXJ5LmZvckVhY2goY2FsbGJhY2ssIHRoaXNBcmcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJ5Lmxlbmd0aDsgaSs9MSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIGFyeVtpXSwgaSwgYXJ5KTtcbiAgICB9XG59O1xuIiwiLypcbiAqIGNsYXNzTGlzdC5qczogQ3Jvc3MtYnJvd3NlciBmdWxsIGVsZW1lbnQuY2xhc3NMaXN0IGltcGxlbWVudGF0aW9uLlxuICogMS4xLjIwMTcwNDI3XG4gKlxuICogQnkgRWxpIEdyZXksIGh0dHA6Ly9lbGlncmV5LmNvbVxuICogTGljZW5zZTogRGVkaWNhdGVkIHRvIHRoZSBwdWJsaWMgZG9tYWluLlxuICogICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG4vKmdsb2JhbCBzZWxmLCBkb2N1bWVudCwgRE9NRXhjZXB0aW9uICovXG5cbi8qISBAc291cmNlIGh0dHA6Ly9wdXJsLmVsaWdyZXkuY29tL2dpdGh1Yi9jbGFzc0xpc3QuanMvYmxvYi9tYXN0ZXIvY2xhc3NMaXN0LmpzICovXG5cbmlmIChcImRvY3VtZW50XCIgaW4gd2luZG93LnNlbGYpIHtcblxuLy8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxuLy8gSW5jbHVkaW5nIElFIDwgRWRnZSBtaXNzaW5nIFNWR0VsZW1lbnQuY2xhc3NMaXN0XG5pZiAoIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpKSBcblx0fHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TICYmICEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFwiZ1wiKSkpIHtcblxuKGZ1bmN0aW9uICh2aWV3KSB7XG5cblwidXNlIHN0cmljdFwiO1xuXG5pZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcblxudmFyXG5cdCAgY2xhc3NMaXN0UHJvcCA9IFwiY2xhc3NMaXN0XCJcblx0LCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG5cdCwgZWxlbUN0clByb3RvID0gdmlldy5FbGVtZW50W3Byb3RvUHJvcF1cblx0LCBvYmpDdHIgPSBPYmplY3Rcblx0LCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgXCJcIik7XG5cdH1cblx0LCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIGkgPSAwXG5cdFx0XHQsIGxlbiA9IHRoaXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9XG5cdC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xuXHQsIERPTUV4ID0gZnVuY3Rpb24gKHR5cGUsIG1lc3NhZ2UpIHtcblx0XHR0aGlzLm5hbWUgPSB0eXBlO1xuXHRcdHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcblx0XHR0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuXHR9XG5cdCwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcblx0XHRpZiAodG9rZW4gPT09IFwiXCIpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIlNZTlRBWF9FUlJcIlxuXHRcdFx0XHQsIFwiQW4gaW52YWxpZCBvciBpbGxlZ2FsIHN0cmluZyB3YXMgc3BlY2lmaWVkXCJcblx0XHRcdCk7XG5cdFx0fVxuXHRcdGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xuXHRcdFx0dGhyb3cgbmV3IERPTUV4KFxuXHRcdFx0XHQgIFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCJcblx0XHRcdFx0LCBcIlN0cmluZyBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3RlclwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xuXHR9XG5cdCwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcblx0XHR2YXJcblx0XHRcdCAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKVxuXHRcdFx0LCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cblx0XHRcdCwgaSA9IDBcblx0XHRcdCwgbGVuID0gY2xhc3Nlcy5sZW5ndGhcblx0XHQ7XG5cdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0dGhpcy5wdXNoKGNsYXNzZXNbaV0pO1xuXHRcdH1cblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRlbGVtLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIHRoaXMudG9TdHJpbmcoKSk7XG5cdFx0fTtcblx0fVxuXHQsIGNsYXNzTGlzdFByb3RvID0gQ2xhc3NMaXN0W3Byb3RvUHJvcF0gPSBbXVxuXHQsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IENsYXNzTGlzdCh0aGlzKTtcblx0fVxuO1xuLy8gTW9zdCBET01FeGNlcHRpb24gaW1wbGVtZW50YXRpb25zIGRvbid0IGFsbG93IGNhbGxpbmcgRE9NRXhjZXB0aW9uJ3MgdG9TdHJpbmcoKVxuLy8gb24gbm9uLURPTUV4Y2VwdGlvbnMuIEVycm9yJ3MgdG9TdHJpbmcoKSBpcyBzdWZmaWNpZW50IGhlcmUuXG5ET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcbmNsYXNzTGlzdFByb3RvLml0ZW0gPSBmdW5jdGlvbiAoaSkge1xuXHRyZXR1cm4gdGhpc1tpXSB8fCBudWxsO1xufTtcbmNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cdHJldHVybiBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pICE9PSAtMTtcbn07XG5jbGFzc0xpc3RQcm90by5hZGQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xuXHRcdFx0dGhpcy5wdXNoKHRva2VuKTtcblx0XHRcdHVwZGF0ZWQgPSB0cnVlO1xuXHRcdH1cblx0fVxuXHR3aGlsZSAoKytpIDwgbCk7XG5cblx0aWYgKHVwZGF0ZWQpIHtcblx0XHR0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0dmFyXG5cdFx0ICB0b2tlbnMgPSBhcmd1bWVudHNcblx0XHQsIGkgPSAwXG5cdFx0LCBsID0gdG9rZW5zLmxlbmd0aFxuXHRcdCwgdG9rZW5cblx0XHQsIHVwZGF0ZWQgPSBmYWxzZVxuXHRcdCwgaW5kZXhcblx0O1xuXHRkbyB7XG5cdFx0dG9rZW4gPSB0b2tlbnNbaV0gKyBcIlwiO1xuXHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR3aGlsZSAoaW5kZXggIT09IC0xKSB7XG5cdFx0XHR0aGlzLnNwbGljZShpbmRleCwgMSk7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHRcdGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG5cdHRva2VuICs9IFwiXCI7XG5cblx0dmFyXG5cdFx0ICByZXN1bHQgPSB0aGlzLmNvbnRhaW5zKHRva2VuKVxuXHRcdCwgbWV0aG9kID0gcmVzdWx0ID9cblx0XHRcdGZvcmNlICE9PSB0cnVlICYmIFwicmVtb3ZlXCJcblx0XHQ6XG5cdFx0XHRmb3JjZSAhPT0gZmFsc2UgJiYgXCJhZGRcIlxuXHQ7XG5cblx0aWYgKG1ldGhvZCkge1xuXHRcdHRoaXNbbWV0aG9kXSh0b2tlbik7XG5cdH1cblxuXHRpZiAoZm9yY2UgPT09IHRydWUgfHwgZm9yY2UgPT09IGZhbHNlKSB7XG5cdFx0cmV0dXJuIGZvcmNlO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiAhcmVzdWx0O1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmpvaW4oXCIgXCIpO1xufTtcblxuaWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xuXHR2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XG5cdFx0ICBnZXQ6IGNsYXNzTGlzdEdldHRlclxuXHRcdCwgZW51bWVyYWJsZTogdHJ1ZVxuXHRcdCwgY29uZmlndXJhYmxlOiB0cnVlXG5cdH07XG5cdHRyeSB7XG5cdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHR9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcblx0XHQvLyBhZGRpbmcgdW5kZWZpbmVkIHRvIGZpZ2h0IHRoaXMgaXNzdWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2lzc3Vlcy8zNlxuXHRcdC8vIG1vZGVybmllIElFOC1NU1c3IG1hY2hpbmUgaGFzIElFOCA4LjAuNjAwMS4xODcwMiBhbmQgaXMgYWZmZWN0ZWRcblx0XHRpZiAoZXgubnVtYmVyID09PSB1bmRlZmluZWQgfHwgZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xuXHRcdFx0Y2xhc3NMaXN0UHJvcERlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuXHRcdFx0b2JqQ3RyLmRlZmluZVByb3BlcnR5KGVsZW1DdHJQcm90bywgY2xhc3NMaXN0UHJvcCwgY2xhc3NMaXN0UHJvcERlc2MpO1xuXHRcdH1cblx0fVxufSBlbHNlIGlmIChvYmpDdHJbcHJvdG9Qcm9wXS5fX2RlZmluZUdldHRlcl9fKSB7XG5cdGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XG59XG5cbn0od2luZG93LnNlbGYpKTtcblxufVxuXG4vLyBUaGVyZSBpcyBmdWxsIG9yIHBhcnRpYWwgbmF0aXZlIGNsYXNzTGlzdCBzdXBwb3J0LCBzbyBqdXN0IGNoZWNrIGlmIHdlIG5lZWRcbi8vIHRvIG5vcm1hbGl6ZSB0aGUgYWRkL3JlbW92ZSBhbmQgdG9nZ2xlIEFQSXMuXG5cbihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJfXCIpO1xuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjMVwiLCBcImMyXCIpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMC8xMSBhbmQgRmlyZWZveCA8MjYsIHdoZXJlIGNsYXNzTGlzdC5hZGQgYW5kXG5cdC8vIGNsYXNzTGlzdC5yZW1vdmUgZXhpc3QgYnV0IHN1cHBvcnQgb25seSBvbmUgYXJndW1lbnQgYXQgYSB0aW1lLlxuXHRpZiAoIXRlc3RFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcImMyXCIpKSB7XG5cdFx0dmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuXHRcdFx0dmFyIG9yaWdpbmFsID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdO1xuXG5cdFx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbih0b2tlbikge1xuXHRcdFx0XHR2YXIgaSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0XHR0b2tlbiA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdFx0XHRvcmlnaW5hbC5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9O1xuXHRcdGNyZWF0ZU1ldGhvZCgnYWRkJyk7XG5cdFx0Y3JlYXRlTWV0aG9kKCdyZW1vdmUnKTtcblx0fVxuXG5cdHRlc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoXCJjM1wiLCBmYWxzZSk7XG5cblx0Ly8gUG9seWZpbGwgZm9yIElFIDEwIGFuZCBGaXJlZm94IDwyNCwgd2hlcmUgY2xhc3NMaXN0LnRvZ2dsZSBkb2VzIG5vdFxuXHQvLyBzdXBwb3J0IHRoZSBzZWNvbmQgYXJndW1lbnQuXG5cdGlmICh0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjM1wiKSkge1xuXHRcdHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XG5cblx0XHRET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKHRva2VuLCBmb3JjZSkge1xuXHRcdFx0aWYgKDEgaW4gYXJndW1lbnRzICYmICF0aGlzLmNvbnRhaW5zKHRva2VuKSA9PT0gIWZvcmNlKSB7XG5cdFx0XHRcdHJldHVybiBmb3JjZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBfdG9nZ2xlLmNhbGwodGhpcywgdG9rZW4pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fVxuXG5cdHRlc3RFbGVtZW50ID0gbnVsbDtcbn0oKSk7XG5cbn1cbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuQXJyYXkuZnJvbTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5hc3NpZ247XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjYuMTInIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBzb3VyY2UpIHtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkY7XG4gIHZhciBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HO1xuICB2YXIgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuUztcbiAgdmFyIElTX1BST1RPID0gdHlwZSAmICRleHBvcnQuUDtcbiAgdmFyIElTX0JJTkQgPSB0eXBlICYgJGV4cG9ydC5CO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KTtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYgKHRhcmdldCkgcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYgKGV4cG9ydHNba2V5XSAhPSBvdXQpIGhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmIChJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dCkgZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ25hdGl2ZS1mdW5jdGlvbi10by1zdHJpbmcnLCBGdW5jdGlvbi50b1N0cmluZyk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZiAodHlwZW9mIF9fZyA9PSAnbnVtYmVyJykgX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuIiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcykge1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkgYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBkZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KSB7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwgeyBuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpIH0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgJGl0ZXJDcmVhdGUgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpOyAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG52YXIgRkZfSVRFUkFUT1IgPSAnQEBpdGVyYXRvcic7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICBpZiAoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pIHJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTO1xuICB2YXIgVkFMVUVTX0JVRyA9IGZhbHNlO1xuICB2YXIgcHJvdG8gPSBCYXNlLnByb3RvdHlwZTtcbiAgdmFyICRuYXRpdmUgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF07XG4gIHZhciAkZGVmYXVsdCA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpO1xuICB2YXIgJGVudHJpZXMgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkO1xuICB2YXIgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmU7XG4gIHZhciBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmICgkYW55TmF0aXZlKSB7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYgKCFMSUJSQVJZICYmIHR5cGVvZiBJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUl0gIT0gJ2Z1bmN0aW9uJykgaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKSB7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSA9IHJldHVyblRoaXM7XG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoIShrZXkgaW4gcHJvdG8pKSByZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwidmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24gKCkgeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbiAoKSB7IHRocm93IDI7IH0pO1xufSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMsIHNraXBDbG9zaW5nKSB7XG4gIGlmICghc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORykgcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBbN107XG4gICAgdmFyIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geyBkb25lOiBzYWZlID0gdHJ1ZSB9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyICRhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgUyA9IFN5bWJvbCgpO1xuICB2YXIgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUID0gdG9PYmplY3QodGFyZ2V0KTtcbiAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAxO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgdmFyIGlzRW51bSA9IHBJRS5mO1xuICB3aGlsZSAoYUxlbiA+IGluZGV4KSB7XG4gICAgdmFyIFMgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgdmFyIGtleXMgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikge1xuICAgICAga2V5ID0ga2V5c1tqKytdO1xuICAgICAgaWYgKCFERVNDUklQVE9SUyB8fCBpc0VudW0uY2FsbChTLCBrZXkpKSBUW2tleV0gPSBTW2tleV07XG4gICAgfVxuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247XG4iLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGRQcyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBFbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpO1xuICB2YXIgaSA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAoaS0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBkUCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG4gIHZhciBQO1xuICB3aGlsZSAobGVuZ3RoID4gaSkgZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59O1xuIiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIChPKSB7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYgKGhhcyhPLCBJRV9QUk9UTykpIHJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYgKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSU9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgaWYgKGtleSAhPSBJRV9QUk9UTykgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgU1JDID0gcmVxdWlyZSgnLi9fdWlkJykoJ3NyYycpO1xudmFyICR0b1N0cmluZyA9IHJlcXVpcmUoJy4vX2Z1bmN0aW9uLXRvLXN0cmluZycpO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgVFBMID0gKCcnICsgJHRvU3RyaW5nKS5zcGxpdChUT19TVFJJTkcpO1xuXG5yZXF1aXJlKCcuL19jb3JlJykuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gJHRvU3RyaW5nLmNhbGwoaXQpO1xufTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsLCBzYWZlKSB7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgJ25hbWUnKSB8fCBoaWRlKHZhbCwgJ25hbWUnLCBrZXkpO1xuICBpZiAoT1trZXldID09PSB2YWwpIHJldHVybjtcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsIFNSQykgfHwgaGlkZSh2YWwsIFNSQywgT1trZXldID8gJycgKyBPW2tleV0gOiBUUEwuam9pbihTdHJpbmcoa2V5KSkpO1xuICBpZiAoTyA9PT0gZ2xvYmFsKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKCFzYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfSBlbHNlIGlmIChPW2tleV0pIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSB7XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH1cbi8vIGFkZCBmYWtlIEZ1bmN0aW9uI3RvU3RyaW5nIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxufSkoRnVuY3Rpb24ucHJvdG90eXBlLCBUT19TVFJJTkcsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiB0aGlzW1NSQ10gfHwgJHRvU3RyaW5nLmNhbGwodGhpcyk7XG59KTtcbiIsInZhciBkZWYgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgdGFnLCBzdGF0KSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKSBkZWYoaXQsIFRBRywgeyBjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWcgfSk7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246IGNvcmUudmVyc2lvbixcbiAgbW9kZTogcmVxdWlyZSgnLi9fbGlicmFyeScpID8gJ3B1cmUnIDogJ2dsb2JhbCcsXG4gIGNvcHlyaWdodDogJ8KpIDIwMjAgRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknXG59KTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikgeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgbWFwZm4gPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYgKG1hcHBpbmcpIG1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYgKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDKCk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvciAocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHsgYXNzaWduOiByZXF1aXJlKCcuL19vYmplY3QtYXNzaWduJykgfSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIi8qIGdsb2JhbCBkZWZpbmUsIEtleWJvYXJkRXZlbnQsIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gIHZhciBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSB7XG4gICAgcG9seWZpbGw6IHBvbHlmaWxsLFxuICAgIGtleXM6IHtcbiAgICAgIDM6ICdDYW5jZWwnLFxuICAgICAgNjogJ0hlbHAnLFxuICAgICAgODogJ0JhY2tzcGFjZScsXG4gICAgICA5OiAnVGFiJyxcbiAgICAgIDEyOiAnQ2xlYXInLFxuICAgICAgMTM6ICdFbnRlcicsXG4gICAgICAxNjogJ1NoaWZ0JyxcbiAgICAgIDE3OiAnQ29udHJvbCcsXG4gICAgICAxODogJ0FsdCcsXG4gICAgICAxOTogJ1BhdXNlJyxcbiAgICAgIDIwOiAnQ2Fwc0xvY2snLFxuICAgICAgMjc6ICdFc2NhcGUnLFxuICAgICAgMjg6ICdDb252ZXJ0JyxcbiAgICAgIDI5OiAnTm9uQ29udmVydCcsXG4gICAgICAzMDogJ0FjY2VwdCcsXG4gICAgICAzMTogJ01vZGVDaGFuZ2UnLFxuICAgICAgMzI6ICcgJyxcbiAgICAgIDMzOiAnUGFnZVVwJyxcbiAgICAgIDM0OiAnUGFnZURvd24nLFxuICAgICAgMzU6ICdFbmQnLFxuICAgICAgMzY6ICdIb21lJyxcbiAgICAgIDM3OiAnQXJyb3dMZWZ0JyxcbiAgICAgIDM4OiAnQXJyb3dVcCcsXG4gICAgICAzOTogJ0Fycm93UmlnaHQnLFxuICAgICAgNDA6ICdBcnJvd0Rvd24nLFxuICAgICAgNDE6ICdTZWxlY3QnLFxuICAgICAgNDI6ICdQcmludCcsXG4gICAgICA0MzogJ0V4ZWN1dGUnLFxuICAgICAgNDQ6ICdQcmludFNjcmVlbicsXG4gICAgICA0NTogJ0luc2VydCcsXG4gICAgICA0NjogJ0RlbGV0ZScsXG4gICAgICA0ODogWycwJywgJyknXSxcbiAgICAgIDQ5OiBbJzEnLCAnISddLFxuICAgICAgNTA6IFsnMicsICdAJ10sXG4gICAgICA1MTogWyczJywgJyMnXSxcbiAgICAgIDUyOiBbJzQnLCAnJCddLFxuICAgICAgNTM6IFsnNScsICclJ10sXG4gICAgICA1NDogWyc2JywgJ14nXSxcbiAgICAgIDU1OiBbJzcnLCAnJiddLFxuICAgICAgNTY6IFsnOCcsICcqJ10sXG4gICAgICA1NzogWyc5JywgJygnXSxcbiAgICAgIDkxOiAnT1MnLFxuICAgICAgOTM6ICdDb250ZXh0TWVudScsXG4gICAgICAxNDQ6ICdOdW1Mb2NrJyxcbiAgICAgIDE0NTogJ1Njcm9sbExvY2snLFxuICAgICAgMTgxOiAnVm9sdW1lTXV0ZScsXG4gICAgICAxODI6ICdWb2x1bWVEb3duJyxcbiAgICAgIDE4MzogJ1ZvbHVtZVVwJyxcbiAgICAgIDE4NjogWyc7JywgJzonXSxcbiAgICAgIDE4NzogWyc9JywgJysnXSxcbiAgICAgIDE4ODogWycsJywgJzwnXSxcbiAgICAgIDE4OTogWyctJywgJ18nXSxcbiAgICAgIDE5MDogWycuJywgJz4nXSxcbiAgICAgIDE5MTogWycvJywgJz8nXSxcbiAgICAgIDE5MjogWydgJywgJ34nXSxcbiAgICAgIDIxOTogWydbJywgJ3snXSxcbiAgICAgIDIyMDogWydcXFxcJywgJ3wnXSxcbiAgICAgIDIyMTogWyddJywgJ30nXSxcbiAgICAgIDIyMjogW1wiJ1wiLCAnXCInXSxcbiAgICAgIDIyNDogJ01ldGEnLFxuICAgICAgMjI1OiAnQWx0R3JhcGgnLFxuICAgICAgMjQ2OiAnQXR0bicsXG4gICAgICAyNDc6ICdDclNlbCcsXG4gICAgICAyNDg6ICdFeFNlbCcsXG4gICAgICAyNDk6ICdFcmFzZUVvZicsXG4gICAgICAyNTA6ICdQbGF5JyxcbiAgICAgIDI1MTogJ1pvb21PdXQnXG4gICAgfVxuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIGtleXMgKEYxLTI0KS5cbiAgdmFyIGk7XG4gIGZvciAoaSA9IDE7IGkgPCAyNTsgaSsrKSB7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbMTExICsgaV0gPSAnRicgKyBpO1xuICB9XG5cbiAgLy8gUHJpbnRhYmxlIEFTQ0lJIGNoYXJhY3RlcnMuXG4gIHZhciBsZXR0ZXIgPSAnJztcbiAgZm9yIChpID0gNjU7IGkgPCA5MTsgaSsrKSB7XG4gICAgbGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKTtcbiAgICBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1tpXSA9IFtsZXR0ZXIudG9Mb3dlckNhc2UoKSwgbGV0dGVyLnRvVXBwZXJDYXNlKCldO1xuICB9XG5cbiAgZnVuY3Rpb24gcG9seWZpbGwgKCkge1xuICAgIGlmICghKCdLZXlib2FyZEV2ZW50JyBpbiB3aW5kb3cpIHx8XG4gICAgICAgICdrZXknIGluIEtleWJvYXJkRXZlbnQucHJvdG90eXBlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gUG9seWZpbGwgYGtleWAgb24gYEtleWJvYXJkRXZlbnRgLlxuICAgIHZhciBwcm90byA9IHtcbiAgICAgIGdldDogZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzW3RoaXMud2hpY2ggfHwgdGhpcy5rZXlDb2RlXTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAga2V5ID0ga2V5Wyt0aGlzLnNoaWZ0S2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgICB9XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUsICdrZXknLCBwcm90byk7XG4gICAgcmV0dXJuIHByb3RvO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgna2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwnLCBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9IGVsc2UgaWYgKHdpbmRvdykge1xuICAgIHdpbmRvdy5rZXlib2FyZGV2ZW50S2V5UG9seWZpbGwgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGw7XG4gIH1cblxufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHByb3RvID0gdHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnID8gRWxlbWVudC5wcm90b3R5cGUgOiB7fTtcbnZhciB2ZW5kb3IgPSBwcm90by5tYXRjaGVzXG4gIHx8IHByb3RvLm1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ubW96TWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm1zTWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm9NYXRjaGVzU2VsZWN0b3I7XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2g7XG5cbi8qKlxuICogTWF0Y2ggYGVsYCB0byBgc2VsZWN0b3JgLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gbWF0Y2goZWwsIHNlbGVjdG9yKSB7XG4gIGlmICghZWwgfHwgZWwubm9kZVR5cGUgIT09IDEpIHJldHVybiBmYWxzZTtcbiAgaWYgKHZlbmRvcikgcmV0dXJuIHZlbmRvci5jYWxsKGVsLCBzZWxlY3Rvcik7XG4gIHZhciBub2RlcyA9IGVsLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobm9kZXNbaV0gPT0gZWwpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJjb25zdCBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5jb25zdCBkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcbmNvbnN0IGRlbGVnYXRlQWxsID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZUFsbCcpO1xuXG5jb25zdCBERUxFR0FURV9QQVRURVJOID0gL14oLispOmRlbGVnYXRlXFwoKC4rKVxcKSQvO1xuY29uc3QgU1BBQ0UgPSAnICc7XG5cbmNvbnN0IGdldExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgdmFyIG1hdGNoID0gdHlwZS5tYXRjaChERUxFR0FURV9QQVRURVJOKTtcbiAgdmFyIHNlbGVjdG9yO1xuICBpZiAobWF0Y2gpIHtcbiAgICB0eXBlID0gbWF0Y2hbMV07XG4gICAgc2VsZWN0b3IgPSBtYXRjaFsyXTtcbiAgfVxuXG4gIHZhciBvcHRpb25zO1xuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIGNhcHR1cmU6IHBvcEtleShoYW5kbGVyLCAnY2FwdHVyZScpLFxuICAgICAgcGFzc2l2ZTogcG9wS2V5KGhhbmRsZXIsICdwYXNzaXZlJylcbiAgICB9O1xuICB9XG5cbiAgdmFyIGxpc3RlbmVyID0ge1xuICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICBkZWxlZ2F0ZTogKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0JylcbiAgICAgID8gZGVsZWdhdGVBbGwoaGFuZGxlcilcbiAgICAgIDogc2VsZWN0b3JcbiAgICAgICAgPyBkZWxlZ2F0ZShzZWxlY3RvciwgaGFuZGxlcilcbiAgICAgICAgOiBoYW5kbGVyLFxuICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgfTtcblxuICBpZiAodHlwZS5pbmRleE9mKFNQQUNFKSA+IC0xKSB7XG4gICAgcmV0dXJuIHR5cGUuc3BsaXQoU1BBQ0UpLm1hcChmdW5jdGlvbihfdHlwZSkge1xuICAgICAgcmV0dXJuIGFzc2lnbih7dHlwZTogX3R5cGV9LCBsaXN0ZW5lcik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdGVuZXIudHlwZSA9IHR5cGU7XG4gICAgcmV0dXJuIFtsaXN0ZW5lcl07XG4gIH1cbn07XG5cbnZhciBwb3BLZXkgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgZGVsZXRlIG9ialtrZXldO1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJlaGF2aW9yKGV2ZW50cywgcHJvcHMpIHtcbiAgY29uc3QgbGlzdGVuZXJzID0gT2JqZWN0LmtleXMoZXZlbnRzKVxuICAgIC5yZWR1Y2UoZnVuY3Rpb24obWVtbywgdHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycyA9IGdldExpc3RlbmVycyh0eXBlLCBldmVudHNbdHlwZV0pO1xuICAgICAgcmV0dXJuIG1lbW8uY29uY2F0KGxpc3RlbmVycyk7XG4gICAgfSwgW10pO1xuXG4gIHJldHVybiBhc3NpZ24oe1xuICAgIGFkZDogZnVuY3Rpb24gYWRkQmVoYXZpb3IoZWxlbWVudCkge1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgIGxpc3RlbmVyLnR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIuZGVsZWdhdGUsXG4gICAgICAgICAgbGlzdGVuZXIub3B0aW9uc1xuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZUJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwgcHJvcHMpO1xufTtcbiIsImNvbnN0IG1hdGNoZXMgPSByZXF1aXJlKCdtYXRjaGVzLXNlbGVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgZG8ge1xuICAgIGlmIChtYXRjaGVzKGVsZW1lbnQsIHNlbGVjdG9yKSkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuICB9IHdoaWxlICgoZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkgJiYgZWxlbWVudC5ub2RlVHlwZSA9PT0gMSk7XG59O1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBvc2UoZnVuY3Rpb25zKSB7XG4gIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9ucy5zb21lKGZ1bmN0aW9uKGZuKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBlKSA9PT0gZmFsc2U7XG4gICAgfSwgdGhpcyk7XG4gIH07XG59O1xuIiwiY29uc3QgY2xvc2VzdCA9IHJlcXVpcmUoJy4vY2xvc2VzdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlbGVnYXRlKHNlbGVjdG9yLCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZGVsZWdhdGlvbihldmVudCkge1xuICAgIHZhciB0YXJnZXQgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgc2VsZWN0b3IpO1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRhcmdldCwgZXZlbnQpO1xuICAgIH1cbiAgfVxufTtcbiIsImNvbnN0IGRlbGVnYXRlID0gcmVxdWlyZSgnLi9kZWxlZ2F0ZScpO1xuY29uc3QgY29tcG9zZSA9IHJlcXVpcmUoJy4vY29tcG9zZScpO1xuXG5jb25zdCBTUExBVCA9ICcqJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZUFsbChzZWxlY3RvcnMpIHtcbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHNlbGVjdG9ycylcblxuICAvLyBYWFggb3B0aW1pemF0aW9uOiBpZiB0aGVyZSBpcyBvbmx5IG9uZSBoYW5kbGVyIGFuZCBpdCBhcHBsaWVzIHRvXG4gIC8vIGFsbCBlbGVtZW50cyAodGhlIFwiKlwiIENTUyBzZWxlY3RvciksIHRoZW4ganVzdCByZXR1cm4gdGhhdFxuICAvLyBoYW5kbGVyXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMSAmJiBrZXlzWzBdID09PSBTUExBVCkge1xuICAgIHJldHVybiBzZWxlY3RvcnNbU1BMQVRdO1xuICB9XG5cbiAgY29uc3QgZGVsZWdhdGVzID0ga2V5cy5yZWR1Y2UoZnVuY3Rpb24obWVtbywgc2VsZWN0b3IpIHtcbiAgICBtZW1vLnB1c2goZGVsZWdhdGUoc2VsZWN0b3IsIHNlbGVjdG9yc1tzZWxlY3Rvcl0pKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfSwgW10pO1xuICByZXR1cm4gY29tcG9zZShkZWxlZ2F0ZXMpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaWdub3JlKGVsZW1lbnQsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBpZ25vcmFuY2UoZSkge1xuICAgIGlmIChlbGVtZW50ICE9PSBlLnRhcmdldCAmJiAhZWxlbWVudC5jb250YWlucyhlLnRhcmdldCkpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGUpO1xuICAgIH1cbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBiZWhhdmlvcjogcmVxdWlyZSgnLi9iZWhhdmlvcicpLFxuICBkZWxlZ2F0ZTogcmVxdWlyZSgnLi9kZWxlZ2F0ZScpLFxuICBkZWxlZ2F0ZUFsbDogcmVxdWlyZSgnLi9kZWxlZ2F0ZUFsbCcpLFxuICBpZ25vcmU6IHJlcXVpcmUoJy4vaWdub3JlJyksXG4gIGtleW1hcDogcmVxdWlyZSgnLi9rZXltYXAnKSxcbn07XG4iLCJyZXF1aXJlKCdrZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbCcpO1xuXG4vLyB0aGVzZSBhcmUgdGhlIG9ubHkgcmVsZXZhbnQgbW9kaWZpZXJzIHN1cHBvcnRlZCBvbiBhbGwgcGxhdGZvcm1zLFxuLy8gYWNjb3JkaW5nIHRvIE1ETjpcbi8vIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvS2V5Ym9hcmRFdmVudC9nZXRNb2RpZmllclN0YXRlPlxuY29uc3QgTU9ESUZJRVJTID0ge1xuICAnQWx0JzogICAgICAnYWx0S2V5JyxcbiAgJ0NvbnRyb2wnOiAgJ2N0cmxLZXknLFxuICAnQ3RybCc6ICAgICAnY3RybEtleScsXG4gICdTaGlmdCc6ICAgICdzaGlmdEtleSdcbn07XG5cbmNvbnN0IE1PRElGSUVSX1NFUEFSQVRPUiA9ICcrJztcblxuY29uc3QgZ2V0RXZlbnRLZXkgPSBmdW5jdGlvbihldmVudCwgaGFzTW9kaWZpZXJzKSB7XG4gIHZhciBrZXkgPSBldmVudC5rZXk7XG4gIGlmIChoYXNNb2RpZmllcnMpIHtcbiAgICBmb3IgKHZhciBtb2RpZmllciBpbiBNT0RJRklFUlMpIHtcbiAgICAgIGlmIChldmVudFtNT0RJRklFUlNbbW9kaWZpZXJdXSA9PT0gdHJ1ZSkge1xuICAgICAgICBrZXkgPSBbbW9kaWZpZXIsIGtleV0uam9pbihNT0RJRklFUl9TRVBBUkFUT1IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4ga2V5O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBrZXltYXAoa2V5cykge1xuICBjb25zdCBoYXNNb2RpZmllcnMgPSBPYmplY3Qua2V5cyhrZXlzKS5zb21lKGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBrZXkuaW5kZXhPZihNT0RJRklFUl9TRVBBUkFUT1IpID4gLTE7XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIga2V5ID0gZ2V0RXZlbnRLZXkoZXZlbnQsIGhhc01vZGlmaWVycyk7XG4gICAgcmV0dXJuIFtrZXksIGtleS50b0xvd2VyQ2FzZSgpXVxuICAgICAgLnJlZHVjZShmdW5jdGlvbihyZXN1bHQsIF9rZXkpIHtcbiAgICAgICAgaWYgKF9rZXkgaW4ga2V5cykge1xuICAgICAgICAgIHJlc3VsdCA9IGtleXNba2V5XS5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSwgdW5kZWZpbmVkKTtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLk1PRElGSUVSUyA9IE1PRElGSUVSUztcbiIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0ICcuLi9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQnO1xyXG5jb25zdCB0b2dnbGUgPSByZXF1aXJlKCcuLi91dGlscy90b2dnbGUnKTtcclxuY29uc3QgaXNFbGVtZW50SW5WaWV3cG9ydCA9IHJlcXVpcmUoJy4uL3V0aWxzL2lzLWluLXZpZXdwb3J0Jyk7XHJcbmNvbnN0IEJVVFRPTiA9IGAuYWNjb3JkaW9uLWJ1dHRvblthcmlhLWNvbnRyb2xzXWA7XHJcbmNvbnN0IEVYUEFOREVEID0gJ2FyaWEtZXhwYW5kZWQnO1xyXG5jb25zdCBNVUxUSVNFTEVDVEFCTEUgPSAnYXJpYS1tdWx0aXNlbGVjdGFibGUnO1xyXG5jb25zdCBNVUxUSVNFTEVDVEFCTEVfQ0xBU1MgPSAnYWNjb3JkaW9uLW11bHRpc2VsZWN0YWJsZSc7XHJcbmNvbnN0IEJVTEtfRlVOQ1RJT05fT1BFTl9URVhUID0gXCLDhWJuIGFsbGVcIjtcclxuY29uc3QgQlVMS19GVU5DVElPTl9DTE9TRV9URVhUID0gXCJMdWsgYWxsZVwiO1xyXG5jb25zdCBCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUgPSBcImRhdGEtYWNjb3JkaW9uLWJ1bGstZXhwYW5kXCI7XHJcblxyXG4vKipcclxuICogQWRkcyBjbGljayBmdW5jdGlvbmFsaXR5IHRvIGFjY29yZGlvbiBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICRhY2NvcmRpb24gdGhlIGFjY29yZGlvbiB1bCBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBBY2NvcmRpb24oJGFjY29yZGlvbil7XHJcbiAgaWYoISRhY2NvcmRpb24pe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGFjY29yZGlvbiBncm91cCBlbGVtZW50YCk7XHJcbiAgfVxyXG4gIHRoaXMuYWNjb3JkaW9uID0gJGFjY29yZGlvbjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudGxpc3RlbmVycyBvbiBjbGljayBlbGVtZW50cyBpbiBhY2NvcmRpb24gbGlzdFxyXG4gKi9cclxuQWNjb3JkaW9uLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLmJ1dHRvbnMgPSB0aGlzLmFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbiAgaWYodGhpcy5idXR0b25zLmxlbmd0aCA9PSAwKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBhY2NvcmRpb24gYnV0dG9uc2ApO1xyXG4gIH1cclxuXHJcbiAgLy8gbG9vcCBidXR0b25zIGluIGxpc3RcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrKyl7XHJcbiAgICBsZXQgY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9uc1tpXTtcclxuICAgIFxyXG4gICAgLy8gVmVyaWZ5IHN0YXRlIG9uIGJ1dHRvbiBhbmQgc3RhdGUgb24gcGFuZWxcclxuICAgIGxldCBleHBhbmRlZCA9IGN1cnJlbnRCdXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnO1xyXG4gICAgdGhpcy50b2dnbGVCdXR0b24oY3VycmVudEJ1dHRvbiwgZXhwYW5kZWQpO1xyXG4gICAgXHJcbiAgICAvLyBTZXQgY2xpY2sgZXZlbnQgb24gYWNjb3JkaW9uIGJ1dHRvbnNcclxuICAgIGN1cnJlbnRCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmV2ZW50T25DbGljay5iaW5kKHRoaXMsIGN1cnJlbnRCdXR0b24pLCBmYWxzZSk7XHJcbiAgICBjdXJyZW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ldmVudE9uQ2xpY2suYmluZCh0aGlzLCBjdXJyZW50QnV0dG9uKSwgZmFsc2UpO1xyXG4gIH1cclxuICAvLyBTZXQgY2xpY2sgZXZlbnQgb24gYnVsayBidXR0b24gaWYgcHJlc2VudFxyXG4gIGxldCBwcmV2U2libGluZyA9IHRoaXMuYWNjb3JkaW9uLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgO1xyXG4gIGlmKHByZXZTaWJsaW5nICE9PSBudWxsICYmIHByZXZTaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uLWJ1bGstYnV0dG9uJykpe1xyXG4gICAgdGhpcy5idWxrRnVuY3Rpb25CdXR0b24gPSBwcmV2U2libGluZztcclxuICAgIHRoaXMuYnVsa0Z1bmN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5idWxrRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQnVsayBldmVudCBoYW5kbGVyOiBUcmlnZ2VyZWQgd2hlbiBjbGlja2luZyBvbiAuYWNjb3JkaW9uLWJ1bGstYnV0dG9uXHJcbiAqL1xyXG5BY2NvcmRpb24ucHJvdG90eXBlLmJ1bGtFdmVudCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyICRtb2R1bGUgPSB0aGlzO1xyXG4gIGlmKCEkbW9kdWxlLmFjY29yZGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbicpKXsgIFxyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhY2NvcmRpb24uYCk7XHJcbiAgfVxyXG4gIGlmKCRtb2R1bGUuYnV0dG9ucy5sZW5ndGggPT0gMCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgYWNjb3JkaW9uIGJ1dHRvbnNgKTtcclxuICB9XHJcbiAgICBcclxuICBsZXQgZXhwYW5kID0gdHJ1ZTtcclxuICBpZigkbW9kdWxlLmJ1bGtGdW5jdGlvbkJ1dHRvbi5nZXRBdHRyaWJ1dGUoQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFKSA9PT0gXCJmYWxzZVwiKSB7XHJcbiAgICBleHBhbmQgPSBmYWxzZTtcclxuICB9XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAkbW9kdWxlLmJ1dHRvbnMubGVuZ3RoOyBpKyspe1xyXG4gICAgJG1vZHVsZS50b2dnbGVCdXR0b24oJG1vZHVsZS5idXR0b25zW2ldLCBleHBhbmQsIHRydWUpO1xyXG4gIH1cclxuICBcclxuICAkbW9kdWxlLmJ1bGtGdW5jdGlvbkJ1dHRvbi5zZXRBdHRyaWJ1dGUoQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFLCAhZXhwYW5kKTtcclxuICBpZighZXhwYW5kID09PSB0cnVlKXtcclxuICAgICRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLmlubmVyVGV4dCA9IEJVTEtfRlVOQ1RJT05fT1BFTl9URVhUO1xyXG4gIH0gZWxzZXtcclxuICAgICRtb2R1bGUuYnVsa0Z1bmN0aW9uQnV0dG9uLmlubmVyVGV4dCA9IEJVTEtfRlVOQ1RJT05fQ0xPU0VfVEVYVDtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBY2NvcmRpb24gYnV0dG9uIGV2ZW50IGhhbmRsZXI6IFRvZ2dsZXMgYWNjb3JkaW9uXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9ICRidXR0b24gXHJcbiAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBlIFxyXG4gKi9cclxuQWNjb3JkaW9uLnByb3RvdHlwZS5ldmVudE9uQ2xpY2sgPSBmdW5jdGlvbiAoJGJ1dHRvbiwgZSkge1xyXG4gIHZhciAkbW9kdWxlID0gdGhpcztcclxuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuICAkbW9kdWxlLnRvZ2dsZUJ1dHRvbigkYnV0dG9uKTtcclxuICBpZiAoJGJ1dHRvbi5nZXRBdHRyaWJ1dGUoRVhQQU5ERUQpID09PSAndHJ1ZScpIHtcclxuICAgIC8vIFdlIHdlcmUganVzdCBleHBhbmRlZCwgYnV0IGlmIGFub3RoZXIgYWNjb3JkaW9uIHdhcyBhbHNvIGp1c3RcclxuICAgIC8vIGNvbGxhcHNlZCwgd2UgbWF5IG5vIGxvbmdlciBiZSBpbiB0aGUgdmlld3BvcnQuIFRoaXMgZW5zdXJlc1xyXG4gICAgLy8gdGhhdCB3ZSBhcmUgc3RpbGwgdmlzaWJsZSwgc28gdGhlIHVzZXIgaXNuJ3QgY29uZnVzZWQuXHJcbiAgICBpZiAoIWlzRWxlbWVudEluVmlld3BvcnQoJGJ1dHRvbikpICRidXR0b24uc2Nyb2xsSW50b1ZpZXcoKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUb2dnbGUgYSBidXR0b24ncyBcInByZXNzZWRcIiBzdGF0ZSwgb3B0aW9uYWxseSBwcm92aWRpbmcgYSB0YXJnZXRcclxuICogc3RhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvblxyXG4gKiBAcGFyYW0ge2Jvb2xlYW4/fSBleHBhbmRlZCBJZiBubyBzdGF0ZSBpcyBwcm92aWRlZCwgdGhlIGN1cnJlbnRcclxuICogc3RhdGUgd2lsbCBiZSB0b2dnbGVkIChmcm9tIGZhbHNlIHRvIHRydWUsIGFuZCB2aWNlLXZlcnNhKS5cclxuICogQHJldHVybiB7Ym9vbGVhbn0gdGhlIHJlc3VsdGluZyBzdGF0ZVxyXG4gKi9cclxuIEFjY29yZGlvbi5wcm90b3R5cGUudG9nZ2xlQnV0dG9uID0gZnVuY3Rpb24gKGJ1dHRvbiwgZXhwYW5kZWQsIGJ1bGsgPSBmYWxzZSkge1xyXG4gIGxldCBhY2NvcmRpb24gPSBudWxsO1xyXG4gIGlmKGJ1dHRvbi5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24nKSl7XHJcbiAgICBhY2NvcmRpb24gPSBidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIH0gZWxzZSBpZihidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24nKSl7XHJcbiAgICBhY2NvcmRpb24gPSBidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgfVxyXG4gIGV4cGFuZGVkID0gdG9nZ2xlKGJ1dHRvbiwgZXhwYW5kZWQpO1xyXG4gIGlmKGV4cGFuZGVkKXsgICAgXHJcbiAgICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuYWNjb3JkaW9uLm9wZW4nKTtcclxuICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbiAgfSBlbHNle1xyXG4gICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5hY2NvcmRpb24uY2xvc2UnKTtcclxuICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gIH1cclxuXHJcbiAgbGV0IG11bHRpc2VsZWN0YWJsZSA9IGZhbHNlO1xyXG4gIGlmKGFjY29yZGlvbiAhPT0gbnVsbCAmJiAoYWNjb3JkaW9uLmdldEF0dHJpYnV0ZShNVUxUSVNFTEVDVEFCTEUpID09PSAndHJ1ZScgfHwgYWNjb3JkaW9uLmNsYXNzTGlzdC5jb250YWlucyhNVUxUSVNFTEVDVEFCTEVfQ0xBU1MpKSl7XHJcbiAgICBtdWx0aXNlbGVjdGFibGUgPSB0cnVlO1xyXG4gICAgbGV0IGJ1bGtGdW5jdGlvbiA9IGFjY29yZGlvbi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgaWYoYnVsa0Z1bmN0aW9uICE9PSBudWxsICYmIGJ1bGtGdW5jdGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbi1idWxrLWJ1dHRvbicpKXtcclxuICAgICAgbGV0IGJ1dHRvbnMgPSBhY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xyXG4gICAgICBpZihidWxrID09PSBmYWxzZSl7XHJcbiAgICAgICAgbGV0IGJ1dHRvbnNPcGVuID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKydbYXJpYS1leHBhbmRlZD1cInRydWVcIl0nKTtcclxuICAgICAgICBsZXQgbmV3U3RhdHVzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYoYnV0dG9ucy5sZW5ndGggPT09IGJ1dHRvbnNPcGVuLmxlbmd0aCl7XHJcbiAgICAgICAgICBuZXdTdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgYnVsa0Z1bmN0aW9uLnNldEF0dHJpYnV0ZShCVUxLX0ZVTkNUSU9OX0FDVElPTl9BVFRSSUJVVEUsIG5ld1N0YXR1cyk7XHJcbiAgICAgICAgaWYobmV3U3RhdHVzID09PSB0cnVlKXtcclxuICAgICAgICAgIGJ1bGtGdW5jdGlvbi5pbm5lclRleHQgPSBCVUxLX0ZVTkNUSU9OX09QRU5fVEVYVDtcclxuICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICBidWxrRnVuY3Rpb24uaW5uZXJUZXh0ID0gQlVMS19GVU5DVElPTl9DTE9TRV9URVhUO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGV4cGFuZGVkICYmICFtdWx0aXNlbGVjdGFibGUpIHtcclxuICAgIGxldCBidXR0b25zID0gWyBidXR0b24gXTtcclxuICAgIGlmKGFjY29yZGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICBidXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBidXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBjdXJyZW50QnV0dHRvbiA9IGJ1dHRvbnNbaV07XHJcbiAgICAgIGlmIChjdXJyZW50QnV0dHRvbiAhPT0gYnV0dG9uICYmIGN1cnJlbnRCdXR0dG9uLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcgPT09IHRydWUpKSB7XHJcbiAgICAgICAgdG9nZ2xlKGN1cnJlbnRCdXR0dG9uLCBmYWxzZSk7XHJcbiAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5hY2NvcmRpb24uY2xvc2UnKTtcclxuICAgICAgICBjdXJyZW50QnV0dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWNjb3JkaW9uOyIsIid1c2Ugc3RyaWN0JztcclxuZnVuY3Rpb24gQWxlcnQoYWxlcnQpe1xyXG4gICAgdGhpcy5hbGVydCA9IGFsZXJ0O1xyXG59XHJcblxyXG5BbGVydC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgY2xvc2UgPSB0aGlzLmFsZXJ0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FsZXJ0LWNsb3NlJyk7XHJcbiAgICBpZihjbG9zZS5sZW5ndGggPT09IDEpe1xyXG4gICAgICAgIGNsb3NlWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG5BbGVydC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmFsZXJ0LmNsYXNzTGlzdC5hZGQoJ2Qtbm9uZScpO1xyXG4gICAgbGV0IGV2ZW50SGlkZSA9IG5ldyBFdmVudCgnZmRzLmFsZXJ0LmhpZGUnKTtcclxuICAgIHRoaXMuYWxlcnQuZGlzcGF0Y2hFdmVudChldmVudEhpZGUpO1xyXG59O1xyXG5cclxuQWxlcnQucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5hbGVydC5jbGFzc0xpc3QucmVtb3ZlKCdkLW5vbmUnKTtcclxuICAgIFxyXG4gICAgbGV0IGV2ZW50U2hvdyA9IG5ldyBFdmVudCgnZmRzLmFsZXJ0LnNob3cnKTtcclxuICAgIHRoaXMuYWxlcnQuZGlzcGF0Y2hFdmVudChldmVudFNob3cpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWxlcnQ7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gQmFja1RvVG9wKGJhY2t0b3RvcCl7XHJcbiAgICB0aGlzLmJhY2t0b3RvcCA9IGJhY2t0b3RvcDtcclxufVxyXG5cclxuQmFja1RvVG9wLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICAgIGxldCBiYWNrdG90b3BidXR0b24gPSB0aGlzLmJhY2t0b3RvcDtcclxuXHJcbiAgICB1cGRhdGVCYWNrVG9Ub3BCdXR0b24oYmFja3RvdG9wYnV0dG9uKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHVwZGF0ZUJhY2tUb1RvcEJ1dHRvbihiYWNrdG90b3BidXR0b24pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUJhY2tUb1RvcEJ1dHRvbihidXR0b24pIHtcclxuICAgIGxldCBsYXN0S25vd25TY3JvbGxQb3NpdGlvbiA9IHdpbmRvdy5zY3JvbGxZO1xyXG4gICAgbGV0IGxhc3RLbm93bldpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcbiAgICBsZXQgc2lkZW5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaWRlbmF2LWxpc3QnKTtcclxuXHJcbiAgICBpZiAoc2lkZW5hdiAmJiBzaWRlbmF2Lm9mZnNldFBhcmVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgIGxldCByZWN0ID0gc2lkZW5hdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBpZiAocmVjdC5ib3R0b20gPCAwICYmIGJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Qtbm9uZScpKSB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdkLW5vbmUnKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50U2hvdyA9IG5ldyBFdmVudCgnZmRzLmJhY2t0b3RvcC5kaXNwbGF5ZWQnKTtcclxuICAgICAgICAgICAgYnV0dG9uLmRpc3BhdGNoRXZlbnQoZXZlbnRTaG93KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocmVjdC5ib3R0b20gPj0gMCAmJiAhYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZC1ub25lJykpIHtcclxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Qtbm9uZScpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRIaWRlID0gbmV3IEV2ZW50KCdmZHMuYmFja3RvdG9wLmhpZGRlbicpO1xyXG4gICAgICAgICAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudEhpZGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCBsaW1pdCA9IGxhc3RLbm93bldpbmRvd0hlaWdodCAqIDI7IC8vIERlZmluZXMgaG93IGZhciB0aGUgdXNlciBtdXN0IHNjcm9sbCBiZWZvcmUgdGhlIGJ1dHRvbiBiZWNvbWVzIHZpc2libGVcclxuICAgICAgICBcclxuICAgICAgICBpZiAobGFzdEtub3duU2Nyb2xsUG9zaXRpb24gPj0gbGltaXQgJiYgYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZC1ub25lJykpIHtcclxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Qtbm9uZScpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnRTaG93ID0gbmV3IEV2ZW50KCdmZHMuYmFja3RvdG9wLmRpc3BsYXllZCcpO1xyXG4gICAgICAgICAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudFNob3cpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChsYXN0S25vd25TY3JvbGxQb3NpdGlvbiA8IGxpbWl0ICYmICFidXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdkLW5vbmUnKSkge1xyXG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnZC1ub25lJyk7XHJcbiAgICAgICAgICAgIGxldCBldmVudEhpZGUgPSBuZXcgRXZlbnQoJ2Zkcy5iYWNrdG90b3AuaGlkZGVuJyk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50SGlkZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJhY2tUb1RvcDsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5jb25zdCBNQVhfTEVOR1RIID0gJ2RhdGEtbWF4bGVuZ3RoJztcclxuY29uc3QgQ0hBUkFDVEVSU19SRU1BSU5JTkdfTUFOWV9URVhUID0gXCJEdSBoYXIgMCB0ZWduIHRpbGJhZ2VcIjtcclxuY29uc3QgQ0hBUkFDVEVSU19SRU1BSU5JTkdfT05FX1RFWFQgPSBcIkR1IGhhciAxIHRlZ24gdGlsYmFnZVwiO1xyXG5jb25zdCBDSEFSQUNURVJTX0VYQ0VFREVEX01BTllfVEVYVCA9IFwiRHUgaGFyIDAgdGVnbiBmb3IgbWVnZXRcIjtcclxuY29uc3QgQ0hBUkFDVEVSU19FWENFRURFRF9PTkVfVEVYVCA9IFwiRHUgaGFyIDEgdGVnbiBmb3IgbWVnZXRcIjtcclxuXHJcbi8qKlxyXG4gKiBOdW1iZXIgb2YgY2hhcmFjdGVycyBsZWZ0XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lckVsZW1lbnQgXHJcbiAqL1xyXG4gZnVuY3Rpb24gQ2hhcmFjdGVyTGltaXQoY29udGFpbmVyRWxlbWVudCkge1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXJFbGVtZW50O1xyXG4gICAgdGhpcy5pbnB1dCA9IGNvbnRhaW5lckVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybS1pbnB1dCcpWzBdO1xyXG4gICAgdGhpcy5tYXhsZW5ndGggPSB0aGlzLmNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoTUFYX0xFTkdUSCk7XHJcbiAgICB0aGlzLmxhc3RLZXlVcFRpbWVzdGFtcCA9IG51bGw7XHJcbiAgICB0aGlzLm9sZFZhbHVlID0gdGhpcy5pbnB1dC52YWx1ZTtcclxufVxyXG5cclxuQ2hhcmFjdGVyTGltaXQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmhhbmRsZUtleVVwLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuaGFuZGxlRm9jdXMuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLmhhbmRsZUJsdXIuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgaWYgKCdvbnBhZ2VzaG93JyBpbiB3aW5kb3cpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGFnZXNob3cnLCB0aGlzLnVwZGF0ZU1lc3NhZ2VzLmJpbmQodGhpcykpO1xyXG4gICAgfSBcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgdGhpcy51cGRhdGVNZXNzYWdlcy5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuQ2hhcmFjdGVyTGltaXQucHJvdG90eXBlLmNoYXJhY3RlcnNMZWZ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGN1cnJlbnRfbGVuZ3RoID0gdGhpcy5pbnB1dC52YWx1ZS5sZW5ndGg7XHJcbiAgICByZXR1cm4gdGhpcy5tYXhsZW5ndGggLSBjdXJyZW50X2xlbmd0aDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hhcmFjdGVyTGltaXRNZXNzYWdlIChjaGFyYWN0ZXJzX2xlZnQpIHtcclxuICAgIGxldCByZWdleCA9IC9cXGQrLztcclxuICAgIGxldCBjb3VudF9tZXNzYWdlID0gXCJcIjtcclxuXHJcbiAgICBpZiAoY2hhcmFjdGVyc19sZWZ0ID09PSAtMSkge1xyXG4gICAgICAgIGxldCBleGNlZWRlZCA9IE1hdGguYWJzKGNoYXJhY3RlcnNfbGVmdCk7XHJcbiAgICAgICAgY291bnRfbWVzc2FnZSA9IENIQVJBQ1RFUlNfRVhDRUVERURfT05FX1RFWFQucmVwbGFjZShyZWdleCwgZXhjZWVkZWQpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoY2hhcmFjdGVyc19sZWZ0ID09PSAxKSB7XHJcbiAgICAgICAgY291bnRfbWVzc2FnZSA9IENIQVJBQ1RFUlNfUkVNQUlOSU5HX09ORV9URVhULnJlcGxhY2UocmVnZXgsIGNoYXJhY3RlcnNfbGVmdCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChjaGFyYWN0ZXJzX2xlZnQgPj0gMCkge1xyXG4gICAgICAgIGNvdW50X21lc3NhZ2UgPSBDSEFSQUNURVJTX1JFTUFJTklOR19NQU5ZX1RFWFQucmVwbGFjZShyZWdleCwgY2hhcmFjdGVyc19sZWZ0KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCBleGNlZWRlZCA9IE1hdGguYWJzKGNoYXJhY3RlcnNfbGVmdCk7XHJcbiAgICAgICAgY291bnRfbWVzc2FnZSA9IENIQVJBQ1RFUlNfRVhDRUVERURfTUFOWV9URVhULnJlcGxhY2UocmVnZXgsIGV4Y2VlZGVkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY291bnRfbWVzc2FnZTtcclxufVxyXG5cclxuQ2hhcmFjdGVyTGltaXQucHJvdG90eXBlLnVwZGF0ZVZpc2libGVNZXNzYWdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGNoYXJhY3RlcnNfbGVmdCA9IHRoaXMuY2hhcmFjdGVyc0xlZnQoKTtcclxuICAgIGxldCBjb3VudF9tZXNzYWdlID0gY2hhcmFjdGVyTGltaXRNZXNzYWdlKGNoYXJhY3RlcnNfbGVmdCk7XHJcbiAgICBsZXQgY2hhcmFjdGVyX2xhYmVsID0gdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2hhcmFjdGVyLWxpbWl0JylbMF07XHJcblxyXG4gICAgaWYgKGNoYXJhY3RlcnNfbGVmdCA8IDApIHtcclxuICAgICAgICBpZiAoIWNoYXJhY3Rlcl9sYWJlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2xpbWl0LWV4Y2VlZGVkJykpIHtcclxuICAgICAgICAgICAgY2hhcmFjdGVyX2xhYmVsLmNsYXNzTGlzdC5hZGQoJ2xpbWl0LWV4Y2VlZGVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5pbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2Zvcm0tbGltaXQtZXJyb3InKSkge1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0LmNsYXNzTGlzdC5hZGQoJ2Zvcm0tbGltaXQtZXJyb3InKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoY2hhcmFjdGVyX2xhYmVsLmNsYXNzTGlzdC5jb250YWlucygnbGltaXQtZXhjZWVkZWQnKSkge1xyXG4gICAgICAgICAgICBjaGFyYWN0ZXJfbGFiZWwuY2xhc3NMaXN0LnJlbW92ZSgnbGltaXQtZXhjZWVkZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmb3JtLWxpbWl0LWVycm9yJykpIHtcclxuICAgICAgICAgICAgdGhpcy5pbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdmb3JtLWxpbWl0LWVycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoYXJhY3Rlcl9sYWJlbC5pbm5lckhUTUwgPSBjb3VudF9tZXNzYWdlO1xyXG59XHJcblxyXG5DaGFyYWN0ZXJMaW1pdC5wcm90b3R5cGUudXBkYXRlU2NyZWVuUmVhZGVyTWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBjaGFyYWN0ZXJzX2xlZnQgPSB0aGlzLmNoYXJhY3RlcnNMZWZ0KCk7XHJcbiAgICBsZXQgY291bnRfbWVzc2FnZSA9IGNoYXJhY3RlckxpbWl0TWVzc2FnZShjaGFyYWN0ZXJzX2xlZnQpO1xyXG4gICAgbGV0IGNoYXJhY3Rlcl9sYWJlbCA9IHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NoYXJhY3Rlci1saW1pdC1zci1vbmx5JylbMF07XHJcbiAgICBjaGFyYWN0ZXJfbGFiZWwuaW5uZXJIVE1MID0gY291bnRfbWVzc2FnZTtcclxufVxyXG5cclxuQ2hhcmFjdGVyTGltaXQucHJvdG90eXBlLnJlc2V0U2NyZWVuUmVhZGVyTWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmlucHV0LnZhbHVlICE9PSBcIlwiKSB7XHJcbiAgICAgICAgbGV0IHNyX21lc3NhZ2UgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjaGFyYWN0ZXItbGltaXQtc3Itb25seScpWzBdO1xyXG4gICAgICAgIHNyX21lc3NhZ2UuaW5uZXJIVE1MID0gJyc7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNoYXJhY3RlckxpbWl0LnByb3RvdHlwZS51cGRhdGVNZXNzYWdlcyA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICB0aGlzLnVwZGF0ZVZpc2libGVNZXNzYWdlKCk7XHJcbiAgICB0aGlzLnVwZGF0ZVNjcmVlblJlYWRlck1lc3NhZ2UoKTtcclxufVxyXG5cclxuQ2hhcmFjdGVyTGltaXQucHJvdG90eXBlLmhhbmRsZUtleVVwID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIHRoaXMudXBkYXRlVmlzaWJsZU1lc3NhZ2UoKTtcclxuICAgIHRoaXMubGFzdEtleVVwVGltZXN0YW1wID0gRGF0ZS5ub3coKTtcclxufVxyXG5cclxuQ2hhcmFjdGVyTGltaXQucHJvdG90eXBlLmhhbmRsZUZvY3VzID0gZnVuY3Rpb24gKGUpIHsgICAgXHJcbiAgICAvLyBSZXNldCB0aGUgc2NyZWVuIHJlYWRlciBtZXNzYWdlIG9uIGZvY3VzIHRvIGZvcmNlIGFuIHVwZGF0ZSBvZiB0aGUgbWVzc2FnZS5cclxuICAgIC8vIFRoaXMgZW5zdXJlcyB0aGF0IGEgc2NyZWVuIHJlYWRlciBpbmZvcm1zIHRoZSB1c2VyIG9mIGhvdyBtYW55IGNoYXJhY3RlcnMgdGhlcmUgaXMgbGVmdFxyXG4gICAgLy8gb24gZm9jdXMgYW5kIG5vdCBqdXN0IHdoYXQgdGhlIGNoYXJhY3RlciBsaW1pdCBpcy5cclxuICAgIHRoaXMucmVzZXRTY3JlZW5SZWFkZXJNZXNzYWdlKCk7XHJcblxyXG4gICAgdGhpcy5pbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIERvbid0IHVwZGF0ZSB0aGUgU2NyZWVuIFJlYWRlciBtZXNzYWdlIHVubGVzcyBpdCdzIGJlZW4gYXdoaWxlXHJcbiAgICAgICAgLy8gc2luY2UgdGhlIGxhc3Qga2V5IHVwIGV2ZW50LiBPdGhlcndpc2UsIHRoZSB1c2VyIHdpbGwgYmUgc3BhbW1lZFxyXG4gICAgICAgIC8vIHdpdGggYXVkaW8gbm90aWZpY2F0aW9ucyB3aGlsZSB0eXBpbmcuXHJcbiAgICAgICAgaWYgKCF0aGlzLmxhc3RLZXlVcFRpbWVzdGFtcCB8fCAoRGF0ZS5ub3coKSAtIDUwMCkgPj0gdGhpcy5sYXN0S2V5VXBUaW1lc3RhbXApIHtcclxuICAgICAgICAgICAgbGV0IHNyX21lc3NhZ2UgPSB0aGlzLmNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjaGFyYWN0ZXItbGltaXQtc3Itb25seScpWzBdLmlubmVySFRNTDtcclxuICAgICAgICAgICAgbGV0IHZpc2libGVfbWVzc2FnZSA9IHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NoYXJhY3Rlci1saW1pdCcpWzBdLmlubmVySFRNTDsgICAgIFxyXG5cclxuICAgICAgICAgICAgLy8gRG9uJ3QgdXBkYXRlIHRoZSBtZXNzYWdlcyB1bmxlc3MgdGhlIHZhbHVlIG9mIHRoZSB0ZXh0YXJlYS90ZXh0IGlucHV0IGhhcyBjaGFuZ2VkIG9yIGlmIHRoZXJlXHJcbiAgICAgICAgICAgIC8vIGlzIGEgbWlzbWF0Y2ggYmV0d2VlbiB0aGUgdmlzaWJsZSBtZXNzYWdlIGFuZCB0aGUgc2NyZWVuIHJlYWRlciBtZXNzYWdlLlxyXG4gICAgICAgICAgICBpZiAodGhpcy5vbGRWYWx1ZSAhPT0gdGhpcy5pbnB1dC52YWx1ZSB8fCBzcl9tZXNzYWdlICE9PSB2aXNpYmxlX21lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub2xkVmFsdWUgPSB0aGlzLmlucHV0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVNZXNzYWdlcygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LmJpbmQodGhpcyksIDEwMDApO1xyXG59XHJcblxyXG5DaGFyYWN0ZXJMaW1pdC5wcm90b3R5cGUuaGFuZGxlQmx1ciA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxJRCk7XHJcbiAgICAvLyBEb24ndCB1cGRhdGUgdGhlIG1lc3NhZ2VzIG9uIGJsdXIgdW5sZXNzIHRoZSB2YWx1ZSBvZiB0aGUgdGV4dGFyZWEvdGV4dCBpbnB1dCBoYXMgY2hhbmdlZFxyXG4gICAgaWYgKHRoaXMub2xkVmFsdWUgIT09IHRoaXMuaW5wdXQudmFsdWUpIHtcclxuICAgICAgICB0aGlzLm9sZFZhbHVlID0gdGhpcy5pbnB1dC52YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1lc3NhZ2VzKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlckxpbWl0OyIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0ICcuLi9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQnO1xyXG5cclxuY29uc3QgVE9HR0xFX1RBUkdFVF9BVFRSSUJVVEUgPSAnZGF0YS1hcmlhLWNvbnRyb2xzJztcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gY2hlY2tib3ggY29sbGFwc2UgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gY2hlY2tib3hFbGVtZW50IFxyXG4gKi9cclxuZnVuY3Rpb24gQ2hlY2tib3hUb2dnbGVDb250ZW50KGNoZWNrYm94RWxlbWVudCl7XHJcbiAgICB0aGlzLmNoZWNrYm94RWxlbWVudCA9IGNoZWNrYm94RWxlbWVudDtcclxuICAgIHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzIG9uIGNoZWNrYm94IHN0YXRlIGNoYW5nZVxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuY2hlY2tib3hFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMudG9nZ2xlLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy50b2dnbGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSBjaGVja2JveCBjb250ZW50XHJcbiAqL1xyXG5DaGVja2JveFRvZ2dsZUNvbnRlbnQucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgJG1vZHVsZSA9IHRoaXM7XHJcbiAgICB2YXIgdGFyZ2V0QXR0ciA9IHRoaXMuY2hlY2tib3hFbGVtZW50LmdldEF0dHJpYnV0ZShUT0dHTEVfVEFSR0VUX0FUVFJJQlVURSlcclxuICAgIHZhciB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIpO1xyXG4gICAgaWYodGFyZ2V0RWwgPT09IG51bGwgfHwgdGFyZ2V0RWwgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBwYW5lbCBlbGVtZW50LiBWZXJpZnkgdmFsdWUgb2YgYXR0cmlidXRlIGArIFRPR0dMRV9UQVJHRVRfQVRUUklCVVRFKTtcclxuICAgIH1cclxuICAgIGlmKHRoaXMuY2hlY2tib3hFbGVtZW50LmNoZWNrZWQpe1xyXG4gICAgICAgICRtb2R1bGUuZXhwYW5kKHRoaXMuY2hlY2tib3hFbGVtZW50LCB0YXJnZXRFbCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICAkbW9kdWxlLmNvbGxhcHNlKHRoaXMuY2hlY2tib3hFbGVtZW50LCB0YXJnZXRFbCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHBhbmQgY29udGVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGNoZWNrYm94RWxlbWVudCBDaGVja2JveCBpbnB1dCBlbGVtZW50IFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50RWxlbWVudCBDb250ZW50IGNvbnRhaW5lciBlbGVtZW50IFxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS5leHBhbmQgPSBmdW5jdGlvbihjaGVja2JveEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KXtcclxuICAgIGlmKGNoZWNrYm94RWxlbWVudCAhPT0gbnVsbCAmJiBjaGVja2JveEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICBjaGVja2JveEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWFyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2UuZXhwYW5kZWQnKTtcclxuICAgICAgICBjaGVja2JveEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ29sbGFwc2UgY29udGVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGNoZWNrYm94RWxlbWVudCBDaGVja2JveCBpbnB1dCBlbGVtZW50IFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50RWxlbWVudCBDb250ZW50IGNvbnRhaW5lciBlbGVtZW50IFxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS5jb2xsYXBzZSA9IGZ1bmN0aW9uKHRyaWdnZXJFbCwgdGFyZ2V0RWwpe1xyXG4gICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2UuY29sbGFwc2VkJyk7XHJcbiAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENoZWNrYm94VG9nZ2xlQ29udGVudDtcclxuIiwiaW1wb3J0IHtrZXltYXB9IGZyb20gJ3JlY2VwdG9yJztcclxuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKFwiLi4vdXRpbHMvYmVoYXZpb3JcIik7XHJcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoXCIuLi91dGlscy9zZWxlY3RcIik7XHJcbmNvbnN0IHsgcHJlZml4OiBQUkVGSVggfSA9IHJlcXVpcmUoXCIuLi9jb25maWdcIik7XHJcbmNvbnN0IHsgQ0xJQ0sgfSA9IHJlcXVpcmUoXCIuLi9ldmVudHNcIik7XHJcbmNvbnN0IGFjdGl2ZUVsZW1lbnQgPSByZXF1aXJlKFwiLi4vdXRpbHMvYWN0aXZlLWVsZW1lbnRcIik7XHJcbmNvbnN0IGlzSW9zRGV2aWNlID0gcmVxdWlyZShcIi4uL3V0aWxzL2lzLWlvcy1kZXZpY2VcIik7XHJcblxyXG5jb25zdCBEQVRFX1BJQ0tFUl9DTEFTUyA9IGBkYXRlLXBpY2tlcmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX1dSQVBQRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX3dyYXBwZXJgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfS0taW5pdGlhbGl6ZWRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU30tLWFjdGl2ZWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19pbnRlcm5hbC1pbnB1dGA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19leHRlcm5hbC1pbnB1dGA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0JVVFRPTl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fYnV0dG9uYDtcclxuY29uc3QgREFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2NhbGVuZGFyYDtcclxuY29uc3QgREFURV9QSUNLRVJfU1RBVFVTX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19zdGF0dXNgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19kYXRlYDtcclxuXHJcbmNvbnN0IENBTEVOREFSX0RBVEVfRk9DVVNFRF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1mb2N1c2VkYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9TRUxFQ1RFRF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1zZWxlY3RlZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUFJFVklPVVNfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcHJldmlvdXMtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tY3VycmVudC1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfTkVYVF9NT05USF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1uZXh0LW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGVgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1RPREFZX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXRvZGF5YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX1NUQVJUX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGUtc3RhcnRgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfRU5EX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGUtZW5kYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9XSVRISU5fUkFOR0VfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0td2l0aGluLXJhbmdlYDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMteWVhcmA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19wcmV2aW91cy1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC15ZWFyYDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9NT05USF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtc2VsZWN0aW9uYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3llYXItc2VsZWN0aW9uYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRF9DTEFTUyA9IGAke0NBTEVOREFSX01PTlRIX0NMQVNTfS0tZm9jdXNlZGA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9LS1zZWxlY3RlZGA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3llYXJgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfS0tZm9jdXNlZGA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNURURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19wcmV2aW91cy15ZWFyLWNodW5rYDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19uZXh0LXllYXItY2h1bmtgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF0ZS1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoLXBpY2tlcmA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfUElDS0VSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyLXBpY2tlcmA7XHJcbmNvbnN0IENBTEVOREFSX1RBQkxFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X190YWJsZWA7XHJcbmNvbnN0IENBTEVOREFSX1JPV19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcm93YDtcclxuY29uc3QgQ0FMRU5EQVJfQ0VMTF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fY2VsbGA7XHJcbmNvbnN0IENBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTID0gYCR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30tLWNlbnRlci1pdGVtc2A7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0xBQkVMX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aC1sYWJlbGA7XHJcbmNvbnN0IENBTEVOREFSX0RBWV9PRl9XRUVLX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19kYXktb2Ytd2Vla2A7XHJcblxyXG5jb25zdCBEQVRFX1BJQ0tFUiA9IGAuJHtEQVRFX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9CVVRUT04gPSBgLiR7REFURV9QSUNLRVJfQlVUVE9OX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUID0gYC4ke0RBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUID0gYC4ke0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0NBTEVOREFSID0gYC4ke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX1NUQVRVUyA9IGAuJHtEQVRFX1BJQ0tFUl9TVEFUVVNfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURSA9IGAuJHtDQUxFTkRBUl9EQVRFX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIID0gYC4ke0NBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEggPSBgLiR7Q0FMRU5EQVJfUFJFVklPVVNfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSID0gYC4ke0NBTEVOREFSX05FWFRfWUVBUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX01PTlRIID0gYC4ke0NBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT04gPSBgLiR7Q0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05fQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OID0gYC4ke0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USCA9IGAuJHtDQUxFTkRBUl9NT05USF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSID0gYC4ke0NBTEVOREFSX1lFQVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyA9IGAuJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9QSUNLRVIgPSBgLiR7Q0FMRU5EQVJfREFURV9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfUElDS0VSID0gYC4ke0NBTEVOREFSX01PTlRIX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1BJQ0tFUiA9IGAuJHtDQUxFTkRBUl9ZRUFSX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9GT0NVU0VEID0gYC4ke0NBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEID0gYC4ke0NBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTU31gO1xyXG5cclxuY29uc3QgVkFMSURBVElPTl9NRVNTQUdFID0gXCJJbmR0YXN0IHZlbmxpZ3N0IGVuIGd5bGRpZyBkYXRvXCI7XHJcblxyXG5jb25zdCBNT05USF9MQUJFTFMgPSBbXHJcbiAgXCJKYW51YXJcIixcclxuICBcIkZlYnJ1YXJcIixcclxuICBcIk1hcnRzXCIsXHJcbiAgXCJBcHJpbFwiLFxyXG4gIFwiTWFqXCIsXHJcbiAgXCJKdW5pXCIsXHJcbiAgXCJKdWxpXCIsXHJcbiAgXCJBdWd1c3RcIixcclxuICBcIlNlcHRlbWJlclwiLFxyXG4gIFwiT2t0b2JlclwiLFxyXG4gIFwiTm92ZW1iZXJcIixcclxuICBcIkRlY2VtYmVyXCIsXHJcbl07XHJcblxyXG5jb25zdCBEQVlfT0ZfV0VFS19MQUJFTFMgPSBbXHJcbiAgXCJNYW5kYWdcIixcclxuICBcIlRpcnNkYWdcIixcclxuICBcIk9uc2RhZ1wiLFxyXG4gIFwiVG9yc2RhZ1wiLFxyXG4gIFwiRnJlZGFnXCIsXHJcbiAgXCJMw7hyZGFnXCIsXHJcbiAgXCJTw7huZGFnXCIsXHJcbl07XHJcblxyXG5jb25zdCBFTlRFUl9LRVlDT0RFID0gMTM7XHJcblxyXG5jb25zdCBZRUFSX0NIVU5LID0gMTI7XHJcblxyXG5jb25zdCBERUZBVUxUX01JTl9EQVRFID0gXCIwMDAwLTAxLTAxXCI7XHJcbmNvbnN0IERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQgPSBcIkREL01NL1lZWVlcIjtcclxuY29uc3QgSU5URVJOQUxfREFURV9GT1JNQVQgPSBcIllZWVktTU0tRERcIjtcclxuXHJcbmNvbnN0IE5PVF9ESVNBQkxFRF9TRUxFQ1RPUiA9IFwiOm5vdChbZGlzYWJsZWRdKVwiO1xyXG5cclxuY29uc3QgcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyA9ICguLi5zZWxlY3RvcnMpID0+XHJcbiAgc2VsZWN0b3JzLm1hcCgocXVlcnkpID0+IHF1ZXJ5ICsgTk9UX0RJU0FCTEVEX1NFTEVDVE9SKS5qb2luKFwiLCBcIik7XHJcblxyXG5jb25zdCBEQVRFX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxyXG4gIENBTEVOREFSX1BSRVZJT1VTX1lFQVIsXHJcbiAgQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEgsXHJcbiAgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT04sXHJcbiAgQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OLFxyXG4gIENBTEVOREFSX05FWFRfWUVBUixcclxuICBDQUxFTkRBUl9ORVhUX01PTlRILFxyXG4gIENBTEVOREFSX0RBVEVfRk9DVVNFRFxyXG4pO1xyXG5cclxuY29uc3QgTU9OVEhfUElDS0VSX0ZPQ1VTQUJMRSA9IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMoXHJcbiAgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRFxyXG4pO1xyXG5cclxuY29uc3QgWUVBUl9QSUNLRVJfRk9DVVNBQkxFID0gcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyhcclxuICBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LLFxyXG4gIENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyxcclxuICBDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURcclxuKTtcclxuXHJcbi8vICNyZWdpb24gRGF0ZSBNYW5pcHVsYXRpb24gRnVuY3Rpb25zXHJcblxyXG4vKipcclxuICogS2VlcCBkYXRlIHdpdGhpbiBtb250aC4gTW9udGggd291bGQgb25seSBiZSBvdmVyIGJ5IDEgdG8gMyBkYXlzXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZVRvQ2hlY2sgdGhlIGRhdGUgb2JqZWN0IHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCB0aGUgY29ycmVjdCBtb250aFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGRhdGUsIGNvcnJlY3RlZCBpZiBuZWVkZWRcclxuICovXHJcbmNvbnN0IGtlZXBEYXRlV2l0aGluTW9udGggPSAoZGF0ZVRvQ2hlY2ssIG1vbnRoKSA9PiB7XHJcbiAgaWYgKG1vbnRoICE9PSBkYXRlVG9DaGVjay5nZXRNb250aCgpKSB7XHJcbiAgICBkYXRlVG9DaGVjay5zZXREYXRlKDApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGVUb0NoZWNrO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIGZyb20gbW9udGggZGF5IHllYXJcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHllYXIgdGhlIHllYXIgdG8gc2V0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCB0aGUgbW9udGggdG8gc2V0ICh6ZXJvLWluZGV4ZWQpXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIHNldFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIHNldCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXREYXRlID0gKHllYXIsIG1vbnRoLCBkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoeWVhciwgbW9udGgsIGRhdGUpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHRvZGF5cyBkYXRlXHJcbiAqXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0b2RheXMgZGF0ZVxyXG4gKi9cclxuY29uc3QgdG9kYXkgPSAoKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgY29uc3QgZGF5ID0gbmV3RGF0ZS5nZXREYXRlKCk7XHJcbiAgY29uc3QgbW9udGggPSBuZXdEYXRlLmdldE1vbnRoKCk7XHJcbiAgY29uc3QgeWVhciA9IG5ld0RhdGUuZ2V0RnVsbFllYXIoKTtcclxuICByZXR1cm4gc2V0RGF0ZSh5ZWFyLCBtb250aCwgZGF5KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byBmaXJzdCBkYXkgb2YgdGhlIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN0YXJ0T2ZNb250aCA9IChkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIDEpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIGxhc3QgZGF5IG9mIHRoZSBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBsYXN0RGF5T2ZNb250aCA9IChkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCkgKyAxLCAwKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgZGF5cyB0byBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1EYXlzIHRoZSBkaWZmZXJlbmNlIGluIGRheXNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGREYXlzID0gKF9kYXRlLCBudW1EYXlzKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcbiAgbmV3RGF0ZS5zZXREYXRlKG5ld0RhdGUuZ2V0RGF0ZSgpICsgbnVtRGF5cyk7XHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU3VidHJhY3QgZGF5cyBmcm9tIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bURheXMgdGhlIGRpZmZlcmVuY2UgaW4gZGF5c1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1YkRheXMgPSAoX2RhdGUsIG51bURheXMpID0+IGFkZERheXMoX2RhdGUsIC1udW1EYXlzKTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgd2Vla3MgdG8gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGRXZWVrcyA9IChfZGF0ZSwgbnVtV2Vla3MpID0+IGFkZERheXMoX2RhdGUsIG51bVdlZWtzICogNyk7XHJcblxyXG4vKipcclxuICogU3VidHJhY3Qgd2Vla3MgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1XZWVrcyB0aGUgZGlmZmVyZW5jZSBpbiB3ZWVrc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1YldlZWtzID0gKF9kYXRlLCBudW1XZWVrcykgPT4gYWRkV2Vla3MoX2RhdGUsIC1udW1XZWVrcyk7XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSB3ZWVrIChNb25kYXkpXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3RhcnRPZldlZWsgPSAoX2RhdGUpID0+IHtcclxuICBsZXQgZGF5T2ZXZWVrID0gX2RhdGUuZ2V0RGF5KCktMTtcclxuICBpZihkYXlPZldlZWsgPT09IC0xKXtcclxuICAgIGRheU9mV2VlayA9IDY7XHJcbiAgfVxyXG4gIHJldHVybiBzdWJEYXlzKF9kYXRlLCBkYXlPZldlZWspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHdlZWsgKFN1bmRheSlcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVdlZWtzIHRoZSBkaWZmZXJlbmNlIGluIHdlZWtzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgZW5kT2ZXZWVrID0gKF9kYXRlKSA9PiB7XHJcbiAgY29uc3QgZGF5T2ZXZWVrID0gX2RhdGUuZ2V0RGF5KCk7XHJcbiAgcmV0dXJuIGFkZERheXMoX2RhdGUsIDcgLSBkYXlPZldlZWspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBtb250aHMgdG8gZGF0ZSBhbmQga2VlcCBkYXRlIHdpdGhpbiBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtTW9udGhzIHRoZSBkaWZmZXJlbmNlIGluIG1vbnRoc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkZE1vbnRocyA9IChfZGF0ZSwgbnVtTW9udGhzKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcblxyXG4gIGNvbnN0IGRhdGVNb250aCA9IChuZXdEYXRlLmdldE1vbnRoKCkgKyAxMiArIG51bU1vbnRocykgJSAxMjtcclxuICBuZXdEYXRlLnNldE1vbnRoKG5ld0RhdGUuZ2V0TW9udGgoKSArIG51bU1vbnRocyk7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBkYXRlTW9udGgpO1xyXG5cclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTdWJ0cmFjdCBtb250aHMgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1Nb250aHMgdGhlIGRpZmZlcmVuY2UgaW4gbW9udGhzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3ViTW9udGhzID0gKF9kYXRlLCBudW1Nb250aHMpID0+IGFkZE1vbnRocyhfZGF0ZSwgLW51bU1vbnRocyk7XHJcblxyXG4vKipcclxuICogQWRkIHllYXJzIHRvIGRhdGUgYW5kIGtlZXAgZGF0ZSB3aXRoaW4gbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVllYXJzIHRoZSBkaWZmZXJlbmNlIGluIHllYXJzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkWWVhcnMgPSAoX2RhdGUsIG51bVllYXJzKSA9PiBhZGRNb250aHMoX2RhdGUsIG51bVllYXJzICogMTIpO1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IHllYXJzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtWWVhcnMgdGhlIGRpZmZlcmVuY2UgaW4geWVhcnNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJZZWFycyA9IChfZGF0ZSwgbnVtWWVhcnMpID0+IGFkZFllYXJzKF9kYXRlLCAtbnVtWWVhcnMpO1xyXG5cclxuLyoqXHJcbiAqIFNldCBtb250aHMgb2YgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGggemVyby1pbmRleGVkIG1vbnRoIHRvIHNldFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHNldE1vbnRoID0gKF9kYXRlLCBtb250aCkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG5cclxuICBuZXdEYXRlLnNldE1vbnRoKG1vbnRoKTtcclxuICBrZWVwRGF0ZVdpdGhpbk1vbnRoKG5ld0RhdGUsIG1vbnRoKTtcclxuXHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IHllYXIgb2YgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0geWVhciB0aGUgeWVhciB0byBzZXRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXRZZWFyID0gKF9kYXRlLCB5ZWFyKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoID0gbmV3RGF0ZS5nZXRNb250aCgpO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoeWVhcik7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBtb250aCk7XHJcblxyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0aGUgZWFybGllc3QgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGVhcmxpZXN0IGRhdGVcclxuICovXHJcbmNvbnN0IG1pbiA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICBsZXQgbmV3RGF0ZSA9IGRhdGVBO1xyXG5cclxuICBpZiAoZGF0ZUIgPCBkYXRlQSkge1xyXG4gICAgbmV3RGF0ZSA9IGRhdGVCO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGxhdGVzdCBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgbGF0ZXN0IGRhdGVcclxuICovXHJcbmNvbnN0IG1heCA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICBsZXQgbmV3RGF0ZSA9IGRhdGVBO1xyXG5cclxuICBpZiAoZGF0ZUIgPiBkYXRlQSkge1xyXG4gICAgbmV3RGF0ZSA9IGRhdGVCO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIGluIHRoZSBzYW1lIHllYXJcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyBpbiB0aGUgc2FtZSB5ZWFyXHJcbiAqL1xyXG5jb25zdCBpc1NhbWVZZWFyID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIHJldHVybiBkYXRlQSAmJiBkYXRlQiAmJiBkYXRlQS5nZXRGdWxsWWVhcigpID09PSBkYXRlQi5nZXRGdWxsWWVhcigpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgaW4gdGhlIHNhbWUgbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyBpbiB0aGUgc2FtZSBtb250aFxyXG4gKi9cclxuY29uc3QgaXNTYW1lTW9udGggPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgcmV0dXJuIGlzU2FtZVllYXIoZGF0ZUEsIGRhdGVCKSAmJiBkYXRlQS5nZXRNb250aCgpID09PSBkYXRlQi5nZXRNb250aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgc2FtZSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgdGhlIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIHRoZSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyB0aGUgc2FtZSBkYXRlXHJcbiAqL1xyXG5jb25zdCBpc1NhbWVEYXkgPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgcmV0dXJuIGlzU2FtZU1vbnRoKGRhdGVBLCBkYXRlQikgJiYgZGF0ZUEuZ2V0RGF0ZSgpID09PSBkYXRlQi5nZXREYXRlKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogcmV0dXJuIGEgbmV3IGRhdGUgd2l0aGluIG1pbmltdW0gYW5kIG1heGltdW0gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBkYXRlIGJldHdlZW4gbWluIGFuZCBtYXhcclxuICovXHJcbmNvbnN0IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgbGV0IG5ld0RhdGUgPSBkYXRlO1xyXG5cclxuICBpZiAoZGF0ZSA8IG1pbkRhdGUpIHtcclxuICAgIG5ld0RhdGUgPSBtaW5EYXRlO1xyXG4gIH0gZWxzZSBpZiAobWF4RGF0ZSAmJiBkYXRlID4gbWF4RGF0ZSkge1xyXG4gICAgbmV3RGF0ZSA9IG1heERhdGU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IERhdGUobmV3RGF0ZS5nZXRUaW1lKCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGlzIHZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlcmUgYSBkYXkgd2l0aGluIHRoZSBtb250aCB3aXRoaW4gbWluIGFuZCBtYXggZGF0ZXNcclxuICovXHJcbmNvbnN0IGlzRGF0ZVdpdGhpbk1pbkFuZE1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PlxyXG4gIGRhdGUgPj0gbWluRGF0ZSAmJiAoIW1heERhdGUgfHwgZGF0ZSA8PSBtYXhEYXRlKTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBtb250aCBpcyBpbnZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlIG1vbnRoIG91dHNpZGUgbWluIG9yIG1heCBkYXRlc1xyXG4gKi9cclxuY29uc3QgaXNEYXRlc01vbnRoT3V0c2lkZU1pbk9yTWF4ID0gKGRhdGUsIG1pbkRhdGUsIG1heERhdGUpID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgbGFzdERheU9mTW9udGgoZGF0ZSkgPCBtaW5EYXRlIHx8IChtYXhEYXRlICYmIHN0YXJ0T2ZNb250aChkYXRlKSA+IG1heERhdGUpXHJcbiAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyB5ZWFyIGlzIGludmFsaWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBkYXRlIHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWluRGF0ZSBtaW5pbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcmV0dXJuIHtib29sZWFufSBpcyB0aGUgbW9udGggb3V0c2lkZSBtaW4gb3IgbWF4IGRhdGVzXHJcbiAqL1xyXG5jb25zdCBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIGxhc3REYXlPZk1vbnRoKHNldE1vbnRoKGRhdGUsIDExKSkgPCBtaW5EYXRlIHx8XHJcbiAgICAobWF4RGF0ZSAmJiBzdGFydE9mTW9udGgoc2V0TW9udGgoZGF0ZSwgMCkpID4gbWF4RGF0ZSlcclxuICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBhcnNlIGEgZGF0ZSB3aXRoIGZvcm1hdCBELU0tWVlcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVTdHJpbmcgdGhlIGRhdGUgc3RyaW5nIHRvIHBhcnNlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlRm9ybWF0IHRoZSBmb3JtYXQgb2YgdGhlIGRhdGUgc3RyaW5nXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWRqdXN0RGF0ZSBzaG91bGQgdGhlIGRhdGUgYmUgYWRqdXN0ZWRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBwYXJzZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgcGFyc2VEYXRlU3RyaW5nID0gKFxyXG4gIGRhdGVTdHJpbmcsXHJcbiAgZGF0ZUZvcm1hdCA9IElOVEVSTkFMX0RBVEVfRk9STUFULFxyXG4gIGFkanVzdERhdGUgPSBmYWxzZVxyXG4pID0+IHtcclxuICBsZXQgZGF0ZTtcclxuICBsZXQgbW9udGg7XHJcbiAgbGV0IGRheTtcclxuICBsZXQgeWVhcjtcclxuICBsZXQgcGFyc2VkO1xyXG5cclxuICBpZiAoZGF0ZVN0cmluZykge1xyXG4gICAgbGV0IG1vbnRoU3RyLCBkYXlTdHIsIHllYXJTdHI7XHJcbiAgICBpZiAoZGF0ZUZvcm1hdCA9PT0gREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCkge1xyXG4gICAgICBbZGF5U3RyLCBtb250aFN0ciwgeWVhclN0cl0gPSBkYXRlU3RyaW5nLnNwbGl0KFwiL1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIFt5ZWFyU3RyLCBtb250aFN0ciwgZGF5U3RyXSA9IGRhdGVTdHJpbmcuc3BsaXQoXCItXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh5ZWFyU3RyKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KHllYXJTdHIsIDEwKTtcclxuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xyXG4gICAgICAgIHllYXIgPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIHllYXIgPSBNYXRoLm1heCgwLCB5ZWFyKTtcclxuICAgICAgICAgIGlmICh5ZWFyU3RyLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFllYXIgPSB0b2RheSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyU3R1YiA9XHJcbiAgICAgICAgICAgICAgY3VycmVudFllYXIgLSAoY3VycmVudFllYXIgJSAxMCAqKiB5ZWFyU3RyLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHllYXIgPSBjdXJyZW50WWVhclN0dWIgKyBwYXJzZWQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vbnRoU3RyKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KG1vbnRoU3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICBtb250aCA9IHBhcnNlZDtcclxuICAgICAgICBpZiAoYWRqdXN0RGF0ZSkge1xyXG4gICAgICAgICAgbW9udGggPSBNYXRoLm1heCgxLCBtb250aCk7XHJcbiAgICAgICAgICBtb250aCA9IE1hdGgubWluKDEyLCBtb250aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vbnRoICYmIGRheVN0ciAmJiB5ZWFyICE9IG51bGwpIHtcclxuICAgICAgcGFyc2VkID0gcGFyc2VJbnQoZGF5U3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICBkYXkgPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIGNvbnN0IGxhc3REYXlPZlRoZU1vbnRoID0gc2V0RGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgZGF5ID0gTWF0aC5tYXgoMSwgZGF5KTtcclxuICAgICAgICAgIGRheSA9IE1hdGgubWluKGxhc3REYXlPZlRoZU1vbnRoLCBkYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb250aCAmJiBkYXkgJiYgeWVhciAhPSBudWxsKSB7XHJcbiAgICAgIGRhdGUgPSBzZXREYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZvcm1hdCBhIGRhdGUgdG8gZm9ybWF0IE1NLURELVlZWVlcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIHRoZSBkYXRlIHRvIGZvcm1hdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZUZvcm1hdCB0aGUgZm9ybWF0IG9mIHRoZSBkYXRlIHN0cmluZ1xyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZm9ybWF0dGVkIGRhdGUgc3RyaW5nXHJcbiAqL1xyXG5jb25zdCBmb3JtYXREYXRlID0gKGRhdGUsIGRhdGVGb3JtYXQgPSBJTlRFUk5BTF9EQVRFX0ZPUk1BVCkgPT4ge1xyXG4gIGNvbnN0IHBhZFplcm9zID0gKHZhbHVlLCBsZW5ndGgpID0+IHtcclxuICAgIHJldHVybiBgMDAwMCR7dmFsdWV9YC5zbGljZSgtbGVuZ3RoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XHJcbiAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuXHJcbiAgaWYgKGRhdGVGb3JtYXQgPT09IERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQpIHtcclxuICAgIHJldHVybiBbcGFkWmVyb3MoZGF5LCAyKSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyh5ZWFyLCA0KV0uam9pbihcIi9cIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gW3BhZFplcm9zKHllYXIsIDQpLCBwYWRaZXJvcyhtb250aCwgMiksIHBhZFplcm9zKGRheSwgMildLmpvaW4oXCItXCIpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBEYXRlIE1hbmlwdWxhdGlvbiBGdW5jdGlvbnNcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBncmlkIHN0cmluZyBmcm9tIGFuIGFycmF5IG9mIGh0bWwgc3RyaW5nc1xyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBodG1sQXJyYXkgdGhlIGFycmF5IG9mIGh0bWwgaXRlbXNcclxuICogQHBhcmFtIHtudW1iZXJ9IHJvd1NpemUgdGhlIGxlbmd0aCBvZiBhIHJvd1xyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZ3JpZCBzdHJpbmdcclxuICovXHJcbmNvbnN0IGxpc3RUb0dyaWRIdG1sID0gKGh0bWxBcnJheSwgcm93U2l6ZSkgPT4ge1xyXG4gIGNvbnN0IGdyaWQgPSBbXTtcclxuICBsZXQgcm93ID0gW107XHJcblxyXG4gIGxldCBpID0gMDtcclxuICB3aGlsZSAoaSA8IGh0bWxBcnJheS5sZW5ndGgpIHtcclxuICAgIHJvdyA9IFtdO1xyXG4gICAgd2hpbGUgKGkgPCBodG1sQXJyYXkubGVuZ3RoICYmIHJvdy5sZW5ndGggPCByb3dTaXplKSB7XHJcbiAgICAgIHJvdy5wdXNoKGA8dGQ+JHtodG1sQXJyYXlbaV19PC90ZD5gKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgZ3JpZC5wdXNoKGA8dHI+JHtyb3cuam9pbihcIlwiKX08L3RyPmApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGdyaWQuam9pbihcIlwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBzZXQgdGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50IGFuZCBkaXNwYXRjaCBhIGNoYW5nZSBldmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGVsIFRoZSBlbGVtZW50IHRvIHVwZGF0ZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgY2hhbmdlRWxlbWVudFZhbHVlID0gKGVsLCB2YWx1ZSA9IFwiXCIpID0+IHtcclxuICBjb25zdCBlbGVtZW50VG9DaGFuZ2UgPSBlbDtcclxuICBlbGVtZW50VG9DaGFuZ2UudmFsdWUgPSB2YWx1ZTtcclxuXHJcblxyXG4gIHZhciBldmVudCA9IG5ldyBFdmVudCgnY2hhbmdlJyk7XHJcbiAgZWxlbWVudFRvQ2hhbmdlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBwcm9wZXJ0aWVzIGFuZCBlbGVtZW50cyB3aXRoaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBEYXRlUGlja2VyQ29udGV4dFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBjYWxlbmRhckVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGRhdGVQaWNrZXJFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGludGVybmFsSW5wdXRFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGV4dGVybmFsSW5wdXRFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBzdGF0dXNFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBmaXJzdFllYXJDaHVua0VsXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gY2FsZW5kYXJEYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gbWluRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IG1heERhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBzZWxlY3RlZERhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSByYW5nZURhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBkZWZhdWx0RGF0ZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBHZXQgYW4gb2JqZWN0IG9mIHRoZSBwcm9wZXJ0aWVzIGFuZCBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXHJcbiAqIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGhlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlclxyXG4gKiBAcmV0dXJucyB7RGF0ZVBpY2tlckNvbnRleHR9IGVsZW1lbnRzXHJcbiAqL1xyXG5jb25zdCBnZXREYXRlUGlja2VyQ29udGV4dCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IGRhdGVQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoREFURV9QSUNLRVIpO1xyXG5cclxuICBpZiAoIWRhdGVQaWNrZXJFbCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGlzIG1pc3Npbmcgb3V0ZXIgJHtEQVRFX1BJQ0tFUn1gKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGludGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRcclxuICApO1xyXG4gIGNvbnN0IGV4dGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRcclxuICApO1xyXG4gIGNvbnN0IGNhbGVuZGFyRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9DQUxFTkRBUik7XHJcbiAgY29uc3QgdG9nZ2xlQnRuRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9CVVRUT04pO1xyXG4gIGNvbnN0IHN0YXR1c0VsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoREFURV9QSUNLRVJfU1RBVFVTKTtcclxuICBjb25zdCBmaXJzdFllYXJDaHVua0VsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUik7XHJcblxyXG4gIGNvbnN0IGlucHV0RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhcclxuICAgIGV4dGVybmFsSW5wdXRFbC52YWx1ZSxcclxuICAgIERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQsXHJcbiAgICB0cnVlXHJcbiAgKTtcclxuICBjb25zdCBzZWxlY3RlZERhdGUgPSBwYXJzZURhdGVTdHJpbmcoaW50ZXJuYWxJbnB1dEVsLnZhbHVlKTtcclxuXHJcbiAgY29uc3QgY2FsZW5kYXJEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGNhbGVuZGFyRWwuZGF0YXNldC52YWx1ZSk7XHJcbiAgY29uc3QgbWluRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlKTtcclxuICBjb25zdCBtYXhEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGUpO1xyXG4gIGNvbnN0IHJhbmdlRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5yYW5nZURhdGUpO1xyXG4gIGNvbnN0IGRlZmF1bHREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRlZmF1bHREYXRlKTtcclxuXHJcbiAgaWYgKG1pbkRhdGUgJiYgbWF4RGF0ZSAmJiBtaW5EYXRlID4gbWF4RGF0ZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTWluaW11bSBkYXRlIGNhbm5vdCBiZSBhZnRlciBtYXhpbXVtIGRhdGVcIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgY2FsZW5kYXJEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIHRvZ2dsZUJ0bkVsLFxyXG4gICAgc2VsZWN0ZWREYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIGZpcnN0WWVhckNodW5rRWwsXHJcbiAgICBkYXRlUGlja2VyRWwsXHJcbiAgICBpbnB1dERhdGUsXHJcbiAgICBpbnRlcm5hbElucHV0RWwsXHJcbiAgICBleHRlcm5hbElucHV0RWwsXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgcmFuZ2VEYXRlLFxyXG4gICAgZGVmYXVsdERhdGUsXHJcbiAgICBzdGF0dXNFbCxcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERpc2FibGUgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNhYmxlID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIHRvZ2dsZUJ0bkVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIHRvZ2dsZUJ0bkVsLmRpc2FibGVkID0gdHJ1ZTtcclxuICBleHRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVuYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGVuYWJsZSA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCB0b2dnbGVCdG5FbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICB0b2dnbGVCdG5FbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG59O1xyXG5cclxuLy8gI3JlZ2lvbiBWYWxpZGF0aW9uXHJcblxyXG4vKipcclxuICogVmFsaWRhdGUgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGRhdGUgb2YgZm9ybWF0IEQvTS9ZWVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGlzRGF0ZUlucHV0SW52YWxpZCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGNvbnN0IGRhdGVTdHJpbmcgPSBleHRlcm5hbElucHV0RWwudmFsdWU7XHJcbiAgbGV0IGlzSW52YWxpZCA9IGZhbHNlO1xyXG5cclxuICBpZiAoZGF0ZVN0cmluZykge1xyXG4gICAgaXNJbnZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBkYXRlU3RyaW5nUGFydHMgPSBkYXRlU3RyaW5nLnNwbGl0KFwiL1wiKTtcclxuICAgIGNvbnN0IFtkYXksIG1vbnRoLCB5ZWFyXSA9IGRhdGVTdHJpbmdQYXJ0cy5tYXAoKHN0cikgPT4ge1xyXG4gICAgICBsZXQgdmFsdWU7XHJcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB2YWx1ZSA9IHBhcnNlZDtcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG1vbnRoICYmIGRheSAmJiB5ZWFyICE9IG51bGwpIHtcclxuICAgICAgY29uc3QgY2hlY2tEYXRlID0gc2V0RGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgY2hlY2tEYXRlLmdldE1vbnRoKCkgPT09IG1vbnRoIC0gMSAmJlxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXREYXRlKCkgPT09IGRheSAmJlxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXRGdWxsWWVhcigpID09PSB5ZWFyICYmXHJcbiAgICAgICAgZGF0ZVN0cmluZ1BhcnRzWzJdLmxlbmd0aCA9PT0gNCAmJlxyXG4gICAgICAgIGlzRGF0ZVdpdGhpbk1pbkFuZE1heChjaGVja0RhdGUsIG1pbkRhdGUsIG1heERhdGUpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGlzSW52YWxpZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaXNJbnZhbGlkO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFZhbGlkYXRlIHRoZSB2YWx1ZSBpbiB0aGUgaW5wdXQgYXMgYSB2YWxpZCBkYXRlIG9mIGZvcm1hdCBNL0QvWVlZWVxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCB2YWxpZGF0ZURhdGVJbnB1dCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgY29uc3QgaXNJbnZhbGlkID0gaXNEYXRlSW5wdXRJbnZhbGlkKGV4dGVybmFsSW5wdXRFbCk7XHJcblxyXG4gIGlmIChpc0ludmFsaWQgJiYgIWV4dGVybmFsSW5wdXRFbC52YWxpZGF0aW9uTWVzc2FnZSkge1xyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFZBTElEQVRJT05fTUVTU0FHRSk7XHJcbiAgfVxyXG5cclxuICBpZiAoIWlzSW52YWxpZCAmJiBleHRlcm5hbElucHV0RWwudmFsaWRhdGlvbk1lc3NhZ2UgPT09IFZBTElEQVRJT05fTUVTU0FHRSkge1xyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFwiXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gVmFsaWRhdGlvblxyXG5cclxuLyoqXHJcbiAqIEVuYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHJlY29uY2lsZUlucHV0VmFsdWVzID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBpbnRlcm5hbElucHV0RWwsIGlucHV0RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGxldCBuZXdWYWx1ZSA9IFwiXCI7XHJcblxyXG4gIGlmIChpbnB1dERhdGUgJiYgIWlzRGF0ZUlucHV0SW52YWxpZChlbCkpIHtcclxuICAgIG5ld1ZhbHVlID0gZm9ybWF0RGF0ZShpbnB1dERhdGUpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGludGVybmFsSW5wdXRFbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShpbnRlcm5hbElucHV0RWwsIG5ld1ZhbHVlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IHRoZSB2YWx1ZSBvZiB0aGUgZGF0ZSBwaWNrZXIgaW5wdXRzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlU3RyaW5nIFRoZSBkYXRlIHN0cmluZyB0byB1cGRhdGUgaW4gWVlZWS1NTS1ERCBmb3JtYXRcclxuICovXHJcbmNvbnN0IHNldENhbGVuZGFyVmFsdWUgPSAoZWwsIGRhdGVTdHJpbmcpID0+IHtcclxuICBjb25zdCBwYXJzZWREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVTdHJpbmcpO1xyXG5cclxuICBpZiAocGFyc2VkRGF0ZSkge1xyXG4gICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUocGFyc2VkRGF0ZSwgREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCk7XHJcblxyXG4gICAgY29uc3Qge1xyXG4gICAgICBkYXRlUGlja2VyRWwsXHJcbiAgICAgIGludGVybmFsSW5wdXRFbCxcclxuICAgICAgZXh0ZXJuYWxJbnB1dEVsLFxyXG4gICAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoaW50ZXJuYWxJbnB1dEVsLCBkYXRlU3RyaW5nKTtcclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShleHRlcm5hbElucHV0RWwsIGZvcm1hdHRlZERhdGUpO1xyXG5cclxuICAgIHZhbGlkYXRlRGF0ZUlucHV0KGRhdGVQaWNrZXJFbCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVuaGFuY2UgYW4gaW5wdXQgd2l0aCB0aGUgZGF0ZSBwaWNrZXIgZWxlbWVudHNcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgVGhlIGluaXRpYWwgd3JhcHBpbmcgZWxlbWVudCBvZiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBlbmhhbmNlRGF0ZVBpY2tlciA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IGRhdGVQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoREFURV9QSUNLRVIpO1xyXG4gIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRlZmF1bHRWYWx1ZTtcclxuXHJcbiAgY29uc3QgaW50ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoYGlucHV0YCk7XHJcblxyXG4gIGlmICghaW50ZXJuYWxJbnB1dEVsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7REFURV9QSUNLRVJ9IGlzIG1pc3NpbmcgaW5uZXIgaW5wdXRgKTtcclxuICB9XHJcblxyXG5cclxuICBjb25zdCBtaW5EYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxyXG4gICAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSB8fCBpbnRlcm5hbElucHV0RWwuZ2V0QXR0cmlidXRlKFwibWluXCIpXHJcbiAgKTtcclxuICBkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlID0gbWluRGF0ZVxyXG4gICAgPyBmb3JtYXREYXRlKG1pbkRhdGUpXHJcbiAgICA6IERFRkFVTFRfTUlOX0RBVEU7XHJcblxyXG4gIGNvbnN0IG1heERhdGUgPSBwYXJzZURhdGVTdHJpbmcoXHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlIHx8IGludGVybmFsSW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtYXhcIilcclxuICApO1xyXG4gIGlmIChtYXhEYXRlKSB7XHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlID0gZm9ybWF0RGF0ZShtYXhEYXRlKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfV1JBUFBFUl9DTEFTUyk7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLnRhYkluZGV4ID0gXCItMVwiO1xyXG5cclxuICBjb25zdCBleHRlcm5hbElucHV0RWwgPSBpbnRlcm5hbElucHV0RWwuY2xvbmVOb2RlKCk7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRfQ0xBU1MpO1xyXG4gIGV4dGVybmFsSW5wdXRFbC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLm5hbWUgPSBcIlwiO1xyXG5cclxuICBjYWxlbmRhcldyYXBwZXIuYXBwZW5kQ2hpbGQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuICBjYWxlbmRhcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFxyXG4gICAgXCJiZWZvcmVlbmRcIixcclxuICAgIFtcclxuICAgICAgYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiJHtEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1N9XCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWxhYmVsPVwiw4VibiBrYWxlbmRlclwiPiZuYnNwOzwvYnV0dG9uPmAsXHJcbiAgICAgIGA8ZGl2IGNsYXNzPVwiJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31cIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBoaWRkZW4+PC9kaXY+YCxcclxuICAgICAgYDxkaXYgY2xhc3M9XCJzci1vbmx5ICR7REFURV9QSUNLRVJfU1RBVFVTX0NMQVNTfVwiIHJvbGU9XCJzdGF0dXNcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIj48L2Rpdj5gLFxyXG4gICAgXS5qb2luKFwiXCIpXHJcbiAgKTtcclxuXHJcbiAgaW50ZXJuYWxJbnB1dEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcclxuICBpbnRlcm5hbElucHV0RWwuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcclxuICBpbnRlcm5hbElucHV0RWwuY2xhc3NMaXN0LmFkZChcclxuICAgIFwic3Itb25seVwiLFxyXG4gICAgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRfQ0xBU1NcclxuICApO1xyXG4gIGludGVybmFsSW5wdXRFbC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgaW50ZXJuYWxJbnB1dEVsLnJlcXVpcmVkID0gZmFsc2U7XHJcblxyXG4gIGRhdGVQaWNrZXJFbC5hcHBlbmRDaGlsZChjYWxlbmRhcldyYXBwZXIpO1xyXG4gIGRhdGVQaWNrZXJFbC5jbGFzc0xpc3QuYWRkKERBVEVfUElDS0VSX0lOSVRJQUxJWkVEX0NMQVNTKTtcclxuXHJcbiAgaWYgKGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgc2V0Q2FsZW5kYXJWYWx1ZShkYXRlUGlja2VyRWwsIGRlZmF1bHRWYWx1ZSk7XHJcbiAgfVxyXG5cclxuICBpZiAoaW50ZXJuYWxJbnB1dEVsLmRpc2FibGVkKSB7XHJcbiAgICBkaXNhYmxlKGRhdGVQaWNrZXJFbCk7XHJcbiAgICBpbnRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSBmYWxzZTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKGV4dGVybmFsSW5wdXRFbC52YWx1ZSkge1xyXG4gICAgdmFsaWRhdGVEYXRlSW5wdXQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIC0gRGF0ZSBTZWxlY3Rpb24gVmlld1xyXG5cclxuLyoqXHJcbiAqIHJlbmRlciB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZVRvRGlzcGxheSBhIGRhdGUgdG8gcmVuZGVyIG9uIHRoZSBjYWxlbmRhclxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgcmVuZGVyQ2FsZW5kYXIgPSAoZWwsIF9kYXRlVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgZGF0ZVBpY2tlckVsLFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgc2VsZWN0ZWREYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICByYW5nZURhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBjb25zdCB0b2RheXNEYXRlID0gdG9kYXkoKTtcclxuICBsZXQgZGF0ZVRvRGlzcGxheSA9IF9kYXRlVG9EaXNwbGF5IHx8IHRvZGF5c0RhdGU7XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyV2FzSGlkZGVuID0gY2FsZW5kYXJFbC5oaWRkZW47XHJcblxyXG4gIGNvbnN0IGZvY3VzZWREYXRlID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAwKTtcclxuICBjb25zdCBmb2N1c2VkTW9udGggPSBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCk7XHJcbiAgY29uc3QgZm9jdXNlZFllYXIgPSBkYXRlVG9EaXNwbGF5LmdldEZ1bGxZZWFyKCk7XHJcblxyXG4gIGNvbnN0IHByZXZNb250aCA9IHN1Yk1vbnRocyhkYXRlVG9EaXNwbGF5LCAxKTtcclxuICBjb25zdCBuZXh0TW9udGggPSBhZGRNb250aHMoZGF0ZVRvRGlzcGxheSwgMSk7XHJcblxyXG4gIGNvbnN0IGN1cnJlbnRGb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShkYXRlVG9EaXNwbGF5KTtcclxuXHJcbiAgY29uc3QgZmlyc3RPZk1vbnRoID0gc3RhcnRPZk1vbnRoKGRhdGVUb0Rpc3BsYXkpO1xyXG4gIGNvbnN0IHByZXZCdXR0b25zRGlzYWJsZWQgPSBpc1NhbWVNb250aChkYXRlVG9EaXNwbGF5LCBtaW5EYXRlKTtcclxuICBjb25zdCBuZXh0QnV0dG9uc0Rpc2FibGVkID0gaXNTYW1lTW9udGgoZGF0ZVRvRGlzcGxheSwgbWF4RGF0ZSk7XHJcblxyXG4gIGNvbnN0IHJhbmdlQ29uY2x1c2lvbkRhdGUgPSBzZWxlY3RlZERhdGUgfHwgZGF0ZVRvRGlzcGxheTtcclxuICBjb25zdCByYW5nZVN0YXJ0RGF0ZSA9IHJhbmdlRGF0ZSAmJiBtaW4ocmFuZ2VDb25jbHVzaW9uRGF0ZSwgcmFuZ2VEYXRlKTtcclxuICBjb25zdCByYW5nZUVuZERhdGUgPSByYW5nZURhdGUgJiYgbWF4KHJhbmdlQ29uY2x1c2lvbkRhdGUsIHJhbmdlRGF0ZSk7XHJcblxyXG4gIGNvbnN0IHdpdGhpblJhbmdlU3RhcnREYXRlID0gcmFuZ2VEYXRlICYmIGFkZERheXMocmFuZ2VTdGFydERhdGUsIDEpO1xyXG4gIGNvbnN0IHdpdGhpblJhbmdlRW5kRGF0ZSA9IHJhbmdlRGF0ZSAmJiBzdWJEYXlzKHJhbmdlRW5kRGF0ZSwgMSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoTGFiZWwgPSBNT05USF9MQUJFTFNbZm9jdXNlZE1vbnRoXTtcclxuXHJcbiAgY29uc3QgZ2VuZXJhdGVEYXRlSHRtbCA9IChkYXRlVG9SZW5kZXIpID0+IHtcclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfREFURV9DTEFTU107XHJcbiAgICBjb25zdCBkYXkgPSBkYXRlVG9SZW5kZXIuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgbW9udGggPSBkYXRlVG9SZW5kZXIuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IHllYXIgPSBkYXRlVG9SZW5kZXIuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IGRheU9mV2VlayA9IGRhdGVUb1JlbmRlci5nZXREYXkoKTtcclxuXHJcbiAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShkYXRlVG9SZW5kZXIpO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gIWlzRGF0ZVdpdGhpbk1pbkFuZE1heChkYXRlVG9SZW5kZXIsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHNlbGVjdGVkRGF0ZSk7XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgcHJldk1vbnRoKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9QUkVWSU9VU19NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVNb250aChkYXRlVG9SZW5kZXIsIG5leHRNb250aCkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfTkVYVF9NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCB0b2RheXNEYXRlKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9UT0RBWV9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJhbmdlRGF0ZSkge1xyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VEYXRlKSkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VTdGFydERhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9TVEFSVF9DTEFTUyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZUVuZERhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9FTkRfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgaXNEYXRlV2l0aGluTWluQW5kTWF4KFxyXG4gICAgICAgICAgZGF0ZVRvUmVuZGVyLFxyXG4gICAgICAgICAgd2l0aGluUmFuZ2VTdGFydERhdGUsXHJcbiAgICAgICAgICB3aXRoaW5SYW5nZUVuZERhdGVcclxuICAgICAgICApXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1dJVEhJTl9SQU5HRV9DTEFTUyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1vbnRoU3RyID0gTU9OVEhfTEFCRUxTW21vbnRoXTtcclxuICAgIGNvbnN0IGRheVN0ciA9IERBWV9PRl9XRUVLX0xBQkVMU1tkYXlPZldlZWtdO1xyXG5cclxuICAgIHJldHVybiBgPGJ1dHRvblxyXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgdGFiaW5kZXg9XCIke3RhYmluZGV4fVwiXHJcbiAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICBkYXRhLWRheT1cIiR7ZGF5fVwiIFxyXG4gICAgICBkYXRhLW1vbnRoPVwiJHttb250aCArIDF9XCIgXHJcbiAgICAgIGRhdGEteWVhcj1cIiR7eWVhcn1cIiBcclxuICAgICAgZGF0YS12YWx1ZT1cIiR7Zm9ybWF0dGVkRGF0ZX1cIlxyXG4gICAgICBhcmlhLWxhYmVsPVwiJHtkYXlTdHJ9IGRlbiAke2RheX0gJHttb250aFN0cn0gJHt5ZWFyfSBcIlxyXG4gICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgPiR7ZGF5fTwvYnV0dG9uPmA7XHJcbiAgfTtcclxuICAvLyBzZXQgZGF0ZSB0byBmaXJzdCByZW5kZXJlZCBkYXlcclxuICBkYXRlVG9EaXNwbGF5ID0gc3RhcnRPZldlZWsoZmlyc3RPZk1vbnRoKTtcclxuXHJcbiAgY29uc3QgZGF5cyA9IFtdO1xyXG5cclxuICB3aGlsZSAoXHJcbiAgICBkYXlzLmxlbmd0aCA8IDI4IHx8XHJcbiAgICBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCkgPT09IGZvY3VzZWRNb250aCB8fFxyXG4gICAgZGF5cy5sZW5ndGggJSA3ICE9PSAwXHJcbiAgKSB7XHJcbiAgICBkYXlzLnB1c2goZ2VuZXJhdGVEYXRlSHRtbChkYXRlVG9EaXNwbGF5KSk7XHJcbiAgICBkYXRlVG9EaXNwbGF5ID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAxKTsgICAgXHJcbiAgfVxyXG4gIGNvbnN0IGRhdGVzSHRtbCA9IGxpc3RUb0dyaWRIdG1sKGRheXMsIDcpO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XHJcbiAgbmV3Q2FsZW5kYXIuZGF0YXNldC52YWx1ZSA9IGN1cnJlbnRGb3JtYXR0ZWREYXRlO1xyXG4gIG5ld0NhbGVuZGFyLnN0eWxlLnRvcCA9IGAke2RhdGVQaWNrZXJFbC5vZmZzZXRIZWlnaHR9cHhgO1xyXG4gIG5ld0NhbGVuZGFyLmhpZGRlbiA9IGZhbHNlO1xyXG4gIGxldCBjb250ZW50ID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTU31cIj5cclxuICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfUk9XX0NMQVNTfVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk5hdmlnw6lyIMOpdCDDpXIgdGlsYmFnZVwiXHJcbiAgICAgICAgICAgICR7cHJldkJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgw6luIG3DpW5lZCB0aWxiYWdlXCJcclxuICAgICAgICAgICAgJHtwcmV2QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfTU9OVEhfTEFCRUxfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHttb250aExhYmVsfS4gVsOmbGcgbcOlbmVkLlwiXHJcbiAgICAgICAgICA+JHttb250aExhYmVsfTwvYnV0dG9uPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHtmb2N1c2VkWWVhcn0uIFbDpmxnIMOlci5cIlxyXG4gICAgICAgICAgPiR7Zm9jdXNlZFllYXJ9PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9NT05USF9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgw6luIG3DpW5lZCBmcmVtXCJcclxuICAgICAgICAgICAgJHtuZXh0QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX05FWFRfWUVBUl9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgw6l0IMOlciBmcmVtXCJcclxuICAgICAgICAgICAgJHtuZXh0QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgPHRyPmA7XHJcbiAgZm9yKGxldCBkIGluIERBWV9PRl9XRUVLX0xBQkVMUyl7XHJcbiAgICBjb250ZW50ICs9IGA8dGggY2xhc3M9XCIke0NBTEVOREFSX0RBWV9PRl9XRUVLX0NMQVNTfVwiIHNjb3BlPVwiY29sXCIgYXJpYS1sYWJlbD1cIiR7REFZX09GX1dFRUtfTEFCRUxTW2RdfVwiPiR7REFZX09GX1dFRUtfTEFCRUxTW2RdLmNoYXJBdCgwKX08L3RoPmA7XHJcbiAgfVxyXG4gIGNvbnRlbnQgKz0gYDwvdHI+XHJcbiAgICAgICAgPC90aGVhZD5cclxuICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAke2RhdGVzSHRtbH1cclxuICAgICAgICA8L3Rib2R5PlxyXG4gICAgICA8L3RhYmxlPlxyXG4gICAgPC9kaXY+YDtcclxuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBjb250ZW50O1xyXG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xyXG5cclxuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmFkZChEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MpO1xyXG5cclxuICBjb25zdCBzdGF0dXNlcyA9IFtdO1xyXG5cclxuICBpZiAoaXNTYW1lRGF5KHNlbGVjdGVkRGF0ZSwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICBzdGF0dXNlcy5wdXNoKFwiU2VsZWN0ZWQgZGF0ZVwiKTtcclxuICB9XHJcblxyXG4gIGlmIChjYWxlbmRhcldhc0hpZGRlbikge1xyXG4gICAgc3RhdHVzZXMucHVzaChcclxuICAgICAgXCJEdSBrYW4gbmF2aWdlcmUgbWVsbGVtIGRhZ2UgdmVkIGF0IGJydWdlIGjDuGpyZSBvZyB2ZW5zdHJlIHBpbHRhc3RlciwgXCIsXHJcbiAgICAgIFwidWdlciB2ZWQgYXQgYnJ1Z2Ugb3Agb2cgbmVkIHBpbHRhc3RlciwgXCIsXHJcbiAgICAgIFwibcOlbmVkZXIgdmVkIHRhIGJydWdlIHBhZ2UgdXAgb2cgcGFnZSBkb3duIHRhc3Rlcm5lIFwiLFxyXG4gICAgICBcIm9nIMOlciB2ZWQgYXQgYXQgdGFzdGUgc2hpZnQgb2cgcGFnZSB1cCBlbGxlciBuZWQuXCIsXHJcbiAgICAgIFwiSG9tZSBvZyBlbmQgdGFzdGVuIG5hdmlnZXJlciB0aWwgc3RhcnQgZWxsZXIgc2x1dG5pbmcgYWYgZW4gdWdlLlwiXHJcbiAgICApO1xyXG4gICAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBcIlwiO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBzdGF0dXNlcy5wdXNoKGAke21vbnRoTGFiZWx9ICR7Zm9jdXNlZFllYXJ9YCk7XHJcbiAgfVxyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gc3RhdHVzZXMuam9pbihcIi4gXCIpO1xyXG5cclxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5UHJldmlvdXNZZWFyID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gc3ViWWVhcnMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfUFJFVklPVVNfWUVBUik7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlQcmV2aW91c01vbnRoID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gc3ViTW9udGhzKGNhbGVuZGFyRGF0ZSwgMSk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX01PTlRIKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU5leHRNb250aCA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IGFkZE1vbnRocyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ORVhUX01PTlRIKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5TmV4dFllYXIgPSAoX2J1dHRvbkVsKSA9PiB7XHJcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIF9idXR0b25FbFxyXG4gICk7XHJcbiAgbGV0IGRhdGUgPSBhZGRZZWFycyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ORVhUX1lFQVIpO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBIaWRlIHRoZSBjYWxlbmRhciBvZiBhIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGlkZUNhbGVuZGFyID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGNhbGVuZGFyRWwsIHN0YXR1c0VsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGRhdGVQaWNrZXJFbC5jbGFzc0xpc3QucmVtb3ZlKERBVEVfUElDS0VSX0FDVElWRV9DTEFTUyk7XHJcbiAgY2FsZW5kYXJFbC5oaWRkZW4gPSB0cnVlO1xyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gXCJcIjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZWxlY3QgYSBkYXRlIHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBjYWxlbmRhckRhdGVFbCBBIGRhdGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3Qgc2VsZWN0RGF0ZSA9IChjYWxlbmRhckRhdGVFbCkgPT4ge1xyXG4gIGlmIChjYWxlbmRhckRhdGVFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCB7IGRhdGVQaWNrZXJFbCwgZXh0ZXJuYWxJbnB1dEVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGNhbGVuZGFyRGF0ZUVsXHJcbiAgKTtcclxuICBzZXRDYWxlbmRhclZhbHVlKGNhbGVuZGFyRGF0ZUVsLCBjYWxlbmRhckRhdGVFbC5kYXRhc2V0LnZhbHVlKTtcclxuICBoaWRlQ2FsZW5kYXIoZGF0ZVBpY2tlckVsKTtcclxuXHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogVG9nZ2xlIHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgdG9nZ2xlQ2FsZW5kYXIgPSAoZWwpID0+IHtcclxuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7XHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgaW5wdXREYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgICBkZWZhdWx0RGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBpZiAoY2FsZW5kYXJFbC5oaWRkZW4pIHtcclxuICAgIGNvbnN0IGRhdGVUb0Rpc3BsYXkgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoXHJcbiAgICAgIGlucHV0RGF0ZSB8fCBkZWZhdWx0RGF0ZSB8fCB0b2RheSgpLFxyXG4gICAgICBtaW5EYXRlLFxyXG4gICAgICBtYXhEYXRlXHJcbiAgICApO1xyXG4gICAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcclxuICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBoaWRlQ2FsZW5kYXIoZWwpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgdGhlIGNhbGVuZGFyIHdoZW4gdmlzaWJsZS5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgYW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyXHJcbiAqL1xyXG5jb25zdCB1cGRhdGVDYWxlbmRhcklmVmlzaWJsZSA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgaW5wdXREYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgY29uc3QgY2FsZW5kYXJTaG93biA9ICFjYWxlbmRhckVsLmhpZGRlbjtcclxuXHJcbiAgaWYgKGNhbGVuZGFyU2hvd24gJiYgaW5wdXREYXRlKSB7XHJcbiAgICBjb25zdCBkYXRlVG9EaXNwbGF5ID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGlucHV0RGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIC0gRGF0ZSBTZWxlY3Rpb24gVmlld1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciAtIE1vbnRoIFNlbGVjdGlvbiBWaWV3XHJcbi8qKlxyXG4gKiBEaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuIGluIHRoZSBkYXRlIHBpY2tlci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU1vbnRoU2VsZWN0aW9uID0gKGVsLCBtb250aFRvRGlzcGxheSkgPT4ge1xyXG4gIGNvbnN0IHtcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBzdGF0dXNFbCxcclxuICAgIGNhbGVuZGFyRGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGNvbnN0IHNlbGVjdGVkTW9udGggPSBjYWxlbmRhckRhdGUuZ2V0TW9udGgoKTtcclxuICBjb25zdCBmb2N1c2VkTW9udGggPSBtb250aFRvRGlzcGxheSA9PSBudWxsID8gc2VsZWN0ZWRNb250aCA6IG1vbnRoVG9EaXNwbGF5O1xyXG5cclxuICBjb25zdCBtb250aHMgPSBNT05USF9MQUJFTFMubWFwKChtb250aCwgaW5kZXgpID0+IHtcclxuICAgIGNvbnN0IG1vbnRoVG9DaGVjayA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgaW5kZXgpO1xyXG5cclxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBpc0RhdGVzTW9udGhPdXRzaWRlTWluT3JNYXgoXHJcbiAgICAgIG1vbnRoVG9DaGVjayxcclxuICAgICAgbWluRGF0ZSxcclxuICAgICAgbWF4RGF0ZVxyXG4gICAgKTtcclxuXHJcbiAgICBsZXQgdGFiaW5kZXggPSBcIi0xXCI7XHJcblxyXG4gICAgY29uc3QgY2xhc3NlcyA9IFtDQUxFTkRBUl9NT05USF9DTEFTU107XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0gaW5kZXggPT09IHNlbGVjdGVkTW9udGg7XHJcblxyXG4gICAgaWYgKGluZGV4ID09PSBmb2N1c2VkTW9udGgpIHtcclxuICAgICAgdGFiaW5kZXggPSBcIjBcIjtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9NT05USF9TRUxFQ1RFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGA8YnV0dG9uIFxyXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgIHRhYmluZGV4PVwiJHt0YWJpbmRleH1cIlxyXG4gICAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICAgIGRhdGEtdmFsdWU9XCIke2luZGV4fVwiXHJcbiAgICAgICAgZGF0YS1sYWJlbD1cIiR7bW9udGh9XCJcclxuICAgICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgID4ke21vbnRofTwvYnV0dG9uPmA7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoc0h0bWwgPSBgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCIke0NBTEVOREFSX01PTlRIX1BJQ0tFUl9DTEFTU31cIj5cclxuICAgIDx0YWJsZSBjbGFzcz1cIiR7Q0FMRU5EQVJfVEFCTEVfQ0xBU1N9XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICA8dGJvZHk+XHJcbiAgICAgICAgJHtsaXN0VG9HcmlkSHRtbChtb250aHMsIDMpfVxyXG4gICAgICA8L3Rib2R5PlxyXG4gICAgPC90YWJsZT5cclxuICA8L2Rpdj5gO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XHJcbiAgbmV3Q2FsZW5kYXIuaW5uZXJIVE1MID0gbW9udGhzSHRtbDtcclxuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcclxuXHJcbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBcIlNlbGVjdCBhIG1vbnRoLlwiO1xyXG5cclxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgbW9udGggaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gbW9udGhFbCBBbiBtb250aCBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBzZWxlY3RNb250aCA9IChtb250aEVsKSA9PiB7XHJcbiAgaWYgKG1vbnRoRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBtb250aEVsXHJcbiAgKTtcclxuICBjb25zdCBzZWxlY3RlZE1vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgbGV0IGRhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIHNlbGVjdGVkTW9udGgpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBNb250aCBTZWxlY3Rpb24gVmlld1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciAtIFllYXIgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8qKlxyXG4gKiBEaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4gaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ZWFyVG9EaXNwbGF5IHllYXIgdG8gZGlzcGxheSBpbiB5ZWFyIHNlbGVjdGlvblxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVllYXJTZWxlY3Rpb24gPSAoZWwsIHllYXJUb0Rpc3BsYXkpID0+IHtcclxuICBjb25zdCB7XHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBjYWxlbmRhckRhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBjYWxlbmRhckRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICBjb25zdCBmb2N1c2VkWWVhciA9IHllYXJUb0Rpc3BsYXkgPT0gbnVsbCA/IHNlbGVjdGVkWWVhciA6IHllYXJUb0Rpc3BsYXk7XHJcblxyXG4gIGxldCB5ZWFyVG9DaHVuayA9IGZvY3VzZWRZZWFyO1xyXG4gIHllYXJUb0NodW5rIC09IHllYXJUb0NodW5rICUgWUVBUl9DSFVOSztcclxuICB5ZWFyVG9DaHVuayA9IE1hdGgubWF4KDAsIHllYXJUb0NodW5rKTtcclxuXHJcbiAgY29uc3QgcHJldlllYXJDaHVua0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgeWVhclRvQ2h1bmsgLSAxKSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgbmV4dFllYXJDaHVua0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICBzZXRZZWFyKGNhbGVuZGFyRGF0ZSwgeWVhclRvQ2h1bmsgKyBZRUFSX0NIVU5LKSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlXHJcbiAgKTtcclxuXHJcbiAgY29uc3QgeWVhcnMgPSBbXTtcclxuICBsZXQgeWVhckluZGV4ID0geWVhclRvQ2h1bms7XHJcbiAgd2hpbGUgKHllYXJzLmxlbmd0aCA8IFlFQVJfQ0hVTkspIHtcclxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heChcclxuICAgICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJJbmRleCksXHJcbiAgICAgIG1pbkRhdGUsXHJcbiAgICAgIG1heERhdGVcclxuICAgICk7XHJcblxyXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xyXG5cclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfWUVBUl9DTEFTU107XHJcbiAgICBjb25zdCBpc1NlbGVjdGVkID0geWVhckluZGV4ID09PSBzZWxlY3RlZFllYXI7XHJcblxyXG4gICAgaWYgKHllYXJJbmRleCA9PT0gZm9jdXNlZFllYXIpIHtcclxuICAgICAgdGFiaW5kZXggPSBcIjBcIjtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX1lFQVJfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIHllYXJzLnB1c2goXHJcbiAgICAgIGA8YnV0dG9uIFxyXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgIHRhYmluZGV4PVwiJHt0YWJpbmRleH1cIlxyXG4gICAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICAgIGRhdGEtdmFsdWU9XCIke3llYXJJbmRleH1cIlxyXG4gICAgICAgIGFyaWEtc2VsZWN0ZWQ9XCIke2lzU2VsZWN0ZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIn1cIlxyXG4gICAgICAgICR7aXNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgPiR7eWVhckluZGV4fTwvYnV0dG9uPmBcclxuICAgICk7XHJcbiAgICB5ZWFySW5kZXggKz0gMTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHllYXJzSHRtbCA9IGxpc3RUb0dyaWRIdG1sKHllYXJzLCAzKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xyXG4gIG5ld0NhbGVuZGFyLmlubmVySFRNTCA9IGA8ZGl2IHRhYmluZGV4PVwiLTFcIiBjbGFzcz1cIiR7Q0FMRU5EQVJfWUVBUl9QSUNLRVJfQ0xBU1N9XCI+XHJcbiAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTfVwiIFxyXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk5hdmlnw6lyICR7WUVBUl9DSFVOS30gw6VyIHRpbGJhZ2VcIlxyXG4gICAgICAgICAgICAgICAgJHtwcmV2WWVhckNodW5rRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjNcIj5cclxuICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgJHt5ZWFyc0h0bWx9XHJcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1N9XCIgXHJcbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgJHtZRUFSX0NIVU5LfSDDpXIgZnJlbVwiXHJcbiAgICAgICAgICAgICAgICAke25leHRZZWFyQ2h1bmtEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgICAgICA+Jm5ic3A7PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICA8L3RyPlxyXG4gICAgICAgIDwvdGJvZHk+XHJcbiAgICAgIDwvdGFibGU+XHJcbiAgICA8L2Rpdj5gO1xyXG4gIGNhbGVuZGFyRWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2FsZW5kYXIsIGNhbGVuZGFyRWwpO1xyXG5cclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IGBTaG93aW5nIHllYXJzICR7eWVhclRvQ2h1bmt9IHRvICR7XHJcbiAgICB5ZWFyVG9DaHVuayArIFlFQVJfQ0hVTksgLSAxXHJcbiAgfS4gU2VsZWN0IGEgeWVhci5gO1xyXG5cclxuICByZXR1cm4gbmV3Q2FsZW5kYXI7XHJcbn07XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBieSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5UHJldmlvdXNZZWFyQ2h1bmsgPSAoZWwpID0+IHtcclxuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgZWxcclxuICApO1xyXG4gIGNvbnN0IHllYXJFbCA9IGNhbGVuZGFyRWwucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpO1xyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC50ZXh0Q29udGVudCwgMTApO1xyXG5cclxuICBsZXQgYWRqdXN0ZWRZZWFyID0gc2VsZWN0ZWRZZWFyIC0gWUVBUl9DSFVOSztcclxuICBhZGp1c3RlZFllYXIgPSBNYXRoLm1heCgwLCBhZGp1c3RlZFllYXIpO1xyXG5cclxuICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XHJcbiAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxyXG4gICk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgYnkgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU5leHRZZWFyQ2h1bmsgPSAoZWwpID0+IHtcclxuICBpZiAoZWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgZWxcclxuICApO1xyXG4gIGNvbnN0IHllYXJFbCA9IGNhbGVuZGFyRWwucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpO1xyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC50ZXh0Q29udGVudCwgMTApO1xyXG5cclxuICBsZXQgYWRqdXN0ZWRZZWFyID0gc2VsZWN0ZWRZZWFyICsgWUVBUl9DSFVOSztcclxuICBhZGp1c3RlZFllYXIgPSBNYXRoLm1heCgwLCBhZGp1c3RlZFllYXIpO1xyXG5cclxuICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XHJcbiAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxyXG4gICk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgeWVhciBpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB5ZWFyRWwgQSB5ZWFyIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHNlbGVjdFllYXIgPSAoeWVhckVsKSA9PiB7XHJcbiAgaWYgKHllYXJFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIHllYXJFbFxyXG4gICk7XHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gcGFyc2VJbnQoeWVhckVsLmlubmVySFRNTCwgMTApO1xyXG4gIGxldCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIHNlbGVjdGVkWWVhcik7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciAtIFllYXIgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8qKlxyXG4gKiBIaWRlIHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRXNjYXBlRnJvbUNhbGVuZGFyID0gKGV2ZW50KSA9PiB7XHJcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGV4dGVybmFsSW5wdXRFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZXZlbnQudGFyZ2V0KTtcclxuXHJcbiAgaGlkZUNhbGVuZGFyKGRhdGVQaWNrZXJFbCk7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmZvY3VzKCk7XHJcblxyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIERhdGUgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8qKlxyXG4gKiBBZGp1c3QgdGhlIGRhdGUgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyIGlmIG5lZWRlZC5cclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWRqdXN0RGF0ZUZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRqdXN0Q2FsZW5kYXIgPSAoYWRqdXN0RGF0ZUZuKSA9PiB7XHJcbiAgcmV0dXJuIChldmVudCkgPT4ge1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICBldmVudC50YXJnZXRcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IGFkanVzdERhdGVGbihjYWxlbmRhckRhdGUpO1xyXG5cclxuICAgIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgICBpZiAoIWlzU2FtZURheShjYWxlbmRhckRhdGUsIGNhcHBlZERhdGUpKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgY2FwcGVkRGF0ZSk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVVcEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1YldlZWtzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZFdlZWtzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBkYXkgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVMZWZ0RnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViRGF5cyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgZGF5IGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUmlnaHRGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGREYXlzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgc3RhcnQgb2YgdGhlIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVIb21lRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3RhcnRPZldlZWsoZGF0ZSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHdlZWsgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVFbmRGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBlbmRPZldlZWsoZGF0ZSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRNb250aHMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUGFnZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViTW9udGhzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlU2hpZnRQYWdlRG93bkZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IGFkZFllYXJzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlU2hpZnRQYWdlVXBGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJZZWFycyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogZGlzcGxheSB0aGUgY2FsZW5kYXIgZm9yIHRoZSBtb3VzZW1vdmUgZGF0ZS5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGRhdGVFbCBBIGRhdGUgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbURhdGUgPSAoZGF0ZUVsKSA9PiB7XHJcbiAgaWYgKGRhdGVFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBjYWxlbmRhckVsID0gZGF0ZUVsLmNsb3Nlc3QoREFURV9QSUNLRVJfQ0FMRU5EQVIpO1xyXG5cclxuICBjb25zdCBjdXJyZW50Q2FsZW5kYXJEYXRlID0gY2FsZW5kYXJFbC5kYXRhc2V0LnZhbHVlO1xyXG4gIGNvbnN0IGhvdmVyRGF0ZSA9IGRhdGVFbC5kYXRhc2V0LnZhbHVlO1xyXG5cclxuICBpZiAoaG92ZXJEYXRlID09PSBjdXJyZW50Q2FsZW5kYXJEYXRlKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGRhdGVUb0Rpc3BsYXkgPSBwYXJzZURhdGVTdHJpbmcoaG92ZXJEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGVUb0Rpc3BsYXkpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBEYXRlIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIE1vbnRoIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbiBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFkanVzdE1vbnRoRm4gZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBhZGp1c3RlZCBtb250aFxyXG4gKi9cclxuY29uc3QgYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4gPSAoYWRqdXN0TW9udGhGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IG1vbnRoRWwgPSBldmVudC50YXJnZXQ7XHJcbiAgICBjb25zdCBzZWxlY3RlZE1vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICAgIG1vbnRoRWxcclxuICAgICk7XHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgc2VsZWN0ZWRNb250aCk7XHJcblxyXG4gICAgbGV0IGFkanVzdGVkTW9udGggPSBhZGp1c3RNb250aEZuKHNlbGVjdGVkTW9udGgpO1xyXG4gICAgYWRqdXN0ZWRNb250aCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDExLCBhZGp1c3RlZE1vbnRoKSk7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IHNldE1vbnRoKGNhbGVuZGFyRGF0ZSwgYWRqdXN0ZWRNb250aCk7XHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVNb250aChjdXJyZW50RGF0ZSwgY2FwcGVkRGF0ZSkpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24oXHJcbiAgICAgICAgY2FsZW5kYXJFbCxcclxuICAgICAgICBjYXBwZWREYXRlLmdldE1vbnRoKClcclxuICAgICAgKTtcclxuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9NT05USF9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgdGhyZWUgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVVcEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggLSAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIHRocmVlIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRG93bkZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggKyAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTGVmdEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKChtb250aCkgPT4gbW9udGggLSAxKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlUmlnaHRGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoICsgMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSByb3cgb2YgbW9udGhzIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVIb21lRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKG1vbnRoKSA9PiBtb250aCAtIChtb250aCAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIGVuZCBvZiB0aGUgcm93IG9mIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKG1vbnRoKSA9PiBtb250aCArIDIgLSAobW9udGggJSAzKVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBsYXN0IG1vbnRoIChEZWNlbWJlcikgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKCkgPT4gMTEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBmaXJzdCBtb250aCAoSmFudWFyeSkgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKCgpID0+IDApO1xyXG5cclxuLyoqXHJcbiAqIHVwZGF0ZSB0aGUgZm9jdXMgb24gYSBtb250aCB3aGVuIHRoZSBtb3VzZSBtb3Zlcy5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IG1vbnRoRWwgQSBtb250aCBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVNb3VzZW1vdmVGcm9tTW9udGggPSAobW9udGhFbCkgPT4ge1xyXG4gIGlmIChtb250aEVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgaWYgKG1vbnRoRWwuY2xhc3NMaXN0LmNvbnRhaW5zKENBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1MpKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IGZvY3VzTW9udGggPSBwYXJzZUludChtb250aEVsLmRhdGFzZXQudmFsdWUsIDEwKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24obW9udGhFbCwgZm9jdXNNb250aCk7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9NT05USF9GT0NVU0VEKS5mb2N1cygpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBNb250aCBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBZZWFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4gaWYgbmVlZGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3RZZWFyRm4gZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBhZGp1c3RlZCB5ZWFyXHJcbiAqL1xyXG5jb25zdCBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuID0gKGFkanVzdFllYXJGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IHllYXJFbCA9IGV2ZW50LnRhcmdldDtcclxuICAgIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICAgIHllYXJFbFxyXG4gICAgKTtcclxuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIHNlbGVjdGVkWWVhcik7XHJcblxyXG4gICAgbGV0IGFkanVzdGVkWWVhciA9IGFkanVzdFllYXJGbihzZWxlY3RlZFllYXIpO1xyXG4gICAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgICBjb25zdCBkYXRlID0gc2V0WWVhcihjYWxlbmRhckRhdGUsIGFkanVzdGVkWWVhcik7XHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVZZWFyKGN1cnJlbnREYXRlLCBjYXBwZWREYXRlKSkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKFxyXG4gICAgICAgIGNhbGVuZGFyRWwsXHJcbiAgICAgICAgY2FwcGVkRGF0ZS5nZXRGdWxsWWVhcigpXHJcbiAgICAgICk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKS5mb2N1cygpO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgdGhyZWUgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgLSAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIHRocmVlIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgKyAzKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUxlZnRGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oKHllYXIpID0+IHllYXIgLSAxKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSB5ZWFyIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyICsgMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSByb3cgb2YgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciAtICh5ZWFyICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZW5kIG9mIHRoZSByb3cgb2YgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxyXG4gICh5ZWFyKSA9PiB5ZWFyICsgMiAtICh5ZWFyICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byBiYWNrIDEyIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciAtIFlFQVJfQ0hVTktcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIDEyIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKFxyXG4gICh5ZWFyKSA9PiB5ZWFyICsgWUVBUl9DSFVOS1xyXG4pO1xyXG5cclxuLyoqXHJcbiAqIHVwZGF0ZSB0aGUgZm9jdXMgb24gYSB5ZWFyIHdoZW4gdGhlIG1vdXNlIG1vdmVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IFRoZSBtb3VzZW1vdmUgZXZlbnRcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZGF0ZUVsIEEgeWVhciBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVNb3VzZW1vdmVGcm9tWWVhciA9ICh5ZWFyRWwpID0+IHtcclxuICBpZiAoeWVhckVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgaWYgKHllYXJFbC5jbGFzc0xpc3QuY29udGFpbnMoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEX0NMQVNTKSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBmb2N1c1llYXIgPSBwYXJzZUludCh5ZWFyRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKHllYXJFbCwgZm9jdXNZZWFyKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgWWVhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBGb2N1cyBIYW5kbGluZyBFdmVudCBIYW5kbGluZ1xyXG5cclxuY29uc3QgdGFiSGFuZGxlciA9IChmb2N1c2FibGUpID0+IHtcclxuICBjb25zdCBnZXRGb2N1c2FibGVDb250ZXh0ID0gKGVsKSA9PiB7XHJcbiAgICBjb25zdCB7IGNhbGVuZGFyRWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gc2VsZWN0KGZvY3VzYWJsZSwgY2FsZW5kYXJFbCk7XHJcblxyXG4gICAgY29uc3QgZmlyc3RUYWJJbmRleCA9IDA7XHJcbiAgICBjb25zdCBsYXN0VGFiSW5kZXggPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xyXG4gICAgY29uc3QgZmlyc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbZmlyc3RUYWJJbmRleF07XHJcbiAgICBjb25zdCBsYXN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2xhc3RUYWJJbmRleF07XHJcbiAgICBjb25zdCBmb2N1c0luZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMuaW5kZXhPZihhY3RpdmVFbGVtZW50KCkpO1xyXG5cclxuICAgIGNvbnN0IGlzTGFzdFRhYiA9IGZvY3VzSW5kZXggPT09IGxhc3RUYWJJbmRleDtcclxuICAgIGNvbnN0IGlzRmlyc3RUYWIgPSBmb2N1c0luZGV4ID09PSBmaXJzdFRhYkluZGV4O1xyXG4gICAgY29uc3QgaXNOb3RGb3VuZCA9IGZvY3VzSW5kZXggPT09IC0xO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZvY3VzYWJsZUVsZW1lbnRzLFxyXG4gICAgICBpc05vdEZvdW5kLFxyXG4gICAgICBmaXJzdFRhYlN0b3AsXHJcbiAgICAgIGlzRmlyc3RUYWIsXHJcbiAgICAgIGxhc3RUYWJTdG9wLFxyXG4gICAgICBpc0xhc3RUYWIsXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0YWJBaGVhZChldmVudCkge1xyXG4gICAgICBjb25zdCB7IGZpcnN0VGFiU3RvcCwgaXNMYXN0VGFiLCBpc05vdEZvdW5kIH0gPSBnZXRGb2N1c2FibGVDb250ZXh0KFxyXG4gICAgICAgIGV2ZW50LnRhcmdldFxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKGlzTGFzdFRhYiB8fCBpc05vdEZvdW5kKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRhYkJhY2soZXZlbnQpIHtcclxuICAgICAgY29uc3QgeyBsYXN0VGFiU3RvcCwgaXNGaXJzdFRhYiwgaXNOb3RGb3VuZCB9ID0gZ2V0Rm9jdXNhYmxlQ29udGV4dChcclxuICAgICAgICBldmVudC50YXJnZXRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChpc0ZpcnN0VGFiIHx8IGlzTm90Rm91bmQpIHtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IGRhdGVQaWNrZXJUYWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKERBVEVfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcbmNvbnN0IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyID0gdGFiSGFuZGxlcihNT05USF9QSUNLRVJfRk9DVVNBQkxFKTtcclxuY29uc3QgeWVhclBpY2tlclRhYkV2ZW50SGFuZGxlciA9IHRhYkhhbmRsZXIoWUVBUl9QSUNLRVJfRk9DVVNBQkxFKTtcclxuXHJcbi8vICNlbmRyZWdpb24gRm9jdXMgSGFuZGxpbmcgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gRGF0ZSBQaWNrZXIgRXZlbnQgRGVsZWdhdGlvbiBSZWdpc3RyYXRpb24gLyBDb21wb25lbnRcclxuXHJcbmNvbnN0IGRhdGVQaWNrZXJFdmVudHMgPSB7XHJcbiAgW0NMSUNLXToge1xyXG4gICAgW0RBVEVfUElDS0VSX0JVVFRPTl0oKSB7XHJcbiAgICAgIHRvZ2dsZUNhbGVuZGFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9EQVRFXSgpIHtcclxuICAgICAgc2VsZWN0RGF0ZSh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdKCkge1xyXG4gICAgICBzZWxlY3RNb250aCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl0oKSB7XHJcbiAgICAgIHNlbGVjdFllYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1BSRVZJT1VTX01PTlRIXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzTW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX05FWFRfTU9OVEhdKCkge1xyXG4gICAgICBkaXNwbGF5TmV4dE1vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzWWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTkVYVF9ZRUFSXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRZZWFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LXSgpIHtcclxuICAgICAgZGlzcGxheVByZXZpb3VzWWVhckNodW5rKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktdKCkge1xyXG4gICAgICBkaXNwbGF5TmV4dFllYXJDaHVuayh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OXSgpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5TW9udGhTZWxlY3Rpb24odGhpcyk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05dKCkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IGRpc3BsYXlZZWFyU2VsZWN0aW9uKHRoaXMpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBrZXl1cDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0NBTEVOREFSXShldmVudCkge1xyXG4gICAgICBjb25zdCBrZXlkb3duID0gdGhpcy5kYXRhc2V0LmtleWRvd25LZXlDb2RlO1xyXG4gICAgICBpZiAoYCR7ZXZlbnQua2V5Q29kZX1gICE9PSBrZXlkb3duKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGtleWRvd246IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9FWFRFUk5BTF9JTlBVVF0oZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEVOVEVSX0tFWUNPREUpIHtcclxuICAgICAgICB2YWxpZGF0ZURhdGVJbnB1dCh0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9EQVRFXToga2V5bWFwKHtcclxuICAgICAgVXA6IGhhbmRsZVVwRnJvbURhdGUsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbURhdGUsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tRGF0ZSxcclxuICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbURhdGUsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tRGF0ZSxcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbURhdGUsXHJcbiAgICAgIFJpZ2h0OiBoYW5kbGVSaWdodEZyb21EYXRlLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21EYXRlLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbURhdGUsXHJcbiAgICAgIEVuZDogaGFuZGxlRW5kRnJvbURhdGUsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21EYXRlLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21EYXRlLFxyXG4gICAgICBcIlNoaWZ0K1BhZ2VEb3duXCI6IGhhbmRsZVNoaWZ0UGFnZURvd25Gcm9tRGF0ZSxcclxuICAgICAgXCJTaGlmdCtQYWdlVXBcIjogaGFuZGxlU2hpZnRQYWdlVXBGcm9tRGF0ZSxcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX0RBVEVfUElDS0VSXToga2V5bWFwKHtcclxuICAgICAgVGFiOiBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9NT05USF06IGtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21Nb250aCxcclxuICAgICAgQXJyb3dVcDogaGFuZGxlVXBGcm9tTW9udGgsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tTW9udGgsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21Nb250aCxcclxuICAgICAgTGVmdDogaGFuZGxlTGVmdEZyb21Nb250aCxcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbU1vbnRoLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tTW9udGgsXHJcbiAgICAgIEFycm93UmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbU1vbnRoLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbU1vbnRoLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21Nb250aCxcclxuICAgICAgUGFnZURvd246IGhhbmRsZVBhZ2VEb3duRnJvbU1vbnRoLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21Nb250aCxcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX01PTlRIX1BJQ0tFUl06IGtleW1hcCh7XHJcbiAgICAgIFRhYjogbW9udGhQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQWhlYWQsXHJcbiAgICAgIFwiU2hpZnQrVGFiXCI6IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9ZRUFSXToga2V5bWFwKHtcclxuICAgICAgVXA6IGhhbmRsZVVwRnJvbVllYXIsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbVllYXIsXHJcbiAgICAgIERvd246IGhhbmRsZURvd25Gcm9tWWVhcixcclxuICAgICAgQXJyb3dEb3duOiBoYW5kbGVEb3duRnJvbVllYXIsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tWWVhcixcclxuICAgICAgQXJyb3dMZWZ0OiBoYW5kbGVMZWZ0RnJvbVllYXIsXHJcbiAgICAgIFJpZ2h0OiBoYW5kbGVSaWdodEZyb21ZZWFyLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21ZZWFyLFxyXG4gICAgICBIb21lOiBoYW5kbGVIb21lRnJvbVllYXIsXHJcbiAgICAgIEVuZDogaGFuZGxlRW5kRnJvbVllYXIsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21ZZWFyLFxyXG4gICAgICBQYWdlVXA6IGhhbmRsZVBhZ2VVcEZyb21ZZWFyLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl9QSUNLRVJdOiBrZXltYXAoe1xyXG4gICAgICBUYWI6IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQWhlYWQsXHJcbiAgICAgIFwiU2hpZnQrVGFiXCI6IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIudGFiQmFjayxcclxuICAgIH0pLFxyXG4gICAgW0RBVEVfUElDS0VSX0NBTEVOREFSXShldmVudCkge1xyXG4gICAgICB0aGlzLmRhdGFzZXQua2V5ZG93bktleUNvZGUgPSBldmVudC5rZXlDb2RlO1xyXG4gICAgfSxcclxuICAgIFtEQVRFX1BJQ0tFUl0oZXZlbnQpIHtcclxuICAgICAgY29uc3Qga2V5TWFwID0ga2V5bWFwKHtcclxuICAgICAgICBFc2NhcGU6IGhhbmRsZUVzY2FwZUZyb21DYWxlbmRhcixcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBrZXlNYXAoZXZlbnQpO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIGZvY3Vzb3V0OiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKCkge1xyXG4gICAgICB2YWxpZGF0ZURhdGVJbnB1dCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbREFURV9QSUNLRVJdKGV2ZW50KSB7XHJcbiAgICAgIGlmICghdGhpcy5jb250YWlucyhldmVudC5yZWxhdGVkVGFyZ2V0KSkge1xyXG4gICAgICAgIGhpZGVDYWxlbmRhcih0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGlucHV0OiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKCkge1xyXG4gICAgICByZWNvbmNpbGVJbnB1dFZhbHVlcyh0aGlzKTtcclxuICAgICAgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUodGhpcyk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn07XHJcblxyXG5pZiAoIWlzSW9zRGV2aWNlKCkpIHtcclxuICBkYXRlUGlja2VyRXZlbnRzLm1vdXNlbW92ZSA9IHtcclxuICAgIFtDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tRGF0ZSh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tTW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJdKCkge1xyXG4gICAgICBoYW5kbGVNb3VzZW1vdmVGcm9tWWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5cclxuY29uc3QgZGF0ZVBpY2tlciA9IGJlaGF2aW9yKGRhdGVQaWNrZXJFdmVudHMsIHtcclxuICBpbml0KHJvb3QpIHtcclxuICAgIHNlbGVjdChEQVRFX1BJQ0tFUiwgcm9vdCkuZm9yRWFjaCgoZGF0ZVBpY2tlckVsKSA9PiB7XHJcbiAgICAgIGlmKCFkYXRlUGlja2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKERBVEVfUElDS0VSX0lOSVRJQUxJWkVEX0NMQVNTKSl7XHJcbiAgICAgICAgZW5oYW5jZURhdGVQaWNrZXIoZGF0ZVBpY2tlckVsKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBnZXREYXRlUGlja2VyQ29udGV4dCxcclxuICBkaXNhYmxlLFxyXG4gIGVuYWJsZSxcclxuICBpc0RhdGVJbnB1dEludmFsaWQsXHJcbiAgc2V0Q2FsZW5kYXJWYWx1ZSxcclxuICB2YWxpZGF0ZURhdGVJbnB1dCxcclxuICByZW5kZXJDYWxlbmRhcixcclxuICB1cGRhdGVDYWxlbmRhcklmVmlzaWJsZSxcclxufSk7XHJcblxyXG4vLyAjZW5kcmVnaW9uIERhdGUgUGlja2VyIEV2ZW50IERlbGVnYXRpb24gUmVnaXN0cmF0aW9uIC8gQ29tcG9uZW50XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGVQaWNrZXI7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IERyb3Bkb3duIGZyb20gJy4vZHJvcGRvd24nO1xyXG5pbXBvcnQgJy4uL3BvbHlmaWxscy9GdW5jdGlvbi9wcm90b3R5cGUvYmluZCc7XHJcblxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uYWxpdHkgdG8gc29ydGluZyB2YXJpYW50IG9mIE92ZXJmbG93IG1lbnUgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAub3ZlcmZsb3ctbWVudSBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBEcm9wZG93blNvcnQgKGNvbnRhaW5lcil7XHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgIHRoaXMuYnV0dG9uID0gY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbi1vdmVyZmxvdy1tZW51JylbMF07XHJcblxyXG4gICAgLy8gaWYgbm8gdmFsdWUgaXMgc2VsZWN0ZWQsIGNob29zZSBmaXJzdCBvcHRpb25cclxuICAgIGlmKCF0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcub3ZlcmZsb3ctbGlzdCBsaVthcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpKXtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcub3ZlcmZsb3ctbGlzdCBsaScpWzBdLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIFwidHJ1ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGVkVmFsdWUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBjbGljayBldmVudHMgb24gb3ZlcmZsb3cgbWVudSBhbmQgb3B0aW9ucyBpbiBtZW51XHJcbiAqL1xyXG5Ecm9wZG93blNvcnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5vdmVyZmxvd01lbnUgPSBuZXcgRHJvcGRvd24odGhpcy5idXR0b24pLmluaXQoKTtcclxuXHJcbiAgICBsZXQgc29ydGluZ09wdGlvbnMgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcub3ZlcmZsb3ctbGlzdCBsaSBidXR0b24nKTtcclxuICAgIGZvcihsZXQgcyA9IDA7IHMgPCBzb3J0aW5nT3B0aW9ucy5sZW5ndGg7IHMrKyl7XHJcbiAgICAgICAgbGV0IG9wdGlvbiA9IHNvcnRpbmdPcHRpb25zW3NdO1xyXG4gICAgICAgIG9wdGlvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25PcHRpb25DbGljay5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBidXR0b24gdGV4dCB0byBzZWxlY3RlZCB2YWx1ZVxyXG4gKi9cclxuRHJvcGRvd25Tb3J0LnByb3RvdHlwZS51cGRhdGVTZWxlY3RlZFZhbHVlID0gZnVuY3Rpb24oKXtcclxuICAgIGxldCBzZWxlY3RlZEl0ZW0gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcub3ZlcmZsb3ctbGlzdCBsaVthcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgdGhpcy5jb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzZWxlY3RlZC12YWx1ZScpWzBdLmlubmVyVGV4dCA9IHNlbGVjdGVkSXRlbS5pbm5lclRleHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUcmlnZ2VycyB3aGVuIGNob29zaW5nIG9wdGlvbiBpbiBtZW51XHJcbiAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBlXHJcbiAqL1xyXG5Ecm9wZG93blNvcnQucHJvdG90eXBlLm9uT3B0aW9uQ2xpY2sgPSBmdW5jdGlvbihlKXtcclxuICAgIGxldCBsaSA9IGUudGFyZ2V0LnBhcmVudE5vZGU7XHJcbiAgICBsaS5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJ2xpW2FyaWEtc2VsZWN0ZWQ9XCJ0cnVlXCJdJykucmVtb3ZlQXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJyk7XHJcbiAgICBsaS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xyXG5cclxuICAgIGxldCBidXR0b24gPSBsaS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24tb3ZlcmZsb3ctbWVudScpWzBdO1xyXG4gICAgbGV0IGV2ZW50U2VsZWN0ZWQgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5zZWxlY3RlZCcpO1xyXG4gICAgZXZlbnRTZWxlY3RlZC5kZXRhaWwgPSB0aGlzLnRhcmdldDtcclxuICAgIGJ1dHRvbi5kaXNwYXRjaEV2ZW50KGV2ZW50U2VsZWN0ZWQpO1xyXG4gICAgdGhpcy51cGRhdGVTZWxlY3RlZFZhbHVlKCk7XHJcblxyXG4gICAgLy8gaGlkZSBtZW51XHJcbiAgICBsZXQgb3ZlcmZsb3dNZW51ID0gbmV3IERyb3Bkb3duKGJ1dHRvbik7XHJcbiAgICBvdmVyZmxvd01lbnUuaGlkZSgpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEcm9wZG93blNvcnQ7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgYnJlYWtwb2ludHMgPSByZXF1aXJlKCcuLi91dGlscy9icmVha3BvaW50cycpO1xyXG5jb25zdCBCVVRUT04gPSAnLmJ1dHRvbi1vdmVyZmxvdy1tZW51JztcclxuY29uc3QganNEcm9wZG93bkNvbGxhcHNlTW9kaWZpZXIgPSAnanMtZHJvcGRvd24tLXJlc3BvbnNpdmUtY29sbGFwc2UnOyAvL29wdGlvbjogbWFrZSBkcm9wZG93biBiZWhhdmUgYXMgdGhlIGNvbGxhcHNlIGNvbXBvbmVudCB3aGVuIG9uIHNtYWxsIHNjcmVlbnMgKHVzZWQgYnkgc3VibWVudXMgaW4gdGhlIGhlYWRlciBhbmQgc3RlcC1kcm9wZG93bikuXHJcbmNvbnN0IFRBUkdFVCA9ICdkYXRhLWpzLXRhcmdldCc7XHJcblxyXG4vKipcclxuICogQWRkIGZ1bmN0aW9uYWxpdHkgdG8gb3ZlcmZsb3cgbWVudSBjb21wb25lbnRcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gYnV0dG9uRWxlbWVudCBPdmVyZmxvdyBtZW51IGJ1dHRvblxyXG4gKi9cclxuZnVuY3Rpb24gRHJvcGRvd24gKGJ1dHRvbkVsZW1lbnQpIHtcclxuICB0aGlzLmJ1dHRvbkVsZW1lbnQgPSBidXR0b25FbGVtZW50O1xyXG4gIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xyXG4gIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgaWYodGhpcy5idXR0b25FbGVtZW50ID09PSBudWxsIHx8dGhpcy5idXR0b25FbGVtZW50ID09PSB1bmRlZmluZWQpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBidXR0b24gZm9yIG92ZXJmbG93IG1lbnUgY29tcG9uZW50LmApO1xyXG4gIH1cclxuICBsZXQgdGFyZ2V0QXR0ciA9IHRoaXMuYnV0dG9uRWxlbWVudC5nZXRBdHRyaWJ1dGUoVEFSR0VUKTtcclxuICBpZih0YXJnZXRBdHRyID09PSBudWxsIHx8IHRhcmdldEF0dHIgPT09IHVuZGVmaW5lZCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0dHJpYnV0ZSBjb3VsZCBub3QgYmUgZm91bmQgb24gb3ZlcmZsb3cgbWVudSBjb21wb25lbnQ6ICcrVEFSR0VUKTtcclxuICB9XHJcbiAgbGV0IHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpKTtcclxuICBpZih0YXJnZXRFbCA9PT0gbnVsbCB8fCB0YXJnZXRFbCA9PT0gdW5kZWZpbmVkKXtcclxuICAgIHRocm93IG5ldyBFcnJvcignUGFuZWwgZm9yIG92ZXJmbG93IG1lbnUgY29tcG9uZW50IGNvdWxkIG5vdCBiZSBmb3VuZC4nKTtcclxuICB9XHJcbiAgdGhpcy50YXJnZXRFbCA9IHRhcmdldEVsO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGNsaWNrIGV2ZW50c1xyXG4gKi9cclxuRHJvcGRvd24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKXtcclxuICBpZih0aGlzLmJ1dHRvbkVsZW1lbnQgIT09IG51bGwgJiYgdGhpcy5idXR0b25FbGVtZW50ICE9PSB1bmRlZmluZWQgJiYgdGhpcy50YXJnZXRFbCAhPT0gbnVsbCAmJiB0aGlzLnRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG5cclxuICAgIGlmKHRoaXMuYnV0dG9uRWxlbWVudC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpIHx8IHRoaXMuYnV0dG9uRWxlbWVudC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKXtcclxuICAgICAgdGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9DbGlja2VkIG91dHNpZGUgZHJvcGRvd24gLT4gY2xvc2UgaXRcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG91dHNpZGVDbG9zZSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xvc2UpO1xyXG4gICAgLy9DbGlja2VkIG9uIGRyb3Bkb3duIG9wZW4gYnV0dG9uIC0tPiB0b2dnbGUgaXRcclxuICAgIHRoaXMuYnV0dG9uRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZURyb3Bkb3duKTtcclxuICAgIHRoaXMuYnV0dG9uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZURyb3Bkb3duKTtcclxuICAgIGxldCAkbW9kdWxlID0gdGhpcztcclxuICAgIC8vIHNldCBhcmlhLWhpZGRlbiBjb3JyZWN0bHkgZm9yIHNjcmVlbnJlYWRlcnMgKFRyaW5ndWlkZSByZXNwb25zaXZlKVxyXG4gICAgaWYodGhpcy5yZXNwb25zaXZlTGlzdENvbGxhcHNlRW5hYmxlZCkge1xyXG4gICAgICBsZXQgZWxlbWVudCA9IHRoaXMuYnV0dG9uRWxlbWVudDtcclxuICAgICAgaWYgKHdpbmRvdy5JbnRlcnNlY3Rpb25PYnNlcnZlcikge1xyXG4gICAgICAgIC8vIHRyaWdnZXIgZXZlbnQgd2hlbiBidXR0b24gY2hhbmdlcyB2aXNpYmlsaXR5XHJcbiAgICAgICAgbGV0IG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChlbnRyaWVzKSB7XHJcbiAgICAgICAgICAvLyBidXR0b24gaXMgdmlzaWJsZVxyXG4gICAgICAgICAgaWYgKGVudHJpZXNbIDAgXS5pbnRlcnNlY3Rpb25SYXRpbykge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGJ1dHRvbiBpcyBub3QgdmlzaWJsZVxyXG4gICAgICAgICAgICBpZiAoJG1vZHVsZS50YXJnZXRFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgPT09ICd0cnVlJykge1xyXG4gICAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgcm9vdDogZG9jdW1lbnQuYm9keVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gSUU6IEludGVyc2VjdGlvbk9ic2VydmVyIGlzIG5vdCBzdXBwb3J0ZWQsIHNvIHdlIGxpc3RlbiBmb3Igd2luZG93IHJlc2l6ZSBhbmQgZ3JpZCBicmVha3BvaW50IGluc3RlYWRcclxuICAgICAgICBpZiAoZG9SZXNwb25zaXZlQ29sbGFwc2UoJG1vZHVsZS50cmlnZ2VyRWwpKSB7XHJcbiAgICAgICAgICAvLyBzbWFsbCBzY3JlZW5cclxuICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAnZmFsc2UnKSB7XHJcbiAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyBMYXJnZSBzY3JlZW5cclxuICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKCRtb2R1bGUudHJpZ2dlckVsKSkge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgY2xvc2VPbkVzY2FwZSk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGNsb3NlT25Fc2NhcGUpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEhpZGUgb3ZlcmZsb3cgbWVudVxyXG4gKi9cclxuRHJvcGRvd24ucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpe1xyXG4gIHRvZ2dsZSh0aGlzLmJ1dHRvbkVsZW1lbnQpO1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdyBvdmVyZmxvdyBtZW51XHJcbiAqL1xyXG5Ecm9wZG93bi5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCl7XHJcbiAgdG9nZ2xlKHRoaXMuYnV0dG9uRWxlbWVudCk7XHJcbn1cclxuXHJcbmxldCBjbG9zZU9uRXNjYXBlID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gIGlmIChrZXkgPT09IDI3KSB7XHJcbiAgICBjbG9zZUFsbChldmVudCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldCBhbiBBcnJheSBvZiBidXR0b24gZWxlbWVudHMgYmVsb25naW5nIGRpcmVjdGx5IHRvIHRoZSBnaXZlblxyXG4gKiBhY2NvcmRpb24gZWxlbWVudC5cclxuICogQHBhcmFtIHBhcmVudCBhY2NvcmRpb24gZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7Tm9kZUxpc3RPZjxTVkdFbGVtZW50VGFnTmFtZU1hcFtbc3RyaW5nXV0+IHwgTm9kZUxpc3RPZjxIVE1MRWxlbWVudFRhZ05hbWVNYXBbW3N0cmluZ11dPiB8IE5vZGVMaXN0T2Y8RWxlbWVudD59XHJcbiAqL1xyXG5sZXQgZ2V0QnV0dG9ucyA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcclxuICByZXR1cm4gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbG9zZSBhbGwgb3ZlcmZsb3cgbWVudXNcclxuICogQHBhcmFtIHtldmVudH0gZXZlbnQgZGVmYXVsdCBpcyBudWxsXHJcbiAqL1xyXG5sZXQgY2xvc2VBbGwgPSBmdW5jdGlvbiAoZXZlbnQgPSBudWxsKXtcclxuICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xyXG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcblxyXG4gIGxldCBvdmVyZmxvd01lbnVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ292ZXJmbG93LW1lbnUnKTtcclxuICBmb3IgKGxldCBvaSA9IDA7IG9pIDwgb3ZlcmZsb3dNZW51RWwubGVuZ3RoOyBvaSsrKSB7XHJcbiAgICBsZXQgY3VycmVudE92ZXJmbG93TWVudUVMID0gb3ZlcmZsb3dNZW51RWxbIG9pIF07XHJcbiAgICBsZXQgdHJpZ2dlckVsID0gY3VycmVudE92ZXJmbG93TWVudUVMLnF1ZXJ5U2VsZWN0b3IoQlVUVE9OKydbYXJpYS1leHBhbmRlZD1cInRydWVcIl0nKTtcclxuICAgIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCl7XHJcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICBsZXQgdGFyZ2V0RWwgPSBjdXJyZW50T3ZlcmZsb3dNZW51RUwucXVlcnlTZWxlY3RvcignIycrdHJpZ2dlckVsLmdldEF0dHJpYnV0ZShUQVJHRVQpLnJlcGxhY2UoJyMnLCAnJykpO1xyXG5cclxuICAgICAgICBpZiAodGFyZ2V0RWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBpZihkb1Jlc3BvbnNpdmVDb2xsYXBzZSh0cmlnZ2VyRWwpKXtcclxuICAgICAgICAgICAgaWYodHJpZ2dlckVsLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLmNsb3NlJyk7XHJcbiAgICAgICAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYoY2hhbmdlZCAmJiBldmVudCAhPT0gbnVsbCl7XHJcbiAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICB9XHJcbn07XHJcbmxldCBvZmZzZXQgPSBmdW5jdGlvbiAoZWwpIHtcclxuICBsZXQgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxyXG4gICAgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcclxuICAgIHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xyXG4gIHJldHVybiB7IHRvcDogcmVjdC50b3AgKyBzY3JvbGxUb3AsIGxlZnQ6IHJlY3QubGVmdCArIHNjcm9sbExlZnQgfTtcclxufTtcclxuXHJcbmxldCB0b2dnbGVEcm9wZG93biA9IGZ1bmN0aW9uIChldmVudCwgZm9yY2VDbG9zZSA9IGZhbHNlKSB7XHJcbiAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgdG9nZ2xlKHRoaXMsIGZvcmNlQ2xvc2UpO1xyXG5cclxufTtcclxuXHJcbmxldCB0b2dnbGUgPSBmdW5jdGlvbihidXR0b24sIGZvcmNlQ2xvc2UgPSBmYWxzZSl7XHJcbiAgbGV0IHRyaWdnZXJFbCA9IGJ1dHRvbjtcclxuICBsZXQgdGFyZ2V0RWwgPSBudWxsO1xyXG4gIGlmKHRyaWdnZXJFbCAhPT0gbnVsbCAmJiB0cmlnZ2VyRWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICBsZXQgdGFyZ2V0QXR0ciA9IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKTtcclxuICAgIGlmKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJykpO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0RWwgIT09IG51bGwgJiYgdGFyZ2V0RWwgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAvL2NoYW5nZSBzdGF0ZVxyXG5cclxuICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSBudWxsO1xyXG4gICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSBudWxsO1xyXG5cclxuICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnIHx8IGZvcmNlQ2xvc2Upe1xyXG4gICAgICAvL2Nsb3NlXHJcbiAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAgICAgIFxyXG4gICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLmNsb3NlJyk7XHJcbiAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIFxyXG4gICAgICBpZighZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QuY29udGFpbnMoJ21vYmlsZV9uYXYtYWN0aXZlJykpe1xyXG4gICAgICAgIGNsb3NlQWxsKCk7XHJcbiAgICAgIH1cclxuICAgICAgLy9vcGVuXHJcbiAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICB0YXJnZXRFbC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZWQnKTtcclxuICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24ub3BlbicpO1xyXG4gICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gICAgICBsZXQgdGFyZ2V0T2Zmc2V0ID0gb2Zmc2V0KHRhcmdldEVsKTtcclxuXHJcbiAgICAgIGlmKHRhcmdldE9mZnNldC5sZWZ0IDwgMCl7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCByaWdodCA9IHRhcmdldE9mZnNldC5sZWZ0ICsgdGFyZ2V0RWwub2Zmc2V0V2lkdGg7XHJcbiAgICAgIGlmKHJpZ2h0ID4gd2luZG93LmlubmVyV2lkdGgpe1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnYXV0byc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnMHB4JztcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IG9mZnNldEFnYWluID0gb2Zmc2V0KHRhcmdldEVsKTtcclxuXHJcbiAgICAgIGlmKG9mZnNldEFnYWluLmxlZnQgPCAwKXtcclxuXHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgICB9XHJcbiAgICAgIHJpZ2h0ID0gb2Zmc2V0QWdhaW4ubGVmdCArIHRhcmdldEVsLm9mZnNldFdpZHRoO1xyXG4gICAgICBpZihyaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKXtcclxuXHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUubGVmdCA9ICdhdXRvJztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICcwcHgnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gIH1cclxufVxyXG5cclxubGV0IGhhc1BhcmVudCA9IGZ1bmN0aW9uIChjaGlsZCwgcGFyZW50VGFnTmFtZSl7XHJcbiAgaWYoY2hpbGQucGFyZW50Tm9kZS50YWdOYW1lID09PSBwYXJlbnRUYWdOYW1lKXtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gZWxzZSBpZihwYXJlbnRUYWdOYW1lICE9PSAnQk9EWScgJiYgY2hpbGQucGFyZW50Tm9kZS50YWdOYW1lICE9PSAnQk9EWScpe1xyXG4gICAgcmV0dXJuIGhhc1BhcmVudChjaGlsZC5wYXJlbnROb2RlLCBwYXJlbnRUYWdOYW1lKTtcclxuICB9ZWxzZXtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcblxyXG5sZXQgb3V0c2lkZUNsb3NlID0gZnVuY3Rpb24gKGV2dCl7XHJcbiAgaWYoIWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2JpbGVfbmF2LWFjdGl2ZScpKXtcclxuICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHkubW9iaWxlX25hdi1hY3RpdmUnKSA9PT0gbnVsbCAmJiAhZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2J1dHRvbi1tZW51LWNsb3NlJykpIHtcclxuICAgICAgbGV0IG9wZW5Ecm9wZG93bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTisnW2FyaWEtZXhwYW5kZWQ9dHJ1ZV0nKTtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcGVuRHJvcGRvd25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHRyaWdnZXJFbCA9IG9wZW5Ecm9wZG93bnNbaV07XHJcbiAgICAgICAgbGV0IHRhcmdldEVsID0gbnVsbDtcclxuICAgICAgICBsZXQgdGFyZ2V0QXR0ciA9IHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKTtcclxuICAgICAgICBpZiAodGFyZ2V0QXR0ciAhPT0gbnVsbCAmJiB0YXJnZXRBdHRyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGlmKHRhcmdldEF0dHIuaW5kZXhPZignIycpICE9PSAtMSl7XHJcbiAgICAgICAgICAgIHRhcmdldEF0dHIgPSB0YXJnZXRBdHRyLnJlcGxhY2UoJyMnLCAnJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZG9SZXNwb25zaXZlQ29sbGFwc2UodHJpZ2dlckVsKSB8fCAoaGFzUGFyZW50KHRyaWdnZXJFbCwgJ0hFQURFUicpICYmICFldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmxheScpKSkge1xyXG4gICAgICAgICAgLy9jbG9zZXMgZHJvcGRvd24gd2hlbiBjbGlja2VkIG91dHNpZGVcclxuICAgICAgICAgIGlmIChldnQudGFyZ2V0ICE9PSB0cmlnZ2VyRWwpIHtcclxuICAgICAgICAgICAgLy9jbGlja2VkIG91dHNpZGUgdHJpZ2dlciwgZm9yY2UgY2xvc2VcclxuICAgICAgICAgICAgdHJpZ2dlckVsLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgICAgICB0YXJnZXRFbC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7ICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLmNsb3NlJyk7XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmxldCBkb1Jlc3BvbnNpdmVDb2xsYXBzZSA9IGZ1bmN0aW9uICh0cmlnZ2VyRWwpe1xyXG4gIGlmKCF0cmlnZ2VyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKGpzRHJvcGRvd25Db2xsYXBzZU1vZGlmaWVyKSl7XHJcbiAgICAvLyBub3QgbmF2IG92ZXJmbG93IG1lbnVcclxuICAgIGlmKHRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpIHx8IHRyaWdnZXJFbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbGctbm8tcmVzcG9uc2l2ZScpKSB7XHJcbiAgICAgIC8vIHRyaW5pbmRpa2F0b3Igb3ZlcmZsb3cgbWVudVxyXG4gICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPD0gZ2V0VHJpbmd1aWRlQnJlYWtwb2ludCh0cmlnZ2VyRWwpKSB7XHJcbiAgICAgICAgLy8gb3ZlcmZsb3cgbWVudSBww6UgcmVzcG9uc2l2IHRyaW5ndWlkZSBha3RpdmVyZXRcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNle1xyXG4gICAgICAvLyBub3JtYWwgb3ZlcmZsb3cgbWVudVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmYWxzZTtcclxufTtcclxuXHJcbmxldCBnZXRUcmluZ3VpZGVCcmVha3BvaW50ID0gZnVuY3Rpb24gKGJ1dHRvbil7XHJcbiAgaWYoYnV0dG9uLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1tZC1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgcmV0dXJuIGJyZWFrcG9pbnRzLm1kO1xyXG4gIH1cclxuICBpZihidXR0b24ucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSl7XHJcbiAgICByZXR1cm4gYnJlYWtwb2ludHMubGc7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd247IiwiJ3VzZSBzdHJpY3QnO1xyXG4vKipcclxuICogSGFuZGxlIGZvY3VzIG9uIGlucHV0IGVsZW1lbnRzIHVwb24gY2xpY2tpbmcgbGluayBpbiBlcnJvciBtZXNzYWdlXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgRXJyb3Igc3VtbWFyeSBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBFcnJvclN1bW1hcnkgKGVsZW1lbnQpIHtcclxuICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50cyBvbiBsaW5rcyBpbiBlcnJvciBzdW1tYXJ5XHJcbiAqL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKCF0aGlzLmVsZW1lbnQpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuICB0aGlzLmVsZW1lbnQuZm9jdXMoKVxyXG5cclxuICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcykpXHJcbn1cclxuXHJcbi8qKlxyXG4qIENsaWNrIGV2ZW50IGhhbmRsZXJcclxuKlxyXG4qIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgLSBDbGljayBldmVudFxyXG4qL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmhhbmRsZUNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldFxyXG4gIGlmICh0aGlzLmZvY3VzVGFyZ2V0KHRhcmdldCkpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGb2N1cyB0aGUgdGFyZ2V0IGVsZW1lbnRcclxuICpcclxuICogQnkgZGVmYXVsdCwgdGhlIGJyb3dzZXIgd2lsbCBzY3JvbGwgdGhlIHRhcmdldCBpbnRvIHZpZXcuIEJlY2F1c2Ugb3VyIGxhYmVsc1xyXG4gKiBvciBsZWdlbmRzIGFwcGVhciBhYm92ZSB0aGUgaW5wdXQsIHRoaXMgbWVhbnMgdGhlIHVzZXIgd2lsbCBiZSBwcmVzZW50ZWQgd2l0aFxyXG4gKiBhbiBpbnB1dCB3aXRob3V0IGFueSBjb250ZXh0LCBhcyB0aGUgbGFiZWwgb3IgbGVnZW5kIHdpbGwgYmUgb2ZmIHRoZSB0b3Agb2ZcclxuICogdGhlIHNjcmVlbi5cclxuICpcclxuICogTWFudWFsbHkgaGFuZGxpbmcgdGhlIGNsaWNrIGV2ZW50LCBzY3JvbGxpbmcgdGhlIHF1ZXN0aW9uIGludG8gdmlldyBhbmQgdGhlblxyXG4gKiBmb2N1c3NpbmcgdGhlIGVsZW1lbnQgc29sdmVzIHRoaXMuXHJcbiAqXHJcbiAqIFRoaXMgYWxzbyByZXN1bHRzIGluIHRoZSBsYWJlbCBhbmQvb3IgbGVnZW5kIGJlaW5nIGFubm91bmNlZCBjb3JyZWN0bHkgaW5cclxuICogTlZEQSAoYXMgdGVzdGVkIGluIDIwMTguMy4yKSAtIHdpdGhvdXQgdGhpcyBvbmx5IHRoZSBmaWVsZCB0eXBlIGlzIGFubm91bmNlZFxyXG4gKiAoZS5nLiBcIkVkaXQsIGhhcyBhdXRvY29tcGxldGVcIikuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICR0YXJnZXQgLSBFdmVudCB0YXJnZXRcclxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHRhcmdldCB3YXMgYWJsZSB0byBiZSBmb2N1c3NlZFxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5mb2N1c1RhcmdldCA9IGZ1bmN0aW9uICgkdGFyZ2V0KSB7XHJcbiAgLy8gSWYgdGhlIGVsZW1lbnQgdGhhdCB3YXMgY2xpY2tlZCB3YXMgbm90IGEgbGluaywgcmV0dXJuIGVhcmx5XHJcbiAgaWYgKCR0YXJnZXQudGFnTmFtZSAhPT0gJ0EnIHx8ICR0YXJnZXQuaHJlZiA9PT0gZmFsc2UpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgdmFyIGlucHV0SWQgPSB0aGlzLmdldEZyYWdtZW50RnJvbVVybCgkdGFyZ2V0LmhyZWYpXHJcbiAgdmFyICRpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0SWQpXHJcbiAgaWYgKCEkaW5wdXQpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgdmFyICRsZWdlbmRPckxhYmVsID0gdGhpcy5nZXRBc3NvY2lhdGVkTGVnZW5kT3JMYWJlbCgkaW5wdXQpXHJcbiAgaWYgKCEkbGVnZW5kT3JMYWJlbCkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICAvLyBTY3JvbGwgdGhlIGxlZ2VuZCBvciBsYWJlbCBpbnRvIHZpZXcgKmJlZm9yZSogY2FsbGluZyBmb2N1cyBvbiB0aGUgaW5wdXQgdG9cclxuICAvLyBhdm9pZCBleHRyYSBzY3JvbGxpbmcgaW4gYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IGBwcmV2ZW50U2Nyb2xsYCAod2hpY2hcclxuICAvLyBhdCB0aW1lIG9mIHdyaXRpbmcgaXMgbW9zdCBvZiB0aGVtLi4uKVxyXG4gICRsZWdlbmRPckxhYmVsLnNjcm9sbEludG9WaWV3KClcclxuICAkaW5wdXQuZm9jdXMoeyBwcmV2ZW50U2Nyb2xsOiB0cnVlIH0pXHJcblxyXG4gIHJldHVybiB0cnVlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgZnJhZ21lbnQgZnJvbSBVUkxcclxuICpcclxuICogRXh0cmFjdCB0aGUgZnJhZ21lbnQgKGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGhhc2gpIGZyb20gYSBVUkwsIGJ1dCBub3QgaW5jbHVkaW5nXHJcbiAqIHRoZSBoYXNoLlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVVJMXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEZyYWdtZW50IGZyb20gVVJMLCB3aXRob3V0IHRoZSBoYXNoXHJcbiAqL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmdldEZyYWdtZW50RnJvbVVybCA9IGZ1bmN0aW9uICh1cmwpIHtcclxuICBpZiAodXJsLmluZGV4T2YoJyMnKSA9PT0gLTEpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHVybC5zcGxpdCgnIycpLnBvcCgpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYXNzb2NpYXRlZCBsZWdlbmQgb3IgbGFiZWxcclxuICpcclxuICogUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IGV4aXN0cyBmcm9tIHRoaXMgbGlzdDpcclxuICpcclxuICogLSBUaGUgYDxsZWdlbmQ+YCBhc3NvY2lhdGVkIHdpdGggdGhlIGNsb3Nlc3QgYDxmaWVsZHNldD5gIGFuY2VzdG9yLCBhcyBsb25nXHJcbiAqICAgYXMgdGhlIHRvcCBvZiBpdCBpcyBubyBtb3JlIHRoYW4gaGFsZiBhIHZpZXdwb3J0IGhlaWdodCBhd2F5IGZyb20gdGhlXHJcbiAqICAgYm90dG9tIG9mIHRoZSBpbnB1dFxyXG4gKiAtIFRoZSBmaXJzdCBgPGxhYmVsPmAgdGhhdCBpcyBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0IHVzaW5nIGZvcj1cImlucHV0SWRcIlxyXG4gKiAtIFRoZSBjbG9zZXN0IHBhcmVudCBgPGxhYmVsPmBcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gJGlucHV0IC0gVGhlIGlucHV0XHJcbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gQXNzb2NpYXRlZCBsZWdlbmQgb3IgbGFiZWwsIG9yIG51bGwgaWYgbm8gYXNzb2NpYXRlZFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2VuZCBvciBsYWJlbCBjYW4gYmUgZm91bmRcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuZ2V0QXNzb2NpYXRlZExlZ2VuZE9yTGFiZWwgPSBmdW5jdGlvbiAoJGlucHV0KSB7XHJcbiAgdmFyICRmaWVsZHNldCA9ICRpbnB1dC5jbG9zZXN0KCdmaWVsZHNldCcpXHJcblxyXG4gIGlmICgkZmllbGRzZXQpIHtcclxuICAgIHZhciBsZWdlbmRzID0gJGZpZWxkc2V0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsZWdlbmQnKVxyXG5cclxuICAgIGlmIChsZWdlbmRzLmxlbmd0aCkge1xyXG4gICAgICB2YXIgJGNhbmRpZGF0ZUxlZ2VuZCA9IGxlZ2VuZHNbMF1cclxuXHJcbiAgICAgIC8vIElmIHRoZSBpbnB1dCB0eXBlIGlzIHJhZGlvIG9yIGNoZWNrYm94LCBhbHdheXMgdXNlIHRoZSBsZWdlbmQgaWYgdGhlcmVcclxuICAgICAgLy8gaXMgb25lLlxyXG4gICAgICBpZiAoJGlucHV0LnR5cGUgPT09ICdjaGVja2JveCcgfHwgJGlucHV0LnR5cGUgPT09ICdyYWRpbycpIHtcclxuICAgICAgICByZXR1cm4gJGNhbmRpZGF0ZUxlZ2VuZFxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBGb3Igb3RoZXIgaW5wdXQgdHlwZXMsIG9ubHkgc2Nyb2xsIHRvIHRoZSBmaWVsZHNldOKAmXMgbGVnZW5kIChpbnN0ZWFkIG9mXHJcbiAgICAgIC8vIHRoZSBsYWJlbCBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0KSBpZiB0aGUgaW5wdXQgd291bGQgZW5kIHVwIGluIHRoZVxyXG4gICAgICAvLyB0b3AgaGFsZiBvZiB0aGUgc2NyZWVuLlxyXG4gICAgICAvL1xyXG4gICAgICAvLyBUaGlzIHNob3VsZCBhdm9pZCBzaXR1YXRpb25zIHdoZXJlIHRoZSBpbnB1dCBlaXRoZXIgZW5kcyB1cCBvZmYgdGhlXHJcbiAgICAgIC8vIHNjcmVlbiwgb3Igb2JzY3VyZWQgYnkgYSBzb2Z0d2FyZSBrZXlib2FyZC5cclxuICAgICAgdmFyIGxlZ2VuZFRvcCA9ICRjYW5kaWRhdGVMZWdlbmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wXHJcbiAgICAgIHZhciBpbnB1dFJlY3QgPSAkaW5wdXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuXHJcbiAgICAgIC8vIElmIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxyXG4gICAgICAvLyBvciB3aW5kb3cuaW5uZXJIZWlnaHQgKGxpa2UgSUU4KSwgYmFpbCBhbmQganVzdCBsaW5rIHRvIHRoZSBsYWJlbC5cclxuICAgICAgaWYgKGlucHV0UmVjdC5oZWlnaHQgJiYgd2luZG93LmlubmVySGVpZ2h0KSB7XHJcbiAgICAgICAgdmFyIGlucHV0Qm90dG9tID0gaW5wdXRSZWN0LnRvcCArIGlucHV0UmVjdC5oZWlnaHRcclxuXHJcbiAgICAgICAgaWYgKGlucHV0Qm90dG9tIC0gbGVnZW5kVG9wIDwgd2luZG93LmlubmVySGVpZ2h0IC8gMikge1xyXG4gICAgICAgICAgcmV0dXJuICRjYW5kaWRhdGVMZWdlbmRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibGFiZWxbZm9yPSdcIiArICRpbnB1dC5nZXRBdHRyaWJ1dGUoJ2lkJykgKyBcIiddXCIpIHx8XHJcbiAgICAkaW5wdXQuY2xvc2VzdCgnbGFiZWwnKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFcnJvclN1bW1hcnk7IiwiJ3VzZSBzdHJpY3QnO1xyXG4vKipcclxuICogQWRkcyBjbGljayBmdW5jdGlvbmFsaXR5IHRvIG1vZGFsXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICRtb2RhbCBNb2RhbCBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBNb2RhbCAoJG1vZGFsKSB7XHJcbiAgICB0aGlzLiRtb2RhbCA9ICRtb2RhbDtcclxuICAgIGxldCBpZCA9IHRoaXMuJG1vZGFsLmdldEF0dHJpYnV0ZSgnaWQnKTtcclxuICAgIHRoaXMudHJpZ2dlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGU9XCJtb2RhbFwiXVtkYXRhLXRhcmdldD1cIicraWQrJ1wiXScpO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50c1xyXG4gKi9cclxuTW9kYWwucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHRyaWdnZXJzID0gdGhpcy50cmlnZ2VycztcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRyaWdnZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgIGxldCB0cmlnZ2VyID0gdHJpZ2dlcnNbIGkgXTtcclxuICAgIHRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnNob3cuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG4gIGxldCBjbG9zZXJzID0gdGhpcy4kbW9kYWwucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kYWwtY2xvc2VdJyk7XHJcbiAgZm9yIChsZXQgYyA9IDA7IGMgPCBjbG9zZXJzLmxlbmd0aDsgYysrKXtcclxuICAgIGxldCBjbG9zZXIgPSBjbG9zZXJzWyBjIF07XHJcbiAgICBjbG9zZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGUuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhpZGUgbW9kYWxcclxuICovXHJcbk1vZGFsLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCl7XHJcbiAgbGV0IG1vZGFsRWxlbWVudCA9IHRoaXMuJG1vZGFsO1xyXG4gIGlmKG1vZGFsRWxlbWVudCAhPT0gbnVsbCl7XHJcbiAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcblxyXG4gICAgbGV0IGV2ZW50Q2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgIGV2ZW50Q2xvc2UuaW5pdEV2ZW50KCdmZHMubW9kYWwuaGlkZGVuJywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICBtb2RhbEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuXHJcbiAgICBsZXQgJGJhY2tkcm9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21vZGFsLWJhY2tkcm9wJyk7XHJcbiAgICAkYmFja2Ryb3AucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCgkYmFja2Ryb3ApO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtb3BlbicpO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBGb2N1cywgdHJ1ZSk7XHJcblxyXG4gICAgaWYoIWhhc0ZvcmNlZEFjdGlvbihtb2RhbEVsZW1lbnQpKXtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVFc2NhcGUpO1xyXG4gICAgfVxyXG4gICAgbGV0IGRhdGFNb2RhbE9wZW5lciA9IG1vZGFsRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtb3BlbmVyJyk7XHJcbiAgICBpZihkYXRhTW9kYWxPcGVuZXIgIT09IG51bGwpe1xyXG4gICAgICBsZXQgb3BlbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGF0YU1vZGFsT3BlbmVyKVxyXG4gICAgICBpZihvcGVuZXIgIT09IG51bGwpe1xyXG4gICAgICAgIG9wZW5lci5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICAgIG1vZGFsRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtb3BlbmVyJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNob3cgbW9kYWxcclxuICovXHJcbk1vZGFsLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKGUgPSBudWxsKXtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gdGhpcy4kbW9kYWw7XHJcbiAgaWYobW9kYWxFbGVtZW50ICE9PSBudWxsKXtcclxuICAgIGlmKGUgIT09IG51bGwpe1xyXG4gICAgICBsZXQgb3BlbmVySWQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICAgIGlmKG9wZW5lcklkID09PSBudWxsKXtcclxuICAgICAgICBvcGVuZXJJZCA9ICdtb2RhbC1vcGVuZXItJytNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoOTk5OSAtIDEwMDAgKyAxKSArIDEwMDApO1xyXG4gICAgICAgIGUudGFyZ2V0LnNldEF0dHJpYnV0ZSgnaWQnLCBvcGVuZXJJZClcclxuICAgICAgfVxyXG4gICAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLW9wZW5lcicsIG9wZW5lcklkKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIaWRlIG9wZW4gbW9kYWxzIC0gRkRTIGRvIG5vdCByZWNvbW1lbmQgbW9yZSB0aGFuIG9uZSBvcGVuIG1vZGFsIGF0IGEgdGltZVxyXG4gICAgbGV0IGFjdGl2ZU1vZGFscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJyk7XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYWN0aXZlTW9kYWxzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgbmV3IE1vZGFsKGFjdGl2ZU1vZGFsc1tpXSkuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vZGFsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG5cclxuICAgIGxldCBldmVudE9wZW4gPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuICAgIGV2ZW50T3Blbi5pbml0RXZlbnQoJ2Zkcy5tb2RhbC5zaG93bicsIHRydWUsIHRydWUpO1xyXG4gICAgbW9kYWxFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuXHJcbiAgICBsZXQgJGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAkYmFja2Ryb3AuY2xhc3NMaXN0LmFkZCgnbW9kYWwtYmFja2Ryb3AnKTtcclxuICAgICRiYWNrZHJvcC5zZXRBdHRyaWJ1dGUoJ2lkJywgXCJtb2RhbC1iYWNrZHJvcFwiKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQoJGJhY2tkcm9wKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5hZGQoJ21vZGFsLW9wZW4nKTtcclxuXHJcbiAgICBtb2RhbEVsZW1lbnQuZm9jdXMoKTtcclxuXHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcEZvY3VzLCB0cnVlKTtcclxuICAgIGlmKCFoYXNGb3JjZWRBY3Rpb24obW9kYWxFbGVtZW50KSl7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlRXNjYXBlKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENsb3NlIG1vZGFsIHdoZW4gaGl0dGluZyBFU0NcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCBcclxuICovXHJcbmxldCBoYW5kbGVFc2NhcGUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICBsZXQgbW9kYWxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKTtcclxuICBsZXQgY3VycmVudE1vZGFsID0gbmV3IE1vZGFsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJykpO1xyXG4gIGlmIChrZXkgPT09IDI3KXtcclxuICAgIGxldCBwb3NzaWJsZU92ZXJmbG93TWVudXMgPSBtb2RhbEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJ1dHRvbi1vdmVyZmxvdy1tZW51W2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICBpZihwb3NzaWJsZU92ZXJmbG93TWVudXMubGVuZ3RoID09PSAwKXtcclxuICAgICAgY3VycmVudE1vZGFsLmhpZGUoKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVHJhcCBmb2N1cyBpbiBtb2RhbCB3aGVuIG9wZW5cclxuICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGVcclxuICovXHJcbiBmdW5jdGlvbiB0cmFwRm9jdXMoZSl7XHJcbiAgdmFyIGN1cnJlbnREaWFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmRzLW1vZGFsW2FyaWEtaGlkZGVuPWZhbHNlXScpO1xyXG4gIGlmKGN1cnJlbnREaWFsb2cgIT09IG51bGwpe1xyXG4gICAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzID0gY3VycmVudERpYWxvZy5xdWVyeVNlbGVjdG9yQWxsKCdhW2hyZWZdOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBpbnB1dDpub3QoW3R5cGU9aGlkZGVuXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW49dHJ1ZV0pLCBkZXRhaWxzOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKScpO1xyXG4gICAgXHJcbiAgICB2YXIgZmlyc3RGb2N1c2FibGVFbGVtZW50ID0gZm9jdXNhYmxlRWxlbWVudHNbMF07XHJcbiAgICB2YXIgbGFzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICB2YXIgaXNUYWJQcmVzc2VkID0gKGUua2V5ID09PSAnVGFiJyB8fCBlLmtleUNvZGUgPT09IDkpO1xyXG5cclxuICAgIGlmICghaXNUYWJQcmVzc2VkKSB7IFxyXG4gICAgICByZXR1cm47IFxyXG4gICAgfVxyXG5cclxuICAgIGlmICggZS5zaGlmdEtleSApIC8qIHNoaWZ0ICsgdGFiICovIHtcclxuICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0Rm9jdXNhYmxlRWxlbWVudCkge1xyXG4gICAgICAgIGxhc3RGb2N1c2FibGVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSAvKiB0YWIgKi8ge1xyXG4gICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdEZvY3VzYWJsZUVsZW1lbnQpIHtcclxuICAgICAgICBmaXJzdEZvY3VzYWJsZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIGhhc0ZvcmNlZEFjdGlvbiAobW9kYWwpe1xyXG4gIGlmKG1vZGFsLmdldEF0dHJpYnV0ZSgnZGF0YS1tb2RhbC1mb3JjZWQtYWN0aW9uJykgPT09IG51bGwpe1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTW9kYWw7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgZm9yRWFjaCA9IHJlcXVpcmUoJ2FycmF5LWZvcmVhY2gnKTtcclxuY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcblxyXG5jb25zdCBOQVYgPSBgLm5hdmA7XHJcbmNvbnN0IE5BVl9MSU5LUyA9IGAke05BVn0gYWA7XHJcbmNvbnN0IE9QRU5FUlMgPSBgLmpzLW1lbnUtb3BlbmA7XHJcbmNvbnN0IENMT1NFX0JVVFRPTiA9IGAuanMtbWVudS1jbG9zZWA7XHJcbmNvbnN0IE9WRVJMQVkgPSBgLm92ZXJsYXlgO1xyXG5jb25zdCBDTE9TRVJTID0gYCR7Q0xPU0VfQlVUVE9OfSwgLm92ZXJsYXlgO1xyXG5jb25zdCBUT0dHTEVTID0gWyBOQVYsIE9WRVJMQVkgXS5qb2luKCcsICcpO1xyXG5cclxuY29uc3QgQUNUSVZFX0NMQVNTID0gJ21vYmlsZV9uYXYtYWN0aXZlJztcclxuY29uc3QgVklTSUJMRV9DTEFTUyA9ICdpcy12aXNpYmxlJztcclxuXHJcbi8qKlxyXG4gKiBBZGQgbW9iaWxlIG1lbnUgZnVuY3Rpb25hbGl0eVxyXG4gKi9cclxuY2xhc3MgTmF2aWdhdGlvbiB7XHJcbiAgLyoqXHJcbiAgICogU2V0IGV2ZW50c1xyXG4gICAqL1xyXG4gIGluaXQgKCkge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG1vYmlsZU1lbnUsIGZhbHNlKTtcclxuICAgIG1vYmlsZU1lbnUoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBldmVudHNcclxuICAgKi9cclxuICB0ZWFyZG93biAoKSB7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbW9iaWxlTWVudSwgZmFsc2UpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIG1vYmlsZSBtZW51XHJcbiAqL1xyXG5jb25zdCBtb2JpbGVNZW51ID0gZnVuY3Rpb24oKSB7XHJcbiAgbGV0IG1vYmlsZSA9IGZhbHNlO1xyXG4gIGxldCBvcGVuZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChPUEVORVJTKTtcclxuICBmb3IobGV0IG8gPSAwOyBvIDwgb3BlbmVycy5sZW5ndGg7IG8rKykge1xyXG4gICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUob3BlbmVyc1tvXSwgbnVsbCkuZGlzcGxheSAhPT0gJ25vbmUnKSB7XHJcbiAgICAgIG9wZW5lcnNbb10uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVOYXYpO1xyXG4gICAgICBtb2JpbGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gaWYgbW9iaWxlXHJcbiAgaWYobW9iaWxlKXtcclxuICAgIGxldCBjbG9zZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChDTE9TRVJTKTtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjbG9zZXJzLmxlbmd0aDsgYysrKSB7XHJcbiAgICAgIGNsb3NlcnNbIGMgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZU5hdik7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG5hdkxpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChOQVZfTElOS1MpO1xyXG4gICAgZm9yKGxldCBuID0gMDsgbiA8IG5hdkxpbmtzLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgIG5hdkxpbmtzWyBuIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vIEEgbmF2aWdhdGlvbiBsaW5rIGhhcyBiZWVuIGNsaWNrZWQhIFdlIHdhbnQgdG8gY29sbGFwc2UgYW55XHJcbiAgICAgICAgLy8gaGllcmFyY2hpY2FsIG5hdmlnYXRpb24gVUkgaXQncyBhIHBhcnQgb2YsIHNvIHRoYXQgdGhlIHVzZXJcclxuICAgICAgICAvLyBjYW4gZm9jdXMgb24gd2hhdGV2ZXIgdGhleSd2ZSBqdXN0IHNlbGVjdGVkLlxyXG5cclxuICAgICAgICAvLyBTb21lIG5hdmlnYXRpb24gbGlua3MgYXJlIGluc2lkZSBkcm9wZG93bnM7IHdoZW4gdGhleSdyZVxyXG4gICAgICAgIC8vIGNsaWNrZWQsIHdlIHdhbnQgdG8gY29sbGFwc2UgdGhvc2UgZHJvcGRvd25zLlxyXG5cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIG1vYmlsZSBuYXZpZ2F0aW9uIG1lbnUgaXMgYWN0aXZlLCB3ZSB3YW50IHRvIGhpZGUgaXQuXHJcbiAgICAgICAgaWYgKGlzQWN0aXZlKCkpIHtcclxuICAgICAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRyYXBDb250YWluZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChOQVYpO1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRyYXBDb250YWluZXJzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgZm9jdXNUcmFwID0gX2ZvY3VzVHJhcCh0cmFwQ29udGFpbmVyc1tpXSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgY29uc3QgY2xvc2VyID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcblxyXG4gIGlmIChpc0FjdGl2ZSgpICYmIGNsb3NlciAmJiBjbG9zZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggPT09IDApIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IGlzIGFjdGl2ZSwgYnV0IHRoZSBjbG9zZSBib3ggaXNuJ3QgdmlzaWJsZSwgd2hpY2hcclxuICAgIC8vIG1lYW5zIHRoZSB1c2VyJ3Mgdmlld3BvcnQgaGFzIGJlZW4gcmVzaXplZCBzbyB0aGF0IGl0IGlzIG5vIGxvbmdlclxyXG4gICAgLy8gaW4gbW9iaWxlIG1vZGUuIExldCdzIG1ha2UgdGhlIHBhZ2Ugc3RhdGUgY29uc2lzdGVudCBieVxyXG4gICAgLy8gZGVhY3RpdmF0aW5nIHRoZSBtb2JpbGUgbmF2LlxyXG4gICAgdG9nZ2xlTmF2LmNhbGwoY2xvc2VyLCBmYWxzZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIG1vYmlsZSBtZW51IGlzIGFjdGl2ZVxyXG4gKiBAcmV0dXJucyB0cnVlIGlmIG1vYmlsZSBtZW51IGlzIGFjdGl2ZSBhbmQgZmFsc2UgaWYgbm90IGFjdGl2ZVxyXG4gKi9cclxuY29uc3QgaXNBY3RpdmUgPSAoKSA9PiBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhBQ1RJVkVfQ0xBU1MpO1xyXG5cclxuLyoqXHJcbiAqIFRyYXAgZm9jdXMgaW4gbW9iaWxlIG1lbnUgaWYgYWN0aXZlXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRyYXBDb250YWluZXIgXHJcbiAqL1xyXG5jb25zdCBfZm9jdXNUcmFwID0gKHRyYXBDb250YWluZXIpID0+IHtcclxuXHJcbiAgLy8gRmluZCBhbGwgZm9jdXNhYmxlIGNoaWxkcmVuXHJcbiAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0nO1xyXG4gIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IHRyYXBDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XHJcbiAgbGV0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWyAwIF07XHJcblxyXG4gIGZ1bmN0aW9uIHRyYXBUYWJLZXkgKGUpIHtcclxuICAgIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gICAgLy8gQ2hlY2sgZm9yIFRBQiBrZXkgcHJlc3NcclxuICAgIGlmIChrZXkgPT09IDkpIHtcclxuXHJcbiAgICAgIGxldCBsYXN0VGFiU3RvcCA9IG51bGw7XHJcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgbGV0IG51bWJlciA9IGZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1sgbnVtYmVyIC0gaSBdO1xyXG4gICAgICAgIGlmIChlbGVtZW50Lm9mZnNldFdpZHRoID4gMCAmJiBlbGVtZW50Lm9mZnNldEhlaWdodCA+IDApIHtcclxuICAgICAgICAgIGxhc3RUYWJTdG9wID0gZWxlbWVudDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gU0hJRlQgKyBUQUJcclxuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RUYWJTdG9wKSB7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRBQlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0VGFiU3RvcCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gRVNDQVBFXHJcbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XHJcbiAgICAgIHRvZ2dsZU5hdi5jYWxsKHRoaXMsIGZhbHNlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBlbmFibGUgKCkge1xyXG4gICAgICAgIC8vIEZvY3VzIGZpcnN0IGNoaWxkXHJcbiAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIC8vIExpc3RlbiBmb3IgYW5kIHRyYXAgdGhlIGtleWJvYXJkXHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVsZWFzZSAoKSB7XHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwVGFiS2V5KTtcclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmxldCBmb2N1c1RyYXA7XHJcblxyXG5jb25zdCB0b2dnbGVOYXYgPSBmdW5jdGlvbiAoYWN0aXZlKSB7XHJcbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgaWYgKHR5cGVvZiBhY3RpdmUgIT09ICdib29sZWFuJykge1xyXG4gICAgYWN0aXZlID0gIWlzQWN0aXZlKCk7XHJcbiAgfVxyXG4gIGJvZHkuY2xhc3NMaXN0LnRvZ2dsZShBQ1RJVkVfQ0xBU1MsIGFjdGl2ZSk7XHJcblxyXG4gIGZvckVhY2goc2VsZWN0KFRPR0dMRVMpLCBlbCA9PiB7XHJcbiAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKFZJU0lCTEVfQ0xBU1MsIGFjdGl2ZSk7XHJcbiAgfSk7XHJcbiAgaWYgKGFjdGl2ZSkge1xyXG4gICAgZm9jdXNUcmFwLmVuYWJsZSgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmb2N1c1RyYXAucmVsZWFzZSgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY2xvc2VCdXR0b24gPSBib2R5LnF1ZXJ5U2VsZWN0b3IoQ0xPU0VfQlVUVE9OKTtcclxuICBjb25zdCBtZW51QnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKE9QRU5FUlMpO1xyXG5cclxuICBpZiAoYWN0aXZlICYmIGNsb3NlQnV0dG9uKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBhY3RpdmF0ZWQsIHNvIGZvY3VzIG9uIHRoZSBjbG9zZSBidXR0b24sXHJcbiAgICAvLyB3aGljaCBpcyBqdXN0IGJlZm9yZSBhbGwgdGhlIG5hdiBlbGVtZW50cyBpbiB0aGUgdGFiIG9yZGVyLlxyXG4gICAgY2xvc2VCdXR0b24uZm9jdXMoKTtcclxuICB9IGVsc2UgaWYgKCFhY3RpdmUgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gY2xvc2VCdXR0b24gJiZcclxuICAgICAgICAgICAgIG1lbnVCdXR0b24pIHtcclxuICAgIC8vIFRoZSBtb2JpbGUgbmF2IHdhcyBqdXN0IGRlYWN0aXZhdGVkLCBhbmQgZm9jdXMgd2FzIG9uIHRoZSBjbG9zZVxyXG4gICAgLy8gYnV0dG9uLCB3aGljaCBpcyBubyBsb25nZXIgdmlzaWJsZS4gV2UgZG9uJ3Qgd2FudCB0aGUgZm9jdXMgdG9cclxuICAgIC8vIGRpc2FwcGVhciBpbnRvIHRoZSB2b2lkLCBzbyBmb2N1cyBvbiB0aGUgbWVudSBidXR0b24gaWYgaXQnc1xyXG4gICAgLy8gdmlzaWJsZSAodGhpcyBtYXkgaGF2ZSBiZWVuIHdoYXQgdGhlIHVzZXIgd2FzIGp1c3QgZm9jdXNlZCBvbixcclxuICAgIC8vIGlmIHRoZXkgdHJpZ2dlcmVkIHRoZSBtb2JpbGUgbmF2IGJ5IG1pc3Rha2UpLlxyXG4gICAgbWVudUJ1dHRvbi5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFjdGl2ZTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5hdmlnYXRpb247IiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBUT0dHTEVfQVRUUklCVVRFID0gJ2RhdGEtY29udHJvbHMnO1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgY2xpY2sgZnVuY3Rpb25hbGl0eSB0byByYWRpb2J1dHRvbiBjb2xsYXBzZSBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lckVsZW1lbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBSYWRpb1RvZ2dsZUdyb3VwKGNvbnRhaW5lckVsZW1lbnQpe1xyXG4gICAgdGhpcy5yYWRpb0dyb3VwID0gY29udGFpbmVyRWxlbWVudDtcclxuICAgIHRoaXMucmFkaW9FbHMgPSBudWxsO1xyXG4gICAgdGhpcy50YXJnZXRFbCA9IG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzXHJcbiAqL1xyXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCl7XHJcbiAgICB0aGlzLnJhZGlvRWxzID0gdGhpcy5yYWRpb0dyb3VwLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScpO1xyXG4gICAgaWYodGhpcy5yYWRpb0Vscy5sZW5ndGggPT09IDApe1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcmFkaW9idXR0b25zIGZvdW5kIGluIHJhZGlvYnV0dG9uIGdyb3VwLicpO1xyXG4gICAgfVxyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnJhZGlvRWxzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICB2YXIgcmFkaW8gPSB0aGlzLnJhZGlvRWxzWyBpIF07XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgYSA9IDA7IGEgPCB0aGF0LnJhZGlvRWxzLmxlbmd0aDsgYSsrICl7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnRvZ2dsZSh0aGF0LnJhZGlvRWxzWyBhIF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50b2dnbGUocmFkaW8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogVG9nZ2xlIHJhZGlvYnV0dG9uIGNvbnRlbnRcclxuICogQHBhcmFtIHtIVE1MSW5wdXRFbGVtZW50fSByYWRpb0lucHV0RWxlbWVudCBcclxuICovXHJcblJhZGlvVG9nZ2xlR3JvdXAucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uIChyYWRpb0lucHV0RWxlbWVudCl7XHJcbiAgICB2YXIgY29udGVudElkID0gcmFkaW9JbnB1dEVsZW1lbnQuZ2V0QXR0cmlidXRlKFRPR0dMRV9BVFRSSUJVVEUpO1xyXG4gICAgaWYoY29udGVudElkICE9PSBudWxsICYmIGNvbnRlbnRJZCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnRJZCAhPT0gXCJcIil7XHJcbiAgICAgICAgdmFyIGNvbnRlbnRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250ZW50SWQpO1xyXG4gICAgICAgIGlmKGNvbnRlbnRFbGVtZW50ID09PSBudWxsIHx8IGNvbnRlbnRFbGVtZW50ID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHBhbmVsIGVsZW1lbnQuIFZlcmlmeSB2YWx1ZSBvZiBhdHRyaWJ1dGUgYCsgVE9HR0xFX0FUVFJJQlVURSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHJhZGlvSW5wdXRFbGVtZW50LmNoZWNrZWQpe1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChyYWRpb0lucHV0RWxlbWVudCwgY29udGVudEVsZW1lbnQpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmNvbGxhcHNlKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogRXhwYW5kIHJhZGlvIGJ1dHRvbiBjb250ZW50XHJcbiAqIEBwYXJhbSB7fSByYWRpb0lucHV0RWxlbWVudCBSYWRpbyBJbnB1dCBlbGVtZW50XHJcbiAqIEBwYXJhbSB7Kn0gY29udGVudEVsZW1lbnQgQ29udGVudCBlbGVtZW50XHJcbiAqL1xyXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS5leHBhbmQgPSBmdW5jdGlvbiAocmFkaW9JbnB1dEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KXtcclxuICAgIGlmKHJhZGlvSW5wdXRFbGVtZW50ICE9PSBudWxsICYmIHJhZGlvSW5wdXRFbGVtZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudEVsZW1lbnQgIT09IG51bGwgJiYgY29udGVudEVsZW1lbnQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLnJhZGlvLmV4cGFuZGVkJyk7XHJcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBDb2xsYXBzZSByYWRpbyBidXR0b24gY29udGVudFxyXG4gKiBAcGFyYW0ge30gcmFkaW9JbnB1dEVsZW1lbnQgUmFkaW8gSW5wdXQgZWxlbWVudFxyXG4gKiBAcGFyYW0geyp9IGNvbnRlbnRFbGVtZW50IENvbnRlbnQgZWxlbWVudFxyXG4gKi9cclxuUmFkaW9Ub2dnbGVHcm91cC5wcm90b3R5cGUuY29sbGFwc2UgPSBmdW5jdGlvbihyYWRpb0lucHV0RWxlbWVudCwgY29udGVudEVsZW1lbnQpe1xyXG4gICAgaWYocmFkaW9JbnB1dEVsZW1lbnQgIT09IG51bGwgJiYgcmFkaW9JbnB1dEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICByYWRpb0lucHV0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICBjb250ZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLnJhZGlvLmNvbGxhcHNlZCcpO1xyXG4gICAgICAgIHJhZGlvSW5wdXRFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJhZGlvVG9nZ2xlR3JvdXA7IiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBtb2RpZmllclN0YXRlID0ge1xyXG4gIHNoaWZ0OiBmYWxzZSxcclxuICBhbHQ6IGZhbHNlLFxyXG4gIGN0cmw6IGZhbHNlLFxyXG4gIGNvbW1hbmQ6IGZhbHNlXHJcbn07XHJcbi8qXHJcbiogUHJldmVudHMgdGhlIHVzZXIgZnJvbSBpbnB1dHRpbmcgYmFzZWQgb24gYSByZWdleC5cclxuKiBEb2VzIG5vdCB3b3JrIHRoZSBzYW1lIHdheSBhZiA8aW5wdXQgcGF0dGVybj1cIlwiPiwgdGhpcyBwYXR0ZXJuIGlzIG9ubHkgdXNlZCBmb3IgdmFsaWRhdGlvbiwgbm90IHRvIHByZXZlbnQgaW5wdXQuXHJcbiogVXNlY2FzZTogbnVtYmVyIGlucHV0IGZvciBkYXRlLWNvbXBvbmVudC5cclxuKiBFeGFtcGxlIC0gbnVtYmVyIG9ubHk6IDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtaW5wdXQtcmVnZXg9XCJeXFxkKiRcIj5cclxuKi9cclxuY2xhc3MgSW5wdXRSZWdleE1hc2sge1xyXG4gIGNvbnN0cnVjdG9yIChlbGVtZW50KXtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCByZWdleE1hc2spO1xyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgcmVnZXhNYXNrKTtcclxuICB9XHJcbn1cclxudmFyIHJlZ2V4TWFzayA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIGlmKG1vZGlmaWVyU3RhdGUuY3RybCB8fCBtb2RpZmllclN0YXRlLmNvbW1hbmQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIG5ld0NoYXIgPSBudWxsO1xyXG4gIGlmKHR5cGVvZiBldmVudC5rZXkgIT09ICd1bmRlZmluZWQnKXtcclxuICAgIGlmKGV2ZW50LmtleS5sZW5ndGggPT09IDEpe1xyXG4gICAgICBuZXdDaGFyID0gZXZlbnQua2V5O1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZighZXZlbnQuY2hhckNvZGUpe1xyXG4gICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5rZXlDb2RlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld0NoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGV2ZW50LmNoYXJDb2RlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZhciByZWdleFN0ciA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWlucHV0LXJlZ2V4Jyk7XHJcblxyXG4gIGlmKGV2ZW50LnR5cGUgIT09IHVuZGVmaW5lZCAmJiBldmVudC50eXBlID09PSAncGFzdGUnKXtcclxuICAgIGNvbnNvbGUubG9nKCdwYXN0ZScpO1xyXG4gIH0gZWxzZXtcclxuICAgIHZhciBlbGVtZW50ID0gbnVsbDtcclxuICAgIGlmKGV2ZW50LnRhcmdldCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcclxuICAgIH1cclxuICAgIGlmKG5ld0NoYXIgIT09IG51bGwgJiYgZWxlbWVudCAhPT0gbnVsbCkge1xyXG4gICAgICBpZihuZXdDaGFyLmxlbmd0aCA+IDApe1xyXG4gICAgICAgIGxldCBuZXdWYWx1ZSA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgaWYoZWxlbWVudC50eXBlID09PSAnbnVtYmVyJyl7XHJcbiAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMudmFsdWU7Ly9Ob3RlIGlucHV0W3R5cGU9bnVtYmVyXSBkb2VzIG5vdCBoYXZlIC5zZWxlY3Rpb25TdGFydC9FbmQgKENocm9tZSkuXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMudmFsdWUuc2xpY2UoMCwgZWxlbWVudC5zZWxlY3Rpb25TdGFydCkgKyB0aGlzLnZhbHVlLnNsaWNlKGVsZW1lbnQuc2VsZWN0aW9uRW5kKSArIG5ld0NoYXI7IC8vcmVtb3ZlcyB0aGUgbnVtYmVycyBzZWxlY3RlZCBieSB0aGUgdXNlciwgdGhlbiBhZGRzIG5ldyBjaGFyLlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHIgPSBuZXcgUmVnRXhwKHJlZ2V4U3RyKTtcclxuICAgICAgICBpZihyLmV4ZWMobmV3VmFsdWUpID09PSBudWxsKXtcclxuICAgICAgICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBJbnB1dFJlZ2V4TWFzazsiLCIndXNlIHN0cmljdCc7XHJcbmxldCBkayA9IHtcclxuICBcInNlbGVjdF9yb3dcIjogXCJWw6ZsZyByw6Zra2VcIixcclxuICBcInVuc2VsZWN0X3Jvd1wiOiBcIkZyYXbDpmxnIHLDpmtrZVwiLFxyXG4gIFwic2VsZWN0X2FsbF9yb3dzXCI6IFwiVsOmbGcgYWxsZSByw6Zra2VyXCIsXHJcbiAgXCJ1bnNlbGVjdF9hbGxfcm93c1wiOiBcIkZyYXbDpmxnIGFsbGUgcsOma2tlclwiXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICogQHBhcmFtIHtIVE1MVGFibGVFbGVtZW50fSB0YWJsZSBUYWJsZSBFbGVtZW50XHJcbiAqIEBwYXJhbSB7SlNPTn0gc3RyaW5ncyBUcmFuc2xhdGUgbGFiZWxzOiB7XCJzZWxlY3Rfcm93XCI6IFwiVsOmbGcgcsOma2tlXCIsIFwidW5zZWxlY3Rfcm93XCI6IFwiRnJhdsOmbGcgcsOma2tlXCIsIFwic2VsZWN0X2FsbF9yb3dzXCI6IFwiVsOmbGcgYWxsZSByw6Zra2VyXCIsIFwidW5zZWxlY3RfYWxsX3Jvd3NcIjogXCJGcmF2w6ZsZyBhbGxlIHLDpmtrZXJcIn1cclxuICovXHJcbmZ1bmN0aW9uIFRhYmxlU2VsZWN0YWJsZVJvd3MgKHRhYmxlLCBzdHJpbmdzID0gZGspe1xyXG4gIHRoaXMudGFibGUgPSB0YWJsZTtcclxuICBkayA9IHN0cmluZ3M7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIGV2ZW50bGlzdGVuZXJzIGZvciBjaGVja2JveGVzIGluIHRhYmxlXHJcbiAqL1xyXG5UYWJsZVNlbGVjdGFibGVSb3dzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLmdyb3VwQ2hlY2tib3ggPSB0aGlzLmdldEdyb3VwQ2hlY2tib3goKTtcclxuICB0aGlzLnRib2R5Q2hlY2tib3hMaXN0ID0gdGhpcy5nZXRDaGVja2JveExpc3QoKTtcclxuICBpZih0aGlzLnRib2R5Q2hlY2tib3hMaXN0Lmxlbmd0aCAhPT0gMCl7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgdGhpcy50Ym9keUNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGxldCBjaGVja2JveCA9IHRoaXMudGJvZHlDaGVja2JveExpc3RbY107XHJcbiAgICAgIGNoZWNrYm94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUdyb3VwQ2hlY2spO1xyXG4gICAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVHcm91cENoZWNrKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYodGhpcy5ncm91cENoZWNrYm94ICE9PSBmYWxzZSl7XHJcbiAgICB0aGlzLmdyb3VwQ2hlY2tib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlQ2hlY2tib3hMaXN0KTtcclxuICAgIHRoaXMuZ3JvdXBDaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVDaGVja2JveExpc3QpO1xyXG4gIH1cclxufVxyXG4gIFxyXG4vKipcclxuICogR2V0IGdyb3VwIGNoZWNrYm94IGluIHRhYmxlIGhlYWRlclxyXG4gKiBAcmV0dXJucyBlbGVtZW50IG9uIHRydWUgLSBmYWxzZSBpZiBub3QgZm91bmRcclxuICovXHJcblRhYmxlU2VsZWN0YWJsZVJvd3MucHJvdG90eXBlLmdldEdyb3VwQ2hlY2tib3ggPSBmdW5jdGlvbigpe1xyXG4gIGxldCBjaGVja2JveCA9IHRoaXMudGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoZWFkJylbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybS1jaGVja2JveCcpO1xyXG4gIGlmKGNoZWNrYm94Lmxlbmd0aCA9PT0gMCl7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHJldHVybiBjaGVja2JveFswXTtcclxufVxyXG4vKipcclxuICogR2V0IHRhYmxlIGJvZHkgY2hlY2tib3hlc1xyXG4gKiBAcmV0dXJucyBIVE1MQ29sbGVjdGlvblxyXG4gKi9cclxuVGFibGVTZWxlY3RhYmxlUm93cy5wcm90b3R5cGUuZ2V0Q2hlY2tib3hMaXN0ID0gZnVuY3Rpb24oKXtcclxuICByZXR1cm4gdGhpcy50YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGJvZHknKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmb3JtLWNoZWNrYm94Jyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgY2hlY2tib3hlcyBpbiB0YWJsZSBib2R5IHdoZW4gZ3JvdXAgY2hlY2tib3ggaXMgY2hhbmdlZFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIFxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlQ2hlY2tib3hMaXN0KGUpe1xyXG4gIGxldCBjaGVja2JveCA9IGUudGFyZ2V0O1xyXG4gIGNoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgbGV0IHRhYmxlID0gZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICBsZXQgdGFibGVTZWxlY3RhYmxlUm93cyA9IG5ldyBUYWJsZVNlbGVjdGFibGVSb3dzKHRhYmxlKTtcclxuICBsZXQgY2hlY2tib3hMaXN0ID0gdGFibGVTZWxlY3RhYmxlUm93cy5nZXRDaGVja2JveExpc3QoKTtcclxuICBsZXQgY2hlY2tlZE51bWJlciA9IDA7XHJcbiAgaWYoY2hlY2tib3guY2hlY2tlZCl7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICBjaGVja2JveExpc3RbY10ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3RhYmxlLXJvdy1zZWxlY3RlZCcpO1xyXG4gICAgICBjaGVja2JveExpc3RbY10ubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnVuc2VsZWN0X3Jvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tlZE51bWJlciA9IGNoZWNrYm94TGlzdC5sZW5ndGg7XHJcbiAgICBjaGVja2JveC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsudW5zZWxlY3RfYWxsX3Jvd3MpO1xyXG4gIH0gZWxzZXtcclxuICAgIGZvcihsZXQgYyA9IDA7IGMgPCBjaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xyXG4gICAgICBjaGVja2JveExpc3RbY10uY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICBjaGVja2JveExpc3RbY10ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ3RhYmxlLXJvdy1zZWxlY3RlZCcpO1xyXG4gICAgICBjaGVja2JveExpc3RbY10ubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnNlbGVjdF9yb3cpO1xyXG4gICAgfVxyXG4gICAgY2hlY2tib3gubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnNlbGVjdF9hbGxfcm93cyk7XHJcbiAgfVxyXG4gIFxyXG4gIGNvbnN0IGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZmRzLnRhYmxlLnNlbGVjdGFibGUudXBkYXRlZFwiLCB7XHJcbiAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgIGRldGFpbDoge2NoZWNrZWROdW1iZXJ9XHJcbiAgfSk7XHJcbiAgdGFibGUuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgZ3JvdXAgY2hlY2tib3ggd2hlbiBjaGVja2JveCBpbiB0YWJsZSBib2R5IGlzIGNoYW5nZWRcclxuICogQHBhcmFtIHtFdmVudH0gZSBcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZUdyb3VwQ2hlY2soZSl7XHJcbiAgLy8gdXBkYXRlIGxhYmVsIGZvciBldmVudCBjaGVja2JveFxyXG4gIGlmKGUudGFyZ2V0LmNoZWNrZWQpe1xyXG4gICAgZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3RhYmxlLXJvdy1zZWxlY3RlZCcpO1xyXG4gICAgZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnVuc2VsZWN0X3Jvdyk7XHJcbiAgfSBlbHNle1xyXG4gICAgZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5yZW1vdmUoJ3RhYmxlLXJvdy1zZWxlY3RlZCcpO1xyXG4gICAgZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnNlbGVjdF9yb3cpO1xyXG4gIH1cclxuICBsZXQgdGFibGUgPSBlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIGxldCB0YWJsZVNlbGVjdGFibGVSb3dzID0gbmV3IFRhYmxlU2VsZWN0YWJsZVJvd3ModGFibGUpO1xyXG4gIGxldCBncm91cENoZWNrYm94ID0gdGFibGVTZWxlY3RhYmxlUm93cy5nZXRHcm91cENoZWNrYm94KCk7XHJcbiAgaWYoZ3JvdXBDaGVja2JveCAhPT0gZmFsc2Upe1xyXG4gICAgbGV0IGNoZWNrYm94TGlzdCA9IHRhYmxlU2VsZWN0YWJsZVJvd3MuZ2V0Q2hlY2tib3hMaXN0KCk7XHJcblxyXG4gICAgLy8gaG93IG1hbnkgcm93IGhhcyBiZWVuIHNlbGVjdGVkXHJcbiAgICBsZXQgY2hlY2tlZE51bWJlciA9IDA7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgbGV0IGxvb3BlZENoZWNrYm94ID0gY2hlY2tib3hMaXN0W2NdO1xyXG4gICAgICBpZihsb29wZWRDaGVja2JveC5jaGVja2VkKXtcclxuICAgICAgICBjaGVja2VkTnVtYmVyKys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYoY2hlY2tlZE51bWJlciA9PT0gY2hlY2tib3hMaXN0Lmxlbmd0aCl7IC8vIGlmIGFsbCByb3dzIGhhcyBiZWVuIHNlbGVjdGVkXHJcbiAgICAgIGdyb3VwQ2hlY2tib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsudW5zZWxlY3RfYWxsX3Jvd3MpO1xyXG4gICAgfSBlbHNlIGlmKGNoZWNrZWROdW1iZXIgPT0gMCl7IC8vIGlmIG5vIHJvd3MgaGFzIGJlZW4gc2VsZWN0ZWRcclxuICAgICAgZ3JvdXBDaGVja2JveC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcpO1xyXG4gICAgICBncm91cENoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5uZXh0RWxlbWVudFNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgZGsuc2VsZWN0X2FsbF9yb3dzKTtcclxuICAgIH0gZWxzZXsgLy8gaWYgc29tZSBidXQgbm90IGFsbCByb3dzIGhhcyBiZWVuIHNlbGVjdGVkXHJcbiAgICAgIGdyb3VwQ2hlY2tib3guc2V0QXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnLCAnbWl4ZWQnKTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3gubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnNlbGVjdF9hbGxfcm93cyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImZkcy50YWJsZS5zZWxlY3RhYmxlLnVwZGF0ZWRcIiwge1xyXG4gICAgICBidWJibGVzOiB0cnVlLFxyXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgICBkZXRhaWw6IHtjaGVja2VkTnVtYmVyfVxyXG4gICAgfSk7XHJcbiAgICB0YWJsZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRhYmxlU2VsZWN0YWJsZVJvd3M7IiwiY29uc3Qgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XHJcblxyXG4vKipcclxuICogU2V0IGRhdGEtdGl0bGUgb24gY2VsbHMsIHdoZXJlIHRoZSBhdHRyaWJ1dGUgaXMgbWlzc2luZ1xyXG4gKi9cclxuY2xhc3MgUmVzcG9uc2l2ZVRhYmxlIHtcclxuICAgIGNvbnN0cnVjdG9yICh0YWJsZSkge1xyXG4gICAgICBpbnNlcnRIZWFkZXJBc0F0dHJpYnV0ZXModGFibGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIGRhdGEgYXR0cmlidXRlcyBuZWVkZWQgZm9yIHJlc3BvbnNpdmUgbW9kZS5cclxuICogQHBhcmFtIHtIVE1MVGFibGVFbGVtZW50fSB0YWJsZUVsIFRhYmxlIGVsZW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGluc2VydEhlYWRlckFzQXR0cmlidXRlcyAodGFibGVFbCl7XHJcbiAgaWYgKCF0YWJsZUVsKSByZXR1cm47XHJcblxyXG4gIGxldCBoZWFkZXIgPSAgdGFibGVFbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGhlYWQnKTtcclxuICBpZihoZWFkZXIubGVuZ3RoICE9PSAwKSB7XHJcbiAgICBsZXQgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclsgMCBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aCcpO1xyXG4gICAgaWYgKGhlYWRlckNlbGxFbHMubGVuZ3RoID09IDApIHtcclxuICAgICAgaGVhZGVyQ2VsbEVscyA9IGhlYWRlclsgMCBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0ZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChoZWFkZXJDZWxsRWxzLmxlbmd0aCkge1xyXG4gICAgICBjb25zdCBib2R5Um93RWxzID0gc2VsZWN0KCd0Ym9keSB0cicsIHRhYmxlRWwpO1xyXG4gICAgICBBcnJheS5mcm9tKGJvZHlSb3dFbHMpLmZvckVhY2gocm93RWwgPT4ge1xyXG4gICAgICAgIGxldCBjZWxsRWxzID0gcm93RWwuY2hpbGRyZW47XHJcbiAgICAgICAgaWYgKGNlbGxFbHMubGVuZ3RoID09PSBoZWFkZXJDZWxsRWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgQXJyYXkuZnJvbShoZWFkZXJDZWxsRWxzKS5mb3JFYWNoKChoZWFkZXJDZWxsRWwsIGkpID0+IHtcclxuICAgICAgICAgICAgLy8gR3JhYiBoZWFkZXIgY2VsbCB0ZXh0IGFuZCB1c2UgaXQgYm9keSBjZWxsIGRhdGEgdGl0bGUuXHJcbiAgICAgICAgICAgIGlmKCFjZWxsRWxzWyBpIF0uaGFzQXR0cmlidXRlKCdkYXRhLXRpdGxlJykgKXtcclxuICAgICAgICAgICAgICBjZWxsRWxzWyBpIF0uc2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJywgaGVhZGVyQ2VsbEVsLnRleHRDb250ZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNpdmVUYWJsZTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgYnJlYWtwb2ludHMgPSB7XHJcbiAgJ3hzJzogMCxcclxuICAnc20nOiA1NzYsXHJcbiAgJ21kJzogNzY4LFxyXG4gICdsZyc6IDk5MixcclxuICAneGwnOiAxMjAwXHJcbn07XHJcblxyXG4vLyBGb3IgZWFzeSByZWZlcmVuY2VcclxudmFyIGtleXMgPSB7XHJcbiAgZW5kOiAzNSxcclxuICBob21lOiAzNixcclxuICBsZWZ0OiAzNyxcclxuICB1cDogMzgsXHJcbiAgcmlnaHQ6IDM5LFxyXG4gIGRvd246IDQwLFxyXG4gIGRlbGV0ZTogNDZcclxufTtcclxuXHJcbi8vIEFkZCBvciBzdWJzdHJhY3QgZGVwZW5kaW5nIG9uIGtleSBwcmVzc2VkXHJcbnZhciBkaXJlY3Rpb24gPSB7XHJcbiAgMzc6IC0xLFxyXG4gIDM4OiAtMSxcclxuICAzOTogMSxcclxuICA0MDogMVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIHRhYm5hdiBjb21wb25lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFibmF2IFRhYm5hdiBjb250YWluZXJcclxuICovXHJcbmZ1bmN0aW9uIFRhYm5hdiAodGFibmF2KSB7XHJcbiAgdGhpcy50YWJuYXYgPSB0YWJuYXY7XHJcbiAgdGhpcy50YWJzID0gdGhpcy50YWJuYXYucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLnRhYm5hdi1pdGVtJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnQgb24gY29tcG9uZW50XHJcbiAqL1xyXG5UYWJuYXYucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gIGlmKHRoaXMudGFicy5sZW5ndGggPT09IDApe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBUYWJuYXYgSFRNTCBzZWVtcyB0byBiZSBtaXNzaW5nIHRhYm5hdi1pdGVtLiBBZGQgdGFibmF2IGl0ZW1zIHRvIGVuc3VyZSBlYWNoIHBhbmVsIGhhcyBhIGJ1dHRvbiBpbiB0aGUgdGFibmF2cyBuYXZpZ2F0aW9uLmApO1xyXG4gIH1cclxuXHJcbiAgLy8gaWYgbm8gaGFzaCBpcyBzZXQgb24gbG9hZCwgc2V0IGFjdGl2ZSB0YWJcclxuICBpZiAoIXNldEFjdGl2ZUhhc2hUYWIoKSkge1xyXG4gICAgLy8gc2V0IGZpcnN0IHRhYiBhcyBhY3RpdmVcclxuICAgIGxldCB0YWIgPSB0aGlzLnRhYnNbIDAgXTtcclxuXHJcbiAgICAvLyBjaGVjayBubyBvdGhlciB0YWJzIGFzIGJlZW4gc2V0IGF0IGRlZmF1bHRcclxuICAgIGxldCBhbHJlYWR5QWN0aXZlID0gZ2V0QWN0aXZlVGFicyh0aGlzLnRhYm5hdik7XHJcbiAgICBpZiAoYWxyZWFkeUFjdGl2ZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGFiID0gYWxyZWFkeUFjdGl2ZVsgMCBdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGFjdGl2YXRlIGFuZCBkZWFjdGl2YXRlIHRhYnNcclxuICAgIHRoaXMuYWN0aXZhdGVUYWIodGFiLCBmYWxzZSk7XHJcbiAgfVxyXG4gIGxldCAkbW9kdWxlID0gdGhpcztcclxuICAvLyBhZGQgZXZlbnRsaXN0ZW5lcnMgb24gYnV0dG9uc1xyXG4gIGZvcihsZXQgdCA9IDA7IHQgPCB0aGlzLnRhYnMubGVuZ3RoOyB0ICsrKXtcclxuICAgIHRoaXMudGFic1sgdCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXskbW9kdWxlLmFjdGl2YXRlVGFiKHRoaXMsIGZhbHNlKX0pO1xyXG4gICAgdGhpcy50YWJzWyB0IF0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd25FdmVudExpc3RlbmVyKTtcclxuICAgIHRoaXMudGFic1sgdCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywga2V5dXBFdmVudExpc3RlbmVyKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKipcclxuICogU2hvdyB0YWIgYW5kIGhpZGUgb3RoZXJzXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IHRhYiBidXR0b24gZWxlbWVudFxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNldEZvY3VzIFRydWUgaWYgdGFiIGJ1dHRvbiBzaG91bGQgYmUgZm9jdXNlZFxyXG4gKi9cclxuIFRhYm5hdi5wcm90b3R5cGUuYWN0aXZhdGVUYWIgPSBmdW5jdGlvbih0YWIsIHNldEZvY3VzKSB7XHJcbiAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhYik7XHJcblxyXG4gIC8vIGNsb3NlIGFsbCB0YWJzIGV4Y2VwdCBzZWxlY3RlZFxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50YWJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAodGFic1sgaSBdID09PSB0YWIpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhYnNbIGkgXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMudGFibmF2LmNsb3NlJyk7XHJcbiAgICAgIHRhYnNbIGkgXS5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHRhYnNbIGkgXS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XHJcbiAgICB0YWJzWyBpIF0uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XHJcbiAgICBsZXQgdGFicGFuZWxJRCA9IHRhYnNbIGkgXS5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKTtcclxuICAgIGxldCB0YWJwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhYnBhbmVsSUQpXHJcbiAgICBpZih0YWJwYW5lbCA9PT0gbnVsbCl7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgdGFicGFuZWwuYCk7XHJcbiAgICB9XHJcbiAgICB0YWJwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICB9XHJcbiAgXHJcbiAgLy8gU2V0IHNlbGVjdGVkIHRhYiB0byBhY3RpdmVcclxuICBsZXQgdGFicGFuZWxJRCA9IHRhYi5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKTtcclxuICBsZXQgdGFicGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YWJwYW5lbElEKTtcclxuICBpZih0YWJwYW5lbCA9PT0gbnVsbCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGFjY29yZGlvbiBwYW5lbC5gKTtcclxuICB9XHJcblxyXG4gIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xyXG4gIHRhYnBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICB0YWIucmVtb3ZlQXR0cmlidXRlKCd0YWJpbmRleCcpO1xyXG5cclxuICAvLyBTZXQgZm9jdXMgd2hlbiByZXF1aXJlZFxyXG4gIGlmIChzZXRGb2N1cykge1xyXG4gICAgdGFiLmZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICBsZXQgZXZlbnRDaGFuZ2VkID0gbmV3IEV2ZW50KCdmZHMudGFibmF2LmNoYW5nZWQnKTtcclxuICB0YWIucGFyZW50Tm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50Q2hhbmdlZCk7XHJcblxyXG4gIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy50YWJuYXYub3BlbicpO1xyXG4gIHRhYi5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQga2V5ZG93biBldmVudHMgdG8gdGFibmF2IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IFxyXG4gKi9cclxuZnVuY3Rpb24ga2V5ZG93bkV2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIHN3aXRjaCAoa2V5KSB7XHJcbiAgICBjYXNlIGtleXMuZW5kOlxyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAvLyBBY3RpdmF0ZSBsYXN0IHRhYlxyXG4gICAgICBmb2N1c0xhc3RUYWIoZXZlbnQudGFyZ2V0KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGtleXMuaG9tZTpcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gQWN0aXZhdGUgZmlyc3QgdGFiXHJcbiAgICAgIGZvY3VzRmlyc3RUYWIoZXZlbnQudGFyZ2V0KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICAvLyBVcCBhbmQgZG93biBhcmUgaW4ga2V5ZG93blxyXG4gICAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIHByZXZlbnQgcGFnZSBzY3JvbGwgPjopXHJcbiAgICBjYXNlIGtleXMudXA6XHJcbiAgICBjYXNlIGtleXMuZG93bjpcclxuICAgICAgZGV0ZXJtaW5lT3JpZW50YXRpb24oZXZlbnQpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQga2V5dXAgZXZlbnRzIHRvIHRhYm5hdiBjb21wb25lbnRcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCBcclxuICovXHJcbmZ1bmN0aW9uIGtleXVwRXZlbnRMaXN0ZW5lciAoZXZlbnQpIHtcclxuICBsZXQga2V5ID0gZXZlbnQua2V5Q29kZTtcclxuXHJcbiAgc3dpdGNoIChrZXkpIHtcclxuICAgIGNhc2Uga2V5cy5sZWZ0OlxyXG4gICAgY2FzZSBrZXlzLnJpZ2h0OlxyXG4gICAgICBkZXRlcm1pbmVPcmllbnRhdGlvbihldmVudCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmRlbGV0ZTpcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIGtleXMuZW50ZXI6XHJcbiAgICBjYXNlIGtleXMuc3BhY2U6XHJcbiAgICAgIG5ldyBUYWJuYXYoZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUpLmFjdGl2YXRlVGFiKGV2ZW50LnRhcmdldCwgdHJ1ZSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFdoZW4gYSB0YWJsaXN0IGFyaWEtb3JpZW50YXRpb24gaXMgc2V0IHRvIHZlcnRpY2FsLFxyXG4gKiBvbmx5IHVwIGFuZCBkb3duIGFycm93IHNob3VsZCBmdW5jdGlvbi5cclxuICogSW4gYWxsIG90aGVyIGNhc2VzIG9ubHkgbGVmdCBhbmQgcmlnaHQgYXJyb3cgZnVuY3Rpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiBkZXRlcm1pbmVPcmllbnRhdGlvbiAoZXZlbnQpIHtcclxuICBsZXQga2V5ID0gZXZlbnQua2V5Q29kZTtcclxuXHJcbiAgbGV0IHc9d2luZG93LFxyXG4gICAgZD1kb2N1bWVudCxcclxuICAgIGU9ZC5kb2N1bWVudEVsZW1lbnQsXHJcbiAgICBnPWQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLFxyXG4gICAgeD13LmlubmVyV2lkdGh8fGUuY2xpZW50V2lkdGh8fGcuY2xpZW50V2lkdGgsXHJcbiAgICB5PXcuaW5uZXJIZWlnaHR8fGUuY2xpZW50SGVpZ2h0fHxnLmNsaWVudEhlaWdodDtcclxuXHJcbiAgbGV0IHZlcnRpY2FsID0geCA8IGJyZWFrcG9pbnRzLm1kO1xyXG4gIGxldCBwcm9jZWVkID0gZmFsc2U7XHJcblxyXG4gIGlmICh2ZXJ0aWNhbCkge1xyXG4gICAgaWYgKGtleSA9PT0ga2V5cy51cCB8fCBrZXkgPT09IGtleXMuZG93bikge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBwcm9jZWVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBpZiAoa2V5ID09PSBrZXlzLmxlZnQgfHwga2V5ID09PSBrZXlzLnJpZ2h0KSB7XHJcbiAgICAgIHByb2NlZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAocHJvY2VlZCkge1xyXG4gICAgc3dpdGNoVGFiT25BcnJvd1ByZXNzKGV2ZW50KTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFaXRoZXIgZm9jdXMgdGhlIG5leHQsIHByZXZpb3VzLCBmaXJzdCwgb3IgbGFzdCB0YWJcclxuICogZGVwZW5kaW5nIG9uIGtleSBwcmVzc2VkXHJcbiAqL1xyXG5mdW5jdGlvbiBzd2l0Y2hUYWJPbkFycm93UHJlc3MgKGV2ZW50KSB7XHJcbiAgdmFyIHByZXNzZWQgPSBldmVudC5rZXlDb2RlO1xyXG4gIGlmIChkaXJlY3Rpb25bIHByZXNzZWQgXSkge1xyXG4gICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuICAgIGxldCB0YWJzID0gZ2V0QWxsVGFic0luTGlzdCh0YXJnZXQpO1xyXG4gICAgbGV0IGluZGV4ID0gZ2V0SW5kZXhPZkVsZW1lbnRJbkxpc3QodGFyZ2V0LCB0YWJzKTtcclxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRhYnNbIGluZGV4ICsgZGlyZWN0aW9uWyBwcmVzc2VkIF0gXSkge1xyXG4gICAgICAgIHRhYnNbIGluZGV4ICsgZGlyZWN0aW9uWyBwcmVzc2VkIF0gXS5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHByZXNzZWQgPT09IGtleXMubGVmdCB8fCBwcmVzc2VkID09PSBrZXlzLnVwKSB7XHJcbiAgICAgICAgZm9jdXNMYXN0VGFiKHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocHJlc3NlZCA9PT0ga2V5cy5yaWdodCB8fCBwcmVzc2VkID09IGtleXMuZG93bikge1xyXG4gICAgICAgIGZvY3VzRmlyc3RUYWIodGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBhbGwgYWN0aXZlIHRhYnMgaW4gbGlzdFxyXG4gKiBAcGFyYW0gdGFibmF2IHBhcmVudCAudGFibmF2IGVsZW1lbnRcclxuICogQHJldHVybnMgcmV0dXJucyBsaXN0IG9mIGFjdGl2ZSB0YWJzIGlmIGFueVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QWN0aXZlVGFicyAodGFibmF2KSB7XHJcbiAgcmV0dXJuIHRhYm5hdi5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24udGFibmF2LWl0ZW1bYXJpYS1zZWxlY3RlZD10cnVlXScpO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IGEgbGlzdCBvZiBhbGwgYnV0dG9uIHRhYnMgaW4gY3VycmVudCB0YWJsaXN0XHJcbiAqIEBwYXJhbSB0YWIgQnV0dG9uIHRhYiBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHsqfSByZXR1cm4gYXJyYXkgb2YgdGFic1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QWxsVGFic0luTGlzdCAodGFiKSB7XHJcbiAgbGV0IHBhcmVudE5vZGUgPSB0YWIucGFyZW50Tm9kZTtcclxuICBpZiAocGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ3RhYm5hdicpKSB7XHJcbiAgICByZXR1cm4gcGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24udGFibmF2LWl0ZW0nKTtcclxuICB9XHJcbiAgcmV0dXJuIFtdO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IGluZGV4IG9mIGVsZW1lbnQgaW4gbGlzdFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IFxyXG4gKiBAcGFyYW0ge0hUTUxDb2xsZWN0aW9ufSBsaXN0IFxyXG4gKiBAcmV0dXJucyB7aW5kZXh9XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRJbmRleE9mRWxlbWVudEluTGlzdCAoZWxlbWVudCwgbGlzdCl7XHJcbiAgbGV0IGluZGV4ID0gLTE7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrICl7XHJcbiAgICBpZihsaXN0WyBpIF0gPT09IGVsZW1lbnQpe1xyXG4gICAgICBpbmRleCA9IGk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGluZGV4O1xyXG59XHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIHRoZXJlIGlzIGEgdGFiIGhhc2ggaW4gdGhlIHVybCBhbmQgYWN0aXZhdGVzIHRoZSB0YWIgYWNjb3JkaW5nbHlcclxuICogQHJldHVybnMge2Jvb2xlYW59IHJldHVybnMgdHJ1ZSBpZiB0YWIgaGFzIGJlZW4gc2V0IC0gcmV0dXJucyBmYWxzZSBpZiBubyB0YWIgaGFzIGJlZW4gc2V0IHRvIGFjdGl2ZVxyXG4gKi9cclxuZnVuY3Rpb24gc2V0QWN0aXZlSGFzaFRhYiAoKSB7XHJcbiAgbGV0IGhhc2ggPSBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XHJcbiAgaWYgKGhhc2ggIT09ICcnKSB7XHJcbiAgICBsZXQgdGFiID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uLnRhYm5hdi1pdGVtW2FyaWEtY29udHJvbHM9XCIjJyArIGhhc2ggKyAnXCJdJyk7XHJcbiAgICBpZiAodGFiICE9PSBudWxsKSB7XHJcbiAgICAgIGFjdGl2YXRlVGFiKHRhYiwgZmFsc2UpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IGZpcnN0IHRhYiBieSB0YWIgaW4gbGlzdFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB0YWIgXHJcbiAqL1xyXG5mdW5jdGlvbiBmb2N1c0ZpcnN0VGFiICh0YWIpIHtcclxuICBnZXRBbGxUYWJzSW5MaXN0KHRhYilbIDAgXS5mb2N1cygpO1xyXG59XHJcblxyXG4vKipcclxuICogR2V0IGxhc3QgdGFiIGJ5IHRhYiBpbiBsaXN0XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IHRhYiBcclxuICovXHJcbmZ1bmN0aW9uIGZvY3VzTGFzdFRhYiAodGFiKSB7XHJcbiAgbGV0IHRhYnMgPSBnZXRBbGxUYWJzSW5MaXN0KHRhYik7XHJcbiAgdGFic1sgdGFicy5sZW5ndGggLSAxIF0uZm9jdXMoKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGFibmF2OyIsIid1c2Ugc3RyaWN0JztcclxuLyoqXHJcbiAqIFNob3cvaGlkZSB0b2FzdCBjb21wb25lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBcclxuICovXHJcbmZ1bmN0aW9uIFRvYXN0IChlbGVtZW50KXtcclxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTaG93IHRvYXN0XHJcbiAqL1xyXG5Ub2FzdC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3dpbmcnKTtcclxuICAgIHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b2FzdC1jbG9zZScpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBsZXQgdG9hc3QgPSB0aGlzLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICAgICAgICBuZXcgVG9hc3QodG9hc3QpLmhpZGUoKTtcclxuICAgIH0pO1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHNob3dUb2FzdCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIaWRlIHRvYXN0XHJcbiAqL1xyXG5Ub2FzdC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTsgICAgICAgICBcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZHMgY2xhc3NlcyB0byBtYWtlIHNob3cgYW5pbWF0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBzaG93VG9hc3QoKXtcclxuICAgIGxldCB0b2FzdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudG9hc3Quc2hvd2luZycpO1xyXG4gICAgZm9yKGxldCB0ID0gMDsgdCA8IHRvYXN0cy5sZW5ndGg7IHQrKyl7XHJcbiAgICAgICAgbGV0IHRvYXN0ID0gdG9hc3RzW3RdO1xyXG4gICAgICAgIHRvYXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3dpbmcnKTtcclxuICAgICAgICB0b2FzdC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRvYXN0OyIsIid1c2Ugc3RyaWN0JztcclxuLyoqXHJcbiAqIFNldCB0b29sdGlwIG9uIGVsZW1lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdoaWNoIGhhcyB0b29sdGlwXHJcbiAqL1xyXG5mdW5jdGlvbiBUb29sdGlwKGVsZW1lbnQpe1xyXG4gIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgaWYodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwJykgPT09IG51bGwpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBUb29sdGlwIHRleHQgaXMgbWlzc2luZy4gQWRkIGF0dHJpYnV0ZSBkYXRhLXRvb2x0aXAgYW5kIHRoZSBjb250ZW50IG9mIHRoZSB0b29sdGlwIGFzIHZhbHVlLmApO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudGxpc3RlbmVyc1xyXG4gKi9cclxuVG9vbHRpcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpe1xyXG4gIGxldCBtb2R1bGUgPSB0aGlzO1xyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBsZXQgdHJpZ2dlciA9IGUudGFyZ2V0O1xyXG4gICAgICBpZih0cmlnZ2VyLmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1ob3ZlcicpID09PSBmYWxzZSAmJiB0cmlnZ2VyLmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1mb2N1cycpID09PSBmYWxzZSl7XHJcbiAgICAgICAgY2xvc2VBbGxUb29sdGlwcyhlKTtcclxuICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5hZGQoXCJ0b29sdGlwLWhvdmVyXCIpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgXHJcbiAgICAgICAgICBpZih0cmlnZ2VyLmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1ob3ZlcicpKXtcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGFkZFRvb2x0aXAoZWxlbWVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMzAwKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBsZXQgdHJpZ2dlciA9IGUudGFyZ2V0O1xyXG4gICAgICBpZih0cmlnZ2VyLmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1ob3ZlcicpKXtcclxuICAgICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgICAgICB2YXIgdG9vbHRpcElkID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTsgXHJcbiAgICAgICAgbGV0IHRvb2x0aXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcElkKTtcclxuICAgICAgICBpZih0b29sdGlwRWxlbWVudCAhPT0gbnVsbCl7XHJcbiAgICAgICAgICBjbG9zZUhvdmVyVG9vbHRpcCh0cmlnZ2VyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgdmFyIGtleSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XHJcbiAgICAgIGlmIChrZXkgPT09IDI3KSB7XHJcbiAgICAgICAgdmFyIHRvb2x0aXAgPSB0aGlzLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICAgIGlmKHRvb2x0aXAgIT09IG51bGwgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcCkgIT09IG51bGwpe1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBcclxuICBpZih0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtdHJpZ2dlcicpID09PSAnY2xpY2snKXtcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciB0cmlnZ2VyID0gZS50YXJnZXQ7XHJcbiAgICAgIGNsb3NlQWxsVG9vbHRpcHMoZSk7XHJcbiAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LmFkZCgndG9vbHRpcC1mb2N1cycpO1xyXG4gICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICAgICAgaWYgKHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JykgIT09IG51bGwpIHJldHVybjtcclxuICAgICAgYWRkVG9vbHRpcCh0cmlnZ2VyKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBcclxuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VBbGxUb29sdGlwcyk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlQWxsVG9vbHRpcHMpO1xyXG59O1xyXG4vKipcclxuICogQ2xvc2UgYWxsIHRvb2x0aXBzXHJcbiAqL1xyXG5mdW5jdGlvbiBjbG9zZUFsbCAoKXtcclxuICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdG9vbHRpcFthcmlhLWRlc2NyaWJlZGJ5XScpO1xyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHBvcHBlciA9IGVsZW1lbnRzWyBpIF0uZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICBlbGVtZW50c1sgaSBdLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwb3BwZXIpKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFRvb2x0aXAodHJpZ2dlcil7XHJcbiAgdmFyIHBvcyA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAtcG9zaXRpb24nKSB8fCAndG9wJztcclxuXHJcbiAgdmFyIHRvb2x0aXAgPSBjcmVhdGVUb29sdGlwKHRyaWdnZXIsIHBvcyk7XHJcblxyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodG9vbHRpcCk7XHJcblxyXG4gIHBvc2l0aW9uQXQodHJpZ2dlciwgdG9vbHRpcCwgcG9zKTtcclxufVxyXG4vKipcclxuICogQ3JlYXRlIHRvb2x0aXAgZWxlbWVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IEVsZW1lbnQgd2hpY2ggdGhlIHRvb2x0aXAgaXMgYXR0YWNoZWRcclxuICogQHBhcmFtIHtzdHJpbmd9IHBvcyBQb3NpdGlvbiBvZiB0b29sdGlwICh0b3AgfCBib3R0b20pXHJcbiAqIEByZXR1cm5zIFxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlVG9vbHRpcCAoZWxlbWVudCwgcG9zKSB7XHJcbiAgdmFyIHRvb2x0aXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICB0b29sdGlwLmNsYXNzTmFtZSA9ICd0b29sdGlwLXBvcHBlcic7XHJcbiAgdmFyIHBvcHBlcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLXBvcHBlcicpO1xyXG4gIHZhciBpZCA9ICd0b29sdGlwLScrcG9wcGVycy5sZW5ndGgrMTtcclxuICB0b29sdGlwLnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7XHJcbiAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndG9vbHRpcCcpO1xyXG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCd4LXBsYWNlbWVudCcsIHBvcyk7XHJcbiAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBpZCk7XHJcblxyXG4gIHZhciB0b29sdGlwSW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICB0b29sdGlwSW5uZXIuY2xhc3NOYW1lID0gJ3Rvb2x0aXAnO1xyXG5cclxuICB2YXIgdG9vbHRpcEFycm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgdG9vbHRpcEFycm93LmNsYXNzTmFtZSA9ICd0b29sdGlwLWFycm93JztcclxuICB0b29sdGlwSW5uZXIuYXBwZW5kQ2hpbGQodG9vbHRpcEFycm93KTtcclxuXHJcbiAgdmFyIHRvb2x0aXBDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgdG9vbHRpcENvbnRlbnQuY2xhc3NOYW1lID0gJ3Rvb2x0aXAtY29udGVudCc7XHJcbiAgdG9vbHRpcENvbnRlbnQuaW5uZXJIVE1MID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcCcpO1xyXG4gIHRvb2x0aXBJbm5lci5hcHBlbmRDaGlsZCh0b29sdGlwQ29udGVudCk7XHJcbiAgdG9vbHRpcC5hcHBlbmRDaGlsZCh0b29sdGlwSW5uZXIpO1xyXG5cclxuICByZXR1cm4gdG9vbHRpcDtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBQb3NpdGlvbnMgdGhlIHRvb2x0aXAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBwYXJlbnQgLSBUaGUgdHJpZ2dlciBvZiB0aGUgdG9vbHRpcC5cclxuICogQHBhcmFtIHtvYmplY3R9IHRvb2x0aXAgLSBUaGUgdG9vbHRpcCBpdHNlbGYuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwb3NIb3Jpem9udGFsIC0gRGVzaXJlZCBob3Jpem9udGFsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKGxlZnQvY2VudGVyL3JpZ2h0KVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcG9zVmVydGljYWwgLSBEZXNpcmVkIHZlcnRpY2FsIHBvc2l0aW9uIG9mIHRoZSB0b29sdGlwIHJlbGF0aXZlbHkgdG8gdGhlIHRyaWdnZXIgKHRvcC9jZW50ZXIvYm90dG9tKVxyXG4gKlxyXG4gKi9cclxuIGZ1bmN0aW9uIHBvc2l0aW9uQXQgKHBhcmVudCwgdG9vbHRpcCwgcG9zKSB7XHJcbiAgbGV0IHRyaWdnZXIgPSBwYXJlbnQ7XHJcbiAgbGV0IGFycm93ID0gdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF07XHJcbiAgbGV0IHRyaWdnZXJQb3NpdGlvbiA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICBcclxuICB2YXIgcGFyZW50Q29vcmRzID0gcGFyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBsZWZ0LCB0b3A7XHJcblxyXG4gIHZhciB0b29sdGlwV2lkdGggPSB0b29sdGlwLm9mZnNldFdpZHRoO1xyXG5cclxuICB2YXIgZGlzdCA9IDEyO1xyXG4gIGxldCBhcnJvd0RpcmVjdGlvbiA9IFwiZG93blwiO1xyXG4gIGxlZnQgPSBwYXJzZUludChwYXJlbnRDb29yZHMubGVmdCkgKyAoKHBhcmVudC5vZmZzZXRXaWR0aCAtIHRvb2x0aXAub2Zmc2V0V2lkdGgpIC8gMik7XHJcblxyXG4gIHN3aXRjaCAocG9zKSB7XHJcbiAgICBjYXNlICdib3R0b20nOlxyXG4gICAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMuYm90dG9tKSArIGRpc3Q7XHJcbiAgICAgIGFycm93RGlyZWN0aW9uID0gXCJ1cFwiO1xyXG4gICAgICBicmVhaztcclxuXHJcbiAgICBkZWZhdWx0OlxyXG4gICAgY2FzZSAndG9wJzpcclxuICAgICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLnRvcCkgLSB0b29sdGlwLm9mZnNldEhlaWdodCAtIGRpc3Q7XHJcbiAgfVxyXG5cclxuICAvLyBpZiB0b29sdGlwIGlzIG91dCBvZiBib3VuZHMgb24gbGVmdCBzaWRlXHJcbiAgaWYobGVmdCA8IDApIHtcclxuICAgIGxlZnQgPSBkaXN0O1xyXG4gICAgbGV0IGVuZFBvc2l0aW9uT25QYWdlID0gdHJpZ2dlclBvc2l0aW9uLmxlZnQgKyAodHJpZ2dlci5vZmZzZXRXaWR0aCAvIDIpO1xyXG4gICAgbGV0IHRvb2x0aXBBcnJvd0hhbGZXaWR0aCA9IDg7XHJcbiAgICBsZXQgYXJyb3dMZWZ0UG9zaXRpb24gPSBlbmRQb3NpdGlvbk9uUGFnZSAtIGRpc3QgLSB0b29sdGlwQXJyb3dIYWxmV2lkdGg7XHJcbiAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5zdHlsZS5sZWZ0ID0gYXJyb3dMZWZ0UG9zaXRpb24rJ3B4JztcclxuICB9XHJcblxyXG4gIC8vIFxyXG4gIGlmKCh0b3AgKyB0b29sdGlwLm9mZnNldEhlaWdodCkgPj0gd2luZG93LmlubmVySGVpZ2h0KXtcclxuICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy50b3ApIC0gdG9vbHRpcC5vZmZzZXRIZWlnaHQgLSBkaXN0O1xyXG4gICAgYXJyb3dEaXJlY3Rpb24gPSBcInVwXCI7XHJcbiAgfVxyXG4gIFxyXG4gIGlmKHRvcCA8IDApIHtcclxuICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy5ib3R0b20pICsgZGlzdDtcclxuICAgIGFycm93RGlyZWN0aW9uID0gXCJ1cFwiO1xyXG4gIH1cclxuICBpZih3aW5kb3cuaW5uZXJXaWR0aCA8IChsZWZ0ICsgdG9vbHRpcFdpZHRoKSl7XHJcbiAgICB0b29sdGlwLnN0eWxlLnJpZ2h0ID0gZGlzdCArICdweCc7XHJcbiAgICBsZXQgZW5kUG9zaXRpb25PblBhZ2UgPSB0cmlnZ2VyUG9zaXRpb24ucmlnaHQgLSAodHJpZ2dlci5vZmZzZXRXaWR0aCAvIDIpO1xyXG4gICAgbGV0IHRvb2x0aXBBcnJvd0hhbGZXaWR0aCA9IDg7XHJcbiAgICBsZXQgYXJyb3dSaWdodFBvc2l0aW9uID0gd2luZG93LmlubmVyV2lkdGggLSBlbmRQb3NpdGlvbk9uUGFnZSAtIGRpc3QgLSB0b29sdGlwQXJyb3dIYWxmV2lkdGg7XHJcbiAgICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5zdHlsZS5yaWdodCA9IGFycm93UmlnaHRQb3NpdGlvbisncHgnO1xyXG4gICAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uc3R5bGUubGVmdCA9ICdhdXRvJztcclxuICB9IGVsc2Uge1xyXG4gICAgdG9vbHRpcC5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XHJcbiAgfVxyXG4gIHRvb2x0aXAuc3R5bGUudG9wICA9IHRvcCArIHBhZ2VZT2Zmc2V0ICsgJ3B4JztcclxuICB0b29sdGlwLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Rvb2x0aXAtYXJyb3cnKVswXS5jbGFzc0xpc3QuYWRkKGFycm93RGlyZWN0aW9uKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGNsb3NlQWxsVG9vbHRpcHMoZXZlbnQsIGZvcmNlID0gZmFsc2Upe1xyXG4gIGlmIChmb3JjZSB8fCAoIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2pzLXRvb2x0aXAnKSAmJiAhZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcCcpICYmICFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sdGlwLWNvbnRlbnQnKSkpIHsgIFxyXG4gICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvb2x0aXAtcG9wcGVyJyk7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1kZXNjcmliZWRieT0nK2VsZW1lbnRzW2ldLmdldEF0dHJpYnV0ZSgnaWQnKSsnXScpO1xyXG4gICAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLWFjdGl2ZScpO1xyXG4gICAgICB0cmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtZm9jdXMnKTtcclxuICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudHNbaV0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcil7XHJcbiAgICB2YXIgdG9vbHRpcElkID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTsgXHJcbiAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG4gICAgdG9vbHRpcEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIG9uVG9vbHRpcEhvdmVyKTtcclxuICAgIHRvb2x0aXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvblRvb2x0aXBIb3Zlcik7XHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ICAgXHJcbiAgICAgIGxldCB0b29sdGlwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XHJcbiAgICAgIGlmKHRvb2x0aXBFbGVtZW50ICE9PSBudWxsKXtcclxuICAgICAgICBpZighdHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoXCJ0b29sdGlwLWhvdmVyXCIpKXtcclxuICAgICAgICAgIHJlbW92ZVRvb2x0aXAodHJpZ2dlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LCAzMDApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvblRvb2x0aXBIb3ZlcihlKXtcclxuICBsZXQgdG9vbHRpcEVsZW1lbnQgPSB0aGlzO1xyXG5cclxuICBsZXQgdHJpZ2dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWRlc2NyaWJlZGJ5PScrdG9vbHRpcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpKyddJyk7XHJcbiAgdHJpZ2dlci5jbGFzc0xpc3QuYWRkKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgXHJcbiAgdG9vbHRpcEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgdHJpZ2dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWRlc2NyaWJlZGJ5PScrdG9vbHRpcEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpKyddJyk7XHJcbiAgICBpZih0cmlnZ2VyICE9PSBudWxsKXtcclxuICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgIGNsb3NlSG92ZXJUb29sdGlwKHRyaWdnZXIpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVUb29sdGlwKHRyaWdnZXIpe1xyXG4gIHZhciB0b29sdGlwSWQgPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpOyBcclxuICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG4gIFxyXG4gIGlmKHRvb2x0aXBJZCAhPT0gbnVsbCAmJiB0b29sdGlwRWxlbWVudCAhPT0gbnVsbCl7XHJcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRvb2x0aXBFbGVtZW50KTtcclxuICB9XHJcbiAgdHJpZ2dlci5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtaG92ZXInKTtcclxuICB0cmlnZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ3Rvb2x0aXAtZm9jdXMnKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUb29sdGlwO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBwcmVmaXg6ICcnLFxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCBBY2NvcmRpb24gZnJvbSAnLi9jb21wb25lbnRzL2FjY29yZGlvbic7XHJcbmltcG9ydCBBbGVydCBmcm9tICcuL2NvbXBvbmVudHMvYWxlcnQnO1xyXG5pbXBvcnQgQmFja1RvVG9wIGZyb20gJy4vY29tcG9uZW50cy9iYWNrLXRvLXRvcCc7XHJcbmltcG9ydCBDaGFyYWN0ZXJMaW1pdCBmcm9tICcuL2NvbXBvbmVudHMvY2hhcmFjdGVyLWxpbWl0JztcclxuaW1wb3J0IENoZWNrYm94VG9nZ2xlQ29udGVudCBmcm9tICcuL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnO1xyXG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duJztcclxuaW1wb3J0IERyb3Bkb3duU29ydCBmcm9tICcuL2NvbXBvbmVudHMvZHJvcGRvd24tc29ydCc7XHJcbmltcG9ydCBFcnJvclN1bW1hcnkgZnJvbSAnLi9jb21wb25lbnRzL2Vycm9yLXN1bW1hcnknO1xyXG5pbXBvcnQgSW5wdXRSZWdleE1hc2sgZnJvbSAnLi9jb21wb25lbnRzL3JlZ2V4LWlucHV0LW1hc2snO1xyXG5pbXBvcnQgTW9kYWwgZnJvbSAnLi9jb21wb25lbnRzL21vZGFsJztcclxuaW1wb3J0IE5hdmlnYXRpb24gZnJvbSAnLi9jb21wb25lbnRzL25hdmlnYXRpb24nO1xyXG5pbXBvcnQgUmFkaW9Ub2dnbGVHcm91cCBmcm9tICcuL2NvbXBvbmVudHMvcmFkaW8tdG9nZ2xlLWNvbnRlbnQnO1xyXG5pbXBvcnQgUmVzcG9uc2l2ZVRhYmxlIGZyb20gJy4vY29tcG9uZW50cy90YWJsZSc7XHJcbmltcG9ydCBUYWJuYXYgZnJvbSAgJy4vY29tcG9uZW50cy90YWJuYXYnO1xyXG5pbXBvcnQgVGFibGVTZWxlY3RhYmxlUm93cyBmcm9tICcuL2NvbXBvbmVudHMvc2VsZWN0YWJsZS10YWJsZSc7XHJcbmltcG9ydCBUb2FzdCBmcm9tICcuL2NvbXBvbmVudHMvdG9hc3QnO1xyXG5pbXBvcnQgVG9vbHRpcCBmcm9tICcuL2NvbXBvbmVudHMvdG9vbHRpcCc7XHJcbmNvbnN0IGRhdGVQaWNrZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGF0ZS1waWNrZXInKTtcclxuLyoqXHJcbiAqIFRoZSAncG9seWZpbGxzJyBkZWZpbmUga2V5IEVDTUFTY3JpcHQgNSBtZXRob2RzIHRoYXQgbWF5IGJlIG1pc3NpbmcgZnJvbVxyXG4gKiBvbGRlciBicm93c2Vycywgc28gbXVzdCBiZSBsb2FkZWQgZmlyc3QuXHJcbiAqL1xyXG5yZXF1aXJlKCcuL3BvbHlmaWxscycpO1xyXG5cclxuLyoqXHJcbiAqIEluaXQgYWxsIGNvbXBvbmVudHNcclxuICogQHBhcmFtIHtKU09OfSBvcHRpb25zIHtzY29wZTogSFRNTEVsZW1lbnR9IC0gSW5pdCBhbGwgY29tcG9uZW50cyB3aXRoaW4gc2NvcGUgKGRlZmF1bHQgaXMgZG9jdW1lbnQpXHJcbiAqL1xyXG52YXIgaW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgLy8gU2V0IHRoZSBvcHRpb25zIHRvIGFuIGVtcHR5IG9iamVjdCBieSBkZWZhdWx0IGlmIG5vIG9wdGlvbnMgYXJlIHBhc3NlZC5cclxuICBvcHRpb25zID0gdHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucyA6IHt9XHJcblxyXG4gIC8vIEFsbG93IHRoZSB1c2VyIHRvIGluaXRpYWxpc2UgRkRTIGluIG9ubHkgY2VydGFpbiBzZWN0aW9ucyBvZiB0aGUgcGFnZVxyXG4gIC8vIERlZmF1bHRzIHRvIHRoZSBlbnRpcmUgZG9jdW1lbnQgaWYgbm90aGluZyBpcyBzZXQuXHJcbiAgdmFyIHNjb3BlID0gdHlwZW9mIG9wdGlvbnMuc2NvcGUgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5zY29wZSA6IGRvY3VtZW50XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQWNjb3JkaW9uc1xyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbiA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FjY29yZGlvbicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQWNjb3JkaW9uLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBBY2NvcmRpb24oanNTZWxlY3RvckFjY29yZGlvblsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG4gIGNvbnN0IGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZCA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tYm9yZGVyZWQ6bm90KC5hY2NvcmRpb24pJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQWNjb3JkaW9uKGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIEFsZXJ0c1xyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcblxyXG4gIGNvbnN0IGFsZXJ0c1dpdGhDbG9zZUJ1dHRvbiA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbGVydC5oYXMtY2xvc2UnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwgYWxlcnRzV2l0aENsb3NlQnV0dG9uLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBBbGVydChhbGVydHNXaXRoQ2xvc2VCdXR0b25bIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBCYWNrIHRvIHRvcCBidXR0b25cclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG5cclxuICBjb25zdCBiYWNrVG9Ub3BCdXR0b25zID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYmFjay10by10b3AtYnV0dG9uJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGJhY2tUb1RvcEJ1dHRvbnMubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IEJhY2tUb1RvcChiYWNrVG9Ub3BCdXR0b25zWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQ2hhcmFjdGVyIGxpbWl0XHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc0NoYXJhY3RlckxpbWl0ID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybS1saW1pdCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc0NoYXJhY3RlckxpbWl0Lmxlbmd0aDsgYysrKXtcclxuXHJcbiAgICBuZXcgQ2hhcmFjdGVyTGltaXQoanNDaGFyYWN0ZXJMaW1pdFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQ2hlY2tib3ggY29sbGFwc2VcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2UubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IENoZWNrYm94VG9nZ2xlQ29udGVudChqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZVsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIE92ZXJmbG93IG1lbnVcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JEcm9wZG93biA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWRyb3Bkb3duJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JEcm9wZG93bi5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgRHJvcGRvd24oanNTZWxlY3RvckRyb3Bkb3duWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgT3ZlcmZsb3cgbWVudSBzb3J0XHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yRHJvcGRvd25Tb3J0ID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnb3ZlcmZsb3ctbWVudS0tc29ydCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yRHJvcGRvd25Tb3J0Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBEcm9wZG93blNvcnQoanNTZWxlY3RvckRyb3Bkb3duU29ydFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIERhdGVwaWNrZXJcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGRhdGVQaWNrZXIub24oc2NvcGUpO1xyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgRXJyb3Igc3VtbWFyeVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgdmFyICRlcnJvclN1bW1hcnkgPSBzY29wZS5xdWVyeVNlbGVjdG9yKCdbZGF0YS1tb2R1bGU9XCJlcnJvci1zdW1tYXJ5XCJdJyk7XHJcbiAgbmV3IEVycm9yU3VtbWFyeSgkZXJyb3JTdW1tYXJ5KS5pbml0KCk7XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgSW5wdXQgUmVnZXggLSB1c2VkIG9uIGRhdGUgZmllbGRzXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yUmVnZXggPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtkYXRhLWlucHV0LXJlZ2V4XScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yUmVnZXgubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IElucHV0UmVnZXhNYXNrKGpzU2VsZWN0b3JSZWdleFsgYyBdKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgTW9kYWxcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IG1vZGFscyA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mZHMtbW9kYWwnKTtcclxuICBmb3IobGV0IGQgPSAwOyBkIDwgbW9kYWxzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICBuZXcgTW9kYWwobW9kYWxzW2RdKS5pbml0KCk7XHJcbiAgfVxyXG4gIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgTmF2aWdhdGlvblxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgbmV3IE5hdmlnYXRpb24oKS5pbml0KCk7XHJcbiAgIFxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgUmFkaW9idXR0b24gZ3JvdXAgY29sbGFwc2VcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtcmFkaW8tdG9nZ2xlLWdyb3VwJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBSYWRpb1RvZ2dsZUdyb3VwKGpzU2VsZWN0b3JSYWRpb0NvbGxhcHNlWyBjIF0pLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgUmVzcG9uc2l2ZSB0YWJsZXNcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JUYWJsZSA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RhYmxlOm5vdCguZGF0YVRhYmxlKScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibGUubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFJlc3BvbnNpdmVUYWJsZShqc1NlbGVjdG9yVGFibGVbIGMgXSk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFNlbGVjdGFibGUgcm93cyBpbiB0YWJsZVxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RhYmxlVGFibGUgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZS50YWJsZS0tc2VsZWN0YWJsZScpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdGFibGVUYWJsZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVGFibGVTZWxlY3RhYmxlUm93cyhqc1NlbGVjdGFibGVUYWJsZVsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRhYm5hdlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclRhYm5hdiA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RhYm5hdicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVGFibmF2Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBUYWJuYXYoanNTZWxlY3RvclRhYm5hdlsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRvb2x0aXBcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JUb29sdGlwID0gc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtdG9vbHRpcCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yVG9vbHRpcC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVG9vbHRpcChqc1NlbGVjdG9yVG9vbHRpcFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG4gIFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7IGluaXQsIEFjY29yZGlvbiwgQWxlcnQsIEJhY2tUb1RvcCwgQ2hhcmFjdGVyTGltaXQsIENoZWNrYm94VG9nZ2xlQ29udGVudCwgRHJvcGRvd24sIERyb3Bkb3duU29ydCwgZGF0ZVBpY2tlciwgRXJyb3JTdW1tYXJ5LCBJbnB1dFJlZ2V4TWFzaywgTW9kYWwsIE5hdmlnYXRpb24sIFJhZGlvVG9nZ2xlR3JvdXAsIFJlc3BvbnNpdmVUYWJsZSwgVGFibGVTZWxlY3RhYmxlUm93cywgVGFibmF2LCBUb2FzdCwgVG9vbHRpcH07IiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgLy8gVGhpcyB1c2VkIHRvIGJlIGNvbmRpdGlvbmFsbHkgZGVwZW5kZW50IG9uIHdoZXRoZXIgdGhlXHJcbiAgLy8gYnJvd3NlciBzdXBwb3J0ZWQgdG91Y2ggZXZlbnRzOyBpZiBpdCBkaWQsIGBDTElDS2Agd2FzIHNldCB0b1xyXG4gIC8vIGB0b3VjaHN0YXJ0YC4gIEhvd2V2ZXIsIHRoaXMgaGFkIGRvd25zaWRlczpcclxuICAvL1xyXG4gIC8vICogSXQgcHJlLWVtcHRlZCBtb2JpbGUgYnJvd3NlcnMnIGRlZmF1bHQgYmVoYXZpb3Igb2YgZGV0ZWN0aW5nXHJcbiAgLy8gICB3aGV0aGVyIGEgdG91Y2ggdHVybmVkIGludG8gYSBzY3JvbGwsIHRoZXJlYnkgcHJldmVudGluZ1xyXG4gIC8vICAgdXNlcnMgZnJvbSB1c2luZyBzb21lIG9mIG91ciBjb21wb25lbnRzIGFzIHNjcm9sbCBzdXJmYWNlcy5cclxuICAvL1xyXG4gIC8vICogU29tZSBkZXZpY2VzLCBzdWNoIGFzIHRoZSBNaWNyb3NvZnQgU3VyZmFjZSBQcm8sIHN1cHBvcnQgKmJvdGgqXHJcbiAgLy8gICB0b3VjaCBhbmQgY2xpY2tzLiBUaGlzIG1lYW50IHRoZSBjb25kaXRpb25hbCBlZmZlY3RpdmVseSBkcm9wcGVkXHJcbiAgLy8gICBzdXBwb3J0IGZvciB0aGUgdXNlcidzIG1vdXNlLCBmcnVzdHJhdGluZyB1c2VycyB3aG8gcHJlZmVycmVkXHJcbiAgLy8gICBpdCBvbiB0aG9zZSBzeXN0ZW1zLlxyXG4gIENMSUNLOiAnY2xpY2snLFxyXG59O1xyXG4iLCJpbXBvcnQgJy4uLy4uL09iamVjdC9kZWZpbmVQcm9wZXJ0eSdcclxuXHJcbihmdW5jdGlvbih1bmRlZmluZWQpIHtcclxuICAvLyBEZXRlY3Rpb24gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLXNlcnZpY2UvYmxvYi9tYXN0ZXIvcGFja2FnZXMvcG9seWZpbGwtbGlicmFyeS9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQvZGV0ZWN0LmpzXHJcbiAgdmFyIGRldGVjdCA9ICdiaW5kJyBpbiBGdW5jdGlvbi5wcm90b3R5cGVcclxuXHJcbiAgaWYgKGRldGVjdCkgcmV0dXJuXHJcblxyXG4gIC8vIFBvbHlmaWxsIGZyb20gaHR0cHM6Ly9jZG4ucG9seWZpbGwuaW8vdjIvcG9seWZpbGwuanM/ZmVhdHVyZXM9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmQmZmxhZ3M9YWx3YXlzXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ2JpbmQnLCB7XHJcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBiaW5kKHRoYXQpIHsgLy8gLmxlbmd0aCBpcyAxXHJcbiAgICAgICAgICAvLyBhZGQgbmVjZXNzYXJ5IGVzNS1zaGltIHV0aWxpdGllc1xyXG4gICAgICAgICAgdmFyICRBcnJheSA9IEFycmF5O1xyXG4gICAgICAgICAgdmFyICRPYmplY3QgPSBPYmplY3Q7XHJcbiAgICAgICAgICB2YXIgT2JqZWN0UHJvdG90eXBlID0gJE9iamVjdC5wcm90b3R5cGU7XHJcbiAgICAgICAgICB2YXIgQXJyYXlQcm90b3R5cGUgPSAkQXJyYXkucHJvdG90eXBlO1xyXG4gICAgICAgICAgdmFyIEVtcHR5ID0gZnVuY3Rpb24gRW1wdHkoKSB7fTtcclxuICAgICAgICAgIHZhciB0b19zdHJpbmcgPSBPYmplY3RQcm90b3R5cGUudG9TdHJpbmc7XHJcbiAgICAgICAgICB2YXIgaGFzVG9TdHJpbmdUYWcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09ICdzeW1ib2wnO1xyXG4gICAgICAgICAgdmFyIGlzQ2FsbGFibGU7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1jYWxsYWJsZSAqLyB2YXIgZm5Ub1N0ciA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZywgdHJ5RnVuY3Rpb25PYmplY3QgPSBmdW5jdGlvbiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSkgeyB0cnkgeyBmblRvU3RyLmNhbGwodmFsdWUpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfSwgZm5DbGFzcyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsIGdlbkNsYXNzID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJzsgaXNDYWxsYWJsZSA9IGZ1bmN0aW9uIGlzQ2FsbGFibGUodmFsdWUpIHsgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gZmFsc2U7IH0gaWYgKGhhc1RvU3RyaW5nVGFnKSB7IHJldHVybiB0cnlGdW5jdGlvbk9iamVjdCh2YWx1ZSk7IH0gdmFyIHN0ckNsYXNzID0gdG9fc3RyaW5nLmNhbGwodmFsdWUpOyByZXR1cm4gc3RyQ2xhc3MgPT09IGZuQ2xhc3MgfHwgc3RyQ2xhc3MgPT09IGdlbkNsYXNzOyB9O1xyXG4gICAgICAgICAgdmFyIGFycmF5X3NsaWNlID0gQXJyYXlQcm90b3R5cGUuc2xpY2U7XHJcbiAgICAgICAgICB2YXIgYXJyYXlfY29uY2F0ID0gQXJyYXlQcm90b3R5cGUuY29uY2F0O1xyXG4gICAgICAgICAgdmFyIGFycmF5X3B1c2ggPSBBcnJheVByb3RvdHlwZS5wdXNoO1xyXG4gICAgICAgICAgdmFyIG1heCA9IE1hdGgubWF4O1xyXG4gICAgICAgICAgLy8gL2FkZCBuZWNlc3NhcnkgZXM1LXNoaW0gdXRpbGl0aWVzXHJcblxyXG4gICAgICAgICAgLy8gMS4gTGV0IFRhcmdldCBiZSB0aGUgdGhpcyB2YWx1ZS5cclxuICAgICAgICAgIHZhciB0YXJnZXQgPSB0aGlzO1xyXG4gICAgICAgICAgLy8gMi4gSWYgSXNDYWxsYWJsZShUYXJnZXQpIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXHJcbiAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgJyArIHRhcmdldCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyAzLiBMZXQgQSBiZSBhIG5ldyAocG9zc2libHkgZW1wdHkpIGludGVybmFsIGxpc3Qgb2YgYWxsIG9mIHRoZVxyXG4gICAgICAgICAgLy8gICBhcmd1bWVudCB2YWx1ZXMgcHJvdmlkZWQgYWZ0ZXIgdGhpc0FyZyAoYXJnMSwgYXJnMiBldGMpLCBpbiBvcmRlci5cclxuICAgICAgICAgIC8vIFhYWCBzbGljZWRBcmdzIHdpbGwgc3RhbmQgaW4gZm9yIFwiQVwiIGlmIHVzZWRcclxuICAgICAgICAgIHZhciBhcmdzID0gYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpOyAvLyBmb3Igbm9ybWFsIGNhbGxcclxuICAgICAgICAgIC8vIDQuIExldCBGIGJlIGEgbmV3IG5hdGl2ZSBFQ01BU2NyaXB0IG9iamVjdC5cclxuICAgICAgICAgIC8vIDExLiBTZXQgdGhlIFtbUHJvdG90eXBlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0aGUgc3RhbmRhcmRcclxuICAgICAgICAgIC8vICAgYnVpbHQtaW4gRnVuY3Rpb24gcHJvdG90eXBlIG9iamVjdCBhcyBzcGVjaWZpZWQgaW4gMTUuMy4zLjEuXHJcbiAgICAgICAgICAvLyAxMi4gU2V0IHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxyXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4xLlxyXG4gICAgICAgICAgLy8gMTMuIFNldCB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxyXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4yLlxyXG4gICAgICAgICAgLy8gMTQuIFNldCB0aGUgW1tIYXNJbnN0YW5jZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXHJcbiAgICAgICAgICAvLyAgIDE1LjMuNC41LjMuXHJcbiAgICAgICAgICB2YXIgYm91bmQ7XHJcbiAgICAgICAgICB2YXIgYmluZGVyID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjIgW1tDb25zdHJ1Y3RdXVxyXG4gICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCBvZiBhIGZ1bmN0aW9uIG9iamVjdCxcclxuICAgICAgICAgICAgICAgICAgLy8gRiB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcclxuICAgICAgICAgICAgICAgICAgLy8gbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcclxuICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IHRhcmdldCBiZSB0aGUgdmFsdWUgb2YgRidzIFtbVGFyZ2V0RnVuY3Rpb25dXVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIGludGVybmFsIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAyLiBJZiB0YXJnZXQgaGFzIG5vIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kLCBhXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgVHlwZUVycm9yIGV4Y2VwdGlvbiBpcyB0aHJvd24uXHJcbiAgICAgICAgICAgICAgICAgIC8vIDMuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXHJcbiAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcclxuICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxyXG4gICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbWV0aG9kIG9mIHRhcmdldCBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxyXG5cclxuICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRhcmdldC5hcHBseShcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgIGlmICgkT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMSBbW0NhbGxdXVxyXG4gICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsIEYsXHJcbiAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcclxuICAgICAgICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSBhbmQgYSBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmdcclxuICAgICAgICAgICAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxyXG4gICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAyLiBMZXQgYm91bmRUaGlzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZFRoaXNdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dIGludGVybmFsXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXHJcbiAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcclxuICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxyXG4gICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2RcclxuICAgICAgICAgICAgICAgICAgLy8gICBvZiB0YXJnZXQgcHJvdmlkaW5nIGJvdW5kVGhpcyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcclxuICAgICAgICAgICAgICAgICAgLy8gICBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gZXF1aXY6IHRhcmdldC5jYWxsKHRoaXMsIC4uLmJvdW5kQXJncywgLi4uYXJncylcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5hcHBseShcclxuICAgICAgICAgICAgICAgICAgICAgIHRoYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBhcnJheV9jb25jYXQuY2FsbChhcmdzLCBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cykpXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIC8vIDE1LiBJZiB0aGUgW1tDbGFzc11dIGludGVybmFsIHByb3BlcnR5IG9mIFRhcmdldCBpcyBcIkZ1bmN0aW9uXCIsIHRoZW5cclxuICAgICAgICAgIC8vICAgICBhLiBMZXQgTCBiZSB0aGUgbGVuZ3RoIHByb3BlcnR5IG9mIFRhcmdldCBtaW51cyB0aGUgbGVuZ3RoIG9mIEEuXHJcbiAgICAgICAgICAvLyAgICAgYi4gU2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gZWl0aGVyIDAgb3IgTCwgd2hpY2hldmVyIGlzXHJcbiAgICAgICAgICAvLyAgICAgICBsYXJnZXIuXHJcbiAgICAgICAgICAvLyAxNi4gRWxzZSBzZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byAwLlxyXG5cclxuICAgICAgICAgIHZhciBib3VuZExlbmd0aCA9IG1heCgwLCB0YXJnZXQubGVuZ3RoIC0gYXJncy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgIC8vIDE3LiBTZXQgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byB0aGUgdmFsdWVzXHJcbiAgICAgICAgICAvLyAgIHNwZWNpZmllZCBpbiAxNS4zLjUuMS5cclxuICAgICAgICAgIHZhciBib3VuZEFyZ3MgPSBbXTtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm91bmRMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIGFycmF5X3B1c2guY2FsbChib3VuZEFyZ3MsICckJyArIGkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFhYWCBCdWlsZCBhIGR5bmFtaWMgZnVuY3Rpb24gd2l0aCBkZXNpcmVkIGFtb3VudCBvZiBhcmd1bWVudHMgaXMgdGhlIG9ubHlcclxuICAgICAgICAgIC8vIHdheSB0byBzZXQgdGhlIGxlbmd0aCBwcm9wZXJ0eSBvZiBhIGZ1bmN0aW9uLlxyXG4gICAgICAgICAgLy8gSW4gZW52aXJvbm1lbnRzIHdoZXJlIENvbnRlbnQgU2VjdXJpdHkgUG9saWNpZXMgZW5hYmxlZCAoQ2hyb21lIGV4dGVuc2lvbnMsXHJcbiAgICAgICAgICAvLyBmb3IgZXguKSBhbGwgdXNlIG9mIGV2YWwgb3IgRnVuY3Rpb24gY29zdHJ1Y3RvciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxyXG4gICAgICAgICAgLy8gSG93ZXZlciBpbiBhbGwgb2YgdGhlc2UgZW52aXJvbm1lbnRzIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGV4aXN0c1xyXG4gICAgICAgICAgLy8gYW5kIHNvIHRoaXMgY29kZSB3aWxsIG5ldmVyIGJlIGV4ZWN1dGVkLlxyXG4gICAgICAgICAgYm91bmQgPSBGdW5jdGlvbignYmluZGVyJywgJ3JldHVybiBmdW5jdGlvbiAoJyArIGJvdW5kQXJncy5qb2luKCcsJykgKyAnKXsgcmV0dXJuIGJpbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9JykoYmluZGVyKTtcclxuXHJcbiAgICAgICAgICBpZiAodGFyZ2V0LnByb3RvdHlwZSkge1xyXG4gICAgICAgICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IHRhcmdldC5wcm90b3R5cGU7XHJcbiAgICAgICAgICAgICAgYm91bmQucHJvdG90eXBlID0gbmV3IEVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZGFuZ2xpbmcgcmVmZXJlbmNlcy5cclxuICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vIDE4LiBTZXQgdGhlIFtbRXh0ZW5zaWJsZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdHJ1ZS5cclxuXHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvLyAxOS4gTGV0IHRocm93ZXIgYmUgdGhlIFtbVGhyb3dUeXBlRXJyb3JdXSBmdW5jdGlvbiBPYmplY3QgKDEzLjIuMykuXHJcbiAgICAgICAgICAvLyAyMC4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcclxuICAgICAgICAgIC8vICAgYXJndW1lbnRzIFwiY2FsbGVyXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlciwgW1tTZXRdXTpcclxuICAgICAgICAgIC8vICAgdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sIGFuZFxyXG4gICAgICAgICAgLy8gICBmYWxzZS5cclxuICAgICAgICAgIC8vIDIxLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxyXG4gICAgICAgICAgLy8gICBhcmd1bWVudHMgXCJhcmd1bWVudHNcIiwgUHJvcGVydHlEZXNjcmlwdG9yIHtbW0dldF1dOiB0aHJvd2VyLFxyXG4gICAgICAgICAgLy8gICBbW1NldF1dOiB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSxcclxuICAgICAgICAgIC8vICAgYW5kIGZhbHNlLlxyXG5cclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgIC8vIE5PVEUgRnVuY3Rpb24gb2JqZWN0cyBjcmVhdGVkIHVzaW5nIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIGRvIG5vdFxyXG4gICAgICAgICAgLy8gaGF2ZSBhIHByb3RvdHlwZSBwcm9wZXJ0eSBvciB0aGUgW1tDb2RlXV0sIFtbRm9ybWFsUGFyYW1ldGVyc11dLCBhbmRcclxuICAgICAgICAgIC8vIFtbU2NvcGVdXSBpbnRlcm5hbCBwcm9wZXJ0aWVzLlxyXG4gICAgICAgICAgLy8gWFhYIGNhbid0IGRlbGV0ZSBwcm90b3R5cGUgaW4gcHVyZS1qcy5cclxuXHJcbiAgICAgICAgICAvLyAyMi4gUmV0dXJuIEYuXHJcbiAgICAgICAgICByZXR1cm4gYm91bmQ7XHJcbiAgICAgIH1cclxuICB9KTtcclxufSlcclxuLmNhbGwoJ29iamVjdCcgPT09IHR5cGVvZiB3aW5kb3cgJiYgd2luZG93IHx8ICdvYmplY3QnID09PSB0eXBlb2Ygc2VsZiAmJiBzZWxmIHx8ICdvYmplY3QnID09PSB0eXBlb2YgZ2xvYmFsICYmIGdsb2JhbCB8fCB7fSk7XHJcbiIsIihmdW5jdGlvbih1bmRlZmluZWQpIHtcclxuXHJcbi8vIERldGVjdGlvbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9GaW5hbmNpYWwtVGltZXMvcG9seWZpbGwtc2VydmljZS9ibG9iL21hc3Rlci9wYWNrYWdlcy9wb2x5ZmlsbC1saWJyYXJ5L3BvbHlmaWxscy9PYmplY3QvZGVmaW5lUHJvcGVydHkvZGV0ZWN0LmpzXHJcbnZhciBkZXRlY3QgPSAoXHJcbiAgLy8gSW4gSUU4LCBkZWZpbmVQcm9wZXJ0eSBjb3VsZCBvbmx5IGFjdCBvbiBET00gZWxlbWVudHMsIHNvIGZ1bGwgc3VwcG9ydFxyXG4gIC8vIGZvciB0aGUgZmVhdHVyZSByZXF1aXJlcyB0aGUgYWJpbGl0eSB0byBzZXQgYSBwcm9wZXJ0eSBvbiBhbiBhcmJpdHJhcnkgb2JqZWN0XHJcbiAgJ2RlZmluZVByb3BlcnR5JyBpbiBPYmplY3QgJiYgKGZ1bmN0aW9uKCkge1xyXG4gIFx0dHJ5IHtcclxuICBcdFx0dmFyIGEgPSB7fTtcclxuICBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsICd0ZXN0Jywge3ZhbHVlOjQyfSk7XHJcbiAgXHRcdHJldHVybiB0cnVlO1xyXG4gIFx0fSBjYXRjaChlKSB7XHJcbiAgXHRcdHJldHVybiBmYWxzZVxyXG4gIFx0fVxyXG4gIH0oKSlcclxuKVxyXG5cclxuaWYgKGRldGVjdCkgcmV0dXJuXHJcblxyXG4vLyBQb2x5ZmlsbCBmcm9tIGh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLmpzP2ZlYXR1cmVzPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSZmbGFncz1hbHdheXNcclxuKGZ1bmN0aW9uIChuYXRpdmVEZWZpbmVQcm9wZXJ0eSkge1xyXG5cclxuXHR2YXIgc3VwcG9ydHNBY2Nlc3NvcnMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KCdfX2RlZmluZUdldHRlcl9fJyk7XHJcblx0dmFyIEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCA9ICdHZXR0ZXJzICYgc2V0dGVycyBjYW5ub3QgYmUgZGVmaW5lZCBvbiB0aGlzIGphdmFzY3JpcHQgZW5naW5lJztcclxuXHR2YXIgRVJSX1ZBTFVFX0FDQ0VTU09SUyA9ICdBIHByb3BlcnR5IGNhbm5vdCBib3RoIGhhdmUgYWNjZXNzb3JzIGFuZCBiZSB3cml0YWJsZSBvciBoYXZlIGEgdmFsdWUnO1xyXG5cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKSB7XHJcblxyXG5cdFx0Ly8gV2hlcmUgbmF0aXZlIHN1cHBvcnQgZXhpc3RzLCBhc3N1bWUgaXRcclxuXHRcdGlmIChuYXRpdmVEZWZpbmVQcm9wZXJ0eSAmJiAob2JqZWN0ID09PSB3aW5kb3cgfHwgb2JqZWN0ID09PSBkb2N1bWVudCB8fCBvYmplY3QgPT09IEVsZW1lbnQucHJvdG90eXBlIHx8IG9iamVjdCBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XHJcblx0XHRcdHJldHVybiBuYXRpdmVEZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCBkZXNjcmlwdG9yKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAob2JqZWN0ID09PSBudWxsIHx8ICEob2JqZWN0IGluc3RhbmNlb2YgT2JqZWN0IHx8IHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuZGVmaW5lUHJvcGVydHkgY2FsbGVkIG9uIG5vbi1vYmplY3QnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIShkZXNjcmlwdG9yIGluc3RhbmNlb2YgT2JqZWN0KSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9wZXJ0eSBkZXNjcmlwdGlvbiBtdXN0IGJlIGFuIG9iamVjdCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBwcm9wZXJ0eVN0cmluZyA9IFN0cmluZyhwcm9wZXJ0eSk7XHJcblx0XHR2YXIgaGFzVmFsdWVPcldyaXRhYmxlID0gJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yIHx8ICd3cml0YWJsZScgaW4gZGVzY3JpcHRvcjtcclxuXHRcdHZhciBnZXR0ZXJUeXBlID0gJ2dldCcgaW4gZGVzY3JpcHRvciAmJiB0eXBlb2YgZGVzY3JpcHRvci5nZXQ7XHJcblx0XHR2YXIgc2V0dGVyVHlwZSA9ICdzZXQnIGluIGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3Iuc2V0O1xyXG5cclxuXHRcdC8vIGhhbmRsZSBkZXNjcmlwdG9yLmdldFxyXG5cdFx0aWYgKGdldHRlclR5cGUpIHtcclxuXHRcdFx0aWYgKGdldHRlclR5cGUgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdHZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaGFzVmFsdWVPcldyaXRhYmxlKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfVkFMVUVfQUNDRVNTT1JTKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRPYmplY3QuX19kZWZpbmVHZXR0ZXJfXy5jYWxsKG9iamVjdCwgcHJvcGVydHlTdHJpbmcsIGRlc2NyaXB0b3IuZ2V0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG9iamVjdFtwcm9wZXJ0eVN0cmluZ10gPSBkZXNjcmlwdG9yLnZhbHVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGhhbmRsZSBkZXNjcmlwdG9yLnNldFxyXG5cdFx0aWYgKHNldHRlclR5cGUpIHtcclxuXHRcdFx0aWYgKHNldHRlclR5cGUgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdTZXR0ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFzdXBwb3J0c0FjY2Vzc29ycykge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX0FDQ0VTU09SU19OT1RfU1VQUE9SVEVEKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaGFzVmFsdWVPcldyaXRhYmxlKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihFUlJfVkFMVUVfQUNDRVNTT1JTKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRPYmplY3QuX19kZWZpbmVTZXR0ZXJfXy5jYWxsKG9iamVjdCwgcHJvcGVydHlTdHJpbmcsIGRlc2NyaXB0b3Iuc2V0KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBPSyB0byBkZWZpbmUgdmFsdWUgdW5jb25kaXRpb25hbGx5IC0gaWYgYSBnZXR0ZXIgaGFzIGJlZW4gc3BlY2lmaWVkIGFzIHdlbGwsIGFuIGVycm9yIHdvdWxkIGJlIHRocm93biBhYm92ZVxyXG5cdFx0aWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikge1xyXG5cdFx0XHRvYmplY3RbcHJvcGVydHlTdHJpbmddID0gZGVzY3JpcHRvci52YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gb2JqZWN0O1xyXG5cdH07XHJcbn0oT2JqZWN0LmRlZmluZVByb3BlcnR5KSk7XHJcbn0pXHJcbi5jYWxsKCdvYmplY3QnID09PSB0eXBlb2Ygd2luZG93ICYmIHdpbmRvdyB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIHNlbGYgJiYgc2VsZiB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIGdsb2JhbCAmJiBnbG9iYWwgfHwge30pO1xyXG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBjb25zaXN0ZW50LXJldHVybiAqL1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBmdW5jLW5hbWVzICovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIGZhbHNlO1xyXG5cclxuICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgX3BhcmFtcykge1xyXG4gICAgY29uc3QgcGFyYW1zID0gX3BhcmFtcyB8fCB7XHJcbiAgICAgIGJ1YmJsZXM6IGZhbHNlLFxyXG4gICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcclxuICAgICAgZGV0YWlsOiBudWxsLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiQ3VzdG9tRXZlbnRcIik7XHJcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KFxyXG4gICAgICBldmVudCxcclxuICAgICAgcGFyYW1zLmJ1YmJsZXMsXHJcbiAgICAgIHBhcmFtcy5jYW5jZWxhYmxlLFxyXG4gICAgICBwYXJhbXMuZGV0YWlsXHJcbiAgICApO1xyXG4gICAgcmV0dXJuIGV2dDtcclxuICB9XHJcblxyXG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xyXG59KSgpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGVscHJvdG8gPSB3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlO1xyXG5jb25zdCBISURERU4gPSAnaGlkZGVuJztcclxuXHJcbmlmICghKEhJRERFTiBpbiBlbHByb3RvKSkge1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbHByb3RvLCBISURERU4sIHtcclxuICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgIH0sXHJcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShISURERU4sICcnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShISURERU4pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0pO1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5jbGFzc0xpc3QgYW5kIERPTVRva2VuTGlzdFxyXG5yZXF1aXJlKCdjbGFzc2xpc3QtcG9seWZpbGwnKTtcclxuLy8gcG9seWZpbGxzIEhUTUxFbGVtZW50LnByb3RvdHlwZS5oaWRkZW5cclxucmVxdWlyZSgnLi9lbGVtZW50LWhpZGRlbicpO1xyXG5cclxuLy8gcG9seWZpbGxzIE51bWJlci5pc05hTigpXHJcbnJlcXVpcmUoXCIuL251bWJlci1pcy1uYW5cIik7XHJcblxyXG4vLyBwb2x5ZmlsbHMgQ3VzdG9tRXZlbnRcclxucmVxdWlyZShcIi4vY3VzdG9tLWV2ZW50XCIpO1xyXG5cclxucmVxdWlyZSgnY29yZS1qcy9mbi9vYmplY3QvYXNzaWduJyk7XHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vYXJyYXkvZnJvbScpOyIsIk51bWJlci5pc05hTiA9XHJcbiAgTnVtYmVyLmlzTmFOIHx8XHJcbiAgZnVuY3Rpb24gaXNOYU4oaW5wdXQpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcclxuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09IFwibnVtYmVyXCIgJiYgaW5wdXQgIT09IGlucHV0O1xyXG4gIH07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gKGh0bWxEb2N1bWVudCA9IGRvY3VtZW50KSA9PiBodG1sRG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZShcIm9iamVjdC1hc3NpZ25cIik7XHJcbmNvbnN0IHJlY2VwdG9yID0gcmVxdWlyZShcInJlY2VwdG9yXCIpO1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIHNlcXVlbmNlXHJcbiAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IHNlcSBhbiBhcnJheSBvZiBmdW5jdGlvbnNcclxuICogQHJldHVybiB7IGNsb3N1cmUgfSBjYWxsSG9va3NcclxuICovXHJcbi8vIFdlIHVzZSBhIG5hbWVkIGZ1bmN0aW9uIGhlcmUgYmVjYXVzZSB3ZSB3YW50IGl0IHRvIGluaGVyaXQgaXRzIGxleGljYWwgc2NvcGVcclxuLy8gZnJvbSB0aGUgYmVoYXZpb3IgcHJvcHMgb2JqZWN0LCBub3QgZnJvbSB0aGUgbW9kdWxlXHJcbmNvbnN0IHNlcXVlbmNlID0gKC4uLnNlcSkgPT5cclxuICBmdW5jdGlvbiBjYWxsSG9va3ModGFyZ2V0ID0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgc2VxLmZvckVhY2goKG1ldGhvZCkgPT4ge1xyXG4gICAgICBpZiAodHlwZW9mIHRoaXNbbWV0aG9kXSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgdGhpc1ttZXRob2RdLmNhbGwodGhpcywgdGFyZ2V0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBiZWhhdmlvclxyXG4gKiBAcGFyYW0ge29iamVjdH0gZXZlbnRzXHJcbiAqIEBwYXJhbSB7b2JqZWN0P30gcHJvcHNcclxuICogQHJldHVybiB7cmVjZXB0b3IuYmVoYXZpb3J9XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IChldmVudHMsIHByb3BzKSA9PlxyXG4gIHJlY2VwdG9yLmJlaGF2aW9yKFxyXG4gICAgZXZlbnRzLFxyXG4gICAgYXNzaWduKFxyXG4gICAgICB7XHJcbiAgICAgICAgb246IHNlcXVlbmNlKFwiaW5pdFwiLCBcImFkZFwiKSxcclxuICAgICAgICBvZmY6IHNlcXVlbmNlKFwidGVhcmRvd25cIiwgXCJyZW1vdmVcIiksXHJcbiAgICAgIH0sXHJcbiAgICAgIHByb3BzXHJcbiAgICApXHJcbiAgKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgYnJlYWtwb2ludHMgPSB7XHJcbiAgJ3hzJzogMCxcclxuICAnc20nOiA1NzYsXHJcbiAgJ21kJzogNzY4LFxyXG4gICdsZyc6IDk5MixcclxuICAneGwnOiAxMjAwXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJyZWFrcG9pbnRzO1xyXG4iLCIvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNzU1NzQzM1xyXG5mdW5jdGlvbiBpc0VsZW1lbnRJblZpZXdwb3J0IChlbCwgd2luPXdpbmRvdyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jRWw9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcbiAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIHJlY3QudG9wID49IDAgJiZcclxuICAgIHJlY3QubGVmdCA+PSAwICYmXHJcbiAgICByZWN0LmJvdHRvbSA8PSAod2luLmlubmVySGVpZ2h0IHx8IGRvY0VsLmNsaWVudEhlaWdodCkgJiZcclxuICAgIHJlY3QucmlnaHQgPD0gKHdpbi5pbm5lcldpZHRoIHx8IGRvY0VsLmNsaWVudFdpZHRoKVxyXG4gICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaXNFbGVtZW50SW5WaWV3cG9ydDtcclxuIiwiLy8gaU9TIGRldGVjdGlvbiBmcm9tOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85MDM5ODg1LzE3NzcxMFxyXG5mdW5jdGlvbiBpc0lvc0RldmljZSgpIHtcclxuICByZXR1cm4gKFxyXG4gICAgdHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJlxyXG4gICAgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goLyhpUG9kfGlQaG9uZXxpUGFkKS9nKSB8fFxyXG4gICAgICAobmF2aWdhdG9yLnBsYXRmb3JtID09PSBcIk1hY0ludGVsXCIgJiYgbmF2aWdhdG9yLm1heFRvdWNoUG9pbnRzID4gMSkpICYmXHJcbiAgICAhd2luZG93Lk1TU3RyZWFtXHJcbiAgKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpc0lvc0RldmljZTtcclxuIiwiLyoqXHJcbiAqIEBuYW1lIGlzRWxlbWVudFxyXG4gKiBAZGVzYyByZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBhcmd1bWVudCBpcyBhIERPTSBlbGVtZW50LlxyXG4gKiBAcGFyYW0ge2FueX0gdmFsdWVcclxuICogQHJldHVybiB7Ym9vbGVhbn1cclxuICovXHJcbmNvbnN0IGlzRWxlbWVudCA9ICh2YWx1ZSkgPT5cclxuICB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUubm9kZVR5cGUgPT09IDE7XHJcblxyXG4vKipcclxuICogQG5hbWUgc2VsZWN0XHJcbiAqIEBkZXNjIHNlbGVjdHMgZWxlbWVudHMgZnJvbSB0aGUgRE9NIGJ5IGNsYXNzIHNlbGVjdG9yIG9yIElEIHNlbGVjdG9yLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBUaGUgc2VsZWN0b3IgdG8gdHJhdmVyc2UgdGhlIERPTSB3aXRoLlxyXG4gKiBAcGFyYW0ge0RvY3VtZW50fEhUTUxFbGVtZW50P30gY29udGV4dCAtIFRoZSBjb250ZXh0IHRvIHRyYXZlcnNlIHRoZSBET01cclxuICogICBpbi4gSWYgbm90IHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byB0aGUgZG9jdW1lbnQuXHJcbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50W119IC0gQW4gYXJyYXkgb2YgRE9NIG5vZGVzIG9yIGFuIGVtcHR5IGFycmF5LlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoc2VsZWN0b3IsIGNvbnRleHQpID0+IHtcclxuICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBpZiAoIWNvbnRleHQgfHwgIWlzRWxlbWVudChjb250ZXh0KSkge1xyXG4gICAgY29udGV4dCA9IHdpbmRvdy5kb2N1bWVudDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnblxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc2VsZWN0aW9uID0gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc2VsZWN0aW9uKTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcclxuY29uc3QgQ09OVFJPTFMgPSAnYXJpYS1jb250cm9scyc7XHJcbmNvbnN0IEhJRERFTiA9ICdhcmlhLWhpZGRlbic7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IChidXR0b24sIGV4cGFuZGVkKSA9PiB7XHJcblxyXG4gIGlmICh0eXBlb2YgZXhwYW5kZWQgIT09ICdib29sZWFuJykge1xyXG4gICAgZXhwYW5kZWQgPSBidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ2ZhbHNlJztcclxuICB9XHJcbiAgYnV0dG9uLnNldEF0dHJpYnV0ZShFWFBBTkRFRCwgZXhwYW5kZWQpO1xyXG4gIGNvbnN0IGlkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShDT05UUk9MUyk7XHJcbiAgY29uc3QgY29udHJvbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgaWYgKCFjb250cm9scykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAnTm8gdG9nZ2xlIHRhcmdldCBmb3VuZCB3aXRoIGlkOiBcIicgKyBpZCArICdcIidcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb250cm9scy5zZXRBdHRyaWJ1dGUoSElEREVOLCAhZXhwYW5kZWQpO1xyXG4gIHJldHVybiBleHBhbmRlZDtcclxufTtcclxuIl19
