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

},{"../config":88,"../events":90,"../utils/active-element":97,"../utils/behavior":98,"../utils/is-ios-device":101,"../utils/select":102,"receptor":70}],76:[function(require,module,exports){
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

},{"../../Object/defineProperty":92}],92:[function(require,module,exports){
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

},{"object-assign":63,"receptor":70}],99:[function(require,module,exports){
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXJyYXktZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzc2xpc3QtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvZm4vYXJyYXkvZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19mdW5jdGlvbi10by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9rZXlib2FyZGV2ZW50LWtleS1wb2x5ZmlsbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGVzLXNlbGVjdG9yL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2JlaGF2aW9yLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jbG9zZXN0LmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9jb21wb3NlLmpzIiwibm9kZV9tb2R1bGVzL3JlY2VwdG9yL2xpYi9kZWxlZ2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvZGVsZWdhdGVBbGwuanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2lnbm9yZS5qcyIsIm5vZGVfbW9kdWxlcy9yZWNlcHRvci9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVjZXB0b3IvbGliL2tleW1hcC5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FsZXJ0LmpzIiwic3JjL2pzL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9kYXRlLXBpY2tlci5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Ryb3Bkb3duLXNvcnQuanMiLCJzcmMvanMvY29tcG9uZW50cy9kcm9wZG93bi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Vycm9yLXN1bW1hcnkuanMiLCJzcmMvanMvY29tcG9uZW50cy9tb2RhbC5qcyIsInNyYy9qcy9jb21wb25lbnRzL25hdmlnYXRpb24uanMiLCJzcmMvanMvY29tcG9uZW50cy9yYWRpby10b2dnbGUtY29udGVudC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3JlZ2V4LWlucHV0LW1hc2suanMiLCJzcmMvanMvY29tcG9uZW50cy9zZWxlY3RhYmxlLXRhYmxlLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdGFibGUuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJuYXYuanMiLCJzcmMvanMvY29tcG9uZW50cy90b2FzdC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3Rvb2x0aXAuanMiLCJzcmMvanMvY29uZmlnLmpzIiwic3JjL2pzL2RrZmRzLmpzIiwic3JjL2pzL2V2ZW50cy5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQuanMiLCJzcmMvanMvcG9seWZpbGxzL09iamVjdC9kZWZpbmVQcm9wZXJ0eS5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvY3VzdG9tLWV2ZW50LmpzIiwic3JjL2pzL3BvbHlmaWxscy9lbGVtZW50LWhpZGRlbi5qcyIsInNyYy9qcy9wb2x5ZmlsbHMvaW5kZXguanMiLCJzcmMvanMvcG9seWZpbGxzL251bWJlci1pcy1uYW4uanMiLCJzcmMvanMvdXRpbHMvYWN0aXZlLWVsZW1lbnQuanMiLCJzcmMvanMvdXRpbHMvYmVoYXZpb3IuanMiLCJzcmMvanMvdXRpbHMvYnJlYWtwb2ludHMuanMiLCJzcmMvanMvdXRpbHMvaXMtaW4tdmlld3BvcnQuanMiLCJzcmMvanMvdXRpbHMvaXMtaW9zLWRldmljZS5qcyIsInNyYy9qcy91dGlscy9zZWxlY3QuanMiLCJzcmMvanMvdXRpbHMvdG9nZ2xlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQVMsT0FBVCxDQUFrQixHQUFsQixFQUF1QixRQUF2QixFQUFpQyxPQUFqQyxFQUEwQztBQUN2RCxNQUFJLEdBQUcsQ0FBQyxPQUFSLEVBQWlC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QUFNLENBQUMsT0FBUCxHQUFpQixVQUFDLE1BQUQsRUFBUyxRQUFULEVBQXNCO0FBRXJDLE1BQUksT0FBTyxRQUFQLEtBQW9CLFNBQXhCLEVBQW1DO0FBQ2pDLElBQUEsUUFBUSxHQUFHLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFFBQXBCLE1BQWtDLE9BQTdDO0FBQ0Q7O0FBQ0QsRUFBQSxNQUFNLENBQUMsWUFBUCxDQUFvQixRQUFwQixFQUE4QixRQUE5QjtBQUNBLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFFBQXBCLENBQVg7QUFDQSxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixFQUF4QixDQUFqQjs7QUFDQSxNQUFJLENBQUMsUUFBTCxFQUFlO0FBQ2IsVUFBTSxJQUFJLEtBQUosQ0FDSixzQ0FBc0MsRUFBdEMsR0FBMkMsR0FEdkMsQ0FBTjtBQUdEOztBQUVELEVBQUEsUUFBUSxDQUFDLFlBQVQsQ0FBc0IsTUFBdEIsRUFBOEIsQ0FBQyxRQUEvQjtBQUNBLFNBQU8sUUFBUDtBQUNELENBaEJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBhcnJheS1mb3JlYWNoXG4gKiAgIEFycmF5I2ZvckVhY2ggcG9ueWZpbGwgZm9yIG9sZGVyIGJyb3dzZXJzXG4gKiAgIChQb255ZmlsbDogQSBwb2x5ZmlsbCB0aGF0IGRvZXNuJ3Qgb3ZlcndyaXRlIHRoZSBuYXRpdmUgbWV0aG9kKVxuICogXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdHdhZGEvYXJyYXktZm9yZWFjaFxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNS0yMDE2IFRha3V0byBXYWRhXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS90d2FkYS9hcnJheS1mb3JlYWNoL2Jsb2IvbWFzdGVyL01JVC1MSUNFTlNFXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmb3JFYWNoIChhcnksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgaWYgKGFyeS5mb3JFYWNoKSB7XG4gICAgICAgIGFyeS5mb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyeS5sZW5ndGg7IGkrPTEpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCBhcnlbaV0sIGksIGFyeSk7XG4gICAgfVxufTtcbiIsIi8qXG4gKiBjbGFzc0xpc3QuanM6IENyb3NzLWJyb3dzZXIgZnVsbCBlbGVtZW50LmNsYXNzTGlzdCBpbXBsZW1lbnRhdGlvbi5cbiAqIDEuMS4yMDE3MDQyN1xuICpcbiAqIEJ5IEVsaSBHcmV5LCBodHRwOi8vZWxpZ3JleS5jb21cbiAqIExpY2Vuc2U6IERlZGljYXRlZCB0byB0aGUgcHVibGljIGRvbWFpbi5cbiAqICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4gKi9cblxuLypnbG9iYWwgc2VsZiwgZG9jdW1lbnQsIERPTUV4Y2VwdGlvbiAqL1xuXG4vKiEgQHNvdXJjZSBodHRwOi8vcHVybC5lbGlncmV5LmNvbS9naXRodWIvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL2NsYXNzTGlzdC5qcyAqL1xuXG5pZiAoXCJkb2N1bWVudFwiIGluIHdpbmRvdy5zZWxmKSB7XG5cbi8vIEZ1bGwgcG9seWZpbGwgZm9yIGJyb3dzZXJzIHdpdGggbm8gY2xhc3NMaXN0IHN1cHBvcnRcbi8vIEluY2x1ZGluZyBJRSA8IEVkZ2UgbWlzc2luZyBTVkdFbGVtZW50LmNsYXNzTGlzdFxuaWYgKCEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKSkgXG5cdHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJiAhKFwiY2xhc3NMaXN0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcImdcIikpKSB7XG5cbihmdW5jdGlvbiAodmlldykge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuaWYgKCEoJ0VsZW1lbnQnIGluIHZpZXcpKSByZXR1cm47XG5cbnZhclxuXHQgIGNsYXNzTGlzdFByb3AgPSBcImNsYXNzTGlzdFwiXG5cdCwgcHJvdG9Qcm9wID0gXCJwcm90b3R5cGVcIlxuXHQsIGVsZW1DdHJQcm90byA9IHZpZXcuRWxlbWVudFtwcm90b1Byb3BdXG5cdCwgb2JqQ3RyID0gT2JqZWN0XG5cdCwgc3RyVHJpbSA9IFN0cmluZ1twcm90b1Byb3BdLnRyaW0gfHwgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpO1xuXHR9XG5cdCwgYXJySW5kZXhPZiA9IEFycmF5W3Byb3RvUHJvcF0uaW5kZXhPZiB8fCBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdHZhclxuXHRcdFx0ICBpID0gMFxuXHRcdFx0LCBsZW4gPSB0aGlzLmxlbmd0aFxuXHRcdDtcblx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRpZiAoaSBpbiB0aGlzICYmIHRoaXNbaV0gPT09IGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fVxuXHQvLyBWZW5kb3JzOiBwbGVhc2UgYWxsb3cgY29udGVudCBjb2RlIHRvIGluc3RhbnRpYXRlIERPTUV4Y2VwdGlvbnNcblx0LCBET01FeCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XG5cdFx0dGhpcy5uYW1lID0gdHlwZTtcblx0XHR0aGlzLmNvZGUgPSBET01FeGNlcHRpb25bdHlwZV07XG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0fVxuXHQsIGNoZWNrVG9rZW5BbmRHZXRJbmRleCA9IGZ1bmN0aW9uIChjbGFzc0xpc3QsIHRva2VuKSB7XG5cdFx0aWYgKHRva2VuID09PSBcIlwiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRE9NRXgoXG5cdFx0XHRcdCAgXCJTWU5UQVhfRVJSXCJcblx0XHRcdFx0LCBcIkFuIGludmFsaWQgb3IgaWxsZWdhbCBzdHJpbmcgd2FzIHNwZWNpZmllZFwiXG5cdFx0XHQpO1xuXHRcdH1cblx0XHRpZiAoL1xccy8udGVzdCh0b2tlbikpIHtcblx0XHRcdHRocm93IG5ldyBET01FeChcblx0XHRcdFx0ICBcIklOVkFMSURfQ0hBUkFDVEVSX0VSUlwiXG5cdFx0XHRcdCwgXCJTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXJcIlxuXHRcdFx0KTtcblx0XHR9XG5cdFx0cmV0dXJuIGFyckluZGV4T2YuY2FsbChjbGFzc0xpc3QsIHRva2VuKTtcblx0fVxuXHQsIENsYXNzTGlzdCA9IGZ1bmN0aW9uIChlbGVtKSB7XG5cdFx0dmFyXG5cdFx0XHQgIHRyaW1tZWRDbGFzc2VzID0gc3RyVHJpbS5jYWxsKGVsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgfHwgXCJcIilcblx0XHRcdCwgY2xhc3NlcyA9IHRyaW1tZWRDbGFzc2VzID8gdHJpbW1lZENsYXNzZXMuc3BsaXQoL1xccysvKSA6IFtdXG5cdFx0XHQsIGkgPSAwXG5cdFx0XHQsIGxlbiA9IGNsYXNzZXMubGVuZ3RoXG5cdFx0O1xuXHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdHRoaXMucHVzaChjbGFzc2VzW2ldKTtcblx0XHR9XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLnRvU3RyaW5nKCkpO1xuXHRcdH07XG5cdH1cblx0LCBjbGFzc0xpc3RQcm90byA9IENsYXNzTGlzdFtwcm90b1Byb3BdID0gW11cblx0LCBjbGFzc0xpc3RHZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIG5ldyBDbGFzc0xpc3QodGhpcyk7XG5cdH1cbjtcbi8vIE1vc3QgRE9NRXhjZXB0aW9uIGltcGxlbWVudGF0aW9ucyBkb24ndCBhbGxvdyBjYWxsaW5nIERPTUV4Y2VwdGlvbidzIHRvU3RyaW5nKClcbi8vIG9uIG5vbi1ET01FeGNlcHRpb25zLiBFcnJvcidzIHRvU3RyaW5nKCkgaXMgc3VmZmljaWVudCBoZXJlLlxuRE9NRXhbcHJvdG9Qcm9wXSA9IEVycm9yW3Byb3RvUHJvcF07XG5jbGFzc0xpc3RQcm90by5pdGVtID0gZnVuY3Rpb24gKGkpIHtcblx0cmV0dXJuIHRoaXNbaV0gfHwgbnVsbDtcbn07XG5jbGFzc0xpc3RQcm90by5jb250YWlucyA9IGZ1bmN0aW9uICh0b2tlbikge1xuXHR0b2tlbiArPSBcIlwiO1xuXHRyZXR1cm4gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSAhPT0gLTE7XG59O1xuY2xhc3NMaXN0UHJvdG8uYWRkID0gZnVuY3Rpb24gKCkge1xuXHR2YXJcblx0XHQgIHRva2VucyA9IGFyZ3VtZW50c1xuXHRcdCwgaSA9IDBcblx0XHQsIGwgPSB0b2tlbnMubGVuZ3RoXG5cdFx0LCB0b2tlblxuXHRcdCwgdXBkYXRlZCA9IGZhbHNlXG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpZiAoY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKSA9PT0gLTEpIHtcblx0XHRcdHRoaXMucHVzaCh0b2tlbik7XG5cdFx0XHR1cGRhdGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cblx0d2hpbGUgKCsraSA8IGwpO1xuXG5cdGlmICh1cGRhdGVkKSB7XG5cdFx0dGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG5cdH1cbn07XG5jbGFzc0xpc3RQcm90by5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdHZhclxuXHRcdCAgdG9rZW5zID0gYXJndW1lbnRzXG5cdFx0LCBpID0gMFxuXHRcdCwgbCA9IHRva2Vucy5sZW5ndGhcblx0XHQsIHRva2VuXG5cdFx0LCB1cGRhdGVkID0gZmFsc2Vcblx0XHQsIGluZGV4XG5cdDtcblx0ZG8ge1xuXHRcdHRva2VuID0gdG9rZW5zW2ldICsgXCJcIjtcblx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0d2hpbGUgKGluZGV4ICE9PSAtMSkge1xuXHRcdFx0dGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0dXBkYXRlZCA9IHRydWU7XG5cdFx0XHRpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG5cdFx0fVxuXHR9XG5cdHdoaWxlICgrK2kgPCBsKTtcblxuXHRpZiAodXBkYXRlZCkge1xuXHRcdHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSgpO1xuXHR9XG59O1xuY2xhc3NMaXN0UHJvdG8udG9nZ2xlID0gZnVuY3Rpb24gKHRva2VuLCBmb3JjZSkge1xuXHR0b2tlbiArPSBcIlwiO1xuXG5cdHZhclxuXHRcdCAgcmVzdWx0ID0gdGhpcy5jb250YWlucyh0b2tlbilcblx0XHQsIG1ldGhvZCA9IHJlc3VsdCA/XG5cdFx0XHRmb3JjZSAhPT0gdHJ1ZSAmJiBcInJlbW92ZVwiXG5cdFx0OlxuXHRcdFx0Zm9yY2UgIT09IGZhbHNlICYmIFwiYWRkXCJcblx0O1xuXG5cdGlmIChtZXRob2QpIHtcblx0XHR0aGlzW21ldGhvZF0odG9rZW4pO1xuXHR9XG5cblx0aWYgKGZvcmNlID09PSB0cnVlIHx8IGZvcmNlID09PSBmYWxzZSkge1xuXHRcdHJldHVybiBmb3JjZTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gIXJlc3VsdDtcblx0fVxufTtcbmNsYXNzTGlzdFByb3RvLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5qb2luKFwiIFwiKTtcbn07XG5cbmlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcblx0dmFyIGNsYXNzTGlzdFByb3BEZXNjID0ge1xuXHRcdCAgZ2V0OiBjbGFzc0xpc3RHZXR0ZXJcblx0XHQsIGVudW1lcmFibGU6IHRydWVcblx0XHQsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHR9O1xuXHR0cnkge1xuXHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0fSBjYXRjaCAoZXgpIHsgLy8gSUUgOCBkb2Vzbid0IHN1cHBvcnQgZW51bWVyYWJsZTp0cnVlXG5cdFx0Ly8gYWRkaW5nIHVuZGVmaW5lZCB0byBmaWdodCB0aGlzIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGlncmV5L2NsYXNzTGlzdC5qcy9pc3N1ZXMvMzZcblx0XHQvLyBtb2Rlcm5pZSBJRTgtTVNXNyBtYWNoaW5lIGhhcyBJRTggOC4wLjYwMDEuMTg3MDIgYW5kIGlzIGFmZmVjdGVkXG5cdFx0aWYgKGV4Lm51bWJlciA9PT0gdW5kZWZpbmVkIHx8IGV4Lm51bWJlciA9PT0gLTB4N0ZGNUVDNTQpIHtcblx0XHRcdGNsYXNzTGlzdFByb3BEZXNjLmVudW1lcmFibGUgPSBmYWxzZTtcblx0XHRcdG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcblx0XHR9XG5cdH1cbn0gZWxzZSBpZiAob2JqQ3RyW3Byb3RvUHJvcF0uX19kZWZpbmVHZXR0ZXJfXykge1xuXHRlbGVtQ3RyUHJvdG8uX19kZWZpbmVHZXR0ZXJfXyhjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RHZXR0ZXIpO1xufVxuXG59KHdpbmRvdy5zZWxmKSk7XG5cbn1cblxuLy8gVGhlcmUgaXMgZnVsbCBvciBwYXJ0aWFsIG5hdGl2ZSBjbGFzc0xpc3Qgc3VwcG9ydCwgc28ganVzdCBjaGVjayBpZiB3ZSBuZWVkXG4vLyB0byBub3JtYWxpemUgdGhlIGFkZC9yZW1vdmUgYW5kIHRvZ2dsZSBBUElzLlxuXG4oZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtcblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYzFcIiwgXCJjMlwiKTtcblxuXHQvLyBQb2x5ZmlsbCBmb3IgSUUgMTAvMTEgYW5kIEZpcmVmb3ggPDI2LCB3aGVyZSBjbGFzc0xpc3QuYWRkIGFuZFxuXHQvLyBjbGFzc0xpc3QucmVtb3ZlIGV4aXN0IGJ1dCBzdXBwb3J0IG9ubHkgb25lIGFyZ3VtZW50IGF0IGEgdGltZS5cblx0aWYgKCF0ZXN0RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJjMlwiKSkge1xuXHRcdHZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QpIHtcblx0XHRcdHZhciBvcmlnaW5hbCA9IERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXTtcblxuXHRcdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odG9rZW4pIHtcblx0XHRcdFx0dmFyIGksIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdFx0dG9rZW4gPSBhcmd1bWVudHNbaV07XG5cdFx0XHRcdFx0b3JpZ2luYWwuY2FsbCh0aGlzLCB0b2tlbik7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblx0XHRjcmVhdGVNZXRob2QoJ2FkZCcpO1xuXHRcdGNyZWF0ZU1ldGhvZCgncmVtb3ZlJyk7XG5cdH1cblxuXHR0ZXN0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYzNcIiwgZmFsc2UpO1xuXG5cdC8vIFBvbHlmaWxsIGZvciBJRSAxMCBhbmQgRmlyZWZveCA8MjQsIHdoZXJlIGNsYXNzTGlzdC50b2dnbGUgZG9lcyBub3Rcblx0Ly8gc3VwcG9ydCB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuXHRpZiAodGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzNcIikpIHtcblx0XHR2YXIgX3RvZ2dsZSA9IERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlO1xuXG5cdFx0RE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbih0b2tlbiwgZm9yY2UpIHtcblx0XHRcdGlmICgxIGluIGFyZ3VtZW50cyAmJiAhdGhpcy5jb250YWlucyh0b2tlbikgPT09ICFmb3JjZSkge1xuXHRcdFx0XHRyZXR1cm4gZm9yY2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gX3RvZ2dsZS5jYWxsKHRoaXMsIHRva2VuKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdH1cblxuXHR0ZXN0RWxlbWVudCA9IG51bGw7XG59KCkpO1xuXG59XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LmFycmF5LmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLkFycmF5LmZyb207XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3QuYXNzaWduO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pIHtcbiAgICAgIGlmIChPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBBUkcgPSBjb2YoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi42LjEyJyB9O1xuaWYgKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpIF9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIGluZGV4LCB2YWx1ZSkge1xuICBpZiAoaW5kZXggaW4gb2JqZWN0KSAkZGVmaW5lUHJvcGVydHkuZihvYmplY3QsIGluZGV4LCBjcmVhdGVEZXNjKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W2luZGV4XSA9IHZhbHVlO1xufTtcbiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCB0aGF0LCBsZW5ndGgpIHtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYgKHRoYXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZuO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoLyogLi4uYXJncyAqLykge1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTtcbiIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG4vLyB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0JyBpbiBvbGQgSUVcbnZhciBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIHRhcmdldCA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSB8fCAoZ2xvYmFsW25hbWVdID0ge30pIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSk7XG4gIHZhciBrZXksIG93biwgb3V0LCBleHA7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZXhwID0gSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIGlmICh0YXJnZXQpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBvdXQsIHR5cGUgJiAkZXhwb3J0LlUpO1xuICAgIC8vIGV4cG9ydFxuICAgIGlmIChleHBvcnRzW2tleV0gIT0gb3V0KSBoaWRlKGV4cG9ydHMsIGtleSwgZXhwKTtcbiAgICBpZiAoSVNfUFJPVE8gJiYgZXhwUHJvdG9ba2V5XSAhPSBvdXQpIGV4cFByb3RvW2tleV0gPSBvdXQ7XG4gIH1cbn07XG5nbG9iYWwuY29yZSA9IGNvcmU7XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCduYXRpdmUtZnVuY3Rpb24tdG8tc3RyaW5nJywgRnVuY3Rpb24udG9TdHJpbmcpO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTtcbiIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyICRpdGVyQ3JlYXRlID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBCVUdHWSA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKTsgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxudmFyIEZGX0lURVJBVE9SID0gJ0BAaXRlcmF0b3InO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgaWYgKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKSByZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgdmFyIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFUztcbiAgdmFyIFZBTFVFU19CVUcgPSBmYWxzZTtcbiAgdmFyIHByb3RvID0gQmFzZS5wcm90b3R5cGU7XG4gIHZhciAkbmF0aXZlID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdO1xuICB2YXIgJGRlZmF1bHQgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKTtcbiAgdmFyICRlbnRyaWVzID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZDtcbiAgdmFyICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlO1xuICB2YXIgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZiAoJGFueU5hdGl2ZSkge1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUgJiYgSXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmICghTElCUkFSWSAmJiB0eXBlb2YgSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdICE9ICdmdW5jdGlvbicpIGhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSkge1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gPSByZXR1cm5UaGlzO1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChrZXkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKCEoa2V5IGluIHByb3RvKSkgcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcbiIsInZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uICgpIHsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRocm93LWxpdGVyYWxcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjLCBza2lwQ2xvc2luZykge1xuICBpZiAoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gWzddO1xuICAgIHZhciBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgZG9uZTogc2FmZSA9IHRydWUgfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciAkYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICB2YXIgQSA9IHt9O1xuICB2YXIgQiA9IHt9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgdmFyIFMgPSBTeW1ib2woKTtcbiAgdmFyIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAoaykgeyBCW2tdID0gazsgfSk7XG4gIHJldHVybiAkYXNzaWduKHt9LCBBKVtTXSAhPSA3IHx8IE9iamVjdC5rZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBLO1xufSkgPyBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCA9IHRvT2JqZWN0KHRhcmdldCk7XG4gIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgd2hpbGUgKGFMZW4gPiBpbmRleCkge1xuICAgIHZhciBTID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHZhciBrZXlzID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGopIHtcbiAgICAgIGtleSA9IGtleXNbaisrXTtcbiAgICAgIGlmICghREVTQ1JJUFRPUlMgfHwgaXNFbnVtLmNhbGwoUywga2V5KSkgVFtrZXldID0gU1trZXldO1xuICAgIH1cbiAgfSByZXR1cm4gVDtcbn0gOiAkYXNzaWduO1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IGdldEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgUDtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFNSQyA9IHJlcXVpcmUoJy4vX3VpZCcpKCdzcmMnKTtcbnZhciAkdG9TdHJpbmcgPSByZXF1aXJlKCcuL19mdW5jdGlvbi10by1zdHJpbmcnKTtcbnZhciBUT19TVFJJTkcgPSAndG9TdHJpbmcnO1xudmFyIFRQTCA9ICgnJyArICR0b1N0cmluZykuc3BsaXQoVE9fU1RSSU5HKTtcblxucmVxdWlyZSgnLi9fY29yZScpLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuICR0b1N0cmluZy5jYWxsKGl0KTtcbn07XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBrZXksIHZhbCwgc2FmZSkge1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJztcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsICduYW1lJykgfHwgaGlkZSh2YWwsICduYW1lJywga2V5KTtcbiAgaWYgKE9ba2V5XSA9PT0gdmFsKSByZXR1cm47XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCBTUkMpIHx8IGhpZGUodmFsLCBTUkMsIE9ba2V5XSA/ICcnICsgT1trZXldIDogVFBMLmpvaW4oU3RyaW5nKGtleSkpKTtcbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIGlmICghc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH0gZWxzZSBpZiAoT1trZXldKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2Uge1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgJiYgdGhpc1tTUkNdIHx8ICR0b1N0cmluZy5jYWxsKHRoaXMpO1xufSk7XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiBjb3JlLnZlcnNpb24sXG4gIG1vZGU6IHJlcXVpcmUoJy4vX2xpYnJhcnknKSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDIwIERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJ2YXIgc3RvcmUgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sO1xudmFyIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSAvKiAsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkICovKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdChhcnJheUxpa2UpO1xuICAgIHZhciBDID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheTtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG1hcGZuID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihPKTtcbiAgICB2YXIgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmIChtYXBwaW5nKSBtYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmIChpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSkge1xuICAgICAgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQygpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IgKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7IGFzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCIvKiBnbG9iYWwgZGVmaW5lLCBLZXlib2FyZEV2ZW50LCBtb2R1bGUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblxuICB2YXIga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsID0ge1xuICAgIHBvbHlmaWxsOiBwb2x5ZmlsbCxcbiAgICBrZXlzOiB7XG4gICAgICAzOiAnQ2FuY2VsJyxcbiAgICAgIDY6ICdIZWxwJyxcbiAgICAgIDg6ICdCYWNrc3BhY2UnLFxuICAgICAgOTogJ1RhYicsXG4gICAgICAxMjogJ0NsZWFyJyxcbiAgICAgIDEzOiAnRW50ZXInLFxuICAgICAgMTY6ICdTaGlmdCcsXG4gICAgICAxNzogJ0NvbnRyb2wnLFxuICAgICAgMTg6ICdBbHQnLFxuICAgICAgMTk6ICdQYXVzZScsXG4gICAgICAyMDogJ0NhcHNMb2NrJyxcbiAgICAgIDI3OiAnRXNjYXBlJyxcbiAgICAgIDI4OiAnQ29udmVydCcsXG4gICAgICAyOTogJ05vbkNvbnZlcnQnLFxuICAgICAgMzA6ICdBY2NlcHQnLFxuICAgICAgMzE6ICdNb2RlQ2hhbmdlJyxcbiAgICAgIDMyOiAnICcsXG4gICAgICAzMzogJ1BhZ2VVcCcsXG4gICAgICAzNDogJ1BhZ2VEb3duJyxcbiAgICAgIDM1OiAnRW5kJyxcbiAgICAgIDM2OiAnSG9tZScsXG4gICAgICAzNzogJ0Fycm93TGVmdCcsXG4gICAgICAzODogJ0Fycm93VXAnLFxuICAgICAgMzk6ICdBcnJvd1JpZ2h0JyxcbiAgICAgIDQwOiAnQXJyb3dEb3duJyxcbiAgICAgIDQxOiAnU2VsZWN0JyxcbiAgICAgIDQyOiAnUHJpbnQnLFxuICAgICAgNDM6ICdFeGVjdXRlJyxcbiAgICAgIDQ0OiAnUHJpbnRTY3JlZW4nLFxuICAgICAgNDU6ICdJbnNlcnQnLFxuICAgICAgNDY6ICdEZWxldGUnLFxuICAgICAgNDg6IFsnMCcsICcpJ10sXG4gICAgICA0OTogWycxJywgJyEnXSxcbiAgICAgIDUwOiBbJzInLCAnQCddLFxuICAgICAgNTE6IFsnMycsICcjJ10sXG4gICAgICA1MjogWyc0JywgJyQnXSxcbiAgICAgIDUzOiBbJzUnLCAnJSddLFxuICAgICAgNTQ6IFsnNicsICdeJ10sXG4gICAgICA1NTogWyc3JywgJyYnXSxcbiAgICAgIDU2OiBbJzgnLCAnKiddLFxuICAgICAgNTc6IFsnOScsICcoJ10sXG4gICAgICA5MTogJ09TJyxcbiAgICAgIDkzOiAnQ29udGV4dE1lbnUnLFxuICAgICAgMTQ0OiAnTnVtTG9jaycsXG4gICAgICAxNDU6ICdTY3JvbGxMb2NrJyxcbiAgICAgIDE4MTogJ1ZvbHVtZU11dGUnLFxuICAgICAgMTgyOiAnVm9sdW1lRG93bicsXG4gICAgICAxODM6ICdWb2x1bWVVcCcsXG4gICAgICAxODY6IFsnOycsICc6J10sXG4gICAgICAxODc6IFsnPScsICcrJ10sXG4gICAgICAxODg6IFsnLCcsICc8J10sXG4gICAgICAxODk6IFsnLScsICdfJ10sXG4gICAgICAxOTA6IFsnLicsICc+J10sXG4gICAgICAxOTE6IFsnLycsICc/J10sXG4gICAgICAxOTI6IFsnYCcsICd+J10sXG4gICAgICAyMTk6IFsnWycsICd7J10sXG4gICAgICAyMjA6IFsnXFxcXCcsICd8J10sXG4gICAgICAyMjE6IFsnXScsICd9J10sXG4gICAgICAyMjI6IFtcIidcIiwgJ1wiJ10sXG4gICAgICAyMjQ6ICdNZXRhJyxcbiAgICAgIDIyNTogJ0FsdEdyYXBoJyxcbiAgICAgIDI0NjogJ0F0dG4nLFxuICAgICAgMjQ3OiAnQ3JTZWwnLFxuICAgICAgMjQ4OiAnRXhTZWwnLFxuICAgICAgMjQ5OiAnRXJhc2VFb2YnLFxuICAgICAgMjUwOiAnUGxheScsXG4gICAgICAyNTE6ICdab29tT3V0J1xuICAgIH1cbiAgfTtcblxuICAvLyBGdW5jdGlvbiBrZXlzIChGMS0yNCkuXG4gIHZhciBpO1xuICBmb3IgKGkgPSAxOyBpIDwgMjU7IGkrKykge1xuICAgIGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbC5rZXlzWzExMSArIGldID0gJ0YnICsgaTtcbiAgfVxuXG4gIC8vIFByaW50YWJsZSBBU0NJSSBjaGFyYWN0ZXJzLlxuICB2YXIgbGV0dGVyID0gJyc7XG4gIGZvciAoaSA9IDY1OyBpIDwgOTE7IGkrKykge1xuICAgIGxldHRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG4gICAga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsLmtleXNbaV0gPSBbbGV0dGVyLnRvTG93ZXJDYXNlKCksIGxldHRlci50b1VwcGVyQ2FzZSgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBvbHlmaWxsICgpIHtcbiAgICBpZiAoISgnS2V5Ym9hcmRFdmVudCcgaW4gd2luZG93KSB8fFxuICAgICAgICAna2V5JyBpbiBLZXlib2FyZEV2ZW50LnByb3RvdHlwZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFBvbHlmaWxsIGBrZXlgIG9uIGBLZXlib2FyZEV2ZW50YC5cbiAgICB2YXIgcHJvdG8gPSB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlib2FyZGV2ZW50S2V5UG9seWZpbGwua2V5c1t0aGlzLndoaWNoIHx8IHRoaXMua2V5Q29kZV07XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgIGtleSA9IGtleVsrdGhpcy5zaGlmdEtleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgfVxuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEtleWJvYXJkRXZlbnQucHJvdG90eXBlLCAna2V5JywgcHJvdG8pO1xuICAgIHJldHVybiBwcm90bztcbiAgfVxuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ2tleWJvYXJkZXZlbnQta2V5LXBvbHlmaWxsJywga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGtleWJvYXJkZXZlbnRLZXlQb2x5ZmlsbDtcbiAgfSBlbHNlIGlmICh3aW5kb3cpIHtcbiAgICB3aW5kb3cua2V5Ym9hcmRldmVudEtleVBvbHlmaWxsID0ga2V5Ym9hcmRldmVudEtleVBvbHlmaWxsO1xuICB9XG5cbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBwcm90byA9IHR5cGVvZiBFbGVtZW50ICE9PSAndW5kZWZpbmVkJyA/IEVsZW1lbnQucHJvdG90eXBlIDoge307XG52YXIgdmVuZG9yID0gcHJvdG8ubWF0Y2hlc1xuICB8fCBwcm90by5tYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLm1vek1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5tc01hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5vTWF0Y2hlc1NlbGVjdG9yO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoO1xuXG4vKipcbiAqIE1hdGNoIGBlbGAgdG8gYHNlbGVjdG9yYC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIG1hdGNoKGVsLCBzZWxlY3Rvcikge1xuICBpZiAoIWVsIHx8IGVsLm5vZGVUeXBlICE9PSAxKSByZXR1cm4gZmFsc2U7XG4gIGlmICh2ZW5kb3IpIHJldHVybiB2ZW5kb3IuY2FsbChlbCwgc2VsZWN0b3IpO1xuICB2YXIgbm9kZXMgPSBlbC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG5vZGVzW2ldID09IGVsKSByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4iLCIvKlxub2JqZWN0LWFzc2lnblxuKGMpIFNpbmRyZSBTb3JodXNcbkBsaWNlbnNlIE1JVFxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXctd3JhcHBlcnNcblx0XHR0ZXN0MVs1XSA9ICdkZSc7XG5cdFx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXSA9PT0gJzUnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MiA9IHt9O1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgMTA7IGkrKykge1xuXHRcdFx0dGVzdDJbJ18nICsgU3RyaW5nLmZyb21DaGFyQ29kZShpKV0gPSBpO1xuXHRcdH1cblx0XHR2YXIgb3JkZXIyID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdFx0cmV0dXJuIHRlc3QyW25dO1xuXHRcdH0pO1xuXHRcdGlmIChvcmRlcjIuam9pbignJykgIT09ICcwMTIzNDU2Nzg5Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDMgPSB7fTtcblx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChsZXR0ZXIpIHtcblx0XHRcdHRlc3QzW2xldHRlcl0gPSBsZXR0ZXI7XG5cdFx0fSk7XG5cdFx0aWYgKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sIHRlc3QzKSkuam9pbignJykgIT09XG5cdFx0XHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzeW1ib2xzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSwgc3ltYm9sc1tpXSkpIHtcblx0XHRcdFx0XHR0b1tzeW1ib2xzW2ldXSA9IGZyb21bc3ltYm9sc1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwiY29uc3QgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuY29uc3QgZGVsZWdhdGUgPSByZXF1aXJlKCcuL2RlbGVnYXRlJyk7XG5jb25zdCBkZWxlZ2F0ZUFsbCA9IHJlcXVpcmUoJy4vZGVsZWdhdGVBbGwnKTtcblxuY29uc3QgREVMRUdBVEVfUEFUVEVSTiA9IC9eKC4rKTpkZWxlZ2F0ZVxcKCguKylcXCkkLztcbmNvbnN0IFNQQUNFID0gJyAnO1xuXG5jb25zdCBnZXRMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlLCBoYW5kbGVyKSB7XG4gIHZhciBtYXRjaCA9IHR5cGUubWF0Y2goREVMRUdBVEVfUEFUVEVSTik7XG4gIHZhciBzZWxlY3RvcjtcbiAgaWYgKG1hdGNoKSB7XG4gICAgdHlwZSA9IG1hdGNoWzFdO1xuICAgIHNlbGVjdG9yID0gbWF0Y2hbMl07XG4gIH1cblxuICB2YXIgb3B0aW9ucztcbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnb2JqZWN0Jykge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBjYXB0dXJlOiBwb3BLZXkoaGFuZGxlciwgJ2NhcHR1cmUnKSxcbiAgICAgIHBhc3NpdmU6IHBvcEtleShoYW5kbGVyLCAncGFzc2l2ZScpXG4gICAgfTtcbiAgfVxuXG4gIHZhciBsaXN0ZW5lciA9IHtcbiAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXG4gICAgZGVsZWdhdGU6ICh0eXBlb2YgaGFuZGxlciA9PT0gJ29iamVjdCcpXG4gICAgICA/IGRlbGVnYXRlQWxsKGhhbmRsZXIpXG4gICAgICA6IHNlbGVjdG9yXG4gICAgICAgID8gZGVsZWdhdGUoc2VsZWN0b3IsIGhhbmRsZXIpXG4gICAgICAgIDogaGFuZGxlcixcbiAgICBvcHRpb25zOiBvcHRpb25zXG4gIH07XG5cbiAgaWYgKHR5cGUuaW5kZXhPZihTUEFDRSkgPiAtMSkge1xuICAgIHJldHVybiB0eXBlLnNwbGl0KFNQQUNFKS5tYXAoZnVuY3Rpb24oX3R5cGUpIHtcbiAgICAgIHJldHVybiBhc3NpZ24oe3R5cGU6IF90eXBlfSwgbGlzdGVuZXIpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGxpc3RlbmVyLnR5cGUgPSB0eXBlO1xuICAgIHJldHVybiBbbGlzdGVuZXJdO1xuICB9XG59O1xuXG52YXIgcG9wS2V5ID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gIGRlbGV0ZSBvYmpba2V5XTtcbiAgcmV0dXJuIHZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiZWhhdmlvcihldmVudHMsIHByb3BzKSB7XG4gIGNvbnN0IGxpc3RlbmVycyA9IE9iamVjdC5rZXlzKGV2ZW50cylcbiAgICAucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHR5cGUpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMgPSBnZXRMaXN0ZW5lcnModHlwZSwgZXZlbnRzW3R5cGVdKTtcbiAgICAgIHJldHVybiBtZW1vLmNvbmNhdChsaXN0ZW5lcnMpO1xuICAgIH0sIFtdKTtcblxuICByZXR1cm4gYXNzaWduKHtcbiAgICBhZGQ6IGZ1bmN0aW9uIGFkZEJlaGF2aW9yKGVsZW1lbnQpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBsaXN0ZW5lci50eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmRlbGVnYXRlLFxuICAgICAgICAgIGxpc3RlbmVyLm9wdGlvbnNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmVCZWhhdmlvcihlbGVtZW50KSB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgbGlzdGVuZXIudHlwZSxcbiAgICAgICAgICBsaXN0ZW5lci5kZWxlZ2F0ZSxcbiAgICAgICAgICBsaXN0ZW5lci5vcHRpb25zXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHByb3BzKTtcbn07XG4iLCJjb25zdCBtYXRjaGVzID0gcmVxdWlyZSgnbWF0Y2hlcy1zZWxlY3RvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gIGRvIHtcbiAgICBpZiAobWF0Y2hlcyhlbGVtZW50LCBzZWxlY3RvcikpIHtcbiAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cbiAgfSB3aGlsZSAoKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IDEpO1xufTtcblxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21wb3NlKGZ1bmN0aW9ucykge1xuICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiBmdW5jdGlvbnMuc29tZShmdW5jdGlvbihmbikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZSkgPT09IGZhbHNlO1xuICAgIH0sIHRoaXMpO1xuICB9O1xufTtcbiIsImNvbnN0IGNsb3Nlc3QgPSByZXF1aXJlKCcuL2Nsb3Nlc3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWxlZ2F0ZShzZWxlY3RvciwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlbGVnYXRpb24oZXZlbnQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gY2xvc2VzdChldmVudC50YXJnZXQsIHNlbGVjdG9yKTtcbiAgICBpZiAodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0YXJnZXQsIGV2ZW50KTtcbiAgICB9XG4gIH1cbn07XG4iLCJjb25zdCBkZWxlZ2F0ZSA9IHJlcXVpcmUoJy4vZGVsZWdhdGUnKTtcbmNvbnN0IGNvbXBvc2UgPSByZXF1aXJlKCcuL2NvbXBvc2UnKTtcblxuY29uc3QgU1BMQVQgPSAnKic7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVsZWdhdGVBbGwoc2VsZWN0b3JzKSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhzZWxlY3RvcnMpXG5cbiAgLy8gWFhYIG9wdGltaXphdGlvbjogaWYgdGhlcmUgaXMgb25seSBvbmUgaGFuZGxlciBhbmQgaXQgYXBwbGllcyB0b1xuICAvLyBhbGwgZWxlbWVudHMgKHRoZSBcIipcIiBDU1Mgc2VsZWN0b3IpLCB0aGVuIGp1c3QgcmV0dXJuIHRoYXRcbiAgLy8gaGFuZGxlclxuICBpZiAoa2V5cy5sZW5ndGggPT09IDEgJiYga2V5c1swXSA9PT0gU1BMQVQpIHtcbiAgICByZXR1cm4gc2VsZWN0b3JzW1NQTEFUXTtcbiAgfVxuXG4gIGNvbnN0IGRlbGVnYXRlcyA9IGtleXMucmVkdWNlKGZ1bmN0aW9uKG1lbW8sIHNlbGVjdG9yKSB7XG4gICAgbWVtby5wdXNoKGRlbGVnYXRlKHNlbGVjdG9yLCBzZWxlY3RvcnNbc2VsZWN0b3JdKSk7XG4gICAgcmV0dXJuIG1lbW87XG4gIH0sIFtdKTtcbiAgcmV0dXJuIGNvbXBvc2UoZGVsZWdhdGVzKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlnbm9yZShlbGVtZW50LCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gaWdub3JhbmNlKGUpIHtcbiAgICBpZiAoZWxlbWVudCAhPT0gZS50YXJnZXQgJiYgIWVsZW1lbnQuY29udGFpbnMoZS50YXJnZXQpKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBlKTtcbiAgICB9XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYmVoYXZpb3I6IHJlcXVpcmUoJy4vYmVoYXZpb3InKSxcbiAgZGVsZWdhdGU6IHJlcXVpcmUoJy4vZGVsZWdhdGUnKSxcbiAgZGVsZWdhdGVBbGw6IHJlcXVpcmUoJy4vZGVsZWdhdGVBbGwnKSxcbiAgaWdub3JlOiByZXF1aXJlKCcuL2lnbm9yZScpLFxuICBrZXltYXA6IHJlcXVpcmUoJy4va2V5bWFwJyksXG59O1xuIiwicmVxdWlyZSgna2V5Ym9hcmRldmVudC1rZXktcG9seWZpbGwnKTtcblxuLy8gdGhlc2UgYXJlIHRoZSBvbmx5IHJlbGV2YW50IG1vZGlmaWVycyBzdXBwb3J0ZWQgb24gYWxsIHBsYXRmb3Jtcyxcbi8vIGFjY29yZGluZyB0byBNRE46XG4vLyA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0tleWJvYXJkRXZlbnQvZ2V0TW9kaWZpZXJTdGF0ZT5cbmNvbnN0IE1PRElGSUVSUyA9IHtcbiAgJ0FsdCc6ICAgICAgJ2FsdEtleScsXG4gICdDb250cm9sJzogICdjdHJsS2V5JyxcbiAgJ0N0cmwnOiAgICAgJ2N0cmxLZXknLFxuICAnU2hpZnQnOiAgICAnc2hpZnRLZXknXG59O1xuXG5jb25zdCBNT0RJRklFUl9TRVBBUkFUT1IgPSAnKyc7XG5cbmNvbnN0IGdldEV2ZW50S2V5ID0gZnVuY3Rpb24oZXZlbnQsIGhhc01vZGlmaWVycykge1xuICB2YXIga2V5ID0gZXZlbnQua2V5O1xuICBpZiAoaGFzTW9kaWZpZXJzKSB7XG4gICAgZm9yICh2YXIgbW9kaWZpZXIgaW4gTU9ESUZJRVJTKSB7XG4gICAgICBpZiAoZXZlbnRbTU9ESUZJRVJTW21vZGlmaWVyXV0gPT09IHRydWUpIHtcbiAgICAgICAga2V5ID0gW21vZGlmaWVyLCBrZXldLmpvaW4oTU9ESUZJRVJfU0VQQVJBVE9SKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGtleTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ga2V5bWFwKGtleXMpIHtcbiAgY29uc3QgaGFzTW9kaWZpZXJzID0gT2JqZWN0LmtleXMoa2V5cykuc29tZShmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4ga2V5LmluZGV4T2YoTU9ESUZJRVJfU0VQQVJBVE9SKSA+IC0xO1xuICB9KTtcbiAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGtleSA9IGdldEV2ZW50S2V5KGV2ZW50LCBoYXNNb2RpZmllcnMpO1xuICAgIHJldHVybiBba2V5LCBrZXkudG9Mb3dlckNhc2UoKV1cbiAgICAgIC5yZWR1Y2UoZnVuY3Rpb24ocmVzdWx0LCBfa2V5KSB7XG4gICAgICAgIGlmIChfa2V5IGluIGtleXMpIHtcbiAgICAgICAgICByZXN1bHQgPSBrZXlzW2tleV0uY2FsbCh0aGlzLCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0sIHVuZGVmaW5lZCk7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5NT0RJRklFUlMgPSBNT0RJRklFUlM7XG4iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCAnLi4vcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kJztcclxuY29uc3QgdG9nZ2xlID0gcmVxdWlyZSgnLi4vdXRpbHMvdG9nZ2xlJyk7XHJcbmNvbnN0IGlzRWxlbWVudEluVmlld3BvcnQgPSByZXF1aXJlKCcuLi91dGlscy9pcy1pbi12aWV3cG9ydCcpO1xyXG5jb25zdCBCVVRUT04gPSBgLmFjY29yZGlvbi1idXR0b25bYXJpYS1jb250cm9sc11gO1xyXG5jb25zdCBFWFBBTkRFRCA9ICdhcmlhLWV4cGFuZGVkJztcclxuY29uc3QgTVVMVElTRUxFQ1RBQkxFID0gJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJztcclxuY29uc3QgTVVMVElTRUxFQ1RBQkxFX0NMQVNTID0gJ2FjY29yZGlvbi1tdWx0aXNlbGVjdGFibGUnO1xyXG5jb25zdCBCVUxLX0ZVTkNUSU9OX09QRU5fVEVYVCA9IFwiw4VibiBhbGxlXCI7XHJcbmNvbnN0IEJVTEtfRlVOQ1RJT05fQ0xPU0VfVEVYVCA9IFwiTHVrIGFsbGVcIjtcclxuY29uc3QgQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFID0gXCJkYXRhLWFjY29yZGlvbi1idWxrLWV4cGFuZFwiO1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgY2xpY2sgZnVuY3Rpb25hbGl0eSB0byBhY2NvcmRpb24gbGlzdFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkYWNjb3JkaW9uIHRoZSBhY2NvcmRpb24gdWwgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gQWNjb3JkaW9uKCRhY2NvcmRpb24pe1xyXG4gIGlmKCEkYWNjb3JkaW9uKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBhY2NvcmRpb24gZ3JvdXAgZWxlbWVudGApO1xyXG4gIH1cclxuICB0aGlzLmFjY29yZGlvbiA9ICRhY2NvcmRpb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRsaXN0ZW5lcnMgb24gY2xpY2sgZWxlbWVudHMgaW4gYWNjb3JkaW9uIGxpc3RcclxuICovXHJcbkFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5idXR0b25zID0gdGhpcy5hY2NvcmRpb24ucXVlcnlTZWxlY3RvckFsbChCVVRUT04pO1xyXG4gIGlmKHRoaXMuYnV0dG9ucy5sZW5ndGggPT0gMCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgYWNjb3JkaW9uIGJ1dHRvbnNgKTtcclxuICB9XHJcblxyXG4gIC8vIGxvb3AgYnV0dG9ucyBpbiBsaXN0XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKyspe1xyXG4gICAgbGV0IGN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnNbaV07XHJcbiAgICBcclxuICAgIC8vIFZlcmlmeSBzdGF0ZSBvbiBidXR0b24gYW5kIHN0YXRlIG9uIHBhbmVsXHJcbiAgICBsZXQgZXhwYW5kZWQgPSBjdXJyZW50QnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICd0cnVlJztcclxuICAgIHRoaXMudG9nZ2xlQnV0dG9uKGN1cnJlbnRCdXR0b24sIGV4cGFuZGVkKTtcclxuICAgIFxyXG4gICAgLy8gU2V0IGNsaWNrIGV2ZW50IG9uIGFjY29yZGlvbiBidXR0b25zXHJcbiAgICBjdXJyZW50QnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5ldmVudE9uQ2xpY2suYmluZCh0aGlzLCBjdXJyZW50QnV0dG9uKSwgZmFsc2UpO1xyXG4gICAgY3VycmVudEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZXZlbnRPbkNsaWNrLmJpbmQodGhpcywgY3VycmVudEJ1dHRvbiksIGZhbHNlKTtcclxuICB9XHJcbiAgLy8gU2V0IGNsaWNrIGV2ZW50IG9uIGJ1bGsgYnV0dG9uIGlmIHByZXNlbnRcclxuICBsZXQgcHJldlNpYmxpbmcgPSB0aGlzLmFjY29yZGlvbi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nIDtcclxuICBpZihwcmV2U2libGluZyAhPT0gbnVsbCAmJiBwcmV2U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjY29yZGlvbi1idWxrLWJ1dHRvbicpKXtcclxuICAgIHRoaXMuYnVsa0Z1bmN0aW9uQnV0dG9uID0gcHJldlNpYmxpbmc7XHJcbiAgICB0aGlzLmJ1bGtGdW5jdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYnVsa0V2ZW50LmJpbmQodGhpcykpO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEJ1bGsgZXZlbnQgaGFuZGxlcjogVHJpZ2dlcmVkIHdoZW4gY2xpY2tpbmcgb24gLmFjY29yZGlvbi1idWxrLWJ1dHRvblxyXG4gKi9cclxuQWNjb3JkaW9uLnByb3RvdHlwZS5idWxrRXZlbnQgPSBmdW5jdGlvbigpe1xyXG4gIHZhciAkbW9kdWxlID0gdGhpcztcclxuICBpZighJG1vZHVsZS5hY2NvcmRpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24nKSl7ICBcclxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYWNjb3JkaW9uLmApO1xyXG4gIH1cclxuICBpZigkbW9kdWxlLmJ1dHRvbnMubGVuZ3RoID09IDApe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIGFjY29yZGlvbiBidXR0b25zYCk7XHJcbiAgfVxyXG4gICAgXHJcbiAgbGV0IGV4cGFuZCA9IHRydWU7XHJcbiAgaWYoJG1vZHVsZS5idWxrRnVuY3Rpb25CdXR0b24uZ2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSkgPT09IFwiZmFsc2VcIikge1xyXG4gICAgZXhwYW5kID0gZmFsc2U7XHJcbiAgfVxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgJG1vZHVsZS5idXR0b25zLmxlbmd0aDsgaSsrKXtcclxuICAgICRtb2R1bGUudG9nZ2xlQnV0dG9uKCRtb2R1bGUuYnV0dG9uc1tpXSwgZXhwYW5kLCB0cnVlKTtcclxuICB9XHJcbiAgXHJcbiAgJG1vZHVsZS5idWxrRnVuY3Rpb25CdXR0b24uc2V0QXR0cmlidXRlKEJVTEtfRlVOQ1RJT05fQUNUSU9OX0FUVFJJQlVURSwgIWV4cGFuZCk7XHJcbiAgaWYoIWV4cGFuZCA9PT0gdHJ1ZSl7XHJcbiAgICAkbW9kdWxlLmJ1bGtGdW5jdGlvbkJ1dHRvbi5pbm5lclRleHQgPSBCVUxLX0ZVTkNUSU9OX09QRU5fVEVYVDtcclxuICB9IGVsc2V7XHJcbiAgICAkbW9kdWxlLmJ1bGtGdW5jdGlvbkJ1dHRvbi5pbm5lclRleHQgPSBCVUxLX0ZVTkNUSU9OX0NMT1NFX1RFWFQ7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWNjb3JkaW9uIGJ1dHRvbiBldmVudCBoYW5kbGVyOiBUb2dnbGVzIGFjY29yZGlvblxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSAkYnV0dG9uIFxyXG4gKiBAcGFyYW0ge1BvaW50ZXJFdmVudH0gZSBcclxuICovXHJcbkFjY29yZGlvbi5wcm90b3R5cGUuZXZlbnRPbkNsaWNrID0gZnVuY3Rpb24gKCRidXR0b24sIGUpIHtcclxuICB2YXIgJG1vZHVsZSA9IHRoaXM7XHJcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgJG1vZHVsZS50b2dnbGVCdXR0b24oJGJ1dHRvbik7XHJcbiAgaWYgKCRidXR0b24uZ2V0QXR0cmlidXRlKEVYUEFOREVEKSA9PT0gJ3RydWUnKSB7XHJcbiAgICAvLyBXZSB3ZXJlIGp1c3QgZXhwYW5kZWQsIGJ1dCBpZiBhbm90aGVyIGFjY29yZGlvbiB3YXMgYWxzbyBqdXN0XHJcbiAgICAvLyBjb2xsYXBzZWQsIHdlIG1heSBubyBsb25nZXIgYmUgaW4gdGhlIHZpZXdwb3J0LiBUaGlzIGVuc3VyZXNcclxuICAgIC8vIHRoYXQgd2UgYXJlIHN0aWxsIHZpc2libGUsIHNvIHRoZSB1c2VyIGlzbid0IGNvbmZ1c2VkLlxyXG4gICAgaWYgKCFpc0VsZW1lbnRJblZpZXdwb3J0KCRidXR0b24pKSAkYnV0dG9uLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogVG9nZ2xlIGEgYnV0dG9uJ3MgXCJwcmVzc2VkXCIgc3RhdGUsIG9wdGlvbmFsbHkgcHJvdmlkaW5nIGEgdGFyZ2V0XHJcbiAqIHN0YXRlLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBidXR0b25cclxuICogQHBhcmFtIHtib29sZWFuP30gZXhwYW5kZWQgSWYgbm8gc3RhdGUgaXMgcHJvdmlkZWQsIHRoZSBjdXJyZW50XHJcbiAqIHN0YXRlIHdpbGwgYmUgdG9nZ2xlZCAoZnJvbSBmYWxzZSB0byB0cnVlLCBhbmQgdmljZS12ZXJzYSkuXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRoZSByZXN1bHRpbmcgc3RhdGVcclxuICovXHJcbiBBY2NvcmRpb24ucHJvdG90eXBlLnRvZ2dsZUJ1dHRvbiA9IGZ1bmN0aW9uIChidXR0b24sIGV4cGFuZGVkLCBidWxrID0gZmFsc2UpIHtcclxuICBsZXQgYWNjb3JkaW9uID0gbnVsbDtcclxuICBpZihidXR0b24ucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uJykpe1xyXG4gICAgYWNjb3JkaW9uID0gYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICB9IGVsc2UgaWYoYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnYWNjb3JkaW9uJykpe1xyXG4gICAgYWNjb3JkaW9uID0gYnV0dG9uLnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xyXG4gIH1cclxuICBleHBhbmRlZCA9IHRvZ2dsZShidXR0b24sIGV4cGFuZGVkKTtcclxuICBpZihleHBhbmRlZCl7ICAgIFxyXG4gICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmFjY29yZGlvbi5vcGVuJyk7XHJcbiAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gIH0gZWxzZXtcclxuICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuYWNjb3JkaW9uLmNsb3NlJyk7XHJcbiAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICB9XHJcblxyXG4gIGxldCBtdWx0aXNlbGVjdGFibGUgPSBmYWxzZTtcclxuICBpZihhY2NvcmRpb24gIT09IG51bGwgJiYgKGFjY29yZGlvbi5nZXRBdHRyaWJ1dGUoTVVMVElTRUxFQ1RBQkxFKSA9PT0gJ3RydWUnIHx8IGFjY29yZGlvbi5jbGFzc0xpc3QuY29udGFpbnMoTVVMVElTRUxFQ1RBQkxFX0NMQVNTKSkpe1xyXG4gICAgbXVsdGlzZWxlY3RhYmxlID0gdHJ1ZTtcclxuICAgIGxldCBidWxrRnVuY3Rpb24gPSBhY2NvcmRpb24ucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgIGlmKGJ1bGtGdW5jdGlvbiAhPT0gbnVsbCAmJiBidWxrRnVuY3Rpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY2NvcmRpb24tYnVsay1idXR0b24nKSl7XHJcbiAgICAgIGxldCBidXR0b25zID0gYWNjb3JkaW9uLnF1ZXJ5U2VsZWN0b3JBbGwoQlVUVE9OKTtcclxuICAgICAgaWYoYnVsayA9PT0gZmFsc2Upe1xyXG4gICAgICAgIGxldCBidXR0b25zT3BlbiA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTisnW2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICAgICAgbGV0IG5ld1N0YXR1cyA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmKGJ1dHRvbnMubGVuZ3RoID09PSBidXR0b25zT3Blbi5sZW5ndGgpe1xyXG4gICAgICAgICAgbmV3U3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGJ1bGtGdW5jdGlvbi5zZXRBdHRyaWJ1dGUoQlVMS19GVU5DVElPTl9BQ1RJT05fQVRUUklCVVRFLCBuZXdTdGF0dXMpO1xyXG4gICAgICAgIGlmKG5ld1N0YXR1cyA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICBidWxrRnVuY3Rpb24uaW5uZXJUZXh0ID0gQlVMS19GVU5DVElPTl9PUEVOX1RFWFQ7XHJcbiAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgYnVsa0Z1bmN0aW9uLmlubmVyVGV4dCA9IEJVTEtfRlVOQ1RJT05fQ0xPU0VfVEVYVDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChleHBhbmRlZCAmJiAhbXVsdGlzZWxlY3RhYmxlKSB7XHJcbiAgICBsZXQgYnV0dG9ucyA9IFsgYnV0dG9uIF07XHJcbiAgICBpZihhY2NvcmRpb24gIT09IG51bGwpIHtcclxuICAgICAgYnV0dG9ucyA9IGFjY29yZGlvbi5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYnV0dG9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgY3VycmVudEJ1dHR0b24gPSBidXR0b25zW2ldO1xyXG4gICAgICBpZiAoY3VycmVudEJ1dHR0b24gIT09IGJ1dHRvbiAmJiBjdXJyZW50QnV0dHRvbi5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnID09PSB0cnVlKSkge1xyXG4gICAgICAgIHRvZ2dsZShjdXJyZW50QnV0dHRvbiwgZmFsc2UpO1xyXG4gICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuYWNjb3JkaW9uLmNsb3NlJyk7XHJcbiAgICAgICAgY3VycmVudEJ1dHR0b24uZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFjY29yZGlvbjsiLCIndXNlIHN0cmljdCc7XHJcbmZ1bmN0aW9uIEFsZXJ0KGFsZXJ0KXtcclxuICAgIHRoaXMuYWxlcnQgPSBhbGVydDtcclxufVxyXG5cclxuQWxlcnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xyXG4gICAgbGV0IGNsb3NlID0gdGhpcy5hbGVydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhbGVydC1jbG9zZScpO1xyXG4gICAgaWYoY2xvc2UubGVuZ3RoID09PSAxKXtcclxuICAgICAgICBjbG9zZVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuQWxlcnQucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5hbGVydC5jbGFzc0xpc3QuYWRkKCdkLW5vbmUnKTtcclxuICAgIGxldCBldmVudEhpZGUgPSBuZXcgRXZlbnQoJ2Zkcy5hbGVydC5oaWRlJyk7XHJcbiAgICB0aGlzLmFsZXJ0LmRpc3BhdGNoRXZlbnQoZXZlbnRIaWRlKTtcclxufTtcclxuXHJcbkFsZXJ0LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuYWxlcnQuY2xhc3NMaXN0LnJlbW92ZSgnZC1ub25lJyk7XHJcbiAgICBcclxuICAgIGxldCBldmVudFNob3cgPSBuZXcgRXZlbnQoJ2Zkcy5hbGVydC5zaG93Jyk7XHJcbiAgICB0aGlzLmFsZXJ0LmRpc3BhdGNoRXZlbnQoZXZlbnRTaG93KTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFsZXJ0OyIsIid1c2Ugc3RyaWN0JztcclxuaW1wb3J0ICcuLi9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQnO1xyXG5cclxuY29uc3QgVE9HR0xFX1RBUkdFVF9BVFRSSUJVVEUgPSAnZGF0YS1hcmlhLWNvbnRyb2xzJztcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gY2hlY2tib3ggY29sbGFwc2UgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gY2hlY2tib3hFbGVtZW50IFxyXG4gKi9cclxuZnVuY3Rpb24gQ2hlY2tib3hUb2dnbGVDb250ZW50KGNoZWNrYm94RWxlbWVudCl7XHJcbiAgICB0aGlzLmNoZWNrYm94RWxlbWVudCA9IGNoZWNrYm94RWxlbWVudDtcclxuICAgIHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRzIG9uIGNoZWNrYm94IHN0YXRlIGNoYW5nZVxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuY2hlY2tib3hFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMudG9nZ2xlLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy50b2dnbGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSBjaGVja2JveCBjb250ZW50XHJcbiAqL1xyXG5DaGVja2JveFRvZ2dsZUNvbnRlbnQucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgJG1vZHVsZSA9IHRoaXM7XHJcbiAgICB2YXIgdGFyZ2V0QXR0ciA9IHRoaXMuY2hlY2tib3hFbGVtZW50LmdldEF0dHJpYnV0ZShUT0dHTEVfVEFSR0VUX0FUVFJJQlVURSlcclxuICAgIHZhciB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIpO1xyXG4gICAgaWYodGFyZ2V0RWwgPT09IG51bGwgfHwgdGFyZ2V0RWwgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBwYW5lbCBlbGVtZW50LiBWZXJpZnkgdmFsdWUgb2YgYXR0cmlidXRlIGArIFRPR0dMRV9UQVJHRVRfQVRUUklCVVRFKTtcclxuICAgIH1cclxuICAgIGlmKHRoaXMuY2hlY2tib3hFbGVtZW50LmNoZWNrZWQpe1xyXG4gICAgICAgICRtb2R1bGUuZXhwYW5kKHRoaXMuY2hlY2tib3hFbGVtZW50LCB0YXJnZXRFbCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICAkbW9kdWxlLmNvbGxhcHNlKHRoaXMuY2hlY2tib3hFbGVtZW50LCB0YXJnZXRFbCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBFeHBhbmQgY29udGVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGNoZWNrYm94RWxlbWVudCBDaGVja2JveCBpbnB1dCBlbGVtZW50IFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50RWxlbWVudCBDb250ZW50IGNvbnRhaW5lciBlbGVtZW50IFxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS5leHBhbmQgPSBmdW5jdGlvbihjaGVja2JveEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KXtcclxuICAgIGlmKGNoZWNrYm94RWxlbWVudCAhPT0gbnVsbCAmJiBjaGVja2JveEVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50RWxlbWVudCAhPT0gbnVsbCAmJiBjb250ZW50RWxlbWVudCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICBjaGVja2JveEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWFyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgIGNvbnRlbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2UuZXhwYW5kZWQnKTtcclxuICAgICAgICBjaGVja2JveEVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQ29sbGFwc2UgY29udGVudFxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGNoZWNrYm94RWxlbWVudCBDaGVja2JveCBpbnB1dCBlbGVtZW50IFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250ZW50RWxlbWVudCBDb250ZW50IGNvbnRhaW5lciBlbGVtZW50IFxyXG4gKi9cclxuQ2hlY2tib3hUb2dnbGVDb250ZW50LnByb3RvdHlwZS5jb2xsYXBzZSA9IGZ1bmN0aW9uKHRyaWdnZXJFbCwgdGFyZ2V0RWwpe1xyXG4gICAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBldmVudENsb3NlID0gbmV3IEV2ZW50KCdmZHMuY29sbGFwc2UuY29sbGFwc2VkJyk7XHJcbiAgICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENoZWNrYm94VG9nZ2xlQ29udGVudDtcclxuIiwiaW1wb3J0IHtrZXltYXB9IGZyb20gJ3JlY2VwdG9yJztcclxuY29uc3QgYmVoYXZpb3IgPSByZXF1aXJlKFwiLi4vdXRpbHMvYmVoYXZpb3JcIik7XHJcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoXCIuLi91dGlscy9zZWxlY3RcIik7XHJcbmNvbnN0IHsgcHJlZml4OiBQUkVGSVggfSA9IHJlcXVpcmUoXCIuLi9jb25maWdcIik7XHJcbmNvbnN0IHsgQ0xJQ0sgfSA9IHJlcXVpcmUoXCIuLi9ldmVudHNcIik7XHJcbmNvbnN0IGFjdGl2ZUVsZW1lbnQgPSByZXF1aXJlKFwiLi4vdXRpbHMvYWN0aXZlLWVsZW1lbnRcIik7XHJcbmNvbnN0IGlzSW9zRGV2aWNlID0gcmVxdWlyZShcIi4uL3V0aWxzL2lzLWlvcy1kZXZpY2VcIik7XHJcblxyXG5jb25zdCBEQVRFX1BJQ0tFUl9DTEFTUyA9IGBkYXRlLXBpY2tlcmA7XHJcbmNvbnN0IERBVEVfUElDS0VSX1dSQVBQRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX3dyYXBwZXJgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfS0taW5pdGlhbGl6ZWRgO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU30tLWFjdGl2ZWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19pbnRlcm5hbC1pbnB1dGA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19leHRlcm5hbC1pbnB1dGA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0JVVFRPTl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NMQVNTfV9fYnV0dG9uYDtcclxuY29uc3QgREFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DTEFTU31fX2NhbGVuZGFyYDtcclxuY29uc3QgREFURV9QSUNLRVJfU1RBVFVTX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0xBU1N9X19zdGF0dXNgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19kYXRlYDtcclxuXHJcbmNvbnN0IENBTEVOREFSX0RBVEVfRk9DVVNFRF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1mb2N1c2VkYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9TRUxFQ1RFRF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1zZWxlY3RlZGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfUFJFVklPVVNfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tcHJldmlvdXMtbW9udGhgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0tY3VycmVudC1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfTkVYVF9NT05USF9DTEFTUyA9IGAke0NBTEVOREFSX0RBVEVfQ0xBU1N9LS1uZXh0LW1vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGVgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1RPREFZX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXRvZGF5YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9SQU5HRV9EQVRFX1NUQVJUX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGUtc3RhcnRgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfRU5EX0NMQVNTID0gYCR7Q0FMRU5EQVJfREFURV9DTEFTU30tLXJhbmdlLWRhdGUtZW5kYDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9XSVRISU5fUkFOR0VfQ0xBU1MgPSBgJHtDQUxFTkRBUl9EQVRFX0NMQVNTfS0td2l0aGluLXJhbmdlYDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcHJldmlvdXMteWVhcmA7XHJcbmNvbnN0IENBTEVOREFSX1BSRVZJT1VTX01PTlRIX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19wcmV2aW91cy1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC15ZWFyYDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9NT05USF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbmV4dC1tb250aGA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fbW9udGgtc2VsZWN0aW9uYDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05fQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3llYXItc2VsZWN0aW9uYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoYDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRF9DTEFTUyA9IGAke0NBTEVOREFSX01PTlRIX0NMQVNTfS0tZm9jdXNlZGA7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX1NFTEVDVEVEX0NMQVNTID0gYCR7Q0FMRU5EQVJfTU9OVEhfQ0xBU1N9LS1zZWxlY3RlZGA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX3llYXJgO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfS0tZm9jdXNlZGA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfU0VMRUNURURfQ0xBU1MgPSBgJHtDQUxFTkRBUl9ZRUFSX0NMQVNTfS0tc2VsZWN0ZWRgO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19wcmV2aW91cy15ZWFyLWNodW5rYDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19uZXh0LXllYXItY2h1bmtgO1xyXG5jb25zdCBDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fZGF0ZS1waWNrZXJgO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1MgPSBgJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31fX21vbnRoLXBpY2tlcmA7XHJcbmNvbnN0IENBTEVOREFSX1lFQVJfUElDS0VSX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X195ZWFyLXBpY2tlcmA7XHJcbmNvbnN0IENBTEVOREFSX1RBQkxFX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X190YWJsZWA7XHJcbmNvbnN0IENBTEVOREFSX1JPV19DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fcm93YDtcclxuY29uc3QgQ0FMRU5EQVJfQ0VMTF9DTEFTUyA9IGAke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfV9fY2VsbGA7XHJcbmNvbnN0IENBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTID0gYCR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30tLWNlbnRlci1pdGVtc2A7XHJcbmNvbnN0IENBTEVOREFSX01PTlRIX0xBQkVMX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19tb250aC1sYWJlbGA7XHJcbmNvbnN0IENBTEVOREFSX0RBWV9PRl9XRUVLX0NMQVNTID0gYCR7REFURV9QSUNLRVJfQ0FMRU5EQVJfQ0xBU1N9X19kYXktb2Ytd2Vla2A7XHJcblxyXG5jb25zdCBEQVRFX1BJQ0tFUiA9IGAuJHtEQVRFX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBEQVRFX1BJQ0tFUl9CVVRUT04gPSBgLiR7REFURV9QSUNLRVJfQlVUVE9OX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUID0gYC4ke0RBVEVfUElDS0VSX0lOVEVSTkFMX0lOUFVUX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUID0gYC4ke0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX0NBTEVOREFSID0gYC4ke0RBVEVfUElDS0VSX0NBTEVOREFSX0NMQVNTfWA7XHJcbmNvbnN0IERBVEVfUElDS0VSX1NUQVRVUyA9IGAuJHtEQVRFX1BJQ0tFUl9TVEFUVVNfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURSA9IGAuJHtDQUxFTkRBUl9EQVRFX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX0RBVEVfRk9DVVNFRCA9IGAuJHtDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIID0gYC4ke0NBTEVOREFSX0RBVEVfQ1VSUkVOVF9NT05USF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSID0gYC4ke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEggPSBgLiR7Q0FMRU5EQVJfUFJFVklPVVNfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTkVYVF9ZRUFSID0gYC4ke0NBTEVOREFSX05FWFRfWUVBUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ORVhUX01PTlRIID0gYC4ke0NBTEVOREFSX05FWFRfTU9OVEhfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT04gPSBgLiR7Q0FMRU5EQVJfWUVBUl9TRUxFQ1RJT05fQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OID0gYC4ke0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USCA9IGAuJHtDQUxFTkRBUl9NT05USF9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSID0gYC4ke0NBTEVOREFSX1lFQVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOSyA9IGAuJHtDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LX0NMQVNTfWA7XHJcbmNvbnN0IENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyA9IGAuJHtDQUxFTkRBUl9ORVhUX1lFQVJfQ0hVTktfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfREFURV9QSUNLRVIgPSBgLiR7Q0FMRU5EQVJfREFURV9QSUNLRVJfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfTU9OVEhfUElDS0VSID0gYC4ke0NBTEVOREFSX01PTlRIX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9ZRUFSX1BJQ0tFUiA9IGAuJHtDQUxFTkRBUl9ZRUFSX1BJQ0tFUl9DTEFTU31gO1xyXG5jb25zdCBDQUxFTkRBUl9NT05USF9GT0NVU0VEID0gYC4ke0NBTEVOREFSX01PTlRIX0ZPQ1VTRURfQ0xBU1N9YDtcclxuY29uc3QgQ0FMRU5EQVJfWUVBUl9GT0NVU0VEID0gYC4ke0NBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTU31gO1xyXG5cclxuY29uc3QgVkFMSURBVElPTl9NRVNTQUdFID0gXCJJbmR0YXN0IHZlbmxpZ3N0IGVuIGd5bGRpZyBkYXRvXCI7XHJcblxyXG5jb25zdCBNT05USF9MQUJFTFMgPSBbXHJcbiAgXCJKYW51YXJcIixcclxuICBcIkZlYnJ1YXJcIixcclxuICBcIk1hcnRzXCIsXHJcbiAgXCJBcHJpbFwiLFxyXG4gIFwiTWFqXCIsXHJcbiAgXCJKdW5pXCIsXHJcbiAgXCJKdWxpXCIsXHJcbiAgXCJBdWd1c3RcIixcclxuICBcIlNlcHRlbWJlclwiLFxyXG4gIFwiT2t0b2JlclwiLFxyXG4gIFwiTm92ZW1iZXJcIixcclxuICBcIkRlY2VtYmVyXCIsXHJcbl07XHJcblxyXG5jb25zdCBEQVlfT0ZfV0VFS19MQUJFTFMgPSBbXHJcbiAgXCJNYW5kYWdcIixcclxuICBcIlRpcnNkYWdcIixcclxuICBcIk9uc2RhZ1wiLFxyXG4gIFwiVG9yc2RhZ1wiLFxyXG4gIFwiRnJlZGFnXCIsXHJcbiAgXCJMw7hyZGFnXCIsXHJcbiAgXCJTw7huZGFnXCIsXHJcbl07XHJcblxyXG5jb25zdCBFTlRFUl9LRVlDT0RFID0gMTM7XHJcblxyXG5jb25zdCBZRUFSX0NIVU5LID0gMTI7XHJcblxyXG5jb25zdCBERUZBVUxUX01JTl9EQVRFID0gXCIwMDAwLTAxLTAxXCI7XHJcbmNvbnN0IERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQgPSBcIkREL01NL1lZWVlcIjtcclxuY29uc3QgSU5URVJOQUxfREFURV9GT1JNQVQgPSBcIllZWVktTU0tRERcIjtcclxuXHJcbmNvbnN0IE5PVF9ESVNBQkxFRF9TRUxFQ1RPUiA9IFwiOm5vdChbZGlzYWJsZWRdKVwiO1xyXG5cclxuY29uc3QgcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyA9ICguLi5zZWxlY3RvcnMpID0+XHJcbiAgc2VsZWN0b3JzLm1hcCgocXVlcnkpID0+IHF1ZXJ5ICsgTk9UX0RJU0FCTEVEX1NFTEVDVE9SKS5qb2luKFwiLCBcIik7XHJcblxyXG5jb25zdCBEQVRFX1BJQ0tFUl9GT0NVU0FCTEUgPSBwcm9jZXNzRm9jdXNhYmxlU2VsZWN0b3JzKFxyXG4gIENBTEVOREFSX1BSRVZJT1VTX1lFQVIsXHJcbiAgQ0FMRU5EQVJfUFJFVklPVVNfTU9OVEgsXHJcbiAgQ0FMRU5EQVJfWUVBUl9TRUxFQ1RJT04sXHJcbiAgQ0FMRU5EQVJfTU9OVEhfU0VMRUNUSU9OLFxyXG4gIENBTEVOREFSX05FWFRfWUVBUixcclxuICBDQUxFTkRBUl9ORVhUX01PTlRILFxyXG4gIENBTEVOREFSX0RBVEVfRk9DVVNFRFxyXG4pO1xyXG5cclxuY29uc3QgTU9OVEhfUElDS0VSX0ZPQ1VTQUJMRSA9IHByb2Nlc3NGb2N1c2FibGVTZWxlY3RvcnMoXHJcbiAgQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRFxyXG4pO1xyXG5cclxuY29uc3QgWUVBUl9QSUNLRVJfRk9DVVNBQkxFID0gcHJvY2Vzc0ZvY3VzYWJsZVNlbGVjdG9ycyhcclxuICBDQUxFTkRBUl9QUkVWSU9VU19ZRUFSX0NIVU5LLFxyXG4gIENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyxcclxuICBDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURcclxuKTtcclxuXHJcbi8vICNyZWdpb24gRGF0ZSBNYW5pcHVsYXRpb24gRnVuY3Rpb25zXHJcblxyXG4vKipcclxuICogS2VlcCBkYXRlIHdpdGhpbiBtb250aC4gTW9udGggd291bGQgb25seSBiZSBvdmVyIGJ5IDEgdG8gMyBkYXlzXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZVRvQ2hlY2sgdGhlIGRhdGUgb2JqZWN0IHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCB0aGUgY29ycmVjdCBtb250aFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGRhdGUsIGNvcnJlY3RlZCBpZiBuZWVkZWRcclxuICovXHJcbmNvbnN0IGtlZXBEYXRlV2l0aGluTW9udGggPSAoZGF0ZVRvQ2hlY2ssIG1vbnRoKSA9PiB7XHJcbiAgaWYgKG1vbnRoICE9PSBkYXRlVG9DaGVjay5nZXRNb250aCgpKSB7XHJcbiAgICBkYXRlVG9DaGVjay5zZXREYXRlKDApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGVUb0NoZWNrO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIGZyb20gbW9udGggZGF5IHllYXJcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHllYXIgdGhlIHllYXIgdG8gc2V0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtb250aCB0aGUgbW9udGggdG8gc2V0ICh6ZXJvLWluZGV4ZWQpXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIHNldFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIHNldCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXREYXRlID0gKHllYXIsIG1vbnRoLCBkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoeWVhciwgbW9udGgsIGRhdGUpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHRvZGF5cyBkYXRlXHJcbiAqXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0b2RheXMgZGF0ZVxyXG4gKi9cclxuY29uc3QgdG9kYXkgPSAoKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgY29uc3QgZGF5ID0gbmV3RGF0ZS5nZXREYXRlKCk7XHJcbiAgY29uc3QgbW9udGggPSBuZXdEYXRlLmdldE1vbnRoKCk7XHJcbiAgY29uc3QgeWVhciA9IG5ld0RhdGUuZ2V0RnVsbFllYXIoKTtcclxuICByZXR1cm4gc2V0RGF0ZSh5ZWFyLCBtb250aCwgZGF5KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgZGF0ZSB0byBmaXJzdCBkYXkgb2YgdGhlIG1vbnRoXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN0YXJ0T2ZNb250aCA9IChkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIDEpO1xyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIGxhc3QgZGF5IG9mIHRoZSBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBsYXN0RGF5T2ZNb250aCA9IChkYXRlKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKDApO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCkgKyAxLCAwKTtcclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgZGF5cyB0byBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1EYXlzIHRoZSBkaWZmZXJlbmNlIGluIGRheXNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGREYXlzID0gKF9kYXRlLCBudW1EYXlzKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcbiAgbmV3RGF0ZS5zZXREYXRlKG5ld0RhdGUuZ2V0RGF0ZSgpICsgbnVtRGF5cyk7XHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU3VidHJhY3QgZGF5cyBmcm9tIGRhdGVcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bURheXMgdGhlIGRpZmZlcmVuY2UgaW4gZGF5c1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1YkRheXMgPSAoX2RhdGUsIG51bURheXMpID0+IGFkZERheXMoX2RhdGUsIC1udW1EYXlzKTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgd2Vla3MgdG8gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtV2Vla3MgdGhlIGRpZmZlcmVuY2UgaW4gd2Vla3NcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBhZGRXZWVrcyA9IChfZGF0ZSwgbnVtV2Vla3MpID0+IGFkZERheXMoX2RhdGUsIG51bVdlZWtzICogNyk7XHJcblxyXG4vKipcclxuICogU3VidHJhY3Qgd2Vla3MgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1XZWVrcyB0aGUgZGlmZmVyZW5jZSBpbiB3ZWVrc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHN1YldlZWtzID0gKF9kYXRlLCBudW1XZWVrcykgPT4gYWRkV2Vla3MoX2RhdGUsIC1udW1XZWVrcyk7XHJcblxyXG4vKipcclxuICogU2V0IGRhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSB3ZWVrIChNb25kYXkpXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3RhcnRPZldlZWsgPSAoX2RhdGUpID0+IHtcclxuICBsZXQgZGF5T2ZXZWVrID0gX2RhdGUuZ2V0RGF5KCktMTtcclxuICBpZihkYXlPZldlZWsgPT09IC0xKXtcclxuICAgIGRheU9mV2VlayA9IDY7XHJcbiAgfVxyXG4gIHJldHVybiBzdWJEYXlzKF9kYXRlLCBkYXlPZldlZWspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHdlZWsgKFN1bmRheSlcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVdlZWtzIHRoZSBkaWZmZXJlbmNlIGluIHdlZWtzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgZW5kT2ZXZWVrID0gKF9kYXRlKSA9PiB7XHJcbiAgY29uc3QgZGF5T2ZXZWVrID0gX2RhdGUuZ2V0RGF5KCk7XHJcbiAgcmV0dXJuIGFkZERheXMoX2RhdGUsIDcgLSBkYXlPZldlZWspO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBtb250aHMgdG8gZGF0ZSBhbmQga2VlcCBkYXRlIHdpdGhpbiBtb250aFxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtTW9udGhzIHRoZSBkaWZmZXJlbmNlIGluIG1vbnRoc1xyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkZE1vbnRocyA9IChfZGF0ZSwgbnVtTW9udGhzKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcblxyXG4gIGNvbnN0IGRhdGVNb250aCA9IChuZXdEYXRlLmdldE1vbnRoKCkgKyAxMiArIG51bU1vbnRocykgJSAxMjtcclxuICBuZXdEYXRlLnNldE1vbnRoKG5ld0RhdGUuZ2V0TW9udGgoKSArIG51bU1vbnRocyk7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBkYXRlTW9udGgpO1xyXG5cclxuICByZXR1cm4gbmV3RGF0ZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTdWJ0cmFjdCBtb250aHMgZnJvbSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gX2RhdGUgdGhlIGRhdGUgdG8gYWRqdXN0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1Nb250aHMgdGhlIGRpZmZlcmVuY2UgaW4gbW9udGhzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3Qgc3ViTW9udGhzID0gKF9kYXRlLCBudW1Nb250aHMpID0+IGFkZE1vbnRocyhfZGF0ZSwgLW51bU1vbnRocyk7XHJcblxyXG4vKipcclxuICogQWRkIHllYXJzIHRvIGRhdGUgYW5kIGtlZXAgZGF0ZSB3aXRoaW4gbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZSB0aGUgZGF0ZSB0byBhZGp1c3RcclxuICogQHBhcmFtIHtudW1iZXJ9IG51bVllYXJzIHRoZSBkaWZmZXJlbmNlIGluIHllYXJzXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgYWRqdXN0ZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgYWRkWWVhcnMgPSAoX2RhdGUsIG51bVllYXJzKSA9PiBhZGRNb250aHMoX2RhdGUsIG51bVllYXJzICogMTIpO1xyXG5cclxuLyoqXHJcbiAqIFN1YnRyYWN0IHllYXJzIGZyb20gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtWWVhcnMgdGhlIGRpZmZlcmVuY2UgaW4geWVhcnNcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzdWJZZWFycyA9IChfZGF0ZSwgbnVtWWVhcnMpID0+IGFkZFllYXJzKF9kYXRlLCAtbnVtWWVhcnMpO1xyXG5cclxuLyoqXHJcbiAqIFNldCBtb250aHMgb2YgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0gbW9udGggemVyby1pbmRleGVkIG1vbnRoIHRvIHNldFxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IHNldE1vbnRoID0gKF9kYXRlLCBtb250aCkgPT4ge1xyXG4gIGNvbnN0IG5ld0RhdGUgPSBuZXcgRGF0ZShfZGF0ZS5nZXRUaW1lKCkpO1xyXG5cclxuICBuZXdEYXRlLnNldE1vbnRoKG1vbnRoKTtcclxuICBrZWVwRGF0ZVdpdGhpbk1vbnRoKG5ld0RhdGUsIG1vbnRoKTtcclxuXHJcbiAgcmV0dXJuIG5ld0RhdGU7XHJcbn07XHJcblxyXG4vKipcclxuICogU2V0IHllYXIgb2YgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IF9kYXRlIHRoZSBkYXRlIHRvIGFkanVzdFxyXG4gKiBAcGFyYW0ge251bWJlcn0geWVhciB0aGUgeWVhciB0byBzZXRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBhZGp1c3RlZCBkYXRlXHJcbiAqL1xyXG5jb25zdCBzZXRZZWFyID0gKF9kYXRlLCB5ZWFyKSA9PiB7XHJcbiAgY29uc3QgbmV3RGF0ZSA9IG5ldyBEYXRlKF9kYXRlLmdldFRpbWUoKSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoID0gbmV3RGF0ZS5nZXRNb250aCgpO1xyXG4gIG5ld0RhdGUuc2V0RnVsbFllYXIoeWVhcik7XHJcbiAga2VlcERhdGVXaXRoaW5Nb250aChuZXdEYXRlLCBtb250aCk7XHJcblxyXG4gIHJldHVybiBuZXdEYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiB0aGUgZWFybGllc3QgZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVCIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcmV0dXJucyB7RGF0ZX0gdGhlIGVhcmxpZXN0IGRhdGVcclxuICovXHJcbmNvbnN0IG1pbiA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICBsZXQgbmV3RGF0ZSA9IGRhdGVBO1xyXG5cclxuICBpZiAoZGF0ZUIgPCBkYXRlQSkge1xyXG4gICAgbmV3RGF0ZSA9IGRhdGVCO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gdGhlIGxhdGVzdCBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUIgZGF0ZSB0byBjb21wYXJlXHJcbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgbGF0ZXN0IGRhdGVcclxuICovXHJcbmNvbnN0IG1heCA9IChkYXRlQSwgZGF0ZUIpID0+IHtcclxuICBsZXQgbmV3RGF0ZSA9IGRhdGVBO1xyXG5cclxuICBpZiAoZGF0ZUIgPiBkYXRlQSkge1xyXG4gICAgbmV3RGF0ZSA9IGRhdGVCO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBEYXRlKG5ld0RhdGUuZ2V0VGltZSgpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBhcmUgdGhlIGluIHRoZSBzYW1lIHllYXJcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyBpbiB0aGUgc2FtZSB5ZWFyXHJcbiAqL1xyXG5jb25zdCBpc1NhbWVZZWFyID0gKGRhdGVBLCBkYXRlQikgPT4ge1xyXG4gIHJldHVybiBkYXRlQSAmJiBkYXRlQiAmJiBkYXRlQS5nZXRGdWxsWWVhcigpID09PSBkYXRlQi5nZXRGdWxsWWVhcigpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgaW4gdGhlIHNhbWUgbW9udGhcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlQiBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyBpbiB0aGUgc2FtZSBtb250aFxyXG4gKi9cclxuY29uc3QgaXNTYW1lTW9udGggPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgcmV0dXJuIGlzU2FtZVllYXIoZGF0ZUEsIGRhdGVCKSAmJiBkYXRlQS5nZXRNb250aCgpID09PSBkYXRlQi5nZXRNb250aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGFyZSB0aGUgc2FtZSBkYXRlXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZUEgdGhlIGRhdGUgdG8gY29tcGFyZVxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVBIHRoZSBkYXRlIHRvIGNvbXBhcmVcclxuICogQHJldHVybnMge2Jvb2xlYW59IGFyZSBkYXRlcyB0aGUgc2FtZSBkYXRlXHJcbiAqL1xyXG5jb25zdCBpc1NhbWVEYXkgPSAoZGF0ZUEsIGRhdGVCKSA9PiB7XHJcbiAgcmV0dXJuIGlzU2FtZU1vbnRoKGRhdGVBLCBkYXRlQikgJiYgZGF0ZUEuZ2V0RGF0ZSgpID09PSBkYXRlQi5nZXREYXRlKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogcmV0dXJuIGEgbmV3IGRhdGUgd2l0aGluIG1pbmltdW0gYW5kIG1heGltdW0gZGF0ZVxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBkYXRlIGJldHdlZW4gbWluIGFuZCBtYXhcclxuICovXHJcbmNvbnN0IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgbGV0IG5ld0RhdGUgPSBkYXRlO1xyXG5cclxuICBpZiAoZGF0ZSA8IG1pbkRhdGUpIHtcclxuICAgIG5ld0RhdGUgPSBtaW5EYXRlO1xyXG4gIH0gZWxzZSBpZiAobWF4RGF0ZSAmJiBkYXRlID4gbWF4RGF0ZSkge1xyXG4gICAgbmV3RGF0ZSA9IG1heERhdGU7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IERhdGUobmV3RGF0ZS5nZXRUaW1lKCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGRhdGVzIGlzIHZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlcmUgYSBkYXkgd2l0aGluIHRoZSBtb250aCB3aXRoaW4gbWluIGFuZCBtYXggZGF0ZXNcclxuICovXHJcbmNvbnN0IGlzRGF0ZVdpdGhpbk1pbkFuZE1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PlxyXG4gIGRhdGUgPj0gbWluRGF0ZSAmJiAoIW1heERhdGUgfHwgZGF0ZSA8PSBtYXhEYXRlKTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyBtb250aCBpcyBpbnZhbGlkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUgZGF0ZSB0byBjaGVja1xyXG4gKiBAcGFyYW0ge0RhdGV9IG1pbkRhdGUgbWluaW11bSBkYXRlIHRvIGFsbG93XHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWF4RGF0ZSBtYXhpbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHJldHVybiB7Ym9vbGVhbn0gaXMgdGhlIG1vbnRoIG91dHNpZGUgbWluIG9yIG1heCBkYXRlc1xyXG4gKi9cclxuY29uc3QgaXNEYXRlc01vbnRoT3V0c2lkZU1pbk9yTWF4ID0gKGRhdGUsIG1pbkRhdGUsIG1heERhdGUpID0+IHtcclxuICByZXR1cm4gKFxyXG4gICAgbGFzdERheU9mTW9udGgoZGF0ZSkgPCBtaW5EYXRlIHx8IChtYXhEYXRlICYmIHN0YXJ0T2ZNb250aChkYXRlKSA+IG1heERhdGUpXHJcbiAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBkYXRlcyB5ZWFyIGlzIGludmFsaWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSBkYXRlIHRvIGNoZWNrXHJcbiAqIEBwYXJhbSB7RGF0ZX0gbWluRGF0ZSBtaW5pbXVtIGRhdGUgdG8gYWxsb3dcclxuICogQHBhcmFtIHtEYXRlfSBtYXhEYXRlIG1heGltdW0gZGF0ZSB0byBhbGxvd1xyXG4gKiBAcmV0dXJuIHtib29sZWFufSBpcyB0aGUgbW9udGggb3V0c2lkZSBtaW4gb3IgbWF4IGRhdGVzXHJcbiAqL1xyXG5jb25zdCBpc0RhdGVzWWVhck91dHNpZGVNaW5Pck1heCA9IChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKSA9PiB7XHJcbiAgcmV0dXJuIChcclxuICAgIGxhc3REYXlPZk1vbnRoKHNldE1vbnRoKGRhdGUsIDExKSkgPCBtaW5EYXRlIHx8XHJcbiAgICAobWF4RGF0ZSAmJiBzdGFydE9mTW9udGgoc2V0TW9udGgoZGF0ZSwgMCkpID4gbWF4RGF0ZSlcclxuICApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFBhcnNlIGEgZGF0ZSB3aXRoIGZvcm1hdCBELU0tWVlcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGVTdHJpbmcgdGhlIGRhdGUgc3RyaW5nIHRvIHBhcnNlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlRm9ybWF0IHRoZSBmb3JtYXQgb2YgdGhlIGRhdGUgc3RyaW5nXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWRqdXN0RGF0ZSBzaG91bGQgdGhlIGRhdGUgYmUgYWRqdXN0ZWRcclxuICogQHJldHVybnMge0RhdGV9IHRoZSBwYXJzZWQgZGF0ZVxyXG4gKi9cclxuY29uc3QgcGFyc2VEYXRlU3RyaW5nID0gKFxyXG4gIGRhdGVTdHJpbmcsXHJcbiAgZGF0ZUZvcm1hdCA9IElOVEVSTkFMX0RBVEVfRk9STUFULFxyXG4gIGFkanVzdERhdGUgPSBmYWxzZVxyXG4pID0+IHtcclxuICBsZXQgZGF0ZTtcclxuICBsZXQgbW9udGg7XHJcbiAgbGV0IGRheTtcclxuICBsZXQgeWVhcjtcclxuICBsZXQgcGFyc2VkO1xyXG5cclxuICBpZiAoZGF0ZVN0cmluZykge1xyXG4gICAgbGV0IG1vbnRoU3RyLCBkYXlTdHIsIHllYXJTdHI7XHJcbiAgICBpZiAoZGF0ZUZvcm1hdCA9PT0gREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCkge1xyXG4gICAgICBbZGF5U3RyLCBtb250aFN0ciwgeWVhclN0cl0gPSBkYXRlU3RyaW5nLnNwbGl0KFwiL1wiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIFt5ZWFyU3RyLCBtb250aFN0ciwgZGF5U3RyXSA9IGRhdGVTdHJpbmcuc3BsaXQoXCItXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh5ZWFyU3RyKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KHllYXJTdHIsIDEwKTtcclxuICAgICAgaWYgKCFOdW1iZXIuaXNOYU4ocGFyc2VkKSkge1xyXG4gICAgICAgIHllYXIgPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIHllYXIgPSBNYXRoLm1heCgwLCB5ZWFyKTtcclxuICAgICAgICAgIGlmICh5ZWFyU3RyLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFllYXIgPSB0b2RheSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyU3R1YiA9XHJcbiAgICAgICAgICAgICAgY3VycmVudFllYXIgLSAoY3VycmVudFllYXIgJSAxMCAqKiB5ZWFyU3RyLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHllYXIgPSBjdXJyZW50WWVhclN0dWIgKyBwYXJzZWQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vbnRoU3RyKSB7XHJcbiAgICAgIHBhcnNlZCA9IHBhcnNlSW50KG1vbnRoU3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICBtb250aCA9IHBhcnNlZDtcclxuICAgICAgICBpZiAoYWRqdXN0RGF0ZSkge1xyXG4gICAgICAgICAgbW9udGggPSBNYXRoLm1heCgxLCBtb250aCk7XHJcbiAgICAgICAgICBtb250aCA9IE1hdGgubWluKDEyLCBtb250aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vbnRoICYmIGRheVN0ciAmJiB5ZWFyICE9IG51bGwpIHtcclxuICAgICAgcGFyc2VkID0gcGFyc2VJbnQoZGF5U3RyLCAxMCk7XHJcbiAgICAgIGlmICghTnVtYmVyLmlzTmFOKHBhcnNlZCkpIHtcclxuICAgICAgICBkYXkgPSBwYXJzZWQ7XHJcbiAgICAgICAgaWYgKGFkanVzdERhdGUpIHtcclxuICAgICAgICAgIGNvbnN0IGxhc3REYXlPZlRoZU1vbnRoID0gc2V0RGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF0ZSgpO1xyXG4gICAgICAgICAgZGF5ID0gTWF0aC5tYXgoMSwgZGF5KTtcclxuICAgICAgICAgIGRheSA9IE1hdGgubWluKGxhc3REYXlPZlRoZU1vbnRoLCBkYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChtb250aCAmJiBkYXkgJiYgeWVhciAhPSBudWxsKSB7XHJcbiAgICAgIGRhdGUgPSBzZXREYXRlKHllYXIsIG1vbnRoIC0gMSwgZGF5KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZvcm1hdCBhIGRhdGUgdG8gZm9ybWF0IE1NLURELVlZWVlcclxuICpcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlIHRoZSBkYXRlIHRvIGZvcm1hdFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZUZvcm1hdCB0aGUgZm9ybWF0IG9mIHRoZSBkYXRlIHN0cmluZ1xyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZm9ybWF0dGVkIGRhdGUgc3RyaW5nXHJcbiAqL1xyXG5jb25zdCBmb3JtYXREYXRlID0gKGRhdGUsIGRhdGVGb3JtYXQgPSBJTlRFUk5BTF9EQVRFX0ZPUk1BVCkgPT4ge1xyXG4gIGNvbnN0IHBhZFplcm9zID0gKHZhbHVlLCBsZW5ndGgpID0+IHtcclxuICAgIHJldHVybiBgMDAwMCR7dmFsdWV9YC5zbGljZSgtbGVuZ3RoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgY29uc3QgZGF5ID0gZGF0ZS5nZXREYXRlKCk7XHJcbiAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuXHJcbiAgaWYgKGRhdGVGb3JtYXQgPT09IERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQpIHtcclxuICAgIHJldHVybiBbcGFkWmVyb3MoZGF5LCAyKSwgcGFkWmVyb3MobW9udGgsIDIpLCBwYWRaZXJvcyh5ZWFyLCA0KV0uam9pbihcIi9cIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gW3BhZFplcm9zKHllYXIsIDQpLCBwYWRaZXJvcyhtb250aCwgMiksIHBhZFplcm9zKGRheSwgMildLmpvaW4oXCItXCIpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBEYXRlIE1hbmlwdWxhdGlvbiBGdW5jdGlvbnNcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBncmlkIHN0cmluZyBmcm9tIGFuIGFycmF5IG9mIGh0bWwgc3RyaW5nc1xyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBodG1sQXJyYXkgdGhlIGFycmF5IG9mIGh0bWwgaXRlbXNcclxuICogQHBhcmFtIHtudW1iZXJ9IHJvd1NpemUgdGhlIGxlbmd0aCBvZiBhIHJvd1xyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZ3JpZCBzdHJpbmdcclxuICovXHJcbmNvbnN0IGxpc3RUb0dyaWRIdG1sID0gKGh0bWxBcnJheSwgcm93U2l6ZSkgPT4ge1xyXG4gIGNvbnN0IGdyaWQgPSBbXTtcclxuICBsZXQgcm93ID0gW107XHJcblxyXG4gIGxldCBpID0gMDtcclxuICB3aGlsZSAoaSA8IGh0bWxBcnJheS5sZW5ndGgpIHtcclxuICAgIHJvdyA9IFtdO1xyXG4gICAgd2hpbGUgKGkgPCBodG1sQXJyYXkubGVuZ3RoICYmIHJvdy5sZW5ndGggPCByb3dTaXplKSB7XHJcbiAgICAgIHJvdy5wdXNoKGA8dGQ+JHtodG1sQXJyYXlbaV19PC90ZD5gKTtcclxuICAgICAgaSArPSAxO1xyXG4gICAgfVxyXG4gICAgZ3JpZC5wdXNoKGA8dHI+JHtyb3cuam9pbihcIlwiKX08L3RyPmApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGdyaWQuam9pbihcIlwiKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBzZXQgdGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50IGFuZCBkaXNwYXRjaCBhIGNoYW5nZSBldmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxJbnB1dEVsZW1lbnR9IGVsIFRoZSBlbGVtZW50IHRvIHVwZGF0ZVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgVGhlIG5ldyB2YWx1ZSBvZiB0aGUgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgY2hhbmdlRWxlbWVudFZhbHVlID0gKGVsLCB2YWx1ZSA9IFwiXCIpID0+IHtcclxuICBjb25zdCBlbGVtZW50VG9DaGFuZ2UgPSBlbDtcclxuICBlbGVtZW50VG9DaGFuZ2UudmFsdWUgPSB2YWx1ZTtcclxuXHJcblxyXG4gIHZhciBldmVudCA9IG5ldyBFdmVudCgnY2hhbmdlJyk7XHJcbiAgZWxlbWVudFRvQ2hhbmdlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBwcm9wZXJ0aWVzIGFuZCBlbGVtZW50cyB3aXRoaW4gdGhlIGRhdGUgcGlja2VyLlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBEYXRlUGlja2VyQ29udGV4dFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBjYWxlbmRhckVsXHJcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGRhdGVQaWNrZXJFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGludGVybmFsSW5wdXRFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxJbnB1dEVsZW1lbnR9IGV4dGVybmFsSW5wdXRFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBzdGF0dXNFbFxyXG4gKiBAcHJvcGVydHkge0hUTUxEaXZFbGVtZW50fSBmaXJzdFllYXJDaHVua0VsXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gY2FsZW5kYXJEYXRlXHJcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gbWluRGF0ZVxyXG4gKiBAcHJvcGVydHkge0RhdGV9IG1heERhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBzZWxlY3RlZERhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSByYW5nZURhdGVcclxuICogQHByb3BlcnR5IHtEYXRlfSBkZWZhdWx0RGF0ZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBHZXQgYW4gb2JqZWN0IG9mIHRoZSBwcm9wZXJ0aWVzIGFuZCBlbGVtZW50cyBiZWxvbmdpbmcgZGlyZWN0bHkgdG8gdGhlIGdpdmVuXHJcbiAqIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGhlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlclxyXG4gKiBAcmV0dXJucyB7RGF0ZVBpY2tlckNvbnRleHR9IGVsZW1lbnRzXHJcbiAqL1xyXG5jb25zdCBnZXREYXRlUGlja2VyQ29udGV4dCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IGRhdGVQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoREFURV9QSUNLRVIpO1xyXG5cclxuICBpZiAoIWRhdGVQaWNrZXJFbCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50IGlzIG1pc3Npbmcgb3V0ZXIgJHtEQVRFX1BJQ0tFUn1gKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGludGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRcclxuICApO1xyXG4gIGNvbnN0IGV4dGVybmFsSW5wdXRFbCA9IGRhdGVQaWNrZXJFbC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRcclxuICApO1xyXG4gIGNvbnN0IGNhbGVuZGFyRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9DQUxFTkRBUik7XHJcbiAgY29uc3QgdG9nZ2xlQnRuRWwgPSBkYXRlUGlja2VyRWwucXVlcnlTZWxlY3RvcihEQVRFX1BJQ0tFUl9CVVRUT04pO1xyXG4gIGNvbnN0IHN0YXR1c0VsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoREFURV9QSUNLRVJfU1RBVFVTKTtcclxuICBjb25zdCBmaXJzdFllYXJDaHVua0VsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUik7XHJcblxyXG4gIGNvbnN0IGlucHV0RGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhcclxuICAgIGV4dGVybmFsSW5wdXRFbC52YWx1ZSxcclxuICAgIERFRkFVTFRfRVhURVJOQUxfREFURV9GT1JNQVQsXHJcbiAgICB0cnVlXHJcbiAgKTtcclxuICBjb25zdCBzZWxlY3RlZERhdGUgPSBwYXJzZURhdGVTdHJpbmcoaW50ZXJuYWxJbnB1dEVsLnZhbHVlKTtcclxuXHJcbiAgY29uc3QgY2FsZW5kYXJEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGNhbGVuZGFyRWwuZGF0YXNldC52YWx1ZSk7XHJcbiAgY29uc3QgbWluRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlKTtcclxuICBjb25zdCBtYXhEYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0Lm1heERhdGUpO1xyXG4gIGNvbnN0IHJhbmdlRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyhkYXRlUGlja2VyRWwuZGF0YXNldC5yYW5nZURhdGUpO1xyXG4gIGNvbnN0IGRlZmF1bHREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRlZmF1bHREYXRlKTtcclxuXHJcbiAgaWYgKG1pbkRhdGUgJiYgbWF4RGF0ZSAmJiBtaW5EYXRlID4gbWF4RGF0ZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTWluaW11bSBkYXRlIGNhbm5vdCBiZSBhZnRlciBtYXhpbXVtIGRhdGVcIik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgY2FsZW5kYXJEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIHRvZ2dsZUJ0bkVsLFxyXG4gICAgc2VsZWN0ZWREYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIGZpcnN0WWVhckNodW5rRWwsXHJcbiAgICBkYXRlUGlja2VyRWwsXHJcbiAgICBpbnB1dERhdGUsXHJcbiAgICBpbnRlcm5hbElucHV0RWwsXHJcbiAgICBleHRlcm5hbElucHV0RWwsXHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgcmFuZ2VEYXRlLFxyXG4gICAgZGVmYXVsdERhdGUsXHJcbiAgICBzdGF0dXNFbCxcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIERpc2FibGUgdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNhYmxlID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBleHRlcm5hbElucHV0RWwsIHRvZ2dsZUJ0bkVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIHRvZ2dsZUJ0bkVsLmRpc2FibGVkID0gdHJ1ZTtcclxuICBleHRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSB0cnVlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVuYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGVuYWJsZSA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCB0b2dnbGVCdG5FbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICB0b2dnbGVCdG5FbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG59O1xyXG5cclxuLy8gI3JlZ2lvbiBWYWxpZGF0aW9uXHJcblxyXG4vKipcclxuICogVmFsaWRhdGUgdGhlIHZhbHVlIGluIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGRhdGUgb2YgZm9ybWF0IEQvTS9ZWVlZXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGlzRGF0ZUlucHV0SW52YWxpZCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcblxyXG4gIGNvbnN0IGRhdGVTdHJpbmcgPSBleHRlcm5hbElucHV0RWwudmFsdWU7XHJcbiAgbGV0IGlzSW52YWxpZCA9IGZhbHNlO1xyXG5cclxuICBpZiAoZGF0ZVN0cmluZykge1xyXG4gICAgaXNJbnZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBkYXRlU3RyaW5nUGFydHMgPSBkYXRlU3RyaW5nLnNwbGl0KFwiL1wiKTtcclxuICAgIGNvbnN0IFtkYXksIG1vbnRoLCB5ZWFyXSA9IGRhdGVTdHJpbmdQYXJ0cy5tYXAoKHN0cikgPT4ge1xyXG4gICAgICBsZXQgdmFsdWU7XHJcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHN0ciwgMTApO1xyXG4gICAgICBpZiAoIU51bWJlci5pc05hTihwYXJzZWQpKSB2YWx1ZSA9IHBhcnNlZDtcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG1vbnRoICYmIGRheSAmJiB5ZWFyICE9IG51bGwpIHtcclxuICAgICAgY29uc3QgY2hlY2tEYXRlID0gc2V0RGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgY2hlY2tEYXRlLmdldE1vbnRoKCkgPT09IG1vbnRoIC0gMSAmJlxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXREYXRlKCkgPT09IGRheSAmJlxyXG4gICAgICAgIGNoZWNrRGF0ZS5nZXRGdWxsWWVhcigpID09PSB5ZWFyICYmXHJcbiAgICAgICAgZGF0ZVN0cmluZ1BhcnRzWzJdLmxlbmd0aCA9PT0gNCAmJlxyXG4gICAgICAgIGlzRGF0ZVdpdGhpbk1pbkFuZE1heChjaGVja0RhdGUsIG1pbkRhdGUsIG1heERhdGUpXHJcbiAgICAgICkge1xyXG4gICAgICAgIGlzSW52YWxpZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaXNJbnZhbGlkO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFZhbGlkYXRlIHRoZSB2YWx1ZSBpbiB0aGUgaW5wdXQgYXMgYSB2YWxpZCBkYXRlIG9mIGZvcm1hdCBNL0QvWVlZWVxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCB2YWxpZGF0ZURhdGVJbnB1dCA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZXh0ZXJuYWxJbnB1dEVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgY29uc3QgaXNJbnZhbGlkID0gaXNEYXRlSW5wdXRJbnZhbGlkKGV4dGVybmFsSW5wdXRFbCk7XHJcblxyXG4gIGlmIChpc0ludmFsaWQgJiYgIWV4dGVybmFsSW5wdXRFbC52YWxpZGF0aW9uTWVzc2FnZSkge1xyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFZBTElEQVRJT05fTUVTU0FHRSk7XHJcbiAgfVxyXG5cclxuICBpZiAoIWlzSW52YWxpZCAmJiBleHRlcm5hbElucHV0RWwudmFsaWRhdGlvbk1lc3NhZ2UgPT09IFZBTElEQVRJT05fTUVTU0FHRSkge1xyXG4gICAgZXh0ZXJuYWxJbnB1dEVsLnNldEN1c3RvbVZhbGlkaXR5KFwiXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gVmFsaWRhdGlvblxyXG5cclxuLyoqXHJcbiAqIEVuYWJsZSB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHJlY29uY2lsZUlucHV0VmFsdWVzID0gKGVsKSA9PiB7XHJcbiAgY29uc3QgeyBpbnRlcm5hbElucHV0RWwsIGlucHV0RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGxldCBuZXdWYWx1ZSA9IFwiXCI7XHJcblxyXG4gIGlmIChpbnB1dERhdGUgJiYgIWlzRGF0ZUlucHV0SW52YWxpZChlbCkpIHtcclxuICAgIG5ld1ZhbHVlID0gZm9ybWF0RGF0ZShpbnB1dERhdGUpO1xyXG4gIH1cclxuXHJcbiAgaWYgKGludGVybmFsSW5wdXRFbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShpbnRlcm5hbElucHV0RWwsIG5ld1ZhbHVlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IHRoZSB2YWx1ZSBvZiB0aGUgZGF0ZSBwaWNrZXIgaW5wdXRzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBlbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlU3RyaW5nIFRoZSBkYXRlIHN0cmluZyB0byB1cGRhdGUgaW4gWVlZWS1NTS1ERCBmb3JtYXRcclxuICovXHJcbmNvbnN0IHNldENhbGVuZGFyVmFsdWUgPSAoZWwsIGRhdGVTdHJpbmcpID0+IHtcclxuICBjb25zdCBwYXJzZWREYXRlID0gcGFyc2VEYXRlU3RyaW5nKGRhdGVTdHJpbmcpO1xyXG5cclxuICBpZiAocGFyc2VkRGF0ZSkge1xyXG4gICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUocGFyc2VkRGF0ZSwgREVGQVVMVF9FWFRFUk5BTF9EQVRFX0ZPUk1BVCk7XHJcblxyXG4gICAgY29uc3Qge1xyXG4gICAgICBkYXRlUGlja2VyRWwsXHJcbiAgICAgIGludGVybmFsSW5wdXRFbCxcclxuICAgICAgZXh0ZXJuYWxJbnB1dEVsLFxyXG4gICAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgICBjaGFuZ2VFbGVtZW50VmFsdWUoaW50ZXJuYWxJbnB1dEVsLCBkYXRlU3RyaW5nKTtcclxuICAgIGNoYW5nZUVsZW1lbnRWYWx1ZShleHRlcm5hbElucHV0RWwsIGZvcm1hdHRlZERhdGUpO1xyXG5cclxuICAgIHZhbGlkYXRlRGF0ZUlucHV0KGRhdGVQaWNrZXJFbCk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVuaGFuY2UgYW4gaW5wdXQgd2l0aCB0aGUgZGF0ZSBwaWNrZXIgZWxlbWVudHNcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgVGhlIGluaXRpYWwgd3JhcHBpbmcgZWxlbWVudCBvZiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBlbmhhbmNlRGF0ZVBpY2tlciA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IGRhdGVQaWNrZXJFbCA9IGVsLmNsb3Nlc3QoREFURV9QSUNLRVIpO1xyXG4gIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGRhdGVQaWNrZXJFbC5kYXRhc2V0LmRlZmF1bHRWYWx1ZTtcclxuXHJcbiAgY29uc3QgaW50ZXJuYWxJbnB1dEVsID0gZGF0ZVBpY2tlckVsLnF1ZXJ5U2VsZWN0b3IoYGlucHV0YCk7XHJcblxyXG4gIGlmICghaW50ZXJuYWxJbnB1dEVsKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCR7REFURV9QSUNLRVJ9IGlzIG1pc3NpbmcgaW5uZXIgaW5wdXRgKTtcclxuICB9XHJcblxyXG5cclxuICBjb25zdCBtaW5EYXRlID0gcGFyc2VEYXRlU3RyaW5nKFxyXG4gICAgZGF0ZVBpY2tlckVsLmRhdGFzZXQubWluRGF0ZSB8fCBpbnRlcm5hbElucHV0RWwuZ2V0QXR0cmlidXRlKFwibWluXCIpXHJcbiAgKTtcclxuICBkYXRlUGlja2VyRWwuZGF0YXNldC5taW5EYXRlID0gbWluRGF0ZVxyXG4gICAgPyBmb3JtYXREYXRlKG1pbkRhdGUpXHJcbiAgICA6IERFRkFVTFRfTUlOX0RBVEU7XHJcblxyXG4gIGNvbnN0IG1heERhdGUgPSBwYXJzZURhdGVTdHJpbmcoXHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlIHx8IGludGVybmFsSW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtYXhcIilcclxuICApO1xyXG4gIGlmIChtYXhEYXRlKSB7XHJcbiAgICBkYXRlUGlja2VyRWwuZGF0YXNldC5tYXhEYXRlID0gZm9ybWF0RGF0ZShtYXhEYXRlKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfV1JBUFBFUl9DTEFTUyk7XHJcbiAgY2FsZW5kYXJXcmFwcGVyLnRhYkluZGV4ID0gXCItMVwiO1xyXG5cclxuICBjb25zdCBleHRlcm5hbElucHV0RWwgPSBpbnRlcm5hbElucHV0RWwuY2xvbmVOb2RlKCk7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRfQ0xBU1MpO1xyXG4gIGV4dGVybmFsSW5wdXRFbC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgZXh0ZXJuYWxJbnB1dEVsLm5hbWUgPSBcIlwiO1xyXG5cclxuICBjYWxlbmRhcldyYXBwZXIuYXBwZW5kQ2hpbGQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuICBjYWxlbmRhcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFxyXG4gICAgXCJiZWZvcmVlbmRcIixcclxuICAgIFtcclxuICAgICAgYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiJHtEQVRFX1BJQ0tFUl9CVVRUT05fQ0xBU1N9XCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWxhYmVsPVwiw4VibiBrYWxlbmRlclwiPiZuYnNwOzwvYnV0dG9uPmAsXHJcbiAgICAgIGA8ZGl2IGNsYXNzPVwiJHtEQVRFX1BJQ0tFUl9DQUxFTkRBUl9DTEFTU31cIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBoaWRkZW4+PC9kaXY+YCxcclxuICAgICAgYDxkaXYgY2xhc3M9XCJzci1vbmx5ICR7REFURV9QSUNLRVJfU1RBVFVTX0NMQVNTfVwiIHJvbGU9XCJzdGF0dXNcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIj48L2Rpdj5gLFxyXG4gICAgXS5qb2luKFwiXCIpXHJcbiAgKTtcclxuXHJcbiAgaW50ZXJuYWxJbnB1dEVsLnNldEF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIsIFwidHJ1ZVwiKTtcclxuICBpbnRlcm5hbElucHV0RWwuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCItMVwiKTtcclxuICBpbnRlcm5hbElucHV0RWwuY2xhc3NMaXN0LmFkZChcclxuICAgIFwic3Itb25seVwiLFxyXG4gICAgREFURV9QSUNLRVJfSU5URVJOQUxfSU5QVVRfQ0xBU1NcclxuICApO1xyXG4gIGludGVybmFsSW5wdXRFbC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgaW50ZXJuYWxJbnB1dEVsLnJlcXVpcmVkID0gZmFsc2U7XHJcblxyXG4gIGRhdGVQaWNrZXJFbC5hcHBlbmRDaGlsZChjYWxlbmRhcldyYXBwZXIpO1xyXG4gIGRhdGVQaWNrZXJFbC5jbGFzc0xpc3QuYWRkKERBVEVfUElDS0VSX0lOSVRJQUxJWkVEX0NMQVNTKTtcclxuXHJcbiAgaWYgKGRlZmF1bHRWYWx1ZSkge1xyXG4gICAgc2V0Q2FsZW5kYXJWYWx1ZShkYXRlUGlja2VyRWwsIGRlZmF1bHRWYWx1ZSk7XHJcbiAgfVxyXG5cclxuICBpZiAoaW50ZXJuYWxJbnB1dEVsLmRpc2FibGVkKSB7XHJcbiAgICBkaXNhYmxlKGRhdGVQaWNrZXJFbCk7XHJcbiAgICBpbnRlcm5hbElucHV0RWwuZGlzYWJsZWQgPSBmYWxzZTtcclxuICB9XHJcbiAgXHJcbiAgaWYgKGV4dGVybmFsSW5wdXRFbC52YWx1ZSkge1xyXG4gICAgdmFsaWRhdGVEYXRlSW5wdXQoZXh0ZXJuYWxJbnB1dEVsKTtcclxuICB9XHJcbn07XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIC0gRGF0ZSBTZWxlY3Rpb24gVmlld1xyXG5cclxuLyoqXHJcbiAqIHJlbmRlciB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHBhcmFtIHtEYXRlfSBfZGF0ZVRvRGlzcGxheSBhIGRhdGUgdG8gcmVuZGVyIG9uIHRoZSBjYWxlbmRhclxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGEgcmVmZXJlbmNlIHRvIHRoZSBuZXcgY2FsZW5kYXIgZWxlbWVudFxyXG4gKi9cclxuY29uc3QgcmVuZGVyQ2FsZW5kYXIgPSAoZWwsIF9kYXRlVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgZGF0ZVBpY2tlckVsLFxyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgc2VsZWN0ZWREYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICByYW5nZURhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuICBjb25zdCB0b2RheXNEYXRlID0gdG9kYXkoKTtcclxuICBsZXQgZGF0ZVRvRGlzcGxheSA9IF9kYXRlVG9EaXNwbGF5IHx8IHRvZGF5c0RhdGU7XHJcblxyXG4gIGNvbnN0IGNhbGVuZGFyV2FzSGlkZGVuID0gY2FsZW5kYXJFbC5oaWRkZW47XHJcblxyXG4gIGNvbnN0IGZvY3VzZWREYXRlID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAwKTtcclxuICBjb25zdCBmb2N1c2VkTW9udGggPSBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCk7XHJcbiAgY29uc3QgZm9jdXNlZFllYXIgPSBkYXRlVG9EaXNwbGF5LmdldEZ1bGxZZWFyKCk7XHJcblxyXG4gIGNvbnN0IHByZXZNb250aCA9IHN1Yk1vbnRocyhkYXRlVG9EaXNwbGF5LCAxKTtcclxuICBjb25zdCBuZXh0TW9udGggPSBhZGRNb250aHMoZGF0ZVRvRGlzcGxheSwgMSk7XHJcblxyXG4gIGNvbnN0IGN1cnJlbnRGb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShkYXRlVG9EaXNwbGF5KTtcclxuXHJcbiAgY29uc3QgZmlyc3RPZk1vbnRoID0gc3RhcnRPZk1vbnRoKGRhdGVUb0Rpc3BsYXkpO1xyXG4gIGNvbnN0IHByZXZCdXR0b25zRGlzYWJsZWQgPSBpc1NhbWVNb250aChkYXRlVG9EaXNwbGF5LCBtaW5EYXRlKTtcclxuICBjb25zdCBuZXh0QnV0dG9uc0Rpc2FibGVkID0gaXNTYW1lTW9udGgoZGF0ZVRvRGlzcGxheSwgbWF4RGF0ZSk7XHJcblxyXG4gIGNvbnN0IHJhbmdlQ29uY2x1c2lvbkRhdGUgPSBzZWxlY3RlZERhdGUgfHwgZGF0ZVRvRGlzcGxheTtcclxuICBjb25zdCByYW5nZVN0YXJ0RGF0ZSA9IHJhbmdlRGF0ZSAmJiBtaW4ocmFuZ2VDb25jbHVzaW9uRGF0ZSwgcmFuZ2VEYXRlKTtcclxuICBjb25zdCByYW5nZUVuZERhdGUgPSByYW5nZURhdGUgJiYgbWF4KHJhbmdlQ29uY2x1c2lvbkRhdGUsIHJhbmdlRGF0ZSk7XHJcblxyXG4gIGNvbnN0IHdpdGhpblJhbmdlU3RhcnREYXRlID0gcmFuZ2VEYXRlICYmIGFkZERheXMocmFuZ2VTdGFydERhdGUsIDEpO1xyXG4gIGNvbnN0IHdpdGhpblJhbmdlRW5kRGF0ZSA9IHJhbmdlRGF0ZSAmJiBzdWJEYXlzKHJhbmdlRW5kRGF0ZSwgMSk7XHJcblxyXG4gIGNvbnN0IG1vbnRoTGFiZWwgPSBNT05USF9MQUJFTFNbZm9jdXNlZE1vbnRoXTtcclxuXHJcbiAgY29uc3QgZ2VuZXJhdGVEYXRlSHRtbCA9IChkYXRlVG9SZW5kZXIpID0+IHtcclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfREFURV9DTEFTU107XHJcbiAgICBjb25zdCBkYXkgPSBkYXRlVG9SZW5kZXIuZ2V0RGF0ZSgpO1xyXG4gICAgY29uc3QgbW9udGggPSBkYXRlVG9SZW5kZXIuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IHllYXIgPSBkYXRlVG9SZW5kZXIuZ2V0RnVsbFllYXIoKTtcclxuICAgIGNvbnN0IGRheU9mV2VlayA9IGRhdGVUb1JlbmRlci5nZXREYXkoKTtcclxuXHJcbiAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShkYXRlVG9SZW5kZXIpO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gIWlzRGF0ZVdpdGhpbk1pbkFuZE1heChkYXRlVG9SZW5kZXIsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGlzU2FtZURheShkYXRlVG9SZW5kZXIsIHNlbGVjdGVkRGF0ZSk7XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgcHJldk1vbnRoKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9QUkVWSU9VU19NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2FtZU1vbnRoKGRhdGVUb1JlbmRlciwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX0NVUlJFTlRfTU9OVEhfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVNb250aChkYXRlVG9SZW5kZXIsIG5leHRNb250aCkpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfTkVYVF9NT05USF9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU2VsZWN0ZWQpIHtcclxuICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCB0b2RheXNEYXRlKSkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfREFURV9UT0RBWV9DTEFTUyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJhbmdlRGF0ZSkge1xyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VEYXRlKSkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1JBTkdFX0RBVEVfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgcmFuZ2VTdGFydERhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9TVEFSVF9DTEFTUyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc1NhbWVEYXkoZGF0ZVRvUmVuZGVyLCByYW5nZUVuZERhdGUpKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKENBTEVOREFSX0RBVEVfUkFOR0VfREFURV9FTkRfQ0xBU1MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgaXNEYXRlV2l0aGluTWluQW5kTWF4KFxyXG4gICAgICAgICAgZGF0ZVRvUmVuZGVyLFxyXG4gICAgICAgICAgd2l0aGluUmFuZ2VTdGFydERhdGUsXHJcbiAgICAgICAgICB3aXRoaW5SYW5nZUVuZERhdGVcclxuICAgICAgICApXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX1dJVEhJTl9SQU5HRV9DTEFTUyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTYW1lRGF5KGRhdGVUb1JlbmRlciwgZm9jdXNlZERhdGUpKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9EQVRFX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1vbnRoU3RyID0gTU9OVEhfTEFCRUxTW21vbnRoXTtcclxuICAgIGNvbnN0IGRheVN0ciA9IERBWV9PRl9XRUVLX0xBQkVMU1tkYXlPZldlZWtdO1xyXG5cclxuICAgIHJldHVybiBgPGJ1dHRvblxyXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgdGFiaW5kZXg9XCIke3RhYmluZGV4fVwiXHJcbiAgICAgIGNsYXNzPVwiJHtjbGFzc2VzLmpvaW4oXCIgXCIpfVwiIFxyXG4gICAgICBkYXRhLWRheT1cIiR7ZGF5fVwiIFxyXG4gICAgICBkYXRhLW1vbnRoPVwiJHttb250aCArIDF9XCIgXHJcbiAgICAgIGRhdGEteWVhcj1cIiR7eWVhcn1cIiBcclxuICAgICAgZGF0YS12YWx1ZT1cIiR7Zm9ybWF0dGVkRGF0ZX1cIlxyXG4gICAgICBhcmlhLWxhYmVsPVwiJHtkYXlTdHJ9IGRlbiAke2RheX0gJHttb250aFN0cn0gJHt5ZWFyfSBcIlxyXG4gICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgPiR7ZGF5fTwvYnV0dG9uPmA7XHJcbiAgfTtcclxuICAvLyBzZXQgZGF0ZSB0byBmaXJzdCByZW5kZXJlZCBkYXlcclxuICBkYXRlVG9EaXNwbGF5ID0gc3RhcnRPZldlZWsoZmlyc3RPZk1vbnRoKTtcclxuXHJcbiAgY29uc3QgZGF5cyA9IFtdO1xyXG5cclxuICB3aGlsZSAoXHJcbiAgICBkYXlzLmxlbmd0aCA8IDI4IHx8XHJcbiAgICBkYXRlVG9EaXNwbGF5LmdldE1vbnRoKCkgPT09IGZvY3VzZWRNb250aCB8fFxyXG4gICAgZGF5cy5sZW5ndGggJSA3ICE9PSAwXHJcbiAgKSB7XHJcbiAgICBkYXlzLnB1c2goZ2VuZXJhdGVEYXRlSHRtbChkYXRlVG9EaXNwbGF5KSk7XHJcbiAgICBkYXRlVG9EaXNwbGF5ID0gYWRkRGF5cyhkYXRlVG9EaXNwbGF5LCAxKTsgICAgXHJcbiAgfVxyXG4gIGNvbnN0IGRhdGVzSHRtbCA9IGxpc3RUb0dyaWRIdG1sKGRheXMsIDcpO1xyXG5cclxuICBjb25zdCBuZXdDYWxlbmRhciA9IGNhbGVuZGFyRWwuY2xvbmVOb2RlKCk7XHJcbiAgbmV3Q2FsZW5kYXIuZGF0YXNldC52YWx1ZSA9IGN1cnJlbnRGb3JtYXR0ZWREYXRlO1xyXG4gIG5ld0NhbGVuZGFyLnN0eWxlLnRvcCA9IGAke2RhdGVQaWNrZXJFbC5vZmZzZXRIZWlnaHR9cHhgO1xyXG4gIG5ld0NhbGVuZGFyLmhpZGRlbiA9IGZhbHNlO1xyXG4gIGxldCBjb250ZW50ID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVRFX1BJQ0tFUl9DTEFTU31cIj5cclxuICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfUk9XX0NMQVNTfVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0xBU1N9XCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk5hdmlnw6lyIMOpdCDDpXIgdGlsYmFnZVwiXHJcbiAgICAgICAgICAgICR7cHJldkJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiJHtDQUxFTkRBUl9DRUxMX0NMQVNTfSAke0NBTEVOREFSX0NFTExfQ0VOVEVSX0lURU1TX0NMQVNTfVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9QUkVWSU9VU19NT05USF9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgw6l0IMOlciB0aWxiYWdlXCJcclxuICAgICAgICAgICAgJHtwcmV2QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfTU9OVEhfTEFCRUxfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHttb250aExhYmVsfS4gVsOmbGcgbcOlbmVkLlwiXHJcbiAgICAgICAgICA+JHttb250aExhYmVsfTwvYnV0dG9uPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwiJHtDQUxFTkRBUl9ZRUFSX1NFTEVDVElPTl9DTEFTU31cIiBhcmlhLWxhYmVsPVwiJHtmb2N1c2VkWWVhcn0uIFbDpmxnIMOlci5cIlxyXG4gICAgICAgICAgPiR7Zm9jdXNlZFllYXJ9PC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIiR7Q0FMRU5EQVJfQ0VMTF9DTEFTU30gJHtDQUxFTkRBUl9DRUxMX0NFTlRFUl9JVEVNU19DTEFTU31cIj5cclxuICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9NT05USF9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmF2aWfDqXIgw6luIG3DpW5lZCBmcmVtXCJcclxuICAgICAgICAgICAgJHtuZXh0QnV0dG9uc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCIke0NBTEVOREFSX0NFTExfQ0xBU1N9ICR7Q0FMRU5EQVJfQ0VMTF9DRU5URVJfSVRFTVNfQ0xBU1N9XCI+XHJcbiAgICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgY2xhc3M9XCIke0NBTEVOREFSX05FWFRfWUVBUl9DTEFTU31cIlxyXG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiTk5hdmlnw6lyIMOpdCDDpXIgZnJlbVwiXHJcbiAgICAgICAgICAgICR7bmV4dEJ1dHRvbnNEaXNhYmxlZCA/IGBkaXNhYmxlZD1cImRpc2FibGVkXCJgIDogXCJcIn1cclxuICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDx0YWJsZSBjbGFzcz1cIiR7Q0FMRU5EQVJfVEFCTEVfQ0xBU1N9XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgIDx0cj5gO1xyXG4gIGZvcihsZXQgZCBpbiBEQVlfT0ZfV0VFS19MQUJFTFMpe1xyXG4gICAgY29udGVudCArPSBgPHRoIGNsYXNzPVwiJHtDQUxFTkRBUl9EQVlfT0ZfV0VFS19DTEFTU31cIiBzY29wZT1cImNvbFwiIGFyaWEtbGFiZWw9XCIke0RBWV9PRl9XRUVLX0xBQkVMU1tkXX1cIj4ke0RBWV9PRl9XRUVLX0xBQkVMU1tkXS5jaGFyQXQoMCl9PC90aD5gO1xyXG4gIH1cclxuICBjb250ZW50ICs9IGA8L3RyPlxyXG4gICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgJHtkYXRlc0h0bWx9XHJcbiAgICAgICAgPC90Ym9keT5cclxuICAgICAgPC90YWJsZT5cclxuICAgIDwvZGl2PmA7XHJcbiAgbmV3Q2FsZW5kYXIuaW5uZXJIVE1MID0gY29udGVudDtcclxuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcclxuXHJcbiAgZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5hZGQoREFURV9QSUNLRVJfQUNUSVZFX0NMQVNTKTtcclxuXHJcbiAgY29uc3Qgc3RhdHVzZXMgPSBbXTtcclxuXHJcbiAgaWYgKGlzU2FtZURheShzZWxlY3RlZERhdGUsIGZvY3VzZWREYXRlKSkge1xyXG4gICAgc3RhdHVzZXMucHVzaChcIlNlbGVjdGVkIGRhdGVcIik7XHJcbiAgfVxyXG5cclxuICBpZiAoY2FsZW5kYXJXYXNIaWRkZW4pIHtcclxuICAgIHN0YXR1c2VzLnB1c2goXHJcbiAgICAgIFwiRHUga2FuIG5hdmlnZXJlIG1lbGxlbSBkYWdlIHZlZCBhdCBicnVnZSBow7hqcmUgb2cgdmVuc3RyZSBwaWx0YXN0ZXIsIFwiLFxyXG4gICAgICBcInVnZXIgdmVkIGF0IGJydWdlIG9wIG9nIG5lZCBwaWx0YXN0ZXIsIFwiLFxyXG4gICAgICBcIm3DpW5lZGVyIHZlZCB0YSBicnVnZSBwYWdlIHVwIG9nIHBhZ2UgZG93biB0YXN0ZXJuZSBcIixcclxuICAgICAgXCJvZyDDpXIgdmVkIGF0IGF0IHRhc3RlIHNoaWZ0IG9nIHBhZ2UgdXAgZWxsZXIgbmVkLlwiLFxyXG4gICAgICBcIkhvbWUgb2cgZW5kIHRhc3RlbiBuYXZpZ2VyZXIgdGlsIHN0YXJ0IGVsbGVyIHNsdXRuaW5nIGFmIGVuIHVnZS5cIlxyXG4gICAgKTtcclxuICAgIHN0YXR1c0VsLnRleHRDb250ZW50ID0gXCJcIjtcclxuICB9IGVsc2Uge1xyXG4gICAgc3RhdHVzZXMucHVzaChgJHttb250aExhYmVsfSAke2ZvY3VzZWRZZWFyfWApO1xyXG4gIH1cclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IHN0YXR1c2VzLmpvaW4oXCIuIFwiKTtcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVByZXZpb3VzWWVhciA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IHN1YlllYXJzKGNhbGVuZGFyRGF0ZSwgMSk7XHJcbiAgZGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGRhdGUpO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX1lFQVIpO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IF9idXR0b25FbCBBbiBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBkaXNwbGF5UHJldmlvdXNNb250aCA9IChfYnV0dG9uRWwpID0+IHtcclxuICBpZiAoX2J1dHRvbkVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgX2J1dHRvbkVsXHJcbiAgKTtcclxuICBsZXQgZGF0ZSA9IHN1Yk1vbnRocyhjYWxlbmRhckRhdGUsIDEpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuXHJcbiAgbGV0IG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9QUkVWSU9VU19NT05USCk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIG1vbnRoIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gX2J1dHRvbkVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlOZXh0TW9udGggPSAoX2J1dHRvbkVsKSA9PiB7XHJcbiAgaWYgKF9idXR0b25FbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIF9idXR0b25FbFxyXG4gICk7XHJcbiAgbGV0IGRhdGUgPSBhZGRNb250aHMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9NT05USCk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfREFURV9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIHllYXIgYW5kIGRpc3BsYXkgdGhlIGNhbGVuZGFyLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBfYnV0dG9uRWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheU5leHRZZWFyID0gKF9idXR0b25FbCkgPT4ge1xyXG4gIGlmIChfYnV0dG9uRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBfYnV0dG9uRWxcclxuICApO1xyXG4gIGxldCBkYXRlID0gYWRkWWVhcnMoY2FsZW5kYXJEYXRlLCAxKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcblxyXG4gIGxldCBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTkVYVF9ZRUFSKTtcclxuICBpZiAobmV4dFRvRm9jdXMuZGlzYWJsZWQpIHtcclxuICAgIG5leHRUb0ZvY3VzID0gbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX1BJQ0tFUik7XHJcbiAgfVxyXG4gIG5leHRUb0ZvY3VzLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogSGlkZSB0aGUgY2FsZW5kYXIgb2YgYSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGhpZGVDYWxlbmRhciA9IChlbCkgPT4ge1xyXG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBjYWxlbmRhckVsLCBzdGF0dXNFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBkYXRlUGlja2VyRWwuY2xhc3NMaXN0LnJlbW92ZShEQVRFX1BJQ0tFUl9BQ1RJVkVfQ0xBU1MpO1xyXG4gIGNhbGVuZGFyRWwuaGlkZGVuID0gdHJ1ZTtcclxuICBzdGF0dXNFbC50ZXh0Q29udGVudCA9IFwiXCI7XHJcbn07XHJcblxyXG4vKipcclxuICogU2VsZWN0IGEgZGF0ZSB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gY2FsZW5kYXJEYXRlRWwgQSBkYXRlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHNlbGVjdERhdGUgPSAoY2FsZW5kYXJEYXRlRWwpID0+IHtcclxuICBpZiAoY2FsZW5kYXJEYXRlRWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgeyBkYXRlUGlja2VyRWwsIGV4dGVybmFsSW5wdXRFbCB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICBjYWxlbmRhckRhdGVFbFxyXG4gICk7XHJcbiAgc2V0Q2FsZW5kYXJWYWx1ZShjYWxlbmRhckRhdGVFbCwgY2FsZW5kYXJEYXRlRWwuZGF0YXNldC52YWx1ZSk7XHJcbiAgaGlkZUNhbGVuZGFyKGRhdGVQaWNrZXJFbCk7XHJcblxyXG4gIGV4dGVybmFsSW5wdXRFbC5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IHRvZ2dsZUNhbGVuZGFyID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3Qge1xyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIGlucHV0RGF0ZSxcclxuICAgIG1pbkRhdGUsXHJcbiAgICBtYXhEYXRlLFxyXG4gICAgZGVmYXVsdERhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgaWYgKGNhbGVuZGFyRWwuaGlkZGVuKSB7XHJcbiAgICBjb25zdCBkYXRlVG9EaXNwbGF5ID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KFxyXG4gICAgICBpbnB1dERhdGUgfHwgZGVmYXVsdERhdGUgfHwgdG9kYXkoKSxcclxuICAgICAgbWluRGF0ZSxcclxuICAgICAgbWF4RGF0ZVxyXG4gICAgKTtcclxuICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZVRvRGlzcGxheSk7XHJcbiAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgaGlkZUNhbGVuZGFyKGVsKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogVXBkYXRlIHRoZSBjYWxlbmRhciB3aGVuIHZpc2libGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIGFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlclxyXG4gKi9cclxuY29uc3QgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUgPSAoZWwpID0+IHtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGlucHV0RGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG4gIGNvbnN0IGNhbGVuZGFyU2hvd24gPSAhY2FsZW5kYXJFbC5oaWRkZW47XHJcblxyXG4gIGlmIChjYWxlbmRhclNob3duICYmIGlucHV0RGF0ZSkge1xyXG4gICAgY29uc3QgZGF0ZVRvRGlzcGxheSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChpbnB1dERhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZVRvRGlzcGxheSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciAtIERhdGUgU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBNb250aCBTZWxlY3Rpb24gVmlld1xyXG4vKipcclxuICogRGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbiBpbiB0aGUgZGF0ZSBwaWNrZXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBhIHJlZmVyZW5jZSB0byB0aGUgbmV3IGNhbGVuZGFyIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlNb250aFNlbGVjdGlvbiA9IChlbCwgbW9udGhUb0Rpc3BsYXkpID0+IHtcclxuICBjb25zdCB7XHJcbiAgICBjYWxlbmRhckVsLFxyXG4gICAgc3RhdHVzRWwsXHJcbiAgICBjYWxlbmRhckRhdGUsXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZSxcclxuICB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoZWwpO1xyXG5cclxuICBjb25zdCBzZWxlY3RlZE1vbnRoID0gY2FsZW5kYXJEYXRlLmdldE1vbnRoKCk7XHJcbiAgY29uc3QgZm9jdXNlZE1vbnRoID0gbW9udGhUb0Rpc3BsYXkgPT0gbnVsbCA/IHNlbGVjdGVkTW9udGggOiBtb250aFRvRGlzcGxheTtcclxuXHJcbiAgY29uc3QgbW9udGhzID0gTU9OVEhfTEFCRUxTLm1hcCgobW9udGgsIGluZGV4KSA9PiB7XHJcbiAgICBjb25zdCBtb250aFRvQ2hlY2sgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIGluZGV4KTtcclxuXHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gaXNEYXRlc01vbnRoT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgICBtb250aFRvQ2hlY2ssXHJcbiAgICAgIG1pbkRhdGUsXHJcbiAgICAgIG1heERhdGVcclxuICAgICk7XHJcblxyXG4gICAgbGV0IHRhYmluZGV4ID0gXCItMVwiO1xyXG5cclxuICAgIGNvbnN0IGNsYXNzZXMgPSBbQ0FMRU5EQVJfTU9OVEhfQ0xBU1NdO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IGluZGV4ID09PSBzZWxlY3RlZE1vbnRoO1xyXG5cclxuICAgIGlmIChpbmRleCA9PT0gZm9jdXNlZE1vbnRoKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTZWxlY3RlZCkge1xyXG4gICAgICBjbGFzc2VzLnB1c2goQ0FMRU5EQVJfTU9OVEhfU0VMRUNURURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBgPGJ1dHRvbiBcclxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcclxuICAgICAgICBjbGFzcz1cIiR7Y2xhc3Nlcy5qb2luKFwiIFwiKX1cIiBcclxuICAgICAgICBkYXRhLXZhbHVlPVwiJHtpbmRleH1cIlxyXG4gICAgICAgIGRhdGEtbGFiZWw9XCIke21vbnRofVwiXHJcbiAgICAgICAgYXJpYS1zZWxlY3RlZD1cIiR7aXNTZWxlY3RlZCA/IFwidHJ1ZVwiIDogXCJmYWxzZVwifVwiXHJcbiAgICAgICAgJHtpc0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICA+JHttb250aH08L2J1dHRvbj5gO1xyXG4gIH0pO1xyXG5cclxuICBjb25zdCBtb250aHNIdG1sID0gYDxkaXYgdGFiaW5kZXg9XCItMVwiIGNsYXNzPVwiJHtDQUxFTkRBUl9NT05USF9QSUNLRVJfQ0xBU1N9XCI+XHJcbiAgICA8dGFibGUgY2xhc3M9XCIke0NBTEVOREFSX1RBQkxFX0NMQVNTfVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgPHRib2R5PlxyXG4gICAgICAgICR7bGlzdFRvR3JpZEh0bWwobW9udGhzLCAzKX1cclxuICAgICAgPC90Ym9keT5cclxuICAgIDwvdGFibGU+XHJcbiAgPC9kaXY+YDtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBjYWxlbmRhckVsLmNsb25lTm9kZSgpO1xyXG4gIG5ld0NhbGVuZGFyLmlubmVySFRNTCA9IG1vbnRoc0h0bWw7XHJcbiAgY2FsZW5kYXJFbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdDYWxlbmRhciwgY2FsZW5kYXJFbCk7XHJcblxyXG4gIHN0YXR1c0VsLnRleHRDb250ZW50ID0gXCJTZWxlY3QgYSBtb250aC5cIjtcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCBhIG1vbnRoIGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IG1vbnRoRWwgQW4gbW9udGggZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3Qgc2VsZWN0TW9udGggPSAobW9udGhFbCkgPT4ge1xyXG4gIGlmIChtb250aEVsLmRpc2FibGVkKSByZXR1cm47XHJcbiAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgbW9udGhFbFxyXG4gICk7XHJcbiAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gIGxldCBkYXRlID0gc2V0TW9udGgoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZE1vbnRoKTtcclxuICBkYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gcmVuZGVyQ2FsZW5kYXIoY2FsZW5kYXJFbCwgZGF0ZSk7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9EQVRFX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIC0gTW9udGggU2VsZWN0aW9uIFZpZXdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgLSBZZWFyIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vKipcclxuICogRGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuIGluIHRoZSBkYXRlIHBpY2tlci5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge251bWJlcn0geWVhclRvRGlzcGxheSB5ZWFyIHRvIGRpc3BsYXkgaW4geWVhciBzZWxlY3Rpb25cclxuICogQHJldHVybnMge0hUTUxFbGVtZW50fSBhIHJlZmVyZW5jZSB0byB0aGUgbmV3IGNhbGVuZGFyIGVsZW1lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlZZWFyU2VsZWN0aW9uID0gKGVsLCB5ZWFyVG9EaXNwbGF5KSA9PiB7XHJcbiAgY29uc3Qge1xyXG4gICAgY2FsZW5kYXJFbCxcclxuICAgIHN0YXR1c0VsLFxyXG4gICAgY2FsZW5kYXJEYXRlLFxyXG4gICAgbWluRGF0ZSxcclxuICAgIG1heERhdGUsXHJcbiAgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGVsKTtcclxuXHJcbiAgY29uc3Qgc2VsZWN0ZWRZZWFyID0gY2FsZW5kYXJEYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgY29uc3QgZm9jdXNlZFllYXIgPSB5ZWFyVG9EaXNwbGF5ID09IG51bGwgPyBzZWxlY3RlZFllYXIgOiB5ZWFyVG9EaXNwbGF5O1xyXG5cclxuICBsZXQgeWVhclRvQ2h1bmsgPSBmb2N1c2VkWWVhcjtcclxuICB5ZWFyVG9DaHVuayAtPSB5ZWFyVG9DaHVuayAlIFlFQVJfQ0hVTks7XHJcbiAgeWVhclRvQ2h1bmsgPSBNYXRoLm1heCgwLCB5ZWFyVG9DaHVuayk7XHJcblxyXG4gIGNvbnN0IHByZXZZZWFyQ2h1bmtEaXNhYmxlZCA9IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJUb0NodW5rIC0gMSksXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IG5leHRZZWFyQ2h1bmtEaXNhYmxlZCA9IGlzRGF0ZXNZZWFyT3V0c2lkZU1pbk9yTWF4KFxyXG4gICAgc2V0WWVhcihjYWxlbmRhckRhdGUsIHllYXJUb0NodW5rICsgWUVBUl9DSFVOSyksXHJcbiAgICBtaW5EYXRlLFxyXG4gICAgbWF4RGF0ZVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IHllYXJzID0gW107XHJcbiAgbGV0IHllYXJJbmRleCA9IHllYXJUb0NodW5rO1xyXG4gIHdoaWxlICh5ZWFycy5sZW5ndGggPCBZRUFSX0NIVU5LKSB7XHJcbiAgICBjb25zdCBpc0Rpc2FibGVkID0gaXNEYXRlc1llYXJPdXRzaWRlTWluT3JNYXgoXHJcbiAgICAgIHNldFllYXIoY2FsZW5kYXJEYXRlLCB5ZWFySW5kZXgpLFxyXG4gICAgICBtaW5EYXRlLFxyXG4gICAgICBtYXhEYXRlXHJcbiAgICApO1xyXG5cclxuICAgIGxldCB0YWJpbmRleCA9IFwiLTFcIjtcclxuXHJcbiAgICBjb25zdCBjbGFzc2VzID0gW0NBTEVOREFSX1lFQVJfQ0xBU1NdO1xyXG4gICAgY29uc3QgaXNTZWxlY3RlZCA9IHllYXJJbmRleCA9PT0gc2VsZWN0ZWRZZWFyO1xyXG5cclxuICAgIGlmICh5ZWFySW5kZXggPT09IGZvY3VzZWRZZWFyKSB7XHJcbiAgICAgIHRhYmluZGV4ID0gXCIwXCI7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9ZRUFSX0ZPQ1VTRURfQ0xBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1NlbGVjdGVkKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaChDQUxFTkRBUl9ZRUFSX1NFTEVDVEVEX0NMQVNTKTtcclxuICAgIH1cclxuXHJcbiAgICB5ZWFycy5wdXNoKFxyXG4gICAgICBgPGJ1dHRvbiBcclxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICB0YWJpbmRleD1cIiR7dGFiaW5kZXh9XCJcclxuICAgICAgICBjbGFzcz1cIiR7Y2xhc3Nlcy5qb2luKFwiIFwiKX1cIiBcclxuICAgICAgICBkYXRhLXZhbHVlPVwiJHt5ZWFySW5kZXh9XCJcclxuICAgICAgICBhcmlhLXNlbGVjdGVkPVwiJHtpc1NlbGVjdGVkID8gXCJ0cnVlXCIgOiBcImZhbHNlXCJ9XCJcclxuICAgICAgICAke2lzRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgID4ke3llYXJJbmRleH08L2J1dHRvbj5gXHJcbiAgICApO1xyXG4gICAgeWVhckluZGV4ICs9IDE7XHJcbiAgfVxyXG5cclxuICBjb25zdCB5ZWFyc0h0bWwgPSBsaXN0VG9HcmlkSHRtbCh5ZWFycywgMyk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gY2FsZW5kYXJFbC5jbG9uZU5vZGUoKTtcclxuICBuZXdDYWxlbmRhci5pbm5lckhUTUwgPSBgPGRpdiB0YWJpbmRleD1cIi0xXCIgY2xhc3M9XCIke0NBTEVOREFSX1lFQVJfUElDS0VSX0NMQVNTfVwiPlxyXG4gICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS19DTEFTU31cIiBcclxuICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJOYXZpZ8OpciAke1lFQVJfQ0hVTkt9IMOlciB0aWxiYWdlXCJcclxuICAgICAgICAgICAgICAgICR7cHJldlllYXJDaHVua0Rpc2FibGVkID8gYGRpc2FibGVkPVwiZGlzYWJsZWRcImAgOiBcIlwifVxyXG4gICAgICAgICAgICAgID4mbmJzcDs8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIzXCI+XHJcbiAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwiJHtDQUxFTkRBUl9UQUJMRV9DTEFTU31cIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICR7eWVhcnNIdG1sfVxyXG4gICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIiR7Q0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LX0NMQVNTfVwiIFxyXG4gICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIk5hdmlnw6lyICR7WUVBUl9DSFVOS30gw6VyIGZyZW1cIlxyXG4gICAgICAgICAgICAgICAgJHtuZXh0WWVhckNodW5rRGlzYWJsZWQgPyBgZGlzYWJsZWQ9XCJkaXNhYmxlZFwiYCA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgPiZuYnNwOzwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgPC90cj5cclxuICAgICAgICA8L3Rib2R5PlxyXG4gICAgICA8L3RhYmxlPlxyXG4gICAgPC9kaXY+YDtcclxuICBjYWxlbmRhckVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0NhbGVuZGFyLCBjYWxlbmRhckVsKTtcclxuXHJcbiAgc3RhdHVzRWwudGV4dENvbnRlbnQgPSBgU2hvd2luZyB5ZWFycyAke3llYXJUb0NodW5rfSB0byAke1xyXG4gICAgeWVhclRvQ2h1bmsgKyBZRUFSX0NIVU5LIC0gMVxyXG4gIH0uIFNlbGVjdCBhIHllYXIuYDtcclxuXHJcbiAgcmV0dXJuIG5ld0NhbGVuZGFyO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGJhY2sgYnkgeWVhcnMgYW5kIGRpc3BsYXkgdGhlIHllYXIgc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gZWwgQW4gZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgZGlzcGxheVByZXZpb3VzWWVhckNodW5rID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGVsXHJcbiAgKTtcclxuICBjb25zdCB5ZWFyRWwgPSBjYWxlbmRhckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKTtcclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwudGV4dENvbnRlbnQsIDEwKTtcclxuXHJcbiAgbGV0IGFkanVzdGVkWWVhciA9IHNlbGVjdGVkWWVhciAtIFlFQVJfQ0hVTks7XHJcbiAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBjYXBwZWREYXRlLmdldEZ1bGxZZWFyKClcclxuICApO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1BSRVZJT1VTX1lFQVJfQ0hVTkspO1xyXG4gIGlmIChuZXh0VG9Gb2N1cy5kaXNhYmxlZCkge1xyXG4gICAgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfUElDS0VSKTtcclxuICB9XHJcbiAgbmV4dFRvRm9jdXMuZm9jdXMoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIGJ5IHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGVsIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGRpc3BsYXlOZXh0WWVhckNodW5rID0gKGVsKSA9PiB7XHJcbiAgaWYgKGVsLmRpc2FibGVkKSByZXR1cm47XHJcblxyXG4gIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgIGVsXHJcbiAgKTtcclxuICBjb25zdCB5ZWFyRWwgPSBjYWxlbmRhckVsLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9GT0NVU0VEKTtcclxuICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwudGV4dENvbnRlbnQsIDEwKTtcclxuXHJcbiAgbGV0IGFkanVzdGVkWWVhciA9IHNlbGVjdGVkWWVhciArIFlFQVJfQ0hVTks7XHJcbiAgYWRqdXN0ZWRZZWFyID0gTWF0aC5tYXgoMCwgYWRqdXN0ZWRZZWFyKTtcclxuXHJcbiAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gIGNvbnN0IGNhcHBlZERhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgIGNhbGVuZGFyRWwsXHJcbiAgICBjYXBwZWREYXRlLmdldEZ1bGxZZWFyKClcclxuICApO1xyXG5cclxuICBsZXQgbmV4dFRvRm9jdXMgPSBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX05FWFRfWUVBUl9DSFVOSyk7XHJcbiAgaWYgKG5leHRUb0ZvY3VzLmRpc2FibGVkKSB7XHJcbiAgICBuZXh0VG9Gb2N1cyA9IG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfWUVBUl9QSUNLRVIpO1xyXG4gIH1cclxuICBuZXh0VG9Gb2N1cy5mb2N1cygpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNlbGVjdCBhIHllYXIgaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudC5cclxuICpcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0geWVhckVsIEEgeWVhciBlbGVtZW50IHdpdGhpbiB0aGUgZGF0ZSBwaWNrZXIgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBzZWxlY3RZZWFyID0gKHllYXJFbCkgPT4ge1xyXG4gIGlmICh5ZWFyRWwuZGlzYWJsZWQpIHJldHVybjtcclxuICBjb25zdCB7IGNhbGVuZGFyRWwsIGNhbGVuZGFyRGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSB9ID0gZ2V0RGF0ZVBpY2tlckNvbnRleHQoXHJcbiAgICB5ZWFyRWxcclxuICApO1xyXG4gIGNvbnN0IHNlbGVjdGVkWWVhciA9IHBhcnNlSW50KHllYXJFbC5pbm5lckhUTUwsIDEwKTtcclxuICBsZXQgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZFllYXIpO1xyXG4gIGRhdGUgPSBrZWVwRGF0ZUJldHdlZW5NaW5BbmRNYXgoZGF0ZSwgbWluRGF0ZSwgbWF4RGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlKTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgLSBZZWFyIFNlbGVjdGlvbiBWaWV3XHJcblxyXG4vLyAjcmVnaW9uIENhbGVuZGFyIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogSGlkZSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVzY2FwZUZyb21DYWxlbmRhciA9IChldmVudCkgPT4ge1xyXG4gIGNvbnN0IHsgZGF0ZVBpY2tlckVsLCBleHRlcm5hbElucHV0RWwgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KGV2ZW50LnRhcmdldCk7XHJcblxyXG4gIGhpZGVDYWxlbmRhcihkYXRlUGlja2VyRWwpO1xyXG4gIGV4dGVybmFsSW5wdXRFbC5mb2N1cygpO1xyXG5cclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG59O1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBDYWxlbmRhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBEYXRlIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vKipcclxuICogQWRqdXN0IHRoZSBkYXRlIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhciBpZiBuZWVkZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFkanVzdERhdGVGbiBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGFkanVzdGVkIGRhdGVcclxuICovXHJcbmNvbnN0IGFkanVzdENhbGVuZGFyID0gKGFkanVzdERhdGVGbikgPT4ge1xyXG4gIHJldHVybiAoZXZlbnQpID0+IHtcclxuICAgIGNvbnN0IHsgY2FsZW5kYXJFbCwgY2FsZW5kYXJEYXRlLCBtaW5EYXRlLCBtYXhEYXRlIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChcclxuICAgICAgZXZlbnQudGFyZ2V0XHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBhZGp1c3REYXRlRm4oY2FsZW5kYXJEYXRlKTtcclxuXHJcbiAgICBjb25zdCBjYXBwZWREYXRlID0ga2VlcERhdGVCZXR3ZWVuTWluQW5kTWF4KGRhdGUsIG1pbkRhdGUsIG1heERhdGUpO1xyXG4gICAgaWYgKCFpc1NhbWVEYXkoY2FsZW5kYXJEYXRlLCBjYXBwZWREYXRlKSkge1xyXG4gICAgICBjb25zdCBuZXdDYWxlbmRhciA9IHJlbmRlckNhbGVuZGFyKGNhbGVuZGFyRWwsIGNhcHBlZERhdGUpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBzdWJXZWVrcyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgd2VlayBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRXZWVrcyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgZGF5IGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTGVmdEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1YkRheXMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIGZvcndhcmQgb25lIGRheSBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkRGF5cyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIHN0YXJ0IG9mIHRoZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN0YXJ0T2ZXZWVrKGRhdGUpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZW5kIG9mIHRoZSB3ZWVrIGFuZCBkaXNwbGF5IHRoZSBjYWxlbmRhci5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlRW5kRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gZW5kT2ZXZWVrKGRhdGUpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBmb3J3YXJkIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VEb3duRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gYWRkTW9udGhzKGRhdGUsIDEpKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIG9uZSBtb250aCBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVBhZ2VVcEZyb21EYXRlID0gYWRqdXN0Q2FsZW5kYXIoKGRhdGUpID0+IHN1Yk1vbnRocyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVNoaWZ0UGFnZURvd25Gcm9tRGF0ZSA9IGFkanVzdENhbGVuZGFyKChkYXRlKSA9PiBhZGRZZWFycyhkYXRlLCAxKSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgY2FsZW5kYXIuXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVNoaWZ0UGFnZVVwRnJvbURhdGUgPSBhZGp1c3RDYWxlbmRhcigoZGF0ZSkgPT4gc3ViWWVhcnMoZGF0ZSwgMSkpO1xyXG5cclxuLyoqXHJcbiAqIGRpc3BsYXkgdGhlIGNhbGVuZGFyIGZvciB0aGUgbW91c2Vtb3ZlIGRhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBkYXRlRWwgQSBkYXRlIGVsZW1lbnQgd2l0aGluIHRoZSBkYXRlIHBpY2tlciBjb21wb25lbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZU1vdXNlbW92ZUZyb21EYXRlID0gKGRhdGVFbCkgPT4ge1xyXG4gIGlmIChkYXRlRWwuZGlzYWJsZWQpIHJldHVybjtcclxuXHJcbiAgY29uc3QgY2FsZW5kYXJFbCA9IGRhdGVFbC5jbG9zZXN0KERBVEVfUElDS0VSX0NBTEVOREFSKTtcclxuXHJcbiAgY29uc3QgY3VycmVudENhbGVuZGFyRGF0ZSA9IGNhbGVuZGFyRWwuZGF0YXNldC52YWx1ZTtcclxuICBjb25zdCBob3ZlckRhdGUgPSBkYXRlRWwuZGF0YXNldC52YWx1ZTtcclxuXHJcbiAgaWYgKGhvdmVyRGF0ZSA9PT0gY3VycmVudENhbGVuZGFyRGF0ZSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBkYXRlVG9EaXNwbGF5ID0gcGFyc2VEYXRlU3RyaW5nKGhvdmVyRGF0ZSk7XHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSByZW5kZXJDYWxlbmRhcihjYWxlbmRhckVsLCBkYXRlVG9EaXNwbGF5KTtcclxuICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX0RBVEVfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgRGF0ZSBFdmVudCBIYW5kbGluZ1xyXG5cclxuLy8gI3JlZ2lvbiBDYWxlbmRhciBNb250aCBFdmVudCBIYW5kbGluZ1xyXG5cclxuLyoqXHJcbiAqIEFkanVzdCB0aGUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4gaWYgbmVlZGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGp1c3RNb250aEZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgbW9udGhcclxuICovXHJcbmNvbnN0IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuID0gKGFkanVzdE1vbnRoRm4pID0+IHtcclxuICByZXR1cm4gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBtb250aEVsID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRNb250aCA9IHBhcnNlSW50KG1vbnRoRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICBtb250aEVsXHJcbiAgICApO1xyXG4gICAgY29uc3QgY3VycmVudERhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIHNlbGVjdGVkTW9udGgpO1xyXG5cclxuICAgIGxldCBhZGp1c3RlZE1vbnRoID0gYWRqdXN0TW9udGhGbihzZWxlY3RlZE1vbnRoKTtcclxuICAgIGFkanVzdGVkTW9udGggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMSwgYWRqdXN0ZWRNb250aCkpO1xyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBzZXRNb250aChjYWxlbmRhckRhdGUsIGFkanVzdGVkTW9udGgpO1xyXG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIGlmICghaXNTYW1lTW9udGgoY3VycmVudERhdGUsIGNhcHBlZERhdGUpKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKFxyXG4gICAgICAgIGNhbGVuZGFyRWwsXHJcbiAgICAgICAgY2FwcGVkRGF0ZS5nZXRNb250aCgpXHJcbiAgICAgICk7XHJcbiAgICAgIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIHRocmVlIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlVXBGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoIC0gMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCB0aHJlZSBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZURvd25Gcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoICsgMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUxlZnRGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigobW9udGgpID0+IG1vbnRoIC0gMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgbW9udGggYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVJpZ2h0RnJvbU1vbnRoID0gYWRqdXN0TW9udGhTZWxlY3Rpb25TY3JlZW4oKG1vbnRoKSA9PiBtb250aCArIDEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgcm93IG9mIG1vbnRocyBhbmQgZGlzcGxheSB0aGUgbW9udGggc2VsZWN0aW9uIHNjcmVlbi5cclxuICpcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCB0aGUga2V5ZG93biBldmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlSG9tZUZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKFxyXG4gIChtb250aCkgPT4gbW9udGggLSAobW9udGggJSAzKVxyXG4pO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBlbmQgb2YgdGhlIHJvdyBvZiBtb250aHMgYW5kIGRpc3BsYXkgdGhlIG1vbnRoIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVuZEZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKFxyXG4gIChtb250aCkgPT4gbW9udGggKyAyIC0gKG1vbnRoICUgMylcclxuKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgbGFzdCBtb250aCAoRGVjZW1iZXIpIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21Nb250aCA9IGFkanVzdE1vbnRoU2VsZWN0aW9uU2NyZWVuKCgpID0+IDExKTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSB0byB0aGUgZmlyc3QgbW9udGggKEphbnVhcnkpIGFuZCBkaXNwbGF5IHRoZSBtb250aCBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlVXBGcm9tTW9udGggPSBhZGp1c3RNb250aFNlbGVjdGlvblNjcmVlbigoKSA9PiAwKTtcclxuXHJcbi8qKlxyXG4gKiB1cGRhdGUgdGhlIGZvY3VzIG9uIGEgbW9udGggd2hlbiB0aGUgbW91c2UgbW92ZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gZXZlbnQgVGhlIG1vdXNlbW92ZSBldmVudFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSBtb250aEVsIEEgbW9udGggZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbU1vbnRoID0gKG1vbnRoRWwpID0+IHtcclxuICBpZiAobW9udGhFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGlmIChtb250aEVsLmNsYXNzTGlzdC5jb250YWlucyhDQUxFTkRBUl9NT05USF9GT0NVU0VEX0NMQVNTKSkgcmV0dXJuO1xyXG5cclxuICBjb25zdCBmb2N1c01vbnRoID0gcGFyc2VJbnQobW9udGhFbC5kYXRhc2V0LnZhbHVlLCAxMCk7XHJcblxyXG4gIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKG1vbnRoRWwsIGZvY3VzTW9udGgpO1xyXG4gIG5ld0NhbGVuZGFyLnF1ZXJ5U2VsZWN0b3IoQ0FMRU5EQVJfTU9OVEhfRk9DVVNFRCkuZm9jdXMoKTtcclxufTtcclxuXHJcbi8vICNlbmRyZWdpb24gQ2FsZW5kYXIgTW9udGggRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gQ2FsZW5kYXIgWWVhciBFdmVudCBIYW5kbGluZ1xyXG5cclxuLyoqXHJcbiAqIEFkanVzdCB0aGUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuIGlmIG5lZWRlZC5cclxuICpcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gYWRqdXN0WWVhckZuIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYWRqdXN0ZWQgeWVhclxyXG4gKi9cclxuY29uc3QgYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbiA9IChhZGp1c3RZZWFyRm4pID0+IHtcclxuICByZXR1cm4gKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB5ZWFyRWwgPSBldmVudC50YXJnZXQ7XHJcbiAgICBjb25zdCBzZWxlY3RlZFllYXIgPSBwYXJzZUludCh5ZWFyRWwuZGF0YXNldC52YWx1ZSwgMTApO1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsLCBjYWxlbmRhckRhdGUsIG1pbkRhdGUsIG1heERhdGUgfSA9IGdldERhdGVQaWNrZXJDb250ZXh0KFxyXG4gICAgICB5ZWFyRWxcclxuICAgICk7XHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBzZWxlY3RlZFllYXIpO1xyXG5cclxuICAgIGxldCBhZGp1c3RlZFllYXIgPSBhZGp1c3RZZWFyRm4oc2VsZWN0ZWRZZWFyKTtcclxuICAgIGFkanVzdGVkWWVhciA9IE1hdGgubWF4KDAsIGFkanVzdGVkWWVhcik7XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IHNldFllYXIoY2FsZW5kYXJEYXRlLCBhZGp1c3RlZFllYXIpO1xyXG4gICAgY29uc3QgY2FwcGVkRGF0ZSA9IGtlZXBEYXRlQmV0d2Vlbk1pbkFuZE1heChkYXRlLCBtaW5EYXRlLCBtYXhEYXRlKTtcclxuICAgIGlmICghaXNTYW1lWWVhcihjdXJyZW50RGF0ZSwgY2FwcGVkRGF0ZSkpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbihcclxuICAgICAgICBjYWxlbmRhckVsLFxyXG4gICAgICAgIGNhcHBlZERhdGUuZ2V0RnVsbFllYXIoKVxyXG4gICAgICApO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX1lFQVJfRk9DVVNFRCkuZm9jdXMoKTtcclxuICAgIH1cclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBOYXZpZ2F0ZSBiYWNrIHRocmVlIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZVVwRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyIC0gMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCB0aHJlZSB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVEb3duRnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyICsgMyk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgYmFjayBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVMZWZ0RnJvbVllYXIgPSBhZGp1c3RZZWFyU2VsZWN0aW9uU2NyZWVuKCh5ZWFyKSA9PiB5ZWFyIC0gMSk7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCBvbmUgeWVhciBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVSaWdodEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbigoeWVhcikgPT4geWVhciArIDEpO1xyXG5cclxuLyoqXHJcbiAqIE5hdmlnYXRlIHRvIHRoZSBzdGFydCBvZiB0aGUgcm93IG9mIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUhvbWVGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKHllYXIpID0+IHllYXIgLSAoeWVhciAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gdGhlIGVuZCBvZiB0aGUgcm93IG9mIHllYXJzIGFuZCBkaXNwbGF5IHRoZSB5ZWFyIHNlbGVjdGlvbiBzY3JlZW4uXHJcbiAqXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgdGhlIGtleWRvd24gZXZlbnRcclxuICovXHJcbmNvbnN0IGhhbmRsZUVuZEZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciArIDIgLSAoeWVhciAlIDMpXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgdG8gYmFjayAxMiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlVXBGcm9tWWVhciA9IGFkanVzdFllYXJTZWxlY3Rpb25TY3JlZW4oXHJcbiAgKHllYXIpID0+IHllYXIgLSBZRUFSX0NIVU5LXHJcbik7XHJcblxyXG4vKipcclxuICogTmF2aWdhdGUgZm9yd2FyZCAxMiB5ZWFycyBhbmQgZGlzcGxheSB0aGUgeWVhciBzZWxlY3Rpb24gc2NyZWVuLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50IHRoZSBrZXlkb3duIGV2ZW50XHJcbiAqL1xyXG5jb25zdCBoYW5kbGVQYWdlRG93bkZyb21ZZWFyID0gYWRqdXN0WWVhclNlbGVjdGlvblNjcmVlbihcclxuICAoeWVhcikgPT4geWVhciArIFlFQVJfQ0hVTktcclxuKTtcclxuXHJcbi8qKlxyXG4gKiB1cGRhdGUgdGhlIGZvY3VzIG9uIGEgeWVhciB3aGVuIHRoZSBtb3VzZSBtb3Zlcy5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudCBUaGUgbW91c2Vtb3ZlIGV2ZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGRhdGVFbCBBIHllYXIgZWxlbWVudCB3aXRoaW4gdGhlIGRhdGUgcGlja2VyIGNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgaGFuZGxlTW91c2Vtb3ZlRnJvbVllYXIgPSAoeWVhckVsKSA9PiB7XHJcbiAgaWYgKHllYXJFbC5kaXNhYmxlZCkgcmV0dXJuO1xyXG4gIGlmICh5ZWFyRWwuY2xhc3NMaXN0LmNvbnRhaW5zKENBTEVOREFSX1lFQVJfRk9DVVNFRF9DTEFTUykpIHJldHVybjtcclxuXHJcbiAgY29uc3QgZm9jdXNZZWFyID0gcGFyc2VJbnQoeWVhckVsLmRhdGFzZXQudmFsdWUsIDEwKTtcclxuXHJcbiAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbih5ZWFyRWwsIGZvY3VzWWVhcik7XHJcbiAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbn07XHJcblxyXG4vLyAjZW5kcmVnaW9uIENhbGVuZGFyIFllYXIgRXZlbnQgSGFuZGxpbmdcclxuXHJcbi8vICNyZWdpb24gRm9jdXMgSGFuZGxpbmcgRXZlbnQgSGFuZGxpbmdcclxuXHJcbmNvbnN0IHRhYkhhbmRsZXIgPSAoZm9jdXNhYmxlKSA9PiB7XHJcbiAgY29uc3QgZ2V0Rm9jdXNhYmxlQ29udGV4dCA9IChlbCkgPT4ge1xyXG4gICAgY29uc3QgeyBjYWxlbmRhckVsIH0gPSBnZXREYXRlUGlja2VyQ29udGV4dChlbCk7XHJcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IHNlbGVjdChmb2N1c2FibGUsIGNhbGVuZGFyRWwpO1xyXG5cclxuICAgIGNvbnN0IGZpcnN0VGFiSW5kZXggPSAwO1xyXG4gICAgY29uc3QgbGFzdFRhYkluZGV4ID0gZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMTtcclxuICAgIGNvbnN0IGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2ZpcnN0VGFiSW5kZXhdO1xyXG4gICAgY29uc3QgbGFzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1tsYXN0VGFiSW5kZXhdO1xyXG4gICAgY29uc3QgZm9jdXNJbmRleCA9IGZvY3VzYWJsZUVsZW1lbnRzLmluZGV4T2YoYWN0aXZlRWxlbWVudCgpKTtcclxuXHJcbiAgICBjb25zdCBpc0xhc3RUYWIgPSBmb2N1c0luZGV4ID09PSBsYXN0VGFiSW5kZXg7XHJcbiAgICBjb25zdCBpc0ZpcnN0VGFiID0gZm9jdXNJbmRleCA9PT0gZmlyc3RUYWJJbmRleDtcclxuICAgIGNvbnN0IGlzTm90Rm91bmQgPSBmb2N1c0luZGV4ID09PSAtMTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBmb2N1c2FibGVFbGVtZW50cyxcclxuICAgICAgaXNOb3RGb3VuZCxcclxuICAgICAgZmlyc3RUYWJTdG9wLFxyXG4gICAgICBpc0ZpcnN0VGFiLFxyXG4gICAgICBsYXN0VGFiU3RvcCxcclxuICAgICAgaXNMYXN0VGFiLFxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgdGFiQWhlYWQoZXZlbnQpIHtcclxuICAgICAgY29uc3QgeyBmaXJzdFRhYlN0b3AsIGlzTGFzdFRhYiwgaXNOb3RGb3VuZCB9ID0gZ2V0Rm9jdXNhYmxlQ29udGV4dChcclxuICAgICAgICBldmVudC50YXJnZXRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChpc0xhc3RUYWIgfHwgaXNOb3RGb3VuZCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0YWJCYWNrKGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IHsgbGFzdFRhYlN0b3AsIGlzRmlyc3RUYWIsIGlzTm90Rm91bmQgfSA9IGdldEZvY3VzYWJsZUNvbnRleHQoXHJcbiAgICAgICAgZXZlbnQudGFyZ2V0XHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAoaXNGaXJzdFRhYiB8fCBpc05vdEZvdW5kKSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBkYXRlUGlja2VyVGFiRXZlbnRIYW5kbGVyID0gdGFiSGFuZGxlcihEQVRFX1BJQ0tFUl9GT0NVU0FCTEUpO1xyXG5jb25zdCBtb250aFBpY2tlclRhYkV2ZW50SGFuZGxlciA9IHRhYkhhbmRsZXIoTU9OVEhfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcbmNvbnN0IHllYXJQaWNrZXJUYWJFdmVudEhhbmRsZXIgPSB0YWJIYW5kbGVyKFlFQVJfUElDS0VSX0ZPQ1VTQUJMRSk7XHJcblxyXG4vLyAjZW5kcmVnaW9uIEZvY3VzIEhhbmRsaW5nIEV2ZW50IEhhbmRsaW5nXHJcblxyXG4vLyAjcmVnaW9uIERhdGUgUGlja2VyIEV2ZW50IERlbGVnYXRpb24gUmVnaXN0cmF0aW9uIC8gQ29tcG9uZW50XHJcblxyXG5jb25zdCBkYXRlUGlja2VyRXZlbnRzID0ge1xyXG4gIFtDTElDS106IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9CVVRUT05dKCkge1xyXG4gICAgICB0b2dnbGVDYWxlbmRhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfREFURV0oKSB7XHJcbiAgICAgIHNlbGVjdERhdGUodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIXSgpIHtcclxuICAgICAgc2VsZWN0TW9udGgodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJdKCkge1xyXG4gICAgICBzZWxlY3RZZWFyKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9QUkVWSU9VU19NT05USF0oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c01vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ORVhUX01PTlRIXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRNb250aCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl0oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c1llYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX05FWFRfWUVBUl0oKSB7XHJcbiAgICAgIGRpc3BsYXlOZXh0WWVhcih0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfUFJFVklPVVNfWUVBUl9DSFVOS10oKSB7XHJcbiAgICAgIGRpc3BsYXlQcmV2aW91c1llYXJDaHVuayh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfTkVYVF9ZRUFSX0NIVU5LXSgpIHtcclxuICAgICAgZGlzcGxheU5leHRZZWFyQ2h1bmsodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIX1NFTEVDVElPTl0oKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NhbGVuZGFyID0gZGlzcGxheU1vbnRoU2VsZWN0aW9uKHRoaXMpO1xyXG4gICAgICBuZXdDYWxlbmRhci5xdWVyeVNlbGVjdG9yKENBTEVOREFSX01PTlRIX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX1lFQVJfU0VMRUNUSU9OXSgpIHtcclxuICAgICAgY29uc3QgbmV3Q2FsZW5kYXIgPSBkaXNwbGF5WWVhclNlbGVjdGlvbih0aGlzKTtcclxuICAgICAgbmV3Q2FsZW5kYXIucXVlcnlTZWxlY3RvcihDQUxFTkRBUl9ZRUFSX0ZPQ1VTRUQpLmZvY3VzKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAga2V5dXA6IHtcclxuICAgIFtEQVRFX1BJQ0tFUl9DQUxFTkRBUl0oZXZlbnQpIHtcclxuICAgICAgY29uc3Qga2V5ZG93biA9IHRoaXMuZGF0YXNldC5rZXlkb3duS2V5Q29kZTtcclxuICAgICAgaWYgKGAke2V2ZW50LmtleUNvZGV9YCAhPT0ga2V5ZG93bikge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBrZXlkb3duOiB7XHJcbiAgICBbREFURV9QSUNLRVJfRVhURVJOQUxfSU5QVVRdKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBFTlRFUl9LRVlDT0RFKSB7XHJcbiAgICAgICAgdmFsaWRhdGVEYXRlSW5wdXQodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBbQ0FMRU5EQVJfREFURV06IGtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21EYXRlLFxyXG4gICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21EYXRlLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbURhdGUsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21EYXRlLFxyXG4gICAgICBMZWZ0OiBoYW5kbGVMZWZ0RnJvbURhdGUsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21EYXRlLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tRGF0ZSxcclxuICAgICAgQXJyb3dSaWdodDogaGFuZGxlUmlnaHRGcm9tRGF0ZSxcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21EYXRlLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21EYXRlLFxyXG4gICAgICBQYWdlRG93bjogaGFuZGxlUGFnZURvd25Gcm9tRGF0ZSxcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tRGF0ZSxcclxuICAgICAgXCJTaGlmdCtQYWdlRG93blwiOiBoYW5kbGVTaGlmdFBhZ2VEb3duRnJvbURhdGUsXHJcbiAgICAgIFwiU2hpZnQrUGFnZVVwXCI6IGhhbmRsZVNoaWZ0UGFnZVVwRnJvbURhdGUsXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9EQVRFX1BJQ0tFUl06IGtleW1hcCh7XHJcbiAgICAgIFRhYjogZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJBaGVhZCxcclxuICAgICAgXCJTaGlmdCtUYWJcIjogZGF0ZVBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfTU9OVEhdOiBrZXltYXAoe1xyXG4gICAgICBVcDogaGFuZGxlVXBGcm9tTW9udGgsXHJcbiAgICAgIEFycm93VXA6IGhhbmRsZVVwRnJvbU1vbnRoLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbU1vbnRoLFxyXG4gICAgICBBcnJvd0Rvd246IGhhbmRsZURvd25Gcm9tTW9udGgsXHJcbiAgICAgIExlZnQ6IGhhbmRsZUxlZnRGcm9tTW9udGgsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21Nb250aCxcclxuICAgICAgUmlnaHQ6IGhhbmRsZVJpZ2h0RnJvbU1vbnRoLFxyXG4gICAgICBBcnJvd1JpZ2h0OiBoYW5kbGVSaWdodEZyb21Nb250aCxcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21Nb250aCxcclxuICAgICAgRW5kOiBoYW5kbGVFbmRGcm9tTW9udGgsXHJcbiAgICAgIFBhZ2VEb3duOiBoYW5kbGVQYWdlRG93bkZyb21Nb250aCxcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tTW9udGgsXHJcbiAgICB9KSxcclxuICAgIFtDQUxFTkRBUl9NT05USF9QSUNLRVJdOiBrZXltYXAoe1xyXG4gICAgICBUYWI6IG1vbnRoUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiBtb250aFBpY2tlclRhYkV2ZW50SGFuZGxlci50YWJCYWNrLFxyXG4gICAgfSksXHJcbiAgICBbQ0FMRU5EQVJfWUVBUl06IGtleW1hcCh7XHJcbiAgICAgIFVwOiBoYW5kbGVVcEZyb21ZZWFyLFxyXG4gICAgICBBcnJvd1VwOiBoYW5kbGVVcEZyb21ZZWFyLFxyXG4gICAgICBEb3duOiBoYW5kbGVEb3duRnJvbVllYXIsXHJcbiAgICAgIEFycm93RG93bjogaGFuZGxlRG93bkZyb21ZZWFyLFxyXG4gICAgICBMZWZ0OiBoYW5kbGVMZWZ0RnJvbVllYXIsXHJcbiAgICAgIEFycm93TGVmdDogaGFuZGxlTGVmdEZyb21ZZWFyLFxyXG4gICAgICBSaWdodDogaGFuZGxlUmlnaHRGcm9tWWVhcixcclxuICAgICAgQXJyb3dSaWdodDogaGFuZGxlUmlnaHRGcm9tWWVhcixcclxuICAgICAgSG9tZTogaGFuZGxlSG9tZUZyb21ZZWFyLFxyXG4gICAgICBFbmQ6IGhhbmRsZUVuZEZyb21ZZWFyLFxyXG4gICAgICBQYWdlRG93bjogaGFuZGxlUGFnZURvd25Gcm9tWWVhcixcclxuICAgICAgUGFnZVVwOiBoYW5kbGVQYWdlVXBGcm9tWWVhcixcclxuICAgIH0pLFxyXG4gICAgW0NBTEVOREFSX1lFQVJfUElDS0VSXToga2V5bWFwKHtcclxuICAgICAgVGFiOiB5ZWFyUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkFoZWFkLFxyXG4gICAgICBcIlNoaWZ0K1RhYlwiOiB5ZWFyUGlja2VyVGFiRXZlbnRIYW5kbGVyLnRhYkJhY2ssXHJcbiAgICB9KSxcclxuICAgIFtEQVRFX1BJQ0tFUl9DQUxFTkRBUl0oZXZlbnQpIHtcclxuICAgICAgdGhpcy5kYXRhc2V0LmtleWRvd25LZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcclxuICAgIH0sXHJcbiAgICBbREFURV9QSUNLRVJdKGV2ZW50KSB7XHJcbiAgICAgIGNvbnN0IGtleU1hcCA9IGtleW1hcCh7XHJcbiAgICAgICAgRXNjYXBlOiBoYW5kbGVFc2NhcGVGcm9tQ2FsZW5kYXIsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAga2V5TWFwKGV2ZW50KTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBmb2N1c291dDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXSgpIHtcclxuICAgICAgdmFsaWRhdGVEYXRlSW5wdXQodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0RBVEVfUElDS0VSXShldmVudCkge1xyXG4gICAgICBpZiAoIXRoaXMuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpIHtcclxuICAgICAgICBoaWRlQ2FsZW5kYXIodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBpbnB1dDoge1xyXG4gICAgW0RBVEVfUElDS0VSX0VYVEVSTkFMX0lOUFVUXSgpIHtcclxuICAgICAgcmVjb25jaWxlSW5wdXRWYWx1ZXModGhpcyk7XHJcbiAgICAgIHVwZGF0ZUNhbGVuZGFySWZWaXNpYmxlKHRoaXMpO1xyXG4gICAgfSxcclxuICB9LFxyXG59O1xyXG5cclxuaWYgKCFpc0lvc0RldmljZSgpKSB7XHJcbiAgZGF0ZVBpY2tlckV2ZW50cy5tb3VzZW1vdmUgPSB7XHJcbiAgICBbQ0FMRU5EQVJfREFURV9DVVJSRU5UX01PTlRIXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbURhdGUodGhpcyk7XHJcbiAgICB9LFxyXG4gICAgW0NBTEVOREFSX01PTlRIXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbU1vbnRoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIFtDQUxFTkRBUl9ZRUFSXSgpIHtcclxuICAgICAgaGFuZGxlTW91c2Vtb3ZlRnJvbVllYXIodGhpcyk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmNvbnN0IGRhdGVQaWNrZXIgPSBiZWhhdmlvcihkYXRlUGlja2VyRXZlbnRzLCB7XHJcbiAgaW5pdChyb290KSB7XHJcbiAgICBzZWxlY3QoREFURV9QSUNLRVIsIHJvb3QpLmZvckVhY2goKGRhdGVQaWNrZXJFbCkgPT4ge1xyXG4gICAgICBpZighZGF0ZVBpY2tlckVsLmNsYXNzTGlzdC5jb250YWlucyhEQVRFX1BJQ0tFUl9JTklUSUFMSVpFRF9DTEFTUykpe1xyXG4gICAgICAgIGVuaGFuY2VEYXRlUGlja2VyKGRhdGVQaWNrZXJFbCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgZ2V0RGF0ZVBpY2tlckNvbnRleHQsXHJcbiAgZGlzYWJsZSxcclxuICBlbmFibGUsXHJcbiAgaXNEYXRlSW5wdXRJbnZhbGlkLFxyXG4gIHNldENhbGVuZGFyVmFsdWUsXHJcbiAgdmFsaWRhdGVEYXRlSW5wdXQsXHJcbiAgcmVuZGVyQ2FsZW5kYXIsXHJcbiAgdXBkYXRlQ2FsZW5kYXJJZlZpc2libGUsXHJcbn0pO1xyXG5cclxuLy8gI2VuZHJlZ2lvbiBEYXRlIFBpY2tlciBFdmVudCBEZWxlZ2F0aW9uIFJlZ2lzdHJhdGlvbiAvIENvbXBvbmVudFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkYXRlUGlja2VyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL2Ryb3Bkb3duJztcclxuaW1wb3J0ICcuLi9wb2x5ZmlsbHMvRnVuY3Rpb24vcHJvdG90eXBlL2JpbmQnO1xyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIHNvcnRpbmcgdmFyaWFudCBvZiBPdmVyZmxvdyBtZW51IGNvbXBvbmVudFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLm92ZXJmbG93LW1lbnUgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gRHJvcGRvd25Tb3J0IChjb250YWluZXIpe1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICB0aGlzLmJ1dHRvbiA9IGNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24tb3ZlcmZsb3ctbWVudScpWzBdO1xyXG5cclxuICAgIC8vIGlmIG5vIHZhbHVlIGlzIHNlbGVjdGVkLCBjaG9vc2UgZmlyc3Qgb3B0aW9uXHJcbiAgICBpZighdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLm92ZXJmbG93LWxpc3QgbGlbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKSl7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm92ZXJmbG93LWxpc3QgbGknKVswXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBcInRydWVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVTZWxlY3RlZFZhbHVlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQgY2xpY2sgZXZlbnRzIG9uIG92ZXJmbG93IG1lbnUgYW5kIG9wdGlvbnMgaW4gbWVudVxyXG4gKi9cclxuRHJvcGRvd25Tb3J0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMub3ZlcmZsb3dNZW51ID0gbmV3IERyb3Bkb3duKHRoaXMuYnV0dG9uKS5pbml0KCk7XHJcblxyXG4gICAgbGV0IHNvcnRpbmdPcHRpb25zID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm92ZXJmbG93LWxpc3QgbGkgYnV0dG9uJyk7XHJcbiAgICBmb3IobGV0IHMgPSAwOyBzIDwgc29ydGluZ09wdGlvbnMubGVuZ3RoOyBzKyspe1xyXG4gICAgICAgIGxldCBvcHRpb24gPSBzb3J0aW5nT3B0aW9uc1tzXTtcclxuICAgICAgICBvcHRpb24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uT3B0aW9uQ2xpY2suYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGUgYnV0dG9uIHRleHQgdG8gc2VsZWN0ZWQgdmFsdWVcclxuICovXHJcbkRyb3Bkb3duU29ydC5wcm90b3R5cGUudXBkYXRlU2VsZWN0ZWRWYWx1ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICBsZXQgc2VsZWN0ZWRJdGVtID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLm92ZXJmbG93LWxpc3QgbGlbYXJpYS1zZWxlY3RlZD1cInRydWVcIl0nKTtcclxuICAgIHRoaXMuY29udGFpbmVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbi1vdmVyZmxvdy1tZW51JylbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2VsZWN0ZWQtdmFsdWUnKVswXS5pbm5lclRleHQgPSBzZWxlY3RlZEl0ZW0uaW5uZXJUZXh0O1xyXG59XHJcblxyXG4vKipcclxuICogVHJpZ2dlcnMgd2hlbiBjaG9vc2luZyBvcHRpb24gaW4gbWVudVxyXG4gKiBAcGFyYW0ge1BvaW50ZXJFdmVudH0gZVxyXG4gKi9cclxuRHJvcGRvd25Tb3J0LnByb3RvdHlwZS5vbk9wdGlvbkNsaWNrID0gZnVuY3Rpb24oZSl7XHJcbiAgICBsZXQgbGkgPSBlLnRhcmdldC5wYXJlbnROb2RlO1xyXG4gICAgbGkucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yKCdsaVthcmlhLXNlbGVjdGVkPVwidHJ1ZVwiXScpLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcpO1xyXG4gICAgbGkuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuXHJcbiAgICBsZXQgYnV0dG9uID0gbGkucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9uLW92ZXJmbG93LW1lbnUnKVswXTtcclxuICAgIGxldCBldmVudFNlbGVjdGVkID0gbmV3IEV2ZW50KCdmZHMuZHJvcGRvd24uc2VsZWN0ZWQnKTtcclxuICAgIGV2ZW50U2VsZWN0ZWQuZGV0YWlsID0gdGhpcy50YXJnZXQ7XHJcbiAgICBidXR0b24uZGlzcGF0Y2hFdmVudChldmVudFNlbGVjdGVkKTtcclxuICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRWYWx1ZSgpO1xyXG5cclxuICAgIC8vIGhpZGUgbWVudVxyXG4gICAgbGV0IG92ZXJmbG93TWVudSA9IG5ldyBEcm9wZG93bihidXR0b24pO1xyXG4gICAgb3ZlcmZsb3dNZW51LmhpZGUoKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRHJvcGRvd25Tb3J0O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGJyZWFrcG9pbnRzID0gcmVxdWlyZSgnLi4vdXRpbHMvYnJlYWtwb2ludHMnKTtcclxuY29uc3QgQlVUVE9OID0gJy5idXR0b24tb3ZlcmZsb3ctbWVudSc7XHJcbmNvbnN0IGpzRHJvcGRvd25Db2xsYXBzZU1vZGlmaWVyID0gJ2pzLWRyb3Bkb3duLS1yZXNwb25zaXZlLWNvbGxhcHNlJzsgLy9vcHRpb246IG1ha2UgZHJvcGRvd24gYmVoYXZlIGFzIHRoZSBjb2xsYXBzZSBjb21wb25lbnQgd2hlbiBvbiBzbWFsbCBzY3JlZW5zICh1c2VkIGJ5IHN1Ym1lbnVzIGluIHRoZSBoZWFkZXIgYW5kIHN0ZXAtZHJvcGRvd24pLlxyXG5jb25zdCBUQVJHRVQgPSAnZGF0YS1qcy10YXJnZXQnO1xyXG5cclxuLyoqXHJcbiAqIEFkZCBmdW5jdGlvbmFsaXR5IHRvIG92ZXJmbG93IG1lbnUgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEJ1dHRvbkVsZW1lbnR9IGJ1dHRvbkVsZW1lbnQgT3ZlcmZsb3cgbWVudSBidXR0b25cclxuICovXHJcbmZ1bmN0aW9uIERyb3Bkb3duIChidXR0b25FbGVtZW50KSB7XHJcbiAgdGhpcy5idXR0b25FbGVtZW50ID0gYnV0dG9uRWxlbWVudDtcclxuICB0aGlzLnRhcmdldEVsID0gbnVsbDtcclxuICB0aGlzLnJlc3BvbnNpdmVMaXN0Q29sbGFwc2VFbmFibGVkID0gZmFsc2U7XHJcblxyXG4gIGlmKHRoaXMuYnV0dG9uRWxlbWVudCA9PT0gbnVsbCB8fHRoaXMuYnV0dG9uRWxlbWVudCA9PT0gdW5kZWZpbmVkKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYnV0dG9uIGZvciBvdmVyZmxvdyBtZW51IGNvbXBvbmVudC5gKTtcclxuICB9XHJcbiAgbGV0IHRhcmdldEF0dHIgPSB0aGlzLmJ1dHRvbkVsZW1lbnQuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgaWYodGFyZ2V0QXR0ciA9PT0gbnVsbCB8fCB0YXJnZXRBdHRyID09PSB1bmRlZmluZWQpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdBdHRyaWJ1dGUgY291bGQgbm90IGJlIGZvdW5kIG9uIG92ZXJmbG93IG1lbnUgY29tcG9uZW50OiAnK1RBUkdFVCk7XHJcbiAgfVxyXG4gIGxldCB0YXJnZXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldEF0dHIucmVwbGFjZSgnIycsICcnKSk7XHJcbiAgaWYodGFyZ2V0RWwgPT09IG51bGwgfHwgdGFyZ2V0RWwgPT09IHVuZGVmaW5lZCl7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhbmVsIGZvciBvdmVyZmxvdyBtZW51IGNvbXBvbmVudCBjb3VsZCBub3QgYmUgZm91bmQuJyk7XHJcbiAgfVxyXG4gIHRoaXMudGFyZ2V0RWwgPSB0YXJnZXRFbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBjbGljayBldmVudHNcclxuICovXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCl7XHJcbiAgaWYodGhpcy5idXR0b25FbGVtZW50ICE9PSBudWxsICYmIHRoaXMuYnV0dG9uRWxlbWVudCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudGFyZ2V0RWwgIT09IG51bGwgJiYgdGhpcy50YXJnZXRFbCAhPT0gdW5kZWZpbmVkKXtcclxuXHJcbiAgICBpZih0aGlzLmJ1dHRvbkVsZW1lbnQucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSB8fCB0aGlzLmJ1dHRvbkVsZW1lbnQucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSl7XHJcbiAgICAgIHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vQ2xpY2tlZCBvdXRzaWRlIGRyb3Bkb3duIC0+IGNsb3NlIGl0XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWyAwIF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvdXRzaWRlQ2xvc2UpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVsgMCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3V0c2lkZUNsb3NlKTtcclxuICAgIC8vQ2xpY2tlZCBvbiBkcm9wZG93biBvcGVuIGJ1dHRvbiAtLT4gdG9nZ2xlIGl0XHJcbiAgICB0aGlzLmJ1dHRvbkVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVEcm9wZG93bik7XHJcbiAgICB0aGlzLmJ1dHRvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVEcm9wZG93bik7XHJcbiAgICBsZXQgJG1vZHVsZSA9IHRoaXM7XHJcbiAgICAvLyBzZXQgYXJpYS1oaWRkZW4gY29ycmVjdGx5IGZvciBzY3JlZW5yZWFkZXJzIChUcmluZ3VpZGUgcmVzcG9uc2l2ZSlcclxuICAgIGlmKHRoaXMucmVzcG9uc2l2ZUxpc3RDb2xsYXBzZUVuYWJsZWQpIHtcclxuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgIGlmICh3aW5kb3cuSW50ZXJzZWN0aW9uT2JzZXJ2ZXIpIHtcclxuICAgICAgICAvLyB0cmlnZ2VyIGV2ZW50IHdoZW4gYnV0dG9uIGNoYW5nZXMgdmlzaWJpbGl0eVxyXG4gICAgICAgIGxldCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihmdW5jdGlvbiAoZW50cmllcykge1xyXG4gICAgICAgICAgLy8gYnV0dG9uIGlzIHZpc2libGVcclxuICAgICAgICAgIGlmIChlbnRyaWVzWyAwIF0uaW50ZXJzZWN0aW9uUmF0aW8pIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBidXR0b24gaXMgbm90IHZpc2libGVcclxuICAgICAgICAgICAgaWYgKCRtb2R1bGUudGFyZ2V0RWwuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAndHJ1ZScpIHtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgIHJvb3Q6IGRvY3VtZW50LmJvZHlcclxuICAgICAgICB9KTtcclxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIElFOiBJbnRlcnNlY3Rpb25PYnNlcnZlciBpcyBub3Qgc3VwcG9ydGVkLCBzbyB3ZSBsaXN0ZW4gZm9yIHdpbmRvdyByZXNpemUgYW5kIGdyaWQgYnJlYWtwb2ludCBpbnN0ZWFkXHJcbiAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKCRtb2R1bGUudHJpZ2dlckVsKSkge1xyXG4gICAgICAgICAgLy8gc21hbGwgc2NyZWVuXHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgfSBlbHNle1xyXG4gICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gTGFyZ2Ugc2NyZWVuXHJcbiAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmIChkb1Jlc3BvbnNpdmVDb2xsYXBzZSgkbW9kdWxlLnRyaWdnZXJFbCkpIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgICAkbW9kdWxlLnRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICB9IGVsc2V7XHJcbiAgICAgICAgICAgICAgJG1vZHVsZS50YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRtb2R1bGUudGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGNsb3NlT25Fc2NhcGUpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBjbG9zZU9uRXNjYXBlKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIaWRlIG92ZXJmbG93IG1lbnVcclxuICovXHJcbkRyb3Bkb3duLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKXtcclxuICB0b2dnbGUodGhpcy5idXR0b25FbGVtZW50KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNob3cgb3ZlcmZsb3cgbWVudVxyXG4gKi9cclxuRHJvcGRvd24ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpe1xyXG4gIHRvZ2dsZSh0aGlzLmJ1dHRvbkVsZW1lbnQpO1xyXG59XHJcblxyXG5sZXQgY2xvc2VPbkVzY2FwZSA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICBpZiAoa2V5ID09PSAyNykge1xyXG4gICAgY2xvc2VBbGwoZXZlbnQpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXQgYW4gQXJyYXkgb2YgYnV0dG9uIGVsZW1lbnRzIGJlbG9uZ2luZyBkaXJlY3RseSB0byB0aGUgZ2l2ZW5cclxuICogYWNjb3JkaW9uIGVsZW1lbnQuXHJcbiAqIEBwYXJhbSBwYXJlbnQgYWNjb3JkaW9uIGVsZW1lbnRcclxuICogQHJldHVybnMge05vZGVMaXN0T2Y8U1ZHRWxlbWVudFRhZ05hbWVNYXBbW3N0cmluZ11dPiB8IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnRUYWdOYW1lTWFwW1tzdHJpbmddXT4gfCBOb2RlTGlzdE9mPEVsZW1lbnQ+fVxyXG4gKi9cclxubGV0IGdldEJ1dHRvbnMgPSBmdW5jdGlvbiAocGFyZW50KSB7XHJcbiAgcmV0dXJuIHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKEJVVFRPTik7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xvc2UgYWxsIG92ZXJmbG93IG1lbnVzXHJcbiAqIEBwYXJhbSB7ZXZlbnR9IGV2ZW50IGRlZmF1bHQgaXMgbnVsbFxyXG4gKi9cclxubGV0IGNsb3NlQWxsID0gZnVuY3Rpb24gKGV2ZW50ID0gbnVsbCl7XHJcbiAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcclxuICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG5cclxuICBsZXQgb3ZlcmZsb3dNZW51RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdvdmVyZmxvdy1tZW51Jyk7XHJcbiAgZm9yIChsZXQgb2kgPSAwOyBvaSA8IG92ZXJmbG93TWVudUVsLmxlbmd0aDsgb2krKykge1xyXG4gICAgbGV0IGN1cnJlbnRPdmVyZmxvd01lbnVFTCA9IG92ZXJmbG93TWVudUVsWyBvaSBdO1xyXG4gICAgbGV0IHRyaWdnZXJFbCA9IGN1cnJlbnRPdmVyZmxvd01lbnVFTC5xdWVyeVNlbGVjdG9yKEJVVFRPTisnW2FyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJdJyk7XHJcbiAgICBpZih0cmlnZ2VyRWwgIT09IG51bGwpe1xyXG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgbGV0IHRhcmdldEVsID0gY3VycmVudE92ZXJmbG93TWVudUVMLnF1ZXJ5U2VsZWN0b3IoJyMnK3RyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoVEFSR0VUKS5yZXBsYWNlKCcjJywgJycpKTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldEVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYoZG9SZXNwb25zaXZlQ29sbGFwc2UodHJpZ2dlckVsKSl7XHJcbiAgICAgICAgICAgIGlmKHRyaWdnZXJFbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5jbG9zZScpO1xyXG4gICAgICAgICAgICAgIHRyaWdnZXJFbC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmKGNoYW5nZWQgJiYgZXZlbnQgIT09IG51bGwpe1xyXG4gICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgfVxyXG59O1xyXG5sZXQgb2Zmc2V0ID0gZnVuY3Rpb24gKGVsKSB7XHJcbiAgbGV0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcclxuICAgIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsXHJcbiAgICBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuICByZXR1cm4geyB0b3A6IHJlY3QudG9wICsgc2Nyb2xsVG9wLCBsZWZ0OiByZWN0LmxlZnQgKyBzY3JvbGxMZWZ0IH07XHJcbn07XHJcblxyXG5sZXQgdG9nZ2xlRHJvcGRvd24gPSBmdW5jdGlvbiAoZXZlbnQsIGZvcmNlQ2xvc2UgPSBmYWxzZSkge1xyXG4gIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gIHRvZ2dsZSh0aGlzLCBmb3JjZUNsb3NlKTtcclxuXHJcbn07XHJcblxyXG5sZXQgdG9nZ2xlID0gZnVuY3Rpb24oYnV0dG9uLCBmb3JjZUNsb3NlID0gZmFsc2Upe1xyXG4gIGxldCB0cmlnZ2VyRWwgPSBidXR0b247XHJcbiAgbGV0IHRhcmdldEVsID0gbnVsbDtcclxuICBpZih0cmlnZ2VyRWwgIT09IG51bGwgJiYgdHJpZ2dlckVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgbGV0IHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgICBpZih0YXJnZXRBdHRyICE9PSBudWxsICYmIHRhcmdldEF0dHIgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHRhcmdldEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYodHJpZ2dlckVsICE9PSBudWxsICYmIHRyaWdnZXJFbCAhPT0gdW5kZWZpbmVkICYmIHRhcmdldEVsICE9PSBudWxsICYmIHRhcmdldEVsICE9PSB1bmRlZmluZWQpe1xyXG4gICAgLy9jaGFuZ2Ugc3RhdGVcclxuXHJcbiAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gbnVsbDtcclxuICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gbnVsbDtcclxuXHJcbiAgICBpZih0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJyB8fCBmb3JjZUNsb3NlKXtcclxuICAgICAgLy9jbG9zZVxyXG4gICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgIHRhcmdldEVsLmNsYXNzTGlzdC5hZGQoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICB0YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgICAgICBcclxuICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5jbG9zZScpO1xyXG4gICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBcclxuICAgICAgaWYoIWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdtb2JpbGVfbmF2LWFjdGl2ZScpKXtcclxuICAgICAgICBjbG9zZUFsbCgpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vb3BlblxyXG4gICAgICB0cmlnZ2VyRWwuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LnJlbW92ZSgnY29sbGFwc2VkJyk7XHJcbiAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgICAgbGV0IGV2ZW50T3BlbiA9IG5ldyBFdmVudCgnZmRzLmRyb3Bkb3duLm9wZW4nKTtcclxuICAgICAgdHJpZ2dlckVsLmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICAgICAgbGV0IHRhcmdldE9mZnNldCA9IG9mZnNldCh0YXJnZXRFbCk7XHJcblxyXG4gICAgICBpZih0YXJnZXRPZmZzZXQubGVmdCA8IDApe1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnMHB4JztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICdhdXRvJztcclxuICAgICAgfVxyXG4gICAgICBsZXQgcmlnaHQgPSB0YXJnZXRPZmZzZXQubGVmdCArIHRhcmdldEVsLm9mZnNldFdpZHRoO1xyXG4gICAgICBpZihyaWdodCA+IHdpbmRvdy5pbm5lcldpZHRoKXtcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5sZWZ0ID0gJ2F1dG8nO1xyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLnJpZ2h0ID0gJzBweCc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBvZmZzZXRBZ2FpbiA9IG9mZnNldCh0YXJnZXRFbCk7XHJcblxyXG4gICAgICBpZihvZmZzZXRBZ2Fpbi5sZWZ0IDwgMCl7XHJcblxyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnMHB4JztcclxuICAgICAgICB0YXJnZXRFbC5zdHlsZS5yaWdodCA9ICdhdXRvJztcclxuICAgICAgfVxyXG4gICAgICByaWdodCA9IG9mZnNldEFnYWluLmxlZnQgKyB0YXJnZXRFbC5vZmZzZXRXaWR0aDtcclxuICAgICAgaWYocmlnaHQgPiB3aW5kb3cuaW5uZXJXaWR0aCl7XHJcblxyXG4gICAgICAgIHRhcmdldEVsLnN0eWxlLmxlZnQgPSAnYXV0byc7XHJcbiAgICAgICAgdGFyZ2V0RWwuc3R5bGUucmlnaHQgPSAnMHB4JztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcbn1cclxuXHJcbmxldCBoYXNQYXJlbnQgPSBmdW5jdGlvbiAoY2hpbGQsIHBhcmVudFRhZ05hbWUpe1xyXG4gIGlmKGNoaWxkLnBhcmVudE5vZGUudGFnTmFtZSA9PT0gcGFyZW50VGFnTmFtZSl7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGVsc2UgaWYocGFyZW50VGFnTmFtZSAhPT0gJ0JPRFknICYmIGNoaWxkLnBhcmVudE5vZGUudGFnTmFtZSAhPT0gJ0JPRFknKXtcclxuICAgIHJldHVybiBoYXNQYXJlbnQoY2hpbGQucGFyZW50Tm9kZSwgcGFyZW50VGFnTmFtZSk7XHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxubGV0IG91dHNpZGVDbG9zZSA9IGZ1bmN0aW9uIChldnQpe1xyXG4gIGlmKCFkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5jb250YWlucygnbW9iaWxlX25hdi1hY3RpdmUnKSl7XHJcbiAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Lm1vYmlsZV9uYXYtYWN0aXZlJykgPT09IG51bGwgJiYgIWV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdidXR0b24tbWVudS1jbG9zZScpKSB7XHJcbiAgICAgIGxldCBvcGVuRHJvcGRvd25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChCVVRUT04rJ1thcmlhLWV4cGFuZGVkPXRydWVdJyk7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3BlbkRyb3Bkb3ducy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCB0cmlnZ2VyRWwgPSBvcGVuRHJvcGRvd25zW2ldO1xyXG4gICAgICAgIGxldCB0YXJnZXRFbCA9IG51bGw7XHJcbiAgICAgICAgbGV0IHRhcmdldEF0dHIgPSB0cmlnZ2VyRWwuZ2V0QXR0cmlidXRlKFRBUkdFVCk7XHJcbiAgICAgICAgaWYgKHRhcmdldEF0dHIgIT09IG51bGwgJiYgdGFyZ2V0QXR0ciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBpZih0YXJnZXRBdHRyLmluZGV4T2YoJyMnKSAhPT0gLTEpe1xyXG4gICAgICAgICAgICB0YXJnZXRBdHRyID0gdGFyZ2V0QXR0ci5yZXBsYWNlKCcjJywgJycpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGFyZ2V0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRBdHRyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRvUmVzcG9uc2l2ZUNvbGxhcHNlKHRyaWdnZXJFbCkgfHwgKGhhc1BhcmVudCh0cmlnZ2VyRWwsICdIRUFERVInKSAmJiAhZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJsYXknKSkpIHtcclxuICAgICAgICAgIC8vY2xvc2VzIGRyb3Bkb3duIHdoZW4gY2xpY2tlZCBvdXRzaWRlXHJcbiAgICAgICAgICBpZiAoZXZ0LnRhcmdldCAhPT0gdHJpZ2dlckVsKSB7XHJcbiAgICAgICAgICAgIC8vY2xpY2tlZCBvdXRzaWRlIHRyaWdnZXIsIGZvcmNlIGNsb3NlXHJcbiAgICAgICAgICAgIHRyaWdnZXJFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICAgICAgdGFyZ2V0RWwuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgICAgIHRhcmdldEVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5kcm9wZG93bi5jbG9zZScpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyRWwuZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5sZXQgZG9SZXNwb25zaXZlQ29sbGFwc2UgPSBmdW5jdGlvbiAodHJpZ2dlckVsKXtcclxuICBpZighdHJpZ2dlckVsLmNsYXNzTGlzdC5jb250YWlucyhqc0Ryb3Bkb3duQ29sbGFwc2VNb2RpZmllcikpe1xyXG4gICAgLy8gbm90IG5hdiBvdmVyZmxvdyBtZW51XHJcbiAgICBpZih0cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLW1kLW5vLXJlc3BvbnNpdmUnKSB8fCB0cmlnZ2VyRWwucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ292ZXJmbG93LW1lbnUtLWxnLW5vLXJlc3BvbnNpdmUnKSkge1xyXG4gICAgICAvLyB0cmluaW5kaWthdG9yIG92ZXJmbG93IG1lbnVcclxuICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IGdldFRyaW5ndWlkZUJyZWFrcG9pbnQodHJpZ2dlckVsKSkge1xyXG4gICAgICAgIC8vIG92ZXJmbG93IG1lbnUgcMOlIHJlc3BvbnNpdiB0cmluZ3VpZGUgYWt0aXZlcmV0XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZXtcclxuICAgICAgLy8gbm9ybWFsIG92ZXJmbG93IG1lbnVcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5sZXQgZ2V0VHJpbmd1aWRlQnJlYWtwb2ludCA9IGZ1bmN0aW9uIChidXR0b24pe1xyXG4gIGlmKGJ1dHRvbi5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygnb3ZlcmZsb3ctbWVudS0tbWQtbm8tcmVzcG9uc2l2ZScpKXtcclxuICAgIHJldHVybiBicmVha3BvaW50cy5tZDtcclxuICB9XHJcbiAgaWYoYnV0dG9uLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdvdmVyZmxvdy1tZW51LS1sZy1uby1yZXNwb25zaXZlJykpe1xyXG4gICAgcmV0dXJuIGJyZWFrcG9pbnRzLmxnO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERyb3Bkb3duOyIsIid1c2Ugc3RyaWN0JztcclxuLyoqXHJcbiAqIEhhbmRsZSBmb2N1cyBvbiBpbnB1dCBlbGVtZW50cyB1cG9uIGNsaWNraW5nIGxpbmsgaW4gZXJyb3IgbWVzc2FnZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IEVycm9yIHN1bW1hcnkgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gRXJyb3JTdW1tYXJ5IChlbGVtZW50KSB7XHJcbiAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudHMgb24gbGlua3MgaW4gZXJyb3Igc3VtbWFyeVxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIGlmICghdGhpcy5lbGVtZW50KSB7XHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgdGhpcy5lbGVtZW50LmZvY3VzKClcclxuXHJcbiAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpKVxyXG59XHJcblxyXG4vKipcclxuKiBDbGljayBldmVudCBoYW5kbGVyXHJcbipcclxuKiBAcGFyYW0ge01vdXNlRXZlbnR9IGV2ZW50IC0gQ2xpY2sgZXZlbnRcclxuKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5oYW5kbGVDbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXRcclxuICBpZiAodGhpcy5mb2N1c1RhcmdldCh0YXJnZXQpKSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogRm9jdXMgdGhlIHRhcmdldCBlbGVtZW50XHJcbiAqXHJcbiAqIEJ5IGRlZmF1bHQsIHRoZSBicm93c2VyIHdpbGwgc2Nyb2xsIHRoZSB0YXJnZXQgaW50byB2aWV3LiBCZWNhdXNlIG91ciBsYWJlbHNcclxuICogb3IgbGVnZW5kcyBhcHBlYXIgYWJvdmUgdGhlIGlucHV0LCB0aGlzIG1lYW5zIHRoZSB1c2VyIHdpbGwgYmUgcHJlc2VudGVkIHdpdGhcclxuICogYW4gaW5wdXQgd2l0aG91dCBhbnkgY29udGV4dCwgYXMgdGhlIGxhYmVsIG9yIGxlZ2VuZCB3aWxsIGJlIG9mZiB0aGUgdG9wIG9mXHJcbiAqIHRoZSBzY3JlZW4uXHJcbiAqXHJcbiAqIE1hbnVhbGx5IGhhbmRsaW5nIHRoZSBjbGljayBldmVudCwgc2Nyb2xsaW5nIHRoZSBxdWVzdGlvbiBpbnRvIHZpZXcgYW5kIHRoZW5cclxuICogZm9jdXNzaW5nIHRoZSBlbGVtZW50IHNvbHZlcyB0aGlzLlxyXG4gKlxyXG4gKiBUaGlzIGFsc28gcmVzdWx0cyBpbiB0aGUgbGFiZWwgYW5kL29yIGxlZ2VuZCBiZWluZyBhbm5vdW5jZWQgY29ycmVjdGx5IGluXHJcbiAqIE5WREEgKGFzIHRlc3RlZCBpbiAyMDE4LjMuMikgLSB3aXRob3V0IHRoaXMgb25seSB0aGUgZmllbGQgdHlwZSBpcyBhbm5vdW5jZWRcclxuICogKGUuZy4gXCJFZGl0LCBoYXMgYXV0b2NvbXBsZXRlXCIpLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkdGFyZ2V0IC0gRXZlbnQgdGFyZ2V0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB0YXJnZXQgd2FzIGFibGUgdG8gYmUgZm9jdXNzZWRcclxuICovXHJcbkVycm9yU3VtbWFyeS5wcm90b3R5cGUuZm9jdXNUYXJnZXQgPSBmdW5jdGlvbiAoJHRhcmdldCkge1xyXG4gIC8vIElmIHRoZSBlbGVtZW50IHRoYXQgd2FzIGNsaWNrZWQgd2FzIG5vdCBhIGxpbmssIHJldHVybiBlYXJseVxyXG4gIGlmICgkdGFyZ2V0LnRhZ05hbWUgIT09ICdBJyB8fCAkdGFyZ2V0LmhyZWYgPT09IGZhbHNlKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIHZhciBpbnB1dElkID0gdGhpcy5nZXRGcmFnbWVudEZyb21VcmwoJHRhcmdldC5ocmVmKVxyXG4gIHZhciAkaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dElkKVxyXG4gIGlmICghJGlucHV0KSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIHZhciAkbGVnZW5kT3JMYWJlbCA9IHRoaXMuZ2V0QXNzb2NpYXRlZExlZ2VuZE9yTGFiZWwoJGlucHV0KVxyXG4gIGlmICghJGxlZ2VuZE9yTGFiZWwpIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgLy8gU2Nyb2xsIHRoZSBsZWdlbmQgb3IgbGFiZWwgaW50byB2aWV3ICpiZWZvcmUqIGNhbGxpbmcgZm9jdXMgb24gdGhlIGlucHV0IHRvXHJcbiAgLy8gYXZvaWQgZXh0cmEgc2Nyb2xsaW5nIGluIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBgcHJldmVudFNjcm9sbGAgKHdoaWNoXHJcbiAgLy8gYXQgdGltZSBvZiB3cml0aW5nIGlzIG1vc3Qgb2YgdGhlbS4uLilcclxuICAkbGVnZW5kT3JMYWJlbC5zY3JvbGxJbnRvVmlldygpXHJcbiAgJGlucHV0LmZvY3VzKHsgcHJldmVudFNjcm9sbDogdHJ1ZSB9KVxyXG5cclxuICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGZyYWdtZW50IGZyb20gVVJMXHJcbiAqXHJcbiAqIEV4dHJhY3QgdGhlIGZyYWdtZW50IChldmVyeXRoaW5nIGFmdGVyIHRoZSBoYXNoKSBmcm9tIGEgVVJMLCBidXQgbm90IGluY2x1ZGluZ1xyXG4gKiB0aGUgaGFzaC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFVSTFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBGcmFnbWVudCBmcm9tIFVSTCwgd2l0aG91dCB0aGUgaGFzaFxyXG4gKi9cclxuRXJyb3JTdW1tYXJ5LnByb3RvdHlwZS5nZXRGcmFnbWVudEZyb21VcmwgPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgaWYgKHVybC5pbmRleE9mKCcjJykgPT09IC0xKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcblxyXG4gIHJldHVybiB1cmwuc3BsaXQoJyMnKS5wb3AoKVxyXG59XHJcblxyXG4vKipcclxuICogR2V0IGFzc29jaWF0ZWQgbGVnZW5kIG9yIGxhYmVsXHJcbiAqXHJcbiAqIFJldHVybnMgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBleGlzdHMgZnJvbSB0aGlzIGxpc3Q6XHJcbiAqXHJcbiAqIC0gVGhlIGA8bGVnZW5kPmAgYXNzb2NpYXRlZCB3aXRoIHRoZSBjbG9zZXN0IGA8ZmllbGRzZXQ+YCBhbmNlc3RvciwgYXMgbG9uZ1xyXG4gKiAgIGFzIHRoZSB0b3Agb2YgaXQgaXMgbm8gbW9yZSB0aGFuIGhhbGYgYSB2aWV3cG9ydCBoZWlnaHQgYXdheSBmcm9tIHRoZVxyXG4gKiAgIGJvdHRvbSBvZiB0aGUgaW5wdXRcclxuICogLSBUaGUgZmlyc3QgYDxsYWJlbD5gIHRoYXQgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dCB1c2luZyBmb3I9XCJpbnB1dElkXCJcclxuICogLSBUaGUgY2xvc2VzdCBwYXJlbnQgYDxsYWJlbD5gXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9ICRpbnB1dCAtIFRoZSBpbnB1dFxyXG4gKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IEFzc29jaWF0ZWQgbGVnZW5kIG9yIGxhYmVsLCBvciBudWxsIGlmIG5vIGFzc29jaWF0ZWRcclxuICogICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQgb3IgbGFiZWwgY2FuIGJlIGZvdW5kXHJcbiAqL1xyXG5FcnJvclN1bW1hcnkucHJvdG90eXBlLmdldEFzc29jaWF0ZWRMZWdlbmRPckxhYmVsID0gZnVuY3Rpb24gKCRpbnB1dCkge1xyXG4gIHZhciAkZmllbGRzZXQgPSAkaW5wdXQuY2xvc2VzdCgnZmllbGRzZXQnKVxyXG5cclxuICBpZiAoJGZpZWxkc2V0KSB7XHJcbiAgICB2YXIgbGVnZW5kcyA9ICRmaWVsZHNldC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGVnZW5kJylcclxuXHJcbiAgICBpZiAobGVnZW5kcy5sZW5ndGgpIHtcclxuICAgICAgdmFyICRjYW5kaWRhdGVMZWdlbmQgPSBsZWdlbmRzWzBdXHJcblxyXG4gICAgICAvLyBJZiB0aGUgaW5wdXQgdHlwZSBpcyByYWRpbyBvciBjaGVja2JveCwgYWx3YXlzIHVzZSB0aGUgbGVnZW5kIGlmIHRoZXJlXHJcbiAgICAgIC8vIGlzIG9uZS5cclxuICAgICAgaWYgKCRpbnB1dC50eXBlID09PSAnY2hlY2tib3gnIHx8ICRpbnB1dC50eXBlID09PSAncmFkaW8nKSB7XHJcbiAgICAgICAgcmV0dXJuICRjYW5kaWRhdGVMZWdlbmRcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gRm9yIG90aGVyIGlucHV0IHR5cGVzLCBvbmx5IHNjcm9sbCB0byB0aGUgZmllbGRzZXTigJlzIGxlZ2VuZCAoaW5zdGVhZCBvZlxyXG4gICAgICAvLyB0aGUgbGFiZWwgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dCkgaWYgdGhlIGlucHV0IHdvdWxkIGVuZCB1cCBpbiB0aGVcclxuICAgICAgLy8gdG9wIGhhbGYgb2YgdGhlIHNjcmVlbi5cclxuICAgICAgLy9cclxuICAgICAgLy8gVGhpcyBzaG91bGQgYXZvaWQgc2l0dWF0aW9ucyB3aGVyZSB0aGUgaW5wdXQgZWl0aGVyIGVuZHMgdXAgb2ZmIHRoZVxyXG4gICAgICAvLyBzY3JlZW4sIG9yIG9ic2N1cmVkIGJ5IGEgc29mdHdhcmUga2V5Ym9hcmQuXHJcbiAgICAgIHZhciBsZWdlbmRUb3AgPSAkY2FuZGlkYXRlTGVnZW5kLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxyXG4gICAgICB2YXIgaW5wdXRSZWN0ID0gJGlucHV0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcblxyXG4gICAgICAvLyBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHRcclxuICAgICAgLy8gb3Igd2luZG93LmlubmVySGVpZ2h0IChsaWtlIElFOCksIGJhaWwgYW5kIGp1c3QgbGluayB0byB0aGUgbGFiZWwuXHJcbiAgICAgIGlmIChpbnB1dFJlY3QuaGVpZ2h0ICYmIHdpbmRvdy5pbm5lckhlaWdodCkge1xyXG4gICAgICAgIHZhciBpbnB1dEJvdHRvbSA9IGlucHV0UmVjdC50b3AgKyBpbnB1dFJlY3QuaGVpZ2h0XHJcblxyXG4gICAgICAgIGlmIChpbnB1dEJvdHRvbSAtIGxlZ2VuZFRvcCA8IHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIHtcclxuICAgICAgICAgIHJldHVybiAkY2FuZGlkYXRlTGVnZW5kXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImxhYmVsW2Zvcj0nXCIgKyAkaW5wdXQuZ2V0QXR0cmlidXRlKCdpZCcpICsgXCInXVwiKSB8fFxyXG4gICAgJGlucHV0LmNsb3Nlc3QoJ2xhYmVsJylcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXJyb3JTdW1tYXJ5OyIsIid1c2Ugc3RyaWN0JztcclxuLyoqXHJcbiAqIEFkZHMgY2xpY2sgZnVuY3Rpb25hbGl0eSB0byBtb2RhbFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSAkbW9kYWwgTW9kYWwgZWxlbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gTW9kYWwgKCRtb2RhbCkge1xyXG4gICAgdGhpcy4kbW9kYWwgPSAkbW9kYWw7XHJcbiAgICBsZXQgaWQgPSB0aGlzLiRtb2RhbC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICB0aGlzLnRyaWdnZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kdWxlPVwibW9kYWxcIl1bZGF0YS10YXJnZXQ9XCInK2lkKydcIl0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNldCBldmVudHNcclxuICovXHJcbk1vZGFsLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCB0cmlnZ2VycyA9IHRoaXMudHJpZ2dlcnM7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmlnZ2Vycy5sZW5ndGg7IGkrKyl7XHJcbiAgICBsZXQgdHJpZ2dlciA9IHRyaWdnZXJzWyBpIF07XHJcbiAgICB0cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5zaG93LmJpbmQodGhpcykpO1xyXG4gIH1cclxuICBsZXQgY2xvc2VycyA9IHRoaXMuJG1vZGFsLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZGFsLWNsb3NlXScpO1xyXG4gIGZvciAobGV0IGMgPSAwOyBjIDwgY2xvc2Vycy5sZW5ndGg7IGMrKyl7XHJcbiAgICBsZXQgY2xvc2VyID0gY2xvc2Vyc1sgYyBdO1xyXG4gICAgY2xvc2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlLmJpbmQodGhpcykpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBIaWRlIG1vZGFsXHJcbiAqL1xyXG5Nb2RhbC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpe1xyXG4gIGxldCBtb2RhbEVsZW1lbnQgPSB0aGlzLiRtb2RhbDtcclxuICBpZihtb2RhbEVsZW1lbnQgIT09IG51bGwpe1xyXG4gICAgbW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuICAgIGxldCBldmVudENsb3NlID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICBldmVudENsb3NlLmluaXRFdmVudCgnZmRzLm1vZGFsLmhpZGRlbicsIHRydWUsIHRydWUpO1xyXG4gICAgbW9kYWxFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRDbG9zZSk7XHJcblxyXG4gICAgbGV0ICRiYWNrZHJvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2RhbC1iYWNrZHJvcCcpO1xyXG4gICAgJGJhY2tkcm9wLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoJGJhY2tkcm9wKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0cmFwRm9jdXMsIHRydWUpO1xyXG5cclxuICAgIGlmKCFoYXNGb3JjZWRBY3Rpb24obW9kYWxFbGVtZW50KSl7XHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlRXNjYXBlKTtcclxuICAgIH1cclxuICAgIGxldCBkYXRhTW9kYWxPcGVuZXIgPSBtb2RhbEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW1vZGFsLW9wZW5lcicpO1xyXG4gICAgaWYoZGF0YU1vZGFsT3BlbmVyICE9PSBudWxsKXtcclxuICAgICAgbGV0IG9wZW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRhdGFNb2RhbE9wZW5lcilcclxuICAgICAgaWYob3BlbmVyICE9PSBudWxsKXtcclxuICAgICAgICBvcGVuZXIuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgICBtb2RhbEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLW1vZGFsLW9wZW5lcicpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBTaG93IG1vZGFsXHJcbiAqL1xyXG5Nb2RhbC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uIChlID0gbnVsbCl7XHJcbiAgbGV0IG1vZGFsRWxlbWVudCA9IHRoaXMuJG1vZGFsO1xyXG4gIGlmKG1vZGFsRWxlbWVudCAhPT0gbnVsbCl7XHJcbiAgICBpZihlICE9PSBudWxsKXtcclxuICAgICAgbGV0IG9wZW5lcklkID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG4gICAgICBpZihvcGVuZXJJZCA9PT0gbnVsbCl7XHJcbiAgICAgICAgb3BlbmVySWQgPSAnbW9kYWwtb3BlbmVyLScrTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDk5OTkgLSAxMDAwICsgMSkgKyAxMDAwKTtcclxuICAgICAgICBlLnRhcmdldC5zZXRBdHRyaWJ1dGUoJ2lkJywgb3BlbmVySWQpXHJcbiAgICAgIH1cclxuICAgICAgbW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1tb2RhbC1vcGVuZXInLCBvcGVuZXJJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGlkZSBvcGVuIG1vZGFscyAtIEZEUyBkbyBub3QgcmVjb21tZW5kIG1vcmUgdGhhbiBvbmUgb3BlbiBtb2RhbCBhdCBhIHRpbWVcclxuICAgIGxldCBhY3RpdmVNb2RhbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmRzLW1vZGFsW2FyaWEtaGlkZGVuPWZhbHNlXScpO1xyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFjdGl2ZU1vZGFscy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIG5ldyBNb2RhbChhY3RpdmVNb2RhbHNbaV0pLmhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBtb2RhbEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgbW9kYWxFbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcclxuXHJcbiAgICBsZXQgZXZlbnRPcGVuID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcbiAgICBldmVudE9wZW4uaW5pdEV2ZW50KCdmZHMubW9kYWwuc2hvd24nLCB0cnVlLCB0cnVlKTtcclxuICAgIG1vZGFsRWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50T3Blbik7XHJcblxyXG4gICAgbGV0ICRiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgJGJhY2tkcm9wLmNsYXNzTGlzdC5hZGQoJ21vZGFsLWJhY2tkcm9wJyk7XHJcbiAgICAkYmFja2Ryb3Auc2V0QXR0cmlidXRlKCdpZCcsIFwibW9kYWwtYmFja2Ryb3BcIik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKCRiYWNrZHJvcCk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJyk7XHJcblxyXG4gICAgbW9kYWxFbGVtZW50LmZvY3VzKCk7XHJcblxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRyYXBGb2N1cywgdHJ1ZSk7XHJcbiAgICBpZighaGFzRm9yY2VkQWN0aW9uKG1vZGFsRWxlbWVudCkpe1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZUVzY2FwZSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDbG9zZSBtb2RhbCB3aGVuIGhpdHRpbmcgRVNDXHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgXHJcbiAqL1xyXG5sZXQgaGFuZGxlRXNjYXBlID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgdmFyIGtleSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XHJcbiAgbGV0IG1vZGFsRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZHMtbW9kYWxbYXJpYS1oaWRkZW49ZmFsc2VdJyk7XHJcbiAgbGV0IGN1cnJlbnRNb2RhbCA9IG5ldyBNb2RhbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmRzLW1vZGFsW2FyaWEtaGlkZGVuPWZhbHNlXScpKTtcclxuICBpZiAoa2V5ID09PSAyNyl7XHJcbiAgICBsZXQgcG9zc2libGVPdmVyZmxvd01lbnVzID0gbW9kYWxFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXR0b24tb3ZlcmZsb3ctbWVudVthcmlhLWV4cGFuZGVkPVwidHJ1ZVwiXScpO1xyXG4gICAgaWYocG9zc2libGVPdmVyZmxvd01lbnVzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgIGN1cnJlbnRNb2RhbC5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRyYXAgZm9jdXMgaW4gbW9kYWwgd2hlbiBvcGVuXHJcbiAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBlXHJcbiAqL1xyXG4gZnVuY3Rpb24gdHJhcEZvY3VzKGUpe1xyXG4gIHZhciBjdXJyZW50RGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZkcy1tb2RhbFthcmlhLWhpZGRlbj1mYWxzZV0nKTtcclxuICBpZihjdXJyZW50RGlhbG9nICE9PSBudWxsKXtcclxuICAgIHZhciBmb2N1c2FibGVFbGVtZW50cyA9IGN1cnJlbnREaWFsb2cucXVlcnlTZWxlY3RvckFsbCgnYVtocmVmXTpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgaW5wdXQ6bm90KFt0eXBlPWhpZGRlbl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuPXRydWVdKSwgZGV0YWlsczpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSksIFt0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdKTpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbj10cnVlXSknKTtcclxuICAgIFxyXG4gICAgdmFyIGZpcnN0Rm9jdXNhYmxlRWxlbWVudCA9IGZvY3VzYWJsZUVsZW1lbnRzWzBdO1xyXG4gICAgdmFyIGxhc3RGb2N1c2FibGVFbGVtZW50ID0gZm9jdXNhYmxlRWxlbWVudHNbZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgdmFyIGlzVGFiUHJlc3NlZCA9IChlLmtleSA9PT0gJ1RhYicgfHwgZS5rZXlDb2RlID09PSA5KTtcclxuXHJcbiAgICBpZiAoIWlzVGFiUHJlc3NlZCkgeyBcclxuICAgICAgcmV0dXJuOyBcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIGUuc2hpZnRLZXkgKSAvKiBzaGlmdCArIHRhYiAqLyB7XHJcbiAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdEZvY3VzYWJsZUVsZW1lbnQpIHtcclxuICAgICAgICBsYXN0Rm9jdXNhYmxlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgLyogdGFiICovIHtcclxuICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3RGb2N1c2FibGVFbGVtZW50KSB7XHJcbiAgICAgICAgZmlyc3RGb2N1c2FibGVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBoYXNGb3JjZWRBY3Rpb24gKG1vZGFsKXtcclxuICBpZihtb2RhbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kYWwtZm9yY2VkLWFjdGlvbicpID09PSBudWxsKXtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1vZGFsO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmNvbnN0IGZvckVhY2ggPSByZXF1aXJlKCdhcnJheS1mb3JlYWNoJyk7XHJcbmNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xyXG5cclxuY29uc3QgTkFWID0gYC5uYXZgO1xyXG5jb25zdCBOQVZfTElOS1MgPSBgJHtOQVZ9IGFgO1xyXG5jb25zdCBPUEVORVJTID0gYC5qcy1tZW51LW9wZW5gO1xyXG5jb25zdCBDTE9TRV9CVVRUT04gPSBgLmpzLW1lbnUtY2xvc2VgO1xyXG5jb25zdCBPVkVSTEFZID0gYC5vdmVybGF5YDtcclxuY29uc3QgQ0xPU0VSUyA9IGAke0NMT1NFX0JVVFRPTn0sIC5vdmVybGF5YDtcclxuY29uc3QgVE9HR0xFUyA9IFsgTkFWLCBPVkVSTEFZIF0uam9pbignLCAnKTtcclxuXHJcbmNvbnN0IEFDVElWRV9DTEFTUyA9ICdtb2JpbGVfbmF2LWFjdGl2ZSc7XHJcbmNvbnN0IFZJU0lCTEVfQ0xBU1MgPSAnaXMtdmlzaWJsZSc7XHJcblxyXG4vKipcclxuICogQWRkIG1vYmlsZSBtZW51IGZ1bmN0aW9uYWxpdHlcclxuICovXHJcbmNsYXNzIE5hdmlnYXRpb24ge1xyXG4gIC8qKlxyXG4gICAqIFNldCBldmVudHNcclxuICAgKi9cclxuICBpbml0ICgpIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBtb2JpbGVNZW51LCBmYWxzZSk7XHJcbiAgICBtb2JpbGVNZW51KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgZXZlbnRzXHJcbiAgICovXHJcbiAgdGVhcmRvd24gKCkge1xyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIG1vYmlsZU1lbnUsIGZhbHNlKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGQgZnVuY3Rpb25hbGl0eSB0byBtb2JpbGUgbWVudVxyXG4gKi9cclxuY29uc3QgbW9iaWxlTWVudSA9IGZ1bmN0aW9uKCkge1xyXG4gIGxldCBtb2JpbGUgPSBmYWxzZTtcclxuICBsZXQgb3BlbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoT1BFTkVSUyk7XHJcbiAgZm9yKGxldCBvID0gMDsgbyA8IG9wZW5lcnMubGVuZ3RoOyBvKyspIHtcclxuICAgIGlmKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG9wZW5lcnNbb10sIG51bGwpLmRpc3BsYXkgIT09ICdub25lJykge1xyXG4gICAgICBvcGVuZXJzW29dLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTmF2KTtcclxuICAgICAgbW9iaWxlID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGlmIG1vYmlsZVxyXG4gIGlmKG1vYmlsZSl7XHJcbiAgICBsZXQgY2xvc2VycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoQ0xPU0VSUyk7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2xvc2Vycy5sZW5ndGg7IGMrKykge1xyXG4gICAgICBjbG9zZXJzWyBjIF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVOYXYpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBuYXZMaW5rcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoTkFWX0xJTktTKTtcclxuICAgIGZvcihsZXQgbiA9IDA7IG4gPCBuYXZMaW5rcy5sZW5ndGg7IG4rKykge1xyXG4gICAgICBuYXZMaW5rc1sgbiBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAvLyBBIG5hdmlnYXRpb24gbGluayBoYXMgYmVlbiBjbGlja2VkISBXZSB3YW50IHRvIGNvbGxhcHNlIGFueVxyXG4gICAgICAgIC8vIGhpZXJhcmNoaWNhbCBuYXZpZ2F0aW9uIFVJIGl0J3MgYSBwYXJ0IG9mLCBzbyB0aGF0IHRoZSB1c2VyXHJcbiAgICAgICAgLy8gY2FuIGZvY3VzIG9uIHdoYXRldmVyIHRoZXkndmUganVzdCBzZWxlY3RlZC5cclxuXHJcbiAgICAgICAgLy8gU29tZSBuYXZpZ2F0aW9uIGxpbmtzIGFyZSBpbnNpZGUgZHJvcGRvd25zOyB3aGVuIHRoZXkncmVcclxuICAgICAgICAvLyBjbGlja2VkLCB3ZSB3YW50IHRvIGNvbGxhcHNlIHRob3NlIGRyb3Bkb3ducy5cclxuXHJcblxyXG4gICAgICAgIC8vIElmIHRoZSBtb2JpbGUgbmF2aWdhdGlvbiBtZW51IGlzIGFjdGl2ZSwgd2Ugd2FudCB0byBoaWRlIGl0LlxyXG4gICAgICAgIGlmIChpc0FjdGl2ZSgpKSB7XHJcbiAgICAgICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0cmFwQ29udGFpbmVycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoTkFWKTtcclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0cmFwQ29udGFpbmVycy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIGZvY3VzVHJhcCA9IF9mb2N1c1RyYXAodHJhcENvbnRhaW5lcnNbaV0pO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGNvbnN0IGNsb3NlciA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihDTE9TRV9CVVRUT04pO1xyXG5cclxuICBpZiAoaXNBY3RpdmUoKSAmJiBjbG9zZXIgJiYgY2xvc2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoID09PSAwKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiBpcyBhY3RpdmUsIGJ1dCB0aGUgY2xvc2UgYm94IGlzbid0IHZpc2libGUsIHdoaWNoXHJcbiAgICAvLyBtZWFucyB0aGUgdXNlcidzIHZpZXdwb3J0IGhhcyBiZWVuIHJlc2l6ZWQgc28gdGhhdCBpdCBpcyBubyBsb25nZXJcclxuICAgIC8vIGluIG1vYmlsZSBtb2RlLiBMZXQncyBtYWtlIHRoZSBwYWdlIHN0YXRlIGNvbnNpc3RlbnQgYnlcclxuICAgIC8vIGRlYWN0aXZhdGluZyB0aGUgbW9iaWxlIG5hdi5cclxuICAgIHRvZ2dsZU5hdi5jYWxsKGNsb3NlciwgZmFsc2UpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBtb2JpbGUgbWVudSBpcyBhY3RpdmVcclxuICogQHJldHVybnMgdHJ1ZSBpZiBtb2JpbGUgbWVudSBpcyBhY3RpdmUgYW5kIGZhbHNlIGlmIG5vdCBhY3RpdmVcclxuICovXHJcbmNvbnN0IGlzQWN0aXZlID0gKCkgPT4gZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoQUNUSVZFX0NMQVNTKTtcclxuXHJcbi8qKlxyXG4gKiBUcmFwIGZvY3VzIGluIG1vYmlsZSBtZW51IGlmIGFjdGl2ZVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0cmFwQ29udGFpbmVyIFxyXG4gKi9cclxuY29uc3QgX2ZvY3VzVHJhcCA9ICh0cmFwQ29udGFpbmVyKSA9PiB7XHJcblxyXG4gIC8vIEZpbmQgYWxsIGZvY3VzYWJsZSBjaGlsZHJlblxyXG4gIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nID0gJ2FbaHJlZl0sIGFyZWFbaHJlZl0sIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCBpZnJhbWUsIG9iamVjdCwgZW1iZWQsIFt0YWJpbmRleD1cIjBcIl0sIFtjb250ZW50ZWRpdGFibGVdJztcclxuICBsZXQgZm9jdXNhYmxlRWxlbWVudHMgPSB0cmFwQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcpO1xyXG4gIGxldCBmaXJzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1sgMCBdO1xyXG5cclxuICBmdW5jdGlvbiB0cmFwVGFiS2V5IChlKSB7XHJcbiAgICB2YXIga2V5ID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcclxuICAgIC8vIENoZWNrIGZvciBUQUIga2V5IHByZXNzXHJcbiAgICBpZiAoa2V5ID09PSA5KSB7XHJcblxyXG4gICAgICBsZXQgbGFzdFRhYlN0b3AgPSBudWxsO1xyXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIGxldCBudW1iZXIgPSBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxO1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZm9jdXNhYmxlRWxlbWVudHNbIG51bWJlciAtIGkgXTtcclxuICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRXaWR0aCA+IDAgJiYgZWxlbWVudC5vZmZzZXRIZWlnaHQgPiAwKSB7XHJcbiAgICAgICAgICBsYXN0VGFiU3RvcCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFNISUZUICsgVEFCXHJcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0VGFiU3RvcCkge1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgbGFzdFRhYlN0b3AuZm9jdXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAvLyBUQUJcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdFRhYlN0b3ApIHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIEVTQ0FQRVxyXG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xyXG4gICAgICB0b2dnbGVOYXYuY2FsbCh0aGlzLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZW5hYmxlICgpIHtcclxuICAgICAgICAvLyBGb2N1cyBmaXJzdCBjaGlsZFxyXG4gICAgICAgIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xyXG4gICAgICAvLyBMaXN0ZW4gZm9yIGFuZCB0cmFwIHRoZSBrZXlib2FyZFxyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcFRhYktleSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbGVhc2UgKCkge1xyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdHJhcFRhYktleSk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcblxyXG5sZXQgZm9jdXNUcmFwO1xyXG5cclxuY29uc3QgdG9nZ2xlTmF2ID0gZnVuY3Rpb24gKGFjdGl2ZSkge1xyXG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gIGlmICh0eXBlb2YgYWN0aXZlICE9PSAnYm9vbGVhbicpIHtcclxuICAgIGFjdGl2ZSA9ICFpc0FjdGl2ZSgpO1xyXG4gIH1cclxuICBib2R5LmNsYXNzTGlzdC50b2dnbGUoQUNUSVZFX0NMQVNTLCBhY3RpdmUpO1xyXG5cclxuICBmb3JFYWNoKHNlbGVjdChUT0dHTEVTKSwgZWwgPT4ge1xyXG4gICAgZWwuY2xhc3NMaXN0LnRvZ2dsZShWSVNJQkxFX0NMQVNTLCBhY3RpdmUpO1xyXG4gIH0pO1xyXG4gIGlmIChhY3RpdmUpIHtcclxuICAgIGZvY3VzVHJhcC5lbmFibGUoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgZm9jdXNUcmFwLnJlbGVhc2UoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGNsb3NlQnV0dG9uID0gYm9keS5xdWVyeVNlbGVjdG9yKENMT1NFX0JVVFRPTik7XHJcbiAgY29uc3QgbWVudUJ1dHRvbiA9IGJvZHkucXVlcnlTZWxlY3RvcihPUEVORVJTKTtcclxuXHJcbiAgaWYgKGFjdGl2ZSAmJiBjbG9zZUJ1dHRvbikge1xyXG4gICAgLy8gVGhlIG1vYmlsZSBuYXYgd2FzIGp1c3QgYWN0aXZhdGVkLCBzbyBmb2N1cyBvbiB0aGUgY2xvc2UgYnV0dG9uLFxyXG4gICAgLy8gd2hpY2ggaXMganVzdCBiZWZvcmUgYWxsIHRoZSBuYXYgZWxlbWVudHMgaW4gdGhlIHRhYiBvcmRlci5cclxuICAgIGNsb3NlQnV0dG9uLmZvY3VzKCk7XHJcbiAgfSBlbHNlIGlmICghYWN0aXZlICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGNsb3NlQnV0dG9uICYmXHJcbiAgICAgICAgICAgICBtZW51QnV0dG9uKSB7XHJcbiAgICAvLyBUaGUgbW9iaWxlIG5hdiB3YXMganVzdCBkZWFjdGl2YXRlZCwgYW5kIGZvY3VzIHdhcyBvbiB0aGUgY2xvc2VcclxuICAgIC8vIGJ1dHRvbiwgd2hpY2ggaXMgbm8gbG9uZ2VyIHZpc2libGUuIFdlIGRvbid0IHdhbnQgdGhlIGZvY3VzIHRvXHJcbiAgICAvLyBkaXNhcHBlYXIgaW50byB0aGUgdm9pZCwgc28gZm9jdXMgb24gdGhlIG1lbnUgYnV0dG9uIGlmIGl0J3NcclxuICAgIC8vIHZpc2libGUgKHRoaXMgbWF5IGhhdmUgYmVlbiB3aGF0IHRoZSB1c2VyIHdhcyBqdXN0IGZvY3VzZWQgb24sXHJcbiAgICAvLyBpZiB0aGV5IHRyaWdnZXJlZCB0aGUgbW9iaWxlIG5hdiBieSBtaXN0YWtlKS5cclxuICAgIG1lbnVCdXR0b24uZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhY3RpdmU7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBOYXZpZ2F0aW9uOyIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgVE9HR0xFX0FUVFJJQlVURSA9ICdkYXRhLWNvbnRyb2xzJztcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGNsaWNrIGZ1bmN0aW9uYWxpdHkgdG8gcmFkaW9idXR0b24gY29sbGFwc2UgbGlzdFxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJFbGVtZW50IFxyXG4gKi9cclxuZnVuY3Rpb24gUmFkaW9Ub2dnbGVHcm91cChjb250YWluZXJFbGVtZW50KXtcclxuICAgIHRoaXMucmFkaW9Hcm91cCA9IGNvbnRhaW5lckVsZW1lbnQ7XHJcbiAgICB0aGlzLnJhZGlvRWxzID0gbnVsbDtcclxuICAgIHRoaXMudGFyZ2V0RWwgPSBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50c1xyXG4gKi9cclxuUmFkaW9Ub2dnbGVHcm91cC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpe1xyXG4gICAgdGhpcy5yYWRpb0VscyA9IHRoaXMucmFkaW9Hcm91cC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwicmFkaW9cIl0nKTtcclxuICAgIGlmKHRoaXMucmFkaW9FbHMubGVuZ3RoID09PSAwKXtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHJhZGlvYnV0dG9ucyBmb3VuZCBpbiByYWRpb2J1dHRvbiBncm91cC4nKTtcclxuICAgIH1cclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5yYWRpb0Vscy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdmFyIHJhZGlvID0gdGhpcy5yYWRpb0Vsc1sgaSBdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgICAgICBmb3IobGV0IGEgPSAwOyBhIDwgdGhhdC5yYWRpb0Vscy5sZW5ndGg7IGErKyApe1xyXG4gICAgICAgICAgICAgICAgdGhhdC50b2dnbGUodGhhdC5yYWRpb0Vsc1sgYSBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlKHJhZGlvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRvZ2dsZSByYWRpb2J1dHRvbiBjb250ZW50XHJcbiAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudH0gcmFkaW9JbnB1dEVsZW1lbnQgXHJcbiAqL1xyXG5SYWRpb1RvZ2dsZUdyb3VwLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAocmFkaW9JbnB1dEVsZW1lbnQpe1xyXG4gICAgdmFyIGNvbnRlbnRJZCA9IHJhZGlvSW5wdXRFbGVtZW50LmdldEF0dHJpYnV0ZShUT0dHTEVfQVRUUklCVVRFKTtcclxuICAgIGlmKGNvbnRlbnRJZCAhPT0gbnVsbCAmJiBjb250ZW50SWQgIT09IHVuZGVmaW5lZCAmJiBjb250ZW50SWQgIT09IFwiXCIpe1xyXG4gICAgICAgIHZhciBjb250ZW50RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGVudElkKTtcclxuICAgICAgICBpZihjb250ZW50RWxlbWVudCA9PT0gbnVsbCB8fCBjb250ZW50RWxlbWVudCA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBwYW5lbCBlbGVtZW50LiBWZXJpZnkgdmFsdWUgb2YgYXR0cmlidXRlIGArIFRPR0dMRV9BVFRSSUJVVEUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihyYWRpb0lucHV0RWxlbWVudC5jaGVja2VkKXtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQocmFkaW9JbnB1dEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5jb2xsYXBzZShyYWRpb0lucHV0RWxlbWVudCwgY29udGVudEVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEV4cGFuZCByYWRpbyBidXR0b24gY29udGVudFxyXG4gKiBAcGFyYW0ge30gcmFkaW9JbnB1dEVsZW1lbnQgUmFkaW8gSW5wdXQgZWxlbWVudFxyXG4gKiBAcGFyYW0geyp9IGNvbnRlbnRFbGVtZW50IENvbnRlbnQgZWxlbWVudFxyXG4gKi9cclxuUmFkaW9Ub2dnbGVHcm91cC5wcm90b3R5cGUuZXhwYW5kID0gZnVuY3Rpb24gKHJhZGlvSW5wdXRFbGVtZW50LCBjb250ZW50RWxlbWVudCl7XHJcbiAgICBpZihyYWRpb0lucHV0RWxlbWVudCAhPT0gbnVsbCAmJiByYWRpb0lucHV0RWxlbWVudCAhPT0gdW5kZWZpbmVkICYmIGNvbnRlbnRFbGVtZW50ICE9PSBudWxsICYmIGNvbnRlbnRFbGVtZW50ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIHJhZGlvSW5wdXRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1leHBhbmRlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgY29udGVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG4gICAgICAgIGxldCBldmVudE9wZW4gPSBuZXcgRXZlbnQoJ2Zkcy5yYWRpby5leHBhbmRlZCcpO1xyXG4gICAgICAgIHJhZGlvSW5wdXRFbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnRPcGVuKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogQ29sbGFwc2UgcmFkaW8gYnV0dG9uIGNvbnRlbnRcclxuICogQHBhcmFtIHt9IHJhZGlvSW5wdXRFbGVtZW50IFJhZGlvIElucHV0IGVsZW1lbnRcclxuICogQHBhcmFtIHsqfSBjb250ZW50RWxlbWVudCBDb250ZW50IGVsZW1lbnRcclxuICovXHJcblJhZGlvVG9nZ2xlR3JvdXAucHJvdG90eXBlLmNvbGxhcHNlID0gZnVuY3Rpb24ocmFkaW9JbnB1dEVsZW1lbnQsIGNvbnRlbnRFbGVtZW50KXtcclxuICAgIGlmKHJhZGlvSW5wdXRFbGVtZW50ICE9PSBudWxsICYmIHJhZGlvSW5wdXRFbGVtZW50ICE9PSB1bmRlZmluZWQgJiYgY29udGVudEVsZW1lbnQgIT09IG51bGwgJiYgY29udGVudEVsZW1lbnQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgcmFkaW9JbnB1dEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgY29udGVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgICAgbGV0IGV2ZW50Q2xvc2UgPSBuZXcgRXZlbnQoJ2Zkcy5yYWRpby5jb2xsYXBzZWQnKTtcclxuICAgICAgICByYWRpb0lucHV0RWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50Q2xvc2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSYWRpb1RvZ2dsZUdyb3VwOyIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgbW9kaWZpZXJTdGF0ZSA9IHtcclxuICBzaGlmdDogZmFsc2UsXHJcbiAgYWx0OiBmYWxzZSxcclxuICBjdHJsOiBmYWxzZSxcclxuICBjb21tYW5kOiBmYWxzZVxyXG59O1xyXG4vKlxyXG4qIFByZXZlbnRzIHRoZSB1c2VyIGZyb20gaW5wdXR0aW5nIGJhc2VkIG9uIGEgcmVnZXguXHJcbiogRG9lcyBub3Qgd29yayB0aGUgc2FtZSB3YXkgYWYgPGlucHV0IHBhdHRlcm49XCJcIj4sIHRoaXMgcGF0dGVybiBpcyBvbmx5IHVzZWQgZm9yIHZhbGlkYXRpb24sIG5vdCB0byBwcmV2ZW50IGlucHV0LlxyXG4qIFVzZWNhc2U6IG51bWJlciBpbnB1dCBmb3IgZGF0ZS1jb21wb25lbnQuXHJcbiogRXhhbXBsZSAtIG51bWJlciBvbmx5OiA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWlucHV0LXJlZ2V4PVwiXlxcZCokXCI+XHJcbiovXHJcbmNsYXNzIElucHV0UmVnZXhNYXNrIHtcclxuICBjb25zdHJ1Y3RvciAoZWxlbWVudCl7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgcmVnZXhNYXNrKTtcclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHJlZ2V4TWFzayk7XHJcbiAgfVxyXG59XHJcbnZhciByZWdleE1hc2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICBpZihtb2RpZmllclN0YXRlLmN0cmwgfHwgbW9kaWZpZXJTdGF0ZS5jb21tYW5kKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBuZXdDaGFyID0gbnVsbDtcclxuICBpZih0eXBlb2YgZXZlbnQua2V5ICE9PSAndW5kZWZpbmVkJyl7XHJcbiAgICBpZihldmVudC5rZXkubGVuZ3RoID09PSAxKXtcclxuICAgICAgbmV3Q2hhciA9IGV2ZW50LmtleTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYoIWV2ZW50LmNoYXJDb2RlKXtcclxuICAgICAgbmV3Q2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZXZlbnQua2V5Q29kZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShldmVudC5jaGFyQ29kZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgcmVnZXhTdHIgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1pbnB1dC1yZWdleCcpO1xyXG5cclxuICBpZihldmVudC50eXBlICE9PSB1bmRlZmluZWQgJiYgZXZlbnQudHlwZSA9PT0gJ3Bhc3RlJyl7XHJcbiAgICBjb25zb2xlLmxvZygncGFzdGUnKTtcclxuICB9IGVsc2V7XHJcbiAgICB2YXIgZWxlbWVudCA9IG51bGw7XHJcbiAgICBpZihldmVudC50YXJnZXQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XHJcbiAgICB9XHJcbiAgICBpZihuZXdDaGFyICE9PSBudWxsICYmIGVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgaWYobmV3Q2hhci5sZW5ndGggPiAwKXtcclxuICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGlmKGVsZW1lbnQudHlwZSA9PT0gJ251bWJlcicpe1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlOy8vTm90ZSBpbnB1dFt0eXBlPW51bWJlcl0gZG9lcyBub3QgaGF2ZSAuc2VsZWN0aW9uU3RhcnQvRW5kIChDaHJvbWUpLlxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlLnNsaWNlKDAsIGVsZW1lbnQuc2VsZWN0aW9uU3RhcnQpICsgdGhpcy52YWx1ZS5zbGljZShlbGVtZW50LnNlbGVjdGlvbkVuZCkgKyBuZXdDaGFyOyAvL3JlbW92ZXMgdGhlIG51bWJlcnMgc2VsZWN0ZWQgYnkgdGhlIHVzZXIsIHRoZW4gYWRkcyBuZXcgY2hhci5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByID0gbmV3IFJlZ0V4cChyZWdleFN0cik7XHJcbiAgICAgICAgaWYoci5leGVjKG5ld1ZhbHVlKSA9PT0gbnVsbCl7XHJcbiAgICAgICAgICBpZiAoZXZlbnQucHJldmVudERlZmF1bHQpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgSW5wdXRSZWdleE1hc2s7IiwiJ3VzZSBzdHJpY3QnO1xyXG5sZXQgZGsgPSB7XHJcbiAgXCJzZWxlY3Rfcm93XCI6IFwiVsOmbGcgcsOma2tlXCIsXHJcbiAgXCJ1bnNlbGVjdF9yb3dcIjogXCJGcmF2w6ZsZyByw6Zra2VcIixcclxuICBcInNlbGVjdF9hbGxfcm93c1wiOiBcIlbDpmxnIGFsbGUgcsOma2tlclwiLFxyXG4gIFwidW5zZWxlY3RfYWxsX3Jvd3NcIjogXCJGcmF2w6ZsZyBhbGxlIHLDpmtrZXJcIlxyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqIEBwYXJhbSB7SFRNTFRhYmxlRWxlbWVudH0gdGFibGUgVGFibGUgRWxlbWVudFxyXG4gKiBAcGFyYW0ge0pTT059IHN0cmluZ3MgVHJhbnNsYXRlIGxhYmVsczoge1wic2VsZWN0X3Jvd1wiOiBcIlbDpmxnIHLDpmtrZVwiLCBcInVuc2VsZWN0X3Jvd1wiOiBcIkZyYXbDpmxnIHLDpmtrZVwiLCBcInNlbGVjdF9hbGxfcm93c1wiOiBcIlbDpmxnIGFsbGUgcsOma2tlclwiLCBcInVuc2VsZWN0X2FsbF9yb3dzXCI6IFwiRnJhdsOmbGcgYWxsZSByw6Zra2VyXCJ9XHJcbiAqL1xyXG5mdW5jdGlvbiBUYWJsZVNlbGVjdGFibGVSb3dzICh0YWJsZSwgc3RyaW5ncyA9IGRrKXtcclxuICB0aGlzLnRhYmxlID0gdGFibGU7XHJcbiAgZGsgPSBzdHJpbmdzO1xyXG59XHJcblxyXG4vKipcclxuICogSW5pdGlhbGl6ZSBldmVudGxpc3RlbmVycyBmb3IgY2hlY2tib3hlcyBpbiB0YWJsZVxyXG4gKi9cclxuVGFibGVTZWxlY3RhYmxlUm93cy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5ncm91cENoZWNrYm94ID0gdGhpcy5nZXRHcm91cENoZWNrYm94KCk7XHJcbiAgdGhpcy50Ym9keUNoZWNrYm94TGlzdCA9IHRoaXMuZ2V0Q2hlY2tib3hMaXN0KCk7XHJcbiAgaWYodGhpcy50Ym9keUNoZWNrYm94TGlzdC5sZW5ndGggIT09IDApe1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IHRoaXMudGJvZHlDaGVja2JveExpc3QubGVuZ3RoOyBjKyspe1xyXG4gICAgICBsZXQgY2hlY2tib3ggPSB0aGlzLnRib2R5Q2hlY2tib3hMaXN0W2NdO1xyXG4gICAgICBjaGVja2JveC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVHcm91cENoZWNrKTtcclxuICAgICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlR3JvdXBDaGVjayk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKHRoaXMuZ3JvdXBDaGVja2JveCAhPT0gZmFsc2Upe1xyXG4gICAgdGhpcy5ncm91cENoZWNrYm94LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHVwZGF0ZUNoZWNrYm94TGlzdCk7XHJcbiAgICB0aGlzLmdyb3VwQ2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdXBkYXRlQ2hlY2tib3hMaXN0KTtcclxuICB9XHJcbn1cclxuICBcclxuLyoqXHJcbiAqIEdldCBncm91cCBjaGVja2JveCBpbiB0YWJsZSBoZWFkZXJcclxuICogQHJldHVybnMgZWxlbWVudCBvbiB0cnVlIC0gZmFsc2UgaWYgbm90IGZvdW5kXHJcbiAqL1xyXG5UYWJsZVNlbGVjdGFibGVSb3dzLnByb3RvdHlwZS5nZXRHcm91cENoZWNrYm94ID0gZnVuY3Rpb24oKXtcclxuICBsZXQgY2hlY2tib3ggPSB0aGlzLnRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aGVhZCcpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Zvcm0tY2hlY2tib3gnKTtcclxuICBpZihjaGVja2JveC5sZW5ndGggPT09IDApe1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gY2hlY2tib3hbMF07XHJcbn1cclxuLyoqXHJcbiAqIEdldCB0YWJsZSBib2R5IGNoZWNrYm94ZXNcclxuICogQHJldHVybnMgSFRNTENvbGxlY3Rpb25cclxuICovXHJcblRhYmxlU2VsZWN0YWJsZVJvd3MucHJvdG90eXBlLmdldENoZWNrYm94TGlzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgcmV0dXJuIHRoaXMudGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3Rib2R5JylbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybS1jaGVja2JveCcpO1xyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlIGNoZWNrYm94ZXMgaW4gdGFibGUgYm9keSB3aGVuIGdyb3VwIGNoZWNrYm94IGlzIGNoYW5nZWRcclxuICogQHBhcmFtIHtFdmVudH0gZSBcclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZUNoZWNrYm94TGlzdChlKXtcclxuICBsZXQgY2hlY2tib3ggPSBlLnRhcmdldDtcclxuICBjaGVja2JveC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcpO1xyXG4gIGxldCB0YWJsZSA9IGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgbGV0IHRhYmxlU2VsZWN0YWJsZVJvd3MgPSBuZXcgVGFibGVTZWxlY3RhYmxlUm93cyh0YWJsZSk7XHJcbiAgbGV0IGNoZWNrYm94TGlzdCA9IHRhYmxlU2VsZWN0YWJsZVJvd3MuZ2V0Q2hlY2tib3hMaXN0KCk7XHJcbiAgbGV0IGNoZWNrZWROdW1iZXIgPSAwO1xyXG4gIGlmKGNoZWNrYm94LmNoZWNrZWQpe1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGNoZWNrYm94TGlzdFtjXS5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay51bnNlbGVjdF9yb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrZWROdW1iZXIgPSBjaGVja2JveExpc3QubGVuZ3RoO1xyXG4gICAgY2hlY2tib3gubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnVuc2VsZWN0X2FsbF9yb3dzKTtcclxuICB9IGVsc2V7XHJcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY2hlY2tib3hMaXN0Lmxlbmd0aDsgYysrKXtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICAgICAgY2hlY2tib3hMaXN0W2NdLm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay5zZWxlY3Rfcm93KTtcclxuICAgIH1cclxuICAgIGNoZWNrYm94Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay5zZWxlY3RfYWxsX3Jvd3MpO1xyXG4gIH1cclxuICBcclxuICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImZkcy50YWJsZS5zZWxlY3RhYmxlLnVwZGF0ZWRcIiwge1xyXG4gICAgYnViYmxlczogdHJ1ZSxcclxuICAgIGNhbmNlbGFibGU6IHRydWUsXHJcbiAgICBkZXRhaWw6IHtjaGVja2VkTnVtYmVyfVxyXG4gIH0pO1xyXG4gIHRhYmxlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlIGdyb3VwIGNoZWNrYm94IHdoZW4gY2hlY2tib3ggaW4gdGFibGUgYm9keSBpcyBjaGFuZ2VkXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVHcm91cENoZWNrKGUpe1xyXG4gIC8vIHVwZGF0ZSBsYWJlbCBmb3IgZXZlbnQgY2hlY2tib3hcclxuICBpZihlLnRhcmdldC5jaGVja2VkKXtcclxuICAgIGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICAgIGUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay51bnNlbGVjdF9yb3cpO1xyXG4gIH0gZWxzZXtcclxuICAgIGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCd0YWJsZS1yb3ctc2VsZWN0ZWQnKTtcclxuICAgIGUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay5zZWxlY3Rfcm93KTtcclxuICB9XHJcbiAgbGV0IHRhYmxlID0gZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcclxuICBsZXQgdGFibGVTZWxlY3RhYmxlUm93cyA9IG5ldyBUYWJsZVNlbGVjdGFibGVSb3dzKHRhYmxlKTtcclxuICBsZXQgZ3JvdXBDaGVja2JveCA9IHRhYmxlU2VsZWN0YWJsZVJvd3MuZ2V0R3JvdXBDaGVja2JveCgpO1xyXG4gIGlmKGdyb3VwQ2hlY2tib3ggIT09IGZhbHNlKXtcclxuICAgIGxldCBjaGVja2JveExpc3QgPSB0YWJsZVNlbGVjdGFibGVSb3dzLmdldENoZWNrYm94TGlzdCgpO1xyXG5cclxuICAgIC8vIGhvdyBtYW55IHJvdyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgbGV0IGNoZWNrZWROdW1iZXIgPSAwO1xyXG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNoZWNrYm94TGlzdC5sZW5ndGg7IGMrKyl7XHJcbiAgICAgIGxldCBsb29wZWRDaGVja2JveCA9IGNoZWNrYm94TGlzdFtjXTtcclxuICAgICAgaWYobG9vcGVkQ2hlY2tib3guY2hlY2tlZCl7XHJcbiAgICAgICAgY2hlY2tlZE51bWJlcisrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKGNoZWNrZWROdW1iZXIgPT09IGNoZWNrYm94TGlzdC5sZW5ndGgpeyAvLyBpZiBhbGwgcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3gubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnVuc2VsZWN0X2FsbF9yb3dzKTtcclxuICAgIH0gZWxzZSBpZihjaGVja2VkTnVtYmVyID09IDApeyAvLyBpZiBubyByb3dzIGhhcyBiZWVuIHNlbGVjdGVkXHJcbiAgICAgIGdyb3VwQ2hlY2tib3gucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNoZWNrZWQnKTtcclxuICAgICAgZ3JvdXBDaGVja2JveC5jaGVja2VkID0gZmFsc2U7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3gubmV4dEVsZW1lbnRTaWJsaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGRrLnNlbGVjdF9hbGxfcm93cyk7XHJcbiAgICB9IGVsc2V7IC8vIGlmIHNvbWUgYnV0IG5vdCBhbGwgcm93cyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgICBncm91cENoZWNrYm94LnNldEF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJywgJ21peGVkJyk7XHJcbiAgICAgIGdyb3VwQ2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICBncm91cENoZWNrYm94Lm5leHRFbGVtZW50U2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBkay5zZWxlY3RfYWxsX3Jvd3MpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJmZHMudGFibGUuc2VsZWN0YWJsZS51cGRhdGVkXCIsIHtcclxuICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcclxuICAgICAgZGV0YWlsOiB7Y2hlY2tlZE51bWJlcn1cclxuICAgIH0pO1xyXG4gICAgdGFibGUuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUYWJsZVNlbGVjdGFibGVSb3dzOyIsImNvbnN0IHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xyXG5cclxuLyoqXHJcbiAqIFNldCBkYXRhLXRpdGxlIG9uIGNlbGxzLCB3aGVyZSB0aGUgYXR0cmlidXRlIGlzIG1pc3NpbmdcclxuICovXHJcbmNsYXNzIFJlc3BvbnNpdmVUYWJsZSB7XHJcbiAgICBjb25zdHJ1Y3RvciAodGFibGUpIHtcclxuICAgICAgaW5zZXJ0SGVhZGVyQXNBdHRyaWJ1dGVzKHRhYmxlKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBkYXRhIGF0dHJpYnV0ZXMgbmVlZGVkIGZvciByZXNwb25zaXZlIG1vZGUuXHJcbiAqIEBwYXJhbSB7SFRNTFRhYmxlRWxlbWVudH0gdGFibGVFbCBUYWJsZSBlbGVtZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBpbnNlcnRIZWFkZXJBc0F0dHJpYnV0ZXMgKHRhYmxlRWwpe1xyXG4gIGlmICghdGFibGVFbCkgcmV0dXJuO1xyXG5cclxuICBsZXQgaGVhZGVyID0gIHRhYmxlRWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RoZWFkJyk7XHJcbiAgaWYoaGVhZGVyLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgbGV0IGhlYWRlckNlbGxFbHMgPSBoZWFkZXJbIDAgXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGgnKTtcclxuICAgIGlmIChoZWFkZXJDZWxsRWxzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgIGhlYWRlckNlbGxFbHMgPSBoZWFkZXJbIDAgXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGQnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaGVhZGVyQ2VsbEVscy5sZW5ndGgpIHtcclxuICAgICAgY29uc3QgYm9keVJvd0VscyA9IHNlbGVjdCgndGJvZHkgdHInLCB0YWJsZUVsKTtcclxuICAgICAgQXJyYXkuZnJvbShib2R5Um93RWxzKS5mb3JFYWNoKHJvd0VsID0+IHtcclxuICAgICAgICBsZXQgY2VsbEVscyA9IHJvd0VsLmNoaWxkcmVuO1xyXG4gICAgICAgIGlmIChjZWxsRWxzLmxlbmd0aCA9PT0gaGVhZGVyQ2VsbEVscy5sZW5ndGgpIHtcclxuICAgICAgICAgIEFycmF5LmZyb20oaGVhZGVyQ2VsbEVscykuZm9yRWFjaCgoaGVhZGVyQ2VsbEVsLCBpKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIEdyYWIgaGVhZGVyIGNlbGwgdGV4dCBhbmQgdXNlIGl0IGJvZHkgY2VsbCBkYXRhIHRpdGxlLlxyXG4gICAgICAgICAgICBpZighY2VsbEVsc1sgaSBdLmhhc0F0dHJpYnV0ZSgnZGF0YS10aXRsZScpICl7XHJcbiAgICAgICAgICAgICAgY2VsbEVsc1sgaSBdLnNldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScsIGhlYWRlckNlbGxFbC50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zaXZlVGFibGU7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubGV0IGJyZWFrcG9pbnRzID0ge1xyXG4gICd4cyc6IDAsXHJcbiAgJ3NtJzogNTc2LFxyXG4gICdtZCc6IDc2OCxcclxuICAnbGcnOiA5OTIsXHJcbiAgJ3hsJzogMTIwMFxyXG59O1xyXG5cclxuLy8gRm9yIGVhc3kgcmVmZXJlbmNlXHJcbnZhciBrZXlzID0ge1xyXG4gIGVuZDogMzUsXHJcbiAgaG9tZTogMzYsXHJcbiAgbGVmdDogMzcsXHJcbiAgdXA6IDM4LFxyXG4gIHJpZ2h0OiAzOSxcclxuICBkb3duOiA0MCxcclxuICBkZWxldGU6IDQ2XHJcbn07XHJcblxyXG4vLyBBZGQgb3Igc3Vic3RyYWN0IGRlcGVuZGluZyBvbiBrZXkgcHJlc3NlZFxyXG52YXIgZGlyZWN0aW9uID0ge1xyXG4gIDM3OiAtMSxcclxuICAzODogLTEsXHJcbiAgMzk6IDEsXHJcbiAgNDA6IDFcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGQgZnVuY3Rpb25hbGl0eSB0byB0YWJuYXYgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhYm5hdiBUYWJuYXYgY29udGFpbmVyXHJcbiAqL1xyXG5mdW5jdGlvbiBUYWJuYXYgKHRhYm5hdikge1xyXG4gIHRoaXMudGFibmF2ID0gdGFibmF2O1xyXG4gIHRoaXMudGFicyA9IHRoaXMudGFibmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi50YWJuYXYtaXRlbScpO1xyXG59XHJcblxyXG4vKipcclxuICogU2V0IGV2ZW50IG9uIGNvbXBvbmVudFxyXG4gKi9cclxuVGFibmF2LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcclxuICBpZih0aGlzLnRhYnMubGVuZ3RoID09PSAwKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgVGFibmF2IEhUTUwgc2VlbXMgdG8gYmUgbWlzc2luZyB0YWJuYXYtaXRlbS4gQWRkIHRhYm5hdiBpdGVtcyB0byBlbnN1cmUgZWFjaCBwYW5lbCBoYXMgYSBidXR0b24gaW4gdGhlIHRhYm5hdnMgbmF2aWdhdGlvbi5gKTtcclxuICB9XHJcblxyXG4gIC8vIGlmIG5vIGhhc2ggaXMgc2V0IG9uIGxvYWQsIHNldCBhY3RpdmUgdGFiXHJcbiAgaWYgKCFzZXRBY3RpdmVIYXNoVGFiKCkpIHtcclxuICAgIC8vIHNldCBmaXJzdCB0YWIgYXMgYWN0aXZlXHJcbiAgICBsZXQgdGFiID0gdGhpcy50YWJzWyAwIF07XHJcblxyXG4gICAgLy8gY2hlY2sgbm8gb3RoZXIgdGFicyBhcyBiZWVuIHNldCBhdCBkZWZhdWx0XHJcbiAgICBsZXQgYWxyZWFkeUFjdGl2ZSA9IGdldEFjdGl2ZVRhYnModGhpcy50YWJuYXYpO1xyXG4gICAgaWYgKGFscmVhZHlBY3RpdmUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRhYiA9IGFscmVhZHlBY3RpdmVbIDAgXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhY3RpdmF0ZSBhbmQgZGVhY3RpdmF0ZSB0YWJzXHJcbiAgICB0aGlzLmFjdGl2YXRlVGFiKHRhYiwgZmFsc2UpO1xyXG4gIH1cclxuICBsZXQgJG1vZHVsZSA9IHRoaXM7XHJcbiAgLy8gYWRkIGV2ZW50bGlzdGVuZXJzIG9uIGJ1dHRvbnNcclxuICBmb3IobGV0IHQgPSAwOyB0IDwgdGhpcy50YWJzLmxlbmd0aDsgdCArKyl7XHJcbiAgICB0aGlzLnRhYnNbIHQgXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7JG1vZHVsZS5hY3RpdmF0ZVRhYih0aGlzLCBmYWxzZSl9KTtcclxuICAgIHRoaXMudGFic1sgdCBdLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlkb3duRXZlbnRMaXN0ZW5lcik7XHJcbiAgICB0aGlzLnRhYnNbIHQgXS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGtleXVwRXZlbnRMaXN0ZW5lcik7XHJcbiAgfVxyXG59XHJcblxyXG4vKioqXHJcbiAqIFNob3cgdGFiIGFuZCBoaWRlIG90aGVyc1xyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB0YWIgYnV0dG9uIGVsZW1lbnRcclxuICogQHBhcmFtIHtib29sZWFufSBzZXRGb2N1cyBUcnVlIGlmIHRhYiBidXR0b24gc2hvdWxkIGJlIGZvY3VzZWRcclxuICovXHJcbiBUYWJuYXYucHJvdG90eXBlLmFjdGl2YXRlVGFiID0gZnVuY3Rpb24odGFiLCBzZXRGb2N1cykge1xyXG4gIGxldCB0YWJzID0gZ2V0QWxsVGFic0luTGlzdCh0YWIpO1xyXG5cclxuICAvLyBjbG9zZSBhbGwgdGFicyBleGNlcHQgc2VsZWN0ZWRcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGFicy5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKHRhYnNbIGkgXSA9PT0gdGFiKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YWJzWyBpIF0uZ2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykge1xyXG4gICAgICBsZXQgZXZlbnRDbG9zZSA9IG5ldyBFdmVudCgnZmRzLnRhYm5hdi5jbG9zZScpO1xyXG4gICAgICB0YWJzWyBpIF0uZGlzcGF0Y2hFdmVudChldmVudENsb3NlKTtcclxuICAgIH1cclxuXHJcbiAgICB0YWJzWyBpIF0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xyXG4gICAgdGFic1sgaSBdLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsICdmYWxzZScpO1xyXG4gICAgbGV0IHRhYnBhbmVsSUQgPSB0YWJzWyBpIF0uZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgICBsZXQgdGFicGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YWJwYW5lbElEKVxyXG4gICAgaWYodGFicGFuZWwgPT09IG51bGwpe1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHRhYnBhbmVsLmApO1xyXG4gICAgfVxyXG4gICAgdGFicGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgfVxyXG4gIFxyXG4gIC8vIFNldCBzZWxlY3RlZCB0YWIgdG8gYWN0aXZlXHJcbiAgbGV0IHRhYnBhbmVsSUQgPSB0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyk7XHJcbiAgbGV0IHRhYnBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFicGFuZWxJRCk7XHJcbiAgaWYodGFicGFuZWwgPT09IG51bGwpe1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhY2NvcmRpb24gcGFuZWwuYCk7XHJcbiAgfVxyXG5cclxuICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuICB0YWJwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgdGFiLnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcclxuXHJcbiAgLy8gU2V0IGZvY3VzIHdoZW4gcmVxdWlyZWRcclxuICBpZiAoc2V0Rm9jdXMpIHtcclxuICAgIHRhYi5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgbGV0IGV2ZW50Q2hhbmdlZCA9IG5ldyBFdmVudCgnZmRzLnRhYm5hdi5jaGFuZ2VkJyk7XHJcbiAgdGFiLnBhcmVudE5vZGUuZGlzcGF0Y2hFdmVudChldmVudENoYW5nZWQpO1xyXG5cclxuICBsZXQgZXZlbnRPcGVuID0gbmV3IEV2ZW50KCdmZHMudGFibmF2Lm9wZW4nKTtcclxuICB0YWIuZGlzcGF0Y2hFdmVudChldmVudE9wZW4pO1xyXG59XHJcblxyXG4vKipcclxuICogQWRkIGtleWRvd24gZXZlbnRzIHRvIHRhYm5hdiBjb21wb25lbnRcclxuICogQHBhcmFtIHtLZXlib2FyZEV2ZW50fSBldmVudCBcclxuICovXHJcbmZ1bmN0aW9uIGtleWRvd25FdmVudExpc3RlbmVyIChldmVudCkge1xyXG4gIGxldCBrZXkgPSBldmVudC5rZXlDb2RlO1xyXG5cclxuICBzd2l0Y2ggKGtleSkge1xyXG4gICAgY2FzZSBrZXlzLmVuZDpcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gQWN0aXZhdGUgbGFzdCB0YWJcclxuICAgICAgZm9jdXNMYXN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmhvbWU6XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIEFjdGl2YXRlIGZpcnN0IHRhYlxyXG4gICAgICBmb2N1c0ZpcnN0VGFiKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgLy8gVXAgYW5kIGRvd24gYXJlIGluIGtleWRvd25cclxuICAgIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBwcmV2ZW50IHBhZ2Ugc2Nyb2xsID46KVxyXG4gICAgY2FzZSBrZXlzLnVwOlxyXG4gICAgY2FzZSBrZXlzLmRvd246XHJcbiAgICAgIGRldGVybWluZU9yaWVudGF0aW9uKGV2ZW50KTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWRkIGtleXVwIGV2ZW50cyB0byB0YWJuYXYgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZXZlbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBrZXl1cEV2ZW50TGlzdGVuZXIgKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIHN3aXRjaCAoa2V5KSB7XHJcbiAgICBjYXNlIGtleXMubGVmdDpcclxuICAgIGNhc2Uga2V5cy5yaWdodDpcclxuICAgICAgZGV0ZXJtaW5lT3JpZW50YXRpb24oZXZlbnQpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2Uga2V5cy5kZWxldGU6XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSBrZXlzLmVudGVyOlxyXG4gICAgY2FzZSBrZXlzLnNwYWNlOlxyXG4gICAgICBuZXcgVGFibmF2KGV2ZW50LnRhcmdldC5wYXJlbnROb2RlKS5hY3RpdmF0ZVRhYihldmVudC50YXJnZXQsIHRydWUpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXaGVuIGEgdGFibGlzdCBhcmlhLW9yaWVudGF0aW9uIGlzIHNldCB0byB2ZXJ0aWNhbCxcclxuICogb25seSB1cCBhbmQgZG93biBhcnJvdyBzaG91bGQgZnVuY3Rpb24uXHJcbiAqIEluIGFsbCBvdGhlciBjYXNlcyBvbmx5IGxlZnQgYW5kIHJpZ2h0IGFycm93IGZ1bmN0aW9uLlxyXG4gKi9cclxuZnVuY3Rpb24gZGV0ZXJtaW5lT3JpZW50YXRpb24gKGV2ZW50KSB7XHJcbiAgbGV0IGtleSA9IGV2ZW50LmtleUNvZGU7XHJcblxyXG4gIGxldCB3PXdpbmRvdyxcclxuICAgIGQ9ZG9jdW1lbnQsXHJcbiAgICBlPWQuZG9jdW1lbnRFbGVtZW50LFxyXG4gICAgZz1kLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbIDAgXSxcclxuICAgIHg9dy5pbm5lcldpZHRofHxlLmNsaWVudFdpZHRofHxnLmNsaWVudFdpZHRoLFxyXG4gICAgeT13LmlubmVySGVpZ2h0fHxlLmNsaWVudEhlaWdodHx8Zy5jbGllbnRIZWlnaHQ7XHJcblxyXG4gIGxldCB2ZXJ0aWNhbCA9IHggPCBicmVha3BvaW50cy5tZDtcclxuICBsZXQgcHJvY2VlZCA9IGZhbHNlO1xyXG5cclxuICBpZiAodmVydGljYWwpIHtcclxuICAgIGlmIChrZXkgPT09IGtleXMudXAgfHwga2V5ID09PSBrZXlzLmRvd24pIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgcHJvY2VlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgaWYgKGtleSA9PT0ga2V5cy5sZWZ0IHx8IGtleSA9PT0ga2V5cy5yaWdodCkge1xyXG4gICAgICBwcm9jZWVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHByb2NlZWQpIHtcclxuICAgIHN3aXRjaFRhYk9uQXJyb3dQcmVzcyhldmVudCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogRWl0aGVyIGZvY3VzIHRoZSBuZXh0LCBwcmV2aW91cywgZmlyc3QsIG9yIGxhc3QgdGFiXHJcbiAqIGRlcGVuZGluZyBvbiBrZXkgcHJlc3NlZFxyXG4gKi9cclxuZnVuY3Rpb24gc3dpdGNoVGFiT25BcnJvd1ByZXNzIChldmVudCkge1xyXG4gIHZhciBwcmVzc2VkID0gZXZlbnQua2V5Q29kZTtcclxuICBpZiAoZGlyZWN0aW9uWyBwcmVzc2VkIF0pIHtcclxuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICBsZXQgdGFicyA9IGdldEFsbFRhYnNJbkxpc3QodGFyZ2V0KTtcclxuICAgIGxldCBpbmRleCA9IGdldEluZGV4T2ZFbGVtZW50SW5MaXN0KHRhcmdldCwgdGFicyk7XHJcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgIGlmICh0YWJzWyBpbmRleCArIGRpcmVjdGlvblsgcHJlc3NlZCBdIF0pIHtcclxuICAgICAgICB0YWJzWyBpbmRleCArIGRpcmVjdGlvblsgcHJlc3NlZCBdIF0uZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChwcmVzc2VkID09PSBrZXlzLmxlZnQgfHwgcHJlc3NlZCA9PT0ga2V5cy51cCkge1xyXG4gICAgICAgIGZvY3VzTGFzdFRhYih0YXJnZXQpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHByZXNzZWQgPT09IGtleXMucmlnaHQgfHwgcHJlc3NlZCA9PSBrZXlzLmRvd24pIHtcclxuICAgICAgICBmb2N1c0ZpcnN0VGFiKHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHZXQgYWxsIGFjdGl2ZSB0YWJzIGluIGxpc3RcclxuICogQHBhcmFtIHRhYm5hdiBwYXJlbnQgLnRhYm5hdiBlbGVtZW50XHJcbiAqIEByZXR1cm5zIHJldHVybnMgbGlzdCBvZiBhY3RpdmUgdGFicyBpZiBhbnlcclxuICovXHJcbmZ1bmN0aW9uIGdldEFjdGl2ZVRhYnMgKHRhYm5hdikge1xyXG4gIHJldHVybiB0YWJuYXYucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLnRhYm5hdi1pdGVtW2FyaWEtc2VsZWN0ZWQ9dHJ1ZV0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBhIGxpc3Qgb2YgYWxsIGJ1dHRvbiB0YWJzIGluIGN1cnJlbnQgdGFibGlzdFxyXG4gKiBAcGFyYW0gdGFiIEJ1dHRvbiB0YWIgZWxlbWVudFxyXG4gKiBAcmV0dXJucyB7Kn0gcmV0dXJuIGFycmF5IG9mIHRhYnNcclxuICovXHJcbmZ1bmN0aW9uIGdldEFsbFRhYnNJbkxpc3QgKHRhYikge1xyXG4gIGxldCBwYXJlbnROb2RlID0gdGFiLnBhcmVudE5vZGU7XHJcbiAgaWYgKHBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0YWJuYXYnKSkge1xyXG4gICAgcmV0dXJuIHBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLnRhYm5hdi1pdGVtJyk7XHJcbiAgfVxyXG4gIHJldHVybiBbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBpbmRleCBvZiBlbGVtZW50IGluIGxpc3RcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBcclxuICogQHBhcmFtIHtIVE1MQ29sbGVjdGlvbn0gbGlzdCBcclxuICogQHJldHVybnMge2luZGV4fVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5kZXhPZkVsZW1lbnRJbkxpc3QgKGVsZW1lbnQsIGxpc3Qpe1xyXG4gIGxldCBpbmRleCA9IC0xO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyApe1xyXG4gICAgaWYobGlzdFsgaSBdID09PSBlbGVtZW50KXtcclxuICAgICAgaW5kZXggPSBpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBpbmRleDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrcyBpZiB0aGVyZSBpcyBhIHRhYiBoYXNoIGluIHRoZSB1cmwgYW5kIGFjdGl2YXRlcyB0aGUgdGFiIGFjY29yZGluZ2x5XHJcbiAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm5zIHRydWUgaWYgdGFiIGhhcyBiZWVuIHNldCAtIHJldHVybnMgZmFsc2UgaWYgbm8gdGFiIGhhcyBiZWVuIHNldCB0byBhY3RpdmVcclxuICovXHJcbmZ1bmN0aW9uIHNldEFjdGl2ZUhhc2hUYWIgKCkge1xyXG4gIGxldCBoYXNoID0gbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpO1xyXG4gIGlmIChoYXNoICE9PSAnJykge1xyXG4gICAgbGV0IHRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbi50YWJuYXYtaXRlbVthcmlhLWNvbnRyb2xzPVwiIycgKyBoYXNoICsgJ1wiXScpO1xyXG4gICAgaWYgKHRhYiAhPT0gbnVsbCkge1xyXG4gICAgICBhY3RpdmF0ZVRhYih0YWIsIGZhbHNlKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBmaXJzdCB0YWIgYnkgdGFiIGluIGxpc3RcclxuICogQHBhcmFtIHtIVE1MQnV0dG9uRWxlbWVudH0gdGFiIFxyXG4gKi9cclxuZnVuY3Rpb24gZm9jdXNGaXJzdFRhYiAodGFiKSB7XHJcbiAgZ2V0QWxsVGFic0luTGlzdCh0YWIpWyAwIF0uZm9jdXMoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCBsYXN0IHRhYiBieSB0YWIgaW4gbGlzdFxyXG4gKiBAcGFyYW0ge0hUTUxCdXR0b25FbGVtZW50fSB0YWIgXHJcbiAqL1xyXG5mdW5jdGlvbiBmb2N1c0xhc3RUYWIgKHRhYikge1xyXG4gIGxldCB0YWJzID0gZ2V0QWxsVGFic0luTGlzdCh0YWIpO1xyXG4gIHRhYnNbIHRhYnMubGVuZ3RoIC0gMSBdLmZvY3VzKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRhYm5hdjsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBTaG93L2hpZGUgdG9hc3QgY29tcG9uZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgXHJcbiAqL1xyXG5mdW5jdGlvbiBUb2FzdCAoZWxlbWVudCl7XHJcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG59XHJcblxyXG4vKipcclxuICogU2hvdyB0b2FzdFxyXG4gKi9cclxuVG9hc3QucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93aW5nJyk7XHJcbiAgICB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9hc3QtY2xvc2UnKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IHRvYXN0ID0gdGhpcy5wYXJlbnROb2RlLnBhcmVudE5vZGU7XHJcbiAgICAgICAgbmV3IFRvYXN0KHRvYXN0KS5oaWRlKCk7XHJcbiAgICB9KTtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzaG93VG9hc3QpO1xyXG59XHJcblxyXG4vKipcclxuICogSGlkZSB0b2FzdFxyXG4gKi9cclxuVG9hc3QucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7ICAgICAgICAgXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBZGRzIGNsYXNzZXMgdG8gbWFrZSBzaG93IGFuaW1hdGlvblxyXG4gKi9cclxuZnVuY3Rpb24gc2hvd1RvYXN0KCl7XHJcbiAgICBsZXQgdG9hc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRvYXN0LnNob3dpbmcnKTtcclxuICAgIGZvcihsZXQgdCA9IDA7IHQgPCB0b2FzdHMubGVuZ3RoOyB0Kyspe1xyXG4gICAgICAgIGxldCB0b2FzdCA9IHRvYXN0c1t0XTtcclxuICAgICAgICB0b2FzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93aW5nJyk7XHJcbiAgICAgICAgdG9hc3QuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUb2FzdDsiLCIndXNlIHN0cmljdCc7XHJcbi8qKlxyXG4gKiBTZXQgdG9vbHRpcCBvbiBlbGVtZW50XHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgRWxlbWVudCB3aGljaCBoYXMgdG9vbHRpcFxyXG4gKi9cclxuZnVuY3Rpb24gVG9vbHRpcChlbGVtZW50KXtcclxuICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gIGlmKHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcCcpID09PSBudWxsKXtcclxuICAgIHRocm93IG5ldyBFcnJvcihgVG9vbHRpcCB0ZXh0IGlzIG1pc3NpbmcuIEFkZCBhdHRyaWJ1dGUgZGF0YS10b29sdGlwIGFuZCB0aGUgY29udGVudCBvZiB0aGUgdG9vbHRpcCBhcyB2YWx1ZS5gKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTZXQgZXZlbnRsaXN0ZW5lcnNcclxuICovXHJcblRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKXtcclxuICBsZXQgbW9kdWxlID0gdGhpcztcclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgbGV0IHRyaWdnZXIgPSBlLnRhcmdldDtcclxuICAgICAgaWYodHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSA9PT0gZmFsc2UgJiYgdHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtZm9jdXMnKSA9PT0gZmFsc2Upe1xyXG4gICAgICAgIGNsb3NlQWxsVG9vbHRpcHMoZSk7XHJcbiAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QuYWRkKFwidG9vbHRpcC1ob3ZlclwiKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IFxyXG4gICAgICAgICAgaWYodHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSl7XHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKSAhPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBhZGRUb29sdGlwKGVsZW1lbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDMwMCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgbGV0IHRyaWdnZXIgPSBlLnRhcmdldDtcclxuICAgICAgaWYodHJpZ2dlci5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAtaG92ZXInKSl7XHJcbiAgICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgICAgdmFyIHRvb2x0aXBJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7IFxyXG4gICAgICAgIGxldCB0b29sdGlwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXBJZCk7XHJcbiAgICAgICAgaWYodG9vbHRpcEVsZW1lbnQgIT09IG51bGwpe1xyXG4gICAgICAgICAgY2xvc2VIb3ZlclRvb2x0aXAodHJpZ2dlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgIHZhciBrZXkgPSBldmVudC53aGljaCB8fCBldmVudC5rZXlDb2RlO1xyXG4gICAgICBpZiAoa2V5ID09PSAyNykge1xyXG4gICAgICAgIHZhciB0b29sdGlwID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgICBpZih0b29sdGlwICE9PSBudWxsICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvb2x0aXApICE9PSBudWxsKXtcclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgXHJcbiAgaWYodGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLXRyaWdnZXInKSA9PT0gJ2NsaWNrJyl7XHJcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgdHJpZ2dlciA9IGUudGFyZ2V0O1xyXG4gICAgICBjbG9zZUFsbFRvb2x0aXBzKGUpO1xyXG4gICAgICB0cmlnZ2VyLmNsYXNzTGlzdC5hZGQoJ3Rvb2x0aXAtZm9jdXMnKTtcclxuICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgICAgIGlmICh0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpICE9PSBudWxsKSByZXR1cm47XHJcbiAgICAgIGFkZFRvb2x0aXAodHJpZ2dlcik7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgXHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlQWxsVG9vbHRpcHMpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUFsbFRvb2x0aXBzKTtcclxufTtcclxuLyoqXHJcbiAqIENsb3NlIGFsbCB0b29sdGlwc1xyXG4gKi9cclxuZnVuY3Rpb24gY2xvc2VBbGwgKCl7XHJcbiAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRvb2x0aXBbYXJpYS1kZXNjcmliZWRieV0nKTtcclxuICBmb3IodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBwb3BwZXIgPSBlbGVtZW50c1sgaSBdLmdldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xyXG4gICAgZWxlbWVudHNbIGkgXS5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocG9wcGVyKSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRUb29sdGlwKHRyaWdnZXIpe1xyXG4gIHZhciBwb3MgPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnZGF0YS10b29sdGlwLXBvc2l0aW9uJykgfHwgJ3RvcCc7XHJcblxyXG4gIHZhciB0b29sdGlwID0gY3JlYXRlVG9vbHRpcCh0cmlnZ2VyLCBwb3MpO1xyXG5cclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvb2x0aXApO1xyXG5cclxuICBwb3NpdGlvbkF0KHRyaWdnZXIsIHRvb2x0aXAsIHBvcyk7XHJcbn1cclxuLyoqXHJcbiAqIENyZWF0ZSB0b29sdGlwIGVsZW1lbnRcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHdoaWNoIHRoZSB0b29sdGlwIGlzIGF0dGFjaGVkXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwb3MgUG9zaXRpb24gb2YgdG9vbHRpcCAodG9wIHwgYm90dG9tKVxyXG4gKiBAcmV0dXJucyBcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVRvb2x0aXAgKGVsZW1lbnQsIHBvcykge1xyXG4gIHZhciB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgdG9vbHRpcC5jbGFzc05hbWUgPSAndG9vbHRpcC1wb3BwZXInO1xyXG4gIHZhciBwb3BwZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1wb3BwZXInKTtcclxuICB2YXIgaWQgPSAndG9vbHRpcC0nK3BvcHBlcnMubGVuZ3RoKzE7XHJcbiAgdG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpO1xyXG4gIHRvb2x0aXAuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Rvb2x0aXAnKTtcclxuICB0b29sdGlwLnNldEF0dHJpYnV0ZSgneC1wbGFjZW1lbnQnLCBwb3MpO1xyXG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgaWQpO1xyXG5cclxuICB2YXIgdG9vbHRpcElubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgdG9vbHRpcElubmVyLmNsYXNzTmFtZSA9ICd0b29sdGlwJztcclxuXHJcbiAgdmFyIHRvb2x0aXBBcnJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHRvb2x0aXBBcnJvdy5jbGFzc05hbWUgPSAndG9vbHRpcC1hcnJvdyc7XHJcbiAgdG9vbHRpcElubmVyLmFwcGVuZENoaWxkKHRvb2x0aXBBcnJvdyk7XHJcblxyXG4gIHZhciB0b29sdGlwQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHRvb2x0aXBDb250ZW50LmNsYXNzTmFtZSA9ICd0b29sdGlwLWNvbnRlbnQnO1xyXG4gIHRvb2x0aXBDb250ZW50LmlubmVySFRNTCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRvb2x0aXAnKTtcclxuICB0b29sdGlwSW5uZXIuYXBwZW5kQ2hpbGQodG9vbHRpcENvbnRlbnQpO1xyXG4gIHRvb2x0aXAuYXBwZW5kQ2hpbGQodG9vbHRpcElubmVyKTtcclxuXHJcbiAgcmV0dXJuIHRvb2x0aXA7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogUG9zaXRpb25zIHRoZSB0b29sdGlwLlxyXG4gKlxyXG4gKiBAcGFyYW0ge29iamVjdH0gcGFyZW50IC0gVGhlIHRyaWdnZXIgb2YgdGhlIHRvb2x0aXAuXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSB0b29sdGlwIC0gVGhlIHRvb2x0aXAgaXRzZWxmLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcG9zSG9yaXpvbnRhbCAtIERlc2lyZWQgaG9yaXpvbnRhbCBwb3NpdGlvbiBvZiB0aGUgdG9vbHRpcCByZWxhdGl2ZWx5IHRvIHRoZSB0cmlnZ2VyIChsZWZ0L2NlbnRlci9yaWdodClcclxuICogQHBhcmFtIHtzdHJpbmd9IHBvc1ZlcnRpY2FsIC0gRGVzaXJlZCB2ZXJ0aWNhbCBwb3NpdGlvbiBvZiB0aGUgdG9vbHRpcCByZWxhdGl2ZWx5IHRvIHRoZSB0cmlnZ2VyICh0b3AvY2VudGVyL2JvdHRvbSlcclxuICpcclxuICovXHJcbiBmdW5jdGlvbiBwb3NpdGlvbkF0IChwYXJlbnQsIHRvb2x0aXAsIHBvcykge1xyXG4gIGxldCB0cmlnZ2VyID0gcGFyZW50O1xyXG4gIGxldCBhcnJvdyA9IHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdO1xyXG4gIGxldCB0cmlnZ2VyUG9zaXRpb24gPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgXHJcbiAgdmFyIHBhcmVudENvb3JkcyA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgbGVmdCwgdG9wO1xyXG5cclxuICB2YXIgdG9vbHRpcFdpZHRoID0gdG9vbHRpcC5vZmZzZXRXaWR0aDtcclxuXHJcbiAgdmFyIGRpc3QgPSAxMjtcclxuICBsZXQgYXJyb3dEaXJlY3Rpb24gPSBcImRvd25cIjtcclxuICBsZWZ0ID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLmxlZnQpICsgKChwYXJlbnQub2Zmc2V0V2lkdGggLSB0b29sdGlwLm9mZnNldFdpZHRoKSAvIDIpO1xyXG5cclxuICBzd2l0Y2ggKHBvcykge1xyXG4gICAgY2FzZSAnYm90dG9tJzpcclxuICAgICAgdG9wID0gcGFyc2VJbnQocGFyZW50Q29vcmRzLmJvdHRvbSkgKyBkaXN0O1xyXG4gICAgICBhcnJvd0RpcmVjdGlvbiA9IFwidXBcIjtcclxuICAgICAgYnJlYWs7XHJcblxyXG4gICAgZGVmYXVsdDpcclxuICAgIGNhc2UgJ3RvcCc6XHJcbiAgICAgIHRvcCA9IHBhcnNlSW50KHBhcmVudENvb3Jkcy50b3ApIC0gdG9vbHRpcC5vZmZzZXRIZWlnaHQgLSBkaXN0O1xyXG4gIH1cclxuXHJcbiAgLy8gaWYgdG9vbHRpcCBpcyBvdXQgb2YgYm91bmRzIG9uIGxlZnQgc2lkZVxyXG4gIGlmKGxlZnQgPCAwKSB7XHJcbiAgICBsZWZ0ID0gZGlzdDtcclxuICAgIGxldCBlbmRQb3NpdGlvbk9uUGFnZSA9IHRyaWdnZXJQb3NpdGlvbi5sZWZ0ICsgKHRyaWdnZXIub2Zmc2V0V2lkdGggLyAyKTtcclxuICAgIGxldCB0b29sdGlwQXJyb3dIYWxmV2lkdGggPSA4O1xyXG4gICAgbGV0IGFycm93TGVmdFBvc2l0aW9uID0gZW5kUG9zaXRpb25PblBhZ2UgLSBkaXN0IC0gdG9vbHRpcEFycm93SGFsZldpZHRoO1xyXG4gICAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uc3R5bGUubGVmdCA9IGFycm93TGVmdFBvc2l0aW9uKydweCc7XHJcbiAgfVxyXG5cclxuICAvLyBcclxuICBpZigodG9wICsgdG9vbHRpcC5vZmZzZXRIZWlnaHQpID49IHdpbmRvdy5pbm5lckhlaWdodCl7XHJcbiAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMudG9wKSAtIHRvb2x0aXAub2Zmc2V0SGVpZ2h0IC0gZGlzdDtcclxuICAgIGFycm93RGlyZWN0aW9uID0gXCJ1cFwiO1xyXG4gIH1cclxuICBcclxuICBpZih0b3AgPCAwKSB7XHJcbiAgICB0b3AgPSBwYXJzZUludChwYXJlbnRDb29yZHMuYm90dG9tKSArIGRpc3Q7XHJcbiAgICBhcnJvd0RpcmVjdGlvbiA9IFwidXBcIjtcclxuICB9XHJcbiAgaWYod2luZG93LmlubmVyV2lkdGggPCAobGVmdCArIHRvb2x0aXBXaWR0aCkpe1xyXG4gICAgdG9vbHRpcC5zdHlsZS5yaWdodCA9IGRpc3QgKyAncHgnO1xyXG4gICAgbGV0IGVuZFBvc2l0aW9uT25QYWdlID0gdHJpZ2dlclBvc2l0aW9uLnJpZ2h0IC0gKHRyaWdnZXIub2Zmc2V0V2lkdGggLyAyKTtcclxuICAgIGxldCB0b29sdGlwQXJyb3dIYWxmV2lkdGggPSA4O1xyXG4gICAgbGV0IGFycm93UmlnaHRQb3NpdGlvbiA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZW5kUG9zaXRpb25PblBhZ2UgLSBkaXN0IC0gdG9vbHRpcEFycm93SGFsZldpZHRoO1xyXG4gICAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uc3R5bGUucmlnaHQgPSBhcnJvd1JpZ2h0UG9zaXRpb24rJ3B4JztcclxuICAgIHRvb2x0aXAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndG9vbHRpcC1hcnJvdycpWzBdLnN0eWxlLmxlZnQgPSAnYXV0byc7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRvb2x0aXAuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xyXG4gIH1cclxuICB0b29sdGlwLnN0eWxlLnRvcCAgPSB0b3AgKyBwYWdlWU9mZnNldCArICdweCc7XHJcbiAgdG9vbHRpcC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0b29sdGlwLWFycm93JylbMF0uY2xhc3NMaXN0LmFkZChhcnJvd0RpcmVjdGlvbik7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjbG9zZUFsbFRvb2x0aXBzKGV2ZW50LCBmb3JjZSA9IGZhbHNlKXtcclxuICBpZiAoZm9yY2UgfHwgKCFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdqcy10b29sdGlwJykgJiYgIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2x0aXAnKSAmJiAhZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndG9vbHRpcC1jb250ZW50JykpKSB7ICBcclxuICAgIHZhciBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50b29sdGlwLXBvcHBlcicpO1xyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCB0cmlnZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2FyaWEtZGVzY3JpYmVkYnk9JytlbGVtZW50c1tpXS5nZXRBdHRyaWJ1dGUoJ2lkJykrJ10nKTtcclxuICAgICAgdHJpZ2dlci5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdG9vbHRpcC1hY3RpdmUnKTtcclxuICAgICAgdHJpZ2dlci5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgICAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWZvY3VzJyk7XHJcbiAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1ob3ZlcicpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsZW1lbnRzW2ldKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsb3NlSG92ZXJUb29sdGlwKHRyaWdnZXIpe1xyXG4gICAgdmFyIHRvb2x0aXBJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7IFxyXG4gICAgbGV0IHRvb2x0aXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcElkKTtcclxuICAgIHRvb2x0aXBFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvblRvb2x0aXBIb3Zlcik7XHJcbiAgICB0b29sdGlwRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgb25Ub29sdGlwSG92ZXIpO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpeyAgIFxyXG4gICAgICBsZXQgdG9vbHRpcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b29sdGlwSWQpO1xyXG4gICAgICBpZih0b29sdGlwRWxlbWVudCAhPT0gbnVsbCl7XHJcbiAgICAgICAgaWYoIXRyaWdnZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwidG9vbHRpcC1ob3ZlclwiKSl7XHJcbiAgICAgICAgICByZW1vdmVUb29sdGlwKHRyaWdnZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSwgMzAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25Ub29sdGlwSG92ZXIoZSl7XHJcbiAgbGV0IHRvb2x0aXBFbGVtZW50ID0gdGhpcztcclxuXHJcbiAgbGV0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1kZXNjcmliZWRieT0nK3Rvb2x0aXBFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSsnXScpO1xyXG4gIHRyaWdnZXIuY2xhc3NMaXN0LmFkZCgndG9vbHRpcC1ob3ZlcicpO1xyXG4gIFxyXG4gIHRvb2x0aXBFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpe1xyXG4gICAgbGV0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1kZXNjcmliZWRieT0nK3Rvb2x0aXBFbGVtZW50LmdldEF0dHJpYnV0ZSgnaWQnKSsnXScpO1xyXG4gICAgaWYodHJpZ2dlciAhPT0gbnVsbCl7XHJcbiAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSgndG9vbHRpcC1ob3ZlcicpO1xyXG4gICAgICBjbG9zZUhvdmVyVG9vbHRpcCh0cmlnZ2VyKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlVG9vbHRpcCh0cmlnZ2VyKXtcclxuICB2YXIgdG9vbHRpcElkID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTsgXHJcbiAgbGV0IHRvb2x0aXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9vbHRpcElkKTtcclxuICBcclxuICBpZih0b29sdGlwSWQgIT09IG51bGwgJiYgdG9vbHRpcEVsZW1lbnQgIT09IG51bGwpe1xyXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0b29sdGlwRWxlbWVudCk7XHJcbiAgfVxyXG4gIHRyaWdnZXIucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5Jyk7XHJcbiAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWhvdmVyJyk7XHJcbiAgdHJpZ2dlci5jbGFzc0xpc3QucmVtb3ZlKCd0b29sdGlwLWZvY3VzJyk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVG9vbHRpcDtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgcHJlZml4OiAnJyxcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQgQWNjb3JkaW9uIGZyb20gJy4vY29tcG9uZW50cy9hY2NvcmRpb24nO1xyXG5pbXBvcnQgQWxlcnQgZnJvbSAnLi9jb21wb25lbnRzL2FsZXJ0JztcclxuaW1wb3J0IENoZWNrYm94VG9nZ2xlQ29udGVudCBmcm9tICcuL2NvbXBvbmVudHMvY2hlY2tib3gtdG9nZ2xlLWNvbnRlbnQnO1xyXG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9jb21wb25lbnRzL2Ryb3Bkb3duJztcclxuaW1wb3J0IERyb3Bkb3duU29ydCBmcm9tICcuL2NvbXBvbmVudHMvZHJvcGRvd24tc29ydCc7XHJcbmltcG9ydCBFcnJvclN1bW1hcnkgZnJvbSAnLi9jb21wb25lbnRzL2Vycm9yLXN1bW1hcnknO1xyXG5pbXBvcnQgSW5wdXRSZWdleE1hc2sgZnJvbSAnLi9jb21wb25lbnRzL3JlZ2V4LWlucHV0LW1hc2snO1xyXG5pbXBvcnQgTW9kYWwgZnJvbSAnLi9jb21wb25lbnRzL21vZGFsJztcclxuaW1wb3J0IE5hdmlnYXRpb24gZnJvbSAnLi9jb21wb25lbnRzL25hdmlnYXRpb24nO1xyXG5pbXBvcnQgUmFkaW9Ub2dnbGVHcm91cCBmcm9tICcuL2NvbXBvbmVudHMvcmFkaW8tdG9nZ2xlLWNvbnRlbnQnO1xyXG5pbXBvcnQgUmVzcG9uc2l2ZVRhYmxlIGZyb20gJy4vY29tcG9uZW50cy90YWJsZSc7XHJcbmltcG9ydCBUYWJuYXYgZnJvbSAgJy4vY29tcG9uZW50cy90YWJuYXYnO1xyXG5pbXBvcnQgVGFibGVTZWxlY3RhYmxlUm93cyBmcm9tICcuL2NvbXBvbmVudHMvc2VsZWN0YWJsZS10YWJsZSc7XHJcbmltcG9ydCBUb2FzdCBmcm9tICcuL2NvbXBvbmVudHMvdG9hc3QnO1xyXG5pbXBvcnQgVG9vbHRpcCBmcm9tICcuL2NvbXBvbmVudHMvdG9vbHRpcCc7XHJcbmNvbnN0IGRhdGVQaWNrZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvZGF0ZS1waWNrZXInKTtcclxuLyoqXHJcbiAqIFRoZSAncG9seWZpbGxzJyBkZWZpbmUga2V5IEVDTUFTY3JpcHQgNSBtZXRob2RzIHRoYXQgbWF5IGJlIG1pc3NpbmcgZnJvbVxyXG4gKiBvbGRlciBicm93c2Vycywgc28gbXVzdCBiZSBsb2FkZWQgZmlyc3QuXHJcbiAqL1xyXG5yZXF1aXJlKCcuL3BvbHlmaWxscycpO1xyXG5cclxuLyoqXHJcbiAqIEluaXQgYWxsIGNvbXBvbmVudHNcclxuICogQHBhcmFtIHtKU09OfSBvcHRpb25zIHtzY29wZTogSFRNTEVsZW1lbnR9IC0gSW5pdCBhbGwgY29tcG9uZW50cyB3aXRoaW4gc2NvcGUgKGRlZmF1bHQgaXMgZG9jdW1lbnQpXHJcbiAqL1xyXG52YXIgaW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgLy8gU2V0IHRoZSBvcHRpb25zIHRvIGFuIGVtcHR5IG9iamVjdCBieSBkZWZhdWx0IGlmIG5vIG9wdGlvbnMgYXJlIHBhc3NlZC5cclxuICBvcHRpb25zID0gdHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucyA6IHt9XHJcblxyXG4gIC8vIEFsbG93IHRoZSB1c2VyIHRvIGluaXRpYWxpc2UgRkRTIGluIG9ubHkgY2VydGFpbiBzZWN0aW9ucyBvZiB0aGUgcGFnZVxyXG4gIC8vIERlZmF1bHRzIHRvIHRoZSBlbnRpcmUgZG9jdW1lbnQgaWYgbm90aGluZyBpcyBzZXQuXHJcbiAgdmFyIHNjb3BlID0gdHlwZW9mIG9wdGlvbnMuc2NvcGUgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5zY29wZSA6IGRvY3VtZW50XHJcblxyXG4gIC8qXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgQWNjb3JkaW9uc1xyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvckFjY29yZGlvbiA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2FjY29yZGlvbicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yQWNjb3JkaW9uLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBBY2NvcmRpb24oanNTZWxlY3RvckFjY29yZGlvblsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG4gIGNvbnN0IGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZCA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY2NvcmRpb24tYm9yZGVyZWQ6bm90KC5hY2NvcmRpb24pJyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgQWNjb3JkaW9uKGpzU2VsZWN0b3JBY2NvcmRpb25Cb3JkZXJlZFsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIEFsZXJ0c1xyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcblxyXG4gIGNvbnN0IGFsZXJ0c1dpdGhDbG9zZUJ1dHRvbiA9IHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbGVydC5oYXMtY2xvc2UnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwgYWxlcnRzV2l0aENsb3NlQnV0dG9uLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBBbGVydChhbGVydHNXaXRoQ2xvc2VCdXR0b25bIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuICBcclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIENoZWNrYm94IGNvbGxhcHNlXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yQ2hlY2tib3hDb2xsYXBzZSA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWNoZWNrYm94LXRvZ2dsZS1jb250ZW50Jyk7XHJcbiAgZm9yKGxldCBjID0gMDsgYyA8IGpzU2VsZWN0b3JDaGVja2JveENvbGxhcHNlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBDaGVja2JveFRvZ2dsZUNvbnRlbnQoanNTZWxlY3RvckNoZWNrYm94Q29sbGFwc2VbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBPdmVyZmxvdyBtZW51XHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yRHJvcGRvd24gPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1kcm9wZG93bicpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yRHJvcGRvd24ubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IERyb3Bkb3duKGpzU2VsZWN0b3JEcm9wZG93blsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBcclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIE92ZXJmbG93IG1lbnUgc29ydFxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvckRyb3Bkb3duU29ydCA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ292ZXJmbG93LW1lbnUtLXNvcnQnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvckRyb3Bkb3duU29ydC5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgRHJvcGRvd25Tb3J0KGpzU2VsZWN0b3JEcm9wZG93blNvcnRbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBEYXRlcGlja2VyXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBkYXRlUGlja2VyLm9uKHNjb3BlKTtcclxuICBcclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIEVycm9yIHN1bW1hcnlcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIHZhciAkZXJyb3JTdW1tYXJ5ID0gc2NvcGUucXVlcnlTZWxlY3RvcignW2RhdGEtbW9kdWxlPVwiZXJyb3Itc3VtbWFyeVwiXScpO1xyXG4gIG5ldyBFcnJvclN1bW1hcnkoJGVycm9yU3VtbWFyeSkuaW5pdCgpO1xyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIElucHV0IFJlZ2V4IC0gdXNlZCBvbiBkYXRlIGZpZWxkc1xyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICovXHJcbiAgY29uc3QganNTZWxlY3RvclJlZ2V4ID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbZGF0YS1pbnB1dC1yZWdleF0nKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclJlZ2V4Lmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBJbnB1dFJlZ2V4TWFzayhqc1NlbGVjdG9yUmVnZXhbIGMgXSk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIE1vZGFsXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBtb2RhbHMgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCcuZmRzLW1vZGFsJyk7XHJcbiAgZm9yKGxldCBkID0gMDsgZCA8IG1vZGFscy5sZW5ndGg7IGQrKykge1xyXG4gICAgbmV3IE1vZGFsKG1vZGFsc1tkXSkuaW5pdCgpO1xyXG4gIH1cclxuICBcclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIE5hdmlnYXRpb25cclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIG5ldyBOYXZpZ2F0aW9uKCkuaW5pdCgpO1xyXG4gICBcclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFJhZGlvYnV0dG9uIGdyb3VwIGNvbGxhcHNlXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yUmFkaW9Db2xsYXBzZSA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXJhZGlvLXRvZ2dsZS1ncm91cCcpO1xyXG4gIGZvcihsZXQgYyA9IDA7IGMgPCBqc1NlbGVjdG9yUmFkaW9Db2xsYXBzZS5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgUmFkaW9Ub2dnbGVHcm91cChqc1NlbGVjdG9yUmFkaW9Db2xsYXBzZVsgYyBdKS5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFJlc3BvbnNpdmUgdGFibGVzXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yVGFibGUgPSBzY29wZS5xdWVyeVNlbGVjdG9yQWxsKCd0YWJsZTpub3QoLmRhdGFUYWJsZSknKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRhYmxlLmxlbmd0aDsgYysrKXtcclxuICAgIG5ldyBSZXNwb25zaXZlVGFibGUoanNTZWxlY3RvclRhYmxlWyBjIF0pO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBTZWxlY3RhYmxlIHJvd3MgaW4gdGFibGVcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0YWJsZVRhYmxlID0gc2NvcGUucXVlcnlTZWxlY3RvckFsbCgndGFibGUudGFibGUtLXNlbGVjdGFibGUnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RhYmxlVGFibGUubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFRhYmxlU2VsZWN0YWJsZVJvd3MoanNTZWxlY3RhYmxlVGFibGVbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBUYWJuYXZcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAqL1xyXG4gIGNvbnN0IGpzU2VsZWN0b3JUYWJuYXYgPSBzY29wZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0YWJuYXYnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRhYm5hdi5sZW5ndGg7IGMrKyl7XHJcbiAgICBuZXcgVGFibmF2KGpzU2VsZWN0b3JUYWJuYXZbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBUb29sdGlwXHJcbiAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgKi9cclxuICBjb25zdCBqc1NlbGVjdG9yVG9vbHRpcCA9IHNjb3BlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXRvb2x0aXAnKTtcclxuICBmb3IobGV0IGMgPSAwOyBjIDwganNTZWxlY3RvclRvb2x0aXAubGVuZ3RoOyBjKyspe1xyXG4gICAgbmV3IFRvb2x0aXAoanNTZWxlY3RvclRvb2x0aXBbIGMgXSkuaW5pdCgpO1xyXG4gIH1cclxuICBcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0geyBpbml0LCBBY2NvcmRpb24sIEFsZXJ0LCBDaGVja2JveFRvZ2dsZUNvbnRlbnQsIERyb3Bkb3duLCBEcm9wZG93blNvcnQsIGRhdGVQaWNrZXIsIEVycm9yU3VtbWFyeSwgSW5wdXRSZWdleE1hc2ssIE1vZGFsLCBOYXZpZ2F0aW9uLCBSYWRpb1RvZ2dsZUdyb3VwLCBSZXNwb25zaXZlVGFibGUsIFRhYmxlU2VsZWN0YWJsZVJvd3MsIFRhYm5hdiwgVG9hc3QsIFRvb2x0aXB9OyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIC8vIFRoaXMgdXNlZCB0byBiZSBjb25kaXRpb25hbGx5IGRlcGVuZGVudCBvbiB3aGV0aGVyIHRoZVxyXG4gIC8vIGJyb3dzZXIgc3VwcG9ydGVkIHRvdWNoIGV2ZW50czsgaWYgaXQgZGlkLCBgQ0xJQ0tgIHdhcyBzZXQgdG9cclxuICAvLyBgdG91Y2hzdGFydGAuICBIb3dldmVyLCB0aGlzIGhhZCBkb3duc2lkZXM6XHJcbiAgLy9cclxuICAvLyAqIEl0IHByZS1lbXB0ZWQgbW9iaWxlIGJyb3dzZXJzJyBkZWZhdWx0IGJlaGF2aW9yIG9mIGRldGVjdGluZ1xyXG4gIC8vICAgd2hldGhlciBhIHRvdWNoIHR1cm5lZCBpbnRvIGEgc2Nyb2xsLCB0aGVyZWJ5IHByZXZlbnRpbmdcclxuICAvLyAgIHVzZXJzIGZyb20gdXNpbmcgc29tZSBvZiBvdXIgY29tcG9uZW50cyBhcyBzY3JvbGwgc3VyZmFjZXMuXHJcbiAgLy9cclxuICAvLyAqIFNvbWUgZGV2aWNlcywgc3VjaCBhcyB0aGUgTWljcm9zb2Z0IFN1cmZhY2UgUHJvLCBzdXBwb3J0ICpib3RoKlxyXG4gIC8vICAgdG91Y2ggYW5kIGNsaWNrcy4gVGhpcyBtZWFudCB0aGUgY29uZGl0aW9uYWwgZWZmZWN0aXZlbHkgZHJvcHBlZFxyXG4gIC8vICAgc3VwcG9ydCBmb3IgdGhlIHVzZXIncyBtb3VzZSwgZnJ1c3RyYXRpbmcgdXNlcnMgd2hvIHByZWZlcnJlZFxyXG4gIC8vICAgaXQgb24gdGhvc2Ugc3lzdGVtcy5cclxuICBDTElDSzogJ2NsaWNrJyxcclxufTtcclxuIiwiaW1wb3J0ICcuLi8uLi9PYmplY3QvZGVmaW5lUHJvcGVydHknXHJcblxyXG4oZnVuY3Rpb24odW5kZWZpbmVkKSB7XHJcbiAgLy8gRGV0ZWN0aW9uIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL0ZpbmFuY2lhbC1UaW1lcy9wb2x5ZmlsbC1zZXJ2aWNlL2Jsb2IvbWFzdGVyL3BhY2thZ2VzL3BvbHlmaWxsLWxpYnJhcnkvcG9seWZpbGxzL0Z1bmN0aW9uL3Byb3RvdHlwZS9iaW5kL2RldGVjdC5qc1xyXG4gIHZhciBkZXRlY3QgPSAnYmluZCcgaW4gRnVuY3Rpb24ucHJvdG90eXBlXHJcblxyXG4gIGlmIChkZXRlY3QpIHJldHVyblxyXG5cclxuICAvLyBQb2x5ZmlsbCBmcm9tIGh0dHBzOi8vY2RuLnBvbHlmaWxsLmlvL3YyL3BvbHlmaWxsLmpzP2ZlYXR1cmVzPUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kJmZsYWdzPWFsd2F5c1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShGdW5jdGlvbi5wcm90b3R5cGUsICdiaW5kJywge1xyXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYmluZCh0aGF0KSB7IC8vIC5sZW5ndGggaXMgMVxyXG4gICAgICAgICAgLy8gYWRkIG5lY2Vzc2FyeSBlczUtc2hpbSB1dGlsaXRpZXNcclxuICAgICAgICAgIHZhciAkQXJyYXkgPSBBcnJheTtcclxuICAgICAgICAgIHZhciAkT2JqZWN0ID0gT2JqZWN0O1xyXG4gICAgICAgICAgdmFyIE9iamVjdFByb3RvdHlwZSA9ICRPYmplY3QucHJvdG90eXBlO1xyXG4gICAgICAgICAgdmFyIEFycmF5UHJvdG90eXBlID0gJEFycmF5LnByb3RvdHlwZTtcclxuICAgICAgICAgIHZhciBFbXB0eSA9IGZ1bmN0aW9uIEVtcHR5KCkge307XHJcbiAgICAgICAgICB2YXIgdG9fc3RyaW5nID0gT2JqZWN0UHJvdG90eXBlLnRvU3RyaW5nO1xyXG4gICAgICAgICAgdmFyIGhhc1RvU3RyaW5nVGFnID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJztcclxuICAgICAgICAgIHZhciBpc0NhbGxhYmxlOyAvKiBpbmxpbmVkIGZyb20gaHR0cHM6Ly9ucG1qcy5jb20vaXMtY2FsbGFibGUgKi8gdmFyIGZuVG9TdHIgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcsIHRyeUZ1bmN0aW9uT2JqZWN0ID0gZnVuY3Rpb24gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpIHsgdHJ5IHsgZm5Ub1N0ci5jYWxsKHZhbHVlKTsgcmV0dXJuIHRydWU7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9IH0sIGZuQ2xhc3MgPSAnW29iamVjdCBGdW5jdGlvbl0nLCBnZW5DbGFzcyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSc7IGlzQ2FsbGFibGUgPSBmdW5jdGlvbiBpc0NhbGxhYmxlKHZhbHVlKSB7IGlmICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIGZhbHNlOyB9IGlmIChoYXNUb1N0cmluZ1RhZykgeyByZXR1cm4gdHJ5RnVuY3Rpb25PYmplY3QodmFsdWUpOyB9IHZhciBzdHJDbGFzcyA9IHRvX3N0cmluZy5jYWxsKHZhbHVlKTsgcmV0dXJuIHN0ckNsYXNzID09PSBmbkNsYXNzIHx8IHN0ckNsYXNzID09PSBnZW5DbGFzczsgfTtcclxuICAgICAgICAgIHZhciBhcnJheV9zbGljZSA9IEFycmF5UHJvdG90eXBlLnNsaWNlO1xyXG4gICAgICAgICAgdmFyIGFycmF5X2NvbmNhdCA9IEFycmF5UHJvdG90eXBlLmNvbmNhdDtcclxuICAgICAgICAgIHZhciBhcnJheV9wdXNoID0gQXJyYXlQcm90b3R5cGUucHVzaDtcclxuICAgICAgICAgIHZhciBtYXggPSBNYXRoLm1heDtcclxuICAgICAgICAgIC8vIC9hZGQgbmVjZXNzYXJ5IGVzNS1zaGltIHV0aWxpdGllc1xyXG5cclxuICAgICAgICAgIC8vIDEuIExldCBUYXJnZXQgYmUgdGhlIHRoaXMgdmFsdWUuXHJcbiAgICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcztcclxuICAgICAgICAgIC8vIDIuIElmIElzQ2FsbGFibGUoVGFyZ2V0KSBpcyBmYWxzZSwgdGhyb3cgYSBUeXBlRXJyb3IgZXhjZXB0aW9uLlxyXG4gICAgICAgICAgaWYgKCFpc0NhbGxhYmxlKHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBjYWxsZWQgb24gaW5jb21wYXRpYmxlICcgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gMy4gTGV0IEEgYmUgYSBuZXcgKHBvc3NpYmx5IGVtcHR5KSBpbnRlcm5hbCBsaXN0IG9mIGFsbCBvZiB0aGVcclxuICAgICAgICAgIC8vICAgYXJndW1lbnQgdmFsdWVzIHByb3ZpZGVkIGFmdGVyIHRoaXNBcmcgKGFyZzEsIGFyZzIgZXRjKSwgaW4gb3JkZXIuXHJcbiAgICAgICAgICAvLyBYWFggc2xpY2VkQXJncyB3aWxsIHN0YW5kIGluIGZvciBcIkFcIiBpZiB1c2VkXHJcbiAgICAgICAgICB2YXIgYXJncyA9IGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTsgLy8gZm9yIG5vcm1hbCBjYWxsXHJcbiAgICAgICAgICAvLyA0LiBMZXQgRiBiZSBhIG5ldyBuYXRpdmUgRUNNQVNjcmlwdCBvYmplY3QuXHJcbiAgICAgICAgICAvLyAxMS4gU2V0IHRoZSBbW1Byb3RvdHlwZV1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgdG8gdGhlIHN0YW5kYXJkXHJcbiAgICAgICAgICAvLyAgIGJ1aWx0LWluIEZ1bmN0aW9uIHByb3RvdHlwZSBvYmplY3QgYXMgc3BlY2lmaWVkIGluIDE1LjMuMy4xLlxyXG4gICAgICAgICAgLy8gMTIuIFNldCB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cclxuICAgICAgICAgIC8vICAgMTUuMy40LjUuMS5cclxuICAgICAgICAgIC8vIDEzLiBTZXQgdGhlIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cclxuICAgICAgICAgIC8vICAgMTUuMy40LjUuMi5cclxuICAgICAgICAgIC8vIDE0LiBTZXQgdGhlIFtbSGFzSW5zdGFuY2VdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIGFzIGRlc2NyaWJlZCBpblxyXG4gICAgICAgICAgLy8gICAxNS4zLjQuNS4zLlxyXG4gICAgICAgICAgdmFyIGJvdW5kO1xyXG4gICAgICAgICAgdmFyIGJpbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkge1xyXG4gICAgICAgICAgICAgICAgICAvLyAxNS4zLjQuNS4yIFtbQ29uc3RydWN0XV1cclxuICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsXHJcbiAgICAgICAgICAgICAgICAgIC8vIEYgdGhhdCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgYmluZCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhXHJcbiAgICAgICAgICAgICAgICAgIC8vIGxpc3Qgb2YgYXJndW1lbnRzIEV4dHJhQXJncywgdGhlIGZvbGxvd2luZyBzdGVwcyBhcmUgdGFrZW46XHJcbiAgICAgICAgICAgICAgICAgIC8vIDEuIExldCB0YXJnZXQgYmUgdGhlIHZhbHVlIG9mIEYncyBbW1RhcmdldEZ1bmN0aW9uXV1cclxuICAgICAgICAgICAgICAgICAgLy8gICBpbnRlcm5hbCBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgLy8gMi4gSWYgdGFyZ2V0IGhhcyBubyBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCwgYVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIFR5cGVFcnJvciBleGNlcHRpb24gaXMgdGhyb3duLlxyXG4gICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIGxpc3QgYm91bmRBcmdzIGluIHRoZSBzYW1lIG9yZGVyIGZvbGxvd2VkIGJ5IHRoZSBzYW1lXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgdmFsdWVzIGFzIHRoZSBsaXN0IEV4dHJhQXJncyBpbiB0aGUgc2FtZSBvcmRlci5cclxuICAgICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDb25zdHJ1Y3RdXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIG1ldGhvZCBvZiB0YXJnZXQgcHJvdmlkaW5nIGFyZ3MgYXMgdGhlIGFyZ3VtZW50cy5cclxuXHJcbiAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB0YXJnZXQuYXBwbHkoXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYXJyYXlfY29uY2F0LmNhbGwoYXJncywgYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMpKVxyXG4gICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoJE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjEgW1tDYWxsXV1cclxuICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kIG9mIGEgZnVuY3Rpb24gb2JqZWN0LCBGLFxyXG4gICAgICAgICAgICAgICAgICAvLyB3aGljaCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgYmluZCBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhXHJcbiAgICAgICAgICAgICAgICAgIC8vIHRoaXMgdmFsdWUgYW5kIGEgbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nXHJcbiAgICAgICAgICAgICAgICAgIC8vIHN0ZXBzIGFyZSB0YWtlbjpcclxuICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IGJvdW5kQXJncyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRBcmdzXV0gaW50ZXJuYWxcclxuICAgICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgLy8gMi4gTGV0IGJvdW5kVGhpcyBiZSB0aGUgdmFsdWUgb2YgRidzIFtbQm91bmRUaGlzXV0gaW50ZXJuYWxcclxuICAgICAgICAgICAgICAgICAgLy8gICBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgLy8gMy4gTGV0IHRhcmdldCBiZSB0aGUgdmFsdWUgb2YgRidzIFtbVGFyZ2V0RnVuY3Rpb25dXSBpbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAvLyA0LiBMZXQgYXJncyBiZSBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIHNhbWUgdmFsdWVzIGFzIHRoZVxyXG4gICAgICAgICAgICAgICAgICAvLyAgIGxpc3QgYm91bmRBcmdzIGluIHRoZSBzYW1lIG9yZGVyIGZvbGxvd2VkIGJ5IHRoZSBzYW1lXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgdmFsdWVzIGFzIHRoZSBsaXN0IEV4dHJhQXJncyBpbiB0aGUgc2FtZSBvcmRlci5cclxuICAgICAgICAgICAgICAgICAgLy8gNS4gUmV0dXJuIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgW1tDYWxsXV0gaW50ZXJuYWwgbWV0aG9kXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgb2YgdGFyZ2V0IHByb3ZpZGluZyBib3VuZFRoaXMgYXMgdGhlIHRoaXMgdmFsdWUgYW5kXHJcbiAgICAgICAgICAgICAgICAgIC8vICAgcHJvdmlkaW5nIGFyZ3MgYXMgdGhlIGFyZ3VtZW50cy5cclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIGVxdWl2OiB0YXJnZXQuY2FsbCh0aGlzLCAuLi5ib3VuZEFyZ3MsIC4uLmFyZ3MpXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQuYXBwbHkoXHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGF0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgYXJyYXlfY29uY2F0LmNhbGwoYXJncywgYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMpKVxyXG4gICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAvLyAxNS4gSWYgdGhlIFtbQ2xhc3NdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBUYXJnZXQgaXMgXCJGdW5jdGlvblwiLCB0aGVuXHJcbiAgICAgICAgICAvLyAgICAgYS4gTGV0IEwgYmUgdGhlIGxlbmd0aCBwcm9wZXJ0eSBvZiBUYXJnZXQgbWludXMgdGhlIGxlbmd0aCBvZiBBLlxyXG4gICAgICAgICAgLy8gICAgIGIuIFNldCB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIGVpdGhlciAwIG9yIEwsIHdoaWNoZXZlciBpc1xyXG4gICAgICAgICAgLy8gICAgICAgbGFyZ2VyLlxyXG4gICAgICAgICAgLy8gMTYuIEVsc2Ugc2V0IHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gMC5cclxuXHJcbiAgICAgICAgICB2YXIgYm91bmRMZW5ndGggPSBtYXgoMCwgdGFyZ2V0Lmxlbmd0aCAtIGFyZ3MubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAvLyAxNy4gU2V0IHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gdGhlIHZhbHVlc1xyXG4gICAgICAgICAgLy8gICBzcGVjaWZpZWQgaW4gMTUuMy41LjEuXHJcbiAgICAgICAgICB2YXIgYm91bmRBcmdzID0gW107XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvdW5kTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICBhcnJheV9wdXNoLmNhbGwoYm91bmRBcmdzLCAnJCcgKyBpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBYWFggQnVpbGQgYSBkeW5hbWljIGZ1bmN0aW9uIHdpdGggZGVzaXJlZCBhbW91bnQgb2YgYXJndW1lbnRzIGlzIHRoZSBvbmx5XHJcbiAgICAgICAgICAvLyB3YXkgdG8gc2V0IHRoZSBsZW5ndGggcHJvcGVydHkgb2YgYSBmdW5jdGlvbi5cclxuICAgICAgICAgIC8vIEluIGVudmlyb25tZW50cyB3aGVyZSBDb250ZW50IFNlY3VyaXR5IFBvbGljaWVzIGVuYWJsZWQgKENocm9tZSBleHRlbnNpb25zLFxyXG4gICAgICAgICAgLy8gZm9yIGV4LikgYWxsIHVzZSBvZiBldmFsIG9yIEZ1bmN0aW9uIGNvc3RydWN0b3IgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cclxuICAgICAgICAgIC8vIEhvd2V2ZXIgaW4gYWxsIG9mIHRoZXNlIGVudmlyb25tZW50cyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBleGlzdHNcclxuICAgICAgICAgIC8vIGFuZCBzbyB0aGlzIGNvZGUgd2lsbCBuZXZlciBiZSBleGVjdXRlZC5cclxuICAgICAgICAgIGJvdW5kID0gRnVuY3Rpb24oJ2JpbmRlcicsICdyZXR1cm4gZnVuY3Rpb24gKCcgKyBib3VuZEFyZ3Muam9pbignLCcpICsgJyl7IHJldHVybiBiaW5kZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfScpKGJpbmRlcik7XHJcblxyXG4gICAgICAgICAgaWYgKHRhcmdldC5wcm90b3R5cGUpIHtcclxuICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSB0YXJnZXQucHJvdG90eXBlO1xyXG4gICAgICAgICAgICAgIGJvdW5kLnByb3RvdHlwZSA9IG5ldyBFbXB0eSgpO1xyXG4gICAgICAgICAgICAgIC8vIENsZWFuIHVwIGRhbmdsaW5nIHJlZmVyZW5jZXMuXHJcbiAgICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gbnVsbDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvLyAxOC4gU2V0IHRoZSBbW0V4dGVuc2libGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIHRvIHRydWUuXHJcblxyXG4gICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgLy8gMTkuIExldCB0aHJvd2VyIGJlIHRoZSBbW1Rocm93VHlwZUVycm9yXV0gZnVuY3Rpb24gT2JqZWN0ICgxMy4yLjMpLlxyXG4gICAgICAgICAgLy8gMjAuIENhbGwgdGhlIFtbRGVmaW5lT3duUHJvcGVydHldXSBpbnRlcm5hbCBtZXRob2Qgb2YgRiB3aXRoXHJcbiAgICAgICAgICAvLyAgIGFyZ3VtZW50cyBcImNhbGxlclwiLCBQcm9wZXJ0eURlc2NyaXB0b3Ige1tbR2V0XV06IHRocm93ZXIsIFtbU2V0XV06XHJcbiAgICAgICAgICAvLyAgIHRocm93ZXIsIFtbRW51bWVyYWJsZV1dOiBmYWxzZSwgW1tDb25maWd1cmFibGVdXTogZmFsc2V9LCBhbmRcclxuICAgICAgICAgIC8vICAgZmFsc2UuXHJcbiAgICAgICAgICAvLyAyMS4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcclxuICAgICAgICAgIC8vICAgYXJndW1lbnRzIFwiYXJndW1lbnRzXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlcixcclxuICAgICAgICAgIC8vICAgW1tTZXRdXTogdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sXHJcbiAgICAgICAgICAvLyAgIGFuZCBmYWxzZS5cclxuXHJcbiAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAvLyBOT1RFIEZ1bmN0aW9uIG9iamVjdHMgY3JlYXRlZCB1c2luZyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBkbyBub3RcclxuICAgICAgICAgIC8vIGhhdmUgYSBwcm90b3R5cGUgcHJvcGVydHkgb3IgdGhlIFtbQ29kZV1dLCBbW0Zvcm1hbFBhcmFtZXRlcnNdXSwgYW5kXHJcbiAgICAgICAgICAvLyBbW1Njb3BlXV0gaW50ZXJuYWwgcHJvcGVydGllcy5cclxuICAgICAgICAgIC8vIFhYWCBjYW4ndCBkZWxldGUgcHJvdG90eXBlIGluIHB1cmUtanMuXHJcblxyXG4gICAgICAgICAgLy8gMjIuIFJldHVybiBGLlxyXG4gICAgICAgICAgcmV0dXJuIGJvdW5kO1xyXG4gICAgICB9XHJcbiAgfSk7XHJcbn0pXHJcbi5jYWxsKCdvYmplY3QnID09PSB0eXBlb2Ygd2luZG93ICYmIHdpbmRvdyB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIHNlbGYgJiYgc2VsZiB8fCAnb2JqZWN0JyA9PT0gdHlwZW9mIGdsb2JhbCAmJiBnbG9iYWwgfHwge30pO1xyXG4iLCIoZnVuY3Rpb24odW5kZWZpbmVkKSB7XHJcblxyXG4vLyBEZXRlY3Rpb24gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vRmluYW5jaWFsLVRpbWVzL3BvbHlmaWxsLXNlcnZpY2UvYmxvYi9tYXN0ZXIvcGFja2FnZXMvcG9seWZpbGwtbGlicmFyeS9wb2x5ZmlsbHMvT2JqZWN0L2RlZmluZVByb3BlcnR5L2RldGVjdC5qc1xyXG52YXIgZGV0ZWN0ID0gKFxyXG4gIC8vIEluIElFOCwgZGVmaW5lUHJvcGVydHkgY291bGQgb25seSBhY3Qgb24gRE9NIGVsZW1lbnRzLCBzbyBmdWxsIHN1cHBvcnRcclxuICAvLyBmb3IgdGhlIGZlYXR1cmUgcmVxdWlyZXMgdGhlIGFiaWxpdHkgdG8gc2V0IGEgcHJvcGVydHkgb24gYW4gYXJiaXRyYXJ5IG9iamVjdFxyXG4gICdkZWZpbmVQcm9wZXJ0eScgaW4gT2JqZWN0ICYmIChmdW5jdGlvbigpIHtcclxuICBcdHRyeSB7XHJcbiAgXHRcdHZhciBhID0ge307XHJcbiAgXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhLCAndGVzdCcsIHt2YWx1ZTo0Mn0pO1xyXG4gIFx0XHRyZXR1cm4gdHJ1ZTtcclxuICBcdH0gY2F0Y2goZSkge1xyXG4gIFx0XHRyZXR1cm4gZmFsc2VcclxuICBcdH1cclxuICB9KCkpXHJcbilcclxuXHJcbmlmIChkZXRlY3QpIHJldHVyblxyXG5cclxuLy8gUG9seWZpbGwgZnJvbSBodHRwczovL2Nkbi5wb2x5ZmlsbC5pby92Mi9wb2x5ZmlsbC5qcz9mZWF0dXJlcz1PYmplY3QuZGVmaW5lUHJvcGVydHkmZmxhZ3M9YWx3YXlzXHJcbihmdW5jdGlvbiAobmF0aXZlRGVmaW5lUHJvcGVydHkpIHtcclxuXHJcblx0dmFyIHN1cHBvcnRzQWNjZXNzb3JzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSgnX19kZWZpbmVHZXR0ZXJfXycpO1xyXG5cdHZhciBFUlJfQUNDRVNTT1JTX05PVF9TVVBQT1JURUQgPSAnR2V0dGVycyAmIHNldHRlcnMgY2Fubm90IGJlIGRlZmluZWQgb24gdGhpcyBqYXZhc2NyaXB0IGVuZ2luZSc7XHJcblx0dmFyIEVSUl9WQUxVRV9BQ0NFU1NPUlMgPSAnQSBwcm9wZXJ0eSBjYW5ub3QgYm90aCBoYXZlIGFjY2Vzc29ycyBhbmQgYmUgd3JpdGFibGUgb3IgaGF2ZSBhIHZhbHVlJztcclxuXHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvcikge1xyXG5cclxuXHRcdC8vIFdoZXJlIG5hdGl2ZSBzdXBwb3J0IGV4aXN0cywgYXNzdW1lIGl0XHJcblx0XHRpZiAobmF0aXZlRGVmaW5lUHJvcGVydHkgJiYgKG9iamVjdCA9PT0gd2luZG93IHx8IG9iamVjdCA9PT0gZG9jdW1lbnQgfHwgb2JqZWN0ID09PSBFbGVtZW50LnByb3RvdHlwZSB8fCBvYmplY3QgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xyXG5cdFx0XHRyZXR1cm4gbmF0aXZlRGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwgZGVzY3JpcHRvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKG9iamVjdCA9PT0gbnVsbCB8fCAhKG9iamVjdCBpbnN0YW5jZW9mIE9iamVjdCB8fCB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JykpIHtcclxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmRlZmluZVByb3BlcnR5IGNhbGxlZCBvbiBub24tb2JqZWN0Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCEoZGVzY3JpcHRvciBpbnN0YW5jZW9mIE9iamVjdCkpIHtcclxuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignUHJvcGVydHkgZGVzY3JpcHRpb24gbXVzdCBiZSBhbiBvYmplY3QnKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgcHJvcGVydHlTdHJpbmcgPSBTdHJpbmcocHJvcGVydHkpO1xyXG5cdFx0dmFyIGhhc1ZhbHVlT3JXcml0YWJsZSA9ICd2YWx1ZScgaW4gZGVzY3JpcHRvciB8fCAnd3JpdGFibGUnIGluIGRlc2NyaXB0b3I7XHJcblx0XHR2YXIgZ2V0dGVyVHlwZSA9ICdnZXQnIGluIGRlc2NyaXB0b3IgJiYgdHlwZW9mIGRlc2NyaXB0b3IuZ2V0O1xyXG5cdFx0dmFyIHNldHRlclR5cGUgPSAnc2V0JyBpbiBkZXNjcmlwdG9yICYmIHR5cGVvZiBkZXNjcmlwdG9yLnNldDtcclxuXHJcblx0XHQvLyBoYW5kbGUgZGVzY3JpcHRvci5nZXRcclxuXHRcdGlmIChnZXR0ZXJUeXBlKSB7XHJcblx0XHRcdGlmIChnZXR0ZXJUeXBlICE9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignR2V0dGVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghc3VwcG9ydHNBY2Nlc3NvcnMpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGhhc1ZhbHVlT3JXcml0YWJsZSkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX1ZBTFVFX0FDQ0VTU09SUyk7XHJcblx0XHRcdH1cclxuXHRcdFx0T2JqZWN0Ll9fZGVmaW5lR2V0dGVyX18uY2FsbChvYmplY3QsIHByb3BlcnR5U3RyaW5nLCBkZXNjcmlwdG9yLmdldCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRvYmplY3RbcHJvcGVydHlTdHJpbmddID0gZGVzY3JpcHRvci52YWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBoYW5kbGUgZGVzY3JpcHRvci5zZXRcclxuXHRcdGlmIChzZXR0ZXJUeXBlKSB7XHJcblx0XHRcdGlmIChzZXR0ZXJUeXBlICE9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignU2V0dGVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghc3VwcG9ydHNBY2Nlc3NvcnMpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKEVSUl9BQ0NFU1NPUlNfTk9UX1NVUFBPUlRFRCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGhhc1ZhbHVlT3JXcml0YWJsZSkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoRVJSX1ZBTFVFX0FDQ0VTU09SUyk7XHJcblx0XHRcdH1cclxuXHRcdFx0T2JqZWN0Ll9fZGVmaW5lU2V0dGVyX18uY2FsbChvYmplY3QsIHByb3BlcnR5U3RyaW5nLCBkZXNjcmlwdG9yLnNldCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gT0sgdG8gZGVmaW5lIHZhbHVlIHVuY29uZGl0aW9uYWxseSAtIGlmIGEgZ2V0dGVyIGhhcyBiZWVuIHNwZWNpZmllZCBhcyB3ZWxsLCBhbiBlcnJvciB3b3VsZCBiZSB0aHJvd24gYWJvdmVcclxuXHRcdGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIHtcclxuXHRcdFx0b2JqZWN0W3Byb3BlcnR5U3RyaW5nXSA9IGRlc2NyaXB0b3IudmFsdWU7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG9iamVjdDtcclxuXHR9O1xyXG59KE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkpO1xyXG59KVxyXG4uY2FsbCgnb2JqZWN0JyA9PT0gdHlwZW9mIHdpbmRvdyAmJiB3aW5kb3cgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBzZWxmICYmIHNlbGYgfHwgJ29iamVjdCcgPT09IHR5cGVvZiBnbG9iYWwgJiYgZ2xvYmFsIHx8IHt9KTtcclxuIiwiLyogZXNsaW50LWRpc2FibGUgY29uc2lzdGVudC1yZXR1cm4gKi9cclxuLyogZXNsaW50LWRpc2FibGUgZnVuYy1uYW1lcyAqL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gIGlmICh0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIF9wYXJhbXMpIHtcclxuICAgIGNvbnN0IHBhcmFtcyA9IF9wYXJhbXMgfHwge1xyXG4gICAgICBidWJibGVzOiBmYWxzZSxcclxuICAgICAgY2FuY2VsYWJsZTogZmFsc2UsXHJcbiAgICAgIGRldGFpbDogbnVsbCxcclxuICAgIH07XHJcbiAgICBjb25zdCBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIkN1c3RvbUV2ZW50XCIpO1xyXG4gICAgZXZ0LmluaXRDdXN0b21FdmVudChcclxuICAgICAgZXZlbnQsXHJcbiAgICAgIHBhcmFtcy5idWJibGVzLFxyXG4gICAgICBwYXJhbXMuY2FuY2VsYWJsZSxcclxuICAgICAgcGFyYW1zLmRldGFpbFxyXG4gICAgKTtcclxuICAgIHJldHVybiBldnQ7XHJcbiAgfVxyXG5cclxuICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcclxufSkoKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBlbHByb3RvID0gd2luZG93LkhUTUxFbGVtZW50LnByb3RvdHlwZTtcclxuY29uc3QgSElEREVOID0gJ2hpZGRlbic7XHJcblxyXG5pZiAoIShISURERU4gaW4gZWxwcm90bykpIHtcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxwcm90bywgSElEREVOLCB7XHJcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKEhJRERFTik7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoSElEREVOLCAnJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoSElEREVOKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9KTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuY2xhc3NMaXN0IGFuZCBET01Ub2tlbkxpc3RcclxucmVxdWlyZSgnY2xhc3NsaXN0LXBvbHlmaWxsJyk7XHJcbi8vIHBvbHlmaWxscyBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZGVuXHJcbnJlcXVpcmUoJy4vZWxlbWVudC1oaWRkZW4nKTtcclxuXHJcbi8vIHBvbHlmaWxscyBOdW1iZXIuaXNOYU4oKVxyXG5yZXF1aXJlKFwiLi9udW1iZXItaXMtbmFuXCIpO1xyXG5cclxuLy8gcG9seWZpbGxzIEN1c3RvbUV2ZW50XHJcbnJlcXVpcmUoXCIuL2N1c3RvbS1ldmVudFwiKTtcclxuXHJcbnJlcXVpcmUoJ2NvcmUtanMvZm4vb2JqZWN0L2Fzc2lnbicpO1xyXG5yZXF1aXJlKCdjb3JlLWpzL2ZuL2FycmF5L2Zyb20nKTsiLCJOdW1iZXIuaXNOYU4gPVxyXG4gIE51bWJlci5pc05hTiB8fFxyXG4gIGZ1bmN0aW9uIGlzTmFOKGlucHV0KSB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXHJcbiAgICByZXR1cm4gdHlwZW9mIGlucHV0ID09PSBcIm51bWJlclwiICYmIGlucHV0ICE9PSBpbnB1dDtcclxuICB9O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChodG1sRG9jdW1lbnQgPSBkb2N1bWVudCkgPT4gaHRtbERvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiIsImNvbnN0IGFzc2lnbiA9IHJlcXVpcmUoXCJvYmplY3QtYXNzaWduXCIpO1xyXG5jb25zdCByZWNlcHRvciA9IHJlcXVpcmUoXCJyZWNlcHRvclwiKTtcclxuXHJcbi8qKlxyXG4gKiBAbmFtZSBzZXF1ZW5jZVxyXG4gKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBzZXEgYW4gYXJyYXkgb2YgZnVuY3Rpb25zXHJcbiAqIEByZXR1cm4geyBjbG9zdXJlIH0gY2FsbEhvb2tzXHJcbiAqL1xyXG4vLyBXZSB1c2UgYSBuYW1lZCBmdW5jdGlvbiBoZXJlIGJlY2F1c2Ugd2Ugd2FudCBpdCB0byBpbmhlcml0IGl0cyBsZXhpY2FsIHNjb3BlXHJcbi8vIGZyb20gdGhlIGJlaGF2aW9yIHByb3BzIG9iamVjdCwgbm90IGZyb20gdGhlIG1vZHVsZVxyXG5jb25zdCBzZXF1ZW5jZSA9ICguLi5zZXEpID0+XHJcbiAgZnVuY3Rpb24gY2FsbEhvb2tzKHRhcmdldCA9IGRvY3VtZW50LmJvZHkpIHtcclxuICAgIHNlcS5mb3JFYWNoKChtZXRob2QpID0+IHtcclxuICAgICAgaWYgKHR5cGVvZiB0aGlzW21ldGhvZF0gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIHRoaXNbbWV0aG9kXS5jYWxsKHRoaXMsIHRhcmdldCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4vKipcclxuICogQG5hbWUgYmVoYXZpb3JcclxuICogQHBhcmFtIHtvYmplY3R9IGV2ZW50c1xyXG4gKiBAcGFyYW0ge29iamVjdD99IHByb3BzXHJcbiAqIEByZXR1cm4ge3JlY2VwdG9yLmJlaGF2aW9yfVxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAoZXZlbnRzLCBwcm9wcykgPT5cclxuICByZWNlcHRvci5iZWhhdmlvcihcclxuICAgIGV2ZW50cyxcclxuICAgIGFzc2lnbihcclxuICAgICAge1xyXG4gICAgICAgIG9uOiBzZXF1ZW5jZShcImluaXRcIiwgXCJhZGRcIiksXHJcbiAgICAgICAgb2ZmOiBzZXF1ZW5jZShcInRlYXJkb3duXCIsIFwicmVtb3ZlXCIpLFxyXG4gICAgICB9LFxyXG4gICAgICBwcm9wc1xyXG4gICAgKVxyXG4gICk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubGV0IGJyZWFrcG9pbnRzID0ge1xyXG4gICd4cyc6IDAsXHJcbiAgJ3NtJzogNTc2LFxyXG4gICdtZCc6IDc2OCxcclxuICAnbGcnOiA5OTIsXHJcbiAgJ3hsJzogMTIwMFxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBicmVha3BvaW50cztcclxuIiwiLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzNcclxuZnVuY3Rpb24gaXNFbGVtZW50SW5WaWV3cG9ydCAoZWwsIHdpbj13aW5kb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY0VsPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xyXG4gIHZhciByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICByZWN0LnRvcCA+PSAwICYmXHJcbiAgICByZWN0LmxlZnQgPj0gMCAmJlxyXG4gICAgcmVjdC5ib3R0b20gPD0gKHdpbi5pbm5lckhlaWdodCB8fCBkb2NFbC5jbGllbnRIZWlnaHQpICYmXHJcbiAgICByZWN0LnJpZ2h0IDw9ICh3aW4uaW5uZXJXaWR0aCB8fCBkb2NFbC5jbGllbnRXaWR0aClcclxuICApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzRWxlbWVudEluVmlld3BvcnQ7XHJcbiIsIi8vIGlPUyBkZXRlY3Rpb24gZnJvbTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTAzOTg4NS8xNzc3MTBcclxuZnVuY3Rpb24gaXNJb3NEZXZpY2UoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCIgJiZcclxuICAgIChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oaVBvZHxpUGhvbmV8aVBhZCkvZykgfHxcclxuICAgICAgKG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gXCJNYWNJbnRlbFwiICYmIG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDEpKSAmJlxyXG4gICAgIXdpbmRvdy5NU1N0cmVhbVxyXG4gICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaXNJb3NEZXZpY2U7XHJcbiIsIi8qKlxyXG4gKiBAbmFtZSBpc0VsZW1lbnRcclxuICogQGRlc2MgcmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gYXJndW1lbnQgaXMgYSBET00gZWxlbWVudC5cclxuICogQHBhcmFtIHthbnl9IHZhbHVlXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAqL1xyXG5jb25zdCBpc0VsZW1lbnQgPSAodmFsdWUpID0+XHJcbiAgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlLm5vZGVUeXBlID09PSAxO1xyXG5cclxuLyoqXHJcbiAqIEBuYW1lIHNlbGVjdFxyXG4gKiBAZGVzYyBzZWxlY3RzIGVsZW1lbnRzIGZyb20gdGhlIERPTSBieSBjbGFzcyBzZWxlY3RvciBvciBJRCBzZWxlY3Rvci5cclxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gVGhlIHNlbGVjdG9yIHRvIHRyYXZlcnNlIHRoZSBET00gd2l0aC5cclxuICogQHBhcmFtIHtEb2N1bWVudHxIVE1MRWxlbWVudD99IGNvbnRleHQgLSBUaGUgY29udGV4dCB0byB0cmF2ZXJzZSB0aGUgRE9NXHJcbiAqICAgaW4uIElmIG5vdCBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gdGhlIGRvY3VtZW50LlxyXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudFtdfSAtIEFuIGFycmF5IG9mIERPTSBub2RlcyBvciBhbiBlbXB0eSBhcnJheS5cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gKHNlbGVjdG9yLCBjb250ZXh0KSA9PiB7XHJcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIikge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFjb250ZXh0IHx8ICFpc0VsZW1lbnQoY29udGV4dCkpIHtcclxuICAgIGNvbnRleHQgPSB3aW5kb3cuZG9jdW1lbnQ7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICB9XHJcblxyXG4gIGNvbnN0IHNlbGVjdGlvbiA9IGNvbnRleHQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHNlbGVjdGlvbik7XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuY29uc3QgRVhQQU5ERUQgPSAnYXJpYS1leHBhbmRlZCc7XHJcbmNvbnN0IENPTlRST0xTID0gJ2FyaWEtY29udHJvbHMnO1xyXG5jb25zdCBISURERU4gPSAnYXJpYS1oaWRkZW4nO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAoYnV0dG9uLCBleHBhbmRlZCkgPT4ge1xyXG5cclxuICBpZiAodHlwZW9mIGV4cGFuZGVkICE9PSAnYm9vbGVhbicpIHtcclxuICAgIGV4cGFuZGVkID0gYnV0dG9uLmdldEF0dHJpYnV0ZShFWFBBTkRFRCkgPT09ICdmYWxzZSc7XHJcbiAgfVxyXG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoRVhQQU5ERUQsIGV4cGFuZGVkKTtcclxuICBjb25zdCBpZCA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoQ09OVFJPTFMpO1xyXG4gIGNvbnN0IGNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gIGlmICghY29udHJvbHMpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcclxuICAgICAgJ05vIHRvZ2dsZSB0YXJnZXQgZm91bmQgd2l0aCBpZDogXCInICsgaWQgKyAnXCInXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29udHJvbHMuc2V0QXR0cmlidXRlKEhJRERFTiwgIWV4cGFuZGVkKTtcclxuICByZXR1cm4gZXhwYW5kZWQ7XHJcbn07XHJcbiJdfQ==
